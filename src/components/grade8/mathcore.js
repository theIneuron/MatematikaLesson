// ============================================================================
// 8-sinf: MATEMATIK YOZUVNI RAZBOR QILISH va SON QO'YIB TEKSHIRISH.
// Kontrakt: src/books/grade8/ETALON_8SINF.md §10.1
//
// React YO'Q — sof JS. Shuning uchun node bilan test qilinadi:
//   node scripts/grade8-mathcore-test.mjs
//
// Nima uchun kerak. 8-sinfda o'quvchi javobni TANLAMAYDI, YOZADI (§2.1).
// Javob satrni satr bilan solishtirib tekshirilmaydi: 2/(x-3) va -2/(3-x)
// bitta javob. Tekshiruv — ODZ ning oltita nuqtasiga SON QO'YIB.
//
// Muhim: qiymatlar mos kelsa-yu ANIQLANISH SOHASI boshqa bo'lsa, javob
// QABUL QILINMAYDI — bu yilning asosiy xatosi (З2).
// ============================================================================

// --------------------------------------------------------------------------
// 0. Normalizatsiya. O'quvchi klaviaturadan ham, ekran tugmalaridan ham yozadi.
// --------------------------------------------------------------------------
const NORM = [
  [/[−–—]/g, '-'], // minus, en dash, em dash
  [/≠/g, '!='],
  [/[·×]/g, '*'],
  [/÷/g, '/'],
  [/≤/g, '<='],
  [/≥/g, '>='],
  [/√/g, 'sqrt'],
  [/\u00A0/g, ' '],  // uzilmas bo'shliq
]

export function normalize(src) {
  let s = String(src == null ? '' : src)
  for (const [re, to] of NORM) s = s.replace(re, to)
  return s.trim()
}

// --------------------------------------------------------------------------
// 1. Tokenlar
// --------------------------------------------------------------------------
const FUNCS = ['sqrt', 'abs']

export function tokenize(src) {
  const s = normalize(src)
  const out = []
  let i = 0
  while (i < s.length) {
    const c = s[i]
    if (c === ' ') { i += 1; continue }
    if (c >= '0' && c <= '9') {
      let j = i
      while (j < s.length && ((s[j] >= '0' && s[j] <= '9') || s[j] === '.')) j += 1
      const text = s.slice(i, j)
      if ((text.match(/\./g) || []).length > 1) return { error: { kind: 'number', pos: i, text } }
      out.push({ t: 'num', v: Number(text), pos: i })
      i = j
      continue
    }
    if (/[A-Za-z]/.test(c)) {
      let j = i
      while (j < s.length && /[A-Za-z]/.test(s[j])) j += 1
      let word = s.slice(i, j)
      const fn = FUNCS.find((f) => word.toLowerCase().startsWith(f))
      if (fn && word.toLowerCase() === fn) {
        out.push({ t: 'func', v: fn, pos: i })
        i = j
        continue
      }
      // ketma-ket harflar — ko'paytma: ab -> a*b
      for (let k = 0; k < word.length; k += 1) out.push({ t: 'name', v: word[k], pos: i + k })
      i = j
      continue
    }
    if (s.startsWith('!=', i)) { out.push({ t: 'ne', pos: i }); i += 2; continue }
    if (s.startsWith('<=', i) || s.startsWith('>=', i)) { out.push({ t: 'cmp', v: s.slice(i, i + 2), pos: i }); i += 2; continue }
    if ('+-*/^(),=<>'.includes(c)) { out.push({ t: c, pos: i }); i += 1; continue }
    return { error: { kind: 'char', pos: i, text: c } }
  }
  return { tokens: out }
}

