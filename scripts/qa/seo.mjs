// Pre-launch SEO checks over dist/ (run after `npm run build`). Exits 1 on errors.
//  1. Every URL from the old site (docs/data/url-inventory.csv) is either a
//     built page or a single 301 in public/_redirects to a built page.
//  2. Every indexable page: one <h1>, unique <title> (<= 62 chars) and meta
//     description (<= 160), self-referencing canonical, valid JSON-LD.
//  3. FAQPage questions in JSON-LD all appear in the visible page text.
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://alterphaseroofing.com';
const errors = [];
const warns = [];

const built = (p) => fs.existsSync(path.join(DIST, p, 'index.html'));
const redirects = new Map();
for (const line of fs.readFileSync(path.join(ROOT, 'public/_redirects'), 'utf8').split('\n')) {
  const parts = line.trim().split(/\s+/);
  if (parts.length === 3 && parts[0].startsWith('/') && !parts[0].includes('*')) redirects.set(parts[0], { to: parts[1], code: parts[2] });
}

// 1. Old URL coverage
const oldUrls = fs.readFileSync(path.join(ROOT, 'docs/data/url-inventory.csv'), 'utf8').trim().split('\n').slice(1).map((l) => l.split(',')[1]);
const coverage = { live: 0, redirected: 0 };
for (const u of [...new Set([...oldUrls, '/roof-replacement-si/'])]) {
  if (built(u)) { coverage.live++; continue; }
  const r = redirects.get(u);
  if (!r) { errors.push(`old URL not covered: ${u}`); continue; }
  if (r.code !== '301') errors.push(`${u} redirects with ${r.code}, expected 301`);
  if (!built(r.to)) errors.push(`${u} -> ${r.to} (target not built${redirects.has(r.to) ? ', redirect chain' : ''})`);
  coverage.redirected++;
}

// 2 + 3. Page checks
const pages = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name === 'index.html') pages.push(p);
  }
})(DIST);
const titles = new Map();
const descs = new Map();
for (const file of pages) {
  const url = '/' + path.relative(DIST, path.dirname(file)).split(path.sep).join('/') + '/';
  const u = url.replace('//', '/');
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  const robots = $('meta[name=robots]').attr('content') || '';
  if (/noindex/.test(robots)) continue;
  const title = $('title').text();
  const desc = $('meta[name=description]').attr('content') || '';
  const h1s = $('h1').length;
  const canonical = $('link[rel=canonical]').attr('href');
  if (h1s !== 1) errors.push(`${u}: ${h1s} <h1> elements`);
  if (!title || title.length > 62) (title ? warns : errors).push(`${u}: title length ${title.length}`);
  if (!desc || desc.length > 160) (desc ? warns : errors).push(`${u}: description length ${desc.length}`);
  if (canonical !== SITE + u) errors.push(`${u}: canonical ${canonical}`);
  titles.set(title, [...(titles.get(title) || []), u]);
  descs.set(desc, [...(descs.get(desc) || []), u]);
  const text = $('main').text().replace(/\s+/g, ' ');
  $('script[type="application/ld+json"]').each((_, s) => {
    let data;
    try { data = JSON.parse($(s).html()); } catch { errors.push(`${u}: invalid JSON-LD`); return; }
    for (const node of data['@graph'] || [data]) {
      if (node['@type'] === 'FAQPage') {
        for (const q of node.mainEntity) if (!text.includes(q.name)) errors.push(`${u}: FAQ question not visible: ${q.name}`);
      }
    }
  });
}
for (const [t, us] of titles) if (us.length > 1) errors.push(`duplicate title "${t}": ${us.join(', ')}`);
for (const [d, us] of descs) if (us.length > 1) errors.push(`duplicate description: ${us.join(', ')}`);

console.log(`Old URLs: ${coverage.live} live, ${coverage.redirected} redirected (301). Indexable pages checked: ${titles.size}.`);
for (const w of warns) console.log('WARN ', w);
for (const e of errors) console.log('ERROR', e);
process.exit(errors.length ? 1 : 0);
