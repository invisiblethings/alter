// Mirrors the old WordPress menu so every page keeps its sitewide internal
// links, grouped for the three audiences.
export const services = [
  {
    title: 'Roof Repair',
    url: '/roof-repair/',
    blurb: 'Leaks, storm damage, flashing',
    children: [
      { title: 'Residential Roof Repair', url: '/roof-repair/residential/' },
      { title: 'Commercial Roof Repair', url: '/roof-repair/commercial/' },
      { title: 'Emergency Roof Repair', url: '/roof-repair/emergency-service/' },
    ],
  },
  {
    title: 'Residential Roofing',
    url: '/residential-roofing/',
    blurb: 'Shingle roofs, replacements, inspections',
    children: [
      { title: 'Residential Roof Replacement', url: '/residential-roofing/roof-replacement/' },
      { title: 'Residential Roof Inspections', url: '/residential-roofing/roof-inspections/' },
      { title: 'Skylight Installation & Repair', url: '/residential-roofing/skylight-installation-repair/' },
    ],
  },
  {
    title: 'Flat Roofing',
    url: '/flat-roofing/',
    blurb: 'TPO, EPDM, modified bitumen',
    children: [],
  },
  {
    title: 'Commercial Roofing',
    url: '/commercial-roofing/',
    blurb: 'Businesses, HOAs, property managers',
    children: [
      { title: 'Commercial Roof Replacements', url: '/commercial-roofing/roof-replacement/' },
      { title: 'Commercial Roof Inspections', url: '/commercial-roofing/roof-inspection/' },
    ],
  },
  {
    title: 'Siding & Gutters',
    url: '/siding-gutter/',
    blurb: 'Vinyl siding, seamless gutters',
    children: [
      { title: 'Siding Installation & Repair', url: '/siding-gutter/siding-installation-repair/' },
      { title: 'Gutter Installation & Repair', url: '/siding-gutter/gutter-installation-repair/' },
    ],
  },
];

export const areas = [
  { title: 'Staten Island, NY', url: '/service-area/staten-island-ny/', blurb: 'Our home borough' },
  {
    title: 'Brooklyn, NY',
    url: '/service-area/brooklyn-ny/',
    blurb: 'Brownstones & flat roofs',
    children: [
      { title: 'Flat Roofing in Brooklyn', url: '/service-area/brooklyn-ny/flat-roofing/' },
      { title: 'Roof Repair in Brooklyn', url: '/service-area/brooklyn-ny/roof-repair/' },
      { title: 'Roof Replacement in Brooklyn', url: '/service-area/brooklyn-ny/roof-replacement/' },
    ],
  },
  { title: 'Manhattan, NY', url: '/service-area/manhattan-ny/', blurb: 'Co-ops, condos, commercial' },
  {
    title: 'New York City',
    url: '/service-area/nyc/',
    blurb: 'Queens & all five boroughs',
    children: [{ title: 'NYC Commercial Roofing', url: '/service-area/nyc/commercial-roofing/' }],
  },
];

export const company = [
  { title: 'About Us', url: '/about/' },
  { title: 'How We Work', url: '/how-we-work/' },
  { title: 'Reviews', url: '/reviews/' },
  { title: 'Blog & Guides', url: '/blog/' },
  { title: 'Careers', url: '/careers/' },
  { title: 'Contact', url: '/contact/' },
];

export const guides = [
  { title: 'Roof Replacement NYC Guide', url: '/roof-replacement-guide-nyc/' },
  { title: 'Roof Replacement Cost in NYC', url: '/roof-replacement-cost-in-nyc/' },
  { title: 'Roofing Costs in NYC', url: '/roofing-costs-in-nyc/' },
  { title: 'TPO Roofing Guide', url: '/tpo-roofing-guide/' },
  { title: 'Cost to Repair a Roof Leak', url: '/cost-to-repair-roof-leak/' },
];

export const legal = [
  { title: 'Terms & Conditions', url: '/terms-and-conditions/' },
  { title: 'Privacy Policy', url: '/privacy-policy-2/' },
  { title: 'Accessibility', url: '/accessibility-statement/' },
];
