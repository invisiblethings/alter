// Renders Google Business Profile post images (1200x900) from HTML templates.
const { chromium } = require(process.env.PW);
const path = require('path');
const fs = require('fs');
const ROOT = '/home/user/alter';
const OUT = path.join(ROOT, 'marketing/gbp-posts');
fs.mkdirSync(OUT, { recursive: true });
const f = (p) => 'file://' + path.join(ROOT, p);
const FONT = f('node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2');
const LOGO = f('src/assets/logo.png');
const GAF = f('public/images/gaf-master-elite.webp');

const posts = [
  { id: '01-infrared-leak-detection', layout: 'thermal', tag: 'Leak detection', h: 'Hidden leak?<br>We find it.', sub: 'Infrared thermal imaging shows hidden moisture inside your roof and ceilings, so we fix the real source the first time.', pills: ['Hidden leaks found', 'No guesswork', 'Photos of everything'] },
  { id: '02-one-day-roof-replacement', layout: 'photo', img: 'public/wp-content/uploads/2025/04/Replaced-Roof-10305-Staten-Island-10304.jpg', tag: 'Roof replacement · Staten Island', h: 'Most new roofs<br>done in <em>one day</em>.', sub: 'Tear-off to cleanup, with up to 50-year GAF warranties in writing.', pills: ['Free estimate', 'Written price in 24 hrs', 'Spotless cleanup'] },
  { id: '03-gaf-master-elite', layout: 'photo', img: 'src/assets/crew-on-roof.jpg', tag: 'GAF Master Elite®', h: 'Top 2% of<br>US roofers.', sub: 'GAF Master Elite® certified, so we can offer GAF’s strongest warranties of up to 50 years.', pills: ['Licensed & insured', 'Owner on every job', 'Our own crew'], badge: true },
  { id: '04-free-roof-inspection', layout: 'photo', img: 'public/wp-content/uploads/2024/04/AlterPhaseRoofingProjects-14.jpg', tag: 'Free roof inspection', h: 'See your roof<br>like we do.', sub: 'We climb up, scan for hidden moisture and photograph everything. If a repair will do, that’s what we quote.', pills: ['100% free', 'Photo report', 'No pressure'] },
  { id: '05-emergency-roof-repair', layout: 'photo', img: 'public/wp-content/uploads/2025/04/Roof-Tarping-GAF-AlterPhase.jpg', tag: 'Emergency roof repair', h: 'Roof leaking?<br>We answer <em>24/7</em>.', sub: 'Same-day emergency tarping and leak repair across Staten Island and NYC, with damage photos for your insurer.', pills: ['Same-day response', 'Storm damage', 'Insurance photos'], urgent: true },
  { id: '06-customer-review', layout: 'review', img: 'public/wp-content/uploads/2025/05/New-Roof-10314-Staten-Island-NY.jpg', tag: '5.0 stars · 154 reviews', quote: 'My entire new roof was done in one day! They left the property spotless. The owner was courteous, professional and upfront from beginning to end.', who: 'Denise L., Google review' },
  { id: '07-flat-roofing', layout: 'photo', img: 'src/assets/flat-roof-brooklyn-crew.webp', tag: 'Flat roofing · EPDM · TPO', h: 'Flat roofs<br>built to stay dry.', sub: 'New flat roofs and leak repairs for extensions, garages, row houses and brownstones. Drainage fixed so water stops sitting.', pills: ['From $5 / sq ft', 'Free inspection', 'Written warranty'] },
  { id: '08-winter-roof-check', layout: 'photo', img: 'public/wp-content/uploads/2025/04/New-roof-replacement-in-Staten-Island.jpg', tag: 'Before winter hits', h: 'Get your roof<br>winter-ready.', sub: 'Loose shingles, tired flashing and clogged gutters turn into leaks once the snow and nor’easters come. Book a free check now.', pills: ['Free roof check', 'Gutters & flashing', 'Fixed before the snow'] },
  { id: '09-repair-first-promise', layout: 'photo', img: 'public/wp-content/uploads/2024/04/AlterPhase-Roof-Repair-Service.jpg', tag: 'The repair-first promise', h: 'Just a repair?<br>We\u2019ll say so.', sub: 'Most roof repairs cost $300–$1,200. We show you photos and give you both prices when it’s close.', pills: ['Honest advice', 'Repairs from $300', 'Written warranty'] },
];

