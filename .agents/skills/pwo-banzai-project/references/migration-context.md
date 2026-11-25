# Reference: Design Tokens, Categories & Supabase Schema

## Design Tokens (`styles.css`)
- `--canvas`: `#121212`
- `--panel`: `#1c1b1b`
- `--panel-raised`: `#242323`
- `--line`: `#393434`
- `--ink`: `#f2ede7`
- `--muted`: `#9c9690`
- `--red`: `#df3030`
- `--gold`: `#d3a84f`
- `--heading`: `'Oswald', Impact, sans-serif`
- `--body`: `'DM Sans', 'Segoe UI', sans-serif`

## 7 Warfare Categories & Icons
1. `GENERAL WARFARE` (`gw`, `GW`, `game-icons:crossed-swords`)
   - Sub: `Bahasa Inggris`, `Manajemen Tempur`, `Informasi Tempur`
2. `ANTI SURFACE WARFARE` (`asuw`, `ASuW`, `game-icons:battleship`)
   - Sub: `Prosedur Taktis AKPA`, `Penggunaan Senjata AKPA`, `Taktik Peperangan Fast Patrol Boat`, `Latihan Simulasi Peperangan AKPA`
3. `ANTI SUBMARINE WARFARE` (`asw`, `ASW`, `game-icons:submarine`)
   - Sub: `Pengaruh Alam dalam AKS`, `Prosedur Taktis AKS`, `Penggunaan Senjata AKS`, `Operasi Kapal Selam`, `Latihan Simulasi Peperangan AKS`
4. `ANTI AIR WARFARE` (`aaw`, `AAW`, `game-icons:jet-fighter`)
   - Sub: `Prosedur Taktis PAU`, `Anti Ship Missile Defence (ASMD)`, `Penggunaan Senjata Anti Udara`, `Latihan Simulasi Peperangan PAU`
5. `ELECTRONIC WARFARE` (`ew`, `EW`, `game-icons:radar-dish`)
   - Sub: `Dasar Pernika`, `Pernika`
6. `MINE WARFARE` (`mw`, `MW`, `mdi:mine`)
7. `REFERENSI UMUM LAINNYA` (`ref`, `REF`, `game-icons:bookshelf`)
   - Sub: `7.1 IPWO INGGRIS` (`IPWO`), `7.2 CCO BELANDA` (`CCO`)

## Target Supabase Tables (Option A)
1. `profiles`: `id (uuid PK -> auth.users)`, `username`, `full_name`, `role ('admin' | 'user')`, `created_at`
2. `categories`: `id`, `slug`, `code`, `name`, `short`, `icon`, `description`, `sort_order`
3. `subcategories`: `id`, `category_id (FK)`, `slug`, `code`, `name`, `label`, `short`, `sort_order`
4. `materials`: `id`, `category_id (FK)`, `subcategory_id (FK nullable)`, `title`, `module_url`, `lessons_url`, `sort_order`, `created_at`
   *(Optional `links` jsonb if >2 links needed later)*

## RLS Policy Rules
- `categories`, `subcategories`, `materials`: `SELECT` for `authenticated` only; `INSERT/UPDATE/DELETE` for `profiles.role = 'admin'` only.
- `profiles`: user can `SELECT` own row; `admin` can `SELECT/UPDATE` all rows.
