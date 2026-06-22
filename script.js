/* ============================================================
   Jaideep Singh — Portfolio interactions + AI assistant
   ============================================================ */
(function () {
  'use strict';

  /* ---- Sticky nav ---- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.getElementById('navToggle');
  var mobile = document.getElementById('navMobile');
  toggle.addEventListener('click', function () {
    var open = mobile.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mobile.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      mobile.classList.remove('open'); toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          setTimeout(function () { e.target.classList.add('in'); }, Math.min(i * 55, 220));
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }
  function revealInView() {
    revealEls.forEach(function (el) {
      if (el.classList.contains('in')) return;
      if (el.getBoundingClientRect().top < (window.innerHeight || 800) * 0.95) el.classList.add('in');
    });
  }
  revealInView();
  window.addEventListener('load', revealInView);

  /* ---- Active nav link ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = '#' + e.target.id;
          navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Project filter ---- */
  var filters = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('.project-card');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var cats = card.getAttribute('data-cats') || '';
        card.classList.toggle('hide', !(f === 'all' || cats.split(' ').indexOf(f) !== -1));
      });
    });
  });

  /* ---- Project cards → detail page ---- */
  var REPO2SLUG = {};
  if (window.PROJECTS) Object.keys(window.PROJECTS).forEach(function (s) {
    REPO2SLUG[(window.PROJECTS[s].repo || '').toLowerCase()] = s;
  });
  cards.forEach(function (card) {
    var link = card.querySelector('.pc-link');
    var repo = link ? (link.getAttribute('href') || '').toLowerCase() : '';
    var slug = REPO2SLUG[repo];
    if (!slug) return;
    card.classList.add('clickable');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'link');
    card.setAttribute('aria-label', card.querySelector('h3') ? card.querySelector('h3').textContent + ' — view details' : 'View project details');
    if (!card.querySelector('.pc-more')) {
      var hint = document.createElement('span');
      hint.className = 'pc-more';
      hint.innerHTML = 'View details <span>→</span>';
      card.appendChild(hint);
    }
    var open = function () { window.location.href = 'project.html?p=' + slug; };
    card.addEventListener('click', function (e) { if (e.target.closest('.pc-link')) return; open(); });
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
  });

  /* ---- Scroll progress ---- */
  var progress = document.getElementById('scrollProgress');
  if (progress) {
    var updateProgress = function () {
      var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0).toFixed(4) + ')';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  /* ---- 3D tilt + glare ---- */
  var fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (fineHover && !reducedMotion) {
    document.querySelectorAll('.project-card, .skill-card, .lead-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
        card.classList.add('tilting');
        card.style.transform =
          'perspective(900px) rotateX(' + (-(ny - 0.5) * 6).toFixed(2) + 'deg) rotateY(' +
          ((nx - 0.5) * 8).toFixed(2) + 'deg) translateY(-6px)';
        card.style.setProperty('--mx', (nx * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (ny * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.classList.remove('tilting'); card.style.transform = '';
      });
    });
  }

  /* ---- Footer year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Theme toggle ---- */
  (function () {
    var navInner = document.querySelector('.nav-inner');
    if (!navInner) return;
    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.id = 'themeToggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.innerHTML =
      '<svg class="ic-moon" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    var navToggleBtn = document.getElementById('navToggle');
    navInner.insertBefore(btn, navToggleBtn);
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
    });
  })();

  /* ---- Count-up (hero quick-facts stats) ---- */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('.hc-stats b').forEach(function (el) {
      var m = /^([\d.]+)(.*)$/.exec(el.textContent.trim());
      if (!m) return;
      var target = parseFloat(m[1]), suffix = m[2], dec = m[1].indexOf('.') !== -1 ? 1 : 0;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / 1100, 1);
        var v = (1 - Math.pow(1 - p, 3)) * target;
        el.textContent = v.toFixed(dec) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(step); else el.textContent = target.toFixed(dec) + suffix;
      }
      requestAnimationFrame(step);
    });
  })();

  /* ---- Contact form (Formspree, with mailto fallback) ---- */
  (function () {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var statusEl = document.getElementById('cfStatus');
    var endpoint = (typeof window !== 'undefined' && window.FORMSPREE_ENDPOINT) || '';
    function set(msg, cls) { statusEl.textContent = msg; statusEl.className = 'cf-status' + (cls ? ' ' + cls : ''); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('cfName').value.trim();
      var email = document.getElementById('cfEmail').value.trim();
      var msg = document.getElementById('cfMsg').value.trim();
      if (!name || !email || !msg) { set('Please fill in all three fields.', 'err'); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { set("That email doesn't look right.", 'err'); return; }
      if (endpoint) {
        set('Sending…', '');
        fetch(endpoint, {
          method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name, email: email, message: msg })
        })
          .then(function (r) { if (!r.ok) throw new Error(); form.reset(); set("Thanks, " + name.split(' ')[0] + "! I'll be in touch soon. 🙌", 'ok'); })
          .catch(function () { set('Something went wrong — please email jaideep.engineer@gmail.com directly.', 'err'); });
      } else {
        var subject = encodeURIComponent('Portfolio message from ' + name);
        var body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
        window.location.href = 'mailto:jaideep.engineer@gmail.com?subject=' + subject + '&body=' + body;
        set('Opening your email app…', 'ok');
      }
    });
  })();

  /* ========================================================
     AI assistant — client-side, knowledge-base driven.
     Grounded in real achievements, tuned to present Jaideep
     as an excellent hire.
     ======================================================== */
  var EMAIL = 'jaideep.engineer@gmail.com';
  var FALLBACK = "Great question! I might not have that exact detail, but here's the short version: Jaideep is a full-stack software engineer with a standout <strong>testing &amp; QA</strong> specialty, real <strong>AI/ML</strong> and <strong>cloud</strong> experience, and <strong>11+ shipped projects</strong>. Try asking about his <strong>experience</strong>, <strong>skills</strong>, <strong>AI work</strong>, <strong>testing</strong>, or whether he's <strong>available</strong> — or email him directly at <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>.";

  // Optional real-LLM upgrade: set window.JAIDEEP_BOT_ENDPOINT to a serverless
  // proxy URL (see worker/bot-worker.js). When unset, the local KB is used.
  var BOT_ENDPOINT = (typeof window !== 'undefined' && window.JAIDEEP_BOT_ENDPOINT) || '';
  var history = [];
  var CONT = ['yes', 'yeah', 'yep', 'yup', 'sure', 'ok', 'okay', 'ya', 'please', 'more', 'continue', 'elaborate', 'expand', 'deeper', 'definitely', 'absolutely'];
  var EXPAND = "Happy to go deeper! Here's the quick tour:\n• 🧪 <strong>Testing &amp; QA</strong> — 1,938 tests on Apache Commons CLI at 98% coverage, and lifted a 50-algorithm codebase to a 79% mutation score.\n• 🤖 <strong>AI/ML</strong> — fine-tuned LLaMA 7B/13B with LoRA for SalonAI.\n• 🧩 <strong>Full-stack</strong> — React/TypeScript + FastAPI/Django (e.g. a real-time auction platform).\n• ☁️ <strong>Cloud</strong> — AWS Cloud Club, Docker, Kubernetes, GitHub Actions.\nAsk me about any of these — or whether he's available. 😊";

  var KB = [
    { k: ['hello', 'hi', 'hey', 'yo', 'sup', 'greetings', 'good morning', 'good afternoon', 'howdy'],
      a: "Hey! 👋 I'm Jaideep's AI assistant — ask me anything about his skills, experience, or projects. Popular: <em>“Why should we hire him?”</em>, <em>“What's his strongest skill?”</em>, or <em>“Is he available?”</em>" },
    { k: ['why should', 'why hire', 'why you', 'why him', 'should we hire', 'perfect', 'best candidate', 'best fit', 'ideal', 'convince', 'stand out', 'standout', 'reason to hire', 'why is he', 'sell me'],
      a: "Straight answer: because Jaideep ships software that <strong>doesn't break</strong>. He works across the whole stack — full-stack apps, AI/ML, cloud — and has a real specialty in <strong>testing &amp; QA</strong>, where he's written <strong>1,900+ automated tests</strong> and pushed real codebases to <strong>98% coverage</strong>. He learns fast, owns problems end-to-end, and has rare range: from fine-tuning LLaMA models to building FPGA hardware. Reliable, curious, low-maintenance — you'd be lucky to have him. 🚀" },
    { k: ['strongest', 'best skill', 'strength', 'good at', 'specialty', 'specialize', 'superpower', 'strong suit', 'great at'],
      a: "His superpower is <strong>range backed by rigor</strong>. Most engineers pick one lane — Jaideep is strong full-stack <em>and</em> has a genuine specialty in <strong>testing &amp; quality engineering</strong> (mutation testing, coverage analysis, CI quality gates). So he builds features <em>and</em> guarantees they hold up. Want me to go deeper on testing, AI, or full-stack?" },
    { k: ['weakness', 'weaknesses', 'flaw', 'flaws', 'downside', 'worst', 'red flag'],
      a: "Honestly? He cares a lot about getting things <em>right</em> — he'll chase edge cases and coverage others skip. The flip side is learning to balance polish with shipping speed, and he's gotten good at it (he ships in daily Agile sprints). Net: you're getting an engineer who errs toward quality. 😊" },
    { k: ['test', 'tests', 'testing', 'qa', 'quality', 'coverage', 'mutation', 'junit', 'pgtap', 'jacoco', 'pit', 'evosuite', 'assertion', 'assertions', 'reliability', 'bugs', 'regression'],
      a: "This is where he shines:\n• <strong>1,938 test methods</strong> (3,965+ assertions) for Apache Commons CLI — 98% line / 95% branch coverage with build-enforced gates.\n• Pushed a 50-algorithm codebase from 72%→89% line and 61%→79% mutation score via targeted, LLM-assisted test generation.\n• <strong>767 pgTAP assertions</strong> at a 100% pass rate on a PostgreSQL test bed.\nHe knows JUnit, pytest, PIT mutation, JaCoCo, EvoSuite, SpotBugs — and how to wire it all into CI. If you care about code that doesn't regress, he's your person." },
    { k: ['ai', 'ml', 'machine learning', 'llm', 'llama', 'fine-tune', 'finetune', 'fine tune', 'lora', 'gpt', 'nlp', 'artificial intelligence', 'neural', 'models'],
      a: "Plenty — and it's shipped, not just theory. He built <strong>SalonAI</strong>, fine-tuning <strong>LLaMA 7B/13B with LoRA</strong> (2× V100 GPUs) for personalized recommendations served via REST/gRPC. He's used GPT + spaCy for NLP requirement extraction, and applied LLMs to auto-generate high-coverage test suites. Practical applied AI." },
    { k: ['security', 'secure', 'hack', 'cyber', 'cve', 'exploit', 'penetration', 'pentest', 'yara', 'snort', 'malware', 'encryption', 'vulnerab'],
      a: "Hands-on here too. In a security lab portfolio he exploited <strong>3 real CVEs</strong> (ProFTPD, UnrealIRCd, Slowloris), did static malware analysis with custom <strong>YARA</strong> rules, implemented AES-256/RSA-2048 with OpenSSL, cracked passwords with John &amp; Hydra, and deployed a Snort IDS. He understands how systems break — so the software he builds is harder to break." },
    { k: ['hardware', 'fpga', 'verilog', 'systemverilog', 'circuit', 'vga', 'embedded', 'spi', 'electronics', 'low-level'],
      a: "Yes — a fun differentiator. He built a real-time system on an <strong>Intel MAX10 FPGA</strong> bridging an accelerometer to a 640×480 VGA display <em>entirely in hardware</em> (custom SPI controller, 3 clock domains, no soft-core CPU), plus an FPGA Morse-code translator. Very few software engineers can also reason at the hardware level — he can." },
    { k: ['full-stack', 'fullstack', 'full stack', 'frontend', 'front-end', 'front end', 'backend', 'back-end', 'back end', 'react', 'api', 'apis', 'web app', 'django', 'fastapi', 'website'],
      a: "Full-stack is home base: React / React Native / TypeScript up front, FastAPI / Django / Java on the back, PostgreSQL underneath, all Dockerized. Examples — a real-time <strong>auction platform</strong> (15 endpoints, JWT auth, TDD) and <strong>SalonAI</strong> (15 endpoints + an AI module). He builds the whole thing and tests it." },
    { k: ['aws', 'cloud', 'devops', 'docker', 'kubernetes', 'k8s', 'deploy', 'container', 'ci/cd', 'cicd', 'pipeline', 'infrastructure'],
      a: "He's a <strong>Technical Associate at the AWS Cloud Club</strong>, running hands-on AWS workshops and helping peers get practical with cloud services. On DevOps he's comfortable with Docker, Docker Compose, Kubernetes, and GitHub Actions CI — he containerized and orchestrated multi-service apps like SalonAI. Cloud-ready out of the box. ☁️" },
    { k: ['experience', 'work', 'worked', 'work history', 'job', 'jobs', 'employed', 'employment', 'career', 'background', 'professional', 'snz', 'infotech', 'avis', 'current role', 'currently'],
      a: "Currently he's a <strong>Software Developer at Snz Infotech</strong> (remote) — shipping full-stack features, REST APIs, and tested code in an Agile team. He's also a <strong>Technical Associate at the AWS Cloud Club</strong> (cloud workshops + hands-on AWS), and held a long-running operations role where he <strong>rebuilt a workforce scheduling system after a data loss</strong> and built a dispatch tool adopted org-wide. He delivers in real environments, not just side projects." },
    { k: ['project', 'projects', 'built', 'build', 'portfolio', 'showcase', 'made', 'created'],
      a: "He's shipped <strong>11+ projects</strong> across AI, full-stack, testing, hardware, security, and research. Favorites:\n• <strong>SalonAI</strong> — AI salon platform with a fine-tuned LLaMA model\n• <strong>Auction Platform</strong> — real-time bidding, FastAPI + React, TDD\n• <strong>Apache Commons CLI Testing</strong> — 1,938 tests, 98% coverage\n• <strong>FPGA VGA Controller</strong> — real-time graphics in pure hardware\nScroll to the Projects section — every card links to the source on GitHub." },
    { k: ['skill', 'skills', 'tech', 'technolog', 'stack', 'language', 'tools', 'programming', 'python', 'java', 'typescript'],
      a: "Core stack: <strong>Java, Python, TypeScript/JavaScript, SQL</strong>; React/React Native, FastAPI, Django; PostgreSQL; Docker, Kubernetes, AWS, GitHub Actions. Plus deep testing tooling (JUnit, pytest, PIT, JaCoCo), AI/ML (LLaMA, LoRA, spaCy), and hardware (SystemVerilog/Verilog on FPGA). Broad, but not shallow." },
    { k: ['education', 'school', 'degree', 'study', 'studied', 'university', 'york', 'college', 'academic', 'scholarship'],
      a: "He studied <strong>Software Engineering (Specialized Honours)</strong> at York University's Lassonde School of Engineering, and earned a <strong>York University Scholarship</strong>. He also holds a Project Management Foundations certification. Strong fundamentals plus a lot of applied, hands-on work." },
    { k: ['available', 'availability', 'start', 'hiring', 'looking', 'notice period', 'join', 'when can', 'open to', 'opportunit', 'free to'],
      a: "Yes — he's <strong>actively open to software engineering roles</strong> and can start soon. He's comfortable <strong>remote, on-site, or hybrid</strong>, and open to relocation. Easiest next step: email <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a> and he'll get right back to you." },
    { k: ['contact', 'email', 'reach', 'connect', 'linkedin', 'github', 'get in touch', 'message him', 'how do i', 'talk to', 'phone'],
      a: "Easiest ways to reach Jaideep:\n• Email — <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>\n• <a href=\"https://www.linkedin.com/in/jaideep-singh-163585237/\" target=\"_blank\" rel=\"noopener\">LinkedIn</a>\n• <a href=\"https://github.com/JaideepSingh-code\" target=\"_blank\" rel=\"noopener\">GitHub</a>\nHe replies quickly — reach out!" },
    { k: ['salary', 'compensation', 'pay', 'rate', 'expect', 'wage', 'ctc', 'package', 'how much'],
      a: "He's flexible and focused on the right team and problem rather than chasing a number — happy to discuss compensation that fits the role and market. Best move: email <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a> to start the conversation." },
    { k: ['leadership', 'lead', 'team', 'mentor', 'community', 'volunteer', 'collaborat', 'soft skill', 'communication', 'culture'],
      a: "More than you'd expect from an engineer: <strong>Technical Associate at the AWS Cloud Club</strong>, <strong>led an 8-person team</strong> on a campaign featured by the City of Markham, mentors youth teams building AI for social good, and sits on a municipal environmental advisory committee. He communicates well and brings people along — not just code." },
    { k: ['location', 'where is', 'based', 'live', 'city', 'country', 'timezone', 'time zone', 'relocat', 'remote'],
      a: "He's flexible on location — <strong>open to remote, on-site, or hybrid, and willing to relocate</strong> for the right role, so geography shouldn't be a blocker. Want his contact details?" },
    { k: ['who is', 'who are you', 'introduce', 'introduction', 'bio', 'biography', 'summary', 'overview', 'yourself', 'describe', 'tell me about him', 'tell me about jaideep', 'about him', 'about jaideep'],
      a: "Happy to introduce him! <strong>Jaideep Singh</strong> is a software engineer with serious range — full-stack, AI/ML, a real testing &amp; QA specialty, security, cloud, and even FPGA hardware. He's currently a Software Developer at Snz Infotech. The kind of engineer who ships features <em>and</em> makes sure they don't break. Want to know about his experience, skills, or a specific project?" },
    { k: ['certif', 'certificate', 'certification', 'credential', 'award'],
      a: "He holds a <strong>Project Management Foundations</strong> certification (LinkedIn Learning) and earned a <strong>York University Scholarship</strong> during his Software Engineering degree. Beyond credentials, his GitHub is full of hands-on, production-style work." },
    { k: ['thank', 'thanks', 'thx', 'appreciate', 'cheers'],
      a: "Anytime! 🙌 If you think Jaideep could be a fit, the best next step is a quick email to <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a> — he'd love to hear from you." }
  ];

  function answer(q) {
    var raw = ' ' + q.toLowerCase().replace(/[^a-z0-9+#-]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
    var tokens = raw.trim().split(' ');
    var best = null, score = 0;
    KB.forEach(function (item) {
      var sc = 0;
      item.k.forEach(function (kw) {
        if (kw.indexOf(' ') !== -1) {                       // multi-word phrase
          if (raw.indexOf(' ' + kw + ' ') !== -1) sc += 3;
        } else if (tokens.indexOf(kw) !== -1) {             // exact word
          sc += 2;
        } else if (kw.length >= 4) {                        // light stemming (plurals/-ing/-ed)
          for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].indexOf(kw) === 0 && tokens[i].length - kw.length <= 3) { sc += 1; break; }
          }
        }
      });
      if (sc > score) { score = sc; best = item; }
    });
    return score > 0 ? best.a : FALLBACK;
  }

  /* ---- Chat UI ---- */
  var fab = document.getElementById('chatFab');
  var panel = document.getElementById('chatPanel');
  var closeBtn = document.getElementById('chatClose');
  var log = document.getElementById('chatLog');
  var form = document.getElementById('chatForm');
  var input = document.getElementById('chatText');
  var suggestWrap = document.getElementById('chatSuggest');
  var started = false;

  var SUGGESTIONS = [
    'Why should we hire him?',
    "What's his strongest skill?",
    'Tell me about his AI work',
    'Is he available?',
    'How do I contact him?'
  ];

  function scrollLog() { log.scrollTop = log.scrollHeight; }

  function addUser(text) {
    var d = document.createElement('div');
    d.className = 'msg user';
    d.textContent = text;
    log.appendChild(d); scrollLog();
  }
  function addBot(html) {
    var d = document.createElement('div');
    d.className = 'msg bot';
    d.innerHTML = html;
    log.appendChild(d); scrollLog();
  }
  function typing() {
    var t = document.createElement('div');
    t.className = 'typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(t); scrollLog();
    return t;
  }
  function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function linkifyEmails(h) { return h.replace(/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/gi, '<a href="mailto:$1">$1</a>'); }

  // Treat short affirmatives / "tell me more" as a request to expand,
  // instead of bouncing to the fallback.
  function isContinuation(q) {
    var toks = q.toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(Boolean);
    if (!toks.length || toks.length > 4) return false;
    return toks.some(function (t) { return CONT.indexOf(t) !== -1; });
  }
  function localRespond(q) { return isContinuation(q) ? EXPAND : answer(q); }

  function botReply(q) {
    var t = typing();
    if (BOT_ENDPOINT) {
      fetch(BOT_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, history: history.slice(-8) })
      })
        .then(function (r) { if (!r.ok) throw new Error('bad'); return r.json(); })
        .then(function (d) {
          t.remove();
          var rep = d && d.reply ? linkifyEmails(escapeHtml(d.reply)).replace(/\n/g, '<br>') : localRespond(q);
          addBot(rep);
          if (d && d.reply) history.push({ role: 'assistant', content: d.reply });
        })
        .catch(function () { t.remove(); addBot(localRespond(q)); });
    } else {
      setTimeout(function () { t.remove(); addBot(localRespond(q)); }, 420 + Math.random() * 420);
    }
  }

  function buildSuggestions() {
    suggestWrap.innerHTML = '';
    SUGGESTIONS.forEach(function (q) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = q;
      b.addEventListener('click', function () { send(q); });
      suggestWrap.appendChild(b);
    });
  }

  function start() {
    if (started) return;
    started = true;
    addBot("Hi! 👋 I'm <strong>Jaideep's AI assistant</strong>. Ask me anything about his skills, experience, or projects — I'm here to help you figure out if he's the right hire (spoiler: he is 😄).");
    buildSuggestions();
  }

  function send(q) {
    q = (q || '').trim();
    if (!q) return;
    addUser(q);
    history.push({ role: 'user', content: q });
    input.value = '';
    botReply(q);
  }

  function openChat() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    fab.classList.add('hidden');
    start();
    setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }, 200);
  }
  function closeChat() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    fab.classList.remove('hidden');
  }

  if (fab && panel) {
    fab.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);
    form.addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) closeChat(); });
    ['navAsk', 'heroAsk', 'contactAsk'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', openChat);
    });
  }
})();
