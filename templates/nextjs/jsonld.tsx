// components/JsonLd.tsx — organization, website, service, breadcrumb, person and article JSON-LD.
// Fill BUSINESS only with facts the owner confirmed. Delete any field you cannot confirm.

export const SITE_URL = 'https://example.com';
export const ORG_ID = `${SITE_URL}/#organization`;

export const BUSINESS = {
  '@type': 'ProfessionalService', // most specific type: LegalService, Electrician, Dentist…
  '@id': ORG_ID,
  name: 'Example Company',
  legalName: 'Example Company SRL',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/opengraph-image.png`,
  description: 'One factual sentence: what, for whom, where.',
  telephone: '+00 000 00 00 00',
  email: 'info@example.com',
  foundingDate: '2024',
  identifier: { '@type': 'PropertyValue', propertyID: 'Company number', value: '0000.000.000' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Street 1',
    postalCode: '0000',
    addressLocality: 'City',
    addressCountry: 'BE',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 0, longitude: 0 },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  areaServed: [{ '@type': 'Country', name: 'Belgium' }],
  sameAs: ['https://www.linkedin.com/company/example/'], // official company profiles only
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: '+00 000 00 00 00',
    email: 'info@example.com',
    availableLanguage: ['fr', 'en'],
  },
};

export const website = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: 'Example Company',
  publisher: { '@id': ORG_ID },
};

export const service = (name: string, path: string, description: string) => ({
  '@type': 'Service',
  '@id': `${SITE_URL}${path}#service`,
  name,
  description,
  url: `${SITE_URL}${path}`,
  provider: { '@id': ORG_ID },
  areaServed: BUSINESS.areaServed,
});

export const breadcrumb = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
});

export const person = (slug: string, name: string, jobTitle: string, linkedin?: string, bio?: string) => ({
  '@type': 'Person',
  '@id': `${SITE_URL}/about#${slug}`,
  name,
  jobTitle,
  worksFor: { '@id': ORG_ID },
  ...(bio ? { description: bio } : {}),
  ...(linkedin ? { sameAs: [linkedin] } : {}),
});

// Author: pass the Person @id whose exact name appears in the article byline.
export const article = (a: {
  slug: string; title: string; description: string; image: string;
  published: string; modified: string; authorId: string;
}) => ({
  '@type': 'BlogPosting',
  '@id': `${SITE_URL}/blog/${a.slug}#article`,
  headline: a.title,
  description: a.description,
  image: a.image,
  datePublished: a.published,
  dateModified: a.modified,
  author: { '@id': a.authorId },
  publisher: { '@id': ORG_ID },
  mainEntityOfPage: `${SITE_URL}/blog/${a.slug}`,
});

// Google stopped showing FAQ rich results on 2026-05-07. The markup is still valid schema.org and
// harmless; add it only for Q&A visible on the page, and expect no rich result from it.
export const faq = (qa: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: qa.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

// Render one script with an @graph. Only include FAQ when the Q&A is visible on the page.
// Escape "<" so a "</script>" inside any CMS field cannot close the tag (Next.js JSON-LD guide).
export function JsonLd({ graph }: { graph: object[] }) {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
