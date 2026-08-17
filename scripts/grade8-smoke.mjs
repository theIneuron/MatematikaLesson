// ============================================================================
// grade8-smoke.mjs — прогон урока 8 класса в браузере: консоль, обрезка,
// прокрутка (§20 п. 35, 35а, 36) на пяти размерах.
//
// Отличие от прежнего скрипта пилота: `FREE_NAV` теперь false, и «Продолжить»
// не откроется, пока экран не решён. Поэтому скрипт РЕШАЕТ экраны — ответы
// лежат ниже таблицей. Это фикстура теста, а не данные урока: если ответ в
// уроке изменится, тест обязан упасть, а не подстроиться.
//
// Что мерится. `.g8-body` имеет `overflow: clip`, поэтому мерить прокрутку
// НЕДОСТАТОЧНО: не влезший контент прокрутки не создаёт, он ИСЧЕЗАЕТ.
// Меряется нижняя граница самого нижнего блока против рабочей зоны.
//
//   node scripts/grade8-smoke.mjs [port] [slug]
// ============================================================================
import fs from 'node:fs'
import { chromium } from 'playwright'

const port = process.argv[2] || '5233'
const slug = process.argv[3] || 'dars01-ratsional-ifodalar-va-kasrlar'
const URL = `http://localhost:${port}/8-sinf/matematika/nazariy/${slug}`

const SIZES = [
  { w: 1366, h: 615, name: 'ноутбук узкий' },
  { w: 1366, h: 655, name: 'ноутбук' },
  { w: 1920, h: 950, name: 'большой экран' },
  { w: 390, h: 745, name: 'телефон' },
  { w: 360, h: 690, name: 'малый телефон' },
]

// Ответы урока 1. Фикстура теста, а не данные урока: если ответ в уроке
// изменится, прогон обязан упасть, а не подстроиться.
//   wait  -- демо-экран идёт сам, ждём его
//   part  -- тап по части записи (data-part)
//   chips -- сборка правила по data-id
const SOLVE = [
  { cards: 2 },                                                          // 1 хук: прогноз, один ответ
  { cards: 2 },                                                          // 2 опора: выбрать запись с буквой под чертой
  // Порядок шагов в прогоне: part -> nums -> picksAfter -> fields.
  // Вопрос по ходу появляется ПОСЛЕ подстановки, поле ОДЗ — после вопроса.
  // Лента кадров: жмём кадры по порядку, на втором отвечаем на вопрос.
  { dial: 3 },                                                           // 3 счётчики: уводим количество в ноль
  { cards: 2 },                                                          // 4 две записи: выбираем ту, что упадёт
  {},                                                                    // 5 цепочка: смотрим, действий нет
  {},                                                                    // 6 два способа: смотрим, действий нет
  {},                                                                    // 7 разбор по частям: смотрим, действий нет
  { chips: ['f1', 'f2', 'f3', 'f4'] },                                  // 8 правило: сборка
  { drill: 5 },                                                          // 9 пять примеров с показом решения
  { drill: 3 },                                                          // 10 три шага выбором, решение после каждого
  { drill: 3 },                                                          // 11 сам: три примера с решением
  { drill: 2 },                                                          // 12 ловушка: две чужие ошибки
  { cells: ['=', '0', '9', '3', '≠', '3'] },                             // 13 заполняем клетки по порядку
  { blitz: true },                                                       // 14 блиц
  {},                                                                    // 15 итог
]

const errors = []
const cuts = []

// Прогон обязан честно сказать, что он мерил. При FREE_NAV = true «Продолжить»
// открыта всегда, значит проверка «экран решается по фикстуре» НЕ работает:
// скрипт пролистает урок, даже если задание не закрылось.
const freeNav = /export const FREE_NAV = true/.test(
  fs.readFileSync('src/components/grade8/core.jsx', 'utf8'),
)


