# Change safety (high-impact changes)

Read before any change marked ⚠ in `references/technical.md`, any redirect or migration work, and any
change to indexing directives, headers, rendering, DNS or CDN settings. The rules in `SKILL.md`
(approval for visible text, ask before deploys and external changes) still apply on top of this.

## Procedure

1. **Current state.** Record what exists now, with evidence: the file and line, or `curl -sI` output, or the
   rendered tag. Save it in `seo/log.md` (this is the rollback reference).
2. **Expected impact.** What changes for users, crawlers and which URLs.
3. **Side effects.** Use the table below; check subdomains, other apps on the same server or CDN, caches.
4. **Scope.** List the exact URLs, hosts or paths affected. Anything broader than intended is a stop.
5. **Approval.** Show the diff and steps 1–4 to the user; wait for a yes. DNS, CDN, server and
   hosting-panel changes are made by the user or with the user signed in, never with credentials typed by you.
6. **Small steps.** One kind of change per commit/deploy, on a branch; ramp values that browsers cache.
7. **Validate.** Run the matching checks in `references/validation.md` on a preview/local build first, then live.
8. **Rollback.** Write the rollback steps before deploying; keep the previous config or commit ready.

## Risks by change type

| Change | Main risks | Validate | Roll back |
|---|---|---|---|
| Redirects / migration | Catch-alls that capture live pages; chains; loops; redirecting to `/` (soft 404); old platform still serving | Every mapped URL: one hop, final 200, right target; new pages still 200 | Revert commit/config; redirects cached by browsers (301), so fix forward if live long |
| robots.txt | `Disallow: /` or blocking CSS/JS; wrong group precedence; exposing private paths | Fetch live file; check key URLs per user agent; GSC robots.txt report | Restore previous file; recrawl takes time |
| `noindex` / `X-Robots-Tag` | Applied site-wide by a layout or header rule | Raw HTML and headers on key pages and on the private pages | Remove directive; request indexing of key pages |
| Canonical tags | Wrong host, protocol, trailing slash, or all pages → home | Compare canonical to final URL on a sample of every template | Revert; Google re-evaluates on recrawl |
| Sitemap | Non-canonical, redirected or 404 URLs; fake `lastmod` | Every sitemap URL returns 200 and equals its canonical | Restore previous generator; resubmit |
| HSTS | Locks browsers to HTTPS for max-age; breaks HTTP-only subdomains; preload is near-permanent | Header present on all hosts; every subdomain on HTTPS | Only by serving `max-age=0` over HTTPS and waiting; hence the ramp |
| CSP | Enforced policy blocks scripts, fonts, analytics, forms | Report-only first; reports or console clean on all templates | Switch back to report-only |
| Other headers / middleware | Header dropped on some paths (nginx inheritance), caching of personalised pages | `curl -sI` on each location type | Revert config; purge CDN |
| Rendering (SSR/SSG/prerender) | Content missing for crawlers; hydration errors; duplicated content | Raw HTML contains main text, links, title; browser at 375 px; URL Inspection | Revert commit |
| Structured data | Claims not visible on the page; wrong facts | JSON parses; matches page and `seo/facts.md`; Rich Results Test | Revert; low risk |
| DNS / CDN | Site or mail outage; certificate errors; cache serving stale or wrong host | Resolve all hosts; HTTPS valid; headers through CDN | Restore previous records (TTL delay) |
| Visible content | Not approved; facts not confirmed | Approval recorded; diff matches the approved draft | Revert commit |

Never: delete pages or old-platform content (unpublish instead, with approval), submit removals in Search
Console, change DNS, or enable `preload` without an explicit yes for that specific action.
