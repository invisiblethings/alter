// Renders the infographics for /cost-to-repair-roof-leak/ as JPGs in
// public/images/guides/roof-leak-repair-cost/. Prices come from
// src/data/costs.ts (kept in sync by hand below). Then run
//   python3 scripts/images/add-metadata.py
// to write the EXIF/IPTC/XMP metadata. Run from the repository root:
//   PW=$(npm root -g)/playwright node scripts/images/roof-leak-repair-cost.cjs
const { chromium } = require(process.env.PW);
const path = require('path');
const fs = require('fs');
const os = require('os');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'public/images/guides/roof-leak-repair-cost');
fs.mkdirSync(OUT, { recursive: true });
const f = (p) => 'file://' + path.join(ROOT, p);
const FONT = f('node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2');
const LOGO = f('public/wp-content/uploads/2024/10/AlterPhase-Logo-Full-Siding.png');

// Leak repair prices (src/data/costs.ts: repairs + repairTiers).
const leaks = [
  { n: 'Pipe boot / vent leak', lo: 150, hi: 400 },
  { n: 'Gutter / drip edge', lo: 150, hi: 500 },
  { n: 'Small leak patch', lo: 300, hi: 650 },
  { n: 'Shingle repair', lo: 350, hi: 800 },
  { n: 'Flashing replacement', lo: 450, hi: 900 },
  { n: 'Flat roof leak', lo: 400, hi: 1200 },
  { n: 'Skylight leak', lo: 500, hi: 1200 },
  { n: 'Valley leak', lo: 400, hi: 1500 },
  { n: 'Storm damage / rotted deck', lo: 1500, hi: 3500 },
];
const $ = (n) => '$' + n.toLocaleString('en-US');

const base = `
@font-face { font-family: Archivo; src: url('${FONT}') format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1200px; overflow: hidden; font-family: Archivo, sans-serif; }
.c { position: relative; width: 1200px; height: var(--h); overflow: hidden; }
.kick { display: inline-flex; align-items: center; gap: 12px; font-size: 30px; font-weight: 850; letter-spacing: .14em; text-transform: uppercase; color: #b07d10; }
.kick::before { content: ''; width: 42px; height: 4px; background: #f4ae2c; }
h1 { font-size: 74px; line-height: 1.02; font-weight: 900; font-stretch: 114%; letter-spacing: -0.02em; margin-top: 14px; }
.sub { font-size: 36px; line-height: 1.35; margin-top: 16px; font-weight: 600; }
.brand { position: absolute; left: 0; right: 0; bottom: 0; height: 130px; display: flex; align-items: center; justify-content: space-between; padding: 0 56px; background: #061530; color: #fff; font-size: 30px; font-weight: 800; }
.brand img { height: 66px; background: #fff; border-radius: 14px; padding: 8px 12px; }
.brand b { color: #fbc45a; font-size: 38px; font-stretch: 110%; }
`;

