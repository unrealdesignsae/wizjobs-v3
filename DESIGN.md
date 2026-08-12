# WizJobs Product Design Contract

WizJobs is a warm, trustworthy hiring marketplace. The visual language follows Airbnb's design-system principles — one unified language, content-led surfaces, restrained decoration, generous whitespace, and friendly geometry — expressed entirely through the WizJobs palette.

This file is the authoritative contract. `design-system/wizjobs/MASTER.md` carries the detailed component and Wizy rules and must not contradict anything below. Where the two disagree, this file wins.

## Principles

1. **Unified** — one type family, one icon set, one spacing rhythm, one elevation ladder across every route. A control looks and behaves the same everywhere it appears.
2. **Content-led** — job photography, company marks, and candidate data carry the visual interest. Chrome recedes: white surfaces, hairline dividers, near-invisible borders.
3. **Restrained** — a single accent color does all the persuading. No gradients, no dark panels, no decorative flourishes, no second accent hue.
4. **Conversational** — soft radii, pill controls, roomy targets, and calm motion. The interface should feel approachable rather than administrative.



## Color

Three brand colors only: **WizJobs blue**, **white**, and **deep navy**. Everything else is a low-saturation navy-tinted neutral derived from them.


| Role            | Token                  | Value     | Usage                                                               |
| --------------- | ---------------------- | --------- | ------------------------------------------------------------------- |
| Brand blue      | `--wj-blue`            | `#455FF6` | Primary buttons, selected states, links, focus ring, match emphasis |
| Blue pressed    | `--wj-blue-press`      | `#3348D8` | Active/pressed state of blue controls only                          |
| Blue soft       | `--wj-blue-soft`       | `#EEF1FF` | Selected chips, subtle highlight fills                              |
| Blue tint       | `--wj-blue-tint`       | `#F6F8FF` | Large quiet fills, hover rows                                       |
| Ink             | `--wj-navy`            | `#141A3C` | Headings and primary text                                           |
| Body            | `--wj-body`            | `#3C4468` | Body copy                                                           |
| Muted           | `--wj-muted`           | `#5F678C` | Secondary metadata, ≥14px only                                      |
| Hairline        | `--wj-hairline`        | `#E6E9F2` | Dividers, card outlines                                             |
| Hairline strong | `--wj-hairline-strong` | `#D3D9EA` | Input borders, emphasized separation                                |
| Canvas          | `--wj-canvas`          | `#FFFFFF` | Page background                                                     |
| Surface soft    | `--wj-surface-soft`    | `#F6F7FB` | Grouped sections, map panel backdrop                                |
| Surface card    | `--wj-surface`         | `#FFFFFF` | Cards and sheets                                                    |
| On brand        | `--wj-on-brand`        | `#FFFFFF` | Label and icon color on a blue or navy fill                         |
| On brand muted  | `--wj-on-brand-muted`  | `rgba(255, 255, 255, 0.82)` | Secondary copy on a blue or navy fill             |
| Danger          | `--wj-danger`          | `#DC2626` | Destructive feedback only                                           |
| Danger soft     | `--wj-danger-soft`     | `#FEECEC` | Quiet fill behind danger status text                                |
| Success         | `--wj-success`         | `#0F766E` | Positive status only                                                |
| Success soft    | `--wj-success-soft`    | `#E6F5F0` | Quiet fill behind success status text                               |
| Warning         | `--wj-warning`         | `#B45309` | Attention and pending status only                                   |
| Warning soft    | `--wj-warning-soft`    | `#FDF3E7` | Quiet fill behind warning status text                               |
| Scrim           | `--wj-scrim`           | `rgba(20, 26, 60, 0.42)` | Backdrop behind modals, sheets, and drawers          |


Rules:

