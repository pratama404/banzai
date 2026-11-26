import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabase } from "@/lib/supabase/server";

export async function assertAdmin(): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    if (user.app_metadata?.role === "admin") {
      return true;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    return profile?.role === "admin";
  }

  const cookieStore = await cookies();
  return cookieStore.get("pwo_session")?.value === "admin";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
