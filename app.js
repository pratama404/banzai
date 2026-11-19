/**
 * =========================================================================
 * BANZAI PWO 2026 — DAFTAR MATERI & TAUTAN GOOGLE DRIVE (STATIC / HARDCODED)
 * =========================================================================
 * PANDUAN PENGISIAN TAUTAN GOOGLE DRIVE:
 * - Isi nilai `url` dengan tautan Google Drive dokumen Anda:
 *     url: "https://drive.google.com/file/d/1234567890/view?usp=sharing"
 *
 * - Jika dokumen belum memiliki link, biarkan `url: ""` (string kosong).
 *   Sistem otomatis menampilkan tombol "BELUM TERSEDIA" (nonaktif).
 *
 * - Untuk menambah materi baru, cukup copy salah satu blok objek di bawah
 *   lalu sesuaikan `subject` (isi dengan nama sub-materi atau kategori utama),
 *   `module`, `chapter`, `type`, `title`, dan `url`.
 * =========================================================================
 */

const CATEGORIES = [
  {
    id: "gw",
    code: "1",
    name: "GENERAL WARFARE",
    short: "GW",
    icon: "game-icons:crossed-swords",
    desc: "Bahasa Inggris, Manajemen Tempur, dan Informasi Tempur.",
    subcategories: [
      { id: "gw-inggris", code: "1.1", name: "Bahasa Inggris", label: "Bahasa Inggris", short: "GW" },
      { id: "gw-manajemen", code: "1.2", name: "Manajemen Tempur", label: "Manajemen Tempur", short: "GW" },
      { id: "gw-informasi", code: "1.3", name: "Informasi Tempur", label: "Informasi Tempur", short: "GW" },
    ],
  },
  {
    id: "asuw",
    code: "2",
    name: "ANTI SURFACE WARFARE",
    short: "ASuW",
    icon: "game-icons:battleship",
    desc: "Prosedur Taktis AKPA, Penggunaan Senjata AKPA, Taktik FPB, dan Latihan Simulasi.",
    subcategories: [
      { id: "asuw-prosedur", code: "2.1", name: "Prosedur Taktis AKPA", label: "Prosedur Taktis AKPA", short: "ASuW" },
      { id: "asuw-senjata", code: "2.2", name: "Penggunaan Senjata AKPA", label: "Penggunaan Senjata AKPA", short: "ASuW" },
      { id: "asuw-fpb", code: "2.3", name: "Taktik Peperangan Fast Patrol Boat", label: "Taktik Peperangan Fast Patrol Boat", short: "ASuW" },
      { id: "asuw-simulasi", code: "2.4", name: "Latihan Simulasi Peperangan AKPA", label: "Latihan Simulasi Peperangan AKPA", short: "ASuW" },
    ],
  },
  {
    id: "asw",
    code: "3",
    name: "ANTI SUBMARINE WARFARE",
    short: "ASW",
    icon: "game-icons:submarine",
    desc: "Pengaruh Alam AKS, Prosedur Taktis, Penggunaan Senjata, Operasi Kapal Selam, dan Simulasi.",
    subcategories: [
      { id: "asw-alam", code: "3.1", name: "Pengaruh Alam dalam AKS", label: "Pengaruh Alam dalam AKS", short: "ASW" },
      { id: "asw-prosedur", code: "3.2", name: "Prosedur Taktis AKS", label: "Prosedur Taktis AKS", short: "ASW" },
      { id: "asw-senjata", code: "3.3", name: "Penggunaan Senjata AKS", label: "Penggunaan Senjata AKS", short: "ASW" },
      { id: "asw-kasel", code: "3.4", name: "Operasi Kapal Selam", label: "Operasi Kapal Selam", short: "ASW" },
      { id: "asw-simulasi", code: "3.5", name: "Latihan Simulasi Peperangan AKS", label: "Latihan Simulasi Peperangan AKS", short: "ASW" },
    ],
  },
  {
    id: "aaw",
    code: "4",
    name: "ANTI AIR WARFARE",
    short: "AAW",
    icon: "game-icons:jet-fighter",
    desc: "Prosedur Taktis PAU, ASMD, Penggunaan Senjata Anti Udara, dan Latihan Simulasi PAU.",
    subcategories: [
      { id: "aaw-prosedur", code: "4.1", name: "Prosedur Taktis PAU", label: "Prosedur Taktis PAU", short: "AAW" },
      { id: "aaw-asmd", code: "4.2", name: "Anti Ship Missile Defence (ASMD)", label: "Anti Ship Missile Defence (ASMD)", short: "AAW" },
      { id: "aaw-senjata", code: "4.3", name: "Penggunaan Senjata Anti Udara", label: "Penggunaan Senjata Anti Udara", short: "AAW" },
      { id: "aaw-simulasi", code: "4.4", name: "Latihan Simulasi Peperangan PAU", label: "Latihan Simulasi Peperangan PAU", short: "AAW" },
    ],
  },
  {
    id: "ew",
    code: "5",
    name: "ELECTRONIC WARFARE",
    short: "EW",
    icon: "game-icons:radar-dish",
    desc: "Dasar Pernika dan Pernika.",
    subcategories: [
      { id: "ew-dasar", code: "5.1", name: "Dasar Pernika", label: "Dasar Pernika", short: "EW" },
      { id: "ew-pernika", code: "5.2", name: "Pernika", label: "Pernika", short: "EW" },
    ],
  },
  {
    id: "mw",
    code: "6",
    name: "MINE WARFARE",
    short: "MW",
    icon: "mdi:mine",
    desc: "Operasi ranjau laut, penyebaran ranjau, perburuan ranjau, dan Mine Countermeasures (MCM).",
  },
  {
    id: "ref",
    code: "7",
    name: "REFERENSI UMUM LAINNYA",
    short: "REF",
    icon: "game-icons:bookshelf",
    desc: "Kepustakaan dan referensi doktrin taktis militer internasional.",
    subcategories: [
      { id: "ipwo", code: "7.1", name: "7.1 IPWO INGGRIS", label: "IPWO INGGRIS", short: "IPWO" },
      { id: "cco", code: "7.2", name: "7.2 CCO BELANDA", label: "CCO BELANDA", short: "CCO" },
    ],
  },
];

