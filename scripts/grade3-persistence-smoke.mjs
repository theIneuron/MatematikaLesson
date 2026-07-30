import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { createGrade3IsolationPlugin } from './grade3-vite-isolation.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const viewport = { width: 1200, height: 800 }
const failures = []

function createFinishedCapturePlugin() {
  const lessonPageSuffix = '/src/components/shared/LessonPage.jsx'
  const original = '<Component {...previewProps} />'
  const instrumented = [
    '<Component',
    '{...previewProps}',
    'onFinished={(payload) => globalThis.__grade3TestOnFinished?.(payload)}',
    '/>',
  ].join(' ')

  return {
    name: 'grade3-capture-on-finished',
    enforce: 'pre',
    transform(source, id) {
      const normalized = id.replaceAll('\\', '/')
      if (!normalized.endsWith(lessonPageSuffix)) return null
      if (!source.includes(original)) {
        throw new Error('LessonPage onFinished test hook could not be installed.')
      }
      return source.replace(original, instrumented)
    },
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function normalizedText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

function regexEscape(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function gotoRoute(page, baseUrl, route) {
  await page.goto(new URL(route, baseUrl).href, {
    waitUntil: 'domcontentloaded',
    timeout: 20_000,
  })
}

async function readStorage(page, key) {
  return page.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey)
    return raw === null ? null : JSON.parse(raw)
  }, key)
}

async function clickAnswerOption(page, label) {
  const expected = normalizedText(label)
  const buttons = page.locator(
    '.g3-practice-host:not([aria-hidden="true"]) .g3-answer-zone button',
  )
  const count = await buttons.count()
  for (let index = 0; index < count; index += 1) {
    const button = buttons.nth(index)
    if (!(await button.isVisible()) || !(await button.isEnabled())) continue
    const actual = normalizedText(await button.textContent())
    const withoutCheckbox = actual.replace(/^[☐☑□✓]\s*/u, '')
    const withoutOrder = actual.replace(/^\d+\.\s*/u, '')
    if (actual === expected || withoutCheckbox === expected || withoutOrder === expected) {
      await button.click()
      return
    }
  }
  throw new Error(`Answer option was not found: ${expected}`)
}

async function enterNumpadValue(page, value) {
  const pad = page.locator(
    '.g3-practice-host:not([aria-hidden="true"]) .g3-lesson-numpad',
  )
  await pad.waitFor({ state: 'visible', timeout: 5_000 })
  for (const digit of String(value)) {
    await pad.getByRole('button', {
      name: new RegExp(`^${regexEscape(digit)}$`),
    }).click()
  }
}

async function submitFactoryAnswer(page, spec) {
  const text = spec.text.uz
  if (spec.type === 'choice') {
    await clickAnswerOption(page, text.options[spec.correct])
  } else if (spec.type === 'multi' || spec.type === 'order') {
    for (const originalIndex of spec.correct) {
      await clickAnswerOption(page, text.options[originalIndex])
    }
  } else if (spec.type === 'input') {
    const input = page.locator(
      '.g3-practice-host:not([aria-hidden="true"]) .g3-answer-zone input',
    )
    if (await input.count()) {
      await input.fill(String(spec.correct[0]))
    } else {
      await enterNumpadValue(page, spec.correct[0])
    }
  } else {
    throw new Error(`Unsupported practice type: ${spec.type}`)
  }

  const checkButton = page.locator(
    '.g3-practice-host:not([aria-hidden="true"]) .g3-practice-footer button',
  )
  await checkButton.waitFor({ state: 'visible', timeout: 5_000 })
  await checkButton.click({ timeout: 5_000 })
  await page.locator(
    '.g3-practice-host:not([aria-hidden="true"]) .g3-question-shell.g3-result-correct',
  ).waitFor({ state: 'visible', timeout: 5_000 })
}

async function waitForFinishedCount(page, captured, expected) {
  const deadline = Date.now() + 5_000
  while (captured.length !== expected && Date.now() < deadline) {
    await page.waitForTimeout(50)
  }
  assert(
    captured.length === expected,
    `Expected ${expected} onFinished call(s), received ${captured.length}.`,
  )
}

const server = await createServer({
  root: repoRoot,
  logLevel: 'error',
  plugins: [createGrade3IsolationPlugin(), createFinishedCapturePlugin()],
  server: { host: '127.0.0.1', port: 0, strictPort: false },
})
await server.listen()

