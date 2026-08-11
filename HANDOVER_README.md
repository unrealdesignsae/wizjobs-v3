# WizJobs Prototype Handover

This archive is the complete, portable WizJobs frontend prototype as of 10 August 2026. It includes the editable React source, all local visual assets, the Wizy companion and animation frames, mock job data and company logos, the interactive Dubai map, the generated design-system documentation, hosting adapters, tests, and a production build.

## Quick start

Requirements:

- Node.js 20 or newer
- npm 10 or newer
- Internet access while using the map (the map tiles come from CARTO/OpenStreetMap)

Run locally:

```bash
npm install
npm run dev
```

The Vite development server will print its local URL. The prototype was developed at `http://localhost:4182/`.

Create and test a production handoff:

```bash
npm run build
npm run test:sites
```

The production build is written to `dist/`. The build process also prepares:

- `dist/client/index.html`
- `dist/server/index.js`
- `dist/.openai/hosting.json`

## Routes

| Page | Path |
| --- | --- |
| Jobs dashboard | `/jobs-dashboard/` |
| Profile summary | `/profile-summary/` |
| Analytics | `/analytics/` |
| Opportunity Hub / Explore Jobs | `/explore-jobs/` |
| Profile settings | `/profile-settings/` |
| Login / sign-up prototype | `/login/` |
| CV preview | `/cv-preview/` |

Client-side navigation is handled in `src/App.jsx` with the History API. A static host should route unknown application paths back to `index.html`.

## What is included

### Core website

- Responsive React + Vite single-page prototype.
- Candidate dashboard, profile, analytics, settings, login, and CV preview routes.
- Opportunity Hub with Explore, Applications, Messages, and Saved internal views.
- Twelve mock job opportunities distributed across Dubai.
- Interactive Leaflet map with click/drag panning, mouse/touch zooming, zoom controls, selectable job markers, and a bottom card rail that updates to the visible map bounds.
- Six original flat blue-and-white mock company logos used on job cards and map markers.

### Wizy companion

- Portable `src/components/WizyPet.jsx` component.
- Separate character-body action and chat-button action.
- Random animation on character click plus calm automatic animation cycling.
- Mobile-safe chat window that remains hidden until the chat icon is selected.
- 60 transparent PNG animation frames across four registered clips:
  - `calm-idle` — 24 frames
  - `think-lightbulb` — 12 frames
  - `computer-search` — 12 frames
  - `job-match` — 12 frames
- Cool cyan/cobalt effects, screen-left chat orientation, stable W logo, and reduced-motion support.
- Reuse notes in `src/components/WIZY-INTEGRATION.md`.

### Design system

The durable project rules live in `design-system/wizjobs/MASTER.md` and `AGENTS.md`.

Primary rules:

- Brand blue: `#455FF6`
- White surfaces with pale-blue neutrals and deep-navy text
- Flat fills; no decorative gradients
- Bundled Roboto typography throughout
- Lucide outline icons
- Calm 150–250 ms transitions
- Visible focus states and reduced-motion handling
- Minimum 44px touch targets for primary interactions
- Explore page anatomy follows the approved asymmetric-card / curved-split / map reference

## Important folders

```text
src/                         React application source
src/components/              Wizy and Opportunity Hub components
public/assets/               Brand, UI, Wizy, map, and company-logo media
public/assets/wizy-v2/       Production Wizy frame library
design-system/wizjobs/       Persisted design-system source of truth
scripts/                     Asset preparation, validation, and build helpers
worker/                      Hosting worker entrypoint
tests/                       Hosting compatibility test
.openai/                     Hosting metadata
dist/                        Verified production build
```

## Key implementation files

- `src/App.jsx` — global navigation, routes, and original WizJobs pages.
- `src/styles.css` — global design tokens, responsive layout, page styles, and Wizy presentation.
- `src/components/ExploreJobs.jsx` — Opportunity Hub, mock jobs, Dubai Leaflet map, and viewport-synced job rail.
- `src/components/WizyPet.jsx` — animation state machine and chat behavior.
- `src/components/WIZY-INTEGRATION.md` — instructions for moving Wizy into another React website.
- `WIZZY_ANIMATION_MASTER_PROMPT.md` — visual direction and continuity notes for future animation generation.

## Deployment notes

For a normal static cloud host, use:

- Build command: `npm run build`
- Publish directory: `dist/client`
- SPA fallback: all unknown paths should serve `dist/client/index.html`

For the included OpenAI Sites-compatible handoff, keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` unchanged.

The map uses public CARTO/OpenStreetMap tiles and therefore needs network access at runtime. All other visual media is stored locally in `public/assets`.

## Security and portability

The handover intentionally excludes:

- `node_modules/` — regenerate with `npm install`
- `.git/` — local repository history
- `.qa/` — temporary review screenshots and intermediate contact sheets
- `.vercel/` — machine-specific host metadata
- `.env.local` — local environment values and possible secrets

No backend, production authentication, payment, email, or live job API is included. The current data and interactions are frontend mockups intended for design review and further integration.

## Recommended next steps

1. Connect authentication and candidate data to the production backend.
2. Replace mock jobs with the live jobs/search API.
3. Add a production map provider key and usage policy if higher map volume is expected.
4. Connect Wizy chat to the intended assistant endpoint.
5. Run accessibility, browser, and performance checks again after backend integration.

