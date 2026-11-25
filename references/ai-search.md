# AI-search readiness (Google AI Overviews / AI Mode, ChatGPT, Copilot, Perplexity, Claude, Gemini)

No engine publishes a ranking formula for AI answers. Never promise citations, visibility or traffic.
Each item below carries its evidence level:

- **[Official]** documented by the engine or crawler operator (source given) · **[Practice]** established
  SEO or writing practice, not an engine requirement · **[Experimental]** low cost, no documented effect.

Sources checked 2026-11-25. Re-check before quoting them to a client: these pages change often.

## What actually controls inclusion

- [ ] **[Official] Google AI Overviews and AI Mode need nothing special.** No AI text files, special markup
      or schema are required; normal Search eligibility (crawlable, indexable, snippet allowed) applies.
      developers.google.com/search/docs/appearance/ai-features
- [ ] **[Official] Google's own controls**: `noindex` removes a page from Search including AI features;
      `nosnippet` / `max-snippet` stop it being a direct input to AI Overviews / AI Mode; `data-nosnippet`
      excludes a passage. Search Console has a site-wide "Search generative AI control" (AI Overviews,
      AI Mode); record its state in the audit if the user can open Search Console.
      developers.google.com/search/docs/fundamentals/gen-ai-controls
- [ ] **[Official] Google-Extended** is a robots.txt control token for Gemini apps / Vertex AI training and
      grounding. It does not affect inclusion in Google Search. Owner's choice.
      developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
- [ ] **[Official] Bing / Copilot**: Copilot grounds answers through Bing search, so Bing indexing matters.
      Set up Bing Webmaster Tools; its AI Performance report shows Copilot citations.
      learn.microsoft.com/en-us/copilot/plan/privacy-and-protections
- [ ] **[Official] ChatGPT search** requires `OAI-SearchBot` to be allowed. OpenAI says it may use other search
      providers but does not name the Bing index as a requirement: treat "ChatGPT uses Bing" as unconfirmed.
      help.openai.com/en/articles/9237897-chatgpt-search · developers.openai.com/api/docs/bots

## Crawlers (robots.txt)

| Purpose | User agents | Default |
|---|---|---|
| Search and answer indexes | `Googlebot`, `Bingbot`, `OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot` | Allow |
| AI model training | `GPTBot`, `ClaudeBot`, `CCBot`; token `Google-Extended` | **Owner decides**, record in `seo/facts.md` |
| User-triggered fetches | `ChatGPT-User`, `Perplexity-User`, `Claude-User`, Google user-triggered fetchers | robots.txt may not apply (operators say so) |
| Other | `OAI-AdsBot` (ChatGPT ads landing pages), `Claude-Agent` (Anthropic-hosted browsing) | Leave to `*` unless the owner decides |

[Official] Sources: developers.openai.com/api/docs/bots, privacy.claude.com/en/articles/8896518,
docs.perplexity.ai/guides/bots, developers.google.com/crawling. `anthropic-ai` is no longer documented.
A crawler follows only the most specific group naming it; check the final robots.txt with
`scripts/seo-check.mjs` or Google's robots.txt report.

## Content that is easy to quote

- [ ] **[Practice] Answer early.** Pages that answer a question state the answer plainly near the top, then
      give detail. Google says there is no need to split content into small chunks and no ideal length:
      write for readers, not for a word count.
- [ ] **[Practice] Citable facts**: short, specific sentences (who, what, where, how long; prices only if real).
- [ ] **[Practice] Sources**: link official sources (government, regulations, statistics) in the text.
- [ ] **[Practice] Named people** with a real profile and `Person` markup for authors and experts.
      E-E-A-T is a quality concept from Google's rater guidelines, not a ranking factor by itself.
- [ ] **[Practice] Visible FAQ** answering real client questions helps readers. `FAQPage` markup no longer
      produces a Google rich result (retired 2026-05-07); add it only if visible, expect nothing from it.
- [ ] **[Practice] Entity consistency**: same name, address, phone and description on the site, Google
      Business Profile, Bing Places and directories. (Google Business Profile guidelines require the
      business name as it is used in the real world.)

## Optional

- [ ] **[Experimental] `llms.txt`** (`templates/static/llms.txt`): a summary file for LLM tools. Google
      states Google Search does not use it; no other major engine documents using it. Cheap to keep in sync
      with the sitemap; never scored, never presented as a ranking or citation factor.
- [ ] **[Experimental] AI-training preference signals** (IETF aipref, `__usage_ai-training`): Anthropic
      honours them from 2026-10-30; Google announced support for early 2027. Mention as an option only.
