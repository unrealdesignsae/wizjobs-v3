# Design migration status

Working state for the Airbnb-principles design pass on WizJobs v3. Written so the work can resume cold, without the conversation that produced it.

Last updated 2026-08-12, at commit `4e42d9e` on branch `design/airbnb-contract`.

## Compact status

| Done | Remaining |
| --- | --- |
| DESIGN.md + dark-as-derived-theme | Colour migrate: home, profile, analytics, styles |
| Plus Jakarta Sans | Gradients (8), type floor (234), targets (99) |
| design-lint + token registry pinned to DESIGN.md | Hand QA at 4 widths × 2 themes |
| Dead WizyCoach removed | |
| Token foundation (`:root` consolidated) | |
| Colour map + dual-model fix pass | Second map review in flight, then apply |
| `hub-v2-polish.css` colour literals cleared | |

Lint baseline now: **1485** (color 944, dark-token 200, font-size 234, target 99, gradient 8).

## Orchestration note

Judgement (literal→token) stays with the lead agent. Cheaper models only: (a) audit `scripts/token-map.json`, (b) apply an already-approved map via `node scripts/apply-token-map.mjs <file>`. Never let a cheap model invent tokens or edit the linter.

Dark overrides for `.home-v2-*` / etc. live in `styles.css` — file agents must not delete “their” dark rules from that shared file. Dark cleanup is the final `styles.css` pass only.

## Baseline

| File | Total | Breakdown |
| --- | --- | --- |
| `src/styles.css` | 1262 | color-literal 769, dark-token 200, font-size-min 169, target-size 90, token-unknown 21, gradient 8, token-value 5 |
| `src/analytics-v2.css` | 109 | color-literal 74, font-size-min 34, target-size 1 |
| `src/profile-summary-v2.css` | 73 | color-literal 64, font-size-min 9 |
| `src/home-v2.css` | 59 | color-literal 40, font-size-min 17, target-size 2 |
| `src/hub-v2-polish.css` | 27 | color-literal 16, font-size-min 5, target-size 6 |

Regenerate with `node scripts/design-lint.mjs`.

## Order of work

An earlier plan ran one lint rule at a time across all files, starting with `dark-token`. **That order does not work.** A dark override such as

```css
.hub-tour-card { background: #fff }
html[data-theme='dark'] .hub-tour-card { background: #121d38 }
```

can only lose its second rule once the first reads `var(--wj-surface)`. Deleting dark overrides before the light side is tokenized simply breaks dark mode. `color-literal` and `dark-token` are one job, done per component.

The workable sequence:

1. ~~**Token foundation.**~~ **Done.** One canonical `:root` registry matching `DESIGN.md`, replacing three competing blocks that redefined `--wj-blue`, `--wj-text`, `--wj-muted`, `--wj-border` and `--wj-white` with different values. Legacy names renamed onto the registry across all files. `token-unknown` and `token-value` are zero.

   **The `html[data-theme='dark']` remap block lands last, not here.** Adding it before components read tokens breaks dark mode outright: tokenized and un-tokenized rules disagree, and text renders dark-on-dark. Verified by doing it and watching the dashboard go blank. Dark mode is still driven by the component-level overrides at the bottom of `styles.css` until step 2 finishes, at which point the remap replaces them. The block is commented in place in `src/styles.css` where it belongs.
2. **Per-stylesheet colour migration** via `scripts/token-map.json` + `scripts/apply-token-map.mjs`.
   - ~~`hub-v2-polish.css`~~ **Done** — colour literals cleared (16). Remaining hits there are type/target only.
   - Dual-model audit of the first map found three systemic classifier bugs (saturated blues stolen by hairline bands; soft blue alphas mapped to focus; `--wj-surface-soft` never targeted). Fixed and re-pinned. **Do not bulk-apply the remaining files until a second review of the corrected map passes.**
   - Still todo: `home-v2.css`, `profile-summary-v2.css`, `analytics-v2.css`, then `styles.css` + dark remap swap.
3. **Gradients** (8). Mostly skeleton shimmers, which become an opacity pulse. `conic-gradient` is exempt; it draws the profile gauge.
4. **Type scale** (234). Everything below 12px moves up to the nearest step in the contract's scale. These are real: 9px labels ship today.
5. **Target size** (99). Grow controls, or grow padding and the declared box together.

## Constraints for whoever does this

- Do not edit `scripts/design-lint.mjs` or `DESIGN.md` to make a rule pass. If a rule is genuinely wrong, change it in its own commit that says why, and update both files together.
- No ignore comments, allowlists, or exemptions.
- Do not delete, hide, or disable UI to clear a violation.
- Do not touch `src/components/WizyPet.jsx` or Wizy's character, proportions, badge, or animation clips. Wizy's surrounding chrome may adopt tokens.
- Check both themes. Dark mode is not assumed to pass because the text is pale.
- Reaching zero violations is not the same as reaching the design. The contract's white canvas and blue-as-voltage rules are judgement calls made *during* step 2; a tokenized version of the current grey-and-blue design would satisfy the linter and miss the point.

## Known friction

`target-size` reads declared dimensions and cannot see padding, so a checkbox drawn at 18px with a 44px label target still gets reported. Confirm the hit area, then raise the declared box. Do not relax the rule.

## Open question

The vault (`D:\UNREAL\BRAIN\Projects\Wizjobs\README.md`) lists `D:\UNREAL\CODE\Wizjobs-v4\` as the active codebase and this repo as legacy v3. This work targets v3. Confirm that is intended before investing the remaining effort, or port `DESIGN.md` and the linter to v4 first — both are portable, the 1,530 violations are not.
