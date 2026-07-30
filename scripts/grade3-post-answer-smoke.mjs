import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { createGrade3IsolationPlugin } from './grade3-vite-isolation.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const allViewports = [
  { width: 320, height: 568, label: '320x568' },
  { width: 360, height: 640, label: '360x640' },
]
const viewportFilter = process.env.GRADE3_POST_ANSWER_VIEWPORT
const viewports = viewportFilter
  ? allViewports.filter((viewport) => viewport.label === viewportFilter)
  : allViewports
if (viewports.length === 0) {
  throw new Error(`Unknown GRADE3_POST_ANSWER_VIEWPORT: ${viewportFilter}`)
}
const failures = []
const counts = {
  items: 0,
  wrong: 0,
  correct: 0,
  byType: { choice: 0, input: 0, multi: 0, order: 0 },
}

function record(message) {
  failures.push(message)
}

function normalizedText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

function regexEscape(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function numericCandidates(values) {
  const candidates = []
  for (const value of values) {
    const raw = String(value ?? '').trim()
    const variants = [raw]
    const withUnit = raw.match(
      /^([+-]?\d[\d\s]*(?:[.,]\d+)?)\s*(?:[a-zа-яёʻʼ’'°²³]+(?:\s*\/\s*[a-zа-яёʻʼ’'°²³]+)?)$/iu,
    )
    if (withUnit) variants.push(withUnit[1])
    for (let candidate of variants) {
      candidate = candidate
        .trim()
        .toLowerCase()
        .replace(/^[xх]\s*=\s*/iu, '')
        .replaceAll('×', '*')
        .replaceAll('х', '*')
        .replaceAll('x', '*')
        .replaceAll('÷', ':')
        .replace(/\s+/g, '')
      if (/^[+-]?\d{1,3}(?:\.\d{3})+$/.test(candidate)) {
        candidate = candidate.replaceAll('.', '')
      }
      candidate = candidate.replace(',', '.')
      if (/^\d+$/.test(candidate) && !candidates.includes(candidate)) candidates.push(candidate)
    }
  }
  return candidates
}

function wrongAnswerFor(spec) {
  if (spec.type === 'choice') {
    return spec.text.uz.options.findIndex((_, index) => index !== spec.correct)
  }
  if (spec.type === 'multi') {
    const optionCount = spec.text.uz.options.length
    const incorrect = Array.from({ length: optionCount }, (_, index) => index)
      .find((index) => !spec.correct.includes(index))
    if (incorrect !== undefined) return [incorrect]
    if (spec.correct.length > 1) return [spec.correct[0]]
    return []
  }
  if (spec.type === 'order') {
    const reversed = [...spec.correct].reverse()
    if (reversed.some((value, index) => value !== spec.correct[index])) return reversed
    return [...spec.correct.slice(1), spec.correct[0]]
  }
  return '__grade3_smoke_wrong__'
}

async function clickOption(page, label) {
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
    if (
      actual === expected ||
      withoutCheckbox === expected ||
      withoutOrder === expected
    ) {
      await button.evaluate((element) => element.click())
      return
    }
  }
  throw new Error(`answer option not found: ${expected}`)
}

async function enterNumpadValue(page, value) {
  const pad = page.locator(
    '.g3-practice-host:not([aria-hidden="true"]) .g3-lesson-numpad',
  )
  for (const digit of String(value)) {
    await pad.getByRole('button', { name: new RegExp(`^${regexEscape(digit)}$`) }).click()
  }
}

async function submitAnswer(page, spec, answer) {
  if (spec.type === 'choice') {
    await clickOption(page, spec.text.uz.options[answer])
  } else if (spec.type === 'multi' || spec.type === 'order') {
    for (const index of answer) await clickOption(page, spec.text.uz.options[index])
  } else {
    const input = page.locator(
      '.g3-practice-host:not([aria-hidden="true"]) .g3-answer-zone input',
    )
    if (await input.count()) {
      await input.fill(String(answer))
    } else {
      await enterNumpadValue(page, answer)
    }
  }

  const check = page.locator(
    '.g3-practice-host:not([aria-hidden="true"]) .g3-practice-footer button:not([disabled])',
  )
  await check.waitFor({ state: 'visible', timeout: 5_000 })
  await check.click()
}

