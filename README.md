# seo-skill

A Claude skill that runs a complete **SEO and AI-search (GEO)** setup on any website, step by step:
evidence-based audit with an internal score out of 100, technical fixes, structured data, Google Search
Console and Bing Webmaster, Google Business Profile, content clusters and a local visibility kit.

Built from a real project that went from 82 to 97/100 on its internal audit score, then made generic.
The score is this skill's own audit metric: it is not a Google score and does not predict rankings.

## What it does

| Step | Output |
|---|---|
| 1. Audit (read only) | Internal score /100 (technical 22, content 23, on-page 20, schema 10, performance 10, AI readiness 10, images 5) with a fixed rubric, critical-issue caps, and findings that each carry evidence, source and confidence |
| 2. Technical fixes | Canonical host and 301s, robots.txt with crawler rules, sitemap with real `lastmod`, security headers, images, titles and descriptions, JSON-LD; high-impact changes with a rollback plan |
| 3. AI search | Crawler access by purpose, Google's AI controls, Bing, content that is easy to quote; every item labelled Official / Practice / Experimental |
| 4. Search tools | Search Console, Bing Webmaster, Google Business Profile, Bing Places, Apple Business Connect |
| 5. Content plan | Research, one brief per service, a merged plan, a "to verify" list (drafts only) |
| 6. Visibility kit | Identity block, directories, Google Posts, review-request message |
| 7. Report | Before/after score, changes, next actions, dated log |

## Safety and evidence rules built in

- No change to a site's visible text without the owner's approval for that change.
- No invented facts: unconfirmed figures are marked `TO VERIFY` and left out.
- Asks before every deploy, publish or submission to an external service; never types passwords.
- Small reversible steps with a rollback plan for redirects, robots.txt, canonicals, HSTS, CSP and the like;
  checked on desktop and at 375 px.
- Findings separate confirmed issues from probable ones and from recommendations; a check that was not run
  is reported as "Not run", never as passed.

## Install

**Claude Code (personal skill):**

```bash
git clone https://github.com/youssef-rnj/seo-skill ~/.claude/skills/seo-skill
```

On Windows (PowerShell):

```powershell
git clone https://github.com/youssef-rnj/seo-skill "$env:USERPROFILE\.claude\skills\seo-skill"
```

Update later with `git -C ~/.claude/skills/seo-skill pull`.

**Upgrading from the old name (`seo-skills`):** delete or rename the old `~/.claude/skills/seo-skills`
folder after cloning the new one, so Claude does not load two copies.

**Per project:** copy the folder to `.claude/skills/seo-skill` in the project.

**Claude.ai:** zip the folder and upload it under Settings → Capabilities → Skills (menu names may change).

**Optional:** `scripts/seo-check.mjs` needs Node.js 18 or newer and nothing else.

## Use

Ask Claude in your website's folder, for example:

- "Audit https://example.com for SEO and AI search" (quick read-only audit)
- "Run the full SEO setup on this site" (all steps, with a stop after each)
- "We're moving from WordPress to Next.js, keep our SEO" (migration checklist)

Or paste `templates/PROMPT.md` after filling the brackets.

Collect evidence without Claude (read-only GET requests):

```bash
node scripts/seo-check.mjs https://example.com --hosts --links
```

## Contents

```
SKILL.md                    workflow and rules (loaded on every use)
references/
  audit-scoring.md          evidence rules, finding format, scoring v2 rubric, critical flags
  validation.md             automated / browser / external checks, before-after
  change-safety.md          procedure and rollback for high-impact changes
  technical.md              hosts, redirects, robots, sitemap, rendering, headers, performance
  onpage-schema.md          titles, descriptions, headings, Open Graph, JSON-LD by page type
  ai-search.md              crawlers, Google AI controls, Bing, quotable content, llms.txt (optional)
  search-tools.md           Search Console, Bing, Google Business Profile, Bing Places, Apple
  content.md                research, briefs, plan, article rules, CMS checker
  offsite.md                visibility kit: identity, directories, posts, reviews
  migration.md              moving off an old site or platform without losing SEO
templates/
  PROMPT.md                 copy-paste prompt
  audit-report.md           audit report skeleton
  nextjs/                   robots.ts, sitemap.ts, jsonld.tsx, next.config snippet
  static/                   robots.txt, llms.txt, seo.js (Vite/React prerender), nginx-seo.conf
scripts/
  seo-check.mjs             zero-dependency evidence collector (Node 18+)
```

## License

MIT, see [LICENSE](LICENSE).
