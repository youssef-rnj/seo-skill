# Search engines and listings

The user signs in to every tool. Ask before each change that is saved on an external service.

## Google Search Console
1. Domain property (`sc-domain:example.com`), verified by DNS.
2. Sitemaps: submit `https://example.com/sitemap.xml`; remove sitemaps of an old site version.
3. Pages report. Normal on a new or migrated site: "Discovered – currently not indexed" (queue),
   "Page with redirect" (http/www), "Not found (404)" for old URLs without equivalent, robots-blocked
   build assets (fonts). Real problems: unexpected `noindex`, wrong canonical, 5xx, soft 404.
4. URL inspection → "Request indexing" for key pages after launch or a big change. Google documents a
   daily quota without a number (about 10 per day is commonly observed); stop on "Quota exceeded" and
   continue the next day. Requesting indexing does not guarantee indexing.
5. Performance: queries, pages, countries. Brand-only queries mean the service pages are not ranking yet.
   AI Mode data is included in the totals.
6. Settings → "Search generative AI control": record its state in `seo/facts.md`; changing it is the owner's
   decision (it controls use in AI Overviews / AI Mode, see `references/ai-search.md`).
7. Security & Manual actions: any entry is a critical flag in the audit.

## Bing Webmaster Tools
1. Add the site or import from Search Console.
2. Submit the sitemap; check it is "Success". Bing uses an accurate `lastmod`.
3. New and changed URLs: IndexNow is Bing's recommended method (indexnow.org: key file at the site root,
   up to 10,000 URLs per request, shared with the other IndexNow engines). Manual URL Submission in the
   tool also works; read the quota shown there.
4. AI Performance report: citations in Copilot and Bing AI answers. Record, don't promise.

## Google Business Profile (local businesses)
Check every field against `seo/facts.md`: name, primary and extra categories, address or service area,
phone, website (tracking parameters allowed), hours, founding date, description (750 characters maximum,
no links, no promotions or prices, no claims that cannot be verified), services, attributes, real photos
(follow the size guidance shown in the profile editor), booking link → the site's contact or booking page, social profiles → official company
profiles only (Google may auto-insert personal profiles: replace them).
Booking links from an old platform live under "Bookings"; edit them with the pencil.

## Bing Places
Import from Google Business Profile (needs a verified Google profile and the Google pop-up allowed),
or "Create a listing" manually; verification is often by mailed PIN; other fields unlock after verification.

## Apple Business Connect
Claim the place for Apple Maps and Siri with the same identity.

## Analytics
GA4 or an alternative, loaded only after cookie consent. Add "How did you hear about us?" to forms.
