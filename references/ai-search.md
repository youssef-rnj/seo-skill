# AI-search readiness (ChatGPT, Gemini, Perplexity, Copilot, Google AI answers)

- [ ] **Bot access** in robots.txt. Allow answer/search bots: `OAI-SearchBot`, `ChatGPT-User`,
      `PerplexityBot`, `Perplexity-User`, `Claude-SearchBot`, `Claude-User`, `Google-Extended`, `Bingbot`.
      Training-only crawlers (`GPTBot`, `CCBot`, `ClaudeBot`, `anthropic-ai`) are the owner's choice.
- [ ] **Bing Webmaster Tools** set up: ChatGPT search and Copilot draw on the Bing index.
- [ ] **llms.txt** at the root (`templates/static/llms.txt`): one-paragraph summary, contact, services and
      key pages with one-line descriptions. Keep it in sync with the sitemap.
- [ ] **Direct answer first**: each service page and article opens with 2–3 sentences (25–90 words) that
      answer the main question on their own.
- [ ] **Citable facts**: short factual sentences (who, what, where, how long, how much only if real).
- [ ] **Sources**: link official sources (government, regulations, statistics) in the text and a
      "Sources" section at the end of articles.
- [ ] **Named authors and experts** with Person schema and a profile (LinkedIn).
- [ ] **FAQ** blocks answering real client questions, with FAQPage schema.
- [ ] Entity consistency: same name, address, phone and description on the site, Google, Bing, directories.