/**
 * MASTER DATABASE MATERI (HARDCODED)
 * Silakan edit atau tambahkan materi dan link Google Drive langsung di sini.
 * Nilai `subject` disesuaikan dengan nama sub-materi (atau nama kategori utama jika tanpa sub-materi).
 *
 * Catatan link Drive yang sebelumnya tersimpan (untuk referensi copy-paste):
 * - https://docs.google.com/presentation/d/1wAgSmnyXkYHisadrwWVHnS0nLtEB0Zls/present?slide=id.p1#slide=id.p1
 * - https://docs.google.com/presentation/d/1rCt_dSNpU0gGqZAKX8fmMWf6XGygwkIg/present?slide=id.p1#slide=id.p1
 * - https://docs.google.com/presentation/d/1bhbsUlJp7efF1MRlkrojPvLe7tZFtvUu/present?usp=drive_web&ouid=109411807886520144132&rtpof=true
 * - https://docs.google.com/presentation/d/19gXes1ZQ1eVO_DY6X8lY7LiHrhRilE9V/present?usp=drive_web&ouid=109411807886520144132&rtpof=true
 */
const MATERIALS = [
  // ─────────────────────────────────────────────────────────────
  // 1. GENERAL WARFARE (GW)
  // ─────────────────────────────────────────────────────────────
  // Bahasa Inggris
  {
    id: "gw-inggris-1",
    subject: "Bahasa Inggris",
    module: "GENERAL WARFARE",
    chapter: "BAHASA INGGRIS",
    type: "MODUL",
    title: "Performing a short talk",
    url: "",
  },
  {
    id: "gw-inggris-2",
    subject: "Bahasa Inggris",
    module: "GENERAL WARFARE",
    chapter: "BAHASA INGGRIS",
    type: "MODUL",
    title: "Speech Development",
    url: "",
  },
  {
    id: "gw-inggris-3",
    subject: "Bahasa Inggris",
    module: "GENERAL WARFARE",
    chapter: "BAHASA INGGRIS",
    type: "MODUL",
    title: "Participating in the meeting",
    url: "",
  },
  {
    id: "gw-inggris-4",
    subject: "Bahasa Inggris",
    module: "GENERAL WARFARE",
    chapter: "BAHASA INGGRIS",
    type: "MODUL",
    title: "Powerpoint (PPT) development",
    url: "",
  },
  {
    id: "gw-inggris-5",
    subject: "Bahasa Inggris",
    module: "GENERAL WARFARE",
    chapter: "BAHASA INGGRIS",
    type: "MODUL",
    title: "Performing in a Debate",
    url: "",
  },

  // Manajemen Tempur
  {
    id: "gw-manajemen-1",
    subject: "Manajemen Tempur",
    module: "GENERAL WARFARE",
    chapter: "MANAJEMEN TEMPUR",
    type: "MODUL",
    title: "Dinas Informasi Tempur",
    url: "",
  },
  {
    id: "gw-manajemen-2",
    subject: "Manajemen Tempur",
    module: "GENERAL WARFARE",
    chapter: "MANAJEMEN TEMPUR",
    type: "MODUL",
    title: "Aturan Pelibatan (ROE)",
    url: "",
  },
  {
    id: "gw-manajemen-3",
    subject: "Manajemen Tempur",
    module: "GENERAL WARFARE",
    chapter: "MANAJEMEN TEMPUR",
    type: "MODUL",
    title: "Laporan Sergapan (Raid Reporting)",
    url: "",
  },
  {
    id: "gw-manajemen-4",
    subject: "Manajemen Tempur",
    module: "GENERAL WARFARE",
    chapter: "MANAJEMEN TEMPUR",
    type: "MODUL",
    title: "Command, Control, Computer, Communication, Cyber, Intelligence, Surveillance and Reconnaissance (C5ISR)",
    url: "",
  },
  {
    id: "gw-manajemen-5",
    subject: "Manajemen Tempur",
    module: "GENERAL WARFARE",
    chapter: "MANAJEMEN TEMPUR",
    type: "MODUL",
    title: "Peperangan Asimetris",
    url: "",
  },

  // Informasi Tempur
  {
    id: "gw-informasi-1",
    subject: "Informasi Tempur",
    module: "GENERAL WARFARE",
    chapter: "INFORMASI TEMPUR",
    type: "MODUL",
    title: "Pengenalan (Recognition)",
    url: "",
  },
  {
    id: "gw-informasi-2",
    subject: "Informasi Tempur",
    module: "GENERAL WARFARE",
    chapter: "INFORMASI TEMPUR",
    type: "MODUL",
    title: "Kemampuan Regional (Regcap)",
    url: "",
  },
  {
    id: "gw-informasi-3",
    subject: "Informasi Tempur",
    module: "GENERAL WARFARE",
    chapter: "INFORMASI TEMPUR",
    type: "MODUL",
    title: "Intelijen Maritim",
    url: "",
  },
  {
    id: "gw-informasi-4",
    subject: "Informasi Tempur",
    module: "GENERAL WARFARE",
    chapter: "INFORMASI TEMPUR",
    type: "MODUL",
    title: "Komunikasi Pertempuran",
    url: "",
  },
  {
    id: "gw-informasi-5",
    subject: "Informasi Tempur",
    module: "GENERAL WARFARE",
    chapter: "INFORMASI TEMPUR",
    type: "MODUL",
    title: "Meteorologi",
    url: "",
  },

  // ─────────────────────────────────────────────────────────────
  // 2. ANTI SURFACE WARFARE (ASuW)
  // ─────────────────────────────────────────────────────────────
  // Prosedur Taktis AKPA
  {
    id: "asuw-prosedur-1",
    subject: "Prosedur Taktis AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PROSEDUR TAKTIS AKPA",
    type: "MODUL",
    title: "Introduksi AKPA",
    url: "",
  },
  {
    id: "asuw-prosedur-2",
    subject: "Prosedur Taktis AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PROSEDUR TAKTIS AKPA",
    type: "MODUL",
    title: "Perencanaan Operasi AKPA",
    url: "",
  },
  {
    id: "asuw-prosedur-3",
    subject: "Prosedur Taktis AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PROSEDUR TAKTIS AKPA",
    type: "MODUL",
    title: "Kalkulasi Tempur AKPA",
    url: "",
  },
  {
    id: "asuw-prosedur-4",
    subject: "Prosedur Taktis AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PROSEDUR TAKTIS AKPA",
    type: "MODUL",
    title: "Gambaran Taktis AKPA",
    url: "",
  },
  {
    id: "asuw-prosedur-5",
    subject: "Prosedur Taktis AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PROSEDUR TAKTIS AKPA",
    type: "MODUL",
    title: "Proskomtis AKPA",
    url: "",
  },
  {
    id: "asuw-prosedur-6",
    subject: "Prosedur Taktis AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PROSEDUR TAKTIS AKPA",
    type: "MODUL",
    title: "Sensor AKPA",
    url: "",
  },
  {
    id: "asuw-prosedur-7",
    subject: "Prosedur Taktis AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PROSEDUR TAKTIS AKPA",
    type: "MODUL",
    title: "Kerjasama Taktis Pesud dan KAA",
    url: "",
  },
  {
    id: "asuw-prosedur-8",
    subject: "Prosedur Taktis AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PROSEDUR TAKTIS AKPA",
    type: "MODUL",
    title: "Gugus Aksi Permukaan (Surface Action Group)",
    url: "",
  },
  {
    id: "asuw-prosedur-9",
    subject: "Prosedur Taktis AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PROSEDUR TAKTIS AKPA",
    type: "MODUL",
    title: "Over The Horizon Target (Penembakan Sasaran Melewati Cakrawala)",
    url: "",
  },
  {
    id: "asuw-prosedur-10",
    subject: "Prosedur Taktis AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PROSEDUR TAKTIS AKPA",
    type: "MODUL",
    title: "Serangan Jarak Dekat",
    url: "",
  },
  {
    id: "asuw-prosedur-11",
    subject: "Prosedur Taktis AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PROSEDUR TAKTIS AKPA",
    type: "MODUL",
    title: "Pengaruh Alam dalam AKPA",
    url: "",
  },
  {
    id: "asuw-prosedur-12",
    subject: "Prosedur Taktis AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PROSEDUR TAKTIS AKPA",
    type: "MODUL",
    title: "Kodal AKPA",
    url: "",
  },
  {
    id: "asuw-prosedur-13",
    subject: "Prosedur Taktis AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PROSEDUR TAKTIS AKPA",
    type: "MODUL",
    title: "SAR dalam AKPA",
    url: "",
  },

  // Penggunaan Senjata AKPA
  {
    id: "asuw-senjata-1",
    subject: "Penggunaan Senjata AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PENGGUNAAN SENJATA AKPA",
    type: "MODUL",
    title: "Penggunaan Meriam AKPA dan BTK",
    url: "",
  },
  {
    id: "asuw-senjata-2",
    subject: "Penggunaan Senjata AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "PENGGUNAAN SENJATA AKPA",
    type: "MODUL",
    title: "Penggunaan Rudal",
    url: "",
  },

  // Taktik Peperangan Fast Patrol Boat
  {
    id: "asuw-fpb-1",
    subject: "Taktik Peperangan Fast Patrol Boat",
    module: "ANTI SURFACE WARFARE",
    chapter: "TAKTIK PEPERANGAN FAST PATROL BOAT",
    type: "MODUL",
    title: "Operasi FPB",
    url: "",
  },
  {
    id: "asuw-fpb-2",
    subject: "Taktik Peperangan Fast Patrol Boat",
    module: "ANTI SURFACE WARFARE",
    chapter: "TAKTIK PEPERANGAN FAST PATROL BOAT",
    type: "MODUL",
    title: "Anti FPB",
    url: "",
  },

  // Latihan Simulasi Peperangan AKPA
  {
    id: "asuw-simulasi-1",
    subject: "Latihan Simulasi Peperangan AKPA",
    module: "ANTI SURFACE WARFARE",
    chapter: "LATIHAN SIMULASI PEPERANGAN AKPA",
    type: "MODUL",
    title: "Latihan Simulasi Peperangan AKPA",
    url: "",
  },

  // ─────────────────────────────────────────────────────────────
  // 3. ANTI SUBMARINE WARFARE (ASW)
  // ─────────────────────────────────────────────────────────────
  // Pengaruh Alam dalam AKS
  {
    id: "asw-alam-1",
    subject: "Pengaruh Alam dalam AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PENGARUH ALAM DALAM AKS",
    type: "MODUL",
    title: "Hidro Oceanografi dalam AKS",
    url: "",
  },
  {
    id: "asw-alam-2",
    subject: "Pengaruh Alam dalam AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PENGARUH ALAM DALAM AKS",
    type: "MODUL",
    title: "Propagasi Bawah Air",
    url: "",
  },

  // Prosedur Taktis AKS
  {
    id: "asw-prosedur-1",
    subject: "Prosedur Taktis AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PROSEDUR TAKTIS AKS",
    type: "MODUL",
    title: "Introduksi AKS",
    url: "",
  },
  {
    id: "asw-prosedur-2",
    subject: "Prosedur Taktis AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PROSEDUR TAKTIS AKS",
    type: "MODUL",
    title: "Perencanaan Operasi AKS",
    url: "",
  },
  {
    id: "asw-prosedur-3",
    subject: "Prosedur Taktis AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PROSEDUR TAKTIS AKS",
    type: "MODUL",
    title: "Gambaran Taktis AKS",
    url: "",
  },
  {
    id: "asw-prosedur-4",
    subject: "Prosedur Taktis AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PROSEDUR TAKTIS AKS",
    type: "MODUL",
    title: "Proskomtis AKS",
    url: "",
  },
  {
    id: "asw-prosedur-5",
    subject: "Prosedur Taktis AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PROSEDUR TAKTIS AKS",
    type: "MODUL",
    title: "Sensor AKS",
    url: "",
  },
  {
    id: "asw-prosedur-6",
    subject: "Prosedur Taktis AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PROSEDUR TAKTIS AKS",
    type: "MODUL",
    title: "Kerjasama Taktis AKS",
    url: "",
  },
  {
    id: "asw-prosedur-7",
    subject: "Prosedur Taktis AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PROSEDUR TAKTIS AKS",
    type: "MODUL",
    title: "Aksi AKS",
    url: "",
  },
  {
    id: "asw-prosedur-8",
    subject: "Prosedur Taktis AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PROSEDUR TAKTIS AKS",
    type: "MODUL",
    title: "Anti Ship Torpedo Defence (ASTD)",
    url: "",
  },
  {
    id: "asw-prosedur-9",
    subject: "Prosedur Taktis AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PROSEDUR TAKTIS AKS",
    type: "MODUL",
    title: "SAU/ASAU",
    url: "",
  },
  {
    id: "asw-prosedur-10",
    subject: "Prosedur Taktis AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PROSEDUR TAKTIS AKS",
    type: "MODUL",
    title: "Tabir AKS",
    url: "",
  },
  {
    id: "asw-prosedur-11",
    subject: "Prosedur Taktis AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PROSEDUR TAKTIS AKS",
    type: "MODUL",
    title: "Kodal AKS",
    url: "",
  },
  {
    id: "asw-prosedur-12",
    subject: "Prosedur Taktis AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PROSEDUR TAKTIS AKS",
    type: "MODUL",
    title: "Introduksi Coordinated Anti Submarine Exercise (CASEX)",
    url: "",
  },
  {
    id: "asw-prosedur-13",
    subject: "Prosedur Taktis AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PROSEDUR TAKTIS AKS",
    type: "MODUL",
    title: "Water Space Management (WSM)",
    url: "",
  },

  // Penggunaan Senjata AKS
  {
    id: "asw-senjata-1",
    subject: "Penggunaan Senjata AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PENGGUNAAN SENJATA AKS",
    type: "MODUL",
    title: "Penggunaan Torpedo",
    url: "",
  },
  {
    id: "asw-senjata-2",
    subject: "Penggunaan Senjata AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "PENGGUNAAN SENJATA AKS",
    type: "MODUL",
    title: "Penggunaan Roket dan Bom AKS",
    url: "",
  },

  // Operasi Kapal Selam
  {
    id: "asw-kasel-1",
    subject: "Operasi Kapal Selam",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "OPERASI KAPAL SELAM",
    type: "MODUL",
    title: "Taktik KS",
    url: "",
  },
  {
    id: "asw-kasel-2",
    subject: "Operasi Kapal Selam",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "OPERASI KAPAL SELAM",
    type: "MODUL",
    title: "Pengoperasian KS",
    url: "",
  },

  // Latihan Simulasi Peperangan AKS
  {
    id: "asw-simulasi-1",
    subject: "Latihan Simulasi Peperangan AKS",
    module: "ANTI SUBMARINE WARFARE",
    chapter: "LATIHAN SIMULASI PEPERANGAN AKS",
    type: "MODUL",
    title: "Latihan Simulasi Peperangan AKS",
    url: "",
  },

  // ─────────────────────────────────────────────────────────────
  // 4. ANTI AIR WARFARE (AAW)
  // ─────────────────────────────────────────────────────────────
  // Prosedur Taktis PAU
  {
    id: "aaw-prosedur-1",
    subject: "Prosedur Taktis PAU",
    module: "ANTI AIR WARFARE",
    chapter: "PROSEDUR TAKTIS PAU",
    type: "MODUL",
    title: "Introduksi PAU",
    url: "",
  },
  {
    id: "aaw-prosedur-2",
    subject: "Prosedur Taktis PAU",
    module: "ANTI AIR WARFARE",
    chapter: "PROSEDUR TAKTIS PAU",
    type: "MODUL",
    title: "Perencanaan Operasi PAU",
    url: "",
  },
  {
    id: "aaw-prosedur-3",
    subject: "Prosedur Taktis PAU",
    module: "ANTI AIR WARFARE",
    chapter: "PROSEDUR TAKTIS PAU",
    type: "MODUL",
    title: "Gambaran Taktis PAU",
    url: "",
  },
  {
    id: "aaw-prosedur-4",
    subject: "Prosedur Taktis PAU",
    module: "ANTI AIR WARFARE",
    chapter: "PROSEDUR TAKTIS PAU",
    type: "MODUL",
    title: "Proskomtis PAU",
    url: "",
  },
  {
    id: "aaw-prosedur-5",
    subject: "Prosedur Taktis PAU",
    module: "ANTI AIR WARFARE",
    chapter: "PROSEDUR TAKTIS PAU",
    type: "MODUL",
    title: "Sensor PAU",
    url: "",
  },
  {
    id: "aaw-prosedur-6",
    subject: "Prosedur Taktis PAU",
    module: "ANTI AIR WARFARE",
    chapter: "PROSEDUR TAKTIS PAU",
    type: "MODUL",
    title: "Kerjasama Taktis Pesud dan KAA",
    url: "",
  },
  {
    id: "aaw-prosedur-7",
    subject: "Prosedur Taktis PAU",
    module: "ANTI AIR WARFARE",
    chapter: "PROSEDUR TAKTIS PAU",
    type: "MODUL",
    title: "Kodal PAU",
    url: "",
  },
  {
    id: "aaw-prosedur-8",
    subject: "Prosedur Taktis PAU",
    module: "ANTI AIR WARFARE",
    chapter: "PROSEDUR TAKTIS PAU",
    type: "MODUL",
    title: "Weapon Coordination",
    url: "",
  },

  // Anti Ship Missile Defence (ASMD)
  {
    id: "aaw-asmd-1",
    subject: "Anti Ship Missile Defence (ASMD)",
    module: "ANTI AIR WARFARE",
    chapter: "ANTI SHIP MISSILE DEFENCE (ASMD)",
    type: "MODUL",
    title: "ASMD Unit",
    url: "",
  },
  {
    id: "aaw-asmd-2",
    subject: "Anti Ship Missile Defence (ASMD)",
    module: "ANTI AIR WARFARE",
    chapter: "ANTI SHIP MISSILE DEFENCE (ASMD)",
    type: "MODUL",
    title: "ASMD Gugus Tugas",
    url: "",
  },
  {
    id: "aaw-asmd-3",
    subject: "Anti Ship Missile Defence (ASMD)",
    module: "ANTI AIR WARFARE",
    chapter: "ANTI SHIP MISSILE DEFENCE (ASMD)",
    type: "MODUL",
    title: "Zippo System",
    url: "",
  },

  // Penggunaan Senjata Anti Udara
  {
    id: "aaw-senjata-1",
    subject: "Penggunaan Senjata Anti Udara",
    module: "ANTI AIR WARFARE",
    chapter: "PENGGUNAAN SENJATA ANTI UDARA",
    type: "MODUL",
    title: "Penggunaan Meriam Anti Udara",
    url: "",
  },
  {
    id: "aaw-senjata-2",
    subject: "Penggunaan Senjata Anti Udara",
    module: "ANTI AIR WARFARE",
    chapter: "PENGGUNAAN SENJATA ANTI UDARA",
    type: "MODUL",
    title: "Penggunaan Rudal Anti Udara",
    url: "",
  },
  {
    id: "aaw-senjata-3",
    subject: "Penggunaan Senjata Anti Udara",
    module: "ANTI AIR WARFARE",
    chapter: "PENGGUNAAN SENJATA ANTI UDARA",
    type: "MODUL",
    title: "Penggunaan Decoy",
    url: "",
  },

  // Latihan Simulasi Peperangan PAU
  {
    id: "aaw-simulasi-1",
    subject: "Latihan Simulasi Peperangan PAU",
    module: "ANTI AIR WARFARE",
    chapter: "LATIHAN SIMULASI PEPERANGAN PAU",
    type: "MODUL",
    title: "Latihan Simulasi Peperangan PAU",
    url: "",
  },

  // ─────────────────────────────────────────────────────────────
  // 5. ELECTRONIC WARFARE (EW)
  // ─────────────────────────────────────────────────────────────
  // Dasar Pernika
  {
    id: "ew-dasar-1",
    subject: "Dasar Pernika",
    module: "ELECTRONIC WARFARE",
    chapter: "DASAR PERNIKA",
    type: "MODUL",
    title: "Gelombang Elektromagnetik",
    url: "",
  },
  {
    id: "ew-dasar-2",
    subject: "Dasar Pernika",
    module: "ELECTRONIC WARFARE",
    chapter: "DASAR PERNIKA",
    type: "MODUL",
    title: "Teori Radar",
    url: "",
  },

  // Pernika
  {
    id: "ew-pernika-1",
    subject: "Pernika",
    module: "ELECTRONIC WARFARE",
    chapter: "PERNIKA",
    type: "MODUL",
    title: "Electronic Support (ES)",
    url: "",
  },
  {
    id: "ew-pernika-2",
    subject: "Pernika",
    module: "ELECTRONIC WARFARE",
    chapter: "PERNIKA",
    type: "MODUL",
    title: "Electronic Attack (EA)",
    url: "",
  },
  {
    id: "ew-pernika-3",
    subject: "Pernika",
    module: "ELECTRONIC WARFARE",
    chapter: "PERNIKA",
    type: "MODUL",
    title: "Electronic Protective (EP)",
    url: "",
  },

  // ─────────────────────────────────────────────────────────────
  // 6. MINE WARFARE (MW) — Peperangan Ranjau
  // ─────────────────────────────────────────────────────────────
  {
    id: "mw-1",
    subject: "MINE WARFARE",
    module: "MINE WARFARE",
    chapter: "PEPERANGAN RANJAU",
    type: "MODUL",
    title: "Introduksi Peperangan Ranjau",
    url: "",
  },
  {
    id: "mw-2",
    subject: "MINE WARFARE",
    module: "MINE WARFARE",
    chapter: "PEPERANGAN RANJAU",
    type: "MODUL",
    title: "Tindakan Perlawanan Ranjau",
    url: "",
  },

  // ─────────────────────────────────────────────────────────────
  // 7. REFERENSI UMUM LAINNYA
  // ─────────────────────────────────────────────────────────────
  // IPWO INGGRIS
  {
    id: "ref-ipwo-1",
    subject: "7.1 IPWO INGGRIS",
    module: "ROYAL NAVY IPWO",
    chapter: "WARFARE TACTICS MANUAL",
    type: "REFERENSI",
    title: "Royal Navy IPWO Handbook - Maritime Tactical Command & Warfare Principles",
    url: "",
  },
  {
    id: "ref-ipwo-2",
    subject: "7.1 IPWO INGGRIS",
    module: "INTERNATIONAL PWO",
    chapter: "AIR DEFENCE & TASK FORCE OPS",
    type: "MODUL",
    title: "IPWO UK Doctrine - Fleet Air Defence & Battle Group Integration",
    url: "",
  },

  // CCO BELANDA
  {
    id: "ref-cco-1",
    subject: "7.2 CCO BELANDA",
    module: "RNLN CCO MANUAL",
    chapter: "COMMAND & CONTROL DOCTRINE",
    type: "REFERENSI",
    title: "Royal Netherlands Navy CCO Manual - Command & Control Officer Operations",
    url: "",
  },
  {
    id: "ref-cco-2",
    subject: "7.2 CCO BELANDA",
    module: "TACTICAL PROCEDURES",
    chapter: "COMBAT INFORMATION CENTER",
    type: "BAHAN AJAR",
    title: "CCO Netherlands Navy - Combat Information Center (CIC) Organization & SOP",
    url: "",
  },
];