// ============================================================================
// СТОРОЖ СТРОК СТИЛЕЙ. Стоит ПЕРВЫМ, до браузера: обратная кавычка или
// обратный слэш внутри шаблонной строки со стилями рвут её, урок отдаёт 500 и
// белую страницу, а причину браузер не показывает. Поймано 2026-08-15 на
// plot.jsx: слово в обратных кавычках внутри КОММЕНТАРИЯ оборвало PLOT_STYLES.
// В 6 классе такой сторож есть с 14 августа, в 8 классе его не было.
// ============================================================================
const STYLE_FILES = [
  ['src/components/grade8/core.jsx', 'STYLES'],
  ['src/components/grade8/tools.jsx', 'TOOLS_STYLES'],
  ['src/components/grade8/plot.jsx', 'PLOT_STYLES'],
  ['src/components/grade8/method.jsx', 'METHOD_STYLES'],
  ['src/components/grade8/twosides.jsx', 'TWOSIDES_STYLES'],
  ['src/components/grade8/math.jsx', 'MATH_STYLES'],
]
let styleBroken = 0
for (const [file, name] of STYLE_FILES) {
  let src
  try { src = fs.readFileSync(file, 'utf8') } catch { continue }
  const open = src.indexOf('export const ' + name + ' = ')
  if (open < 0) continue
  const from = src.indexOf('`', open)
  if (from < 0) continue
  const rest = src.slice(from + 1)
  const to = rest.indexOf('`')
  const body = to < 0 ? rest : rest.slice(0, to)
  // Правило простое и проверяемое: настоящая строка стилей длинная и полна
  // фигурных скобок. Стоит внутри появиться обратной кавычке — строка
  // обрывается на ней, и «тело» становится коротким огрызком без правил.
  // Первая версия проверки сравнивала позицию последней скобки с длиной и
  // на пробе НЕ сработала: у огрызка длина меньше порога.
  const braces = (body.match(/\}/g) || []).length
  if (to < 0 || braces < 3 || body.length < 200) {
    console.log(`  ✗ ${file}: ${name} — обратная кавычка внутри строки стилей`)
    styleBroken += 1
  }
  if (/\\(?!n)/.test(body)) {
    console.log(`  ✗ ${file}: ${name} — обратный слэш внутри строки стилей`)
    styleBroken += 1
  }
}
if (styleBroken) {
  console.log('  строки стилей сломаны: браузер покажет белую страницу. Прогон остановлен.')
  process.exit(1)
}

const measure = (page) => page.evaluate(() => {
  const body = document.querySelector('.g8-body')
  const stack = document.querySelector('.g8-stack')
  if (!body || !stack) return null
  const b = body.getBoundingClientRect()
  let deepest = 0
  for (const el of stack.children) {
    const r = el.getBoundingClientRect()
    if (r.height > 0) deepest = Math.max(deepest, r.bottom)
  }
  // Обрезка ВНУТРИ карточек — отдельная проверка (§20 п. 35а).
  let clipped = 0
  for (const el of document.querySelectorAll('.lesson-root *')) {
    const st = getComputedStyle(el)
    if (st.overflow !== 'clip' && st.overflow !== 'hidden') continue
    if (el.scrollHeight - el.clientHeight > 2 || el.scrollWidth - el.clientWidth > 2) clipped += 1
  }
  return {
    cut: Math.round(deepest - b.bottom),
    hScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    vScroll: document.documentElement.scrollHeight - document.documentElement.clientHeight,
    clipped,
    bodyH: Math.round(b.height),
  }
})

// Клик, который НЕ роняет прогон: «element is outside of the viewport» —
// это находка (контент обрезан), а не повод прекратить измерение.
const tap = async (loc, where) => {
  try {
    await loc.click({ force: true, timeout: 4000 })
    return true
  } catch (e) {
    // Рамка элемента в сообщение: «не нажать» без координат не отлаживается.
    const box = await loc.boundingBox().catch(() => null)
    const rect = box ? ` [x=${Math.round(box.x)} y=${Math.round(box.y)} w=${Math.round(box.width)} h=${Math.round(box.height)}]` : ' [нет рамки]'
    cuts.push(`${where}: не нажать${rect} — ${String(e.message).split('\n')[0].slice(0, 70)}`)
    return false
  }
}

