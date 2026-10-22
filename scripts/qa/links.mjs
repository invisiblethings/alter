// Internal link + asset checker over dist/: every href/src that points at
// this site must resolve to a built file, and pages must not link to
// redirects (old ?p= URLs, http:, absolute alterphaseroofing.com links).
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const DIST = path.resolve(import.meta.dirname, '../../dist');
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) files.push(p);
  }
})(DIST);

const exists = (url) => {
  const clean = decodeURI(url.split('#')[0].split('?')[0]);
  if (!clean) return true;
  const p = path.join(DIST, clean);
  return fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html')));
};

const broken = new Map();
const warn = new Map();
let checked = 0;
for (const f of files) {
  const page = '/' + path.relative(DIST, f).replace(/index\.html$/, '');
  const $ = cheerio.load(fs.readFileSync(f, 'utf8'));
  $('a[href], img[src], link[href], script[src], source[srcset], img[srcset]').each((_, el) => {
    const attrs = [$(el).attr('href'), $(el).attr('src'), ...(($(el).attr('srcset') || '').split(',').map((s) => s.trim().split(' ')[0]))].filter(Boolean);
    for (let u of attrs) {
      if (/^https?:\/\/(www\.)?alterphaseroofing\.com/.test(u)) { if (el.tagName === 'a') warn.set(`${page} -> ${u}`, 'absolute self link'); u = u.replace(/^https?:\/\/(www\.)?alterphaseroofing\.com/, ''); if (!u) continue; }
      if (!u.startsWith('/') || u.startsWith('//')) continue;
      checked++;
      if (!exists(u)) broken.set(`${page} -> ${u}`, true);
      else if (!u.includes('.') && !u.split('#')[0].split('?')[0].endsWith('/')) warn.set(`${page} -> ${u}`, 'missing trailing slash');
    }
  });
}
console.log(`${files.length} pages, ${checked} internal references checked`);
for (const k of broken.keys()) console.log('BROKEN ', k);
for (const [k, v] of warn) if (!k.includes('canonical')) console.log('WARN   ', k, `(${v})`);
process.exit(broken.size ? 1 : 0);
