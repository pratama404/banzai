"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Iconify from "@/components/Iconify";
import type { Category, MaterialItem } from "@/data/catalog";

interface AdminDashboardProps {
  initialCategories: Category[];
  initialMaterials: MaterialItem[];
  supabaseReady: boolean;
}

type AdminTab = "materials" | "categories" | "users";

export default function AdminDashboard({
  initialCategories,
  initialMaterials,
  supabaseReady,
}: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("materials");
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [materials, setMaterials] = useState<MaterialItem[]>(initialMaterials);
  const [statusMsg, setStatusMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  // ── Filter state for Materials tab ──
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [filterText, setFilterText] = useState("");

  // ── Add Material form state ──
  const [matCatId, setMatCatId] = useState<string>(initialCategories[0]?.id || "");
  const selectedMatCategory = useMemo(
    () => categories.find((c) => c.id === matCatId),
    [categories, matCatId],
  );
  const [matSubId, setMatSubId] = useState<string>(
    initialCategories[0]?.subcategories?.[0]?.id || "",
  );
  const [matTitle, setMatTitle] = useState("");
  const [matModuleUrl, setMatModuleUrl] = useState("");
  const [matLessonsUrl, setMatLessonsUrl] = useState("");
  const [savingMat, setSavingMat] = useState(false);

  // ── Add Category form state ──
  const [catName, setCatName] = useState("");
  const [catShort, setCatShort] = useState("");
  const [catIcon, setCatIcon] = useState("game-icons:bookshelf");
  const [catDesc, setCatDesc] = useState("");

  // ── Add Subcategory form state ──
  const [subParentId, setSubParentId] = useState<string>(initialCategories[0]?.id || "");
  const [subLabel, setSubLabel] = useState("");

  // ── Add User form state ──
  const [newIdentifier, setNewIdentifier] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"user" | "admin">("user");
  const [creatingUser, setCreatingUser] = useState(false);

  const filteredMaterials = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return materials.filter((item) => {
      if (filterCategory !== "ALL") {
        const cat = categories.find((c) => c.id === filterCategory);
        if (cat) {
          const validSubjects = [
            cat.name,
            ...(cat.subcategories?.map((s) => s.name) || []),
          ];
          if (!validSubjects.includes(item.subject)) return false;
        }
      }
      if (!q) return true;
      return [item.subject, item.title, item.module].join(" ").toLowerCase().includes(q);
    });
  }, [materials, categories, filterCategory, filterText]);

  // ── MATERIAL CRUD ─────────────────────────────────────────
  async function handleAddMaterial(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);
    setSavingMat(true);
    try {
      const res = await fetch("/api/admin/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: matCatId,
          subcategory_id: matSubId || null,
          title: matTitle,
          module_url: matModuleUrl,
          lessons_url: matLessonsUrl,
        }),
      });
      const data = await res.json();
      setSavingMat(false);
      if (!res.ok) {
        setStatusMsg({ type: "err", text: data.error || "Gagal menambah materi." });
        return;
      }
      const added: MaterialItem = {
        id: data.material.id,
        subject: data.material.subject,
        module: data.material.module || "",
        chapter: data.material.chapter || "",
        type: data.material.type || "MODUL",
        title: data.material.title,
        links: {
          module: data.material.module_url || "",
          lessons: data.material.lessons_url || "",
        },
      };
      setMaterials((prev) => [added, ...prev]);
      setMatTitle("");
      setMatModuleUrl("");
      setMatLessonsUrl("");
      setStatusMsg({ type: "ok", text: `Materi "${added.title}" berhasil ditambahkan.` });
      router.refresh();
    } catch {
      setSavingMat(false);
      setStatusMsg({ type: "err", text: "Gagal menghubungi server." });
    }
  }

  async function handleSaveMaterial(item: MaterialItem) {
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/materials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          title: item.title,
          module_url: item.links.module || "",
          lessons_url: item.links.lessons || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: "err", text: data.error || "Gagal menyimpan materi." });
        return;
      }
      setStatusMsg({ type: "ok", text: `Perubahan disimpan: "${item.title}"` });
      router.refresh();
    } catch {
      setStatusMsg({ type: "err", text: "Gagal menghubungi server." });
    }
  }

  async function handleDeleteMaterial(item: MaterialItem) {
    if (!window.confirm(`Hapus materi "${item.title}" secara permanen?`)) return;
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/admin/materials?id=${encodeURIComponent(item.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: "err", text: data.error || "Gagal menghapus materi." });
        return;
      }
      setMaterials((prev) => prev.filter((m) => m.id !== item.id));
      setStatusMsg({ type: "ok", text: `Materi "${item.title}" berhasil dihapus.` });
      router.refresh();
    } catch {
      setStatusMsg({ type: "err", text: "Gagal menghubungi server." });
    }
  }

  // ── CATEGORY & SUBCATEGORY CRUD ───────────────────────────
  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: catName,
          short: catShort,
          icon: catIcon,
          description: catDesc,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: "err", text: data.error || "Gagal menambah kategori." });
        return;
      }
      const created: Category = {
        id: data.category.id,
        code: data.category.code || "",
        name: data.category.name,
        short: data.category.short || "",
        icon: data.category.icon || "game-icons:bookshelf",
        desc: data.category.description || "",
      };
      setCategories((prev) => [...prev, created]);
      setCatName("");
      setCatShort("");
      setCatDesc("");
      setStatusMsg({ type: "ok", text: `Kategori "${created.name}" berhasil ditambahkan.` });
      router.refresh();
    } catch {
      setStatusMsg({ type: "err", text: "Gagal menghubungi server." });
    }
  }

  async function handleDeleteCategory(cat: Category) {
    if (
      !window.confirm(
        `Hapus kategori "${cat.name}"? Semua sub-kategori dan materi di dalamnya juga akan terhapus.`,
      )
    ) {
      return;
    }
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(cat.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: "err", text: data.error || "Gagal menghapus kategori." });
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setStatusMsg({ type: "ok", text: `Kategori "${cat.name}" berhasil dihapus.` });
      router.refresh();
    } catch {
      setStatusMsg({ type: "err", text: "Gagal menghubungi server." });
    }
  }

  async function handleAddSubcategory(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: subParentId,
          label: subLabel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: "err", text: data.error || "Gagal menambah sub-kategori." });
        return;
      }
      const newSub = {
        id: data.subcategory.id,
        code: data.subcategory.code || "",
        name: data.subcategory.name,
        label: data.subcategory.label,
        short: data.subcategory.short || "",
      };
      setCategories((prev) =>
        prev.map((c) =>
          c.id === subParentId
            ? { ...c, subcategories: [...(c.subcategories || []), newSub] }
            : c,
        ),
      );
      setSubLabel("");
      setStatusMsg({
        type: "ok",
        text: `Sub-kategori "${newSub.label}" berhasil ditambahkan.`,
      });
      router.refresh();
    } catch {
      setStatusMsg({ type: "err", text: "Gagal menghubungi server." });
    }
  }

  async function handleDeleteSubcategory(parentId: string, subId: string, label: string) {
    if (!window.confirm(`Hapus sub-kategori "${label}"?`)) return;
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/admin/subcategories?id=${encodeURIComponent(subId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: "err", text: data.error || "Gagal menghapus sub-kategori." });
        return;
      }
      setCategories((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, subcategories: (c.subcategories || []).filter((s) => s.id !== subId) }
            : c,
        ),
      );
      setStatusMsg({ type: "ok", text: `Sub-kategori "${label}" berhasil dihapus.` });
      router.refresh();
    } catch {
      setStatusMsg({ type: "err", text: "Gagal menghubungi server." });
    }
  }

  // ── USER CREATE ───────────────────────────────────────────
  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);
    setCreatingUser(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: newIdentifier,
          fullName: newFullName,
          password: newPassword,
          role: newRole,
        }),
      });
      const data = await res.json();
      setCreatingUser(false);
      if (!res.ok) {
        setStatusMsg({ type: "err", text: data.error || "Gagal membuat akun." });
        return;
      }
      setStatusMsg({
        type: "ok",
        text: `Akun berhasil dibuat untuk "${data.user.username}" (${data.user.role.toUpperCase()}).`,
      });
      setNewIdentifier("");
      setNewFullName("");
      setNewPassword("");
    } catch {
      setCreatingUser(false);
      setStatusMsg({ type: "err", text: "Gagal menghubungi server." });
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="PWO Vademecum, beranda">
          <img className="brand-logo" src="/assets/logo/logo-pwo.png" alt="Logo PWO 2026" />
          <span className="brand-copy">
            <strong>PRINCIPAL WARFARE OFFICER</strong>
            <small>ADMINISTRATION · CLASS OF 2026</small>
          </span>
        </Link>
        <nav className="topbar-nav">
          <Link href="/" className="topbar-link">
            BERANDA
          </Link>
          <Link href="/materi" className="topbar-link">
            MATERI
          </Link>
          <Link href="/admin" className="topbar-link is-active">
            ADMIN
          </Link>
          <button type="button" className="topbar-button" onClick={handleLogout}>
            KELUAR
          </button>
        </nav>
      </header>

      <main className="admin-shell">
        <div className="admin-header">
          <div>
            <p className="eyebrow">COMMAND CENTER · PWO CLASS OF 2026</p>
            <h1>Admin &amp; Catalog Management</h1>
          </div>
          <span className="document-total">
            SUPABASE: {supabaseReady ? "CONNECTED" : "PREVIEW MODE (BELUM TERHUBUNG)"}
          </span>
        </div>

        {!supabaseReady ? (
          <div className="auth-alert">
            Mode Preview Aktif: Jalankan file <code>supabase/schema_and_seed.sql</code> di
            Supabase SQL Editor dan pasang <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, serta{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> untuk menyimpan seluruh perubahan CRUD secara
            permanen ke database.
          </div>
        ) : null}

        {statusMsg ? (
          <div
            className={`auth-alert${statusMsg.type === "ok" ? " auth-alert--ok" : ""}`}
            role="status"
          >
            {statusMsg.text}
          </div>
        ) : null}

        {/* Navigation Tabs */}
        <div className="admin-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "materials"}
            className={`admin-tab${activeTab === "materials" ? " is-active" : ""}`}
            onClick={() => setActiveTab("materials")}
          >
            KELOLA MATERI ({materials.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "categories"}
            className={`admin-tab${activeTab === "categories" ? " is-active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            KATEGORI &amp; SUB-KATEGORI ({categories.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "users"}
            className={`admin-tab${activeTab === "users" ? " is-active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            AKUN USER &amp; ADMIN
          </button>
        </div>

        {/* ════════ TAB 1: CRUD MATERI ════════ */}
        {activeTab === "materials" ? (
          <div className="admin-grid">
            <section className="admin-panel">
              <h2>Tambah Materi Baru</h2>
              <p>Tambahkan dokumen baru ke dalam kategori &amp; sub-kategori tertentu.</p>
              <form className="auth-form" onSubmit={handleAddMaterial}>
                <div className="auth-field">
                  <label htmlFor="mat-cat">KATEGORI UTAMA</label>
                  <select
                    id="mat-cat"
                    value={matCatId}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      setMatCatId(nextId);
                      const found = categories.find((c) => c.id === nextId);
                      setMatSubId(found?.subcategories?.[0]?.id || "");
                    }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.short})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMatCategory?.subcategories &&
                selectedMatCategory.subcategories.length > 0 ? (
                  <div className="auth-field">
                    <label htmlFor="mat-sub">SUB-KATEGORI</label>
                    <select
                      id="mat-sub"
                      value={matSubId}
                      onChange={(e) => setMatSubId(e.target.value)}
                    >
                      {selectedMatCategory.subcategories.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                <div className="auth-field">
                  <label htmlFor="mat-title">JUDUL MATERI</label>
                  <input
                    id="mat-title"
                    type="text"
                    required
                    placeholder="Contoh: Teori Radar"
                    value={matTitle}
                    onChange={(e) => setMatTitle(e.target.value)}
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="mat-mod-url">LINK MODULE (PI) — OPSIONAL</label>
                  <input
                    id="mat-mod-url"
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={matModuleUrl}
                    onChange={(e) => setMatModuleUrl(e.target.value)}
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="mat-les-url">LINK LESSONS — OPSIONAL</label>
                  <input
                    id="mat-les-url"
                    type="url"
                    placeholder="https://docs.google.com/..."
                    value={matLessonsUrl}
                    onChange={(e) => setMatLessonsUrl(e.target.value)}
                  />
                </div>

                <button className="auth-submit" type="submit" disabled={savingMat}>
                  {savingMat ? "MENYIMPAN..." : "TAMBAH MATERI +"}
                </button>
              </form>
            </section>

            <section className="admin-panel">
              <h2>Daftar Materi ({filteredMaterials.length})</h2>
              <p>Edit judul atau link Google Drive secara langsung, lalu klik SIMPAN.</p>

              <div className="admin-filter-row">
                <select
                  className="admin-input-inline"
                  style={{ maxWidth: 240 }}
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="ALL">SEMUA KATEGORI</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  className="admin-input-inline"
                  type="search"
                  placeholder="Cari judul atau sub-materi..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>SUB-MATERI</th>
                      <th>JUDUL</th>
                      <th>LINK MODULE (PI)</th>
                      <th>LINK LESSONS</th>
                      <th>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaterials.map((item) => (
                      <tr key={item.id}>
                        <td className="admin-cell-subject">{item.subject}</td>
                        <td>
                          <input
                            className="admin-input-inline"
                            value={item.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMaterials((prev) =>
                                prev.map((m) => (m.id === item.id ? { ...m, title: val } : m)),
                              );
                            }}
                          />
                        </td>
                        <td>
                          <input
                            className="admin-input-inline"
                            placeholder="https://drive.google.com/..."
                            value={item.links.module || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMaterials((prev) =>
                                prev.map((m) =>
                                  m.id === item.id
                                    ? { ...m, links: { ...m.links, module: val } }
                                    : m,
                                ),
                              );
                            }}
                          />
                        </td>
                        <td>
                          <input
                            className="admin-input-inline"
                            placeholder="https://docs.google.com/..."
                            value={item.links.lessons || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMaterials((prev) =>
                                prev.map((m) =>
                                  m.id === item.id
                                    ? { ...m, links: { ...m.links, lessons: val } }
                                    : m,
                                ),
                              );
                            }}
                          />
                        </td>
                        <td>
                          <div className="admin-row-actions">
                            <button
                              type="button"
                              className="admin-save-btn"
                              onClick={() => handleSaveMaterial(item)}
                            >
                              SIMPAN
                            </button>
                            <button
                              type="button"
                              className="admin-del-btn"
                              onClick={() => handleDeleteMaterial(item)}
                            >
                              HAPUS
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        ) : null}

        {/* ════════ TAB 2: CRUD KATEGORI & SUB-KATEGORI ════════ */}
        {activeTab === "categories" ? (
          <div className="admin-grid">
            <div style={{ display: "grid", gap: 20 }}>
              <section className="admin-panel">
                <h2>Tambah Kategori Baru</h2>
                <p>Buat kategori peperangan / bidang referensi utama baru.</p>
                <form className="auth-form" onSubmit={handleAddCategory}>
                  <div className="auth-field">
                    <label htmlFor="cat-name">NAMA KATEGORI</label>
                    <input
                      id="cat-name"
                      type="text"
                      required
                      placeholder="Contoh: AMPHIBIOUS WARFARE"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                    />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="cat-short">SINGKATAN (SHORT)</label>
                    <input
                      id="cat-short"
                      type="text"
                      required
                      placeholder="Contoh: AMW"
                      value={catShort}
                      onChange={(e) => setCatShort(e.target.value)}
                    />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="cat-icon">ICON ICONIFY</label>
                    <input
                      id="cat-icon"
                      type="text"
                      placeholder="game-icons:battleship"
                      value={catIcon}
                      onChange={(e) => setCatIcon(e.target.value)}
                    />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="cat-desc">DESKRIPSI SINGKAT</label>
                    <input
                      id="cat-desc"
                      type="text"
                      placeholder="Deskripsi singkat bidang..."
                      value={catDesc}
                      onChange={(e) => setCatDesc(e.target.value)}
                    />
                  </div>
                  <button className="auth-submit" type="submit">
                    TAMBAH KATEGORI +
                  </button>
                </form>
              </section>

              <section className="admin-panel">
                <h2>Tambah Sub-Kategori Baru</h2>
                <p>Tambahkan sub-materi di bawah kategori utama yang sudah ada.</p>
                <form className="auth-form" onSubmit={handleAddSubcategory}>
                  <div className="auth-field">
                    <label htmlFor="sub-parent">KATEGORI INDUK</label>
                    <select
                      id="sub-parent"
                      value={subParentId}
                      onChange={(e) => setSubParentId(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="auth-field">
                    <label htmlFor="sub-label">NAMA SUB-KATEGORI</label>
                    <input
                      id="sub-label"
                      type="text"
                      required
                      placeholder="Contoh: Taktik Operasi Amfibi"
                      value={subLabel}
                      onChange={(e) => setSubLabel(e.target.value)}
                    />
                  </div>
                  <button className="auth-submit" type="submit">
                    TAMBAH SUB-KATEGORI +
                  </button>
                </form>
              </section>
            </div>

            <section className="admin-panel">
              <h2>Struktur Kategori &amp; Sub-Kategori</h2>
              <p>Seluruh kategori utama beserta sub-materi yang tampil di sidebar `/materi`.</p>

              <div className="admin-cat-list">
                {categories.map((cat) => (
                  <div key={cat.id} className="admin-cat-card">
                    <div className="admin-cat-card__head">
                      <div className="admin-cat-card__title">
                        <span className="category-icon" aria-hidden="true">
                          <Iconify icon={cat.icon} />
                        </span>
                        <strong>{cat.name}</strong>
                        <span className="admin-badge">{cat.short}</span>
                      </div>
                      <button
                        type="button"
                        className="admin-del-btn"
                        onClick={() => handleDeleteCategory(cat)}
                      >
                        HAPUS KATEGORI
                      </button>
                    </div>

                    {cat.subcategories && cat.subcategories.length > 0 ? (
                      <ul className="admin-sub-list">
                        {cat.subcategories.map((sub) => (
                          <li key={sub.id} className="admin-sub-item">
                            <span>↳ {sub.label}</span>
                            <button
                              type="button"
                              className="admin-del-btn admin-del-btn--sm"
                              onClick={() =>
                                handleDeleteSubcategory(cat.id, sub.id, sub.label)
                              }
                            >
                              HAPUS
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="admin-sub-empty">Tanpa sub-kategori (materi langsung di kategori ini)</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {/* ════════ TAB 3: AKUN USER & ADMIN ════════ */}
        {activeTab === "users" ? (
          <div style={{ maxWidth: 480 }}>
            <section className="admin-panel">
              <h2>Buat Akun Tetap</h2>
              <p>
                Tambahkan akun login tetap (username/email + password) untuk Perwira Siswa atau
                Admin.
              </p>
              <form className="auth-form" onSubmit={handleCreateUser}>
                <div className="auth-field">
                  <label htmlFor="new-id">USERNAME / EMAIL</label>
                  <input
                    id="new-id"
                    type="text"
                    required
                    placeholder="Contoh: siswa01 atau perwira@email.com"
                    value={newIdentifier}
                    onChange={(e) => setNewIdentifier(e.target.value)}
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="new-name">NAMA / PANGKAT (OPSIONAL)</label>
                  <input
                    id="new-name"
                    type="text"
                    placeholder="Contoh: Mayor Laut (P) ..."
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="new-pass">PASSWORD TETAP</label>
                  <input
                    id="new-pass"
                    type="text"
                    required
                    minLength={6}
                    placeholder="Minimal 6 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="new-role">ROLE AKSES</label>
                  <select
                    id="new-role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as "user" | "admin")}
                  >
                    <option value="user">USER (SISWA PWO)</option>
                    <option value="admin">ADMIN</option>
                  </select>
                </div>
                <button className="auth-submit" type="submit" disabled={creatingUser}>
                  {creatingUser ? "MEMBUAT AKUN..." : "BUAT AKUN USER +"}
                </button>
              </form>
            </section>
          </div>
        ) : null}
      </main>

      <footer className="footer">
        <span>E-REFERENCES · PWO CLASS OF 2026</span>
        <span>気迫 · 精撃 · 必勝</span>
      </footer>
    </>
  );
}
