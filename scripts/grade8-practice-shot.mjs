// 8-sinf amaliyotining SURATI: metodist ko'rishi uchun.
// Har topshiriq ikki holatda olinadi: javobdan OLDIN va razbor bilan.
//
//   npx vite --port 5199 --strictPort
//   node scripts/grade8-practice-shot.mjs               # 1366x655, uz, hammasi
//   node scripts/grade8-practice-shot.mjs 5 ru          # bitta topshiriq
//   G8_VP=390x745 node scripts/grade8-practice-shot.mjs # telefon
//
// Javoblar `grade8-practice-plan.mjs` dan olinadi: ikki joyda saqlanmaydi.
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { PLAN, step } from './grade8-practice-plan.mjs'

const PORT = process.env.G8_PORT || '5199'
const SLUG = process.env.G8_SLUG || 'dars01-amaliyot'
const OUT = '.tmp/grade8-practice/shot'
const only = process.argv[2] ? Number(process.argv[2]) : null
const lang = process.argv[3] || 'uz'
const [w, h] = (process.env.G8_VP || '1366x655').split('x').map(Number)

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize({ width: w, height: h })
await page.goto(`http://localhost:${PORT}/8-sinf/matematika/amaliy/${SLUG}?lang=${lang}`, { waitUntil: 'networkidle' })
await page.waitForSelector('.pq-root')
await mkdir(OUT, { recursive: true })

for (let i = 0; i < PLAN.length; i += 1) {
  const n = i + 1
  await page.waitForSelector('.pq-wrap')
  for (const act of PLAN[i]) await step(page, act)
  if (!only || only === n) {
    await page.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${lang}-oldin.png` })
  }
  await page.locator('[data-go="1"]').click()
  await page.waitForTimeout(150)
  if (!only || only === n) {
    await page.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${lang}-razbor.png` })
    console.log(`  ${n}: olindi`)
  }
  if (n < PLAN.length) await page.locator('[data-go="1"]').click()
  await page.waitForTimeout(80)
}
await page.locator('[data-go="1"]').click()
await page.waitForTimeout(200)
await page.screenshot({ path: `${OUT}/11-${lang}-yakun.png` })
await browser.close()
console.log(`Suratlar: ${OUT}`)
