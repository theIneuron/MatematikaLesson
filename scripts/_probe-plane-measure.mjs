// PlaneBoard ni MASHINA tekshiradi.
//
// Ikki savol:
//   1) har bir yozuv viewBox ICHIDA turadimi (qirqilgan yorliq -- xato);
//   2) chizmadagi kesmalar NISBATI ma'lumotdagi nisbatga tengmi. Ikkinchisi
//      miqyosning ikki o'q bo'yicha bir xil ekanini tekshiradi: agar x va y
//      boshqacha cho'zilsa, 3-4-5 uchburchagi ekranda 3-4-5 bo'lib
//      qolmaydi, aylana esa ellips bo'ladi (6-sinfda aynan shu xato bo'lgan).
//
//   PORT=5297 node scripts/_probe-plane-measure.mjs
import { chromium } from 'playwright'

const PORT = process.env.PORT || 5297

// [kartochka, kutilgan nisbatlar] -- QO'LDA yozilgan: asbob o'zidan
// hisoblasa, tekshiruv o'zini tekshirgan bo'lardi.
// 0-kartochka: to'g'ri burchakli uchburchak 3, 4, 5.
const EXPECT_RATIO = [
  { card: 0, want: [3, 4, 5] },
  // 6-kartochka: o'rta chiziq uchburchakning yarmi -- 6 va 3 (plus yarim tomonlar).
  { card: 6, longest: 6, half: 3 },
]

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1180, height: 2100 } })
const errs = []
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message))
await p.goto(`http://localhost:${PORT}/probe/plane.html`, { waitUntil: 'networkidle' })
await p.waitForTimeout(500)

const cards = await p.evaluate(() => {
  const out = []
  document.querySelectorAll('#r > div > div > div').forEach((card, idx) => {
    const title = card.querySelector('div') ? card.querySelector('div').textContent : ''
    const svg = card.querySelector('svg')
    if (!svg) { out.push({ idx, title, outside: [], lens: [], circles: [] }); return }
    const vb = svg.getAttribute('viewBox').split(' ').map(Number)
    const W = vb[2]
    const H = vb[3]
    const outside = []
    svg.querySelectorAll('text').forEach((el) => {
      let bb = null
      try { bb = el.getBBox() } catch (e) { bb = null }
      if (!bb) return
      if (bb.x < -0.5 || bb.y < -0.5 || bb.x + bb.width > W + 0.5 || bb.y + bb.height > H + 0.5) {
        outside.push(el.textContent + ' [x ' + bb.x.toFixed(1) + ' y ' + bb.y.toFixed(1)
          + ' w ' + bb.width.toFixed(1) + ' / ' + W + 'x' + H + ']')
      }
    })
    const lens = []
    svg.querySelectorAll('line').forEach((el) => {
      const x1 = Number(el.getAttribute('x1'))
      const y1 = Number(el.getAttribute('y1'))
      const x2 = Number(el.getAttribute('x2'))
      const y2 = Number(el.getAttribute('y2'))
      lens.push(Math.hypot(x2 - x1, y2 - y1))
    })
    const circles = []
    svg.querySelectorAll('circle').forEach((el) => {
      circles.push(Number(el.getAttribute('r')))
    })
    out.push({ idx, title, outside, lens, circles })
  })
  return out
})

let bad = 0
console.log(`kartochka: ${cards.length} ta`)
cards.forEach((c) => {
  if (c.outside.length) {
    bad += 1
    console.log(`  x [${c.idx}] ${c.title.slice(0, 40)} -- yozuv chizmadan chiqdi:`)
    c.outside.forEach((o) => console.log('      ' + o))
  }
})

EXPECT_RATIO.forEach((e) => {
  const c = cards[e.card]
  if (!c) { bad += 1; console.log(`  x [${e.card}] kartochka yo'q`); return }
  // Kesma chiziqlari: eng uzun uchtasi figuraning tomonlari (qolganlari
  // belgilar va punktirlar). Uzunlik bo'yicha kamayish tartibida olamiz.
  const L = c.lens.slice().sort((a, z) => z - a)
  if (e.want) {
    const three = L.slice(0, 3).sort((a, z) => a - z)
    const k = three[0] / e.want[0]
    const got = three.map((v) => Number((v / k).toFixed(2)))
    const ok = got.every((v, i) => Math.abs(v - e.want[i]) < 0.06)
    if (!ok) {
      bad += 1
      console.log(`  x [${e.card}] tomonlar nisbati ${got.join(' : ')}, kutilgan ${e.want.join(' : ')}`)
    }
  }
  if (e.longest) {
    const big = L[0]
    // Yarmi: ro'yxatda taxminan yarim uzunlikdagi kesma bo'lishi kerak.
    const halfSeen = L.some((v) => Math.abs(v / big - e.half / e.longest) < 0.04)
    if (!halfSeen) {
      bad += 1
      console.log(`  x [${e.card}] yarim uzunlikdagi kesma topilmadi (o'rta chiziq)`)
    }
  }
})

if (errs.length) { bad += 1; console.log('  x konsol xatolari: ' + errs.slice(0, 4).join(' / ')) }
console.log(bad ? `\nXATO: ${bad} ta` : "\nOK: yozuvlar chizma ichida, tomonlar nisbati ma'lumotdagidek, konsol toza.")
await b.close()
process.exit(bad ? 1 : 0)
