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

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Brand blue | `--wj-blue` | `#455FF6` | Primary buttons, selected states, links, focus ring, match emphasis |
| Blue pressed | `--wj-blue-press` | `#3348D8` | Active/pressed state of blue controls only |
| Blue soft | `--wj-blue-soft` | `#EEF1FF` | Selected chips, subtle highlight fills |
| Blue tint | `--wj-blue-tint` | `#F6F8FF` | Large quiet fills, hover rows |
| Ink | `--wj-navy` | `#141A3C` | Headings and primary text |
| Body | `--wj-body` | `#3C4468` | Body copy |
| Muted | `--wj-muted` | `#5F678C` | Secondary metadata, ≥14px only |
| Hairline | `--wj-hairline` | `#E6E9F2` | Dividers, card outlines |
| Hairline strong | `--wj-hairline-strong` | `#D3D9EA` | Input borders, emphasized separation |
| Canvas | `--wj-canvas` | `#FFFFFF` | Page background |
| Surface soft | `--wj-surface-soft` | `#F6F7FB` | Grouped sections, map panel backdrop |
| Surface card | `--wj-surface` | `#FFFFFF` | Cards and sheets |
| Danger | `--wj-danger` | `#DC2626` | Destructive feedback only |
| Success | `--wj-success` | `#0F766E` | Positive status only |

Rules:

- The page canvas is **white**, not tinted. Grouping comes from `--wj-surface-soft` blocks and hairlines, not from a colored page background.
- Blue is a voltage, not a wash. On any given screen it should appear in a small number of deliberate places: the primary action, the selected state, and the single most important metric.
- Deep navy is text and icon color. It is never a large filled panel, never a map surface, never a section background.
- Editorial photography and company artwork may be colorful. Live text, labels, badges, and controls sit on solid surfaces, never on busy imagery.
- Status colors carry an icon or label; color alone never communicates state.

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
  --wj-danger: #dc2626;
  --wj-success: #0f766e;
  --wj-focus: rgba(69, 95, 246, 0.32);
}
```

Every color in `src/**` must be one of these tokens. Raw hex and `rgb()` literals outside the `:root` token block are contract violations.

## Typography

**Plus Jakarta Sans** is the only family, self-hosted as `woff2` under `public/assets/fonts/` in weights 400, 500, 600, and 700. No CDN or `@import` from Google Fonts; the prototype must render correctly offline apart from map tiles.

```css
--wj-font: 'Plus Jakarta Sans', 'Segoe UI', system-ui, -apple-system, sans-serif;
```

Weights stay modest. Airbnb trusts whitespace and photography over typographic muscle, so headings sit at 600 far more often than 700.

| Token | Size | Weight | Line height | Usage |
| --- | --- | --- | --- | --- |
| `--wj-type-display` | 32px | 700 | 1.15 | One per page at most |
| `--wj-type-h1` | 26px | 700 | 1.2 | Page title |
| `--wj-type-h2` | 22px | 600 | 1.25 | Section heading |
| `--wj-type-h3` | 18px | 600 | 1.3 | Card group heading |
| `--wj-type-title` | 16px | 600 | 1.35 | Card title, control label |
| `--wj-type-body` | 16px | 400 | 1.5 | Default body copy |
| `--wj-type-body-sm` | 14px | 400 | 1.45 | Dense rows, secondary copy |
| `--wj-type-caption` | 13px | 500 | 1.4 | Metadata, timestamps |
| `--wj-type-micro` | 12px | 600 | 1.3 | Badges and pills only |

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

- Direct interactions: 150–250ms. Entrances: 360–500ms. Stagger between siblings: 100–140ms.
- Ease-out for entrances and direct responses: `cubic-bezier(0.22, 1, 0.36, 1)`. Ease-in-out for elements already on screen: `cubic-bezier(0.77, 0, 0.175, 1)`.
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
- **The map is light.** Use a low-saturation light basemap (CARTO Positron or equivalent). A dark or navy map surface is forbidden.
- Markers are white pills with `--wj-radius-pill`, `--wj-shadow-sm`, an abstract company mark, and the match figure in navy. The selected marker inverts to blue fill with white text. Never use applicant portraits as markers.
- The bottom result rail holds several small horizontal cards reflecting the current map viewport, synchronized both ways with marker selection.
- Map controls, search, account thumbnail, result rail, and Wizy never overlap or clip at any supported width.

## Wizy

Wizy's character, proportions, badge, animation clips, and behavior are **locked and out of scope for visual refactors**. See `design-system/wizjobs/MASTER.md`. Only Wizy's surrounding chrome — chat panel surface, typography, and focus states — adopts the tokens in this file.

> Known contradiction to resolve before any Wizy work: this contract previously stated the body is the only chat toggle with no separate icon, while `src/components/WizyPet.jsx` and `src/styles.css` ship a separate `.wizzy-chat-icon` control. The implementation is currently the source of truth. Do not change either side without an explicit decision.

## Forbidden

- Any color outside the token table, including raw hex or `rgb()` literals in component styles
- Gradients of any kind, and large dark or navy filled panels
- A dark map basemap
- Type below 12px, a second font family, or synthesized weights
- Emoji as interface icons, or a second icon family
- `transition: all`, `ease-in` entrances, bounce, or `scale(0)`
- Invisible focus, sub-44px targets, or layout-shifting hover
- Applicant portraits as company or map markers

## Verification

Machine-checked by `node scripts/design-lint.mjs`, which must report zero violations:

- [ ] No color literals outside the `:root` token block
- [ ] No gradients
- [ ] Single font family, no font-size below 12px
- [ ] No `transition: all` and no `ease-in` entrance curves
- [ ] No declared interactive height or width below 44px

Verified by hand at 375, 768, 1024, and 1440px on every route:

- [ ] White canvas, generous section spacing, hairline separation
- [ ] Blue appears only on primary action, selection, and key emphasis
- [ ] Focus rings, pointer affordances, and accessible names present
- [ ] Reveals are calm, sequenced, and non-blocking; reduced motion removes movement without hiding content
- [ ] Map is light, viewport-linked, and uses company marks
- [ ] Applications card is blue with a white illustration
- [ ] Wizy is uncropped, canonical, and unobstructed
