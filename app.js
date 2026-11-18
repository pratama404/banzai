const STORAGE_KEY = "banzai-pwo-library";
const CATEGORIES = [
  { name: "SURFACE WARFARE (ASuW)", short: "ASuW", icon: "⚓" },
  { name: "ANTI-SUBMARINE WARFARE (ASW)", short: "ASW", icon: "◉" },
  { name: "ELECTRONIC WARFARE (EW)", short: "EW", icon: "◌" },
  { name: "AIR OPS & ATO", short: "AIR", icon: "✈" },
  { name: "REFERENSI UMUM", short: "UMUM", icon: "▤" },
];
const STARTER_MATERIALS = [
  {
    id: "starter-asuw-1",
    subject: CATEGORIES[0].name,
    module: "TAKTIK ASUW",
    chapter: "PROSEDUR PENEMBAKAN RUDAL",
    type: "MODUL",
    title: "Modul Taktis AsuW - Prosedur Penembakan Rudal",
    url: "",
  },
  {
    id: "starter-asuw-2",
    subject: CATEGORIES[0].name,
    module: "PANDUAN OPERASI",
    chapter: "TEMPUR LAUT",
    type: "MODUL",
    title: "Panduan Operasi Tempur Laut Kapal Kombatan",
    url: "",
  },
  {
    id: "starter-asuw-3",
    subject: CATEGORIES[0].name,
    module: "PANDUAN OPERASI",
    chapter: "TEMPUR LAUT",
    type: "BAHAN AJAR",
    title: "Panduan Operasi Tempur Laut Kapal Kombatan",
    url: "",
  },
  {
    id: "starter-asuw-4",
    subject: CATEGORIES[0].name,
    module: "KOMUNIKASI TAKTIS",
    chapter: "KESIAPAN SENJATA",
    type: "BAHAN AJAR",
    title: "SOP Komunikasi Taktis dan Kesiapan Senjata",
    url: "",
  },
  {
    id: "starter-asuw-5",
    subject: CATEGORIES[0].name,
    module: "PANDUAN OPERASI TEMPUR LAUT",
    chapter: "OPERASI ASUW",
    type: "BAHAN AJAR",
    title: "Panduan Operasi Tempur Laut AsuW",
    url: "",
  },
  {
    id: "starter-asuw-6",
    subject: CATEGORIES[0].name,
    module: "SOP KOMUNIKASI",
    chapter: "KESIAPAN ASUW",
    type: "BAHAN AJAR",
    title: "SOP Komunikasi Kesiapan AsuW",
    url: "",
  },
  {
    id: "starter-asuw-7",
    subject: CATEGORIES[0].name,
    module: "TAKTIK ASUW",
    chapter: "PROSEDUR RUDAL",
    type: "MODUL",
    title: "Modul Taktis AsuW - Prosedur Rudal",
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
let activeCategory = CATEGORIES[0].name;
let editingId = null;
let materials = loadMaterials();

function showStatus(message) {
  statusMessage.textContent = message;
}

function loadMaterials() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) return STARTER_MATERIALS.map((item) => ({ ...item }));
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error("Format data katalog tidak valid.");
    return parsed;
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

function buildCategoryNav() {
  categoryNav.replaceChildren();
  for (const category of CATEGORIES) {
    const button = makeElement("button", "category-button");
    button.type = "button";
    button.classList.toggle("is-active", category.name === activeCategory);
    button.setAttribute("aria-pressed", String(category.name === activeCategory));
    const count = materials.filter((item) => item.subject === category.name).length;
    const icon = makeElement("span", "category-icon", category.icon);
    icon.setAttribute("aria-hidden", "true");
    button.append(
      icon,
      makeElement("span", "category-name", category.name),
      makeElement("span", "category-count", String(count).padStart(2, "0")),
    );
    button.addEventListener("click", () => {
      activeCategory = category.name;
      searchInput.value = "";
      renderLibrary();
    });
    categoryNav.append(button);
  }
}

function filteredMaterials() {
  const query = searchInput.value.trim().toLocaleLowerCase("id");
  return materials.filter((item) => {
    const searchable = [item.subject, item.module, item.chapter, item.title, item.type]
      .join(" ")
      .toLocaleLowerCase("id");
    return item.subject === activeCategory && searchable.includes(query);
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
  const linkState = makeElement("span", `link-state${linked ? " is-linked" : ""}`, linked ? "TAUTAN SIAP" : "BELUM DITAMBAHKAN");

  const action = makeElement("button", `document-action${linked ? " is-linked" : ""}`, linked ? "BUKA DRIVE ↗" : "HUBUNGKAN DRIVE");
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
  const category = CATEGORIES.find((item) => item.name === activeCategory) || CATEGORIES[0];
  categoryTitle.textContent = category.name.replace(` (${category.short})`, "");
  const suffix = ` (${category.short})`;
  if (category.name.includes(suffix)) {
    categoryTitle.append(makeElement("span", "", suffix));
  }
  buildCategoryNav();

  const visible = filteredMaterials();
  documentTotal.textContent = `${visible.length} DOKUMEN`;
  documentGrid.replaceChildren();

  if (visible.length) {
    visible.forEach((item) => documentGrid.append(makeDocumentCard(item)));
    return;
  }

  const isSearching = searchInput.value.trim().length > 0;
  const empty = makeElement("div", "empty-state");
  empty.append(
    makeElement("span", "empty-mark", "⚓"),
    makeElement("h2", "", isSearching ? "Dokumen tidak ditemukan" : "Belum ada dokumen di kategori ini"),
    makeElement("p", "", isSearching
      ? "Coba kata kunci lain atau pilih kategori berbeda."
      : "Tambahkan dokumen dan tautan Drive untuk melengkapi materi kategori ini."),
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
  editingId = item ? item.id : null;
  form.reset();
  formError.textContent = "";
  form.elements.subject.replaceChildren();
  for (const category of CATEGORIES) {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    form.elements.subject.append(option);
  }
  if (item) {
    form.elements.subject.value = item.subject;
    form.elements.module.value = item.module;
    form.elements.chapter.value = item.chapter;
    form.elements.type.value = item.type;
    form.elements.title.value = item.title;
  } else {
    form.elements.subject.value = activeCategory;
  }
  document.querySelector("#dialog-title").textContent = item ? "Hubungkan Google Drive" : "Tambah dokumen";
  dialog.showModal();
  form.elements.url.focus();
}

document.querySelector("#open-dialog").addEventListener("click", () => openDialog());
document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
document.querySelector("#cancel-dialog").addEventListener("click", () => dialog.close());
searchInput.addEventListener("input", renderLibrary);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.textContent = "";
  const values = new FormData(form);
  let url;
  try {
    url = new URL(String(values.get("url")).trim());
  } catch {
    formError.textContent = "Masukkan tautan Google Drive yang valid.";
    return;
  }
  if (url.protocol !== "https:" || !["drive.google.com", "docs.google.com"].includes(url.hostname)) {
    formError.textContent = "Gunakan tautan HTTPS dari drive.google.com atau docs.google.com.";
    return;
  }

  const item = {
    id: editingId || crypto.randomUUID(),
    subject: String(values.get("subject")).trim(),
    module: String(values.get("module")).trim(),
    chapter: String(values.get("chapter")).trim(),
    type: String(values.get("type")),
    title: String(values.get("title")).trim(),
    url: url.href,
  };
  if (Object.values(item).some((value) => !value)) {
    formError.textContent = "Lengkapi semua kolom sebelum menyimpan.";
    return;
  }

  const nextMaterials = editingId
    ? materials.map((material) => material.id === editingId ? item : material)
    : [...materials, item];
  if (saveMaterials(nextMaterials)) {
    activeCategory = item.subject;
    searchInput.value = "";
    renderLibrary();
    dialog.close();
  }
});

renderLibrary();
