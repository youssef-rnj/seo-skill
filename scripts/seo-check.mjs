#!/usr/bin/env node
// seo-check.mjs — read-only SEO evidence collector. Node >= 18, no dependencies.
// Usage:
//   node scripts/seo-check.mjs https://example.com [more URLs] [--hosts] [--links] [--limit N] [--json]
// One root URL (no path) = home page + sitemap URLs (first --limit, default 50).
// Sends only GET requests, one at a time. Exit code 1 if any check fails.

const VERSION = '1.0.0';
const UA = `seo-check/${VERSION} (+https://github.com/youssef-rnj/seo-skill)`;
const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? Number(args[limitIdx + 1]) || 50 : 50;
const inputs = args.filter((a, i) => /^https?:\/\//i.test(a) && args[i - 1] !== '--limit');
if (!inputs.length) {
  console.error('Usage: node scripts/seo-check.mjs <url> [url…] [--hosts] [--links] [--limit N] [--json]');
  process.exit(2);
}

const results = []; // { check, url, result: 'pass'|'fail'|'info', detail, observedAt }
const add = (check, url, result, detail) => results.push({ check, url, result, detail, observedAt: new Date().toISOString() });

// ---------- HTTP ----------
async function hop(url) {
  const res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20000) });
  return res;
}

async function trace(url, maxHops = 10) {
  const hops = [];
  const seen = new Set();
  let current = url;
  for (let i = 0; i <= maxHops; i++) {
    if (seen.has(current)) return { hops, loop: true };
    seen.add(current);
    let res;
    try {
      res = await hop(current);
    } catch (e) {
      return { hops, error: `${current}: ${e.cause?.code || e.name || e.message}` };
    }
    const location = res.headers.get('location');
    hops.push({ url: current, status: res.status, location: location || undefined });
    if (res.status >= 300 && res.status < 400 && location) {
      current = new URL(location, current).href;
      continue;
    }
    const type = res.headers.get('content-type') || '';
    const body = /html|xml|text\/plain/i.test(type) ? await res.text() : '';
    return { hops, final: { url: current, status: res.status, headers: res.headers, type, body } };
  }
  return { hops, tooLong: true };
}

// ---------- HTML parsing (regex; good enough for evidence, not a browser) ----------
const decode = (s = '') =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z_:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
    out[m[1].toLowerCase()] = decode(m[3] ?? m[4] ?? m[5]);
  }
  return out;
}

function parseHtml(html, baseUrl) {
  const head = html;
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const meta = (key) => metas.find((a) => (a.name || a.property || '').toLowerCase() === key)?.content;
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const canonicalTag = links.find((a) => (a.rel || '').toLowerCase().split(/\s+/).includes('canonical'));
  const jsonld = [...html.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const hrefs = [...html.matchAll(/<a\b[^>]*>/gi)]
    .map((m) => attrs(m[0]).href)
    .filter((h) => h && !/^(mailto:|tel:|javascript:|#)/i.test(h))
    .map((h) => {
      try { const u = new URL(h, baseUrl); u.hash = ''; return u.href; } catch { return null; }
    })
    .filter(Boolean);
  return {
    title: titleMatch ? decode(titleMatch[1].replace(/\s+/g, ' ')) : undefined,
    description: meta('description'),
    robots: [meta('robots'), meta('googlebot')].filter(Boolean).join(', '),
    viewport: meta('viewport'),
    og: { title: meta('og:title'), description: meta('og:description'), image: meta('og:image') },
    canonical: canonicalTag?.href,
    h1: (html.match(/<h1\b/gi) || []).length,
    jsonld,
    imgs,
    hrefs,
  };
}

function jsonldTypes(node, out = []) {
  if (Array.isArray(node)) node.forEach((n) => jsonldTypes(n, out));
  else if (node && typeof node === 'object') {
    if (node['@type']) out.push(...[].concat(node['@type']));
    if (node['@graph']) jsonldTypes(node['@graph'], out);
  }
  return out;
}

// ---------- robots.txt (Google rules: most specific group; longest match; allow wins ties) ----------
function parseRobots(text) {
  const groups = [];
  const sitemaps = [];
  let group = null;
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === 'sitemap') { sitemaps.push(value); continue; }
    if (key === 'user-agent') {
      if (!lastWasAgent) { group = { agents: [], rules: [] }; groups.push(group); }
      group.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else if ((key === 'allow' || key === 'disallow') && group) {
      if (value) group.rules.push({ allow: key === 'allow', path: value });
      lastWasAgent = false;
    } else lastWasAgent = false;
  }
  return { groups, sitemaps };
}

function robotsAllows(robots, agent, pathAndQuery) {
  const a = agent.toLowerCase();
  let rules = robots.groups.filter((g) => g.agents.includes(a)).flatMap((g) => g.rules);
  if (!rules.length) rules = robots.groups.filter((g) => g.agents.includes('*')).flatMap((g) => g.rules);
  let best = null;
  for (const r of rules) {
    const anchored = r.path.endsWith('$');
    const body = anchored ? r.path.slice(0, -1) : r.path;
    const re = new RegExp('^' + body.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + (anchored ? '$' : ''));
    if (!re.test(pathAndQuery)) continue;
    if (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow)) best = r;
  }
  return best ? best.allow : true;
}

// ---------- sitemap ----------
async function sitemapUrls(url, depth = 0) {
  const t = await trace(url);
  if (!t.final || t.final.status !== 200) {
    add('sitemap', url, 'fail', `not reachable: ${t.hops.map((h) => h.status).join(' → ') || t.error}`);
    return [];
  }
  const locs = [...t.final.body.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)].map((m) => decode(m[1]));
  if (/<sitemapindex\b/i.test(t.final.body) && depth < 1) {
    const all = [];
    for (const child of locs.slice(0, 20)) all.push(...(await sitemapUrls(child, depth + 1)));
    return all;
  }
  add('sitemap', url, locs.length ? 'pass' : 'fail', `${locs.length} URLs`);
  return locs;
}

