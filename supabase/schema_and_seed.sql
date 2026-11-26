-- ============================================================================
-- PWO BANZAI 2026 — COMPLETE RELATIONAL SUPABASE SCHEMA, RLS & SEED DATA
-- Tables: profiles, categories, subcategories, materials
-- Run this entire script in the Supabase SQL Editor.
-- ============================================================================

-- 1. PROFILES (User & Admin roles linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  email text,
  full_name text not null default '',
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

-- 2. CATEGORIES (Main Warfare Domains)
create table if not exists public.categories (
  id text primary key,
  code text not null default '',
  name text not null,
  short text not null default '',
  icon text not null default 'game-icons:bookshelf',
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. SUBCATEGORIES (Sub-materi under each Category)
create table if not exists public.subcategories (
  id text primary key,
  category_id text not null references public.categories(id) on delete cascade,
  code text not null default '',
  name text not null,
  label text not null,
  short text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subcategories_category_id on public.subcategories(category_id);

-- 4. MATERIALS (Documents linked to Category & optional Subcategory)
create table if not exists public.materials (
  id text primary key,
  category_id text not null references public.categories(id) on delete cascade,
  subcategory_id text references public.subcategories(id) on delete set null,
  subject text not null,
  module text not null default '',
  chapter text not null default '',
  type text not null default 'MODUL',
  title text not null,
  module_url text not null default '',
  lessons_url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_materials_category_id on public.materials(category_id);
create index if not exists idx_materials_subcategory_id on public.materials(subcategory_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.materials enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Profiles policies
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Categories policies
drop policy if exists "Authenticated users can read categories" on public.categories;
create policy "Authenticated users can read categories"
  on public.categories for select
  to authenticated
  using (true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Subcategories policies
drop policy if exists "Authenticated users can read subcategories" on public.subcategories;
create policy "Authenticated users can read subcategories"
  on public.subcategories for select
  to authenticated
  using (true);

drop policy if exists "Admins can manage subcategories" on public.subcategories;
create policy "Admins can manage subcategories"
  on public.subcategories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Materials policies
drop policy if exists "Authenticated users can read materials" on public.materials;
create policy "Authenticated users can read materials"
  on public.materials for select
  to authenticated
  using (true);

drop policy if exists "Admins can manage materials" on public.materials;
create policy "Admins can manage materials"
  on public.materials for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- TABLE & FUNCTION PRIVILEGES (Required for PostgREST / service_role / authenticated)
-- ============================================================================
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on table public.profiles, public.categories, public.subcategories, public.materials to authenticated, service_role;
grant execute on function public.is_admin() to authenticated, service_role;

-- ============================================================================
-- SEED DATA: CATEGORIES
-- ============================================================================
insert into public.categories (id, code, name, short, icon, description, sort_order)
values
  ('gw', '1', 'GENERAL WARFARE', 'GW', 'game-icons:crossed-swords', 'Bahasa Inggris, Manajemen Tempur, dan Informasi Tempur.', 1),
  ('asuw', '2', 'ANTI SURFACE WARFARE', 'ASuW', 'game-icons:battleship', 'Prosedur Taktis AKPA, Penggunaan Senjata AKPA, Taktik FPB, dan Latihan Simulasi.', 2),
  ('asw', '3', 'ANTI SUBMARINE WARFARE', 'ASW', 'game-icons:submarine', 'Pengaruh Alam AKS, Prosedur Taktis, Penggunaan Senjata, Operasi Kapal Selam, dan Simulasi.', 3),
  ('aaw', '4', 'ANTI AIR WARFARE', 'AAW', 'game-icons:jet-fighter', 'Prosedur Taktis PAU, ASMD, Penggunaan Senjata Anti Udara, dan Latihan Simulasi PAU.', 4),
  ('ew', '5', 'ELECTRONIC WARFARE', 'EW', 'game-icons:radar-dish', 'Dasar Pernika dan Pernika.', 5),
  ('mw', '6', 'MINE WARFARE', 'MW', 'mdi:mine', 'Operasi ranjau laut, penyebaran ranjau, perburuan ranjau, dan Mine Countermeasures (MCM).', 6),
  ('ref', '7', 'REFERENSI UMUM LAINNYA', 'REF', 'game-icons:bookshelf', 'Kepustakaan dan referensi doktrin taktis militer internasional.', 7)
on conflict (id) do update set
  code = excluded.code,
  name = excluded.name,
  short = excluded.short,
  icon = excluded.icon,
  description = excluded.description,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ============================================================================
-- SEED DATA: SUBCATEGORIES
-- ============================================================================
insert into public.subcategories (id, category_id, code, name, label, short, sort_order)
values
  ('gw-inggris', 'gw', '1.1', 'Bahasa Inggris', 'Bahasa Inggris', 'GW', 1),
  ('gw-manajemen', 'gw', '1.2', 'Manajemen Tempur', 'Manajemen Tempur', 'GW', 2),
  ('gw-informasi', 'gw', '1.3', 'Informasi Tempur', 'Informasi Tempur', 'GW', 3),
  ('asuw-prosedur', 'asuw', '2.1', 'Prosedur Taktis AKPA', 'Prosedur Taktis AKPA', 'ASuW', 1),
  ('asuw-senjata', 'asuw', '2.2', 'Penggunaan Senjata AKPA', 'Penggunaan Senjata AKPA', 'ASuW', 2),
  ('asuw-fpb', 'asuw', '2.3', 'Taktik Peperangan Fast Patrol Boat', 'Taktik Peperangan Fast Patrol Boat', 'ASuW', 3),
  ('asuw-simulasi', 'asuw', '2.4', 'Latihan Simulasi Peperangan AKPA', 'Latihan Simulasi Peperangan AKPA', 'ASuW', 4),
  ('asw-alam', 'asw', '3.1', 'Pengaruh Alam dalam AKS', 'Pengaruh Alam dalam AKS', 'ASW', 1),
  ('asw-prosedur', 'asw', '3.2', 'Prosedur Taktis AKS', 'Prosedur Taktis AKS', 'ASW', 2),
  ('asw-senjata', 'asw', '3.3', 'Penggunaan Senjata AKS', 'Penggunaan Senjata AKS', 'ASW', 3),
  ('asw-kasel', 'asw', '3.4', 'Operasi Kapal Selam', 'Operasi Kapal Selam', 'ASW', 4),
  ('asw-simulasi', 'asw', '3.5', 'Latihan Simulasi Peperangan AKS', 'Latihan Simulasi Peperangan AKS', 'ASW', 5),
  ('aaw-prosedur', 'aaw', '4.1', 'Prosedur Taktis PAU', 'Prosedur Taktis PAU', 'AAW', 1),
  ('aaw-asmd', 'aaw', '4.2', 'Anti Ship Missile Defence (ASMD)', 'Anti Ship Missile Defence (ASMD)', 'AAW', 2),
  ('aaw-senjata', 'aaw', '4.3', 'Penggunaan Senjata Anti Udara', 'Penggunaan Senjata Anti Udara', 'AAW', 3),
  ('aaw-simulasi', 'aaw', '4.4', 'Latihan Simulasi Peperangan PAU', 'Latihan Simulasi Peperangan PAU', 'AAW', 4),
  ('ew-dasar', 'ew', '5.1', 'Dasar Pernika', 'Dasar Pernika', 'EW', 1),
  ('ew-pernika', 'ew', '5.2', 'Pernika', 'Pernika', 'EW', 2),
  ('ipwo', 'ref', '7.1', '7.1 IPWO INGGRIS', 'IPWO INGGRIS', 'IPWO', 1),
  ('cco', 'ref', '7.2', '7.2 CCO BELANDA', 'CCO BELANDA', 'CCO', 2)
on conflict (id) do update set
  category_id = excluded.category_id,
  code = excluded.code,
  name = excluded.name,
  label = excluded.label,
  short = excluded.short,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ============================================================================
-- SEED DATA: MATERIALS
-- ============================================================================
insert into public.materials (id, category_id, subcategory_id, subject, module, chapter, type, title, module_url, lessons_url, sort_order)
values
  ('gw-inggris-1', 'gw', 'gw-inggris', 'Bahasa Inggris', 'GENERAL WARFARE', 'BAHASA INGGRIS', 'MODUL', 'Performing a short talk', '', '', 1),
  ('gw-inggris-2', 'gw', 'gw-inggris', 'Bahasa Inggris', 'GENERAL WARFARE', 'BAHASA INGGRIS', 'MODUL', 'Speech Development', '', '', 2),
  ('gw-inggris-3', 'gw', 'gw-inggris', 'Bahasa Inggris', 'GENERAL WARFARE', 'BAHASA INGGRIS', 'MODUL', 'Participating in the meeting', '', '', 3),
  ('gw-inggris-4', 'gw', 'gw-inggris', 'Bahasa Inggris', 'GENERAL WARFARE', 'BAHASA INGGRIS', 'MODUL', 'Powerpoint (PPT) development', '', '', 4),
  ('gw-inggris-5', 'gw', 'gw-inggris', 'Bahasa Inggris', 'GENERAL WARFARE', 'BAHASA INGGRIS', 'MODUL', 'Performing in a Debate', '', '', 5),
  ('gw-manajemen-1', 'gw', 'gw-manajemen', 'Manajemen Tempur', 'GENERAL WARFARE', 'MANAJEMEN TEMPUR', 'MODUL', 'Dinas Informasi Tempur', 'https://drive.google.com/file/d/1oWgnbrA_sr-Zk4U77YWkIW6PhHDDD25s/view?usp=sharing', 'https://docs.google.com/presentation/d/1wAgSmnyXkYHisadrwWVHnS0nLtEB0Zls/present?slide=id.p1#slide=id.p1', 6),
  ('gw-manajemen-2', 'gw', 'gw-manajemen', 'Manajemen Tempur', 'GENERAL WARFARE', 'MANAJEMEN TEMPUR', 'MODUL', 'Aturan Pelibatan (ROE)', 'https://drive.google.com/file/d/17xcShxpNLsUPeCjvM6FKfbOWlTqB0NMA/view?usp=sharing', 'https://docs.google.com/presentation/d/1rCt_dSNpU0gGqZAKX8fmMWf6XGygwkIg/present?slide=id.p1#slide=id.p1', 7),
  ('gw-manajemen-3', 'gw', 'gw-manajemen', 'Manajemen Tempur', 'GENERAL WARFARE', 'MANAJEMEN TEMPUR', 'MODUL', 'Laporan Sergapan (Raid Reporting)', 'https://docs.google.com/presentation/d/1bhbsUlJp7efF1MRlkrojPvLe7tZFtvUu/present?usp=drive_web&ouid=109411807886520144132&rtpof=true', 'https://drive.google.com/file/d/19O_NoOizfuIaBZNM-mL0FqNhKWRYMa6m/view?usp=sharing', 8),
  ('gw-manajemen-4', 'gw', 'gw-manajemen', 'Manajemen Tempur', 'GENERAL WARFARE', 'MANAJEMEN TEMPUR', 'MODUL', 'Command, Control, Computer, Communication, Cyber, Intelligence, Surveillance and Reconnaissance (C5ISR)', 'https://drive.google.com/file/d/1a8Z2Lbd04zBXqg-fRF7-haYbC_G-11J6/view?usp=sharing', 'https://docs.google.com/presentation/d/19gXes1ZQ1eVO_DY6X8lY7LiHrhRilE9V/present?usp=drive_web&ouid=109411807886520144132&rtpof=true', 9),
  ('gw-manajemen-5', 'gw', 'gw-manajemen', 'Manajemen Tempur', 'GENERAL WARFARE', 'MANAJEMEN TEMPUR', 'MODUL', 'Peperangan Asimetris', '', 'https://docs.google.com/presentation/d/1Cq24LjG6nw2wahhihLYgoNa423QvQo96/present?slide=id.p1#slide=id.p1', 10),
  ('gw-informasi-1', 'gw', 'gw-informasi', 'Informasi Tempur', 'GENERAL WARFARE', 'INFORMASI TEMPUR', 'MODUL', 'Pengenalan (Recognition)', 'https://drive.google.com/file/d/1H_FPjLqsRLXqGNEtKqX1zzErOtpPBubo/view?usp=sharing', 'https://drive.google.com/drive/folders/1Pko0sAg2i-a4-wfDjiDaJGqYHlp26VWT', 11),
  ('gw-informasi-2', 'gw', 'gw-informasi', 'Informasi Tempur', 'GENERAL WARFARE', 'INFORMASI TEMPUR', 'MODUL', 'Kemampuan Regional (Regcap)', 'https://drive.google.com/file/d/1cMwnEL9xOBrOQJ5TSv8KNqkH-2bAB6vt/view?usp=sharing', 'https://docs.google.com/presentation/d/1PRAvp0quaPmu6WEUWVX1p5yRawMWmn0w/present?slide=id.p1', 12),
  ('gw-informasi-3', 'gw', 'gw-informasi', 'Informasi Tempur', 'GENERAL WARFARE', 'INFORMASI TEMPUR', 'MODUL', 'Intelijen Maritim', 'https://drive.google.com/file/d/1iPaa2rfDYeox3rmpllYy7QcGlYHIdhqZ/view?usp=sharing', 'https://docs.google.com/presentation/d/1wAgSmnyXkYHisadrwWVHnS0nLtEB0Zls/present?slide=id.p1#slide=id.p1', 13),
  ('gw-informasi-4', 'gw', 'gw-informasi', 'Informasi Tempur', 'GENERAL WARFARE', 'INFORMASI TEMPUR', 'MODUL', 'Komunikasi Pertempuran', '', '', 14),
  ('gw-informasi-5', 'gw', 'gw-informasi', 'Informasi Tempur', 'GENERAL WARFARE', 'INFORMASI TEMPUR', 'MODUL', 'Meteorologi', '', '', 15),
  ('asuw-prosedur-1', 'asuw', 'asuw-prosedur', 'Prosedur Taktis AKPA', 'ANTI SURFACE WARFARE', 'PROSEDUR TAKTIS AKPA', 'MODUL', 'Introduksi AKPA', '', 'https://drive.google.com/file/d/19JvSHDCSGOq8-eTptLzjJN-lN7v4jGfA/view?usp=sharing', 16),
  ('asuw-prosedur-2', 'asuw', 'asuw-prosedur', 'Prosedur Taktis AKPA', 'ANTI SURFACE WARFARE', 'PROSEDUR TAKTIS AKPA', 'MODUL', 'Perencanaan Operasi AKPA', 'https://drive.google.com/file/d/1acqwDN6h7sXpM7cyI0vvV6evluAB7Um3/view?usp=sharing', 'https://docs.google.com/presentation/d/15Cd2ayda13mgoxiSh4Qf1mE34A8jJmcz/present?slide=id.p1#slide=id.p1', 17),
  ('asuw-prosedur-3', 'asuw', 'asuw-prosedur', 'Prosedur Taktis AKPA', 'ANTI SURFACE WARFARE', 'PROSEDUR TAKTIS AKPA', 'MODUL', 'Kalkulasi Tempur AKPA', 'https://drive.google.com/file/d/1RS6_bySn1MdlIJ35dOkXXYpoYHBRi9yt/view?usp=sharing', 'https://drive.google.com/file/d/1QlCY_JhoYwL91hlmtS7Bu1IqP6WufzBM/view?usp=sharing', 18),
  ('asuw-prosedur-4', 'asuw', 'asuw-prosedur', 'Prosedur Taktis AKPA', 'ANTI SURFACE WARFARE', 'PROSEDUR TAKTIS AKPA', 'MODUL', 'Gambaran Taktis AKPA', 'https://drive.google.com/file/d/17pSekeinc2ewc8uTdUzFWrCdqHPWPi1W/view?usp=sharing', 'https://docs.google.com/presentation/d/17DmnVfhf6rJkC0k0Odqyt4Bi99KgQRog/present?rtpof=true&slide=id.p1', 19),
  ('asuw-prosedur-5', 'asuw', 'asuw-prosedur', 'Prosedur Taktis AKPA', 'ANTI SURFACE WARFARE', 'PROSEDUR TAKTIS AKPA', 'MODUL', 'Proskomtis AKPA', 'https://drive.google.com/file/d/1YhRPA54bqonoLcv3enOG1QEPGYVhnlx1/view?usp=sharing', '', 20),
  ('asuw-prosedur-6', 'asuw', 'asuw-prosedur', 'Prosedur Taktis AKPA', 'ANTI SURFACE WARFARE', 'PROSEDUR TAKTIS AKPA', 'MODUL', 'Sensor AKPA', 'https://drive.google.com/file/d/12YhP9cni5l3TAak-PdbkYywGUIAtKkoZ/view?usp=sharing', '', 21),
  ('asuw-prosedur-7', 'asuw', 'asuw-prosedur', 'Prosedur Taktis AKPA', 'ANTI SURFACE WARFARE', 'PROSEDUR TAKTIS AKPA', 'MODUL', 'Kerjasama Taktis Pesud dan KAA', 'https://drive.google.com/file/d/1rZluBL0gYzt32gO-092R97xWtyDG0ptj/view?usp=sharing', '', 22),
  ('asuw-prosedur-8', 'asuw', 'asuw-prosedur', 'Prosedur Taktis AKPA', 'ANTI SURFACE WARFARE', 'PROSEDUR TAKTIS AKPA', 'MODUL', 'Gugus Aksi Permukaan (Surface Action Group)', 'https://drive.google.com/file/d/1BvizX6rf8bWnFSnosuSiYhmfJCqMbUFV/view?usp=sharing', '', 23),
  ('asuw-prosedur-9', 'asuw', 'asuw-prosedur', 'Prosedur Taktis AKPA', 'ANTI SURFACE WARFARE', 'PROSEDUR TAKTIS AKPA', 'MODUL', 'Over The Horizon Target (Penembakan Sasaran Melewati Cakrawala)', 'https://drive.google.com/file/d/1wRtRBCbbDBIGfNpT52QXv1f-OJwDjDeE/view?usp=sharing', '', 24),
  ('asuw-prosedur-10', 'asuw', 'asuw-prosedur', 'Prosedur Taktis AKPA', 'ANTI SURFACE WARFARE', 'PROSEDUR TAKTIS AKPA', 'MODUL', 'Serangan Jarak Dekat', 'https://drive.google.com/file/d/1bPFHO1K--odNfloqbn8FzEMm3XtDIcm2/view?usp=sharing', '', 25),
  ('asuw-prosedur-11', 'asuw', 'asuw-prosedur', 'Prosedur Taktis AKPA', 'ANTI SURFACE WARFARE', 'PROSEDUR TAKTIS AKPA', 'MODUL', 'Pengaruh Alam dalam AKPA', 'https://drive.google.com/file/d/1MZLz_wtdxJ3nhBSdHLVSjLU8yrk_6tOP/view?usp=sharing', '', 26),
  ('asuw-prosedur-12', 'asuw', 'asuw-prosedur', 'Prosedur Taktis AKPA', 'ANTI SURFACE WARFARE', 'PROSEDUR TAKTIS AKPA', 'MODUL', 'Kodal AKPA', 'https://drive.google.com/file/d/1J86QhfZ_FyVRIWifV7ogPUC_4pAiLcB9/view?usp=sharing', '', 27),
  ('asuw-prosedur-13', 'asuw', 'asuw-prosedur', 'Prosedur Taktis AKPA', 'ANTI SURFACE WARFARE', 'PROSEDUR TAKTIS AKPA', 'MODUL', 'SAR dalam AKPA', '', '', 28),
  ('asuw-senjata-1', 'asuw', 'asuw-senjata', 'Penggunaan Senjata AKPA', 'ANTI SURFACE WARFARE', 'PENGGUNAAN SENJATA AKPA', 'MODUL', 'Penggunaan Meriam AKPA dan BTK', 'https://drive.google.com/file/d/1-_KdiWpP3Xrz-fwX2GPYqtRiIS_uWUQq/view?usp=sharing', 'https://drive.google.com/file/d/1HpclmHSImTu-3JLbC3S4bVstCCbyNnWr/view?usp=sharing', 29),
  ('asuw-senjata-2', 'asuw', 'asuw-senjata', 'Penggunaan Senjata AKPA', 'ANTI SURFACE WARFARE', 'PENGGUNAAN SENJATA AKPA', 'MODUL', 'Penggunaan Rudal', 'https://drive.google.com/file/d/1ZKc3BDv6ZZtx8RHUaQzPuo5QR4DT-ZMn/view?usp=sharing', '', 30),
  ('asuw-fpb-1', 'asuw', 'asuw-fpb', 'Taktik Peperangan Fast Patrol Boat', 'ANTI SURFACE WARFARE', 'TAKTIK PEPERANGAN FAST PATROL BOAT', 'MODUL', 'Operasi FPB', 'https://drive.google.com/file/d/1YQtwvbyE_dlfGBlYU5UDl89WDa7hUIFE/view?usp=sharing', '', 31),
  ('asuw-fpb-2', 'asuw', 'asuw-fpb', 'Taktik Peperangan Fast Patrol Boat', 'ANTI SURFACE WARFARE', 'TAKTIK PEPERANGAN FAST PATROL BOAT', 'MODUL', 'Anti FPB', 'https://drive.google.com/file/d/1zjKITMGRjd8-i6Lq7uDa2QjDxHfaLel7/view?usp=sharing', '', 32),
  ('asuw-simulasi-1', 'asuw', 'asuw-simulasi', 'Latihan Simulasi Peperangan AKPA', 'ANTI SURFACE WARFARE', 'LATIHAN SIMULASI PEPERANGAN AKPA', 'MODUL', 'Latihan Simulasi Peperangan AKPA', '', '', 33),
  ('asw-alam-1', 'asw', 'asw-alam', 'Pengaruh Alam dalam AKS', 'ANTI SUBMARINE WARFARE', 'PENGARUH ALAM DALAM AKS', 'MODUL', 'Hidro Oceanografi dalam AKS', 'https://drive.google.com/file/d/1GFFayYQRak14ThLUzu4yCNEImjlDoaK0/view?usp=sharing', '', 34),
  ('asw-alam-2', 'asw', 'asw-alam', 'Pengaruh Alam dalam AKS', 'ANTI SUBMARINE WARFARE', 'PENGARUH ALAM DALAM AKS', 'MODUL', 'Propagasi Bawah Air', 'https://drive.google.com/file/d/144dcJioL42Zg5sbODTuE7lqT2khj61Uk/view?usp=sharing', '', 35),
  ('asw-prosedur-1', 'asw', 'asw-prosedur', 'Prosedur Taktis AKS', 'ANTI SUBMARINE WARFARE', 'PROSEDUR TAKTIS AKS', 'MODUL', 'Introduksi AKS', 'https://drive.google.com/file/d/1HpclmHSImTu-3JLbC3S4bVstCCbyNnWr/view?usp=sharing', '', 36),
  ('asw-prosedur-2', 'asw', 'asw-prosedur', 'Prosedur Taktis AKS', 'ANTI SUBMARINE WARFARE', 'PROSEDUR TAKTIS AKS', 'MODUL', 'Perencanaan Operasi AKS', 'https://drive.google.com/file/d/1LllDoD5bMlmI26KB4JNnXG9EVdobVZTI/view?usp=sharing', 'https://docs.google.com/presentation/d/1y0nnJHBCBKpSBIBXw7NDQDldcIs6rlgl/present?slide=id.p1', 37),
  ('asw-prosedur-3', 'asw', 'asw-prosedur', 'Prosedur Taktis AKS', 'ANTI SUBMARINE WARFARE', 'PROSEDUR TAKTIS AKS', 'MODUL', 'Gambaran Taktis AKS', 'https://drive.google.com/file/d/1bdrPrupdUFtn_TQL8NkMxpw1j3wE-0TL/view?usp=sharing', 'https://docs.google.com/presentation/d/1an6fhUKWD2ff5v2RJDHdCB2b-T94tEz-/present?slide=id.p1#slide=id.p1', 38),
  ('asw-prosedur-4', 'asw', 'asw-prosedur', 'Prosedur Taktis AKS', 'ANTI SUBMARINE WARFARE', 'PROSEDUR TAKTIS AKS', 'MODUL', 'Proskomtis AKS', 'https://drive.google.com/file/d/18kUBlYTv930Amb7UT9lFZril0y_HIlKT/view?usp=sharing', 'https://docs.google.com/presentation/d/1an6fhUKWD2ff5v2RJDHdCB2b-T94tEz-/present?slide=id.p1#slide=id.p1', 39),
  ('asw-prosedur-5', 'asw', 'asw-prosedur', 'Prosedur Taktis AKS', 'ANTI SUBMARINE WARFARE', 'PROSEDUR TAKTIS AKS', 'MODUL', 'Sensor AKS', 'https://drive.google.com/file/d/1it1CoJTYkVGpDJ-SugfpYzxieJ8bPKOB/view?usp=sharing', 'https://docs.google.com/presentation/d/10VuLulFhx8P5hCxt-_Sh1dcnCy-Wi6kh/present?slide=id.p1', 40),
  ('asw-prosedur-6', 'asw', 'asw-prosedur', 'Prosedur Taktis AKS', 'ANTI SUBMARINE WARFARE', 'PROSEDUR TAKTIS AKS', 'MODUL', 'Kerjasama Taktis AKS', 'https://drive.google.com/file/d/1-Mn1JqusyK1_J1DRpHQJqiimqcboHe-c/view?usp=sharing', 'https://docs.google.com/presentation/d/1kuuyR5WHaGM7cz46e69Ogz9AnAJMUvpo/present?slide=id.p1#slide=id.p1', 41),
  ('asw-prosedur-7', 'asw', 'asw-prosedur', 'Prosedur Taktis AKS', 'ANTI SUBMARINE WARFARE', 'PROSEDUR TAKTIS AKS', 'MODUL', 'Aksi AKS', 'https://drive.google.com/file/d/1xMd0CkTkzt2StyUieAcj4JJf52a5YtXL/view?usp=sharing', 'https://docs.google.com/presentation/d/1txzhbiAYg4WoBHni4Cn3f62bBeM-Yx7k/present?slide=id.p1#slide=id.p1', 42),
  ('asw-prosedur-8', 'asw', 'asw-prosedur', 'Prosedur Taktis AKS', 'ANTI SUBMARINE WARFARE', 'PROSEDUR TAKTIS AKS', 'MODUL', 'Anti Ship Torpedo Defence (ASTD)', 'https://drive.google.com/file/d/1iEyyic3fRYndwmzVt7nhG0Vc9wLR9oY3/view?usp=sharing', '', 43),
  ('asw-prosedur-9', 'asw', 'asw-prosedur', 'Prosedur Taktis AKS', 'ANTI SUBMARINE WARFARE', 'PROSEDUR TAKTIS AKS', 'MODUL', 'SAU/ASAU', 'https://drive.google.com/file/d/1_RXmNCNvBjoJb5-3eaoGbmugyIzPGS35/view?usp=sharing', 'https://docs.google.com/presentation/d/16NTm94oWeylQhDbXkcw_eK6kvQwnZPS8/present?slide=id.p1#slide=id.p1', 44),
  ('asw-prosedur-10', 'asw', 'asw-prosedur', 'Prosedur Taktis AKS', 'ANTI SUBMARINE WARFARE', 'PROSEDUR TAKTIS AKS', 'MODUL', 'Tabir AKS', 'https://drive.google.com/file/d/1wYNs3uH0Y0fVeLYruRKZacEmjyT2fKmJ/view?usp=sharing', 'https://docs.google.com/presentation/d/14A67neEZK5LM6rOFI2lYrVTWqmwQN39F/present?usp=drive_web&ouid=109411807886520144132&rtpof=true', 45),
  ('asw-prosedur-11', 'asw', 'asw-prosedur', 'Prosedur Taktis AKS', 'ANTI SUBMARINE WARFARE', 'PROSEDUR TAKTIS AKS', 'MODUL', 'Kodal AKS', 'https://drive.google.com/file/d/19JYsg1siUtZHcI87it-vwiGGPy9xbYk4/view?usp=sharing', 'https://docs.google.com/presentation/d/13hcT-GzdjPEKK8ASA8zw3n9Y66SeyJEW/present?slide=id.p1#slide=id.p1', 46),
  ('asw-prosedur-12', 'asw', 'asw-prosedur', 'Prosedur Taktis AKS', 'ANTI SUBMARINE WARFARE', 'PROSEDUR TAKTIS AKS', 'MODUL', 'Introduksi Coordinated Anti Submarine Exercise (CASEX)', '', 'https://docs.google.com/presentation/d/1enQss_IVxiuH78NY57tT6nQT573sWDTd/present?slide=id.p1#slide=id.p1', 47),
  ('asw-prosedur-13', 'asw', 'asw-prosedur', 'Prosedur Taktis AKS', 'ANTI SUBMARINE WARFARE', 'PROSEDUR TAKTIS AKS', 'MODUL', 'Water Space Management (WSM)', '', 'https://docs.google.com/presentation/d/1CMh9AzcgUDcSJYArFCCmJFL4EFlfevYB/present?slide=id.p1#slide=id.p1', 48),
  ('asw-senjata-1', 'asw', 'asw-senjata', 'Penggunaan Senjata AKS', 'ANTI SUBMARINE WARFARE', 'PENGGUNAAN SENJATA AKS', 'MODUL', 'Penggunaan Torpedo', 'https://drive.google.com/file/d/1vbJVraywqBhuGGzYfUa72biUaLj4T3q6/view?usp=sharing', '', 49),
  ('asw-senjata-2', 'asw', 'asw-senjata', 'Penggunaan Senjata AKS', 'ANTI SUBMARINE WARFARE', 'PENGGUNAAN SENJATA AKS', 'MODUL', 'Penggunaan Roket dan Bom AKS', 'https://drive.google.com/file/d/1wALs_BtS62CtqgFk8nsQ9HtOxMUYHQey/view?usp=sharing', '', 50),
  ('asw-kasel-1', 'asw', 'asw-kasel', 'Operasi Kapal Selam', 'ANTI SUBMARINE WARFARE', 'OPERASI KAPAL SELAM', 'MODUL', 'Taktik KS', 'https://drive.google.com/file/d/1w5tzatrHbdjT5H5wkqxtViPsgr0z7UVi/view?usp=sharing', '', 51),
  ('asw-kasel-2', 'asw', 'asw-kasel', 'Operasi Kapal Selam', 'ANTI SUBMARINE WARFARE', 'OPERASI KAPAL SELAM', 'MODUL', 'Pengoperasian KS', 'https://drive.google.com/file/d/1w5tzatrHbdjT5H5wkqxtViPsgr0z7UVi/view?usp=sharing', 'https://docs.google.com/presentation/d/1xpEeI8sfM2CUTtzRhC0hnnjLKzN6RNNC/present?slide=id.p1#slide=id.p1', 52),
  ('asw-simulasi-1', 'asw', 'asw-simulasi', 'Latihan Simulasi Peperangan AKS', 'ANTI SUBMARINE WARFARE', 'LATIHAN SIMULASI PEPERANGAN AKS', 'MODUL', 'Latihan Simulasi Peperangan AKS', '', 'https://docs.google.com/presentation/d/1enQss_IVxiuH78NY57tT6nQT573sWDTd/present?slide=id.p1#slide=id.p1', 53),
  ('aaw-prosedur-1', 'aaw', 'aaw-prosedur', 'Prosedur Taktis PAU', 'ANTI AIR WARFARE', 'PROSEDUR TAKTIS PAU', 'MODUL', 'Introduksi PAU', '', 'https://docs.google.com/presentation/d/13dZalPLHI-u8it7opyKWaTZR_5nxTIQC/present?usp=drive_web&ouid=109411807886520144132&rtpof=true', 54),
  ('aaw-prosedur-2', 'aaw', 'aaw-prosedur', 'Prosedur Taktis PAU', 'ANTI AIR WARFARE', 'PROSEDUR TAKTIS PAU', 'MODUL', 'Perencanaan Operasi PAU', 'https://drive.google.com/file/d/1J4RVH8q2vAMN-k8BT1s-PoygVATHIX2Z/view?usp=sharing', 'https://docs.google.com/presentation/d/1tqhaPWHfi-g0J6ZlcwvC5WEkIHrS8D4B/present?slide=id.p1#slide=id.p1', 55),
  ('aaw-prosedur-3', 'aaw', 'aaw-prosedur', 'Prosedur Taktis PAU', 'ANTI AIR WARFARE', 'PROSEDUR TAKTIS PAU', 'MODUL', 'Gambaran Taktis PAU', 'https://drive.google.com/file/d/1OKuq7gc_H8wLzn_JfMXXdDeD5qC97HPd/view?usp=sharing', 'https://docs.google.com/presentation/d/1jiVo_AZMTMb3I9-USyDpw23MB2jAkqkI/present?usp=drive_web&ouid=109411807886520144132&rtpof=true', 56),
  ('aaw-prosedur-4', 'aaw', 'aaw-prosedur', 'Prosedur Taktis PAU', 'ANTI AIR WARFARE', 'PROSEDUR TAKTIS PAU', 'MODUL', 'Proskomtis PAU', 'https://drive.google.com/file/d/1I6Mj22Mf4JsAnKVr6nP-7ZLKWdCWy3SD/view?usp=sharing', '', 57),
  ('aaw-prosedur-5', 'aaw', 'aaw-prosedur', 'Prosedur Taktis PAU', 'ANTI AIR WARFARE', 'PROSEDUR TAKTIS PAU', 'MODUL', 'Sensor PAU', 'https://drive.google.com/file/d/1q4z7DcKtglyjKgoSLf1MwuwnabcbAUAi/view?usp=sharing', '', 58),
  ('aaw-prosedur-6', 'aaw', 'aaw-prosedur', 'Prosedur Taktis PAU', 'ANTI AIR WARFARE', 'PROSEDUR TAKTIS PAU', 'MODUL', 'Kerjasama Taktis Pesud dan KAA', 'https://drive.google.com/file/d/1d44DbkhulCmdfuQ7xNsUvOJ4OVuxiVfY/view?usp=sharing', 'https://docs.google.com/presentation/d/12Qvy_UkV6bm8Sbw_-LGZtz4BPtvoAe7B/present?slide=id.p1#slide=id.p1', 59),
  ('aaw-prosedur-7', 'aaw', 'aaw-prosedur', 'Prosedur Taktis PAU', 'ANTI AIR WARFARE', 'PROSEDUR TAKTIS PAU', 'MODUL', 'Kodal PAU', 'https://drive.google.com/file/d/1qDVZsTCpTfllDabzmcmT0US94mrk9BIg/view?usp=sharing', '', 60),
  ('aaw-prosedur-8', 'aaw', 'aaw-prosedur', 'Prosedur Taktis PAU', 'ANTI AIR WARFARE', 'PROSEDUR TAKTIS PAU', 'MODUL', 'Weapon Coordination', '', 'https://docs.google.com/presentation/d/1X5O1aosMIIYfZVG0cRmXUnCXAfBmX4vQ/present?slide=id.p1#slide=id.p1', 61),
  ('aaw-asmd-1', 'aaw', 'aaw-asmd', 'Anti Ship Missile Defence (ASMD)', 'ANTI AIR WARFARE', 'ANTI SHIP MISSILE DEFENCE (ASMD)', 'MODUL', 'ASMD Unit', 'https://drive.google.com/file/d/1nElifGIu2aKxNXimi0knGOJwjT04AXV0/view?usp=sharing', '', 62),
  ('aaw-asmd-2', 'aaw', 'aaw-asmd', 'Anti Ship Missile Defence (ASMD)', 'ANTI AIR WARFARE', 'ANTI SHIP MISSILE DEFENCE (ASMD)', 'MODUL', 'ASMD Gugus Tugas', 'https://drive.google.com/file/d/1_dMzR6KBeRZpzwLon6O3aQX1n7tBooGp/view?usp=sharing', 'https://docs.google.com/presentation/d/16jGeuIHsXobmziZmSGm7yddo2L7egKOB/present?slide=id.p1#slide=id.p1', 63),
  ('aaw-asmd-3', 'aaw', 'aaw-asmd', 'Anti Ship Missile Defence (ASMD)', 'ANTI AIR WARFARE', 'ANTI SHIP MISSILE DEFENCE (ASMD)', 'MODUL', 'Zippo System', '', 'https://docs.google.com/presentation/d/1t1CqXtv7D3BbMPEozO68Q6kaABG5X7fP/present?slide=id.p4#slide=id.p4', 64),
  ('aaw-senjata-1', 'aaw', 'aaw-senjata', 'Penggunaan Senjata Anti Udara', 'ANTI AIR WARFARE', 'PENGGUNAAN SENJATA ANTI UDARA', 'MODUL', 'Penggunaan Meriam Anti Udara', 'https://drive.google.com/file/d/10HN2u0V6OELkoLJ3IM5mGEfpHt33nYcs/view?usp=sharing', '', 65),
  ('aaw-senjata-2', 'aaw', 'aaw-senjata', 'Penggunaan Senjata Anti Udara', 'ANTI AIR WARFARE', 'PENGGUNAAN SENJATA ANTI UDARA', 'MODUL', 'Penggunaan Rudal Anti Udara', 'https://drive.google.com/file/d/1R96kQhtUVZ_PcarJpQj_fFcf9wrTp8a7/view?usp=sharing', '', 66),
  ('aaw-senjata-3', 'aaw', 'aaw-senjata', 'Penggunaan Senjata Anti Udara', 'ANTI AIR WARFARE', 'PENGGUNAAN SENJATA ANTI UDARA', 'MODUL', 'Penggunaan Decoy', 'https://drive.google.com/file/d/1YRA6oM9Sj8qqDoEvbAiKjkvVCdzL5iRN/view?usp=sharing', 'https://docs.google.com/presentation/d/1wbJi-5aSm8ArDcOtnCKXf3QUSYAGts7h/present?slide=id.p1#slide=id.p1', 67),
  ('aaw-simulasi-1', 'aaw', 'aaw-simulasi', 'Latihan Simulasi Peperangan PAU', 'ANTI AIR WARFARE', 'LATIHAN SIMULASI PEPERANGAN PAU', 'MODUL', 'Latihan Simulasi Peperangan PAU', '', '', 68),
  ('ew-dasar-1', 'ew', 'ew-dasar', 'Dasar Pernika', 'ELECTRONIC WARFARE', 'DASAR PERNIKA', 'MODUL', 'Gelombang Elektromagnetik', 'https://docs.google.com/presentation/d/12mTg6PP-A1qfrOKUeVwcJKLLAdPNguJU/present?slide=id.p1#slide=id.p1', 'https://drive.google.com/file/d/1-__QOYOoVgRXNvcaUStBKVWjQZXUJmkN/view?usp=sharing', 69),
  ('ew-dasar-2', 'ew', 'ew-dasar', 'Dasar Pernika', 'ELECTRONIC WARFARE', 'DASAR PERNIKA', 'MODUL', 'Teori Radar', '', 'https://docs.google.com/presentation/d/1glQmxNWxaYZWYT_Dq2X67F2oP0OTSX1V/present?rtpof=true&slide=id.p1', 70),
  ('ew-pernika-1', 'ew', 'ew-pernika', 'Pernika', 'ELECTRONIC WARFARE', 'PERNIKA', 'MODUL', 'Electronic Support (ES)', 'https://drive.google.com/file/d/10y8VOlSAhOVCiNLQfSJ5OLRy2gEieSxv/view?usp=sharing', 'https://docs.google.com/presentation/d/1KVtcNN6EF3K-FOyVpaxzxrdiTNgj0AMP/present?slide=id.p1#slide=id.p1', 71),
  ('ew-pernika-2', 'ew', 'ew-pernika', 'Pernika', 'ELECTRONIC WARFARE', 'PERNIKA', 'MODUL', 'Electronic Attack (EA)', 'https://drive.google.com/file/d/1HdQkO46b4AtKD1tIMh0j8yFcbwmjlwSp/view?usp=sharing', 'https://docs.google.com/presentation/d/19bsbLSsAhgm7VPkmJavjwL1iVT5u1M-g/present?slide=id.p1#slide=id.p1', 72),
  ('ew-pernika-3', 'ew', 'ew-pernika', 'Pernika', 'ELECTRONIC WARFARE', 'PERNIKA', 'MODUL', 'Electronic Protective (EP)', 'https://drive.google.com/file/d/1thvNlRKpT98ZygTgSDjc--1n5u26fU3r/view?usp=sharing', 'https://docs.google.com/presentation/d/1s9D-qMz01ypcJRajZLcUJ4DZwtMVc6Xp/present?slide=id.p1#slide=id.p1', 73),
  ('mw-1', 'mw', null, 'MINE WARFARE', 'MINE WARFARE', 'PEPERANGAN RANJAU', 'MODUL', 'Introduksi Peperangan Ranjau', 'https://drive.google.com/file/d/1OgTVSgcloZ5Iku7yqDVt4ftZkb6fygKI/view?usp=sharing', 'https://docs.google.com/presentation/d/1jGREtXKcmLD7GCD_aVzBCBp5zReZeHGh/present?slide=id.p1#slide=id.p1', 74),
  ('mw-2', 'mw', null, 'MINE WARFARE', 'MINE WARFARE', 'PEPERANGAN RANJAU', 'MODUL', 'Tindakan Perlawanan Ranjau', '', '', 75),
  ('ref-ipwo-1', 'ref', 'ipwo', '7.1 IPWO INGGRIS', 'IPWO INGGRIS', 'AIO & DATA LINKS', 'REFERENSI', 'Intro to AIO-OS', 'https://docs.google.com/presentation/d/1eGqQvTngLDSYC5-p31ml9pErNOdCnM3m/present?slide=id.p1', '', 76),
  ('ref-ipwo-2', 'ref', 'ipwo', '7.1 IPWO INGGRIS', 'IPWO INGGRIS', 'AIO & DATA LINKS', 'REFERENSI', 'Intro to Data Links-OS', 'https://docs.google.com/presentation/d/152YRtJAggnDWSruC6EEAJzSQpRMT9ib0/present', '', 77),
  ('ref-ipwo-3', 'ref', 'ipwo', '7.1 IPWO INGGRIS', 'IPWO INGGRIS', 'AIO & DATA LINKS', 'REFERENSI', 'Comsec-OS', 'https://docs.google.com/presentation/d/1zTHzSx9RAMQE7x2CUtGQLDnoSlQLSb8S/present?slide=id.p1', '', 78),
  ('ref-ipwo-4', 'ref', 'ipwo', '7.1 IPWO INGGRIS', 'IPWO INGGRIS', 'AIO & DATA LINKS', 'REFERENSI', 'AIO Intro-OS', 'https://docs.google.com/presentation/d/17TkXJuEGlUMWFksrZSpP1i6RaG_HFh2D/present', '', 79),
  ('ref-cco-1', 'ref', 'cco', '7.2 CCO BELANDA', 'CCO BELANDA', 'ASW & TACTICAL', 'REFERENSI', 'WSM and PMI', '', 'https://docs.google.com/presentation/d/1CMh9AzcgUDcSJYArFCCmJFL4EFlfevYB/present', 80),
  ('ref-cco-2', 'ref', 'cco', '7.2 CCO BELANDA', 'CCO BELANDA', 'ASW & TACTICAL', 'REFERENSI', 'Introduction to MXP1', '', 'https://docs.google.com/presentation/d/1enQss_IVxiuH78NY57tT6nQT573sWDTd/present', 81),
  ('ref-cco-3', 'ref', 'cco', '7.2 CCO BELANDA', 'CCO BELANDA', 'ASW & TACTICAL', 'REFERENSI', 'ASW Introduction', 'https://docs.google.com/presentation/d/1YMumLhYjTPOJ33uHTVxaN_u4c3XPYU6E/present', '', 82),
  ('ref-cco-4', 'ref', 'cco', '7.2 CCO BELANDA', 'CCO BELANDA', 'ASW & TACTICAL', 'REFERENSI', 'ASW Command & Control', 'https://docs.google.com/presentation/d/13hcT-GzdjPEKK8ASA8zw3n9Y66SeyJEW/present', '', 83),
  ('ref-cco-5', 'ref', 'cco', '7.2 CCO BELANDA', 'CCO BELANDA', 'ASW & TACTICAL', 'REFERENSI', 'ASW Assets', 'https://docs.google.com/presentation/d/1kuuyR5WHaGM7cz46e69Ogz9AnAJMUvpo/present', '', 84),
  ('ref-cco-6', 'ref', 'cco', '7.2 CCO BELANDA', 'CCO BELANDA', 'ASW & TACTICAL', 'REFERENSI', 'ASW Sensors', 'https://docs.google.com/presentation/d/10VuLulFhx8P5hCxt-_Sh1dcnCy-Wi6kh/present', '', 85),
  ('ref-cco-7', 'ref', 'cco', '7.2 CCO BELANDA', 'CCO BELANDA', 'ASW & TACTICAL', 'REFERENSI', 'ASW Classification', 'https://docs.google.com/presentation/d/1an6fhUKWD2ff5v2RJDHdCB2b-T94tEz-/present', '', 86),
  ('ref-cco-8', 'ref', 'cco', '7.2 CCO BELANDA', 'CCO BELANDA', 'ASW & TACTICAL', 'REFERENSI', 'ASW Actions On', 'https://docs.google.com/presentation/d/1txzhbiAYg4WoBHni4Cn3f62bBeM-Yx7k/present', '', 87),
  ('ref-cco-9', 'ref', 'cco', '7.2 CCO BELANDA', 'CCO BELANDA', 'ASW & TACTICAL', 'REFERENSI', 'ASW Attack Plans', 'https://docs.google.com/presentation/d/1y0nnJHBCBKpSBIBXw7NDQDldcIs6rlgl/present', '', 88),
  ('ref-cco-10', 'ref', 'cco', '7.2 CCO BELANDA', 'CCO BELANDA', 'ASW & TACTICAL', 'REFERENSI', 'ASW Voice Procedures', 'https://docs.google.com/presentation/d/1sDQ-ximxu8NTSjIvQRTLqTF0Z-zj_S3N/present', '', 89),
  ('ref-cco-11', 'ref', 'cco', '7.2 CCO BELANDA', 'CCO BELANDA', 'ASW & TACTICAL', 'REFERENSI', 'ASW SAU Procedures', 'https://docs.google.com/presentation/d/16NTm94oWeylQhDbXkcw_eK6kvQwnZPS8/present', '', 90),
  ('ref-cco-12', 'ref', 'cco', '7.2 CCO BELANDA', 'CCO BELANDA', 'ASW & TACTICAL', 'REFERENSI', 'ASW Screening', 'https://docs.google.com/presentation/d/14A67neEZK5LM6rOFI2lYrVTWqmwQN39F/present', '', 91),
  ('ref-cco-13', 'ref', 'cco', '7.2 CCO BELANDA', 'CCO BELANDA', 'ASW & TACTICAL', 'REFERENSI', 'ASW Littoral', 'https://docs.google.com/presentation/d/1o-OlIA41HL7CJghNDgLlSVw9L_OZGpJ8/present', '', 92)
on conflict (id) do update set
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  subject = excluded.subject,
  module = excluded.module,
  chapter = excluded.chapter,
  type = excluded.type,
  title = excluded.title,
  module_url = excluded.module_url,
  lessons_url = excluded.lessons_url,
  sort_order = excluded.sort_order,
  updated_at = now();