const css = `
@font-face { font-family: Archivo; src: url('${FONT}') format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1200px; height: 900px; overflow: hidden; font-family: Archivo, sans-serif; color: #fff; background: #061530; }
.c { position: relative; width: 1200px; height: 900px; overflow: hidden; }
.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(6,21,48,.96) 0%, rgba(6,21,48,.88) 38%, rgba(6,21,48,.35) 68%, rgba(6,21,48,.05) 100%); }
.shade2 { position: absolute; inset: auto 0 0 0; height: 220px; background: linear-gradient(0deg, rgba(6,21,48,.95), rgba(6,21,48,0)); }
.logo { position: absolute; top: 44px; left: 160px; background: #fff; border-radius: 18px; padding: 12px 18px; }
.logo img { display: block; height: 72px; }
.txt { position: absolute; left: 160px; top: 196px; width: 880px; }
.tag { display: inline-flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #fbc45a; }
.tag::before { content: ''; width: 36px; height: 3px; background: #fbc45a; }
h1 { margin-top: 18px; font-size: 72px; line-height: .98; font-weight: 900; font-stretch: 116%; letter-spacing: -0.02em; }
h1 em { font-style: normal; color: #fbc45a; }
.sub { margin-top: 22px; font-size: 27px; line-height: 1.38; color: #dbe4f3; max-width: 620px; }
.pills { position: absolute; left: 160px; bottom: 118px; display: flex; gap: 12px; }
.pills span { display: inline-flex; align-items: center; gap: 8px; padding: 10px 17px; border-radius: 999px; background: rgba(255,255,255,.12); border: 1.5px solid rgba(255,255,255,.28); font-size: 19px; font-weight: 700; backdrop-filter: blur(6px); }
.pills span::before { content: '\\2713'; color: #fbc45a; font-weight: 900; }
.bar { position: absolute; left: 0; right: 0; bottom: 0; height: 88px; background: #fbc45a; color: #0a1322; display: flex; align-items: center; justify-content: space-between; padding: 0 160px; font-size: 20px; font-weight: 800; }
.bar .stars { color: #0a1322; letter-spacing: 2px; margin-right: 10px; }
.bar .gaf { display: flex; align-items: center; gap: 12px; }
.bar .gaf img { height: 52px; }
.bar .web { font-size: 22px; font-weight: 900; font-stretch: 108%; }
.urgent .bar { background: #fbc45a; }
.urgent .tag { color: #ff8d7e; } .urgent .tag::before { background: #ff8d7e; }
.bigbadge { position: absolute; right: 160px; bottom: 112px; width: 210px; filter: drop-shadow(0 20px 40px rgba(0,0,0,.45)); }
/* thermal layout: decorative heat-map field, not a real scan */
.thermal { background: radial-gradient(circle at 70% 46%, #fff3a8 0%, #ffcf3f 9%, #ff7a1a 19%, #e2315b 30%, #8a1f8f 42%, #3a1f86 55%, #10216b 68%, #061530 82%); }
.thermal .grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px); background-size: 60px 60px; }
.thermal .shade { background: linear-gradient(90deg, rgba(6,21,48,.97) 0%, rgba(6,21,48,.9) 45%, rgba(6,21,48,.2) 75%, rgba(6,21,48,0) 100%); }
.reticle { position: absolute; left: calc(70% - 110px); top: calc(46% - 110px); width: 220px; height: 220px; border: 3px solid rgba(255,255,255,.85); border-radius: 50%; }
.reticle::before, .reticle::after { content: ''; position: absolute; background: rgba(255,255,255,.85); }
.reticle::before { left: 50%; top: -40px; bottom: -40px; width: 3px; transform: translateX(-50%); }
.reticle::after { top: 50%; left: -40px; right: -40px; height: 3px; transform: translateY(-50%); }
.scale { position: absolute; right: 160px; top: 210px; width: 22px; height: 420px; border-radius: 11px; background: linear-gradient(#fff3a8, #ffcf3f, #ff7a1a, #e2315b, #8a1f8f, #3a1f86, #10216b); border: 2px solid rgba(255,255,255,.6); }
/* review layout */
.review .shade { background: rgba(6,21,48,.55); }
.card { position: absolute; left: 160px; right: 160px; top: 250px; background: #fff; color: #0a1322; border-radius: 30px; padding: 46px 54px; box-shadow: 0 40px 90px rgba(0,0,0,.45); }
.card .st { color: #f4ae2c; font-size: 44px; letter-spacing: 6px; }
.card q { display: block; margin-top: 14px; font-size: 32px; line-height: 1.32; font-weight: 750; quotes: '\\201C' '\\201D'; }
.card .who { margin-top: 22px; font-size: 24px; font-weight: 700; color: #4a5568; }
.review .tag { position: absolute; left: 160px; top: 196px; }
`;

const bar = (p) => `<div class="bar"><span><span class="stars">★★★★★</span>5.0 · 154 reviews</span>${p.badge ? '' : `<span class="gaf"><img src="${GAF}">GAF Master Elite®</span>`}<span class="web">alterphaseroofing.com</span></div>`;
const page = (p) => {
  const pills = p.pills ? `<div class="pills">${p.pills.map((x) => `<span>${x}</span>`).join('')}</div>` : '';
  let inner = '';
  if (p.layout === 'photo') inner = `<img class="bg" src="${f(p.img)}"><div class="shade"></div><div class="shade2"></div>${p.badge ? `<img class="bigbadge" src="${GAF}">` : ''}
    <div class="txt"><span class="tag">${p.tag}</span><h1>${p.h}</h1><p class="sub">${p.sub}</p></div>${pills}`;
  if (p.layout === 'thermal') inner = `<div class="grid"></div><div class="reticle"></div><div class="scale"></div><div class="shade"></div>
    <div class="txt"><span class="tag">${p.tag}</span><h1>${p.h}</h1><p class="sub">${p.sub}</p></div>${pills}`;
  if (p.layout === 'review') inner = `<img class="bg" src="${f(p.img)}"><div class="shade"></div><span class="tag">${p.tag}</span>
    <div class="card"><div class="st">★★★★★</div><q>${p.quote}</q><div class="who">${p.who}</div></div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="c ${p.layout} ${p.urgent ? 'urgent' : ''}">${inner}<div class="logo"><img src="${LOGO}"></div>${bar(p)}</div></body></html>`;
};

(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const pg = await b.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
  for (const p of posts) {
    const file = path.join(require('os').tmpdir(), 'gbp-' + p.id + '.html');
    fs.writeFileSync(file, page(p));
    await pg.goto('file://' + file); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(150);
    await pg.screenshot({ path: path.join(OUT, p.id + '.jpg'), type: 'jpeg', quality: 88 });
    console.log('ok', p.id);
  }
  await b.close();
})();
