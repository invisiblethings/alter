// Single source of truth for NAP and entity facts. Everything that prints the
// phone, address, license or warranty reads from here so the site, the schema
// graph and Google Business Profile never drift apart again.

export const SITE = 'https://alterphaseroofing.com';

export const business = {
  id: `${SITE}/#business`,
  name: 'Alter Phase Roofing',
  // Shown in schema as alternateName; DCWP registers the company under this name.
  legalName: 'Alter Phase Contracting Inc',
  alternateNames: ['Alter Phase Roofing Contracting', 'Alter Phase Roofing Inc.'],
  slogan: 'The Staten Island roofer your neighbors already called.',
  owner: { name: 'Marke', role: 'Owner', id: `${SITE}/about/#marke` },
  yearsInRoofing: 13,
  foundingDate: '2018',
  // Google Ads call-conversion swaps this exact string, so keep the format.
  phone: '(929) 370-1552',
  phoneE164: '+19293701552',
  email: 'info@alterphaseroofing.com',
  address: {
    street: '61 Appleby Ave',
    city: 'Staten Island',
    region: 'NY',
    zip: '10305',
    country: 'US',
  },
  geo: { lat: 40.591462, lng: -74.079555 },
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '20:00', label: 'Mon – Fri', text: '8 AM – 8 PM' },
    { days: ['Saturday'], opens: '08:00', closes: '17:00', label: 'Sat', text: '8 AM – 5 PM' },
  ],
  hoursNote: 'Sunday closed · Emergency calls answered 24/7',
  license: {
    number: '2129904-DCWP',
    issuer: 'NYC Department of Consumer and Worker Protection',
    type: 'Home Improvement Contractor',
    verifyUrl: 'https://www.nyc.gov/site/dca/businesses/license-checklist-home-improvement-contractor.page',
  },
  warranty: { manufacturerYears: 50, workmanshipYears: 25 },
  certifications: ['GAF Master Elite®', 'BBB Accredited Business'],
  rating: { label: 'Excellent', count: 108, source: 'Google' },
  googleMapsUrl: 'https://www.google.com/maps?cid=15794678866958250729',
  googleReviewUrl: 'https://www.google.com/maps?cid=15794678866958250729',
  sameAs: [
    'https://www.google.com/maps?cid=15794678866958250729',
    'https://www.facebook.com/AlterPhaseRoofing/',
    'https://www.linkedin.com/company/alterphaseroofing/',
    'https://www.yelp.com/biz/alter-phase-roofing-contracting-staten-island',
    'https://www.bbb.org/us/ny/staten-island/profile/roofing-contractors/alter-phase-contracting-inc-0121-87150134',
    'https://www.angi.com/companylist/us/ny/staten-island/alter-phase-contracting-inc-reviews-10071986.htm',
    'https://www.gaf.com/en-us/roofing-contractors/residential/usa/ny/staten-island/alter-phase-contracting-inc-1132980',
    'https://www.buildzoom.com/contractor/alter-phase-roofing-inc',
    'https://reviews.birdeye.com/alter-phase-roofing-contracting-residental-commercial-165926761009567',
    'https://www.thebluebook.com/iProView/1756134',
  ],
  social: {
    facebook: 'https://www.facebook.com/AlterPhaseRoofing/',
    linkedin: 'https://www.linkedin.com/company/alterphaseroofing/',
    yelp: 'https://www.yelp.com/biz/alter-phase-roofing-contracting-staten-island',
  },
  areas: [
    { name: 'Staten Island', url: '/service-area/staten-island-ny/', primary: true },
    { name: 'Brooklyn', url: '/service-area/brooklyn-ny/' },
    { name: 'Manhattan', url: '/service-area/manhattan-ny/' },
    { name: 'Queens', url: '/service-area/nyc/' },
  ],
  gtmId: 'GTM-M77VVM4Q',
} as const;

export const telHref = `tel:${business.phoneE164}`;
export const smsHref = `sms:${business.phoneE164}`;
