// ============================================================================
// 8-sinf, Dars 1 (v2) tekshiruvi: 15 ekranning HAMMA interaktiv zanjiri
// bosib chiqiladi, har qadamda skroll/chiqib ketish o'lchanadi.
//
// Nimani ushlaydi:
//   1. Statik: tipografik apostrof, ovoz matnidagi belgi, uch tilning to'liqligi
//   2. Qulflar: 2 va 8-ekranda navbatdan tashqari ochilmasligi, 5-ekranda
//      ikkinchi tugmaning yopiqligi, 6-7 da yechim faqat to'g'ri javobdan keyin
//   3. Beshlik zanjirlar: 9, 10, 11, 12, 14 da AYNAN beshta topshiriq va
//      keyingisining faqat to'g'ri javobdan keyin ochilishi
//   4. «Davom» tugmasi majburiy harakatgacha yopiq turishi
//   5. Kontent chiqib ketishi (1366x768, 1280x720, 390x745)
//   6. Konsol xatolari
//   7. 1 va 15-ekranda qoralama YO'Q, 14-ekranda baho haqida so'z YO'Q
//
// Ishga tushirish: node scripts/grade8-dars01v2-check.mjs
// Server o'zi ko'tariladi (vite), tugagach o'chiriladi.
// ============================================================================
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const PORT = process.env.G8_PORT || '5291'
const SLUG = 'dars01-ratsional-ifodalar-laboratoriya'
const BASE = `http://localhost:${PORT}/8-sinf/matematika/nazariy/${SLUG}`
const OUT = '.tmp/grade8-dars01v2'
// G8_TARGET=standalone -- tekshiruv AYNAN LMS ga ketadigan bitta faylni
// (artifacts/grade8-dars01-lesson/index.html ichida) bosib chiqadi.
const TARGET = process.env.G8_TARGET || 'site'
const STANDALONE = pathToFileURL(path.resolve('artifacts/grade8-dars01-lesson/index.html')).href
const openUrl = (lang) => (TARGET === 'standalone' ? STANDALONE : `${BASE}?lang=${lang}`)
const LESSON = 'src/components/grade8/Dars01v2.jsx'
const KIT = 'src/components/grade8/labkit.jsx'

const problems = []
const notes = []
const fail = (m) => problems.push(m)

// ============================================================
// 1-QISM. STATIK TEKSHIRUV
// ============================================================
const BAD_CHARS = [
  ['‘', 'tipografik apostrof U+2018'],
  ['’', 'tipografik apostrof U+2019'],
  ['ʻ', "o'zbek apostrofi U+02BB"],
  ['ʼ', "o'zbek apostrofi U+02BC"],
  ['“', 'qo\'shtirnoq U+201C'],
  ['”', 'qo\'shtirnoq U+201D'],
]
// Ovozda TAQIQLANGAN belgilar: TTS ularni o'qiy olmaydi (CLAUDE.md §7).
const AUDIO_BAD = ['=', '<', '>', '%', '$', '^', '×', '÷', '≠', '—', '«', '»', '"', '/', '−']

for (const file of [LESSON, KIT]) {
  const text = await readFile(file, 'utf8')
  const lines = text.split(/\r?\n/)
  for (const [ch, label] of BAD_CHARS) {
    lines.forEach((line, i) => {
      if (line.includes(ch)) fail(`${file}:${i + 1} ${label}`)
    })
  }
}