- The page canvas is **white**, not tinted, in the light theme. Grouping comes from `--wj-surface-soft` blocks and hairlines, not from a colored page background.
- Blue is a voltage, not a wash. On any given screen it should appear in a small number of deliberate places: the primary action, the selected state, and the single most important metric.
- Deep navy is text and icon color. In the light theme it is never a large filled panel, never a map surface, never a section background.
- Editorial photography and company artwork may be colorful. Live text, labels, badges, and controls sit on solid surfaces, never on busy imagery.
- Status colors carry an icon or label; color alone never communicates state. Status text pairs with its `-soft` fill, never with a saturated background.
- White on a blue or navy fill is `--wj-on-brand`, not `--wj-surface`. They are both `#FFFFFF`; one is a foreground role and one is a background role, and collapsing them makes the dark theme impossible to reason about.

The status and on-brand tokens were added from evidence rather than invented. An audit of `src/**` (`node scripts/audit-colors.mjs`) found **318 distinct color literals** against this table's tokens. Most collapse cleanly, but three roles were genuinely unnamed and so had no legal target: white text on a brand fill, an attention/pending status distinct from danger, and quiet fills behind status text. A modal scrim was in the same position. Adding them is the difference between a contract the UI can actually satisfy and one it has to cheat.

```css
:root {
  --wj-blue: #455ff6;
  --wj-blue-press: #3348d8;
  --wj-blue-soft: #eef1ff;
  --wj-blue-tint: #f6f8ff;
  --wj-navy: #141a3c;
  --wj-body: #3c4468;
  --wj-muted: #5f678c;
  --wj-hairline: #e6e9f2;
  --wj-hairline-strong: #d3d9ea;
  --wj-canvas: #ffffff;
  --wj-surface: #ffffff;
  --wj-surface-soft: #f6f7fb;
  --wj-on-brand: #ffffff;
  --wj-on-brand-muted: rgba(255, 255, 255, 0.82);
  --wj-danger: #dc2626;
  --wj-danger-soft: #feecec;
  --wj-success: #0f766e;
  --wj-success-soft: #e6f5f0;
  --wj-warning: #b45309;
  --wj-warning-soft: #fdf3e7;
  --wj-scrim: rgba(20, 26, 60, 0.42);
  --wj-focus: rgba(69, 95, 246, 0.32);
}
```

Every color in `src/**` must be one of these tokens. Raw hex and `rgb()` literals outside the `:root` token block are contract violations.

## Themes

**Light is the canonical theme.** Every rule in this document describes the light theme unless it says otherwise, and any screenshot, review, or approval defaults to light.

WizJobs also ships a dark theme, applied as `html[data-theme="dark"]` and toggled from the header. It is a supported product feature, not a deviation to be removed. It is a *derived* ramp: dark overrides swap token values, they do not introduce new hues, new spacing, new radii, or new components. If a surface exists only in dark, it is a bug.

| Role | Token | Value |
| --- | --- | --- |
| Canvas | `--wj-dark-canvas` | `#0B1226` |
| Surface | `--wj-dark-surface` | `#121D38` |
| Raised surface | `--wj-dark-raised` | `#172443` |
| Hairline | `--wj-dark-hairline` | `#24314F` |
| Hairline strong | `--wj-dark-hairline-strong` | `#344575` |
| Ink | `--wj-dark-ink` | `#F5F7FF` |
| Body | `--wj-dark-body` | `#DFE5FF` |
| Muted | `--wj-dark-muted` | `#AAB5D6` |
| Blue on dark | `--wj-dark-blue` | `#8FA3FF` |

```css
html[data-theme='dark'] {
  --wj-canvas: var(--wj-dark-canvas);
  --wj-surface: var(--wj-dark-surface);
  --wj-surface-soft: var(--wj-dark-raised);
  --wj-hairline: var(--wj-dark-hairline);
  --wj-hairline-strong: var(--wj-dark-hairline-strong);
  --wj-navy: var(--wj-dark-ink);
  --wj-body: var(--wj-dark-body);
  --wj-muted: var(--wj-dark-muted);
}
```

Rules:

