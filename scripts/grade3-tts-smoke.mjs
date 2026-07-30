import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { createGrade3IsolationPlugin } from './grade3-vite-isolation.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TTS_API_BASE = 'https://tts.test'
const PRACTICE_STORAGE_KEY = 'matematika:grade3:v2:practice:19'
let lessonPageInstrumented = false

function expect(condition, message) {
  if (!condition) throw new Error(message)
}

function createTtsRuntimePropsPlugin() {
  return {
    name: 'grade3-tts-runtime-props-test-only',
    enforce: 'pre',
    transform(source, id) {
      const normalized = id.replaceAll('\\', '/').split('?')[0]
      if (!normalized.endsWith('/src/components/shared/LessonPage.jsx')) return null

      const marker = '<Component {...previewProps} />'
      expect(source.includes(marker), 'LessonPage runtime-props marker was not found')
      lessonPageInstrumented = true

      return {
        code: source.replace(
          marker,
          '<Component {...previewProps} ttsApiBase="https://tts.test" voiceGender="m" />',
        ),
        map: null,
      }
    },
  }
}

const cases = [
  {
    id: 'theory D20',
    path: '/3-sinf/matematika/nazariy/dars20-amallarni-tekshirish',
    expectedWords: ["ko'paytirish", 'teng'],
    forbiddenMath: /[×*+=]/,
  },
  {
    id: 'practice D19 question 2',
    path: '/3-sinf/matematika/amaliy/dars19-amaliyot',
    expectedWords: ["bo'lish", 'teng'],
    forbiddenMath: /[:=]/,
    savedProgress: {
      index: 1,
      lang: 'uz',
      entries: {
        '01': {
          result: { correct: true },
          draft: { correct: true },
          attempts: 1,
          errors: 0,
          retries: 0,
          shuffleSeed: 1,
        },
      },
    },
  },
]

const server = await createServer({
  root: repoRoot,
  logLevel: 'error',
  plugins: [
    createGrade3IsolationPlugin(),
    createTtsRuntimePropsPlugin(),
  ],
  server: {
    host: '127.0.0.1',
    port: 0,
    strictPort: false,
  },
})

await server.listen()
const baseUrl = server.resolvedUrls?.local?.[0]
expect(baseUrl, 'Vite did not expose a local URL')

const browser = await chromium.launch({ headless: true })
const failures = []

try {
  for (const testCase of cases) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
    })

    await context.addInitScript(
      ({ practiceStorageKey, savedProgress }) => {
        const events = {
          audioUrls: [],
          browserSpeeches: [],
          audioErrors: 0,
        }
        window.__GRADE3_TTS_SMOKE__ = events

        class MockSpeechSynthesisUtterance {
          constructor(text) {
            this.text = String(text)
            this.lang = ''
            this.rate = 1
            this.onend = null
            this.onerror = null
          }
        }

        const speechSynthesis = {
          cancel() {},
          getVoices() {
            return []
          },
          speak(utterance) {
            events.browserSpeeches.push({
              text: utterance.text,
              lang: utterance.lang,
              rate: utterance.rate,
            })
            queueMicrotask(() => utterance.onend?.())
          },
        }

        class MockAudio {
          constructor() {
            this._src = ''
            this.onended = null
            this.onerror = null
          }

          set src(value) {
            this._src = String(value)
            events.audioUrls.push(this._src)
          }

          get src() {
            return this._src
          }

          play() {
            window.setTimeout(() => {
              events.audioErrors += 1
              this.onerror?.({ type: 'error' })
            }, 0)
            return Promise.resolve()
          }

          pause() {}
        }

        Object.defineProperty(window, 'SpeechSynthesisUtterance', {
          configurable: true,
          value: MockSpeechSynthesisUtterance,
        })
        Object.defineProperty(window, 'speechSynthesis', {
          configurable: true,
          value: speechSynthesis,
        })
        Object.defineProperty(window, 'Audio', {
          configurable: true,
          value: MockAudio,
        })

        if (savedProgress && /^https?:$/.test(window.location.protocol)) {
          window.localStorage.setItem(practiceStorageKey, JSON.stringify(savedProgress))
        }
      },
      {
        practiceStorageKey: PRACTICE_STORAGE_KEY,
        savedProgress: testCase.savedProgress || null,
      },
    )

    const page = await context.newPage()
    const ttsNetworkRequests = []
    page.on('pageerror', (error) => failures.push(`${testCase.id}: ${error.message}`))
    await page.route(`${TTS_API_BASE}/**`, async (route) => {
      ttsNetworkRequests.push(route.request().url())
      await route.abort()
    })

    try {
      await page.goto(new URL(testCase.path, baseUrl).href, {
        waitUntil: 'domcontentloaded',
        timeout: 20_000,
      })
      await page.locator('.lesson-frame').waitFor({ state: 'attached', timeout: 15_000 })
      await page.waitForFunction(
        () => (
          window.__GRADE3_TTS_SMOKE__?.audioUrls.length > 0 &&
          window.__GRADE3_TTS_SMOKE__?.browserSpeeches.length > 0
        ),
        null,
        { timeout: 15_000 },
      )

      const evidence = await page.evaluate(() => window.__GRADE3_TTS_SMOKE__)
      const audioUrl = evidence.audioUrls.at(-1)
      const parsed = new URL(audioUrl)
      const spokenText = parsed.searchParams.get('text') || ''

      expect(parsed.origin === TTS_API_BASE, `${testCase.id}: unexpected TTS origin ${parsed.origin}`)
      expect(parsed.pathname === '/api/tts', `${testCase.id}: unexpected TTS path ${parsed.pathname}`)
      expect(parsed.searchParams.get('g') === 'm', `${testCase.id}: voice gender was not propagated`)
      for (const word of testCase.expectedWords) {
        expect(spokenText.includes(word), `${testCase.id}: normalized speech misses “${word}”`)
      }
      expect(
        !testCase.forbiddenMath.test(spokenText),
        `${testCase.id}: raw mathematical operators remain in “${spokenText}”`,
      )
      expect(evidence.audioErrors > 0, `${testCase.id}: mocked audio error did not fire`)
      expect(
        evidence.browserSpeeches.some((speech) => (
          speech.text === spokenText &&
          speech.lang === 'uz-UZ' &&
          speech.rate > 0
        )),
        `${testCase.id}: browser speech fallback did not receive the normalized text`,
      )
      expect(
        ttsNetworkRequests.length === 0,
        `${testCase.id}: a real TTS request escaped the Audio mock`,
      )

      console.log(
        `PASS ${testCase.id}: ${parsed.pathname}?text=${encodeURIComponent(spokenText)}&g=m -> browser fallback`,
      )
    } finally {
      await context.close()
    }
  }
} finally {
  await browser.close()
  await server.close()
}

expect(lessonPageInstrumented, 'LessonPage was not instrumented by the test-only Vite plugin')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log('Grade-3 TTS smoke passed: theory + practice runtime props, math normalization, male voice, and browser fallback.')
