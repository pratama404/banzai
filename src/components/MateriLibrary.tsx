"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Iconify from "@/components/Iconify";
import { animateHeadingWords } from "@/components/SmoothScroll";
import type { Category, MaterialItem } from "@/data/catalog";

interface MateriLibraryProps {
  categories: Category[];
  materials: MaterialItem[];
  initialCatParam?: string;
  userRole: "admin" | "user";
}

interface DocumentLink {
  key: string;
  label: string;
  url: string;
}

interface PreviewState {
  item: MaterialItem;
  links: DocumentLink[];
  activeIndex: number;
}

const LINK_LABELS: Record<string, string> = {
  module: "MODULE (PI)",
  lessons: "LESSONS",
};

function findParentCategory(categories: Category[], targetName: string): Category {
  for (const cat of categories) {
    if (cat.name === targetName) return cat;
    if (cat.subcategories && cat.subcategories.some((s) => s.name === targetName)) {
      return cat;
    }
  }
  return categories[0];
}

function resolveInitialCategory(categories: Category[], catParam?: string): string {
  if (!catParam) return categories[0].name;
  const cleanParam = catParam.trim().toLowerCase();

  for (const cat of categories) {
    if (cat.subcategories) {
      const sub = cat.subcategories.find(
        (s) => s.id === cleanParam || s.code === cleanParam,
      );
      if (sub) return sub.name;
    }
  }

  if (!isNaN(Number(cleanParam)) && categories[Number(cleanParam)]) {
    return categories[Number(cleanParam)].name;
  }

  const found = categories.find(
    (c) =>
      c.id === cleanParam ||
      c.code === cleanParam ||
      c.short.toLowerCase() === cleanParam,
  );
  return found ? found.name : categories[0].name;
}

function getDocumentLinks(item: MaterialItem): DocumentLink[] {
  const result: DocumentLink[] = [];
  if (item.links && typeof item.links === "object") {
    for (const [key, value] of Object.entries(item.links)) {
      if (typeof value === "string" && value.trim().length > 0) {
        result.push({
          key: key.toLowerCase(),
          label: LINK_LABELS[key] || key.toUpperCase(),
          url: value.trim(),
        });
      }
    }
  }
  return result;
}

/**
 * Converts Google Drive / Docs / Slides URLs into clean iframe preview URLs.
 * Returns null for Drive folders or non-embeddable links (opens in new tab).
 */
