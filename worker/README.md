# Real-LLM upgrade for the portfolio AI assistant

The site's assistant works out of the box with a built-in knowledge base (no setup).
To make it answer **open-ended** questions with a real LLM, deploy this tiny Cloudflare
Worker — it holds your API key server-side (a key must never live in the public site).

## One-time setup (~5 minutes, free tier)

```bash
cd worker
npm install -g wrangler          # Cloudflare CLI
wrangler login                   # opens browser, sign in / create free account
wrangler deploy                  # deploys bot-worker.js
wrangler secret put ANTHROPIC_API_KEY
#  ^ paste your Anthropic API key from https://console.anthropic.com (Settings → API Keys)
```

`wrangler deploy` prints a URL like `https://jaideep-portfolio-bot.<you>.workers.dev`.

## Turn it on in the site

Add ONE line to `index.html`, right before `<script src="script.js"></script>`:

```html
<script>window.JAIDEEP_BOT_ENDPOINT = 'https://jaideep-portfolio-bot.<you>.workers.dev';</script>
```

Commit & push — done. The assistant now uses Claude. If the API ever errors, it
automatically falls back to the built-in knowledge base, so it never "breaks."

## Notes
- **Model:** `claude-haiku-4-5` (fast + very cheap). Change it in `bot-worker.js` if you like.
- **Cost:** a few hundred short chats ≈ pennies. Set a spend limit in the Anthropic console.
- **Provider:** written for Anthropic; easy to adapt to OpenAI (change the fetch URL, headers, and body in `bot-worker.js`).
- **Persona:** edit the `SYSTEM` prompt in `bot-worker.js` to tune how it talks about you.
