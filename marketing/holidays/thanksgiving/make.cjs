// Renders the Thanksgiving images: Google Business Profile post (1200x900)
// and Facebook feed post (1080x1350), with an autumn house illustration.
//   PW=$(npm root -g)/playwright node marketing/holidays/thanksgiving/make.cjs
const { chromium } = require(process.env.PW);
const path = require('path');
const fs = require('fs');
const os = require('os');
const ROOT = path.resolve(__dirname, '../../..');
const OUT = __dirname;
const f = (p) => 'file://' + path.join(ROOT, p);
const FONT = f('node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2');
const LOGO = f('src/assets/logo.png');
const GAF = f('public/images/gaf-master-elite.webp');

// A maple-style leaf, drawn around (0,0).
const LEAF = 'M0-22 4-12 12-16 9-6 20-6 12 2 16 10 6 7 3 16 0 9-3 16-6 7-16 10-12 2-20-6-9-6-12-16-4-12Z';
const leaf = (x, y, s, r, c) => `<path d="${LEAF}" fill="${c}" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"/><path d="M0 9v12" stroke="${c}" stroke-width="2" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"/>`;
const pumpkin = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-14" cy="0" rx="16" ry="20" fill="#d9661a"/><ellipse cx="14" cy="0" rx="16" ry="20" fill="#d9661a"/><ellipse cx="0" cy="0" rx="18" ry="22" fill="#ef7f22"/><path d="M0-22v44M-14-19c-6 12-6 26 0 38M14-19c6 12 6 26 0 38" stroke="#b84f12" stroke-width="2" fill="none"/><path d="M0-21c0-8 3-12 8-14" stroke="#4d6b2a" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
const tree = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-8 0h16l-3-120h-10z" fill="#4a2c1c"/><path d="M-2-70l-34-30M2-90l30-26" stroke="#4a2c1c" stroke-width="7" stroke-linecap="round"/>
  <circle cx="-40" cy="-130" r="46" fill="#b5361d"/><circle cx="20" cy="-150" r="56" fill="#d9481c"/><circle cx="-10" cy="-200" r="50" fill="#f08c2a"/><circle cx="50" cy="-110" r="40" fill="#f6c343"/><circle cx="-60" cy="-180" r="34" fill="#f6c343"/><circle cx="30" cy="-210" r="34" fill="#d9481c"/></g>`;

const scene = `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2a52"/><stop offset=".5" stop-color="#8c3b3f"/><stop offset=".78" stop-color="#e0703a"/><stop offset="1" stop-color="#f6b25e"/></linearGradient>
  <radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff1b8"/><stop offset=".55" stop-color="#ffc861"/><stop offset="1" stop-color="#ffc861" stop-opacity="0"/></radialGradient>
  <linearGradient id="win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe39a"/><stop offset="1" stop-color="#f6a83a"/></linearGradient>
