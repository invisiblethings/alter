// One-off migration: WordPress/Elementor -> Markdown content collections.
//
// Sources (cached in scripts/migrate/.cache, refetched with --refresh):
//   - WP REST API pages/posts/media (main content without header/footer)
//   - the live rendered HTML of every URL (exact <title>, meta description,
//     robots, canonical, H1 and og:image as Google sees them today)
//
// Launch rule: URL, title, description, H1, headings and body text stay as
// they are. Only site-wide Elementor boilerplate (repeated trust boxes, review
// widget, forms) is dropped because the new templates render their own.

import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const ROOT = path.resolve(import.meta.dirname, '../..');
const CACHE = path.join(import.meta.dirname, '.cache');
const ORIGIN = 'https://alterphaseroofing.com';
const OUT_PAGES = path.join(ROOT, 'src/content/pages');
const OUT_POSTS = path.join(ROOT, 'src/content/posts');
const REFRESH = process.argv.includes('--refresh');

const NOINDEX_LANDING = new Set(['/roofing-lp/', '/vinyl-siding-estimate/', '/roof-replacement-si/']);
const LEGAL = new Set(['/privacy-policy-2/', '/terms-and-conditions/', '/accessibility-statement/']);
// Rendered by dedicated templates; their copy is reproduced there by hand.
const CUSTOM = new Set(['/', '/blog/', '/category/roofing/', '/category/roofing/roofing-101/']);