const typeField = async (page, value, where) => {
  const input = page.locator('.g8-field:not(.g8-field-done) .g8-input').first()
  if (await input.count() === 0) return false
  try { await input.fill(value, { timeout: 4000 }) } catch { return false }
  await tap(page.locator('.g8-field:not(.g8-field-done) .g8-field-go').first(), where)
  await page.waitForTimeout(260)
  return true
}

const clickOpt = async (page, id, where) => {
  // Варианты появляются НЕ сразу: на экранах 3 и 4 сначала рвётся черта
  // дроби (420 мс), и только потом встаёт вопрос по ходу. Считать опции
  // сразу — значит мерить не экран, а свою задержку.
  await page.locator('.g8-opt').first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {})
  const all = await page.locator('.g8-opt').all()
  // Кнопки варианта не несут id, поэтому идём по порядку из данных урока:
  // индексы совпадают, потому что варианты в 8 классе НЕ перемешиваются
  // на хуке и в правиле (перемешивание — у блица и коротких вопросов).
  const idx = {
    table: 0, plot: 1, both: 2, broken: 3,   // хук: порядок из данных урока
    none: 0, zero: 1, no: 0, yes: 1,         // вопрос по ходу в TapPart
    a: 0, b: 1, c: 2, d: 3,
  }[id]
  if (idx === undefined || !all[idx]) return false
  await tap(all[idx], where)
  await page.waitForTimeout(260)
  return true
}

