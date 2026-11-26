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
  let userRole: "admin" | "user" = "user";

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        if (user.app_metadata?.role === "admin") {
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
      // Keep default "user" role on error
    }
  } else {
    const cookieStore = await cookies();
    if (cookieStore.get("pwo_session")?.value === "admin") {
      userRole = "admin";
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
