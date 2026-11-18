const STORAGE_KEY = "banzai-pwo-library-v2";

const CATEGORIES = [
  {
    id: "gw",
    code: "1",
    name: "GENERAL WARFARE",
    short: "GW",
    icon: "⚔",
    desc: "Doktrin dasar peperangan laut, komando & kendali tempur, dan taktik operasi gabungan.",
  },
  {
    id: "aaw",
    code: "2",
    name: "ANTI AIR WARFARE",
    short: "AAW",
    icon: "✈",
    desc: "Pertahanan udara armada, deteksi dan pelacakan radar udara, serta prosedur reaksi cepat AAW.",
  },
  {
    id: "asuw",
    code: "3",
    name: "ANTI SURFACE WARFARE",
    short: "ASuW",
    icon: "⚓",
    desc: "Taktik peperangan permukaan, penembakan rudal antikapal, dan manuver operasi kapal kombatan.",
  },
  {
    id: "asw",
    code: "4",
    name: "ANTI SUBMARINE WARFARE",
    short: "ASW",
    icon: "◉",
    desc: "Deteksi sonar bawah air, taktik peperangan kapal selam, dan penggunaan senjata ASW.",
  },
  {
    id: "ew",
    code: "5",
    name: "ELECTRONIC WARFARE",
    short: "EW",
    icon: "📡",
    desc: "Peperangan elektronika, manajemen spektrum frekuensi, jamming, ESM, dan pertahanan ECM/ECCM.",
  },
  {
    id: "mw",
    code: "6",
    name: "MINE WARFARE",
    short: "MW",
    icon: "💥",
    desc: "Operasi ranjau laut, penyebaran ranjau, perburuan ranjau, dan Mine Countermeasures (MCM).",
  },
  {
    id: "ref",
    code: "7",
    name: "REFERENSI UMUM LAINNYA",
    short: "REF",
    icon: "▤",
    desc: "Kepustakaan dan referensi doktrin taktis militer internasional.",
    subcategories: [
      {
        id: "ipwo",
        code: "7.1",
        name: "7.1 IPWO INGGRIS",
        label: "7.1 IPWO INGGRIS",
        short: "IPWO",
        icon: "🇬🇧",
      },
      {
        id: "cco",
        code: "7.2",
        name: "7.2 CCO BELANDA",
        label: "7.2 CCO BELANDA",
        short: "CCO",
        icon: "🇳🇱",
      },
    ],
  },
];

