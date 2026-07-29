import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const base = 'http://127.0.0.1:5173/7-sinf/matematika/nazariy/dars01-sonli-ifodalar'
const out = '.tmp/grade7-smoke'

await mkdir(out, { recursive: true })

const browser = await chromium.launch({ headless: true })

async function auditViewport(name, viewport) {
  const page = await browser.newPage({ viewport })
  const issues = []

  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('ERR_NETWORK_ACCESS_DENIED')) {
      issues.push(`console: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => issues.push(`pageerror: ${error.message}`))

  await page.goto(base, { waitUntil: 'networkidle' })
  await page.locator('.g7w-root').waitFor()

  const audit = async (label) => {
    const result = await page.evaluate(() => {
      const root = document.querySelector('.g7w-root')
      const stage = document.querySelector('.g7w-stage')
      const expressions = [...document.querySelectorAll('.g7w-expression')]

      return {
        viewport: [window.innerWidth, window.innerHeight],
        document: [
          document.documentElement.scrollWidth,
          document.documentElement.scrollHeight,
        ],
        root: root
          ? [root.scrollWidth, root.scrollHeight, root.clientWidth, root.clientHeight]
          : null,
        stage: stage
          ? [stage.scrollWidth, stage.scrollHeight, stage.clientWidth, stage.clientHeight]
          : null,
        expressionIssues: expressions
          .filter((element) => element.scrollWidth > element.clientWidth + 1)
          .map((element) => ({
            className: element.className,
            scrollWidth: element.scrollWidth,
            clientWidth: element.clientWidth,
            text: element.textContent.trim(),
          })),
      }
    })

    if (result.document[0] > result.viewport[0] || result.document[1] > result.viewport[1]) {
      issues.push(`${label}: document overflow ${JSON.stringify(result)}`)
    }
    if (result.root && (result.root[0] > result.root[2] || result.root[1] > result.root[3])) {
      issues.push(`${label}: root overflow ${JSON.stringify(result.root)}`)
    }
    if (result.stage && (result.stage[0] > result.stage[2] || result.stage[1] > result.stage[3])) {
      issues.push(`${label}: stage overflow ${JSON.stringify(result.stage)}`)
    }
    if (result.expressionIssues.length) {
      issues.push(`${label}: expression overflow ${JSON.stringify(result.expressionIssues)}`)
    }
  }

  await audit('screen-1-initial')
  await page.screenshot({ path: `${out}/${name}-01-initial.png`, fullPage: false })
  await page.locator('.g7w-start-button').click({ force: true })
  await page.locator('.g7w-answer-row input').fill('124')
  await page.locator('.g7w-answer-row button').click()
  await page.waitForTimeout(450)
  await audit('screen-1-saved')
  await page.screenshot({ path: `${out}/${name}-01.png`, fullPage: false })

  await page.locator('.g7w-next').click()
  await page.locator('.g7w-route-card').nth(0).click({ force: true })
  await page.waitForTimeout(250)
  await page.locator('.g7w-route-card').nth(1).click({ force: true })
  await page.waitForTimeout(450)
  await audit('screen-2')
  await page.screenshot({ path: `${out}/${name}-02.png`, fullPage: false })

  await page.locator('.g7w-next').click()
  for (let index = 0; index < 3; index += 1) {
    await page.locator('.g7w-rule-card').nth(index).click({ force: true })
    await page.waitForTimeout(240)
  }
  await page.waitForTimeout(450)
  await audit('screen-3')
  await page.screenshot({ path: `${out}/${name}-03.png`, fullPage: false })

  await page.close()
  return issues
}

const desktopIssues = await auditViewport('desktop', { width: 1366, height: 768 })
const mobileIssues = await auditViewport('mobile', { width: 390, height: 844 })
const compactMobileIssues = await auditViewport('mobile-compact', { width: 360, height: 740 })

await browser.close()

const issues = [...desktopIssues, ...mobileIssues, ...compactMobileIssues]
if (issues.length) {
  console.error(issues.join('\n'))
  process.exitCode = 1
} else {
  console.log('Grade 7 window prototype smoke test passed: 3 screens, desktop and two mobile sizes.')
}
