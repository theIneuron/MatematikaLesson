// Dars QO'L BILAN o'tiladimi: skript o'quvchi rolini o'ynaydi -- nuqtani
// aylanaga qo'yadi, chiplarni tanlaydi, sonni yozadi. Har ekranda «yechildi»
// belgisi paydo bo'lishi SHART, aks holda ekran o'tib bo'lmaydigan.
import { chromium } from 'playwright'

// Dars ARGUMENT bilan tanlanadi. Har darsning o'z bosish rejasi bor: bu
// tekshiruv «qo'l bilan o'tiladimi» degan savolga javob beradi, ya'ni har
// ekranda AYNIQSA nima qilish kerakligini bilishi shart. Reja darsdan qolib
// ketmasin: 3-darsning 11 va 13-ekrani o'zgarganda reja eskirib qolgan edi va
// tekshiruv ikki ekranni «yechilmadi» deb yozib turgan edi.
//   node scripts/grade10-hand.mjs dars01
const LESSON = process.argv.slice(2).find((a) => !a.startsWith('--')) || 'dars03'
const SLUGS = {
  dars03: 'dars03-trigonometrik-doira',
  dars01: 'dars01-radianlar',
  dars02: 'dars02-sin-cos-tg',
  dars04: 'dars04-ishoralar-qiymatlar',
  dars05: 'dars05-juftlik-davr',
  dars06: 'dars06-grafiklar',
  dars08: 'dars08-arkfunksiyalar',
  dars09: 'dars09-sodda-tenglamalar',
  dars10: 'dars10-sin-x-a',
  dars07: 'dars07-funksiyalar',
  dars11: 'dars11-cos-x-a',
}
if (!SLUGS[LESSON]) {
  console.log(`nomalum dars: ${LESSON}. Bor: ${Object.keys(SLUGS).join(', ')}`)
  process.exit(1)
}
const BASE = `http://localhost:5210/10-sinf/matematika/nazariy/${SLUGS[LESSON]}`
const VIEWPORTS = [
  { name: '1366x655', w: 1366, h: 655 },
  { name: '1366x615', w: 1366, h: 615 },
  { name: '390x745', w: 390, h: 745 },
  // HAQIQIY telefon: metodist 2026-08-11 da aynan shu o'lchamda pastki
  // qatorlar kesilganini ko'rdi, 745 va 690 esa o'tib ketgan edi. Eng qattiq
  // o'lcham shu, va u qo'l bilan o'tish tekshiruvida ham bo'lishi kerak.
  { name: '393x660', w: 393, h: 660 },
// Bir nechta o'lcham vergul bilan: GRADE10_ONLY=1366x615,393x660
].filter((vp) => {
  const only = (process.env.GRADE10_ONLY || '').split(',').map((s) => s.trim()).filter(Boolean)
  return !only.length || only.some((o) => vp.name.indexOf(o) !== -1)
})

const problems = []

async function circleClick(page, deg) {
  const box = await page.evaluate(() => {
    const svg = document.querySelector('.g10-circle')
    if (!svg) return null
    const r = svg.getBoundingClientRect()
    return { x: r.left, y: r.top, w: r.width, h: r.height }
  })
  if (!box) return false
  const R = box.w * 0.37
  const cx = box.x + box.w / 2
  const cy = box.y + box.h / 2
  const rad = (deg * Math.PI) / 180
  await page.mouse.click(cx + R * Math.cos(rad), cy - R * Math.sin(rad))
  await page.waitForTimeout(260)
  return true
}

// `text` satr yoki `{ text, not, exact }` bo'lishi mumkin.
//
// `not` NIMA UCHUN kerak: bitta ekranda «одна вторая» va «минус одна вторая»
// variantlari yonma-yon turadi, va oddiy qidiruv birinchisiga -- ya'ni
// NOTO'G'RIsiga tushadi. 5-darsning blitsi aynan shunga qoqildi (2026-08-13).
//
// `exact` NIMA UCHUN kerak: 6-darsning moslashtirishida chap ustun `0°`, `90°`,
// `180°`, `270°`. Qism sifatida `0°` uchtasiga ham tushadi, va `not` bilan buni
// yozib bo'lmaydi -- taqqoslash to'liq bo'lishi kerak.
async function clickText(page, text) {
  const spec = typeof text === 'string' ? { text, not: null, exact: false } : text
  const ok = await page.evaluate(({ needle, avoid, whole }) => {
    const nodes = Array.from(document.querySelectorAll('.stage-content button'))
    const hit = nodes.find((b) => {
      const t = (b.textContent || '').replace(/\s+/g, ' ').trim()
      if (b.disabled) return false
      if (whole) return t === needle
      if (t.indexOf(needle) === -1) return false
      return !avoid || t.indexOf(avoid) === -1
    })
    if (!hit) return false
    hit.click()
    return true
  }, { needle: spec.text, avoid: spec.not, whole: !!spec.exact })
  await page.waitForTimeout(300)
  return ok
}

