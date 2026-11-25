// app/robots.ts — Next.js App Router. Replace SITE_URL.
// A crawler follows only the most specific group that names it (not merged with "*"), so every group
// repeats the private paths. robots.txt controls crawlers; user-triggered fetchers (ChatGPT-User,
// Perplexity-User, Claude-User, Google user-triggered fetchers) may not apply it. Sources:
// developers.google.com/search/docs/crawling-indexing/robots/robots_txt, references/ai-search.md.
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://example.com';

const PRIVATE = ['/api/', '/admin/'];
// Build internals stay crawlable where crawlers need them to render the page.
const ASSETS = ['/_next/static/', '/_next/image'];

// DECISION REQUIRED (owner): allow or block crawlers that collect content for AI model training.
// Blocking them does not affect Google Search, Bing, ChatGPT search, Perplexity or Claude search results.
// Record the owner's choice in seo/facts.md. Set to false to allow them.
const BLOCK_AI_TRAINING = true;

export default function robots(): MetadataRoute.Robots {
  const searchAndAnswerCrawlers = [
    'Googlebot',
    'Bingbot',
    'OAI-SearchBot', // ChatGPT search
    'PerplexityBot', // Perplexity search
    'Claude-SearchBot', // Claude search
  ];
  const trainingCrawlers = ['GPTBot', 'CCBot', 'ClaudeBot'];

  return {
    rules: [
      { userAgent: searchAndAnswerCrawlers, allow: ['/', ...ASSETS], disallow: [...PRIVATE, '/_next/'] },
      // Google-Extended is a control token, not a crawler: it governs Gemini apps / Vertex AI training and
      // grounding. It has no effect on Google Search, AI Overviews or AI Mode (those use Googlebot and the
      // Search Console "Search generative AI control").
      { userAgent: 'Google-Extended', allow: '/', disallow: PRIVATE },
      ...(BLOCK_AI_TRAINING ? [{ userAgent: trainingCrawlers, disallow: '/' }] : []),
      { userAgent: '*', allow: ['/', ...ASSETS], disallow: [...PRIVATE, '/_next/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // Never list secret admin URLs here: robots.txt is public. Use noindex + auth instead.
  };
}
