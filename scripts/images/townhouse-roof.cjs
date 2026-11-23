// Renders the infographics for /service-area/brooklyn-ny/townhouse-roof-replacement/
// as JPGs in public/images/guides/brooklyn-townhouse-roof/. Prices: the Brooklyn
// 1,000 sq ft flat roof range in src/data/costs.ts ($6,500–$17,000), scaled by
// roof size. Then run python3 scripts/images/add-metadata.py. From the repo root:
//   PW=$(npm root -g)/playwright node scripts/images/townhouse-roof.cjs
const { chromium } = require(process.env.PW);
const path = require('path');
const fs = require('fs');
const os = require('os');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'public/images/guides/brooklyn-townhouse-roof');
fs.mkdirSync(OUT, { recursive: true });
const f = (p) => 'file://' + path.join(ROOT, p);
const FONT = f('node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2');
const LOGO = f('public/wp-content/uploads/2024/10/AlterPhase-Logo-Full-Siding.png');
const $ = (n) => '$' + (Math.round(n / 100) * 100).toLocaleString('en-US');

const base = `
@font-face { font-family: Archivo; src: url('${FONT}') format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1200px; overflow: hidden; font-family: Archivo, sans-serif; }
.c { position: relative; width: 1200px; height: var(--h); overflow: hidden; background: #f4f1ea; color: #0a1322; }
.head { padding: 64px 64px 0; }
.kick { display: inline-flex; align-items: center; gap: 12px; font-size: 30px; font-weight: 850; letter-spacing: .14em; text-transform: uppercase; color: #b07d10; }
.kick::before { content: ''; width: 42px; height: 4px; background: #f4ae2c; }
h1 { font-size: 70px; line-height: 1.03; font-weight: 900; font-stretch: 114%; letter-spacing: -0.02em; margin-top: 14px; }
.sub { font-size: 33px; line-height: 1.35; margin-top: 16px; font-weight: 600; color: #4a5568; }
.brand { position: absolute; left: 0; right: 0; bottom: 0; height: 130px; display: flex; align-items: center; justify-content: space-between; padding: 0 56px; background: #061530; color: #fff; font-size: 30px; font-weight: 800; }
.brand img { height: 66px; background: #fff; border-radius: 14px; padding: 8px 12px; }
.brand b { color: #fbc45a; font-size: 38px; font-stretch: 110%; }
.note { margin: 30px 64px 0; padding: 26px 32px; border-radius: 22px; background: #10346f; color: #fff; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.note small { font-size: 30px; font-weight: 700; color: #c8d3e8; display: block; }
.note strong { font-size: 58px; font-weight: 900; color: #fbc45a; font-stretch: 112%; }
.note em { font-style: normal; font-size: 30px; font-weight: 800; text-align: right; line-height: 1.3; }
`;
const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>${base}</style></head><body><div class="c">${body}<div class="brand"><img src="${LOGO}"><span>alterphaseroofing.com</span><b>(929) 370-1552</b></div></div></body></html>`;

// 1. Cost by roof size (Brooklyn: $6.50–$17 per sq ft for a full flat roof replacement).
const sizes = [
  { s: 600, t: 'Narrow row house', d: 'about 16 ft wide' },
  { s: 800, t: 'Typical row house', d: 'about 18–20 ft wide' },
  { s: 1000, t: 'Brownstone', d: 'about 20 × 50 ft' },
  { s: 1200, t: 'Wide brownstone or two-family', d: 'about 25 ft wide' },
];
const cost = `
<style>
.grid { margin: 40px 64px 0; display: grid; gap: 20px; }
.sz { background: #fff; border-radius: 24px; padding: 24px 32px; box-shadow: 0 6px 20px rgba(10,25,55,.08); display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.sz h2 { font-size: 42px; font-weight: 900; font-stretch: 110%; }
.sz p { font-size: 30px; font-weight: 650; color: #6b7280; margin-top: 4px; }
.sz b { font-size: 46px; font-weight: 900; color: #10346f; font-stretch: 108%; white-space: nowrap; }
</style>
<div class="head"><span class="kick">Brooklyn townhouse roofs · 2026</span>
<h1>Townhouse roof replacement cost in Brooklyn</h1>
<p class="sub">Full flat roof replacement with tear-off, from our average prices on hundreds of Brooklyn townhouse, row house and brownstone roofs.</p></div>
<div class="grid">${sizes.map((x) => `<div class="sz"><div><h2>${x.s.toLocaleString('en-US')} sq ft roof</h2><p>${x.t} · ${x.d}</p></div><b>${$(x.s * 6.5)}–${$(x.s * 17)}</b></div>`).join('')}</div>
<div class="note"><span><small>Most townhouse roof repairs</small><strong>$400–$1,200</strong></span><em>Free inspection<br>Written price in 24 hrs</em></div>`;

// 2. Anatomy of a Brooklyn townhouse roof: cross-section with numbered parts.
const parts = [
  ['Parapet wall and coping', 'Cracked coping lets water into the walls below.'],
  ['Base and counter flashing', 'Seals the roof to the parapet. The most common leak point.'],
  ['Party-wall flashing', "Ties your roof to your neighbors' roofs."],
  ['Roof membrane', 'EPDM, TPO or modified bitumen, lasting 20–30 years.'],
  ['Tapered insulation', 'Slopes the roof toward the drain at the back.'],
  ['Roof deck', 'Wood planks or plywood, replaced where rotted.'],
  ['Roof hatch or skylight', 'Needs its own curb flashing.'],
  ['Drain, scupper and leader', 'Clogged drains cause ponding and leaks.'],
];
const dot = (x, y, n) => `<g><circle cx="${x}" cy="${y}" r="27" fill="#f4ae2c" stroke="#061530" stroke-width="4"/><text x="${x}" y="${y + 11}" text-anchor="middle" font-size="32" font-weight="900" fill="#061530">${n}</text></g>`;
const svg = `<svg viewBox="0 0 1072 560" width="1072" height="560" xmlns="http://www.w3.org/2000/svg" font-family="Archivo">
  <defs><pattern id="brick" width="44" height="22" patternUnits="userSpaceOnUse"><rect width="44" height="22" fill="#c4674a" stroke="#9c4a32" stroke-width="2"/></pattern>
  <pattern id="wall" width="44" height="22" patternUnits="userSpaceOnUse"><rect width="44" height="22" fill="#e8e2d4" stroke="#d3c9b4" stroke-width="2"/></pattern></defs>
  <!-- front parapet wall, seen behind the roof -->
  <rect x="200" y="150" width="672" height="110" fill="url(#brick)"/>
  <rect x="190" y="136" width="692" height="18" fill="#9aa3b2"/>
  <text x="400" y="204" font-size="26" font-weight="900" fill="#fff" text-anchor="middle">Front parapet wall</text>
  <!-- left neighbor: lower roof; right neighbor: same height -->
  <rect x="0" y="352" width="200" height="208" fill="url(#wall)"/>
  <rect x="0" y="336" width="200" height="16" fill="#8a94a6"/>
  <rect x="872" y="290" width="200" height="270" fill="url(#wall)"/>
  <rect x="872" y="258" width="200" height="12" fill="#5d6675"/>
  <rect x="872" y="270" width="200" height="20" fill="#8a94a6"/>
  <!-- your townhouse walls -->
  <rect x="200" y="300" width="672" height="260" fill="url(#wall)"/>
  <rect x="196" y="300" width="8" height="260" fill="#9c4a32"/>
  <rect x="868" y="300" width="8" height="260" fill="#9c4a32"/>
  <!-- roof layers: deck, insulation, membrane -->
  <rect x="200" y="288" width="672" height="14" fill="#a8743f"/>
  <rect x="200" y="266" width="672" height="22" fill="#f0d38a"/>
  <rect x="200" y="256" width="672" height="10" fill="#2b3442"/>
  <!-- base flashing up the front parapet, metal counter flashing -->
  <rect x="200" y="236" width="672" height="22" fill="#2b3442"/>
  <rect x="200" y="230" width="672" height="7" fill="#c7ced9"/>
  <!-- party-wall flashing down to the lower neighbor roof -->
  <polygon points="200,256 210,256 210,302 200,302 176,336 160,336 196,290" fill="#2b3442"/>
  <!-- roof hatch -->
  <rect x="620" y="206" width="100" height="52" fill="#5c6b80"/>
  <rect x="610" y="196" width="120" height="14" fill="#7d8ba0"/>
  <!-- roof drain -->
  <ellipse cx="770" cy="261" rx="26" ry="6" fill="#061530"/>
  <rect x="762" y="266" width="16" height="294" fill="#7d8ba0" opacity=".55"/>
  <text x="100" y="545" font-size="22" font-weight="800" fill="#4a5568" text-anchor="middle">Neighbor</text>
  <text x="972" y="545" font-size="22" font-weight="800" fill="#4a5568" text-anchor="middle">Neighbor</text>
  <text x="480" y="430" font-size="30" font-weight="900" fill="#6b5a3e" text-anchor="middle">Your townhouse</text>
  ${dot(236, 118, 1)}${dot(300, 246, 2)}${dot(150, 300, 3)}${dot(420, 261, 4)}${dot(560, 277, 5)}${dot(300, 318, 6)}${dot(670, 168, 7)}${dot(820, 300, 8)}
</svg>`;
const anatomy = `
<style>
.fig { margin: 30px 64px 0; background: #fff; border-radius: 24px; padding: 10px; box-shadow: 0 6px 20px rgba(10,25,55,.08); }
.legend { margin: 28px 64px 0; display: grid; grid-template-columns: 1fr; gap: 16px; }
.legend div { display: grid; grid-template-columns: 54px 1fr; gap: 18px; align-items: start; }
.legend i { font-style: normal; width: 50px; height: 50px; border-radius: 50%; background: #f4ae2c; display: grid; place-items: center; font-size: 28px; font-weight: 900; border: 3px solid #061530; }
.legend b { font-size: 36px; font-weight: 850; display: block; }
.legend span { font-size: 29px; font-weight: 600; color: #4a5568; }
</style>
<div class="head"><span class="kick">Brooklyn townhouse roofs</span>
<h1>Anatomy of a townhouse roof</h1>
<p class="sub">The 8 parts we check and rebuild on every Brooklyn row house and brownstone roof.</p></div>
<div class="fig">${svg}</div>
<div class="legend">${parts.map(([t, s], i) => `<div><i>${i + 1}</i><p><b>${t}</b><span>${s}</span></p></div>`).join('')}</div>`;

(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  for (const [name, body, h] of [
    ['townhouse-roof-replacement-cost-brooklyn', cost, 1500],
    ['townhouse-roof-anatomy-brooklyn-row-house', anatomy, 1880],
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