// DOM Elements
const categoryNav = document.querySelector("#category-nav");
const documentGrid = document.querySelector("#document-grid");
const documentTotal = document.querySelector("#document-total");
const categoryTitle = document.querySelector("#category-title");
const searchInput = document.querySelector("#search");

// Helper: find parent category of a given activeCategory name
function findParentCategory(targetName) {
  for (const cat of CATEGORIES) {
    if (cat.name === targetName) return cat;
    if (cat.subcategories && cat.subcategories.some((s) => s.name === targetName)) {
      return cat;
    }
  }
  return CATEGORIES[0];
}

// Parse URL query parameter: ?cat=0..6, ?cat=gw, ?cat=asuw, ?cat=7.1, ?cat=gw-inggris, etc.
const urlParams = new URLSearchParams(window.location.search);
const catParam = urlParams.get("cat");
let initialCategory = CATEGORIES[0].name;

if (catParam !== null) {
  const cleanParam = catParam.trim().toLowerCase();
  let matched = null;

  // Check subcategories first (by id, code, or short)
  for (const cat of CATEGORIES) {
    if (cat.subcategories) {
      const sub = cat.subcategories.find(
        (s) => s.id === cleanParam || s.code === cleanParam,
      );
      if (sub) {
        matched = sub.name;
        break;
      }
    }
  }

  if (matched) {
    initialCategory = matched;
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
const initialParent = findParentCategory(activeCategory);
const expandedGroups = new Set(initialParent && initialParent.subcategories ? [initialParent.id] : []);

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function makeIcon(iconName) {
  const wrapper = makeElement("span", "category-icon");
  wrapper.setAttribute("aria-hidden", "true");
  const iconEl = document.createElement("iconify-icon");
  iconEl.setAttribute("icon", iconName);
  wrapper.append(iconEl);
  return wrapper;
}

function itemMatchesCategory(item, targetCategory) {
  const itemSubject = item.subject || "";
  const mainCat = CATEGORIES.find((c) => c.name === targetCategory);
  if (mainCat) {
    if (itemSubject === mainCat.name) return true;
    if (mainCat.subcategories) {
      return mainCat.subcategories.some((sub) => itemSubject === sub.name);
    }
    return false;
  }
  return itemSubject === targetCategory;
}

function buildCategoryNav() {
  if (!categoryNav) return;
  categoryNav.replaceChildren();

  for (const category of CATEGORIES) {
    if (category.subcategories && category.subcategories.length > 0) {
      const isOpen = expandedGroups.has(category.id);
      const isMainActive = activeCategory === category.name;
      const hasActiveChild = category.subcategories.some((s) => s.name === activeCategory);

      const group = makeElement("div", `category-group${isOpen ? " is-open" : ""}`);

      const mainButton = makeElement("button", "category-button");
      mainButton.type = "button";
      mainButton.classList.toggle("is-active", isMainActive);
      mainButton.classList.toggle("has-active-child", !isMainActive && hasActiveChild);
      mainButton.setAttribute("aria-expanded", String(isOpen));
      mainButton.setAttribute("aria-pressed", String(isMainActive));

      const icon = makeIcon(category.icon);

      const chevron = makeElement("span", "category-chevron", "▾");
      chevron.setAttribute("aria-hidden", "true");

      mainButton.append(
        icon,
        makeElement("span", "category-name", category.name),
        chevron,
      );

      mainButton.addEventListener("click", () => {
        if (isOpen && isMainActive) {
          expandedGroups.delete(category.id);
        } else {
          expandedGroups.add(category.id);
          activeCategory = category.name;
          if (searchInput) searchInput.value = "";
        }
        renderLibrary();
      });

      group.append(mainButton);

      // Collapsible dropdown subnav
      const subNav = makeElement("div", "category-subnav");
      const subNavInner = makeElement("div", "category-subnav-inner");

      for (const sub of category.subcategories) {
        const subButton = makeElement("button", "category-subbutton");
        subButton.type = "button";
        const isSubActive = activeCategory === sub.name;
        subButton.classList.toggle("is-active", isSubActive);
        subButton.setAttribute("aria-pressed", String(isSubActive));

        const bullet = makeElement("span", "subnav-bullet", "↳");
        bullet.setAttribute("aria-hidden", "true");

        subButton.append(
          bullet,
          makeElement("span", "category-name", sub.label),
        );

        subButton.addEventListener("click", () => {
          expandedGroups.add(category.id);
          activeCategory = sub.name;
          if (searchInput) searchInput.value = "";
          renderLibrary();
        });

        subNavInner.append(subButton);
      }

      subNav.append(subNavInner);
      group.append(subNav);
      categoryNav.append(group);
    } else {
      // Category without subcategories (e.g. MINE WARFARE)
      const button = makeElement("button", "category-button");
      button.type = "button";
      const isActive = activeCategory === category.name;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));

      const icon = makeIcon(category.icon);

      button.append(
        icon,
        makeElement("span", "category-name", category.name),
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
  return MATERIALS.filter((item) => {
    const matchesCat = itemMatchesCategory(item, activeCategory);
    if (!matchesCat) return false;
    if (!query) return true;
    const searchable = [item.subject, item.module, item.chapter, item.title, item.type]
      .join(" ")
      .toLocaleLowerCase("id");
    return searchable.includes(query);
  });
}

function makeDocumentCard(item, index) {
  const card = makeElement("article", "document-card");
  const number = makeElement("span", "document-index", String(index + 1).padStart(2, "0"));
  number.setAttribute("aria-hidden", "true");
  const title = makeElement("h2", "document-title", item.title);

  const hasLink = Boolean(item.url && item.url.trim().length > 0);
  const action = makeElement(hasLink ? "a" : "span", `document-action ${hasLink ? "is-linked" : "is-disabled"}`);
  const label = makeElement("span", "document-action__label", hasLink ? "BUKA DOKUMEN" : "BELUM TERSEDIA");
  const icon = makeElement("span", "document-action__icon");
  icon.setAttribute("aria-hidden", "true");
  icon.append(makeElement("span", "", hasLink ? "↗" : "—"));
  action.append(label, icon);

  if (hasLink) {
    action.href = item.url;
    action.target = "_blank";
    action.rel = "noopener noreferrer";
  } else {
    action.setAttribute("aria-disabled", "true");
    action.title = "Dokumen ini belum memiliki tautan";
  }

  card.append(number, title, action);
  return card;
}

function renderLibrary() {
  if (!documentGrid) return;

  let displayTitle = activeCategory;
  let displaySuffix = "";

  const mainCategory = CATEGORIES.find((c) => c.name === activeCategory);
  if (mainCategory) {
    displayTitle = mainCategory.name;
    displaySuffix = ` (${mainCategory.short})`;
  } else {
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
    visible.forEach((item, i) => documentGrid.append(makeDocumentCard(item, i)));
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
        : "Dokumen untuk kategori ini sedang dipersiapkan.",
    ),
  );
  documentGrid.append(empty);
}

if (searchInput) {
  searchInput.addEventListener("input", renderLibrary);
}

// Initial render
renderLibrary();