// --------------------------------------------------------------------------
// 2. Razbor. Ko'paytirish belgisiz ham yoziladi: 2a, 2(a+1), a(a+1), 2sqrt(3).
//    Daraja o'ngdan chapga: a^2^3 = a^(2^3). Unar minus darajadan KEYIN:
//    -a^2 = -(a^2).
// --------------------------------------------------------------------------
export function parse(src) {
  const tk = tokenize(src)
  if (tk.error) return { error: tk.error }
  const ts = tk.tokens
  if (!ts.length) return { error: { kind: 'empty', pos: 0 } }
  let p = 0
  const peek = () => ts[p]
  const eat = (t) => (ts[p] && ts[p].t === t ? ts[p++] : null)

  let failed = null
  const fail = (kind, tok) => { if (!failed) failed = { kind, pos: tok ? tok.pos : normalize(src).length } }

  const startsPrimary = (tok) => tok && (tok.t === 'num' || tok.t === 'name' || tok.t === 'func' || tok.t === '(')

  function primary() {
    const tok = peek()
    if (!tok) { fail('end', null); return null }
    if (tok.t === 'num') { p += 1; return { k: 'num', v: tok.v } }
    if (tok.t === 'name') { p += 1; return { k: 'var', v: tok.v } }
    if (tok.t === 'func') {
      p += 1
      if (!eat('(')) { fail('paren', peek()); return null }
      const arg = expr()
      if (!eat(')')) { fail('paren', peek()); return null }
      return { k: 'call', v: tok.v, a: arg }
    }
    if (tok.t === '(') {
      p += 1
      const e = expr()
      if (!eat(')')) { fail('paren', peek()); return null }
      return e
    }
    fail('token', tok)
    return null
  }

  function power() {
    const base = primary()
    if (eat('^')) {
      const ex = unary()
      return { k: 'pow', a: base, b: ex }
    }
    return base
  }

  function unary() {
    if (eat('-')) return { k: 'neg', a: unary() }
    if (eat('+')) return unary()
    return power()
  }

  function term() {
    let left = unary()
    for (;;) {
      if (eat('*')) { left = { k: 'mul', a: left, b: unary() }; continue }
      if (eat('/')) { left = { k: 'div', a: left, b: unary() }; continue }
      if (startsPrimary(peek())) { left = { k: 'mul', a: left, b: unary() }; continue }
      return left
    }
  }

  function expr() {
    let left = term()
    for (;;) {
      if (eat('+')) { left = { k: 'add', a: left, b: term() }; continue }
      if (eat('-')) { left = { k: 'sub', a: left, b: term() }; continue }
      return left
    }
  }

  const node = expr()
  if (failed) return { error: failed }
  if (p < ts.length) return { error: { kind: 'extra', pos: ts[p].pos } }
  return { node, vars: varsOf(node) }
}

function varsOf(n, acc) {
  const set = acc || new Set()
  if (!n) return set
  if (n.k === 'var') set.add(n.v)
  for (const key of ['a', 'b']) if (n[key]) varsOf(n[key], set)
  return set
}

// --------------------------------------------------------------------------
// 3. Hisoblash. Qiymat YO'Q bo'lsa null qaytadi (nolga bo'lish, manfiy ildiz).
//    null — «bu nuqtada yozuv mavjud emas», nol EMAS.
// --------------------------------------------------------------------------
const EPS0 = 1e-12

export function evaluate(node, env) {
  const n = node
  if (!n) return null
  switch (n.k) {
    case 'num': return n.v
    case 'var': {
      const v = env[n.v]
      return v === undefined ? null : v
    }
    case 'neg': { const a = evaluate(n.a, env); return a === null ? null : -a }
    case 'add': case 'sub': case 'mul': case 'div': case 'pow': {
      const a = evaluate(n.a, env)
      const b = evaluate(n.b, env)
      if (a === null || b === null) return null
      if (n.k === 'add') return a + b
      if (n.k === 'sub') return a - b
      if (n.k === 'mul') return a * b
      if (n.k === 'div') return Math.abs(b) < EPS0 ? null : a / b
      if (b < 0 && Math.abs(a) < EPS0) return null
      if (a < 0 && !Number.isInteger(b)) return null
      const r = Math.pow(a, b)
      return Number.isFinite(r) ? r : null
    }
    case 'call': {
      const a = evaluate(n.a, env)
      if (a === null) return null
      if (n.v === 'sqrt') return a < 0 ? null : Math.sqrt(a)
      if (n.v === 'abs') return Math.abs(a)
      return null
    }
    default: return null
  }
}

export function valueAt(src, env) {
  const r = parse(src)
  if (r.error) return { error: r.error }
  return { value: evaluate(r.node, env) }
}

// --------------------------------------------------------------------------
// 4. Nuqtalar. Tasodifiy, lekin takrorlanadigan: seed berilsa test bir xil.
// --------------------------------------------------------------------------
const POOL = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 19, 23,
  -1, -2, -3, -4, -5, -6, -7, -11, -13,
  0, 0.5, 1.5, 2.5, 3.5, -0.5, -1.5, -2.5,
]

function lcg(seed) {
  let s = (seed | 0) || 20260806
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function shuffled(arr, rnd) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1))
    const t = a[i]; a[i] = a[j]; a[j] = t
  }
  return a
}

