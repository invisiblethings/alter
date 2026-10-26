// JSON-LD graph. One RoofingContractor entity with a stable @id that every
// page references, instead of the mix of LocalBusiness/RoofingContractor
// nodes the WordPress plugins produced. Only facts visible on the site go in.
import { business, SITE } from '../data/business';
import { services } from '../data/nav';

const abs = (p?: string) => (p ? (p.startsWith('http') ? p : SITE + p) : undefined);

/** Compact business node for every non-home page, so references to #business resolve on each page. */
export function businessRefNode() {
  const b = business;
  return {
    '@type': ['RoofingContractor', 'HomeAndConstructionBusiness'],
    '@id': b.id,
    name: b.name,
    url: SITE + '/',
    telephone: b.phoneE164,
    image: `${SITE}/wp-content/uploads/2024/04/AlterPhaseRoofingProjects-15.jpg`,
    priceRange: '$$',
    address: { '@type': 'PostalAddress', streetAddress: b.address.street, addressLocality: b.address.city, addressRegion: b.address.region, postalCode: b.address.zip, addressCountry: b.address.country },
    hasMap: b.googleMapsUrl,
  };
}

export function businessNode() {
  const b = business;
  return {
    '@type': ['RoofingContractor', 'HomeAndConstructionBusiness'],
    '@id': b.id,
    name: b.name,
    alternateName: b.alternateNames,
    legalName: b.legalName,
    url: SITE + '/',
    logo: { '@type': 'ImageObject', '@id': `${SITE}/#logo`, url: `${SITE}/wp-content/uploads/2024/04/Logo-Medium.png`, width: 400, height: 206 },
    image: `${SITE}/wp-content/uploads/2024/04/AlterPhaseRoofingProjects-15.jpg`,
    telephone: b.phoneE164,
    email: b.email,
    slogan: b.slogan,
    foundingDate: b.foundingDate,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.address.street,
      addressLocality: b.address.city,
      addressRegion: b.address.region,
      postalCode: b.address.zip,
      addressCountry: b.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: b.geo.lat, longitude: b.geo.lng },
    hasMap: b.googleMapsUrl,
    openingHoursSpecification: b.hours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
    areaServed: [
      { '@type': 'City', name: 'Staten Island', sameAs: 'https://en.wikipedia.org/wiki/Staten_Island' },
      { '@type': 'City', name: 'Brooklyn', sameAs: 'https://en.wikipedia.org/wiki/Brooklyn' },
      { '@type': 'City', name: 'Manhattan', sameAs: 'https://en.wikipedia.org/wiki/Manhattan' },
      { '@type': 'City', name: 'Queens', sameAs: 'https://en.wikipedia.org/wiki/Queens' },
      { '@type': 'City', name: 'Bronx', sameAs: 'https://en.wikipedia.org/wiki/The_Bronx' },
      { '@type': 'City', name: 'New York City', sameAs: 'https://en.wikipedia.org/wiki/New_York_City' },
    ],
    founder: { '@id': b.owner.id },
    employee: { '@id': b.owner.id },
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'license',
        name: `${b.license.type} License #${b.license.number}`,
        recognizedBy: { '@type': 'GovernmentOrganization', name: b.license.issuer },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'GAF Master Elite® Residential Roofing Contractor',
        url: b.profiles.gaf,
        recognizedBy: { '@type': 'Organization', name: 'GAF', url: 'https://www.gaf.com/' },
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Roofing services',
      itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, url: SITE + s.url } })),
    },
    knowsAbout: ['Roof replacement', 'Roof repair', 'Flat roofing', 'TPO roofing', 'EPDM roofing', 'Modified bitumen roofing', 'Asphalt shingle roofing', 'Skylight installation', 'Gutter installation', 'Vinyl siding'],
    sameAs: b.sameAs,
  };
}

export function ownerNode() {
  return {
    '@type': 'Person',
    '@id': business.owner.id,
    name: business.owner.name,
    jobTitle: 'Owner',
    url: `${SITE}/about/`,
    worksFor: { '@id': business.id },
    knowsAbout: ['Roofing', 'Flat roofing', 'Roof replacement', 'NYC building permits'],
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE + '/',
    name: business.name,
    publisher: { '@id': business.id },
    inLanguage: 'en-US',
  };
}

export interface Crumb { name: string; url: string }

export function breadcrumbNode(url: string, crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(url)}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.url) })),
  };
}

interface PageInput {
  url: string;
  title: string;
  description?: string;
  image?: string;
  published?: string;
  modified?: string;
  crumbs: Crumb[];
  kind: 'home' | 'page' | 'service' | 'post' | 'contact' | 'about' | 'collection';
  h1: string;
  serviceArea?: string;
  serviceName?: string;
  price?: { min: number; max: number; unit?: string };
  faq?: { q: string; a: string }[];
}

export function pageGraph(p: PageInput) {
  const url = abs(p.url)!;
  const typeMap = { home: 'WebPage', page: 'WebPage', service: 'WebPage', post: 'WebPage', contact: 'ContactPage', about: 'AboutPage', collection: 'CollectionPage' } as const;
  const webpage: Record<string, unknown> = {
    '@type': typeMap[p.kind],
    '@id': `${url}#webpage`,
    url,
    name: p.title,
    description: p.description || undefined,
    isPartOf: { '@id': `${SITE}/#website` },
    about: p.kind === 'post' ? undefined : { '@id': business.id },
    breadcrumb: p.crumbs.length > 1 ? { '@id': `${url}#breadcrumb` } : undefined,
    primaryImageOfPage: p.image ? { '@type': 'ImageObject', url: abs(p.image) } : undefined,
    datePublished: p.published,
    dateModified: p.modified,
    inLanguage: 'en-US',
  };
  const graph: unknown[] = [webpage];
  if (p.crumbs.length > 1) graph.push(breadcrumbNode(p.url, p.crumbs));

  if (p.kind === 'home' || p.kind === 'contact') graph.push(websiteNode(), businessNode(), ownerNode());
  else graph.push(businessRefNode());

  if (p.kind === 'service') {
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      name: p.serviceName || p.h1,
      serviceType: p.serviceName || p.h1,
      url,
      description: p.description || undefined,
      provider: { '@id': business.id },
      areaServed: p.serviceArea ? { '@type': 'City', name: p.serviceArea } : { '@type': 'City', name: 'New York City' },
      offers: p.price ? {
        '@type': 'Offer',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': p.price.unit ? 'UnitPriceSpecification' : 'PriceSpecification',
          minPrice: p.price.min,
          maxPrice: p.price.max,
          priceCurrency: 'USD',
          ...(p.price.unit ? { unitText: p.price.unit } : {}),
        },
      } : undefined,
      mainEntityOfPage: { '@id': `${url}#webpage` },
    });
  }

  if (p.kind === 'post') {
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: p.h1,
      description: p.description || undefined,
      image: p.image ? abs(p.image) : undefined,
      datePublished: p.published,
      dateModified: p.modified,
      author: { '@id': business.owner.id },
      publisher: { '@id': business.id },
      mainEntityOfPage: { '@id': `${url}#webpage` },
      inLanguage: 'en-US',
    });
    graph.push(ownerNode());
  }

  if (p.faq && p.faq.length >= 2) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
