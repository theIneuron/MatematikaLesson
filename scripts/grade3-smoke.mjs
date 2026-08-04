import { chromium } from 'playwright'

// The Vite/preview server is intentionally external, matching grade7-smoke.mjs.
// Supported overrides:
//   BASE_URL=http://127.0.0.1:5181
//   PORT=5181 (or GRADE3_PORT=5181)
//   FAST=1  -> representative route sweep instead of all 51 + 51 routes
//   HEADED=1
const port = process.env.GRADE3_PORT || process.env.PORT || '5181'
const baseUrl = (
  process.env.GRADE3_BASE_URL
  || process.env.BASE_URL
  || `http://127.0.0.1:${port}`
).replace(/\/+$/, '')
const fast = /^(?:1|true|yes)$/i.test(process.env.FAST || '')
const headed = /^(?:1|true|yes)$/i.test(process.env.HEADED || '')
const routeTimeout = Number(process.env.GRADE3_ROUTE_TIMEOUT || 30_000)

const theoryLessons = [
  [1, 'dars01-yuzlik-onlik-birlik'],
  [2, 'dars02-oqish-yozish'],
  [3, 'dars03-razryad-qoshiluvchilari'],
  [4, 'dars04-taqqoslash'],
  [5, 'dars05-yaxlitlash'],
  [6, 'dars06-son-oqi'],
  [7, 'dars07-yozma-qoshish-ayirish'],
  [8, 'dars08-rim-raqamlari'],
  [9, 'dars09-kopaytirish-jadvali'],
  [10, 'dars10-10-100-ga-kopaytirish-bolish'],
  [11, 'dars11-yigindini-kopaytirish'],
  [12, 'dars12-yigindini-bolish'],
  [13, 'dars13-amallar-tartibi'],
  [14, 'dars14-komponentlar-boglanishi'],
  [15, 'dars15-masalalar'],
  [16, 'dars16-boluvchi-karrali'],
  [17, 'dars17-ikki-xonali-kopaytirish'],
  [18, 'dars18-ikki-xonali-bolish'],
  [19, 'dars19-qoldiqli-bolish'],
  [20, 'dars20-amallarni-tekshirish'],
  [21, 'dars21-yozma-kopaytirish-bolish'],
  [22, 'dars22-ikki-xonali-ikki-xonali'],
  [23, 'dars23-qurilish-masalalari'],
  [24, 'dars24-kattalik-ulushi'],
  [25, 'dars25-kasr-hosil-bolishi'],
  [26, 'dars26-ulushlarni-taqqoslash'],
  [27, 'dars27-sonning-ulushi'],
  [28, 'dars28-kasr-turlari-aralash-son'],
  [29, 'dars29-kasrlarni-taqqoslash'],
  [30, 'dars30-kasrlarni-qoshish-ayirish'],
  [31, 'dars31-onli-kasrlar'],
  [32, 'dars32-ulush-kasr-masalalari'],
  [33, 'dars33-perimetr'],
  [34, 'dars34-yuza-birliklari'],
  [35, 'dars35-togri-tortburchak-yuzasi'],
  [36, 'dars36-kvadrat-yuzasi'],
  [37, 'dars37-perimetr-yuzani-taqqoslash'],
  [38, 'dars38-perimetr-yuza-masalalari'],
  [39, 'dars39-uchburchak-chiziqlar'],
  [40, 'dars40-simmetriya-burchak'],
  [41, 'dars41-piramida-konus'],
  [42, 'dars42-massa'],
  [43, 'dars43-vaqt'],
  [44, 'dars44-uzunlik-birliklari'],
  [45, 'dars45-kalendar'],
  [46, 'dars46-tenglamalar'],
  [47, 'dars47-tenglamalarni-tekshirish'],
  [48, 'dars48-murakkab-masalalar'],
  [49, 'dars49-tengsizlik-fikrlar'],
  [50, 'dars50-doiraviy-diagramma'],
  [51, 'dars51-yakuniy-takrorlash'],
].map(([number, slug]) => ({
  number,
  slug,
  path: `/3-sinf/matematika/nazariy/${slug}`,
}))

