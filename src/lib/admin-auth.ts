import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabase } from "@/lib/supabase/server";

export interface AuthSessionInfo {
  authenticated: boolean;
  role: "admin" | "user" | null;
  userId: string | null;
}

export async function getCurrentAuthUser(): Promise<AuthSessionInfo> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { authenticated: false, role: null, userId: null };
      }

      if (user.app_metadata?.role === "admin") {
        return { authenticated: true, role: "admin", userId: user.id };
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      return {
        authenticated: true,
        role: profile?.role === "admin" ? "admin" : "user",
        userId: user.id,
      };
    } catch {
      return { authenticated: false, role: null, userId: null };
    }
  }

  const cookieStore = await cookies();
  const fallback = cookieStore.get("pwo_session")?.value;
  if (fallback === "admin" || fallback === "user") {
    return { authenticated: true, role: fallback, userId: null };
  }
  return { authenticated: false, role: null, userId: null };
}

export async function assertAdmin(): Promise<boolean> {
  const session = await getCurrentAuthUser();
  return session.authenticated && session.role === "admin";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
