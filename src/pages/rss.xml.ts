// RSS feed of the roofing guides (old WordPress /feed/ URLs redirect here).
import type { APIRoute } from 'astro';
import { posts } from '../lib/content';
import { business, SITE } from '../data/business';

const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const items = (await posts())
    .map((p) => {
      const d = p.data;
      const date = new Date((d.modified || d.published || '2026-01-01') + 'T12:00:00Z').toUTCString();
      return `    <item>
      <title>${esc(d.cardTitle || d.h1)}</title>
      <link>${SITE}${d.path}</link>
      <guid isPermaLink="true">${SITE}${d.path}</guid>
      <pubDate>${new Date((d.published || d.modified || '2026-01-01') + 'T12:00:00Z').toUTCString()}</pubDate>
      <description>${esc(d.description)}</description>
    </item>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(business.name)}: roofing guides</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Roofing costs, materials and repair advice for Staten Island and New York City homeowners.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
