# WizJobs Product Design Contract

WizJobs is a friendly, precise job-seeker product built from one flat visual language. This file summarizes the durable product decisions; detailed tokens and component rules live in `design-system/wizjobs/MASTER.md`.

## Visual direction

The interface uses WizJobs blue `#455FF6`, white and pale-blue neutrals, and deep navy text. Roboto is the only type family and Lucide outline icons are the only interface icon set. Surfaces are clean and flat, with restrained blue-tinted elevation where hierarchy requires it. Decorative gradients and dark/black panels are out of scope.

Colorful generated editorial imagery is welcome inside job and company thumbnails, but live text, labels, badges, and controls stay on uncluttered solid surfaces.

## Opportunity Hub

The job-seeker Opportunity Hub lives under Jobs beside Analytics. Its four internal destinations—Explore, Applications, Messages, and Saved—remain available and keep job-seeker framing.

Explore uses asymmetric varied-size cards on the left, a gently curved transition, and a light interactive Dubai map on the right. Map markers and result cards represent companies with abstract logos, never applicant portraits. Visible results respond to the map viewport. Search, controls, markers, and the result rail remain legible and collision-free at all supported widths.

The Applications summary card is a solid blue tile with white type and a minimal white illustration. The illustration belongs directly on the blue field; it is not a white card or white image panel.

## Interaction and accessibility

Touch targets are at least 44px, clickable elements expose a pointer cursor, and keyboard focus uses a visible three-pixel translucent cobalt ring with a two-pixel offset. All icon-only controls have accessible names, text contrast meets WCAG AA, and hover-only movement is limited to fine pointers.

Motion should explain hierarchy and state without delaying work. Direct interactions take 150–250ms. Entrances use opacity and a small upward settle with a strong ease-out curve. Sibling cards reveal in a calm sequence, followed by the map and then its interactive layers; the content remains usable during the animation. Avoid `transition: all`, `ease-in`, large bounce, layout animation, and entrances from `scale(0)`.

Reduced-motion mode removes transforms, stagger, looping motion, and map theatrics while keeping content visible and preserving brief opacity or color feedback where it aids comprehension.

## Wizy

Wizy is the reusable job-search companion and must read as a character, not a tiny floating utility icon. Preserve the canonical scale, proportions, baseline, circular side caps, asymmetric white W badge, and generous sprite padding in every frame.

Wizy's body is the only chat toggle. Body activation opens or closes the viewport-safe chat and triggers a calm non-idle pose; there is no separate message icon. Chat gaze and job-search props face screen-left toward the panel.

The animation library comprises calm idle, a cool cyan/cobalt thoughtful lightbulb, left-facing computer/job search, and job-match discovery. These are real pose-to-pose sequences with slow settled motion and generous still pauses. Never use rapid pose cycling, yellow/warm glow, jittering attachments, pointed ears, a mirrored/generic W, or cropped effects. Reduced-motion mode shows a stable representative frame without disabling the control.

## Responsive QA

Visually verify 375px, 768px, 1024px, and 1440px. At each width confirm that navigation remains reachable, text and metadata do not overlap, the map and its result rail remain usable, Wizy stays visible without covering core actions, and mobile chat opens safely above Wizy.