// ---------- fetch helpers ----------
async function cached(file, url) {
  const p = path.join(CACHE, file);
  if (!REFRESH && fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
  const res = await fetch(url, { headers: { 'user-agent': 'AlterPhaseMigration/1.0' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const text = await res.text();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, text);
  return text;
}
const fileKey = (p) => (p === '/' ? 'index' : p.replace(/^\/|\/$/g, '').replace(/\//g, '__'));

// ---------- text helpers ----------
const squash = (s) => (s || '').replace(/\s+/g, ' ').trim();
const decode = (s) => cheerio.load(`<i>${s}</i>`)('i').text();
const yamlStr = (s) => JSON.stringify(s ?? '');
const relUrl = (href) => {
  if (!href) return href;
  if (href.startsWith(ORIGIN + '/wp-content/')) return href.slice(ORIGIN.length);
  if (href.startsWith(ORIGIN)) {
    const u = new URL(href);
    return u.pathname + u.search + u.hash;
  }
  return href;
};

// LuckyWP Table of Contents id scheme, so old #fragments keep resolving.
export const tocId = (text) =>
  squash(text)
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s+/g, '_');

// ---------- hand-coded "apr-*" HTML sections (newer pages) ----------
// Hero chrome, trust bars, inline forms and CTA blocks duplicate what the new
// templates render, so they go; content blocks are rewritten to plain HTML.
const APR_DROP = [
  '.apr-hero-eyebrow', '.apr-hero-badges', '.apr-hero-ctas', '.apr-trust-bar', '.apr-form-wrap',
  '.apr-cta-block', '.apr-inline-cta', '.apr-emergency-banner', '.apr-section-label', '.apr-step-num',
  '.apr-cta-buttons', '.apr-divider', '.apr-feature-cta', '[class*="-icon"]', '.apr-form-trust-row',
].join(', ');

function normalizeCustom($, $el, ctx) {
  $el.find('.apr-hero-sub').each((_, s) => {
    if (!ctx.intro) ctx.intro = squash($(s).text());
    $(s).remove();
  });
  $el.find(APR_DROP).remove();
  $el.find('a.apr-btn, a.apr-btn-primary, a.apr-btn-outline').each((_, a) => {
    const href = $(a).attr('href') || '';
    if (href.startsWith('tel:') || /free-estimate|#/.test(href)) $(a).remove();
  });
  $el.find('.apr-faq-item').each((_, item) => {
    const q = squash($(item).find('.apr-faq-q').text());
    const a = $(item).find('.apr-faq-a').html() || '';
    $(item).replaceWith(`<h3>${q}</h3>${a}`);
  });
  $el.find('.apr-cost-grid').each((_, g) => {
    const rows = $(g).find('.apr-cost-card').map((_, c) =>
      `<tr><td>${squash($(c).find('.apr-cost-type').text())}</td><td>${squash($(c).find('.apr-cost-range').text())}</td><td>${squash($(c).find('.apr-cost-note').text())}</td></tr>`).get();
    $(g).replaceWith(`<table><thead><tr><th>Service</th><th>Typical cost</th><th>What's included</th></tr></thead><tbody>${rows.join('')}</tbody></table>`);
  });
  $el.find('.apr-areas-list').each((_, l) => {
    const items = $(l).find('.apr-area-tag').map((_, t) => `<li>${squash($(t).text())}</li>`).get();
    $(l).replaceWith(`<ul>${items.join('')}</ul>`);
  });
  $el.find('.apr-related-grid').each((_, g) => {
    const items = $(g).find('a').map((_, a) => `<li><a href="${$(a).attr('href')}">${squash($(a).text())}</a></li>`).get();
    $(g).replaceWith(`<ul>${items.join('')}</ul>`);
  });
  return $el;
}

// ---------- Elementor widget walker ----------
const SKIP_WIDGETS = new Set([
  'form.default', 'template.default', 'counter.default', 'divider.default', 'google_maps.default',
  'social-icons.default', 'rating.default', 'theme-archive-title.default', 'posts.cards', 'posts.classic',
]);

function widgetSignature($, el) {
  return squash($(el).text()).toLowerCase().slice(0, 160);
}

function cleanFragment($, $el) {
  $el.find('h1 br, h2 br, h3 br, h4 br, h5 br, h6 br').replaceWith(' ');
  $el.find('script, style, form, iframe, noscript, svg, input, button, select, label, link, meta, title').remove();
  $el.find('[class*="ti-widget"], .trustindex, [class*="trustindex"]').remove();
  $el.find('img').each((_, img) => {
    const $img = $(img);
    const src = $img.attr('data-src') || $img.attr('src');
    if (!src || src.startsWith('data:')) return void $img.remove();
    $img.attr('src', relUrl(src));
    for (const a of ['srcset', 'sizes', 'class', 'data-src', 'loading', 'decoding', 'style', 'fetchpriority']) $img.removeAttr(a);
  });
  $el.find('a').each((_, a) => {
    const $a = $(a);
    const href = $a.attr('href') || '';
    if (/tel:/i.test(href)) $a.attr('href', `tel:+1${href.replace(/\D/g, '').slice(-10)}`);
    else $a.attr('href', relUrl(href));
    for (const attr of Object.keys(a.attribs)) if (!['href', 'title', 'rel', 'target'].includes(attr)) $a.removeAttr(attr);
  });
  return $el;
}

function elementorToHtml($, rootSel, boilerplate, ctx) {
  const out = [];
  const widgets = $(rootSel).find('[data-widget_type]').filter((_, el) => $(el).parents('[data-widget_type]').length === 0);
  let lastParent = null;
  let cardRun = [];
  const flushCards = () => {
    if (cardRun.length) out.push(cardRun.join('\n'));
    cardRun = [];
  };

  widgets.each((_, el) => {
    const type = $(el).attr('data-widget_type');
    const $w = $(el);
    if (SKIP_WIDGETS.has(type)) return;
    const sig = widgetSignature($, el);
    if (!sig && type !== 'image.default' && type !== 'image-carousel.default') return;
    if (/trustindex|based on \d+ reviews/.test(sig)) return;
    if (boilerplate.has(sig)) return;

    const parent = $w.parent().closest('.e-con, .elementor-column, section').get(0) || null;
    if (parent !== lastParent) flushCards();
    lastParent = parent;

    switch (type) {
      case 'heading.default':
      case 'animated-headline.default': {
        $w.find('br').replaceWith(' ');
        const h = $w.find('h1,h2,h3,h4,h5,h6').first();
        const tag = h.length ? h.get(0).tagName : 'h2';
        const text = squash((h.length ? h : $w).text());
        if (!text) return;
        if (tag === 'h1') { ctx.h1s.push(text); return; }
        flushCards();
        out.push(`<${tag}>${text}</${tag}>`);
        return;
      }
      case 'text-editor.default':
      case 'html.default': {
        const $c = $w.find('.elementor-widget-container').first();
        const $frag = cleanFragment($, normalizeCustom($, $c.length ? $c : $w, ctx));
        $frag.find('script[type="application/ld+json"]').remove();
        // Inner H1s (custom HTML heroes) become the page intro heading level 2.
        $frag.find('h1').each((_, h) => {
          ctx.h1s.push(squash($(h).text()));
          h.tagName = 'h2';
        });
        const html = $frag.html();
        if (squash(cheerio.load(html || '').text())) { flushCards(); out.push(html); }
        return;
      }
      case 'icon-box.default':
      case 'image-box.default': {
        $w.find('.elementor-icon-box-title br, .elementor-image-box-title br').replaceWith(' ');
        const $t = $w.find('.elementor-icon-box-title, .elementor-image-box-title').first();
        const $d = $w.find('.elementor-icon-box-description, .elementor-image-box-description').first();
        const tTag = $t.length ? $t.get(0).tagName : 'h3';
        const title = squash($t.text());
        const link = relUrl($t.find('a').attr('href') || $w.find('a').attr('href'));
        const desc = $d.length ? cleanFragment($, $d).html() : '';
        if (tTag === 'h1') { ctx.h1s.push(title); if (desc && !ctx.intro) ctx.intro = squash(cheerio.load(desc).text()); return; }
        if (tTag === 'h2') { flushCards(); out.push(`<h2>${title}</h2>${desc ? `<p>${desc}</p>` : ''}`); return; }
        const heading = /^h[3-6]$/.test(tTag) ? `<${tTag}>${link ? `<a href="${link}">${title}</a>` : title}</${tTag}>` : `<p><strong>${title}</strong></p>`;
        cardRun.push(`${title ? heading : ''}${desc ? `<p>${desc}</p>` : ''}`);
        return;
      }
      case 'call-to-action.default': {
        const $t = $w.find('.elementor-cta__title').first();
        const tTag = $t.length && /^h[1-6]$/.test($t.get(0).tagName) ? $t.get(0).tagName : 'h3';
        const title = squash($t.text());
        const desc = squash($w.find('.elementor-cta__description').text());
        const $b = $w.find('a.elementor-cta__button, a').first();
        const href = relUrl($b.attr('href'));
        const btn = squash($b.text());
        cardRun.push(`<${tTag}>${href ? `<a href="${href}">${title}</a>` : title}</${tTag}>${desc ? `<p>${desc}</p>` : ''}${href && btn ? `<p><a href="${href}">${btn}</a></p>` : ''}`);
        return;
      }
      case 'flip-box.default': {
        const title = squash($w.find('.elementor-flip-box__layer__title').first().text());
        const sub = squash($w.find('.elementor-flip-box__layer__description').first().text());
        const bg = ($w.find('.elementor-flip-box__front').attr('style') || '').match(/url\(([^)]+)\)/);
        ctx.projects.push({ title, location: sub, image: bg ? relUrl(bg[1].replace(/['"]/g, '')) : null });
        return;
      }
      case 'icon-list.default': {
        const items = $w.find('.elementor-icon-list-item').map((_, li) => {
          const t = squash($(li).find('.elementor-icon-list-text').text() || $(li).text());
          const href = relUrl($(li).find('a').attr('href'));
          return t ? (href ? `<li><a href="${href}">${t}</a></li>` : `<li>${t}</li>`) : null;
        }).get().filter(Boolean);
        // One short item = an Elementor "eyebrow" label, not content.
        if (items.length <= 1 && sig.length < 40) return;
        flushCards();
        out.push(`<ul>${items.join('')}</ul>`);
        return;
      }
      case 'image.default': {
        const $img = $w.find('img').first();
        const src = relUrl($img.attr('data-src') || $img.attr('src'));
        if (!src || src.startsWith('data:') || /logo/i.test(src)) return;
        flushCards();
        out.push(`<p><img src="${src}" alt="${($img.attr('alt') || '').replace(/"/g, '&quot;')}"></p>`);
        return;
      }
      case 'image-carousel.default': {
        const imgs = $w.find('img').map((_, i) => {
          const src = relUrl($(i).attr('data-src') || $(i).attr('src'));
          return src && !src.startsWith('data:') ? `<img src="${src}" alt="${($(i).attr('alt') || '').replace(/"/g, '&quot;')}">` : null;
        }).get().filter(Boolean);
        if (imgs.length) { flushCards(); out.push(`<p>${imgs.join(' ')}</p>`); }
        return;
      }
      case 'button.default': {
        const $a = $w.find('a').first();
        const href = relUrl($a.attr('href'));
        const text = squash($a.text());
        if (!href || !text || href.startsWith('tel:') || /free-estimate|#/.test(href)) return;
        cardRun.length ? cardRun.push(`<p><a href="${href}">${text}</a></p>`) : out.push(`<p><a href="${href}">${text}</a></p>`);
        return;
      }
      case 'nested-accordion.default': {
        flushCards();
        $w.find('details, .e-n-accordion-item').each((_, d) => {
          const q = squash($(d).find('summary, .e-n-accordion-item-title').first().text());
          const $a = $(d).find('[role="region"], .e-con').first();
          const a = squash($a.text());
          if (q && a) { ctx.faq.push({ q, a }); out.push(`<h3>${q}</h3><p>${a}</p>`); }
        });
        return;
      }
      default:
        ctx.warnings.push(`unhandled widget ${type}`);
    }
  });
  flushCards();
  return out.join('\n');
}

// ---------- Markdown ----------
const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced', emDelimiter: '*' });
td.use(gfm);
td.keep(['figure', 'figcaption', 'mark', 'iframe']);
td.remove(['script', 'style', 'noscript', 'form']);
td.addRule('cleanFigure', {
  filter: (node) => node.nodeName === 'FIGURE',
  replacement: (content, node) => {
    const img = node.querySelector('img');
    const cap = node.querySelector('figcaption');
    if (!img) return content;
    const alt = (img.getAttribute('alt') || '').replace(/\]/g, '');
    const md = `![${alt}](${img.getAttribute('src')})`;
    return `\n\n${md}${cap ? `\n*${squash(cap.textContent)}*` : ''}\n\n`;
  },
});

function toMarkdown(html) {
  let md = td.turndown(html || '');
  md = md
    .replace(/ /g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s*\*\*\s*\*\*\s*$/gm, '')
    .replace(/^#+\s*$/gm, '')
    // Decorative emoji-only lines from icon slots.
    .replace(/^[\p{Extended_Pictographic}\uFE0F\u200d\s✓✔★]+$/gmu, '')
    .replace(/^(#+ )\*\*(.+?)\*\*\s*$/gm, '$1$2')
    // Expired DCA license still printed on some pages; the active one is 2129904-DCWP.
    .replace(/#?2098943(-DCA)?/g, '2129904-DCWP')
    .replace(/\(tel:[^)]*370-?1552\)|\(tel:\+?1?9293701552\)/g, '(tel:+19293701552)')
    .replace(/\(https?:\/\/Home\)/g, '(/)')
    .replace(/^\\?\[\\?\[cost-calculator\\?\]\\?\]$/gm, '<div data-widget="cost-calculator"></div>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return md + '\n';
}

// ---------- head meta from the live page ----------
function liveMeta(html) {
  const $ = cheerio.load(html);
  // <br> inside headings separates words visually; keep that as a space.
  $('h1 br, h2 br, h3 br, title br').replaceWith(' ');
  const m = (sel, attr = 'content') => $(sel).first().attr(attr) || '';
  const ld = $('script[type="application/ld+json"]').map((_, s) => $(s).html()).get();
  const faq = [];
  for (const raw of ld) {
    try {
      const data = JSON.parse(raw);
      const nodes = [data, ...(data['@graph'] || [])].flat();
      for (const n of nodes) {
        if (n && n['@type'] === 'FAQPage') for (const q of n.mainEntity || []) faq.push({ q: squash(q.name), a: squash(cheerio.load(q.acceptedAnswer?.text || '').text()) });
      }
    } catch { /* malformed vendor JSON-LD */ }
  }
  return {
    title: squash($('title').first().text()),
    description: m('meta[name="description"]'),
    robots: m('meta[name="robots"]'),
    canonical: m('link[rel="canonical"]', 'href'),
    h1: squash($('h1').first().text()),
    ogImage: m('meta[property="og:image"]'),
    ogImageAlt: m('meta[property="og:image:alt"]'),
    published: m('meta[property="article:published_time"]'),
    modified: m('meta[property="article:modified_time"]') || m('meta[property="og:updated_time"]'),
    faq,
  };
}

function templateFor(p, isPost) {
  if (p === '/') return 'home';
  if (p === '/blog/' || p.startsWith('/category/')) return 'archive';
  if (isPost) return 'post';
  if (NOINDEX_LANDING.has(p)) return 'landing';
  if (LEGAL.has(p)) return 'legal';
  if (p.startsWith('/service-area/')) return 'location';
  if (['/contact/', '/free-estimate/', '/free-roofing-estimates-brooklyn-ny/'].includes(p)) return 'contact';
  if (p === '/reviews/') return 'reviews';
  if (['/about/', '/how-we-work/', '/careers/'].includes(p)) return 'company';
  return 'service';
}

// ---------- main ----------
const inventory = fs.readFileSync(path.join(ROOT, 'docs/data/url-inventory.csv'), 'utf8')
  .trim().split('\n').slice(1).map((l) => l.split(',')[1]);
const paths = [...new Set([...inventory, '/roof-replacement-si/'])];

const load = (name) => JSON.parse(fs.readFileSync(path.join(CACHE, name), 'utf8'));
const pagesApi = load('pages_1.json');
const postsApi = load('posts_1.json');
const media = [...load('media_1.json'), ...load('media_2.json')];
const mediaById = new Map(media.map((m) => [m.id, m]));
const wpByPath = new Map([...pagesApi, ...postsApi].map((o) => [new URL(o.link).pathname, o]));

// Boilerplate = widget text that appears on 6+ different pages.
const sigPages = new Map();
for (const o of pagesApi) {
  const $ = cheerio.load(o.content.rendered);
  const seen = new Set();
  $('[data-widget_type]').each((_, el) => seen.add(widgetSignature($, el)));
  for (const s of seen) sigPages.set(s, (sigPages.get(s) || 0) + 1);
}
const boilerplate = new Set([...sigPages].filter(([s, n]) => n >= 6 && s).map(([s]) => s));

fs.rmSync(OUT_PAGES, { recursive: true, force: true });
fs.rmSync(OUT_POSTS, { recursive: true, force: true });
fs.mkdirSync(OUT_PAGES, { recursive: true });
fs.mkdirSync(OUT_POSTS, { recursive: true });

const report = [];
for (const p of paths) {
  const html = await cached(`html/${fileKey(p)}.html`, ORIGIN + p);
  const meta = liveMeta(html);
  const wp = wpByPath.get(p);
  const isPost = wp?.type === 'post';
  const ctx = { h1s: [], intro: '', faq: [], projects: [], warnings: [] };
  let body = '';

  if (wp && !CUSTOM.has(p)) {
    const $ = cheerio.load(wp.content.rendered);
    // The NYC cost calculator is rebuilt as a component; keep its position.
    $('#roofingForm').each((_, f) => {
      $('#result').remove();
      $('h3').filter((_, h) => /^estimated cost/i.test(squash($(h).text()))).remove();
      $(f).replaceWith('<p>[[cost-calculator]]</p>');
    });
    if ($('[data-widget_type]').length) {
      body = elementorToHtml($, 'body', boilerplate, ctx);
      // Mixed Gutenberg + Elementor posts: keep the Gutenberg part too.
      if (isPost) {
        $('[data-widget_type]').closest('.elementor').remove();
        const rest = cleanFragment($, normalizeCustom($, $('body'), ctx)).html();
        body = rest + '\n' + body;
      }
    } else {
      const $b = cleanFragment($, normalizeCustom($, $('body'), ctx));
      $b.find('h1').each((_, h) => { ctx.h1s.push(squash($(h).text())); h.tagName = 'h2'; });
      body = $b.html();
    }
  }

  let md = toMarkdown(body);
  // The template prints the H1; drop an identical leading H2 created from a hero H1.
  md = md.replace(new RegExp(`^## ${meta.h1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n`), '');

  const featured = wp?.featured_media ? mediaById.get(wp.featured_media) : null;
  const image = featured ? relUrl(featured.source_url) : meta.ogImage ? relUrl(meta.ogImage) : '';
  const imageAlt = featured ? squash(featured.alt_text) : meta.ogImageAlt;
  const template = templateFor(p, isPost);
  const noindex = /noindex/.test(meta.robots) || NOINDEX_LANDING.has(p);
  const canonical = meta.canonical && meta.canonical !== ORIGIN + p ? relUrl(meta.canonical) : '';
  const slug = isPost ? wp.slug : fileKey(p);

  const fm = [
    '---',
    `path: ${yamlStr(p)}`,
    `template: ${template}`,
    `seoTitle: ${yamlStr(meta.title)}`,
    `description: ${yamlStr(meta.description)}`,
    `h1: ${yamlStr(meta.h1 || (wp ? decode(wp.title.rendered) : ''))}`,
    ctx.intro ? `intro: ${yamlStr(ctx.intro)}` : null,
    image ? `image: ${yamlStr(image)}` : null,
    imageAlt ? `imageAlt: ${yamlStr(imageAlt)}` : null,
    noindex ? 'noindex: true' : null,
    canonical ? `canonical: ${yamlStr(canonical)}` : null,
    wp ? `published: ${yamlStr((meta.published || wp.date_gmt + 'Z').slice(0, 10))}` : null,
    wp ? `modified: ${yamlStr((meta.modified || wp.modified_gmt + 'Z').slice(0, 10))}` : null,
    isPost ? `categories: ${JSON.stringify(wp.categories)}` : null,
    ctx.projects.length ? `projects:\n${ctx.projects.map((x) => `  - title: ${yamlStr(x.title)}\n    location: ${yamlStr(x.location)}${x.image ? `\n    image: ${yamlStr(x.image)}` : ''}`).join('\n')}` : null,
    '---',
    '',
  ].filter((l) => l !== null).join('\n');

  fs.writeFileSync(path.join(isPost ? OUT_POSTS : OUT_PAGES, `${slug}.md`), fm + md);
  report.push({ path: p, template, words: md.split(/\s+/).length, warnings: [...new Set(ctx.warnings)].join('; ') });
}

console.table(report);
