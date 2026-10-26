// Content for the interactive parts of /roof-replacement-guide-nyc/
// (GuideHybridView): borough profiles, the repair-or-replace check and the
// permit check. Prices come from src/data/costs.ts, so they never drift from
// the price tables and calculators.
import { boroughs, materials } from './costs';

const si = boroughs[0];
const shingle = materials.find((m) => m.id === 'asphalt')!;
const round = (n: number) => Math.round(n / 100) * 100;

export interface BoroughGuide {
  name: string;
  slug: string;
  in: string; // "on Staten Island" / "in Brooklyn"
  homes: string;
  roofs: string;
  points: string[];
  link?: { url: string; label: string };
}

const guides: BoroughGuide[] = [
  {
    name: 'Staten Island', slug: 'staten-island', in: 'on Staten Island',
    homes: 'Detached and semi-attached houses: colonials, capes, high-ranches and two-families.',
    roofs: 'Mostly asphalt shingles, with flat roofs over extensions, porches and garages.',
    points: [
      'Driveways make staging and debris removal easy, which keeps Staten Island the least expensive borough.',
      'South and East Shore homes take the most wind: we use wind-rated architectural shingles and ice-and-water shield at the edges and valleys.',
      'Our crew is based here, and most Staten Island roofs are finished in a single day.',
    ],
    link: { url: '/service-area/staten-island-ny/', label: 'Roofing on Staten Island' },
  },
  {
    name: 'Brooklyn', slug: 'brooklyn', in: 'in Brooklyn',
    homes: 'Row houses, brownstones and attached two- to four-family buildings, plus detached and semi-attached homes in southern Brooklyn.',
    roofs: 'Mostly flat roofs (EPDM, modified bitumen, TPO) behind parapet walls; shingles on detached homes.',
    points: [
      'Attached buildings share walls, so parapet and neighbor flashing is where most of the skill (and leaks) are.',
      'No driveways: debris goes into a permitted street container or straight onto a truck, itemized in your estimate.',
      'Brownstones in landmark districts may need Landmarks Preservation Commission sign-off before work starts.',
    ],
    link: { url: '/service-area/brooklyn-ny/roof-replacement/', label: 'Roof replacement in Brooklyn' },
  },
  {
    name: 'Queens', slug: 'queens', in: 'in Queens',
    homes: 'Attached row houses and two-families, alongside detached and semi-attached homes.',
    roofs: 'Flat roofs on attached homes; asphalt shingles on most detached and semi-attached houses.',
    points: [
      'Wider streets and more driveways make staging easier than in Brooklyn or Manhattan, so prices sit closer to Staten Island.',
      'Many attached homes have a flat main roof plus small shingle sections at the front: we price both in one visit.',
      'Older roofs often have two or more layers that must come off before the new roof goes on.',
    ],
    link: { url: '/service-area/queens-ny/', label: 'Roofing in Queens' },
  },
  {
    name: 'Bronx', slug: 'bronx', in: 'in the Bronx',
    homes: 'Attached row houses and two- and three-family homes, plus detached houses in neighborhoods like Throgs Neck, Pelham Bay and Riverdale.',
    roofs: 'Mostly flat roofs on attached homes; asphalt shingles on detached houses.',
    points: [
      'Shared walls mean careful flashing where your roof meets your neighbors’, so water can’t find its way between buildings.',
      'Street staging and debris haul-away are planned before the job and itemized in your estimate.',
      'Flat roofs here are a good fit for white TPO, which also meets NYC cool-roof rules.',
    ],
  },
  {
    name: 'Manhattan', slug: 'manhattan', in: 'in Manhattan',
    homes: 'Walk-ups, brownstones, co-ops, condos and mixed-use buildings.',
    roofs: 'Flat roofs: TPO, modified bitumen and PVC, often with bulkheads, skylights and equipment.',
    points: [
      'Materials go up through the building or by hoist, and sidewalks may need protection, which is why Manhattan costs the most.',
      'Co-op and condo boards need a scope of work, insurance certificates and a contractor application: we prepare them for you.',
      'Full roof deck replacements can trigger Local Laws 92/94 (solar or green roof requirements); we check before you sign.',
    ],
    link: { url: '/service-area/manhattan-ny/', label: 'Roofing in Manhattan' },
  },
];

export const boroughGuides = guides.map((g) => {
  const b = boroughs.find((x) => x.name === g.name)!;
  const factor = (b.low + b.high) / (si.low + si.high);
  return {
    ...g,
    flat: { low: b.low, high: b.high },
    // A typical 1,500 sq ft shingle roof, adjusted like the calculator.
    shingle: { low: round(shingle.low * 1500 * factor), high: round(shingle.high * 1500 * factor) },
    drivers: b.drivers,
  };
});

// Repair or replace? Each sign carries a weight; the total picks the verdict.
export const signs = [
  { id: 'age', w: 2, t: 'The roof is 20 or more years old' },
  { id: 'leaks', w: 2, t: 'Leaks keep coming back, or show up in more than one spot' },
  { id: 'deck', w: 3, t: 'Soft or sagging spots, or daylight visible in the attic' },
  { id: 'wear', w: 2, t: 'Curling, cracked or bald shingles across large areas (or widespread blisters and splits on a flat roof)' },
  { id: 'layers', w: 1, t: 'There are already two or more layers of roofing' },
  { id: 'granules', w: 1, t: 'Shingle granules in the gutters or new stains on ceilings' },
];

export const verdicts = [
  { min: 0, tone: 'ok', t: 'Probably nothing urgent', s: 'Tick anything you’ve noticed. If you’re unsure, a free inspection with photos will tell you exactly where your roof stands.' },
  { min: 1, tone: 'repair', t: 'Most likely a repair', s: 'What you describe is usually fixable. Most repairs cost a fraction of a new roof, and we’ll tell you honestly if a repair will do.' },
  { min: 3, tone: 'maybe', t: 'Could go either way', s: 'This is where an inspection pays off: we photograph the whole roof and price both a repair and a replacement, so you can compare.' },
  { min: 5, tone: 'replace', t: 'A replacement is likely the smarter money', s: 'With these signs, repairs tend to keep coming back. A new roof is usually done in one day and comes with up to 50 years of GAF coverage.' },
];

// Permit check: any "yes" on a permit question means a DOB permit is likely.
export const permitQuestions = [
  { id: 'deck', t: 'Will the roof deck (the boards or plywood under the roofing) be replaced, or are you changing the roof type?', permit: true },
  { id: 'commercial', t: 'Is it a commercial or mixed-use building?', permit: true },
  { id: 'landmark', t: 'Is the building landmarked or in a historic district?', permit: true, note: 'Landmarks Preservation Commission approval may also be needed.' },
  { id: 'board', t: 'Is it a co-op or condo?', permit: false, note: 'Board approval is needed even without a DOB permit; allow 2–8 weeks.' },
];
