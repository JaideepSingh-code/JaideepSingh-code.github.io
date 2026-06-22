/* ============================================================
   Jaideep Singh — Portfolio
   3D animated hero (Three.js via CDN ES module).
   A slowly-rotating wireframe icosahedron with glowing vertices,
   wrapped in a drifting particle field, with subtle mouse parallax.
   Degrades gracefully: if WebGL/CDN is unavailable, the CSS
   gradient background still shows and nothing breaks.
   ============================================================ */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    return; // no WebGL — CSS background remains
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 16;

  // Brand palette
  const COL_BLUE = new THREE.Color(0x6ea8ff);
  const COL_VIOLET = new THREE.Color(0xa78bff);
  const COL_TEAL = new THREE.Color(0x2ee6c5);

  // --- Core geometric object (offset toward the right on wide screens) ---
  const core = new THREE.Group();
  scene.add(core);

  const baseGeo = new THREE.IcosahedronGeometry(4.2, 1);

  // Glowing wireframe edges
  const edges = new THREE.LineSegments(
    new THREE.WireframeGeometry(baseGeo),
    new THREE.LineBasicMaterial({ color: COL_BLUE, transparent: true, opacity: 0.32 })
  );
  core.add(edges);

  // Inner solid faint shell for depth
  const shell = new THREE.Mesh(
    baseGeo,
    new THREE.MeshBasicMaterial({ color: 0x0f1830, transparent: true, opacity: 0.35, wireframe: false })
  );
  shell.scale.setScalar(0.985);
  core.add(shell);

  // Glowing vertices
  const vertGeo = new THREE.IcosahedronGeometry(4.2, 1);
  const vCount = vertGeo.attributes.position.count;
  const vColors = new Float32Array(vCount * 3);
  for (let i = 0; i < vCount; i++) {
    const t = i / vCount;
    const c = t < 0.5 ? COL_BLUE.clone().lerp(COL_VIOLET, t * 2) : COL_VIOLET.clone().lerp(COL_TEAL, (t - 0.5) * 2);
    vColors[i * 3] = c.r; vColors[i * 3 + 1] = c.g; vColors[i * 3 + 2] = c.b;
  }
  vertGeo.setAttribute('color', new THREE.BufferAttribute(vColors, 3));
  const verts = new THREE.Points(
    vertGeo,
    new THREE.PointsMaterial({ size: 0.18, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  core.add(verts);

  // --- Particle field ---
  const N = window.innerWidth < 640 ? 900 : 1700;
  const pos = new Float32Array(N * 3);
  const pcol = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 9 + Math.random() * 16;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    const t = Math.random();
    const c = t < 0.5 ? COL_BLUE.clone().lerp(COL_VIOLET, t * 2) : COL_VIOLET.clone().lerp(COL_TEAL, (t - 0.5) * 2);
    pcol[i * 3] = c.r; pcol[i * 3 + 1] = c.g; pcol[i * 3 + 2] = c.b;
  }
  const fieldGeo = new THREE.BufferGeometry();
  fieldGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  fieldGeo.setAttribute('color', new THREE.BufferAttribute(pcol, 3));
  const field = new THREE.Points(
    fieldGeo,
    new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  scene.add(field);

  // --- Sizing / responsive offset ---
  let baseScale = 1;
  function resize() {
    const w = canvas.clientWidth || canvas.offsetWidth || window.innerWidth;
    const h = canvas.clientHeight || canvas.offsetHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const wide = w > 900;
    const small = w < 640;
    // Push the core to the right beside the text on wide layouts;
    // on phones, shrink it and lift it above the body copy.
    core.position.x = wide ? 5.2 : 0;
    core.position.y = wide ? 0.4 : (small ? 3.4 : 2.2);
    baseScale = small ? 0.6 : 1;
    core.scale.setScalar(baseScale);
    // Lower intensity on small screens so text stays legible
    edges.material.opacity = small ? 0.2 : 0.32;
    verts.material.opacity = small ? 0.7 : 0.95;
    field.material.opacity = small ? 0.6 : 0.85;
  }
  resize();
  window.addEventListener('resize', resize);

  // --- Mouse parallax ---
  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (e) {
    target.x = (e.clientX / window.innerWidth - 0.5);
    target.y = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  // --- Pause when hero off-screen (battery friendly) ---
  let visible = true;
  const hero = document.getElementById('hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.02 })
      .observe(hero);
  }

  // --- Render loop ---
  let t = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    t += 0.0035;

    // ease parallax
    cur.x += (target.x - cur.x) * 0.05;
    cur.y += (target.y - cur.y) * 0.05;

    if (!reduced) {
      core.rotation.y += 0.0016;
      core.rotation.x = Math.sin(t * 0.5) * 0.12;
      field.rotation.y -= 0.0006;
      field.rotation.x += 0.0002;
      const breathe = 1 + Math.sin(t) * 0.015;
      core.scale.setScalar(baseScale * breathe);
    }

    // parallax tilt of the whole view
    core.rotation.z = cur.x * 0.15;
    camera.position.x = cur.x * 2.2;
    camera.position.y = -cur.y * 1.6;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  // For reduced motion, render a single static frame; otherwise animate.
  if (reduced) {
    core.rotation.set(0.3, 0.6, 0);
    renderer.render(scene, camera);
  } else {
    frame();
  }
})();
