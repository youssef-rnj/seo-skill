// next.config.ts — security headers and 301 redirects from an old site. Merge into your config.
import type { NextConfig } from 'next';

const SECURITY_HEADERS = [
  // Start in report-only; enforce after a few weeks without violations.
  { key: 'Content-Security-Policy-Report-Only', value: "default-src 'self'; img-src 'self' data: https:; object-src 'none'; base-uri 'self'; frame-ancestors 'self'" },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  // Check that every subdomain answers HTTPS before enabling includeSubDomains.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

// Old URL → closest new page. Old pages with no equivalent stay 404 (no blanket redirect to "/").
// Most specific rules first: Next applies the first match.
const OLD_SITE_REDIRECTS: [string, string][] = [
  ['/old-team-page', '/about'],
  ['/contactus', '/contact'],
  ['/blog/old-category/old-post-12', '/blog/new-post-slug'],
  ['/blog/:path*', '/blog'],
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
  async redirects() {
    // statusCode 301 rather than permanent:true (308): every crawler and audit tool reads 301 the same way.
    return OLD_SITE_REDIRECTS.map(([source, destination]) => ({ source, destination, statusCode: 301 as const }));
  },
};

export default nextConfig;
