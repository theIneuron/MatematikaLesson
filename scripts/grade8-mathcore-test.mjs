// ============================================================================
// 8-sinf: mathcore.js ni tekshirish. Kontrakt: ETALON_8SINF.md §10.1
//   node scripts/grade8-mathcore-test.mjs
//
// Bu shunchaki smoke emas: har bir holat kontraktdagi bir talabga to'g'ri keladi.
// «Zaglushka» bo'lmasligi shu bilan ko'rsatiladi.
// ============================================================================
import {
  parse, valueAt, checkIdentity, checkOdz, parseOdz, domainHoles, checkReduction,
} from '../src/components/grade8/mathcore.js'

let pass = 0
let fail = 0
const bad = []

function t(name, got, want) {
  const ok = got === want
  if (ok) pass += 1
  else { fail += 1; bad.push(`${name}\n    kutilgan: ${want}\n    chiqdi:   ${got}`) }
}

// --- 1. Razbor: qavs yopilmasa — bu javob xatosi EMAS ---------------------
t('razbor: 2/(x-3 -> xato', parse('2/(x-3').error ? parse('2/(x-3').error.kind : 'yo\'q', 'paren')
t('razbor: bo\'sh satr', parse('').error.kind, 'empty')
t('razbor: 2/(x-3) joyida', parse('2/(x-3)').error === undefined, true)

// --- 2. Hisoblash --------------------------------------------------------
t('hisob: (a+3)/3, a=5', valueAt('(a+3)/3', { a: 5 }).value.toFixed(4), (8 / 3).toFixed(4))
t('hisob: a/3+1, a=5', valueAt('a/3+1', { a: 5 }).value.toFixed(4), (8 / 3).toFixed(4))
t('hisob: nolga bo\'lish -> null', valueAt('(a*a-4)/(a-2)', { a: 2 }).value, null)
t('hisob: 2a — belgisiz ko\'paytma', valueAt('2a', { a: 7 }).value, 14)
t('hisob: 2(a+1) — belgisiz', valueAt('2(a+1)', { a: 4 }).value, 10)
t('hisob: -a^2 = -(a^2)', valueAt('-a^2', { a: 3 }).value, -9)
t('hisob: sqrt(9)', valueAt('sqrt(9)', {}).value, 3)
t('hisob: sqrt(-1) -> null', valueAt('sqrt(-1)', {}).value, null)
t('hisob: abs(x-3), x=1', valueAt('abs(x-3)', { x: 1 }).value, 2)
t('hisob: x^(-1), x=4', valueAt('x^(-1)', { x: 4 }).value, 0.25)

// --- 3. Bir xil javobning boshqa yozuvi QABUL QILINADI -------------------
t('teng: 2/(x-3) va -2/(3-x)', checkIdentity('-2/(3-x)', '2/(x-3)').ok, true)
t('teng: 2/(x-3) va 2/(x-3)*1', checkIdentity('2/(x-3)*1', '2/(x-3)').ok, true)
t('teng: 2a+2 va 2(a+1)', checkIdentity('2(a+1)', '2a+2').ok, true)
t('teng: (a+3)/3 va a/3+1', checkIdentity('a/3+1', '(a+3)/3').ok, true)
// 1/(1+4/x) x=0 da mavjud emas, x/(x+4) esa 0 beradi -- demak TENG EMAS.
const eq0 = checkIdentity('1/(1+4/x)', 'x/(x+4)')
t('teng emas: 1/(1+4/x) x=0 da yo\'q', eq0.why, 'domain')
t('teng emas: nuqta x=0', eq0.point.x, 0)
t('teng: sqrt(2)*sqrt(2) va 2', checkIdentity('sqrt(2)*sqrt(2)', '2', { tol: 1e-9 }).ok, true)

// --- 4. Xato javob: KONTRPRIMER bilan rad etiladi ------------------------
const r1 = checkIdentity('a', '(a+3)/3')
t('xato: a != (a+3)/3', r1.ok, false)
t('xato: sabab qiymat', r1.why, 'value')
t('xato: kontrprimer bor', typeof r1.point === 'object' && r1.mine !== r1.ref, true)

const r2 = checkIdentity('x+8', 'x+2')
t('xato: x+8 != x+2', r2.why, 'value')
t('xato: x+8 da farq 6', Math.round(r2.mine - r2.ref), 6)

const r3 = checkIdentity('2/(x+3)', '2/(x-3)')
t('xato: boshqa ko\'paytuvchi', r3.why, 'value')

// --- 5. ANIQLANISH SOHASI boshqa -> QABUL QILINMAYDI (З2) ---------------
const d1 = checkIdentity('(a*a-4)/(a-2)', 'a+2')
t('З2: qiymatlar mos, soha boshqa', d1.ok, false)
t('З2: sabab domain', d1.why, 'domain')
t('З2: nuqta a=2', d1.point.a, 2)

const d2 = checkIdentity('x/(x+4)', '(x*x-4*x)/(x*x-16)')
t('З2: teskari tomon ham tutiladi', d2.why, 'domain')

// --- 6. Harflar: x haqidagi topshiriqqa y bilan javob bermaydi ----------
const v1 = checkIdentity('y/(y+4)', 'x/(x+4)')
t('harf: y javob emas', v1.why, 'vars')
t('harf: qaysi harf ortiqcha', v1.extra[0], 'y')

