// 3D-kit — Dars01 3D-prototip uchun umumiy quruvchilar (izolyatsiya, DEMO).
// three.js r160+. Har ekran o'z stage'ini (renderer/canvas) yaratadi.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export const ACCENT = 0xfe5b1a;   // o'nlik / brend aksent
export const BLUE = 0x4a86ff;     // birlik / ko'k
export const EYE = 0x5bd6f2;
export const smooth = THREE.MathUtils.smoothstep;
export const lerp = THREE.MathUtils.lerp;

// --- Stage ------------------------------------------------------------------
export function createStage(canvas, opts = {}) {
  const { orbit = false, autoRotate = false, bg = 0x05060f, camPos = [0, 1.2, 12.5], camTarget = [0, 0.1, 0], bloomStrength = 0.7 } = opts;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bg);
  scene.fog = new THREE.FogExp2(bg, 0.016);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  camera.position.set(...camPos);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = orbit;
  controls.enableRotate = orbit;
  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = 0.3;
  controls.minDistance = 6;
  controls.maxDistance = 20;
  controls.target.set(...camTarget);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), bloomStrength, 0.5, 0.82);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // yorug'lik
  scene.add(new THREE.AmbientLight(0x46557a, 0.8));
  const key = new THREE.DirectionalLight(0xfff2e0, 2.1); key.position.set(5, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x5b8cff, 1.15); rim.position.set(-6, -1, -4); scene.add(rim);

  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  let frameCbs = [];
  let clickCfg = null;
  let raf = 0, disposed = false;

  function resize() {
    const w = canvas.clientWidth || 640, h = canvas.clientHeight || 400;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.resolution.set(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  function onPointerDown(e) {
    if (!clickCfg) return;
    const r = canvas.getBoundingClientRect();
    ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(ptr, camera);
    const targets = clickCfg.getTargets();
    const hit = raycaster.intersectObjects(targets, true)[0];
    if (hit) {
      let o = hit.object;
      while (o && o.userData.pickId === undefined && o.parent) o = o.parent;
      clickCfg.handler(o.userData.pickId !== undefined ? o : hit.object, hit);
    }
  }
  canvas.addEventListener("pointerdown", onPointerDown);

  function loop() {
    if (disposed) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const el = clock.getElapsedTime();
    for (const cb of frameCbs) cb(dt, el);
    controls.update();
    composer.render();
    raf = requestAnimationFrame(loop);
  }

  return {
    scene, camera, renderer, composer, controls, bloom,
    onFrame(cb) { frameCbs.push(cb); },
    onClick(getTargets, handler) { clickCfg = { getTargets, handler }; },
    start() { if (!raf) loop(); },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      controls.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      });
      composer.dispose?.();
      renderer.dispose();
    },
  };
}

// --- Umumiy materiallar (har chaqiruvda yangi) ------------------------------
const metal = (c, r = 0.35, m = 0.6) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const glow = (c, i = 1.6) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i });

// --- Fon: yulduzlar + chang --------------------------------------------------
export function addStars(scene, count = 1300, radius = 90) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * (0.6 + Math.random() * 0.4), th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th); pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th); pos[i * 3 + 2] = r * Math.cos(ph);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.09, sizeAttenuation: true, transparent: true, opacity: 0.9 }));
  scene.add(p); return p;
}
export function addDust(scene, count = 120) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) { pos[i * 3] = (Math.random() - 0.5) * 16; pos[i * 3 + 1] = (Math.random() - 0.5) * 10; pos[i * 3 + 2] = (Math.random() - 0.5) * 8; }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xbcd0ff, size: 0.05, sizeAttenuation: true, transparent: true, opacity: 0.35 }));
  scene.add(p); return p;
}

