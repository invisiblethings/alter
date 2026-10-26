// llms.txt (https://llmstxt.org): a plain-text briefing for AI assistants and
// answer engines. It is built entirely from the site's own data (business
// facts, prices, areas, reviews, FAQs and pages), so every fact here matches
// what the pages and schema say. Written as clear, quotable facts rather than
// keyword lists: assistants cite statements, not stuffing.
import type { APIRoute } from 'astro';
import { allEntries } from '../lib/content';
import { business, SITE } from '../data/business';
import { services } from '../data/nav';
import { materials, repairs, boroughs, skylights, typicalReplacement, money, range, COSTS_UPDATED } from '../data/costs';
import { reviewStats } from '../data/reviews';

const plain = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export const GET: APIRoute = async () => {
  const all = await allEntries();
  const entries = all.filter((e) => !e.data.noindex && !['archive', 'legal', 'landing'].includes(e.data.template));
  const byPath = (p: string) => all.find((e) => e.data.path === p);
  const title = (e: (typeof all)[number]) => ('cardTitle' in e.data && e.data.cardTitle) || e.data.h1;
  const list = (t: string[]) => entries.filter((e) => t.includes(e.data.template))
    .map((e) => `- [${title(e)}](${SITE}${e.data.path}): ${e.data.description}`).join('\n');

  // Neighborhoods come from each area page ("## … neighborhoods we serve" or its FAQ).
  const hoods = (path: string) => {
    const e = byPath(path);
    const body = (e as any)?.body || '';
    const m = body.match(/## [^\n]*neighborhoods we serve\s*\n+([\s\S]*?)(?=\n## |$)/i);
    if (m) return m[1].trim().split(/\n\s*\n/).map((l: string) => l.replace(/\*\*/g, '').replace(/\.$/, '').split(/\s*·\s*/).join(', ')).join('; ');
    const fq = e?.data.faq.find((f) => /neighborhoods/i.test(f.q));
    return fq ? plain(fq.a).replace(/^All of them: /, '') : '';
  };
  const areaLines = [
    { name: 'Staten Island, NY', note: 'home base; fastest response, most roofs done in one day', path: '/service-area/staten-island-ny/' },
    { name: 'Manhattan, NY', note: 'co-ops, condos, walk-ups, brownstones and commercial flat roofs', path: '/service-area/manhattan-ny/' },
    { name: 'Brooklyn, NY', note: 'row houses, brownstones and flat roofs; shingle roofs in southern Brooklyn', path: '/service-area/brooklyn-ny/' },
    { name: 'Queens, NY', note: 'attached row houses with flat roofs and detached shingle-roofed homes', path: '/service-area/queens-ny/' },
    { name: 'The Bronx, NY', note: 'row houses and two- and three-family homes, mostly flat roofs; shingle roofs on detached houses', path: '', hoods: 'Riverdale, Kingsbridge, Throgs Neck, Pelham Bay, Country Club, Morris Park, Parkchester, Castle Hill, Soundview, Williamsbridge, Wakefield and City Island' },
  ].map((a) => {
    const h = a.hoods || (a.path ? hoods(a.path) : '');
    return `### ${a.name}\n${a.path ? `Page: ${SITE}${a.path}\n` : ''}Typical work: ${a.note}.${h ? `\nNeighborhoods: ${h}.` : ''}`;
  }).join('\n\n');

  const flat = materials.filter((m) => m.type === 'flat');
  const shingle = materials.find((m) => m.id === 'asphalt')!;
  const serviceLines = services.flatMap((s) => [s, ...(s.children || [])])
    .map((s) => { const e = byPath(s.url); return `- [${s.title}](${SITE}${s.url})${e ? `: ${e.data.description}` : s.blurb ? `: ${s.blurb}` : ''}`; }).join('\n');

  // A handful of the most useful answers, verbatim from the pages they live on.
  const faqs = ['/residential-roofing/roof-replacement/', '/roof-repair/', '/flat-roofing/', '/roof-replacement-guide-nyc/', '/service-area/staten-island-ny/']
    .flatMap((p) => (byPath(p)?.data.faq || []).slice(0, 3).map((f) => ({ ...f, p })))
    .map((f) => `### ${plain(f.q)}\n${plain(f.a)} (Source: ${SITE}${f.p})`).join('\n\n');

  const sources = Object.entries(reviewStats.bySource).map(([k, v]) => `${k} ${v}`).join(', ');
  const body = `# ${business.name}

> ${business.name} is a family-owned, licensed and insured roofing contractor based in Staten Island, New York. We repair and replace roofs for homeowners, landlords, co-op and condo boards, HOAs and businesses across New York City: Staten Island, Manhattan, Brooklyn, Queens and the Bronx. Services include roof repair, emergency roof repair (24/7), roof replacement, asphalt shingle roofing, flat roofing (EPDM, TPO, modified bitumen, PVC), roof inspections, skylights, gutters and siding.

Rated ${reviewStats.average} stars from ${reviewStats.total} reviews. GAF Master Elite® Residential Roofing Contractor. NYC DCWP Home Improvement Contractor License #${business.license.number}. Owner ${business.owner.name} is part of every job, and our own crew does the work (no subcontractors). Most roofs are replaced in one day.

## Key facts

- Business name: ${business.name} (also known as ${business.alternateNames.join(', ')}; legal name ${business.legalName})
- Type: residential and commercial roofing contractor
- Address: ${business.address.street}, ${business.address.city}, ${business.address.region} ${business.address.zip} (office; work is done at the customer's property)
- Google Business Profile: ${business.googleMapsUrl}
- Phone: ${business.phone} (call or text)
- Email: ${business.email}
- Website: ${SITE}/
- Hours: ${business.hours.map((h) => `${h.label} ${h.text}`).join(', ')}; Sunday closed; emergency roof repair 24/7
- Founded: ${business.foundingDate}; ${business.yearsInRoofing}+ years in roofing
- Owner: ${business.owner.name}
- License: NYC DCWP Home Improvement Contractor #${business.license.number}; fully insured
- Certifications: GAF Master Elite® Residential Roofing Contractor (${business.profiles.gaf}); BBB Accredited Business (${business.profiles.bbb})
- Warranties: up to ${business.warranty.manufacturerYears} years manufacturer coverage on GAF roofing systems and up to ${business.warranty.workmanshipYears} years on workmanship, in writing
- Reviews: ${reviewStats.average} out of 5 from ${reviewStats.total} reviews (${sources}); ${reviewStats.fiveStar} are five-star. All reviews: ${SITE}/reviews/
- Leak detection: the latest infrared (thermal imaging) cameras to find hidden leaks and wet insulation
- Free estimates: free roof inspection with photos and a written, itemized price, usually within 24 hours: ${SITE}/free-estimate/
- Permits: DOB permits and co-op/condo board paperwork handled as part of the job

## Services

${serviceLines}

## Service areas

We serve all five boroughs of New York City. Full list: ${SITE}/service-area/nyc/

${areaLines}

## Prices (NYC, ${COSTS_UPDATED.slice(0, 7)})

Job averages from our own work; the exact price is confirmed in writing after a free inspection.

- Roof replacement (typical home): ${range(typicalReplacement.low, typicalReplacement.high)}+
- Asphalt shingle roof replacement: $${shingle.low}–$${shingle.high} per sq ft installed (lasts ${shingle.life})
${flat.map((m) => `- ${m.name} flat roof: $${m.low}–$${m.high} per sq ft installed (lasts ${m.life})`).join('\n')}
- New flat roof, about 1,000 sq ft, by borough: ${boroughs.map((b) => `${b.name} ${money(b.low)}–${money(b.high)}`).join('; ')}
${repairs.map((r) => `- ${r.name}: ${range(r.low, r.high)}`).join('\n')}
${skylights.map((s) => `- ${s.name}: ${range(s.low, s.high)}`).join('\n')}
- Roof cost guide: ${SITE}/roof-replacement-cost-in-nyc/

## Frequently asked questions

${faqs}

## Location pages

${list(['location'])}

## Roofing guides

${list(['post'])}

## Company

${list(['company', 'contact', 'reviews'])}

## Official profiles

${business.sameAs.map((u) => `- ${u}`).join('\n')}

## Optional

- Sitemap: ${SITE}/sitemap-index.xml
- Guides feed: ${SITE}/rss.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
