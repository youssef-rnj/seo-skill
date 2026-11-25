// seo.js — one source of truth for titles, descriptions and JSON-LD on a Vite/React or static site.
// A prerender script reads `pages` to write each page's <head> and the sitemap.
export const SITE_URL = 'https://example.com'
const BUSINESS_ID = `${SITE_URL}/#business`

export const pages = {
  '/': {
    title: 'Main service in City | Brand', // main words first; ~60 chars shows in full (guideline)
    description: 'One sentence: service, place, benefit, call to action (~120–160 chars shows in full).',
  },
  '/services/example': {
    title: 'Example service in City | Brand',
    description: '120–160 characters.',
    breadcrumb: 'Example service',
    service: { name: 'Example service', serviceType: 'Example', offers: ['Item one', 'Item two'] },
    faq: [], // [{ q: '…', a: '…' }] only if shown on the page
  },
  '/privacy': { title: 'Privacy policy | Brand', description: '120–160 characters.' },
}

export const notFound = { title: 'Page not found | Brand', description: '…', noindex: true }

// Fill only with confirmed facts; delete what you cannot confirm.
export const business = {
  '@type': ['LocalBusiness'], // e.g. ['Electrician', 'HousekeepingService']
  '@id': BUSINESS_ID,
  name: 'Brand',
  legalName: 'Brand SRL',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  telephone: '+00000000000',
  email: 'info@example.com',
  address: { '@type': 'PostalAddress', streetAddress: 'Street 1', postalCode: '0000', addressLocality: 'City', addressCountry: 'BE' },
  geo: { '@type': 'GeoCoordinates', latitude: 0, longitude: 0 },
  openingHoursSpecification: [], // add when the owner confirms hours
  areaServed: [{ '@type': 'Country', name: 'Belgium' }],
  sameAs: [], // official profiles only
}

export function jsonLdFor(path) {
  const seo = pages[path]
  const graph = [business]
  if (seo?.breadcrumb) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: seo.breadcrumb, item: `${SITE_URL}${path}` },
      ],
    })
  }
  if (seo?.service) {
    graph.push({
      '@type': 'Service',
      name: seo.service.name,
      serviceType: seo.service.serviceType,
      provider: { '@id': BUSINESS_ID },
      areaServed: business.areaServed,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: seo.service.name,
        itemListElement: seo.service.offers.map((o) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: o } })),
      },
    })
  }
  if (seo?.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: seo.faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}
