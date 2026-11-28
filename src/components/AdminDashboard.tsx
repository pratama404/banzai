"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Iconify from "@/components/Iconify";
import type { Category, MaterialItem } from "@/data/catalog";

interface AdminDashboardProps {
  initialCategories: Category[];
  initialMaterials: MaterialItem[];
  supabaseReady: boolean;
}

interface ManagedUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: "admin" | "user";
  created_at?: string;
  last_sign_in_at?: string | null;
  draftPassword?: string;
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
  const [onlyMissingLinks, setOnlyMissingLinks] = useState(false);

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

  // ── Edit Category inline state ──
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatShort, setEditCatShort] = useState("");
  const [editCatIcon, setEditCatIcon] = useState("");
  const [editCatDesc, setEditCatDesc] = useState("");

  // ── Add Subcategory form state ──
  const [subParentId, setSubParentId] = useState<string>(initialCategories[0]?.id || "");
  const [subLabel, setSubLabel] = useState("");

  // ── Edit Subcategory inline state ──
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editSubLabel, setEditSubLabel] = useState("");

  // ── Add & Manage User state ──
  const [newIdentifier, setNewIdentifier] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"user" | "admin">("user");
  const [creatingUser, setCreatingUser] = useState(false);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── Summary statistics ──
  const stats = useMemo(() => {
    const total = materials.length;
    let missing = 0;
    let partial = 0;
    for (const m of materials) {
      const hasMod = Boolean(m.links?.module?.trim());
      const hasLes = Boolean(m.links?.lessons?.trim());
      if (!hasMod && !hasLes) missing++;
      else if (!hasMod || !hasLes) partial++;
    }
    return {
      total,
      linked: total - missing,
      missing,
      partial,
      categoriesCount: categories.length,
    };
  }, [materials, categories]);

  const filteredMaterials = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return materials.filter((item) => {
      if (onlyMissingLinks) {
        const hasMod = Boolean(item.links?.module?.trim());
        const hasLes = Boolean(item.links?.lessons?.trim());
        if (hasMod || hasLes) return false;
      }
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
  }, [materials, categories, filterCategory, filterText, onlyMissingLinks]);

  const fetchUsers = useCallback(async () => {
    if (!supabaseReady) return;
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(
          (data.users || []).map((u: ManagedUser) => ({ ...u, draftPassword: "" })),
        );
        setCurrentUserId(data.currentUserId || null);
        setUsersLoaded(true);
      } else {
        setStatusMsg({ type: "err", text: data.error || "Gagal memuat daftar user." });
      }
    } catch {
      setStatusMsg({ type: "err", text: "Gagal menghubungi server untuk daftar user." });
    } finally {
      setLoadingUsers(false);
    }
  }, [supabaseReady]);

  useEffect(() => {
    if (activeTab === "users" && supabaseReady && !usersLoaded) {
      fetchUsers();
    }
  }, [activeTab, supabaseReady, usersLoaded, fetchUsers]);

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

  function startEditCategory(cat: Category) {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
    setEditCatShort(cat.short);
    setEditCatIcon(cat.icon);
    setEditCatDesc(cat.desc);
  }

  async function handleSaveCategory(catId: string) {
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: catId,
          name: editCatName,
          short: editCatShort,
          icon: editCatIcon,
          description: editCatDesc,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: "err", text: data.error || "Gagal memperbarui kategori." });
        return;
      }
      const normalizedName = editCatName.trim().toUpperCase();
      const normalizedShort = editCatShort.trim().toUpperCase();
      setCategories((prev) =>
        prev.map((c) =>
          c.id === catId
            ? {
                ...c,
                name: normalizedName,
                short: normalizedShort,
                icon: editCatIcon.trim() || c.icon,
                desc: editCatDesc.trim(),
              }
            : c,
        ),
      );
      setEditingCatId(null);
      setStatusMsg({ type: "ok", text: `Kategori "${normalizedName}" berhasil diperbarui.` });
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

  async function handleSaveSubcategory(parentId: string, subId: string, oldName: string) {
    const trimmed = editSubLabel.trim();
    if (!trimmed) return;
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/subcategories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: subId,
          label: trimmed,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: "err", text: data.error || "Gagal memperbarui sub-kategori." });
        return;
      }
      setCategories((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? {
                ...c,
                subcategories: (c.subcategories || []).map((s) =>
                  s.id === subId ? { ...s, name: trimmed, label: trimmed } : s,
                ),
              }
            : c,
        ),
      );
      if (oldName !== trimmed) {
        setMaterials((prev) =>
          prev.map((m) => (m.subject === oldName ? { ...m, subject: trimmed } : m)),
        );
      }
      setEditingSubId(null);
      setStatusMsg({ type: "ok", text: `Sub-kategori "${trimmed}" berhasil diperbarui.` });
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

  // ── USER MANAGEMENT CRUD ──────────────────────────────────
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
      setUsers((prev) => [...prev, { ...data.user, draftPassword: "" }]);
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

  async function handleUpdateUser(u: ManagedUser) {
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: u.id,
          role: u.role,
          fullName: u.full_name,
          password: u.draftPassword || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: "err", text: data.error || "Gagal memperbarui akun." });
        return;
      }
      setUsers((prev) =>
        prev.map((row) => (row.id === u.id ? { ...row, draftPassword: "" } : row)),
      );
      setStatusMsg({
        type: "ok",
        text: `Akun "${u.username}" diperbarui${u.draftPassword ? " (termasuk password baru)" : ""}.`,
      });
    } catch {
      setStatusMsg({ type: "err", text: "Gagal menghubungi server." });
    }
  }

  async function handleDeleteUser(u: ManagedUser) {
    if (!window.confirm(`Hapus akun "${u.username}" (${u.email}) secara permanen?`)) return;
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(u.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ type: "err", text: data.error || "Gagal menghapus akun." });
        return;
      }
      setUsers((prev) => prev.filter((row) => row.id !== u.id));
      setStatusMsg({ type: "ok", text: `Akun "${u.username}" berhasil dihapus.` });
    } catch {
      setStatusMsg({ type: "err", text: "Gagal menghubungi server." });
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const activeTabLabel =
    activeTab === "materials"
      ? "Kelola Materi"
      : activeTab === "categories"
        ? "Kategori & Sub-Kategori"
        : "Akun User & Admin";

  return (
    <div className="admin-layout">
      {/* ══════ DEDICATED ADMIN SIDEBAR (SEPARATE FROM USER/LANDING NAVBAR) ══════ */}
      <aside className={`admin-sidebar${mobileMenuOpen ? " is-open" : ""}`} aria-label="Navigasi Admin">
        <div className="admin-sidebar__brand">
          <img src="/assets/logo/logo-pwo.png" alt="Logo PWO 2026" />
          <div>
            <strong>COMMAND CENTER</strong>
            <span>ADMIN CONSOLE · PWO 2026</span>
          </div>
        </div>

        <p className="admin-sidebar__section">MANAJEMEN</p>
        <nav className="admin-sidebar__nav" role="tablist" aria-orientation="vertical">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "materials"}
            className={`admin-nav-item${activeTab === "materials" ? " is-active" : ""}`}
            onClick={() => {
              setActiveTab("materials");
              setMobileMenuOpen(false);
            }}
          >
            <Iconify icon="game-icons:bookshelf" />
            <span>KELOLA MATERI</span>
            <em className="admin-nav-count">{materials.length}</em>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "categories"}
            className={`admin-nav-item${activeTab === "categories" ? " is-active" : ""}`}
            onClick={() => {
              setActiveTab("categories");
              setMobileMenuOpen(false);
            }}
          >
            <Iconify icon="game-icons:crossed-swords" />
            <span>KATEGORI &amp; SUB</span>
            <em className="admin-nav-count">{categories.length}</em>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "users"}
            className={`admin-nav-item${activeTab === "users" ? " is-active" : ""}`}
            onClick={() => {
              setActiveTab("users");
              setMobileMenuOpen(false);
            }}
          >
            <Iconify icon="game-icons:radar-dish" />
            <span>AKUN USER &amp; ADMIN</span>
            {usersLoaded ? <em className="admin-nav-count">{users.length}</em> : null}
          </button>
        </nav>

        <p className="admin-sidebar__section">PRATINJAU SITUS</p>
        <div className="admin-sidebar__links">
          <Link href="/materi" target="_blank" className="admin-ext-link">
            <span>Buka E-References</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/" target="_blank" className="admin-ext-link">
            <span>Buka Landing Page</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="admin-sidebar__footer">
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            KELUAR COMMAND CENTER
          </button>
        </div>
      </aside>

      {mobileMenuOpen ? (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      {/* ══════ DEDICATED ADMIN MAIN WORKSPACE ══════ */}
      <div className="admin-content-col">
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button
              type="button"
              className="admin-mobile-toggle"
              aria-label="Toggle menu admin"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              ☰
            </button>
            <div className="admin-breadcrumb">
              <span>ADMIN</span>
              <span aria-hidden="true">/</span>
              <strong>{activeTabLabel.toUpperCase()}</strong>
            </div>
          </div>

          <div className="admin-topbar__right">
            <span
              className={`admin-status-pill${supabaseReady ? " is-online" : ""}`}
            >
              <i aria-hidden="true" />
              {supabaseReady ? "SUPABASE CONNECTED" : "PREVIEW MODE"}
            </span>
          </div>
        </header>

        <main className="admin-shell">
          <div className="admin-header">
            <div>
              <p className="eyebrow">COMMAND CENTER · PWO CLASS OF 2026</p>
              <h1>{activeTabLabel}</h1>
            </div>
          </div>

          {/* Summary Stats */}
          <section className="admin-stats-bar" aria-label="Ringkasan katalog">
            <div className="admin-stat-card">
              <span className="admin-stat-card__label">TOTAL MATERI</span>
              <strong className="admin-stat-card__value">{stats.total}</strong>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__label">TERTAUT LINK</span>
              <strong className="admin-stat-card__value admin-stat-card__value--ok">
                {stats.linked}
              </strong>
            </div>
            <button
              type="button"
              className={`admin-stat-card admin-stat-card--action${
                onlyMissingLinks && activeTab === "materials" ? " is-active" : ""
              }`}
              onClick={() => {
                setActiveTab("materials");
                setOnlyMissingLinks((prev) => !prev);
              }}
              title="Klik untuk memfilter materi yang belum memiliki link"
            >
              <span className="admin-stat-card__label">LINK KOSONG (KLIK FILTER)</span>
              <strong className="admin-stat-card__value admin-stat-card__value--warn">
                {stats.missing}
              </strong>
            </button>
            <div className="admin-stat-card">
              <span className="admin-stat-card__label">KATEGORI UTAMA</span>
              <strong className="admin-stat-card__value">{stats.categoriesCount}</strong>
            </div>
          </section>

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
                  style={{ flex: "1 1 200px" }}
                  type="search"
                  placeholder="Cari judul atau sub-materi..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
                <button
                  type="button"
                  className={`admin-toggle-chip${onlyMissingLinks ? " is-active" : ""}`}
                  onClick={() => setOnlyMissingLinks((prev) => !prev)}
                >
                  LINK KOSONG ({stats.missing})
                </button>
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
                {categories.map((cat) => {
                  const isEditingCat = editingCatId === cat.id;
                  return (
                    <div key={cat.id} className="admin-cat-card">
                      {isEditingCat ? (
                        <div className="admin-edit-form">
                          <div className="admin-edit-grid">
                            <input
                              className="admin-input-inline"
                              placeholder="Nama kategori"
                              value={editCatName}
                              onChange={(e) => setEditCatName(e.target.value)}
                            />
                            <input
                              className="admin-input-inline"
                              placeholder="Singkatan"
                              value={editCatShort}
                              onChange={(e) => setEditCatShort(e.target.value)}
                            />
                            <input
                              className="admin-input-inline"
                              placeholder="Icon Iconify"
                              value={editCatIcon}
                              onChange={(e) => setEditCatIcon(e.target.value)}
                            />
                            <input
                              className="admin-input-inline"
                              placeholder="Deskripsi singkat"
                              value={editCatDesc}
                              onChange={(e) => setEditCatDesc(e.target.value)}
                            />
                          </div>
                          <div className="admin-row-actions">
                            <button
                              type="button"
                              className="admin-save-btn"
                              onClick={() => handleSaveCategory(cat.id)}
                            >
                              SIMPAN
                            </button>
                            <button
                              type="button"
                              className="admin-del-btn"
                              onClick={() => setEditingCatId(null)}
                            >
                              BATAL
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="admin-cat-card__head">
                          <div className="admin-cat-card__title">
                            <span className="category-icon" aria-hidden="true">
                              <Iconify icon={cat.icon} />
                            </span>
                            <strong>{cat.name}</strong>
                            <span className="admin-badge">{cat.short}</span>
                          </div>
                          <div className="admin-row-actions">
                            <button
                              type="button"
                              className="admin-edit-btn"
                              onClick={() => startEditCategory(cat)}
                            >
                              EDIT
                            </button>
                            <button
                              type="button"
                              className="admin-del-btn"
                              onClick={() => handleDeleteCategory(cat)}
                            >
                              HAPUS
                            </button>
                          </div>
                        </div>
                      )}

                      {cat.subcategories && cat.subcategories.length > 0 ? (
                        <ul className="admin-sub-list">
                          {cat.subcategories.map((sub) => {
                            const isEditingSub = editingSubId === sub.id;
                            return (
                              <li key={sub.id} className="admin-sub-item">
                                {isEditingSub ? (
                                  <>
                                    <input
                                      className="admin-input-inline"
                                      style={{ maxWidth: 280 }}
                                      value={editSubLabel}
                                      onChange={(e) => setEditSubLabel(e.target.value)}
                                    />
                                    <div className="admin-row-actions">
                                      <button
                                        type="button"
                                        className="admin-save-btn admin-btn--sm"
                                        onClick={() =>
                                          handleSaveSubcategory(cat.id, sub.id, sub.name)
                                        }
                                      >
                                        SIMPAN
                                      </button>
                                      <button
                                        type="button"
                                        className="admin-del-btn admin-del-btn--sm"
                                        onClick={() => setEditingSubId(null)}
                                      >
                                        BATAL
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <span>↳ {sub.label}</span>
                                    <div className="admin-row-actions">
                                      <button
                                        type="button"
                                        className="admin-edit-btn admin-del-btn--sm"
                                        onClick={() => {
                                          setEditingSubId(sub.id);
                                          setEditSubLabel(sub.label);
                                        }}
                                      >
                                        EDIT
                                      </button>
                                      <button
                                        type="button"
                                        className="admin-del-btn admin-del-btn--sm"
                                        onClick={() =>
                                          handleDeleteSubcategory(cat.id, sub.id, sub.label)
                                        }
                                      >
                                        HAPUS
                                      </button>
                                    </div>
                                  </>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="admin-sub-empty">
                          Tanpa sub-kategori (materi langsung di kategori ini)
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        ) : null}

        {/* ════════ TAB 3: AKUN USER & ADMIN ════════ */}
        {activeTab === "users" ? (
          <div className="admin-grid">
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

            <section className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <h2>Daftar Akun Terdaftar ({users.length})</h2>
                  <p>Ubah role, nama/pangkat, reset password, atau hapus akun.</p>
                </div>
                <button
                  type="button"
                  className="admin-edit-btn"
                  onClick={fetchUsers}
                  disabled={loadingUsers || !supabaseReady}
                >
                  {loadingUsers ? "MEMUAT..." : "MUAT ULANG"}
                </button>
              </div>

              {!supabaseReady ? (
                <p className="admin-sub-empty">
                  Hubungkan Supabase untuk mengelola daftar akun secara langsung.
                </p>
              ) : loadingUsers && !usersLoaded ? (
                <p className="admin-sub-empty">Memuat daftar akun dari Supabase Auth...</p>
              ) : users.length === 0 ? (
                <p className="admin-sub-empty">Belum ada akun terdaftar di Supabase Auth.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>USERNAME / EMAIL</th>
                        <th>NAMA / PANGKAT</th>
                        <th>ROLE</th>
                        <th>RESET PASSWORD</th>
                        <th>AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => {
                        const isSelf = Boolean(currentUserId && currentUserId === u.id);
                        return (
                          <tr key={u.id}>
                            <td>
                              <div className="admin-cell-subject">
                                {u.username}
                                {isSelf ? (
                                  <span className="admin-badge" style={{ marginLeft: 6 }}>
                                    ANDA
                                  </span>
                                ) : null}
                              </div>
                              <div className="admin-user-email">{u.email}</div>
                            </td>
                            <td>
                              <input
                                className="admin-input-inline"
                                placeholder="Nama / Pangkat"
                                value={u.full_name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setUsers((prev) =>
                                    prev.map((row) =>
                                      row.id === u.id ? { ...row, full_name: val } : row,
                                    ),
                                  );
                                }}
                              />
                            </td>
                            <td>
                              <select
                                className="admin-input-inline"
                                style={{ minWidth: 96 }}
                                value={u.role}
                                disabled={isSelf}
                                onChange={(e) => {
                                  const val = e.target.value as "admin" | "user";
                                  setUsers((prev) =>
                                    prev.map((row) =>
                                      row.id === u.id ? { ...row, role: val } : row,
                                    ),
                                  );
                                }}
                              >
                                <option value="user">USER</option>
                                <option value="admin">ADMIN</option>
                              </select>
                            </td>
                            <td>
                              <input
                                className="admin-input-inline"
                                type="text"
                                placeholder="Isi jika reset..."
                                value={u.draftPassword || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setUsers((prev) =>
                                    prev.map((row) =>
                                      row.id === u.id ? { ...row, draftPassword: val } : row,
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
                                  onClick={() => handleUpdateUser(u)}
                                >
                                  SIMPAN
                                </button>
                                <button
                                  type="button"
                                  className="admin-del-btn"
                                  disabled={isSelf}
                                  title={
                                    isSelf
                                      ? "Tidak dapat menghapus akun sendiri"
                                      : "Hapus akun ini"
                                  }
                                  onClick={() => handleDeleteUser(u)}
                                >
                                  HAPUS
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        ) : null}
        </main>

        <footer className="footer admin-footer">
          <span>ADMIN COMMAND CENTER · PWO CLASS OF 2026</span>
          <span>気迫 · 精撃 · 必勝</span>
        </footer>
      </div>
    </div>
  );
}
