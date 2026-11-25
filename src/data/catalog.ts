export interface Subcategory {
  id: string;
  code: string;
  name: string;
  label: string;
  short: string;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  short: string;
  icon: string;
  desc: string;
  subcategories?: Subcategory[];
}

export interface MaterialLinks {
  module?: string;
  lessons?: string;
  [key: string]: string | undefined;
}

export interface MaterialItem {
  id: string;
  subject: string;
  module: string;
  chapter: string;
  type: string;
  title: string;
  links: MaterialLinks;
}

export const CATEGORIES: Category[] = [
  {
    "id": "gw",
    "code": "1",
    "name": "GENERAL WARFARE",
    "short": "GW",
    "icon": "game-icons:crossed-swords",
    "desc": "Bahasa Inggris, Manajemen Tempur, dan Informasi Tempur.",
    "subcategories": [
      {
        "id": "gw-inggris",
        "code": "1.1",
        "name": "Bahasa Inggris",
        "label": "Bahasa Inggris",
        "short": "GW"
      },
      {
        "id": "gw-manajemen",
        "code": "1.2",
        "name": "Manajemen Tempur",
        "label": "Manajemen Tempur",
        "short": "GW"
      },
      {
        "id": "gw-informasi",
        "code": "1.3",
        "name": "Informasi Tempur",
        "label": "Informasi Tempur",
        "short": "GW"
      }
    ]
  },
  {
    "id": "asuw",
    "code": "2",
    "name": "ANTI SURFACE WARFARE",
    "short": "ASuW",
    "icon": "game-icons:battleship",
    "desc": "Prosedur Taktis AKPA, Penggunaan Senjata AKPA, Taktik FPB, dan Latihan Simulasi.",
    "subcategories": [
      {
        "id": "asuw-prosedur",
        "code": "2.1",
        "name": "Prosedur Taktis AKPA",
        "label": "Prosedur Taktis AKPA",
        "short": "ASuW"
      },
      {
        "id": "asuw-senjata",
        "code": "2.2",
        "name": "Penggunaan Senjata AKPA",
        "label": "Penggunaan Senjata AKPA",
        "short": "ASuW"
      },
      {
        "id": "asuw-fpb",
        "code": "2.3",
        "name": "Taktik Peperangan Fast Patrol Boat",
        "label": "Taktik Peperangan Fast Patrol Boat",
        "short": "ASuW"
      },
      {
        "id": "asuw-simulasi",
        "code": "2.4",
        "name": "Latihan Simulasi Peperangan AKPA",
        "label": "Latihan Simulasi Peperangan AKPA",
        "short": "ASuW"
      }
    ]
  },
  {
    "id": "asw",
    "code": "3",
    "name": "ANTI SUBMARINE WARFARE",
    "short": "ASW",
    "icon": "game-icons:submarine",
    "desc": "Pengaruh Alam AKS, Prosedur Taktis, Penggunaan Senjata, Operasi Kapal Selam, dan Simulasi.",
    "subcategories": [
      {
        "id": "asw-alam",
        "code": "3.1",
        "name": "Pengaruh Alam dalam AKS",
        "label": "Pengaruh Alam dalam AKS",
        "short": "ASW"
      },
      {
        "id": "asw-prosedur",
        "code": "3.2",
        "name": "Prosedur Taktis AKS",
        "label": "Prosedur Taktis AKS",
        "short": "ASW"
      },
      {
        "id": "asw-senjata",
        "code": "3.3",
        "name": "Penggunaan Senjata AKS",
        "label": "Penggunaan Senjata AKS",
        "short": "ASW"
      },
      {
        "id": "asw-kasel",
        "code": "3.4",
        "name": "Operasi Kapal Selam",
        "label": "Operasi Kapal Selam",
        "short": "ASW"
      },
      {
        "id": "asw-simulasi",
        "code": "3.5",
        "name": "Latihan Simulasi Peperangan AKS",
        "label": "Latihan Simulasi Peperangan AKS",
        "short": "ASW"
      }
    ]
  },
  {
    "id": "aaw",
    "code": "4",
    "name": "ANTI AIR WARFARE",
    "short": "AAW",
    "icon": "game-icons:jet-fighter",
    "desc": "Prosedur Taktis PAU, ASMD, Penggunaan Senjata Anti Udara, dan Latihan Simulasi PAU.",
    "subcategories": [
      {
        "id": "aaw-prosedur",
        "code": "4.1",
        "name": "Prosedur Taktis PAU",
        "label": "Prosedur Taktis PAU",
        "short": "AAW"
      },
      {
        "id": "aaw-asmd",
        "code": "4.2",
        "name": "Anti Ship Missile Defence (ASMD)",
        "label": "Anti Ship Missile Defence (ASMD)",
        "short": "AAW"
      },
      {
        "id": "aaw-senjata",
        "code": "4.3",
        "name": "Penggunaan Senjata Anti Udara",
        "label": "Penggunaan Senjata Anti Udara",
        "short": "AAW"
      },
      {
        "id": "aaw-simulasi",
        "code": "4.4",
        "name": "Latihan Simulasi Peperangan PAU",
        "label": "Latihan Simulasi Peperangan PAU",
        "short": "AAW"
      }
    ]
  },
  {
    "id": "ew",
    "code": "5",
    "name": "ELECTRONIC WARFARE",
    "short": "EW",
    "icon": "game-icons:radar-dish",
    "desc": "Dasar Pernika dan Pernika.",
    "subcategories": [
      {
        "id": "ew-dasar",
        "code": "5.1",
        "name": "Dasar Pernika",
        "label": "Dasar Pernika",
        "short": "EW"
      },
      {
        "id": "ew-pernika",
        "code": "5.2",
        "name": "Pernika",
        "label": "Pernika",
        "short": "EW"
      }
    ]
  },
  {
    "id": "mw",
    "code": "6",
    "name": "MINE WARFARE",
    "short": "MW",
    "icon": "mdi:mine",
    "desc": "Operasi ranjau laut, penyebaran ranjau, perburuan ranjau, dan Mine Countermeasures (MCM)."
  },
  {
    "id": "ref",
    "code": "7",
    "name": "REFERENSI UMUM LAINNYA",
    "short": "REF",
    "icon": "game-icons:bookshelf",
    "desc": "Kepustakaan dan referensi doktrin taktis militer internasional.",
    "subcategories": [
      {
        "id": "ipwo",
        "code": "7.1",
        "name": "7.1 IPWO INGGRIS",
        "label": "IPWO INGGRIS",
        "short": "IPWO"
      },
      {
        "id": "cco",
        "code": "7.2",
        "name": "7.2 CCO BELANDA",
        "label": "CCO BELANDA",
        "short": "CCO"
      }
    ]
  }
];

