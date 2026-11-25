# Validation

A successful build proves the code compiles, nothing more. Report every check as **Passed**, **Failed** or
**Not run (reason)**. Never write "validated" or "verified" for a check that was not run.

## Before / after

Before a change: run the checks for the affected URLs and save the output (`seo/evidence/before-<date>.json`).
After the deploy: run the same checks on the live site, save `after-<date>.json`, and compare. Re-run the
whole automated set after any deploy that touched routing, layout, headers or the sitemap (regression).

## Automated (`node scripts/seo-check.mjs`, Node ≥ 18, no install; or `curl`)

```
node scripts/seo-check.mjs https://example.com            # home + sitemap URLs (first 50)
node scripts/seo-check.mjs https://example.com --hosts    # also http:// and www. variants
node scripts/seo-check.mjs https://example.com/a https://example.com/b --json > seo/evidence/after.json
```

| Check | What passes |
|---|---|
| Status codes | Indexable pages 200; removed pages 404/410; private pages not 200 without auth |
| Redirect chains and loops | Host variants and old URLs: one hop to a 200 |
| Canonical | Present, absolute, equal to the final URL (unless intentionally different) |
| Indexability | No unexpected `noindex` in meta or `X-Robots-Tag` |
| robots.txt | Reachable; key URLs not disallowed for `*` or Googlebot; `Sitemap:` line |
| Sitemap | Parses; every URL 200, not redirected, equal to its canonical, same host |
| Title / description | Present and unique across checked pages (length shown as information only) |
| Headings | Count of H1 (information; accessibility practice) |
| Open Graph | `og:title`, `og:description`, `og:image` present |
| JSON-LD | Every block parses; `@type` listed |
| Images | `<img>` without `alt` or without `width`/`height` counted |
| Internal links | Links found on the checked pages return 200 (sampled, see `--links`) |
| Viewport | `<meta name="viewport">` present |

`curl` equivalents: `curl -sIL <url>` (chain), `curl -s <url> | grep -i canonical`.

## Browser (manual, say so in the report)

- Rendering at desktop width and 375 px: main content, no horizontal scroll, menus usable.
- Rendered vs raw HTML: main text and links present in raw HTML.
- Console free of CSP or hydration errors after header changes.

## External tools (need the user or a browser; record the date)

| Tool | For |
|---|---|
| Rich Results Test / Schema Markup Validator | Structured data eligibility and errors |
| PageSpeed Insights (field data = CrUX) | Core Web Vitals; say "lab only" when there is no field data |
| Search Console: URL Inspection, Pages, Sitemaps, robots.txt report, Manual actions | Indexing as Google sees it |
| Bing Webmaster: URL Inspection, Sitemaps | Indexing in Bing (and Copilot) |

## Limits

Indexing and ranking changes take days to weeks and depend on the engines; never report them as done
because a request was sent. Field Core Web Vitals need 28 days of traffic data.
