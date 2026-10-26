// NYC roofing prices: one source of truth for every table, the estimator and
// Offer schema. Figures are Alter Phase's published job averages (2026 NYC
// guide + repair cost tables). Update here and the whole site follows.

export const COSTS_UPDATED = '2026-10-26';

export interface Material {
  id: string;
  name: string;
  type: 'flat' | 'pitched';
  low: number; // $ per sq ft, installed
  high: number;
  life: string;
  bestFor: string;
  note: string;
}

export const materials: Material[] = [
  { id: 'asphalt', name: 'Asphalt shingles', type: 'pitched', low: 3, high: 10, life: '20–30 yrs', bestFor: 'Most Staten Island homes', note: 'Best value for pitched roofs. Choose wind-rated architectural shingles for NYC coastal weather.' },
  { id: 'epdm', name: 'EPDM (rubber)', type: 'flat', low: 5, high: 12, life: '20–30 yrs', bestFor: 'Row homes & brownstones', note: 'The most cost-effective flat roof; stays flexible through NYC freeze-thaw cycles.' },
  { id: 'tpo', name: 'TPO membrane', type: 'flat', low: 9, high: 14, life: '20–30 yrs', bestFor: 'Commercial & larger flat roofs', note: 'White, reflective surface keeps top floors cooler and helps meet NYC cool-roof rules.' },
  { id: 'modbit', name: 'Modified bitumen', type: 'flat', low: 9, high: 13, life: '20–30 yrs', bestFor: 'Roofs with foot traffic', note: 'Multi-ply and tough; good where equipment or people use the roof.' },
  { id: 'pvc', name: 'PVC membrane', type: 'flat', low: 10, high: 16, life: '25–35 yrs', bestFor: 'Restaurants & industrial roofs', note: 'Fire-resistant and resists grease and chemicals.' },
];

export const repairs = [
  { name: 'Minor leak patch', low: 300, high: 650 },
  { name: 'Shingle repair (asphalt roof)', low: 350, high: 800 },
  { name: 'Flat roof leak repair (TPO/EPDM)', low: 400, high: 1200 },
  { name: 'Flashing replacement', low: 450, high: 900 },
  { name: 'Skylight leak repair', low: 500, high: 1200 },
  { name: 'Gutter / downspout repair', low: 150, high: 500 },
];

export const repairTiers = [
  { name: 'Minor repair', low: 150, high: 400, what: 'A few missing shingles, a pipe boot seal, small flashing reseal' },
  { name: 'Moderate repair', low: 400, high: 1500, what: 'Flashing replacement, valley repair, leak tracing and fix' },
  { name: 'Extensive repair', low: 1500, high: 3500, what: 'Storm-damaged sections, deck repair, chimney flashing rebuild' },
];

export const skylights = [
  { name: 'Skylight repair', low: 450, high: 1500, what: 'Reseal, new flashing, glass or hardware fix' },
  { name: 'Skylight replacement', low: 2000, high: 5300, what: 'Remove old unit, new skylight and flashing' },
  { name: 'New skylight installation', low: 2500, high: 6000, what: 'New opening, unit, flashing, interior finish, permits' },
];

// Typical full replacement for a ~1,000 sq ft flat roof, by borough.
export const boroughs = [
  { name: 'Staten Island', low: 5000, high: 13000, drivers: 'Least congested; detached homes; easy staging and debris removal' },
  { name: 'Queens', low: 5500, high: 15000, drivers: 'Wider streets; a mix of flat and pitched residential roofs' },
  { name: 'Brooklyn', low: 6500, high: 17000, drivers: 'Row-home access, brownstone details, attached buildings, co-op boards' },
  { name: 'Bronx', low: 6000, high: 16000, drivers: 'Attached row houses and two- and three-family homes; street staging and shared walls' },
  { name: 'Manhattan', low: 8000, high: 22000, drivers: 'Sidewalk protection, cranes or lifts, building height, permit complexity' },
];

export const typicalReplacement = { low: 10000, high: 30000 };
export const permitAddOn = { low: 300, high: 1000 };

export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
export const range = (lo: number, hi: number, unit = '') => `${money(lo)}–${money(hi)}${unit}`;
export const byId = (id: string) => materials.find((m) => m.id === id)!;
