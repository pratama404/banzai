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
      { error: "Supabase belum dikonfigurasi. Setup Supabase dulu untuk menyimpan sub-kategori." },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const category_id = String(body.category_id || "").trim();
    const label = String(body.label || body.name || "").trim();

    if (!category_id || !label) {
      return NextResponse.json(
        { error: "Kategori induk dan nama sub-kategori wajib diisi." },
        { status: 400 },
      );
    }

    const adminDb = createServiceRoleSupabase();
    const { data: parentCat } = await adminDb
      .from("categories")
      .select("code, short")
      .eq("id", category_id)
      .maybeSingle();

    const { data: existing } = await adminDb
      .from("subcategories")
      .select("sort_order")
      .eq("category_id", category_id)
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;
    const id = `${category_id}-${slugify(label) || Date.now()}`;
    const code = parentCat?.code ? `${parentCat.code}.${nextOrder}` : `${nextOrder}`;

    const { data, error } = await adminDb
      .from("subcategories")
      .insert({
        id,
        category_id,
        code,
        name: label,
        label,
        short: parentCat?.short || "",
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, subcategory: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal menambah sub-kategori." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Akses ditolak (khusus Admin)." }, { status: 403 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const id = String(body.id || "").trim();
    const label = String(body.label || body.name || "").trim();

    if (!id || !label) {
      return NextResponse.json({ error: "ID dan nama sub-kategori wajib diisi." }, { status: 400 });
    }

    const adminDb = createServiceRoleSupabase();
    const { data: prev } = await adminDb
      .from("subcategories")
      .select("name")
      .eq("id", id)
      .maybeSingle();

    const { error } = await adminDb
      .from("subcategories")
      .update({
        name: label,
        label,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Keep linked materials' subject column in sync
    if (prev?.name && prev.name !== label) {
      await adminDb
        .from("materials")
        .update({ subject: label, chapter: label.toUpperCase() })
        .eq("subcategory_id", id);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal memperbarui sub-kategori." },
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
      return NextResponse.json({ error: "ID sub-kategori wajib diisi." }, { status: 400 });
    }

    const adminDb = createServiceRoleSupabase();
    const { error } = await adminDb.from("subcategories").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal menghapus sub-kategori." },
      { status: 500 },
    );
  }
}
