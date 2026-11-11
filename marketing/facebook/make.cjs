// Renders the Facebook images: roof repair feed post (1080x1350), page cover
// (1640x624) and profile picture (720x720). Run from the repository root:
//   PW=$(npm root -g)/playwright node marketing/facebook/make.cjs
const { chromium } = require(process.env.PW);
const path = require('path');
const fs = require('fs');
const os = require('os');
const ROOT = path.resolve(__dirname, '../..');
const OUT = __dirname;
const f = (p) => 'file://' + path.join(ROOT, p);
const FONT = f('node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2');
const LOGO = f('public/wp-content/uploads/2024/10/AlterPhase-Logo-Full-Siding.png');
const LOGO_SQ = f('public/wp-content/uploads/2024/04/Google-Business-Logo-AlterPhase.png');
const GAF = f('public/images/gaf-master-elite.webp');
const PHONE = '(929) 370-1552';

const base = `
@font-face { font-family: Archivo; src: url('${FONT}') format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Archivo, sans-serif; color: #fff; background: #061530; overflow: hidden; }
.c { position: relative; overflow: hidden; }
.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.gold { color: #fbc45a; }
.stars { color: #fbc45a; letter-spacing: 3px; }
`;

const post = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
body, .c { width: 1080px; height: 1350px; }
.bg { height: 820px; object-position: 50% 30%; }
.fade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(6,21,48,.25) 0%, rgba(6,21,48,0) 25%, rgba(6,21,48,.55) 48%, #061530 61%); }
.logo { position: absolute; top: 44px; left: 56px; background: #fff; border-radius: 20px; padding: 14px 20px; }
.logo img { height: 74px; display: block; }
.badge24 { position: absolute; top: 52px; right: 56px; background: #d23a2b; color: #fff; font-weight: 850; font-size: 24px; padding: 14px 22px; border-radius: 999px; letter-spacing: .02em; box-shadow: 0 10px 30px rgba(0,0,0,.35); }
.txt { position: absolute; left: 64px; right: 64px; top: 676px; }
.tag { display: inline-flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 850; letter-spacing: .14em; text-transform: uppercase; color: #fbc45a; }
.tag::before { content: ''; width: 40px; height: 3px; background: #fbc45a; }
h1 { margin-top: 16px; font-size: 88px; line-height: .98; font-weight: 900; font-stretch: 116%; letter-spacing: -0.02em; }
.grid { margin-top: 34px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.grid div { display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,.08); border: 1.5px solid rgba(255,255,255,.16); border-radius: 18px; padding: 18px 20px; font-size: 26px; font-weight: 750; line-height: 1.2; }
.grid b { flex: none; width: 40px; height: 40px; border-radius: 12px; background: #fbc45a; color: #061530; display: grid; place-items: center; font-size: 24px; }
.cta { position: absolute; left: 64px; right: 64px; bottom: 118px; height: 108px; border-radius: 24px; background: #fbc45a; color: #061530; display: flex; align-items: center; justify-content: center; gap: 22px; font-weight: 900; }
.cta small { font-size: 26px; font-weight: 800; }
.cta strong { font-size: 46px; font-stretch: 112%; letter-spacing: -0.01em; }
.foot { position: absolute; left: 64px; right: 64px; bottom: 40px; display: flex; align-items: center; justify-content: space-between; font-size: 24px; font-weight: 750; color: #c8d3e8; }
.foot span { display: flex; align-items: center; gap: 10px; }
.foot img { height: 48px; }
</style></head><body><div class="c">
  <img class="bg" src="${f('public/wp-content/uploads/2024/04/AlterPhaseRoofingProjects-11.jpg')}"><div class="fade"></div>
  <div class="logo"><img src="${LOGO}"></div>
  <div class="badge24">Emergency repairs 24/7</div>
  <div class="txt">
    <span class="tag">Roof repair · Staten Island</span>
    <h1>Roof leaking?<br>We fix it <span class="gold">right.</span></h1>
    <div class="grid">
      <div><b>✓</b>Infrared leak detection</div>
      <div><b>✓</b>Most repairs $300–$1,200</div>
      <div><b>✓</b>Free inspection + photos</div>
      <div><b>✓</b>Written repair warranty</div>
    </div>
  </div>
  <div class="cta"><small>Call or text</small><strong>${PHONE}</strong></div>
  <div class="foot"><span><span class="stars">★★★★★</span> 5.0 · 157 reviews</span><span><img src="${GAF}"> GAF Master Elite®</span><span>alterphaseroofing.com</span></div>
</div></body></html>`;

// Cover: phones crop the sides (keep content in the centre ~1100px) and the
// desktop profile picture overlaps the bottom-left, so the content is centred.
const cover = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
body, .c { width: 1640px; height: 624px; }
.bg { object-position: 50% 40%; }
.shade { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(6,21,48,.86) 0%, rgba(6,21,48,.8) 45%, rgba(6,21,48,.55) 75%, rgba(6,21,48,.4) 100%); }
.mid { position: absolute; left: 270px; right: 270px; top: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.kick { font-size: 22px; font-weight: 850; letter-spacing: .16em; text-transform: uppercase; color: #fbc45a; }
h1 { margin-top: 16px; font-size: 76px; line-height: 1; font-weight: 900; font-stretch: 116%; letter-spacing: -0.02em; }
.sub { margin-top: 18px; font-size: 28px; color: #dbe4f3; font-weight: 600; }
.row { margin-top: 30px; display: flex; align-items: center; gap: 18px; }
.chip { display: flex; align-items: center; gap: 10px; height: 64px; padding: 0 24px; border-radius: 999px; background: rgba(255,255,255,.1); border: 1.5px solid rgba(255,255,255,.24); font-size: 24px; font-weight: 800; }
.chip img { height: 46px; }
.chip.phone { background: #fbc45a; color: #061530; border-color: #fbc45a; font-size: 30px; font-weight: 900; font-stretch: 110%; }
</style></head><body><div class="c">
  <img class="bg" src="${f('src/assets/crew-on-roof.jpg')}"><div class="shade"></div>
  <div class="mid">
    <span class="kick">Staten Island · Brooklyn · Queens · Manhattan · Bronx</span>
    <h1>Roof repair &amp; new roofs,<br><span class="gold">done right.</span></h1>
    <p class="sub">Family-owned · Most roofs done in 1 day · Free inspections</p>
    <div class="row">
      <span class="chip"><span class="stars">★★★★★</span> 5.0 · 157 reviews</span>
      <span class="chip"><img src="${GAF}"> GAF Master Elite®</span>
      <span class="chip phone">${PHONE}</span>
    </div>
  </div>
</div></body></html>`;

// Profile picture: Facebook shows it as a circle, so the logo sits well inside it.
const profile = `<!doctype html><html><head><meta charset="utf-8"><style>${base}
body, .c { width: 720px; height: 720px; background: #0d326d; }
.ring { position: absolute; inset: 22px; border-radius: 50%; border: 6px solid #fbc45a; z-index: 2; }
.logo { position: absolute; left: 50%; top: 50%; width: 560px; transform: translate(-50%, -46%); }
</style></head><body><div class="c"><div class="ring"></div><img class="logo" src="${LOGO_SQ}"></div></body></html>`;

(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  for (const [name, html, w, h] of [['facebook-post-roof-repair-staten-island', post, 1080, 1350], ['facebook-cover', cover, 1640, 624], ['facebook-profile', profile, 720, 720]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h } });
    const file = path.join(os.tmpdir(), 'fb-' + name + '.html');
    fs.writeFileSync(file, html);
    await pg.goto('file://' + file); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(150);
    await pg.screenshot({ path: path.join(OUT, name + (name === 'facebook-profile' ? '.png' : '.jpg')), ...(name === 'facebook-profile' ? {} : { type: 'jpeg', quality: 90 }) });
    console.log('ok', name);
    await pg.close();
  }
  await b.close();
})();