// Ovoz bo'laklari: `{ on: '...', ... text: L(uz, ru, en) }` bloklari.
{
  const text = await readFile(LESSON, 'utf8')
  const audioBlocks = [...text.matchAll(/\{\s*on:\s*'([a-z0-9]+)'[^}]*?text:\s*L\(([\s\S]*?)\n\s*\)\s*\}/g)]
  if (audioBlocks.length < 30) fail(`ovoz bo'laklari topilmadi (${audioBlocks.length})`)
  notes.push(`ovoz bo'laklari: ${audioBlocks.length}`)
  for (const m of audioBlocks) {
    const body = m[2]
    const strings = [...body.matchAll(/(?:'([^']*)'|"([^"]*)")/g)].map((s) => s[1] ?? s[2])
    if (strings.length < 3) fail(`ovoz bo'lagi '${m[1]}': uch til to'liq emas (${strings.length})`)
    strings.forEach((s) => {
      AUDIO_BAD.forEach((ch) => {
        if (s.includes(ch)) fail(`ovoz bo'lagi '${m[1]}': taqiqlangan belgi ${JSON.stringify(ch)} -> ${s.slice(0, 60)}`)
      })
      if (/[а-яёА-ЯЁ]/.test(s) === false && /[a-z]/i.test(s) === false) fail(`ovoz bo'lagi '${m[1]}': bo'sh matn`)
    })
    // UZ birinchi bo'lakda kirill bo'lmasligi shart.
    if (/[а-яёА-ЯЁ]/.test(strings[0])) fail(`ovoz bo'lagi '${m[1]}': UZ matnda kirill -> ${strings[0].slice(0, 50)}`)
  }
}

// L(uz, ru, en) uchligida bo'sh til yo'qligi.
{
  const text = await readFile(LESSON, 'utf8')
  const empties = [...text.matchAll(/L\(\s*(?:''|"")\s*,/g)]
  if (empties.length) fail(`L(...) ichida bo'sh til: ${empties.length}`)
}

// ============================================================
// 2-QISM. BRAUZER
// ============================================================
await mkdir(OUT, { recursive: true })
const server = TARGET === 'standalone' ? null : spawn('npx', ['vite', '--port', PORT, '--strictPort'], {
  shell: true,
  stdio: 'ignore',
  cwd: process.cwd(),
})
const stopServer = () => { try { if (server) server.kill('SIGTERM') } catch { /* ok */ } }
process.on('exit', stopServer)

// `--disable-gpu`: Windows da headless GPU jarayoni ba'zan qulab tushadi va
// tekshiruv dars aybsiz bo'lsa ham uziladi.
const browser = await chromium.launch({ headless: true, args: ['--disable-gpu'] })

// Server tayyor bo'lishini kutamiz (avtonom rejimda server yo'q).
if (TARGET !== 'standalone') {
  const probe = await browser.newPage()
  let up = false
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await probe.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 4000 })
      if (res && res.ok()) { up = true; break }
    } catch { /* hali ko'tarilmadi */ }
    await probe.waitForTimeout(500)
  }
  await probe.close()
  if (!up) {
    fail('vite serveri ko\'tarilmadi')
    await browser.close()
    stopServer()
    await report()
  }
}

const SEQ_CORRECT = {
  9: [0, 2, 1, 1, 2],
  10: [0, 1, 0, 1, 1],
  11: [1, 0, 0, 1, 0],
  12: [0, 1, 0, 1, 0],
  14: [0, 0, 0, 2, 1],
}
// Har zanjirning birinchi topshirig'ida ataylab XATO javob: izoh chiqishi shart.
const SEQ_WRONG_FIRST = { 9: 1, 10: 1, 11: 0, 12: 1, 14: 1 }

async function measure(page, where, tag) {
  const m = await page.evaluate(() => {
    const stage = document.querySelector('.g8l-stage')
    const screen = document.querySelector('.g8l-screen.is-active')
    const body = screen && screen.querySelector('.g8l-body')
    if (!stage || !screen) return null
    const r = screen.getBoundingClientRect()
    const foot = document.querySelector('.g8l-foot')
    const fr = foot ? foot.getBoundingClientRect() : null
    return {
      stageOver: stage.scrollHeight - stage.clientHeight,
      screenOver: screen.scrollHeight - screen.clientHeight,
      bodyOver: body ? body.scrollHeight - body.clientHeight : 0,
      docOverX: document.documentElement.scrollWidth - window.innerWidth,
      docOverY: document.documentElement.scrollHeight - window.innerHeight,
      screenBottom: Math.round(r.bottom),
      footTop: fr ? Math.round(fr.top) : null,
    }
  })
  if (!m) { fail(`${tag} ${where}: ekran topilmadi`); return }
  if (m.stageOver > 1) fail(`${tag} ${where}: sahna ${m.stageOver}px chiqib ketdi`)
  if (m.screenOver > 1) fail(`${tag} ${where}: ekran ${m.screenOver}px chiqib ketdi`)
  if (m.bodyOver > 1) fail(`${tag} ${where}: kontent ${m.bodyOver}px chiqib ketdi`)
  if (m.docOverX > 1) fail(`${tag} ${where}: gorizontal skroll ${m.docOverX}px`)
  if (m.docOverY > 1) fail(`${tag} ${where}: vertikal skroll ${m.docOverY}px`)
  if (m.footTop !== null && m.screenBottom > m.footTop + 1) {
    fail(`${tag} ${where}: kontent pastki panel ustiga chiqdi (${m.screenBottom} > ${m.footTop})`)
  }
}

