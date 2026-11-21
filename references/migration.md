# Migrating from an old site without losing SEO

1. **List every old URL**: the old sitemap (`/sitemap.xml`), Search Console (Pages and Performance →
   pages), backlinks reports, the old platform's page list.
2. **Map each one** to the closest new page. No real equivalent → leave a 404 (redirecting everything
   to the home page is a soft 404). Keep the table in `seo/redirects.md` for review.
3. **301 on the new site** for old paths that hit the new domain (framework redirects or server rules).
4. **If the old platform is still online on another address** (e.g. `name.odoo.com`, `name.wixsite.com`,
   an old WordPress), redirect there too, otherwise both versions compete:
   - Many builders serve a published page before checking their redirect rules: the old page must be
     **unpublished** (not deleted) for its redirect to fire. Ask the owner before unpublishing; it is
     reversible.
   - Admins stay logged in and still see unpublished pages: verify as an anonymous visitor
     (`curl -I`, private window).
   - Check the old platform for live business use before unpublishing (bookings, shop, forms).
   - Category or listing pages that cannot be unpublished are left empty; mention them.
5. **External links**: update Google Business Profile (website, booking link), social profiles,
   directories to the new URLs.
6. **Search Console**: remove the old site's sitemaps; submit the new one; request indexing of key pages.
7. **Verify**: every mapped old URL answers 301 to the right page as an anonymous visitor.
