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

function getDocumentLinks(item: MaterialItem) {
  const result: { key: string; label: string; url: string }[] = [];
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
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (titleRef.current) {
      delete titleRef.current.dataset.originalHtml;
      animateHeadingWords(titleRef.current, false);
    }
  }, [activeCategory]);

  const { displayTitle, displaySuffix } = useMemo(() => {
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
  }, [categories, activeCategory]);

  const visibleMaterials = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("id");
    const mainCat = categories.find((c) => c.name === activeCategory);

    return materials.filter((item) => {
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
      if (!query) return true;

      const searchable = [item.subject, item.module, item.chapter, item.title, item.type]
        .join(" ")
        .toLocaleLowerCase("id");
      return searchable.includes(query);
    });
  }, [materials, categories, activeCategory, searchQuery]);

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
          {userRole === "admin" ? (
            <Link href="/admin" className="topbar-link">
              ADMIN
            </Link>
          ) : null}
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
              const isMainActive = activeCategory === category.name;
              const hasActiveChild = Boolean(
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
                          const isSubActive = activeCategory === sub.name;
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
          <div className="search-row">
            <label className="search-box">
              <span className="visually-hidden">Cari dokumen pelajaran</span>
              <input
                id="search"
                type="search"
                placeholder="Cari dokumen pelajaran PWO..."
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon" aria-hidden="true"></span>
            </label>
          </div>

          <div className="section-heading">
            <div>
              <p className="eyebrow">PERPUSTAKAAN DIGITAL · PWO BANZAI 2026</p>
              <h1 id="category-title" ref={titleRef} key={activeCategory}>
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
                    <h2 className="document-title">{item.title}</h2>

                    <div className="document-actions">
                      {links.length > 0 ? (
                        links.map((link, idx) => {
                          const isSecondary = links.length > 1 && idx > 0;
                          return (
                            <a
                              key={link.key}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`document-action is-linked${
                                isSecondary ? " is-secondary" : ""
                              }`}
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
                    ? "Coba kata kunci lain atau pilih kategori berbeda."
                    : "Dokumen untuk kategori ini sedang dipersiapkan."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>BANZAI VADEMECUM · PWO CLASS OF 2026</span>
        <span>気迫 · 精撃 · 必勝</span>
      </footer>
    </>
  );
}
