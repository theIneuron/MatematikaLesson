// Bitta kartochkani KATTALASHTIRIB oladi: yozuvlar urishayotganini faqat
// shu tarzda ko'rish mumkin. CARD -- kartochka tartib raqami (0 dan).
import { chromium } from 'playwright'

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1180, height: 1200 }, deviceScaleFactor: 3 })
await p.goto('http://localhost:5299/probe/space.html', { waitUntil: 'networkidle' })
await p.waitForTimeout(Number(process.env.WAIT || 700))
const idx = Number(process.env.CARD || 0)
const card = p.locator('#r > div > div > div').nth(idx)
console.log('card:', (await card.textContent()).slice(0, 60))
await card.screenshot({ path: process.env.OUT || 'C:/tmp/zoom.png' })
await b.close()
