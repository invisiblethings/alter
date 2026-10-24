// Site structure. Every service and area page links to every other through
// the header, footer and related-links blocks, so no page is orphaned.
export interface NavLink { title: string; url: string; blurb?: string; icon?: string; children?: NavLink[] }

export const services: NavLink[] = [
  {
    title: 'Roof Repair', url: '/roof-repair/', blurb: 'Leaks, storm damage, flashing', icon: 'wrench',
    children: [
      { title: 'Emergency Roof Repair (24/7)', url: '/roof-repair/emergency-service/' },
      { title: 'Residential Roof Repair', url: '/roof-repair/residential/' },
      { title: 'Commercial Roof Repair', url: '/roof-repair/commercial/' },
    ],
  },
  {
    title: 'Roof Replacement', url: '/residential-roofing/roof-replacement/', blurb: 'New roofs, tear-offs, re-roofs', icon: 'roof',
    children: [
      { title: 'Residential Roofing', url: '/residential-roofing/' },
      { title: 'Roof Inspections', url: '/residential-roofing/roof-inspections/' },
      { title: 'Skylight Repair & Installation', url: '/residential-roofing/skylight-installation-repair/' },
    ],
  },
  {
    title: 'Flat Roofing', url: '/flat-roofing/', blurb: 'TPO, EPDM, modified bitumen', icon: 'layers',
    children: [],
  },
  {
    title: 'Commercial Roofing', url: '/commercial-roofing/', blurb: 'Businesses & multi-family', icon: 'store',
    children: [
      { title: 'Commercial Roof Replacement', url: '/commercial-roofing/roof-replacement/' },
      { title: 'Commercial Roof Inspections', url: '/commercial-roofing/roof-inspection/' },
    ],
  },
  {
    title: 'Gutters', url: '/siding-gutter/gutter-installation-repair/', blurb: 'Seamless gutters, guards, repairs', icon: 'gutter',
    children: [],
  },
  {
    title: 'Siding', url: '/siding-gutter/siding-installation-repair/', blurb: 'Vinyl & insulated vinyl siding', icon: 'home',
    children: [],
  },
];

export const areas: NavLink[] = [
  { title: 'Staten Island', url: '/service-area/staten-island-ny/', blurb: 'Home base. Fastest response.' },
  {
    title: 'Brooklyn', url: '/service-area/brooklyn-ny/', blurb: 'Brownstones, row homes, flat roofs',
    children: [
      { title: 'Flat Roofing Brooklyn', url: '/service-area/brooklyn-ny/flat-roofing/' },
      { title: 'Roof Repair Brooklyn', url: '/service-area/brooklyn-ny/roof-repair/' },
      { title: 'Roof Replacement Brooklyn', url: '/service-area/brooklyn-ny/roof-replacement/' },
    ],
  },
  { title: 'Manhattan', url: '/service-area/manhattan-ny/', blurb: 'Co-ops, condos, commercial' },
  { title: 'Queens', url: '/service-area/queens-ny/', blurb: 'Detached homes & attached rows' },
  { title: 'All of NYC', url: '/service-area/nyc/', blurb: 'Every borough we serve' },
];

export const company: NavLink[] = [
  { title: 'About Alter Phase', url: '/about/' },
  { title: 'How We Work', url: '/how-we-work/' },
  { title: 'Reviews', url: '/reviews/' },
  { title: 'Property Managers & HOAs', url: '/property-managers/' },
  { title: 'Careers', url: '/careers/' },
  { title: 'Contact', url: '/contact/' },
];

export const guides: NavLink[] = [
  { title: 'Roof Replacement Cost NYC', url: '/roof-replacement-cost-in-nyc/' },
  { title: 'NYC Roof Replacement Guide', url: '/roof-replacement-guide-nyc/' },
  { title: 'Roof Leak Repair Cost', url: '/cost-to-repair-roof-leak/' },
  { title: 'TPO Roofing Guide', url: '/tpo-roofing-guide/' },
  { title: 'Best Roofing Materials NY', url: '/top-roofing-materials-for-homes-in-new-york/' },
];

export const legal: NavLink[] = [
  { title: 'Terms', url: '/terms-and-conditions/' },
  { title: 'Privacy', url: '/privacy-policy-2/' },
  { title: 'Accessibility', url: '/accessibility-statement/' },
];

export const allLinks = (): NavLink[] => [
  ...services.flatMap((s) => [s, ...(s.children || [])]),
  ...areas.flatMap((a) => [a, ...(a.children || [])]),
];
