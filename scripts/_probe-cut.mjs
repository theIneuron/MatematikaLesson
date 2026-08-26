// BITTA slaydda gorizontal kesilishni topadi va AYNAN qaysi element
// ekanini aytadi. `noscroll` ro'yxati uzun bo'lganda qirqiladi, va aybdor
// element nomsiz qoladi -- shu skript o'sha bo'shliqni yopadi.
//   SLUG=dars37-... SLIDE=3 LANG3=en W=393 H=660 node scripts/_probe-cut.mjs
import { chromium } from 'playwright'

const port = process.env.PORT || 5299
const slug = process.env.SLUG || 'dars37-skalyar-kopaytma'
const slide = Number(process.env.SLIDE || 1)
const lang = process.env.LANG3 || 'en'

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: Number(process.env.W || 393), height: Number(process.env.H || 660) } })
await p.goto(`http://localhost:${port}/11-sinf/matematika/nazariy/${slug}`, { waitUntil: 'networkidle' })
await p.waitForTimeout(700)
const sw = p.locator('.g11-langsw button')
if (await sw.count()) await sw.nth({ uz: 0, ru: 1, en: 2 }[lang]).click({ force: true }).catch(() => {})
await p.waitForTimeout(400)
for (let i = 1; i < slide; i += 1) {
  await p.locator('.g11-nav-r button').first().click({ force: true })
  await p.waitForTimeout(220)
}
await p.waitForTimeout(Number(process.env.WAIT || 22000))

// OCHILISH QADAMLARI. `noscroll` slayd ichida tugmalarni bosib boradi, va
// kesilish O'RTADAGI qadamda chiqishi mumkin: oxirgi holat toza bo'lsa ham.
const steps = Number(process.env.STEPS || 0)
const seen = []
for (let k = 0; k < steps; k += 1) {
  const clicked = await p.evaluate(() => {
    const root = document.querySelector('.stage-content')
    if (!root) return false
    const b2 = Array.from(root.querySelectorAll('button')).filter((x) => !x.disabled)
    if (!b2.length) return false
    // OXIRGI tugma bosiladi, birinchisi emas: `noscroll` slayd ichida
    // variantlarni ham bosadi va NOTO'G'RI javob RAZBORINI ochadi -- aynan
    // u balandlikni oshiradi. Birinchi tugmani bosgan o'lchov razborni
    // ko'rmaydi va «toza» deb yolg'on gapiradi.
    b2[b2.length - 1].click()
    return true
  })
  if (!clicked) break
  await p.waitForTimeout(500)
  const cut = await p.evaluate(() => {
    const out = []
    document.querySelectorAll('.stage-content *').forEach((el) => {
      const over = el.scrollWidth - el.clientWidth
      if (over > 2 && el.clientWidth > 0) {
        out.push({ over, cls: (el.className || el.tagName).toString().slice(0, 40), txt: (el.textContent || '').trim().slice(0, 60) })
      }
    })
    return out.sort((a, b3) => b3.over - a.over).slice(0, 3)
  })
  cut.forEach((c) => seen.push('qadam ' + (k + 1) + ': +' + c.over + 'px [' + c.cls + '] ' + c.txt))
}
seen.forEach((l) => console.log('  ' + l))

const cuts = await p.evaluate(() => {
  const out = []
  document.querySelectorAll('.stage-content *').forEach((el) => {
    const over = el.scrollWidth - el.clientWidth
    if (over > 2 && el.clientWidth > 0) {
      out.push({
        over,
        cls: el.className && el.className.toString ? el.className.toString().slice(0, 40) : el.tagName,
        txt: (el.textContent || '').trim().slice(0, 70),
      })
    }
  })
  return out.sort((a, b2) => b2.over - a.over).slice(0, 8)
})
// BALANDLIK ham o'lchanadi. Birinchi versiya faqat gorizontalni ko'rdi, va
// 37-darsning 3-slaydi inglizchada balandlik bo'yicha 63 px oshib ketganini
// O'TKAZIB YUBORDI: `noscroll` uni ko'rdi, nuqtali o'lchov esa «toza» dedi.
const high = await p.evaluate(() => {
  const c = document.querySelector('.stage-content')
  if (!c) return null
  const over = c.scrollHeight - c.clientHeight
  const kids = Array.from(c.children).map((el) => ({
    cls: (el.className || el.tagName).toString().slice(0, 34),
    h: Math.round(el.getBoundingClientRect().height),
  }))
  return { over, box: Math.round(c.clientHeight), kids }
})
if (high) {
  console.log('  balandlik: ' + high.box + 'px, oshib ketish ' + high.over + 'px')
  if (high.over > 2) high.kids.forEach((k) => console.log('    ' + k.h + 'px  ' + k.cls))
}

console.log(slug, 'slayd', slide, lang)
if (!cuts.length) console.log('  kesilish yo\'q')
cuts.forEach((c) => console.log('  +' + c.over + 'px  [' + c.cls + ']  ' + c.txt))
await b.close()
