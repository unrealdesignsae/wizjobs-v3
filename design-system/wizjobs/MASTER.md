# WizJobs Design System Master

This file is the durable visual and interaction contract for the prototype. A page-specific file in `design-system/pages/` may refine layout details, but it must not override the brand, accessibility, motion, map, or Wizy rules below.

## Foundations

### Color

| Role | Value | Usage |
| --- | --- | --- |
| WizJobs blue | `#455FF6` | Primary actions, selected states, links, focus, key illustration fields |
| White | `#FFFFFF` | Main surfaces, text/icons on blue |
| Pale blue | `#EEF1FF` | Soft selected states and secondary surfaces |
| App background | `#F4F6FB` | Page canvas |
| Light border | `#DCE3F4` | Dividers and component outlines |
| Deep navy | `#141A3C` | Primary text only; never a large panel or map fill |
| Muted text | `#667099` | Secondary copy with accessible contrast |
| Destructive | `#DC2626` | Destructive feedback only |

- Use one flat visual system: blue, white, pale-blue neutrals, and deep navy text.
- Do not use decorative gradients. Do not introduce green, purple, orange, or dark navy panels as alternate themes.
- Colorful editorial artwork is allowed inside job/company thumbnails and card media. Keep live text outside busy artwork.
- Shadows are restrained cobalt/navy transparencies used for hierarchy, never decoration.

Recommended variables:

```css
:root {
  --wj-blue: #455ff6;
  --wj-blue-soft: #eef1ff;
  --wj-canvas: #f4f6fb;
  --wj-surface: #ffffff;
  --wj-navy: #141a3c;
  --wj-muted: #667099;
  --wj-border: #dce3f4;
  --wj-focus: rgba(69, 95, 246, 0.32);
  --wj-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --wj-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
}
```

### Typography and icons

- Use the bundled `Roboto` family for all headings, body copy, controls, labels, and map UI: `Roboto, Arial, sans-serif`.
- Keep sizes and line heights explicit. Preserve clear hierarchy and antialiasing.
- Use `lucide-react` outline icons. Do not use emoji or mix icon families.
- Icons inherit the surrounding text color and must have an accessible label when their button has no visible label.

### Shape, spacing, and density

- Use a 4px base rhythm: 4, 8, 12, 16, 24, 32, 48, and 64px.
- Prefer rounded rectangular controls and cards; keep related radii consistent within a component family.
- Preserve the Explore page's asymmetric varied-size card composition and gently curved white/blue split into the map.
- Prevent labels, badges, headings, and metadata from colliding or clipping at 375, 768, 1024, and 1440px.

## Interaction contract

### Touch and pointer

- Interactive targets must be at least 44 by 44px wherever space permits; never shrink the effective hit area below 44px on touch layouts.
- Add `cursor: pointer` to clickable controls.
- Gate decorative hover movement behind `@media (hover: hover) and (pointer: fine)`.
- Press feedback may use `transform: scale(0.97)` for 100–160ms. Do not animate from `scale(0)` and do not cause layout shift.

### Focus

Every keyboard-operable control needs a visible cobalt focus ring:

```css
:where(button, a, input, textarea, select):focus-visible {
  outline: 3px solid rgba(69, 95, 246, 0.32);
  outline-offset: 2px;
}
```

Never remove focus indication unless it is replaced with an equally visible treatment. Text contrast must meet WCAG AA.

### Motion

- Motion is calm, brief, purposeful, and non-blocking. Most direct interactions use 150–250ms.
- Animate only `transform` and `opacity` for entrances. Specify transitioned properties; never use `transition: all`.
- Use `--wj-ease-out` for entrances and direct responses, and `--wj-ease-in-out` for movement already on screen. Avoid `ease-in` and conspicuous bounce/overshoot.
- Cards reveal as a readable sequence: fade from 0 with `translateY(10–14px)`, settle over roughly 500–620ms, and stagger siblings by about 100–140ms. Keep every card interactive during the reveal.
- Sequence Explore in spatial order: intro/summary, left discovery cards, then the map, then its controls, markers, and bottom result rail. The map reveal is a gentle fade/translate, not a dark flash or zoom spectacle.
- Rapidly repeated state changes use interruptible transitions. Calm page entrances may use one-shot keyframes.
- Under `prefers-reduced-motion: reduce`, remove transforms, stagger, parallax, pan theatrics, and looping decorative motion; retain short opacity/color feedback where useful.