const STARTER_MATERIALS = [
  // 1. GENERAL WARFARE
  {
    id: "starter-gw-1",
    subject: "GENERAL WARFARE",
    module: "DOKTRIN OPERASI",
    chapter: "OPERASI LAUT GABUNGAN",
    type: "MODUL",
    title: "Doktrin Dasar Operasi Laut Gabungan & Taktik Tempur Armada",
    url: "",
  },
  {
    id: "starter-gw-2",
    subject: "GENERAL WARFARE",
    module: "KOMANDO & KENDALI",
    chapter: "PROSEDUR C2",
    type: "SOP",
    title: "SOP Komando & Kendali Tempur Kapal Kombatan",
    url: "",
  },

  // 2. ANTI AIR WARFARE
  {
    id: "starter-aaw-1",
    subject: "ANTI AIR WARFARE",
    module: "TAKTIK AAW",
    chapter: "PERTAHANAN UDARA ARMADA",
    type: "MODUL",
    title: "Modul Taktis AAW - Pertahanan Udara Gugus Tempur Laut",
    url: "",
  },
  {
    id: "starter-aaw-2",
    subject: "ANTI AIR WARFARE",
    module: "PROSEDUR REAKSI CEPAT",
    chapter: "SASARAN CEPAT RENDAH",
    type: "SOP",
    title: "SOP Penembakan Rudal Pertahanan Udara & Meriam CIWS",
    url: "",
  },

  // 3. ANTI SURFACE WARFARE
  {
    id: "starter-asuw-1",
    subject: "ANTI SURFACE WARFARE",
    module: "TAKTIK ASUW",
    chapter: "PROSEDUR PENEMBAKAN RUDAL",
    type: "MODUL",
    title: "Modul Taktis AsuW - Prosedur Penembakan Rudal Antikapal",
    url: "",
  },
  {
    id: "starter-asuw-2",
    subject: "ANTI SURFACE WARFARE",
    module: "PANDUAN OPERASI",
    chapter: "TEMPUR LAUT COMBATANT",
    type: "BAHAN AJAR",
    title: "Panduan Operasi Tempur Permukaan Kapal Kombatan",
    url: "",
  },
  {
    id: "starter-asuw-3",
    subject: "ANTI SURFACE WARFARE",
    module: "KOMUNIKASI TAKTIS",
    chapter: "KESIAPAN SENJATA",
    type: "SOP",
    title: "SOP Komunikasi Taktis dan Kesiapan Senjata Permukaan",
    url: "",
  },

  // 4. ANTI SUBMARINE WARFARE
  {
    id: "starter-asw-1",
    subject: "ANTI SUBMARINE WARFARE",
    module: "TAKTIK ASW",
    chapter: "ANALISIS SONAR & AKUSTIK",
    type: "MODUL",
    title: "Modul Taktis ASW - Analisis Pola Deteksi Sonar Pasif & Aktif",
    url: "",
  },
  {
    id: "starter-asw-2",
    subject: "ANTI SUBMARINE WARFARE",
    module: "PENYERANGAN ASW",
    chapter: "PROSEDUR TORPEDO",
    type: "SOP",
    title: "SOP Pelacakan & Penyerangan Torpedo Terhadap Kontak Kapal Selam",
    url: "",
  },

  // 5. ELECTRONIC WARFARE
  {
    id: "starter-ew-1",
    subject: "ELECTRONIC WARFARE",
    module: "TAKTIK EW",
    chapter: "ESM & JAMMING",
    type: "MODUL",
    title: "Modul Perang Elektronika - Deteksi ESM dan Taktik Active Jamming",
    url: "",
  },
  {
    id: "starter-ew-2",
    subject: "ELECTRONIC WARFARE",
    module: "PERTAHANAN EW",
    chapter: "PROSEDUR ECCM & CHAFF",
    type: "SOP",
    title: "SOP Penembakan Chaff / Decoy & Prosedur Lawan Elektronik (ECCM)",
    url: "",
  },

  // 6. MINE WARFARE
  {
    id: "starter-mw-1",
    subject: "MINE WARFARE",
    module: "OPERASI RANJAU",
    chapter: "MINE COUNTERMEASURES (MCM)",
    type: "MODUL",
    title: "Modul Taktis Perang Ranjau - Prosedur Pemburuan & Pembersihan Ranjau",
    url: "",
  },
  {
    id: "starter-mw-2",
    subject: "MINE WARFARE",
    module: "PENYEBARAN & DETEKSI",
    chapter: "SONAR RANJAU",
    type: "BAHAN AJAR",
    title: "Panduan Operasi Deteksi Ranjau Laut dan Rute Aman Pelayaran",
    url: "",
  },

  // 7. REFERENSI UMUM LAINNYA
  // 7.1 IPWO INGGRIS
  {
    id: "starter-ref-ipwo-1",
    subject: "7.1 IPWO INGGRIS",
    module: "ROYAL NAVY IPWO",
    chapter: "WARFARE TACTICS MANUAL",
    type: "REFERENSI",
    title: "Royal Navy IPWO Handbook - Maritime Tactical Command & Warfare Principles",
    url: "",
  },
  {
    id: "starter-ref-ipwo-2",
    subject: "7.1 IPWO INGGRIS",
    module: "INTERNATIONAL PWO",
    chapter: "AIR DEFENCE & TASK FORCE OPS",
    type: "MODUL",
    title: "IPWO UK Doctrine - Fleet Air Defence & Battle Group Integration",
    url: "",
  },

  // 7.2 CCO BELANDA
  {
    id: "starter-ref-cco-1",
    subject: "7.2 CCO BELANDA",
    module: "RNLN CCO MANUAL",
    chapter: "COMMAND & CONTROL DOCTRINE",
    type: "REFERENSI",
    title: "Royal Netherlands Navy CCO Manual - Command & Control Officer Operations",
    url: "",
  },
  {
    id: "starter-ref-cco-2",
    subject: "7.2 CCO BELANDA",
    module: "TACTICAL PROCEDURES",
    chapter: "COMBAT INFORMATION CENTER",
    type: "BAHAN AJAR",
    title: "CCO Netherlands Navy - Combat Information Center (CIC) Organization & SOP",
    url: "",
  },
];