- Components read `--wj-canvas`, `--wj-surface`, `--wj-navy` and so on. They never read a `--wj-dark-*` token directly and never carry their own `html[data-theme="dark"]` color overrides. Remapping happens once, in the block above. A component-level dark override is the same drift problem as a component-level hex.
- **`--wj-blue` does not change as a fill.** A blue button with a white label works on both canvases. But `#455FF6` as *text* on `#0B1226` measures 3.6:1 and fails AA, so links, selected labels, and blue metric figures switch to `--wj-dark-blue` (7.7:1) in dark.
- `--wj-blue-soft` and `--wj-blue-tint` are light-theme fills. In dark, a selected chip uses a `--wj-dark-raised` fill with a `--wj-dark-blue` border and label.
- Shadows carry almost no hierarchy on a dark canvas. Dark surfaces separate with `--wj-dark-hairline` and a raised fill instead of a heavier shadow.
- The map stays light in both themes. A dark basemap is still forbidden.
- Contrast meets AA in both themes. Dark mode is checked as carefully as light, not assumed to pass because the text is pale.

## Typography

**Plus Jakarta Sans** is the only family, self-hosted as `woff2` under `public/assets/fonts/` in weights 400, 500, 600, and 700. No CDN or `@import` from Google Fonts; the prototype must render correctly offline apart from map tiles.

```css
--wj-font: 'Plus Jakarta Sans', 'Segoe UI', system-ui, -apple-system, sans-serif;
```

Weights stay modest. Airbnb trusts whitespace and photography over typographic muscle, so headings sit at 600 far more often than 700.


| Token               | Size | Weight | Line height | Usage                      |
| ------------------- | ---- | ------ | ----------- | -------------------------- |
| `--wj-type-display` | 32px | 700    | 1.15        | One per page at most       |
| `--wj-type-h1`      | 26px | 700    | 1.2         | Page title                 |
| `--wj-type-h2`      | 22px | 600    | 1.25        | Section heading            |
| `--wj-type-h3`      | 18px | 600    | 1.3         | Card group heading         |
| `--wj-type-title`   | 16px | 600    | 1.35        | Card title, control label  |
| `--wj-type-body`    | 16px | 400    | 1.5         | Default body copy          |
| `--wj-type-body-sm` | 14px | 400    | 1.45        | Dense rows, secondary copy |
| `--wj-type-caption` | 13px | 500    | 1.4         | Metadata, timestamps       |
| `--wj-type-micro`   | 12px | 600    | 1.3         | Badges and pills only      |


Rules:

- **12px is the absolute floor.** Nothing renders below it. Repeated body metadata uses 14px or larger.
- Display and h1 may use `clamp()` to shrink toward the mobile end, but never below the h2 size.
- Letter-spacing is `0` everywhere except display/h1, which may use `-0.4px`.
- Never rely on synthesized bold or italic; use a real bundled weight.
- Numerals in metrics and match scores use `font-variant-numeric: tabular-nums`.

Icons are `lucide-react` outline icons only, at 16, 20, or 24px, inheriting text color. No emoji as interface icons, no rasterized icons, no second icon family.

## Space, shape, and elevation

4px base rhythm: `4, 8, 12, 16, 24, 32, 48, 64, 96`. Nothing between steps.

```css
--wj-space-1: 4px;  --wj-space-2: 8px;   --wj-space-3: 12px;
--wj-space-4: 16px; --wj-space-5: 24px;  --wj-space-6: 32px;
--wj-space-7: 48px; --wj-space-8: 64px;  --wj-space-9: 96px;
```

Airbnb-style generosity: section padding is 32–48px on desktop and 16–24px on mobile. Cards breathe at 16–24px internal padding. When in doubt, add space rather than a border.

Radii — friendly, never hard-cornered:

```css
--wj-radius-sm: 8px;    /* chips, small controls, inputs */
--wj-radius-md: 12px;   /* buttons, list rows */
--wj-radius-lg: 16px;   /* cards, panels */
--wj-radius-xl: 24px;   /* hero surfaces, sheets */
--wj-radius-pill: 999px;/* search bar, filter pills, avatars */
```

