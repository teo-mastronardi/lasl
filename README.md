# Leamington Adult Soccer League — Website

A modern, frontend-only website for the **Leamington Adult Soccer League
(LASL)**. It replaces the league's old GoDaddy Website Builder site with a
fast, mobile-friendly, spreadsheet-driven web app.

- **Live data** comes from a Google Sheet — no backend, database or login.
- **Editing the site** mostly means editing the spreadsheet.
- **Deploying** happens automatically: push to GitHub → Vercel builds and ships.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Project structure](#project-structure)
3. [Running it locally](#running-it-locally)
4. [The Google Sheet (the CMS)](#the-google-sheet-the-cms)
5. [Editing league data](#editing-league-data)
6. [Environment variables](#environment-variables)
7. [Deploying to Vercel](#deploying-to-vercel)
8. [GitHub repository setup](#github-repository-setup)
9. [Migrating the domain from GoDaddy](#migrating-the-domain-from-godaddy)
10. [SEO & redirects](#seo--redirects)
11. [Maintenance notes](#maintenance-notes)

---

## Tech stack

| Concern    | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | React 19 + TypeScript                    |
| Build tool | Vite 6                                   |
| Styling    | Tailwind CSS v4                          |
| Routing    | React Router v7                          |
| Data       | Google Sheets, read as CSV via Papa Parse |
| Hosting    | Vercel (static SPA)                      |

No backend, no database, no authentication, no server-side rendering.

## Project structure

```
src/
  components/
    layout/        Header, Footer, Logo, PageHeader, PageContainer
    navigation/    NavBar, MobileMenu, NavDropdown, navItems
    tables/        StandingsTable, SortableTh
    cards/         MatchCard, ScoreCard, TeamCard
    teams/         TeamBadge, TeamLabel, TeamRecord, RosterList
    common/        Loading, ErrorState, EmptyState, icons, …
  pages/           One folder per route (Home, Schedule, … Team, NotFound)
  services/        googleSheets.ts — the data layer
  hooks/           useLeagueData, useDocumentTitle, useSortableData
  types/           league.ts — one interface per spreadsheet tab
  utils/           format.ts (dates), league.ts (selectors)
  data/            site.ts (static site configuration)
  router/          routes.tsx
```

## Running it locally

Requires **Node.js 20+**.

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build locally
```

If the Google Sheet is unreachable each section renders its own empty state.
There is no bundled-sample-data fallback — what you see is what is in the
sheet (or nothing, if a fetch fails).

---

## The Google Sheet (the CMS)

All league information lives in **one Google Sheet**. Each tab is one dataset.

> **The sheet must be public.** In Google Sheets:
> **Share → General access → "Anyone with the link" → "Viewer".**
> If it is not public, the data pages render empty.

The current sheet ID is set in [`src/services/googleSheets.ts`](src/services/googleSheets.ts)
(`DEFAULT_SHEET_ID`) and can be overridden with the `VITE_SHEET_ID` environment
variable.

### Required tabs and columns

Tab names and column headers must match exactly (lower-case, no spaces).

**`standings`**

| team | gp  | w   | d   | l   | gf  | ga  | gd  | pts | logoSlug |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | -------- |

`logoSlug` links a row to a team in the `teams` tab. `gd` is optional — if left
blank it is calculated as `gf − ga`.

**`schedule`**

| date | time | home | away | field |
| ---- | ---- | ---- | ---- | ----- |

**`results`**

| date | home | away | homeScore | awayScore |
| ---- | ---- | ---- | --------- | --------- |

**`goal_scorers`**

| player | team | goals |
| ------ | ---- | ----- |

**`teams`**

| slug | name | logo | primaryColor | secondaryColor | captain |
| ---- | ---- | ---- | ------------ | -------------- | ------- |

`slug` is the URL id (e.g. `fc-red` → `/team/fc-red`). `logo` is an optional
image URL; when blank the site draws a coloured badge from `primaryColor`.
Colours are hex values like `#dc2626`.

**`sponsors`**

| name | logo | url |
| ---- | ---- | --- |

**`roster`**

| team | player | isCaptain | isKeeper |
| ---- | ------ | --------- | -------- |

`team` matches a team's `name` or `slug`. `isCaptain` / `isKeeper` accept
`TRUE`/`FALSE` (or `yes`, `x`, `1`).

### Date format

Dates may be `YYYY-MM-DD` (e.g. `2026-05-20`) or `M/D/YYYY` (e.g. `5/20/2026`).
Times are shown exactly as typed (e.g. `6:30 PM`).

---

## Editing league data

For league admins — **no coding required**:

1. Open the Google Sheet.
2. Edit the relevant tab (add a result row, update standings, etc.).
3. Save. The website picks up changes within a few minutes (it caches data
   briefly). A hard refresh shows changes immediately.

To add a team: add a row to `teams`, then reference that team's `name` in the
other tabs. To add players: add rows to `roster`.

---

## Environment variables

| Variable        | Required | Description                                          |
| --------------- | -------- | ---------------------------------------------------- |
| `VITE_SHEET_ID` | No       | Google Sheet ID. Overrides the committed default.    |

- Locally: copy `.env.example` to `.env`.
- On Vercel: **Project Settings → Environment Variables**.
- Vite inlines `VITE_*` variables **at build time**, so after changing one you
  must **redeploy**.
- A Sheet ID is not a secret (it is visible in the client bundle either way),
  so the site works on Vercel even with no environment variables set.

---

## Deploying to Vercel

The first deploy is a one-time setup; after that, **every push to `main`
deploys automatically.**

1. Push this repository to GitHub (see next section).
2. Go to [vercel.com](https://vercel.com) → **Add New → Project**.
3. Import the GitHub repository.
4. Vercel auto-detects Vite. The defaults are already correct
   (build `npm run build`, output `dist`) and are also pinned in
   [`vercel.json`](vercel.json).
5. Click **Deploy**.

`vercel.json` also configures the SPA fallback (so deep links like
`/team/fc-red` work), long-term caching for assets, and the legacy URL
redirects below.

---

## GitHub repository setup

```bash
git init
git add .
git commit -m "Initial commit: LASL website"
git branch -M main
git remote add origin https://github.com/<your-account>/lasl.git
git push -u origin main
```

`.env` is git-ignored — do not commit it.

---

## Migrating the domain from GoDaddy

`lasl.ca` is **registered** with GoDaddy. Only the **DNS records** need to
change — you keep the domain at GoDaddy and just point it at Vercel.

1. **Deploy to Vercel first** and confirm the site works on the temporary
   `*.vercel.app` URL.
2. In Vercel: **Project → Settings → Domains → Add** `lasl.ca` and `www.lasl.ca`.
3. Vercel shows the DNS records to create. Typically:
   - Apex `lasl.ca` → **A record** → `76.76.21.21`
   - `www` → **CNAME** → `cname.vercel-dns.com`
   (Use the exact values Vercel displays — they can change.)
4. In GoDaddy: **My Products → Domain → DNS → Manage DNS**, and update the
   `A` and `CNAME` records to the values from step 3. Remove old records that
   point at the GoDaddy Website Builder.
5. Wait for DNS to propagate (minutes to a few hours). Vercel issues an
   HTTPS certificate automatically.
6. Once the new site is live on `lasl.ca`, you can cancel the GoDaddy Website
   Builder subscription. **Keep the domain registration.**

> Tip: do the DNS switch at a quiet time. DNS changes are reversible — if
> something looks wrong, restore the previous records.

---

## SEO & redirects

- Each page sets its own `<title>`, meta description, canonical URL and Open
  Graph tags (via the `useDocumentTitle` hook).
- `public/robots.txt` and `public/sitemap.xml` are included.
- **Legacy URLs are preserved** with 301 redirects in `vercel.json` so existing
  links and search rankings keep working:

  | Old URL            | New URL              |
  | ------------------ | -------------------- |
  | `/schedule-1`      | `/schedule`          |
  | `/league-table`    | `/standings`         |
  | `/fc-red` … etc.   | `/team/fc-red` … etc.|

  If you find other old URLs, add them to the `redirects` array in `vercel.json`.

---

## Maintenance notes

- **Adding a page:** create `src/pages/<Name>/index.tsx`, add a `<Route>` in
  `src/router/routes.tsx`, and add a nav entry in
  `src/components/navigation/navItems.ts`.
- **Changing contact info, fees, game times:** edit `src/data/site.ts`.
- **Opening / closing registration:** set `registration.open` to `true` or
  `false` in `src/data/site.ts`. When `false`, the Registration and Home pages
  show a "registration period is over" message instead of the sign-up steps.
- **Hero photo:** replace `public/hero.jpg` with any wide image.
- **Brand colours:** edit the `@theme` block in `src/index.css`.
- Keep it simple. See `.github/copilot-instructions.md` and
  `.github/instructions/lasl-guardrails.instructions.md`.
