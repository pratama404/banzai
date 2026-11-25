import { NextResponse } from "next/server";
import { assertAdmin, slugify } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceRoleSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Akses ditolak (khusus Admin)." }, { status: 403 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Supabase belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, dan SUPABASE_SERVICE_ROLE_KEY untuk menambah materi ke database.",
      },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const category_id = String(body.category_id || "").trim();
    const subcategory_id = body.subcategory_id ? String(body.subcategory_id).trim() : null;
    const title = String(body.title || "").trim();
    const module_url = String(body.module_url || "").trim();
    const lessons_url = String(body.lessons_url || "").trim();

    if (!category_id || !title) {
      return NextResponse.json(
        { error: "Kategori dan judul materi wajib diisi." },
        { status: 400 },
      );
    }

    const adminDb = createServiceRoleSupabase();

    const { data: cat } = await adminDb
      .from("categories")
      .select("name")
      .eq("id", category_id)
      .maybeSingle();

    let subject = cat?.name || category_id;
    let chapter = subject.toUpperCase();

    if (subcategory_id) {
      const { data: sub } = await adminDb
        .from("subcategories")
        .select("name, label")
        .eq("id", subcategory_id)
        .maybeSingle();
      if (sub?.name) {
        subject = sub.name;
        chapter = (sub.label || sub.name).toUpperCase();
      }
    }

    const { data: existing } = await adminDb
      .from("materials")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;
    const id = `${subcategory_id || category_id}-${slugify(title).slice(0, 24) || "doc"}-${Date.now().toString(36)}`;

    const { data, error } = await adminDb
      .from("materials")
      .insert({
        id,
        category_id,
        subcategory_id,
        subject,
        module: cat?.name || "",
        chapter,
        type: "MODUL",
        title,
        module_url,
        lessons_url,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, material: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal menambah materi." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Akses ditolak (khusus Admin)." }, { status: 403 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Supabase belum dikonfigurasi. Tambahkan environment variables Supabase untuk menyimpan perubahan.",
      },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const id = String(body.id || "").trim();
    const title = String(body.title || "").trim();
    const module_url = String(body.module_url || "").trim();
    const lessons_url = String(body.lessons_url || "").trim();

    if (!id || !title) {
      return NextResponse.json({ error: "ID dan judul materi wajib diisi." }, { status: 400 });
    }

    const adminDb = createServiceRoleSupabase();
    const { error } = await adminDb
      .from("materials")
      .update({
        title,
        module_url,
        lessons_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal memperbarui materi." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Akses ditolak (khusus Admin)." }, { status: 403 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi." }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = String(searchParams.get("id") || "").trim();
    if (!id) {
      return NextResponse.json({ error: "ID materi wajib diisi." }, { status: 400 });
    }

    const adminDb = createServiceRoleSupabase();
    const { error } = await adminDb.from("materials").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal menghapus materi." },
      { status: 500 },
    );
  }
}