One restrained elevation ladder. Shadows are navy transparencies used for hierarchy, never decoration:

```css
--wj-shadow-sm: 0 1px 2px rgba(20, 26, 60, 0.06);
--wj-shadow-md: 0 6px 16px rgba(20, 26, 60, 0.10);
--wj-shadow-lg: 0 12px 28px rgba(20, 26, 60, 0.14); /* overlays and dialogs only */
```

A resting card uses a hairline border or `--wj-shadow-sm`, not both plus a fill. Hover may lift a card to `--wj-shadow-md` without moving layout.

## Interaction

- Interactive targets are at least 44 × 44px. Visual size may be smaller only when padding preserves the hit area.
- Clickable elements set `cursor: pointer` and expose an accessible name.
- Focus is always visible: `outline: 3px solid var(--wj-focus); outline-offset: 2px;` on `:focus-visible`. Never remove focus without an equally visible replacement.
- Text contrast meets WCAG AA at every size.
- Decorative hover movement is gated behind `@media (hover: hover) and (pointer: fine)`.
- Press feedback may use `transform: scale(0.97)` for 100–160ms and must not shift layout.



## Motion

Motion is tokenized so timing stays consistent across routes:

| Role | Token | Value |
| --- | --- | --- |
| Direct response | `--wj-duration-quick` | `200ms` |
| Entrance | `--wj-duration-enter` | `420ms` |
| Stagger step | `--wj-stagger` | `120ms` |
| Entrance and direct curve | `--wj-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| On-screen curve | `--wj-ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` |

- Direct interactions: 150–250ms. Entrances: 360–500ms. Stagger between siblings: 100–140ms. The tokens above sit mid-range; a value outside these ranges needs a reason.
- Ease-out for entrances and direct responses, ease-in-out for elements already on screen. Use the tokens rather than repeating the curve.
- Animate `transform` and `opacity` only. Always name the transitioned properties.
- Entrances fade from 0 with `translateY(10–14px)`. Content stays interactive throughout.
- Explore reveals in spatial order: summary, left discovery cards, map, then map controls and result rail. The map fades in gently; no zoom spectacle.
- `prefers-reduced-motion: reduce` removes transforms, stagger, parallax, and looping motion while keeping all content visible and short opacity feedback intact.

Forbidden: `transition: all`, `ease-in` as an entrance curve, bounce or overshoot, `scale(0)` entrances, and layout-animating properties.

## Components

**Buttons** — Primary is blue fill, white label, `--wj-radius-md`, 44px min height, 16–24px horizontal padding, weight 600. Secondary is white fill with a `--wj-hairline-strong` border and navy label. Tertiary is text-only in blue. Destructive uses `--wj-danger` and requires confirmation for irreversible actions. Disabled stays legible and pairs with a label or icon.

**Inputs** — White fill, `--wj-hairline-strong` border, `--wj-radius-sm`, 44px min height, navy text, muted placeholder. Focus swaps the border to blue and adds the focus ring. Errors show `--wj-danger` border plus a text message; never color alone.

**Search** — The primary search control is a pill (`--wj-radius-pill`) on white with `--wj-shadow-sm`, echoing the marketplace pattern. It stays legible over the map at every width.

**Cards** — White surface, `--wj-radius-lg`, hairline border or `--wj-shadow-sm`, 16–24px padding. Media sits flush to the top corners with matching radius. Title uses `--wj-type-title`, metadata `--wj-type-caption` in muted. Hover lifts to `--wj-shadow-md`. The whole card is one click target with a single accessible name.

**Applications summary card** — Stays a solid `#455FF6` field with white type and a minimal white illustration drawn directly on the blue. It must not become a white card or contain a white image panel.

**Chips and filters** — Pill shaped, `--wj-type-caption`, white with hairline border when unselected, `--wj-blue-soft` fill with blue text and blue border when selected. Selected state is announced, not just colored.

