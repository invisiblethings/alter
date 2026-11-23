// Renders the cost infographics for /roof-replacement-guide-nyc/ as JPGs in
// public/images/guides/roof-replacement-cost-nyc/. Prices come from
// src/data/costs.ts (kept in sync by hand below). Then run
//   python3 scripts/images/add-metadata.py
// to write the EXIF/IPTC/XMP metadata. Run from the repository root:
//   PW=$(npm root -g)/playwright node scripts/images/roof-replacement-cost.cjs
const { chromium } = require(process.env.PW);
const path = require('path');
const fs = require('fs');
const os = require('os');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'public/images/guides/roof-replacement-cost-nyc');
fs.mkdirSync(OUT, { recursive: true });
const f = (p) => 'file://' + path.join(ROOT, p);
const FONT = f('node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2');
const LOGO = f('public/wp-content/uploads/2024/10/AlterPhase-Logo-Full-Siding.png');
const $ = (n) => '$' + n.toLocaleString('en-US');

const base = `
@font-face { font-family: Archivo; src: url('${FONT}') format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1200px; overflow: hidden; font-family: Archivo, sans-serif; }
.c { position: relative; width: 1200px; height: var(--h); overflow: hidden; background: #f4f1ea; color: #0a1322; }
.head { padding: 64px 64px 0; }
.kick { display: inline-flex; align-items: center; gap: 12px; font-size: 30px; font-weight: 850; letter-spacing: .14em; text-transform: uppercase; color: #b07d10; }
.kick::before { content: ''; width: 42px; height: 4px; background: #f4ae2c; }
h1 { font-size: 72px; line-height: 1.03; font-weight: 900; font-stretch: 114%; letter-spacing: -0.02em; margin-top: 14px; }
.sub { font-size: 34px; line-height: 1.35; margin-top: 16px; font-weight: 600; color: #4a5568; }
.brand { position: absolute; left: 0; right: 0; bottom: 0; height: 130px; display: flex; align-items: center; justify-content: space-between; padding: 0 56px; background: #061530; color: #fff; font-size: 30px; font-weight: 800; }
.brand img { height: 66px; background: #fff; border-radius: 14px; padding: 8px 12px; }
.brand b { color: #fbc45a; font-size: 38px; font-stretch: 110%; }
.rows { margin: 44px 64px 0; display: grid; gap: 24px; }
.row .t { display: flex; justify-content: space-between; align-items: baseline; font-size: 40px; font-weight: 800; margin-bottom: 8px; }
.row .t span { font-weight: 900; color: #10346f; font-stretch: 108%; }
.row .t small { font-size: 28px; font-weight: 700; color: #6b7280; margin-left: 10px; }
.track { position: relative; height: 30px; border-radius: 15px; background: #e2dccf; }
.bar { position: absolute; top: 0; bottom: 0; border-radius: 13px; background: linear-gradient(90deg, #1d4b96, #10346f); }
.hot .bar { background: linear-gradient(90deg, #f4ae2c, #d9520b); }
.note { margin: 34px 64px 0; padding: 26px 32px; border-radius: 22px; background: #10346f; color: #fff; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.note small { font-size: 30px; font-weight: 700; color: #c8d3e8; display: block; }
.note strong { font-size: 60px; font-weight: 900; color: #fbc45a; font-stretch: 112%; }
.note em { font-style: normal; font-size: 30px; font-weight: 800; text-align: right; line-height: 1.3; }
`;
const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>${base}</style></head><body><div class="c">${body}<div class="brand"><img src="${LOGO}"><span>alterphaseroofing.com</span><b>(929) 370-1552</b></div></div></body></html>`;
const bar = (lo, hi, max) => `<div class="track"><div class="bar" style="left:${(lo / max) * 100}%;width:${((hi - lo) / max) * 100}%"></div></div>`;

// 1. Cost by roof size: shingles $3–$10/sq ft, flat (EPDM–TPO) $5–$14/sq ft.
const sizes = [1000, 1500, 2000, 3000];
const sizeCard = `
<style>
.grid { margin: 44px 64px 0; display: grid; gap: 22px; }
.sz { background: #fff; border-radius: 24px; padding: 26px 32px; box-shadow: 0 6px 20px rgba(10,25,55,.08); }
.sz h2 { font-size: 46px; font-weight: 900; font-stretch: 112%; color: #0a1322; margin-bottom: 10px; }
.sz .l { display: flex; justify-content: space-between; align-items: baseline; font-size: 36px; font-weight: 700; padding: 8px 0; border-top: 2px solid #eee7da; }
.sz .l b { font-weight: 900; color: #10346f; font-size: 40px; font-stretch: 108%; }
.sz .l.f b { color: #b8560c; }
</style>
<div class="head"><span class="kick">NYC roof replacement · 2026</span>
<h1>Roof replacement cost by roof size</h1>
<p class="sub">Installed prices from our own NYC jobs, including tear-off, materials and labor.</p></div>
<div class="grid">${sizes.map((s) => `<div class="sz"><h2>${s.toLocaleString('en-US')} sq ft roof</h2>
<div class="l"><span>Asphalt shingles</span><b>${$(s * 3)}–${$(s * 10)}</b></div>
<div class="l f"><span>Flat roof (EPDM, TPO)</span><b>${$(s * 5)}–${$(s * 14)}</b></div></div>`).join('')}</div>
<div class="note"><span><small>Most NYC homes</small><strong>$10,000–$30,000+</strong></span><em>Free inspection<br>Written price in 24 hrs</em></div>`;

// 2. Cost per sq ft by material.
const mats = [
  { n: 'Asphalt shingles', lo: 3, hi: 10, life: '20–30 yrs' },
  { n: 'EPDM (rubber)', lo: 5, hi: 12, life: '20–30 yrs' },
  { n: 'Modified bitumen', lo: 9, hi: 13, life: '20–30 yrs' },
  { n: 'TPO', lo: 9, hi: 14, life: '20–30 yrs' },
  { n: 'PVC', lo: 10, hi: 16, life: '25–35 yrs' },
  { n: 'Metal', lo: 12, hi: 18, life: '40–70 yrs' },
  { n: 'Tile', lo: 15, hi: 25, life: '50+ yrs' },
  { n: 'Slate', lo: 20, hi: 40, life: '75–100+ yrs' },
];
const matCard = `
<div class="head"><span class="kick">NYC roof replacement · 2026</span>
<h1>Roof replacement cost per square foot, by material</h1>
<p class="sub">Installed, with tear-off. Average prices from our own jobs across all five boroughs.</p></div>
<div class="rows">${mats.map((m) => `<div class="row${m.lo >= 15 ? ' hot' : ''}"><div class="t"><span style="color:#0a1322;font-weight:800">${m.n}<small>${m.life}</small></span><span>${$(m.lo)}–${$(m.hi)}</span></div>${bar(m.lo, m.hi, 40)}</div>`).join('')}</div>
<div class="note"><span><small>Best value</small><strong>Shingles &amp; EPDM</strong></span><em>Per sq ft, installed<br>Lifespan in grey</em></div>`;

// 3. 1,000 sq ft flat roof by borough (Manhattan first, then by population).
const bor = [
  { n: 'Manhattan', lo: 8000, hi: 22000 },
  { n: 'Brooklyn', lo: 6500, hi: 17000 },
  { n: 'Queens', lo: 5500, hi: 15000 },
  { n: 'Bronx', lo: 6000, hi: 16000 },
  { n: 'Staten Island', lo: 5000, hi: 13000 },
];
const borCard = `
<div class="head"><span class="kick">NYC roof replacement · 2026</span>
<h1>New flat roof cost in each NYC borough</h1>
<p class="sub">Full replacement of a typical 1,000 sq ft flat roof. Access, attached walls and building rules change the price.</p></div>
<div class="rows" style="gap:30px">${bor.map((b) => `<div class="row"><div class="t">${b.n}<span>${$(b.lo)}–${$(b.hi)}${b.n === 'Manhattan' ? '+' : ''}</span></div>${bar(b.lo, b.hi, 24000)}</div>`).join('')}</div>
<div class="note"><span><small>Same roof, Manhattan vs. Staten Island</small><strong>60%+ more</strong></span><em>Free inspection<br>in all 5 boroughs</em></div>`;

(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  for (const [name, body, h] of [
    ['roof-replacement-cost-nyc-by-roof-size', sizeCard, 1750],
    ['roof-replacement-cost-per-square-foot-by-material', matCard, 1660],
    ['flat-roof-replacement-cost-by-nyc-borough', borCard, 1330],
  ]) {
    const pg = await b.newPage({ viewport: { width: 1200, height: h } });
    const file = path.join(os.tmpdir(), name + '.html');
    fs.writeFileSync(file, page(body).replace('<div class="c">', `<div class="c" style="--h:${h}px">`));
    await pg.goto('file://' + file); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(150);
    await pg.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 84 });
    console.log('ok', name);
    await pg.close();
  }
  await b.close();
})();