// --- 7. ODZ: TO'PLAM solishtiriladi, matn emas ---------------------------
t('ODZ: x != 4, x != -4', checkOdz('x != 4, x != -4', [4, -4], 'x').ok, true)
t('ODZ: tartib muhim emas', checkOdz('x != -4, x != 4', [4, -4], 'x').ok, true)
t('ODZ: x-4 != 0 shakli', checkOdz('x-4 != 0, x+4 != 0', [4, -4], 'x').ok, true)
t('ODZ: 4 != x shakli', checkOdz('4 != x, -4 != x', [4, -4], 'x').ok, true)
t('ODZ: unicode ≠ va −', checkOdz('x ≠ 4, x ≠ −4', [4, -4], 'x').ok, true)

const o1 = checkOdz('x != 4', [4, -4], 'x')
t('ODZ: yarmi -> missing', o1.why, 'missing')
t('ODZ: yetmagani -4', o1.value, -4)

const o2 = checkOdz('x != 0, x != 4, x != -4', [4, -4], 'x')
t('ODZ: ortiqcha shart', o2.why, 'extra')
t('ODZ: ortiqchasi 0', o2.value, 0)

t('ODZ: razbor bo\'lmadi', checkOdz('x = 4', [4], 'x').why, 'parse')

// --- 8. Ifodaning ODZ ini o'zi topadi -----------------------------------
t('soha: (a*a-4)/(a-2) -> {2}', JSON.stringify(domainHoles('(a*a-4)/(a-2)', 'a').holes), '[2]')
t('soha: (2x+6)/(x*x-9) -> {-3,3}', JSON.stringify(domainHoles('(2*x+6)/(x*x-9)', 'x').holes), '[-3,3]')
t('soha: (x*x-4*x)/(x*x-16)', JSON.stringify(domainHoles('(x*x-4*x)/(x*x-16)', 'x').holes), '[-4,4]')
t('soha: 3-sinf darsi (a*a-9)/(a*a+3*a)', JSON.stringify(domainHoles('(a*a-9)/(a*a+3*a)', 'a').holes), '[-3,0]')

// --- 9. Dars 3 ning haqiqiy javoblari -----------------------------------
t('D3 e1: (5a+15)/5 -> a+3', checkIdentity('a+3', '(5*a+15)/5').ok, true)
t('D3 e6: natija a+2', checkIdentity('a+2', 'a+2').ok, true)
t('D3 e9: 0/0 nuqtasi', valueAt('(a*a-4)/(a-2)', { a: 2 }).value, null)
t('D3 e10: (a-3)/a', checkIdentity('(a-3)/a', '(a*a-9)/(a*a+3*a)').why, 'domain')
t('D3 e11: x/(x+4)', checkIdentity('x/(x+4)', 'x/(x+4)').ok, true)
t('D3 e14: 2/(x-3)', checkIdentity('2/(x-3)', '(2*x+6)/(x*x-9)').why, 'domain')
t('D3 e14 teskari: (a*a+a)/a -> a+1', checkIdentity('(a*a+a)/a', 'a+1').why, 'domain')
t('D3 e14 teskari ODZ', JSON.stringify(domainHoles('(a*a+a)/a', 'a').holes), '[0]')

// --- 9a. TESKARI topshiriq: qisqartirilganda a+1 beradigan kasr ------------
t('teskari: (a*a+a)/a -> a+1', checkReduction('(a*a+a)/a', 'a+1').ok, true)
t('teskari: ODZ i {0}', JSON.stringify(domainHoles('(a*a+a)/a', 'a').holes), '[0]')
t('teskari: ((a+1)(a-3))/(a-3) -> a+1', checkReduction('((a+1)(a-3))/(a-3)', 'a+1').ok, true)
t('teskari: uning ODZ i {3}', JSON.stringify(domainHoles('((a+1)*(a-3))/(a-3)', 'a').holes), '[3]')
t("teskari: (3a+3)/3 -> a+1 ham to'g'ri", checkReduction('(3a+3)/3', 'a+1').ok, true)
t("teskari: lekin ODZ i BO'SH", JSON.stringify(domainHoles('(3*a+3)/3', 'a').holes), '[]')
t('teskari: (a+1)/a qisqarmaydi', checkReduction('(a+1)/a', 'a+1').why, 'value')
t('teskari: (a*a+a)/(a+1) -> a, a+1 emas', checkReduction('(a*a+a)/(a+1)', 'a+1').why, 'value')
t('teskari: ODZ shart bilan birga rad etiladi', checkOdz('a != 3', [0], 'a').why, 'extra')

// --- 10. Seed: bir xil kirishda bir xil nuqtalar -------------------------
const s1 = checkIdentity('a', '(a+3)/3', { seed: 7 })
const s2 = checkIdentity('a', '(a+3)/3', { seed: 7 })
t('seed: takrorlanadi', JSON.stringify(s1.point), JSON.stringify(s2.point))

// --- Natija ---------------------------------------------------------------
console.log('')
console.log(`  o'tdi: ${pass}   yiqildi: ${fail}`)
if (bad.length) {
  console.log('')
  bad.forEach((b) => console.log('  ✗ ' + b))
  process.exitCode = 1
} else {
  console.log('  mathcore.js kontraktga mos (§10.1)')
}
console.log('')
