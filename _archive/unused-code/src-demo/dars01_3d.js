// ============================================================================
// DEMO v2 (izolyatsiya) — Grade2 Dars01 s0 HOOK ni 3D'da qayta tasavvur qilish.
// Etalon Dars01.jsx ga TEGMAYDI. three.js r160+, Vite bare-import.
// v2 yangi: 3D BIT personaji (BitSVG asosida), UnrealBloom porlash,
// xoreografiyalangan yig'ish (batareyalar navbatma-navbat), chang zarralari,
// sayqallangan batareya/kasseta. Palitra etalondan: bg #F6F4EF, accent #fe5b1a,
// Bit tana #C4D3DC, ko'z #5BD6F2.
// ============================================================================
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const ACCENT = 0xfe5b1a;
const EYE = 0x5bd6f2;
const mount = document.getElementById("stage");

// --- Renderer ---------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
mount.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05060f);
scene.fog = new THREE.FogExp2(0x05060f, 0.018);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
camera.position.set(0, 1.2, 12.5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 7;
controls.maxDistance = 18;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.3;
controls.target.set(0, 0.1, 0);

// --- Bloom (postprocessing) — faqat porlovchi emissive ob'ektlar yonadi ------
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.7, 0.5, 0.82);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// --- Lighting ---------------------------------------------------------------
scene.add(new THREE.AmbientLight(0x46557a, 0.75));
const key = new THREE.DirectionalLight(0xfff2e0, 2.1);
key.position.set(5, 6, 5);
scene.add(key);
const rim = new THREE.DirectionalLight(0x5b8cff, 1.2);
rim.position.set(-6, -1, -4);
scene.add(rim);
const warm = new THREE.PointLight(ACCENT, 0, 9, 2);
warm.position.set(1.5, 0, 2);
scene.add(warm);

// --- Yulduzlar + chang zarralari (ambient) ---------------------------------
function makePoints(count, radius, spread, size, opacity) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    if (spread === "sphere") {
      const r = radius * (0.6 + Math.random() * 0.4);
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
    } else {
      pos[i * 3] = (Math.random() - 0.5) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * radius * 0.7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * radius * 0.5;
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size, sizeAttenuation: true, transparent: true, opacity }));
}
const stars = makePoints(1400, 90, "sphere", 0.09, 0.9);
scene.add(stars);
const dust = makePoints(140, 16, "box", 0.05, 0.4);
scene.add(dust);

// --- Halqali sayyora --------------------------------------------------------
const planet = new THREE.Group();
planet.add(new THREE.Mesh(
  new THREE.SphereGeometry(2.6, 64, 64),
  new THREE.MeshStandardMaterial({ color: 0x3f6db0, roughness: 0.85, metalness: 0.1, emissive: 0x0a1830, emissiveIntensity: 0.5 })
));
const ring = new THREE.Mesh(
  new THREE.RingGeometry(3.4, 5.2, 96),
  new THREE.MeshBasicMaterial({ color: 0xc9a06a, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })
);
ring.rotation.x = -Math.PI / 2.2;
planet.add(ring);
planet.position.set(-6.8, 2.6, -15);
planet.rotation.z = 0.35;
scene.add(planet);

