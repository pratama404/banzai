import MateriLibrary from "@/components/MateriLibrary";
import { getCurrentAuthUser } from "@/lib/admin-auth";
import { loadCatalog } from "@/lib/catalog-server";

interface MateriPageProps {
  searchParams: Promise<{ cat?: string }>;
}

export default async function MateriPage({ searchParams }: MateriPageProps) {
  const [params, session, { categories, materials }] = await Promise.all([
    searchParams,
    getCurrentAuthUser(),
    loadCatalog(),
  ]);

  return (
    <MateriLibrary
      categories={categories}
      materials={materials}
      initialCatParam={params.cat}
      userRole={session.role === "admin" ? "admin" : "user"}
    />
  );
}
