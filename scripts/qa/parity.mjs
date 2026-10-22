// Migration parity check: every URL from the old site must exist in dist/
// with the same <title>, meta description, H1, canonical and robots
// directive, and keep most of its text and headings. Exits 1 on failure.
//
//   npm run build && npm run check:parity
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DIST = path.join(ROOT, 'dist');
const CACHE = path.join(ROOT, 'scripts/migrate/.cache/html');
const ORIGIN = 'https://alterphaseroofing.com';

const inventory = fs.readFileSync(path.join(ROOT, 'docs/data/url-inventory.csv'), 'utf8').trim().split('\n').slice(1).map((l) => l.split(',')[1]);
const paths = [...new Set([...inventory, '/roof-replacement-si/'])];
const fileKey = (p) => (p === '/' ? 'index' : p.replace(/^\/|\/$/g, '').replace(/\//g, '__'));
const squash = (s) => (s || '').replace(/\s+/g, ' ').trim();
const norm = (s) => squash(s).replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-');

function read(html, mainSel) {
  const $ = cheerio.load(html);
  $('h1 br, h2 br, h3 br, title br').replaceWith(' ');
  const robots = $('meta[name="robots"]').attr('content') || '';
  const $main = mainSel($);
  $main.find('script, style, noscript, form, nav, header, footer, [data-elementor-type="header"], [data-elementor-type="footer"]').remove();
  return {
    title: norm($('title').first().text()),
    description: norm($('meta[name="description"]').attr('content')),
    h1: norm($('h1').first().text()),
    canonical: $('link[rel="canonical"]').attr('href') || '',
    noindex: /noindex/.test(robots),
    words: squash($main.text()).split(' ').length,
    headings: $main.find('h2, h3').map((_, h) => norm($(h).text()).toLowerCase()).get(),
  };
}

// Intentional launch changes (see docs/PLAN.md): ads landing pages move to
// noindex; pages that had no H1 get one.
const EXPECTED_NOINDEX = new Set(['/roofing-lp/', '/vinyl-siding-estimate/', '/roof-replacement-si/']);
// Site-wide Elementor sections and sidebar widgets, not page content.
const BOILERPLATE = /review|estimate|schedule|get in touch|customer|why choose|request|contact info|built on excellence|simple, effective process|^step \d|need emergency help|what your neighbors are saying|more posts & news|ready for a roof that lasts|quote$|^ready to (fix|protect|replace)|^active leak|^got a roof problem/;
// Deliberate copy fixes at launch.
const EXPECTED_HEADINGS = new Set(['decades of experience. ironclad warranties. peace of mind included.']);
const postTitles = new Set();
for (const f of fs.readdirSync(path.join(ROOT, 'src/content/posts'))) {
  const src = fs.readFileSync(path.join(ROOT, 'src/content/posts', f), 'utf8');
  for (const k of ['h1', 'cardTitle', 'seoTitle']) { const m = src.match(new RegExp(`^${k}: "(.*)"$`, 'm')); if (m) postTitles.add(norm(JSON.parse(`"${m[1]}"`)).toLowerCase()); }
}

const rows = [];
let failures = 0;
for (const p of paths) {
  const oldHtml = fs.readFileSync(path.join(CACHE, `${fileKey(p)}.html`), 'utf8');
  const newFile = path.join(DIST, p, 'index.html');
  if (!fs.existsSync(newFile)) { rows.push({ path: p, status: 'MISSING' }); failures++; continue; }
  const o = read(oldHtml, ($) => $('body'));
  const n = read(fs.readFileSync(newFile, 'utf8'), ($) => $('main'));
  const issues = [];
  if (o.title !== n.title) issues.push(`title: "${o.title}" → "${n.title}"`);
  if (o.description !== n.description) issues.push('description changed');
  if (o.h1 !== n.h1 && o.h1) issues.push(`h1: "${o.h1}" → "${n.h1}"`);
  const oc = o.canonical.replace(ORIGIN, '');
  const nc = n.canonical.replace(ORIGIN, '');
  if (oc && oc !== nc) issues.push(`canonical: ${oc} → ${nc}`);
  if (o.noindex !== n.noindex && !EXPECTED_NOINDEX.has(p)) issues.push(`noindex: ${o.noindex} → ${n.noindex}`);
  // Old pages carried site-wide Elementor chrome (reviews widget, forms), so
  // compare headings, which are the ranking-relevant structure.
  const lost = [...new Set(o.headings)].filter((h) => h.length > 3 && !n.headings.includes(h) && !BOILERPLATE.test(h) && !postTitles.has(h) && !EXPECTED_HEADINGS.has(h));
  if (lost.length) issues.push(`headings missing (${lost.length}): ${lost.slice(0, 3).join(' | ')}`);
  if (issues.length) failures++;
  rows.push({ path: p, oldWords: o.words, newWords: n.words, status: issues.length ? 'FAIL' : 'ok', issues: issues.join('; ') });
}

for (const r of rows) console.log(`${r.status.padEnd(7)} ${r.path}${r.issues ? `\n        ${r.issues}` : ''}`);
console.log(`\n${rows.length - failures}/${rows.length} URLs match`);
process.exit(failures ? 1 : 0);
