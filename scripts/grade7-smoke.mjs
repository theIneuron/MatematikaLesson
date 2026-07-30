import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const port = process.env.GRADE7_PORT || '5181'
const base = `http://127.0.0.1:${port}/7-sinf/matematika/nazariy/dars01-sonli-ifodalar`
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

  await page.goto(`${base}?lang=en`, { waitUntil: 'networkidle' })
  await page.locator('[lang="en"]').waitFor()

  const audit = async (screenNumber) => {
    const result = await page.evaluate(() => {
      const root = document.querySelector('[lang="en"]')
      const stage = root?.firstElementChild
      const main = root?.querySelector('main')
      return {
        viewport: [window.innerWidth, window.innerHeight],
        document: [document.documentElement.scrollWidth, document.documentElement.scrollHeight],
        root: root ? [root.scrollWidth, root.scrollHeight, root.clientWidth, root.clientHeight] : null,
        stage: stage ? [stage.scrollWidth, stage.scrollHeight, stage.clientWidth, stage.clientHeight] : null,
        main: main ? [main.scrollWidth, main.scrollHeight, main.clientWidth, main.clientHeight] : null,
      }
    })

    if (result.document[0] > result.viewport[0] || result.document[1] > result.viewport[1]) {
      issues.push(`screen ${screenNumber}: document overflow ${JSON.stringify(result.document)} vs ${JSON.stringify(result.viewport)}`)
    }
    for (const key of ['root', 'stage', 'main']) {
      const box = result[key]
      if (box && (box[0] > box[2] + 1 || box[1] > box[3] + 1)) {
        issues.push(`screen ${screenNumber}: ${key} overflow ${JSON.stringify(box)}`)
      }
    }

    await page.screenshot({
      path: `${out}/${name}-${String(screenNumber).padStart(2, '0')}.png`,
      fullPage: false,
    })
  }

  const next = async () => {
    await page.getByRole('button', { name: 'Continue', exact: true }).click()
    await page.waitForTimeout(360)
  }

  await audit(1)
  await page.getByRole('button', { name: 'The modules used different operation orders', exact: true }).click()
  await next()

  await audit(2)
  await page.getByRole('button', { name: '17', exact: true }).click()
  await page.getByRole('button', { name: '3', exact: true }).click()
  await page.getByRole('button', { name: '8', exact: true }).click()
  await page.getByRole('button', { name: 'Check', exact: true }).click()
  await next()

  await audit(3)
  await page.getByRole('button', { name: '−', exact: true }).click()
  await page.getByRole('button', { name: ':', exact: true }).click()
  await page.getByRole('button', { name: '+', exact: true }).click()
  await page.getByRole('button', { name: 'Check', exact: true }).click()
  await next()

  await audit(4)
  await page.getByRole('button', { name: 'Expression', exact: true }).nth(0).click()
  await page.getByRole('button', { name: 'Equality', exact: true }).nth(1).click()
  await page.getByRole('button', { name: 'Invalid', exact: true }).nth(2).click()
  await page.getByRole('button', { name: 'Check', exact: true }).click()
  await next()

  await audit(5)
  for (const label of ['Numerical expression', 'Perform operations', 'Expression value']) {
    await page.getByRole('button', { name: label, exact: true }).click()
  }
  await next()

  await audit(6)
  await page.getByRole('button', { name: '14', exact: true }).nth(0).click()
  await page.getByRole('button', { name: '20', exact: true }).nth(1).click()
  await page.getByRole('button', { name: 'Check', exact: true }).click()
  await next()

  await audit(7)
  for (const label of ['Brackets', 'Multiplication and division', 'Addition and subtraction']) {
    await page.getByRole('button', { name: label, exact: true }).click()
  }
  await next()

  await audit(8)
  for (const label of ['9 − 3', '36 : 6', '5 · 2', '6 + 10']) {
    await page.getByRole('button', { name: label, exact: true }).click()
  }
  await next()

  await audit(9)
  for (const label of ['Evaluate brackets', 'Higher-priority operations', 'Lower-priority operations', 'Verify the result']) {
    await page.getByRole('button', { name: label, exact: true }).click()
  }
  await next()

  await audit(10)
  for (const label of ['18 : 3', '6 · 2', '42 − 12']) {
    await page.getByRole('button', { name: label, exact: true }).click()
  }
  await next()

  await audit(11)
  for (const label of ['8 − 2', '24 : 6', '4 · 3', '7 + 12']) {
    await page.getByRole('button', { name: label, exact: true }).click()
  }
  await next()

  await audit(12)
  await page.getByRole('button', { name: '9 + 3', exact: true }).click()
  await page.getByPlaceholder('0').fill('52')
  await page.getByRole('button', { name: 'Check', exact: true }).click()
  await next()

  await audit(13)
  await page.getByPlaceholder('Explain in two sentences…').fill('Group 25 and 4 first to make 100, then multiply 100 by 17.')
  await page.getByRole('button', { name: 'Check', exact: true }).click()
  await page.waitForTimeout(1100)
  await next()

  await audit(14)
  await page.getByRole('button', { name: 'Subtract 12 from 48 first', exact: true }).click()
  await next()

  await audit(15)
  await page.getByRole('button', { name: '10 − 2', exact: true }).click()
  await page.getByRole('button', { name: 'The operation in brackets comes first', exact: true }).click()
  await page.getByPlaceholder('0').fill('29')
  await page.getByRole('button', { name: 'Check', exact: true }).click()
  await next()

  await audit(16)
  await page.getByRole('button', { name: 'Finish lesson', exact: true }).click()
  await page.getByRole('button', { name: 'Result saved', exact: true }).waitFor()

  await page.close()
  return issues
}

async function auditLocales() {
  const page = await browser.newPage({ viewport: { width: 1100, height: 760 } })
  const issues = []
  for (const [lang, expected] of [
    ['uz', '7-sinf · Sonli ifodalar'],
    ['ru', '7 класс · Числовые выражения'],
    ['en', 'Grade 7 · Numerical expressions'],
  ]) {
    await page.goto(`${base}?lang=${lang}`, { waitUntil: 'networkidle' })
    if (!(await page.getByText(expected, { exact: false }).count())) {
      issues.push(`locale ${lang}: expected heading not found`)
    }
  }
  await page.close()
  return issues
}

async function auditFreeNavigation() {
  const page = await browser.newPage({ viewport: { width: 1000, height: 720 } })
  const issues = []
  await page.goto(`${base}?lang=en`, { waitUntil: 'networkidle' })
  const continueButton = page.getByRole('button', { name: 'Continue', exact: true })
  if (await continueButton.isDisabled()) {
    issues.push('free navigation: Continue is disabled before answering')
  } else {
    await continueButton.click()
    await page.waitForTimeout(360)
    if (!(await page.getByText('Three foundation skills', { exact: true }).count())) {
      issues.push('free navigation: lesson did not advance without an answer')
    }
  }
  await page.close()
  return issues
}

const desktopIssues = await auditViewport('desktop', { width: 1366, height: 768 })
const mobileIssues = await auditViewport('mobile', { width: 390, height: 844 })
const compactMobileIssues = await auditViewport('mobile-compact', { width: 360, height: 740 })
const localeIssues = await auditLocales()
const freeNavigationIssues = await auditFreeNavigation()

await browser.close()

const issues = [...desktopIssues, ...mobileIssues, ...compactMobileIssues, ...localeIssues, ...freeNavigationIssues]
if (issues.length) {
  console.error(issues.join('\n'))
  process.exitCode = 1
} else {
  console.log('Grade 7 lesson smoke test passed: 16 screens, UZ/RU/EN, desktop and mobile.')
}