export const MATERIALS: MaterialItem[] = [
  {
    "id": "gw-inggris-1",
    "subject": "Bahasa Inggris",
    "module": "GENERAL WARFARE",
    "chapter": "BAHASA INGGRIS",
    "type": "MODUL",
    "title": "Performing a short talk",
    "links": {
      "module": "",
      "lessons": ""
    }
  },
  {
    "id": "gw-inggris-2",
    "subject": "Bahasa Inggris",
    "module": "GENERAL WARFARE",
    "chapter": "BAHASA INGGRIS",
    "type": "MODUL",
    "title": "Speech Development",
    "links": {
      "module": "",
      "lessons": ""
    }
  },
  {
    "id": "gw-inggris-3",
    "subject": "Bahasa Inggris",
    "module": "GENERAL WARFARE",
    "chapter": "BAHASA INGGRIS",
    "type": "MODUL",
    "title": "Participating in the meeting",
    "links": {
      "module": "",
      "lessons": ""
    }
  },
  {
    "id": "gw-inggris-4",
    "subject": "Bahasa Inggris",
    "module": "GENERAL WARFARE",
    "chapter": "BAHASA INGGRIS",
    "type": "MODUL",
    "title": "Powerpoint (PPT) development",
    "links": {
      "module": "",
      "lessons": ""
    }
  },
  {
    "id": "gw-inggris-5",
    "subject": "Bahasa Inggris",
    "module": "GENERAL WARFARE",
    "chapter": "BAHASA INGGRIS",
    "type": "MODUL",
    "title": "Performing in a Debate",
    "links": {
      "module": "",
      "lessons": ""
    }
  },
  {
    "id": "gw-manajemen-1",
    "subject": "Manajemen Tempur",
    "module": "GENERAL WARFARE",
    "chapter": "MANAJEMEN TEMPUR",
    "type": "MODUL",
    "title": "Dinas Informasi Tempur",
    "links": {
      "module": "https://drive.google.com/file/d/1oWgnbrA_sr-Zk4U77YWkIW6PhHDDD25s/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1wAgSmnyXkYHisadrwWVHnS0nLtEB0Zls/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "gw-manajemen-2",
    "subject": "Manajemen Tempur",
    "module": "GENERAL WARFARE",
    "chapter": "MANAJEMEN TEMPUR",
    "type": "MODUL",
    "title": "Aturan Pelibatan (ROE)",
    "links": {
      "module": "https://drive.google.com/file/d/17xcShxpNLsUPeCjvM6FKfbOWlTqB0NMA/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1rCt_dSNpU0gGqZAKX8fmMWf6XGygwkIg/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "gw-manajemen-3",
    "subject": "Manajemen Tempur",
    "module": "GENERAL WARFARE",
    "chapter": "MANAJEMEN TEMPUR",
    "type": "MODUL",
    "title": "Laporan Sergapan (Raid Reporting)",
    "links": {
      "module": "https://docs.google.com/presentation/d/1bhbsUlJp7efF1MRlkrojPvLe7tZFtvUu/present?usp=drive_web&ouid=109411807886520144132&rtpof=true",
      "lessons": "https://drive.google.com/file/d/19O_NoOizfuIaBZNM-mL0FqNhKWRYMa6m/view?usp=sharing"
    }
  },
  {
    "id": "gw-manajemen-4",
    "subject": "Manajemen Tempur",
    "module": "GENERAL WARFARE",
    "chapter": "MANAJEMEN TEMPUR",
    "type": "MODUL",
    "title": "Command, Control, Computer, Communication, Cyber, Intelligence, Surveillance and Reconnaissance (C5ISR)",
    "links": {
      "module": "https://drive.google.com/file/d/1a8Z2Lbd04zBXqg-fRF7-haYbC_G-11J6/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/19gXes1ZQ1eVO_DY6X8lY7LiHrhRilE9V/present?usp=drive_web&ouid=109411807886520144132&rtpof=true"
    }
  },
  {
    "id": "gw-manajemen-5",
    "subject": "Manajemen Tempur",
    "module": "GENERAL WARFARE",
    "chapter": "MANAJEMEN TEMPUR",
    "type": "MODUL",
    "title": "Peperangan Asimetris",
    "links": {
      "module": "",
      "lessons": "https://docs.google.com/presentation/d/1Cq24LjG6nw2wahhihLYgoNa423QvQo96/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "gw-informasi-1",
    "subject": "Informasi Tempur",
    "module": "GENERAL WARFARE",
    "chapter": "INFORMASI TEMPUR",
    "type": "MODUL",
    "title": "Pengenalan (Recognition)",
    "links": {
      "module": "https://drive.google.com/file/d/1H_FPjLqsRLXqGNEtKqX1zzErOtpPBubo/view?usp=sharing",
      "lessons": "https://drive.google.com/drive/folders/1Pko0sAg2i-a4-wfDjiDaJGqYHlp26VWT"
    }
  },
  {
    "id": "gw-informasi-2",
    "subject": "Informasi Tempur",
    "module": "GENERAL WARFARE",
    "chapter": "INFORMASI TEMPUR",
    "type": "MODUL",
    "title": "Kemampuan Regional (Regcap)",
    "links": {
      "module": "https://drive.google.com/file/d/1cMwnEL9xOBrOQJ5TSv8KNqkH-2bAB6vt/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1PRAvp0quaPmu6WEUWVX1p5yRawMWmn0w/present?slide=id.p1"
    }
  },
  {
    "id": "gw-informasi-3",
    "subject": "Informasi Tempur",
    "module": "GENERAL WARFARE",
    "chapter": "INFORMASI TEMPUR",
    "type": "MODUL",
    "title": "Intelijen Maritim",
    "links": {
      "module": "https://drive.google.com/file/d/1iPaa2rfDYeox3rmpllYy7QcGlYHIdhqZ/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1wAgSmnyXkYHisadrwWVHnS0nLtEB0Zls/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "gw-informasi-4",
    "subject": "Informasi Tempur",
    "module": "GENERAL WARFARE",
    "chapter": "INFORMASI TEMPUR",
    "type": "MODUL",
    "title": "Komunikasi Pertempuran",
    "links": {
      "module": "",
      "lessons": ""
    }
  },
  {
    "id": "gw-informasi-5",
    "subject": "Informasi Tempur",
    "module": "GENERAL WARFARE",
    "chapter": "INFORMASI TEMPUR",
    "type": "MODUL",
    "title": "Meteorologi",
    "links": {
      "module": "",
      "lessons": ""
    }
  },
  {
    "id": "asuw-prosedur-1",
    "subject": "Prosedur Taktis AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKPA",
    "type": "MODUL",
    "title": "Introduksi AKPA",
    "links": {
      "module": "",
      "lessons": "https://drive.google.com/file/d/19JvSHDCSGOq8-eTptLzjJN-lN7v4jGfA/view?usp=sharing"
    }
  },
  {
    "id": "asuw-prosedur-2",
    "subject": "Prosedur Taktis AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKPA",
    "type": "MODUL",
    "title": "Perencanaan Operasi AKPA",
    "links": {
      "module": "https://drive.google.com/file/d/1acqwDN6h7sXpM7cyI0vvV6evluAB7Um3/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/15Cd2ayda13mgoxiSh4Qf1mE34A8jJmcz/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "asuw-prosedur-3",
    "subject": "Prosedur Taktis AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKPA",
    "type": "MODUL",
    "title": "Kalkulasi Tempur AKPA",
    "links": {
      "module": "https://drive.google.com/file/d/1RS6_bySn1MdlIJ35dOkXXYpoYHBRi9yt/view?usp=sharing",
      "lessons": "https://drive.google.com/file/d/1QlCY_JhoYwL91hlmtS7Bu1IqP6WufzBM/view?usp=sharing"
    }
  },
  {
    "id": "asuw-prosedur-4",
    "subject": "Prosedur Taktis AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKPA",
    "type": "MODUL",
    "title": "Gambaran Taktis AKPA",
    "links": {
      "module": "https://drive.google.com/file/d/17pSekeinc2ewc8uTdUzFWrCdqHPWPi1W/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/17DmnVfhf6rJkC0k0Odqyt4Bi99KgQRog/present?rtpof=true&slide=id.p1"
    }
  },
  {
    "id": "asuw-prosedur-5",
    "subject": "Prosedur Taktis AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKPA",
    "type": "MODUL",
    "title": "Proskomtis AKPA",
    "links": {
      "module": "https://drive.google.com/file/d/1YhRPA54bqonoLcv3enOG1QEPGYVhnlx1/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asuw-prosedur-6",
    "subject": "Prosedur Taktis AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKPA",
    "type": "MODUL",
    "title": "Sensor AKPA",
    "links": {
      "module": "https://drive.google.com/file/d/12YhP9cni5l3TAak-PdbkYywGUIAtKkoZ/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asuw-prosedur-7",
    "subject": "Prosedur Taktis AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKPA",
    "type": "MODUL",
    "title": "Kerjasama Taktis Pesud dan KAA",
    "links": {
      "module": "https://drive.google.com/file/d/1rZluBL0gYzt32gO-092R97xWtyDG0ptj/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asuw-prosedur-8",
    "subject": "Prosedur Taktis AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKPA",
    "type": "MODUL",
    "title": "Gugus Aksi Permukaan (Surface Action Group)",
    "links": {
      "module": "https://drive.google.com/file/d/1BvizX6rf8bWnFSnosuSiYhmfJCqMbUFV/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asuw-prosedur-9",
    "subject": "Prosedur Taktis AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKPA",
    "type": "MODUL",
    "title": "Over The Horizon Target (Penembakan Sasaran Melewati Cakrawala)",
    "links": {
      "module": "https://drive.google.com/file/d/1wRtRBCbbDBIGfNpT52QXv1f-OJwDjDeE/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asuw-prosedur-10",
    "subject": "Prosedur Taktis AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKPA",
    "type": "MODUL",
    "title": "Serangan Jarak Dekat",
    "links": {
      "module": "https://drive.google.com/file/d/1bPFHO1K--odNfloqbn8FzEMm3XtDIcm2/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asuw-prosedur-11",
    "subject": "Prosedur Taktis AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKPA",
    "type": "MODUL",
    "title": "Pengaruh Alam dalam AKPA",
    "links": {
      "module": "https://drive.google.com/file/d/1MZLz_wtdxJ3nhBSdHLVSjLU8yrk_6tOP/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asuw-prosedur-12",
    "subject": "Prosedur Taktis AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKPA",
    "type": "MODUL",
    "title": "Kodal AKPA",
    "links": {
      "module": "https://drive.google.com/file/d/1J86QhfZ_FyVRIWifV7ogPUC_4pAiLcB9/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asuw-prosedur-13",
    "subject": "Prosedur Taktis AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKPA",
    "type": "MODUL",
    "title": "SAR dalam AKPA",
    "links": {
      "module": "",
      "lessons": ""
    }
  },
  {
    "id": "asuw-senjata-1",
    "subject": "Penggunaan Senjata AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PENGGUNAAN SENJATA AKPA",
    "type": "MODUL",
    "title": "Penggunaan Meriam AKPA dan BTK",
    "links": {
      "module": "https://drive.google.com/file/d/1-_KdiWpP3Xrz-fwX2GPYqtRiIS_uWUQq/view?usp=sharing",
      "lessons": "https://drive.google.com/file/d/1HpclmHSImTu-3JLbC3S4bVstCCbyNnWr/view?usp=sharing"
    }
  },
  {
    "id": "asuw-senjata-2",
    "subject": "Penggunaan Senjata AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "PENGGUNAAN SENJATA AKPA",
    "type": "MODUL",
    "title": "Penggunaan Rudal",
    "links": {
      "module": "https://drive.google.com/file/d/1ZKc3BDv6ZZtx8RHUaQzPuo5QR4DT-ZMn/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asuw-fpb-1",
    "subject": "Taktik Peperangan Fast Patrol Boat",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "TAKTIK PEPERANGAN FAST PATROL BOAT",
    "type": "MODUL",
    "title": "Operasi FPB",
    "links": {
      "module": "https://drive.google.com/file/d/1YQtwvbyE_dlfGBlYU5UDl89WDa7hUIFE/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asuw-fpb-2",
    "subject": "Taktik Peperangan Fast Patrol Boat",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "TAKTIK PEPERANGAN FAST PATROL BOAT",
    "type": "MODUL",
    "title": "Anti FPB",
    "links": {
      "module": "https://drive.google.com/file/d/1zjKITMGRjd8-i6Lq7uDa2QjDxHfaLel7/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asuw-simulasi-1",
    "subject": "Latihan Simulasi Peperangan AKPA",
    "module": "ANTI SURFACE WARFARE",
    "chapter": "LATIHAN SIMULASI PEPERANGAN AKPA",
    "type": "MODUL",
    "title": "Latihan Simulasi Peperangan AKPA",
    "links": {
      "module": "",
      "lessons": ""
    }
  },
  {
    "id": "asw-alam-1",
    "subject": "Pengaruh Alam dalam AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PENGARUH ALAM DALAM AKS",
    "type": "MODUL",
    "title": "Hidro Oceanografi dalam AKS",
    "links": {
      "module": "https://drive.google.com/file/d/1GFFayYQRak14ThLUzu4yCNEImjlDoaK0/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asw-alam-2",
    "subject": "Pengaruh Alam dalam AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PENGARUH ALAM DALAM AKS",
    "type": "MODUL",
    "title": "Propagasi Bawah Air",
    "links": {
      "module": "https://drive.google.com/file/d/144dcJioL42Zg5sbODTuE7lqT2khj61Uk/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asw-prosedur-1",
    "subject": "Prosedur Taktis AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKS",
    "type": "MODUL",
    "title": "Introduksi AKS",
    "links": {
      "module": "https://drive.google.com/file/d/1HpclmHSImTu-3JLbC3S4bVstCCbyNnWr/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asw-prosedur-2",
    "subject": "Prosedur Taktis AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKS",
    "type": "MODUL",
    "title": "Perencanaan Operasi AKS",
    "links": {
      "module": "https://drive.google.com/file/d/1LllDoD5bMlmI26KB4JNnXG9EVdobVZTI/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1y0nnJHBCBKpSBIBXw7NDQDldcIs6rlgl/present?slide=id.p1"
    }
  },
  {
    "id": "asw-prosedur-3",
    "subject": "Prosedur Taktis AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKS",
    "type": "MODUL",
    "title": "Gambaran Taktis AKS",
    "links": {
      "module": "https://drive.google.com/file/d/1bdrPrupdUFtn_TQL8NkMxpw1j3wE-0TL/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1an6fhUKWD2ff5v2RJDHdCB2b-T94tEz-/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "asw-prosedur-4",
    "subject": "Prosedur Taktis AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKS",
    "type": "MODUL",
    "title": "Proskomtis AKS",
    "links": {
      "module": "https://drive.google.com/file/d/18kUBlYTv930Amb7UT9lFZril0y_HIlKT/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1an6fhUKWD2ff5v2RJDHdCB2b-T94tEz-/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "asw-prosedur-5",
    "subject": "Prosedur Taktis AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKS",
    "type": "MODUL",
    "title": "Sensor AKS",
    "links": {
      "module": "https://drive.google.com/file/d/1it1CoJTYkVGpDJ-SugfpYzxieJ8bPKOB/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/10VuLulFhx8P5hCxt-_Sh1dcnCy-Wi6kh/present?slide=id.p1"
    }
  },
  {
    "id": "asw-prosedur-6",
    "subject": "Prosedur Taktis AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKS",
    "type": "MODUL",
    "title": "Kerjasama Taktis AKS",
    "links": {
      "module": "https://drive.google.com/file/d/1-Mn1JqusyK1_J1DRpHQJqiimqcboHe-c/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1kuuyR5WHaGM7cz46e69Ogz9AnAJMUvpo/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "asw-prosedur-7",
    "subject": "Prosedur Taktis AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKS",
    "type": "MODUL",
    "title": "Aksi AKS",
    "links": {
      "module": "https://drive.google.com/file/d/1xMd0CkTkzt2StyUieAcj4JJf52a5YtXL/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1txzhbiAYg4WoBHni4Cn3f62bBeM-Yx7k/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "asw-prosedur-8",
    "subject": "Prosedur Taktis AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKS",
    "type": "MODUL",
    "title": "Anti Ship Torpedo Defence (ASTD)",
    "links": {
      "module": "https://drive.google.com/file/d/1iEyyic3fRYndwmzVt7nhG0Vc9wLR9oY3/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asw-prosedur-9",
    "subject": "Prosedur Taktis AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKS",
    "type": "MODUL",
    "title": "SAU/ASAU",
    "links": {
      "module": "https://drive.google.com/file/d/1_RXmNCNvBjoJb5-3eaoGbmugyIzPGS35/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/16NTm94oWeylQhDbXkcw_eK6kvQwnZPS8/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "asw-prosedur-10",
    "subject": "Prosedur Taktis AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKS",
    "type": "MODUL",
    "title": "Tabir AKS",
    "links": {
      "module": "https://drive.google.com/file/d/1wYNs3uH0Y0fVeLYruRKZacEmjyT2fKmJ/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/14A67neEZK5LM6rOFI2lYrVTWqmwQN39F/present?usp=drive_web&ouid=109411807886520144132&rtpof=true"
    }
  },
  {
    "id": "asw-prosedur-11",
    "subject": "Prosedur Taktis AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKS",
    "type": "MODUL",
    "title": "Kodal AKS",
    "links": {
      "module": "https://drive.google.com/file/d/19JYsg1siUtZHcI87it-vwiGGPy9xbYk4/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/13hcT-GzdjPEKK8ASA8zw3n9Y66SeyJEW/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "asw-prosedur-12",
    "subject": "Prosedur Taktis AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKS",
    "type": "MODUL",
    "title": "Introduksi Coordinated Anti Submarine Exercise (CASEX)",
    "links": {
      "module": "",
      "lessons": "https://docs.google.com/presentation/d/1enQss_IVxiuH78NY57tT6nQT573sWDTd/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "asw-prosedur-13",
    "subject": "Prosedur Taktis AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PROSEDUR TAKTIS AKS",
    "type": "MODUL",
    "title": "Water Space Management (WSM)",
    "links": {
      "module": "",
      "lessons": "https://docs.google.com/presentation/d/1CMh9AzcgUDcSJYArFCCmJFL4EFlfevYB/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "asw-senjata-1",
    "subject": "Penggunaan Senjata AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PENGGUNAAN SENJATA AKS",
    "type": "MODUL",
    "title": "Penggunaan Torpedo",
    "links": {
      "module": "https://drive.google.com/file/d/1vbJVraywqBhuGGzYfUa72biUaLj4T3q6/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asw-senjata-2",
    "subject": "Penggunaan Senjata AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "PENGGUNAAN SENJATA AKS",
    "type": "MODUL",
    "title": "Penggunaan Roket dan Bom AKS",
    "links": {
      "module": "https://drive.google.com/file/d/1wALs_BtS62CtqgFk8nsQ9HtOxMUYHQey/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asw-kasel-1",
    "subject": "Operasi Kapal Selam",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "OPERASI KAPAL SELAM",
    "type": "MODUL",
    "title": "Taktik KS",
    "links": {
      "module": "https://drive.google.com/file/d/1w5tzatrHbdjT5H5wkqxtViPsgr0z7UVi/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "asw-kasel-2",
    "subject": "Operasi Kapal Selam",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "OPERASI KAPAL SELAM",
    "type": "MODUL",
    "title": "Pengoperasian KS",
    "links": {
      "module": "https://drive.google.com/file/d/1w5tzatrHbdjT5H5wkqxtViPsgr0z7UVi/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1xpEeI8sfM2CUTtzRhC0hnnjLKzN6RNNC/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "asw-simulasi-1",
    "subject": "Latihan Simulasi Peperangan AKS",
    "module": "ANTI SUBMARINE WARFARE",
    "chapter": "LATIHAN SIMULASI PEPERANGAN AKS",
    "type": "MODUL",
    "title": "Latihan Simulasi Peperangan AKS",
    "links": {
      "module": "",
      "lessons": "https://docs.google.com/presentation/d/1enQss_IVxiuH78NY57tT6nQT573sWDTd/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "aaw-prosedur-1",
    "subject": "Prosedur Taktis PAU",
    "module": "ANTI AIR WARFARE",
    "chapter": "PROSEDUR TAKTIS PAU",
    "type": "MODUL",
    "title": "Introduksi PAU",
    "links": {
      "module": "",
      "lessons": "https://docs.google.com/presentation/d/13dZalPLHI-u8it7opyKWaTZR_5nxTIQC/present?usp=drive_web&ouid=109411807886520144132&rtpof=true"
    }
  },
  {
    "id": "aaw-prosedur-2",
    "subject": "Prosedur Taktis PAU",
    "module": "ANTI AIR WARFARE",
    "chapter": "PROSEDUR TAKTIS PAU",
    "type": "MODUL",
    "title": "Perencanaan Operasi PAU",
    "links": {
      "module": "https://drive.google.com/file/d/1J4RVH8q2vAMN-k8BT1s-PoygVATHIX2Z/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1tqhaPWHfi-g0J6ZlcwvC5WEkIHrS8D4B/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "aaw-prosedur-3",
    "subject": "Prosedur Taktis PAU",
    "module": "ANTI AIR WARFARE",
    "chapter": "PROSEDUR TAKTIS PAU",
    "type": "MODUL",
    "title": "Gambaran Taktis PAU",
    "links": {
      "module": "https://drive.google.com/file/d/1OKuq7gc_H8wLzn_JfMXXdDeD5qC97HPd/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1jiVo_AZMTMb3I9-USyDpw23MB2jAkqkI/present?usp=drive_web&ouid=109411807886520144132&rtpof=true"
    }
  },
  {
    "id": "aaw-prosedur-4",
    "subject": "Prosedur Taktis PAU",
    "module": "ANTI AIR WARFARE",
    "chapter": "PROSEDUR TAKTIS PAU",
    "type": "MODUL",
    "title": "Proskomtis PAU",
    "links": {
      "module": "https://drive.google.com/file/d/1I6Mj22Mf4JsAnKVr6nP-7ZLKWdCWy3SD/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "aaw-prosedur-5",
    "subject": "Prosedur Taktis PAU",
    "module": "ANTI AIR WARFARE",
    "chapter": "PROSEDUR TAKTIS PAU",
    "type": "MODUL",
    "title": "Sensor PAU",
    "links": {
      "module": "https://drive.google.com/file/d/1q4z7DcKtglyjKgoSLf1MwuwnabcbAUAi/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "aaw-prosedur-6",
    "subject": "Prosedur Taktis PAU",
    "module": "ANTI AIR WARFARE",
    "chapter": "PROSEDUR TAKTIS PAU",
    "type": "MODUL",
    "title": "Kerjasama Taktis Pesud dan KAA",
    "links": {
      "module": "https://drive.google.com/file/d/1d44DbkhulCmdfuQ7xNsUvOJ4OVuxiVfY/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/12Qvy_UkV6bm8Sbw_-LGZtz4BPtvoAe7B/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "aaw-prosedur-7",
    "subject": "Prosedur Taktis PAU",
    "module": "ANTI AIR WARFARE",
    "chapter": "PROSEDUR TAKTIS PAU",
    "type": "MODUL",
    "title": "Kodal PAU",
    "links": {
      "module": "https://drive.google.com/file/d/1qDVZsTCpTfllDabzmcmT0US94mrk9BIg/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "aaw-prosedur-8",
    "subject": "Prosedur Taktis PAU",
    "module": "ANTI AIR WARFARE",
    "chapter": "PROSEDUR TAKTIS PAU",
    "type": "MODUL",
    "title": "Weapon Coordination",
    "links": {
      "module": "",
      "lessons": "https://docs.google.com/presentation/d/1X5O1aosMIIYfZVG0cRmXUnCXAfBmX4vQ/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "aaw-asmd-1",
    "subject": "Anti Ship Missile Defence (ASMD)",
    "module": "ANTI AIR WARFARE",
    "chapter": "ANTI SHIP MISSILE DEFENCE (ASMD)",
    "type": "MODUL",
    "title": "ASMD Unit",
    "links": {
      "module": "https://drive.google.com/file/d/1nElifGIu2aKxNXimi0knGOJwjT04AXV0/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "aaw-asmd-2",
    "subject": "Anti Ship Missile Defence (ASMD)",
    "module": "ANTI AIR WARFARE",
    "chapter": "ANTI SHIP MISSILE DEFENCE (ASMD)",
    "type": "MODUL",
    "title": "ASMD Gugus Tugas",
    "links": {
      "module": "https://drive.google.com/file/d/1_dMzR6KBeRZpzwLon6O3aQX1n7tBooGp/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/16jGeuIHsXobmziZmSGm7yddo2L7egKOB/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "aaw-asmd-3",
    "subject": "Anti Ship Missile Defence (ASMD)",
    "module": "ANTI AIR WARFARE",
    "chapter": "ANTI SHIP MISSILE DEFENCE (ASMD)",
    "type": "MODUL",
    "title": "Zippo System",
    "links": {
      "module": "",
      "lessons": "https://docs.google.com/presentation/d/1t1CqXtv7D3BbMPEozO68Q6kaABG5X7fP/present?slide=id.p4#slide=id.p4"
    }
  },
  {
    "id": "aaw-senjata-1",
    "subject": "Penggunaan Senjata Anti Udara",
    "module": "ANTI AIR WARFARE",
    "chapter": "PENGGUNAAN SENJATA ANTI UDARA",
    "type": "MODUL",
    "title": "Penggunaan Meriam Anti Udara",
    "links": {
      "module": "https://drive.google.com/file/d/10HN2u0V6OELkoLJ3IM5mGEfpHt33nYcs/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "aaw-senjata-2",
    "subject": "Penggunaan Senjata Anti Udara",
    "module": "ANTI AIR WARFARE",
    "chapter": "PENGGUNAAN SENJATA ANTI UDARA",
    "type": "MODUL",
    "title": "Penggunaan Rudal Anti Udara",
    "links": {
      "module": "https://drive.google.com/file/d/1R96kQhtUVZ_PcarJpQj_fFcf9wrTp8a7/view?usp=sharing",
      "lessons": ""
    }
  },
  {
    "id": "aaw-senjata-3",
    "subject": "Penggunaan Senjata Anti Udara",
    "module": "ANTI AIR WARFARE",
    "chapter": "PENGGUNAAN SENJATA ANTI UDARA",
    "type": "MODUL",
    "title": "Penggunaan Decoy",
    "links": {
      "module": "https://drive.google.com/file/d/1YRA6oM9Sj8qqDoEvbAiKjkvVCdzL5iRN/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1wbJi-5aSm8ArDcOtnCKXf3QUSYAGts7h/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "aaw-simulasi-1",
    "subject": "Latihan Simulasi Peperangan PAU",
    "module": "ANTI AIR WARFARE",
    "chapter": "LATIHAN SIMULASI PEPERANGAN PAU",
    "type": "MODUL",
    "title": "Latihan Simulasi Peperangan PAU",
    "links": {
      "module": "",
      "lessons": ""
    }
  },
  {
    "id": "ew-dasar-1",
    "subject": "Dasar Pernika",
    "module": "ELECTRONIC WARFARE",
    "chapter": "DASAR PERNIKA",
    "type": "MODUL",
    "title": "Gelombang Elektromagnetik",
    "links": {
      "module": "https://docs.google.com/presentation/d/12mTg6PP-A1qfrOKUeVwcJKLLAdPNguJU/present?slide=id.p1#slide=id.p1",
      "lessons": "https://drive.google.com/file/d/1-__QOYOoVgRXNvcaUStBKVWjQZXUJmkN/view?usp=sharing"
    }
  },
  {
    "id": "ew-dasar-2",
    "subject": "Dasar Pernika",
    "module": "ELECTRONIC WARFARE",
    "chapter": "DASAR PERNIKA",
    "type": "MODUL",
    "title": "Teori Radar",
    "links": {
      "module": "",
      "lessons": "https://docs.google.com/presentation/d/1glQmxNWxaYZWYT_Dq2X67F2oP0OTSX1V/present?rtpof=true&slide=id.p1"
    }
  },
  {
    "id": "ew-pernika-1",
    "subject": "Pernika",
    "module": "ELECTRONIC WARFARE",
    "chapter": "PERNIKA",
    "type": "MODUL",
    "title": "Electronic Support (ES)",
    "links": {
      "module": "https://drive.google.com/file/d/10y8VOlSAhOVCiNLQfSJ5OLRy2gEieSxv/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1KVtcNN6EF3K-FOyVpaxzxrdiTNgj0AMP/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "ew-pernika-2",
    "subject": "Pernika",
    "module": "ELECTRONIC WARFARE",
    "chapter": "PERNIKA",
    "type": "MODUL",
    "title": "Electronic Attack (EA)",
    "links": {
      "module": "https://drive.google.com/file/d/1HdQkO46b4AtKD1tIMh0j8yFcbwmjlwSp/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/19bsbLSsAhgm7VPkmJavjwL1iVT5u1M-g/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "ew-pernika-3",
    "subject": "Pernika",
    "module": "ELECTRONIC WARFARE",
    "chapter": "PERNIKA",
    "type": "MODUL",
    "title": "Electronic Protective (EP)",
    "links": {
      "module": "https://drive.google.com/file/d/1thvNlRKpT98ZygTgSDjc--1n5u26fU3r/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1s9D-qMz01ypcJRajZLcUJ4DZwtMVc6Xp/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "mw-1",
    "subject": "MINE WARFARE",
    "module": "MINE WARFARE",
    "chapter": "PEPERANGAN RANJAU",
    "type": "MODUL",
    "title": "Introduksi Peperangan Ranjau",
    "links": {
      "module": "https://drive.google.com/file/d/1OgTVSgcloZ5Iku7yqDVt4ftZkb6fygKI/view?usp=sharing",
      "lessons": "https://docs.google.com/presentation/d/1jGREtXKcmLD7GCD_aVzBCBp5zReZeHGh/present?slide=id.p1#slide=id.p1"
    }
  },
  {
    "id": "mw-2",
    "subject": "MINE WARFARE",
    "module": "MINE WARFARE",
    "chapter": "PEPERANGAN RANJAU",
    "type": "MODUL",
    "title": "Tindakan Perlawanan Ranjau",
    "links": {
      "module": "",
      "lessons": ""
    }
  },
  {
    "id": "ref-ipwo-1",
    "subject": "7.1 IPWO INGGRIS",
    "module": "IPWO INGGRIS",
    "chapter": "AIO & DATA LINKS",
    "type": "REFERENSI",
    "title": "Intro to AIO-OS",
    "links": {
      "module": "https://docs.google.com/presentation/d/1eGqQvTngLDSYC5-p31ml9pErNOdCnM3m/present?slide=id.p1",
      "lessons": ""
    }
  },
  {
    "id": "ref-ipwo-2",
    "subject": "7.1 IPWO INGGRIS",
    "module": "IPWO INGGRIS",
    "chapter": "AIO & DATA LINKS",
    "type": "REFERENSI",
    "title": "Intro to Data Links-OS",
    "links": {
      "module": "https://docs.google.com/presentation/d/152YRtJAggnDWSruC6EEAJzSQpRMT9ib0/present",
      "lessons": ""
    }
  },
  {
    "id": "ref-ipwo-3",
    "subject": "7.1 IPWO INGGRIS",
    "module": "IPWO INGGRIS",
    "chapter": "AIO & DATA LINKS",
    "type": "REFERENSI",
    "title": "Comsec-OS",
    "links": {
      "module": "https://docs.google.com/presentation/d/1zTHzSx9RAMQE7x2CUtGQLDnoSlQLSb8S/present?slide=id.p1",
      "lessons": ""
    }
  },
  {
    "id": "ref-ipwo-4",
    "subject": "7.1 IPWO INGGRIS",
    "module": "IPWO INGGRIS",
    "chapter": "AIO & DATA LINKS",
    "type": "REFERENSI",
    "title": "AIO Intro-OS",
    "links": {
      "module": "https://docs.google.com/presentation/d/17TkXJuEGlUMWFksrZSpP1i6RaG_HFh2D/present",
      "lessons": ""
    }
  },
  {
    "id": "ref-cco-1",
    "subject": "7.2 CCO BELANDA",
    "module": "CCO BELANDA",
    "chapter": "ASW & TACTICAL",
    "type": "REFERENSI",
    "title": "WSM and PMI",
    "links": {
      "module": "",
      "lessons": "https://docs.google.com/presentation/d/1CMh9AzcgUDcSJYArFCCmJFL4EFlfevYB/present"
    }
  },
  {
    "id": "ref-cco-2",
    "subject": "7.2 CCO BELANDA",
    "module": "CCO BELANDA",
    "chapter": "ASW & TACTICAL",
    "type": "REFERENSI",
    "title": "Introduction to MXP1",
    "links": {
      "module": "",
      "lessons": "https://docs.google.com/presentation/d/1enQss_IVxiuH78NY57tT6nQT573sWDTd/present"
    }
  },
  {
    "id": "ref-cco-3",
    "subject": "7.2 CCO BELANDA",
    "module": "CCO BELANDA",
    "chapter": "ASW & TACTICAL",
    "type": "REFERENSI",
    "title": "ASW Introduction",
    "links": {
      "module": "https://docs.google.com/presentation/d/1YMumLhYjTPOJ33uHTVxaN_u4c3XPYU6E/present",
      "lessons": ""
    }
  },
  {
    "id": "ref-cco-4",
    "subject": "7.2 CCO BELANDA",
    "module": "CCO BELANDA",
    "chapter": "ASW & TACTICAL",
    "type": "REFERENSI",
    "title": "ASW Command & Control",
    "links": {
      "module": "https://docs.google.com/presentation/d/13hcT-GzdjPEKK8ASA8zw3n9Y66SeyJEW/present",
      "lessons": ""
    }
  },
  {
    "id": "ref-cco-5",
    "subject": "7.2 CCO BELANDA",
    "module": "CCO BELANDA",
    "chapter": "ASW & TACTICAL",
    "type": "REFERENSI",
    "title": "ASW Assets",
    "links": {
      "module": "https://docs.google.com/presentation/d/1kuuyR5WHaGM7cz46e69Ogz9AnAJMUvpo/present",
      "lessons": ""
    }
  },
  {
    "id": "ref-cco-6",
    "subject": "7.2 CCO BELANDA",
    "module": "CCO BELANDA",
    "chapter": "ASW & TACTICAL",
    "type": "REFERENSI",
    "title": "ASW Sensors",
    "links": {
      "module": "https://docs.google.com/presentation/d/10VuLulFhx8P5hCxt-_Sh1dcnCy-Wi6kh/present",
      "lessons": ""
    }
  },
  {
    "id": "ref-cco-7",
    "subject": "7.2 CCO BELANDA",
    "module": "CCO BELANDA",
    "chapter": "ASW & TACTICAL",
    "type": "REFERENSI",
    "title": "ASW Classification",
    "links": {
      "module": "https://docs.google.com/presentation/d/1an6fhUKWD2ff5v2RJDHdCB2b-T94tEz-/present",
      "lessons": ""
    }
  },
  {
    "id": "ref-cco-8",
    "subject": "7.2 CCO BELANDA",
    "module": "CCO BELANDA",
    "chapter": "ASW & TACTICAL",
    "type": "REFERENSI",
    "title": "ASW Actions On",
    "links": {
      "module": "https://docs.google.com/presentation/d/1txzhbiAYg4WoBHni4Cn3f62bBeM-Yx7k/present",
      "lessons": ""
    }
  },
  {
    "id": "ref-cco-9",
    "subject": "7.2 CCO BELANDA",
    "module": "CCO BELANDA",
    "chapter": "ASW & TACTICAL",
    "type": "REFERENSI",
    "title": "ASW Attack Plans",
    "links": {
      "module": "https://docs.google.com/presentation/d/1y0nnJHBCBKpSBIBXw7NDQDldcIs6rlgl/present",
      "lessons": ""
    }
  },
  {
    "id": "ref-cco-10",
    "subject": "7.2 CCO BELANDA",
    "module": "CCO BELANDA",
    "chapter": "ASW & TACTICAL",
    "type": "REFERENSI",
    "title": "ASW Voice Procedures",
    "links": {
      "module": "https://docs.google.com/presentation/d/1sDQ-ximxu8NTSjIvQRTLqTF0Z-zj_S3N/present",
      "lessons": ""
    }
  },
  {
    "id": "ref-cco-11",
    "subject": "7.2 CCO BELANDA",
    "module": "CCO BELANDA",
    "chapter": "ASW & TACTICAL",
    "type": "REFERENSI",
    "title": "ASW SAU Procedures",
    "links": {
      "module": "https://docs.google.com/presentation/d/16NTm94oWeylQhDbXkcw_eK6kvQwnZPS8/present",
      "lessons": ""
    }
  },
  {
    "id": "ref-cco-12",
    "subject": "7.2 CCO BELANDA",
    "module": "CCO BELANDA",
    "chapter": "ASW & TACTICAL",
    "type": "REFERENSI",
    "title": "ASW Screening",
    "links": {
      "module": "https://docs.google.com/presentation/d/14A67neEZK5LM6rOFI2lYrVTWqmwQN39F/present",
      "lessons": ""
    }
  },
  {
    "id": "ref-cco-13",
    "subject": "7.2 CCO BELANDA",
    "module": "CCO BELANDA",
    "chapter": "ASW & TACTICAL",
    "type": "REFERENSI",
    "title": "ASW Littoral",
    "links": {
      "module": "https://docs.google.com/presentation/d/1o-OlIA41HL7CJghNDgLlSVw9L_OZGpJ8/present",
      "lessons": ""
    }
  }
];
