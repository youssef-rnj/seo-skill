# Technical SEO checklist

Templates: `templates/nextjs/` (Next.js App Router), `templates/static/` (Vite, static, any server).

## Hosts and redirects
- [ ] HTTPS only. `http://` and `www.` → one 301 to the canonical host. No redirect chains.
- [ ] Canonical tag on every page, self-referencing, absolute URL, no query parameters.
- [ ] Real 404 status for missing pages (not a 200 "not found" page).
- [ ] Trailing slash policy consistent (one form 301s to the other).

## Crawling
- [ ] robots.txt (`templates/*/robots*`): allow public pages, block `/api/`, `/admin/` and build internals,
      `Sitemap:` line. Allow search and AI-answer bots. Training-only bots: user's choice.
- [ ] Never list a secret admin URL in robots.txt; give it `noindex` (meta + `X-Robots-Tag`) and auth.
- [ ] XML sitemap: all indexable pages and articles, absolute URLs, real `lastmod` (last visible change),
      no `priority`/`changefreq`. Articles added automatically from the CMS.
- [ ] `noindex` on thank-you, login, admin, search results, cart and other private pages.

## Rendering
- [ ] Main text, headings and links present in the HTML the server sends (SSR, SSG or prerender).
- [ ] No duplicated content in server HTML (carousel clones are added client-side after hydration).
- [ ] No content hidden behind clicks that Google cannot reach (tabs are fine if in the HTML).

## Security headers (server or framework)
- [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains` (check every subdomain answers HTTPS first; `preload` is a separate decision).
- [ ] `Permissions-Policy` disabling unused features.
- [ ] `Content-Security-Policy-Report-Only` first, enforce after a clean period.
- [ ] Hide stack versions (`X-Powered-By`, `server_tokens off`).

## Performance and images
- [ ] Images in WebP/AVIF, sized for their display, `width` and `height` on every `<img>`.
- [ ] Lazy-load below-the-fold images; preload the hero image; `fetchpriority="high"` on the LCP image.
- [ ] Fonts self-hosted, `font-display: swap`; long cache headers on hashed static files.
- [ ] Before adding width/height to existing images, confirm CSS already sizes them (both dimensions or
      width + `height:auto`) so the layout does not change; measure rendered sizes before/after.

## Mobile
- [ ] Viewport meta, readable at 375 px, tap targets ≥ 44 px, no horizontal scroll.

## Build safety
- [ ] Builds that download remote assets (e.g. Google Fonts) retry instead of failing the deploy.
- [ ] Deploy keeps the previous version live if the build fails.
