/* ============================================================
   Jaideep Singh — Portfolio
   Subtle 3D hero accent (Three.js via CDN ES module), tuned for
   the LIGHT editorial theme: a slowly-rotating wireframe
   icosahedron + drifting particles in the indigo accent, with
   mouse parallax. Kept restrained so the page stays clean and
   recruiter-friendly. Degrades gracefully without WebGL.
   ============================================================ */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

(function () {
  'use strict';

  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAPER = 0xf4f3ee;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(PAPER, 13, 33);            // linear fog → fade into the paper background

  var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 15);

  var INDIGO = new THREE.Color(0x4f46e5);
  var TEAL = new THREE.Color(0x0e9f8b);

  // --- Core wireframe icosahedron ---
  var core = new THREE.Group();
  scene.add(core);

  var geo = new THREE.IcosahedronGeometry(4.5, 1);
  var edges = new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({ color: INDIGO, transparent: true, opacity: 0.22 })
  );
  core.add(edges);

  var dotGeo = new THREE.IcosahedronGeometry(4.5, 1);
  var nodes = new THREE.Points(
    dotGeo,
    new THREE.PointsMaterial({ color: INDIGO, size: 0.14, transparent: true, opacity: 0.55, sizeAttenuation: true })
  );
  core.add(nodes);

  // --- Drifting particle field ---
  var N = window.innerWidth < 640 ? 380 : 720;
  var pos = new Float32Array(N * 3);
  var col = new Float32Array(N * 3);
  for (var i = 0; i < N; i++) {
    var r = 7 + Math.random() * 12;
    var th = Math.random() * Math.PI * 2;
    var ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = r * Math.cos(ph);
    var c = Math.random() < 0.7 ? INDIGO : TEAL;
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  var fieldGeo = new THREE.BufferGeometry();
  fieldGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  fieldGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  var field = new THREE.Points(
    fieldGeo,
    new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.45, sizeAttenuation: true })
  );
  scene.add(field);

  // --- Responsive placement ---
  function resize() {
    var w = canvas.clientWidth || canvas.offsetWidth || window.innerWidth;
    var h = canvas.clientHeight || canvas.offsetHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    var wide = w > 900;
    var small = w < 640;
    // sit it toward the right on desktop (behind/around the facts card area), centered on mobile
    core.position.x = wide ? 4.6 : 0;
    core.position.y = wide ? 0.2 : (small ? 2.4 : 1.6);
    var s = small ? 0.7 : 1;
    core.scale.setScalar(s);
    applyTheme();
  }
  function applyTheme() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    scene.fog.color.setHex(dark ? 0x0b0c11 : 0xf4f3ee);
    var lineCol = dark ? 0x818cf8 : 0x4f46e5;
    edges.material.color.setHex(lineCol);
    nodes.material.color.setHex(lineCol);
    var sm = (canvas.clientWidth || window.innerWidth) < 640;
    edges.material.opacity = dark ? (sm ? 0.3 : 0.42) : (sm ? 0.2 : 0.32);
    nodes.material.opacity = dark ? (sm ? 0.62 : 0.85) : (sm ? 0.5 : 0.72);
    field.material.opacity = dark ? (sm ? 0.5 : 0.7) : (sm ? 0.38 : 0.55);
    if (reduced) renderer.render(scene, camera);
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('themechange', applyTheme);

  // --- Mouse parallax ---
  var target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (e) {
    target.x = (e.clientX / window.innerWidth - 0.5);
    target.y = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  // --- Pause when hero off-screen ---
  var visible = true;
  var hero = document.getElementById('hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.02 }).observe(hero);
  }

  // --- Render loop ---
  var t = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    t += 0.0032;
    cur.x += (target.x - cur.x) * 0.05;
    cur.y += (target.y - cur.y) * 0.05;
    if (!reduced) {
      core.rotation.y += 0.0015;
      core.rotation.x = Math.sin(t * 0.4) * 0.1;
      field.rotation.y -= 0.0005;
    }
    core.rotation.z = cur.x * 0.12;
    camera.position.x = cur.x * 2.4;
    camera.position.y = -cur.y * 1.6;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }

  if (reduced) {
    core.rotation.set(0.25, 0.6, 0);
    renderer.render(scene, camera);
  } else {
    frame();
  }
})();
