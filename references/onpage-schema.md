# On-page and structured data

## Every page
- [ ] Title unique, ≤ 60 characters with the brand suffix ("Topic | Brand"). If topic + suffix > 60, use the topic alone.
- [ ] Meta description unique, 120–160 characters, one full sentence: service + place + benefit.
- [ ] One H1; H2/H3 in order, no skipped level.
- [ ] Short slug in the site language with the main keyword.
- [ ] `alt` on informative images; `alt=""` on decorative ones.
- [ ] Internal links: services ↔ related articles ↔ contact. No orphan page.
- [ ] Open Graph (title, description, 1200×630 image, `locale`, `site_name`) and `twitter:card=summary_large_image`.
- [ ] `<html lang>`; hreflang only for real translated versions.
- [ ] Local businesses: city in titles where natural, `geo.region` / `geo.position` meta, address in footer.

## Structured data (JSON-LD)

Give each entity one stable `@id` (e.g. `https://example.com/#organization`) and reference it everywhere.
Templates: `templates/nextjs/jsonld.tsx`, `templates/static/seo.js`.

| Page | Types |
|---|---|
| All pages | Organization or most specific LocalBusiness subtype (`ProfessionalService`, `LegalService`, `Electrician`, `HousekeepingService`…) and `WebSite` |
| Inner pages | `BreadcrumbList` |
| Service pages | `Service` with `provider` → organization, `areaServed`, `serviceType`, optional `offers` |
| Pages with visible Q&A | `FAQPage` (only questions and answers shown on the page) |
| About / team | `AboutPage`, `Person` per expert (`name`, `jobTitle`, `description`, `sameAs` LinkedIn, `worksFor`) |
| Articles | `BlogPosting` (`headline`, `datePublished`, `dateModified`, `image`, `author` → Person, `publisher`) |
| Blog index | `CollectionPage` / `Blog` |
| Contact | `ContactPage` |

Organization checklist: `name`, `legalName`, `url`, `logo`, `image`, `description`, `telephone`, `email`,
`address` (PostalAddress), `geo`, `openingHoursSpecification`, `areaServed`, `foundingDate`,
`identifier` (company number as PropertyValue), `sameAs` (official profiles only), `contactPoint`.
Omit any field the user cannot confirm (e.g. no `priceRange` without real prices).

Article author: the byline must contain the person's exact name so the article links to their Person
entity. Validate with Google's Rich Results Test; JSON-LD must match the visible page.
