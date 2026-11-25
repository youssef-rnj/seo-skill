# On-page and structured data

Numbers below are **guidelines**, not rules. Google documents no length limit for titles or meta
descriptions (developers.google.com/search/docs/appearance/title-link, …/snippet) and no word count
(SEO starter guide). Never report or change something only because a count is outside a range;
report it when it hurts users or search display, with the evidence.

## Every page
- [ ] Title present, unique and describes the page. Main words first; around 50–60 characters usually
      shows in full (Google truncates by display width). Brand suffix ("Topic | Brand") is optional; drop it
      when it pushes the topic out of view.
- [ ] Meta description present and unique: a sentence that summarises the page (service + place + benefit
      for local pages). Around 120–160 characters usually shows in full; Google often writes its own snippet.
- [ ] Headings describe their section; one visible main heading (H1) is the usual pattern. Heading order
      is an accessibility practice (WCAG advisory), not a ranking factor: low severity at most.
- [ ] Short, readable slug in the site language.
- [ ] `alt` on informative images; `alt=""` on decorative ones.
- [ ] Internal links: services ↔ related articles ↔ contact. No orphan page.
- [ ] Open Graph (title, description, image — 1200×630 is the common size, `locale`, `site_name`) and
      `twitter:card=summary_large_image`.
- [ ] `<html lang>`; hreflang only for real translated versions.
- [ ] Local businesses: city in titles where it reads naturally, address in the footer. `geo.region` /
      `geo.position` meta tags are optional (no documented effect in Google Search).

## Structured data (JSON-LD)

Rules from Google's structured data policies (developers.google.com/search/docs/appearance/structured-data/sd-policies):
markup must represent the visible page content; never mark up content that is not shown. Breaking this can
bring a manual action that removes rich results. JSON-LD is Google's recommended format.

Give each entity one stable `@id` (e.g. `https://example.com/#organization`) and reference it everywhere.
Templates: `templates/nextjs/jsonld.tsx`, `templates/static/seo.js`.

| Page | Types |
|---|---|
| All pages | Organization or most specific LocalBusiness subtype (`ProfessionalService`, `LegalService`, `Electrician`, `HousekeepingService`…) and `WebSite` |
| Inner pages | `BreadcrumbList` |
| Service pages | `Service` with `provider` → organization, `areaServed`, `serviceType`, optional `offers` |
| Pages with visible Q&A | `FAQPage` optional: valid schema.org, but Google retired the FAQ rich result on 2026-05-07 |
| About / team | `AboutPage`, `Person` per expert (`name`, `jobTitle`, `description`, `sameAs` LinkedIn, `worksFor`) |
| Articles | `BlogPosting` (`headline`, `datePublished`, `dateModified`, `image`, `author` → Person, `publisher`) |
| Blog index | `CollectionPage` / `Blog` |
| Contact | `ContactPage` |

Do not add `HowTo` for rich results (retired 2023). Before promising a rich result for any type, check it is
still listed in Google's search gallery (developers.google.com/search/docs/appearance/structured-data/search-gallery).

Organization checklist: `name`, `legalName`, `url`, `logo`, `image`, `description`, `telephone`, `email`,
`address` (PostalAddress), `geo`, `openingHoursSpecification`, `areaServed`, `foundingDate`,
`identifier` (company number as PropertyValue), `sameAs` (official profiles only), `contactPoint`.
Omit any field the user cannot confirm (e.g. no `priceRange` without real prices).

Article author: the byline must contain the person's exact name so the article links to their Person
entity. Validate: JSON parses (`scripts/seo-check.mjs`), Rich Results Test for eligible types, Schema
Markup Validator for the rest; values match the visible page and `seo/facts.md`.
