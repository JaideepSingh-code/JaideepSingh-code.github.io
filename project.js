/* ============================================================
   Project detail page — populate from PROJECTS[slug] and drive
   the 3D coverflow gallery.
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.PROJECTS || {};
  var slug = new URLSearchParams(location.search).get('p');
  if (!slug || !DATA[slug]) slug = Object.keys(DATA)[0];
  var p = DATA[slug];
  if (!p) return;

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* ---- Theme ---- */
  document.body.style.setProperty('--pa', p.accent[0]);
  document.body.style.setProperty('--pb', p.accent[1]);

  /* ---- SEO meta (Googlebot renders JS) ---- */
  var canonical = 'https://jaideepsingh.dev/project.html?p=' + slug;
  var metaDesc = p.title + ' — ' + p.tagline + '. ' + p.overview.slice(0, 150);
  document.title = p.title + ' — Jaideep Singh | Software Engineer';
  function setAttr(id, attr, val) { var el = $(id); if (el) el.setAttribute(attr, val); }
  setAttr('mDesc', 'content', metaDesc);
  setAttr('ogTitle', 'content', p.title + ' — Jaideep Singh');
  setAttr('ogDesc', 'content', p.tagline);
  setAttr('ogUrl', 'content', canonical);
  setAttr('canon', 'href', canonical);
  var ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: p.title,
    description: p.overview,
    url: canonical,
    codeRepository: p.repo,
    keywords: p.tech.join(', '),
    about: p.category,
    author: { '@type': 'Person', name: 'Jaideep Singh', url: 'https://jaideepsingh.dev' }
  });
  document.head.appendChild(ld);

  /* ---- Head + hero ---- */
  $('projCat').textContent = p.category;
  $('projTitle').textContent = p.title;
  $('projTagline').textContent = p.overview ? p.tagline : p.tagline;
  $('projOverview').textContent = p.overview;
  ['projRepo', 'projRepo2', 'navRepo'].forEach(function (id) { var el = $(id); if (el) el.href = p.repo; });
  var demo = $('projDemo');
  if (p.demo) { demo.href = p.demo; demo.style.display = ''; } else { demo.style.display = 'none'; }

  /* ---- Highlights ---- */
  $('projHighlights').innerHTML = p.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('');

  /* ---- Metrics ---- */
  $('projMetrics').innerHTML = p.metrics.map(function (m) {
    return '<li><b>' + esc(m.v) + '</b><span>' + esc(m.l) + '</span></li>';
  }).join('');

  /* ---- Tech ---- */
  $('projTech').innerHTML = p.tech.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');

  /* ---- Build gallery slides ---- */
  var gallery = $('gallery');
  var slidesHtml = [];

  // cover
  slidesHtml.push(
    '<div class="slide-3d cover"><div class="cover-inner">' +
    '<span class="cover-icon">' + p.icon + '</span>' +
    '<span class="cover-cat">' + esc(p.category) + '</span>' +
    '<h3>' + esc(p.title) + '</h3>' +
    '<p>' + esc(p.tagline) + '</p>' +
    '</div></div>'
  );
  // real screenshots
  (p.shots || []).forEach(function (s) {
    slidesHtml.push(
      '<div class="slide-3d shot"><img src="' + s.src + '" alt="' + esc(s.label) + '" loading="lazy" />' +
      '<span class="shot-label">' + esc(s.label) + '</span></div>'
    );
  });
  // metrics panel
  slidesHtml.push(
    '<div class="slide-3d panel"><h4>By the numbers</h4><div class="panel-metrics">' +
    p.metrics.map(function (m) { return '<div><b>' + esc(m.v) + '</b><span>' + esc(m.l) + '</span></div>'; }).join('') +
    '</div></div>'
  );
  // highlights panel
  slidesHtml.push(
    '<div class="slide-3d panel"><h4>Highlights</h4><ul class="panel-list">' +
    p.highlights.slice(0, 4).map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') +
    '</ul></div>'
  );
  // stack panel
  slidesHtml.push(
    '<div class="slide-3d panel"><h4>Built with</h4><div class="panel-chips">' +
    p.tech.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') +
    '</div></div>'
  );

  gallery.innerHTML = slidesHtml.join('');
  var slides = Array.prototype.slice.call(gallery.querySelectorAll('.slide-3d'));

  /* ---- Coverflow ---- */
  var active = 0;
  var stage = $('stage');

  function dims() {
    var w = window.innerWidth;
    if (w < 560) return { gap: 150, depth: 130, angle: 38 };
    if (w < 900) return { gap: 240, depth: 180, angle: 42 };
    return { gap: 340, depth: 230, angle: 44 };
  }

  function layout() {
    var d = dims();
    slides.forEach(function (s, i) {
      var off = i - active;
      var aoff = Math.abs(off);
      var sign = off === 0 ? 0 : (off > 0 ? 1 : -1);
      var x = off * d.gap;
      var z = -aoff * d.depth;
      var ry = off === 0 ? 0 : -sign * d.angle;
      var sc = off === 0 ? 1 : 0.84;
      s.style.transform = 'translate(-50%,-50%) translateX(' + x + 'px) translateZ(' + z + 'px) rotateY(' + ry + 'deg) scale(' + sc + ')';
      s.style.zIndex = String(100 - aoff);
      s.style.opacity = aoff > 3 ? '0' : '1';
      s.style.pointerEvents = aoff > 3 ? 'none' : 'auto';
      s.classList.toggle('is-active', off === 0);
    });
    buildDots();
  }

  function go(i) { active = Math.max(0, Math.min(slides.length - 1, i)); layout(); }

  /* dots */
  var dotsWrap = $('gDots');
  function buildDots() {
    if (dotsWrap.childElementCount !== slides.length) {
      dotsWrap.innerHTML = slides.map(function (_, i) { return '<button data-i="' + i + '" aria-label="Go to panel ' + (i + 1) + '"></button>'; }).join('');
      Array.prototype.forEach.call(dotsWrap.children, function (b) {
        b.addEventListener('click', function () { go(parseInt(b.getAttribute('data-i'), 10)); });
      });
    }
    Array.prototype.forEach.call(dotsWrap.children, function (b, i) { b.classList.toggle('on', i === active); });
  }

  $('gPrev').addEventListener('click', function () { go(active - 1); });
  $('gNext').addEventListener('click', function () { go(active + 1); });
  slides.forEach(function (s, i) { s.addEventListener('click', function () { if (i !== active) go(i); }); });

  // keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') go(active - 1);
    else if (e.key === 'ArrowRight') go(active + 1);
  });

  // drag / swipe
  var down = false, startX = 0, moved = false;
  stage.addEventListener('pointerdown', function (e) { down = true; moved = false; startX = e.clientX; });
  window.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 70) { go(active + (dx < 0 ? 1 : -1)); startX = e.clientX; moved = true; }
  });
  window.addEventListener('pointerup', function () { down = false; });

  // mouse parallax tilt
  var raf = null;
  stage.addEventListener('mousemove', function (e) {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      var r = stage.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      gallery.style.transform = 'rotateX(' + (-py * 6).toFixed(2) + 'deg) rotateY(' + (px * 8).toFixed(2) + 'deg)';
    });
  });
  stage.addEventListener('mouseleave', function () { gallery.style.transform = 'rotateX(0) rotateY(0)'; });

  window.addEventListener('resize', layout);
  layout();

  /* ---- More projects ---- */
  var more = $('moreGrid');
  more.innerHTML = Object.keys(DATA).filter(function (k) { return k !== slug; }).map(function (k) {
    var o = DATA[k];
    return '<a class="more-card" href="project.html?p=' + k + '" style="--pa:' + o.accent[0] + ';--pb:' + o.accent[1] + '">' +
      '<span class="more-icon">' + o.icon + '</span>' +
      '<div><strong>' + esc(o.title) + '</strong><span>' + esc(o.tagline) + '</span></div>' +
      '<span class="more-arrow">→</span></a>';
  }).join('');

  var y = $('year'); if (y) y.textContent = new Date().getFullYear();
})();
