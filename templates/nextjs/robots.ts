// app/robots.ts — Next.js App Router. Replace SITE_URL.
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://example.com';

const PRIVATE = ['/api/', '/admin/'];
// Build internals stay crawlable where Google needs them to render the page.
const ASSETS = ['/_next/static/', '/_next/image'];

export default function robots(): MetadataRoute.Robots {
  const searchAndAnswerBots = [
    'Googlebot',
    'Bingbot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'PerplexityBot',
    'Perplexity-User',
    'Claude-SearchBot',
    'Claude-User',
  ];

  return {
    rules: [
      { userAgent: searchAndAnswerBots, allow: ['/', ...ASSETS], disallow: [...PRIVATE, '/_next/'] },
      // Gemini apps / Vertex grounding. No effect on Google Search or AI Overviews.
      { userAgent: 'Google-Extended', allow: '/', disallow: PRIVATE },
      // Training-only crawlers: owner's choice. Remove these lines to allow them.
      { userAgent: ['GPTBot', 'CCBot', 'ClaudeBot', 'anthropic-ai'], disallow: '/' },
      { userAgent: '*', allow: ['/', ...ASSETS], disallow: [...PRIVATE, '/_next/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // Never list secret admin URLs here: robots.txt is public. Use noindex + auth instead.
  };
}