const baseUrl = server.resolvedUrls?.local?.[0]
if (!baseUrl) throw new Error('Vite did not expose a local URL.')

const { DARS19_BANK } = await server.ssrLoadModule(
  '/src/components/grade3/practice/newBanks.js',
)
const browser = await chromium.launch({ headless: true })

async function runCase(label, test) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })
  await context.addInitScript(() => {
    class MockSpeechSynthesisUtterance {
      constructor(text) {
        this.text = String(text || '')
        this.lang = ''
        this.rate = 1
        this.onend = null
        this.onerror = null
      }
    }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    })
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        cancel() {},
        speak(utterance) {
          queueMicrotask(() => utterance.onend?.())
        },
      },
    })
    Object.defineProperty(window, 'AudioContext', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(window, 'webkitAudioContext', {
      configurable: true,
      value: undefined,
    })
  })

  const captured = []
  const page = await context.newPage()
  await page.exposeFunction('__grade3TestOnFinished', (payload) => {
    captured.push(payload)
  })
  page.on('pageerror', (error) => failures.push(`${label}: pageerror: ${error.message}`))

  try {
    await test(page, captured)
  } catch (error) {
    failures.push(`${label}: ${error.message}`)
  } finally {
    await page.close()
    await context.close()
  }
}

try {
  await runCase('legacy theory D05', async (page) => {
    await gotoRoute(
      page,
      baseUrl,
      '/3-sinf/matematika/nazariy/dars05-yaxlitlash',
    )
    const options = page.locator('.stage-content .option')
    await options.first().waitFor({ state: 'visible', timeout: 10_000 })
    await options.nth(1).click()
    await page.locator('.stage-content .option-correct').waitFor({
      state: 'visible',
      timeout: 5_000,
    })

    const next = page.locator('.stage-nav .btn-white-accent')
    await next.click()
    const back = page.locator('.stage-nav .btn-ghost')
    await back.waitFor({ state: 'visible', timeout: 5_000 })
    await back.click()
    await page.locator('.stage-content .option-correct').waitFor({
      state: 'visible',
      timeout: 5_000,
    })

    await next.click()
    await back.waitFor({ state: 'visible', timeout: 5_000 })
    await page.waitForTimeout(120)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await back.waitFor({ state: 'visible', timeout: 10_000 })
    assert(await back.isEnabled(), 'Reload did not restore the second screen.')
    await back.click()
    await page.locator('.stage-content .option-correct').waitFor({
      state: 'visible',
      timeout: 5_000,
    })
  })

  await runCase('new theory D20', async (page) => {
    const storageKey = 'matematika:grade3:v2:theory:num-3-20'
    await gotoRoute(
      page,
      baseUrl,
      '/3-sinf/matematika/nazariy/dars20-amallarni-tekshirish',
    )
    const correct = page.locator('.g3d19 .options button').filter({
      hasText: /Bo.*lish/,
    })
    await correct.waitFor({ state: 'visible', timeout: 10_000 })
    await correct.click()
    await page.locator('.g3d19 .options button.right').waitFor({
      state: 'visible',
      timeout: 5_000,
    })

    const next = page.locator('.g3d19 nav .next')
    const back = page.locator('.g3d19 nav .back')
    await next.click()
    await back.click()
    assert(
      normalizedText(await page.locator('.g3d19 .options button.right').textContent())
        .endsWith("Bo'lish"),
      'Back restored a different semantic answer.',
    )

    await next.click()
    await page.waitForTimeout(120)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await back.waitFor({ state: 'visible', timeout: 10_000 })
    assert(await back.isEnabled(), 'Reload did not restore the second screen.')
    await back.click()
    assert(
      normalizedText(await page.locator('.g3d19 .options button.right').textContent())
        .endsWith("Bo'lish"),
      'Reload changed the restored semantic answer.',
    )
    const saved = await readStorage(page, storageKey)
    assert(saved?.screens?.[0]?.pickedOriginal === 0, 'pickedOriginal was not persisted.')
    assert(saved?.screens?.[0]?.attempts === 1, 'Back/Reload changed the attempt count.')
  })

  await runCase('custom practice D01', async (page) => {
    const storageKey = 'matematika:grade3:v2:practice:01'
    await gotoRoute(
      page,
      baseUrl,
      '/3-sinf/matematika/amaliy/dars01-amaliyot',
    )
    const active = page.locator('.g3-practice-host:not([aria-hidden="true"])')
    await active.waitFor({ state: 'visible', timeout: 10_000 })
    await active.getByRole('button', { name: '7', exact: true }).click()
    const check = active.locator('.g3-practice-footer button')
    await check.click({ timeout: 5_000 })
    await active.locator('.g3-practice-result').waitFor({
      state: 'visible',
      timeout: 5_000,
    })

    const chips = page.locator('.g3-practice-bank-nav button')
    await chips.nth(1).click()
    await chips.nth(0).click()
    await active.locator('.g3-practice-result').waitFor({
      state: 'visible',
      timeout: 5_000,
    })

    await chips.nth(1).click()
    await page.waitForTimeout(120)
    await page.reload({ waitUntil: 'domcontentloaded' })
    const restoredChips = page.locator('.g3-practice-bank-nav button')
    await restoredChips.first().waitFor({ state: 'visible', timeout: 10_000 })
    assert(
      await restoredChips.nth(1).getAttribute('aria-current') === 'step',
      'Reload did not restore the second practice chip.',
    )
    await restoredChips.nth(0).click()
    await page.locator(
      '.g3-practice-host:not([aria-hidden="true"]) .g3-practice-result',
    ).waitFor({ state: 'visible', timeout: 5_000 })

    const saved = await readStorage(page, storageKey)
    assert(saved?.entries?.['01']?.result?.correct === true, 'Correct result was lost.')
    assert(saved?.entries?.['01']?.attempts === 1, 'Back/Reload changed practice attempts.')
  })

  await runCase('practice completion callback D19', async (page, captured) => {
    const storageKey = 'matematika:grade3:v2:practice:19'
    await gotoRoute(
      page,
      baseUrl,
      '/3-sinf/matematika/amaliy/dars19-amaliyot',
    )
    const chips = page.locator('.g3-practice-bank-nav button')
    await chips.first().waitFor({ state: 'visible', timeout: 10_000 })
    assert(await chips.count() === DARS19_BANK.items.length, 'Practice chip count changed.')

    for (let index = 0; index < DARS19_BANK.items.length; index += 1) {
      await chips.nth(index).click()
      await page.locator(
        '.g3-practice-host:not([aria-hidden="true"]) .g3-question-shell',
      ).waitFor({ state: 'visible', timeout: 5_000 })
      await submitFactoryAnswer(page, DARS19_BANK.items[index])
    }

    await waitForFinishedCount(page, captured, 1)
    const payload = captured[0]
    const expectedKeys = [
      'lessonId',
      'lessonTitle',
      'durationSec',
      'totalQuestions',
      'correctAnswers',
      'scorePercent',
      'finalScore',
      'finalTotal',
      'passed',
      'answers',
    ]
    for (const key of expectedKeys) {
      assert(Object.hasOwn(payload, key), `onFinished payload missed ${key}.`)
    }
    assert(payload.lessonId === 'num-3-19-practice', 'Unexpected practice lessonId.')
    assert(payload.totalQuestions === 10, 'Unexpected totalQuestions.')
    assert(payload.correctAnswers === 10, 'Unexpected correctAnswers.')
    assert(payload.scorePercent === 100, 'Unexpected scorePercent.')
    assert(payload.finalScore === 10 && payload.finalTotal === 10, 'Unexpected final score.')
    assert(payload.passed === true, 'Completed practice was not marked passed.')
    assert(payload.answers?.length === 10, 'Payload did not include all answers.')
    assert(
      payload.firstTryStats?.firstTryCorrect === 10,
      'firstTryStats did not include all first-try answers.',
    )

    const saved = await readStorage(page, storageKey)
    assert(saved?.finishReportedAt, 'finishReportedAt was not persisted.')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.locator('.g3-practice-bank-nav button').first().waitFor({
      state: 'visible',
      timeout: 10_000,
    })
    await page.waitForTimeout(350)
    await page.locator('.g3-practice-bank-nav button').first().click()
    await page.locator('.g3-practice-bank-nav button').last().click()
    await page.waitForTimeout(200)
    assert(captured.length === 1, 'onFinished fired more than once after Reload/rerender.')
  })
} finally {
  await browser.close()
  await server.close()
}

if (failures.length) {
  console.error(`Grade-3 persistence smoke failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(
  'Grade-3 persistence smoke passed: legacy/new theory and custom/factory practice restore Back/Reload state; practice onFinished is exactly once.',
)
