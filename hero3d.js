/* ============================================================
   Jaideep Singh — Portfolio
   3D animated hero (Three.js via CDN ES module).
   Theme: a floating 3D node-network graph (nodes + live edges)
   hovering over an infinite perspective grid floor that scrolls
   toward the viewer, with depth fog and mouse parallax.
   Degrades gracefully: if WebGL/CDN is unavailable, the CSS
   gradient background still shows and nothing breaks.
   ============================================================ */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BG = 0x08090e;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    return; // no WebGL — CSS background remains
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(BG, 0.032);

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 240);
  camera.position.set(0, 2.8, 17);

  // Brand palette
  const COL_BLUE = new THREE.Color(0x6ea8ff);
  const COL_VIOLET = new THREE.Color(0xa78bff);
  const COL_TEAL = new THREE.Color(0x2ee6c5);
  function rampColor(t) {
    return t < 0.5 ? COL_BLUE.clone().lerp(COL_VIOLET, t * 2) : COL_VIOLET.clone().lerp(COL_TEAL, (t - 0.5) * 2);
  }

  // ---------- Infinite perspective grid floor ----------
  const GRID_SIZE = 120, GRID_DIV = 60;
  const cell = GRID_SIZE / GRID_DIV;
  const grid = new THREE.GridHelper(GRID_SIZE, GRID_DIV, 0x5a82e0, 0x243a66);
  grid.material.transparent = true;
  grid.material.opacity = 0.7;
  grid.position.y = -6.5;
  scene.add(grid);

  // ---------- Node-network graph ----------
  const net = new THREE.Group();
  scene.add(net);

  const small0 = window.innerWidth < 640;
  const R = 5.2;
  const NODES = small0 ? 46 : 94;
  const node = [];
  for (let i = 0; i < NODES; i++) {
    let x, y, z, d;
    do { x = Math.random() * 2 - 1; y = Math.random() * 2 - 1; z = Math.random() * 2 - 1; d = x * x + y * y + z * z; } while (d > 1);
    node.push(new THREE.Vector3(x * R, y * R, z * R));
  }

  // Points (glowing nodes)
  const npos = new Float32Array(NODES * 3);
  const ncol = new Float32Array(NODES * 3);
  for (let i = 0; i < NODES; i++) {
    npos[i * 3] = node[i].x; npos[i * 3 + 1] = node[i].y; npos[i * 3 + 2] = node[i].z;
    const c = rampColor(node[i].length() / R);
    ncol[i * 3] = c.r; ncol[i * 3 + 1] = c.g; ncol[i * 3 + 2] = c.b;
  }
  const nGeo = new THREE.BufferGeometry();
  nGeo.setAttribute('position', new THREE.BufferAttribute(npos, 3));
  nGeo.setAttribute('color', new THREE.BufferAttribute(ncol, 3));
  const nodeMat = new THREE.PointsMaterial({ size: 0.28, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, fog: true });
  net.add(new THREE.Points(nGeo, nodeMat));

  // Edges (connections between nearby nodes)
  const THRESH = 2.5;
  const epos = [], ecol = [];
  for (let i = 0; i < NODES; i++) {
    for (let j = i + 1; j < NODES; j++) {
      if (node[i].distanceTo(node[j]) < THRESH) {
        const ci = rampColor(node[i].length() / R), cj = rampColor(node[j].length() / R);
        epos.push(node[i].x, node[i].y, node[i].z, node[j].x, node[j].y, node[j].z);
        ecol.push(ci.r, ci.g, ci.b, cj.r, cj.g, cj.b);
      }
    }
  }
  const eGeo = new THREE.BufferGeometry();
  eGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(epos), 3));
  eGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(ecol), 3));
  const edgeMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.26, blending: THREE.AdditiveBlending, depthWrite: false, fog: true });
  net.add(new THREE.LineSegments(eGeo, edgeMat));

  // ---------- Sizing / responsive ----------
  let baseScale = 1;
  function resize() {
    const w = canvas.clientWidth || canvas.offsetWidth || window.innerWidth;
    const h = canvas.clientHeight || canvas.offsetHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const wide = w > 900;
    const small = w < 640;
    net.position.x = wide ? 5.4 : 0;
    net.position.y = wide ? 0.6 : (small ? 3.0 : 2.0);
    baseScale = small ? 0.62 : 1;
    net.scale.setScalar(baseScale);
    // legibility on small screens
    nodeMat.opacity = small ? 0.75 : 0.95;
    edgeMat.opacity = small ? 0.16 : 0.26;
    grid.material.opacity = small ? 0.35 : 0.7;
  }
  resize();
  window.addEventListener('resize', resize);

  // ---------- Mouse parallax ----------
  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (e) {
    target.x = (e.clientX / window.innerWidth - 0.5);
    target.y = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  // ---------- Pause when hero off-screen ----------
  let visible = true;
  const hero = document.getElementById('hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.02 }).observe(hero);
  }

  const lookAt = new THREE.Vector3(0, -1.8, 0);

  // ---------- Render loop ----------
  let t = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    t += 0.0035;

    cur.x += (target.x - cur.x) * 0.05;
    cur.y += (target.y - cur.y) * 0.05;

    if (!reduced) {
      // scroll the grid toward the camera (infinite floor)
      grid.position.z = (grid.position.z + 0.03) % cell;
      // slow graph rotation + gentle bob
      net.rotation.y += 0.0016;
      net.rotation.x = Math.sin(t * 0.4) * 0.08;
      net.position.y = (canvas.clientWidth > 900 ? 0.6 : (canvas.clientWidth < 640 ? 3.0 : 2.0)) + Math.sin(t) * 0.25;
      // pulse node glow
      nodeMat.size = 0.28 + Math.sin(t * 1.6) * 0.05;
    }

    // parallax
    net.rotation.z = cur.x * 0.12;
    camera.position.x = cur.x * 3.0;
    camera.position.y = 2.8 - cur.y * 1.8;
    camera.lookAt(lookAt);

    renderer.render(scene, camera);
  }

  if (reduced) {
    net.rotation.set(0.2, 0.6, 0);
    camera.lookAt(lookAt);
    renderer.render(scene, camera);
  } else {
    frame();
  }
})();
