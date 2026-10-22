// Google Ads landing pages: conversion copy per page. SEO fields (title,
// description, noindex, tracking number) stay in each page's frontmatter.
//
// Message match: the headline and the preselected form option follow the
// ad's search term (utm_term / keyword / kw URL parameter). Only the
// whitelisted variants below are ever shown; the raw keyword is never printed.
import type { ReviewTag } from './reviews';

export interface Variant { match: string; h1: string; sub: string; service: string }
export interface LandingCopy {
  area: string;
  badge: string;
  variants: Variant[];
  pains: string[];
  painTitle: string;
  includes: string[];
  includesTitle: string;
  compare: { us: string; them: string }[];
  gallery: { img: string; t: string }[];
  galleryTitle: string;
  reviewTags: ReviewTag[];
  formTitle: string;
  /** Offer button text and comparison heading; roofing defaults when omitted. */
  cta?: string;
  compareTitle?: string;
  them?: string;
}

const roofCompare = [
  { us: 'We climb your roof and photograph every problem', them: 'Drone shots or a guess from the street' },
  { us: 'Written, itemized price, usually within 24 hours', them: 'A number scribbled on a business card' },
  { us: 'If a repair will do, that\'s what we quote', them: 'Push a full replacement' },
  { us: 'Most new roofs done in a single day', them: 'Your house torn open for a week' },
  { us: 'The owner on every job, our own crew', them: 'Subcontractors you\'ve never met' },
  { us: 'Up to 50-yr material + 25-yr workmanship warranty', them: '"We stand behind our work"' },
  { us: 'Yard swept, nails and debris gone', them: 'Nails in your driveway for months' },
];

const roofIncludes = [
  'A roofer climbs up and checks the whole roof, not just the leak',
  'Photos of every problem we find',
  'Honest repair and replacement options',
  'A written, itemized price, usually within 24 hours',
  'Zero pressure. Take your time to decide',
];

const roofGallery = [
  { img: '/wp-content/uploads/2025/05/New-Roof-10314-Staten-Island-NY-768x768.jpg', t: 'New shingle roof · Staten Island 10314' },
  { img: '/wp-content/uploads/2025/04/Replaced-Roof-10305-Staten-Island-10304-768x768.jpg', t: 'Full replacement · Staten Island 10305' },
  { img: '/wp-content/uploads/2024/04/AlterPhaseRoofingProjects-9-768x772.jpg', t: 'Tear-off down to the deck' },
  { img: '/wp-content/uploads/2024/04/AlterPhaseRoofingProjects-7-1-768x758.jpg', t: 'TPO flat roof · Brooklyn' },
];

const roofVariants = (area: string): Variant[] => [
  { match: 'emergenc|storm|tarp|24', h1: `Roof emergency on ${area}? We answer 24/7.`, sub: 'We stop the water first with an emergency tarp or temporary repair, photograph everything for your insurance, then fix it properly.', service: 'EMERGENCY' },
  { match: 'leak|repair|fix|patch|shingle', h1: `Roof leaking? ${area} roof repair, done right the first time.`, sub: 'We find where the water actually gets in, fix the cause and show you photos. If a repair will do, we won\'t sell you a roof.', service: 'Roof leak / repair' },
  { match: 'flat|rubber|epdm|tpo|torch|bitumen', h1: `Flat roof leaking or worn out? ${area} flat roofs, fixed right.`, sub: 'EPDM, TPO and modified bitumen roofs on row homes, extensions and garages. Drainage fixed, not just the leak.', service: 'Flat roof' },
  { match: 'replac|new roof|install|reroof|re-roof|cost|price|shingles', h1: `A new roof on your ${area} home, most done in one day.`, sub: 'Tear-off, new GAF roof and cleanup in a single day on most homes, with up to 50-year warranties in writing.', service: 'Roof replacement' },
];