async function openAnswerStep(page) {
  const step = page.locator(
    '.g3-practice-host:not([aria-hidden="true"]) .g3-mobile-step-button',
  )
  await step.waitFor({ state: 'visible', timeout: 5_000 })
  await step.click()
  await page.locator(
    '.g3-practice-host:not([aria-hidden="true"]) .g3-question-shell.g3-mobile-answer',
  )
    .waitFor({ state: 'visible', timeout: 5_000 })
}

async function waitForResult(page, expected) {
  await page.locator(
    `.g3-practice-host:not([aria-hidden="true"]) .g3-question-shell.g3-result-${expected}`,
  )
    .waitFor({ state: 'visible', timeout: 5_000 })
  await page.locator(
    '.g3-practice-host:not([aria-hidden="true"]) .g3-practice-result',
  ).waitFor({ state: 'visible', timeout: 5_000 })
}

async function inspectPostAnswer(page, expected, spec) {
  return page.evaluate(({ expectedState, text }) => {
    const visible = (element) => {
      if (!element) return false
      const style = getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        rect.width > 1 &&
        rect.height > 1
      )
    }
    const name = (element) => {
      const classes = [...element.classList].slice(0, 4).map((value) => `.${value}`).join('')
      return `${element.tagName.toLowerCase()}${classes}`
    }
    const activeHost = document.querySelector(
      '.g3-practice-host:not([aria-hidden="true"])',
    )
    const content = activeHost?.querySelector('.g3-practice-content')
    const shell = activeHost?.querySelector('.g3-question-shell')
    const status = shell?.querySelector('[role="status"]')
    const issues = []

    if (!activeHost || !content || !shell) {
      return { issues: ['active practice shell missing'], statusText: '' }
    }
    if (!shell.classList.contains(`g3-result-${expectedState}`)) {
      issues.push(`expected g3-result-${expectedState}`)
    }
    if (!status || !visible(status)) issues.push('visible feedback status missing')

    const critical = [
      document.documentElement,
      document.querySelector('.g3-practice-bank-root'),
      document.querySelector('.g3-practice-bank-body'),
      activeHost,
      activeHost.querySelector('.g3-practice-viewport'),
      content,
      shell,
    ].filter(Boolean)
    for (const element of critical) {
      if (!visible(element)) continue
      if (
        element.scrollHeight > element.clientHeight + 6 ||
        element.scrollWidth > element.clientWidth + 6
      ) {
        issues.push(
          `clipped ${name(element)}:${element.clientWidth}x${element.clientHeight}` +
          `/${element.scrollWidth}x${element.scrollHeight}`,
        )
      }
    }

    const contentRect = content.getBoundingClientRect()
    const essentials = [
      shell.querySelector('.g3-question-work-panel'),
      status,
      ...shell.querySelectorAll(
        '.g3-question-work-panel button, .g3-question-work-panel input,' +
        ' .g3-question-work-panel .g3-practice-pop',
      ),
    ].filter((element) => visible(element))
    for (const element of essentials) {
      const rect = element.getBoundingClientRect()
      if (
        rect.left < contentRect.left - 2 ||
        rect.top < contentRect.top - 2 ||
        rect.right > contentRect.right + 2 ||
        rect.bottom > contentRect.bottom + 2
      ) {
        issues.push(`outside content ${name(element)}`)
      }
    }

    const footer = activeHost.querySelector('.g3-practice-footer')
    if (!visible(footer)) {
      issues.push('practice footer missing')
    } else {
      const rect = footer.getBoundingClientRect()
      if (
        rect.left < -2 ||
        rect.top < -2 ||
        rect.right > innerWidth + 2 ||
        rect.bottom > innerHeight + 2
      ) {
        issues.push('practice footer outside viewport')
      }
    }

    const statusText = (status?.lastElementChild?.innerText || status?.innerText || '')
      .replace(/\s+/g, ' ')
      .trim()
    const feedbackBlocks = [...shell.querySelectorAll('.g3-practice-pop')]
      .filter((element) => visible(element))
    if (expectedState === 'wrong') {
      const hint = String(text.wrong || '')
        .replace(/^[^:]{0,24}:\s*/u, '')
        .replace(/\s+/g, ' ')
        .trim()
      if (hint.length >= 4 && statusText.includes(hint)) {
        issues.push('wrong feedback reveals hint')
      }
      if (feedbackBlocks.length !== 1) {
        issues.push(`wrong state exposes ${feedbackBlocks.length} feedback/rule blocks`)
      }
    } else {
      const expectedText = String(text.correct || '').replace(/\s+/g, ' ').trim()
      if (expectedText && statusText !== expectedText) {
        issues.push('correct feedback lost the worked solution')
      }
    }

    return { issues: [...new Set(issues)], statusText }
  }, { expectedState: expected, text: spec.text.uz })
}

