#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) out.push(...walk(f));
    else if (/\.css$/.test(f)) out.push(f);
  }
  return out;
}

let bumped = 0;
for (const file of walk('src')) {
  const before = readFileSync(file, 'utf8');
  const after = before.replace(/font-size\s*:\s*(\d+(?:\.\d+)?)px/gi, (m, n) => {
    const v = parseFloat(n);
    if (v < 12) {
      bumped += 1;
      return 'font-size:12px';
    }
    return m;
  });
  if (after !== before) writeFileSync(file, after);
}
console.log(`bumped ${bumped} font-size declarations to 12px`);
