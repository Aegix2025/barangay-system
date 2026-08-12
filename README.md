# Barangay SF II — Barangay Information Management System (BIMS)

Web-based information management system for **Barangay SF II, Limay, Bataan**: resident and household records,
purok/zone demographics, certificate issuance, blotter logging, announcements, and an activity log.

Built with **React 18 + TypeScript + Vite + Tailwind CSS**. Data is currently generated from a local seed dataset
(`src/data/seedData.ts`), so the app runs entirely in the browser with no backend required.

## Features

| Module | Description |
| --- | --- |
| Dashboard | Population, sector and purok statistics with charts |
| Puroks | Demographics per purok/zone (Purok 1–8) |
| Residents | Registry with search, purok/sector filters, full profile view and inline editing |
| Households | Family registry linked to residents and puroks |
| Officials | Barangay officials directory |
| Certificates | Clearance, Residency, Indigency, Business Clearance, Good Moral — printable |
| Blotter | Peace and order case logging |
| Announcements | Barangay announcements and events |

## Requirements

- Node.js 18 or newer
- npm 9 or newer

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 3000 (exposed on the network) |
| `npm run dev:local` | Start the dev server on localhost only |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint over the project |

## Project structure

```
src/
  components/     Feature modules (Dashboard, Residents, Households, ...)
    ui/           Shared UI primitives (combobox, birthday picker)
  data/           Seed data used to populate the app
  hooks/          Activity log and notification hooks
  lib/            Utilities (className merge helper)
  types/          Shared TypeScript types
  utils/          Export helpers (SQL/JSON)
public/           Static assets served as-is (logo, background)
```

## Notes

- Tailwind is compiled through PostCSS (`tailwind.config.js`, `postcss.config.js`); class names must appear
  literally in the source so the compiler can find them — avoid building class names by string concatenation.
- Styling is light-mode only by design.