const categoryNav = document.querySelector("#category-nav");
const documentGrid = document.querySelector("#document-grid");
const documentTotal = document.querySelector("#document-total");
const categoryTitle = document.querySelector("#category-title");
const searchInput = document.querySelector("#search");
const statusMessage = document.querySelector("#status-message");
const dialog = document.querySelector("#material-dialog");
const form = document.querySelector("#material-form");
const formError = document.querySelector("#form-error");

// Parse URL query parameter: ?cat=0..6, ?cat=gw, ?cat=7.1, etc.
const urlParams = new URLSearchParams(window.location.search);
const catParam = urlParams.get("cat");
let initialCategory = CATEGORIES[0].name;

if (catParam !== null) {
  const cleanParam = catParam.trim().toLowerCase();
  if (cleanParam === "7.1" || cleanParam === "ipwo") {
    initialCategory = "7.1 IPWO INGGRIS";
  } else if (cleanParam === "7.2" || cleanParam === "cco") {
    initialCategory = "7.2 CCO BELANDA";
  } else if (cleanParam === "6" || cleanParam === "ref") {
    initialCategory = "REFERENSI UMUM LAINNYA";
  } else if (!isNaN(Number(cleanParam)) && CATEGORIES[Number(cleanParam)]) {
    initialCategory = CATEGORIES[Number(cleanParam)].name;
  } else {
    const found = CATEGORIES.find(
      (c) =>
        c.id === cleanParam ||
        c.code === cleanParam ||
        c.short.toLowerCase() === cleanParam,
    );
    if (found) initialCategory = found.name;
  }
}

let activeCategory = initialCategory;
let editingId = null;
let materials = loadMaterials();

function showStatus(message) {
  if (statusMessage) statusMessage.textContent = message;
}

function migrateSubject(subject) {
  if (!subject) return "GENERAL WARFARE";
  const s = subject.toUpperCase();
  if (s.includes("IPWO")) return "7.1 IPWO INGGRIS";
  if (s.includes("CCO")) return "7.2 CCO BELANDA";
  if (s.includes("SURFACE") || s.includes("ASUW")) return "ANTI SURFACE WARFARE";
  if (s.includes("SUBMARINE") || s.includes("ASW")) return "ANTI SUBMARINE WARFARE";
  if (s.includes("ELECTRONIC") || s.includes("EW")) return "ELECTRONIC WARFARE";
  if (s.includes("AIR") || s.includes("ATO") || s.includes("AAW")) return "ANTI AIR WARFARE";
  if (s.includes("MINE") || s.includes("MW")) return "MINE WARFARE";
  if (s.includes("GENERAL") || s.includes("GW")) return "GENERAL WARFARE";
  if (s.includes("REFERENSI") || s.includes("UMUM")) return "REFERENSI UMUM LAINNYA";
  return subject;
}

function loadMaterials() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      // Check legacy storage
      const legacy = window.localStorage.getItem("banzai-pwo-library");
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
          return parsedLegacy.map((item) => ({
            ...item,
            subject: migrateSubject(item.subject),
          }));
        }
      }
      return STARTER_MATERIALS.map((item) => ({ ...item }));
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error("Format data katalog tidak valid.");
    return parsed.map((item) => ({
      ...item,
      subject: migrateSubject(item.subject),
    }));
  } catch (error) {
    showStatus(`Data lokal tidak dapat dibaca: ${error.message}`);
    return STARTER_MATERIALS.map((item) => ({ ...item }));
  }
}

