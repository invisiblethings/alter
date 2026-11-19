// Facebook post image "Roof Replacement NYC" (1080x1350) with an illustrated
// Empire State Building skyline. Run from the repository root:
//   PW=$(npm root -g)/playwright node marketing/facebook/make-roof-replacement-nyc.cjs
const { chromium } = require(process.env.PW);
const path = require('path');
const fs = require('fs');
const os = require('os');
const ROOT = path.resolve(__dirname, '../..');
const f = (p) => 'file://' + path.join(ROOT, p);
const FONT = f('node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2');
const LOGO = f('public/wp-content/uploads/2024/10/AlterPhase-Logo-Full-Siding.png');
const GAF = f('public/images/gaf-master-elite.webp');

// Deterministic "random" so the lit windows look the same every render.
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// Background skyline: [x, width, height] silhouettes behind and beside the ESB.
const back = [[0,70,330],[62,58,250],[112,80,410],[186,54,300],[232,90,360],[315,62,470],[372,84,330],[452,70,520],[516,96,390],[606,60,300],
  [880,64,430],[938,82,340],[1012,70,500]];
const front = [[0,96,210],[88,74,260],[156,110,190],[262,86,280],[342,120,220],[456,92,300],[540,104,240],[886,90,250],[968,112,200]];
const H = 980; // ground line
const bldg = (arr, fill, lit) => arr.map(([x, w, h]) => {
  let s = `<rect x="${x}" y="${H - h}" width="${w}" height="${h}" fill="${fill}"/>`;
  if (lit) for (let yy = H - h + 18; yy < H - 20; yy += 22) for (let xx = x + 8; xx < x + w - 10; xx += 14) if (rnd() < 0.22) s += `<rect x="${xx}" y="${yy}" width="6" height="9" fill="#ffd27a" opacity="${(0.45 + rnd() * 0.5).toFixed(2)}"/>`;
  return s;
}).join('');