Reference reduced-motion rule:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
  }

  .sequenced-reveal {
    animation: none !important;
    transform: none !important;
  }
}
```

## Components

### Buttons and inputs

- Primary: blue fill, white text/icon.
- Secondary: white or pale-blue fill, blue text/icon, light-blue border where separation is needed.
- Inputs use white surfaces, deep navy text, light borders, and the shared focus ring.
- Disabled states must remain legible and must not rely on color alone.

### Cards

- Standard cards are white or pale blue with deep navy text and cobalt accents.
- The Applications summary card is a solid `#455FF6` field with white type and a minimal white illustration; it must not become a white card or use a white image field.
- Editorial media may be colorful, but text and controls remain on clean solid surfaces.

### Opportunity Hub and map

- The job-seeker Opportunity Hub stays under Jobs beside Analytics and preserves Explore, Applications, Messages, and Saved.
- Use job-seeker language and mock job data; do not introduce employer applicant-management framing.
- The Explore map is an interactive, light blue/white Dubai discovery surface. Never use a black or dark navy map panel.
- Use abstract company logos for map markers and bottom result cards, not applicant portraits.
- Results update with the visible map viewport. Map pan/zoom is eased and restrained, and respects reduced motion.
- Keep search, location, utility controls, markers, and the result rail readable above the map at every supported viewport.

## Wizy companion lock

- Official name: **Wizy** (one z). Keep the companion reusable and isolated.
- Preserve one canonical character model across every frame: stable proportions, scale, baseline, circular side caps, rounded asymmetric WizJobs W badge, and generous sprite padding so nothing is cropped.
- The forehead mark is the correctly oriented, readable asymmetric white W from the approved logo reference; never substitute, mirror, or redraw it loosely.
- Wizy must be large and clearly visible, not a tiny floating icon. On mobile, Wizy may scale down but remains easy to see and tap.
- Clicking Wizy's body is the single open/close control for chat and triggers a calm non-idle pose. Do not add a separate chat/message icon beside Wizy.
- Preserve real pose-to-pose animation. Approved families are calm idle, thoughtful cool-cyan/cobalt lightbulb, left-facing computer/job search, and job-match discovery.
- Motion is slow and settled with eased transitions and generous still pauses; do not rapidly cycle poses.
- Chat-related gaze, props, and gestures face screen-left toward the chat panel. Allowed symbols stay attached to the action and must not jitter.
- Lightbulb effects use cool cyan/cobalt only—never yellow or warm glow.
- Mobile chat stays hidden until Wizy is tapped, then appears viewport-safe above a smaller but clearly visible Wizy.
- Reduced motion freezes Wizy on a stable representative frame while preserving the body control.

## Forbidden patterns

- Decorative gradients or large dark panels
- Generic/mirrored W marks or pointed-ear substitutions for Wizy's circular caps
- Tiny, cropped, jittering, or static-tilt-only Wizy presentation
- Warm lightbulb glow or a separate chat icon
- Applicant portraits used as company/map markers
- `transition: all`, `ease-in`, large bouncy overshoot, long blocking staggers, or `scale(0)` entrances
- Invisible focus, sub-44px touch controls, hidden filters, or layout-shifting hover effects

## Verification checklist

- [ ] Blue `#455FF6`, white/pale-blue neutrals, and deep navy text are used consistently
- [ ] No decorative gradients or dark map/panel surfaces
- [ ] Bundled Roboto and Lucide outline icons are used throughout
- [ ] Focus states, pointer affordances, labels, and 44px touch targets are present
- [ ] Card and map reveals are sequenced, calm, non-blocking, and visible on first entry
- [ ] Reduced motion removes movement and stagger without hiding content
- [ ] Applications card is blue with a minimal white illustration
- [ ] Map is light, interactive, viewport-linked, and uses company marks
- [ ] Wizy is large, uncropped, canonical, screen-left-facing for chat actions, and controlled by body tap
- [ ] Layout is visually checked at 375, 768, 1024, and 1440px
