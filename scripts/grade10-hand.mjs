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
  dars12: 'dars12-tg-x-a',
  dars13: 'dars13-usullar',
  dars26: 'dars26-daraja',
  dars27: 'dars27-korsatkichli-funksiya',
  dars28: 'dars28-korsatkichli-tenglamalar',
  dars29: 'dars29-logarifm',
  dars30: 'dars30-logarifmik-funksiya',
  dars31: 'dars31-logarifmik-tenglamalar',
  dars32: 'dars32-irratsional-tenglamalar',
  dars33: 'dars33-ratsional-tengsizliklar',
  dars34: 'dars34-logarifmik-ifodalar',
  dars35: 'dars35-korsatkichli-logarifmik-tengsizliklar',
  dars36: 'dars36-trigonometrik-tengsizliklar',
  dars41: 'dars41-ogma-va-uch-perpendikulyar',
  dars42: 'dars42-chiziq-va-tekislik-burchagi',
  dars43: 'dars43-ikki-yoqli-burchak',
  dars44: 'dars44-prizma',
  dars45: 'dars45-parallelepiped',
  dars46: 'dars46-piramida',
  dars47: 'dars47-sirt-yuzasi',
  dars48: 'dars48-muntazam-jismlar',
  dars49: 'dars49-kesimlarni-yasash',
  dars50: 'dars50-fazoda-koordinatalar',
  dars37: 'dars37-ehtimolliklar-nazariyasi',
  dars38: 'dars38-stereometriya-aksiomalari',
  dars39: 'dars39-ayqash-togri-chiziqlar',
  dars40: 'dars40-perpendikulyar-chiziq-tekislik',
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
//
// `scope` NIMA UCHUN kerak: TELEFONDA progress qatori `.stage-content` ichida
// chiziladi, va uning nuqtalari ham TUGMA. 13-darsning moslashtirishida javob
// chiplari bir xonali son (`2`, `3`), va to'liq taqqoslash progress nuqtasini
// bosardi -- desktopda o'sha reja o'tardi, telefonda esa yo'q. `scope` bilan
// qidiruv faqat javob tugmalari ichida boradi.
async function clickText(page, text) {
  const spec = typeof text === 'string' ? { text, not: null, exact: false } : text
  const ok = await page.evaluate(({ needle, avoid, whole, within }) => {
    const nodes = Array.from(document.querySelectorAll(within || '.stage-content button'))
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
  }, { needle: spec.text, avoid: spec.not, whole: !!spec.exact, within: spec.scope || null })
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

// SON KLAVIATURA TUGMALARI bilan yoziladi, boshqa tugmalar bilan emas.
//
// `typeNumber` raqamni HAR QANDAY tugmada qidiradi, va 5-blokda bu xato beradi:
// variantlar ham, tartib chiplari ham, progress nuqtalari ham bir xonali son
// bo'lishi mumkin. Bu yerda qidiruv FAQAT `.g10-key` ichida.
async function typeKeys(page, digits) {
  for (const ch of digits) {
    const ok = await clickText(page, { text: ch, exact: true, scope: '.stage-content .g10-key' })
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

// 12-dars: tg x = a. Qarama-qarshi nuqtalar: 45 va 225 gradus.
PLANS.dars12 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      for (const a of ['высота, делённая', 'при девяноста', 'целое число оборотов']) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitCircle(p); await circleClick(p, 45) }, done: '.g10-fb-ok' },
  { n: 4, act: async (p) => { await waitCircle(p); await circleClick(p, 225) }, done: '.g10-fb-ok' },
  { n: 5, act: async (p) => { await waitCircle(p); await circleClick(p, 45) }, done: '.g10-fb-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeNumber(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeNumber(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'противоположные'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const pairs = [
        [{ text: 'tg x = 1', not: '−' }, '45° + 180°n'],
        ['tg x = 0', '180°n'],
        ['tg x = −1', '−45° + 180°n'],
        ['tg x = √3', '60° + 180°n'],
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
      for (const c of ['значение на линии', 'через центр', 'угол из окна', 'шаг сто']) {
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
      await typeNumber(p, ['4', '0', '5'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      for (const c of ['n = −1', 'n = 0', 'n = 1', 'n = 2']) await clickText(p, { text: c, exact: true })
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
      await circleClick(p, 225)
      await p.waitForTimeout(2200)
      await waitReady(p)
      for (const c of [{ text: '45°', not: '−' }, '405°', '−135°']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['сто восемьдесят', 'одна', 'при девяноста', 'бесконечно много']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 13-dars: USULLAR. To'rt ildiz: 90 va 270 (kosinusdan), 30 va 150 (sinusdan).
PLANS.dars13 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      for (const a of ['хотя бы один', 'девяносто и', 'от минус единицы']) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitCircle(p); await circleClick(p, 90) }, done: '.g10-fb-ok' },
  { n: 4, act: async (p) => { await waitCircle(p); await circleClick(p, 270) }, done: '.g10-fb-ok' },
  { n: 5, act: async (p) => { await waitCircle(p); await circleClick(p, 90) }, done: '.g10-fb-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeNumber(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeNumber(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'были корни'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      // Yorliqlar `Fx` orqali chiziladi -- qism bo'yicha qidiramiz.
      // O'ng ustun bir xonali son: qidiruv FAQAT javob tugmalari ichida.
      const num = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      const pairs = [
        [{ text: 'sin x cos x', not: '2' }, num('2')],
        ['2 sin x cos x', num('3')],
        ['sin x = −1', num('1')],
        ['sin x = 2', num('0')],
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
      for (const c of ['в одну часть', 'выносим', 'два простейших', 'обе серии']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeNumber(p, ['3'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      for (const c of ['30°', { text: '90°', not: '2' }, '150°', '270°']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, '2 sin x = 1')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeNumber(p, ['3'])
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
      for (const c of [{ text: '90°', not: '4' }, '270°', '450°']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['выносят', 'где косинус равен нулю', 'проверяют границы', 'две']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// ===========================================================================
// 5-BLOK. Aylana bu darslarda YO'Q: 26-darsda polosa va yozuv, 27 va 28-darsda
// koordinata tekisligi. Shuning uchun `circleClick` ishlatilmaydi umuman.
//
// FORMULA YORLIQLARI `Fx` orqali chiziladi, va tugmaning matni MANBA satriga
// teng emas: `8^{1/3}` ekranda «81/3» bo'lib chiqadi, `2^{−3}` esa «2−3».
// Shuning uchun formulalar KESIM bilan qidiriladi, aniq tenglik bilan esa
// faqat bir xonali javob tugmalari (va ular `.g10-opt` ichida cheklangan --
// progress qatorining nuqtalari ham bir xonali son).
// ===========================================================================

// 26-dars: HAQIQIY KO'RSATKICHLI DARAJA.
PLANS.dars26 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('три'), o('два в пятой'), o('три')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  {
    n: 3,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['выписываем', 'ставим записи', 'считаем', 'складываем']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 4,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['основание дважды', 'раскрыть', 'шесть множителей', 'перемножены']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  { n: 5, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['6']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'положительное и не равное'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const num = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      const pairs = [['81/3', num('2')], ['2−3', num('1/8')], ['50', num('1')], ['91/2', num('3')]]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['умножить', 'стал целым', 'сложить', 'ноль даёт']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['4'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, scope: '.stage-content .g10-chip' })
      for (const c of ['2−2', '20', '21/2', '22']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, '2·1/2')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['2'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['−', '2'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      for (const c of ['3−2', '9−1']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['складывают', 'единица', 'корень', 'положительным']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 27-dars: KO'RSATKICHLI FUNKSIYA.
PLANS.dars27 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      // «одна восьмая» KESIM «минус одна восьмая» ichida ham bor.
      for (const a of [{ text: 'одна восьмая', not: 'минус' }, 'единица', 'корень']) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitKeys(p); return typeKeys(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 5, act: async (p) => { await waitKeys(p); return typeKeys(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'в показателе'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const num = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      const pairs = [
        ['y = 2x', num('1/2')], ['y = 4x', num('1/4')],
        ['y = 0,5x', num('2')], ['y = 0,25x', num('4')],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      const chip = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-chip' })
      for (const c of ['(−∞; +∞)', '(0; +∞)', '(0; 1)', '∅']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['2'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, scope: '.stage-content .g10-chip' })
      for (const c of ['0,52', '0,51', '0,50', '0,5−1']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, 'y ≥ 0')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['0'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['3'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      for (const c of [{ text: 'y = 2x', not: ',' }, 'y = 1,5x']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['в показателе', 'положительные', 'меньше единицы', 'абсцисса ноль']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 28-dars: KO'RSATKICHLI TENGLAMALAR.
PLANS.dars28 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      for (const a of ['два в трет', 'никогда', 'вверх и не']) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  {
    n: 4,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['правую часть', 'слева и справа', 'сравниваем', 'получаем корень']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 5,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['оба основания', 'приравниваем', 'решаем обычное', 'корень один']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'монотонна'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const num = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      const pairs = [
        ['2x = 32', num('5')], ['3x = 1/3', num('−1')],
        ['5x = 1', num('0')], ['4x = 2', num('1/2')],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['девять это', 'раскрыть', 'приравнять', 'получить корень']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['−', '3'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t, not) => ({ text: t, not, scope: '.stage-content .g10-chip' })
      // «2x = 1» KESIM «2x = 1/4» ichida ham bor: kasrni chetlab o'tamiz.
      for (const c of [chip('2x = 1/4'), chip('2x = 1', '/'), chip('2x = 2'), chip('2x = 8')]) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, 'x = 2')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['0'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['1', '2', '5'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      for (const c of ['2x = 4', '9x = 81']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['приравнивают', 'один', 'ни одного', 'положительно']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 29-dars: LOGARIFM. Logarifm yangi amal emas -- bu o'sha ko'rsatkich.
PLANS.dars29 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t, not) => ({ text: t, not, scope: '.stage-content .g10-opt' })
      for (const a of [o('два в трет'), o('три', 'четыре'), o('складывают')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitKeys(p); return typeKeys(p, ['5']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1', '/', '3']) }, done: '.g10-entry-ok' },
  {
    n: 5,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['множители как', 'показатели сложить', 'показатель это', 'логарифмы сложить']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['3']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'показатели складываются'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const num = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      const pairs = [['log2 32', num('5')], ['log3 9', num('2')], ['log8 2', num('1/3')], ['log2 1', num('0')]]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['разность в частное', 'посчитать частное', 'восемь это', 'ответ три']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['5'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-chip' })
      for (const c of ['log2 1', 'log2 2', 'log2 8', 'log2 32']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      // Строки AuditRows рисуются БЕЗ Fx: нижний индекс остаётся
      // символом, а не тегом. В чипах и вариантах — наоборот.
      await clickText(p, 'log₂ 4 + log₂ 4')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['3'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['1', '2', '5'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      for (const c of ['log3 9', 'log5 25']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['показатель степени', 'сумме логарифмов', 'только положительное', 'нулю']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 30-dars: LOGARIFMIK FUNKSIYA. Ko'rsatkichlining aksi.
PLANS.dars30 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t, not) => ({ text: t, not, scope: '.stage-content .g10-opt' })
      for (const a of [o('три', 'одна'), o('нулю'), o('только положительное')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitKeys(p); return typeKeys(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await waitKeys(p); return typeKeys(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 5, act: async (p) => { await waitKeys(p); return typeKeys(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['−', '3']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'поменялись местами'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const num = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      const pairs = [
        ['y = log2 x', num('2')], ['y = log4 x', num('1')],
        ['y = log0,5 x', num('−2')], ['y = log0,25 x', num('−1')],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      const chip = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-chip' })
      for (const c of ['(0; +∞)', '(−∞; +∞)', '(1; 0)', '∅']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['1'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-chip' })
      for (const c of ['log2 1', 'log2 4', 'log2 8', 'log2 16']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      // Строка AuditRows начинается с номера, точное сравнение не годится.
      await clickText(p, 'x ≥ 0')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['0'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['3'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      for (const c of ['y = log0,5 x', 'y = log0,3 x']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['положительные числа', 'все числа', 'абсцисса один', 'меньше единицы']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 31-dars: LOGARIFMIK TENGLAMALAR. Polosa yechimdan OLDIN chiziladi.
PLANS.dars31 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t, not) => ({ text: t, not, scope: '.stage-content .g10-opt' })
      for (const a of [o('логарифму произведения'), o('только положительное'), o('три', 'одна')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  {
    n: 4,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['условие для каждого', 'взять более строгое', 'закрасить', 'потом решать']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 5,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['свернуть сумму', 'справа тоже', 'снять знаки', 'решить обычное']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'не был допустимым'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const num = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      const pairs = [
        ['log2 x = 3', num('8')], ['log2 (x − 5) = 1', num('7')],
        ['lg (2x − 2)', num('4')], ['log3 x = 0', num('1')],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['начертить полосу', 'снять знаки', 'решить обычное', 'проверить по полосе']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['9'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t, not) => ({ text: t, not, scope: '.stage-content .g10-chip' })
      for (const c of [chip('log2 x', '('), chip('log2 (x − 1)'), chip('log2 (x − 5)'), chip('log2 (x − 9)')]) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      // Двойной пробел в разметке схлопывается в один.
      await clickText(p, 'x = 1; x = −3')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['−', '3'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['5'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      // «Отметь все» идёт с кружком в начале: точное сравнение там не работает.
      // Ноль ищется с оговоркой: «0» есть и внутри «10».
      const opt = (t, not) => ({ text: t, not, scope: '.stage-content .g10-opt' })
      for (const c of [opt('5'), opt('0', '1')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['до первого преобразования', 'не был допустимым', 'икс больше двух', 'основания совпали']) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 32-dars: IRRATSIONAL TENGLAMALAR. Ko'tarish yechim qo'shadi.
PLANS.dars32 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t, not) => ({ text: t, not, scope: '.stage-content .g10-opt' })
      for (const a of [o('самому числу'), o('неотрицательным'), o('его в исходное')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitKeys(p); return typeKeys(p, ['0']) }, done: '.g10-entry-ok' },
  {
    n: 4,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['равенство неверно', 'возводим в квадрат', 'стало верным', 'решений стало больше']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  { n: 5, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['5']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'отсеивает'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const num = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      const pairs = [
        ['+ 6) = x', num('3')], ['+ 3) = 2', num('1')],
        ['2x − 1', num('5')], ['x − 4', num('4')],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['выписать условие', 'возвести в квадрат', 'решить квадратное', 'проверить оба числа']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['2', '7'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, scope: '.stage-content .g10-chip' })
      for (const c of [chip('+ 7) = 1'), chip('+ 1) = 2'), chip('(2x) = 4'), chip('− 2) = 3')]) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      // Двойной пробел в разметке схлопывается в один.
      await clickText(p, 'x = 3; x = −2')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['−', '2'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['3'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const c of [opt('= −3'), opt('= −1')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t, not) => ({ text: t, not, scope: '.stage-content .g10-opt' })
      for (const a of [o('семь', 'корень'), o('никогда'), o('семь'), o('подставляют')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 33-dars: RATSIONAL TENGSIZLIKLAR. Javob -- o'q bo'laklari.
PLANS.dars33 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t, not) => ({ text: t, not, scope: '.stage-content .g10-opt' })
      for (const a of [o('знаменатель ноль'), o('плюс'), o('все числа')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitKeys(p); return typeKeys(p, ['3']) }, done: '.g10-entry-ok' },
  {
    n: 4,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['умножили на знаменатель', 'получили один кусок', 'взяли ноль из ответа', 'вышел минус']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  { n: 5, act: async (p) => { await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['3']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'перевернётся'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      const pairs = [
        ['x − 1)/(x − 3)', o('x < 1; x > 3')], ['(x + 2)/', o('−2 < x < 1')],
        ['1/(x − 4)', o('x > 4')], ['(x + 3)/x', o('−3 < x < 0')],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['найти нули', 'отметить на оси', 'расставить знаки', 'выбрать участки']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['3'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, scope: '.stage-content .g10-chip' })
      for (const c of [chip('(2; 4)'), chip('(0; 3)'), chip('(1; 5)'), chip('(−1; 7)')]) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, 'x + 1 > 0')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['0'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['2'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const c of [opt('−5'), opt('3')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('на три'), o('выкалывают'), o('четыре'), o('перевернуться')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 34-dars: LOGARIFMIK IFODALAR. Chizma yo'q -- shohid yozuvda.
PLANS.dars34 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t, not) => ({ text: t, not, scope: '.stage-content .g10-opt' })
      for (const a of [o('три', 'одна'), o('логарифму произведения'), o('нулю при любом')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitKeys(p); return typeKeys(p, ['9']) }, done: '.g10-entry-ok' },
  {
    n: 4,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['восемь в кубе', 'это пятьсот двенадцать', 'это два в девятой', 'логарифм равен девяти']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  { n: 5, act: async (p) => { await waitKeys(p); return typeKeys(p, ['−', '1']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['5']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'вперёд множителем'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const num = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      const pairs = [
        ['log2 32', num('5')], ['log3 9 + log3 3', num('3')],
        ['log5 125 − log5 25', num('1')], ['log2 4', num('6')],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['сумма в произведение', 'разность в частное', 'считаем под знаком', 'логарифм восьми']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['1'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, scope: '.stage-content .g10-chip' })
      for (const c of [chip('log7 7'), chip('log5 25'), chip('log2 8'), chip('log3 81')]) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      // AuditRows qatorlari `Fx` orqali chizilmaydi, pastki indeks belgi bo'lib qoladi.
      await clickText(p, 'log₂ 8 + log₂ 8')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['4'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['2', '0'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const c of [opt('(b·c)'), opt('p·log')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('единице'), o('вперёд множителем'), o('четыре'), o('логарифм числа')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 35-dars: KO'RSATKICHLI VA LOGARIFMIK TENGSIZLIKLAR. Javob -- tomon.
PLANS.dars35 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t, not) => ({ text: t, not, scope: '.stage-content .g10-opt' })
      for (const a of [o('убывает'), o('три', 'четыре'), o('только положительное')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  {
    n: 4,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['горизонталь встречает', 'встреча даёт число', 'где кривая ниже', 'берём эту сторону']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  { n: 5, act: async (p) => { await waitKeys(p); return typeKeys(p, ['−', '2']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['8']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'направления кривой'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      const pairs = [
        ['2x > 8', o('x > 3')], ['0,5x > 8', o('x < −3')],
        ['log2 x < 4', o('0 < x < 16')], ['log2 x > 0', o('x > 1')],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['начертить полосу', 'найти встречу', 'выбрать сторону', 'взять пересечение']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['2'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, scope: '.stage-content .g10-chip' })
      for (const c of [chip('5x = 5'), chip('3x = 9'), chip('2x = 8'), chip('2x = 16')]) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      // AuditRows qatorlari `Fx` orqali chizilmaydi.
      await clickText(p, { text: 'x > −2', exact: false, scope: '.stage-content button', not: '∈' })
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['0'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['5'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const c of [opt('0,5'), opt('0,2')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('границу ответа'), o('меньше единицы'), o('икс больше двух'), o('чертят полосу')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 36-dars: TRIGONOMETRIK TENGSIZLIKLAR. Javob -- yoy va uning aylanishlari.
PLANS.dars36 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t, not) => ({ text: t, not, scope: '.stage-content .g10-opt' })
      for (const a of [o('вертикальной'), o('минус одним'), o('триста шестьдесят')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await waitCircle(p); await circleClick(p, 30) }, done: '.g10-fb-ok' },
  { n: 4, act: async (p) => { await waitCircle(p); await circleClick(p, 150) }, done: '.g10-fb-ok' },
  { n: 5, act: async (p) => { await waitKeys(p); return typeKeys(p, ['3', '6', '0']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['2', '4', '0']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'границы дуги'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      const pairs = [
        ['sin x > 1/2', o('30°; 150°')], ['sin x > 0', o('0°; 180°')],
        ['sin x < −1/2', o('210°; 330°')], ['sin x > √2/2', o('45°; 135°')],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['провести прямую', 'найти две точки', 'взять дугу', 'добавить обороты']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['6', '0'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      // «1/2» kichik qism sifatida «−1/2» ichida ham bor: needle uzunroq olinadi.
      const chip = (t) => ({ text: t, scope: '.stage-content .g10-chip' })
      for (const c of [chip('√3/2'), chip('x > 1/2'), chip('x > 0'), chip('x > −1/2')]) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      // AuditRows qatorlari `Fx` orqali chizilmaydi.
      await clickText(p, 'sin x = 1/2')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['1', '2', '0'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['9', '0'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t) => ({ text: t, exact: false, scope: '.stage-content .g10-opt' })
      for (const c of [opt('90°'), opt('140°')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('дугой и её оборотами'), o('ни одного'), o('сто восемьдесят'), o('триста шестьдесят')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 37-dars: EHTIMOLLIK. PRIBOR 7 -- meshok isxodov.
PLANS.dars37 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('каждый отдельный'), o('нет причины'), o('какую часть')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  {
    n: 3,
    act: async (p) => {
      await waitReady(p)
      const o = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      // Kartochka yozuvi tilga qarab o'zgaradi, shuning uchun barcha uch tildagi
      // «har xil tomon» kartochkalari ro'yxatda turadi.
      for (const c of ['ГЧ', 'ЧГ', 'GR', 'RG', 'HT', 'TH']) {
        await clickText(p, { text: c, exact: false, scope: '.stage-content .g10-opt' })
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 4,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['выложить исходы', 'посчитать дробь', 'провести испытания', 'сравнить с дробью']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 5,
    act: async (p) => {
      await waitReady(p)
      // Urnada 12 kartochka: 9 tasi belgilanadi. Ular bir xil yozuvli, shuning
      // uchun tugmalar TARTIB bilan bosiladi, matn bilan emas.
      await p.evaluate(() => {
        const bs = Array.from(document.querySelectorAll('.stage-content .g10-opt'))
        bs.slice(0, 9).forEach((b) => b.click())
      })
      await p.waitForTimeout(400)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['6']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'до опыта'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const o = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      const pairs = [
        ['m = 3, n = 6', o('1/2')], ['m = 0, n = 10', o('0')],
        ['m = 20, n = 20', o('1')], ['m = 9, n = 12', o('3/4')],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['выложить исходы', 'объявить равновозможными', 'отметить благоприятные', 'записать отношение']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['9'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, scope: '.stage-content .g10-chip' })
      for (const c of [chip('m = 0, n = 5'), chip('m = 1, n = 4'), chip('m = 1, n = 2'), chip('m = 3, n = 4')]) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, 'P(A) = n/m')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['9'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['3'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t) => ({ text: t, exact: false, scope: '.stage-content .g10-opt' })
      for (const c of [opt('7'), opt('0')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('четыре'), o('узнать нельзя'), o('единице'), o('большом числе')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 38-dars: STEREOMETRIYA AKSIOMALARI. PRIBOR 6A -- fazoviy sahna.
// Sahnani burish tugmalari: javob faqat burilgandan keyin ochiladi.
const spinFirst = async (p) => {
  await waitReady(p)
  await clickText(p, { text: 'вправо', scope: '.stage-content button' })
  await p.waitForTimeout(700)
}

PLANS.dars38 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('пространственные'), o('не дают определения'), o('греческой')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  {
    n: 3,
    act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1']) },
    done: '.g10-entry-ok',
  },
  {
    n: 4,
    act: async (p) => {
      await spinFirst(p)
      return clickText(p, { text: 'бесконечно много', scope: '.stage-content .g10-opt' })
    },
    done: '.g10-fb-ok',
  },
  {
    n: 5,
    act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['2']) },
    done: '.g10-entry-ok',
  },
  {
    n: 6,
    act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1']) },
    done: '.g10-entry-ok',
  },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'не лежат на одной прямой'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const o = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      const pairs = [
        ['A, B, C ∉ a', o('1')], ['A, B, C ∈ a', o('∞')],
        ['A, B, C, D', o('4')], ['ABCDA', o('6')],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      // Isbot ustuni: har qatorga asoslash tanlanadi, ro'yxat aralashgan.
      for (const c of ['по построению', 'первая аксиома', 'вторая аксиома']) {
        await clickText(p, { text: c, scope: '.stage-content .g10-opt' })
        await p.waitForTimeout(700)
      }
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['4'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      // «A, B» qolgan uchtasining ICHIDA ham bor: aynan moslik kerak.
      const chip = (t) => ({ text: t, scope: '.stage-content .g10-chip' })
      for (const c of [chip('A, B, C ∉ a'), chip('A, B, C, D'), chip('ABCDA'), chip('A, B, C ∈ a')]) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, 'C ∈ a')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['2'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['2'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t, not) => ({ text: t, not, scope: '.stage-content .g10-opt' })
      for (const c of [opt('A, B, C ∉ a'), opt('a, C ∉ a')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('бесконечно много'), o('тоже в этой плоскости'), o('одна'), o('видно на чертеже')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 39-dars: AYQASH TO'G'RI CHIZIQLAR. Sahnani burish -- shohid.
PLANS.dars39 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t, not) => ({ text: t, not, scope: '.stage-content .g10-opt' })
      for (const a of [o('одна', 'бесконечно'), o('в одной плоскости'), o('общая прямая')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  {
    n: 3,
    act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['0']) },
    done: '.g10-entry-ok',
  },
  {
    n: 4,
    act: async (p) => {
      await spinFirst(p)
      return clickText(p, { text: 'нет общей плоскости', scope: '.stage-content .g10-opt' })
    },
    done: '.g10-fb-ok',
  },
  { n: 5, act: async (p) => { await waitKeys(p); return typeKeys(p, ['3']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['4']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['9', '0']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'нет плоскости'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const o = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      const pairs = [
        ['AB ∸ ?', o('4')], ['AB ∥ ?', o('3')],
        ['AB ∩ CC', o('0')], ['ABCDA', o('12')],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['по построению куба', 'вторая аксиома', 'признак скрещивающихся']) {
        await clickText(p, { text: c, scope: '.stage-content .g10-opt' })
        await p.waitForTimeout(700)
      }
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['4'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, scope: '.stage-content .g10-chip' })
      for (const c of [chip('AB ∩ CC'), chip('AB ∥ ?'), chip('AB ∸ ?'), chip('ABCDA')]) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, 'AB ∥ B')
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['0'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['0'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const c of [opt('AB, B1C1'), opt('AB, CC1')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t, not) => ({ text: t, not, scope: '.stage-content .g10-opt' })
      for (const a of [o('три', 'четыре'), o('не лежащие в одной'), o('четыре'), o('переносят одну')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 40-dars: PERPENDIKULYAR CHIZIQ VA TEKISLIK. Bitta chiziq kam.
PLANS.dars40 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('девяносто градусов'), o('да, могут'), o('бесконечно много')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  {
    n: 3,
    act: async (p) => {
      await spinFirst(p)
      return clickText(p, { text: 'наклонно', not: 'всё ещё', scope: '.stage-content .g10-opt' })
    },
    done: '.g10-fb-ok',
  },
  {
    n: 4,
    act: async (p) => {
      await spinFirst(p)
      return clickText(p, { text: 'перпендикулярно плоскости', scope: '.stage-content .g10-opt' })
    },
    done: '.g10-fb-ok',
  },
  { n: 5, act: async (p) => { await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'признак ведёт к выводу'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const o = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-opt' })
      const pairs = [
        ['AB ⊥ ?', o('8')], ['AB ∥ ?', o('3')],
        ['AB ∸ ?', o('4')], ['ABCDA', o('6')],
      ]
      for (const pr of pairs) {
        await clickText(p, pr[0]); await clickText(p, pr[1]); await p.waitForTimeout(500)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      // ASOSLASHLAR QAYTA BOG'LANDI (2026-08-20): birinchi ikki qator kub
      // yasalishidan, uchinchisi umumiy uchdan. Ilgari bu yerda «vershina
      // osnovaniya obshaya» ikkinchi qatorda turardi, va u mazmunan xato edi.
      for (const c of ['по построению куба', 'по построению куба', 'вершина основания общая']) {
        await clickText(p, { text: c, scope: '.stage-content .g10-opt' })
        await p.waitForTimeout(700)
      }
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['8'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, scope: '.stage-content .g10-chip' })
      for (const c of [chip('AB ∥ ?'), chip('AB ∸ ?'), chip('ABCDA'), chip('AB ⊥ ?')]) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, { text: 'a ⊥ α', exact: false, scope: '.stage-content button', not: '∀' })
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['1'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['0'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const c of [opt('b ∩ c = O'), opt('AA1 ⊥ AB')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('две пересекающиеся'), o('направление у них одно'), o('одна'), o('свойство перпендикулярной')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]


// 41-DARS: perpendikulyar, og'ma va uch perpendikulyar. Bosishlar SONGA
// tayanadi: yetti ekranda javob yoziladi, va bu eng ishonchli yo'l.
PLANS.dars41 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('двум пересекающимся'), o('девяносто с каждой'), o('не тем, каким кажется')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['9']) }, done: '.g10-entry-ok' },
  { n: 5, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['3']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1', '0']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'лежит в плоскости'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      // `C` -- `AC` va `BC` ning QISMI, shuning uchun to'liq taqqoslash.
      // O'ng ustunda ham «наклонная» ikki uzun yozuvning qismi.
      const L = (t) => ({ text: t, exact: true, scope: '.stage-content button' })
      const pairs = [
        ['AB', 'перпендикуляр к плоскости'],
        ['AC', 'наклонная'],
        ['BC', 'проекция наклонной'],
        ['C', 'основание наклонной'],
      ]
      for (const [l, r] of pairs) {
        await clickText(p, L(l))
        await clickText(p, L(r))
        await p.waitForTimeout(300)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['радиус в точку касания', 'теорема о трёх перпендикулярах', 'равенство прямоугольных']) {
        await clickText(p, { text: c, scope: '.stage-content .g10-opt' })
        await p.waitForTimeout(700)
      }
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['1', '5'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-chip' })
      for (const c of ['AB ⊥ α', 'BC', 'c ⊥ BC', 'c ⊥ AC']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, { text: 'd ⊥ AB → d ⊥ AC', scope: '.stage-content button' })
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['3'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['1'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const c of ['AB < AC', 'c ⊥ BC → c ⊥ AC', 'AB ⊥ BC']) await clickText(p, opt(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('перпендикуляр'), o('через основание наклонной'), o('равны'), o('длину перпендикуляра')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]


// 42-DARS: to'g'ri chiziq va tekislik orasidagi burchak.
PLANS.dars42 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('отрезок между основаниями'), o('перпендикуляр'), o('переносит перпендикулярность')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 5, act: async (p) => { await waitKeys(p); return typeKeys(p, ['9', '0']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['4', '5']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'с проекцией'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      // `AB` -- `AB1` ning qismi, shuning uchun to'liq taqqoslash.
      const L = (t) => ({ text: t, exact: true, scope: '.stage-content button' })
      const pairs = [
        ['AB', 'ноль градусов'],
        ['AA1', 'девяносто градусов'],
        ['AB1', 'сорок пять градусов'],
        ['AC1', 'меньше сорока пяти'],
      ]
      for (const [l, r] of pairs) {
        await clickText(p, L(l))
        await clickText(p, L(r))
        await p.waitForTimeout(300)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['по построению куба', 'определение проекции', 'проекция отрезка']) {
        await clickText(p, { text: c, scope: '.stage-content .g10-opt' })
        await p.waitForTimeout(700)
      }
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['4', '5'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, scope: '.stage-content .g10-chip' })
      for (const c of ['a ∩ α = A', 'a1 ⊂ α', '∠(a; a1)', '∠(a; α)']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, { text: '∠(a; α) = ∠(a; b)', scope: '.stage-content button' })
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['3'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['0'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const c of ['≤ 90', '= ∠(a; a1)', 'a ⊥ α']) await clickText(p, opt(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('с проекцией'), o('девяносто'), o('перпендикулярна плоскости'), o('сорок пять')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]


// 43-DARS: ikki yoqli burchak va perpendikulyar tekisliklar. Blok 6 ning oxiri.
PLANS.dars43 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('с проекцией'), o('одна'), o('с каждой прямой')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 5, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await waitKeys(p); return typeKeys(p, ['1', '3', '0']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await waitKeys(p); return typeKeys(p, ['4']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'оба перпендикулярны'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const L = (t) => ({ text: t, exact: true, scope: '.stage-content button' })
      const pairs = [['40°', 'острый'], ['90°', 'прямой'], ['120°', 'тупой'], ['180°', 'развёрнутый']]
      for (const [l, r] of pairs) {
        await clickText(p, L(l))
        await clickText(p, L(r))
        await p.waitForTimeout(300)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['два перпендикуляра', 'в одну сторону', 'сонаправленными']) {
        await clickText(p, { text: c, scope: '.stage-content .g10-opt' })
        await p.waitForTimeout(700)
      }
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['1', '1', '0'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, scope: '.stage-content .g10-chip' })
      for (const c of ['A ∈ a', 'AB ⊥ a', 'AC ⊥ a', '∠BAC']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, { text: 'AD ⊂ β', scope: '.stage-content button' })
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['3'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['9', '0'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const c of ['AC ⊥ a', '∠A = ∠B', '+ ∠2']) await clickText(p, opt(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('ребро'), o('перпендикулярно ребру'), o('шестьдесят'), o('наименьший')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]


// 44-DARS: prizma. Blok 7 ning boshi va 6B asbobining birinchi darsi.
PLANS.dars44 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('двум пересекающимся'), o('две полуплоскости'), o('одна')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['5']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 5, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['4']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1', '8']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['4']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'два основания равные'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      // `AB` -- `ABC` va `ABB1A1` ning qismi, `AA1` ham. To'liq taqqoslash.
      const L = (t) => ({ text: t, exact: true, scope: '.stage-content button' })
      const pairs = [
        ['ABC', 'основание'],
        ['ABB1A1', 'боковая грань'],
        ['AA1', 'боковое ребро'],
        ['AB', 'ребро основания'],
      ]
      for (const [l, r] of pairs) {
        await clickText(p, L(l))
        await clickText(p, L(r))
        await p.waitForTimeout(300)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['определение прямой призмы', 'перпендикуляр даёт прямой угол', 'определение призмы']) {
        await clickText(p, { text: c, scope: '.stage-content .g10-opt' })
        await p.waitForTimeout(700)
      }
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['3', '0'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-chip' })
      for (const c of ['ABC', 'A1B1C1', 'AA1', 'ABB1A1']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, { text: 'AB = BC = CD = DA', scope: '.stage-content button' })
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['3'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['7'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      // `2n` va `n + 2` -- `2n = n + 2` yozuvining ham qismi, shuning uchun
      // `not` bilan ajratiladi. Nishon harfi tugma matnida borligi uchun
      // to'liq taqqoslash ishlamaydi.
      const opt = (t, no) => ({ text: t, not: no, scope: '.stage-content .g10-opt' })
      for (const c of [opt('3n'), opt('2n', '='), opt('n + 2', '2n')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('две'), o('две равные грани'), o('десять'), o('боковое ребро перпендикулярно')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]


// 45-DARS: parallelepiped.
PLANS.dars45 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('две равные грани'), o('две'), o('боковое ребро перпендикулярно')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['6']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['6']) }, done: '.g10-entry-ok' },
  { n: 5, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1', '3']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  // Nishon harfi tugma matnida: to'liq taqqoslash variantlarda ishlamaydi.
  { n: 8, act: async (p) => clickText(p, { text: 'три', scope: '.stage-content .g10-opt' }), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const L = (t) => ({ text: t, exact: true, scope: '.stage-content button' })
      const pairs = [
        ['AB', 'ребро основания'],
        ['AA1', 'боковое ребро'],
        ['AC', 'диагональ основания'],
        ['AC1', 'диагональ тела'],
      ]
      for (const [l, r] of pairs) {
        await clickText(p, L(l))
        await clickText(p, L(r))
        await p.waitForTimeout(300)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['теорема Пифагора', 'перпендикуляр даёт прямой угол', 'теорема Пифагора']) {
        await clickText(p, { text: c, scope: '.stage-content .g10-opt' })
        await p.waitForTimeout(700)
      }
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['2', '6'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      // Chiplar `Fx` orqali chiziladi: pastki va yuqori indekslar SIQILADI,
      // `AC₁²` ekranda `AC12` bo'ladi. Chiplarda nishon harfi yo'q, shuning
      // uchun to'liq taqqoslash ishlaydi va `AC1` bilan `AC12` ajraladi.
      const chip = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-chip' })
      for (const c of ['a, b, c', 'AC', 'AC12', 'AC1']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      // `AuditRows` `Fx` orqali chizmaydi: pastki indeks QOLADI.
      await clickText(p, { text: 'AC₁ = AC = 5', scope: '.stage-content button' })
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['3'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['7'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const c of ['c2', 'AC2 =', 'a = b = c']) await clickText(p, opt(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('параллелограмм'), o('три'), o('корень из трёх'), o('с равными измерениями')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]


// 46-DARS: piramida. Apofema va yon qirra farqi.
PLANS.dars46 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('шесть'), o('переносит перпендикулярность'), o('длина перпендикуляра')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['5']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 5, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['4']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['5']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['4']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'в середину стороны'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const L = (t) => ({ text: t, exact: true, scope: '.stage-content button' })
      const pairs = [
        ['SA', 'боковое ребро'],
        ['SM', 'апофема'],
        ['SO', 'высота пирамиды'],
        ['AB', 'сторона основания'],
      ]
      for (const [l, r] of pairs) {
        await clickText(p, L(l))
        await clickText(p, L(r))
        await p.waitForTimeout(300)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['свойство правильного', 'перпендикуляр даёт прямой угол', 'признак равенства']) {
        await clickText(p, { text: c, scope: '.stage-content .g10-opt' })
        await p.waitForTimeout(700)
      }
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['1', '3'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-chip' })
      for (const c of ['AB', 'OM', 'SO', 'SM']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, { text: 'SM = SA', scope: '.stage-content button' })
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['3'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['8'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t, no) => ({ text: t, not: no, scope: '.stage-content .g10-opt' })
      for (const c of [opt('SM <'), opt('SM2'), opt('SA = SB')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      // «семь» -- «восемь» so'zining QISMI, shuning uchun `not` bilan.
      for (const a of [o('треугольники с общей вершиной'), o('в середину стороны'), o('апофема'),
        { text: 'семь', not: 'вос', scope: '.stage-content .g10-opt' }]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]


// 47-DARS: sirt yuzasi. Yoyilma bilan ishlaydigan birinchi dars.
PLANS.dars47 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t, no) => ({ text: t, not: no, scope: '.stage-content .g10-opt' })
      for (const a of [o('шесть'), o('высота боковой грани'), o('две')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['6']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['5', '2']) }, done: '.g10-entry-ok' },
  { n: 5, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1', '2', '0']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['6', '0']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['3']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'площади всех граней'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const L = (t) => ({ text: t, exact: true, scope: '.stage-content button' })
      const pairs = [
        ['P·h', 'боковая призмы'],
        ['2(ab+bc+ac)', 'полная параллелепипеда'],
        ['½·P·m', 'боковая пирамиды'],
        ['6a2', 'полная куба'],
      ]
      for (const [l, r] of pairs) {
        await clickText(p, L(l))
        await clickText(p, L(r))
        await p.waitForTimeout(300)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['развёртка боковой', 'боковые рёбра прямой призмы', 'рёбра основания идут']) {
        await clickText(p, { text: c, scope: '.stage-content .g10-opt' })
        await p.waitForTimeout(700)
      }
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['1', '5', '0'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-chip' })
      for (const c of ['a', 'a2', '6a2', 'S']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, { text: 'S = 26', scope: '.stage-content button' })
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['3'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['3'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t, no) => ({ text: t, not: no, scope: '.stage-content .g10-opt' })
      for (const c of [opt('6a2'), opt('2(ab'), opt('P·h')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('плоская фигура из всех граней'), o('периметр на высоту'), o('апофема'), o('три')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]


// 48-DARS: muntazam prizma va piramida.
PLANS.dars48 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('боковое ребро перпендикулярно'), o('высота боковой грани'), o('периметр на высоту')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['6']) }, done: '.g10-entry-ok' },
  { n: 5, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['6']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1', '8', '0']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'прямая и правильное основание'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const L = (t) => ({ text: t, exact: true, scope: '.stage-content button' })
      const pairs = [
        ['3', 'треугольная призма'],
        ['4', 'четырёхугольная пирамида'],
        ['6', 'шестиугольная призма'],
        ['12', 'двенадцатиугольная пирамида'],
      ]
      for (const [l, r] of pairs) {
        await clickText(p, L(l))
        await clickText(p, L(r))
        await p.waitForTimeout(300)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['правильный многоугольник в основании', 'призма прямая', 'признак равенства']) {
        await clickText(p, { text: c, scope: '.stage-content .g10-opt' })
        await p.waitForTimeout(700)
      }
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['9', '6'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-chip' })
      for (const c of ['S0', 'P', 'S1', 'S']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, { text: 'a = h', scope: '.stage-content button' })
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['3'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['1', '1', '2'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t, no) => ({ text: t, not: no, scope: '.stage-content .g10-opt' })
      for (const c of [opt('P = n'), opt('S1 = n'), opt('AA1')]) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('прямая и правильное основание'), o('число сторон на сторону'), o('пять'),
        { text: 'куб', not: 'кубе', scope: '.stage-content .g10-opt' }]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]


// 49-DARS: kesimlarni yasash.
PLANS.dars49 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('фигура из точек тела'), o('только на рёбрах'), o('шесть')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['3']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 5, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['4']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['7']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'когда они лежат в одной грани'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const L = (t) => ({ text: t, exact: true, scope: '.stage-content button' })
      const pairs = [
        ['4', 'треугольная пирамида'],
        ['5', 'четырёхугольная пирамида'],
        ['6', 'куб'],
        ['7', 'пятиугольная призма'],
      ]
      for (const [l, r] of pairs) {
        await clickText(p, L(l))
        await clickText(p, L(r))
        await p.waitForTimeout(300)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['точки взяты в секущей плоскости', 'оба ребра принадлежат верхней грани',
        'аксиома о пересечении двух плоскостей']) {
        await clickText(p, { text: c, scope: '.stage-content .g10-opt' })
        await p.waitForTimeout(700)
      }
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['5', '0'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-chip' })
      for (const c of ['KL', 'X', 'KX', 'N']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, { text: 'MK ⊂', scope: '.stage-content button' })
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['3'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['6', '0'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t, no) => ({ text: t, not: no, scope: '.stage-content .g10-opt' })
      for (const c of [opt('M \u2208 A1B1'), opt('MN \u2282 A1B1C1D1'), opt('PM \u2225 KH')]) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('только на рёбрах'), o('шесть'), o('когда лежат в одной грани'),
        o('линия её пересечения')]) {
        await clickText(p, a); await p.waitForTimeout(1700)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]


// 50-DARS: fazoda koordinatalar.
PLANS.dars50 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('два'), o('основание перпендикуляра'), o('у каждого места своя ось')]) {
        await clickText(p, a); await p.waitForTimeout(1600)
      }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  { n: 3, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['3']) }, done: '.g10-entry-ok' },
  { n: 4, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['0']) }, done: '.g10-entry-ok' },
  { n: 5, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['1']) }, done: '.g10-entry-ok' },
  { n: 6, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['4']) }, done: '.g10-entry-ok' },
  { n: 7, act: async (p) => { await spinFirst(p); await waitKeys(p); return typeKeys(p, ['2']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'первые два числа на своих осях'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      const L = (t) => ({ text: t, exact: true, scope: '.stage-content button' })
      const pairs = [
        ['(0; 0; 5)', 'на вертикальной оси'],
        ['(2; 3; 0)', 'в нижней плоскости'],
        ['(0; 2; 3)', 'в задней плоскости'],
        ['(1; 2; 3)', 'вне плоскостей'],
      ]
      for (const [l, r] of pairs) {
        await clickText(p, L(l))
        await clickText(p, L(r))
        await p.waitForTimeout(300)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      await waitReady(p)
      for (const c of ['третье число закреплено', 'основание перпендикуляра',
        'по построению лежит в плоскости']) {
        await clickText(p, { text: c, scope: '.stage-content .g10-opt' })
        await p.waitForTimeout(700)
      }
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['1', '0'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      const chip = (t) => ({ text: t, exact: true, scope: '.stage-content .g10-chip' })
      for (const c of ['A1', 'x, y', 'x2 + y2', 'd']) await clickText(p, chip(c))
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, { text: 'd(A, Oxy) = 7', scope: '.stage-content button' })
      await p.waitForTimeout(1200)
      await waitKeys(p)
      return typeKeys(p, ['3'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      await waitKeys(p)
      await typeKeys(p, ['1', '3'])
      await p.waitForTimeout(2200)
      await waitReady(p)
      const opt = (t, no) => ({ text: t, not: no, scope: '.stage-content .g10-opt' })
      for (const c of [opt('A (5; 12; 9)'), opt('A1 (5; 12; 0)'), opt('d(A, Oxy) = 9')]) {
        await clickText(p, c)
      }
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      const o = (t) => ({ text: t, scope: '.stage-content .g10-opt' })
      for (const a of [o('три'), o('на оси'), o('третьему числу записи'), o('адрес проекции')]) {
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
    if (!solved) {
      problems.push(`${vp.name} ekran ${step.n}: qo'l bilan yechilmadi`)
      // EKRANDAGI TUGMALARNI darhol chiqaramiz. Sabab: «yechilmadi» degan gap
      // o'zi hech narsa aytmaydi, va 13-darsda men uni ikki marta taxmin bilan
      // tuzatmoqchi bo'ldim -- birinchisi rejadagi matn, ikkinchisi progress
      // qatori. Ikkalasi ham noto'g'ri edi. Endi ro'yxat ko'rinadi.
      const seen = await page.evaluate(() => Array.from(
        document.querySelectorAll('.stage-content button'),
      ).map((b) => (b.disabled ? '[off] ' : '') + (b.textContent || '').replace(/\s+/g, ' ').trim()))
      problems.push(`    ekranda: ${seen.map((x) => JSON.stringify(x)).join(', ').slice(0, 600)}`)
    }
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
