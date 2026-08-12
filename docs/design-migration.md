# Design migration status

Working state for the Airbnb-principles design pass on WizJobs v3. Written so the work can resume cold, without the conversation that produced it.

Last updated 2026-08-12, at commit `7520e6b`.

## Where this stands

`DESIGN.md` is the authoritative contract and it is finished. `scripts/design-lint.mjs` enforces the machine-checkable half of it and currently reports **1,530 violations**. The migration that clears them has not started.

Build passes, `npm run test:sites` is 4/4, and the working tree is clean.

### Done

- **`DESIGN.md` rewritten** around unity, content-led surfaces, restraint, and conversational geometry, expressed entirely in the three brand colors. Light is canonical; dark is a derived ramp.
- **Plus Jakarta Sans replaces Roboto.** Vendored as a variable font in two subsets under `public/assets/fonts/`, 48KB total against Roboto's 100KB, self-hosted with no CDN. One `--wj-font` token, verified rendering in the browser.
- **`scripts/design-lint.mjs` written**, deliberately before the migration it grades, plus `docs/design-lint.md`.
- **Token registry pinned to `DESIGN.md`.** The lint reads the contract's token tables, so only names it mentions may exist at `:root` and values it pins cannot drift.
- **Dead duplicate Wizy deleted.** `WizyCoach` in `App.jsx` was a second complete Wizy that was never rendered; it and its orphaned `.wizzy-chat-icon` CSS are gone.

### Verified against the running app, not inferred

- The map already loads CARTO `light_all` and correctly stays light when the theme flips to dark. The contract's map requirement is essentially already met.
- `.company-map-marker` is already a white circle with navy match figures and company glyphs, not portraits. Its only gap is sitting at 38px against the 44px target.
- The shipping `WizyPet` uses the character body as its only chat toggle, which is what `DESIGN.md` always said. The apparent contradiction came entirely from the dead component above.

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

1. **Token foundation.** Correct the `:root` block to match `DESIGN.md` exactly — fix the duplicated `--wj-muted`, set `--wj-surface` to white, add the missing tokens, name the dark ramp as the contract does — and add the single `html[data-theme='dark']` remap block. Clears `token-unknown` and `token-value`. Nothing is deleted yet.
2. **Per-stylesheet colour migration.** For each file, point light rules at tokens and delete the dark override that becomes redundant. Clears `color-literal` and `dark-token` together. Start with `hub-v2-polish.css` (27) to establish the pattern, then `home-v2.css`, `profile-summary-v2.css`, `analytics-v2.css`, and `styles.css` last.
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