for (const size of SIZES) {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: size.w, height: size.h } })
  // 404 без адреса — бесполезная строка. В headless Chromium это почти
  // всегда шрифты Google, которых на машине нет; урок к ним отношения не
  // имеет. Пишем АДРЕС и внешние шрифты не считаем ошибкой урока.
  page.on('response', (r) => {
    if (r.status() < 400) return
    const u = r.url()
    if (/fonts\.(googleapis|gstatic)\.com/.test(u)) return
    errors.push(`${size.name}: ${r.status()} ${u.slice(0, 110)}`)
  })
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    const txt = m.text()
    if (/Failed to load resource/.test(txt)) return   // адрес пишет обработчик выше
    errors.push(`${size.name}: ${txt.slice(0, 150)}`)
  })
  page.on('pageerror', (e) => errors.push(`${size.name}: PAGEERROR ${String(e).slice(0, 150)}`))
  await page.goto(URL, { waitUntil: 'networkidle' })
  // Звук выключаем: иначе замок инструкции держит ответ 12 секунд на экран.
  // Проверяем, что выключился: на 390 кнопку перекрывал переключатель языка
  // оболочки, и прогон шёл со звуком — то есть мерил не то, что думал.
  await page.waitForTimeout(400)
  const sound = page.locator('.g8-tool-sound:visible')
  if (await sound.count()) await sound.first().click({ force: true })
  await page.waitForTimeout(300)
  const cls = await sound.first().getAttribute('class').catch(() => '')
  if (cls && cls.includes('is-on')) {
    errors.push(`${size.name}: кнопка звука не сработала — она перекрыта (§20 п. 35б)`)
  }

  for (let i = 0; i < 15; i += 1) {
    // Мерить СРАЗУ при входе нельзя: блоки выезжают каскадом 120/240/360 мс,
    // и замер ловит их в пути. Экран 5 из-за этого показывал +3 пикселя,
    // которых после оседания нет (проверено 2026-08-16: тот же экран даёт
    // запас -7). Грабля записана в эталоне и стоила четырёх правок вёрстки.
    await page.waitForTimeout(520)
    const box = await measure(page)
    if (!box) { errors.push(`${size.name}: экран ${i + 1} — .g8-body не найден`); break }
    if (box.cut > 2 || box.hScroll > 2 || box.vScroll > 2 || box.clipped > 0) {
      cuts.push(`${size.name}, экран ${i + 1}: обрезка +${box.cut}px, гор. +${box.hScroll}, верт. +${box.vScroll}, режущих контейнеров ${box.clipped} (зона ${box.bodyH}px)`)
    }
    if (i === 14) break

    const at = `${size.name}, экран ${i + 1}`
    const s = SOLVE[i]
    // Демо-экран идёт сам: рука, полёт числа, разрыв черты.
    if (s.wait) await page.waitForTimeout(s.wait)
    // Лента кадров: кадр открывается только после предыдущего.
    for (const id of s.frames || []) {
      await tap(page.locator(`.g8-film-k[data-frame="${id}"]`), at)
      await page.waitForTimeout(260)
    }
    // Тап по части записи — рука работает ВНУТРИ записи.
    if (s.part) {
      await tap(page.locator(`.g8-tap[data-part="${s.part}"]`), at)
      await page.waitForTimeout(260)
    }
    // «Решаем вместе»: строки копятся и НИЧЕГО не стирается, поэтому самое
    // высокое состояние экрана — последнее. Открываем решение до конца, иначе
    // замер «после ответа» померит середину, а не то, что увидит ученик.
    if (s.solve) {
      for (let k = 0; k < 16; k += 1) {
        const ask = page.locator('.g8-sv-ask')
        if (await ask.count()) {
          // Верный вариант убирает вопрос. Идём по индексу: неверный остаётся
          // на месте, и `first()` продолжал бы указывать на него.
          const n = await ask.locator('.g8-opt').count()
          for (let o = 0; o < n; o += 1) {
            await tap(ask.locator('.g8-opt').nth(o), at)
            await page.waitForTimeout(200)
            if (await page.locator('.g8-sv-ask').count() === 0) break
          }
        }
        const next = page.locator('.g8-sv-next')
        if (await next.count() === 0) break
        await tap(next.first(), at)
        await page.waitForTimeout(240)
      }
    }
    // `TwoSides`: действие идёт к обеим частям, шагов несколько. Верное
    // действие убирает ряд кнопок и открывает следующий шаг, неверное
    // остаётся на месте — поэтому идём по индексу, а не по first().
    if (s.twosides) {
      for (let k = 0; k < 10; k += 1) {
        const acts = page.locator('.g8-ts-acts')
        if (await acts.count() === 0) break
        const n = await acts.locator('.g8-opt').count()
        if (!n) break
        for (let o = 0; o < n; o += 1) {
          await tap(acts.locator('.g8-opt').nth(o), at)
          await page.waitForTimeout(220)
          if (await page.locator('.g8-ts-acts .g8-opt').count() !== n) break
        }
      }
    }
    // Клетки заполняются по порядку: жмём нужную фишку на каждом шаге.
    // Клетки заполняются по порядку: ищем фишку по тексту и жмём.
    if (s.cells) {
      // Сначала ждём показ и жмём «Теперь я сам».
      await page.waitForTimeout(6500)
      const self = page.locator('.g8-fl-self')
      if (await self.count()) { await tap(self.first(), at); await page.waitForTimeout(400) }
      for (const c of s.cells) {
        const chips = await page.locator('.g8-fl-chip').all()
        let hit = null
        for (const ch of chips) { const tx = (await ch.textContent() || '').trim(); if (tx === c) { hit = ch; break } }
        if (hit) { await tap(hit, at); await page.waitForTimeout(200) }
      }
    }
    // Пять примеров подряд: верный вариант первый в данных урока.
    if (s.drill) {
      for (let k = 0; k < s.drill; k += 1) {
        const opts = page.locator('.g8-dr-opts .g8-opt')
        if (await opts.count() === 0) break
        await tap(opts.first(), at)
        await page.waitForTimeout(260)
        const nx = page.locator('.g8-dr-next')
        if (await nx.count()) { await tap(nx.first(), at); await page.waitForTimeout(240) }
      }
    }
    // Счётчики: жмём минус у правого столбца, пока не доведём до нуля.
    if (s.dial !== undefined) {
      // Сначала обратная задача: доводим количество до четырёх (цена 150),
      // потом роняем приложение нулём.
      const plus = page.locator('.g8-st-col').nth(1).locator('.g8-st-btn').last()
      const minus = page.locator('.g8-st-col').nth(1).locator('.g8-st-btn').first()
      await tap(plus, at); await page.waitForTimeout(200)
      for (let k = 0; k < 6; k += 1) { await tap(minus, at); await page.waitForTimeout(170) }
    }
    // Сборка записи: кладём число сверху и букву снизу — это и есть ответ.
    if (s.slots) {
      // Два круга: сначала число снизу (безопасно), потом буква снизу.
      const cells = page.locator('.g8-fs-cell')
      if (await cells.count() >= 2) {
        await tap(cells.nth(0).locator('.g8-fs-btn').first(), at)
        await page.waitForTimeout(200)
        await tap(cells.nth(1).locator('.g8-fs-btn').first(), at)
        await page.waitForTimeout(1100)
        await tap(cells.nth(0).locator('.g8-fs-btn').first(), at)
        await page.waitForTimeout(200)
        await tap(cells.nth(1).locator('.g8-fs-btn').last(), at)
        await page.waitForTimeout(300)
      }
    }
    // Граница: тапаем числа, пока записи не разойдутся.
    if (s.pair) {
      const btns = page.locator('.g8-tr-nums .g8-fd-btn')
      const n = await btns.count()
      for (let k = 0; k < n; k += 1) { await tap(btns.nth(k), at); await page.waitForTimeout(200) }
    }
    // Опора: карточки записей, верная — третья по порядку данных урока.
    if (s.cards !== undefined) {
      const cards = page.locator('.g8-pb-card')
      const n = await cards.count()
      for (let k = 0; k < n; k += 1) {
        await tap(cards.nth(k), at)
        await page.waitForTimeout(220)
        if (await page.locator('.g8-pb-card.is-ok').count()) break
      }
    }
    // Хук: жмём числа по порядку и доводим до того, на котором машина встала.
    if (s.feed !== undefined) {
      // Хук: сначала прогноз, он отпирает числа.
      const bet = page.locator('.g8-fd-betbtn')
      if (await bet.count()) { await tap(bet.first(), at); await page.waitForTimeout(260) }
      const btns = page.locator('.g8-fd-btn')
      const n = await btns.count()
      for (let k = 0; k < n; k += 1) {
        await tap(btns.nth(k), at)
        await page.waitForTimeout(200)
      }
    }
    // Лупа: жмём «Приблизить», пока кнопка не погаснет, потом отвечаем.
    // Вопрос появляется ТОЛЬКО на последнем окне — иначе меряли бы не тот экран.
    if (s.zoom) {
      // Приближение теперь ползунок: доводим его до края.
      const zs = page.locator('.g8-hz-track input')
      if (await zs.count()) {
        const max = await zs.first().getAttribute('max')
        await zs.first().fill(String(max)).catch(() => {})
        await page.waitForTimeout(320)
      }
      const opts = page.locator('.g8-hz-opts .g8-opt')
      const n = await opts.count()
      for (let o = 0; o < n; o += 1) {
        await tap(opts.nth(o), at)
        await page.waitForTimeout(200)
        if (await page.locator('.g8-hz-opts').count() === 0) break
      }
    }
    // Сборка правила: по стабильным id, потому что фрагменты перемешаны.
    for (const id of s.chips || []) {
      await tap(page.locator(`.g8-rb-chip[data-id="${id}"]`), at)
      await page.waitForTimeout(200)
    }
    for (const id of s.picks || []) await clickOpt(page, id, at)
    for (const v of s.nums || []) await typeField(page, v, at)
    for (const id of s.picksAfter || []) await clickOpt(page, id, at)
    for (const k of s.acts || []) {
      await tap(page.locator('.g8-act').nth(k), at)
      await page.waitForTimeout(220)
    }
    for (const v of s.fields || []) await typeField(page, v, at)
    if (s.none) {
      const nb = page.locator('.g8-none')
      if (await nb.count()) await tap(nb.first(), at)
      await page.waitForTimeout(200)
    }
    for (const k of s.acts2 || []) {
      await tap(page.locator('.g8-act').nth(k), at)
      await page.waitForTimeout(220)
    }
    for (const id of s.frames2 || []) {
      await tap(page.locator(`.g8-film-k[data-frame="${id}"]`), at)
      await page.waitForTimeout(260)
    }
    for (const v of s.fields2 || []) await typeField(page, v, at)
    for (const id of s.marks || []) await clickOpt(page, id, at)
    // Ловушка: строки решения — это `.g8-audit-row`, а не варианты ответа.
    for (const k of s.rows || []) {
      await tap(page.locator('.g8-audit-row').nth(k), at)
      await page.waitForTimeout(260)
    }
    for (const v of s.proof || []) await typeField(page, v, at)
    if (s.blitz) {
      // Отвеченный вопрос СВОРАЧИВАЕТСЯ в строку и исчезает из `.g8-blitz-q`,
      // поэтому берём каждый раз первый открытый, а не список сразу.
      for (let q = 0; q < 4; q += 1) {
        const open = page.locator('.g8-blitz-q').first()
        if (await open.count() === 0) break
        const n = await open.locator('.g8-opt').count()
        for (let o = 0; o < n; o += 1) {
          const before = await page.locator('.g8-blitz-q').count()
          // Вариант выбирается ПО ИНДЕКСУ: неверный становится disabled, и
          // `first()` продолжал бы указывать на него.
          await tap(open.locator('.g8-opt').nth(o), at)
          await page.waitForTimeout(200)
          if (await page.locator('.g8-blitz-q').count() < before) break
        }
      }
    }

    // Мерим ВТОРОЙ раз — после решения. §20 п. 35 требует каждого шага
    // открытия, а не финального состояния: экран может влезать до ответа и
    // не влезать после него. Ровно так вышло на экране 12.
    const after = await measure(page)
    if (after && (after.cut > 2 || after.hScroll > 2 || after.vScroll > 2 || after.clipped > 0)) {
      cuts.push(`${at}, ПОСЛЕ ответа: обрезка +${after.cut}px, гор. +${after.hScroll}, режущих ${after.clipped} (зона ${after.bodyH}px)`)
    }

    const next = page.locator('.g8-nav .g8-btn-solid').first()
    if (await next.count() === 0) break
    // Замок перехода отпускает через 700 мс после решения и только когда
    // речь закончилась (§13.3). Проверять сразу — мерить замок, а не экран.
    await page.waitForTimeout(900)
    if (await next.isDisabled()) {
      cuts.push(`${size.name}, экран ${i + 1}: «Продолжить» закрыта — экран не решается по фикстуре`)
      break
    }
    await tap(next, at)
    await page.waitForTimeout(360)
  }
  await browser.close()
}

console.log('')
if (freeNav) {
  console.log('  FREE_NAV = true: замок перехода выключен (режим просмотра).')
  console.log('  Проверка «экран решается» НЕ работает, мерится только вёрстка.')
}
console.log(`  ошибок консоли: ${errors.length}`)
;[...new Set(errors)].slice(0, 10).forEach((e) => console.log('   ✗ ' + e))
console.log(`  обрезка и прокрутка: ${cuts.length}`)
cuts.slice(0, 25).forEach((s) => console.log('   ! ' + s))
console.log('')
if (errors.length || cuts.length) process.exitCode = 1
else console.log('  урок проходится целиком, прокрутки и обрезки нет\n')
