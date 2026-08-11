# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

The companion's official name is Wizy (one z). Keep the companion reusable and isolated so it can later be packaged for other websites. Preserve the circular side caps (no pointed ears), the rounded asymmetric Wizjobs W badge, the existing chat bubble, and real pose-to-pose animation rather than merely tilting a static image.

Wizy's approved calm-idle animation is the production character and registration lock. Add three complementary coherent sets: thoughtful lightbulb, left-facing computer/job search, and job-match discovery. Motion must be slow and settled, with eased transitions and generous still pauses; never rapid-fire cycle through poses. Across every frame preserve one canonical character model, stable proportions/scale/baseline, circular side caps, and a correctly oriented readable white W logo. Chat-related gaze, props, and gestures must face screen-left toward the chat panel. Small job-related visual symbols such as a lightbulb, search shapes, job cards, a magnifier, or checkmarks are allowed when they remain attached to the action and do not cause jitter.

Use only cool cyan/cobalt colors for the thinking lightbulb; no yellow or warm glow. Do not show a separate message/chat icon beside Wizy. Clicking Wizy's body is the single control that opens or closes the chat and also triggers a calm non-idle animation. Keep generous sprite padding so no helmet, side cap, limb, or effect is cropped. On mobile, keep the chat hidden until Wizy is tapped, then show a viewport-safe chat above a smaller, clearly visible Wizy.

The job-seeker Opportunity Hub lives beside Analytics under the top-level Jobs route. Preserve its internal Explore, Applications, Messages, and Saved views, mock job data, blue map-based discovery layout, and job-seeker framing. Do not reintroduce employer applicant-management language. Keep typography and icon sizing explicit and antialiased across the prototype.

The exact Wizjobs logo reference supplied by the user is `C:\Users\USER\AppData\Local\Temp\codex-clipboard-5108484d-cd8b-4948-ae7b-ef4ebdcbc415.png`. Use its asymmetric white W as the forehead-mark source of truth; do not substitute a generic W, mirror it, or let its shape drift between animation frames. Build and approve the calm-idle set first before creating the other two sets.

Use one flat visual system across every route: WizJobs blue `#455FF6`, white, pale blue neutrals, and deep navy text. Do not use decorative gradients. Use the same bundled Roboto family, Lucide outline icons, typography scale, focus treatment, radii, and interaction timing site-wide. Explore Jobs follows the approved reference anatomy: asymmetric varied-size cards on the left, a gently curved white/blue split, and an interactive Dubai map on the right. Map markers and bottom result cards use abstract company logos rather than applicant portraits, and visible result cards update with the map viewport. Keep transitions calm (150–250ms), reserve at least 44px touch targets, respect reduced-motion, and visually QA at 375px, 768px, 1024px, and 1440px.

On the Hub Explore view, keep interface surfaces blue, white, and pale blue without black or dark navy panels. Colorful generated editorial artwork is intentionally allowed inside job/company thumbnails and card background media. Keep all live text outside busy image areas and prevent labels, badges, headings, and metadata from overlapping at every supported viewport.

On the Applications tracker, stage job cards use distinct status colors: Applied uses WizJobs blue, Interview uses a deeper blue, and Offer uses green. Preserve strong white-text contrast and keep column containers pale and calm.

On mobile, Home, Profile Summary, and Analytics keep the main WizJobs header sticky and expose the primary navigation through a hamburger menu. On the Hub only, the main WizJobs header remains at the top of the document and scrolls away; the inner Hub navigation stays sticky and collapses into its own hamburger/current-view menu in both light and dark modes. Wizy auto-minimizes to his head after the user scrolls into content so he does not cover cards, and restores at the top or when opened.

Treat growth and decline as semantic data colors: positive percentages and upward deltas are green, negative percentages and downward deltas are red, and both are larger and bolder than ordinary metadata. Keep the arrow or sign so color is never the only indicator.

On mobile Messages, use a narrow vertical recruiter avatar rail on the left instead of wide horizontally scrolling conversation cards. Keep the selected recruiter clearly highlighted and preserve a readable conversation pane. Saved uses compact overview metrics and horizontally scrollable filter chips without forcing the page wider than the viewport.

Use `public/assets/profile-aries-v2.png` as Aries Black's canonical profile photo across active V2 routes. Present it as a larger rounded-rectangle editorial portrait, not a tiny circular avatar, and never reintroduce the old red zodiac image, mosaic overlay, vignette, or hover wash that reduces legibility.

Use “Profile strength” everywhere (never “Profile health”) and present it as a compact circular score treatment on Home, Profile Summary, and Analytics. The prototype supports a persistent light/dark theme toggle in the main header; both themes must preserve the same Roboto type scale, legibility, blue brand identity, and contrast. On non-Hub V2 pages, Wizy stays minimized in a bottom-right dock until deliberately opened so he never floats over mid-page content.

V1 is preserved as `C:\Users\USER\Documents\ChatGPT\WizJobs-V1-Snapshot-2026-08-11.zip`. V2 uses `design-system/selected/wizjobs-v2-selected-option-1.png` as the approved source of truth for Home, Profile Summary, and Analytics. Home is a guided job-seeker launchpad, Profile Summary is a professional story and evidence workspace, and Analytics is a clear career-performance dashboard. Every visible card and CTA must navigate to its intended destination or open a meaningful local interaction. Page sections reveal one at a time in spatial order; animated charts and count-up metrics settle once, remain readable during motion, and show their final state immediately when reduced motion is requested.
