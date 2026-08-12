import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) out.push(...walk(f));
    else if (/\.(css|jsx)$/.test(f)) out.push(f);
  }
  return out;
}

const COLOR = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g;
const overall = new Map();
const perFile = new Map();

for (const file of walk('src')) {
  const text = readFileSync(file, 'utf8');
  // Skip the canonical :root registry so token definitions are not counted.
  const body = text.replace(/:root\{[\s\S]*?\n\}/g, '');
  const counts = new Map();
  for (const m of body.match(COLOR) || []) {
    let v = m.toLowerCase().replace(/\s+/g, '');
    const short = v.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/);
    if (short) v = `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
    counts.set(v, (counts.get(v) || 0) + 1);
    overall.set(v, (overall.get(v) || 0) + 1);
  }
  perFile.set(file, counts);
}

const sorted = [...overall.entries()].sort((a, b) => b[1] - a[1]);
console.log(`distinct literals: ${sorted.length}\n`);
console.log('=== all literals by frequency ===');
for (const [v, n] of sorted) console.log(`${String(n).padStart(4)}  ${v}`);

console.log('\n=== per file, top 12 ===');
for (const [file, counts] of perFile) {
  if (counts.size === 0) continue;
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  console.log(`\n${file}  (${counts.size} distinct)`);
  console.log(top.map(([v, n]) => `${v}=${n}`).join(' '));
}