// Empire State Building (centre x 760), drawn from its setbacks up to the mast and antenna.
const cx = 760;
const tier = (w, y1, y2, fill = '#0d1a3a') => `<rect x="${cx - w / 2}" y="${y1}" width="${w}" height="${y2 - y1}" fill="${fill}"/>`;
const stripes = (w, y1, y2, gap = 12) => { let s = ''; for (let x = cx - w / 2 + gap / 2; x < cx + w / 2 - 2; x += gap) s += `<rect x="${x}" y="${y1}" width="2.2" height="${y2 - y1}" fill="#ffd27a" opacity="0.28"/>`; return s; };
const esb = `
  <g>
    ${tier(300, 820, H)}${stripes(300, 830, H, 16)}
    ${tier(250, 730, 820)}${stripes(250, 738, 820, 14)}
    ${tier(176, 330, 730)}${stripes(176, 340, 730, 12)}
    ${tier(150, 300, 330)}${tier(124, 276, 300)}${tier(100, 254, 276)}
    ${stripes(150, 302, 330, 10)}
    ${tier(78, 228, 254, '#1b2b55')}${tier(58, 206, 228, '#24376a')}
    <!-- lit crown -->
    ${tier(78, 228, 254, 'url(#crown)')}${tier(58, 206, 228, 'url(#crown)')}
    <rect x="${cx - 18}" y="150" width="36" height="58" rx="8" fill="url(#crown)"/>
    <rect x="${cx - 14}" y="156" width="2" height="48" fill="#fff6d8" opacity=".7"/><rect x="${cx - 6}" y="156" width="2" height="48" fill="#fff6d8" opacity=".7"/><rect x="${cx + 4}" y="156" width="2" height="48" fill="#fff6d8" opacity=".7"/><rect x="${cx + 12}" y="156" width="2" height="48" fill="#fff6d8" opacity=".7"/>
    <path d="M${cx - 12} 150 Q${cx} 122 ${cx + 12} 150 Z" fill="url(#crown)"/>
    <rect x="${cx - 2.5}" y="40" width="5" height="88" fill="#cfd6e6"/>
    <circle cx="${cx}" cy="40" r="5" fill="#ff5a4e"/>
  </g>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Archivo; src: url('${FONT}') format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body, .c { width: 1080px; height: 1350px; overflow: hidden; font-family: Archivo, sans-serif; color: #fff; background: #061530; }
.c { position: relative; }
svg.scene { position: absolute; inset: 0; }
.logo { position: absolute; top: 46px; left: 56px; background: #fff; border-radius: 20px; padding: 14px 20px; box-shadow: 0 12px 30px rgba(0,0,0,.3); }
.logo img { height: 70px; display: block; }
.tag2026 { position: absolute; top: 60px; right: 56px; padding: 12px 22px; border-radius: 999px; background: rgba(255,255,255,.12); border: 1.5px solid rgba(255,255,255,.3); font-weight: 850; font-size: 24px; letter-spacing: .08em; text-transform: uppercase; backdrop-filter: blur(6px); }
.txt { position: absolute; left: 64px; right: 64px; top: 742px; }
.kick { display: inline-flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 850; letter-spacing: .14em; text-transform: uppercase; color: #fbc45a; }
.kick::before { content: ''; width: 40px; height: 3px; background: #fbc45a; }
h1 { margin-top: 14px; font-size: 78px; line-height: 1; font-weight: 900; font-stretch: 118%; letter-spacing: -0.03em; }
h1 span { display: block; color: #fbc45a; font-size: 168px; line-height: .86; letter-spacing: -0.02em; text-shadow: 0 10px 40px rgba(244,174,44,.35); }
.sub { margin-top: 20px; font-size: 29px; line-height: 1.32; color: #dbe4f3; font-weight: 600; max-width: 900px; }
.cta { position: absolute; left: 64px; right: 64px; bottom: 112px; height: 96px; border-radius: 24px; background: #fbc45a; color: #061530; display: flex; align-items: center; justify-content: space-between; padding: 0 34px; font-weight: 900; box-shadow: 0 18px 40px rgba(251,196,90,.25); }
.cta b { font-size: 34px; font-stretch: 110%; }
.cta span { font-size: 26px; font-weight: 800; }
.foot { position: absolute; left: 64px; right: 64px; bottom: 38px; display: flex; align-items: center; justify-content: space-between; font-size: 23px; font-weight: 750; color: #c8d3e8; }
.foot span { display: flex; align-items: center; gap: 10px; }
.foot img { height: 46px; }
.stars { color: #fbc45a; letter-spacing: 3px; }
</style></head><body><div class="c">
<svg class="scene" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#050f26"/><stop offset=".38" stop-color="#0d2556"/><stop offset=".62" stop-color="#3a3f7a"/><stop offset=".75" stop-color="#b8644a"/><stop offset=".82" stop-color="#f2a84a"/>
    </linearGradient>
    <linearGradient id="crown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2c2"/><stop offset="1" stop-color="#f4ae2c"/></linearGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
    <radialGradient id="moon"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#ffe7b0"/></radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#061530" stop-opacity="0"/><stop offset=".28" stop-color="#061530" stop-opacity=".88"/><stop offset="1" stop-color="#061530"/></linearGradient>
  </defs>
  <rect width="1080" height="1350" fill="url(#sky)"/>
  <g fill="#fff">${Array.from({ length: 70 }, () => `<circle cx="${(rnd() * 1080).toFixed(0)}" cy="${(rnd() * 520).toFixed(0)}" r="${(0.6 + rnd() * 1.4).toFixed(1)}" opacity="${(0.3 + rnd() * 0.6).toFixed(2)}"/>`).join('')}</g>
  <circle cx="210" cy="250" r="54" fill="url(#moon)" opacity=".95"/>
  <circle cx="${cx}" cy="185" r="170" fill="url(#halo)"/>
  ${bldg(back, '#16244b', true)}
  ${esb}
  ${bldg(front, '#0a1633', true)}
  <rect x="0" y="${H}" width="1080" height="${1350 - H}" fill="#061530"/>
  <rect x="0" y="600" width="1080" height="750" fill="url(#fade)"/>
</svg>
<div class="logo"><img src="${LOGO}"></div>
<div class="tag2026">2026 Guide</div>
<div class="txt">
  <span class="kick">Costs · Permits · Free estimate</span>
  <h1>Roof Replacement<span>NYC</span></h1>
  <p class="sub">What a new roof costs in Manhattan, Brooklyn, Queens, the Bronx and Staten Island, and whether you need a permit.</p>
</div>
<div class="cta"><b>Read the free guide</b><span>alterphaseroofing.com</span></div>
<div class="foot"><span><span class="stars">★★★★★</span> 5.0 · 157 reviews</span><span><img src="${GAF}"> GAF Master Elite®</span><span>(929) 370-1552</span></div>
</div></body></html>`;

(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const file = path.join(os.tmpdir(), 'fb-roof-replacement-nyc.html');
  fs.writeFileSync(file, html);
  await pg.goto('file://' + file); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(150);
  await pg.screenshot({ path: path.join(__dirname, 'facebook-post-roof-replacement-nyc.jpg'), type: 'jpeg', quality: 90 });
  await b.close();
  console.log('ok');
})();
