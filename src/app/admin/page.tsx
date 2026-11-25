import AdminDashboard from "@/components/AdminDashboard";
import { loadCatalog } from "@/lib/catalog-server";

export default async function AdminPage() {
  const { categories, materials, supabaseReady } = await loadCatalog();

  return (
    <AdminDashboard
      initialCategories={categories}
      initialMaterials={materials}
      supabaseReady={supabaseReady}
    />
  );
}