const practiceLessons = Array.from({ length: 51 }, (_, index) => {
  const number = index + 1
  return {
    number,
    slug: `dars${String(number).padStart(2, '0')}-amaliyot`,
    path: `/3-sinf/matematika/amaliy/dars${String(number).padStart(2, '0')}-amaliyot`,
  }
})

if (theoryLessons.length !== 51 || practiceLessons.length !== 51) {
  throw new Error('Grade 3 route manifest must contain exactly 51 theory and 51 practice routes')
}

const fastTheoryNumbers = new Set([1, 19, 21, 33, 42, 51])
const fastPracticeNumbers = new Set([1, 20, 33, 42, 51])
const theorySweep = fast
  ? theoryLessons.filter(({ number }) => fastTheoryNumbers.has(number))
  : theoryLessons
const practiceSweep = fast
  ? practiceLessons.filter(({ number }) => fastPracticeNumbers.has(number))
  : practiceLessons

const issues = []
let activeRoute = 'startup'

function addIssue(message) {
  issues.push(`${activeRoute}: ${message}`)
}

function normalizedPath(url) {
  return new URL(url).pathname.replace(/\/+$/, '') || '/'
}

async function waitForEnabled(locator, label, timeout = 5_000) {
  await locator.waitFor({ state: 'visible', timeout })
  await locator.evaluate((element, expectedLabel) => new Promise((resolve, reject) => {
    const started = Date.now()
    const poll = () => {
      if (!element.disabled) {
        resolve()
        return
      }
      if (Date.now() - started > 5_000) {
        reject(new Error(`${expectedLabel} stayed disabled`))
        return
      }
      window.setTimeout(poll, 25)
    }
    poll()
  }), label)
}

