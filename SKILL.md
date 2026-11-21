---
name: seo-skills
description: >-
  Full SEO and AI-search (GEO) setup for any website: audit with a score out of 100, technical fixes
  (redirects, canonical, robots.txt, sitemap, headers, images), structured data, llms.txt, Search Console
  and Bing Webmaster, Google Business Profile, content clusters and a visibility kit. Use when the user
  asks to audit a site's SEO, improve rankings or the SEO score, prepare a site for ChatGPT/Gemini/AI
  Overviews, migrate an old site without losing SEO, set up Search Console/Bing/Google Business Profile,
  or plan SEO content.
---

# seo-skills

A step-by-step method to audit a website and bring it to a high SEO and AI-search score, then keep it
growing with content and local signals. Works for any stack; code templates cover Next.js and static/Vite
sites.

## Rules

1. **No content change without approval.** Never edit visible text, pages or articles on a live site
   unless the user approved that specific change. Draft wording, new pages and articles in `seo/` files.
2. **Never invent facts.** No figures, prices, clients, reviews, authors, dates, photos or legal rules
   that the user did not give or that no official source states. Mark them `TO VERIFY` and leave them out.
3. **Ask before anything leaves the machine or goes live**: deploys, publishing, account settings,
   submissions to external tools. Never type passwords; the user signs in.
4. **Small, reversible steps**: a branch per batch, build and test, check desktop and 375 px, verify live.
5. **One business identity** (name, address, phone, URL) identical everywhere.

## Start

Collect, or ask once for: site URL, business and city, target clients and priority services, languages,
code location and stack, how deploys happen, and the **official facts** (legal name, company number,
address, phone, email, hours, founding date, team names and titles, official social profiles).
Keep them in `seo/facts.md`; every later step uses only this file and linked official sources.

## Workflow

Stop after each step, report in plain words, and wait for the user's OK.

1. **Audit (read only).** Score out of 100 with `references/audit-scoring.md`. List each issue with page,
   evidence, fix and points gained, sorted by impact.
2. **Technical fixes.** Apply `references/technical.md`, then `references/onpage-schema.md`.
   Copy from `templates/` instead of writing from scratch. Show the diff, build, ask, deploy, re-audit.
3. **AI search.** Apply `references/ai-search.md` (llms.txt, direct answers, sources, authors, bot access).
4. **Search engines and listings.** Follow `references/search-tools.md` with the user signed in:
   Search Console, Bing Webmaster, Google Business Profile, Bing Places, Apple Business Connect.
5. **Content plan (drafts only).** Follow `references/content.md`: research, one brief per service,
   a merged plan, a "to verify" list. Write articles only when asked, one at a time, for approval.
6. **Authority and local.** Build the visibility kit from `references/offsite.md`.
7. **Report.** Score before and after, what changed (commits/PRs), what waits for the user, next 3
   actions. Append to `seo/log.md` with dates.

For a site moving off an old platform (WordPress, Odoo, Wix…), read `references/migration.md` before step 2.

## Quick audit

If the user only wants a check: run step 1, give the score and the top 10 fixes, change nothing.
