#!/usr/bin/env node
// Classifies every colour literal in src/** against the DESIGN.md token roles
// and writes scripts/token-map.json for review before any code is rewritten.
//
// The classifier is deliberately explicit: frequent literals are pinned by hand,
// and only the long tail of one-off values is decided by measured lightness,
// saturation, and hue. Nothing is guessed at apply time.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const COLOR = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g;

// Literals whose role is known from reading the code, not inferred.
// `fg` applies to colour-like properties, `bg` to background/fill properties.
const PINNED = {
  '#ffffff': { fg: '--wj-on-brand', bg: '--wj-surface' },
  '#455ff6': { fg: '--wj-blue', bg: '--wj-blue' },
  '#2946d8': { fg: '--wj-blue-press', bg: '--wj-blue-press' },
  '#2949e8': { fg: '--wj-blue-press', bg: '--wj-blue-press' },
  '#334bd8': { fg: '--wj-blue-press', bg: '--wj-blue-press' },
  '#3049dc': { fg: '--wj-blue-press', bg: '--wj-blue-press' },
  '#3348d8': { fg: '--wj-blue-press', bg: '--wj-blue-press' },
  '#263fc9': { fg: '--wj-blue-press', bg: '--wj-blue-press' },
  '#141a3c': { fg: '--wj-navy', bg: '--wj-navy' },
  '#eef1ff': { fg: '--wj-blue-soft', bg: '--wj-blue-soft' },
  '#edf1ff': { fg: '--wj-blue-soft', bg: '--wj-blue-soft' },
  '#f6f8ff': { fg: '--wj-blue-tint', bg: '--wj-blue-tint' },
  '#f7f9ff': { fg: '--wj-blue-tint', bg: '--wj-blue-tint' },
  '#f7f8ff': { fg: '--wj-blue-tint', bg: '--wj-blue-tint' },
  '#f8f9ff': { fg: '--wj-blue-tint', bg: '--wj-blue-tint' },
  '#dce3f4': { fg: '--wj-hairline', bg: '--wj-hairline' },
  '#e6eaf3': { fg: '--wj-hairline', bg: '--wj-hairline' },
  // Soft canvases and grouped surfaces — not blue washes (DESIGN: blue is voltage).
  '#f4f6fb': { fg: '--wj-surface-soft', bg: '--wj-surface-soft' },
  '#edf1fb': { fg: '--wj-surface-soft', bg: '--wj-surface-soft' },
  '#f5f7fc': { fg: '--wj-surface-soft', bg: '--wj-surface-soft' },
  '#f7f9fe': { fg: '--wj-surface-soft', bg: '--wj-surface-soft' },
  '#f7f8fd': { fg: '--wj-surface-soft', bg: '--wj-surface-soft' },
  '#f2f4fb': { fg: '--wj-surface-soft', bg: '--wj-surface-soft' },
  // Lifted blues used as metric / emphasis text, not hairlines.
  '#8ca1ff': { fg: '--wj-blue', bg: '--wj-blue-soft' },
  '#91a3ff': { fg: '--wj-blue', bg: '--wj-blue-soft' },
  '#9eacff': { fg: '--wj-blue', bg: '--wj-blue-soft' },
  '#91a5ff': { fg: '--wj-blue', bg: '--wj-blue-soft' },
  '#8fa2ff': { fg: '--wj-blue', bg: '--wj-blue-soft' },
  '#8da0fc': { fg: '--wj-blue', bg: '--wj-blue-soft' },
  '#8fa3ff': { fg: '--wj-dark-blue', bg: '--wj-blue-soft' },
  // Saturated pale blues used as hover/selected borders, not resting hairlines.
  '#aebaff': { fg: '--wj-blue', bg: '--wj-blue-soft' },
  '#aab7ff': { fg: '--wj-blue', bg: '--wj-blue-soft' },
  '#cdd5fc': { fg: '--wj-hairline-strong', bg: '--wj-hairline-strong' },
  '#cfd7ff': { fg: '--wj-hairline-strong', bg: '--wj-hairline-strong' },
  '#cdd5ff': { fg: '--wj-blue-soft', bg: '--wj-blue-soft' },
  // Secondary text on light chrome.
  '#7582cf': { fg: '--wj-muted', bg: '--wj-muted' },
  '#4e587f': { fg: '--wj-muted', bg: '--wj-muted' },
  '#667099': { fg: '--wj-muted', bg: '--wj-muted' },
  // Dark-theme copy that must not become a hairline.
  '#cbd3e8': { fg: '--wj-dark-muted', bg: '--wj-dark-muted' },
  '#aeb9d3': { fg: '--wj-dark-muted', bg: '--wj-dark-muted' },
  '#c4cdea': { fg: '--wj-dark-muted', bg: '--wj-dark-muted' },
  '#dce3ff': { fg: '--wj-dark-body', bg: '--wj-blue-soft' },
  // Status fills and borders.
  '#bfe5d5': { fg: '--wj-success-soft', bg: '--wj-success-soft' },
  '#e8f8f1': { fg: '--wj-success-soft', bg: '--wj-success-soft' },
  '#22ae72': { fg: '--wj-success', bg: '--wj-success' },
  '#22a06b': { fg: '--wj-success', bg: '--wj-success' },
  '#24a56a': { fg: '--wj-success', bg: '--wj-success' },
  '#2f3e9d': { fg: '--wj-blue', bg: '--wj-blue' },
  // Dark-theme surfaces, kept as dark tokens; the theme root consumes them.
  '#0b1226': { fg: '--wj-dark-canvas', bg: '--wj-dark-canvas' },
  '#121d38': { fg: '--wj-dark-surface', bg: '--wj-dark-surface' },
  '#172443': { fg: '--wj-dark-raised', bg: '--wj-dark-raised' },
  '#24345f': { fg: '--wj-dark-raised', bg: '--wj-dark-raised' },
  '#1e2b54': { fg: '--wj-dark-raised', bg: '--wj-dark-raised' },
  '#101a38': { fg: '--wj-dark-surface', bg: '--wj-dark-surface' },
  '#344575': { fg: '--wj-dark-hairline-strong', bg: '--wj-dark-hairline-strong' },
  '#f5f7ff': { fg: '--wj-dark-ink', bg: '--wj-dark-ink' },
  '#aab5d6': { fg: '--wj-dark-muted', bg: '--wj-dark-muted' },
  'rgba(255,255,255,.82)': { fg: '--wj-on-brand-muted', bg: '--wj-on-brand-muted' },
  // Only the focus-ring alpha maps to focus. Softer blue alphas are elevation
  // glows; DESIGN.md wants navy shadows, so they collapse onto the shadow ladder.
  'rgba(69,95,246,0.32)': { fg: '--wj-focus', bg: '--wj-focus' },
  'rgba(69,95,246,.32)': { fg: '--wj-focus', bg: '--wj-focus' },
  'rgba(69,95,246,.12)': { fg: '--wj-shadow-md', bg: '--wj-shadow-md' },
  'rgba(69,95,246,0.12)': { fg: '--wj-shadow-md', bg: '--wj-shadow-md' },
  'rgba(69,95,246,.1)': { fg: '--wj-shadow-md', bg: '--wj-shadow-md' },
  'rgba(69,95,246,.15)': { fg: '--wj-shadow-md', bg: '--wj-shadow-md' },
  'rgba(69,95,246,.17)': { fg: '--wj-shadow-md', bg: '--wj-shadow-md' },
  'rgba(69,95,246,.18)': { fg: '--wj-shadow-md', bg: '--wj-shadow-md' },
  // Mostly elevation glows (3 of 4). The one fill site (.map-radius) is fixed by hand.
  'rgba(69,95,246,.22)': { fg: '--wj-shadow-lg', bg: '--wj-shadow-lg' },
};

