// ============================================================
// TO'G'RI TETRAEDR -- interaktiv model.
//
// Manba: claude.ai/design loyihasi «3D object modeling»,
// `tetrahedron.html` + `tetrahedron.js`. Sahifa BUTUNLIGICHA ko'chirilmadi,
// chunki u darsning shartlariga tushmaydi:
//   - Golos Text va PT Serif shriftlari loyihada TAQIQLANGAN
//     (faqat Source Serif 4, Fraunces, Manrope, JetBrains Mono);
//   - three.js unpkg dan importmap orqali kelardi, loyihada esa u
//     LOKAL paket (three ^0.185.1) -- tashqi CDN kerak emas;
//   - qatlam ikki ustun va `74vh`, yon panel SKROLL bilan; 11-sinf
//     darsi esa skrollsiz, `grade11-noscroll` bunday sahifani o'tkazmaydi;
//   - sahifa faqat ruscha, darsda esa uch til.
// Shuning uchun model dars komponenti sifatida QAYTA yozilgan: geometriya,
// qurilmalar, yoyma va kubdagi tetraedr -- asl mantiq bo'yicha.
// ============================================================
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { T, L, MATH_FONT } from './core.jsx'

const S3 = Math.sqrt(3)
const S6 = Math.sqrt(6)
const S2 = Math.SQRT2

// Ranglar 11-sinf palitrasidan olingan: qurilmalar bir-biridan farq qilishi
// kerak, lekin darsning umumiy ohangidan chiqib ketmasin.
const COL = {
  ink: T.ink,
  face: '#8FB3B5',
  edge: '#2A4446',
  height: T.accent,
  apo: T.tip,
  med: '#6D55A8',
  inS: T.ok,
  outS: T.graph,
  sec: '#3F7F3A',
  dih: '#C06A1C',
  cube: '#4A6B8A',
  hl: '#D9A13B',
}

const fmt = (x, d = 2) => x.toFixed(d).replace('.', ',')

export const metrics = (a) => ({
  V: a ** 3 / (6 * S2),
  S: S3 * a * a,
  S1: (S3 / 4) * a * a,
  H: (a * S6) / 3,
  m: (S3 / 2) * a,
  r: (a * S6) / 12,
  R: (a * S6) / 4,
  b: a / S2,
})

// Qurilmalar ro'yxati. `key` -- sahnadagi guruh nomi.
// `short` -- TELEFON uchun: to'liq yorliq ikki qatorga o'ralib ketardi va
// sakkizta tugma ekranga sig'masdi (390x745 da 160 px oshib ketgan edi).
export const FEATURES = [
  { key: 'height', color: COL.height,
    label: L('Balandlik DH va to\'g\'ri burchak', 'Высота DH и прямой угол', 'The height DH and the right angle'),
    short: L('Balandlik DH', 'Высота DH', 'Height DH') },
  { key: 'apothem', color: COL.apo,
    label: L('Yon yoqning apofemasi', 'Апофема боковой грани', 'The apothem of a lateral face'),
    short: L('Apofema', 'Апофема', 'Apothem') },
  { key: 'medians', color: COL.med,
    label: L('Asos medianalari va H nuqtasi', 'Медианы основания и точка H', 'The base medians and the point H'),
    short: L('Medianalar', 'Медианы', 'Medians') },
  { key: 'insphere', color: COL.inS,
    label: L('Ichki sfera, r', 'Вписанная сфера, r', 'The inscribed sphere, r'),
    short: L('Sfera r', 'Сфера r', 'Sphere r') },
  { key: 'outsphere', color: COL.outS,
    label: L('Tashqi sfera, R', 'Описанная сфера, R', 'The circumscribed sphere, R'),
    short: L('Sfera R', 'Сфера R', 'Sphere R') },
  { key: 'dihedral', color: COL.dih,
    label: L('Asos qirrasidagi ikkiyoqli burchak', 'Двугранный угол при ребре основания', 'The dihedral angle at a base edge'),
    short: L('Ikkiyoqli burchak', 'Двугранный угол', 'Dihedral angle') },
  { key: 'section', color: COL.sec,
    label: L('Asosga parallel kesim', 'Сечение, параллельное основанию', 'A section parallel to the base'),
    short: L('Kesim', 'Сечение', 'Section') },
  { key: 'cube', color: COL.cube,
    label: L('Kubdagi tetraedr, b = a/√2', 'Тетраэдр в кубе, b = a/√2', 'The tetrahedron in a cube, b = a/√2'),
    short: L('Kub', 'Куб', 'Cube') },
]

