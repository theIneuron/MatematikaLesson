// SecantBoard ni MASHINA tekshiradi. Ko'z bilan ko'rish yetmaydi: yozuv
// chizma chetidan yarim piksel chiqib ketganini yoki son bir birlik
// xato ekanini surat ko'rsatmaydi.
//
// Ikki tekshiruv:
//   1) HAR BIR yozuv viewBox ICHIDA -- qirqilgan yorliq xato hisoblanadi;
//   2) pastdagi son ANALITIK qiymatga teng -- ya'ni chizma rost gapiradi.
//      Kutilgan qiymatlar shu yerda QO'LDA yozilgan: asbob ularni
//      o'zidan hisoblasa, tekshiruv o'zini tekshirgan bo'lardi.
import { chromium } from 'playwright'

const PORT = process.env.PORT || 5298
// Kartochka tartibi probe/secant.jsx dagi tartib bilan bir xil.
// [kartochka indeksi, yozuv, kutilgan son]
const EXPECT = [
  [0, 'Δy / h', 4],        // (3^2 - 1^2) / 2 = 4
  [1, 'Δy / h', 4],        // keepSecant 'first': ENG KENG kesuvchi, h = 2 -> (9 - 1) / 2 = 4
  [1, 'k', 2],             // (x^2)' = 2x, x = 1
  [2, "o'rtacha", 6],      // (4^2 - 2^2) / 2 = 6
  [3, 'k', -1],            // (x^2 - 5x)' = 2x - 5, x = 2
  [6, 'Δy / h', -3.4],     // (-x^2+4x), x0=3, h=1,4: (-1,76 - 3) / 1,4 = -3,4
]

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1180, height: 2100 } })
const errs = []
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message))
await p.goto(`http://localhost:${PORT}/probe/secant.html`, { waitUntil: 'networkidle' })
// Faza 0 da to'xtatib turish uchun emas -- kartochkalar aylanadi, shuning
// uchun o'lchov aylanish boshlanishidan OLDIN olinadi.
await p.waitForTimeout(400)

const cards = await p.evaluate(() => {
  const out = []
  document.querySelectorAll('#r > div > div > div').forEach((card, idx) => {
    const title = card.querySelector('div') ? card.querySelector('div').textContent : ''
    const svg = card.querySelector('svg')
    if (!svg) { out.push({ idx, title, texts: [], outside: [] }); return }
    const vb = svg.getAttribute('viewBox').split(' ').map(Number)
    const W = vb[2]
    const H = vb[3]
    const texts = []
    const outside = []
    svg.querySelectorAll('text').forEach((el) => {
      const s = el.textContent
      texts.push(s)
      let bb = null
      try { bb = el.getBBox() } catch (e) { bb = null }
      if (!bb) return
      if (bb.x < -0.5 || bb.y < -0.5 || bb.x + bb.width > W + 0.5 || bb.y + bb.height > H + 0.5) {
        outside.push(s + ' [x ' + bb.x.toFixed(1) + ' y ' + bb.y.toFixed(1)
          + ' w ' + bb.width.toFixed(1) + ' h ' + bb.height.toFixed(1) + ' / ' + W + 'x' + H + ']')
      }
    })
    out.push({ idx, title, texts, outside })
  })
  return out
})

const num = (s) => Number(String(s).replace('−', '-').replace(',', '.'))
let bad = 0
console.log(`kartochka: ${cards.length} ta`)

cards.forEach((c) => {
  if (c.outside.length) {
    bad += 1
    console.log(`  x [${c.idx}] ${c.title.slice(0, 40)} -- yozuv chizmadan chiqdi:`)
    c.outside.forEach((o) => console.log('      ' + o))
  }
})

EXPECT.forEach(([idx, label, want]) => {
  const c = cards[idx]
  if (!c) { bad += 1; console.log(`  x [${idx}] kartochka yo'q`); return }
  const line = c.texts.find((s) => s.indexOf(label + ' = ') === 0)
  if (!line) {
    bad += 1
    console.log(`  x [${idx}] «${label}» yozuvi yo'q. Bor yozuvlar: ${c.texts.filter((s) => s.indexOf(' = ') > 0).join(' | ')}`)
    return
  }
  const got = num(line.split(' = ')[1])
  if (Math.abs(got - want) > 0.011) {
    bad += 1
    console.log(`  x [${idx}] «${label}»: chizmada ${got}, analitik ${want}`)
  }
})

if (errs.length) { bad += 1; console.log('  x konsol xatolari: ' + errs.slice(0, 5).join(' / ')) }
console.log(bad ? `\nXATO: ${bad} ta` : '\nOK: yozuvlar chizma ichida, sonlar analitik qiymatga teng, konsol toza.')
await b.close()
process.exit(bad ? 1 : 0)