function toEmbedPreviewUrl(rawUrl: string): string | null {
  try {
    const u = new URL(rawUrl);
    if (u.pathname.includes("/drive/folders/")) return null;

    const driveFile = rawUrl.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
    if (driveFile) {
      return `https://drive.google.com/file/d/${driveFile[1]}/preview`;
    }

    const slides = rawUrl.match(/docs\.google\.com\/presentation\/d\/([^/?#]+)/i);
    if (slides) {
      return `https://docs.google.com/presentation/d/${slides[1]}/embed?start=false&loop=false&delayms=3000`;
    }

    const docs = rawUrl.match(/docs\.google\.com\/document\/d\/([^/?#]+)/i);
    if (docs) {
      return `https://docs.google.com/document/d/${docs[1]}/preview`;
    }

    const sheets = rawUrl.match(/docs\.google\.com\/spreadsheets\/d\/([^/?#]+)/i);
    if (sheets) {
      return `https://docs.google.com/spreadsheets/d/${sheets[1]}/preview`;
    }

    return null;
  } catch {
    return null;
  }
}

export default function MateriLibrary({
  categories,
  materials,
  initialCatParam,
  userRole,
}: MateriLibraryProps) {
  const router = useRouter();
  const initialActive = useMemo(
    () => resolveInitialCategory(categories, initialCatParam),
    [categories, initialCatParam],
  );
  const initialParent = useMemo(
    () => findParentCategory(categories, initialActive),
    [categories, initialActive],
  );

  const [activeCategory, setActiveCategory] = useState<string>(initialActive);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    initialParent?.subcategories ? [initialParent.id] : [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState<"all" | "category">("all");
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const isFirstRender = useRef(true);

  const isGlobalSearchActive = Boolean(searchQuery.trim()) && searchScope === "all";

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (titleRef.current) {
      delete titleRef.current.dataset.originalHtml;
      animateHeadingWords(titleRef.current, false);
    }
  }, [activeCategory, isGlobalSearchActive]);

  useEffect(() => {
    if (!preview) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [preview]);

  const { displayTitle, displaySuffix } = useMemo(() => {
    if (isGlobalSearchActive) {
      return { displayTitle: "HASIL PENCARIAN", displaySuffix: " (SEMUA KATEGORI)" };
    }
    const mainCategory = categories.find((c) => c.name === activeCategory);
    if (mainCategory) {
      return { displayTitle: mainCategory.name, displaySuffix: ` (${mainCategory.short})` };
    }
    for (const c of categories) {
      if (c.subcategories) {
        const sub = c.subcategories.find((s) => s.name === activeCategory);
        if (sub) {
          return { displayTitle: sub.label, displaySuffix: ` (${sub.short})` };
        }
      }
    }
    return { displayTitle: activeCategory, displaySuffix: "" };
  }, [categories, activeCategory, isGlobalSearchActive]);

  const visibleMaterials = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("id");
    const mainCat = categories.find((c) => c.name === activeCategory);

    return materials.filter((item) => {
      if (!(query && searchScope === "all")) {
        const itemSubject = item.subject || "";
        let matchesCat = false;

        if (mainCat) {
          if (itemSubject === mainCat.name) matchesCat = true;
          else if (mainCat.subcategories) {
            matchesCat = mainCat.subcategories.some((sub) => itemSubject === sub.name);
          }
        } else {
          matchesCat = itemSubject === activeCategory;
        }

        if (!matchesCat) return false;
      }

      if (!query) return true;

      const searchable = [item.subject, item.module, item.chapter, item.title, item.type]
        .join(" ")
        .toLocaleLowerCase("id");
      return searchable.includes(query);
    });
  }, [materials, categories, activeCategory, searchQuery, searchScope]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const activePreviewLink = preview ? preview.links[preview.activeIndex] : null;
  const activePreviewEmbed = activePreviewLink
    ? toEmbedPreviewUrl(activePreviewLink.url)
    : null;

  return (
    <>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="PWO Vademecum, beranda">
          <img className="brand-logo" src="/assets/logo/logo-pwo.png" alt="Logo PWO 2026" />
          <span className="brand-copy">
            <strong>PRINCIPAL WARFARE OFFICER</strong>
            <small>E-REFERENCES · CLASS OF 2026</small>
          </span>
        </Link>
        <nav className="topbar-nav">
          <Link href="/" className="topbar-link">
            BERANDA
          </Link>
          <Link href="/materi" className="topbar-link is-active">
            MATERI
          </Link>
          <button type="button" className="topbar-button" onClick={handleLogout}>
            KELUAR
          </button>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="hero-kicker">
            <span></span> PWO LANDING BASE · BANZAI 2026
          </p>
          <h1 id="hero-title">
            <em>E-References</em>
          </h1>
          <p>
            All PWO materials, field manuals, and tactical references — unified in one digital
            command center. Select a category to begin.
          </p>
        </div>
        <span className="hero-motto" aria-hidden="true">
          気迫 · 精撃 · 必勝
        </span>
      </section>

      <main className="workspace">
        <aside className="sidebar" aria-label="Kategori materi">
          <p className="side-label">DAFTAR MATERI</p>
          <nav className="category-nav" id="category-nav">
            {categories.map((category) => {
              const hasSubs = Boolean(category.subcategories && category.subcategories.length > 0);
              const isOpen = expandedGroups.includes(category.id);
              const isMainActive = !isGlobalSearchActive && activeCategory === category.name;
              const hasActiveChild = Boolean(
                !isGlobalSearchActive &&
                  category.subcategories?.some((s) => s.name === activeCategory),
              );

              if (hasSubs) {
                return (
                  <div
                    key={category.id}
                    className={`category-group${isOpen ? " is-open" : ""}`}
                  >
                    <button
                      type="button"
                      className={`category-button${isMainActive ? " is-active" : ""}${
                        !isMainActive && hasActiveChild ? " has-active-child" : ""
                      }`}
                      aria-expanded={isOpen}
                      aria-pressed={isMainActive}
                      onClick={() => {
                        if (isOpen && isMainActive) {
                          setExpandedGroups((prev) => prev.filter((id) => id !== category.id));
                        } else {
                          setExpandedGroups((prev) =>
                            prev.includes(category.id) ? prev : [...prev, category.id],
                          );
                          setActiveCategory(category.name);
                          setSearchQuery("");
                        }
                      }}
                    >
                      <span className="category-icon" aria-hidden="true">
                        <Iconify icon={category.icon} />
                      </span>
                      <span className="category-name">{category.name}</span>
                      <span className="category-chevron" aria-hidden="true">
                        ▾
                      </span>
                    </button>

                    <div className="category-subnav">
                      <div className="category-subnav-inner">
                        {category.subcategories!.map((sub) => {
                          const isSubActive =
                            !isGlobalSearchActive && activeCategory === sub.name;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              className={`category-subbutton${isSubActive ? " is-active" : ""}`}
                              aria-pressed={isSubActive}
                              onClick={() => {
                                setExpandedGroups((prev) =>
                                  prev.includes(category.id) ? prev : [...prev, category.id],
                                );
                                setActiveCategory(sub.name);
                                setSearchQuery("");
                              }}
                            >
                              <span className="subnav-bullet" aria-hidden="true">
                                ↳
                              </span>
                              <span className="category-name">{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={category.id}
                  type="button"
                  className={`category-button${isMainActive ? " is-active" : ""}`}
                  aria-pressed={isMainActive}
                  onClick={() => {
                    setActiveCategory(category.name);
                    setSearchQuery("");
                  }}
                >
                  <span className="category-icon" aria-hidden="true">
                    <Iconify icon={category.icon} />
                  </span>
                  <span className="category-name">{category.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="side-note">
            <p>JALESVEVA JAYAMAHE</p>
          </div>
        </aside>

        <section className="library" id="library" aria-labelledby="category-title">
          <div className="search-row search-row--with-scope">
            <label className="search-box">
              <span className="visually-hidden">Cari dokumen pelajaran</span>
              <input
                id="search"
                type="search"
                placeholder={
                  searchScope === "all"
                    ? "Cari di seluruh dokumen PWO..."
                    : "Cari di kategori aktif..."
                }
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon" aria-hidden="true"></span>
            </label>

            <div className="search-scope" role="group" aria-label="Cakupan pencarian">
              <button
                type="button"
                className={`search-scope__btn${searchScope === "all" ? " is-active" : ""}`}
                onClick={() => setSearchScope("all")}
              >
                SEMUA KATEGORI
              </button>
              <button
                type="button"
                className={`search-scope__btn${searchScope === "category" ? " is-active" : ""}`}
                onClick={() => setSearchScope("category")}
              >
                KATEGORI AKTIF
              </button>
            </div>
          </div>

          <div className="section-heading">
            <div>
              <p className="eyebrow">PERPUSTAKAAN DIGITAL · PWO BANZAI 2026</p>
              <h1
                id="category-title"
                ref={titleRef}
                key={isGlobalSearchActive ? "__global__" : activeCategory}
              >
                {displayTitle}
                {displaySuffix ? <span>{displaySuffix}</span> : null}
              </h1>
            </div>
            <span className="document-total" id="document-total">
              {visibleMaterials.length} DOKUMEN
            </span>
          </div>

          <div className="document-grid" id="document-grid">
            {visibleMaterials.length > 0 ? (
              visibleMaterials.map((item, index) => {
                const links = getDocumentLinks(item);
                return (
                  <article key={item.id} className="document-card">
                    <span className="document-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {isGlobalSearchActive ? (
                      <span className="document-subject-tag">{item.subject}</span>
                    ) : null}
                    <h2 className="document-title">{item.title}</h2>

                    <div className="document-actions">
                      {links.length > 0 ? (
                        links.map((link, idx) => {
                          const isSecondary = links.length > 1 && idx > 0;
                          const canPreview = Boolean(toEmbedPreviewUrl(link.url));
                          return (
                            <a
                              key={link.key}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`document-action is-linked${
                                isSecondary ? " is-secondary" : ""
                              }`}
                              title={
                                canPreview
                                  ? `Pratinjau ${link.label} (Ctrl+Klik untuk tab baru)`
                                  : `Buka ${link.label} di tab baru`
                              }
                              onClick={(e) => {
                                if (
                                  canPreview &&
                                  !e.ctrlKey &&
                                  !e.metaKey &&
                                  !e.shiftKey &&
                                  e.button === 0
                                ) {
                                  e.preventDefault();
                                  setPreview({ item, links, activeIndex: idx });
                                }
                              }}
                            >
                              <span className="document-action__label">{link.label}</span>
                              <span className="document-action__icon" aria-hidden="true">
                                <span>↗</span>
                              </span>
                            </a>
                          );
                        })
                      ) : (
                        <span
                          className="document-action is-disabled"
                          aria-disabled="true"
                          title="Dokumen ini belum memiliki tautan"
                        >
                          <span className="document-action__label">BELUM TERSEDIA</span>
                          <span className="document-action__icon" aria-hidden="true">
                            <span>—</span>
                          </span>
                        </span>
                      )}
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="empty-state">
                <span className="empty-mark">⚓</span>
                <h2>
                  {searchQuery.trim()
                    ? "Dokumen tidak ditemukan"
                    : "Belum ada dokumen di kategori ini"}
                </h2>
                <p>
                  {searchQuery.trim()
                    ? "Coba kata kunci lain atau ubah cakupan pencarian."
                    : "Dokumen untuk kategori ini sedang dipersiapkan."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ══════ DOCUMENT PREVIEW MODAL ══════ */}
      {preview && activePreviewLink ? (
        <div
          className="preview-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreview(null);
          }}
        >
          <div className="preview-modal__dialog">
            <div className="preview-modal__header">
              <div className="preview-modal__meta">
                <p className="eyebrow">{preview.item.subject}</p>
                <h2 id="preview-modal-title" className="preview-modal__title">
                  {preview.item.title}
                </h2>
              </div>

              <div className="preview-modal__controls">
                {preview.links.length > 1 ? (
                  <div className="preview-modal__tabs">
                    {preview.links.map((lnk, idx) => (
                      <button
                        key={lnk.key}
                        type="button"
                        className={`preview-modal__tab${
                          idx === preview.activeIndex ? " is-active" : ""
                        }`}
                        onClick={() => setPreview({ ...preview, activeIndex: idx })}
                      >
                        {lnk.label}
                      </button>
                    ))}
                  </div>
                ) : null}

                <a
                  href={activePreviewLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="preview-modal__ext"
                >
                  TAB BARU ↗
                </a>

                <button
                  type="button"
                  className="preview-modal__close"
                  aria-label="Tutup pratinjau"
                  onClick={() => setPreview(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="preview-modal__body">
              {activePreviewEmbed ? (
                <iframe
                  key={activePreviewEmbed}
                  src={activePreviewEmbed}
                  title={`${preview.item.title} — ${activePreviewLink.label}`}
                  className="preview-modal__frame"
                  allow="autoplay; fullscreen"
                />
              ) : (
                <div className="preview-modal__fallback">
                  <p>Tautan ini merupakan folder/halaman eksternal yang tidak mendukung pratinjau langsung.</p>
                  <a
                    href={activePreviewLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    BUKA DI TAB BARU ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <footer className="footer">
        <span>BANZAI VADEMECUM · PWO CLASS OF 2026</span>
        <span>気迫 · 精撃 · 必勝</span>
      </footer>
    </>
  );
}