function parse(value) {
  const v = value.toLowerCase().replace(/\s+/g, '');
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }
  const fn = v.match(/^rgba?\(([^)]*)\)$/);
  if (fn) {
    const parts = fn[1].split(',');
    return {
      r: Number.parseFloat(parts[0]),
      g: Number.parseFloat(parts[1]),
      b: Number.parseFloat(parts[2]),
      a: parts[3] === undefined ? 1 : Number.parseFloat(parts[3]),
    };
  }
  return null;
}

function hsl({ r, g, b }) {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === R) h = 60 * (((G - B) / d) % 6);
    else if (max === G) h = 60 * ((B - R) / d + 2);
    else h = 60 * ((R - G) / d + 4);
  }
  if (h < 0) h += 360;
  return { h, s: s * 100, l: l * 100 };
}

function classify(literal) {
  const c = parse(literal);
  if (!c) return { fg: null, bg: null, why: 'unparsed' };
  const { h, s, l } = hsl(c);
  const blueHue = h > 200 && h < 260;

  // Translucent values are shadows, scrims, or overlay copy.
  if (c.a < 0.95) {
    // Low-alpha whites are glass borders, not muted labels. Leave them alone
    // unless the alpha is high enough to read as on-brand muted copy.
    if (l > 90) {
      if (c.a >= 0.7) {
        return { fg: '--wj-on-brand-muted', bg: '--wj-on-brand-muted', why: `white alpha ${c.a}` };
      }
      return { fg: null, bg: null, why: `low-alpha white ${c.a}; no token` };
    }
    // Focus ring is the only translucent blue that is a focus. Softer blue
    // alphas are elevation glows; DESIGN.md wants navy shadows for elevation.
    if (blueHue && s > 40 && l > 45) {
      if (c.a >= 0.28) return { fg: '--wj-focus', bg: '--wj-focus', why: `blue focus alpha ${c.a}` };
      const shadow = c.a <= 0.08 ? '--wj-shadow-sm' : c.a <= 0.14 ? '--wj-shadow-md' : '--wj-shadow-lg';
      return { fg: shadow, bg: shadow, why: `blue glow → navy shadow ${c.a}` };
    }
    if (c.a >= 0.35) return { fg: '--wj-scrim', bg: '--wj-scrim', why: `dark alpha ${c.a}` };
    const shadow = c.a <= 0.08 ? '--wj-shadow-sm' : c.a <= 0.14 ? '--wj-shadow-md' : '--wj-shadow-lg';
    return { fg: shadow, bg: shadow, why: `dark alpha ${c.a}` };
  }

  // Hue families that are not the brand blue.
  if (s > 12 && h >= 90 && h < 175) {
    return l > 78
      ? { fg: '--wj-success-soft', bg: '--wj-success-soft', why: 'pale green' }
      : { fg: '--wj-success', bg: '--wj-success', why: 'green' };
  }
  if (s > 12 && (h >= 345 || h < 20)) {
    return l > 85
      ? { fg: '--wj-danger-soft', bg: '--wj-danger-soft', why: 'pale red' }
      : { fg: '--wj-danger', bg: '--wj-danger', why: 'red' };
  }
  if (s > 12 && h >= 20 && h < 60) {
    return l > 85
      ? { fg: '--wj-warning-soft', bg: '--wj-warning-soft', why: 'pale amber' }
      : { fg: '--wj-warning', bg: '--wj-warning', why: 'amber' };
  }
  if (s > 12 && h >= 175 && h < 200) {
    return { fg: '--wj-success', bg: '--wj-success', why: 'teal, off-palette' };
  }

  // Saturated blues before hairline bands, otherwise lifted blues become borders.
  if (blueHue && s > 35) {
    if (l >= 88) return { fg: '--wj-blue-soft', bg: '--wj-blue-soft', why: `soft blue ${l.toFixed(0)}%` };
    if (l >= 70) return { fg: '--wj-blue', bg: '--wj-blue-soft', why: `lifted blue text ${l.toFixed(0)}%` };
    if (l >= 40) return { fg: '--wj-blue', bg: '--wj-blue', why: `brand blue ${l.toFixed(0)}%` };
    if (l >= 28) return { fg: '--wj-blue-press', bg: '--wj-blue-press', why: `pressed blue ${l.toFixed(0)}%` };
  }

  // Neutral spine. Soft canvases sit between white and blue-tint at low sat.
  if (l >= 98) return { fg: '--wj-on-brand', bg: '--wj-surface', why: `near white ${l.toFixed(0)}%` };
  if (l >= 94 && s < 12) return { fg: '--wj-surface-soft', bg: '--wj-surface-soft', why: `surface soft ${l.toFixed(0)}%` };
  if (l >= 95) return { fg: '--wj-blue-tint', bg: '--wj-blue-tint', why: `tint ${l.toFixed(0)}%` };
  if (l >= 91) return { fg: '--wj-blue-soft', bg: '--wj-blue-soft', why: `soft ${l.toFixed(0)}%` };
  if (l >= 84) return { fg: '--wj-hairline', bg: '--wj-hairline', why: `hairline ${l.toFixed(0)}%` };
  if (l >= 74) return { fg: '--wj-hairline-strong', bg: '--wj-hairline-strong', why: `hairline strong ${l.toFixed(0)}%` };
  if (l >= 55) return { fg: '--wj-muted', bg: '--wj-muted', why: `muted ${l.toFixed(0)}%` };
  if (l >= 38) return { fg: '--wj-muted', bg: '--wj-muted', why: `muted ${l.toFixed(0)}%` };
  if (l >= 24) return { fg: '--wj-body', bg: '--wj-body', why: `body ${l.toFixed(0)}%` };
  if (l >= 14) return { fg: '--wj-navy', bg: '--wj-dark-raised', why: `deep ${l.toFixed(0)}%` };
  return { fg: '--wj-navy', bg: '--wj-dark-canvas', why: `deepest ${l.toFixed(0)}%` };
}

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) out.push(...walk(f));
    else if (/\.(css|jsx)$/.test(f)) out.push(f);
  }
  return out;
}

