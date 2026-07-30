import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { createGrade3IsolationPlugin } from './grade3-vite-isolation.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const registrySource = fs.readFileSync(path.join(repoRoot, 'src', 'lessons', 'grade3.js'), 'utf8')
const theoryBlock = registrySource.slice(
  registrySource.indexOf('export const grade3Nazariy'),
  registrySource.indexOf('// 3-sinf AMALIY'),
)
const theorySlugs = [...theoryBlock.matchAll(/slug:\s*'([^']+)'/g)]
  .map((match) => match[1])
  .slice(0, 18)

const lessons = theorySlugs.map((slug, index) => {
  const lessonNumber = index + 1
  const lessonSource = fs.readFileSync(
    path.join(repoRoot, 'src', 'components', 'grade3', `Dars${String(lessonNumber).padStart(2, '0')}.jsx`),
    'utf8',
  )
  const screenStart = lessonSource.indexOf('const Screen0')
  const screenEnd = lessonSource.indexOf('// s1', screenStart)
  const screenSource = lessonSource.slice(screenStart, screenEnd)
  const correctIndex = Number(screenSource.match(/const ok\s*=\s*picked\s*===\s*(\d+)/)?.[1])
  if (!Number.isInteger(correctIndex)) {
    throw new Error(`Could not determine the Screen0 answer for Dars${String(lessonNumber).padStart(2, '0')}.`)
  }
  return {
    lessonNumber,
    correctIndex,
    path: `/3-sinf/matematika/nazariy/${slug}`,
  }
})

const viewports = [
  { width: 320, height: 568, label: 'mobile-320' },
  { width: 1366, height: 768, label: 'desktop' },
]
const failures = []

async function waitForSpeechIdle(page, stableForMs = 650, timeoutMs = 4_000) {
  let previousCount = -1
  let stableSince = Date.now()
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    const currentCount = await page.evaluate(() => window.__grade3Spoken.length)
    if (currentCount !== previousCount) {
      previousCount = currentCount
      stableSince = Date.now()
    } else if (Date.now() - stableSince >= stableForMs) {
      return
    }
    await page.waitForTimeout(80)
  }
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

const browser = await chromium.launch({ headless: true })

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: 'reduce',
    })
    await context.addInitScript(() => {
      window.__grade3Spoken = []
      class MockSpeechSynthesisUtterance {
        constructor(text) {
          this.text = String(text || '')
          this.lang = ''
          this.rate = 1
          this.pitch = 1
          this.onstart = null
          this.onend = null
          this.onerror = null
        }
      }
      const mockSpeechSynthesis = {
        cancel() {},
        speak(utterance) {
          window.__grade3Spoken.push(String(utterance.text || ''))
          queueMicrotask(() => {
            utterance.onstart?.()
            utterance.onend?.()
          })
        },
      }
      Object.defineProperty(window, 'SpeechSynthesisUtterance', {
        configurable: true,
        value: MockSpeechSynthesisUtterance,
      })
      Object.defineProperty(window, 'speechSynthesis', {
        configurable: true,
        value: mockSpeechSynthesis,
      })
    })

    const page = await context.newPage()
    page.on('pageerror', (error) => failures.push(`${viewport.label}: pageerror: ${error.message}`))

    for (const lesson of lessons) {
      const label = `${viewport.label} theory-${String(lesson.lessonNumber).padStart(2, '0')}`
      try {
        await page.goto(new URL(lesson.path, baseUrl).href, {
          waitUntil: 'domcontentloaded',
          timeout: 20_000,
        })
        const options = page.locator('.stage-content .option')
        await options.first().waitFor({ state: 'visible', timeout: 10_000 })
        await page.waitForTimeout(80)

        const optionCount = await options.count()
        if (optionCount < 2 || lesson.correctIndex >= optionCount) {
          failures.push(`${label}: expected answer index ${lesson.correctIndex}, found ${optionCount} option(s)`)
          continue
        }

        const wrongIndex = lesson.correctIndex === 0 ? 1 : 0
        await waitForSpeechIdle(page)
        const spokenBefore = await page.evaluate(() => window.__grade3Spoken.length)
        await options.nth(wrongIndex).click()
        await page.waitForTimeout(120)

        const wrongState = await page.evaluate(({ correctIndex }) => {
          const stage = document.querySelector('.stage-content')
          const optionNodes = [...(stage?.querySelectorAll('.option') || [])]
          const correctNode = optionNodes[correctIndex]
          const stageRect = stage?.getBoundingClientRect()
          const visibleCorrectMarks = [...(stage?.querySelectorAll('.option-correct') || [])]
            .filter((element) => {
              const rect = element.getBoundingClientRect()
              const style = getComputedStyle(element)
              return rect.width > 1 && rect.height > 1 && style.display !== 'none' && style.visibility !== 'hidden'
            })
          const leakedText = /(?:Верный ответ|To['’]g['’]ri javob)\s*:/i.test(stage?.innerText || '')
          const clipped = Boolean(stage && stageRect && (
            stage.scrollHeight > stage.clientHeight + 6 ||
            stage.scrollWidth > stage.clientWidth + 6 ||
            stageRect.left < -2 ||
            stageRect.top < -2 ||
            stageRect.right > innerWidth + 2 ||
            stageRect.bottom > innerHeight + 2
          ))
          return {
            correctEnabled: Boolean(correctNode && !correctNode.disabled),
            correctMarks: visibleCorrectMarks.length,
            leakedText,
            clipped,
          }
        }, { correctIndex: lesson.correctIndex })
        const spokenAfterWrong = await page.evaluate(
          (start) => window.__grade3Spoken.slice(start),
          spokenBefore,
        )
        const neutralOnly = (
          spokenAfterWrong.length === 1 &&
          /(?:Подумай ещё раз|Yana bir bor o['’]ylab ko['’]ring)/i.test(spokenAfterWrong[0])
        )

        if (wrongState.correctMarks) failures.push(`${label}: wrong answer highlighted the correct option`)
        if (wrongState.leakedText) failures.push(`${label}: wrong answer displayed an explicit correct answer`)
        if (!wrongState.correctEnabled) failures.push(`${label}: correct option stayed locked after a wrong answer`)
        if (wrongState.clipped) failures.push(`${label}: wrong state clipped the lesson stage`)
        if (!neutralOnly) {
          failures.push(`${label}: wrong audio was not one neutral prompt (${JSON.stringify(spokenAfterWrong)})`)
        }

        if (wrongState.correctEnabled) {
          await options.nth(lesson.correctIndex).click()
          await page.waitForTimeout(120)
          const solved = await page.locator('.stage-content .option-correct').count()
          if (solved !== 1) failures.push(`${label}: retry with the correct answer did not solve Screen0`)
        }
      } catch (error) {
        failures.push(`${label}: ${error.message}`)
      }
    }

    await page.close()
    await context.close()
  }
} finally {
  await browser.close()
  await server.close()
}

if (failures.length) {
  console.error(`Grade-3 old-theory feedback smoke failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(
  `Grade-3 old-theory feedback smoke passed: ${lessons.length} lessons × ${viewports.length} viewports, neutral wrong feedback and retry verified.`,
)
