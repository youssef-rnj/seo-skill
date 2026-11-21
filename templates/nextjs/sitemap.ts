// app/sitemap.ts — Next.js App Router. Replace SITE_URL, the page list and fetchPosts().
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://example.com';

// Articles published in the CMS appear within the hour.
export const revalidate = 3600;

/* lastModified = date of the last VISIBLE change of each page (text, images, sections),
   not the deploy date: Google only uses lastmod when it is reliable.
   No priority / changefreq: Google ignores them. */
const staticPages: { path: string; lastModified: string }[] = [
  { path: '/', lastModified: '2026-01-01' },
  { path: '/services/example-service', lastModified: '2026-01-01' },
  { path: '/about', lastModified: '2026-01-01' },
  { path: '/contact', lastModified: '2026-01-01' },
  { path: '/blog', lastModified: '2026-01-01' },
  { path: '/privacy', lastModified: '2026-01-01' },
];

type Post = { slug: string; updatedAt: string };

async function fetchPosts(): Promise<Post[]> {
  // Replace with your CMS / database call. Return only published posts.
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchPosts();
  const newestPost = posts.reduce((max, p) => (p.updatedAt > max ? p.updatedAt : max), '');

  return [
    ...staticPages.map(({ path, lastModified }) => ({
      url: `${SITE_URL}${path === '/' ? '' : path}`,
      // A new post changes the blog index too.
      lastModified: path === '/blog' && newestPost > lastModified ? newestPost : lastModified,
    })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