// --------------------------------------------------------------------------
// 5. ASOSIY: ikki yozuv tengmi. §10.1 dagi tartib bilan.
//    Qaytadi:
//      { ok: true, points, checked }
//      { ok: false, why: 'parse',  error }        -- razbor bo'lmadi (urinish SANALMAYDI)
//      { ok: false, why: 'value',  point, mine, ref }
//      { ok: false, why: 'domain', point, side }  -- qiymatlar mos, SOHA boshqa
//      { ok: false, why: 'vars',   extra, missing }
// --------------------------------------------------------------------------
export function checkIdentity(mine, ref, opts) {
  const o = opts || {}
  const need = o.points || 6
  const tol = o.tol || 1e-9
  const rnd = lcg(o.seed || 20260806)

  const R = parse(ref)
  if (R.error) return { ok: false, why: 'ref-parse', error: R.error }
  const M = parse(mine)
  if (M.error) return { ok: false, why: 'parse', error: M.error }

  // harflar bir xil bo'lishi kerak: x haqidagi topshiriqqa y bilan javob bermaydi
  const refVars = [...R.vars]
  const myVars = [...M.vars]
  const extra = myVars.filter((v) => !refVars.includes(v))
  const missing = refVars.filter((v) => !myVars.includes(v))
  if (extra.length || (missing.length && !o.allowFewerVars)) {
    return { ok: false, why: 'vars', extra, missing }
  }

  const vars = refVars.length ? refVars : ['x']

  const pool = shuffled(POOL, rnd)
  const points = []
  let firstValue = null
  let firstDomain = null
  let tried = 0

  // Butun po'lni aylanamiz: qiymatdagi farqni ham tasodifga qoldirmaymiz.
  for (const base of pool) {
    tried += 1
    const env = {}
    vars.forEach((v, i) => { env[v] = i === 0 ? base : pool[(tried + i * 5) % pool.length] })
    const rv = evaluate(R.node, env)
    const mv = evaluate(M.node, env)
    if (rv === null && mv === null) continue          // ikkisida ham qiymat yo'q -- nuqta ishlamaydi
    if (rv === null || mv === null) {
      if (!firstDomain) firstDomain = { point: { ...env }, side: rv === null ? 'ref' : 'mine' }
      continue
    }
    if (!Number.isFinite(rv) || !Number.isFinite(mv)) continue
    const scale = Math.max(1, Math.abs(rv), Math.abs(mv))
    if (Math.abs(rv - mv) > tol * scale) {
      if (!firstValue) firstValue = { point: { ...env }, mine: mv, ref: rv }
      continue
    }
    if (points.length < need) points.push({ ...env, value: rv })
  }

  // 1) Qiymatdagi farq eng kuchli dalil: bittasi ham yetadi. §10.1 4-band.
  if (firstValue) return { ok: false, why: 'value', ...firstValue }

  // 2) Qiymatlar mos. Endi SOHALARNI solishtiramiz -- §10.1 5-band, З2.
  // Tasodifiy nuqtaga tashlab qo'yish YARAMAYDI: teshik olti nuqta ichiga
  // tushmasligi mumkin va З2 sezilmay o'tib ketardi. Bir harfli ifodada
  // (8-sinfda amalda hammasi shunday) teshiklar skanerlab topiladi.
  if (vars.length === 1) {
    const hm = holesOf(M.node, vars[0])
    const hr = holesOf(R.node, vars[0])
    const near = (list, v) => list.some((e) => Math.abs(e - v) < 1e-9)
    const onlyMine = hm.find((v) => !near(hr, v))
    const onlyRef = hr.find((v) => !near(hm, v))
    if (onlyMine !== undefined || onlyRef !== undefined) {
      const v = onlyMine !== undefined ? onlyMine : onlyRef
      const point = {}
      point[vars[0]] = v
      return { ok: false, why: 'domain', point, side: onlyMine !== undefined ? 'mine' : 'ref' }
    }
  }
  // Ko'p harfli ifodada skaner yo'q -- tasodifiy nuqtadan topilgani ishlatiladi.
  if (firstDomain) return { ok: false, why: 'domain', ...firstDomain }
  if (points.length < need) return { ok: false, why: 'thin', points }
  return { ok: true, points, checked: points.length }
}

