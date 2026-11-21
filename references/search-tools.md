# Search engines and listings

The user signs in to every tool. Ask before each change that is saved on an external service.

## Google Search Console
1. Domain property (`sc-domain:example.com`), verified by DNS.
2. Sitemaps: submit `https://example.com/sitemap.xml`; remove sitemaps of an old site version.
3. Pages report. Normal on a new or migrated site: "Discovered – currently not indexed" (queue),
   "Page with redirect" (http/www), "Not found (404)" for old URLs without equivalent, robots-blocked
   build assets (fonts). Real problems: unexpected `noindex`, wrong canonical, 5xx, soft 404.
4. URL inspection → "Request indexing" for key pages after launch or a big change. Quota is about
   10 per day per Google account (shared across properties); stop on "Quota exceeded" and continue next day.
5. Performance: queries, pages, countries. Brand-only queries mean the service pages are not ranking yet.

## Bing Webmaster Tools
1. Add the site or import from Search Console.
2. Submit the sitemap; check it is "Success".
3. URL Submission: paste all URLs (up to 100 per day).

## Google Business Profile (local businesses)
Check every field against `seo/facts.md`: name, primary and extra categories, address or service area,
phone, website (tracking parameters allowed), hours, founding date, description (≤ 750 characters, no
claims that cannot be verified), services, attributes, photos (square logo 1000×1000, cover 1920×1080,
real photos), booking link → the site's contact or booking page, social profiles → official company
profiles only (Google may auto-insert personal profiles: replace them).
Booking links from an old platform live under "Bookings"; edit them with the pencil.

## Bing Places
Import from Google Business Profile (needs a verified Google profile and the Google pop-up allowed),
or "Create a listing" manually; verification is often by mailed PIN; other fields unlock after verification.

## Apple Business Connect
Claim the place for Apple Maps and Siri with the same identity.

## Analytics
GA4 or an alternative, loaded only after cookie consent. Add "How did you hear about us?" to forms.