const LBL = {
  centre: L('H — markaz', 'H — центр', 'H — centre'),
}

// ============================================================
// SAHNA. Hammasi bitta effekt ichida: React qayta chizilganda sahna
// QAYTA QURILMAYDI, buyruqlar `api` orqali beriladi.
// ============================================================
function createScene(host, opts) {
  const state = {
    a: opts.edge, mode: 'glass', secT: 0.5, unfold: 0, cut: 0,
    feats: { height: false, apothem: false, medians: false, insphere: false, outsphere: false, dihedral: false, section: false, cube: false },
  }

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(T.paper)
  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 500)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  host.appendChild(renderer.domElement)
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08

  scene.add(new THREE.HemisphereLight('#ffffff', '#C9C4BB', 1.05))
  const d1 = new THREE.DirectionalLight('#ffffff', 1.15); d1.position.set(9, 14, 7); scene.add(d1)
  const d2 = new THREE.DirectionalLight('#ffffff', 0.4); d2.position.set(-8, 5, -6); scene.add(d2)

  const root = new THREE.Group()
  root.name = 'tetrahedron'
  scene.add(root)

  let V = {}
  let groups = {}
  let faceMeshes = []
  let lateral = []
  let cubeParts = []
  let faceMats = []
  let baseDist = 12
  let highlighted = null
  let anim = null
  let raf = 0
  let disposed = false

  // ---------- yordamchilar ----------
  const roundRect = (c, x, y, w, h, r) => {
    c.beginPath()
    c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r)
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath()
  }
  // Yozuv SPRAYT bilan chiziladi. Shrift -- Source Serif 4: matematika
  // moshirinali shriftda yozilmaydi (11-sinf tipografikasi).
  const labelSprite = (text, color, k) => {
    const cv = document.createElement('canvas')
    const font = '700 52px ' + MATH_FONT
    let ctx = cv.getContext('2d')
    ctx.font = font
    const w = Math.ceil(ctx.measureText(text).width) + 30
    const h = 78
    cv.width = w; cv.height = h
    ctx = cv.getContext('2d')
    ctx.font = font
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(255,253,248,0.82)'
    ctx.strokeStyle = T.line; ctx.lineWidth = 3
    roundRect(ctx, 2, 2, w - 4, h - 4, 16); ctx.fill(); ctx.stroke()
    ctx.fillStyle = color
    ctx.fillText(text, w / 2, h / 2 + 3)
    const tex = new THREE.CanvasTexture(cv)
    tex.anisotropy = 4
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false }))
    spr.renderOrder = 20
    spr.scale.set((k * w) / h, k, 1)
    return spr
  }
  const line = (points, color, dashed = false) => {
    const g = new THREE.BufferGeometry().setFromPoints(points)
    const mat = dashed
      ? new THREE.LineDashedMaterial({ color, dashSize: state.a * 0.06, gapSize: state.a * 0.04 })
      : new THREE.LineBasicMaterial({ color })
    const l = new THREE.Line(g, mat)
    if (dashed) l.computeLineDistances()
    return l
  }
  const tube = (p1, p2, color, rad) => {
    const dv = new THREE.Vector3().subVectors(p2, p1)
    const len = dv.length()
    const geo = new THREE.CylinderGeometry(rad, rad, len, 12, 1)
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.05 }))
    m.position.copy(p1).addScaledVector(dv, 0.5)
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dv.clone().normalize())
    return m
  }
  const dot = (p, color, rad) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(rad, 20, 14), new THREE.MeshStandardMaterial({ color, roughness: 0.4 }))
    m.position.copy(p)
    return m
  }
  const triMesh = (v1, v2, v3, mat) => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(
      [v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z], 3))
    g.computeVertexNormals()
    return new THREE.Mesh(g, mat)
  }
  const disposeTree = (obj) => {
    obj.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      if (o.material) {
        const ms = Array.isArray(o.material) ? o.material : [o.material]
        ms.forEach((m) => { if (m.map) m.map.dispose(); m.dispose() })
      }
    })
  }
  const edgeLoop = (pts, rad) => {
    const g = new THREE.Group()
    for (let i = 0; i < pts.length; i += 1) g.add(tube(pts[i], pts[(i + 1) % pts.length], COL.edge, rad))
    return g
  }

  // ---------- qurilmalar ----------
  const buildHeight = () => {
    const { A, D, H, M, k, rad, a } = V
    const g = new THREE.Group()
    g.add(tube(D, H, COL.height, rad * 1.15))
    g.add(dot(H, COL.height, rad * 2.2))
    const s = labelSprite('H', COL.height, k)
    s.position.copy(H).add(new THREE.Vector3(a * 0.09, a * 0.05, a * 0.05))
    g.add(s)
    const lv = labelSprite('DH = ' + fmt(M.H), COL.height, k * 0.92)
    lv.position.set(a * 0.14, M.H * 0.55, 0)
    g.add(lv)
    // to'g'ri burchak belgisi
    const u = A.clone().sub(H).normalize().multiplyScalar(a * 0.075)
    const up = new THREE.Vector3(0, a * 0.075, 0)
    g.add(line([H.clone().add(u), H.clone().add(u).add(up), H.clone().add(up)], COL.height))
    groups.height = g; root.add(g)
  }
  const buildApothem = () => {
    const { B, C, D, M, k, rad, a } = V
    const g = new THREE.Group()
    const mid = new THREE.Vector3().addVectors(B, C).multiplyScalar(0.5)
    g.add(tube(D, mid, COL.apo, rad * 1.15))
    g.add(dot(mid, COL.apo, rad * 2))
    const s = labelSprite('m = ' + fmt(M.m), COL.apo, k * 0.92)
    s.position.copy(mid).lerp(D, 0.5).add(new THREE.Vector3(0, 0, -a * 0.1))
    g.add(s)
    groups.apothem = g; root.add(g)
  }
  const buildMedians = () => {
    const { A, B, C, H, k, rad, a } = V
    const g = new THREE.Group()
    ;[[A, B, C], [B, C, A], [C, A, B]].forEach(([P, Q, R]) => {
      const mid = new THREE.Vector3().addVectors(Q, R).multiplyScalar(0.5)
      g.add(tube(P, mid, COL.med, rad * 0.9))
      g.add(dot(mid, COL.med, rad * 1.6))
    })
    g.add(dot(H, COL.med, rad * 2.4))
    const s = labelSprite(opts.centreLabel, COL.med, k * 0.85)
    s.position.copy(H).add(new THREE.Vector3(0, -a * 0.1, a * 0.24))
    g.add(s)
    groups.medians = g; root.add(g)
  }
  const buildSpheres = () => {
    const { G, M, k, rad, A, a } = V
    const mk = (radius, color, opacity, key, labelText, target) => {
      const g = new THREE.Group()
      g.add(new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32),
        new THREE.MeshStandardMaterial({ color, roughness: 0.3, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide })))
      g.add(dot(G, color, rad * 1.8))
      g.add(tube(G, target, color, rad * 0.7))
      const s = labelSprite(labelText, color, k * 0.92)
      s.position.copy(G).lerp(target, 0.55).add(new THREE.Vector3(0, a * 0.06, 0))
      g.add(s)
      groups[key] = g; root.add(g)
    }
    mk(M.r, COL.inS, 0.22, 'insphere', 'r = ' + fmt(M.r), new THREE.Vector3(0, 0, 0))
    mk(M.R, COL.outS, 0.13, 'outsphere', 'R = ' + fmt(M.R), A.clone())
  }
  const buildDihedral = () => {
    const { A, B, C, D, k, rad, a } = V
    const g = new THREE.Group()
    const mid = new THREE.Vector3().addVectors(B, C).multiplyScalar(0.5)
    const v1 = D.clone().sub(mid).normalize()
    const v2 = A.clone().sub(mid).normalize()
    const rr = a * 0.3
    g.add(tube(mid, mid.clone().addScaledVector(v1, rr * 1.5), COL.dih, rad * 0.8))
    g.add(tube(mid, mid.clone().addScaledVector(v2, rr * 1.5), COL.dih, rad * 0.8))
    const pts = []
    for (let i = 0; i <= 40; i += 1) {
      const t = i / 40
      pts.push(mid.clone().addScaledVector(v1.clone().multiplyScalar(1 - t).addScaledVector(v2, t).normalize(), rr))
    }
    g.add(line(pts, COL.dih))
    const s = labelSprite('≈ 70,53°', COL.dih, k * 0.92)
    s.position.copy(mid).addScaledVector(v1.clone().add(v2).normalize(), rr * 1.5)
    g.add(s)
    groups.dihedral = g; root.add(g)
  }
  const updateSection = () => {
    const g = groups.section
    if (!g) return
    disposeTree(g); g.clear()
    const { A, B, C, D, k, rad, a } = V
    const t = state.secT
    const p = [A, B, C].map((P) => P.clone().lerp(D, t))
    const side = a * (1 - t)
    const area = (S3 / 4) * side * side
    const mat = new THREE.MeshStandardMaterial({ color: COL.sec, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false, roughness: 0.5 })
    g.add(triMesh(p[0], p[1], p[2], mat))
    for (let i = 0; i < 3; i += 1) g.add(tube(p[i], p[(i + 1) % 3], COL.sec, rad * 1.1))
    const s = labelSprite('a′ = ' + fmt(side) + ',  S = ' + fmt(area), COL.sec, k * 0.9)
    s.position.copy(p[0]).lerp(p[1], 0.5).lerp(p[2], 0.5).add(new THREE.Vector3(0, a * 0.09, 0))
    g.add(s)
    g.visible = state.feats.section
  }
  const buildSection = () => {
    const g = new THREE.Group()
    groups.section = g; root.add(g)
    updateSection()
  }
  const buildCube = () => {
    const { M, G, A, B, C, D, k } = V
    const g = new THREE.Group()
    const b = M.b
    const s = b / 2
    const P = [new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, -1, -1), new THREE.Vector3(-1, 1, -1), new THREE.Vector3(-1, -1, 1)]
      .map((v) => v.multiplyScalar(s))
    const Q = [D, A, B, C].map((v) => v.clone().sub(G))
    const frame = (p1, p2) => {
      const u1 = p1.clone().normalize()
      const u2 = p2.clone().sub(u1.clone().multiplyScalar(p2.dot(u1))).normalize()
      const u3 = new THREE.Vector3().crossVectors(u1, u2)
      return new THREE.Matrix4().makeBasis(u1, u2, u3)
    }
    const Rm = frame(Q[0], Q[1]).multiply(frame(P[0], P[1]).transpose())
    const inner = new THREE.Group()
    inner.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(b, b, b)),
      new THREE.LineBasicMaterial({ color: COL.cube, transparent: true, opacity: 0.9 })))
    inner.add(new THREE.Mesh(new THREE.BoxGeometry(b, b, b),
      new THREE.MeshStandardMaterial({ color: COL.cube, transparent: true, opacity: 0.06, side: THREE.DoubleSide, depthWrite: false })))

    // To'rtta burchak tetraedri: kubdan AYNAN shular kesiladi.
    ;[[-1, -1, -1], [-1, 1, 1], [1, -1, 1], [1, 1, -1]].forEach((c) => {
      const Vx = new THREE.Vector3(...c).multiplyScalar(s)
      const nb = P.filter((p) => {
        let diff = 0
        if (Math.sign(p.x) !== Math.sign(Vx.x)) diff += 1
        if (Math.sign(p.y) !== Math.sign(Vx.y)) diff += 1
        if (Math.sign(p.z) !== Math.sign(Vx.z)) diff += 1
        return diff === 1
      })
      const cg = new THREE.Group()
      const cornerMat = new THREE.MeshStandardMaterial({ color: COL.cube, roughness: 0.5, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
      const vs = [Vx, ...nb]
      ;[[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 2, 3]].forEach((f) => cg.add(triMesh(vs[f[0]], vs[f[1]], vs[f[2]], cornerMat)))
      cg.userData = { dir: Vx.clone().normalize(), mat: cornerMat }
      cubeParts.push(cg)
      inner.add(cg)
    })

    inner.quaternion.setFromRotationMatrix(Rm)
    g.add(inner)
    g.position.copy(G)
    const lb = labelSprite('b = ' + fmt(M.b), COL.cube, k * 0.9)
    lb.position.set(0, -M.H / 4 - V.a * 0.14, 0)
    g.add(lb)
    groups.cube = g; root.add(g)
  }

  // ---------- holat ----------
  const applyMode = () => {
    const solid = state.mode === 'solid'
    const wire = state.mode === 'wire'
    faceMats.forEach((m) => {
      m.opacity = wire ? 0 : (solid ? 1 : 0.25)
      m.transparent = !solid
      m.depthWrite = solid
      m.visible = !wire
      m.needsUpdate = true
    })
  }
  const applyFeats = () => {
    const unf = state.unfold > 0.001
    FEATURES.forEach(({ key }) => { if (groups[key]) groups[key].visible = state.feats[key] && !unf })
    if (groups.verts) groups.verts.visible = !unf
  }
  const fitDist = () => {
    const tg = Math.tan((camera.fov * Math.PI) / 360)
    // Tetraedrning haqiqiy o'lchami: eni ~a, bo'yi ~0,82a. 2,25a juda
    // katta zaxira edi va past, keng kadrda model kichkina ko'rinardi.
    const extent = state.a * 1.55
    return Math.max((extent / 2) / tg, (extent / 2) / (tg * Math.max(camera.aspect, 0.4)))
  }
  const setDist = (mult) => {
    const off = camera.position.clone().sub(controls.target)
    camera.position.copy(controls.target).add(off.setLength(baseDist * mult))
  }
  const applyUnfold = (t, adjust) => {
    lateral.forEach((g) => {
      const { axis, sign, full, mid } = g.userData
      g.quaternion.setFromAxisAngle(axis, sign * full * t)
      g.position.copy(mid).setY(mid.y + V.a * 0.003 * t)
    })
    if (adjust) setDist(1 + 0.75 * t)
  }
  const applyCut = (t, adjust) => {
    cubeParts.forEach((g, i) => {
      const local = Math.min(1, Math.max(0, t * 4 - i))
      g.position.copy(g.userData.dir).multiplyScalar(local * V.a * 0.5)
      g.userData.mat.opacity = 0.42 * Math.min(1, local * 3)
      g.visible = local > 0.002
    })
    if (adjust) setDist(1 + 0.45 * t)
  }
  const resetView = () => {
    baseDist = fitDist()
    const M = metrics(state.a)
    const d = new THREE.Vector3(1.05, 0.95, 1.6).normalize().multiplyScalar(baseDist)
    camera.position.copy(d).add(new THREE.Vector3(0, M.H * 0.45, 0))
    controls.target.set(0, M.H * 0.45, 0)
    controls.update()
  }

  const build = () => {
    disposeTree(root)
    root.clear()
    faceMeshes = []; lateral = []; cubeParts = []; faceMats = []; groups = {}
    highlighted = null
    const a = state.a
    const M = metrics(a)
    const Rb = a / S3
    const k = a * 0.115
    const rad = a * 0.008
    const A = new THREE.Vector3(0, 0, Rb)
    const B = new THREE.Vector3(Rb * Math.cos((Math.PI * 7) / 6), 0, Rb * Math.sin((Math.PI * 7) / 6))
    const C = new THREE.Vector3(Rb * Math.cos((Math.PI * 11) / 6), 0, Rb * Math.sin((Math.PI * 11) / 6))
    const D = new THREE.Vector3(0, M.H, 0)
    const H = new THREE.Vector3(0, 0, 0)
    const G = new THREE.Vector3(0, M.H / 4, 0)
    V = { A, B, C, D, H, G, M, k, rad, a }

    const faceMat = () => new THREE.MeshStandardMaterial({
      color: COL.face, roughness: 0.55, metalness: 0.02, transparent: true, opacity: 0.25,
      side: THREE.DoubleSide, depthWrite: false,
    })

    const base = triMesh(A, B, C, faceMat())
    base.userData = { label: 'ABC' }
    root.add(base); faceMeshes.push(base); faceMats.push(base.material)
    root.add(edgeLoop([A, B, C], rad))

    // Yon yoqlar YOYILISH o'qi bo'yicha guruhlangan.
    const names = ['ABD', 'BCD', 'CAD']
    ;[[A, B], [B, C], [C, A]].forEach(([P, Q], i) => {
      const mid = new THREE.Vector3().addVectors(P, Q).multiplyScalar(0.5)
      const g = new THREE.Group()
      g.position.copy(mid)
      const p = P.clone().sub(mid)
      const q = Q.clone().sub(mid)
      const d = D.clone().sub(mid)
      const mesh = triMesh(p, q, d, faceMat())
      mesh.userData = { label: names[i] }
      g.add(mesh); faceMeshes.push(mesh); faceMats.push(mesh.material)
      g.add(edgeLoop([p, q, d], rad))
      const axis = new THREE.Vector3().subVectors(Q, P).normalize()
      const full = Math.PI - Math.acos(1 / 3)
      // Yoyilish TASHQARIGA borishi kerak: ikkala ishorani sinab, uzoqrog'i olinadi.
      const test = (sg) => d.clone().applyQuaternion(new THREE.Quaternion().setFromAxisAngle(axis, sg * full)).add(mid).length()
      const sign = test(1) > test(-1) ? 1 : -1
      g.userData = { axis, sign, full, mid: mid.clone() }
      lateral.push(g)
      root.add(g)
    })

    const vg = new THREE.Group()
    ;[['A', A], ['B', B], ['C', C], ['D', D]].forEach(([n, p]) => {
      vg.add(dot(p, COL.edge, rad * 2.3))
      const out = p.clone().sub(G).normalize().multiplyScalar(a * 0.15)
      const s = labelSprite(n, COL.ink, k * 1.15)
      s.position.copy(p).add(out).add(new THREE.Vector3(0, a * 0.05, 0))
      vg.add(s)
    })
    groups.verts = vg; root.add(vg)

    buildHeight(); buildApothem(); buildMedians(); buildSpheres()
    buildDihedral(); buildSection(); buildCube()
    applyMode(); applyFeats(); applyUnfold(state.unfold); applyCut(state.cut)
  }

  // ---------- o'lcham ----------
  const resize = () => {
    const w = host.clientWidth
    const h = host.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    if (V.a && state.unfold < 0.01 && state.cut < 0.01) { baseDist = fitDist(); setDist(1) }
  }
  const ro = new ResizeObserver(resize)
  ro.observe(host)

  // ---------- yoqni bosish ----------
  const ray = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let downAt = null
  const onDown = (e) => { downAt = { x: e.clientX, y: e.clientY } }
  const onUp = (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 4) return
    const r = renderer.domElement.getBoundingClientRect()
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(pointer, camera)
    const hit = ray.intersectObjects(faceMeshes, false)[0]
    if (highlighted) { highlighted.material.color.set(COL.face); highlighted = null }
    if (hit) {
      highlighted = hit.object
      highlighted.material.color.set(COL.hl)
      if (opts.onFace) opts.onFace({ label: hit.object.userData.label, S1: metrics(state.a).S1, a: state.a })
    } else if (opts.onFace) opts.onFace(null)
  }
  renderer.domElement.addEventListener('pointerdown', onDown)
  renderer.domElement.addEventListener('pointerup', onUp)

  // ---------- animatsiya ----------
  const animateTo = (get, set, to, dur) => { anim = { from: get(), to, t0: performance.now(), dur, set } }
  const loop = (now) => {
    if (disposed) return
    if (anim) {
      const p = Math.min(1, (now - anim.t0) / anim.dur)
      const e = p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) ** 2
      anim.set(anim.from + (anim.to - anim.from) * e)
      if (p >= 1) { anim.set(anim.to); anim = null }
    }
    controls.update()
    renderer.render(scene, camera)
    raf = requestAnimationFrame(loop)
  }

  build(); resize(); resetView()
  raf = requestAnimationFrame(loop)

  return {
    // Qobiq qaysi kalitlarni almashtirishni SHU YERDAN biladi -- ro'yxat
    // ikki joyda takrorlanmasin.
    featureKeys: Object.fromEntries(FEATURES.map((f) => [f.key, true])),
    setEdge(a) { state.a = a; build(); resetView() },
    setMode(m) { state.mode = m; applyMode() },
    toggle(key, on) {
      state.feats[key] = on
      if (key === 'cube' && !on) { state.cut = 0; applyCut(0) }
      applyFeats()
    },
    setSecT(t) { state.secT = t; updateSection() },
    unfold(to) { animateTo(() => state.unfold, (v) => { state.unfold = v; applyUnfold(v, true); applyFeats() }, to, 1100) },
    cut(to) { animateTo(() => state.cut, (v) => { state.cut = v; applyCut(v, true) }, to, 1700) },
    reset: resetView,
    clear() {
      Object.keys(state.feats).forEach((k) => { state.feats[k] = false })
      state.cut = 0; applyCut(0)
      if (highlighted) { highlighted.material.color.set(COL.face); highlighted = null }
      applyFeats()
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onDown)
      renderer.domElement.removeEventListener('pointerup', onUp)
      controls.dispose()
      disposeTree(root)
      renderer.dispose()
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    },
  }
}

// ============================================================

export { COL as TETRA_COLORS, fmt as tetraFmt, LBL as TETRA_LABELS, createScene }