// --- Halqali sayyora ---------------------------------------------------------
export function addPlanet(scene, pos = [-6.8, 2.6, -15], scale = 1) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(2.6, 48, 48), new THREE.MeshStandardMaterial({ color: 0x3f6db0, roughness: 0.85, metalness: 0.1, emissive: 0x0a1830, emissiveIntensity: 0.5 })));
  const ring = new THREE.Mesh(new THREE.RingGeometry(3.4, 5.2, 80), new THREE.MeshBasicMaterial({ color: 0xc9a06a, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
  ring.rotation.x = -Math.PI / 2.2; g.add(ring);
  g.position.set(...pos); g.scale.setScalar(scale); g.rotation.z = 0.35;
  scene.add(g); return g;
}

// --- BIT personaji -----------------------------------------------------------
export function makeBit() {
  const body = metal(0xc4d3dc, 0.35, 0.55);
  const bit = new THREE.Group();
  const b = new THREE.Mesh(new RoundedBoxGeometry(1.15, 1.35, 0.72, 4, 0.28), body); b.position.y = -0.15; bit.add(b);
  const h = new THREE.Mesh(new RoundedBoxGeometry(1.35, 0.98, 0.82, 4, 0.26), body); h.position.y = 0.82; bit.add(h);
  const face = new THREE.Mesh(new RoundedBoxGeometry(1.02, 0.62, 0.12, 3, 0.14), new THREE.MeshStandardMaterial({ color: 0x16242c, roughness: 0.25, metalness: 0.4, emissive: 0x0b1a22, emissiveIntensity: 0.6 }));
  face.position.set(0, 0.82, 0.4); bit.add(face);
  const eyeMat = glow(EYE, 2.2);
  const eL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), eyeMat); eL.position.set(-0.22, 0.86, 0.47);
  const eR = eL.clone(); eR.position.x = 0.22; bit.add(eL, eR);
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 10, 20, Math.PI), glow(EYE, 1.6));
  mouth.position.set(0, 0.66, 0.47); mouth.rotation.z = Math.PI; mouth.visible = false; bit.add(mouth);
  bit.add(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.34, 10), body).translateY(1.48));
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), glow(ACCENT, 2.4)); tip.position.set(0, 1.68, 0); bit.add(tip);
  [[-0.72, 0.1, 0.5], [0.72, 0.1, -0.5]].forEach(([x, y, rz]) => { const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.34, 4, 8), body); a.position.set(x, y, 0); a.rotation.z = rz; bit.add(a); });
  [[-0.28, -1.0], [0.28, -1.0]].forEach(([x, y]) => { const l = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.22, 4, 8), body); l.position.set(x, y, 0); bit.add(l); });
  bit.userData = { eyeMat, mouth, tip };
  return bit;
}
export function animateBit(bit, el, cheer = 0) {
  bit.position.y = (bit.userData.baseY ?? bit.position.y);
  bit.userData.baseY = bit.userData.baseY ?? bit.position.y;
  bit.position.y = bit.userData.baseY + Math.sin(el * 0.8) * 0.18;
  bit.rotation.y = Math.sin(el * 0.4) * 0.12;
  bit.userData.tip.material.emissiveIntensity = 2.0 + Math.sin(el * 3) * 0.4 + cheer * 1.5;
  bit.userData.eyeMat.emissiveIntensity = 2.2 + cheer * 0.8;
  bit.userData.mouth.visible = cheer > 0.5;
}

// --- Batareya (birlik) -------------------------------------------------------
export function makeBattery() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.0, 24), metal(0xe4e8ef, 0.3, 0.75)));
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.16, 18), glow(ACCENT, 0.7)); tip.position.y = 0.58; g.add(tip);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.285, 0.285, 0.24, 24), metal(0x20242c, 0.6, 0.4)); band.position.y = -0.16; g.add(band);
  const band2 = new THREE.Mesh(new THREE.CylinderGeometry(0.288, 0.288, 0.05, 24), glow(ACCENT, 0.7)); band2.position.y = 0.14; g.add(band2);
  return g;
}

