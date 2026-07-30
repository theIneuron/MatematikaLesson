import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { createGrade3IsolationPlugin } from './grade3-vite-isolation.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const registry = fs.readFileSync(path.join(repoRoot, 'src', 'lessons', 'grade3.js'), 'utf8')
const theoryBlock = registry.slice(
  registry.indexOf('export const grade3Nazariy'),
  registry.indexOf('// 3-sinf AMALIY'),
)
const theoryRoutes = [...theoryBlock.matchAll(/slug:\s*'([^']+)'/g)].map((match, index) => ({
  label: `theory-${String(index + 1).padStart(2, '0')}`,
  path: `/3-sinf/matematika/nazariy/${match[1]}`,
  kind: 'theory',
}))
const practiceRoutes = Array.from({ length: 51 }, (_, index) => ({
  label: `practice-${String(index + 1).padStart(2, '0')}`,
  path: `/3-sinf/matematika/amaliy/dars${String(index + 1).padStart(2, '0')}-amaliyot`,
  kind: 'practice',
}))
const routes = [...theoryRoutes, ...practiceRoutes]
const viewports = [
  { width: 320, height: 568, label: '320x568' },
  { width: 360, height: 640, label: '360x640' },
  { width: 390, height: 844, label: '390x844' },
  { width: 1366, height: 768, label: '1366x768' },
]
const failures = []
let checkedStates = 0

function record(message) {
  failures.push(message)
}

