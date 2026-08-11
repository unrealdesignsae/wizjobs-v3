# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

WizJobs serves job seekers, especially creative-technology professionals, who want to discover suitable opportunities, understand why a role matches, track applications, communicate with recruiters, and prepare for hiring conversations in one place.

## Product Purpose

WizJobs turns a candidate profile into a guided job-search workspace. Success means a job seeker can quickly find a relevant Dubai opportunity, understand its fit, save or apply to it, follow its application state, and continue the recruiter conversation without losing context.

## Positioning

The product combines map-based local discovery, explainable daily matches, an application workspace, recruiter messaging, and the Wizy job-search companion in one candidate-first flow.

## Operating Context

The prototype uses realistic mock jobs around Dubai, company logos, workplace photography, candidate application states, recruiter conversations, saved-role collections, and Wizy coaching. It is a frontend prototype whose visible interactions must behave realistically while remaining clearly labeled when data or AI behavior is illustrative.

## Capabilities and Constraints

- Preserve the existing React/Vite implementation and Sites-compatible build files.
- The Hub contains Explore, Daily Matches, Applications, Messages, Saved, Job Detail, and Job Alerts experiences.
- The Dubai map supports pan, zoom, selection, and viewport-aware result cards.
- Core actions and navigation must work with realistic mock state; prototype-only AI features must be labeled honestly.
- The interface must be responsive at 375px, 768px, 1024px, and 1440px and support keyboard focus and reduced motion.

## Brand Commitments

- Product name: WizJobs. Companion name: Wizy.
- Official interface blue: `#455FF6`; use white and pale-blue surfaces with deep navy text.
- Use the bundled Roboto family and Lucide outline icons.
- Do not use decorative gradients, black interface panels, or dark map themes.
- Wizy preserves the approved canonical character, circular side caps, readable asymmetric white W badge, calm pose-to-pose motion, and click-to-chat behavior without a separate chat icon.
- The W badge source of truth is `C:\Users\USER\AppData\Local\Temp\codex-clipboard-5108484d-cd8b-4948-ae7b-ef4ebdcbc415.png`.

## Evidence on Hand

- Current application and routes under `src/`.
- Hub reference screenshots supplied throughout the Codex task.
- Twelve unique job photographs under `public/assets/hub-jobs/`.
- Recruiter portraits under `public/assets/hub-people/`.
- Company marks under `public/assets/job-people/`.
- Wizy animation frames under `public/assets/wizy-v2/`.
- Hub illustrations under `public/assets/hub-art/`.

## Product Principles

- Keep the experience candidate-first and action-oriented.
- Make matching logic and next steps understandable within seconds.
- Use playful media and purposeful motion without slowing routine work.
- Preserve continuity between map results, job details, applications, messages, and saved roles.
- Treat responsive, accessible, and visually verified behavior as part of the product, not final polish.

## Accessibility & Inclusion

Core controls require visible keyboard focus, meaningful accessible names, at least 44px touch targets, sufficient contrast, logical reading order, and an intentional `prefers-reduced-motion` path. The first-run tour is optional, keyboard operable, dismissible, and replayable.
