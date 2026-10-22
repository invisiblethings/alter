// Rehype plugins for migrated content. Kept dependency-free on purpose: the
// HAST walking here is a few lines and keeps the build reproducible.
import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';

const PUBLIC = path.resolve(import.meta.dirname, '../../public');

const isEl = (n, ...tags) => n && n.type === 'element' && (!tags.length || tags.includes(n.tagName));
export const textOf = (n) => (n.type === 'text' ? n.value : (n.children || []).map(textOf).join(''));

function walk(node, fn, parent = null) {
  fn(node, parent);
  for (const c of node.children || []) walk(c, fn, node);
}

// Same id scheme as the LuckyWP Table of Contents plugin on the old site, so
// "jump to" links Google already shows (e.g. #Roof_Replacement_Cost_Calculator)
// keep landing on the right heading.
export const tocId = (text) =>
  text.replace(/\s+/g, ' ').trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s+/g, '_');

export function rehypeHeadingIds() {
  return (tree) => {
    const used = new Set();
    walk(tree, (n) => {
      if (!isEl(n, 'h2', 'h3', 'h4')) return;
      let id = tocId(textOf(n)) || 'section';
      let k = id;
      for (let i = 2; used.has(k); i++) k = `${id}_${i}`;
      used.add(k);
      n.properties.id = k;
    });
  };
}

// Width/height on every image (no layout shift), lazy loading, and a
// responsive srcset built from the WordPress size variants that exist on disk.
const dimsCache = new Map();
function dims(src) {
  if (dimsCache.has(src)) return dimsCache.get(src);
  let d = null;
  try {
    const buf = fs.readFileSync(path.join(PUBLIC, decodeURI(src)));
    d = imageSize(buf);
  } catch { /* remote or missing image */ }
  dimsCache.set(src, d);
  return d;
}

function variants(src) {
  const m = src.match(/^(.*?)(-\d+x\d+)?(\.(?:jpe?g|png|webp))$/i);
  if (!m) return [];
  const [, stem, , ext] = m;
  const dir = path.join(PUBLIC, path.dirname(decodeURI(src)));
  const base = path.basename(stem);
  let files = [];
  try { files = fs.readdirSync(dir); } catch { return []; }
  const out = [];
  for (const f of files) {
    const v = f.match(new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:-(\\d+)x\\d+)?${ext.replace('.', '\\.')}$`));
    if (!v) continue;
    const url = `${path.dirname(src)}/${f}`;
    const w = v[1] ? Number(v[1]) : dims(url)?.width;
    if (w && w > 150) out.push([w, url]);
  }
  return out.sort((a, b) => a[0] - b[0]);
}

export function rehypeImages() {
  return (tree) => {
    let first = true;
    walk(tree, (n) => {
      if (!isEl(n, 'img')) return;
      const src = String(n.properties.src || '');
      if (src.startsWith('/')) {
        const d = dims(src);
        if (d) { n.properties.width = d.width; n.properties.height = d.height; }
        const vs = variants(src);
        if (vs.length > 1) {
          n.properties.srcSet = vs.map(([w, u]) => `${u} ${w}w`).join(', ');
          n.properties.sizes = '(min-width: 900px) 760px, 100vw';
        }
      }
      n.properties.loading = first ? 'eager' : 'lazy';
      n.properties.decoding = 'async';
      first = false;
    });
  };
}

// Tables scroll sideways on phones instead of breaking the layout.
export function rehypeTables() {
  return (tree) => {
    walk(tree, (n, parent) => {
      if (!isEl(n, 'table') || !parent || (isEl(parent, 'div') && parent.properties?.className?.includes('table-wrap'))) return;
      const i = parent.children.indexOf(n);
      parent.children[i] = { type: 'element', tagName: 'div', properties: { className: ['table-wrap'], tabIndex: 0, role: 'region', ariaLabel: 'Scrollable table' }, children: [n] };
    });
  };
}

// External links open safely; internal links stay plain.
export function rehypeLinks() {
  return (tree) => {
    walk(tree, (n) => {
      if (!isEl(n, 'a')) return;
      const href = String(n.properties.href || '');
      if (/^https?:\/\//.test(href) && !href.startsWith('https://alterphaseroofing.com')) {
        n.properties.rel = ['noopener'];
        n.properties.target = '_blank';
      }
    });
  };
}

// Runs of 3+ h3/h4 sections under one h2 get a layout:
//  - question headings ("How much does…?") become an FAQ accordion (all pages)
//  - short feature sections become a card grid (pages only, not blog posts)
// Same headings and text either way; only the presentation changes.
export function rehypeSectionGroups() {
  return (tree, file) => {
    const p = String(file.path || file.history?.[0] || '');
    const isPage = p.includes(`${path.sep}pages${path.sep}`);
    const kids = tree.children;
    const out = [];
    let i = 0;
    const clean = (g) => g.filter((x) => !(x.type === 'text' && !x.value.trim()));
    while (i < kids.length) {
      const n = kids[i];
      if (isEl(n, 'h3', 'h4')) {
        const level = n.tagName;
        const groups = [];
        let j = i;
        while (j < kids.length && isEl(kids[j], level)) {
          const g = [kids[j]];
          j++;
          while (j < kids.length && !isEl(kids[j], 'h2', 'h3', 'h4', 'h5', 'h6')) { g.push(kids[j]); j++; }
          groups.push(g);
        }
        const questions = groups.filter((g) => textOf(g[0]).trim().endsWith('?')).length;
        if (groups.length >= 3 && questions / groups.length >= 0.6) {
          out.push({
            type: 'element', tagName: 'div', properties: { className: ['faq'] },
            children: groups.map((g) => ({
              type: 'element', tagName: 'details', properties: { className: ['faq-item'] },
              children: [
                { type: 'element', tagName: 'summary', properties: {}, children: [g[0]] },
                { type: 'element', tagName: 'div', properties: { className: ['faq-a'] }, children: clean(g.slice(1)) },
              ],
            })),
          });
          i = j;
          continue;
        }
        const short = groups.every((g) => g.slice(1).map(textOf).join(' ').split(/\s+/).length <= 70 && !g.some((x) => isEl(x, 'table')));
        if (isPage && groups.length >= 3 && short) {
          out.push({
            type: 'element', tagName: 'div', properties: { className: ['card-grid'] },
            children: groups.map((g) => ({ type: 'element', tagName: 'div', properties: { className: ['card'] }, children: clean(g) })),
          });
          i = j;
          continue;
        }
      }
      out.push(n);
      i++;
    }
    tree.children = out;
  };
}
