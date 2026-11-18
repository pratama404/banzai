const STORAGE_KEY = "banzai-vademecum-materials";
const materialsContainer = document.querySelector("#library-content");
const searchInput = document.querySelector("#search");
const statusMessage = document.querySelector("#status-message");
const dialog = document.querySelector("#material-dialog");
const form = document.querySelector("#material-form");
const formError = document.querySelector("#form-error");
const filterButtons = [...document.querySelectorAll(".filter-chip")];
let activeFilter = "Semua";
let materials = loadMaterials();

function showStatus(message) {
  statusMessage.textContent = message;
}

function loadMaterials() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error("Format data perpustakaan tidak valid.");
    return parsed;
  } catch (error) {
    showStatus(`Data lokal tidak dapat dibaca: ${error.message}`);
    return [];
  }
}

function saveMaterials(nextMaterials) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMaterials));
    materials = nextMaterials;
    showStatus("");
    renderMaterials();
    return true;
  } catch (error) {
    showStatus(`Materi tidak dapat disimpan di browser ini: ${error.message}`);
    return false;
  }
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function filteredMaterials() {
  const query = searchInput.value.trim().toLocaleLowerCase("id");
  return materials.filter((item) => {
    const matchesType = activeFilter === "Semua" || item.type === activeFilter;
    const searchable = [item.subject, item.module, item.chapter, item.title, item.type]
      .join(" ")
      .toLocaleLowerCase("id");
    return matchesType && searchable.includes(query);
  });
}

function makeResource(item) {
  const card = makeElement("article", "resource");
  const icon = makeElement("span", "resource-type", item.type === "Latihan" ? "✎" : item.type === "Catatan teman" ? "✦" : "文");
  icon.setAttribute("aria-hidden", "true");

  const info = makeElement("span", "resource-info");
  info.append(makeElement("strong", "", item.title), makeElement("span", "", item.type));

  const openLink = makeElement("a", "resource-open", "↗");
  openLink.href = item.url;
  openLink.target = "_blank";
  openLink.rel = "noopener noreferrer";
  openLink.setAttribute("aria-label", `Buka ${item.title} di Google Drive`);

  const removeButton = makeElement("button", "remove-resource", "Hapus");
  removeButton.type = "button";
  removeButton.setAttribute("aria-label", `Hapus tautan ${item.title}`);
  removeButton.addEventListener("click", () => {
    if (!window.confirm(`Hapus tautan "${item.title}" dari perpustakaan ini?`)) return;
    saveMaterials(materials.filter((material) => material.id !== item.id));
  });

  card.append(icon, info, openLink, removeButton);
  return card;
}

function updateStats() {
  const subjects = new Set(materials.map((item) => item.subject));
  const chapters = new Set(materials.map((item) => `${item.subject}\u0000${item.module}\u0000${item.chapter}`));
  document.querySelector("#subject-count").textContent = subjects.size;
  document.querySelector("#chapter-count").textContent = chapters.size;
  document.querySelector("#link-count").textContent = materials.length;
}

function renderMaterials() {
  updateStats();
  materialsContainer.replaceChildren();
  const visibleMaterials = filteredMaterials();

  if (materials.length === 0) {
    const empty = makeElement("div", "empty-state");
    empty.append(
      makeElement("span", "empty-mark", "卍"),
      makeElement("h3", "", "Mulai susun materi kelas"),
      makeElement("p", "", "Tambahkan tautan Google Drive, lalu kelompokkan per mapel, submateri, dan bab. Materi yang kamu tambahkan tersimpan di browser ini."),
    );
    const addButton = makeElement("button", "primary-button", "Tambahkan materi pertama ↗");
    addButton.type = "button";
    addButton.addEventListener("click", openDialog);
    empty.append(addButton);
    materialsContainer.append(empty);
    return;
  }

  if (visibleMaterials.length === 0) {
    materialsContainer.append(makeElement("p", "no-results", "Belum ada materi yang cocok. Coba kata kunci atau filter lain."));
    return;
  }

  const subjects = groupBy(visibleMaterials, "subject");
  let subjectIndex = 0;
  for (const [subject, subjectItems] of subjects) {
    subjectIndex += 1;
    const subjectCard = document.createElement("details");
    subjectCard.className = "subject-card";
    subjectCard.open = true;

    const summary = document.createElement("summary");
    summary.append(
      makeElement("span", "subject-number", String(subjectIndex).padStart(2, "0")),
      makeElement("span", "subject-title", subject),
      makeElement("span", "subject-count", `${subjectItems.length} TAUTAN`),
    );

    const subjectBody = makeElement("div", "subject-body");
    const modules = groupBy(subjectItems, "module");
    for (const [module, moduleItems] of modules) {
      const moduleDetails = document.createElement("details");
      moduleDetails.className = "module";
      moduleDetails.open = true;
      const moduleSummary = document.createElement("summary");
      moduleSummary.textContent = module;
      moduleDetails.append(moduleSummary);

      const chapters = groupBy(moduleItems, "chapter");
      for (const [chapter, chapterItems] of chapters) {
        const chapterSection = makeElement("section", "chapter");
        chapterSection.append(makeElement("h4", "chapter-title", chapter));
        const resourceList = makeElement("div", "resource-list");
        chapterItems.forEach((item) => resourceList.append(makeResource(item)));
        chapterSection.append(resourceList);
        moduleDetails.append(chapterSection);
      }
      subjectBody.append(moduleDetails);
    }

    subjectCard.append(summary, subjectBody);
    materialsContainer.append(subjectCard);
  }
}

function groupBy(items, key) {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item[key])) groups.set(item[key], []);
    groups.get(item[key]).push(item);
  }
  return groups;
}

function openDialog() {
  formError.textContent = "";
  dialog.showModal();
  form.elements.subject.focus();
}

document.querySelector("#open-dialog").addEventListener("click", openDialog);
document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
document.querySelector("#cancel-dialog").addEventListener("click", () => dialog.close());
searchInput.addEventListener("input", renderMaterials);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderMaterials();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !dialog.open && !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.textContent = "";
  const values = new FormData(form);
  const urlValue = String(values.get("url")).trim();
  let url;
  try {
    url = new URL(urlValue);
  } catch {
    formError.textContent = "Masukkan tautan Google Drive yang valid.";
    return;
  }

  if (url.protocol !== "https:" || !["drive.google.com", "docs.google.com"].includes(url.hostname)) {
    formError.textContent = "Gunakan tautan HTTPS dari drive.google.com atau docs.google.com.";
    return;
  }

  const item = {
    id: crypto.randomUUID(),
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

  if (saveMaterials([...materials, item])) {
    form.reset();
    dialog.close();
  }
});

renderMaterials();
