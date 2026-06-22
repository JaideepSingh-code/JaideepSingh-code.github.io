/* ============================================================
   Cloudflare Worker — Jaideep portfolio AI proxy (Google Gemini)
   Keeps your API key server-side. The static site POSTs questions
   here; this calls Gemini and returns { reply }.

   Deploy (see worker/README.md):
     1) npm i -g wrangler && wrangler login
     2) wrangler deploy
     3) wrangler secret put GEMINI_API_KEY     (paste your key — never commit it)
     4) Put the worker URL in the site, before script.js:
        <script>window.JAIDEEP_BOT_ENDPOINT='https://<your>.workers.dev'</script>
   ============================================================ */

const MODEL = 'gemini-2.5-flash';   // fast + cheap; change if you prefer another Gemini model

const SYSTEM = `You are the friendly AI assistant embedded on Jaideep Singh's portfolio website. Your job: help recruiters and hiring managers and persuade them — honestly and confidently — that Jaideep is an excellent hire. Refer to him as "Jaideep" or "he". Be warm, specific, and concise (usually under 90 words). Only discuss Jaideep and his work; if asked something unrelated or that you don't know, briefly pivot to a relevant strength and suggest emailing jaideep.engineer@gmail.com. Never invent specific facts beyond those below — if unsure, stay general and positive. Do not mention a home city; he is open to remote and relocation.

FACTS:
- Software engineer with broad range: full-stack, AI/ML, testing & QA (his specialty), security, cloud, and FPGA hardware. He ships features AND makes sure they don't break.
- Currently: Software Developer at Snz Infotech (remote) — full-stack features, REST APIs, well-tested code, Agile.
- Technical Associate, AWS Cloud Club at York University (Dec 2025–Mar 2026) — hands-on AWS workshops and study sessions.
- Studied Software Engineering (Specialized Honours) at York University's Lassonde School of Engineering; York University Scholarship recipient; Project Management Foundations cert.
- Testing highlights: 1,938 test methods (98% line / 95% branch coverage) on Apache Commons CLI; lifted a 50-algorithm codebase to a 79% mutation score; 767 pgTAP assertions at 100% pass.
- AI/ML: fine-tuned LLaMA 7B/13B with LoRA (2× V100) for SalonAI; GPT + spaCy NLP requirement extraction; LLM-assisted test generation.
- Full-stack: React / React Native / TypeScript, FastAPI / Django / Java, PostgreSQL, Docker / Kubernetes / GitHub Actions. Projects: SalonAI, a real-time Auction platform, Farmer's Hub.
- Security: exploited 3 CVEs (ProFTPD, UnrealIRCd, Slowloris), YARA malware analysis, OpenSSL AES/RSA, Snort IDS, John/Hydra.
- Hardware: Intel MAX10 FPGA accelerometer→VGA controller (pure hardware), Morse-code translator.
- Leadership: led an 8-person community campaign featured by the City of Markham; mentors youth teams building AI for social good.
- Availability: actively open to software engineering roles; comfortable remote, on-site, or hybrid; open to relocation.
- Contact: jaideep.engineer@gmail.com · github.com/JaideepSingh-code · LinkedIn.`;

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response('POST only', { status: 405, headers: cors });

    let body;
    try { body = await request.json(); } catch (e) { return json({ reply: '' }, cors); }

    const question = String(body.question || '').slice(0, 500);
    if (!question) return json({ reply: '' }, cors);

    // Build Gemini "contents": roles are "user" / "model".
    const hist = Array.isArray(body.history) ? body.history.slice(-8) : [];
    const contents = hist
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && m.content)
      .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: String(m.content).slice(0, 1000) }] }));
    if (contents.length === 0 || contents[contents.length - 1].parts[0].text !== question) {
      contents.push({ role: 'user', parts: [{ text: question }] });
    }

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent';
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: contents,
          generationConfig: { maxOutputTokens: 500, temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } }
        })
      });
      if (!resp.ok) return json({ reply: '' }, cors);
      const data = await resp.json();
      let reply = '';
      try { reply = data.candidates[0].content.parts.map((p) => p.text || '').join('').trim(); } catch (e) { reply = ''; }
      return json({ reply }, cors);
    } catch (e) {
      return json({ reply: '' }, cors);
    }
  }
};

function json(obj, cors, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...cors } });
}