const nextBtn = (page) => page.locator('.g8l-nav.is-primary')
const active = (page) => page.locator('.g8l-screen.is-active')

async function expectNext(page, want, where, tag) {
  const disabled = await nextBtn(page).isDisabled()
  if (want && disabled) fail(`${tag} ${where}: «Davom» ochilmadi`)
  if (!want && !disabled) fail(`${tag} ${where}: «Davom» harakatdan oldin ochiq turdi`)
}

async function walk(lang, vp, tag, shots, reduced) {
  const page = await browser.newPage({
    viewport: { width: vp.w, height: vp.h },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e.message)))
  // Tashqi shrift va favicon so'rovlari darsga tegishli emas: internet
  // bo'lmasa 404 beradi, lekin dars ishlaydi (zaxira shrift bilan).
  const EXTERNAL = /fonts\.googleapis\.com|fonts\.gstatic\.com|favicon/
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    const url = (m.location() && m.location().url) || ''
    if (EXTERNAL.test(url) || EXTERNAL.test(m.text())) return
    if (/Failed to load resource/.test(m.text()) && !url) return
    errors.push('console: ' + m.text() + (url ? ' <- ' + url : ''))
  })
  await page.goto(openUrl(lang), { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.g8l-screen.is-active', { timeout: 15000 })
  await page.waitForTimeout(400)

  const shot = async (n) => {
    if (!shots) return
    await page.screenshot({ path: `${OUT}/${tag}-screen-${String(n).padStart(2, '0')}.png` })
  }
  const go = async (n) => {
    await nextBtn(page).click()
    // Ekran kirish animatsiyasi 450 ms: undan oldin bosilsa, brauzer hali
    // eski joylashuvda turadi va bosish boshqa elementga tushadi.
    await page.waitForTimeout(700)
    const counter = (await page.locator('.g8l-count').textContent()).trim()
    if (!counter.startsWith(String(n).padStart(2, '0'))) fail(`${tag}: ${n}-ekranga o'tilmadi (${counter})`)
  }

  // ---- 1-ekran: xuk ----
  await expectNext(page, false, 'ekran 1', tag)
  await page.locator('.d1-val').nth(0).click()
  await page.waitForTimeout(750)
  if (await active(page).locator('.d1-result.is-ok').count() !== 1) fail(`${tag} ekran 1: ruxsat etilgan qiymat natijasi chiqmadi`)
  await expectNext(page, false, 'ekran 1 (0 dan keyin)', tag)
  // KLAVIATURA yo'li: fokus va Enter. Sichqoncha shart emasligini tekshiradi.
  await page.locator('.d1-val').nth(2).focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(800)
  if (await active(page).locator('.d1-result.is-bad').count() !== 1) fail(`${tag} ekran 1: uchda taqiq ko'rsatilmadi`)
  if (await active(page).locator('.g8l-frac.is-blocked').count() !== 1) fail(`${tag} ekran 1: maxraj bloklanmadi`)
  if ((await active(page).innerText()).match(/Заметк|Qoralama|Черновик/)) fail(`${tag} ekran 1: qoralama bor`)
  // Metodist qarori: javob variantlari bor ekranda HARAKAT bo'lmaydi.
  // Ko'rsatkichda ham, uning oldi/keyin qatlamlarida ham animatsiya yo'q.
  const motion = await page.evaluate(() => {
    const bad = []
    document.querySelectorAll('.g8l-screen.is-active *').forEach((el) => {
      for (const pseudo of [null, ':before', ':after']) {
        const st = getComputedStyle(el, pseudo)
        if (!st.animationName || st.animationName === 'none') continue
        // Ovoz indikatori (to'lqinlar) -- holat ko'rsatkichi, u qoladi.
        if (el.closest('.g8l-waves') || el.classList.contains('g8l-waves')) continue
        // BIR MARTALIK kirish animatsiyasi (son formulaga tushdi, natija
        // paydo bo'ldi) ruxsat etiladi: u miltillamaydi. Taqiq TAKRORLANUVCHI
        // harakatga: aynan u metodistni bezdirgan.
        const count = st.animationIterationCount
        if (count === '1' || count === '') continue
        bad.push((el.className || el.tagName) + (pseudo || '') + ' -> ' + st.animationName + ' x' + count)
      }
    })
    return bad
  })
  if (motion.length) fail(`${tag} ekran 1: harakat bor -> ${motion.slice(0, 3).join(' | ')}`)
  const bg = await page.evaluate(() => getComputedStyle(document.querySelector('.g8l-root')).backgroundColor)
  if (bg !== 'rgb(244, 239, 230)') fail(`${tag}: fon rangi ${bg}, #F4EFE6 emas`)
  await expectNext(page, true, 'ekran 1', tag)
  await measure(page, 'ekran 1', tag)
  await shot(1)
  await go(2)

  // ---- 2-ekran: qulflangan qadamlar ----
  await expectNext(page, false, 'ekran 2', tag)
  await active(page).locator('.g8l-lock').nth(2).click({ force: true })
  await page.waitForTimeout(200)
  if (await active(page).locator('.g8l-lock.is-done').count() !== 0) fail(`${tag} ekran 2: navbatdan tashqari qadam ochildi`)
  for (let i = 0; i < 4; i += 1) {
    await active(page).locator('.g8l-lock').nth(i).click()
    await page.waitForTimeout(260)
    await measure(page, `ekran 2 qadam ${i + 1}`, tag)
  }
  if (await active(page).locator('.d2-concl').count() !== 1) fail(`${tag} ekran 2: xulosa chiqmadi`)
  await expectNext(page, true, 'ekran 2', tag)
  await shot(2)
  await go(3)

  // ---- 3-ekran: ikki majburiy tekshiruv, AVVAL 4, KEYIN 3 ----
  await expectNext(page, false, 'ekran 3', tag)
  await active(page).locator('.d3-chip').nth(3).click()   // 4
  await page.waitForTimeout(2500)
  if (await active(page).locator('.d3-final.is-ok').count() !== 1) fail(`${tag} ekran 3: to'rtda xulosa chiqmadi`)
  if (await active(page).locator('.d3-cmp-row.is-on').count() !== 1) fail(`${tag} ekran 3: birinchi natija taqqoslashda qolmadi`)
  await expectNext(page, false, 'ekran 3 (faqat 4 dan keyin)', tag)
  await active(page).locator('.d3-chip').nth(2).click()   // 3
  await page.waitForTimeout(2600)
  if (await active(page).locator('.d3-row.is-on').count() !== 3) fail(`${tag} ekran 3: uch qadam ochilmadi`)
  if (await active(page).locator('.d3-final.is-bad').count() !== 1) fail(`${tag} ekran 3: uchda xulosa chiqmadi`)
  if (await active(page).locator('.d3-cmp-row.is-on').count() !== 2) fail(`${tag} ekran 3: ikki holat yonma-yon turmadi`)
  if (await active(page).locator('.d3-take').count() !== 1) fail(`${tag} ekran 3: so'z bilan xulosa yo'q`)
  await expectNext(page, true, 'ekran 3', tag)
  await measure(page, 'ekran 3', tag)
  await shot(3)
  await go(4)

  // ---- 4-ekran: uch tushuncha ----
  await expectNext(page, false, 'ekran 4', tag)
  for (let i = 0; i < 3; i += 1) {
    await active(page).locator('.d4-card').nth(i).click()
    await page.waitForTimeout(220)
    await measure(page, `ekran 4 kartochka ${i + 1}`, tag)
  }
  if (await active(page).locator('.d4-card.is-on').count() !== 1) fail(`${tag} ekran 4: faol kartochka bitta emas`)
  if (await active(page).locator('.d4-mark').count() !== 3) fail(`${tag} ekran 4: bo'luvchi belgisi uchta emas`)
  if (await active(page).locator('.d4-take').count() !== 1) fail(`${tag} ekran 4: so'z bilan xulosa yo'q`)
  await expectNext(page, true, 'ekran 4', tag)
  await shot(4)
  await go(5)

  // ---- 5-ekran: nol tajribasi ----
  await expectNext(page, false, 'ekran 5', tag)
  const btn2 = active(page).locator('.d5-btn').nth(1)
  if (!(await btn2.isDisabled())) fail(`${tag} ekran 5: ikkinchi tugma boshida ochiq`)
  await active(page).locator('.d5-btn').nth(0).click()
  await page.waitForTimeout(320)
  if (await btn2.isDisabled()) fail(`${tag} ekran 5: ikkinchi tugma ochilmadi`)
  await expectNext(page, false, 'ekran 5 (birinchidan keyin)', tag)
  await btn2.click()
  await page.waitForTimeout(320)
  if (await active(page).locator('.d5-res.is-ok').count() !== 1) fail(`${tag} ekran 5: birinchi natija yo'q`)
  if (await active(page).locator('.d5-res.is-bad').count() !== 1) fail(`${tag} ekran 5: ikkinchi natija yo'q`)
  if (await active(page).locator('.d5-track.is-final').count() !== 1) fail(`${tag} ekran 5: solishtirish chiqmadi`)
  await expectNext(page, true, 'ekran 5', tag)
  await measure(page, 'ekran 5', tag)
  await shot(5)
  await go(6)

  // ---- 6 va 7-ekranlar: yechim faqat to'g'ri javobdan keyin ----
  for (const [n, wrongIdx, rightIdx] of [[6, 0, 1], [7, 0, 2]]) {
    await expectNext(page, false, `ekran ${n}`, tag)
    await active(page).locator('.g8l-opt').nth(wrongIdx).click()
    await page.waitForTimeout(300)
    if (await active(page).locator('.g8l-fb.is-bad').count() !== 1) fail(`${tag} ekran ${n}: xato javobga izoh chiqmadi`)
    if (await active(page).locator('.d6-sol').count() !== 0) fail(`${tag} ekran ${n}: yechim xato javobdan keyin ochildi`)
    if (!(await active(page).locator('.g8l-opt').nth(wrongIdx).isDisabled())) fail(`${tag} ekran ${n}: xato variant yopilmadi`)
    if (await active(page).locator('.g8l-opt').nth(rightIdx).isDisabled()) fail(`${tag} ekran ${n}: qolgan variantlar yopildi`)
    await measure(page, `ekran ${n} xato javob`, tag)
    await active(page).locator('.g8l-opt').nth(rightIdx).click()
    await page.waitForTimeout(1900)
    if (await active(page).locator('.d6-sol').count() !== 1) fail(`${tag} ekran ${n}: yechim ochilmadi`)
    const steps = await active(page).locator('.d6-step.is-on').count()
    if (steps !== 3) fail(`${tag} ekran ${n}: yechim qadamlari ${steps}/3`)
    await expectNext(page, true, `ekran ${n}`, tag)
    await measure(page, `ekran ${n} yechim`, tag)
    await shot(n)
    await go(n + 1)
  }

  // ---- 8-ekran: uch qoida navbat bilan ----
  await expectNext(page, false, 'ekran 8', tag)
  await active(page).locator('.g8l-lock').nth(2).click({ force: true })
  await page.waitForTimeout(200)
  if (await active(page).locator('.d8-line.is-on').count() !== 0) fail(`${tag} ekran 8: qulflangan qoida ochildi`)
  for (let i = 0; i < 3; i += 1) {
    await active(page).locator('.g8l-lock').nth(i).click()
    await page.waitForTimeout(260)
    const lines = await active(page).locator('.d8-line.is-on').count()
    if (lines !== i + 1) fail(`${tag} ekran 8: ${i + 1}-qoidada ${lines} satr ochildi`)
    await measure(page, `ekran 8 qoida ${i + 1}`, tag)
  }
  await expectNext(page, true, 'ekran 8', tag)
  await shot(8)
  await go(9)

  // ---- 9, 10, 11, 12-ekranlar: beshlik zanjirlar ----
  for (const n of [9, 10, 11, 12]) {
    await runSequence(page, n, tag)
    await shot(n)
    await go(n + 1)
  }

  // ---- 13-ekran: ko'chirish va fakt-karta ----
  await expectNext(page, false, 'ekran 13', tag)
  await active(page).locator('.g8l-opt').nth(0).click()
  await page.waitForTimeout(300)
  if (await active(page).locator('.g8l-fb.is-bad').count() !== 1) fail(`${tag} ekran 13: xato javobga izoh chiqmadi`)
  if (await active(page).locator('.d13-fact.is-on').count() !== 0) fail(`${tag} ekran 13: fakt-karta xato javobda ochildi`)
  await active(page).locator('.g8l-opt').nth(1).click()
  await page.waitForTimeout(2100)
  if (await active(page).locator('.g8l-fb.is-ok').count() !== 1) fail(`${tag} ekran 13: yechim izohi chiqmadi`)
  if (await active(page).locator('.d13-fact.is-on').count() !== 1) fail(`${tag} ekran 13: fakt-karta ochilmadi`)
  await expectNext(page, true, 'ekran 13', tag)
  await measure(page, 'ekran 13', tag)
  await shot(13)
  await go(14)

  // ---- 14-ekran: aralash beshlik, baho haqida so'z YO'Q ----
  const s14text = await active(page).innerText()
  if (/Оценка|оценк|Baho|baholan/.test(s14text)) fail(`${tag} ekran 14: baho haqida so'z bor`)
  await runSequence(page, 14, tag)
  await shot(14)
  await go(15)

  // ---- 15-ekran: yakun ----
  if (await active(page).locator('.d15-skill').count() !== 4) fail(`${tag} ekran 15: to'rt natija yo'q`)
  const s15text = await active(page).innerText()
  if (/Заметк|Qoralama|Черновик/.test(s15text)) fail(`${tag} ekran 15: qoralama bor`)
  await expectNext(page, true, 'ekran 15', tag)
  await measure(page, 'ekran 15', tag)
  await shot(15)

  // Orqaga qaytish: holat saqlanishi shart (JSON talabi).
  await page.locator('.g8l-nav').first().click()
  await page.waitForTimeout(400)
  const backTabs = await active(page).locator('.g8l-seq-tab.is-done').count()
  if (backTabs !== 5) fail(`${tag}: orqaga qaytganda 14-ekran holati yo'qoldi (${backTabs}/5)`)
  await page.locator('.g8l-nav').first().click()
  await page.waitForTimeout(400)
  if (await active(page).locator('.d13-fact.is-on').count() !== 1) fail(`${tag}: orqaga qaytganda 13-ekran holati yo'qoldi`)

  // Yakunlash: platformaga payload ketishi.
  await page.goto(openUrl(lang), { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(300)

  // Til: UZ va EN da kirill bo'lmasligi shart.
  if (lang !== 'ru') {
    await page.waitForSelector('.g8l-screen.is-active')
    const rootText = await page.locator('.g8l-root').innerText()
    const cyr = rootText.match(/[а-яёА-ЯЁ]+/g)
    if (cyr) fail(`${tag}: ${lang} tilida kirill matn -> ${cyr.slice(0, 5).join(', ')}`)
  }

  if (errors.length) fail(`${tag}: brauzer xatolari -> ${errors.slice(0, 4).join(' | ')}`)
  await page.close()
}

async function runSequence(page, n, tag) {
  const scr = active(page)
  const tabs = await scr.locator('.g8l-seq-tab').count()
  if (tabs !== 5) fail(`${tag} ekran ${n}: topshiriqlar soni ${tabs}, beshta emas`)
  await expectNext(page, false, `ekran ${n}`, tag)

  const wrong = SEQ_WRONG_FIRST[n]
  await scr.locator('.g8l-opts .g8l-opt').nth(wrong).click()
  await page.waitForTimeout(260)
  if (await scr.locator('.g8l-fb.is-bad').count() !== 1) fail(`${tag} ekran ${n}: xato javobga shaxsiy izoh chiqmadi`)
  const tabNow = await scr.locator('.g8l-seq-tab.is-done').count()
  if (tabNow !== 0) fail(`${tag} ekran ${n}: xato javobdan keyin topshiriq ochildi`)
  // Ikkinchi xato: «Yordam» ochilishi kerak (agar variant yetsa).
  const optCount = await scr.locator('.g8l-opts .g8l-opt').count()
  const correct = SEQ_CORRECT[n]
  if (optCount > 2) {
    const second = [0, 1, 2, 3].find((i) => i !== wrong && i !== correct[0])
    if (second !== undefined) {
      await scr.locator('.g8l-opts .g8l-opt').nth(second).click()
      await page.waitForTimeout(240)
      if (await scr.locator('.g8l-help').count() !== 1) fail(`${tag} ekran ${n}: ikki xatodan keyin Yordam chiqmadi`)
    }
  }
  await measure(page, `ekran ${n} xato javob`, tag)

  for (let i = 0; i < 5; i += 1) {
    await scr.locator('.g8l-opts .g8l-opt').nth(correct[i]).click()
    await page.waitForTimeout(240)
    if (await scr.locator('.g8l-fb.is-ok').count() !== 1) fail(`${tag} ekran ${n}: ${i + 1}-topshiriqda izoh chiqmadi`)
    await measure(page, `ekran ${n} topshiriq ${i + 1}`, tag)
    if (i < 4) {
      await page.waitForTimeout(1250)
      const nowTab = await scr.locator('.g8l-seq-tab').nth(i + 1).getAttribute('class')
      if (!nowTab.includes('is-now')) fail(`${tag} ekran ${n}: ${i + 2}-topshiriq ochilmadi`)
    }
  }
  const doneTabs = await scr.locator('.g8l-seq-tab.is-done').count()
  if (doneTabs !== 5) fail(`${tag} ekran ${n}: yopilgan topshiriqlar ${doneTabs}/5`)
  await expectNext(page, true, `ekran ${n}`, tag)
}

const WALKS = [
  { lang: 'ru', vp: { w: 1366, h: 768 }, tag: 'ru-1366x768', shots: true },
  { lang: 'uz', vp: { w: 1366, h: 768 }, tag: 'uz-1366x768', shots: false },
  { lang: 'en', vp: { w: 1366, h: 768 }, tag: 'en-1366x768', shots: false },
  { lang: 'ru', vp: { w: 1280, h: 720 }, tag: 'ru-1280x720', shots: false },
  // Harakat kamaytirilgan rejim: ochilishlar animatsiyaga BOG'LIQ bo'lmasligi kerak.
  { lang: 'ru', vp: { w: 1366, h: 768 }, tag: 'ru-reduced-motion', shots: false, reduced: true },
  { lang: 'ru', vp: { w: 390, h: 745 }, tag: 'ru-390x745', shots: false },
  // HAQIQIY telefon: 393x852 ekranda kontentga ~660 px qoladi (brauzer
  // panellari yeydi). 10-sinfda shu o'lchov aniqlangan, shuning uchun shart.
  { lang: 'ru', vp: { w: 393, h: 660 }, tag: 'ru-393x660', shots: true },
]

// G8_ONLY=ru-390x745 -- bitta yurishni tekshirish (tuzatish paytida tez).
const only = process.env.G8_ONLY || (TARGET === 'standalone' ? 'ru-1366x768' : undefined)
for (const w of WALKS.filter((x) => !only || x.tag === only)) {
  const before = problems.length
  await walk(w.lang, w.vp, w.tag, w.shots, w.reduced)
  notes.push(`${w.tag}: ${problems.length - before} muammo`)
}

await browser.close()
stopServer()
await report()

async function report() {
  const lines = []
  lines.push('8-sinf Dars01v2 tekshiruvi')
  notes.forEach((n) => lines.push('  ' + n))
  if (problems.length) {
    lines.push('')
    lines.push(`MUAMMOLAR (${problems.length}):`)
    problems.forEach((p) => lines.push('  - ' + p))
  } else {
    lines.push('')
    lines.push('PASS: statik, qulflar, beshliklar, chiqib ketish, konsol -- toza')
  }
  const text = lines.join('\n')
  console.log(text)
  // `await`: process.exit yozishni uzib qo'yardi, hisobot fayli bo'sh qolardi.
  await writeFile(`${OUT}/report.txt`, text, 'utf8').catch(() => {})
  process.exit(problems.length ? 1 : 0)
}
