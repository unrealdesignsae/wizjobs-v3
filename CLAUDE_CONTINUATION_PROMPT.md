# Claude continuation prompt

Copy everything below this line into Claude together with the WizJobs handover ZIP.

---

You are continuing an existing React + Vite prototype called **WizJobs**. Unzip the attached handover, read `HANDOVER_README.md`, `AGENTS.md`, and `design-system/wizjobs/MASTER.md`, then inspect the current implementation before changing anything. Preserve all existing working routes, assets, hosting files, and Wizy behavior.

My goal is to finish and perfect the **entire website**, not just one page. Apply one consistent design system everywhere and learn from the prior visual mistakes. Use the UI/UX Pro Max workflow if it is available. The repository already contains the generated design-system source of truth. Treat the reference layout and the following decisions as authoritative.

## Global WizJobs design system

- Use the same WizJobs brand system on every route: solid blue `#455FF6`, white, pale blue neutrals, and deep navy text.
- Do not use decorative gradients. WizJobs is a solid-blue brand.
- Use one consistent bundled Roboto type family throughout the website. Fix inconsistent font families, weights, sizes, line heights, and tiny text. Body copy must remain comfortably legible.
- Use one icon library throughout: Lucide outline SVG icons. Replace mismatched, rasterized, or inconsistent icons. Do not use emoji as interface icons.
- Make text, icons, and media look crisp rather than pixelated. Avoid scaling low-resolution UI assets. Keep SVGs and local high-resolution assets whenever possible.
- Establish reusable CSS tokens for color, spacing, type scale, border radius, shadows, focus rings, and interaction timing. Use the tokens across all existing pages instead of one-off styling.
- Keep interactions calm and polished: approximately 150–250 ms with stable layout and clear hover, active, and keyboard-focus states.
- Respect `prefers-reduced-motion`, maintain accessible color contrast, and keep important touch targets at least 44px.
- Run a visual consistency check across every route at desktop and mobile sizes. Fix horizontal overflow, cropping, inconsistent spacing, unreadable text, and mismatched controls.

## Explore Jobs / Opportunity Hub

The top-level Jobs route is `/explore-jobs/`. Keep its internal navigation: **Explore, Applications, Messages, Saved**. The user is a job seeker, so do not introduce employer/applicant-management language.

Make the Explore page follow the supplied Hirely reference anatomy very closely while using WizJobs content and colors:

- A large asymmetric left discovery panel with varied-size cards, not a generic list/sidebar.
- A dark Dubai map on the right.
- A gently curved vertical split between the white left panel and the map, matching the reference composition.
- On the map header, include job search, notification, settings, and a small thumbnail/avatar of the account owner.
- On the left, keep varied card sizes and a strong editorial hierarchy similar to the reference: applications, daily matches, work-mode discovery, companies hiring, and a featured role.
- Use solid blue and white only for interface accents. The map may use deep navy as its dark surface.
- Use abstract company logos instead of people for job thumbnails and map markers. The handover already includes six original blue-and-white company logos in `public/assets/job-people/`.
- Keep complete realistic mock job data for Dubai. There are already twelve jobs distributed across areas such as Dubai Design District, Business Bay, Media City, Al Quoz, DIFC, JLT, Downtown, Internet City, Dubai Hills, Expo City, Creek Harbour, and Deira.

## Interactive Dubai map

- Use the existing Leaflet implementation and make it look like an actual map of Dubai.
- The map must support click-and-drag panning, touch panning, mouse/touch zoom, plus visible zoom-in and zoom-out controls.
- Add enough job markers across Dubai so panning reveals different opportunities.
- Markers must display company-logo thumbnails and match percentages.
- Add several **small horizontal job cards along the bottom of the map**, like the reference. Do not use one oversized card.
- The bottom cards must reflect the jobs currently visible in the map viewport. When the user pans or zooms to a different area, the cards should update accordingly.
- Selecting a marker or bottom card should select the corresponding job and keep both representations synchronized.
- Ensure map controls, search, account thumbnail, bottom cards, and Wizy do not overlap or become cropped.

## Existing pages to normalize

Audit and polish all existing routes, including:

- `/jobs-dashboard/`
- `/profile-summary/`
- `/analytics/`
- `/explore-jobs/`
- `/profile-settings/`
- `/login/`
- `/cv-preview/`

The dashboard/profile pages previously showed inconsistent tiny fonts and mismatched icons. Fix them using the global tokens. Keep the existing content and functionality unless a visual inconsistency requires a component cleanup.

## Wizy companion

Keep the existing Wizy pet and do not replace it with a static image.

- His name is **Wizy**.
- Keep his canonical proportions, circular side caps, stable white asymmetric WizJobs W badge, and consistent character registration across all animation frames.
- No circle or colored disk behind the robot.
- Keep motion calm, smooth, continuous, and settled. Do not shake, jitter, rapidly switch poses, or crop the character.
- Wizy automatically cycles through the approved calm animation sets with pauses.
- Clicking Wizy’s body plays a random non-idle animation in addition to the automatic cycle.
- Only the separate circular chat icon opens/closes chat. Clicking the robot body must not open chat.
- Chat and chat-related gaze/gestures are on screen-left, so Wizy’s relevant actions and props must face left.
- Keep the thinking lightbulb cool cyan/cobalt only; no yellow or warm glow.
- Preserve the computer/search and job-match actions, including tasteful small shapes such as a lightbulb, search card, magnifier, checkmark, or sparkles.
- On mobile, the chat stays hidden until the chat icon is tapped. When opened, show the chat and robot together without clipping, overflow, or obstruction.
- The production animation library is in `public/assets/wizy-v2/` and is documented in `src/components/WIZY-INTEGRATION.md`.

## Verification and delivery

- Do not stop at code changes. Run the local server and visually inspect the result in a browser.
- Test the Explore map by panning, zooming, clicking markers, clicking bottom cards, searching, and switching internal tabs.
- Test Wizy body click, automatic cycling, chat icon, chat open/close, and mobile chat layout.
- Check all routes at approximately 1440px, 1024px, 768px, and 375px widths.
- Confirm there is no unwanted horizontal scroll.
- Run `npm run build` and `npm run test:sites` before handoff.
- Preserve `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` so the project remains compatible with the included cloud/Sites handoff.
- Update `HANDOVER_README.md`, `design-qa.md`, and the design-system documentation after the final implementation.

Please work autonomously, use the existing assets and code rather than starting over, and continue until the entire prototype passes the visual and functional QA above.

