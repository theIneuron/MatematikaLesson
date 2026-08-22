// ============================================================================
// layer8-smoke.mjs — прогон урока НА СЛОЕ 8 КЛАССА в браузере: консоль,
// обрезка, прокрутка (§20 п. 35, 35а, 36) на пяти размерах.
//
// ПОЧЕМУ ЭТОТ ФАЙЛ ЕСТЬ. Слой `components/grade8` теперь несёт не один класс:
// урок 1 девятого класса собран на нём же (решение методиста 2026-08-20).
// Прогон при этом одинаковый до последнего селектора — различаются только
// адрес урока и ФИКСТУРА ответов. Копировать 400 строк стенда во второй файл
// нельзя (CLAUDE.md §5), поэтому стенд живёт здесь, а класс приносит фикстуру.
//
// Фикстура — данные ТЕСТА, а не урока: если ответ в уроке изменится, прогон
// обязан упасть, а не подстроиться.
//
//   runSmoke({ port, section, slug, solve, styleFiles, coreFile })
// ============================================================================
import fs from 'node:fs'
import { chromium } from 'playwright'

const SIZES = [
  { w: 1366, h: 615, name: 'ноутбук узкий' },
  { w: 1366, h: 655, name: 'ноутбук' },
  { w: 1920, h: 950, name: 'большой экран' },
  { w: 390, h: 745, name: 'телефон' },
  { w: 360, h: 690, name: 'малый телефон' },
]

export const LAYER_STYLE_FILES = [
  ['src/components/grade8/core.jsx', 'STYLES'],
  ['src/components/grade8/tools.jsx', 'TOOLS_STYLES'],
  ['src/components/grade8/plot.jsx', 'PLOT_STYLES'],
  ['src/components/grade8/method.jsx', 'METHOD_STYLES'],
  ['src/components/grade8/twosides.jsx', 'TWOSIDES_STYLES'],
  ['src/components/grade8/math.jsx', 'MATH_STYLES'],
  ['src/components/grade8/feed.jsx', 'FEED_STYLES'],
]