// ---------- page checks ----------
const pages = [];

async function checkPage(url, { fromSitemap = false } = {}) {
  const t = await trace(url);
  const chain = t.hops.map((h) => `${h.status} ${h.url}`).join(' → ');
  if (t.error || t.loop || t.tooLong) {
    add('status', url, 'fail', t.error || (t.loop ? `redirect loop: ${chain}` : `more than 10 redirects: ${chain}`));
    return;
  }
  const f = t.final;
  const redirects = t.hops.length - 1;
  // 404/410 on a URL given by hand is only information (right for removed pages); in the sitemap it fails.
  const gone = (f.status === 404 || f.status === 410) && !fromSitemap && new URL(url).pathname !== '/';
  const statusResult = f.status === 200 ? 'pass' : gone ? 'info' : 'fail';
  const statusNote = gone ? ' (correct only if this page was removed on purpose)' : '';
  add('status', url, statusResult, `${f.status}${redirects ? ` after ${redirects} redirect(s): ${chain}` : ''}${statusNote}`);
  if (fromSitemap && redirects) add('sitemap-url', url, 'fail', `sitemap URL redirects: ${chain}`);
  if (redirects > 1) add('redirect-chain', url, 'fail', chain);
  if (f.status !== 200 || !/html/i.test(f.type)) return;

  const p = parseHtml(f.body, f.url);
  pages.push({ url: f.url, ...p });
  const xrt = f.headers.get('x-robots-tag') || '';
  const noindex = /noindex|none/i.test(p.robots) || /noindex|none/i.test(xrt);
  add('indexable', f.url, noindex ? 'fail' : 'pass', noindex ? `noindex (meta: "${p.robots}", X-Robots-Tag: "${xrt}")` : 'no noindex');
  if (!p.canonical) add('canonical', f.url, 'fail', 'missing');
  else {
    const abs = new URL(p.canonical, f.url).href;
    const same = abs === f.url;
    add('canonical', f.url, same ? 'pass' : fromSitemap ? 'fail' : 'info', same ? abs : `canonical ${abs} ≠ final URL${/^https?:/i.test(p.canonical) ? '' : ' (relative)'}`);
  }
  add('title', f.url, p.title ? 'pass' : 'fail', p.title ? `"${p.title}" (${p.title.length} chars, information only)` : 'missing');
  add('description', f.url, p.description ? 'pass' : 'fail', p.description ? `${p.description.length} chars (information only)` : 'missing');
  add('h1', f.url, 'info', `${p.h1} <h1>`);
  add('viewport', f.url, p.viewport ? 'pass' : 'fail', p.viewport || 'missing');
  const ogMissing = Object.entries(p.og).filter(([, v]) => !v).map(([k]) => `og:${k}`);
  add('open-graph', f.url, ogMissing.length ? 'fail' : 'pass', ogMissing.length ? `missing ${ogMissing.join(', ')}` : 'og:title, og:description, og:image');
  if (!p.jsonld.length) add('json-ld', f.url, 'info', 'no JSON-LD block');
  p.jsonld.forEach((block, i) => {
    try {
      const types = jsonldTypes(JSON.parse(block));
      add('json-ld', f.url, 'pass', `block ${i + 1}: ${types.join(', ') || 'no @type'}`);
    } catch (e) {
      add('json-ld', f.url, 'fail', `block ${i + 1} does not parse: ${e.message}`);
    }
  });
  const noAlt = p.imgs.filter((a) => !('alt' in a)).length;
  const noSize = p.imgs.filter((a) => !a.width || !a.height).length;
  add('images', f.url, noAlt ? 'fail' : 'pass', `${p.imgs.length} <img>; ${noAlt} without alt attribute; ${noSize} without width/height`);
}