// 1. Price chart
const max = 3500;
const chart = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
body, .c { background: #f4f1ea; color: #0a1322; }
.head { padding: 64px 64px 0; }
.rows { margin: 46px 64px 0; display: grid; gap: 26px; }
.row { display: grid; grid-template-columns: 1fr; gap: 8px; }
.row .t { display: flex; justify-content: space-between; align-items: baseline; font-size: 41px; font-weight: 800; }
.row .t span { font-size: 41px; font-weight: 900; color: #10346f; font-stretch: 108%; }
.track { position: relative; height: 30px; border-radius: 15px; background: #e2dccf; }
.bar { position: absolute; top: 0; bottom: 0; border-radius: 13px; background: linear-gradient(90deg, #1d4b96, #10346f); }
.row.hot .bar { background: linear-gradient(90deg, #f4ae2c, #d9520b); }
.axis { margin: 10px 64px 0; display: flex; justify-content: space-between; font-size: 22px; color: #6b7280; font-weight: 700; }
.most { margin: 30px 64px 0; padding: 26px 32px; border-radius: 22px; background: #10346f; color: #fff; display: flex; align-items: center; justify-content: space-between; }
.most small { font-size: 32px; font-weight: 700; color: #c8d3e8; display: block; }
.most strong { font-size: 66px; font-weight: 900; color: #fbc45a; font-stretch: 112%; }
</style></head><body><div class="c">
<div class="head"><span class="kick">NYC roof leak repair cost · 2026</span>
<h1>What it costs to fix a roof leak in NYC</h1>
<p class="sub" style="color:#4a5568">Average prices from hundreds of Alter Phase Roofing jobs across all five boroughs.</p></div>
<div class="rows">${leaks.map((l) => `<div class="row${l.lo >= 1500 ? ' hot' : ''}"><div class="t">${l.n}<span>${$(l.lo)}–${$(l.hi)}</span></div><div class="track"><div class="bar" style="left:${(l.lo / max) * 100}%;width:${((l.hi - l.lo) / max) * 100}%"></div></div></div>`).join('')}</div>
<div class="most"><span><small>Most roof leak repairs</small><strong>$300–$1,200</strong></span><span style="font-size:32px;font-weight:800;text-align:right;line-height:1.3">Free inspection<br>Written price in 24 hrs</span></div>
<div class="brand"><img src="${LOGO}"><span>alterphaseroofing.com</span><b>(929) 370-1552</b></div>
</div></body></html>`;

// 2. Where roofs leak: house diagram with numbered leak points
const pts = [
  { x: 335, y: 268, n: 1, t: 'Chimney flashing', p: '$450–$900' },
  { x: 520, y: 345, n: 2, t: 'Pipe boot / plumbing vent', p: '$150–$400' },
  { x: 640, y: 395, n: 3, t: 'Valley where roofs meet', p: '$400–$1,500' },
  { x: 430, y: 420, n: 4, t: 'Skylight', p: '$500–$1,200' },
  { x: 250, y: 470, n: 5, t: 'Missing or cracked shingles', p: '$350–$800' },
  { x: 990, y: 560, n: 6, t: 'Flat roof seam or blister', p: '$400–$1,200' },
  { x: 160, y: 585, n: 7, t: 'Gutter & drip edge', p: '$150–$500' },
];
const house = `<svg viewBox="0 200 1200 560" width="1200" height="560" style="display:block" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe9f7"/><stop offset="1" stop-color="#f4f1ea"/></linearGradient>
  <pattern id="sh" width="44" height="22" patternUnits="userSpaceOnUse"><rect width="44" height="22" fill="#3c4a63"/><path d="M0 21h44M22 0v11M0 11h44M11 11v11M33 11v11" stroke="#2b364b" stroke-width="2"/></pattern></defs>
  <rect width="1200" height="760" fill="url(#sky)"/>
  <!-- main house -->
  <rect x="140" y="470" width="590" height="250" fill="#e9e2d3" stroke="#c8bfae" stroke-width="3"/>
  <polygon points="110,480 430,250 760,480" fill="url(#sh)" stroke="#1f2a3d" stroke-width="4"/>
  <!-- cross gable forming a valley -->
  <polygon points="560,480 680,370 800,480" fill="url(#sh)" stroke="#1f2a3d" stroke-width="4"/>
  <rect x="580" y="480" width="200" height="240" fill="#e2dacb" stroke="#c8bfae" stroke-width="3"/>
  <!-- chimney -->
  <rect x="310" y="270" width="54" height="120" fill="#a4533a"/><rect x="302" y="262" width="70" height="16" fill="#7d3b28"/>
  <path d="M302 392 L372 392" stroke="#9aa4b4" stroke-width="8"/>
  <!-- vent pipe -->
  <rect x="512" y="320" width="16" height="44" fill="#9aa4b4"/><ellipse cx="520" cy="364" rx="20" ry="7" fill="#11161f"/>
  <!-- skylight -->
  <polygon points="398,400 470,355 500,382 428,428" fill="#9fd0ff" stroke="#e9eef6" stroke-width="5"/>
  <!-- missing shingles -->
  <polygon points="228,452 262,428 288,446 254,470" fill="#8a6a4a"/>
  <!-- gutter -->
  <rect x="104" y="478" width="660" height="12" rx="4" fill="#cfd6e2"/><rect x="118" y="490" width="12" height="230" fill="#cfd6e2"/>
  <!-- windows and door -->
  <rect x="200" y="540" width="90" height="90" fill="#bfd7f2" stroke="#fff" stroke-width="6"/><rect x="380" y="540" width="90" height="90" fill="#bfd7f2" stroke="#fff" stroke-width="6"/>
  <rect x="640" y="590" width="70" height="130" fill="#7d4a2b"/>
  <!-- flat-roof extension -->
  <rect x="800" y="540" width="330" height="180" fill="#e9e2d3" stroke="#c8bfae" stroke-width="3"/>
  <rect x="792" y="526" width="346" height="22" fill="#5d6b80"/>
  <path d="M900 537 Q930 527 960 537 Q990 547 1020 537" stroke="#8fb3d9" stroke-width="5" fill="none"/>
  <rect x="890" y="590" width="80" height="80" fill="#bfd7f2" stroke="#fff" stroke-width="6"/>
  <rect x="0" y="720" width="1200" height="40" fill="#9db58a"/>
  <!-- water drops -->
  ${pts.map((p) => `<g><circle cx="${p.x}" cy="${p.y}" r="30" fill="#f4ae2c" stroke="#fff" stroke-width="5"/><text x="${p.x}" y="${p.y + 12}" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="36" fill="#061530">${p.n}</text></g>`).join('')}
</svg>`;
const diagram = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
body, .c { background: #f4f1ea; color: #0a1322; }
.head { padding: 56px 64px 18px; }
h1 { font-size: 64px; }
.legend { margin: 26px 64px 0; display: grid; gap: 8px; }
.legend div { display: grid; grid-template-columns: 62px 1fr auto; align-items: center; gap: 18px; font-size: 39px; font-weight: 750; padding: 6px 0; border-bottom: 2px solid #e2dccf; }
.legend b { width: 56px; height: 56px; border-radius: 50%; background: #f4ae2c; color: #061530; display: grid; place-items: center; font-size: 28px; font-weight: 900; }
.legend span { font-weight: 900; color: #10346f; }
</style></head><body><div class="c">
<div class="head"><span class="kick">Where roofs leak</span><h1>The 7 places NYC roofs leak, and what each costs to fix</h1></div>
${house}
<div class="legend">${pts.map((p) => `<div><b>${p.n}</b>${p.t}<span>${p.p}</span></div>`).join('')}</div>
<div class="brand"><img src="${LOGO}"><span>Average NYC prices, 2026</span><b>(929) 370-1552</b></div>
</div></body></html>`;

// 3. Roof leaking right now? 5 steps
const steps = [
  ['Catch the water', 'Move furniture and valuables, then put buckets and towels under every drip.'],
  ['Mind the electrics', 'Keep away from wet light fixtures and outlets. Switch off that circuit if water is near them.'],
  ['Relieve a bulging ceiling', 'If the ceiling sags with water, a small hole at the lowest point lets it drain into a bucket.'],
  ['Take photos', 'Photograph the stains, the drip and any damage for your insurance company.'],
  ['Stay off the roof and call', 'Wet roofs are dangerous. Call a licensed roofer to stop the water the same day.'],
];
const now = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
body, .c { background: radial-gradient(circle at 80% 0%, #1d4b96 0%, #061530 60%); color: #fff; }
.head { padding: 64px 64px 0; }
.kick { color: #ff8d7e; } .kick::before { background: #ff8d7e; }
.sub { color: #c8d3e8; }
.list { margin: 44px 64px 0; display: grid; gap: 20px; }
.list div { display: grid; grid-template-columns: 80px 1fr; gap: 26px; align-items: start; padding: 28px 30px; border-radius: 22px; background: rgba(255,255,255,.08); border: 1.5px solid rgba(255,255,255,.14); }
.list b { width: 72px; height: 72px; border-radius: 50%; background: #fbc45a; color: #061530; display: grid; place-items: center; font-size: 38px; font-weight: 900; }
.list strong { display: block; font-size: 44px; font-weight: 900; margin-bottom: 6px; }
.list p { font-size: 34px; line-height: 1.38; color: #dbe4f3; }
.brand { background: #fbc45a; color: #061530; }
.brand b { color: #061530; }
</style></head><body><div class="c">
<div class="head"><span class="kick">Roof leaking right now?</span><h1>Do these 5 things first</h1><p class="sub">Then call a roofer. A small leak gets more expensive with every storm.</p></div>
<div class="list">${steps.map((s, i) => `<div><b>${i + 1}</b><span><strong>${s[0]}</strong><p>${s[1]}</p></span></div>`).join('')}</div>
<div class="brand"><img src="${LOGO}"><span>Emergency roof repair 24/7</span><b>(929) 370-1552</b></div>
</div></body></html>`;

// 4. Repair or replace?
const rr = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
body, .c { background: #f4f1ea; color: #0a1322; }
.head { padding: 64px 64px 0; }
.box { margin: 32px 64px 0; border-radius: 26px; padding: 30px 34px; }
.box h2 { font-size: 52px; font-weight: 900; font-stretch: 112%; display: flex; align-items: center; gap: 16px; margin-bottom: 14px; }
.box h2 i { font-style: normal; width: 58px; height: 58px; border-radius: 50%; display: grid; place-items: center; font-size: 34px; color: #fff; }
.box ul { list-style: none; display: grid; gap: 12px; }
.box li { font-size: 39px; line-height: 1.32; font-weight: 650; padding-left: 34px; position: relative; }
.box li::before { content: ''; position: absolute; left: 0; top: 18px; width: 14px; height: 14px; border-radius: 50%; }
.ok { background: #e7f6ee; border: 3px solid #6cc79b; } .ok h2 i, .ok li::before { background: #138a4d; }
.no { background: #fff4e3; border: 3px solid #f4ae2c; } .no h2 i, .no li::before { background: #d9520b; }
.tie { margin: 30px 64px 0; text-align: center; font-size: 37px; font-weight: 800; color: #10346f; }
</style></head><body><div class="c">
<div class="head"><span class="kick">Repair or replace?</span><h1>Is your leaking roof worth repairing?</h1></div>
<div class="box ok"><h2><i>✓</i>Repair it if</h2><ul>
<li>The roof is under about 15 years old</li><li>The leak is in one area</li><li>The shingles or membrane are still flexible</li><li>The deck feels solid when you walk on it</li></ul></div>
<div class="box no"><h2><i>!</i>Replace it if</h2><ul>
<li>The roof is over 20 years old</li><li>It leaks in several places, or the same leak keeps coming back</li><li>Shingles curl, crack or shed granules across the roof</li><li>The deck feels soft or sags</li></ul></div>
<p class="tie">Not sure? Get both prices<br>with a free roof inspection.</p>
<div class="brand"><img src="${LOGO}"><span>Free roof inspection, NYC</span><b>(929) 370-1552</b></div>
</div></body></html>`;

(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  for (const [name, html, h] of [['roof-leak-repair-cost-nyc-price-chart', chart, 1720], ['where-roofs-leak-diagram-repair-costs', diagram, 1570], ['roof-leaking-what-to-do-first', now, 1640], ['roof-leak-repair-or-replace-guide', rr, 1500]]) {
    const pg = await b.newPage({ viewport: { width: 1200, height: h } });
    const file = path.join(os.tmpdir(), name + '.html');
    fs.writeFileSync(file, html.replace('<div class="c">', `<div class="c" style="--h:${h}px">`));
    await pg.goto('file://' + file); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(150);
    await pg.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 84 });
    console.log('ok', name);
    await pg.close();
  }
  await b.close();
})();
