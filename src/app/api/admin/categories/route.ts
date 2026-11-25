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
      { error: "Supabase belum dikonfigurasi. Setup Supabase dulu untuk menyimpan kategori ke database." },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const name = String(body.name || "").trim().toUpperCase();
    const short = String(body.short || "").trim().toUpperCase();
    const icon = String(body.icon || "game-icons:bookshelf").trim();
    const description = String(body.description || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Nama kategori wajib diisi." }, { status: 400 });
    }

    const id = slugify(body.id ? String(body.id) : short || name) || `cat-${Date.now()}`;
    const adminDb = createServiceRoleSupabase();

    const { data: existing } = await adminDb
      .from("categories")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;

    const { data, error } = await adminDb
      .from("categories")
      .insert({
        id,
        code: String(nextOrder),
        name,
        short: short || name.slice(0, 4),
        icon,
        description,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, category: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal menambah kategori." },
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
    const name = String(body.name || "").trim().toUpperCase();
    const short = String(body.short || "").trim().toUpperCase();
    const icon = String(body.icon || "game-icons:bookshelf").trim();
    const description = String(body.description || "").trim();

    if (!id || !name) {
      return NextResponse.json({ error: "ID dan nama kategori wajib diisi." }, { status: 400 });
    }

    const adminDb = createServiceRoleSupabase();
    const { error } = await adminDb
      .from("categories")
      .update({
        name,
        short,
        icon,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal memperbarui kategori." },
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
      return NextResponse.json({ error: "ID kategori wajib diisi." }, { status: 400 });
    }

    const adminDb = createServiceRoleSupabase();
    const { error } = await adminDb.from("categories").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal menghapus kategori." },
      { status: 500 },
    );
  }
}
