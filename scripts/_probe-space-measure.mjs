// Stenddagi kartochkalarni O'LCHAYDI: strelkalar va o'qlar uzunligi.
// Ko'z bilan «qisqa ko'rinadi» degan xulosa noto'g'ri bo'lishi mumkin.
import { chromium } from 'playwright'

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1180, height: 1200 } })
await p.goto('http://localhost:5299/probe/space.html', { waitUntil: 'networkidle' })
await p.waitForTimeout(600)

const out = await p.evaluate(() => {
  const cards = Array.from(document.querySelectorAll('#r > div > div > div'))
  return cards.map((c) => {
    const title = c.querySelector('div') ? c.querySelector('div').textContent : '?'
    const svg = c.querySelector('svg')
    if (!svg) return { title, svg: null }
    const vb = svg.getAttribute('viewBox')
    const lines = Array.from(svg.querySelectorAll('line')).map((l) => {
      const x1 = +l.getAttribute('x1'); const y1 = +l.getAttribute('y1')
      const x2 = +l.getAttribute('x2'); const y2 = +l.getAttribute('y2')
      return {
        len: Math.round(Math.hypot(x2 - x1, y2 - y1)),
        w: l.getAttribute('stroke-width'),
        stroke: l.getAttribute('stroke'),
      }
    })
    const thick = lines.filter((l) => +l.w >= 1.9).map((l) => l.len)
    return {
      title,
      vb,
      rect: (() => { const r = svg.getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height) })(),
      thickLens: thick,
      texts: Array.from(svg.querySelectorAll('text')).length,
    }
  })
})
out.forEach((o) => console.log(JSON.stringify(o)))

// QISQA STRELKA tekshiruvi. Har qanday parallel proyeksiyada ba'zi
// yo'nalishlar YIG'ILADI: kabinet proyeksiyasida bu (2,83; 1; 1) atrofidagi
// yo'nalishlar. Asbob ularni halol chizadi -- lekin 20 pikselli strelkadan
// dars chiqmaydi. Shuning uchun chegara: 24 px.
const bad = out.filter((o) => (o.thickLens || []).some((l) => l < 24))
if (bad.length) {
  console.log("\nQISQA STRELKA (24 px dan kam) -- yo'nalishni o'zgartirish kerak:")
  bad.forEach((o) => console.log('  x ' + o.title + ' -> ' + o.thickLens.join(', ')))
} else {
  console.log("\nstrelkalar: hammasi 24 px dan uzun")
}
await b.close()
