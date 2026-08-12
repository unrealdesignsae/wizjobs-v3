#!/usr/bin/env node
// Replace remaining colour literals with color-mix against DESIGN tokens.
import { readFileSync, writeFileSync } from 'node:fs';

const file = 'src/styles.css';
let text = readFileSync(file, 'utf8');

const map = [
  // Near-opaque glass panels
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?96\s*\)/gi, 'color-mix(in srgb,var(--wj-surface) 96%,transparent)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?94\s*\)/gi, 'color-mix(in srgb,var(--wj-surface) 94%,transparent)'],
  // On-brand glass (white alpha on blue/navy)
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?5(?:0)?\s*\)/gi, 'color-mix(in srgb,var(--wj-on-brand) 50%,transparent)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?36\s*\)/gi, 'color-mix(in srgb,var(--wj-on-brand) 36%,transparent)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?25\s*\)/gi, 'color-mix(in srgb,var(--wj-on-brand) 25%,transparent)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?22\s*\)/gi, 'color-mix(in srgb,var(--wj-on-brand) 22%,transparent)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?2(?:0)?\s*\)/gi, 'color-mix(in srgb,var(--wj-on-brand) 20%,transparent)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?18\s*\)/gi, 'color-mix(in srgb,var(--wj-on-brand) 18%,transparent)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?16\s*\)/gi, 'color-mix(in srgb,var(--wj-on-brand) 16%,transparent)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?15\s*\)/gi, 'color-mix(in srgb,var(--wj-on-brand) 15%,transparent)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?14\s*\)/gi, 'color-mix(in srgb,var(--wj-on-brand) 14%,transparent)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?13\s*\)/gi, 'color-mix(in srgb,var(--wj-on-brand) 13%,transparent)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?12\s*\)/gi, 'color-mix(in srgb,var(--wj-on-brand) 12%,transparent)'],
  [/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*\.?1(?:0)?\s*\)/gi, 'color-mix(in srgb,var(--wj-on-brand) 10%,transparent)'],
  // Success soft rings / fills
  [/rgba\(\s*130\s*,\s*246\s*,\s*224\s*,\s*\.?18\s*\)/gi, 'color-mix(in srgb,var(--wj-success) 18%,transparent)'],
  [/rgba\(\s*130\s*,\s*246\s*,\s*224\s*,\s*\.?12\s*\)/gi, 'color-mix(in srgb,var(--wj-success) 12%,transparent)'],
  [/rgba\(\s*101\s*,\s*242\s*,\s*209\s*,\s*\.?18\s*\)/gi, 'color-mix(in srgb,var(--wj-success) 18%,transparent)'],
  // Elevation / map chrome
  [/rgba\(\s*69\s*,\s*95\s*,\s*246\s*,\s*\.?22\s*\)/gi, 'color-mix(in srgb,var(--wj-blue) 22%,transparent)'],
  [/rgba\(\s*132\s*,\s*151\s*,\s*255\s*,\s*\.?18\s*\)/gi, 'color-mix(in srgb,var(--wj-blue-fg) 18%,transparent)'],
  [/rgba\(\s*53\s*,\s*73\s*,\s*153\s*,\s*\.?3(?:0)?\s*\)/gi, 'color-mix(in srgb,var(--wj-navy) 30%,transparent)'],
  [/rgba\(\s*53\s*,\s*73\s*,\s*153\s*,\s*\.?22\s*\)/gi, 'color-mix(in srgb,var(--wj-navy) 22%,transparent)'],
  [/rgba\(\s*40\s*,\s*53\s*,\s*133\s*,\s*\.?22\s*\)/gi, 'color-mix(in srgb,var(--wj-navy) 22%,transparent)'],
  [/rgba\(\s*6\s*,\s*14\s*,\s*43\s*,\s*\.?14\s*\)/gi, 'color-mix(in srgb,var(--wj-navy) 14%,transparent)'],
  [/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*\.?28\s*\)/gi, 'color-mix(in srgb,var(--wj-navy) 28%,transparent)'],
];

let count = 0;
for (const [re, to] of map) {
  text = text.replace(re, () => {
    count += 1;
    return to;
  });
}

writeFileSync(file, text);
console.log(`replaced ${count} colour literals with color-mix`);
