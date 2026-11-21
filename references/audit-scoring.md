# Audit and scoring

Read-only. Crawl the live site (follow internal links, respect robots.txt) and read the code if available.

## Weights (total 100)

| Category | Weight | What it covers |
|---|---|---|
| Technical | 22 | HTTPS, one canonical host, 301s, robots.txt, sitemap, status codes, noindex on private pages, headers, server-rendered HTML, mobile |
| Content | 23 | Thin pages (< 300 words), duplicate text, named experts / authors, sources, freshness, E-E-A-T signals |
| On-page | 20 | Titles (≤ 60), descriptions (120–160), one H1, heading order, internal links, OG/Twitter, lang |
| Structured data | 10 | Organization/LocalBusiness completeness, Service, Breadcrumb, FAQ, Person, Article; valid and matching visible content |
| Performance | 10 | LCP, INP, CLS (field data if available, else lab), image weight, caching |
| AI-search readiness | 10 | llms.txt, AI bots allowed, direct-answer intros, citable facts, sources |
| Images | 5 | alt text, width/height, modern formats, sizes |

Score each category 0–100, then weight. Round to an integer.

## Issue format

| Points | Severity | Category | Page | Evidence | Fix |
|---|---|---|---|---|---|
| +3.5 | high | content | / | No named expert in structured data | Add Person entities for founders, linked from the organization |

Severity: **critical** blocks indexing or causes penalties; **high** clearly hurts ranking; **medium**
optimisation; **low** nice to have. Sort by points gained.

## Checks that are easy to miss

- `http://` and `www.` variants each answer with one 301 to the canonical host (not a chain, not a 200).
- Server listening on unexpected public ports that serve the site without HTTPS.
- Admin paths listed in robots.txt (public disclosure) or answering 200 without auth.
- Carousels or sliders cloning items in the server HTML (duplicate images and text).
- Titles that exceed 60 characters only because of the brand suffix.
- JSON-LD that claims things not shown on the page, or a different phone/address than the footer.
- `lastmod` in the sitemap equal to the deploy date for every page (Google then ignores it).
- An old version of the site still online on another domain or platform (duplicate content).
