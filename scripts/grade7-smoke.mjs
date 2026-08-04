import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const port = process.env.GRADE7_PORT || '5181'
const base = `http://127.0.0.1:${port}/7-sinf/matematika/nazariy/dars01-sonli-ifodalar`
const out = '.tmp/grade7-smoke'
const totalSlides = 15
const totalPracticeTasks = 8
const screenshotSlides = new Set([1, 3, 6, 7, 8, 10, 12, 13, 14, 15])

await mkdir(out, { recursive: true })

const browser = await chromium.launch({ headless: true })

function attachRuntimeGuards(page, issues) {
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('ERR_NETWORK_ACCESS_DENIED')) {
      issues.push(`console: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => issues.push(`pageerror: ${error.message}`))
}

async function firstExisting(candidates) {
  for (const candidate of candidates) {
    const locator = typeof candidate === 'function' ? candidate() : candidate
    if (await locator.count()) return locator.first()
  }
  return null
}

async function requireLocator(candidates, label) {
  const locator = await firstExisting(candidates)
  if (!locator) throw new Error(`${label}: locator not found`)
  return locator
}

async function openLesson(page, lang = 'en') {
  await page.goto(`${base}?lang=${lang}`, { waitUntil: 'networkidle' })
  const root = await requireLocator([
    page.locator(`[data-testid="lesson-root"][lang="${lang}"]`),
    page.locator(`div[lang="${lang}"]`),
    page.locator(`[lang="${lang}"]`).last(),
  ], `locale ${lang} lesson root`)
  await root.waitFor()
  await page.waitForTimeout(720)
}

async function muteLesson(page, lang = 'en') {
  const muteNames = {
    en: 'Mute',
    ru: 'Выключить звук',
    uz: 'Ovozni o‘chirish',
  }
  const mute = await requireLocator([
    page.getByTestId('lesson-mute'),
    page.getByRole('button', { name: muteNames[lang], exact: true }),
  ], `locale ${lang} mute`)
  await mute.click()
}

function slideLabel(slide) {
  return `${String(slide).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`
}

async function waitForSlide(page, slide) {
  const expected = slideLabel(slide)
  const counter = await firstExisting([
    page.getByTestId('slide-counter'),
    page.getByTestId('lesson-slide-counter'),
  ])

  if (counter) {
    await counter.waitFor()
    const text = (await counter.textContent())?.replace(/\s+/g, ' ').trim() ?? ''
    if (text !== expected) {
      throw new Error(`slide ${slide}: counter is "${text}", expected "${expected}"`)
    }
    return
  }

  await page.getByText(expected, { exact: true }).waitFor()
}

async function nextButton(page) {
  return requireLocator([
    page.getByTestId('lesson-next'),
    page.getByTestId('slide-next'),
    page.getByRole('button', { name: 'Continue', exact: true }),
  ], 'lesson next')
}

async function backButton(page) {
  return requireLocator([
    page.getByTestId('lesson-back'),
    page.getByTestId('slide-back'),
    page.getByRole('button', { name: 'Back', exact: true }),
  ], 'lesson back')
}

async function auditLayout(page, issues, label, screenshotPath = null) {
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
      mainTop: main?.getBoundingClientRect().top ?? null,
    }
  })

  if (result.document[0] > result.viewport[0] || result.document[1] > result.viewport[1]) {
    issues.push(`${label}: document overflow ${JSON.stringify(result.document)} vs ${JSON.stringify(result.viewport)}`)
  }
  for (const key of ['root', 'stage']) {
    const box = result[key]
    if (box && (box[0] > box[2] + 1 || box[1] > box[3] + 1)) {
      issues.push(`${label}: ${key} overflow ${JSON.stringify(box)}`)
    }
  }
  if (result.main && result.main[0] > result.main[2] + 1) {
    issues.push(`${label}: main horizontal overflow ${JSON.stringify(result.main)}`)
  }
  if (result.mainTop === null) issues.push(`${label}: main element not found`)

  if (screenshotPath) {
    await page.screenshot({
      path: screenshotPath,
      fullPage: false,
    })
  }

  return result
}

async function advanceSlide(page, issues, currentSlide) {
  const button = await nextButton(page)
  if (await button.isDisabled()) {
    issues.push(`free navigation: Continue is disabled on slide ${currentSlide}`)
    return false
  }

  const beforeTop = await page.evaluate(() =>
    document.querySelector('[lang="en"] main')?.getBoundingClientRect().top ?? null,
  )
  await button.click()
  await page.waitForTimeout(20)

  const transitionState = await page.evaluate(() => {
    const mains = Array.from(document.querySelectorAll('[lang="en"] main'))
    return {
      count: mains.length,
      top: mains[0]?.getBoundingClientRect().top ?? null,
    }
  })
  if (transitionState.count !== 1) {
    issues.push(`slide ${currentSlide} transition: expected one main, found ${transitionState.count}`)
  }
  if (
    beforeTop !== null
    && transitionState.top !== null
    && Math.abs(beforeTop - transitionState.top) > 1
  ) {
    issues.push(`slide ${currentSlide} transition: main moved from ${beforeTop} to ${transitionState.top}`)
  }

  await waitForSlide(page, currentSlide + 1)
  await page.waitForTimeout(420)
  return true
}

async function assertIncompleteSummary(page, issues, label) {
  const status = await firstExisting([
    page.getByTestId('summary-status'),
    page.getByText(/(?:check|practice).*(?:not complete|not finished)|not completed/i),
  ])
  if (!status) {
    issues.push(`${label}: incomplete summary status not found`)
  } else {
    const state = await status.getAttribute('data-status')
    if (state && state !== 'incomplete') issues.push(`${label}: summary data-status is "${state}"`)
  }

  const score = await firstExisting([page.getByTestId('summary-score')])
  if (score) {
    const scoreText = (await score.textContent())?.trim() ?? ''
    if (/100\s*%/.test(scoreText)) {
      issues.push(`${label}: incomplete summary reports ${scoreText}`)
    } else if (!/0\s*\/\s*8/.test(scoreText)) {
      issues.push(`${label}: incomplete summary score is "${scoreText}", expected 0 / 8`)
    }
  } else if (await page.getByText('100%', { exact: true }).count()) {
    issues.push(`${label}: incomplete summary reports 100%`)
  }

  const completed = await firstExisting([
    page.getByTestId('summary-completed'),
    page.getByText(/0\s*(?:\/|of)\s*8/i),
  ])
  if (!completed) issues.push(`${label}: expected completed count 0 / 8`)

  const confettiCount = await page.locator('[data-testid="summary-confetti"], .g7-confetti').count()
  if (confettiCount) issues.push(`${label}: confetti is visible before practice completion`)

  const finish = await firstExisting([
    page.getByTestId('summary-finish'),
    page.getByRole('button', { name: 'Finish lesson', exact: true }),
  ])
  if (!finish) {
    issues.push(`${label}: summary finish control not found`)
  } else if (!(await finish.isDisabled())) {
    issues.push(`${label}: finish control is enabled before practice completion`)
  }
}

async function auditFreeNavigation(name, viewport) {
  const page = await browser.newPage({ viewport })
  const issues = []
  attachRuntimeGuards(page, issues)

  try {
    await openLesson(page)
    await muteLesson(page)

    for (let slide = 1; slide <= totalSlides; slide += 1) {
      await waitForSlide(page, slide)
      await auditLayout(
        page,
        issues,
        `${name}-slide-${slide}`,
        screenshotSlides.has(slide) ? `${out}/${name}-slide-${slide}.png` : null,
      )

      if (slide < totalSlides) {
        const advanced = await advanceSlide(page, issues, slide)
        if (!advanced) break
      }
    }

    await waitForSlide(page, totalSlides)
    await assertIncompleteSummary(page, issues, `${name}-incomplete-summary`)

    const back = await backButton(page)
    await back.click()
    await waitForSlide(page, 14)
  } catch (error) {
    issues.push(`${name}: ${error.message}`)
    await page.screenshot({ path: `${out}/${name}-failure.png`, fullPage: false }).catch(() => {})
  } finally {
    await page.close()
  }

  return issues
}

async function practiceRoot(page) {
  return firstExisting([
    page.getByTestId('practice-pack'),
    page.getByTestId('practice-task'),
    page.locator('[data-task-id]'),
  ])
}

async function assertPracticeTask(page, issues, number, ids, formulaPattern) {
  const root = await practiceRoot(page)
  if (root) {
    const taskId = await root.getAttribute('data-task-id')
    if (taskId && !ids.includes(taskId)) {
      issues.push(`practice task ${number}: id "${taskId}" is not one of ${ids.join(', ')}`)
    }
  }

  if (formulaPattern && !(await page.getByText(formulaPattern, { exact: false }).count())) {
    issues.push(`practice task ${number}: expected formula not found`)
  }

  const progress = await firstExisting([
    page.getByTestId('practice-progress'),
    page.getByText(new RegExp(`^\\s*${number}\\s*/\\s*${totalPracticeTasks}\\s*$`)),
  ])
  if (!progress) issues.push(`practice task ${number}: progress ${number} / ${totalPracticeTasks} not found`)
}

async function practiceOption(page, optionIds, fallbackPattern, label) {
  const root = await practiceRoot(page) ?? page.locator('main')
  const candidates = []
  for (const optionId of optionIds) {
    candidates.push(root.locator(`[data-option-id="${optionId}"]`))
    candidates.push(root.getByTestId(`practice-option-${optionId}`))
  }
  if (fallbackPattern) {
    candidates.push(root.getByRole('button', { name: fallbackPattern, exact: typeof fallbackPattern === 'string' }))
  }
  return requireLocator(candidates, label)
}

async function practiceField(page, fieldIds, fallbackLabel, label) {
  const root = await practiceRoot(page) ?? page.locator('main')
  const candidates = []
  for (const fieldId of fieldIds) {
    candidates.push(root.locator(`[data-field-id="${fieldId}"]`))
    candidates.push(root.getByTestId(`practice-field-${fieldId}`))
  }
  if (fallbackLabel) {
    candidates.push(root.getByLabel(fallbackLabel, { exact: true }))
  }
  return requireLocator(candidates, label)
}

async function practiceCheck(page) {
  const root = await practiceRoot(page) ?? page.locator('main')
  return requireLocator([
    root.getByTestId('practice-check'),
    root.locator('[data-action="practice-check"]'),
    root.getByRole('button', { name: 'Check', exact: true }),
  ], 'practice check')
}

async function practiceSolution(page) {
  return firstExisting([
    page.getByTestId('practice-solution'),
    page.locator('.g7-solution-frame'),
  ])
}

async function assertNoPracticeSolution(page, issues, label) {
  const solution = await practiceSolution(page)
  if (solution && await solution.isVisible()) issues.push(`${label}: solution opened after a wrong answer`)

  const advance = await firstExisting([
    page.getByTestId('practice-task-advance'),
    page.getByRole('button', { name: /^(?:Next task|View result)$/ }),
  ])
  if (advance && await advance.isVisible()) issues.push(`${label}: next task opened after a wrong answer`)
}

async function waitForPracticeSolution(page, label) {
  const solution = await requireLocator([
    page.getByTestId('practice-solution'),
    page.locator('.g7-solution-frame'),
  ], `${label} solution`)
  await solution.waitFor()
  return solution
}

async function advancePractice(page, final = false) {
  for (let step = 0; step < 12; step += 1) {
    const reveal = await firstExisting([
      page.getByTestId('solution-next-step'),
      page.getByRole('button', { name: 'Next solution step', exact: true }),
    ])
    if (!reveal || !(await reveal.isVisible())) break
    await reveal.click()
    await page.waitForTimeout(90)
  }

  const button = await requireLocator([
    page.getByTestId('practice-task-advance'),
    page.locator('[data-action="practice-next"]'),
    page.getByRole('button', { name: final ? 'View result' : 'Next task', exact: true }),
  ], final ? 'practice view result' : 'practice next task')
  await button.click()
  await page.waitForTimeout(220)
}

async function solvePracticePack(page, issues) {
  await assertPracticeTask(page, issues, 1, ['priority-first'], /27\s*−\s*15\s*:\s*5\s*\+\s*6/)

  const wrongFirst = await practiceOption(
    page,
    ['subtract', 'subtraction'],
    /27\s*−\s*15/,
    'practice task 1 wrong option',
  )
  await wrongFirst.click()
  await page.waitForTimeout(100)
  await assertNoPracticeSolution(page, issues, 'practice task 1 lock')

  const correctFirst = await practiceOption(
    page,
    ['divide', 'division'],
    /15\s*:\s*5/,
    'practice task 1 correct option',
  )
  await correctFirst.click()
  await waitForPracticeSolution(page, 'practice task 1')
  await page.waitForTimeout(650)
  await page.screenshot({ path: `${out}/desktop-practice-task-1-solution.png`, fullPage: false })
  await advancePractice(page)

  await assertPracticeTask(page, issues, 2, ['equal-chain'], /32\s*:\s*8\s*·\s*5\s*−\s*7/)
  const task2Answer = await practiceField(page, ['answer', 'value'], 'Answer', 'practice task 2 answer')
  await task2Answer.fill('13')
  await (await practiceCheck(page)).click()
  await waitForPracticeSolution(page, 'practice task 2')
  await advancePractice(page)

  await assertPracticeTask(page, issues, 3, ['build-new-solution'], /54\s*:\s*\(\s*8\s*−\s*2\s*\)\s*\+\s*7\s*·\s*3/)
  for (const [optionIds, fallback] of [
    [['bracket'], /8\s*−\s*2\s*=\s*6/],
    [['divide'], /54\s*:\s*6\s*=\s*9/],
    [['multiply'], /7\s*·\s*3\s*=\s*21/],
    [['add'], /9\s*\+\s*21\s*=\s*30/],
  ]) {
    const option = await practiceOption(page, optionIds, fallback, `practice task 3 ${optionIds[0]} step`)
    await option.click()
  }
  await waitForPracticeSolution(page, 'practice task 3')
  await advancePractice(page)

  await assertPracticeTask(page, issues, 4, ['spot-first-division'], /Do not evaluate/i)
  const task4First = await practiceOption(page, ['a'], /30\s*−\s*12\s*:\s*3/, 'practice task 4 first expression')
  const task4Second = await practiceOption(page, ['c'], /24\s*:\s*6\s*·\s*2/, 'practice task 4 second expression')
  await task4First.click()
  await task4Second.click()
  await (await practiceCheck(page)).click()
  await waitForPracticeSolution(page, 'practice task 4')
  await advancePractice(page)

  await assertPracticeTask(page, issues, 5, ['bracket-and-final'], /\(\s*17\s*−\s*9\s*\)\s*·\s*5\s*\+\s*4/)
  const bracketField = await practiceField(page, ['bracket', 'bracket-value'], 'Bracket value', 'practice task 5 bracket value')
  const finalField = await practiceField(page, ['final', 'final-value'], 'Final value', 'practice task 5 final value')
  await bracketField.fill('8')
  await finalField.fill('44')
  await (await practiceCheck(page)).click()
  await waitForPracticeSolution(page, 'practice task 5')
  await advancePractice(page)

  await assertPracticeTask(page, issues, 6, ['independent-error-audit'], /50\s*−\s*24\s*:\s*6\s*·\s*3/)
  const task6Answer = await practiceOption(
    page,
    ['second', 'second-transition', 'error-second'],
    /Transition\s*2/i,
    'practice task 6 correct transition',
  )
  await task6Answer.click()
  await waitForPracticeSolution(page, 'practice task 6')
  await advancePractice(page)

  await assertPracticeTask(page, issues, 7, ['place-brackets'], /Where should the brackets go/i)
  const task7Answer = await practiceOption(
    page,
    ['a', 'correct-brackets', 'target-18'],
    /\(\s*24\s*:\s*6\s*\+\s*2\s*\)\s*·\s*3/,
    'practice task 7 correct brackets',
  )
  await task7Answer.click()
  await waitForPracticeSolution(page, 'practice task 7')
  await advancePractice(page)

  await assertPracticeTask(page, issues, 8, ['compare-routes'], /36\s*−\s*16\s*:\s*4\s*·\s*2/)
  const task8Answer = await practiceOption(
    page,
    ['a'],
    /Route\s*A/i,
    'practice task 8 correct solution',
  )
  await task8Answer.click()
  await waitForPracticeSolution(page, 'practice task 8')
  await page.waitForTimeout(650)
  await page.screenshot({ path: `${out}/desktop-practice-task-8-solution.png`, fullPage: false })
  await advancePractice(page, true)

  const complete = await firstExisting([
    page.getByTestId('practice-complete'),
    page.getByText(/All 8 tasks are complete/i),
  ])
  if (!complete) issues.push('practice completion: all-eight completion state not found')

  const firstTry = await firstExisting([
    page.getByTestId('practice-first-try'),
    page.getByText(/7\s*\/\s*8/),
  ])
  if (!firstTry) issues.push('practice completion: expected 7 / 8 first-try result')
}

async function assertCompletedSummary(page, issues) {
  const status = await firstExisting([
    page.getByTestId('summary-status'),
    page.getByText(/complete|mastered/i),
  ])
  if (!status) {
    issues.push('completed summary: completion status not found')
  } else {
    const statusText = (await status.textContent()) ?? ''
    const state = await status.getAttribute('data-status')
    if (state && state !== 'complete') {
      issues.push(`completed summary: data-status is "${state}"`)
    }
    if (/not complete|not finished/i.test(statusText)) {
      issues.push(`completed summary: still incomplete: ${statusText.trim()}`)
    }
  }

  const completed = await firstExisting([
    page.getByTestId('summary-completed'),
    page.getByText(/8\s*(?:\/|of)\s*8/i),
  ])
  if (!completed) issues.push('completed summary: mastered 8 / 8 not found')

  const firstTry = await firstExisting([
    page.getByTestId('summary-first-try'),
    page.getByText(/7\s*(?:\/|of)\s*8/i),
  ])
  if (!firstTry) issues.push('completed summary: first-try 7 / 8 not found')

  const score = await firstExisting([page.getByTestId('summary-score')])
  if (score) {
    const text = (await score.textContent())?.trim() ?? ''
    if (!/8\s*\/\s*8/.test(text)) issues.push(`completed summary: mastery score is "${text}", expected 8 / 8`)
  }

  const confettiCount = await page.locator('[data-testid="summary-confetti"], .g7-confetti').count()
  if (!confettiCount) issues.push('completed summary: celebration is missing')

  const finish = await requireLocator([
    page.getByTestId('summary-finish'),
    page.getByRole('button', { name: 'Finish lesson', exact: true }),
  ], 'completed summary finish')
  if (await finish.isDisabled()) {
    issues.push('completed summary: Finish lesson is disabled')
    return
  }

  await finish.click()
  await requireLocator([
    page.getByTestId('summary-finish'),
    page.getByRole('button', { name: 'Result saved', exact: true }),
  ], 'completed summary saved result')
  await page.getByRole('button', { name: 'Result saved', exact: true }).waitFor()
}

async function auditCompletedJourney() {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } })
  const issues = []
  attachRuntimeGuards(page, issues)

  try {
    await openLesson(page)
    await muteLesson(page)
    await waitForSlide(page, 1)

    const hypothesis = await requireLocator([
      page.locator('[data-option-id="different-order"]'),
      page.getByTestId('hook-option-different-order'),
      page.getByRole('button', { name: 'The operations were performed in different orders', exact: true }),
    ], 'hook hypothesis')
    await hypothesis.click()

    for (let slide = 1; slide < 14; slide += 1) {
      await waitForSlide(page, slide)
      const advanced = await advanceSlide(page, issues, slide)
      if (!advanced) throw new Error(`could not advance from slide ${slide}`)
    }

    await waitForSlide(page, 14)
    await solvePracticePack(page, issues)
    await page.screenshot({ path: `${out}/desktop-practice-complete.png`, fullPage: false })

    const advanced = await advanceSlide(page, issues, 14)
    if (!advanced) throw new Error('could not advance from completed practice')

    await waitForSlide(page, 15)
    await assertCompletedSummary(page, issues)
    await page.screenshot({ path: `${out}/desktop-summary-complete.png`, fullPage: false })
  } catch (error) {
    issues.push(`completed journey: ${error.message}`)
    await page.screenshot({ path: `${out}/desktop-completed-journey-failure.png`, fullPage: false }).catch(() => {})
  } finally {
    await page.close()
  }

  return issues
}

async function auditLocales() {
  const page = await browser.newPage({ viewport: { width: 1100, height: 760 } })
  const issues = []
  attachRuntimeGuards(page, issues)

  for (const [lang, expected] of [
    ['uz', 'Ikkala o‘quvchi ham haq bo‘lishi mumkinmi?'],
    ['ru', 'Могут ли оба ученика быть правы?'],
    ['en', 'Can both students be right?'],
  ]) {
    try {
      await openLesson(page, lang)
      await waitForSlide(page, 1)
      if (!(await page.getByRole('heading', { name: expected, exact: true }).count())) {
        issues.push(`locale ${lang}: expected hook heading not found`)
      }
    } catch (error) {
      issues.push(`locale ${lang}: ${error.message}`)
    }
  }

  await page.close()
  return issues
}

const desktopFreeIssues = await auditFreeNavigation('desktop-free', { width: 1366, height: 768 })
const mobileFreeIssues = await auditFreeNavigation('mobile-free', { width: 390, height: 844 })
const compactFreeIssues = await auditFreeNavigation('mobile-compact-free', { width: 360, height: 740 })
const completedJourneyIssues = await auditCompletedJourney()
const localeIssues = await auditLocales()

await browser.close()

const issues = [
  ...desktopFreeIssues,
  ...mobileFreeIssues,
  ...compactFreeIssues,
  ...completedJourneyIssues,
  ...localeIssues,
]

if (issues.length) {
  console.error(issues.join('\n'))
  process.exitCode = 1
} else {
  console.log('Grade 7 lesson smoke test passed: 15 screens, DEV free navigation, incomplete-summary guard, 7 theory screens, 5 guided applications, 8 gated practice tasks, completed summary, UZ/RU/EN, desktop and mobile.')
}
