// ============================================================================
// grade10-figure-shot.mjs — СНИМОК СТЕНДА ФИГУР.
//
// ЗАЧЕМ. Эталон §5.1 требует, чтобы объяснение показывало, а не рассказывало.
// Показывает фигура — и её нельзя утвердить, глядя на код: `Unroll` в уроке 6
// была написана трижды, и два варианта отвергнуты именно по снимку (мелкий
// треугольник, невидимые направляющие). Дешевле снять кадр, чем собрать урок.
//
// Что делает: открывает `probe/figures.html`, ждёт нужный кадр по надписи
// `step N` и сохраняет png в `.tmp/figures/`.
//
// Запуск (стенд должен быть поднят: npx vite --port 5299 --strictPort):
//   node scripts/grade10-figure-shot.mjs
//   node scripts/grade10-figure-shot.mjs --steps 0,1,2 --port 5299
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const val = (name, def) => {
  const i = args.indexOf('--' + name)
  return i === -1 ? def : args[i + 1]
}
const PORT = val('port', '5299')
const STEPS = String(val('steps', '0,1,2')).split(',').map((s) => Number(s.trim()))
const OUT = path.resolve('.tmp/figures')
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 2 })
const errs = []
page.on('pageerror', (e) => errs.push(String(e).slice(0, 200)))
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)) })

await page.goto(`http://localhost:${PORT}/probe/figures.html`, { waitUntil: 'networkidle', timeout: 60000 })

// Кадр ловится ПО НАДПИСИ, а не по таймеру: стенд крутит кадры сам, и жёсткое
// ожидание снимало бы то один, то другой.
const waitStep = async (n, ms = 20000) => {
  for (let t = 0; t < ms; t += 200) {
    const now = await page.evaluate(() => {
      const el = document.getElementById('stepnow')
      return el ? el.textContent : ''
    })
    if (now === 'step ' + n) return true
    await page.waitForTimeout(200)
  }
  return false
}

for (const n of STEPS) {
  const ok = await waitStep(n)
  if (!ok) { console.log(`кадр ${n}: не дождался`); continue }
  // Даём анимации доехать: кадр интересен в конце движения, а не в начале.
  await page.waitForTimeout(2600)
  const file = path.join(OUT, `step${n}.png`)
  await page.screenshot({ path: file, fullPage: true })
  console.log('снято:', file)
}

if (errs.length) {
  console.log('\nОШИБКИ СТЕНДА:')
  for (const e of errs.slice(0, 6)) console.log('  ' + e)
} else {
  console.log('\nконсоль чистая')
}
await browser.close()