async function inspectState(page, label) {
  const result = await page.evaluate(() => {
    const visible = (element) => {
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
      const classes = [...element.classList].slice(0, 3).map((value) => `.${value}`).join('')
      return `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${classes}`
    }
    const criticalSelectors = [
      '#root',
      '.lesson-page',
      '.lesson-frame',
      '.lesson-root',
      '.stage',
      '.stage-content',
      '.g3d19',
      '.g3d19 main',
      '.g3d19 .card',
      '.g3-practice-bank-root',
      '.g3-practice-bank-body',
      '.g3-practice-host:not([aria-hidden="true"])',
      '.g3-practice-host:not([aria-hidden="true"]) .g3-practice-viewport',
      '.g3-practice-host:not([aria-hidden="true"]) .g3-practice-content',
    ]
    const clipped = criticalSelectors
      .flatMap((selector) => [...document.querySelectorAll(selector)])
      .filter(
        (element) =>
          visible(element) &&
          (
            element.scrollHeight > element.clientHeight + 6 ||
            element.scrollWidth > element.clientWidth + 6
          ),
      )
      .slice(0, 8)
      .map(
        (element) =>
          `${name(element)}:${element.clientWidth}x${element.clientHeight}/${element.scrollWidth}x${element.scrollHeight}`,
      )
    const essentialSelectors = [
      '.stage-content h1',
      '.stage-content h2',
      '.stage-nav',
      '.g3d19 h2',
      '.g3d19 .options',
      '.g3d19 nav',
      '.g3-practice-host:not([aria-hidden="true"]) .g3-practice-content',
      '.g3-practice-host:not([aria-hidden="true"]) .g3-practice-footer',
    ]
    const outside = essentialSelectors
      .flatMap((selector) => [...document.querySelectorAll(selector)])
      .filter((element) => {
        if (!visible(element)) return false
        const rect = element.getBoundingClientRect()
        return (
          rect.left < -2 ||
          rect.top < -2 ||
          rect.right > innerWidth + 2 ||
          rect.bottom > innerHeight + 2
        )
      })
      .slice(0, 8)
      .map(name)
    const stageContent = document.querySelector('.stage-content')
    const stageContentRect = stageContent?.getBoundingClientRect()
    const stageChildOverflow = stageContent && visible(stageContent)
      ? [...stageContent.children]
          .filter((element) => {
            if (!visible(element)) return false
            const rect = element.getBoundingClientRect()
            return (
              element.scrollHeight > element.clientHeight + 6 ||
              element.scrollWidth > element.clientWidth + 6 ||
              rect.left < stageContentRect.left - 2 ||
              rect.top < stageContentRect.top - 2 ||
              rect.right > stageContentRect.right + 2 ||
              rect.bottom > stageContentRect.bottom + 2
            )
          })
          .slice(0, 8)
          .map(
            (element) =>
              `${name(element)}:${element.clientWidth}x${element.clientHeight}/${element.scrollWidth}x${element.scrollHeight}`,
          )
      : []
    const stageContentOutside = stageContent && visible(stageContent)
      ? [...stageContent.querySelectorAll('button,input,[role="button"],h1,h2,p,.title,.option')]
          .filter((element) => {
            if (!visible(element)) return false
            const rect = element.getBoundingClientRect()
            return (
              rect.left < stageContentRect.left - 2 ||
              rect.top < stageContentRect.top - 2 ||
              rect.right > stageContentRect.right + 2 ||
              rect.bottom > stageContentRect.bottom + 2
            )
          })
          .slice(0, 8)
          .map(name)
      : []
    const globalBack = document.querySelector('.lesson-back')
    const backOverlaps = globalBack && visible(globalBack)
      ? [
          ...document.querySelectorAll(
            '.stage-header .chrome-left, .g3d19 header .lesson-heading, .g3-practice-bank-nav, .g3-practice-bank-summary',
          ),
        ]
          .filter((element) => {
            if (!visible(element)) return false
            const backRect = globalBack.getBoundingClientRect()
            const rect = element.getBoundingClientRect()
            const overlapWidth = Math.min(backRect.right, rect.right) - Math.max(backRect.left, rect.left)
            const overlapHeight = Math.min(backRect.bottom, rect.bottom) - Math.max(backRect.top, rect.top)
            return overlapWidth > 2 && overlapHeight > 2
          })
          .map(name)
      : []

    return {
      documentOverflow:
        document.documentElement.scrollHeight > innerHeight + 6 ||
        document.documentElement.scrollWidth > innerWidth + 6,
      clipped,
      outside,
      stageChildOverflow,
      stageContentOutside,
      backOverlaps,
    }
  })

  checkedStates += 1
  if (result.documentOverflow) record(`${label}: document overflow`)
  if (result.clipped.length) record(`${label}: clipped ${result.clipped.join(', ')}`)
  if (result.outside.length) record(`${label}: outside viewport ${result.outside.join(', ')}`)
  if (result.stageChildOverflow.length) {
    record(`${label}: stage child overflow ${result.stageChildOverflow.join(', ')}`)
  }
  if (result.stageContentOutside.length) {
    record(`${label}: stage content outside clip ${result.stageContentOutside.join(', ')}`)
  }
  if (result.backOverlaps.length) {
    record(`${label}: global back overlaps ${result.backOverlaps.join(', ')}`)
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
      try {
        window.speechSynthesis.cancel = () => {}
        window.speechSynthesis.speak = (utterance) => queueMicrotask(() => utterance.onend?.())
      } catch {
        // Native speech may be read-only; review mode still keeps navigation open.
      }
    })
    let nextRoute = 0

    async function worker() {
      const page = await context.newPage()
      let activeLabel = 'initial'
      page.on('pageerror', (error) => record(`${viewport.label} ${activeLabel}: ${error.message}`))

      while (true) {
        const routeIndex = nextRoute
        nextRoute += 1
        if (routeIndex >= routes.length) break

        const route = routes[routeIndex]
        activeLabel = route.label
        await page.goto(new URL(route.path, baseUrl).href, {
          waitUntil: 'domcontentloaded',
          timeout: 20_000,
        })
        await page.waitForTimeout(180)

        if (page.url() !== new URL(route.path, baseUrl).href) {
          record(`${viewport.label} ${route.label}: redirected to ${page.url()}`)
          continue
        }

        if (route.kind === 'practice') {
          const chips = page.locator('.g3-practice-bank-nav button')
          await chips
            .first()
            .waitFor({ state: 'attached', timeout: 10_000 })
            .catch(() => {})
          const chipCount = await chips.count()
          if (chipCount !== 10) {
            record(`${viewport.label} ${route.label}: expected 10 chips, found ${chipCount}`)
          }
          for (let index = 0; index < chipCount; index += 1) {
            await chips.nth(index).click()
            await page.waitForTimeout(45)
            await inspectState(page, `${viewport.label} ${route.label} item-${index + 1}`)
          }
          continue
        }

        for (let screen = 1; screen <= 20; screen += 1) {
          await inspectState(page, `${viewport.label} ${route.label} screen-${screen}`)

          const newTheoryRoot = page.locator('.g3d19')
          const oldTheoryProgress = page.locator('[role="progressbar"]')
          await newTheoryRoot
            .or(oldTheoryProgress)
            .first()
            .waitFor({ state: 'attached', timeout: 5_000 })
            .catch(() => {})
          const isNewTheory = Boolean(await newTheoryRoot.count())
          const isOldTheory = Boolean(await oldTheoryProgress.count())
          if (!isNewTheory && !isOldTheory) {
            record(`${viewport.label} ${route.label} screen-${screen}: theory shell/progress missing`)
            break
          }
          let current
          let total
          if (isNewTheory) {
            const counter = await page.locator('.g3d19 .lesson-heading small').textContent()
            const match = counter?.match(/(\d+)\s*\/\s*(\d+)/)
            current = Number(match?.[1])
            total = Number(match?.[2])
          } else {
            current = Number(await oldTheoryProgress.first().getAttribute('aria-valuenow'))
            total = Number(await oldTheoryProgress.first().getAttribute('aria-valuemax'))
          }
          if (Number.isFinite(current) && Number.isFinite(total) && current >= total) break

          const nextButton = isNewTheory
            ? page.locator('.g3d19 nav .next')
            : page.locator('.stage-nav button').last()
          if (!(await nextButton.count()) || (await nextButton.isDisabled())) {
            record(`${viewport.label} ${route.label} screen-${screen}: review navigation is blocked`)
            break
          }
          await nextButton.click()
          await page.waitForTimeout(55)
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

if (failures.length) {
  console.error(`Grade-3 deep smoke failed with ${failures.length} issue(s):`)
  for (const failure of failures.slice(0, 120)) console.error(`- ${failure}`)
  if (failures.length > 120) console.error(`…and ${failures.length - 120} more.`)
  process.exit(1)
}

console.log(
  `Grade-3 deep smoke passed: ${routes.length} routes, ${viewports.length} viewports, ${checkedStates} lesson/task states.`,
)
