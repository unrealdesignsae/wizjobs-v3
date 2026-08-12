#!/usr/bin/env node
// Enforces the machine-checkable rules in DESIGN.md across src/.
// Exits non-zero when any violation is found. See docs/design-lint.md.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SRC = join(ROOT, 'src');

const CONTRACT = join(ROOT, 'DESIGN.md');

const FONT_STACK = "'plus jakarta sans','segoe ui',system-ui,-apple-system,sans-serif";
const ALLOWED_FONT_VALUES = new Set(['var(--wj-font)', 'inherit', FONT_STACK]);
const MIN_FONT_PX = 12;
const MIN_TARGET_PX = 44;

const NAMED_COLORS = [
  'white', 'black', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
  'pink', 'gray', 'grey', 'silver', 'navy', 'teal', 'aqua', 'lime', 'maroon',
];

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const FUNC_COLOR = /\b(?:rgba?|hsla?)\s*\(/i;
const NAMED_COLOR = new RegExp(`(^|[\\s,(])(${NAMED_COLORS.join('|')})([\\s,)]|$)`, 'i');
// conic-gradient is allowed for data rendering (progress rings, gauges) per DESIGN.md.
const GRADIENT = /\b(?:linear|radial|repeating-linear|repeating-radial)-gradient\s*\(/i;
const EASE_IN = /\bease-in\b(?!-out)/i;
const PX_VALUE = /(-?\d*\.?\d+)px/g;

const DARK_TOKEN = /var\(\s*--wj-dark-[\w-]+/i;
const THEME_ROOT = /^html\[data-theme=['"]?dark['"]?\]$/i;

const TARGET_PROPS = new Set(['height', 'min-height', 'width', 'min-width']);
const INTERACTIVE_ELEMENTS = /^(?:button|a|input|select|textarea|summary)(?:[.:#[]|$)/i;
const INTERACTIVE_CLASS = /\b(?:btn|button|chip|pill|control|tab|toggle|switch|checkbox|radio|link)\b/i;

const violations = [];

function report(file, line, rule, message) {
  violations.push({ file, line, rule, message });
}

function normalizeValue(value) {
  const v = value.trim().toLowerCase().replace(/\s*,\s*/g, ',').replace(/\s+/g, ' ');
  const shortHex = v.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/);
  return shortHex ? `#${shortHex[1]}${shortHex[1]}${shortHex[2]}${shortHex[2]}${shortHex[3]}${shortHex[3]}` : v;
}

// DESIGN.md is the token registry. Every name it mentions is permitted, and
// every name it gives a value is pinned to that value. Without this, satisfying
// the color rule is as easy as inventing `--wj-canvas-grey: #eff2f4` and
// pointing the old background at it.
function readContractTokens() {
  const text = readFileSync(CONTRACT, 'utf8');
  const names = new Set((text.match(/--wj-[\w-]+/g) || []));
  const values = new Map();

  for (const row of text.split('\n')) {
    if (!row.trim().startsWith('|')) continue;
    const cells = row.split('|').slice(1, -1).map((c) => c.trim());
    const tokenIndex = cells.findIndex((c) => /^`--wj-[\w-]+`$/.test(c));
    if (tokenIndex === -1 || tokenIndex + 1 >= cells.length) continue;
    const token = cells[tokenIndex].replace(/`/g, '');
    const raw = cells[tokenIndex + 1].replace(/`/g, '').trim();
    if (!/^(#[0-9a-fA-F]{3,8}|rgba?\(|-?\d)/.test(raw)) continue;
    values.set(token, normalizeValue(raw));
  }

  return { names, values };
}

const CONTRACT_TOKENS = readContractTokens();

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

// A declaration is interactive-sized only when the *last* compound selector is
// itself a control, so `.card button svg { width: 14px }` is not a target-size
// violation while `.card button { height: 38px }` is.
function isInteractiveSelector(selector) {
  return selector.split(',').some((part) => {
    const last = part.trim().split(/[\s>+~]+/).filter(Boolean).pop() || '';
    if (INTERACTIVE_ELEMENTS.test(last)) return true;
    return INTERACTIVE_CLASS.test(last);
  });
}

function smallestPx(value) {
  const found = [...value.matchAll(PX_VALUE)].map((m) => Number.parseFloat(m[1]));
  const positive = found.filter((n) => n > 0);
  return positive.length ? Math.min(...positive) : null;
}

// Character scanner rather than a line regex: declarations in this codebase are
// frequently minified onto one line, and rules need their owning selector.
function parseCss(text) {
  const declarations = [];
  const stack = [];
  let buffer = '';
  let bufferLine = 1;
  let line = 1;
  let i = 0;

  const flush = () => {
    const raw = buffer.trim();
    buffer = '';
    if (!raw || !raw.includes(':')) return;
    const idx = raw.indexOf(':');
    declarations.push({
      prop: raw.slice(0, idx).trim().toLowerCase(),
      value: raw.slice(idx + 1).trim(),
      line: bufferLine,
      selector: stack.filter((s) => !s.startsWith('@')).join(' ') || stack.join(' '),
      atRules: stack.filter((s) => s.startsWith('@')),
    });
  };

  while (i < text.length) {
    const ch = text[i];

    if (ch === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      const stop = end === -1 ? text.length : end + 2;
      for (let k = i; k < stop; k += 1) if (text[k] === '\n') line += 1;
      i = stop;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = ch;
      let k = i + 1;
      while (k < text.length && text[k] !== quote) {
        if (text[k] === '\\') k += 1;
        if (text[k] === '\n') line += 1;
        k += 1;
      }
      buffer += text.slice(i, k + 1);
      i = k + 1;
      continue;
    }

    if (ch === '\n') {
      line += 1;
      buffer += ch;
      i += 1;
      continue;
    }

    if (ch === '{') {
      stack.push(buffer.trim());
      buffer = '';
      bufferLine = line;
      i += 1;
      continue;
    }

    if (ch === '}') {
      flush();
      stack.pop();
      bufferLine = line;
      i += 1;
      continue;
    }

    if (ch === ';') {
      flush();
      bufferLine = line;
      i += 1;
      continue;
    }

    if (!buffer.trim()) bufferLine = line;
    buffer += ch;
    i += 1;
  }

  return declarations;
}

function lintCss(file, text) {
  for (const decl of parseCss(text)) {
    const { prop, value, line, selector, atRules } = decl;
    const inFontFace = atRules.some((a) => a.toLowerCase().startsWith('@font-face'));
    const isRoot = /(^|[\s,>+~])?:root\b/.test(selector);
    const isThemeRoot = THEME_ROOT.test(selector.trim());
    const isTokenDefinition = prop.startsWith('--') && isRoot;

    if (prop.startsWith('--') && (isRoot || isThemeRoot)) {
      if (!CONTRACT_TOKENS.names.has(prop)) {
        report(file, line, 'token-unknown', `\`${prop}\` is not defined in DESIGN.md; add it to the contract or use an existing token`);
      } else if (isRoot && !value.includes('var(')) {
        const expected = CONTRACT_TOKENS.values.get(prop);
        if (expected && normalizeValue(value) !== expected) {
          report(file, line, 'token-value', `\`${prop}\` is ${normalizeValue(value)} but DESIGN.md pins it to ${expected}`);
        }
      }
    }

    if (GRADIENT.test(value)) {
      report(file, line, 'gradient', `\`${prop}\` uses a gradient; DESIGN.md forbids gradients`);
    }

    if (!isTokenDefinition && !inFontFace && prop !== 'unicode-range') {
      if (HEX.test(value) || FUNC_COLOR.test(value) || NAMED_COLOR.test(value)) {
        report(file, line, 'color-literal', `\`${prop}: ${value}\` uses a color literal outside the :root token block`);
      }
    }

    if (prop === 'font-family' && !inFontFace) {
      const normalized = value.toLowerCase().replace(/\s*,\s*/g, ',').replace(/\s+/g, ' ').trim();
      if (!ALLOWED_FONT_VALUES.has(normalized)) {
        report(file, line, 'font-family', `\`${value}\` is not the approved family; use var(--wj-font)`);
      }
    }

    if (prop === 'font-size') {
      const smallest = smallestPx(value);
      if (smallest !== null && smallest < MIN_FONT_PX) {
        report(file, line, 'font-size-min', `${smallest}px is below the ${MIN_FONT_PX}px floor`);
      }
    }

    if (prop.startsWith('transition') && /(^|[\s,])all([\s,]|$)/.test(value)) {
      report(file, line, 'transition-all', '`transition: all` is forbidden; name the properties');
    }

    if (EASE_IN.test(value)) {
      report(file, line, 'ease-in', '`ease-in` is not an approved curve; use the ease-out or ease-in-out token');
    }

    // The dark ramp is remapped once at the theme root; components read the
    // neutral tokens so a single edit reaches both themes.
    if (DARK_TOKEN.test(value) && !THEME_ROOT.test(selector.trim())) {
      report(file, line, 'dark-token', `\`${prop}\` reads a --wj-dark-* token outside the theme root; read the remapped token instead`);
    }

    if (TARGET_PROPS.has(prop) && isInteractiveSelector(selector)) {
      const smallest = smallestPx(value);
      if (smallest !== null && smallest < MIN_TARGET_PX) {
        report(file, line, 'target-size', `\`${selector}\` declares ${prop}: ${smallest}px, below the ${MIN_TARGET_PX}px target`);
      }
    }
  }
}

// JSX carries inline styles and occasional literal colors in SVG attributes.
function lintJsx(file, text) {
  text.split('\n').forEach((raw, index) => {
    const line = index + 1;
    const stripped = raw.replace(/\/\/.*$/, '');

    if (GRADIENT.test(stripped)) {
      report(file, line, 'gradient', 'gradient used in JSX; DESIGN.md forbids gradients');
    }
    if (HEX.test(stripped)) {
      report(file, line, 'color-literal', `color literal \`${stripped.match(HEX)[0]}\` in JSX; use a token`);
    }
    if (/\bfontFamily\s*:/.test(stripped)) {
      report(file, line, 'font-family', 'inline fontFamily in JSX; inherit the global family instead');
    }
    const inlineFontSize = stripped.match(/\bfontSize\s*:\s*['"]?(\d*\.?\d+)(px)?/);
    if (inlineFontSize && Number.parseFloat(inlineFontSize[1]) < MIN_FONT_PX) {
      report(file, line, 'font-size-min', `${inlineFontSize[1]}px inline font size is below the ${MIN_FONT_PX}px floor`);
    }
    if (/transition\s*:\s*['"]?\s*all\b/.test(stripped)) {
      report(file, line, 'transition-all', '`transition: all` in JSX is forbidden');
    }
  });
}

const files = walk(SRC).filter((f) => /\.(css|jsx|js)$/.test(f));

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file).split(sep).join('/');
  if (file.endsWith('.css')) lintCss(rel, text);
  else lintJsx(rel, text);
}

violations.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1));

let currentFile = '';
for (const v of violations) {
  if (v.file !== currentFile) {
    currentFile = v.file;
    console.log(`\n${currentFile}`);
  }
  console.log(`  ${String(v.line).padStart(5)}  ${v.rule.padEnd(15)} ${v.message}`);
}

const byRule = violations.reduce((acc, v) => {
  acc[v.rule] = (acc[v.rule] || 0) + 1;
  return acc;
}, {});

console.log('\n--- design-lint summary ---');
console.log(`files scanned: ${files.length}`);
for (const rule of Object.keys(byRule).sort()) {
  console.log(`${rule.padEnd(16)} ${byRule[rule]}`);
}
console.log(`total violations: ${violations.length}`);

if (violations.length > 0) process.exit(1);
console.log('DESIGN.md contract satisfied.');