async function retry(page) {
  const button = page.locator(
    '.g3-practice-host:not([aria-hidden="true"]) .g3-practice-footer button:not([disabled])',
  )
  await button.waitFor({ state: 'visible', timeout: 5_000 })
  await button.click()
  await page.locator(
    '.g3-practice-host:not([aria-hidden="true"]) ' +
    '.g3-question-shell:not(.g3-result-wrong):not(.g3-result-correct)',
  )
    .waitFor({ state: 'visible', timeout: 5_000 })
}

async function exerciseItem(page, spec, label) {
  await openAnswerStep(page)

  let wrong = wrongAnswerFor(spec)
  if (
    spec.type === 'input' &&
    await page.locator(
      '.g3-practice-host:not([aria-hidden="true"]) .g3-lesson-numpad',
    ).count()
  ) {
    const accepted = numericCandidates(
      Array.isArray(spec.correct) ? spec.correct : [spec.correct],
    )
    wrong = ['0', '1', '2', '9'].find((value) => !accepted.includes(value))
    if (wrong === undefined) throw new Error('could not construct a numeric wrong answer')
  }
  if (
    wrong === undefined ||
    wrong === null ||
    (Array.isArray(wrong) && wrong.length === 0)
  ) {
    throw new Error(`could not construct a wrong ${spec.type} answer`)
  }

  await submitAnswer(page, spec, wrong)
  await waitForResult(page, 'wrong')
  counts.wrong += 1
  const wrongInspection = await inspectPostAnswer(page, 'wrong', spec)
  for (const issue of wrongInspection.issues) record(`${label} wrong: ${issue}`)

  await retry(page)
  await openAnswerStep(page)

  let correct = spec.correct
  if (spec.type === 'input') {
    const accepted = Array.isArray(spec.correct) ? spec.correct : [spec.correct]
    if (
      await page.locator(
        '.g3-practice-host:not([aria-hidden="true"]) .g3-lesson-numpad',
      ).count()
    ) {
      correct = numericCandidates(accepted)[0]
      if (!correct) throw new Error('numeric correct answer is unavailable')
    } else {
      correct = accepted[0]
    }
  }
  await submitAnswer(page, spec, correct)
  await waitForResult(page, 'correct')
  counts.correct += 1
  const correctInspection = await inspectPostAnswer(page, 'correct', spec)
  for (const issue of correctInspection.issues) record(`${label} correct: ${issue}`)
}

const server = await createServer({
  root: repoRoot,
  logLevel: 'error',
  plugins: [createGrade3IsolationPlugin()],
  server: { host: '127.0.0.1', port: 0, strictPort: false },
})
await server.listen()
const baseUrl = server.resolvedUrls?.local?.[0]
if (!baseUrl) throw new Error('Vite did not expose a local URL.')

const newBanks = await server.ssrLoadModule(
  '/src/components/grade3/practice/newBanks.js',
)
const derivedBanks = await server.ssrLoadModule(
  '/src/components/grade3/practice/theoryDerivedBanks.js',
)
const banks = Object.fromEntries([
  ...Array.from(
    { length: 10 },
    (_, index) => [index + 10, newBanks[`DARS${index + 10}_BANK`]],
  ),
  ...Object.entries(derivedBanks.GRADE3_THEORY_DERIVED_BANKS)
    .map(([number, bank]) => [Number(number), bank]),
])
const lessons = Object.entries(banks)
  .map(([number, bank]) => ({ number: Number(number), bank }))
  .sort((left, right) => left.number - right.number)

for (const { bank } of lessons) {
  if (!bank || bank.items.length !== 10) {
    throw new Error('Factory practice bank must contain exactly 10 items.')
  }
  for (const spec of bank.items) {
    counts.items += 1
    counts.byType[spec.type] = (counts.byType[spec.type] || 0) + 1
    const options = spec.text?.uz?.options
    if (options && new Set(options.map(normalizedText)).size !== options.length) {
      throw new Error(`${spec.tag}: duplicate Uzbek option labels make UI selection ambiguous.`)
    }
  }
}
if (counts.items !== 420 || Object.values(counts.byType).some((count) => count === 0)) {
  throw new Error(
    `Expected 420 factory items and all four interactions; found ${counts.items} ` +
    JSON.stringify(counts.byType),
  )
}

