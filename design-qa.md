# WizJobs Replica — Design QA

## Reference

- Live source: `https://development.d2kltjjdtvx90q.amplifyapp.com`
- Reference screenshot: `/workspace/scratch/0d9d7276e3a2/upload/318c146a-a81d-4209-9376-1e97740c2fd5.png`
- Implementation: local Product Design preview in the Cloud Browser

## Visual comparison

The authenticated desktop dashboard was compared at the same browser viewport and state. The implementation reproduces the source hierarchy, primary blue header, pale gray application background, centered navigation, profile card proportions, circular avatar, insight cards and rings, tab treatment, filter placement, empty-job illustration, card radii, shadows, type scale, and spacing. Exact source assets were localized for the avatar, brand marks, flag, profile gauge, stepper icons, and empty-job illustration.

## Responsive and motion checks

- Desktop navigation, language menu, account menu, job tabs, filter expansion, country selection, chip toggles, and loading skeletons are functional.
- Profile stepper stages, collapse/expand transition, skills expansion, assessment modal, certificate modal, and skills manager are functional.
- Analytics loading transition, analytics tabs, settings loading state, accordions, toggles, and account routes are functional.
- Login, sign-up, forgotten-password, logout, and local CV-preview states are implemented.
- Mobile CSS switches the desktop navigation to the source-style full-screen blue drawer and stacks dashboard, analytics, settings, modal, and login layouts without horizontal overflow.
- Motion respects `prefers-reduced-motion`.

## Technical validation

- Production build: passed (`npm run build`)
- Console: no application runtime errors observed; Chrome extension metadata errors are external to the prototype.
- Routes verified: `/jobs-dashboard/`, `/profile-summary/`, `/analytics/`, `/profile-settings/`
- Core modal and filter interactions verified in the Cloud Browser.

## Notes

This is a frontend-only visual prototype. Potentially destructive live actions such as creating a real skill-assessment attempt were intentionally simulated locally.

final result: passed