function saveMaterials(nextMaterials) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMaterials));
    materials = nextMaterials;
    showStatus("");
    renderLibrary();
    return true;
  } catch (error) {
    showStatus(`Dokumen tidak dapat disimpan di browser ini: ${error.message}`);
    return false;
  }
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function itemMatchesCategory(item, targetCategory) {
  const itemSubject = item.subject || "";
  if (targetCategory === "REFERENSI UMUM LAINNYA") {
    return (
      itemSubject === "REFERENSI UMUM LAINNYA" ||
      itemSubject === "7.1 IPWO INGGRIS" ||
      itemSubject === "7.2 CCO BELANDA" ||
      itemSubject.includes("IPWO") ||
      itemSubject.includes("CCO") ||
      itemSubject.includes("REFERENSI")
    );
  }
  if (targetCategory === "7.1 IPWO INGGRIS") {
    return itemSubject === "7.1 IPWO INGGRIS" || itemSubject.includes("IPWO");
  }
  if (targetCategory === "7.2 CCO BELANDA") {
    return itemSubject === "7.2 CCO BELANDA" || itemSubject.includes("CCO");
  }
  return itemSubject === targetCategory;
}

function countCategoryMaterials(categoryName) {
  return materials.filter((item) => itemMatchesCategory(item, categoryName)).length;
}

function buildCategoryNav() {
  if (!categoryNav) return;
  categoryNav.replaceChildren();

  for (const category of CATEGORIES) {
    if (category.subcategories && category.subcategories.length > 0) {
      // Category group (e.g. 7. REFERENSI UMUM LAINNYA)
      const group = makeElement("div", "category-group");

      const mainButton = makeElement("button", "category-button");
      mainButton.type = "button";
      const isMainActive = activeCategory === category.name;
      mainButton.classList.toggle("is-active", isMainActive);
      mainButton.setAttribute("aria-pressed", String(isMainActive));

      const count = countCategoryMaterials(category.name);
      const icon = makeElement("span", "category-icon", category.icon);
      icon.setAttribute("aria-hidden", "true");

      mainButton.append(
        icon,
        makeElement("span", "category-name", `${category.code}. ${category.name}`),
        makeElement("span", "category-count", String(count).padStart(2, "0")),
      );

      mainButton.addEventListener("click", () => {
        activeCategory = category.name;
        if (searchInput) searchInput.value = "";
        renderLibrary();
      });

      group.append(mainButton);

      // Subnav
      const subNav = makeElement("div", "category-subnav");
      for (const sub of category.subcategories) {
        const subButton = makeElement("button", "category-subbutton");
        subButton.type = "button";
        const isSubActive = activeCategory === sub.name;
        subButton.classList.toggle("is-active", isSubActive);
        subButton.setAttribute("aria-pressed", String(isSubActive));

        const subCount = countCategoryMaterials(sub.name);
        const bullet = makeElement("span", "subnav-bullet", "↳");
        bullet.setAttribute("aria-hidden", "true");

        subButton.append(
          bullet,
          makeElement("span", "category-name", sub.label),
          makeElement("span", "category-count", String(subCount).padStart(2, "0")),
        );

        subButton.addEventListener("click", () => {
          activeCategory = sub.name;
          if (searchInput) searchInput.value = "";
          renderLibrary();
        });

        subNav.append(subButton);
      }

      group.append(subNav);
      categoryNav.append(group);
    } else {
      // Regular category
      const button = makeElement("button", "category-button");
      button.type = "button";
      const isActive = activeCategory === category.name;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));

      const count = countCategoryMaterials(category.name);
      const icon = makeElement("span", "category-icon", category.icon);
      icon.setAttribute("aria-hidden", "true");

      button.append(
        icon,
        makeElement("span", "category-name", `${category.code}. ${category.name}`),
        makeElement("span", "category-count", String(count).padStart(2, "0")),
      );

      button.addEventListener("click", () => {
        activeCategory = category.name;
        if (searchInput) searchInput.value = "";
        renderLibrary();
      });

      categoryNav.append(button);
    }
  }
}

