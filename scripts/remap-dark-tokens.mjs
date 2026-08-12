#!/usr/bin/env node
// One-shot: rewrite component --wj-dark-* reads onto remappable neutrals.
// Does not touch :root token definitions or the html[data-theme=dark] remap block.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const REPLACEMENTS = [
  ['--wj-dark-canvas', '--wj-canvas'],
  ['--wj-dark-surface', '--wj-surface'],
  ['--wj-dark-raised', '--wj-surface-soft'],
  ['--wj-dark-hairline-strong', '--wj-hairline-strong'],
  ['--wj-dark-hairline', '--wj-hairline'],
  ['--wj-dark-ink', '--wj-navy'],
  ['--wj-dark-body', '--wj-body'],
  ['--wj-dark-muted', '--wj-muted'],
  ['--wj-dark-blue', '--wj-blue-fg'],
];

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) out.push(...walk(f));
    else if (/\.css$/.test(f)) out.push(f);
  }
  return out;
}

function transform(text) {
  // Protect :root { ... } registry and the theme-root remap block.
  const protectedBlocks = [];
  const protect = (re) => {
    text = text.replace(re, (m) => {
      const key = `/*__PROTECT_${protectedBlocks.length}__*/`;
      protectedBlocks.push(m);
      return key;
    });
  };
  protect(/:root\s*\{[^{}]*\}/g);
  protect(/html\[data-theme=['"]dark['"]\]\s*\{[^{}]*\}/g);

  for (const [from, to] of REPLACEMENTS) {
    text = text.split(from).join(to);
  }

  protectedBlocks.forEach((block, i) => {
    text = text.replace(`/*__PROTECT_${i}__*/`, block);
  });
  return text;
}

let files = 0;
let hits = 0;
for (const file of walk('src')) {
  const before = readFileSync(file, 'utf8');
  const after = transform(before);
  if (after !== before) {
    writeFileSync(file, after);
    files += 1;
    for (const [from] of REPLACEMENTS) {
      const b = before.split(from).length - 1;
      const a = after.split(from).length - 1;
      hits += Math.max(0, b - a);
    }
  }
}
console.log(`rewrote ${hits} dark-token reads across ${files} files`);
