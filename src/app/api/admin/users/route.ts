import { NextResponse } from "next/server";
import { assertAdmin, getCurrentAuthUser } from "@/lib/admin-auth";
import { isSupabaseConfigured, normalizeIdentifierToEmail } from "@/lib/supabase/config";
import { createServiceRoleSupabase } from "@/lib/supabase/server";

export async function GET() {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Akses ditolak (khusus Admin)." }, { status: 403 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ users: [], currentUserId: null, supabaseReady: false });
  }

  try {
    const session = await getCurrentAuthUser();
    const adminAuth = createServiceRoleSupabase();

    const { data: authList, error: authError } = await adminAuth.auth.admin.listUsers({
      perPage: 200,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const profileMap = new Map<
      string,
      { username?: string; full_name?: string; role?: string }
    >();

    try {
      const { data: profiles } = await adminAuth
        .from("profiles")
        .select("id, username, full_name, role");
      if (profiles) {
        for (const p of profiles) {
          profileMap.set(String(p.id), {
            username: p.username || undefined,
            full_name: p.full_name || undefined,
            role: p.role || undefined,
          });
        }
      }
    } catch {
      // Fallback to auth metadata if profiles table is not accessible yet
    }

    const users = (authList?.users || [])
      .map((u) => {
        const profile = profileMap.get(u.id);
        const email = u.email || "";
        const username =
          profile?.username ||
          (u.user_metadata?.username as string) ||
          (email.includes("@") ? email.split("@")[0] : email);
        const full_name =
          profile?.full_name || (u.user_metadata?.full_name as string) || "";
        const role: "admin" | "user" =
          profile?.role === "admin" || u.app_metadata?.role === "admin"
            ? "admin"
            : "user";

        return {
          id: u.id,
          username,
          email,
          full_name,
          role,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at || null,
        };
      })
      .sort((a, b) => {
        if (a.role !== b.role) return a.role === "admin" ? -1 : 1;
        return a.username.localeCompare(b.username);
      });

    return NextResponse.json({
      users,
      currentUserId: session.userId,
      supabaseReady: true,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal memuat daftar user." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Akses ditolak (khusus Admin)." }, { status: 403 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Supabase belum dikonfigurasi. Siapkan project Supabase dan SUPABASE_SERVICE_ROLE_KEY terlebih dahulu.",
      },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const identifier = String(body.identifier || "").trim();
    const password = String(body.password || "");
    const fullName = String(body.fullName || "").trim();
    const role: "admin" | "user" = body.role === "admin" ? "admin" : "user";

    if (!identifier || password.length < 6) {
      return NextResponse.json(
        { error: "Masukkan username/email dan password minimal 6 karakter." },
        { status: 400 },
      );
    }

    const email = normalizeIdentifierToEmail(identifier);
    const username = identifier.includes("@") ? identifier.split("@")[0] : identifier;

    const adminAuth = createServiceRoleSupabase();
    const { data, error } = await adminAuth.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        full_name: fullName,
        role,
      },
      app_metadata: {
        role,
      },
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Gagal membuat akun user." },
        { status: 400 },
      );
    }

    await adminAuth.from("profiles").upsert({
      id: data.user.id,
      username,
      email,
      full_name: fullName,
      role,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: data.user.id,
        username,
        email,
        full_name: fullName,
        role,
        created_at: data.user.created_at,
        last_sign_in_at: null,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal membuat user baru." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Akses ditolak (khusus Admin)." }, { status: 403 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi." },
      { status: 400 },
    );
  }

  try {
    const session = await getCurrentAuthUser();
    const body = await request.json();
    const id = String(body.id || "").trim();
    const role: "admin" | "user" = body.role === "admin" ? "admin" : "user";
    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : undefined;
    const password =
      typeof body.password === "string" ? body.password.trim() : "";

    if (!id) {
      return NextResponse.json({ error: "ID user wajib diisi." }, { status: 400 });
    }

    if (session.userId && session.userId === id && role !== "admin") {
      return NextResponse.json(
        { error: "Anda tidak dapat menurunkan role akun Anda sendiri." },
        { status: 400 },
      );
    }

    if (password && password.length < 6) {
      return NextResponse.json(
        { error: "Password baru minimal 6 karakter." },
        { status: 400 },
      );
    }

    const adminAuth = createServiceRoleSupabase();
    const { data: existing, error: fetchErr } =
      await adminAuth.auth.admin.getUserById(id);
    if (fetchErr || !existing.user) {
      return NextResponse.json(
        { error: fetchErr?.message || "Akun user tidak ditemukan." },
        { status: 404 },
      );
    }

    const nextUserMeta = {
      ...(existing.user.user_metadata || {}),
      role,
      ...(fullName !== undefined ? { full_name: fullName } : {}),
    };
    const nextAppMeta = {
      ...(existing.user.app_metadata || {}),
      role,
    };

    const { error: updateErr } = await adminAuth.auth.admin.updateUserById(id, {
      ...(password ? { password } : {}),
      user_metadata: nextUserMeta,
      app_metadata: nextAppMeta,
    });

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 400 });
    }

    const email = existing.user.email || "";
    const username =
      (existing.user.user_metadata?.username as string) ||
      (email.includes("@") ? email.split("@")[0] : email);

    await adminAuth.from("profiles").upsert({
      id,
      username,
      email,
      full_name:
        fullName !== undefined
          ? fullName
          : (existing.user.user_metadata?.full_name as string) || "",
      role,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal memperbarui user." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Akses ditolak (khusus Admin)." }, { status: 403 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi." },
      { status: 400 },
    );
  }

  try {
    const session = await getCurrentAuthUser();
    const { searchParams } = new URL(request.url);
    const id = String(searchParams.get("id") || "").trim();

    if (!id) {
      return NextResponse.json({ error: "ID user wajib diisi." }, { status: 400 });
    }

    if (session.userId && session.userId === id) {
      return NextResponse.json(
        { error: "Anda tidak dapat menghapus akun yang sedang digunakan." },
        { status: 400 },
      );
    }

    const adminAuth = createServiceRoleSupabase();
    const { error } = await adminAuth.auth.admin.deleteUser(id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal menghapus user." },
      { status: 500 },
    );
  }
}
