import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      await supabase.auth.signOut();
    } catch {
      // Ignore if session already expired
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete("pwo_session");
  return res;
}
