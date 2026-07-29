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
      const expressions = [
        ...document.querySelectorAll(
          '.g7w-expression, .g7w-solution-expression, .g7w-numbered-expression, .g7w-expression-window',
        ),
      ]
      const fittedBoxes = [
        ...document.querySelectorAll('.g7w-content, .g7w-screen, .g7w-frame'),
      ]

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
        fitIssues: fittedBoxes
          .filter((element) => (
            element.scrollWidth > element.clientWidth + 1
            || element.scrollHeight > element.clientHeight + 1
          ))
          .map((element) => ({
            className: element.className,
            scroll: [element.scrollWidth, element.scrollHeight],
            client: [element.clientWidth, element.clientHeight],
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
    if (result.fitIssues.length) {
      issues.push(`${label}: clipped content ${JSON.stringify(result.fitIssues)}`)
    }
  }

  const capture = async (screenNumber) => {
    await page.waitForTimeout(900)
    await audit(`screen-${screenNumber}`)
    await page.screenshot({
      path: `${out}/${name}-${String(screenNumber).padStart(2, '0')}.png`,
      fullPage: false,
    })
  }

  await audit('screen-1-initial')
  await page.screenshot({ path: `${out}/${name}-01-initial.png`, fullPage: false })
  await page.locator('.g7w-start-button').click({ force: true })
  await page.locator('.g7w-answer-row input').fill('124')
  await page.locator('.g7w-answer-row button').click()
  await page.waitForTimeout(450)
  await capture(1)

  await page.locator('.g7w-next').click()
  await page.locator('.g7w-route-card').nth(0).click({ force: true })
  await page.waitForTimeout(250)
  await page.locator('.g7w-route-card').nth(1).click({ force: true })
  await page.waitForTimeout(1600)
  await capture(2)

  await page.locator('.g7w-next').click()
  for (let index = 0; index < 3; index += 1) {
    await page.locator('.g7w-rule-card').nth(index).click({ force: true })
    await page.waitForTimeout(240)
  }
  await page.waitForTimeout(1600)
  await capture(3)

  const lineScreenStepCounts = [3, 2, 2]
  for (let screenIndex = 0; screenIndex < lineScreenStepCounts.length; screenIndex += 1) {
    await page.locator('.g7w-next').click()
    const stepCount = lineScreenStepCounts[screenIndex]
    for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
      await page.locator('.g7w-line-step-card').nth(stepIndex).click({ force: true })
      await page.waitForTimeout(260)
    }
    await page.waitForTimeout(1600)
    const screenNumber = screenIndex + 4
    await capture(screenNumber)
  }

  await page.locator('.g7w-next').click()
  await page.waitForTimeout(550)
  await audit('screen-7-initial')
  for (let index = 0; index < 7; index += 1) {
    await page.locator('.g7w-number-next').click()
    await page.waitForTimeout(120)
  }
  await capture(7)

  await page.locator('.g7w-next').click()
  await page.waitForTimeout(550)
  await audit('screen-8-initial')
  for (let index = 0; index < 7; index += 1) {
    await page.locator('.g7w-number-tabs button').nth(index).click()
    await page.waitForTimeout(100)
  }
  await capture(8)

  await page.locator('.g7w-next').click()
  await page.waitForTimeout(550)
  await audit('screen-9-initial')
  await page.locator('.g7w-choice-grid button').nth(1).click()
  await capture(9)

  await page.locator('.g7w-next').click()
  await page.waitForTimeout(550)
  await audit('screen-10-initial')
  for (const index of [1, 0, 2]) {
    await page.locator('.g7w-order-options button').nth(index).click()
    await page.waitForTimeout(120)
  }
  await capture(10)

  await page.locator('.g7w-next').click()
  await page.waitForTimeout(550)
  await audit('screen-11-initial')
  await page.locator('.g7w-choice-grid button').nth(0).click()
  await capture(11)

  await page.locator('.g7w-next').click()
  await page.waitForTimeout(550)
  await audit('screen-12-initial')
  await page.locator('.g7w-choice-grid button').nth(1).click()
  await capture(12)

  await page.locator('.g7w-next').click()
  await page.waitForTimeout(550)
  for (const [stageIndex, index] of [1, 1, 1, 0].entries()) {
    await audit(`screen-13-stage-${stageIndex + 1}-initial`)
    await page.locator('.g7w-choice-grid button').nth(index).click()
    await page.waitForTimeout(140)
    await audit(`screen-13-stage-${stageIndex + 1}-selected`)
    await page.locator('.g7w-guided-next').click()
    await page.waitForTimeout(140)
  }
  await capture(13)

  await page.locator('.g7w-next').click()
  await page.waitForTimeout(550)
  await audit('screen-14-initial')
  await page.locator('.g7w-choice-grid button').nth(0).click()
  await capture(14)

  await page.locator('.g7w-next').click()
  await page.waitForTimeout(550)
  await audit('screen-15-initial')
  await page.locator('.g7w-independent-answer input').fill('52')
  await page.locator('.g7w-independent-answer button').click()
  await capture(15)

  await page.locator('.g7w-next').click()
  await page.waitForTimeout(550)
  await audit('screen-16-initial')
  await page.locator('.g7w-reflection-grid button').nth(0).click()
  await capture(16)

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
  console.log('Grade 7 lesson smoke test passed: 16 screens, desktop and two mobile sizes.')
}