**Match indication** — Explainable and honest. Show the contributing reasons alongside any score. Emphasis uses blue and weight, never a second hue or a progress-bar gradient.

## Opportunity Hub and map

- The Hub stays under Jobs beside Analytics and keeps Explore, Applications, Messages, and Saved. Language is candidate-side throughout; no employer applicant-management framing.
- Explore keeps its asymmetric varied-size discovery composition on the left and the curved white-to-map transition.
- **The map is light.** A dark or navy map surface is forbidden, in both themes. Already satisfied: the app loads CARTO `light_all` and keeps it when the theme switches to dark.
- Markers are white pills with `--wj-radius-pill`, `--wj-shadow-sm`, an abstract company mark, and the match figure in navy. The selected marker inverts to blue fill with white text. Never use applicant portraits as markers. Largely satisfied: `.company-map-marker` is a white circle with navy figures. It sits at 38px, below the 44px target.
- The bottom result rail holds several small horizontal cards reflecting the current map viewport, synchronized both ways with marker selection.
- Map controls, search, account thumbnail, result rail, and Wizy never overlap or clip at any supported width.



## Wizy

Wizy's character, proportions, badge, animation clips, and behavior are **locked and out of scope for visual refactors**. See `design-system/wizjobs/MASTER.md`. Only Wizy's surrounding chrome — chat panel surface, typography, and focus states — adopts the tokens in this file.

**Wizy's body is the only chat toggle.** There is no separate chat icon control. Verified against the running app: `WizyPet` renders a single `.wizzy-character-button` wrapping the character, labelled Open / Close / Restore Wizy chat depending on state.

An earlier reading of this file recorded a contradiction with a `.wizzy-chat-icon` control. That control exists only in `WizyCoach`, a duplicate Wizy component in `src/App.jsx` that is defined and never rendered, plus its orphaned CSS in `src/styles.css`. Both are dead code and should be deleted rather than reconciled. Until they are, do not use them as a reference for how Wizy behaves.



## Forbidden

- Any color outside the token table, including raw hex or `rgb()` literals in component styles
- Decorative gradients — `linear-gradient`, `radial-gradient`, and their repeating forms. A `conic-gradient` with hard stops is permitted **only** to render data such as a progress ring or gauge, using one brand color against a neutral track.
- Large dark or navy filled panels in the light theme
- Component-level `html[data-theme="dark"]` color overrides; the dark ramp is remapped once at the root
- A dark map basemap
- Type below 12px, a second font family, or synthesized weights
- Emoji as interface icons, or a second icon family
- `transition: all`, `ease-in` entrances, bounce, or `scale(0)`
- Invisible focus, sub-44px targets, or layout-shifting hover
- Applicant portraits as company or map markers



## Verification

Machine-checked by `node scripts/design-lint.mjs`, which must report zero violations:

- [ ] No color literals outside the `:root` token block
- [ ] No decorative gradients
- [ ] Single font family, no font-size below 12px
- [ ] No `transition: all` and no `ease-in` entrance curves
- [ ] No declared interactive height or width below 44px

The target-size rule reads declared dimensions and cannot see padding, so a deliberately small visual control with a large hit area — a checkbox, a radio — will still be reported. That is a prompt to confirm the hit area, not licence to relax the rule.

Verified by hand at 375, 768, 1024, and 1440px on every route, in both themes:

- [ ] White canvas in light, `--wj-dark-canvas` in dark; generous section spacing, hairline separation
- [ ] Dark theme reads only remapped root tokens, meets AA, and adds no surface that light lacks
- [ ] Blue appears only on primary action, selection, and key emphasis
- [ ] Focus rings, pointer affordances, and accessible names present
- [ ] Reveals are calm, sequenced, and non-blocking; reduced motion removes movement without hiding content
- [ ] Map is light, viewport-linked, and uses company marks
- [ ] Applications card is blue with a white illustration
- [ ] Wizy is uncropped, canonical, and unobstructed