export const landing: Record<string, LandingCopy> = {
  '/roofing-lp/': {
    area: 'Staten Island',
    badge: 'Staten Island roofing',
    variants: roofVariants('Staten Island'),
    painTitle: 'Sound familiar?',
    pains: ['Water stains spreading across a ceiling', 'Shingles cracked, curling or blown off', 'Someone else\'s "quick fix" that didn\'t last', 'A 20+ year old roof and no idea how long it has left', 'Roofers who never called you back'],
    includesTitle: 'Your free roof inspection includes',
    includes: roofIncludes,
    compare: roofCompare,
    gallery: roofGallery,
    galleryTitle: 'Recent roofs by our own crew',
    reviewTags: ['honest', 'repair', 'replacement'],
    formTitle: 'Get your free roof inspection',
  },
  '/roof-replacement-si/': {
    area: 'Staten Island',
    badge: 'Roof replacement · Staten Island',
    variants: roofVariants('Staten Island').filter((v) => !/leak/.test(v.match)),
    painTitle: 'Time for a new roof?',
    pains: ['Shingles curling, cracking or losing granules', 'Leaks in more than one spot', 'The roof is 20+ years old', 'Repairs that keep coming back', 'Getting quotes that don\'t add up'],
    includesTitle: 'Every roof replacement includes',
    includes: ['Full tear-off down to the deck', 'Damaged decking found and shown to you before it\'s replaced', 'Ice & water protection and synthetic underlayment', 'New flashing at chimneys, walls and vents', 'GAF architectural shingles in your color', 'Cleanup with a magnetic nail sweep, and written warranties'],
    compare: roofCompare,
    gallery: roofGallery,
    galleryTitle: 'Recent roofs by our own crew',
    reviewTags: ['replacement', 'oneday'],
    formTitle: 'Get your free roof replacement estimate',
  },
  '/brooklyn-roofing-solutions/': {
    area: 'Brooklyn',
    badge: 'Brooklyn roof repair & replacement',
    variants: roofVariants('Brooklyn'),
    painTitle: 'Sound familiar?',
    pains: ['Water stains on the top-floor ceiling after every storm', 'Water pooling on the roof days after the rain', 'Blisters, cracks or open seams in the membrane', 'Leaks at the parapet wall, chimney or skylight', 'A patch from someone else that didn\'t last'],
    includesTitle: 'Your free roof inspection includes',
    includes: roofIncludes,
    compare: roofCompare,
    gallery: [roofGallery[3], { img: '/wp-content/uploads/2025/04/Alter-Phase-Roofing-Contracting-Crew-Installing-Flat-Roof-in-Brooklyn-768x768.webp', t: 'Flat roof install · Brooklyn' }, { img: '/wp-content/uploads/2025/04/MB-Flat-Roof-Brooklyn-768x768.webp', t: 'Modified bitumen · Brooklyn' }, roofGallery[0]],
    galleryTitle: 'Recent roofs by our own crew',
    reviewTags: ['repair', 'leak', 'honest'],
    formTitle: 'Get your free roof inspection',
  },
  '/vinyl-siding-estimate/': {
    area: 'Staten Island',
    badge: 'Vinyl siding · Staten Island',
    variants: [
      { match: 'insulat', h1: 'Insulated vinyl siding for your Staten Island home.', sub: 'A warmer, quieter house that looks new again, installed by a local, family-owned crew.', service: 'Gutters / siding / skylight' },
      { match: 'repair|replace|storm|damage', h1: 'Siding damaged or faded? Get it fixed or replaced.', sub: 'Storm-damaged, cracked or faded siding repaired or replaced, matched as closely as possible to the rest of your house.', service: 'Gutters / siding / skylight' },
    ],
    painTitle: 'Is your siding telling you something?',
    pains: ['Faded, chalky or mismatched panels', 'Cracked, warped or loose siding after a storm', 'Drafty rooms and high heating bills', 'Peeling trim and gutters pulling away'],
    includesTitle: 'Your free siding estimate includes',
    includes: ['We measure every wall, window and door', 'Help choosing colors and profiles', 'House wrap, flashing and trim spelled out', 'A written, itemized price', 'Zero pressure. Take your time to decide'],
    compare: [
      { us: 'House wrap and flashed windows and doors', them: 'New panels nailed over old problems' },
      { us: 'Written, itemized price', them: 'A number scribbled on a business card' },
      { us: 'The owner on every job, our own crew', them: 'Subcontractors you\'ve never met' },
      { us: 'Gutters and trim done at the same time', them: 'Three different contractors' },
      { us: 'Clean job site every day', them: 'Debris in your yard' },
    ],
    gallery: [
      { img: '/wp-content/uploads/2024/10/Vinyl-Siding-Installation-Staten-Island-768x398.webp', t: 'Vinyl siding · Staten Island' },
      { img: '/wp-content/uploads/2024/10/Siding-Replacement-Repair-Staten-Island-768x511.webp', t: 'Siding replacement' },
      { img: '/wp-content/uploads/2024/10/Insulated-Vinyl-Siding-Staten-Island-768x307.webp', t: 'Insulated vinyl siding' },
      { img: '/wp-content/uploads/2024/10/Siding-Customization-Colors-Staten-Island-768x384.webp', t: 'Colors and profiles' },
    ],
    galleryTitle: 'Siding styles, colors and finishes',
    reviewTags: ['gutters', 'clean'],
    formTitle: 'Get your free siding estimate',
    cta: 'Claim my free siding estimate',
    compareTitle: 'Not all siding contractors work the same way.',
    them: 'Many other contractors',
  },
};
