// Content for /cost-to-repair-roof-leak/ (layout: leak, LeakCostView).
// Prices match src/data/costs.ts (repairs and repairTiers); the images are
// rendered by scripts/images/roof-leak-repair-cost.cjs and carry EXIF/IPTC/XMP
// metadata from scripts/images/add-metadata.py.
const DIR = '/images/guides/roof-leak-repair-cost';

export const leakImages = {
  photo: { src: `${DIR}/roof-leak-repair-nyc-flashing-repair.jpg`, w: 1200, h: 800, alt: 'Alter Phase Roofing Contracting roofer sealing new flashing to stop a roof leak in New York City' },
  chart: { src: `${DIR}/roof-leak-repair-cost-nyc-price-chart.jpg`, w: 1200, h: 1720, alt: 'Chart of 2026 roof leak repair costs in NYC by type of repair, from $150 for a pipe boot to $3,500 for storm damage', caption: 'NYC roof leak repair prices, 2026: average prices from hundreds of Alter Phase jobs.' },
  diagram: { src: `${DIR}/where-roofs-leak-diagram-repair-costs.jpg`, w: 1200, h: 1570, alt: 'Diagram of a house showing the 7 places roofs leak, numbered, with the repair cost for each', caption: 'The 7 places NYC roofs leak, and what each costs to fix.' },
  now: { src: `${DIR}/roof-leaking-what-to-do-first.jpg`, w: 1200, h: 1640, alt: 'Checklist: 5 things to do first when your roof is leaking', caption: 'Roof leaking right now? Do these 5 things first.' },
  decide: { src: `${DIR}/roof-leak-repair-or-replace-guide.jpg`, w: 1200, h: 1500, alt: 'Guide to whether a leaking roof should be repaired or replaced, by roof age, number of leaks and shingle and deck condition', caption: 'Repair or replace? The signs we look at on every leak call.' },
};

// Where roofs leak, with what the fix involves and its average price.
export const leakSources = [
  { n: 'Chimney flashing', p: '$450–$900', fix: 'New step and counter flashing where the roof meets the chimney. A full chimney flashing rebuild with damaged masonry is $1,500–$3,500.' },
  { n: 'Pipe boot or plumbing vent', p: '$150–$400', fix: 'The rubber boot around the vent pipe cracks with age. We replace the boot and tie it back into the shingles.' },
  { n: 'Valley where two roof slopes meet', p: '$400–$1,500', fix: 'Valleys carry the most water on the roof. We open the valley, replace the leak barrier and flashing, and relay the shingles.' },
  { n: 'Skylight', p: '$500–$1,200', fix: 'Usually failed flashing or seals, not the glass. We reflash and reseal, or quote a new skylight if the unit is worn out.' },
  { n: 'Missing or cracked shingles', p: '$350–$800', fix: 'Wind-damaged or cracked shingles replaced and matched to the rest of the roof.' },
  { n: 'Flat roof seam, blister or puncture', p: '$400–$1,200', fix: 'Open seams, blisters and punctures on EPDM, TPO and modified bitumen roofs repaired, and the drainage fixed if water sits.' },
  { n: 'Gutter and drip edge', p: '$150–$500', fix: 'Clogged or loose gutters and missing drip edge send water behind the fascia and into the walls.' },
];
