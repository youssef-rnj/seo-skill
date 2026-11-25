# SEO audit — [site]

- Date: [YYYY-MM-DD HH:MM timezone] · Scoring: v2 (`references/audit-scoring.md`)
- Scope: [pages crawled N / found in sitemap M; code read: yes/no; branch/commit]
- Tools and access: [curl, scripts/seo-check.mjs, browser 375 px, Rich Results Test, PageSpeed Insights,
  Search Console: yes/no, Bing Webmaster: yes/no, field data (CrUX): yes/no]

The score below is an internal audit metric, not a Google score; it does not predict rankings.

## Score: [NN]/100

[Critical flags, if any: "Capped at 49 because: …"]

| Category | Weight | Effective weight | Score /100 | Weighted | Notes |
|---|---|---|---|---|---|
| Technical | 22 | | | | |
| Content | 23 | | | | |
| On-page | 20 | | | | |
| Structured data | 10 | | | | |
| Performance | 10 | | | | [field or lab data] |
| AI-search readiness | 10 | | | | |
| Images | 5 | | | | |

## Investigate first

[Probable or low-confidence critical/high findings, with what would confirm them.]

## Findings (sorted by points)

### [TECH-001] [short title]
- Status: Confirmed · Severity: high · Confidence: High · Points: [x.x]
- URL(s): [...]
- Evidence: [verbatim status line / header / HTML excerpt / file:line]
- Source: [tool] · Observed: [timestamp]
- Expected: [... (official source URL if a search-engine rule)] · Actual: [...]
- Impact: [...]
- Fix: [...] · Change safety: [low / high-impact → references/change-safety.md]
- Validation: [command or tool and the expected result]

## Recommendations and opportunities

[Not defects; no points deducted.]

## Needs external check

[What needs Search Console, Bing, Google Business Profile, field data or the owner, and why.]

## Limitations

[What was not checked and why: pages not crawled, blocked by login, no tool access, lab-only data.]

## Checks run

| Check | Result | Evidence |
|---|---|---|
| [e.g. redirect chains on 4 host variants] | Passed / Failed / Not run ([reason]) | [file or output] |