// --- 3D BIT (BitSVG asosida: kul-havorang tana, qorong'i ekran-yuz, ------
//     porlovchi havorang ko'z, to'q sariq antenna) ---------------------------
const metalBody = new THREE.MeshStandardMaterial({ color: 0xc4d3dc, roughness: 0.35, metalness: 0.55 });
const bit = new THREE.Group();
const bBody = new THREE.Mesh(new RoundedBoxGeometry(1.15, 1.35, 0.72, 5, 0.28), metalBody);
bBody.position.y = -0.15;
bit.add(bBody);
const bHead = new THREE.Mesh(new RoundedBoxGeometry(1.35, 0.98, 0.82, 5, 0.26), metalBody);
bHead.position.y = 0.82;
bit.add(bHead);
// ekran-yuz (qorong'i, biroz porlaydi)
const face = new THREE.Mesh(
  new RoundedBoxGeometry(1.02, 0.62, 0.12, 4, 0.14),
  new THREE.MeshStandardMaterial({ color: 0x16242c, roughness: 0.25, metalness: 0.4, emissive: 0x0b1a22, emissiveIntensity: 0.6 })
);
face.position.set(0, 0.82, 0.4);
bit.add(face);
// ko'zlar (porlaydi -> bloom)
const eyeMat = new THREE.MeshStandardMaterial({ color: EYE, emissive: EYE, emissiveIntensity: 2.2 });
const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), eyeMat);
const eyeR = eyeL.clone();
eyeL.position.set(-0.22, 0.86, 0.47);
eyeR.position.set(0.22, 0.86, 0.47);
bit.add(eyeL, eyeR);
// og'iz (yig'ilganda xursand -> ko'rinadi)
const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 12, 24, Math.PI), new THREE.MeshStandardMaterial({ color: EYE, emissive: EYE, emissiveIntensity: 1.6 }));
mouth.position.set(0, 0.66, 0.47);
mouth.rotation.z = Math.PI;
mouth.visible = false;
bit.add(mouth);
// antenna
const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.34, 12), metalBody);
ant.position.set(0, 1.48, 0);
bit.add(ant);
const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 2.4 }));
antTip.position.set(0, 1.68, 0);
bit.add(antTip);
// qo'l/oyoq
[[-0.72, 0.1], [0.72, 0.1]].forEach(([x, y]) => {
  const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.34, 6, 12), metalBody);
  arm.position.set(x, y, 0); arm.rotation.z = x < 0 ? 0.5 : -0.5; bit.add(arm);
});
[[-0.28, -1.0], [0.28, -1.0]].forEach(([x, y]) => {
  const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.22, 6, 12), metalBody);
  leg.position.set(x, y, 0); bit.add(leg);
});
bit.position.set(3.6, 0.3, 0.5);
bit.scale.setScalar(0.92);
scene.add(bit);

// --- Batareya (birlik) ------------------------------------------------------
const battBodyMat = new THREE.MeshStandardMaterial({ color: 0xe4e8ef, roughness: 0.3, metalness: 0.75 });
const battTipMat = new THREE.MeshStandardMaterial({ color: ACCENT, roughness: 0.4, metalness: 0.3, emissive: ACCENT, emissiveIntensity: 0.7 });
const battBandMat = new THREE.MeshStandardMaterial({ color: 0x20242c, roughness: 0.6, metalness: 0.4 });
function makeBattery() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.0, 32), battBodyMat);
  g.add(body);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.16, 24), battTipMat);
  tip.position.y = 0.58; g.add(tip);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.285, 0.285, 0.24, 32), battBandMat);
  band.position.y = -0.16; g.add(band);
  const band2 = new THREE.Mesh(new THREE.CylinderGeometry(0.288, 0.288, 0.05, 32), battTipMat);
  band2.position.y = 0.14; g.add(band2);
  return g;
}
const BATTS = [], scatter = [];
for (let i = 0; i < 10; i++) {
  const b = makeBattery();
  const home = new THREE.Vector3((Math.random() - 0.5) * 7 - 0.5, (Math.random() - 0.5) * 4.5, (Math.random() - 0.5) * 3);
  b.position.copy(home);
  b.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  scene.add(b); BATTS.push(b);
  scatter.push({ home, spin: new THREE.Vector3((Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3), phase: Math.random() * 6.28, speed: 0.3 + Math.random() * 0.3, delay: i * 0.05 });
}

// --- Kasseta (o'nlik) -------------------------------------------------------
const cassette = new THREE.Group();
cassette.add(new THREE.Mesh(new RoundedBoxGeometry(2.7, 1.7, 0.9, 6, 0.14), new THREE.MeshStandardMaterial({ color: 0x1b1e26, roughness: 0.35, metalness: 0.65 })));
const ledMat = new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 1.4 });
const leds = [];
for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) {
  const led = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 20), ledMat.clone());
  led.rotation.x = Math.PI / 2;
  led.position.set(-1.0 + c * 0.5, 0.42 - r * 0.84, 0.46);
  cassette.add(led); leds.push(led);
}
cassette.position.set(-0.3, 0.1, 0);
cassette.scale.setScalar(0.001);
cassette.visible = false;
scene.add(cassette);
const slots = [];
for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) slots.push(new THREE.Vector3(-1.3 + c * 0.5, 0.52 - r * 0.84, 0));

