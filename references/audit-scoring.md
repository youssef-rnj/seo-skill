# Audit, evidence and scoring (scoring v2)

Read-only. Crawl the live site (follow internal links, respect robots.txt), read the code if available,
and collect evidence with `scripts/seo-check.mjs` and the checks in `references/validation.md`.
Write the result to `seo/audit.md` using `templates/audit-report.md`.

The score is an **internal audit metric** for tracking this site's progress. It is not a Google or Bing
score, it is not a ranking factor, and it does not predict rankings or traffic.

## Evidence rules

- Every finding needs observed evidence: the exact status line, header, HTML excerpt, file:line,
  tool output or screenshot, with the tool used and the time observed (ISO 8601).
- Never present an assumption as a finding. If something cannot be checked (no Search Console access,
  no field data, page blocked, login needed), write it under **Limitations** and, if it matters, add a
  finding with status `Needs external check`.
- Never invent URLs, metrics, rankings, crawl counts or tool results. Copy numbers from the tool output.
- Search-engine behaviour comes from official documentation (Google Search Central, Bing Webmaster,
  the crawler operator's docs, schema.org, WCAG, framework docs). Cite the URL. SEO blogs are never the
  only source for a claim.

## Finding format

| Field | Content |
|---|---|
| ID | `TECH-001`, `CONT-001`, `PAGE-001`, `SCHEMA-001`, `PERF-001`, `AI-001`, `IMG-001` |
| Status | `Confirmed` · `Probable` · `Needs investigation` · `Needs external check` · `Recommendation` · `Opportunity` |
| URL(s) | Affected URLs, or "site-wide (N of M pages)" |
| Category | One owner category (table below) |
| Evidence | What was observed, verbatim where possible |
| Source | Tool or method: `curl -I`, `seo-check.mjs`, browser at 375 px, Rich Results Test, PageSpeed Insights / CrUX, Search Console, code `file:line` |
| Observed | Timestamp |
| Expected / Actual | Correct behaviour (with official source when it is a search-engine rule) vs what happens |
| Severity | critical · high · medium · low |
| Confidence | High · Medium · Low |
| Impact | What it affects (indexing, which pages, users, rich results) — no invented traffic numbers |
| Fix | Specific change; link `references/change-safety.md` when it is a high-impact change |
| Validation | How to prove the fix works (command, tool, expected output) |
| Points | Deduction × category weight / 100 (see below) |

**Severity and confidence are independent.** Severity = how much it would hurt if true. Confidence =
how sure the evidence makes you:
- **High**: directly verified with reliable evidence (status code, raw HTML, Search Console report).
- **Medium**: evidence supports it but is incomplete or depends on context (one sample page, lab data only,
  rendered-vs-raw HTML not compared).
- **Low**: hypothesis. Status must be `Needs investigation`; say what would confirm it.

A critical issue with low confidence is reported as "investigate first", never as a confirmed critical.

Status mapping: `Confirmed` needs High confidence; `Probable` = Medium; `Needs investigation` = Low.
`Recommendation` (good practice, nothing broken) and `Opportunity` (could gain, nothing wrong) are not defects.

## Weights (total 100)

| Category | Weight | Owns these checks (each check counted in ONE category only) |
|---|---|---|
| Technical | 22 | HTTPS, one canonical host, redirect chains/loops, status codes and soft 404, robots.txt, XML sitemap, noindex / X-Robots-Tag, canonical tags, main content in server HTML, viewport, duplicate hosts or old site still online, security headers (low severity: hygiene, not ranking) |
| Content | 23 | Pages answer their search intent with unique, useful content; duplicate text; who is behind the site (named people, about, contact identity); sources for factual claims; freshness of time-sensitive pages; consistency with `seo/facts.md` |
| On-page | 20 | Title present, unique, descriptive; meta description present, unique; headings describe sections; internal links and orphan pages; Open Graph / Twitter; `lang`, hreflang; readable URLs |
| Structured data | 10 | JSON-LD parses; matches visible content; organization/business fields match `seo/facts.md`; suitable types per page; no reliance on retired features |
| Performance | 10 | Core Web Vitals (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75; field data when available, lab data marked as lab), caching, compression, render-blocking and third-party scripts |
| AI-search readiness | 10 | Search and answer crawlers allowed per the owner's decision; snippet directives (`nosnippet`, `max-snippet`, `data-nosnippet`) not restricting by accident; Bing Webmaster set up; entity consistency (name, address, phone) across site, Google and Bing profiles; key answers stated plainly on the page |
| Images | 5 | `alt` on informative images, `alt=""` on decorative ones; `width`/`height`; file weight and format for the displayed size |

`llms.txt` is not scored (see `references/ai-search.md`).

## Scoring procedure

1. Each category starts at 100.
2. Each finding deducts by severity: **critical 40 · high 15 · medium 7 · low 2**, multiplied by status:
   `Confirmed` × 1, `Probable` × 0.5, every other status × 0. Floor at 0.
3. A problem that comes from one template or one setting is **one** finding (with page count), not one per page.
   The same root cause is never deducted in two categories.
4. Checks that do not apply (no blog, not a local business, no images) are skipped. If a category has
   no checks that can be evaluated with the available evidence, mark it **Not scored**, spread its weight
   over the scored categories in proportion to their weights, and state the effective weights.
5. Total = Σ (category score × effective weight / 100), rounded to an integer.
6. **Critical flags.** If any of these is `Confirmed`, the total is capped at **49** and the flags are shown
   above the score:
   - Important pages carry `noindex` or are blocked by robots.txt.
   - Canonical host broken: HTTPS errors, redirect loop, or the home page not reachable.
   - Important pages return 5xx, 404 or soft 404.
   - Canonical tags send important pages to a wrong URL or another host.
   - Main content missing from the HTML Google receives (verified with URL Inspection or rendered HTML).
   - A manual action or security issue reported in Search Console.
   A `Probable` critical flag does not cap the score; it is listed first under "investigate first".
7. Points per finding = deduction × status multiplier × effective weight / 100. Sort findings by points.
8. Write the score as `NN/100 (scoring v2)`. Scores from older audits (v1: no rubric) are not comparable;
   for before/after, re-score the "before" evidence with v2 or say they are not comparable.

Same evidence must give the same score. If two readings are possible, take the lower severity and
explain why in the finding.

## Checks that are easy to miss

- `http://` and `www.` variants each answer with one 301/308 to the canonical host (not a chain, not a 200).
- Server listening on unexpected public ports that serve the site without HTTPS.
- Admin paths listed in robots.txt (public disclosure) or answering 200 without auth.
- Carousels or sliders cloning items in the server HTML (duplicate images and text).
- JSON-LD that claims things not shown on the page, or a different phone/address than the footer.
- `lastmod` in the sitemap equal to the deploy date for every page (Google then ignores it).
- An old version of the site still online on another domain or platform (duplicate content).
- `nosnippet` or `max-snippet:0` left on pages by a theme or plugin (also removes them from AI Overviews input).