async function counterNumber(counter) {
  const text = (await counter.textContent())?.replace(/\s+/g, ' ').trim() || ''
  const match = text.match(/^0*(\d+)\s*\//)
  if (!match) throw new Error(`unrecognized counter "${text}"`)
  return Number(match[1])
}

async function findButtonByOwnLabel(buttons, expected) {
  const count = await buttons.count()
  for (let index = 0; index < count; index += 1) {
    const button = buttons.nth(index)
    const labelNode = button.locator('span').last()
    const label = ((await labelNode.count())
      ? await labelNode.textContent()
      : await button.textContent())?.replace(/\s+/g, ' ').trim()
    if (label === expected) return button
  }
  throw new Error(`answer button "${expected}" was not found`)
}

async function clickPracticeButton(page, predicate, label) {
  const buttons = page.locator('.g3-practice-content button')
  for (let index = 0; index < await buttons.count(); index += 1) {
    const button = buttons.nth(index)
    const text = (await button.textContent())?.replace(/\s+/g, ' ').trim() || ''
    if (predicate(text)) {
      await button.click()
      return
    }
  }
  throw new Error(`practice button "${label}" was not found`)
}

async function gotoRoute(page, route, rootLocator) {
  activeRoute = route
  const response = await page.goto(`${baseUrl}${route}`, {
    waitUntil: 'domcontentloaded',
    timeout: routeTimeout,
  })
  if (!response) throw new Error('navigation returned no response')
  if (!response.ok()) throw new Error(`HTTP ${response.status()}`)

  const expectedPath = route.replace(/\/+$/, '')
  const actualPath = normalizedPath(page.url())
  if (actualPath !== expectedPath) {
    throw new Error(`redirected to "${actualPath}"`)
  }

  await rootLocator(page).waitFor({ state: 'visible', timeout: routeTimeout })
  // Let lazy-render effects and rejected promises surface as pageerror events.
  await page.waitForTimeout(80)
}

async function runCase(name, callback) {
  activeRoute = name
  try {
    await callback()
  } catch (error) {
    addIssue(error instanceof Error ? error.message : String(error))
  }
}

async function auditTheoryRoutes(page) {
  const root = (currentPage) => currentPage.locator(
    '[data-testid="grade3-theory-root"], .lesson-root, .g3d19',
  ).first()

  for (let index = 0; index < theorySweep.length; index += 1) {
    const lesson = theorySweep[index]
    const label = `theory ${lesson.number} (${lesson.slug})`
    activeRoute = label
    try {
      await gotoRoute(page, lesson.path, root)
      console.log(`[theory ${index + 1}/${theorySweep.length}] ${lesson.slug}`)
    } catch (error) {
      addIssue(error instanceof Error ? error.message : String(error))
    }
  }
}

async function auditPracticeRoutes(page) {
  const root = (currentPage) => currentPage.getByTestId('grade3-practice-root')

  for (let index = 0; index < practiceSweep.length; index += 1) {
    const lesson = practiceSweep[index]
    const label = `practice ${lesson.number} (${lesson.slug})`
    activeRoute = label
    try {
      await gotoRoute(page, lesson.path, root)

      const taskButtons = page.locator('[data-testid^="grade3-practice-task-"]')
      const taskCount = await taskButtons.count()
      if (taskCount !== 10) {
        throw new Error(`expected 10 task buttons, found ${taskCount}`)
      }
      for (let taskIndex = 0; taskIndex < taskCount; taskIndex += 1) {
        if (!(await taskButtons.nth(taskIndex).isVisible())) {
          throw new Error(`task button ${taskIndex + 1} is not visible`)
        }
      }

      const sound = page.getByTestId('grade3-practice-sound')
      await sound.waitFor({ state: 'visible', timeout: routeTimeout })
      console.log(`[practice ${index + 1}/${practiceSweep.length}] ${lesson.slug}`)
    } catch (error) {
      addIssue(error instanceof Error ? error.message : String(error))
    }
  }
}

async function auditSharedTheoryJourney(page) {
  const route = theoryLessons.find(({ number }) => number === 19)
  await gotoRoute(
    page,
    route.path,
    (currentPage) => currentPage.getByTestId('grade3-theory-root'),
  )

  const sound = page.getByTestId('grade3-theory-sound')
  const next = page.getByTestId('grade3-theory-next')
  const back = page.getByTestId('grade3-theory-back')
  const counter = page.getByTestId('grade3-theory-counter')
  const answers = page.locator('[data-testid^="grade3-theory-answer-"]')

  if (await answers.count() !== 3) throw new Error('Dars19 first screen must expose 3 answers')
  if (!(await next.isDisabled())) throw new Error('Dars19 Next is enabled before an answer')
  for (let index = 0; index < await answers.count(); index += 1) {
    if (!(await answers.nth(index).isDisabled())) {
      throw new Error('Dars19 answer is enabled before narration ends or sound is muted')
    }
  }

  await sound.click()
  await waitForEnabled(answers.first(), 'Dars19 answers after mute')

  const correct = await findButtonByOwnLabel(answers, '3')
  let wrong = null
  for (let index = 0; index < await answers.count(); index += 1) {
    const candidate = answers.nth(index)
    if (await candidate.getAttribute('data-testid') !== await correct.getAttribute('data-testid')) {
      wrong = candidate
      break
    }
  }
  if (!wrong) throw new Error('Dars19 wrong answer was not found')

  await wrong.click()
  await page.locator('[data-grade3-bit-feedback="true"]').waitFor({
    state: 'visible',
    timeout: 5_000,
  })
  if (!(await next.isDisabled())) throw new Error('Dars19 Next enabled after a wrong answer')
  if (await correct.isDisabled()) throw new Error('Dars19 correct answer cannot be retried')

  await correct.click()
  await waitForEnabled(next, 'Dars19 Next after correct answer')
  if (await counterNumber(counter) !== 1) throw new Error('Dars19 left screen 1 before Next')

  await next.click()
  await page.waitForFunction(
    () => document.querySelector('[data-testid="grade3-theory-counter"]')?.textContent?.trim().startsWith('02'),
  )
  if (await counterNumber(counter) !== 2) throw new Error('Dars19 Next did not open screen 2')

  await back.click()
  await page.waitForFunction(
    () => document.querySelector('[data-testid="grade3-theory-counter"]')?.textContent?.trim().startsWith('01'),
  )
  await waitForEnabled(next, 'Dars19 revisited Next')
  if (await counterNumber(counter) !== 1) throw new Error('Dars19 Back did not return to screen 1')

  await next.click()
  await page.waitForFunction(
    () => document.querySelector('[data-testid="grade3-theory-counter"]')?.textContent?.trim().startsWith('02'),
  )
  const secondScreenAnswers = page.locator('[data-testid^="grade3-theory-answer-"]')
  await waitForEnabled(secondScreenAnswers.first(), 'Dars19 forward revisit after mute')

  // Complete the shared-shell lesson to cover the final button, persisted
  // progress, the completion event and LessonPage's Grade 3 close behavior.
  for (let screenNumber = 2; screenNumber <= 15; screenNumber += 1) {
    const currentAnswers = page.locator('[data-testid^="grade3-theory-answer-"]')
    let solved = false
    for (let answerIndex = 0; answerIndex < await currentAnswers.count(); answerIndex += 1) {
      const answer = currentAnswers.nth(answerIndex)
      if (await answer.isDisabled()) continue
      await answer.click()
      if (await next.isEnabled()) {
        solved = true
        break
      }
    }
    if (!solved) throw new Error(`Dars19 screen ${screenNumber} could not be solved`)

    if (screenNumber < 15) {
      // The inherited visual pulse makes the element intentionally non-static;
      // invoking its native click keeps the functional assertion deterministic.
      await next.evaluate((element) => element.click())
      await page.waitForFunction(
        (expected) => document.querySelector('[data-testid="grade3-theory-counter"]')
          ?.textContent?.trim().startsWith(String(expected).padStart(2, '0')),
        screenNumber + 1,
      )
    } else {
      const label = (await next.textContent())?.replace(/\s+/g, ' ').trim()
      if (!['Tugatish', 'Завершить'].includes(label)) {
        throw new Error(`Dars19 final button is "${label}"`)
      }
      await next.evaluate((element) => element.click())
      await page.waitForURL((url) => (
        url.pathname === '/'
        && url.searchParams.get('grade') === '3-sinf'
        && url.searchParams.get('section') === 'nazariy'
      ))
    }
  }

  const saved = await page.evaluate(() => {
    const value = window.localStorage.getItem('grade3:num-3-19:progress')
    return value ? JSON.parse(value) : null
  })
  if (!saved?.completed || saved.solved !== 15 || saved.total !== 15) {
    throw new Error(`Dars19 completion was not persisted correctly: ${JSON.stringify(saved)}`)
  }
}

async function auditPracticeJourney(page) {
  const route = practiceLessons.find(({ number }) => number === 20)
  await gotoRoute(
    page,
    route.path,
    (currentPage) => currentPage.getByTestId('grade3-practice-root'),
  )

  const host = page.getByTestId('grade3-practice-host')
  const sound = page.getByTestId('grade3-practice-sound')
  const check = page.getByTestId('grade3-practice-check')

  if (!(await check.isDisabled())) {
    throw new Error('practice Check is enabled before narration/mute and answer')
  }
  if (await host.getAttribute('aria-busy') !== 'true') {
    throw new Error('practice host is not audio-locked before narration ends')
  }

  await sound.click()
  await page.waitForFunction(
    () => document.querySelector('[data-testid="grade3-practice-host"]')?.getAttribute('aria-busy') === 'false',
  )

  const answers = page.locator('.g3-answer-zone button')
  await answers.first().waitFor({ state: 'visible', timeout: 5_000 })
  const correct = await findButtonByOwnLabel(answers, "Bo'lish")
  const wrong = await findButtonByOwnLabel(answers, "Qo'shish")

  await wrong.click()
  await waitForEnabled(check, 'practice Check after choosing an answer')
  await check.click()

  await page.locator('[data-grade3-bit-feedback="true"]').waitFor({
    state: 'visible',
    timeout: 5_000,
  })
  if (await page.getByTestId('grade3-practice-advance').count()) {
    throw new Error('practice advance is visible after a wrong answer')
  }
  if (await correct.isDisabled()) {
    throw new Error('practice answer cannot be corrected after a wrong attempt')
  }

  await correct.click()
  const retryCheck = page.getByTestId('grade3-practice-check')
  await waitForEnabled(retryCheck, 'practice Check after correcting the answer')
  await retryCheck.click()

  const advance = page.getByTestId('grade3-practice-advance')
  await waitForEnabled(advance, 'practice transition after a correct answer')
  const score = page.getByTestId('grade3-practice-score')
  if ((await score.textContent())?.replace(/\s+/g, '') !== '1/10') {
    throw new Error(`practice score is "${await score.textContent()}", expected 1/10`)
  }

  await advance.click()
  await page.waitForFunction(
    () => document.querySelector('[data-testid="grade3-practice-task-2"]')?.getAttribute('aria-current') === 'step',
  )
}

async function auditPracticeFinishJourney(page) {
  const route = practiceLessons.find(({ number }) => number === 19)
  await gotoRoute(
    page,
    route.path,
    (currentPage) => currentPage.getByTestId('grade3-practice-root'),
  )

  await page.getByTestId('grade3-practice-sound').click()
  const exact = (text) => clickPracticeButton(page, (value) => value === text, text)
  const starts = (text) => clickPracticeButton(page, (value) => value.startsWith(text), `${text}…`)
  const ends = (text) => clickPracticeButton(page, (value) => value.endsWith(text), `…${text}`)
  const digit = (value) => page.locator(
    `.g3-practice-content button[aria-label="${value}"]`,
  ).click()
  const solve = [
    () => exact('2'),
    () => digit('4'),
    () => starts('26 : 6 = 4'),
    async () => {
      await starts('7 ')
      await starts('28 <')
      await starts('31 ')
    },
    async () => {
      await digit('3')
      await digit('8')
    },
    () => exact('4 va 2'),
    async () => {
      await ends('0')
      await ends('1')
      await ends('3')
    },
    () => exact('0'),
    () => exact('Zuhraniki'),
    () => digit('5'),
  ]

  for (let taskNumber = 1; taskNumber <= 10; taskNumber += 1) {
    if (taskNumber > 1) {
      const soundText = (await page.getByTestId('grade3-practice-sound').textContent())?.trim()
      if (soundText !== '🔇') {
        throw new Error(`practice mute did not persist on task ${taskNumber}`)
      }
      if (await page.getByTestId('grade3-practice-host').getAttribute('aria-busy') !== 'false') {
        throw new Error(`practice task ${taskNumber} relocked after persistent mute`)
      }
    }

    await solve[taskNumber - 1]()
    const check = page.getByTestId('grade3-practice-check')
    await waitForEnabled(check, `practice task ${taskNumber} Check`)
    await check.click()

    const advance = page.getByTestId('grade3-practice-advance')
    await advance.waitFor({ state: 'visible', timeout: 5_000 })
    const score = (await page.getByTestId('grade3-practice-score').textContent())?.trim()
    if (score !== `${taskNumber}/10`) {
      throw new Error(`practice task ${taskNumber} score is "${score}"`)
    }

    const actionLabel = (await advance.textContent())?.replace(/\s+/g, ' ').trim()
    if (taskNumber === 10 && actionLabel !== 'Tugatish') {
      throw new Error(`practice final button is "${actionLabel}"`)
    }
    await advance.click()

    if (taskNumber < 10) {
      await page.waitForFunction(
        (expected) => document.querySelector(`[data-testid="grade3-practice-task-${expected}"]`)
          ?.getAttribute('aria-current') === 'step',
        taskNumber + 1,
      )
    } else {
      await page.waitForURL((url) => (
        url.pathname === '/'
        && url.searchParams.get('grade') === '3-sinf'
        && url.searchParams.get('section') === 'amaliy'
      ))
    }
  }

  const saved = await page.evaluate(() => {
    const value = window.localStorage.getItem('grade3:num-3-19-practice:progress')
    return value ? JSON.parse(value) : null
  })
  if (!saved?.completed || saved.solved !== 10 || saved.total !== 10) {
    throw new Error(`practice completion was not persisted correctly: ${JSON.stringify(saved)}`)
  }
}

const browser = await chromium.launch({ headless: !headed })
const context = await browser.newContext({
  viewport: { width: 1366, height: 768 },
  // Imported Grade 3 etalon scenes intentionally pulse .btn-ready forever.
  // Reduced motion keeps Playwright actionability checks deterministic.
  reducedMotion: 'reduce',
})

// Keep narration deliberately unfinished. This makes the mute/audio gates
// deterministic and prevents OS voice availability from affecting the smoke.
await context.addInitScript(() => {
  const synth = window.speechSynthesis
  if (!synth) return
  let activeUtterance = null
  synth.speak = (utterance) => {
    activeUtterance = utterance
    window.setTimeout(() => {
      try {
        utterance.dispatchEvent?.(new Event('start'))
        utterance.onstart?.()
      } catch {
        // The application gate does not depend on the mock start event.
      }
    }, 0)
  }
  synth.cancel = () => {
    activeUtterance = null
  }
  synth.getVoices = () => [
    { lang: 'uz-UZ', name: 'Smoke UZ' },
    { lang: 'ru-RU', name: 'Smoke RU' },
  ]
})

const page = await context.newPage()
page.on('pageerror', (error) => addIssue(`pageerror: ${error.message}`))
page.on('console', (message) => {
  if (
    message.type() === 'error'
    && !message.text().includes('ERR_NETWORK_ACCESS_DENIED')
  ) {
    addIssue(`console: ${message.text()}`)
  }
})

try {
  activeRoute = 'preflight'
  const response = await page.goto(`${baseUrl}/`, {
    waitUntil: 'domcontentloaded',
    timeout: routeTimeout,
  })
  if (!response?.ok()) {
    throw new Error(`server preflight failed at ${baseUrl} (${response?.status() || 'no response'})`)
  }

  await auditTheoryRoutes(page)
  await auditPracticeRoutes(page)
  await runCase('shared theory Dars19 journey', () => auditSharedTheoryJourney(page))
  await runCase('practice Dars20 journey', () => auditPracticeJourney(page))
  await runCase('practice Dars19 finish journey', () => auditPracticeFinishJourney(page))
} catch (error) {
  addIssue(error instanceof Error ? error.message : String(error))
} finally {
  await context.close()
  await browser.close()
}

if (issues.length) {
  console.error(`Grade 3 smoke failed with ${issues.length} issue(s):`)
  console.error(issues.map((issue) => `- ${issue}`).join('\n'))
  process.exitCode = 1
} else {
  const mode = fast ? 'FAST' : 'FULL'
  console.log(
    `Grade 3 smoke passed (${mode}): ${theorySweep.length} theory routes, `
    + `${practiceSweep.length} practice routes with 10 task buttons and sound, `
    + 'Dars19 gated navigation/retry/revisit/finish, '
    + 'Dars20 practice audio gate/retry/advance, Dars19 practice 10/10/finish.',
  )
}
