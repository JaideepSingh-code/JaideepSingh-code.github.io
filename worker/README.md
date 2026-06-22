# Real-LLM upgrade for the portfolio AI assistant (Google Gemini)

The site's assistant works out of the box with a built-in knowledge base (no setup).
To make it answer **open-ended** questions with a real LLM, deploy this tiny Cloudflare
Worker — it holds your Gemini API key server-side (a key must never live in the public site).

## One-time setup (~5 minutes, free tier)

```bash
cd worker
npm install -g wrangler          # Cloudflare CLI
wrangler login                   # opens browser, sign in / create free account
wrangler deploy                  # deploys bot-worker.js
wrangler secret put GEMINI_API_KEY
#  ^ paste your Gemini API key from https://aistudio.google.com/apikey
#    (typed into the prompt — it is encrypted, never committed)
```

`wrangler deploy` prints a URL like `https://jaideep-portfolio-bot.<you>.workers.dev`.

## Turn it on in the site

Add ONE line to `index.html`, right before `<script src="script.js"></script>`:

```html
<script>window.JAIDEEP_BOT_ENDPOINT = 'https://jaideep-portfolio-bot.<you>.workers.dev';</script>
```

Commit & push — done. The assistant now uses Gemini. If the API ever errors, it
automatically falls back to the built-in knowledge base, so it never "breaks."

## Notes
- **Model:** `gemini-2.0-flash` (fast + cheap). Change `MODEL` in `bot-worker.js` if you like.
- **Security:** the key lives only as a Cloudflare encrypted secret. Never commit it or put it in the site. If a key was ever shared in plaintext, rotate it at https://aistudio.google.com/apikey.
- **Persona:** edit the `SYSTEM` prompt in `bot-worker.js` to tune how it talks about you.
- **Provider:** this version targets Google Gemini. (Anthropic/OpenAI variants are a small edit to the fetch call.)
