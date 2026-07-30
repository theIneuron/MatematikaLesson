import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { createGrade3IsolationPlugin } from './grade3-vite-isolation.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const activeHostSelector = '.g3-practice-host:not([aria-hidden="true"])'
const allViewports = [
  { width: 320, height: 568, label: '320x568' },
  { width: 360, height: 640, label: '360x640' },
]
const viewportFilter = process.env.GRADE3_CUSTOM_POST_ANSWER_VIEWPORT
const viewports = viewportFilter
  ? allViewports.filter((viewport) => viewport.label === viewportFilter)
  : allViewports
if (viewports.length === 0) {
  throw new Error(`Unknown GRADE3_CUSTOM_POST_ANSWER_VIEWPORT: ${viewportFilter}`)
}

const lessonFilter = Number(process.env.GRADE3_CUSTOM_POST_ANSWER_LESSON || 0)
const itemFilter = Number(process.env.GRADE3_CUSTOM_POST_ANSWER_ITEM || 0)
const screenshotDirectory = process.env.GRADE3_CUSTOM_SCREENSHOT_DIR
  ? path.resolve(repoRoot, process.env.GRADE3_CUSTOM_SCREENSHOT_DIR)
  : null
if (lessonFilter && (!Number.isInteger(lessonFilter) || lessonFilter < 1 || lessonFilter > 9)) {
  throw new Error('GRADE3_CUSTOM_POST_ANSWER_LESSON must be an integer from 1 to 9.')
}
if (itemFilter && (!Number.isInteger(itemFilter) || itemFilter < 1 || itemFilter > 10)) {
  throw new Error('GRADE3_CUSTOM_POST_ANSWER_ITEM must be an integer from 1 to 10.')
}
if (screenshotDirectory) fs.mkdirSync(screenshotDirectory, { recursive: true })

const failures = []
const counts = {
  catalogItems: 0,
  wrong: 0,
  correct: 0,
  byKind: {},
}

function record(message) {
  failures.push(message)
}

function normalizedText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

function displayText(value) {
  return String(value ?? '').replace(/\r\n?/g, '\n').trim()
}

