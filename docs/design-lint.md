# design-lint

`scripts/design-lint.mjs` enforces the machine-checkable half of [`DESIGN.md`](../DESIGN.md) across `src/`. It exists so "the design contract is met" is a fact the build can prove rather than a claim someone makes.

```bash
node scripts/design-lint.mjs
```

It prints `file:line rule message` for every violation, a per-rule summary, and exits non-zero when the count is above zero.

## Rules

| Rule | Fails when | Fix |
| --- | --- | --- |
| `color-literal` | A hex, `rgb()`, `hsl()`, or named color appears anywhere outside a custom-property definition inside a `:root` block, or anywhere in JSX | Replace with the matching `--wj-*` token |
| `gradient` | `linear-gradient`, `radial-gradient`, or a repeating form is used | Use a flat token surface. `conic-gradient` is exempt because it renders data, not decoration |
| `font-family` | A `font-family` value other than `var(--wj-font)`, `var(--font-sans)`, or `inherit` | Use `var(--wj-font)`. Only `@font-face` may name the family literally |
| `font-size-min` | Any `px` font size below 12 | Move up to the nearest step in the DESIGN.md type scale |
| `transition-all` | `transition` shorthand or longhand containing `all` | Name the transitioned properties |
| `ease-in` | `ease-in` appears as a timing function (`ease-in-out` is fine) | Use the ease-out curve for entrances |
| `target-size` | An interactive selector declares `height`, `min-height`, `width`, or `min-width` below 44px | Grow the control, or grow its padding and the declared box with it |

## How the CSS is read

The stylesheets in this project are largely minified onto single lines, so the linter runs a character scanner rather than matching per line. It tracks brace depth to attach every declaration to its owning selector and at-rule, skips comments and string bodies, and records the line where each declaration began.

Two consequences worth knowing:

**Token definitions are scoped.** `--av2-blue: #455ff6` inside `.av2-page` is a violation while the same declaration inside `:root` is not. Component-local color variables are how palette drift starts, so they are treated as drift.

**Target size is judged by the last compound selector.** `.card button svg { width: 14px }` passes because the sized element is the icon; `.card button { height: 38px }` fails because the sized element is the control. Without this, every icon inside every button would be reported.

## Known limitation

The `target-size` rule reads declared dimensions and cannot see padding or the resulting hit area. A checkbox drawn at 18px with a 44px label target will still be reported. Treat that report as a prompt to verify the hit area and, if it is genuinely fine, raise it — do not weaken the rule.

## Changing the rules

Don't, as part of satisfying them. The value of this script is that it was written before the migration it grades. If a rule is genuinely wrong, change it in a separate commit that explains why, and update `DESIGN.md` in the same commit so the two never disagree.