// --- Kasseta (o'nlik) — N ta LED (litCount yonadi) ---------------------------
export function makeCassette(litCount = 10) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.95, 0.5, 4, 0.08), metal(0x1b1e26, 0.35, 0.65)));
  const leds = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) {
    const on = r * 5 + c < litCount;
    const led = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 14), on ? glow(ACCENT, 1.5) : metal(0x3a2016, 0.5, 0.3));
    led.rotation.x = Math.PI / 2; led.position.set(-0.56 + c * 0.28, 0.23 - r * 0.46, 0.26);
    g.add(led); leds.push(led);
  }
  g.userData = { leds };
  return g;
}

// --- Razryad platformasi (o'nlik | birlik ikki ustun) ------------------------
export function makePlaceTray(w = 6, h = 3.4) {
  const g = new THREE.Group();
  const plate = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.3, 4, 0.14), metal(0x141824, 0.5, 0.5)); g.add(plate);
  // ajratuvchi
  const div = new THREE.Mesh(new THREE.BoxGeometry(0.05, h * 0.86, 0.34), glow(0x2a3550, 0.4)); div.position.z = 0.05; g.add(div);
  // ustun yoritish (o'nlik = accent, birlik = ko'k)
  const tGlow = new THREE.Mesh(new THREE.PlaneGeometry(w / 2 - 0.4, h - 0.4), new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.06 })); tGlow.position.set(-w / 4, 0, 0.17);
  const oGlow = new THREE.Mesh(new THREE.PlaneGeometry(w / 2 - 0.4, h - 0.4), new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.06 })); oGlow.position.set(w / 4, 0, 0.17);
  g.add(tGlow, oGlow);
  g.userData = { w, h, tensX: -w / 4, onesX: w / 4 };
  return g;
}

// obyektni floatga (mikrogravitatsiya drift+spin) tayyorlash
export function floaty(obj, seed = Math.random() * 6.28) {
  obj.userData.f = { seed, home: obj.position.clone(), spin: new THREE.Vector3((Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.25), sp: 0.3 + Math.random() * 0.3 };
}
export function driftFloaty(obj, el, dt, amp = 0.25) {
  const f = obj.userData.f; if (!f) return;
  obj.position.x = f.home.x + Math.cos(el * f.sp * 0.7 + f.seed) * amp;
  obj.position.y = f.home.y + Math.sin(el * f.sp + f.seed) * amp * 1.4;
  obj.rotation.x += f.spin.x * dt; obj.rotation.y += f.spin.y * dt; obj.rotation.z += f.spin.z * dt;
}

// --- Sprite-label (3D ichida matn/raqam) ------------------------------------
export function makeLabel(text, { color = "#ffffff", font = 96, weight = 800, bg = null, scale = 1, glowColor = null } = {}) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  const f = `${weight} ${font}px Manrope, Arial, sans-serif`;
  ctx.font = f;
  const w = Math.ceil(ctx.measureText(text).width);
  c.width = w + font * 0.8;
  c.height = Math.ceil(font * 1.5);
  ctx.font = f; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  if (bg) { ctx.fillStyle = bg; const r = 24; const x = 4, y = 4, ww = c.width - 8, hh = c.height - 8; ctx.beginPath(); ctx.roundRect(x, y, ww, hh, r); ctx.fill(); }
  if (glowColor) { ctx.shadowColor = glowColor; ctx.shadowBlur = font * 0.5; }
  ctx.fillStyle = color;
  ctx.fillText(text, c.width / 2, c.height / 2);
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = 4; tex.needsUpdate = true;
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  const asp = c.width / c.height;
  spr.scale.set(asp * scale, scale, 1);
  spr.userData.px = c.width; spr.userData.py = c.height;
  return spr;
}
export function setLabel(spr, text, opts = {}) {
  const next = makeLabel(text, opts);
  spr.material.map.dispose();
  spr.material.map = next.material.map;
  spr.material.needsUpdate = true;
  spr.scale.copy(next.scale);
}

export { THREE };
