import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const base = 'http://127.0.0.1:5173/7-sinf/matematika/nazariy/dars01-sonli-ifodalar'
const out = '.tmp/grade7-smoke'

await mkdir(out, { recursive: true })

const browser = await chromium.launch({ headless: true })

async function auditViewport(name, viewport, runLesson = false) {
  const page = await browser.newPage({ viewport })
  const issues = []
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('ERR_NETWORK_ACCESS_DENIED')) {
      issues.push(`console: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => issues.push(`pageerror: ${error.message}`))
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.locator('.g7-lesson').waitFor()

  const audit = async (label) => {
    const result = await page.evaluate(() => {
      const root = document.querySelector('.g7-lesson')
      const stage = document.querySelector('.g7-stage')
      const formulaIssues = [...document.querySelectorAll(
        '.g7-formula, .g7-inline-expression, .g7-numbered-expression',
      )]
        .filter((element) => element.scrollWidth > element.clientWidth + 1)
        .map((element) => ({
          className: element.className,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          text: element.textContent.trim(),
        }))
      return {
        viewport: [window.innerWidth, window.innerHeight],
        document: [document.documentElement.scrollWidth, document.documentElement.scrollHeight],
        root: root ? [root.scrollWidth, root.scrollHeight, root.clientWidth, root.clientHeight] : null,
        stage: stage ? [stage.scrollWidth, stage.scrollHeight, stage.clientWidth, stage.clientHeight] : null,
        formulaIssues,
      }
    })
    if (result.document[0] > result.viewport[0] || result.document[1] > result.viewport[1]) {
      issues.push(`${label}: document overflow ${JSON.stringify(result)}`)
    }
    if (result.formulaIssues.length) {
      issues.push(`${label}: formula overflow ${JSON.stringify(result.formulaIssues)}`)
    }
  }

  await audit('screen-1')
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${out}/${name}-01.png`, fullPage: false })

  if (runLesson) {
    const next = page.locator('.g7-nav-next')

    await page.locator('.g7-answer-row input').fill('124')
    await page.locator('.g7-check').click()
    await next.click()
    await page.locator('.g7-math-op.g7-action-pulse').first().click()
    await audit('screen-2')
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${out}/${name}-02.png`, fullPage: false })

    await next.click()
    await page.locator('.g7-math-fragment').first().click()
    await page.locator('.g7-math-fragment').first().click()

    await next.click()
    await page.locator('.g7-math-fragment').click()

    await next.click()
    await page.locator('.g7-math-fragment').first().click()
    await page.locator('.g7-math-fragment').first().click()

    await next.click()
    for (let index = 0; index < 5; index += 1) {
      await page.locator('.g7-step-button').click()
    }

    await next.click()
    for (let index = 0; index < 7; index += 1) {
      await page.locator('.g7-nf-operation.g7-action-pulse').click()
    }
    await audit('screen-7')
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${out}/${name}-07.png`, fullPage: false })

    await next.click()
    for (let index = 0; index < 3; index += 1) {
      await page.locator('.g7-rule-builder button.g7-action-pulse').click()
    }
    await audit('screen-8')
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${out}/${name}-08.png`, fullPage: false })

    await next.click()
    for (let index = 0; index < 5; index += 1) {
      await page.locator('.g7-fragment-choice').click()
    }

    await next.click()
    for (let index = 0; index < 4; index += 1) {
      await page.locator('.g7-nf-operation.g7-action-pulse').click()
    }

    await next.click()
    await page.locator('.g7-answer-row input').fill('78')
    await page.locator('.g7-check').click()
    await audit('screen-11')
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${out}/${name}-11.png`, fullPage: false })

    await next.click()
    await page.locator('.g7-choice-row button').filter({ hasText: '16' }).click()

    await next.click()
    await page.locator('.g7-error-lines button').nth(2).click()

    await next.click()
    await page.locator('.g7-bracket-options button').nth(1).click()

    await next.click()
    await page.locator('.g7-strategy-options button').first().click()
    await page.locator('.g7-answer-row input').fill('88')
    await page.locator('.g7-check').click()

    await next.click()
    await page.locator('.g7-answer-row input').fill('158')
    await page.locator('.g7-check').click()
    await page.locator('.g7-final-rules button').first().click()
    await audit('screen-16')
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${out}/${name}-16.png`, fullPage: false })
  }

  await page.close()
  return issues
}

const desktopIssues = await auditViewport('desktop', { width: 1366, height: 768 }, true)
const mobileIssues = await auditViewport('mobile', { width: 390, height: 844 }, true)

await browser.close()

const issues = [...desktopIssues, ...mobileIssues]
if (issues.length) {
  console.error(issues.join('\n'))
  process.exitCode = 1
} else {
  console.log('Grade 7 lesson smoke test passed: 16 screens, desktop and mobile.')
}