function filteredMaterials() {
  const query = searchInput ? searchInput.value.trim().toLocaleLowerCase("id") : "";
  return materials.filter((item) => {
    const matchesCat = itemMatchesCategory(item, activeCategory);
    if (!matchesCat) return false;
    if (!query) return true;
    const searchable = [item.subject, item.module, item.chapter, item.title, item.type]
      .join(" ")
      .toLocaleLowerCase("id");
    return searchable.includes(query);
  });
}

function makeDocumentCard(item) {
  const card = makeElement("article", "document-card");
  const topLine = makeElement("div", "document-topline");
  const type = makeElement("span", "document-type", item.type);
  type.dataset.type = item.type;
  topLine.append(type);

  const title = makeElement("h2", "document-title", item.title);
  const path = makeElement("p", "document-path");
  path.append(
    document.createTextNode(`${item.module}  /  `),
    makeElement("span", "", item.chapter),
  );

  const footer = makeElement("div", "document-footer");
  const fileInfo = makeElement("span", "file-info");
  fileInfo.append(makeElement("span", "pdf-icon", "▣"), document.createTextNode("GOOGLE DRIVE"));
  const linked = Boolean(item.url);
  const linkState = makeElement(
    "span",
    `link-state${linked ? " is-linked" : ""}`,
    linked ? "TAUTAN SIAP" : "BELUM DITAMBAHKAN",
  );

  const action = makeElement(
    "button",
    `document-action${linked ? " is-linked" : ""}`,
    linked ? "BUKA DRIVE ↗" : "HUBUNGKAN DRIVE",
  );
  action.type = "button";
  action.addEventListener("click", () => {
    if (linked) {
      window.open(item.url, "_blank", "noopener,noreferrer");
      return;
    }
    openDialog(item);
  });

  const meta = makeElement("span", "document-meta");
  meta.append(fileInfo, linkState);
  footer.append(meta, action);
  card.append(topLine, title, path, footer);

  const removeButton = makeElement("button", "remove-button", "×");
  removeButton.type = "button";
  removeButton.setAttribute("aria-label", `Hapus ${item.title}`);
  removeButton.title = "Hapus dari katalog";
  removeButton.addEventListener("click", () => {
    if (!window.confirm(`Hapus "${item.title}" dari katalog ini?`)) return;
    saveMaterials(materials.filter((material) => material.id !== item.id));
  });
  topLine.append(removeButton);
  return card;
}

