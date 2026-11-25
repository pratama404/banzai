import { cookies } from "next/headers";
import MateriLibrary from "@/components/MateriLibrary";
import { loadCatalog } from "@/lib/catalog-server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabase } from "@/lib/supabase/server";

interface MateriPageProps {
  searchParams: Promise<{ cat?: string }>;
}

export default async function MateriPage({ searchParams }: MateriPageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  let userRole: "admin" | "user" =
    cookieStore.get("pwo_session")?.value === "admin" ? "admin" : "user";

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        if (
          user.app_metadata?.role === "admin" ||
          user.user_metadata?.role === "admin"
        ) {
          userRole = "admin";
        } else {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();
          if (profile?.role === "admin") userRole = "admin";
        }
      }
    } catch {
      // Fallback to cookie role
    }
  }

  const { categories, materials } = await loadCatalog();

  return (
    <MateriLibrary
      categories={categories}
      materials={materials}
      initialCatParam={params.cat}
      userRole={userRole}
    />
  );
}
