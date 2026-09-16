# AGENTS.md

E-commerce PWA ("Wcommerce") for selling football jerseys, built with React 19 + Vite + Tailwind CSS v4 and deployed to Vercel. Compiles cleanly via `tsc`. No tests, no ESLint, no Prettier.

## Commands

- `npm run dev` — Vite dev server. IMPORTANT: runs on port **3011** (`vite --port=3011 --host=0.0.0.0`), not the default 5173.
- `npm run lint` — the only verification step: `tsc --noEmit`.
- `npm run build` / `npm run preview` — production build / preview.
- Project has no test framework; do not assume one exists.

## Architecture & data flow (gotchas)

- **Fully client-side, no backend.** "Checkout" just opens a WhatsApp link (`src/utils/cartUtils.ts`). Nothing is ever sent to a server.
- **Catalog source of truth is static JSON in `public/data/*.json`.** The app fetches `/data/<preset>.json` (see `src/App.tsx:36`). There are THREE byte-identical copies — root `data.json`, `data/data.json`, and `public/data/data.json`. Edit the served one (`public/data/`); keep all three in sync, or builds will diverge.
- **Admin edits do NOT write these JSON files.** Changes made in the `/admin` panel persist to localStorage (`wcommerce_<preset>_products` / `wcommerce_<preset>_settings`) and are **re-read on load** in `src/App.tsx`, so they survive a browser reload. To persist catalog changes in the repo, still edit the JSON files by hand.
- **Store presets are hardcoded** in `src/components/admin/AdminDashboard.tsx:31` (`['data.json', 'comida.json', 'tecnologia.json', 'repuestos.json', 'farmacia.json']`). Adding a new store means adding a file to `public/data/` AND adding its name to that array.
- The Vite `vite.config.ts` still contains `/api/data` + `/api/presets` middleware — **dead code** from an older architrave; the app no longer calls them. `/api/upload` is live but dev-server-only.
- `/admin` route = admin panel. Login is hardcoded `admin` / `admin123` (`src/components/admin/AdminLogin.tsx:16`).
- **Admin panel is modular by sidebar sections** (`src/components/admin/`): `AdminSidebar` defines `AdminSection` navigation (`productos`, `identidad`, `apariencia`, `contacto`, `sedes`, `banners`). `AdminDashboard` renders per-section: **Productos** shows ONLY KPIs + `ProductTable` (product CRUD lives here), and the config sections render their own panel — `StoreIdentityPanel` (identity/hero/announcement/hero video), `StoreAppearancePanel` (brand colors), `StoreContactPanel` (socials/WhatsApp numbers), `StoreLocationsPanel` (physical stores CRUD), `BannersPanel` (`BannersManager` CRUD for `HomeBanner[]` with preview/reorder/active toggle). **All config sections share a single `draftSettings` state** in `AdminDashboard` and one global "Guardar Cambios" save bar (dirty-checked against `settings`); changing sidebar section does not lose uncommitted edits. `ProductFormModal` (product CRUD — gallery/video in `ProductMediaSection`, sizes in `SizesSelector`), `ProductTable` + `ProductTableParts` (desktop table / mobile cards via shared parts), `FeedbackModal`, shared styles in `panelStyles.ts`.
- **Global store config** lives in `SiteSettings` (`src/types.ts`): `storeName`, `storeTagline`, `heroTitleLine1/2`, `heroSubtitle`, `announcementEnabled/Text/Link`, `brandPrimaryColor`, `brandSuccessColor`, `stores: StoreLocation[]`, `banners: HomeBanner[]`, `whatsappChannelUrl`, `instagramUrl`, `tiktokUrl`, `facebookUrl`. Defaults are in `src/App.tsx` `DEFAULT_SETTINGS`. On load, `normalizeSettings()` merges localStorage with defaults so new fields are never undefined.
- **Brand colors are dynamic.** `App.tsx` `useEffect` sets `--color-brand-primary` and `--color-brand-success` CSS variables via `document.documentElement.style.setProperty(...)`. Tailwind v4 utilities (`bg-brand-primary`, `text-brand-success`, etc.) read these at runtime. `FlashLogo.tsx` also references these variables, so logo colors follow the theme.
- **Banners carousel** (`src/components/HeroBannerCarousel.tsx`) renders between Hero and FilterBar. Only banners with `active: true` and an `image` URL are shown. Auto-advances every 5 seconds, pauses on hover, dots + arrows for navigation.
- Prices are tiered: ≥3 items (see `WHOLESALE_MIN_ITEMS` in `src/data/mockProducts.ts`) switches every item to `wholesalePrice`. WhatsApp number assignment rotates round-robin via localStorage key `flash_sport_wa_index`.

## Toolchain quirks

- **Tailwind v4, CSS-first config.** Brand tokens (`brand-primary`, `brand-success`, etc.) are defined under `@theme` in `src/index.css`. There is NO `tailwind.config.js`.
- **`tsconfig.json` is `strict`, with `@types/react` / `@types/react-dom` installed** so JSX type-checks. `@/*` resolves to the repo **root**, not `src/` (see `paths` + `vite.config.ts` alias). No source file uses it; relative imports (`../types`, `../../types`) are the convention.
- **PWA caches catalog data.** `public/sw.js` (registered only in production, `src/main.tsx`) caches `/data/*.json` with a network-first strategy — expect stale data until reload; bump `CACHE_NAME` on cache-related changes.
- **Image/video upload** writes to `public/uploads/` (gitignored) and only works on the dev server, not on Vercel; on Vercel only public URLs are usable. The upload/delete calls are guarded with `import.meta.env.DEV` (see `src/components/admin/ProductMediaSection.tsx`) so production never hits the non-existent `/api/upload` endpoint.

## Conventions

- **UI copy, code comments, and commit messages are in Spanish.** Keep new UI text and comments in Spanish.
- `implementacion.txt` and `.kombai/` are design-tool artifacts (source mockup / conversion output), not app code — do not edit.