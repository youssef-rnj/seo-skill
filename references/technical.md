# Technical SEO checklist

Templates: `templates/nextjs/` (Next.js App Router), `templates/static/` (Vite, static, any server).
Items marked ⚠ are high-impact: follow `references/change-safety.md` (current state, approval, rollback)
and verify with `references/validation.md`.

## Hosts and redirects
- [ ] ⚠ HTTPS only. `http://` and `www.` → one 301 (or 308) to the canonical host. No redirect chains.
- [ ] ⚠ Canonical tag on every page, self-referencing, absolute URL, no query parameters.
- [ ] Real 404 status for missing pages (not a 200 "not found" page).
- [ ] Trailing slash policy consistent (one form 301s to the other).

## Crawling
- [ ] ⚠ robots.txt (`templates/*/robots*`): allow public pages, block `/api/`, `/admin/` and build internals,
      `Sitemap:` line. Allow search and answer crawlers. Training crawlers: owner's decision (`references/ai-search.md`).
- [ ] Never list a secret admin URL in robots.txt; give it `noindex` (meta + `X-Robots-Tag`) and auth.
- [ ] XML sitemap: all indexable, canonical pages and articles, absolute URLs, real `lastmod` (last visible
      change; Google uses it only if consistently accurate), no `priority`/`changefreq` (Google and Bing ignore them). Articles added automatically from the CMS.
- [ ] ⚠ `noindex` on thank-you, login, admin, search results, cart and other private pages.

## Rendering
- [ ] ⚠ Main text, headings and links present in the HTML the server sends (SSR, SSG or prerender).
- [ ] No duplicated content in server HTML (carousel clones are added client-side after hydration).
- [ ] No content hidden behind clicks that Google cannot reach (tabs are fine if in the HTML).

## Security headers (server or framework)
- [ ] ⚠ `Strict-Transport-Security`, ramped: `max-age=300` → 1 week → 1 year. Browsers cache it and it
      cannot be undone over HTTP. `includeSubDomains` only after every subdomain answers HTTPS;
      `preload` is a separate, hard-to-reverse decision (hstspreload.org), never a default.
- [ ] `Permissions-Policy` disabling unused features.
- [ ] ⚠ `Content-Security-Policy-Report-Only` first, with a reporting endpoint or a manual console check;
      enforce only after a period with no violations. Security headers are hygiene, not ranking factors.
- [ ] Hide stack versions (`X-Powered-By`, `server_tokens off`).

## Performance and images
- [ ] Images in WebP/AVIF, sized for their display, `width` and `height` on every `<img>`.
- [ ] Lazy-load below-the-fold images; preload the hero image; `fetchpriority="high"` on the LCP image.
- [ ] Fonts self-hosted, `font-display: swap`; long cache headers on hashed static files.
- [ ] Before adding width/height to existing images, confirm CSS already sizes them (both dimensions or
      width + `height:auto`) so the layout does not change; measure rendered sizes before/after.

## Mobile
- [ ] Viewport meta, readable at 375 px, no horizontal scroll. Tap targets at least 24×24 px (WCAG 2.2 AA);
      44×44 px recommended (AAA).

## Build safety
- [ ] Builds that download remote assets (e.g. Google Fonts) retry instead of failing the deploy.
- [ ] Deploy keeps the previous version live if the build fails.
