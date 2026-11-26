import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-auth";
import { isSupabaseConfigured, normalizeIdentifierToEmail } from "@/lib/supabase/config";
import { createServiceRoleSupabase } from "@/lib/supabase/server";

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
      user: { id: data.user.id, username, email, role },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal membuat user baru." },
      { status: 500 },
    );
  }
}