function evaluateLiteral(expression, label) {
  const source = String(expression || '').trim()
  if (!source) throw new Error(`${label}: empty literal`)
  if (/[`;]|\b(?:function|import|export|require|process|globalThis)\b/u.test(source)) {
    throw new Error(`${label}: unsafe or unsupported literal`)
  }
  try {
    // The expression is restricted to a constant literal read from this repository.
    return Function(`"use strict"; return (${source})`)()
  } catch (error) {
    throw new Error(`${label}: could not parse ${source}: ${error.message}`)
  }
}

function primitiveConstant(source, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = source.match(
    new RegExp(`\\b${escaped}\\s*=\\s*("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|-?\\d+(?:\\.\\d+)?|true|false)`),
  )
  if (!match) return undefined
  return evaluateLiteral(match[1], name)
}

function literalConstant(source, name) {
  const primitive = primitiveConstant(source, name)
  if (primitive !== undefined) return primitive
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = source.match(
    new RegExp(`const\\s+${escaped}\\s*=\\s*([\\s\\S]*?);`),
  )
  if (!match) throw new Error(`constant ${name} not found`)
  return evaluateLiteral(match[1], name)
}

function expressionVariable(source, field) {
  const match = source.match(
    new RegExp(`correctAnswer:\\s*\\{\\s*${field}:\\s*([A-Z][A-Z0-9_]*)`),
  )
  return match?.[1]
}

function firstLiteralConstant(source, suffixPattern) {
  const match = source.match(
    new RegExp(`const\\s+([A-Z][A-Z0-9_]*${suffixPattern})\\s*=`, 'u'),
  )
  if (!match) return null
  return literalConstant(source, match[1])
}

function uzChoiceOptions(source) {
  const inline = source.match(
    /uz:\s*\{[\s\S]*?opts:\s*(\[[^\]\n]*\])/u,
  )
  if (inline) return evaluateLiteral(inline[1], 'Uzbek options')
  const constant = firstLiteralConstant(source, '_OPTS')
  if (constant) return constant
  throw new Error('Uzbek choice options not found')
}

function mapMetadata(source) {
  const numsMatch = source.match(
    /const\s+([A-Z][A-Z0-9_]*_NUMS)\s*=\s*(\[[\s\S]*?\]);/u,
  )
  if (!numsMatch) throw new Error('matching left-side values not found')
  const left = evaluateLiteral(numsMatch[2], numsMatch[1]).map(String)

  const expressionMap = firstLiteralConstant(source, '_EXP')
  if (expressionMap) {
    return { kind: 'map', left, right: left.map((value) => String(expressionMap[value])) }
  }
  const letters = firstLiteralConstant(source, '_LETTERS')
  if (letters) return { kind: 'map', left, right: letters.map(String) }
  const wordsMatch = source.match(/words:\s*(\{[\s\S]*?\})\s*,/u)
  if (wordsMatch) {
    const words = evaluateLiteral(wordsMatch[1], 'matching words')
    return { kind: 'map', left, right: left.map((value) => String(words[value])) }
  }
  throw new Error('matching right-side values not found')
}

function parseTaskMetadata(lesson, item) {
  const lessonText = String(lesson).padStart(2, '0')
  const itemText = String(item).padStart(2, '0')
  const relativePath = path.join(
    'src',
    'components',
    'grade3',
    'practice',
    `dars${lessonText}`,
    `D${lessonText}_${itemText}.jsx`,
  )
  const absolutePath = path.join(repoRoot, relativePath)
  const source = fs.readFileSync(absolutePath, 'utf8')
  const base = { lesson, item, id: itemText, relativePath }

  if (source.includes('createPracticeQuestion(')) {
    const correctMatch = source.match(/\bcorrect:\s*(\[[^\]]+\]|"[^"]*"|'[^']*'|-?\d+)/u)
    if (!correctMatch) throw new Error(`${relativePath}: factory correct answer not found`)
    const accepted = evaluateLiteral(correctMatch[1], `${relativePath} correct`)
    return {
      ...base,
      kind: 'factory-input',
      correct: String(Array.isArray(accepted) ? accepted[0] : accepted),
    }
  }

  if (/correctAnswer:\s*\{\s*h:/u.test(source)) {
    return {
      ...base,
      kind: 'stepper',
      correct: {
        h: Number(primitiveConstant(source, 'D02_H')),
        t: Number(primitiveConstant(source, 'D02_TN')),
        o: Number(primitiveConstant(source, 'D02_O')),
      },
    }
  }

  if (/correctAnswer:\s*\{\s*\.\.\.[A-Z][A-Z0-9_]*/u.test(source)) {
    const name = source.match(
      /correctAnswer:\s*\{\s*\.\.\.([A-Z][A-Z0-9_]*)/u,
    )?.[1]
    return { ...base, kind: 'bins', correct: literalConstant(source, name) }
  }

  if (/correctAnswer:\s*\{\s*map:/u.test(source)) {
    return { ...base, ...mapMetadata(source) }
  }

  if (/correctAnswer:\s*\{\s*plates:/u.test(source)) {
    const name = expressionVariable(source, 'plates')
    const correct = literalConstant(source, name)
    const pool = firstLiteralConstant(source, '_POOL')
    return { ...base, kind: 'plates', correct, pool }
  }

  if (/correctAnswer:\s*\{\s*slots:/u.test(source)) {
    const name = expressionVariable(source, 'slots')
    return { ...base, kind: 'slots', correct: literalConstant(source, name) }
  }

  if (/correctAnswer:\s*\{\s*sign:/u.test(source)) {
    const name = expressionVariable(source, 'sign')
    return { ...base, kind: 'sign', correct: String(literalConstant(source, name)) }
  }

  if (/correctAnswer:\s*\{\s*value:/u.test(source)) {
    const name = expressionVariable(source, 'value')
    const correct = String(literalConstant(source, name))
    if (/const\s+\[slots,/u.test(source)) {
      return { ...base, kind: 'builder', correct }
    }
    return { ...base, kind: 'input', correct }
  }

  if (/correctAnswer:\s*\{\s*idx:/u.test(source)) {
    const name = expressionVariable(source, 'idx')
    const correctIndex = Number(literalConstant(source, name))
    if (/role="button"/u.test(source) && !/<button/u.test(source)) {
      return { ...base, kind: 'role-index', correctIndex }
    }
    const options = uzChoiceOptions(source).map((value) => displayText(
      Array.isArray(value) ? value[0] : value,
    ))
    const duplicate = options.find((value, index) => options.indexOf(value) !== index)
    if (duplicate !== undefined) {
      throw new Error(`choice options are not visually unique: ${JSON.stringify(duplicate)}`)
    }
    return { ...base, kind: 'choice', correctIndex, options }
  }

  throw new Error(`${relativePath}: unsupported custom answer contract`)
}

const catalog = []
for (let lesson = 1; lesson <= 9; lesson += 1) {
  for (let item = 1; item <= 10; item += 1) {
    try {
      const metadata = parseTaskMetadata(lesson, item)
      catalog.push(metadata)
      counts.catalogItems += 1
      counts.byKind[metadata.kind] = (counts.byKind[metadata.kind] || 0) + 1
    } catch (error) {
      throw new Error(`D${String(lesson).padStart(2, '0')}/${String(item).padStart(2, '0')}: ${error.message}`)
    }
  }
}
if (catalog.length !== 90) {
  throw new Error(`Expected 90 custom task contracts, found ${catalog.length}.`)
}

const selectedCatalog = catalog.filter((task) => (
  (!lessonFilter || task.lesson === lessonFilter) &&
  (!itemFilter || task.item === itemFilter)
))
if (selectedCatalog.length === 0) throw new Error('No custom tasks selected.')

if (process.env.GRADE3_CUSTOM_METADATA_ONLY === '1') {
  console.log(
    `Grade-3 custom metadata passed: ${catalog.length} items; ${JSON.stringify(counts.byKind)}.`,
  )
  process.exit(0)
}

function activeContent(page) {
  return page.locator(`${activeHostSelector} .g3-practice-content`)
}

async function dispatchClick(locator) {
  await locator.evaluate((element) => {
    element.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }))
  })
}

async function clickControlByText(page, label, selector = 'button,[role="button"]') {
  const expected = normalizedText(label)
  const controls = activeContent(page).locator(selector)
  const count = await controls.count()
  for (let index = 0; index < count; index += 1) {
    const control = controls.nth(index)
    if (!(await control.isVisible()) || !(await control.isEnabled())) continue
    if (normalizedText(await control.textContent()) === expected) {
      await dispatchClick(control)
      return
    }
  }
  throw new Error(`enabled answer control not found: ${expected}`)
}

async function clickChoiceOption(page, label) {
  const expectedDisplay = displayText(label)
  const expectedNormalized = normalizedText(label)
  const controls = activeContent(page).locator('button')
  const exact = []
  const normalized = []
  for (let index = 0; index < await controls.count(); index += 1) {
    const control = controls.nth(index)
    if (!(await control.isVisible()) || !(await control.isEnabled())) continue
    const text = await control.textContent()
    if (displayText(text) === expectedDisplay) exact.push(control)
    if (normalizedText(text) === expectedNormalized) normalized.push(control)
  }
  if (exact.length === 1) {
    await dispatchClick(exact[0])
    return
  }
  if (exact.length > 1) {
    throw new Error(`ambiguous exact choice text: ${JSON.stringify(expectedDisplay)}`)
  }
  if (normalized.length === 1) {
    await dispatchClick(normalized[0])
    return
  }
  throw new Error(`unique enabled choice not found: ${JSON.stringify(expectedDisplay)}`)
}

async function clickRoleIndex(page, index) {
  const controls = activeContent(page).locator('[role="button"]')
  if (index < 0 || index >= await controls.count()) {
    throw new Error(`role-button index ${index} is unavailable`)
  }
  await dispatchClick(controls.nth(index))
}

async function enterNumpadValue(page, value) {
  const pad = activeContent(page).locator('.g3-lesson-numpad')
  await pad.waitFor({ state: 'visible', timeout: 5_000 })
  for (const digit of String(value)) {
    const button = pad.getByRole('button', { name: new RegExp(`^${digit}$`) })
    await dispatchClick(button)
  }
}

function differentSequence(sequence) {
  const reversed = [...sequence].reverse()
  if (reversed.some((value, index) => value !== sequence[index])) return reversed
  return [...sequence.slice(1), sequence[0]]
}

function differentText(value) {
  const candidates = ['0', '1', '2', '9']
  return candidates.find((candidate) => normalizedText(candidate) !== normalizedText(value)) || '0'
}

async function setTaskAnswer(page, task, correct) {
  if (task.kind === 'factory-input') {
    const step = activeContent(page).locator('.g3-mobile-step-button')
    await step.waitFor({ state: 'visible', timeout: 5_000 })
    await dispatchClick(step)
    await activeContent(page).locator('.g3-question-shell.g3-mobile-answer')
      .waitFor({ state: 'visible', timeout: 5_000 })
    await enterNumpadValue(page, correct ? task.correct : differentText(task.correct))
    return
  }

  if (task.kind === 'choice') {
    const index = correct
      ? task.correctIndex
      : task.options.findIndex((_, optionIndex) => optionIndex !== task.correctIndex)
    await clickChoiceOption(page, task.options[index])
    return
  }

  if (task.kind === 'role-index') {
    const index = correct
      ? task.correctIndex
      : task.correctIndex === 0 ? 1 : 0
    await clickRoleIndex(page, index)
    return
  }

  if (task.kind === 'sign') {
    const value = correct
      ? task.correct
      : ['>', '<', '='].find((candidate) => candidate !== task.correct)
    await clickControlByText(page, value)
    return
  }

  if (task.kind === 'input') {
    await enterNumpadValue(page, correct ? task.correct : differentText(task.correct))
    return
  }

  if (task.kind === 'stepper') {
    if (!correct) return
    const plusButtons = activeContent(page).getByRole('button', { name: '+' })
    const values = [task.correct.h, task.correct.t, task.correct.o]
    if (await plusButtons.count() !== 3) throw new Error('expected three stepper plus buttons')
    for (let index = 0; index < values.length; index += 1) {
      for (let click = 0; click < values[index]; click += 1) {
        await dispatchClick(plusButtons.nth(index))
      }
    }
    return
  }

  if (task.kind === 'map') {
    const right = correct ? task.right : [...task.right.slice(1), task.right[0]]
    for (let index = 0; index < task.left.length; index += 1) {
      await clickControlByText(page, task.left[index])
      await clickControlByText(page, right[index])
    }
    return
  }

  if (task.kind === 'slots') {
    const sequence = correct ? task.correct : differentSequence(task.correct)
    for (const value of sequence) {
      await clickControlByText(page, value, 'button[class*="-drop"]')
    }
    return
  }

  if (task.kind === 'builder') {
    const sequence = correct
      ? [...String(task.correct)]
      : differentSequence([...String(task.correct)])
    for (const value of sequence) {
      await clickControlByText(page, value, 'button[class*="-drop"]')
    }
    return
  }

  if (task.kind === 'plates') {
    let sequence = task.correct
    if (!correct) {
      const distractor = task.pool.find((value) => !task.correct.includes(value))
      sequence = distractor === undefined ? [task.correct[0]] : [distractor]
    }
    for (const value of sequence) await clickControlByText(page, value)
    return
  }

  if (task.kind === 'bins') {
    const keys = ['h', 't', 'o']
    const correctValues = keys.map((key) => task.correct[key])
    const values = correct ? correctValues : [...correctValues.slice(1), correctValues[0]]
    const bins = activeContent(page).locator('button').filter({ has: page.locator('span') })
    if (await bins.count() < 3) throw new Error('expected three place-value bins')
    for (let index = 0; index < values.length; index += 1) {
      await clickControlByText(page, values[index], 'button[class*="-drop"]')
      await dispatchClick(bins.nth(index))
    }
    return
  }

  throw new Error(`missing interaction adapter for ${task.kind}`)
}

function storageKey(lesson) {
  return `matematika:grade3:v2:practice:${String(lesson).padStart(2, '0')}`
}

async function readStoredResult(page, task) {
  return page.evaluate(({ key, id }) => {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null')?.entries?.[id]?.result || null
    } catch {
      return null
    }
  }, { key: storageKey(task.lesson), id: task.id })
}

async function submit(page, task, expectedCorrect) {
  const button = page.locator(
    `${activeHostSelector} .g3-practice-footer button:not([disabled])`,
  )
  await button.waitFor({ state: 'visible', timeout: 5_000 })
  await dispatchClick(button)
  await page.waitForFunction(
    ({ key, id }) => {
      try {
        return typeof JSON.parse(localStorage.getItem(key) || 'null')
          ?.entries?.[id]?.result?.correct === 'boolean'
      } catch {
        return false
      }
    },
    { key: storageKey(task.lesson), id: task.id },
    { timeout: 5_000 },
  )
  const result = await readStoredResult(page, task)
  if (result?.correct !== expectedCorrect) {
    throw new Error(
      `expected ${expectedCorrect ? 'correct' : 'wrong'} submission, received ${String(result?.correct)}`,
    )
  }
}

async function inspectInitialChoices(page, task) {
  if (!['choice', 'role-index', 'sign'].includes(task.kind)) return []
  return page.evaluate(({ hostSelector, kind, expectedCount }) => {
    const content = document.querySelector(`${hostSelector} .g3-practice-content`)
    if (!content) return ['active content missing before answer']
    const visible = (element) => {
      const style = getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      return (
        !element.disabled &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        rect.width > 1 &&
        rect.height > 1
      )
    }
    const normalized = (value) => String(value || '').replace(/\s+/g, ' ').trim()
    const preserved = (value) => String(value || '').replace(/\r\n?/g, '\n').trim()
    const signature = (element) => {
      const aria = normalized(element.getAttribute('aria-label'))
      if (aria) return `aria:${aria}`
      const pre = element.matches('pre') ? element : element.querySelector('pre')
      if (pre) return `pre:${preserved(pre.innerText || pre.textContent)}`
      return `text:${normalized(element.innerText || element.textContent)}`
    }
    const selector = kind === 'role-index' ? '[role="button"]' : 'button'
    const controls = [...content.querySelectorAll(selector)].filter(visible)
    const issues = []
    if (expectedCount && controls.length !== expectedCount) {
      issues.push(`expected ${expectedCount} mutually exclusive controls, found ${controls.length}`)
    }
    const signatures = controls.map(signature)
    const blank = signatures.find((value) => /^(?:aria|pre|text):$/u.test(value))
    if (blank) issues.push('answer control has no visible text or aria-label')
    const duplicates = [...new Set(
      signatures.filter((value, index) => signatures.indexOf(value) !== index),
    )]
    for (const duplicate of duplicates) {
      issues.push(`indistinguishable answer controls: ${JSON.stringify(duplicate)}`)
    }
    return issues
  }, {
    hostSelector: activeHostSelector,
    kind: task.kind,
    expectedCount: task.kind === 'choice' ? task.options.length : task.kind === 'sign' ? 3 : 0,
  })
}

async function inspectPostAnswer(page, expectedCorrect, task) {
  return page.evaluate(({ hostSelector, factory, expectedCorrect }) => {
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
    const host = document.querySelector(hostSelector)
    const viewport = host?.querySelector('.g3-practice-viewport')
    const content = host?.querySelector('.g3-practice-content')
    const footer = host?.querySelector('.g3-practice-footer')
    const result = host?.querySelector('.g3-practice-result')
    const issues = []
    if (!host || !viewport || !content || !footer || !result) {
      return ['active host/content/footer/result missing']
    }

    const critical = [
      document.documentElement,
      document.querySelector('.g3-practice-bank-root'),
      document.querySelector('.g3-practice-bank-body'),
      host,
      viewport,
      content,
      ...content.querySelectorAll(':scope > div'),
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
      ...content.querySelectorAll(
        'button:not([disabled]),[role="button"],input,[class*="-pop"],[role="status"]',
      ),
    ].filter(visible)
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

    const footerRect = footer.getBoundingClientRect()
    if (
      footerRect.left < -2 ||
      footerRect.top < -2 ||
      footerRect.right > innerWidth + 2 ||
      footerRect.bottom > innerHeight + 2
    ) {
      issues.push('practice footer outside viewport')
    }

    const expectedWrong = host.classList.contains('has-wrong-result')
    if (expectedWrong !== !expectedCorrect) issues.push('host result state mismatch')

    const feedbackBlocks = [...content.querySelectorAll('[class*="-pop"]')].filter(visible)
    if (!expectedCorrect) {
      if (factory) {
        const status = content.querySelector('[role="status"]')
        const statusText = status?.innerText?.replace(/\s+/g, ' ').trim() || ''
        if (!visible(status)) issues.push('factory wrong feedback missing')
        if (/maslahat|подсказ/iu.test(statusText)) issues.push('wrong feedback reveals hint')
        if (feedbackBlocks.length !== 1) {
          issues.push(`factory wrong state exposes ${feedbackBlocks.length} feedback/rule blocks`)
        }
      } else if (feedbackBlocks.length !== 0) {
        issues.push(`custom wrong state exposes ${feedbackBlocks.length} hint/rule blocks`)
      }
    } else if (!factory && feedbackBlocks.length < 1) {
      issues.push('custom correct explanation missing')
    }

    return [...new Set(issues)]
  }, {
    hostSelector: activeHostSelector,
    expectedCorrect,
    factory: task.kind === 'factory-input',
  })
}

async function retry(page, task) {
  const rootSelector = `${activeHostSelector} .g3-practice-content > div`
  const previousRoot = await page.locator(rootSelector).first().elementHandle()
  const button = page.locator(
    `${activeHostSelector} .g3-practice-footer button:not([disabled])`,
  )
  await button.waitFor({ state: 'visible', timeout: 5_000 })
  await dispatchClick(button)
  await page.waitForFunction(
    ({ key, id }) => {
      try {
        return !JSON.parse(localStorage.getItem(key) || 'null')?.entries?.[id]?.result
      } catch {
        return false
      }
    },
    { key: storageKey(task.lesson), id: task.id },
    { timeout: 5_000 },
  )
  await page.locator(`${activeHostSelector} .g3-practice-result`)
    .waitFor({ state: 'hidden', timeout: 5_000 })
  if (previousRoot) {
    await page.waitForFunction(
      ({ selector, prior }) => {
        const current = document.querySelector(selector)
        return Boolean(current && !current.isSameNode(prior))
      },
      { selector: rootSelector, prior: previousRoot },
      { timeout: 5_000 },
    )
  }
}

async function captureState(page, task, viewportLabel, state) {
  if (!screenshotDirectory) return
  const lesson = String(task.lesson).padStart(2, '0')
  const item = String(task.item).padStart(2, '0')
  await page.screenshot({
    path: path.join(
      screenshotDirectory,
      `${viewportLabel}-D${lesson}_${item}-${state}.png`,
    ),
    animations: 'disabled',
  })
}

async function exerciseTask(page, task, label, viewportLabel) {
  for (const issue of await inspectInitialChoices(page, task)) {
    record(`${label} initial: ${issue}`)
  }
  await captureState(page, task, viewportLabel, 'before')

  await setTaskAnswer(page, task, false)
  await submit(page, task, false)
  counts.wrong += 1
  for (const issue of await inspectPostAnswer(page, false, task)) {
    record(`${label} wrong: ${issue}`)
  }

  await retry(page, task)
  await setTaskAnswer(page, task, true)
  await submit(page, task, true)
  counts.correct += 1
  for (const issue of await inspectPostAnswer(page, true, task)) {
    record(`${label} correct: ${issue}`)
  }
  await captureState(page, task, viewportLabel, 'correct')
}

const selectedLessons = [...new Set(selectedCatalog.map((task) => task.lesson))]
  .map((lesson) => ({
    lesson,
    tasks: selectedCatalog.filter((task) => task.lesson === lesson),
  }))

const server = await createServer({
  root: repoRoot,
  logLevel: 'error',
  plugins: [createGrade3IsolationPlugin()],
  server: { host: '127.0.0.1', port: 0, strictPort: false },
})
await server.listen()
const baseUrl = server.resolvedUrls?.local?.[0]
if (!baseUrl) throw new Error('Vite did not expose a local URL.')

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

        const { lesson, tasks } = selectedLessons[lessonIndex]
        const lessonText = String(lesson).padStart(2, '0')
        const route = `/3-sinf/matematika/amaliy/dars${lessonText}-amaliyot`
        const lessonLabel = `practice-${lessonText}`
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

          for (const task of tasks) {
            activeLabel = `${lessonLabel} item-${task.item}`
            await chips.nth(task.item - 1).click()
            await page.locator(`${activeHostSelector} .g3-practice-content`)
              .waitFor({ state: 'visible', timeout: 5_000 })
            try {
              await exerciseTask(
                page,
                task,
                `${viewport.label} ${activeLabel} ${task.kind}`,
                viewport.label,
              )
            } catch (error) {
              record(`${viewport.label} ${activeLabel} ${task.kind}: ${error.message}`)
            }
          }
        } catch (error) {
          record(`${viewport.label} ${lessonLabel}: ${error.message}`)
        }
      }

      await page.close()
    }

    await Promise.all(Array.from({ length: Math.min(4, selectedLessons.length) }, () => worker()))
    await context.close()
  }
} finally {
  await browser.close()
  await server.close()
}

const expectedSubmissions = selectedCatalog.length * viewports.length
if (counts.wrong !== expectedSubmissions) {
  record(`wrong submissions: expected ${expectedSubmissions}, completed ${counts.wrong}`)
}
if (counts.correct !== expectedSubmissions) {
  record(`correct submissions: expected ${expectedSubmissions}, completed ${counts.correct}`)
}

if (failures.length) {
  console.error(`Grade-3 custom post-answer smoke failed with ${failures.length} issue(s):`)
  for (const failure of failures.slice(0, 180)) console.error(`- ${failure}`)
  if (failures.length > 180) console.error(`...and ${failures.length - 180} more.`)
  process.exit(1)
}

console.log(
  `Grade-3 custom post-answer smoke passed: ${selectedCatalog.length}/${catalog.length} items, ` +
  `${viewports.length} viewports, ${counts.wrong} wrong + ${counts.correct} correct submissions; ` +
  `kinds ${JSON.stringify(counts.byKind)}.`,
)