const lessonFilter = Number(process.env.GRADE3_POST_ANSWER_LESSON || 0)
const itemFilter = Number(process.env.GRADE3_POST_ANSWER_ITEM || 0)
const selectedLessons = lessonFilter
  ? lessons.filter(({ number }) => number === lessonFilter)
  : lessons
if (selectedLessons.length === 0) {
  throw new Error(`Unknown GRADE3_POST_ANSWER_LESSON: ${lessonFilter}`)
}
if (itemFilter && (!Number.isInteger(itemFilter) || itemFilter < 1 || itemFilter > 10)) {
  throw new Error(`GRADE3_POST_ANSWER_ITEM must be an integer from 1 to 10.`)
}
const selectedItemCount = selectedLessons.length * (itemFilter ? 1 : 10)

const browser = await chromium.launch({ headless: true })

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: 'reduce',
    })
    await context.addInitScript(() => {
      try {
        Object.defineProperty(window, 'AudioContext', { value: undefined })
        Object.defineProperty(window, 'webkitAudioContext', { value: undefined })
        window.speechSynthesis.cancel = () => {}
        window.speechSynthesis.speak = (utterance) => queueMicrotask(() => utterance.onend?.())
      } catch {
        // Audio is optional for a layout/feedback acceptance check.
      }
    })
    let nextLesson = 0

    async function worker() {
      const page = await context.newPage()
      let activeLabel = 'initial'
      page.on('pageerror', (error) => record(`${viewport.label} ${activeLabel}: ${error.message}`))

      while (true) {
        const lessonIndex = nextLesson
        nextLesson += 1
        if (lessonIndex >= selectedLessons.length) break

        const { number, bank } = selectedLessons[lessonIndex]
        const lessonLabel = `practice-${String(number).padStart(2, '0')}`
        const route = `/3-sinf/matematika/amaliy/dars${String(number).padStart(2, '0')}-amaliyot`
        activeLabel = lessonLabel

        try {
          await page.goto(new URL(route, baseUrl).href, {
            waitUntil: 'domcontentloaded',
            timeout: 20_000,
          })
          const chips = page.locator('.g3-practice-bank-nav button')
          await chips.first().waitFor({ state: 'visible', timeout: 10_000 })
          if (await chips.count() !== 10) {
            throw new Error(`expected 10 task chips, found ${await chips.count()}`)
          }

          const itemIndexes = itemFilter
            ? [itemFilter - 1]
            : Array.from({ length: bank.items.length }, (_, index) => index)
          for (const index of itemIndexes) {
            activeLabel = `${lessonLabel} item-${index + 1}`
            await chips.nth(index).click()
            await page.locator(
              '.g3-practice-host:not([aria-hidden="true"]) .g3-question-shell',
            ).waitFor({ state: 'visible', timeout: 5_000 })
            try {
              await exerciseItem(
                page,
                bank.items[index],
                `${viewport.label} ${activeLabel} ${bank.items[index].type}`,
              )
            } catch (error) {
              record(`${viewport.label} ${activeLabel}: ${error.message}`)
            }
          }
        } catch (error) {
          record(`${viewport.label} ${lessonLabel}: ${error.message}`)
        }
      }

      await page.close()
    }

    await Promise.all(Array.from({ length: 4 }, () => worker()))
    await context.close()
  }
} finally {
  await browser.close()
  await server.close()
}

const expectedSubmissions = selectedItemCount * viewports.length
if (counts.wrong !== expectedSubmissions) {
  record(`wrong submissions: expected ${expectedSubmissions}, completed ${counts.wrong}`)
}
if (counts.correct !== expectedSubmissions) {
  record(`correct submissions: expected ${expectedSubmissions}, completed ${counts.correct}`)
}

if (failures.length) {
  console.error(`Grade-3 post-answer smoke failed with ${failures.length} issue(s):`)
  for (const failure of failures.slice(0, 160)) console.error(`- ${failure}`)
  if (failures.length > 160) console.error(`...and ${failures.length - 160} more.`)
  process.exit(1)
}

console.log(
  `Grade-3 post-answer smoke passed: ${selectedItemCount}/${counts.items} factory items, ` +
  `${viewports.length} viewports, ${counts.wrong} wrong + ${counts.correct} correct submissions; ` +
  `types ${JSON.stringify(counts.byType)}.`,
)
