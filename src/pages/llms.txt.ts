// llms.txt: a plain-text map of the site for AI assistants. Not a ranking
// factor and not required by any engine; it's cheap and keeps facts consistent.
import type { APIRoute } from 'astro';
import { allEntries } from '../lib/content';
import { business, SITE } from '../data/business';

export const GET: APIRoute = async () => {
  const entries = (await allEntries()).filter((e) => !e.data.noindex && !['archive', 'legal'].includes(e.data.template));
  const group = (t: string[]) => entries.filter((e) => t.includes(e.data.template)).map((e) => `- [${e.data.h1}](${SITE}${e.data.path})${e.data.description ? `: ${e.data.description}` : ''}`).join('\n');
  const body = `# ${business.name}

> Family-owned roofing contractor based at ${business.address.street}, ${business.address.city}, ${business.address.region} ${business.address.zip}. Roof repair, roof replacement, flat roofing (TPO, EPDM, modified bitumen), skylights, gutters and siding for homeowners, businesses, HOAs and property managers in Staten Island, Brooklyn, Manhattan and Queens.

- Phone: ${business.phone}
- Email: ${business.email}
- Owner: ${business.owner.name} (part of every job)
- NYC DCWP Home Improvement Contractor License #${business.license.number}
- Warranties: up to ${business.warranty.manufacturerYears} years manufacturer, up to ${business.warranty.workmanshipYears} years workmanship
- Hours: Mon-Fri 8am-8pm, Sat 8am-5pm, emergencies 24/7

## Services
${group(['hub', 'service'])}

## Service areas
${group(['location'])}

## Guides
${group(['post'])}

## Company
${group(['company', 'contact', 'reviews'])}
- [For property managers, HOAs and co-op boards](${SITE}/property-managers/)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