const counts = new Map();
for (const file of walk('src')) {
  const body = readFileSync(file, 'utf8').replace(/:root\{[\s\S]*?\n\}/g, '');
  for (const m of body.match(COLOR) || []) {
    let v = m.toLowerCase().replace(/\s+/g, '');
    const short = v.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/);
    if (short) v = `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
    counts.set(v, (counts.get(v) || 0) + 1);
  }
}

const map = {};
let unmapped = 0;
for (const [literal, n] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
  const pinned = PINNED[literal];
  const auto = classify(literal);
  const fg = pinned ? pinned.fg : auto.fg;
  const bg = pinned ? pinned.bg : auto.bg;
  if (!fg && !bg) unmapped += n;
  map[literal] = {
    uses: n,
    fg,
    bg,
    source: pinned ? 'pinned' : (fg || bg ? 'classified' : 'unmapped'),
    why: pinned ? 'read from the code' : auto.why,
  };
}

writeFileSync('scripts/token-map.json', `${JSON.stringify(map, null, 2)}\n`);

const pinnedCount = Object.values(map).filter((m) => m.source === 'pinned').length;
const pinnedUses = Object.values(map).filter((m) => m.source === 'pinned').reduce((a, m) => a + m.uses, 0);
const totalUses = Object.values(map).reduce((a, m) => a + m.uses, 0);
console.log(`literals: ${Object.keys(map).length} (${pinnedCount} pinned, ${Object.keys(map).length - pinnedCount} classified/unmapped)`);
console.log(`occurrences: ${totalUses} (${pinnedUses} covered by pinned literals, ${((pinnedUses / totalUses) * 100).toFixed(1)}%)`);
console.log(`left unmapped on purpose: ${unmapped}`);
console.log('wrote scripts/token-map.json');