// --------------------------------------------------------------------------
// 5a. TESKARI TOPSHIRIQ: «qisqartirilganda X beradigan kasr yozing».
// Bu tenglik EMAS: (a*a+a)/a ning a=0 da qiymati yo'q, a+1 da bor.
// Shuning uchun tekshiruv O'QUVCHI YOZUVINING sohasida boradi.
// Ikkinchi shart — ODZ — alohida tekshiriladi (checkOdz).
// --------------------------------------------------------------------------
export function checkReduction(mine, target, opts) {
  const o = opts || {}
  const need = o.points || 6
  const tol = o.tol || 1e-9
  const rnd = lcg(o.seed || 20260806)
  const M = parse(mine)
  if (M.error) return { ok: false, why: 'parse', error: M.error }
  const Tg = parse(target)
  if (Tg.error) return { ok: false, why: 'ref-parse', error: Tg.error }

  const vars = [...Tg.vars].length ? [...Tg.vars] : [...M.vars]
  const extra = [...M.vars].filter((v) => !vars.includes(v))
  if (extra.length) return { ok: false, why: 'vars', extra }
  if (!vars.length) return { ok: false, why: 'vars', extra: [] }

  const pool = shuffled(POOL, rnd)
  let matched = 0
  let firstValue = null
  for (const base of pool) {
    const env = {}
    vars.forEach((v, i) => { env[v] = i === 0 ? base : pool[(i * 7 + 3) % pool.length] })
    const mv = evaluate(M.node, env)
    if (mv === null) continue                    // o'quvchi yozuvida qiymat yo'q -- nuqta hisobga olinmaydi
    const tv = evaluate(Tg.node, env)
    if (tv === null) { if (!firstValue) firstValue = { point: { ...env }, mine: mv, ref: null }; continue }
    const scale = Math.max(1, Math.abs(tv), Math.abs(mv))
    if (Math.abs(tv - mv) > tol * scale) {
      if (!firstValue) firstValue = { point: { ...env }, mine: mv, ref: tv }
      continue
    }
    matched += 1
  }
  if (firstValue) return { ok: false, why: 'value', ...firstValue }
  if (matched < need) return { ok: false, why: 'thin', matched }
  return { ok: true, checked: matched }
}

// --------------------------------------------------------------------------
// 6. ODZ. To'plam solishtiriladi, matn EMAS.
//    «x != 4, x != -4», «x - 4 != 0», «4 != x» — bitta javob.
// --------------------------------------------------------------------------
const ROOT_SCAN = (() => {
  const xs = []
  for (let v = -24; v <= 24; v += 0.5) xs.push(v)
  return xs
})()

export function parseOdz(src, varName) {
  const s = normalize(src)
  if (!s) return { error: { kind: 'empty', pos: 0 } }
  if (/^(любое|barcha|any|hammasi)/i.test(s)) return { excluded: [], vars: [] }
  const parts = s.split(',').map((x) => x.trim()).filter(Boolean)
  const excluded = []
  const vars = new Set()
  for (const part of parts) {
    if (part.indexOf('!=') === -1) return { error: { kind: 'ne-missing', pos: 0, text: part } }
    const [lhs, rhs] = part.split('!=')
    const L = parse(lhs)
    const Rr = parse(rhs)
    if (L.error) return { error: L.error }
    if (Rr.error) return { error: Rr.error }
    const v = [...L.vars, ...Rr.vars]
    if (!v.length) return { error: { kind: 'no-var', pos: 0, text: part } }
    const name = varName || v[0]
    v.forEach((x) => vars.add(x))
    // f = lhs - rhs, ildizlarini skanerlab topamiz (maktab ODZ si uchun yetarli)
    for (const cand of ROOT_SCAN) {
      const env = {}
      env[name] = cand
      const a = evaluate(L.node, env)
      const b = evaluate(Rr.node, env)
      if (a === null || b === null) continue
      if (Math.abs(a - b) < 1e-9) {
        if (!excluded.some((e) => Math.abs(e - cand) < 1e-9)) excluded.push(cand)
      }
    }
  }
  excluded.sort((x, y) => x - y)
  return { excluded, vars: [...vars] }
}

export function checkOdz(mine, refExcluded, varName) {
  const M = parseOdz(mine, varName)
  if (M.error) return { ok: false, why: 'parse', error: M.error }
  const ref = (refExcluded || []).slice().sort((a, b) => a - b)
  const has = (list, v) => list.some((e) => Math.abs(e - v) < 1e-9)
  const extra = M.excluded.filter((v) => !has(ref, v))
  const missing = ref.filter((v) => !has(M.excluded, v))
  if (extra.length) return { ok: false, why: 'extra', value: extra[0], mine: M.excluded }
  if (missing.length) return { ok: false, why: 'missing', value: missing[0], mine: M.excluded }
  return { ok: true, excluded: M.excluded }
}

// --------------------------------------------------------------------------
// 7. Ifodaning ODZ i: maxrajni nolga aylantiruvchi qiymatlar.
//    Topshiriq ma'lumotida ODZ ni qo'lda yozmaslik uchun.
// --------------------------------------------------------------------------
function holesOf(node, name) {
  const holes = []
  for (const cand of ROOT_SCAN) {
    const env = {}
    env[name] = cand
    if (evaluate(node, env) === null) holes.push(cand)
  }
  return holes
}

export function domainHoles(src, varName) {
  const R = parse(src)
  if (R.error) return { error: R.error }
  const name = varName || [...R.vars][0]
  if (!name) return { holes: [] }
  return { holes: holesOf(R.node, name) }
}

export default {
  normalize, tokenize, parse, evaluate, valueAt,
  checkIdentity, parseOdz, checkOdz, domainHoles,
}
