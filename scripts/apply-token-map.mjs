#!/usr/bin/env node
// Applies scripts/token-map.json to the stylesheets, choosing the foreground or
// background target from the property the literal appears in.
//
//   node scripts/apply-token-map.mjs --dry src/hub-v2-polish.css
//   node scripts/apply-token-map.mjs src/hub-v2-polish.css
//
// With no file arguments it processes every stylesheet in src/.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const MAP = JSON.parse(readFileSync('scripts/token-map.json', 'utf8'));

const FOREGROUND_PROPS = new Set([
  'color', 'fill', 'stroke', 'accent-color', 'caret-color',
  'text-decoration-color', '-webkit-text-fill-color', 'column-rule-color',
]);

// Shadow tokens carry their own offsets and blur, so a shadow declaration is
// replaced wholesale rather than having its colour swapped in place.
const SHADOW_PROPS = new Set(['box-shadow', '-webkit-box-shadow', 'filter', 'text-shadow']);
const SHADOW_TOKENS = new Set(['--wj-shadow-sm', '--wj-shadow-md', '--wj-shadow-lg']);

const COLOR = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g;

function normalize(literal) {
  let v = literal.toLowerCase().replace(/\s+/g, '');
  const short = v.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/);
  if (short) v = `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
  return v;
}

// Splits a stylesheet into declarations while tracking the owning selector, so
// `:root` token definitions and @font-face blocks can be left untouched.
function transform(text, stats) {
  let out = '';
  let buffer = '';
  const stack = [];
  let i = 0;

  const inProtectedBlock = () => stack.some((s) => /:root|@font-face|@keyframes/i.test(s));

  const flushDeclaration = (terminator) => {
    const raw = buffer;
    buffer = '';
    const idx = raw.indexOf(':');
    if (idx === -1 || inProtectedBlock()) {
      out += raw + terminator;
      return;
    }

    const prop = raw.slice(0, idx).trim().toLowerCase();
    const value = raw.slice(idx + 1);
    if (prop.startsWith('--') || !COLOR.test(value)) {
      COLOR.lastIndex = 0;
      out += raw + terminator;
      return;
    }
    COLOR.lastIndex = 0;

    const isForeground = FOREGROUND_PROPS.has(prop);
    const isShadow = SHADOW_PROPS.has(prop);
    const colorCount = (value.match(COLOR) || []).length;
    COLOR.lastIndex = 0;
    // Wholesale shadow replacement is only safe for a single-layer elevation.
    // Compound shadows and focus rings (0 0 0 Npx) must keep their structure.
    // `filter` must stay drop-shadow(...); shadow tokens are box-shadow values.
    const canWholesaleShadow = isShadow
      && prop !== 'filter'
      && colorCount === 1
      && !/\)\s*,/.test(value)
      && !/\b0\s+0\s+0\b/.test(value);

    let replacedWholesale = false;
    const next = value.replace(COLOR, (literal) => {
      const entry = MAP[normalize(literal)];
      if (!entry) {
        stats.unmapped.set(normalize(literal), (stats.unmapped.get(normalize(literal)) || 0) + 1);
        return literal;
      }
      const token = isForeground ? entry.fg : entry.bg;
      if (!token) return literal;

      if (isShadow && SHADOW_TOKENS.has(token)) {
        if (canWholesaleShadow) {
          replacedWholesale = true;
          return `@@${token}@@`;
        }
        stats.skipped.push(`${prop}: ${literal} (compound/ring shadow)`);
        return literal;
      }
      if (SHADOW_TOKENS.has(token)) {
        stats.skipped.push(`${prop}: ${literal}`);
        return literal;
      }

      stats.applied += 1;
      return `var(${token})`;
    });

    if (replacedWholesale) {
      const token = next.match(/@@(--wj-shadow-\w+)@@/)[1];
      stats.applied += 1;
      out += `${prop}:var(${token})${terminator}`;
      return;
    }

    out += raw.slice(0, idx) + ':' + next + terminator;
  };

  while (i < text.length) {
    const ch = text[i];

    if (ch === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      const stop = end === -1 ? text.length : end + 2;
      buffer += text.slice(i, stop);
      i = stop;
      continue;
    }

    if (ch === '{') {
      stack.push(buffer.trim());
      out += buffer + ch;
      buffer = '';
      i += 1;
      continue;
    }

    if (ch === '}') {
      if (buffer.trim()) flushDeclaration('');
      else out += buffer;
      buffer = '';
      stack.pop();
      out += ch;
      i += 1;
      continue;
    }

    if (ch === ';') {
      flushDeclaration(';');
      i += 1;
      continue;
    }

    buffer += ch;
    i += 1;
  }

  return out + buffer;
}

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) out.push(...walk(f));
    else if (f.endsWith('.css')) out.push(f);
  }
  return out;
}

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const targets = args.filter((a) => !a.startsWith('--'));
const files = targets.length ? targets : walk('src');

let totalApplied = 0;
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const stats = { applied: 0, skipped: [], unmapped: new Map() };
  const next = transform(text, stats);

  if (!dry && next !== text) writeFileSync(file, next);
  totalApplied += stats.applied;

  console.log(`${file}: ${stats.applied} replaced${dry ? ' (dry run)' : ''}`);
  if (stats.skipped.length) {
    console.log(`  needs a human (${stats.skipped.length}):`);
    for (const s of [...new Set(stats.skipped)].slice(0, 10)) console.log(`    ${s}`);
  }
  if (stats.unmapped.size) {
    console.log(`  unmapped: ${[...stats.unmapped.keys()].slice(0, 10).join(' ')}`);
  }
}

console.log(`\ntotal: ${totalApplied} replacements${dry ? ' would be made' : ''}`);