// Chipni AYNAN chip ro'yxatidan bosamiz: jadval katakchalari ham tugma va
// to'lgandan keyin ular ham o'sha matnni ko'rsatadi.
async function clickChip(page, label) {
  const ok = await page.evaluate((needle) => {
    const chips = Array.from(document.querySelectorAll('.g10-chip')).filter((b) => !b.disabled)
    const hit = chips.find((b) => (b.textContent || '').trim() === needle)
    if (!hit) return false
    hit.click()
    return true
  }, label)
  await page.waitForTimeout(220)
  return ok
}

async function typeNumber(page, digits) {
  for (const ch of digits) {
    const ok = await clickText(page, ch)
    if (!ok) return false
  }
  return clickText(page, 'Проверить')
}

// «Yechildi» belgisi: yo selektor, yo {sel, count}.
// SANOQ nima uchun kerak: savollar zanjirida javob berilgan savol `.g10-done`
// qatoriga yig'iladi, ya'ni belgi BIRINCHI javobdan keyin paydo bo'ladi. Faqat
// selektorga qarab tekshirsak, to'rt savoldan bittasiga javob bergan ekran ham
// «o'tildi» bo'lib chiqadi. Shuning uchun zanjirlarda qator SONI tekshiriladi.
async function has(page, done) {
  const sel = typeof done === 'string' ? done : done.sel
  const need = typeof done === 'string' ? 1 : done.count
  return page.evaluate(
    ({ s, n }) => document.querySelectorAll(s).length >= n,
    { s: sel, n: need },
  )
}

// ISHGA TAYYORLIGINI KUTAMIZ, taymerga ishonmaymiz.
// Sabab: tushuntirish ekranlari «ko'rsatish, keyin ish» tartibida ishlaydi
// (metodist, 2026-08-11) -- ko'rsatish kadrlarida aylana QULFLANGAN va bosish
// hech narsa qilmaydi. Qat'iy `waitForTimeout` bilan skript qulflangan
// asbobni bosardi va «qo'l bilan yechilmadi» deb yozardi: dars emas,
// taymer o'lchanardi. Endi kutamiz: bosiladigan tugma yoki OCHIQ aylana.
async function waitReady(page, ms = 20000) {
  const step = 250
  for (let t = 0; t < ms; t += step) {
    const ready = await page.evaluate(() => {
      const live = document.querySelector('.g10-circle:not(.g10-circle-locked)')
      const btn = Array.from(document.querySelectorAll('.stage-content button')).some((b) => !b.disabled)
      const pad = document.querySelector('.g10-key, .g10-chip')
      return !!(live || pad || btn)
    })
    if (ready) { await page.waitForTimeout(200); return true }
    await page.waitForTimeout(step)
  }
  return false
}

// ISHCHI AYLANANI kutamiz -- AYNAN uni, tugmani emas.
// `waitReady` dan farqi: u «biror bosiladigan narsa bormi» deb qaraydi, va
// `FREE_NAV` yoqiq bo'lganda «Davom» tugmasi HAR DOIM bosiladigan -- ya'ni
// ko'rsatish kadrida ham «tayyor» deb javob beradi. Nuqta qo'yish kerak
// bo'lgan ekranda bu yetarli emas: skript qulflangan chizmani bosardi.
async function waitCircle(page, ms = 25000) {
  const step = 250
  for (let t = 0; t < ms; t += step) {
    const live = await page.evaluate(() => !!document.querySelector('.g10-circle:not(.g10-circle-locked)'))
    if (live) { await page.waitForTimeout(250); return true }
    await page.waitForTimeout(step)
  }
  return false
}

// KLAVIATURANI kutamiz. `waitReady` bu yerda yetarli emas: `FREE_NAV` yoqiq
// bo'lganda «Davom» tugmasi doim bosiladigan, ya'ni u ko'rsatish kadrida ham
// «tayyor» deb javob beradi. Son kiritiladigan ekranda ko'rsatish uch kadr
// bo'lishi mumkin, va skript klaviatura chiqmasidan oldin bosib, «qo'l bilan
// yechilmadi» deb yozardi.
async function waitKeys(page, ms = 25000) {
  const step = 250
  for (let t = 0; t < ms; t += step) {
    const on = await page.evaluate(() => !!document.querySelector('.g10-key'))
    if (on) { await page.waitForTimeout(200); return true }
    await page.waitForTimeout(step)
  }
  return false
}

// Har ekran uchun: nima qilish va «yechildi» belgisi nima.
const PLANS = {}

