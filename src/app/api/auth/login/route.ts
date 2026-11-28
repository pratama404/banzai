import { NextResponse } from "next/server";
import { isSupabaseConfigured, normalizeIdentifierToEmail } from "@/lib/supabase/config";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = String(body.identifier || "").trim();
    const password = String(body.password || "");
    const portal: "admin" | "user" = body.portal === "admin" ? "admin" : "user";

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Masukkan username/email dan password." },
        { status: 400 },
      );
    }

    // 1. If Supabase is configured, strictly authenticate against Supabase Auth
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabase();
      const email = normalizeIdentifierToEmail(identifier);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return NextResponse.json(
          { error: "Username/email atau password tidak valid." },
          { status: 401 },
        );
      }

      let role: "admin" | "user" =
        data.user.app_metadata?.role === "admin" ? "admin" : "user";

      if (role !== "admin") {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();
        if (profile?.role === "admin") role = "admin";
      }

      if (portal === "admin" && role !== "admin") {
        await supabase.auth.signOut();
        return NextResponse.json(
          {
            error:
              "Akun ini tidak memiliki hak akses Administrator. Silakan masuk melalui Login Perwira Siswa.",
          },
          { status: 403 },
        );
      }

      const res = NextResponse.json({ ok: true, role, mode: "supabase" });
      res.cookies.delete("pwo_session");
      return res;
    }

    // 2. Fallback fixed credentials (ONLY used before Supabase is configured)
    const adminUser = (process.env.PWO_ADMIN_USER || "admin").toLowerCase();
    const adminPass = process.env.PWO_ADMIN_PASSWORD || "pwo2026admin";
    const studentUser = (process.env.PWO_STUDENT_USER || "pwo2026").toLowerCase();
    const studentPass = process.env.PWO_STUDENT_PASSWORD || "banzai2026";

    const cleanId = identifier.toLowerCase();
    const cleanUsername = cleanId.includes("@") ? cleanId.split("@")[0] : cleanId;

    let matchedRole: "admin" | "user" | null = null;
    if ((cleanId === adminUser || cleanUsername === adminUser) && password === adminPass) {
      matchedRole = "admin";
    } else if (
      (cleanId === studentUser || cleanUsername === studentUser) &&
      password === studentPass
    ) {
      matchedRole = "user";
    }

    if (matchedRole) {
      if (portal === "admin" && matchedRole !== "admin") {
        return NextResponse.json(
          {
            error:
              "Akun ini tidak memiliki hak akses Administrator. Silakan masuk melalui Login Perwira Siswa.",
          },
          { status: 403 },
        );
      }
      const res = NextResponse.json({ ok: true, role: matchedRole, mode: "fallback" });
      res.cookies.set("pwo_session", matchedRole, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    return NextResponse.json(
      { error: "Username/email atau password tidak valid." },
      { status: 401 },
    );
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses login." },
      { status: 500 },
    );
  }
}
