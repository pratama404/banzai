import { CATEGORIES, MATERIALS, type Category, type MaterialItem, type Subcategory } from "@/data/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabase } from "@/lib/supabase/server";

export interface LoadedCatalog {
  categories: Category[];
  materials: MaterialItem[];
  supabaseReady: boolean;
}

export async function loadCatalog(): Promise<LoadedCatalog> {
  const supabaseReady = isSupabaseConfigured();
  let categories: Category[] = CATEGORIES;
  let materials: MaterialItem[] = MATERIALS;

  if (!supabaseReady) {
    return { categories, materials, supabaseReady };
  }

  try {
    const supabase = await createServerSupabase();

    const [catRes, subRes, matRes] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("subcategories").select("*").order("sort_order", { ascending: true }),
      supabase.from("materials").select("*").order("sort_order", { ascending: true }),
    ]);

    if (!catRes.error && catRes.data && catRes.data.length > 0) {
      const subsByCat = new Map<string, Subcategory[]>();
      if (!subRes.error && subRes.data) {
        for (const row of subRes.data) {
          const catId = String(row.category_id);
          const list = subsByCat.get(catId) || [];
          list.push({
            id: String(row.id),
            code: String(row.code || ""),
            name: String(row.name),
            label: String(row.label || row.name),
            short: String(row.short || ""),
          });
          subsByCat.set(catId, list);
        }
      }

      categories = catRes.data.map((row) => {
        const id = String(row.id);
        const subs = subsByCat.get(id);
        return {
          id,
          code: String(row.code || ""),
          name: String(row.name),
          short: String(row.short || ""),
          icon: String(row.icon || "game-icons:bookshelf"),
          desc: String(row.description || ""),
          ...(subs && subs.length > 0 ? { subcategories: subs } : {}),
        };
      });
    }

    if (!matRes.error && matRes.data && matRes.data.length > 0) {
      materials = matRes.data.map((row) => ({
        id: String(row.id),
        subject: String(row.subject),
        module: String(row.module || ""),
        chapter: String(row.chapter || ""),
        type: String(row.type || "MODUL"),
        title: String(row.title),
        links: {
          module: String(row.module_url || ""),
          lessons: String(row.lessons_url || ""),
        },
      }));
    }
  } catch {
    // Fallback to static catalog if tables are not seeded yet
  }

  return { categories, materials, supabaseReady };
}
