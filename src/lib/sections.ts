// Turns a page's rendered Markdown into designed sections, so service,
// area and company pages read like landing pages instead of articles.
// Each <h2> starts a section. Lists get layout classes based on their shape:
//   - every item opens with <strong> → "features" (tile grid)
//   - short plain items           → "ticks" (two-column checklist)
export interface Section { id: string; title: string; body: string; wide: boolean; lead: boolean }

const ulRe = /<ul>([\s\S]*?)<\/ul>/g;
const liRe = /<li>([\s\S]*?)<\/li>/g;

function styleLists(html: string): string {
  return html.replace(ulRe, (whole, inner: string) => {
    const items = [...inner.matchAll(liRe)].map((m) => m[1].trim());
    if (items.length < 2) return whole;
    if (items.every((i) => i.startsWith('<strong>'))) return `<ul class="features">${inner.replace(/(<\/a>)?[:.]?<\/strong>\s*[,:;–—-]?\s*/g, '$1</strong>')}</ul>`;
    if (items.every((i) => i.replace(/<[^>]+>/g, '').length <= 110)) return `<ul class="ticks-list">${inner}</ul>`;
    return whole;
  });
}

export function toSections(html: string): Section[] {
  const parts = styleLists(html).split(/(?=<h2[\s>])/);
  return parts
    .map((part, i) => {
      const m = part.match(/^<h2([^>]*)>([\s\S]*?)<\/h2>/);
      const id = m?.[1].match(/id="([^"]+)"/)?.[1] || `s${i}`;
      const title = m ? m[2] : '';
      const body = m ? part.slice(m[0].length).trim() : part.trim();
      // Grids, tables and accordions need the full width; prose sits beside its heading.
      const wide = /class="(card-grid|faq|table-wrap|features)/.test(body) || /<table/.test(body);
      return { id, title, body, wide, lead: !m };
    })
    .filter((s) => s.title || s.body);
}