PLANS.dars03 = [
  { n: 1, act: async (p) => clickText(p, 'перв'), done: '.g10-fb' },
  { n: 2, act: async (p) => { await circleClick(p, 30); await circleClick(p, 90) }, done: '.g10-fb-ok' },
  { n: 3, act: async (p) => { await circleClick(p, 20); await circleClick(p, 110); await circleClick(p, 200) }, done: '.g10-fb-ok' },
  { n: 4, act: async (p) => circleClick(p, 45), done: '.g10-fb-ok' },
  { n: 5, act: async (p) => { await circleClick(p, 30); await circleClick(p, 60) }, done: '.g10-fb-ok' },
  { n: 6, act: async (p) => { await circleClick(p, 0); await circleClick(p, 90); await circleClick(p, 180); await circleClick(p, 270) }, done: '.g10-fb-ok' },
  { n: 7, act: async (p) => { await circleClick(p, 90); await circleClick(p, 90); await typeNumber(p, ['−', '0', ',', '4', '4']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, '(1/2; √3/2)'), done: '.g10-rule' },
  { n: 9, act: async (p) => { for (const c of ['√3/2', '1/2', '√2/2', '√2/2', '1/2', '√3/2']) await clickChip(p, c); await clickText(p, 'Проверить') }, done: '.g10-fb-ok' },
  // 10-ekran ikki qadamli: nuqta qo'yish, keyin MOSLASHTIRISH. Belgi ikkinchi
  // qadamdan olinadi: to'rt juft yig'ilgan qatorlar soni.
  { n: 10,
    act: async (p) => {
      await circleClick(p, 30)
      await circleClick(p, 150)
      await p.waitForTimeout(2200)
      await waitReady(p)
      for (const [a, b] of [['π/6', '(√3/2; 1/2)'], ['π/4', '(√2/2; √2/2)'], ['π/3', '(1/2; √3/2)'], ['π/2', '(0; 1)']]) {
        await clickText(p, a)
        await clickText(p, b)
      }
    },
    done: { sel: '.g10-done', count: 4 } },
  { n: 11,
    act: async (p) => {
      await typeNumber(p, ['1'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      // Ikkinchi qadam: KAMAYISH tartibi. cos 0 > cos 60 > cos 90 > cos 180.
      for (const c of ['cos 0', 'cos 60', 'cos 90', 'cos 180']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok' },
  { n: 12, act: async (p) => { await clickText(p, 'cos 120° = cos 60°'); await typeNumber(p, ['−', '0', ',', '5']) }, done: '.g10-entry-ok' },
  { n: 13,
    act: async (p) => {
      await circleClick(p, 135)
      await p.waitForTimeout(2000)
      await waitReady(p)
      // Ikkinchi qadam: HAMMA mumkin bo'lgan yozuv belgilanadi.
      for (const c of ['sin α = 0,9', 'sin α = −1', 'sin α = √2/2']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok' },
  { n: 14, act: async (p) => { for (const a of ['√2/2', 'Отразить', '3π/2', 'два']) { await clickText(p, a); await p.waitForTimeout(1700) } }, done: { sel: '.g10-done', count: 4 } },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 1-dars: RADIANLAR. Bu yerda burchak UZUNLIK bilan o'lchanadi, shuning uchun
// bosishlar yoy va vatar chegaralari bo'yicha boradi: bir radian 57,3°.
const R1 = 57.29578
PLANS.dars01 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      for (const a of ['2π', '6,28', '1/4']) { await clickText(p, a); await p.waitForTimeout(1600) }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  {
    n: 3,
    // Oltita radiusni yoy bo'ylab yotqizib, aylanani yopamiz: yettinchi bosish
    // -- yopilish, undan keyingina qoldiq ko'rsatiladi.
    act: async (p) => {
      for (let i = 1; i <= 6; i += 1) await circleClick(p, (i * R1) % 360)
      await circleClick(p, 0)
    },
    done: '.g10-fb-ok',
  },
  {
    n: 4,
    // Vatarlar: oltitasi aylanani AYNAN yopadi, qo'shimcha bosish kerak emas.
    act: async (p) => { for (let i = 1; i <= 6; i += 1) await circleClick(p, (i * 60) % 360) },
    done: '.g10-fb-ok',
  },
  {
    n: 5,
    // Radiusni IKKI chekkaga ham surish kerak: nisbat qimirlamaganini bir
    // chekkada ko'rish yetarli emas.
    act: async (p) => {
      const r = p.locator('.g10-range')
      await r.fill('35')
      await p.waitForTimeout(500)
      await r.fill('95')
      await p.waitForTimeout(500)
    },
    done: '.g10-fb-ok',
  },
  {
    n: 6,
    act: async (p) => {
      await waitCircle(p)
      await circleClick(p, 90)
      await circleClick(p, 60)
      await circleClick(p, 120)
    },
    done: '.g10-fb-ok',
  },
  { n: 7, act: async (p) => typeNumber(p, ['0', ',', '7']), done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'π/180'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      for (const [a, b] of [['30°', 'π/6'], ['45°', 'π/4'], ['60°', 'π/3'], ['90°', 'π/2']]) {
        await clickText(p, a)
        await clickText(p, b)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      for (const c of ['135 · π/180', 'сократить на 45', '3π/4']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await typeNumber(p, ['3', '6'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      // Ikkinchi qadam: O'SISH tartibi. π/4 = 45, 50°, 1 rad = 57, π/3 = 60.
      for (const c of ['π/4', '50°', '1 rad', 'π/3']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, 'α = 60')
      await p.waitForTimeout(1200)
      await typeNumber(p, ['1', '2', ',', '6'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      // 13-ekranda avval KARUSEL aylanadi (ko'rsatish), keyin ishchi aylana
      // keladi. Shuning uchun tugmani emas, AYLANANI kutamiz.
      await waitCircle(p)
      await circleClick(p, 60)
      await p.waitForTimeout(2000)
      await waitReady(p)
      for (const c of ['60°', 'π/3', '2π/6']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['45°', '3π/2', '180/π', 'меньше']) { await clickText(p, a); await p.waitForTimeout(1700) }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 2-dars: SINUS, KOSINUS, TANGENS. Bu yerda burchak KOORDINATA bilan
// o'lchanadi, shuning uchun bosishlar aniq qiymatli burchaklar bo'yicha boradi.
PLANS.dars02 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      // 1-savolning variantlari CHIZMADAN o'qiladi: `a/c`, `b/c`, `a/b`, `c/a`.
      // Javob berilgach `sin α = a/c` qatori chiqadi, lekin u TUGMA emas
      // (`DoneRow` bu `div`), shuning uchun qidiruvga xalaqit bermaydi.
      for (const a of ['a/c', '1', 'абсцисс']) { await clickText(p, a); await p.waitForTimeout(1600) }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  {
    n: 3,
    // Balandligi bir ikkidan bo'lgan nuqta: 30 gradus (150 ham to'g'ri).
    act: async (p) => { await waitCircle(p); await circleClick(p, 30) },
    done: '.g10-fb-ok',
  },
  {
    n: 4,
    // Nuqtani 120 gradusga olib borish: uchburchak yo'q, koordinata bor.
    act: async (p) => { await waitCircle(p); await circleClick(p, 120) },
    done: '.g10-fb-ok',
  },
  {
    n: 5,
    // Ikki qadam: avval burchak berilgan (135), keyin juftlik berilgan (45).
    act: async (p) => {
      await waitCircle(p)
      await circleClick(p, 135)
      await p.waitForTimeout(2200)
      await waitCircle(p)
      await circleClick(p, 45)
    },
    done: '.g10-fb-ok',
  },
  {
    n: 6,
    // Eng tepa: tangens ko'rsatkichi uziladi. `snap` 90 da, shuning uchun
    // barmoq aniqligi yetadi.
    act: async (p) => { await waitCircle(p); await circleClick(p, 90) },
    done: '.g10-fb-ok',
  },
  // Ko'rsatish uch kadr: ikki ustun, aylanib chiqish, tangens ustuni.
  // Klaviaturani KUTAMIZ, aks holda skript ko'rsatish paytida bosib qoladi.
  { n: 7, act: async (p) => { await waitKeys(p); return typeNumber(p, ['1', ',', '7', '3']) }, done: '.g10-entry-ok' },
  // Ikki variantning IKKISIDA ham «cos α» va «sin α» bor, shuning uchun
  // qidiruv satri qavsdan boshlanadi: `(cos α` faqat birinchisiga mos keladi.
  { n: 8, act: async (p) => clickText(p, '(cos α'), done: '.g10-rule' },
  {
    n: 9,
    // Jadval kataklari tartib bilan to'ladi: 0° (1; 0), 90° (0; 1), 180° (−1; 0).
    act: async (p) => {
      for (const c of ['1', '0', '0', '1', '−1', '0']) await clickChip(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 10,
    act: async (p) => {
      for (const c of ['(−1/2', 'не ноль', 'ординату на', '−√3']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await typeNumber(p, ['0'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      // O'SISH tartibi: −1, 0, 1/2, 1.
      for (const c of ['cos 180', 'cos 90', 'cos 60', 'cos 0']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, 'tg 90°')
      await p.waitForTimeout(1200)
      await typeNumber(p, ['1', '0'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitCircle(p)
      await circleClick(p, 150)
      await p.waitForTimeout(2200)
      await waitReady(p)
      // `tg α = −√3/3` va `tg α = −√3` -- birinchisi ikkinchisini O'Z ICHIGA
      // oladi, shuning uchun qidiruv satri `√3/3`.
      for (const c of ['cos α = −√3/2', 'sin α = 1/2', '√3/3']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['−1', 'отрицательна', 'ординату на', '90°']) { await clickText(p, a); await p.waitForTimeout(1700) }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 4-dars: ISHORALAR VA QIYMATLAR. Bosishlar chorak bo'yicha boradi: har
// tushuntirish ekranida kerakli chorakdagi nuqta qo'yiladi.
PLANS.dars04 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      for (const a of ['сдвиг', 'не больше единицы', 'против часовой']) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  // Siljish manfiy, balandlik musbat -- ikkinchi chorak.
  { n: 3, act: async (p) => { await waitCircle(p); await circleClick(p, 120) }, done: '.g10-fb-ok' },
  // Uchinchi chorak: ikkisi ham manfiy.
  { n: 4, act: async (p) => { await waitCircle(p); await circleClick(p, 210) }, done: '.g10-fb-ok' },
  // Tangens manfiy: ishoralar har xil.
  { n: 5, act: async (p) => { await waitCircle(p); await circleClick(p, 130) }, done: '.g10-fb-ok' },
  { n: 6, act: async (p) => { await waitCircle(p); await circleClick(p, 200) }, done: '.g10-fb-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeNumber(p, ['−', '1']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'посмотреть направление'), done: '.g10-rule' },
  {
    n: 9,
    // Jadval: 40° (+;+), 130° (−;+), 200° (−;−), 320° (+;−).
    act: async (p) => {
      for (const c of ['+', '+', '−', '+', '−', '−', '+', '−']) await clickChip(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 10,
    act: async (p) => {
      for (const c of ['210° = 180', 'третья четверть', 'знаки одинаковы', 'tg 30°']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeNumber(p, ['0'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      for (const c of ['sin 270', 'sin 200', 'sin 0', 'sin 30']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, 'sin(180')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeNumber(p, ['−', '0', ',', '3', '4'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitCircle(p)
      await circleClick(p, 210)
      await p.waitForTimeout(2200)
      await waitReady(p)
      for (const c of ['cos α < 0', 'sin α < 0', 'tg α > 0']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['отрицателен', 'в третьей', 'сравнить два знака', 'положителен']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 5-dars: JUFTLIK VA DAVR. Manfiy burchaklar bosiladi: 360 dan ayirib
// olingan joyga bosamiz, chunki chizma 0 dan 360 gacha sanaydi.
PLANS.dars05 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      for (const a of ['против часовой', 'одна вторая', 'триста шестьдесят']) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  // Minus oltmish = 300 gradus.
  { n: 3, act: async (p) => { await waitCircle(p); await circleClick(p, 300) }, done: '.g10-fb-ok' },
  // Minus o'ttiz = 330 gradus, xukdagi burchakning o'zi.
  { n: 4, act: async (p) => { await waitCircle(p); await circleClick(p, 330) }, done: '.g10-fb-ok' },
  // 390 gradus = 30 gradus.
  { n: 5, act: async (p) => { await waitCircle(p); await circleClick(p, 30) }, done: '.g10-fb-ok' },
  // 780 gradus = 60 gradus.
  { n: 6, act: async (p) => { await waitCircle(p); await circleClick(p, 60) }, done: '.g10-fb-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeNumber(p, ['1', '8', '0']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'косинус'), done: '.g10-rule' },
  {
    n: 9,
    // Jadval: 30 (√3/2; 1/2), −30 (√3/2; −1/2), 210 (−√3/2; −1/2).
    act: async (p) => {
      for (const c of ['√3/2', '1/2', '√3/2', '−1/2', '−√3/2', '−1/2']) await clickChip(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 10,
    act: async (p) => {
      for (const c of ['−390°', 'отбросить полный оборот', 'синус нечётный', 'sin(−30°)']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeNumber(p, ['−', '1'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      for (const c of ['sin(−90°)', 'sin(−30°)', 'sin 0', 'sin 30°']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, '= −cos 120°')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeNumber(p, ['−', '0', ',', '5'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitCircle(p)
      await circleClick(p, 30)
      await p.waitForTimeout(2200)
      await waitReady(p)
      for (const c of ['390°', '−330°', '750°']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['минус одна вторая', { text: 'одна вторая', not: 'минус' }, 'целое число оборотов', 'сто восемьдесят']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

PLANS.dars06 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      // «косинус угла» ичида «синус угла» bor: to'liqsiz qidiruv NOTO'G'RIga tushadi.
      for (const a of [{ text: 'синус угла', not: 'косинус' }, 'триста шестьдесят', 'не больше единицы']) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  // To'lqinning cho'qqisi = aylananing tepasi.
  { n: 3, act: async (p) => { await waitCircle(p); await circleClick(p, 90) }, done: '.g10-fb-ok' },
  // Chuqurlik = aylananing pasti.
  { n: 4, act: async (p) => { await waitCircle(p); await circleClick(p, 270) }, done: '.g10-fb-ok' },
  // Kosinusda sanoq tepadan boshlanadi.
  { n: 5, act: async (p) => { await waitCircle(p); await circleClick(p, 90) }, done: '.g10-fb-ok' },
  // To'lqin sanoq boshida yopiladi.
  { n: 6, act: async (p) => { await waitCircle(p); await circleClick(p, 0) }, done: '.g10-fb-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeNumber(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'из высоты'), done: '.g10-rule' },
  {
    n: 9,
    // Burchak -> to'lqindagi joy. Chap ustun AYNAN taqqoslanadi (`0°` qismi
    // `180°` va `270°` ichida ham bor).
    act: async (p) => {
      const pairs = [['0°', 'вверх'], ['90°', 'вершина'], ['180°', 'вниз'], ['270°', 'впадина']]
      for (const [l, r] of pairs) {
        await clickText(p, { text: l, exact: true })
        await clickText(p, r)
        await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['по кругу', 'вправо', 'отмечены', 'соединены']) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeNumber(p, ['9', '0'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      for (const c of ['sin 270°', 'sin 210°', 'sin 0', 'sin 90°']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, 'cos 0 = 0')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeNumber(p, ['1'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitCircle(p)
      await circleClick(p, 90)
      await p.waitForTimeout(2200)
      await waitReady(p)
      // «Otmetь vse» tugmalari `○` belgisi bilan chiqadi, ya'ni to'liq
      // taqqoslash bu yerda ISHLAMAYDI. `90°` esa qism sifatida ham yagona.
      for (const c of ['90°', '450°', '−270°']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      // «с минус единицы» ичида «с единицы» bor -- 5-darsdagi o'sha tuzoq.
      for (const a of ['высота точки', { text: 'с единицы', not: 'минус' }, 'посмотреть', 'полный оборот']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 8-dars: ARKFUNKSIYALAR. Chap ustunda yozuvlar, o'ngda burchaklar -- ikkala
// ustun ham formula, shuning uchun to'liq taqqoslash ishlaydi.
PLANS.dars08 = [
  { n: 1, act: async (p) => clickText(p, 'перв'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      // «от нуля до единицы» ichida ham «до единицы» bor.
      for (const a of ['высота, второе', 'по результату', 'от минус единицы']) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  // Ikkinchi nuqta: o'sha balandlik, chap tomonda.
  { n: 3, act: async (p) => { await waitCircle(p); await circleClick(p, 150) }, done: '.g10-fb-ok' },
  // Oynadagi nuqta.
  { n: 4, act: async (p) => { await waitCircle(p); await circleClick(p, 30) }, done: '.g10-fb-ok' },
  { n: 5, act: async (p) => { await waitKeys(p); return typeNumber(p, ['3', '0']) }, done: '.g10-entry-ok' },
  // Arkkosinus oynasi: yuqoridagi nuqta.
  { n: 6, act: async (p) => { await waitCircle(p); await circleClick(p, 60) }, done: '.g10-fb-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeNumber(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'из окна'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const pairs = [
        ['arcsin 1/2', '30°'],
        ['arcsin(−1/2)', '−30°'],
        ['arccos 1/2', '60°'],
        ['arccos(−1/2)', '120°'],
      ]
      for (const pr of pairs) {
        await clickText(p, { text: pr[0], exact: true })
        await clickText(p, { text: pr[1], exact: true })
        await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['высота равна', 'обе точки', 'в окне', 'ответ минус']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeNumber(p, ['1', '2', '0'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      for (const c of ['arcsin(−1/2)', 'arcsin 0', 'arcsin 1/2', 'arccos 0']) {
        await clickText(p, { text: c, exact: true })
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, '= 210°')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeNumber(p, ['−', '3', '0'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitCircle(p)
      await circleClick(p, 150)
      await p.waitForTimeout(2200)
      await waitReady(p)
      // «отметь все» tugmalari `○` bilan chiqadi: qism bo'yicha qidiramiz.
      for (const c of [{ text: '30°', not: '−' }, '−30°', '90°']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const answers = [
        { text: 'тридцать градусов', not: 'минус' },
        { text: 'девяносто градусов', not: 'минус' },
        'из окна',
        // Variant tugmasida BELGI ham bor (А, Б, В, Г), shuning uchun to'liq
        // taqqoslash bu yerda hech qachon mos kelmaydi -- faqat qism.
        'нет',
      ]
      for (const a of answers) { await clickText(p, a); await p.waitForTimeout(1700) }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 9-dars: SODDA TENGLAMALAR. Moslashtirishda ikkala ustun ham formula, va
// `360°n` boshqa yozuvlarning ICHIDA ham bor -- to'liq taqqoslash shart.
PLANS.dars09 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      for (const a of ['две', 'целое число оборотов', 'из окна']) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  // Ikkinchi ildiz: o'sha balandlik, chapda.
  { n: 3, act: async (p) => { await waitCircle(p); await circleClick(p, 150) }, done: '.g10-fb-ok' },
  // 750 gradus = 30 gradus.
  { n: 4, act: async (p) => { await waitCircle(p); await circleClick(p, 30) }, done: '.g10-fb-ok' },
  // n = -1 ham o'sha nuqtaga olib keladi.
  { n: 5, act: async (p) => { await waitCircle(p); await circleClick(p, 30) }, done: '.g10-fb-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeNumber(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeNumber(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'перечисляет'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const pairs = [
        ['sin x = 1', '90° + 360°n'],
        ['sin x = 0', '180°n'],
        ['cos x = 1', '360°n'],
        ['cos x = −1', '180° + 360°n'],
      ]
      for (const pr of pairs) {
        await clickText(p, { text: pr[0], exact: true })
        await clickText(p, { text: pr[1], exact: true })
        await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['по высоте', 'обе точки', 'обороты', 'две серии']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeNumber(p, ['3', '9', '0'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      for (const c of ['n = −1', 'n = 0', 'n = 1', 'n = 2']) {
        await clickText(p, { text: c, exact: true })
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, '360°n')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeNumber(p, ['2'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitCircle(p)
      await circleClick(p, 150)
      await p.waitForTimeout(2200)
      await waitReady(p)
      for (const c of ['510°', '−210°', '870°']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['два', 'целое число', 'ни одного', 'две']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 10-dars: sin x = a. Nuqta ikki joy orasida almashadi, shuning uchun 4 va 5
// ekranlarda bosiladigan joy har xil.
PLANS.dars10 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      for (const a of ['две', { text: 'единице', not: 'минус' }, 'из окна']) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitCircle(p); await circleClick(p, 150) }, done: '.g10-fb-ok' },
  // n = 1 -> 150 gradus.
  { n: 4, act: async (p) => { await waitCircle(p); await circleClick(p, 150) }, done: '.g10-fb-ok' },
  // n = 2 -> 390 = 30 gradus.
  { n: 5, act: async (p) => { await waitCircle(p); await circleClick(p, 30) }, done: '.g10-fb-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeNumber(p, ['1', '8', '0']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeNumber(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'переключает'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const pairs = [['n = 0', '30°'], ['n = 1', '150°'], ['n = 2', '390°'], ['n = 3', '510°']]
      for (const pr of pairs) {
        await clickText(p, { text: pr[0], exact: true })
        await clickText(p, { text: pr[1], exact: true })
        await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['угол в окне', 'вторую точку', 'через знак', 'шаг ставим']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeNumber(p, ['1', '5', '0'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      for (const c of ['n = 0', 'n = 1', 'n = 2', 'n = 3']) {
        await clickText(p, { text: c, exact: true })
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, '360°n')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeNumber(p, ['1', '8', '0'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitCircle(p)
      await circleClick(p, 150)
      await p.waitForTimeout(2200)
      await waitReady(p)
      for (const c of ['n = 1', 'n = 3', 'n = −1']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['переключает', 'сто восемьдесят', 'в первую', 'одна']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 7-dars: FUNKSIYALAR. Sinfda AYLANA yo'q bitta dars: hamma javob son yoki
// tanlov, nuqta qo'yish yo'q.
PLANS.dars07 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      for (const a of ['по горизонтали', 'от минус единицы', 'при любых']) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitKeys(p); return typeNumber(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await waitKeys(p); return typeNumber(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 5, act: async (p) => { await waitKeys(p); return typeNumber(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeNumber(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeNumber(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'горизонтальной'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      // Yorliqlar `Fx` orqali chiziladi, shuning uchun to'liq taqqoslashga
      // tayanmaymiz: qism va `not` yetadi.
      const pairs = [
        [{ text: 'y = sin x', not: '+' }, '[−1; 1]'],
        ['2 sin x', '[−2; 2]'],
        [{ text: 'y = x', not: 'sin' }, '(−∞'],
        ['sin x + 3', '[2; 4]'],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0])
        await clickText(p, pr[1])
        await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['горизонтальная', 'область', 'вертикальная', 'множество']) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeNumber(p, ['2'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      for (const c of ['0,5 sin x', 'sin x', '2 sin x', '3 sin x']) {
        await clickText(p, { text: c, exact: true })
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, 'D(y) = [−1; 1]')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeNumber(p, ['1'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitReady(p)
      for (const c of [{ text: 'y = sin x', not: '2' }, 'y = 2 sin x', 'y = cos x']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['по горизонтали', 'ровно один', 'отрезок', 'нет']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 11-dars: cos x = a. Nuqtalar bir-birining ostida: 60 va 300 gradus.
PLANS.dars11 = [
  { n: 1, act: async (p) => clickText(p, 'перв'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      for (const a of ['вертикальная', 'от нуля до ста', 'целое число оборотов']) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitCircle(p); await circleClick(p, 300) }, done: '.g10-fb-ok' },
  { n: 4, act: async (p) => { await waitCircle(p); await circleClick(p, 300) }, done: '.g10-fb-ok' },
  { n: 5, act: async (p) => { await waitCircle(p); await circleClick(p, 60) }, done: '.g10-fb-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeNumber(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeNumber(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'симметричны'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const pairs = [
        ['cos x = 1/2', '± 60° + 360°n'],
        [{ text: 'cos x = 1', not: '/' }, '360°n'],
        ['cos x = −1', '180° + 360°n'],
        ['cos x = 0', '± 90° + 360°n'],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0])
        await clickText(p, { text: pr[1], exact: true })
        await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['проводим вертикаль', 'угол в окне', 'знак плюс-минус', 'прибавляем обороты']) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeNumber(p, ['4', '2', '0'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      for (const c of ['−60°', { text: '60°', not: '−' }, '300°', '420°']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, '60° + 360°n')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeNumber(p, ['2'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitCircle(p)
      await circleClick(p, 300)
      await p.waitForTimeout(2200)
      await waitReady(p)
      for (const c of ['−60°', '660°', '−420°']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of [{ text: 'плюс-минус', not: 'только' }, 'триста шестьдесят', 'одна', 'ни одного']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

const PLAN = PLANS[LESSON]

const browser = await chromium.launch({ headless: true })
for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  // Brauzer konsoli yuklanmagan resursning MANZILINI bermaydi: xabar «Failed to
  // load resource: 404» bo'lib qoladi va u bilan hech narsa qilib bo'lmaydi --
  // qaysi fayl, qaysi ekran, nima uchun. Shu sababli manzilni O'ZIMIZ yozamiz
  // (2026-08-13 da shu xabarga ikki marta vaqt ketdi).
  // ЧУЖИЕ шрифты — не ошибка урока.
  //
  // 2026-08-13: проверка писала «консоль не чиста, 404» без адреса, и я сперва
  // объяснил это пересборкой под запущенным сервером. Диагноз оказался НЕВЕРЕН.
  // Когда проверка стала печатать адрес, выяснилось: это `fonts.gstatic.com`,
  // woff2 для Source Serif 4. С обычным Chrome те же файлы отдают 200 — Google
  // выдаёт headless-браузеру CSS со ссылками, которые у него же и 404. То есть
  // это артефакт ПРОВЕРКИ, а не урока, и ученик этого не видит.
  //
  // Поэтому такие запросы уходят в отдельную заметку, а не в ошибки урока:
  // молчать о них нельзя (шрифт может действительно не загрузиться), но и
  // валить из-за них урок неправильно.
  const thirdParty = []
  page.on('response', (r) => {
    if (r.status() < 400) return
    const u = r.url()
    if (/fonts\.(gstatic|googleapis)\.com/.test(u)) { thirdParty.push(r.status() + ' ' + u.slice(-40)); return }
    errs.push('HTTP ' + r.status() + ' -> ' + u)
  })
  page.on('requestfailed', (r) => {
    const why = (r.failure() || {}).errorText || ''
    if (why.indexOf('ERR_NETWORK') === -1 && why.indexOf('ERR_ABORTED') === -1) {
      errs.push('SO\'ROV UZILDI -> ' + r.url() + '  ' + why)
    }
  })
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    const text = m.text()
    // Resurs xatosi manzil bilan YUQORIDA yozildi, bu esa uning takrori.
    if (text.includes('ERR_NETWORK') || text.includes('Failed to load resource')) return
    errs.push(text)
  })
  await page.goto(BASE + '?g10fast=1&lang=ru', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('.stage-content', { timeout: 60000 })
  await page.waitForTimeout(900)

  for (const step of PLAN) {
    await waitReady(page)
    await step.act(page)
    await page.waitForTimeout(1000)
    const solved = await has(page, step.done)
    // o'lchov: FINAL holatda skroll va obrezka
    const m = await page.evaluate(() => {
      const c = document.querySelector('.stage-content')
      const svg = document.querySelector('.g10-circle')
      const clipped = Array.from(document.querySelectorAll('.lesson-root *'))
        .map((el) => {
          const cs = getComputedStyle(el)
          // Ataylab yig'ilgan element (javobdan keyin so'nadigan variant)
          // obrezka EMAS: u ko'rinmaydi va o'quvchi hech narsa yo'qotmaydi.
          if (el.clientHeight === 0 || cs.opacity === '0' || cs.maxHeight === '0px') return null
          const cy = cs.overflowY === 'hidden' || cs.overflowY === 'clip'
          const cx = cs.overflowX === 'hidden' || cs.overflowX === 'clip'
          const dy = cy ? el.scrollHeight - el.clientHeight : 0
          const dx = cx ? el.scrollWidth - el.clientWidth : 0
          return dy > 2 || dx > 2 ? String(el.className).slice(0, 30) + (dy ? ' +' + dy + 'h' : '') + (dx ? ' +' + dx + 'w' : '') : null
        })
        .filter(Boolean)
      return {
        over: c ? c.scrollHeight - c.clientHeight : 0,
        svg: svg ? Math.round(svg.getBoundingClientRect().width) : 0,
        clipped,
      }
    })
    const flag = solved ? 'OK ' : 'NET'
    console.log(`${vp.name} ekran ${String(step.n).padStart(2)} ${flag} chizma ${String(m.svg).padStart(3)} oshish ${m.over}${m.clipped.length ? '  OBREZKA: ' + m.clipped.join(' | ') : ''}`)
    if (!solved) problems.push(`${vp.name} ekran ${step.n}: qo'l bilan yechilmadi`)
    if (m.over > 1) {
      problems.push(`${vp.name} ekran ${step.n}: kontent ${m.over}px oshdi`)
      // NIMA joy egallaganini DARHOL aytamiz. Aks holda «40 px oshdi» degan son
      // bilan qolamiz va har safar alohida o'lchagich yozishga to'g'ri keladi --
      // shu bilan yarim kun ketgan edi (2026-08-12).
      const parts = await page.evaluate(() => {
        const c = document.querySelector('.stage-content')
        const out = []
        const walk = (el, depth) => {
          for (const ch of el.children) {
            const h = Math.round(ch.getBoundingClientRect().height)
            if (h > 14) out.push('  '.repeat(depth) + String(ch.className).slice(0, 28) + ' ' + h)
            if (depth < 5) walk(ch, depth + 1)
          }
        }
        if (c) walk(c, 0)
        return out
      })
      problems.push(`${vp.name} ekran ${step.n}: tarkibi ->\n      ${parts.join('\n      ')}`)
    }
    if (m.clipped.length) problems.push(`${vp.name} ekran ${step.n}: obrezka ${m.clipped.join(' | ')}`)
    if (step.n < 15) {
      await page.evaluate(() => {
        const nav = document.querySelector('.stage-nav')
        const bs = nav ? Array.from(nav.querySelectorAll('button')).filter((b) => !b.disabled) : []
        if (bs.length) bs[bs.length - 1].click()
      })
      await page.waitForTimeout(420)
    }
  }
  if (errs.length) problems.push(`${vp.name}: konsol -> ${errs.slice(0, 3).join(' | ')}`)
  // Chet shriftlar: nuqson emas, lekin JIM ham qolmaydi.
  if (thirdParty.length) {
    console.log(`  ${vp.name}: chet shrift so'rovi yiqildi (darsning nuqsoni emas) -> ${thirdParty[0]}`)
  }
  await page.close()
}
await browser.close()

if (problems.length) {
  console.log('\nMUAMMOLAR: ' + problems.length)
  problems.forEach((p) => console.log('  ' + p))
  process.exitCode = 1
} else {
  console.log('\nOK: dars qo\'l bilan to\'liq o\'tiladi, skroll va obrezka yo\'q.')
}