// ---------- main ----------
const startedAt = new Date().toISOString();
const first = new URL(inputs[0]);
const origin = first.origin;
let targets = inputs;

const robotsTrace = await trace(`${origin}/robots.txt`);
let robots = { groups: [], sitemaps: [] };
if (robotsTrace.final?.status === 200) {
  robots = parseRobots(robotsTrace.final.body);
  add('robots.txt', `${origin}/robots.txt`, 'pass', `${robots.groups.length} groups, ${robots.sitemaps.length} Sitemap line(s)`);
  if (!robots.sitemaps.length) add('robots.txt', `${origin}/robots.txt`, 'info', 'no Sitemap: line');
} else {
  add('robots.txt', `${origin}/robots.txt`, robotsTrace.final?.status === 404 ? 'info' : 'fail', `status ${robotsTrace.final?.status ?? robotsTrace.error}`);
}

let sitemapSet = new Set();
if (inputs.length === 1 && (first.pathname === '/' || first.pathname === '')) {
  const sitemapLocations = robots.sitemaps.length ? robots.sitemaps : [`${origin}/sitemap.xml`];
  const urls = [];
  for (const s of sitemapLocations) urls.push(...(await sitemapUrls(s)));
  const unique = [...new Set(urls)];
  const otherHost = unique.filter((u) => { try { return new URL(u).host !== first.host; } catch { return true; } });
  if (otherHost.length) add('sitemap', origin, 'fail', `${otherHost.length} URL(s) on another host, e.g. ${otherHost[0]}`);
  sitemapSet = new Set(unique.slice(0, LIMIT));
  if (unique.length > LIMIT) add('sitemap', origin, 'info', `checking first ${LIMIT} of ${unique.length} URLs (--limit)`);
  targets = [first.href, ...[...sitemapSet].filter((u) => u !== first.href)];
}

for (const url of targets) {
  await checkPage(url, { fromSitemap: sitemapSet.has(url) });
  const u = new URL(url);
  for (const agent of ['*', 'Googlebot']) {
    if (!robotsAllows(robots, agent, u.pathname + u.search)) add('robots-blocked', url, 'fail', `disallowed for ${agent}`);
  }
}

// Duplicates across checked pages
for (const key of ['title', 'description']) {
  const byValue = new Map();
  for (const p of pages) if (p[key]) byValue.set(p[key], [...(byValue.get(p[key]) || []), p.url]);
  for (const [value, urls] of byValue) if (urls.length > 1) add(`duplicate-${key}`, urls.join(' , '), 'fail', `"${value.slice(0, 80)}" on ${urls.length} pages`);
}

if (flag('--hosts')) {
  const host = first.host.replace(/^www\./, '');
  const variants = [`http://${host}/`, `http://www.${host}/`, `https://${host}/`, `https://www.${host}/`];
  for (const v of variants) {
    const t = await trace(v);
    const chain = t.hops.map((h) => `${h.status} ${h.url}`).join(' → ');
    if (!t.final) { add('host-variant', v, 'fail', t.error || chain); continue; }
    const ok = t.final.status === 200 && t.final.url === first.origin + '/' && t.hops.length <= 2;
    add('host-variant', v, ok ? 'pass' : 'fail', chain);
  }
}

if (flag('--links')) {
  const internal = [...new Set(pages.flatMap((p) => p.hrefs))].filter((h) => new URL(h).origin === origin && !targets.includes(h)).slice(0, 100);
  for (const link of internal) {
    const t = await trace(link);
    const status = t.final?.status;
    if (status !== 200) add('internal-link', link, 'fail', t.hops.map((h) => h.status).join(' → ') || t.error);
  }
  add('internal-link', origin, 'info', `${internal.length} internal links checked (max 100), failures listed above`);
}

const summary = {
  tool: `seo-check ${VERSION}`,
  target: inputs,
  startedAt,
  finishedAt: new Date().toISOString(),
  counts: { pass: 0, fail: 0, info: 0 },
  results,
};
for (const r of results) summary.counts[r.result]++;

if (flag('--json')) console.log(JSON.stringify(summary, null, 2));
else {
  for (const r of results) console.log(`${r.result.toUpperCase().padEnd(4)}  ${r.check.padEnd(16)} ${r.url}  ${r.detail}`);
  console.log(`\n${summary.counts.pass} pass, ${summary.counts.fail} fail, ${summary.counts.info} info · ${startedAt} → ${summary.finishedAt}`);
  console.log('Automated checks only. Rendering, Core Web Vitals, rich results and indexing need the browser and external tools (references/validation.md).');
}
process.exit(summary.counts.fail ? 1 : 0);