function renderLibrary() {
    if (!documentGrid) return;

    // Resolve active category title & subcode
    let displayTitle = activeCategory;
    let displaySuffix = "";

    const mainCategory = CATEGORIES.find((c) => c.name === activeCategory);
    if (mainCategory) {
      displayTitle = `${mainCategory.code}. ${mainCategory.name}`;
      displaySuffix = ` (${mainCategory.short})`;
    } else {
      // Check if subcategory
      for (const c of CATEGORIES) {
        if (c.subcategories) {
          const sub = c.subcategories.find((s) => s.name === activeCategory);
          if (sub) {
            displayTitle = sub.label;
            displaySuffix = ` (${sub.short})`;
            break;
          }
        }
      }
    }

    if (categoryTitle) {
      categoryTitle.textContent = displayTitle;
      if (displaySuffix) {
        categoryTitle.append(makeElement("span", "", displaySuffix));
      }
    }

    buildCategoryNav();

    const visible = filteredMaterials();
    if (documentTotal) {
      documentTotal.textContent = `${visible.length} DOKUMEN`;
    }
    documentGrid.replaceChildren();

    if (visible.length) {
      visible.forEach((item) => documentGrid.append(makeDocumentCard(item)));
      return;
    }

    const isSearching = searchInput && searchInput.value.trim().length > 0;
    const empty = makeElement("div", "empty-state");
    empty.append(
      makeElement("span", "empty-mark", "⚓"),
      makeElement(
        "h2",
        "",
        isSearching ? "Dokumen tidak ditemukan" : "Belum ada dokumen di kategori ini",
      ),
      makeElement(
        "p",
        "",
        isSearching
          ? "Coba kata kunci lain atau pilih kategori berbeda."
          : "Tambahkan dokumen dan tautan Drive untuk melengkapi materi kategori ini.",
      ),
    );
    if (!isSearching) {
      const addButton = makeElement("button", "add-button", "＋ Tambah dokumen");
      addButton.type = "button";
      addButton.addEventListener("click", () => openDialog());
      empty.append(addButton);
    }
    documentGrid.append(empty);
  }

  function openDialog(item) {
    if (!dialog || !form) return;
    editingId = item ? item.id : null;
    form.reset();
    if (formError) formError.textContent = "";

    const subjectSelect = form.elements.subject;
    subjectSelect.replaceChildren();

    // Populate options with categories and subcategories
    for (const category of CATEGORIES) {
      const opt = document.createElement("option");
      opt.value = category.name;
      opt.textContent = `${category.code}. ${category.name}`;
      subjectSelect.append(opt);

      if (category.subcategories) {
        for (const sub of category.subcategories) {
          const subOpt = document.createElement("option");
          subOpt.value = sub.name;
          subOpt.textContent = `── ${sub.label}`;
          subjectSelect.append(subOpt);
        }
      }
    }

    if (item) {
      subjectSelect.value = item.subject;
      form.elements.module.value = item.module;
      form.elements.chapter.value = item.chapter;
      form.elements.type.value = item.type;
      form.elements.title.value = item.title;
      form.elements.url.value = item.url || "";
    } else {
      subjectSelect.value = activeCategory;
    }

    const dialogTitleEl = document.querySelector("#dialog-title");
    if (dialogTitleEl) {
      dialogTitleEl.textContent = item ? "Edit / Hubungkan Drive" : "Tambah dokumen";
    }
    dialog.showModal();
    if (item) {
      form.elements.url.focus();
    } else {
      form.elements.module.focus();
    }
  }

  const openDialogBtn = document.querySelector("#open-dialog");
  if (openDialogBtn) {
    openDialogBtn.addEventListener("click", () => openDialog());
  }
  const closeDialogBtn = document.querySelector("#close-dialog");
  if (closeDialogBtn) {
    closeDialogBtn.addEventListener("click", () => dialog.close());
  }
  const cancelDialogBtn = document.querySelector("#cancel-dialog");
  if (cancelDialogBtn) {
    cancelDialogBtn.addEventListener("click", () => dialog.close());
  }
  if (searchInput) {
    searchInput.addEventListener("input", renderLibrary);
  }

    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (formError) formError.textContent = "";
        const values = new FormData(form);
        const rawUrl = String(values.get("url") || "").trim();
        let validUrl = "";

        if (rawUrl) {
          try {
            const parsed = new URL(rawUrl);
            if (
              parsed.protocol !== "https:" ||
              !["drive.google.com", "docs.google.com"].includes(parsed.hostname)
            ) {
              if (formError) {
                formError.textContent =
                  "Gunakan tautan HTTPS dari drive.google.com atau docs.google.com.";
              }
              return;
            }
            validUrl = parsed.href;
          } catch {
            if (formError) {
              formError.textContent = "Masukkan tautan Google Drive yang valid.";
            }
            return;
          }
        }

      const item = {
        id: editingId || crypto.randomUUID(),
        subject: String(values.get("subject")).trim(),
        module: String(values.get("module")).trim(),
        chapter: String(values.get("chapter")).trim(),
        type: String(values.get("type")),
        title: String(values.get("title")).trim(),
        url: validUrl,
      };

      if (!item.subject || !item.module || !item.chapter || !item.title) {
        if (formError) {
          formError.textContent = "Lengkapi semua kolom sebelum menyimpan.";
        }
        return;
      }

      const nextMaterials = editingId
        ? materials.map((material) => (material.id === editingId ? item : material))
        : [...materials, item];

      if (saveMaterials(nextMaterials)) {
        activeCategory = item.subject;
        if (searchInput) searchInput.value = "";
        renderLibrary();
        dialog.close();
      }
    });
}

// Initial render
renderLibrary();
