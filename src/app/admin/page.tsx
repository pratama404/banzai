import { redirect } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";
import { assertAdmin } from "@/lib/admin-auth";
import { loadCatalog } from "@/lib/catalog-server";

export default async function AdminPage() {
  if (!(await assertAdmin())) {
    redirect("/admin/login");
  }

  const { categories, materials, supabaseReady } = await loadCatalog();

  return (
    <AdminDashboard
      initialCategories={categories}
      initialMaterials={materials}
      supabaseReady={supabaseReady}
    />
  );
}
