---
name: pwo-banzai-project
description: >-
  Project context, token-saving navigation rules, design tokens, and Next.js + Supabase
  architecture conventions for the PWO Banzai 2026 E-References library. Use whenever
  working on files in this repository to avoid reading large data/CSS files in full.
---

# PWO Banzai 2026 — Agent Guide

## Token-Saving Rules (CRITICAL)
1. **Never read `app.js` or `styles.css` in full.** `app.js` contains ~1,200+ lines of hardcoded `MATERIALS` data, and `styles.css` is ~1,700 lines.
   - Always locate targets first with `Select-String` / `rg -n`, then read only the needed line range.
2. **Do not duplicate large data blocks** when migrating: use a small Node.js script to extract `CATEGORIES` and `MATERIALS` from `app.js` into JSON/SQL seed files instead of pasting them manually.
3. **Preserve non-code assets** in the root (`BANZAI BOOK-2.docx`, `WhatsApp Image...`)—do not move or delete them unless asked.
4. Load [migration-context.md](./references/migration-context.md) only when working on database schema, categories, or design tokens.

## Project Overview
- **Product:** Principal Warfare Officer (PWO) Class of 2026 — Digital Library & Landing Base.
- **Target Stack (Option A):** Next.js (App Router) + Supabase (Auth + PostgreSQL + RLS) + Vercel.
- **Access Model:** Closed / private library (no public signups).
  - `/` — Public or protected landing page (PWO profile, slogans `気迫 Kihaku / 精撃 Seigeki / 必勝 Hisshou`, category preview).
  - `/login` — Login page.
  - `/materi` — Protected digital library (requires authenticated session via Next.js Middleware).
  - `/admin` — Protected admin panel (requires `role = 'admin'` in `profiles`) for managing materials, Drive links (`module` & `lessons`), and creating student/officer accounts via Server Actions (`SUPABASE_SERVICE_ROLE_KEY`).

## Design & Animation Conventions
- **Aesthetic:** Dark tactical naval theme (`#121212` canvas, `#df3030` crimson, `#d3a84f` gold, `#f2ede7` ink).
- **Fonts:** `Oswald` (headings/UI labels) + `DM Sans` (body).
- **Icons:** Iconify web component (`iconify-icon` with `game-icons:*` and `mdi:mine`).
- **Motion:** Lenis smooth scroll + GSAP ScrollTrigger word-by-word heading reveal (`animations.js`).
- **Cards:** Minimal index (`01`, `02`), title, and split CTA buttons (`MODULE (PI)`, `LESSONS`, or `BELUM TERSEDIA` when both URLs are empty). Do not add `type`, `module/chapter` breadcrumbs, or `Google Drive` badge text to material cards.

## Verification
- Static JS check: `node -c <file>`
- Next.js (after migration): `npm run build` and `npm run lint`