export async function runSmoke({
  port = '5233', section = '8-sinf', slug, solve, lang, steps,
  styleFiles = LAYER_STYLE_FILES,
  coreFile = 'src/components/grade8/core.jsx',
}) {
  // Язык задаётся адресом (`?lang=`): требование «переключение работает на
  // каждом экране» проверяется прогоном на каждом языке, а не чтением кода.
  const q = lang ? `?lang=${lang}` : ''
  const URL = `http://localhost:${port}/${section}/matematika/nazariy/${slug}${q}`
  const SOLVE = solve
  const STYLE_FILES = styleFiles
  console.log(`
  ${URL}`)
  const errors = []
  const cuts = []

  // Прогон обязан честно сказать, что он мерил. При FREE_NAV = true «Продолжить»
  // открыта всегда, значит проверка «экран решается по фикстуре» НЕ работает:
  // скрипт пролистает урок, даже если задание не закрылось.
  const freeNav = /export const FREE_NAV = true/.test(
    fs.readFileSync(coreFile, 'utf8'),
  )


  // ============================================================================
  // СТОРОЖ СТРОК СТИЛЕЙ. Стоит ПЕРВЫМ, до браузера: обратная кавычка или
  // обратный слэш внутри шаблонной строки со стилями рвут её, урок отдаёт 500 и
  // белую страницу, а причину браузер не показывает. Поймано 2026-08-15 на
  // plot.jsx: слово в обратных кавычках внутри КОММЕНТАРИЯ оборвало PLOT_STYLES.
  // В 6 классе такой сторож есть с 14 августа, в 8 классе его не было.
  // ============================================================================
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
    return 1
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
      // ШАГИ ПРИБОРОВ КЛАССА. Если класс принёс свои приборы, он приносит и
      // свои шаги: их селекторы не должны заезжать в общий стенд. Хук
      // вызывается ПЕРВЫМ, до общих обработчиков.
      if (steps) await steps({ page, s, at, tap, cuts })
      // Демо-экран идёт сам: рука, полёт числа, разрыв черты.
      if (s.wait) await page.waitForTimeout(s.wait)
      // ОТВЕТ НА ЧЕРТЕЖЕ (`PlotTap`). Прибор считает клик отношениями внутри
      // кадра, поэтому фикстура даёт ДОЛЮ по оси x, а не пиксель: пиксель на
      // каждом из пяти размеров свой. Отступы кадра продублированы здесь
      // сознательно — это фикстура: изменится геометрия `plot.jsx`, и прогон
      // обязан упасть, а не молча промахнуться.
      if (s.chart) {
        const VB_W = 420
        const PAD_L = 30
        const PAD_R = 16
        const svg = page.locator('.g8-plotc').first()
        const box = await svg.boundingBox().catch(() => null)
        if (!box) {
          cuts.push(`${at}: чертёж не найден — прибор не встал`)
        } else {
          const hh = s.chart.h || 196
          const k = Math.min(box.width / VB_W, box.height / hh)
          const offX = box.x + (box.width - VB_W * k) / 2
          const offY = box.y + (box.height - hh * k) / 2
          const vx = PAD_L + s.chart.frac * (VB_W - PAD_R - PAD_L)
          await page.mouse.click(offX + vx * k, offY + (hh / 2) * k)
          await page.waitForTimeout(320)
        }
      }
      // ВОПРОСЫ ЦЕПОЧКИ (`Chain`) и ЗАКРЫВАЮЩИЙ ВОПРОС показа (`ShowThenAsk`)
      // рисуются одним и тем же блоком `.g8-ch-qopts`. Показ идёт сам, поэтому
      // сначала ждём, потом отвечаем: верный вариант убирает вопрос или
      // переводит счётчик, неверный остаётся на месте.
      if (s.ask) {
        await page.waitForTimeout(s.ask.wait || 6400)
        for (let round = 0; round < (s.ask.rounds || 1); round += 1) {
          const opts = page.locator('.g8-ch-qopts .g8-opt')
          const n = await opts.count()
          if (!n) {
            cuts.push(`${at}: вопрос не открылся — экран не закрывается`)
            break
          }
          for (let o = 0; o < n; o += 1) {
            await tap(opts.nth(o), at)
            await page.waitForTimeout(260)
            if (await page.locator('.g8-ch-qopts .g8-opt').count() !== n) break
          }
          await page.waitForTimeout(240)
        }
      }
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
        // Показ идёт САМ и длится столько, сколько в записи клеток, поэтому
        // ожидание задаёт фикстура: у урока с четырьмя строками показ дольше,
        // чем у урока с двумя, и жёсткие 6,5 секунды промахивались.
        // `groups` — по одному списку на задание: между заданиями прибор
        // переключается 1,1 с, и без паузы фишка следующего задания ещё не
        // нарисована, а клик уходит в пустоту.
        const plan = Array.isArray(s.cells)
          ? { wait: 6500, groups: [s.cells] }
          : { wait: s.cells.wait || 6500, groups: s.cells.groups || [] }
        await page.waitForTimeout(plan.wait)
        const self = page.locator('.g8-fl-self')
        if (await self.count()) { await tap(self.first(), at); await page.waitForTimeout(400) }
        for (const group of plan.groups) {
          for (const c of group) {
            const chips = await page.locator('.g8-fl-chip').all()
            let hit = null
            for (const ch of chips) { const tx = (await ch.textContent() || '').trim(); if (tx === c) { hit = ch; break } }
            if (hit) { await tap(hit, at); await page.waitForTimeout(220) }
            else cuts.push(`${at}: фишка «${c}» не найдена — запись не заполняется`)
          }
          await page.waitForTimeout(1500)
        }
      }
      // СЧЁТЧИК С ОДНИМ СТОЛБЦОМ: ученик крутит одно число, прибор считает.
      // `dial` ниже — про два столбца 8 класса, здесь столбец задаёт фикстура.
      if (s.bump) {
        const col = page.locator('.g8-st-col').nth(s.bump.col || 0)
        const plus = col.locator('.g8-st-btn').last()
        for (let k = 0; k < (s.bump.plus || 0); k += 1) {
          await tap(plus, at)
          await page.waitForTimeout(190)
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
        // ПРОДВИЖЕНИЕ СЧИТАЕТСЯ ПО ТОЧКАМ, а не по тексту заголовка. Прибор
        // после верного ответа ДЕРЖИТ вопрос открытым 2,2 с, чтобы ученик
        // прочитал разбор под своим выбором; заголовок при этом не меняется,
        // и стенд, подождав 220 мс, решал, что блиц застрял, и выходил после
        // первого вопроса. Экран при включённом замке не закрывался, и это
        // выглядело как дефект урока (найдено 2026-08-20 на 9 классе; в
        // 8 классе прогон до блица не доходил и потому молчал).
        const answered = () => page
          .locator('.g8-blitz-dots i.is-first, .g8-blitz-dots i.is-done').count()
        // ЖИВОЙ вариант, а не любой. Ответив, прибор ДЕРЖИТ вопрос 2,2 с с
        // уже погашенными вариантами, чтобы ученик прочитал разбор под своим
        // выбором. Стенд в это время видел кнопки, жал по ним (они мертвы),
        // не получал продвижения и решал, что блиц застрял — экран оставался
        // нерешённым, и это выглядело дефектом урока (найдено 2026-08-21).
        const live = () => page.locator('.g8-blitz-q .g8-opt:not([disabled])')
        for (let step = 0; step < 24; step += 1) {
          let n = 0
          for (let k = 0; k < 18; k += 1) {
            n = await live().count()
            if (n) break
            await page.waitForTimeout(400)
          }
          if (!n) break
          const before = await answered()
          let moved = false
          for (let o = 0; o < n; o += 1) {
            const opt = live().nth(o)
            if (await opt.count() === 0) break
            await opt.click({ force: true, timeout: 2500 }).catch(() => {})
            for (let k = 0; k < 10; k += 1) {
              await page.waitForTimeout(400)
              if (await answered() > before) { moved = true; break }
            }
            if (moved) break
          }
          if (!moved) break
        }
        // Пятый вопрос — сборка из летящих плиток: вариантов у него нет.
        // Ненайденная плитка теперь НАХОДКА, а не тихий пропуск: раньше
        // сборка молча оставалась незаконченной, вопрос неотвеченным, и
        // экран не закрывался, а причина в отчёте не называлась.
        if (s.tiles) {
          for (const v of s.tiles) {
            const tile = page.locator('.g8-cb-tile:not(.is-out)')
              .filter({ hasText: new RegExp('^\s*' + v + '\s*$') }).first()
            if (await tile.count() === 0) {
              const left = await page.locator('.g8-cb-tile:not(.is-out)').allInnerTexts().catch(() => [])
              cuts.push(`${at}: плитка «${v}» не найдена, на поле ${JSON.stringify(left)}`)
              continue
            }
            // Плитка обязана УЙТИ с поля. Если клик пришёлся на перекрывающую
            // плитку, запись собирается в другом порядке и сборка не
            // закрывается; молчать об этом нельзя, поэтому проверяем и
            // пробуем второй раз (найдено 2026-08-21 на 390 и 360 px).
            await tile.click({ force: true, timeout: 2500 }).catch(() => {})
            await page.waitForTimeout(320)
            if (await tile.count() > 0) {
              await tile.click({ force: true, timeout: 2500 }).catch(() => {})
              await page.waitForTimeout(320)
            }
            if (await tile.count() > 0) {
              cuts.push(`${at}: плитка «${v}» не ушла с поля — её перекрывает другая`)
            }
          }
          // Сборка закрывается через 1,6 с после верной последней плитки.
          await page.waitForTimeout(2200)
          if (await page.locator('.g8-cb-stage').count() > 0) {
            cuts.push(`${at}: сборка не закрылась — запись собрана неверно`)
          }
        }
      }

      // Мерим ВТОРОЙ раз — после решения. §20 п. 35 требует каждого шага
      // открытия, а не финального состояния: экран может влезать до ответа и
      // не влезать после него. Ровно так вышло на экране 12.
      //
      // ЖДЁМ ОСЕДАНИЯ. Таблица подстановки выезжает каскадом с задержками до
      // 1,5 с, и в полёте её строка на миг режет свой контейнер: прогон писал
      // «режущих 1» при отрицательной обрезке, то есть про экран, который
      // влезает (найдено 2026-08-21). Та же грабля, что при входе на экран.
      await page.waitForTimeout(1700)
      const after = await measure(page)
      if (after && (after.cut > 2 || after.hScroll > 2 || after.vScroll > 2 || after.clipped > 0)) {
        cuts.push(`${at}, ПОСЛЕ ответа: обрезка +${after.cut}px, гор. +${after.hScroll}, режущих ${after.clipped} (зона ${after.bodyH}px)`)
      }

      const next = page.locator('.g8-nav .g8-btn-solid').first()
      if (await next.count() === 0) break
      // Замок перехода отпускает через 700 мс после решения и только когда
      // речь закончилась (§13.3). Проверять сразу — мерить замок, а не экран.
      await page.waitForTimeout(900)
      // ЭКРАН РЕШЁН — ПРОВЕРЯЕТСЯ НЕЗАВИСИМО ОТ `FREE_NAV`. Класс
      // `g8-btn-ready` ядро ставит от `solved`, а не от замка, поэтому
      // проверка работает и в режиме просмотра. Раньше она держалась на
      // `disabled` и в режиме просмотра молчала: урок мог не закрывать ни
      // одного экрана, а прогон писал «проходится целиком».
      const cls = (await next.getAttribute('class')) || ''
      if (cls.indexOf('g8-btn-ready') === -1 && i !== SOLVE.length - 1) {
        cuts.push(`${size.name}, экран ${i + 1}: не закрылся — фикстура его не решает`)
      }
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
  // Замок перехода теперь задаётся УРОКОМ (`META.freeNav`), а не только
  // константой слоя, поэтому по константе о нём судить нельзя. Проверка
  // «экран решён» от замка не зависит вообще: она читает класс готовности,
  // который ядро ставит от `solved`.
  console.log(freeNav
    ? '  FREE_NAV = true в слое: замок перехода снят для всех уроков слоя.'
    : '  FREE_NAV = false в слое: замок держится, если урок не снял его сам.')
  console.log('  «Экран решён» проверяется по классу g8-btn-ready, замок на это не влияет.')
  console.log(`  ошибок консоли: ${errors.length}`)
  ;[...new Set(errors)].slice(0, 10).forEach((e) => console.log('   ✗ ' + e))
  console.log(`  обрезка и прокрутка: ${cuts.length}`)
  cuts.slice(0, 25).forEach((s) => console.log('   ! ' + s))
  console.log('')
  if (errors.length || cuts.length) return 1
  else console.log('  урок проходится целиком, прокрутки и обрезки нет\n')

  return 0
}