// --- Holat ------------------------------------------------------------------
let gathered = false, t01 = 0;
const btn = document.getElementById("gatherBtn");
btn.addEventListener("click", () => {
  gathered = !gathered;
  btn.textContent = gathered ? "Yana sochish" : "O'nlikka yig'ish";
  btn.classList.toggle("on", gathered);
});

// --- Loop -------------------------------------------------------------------
const clock = new THREE.Clock();
const tmp = new THREE.Vector3();
const smooth = THREE.MathUtils.smoothstep;
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const el = clock.getElapsedTime();
  t01 += ((gathered ? 1 : 0) - t01) * Math.min(1, dt * 2.4);
  const G = t01;

  BATTS.forEach((b, i) => {
    const s = scatter[i];
    tmp.copy(s.home);
    tmp.y += Math.sin(el * s.speed + s.phase) * 0.4;
    tmp.x += Math.cos(el * s.speed * 0.7 + s.phase) * 0.25;
    const gi = smooth(G, s.delay, s.delay + 0.55); // xoreografiya: navbatma-navbat
    b.position.lerpVectors(tmp, slots[i], gi);
    if (gi < 0.85) { b.rotation.x += s.spin.x * dt; b.rotation.y += s.spin.y * dt; b.rotation.z += s.spin.z * dt; }
    else { b.rotation.x += (0 - b.rotation.x) * 0.2; b.rotation.z += (0 - b.rotation.z) * 0.2; }
    b.scale.setScalar(Math.max(0.001, 1 - gi * 0.9));
    b.visible = gi < 0.99;
    // LED navbatma-navbat yonadi
    leds[i].material.emissiveIntensity = 0.35 + gi * (1.3 + Math.sin(el * 5 + i) * 0.25);
  });

  cassette.visible = G > 0.05;
  const cs = smooth(G, 0.25, 1);
  cassette.scale.setScalar(Math.max(0.001, cs));
  cassette.rotation.y = Math.sin(el * 0.3) * 0.22;
  warm.intensity = cs * 3.4;

  // Bit: suzadi + antenna nafas; yig'ilganda xursand (sakraydi, og'iz, antenna yorqin)
  bit.position.y = 0.3 + Math.sin(el * 0.8) * 0.22;
  bit.rotation.y = Math.sin(el * 0.4) * 0.15;
  bit.rotation.z = Math.sin(el * 0.6) * 0.05;
  const cheer = cs;
  bit.scale.setScalar(0.92 + cheer * 0.08 * (1 + Math.sin(el * 8) * 0.15));
  antTip.material.emissiveIntensity = 2.0 + Math.sin(el * 3) * 0.5 + cheer * 1.5;
  eyeMat.emissiveIntensity = 2.2 + cheer * 0.8;
  mouth.visible = cheer > 0.5;

  planet.rotation.y += dt * 0.05;
  stars.rotation.y += dt * 0.004;
  dust.rotation.y += dt * 0.02;

  controls.update();
  composer.render();
  requestAnimationFrame(tick);
}

function resize() {
  const w = mount.clientWidth, h = mount.clientHeight;
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
  bloom.resolution.set(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();
tick();
