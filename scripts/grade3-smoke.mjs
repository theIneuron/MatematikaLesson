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
const theorySlugs = [...theoryBlock.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1])
const practiceSlugs = Array.from(
  { length: 51 },
  (_, index) => `dars${String(index + 1).padStart(2, '0')}-amaliyot`,
)
const routeSpecs = [
  ...theorySlugs.map((slug, index) => ({
    label: `theory-${String(index + 1).padStart(2, '0')}`,
    path: `/3-sinf/matematika/nazariy/${slug}`,
  })),
  ...practiceSlugs.map((slug, index) => ({
    label: `practice-${String(index + 1).padStart(2, '0')}`,
    path: `/3-sinf/matematika/amaliy/${slug}`,
  })),
]
const viewports = [
  { width: 320, height: 568, label: 'mobile-320' },
  { width: 390, height: 844, label: 'mobile-390' },
  { width: 360, height: 640, label: 'mobile-360' },
  { width: 1366, height: 768, label: 'desktop' },
]
const failures = []
const workerCount = process.env.CI ? 2 : 5

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
    let nextIndex = 0

    async function worker() {
      const page = await context.newPage()
      let activeRoute = 'initial'

      page.on('pageerror', (error) => {
        failures.push(`${viewport.label} ${activeRoute}: pageerror: ${error.message}`)
      })
      page.on('requestfailed', (request) => {
        if (request.url().startsWith(baseUrl)) {
          failures.push(
            `${viewport.label} ${activeRoute}: request failed: ${request.url()} ${request.failure()?.errorText || ''}`,
          )
        }
      })

      while (true) {
        const routeIndex = nextIndex
        nextIndex += 1
        if (routeIndex >= routeSpecs.length) break

        const route = routeSpecs[routeIndex]
        activeRoute = route.label

        try {
          await page.goto(new URL(route.path, baseUrl).href, {
            waitUntil: 'domcontentloaded',
            timeout: 20_000,
          })
          await page.waitForTimeout(450)

          const result = await page.evaluate(() => {
            const isVisible = (element) => {
              const rect = element.getBoundingClientRect()
              const style = getComputedStyle(element)
              return rect.width > 1 && rect.height > 1 && style.display !== 'none' && style.visibility !== 'hidden'
            }
            const describe = (element) => {
              const tag = element.tagName.toLowerCase()
              const id = element.id ? `#${element.id}` : ''
              const classes = [...element.classList].slice(0, 3).map((name) => `.${name}`).join('')
              return `${tag}${id}${classes}`
            }
            const scrolling = [...document.querySelectorAll('body *')]
              .filter((element) => {
                if (!isVisible(element) || element.clientHeight < 72) return false
                const style = getComputedStyle(element)
                return (
                  ['auto', 'scroll'].includes(style.overflowY) &&
                  element.scrollHeight > element.clientHeight + 6
                )
              })
              .slice(0, 8)
              .map((element) => `${describe(element)}:${element.clientHeight}/${element.scrollHeight}`)
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
              '.g3-practice-host',
              '.g3-practice-viewport',
              '.g3-practice-content',
            ]
            const clipped = criticalSelectors
              .flatMap((selector) => [...document.querySelectorAll(selector)])
              .filter((element) => {
                if (!isVisible(element) || element.clientHeight < 20) return false
                return (
                  element.scrollHeight > element.clientHeight + 6 ||
                  element.scrollWidth > element.clientWidth + 6
                )
              })
              .slice(0, 8)
              .map(
                (element) =>
                  `${describe(element)}:${element.clientWidth}x${element.clientHeight}/${element.scrollWidth}x${element.scrollHeight}`,
              )
            const controlsOutsideViewport = [
              ...document.querySelectorAll('button:not([hidden]), input:not([hidden]), [role="button"]'),
            ]
              .filter((element) => {
                if (!isVisible(element)) return false
                const rect = element.getBoundingClientRect()
                return (
                  rect.left < -2 ||
                  rect.top < -2 ||
                  rect.right > innerWidth + 2 ||
                  rect.bottom > innerHeight + 2
                )
              })
              .slice(0, 8)
              .map(describe)
            const globalBack = document.querySelector('.lesson-back')
            const backOverlaps = globalBack && isVisible(globalBack)
              ? [
                  ...document.querySelectorAll(
                    '.stage-header .chrome-left, .g3d19 header .lesson-heading, .g3-practice-bank-nav, .g3-practice-bank-summary',
                  ),
                ]
                  .filter((element) => {
                    if (!isVisible(element)) return false
                    const backRect = globalBack.getBoundingClientRect()
                    const rect = element.getBoundingClientRect()
                    const overlapWidth = Math.min(backRect.right, rect.right) - Math.max(backRect.left, rect.left)
                    const overlapHeight = Math.min(backRect.bottom, rect.bottom) - Math.max(backRect.top, rect.top)
                    return overlapWidth > 2 && overlapHeight > 2
                  })
                  .map(describe)
              : []

            return {
              finalPath: location.pathname,
              hasFrame: Boolean(document.querySelector('.lesson-frame')),
              loading: Boolean(document.querySelector('.lesson-loading')),
              documentOverflow:
                document.documentElement.scrollHeight > innerHeight + 6 ||
                document.documentElement.scrollWidth > innerWidth + 6,
              scrolling,
              clipped,
              controlsOutsideViewport,
              backOverlaps,
            }
          })

          if (result.finalPath !== route.path) {
            failures.push(`${viewport.label} ${route.label}: redirected to ${result.finalPath}`)
          }
          if (!result.hasFrame || result.loading) {
            failures.push(
              `${viewport.label} ${route.label}: frame=${result.hasFrame} loading=${result.loading}`,
            )
          }
          if (result.documentOverflow) {
            failures.push(`${viewport.label} ${route.label}: document overflows the viewport`)
          }
          if (result.scrolling.length) {
            failures.push(
              `${viewport.label} ${route.label}: scrolling containers ${result.scrolling.join(', ')}`,
            )
          }
          if (result.clipped.length) {
            failures.push(
              `${viewport.label} ${route.label}: clipped critical containers ${result.clipped.join(', ')}`,
            )
          }
          if (result.controlsOutsideViewport.length) {
            failures.push(
              `${viewport.label} ${route.label}: controls outside viewport ${result.controlsOutsideViewport.join(', ')}`,
            )
          }
          if (result.backOverlaps.length) {
            failures.push(
              `${viewport.label} ${route.label}: global back overlaps ${result.backOverlaps.join(', ')}`,
            )
          }
        } catch (error) {
          failures.push(`${viewport.label} ${route.label}: ${error.message}`)
        }
      }

      await page.close()
    }

    await Promise.all(Array.from({ length: workerCount }, () => worker()))
    await context.close()
  }
} finally {
  await browser.close()
  await server.close()
}

if (failures.length) {
  console.error(`Grade-3 smoke failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(
  `Grade-3 smoke passed: ${routeSpecs.length} routes × ${viewports.length} viewports, no runtime errors or scrolling containers.`,
)
