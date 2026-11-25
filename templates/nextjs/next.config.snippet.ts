// next.config.ts — security headers and 301 redirects from an old site. Merge into your config.
// High-impact file: follow references/change-safety.md (current state, approval, rollback) before deploying.
import type { NextConfig } from 'next';

// CSP violations are only visible if something collects them. Either keep the reporting endpoint
// (an API route that logs the JSON body) or delete both report lines and check the browser console
// on key pages by hand. Enforce (rename to Content-Security-Policy) only after a period with no violations.
const CSP_REPORT_PATH = '/api/csp-report';

// HSTS is cached by browsers for max-age seconds and cannot be undone over HTTP.
// Ramp: 300 → 604800 (1 week) → 31536000 (1 year), each step after checking nothing broke.
// Add includeSubDomains only after confirming EVERY subdomain answers HTTPS. preload is a separate,
// hard-to-reverse decision (hstspreload.org) and is never added by default.
const HSTS = 'max-age=300';

const SECURITY_HEADERS = [
  { key: 'Reporting-Endpoints', value: `csp="${CSP_REPORT_PATH}"` },
  {
    key: 'Content-Security-Policy-Report-Only',
    value: `default-src 'self'; img-src 'self' data: https:; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; report-to csp; report-uri ${CSP_REPORT_PATH}`,
  },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Strict-Transport-Security', value: HSTS },
];

// Old URL → closest new page, one exact path per line. Old pages with no equivalent stay 404
// (no blanket redirect to "/" or to a section index: that is a soft 404).
// Next.js checks redirects BEFORE pages and /public, so never use a wildcard on a prefix the new site
// also uses: ['/blog/:path*', '/blog'] would send every new article to /blog.
const OLD_SITE_REDIRECTS: [string, string][] = [
  ['/old-team-page', '/about'],
  ['/contactus', '/contact'],
  ['/blog/old-category/old-post-12', '/blog/new-post-slug'],
  // A wildcard is safe only when the old prefix no longer exists on the new site AND every old slug
  // has the same slug on the new site (check the list in seo/redirects.md first):
  ['/news/:slug', '/blog/:slug'],
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
  async redirects() {
    // statusCode 301 rather than permanent:true (308). Google treats both as permanent; 301 is the
    // most widely understood by older clients and audit tools.
    return OLD_SITE_REDIRECTS.map(([source, destination]) => ({ source, destination, statusCode: 301 as const }));
  },
};

export default nextConfig;