</defs>
<rect width="800" height="600" fill="url(#sky)"/>
<circle cx="560" cy="380" r="170" fill="url(#sun)" opacity=".9"/>
<path d="M0 450 Q160 380 330 430 T800 400 V600 H0Z" fill="#5a2a2a" opacity=".55"/>
<path d="M0 500 Q220 440 420 480 T800 470 V600 H0Z" fill="#3b2418"/>
${tree(170, 520, 1.15)}${tree(760, 510, .8)}
<!-- house -->
<rect x="400" y="350" width="250" height="170" fill="#ecdcc0"/>
<rect x="400" y="350" width="250" height="10" fill="#d8c4a2"/>
<polygon points="378,356 525,250 672,356" fill="#2b3442"/>
<path d="M412 336H638M440 316H610M466 296H584M494 276H556" stroke="#3d4757" stroke-width="3"/>
<rect x="372" y="352" width="306" height="8" fill="#fbc45a"/>
<rect x="608" y="262" width="26" height="62" fill="#8a3b2a"/><rect x="602" y="256" width="38" height="10" fill="#6f2e20"/>
<circle cx="626" cy="236" r="10" fill="#e9e2d8" opacity=".55"/><circle cx="640" cy="214" r="13" fill="#e9e2d8" opacity=".4"/><circle cx="660" cy="190" r="16" fill="#e9e2d8" opacity=".28"/>
<rect x="425" y="380" width="52" height="46" rx="3" fill="url(#win)" stroke="#fff" stroke-width="5"/><path d="M451 380v46M425 403h52" stroke="#fff" stroke-width="3"/>
<rect x="573" y="380" width="52" height="46" rx="3" fill="url(#win)" stroke="#fff" stroke-width="5"/><path d="M599 380v46M573 403h52" stroke="#fff" stroke-width="3"/>
<rect x="500" y="420" width="50" height="100" rx="4" fill="#7a3b1f"/><circle cx="541" cy="472" r="3.5" fill="#fbc45a"/>
<circle cx="525" cy="448" r="15" fill="none" stroke="#c4471c" stroke-width="7"/><circle cx="525" cy="448" r="15" fill="none" stroke="#f08c2a" stroke-width="3" stroke-dasharray="5 6"/>
<rect x="488" y="518" width="74" height="9" fill="#a89a85"/><rect x="480" y="527" width="90" height="9" fill="#958873"/>
<rect x="645" y="356" width="7" height="166" fill="#fbc45a"/>
${pumpkin(462, 512, 1)}${pumpkin(592, 515, .8)}${pumpkin(625, 520, .55)}
${leaf(740, 160, .9, 45, '#f08c2a')}${leaf(560, 170, .7, 70, '#f6c343')}${leaf(760, 300, .7, -20, '#d9481c')}${leaf(250, 330, .6, 10, '#f08c2a')}${leaf(690, 560, .8, 30, '#f6c343')}${leaf(330, 560, .7, -50, '#d9481c')}${leaf(40, 400, .7, 60, '#f08c2a')}
</svg>`;

const css = `
@font-face { font-family: Archivo; src: url('${FONT}') format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { overflow: hidden; font-family: Archivo, sans-serif; color: #fff; background: #1b1020; }
.c { position: relative; overflow: hidden; }
.scene svg { position: absolute; display: block; }
.logo { position: absolute; background: #fff; border-radius: 18px; padding: 12px 18px; }
.logo img { display: block; height: 72px; }
.tag { display: inline-flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #ffb347; }
.tag::before { content: ''; width: 36px; height: 3px; background: #ffb347; }
h1 { margin-top: 18px; line-height: .98; font-weight: 900; font-stretch: 116%; letter-spacing: -0.02em; }
h1 em { font-style: normal; color: #ffb347; }
.sub { margin-top: 22px; line-height: 1.4; color: #f3e6d8; }
.bar { position: absolute; left: 0; right: 0; bottom: 0; height: 88px; background: #ffb347; color: #241307; display: flex; align-items: center; justify-content: space-between; font-size: 20px; font-weight: 800; }
.bar .gaf { display: flex; align-items: center; gap: 12px; } .bar .gaf img { height: 52px; }
.bar .web { font-size: 22px; font-weight: 900; font-stretch: 108%; }
/* GBP 1200x900: text left, scene right */
.gbp { width: 1200px; height: 900px; }
.gbp .scene svg { right: 0; top: 0; width: 1083px; height: 812px; }
.gbp .shade { position: absolute; inset: 0 0 88px 0; background: linear-gradient(90deg, #1b1020 0%, #1b1020 44%, rgba(27,16,32,.8) 52%, rgba(27,16,32,0) 66%); }
.gbp .logo { top: 44px; left: 160px; }
.gbp .txt { position: absolute; left: 160px; top: 200px; width: 560px; }
.gbp .tag { font-size: 18px; letter-spacing: .1em; }
.gbp h1 { font-size: 64px; } .gbp .sub { font-size: 25px; }
.gbp .bar { padding: 0 160px; }
/* Facebook 1080x1350: text top, scene bottom */
.fb { width: 1080px; height: 1350px; }
.fb .scene svg { left: 0; bottom: 88px; width: 1080px; height: 810px; }
.fb .shade { position: absolute; left: 0; right: 0; top: 0; height: 640px; background: linear-gradient(180deg, #1b1020 0%, #1b1020 72%, rgba(27,16,32,0) 100%); }
.fb .logo { top: 60px; left: 80px; }
.fb .txt { position: absolute; left: 80px; top: 210px; width: 920px; }
.fb .tag { font-size: 24px; }
.fb h1 { font-size: 92px; } .fb .sub { font-size: 31px; max-width: 880px; }
.fb .bar { padding: 0 80px; }
`;
const text = (cls) => `<div class="txt"><span class="tag">Happy Thanksgiving, Staten Island</span>
<h1>Grateful for${cls === 'fb' ? ' ' : '<br>'}our <em>neighbors</em>.</h1>
<p class="sub">Thank you for trusting our family with your homes this year. From all of us at Alter Phase Roofing, have a warm and happy Thanksgiving.</p></div>`;
const bar = `<div class="bar"><span>★★★★★ 5.0 · 157 reviews</span><span class="gaf"><img src="${GAF}">GAF Master Elite®</span><span class="web">alterphaseroofing.com</span></div>`;
const page = (cls) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="c ${cls}"><div class="scene">${scene}</div><div class="shade"></div>${text(cls)}<div class="logo"><img src="${LOGO}"></div>${bar}</div></body></html>`;

(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  for (const [name, cls, w, h] of [['gbp-thanksgiving', 'gbp', 1200, 900], ['facebook-thanksgiving', 'fb', 1080, 1350]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h } });
    const file = path.join(os.tmpdir(), name + '.html');
    fs.writeFileSync(file, page(cls));
    await pg.goto('file://' + file); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(150);
    await pg.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 88 });
    console.log('ok', name);
    await pg.close();
  }
  await b.close();
})();
