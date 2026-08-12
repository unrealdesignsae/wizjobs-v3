# Design migration status

Working state for the Airbnb-principles design pass on WizJobs v3 (`D:\UNREAL\CODE\Wizjobs`), branch `design/airbnb-contract`.

Last updated 2026-08-12 — **lint contract satisfied** (`node scripts/design-lint.mjs` → 0).

## Goal

Ship the DESIGN.md contract in this repo: white canvas, three brand colours, Plus Jakarta Sans, dark as a derived remap, machine-enforced by `scripts/design-lint.mjs`. Zero lint is necessary but not sufficient — white canvas / blue-as-voltage remain judgement during hand QA.

## Done

| Area | Notes |
| --- | --- |
| DESIGN.md | Airbnb principles; dark derived ramp; `--wj-blue-fg` for AA blue text |
| Font | Plus Jakarta Sans vendored; Roboto gone |
| Lint + tokens | `:root` registry pinned to DESIGN.md; do not weaken the linter |
| Dead code | WizyCoach removed; live Wizy is `WizyPet` |
| Colour | Map + apply on hub / home / profile / analytics / styles; leftovers → `color-mix` against tokens (`scripts/clear-color-literals.mjs`) |
| Dark theme | Root remap live; components read neutrals / `--wj-blue-fg`, not `--wj-dark-*` |
| Gradients | Decorative linear/radial cleared (shimmer → opacity pulse; login/hub/map solids). `conic-gradient` gauges kept |
| Type floor | All `font-size` ≥12px |
| Target size | Interactive controls ≥44px declared box |

### Apply lessons (keep)

- No wholesale replace of compound / `0 0 0` focus rings
- Never wholesale `filter` → `--wj-shadow-*` (restore `drop-shadow(...)`)
- Soft brand alphas as rings → `--wj-focus`; elevation → `--wj-shadow-*`
- Hover borders: `bg` must be `--wj-blue` (apply uses `bg` for `border-color`)
- Build/audit `:root` strip must be brace-balanced (`:root\s*\{[^{}]*\}`), not `[\s\S]*?\n}`
- Glass / soft alphas: use `color-mix(in srgb, var(--wj-…) N%, transparent)` — do not reintroduce `rgba()` / hex

## Lint

```
files scanned: 12
total violations: 0
DESIGN.md contract satisfied.
```

Regenerate: `node scripts/design-lint.mjs`

## Remaining (post-lint)

1. **Hand QA** — 375 / 768 / 1024 / 1440 × light + dark. Especially hub navbar, map, login, Wizy chrome.
2. **Optional prune** — more redundant `html[data-theme=dark]` color overrides once light+dark QA passes.

## Not in this goal

- Graduating v4 / new v5 repo
- Backend / real auth
- Changing WizyPet character art

## Commands

```bash
node scripts/design-lint.mjs
npm run build && npm run test:sites
```

## Constraints

- Do not edit `design-lint.mjs` or `DESIGN.md` just to pass a rule
- No ignore comments / allowlists
- Do not delete UI to clear violations
- Do not touch `src/components/WizyPet.jsx` character
