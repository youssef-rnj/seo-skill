# seo-skills

A Claude skill that runs a complete **SEO and AI-search (GEO)** setup on any website, step by step:
audit with a score out of 100, technical fixes, structured data, `llms.txt`, Google Search Console and
Bing Webmaster, Google Business Profile, content clusters and a local visibility kit.

Built from a real project that went from 82 to 97/100 on its audit, then made generic.

## What it does

| Step | Output |
|---|---|
| 1. Audit (read only) | Score /100 (technical 22, content 23, on-page 20, schema 10, performance 10, AI readiness 10, images 5) and a list of fixes sorted by points gained |
| 2. Technical fixes | Canonical host and 301s, robots.txt with AI-bot rules, sitemap with real `lastmod`, security headers, images, titles and descriptions, JSON-LD |
| 3. AI search | `llms.txt`, direct-answer intros, sources, named authors, bot access |
| 4. Search tools | Search Console, Bing Webmaster, Google Business Profile, Bing Places, Apple Business Connect |
| 5. Content plan | Research, one brief per service, a merged plan, a "to verify" list (drafts only) |
| 6. Visibility kit | Identity block, directories, Google Posts, review-request message |
| 7. Report | Before/after score, changes, next actions, dated log |

## Safety rules built in

- No change to a site's visible text without the owner's approval for that change.
- No invented facts: unconfirmed figures are marked `TO VERIFY` and left out.
- Asks before every deploy, publish or submission to an external service; never types passwords.
- Small reversible steps, checked on desktop and at 375 px.

## Install

**Claude Code (personal skill):**

```bash
git clone https://github.com/youssef-rnj/seo-skills ~/.claude/skills/seo-skills
```

On Windows (PowerShell):

```powershell
git clone https://github.com/youssef-rnj/seo-skills "$env:USERPROFILE\.claude\skills\seo-skills"
```

**Per project:** copy the folder to `.claude/skills/seo-skills` in the project.

**Claude.ai:** zip the folder and upload it under Settings → Capabilities → Skills.

## Use

Ask Claude in your website's folder, for example:

- "Audit https://example.com for SEO and AI search" (quick read-only audit)
- "Run the full SEO setup on this site" (all steps, with a stop after each)
- "We're moving from WordPress to Next.js, keep our SEO" (migration checklist)

Or paste `templates/PROMPT.md` after filling the brackets.

## Contents

```
SKILL.md                    workflow and rules (loaded on every use)
references/
  audit-scoring.md          weights, issue format, easy-to-miss checks
  technical.md              hosts, redirects, robots, sitemap, rendering, headers, performance
  onpage-schema.md          titles, descriptions, headings, Open Graph, JSON-LD by page type
  ai-search.md              bots, llms.txt, direct answers, sources, authors
  search-tools.md           Search Console, Bing, Google Business Profile, Bing Places, Apple
  content.md                research, briefs, plan, article rules, CMS checker
  offsite.md                visibility kit: identity, directories, posts, reviews
  migration.md              moving off an old site or platform without losing SEO
templates/
  PROMPT.md                 copy-paste prompt
  nextjs/                   robots.ts, sitemap.ts, jsonld.tsx, next.config snippet
  static/                   robots.txt, llms.txt, seo.js (Vite/React prerender), nginx-seo.conf
```

## License

MIT, see [LICENSE](LICENSE).
