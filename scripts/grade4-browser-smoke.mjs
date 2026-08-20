#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { runInNewContext } from 'node:vm';
import babelParser from '@babel/parser';
import { chromium } from 'playwright';

const { parse } = babelParser;
const ROOT = process.cwd();
const THEORY_NAVIGATION_PATH = path.join(ROOT, 'src', 'components', 'grade4', 'theoryNavigation.js');
const THEORY_NAVIGATION_SOURCE = existsSync(THEORY_NAVIGATION_PATH)
  ? await readFile(THEORY_NAVIGATION_PATH, 'utf8')
  : '';
const THEORY_CONTINUE_UNLOCKED = /^\s*export\s+const\s+GRADE4_THEORY_CONTINUE_UNLOCKED\s*=\s*true\s*;/m.test(
  THEORY_NAVIGATION_SOURCE,
);
const HOST = '127.0.0.1';
const PORT = 4173;
let baseUrl = process.env.GRADE4_BASE_URL || 'http://' + HOST + ':' + PORT;
const DEFAULT_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CHROME_PATH = process.env.GRADE4_CHROME_PATH || (existsSync(DEFAULT_CHROME) ? DEFAULT_CHROME : undefined);
const SCREENSHOT_DIR = process.env.GRADE4_SCREENSHOT_DIR
  ? path.resolve(ROOT, process.env.GRADE4_SCREENSHOT_DIR)
  : null;
const RAPID_BACK_ONLY = process.env.GRADE4_RAPID_BACK_ONLY === '1';
const AUDIO_ONLY = process.env.GRADE4_AUDIO_ONLY === '1';
const DEEP_ONLY = process.env.GRADE4_DEEP_ONLY === '1';
const FINALE_ONLY = process.env.GRADE4_FINALE_ONLY === '1';
const DEEP_VIEWPORT = process.env.GRADE4_DEEP_VIEWPORT || 'desktop';
const LANGS = ['uz', 'ru', 'en'];
const ALL_VIEWPORTS = [
  { name: 'compact-mobile', width: 360, height: 640 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'desktop', width: 1366, height: 768 },
];
const requestedViewports = new Set((process.env.GRADE4_VIEWPORTS || '').split(',').map((value) => value.trim()).filter(Boolean));
const VIEWPORTS = requestedViewports.size
  ? ALL_VIEWPORTS.filter((viewport) => requestedViewports.has(viewport.name))
  : ALL_VIEWPORTS;
if (requestedViewports.size && VIEWPORTS.length !== requestedViewports.size) {
  console.error('Noma\'lum Grade 4 viewport: ' + [...requestedViewports].filter((name) => !ALL_VIEWPORTS.some((viewport) => viewport.name === name)).join(', ') + '.');
  process.exit(1);
}
const deepViewport = ALL_VIEWPORTS.find((viewport) => viewport.name === DEEP_VIEWPORT);
if (!deepViewport) {
  console.error(`Noma'lum Grade 4 deep viewport: ${DEEP_VIEWPORT}.`);
  process.exit(1);
}
const LESSON_ROOT = '.lesson-frame .lesson-root, .lesson-frame .d8-root, .lesson-frame .p4-root, .lesson-frame .g4p-root';
const CHECK_ACTION = '.p4-actions .p4-btn:not(.p4-btn-ghost):not(.p4-btn-ready), .g4p-actions .g4p-btn:not(.is-ghost):not(.is-ready)';
const RETRY_ACTION = '.p4-actions .p4-btn-ghost, .g4p-actions .g4p-btn.is-ghost';
const READY_ACTION = '.p4-actions .p4-btn-ready, .g4p-actions .g4p-btn.is-ready';
const RESULT_SCREEN = '.p4-done, .g4p-result';
const TITLE_OVERLAY_SELECTOR = '.rank-boost-overlay[data-g4-role="rank-overlay"]';
const REVIEW_LESSONS = new Set([
  'Dars02.jsx', 'Dars04.jsx', 'Dars07.jsx', 'Dars08.jsx',
  'Dars12.jsx', 'Dars18.jsx', 'Dars22.jsx', 'Dars28.jsx',
  'Dars42.jsx', 'Dars51.jsx',
]);
const NO_FINAL_REFLECTION_LESSONS = new Set(
  Array.from({ length: 9 }, (_, index) => `Dars${String(index + 2).padStart(2, '0')}.jsx`),
);
// Dars04 slide 1 deliberately stretches the main scene to the answer-frame width.
const FULL_WIDTH_HOOK_LESSONS = new Set(['Dars04.jsx']);
const EXPECTED_ANSWER_ORDER_GROUPS = new Map([
  ['Dars02.jsx', 7], ['Dars03.jsx', 6], ['Dars04.jsx', 7], ['Dars05.jsx', 6], ['Dars06.jsx', 7],
  ['Dars07.jsx', 6], ['Dars08.jsx', 10], ['Dars09.jsx', 3], ['Dars10.jsx', 7], ['Dars11.jsx', 3],
  ['Dars12.jsx', 4], ['Dars13.jsx', 6], ['Dars14.jsx', 3], ['Dars15.jsx', 3], ['Dars16.jsx', 2],
  ['Dars17.jsx', 8], ['Dars18.jsx', 4], ['Dars19.jsx', 5], ['Dars20.jsx', 5], ['Dars21.jsx', 8],
  ['Dars22.jsx', 7], ['Dars23.jsx', 5], ['Dars24.jsx', 5], ['Dars25.jsx', 5], ['Dars26.jsx', 4],
  ['Dars27.jsx', 4], ['Dars28.jsx', 6], ['Dars29.jsx', 5], ['Dars30.jsx', 5],
  ...Array.from({ length: 4 }, (_, index) => [`Dars${String(index + 31).padStart(2, '0')}.jsx`, 5]),
  ['Dars35.jsx', 6],
  ...Array.from({ length: 6 }, (_, index) => [`Dars${String(index + 36).padStart(2, '0')}.jsx`, 5]),
  ...Array.from({ length: 10 }, (_, index) => [`Dars${String(index + 42).padStart(2, '0')}.jsx`, 6]),
]);
const REQUIRE_ALL_ANSWER_LABELS = new Set(['Dars10.jsx']);
// Dars04 legacy scored-choice records intentionally omit options/correctIndex.
// Preserve its established onFinished payload shape; source-index correctness is
// still covered by the static audit and the rendered-card interaction checks.
const ANSWER_SOURCE_ALIGNMENT_EXEMPT = new Set(['Dars04.jsx']);
const feedbackScreenshotKeys = new Set();
const finalScreenshotKeys = new Set();
const failures = [];
let theoryScreensTraversed = 0;
let practiceTasksTraversed = 0;
let theoryGateFallbacks = 0;
let audioContractChecked = false;
let activePracticeLang = 'en';
let normalMotionTitleTimingsChecked = 0;
let choiceBranchScreensChecked = 0;
let choiceBranchesChecked = 0;
let numericBranchScreensChecked = 0;
let matchingBranchScreensChecked = 0;
let buildBranchScreensChecked = 0;
let repeatedPlaceFlowsChecked = 0;
let rapidBranchScreensChecked = 0;
let rapidBackPersistenceChecked = 0;
let roundingLineScreensChecked = 0;
let roundingBackPersistenceChecked = 0;
let answerOrderGroupsChecked = 0;
let answerOrderPersistenceChecked = 0;
let postCorrectChoiceStatesChecked = 0;
let finaleRoutesChecked = 0;
let dars10FinaleAudioRevealChecked = 0;
const requested = new Set(process.argv.slice(2).map((value) => value.replace(/\.jsx$/, '')));

if (SCREENSHOT_DIR) await mkdir(SCREENSHOT_DIR, { recursive: true });

const registryPath = path.join(ROOT, 'src/lessons/grade4.js');
const registry = await readFile(registryPath, 'utf8');
const registeredLessons = [...registry.matchAll(/slug:\s*'([^']+)'[\s\S]*?Component:\s*lazy\(\(\)\s*=>\s*import\('\.\.\/components\/grade4\/(Dars\d{2}(Practice)?\.jsx)'\)\)/g)]
  .map((match) => ({ slug: match[1], file: match[2], section: match[3] ? 'amaliy' : 'nazariy' }));
const numberedFile = (number, suffix = '') => 'Dars' + String(number).padStart(2, '0') + suffix + '.jsx';
const targetLessonFiles = new Set([
  ...Array.from({ length: 51 }, (_, index) => numberedFile(index + 1)),
  ...Array.from({ length: 30 }, (_, index) => numberedFile(index + 1, 'Practice')),
]);
const allLessons = registeredLessons.filter((lesson) => targetLessonFiles.has(lesson.file));
const registryOnlyLessons = registeredLessons.filter((lesson) => !targetLessonFiles.has(lesson.file));
const missingRegistryEntries = [...targetLessonFiles].filter((file) => (
  !registeredLessons.some((lesson) => lesson.file === file)
));
const unavailableScopedLessons = allLessons.filter((lesson) => (
  !existsSync(path.join(ROOT, 'src/components/grade4', lesson.file))
));
const unavailableRegistryOnlyLessons = registryOnlyLessons.filter((lesson) => (
  !existsSync(path.join(ROOT, 'src/components/grade4', lesson.file))
));
const unavailableFiles = new Set(unavailableRegistryOnlyLessons.map((lesson) => lesson.file));
const registryOnlyFiles = new Set(registryOnlyLessons.map((lesson) => lesson.file));
const unexpectedUnavailable = [...unavailableFiles].filter((file) => !/^Dars(?:3[1-9]|4\d|5[01])\.jsx$/.test(file));
const lessons = requested.size === 0
  ? allLessons
  : allLessons.filter((lesson) => requested.has(lesson.file.replace(/\.jsx$/, '')));

if (missingRegistryEntries.length) {
  console.error('Grade 4 smoke scope registry route-lari topilmadi: ' + missingRegistryEntries.join(', ') + '.');
  process.exit(1);
}
if (unavailableScopedLessons.length) {
  console.error('Grade 4 smoke scope componentlari topilmadi: ' + unavailableScopedLessons.map((lesson) => lesson.file).join(', ') + '.');
  process.exit(1);
}
if (unexpectedUnavailable.length) {
  console.error('Grade 4 registryda kutilmagan mavjud bo\'lmagan componentlar: ' + unexpectedUnavailable.join(', ') + '.');
  process.exit(1);
}
if ((requested.size === 0 && lessons.length !== 81) || (requested.size > 0 && lessons.length !== requested.size)) {
  console.error('Grade 4 registrydan ' + lessons.length + ' mavjud route topildi, kutilgan ' + (requested.size || 81) + '.');
  process.exit(1);
}
if (registryOnlyLessons.length) {
  console.log(
    '[Grade 4 smoke scope] ' + registryOnlyLessons.map((lesson) => lesson.file).join(', ')
    + ' registry-only route sifatida tashlab ketildi; smoke Dars01–Dars51 va Dars01Practice–Dars30Practice bilan cheklangan.',
  );
}

const VIRTUAL_LESSON_PREFIX = '\0grade4-browser-smoke-missing:';
function missingRegistryLessonPlugin() {
  return {
    name: 'grade4-browser-smoke-missing-registry-lessons',
    enforce: 'pre',
    resolveId(source, importer) {
      const normalizedSource = source.replaceAll('\\', '/');
      const normalizedImporter = importer?.split('?')[0].replaceAll('\\', '/');
      const file = normalizedSource.split('/').at(-1);
      if (
        normalizedImporter?.endsWith('/src/lessons/grade4.js')
        && normalizedSource.startsWith('../components/grade4/')
        && registryOnlyFiles.has(file)
      ) {
        return VIRTUAL_LESSON_PREFIX + file;
      }
      return null;
    },
    load(id) {
      if (!id.startsWith(VIRTUAL_LESSON_PREFIX)) return null;
      return 'export default function Grade4UnavailableLessonStub() { return null; }\n';
    },
  };
}

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const normalizeText = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const compactText = (value) => normalizeText(value).replace(/[\s,]/g, '').toLowerCase();
const hasCyrillic = (value) => /[\u0400-\u052f]/u.test(String(value ?? ''));
const localize = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'object') return String(value);
  if (Object.hasOwn(value, activePracticeLang)) return String(value[activePracticeLang]);
  if (Object.hasOwn(value, 'en')) return String(value.en);
  if (Object.hasOwn(value, 'text')) return localize(value.text);
  if (Object.hasOwn(value, 'label')) return localize(value.label);
  if (Object.hasOwn(value, 'value')) return String(value.value);
  return '';
};

function findVariableInitializer(ast, name) {
  let initializer = null;
  const visit = (node) => {
    if (!node || typeof node !== 'object' || initializer) return;
    if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier' && node.id.name === name) {
      initializer = node.init;
      return;
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else visit(value);
    }
  };
  visit(ast);
  return initializer;
}

function staticAstValue(node) {
  if (!node) return undefined;
  if (node.type === 'StringLiteral' || node.type === 'NumericLiteral' || node.type === 'BooleanLiteral') return node.value;
  if (node.type === 'NullLiteral') return null;
  if (node.type === 'ArrayExpression') return node.elements.map(staticAstValue);
  if (node.type === 'ObjectExpression') {
    const value = {};
    for (const property of node.properties) {
      if (property.type !== 'ObjectProperty' || property.computed) continue;
      const key = property.key?.type === 'Identifier' ? property.key.name : property.key?.value;
      if (typeof key === 'string') value[key] = staticAstValue(property.value);
    }
    return value;
  }
  return undefined;
}

const theoryScreenMeta = new Map();
const theoryNumericAnswers = new Map();
for (const lesson of lessons.filter((item) => item.section === 'nazariy' && item.file !== 'Dars01.jsx')) {
  const lessonPath = path.join(ROOT, 'src/components/grade4', lesson.file);
  const source = await readFile(lessonPath, 'utf8');
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  const screenMeta = staticAstValue(findVariableInitializer(ast, 'SCREEN_META'));
  const screenPlan = staticAstValue(findVariableInitializer(ast, 'SCREEN_PLAN'));
  const meta = Array.isArray(screenMeta) ? screenMeta : screenPlan;
  theoryScreenMeta.set(lesson.file, Array.isArray(meta) ? meta : []);

  const flowInitializer = ['SCREEN_FLOW', 'D12_FLOW', 'D13_FLOW']
    .map((name) => findVariableInitializer(ast, name))
    .find(Boolean);
  const contentInitializer = ['CONTENT', 'D12_SOURCE_CONTENT', 'D13_SOURCE_CONTENT']
    .map((name) => findVariableInitializer(ast, name))
    .find(Boolean);
  const flow = staticAstValue(flowInitializer);
  const content = staticAstValue(contentInitializer);
  const sourceNumericAnswers = new Map();
  const screenFunctions = [...source.matchAll(/function Screen(\d+)\b/g)];
  for (let index = 0; index < screenFunctions.length; index += 1) {
    const match = screenFunctions[index];
    const segmentEnd = screenFunctions[index + 1]?.index ?? source.length;
    const segment = source.slice(match.index, segmentEnd);
    const answerMatch = segment.match(/<NumericPractice\b[\s\S]*?\bcorrectAnswer="([^"]+)"/);
    if (answerMatch) sourceNumericAnswers.set(Number(match[1]), answerMatch[1]);
  }
  const ordered = Array.isArray(flow) ? flow : Array.from({ length: meta?.length ?? 0 }, (_, index) => index);
  theoryNumericAnswers.set(lesson.file, ordered.map((sourceIndex) => {
    const screenContent = Array.isArray(content) ? content[sourceIndex] : content?.[`s${sourceIndex}`];
    if (typeof screenContent?.answer === 'string') return screenContent.answer;
    if (typeof screenContent?.inputAnswer === 'string' || typeof screenContent?.inputAnswer === 'number') {
      return String(screenContent.inputAnswer);
    }
    return sourceNumericAnswers.get(sourceIndex) ?? null;
  }));
}

async function extractPracticeTasks(lesson) {
  const lessonPath = path.join(ROOT, 'src/components/grade4', lesson.file);
  const source = await readFile(lessonPath, 'utf8');
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  const initializer = findVariableInitializer(ast, 'TASKS');
  if (!initializer) throw new Error(lesson.file + ': TASKS topilmadi');

  const b = (ru, uz, en) => ({ ru, uz, en });
  const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
    id,
    text: b(ru, uz, en),
    correct,
    wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
  });
  const decimal = (comma, point) => b(comma, comma, point);
  const expression = source.slice(initializer.start, initializer.end);
  const tasks = runInNewContext('(' + expression + ')', {
    addEnglish: (value) => value,
    b,
    d: decimal,
    dec: decimal,
    decimal,
    option,
  }, { timeout: 2_000 });
  if (!Array.isArray(tasks) || tasks.length !== 10) {
    throw new Error(lesson.file + ': TASKS soni ' + (Array.isArray(tasks) ? tasks.length : 'array emas') + ', kutilgan 10');
  }
  return tasks;
}

const practiceTasks = new Map();
for (const lesson of lessons.filter((item) => item.section === 'amaliy')) {
  try {
    practiceTasks.set(lesson.file, await extractPracticeTasks(lesson));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

let server = null;
async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The local server is still starting.
    }
    await sleep(500);
  }
  throw new Error('Vite server ' + baseUrl + ' manzilida ishga tushmadi');
}

function routeFor(lesson, lang) {
  return '/4-sinf/matematika/' + lesson.section + '/' + lesson.slug + '?lang=' + lang;
}

async function openLessonUrl(page, url) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await page.goto(url, { waitUntil: 'commit', timeout: 30_000 });
      await page.locator(LESSON_ROOT).waitFor({ state: 'visible', timeout: 30_000 });
      return;
    } catch (error) {
      lastError = error;
      if (attempt === 0) {
        await page.goto('about:blank', { waitUntil: 'commit', timeout: 5_000 }).catch(() => {});
      }
    }
  }
  throw lastError;
}

async function openLesson(page, lesson, lang) {
  await openLessonUrl(page, baseUrl + routeFor(lesson, lang));
}

function monitorPage(page) {
  const state = { pageErrors: [], completionCalls: [], pending: [] };
  page.on('pageerror', (error) => state.pageErrors.push(error.message));
  page.on('console', (message) => {
    if (!message.text().startsWith('[Lesson preview] onFinished')) return;
    const capture = (async () => {
      const args = message.args();
      try {
        const payload = args.length > 1 ? await args[1].jsonValue() : null;
        state.completionCalls.push(payload);
      } catch (error) {
        state.completionCalls.push({ captureError: error.message });
      }
    })();
    state.pending.push(capture);
  });
  state.reset = () => {
    state.pageErrors.length = 0;
    state.completionCalls.length = 0;
    state.pending.length = 0;
  };
  state.flush = async () => {
    await Promise.allSettled(state.pending);
  };
  return state;
}

async function waitForCompletion(state, timeout = 5_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    await state.flush();
    if (state.completionCalls.length > 0) break;
    await sleep(25);
  }
  await sleep(100);
  await state.flush();
}

async function lessonSnapshot(page) {
  return page.evaluate((rootSelector) => {
    const root = document.querySelector(rootSelector);
    const stage = root?.querySelector('.stage');
    const stageContent = root?.querySelector('.stage-content');
    const text = root?.innerText ?? '';
    const buttons = [...document.querySelectorAll('.lesson-language button')];
    const describe = (element) => {
      const classes = [...element.classList].slice(0, 3).join('.');
      return element.tagName.toLowerCase() + (element.id ? '#' + element.id : '') + (classes ? '.' + classes : '');
    };
    const describeBox = (element) => {
      const rect = element.getBoundingClientRect();
      const box = [rect.left, rect.top, rect.width, rect.height]
        .map((value) => Math.round(value * 10) / 10)
        .join('/');
      return describe(element) + '[' + box + ']';
    };
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const emptyAriaLabels = [...document.querySelectorAll('.lesson-frame [aria-label], .lesson-language[aria-label]')]
      .filter((element) => visible(element) && !element.getAttribute('aria-label')?.trim())
      .map(describe)
      .slice(0, 10);
    const clippedText = root ? [...root.querySelectorAll('h1,h2,h3,h4,p,button,label,span,strong,small')]
      .filter((element) => {
        if (!visible(element)) return false;
        if (element.closest('.sr-only')) return false;
        const hasDirectText = [...element.childNodes]
          .some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
        if (!hasDirectText) return false;
        const style = getComputedStyle(element);
        const clipsX = ['hidden', 'clip'].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1;
        const clipsY = ['hidden', 'clip'].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
        return clipsX || clipsY;
      })
      .map((element) => describe(element) + ' ' + element.scrollWidth + '/' + element.clientWidth + '×' + element.scrollHeight + '/' + element.clientHeight)
      .slice(0, 10) : [];
    const intersects = (left, right) => (
      Math.min(left.right, right.right) - Math.max(left.left, right.left) > 1
      && Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top) > 1
    );
    const panelIssues = [];
    const hostPanels = [...document.querySelectorAll('.lesson-back, .lesson-language')].filter(visible);
    for (let left = 0; left < hostPanels.length; left += 1) {
      const rect = hostPanels[left].getBoundingClientRect();
      if (rect.left < -1 || rect.top < -1 || rect.right > innerWidth + 1 || rect.bottom > innerHeight + 1) {
        panelIssues.push(describeBox(hostPanels[left]) + ' viewportdan tashqarida');
      }
      for (let right = left + 1; right < hostPanels.length; right += 1) {
        if (hostPanels[left].contains(hostPanels[right]) || hostPanels[right].contains(hostPanels[left])) continue;
        if (intersects(rect, hostPanels[right].getBoundingClientRect())) {
          panelIssues.push(describeBox(hostPanels[left]) + ' ↔ ' + describeBox(hostPanels[right]));
        }
      }
      if (root) {
        const candidates = [...root.querySelectorAll('button,a,input,select,textarea,.chrome-actions > *,.p4-head-row > *,.g4p-head-row > *')]
          .filter(visible);
        for (const candidate of candidates) {
          if (hostPanels[left].contains(candidate) || candidate.contains(hostPanels[left])) continue;
          // Platform and lesson-preview language pickers are each one chrome
          // control. Their own buttons are not lesson content and must not be
          // reported as collisions with the surrounding language control.
          if (candidate.closest('.lesson-language, .preview-language')) continue;
          if (intersects(rect, candidate.getBoundingClientRect())) {
            panelIssues.push(describeBox(hostPanels[left]) + ' ↔ ' + describeBox(candidate));
          }
        }
      }
    }
    const canonicalText = text
      .split(/\n+/)
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .sort()
      .join('\n');
    // Captions are tied to the currently playing audio beat. Exclude that transient
    // node when comparing explicit UZ with the invalid-language UZ fallback.
    const stableContent = stageContent?.cloneNode(true);
    stableContent?.querySelectorAll('.caption').forEach((node) => node.remove());
    const contentCanonicalText = (stableContent?.textContent ?? text)
      .split(/\n+/)
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .sort()
      .join('\n');
    const overflowTargets = [document.documentElement, document.body, root, stage, stageContent]
      .filter(Boolean)
      .filter((element) => {
        const style = getComputedStyle(element);
        return /auto|scroll/.test(`${style.overflowX} ${style.overflowY}`);
      })
      .map((element) => {
        const style = getComputedStyle(element);
        return `${describe(element)} overflow=${style.overflowX}/${style.overflowY}`;
      });
    const rootStyle = root ? getComputedStyle(root) : null;
    const contentStyle = stageContent ? getComputedStyle(stageContent) : null;
    const visualFrameIssues = root ? [...root.querySelectorAll('[data-g4-role~="visual-frame"]')]
      .filter(visible)
      .flatMap((frame) => {
        const style = getComputedStyle(frame);
        const frameRect = frame.getBoundingClientRect();
        const issues = [];
        if (style.position !== 'relative' || style.isolation !== 'isolate'
          || !['hidden', 'clip'].includes(style.overflowX)
          || !['hidden', 'clip'].includes(style.overflowY)) {
          issues.push(`${describe(frame)} boundary=${style.position}/${style.isolation}/${style.overflowX}/${style.overflowY}`);
        }
        for (const media of frame.querySelectorAll('img,svg,canvas')) {
          if (!visible(media)) continue;
          const mediaRect = media.getBoundingClientRect();
          if (!Number.isFinite(mediaRect.width) || !Number.isFinite(mediaRect.height)
            || mediaRect.width <= 0 || mediaRect.height <= 0) continue;
          const effectiveWidth = Math.max(0, Math.min(mediaRect.right, frameRect.right) - Math.max(mediaRect.left, frameRect.left));
          const effectiveHeight = Math.max(0, Math.min(mediaRect.bottom, frameRect.bottom) - Math.max(mediaRect.top, frameRect.top));
          if (effectiveWidth <= 0 || effectiveHeight <= 0) {
            issues.push(`${describe(media)} frame bilan kesishmaydi`);
          }
        }
        for (const textElement of frame.querySelectorAll('h1,h2,h3,h4,p,span,strong,small,b,label,li,output')) {
          if (!visible(textElement) || textElement.closest('.sr-only,[aria-hidden="true"]')) continue;
          const hasDirectText = [...textElement.childNodes]
            .some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
          if (!hasDirectText) continue;
          const textRect = textElement.getBoundingClientRect();
          if (textRect.left < frameRect.left - 1 || textRect.right > frameRect.right + 1
            || textRect.top < frameRect.top - 1 || textRect.bottom > frameRect.bottom + 1) {
            issues.push(`${describeBox(textElement)} frame matni kesilgan`);
            continue;
          }
          let clippingAncestor = textElement.parentElement;
          while (clippingAncestor && clippingAncestor !== frame) {
            const ancestorStyle = getComputedStyle(clippingAncestor);
            if (['hidden', 'clip'].includes(ancestorStyle.overflowX)
              || ['hidden', 'clip'].includes(ancestorStyle.overflowY)) {
              const ancestorRect = clippingAncestor.getBoundingClientRect();
              const clippedX = ['hidden', 'clip'].includes(ancestorStyle.overflowX)
                && (textRect.left < ancestorRect.left - 1 || textRect.right > ancestorRect.right + 1);
              const clippedY = ['hidden', 'clip'].includes(ancestorStyle.overflowY)
                && (textRect.top < ancestorRect.top - 1 || textRect.bottom > ancestorRect.bottom + 1);
              if (clippedX || clippedY) {
                issues.push(`${describeBox(textElement)} ${describeBox(clippingAncestor)} ichida kesilgan`);
                break;
              }
            }
            clippingAncestor = clippingAncestor.parentElement;
          }
        }
        return issues;
      }).slice(0, 10) : [];
    if (root) {
      const unframedMedia = [...root.querySelectorAll('.stage-content img,.stage-content svg,.stage-content canvas')]
        .filter(visible)
        .filter((media) => !media.closest(
          '[data-g4-role~="visual-frame"], [data-g4-role~="hook-bit"], [data-g4-role~="feedback-bit"], '
            + '[data-g4-role~="reward-bit"], .heading, .finale-happy-bit, .finale-reward-bit, '
            + '.audio-controls, .audio-indicator, .feedback, .reward-stage, .g4-title-card-stage',
        ))
        .map((media) => `${describe(media)} visual-frame yo‘q`)
        .slice(0, 10);
      visualFrameIssues.push(...unframedMedia);
    }
    const typographyIssues = root?.matches('.lesson-root,.d8-root') ? (() => {
      const issues = [];
      const rootFont = getComputedStyle(root).fontFamily;
      if (!/Manrope/i.test(rootFont)) issues.push(`${describe(root)} base=${rootFont}`);
      for (const heading of root.querySelectorAll('h1')) {
        if (!visible(heading)) continue;
        const font = getComputedStyle(heading).fontFamily;
        const dars05UnifiedQuestion = root.classList.contains('dars05-root')
          && heading.matches('[data-g4-role~="hook-title"][data-g4-role~="hook-question"]');
        if (!dars05UnifiedQuestion && !/Source Serif 4/i.test(font)) issues.push(`${describe(heading)}=${font}`);
        if (dars05UnifiedQuestion && !/Manrope/i.test(font)) issues.push(`${describe(heading)} unified-question=${font}`);
      }
      for (const question of root.querySelectorAll('.question h2,[data-g4-role~="hook-question"]')) {
        if (!visible(question) || question.closest('.summary-stack,.summary-complete,.final-reflection,[data-g4-role~="reflection"]')) continue;
        const target = question.matches('h2') ? question : question.querySelector('h2') ?? question;
        const font = getComputedStyle(target).fontFamily;
        if (!/Manrope/i.test(font)) issues.push(`${describe(target)} question=${font}`);
      }
      for (const technical of root.querySelectorAll('.screen-count,[class*="formula"],[class*="equation"],.proof-label')) {
        if (!visible(technical) || !String(technical.textContent ?? '').trim()) continue;
        const font = getComputedStyle(technical).fontFamily;
        if (!/JetBrains Mono/i.test(font)) issues.push(`${describe(technical)} technical=${font}`);
      }
      return issues.slice(0, 10);
    })() : [];
    return {
      text,
      canonicalText,
      contentCanonicalText,
      scrollWidth: root?.scrollWidth ?? 0,
      clientWidth: root?.clientWidth ?? 0,
      scrollHeight: root?.scrollHeight ?? 0,
      clientHeight: root?.clientHeight ?? 0,
      rootOverflowX: rootStyle?.overflowX ?? '',
      rootOverflowY: rootStyle?.overflowY ?? '',
      contentScrollWidth: stageContent?.scrollWidth ?? 0,
      contentClientWidth: stageContent?.clientWidth ?? 0,
      contentScrollHeight: stageContent?.scrollHeight ?? 0,
      contentClientHeight: stageContent?.clientHeight ?? 0,
      contentOverflowX: contentStyle?.overflowX ?? '',
      contentOverflowY: contentStyle?.overflowY ?? '',
      documentWidth: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0),
      viewportWidth: window.innerWidth,
      documentHeight: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0),
      viewportHeight: window.innerHeight,
      overflowTargets,
      emptyAriaLabels,
      clippedText,
      panelIssues: [...new Set(panelIssues)].slice(0, 10),
      visualFrameIssues,
      typographyIssues,
      languageLabels: buttons.map((button) => button.textContent?.trim()),
      activeLanguage: buttons.find((button) => button.classList.contains('is-active'))?.textContent?.trim(),
    };
  }, LESSON_ROOT);
}

function snapshotIssues(snapshot, lang) {
  const issues = [];
  if (!snapshot.text.trim()) issues.push("ko'rinadigan dars matni bo'sh");
  if (/undefined|\[object Object\]/.test(snapshot.text)) issues.push("undefined yoki [object Object] ko'rindi");
  if (lang === 'en' && hasCyrillic(snapshot.text)) issues.push('EN ekranda kirill ko\'rindi');
  if (snapshot.scrollWidth > snapshot.clientWidth + 1) {
    issues.push('gorizontal overflow ' + snapshot.scrollWidth + '/' + snapshot.clientWidth);
  }
  if (snapshot.scrollHeight > snapshot.clientHeight + 1) {
    issues.push('lesson-root vertikal scroll ' + snapshot.scrollHeight + '/' + snapshot.clientHeight);
  }
  if (/auto|scroll/.test(`${snapshot.rootOverflowX} ${snapshot.rootOverflowY}`)) {
    issues.push('lesson-root overflow noqonuniy: ' + snapshot.rootOverflowX + '/' + snapshot.rootOverflowY);
  }
  if (snapshot.contentScrollWidth > snapshot.contentClientWidth + 1) {
    issues.push('stage-content gorizontal scroll ' + snapshot.contentScrollWidth + '/' + snapshot.contentClientWidth);
  }
  if (snapshot.contentScrollHeight > snapshot.contentClientHeight + 1) {
    issues.push('stage-content vertikal scroll ' + snapshot.contentScrollHeight + '/' + snapshot.contentClientHeight);
  }
  if (/auto|scroll/.test(`${snapshot.contentOverflowX} ${snapshot.contentOverflowY}`)) {
    issues.push('stage-content overflow noqonuniy: ' + snapshot.contentOverflowX + '/' + snapshot.contentOverflowY);
  }
  if (snapshot.documentWidth > snapshot.viewportWidth + 1) {
    issues.push('document gorizontal scroll ' + snapshot.documentWidth + '/' + snapshot.viewportWidth);
  }
  if (snapshot.documentHeight > snapshot.viewportHeight + 1) {
    issues.push('document vertikal scroll ' + snapshot.documentHeight + '/' + snapshot.viewportHeight);
  }
  if (snapshot.overflowTargets.length) issues.push('auto/scroll overflow: ' + snapshot.overflowTargets.join(', '));
  if (snapshot.emptyAriaLabels.length) issues.push('bo\'sh aria-label: ' + snapshot.emptyAriaLabels.join(', '));
  if (snapshot.clippedText.length) issues.push('matn clip: ' + snapshot.clippedText.join(', '));
  if (snapshot.panelIssues.length) issues.push('panel collision: ' + snapshot.panelIssues.join(', '));
  if (snapshot.visualFrameIssues.length) issues.push('visual-frame containment: ' + snapshot.visualFrameIssues.join(', '));
  if (snapshot.typographyIssues.length) issues.push('typography: ' + snapshot.typographyIssues.join(', '));
  return issues;
}

const isTheoryContractLesson = (lesson) => lesson.section === 'nazariy'
  && /^Dars(?:0[2-9]|[1-4]\d|5[01])\.jsx$/.test(lesson.file);

const isStrictEtalonLesson = isTheoryContractLesson;

async function assertCanonicalHookVisual(page, viewport, lesson, lang) {
  const hook = await firstVisible(inLesson(page, '[data-g4-screen="hook"]'));
  if (!hook) throw new Error('canonical hook topilmadi');
  const contract = await hook.evaluate((root, mobile) => {
    const byRole = (role) => root.querySelector(`[data-g4-role~="${role}"]`);
    const topic = byRole('hook-topic');
    const titleHost = byRole('hook-title');
    const questionHost = byRole('hook-question');
    const scene = byRole('hook-scene');
    const frame = byRole('visual-frame');
    const bit = byRole('hook-bit');
    const answer = root.querySelector('button[data-g4-role~="answer-card"]');
    const answerCount = root.querySelectorAll('button[data-g4-role~="answer-card"]').length;
    const title = titleHost?.matches('h1') ? titleHost : titleHost?.querySelector('h1') ?? titleHost;
    const question = questionHost?.matches('h2') ? questionHost : questionHost?.querySelector('h2') ?? questionHost;
    const titleStyle = title ? getComputedStyle(title) : null;
    const questionStyle = question ? getComputedStyle(question) : null;
    const frameStyle = frame ? getComputedStyle(frame) : null;
    const titleRect = title?.getBoundingClientRect() ?? null;
    const questionRect = question?.getBoundingClientRect() ?? null;
    const sceneRect = scene?.getBoundingClientRect() ?? null;
    const frameRect = frame?.getBoundingClientRect() ?? null;
    const bitRect = bit?.getBoundingClientRect() ?? null;
    const contentRect = root.closest('.stage-content')?.getBoundingClientRect() ?? null;
    const contentStyle = root.closest('.stage-content') ? getComputedStyle(root.closest('.stage-content')) : null;
    const contentInnerWidth = contentRect
      ? contentRect.width - Number.parseFloat(contentStyle?.paddingLeft ?? '0') - Number.parseFloat(contentStyle?.paddingRight ?? '0')
      : root.getBoundingClientRect().width;
    const layoutIssues = [];
    for (const card of root.querySelectorAll('button[data-g4-role~="answer-card"]')) {
      if (!card.offsetParent) continue;
      const rect = card.getBoundingClientRect();
      if (contentRect && (rect.left < contentRect.left - 1 || rect.right > contentRect.right + 1
        || rect.top < contentRect.top - 1 || rect.bottom > contentRect.bottom + 1)) {
        layoutIssues.push(`answer-card ${Math.round(rect.left)}/${Math.round(rect.top)}/${Math.round(rect.width)}/${Math.round(rect.height)}`);
      }
    }
    for (const textElement of root.querySelectorAll('h1,h2,h3,h4,p,span,strong,small,b,label,li,button')) {
      if (!textElement.offsetParent || textElement.closest('.sr-only,[aria-hidden="true"],[data-g4-role~="hook-bit"]')) continue;
      const hasDirectText = [...textElement.childNodes]
        .some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
      if (!hasDirectText) continue;
      const rect = textElement.getBoundingClientRect();
      let ancestor = textElement.parentElement;
      while (ancestor && ancestor !== root.parentElement) {
        const style = getComputedStyle(ancestor);
        const ancestorRect = ancestor.getBoundingClientRect();
        const clippedX = ['hidden', 'clip'].includes(style.overflowX)
          && (rect.left < ancestorRect.left - 1 || rect.right > ancestorRect.right + 1);
        const clippedY = ['hidden', 'clip'].includes(style.overflowY)
          && (rect.top < ancestorRect.top - 1 || rect.bottom > ancestorRect.bottom + 1);
        if (clippedX || clippedY) {
          layoutIssues.push(`${textElement.tagName.toLowerCase()} ${Math.round(rect.left)}/${Math.round(rect.top)}/${Math.round(rect.width)}/${Math.round(rect.height)}`);
          break;
        }
        ancestor = ancestor.parentElement;
      }
    }
    let following = null;
    let cursor = scene;
    while (cursor && cursor !== root && !following) {
      let sibling = cursor.nextElementSibling;
      while (sibling && !following) {
        const rect = sibling.getBoundingClientRect();
        const style = getComputedStyle(sibling);
        if (rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden') {
          following = sibling;
        }
        sibling = sibling.nextElementSibling;
      }
      cursor = cursor.parentElement;
    }
    const nodes = [topic, titleHost, questionHost, scene, answer];
    const ordered = nodes.every(Boolean) && nodes.slice(0, -1).every((node, index) => (
      Boolean(node.compareDocumentPosition(nodes[index + 1]) & Node.DOCUMENT_POSITION_FOLLOWING)
    ));
    const unifiedNodes = [titleHost, scene, answer];
    const unifiedOrdered = unifiedNodes.every(Boolean) && unifiedNodes.slice(0, -1).every((node, index) => (
      Boolean(node.compareDocumentPosition(unifiedNodes[index + 1]) & Node.DOCUMENT_POSITION_FOLLOWING)
    ));
    return {
      missing: [
        ['hook-topic', topic],
        ['hook-title', titleHost],
        ['hook-question', questionHost],
        ['hook-scene', scene],
        ['visual-frame', frame],
        ['hook-bit', bit],
        ['answer-card', answer],
      ].filter(([, element]) => !element).map(([role]) => role),
      ordered,
      unifiedOrdered,
      topicPresent: Boolean(topic),
      samePrompt: Boolean(titleHost) && titleHost === questionHost,
      answerCount,
      titleAlign: titleStyle?.textAlign ?? '',
      titleFont: titleStyle?.fontFamily ?? '',
      titleSize: Number.parseFloat(titleStyle?.fontSize ?? '0'),
      questionAlign: questionStyle?.textAlign ?? '',
      questionFont: questionStyle?.fontFamily ?? '',
      questionSize: Number.parseFloat(questionStyle?.fontSize ?? '0'),
      titleBottom: titleRect?.bottom ?? 0,
      questionTop: questionRect?.top ?? 0,
      questionBottom: questionRect?.bottom ?? 0,
      sceneTop: sceneRect?.top ?? 0,
      sceneBottom: sceneRect?.bottom ?? 0,
      followingTop: following?.getBoundingClientRect().top ?? null,
      layoutIssues: [...new Set(layoutIssues)].slice(0, 8),
      frameWidth: frameRect?.width ?? 0,
      availableWidth: contentInnerWidth,
      frameHeight: frameRect?.height ?? 0,
      frameRadius: Number.parseFloat(frameStyle?.borderTopLeftRadius ?? '0'),
      frameOverflow: `${frameStyle?.overflowX ?? ''}/${frameStyle?.overflowY ?? ''}`,
      frameIsolation: frameStyle?.isolation ?? '',
      frameBackground: frameStyle?.backgroundImage ?? '',
      frameShadow: frameStyle?.boxShadow ?? '',
      bitWidth: bitRect?.width ?? 0,
      bitHeight: bitRect?.height ?? 0,
      bitRight: frameRect && bitRect ? frameRect.right - bitRect.right : Number.NaN,
      bitBottom: frameRect && bitRect ? frameRect.bottom - bitRect.bottom : Number.NaN,
      callout: /kod qanday tuzilgan\??/i.test(root.textContent ?? ''),
      mobile,
    };
  }, viewport.width < 640);

  const prefix = `${lesson.file} ${lang} ${viewport.name}`;
  const unifiedDars05Question = lesson.file === 'Dars05.jsx';
  const missing = unifiedDars05Question
    ? contract.missing.filter((role) => role !== 'hook-topic')
    : contract.missing;
  if (missing.length) throw new Error(`${prefix}: hook markerlari yetishmaydi (${missing.join(', ')})`);
  if (unifiedDars05Question) {
    if (contract.topicPresent) throw new Error(`${prefix}: olib tashlangan mavzu chipi hookda qolgan`);
    if (!contract.samePrompt || !contract.unifiedOrdered || contract.answerCount !== 2) {
      throw new Error(`${prefix}: hook tartibi umumiy savol → scene → 2 javob emas`);
    }
  } else if (!contract.ordered || contract.answerCount < 2) {
    throw new Error(`${prefix}: hook tartibi topic → title → question → scene → answers emas`);
  }
  if (contract.callout) throw new Error(`${prefix}: Dars01-only “Kod qanday tuzilgan?” callout ko‘chirildi`);
  const expectedTitle = contract.mobile ? 25 : 36;
  const expectedQuestion = contract.mobile ? 17 : 21;
  if (unifiedDars05Question) {
    if (contract.titleAlign !== 'left' || contract.questionAlign !== 'left'
      || !/Manrope/i.test(contract.titleFont) || contract.titleFont !== contract.questionFont
      || Math.abs(contract.titleSize - expectedQuestion) > 1.1
      || Math.abs(contract.questionSize - expectedQuestion) > 1.1) {
      throw new Error(`${prefix}: umumiy savol ${contract.titleAlign}/${contract.titleFont}/${contract.titleSize}px`);
    }
    if (contract.questionBottom > contract.sceneTop + 1
      || (contract.followingTop !== null && contract.sceneBottom > contract.followingTop + 1)) {
      throw new Error(`${prefix}: hook bloklari ustma-ust (savol ${contract.questionBottom}/${contract.sceneTop}, scene ${contract.sceneBottom}/${contract.followingTop})`);
    }
  } else {
    if (contract.titleAlign !== 'left' || !/Source Serif 4/i.test(contract.titleFont)
      || Math.abs(contract.titleSize - expectedTitle) > 1.1) {
      throw new Error(`${prefix}: H1 ${contract.titleAlign}/${contract.titleFont}/${contract.titleSize}px`);
    }
    if (contract.questionAlign !== 'left' || !/Manrope/i.test(contract.questionFont)
      || Math.abs(contract.questionSize - expectedQuestion) > 1.1) {
      throw new Error(`${prefix}: hook savoli ${contract.questionAlign}/${contract.questionFont}/${contract.questionSize}px`);
    }
    if (contract.titleBottom > contract.questionTop + 1
      || contract.questionBottom > contract.sceneTop + 1
      || (contract.followingTop !== null && contract.sceneBottom > contract.followingTop + 1)) {
      throw new Error(`${prefix}: hook bloklari ustma-ust (title ${contract.titleBottom}/${contract.questionTop}, question ${contract.questionBottom}/${contract.sceneTop}, scene ${contract.sceneBottom}/${contract.followingTop})`);
    }
  }
  if (contract.layoutIssues.length) {
    throw new Error(`${prefix}: hook content kesilgan (${contract.layoutIssues.join(', ')})`);
  }
  const expectedMinHeight = contract.mobile ? 164 : 206;
  const expectedRadius = contract.mobile ? 18 : 24;
  const expectedFrameWidth = FULL_WIDTH_HOOK_LESSONS.has(lesson.file)
    ? contract.availableWidth
    : Math.min(760, contract.availableWidth);
  if (Math.abs(contract.frameWidth - expectedFrameWidth) > 1.1 || contract.frameHeight + 1 < expectedMinHeight
    || Math.abs(contract.frameRadius - expectedRadius) > 1
    || !/hidden|clip/.test(contract.frameOverflow) || contract.frameIsolation !== 'isolate'
    || !/87% 24%/.test(contract.frameBackground)
    || !/rgba\(121, 211, 218, 0\.16\)/.test(contract.frameBackground)
    || !/9% 88%/.test(contract.frameBackground)
    || !/rgba\(149, 201, 61, 0\.11\)/.test(contract.frameBackground)
    || !/rgba\(22, 143, 163, 0\.25\)/.test(contract.frameBackground)
    || !/rgb\(21, 59, 80\)/.test(contract.frameBackground)
    || !/rgb\(11, 34, 50\)/.test(contract.frameBackground)
    || !/rgba\(14, 33, 44, 0\.75\)/.test(contract.frameShadow)
    || !/0px 22px 50px -30px/.test(contract.frameShadow)) {
    throw new Error(`${prefix}: visual frame ${contract.frameWidth}×${contract.frameHeight}, r${contract.frameRadius}, ${contract.frameOverflow}`);
  }
  const expectedBit = contract.mobile
    ? { width: 68, height: 85, right: 12, bottom: -7 }
    : { width: 88, height: 110, right: 42, bottom: -4 };
  if (Math.abs(contract.bitWidth - expectedBit.width) > 1.1
    || Math.abs(contract.bitHeight - expectedBit.height) > 1.1
    || Math.abs(contract.bitRight - expectedBit.right) > 1.1
    || Math.abs(contract.bitBottom - expectedBit.bottom) > 1.1) {
    throw new Error(`${prefix}: hook Bit ${contract.bitWidth}×${contract.bitHeight}, right ${contract.bitRight}, bottom ${contract.bitBottom}`);
  }
}

const screenRequiresExplicitAction = (lessonFile, screenIndex) => {
  const meta = theoryScreenMeta.get(lessonFile)?.[screenIndex];
  if (!meta || meta.active !== true) return false;
  if (meta.scored === true || meta.assessed === true) return true;
  return /choice|test|input|builder|matching|match|sort|rapid|round|construct|slider|tap|select|reflection/i.test(
    `${meta.mechanic ?? ''} ${meta.template ?? ''} ${meta.subtype ?? ''}`,
  );
};

async function assertRankOverlayVisual(page, issuePrefix) {
  const overlay = page.locator(TITLE_OVERLAY_SELECTOR);
  const result = await overlay.evaluate((element) => {
    const card = element.querySelector('.rank-boost-card,.g4-title-reveal-card');
    const medal = element.querySelector('.rank-boost-medal,.g4-title-reveal-medal');
    const title = element.querySelector('h2');
    const rect = element.getBoundingClientRect();
    const titleStyle = title ? getComputedStyle(title) : null;
    const overlayStyle = getComputedStyle(element);
    const medalStyle = medal ? getComputedStyle(medal) : null;
    const confetti = element.querySelector('.rank-boost-confetti,.g4-title-reveal-confetti');
    return {
      width: rect.width,
      height: rect.height,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
      card: Boolean(card),
      medal: Boolean(medal),
      confetti: Boolean(confetti),
      rays: Boolean(element.querySelector('.rank-boost-rays,.g4-title-reveal-rays')),
      // The Dars01 medal deliberately scales in from .25. Validate its
      // canonical CSS box, not the transient transformed bounding box.
      medalWidth: Number.parseFloat(medalStyle?.width ?? '0'),
      medalHeight: Number.parseFloat(medalStyle?.height ?? '0'),
      titleFont: titleStyle?.fontFamily ?? '',
      titleSize: Number.parseFloat(titleStyle?.fontSize ?? '0'),
      overlayAnimation: overlayStyle.animationName,
      medalAnimation: medalStyle?.animationName ?? '',
      titleAnimation: titleStyle?.animationName ?? '',
      confettiDisplay: confetti ? getComputedStyle(confetti).display : '',
      reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      mobile: innerWidth < 640,
    };
  });
  if (Math.abs(result.width - result.viewportWidth) > 1 || Math.abs(result.height - result.viewportHeight) > 1
    || !result.card || !result.medal || !result.confetti || !result.rays
    || !/Source Serif 4/i.test(result.titleFont)) {
    throw new Error(`${issuePrefix}: rank overlay full-screen kompozitsiyasi noto‘g‘ri`);
  }
  const expectedMedal = result.mobile ? 88 : 112;
  const expectedTitle = result.mobile ? 29 : 58;
  if (Math.abs(result.medalWidth - expectedMedal) > 1.1 || Math.abs(result.medalHeight - expectedMedal) > 1.1
    || Math.abs(result.titleSize - expectedTitle) > 1.1) {
    throw new Error(`${issuePrefix}: rank overlay medal/title ${result.medalWidth}×${result.medalHeight}/${result.titleSize}px`);
  }
  if (result.reduced) {
    if (result.overlayAnimation !== 'none' || result.medalAnimation !== 'none'
      || result.titleAnimation !== 'none' || result.confettiDisplay !== 'none') {
      throw new Error(`${issuePrefix}: reduced-motion rank animatsiyasi qisqartirilmagan`);
    }
  } else if (result.overlayAnimation === 'none' || result.medalAnimation === 'none'
    || result.titleAnimation === 'none' || result.confettiDisplay === 'none') {
    throw new Error(`${issuePrefix}: normal-motion rank animatsiyasi ishlamaydi`);
  }
}

async function assertPersistentRewardVisual(titleCard, issuePrefix) {
  const result = await titleCard.evaluate((element) => {
    const bit = element.querySelector('[data-g4-role~="reward-bit"]');
    const medal = element.querySelector('[data-g4-role~="reward-medal"]');
    const confetti = element.querySelector('[data-g4-role~="reward-confetti"]');
    const confettiTimings = [...(confetti?.querySelectorAll('i') ?? [])].map((piece) => {
      const style = getComputedStyle(piece);
      const durationMs = Number.parseFloat(style.animationDuration || '0') * 1000;
      const delayMs = Number.parseFloat(style.animationDelay || '0') * 1000;
      const iterations = Number.parseFloat(style.animationIterationCount || '1');
      return delayMs + durationMs * iterations;
    });
    const title = element.querySelector('h1,h2');
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const bitRect = bit?.getBoundingClientRect();
    const medalRect = medal?.getBoundingClientRect();
    return {
      bit: Boolean(bit),
      noBitContract: element.getAttribute('data-g4-title-bit') === 'absent',
      durationContractMs: Number(element.getAttribute('data-g4-duration-ms') || 0),
      medal: Boolean(medal),
      confetti: Boolean(confetti),
      confettiDisplay: confetti ? getComputedStyle(confetti).display : '',
      confettiEndMs: confettiTimings.length ? Math.max(...confettiTimings) : 0,
      height: rect.height,
      radius: Number.parseFloat(style.borderTopLeftRadius || '0'),
      background: style.backgroundImage,
      bitWidth: bitRect?.width ?? 0,
      bitHeight: bitRect?.height ?? 0,
      medalWidth: medalRect?.width ?? 0,
      medalHeight: medalRect?.height ?? 0,
      titleFont: title ? getComputedStyle(title).fontFamily : '',
      mobile: innerWidth < 640,
      reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  });
  const expected = result.noBitContract
    ? (result.mobile
      ? { minHeight: 76, radius: 14, bitWidth: 0, bitHeight: 0, medal: 34 }
      : { minHeight: 88, radius: 17, bitWidth: 0, bitHeight: 0, medal: 44 })
    : (result.mobile
    ? { minHeight: 88, radius: 14, bitWidth: 57, bitHeight: 71, medal: 34 }
    : { minHeight: 116, radius: 17, bitWidth: 72, bitHeight: 90, medal: 44 });
  const bitContractMatches = result.noBitContract ? !result.bit : result.bit;
  const timedConfettiMatches = !result.noBitContract
    || result.durationContractMs <= 0
    || (result.reduced
      ? result.confettiDisplay === 'none'
      : result.confettiDisplay !== 'none' && Math.abs(result.confettiEndMs - result.durationContractMs) <= 80);
  if (!bitContractMatches || !result.medal || !result.confetti || !timedConfettiMatches || !/Source Serif 4/i.test(result.titleFont)
    || result.height + 1 < expected.minHeight || Math.abs(result.radius - expected.radius) > 1.1
    || Math.abs(result.bitWidth - expected.bitWidth) > 1.1 || Math.abs(result.bitHeight - expected.bitHeight) > 1.1
    || Math.abs(result.medalWidth - expected.medal) > 1.1 || Math.abs(result.medalHeight - expected.medal) > 1.1
    || !/rgb\(23, 59, 82\)/.test(result.background) || !/rgb\(14, 105, 120\)/.test(result.background)) {
    throw new Error(`${issuePrefix}: persistent reward ${result.height}px/r${result.radius}, Bit ${result.bitWidth}×${result.bitHeight}, medal ${result.medalWidth}×${result.medalHeight}`);
  }
}

async function runInitialRouteSmoke(page, diagnostics, viewport, lesson, lang) {
  diagnostics.reset();
  await openLesson(page, lesson, lang);
  const snapshot = await lessonSnapshot(page);
  const prefix = viewport.name + ' ' + lesson.file + ' ' + lang;
  if (snapshot.languageLabels.join(',') !== 'UZ,RU,EN') {
    failures.push(prefix + ': host selector ' + snapshot.languageLabels.join('/'));
  }
  if (snapshot.activeLanguage !== lang.toUpperCase()) {
    failures.push(prefix + ': active language ' + (snapshot.activeLanguage ?? 'none'));
  }
  snapshotIssues(snapshot, lang).forEach((issue) => failures.push(prefix + ': ' + issue));
  diagnostics.pageErrors.forEach((message) => failures.push(prefix + ': pageerror ' + message));

  if (isTheoryContractLesson(lesson)) {
    const internalLanguagePicker = await firstVisible(inLesson(page, '.preview-language'));
    if (internalLanguagePicker) {
      failures.push(prefix + ': host ichida duplicate internal language picker ko\'rinmoqda');
    }
    const count = await currentScreenCount(page);
    const validScreenCount = lesson.file === 'Dars08.jsx'
      ? count.current === 1 && count.total === 15
      : count.current === 1 && count.total >= 13 && count.total <= 17;
    if (!validScreenCount) {
      const expectedCount = lesson.file === 'Dars08.jsx' ? '1 / 15' : '1 / 13–17';
      failures.push(prefix + ': screen-count ' + count.text + ', kutilgan ' + expectedCount);
    }
    try {
      await assertCanonicalHookVisual(page, viewport, lesson, lang);
    } catch (error) {
      failures.push(prefix + ': ' + error.message);
    }
  }

  if (SCREENSHOT_DIR && isStrictEtalonLesson(lesson)) {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${lesson.file.replace('.jsx', '')}-${lang}-${viewport.name}-hook.png`),
    });
  }

}

async function firstVisible(locator) {
  const count = await locator.count();
  for (let index = 0; index < count; index += 1) {
    const item = locator.nth(index);
    if (await item.isVisible()) return item;
  }
  return null;
}

function inLesson(page, selector) {
  return page.locator(LESSON_ROOT).locator(selector);
}

async function waitForVisible(page, selector, timeout = 4_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const item = await firstVisible(inLesson(page, selector));
    if (item) return item;
    await sleep(20);
  }
  throw new Error('Visible element topilmadi: ' + selector);
}

async function installSpeechMock(context) {
  await context.addInitScript(() => {
    const state = { utterances: [], cancelCount: 0 };
    const timers = new Set();
    class MockSpeechSynthesisUtterance {
      constructor(text) {
        this.text = String(text);
        this.lang = '';
        this.rate = 1;
        this.pitch = 1;
        this.volume = 1;
        this.onstart = null;
        this.onend = null;
        this.onerror = null;
      }
    }
    const synthesis = {
      speaking: false,
      pending: false,
      paused: false,
      getVoices: () => [],
      pause() { this.paused = true; },
      resume() { this.paused = false; },
      cancel() {
        state.cancelCount += 1;
        this.speaking = false;
        for (const timer of timers) clearTimeout(timer);
        timers.clear();
      },
      speak(utterance) {
        state.utterances.push({ text: utterance.text, lang: utterance.lang, rate: utterance.rate });
        this.speaking = true;
        utterance.onstart?.();
        const configuredDuration = Number(window.__grade4SpeechDurationMs);
        const duration = Number.isFinite(configuredDuration) && configuredDuration > 0
          ? configuredDuration
          : 120;
        const timer = setTimeout(() => {
          timers.delete(timer);
          this.speaking = false;
          utterance.onend?.();
        }, duration);
        timers.add(timer);
      },
    };
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: synthesis });
    Object.defineProperty(window, '__grade4SpeechSmoke', { configurable: true, value: state });
  });
}

async function speechState(page) {
  return page.evaluate(() => ({
    utterances: [...(window.__grade4SpeechSmoke?.utterances ?? [])],
    cancelCount: window.__grade4SpeechSmoke?.cancelCount ?? 0,
  }));
}

async function waitForSpeechCount(page, minimum, timeout = 15_000, checkpoint = 'speech') {
  try {
    await page.waitForFunction(
      (count) => (window.__grade4SpeechSmoke?.utterances.length ?? 0) >= count,
      minimum,
      { timeout },
    );
  } catch (error) {
    const state = await speechState(page);
    throw new Error(`${checkpoint}: ${error.message}; cancelCount=${state.cancelCount}, utterances=${state.utterances.length}`);
  }
}

async function waitForCancellation(page, previous, timeout = 15_000, checkpoint = 'cancellation') {
  try {
    await page.waitForFunction(
      (count) => (window.__grade4SpeechSmoke?.cancelCount ?? 0) > count,
      previous,
      { timeout },
    );
  } catch (error) {
    const state = await speechState(page);
    throw new Error(`${checkpoint}: ${error.message}; cancelCount=${state.cancelCount}, utterances=${state.utterances.length}`);
  }
}

async function lessonLanguageControl(page, code) {
  const label = code.toUpperCase();
  // Prefer the self-contained lesson picker when it exists. The host picker
  // may perform a full route reload, which recreates the speech mock and makes
  // cancellation counters incomparable across the language switch.
  const preview = inLesson(page, '.preview-language button').filter({ hasText: label });
  const visiblePreview = await firstVisible(preview);
  if (visiblePreview) {
    return {
      button: visiblePreview,
      active: inLesson(page, '.preview-language button.preview-active').filter({ hasText: label }),
      internalPreview: true,
    };
  }
  const host = page.locator('.lesson-language button', { hasText: label });
  if (await host.count()) {
    return {
      button: host,
      active: page.locator('.lesson-language button.is-active', { hasText: label }),
      internalPreview: false,
    };
  }
  return {
    button: page.locator('.lesson-language button', { hasText: label }),
    active: page.locator('.lesson-language button.is-active', { hasText: label }),
    internalPreview: false,
  };
}

async function switchLessonLanguage(page, code) {
  const control = await lessonLanguageControl(page, code);
  if (!(await control.button.count())) throw new Error(`${code.toUpperCase()} til boshqaruvi topilmadi`);
  // A self-contained lesson preview picker can occupy the same host-preview
  // chrome corner as the platform picker. Invoke that explicit control's own
  // click handler without treating the host container as lesson content.
  if (control.internalPreview) {
    await control.button.evaluate((element) => element.click());
  } else {
    await control.button.click();
  }
  await control.active.waitFor();
}

async function lessonLocalizedAnchor(page) {
  const text = normalizeText(await inLesson(
    page,
    '[data-g4-role~="hook-title"], [data-g4-role~="hook-question"], .hook-intro h1, .hook-intro h2',
  ).evaluateAll((elements) => elements
    .filter((element) => {
      const style = getComputedStyle(element);
      return element.getClientRects().length > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    })
    .map((element) => element.textContent ?? '')
    .join('\n')));
  if (!text) throw new Error('lokalizatsiya anchor matni topilmadi');
  return text;
}

async function waitForLessonAnchor(page, baseline, shouldMatch, checkpoint, timeout = 5_000) {
  const deadline = Date.now() + timeout;
  let current = '';
  while (Date.now() < deadline) {
    current = await lessonLocalizedAnchor(page);
    if ((current === baseline) === shouldMatch) return current;
    await sleep(25);
  }
  throw new Error(`${checkpoint}: anchor ${shouldMatch ? 'tiklanmadi' : 'o‘zgarmadi'}; baseline="${baseline}", current="${current}"`);
}

async function runAudioContractSmoke(browser) {
  const audioLessons = lessons.filter((item) => item.section === 'nazariy');
  if (!audioLessons.length) return;
  audioContractChecked = true;

  for (const lesson of audioLessons) {
    const speechContext = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      reducedMotion: 'reduce',
    });
    await installSpeechMock(speechContext);
    const speechPage = await speechContext.newPage();
    try {
      await openLesson(speechPage, lesson, 'en');
      await waitForSpeechCount(speechPage, 1, 15_000, 'initial narration');
      const englishAnchor = await lessonLocalizedAnchor(speechPage);
      const initial = await speechState(speechPage);
      if (initial.utterances.some((item) => item.lang !== 'en-GB')) {
        throw new Error('EN utterance lang en-GB emas');
      }

      const canonicalHookCards = inLesson(speechPage, '[data-g4-role="answer-card"]');
      const interactiveHookCards = await canonicalHookCards.evaluateAll((elements) => elements.filter((element) => (
        element instanceof HTMLButtonElement && element.getClientRects().length > 0
      )).length);
      if (interactiveHookCards) {
        const hookCards = canonicalHookCards;
        await waitForEnabledCard(hookCards);
        if (lesson.file === 'Dars03.jsx') {
          const issuePrefix = 'Dars03 wrong-choice audio retry';
          const retryRoot = await firstVisible(inLesson(
            speechPage,
            '[data-qa-choice-retry="after-wrong-audio"]',
          ));
          const wrong = await firstVisible(inLesson(
            speechPage,
            'button[data-g4-role="answer-card"][data-g4-correct="false"]',
          ));
          if (!retryRoot || !wrong) throw new Error(`${issuePrefix}: retry root yoki wrong variant topilmadi`);
          await speechPage.evaluate(() => { window.__grade4SpeechDurationMs = 600; });
          const sourceIndex = await wrong.getAttribute('data-g4-source-index');
          const attemptsBefore = Number(await retryRoot.getAttribute('data-qa-choice-attempts'));
          const beforeFeedback = (await speechState(speechPage)).utterances.length;
          await wrong.click();
          await waitForSpeechCount(speechPage, beforeFeedback + 1, 15_000, `${issuePrefix} feedback`);
          if (!(await waitForAttributeValue(retryRoot, 'data-qa-choice-pending-wrong', sourceIndex))
            || !(await waitForDisabledLocator(wrong))
            || !(await waitForClassToken(wrong, 'option-picked-wrong'))
            || !(await speechPage.evaluate(() => window.speechSynthesis.speaking))) {
            throw new Error(`${issuePrefix}: izoh davomida variant xato/bloklangan holatda emas`);
          }
          await assertStrictFeedback(speechPage, issuePrefix, 'wrong', 'en');
          await assertOuterNextLocked(speechPage, issuePrefix);
          await speechPage.waitForFunction(() => !window.speechSynthesis.speaking, null, { timeout: 5_000 });
          await waitForChoiceRetryReset(retryRoot, wrong, attemptsBefore + 1, issuePrefix);
          if (await retryRoot.getAttribute('data-qa-choice-picked') !== '') {
            throw new Error(`${issuePrefix}: ovoz tugagach wrong feedback tanlovi tozalanmadi`);
          }
          if (await firstVisible(inLesson(speechPage, '[data-g4-feedback="wrong"]'))) {
            throw new Error(`${issuePrefix}: ovoz tugagach wrong feedback yashirilmadi`);
          }

          const retryAttemptsBefore = Number(await retryRoot.getAttribute('data-qa-choice-attempts'));
          const beforeRetry = (await speechState(speechPage)).utterances.length;
          await wrong.click();
          await waitForSpeechCount(speechPage, beforeRetry + 1, 15_000, `${issuePrefix} same-option retry`);
          if (!(await waitForAttributeValue(retryRoot, 'data-qa-choice-pending-wrong', sourceIndex))) {
            throw new Error(`${issuePrefix}: ayni wrong variant ikkinchi marta tanlanmadi`);
          }
          await speechPage.waitForFunction(() => !window.speechSynthesis.speaking, null, { timeout: 5_000 });
          await waitForChoiceRetryReset(retryRoot, wrong, retryAttemptsBefore + 1, `${issuePrefix} same-option retry`);
          await speechPage.evaluate(() => { window.__grade4SpeechDurationMs = 120; });
        } else {
          const beforeFeedback = (await speechState(speechPage)).utterances.length;
          await hookCards.first().click();
          await waitForSpeechCount(speechPage, beforeFeedback + 1, 15_000, 'hook feedback');
        }
      }

      const mute = await waitForVisible(speechPage, 'button[aria-label="Turn sound off"]');
      const beforeMuteCancel = (await speechState(speechPage)).cancelCount;
      await mute.click();
      await waitForCancellation(speechPage, beforeMuteCancel, 15_000, 'mute cancellation');
      if (await firstVisible(inLesson(speechPage, 'button[aria-label="Replay"]'))) {
        throw new Error('mute holatida Replay yashirilmadi');
      }

      const unmute = await waitForVisible(speechPage, 'button[aria-label="Turn sound on"]');
      await unmute.click();
      const replay = await waitForVisible(speechPage, 'button[aria-label="Replay"]');
      const beforeReplay = (await speechState(speechPage)).utterances.length;
      await replay.click();
      await waitForSpeechCount(speechPage, beforeReplay + 1, 15_000, 'Replay');

      const beforeSwitchCancel = (await speechState(speechPage)).cancelCount;
      await switchLessonLanguage(speechPage, 'ru');
      await waitForCancellation(speechPage, beforeSwitchCancel, 15_000, 'language switch cancellation');
      await waitForLessonAnchor(speechPage, englishAnchor, false, 'RU language switch content');

      const beforeEnglish = (await speechState(speechPage)).utterances.length;
      await switchLessonLanguage(speechPage, 'en');
      await waitForSpeechCount(speechPage, beforeEnglish + 1, 15_000, 'EN language switch');
      await waitForLessonAnchor(speechPage, englishAnchor, true, 'EN language switch content');
      const afterSwitch = await speechState(speechPage);
      if (afterSwitch.utterances.slice(beforeEnglish).some((item) => item.lang !== 'en-GB')) {
        throw new Error('EN ga qaytganda utterance en-GB emas');
      }
    } catch (error) {
      failures.push('audio Web Speech ' + lesson.file + ': ' + error.message);
    } finally {
      await speechContext.close();
    }

    const httpContext = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      reducedMotion: 'reduce',
    });
    await installSpeechMock(httpContext);
    const httpPage = await httpContext.newPage();
    const ttsRequests = [];
    await httpPage.route('https://grade4-tts.invalid/**', async (route) => {
      ttsRequests.push(route.request().url());
      await route.fulfill({ status: 200, contentType: 'audio/mpeg', body: '' });
    });
    try {
      const ttsBase = 'https://grade4-tts.invalid/base';
      await openLessonUrl(
        httpPage,
        baseUrl + routeFor(lesson, 'en') + '&tts=' + encodeURIComponent(ttsBase),
      );
      const deadline = Date.now() + 15_000;
      while (!ttsRequests.length && Date.now() < deadline) await sleep(25);
      if (!ttsRequests.length) throw new Error('HTTP TTS request kuzatilmadi');
      for (const requestUrl of ttsRequests) {
        const url = new URL(requestUrl);
        const keys = [...url.searchParams.keys()].sort().join(',');
        if (url.pathname !== '/base/api/tts' || keys !== 'g,text') {
          throw new Error('HTTP TTS URL faqat /api/tts?text+g emas: ' + requestUrl);
        }
        if (!url.searchParams.get('text') || !/^[fm]$/.test(url.searchParams.get('g') ?? '')) {
          throw new Error('HTTP TTS text yoki g bo\'sh: ' + requestUrl);
        }
      }
      if ((await speechState(httpPage)).utterances.length) {
        throw new Error('production branch Web Speech ishlatdi');
      }
    } catch (error) {
      failures.push('audio HTTP TTS ' + lesson.file + ': ' + error.message);
    } finally {
      await httpContext.close();
    }
  }
}

async function buttonDisplayText(button) {
  const text = normalizeText(await button.innerText());
  const letter = button.locator('.p4-letter, .g4p-letter').first();
  if (await letter.count()) {
    const prefix = normalizeText(await letter.innerText());
    if (prefix && text.startsWith(prefix)) return normalizeText(text.slice(prefix.length));
  }
  return text;
}

async function clickMatchingButton(page, selector, expected) {
  const wanted = normalizeText(expected);
  const wantedCompact = compactText(wanted);
  if (!wantedCompact) throw new Error('Bo\'sh button matni bilan click so\'raldi');
  const buttons = inLesson(page, selector);
  const candidates = [];
  const count = await buttons.count();
  for (let index = 0; index < count; index += 1) {
    const button = buttons.nth(index);
    if (!(await button.isVisible()) || !(await button.isEnabled())) continue;
    const text = await buttonDisplayText(button);
    candidates.push({ index, text, compact: compactText(text) });
  }
  const exact = candidates.find((candidate) => candidate.compact === wantedCompact);
  const contains = wantedCompact.length >= 3
    ? candidates.find((candidate) => candidate.compact.includes(wantedCompact))
    : null;
  const match = exact || contains;
  if (!match) {
    throw new Error('Button topilmadi: "' + wanted + '" ichida [' + candidates.map((candidate) => candidate.text).join(' | ') + ']');
  }
  await buttons.nth(match.index).click();
}

async function clickLocatorIndex(page, selector, index) {
  const buttons = inLesson(page, selector);
  const visible = [];
  const count = await buttons.count();
  for (let cursor = 0; cursor < count; cursor += 1) {
    const button = buttons.nth(cursor);
    if (await button.isVisible() && await button.isEnabled()) visible.push(button);
  }
  if (!visible[index]) throw new Error(selector + ': ' + index + '-indexli enabled button topilmadi');
  await visible[index].click();
}

function choiceText(choice) {
  if (choice === null || choice === undefined) return '';
  if (typeof choice !== 'object') return String(choice);
  return localize(choice.text ?? choice.label ?? choice.value ?? choice.shift);
}

function choicePool(task) {
  return task.options || task.choices || [];
}

function correctChoiceIndex(task) {
  const choices = choicePool(task);
  const marked = choices.findIndex((choice) => choice?.correct === true);
  if (marked >= 0) return marked;
  if (Number.isInteger(task.correct)) return task.correct;
  return -1;
}

function choiceSelector(task) {
  if (task.kind === 'state') return '.p4-state button';
  if (task.kind === 'place') return task.choices ? '.p4-place .p4-place-row' : '.p4-place-slot';
  if (task.kind === 'digit' && !task.options) return '.p4-digits button';
  if (task.kind === 'missing') return '.p4-missing button, .g4p-options button';
  return '.p4-options button, .g4p-options button';
}

async function selectChoice(page, task, chooseCorrect) {
  const choices = choicePool(task);
  const correct = correctChoiceIndex(task);
  if (correct < 0) throw new Error(task.id + ' ' + task.kind + ': correct choice metadata topilmadi');
  const targetIndex = chooseCorrect ? correct : choices.findIndex((_, index) => index !== correct);
  if (targetIndex < 0) throw new Error(task.id + ': wrong choice topilmadi');
  const targetText = choiceText(choices[targetIndex]);
  if (targetText) {
    await clickMatchingButton(page, choiceSelector(task), targetText);
  } else {
    await clickLocatorIndex(page, choiceSelector(task), targetIndex);
  }
}

async function enterNumber(page, value) {
  const answer = String(value);
  for (const digit of answer) {
    if (!/\d/.test(digit)) continue;
    await clickMatchingButton(
      page,
      '.p4-pad-keys button:not(.p4-key-del):not(.is-delete), .g4p-pad-keys button:not(.is-delete)',
      digit,
    );
  }
}

async function solveMatch(page, task) {
  const pairs = task.pairs
    ? task.pairs.map((pair) => {
        let right = pair.right;
        if (pair.correctRight !== undefined) {
          right = task.right?.find((item) => item.id === pair.correctRight) ?? pair.correctRight;
        }
        return { left: pair.left, right: right?.text ?? right };
      })
    : task.left.map((left, index) => ({ left, right: task.right[task.answer[index]] }));

  for (const pair of pairs) {
    await clickMatchingButton(page, '.p4-match-col:first-child button, .g4p-match-col:first-child button', localize(pair.left));
    await clickMatchingButton(page, '.p4-match-col:last-child button, .g4p-match-col:last-child button', localize(pair.right));
  }
}

async function solveAssignments(page, task) {
  for (let index = 0; index < task.slots.length; index += 1) {
    const slot = task.slots[index];
    const card = task.cards.find((item) => (typeof item === 'object' ? item.id : item) === slot.correct);
    const cardText = typeof card === 'object' ? localize(card.text ?? card.label ?? card.id) : String(card ?? slot.correct);
    await clickLocatorIndex(page, '.p4-slot-list .p4-slot, .g4p-slots button', index);
    await clickMatchingButton(page, '.p4-card-bank .p4-card, .g4p-cards button', cardText);
  }
}

async function solveOrder(page, task) {
  if (task.items && task.answer) {
    for (const itemId of task.answer) {
      const item = task.items.find((candidate) => candidate.id === itemId);
      await clickMatchingButton(page, '.p4-order-pool button', localize(item?.text ?? itemId));
    }
    return;
  }
  if (task.slots) {
    await solveAssignments(page, task);
    return;
  }
  for (let index = 0; index < task.steps.length; index += 1) {
    const expectedCard = task.steps[index]?.correct;
    const card = task.cards.find((candidate) => (
      expectedCard === undefined ? candidate.order === index : candidate.id === expectedCard
    ));
    await clickLocatorIndex(page, '.p4-order-slots button', index);
    await clickMatchingButton(page, '.p4-card-bank button', localize(card?.text ?? card?.label ?? card?.id));
  }
}

async function solveConstruct(page, task) {
  for (const symbol of task.answer) {
    await clickMatchingButton(page, '.p4-card-bank button, .g4p-cards button', symbol);
  }
}

async function solveSort(page, task) {
  for (const item of task.items) {
    const bin = task.bins.find((candidate) => candidate.id === item.bin);
    await clickMatchingButton(page, '.p4-sort-pool button', localize(item.text));
    await clickMatchingButton(page, '.p4-sort-bin-head', localize(bin.label));
  }
}

async function solveShade(page, task) {
  const cells = inLesson(page, '.p4-cells button');
  if (await cells.count() < task.selectCount) throw new Error(task.id + ': yetarli selectable cell topilmadi');
  for (let index = 0; index < task.selectCount; index += 1) {
    await cells.nth(index).click();
  }
}

async function solveFractionBuilder(page, task) {
  const groups = inLesson(page, '.p4-frac-builder > div');
  if (await groups.count() < 2) throw new Error(task.id + ': fraction builder guruhlari topilmadi');
  await groups.nth(0).getByRole('button', { name: String(task.answer.n), exact: true }).click();
  await groups.nth(1).getByRole('button', { name: String(task.answer.d), exact: true }).click();
}

async function solvePracticeTask(page, task) {
  if (['mc', 'state', 'place', 'sign', 'card'].includes(task.kind)) {
    await selectChoice(page, task, true);
    return;
  }
  if (task.kind === 'digit') {
    if (task.options) await selectChoice(page, task, true);
    else await clickMatchingButton(page, '.p4-digits button', task.answer);
    return;
  }
  if (task.kind === 'placepick') {
    const correct = task.places.findIndex((place) => place.correct);
    await clickLocatorIndex(page, '.p4-place-grid button', correct);
    return;
  }
  if (task.kind === 'gap') {
    await inLesson(page, '.p4-gap[aria-label="' + task.correctGap + '"]').click();
    return;
  }
  if (task.kind === 'numpad' || (task.kind === 'missing' && task.answer !== undefined)) {
    await enterNumber(page, task.answer);
    return;
  }
  if (task.kind === 'missing') {
    await selectChoice(page, task, true);
    return;
  }
  if (task.kind === 'match') {
    await solveMatch(page, task);
    return;
  }
  if (task.kind === 'order') {
    await solveOrder(page, task);
    return;
  }
  if (task.kind === 'slots') {
    await solveAssignments(page, task);
    return;
  }
  if (task.kind === 'construct') {
    await solveConstruct(page, task);
    return;
  }
  if (task.kind === 'sort') {
    await solveSort(page, task);
    return;
  }
  if (task.kind === 'ticks') {
    await clickMatchingButton(page, '.p4-scale-tick button', task.answer);
    return;
  }
  if (task.kind === 'shade') {
    await solveShade(page, task);
    return;
  }
  if (task.kind === 'fracbuild') {
    await solveFractionBuilder(page, task);
    return;
  }
  throw new Error(task.id + ': qo\'llab-quvvatlanmagan practice kind "' + task.kind + '"');
}

async function solveWrongMatch(page, task) {
  if (!Array.isArray(task.pairs) || task.pairs.length < 2) {
    throw new Error(task.id + ': wrong-first uchun kamida ikki match jufti kerak');
  }
  const correctRights = task.pairs.map((pair) => (
    task.right?.find((item) => item.id === pair.correctRight) ?? pair.correctRight
  ));
  const wrongRights = [...correctRights.slice(1), correctRights[0]];
  for (let index = 0; index < task.pairs.length; index += 1) {
    await clickMatchingButton(page, '.p4-match-col:first-child button, .g4p-match-col:first-child button', localize(task.pairs[index].left));
    await clickMatchingButton(page, '.p4-match-col:last-child button, .g4p-match-col:last-child button', localize(wrongRights[index]?.text ?? wrongRights[index]));
  }
}

async function solveWrongOrder(page, task) {
  if (!Array.isArray(task.steps) || !Array.isArray(task.cards) || task.steps.length < 2) {
    throw new Error(task.id + ': wrong-first uchun steps/cards order sxemasi kerak');
  }
  const cards = task.steps.map((step, index) => task.cards.find((candidate) => (
    step.correct === undefined ? candidate.order === index : candidate.id === step.correct
  )));
  [cards[0], cards[1]] = [cards[1], cards[0]];
  for (let index = 0; index < task.steps.length; index += 1) {
    await clickLocatorIndex(page, '.p4-order-slots button', index);
    await clickMatchingButton(page, '.p4-card-bank button', localize(cards[index]?.text ?? cards[index]?.label ?? cards[index]?.id));
  }
}

async function solveWrongPracticeTask(page, task) {
  if (['mc', 'state', 'place', 'sign', 'card'].includes(task.kind)
    || (task.kind === 'missing' && task.answer === undefined)) {
    await selectChoice(page, task, false);
    return;
  }
  if (task.kind === 'numpad' || task.kind === 'missing') {
    await enterNumber(page, String(task.answer) === '0' ? '1' : '0');
    return;
  }
  if (task.kind === 'match') {
    await solveWrongMatch(page, task);
    return;
  }
  if (task.kind === 'order') {
    await solveWrongOrder(page, task);
    return;
  }
  throw new Error(task.id + ': wrong-first qo\'llab-quvvatlamaydigan kind "' + task.kind + '"');
}

async function clickCheck(page) {
  const button = await waitForVisible(page, CHECK_ACTION);
  if (!(await button.isEnabled())) throw new Error('Check tugmasi disabled qoldi');
  await button.click();
}

async function waitForPracticeOutcome(page, timeout = 4_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const ready = await firstVisible(inLesson(page, READY_ACTION));
    if (ready) return { kind: 'ready', button: ready };
    const retry = await firstVisible(inLesson(page, RETRY_ACTION));
    if (retry) return { kind: 'retry', button: retry };
    await sleep(20);
  }
  throw new Error('Practice check natijasi ko\'rinmadi');
}

const practiceLessonNumber = (lesson) => {
  const match = lesson?.file?.match(/^Dars(\d{2})Practice\.jsx$/);
  return match ? Number(match[1]) : null;
};
const isModernPracticeLesson = (lesson) => {
  const number = practiceLessonNumber(lesson);
  return number !== null && number >= 17 && number <= 30;
};
const requiresPracticeRestartAudit = (lesson) => {
  const number = practiceLessonNumber(lesson);
  return number !== null && number >= 22 && number <= 30;
};

function assertAnswerIndexContract(prefix, payload) {
  const visit = (value, pathLabel) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach((entry, index) => visit(entry, `${pathLabel}[${index}]`));
      return;
    }

    if (Array.isArray(value.options)) {
      const assertIndex = (indexKey, answerKey) => {
        if (!Object.hasOwn(value, indexKey)) return;
        const index = value[indexKey];
        // Null means this interaction is intentionally not represented by an
        // option-array coordinate (matching, reflection, composite answers).
        if (index === null) return;
        if (!Number.isInteger(index) || index < 0 || index >= value.options.length) {
          throw new Error(`${prefix}: ${pathLabel}.${indexKey} variant chegarasidan tashqarida`);
        }
        if (!Object.hasOwn(value, answerKey)
          || JSON.stringify(value.options[index]) !== JSON.stringify(value[answerKey])) {
          throw new Error(
            `${prefix}: ${pathLabel} options[${indexKey}] !== ${answerKey}`,
          );
        }
      };
      assertIndex('correctIndex', 'correctAnswer');
      assertIndex('studentAnswerIndex', 'studentAnswer');
    }

    Object.entries(value).forEach(([key, entry]) => visit(entry, `${pathLabel}.${key}`));
  };

  visit(payload, 'payload');
}

async function validateCompletion(prefix, diagnostics, lesson = null, lang = 'en', tasks = [], wrongFirstEveryTask = false, expectedTitle = '') {
  await waitForCompletion(diagnostics);
  if (diagnostics.completionCalls.length !== 1) {
    throw new Error(prefix + ': [Lesson preview] onFinished soni ' + diagnostics.completionCalls.length + ', kutilgan 1');
  }
  const payload = diagnostics.completionCalls[0];
  assertAnswerIndexContract(prefix, payload);
  const title = payload?.lessonTitle;
  if (typeof title !== 'string' || !title.trim()
    || ((lang === 'en' || lang === 'uz') && hasCyrillic(title))) {
    throw new Error(prefix + ': ' + lang + ' lessonTitle noto\'g\'ri: ' + JSON.stringify(title));
  }
  if (requiresPracticeRestartAudit(lesson) && expectedTitle && normalizeText(title) !== expectedTitle) {
    throw new Error(prefix + ': payload lessonTitle visible title bilan mos emas');
  }
  if (isModernPracticeLesson(lesson)) {
    const lessonNumber = practiceLessonNumber(lesson);
    const expectedLessonId = `num-4-${String(lessonNumber).padStart(2, '0')}-practice`;
    if (payload?.lessonId !== expectedLessonId || payload?.activityType !== 'practice' || payload?.completed !== true) {
      throw new Error(prefix + ': modern practice identity/completion kontrakti noto\'g\'ri');
    }
    if (payload?.totalQuestions !== 10 || payload?.answeredQuestions !== 10 || payload?.finalTotal !== 10) {
      throw new Error(prefix + ': modern practice total/answered/finalTotal 10 emas');
    }
    if (!Array.isArray(payload?.answers) || payload.answers.length !== 10) {
      throw new Error(prefix + ': modern practice answers massivi 10 ta emas');
    }
    if (!Number.isInteger(payload?.attemptsTotal) || payload.attemptsTotal < 10) {
      throw new Error(prefix + ': modern practice attemptsTotal noto\'g\'ri');
    }
    if (!Number.isInteger(payload?.durationSec) || payload.durationSec < 0) {
      throw new Error(prefix + ': modern practice durationSec noto\'g\'ri');
    }
    if (!Number.isInteger(payload?.correctAnswers)
      || payload.correctAnswers !== payload.firstTryCorrect
      || payload.correctAnswers !== payload.finalScore) {
      throw new Error(prefix + ': modern practice correctAnswers/firstTryCorrect/finalScore mos emas');
    }
    const expectedPercent = Math.round(payload.correctAnswers / 10 * 100);
    if (payload.scorePercent !== expectedPercent || payload.passed !== (payload.correctAnswers >= 6)) {
      throw new Error(prefix + ': modern practice scorePercent/passed mos emas');
    }
    if (!payload.levelBreakdown || !Array.isArray(payload.skillTags) || payload.skillTags.length < 1
      || !payload.lessonMeta || !Array.isArray(payload.screenMeta) || payload.screenMeta.length !== 10) {
      throw new Error(prefix + ': modern practice diagnostik payload to\'liq emas');
    }
    const expectedTags = [...new Set(tasks.map((task) => task.skillTag))];
    if (JSON.stringify(payload.skillTags) !== JSON.stringify(expectedTags)
      || payload.lessonMeta.lessonId !== expectedLessonId) {
      throw new Error(prefix + ': modern practice skillTags/lessonMeta mos emas');
    }
    const expectedLevels = { green: 2, yellow: 5, red: 3 };
    for (const [level, total] of Object.entries(expectedLevels)) {
      const actual = payload.levelBreakdown[level];
      const expectedFirstTry = payload.answers.filter((answer) => answer.level === level && answer.firstTry).length;
      if (actual?.total !== total || actual?.firstTry !== expectedFirstTry) {
        throw new Error(prefix + ': modern practice levelBreakdown ' + level + ' noto\'g\'ri');
      }
    }
    const answerIds = payload.answers.map((answer) => answer.taskId).join(',');
    if (answerIds !== '01,02,03,04,05,06,07,08,09,10') {
      throw new Error(prefix + ': modern practice answer task ID/order noto\'g\'ri: ' + answerIds);
    }
    payload.answers.forEach((answer, index) => {
      const task = tasks[index];
      const expectedAttempts = wrongFirstEveryTask ? (index === 0 ? 4 : 2) : (index === 0 ? 2 : 1);
      if (answer.attempts !== expectedAttempts
        || answer.firstTry !== (answer.attempts === 1) || answer.correct !== true
        || answer.level !== task.level || answer.kind !== task.kind || answer.skillTag !== task.skillTag
        || !Object.hasOwn(answer, 'studentAnswer') || !Object.hasOwn(answer, 'correctAnswer')
        || answer.screenMeta?.taskId !== task.id) {
        throw new Error(prefix + ': modern practice answer record ' + task.id + ' noto\'g\'ri');
      }
    });
    const derivedFirstTry = payload.answers.filter((answer) => answer.firstTry).length;
    const expectedFirstTry = wrongFirstEveryTask ? 0 : 9;
    const expectedAttemptsTotal = wrongFirstEveryTask ? 22 : 11;
    if (derivedFirstTry !== expectedFirstTry || payload.attemptsTotal !== expectedAttemptsTotal) {
      throw new Error(prefix + ': modern practice wrong-first urinish profili noto\'g\'ri');
    }
    const derivedPercent = Math.round(derivedFirstTry / 10 * 100);
    if (payload.correctAnswers !== derivedFirstTry || payload.firstTryCorrect !== derivedFirstTry
      || payload.finalScore !== derivedFirstTry || payload.scorePercent !== derivedPercent
      || payload.passed !== (derivedFirstTry >= 6)) {
      throw new Error(prefix + ': modern practice score answer recordlardan hisoblangan natijaga mos emas');
    }
    if (payload.firstTryStats?.total !== 10 || payload.firstTryStats?.answered !== 10
      || payload.firstTryStats?.firstTryCorrect !== derivedFirstTry
      || payload.firstTryStats?.correct !== derivedFirstTry
      || payload.firstTryStats?.scorePercent !== derivedPercent) {
      throw new Error(prefix + ': modern practice firstTryStats noto\'g\'ri');
    }
  }
  if (lesson && isStrictEtalonLesson(lesson)) {
    if (typeof payload?.lessonId !== 'string' || !payload.lessonId.trim()) {
      throw new Error(prefix + ': lessonId bo‘sh');
    }
    if (!Number.isInteger(payload?.durationSec) || payload.durationSec < 0) {
      throw new Error(prefix + ': durationSec noto‘g‘ri');
    }
    if (!Number.isInteger(payload?.totalQuestions) || payload.totalQuestions < 3) {
      throw new Error(prefix + ': totalQuestions noto‘g‘ri');
    }
    if (!Number.isInteger(payload?.correctAnswers)
      || payload.correctAnswers < 0
      || payload.correctAnswers > payload.totalQuestions) {
      throw new Error(prefix + ': correctAnswers noto‘g‘ri');
    }
    const expectedPercent = Math.round(payload.correctAnswers / payload.totalQuestions * 100);
    if (payload.scorePercent !== expectedPercent
      || payload.finalScore !== payload.correctAnswers
      || payload.finalTotal !== payload.totalQuestions
      || typeof payload.passed !== 'boolean') {
      throw new Error(prefix + ': score/final/passed maydonlari bir-biriga mos emas');
    }
    if (!Array.isArray(payload.answers) || !payload.answers.length) {
      throw new Error(prefix + ': answers massivi bo‘sh');
    }
    if (lesson.file === 'Dars08.jsx') {
      if (payload.totalQuestions !== 4 || payload.finalTotal !== 4) {
        throw new Error(prefix + ': Dars08 to\'rtta baholanadigan ekran bilan hisoblanishi kerak');
      }
      const rapidAnswer = payload.answers.find((answer) => answer?.screenIdx === 11);
      if (
        !rapidAnswer
        || rapidAnswer.totalQuestions !== 1
        || !Array.isArray(rapidAnswer.subResults)
        || rapidAnswer.subResults.length !== 1
        || !Array.isArray(rapidAnswer.attemptsByRound)
        || rapidAnswer.attemptsByRound.length !== 1
      ) {
        throw new Error(prefix + ': Dars08 s11 bir raundli rapid LMS tafsilotlari to\'liq emas');
      }
    }
  }
  if (lesson?.file === 'Dars51.jsx') {
    if (payload?.assessment !== true) throw new Error(prefix + ': Dars51 assessment:true emas');
    if (payload.totalQuestions !== 5 || payload.finalTotal !== 5
      || payload.finalScore !== payload.correctAnswers
      || payload.scorePercent !== Math.round(payload.correctAnswers / 5 * 100)
      || payload.passed !== (payload.correctAnswers / 5 >= 0.6)) {
      throw new Error(prefix + ': Dars51 5-savollik first-try assessment natijasi mos emas');
    }
    if (payload.firstTryStats?.total !== 5
      || payload.firstTryStats?.firstTryCorrect !== payload.correctAnswers) {
      throw new Error(prefix + ': Dars51 firstTryStats noto‘g‘ri');
    }
    const scoredScreens = new Set([8, 9, 10, 12, 13]);
    const scoredAnswers = (payload.answers ?? []).filter((answer) => scoredScreens.has(answer?.screenIdx));
    if (scoredAnswers.length !== 5 || scoredAnswers.some((answer) => typeof answer.firstTry !== 'boolean')) {
      throw new Error(prefix + ': Dars51 s8/s9/s10/s12/s13 first-try yozuvlari to‘liq emas');
    }
  }
  return payload;
}

async function auditPracticeRestart(page, diagnostics, lesson, tasks, prefix) {
  if (!requiresPracticeRestartAudit(lesson)) return;
  const restart = await waitForVisible(page, '.p4-done .p4-btn, .p4-done button, .g4p-result button');
  await restart.click();
  await waitForVisible(page, CHECK_ACTION);
  const counterSelector = '.p4-counter, .g4p-counter, .p4-task-top > span:first-child, .p4-root > header > div:last-child > b';
  const firstCounter = normalizeText(await inLesson(page, counterSelector).first().innerText());
  if (!/\b1\s*\/\s*10\b/.test(firstCounter)) {
    throw new Error(prefix + ': restartdan keyin counter 1/10 emas: ' + firstCounter);
  }
  await solvePracticeTask(page, tasks[0]);
  await clickCheck(page);
  const outcome = await waitForPracticeOutcome(page);
  if (outcome.kind !== 'ready') throw new Error(prefix + ': restartdan keyin 1-topshiriq yechilmadi');
  await outcome.button.click();
  await waitForVisible(page, CHECK_ACTION);
  const secondCounter = normalizeText(await inLesson(page, counterSelector).first().innerText());
  if (!/\b2\s*\/\s*10\b/.test(secondCounter)) {
    throw new Error(prefix + ': restartdan keyin 2-topshiriqqa o\'tmadi: ' + secondCounter);
  }
  if (diagnostics.completionCalls.length !== 1) {
    throw new Error(prefix + ': restart onFinished chaqiruvini takrorladi');
  }
}

async function runPracticeTraversal(page, diagnostics, lesson, tasks, lang = 'en', wrongFirstEveryTask = false) {
  const prefix = 'deep practice ' + lesson.file + ' ' + lang;
  const strictPractice = requiresPracticeRestartAudit(lesson);
  activePracticeLang = lang;
  diagnostics.reset();
  await openLesson(page, lesson, lang);
  const titleNode = await firstVisible(inLesson(page, '.p4-header h1, .p4-title, .p4-root > header > div:last-child > span'));
  const expectedTitle = titleNode ? normalizeText(await titleNode.innerText()) : '';
  if (strictPractice && !expectedTitle) throw new Error(prefix + ': visible lesson title topilmadi');

  for (let index = 0; index < tasks.length; index += 1) {
    const task = tasks[index];
    const snapshot = await lessonSnapshot(page);
    const issues = snapshotIssues(snapshot, lang);
    issues.forEach((issue) => failures.push(prefix + ' task ' + task.id + ': ' + issue));

    const wrongRounds = wrongFirstEveryTask ? (index === 0 ? 3 : 1) : (index === 0 ? 1 : 0);
    for (let round = 0; round < wrongRounds; round += 1) {
      await solveWrongPracticeTask(page, task);
      await clickCheck(page);
      const wrongOutcome = await waitForPracticeOutcome(page);
      if (wrongOutcome.kind !== 'retry') throw new Error(prefix + ': wrong answer retry bermadi');
      const retryLabel = normalizeText(await wrongOutcome.button.innerText());
      if (!retryLabel || (lang === 'en' && hasCyrillic(retryLabel))) throw new Error(prefix + ': retry label ' + lang + ' emas');
      const feedback = await firstVisible(inLesson(page, '.p4-feedback, .g4p-feedback'));
      const feedbackText = feedback ? normalizeText(await feedback.innerText()) : '';
      if (strictPractice && !feedbackText) throw new Error(prefix + ' task ' + task.id + ': wrong feedback ko\'rinmadi');
      if (strictPractice && round >= 1) {
        const expectedHint = localize(round === 1 ? task.secondHint : task.thirdHint);
        if (expectedHint && !feedbackText.includes(normalizeText(expectedHint))) {
          throw new Error(prefix + ' task ' + task.id + ': ' + (round === 1 ? 'secondHint' : 'thirdHint') + ' ko\'rinmadi');
        }
      }
      await wrongOutcome.button.click();
      await waitForVisible(page, CHECK_ACTION);
    }

    try {
      await solvePracticeTask(page, task);
    } catch (error) {
      throw new Error(prefix + ' task ' + task.id + ': ' + error.message);
    }
    await clickCheck(page);
    const outcome = await waitForPracticeOutcome(page);
    if (outcome.kind !== 'ready') {
      throw new Error(prefix + ' task ' + task.id + ': TASKS metadata bilan to\'g\'ri yechilmadi');
    }
    if (index === tasks.length - 1) {
      const finishLabel = normalizeText(await outcome.button.innerText());
      if (!finishLabel || (lang === 'en' && (!/finish|complete|next|continue/i.test(finishLabel) || hasCyrillic(finishLabel)))) {
        throw new Error(prefix + ': final transition ' + lang + ' emas: ' + finishLabel);
      }
    }
    if (index === tasks.length - 1) {
      await outcome.button.evaluate((element) => {
        element.click();
        element.click();
      });
    } else {
      await outcome.button.click();
    }
    if (index < tasks.length - 1) {
      await waitForVisible(page, CHECK_ACTION);
    } else {
      await waitForVisible(page, RESULT_SCREEN);
    }
    practiceTasksTraversed += 1;
  }

  const finalSnapshot = await lessonSnapshot(page);
  const finalIssues = snapshotIssues(finalSnapshot, lang);
  finalIssues.forEach((issue) => failures.push(prefix + ' result: ' + issue));
  await validateCompletion(prefix, diagnostics, lesson, lang, tasks, wrongFirstEveryTask, expectedTitle);
  await auditPracticeRestart(page, diagnostics, lesson, tasks, prefix);
  diagnostics.pageErrors.forEach((message) => failures.push(prefix + ': pageerror ' + message));
}

function parseScreenCount(value) {
  const match = String(value ?? '').match(/(\d+)\s*\/\s*(\d+)/);
  return match ? { current: Number(match[1]), total: Number(match[2]) } : null;
}

async function currentScreenCount(page) {
  const counter = await firstVisible(inLesson(page, '.screen-count'));
  if (!counter) throw new Error('.screen-count topilmadi');
  const text = normalizeText(await counter.innerText());
  const parsed = parseScreenCount(text);
  if (!parsed) throw new Error('screen-count parse bo\'lmadi: ' + text);
  return { ...parsed, text };
}

async function visibleAnswerOrderSnapshot(page) {
  return inLesson(page, '[data-g4-source-index][data-g4-correct]').evaluateAll((elements) => {
    const isVisible = (element) => {
      const style = getComputedStyle(element);
      return element.getClientRects().length > 0
        && style.display !== 'none'
        && style.visibility !== 'hidden';
    };
    const visible = elements.filter(isVisible);
    const visibleSet = new Set(visible);
    const rootSelector = '.lesson-root, .d8-root, .p4-root, .g4p-root';
    const ownerFor = (element) => {
      let candidate = element.parentElement;
      while (candidate && !candidate.matches(rootSelector)) {
        const markedDescendants = [...candidate.querySelectorAll('[data-g4-source-index][data-g4-correct]')]
          .filter((descendant) => visibleSet.has(descendant));
        if (markedDescendants.length > 1) return candidate;
        candidate = candidate.parentElement;
      }
      return element.parentElement;
    };

    const grouped = new Map();
    visible.forEach((element) => {
      const owner = ownerFor(element);
      if (!grouped.has(owner)) grouped.set(owner, []);
      grouped.get(owner).push(element);
    });

    return [...grouped.entries()].map(([owner, group]) => {
      const entries = group.map((element) => {
        const directChildren = [...element.children];
        const label = directChildren.find((child) => (
          /^[A-D]$/.test(String(child.textContent ?? '').trim().toUpperCase())
        )) ?? null;
        const clone = element.cloneNode(true);
        const labelIndex = label ? directChildren.indexOf(label) : -1;
        if (labelIndex >= 0) clone.children[labelIndex]?.remove();
        return {
          sourceIndex: Number(element.getAttribute('data-g4-source-index')),
          correctFlag: element.getAttribute('data-g4-correct'),
          displayLabel: String(label?.textContent ?? '').trim().toUpperCase(),
          semanticText: String(clone.textContent ?? '').replace(/\s+/g, ' ').trim(),
          visualChoice: element.matches('.model-choice, .scale-choice')
            || Boolean(element.querySelector('svg, canvas, [data-g4-role~="visual-frame"]')),
          naturalOrder: element.getAttribute('data-g4-answer-order') === 'natural',
          state: {
            sourceIndex: Number(element.getAttribute('data-g4-source-index')),
            ariaPressed: element.getAttribute('aria-pressed'),
            disabled: Boolean(element.disabled),
            state: element.getAttribute('data-state'),
            semanticClasses: String(element.className ?? '')
              .split(/\s+/)
              .filter((token) => /(?:selected|picked|correct|right|wrong|error|disabled|tried)/i.test(token))
              .sort(),
          },
        };
      });
      const visibleButtons = [...owner.querySelectorAll('button')].filter(isVisible);
      const context = owner.closest('.question, [data-g4-screen], section, article') ?? owner.parentElement;
      const prompt = String(context?.querySelector('h2, h3, [data-g4-role~="hook-question"]')?.textContent ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      const semanticKey = JSON.stringify({
        prompt,
        options: [...entries]
          .sort((left, right) => left.sourceIndex - right.sourceIndex)
          .map(({ sourceIndex, correctFlag, semanticText }) => [sourceIndex, correctFlag, semanticText]),
      });
      return {
        order: entries.map((entry) => entry.sourceIndex),
        correctFlags: entries.map((entry) => entry.correctFlag),
        displayLabels: entries.map((entry) => entry.displayLabel),
        sourceTexts: [...entries]
          .sort((left, right) => left.sourceIndex - right.sourceIndex)
          .map((entry) => entry.semanticText),
        hasVisualChoice: entries.some((entry) => entry.visualChoice),
        naturalOrder: entries.every((entry) => entry.naturalOrder),
        states: entries.map((entry) => entry.state),
        semanticKey,
        answerButtonCount: visibleButtons.length,
      };
    });
  });
}

function answerOrderIdentity(groups) {
  return groups.map((group) => ({
    order: group.order,
    correctPosition: group.correctFlags.indexOf('true'),
  }));
}

function answerOrderStateIdentity(groups) {
  return groups.map((group) => ({
    order: group.order,
    correctPosition: group.correctFlags.indexOf('true'),
    states: group.states.map(({ sourceIndex, ariaPressed, disabled, state, semanticClasses }) => ({
      sourceIndex,
      ariaPressed,
      disabled,
      state,
      semanticClasses,
    })),
  }));
}

function validateAnswerOrderGroups(groups, issuePrefix) {
  groups.forEach((group, groupIndex) => {
    const length = group.order.length;
    if (length !== group.answerButtonCount) {
      throw new Error(
        `${issuePrefix}: ${groupIndex + 1}-variant guruhida ${group.answerButtonCount} ta karta, `
          + `ammo ${length} tasida source/correct marker bor`,
      );
    }
    const expected = Array.from({ length }, (_, index) => index);
    const sorted = [...group.order].sort((left, right) => left - right);
    if (JSON.stringify(sorted) !== JSON.stringify(expected)) {
      throw new Error(`${issuePrefix}: ${groupIndex + 1}-variant guruhi permutation emas (${group.order.join(',')})`);
    }
    if (group.correctFlags.some((flag) => flag !== 'true' && flag !== 'false')) {
      throw new Error(`${issuePrefix}: ${groupIndex + 1}-variant guruhida data-g4-correct qiymati noto'g'ri`);
    }
    if (group.correctFlags.filter((flag) => flag === 'true').length !== 1) {
      throw new Error(`${issuePrefix}: ${groupIndex + 1}-variant guruhida aynan bitta to'g'ri karta yo'q`);
    }
    const expectedLabels = Array.from({ length }, (_, index) => String.fromCharCode(65 + index));
    const labelledCards = group.displayLabels.filter(Boolean).length;
    const labelsRequired = [...REQUIRE_ALL_ANSWER_LABELS].some((file) => issuePrefix.includes(file));
    if (labelsRequired && labelledCards !== length) {
      throw new Error(
        `${issuePrefix}: ${groupIndex + 1}-variant guruhidagi barcha kartalarda A/B/C belgisi bo'lishi kerak`,
      );
    }
    if (labelledCards > 0 && JSON.stringify(group.displayLabels) !== JSON.stringify(expectedLabels)) {
      throw new Error(
        `${issuePrefix}: ${groupIndex + 1}-variant guruhi display label tartibi `
          + `${group.displayLabels.join(',')} (kutilgan ${expectedLabels.join(',')})`,
      );
    }
  });
}

async function auditVisibleAnswerOrders(page, issuePrefix) {
  const groups = await visibleAnswerOrderSnapshot(page);
  validateAnswerOrderGroups(groups, issuePrefix);
  answerOrderGroupsChecked += groups.length;
  return groups;
}

async function collectAnswerOrderGroupsDuring(page, issuePrefix, action) {
  const observed = new Map();
  let collecting = true;
  let pollingError = null;
  const capture = async () => {
    const groups = await visibleAnswerOrderSnapshot(page);
    validateAnswerOrderGroups(groups, issuePrefix);
    groups.forEach((group) => {
      if (!observed.has(group.semanticKey)) observed.set(group.semanticKey, group);
    });
  };

  await capture();
  const polling = (async () => {
    while (collecting) {
      await sleep(12);
      if (!collecting) break;
      try {
        await capture();
      } catch (error) {
        pollingError = error;
        collecting = false;
      }
    }
  })();

  try {
    await action();
    if (!pollingError) await capture();
  } finally {
    collecting = false;
    await polling;
  }
  if (pollingError) throw pollingError;
  const groups = [...observed.values()];
  answerOrderGroupsChecked += groups.length;
  return groups;
}

function assertBalancedVisibleAnswerPositions(groups, issuePrefix) {
  const byLength = new Map();
  groups.filter((group) => !group.naturalOrder).forEach((group) => {
    if (!byLength.has(group.order.length)) byLength.set(group.order.length, []);
    byLength.get(group.order.length).push(group.correctFlags.indexOf('true'));
  });
  byLength.forEach((positions, length) => {
    for (let start = 0; start < positions.length; start += length) {
      const block = positions.slice(start, start + length);
      if (new Set(block).size !== block.length) {
        throw new Error(
          `${issuePrefix}: ${length} variantli ${start / length + 1}-blok balanssiz (${block.join(',')})`,
        );
      }
    }
  });
}

function indexedAnswerRecords(payload) {
  const records = [];
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (Array.isArray(value.options) && Number.isInteger(value.correctIndex)) records.push(value);
    Object.values(value).forEach(visit);
  };
  visit(payload);
  return records;
}

function assertDisplayedOptionSourceAlignment(groups, payload, issuePrefix) {
  const records = indexedAnswerRecords(payload);
  let comparableGroups = 0;
  groups.forEach((group, groupIndex) => {
    const sourceTexts = group.sourceTexts.map((text) => normalizeText(text));
    const sortedSourceTexts = [...sourceTexts].sort();
    const correctSourceIndex = group.order[group.correctFlags.indexOf('true')];
    const candidate = records.find((record) => {
      if (record.options.length !== sourceTexts.length || record.correctIndex !== correctSourceIndex) return false;
      const optionTexts = record.options.map((option) => (
        typeof option === 'string' || typeof option === 'number' ? normalizeText(String(option)) : null
      ));
      return optionTexts.every((text) => text !== null)
        && JSON.stringify([...optionTexts].sort()) === JSON.stringify(sortedSourceTexts);
    });
    if (!candidate) return;
    comparableGroups += 1;
    const optionTexts = candidate.options.map((option) => normalizeText(String(option)));
    if (JSON.stringify(sourceTexts) !== JSON.stringify(optionTexts)) {
      throw new Error(
        `${issuePrefix}: ${groupIndex + 1}-savolda DOM matni sourceIndex bo'yicha payload options bilan mos emas`,
      );
    }
  });
  return comparableGroups;
}

async function theoryNextButton(page) {
  const buttons = inLesson(page, '.stage-nav button');
  const visible = [];
  const count = await buttons.count();
  for (let index = 0; index < count; index += 1) {
    const button = buttons.nth(index);
    if (await button.isVisible()) visible.push(button);
  }
  if (!visible.length) throw new Error('.stage-nav Next/Finish tugmasi topilmadi');
  return visible[visible.length - 1];
}

async function forceClick(button, clickCount = 1) {
  return button.evaluate((element, count) => {
    const propsKey = Object.keys(element).find((key) => key.startsWith('__reactProps$'));
    const handler = propsKey ? element[propsKey]?.onClick : null;
    if (typeof handler === 'function') {
      for (let attempt = 0; attempt < count; attempt += 1) {
        handler({
          currentTarget: element,
          target: element,
          preventDefault() {},
          stopPropagation() {},
        });
      }
      return true;
    }
    element.disabled = false;
    element.removeAttribute('disabled');
    for (let attempt = 0; attempt < count; attempt += 1) element.click();
    return false;
  }, clickCount);
}

async function invokeNearestReactCallback(button, callbackName, callCount = 1) {
  return button.evaluate((element, { name, count }) => {
    const fiberKey = Object.keys(element).find((key) => key.startsWith('__reactFiber$'));
    let fiber = fiberKey ? element[fiberKey] : null;
    while (fiber) {
      const callback = fiber.memoizedProps?.[name];
      if (typeof callback === 'function') {
        for (let attempt = 0; attempt < count; attempt += 1) callback();
        return true;
      }
      fiber = fiber.return;
    }
    return false;
  }, { name: callbackName, count: callCount });
}

async function clickEnabledTheoryButton(next, issuePrefix, allowDomFallback = true) {
  try {
    await next.click({ timeout: 1_500 });
  } catch (error) {
    const reason = normalizeText(error.message).split(' Call log:')[0];
    failures.push(issuePrefix + ': Next pointer interaction bloklandi: ' + reason);
    if (!allowDomFallback) throw new Error(issuePrefix + ': Next faqat haqiqiy pointer orqali bosilishi kerak');
    theoryGateFallbacks += 1;
    await next.evaluate((element) => element.click());
  }
}

async function matchingConnectorSnapshot(page) {
  return inLesson(page, '.matching-connector-correct').evaluateAll((nodes) => nodes.map((node) => ({
    d: node.getAttribute('d') ?? '',
    x1: node.getAttribute('x1') ?? '',
    y1: node.getAttribute('y1') ?? '',
    x2: node.getAttribute('x2') ?? '',
    y2: node.getAttribute('y2') ?? '',
  })));
}

async function matchingWrongConnectorSnapshot(page) {
  return inLesson(page, '.matching-connector-wrong').evaluateAll((nodes) => nodes.map((node) => ({
    d: node.getAttribute('d') ?? '',
    x1: node.getAttribute('x1') ?? '',
    y1: node.getAttribute('y1') ?? '',
    x2: node.getAttribute('x2') ?? '',
    y2: node.getAttribute('y2') ?? '',
  })));
}

async function matchingPendingConnectorSnapshot(page) {
  return inLesson(page, '.matching-connector-pending').evaluateAll((nodes) => nodes.map((node) => ({
    d: node.getAttribute('d') ?? '',
    x1: node.getAttribute('x1') ?? '',
    y1: node.getAttribute('y1') ?? '',
    x2: node.getAttribute('x2') ?? '',
    y2: node.getAttribute('y2') ?? '',
  })));
}

async function waitForDeferredMatchingPair(page, leftButton, rightButton, expectedCount, timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const endpointsConsumed = await leftButton.isDisabled().catch(() => false)
      && await rightButton.isDisabled().catch(() => false);
    const pending = await matchingPendingConnectorSnapshot(page);
    if (
      endpointsConsumed
      && pending.length === expectedCount
      && pending.every((line) => line.d || (line.x1 && line.y1 && line.x2 && line.y2))
    ) return true;
    await sleep(25);
  }
  return false;
}

async function waitForDeferredMatchingReset(page, timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const pendingCount = await inLesson(page, '.matching-connector-pending').count();
    const pairedCardCount = await inLesson(page, '.reading-match-paired').count();
    if (pendingCount === 0 && pairedCardCount === 0) return true;
    await sleep(25);
  }
  return false;
}

async function waitForMatchingOutcome(
  page,
  correctBefore,
  leftButton,
  rightButton,
  wrongBefore,
  timeout = 2_000,
) {
  const deadline = Date.now() + timeout;
  const wrongBeforeSignature = JSON.stringify(wrongBefore);
  while (Date.now() < deadline) {
    const leftDisabled = await leftButton.isDisabled().catch(() => false);
    const rightDisabled = await rightButton.isDisabled().catch(() => false);
    // Pair state commits before MatchingLines' requestAnimationFrame geometry.
    // Treat both consumed endpoints as the authoritative correct outcome so a
    // still-visible red connector from the previous attempt cannot win a race.
    if (leftDisabled && rightDisabled) return 'correct';
    const correctAfter = await inLesson(page, '.matching-connector-correct').count();
    if (correctAfter > correctBefore) return 'correct';
    const wrongAfter = await matchingWrongConnectorSnapshot(page);
    if (wrongAfter.length && JSON.stringify(wrongAfter) !== wrongBeforeSignature) return 'wrong';
    await sleep(25);
  }
  return null;
}

async function waitForMatchingGeometry(page, expectedCount, timeout = 5_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const lines = await matchingConnectorSnapshot(page);
    if (
      lines.length === expectedCount
      && lines.every((line) => line.d || (line.x1 && line.y1 && line.x2 && line.y2))
    ) return lines;
    await sleep(25);
  }
  return [];
}

async function captureDars10MainState(page) {
  const screen = await firstVisible(inLesson(page, '[data-qa-d10-screen]'));
  if (!screen) return null;
  return screen.evaluate((root) => {
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0
        && style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity || '1') > 0.05;
    };
    const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
    const heading = [
      '.screen-heading .lesson-kicker',
      '.screen-heading .title',
      '.screen-heading .heading-copy > p:last-child',
    ].map((selector) => {
      const element = root.querySelector(selector);
      return { selector, text: normalize(element?.textContent), visible: visible(element) };
    });
    const landmarkSelectors = [
      '[data-qa-tens-shift-proof]',
      '[data-qa-matching-flow]',
      '.matching-board',
      '.error-column',
      '[data-qa-column-board]',
      '.hook-scene',
      '.decomposition-board',
      '.numeric-card',
      '.zero-units-layout',
      '.sensor-scene',
      '.formula',
    ];
    const landmarks = landmarkSelectors.map((selector) => ({
      selector,
      visibleCount: [...root.querySelectorAll(selector)].filter(visible).length,
    })).filter((item) => item.visibleCount > 0);
    return {
      screen: root.getAttribute('data-qa-d10-screen'),
      heading,
      landmarks,
    };
  });
}

async function assertDars10MainStatePreserved(page, baseline, issuePrefix) {
  if (!baseline) return;
  const screen = await firstVisible(inLesson(
    page,
    `[data-qa-d10-screen="${baseline.screen}"]`,
  ));
  if (!screen) throw new Error(`${issuePrefix}: correctdan keyin Dars10 asosiy ekran DOMdan yo'qoldi`);
  const current = await captureDars10MainState(page);
  for (const expected of baseline.heading) {
    if (!expected.text || !expected.visible) continue;
    const actual = current?.heading.find((item) => item.selector === expected.selector);
    if (!actual?.visible || actual.text !== expected.text) {
      throw new Error(
        `${issuePrefix}: correctdan keyin asosiy heading yashirildi/o'zgardi `
          + `(${expected.selector}: "${expected.text}" -> "${actual?.text ?? ''}")`,
      );
    }
  }
  for (const expected of baseline.landmarks) {
    const actual = current?.landmarks.find((item) => item.selector === expected.selector);
    if ((actual?.visibleCount ?? 0) < expected.visibleCount) {
      throw new Error(
        `${issuePrefix}: correctdan keyin asosiy frame yashirildi `
          + `(${expected.selector}: ${expected.visibleCount} -> ${actual?.visibleCount ?? 0})`,
      );
    }
  }
  const feedbackContract = await screen.evaluate((root) => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      return element.getClientRects().length > 0
        && style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity || '1') > 0.05;
    };
    const feedbacks = [...root.querySelectorAll('[data-g4-feedback]')].filter(visible);
    const feedback = feedbacks[0] ?? null;
    const mainNodes = [...root.querySelectorAll(
      '[data-g4-role~="answer-card"], [data-qa-column-board], .numeric-card, .matching-board',
    )].filter(visible);
    return {
      count: feedbacks.length,
      kind: feedback?.getAttribute('data-g4-feedback') ?? '',
      followsMain: Boolean(feedback) && mainNodes.every((node) => (
        Boolean(node.compareDocumentPosition(feedback) & Node.DOCUMENT_POSITION_FOLLOWING)
      )),
    };
  });
  if (feedbackContract.count !== 1
    || feedbackContract.kind !== 'solution'
    || !feedbackContract.followsMain) {
    throw new Error(
      `${issuePrefix}: correctdan keyin faqat pastdagi Yechim framei qolmadi `
        + `(${JSON.stringify(feedbackContract)})`,
    );
  }
}

async function auditVisibleTheoryMatching(
  page,
  issuePrefix,
  lang = 'en',
  checkLanguageSwitch = true,
  checkResize = true,
) {
  const dars10MainState = await captureDars10MainState(page);
  const left = inLesson(page, '[data-match-left]');
  const right = inLesson(page, '[data-match-right]');
  const leftCount = await left.count();
  const rightCount = await right.count();
  if (!leftCount && !rightCount) return false;
  if (!leftCount || !rightCount) throw new Error(issuePrefix + ': matching endpointlarining ikki tomoni to‘liq emas');

  let wrongSeen = false;
  let correctSeen = false;
  const deferredCheck = inLesson(page, '[data-qa-matching-check="true"]');
  const usesDeferredCheck = await deferredCheck.count() > 0;

  if (usesDeferredCheck) {
    if (leftCount !== rightCount || leftCount < 2) {
      throw new Error(`${issuePrefix}: deferred matching to'liq juftliklar to'plamiga ega emas`);
    }
    if (await deferredCheck.isEnabled()) {
      throw new Error(`${issuePrefix}: Tekshirish uchala juftlikdan oldin faol`);
    }

    const leftIds = await left.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-match-left')));
    const rightIds = new Set(await right.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-match-right'))));
    const wrongRightIds = leftIds.map((_, index) => leftIds[(index + 1) % leftIds.length]);
    if (leftIds.some((id, index) => !id || !rightIds.has(wrongRightIds[index]) || id === wrongRightIds[index])) {
      throw new Error(`${issuePrefix}: noto'g'ri to'liq bijeksiya tuzib bo'lmadi`);
    }

    const connectDeferredPair = async (leftId, rightId, expectedCount, phase) => {
      const leftButton = inLesson(page, `[data-match-left="${leftId}"]`).first();
      const rightButton = inLesson(page, `[data-match-right="${rightId}"]`).first();
      if (!(await waitForEnabledLocator(leftButton, 5_000)) || !(await waitForEnabledLocator(rightButton, 5_000))) {
        throw new Error(`${issuePrefix}: ${phase} juftlik endpointi faol emas`);
      }
      await leftButton.focus();
      await leftButton.press('Enter');
      await rightButton.focus();
      await rightButton.press('Enter');
      if (!(await waitForDeferredMatchingPair(page, leftButton, rightButton, expectedCount))) {
        throw new Error(`${issuePrefix}: ${phase} juftlik pending connectorga o'tmadi`);
      }
    };

    for (let index = 0; index < leftIds.length; index += 1) {
      await connectDeferredPair(leftIds[index], wrongRightIds[index], index + 1, 'wrong');
      if (index < leftIds.length - 1 && await deferredCheck.isEnabled()) {
        throw new Error(`${issuePrefix}: Tekshirish ${index + 1}-juftlikdan keyin erta faollashdi`);
      }
    }
    if (!(await waitForEnabledLocator(deferredCheck))) {
      throw new Error(`${issuePrefix}: uchala juftlikdan keyin Tekshirish ochilmadi`);
    }
    await deferredCheck.click();
    if (!(await waitForDeferredMatchingReset(page))) {
      throw new Error(`${issuePrefix}: xato Tekshirishdan keyin barcha juftliklar tozalanmadi`);
    }
    await assertStrictFeedback(page, issuePrefix + ' deferred matching wrong', 'wrong', lang);
    await assertOuterNextLocked(page, issuePrefix + ' deferred matching wrong');
    if (await deferredCheck.isEnabled()) {
      throw new Error(`${issuePrefix}: resetdan keyin Tekshirish faol qolib ketdi`);
    }
    wrongSeen = true;

    for (let index = 0; index < leftIds.length; index += 1) {
      await connectDeferredPair(leftIds[index], leftIds[index], index + 1, 'correct');
      if (index < leftIds.length - 1 && await deferredCheck.isEnabled()) {
        throw new Error(`${issuePrefix}: qayta urinishda Tekshirish ${index + 1}-juftlikdan keyin erta faollashdi`);
      }
    }
    if (!(await waitForEnabledLocator(deferredCheck))) {
      throw new Error(`${issuePrefix}: qayta juftlashdan keyin Tekshirish ochilmadi`);
    }
    await deferredCheck.click();
    correctSeen = true;
  } else {
    // A wrong branch can trigger narration and a React rerender between the two
    // keyboard presses. Retry the still-enabled endpoints in bounded passes so
    // that this real async lifecycle cannot make the audit skip one pair.
    for (let pass = 0; pass < Math.max(2, leftCount); pass += 1) {
      for (let leftIndex = 0; leftIndex < leftCount; leftIndex += 1) {
        for (let rightIndex = 0; rightIndex < rightCount; rightIndex += 1) {
          const leftButton = left.nth(leftIndex);
          const rightButton = right.nth(rightIndex);
          if (!(await leftButton.isEnabled()) || !(await rightButton.isEnabled())) continue;
          const correctBefore = await inLesson(page, '.matching-connector-correct').count();
          const wrongBefore = await matchingWrongConnectorSnapshot(page);
          await leftButton.focus();
          await leftButton.press('Enter');
          await rightButton.focus();
          await rightButton.press('Enter');
          const outcome = await waitForMatchingOutcome(
            page,
            correctBefore,
            leftButton,
            rightButton,
            wrongBefore,
          );
          if (!outcome) throw new Error(`${issuePrefix}: matching tanlovi connector holatiga o'tmadi`);
          wrongSeen ||= outcome === 'wrong';
          const connected = outcome === 'correct';
          correctSeen ||= connected;
          if (connected) break;
        }
      }
      if (await inLesson(page, '.matching-connector-correct').count() >= Math.min(leftCount, rightCount)) break;
      await sleep(50);
    }
  }
  if (!correctSeen) throw new Error(issuePrefix + ': keyboard orqali to‘g‘ri matching connector hosil bo‘lmadi');
  if (rightCount > 1 && !wrongSeen) throw new Error(issuePrefix + ': noto‘g‘ri juft uchun vaqtinchalik qizil connector ko‘rinmadi');

  const expectedConnectors = Math.min(leftCount, rightCount);
  const completedGeometry = await waitForMatchingGeometry(page, expectedConnectors);
  if (completedGeometry.length !== expectedConnectors) {
    const completedConnectors = await inLesson(page, '.matching-connector-correct').count();
    const endpointState = await inLesson(page, '[data-match-left],[data-match-right]').evaluateAll((items) => items.map((item) => ({
      side: item.hasAttribute('data-match-left') ? 'left' : 'right',
      index: item.getAttribute('data-match-left') ?? item.getAttribute('data-match-right'),
      disabled: item.disabled,
      pressed: item.getAttribute('aria-pressed'),
      className: item.className,
    })));
    throw new Error(`${issuePrefix}: matching ${completedConnectors}/${expectedConnectors} juftda to'xtadi; endpoints=${JSON.stringify(endpointState)}`);
  }
  await assertStrictFeedback(page, issuePrefix + ' completed matching', 'solution', lang);
  await assertDars10MainStatePreserved(page, dars10MainState, issuePrefix + ' completed matching');
  if (!(await waitForEnabledLocator(await theoryNextButton(page)))) {
    throw new Error(issuePrefix + ': matching tugagach Next ochilmadi');
  }

  const beforeResize = await matchingConnectorSnapshot(page);
  if (!beforeResize.length || beforeResize.some((line) => !line.d && !(line.x1 && line.y1 && line.x2 && line.y2))) {
    throw new Error(issuePrefix + ': connector real SVG geometriyasiga ega emas');
  }
  const originalViewport = page.viewportSize();
  if (checkResize && originalViewport) {
    const resizeViewport = originalViewport.width === 1024
      ? { width: 1366, height: 768 }
      : { width: 1024, height: 768 };
    await page.setViewportSize(resizeViewport);
    if (!(await waitForMatchingGeometry(page, beforeResize.length)).length) {
      throw new Error(issuePrefix + ': resize matching connectorni yo‘qotdi');
    }
    await page.setViewportSize(originalViewport);
    if (!(await waitForMatchingGeometry(page, beforeResize.length)).length) {
      throw new Error(issuePrefix + ': original viewportga qaytganda connector tiklanmadi');
    }
  }

  const beforeLanguage = (await currentScreenCount(page)).text;
  const ru = await lessonLanguageControl(page, 'ru');
  if (checkLanguageSwitch && await ru.button.count()) {
    await switchLessonLanguage(page, 'ru');
    await switchLessonLanguage(page, 'en');
    if ((await currentScreenCount(page)).text !== beforeLanguage) {
      throw new Error(issuePrefix + ': til almashganda matching ekran holati yo‘qoldi');
    }
    if (!(await matchingConnectorSnapshot(page)).length) {
      throw new Error(issuePrefix + ': til almashganda connector qayta hisoblanmadi');
    }
  }
  matchingBranchScreensChecked += 1;
  return true;
}

async function waitForVisibleMatch(locator, timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const visible = await firstVisible(locator);
    if (visible) return visible;
    await sleep(25);
  }
  return null;
}

async function waitForEnabledLocator(locator, timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await locator.isEnabled().catch(() => false)) return true;
    await sleep(25);
  }
  return false;
}

async function pointerCanReach(locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    if (style.pointerEvents === 'none') return false;
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return Boolean(hit && (hit === element || element.contains(hit)));
  });
}

async function visibleTheoryButtonDiagnostics(page) {
  return inLesson(page, 'button').evaluateAll((elements) => elements
    .filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return !element.disabled && style.visibility !== 'hidden' && style.display !== 'none'
        && rect.width > 0 && rect.height > 0
        && !element.closest('.stage-nav, .audio-controls, .lesson-language, .preview-language, .g4-title-claim');
    })
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return {
        text: element.innerText.trim(),
        className: element.className,
        pointerEvents: getComputedStyle(element).pointerEvents,
        rect: [Math.round(rect.left), Math.round(rect.top), Math.round(rect.width), Math.round(rect.height)],
        hit: hit ? `${hit.tagName.toLowerCase()}.${String(hit.className || '').trim().replace(/\s+/g, '.')}` : null,
      };
    }));
}

async function waitForDisabledLocator(locator, timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await locator.isDisabled().catch(() => false)) return true;
    await sleep(25);
  }
  return false;
}

async function waitForAttributeValue(locator, name, expected, timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await locator.getAttribute(name).catch(() => null) === String(expected)) return true;
    await sleep(25);
  }
  return false;
}

async function waitForJsonAttribute(locator, name, predicate, timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const raw = await locator.getAttribute(name).catch(() => null);
    if (raw !== null) {
      try {
        const value = JSON.parse(raw);
        if (predicate(value)) return value;
      } catch {
        // The marker may be between React commits; keep polling until stable.
      }
    }
    await sleep(25);
  }
  return null;
}

async function waitForClassToken(locator, token, timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const className = await locator.getAttribute('class').catch(() => '');
    if (String(className).split(/\s+/).includes(token)) return true;
    await sleep(25);
  }
  return false;
}

async function waitForLocatorCount(locator, expected, timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await locator.count() === expected) return true;
    await sleep(25);
  }
  return false;
}

async function waitForAttached(locator, timeout = 2_000) {
  try {
    await locator.first().waitFor({ state: 'attached', timeout });
    return true;
  } catch {
    return false;
  }
}

async function waitForNumericSubmit(input, timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const submit = await nearestNumericSubmit(input);
    if (submit) return submit;
    await sleep(25);
  }
  return null;
}

async function assertOuterNextLocked(page, issuePrefix) {
  if (!THEORY_CONTINUE_UNLOCKED && await (await theoryNextButton(page)).isEnabled()) {
    throw new Error(`${issuePrefix}: ichki faoliyat tugamasidan outer Next ochildi`);
  }
}

async function visibleRoundingLineRoot(page, flow = null, timeout = 2_000) {
  const selector = flow
    ? `[data-qa-rounding-flow="${flow}"][data-qa-rounding-step]`
    : '[data-qa-rounding-flow][data-qa-rounding-step]';
  return waitForVisibleMatch(inLesson(page, selector), timeout);
}

async function assertRoundingLineStep(root, expectedStep, issuePrefix, timeout = 2_000) {
  if (!await waitForAttributeValue(root, 'data-qa-rounding-step', expectedStep, timeout)) {
    const actual = await root.getAttribute('data-qa-rounding-step').catch(() => null);
    throw new Error(`${issuePrefix}: rounding step ${actual ?? 'yo\'q'}, kutilgan ${expectedStep}`);
  }
}

async function visibleRoundingFeedback(page, kind, timeout = 2_000) {
  return waitForVisibleMatch(inLesson(page, `[data-g4-feedback="${kind}"]`), timeout);
}

async function assertRoundingLineVisualContract(root, flow, issuePrefix) {
  const line = await waitForVisibleMatch(root.locator('.rounding-number-line'), 4_000);
  if (!line) throw new Error(`${issuePrefix}: sonlar o'qi ko'rinmadi`);

  const result = await line.evaluate((element, flowName) => {
    const visible = (node) => {
      if (!node) return false;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity || '1') > 0.01
        && rect.width > 0
        && rect.height > 0;
    };
    const rgba = (value) => {
      const match = String(value).match(/rgba?\((\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)(?:[, /]+(\d+(?:\.\d+)?))?\)/i);
      return match
        ? { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]), a: match[4] === undefined ? 1 : Number(match[4]) }
        : null;
    };
    const lineStyle = getComputedStyle(element);
    const lineColour = rgba(lineStyle.backgroundColor);
    const endpoints = flowName === 'practice'
      ? [...element.querySelectorAll('button[data-g4-branch="line-point"]')]
      : [];

    return {
      lineColour,
      endpointCount: endpoints.length,
      endpoints: endpoints.map((button) => {
        const style = getComputedStyle(button);
        const rect = button.getBoundingClientRect();
        const dot = button.querySelector('i');
        const dotStyle = dot ? getComputedStyle(dot) : null;
        const dotRect = dot?.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          background: rgba(style.backgroundColor),
          backgroundImage: style.backgroundImage,
          borderWidths: [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth]
            .map((value) => Number.parseFloat(value) || 0),
          boxShadow: style.boxShadow,
          dotVisible: visible(dot),
          dotWidth: dotRect?.width ?? 0,
          dotHeight: dotRect?.height ?? 0,
          dotColour: dotStyle ? rgba(dotStyle.backgroundColor) : null,
        };
      }),
    };
  }, flow);

  const colour = result.lineColour;
  const lightBlue = colour
    && colour.a >= 0.75
    && colour.r >= 190
    && colour.g >= 210
    && colour.b >= 210
    && Math.max(colour.g, colour.b) >= colour.r + 5;
  if (!lightBlue) {
    const shown = colour ? `${colour.r},${colour.g},${colour.b},${colour.a}` : 'parse bo\'lmadi';
    throw new Error(`${issuePrefix}: ${flow} sonlar o'qi och ko'k frame emas (${shown})`);
  }

  if (flow !== 'practice') return;
  if (result.endpointCount !== 2) {
    throw new Error(`${issuePrefix}: practice endpoint visual kontrakti uchun 2 ta tugma kerak, ${result.endpointCount} topildi`);
  }
  result.endpoints.forEach((endpoint, index) => {
    if (endpoint.width < 44 || endpoint.height < 44) {
      throw new Error(`${issuePrefix}: practice endpoint ${index + 1} hit-area ${endpoint.width.toFixed(1)}×${endpoint.height.toFixed(1)}, kamida 44×44 kerak`);
    }
    const opaqueButton = endpoint.background && endpoint.background.a > 0.05;
    const hasCardChrome = opaqueButton
      || endpoint.backgroundImage !== 'none'
      || endpoint.borderWidths.some((width) => width > 0.5)
      || endpoint.boxShadow !== 'none';
    if (hasCardChrome) {
      throw new Error(`${issuePrefix}: practice endpoint ${index + 1} hit-area kartochka bo'lib ko'rinmoqda; fon, border va shadow shaffof bo'lishi kerak`);
    }
    if (!endpoint.dotVisible || endpoint.dotWidth < 10 || endpoint.dotHeight < 10 || !endpoint.dotColour || endpoint.dotColour.a < 0.5) {
      throw new Error(`${issuePrefix}: practice endpoint ${index + 1} da ko'rinadigan nuqta yo'q`);
    }
  });
}

async function assertRoundingSolutionFeedback(feedback, lang, issuePrefix) {
  const expectedLabel = { uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' }[lang] ?? 'SOLUTION';
  const result = await feedback.evaluate((element) => {
    const visible = (node) => {
      if (!node) return false;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity || '1') > 0.01
        && rect.width > 0
        && rect.height > 0;
    };
    const bit = element.querySelector('.g1-char-bit');
    const label = [...element.querySelectorAll('strong,[data-g4-role="feedback-label"]')].find(visible);
    return {
      bitVisible: visible(bit),
      bitWidth: bit?.getBoundingClientRect().width ?? 0,
      bitHeight: bit?.getBoundingClientRect().height ?? 0,
      label: label?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    };
  });
  if (!result.bitVisible || result.bitWidth < 20 || result.bitHeight < 20) {
    throw new Error(`${issuePrefix}: correct feedback ichida ko'rinadigan Bit yo'q`);
  }
  if (result.label.toLocaleUpperCase(lang === 'en' ? 'en-GB' : lang).trim() !== expectedLabel) {
    throw new Error(`${issuePrefix}: correct feedback labeli “${result.label || 'yo\'q'}”, kutilgan “${expectedLabel}”`);
  }
}

async function auditVisibleRoundingLineFlow(page, issuePrefix, { auditWrong = false, lang = 'en' } = {}) {
  const root = await visibleRoundingLineRoot(page);
  if (!root) return false;

  const flow = await root.getAttribute('data-qa-rounding-flow');
  if (flow !== 'guided' && flow !== 'practice') {
    throw new Error(`${issuePrefix}: rounding flow ${flow ?? 'yo\'q'} noto'g'ri`);
  }
  const initialStep = Number(await root.getAttribute('data-qa-rounding-step'));
  if (!Number.isInteger(initialStep) || initialStep < 0 || initialStep > 2) {
    throw new Error(`${issuePrefix}: rounding boshlang'ich step ${initialStep} noto'g'ri`);
  }

  for (let step = initialStep; step < 3; step += 1) {
    await assertRoundingLineStep(root, step, `${issuePrefix} ${flow}`, 4_000);
    await assertRoundingLineVisualContract(root, flow, `${issuePrefix} ${flow} ${step + 1}-qadam`);
    const outerNext = await theoryNextButton(page);

    if (flow === 'guided') {
      const equation = await waitForVisibleMatch(root.locator('[data-qa-rounding-equation]'), 4_000);
      if (!equation) throw new Error(`${issuePrefix}: guided ${step + 1}-qadam tengligi ochilmadi`);

      if (step < 2) {
        await assertOuterNextLocked(page, `${issuePrefix} guided ${step + 1}-qadam`);
        const innerNext = await waitForVisibleMatch(root.locator('[data-qa-rounding-next]:not(:disabled)'), 4_000);
        if (!innerNext) throw new Error(`${issuePrefix}: guided ${step + 1}-qadam ichki Next ochilmadi`);
        await innerNext.click();
        await assertRoundingLineStep(root, step + 1, `${issuePrefix} guided transition`, 4_000);
      } else if (!(await waitForEnabledLocator(outerNext, 4_000))) {
        throw new Error(`${issuePrefix}: guided uchinchi qadamdan keyin outer Next ochilmadi`);
      }
      continue;
    }

    const endpoints = root.locator('button[data-g4-branch="line-point"]');
    if (!await waitForAttached(endpoints, 4_000)) {
      throw new Error(`${issuePrefix}: practice ${step + 1}-qadam endpointlari topilmadi`);
    }
    const endpointCount = await endpoints.count();
    const correct = root.locator('button[data-g4-branch="line-point"][data-g4-correct="true"]');
    const wrong = root.locator('button[data-g4-branch="line-point"][data-g4-correct="false"]');
    const correctCount = await correct.count();
    const wrongCount = await wrong.count();
    if (endpointCount !== 2 || correctCount !== 1 || wrongCount !== 1) {
      throw new Error(
        `${issuePrefix}: practice ${step + 1}-qadam endpoint semantikasi `
          + `correct=${correctCount}, wrong=${wrongCount}, total=${endpointCount}`,
      );
    }

    const existingSolution = await firstVisible(inLesson(page, '[data-g4-feedback="solution"]'));
    const existingEquation = await firstVisible(root.locator('[data-qa-rounding-equation]'));
    const alreadySolved = Boolean(existingSolution && existingEquation);

    if (!alreadySolved && auditWrong) {
      if (!(await waitForEnabledLocator(wrong.first(), 4_000))) {
        throw new Error(`${issuePrefix}: practice ${step + 1}-qadam wrong endpoint faol emas`);
      }
      await wrong.first().click();
      await assertRoundingLineStep(root, step, `${issuePrefix} practice wrong`, 4_000);
      await assertOuterNextLocked(page, `${issuePrefix} practice ${step + 1}-qadam wrong`);
      if (!await visibleRoundingFeedback(page, 'wrong', 4_000)) {
        throw new Error(`${issuePrefix}: practice ${step + 1}-qadam wrong feedback ko'rinmadi`);
      }
      await assertRoundingLineVisualContract(root, flow, `${issuePrefix} practice ${step + 1}-qadam wrong`);
    }

    if (!alreadySolved) {
      if (!(await waitForEnabledLocator(correct.first(), 4_000))) {
        throw new Error(`${issuePrefix}: practice ${step + 1}-qadam correct endpoint faol emas`);
      }
      await correct.first().click();
    }
    const solutionFeedback = await visibleRoundingFeedback(page, 'solution', 4_000);
    if (!solutionFeedback) {
      throw new Error(`${issuePrefix}: practice ${step + 1}-qadam solution feedback ko'rinmadi`);
    }
    await assertRoundingSolutionFeedback(solutionFeedback, lang, `${issuePrefix} practice ${step + 1}-qadam`);
    await assertRoundingLineVisualContract(root, flow, `${issuePrefix} practice ${step + 1}-qadam solution`);
    if (!await waitForVisibleMatch(root.locator('[data-qa-rounding-equation]'), 4_000)) {
      throw new Error(`${issuePrefix}: practice ${step + 1}-qadam tengligi ochilmadi`);
    }

    if (step < 2) {
      await assertOuterNextLocked(page, `${issuePrefix} practice ${step + 1}-qadam solved`);
      const innerNext = await waitForVisibleMatch(root.locator('[data-qa-rounding-next]:not(:disabled)'), 4_000);
      if (!innerNext) throw new Error(`${issuePrefix}: practice ${step + 1}-qadam ichki Next ochilmadi`);
      await innerNext.click();
      await assertRoundingLineStep(root, step + 1, `${issuePrefix} practice transition`, 4_000);
    } else if (!(await waitForEnabledLocator(outerNext, 4_000))) {
      throw new Error(`${issuePrefix}: practice uchinchi qadamdan keyin outer Next ochilmadi`);
    }
  }

  roundingLineScreensChecked += 1;
  return true;
}

const strictFeedbackSelector = (kind) => kind === 'solution'
  ? '[data-g4-feedback="solution"], [data-g4-feedback="correct"]'
  : `[data-g4-feedback="${kind}"]`;

const canonicalFeedbackKind = (kind) => kind === 'correct' ? 'solution' : kind;

async function assertStrictFeedback(
  page,
  issuePrefix,
  kind,
  lang,
  { requireBit = true, requireSolutionLabel = true } = {},
) {
  const feedback = await waitForVisibleMatch(inLesson(page, strictFeedbackSelector(kind)));
  if (!feedback) throw new Error(`${issuePrefix}: ${kind} feedback ko'rinmadi`);
  const settleDeadline = Date.now() + 1_000;
  let feedbackSettled = false;
  while (Date.now() < settleDeadline) {
    feedbackSettled = await feedback.evaluate((element) => {
      const style = getComputedStyle(element);
      const bit = element.querySelector('[data-g4-role~="feedback-bit"]');
      const bitStyle = bit ? getComputedStyle(bit) : null;
      return Number.parseFloat(style.opacity || '1') >= 0.95
        && style.visibility !== 'hidden'
        && (!bitStyle || (Number.parseFloat(bitStyle.opacity || '1') >= 0.95 && bitStyle.visibility !== 'hidden'));
    }).catch(() => false);
    if (feedbackSettled) break;
    await sleep(25);
  }
  if (!feedbackSettled) throw new Error(`${issuePrefix}: ${kind} feedback animatsiyadan keyin to'liq ko'rinmadi`);
  if (requireBit) {
    let currentFeedback = feedback;
    const bit = await waitForVisibleMatch(currentFeedback.locator('[data-g4-role~="feedback-bit"]'));
    if (!bit) throw new Error(`${issuePrefix}: ${kind} feedbackda Bit yo'q`);
    const readVisual = (element, feedbackKind) => {
      const bitElement = element.querySelector('[data-g4-role~="feedback-bit"]');
      const bitGraphic = bitElement?.matches('svg') ? bitElement : bitElement?.querySelector('svg');
      const style = getComputedStyle(element);
      const bitRect = bitElement?.getBoundingClientRect();
      const bitGraphicRect = bitGraphic?.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      const stageContent = element.closest('.stage-content');
      const stageRect = stageContent?.getBoundingClientRect() ?? null;
      const layout = element.closest('.test-layout');
      const layoutRect = layout?.getBoundingClientRect() ?? null;
      const questionRect = element.closest('.question')?.getBoundingClientRect() ?? null;
      const feedbackSlotRect = element.closest('.feedback-slot')?.getBoundingClientRect() ?? null;
      const feedbackStackRect = element.closest('.feedback-stack')?.getBoundingClientRect() ?? null;
      const navRect = element.closest('.stage')?.querySelector('.stage-nav')?.getBoundingClientRect() ?? null;
      const innerCard = element.querySelector(':scope > .feedback-card');
      const innerCardRect = innerCard?.getBoundingClientRect() ?? null;
      const comment = element.matches('[data-g4-role~="bit-answer-comment"]');
      const generic = element.matches('[data-g4-role~="feedback-frame"]')
        || Boolean(element.querySelector('[data-g4-role~="feedback-frame"]'));
      const visible = (target) => {
        if (!target) return false;
        const targetRect = target.getBoundingClientRect();
        const targetStyle = getComputedStyle(target);
        return targetRect.width > 0 && targetRect.height > 0
          && targetStyle.display !== 'none' && targetStyle.visibility !== 'hidden'
          && Number.parseFloat(targetStyle.opacity || '1') > 0.05;
      };
      const outsideFrame = [];
      for (const target of element.querySelectorAll('p,span,strong,small,b,label')) {
        if (!visible(target) || target.closest('.sr-only,[aria-hidden="true"]')) continue;
        const hasDirectText = [...target.childNodes]
          .some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
        if (!hasDirectText) continue;
        const targetRect = target.getBoundingClientRect();
        if (targetRect.left < rect.left - 2 || targetRect.right > rect.right + 2
          || targetRect.top < rect.top - 2 || targetRect.bottom > rect.bottom + 2) {
          outsideFrame.push(`${target.tagName.toLowerCase()} ${Math.round(targetRect.left)}/${Math.round(targetRect.top)}/${Math.round(targetRect.width)}/${Math.round(targetRect.height)}`);
        }
      }
      const optionOverlaps = [];
      for (const option of element.closest('.stage-content')?.querySelectorAll('button.option,button[data-g4-role~="answer-card"]') ?? []) {
        if (!visible(option) || element.contains(option)) continue;
        const optionRect = option.getBoundingClientRect();
        const overlapX = Math.min(rect.right, optionRect.right) - Math.max(rect.left, optionRect.left);
        const overlapY = Math.min(rect.bottom, optionRect.bottom) - Math.max(rect.top, optionRect.top);
        if (overlapX > 2 && overlapY > 2) optionOverlaps.push(Math.round(overlapX) + '×' + Math.round(overlapY));
      }
      const visibleBottom = Math.min(innerHeight, stageRect?.bottom ?? innerHeight, navRect?.top ?? innerHeight);
      const visibleTop = Math.max(0, stageRect?.top ?? 0);
      return {
        feedbackKind,
        comment,
        generic,
        mobile: innerWidth < 640,
        width: bitRect?.width ?? 0,
        height: bitRect?.height ?? 0,
        graphicWidth: bitGraphicRect?.width ?? 0,
        graphicHeight: bitGraphicRect?.height ?? 0,
        frameHeight: rect.height,
        frameWidth: rect.width,
        frameLeft: rect.left,
        frameRight: rect.right,
        frameTop: rect.top,
        frameBottom: rect.bottom,
        visibleLeft: stageRect?.left ?? 0,
        visibleRight: stageRect?.right ?? innerWidth,
        layoutRect: layoutRect
          ? [layoutRect.left, layoutRect.right, layoutRect.top, layoutRect.bottom]
          : null,
        layoutColumns: layout ? getComputedStyle(layout).gridTemplateColumns : null,
        questionRect: questionRect
          ? [questionRect.left, questionRect.right, questionRect.top, questionRect.bottom]
          : null,
        feedbackSlotRect: feedbackSlotRect
          ? [feedbackSlotRect.left, feedbackSlotRect.right, feedbackSlotRect.top, feedbackSlotRect.bottom]
          : null,
        feedbackStackRect: feedbackStackRect
          ? [feedbackStackRect.left, feedbackStackRect.right, feedbackStackRect.top, feedbackStackRect.bottom]
          : null,
        visibleTop,
        visibleBottom,
        radius: Number.parseFloat(style.borderTopLeftRadius || '0'),
        background: style.backgroundImage,
        innerCardWidth: innerCardRect?.width ?? null,
        fullyInStage: rect.left >= (stageRect?.left ?? 0) - 2
          && rect.right <= (stageRect?.right ?? innerWidth) + 2
          && rect.top >= visibleTop - 2
          && rect.bottom <= visibleBottom + 2,
        outsideFrame,
        optionOverlaps,
      };
    };
    const geometryDeadline = Date.now() + 1_000;
    let visual;
    while (Date.now() < geometryDeadline) {
      const latestFeedback = await firstVisible(inLesson(page, strictFeedbackSelector(kind)));
      if (latestFeedback) currentFeedback = latestFeedback;
      visual = await currentFeedback.evaluate(readVisual, kind);
      const expected = kind === 'solution'
        ? (visual.mobile ? { width: 47, height: 59, minHeight: 68, radius: 15 } : { width: 51, height: 64, minHeight: 72, radius: 15 })
        : (visual.mobile ? { width: 54, height: 68, minHeight: 88, radius: 18 } : { width: 62, height: 76, minHeight: 88, radius: 18 });
      if (Math.abs(visual.width - expected.width) <= 1.1
        && Math.abs(visual.height - expected.height) <= 1.1
        && Math.abs(visual.graphicWidth - expected.width) <= 1.1
        && Math.abs(visual.graphicHeight - expected.height) <= 1.1
        && visual.frameHeight + 1 >= expected.minHeight
        && Math.abs(visual.radius - expected.radius) <= 1.1
        && visual.fullyInStage
        && visual.outsideFrame.length === 0
        && visual.optionOverlaps.length === 0) break;
      await sleep(20);
    }
    if (!visual.comment && !visual.generic) {
      throw new Error(`${issuePrefix}: ${kind} feedback-frame/bit-answer-comment markeri yo'q`);
    }
    const expected = kind === 'solution'
      ? (visual.mobile ? { width: 47, height: 59, minHeight: 68, radius: 15 } : { width: 51, height: 64, minHeight: 72, radius: 15 })
      : (visual.mobile ? { width: 54, height: 68, minHeight: 88, radius: 18 } : { width: 62, height: 76, minHeight: 88, radius: 18 });
    if (Math.abs(visual.width - expected.width) > 1.1
      || Math.abs(visual.height - expected.height) > 1.1
      || Math.abs(visual.graphicWidth - expected.width) > 1.1
      || Math.abs(visual.graphicHeight - expected.height) > 1.1
      || visual.frameHeight + 1 < expected.minHeight
      || Math.abs(visual.radius - expected.radius) > 1.1) {
      throw new Error(`${issuePrefix}: ${kind} feedback geometriyasi Bit wrapper ${visual.width}×${visual.height}, SVG ${visual.graphicWidth}×${visual.graphicHeight}, frame ${visual.frameHeight}px/r${visual.radius}`);
    }
    const expectedGradient = kind === 'wrong'
      ? /linear-gradient\(135deg, rgb\(255, 255, 255\), rgb\(255, 245, 217\)\)/
      : /linear-gradient\(135deg, rgb\(255, 255, 255\), rgb\(231, 243, 236\)\)/;
    if (!expectedGradient.test(visual.background)) {
      throw new Error(`${issuePrefix}: ${kind} feedback etalon gradienti yo'q`);
    }
    if (visual.frameWidth < (visual.mobile ? 260 : 400)) {
      throw new Error(`${issuePrefix}: ${kind} feedback frame eni ${visual.frameWidth}px`);
    }
    if (visual.innerCardWidth !== null && visual.innerCardWidth + 4 < visual.frameWidth) {
      throw new Error(`${issuePrefix}: ${kind} ichki feedback-card eni ${visual.innerCardWidth}/${visual.frameWidth}px`);
    }
    if (!visual.fullyInStage) {
      throw new Error(
        `${issuePrefix}: ${kind} feedback stage/nav ko'rinadigan hududidan chiqdi `
          + `(frame ${Math.round(visual.frameLeft)}–${Math.round(visual.frameRight)} × `
          + `${Math.round(visual.frameTop)}–${Math.round(visual.frameBottom)}, `
          + `visible ${Math.round(visual.visibleLeft)}–${Math.round(visual.visibleRight)} × `
          + `${Math.round(visual.visibleTop)}–${Math.round(visual.visibleBottom)}; `
          + `layout ${JSON.stringify(visual.layoutRect)}/${visual.layoutColumns}; `
          + `question ${JSON.stringify(visual.questionRect)}; `
          + `slot ${JSON.stringify(visual.feedbackSlotRect)}; `
          + `stack ${JSON.stringify(visual.feedbackStackRect)})`,
      );
    }
    if (visual.outsideFrame.length) {
      throw new Error(`${issuePrefix}: ${kind} feedback matni framedan chiqdi: ${visual.outsideFrame.join(', ')}`);
    }
    if (visual.optionOverlaps.length) {
      throw new Error(`${issuePrefix}: ${kind} feedback ko'rinadigan variant bilan ustma-ust: ${visual.optionOverlaps.join(', ')}`);
    }
  }
  const textDeadline = Date.now() + 250;
  let feedbackText = '';
  while (Date.now() < textDeadline) {
    feedbackText = normalizeText(await feedback.innerText().catch(() => ''));
    if (feedbackText) break;
    await sleep(20);
  }
  if (!feedbackText) throw new Error(`${issuePrefix}: ${kind} feedback matni bo'sh`);
  // Newer families use the explicit semantic value `solution` and include a
  // visible label. Dars12–17 use the approved equivalent `correct`; their
  // localized explanatory sentence is the visible solution text.
  if (
    kind === 'solution'
    && requireSolutionLabel
    && await feedback.getAttribute('data-g4-feedback') === 'solution'
  ) {
    const label = { uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' }[lang];
    if (!feedbackText.toUpperCase().includes(label)) {
      throw new Error(`${issuePrefix}: ${lang} solution label ${label} yo'q`);
    }
  }
  if (SCREENSHOT_DIR && lang === 'en') {
    const activeLesson = lessons.find((lesson) => page.url().includes(`/${lesson.slug}`));
    const viewport = page.viewportSize();
    const viewportName = ALL_VIEWPORTS.find((item) => (
      item.width === viewport?.width && item.height === viewport?.height
    ))?.name;
    if (activeLesson && REVIEW_LESSONS.has(activeLesson.file)
      && ['compact-mobile', 'mobile', 'desktop'].includes(viewportName)) {
      const key = `${activeLesson.file}:${viewportName}:${kind}`;
      if (!feedbackScreenshotKeys.has(key)) {
        feedbackScreenshotKeys.add(key);
        await page.screenshot({
          path: path.join(
            SCREENSHOT_DIR,
            `${activeLesson.file.replace('.jsx', '')}-en-${viewportName}-${kind}-feedback.png`,
          ),
        });
      }
    }
  }
  return feedbackText;
}

async function waitForStrictFeedbackChange(page, issuePrefix, kind, lang, previousText = '', timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const feedback = await firstVisible(inLesson(page, strictFeedbackSelector(kind)));
    if (feedback) {
      const currentText = normalizeText(await feedback.innerText());
      if (currentText && currentText !== previousText) {
        return assertStrictFeedback(page, issuePrefix, kind, lang);
      }
    }
    await sleep(25);
  }
  throw new Error(`${issuePrefix}: ${kind} feedback oldingi branchdan yangilanmadi`);
}

async function auditVisibleRapidConsole(page, issuePrefix, lang, { auditWrong = true, startRound = 0 } = {}) {
  const consoleRoot = await firstVisible(inLesson(page, '[data-qa-rapid-console]'));
  if (!consoleRoot) return false;
  const expectedUnits = Number(await consoleRoot.getAttribute('data-qa-score-units'));
  const stepCount = Number(await consoleRoot.getAttribute('data-qa-step-count'));
  if (expectedUnits !== 1 || stepCount !== 1) {
    throw new Error(`${issuePrefix}: rapid score/step unit ${expectedUnits}/${stepCount}, kutilgan 1/1`);
  }
  if (!Number.isInteger(startRound) || startRound < 0 || startRound >= expectedUnits) {
    throw new Error(`${issuePrefix}: rapid start round ${startRound} noto'g'ri`);
  }

  for (let round = startRound; round < expectedUnits; round += 1) {
    const panel = await waitForVisibleMatch(inLesson(page, `[data-qa-rapid-round="${round}"]`));
    if (!panel) throw new Error(`${issuePrefix}: rapid ${round + 1}-raund ko'rinmadi`);
    const choices = panel.locator('[data-g4-branch="choice"]');
    const choiceCount = await choices.count();
    if (round < expectedUnits - 1 && choiceCount === 0) {
      throw new Error(`${issuePrefix}: rapid ${round + 1} choice raundi emas`);
    }
    if (round === expectedUnits - 1 && choiceCount > 0) {
      throw new Error(`${issuePrefix}: rapid ${round + 1}-raund numeric input bo'lishi kerak`);
    }
    if (choiceCount) {
      await waitForEnabledCard(choices);
      const correct = panel.locator('[data-g4-branch="choice"][data-g4-correct="true"]');
      const wrong = panel.locator('[data-g4-branch="choice"][data-g4-correct="false"]');
      const wrongCount = await wrong.count();
      if (await correct.count() !== 1 || wrongCount < 1) {
        throw new Error(`${issuePrefix}: rapid ${round + 1} correct/wrong metadata to'liq emas`);
      }

      if (auditWrong) {
        const wrongFeedbacks = new Set();
        for (let wrongIndex = 0; wrongIndex < wrongCount; wrongIndex += 1) {
          const option = wrong.nth(wrongIndex);
          if (!(await option.isEnabled())) {
            throw new Error(`${issuePrefix}: rapid ${round + 1} wrong ${wrongIndex + 1} retryda bloklangan`);
          }
          await option.click();
          if (!(await waitForDisabledLocator(option))) {
            throw new Error(`${issuePrefix}: rapid ${round + 1} wrong ${wrongIndex + 1} holati saqlanmadi`);
          }
          const feedbackText = await assertStrictFeedback(
            page,
            `${issuePrefix} rapid ${round + 1} wrong ${wrongIndex + 1}`,
            'wrong',
            lang,
          );
          wrongFeedbacks.add(feedbackText);
          await assertOuterNextLocked(page, `${issuePrefix} rapid ${round + 1} wrong`);
        }
        if (wrongCount > 1 && wrongFeedbacks.size !== wrongCount) {
          throw new Error(`${issuePrefix}: rapid ${round + 1} distractor feedbacklari xatoga xos emas`);
        }
      }

      await correct.first().click();
      await assertPostCorrectChoiceState(panel, `${issuePrefix} rapid ${round + 1} post-correct`, choiceCount);
      await assertStrictFeedback(page, `${issuePrefix} rapid ${round + 1} correct`, 'solution', lang);
    } else {
      const input = await waitForVisibleMatch(panel.locator('input:not(:disabled)'), 4_000);
      if (!input) throw new Error(`${issuePrefix}: rapid ${round + 1} choice ham numeric input ham emas`);
      const answer = await input.getAttribute('data-qa-answer');
      if (!answer) throw new Error(`${issuePrefix}: rapid ${round + 1} numeric preview answer yo'q`);
      const compactAnswer = answer.replace(/\s/g, '');
      const wrongAnswer = compactAnswer === '1' ? '2' : '1';

      if (auditWrong) {
        await input.fill(wrongAnswer);
        const submit = await waitForNumericSubmit(input);
        if (!submit) throw new Error(`${issuePrefix}: rapid ${round + 1} numeric Tekshirish tugmasi yo'q`);
        await submit.click();
        await assertStrictFeedback(page, `${issuePrefix} rapid ${round + 1} wrong numeric`, 'wrong', lang);
        await assertOuterNextLocked(page, `${issuePrefix} rapid ${round + 1} wrong numeric`);
        await input.fill(answer);
      } else {
        await input.fill(answer);
      }
      const correctSubmit = await waitForNumericSubmit(input);
      if (!correctSubmit) {
        throw new Error(`${issuePrefix}: rapid ${round + 1} numeric qayta Tekshirish tugmasi yo'q`);
      }
      await correctSubmit.click();
      await assertStrictFeedback(page, `${issuePrefix} rapid ${round + 1} correct numeric`, 'solution', lang);
    }
    if (round < expectedUnits - 1) {
      if (!THEORY_CONTINUE_UNLOCKED && await (await theoryNextButton(page)).isEnabled()) {
        throw new Error(`${issuePrefix}: rapid ${round + 1} tugaganda outer Next erta ochildi`);
      }
      const rapidNext = await waitForVisibleMatch(panel.locator('[data-qa-rapid-next]:not(:disabled)'));
      if (!rapidNext) throw new Error(`${issuePrefix}: rapid ${round + 1} keyingi savol tugmasi ochilmadi`);
      await rapidNext.click();
    }
  }

  if (!await waitForVisibleMatch(inLesson(page, '[data-qa-rapid-complete]'))) {
    throw new Error(`${issuePrefix}: rapid yakun holati ko'rinmadi`);
  }
  if (!(await waitForEnabledLocator(await theoryNextButton(page)))) {
    throw new Error(`${issuePrefix}: rapid tugagach outer Next ochilmadi`);
  }
  rapidBranchScreensChecked += 1;
  return true;
}

async function strictChoiceMetadata(page, scope, issuePrefix, lang, { auditWrong = false } = {}) {
  const choices = scope.locator('[data-g4-branch="choice"]');
  const choiceCount = await choices.count();
  if (!choiceCount) throw new Error(`${issuePrefix}: choice variantlari topilmadi`);
  await waitForEnabledCard(choices);
  const correct = scope.locator('[data-g4-branch="choice"][data-g4-correct="true"]');
  const wrong = scope.locator('[data-g4-branch="choice"][data-g4-correct="false"]');
  const correctCount = await correct.count();
  const wrongCount = await wrong.count();
  if (correctCount !== 1 || wrongCount < 1 || correctCount + wrongCount !== choiceCount) {
    throw new Error(`${issuePrefix}: choice semantikasi correct=${correctCount}, wrong=${wrongCount}, total=${choiceCount}`);
  }

  if (auditWrong) {
    const wrongFeedbacks = new Set();
    for (let index = 0; index < wrongCount; index += 1) {
      const option = wrong.nth(index);
      if (!(await option.isEnabled())) throw new Error(`${issuePrefix}: wrong ${index + 1} retrydan oldin bloklangan`);
      await option.click();
      if (!(await waitForDisabledLocator(option))) {
        throw new Error(`${issuePrefix}: wrong ${index + 1} tanlovi holati saqlanmadi`);
      }
      wrongFeedbacks.add(await assertStrictFeedback(page, `${issuePrefix} wrong ${index + 1}`, 'wrong', lang));
      await assertOuterNextLocked(page, `${issuePrefix} wrong ${index + 1}`);
    }
    if (wrongCount > 1 && wrongFeedbacks.size !== wrongCount) {
      throw new Error(`${issuePrefix}: ${wrongCount} distractor uchun xatoga xos feedbacklar takrorlangan`);
    }
  }

  return { choices, choiceCount, correct: correct.first() };
}

async function assertPostCorrectChoiceState(scope, issuePrefix, expectedCount = null) {
  await sleep(900);
  const solutionOnlyRoot = await firstVisible(scope.locator('[data-qa-solution-only="true"]'));
  if (solutionOnlyRoot) {
    const solution = await firstVisible(solutionOnlyRoot.locator('[data-qa-solution-only-complete="true"]'));
    if (!solution) throw new Error(`${issuePrefix}: solution-only yechim framei ochilmadi`);
    const staleChoices = solutionOnlyRoot.locator('button[data-g4-source-index][data-g4-correct]');
    if (await staleChoices.count()) {
      throw new Error(`${issuePrefix}: solution-only holatda eski variantlar DOMda qoldi`);
    }
    const staleQuestion = await firstVisible(solutionOnlyRoot.locator('.question-title'));
    const staleVisual = await firstVisible(solutionOnlyRoot.locator('[data-g4-role~="visual-frame"]'));
    if (staleQuestion || staleVisual) {
      throw new Error(`${issuePrefix}: solution-only holatda savol yoki asosiy visual yashirilmadi`);
    }
    const solutionFeedback = await firstVisible(solution.locator('[data-g4-feedback="solution"]'));
    if (!solutionFeedback) throw new Error(`${issuePrefix}: solution-only frameda yechim feedbacki yo'q`);
    postCorrectChoiceStatesChecked += 1;
    return;
  }
  const choices = scope.locator('button[data-g4-source-index][data-g4-correct]');
  const choiceCount = await choices.count();
  if (!choiceCount) throw new Error(`${issuePrefix}: correctdan keyin variantlar DOMda qolmadi`);
  if (expectedCount !== null && choiceCount !== expectedCount) {
    throw new Error(`${issuePrefix}: correctdan keyin variantlar soni ${choiceCount}, kutilgan ${expectedCount}`);
  }

  const readState = (elements) => elements.map((element) => {
    const style = getComputedStyle(element);
    const visualStyle = [style.backgroundColor, style.color, style.borderColor, style.boxShadow].join(' ');
    const greenVisual = [...visualStyle.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)/g)]
      .some((match) => {
        const red = Number(match[1]);
        const green = Number(match[2]);
        const blue = Number(match[3]);
        return green >= red + 5 && green >= blue + 5;
      });
    return {
      sourceIndex: element.getAttribute('data-g4-source-index'),
      correct: element.getAttribute('data-g4-correct') === 'true',
      disabled: Boolean(element.disabled),
      visible: element.getClientRects().length > 0
        && style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity || '1') > 0.01,
      className: String(element.className ?? ''),
      visualStyle,
      greenVisual,
      ariaPressed: element.getAttribute('aria-pressed'),
    };
  });
  const snapshot = await choices.evaluateAll(readState);
  const correctStates = snapshot.filter((item) => item.correct);
  if (correctStates.length !== 1) {
    throw new Error(`${issuePrefix}: correctdan keyin aynan bitta to'g'ri variant yo'q`);
  }
  if (snapshot.some((item) => !item.visible)) {
    throw new Error(`${issuePrefix}: correctdan keyin kamida bitta variant yashirildi`);
  }
  if (snapshot.some((item) => !item.disabled)) {
    throw new Error(`${issuePrefix}: correctdan keyin kamida bitta variant qayta tanlanishi mumkin`);
  }
  const correctState = correctStates[0];
  if (!/(?:correct|right|success)/i.test(correctState.className)) {
    throw new Error(`${issuePrefix}: to'g'ri variantda success semantik klassi yo'q (${correctState.className})`);
  }
  if (!correctState.greenVisual) {
    throw new Error(`${issuePrefix}: to'g'ri variant yashil success uslubida emas (${correctState.visualStyle})`);
  }

  const wrong = scope.locator('button[data-g4-source-index][data-g4-correct="false"]').first();
  const beforeForcedClick = JSON.stringify(snapshot);
  if (await wrong.count()) await wrong.evaluate((element) => element.click());
  await sleep(80);
  const afterForcedClick = JSON.stringify(await choices.evaluateAll(readState));
  if (afterForcedClick !== beforeForcedClick) {
    throw new Error(`${issuePrefix}: disabled variantni qayta bosish solved holatini o'zgartirdi`);
  }
  postCorrectChoiceStatesChecked += 1;
}

async function waitForChoiceCommit(option, timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const className = String(await option.getAttribute('class').catch(() => ''));
    if (await option.isDisabled().catch(() => false) || /(?:^|\s)option-wrong(?:\s|$)/.test(className)) return true;
    await sleep(25);
  }
  return false;
}

async function auditVisibleStagedMatching(page, issuePrefix, lang, { auditWrong = false } = {}) {
  const root = await firstVisible(inLesson(page, '.matching-screen'));
  if (!root) return false;
  let stage = await root.getAttribute('data-qa-matching-stage');
  let left = root.locator('[data-match-left]');
  let right = root.locator('[data-match-right]');
  if (['pairs', 'complete'].includes(stage) && await left.count() && await right.count()) {
    return auditVisibleTheoryMatching(page, issuePrefix, lang, false, auditWrong);
  }

  if (stage === 'estimate') {
    const choices = root.locator('[data-g4-branch="choice"]');
    const choiceCount = await choices.count();
    if (!choiceCount) return false;
    await waitForEnabledCard(choices);
    const correct = root.locator('[data-g4-branch="choice"][data-g4-correct="true"]');
    const wrong = root.locator('[data-g4-branch="choice"][data-g4-correct="false"]');
    const correctCount = await correct.count();
    const wrongCount = await wrong.count();
    if (correctCount !== 1 || wrongCount < 1 || correctCount + wrongCount !== choiceCount) {
      throw new Error(`${issuePrefix}: staged matching estimate semantikasi to'liq emas`);
    }

    if (auditWrong) {
      const feedbacks = new Set();
      for (let index = 0; index < wrongCount; index += 1) {
        const option = wrong.nth(index);
        if (!(await option.isEnabled())) throw new Error(`${issuePrefix}: matching estimate wrong ${index + 1} bloklangan`);
        await option.click();
        if (!(await waitForChoiceCommit(option))) {
          throw new Error(`${issuePrefix}: matching estimate wrong ${index + 1} holati saqlanmadi`);
        }
        feedbacks.add(await assertStrictFeedback(page, `${issuePrefix} matching estimate wrong ${index + 1}`, 'wrong', lang));
        await assertOuterNextLocked(page, `${issuePrefix} matching estimate wrong ${index + 1}`);
      }
      if (wrongCount > 1 && feedbacks.size !== wrongCount) {
        throw new Error(`${issuePrefix}: matching estimate feedbacklari xatoga xos emas`);
      }
    }

    await correct.first().click();
    await assertPostCorrectChoiceState(root, `${issuePrefix} matching estimate post-correct`, choiceCount);
    if (!(await waitForAttributeValue(root, 'data-qa-matching-stage', 'estimate-solution'))) {
      throw new Error(`${issuePrefix}: estimate yechilgach yechim fazasi ochilmadi`);
    }
    await assertStrictFeedback(page, `${issuePrefix} matching estimate correct`, 'solution', lang);
    stage = 'estimate-solution';
  }

  if (stage !== 'estimate-solution') {
    throw new Error(`${issuePrefix}: staged matching fazasi ${stage} noma'lum`);
  }

  await assertOuterNextLocked(page, `${issuePrefix} matching estimate solution`);
  const start = await waitForVisibleMatch(root.locator('[data-qa-matching-start="true"]:not(:disabled)'));
  if (!start) throw new Error(`${issuePrefix}: matchingni boshlash tugmasi ochilmadi`);
  await start.click();
  if (!(await waitForAttributeValue(root, 'data-qa-matching-stage', 'pairs'))) {
    throw new Error(`${issuePrefix}: matching pairs fazasi ochilmadi`);
  }
  left = root.locator('[data-match-left]');
  right = root.locator('[data-match-right]');
  if (!(await waitForVisibleMatch(left.first())) || !(await waitForVisibleMatch(right.first()))) {
    throw new Error(`${issuePrefix}: estimate yechilgach matching endpointlari ochilmadi`);
  }
  await assertOuterNextLocked(page, `${issuePrefix} matching endpointlari ochilganda`);
  return auditVisibleTheoryMatching(page, issuePrefix, lang, false, auditWrong);
}

async function auditVisibleReasoningRounds(page, issuePrefix, lang, { auditWrong = false } = {}) {
  const root = await firstVisible(inLesson(page, '[data-qa-round-console="reasoning"]'));
  if (!root) return false;
  const roundCount = Number(await root.getAttribute('data-qa-round-count'));
  const stepCount = Number(await root.getAttribute('data-qa-step-count'));
  const activeLesson = lessons.find((lesson) => page.url().includes(`/${lesson.slug}`));
  const activeScreen = activeLesson?.file === 'Dars08.jsx' ? await currentScreenCount(page) : null;
  if (!Number.isInteger(roundCount)) {
    throw new Error(`${issuePrefix}: reasoning round count ${roundCount} noto'g'ri`);
  }
  if (activeScreen) {
    if (activeScreen.current !== 7 || roundCount !== 1 || stepCount !== 1) {
      throw new Error(
        `${issuePrefix}: Dars08 s6 bir qadamli reasoning kontrakti noto'g'ri `
        + `(screen=${activeScreen.current}, rounds=${roundCount}, steps=${stepCount})`,
      );
    }
  } else if (roundCount < 2) {
    throw new Error(`${issuePrefix}: reasoning round count ${roundCount} noto'g'ri`);
  }
  let branchCount = 0;

  for (let round = 0; round < roundCount; round += 1) {
    if (!(await waitForAttributeValue(root, 'data-qa-round', round))) {
      throw new Error(`${issuePrefix}: reasoning ${round + 1}-raund markeriga o'tmadi`);
    }
    const choice = await strictChoiceMetadata(
      page,
      root,
      `${issuePrefix} reasoning ${round + 1}`,
      lang,
      { auditWrong },
    );
    branchCount += choice.choiceCount;
    await choice.correct.click();
    await assertPostCorrectChoiceState(root, `${issuePrefix} reasoning ${round + 1} post-correct`, choice.choiceCount);
    await assertStrictFeedback(page, `${issuePrefix} reasoning ${round + 1} correct`, 'solution', lang);

    if (round < roundCount - 1) {
      await assertOuterNextLocked(page, `${issuePrefix} reasoning ${round + 1}`);
      const innerNext = await waitForVisibleMatch(root.locator('[data-qa-round-next]:not(:disabled)'));
      if (!innerNext) throw new Error(`${issuePrefix}: reasoning ${round + 1} ichki Next ochilmadi`);
      await innerNext.click();
      if (!(await waitForAttributeValue(root, 'data-qa-round', round + 1))) {
        throw new Error(`${issuePrefix}: reasoning ${round + 2}-raundga o'tmadi`);
      }
    }
  }

  if (!(await waitForAttached(root.locator('[data-qa-round-complete="true"]')))) {
    throw new Error(`${issuePrefix}: reasoning yakun markeri chiqmagan`);
  }
  if (!(await waitForEnabledLocator(await theoryNextButton(page)))) {
    throw new Error(`${issuePrefix}: reasoning tugagach outer Next ochilmadi`);
  }
  choiceBranchScreensChecked += 1;
  choiceBranchesChecked += branchCount;
  return true;
}

async function auditVisibleGuidedChoiceSteps(page, issuePrefix, lang, { auditWrong = false } = {}) {
  const root = await firstVisible(inLesson(page, '[data-qa-guided-choice="true"]'));
  if (!root) return false;
  let branchCount = 0;
  const phase = await root.getAttribute('data-qa-guided-phase');
  if (phase === 'choice') {
    const choice = await strictChoiceMetadata(page, root, `${issuePrefix} guided choice`, lang, { auditWrong });
    branchCount += choice.choiceCount;
    await choice.correct.click();
    await assertPostCorrectChoiceState(root, `${issuePrefix} guided choice post-correct`, choice.choiceCount);
    if (!(await waitForAttributeValue(root, 'data-qa-guided-phase', 'steps'))) {
      throw new Error(`${issuePrefix}: guided choice yechilgach steps fazasi ochilmadi`);
    }
  } else if (phase !== 'steps') {
    throw new Error(`${issuePrefix}: guided phase ${phase} noma'lum`);
  }

  const stage = root.locator('[data-qa-guided-step-count]').first();
  if (!(await waitForAttached(stage))) throw new Error(`${issuePrefix}: guided step paneli ochilmadi`);
  const stepCount = Number(await stage.getAttribute('data-qa-guided-step-count'));
  const declaredStepCount = Number(await root.getAttribute('data-qa-step-count'));
  if (!Number.isInteger(stepCount) || stepCount < 1) {
    throw new Error(`${issuePrefix}: guided step count ${stepCount} noto'g'ri`);
  }
  const activeLesson = lessons.find((lesson) => page.url().includes(`/${lesson.slug}`));
  if (activeLesson?.file === 'Dars08.jsx') {
    const activeScreen = await currentScreenCount(page);
    if (activeScreen.current !== 10 || stepCount !== 3 || declaredStepCount !== 3) {
      throw new Error(
        `${issuePrefix}: Dars08 s9 uch qadamli guided kontrakti noto'g'ri `
        + `(screen=${activeScreen.current}, steps=${stepCount}, declared=${declaredStepCount})`,
      );
    }
  }
  for (let step = 0; step < stepCount; step += 1) {
    const button = stage.locator(`[data-qa-guided-step="${step}"]`).first();
    if (!(await waitForEnabledLocator(button))) throw new Error(`${issuePrefix}: guided ${step + 1}-qadam ochilmadi`);
    await button.click();
    if (!(await waitForClassToken(button, 'timeline-visited'))) {
      throw new Error(`${issuePrefix}: guided ${step + 1}-qadam visited holatiga o'tmadi`);
    }
    if (step < stepCount - 1) await assertOuterNextLocked(page, `${issuePrefix} guided ${step + 1}-qadam`);
  }
  if (!(await waitForAttached(root.locator('[data-qa-guided-complete="true"]')))) {
    throw new Error(`${issuePrefix}: guided yakun markeri chiqmagan`);
  }
  await assertStrictFeedback(page, `${issuePrefix} guided complete`, 'solution', lang);
  if (!(await waitForEnabledLocator(await theoryNextButton(page)))) {
    throw new Error(`${issuePrefix}: guided tugagach outer Next ochilmadi`);
  }
  choiceBranchScreensChecked += 1;
  choiceBranchesChecked += branchCount;
  return true;
}

async function auditVisibleExplanationSteps(page, issuePrefix, lang) {
  const root = await firstVisible(inLesson(page, '[data-qa-explanation-steps]'));
  if (!root) return false;
  const stepCount = Number(await root.getAttribute('data-qa-explanation-steps'));
  const declaredStepCount = Number(await root.getAttribute('data-qa-step-count'));
  if (!Number.isInteger(stepCount) || stepCount < 1) {
    throw new Error(`${issuePrefix}: explanation step count ${stepCount} noto'g'ri`);
  }
  const activeLesson = lessons.find((lesson) => page.url().includes(`/${lesson.slug}`));
  if (activeLesson?.file === 'Dars08.jsx') {
    const activeScreen = await currentScreenCount(page);
    if (activeScreen.current !== 5 || stepCount !== 3 || declaredStepCount !== 3) {
      throw new Error(
        `${issuePrefix}: Dars08 s4 uch qadamli explanation kontrakti noto'g'ri `
        + `(screen=${activeScreen.current}, steps=${stepCount}, declared=${declaredStepCount})`,
      );
    }
  }
  for (let step = 0; step < stepCount; step += 1) {
    const button = root.locator(`[data-qa-explanation-step="${step}"]`).first();
    if (!(await waitForEnabledLocator(button))) throw new Error(`${issuePrefix}: explanation ${step + 1}-qadam ochilmadi`);
    await button.click();
    if (!(await waitForClassToken(button, 'timeline-visited'))) {
      throw new Error(`${issuePrefix}: explanation ${step + 1}-qadam visited holatiga o'tmadi`);
    }
    if (step < stepCount - 1) await assertOuterNextLocked(page, `${issuePrefix} explanation ${step + 1}-qadam`);
  }
  if (!(await waitForAttached(root.locator('[data-qa-explanation-complete="true"]')))) {
    throw new Error(`${issuePrefix}: explanation yakun markeri chiqmagan`);
  }
  await assertStrictFeedback(page, `${issuePrefix} explanation complete`, 'solution', lang);
  if (!(await waitForEnabledLocator(await theoryNextButton(page)))) {
    throw new Error(`${issuePrefix}: explanation tugagach outer Next ochilmadi`);
  }
  return true;
}

async function clearCurrentBuildRound(root, issuePrefix) {
  const slots = root.locator('[data-qa-build-round-answer] [data-qa-build-slot]');
  for (let index = 0; index < await slots.count(); index += 1) {
    const slot = slots.nth(index);
    if (await slot.getAttribute('data-qa-filled') !== 'true') continue;
    await slot.click();
    if (!(await waitForAttributeValue(slot, 'data-qa-filled', 'false'))) {
      throw new Error(`${issuePrefix}: build slot ${index + 1} tozalanmadi`);
    }
  }
}

async function fillCurrentBuildRound(root, values, issuePrefix) {
  const board = root.locator('[data-qa-build-round-answer]').first();
  const slots = board.locator('[data-qa-build-slot]');
  if (await slots.count() !== values.length) {
    throw new Error(`${issuePrefix}: build slot ${await slots.count()}, kutilgan ${values.length}`);
  }
  for (let index = 0; index < values.length; index += 1) {
    const slot = slots.nth(index);
    if (await slot.getAttribute('data-qa-filled') === 'true') {
      await slot.click();
      if (!(await waitForAttributeValue(slot, 'data-qa-filled', 'false'))) {
        throw new Error(`${issuePrefix}: build slot ${index + 1} qayta urinish uchun tozalanmadi`);
      }
    }
    await slot.click();
    if (!(await waitForClassToken(slot, 'slot-selected'))) {
      throw new Error(`${issuePrefix}: build slot ${index + 1} tanlanmadi`);
    }
    const card = await findBuildCard(board, values[index]);
    if (!card) throw new Error(`${issuePrefix}: build card ${values[index]} topilmadi`);
    await card.click();
    if (!(await waitForBuildSlot(slot, true, values[index]))) {
      throw new Error(`${issuePrefix}: build slot ${index + 1} ga ${values[index]} joylashmadi`);
    }
  }
}

async function auditVisibleBuildRounds(page, issuePrefix, lang, { auditWrong = false } = {}) {
  const root = await firstVisible(inLesson(page, '[data-qa-build-round-console="true"]'));
  if (!root) return false;
  const roundCount = Number(await root.getAttribute('data-qa-build-round-count'));
  if (!Number.isInteger(roundCount) || roundCount < 2) {
    throw new Error(`${issuePrefix}: build round count ${roundCount} noto'g'ri`);
  }

  for (let round = 0; round < roundCount; round += 1) {
    if (!(await waitForAttributeValue(root, 'data-qa-build-round', round))) {
      throw new Error(`${issuePrefix}: build ${round + 1}-raund markeriga o'tmadi`);
    }
    const board = root.locator('[data-qa-build-round-answer]').first();
    if (!(await waitForAttached(board))) throw new Error(`${issuePrefix}: build ${round + 1}-raund boardi yo'q`);
    let answer;
    try {
      answer = JSON.parse(await board.getAttribute('data-qa-build-round-answer'));
    } catch {
      throw new Error(`${issuePrefix}: build ${round + 1}-raund answer JSON noto'g'ri`);
    }
    if (!Array.isArray(answer) || answer.length !== 2) {
      throw new Error(`${issuePrefix}: build ${round + 1}-raund answer 2 qiymatdan iborat emas`);
    }

    if (auditWrong) {
      const wrongAttempts = [
        [(Number(answer[0]) + 1) % 10, answer[1]],
        [answer[0], Number(answer[1]) === 0 ? 1 : 0],
      ];
      const wrongFeedbacks = new Set();
      let previousWrongFeedback = '';
      for (let attempt = 0; attempt < wrongAttempts.length; attempt += 1) {
        await clearCurrentBuildRound(root, `${issuePrefix} build ${round + 1} wrong ${attempt + 1}`);
        await fillCurrentBuildRound(root, wrongAttempts[attempt], `${issuePrefix} build ${round + 1} wrong ${attempt + 1}`);
        const check = root.locator('[data-qa-build-round-check="true"]').first();
        if (!(await waitForEnabledLocator(check))) throw new Error(`${issuePrefix}: build wrong Tekshirish ochilmadi`);
        await check.click();
        const feedbackText = await waitForStrictFeedbackChange(
          page,
          `${issuePrefix} build ${round + 1} wrong ${attempt + 1}`,
          'wrong',
          lang,
          previousWrongFeedback,
        );
        previousWrongFeedback = feedbackText;
        wrongFeedbacks.add(feedbackText);
        await assertOuterNextLocked(page, `${issuePrefix} build ${round + 1} wrong ${attempt + 1}`);
      }
      if (wrongFeedbacks.size !== wrongAttempts.length) {
        throw new Error(`${issuePrefix}: build ${round + 1} digit/carry feedbacklari xatoga xos emas`);
      }
    }

    await clearCurrentBuildRound(root, `${issuePrefix} build ${round + 1} correct`);
    await fillCurrentBuildRound(root, answer, `${issuePrefix} build ${round + 1} correct`);
    const check = root.locator('[data-qa-build-round-check="true"]').first();
    if (!(await waitForEnabledLocator(check))) throw new Error(`${issuePrefix}: build correct Tekshirish ochilmadi`);
    await check.click();
    await assertStrictFeedback(page, `${issuePrefix} build ${round + 1} correct`, 'solution', lang);

    if (round < roundCount - 1) {
      await assertOuterNextLocked(page, `${issuePrefix} build ${round + 1}`);
      const innerNext = await waitForVisibleMatch(root.locator('[data-qa-build-round-next="true"]:not(:disabled)'));
      if (!innerNext) throw new Error(`${issuePrefix}: build ${round + 1} ichki Next ochilmadi`);
      await innerNext.click();
      if (!(await waitForAttributeValue(root, 'data-qa-build-round', round + 1))) {
        throw new Error(`${issuePrefix}: build ${round + 2}-raundga o'tmadi`);
      }
    }
  }

  if (!(await waitForAttached(root.locator('[data-qa-build-round-complete="true"]')))) {
    throw new Error(`${issuePrefix}: build yakun markeri chiqmagan`);
  }
  if (!(await waitForEnabledLocator(await theoryNextButton(page)))) {
    throw new Error(`${issuePrefix}: build tugagach outer Next ochilmadi`);
  }
  buildBranchScreensChecked += 1;
  return true;
}

async function clearRuleBuilder(root, issuePrefix) {
  const slots = root.locator('[data-qa-build-slot]');
  while (await slots.count()) {
    const before = await slots.count();
    await slots.first().click();
    if (!(await waitForLocatorCount(slots, before - 1))) {
      throw new Error(`${issuePrefix}: rule fragmenti olib tashlanmadi`);
    }
  }
}

async function fillRuleBuilder(root, values, issuePrefix) {
  const slots = root.locator('[data-qa-build-slot]');
  for (let index = 0; index < values.length; index += 1) {
    const before = await slots.count();
    const card = await findBuildCard(root, values[index]);
    if (!card) throw new Error(`${issuePrefix}: rule card ${values[index]} topilmadi`);
    await card.click();
    if (!(await waitForLocatorCount(slots, before + 1))) {
      throw new Error(`${issuePrefix}: rule card ${values[index]} joylashmadi`);
    }
  }
}

async function auditVisibleRuleBuilder(page, issuePrefix, lang, { auditWrong = false } = {}) {
  const root = await firstVisible(inLesson(page, '[data-qa-rule-builder="true"]'));
  if (!root) return false;
  let answer;
  try {
    answer = JSON.parse(await root.getAttribute('data-qa-rule-answer'));
  } catch {
    throw new Error(`${issuePrefix}: rule answer JSON noto'g'ri`);
  }
  if (!Array.isArray(answer) || answer.length < 2) throw new Error(`${issuePrefix}: rule answer yetarli emas`);

  if (auditWrong) {
    const wrong = [...answer];
    [wrong[0], wrong[1]] = [wrong[1], wrong[0]];
    await clearRuleBuilder(root, `${issuePrefix} rule wrong`);
    await fillRuleBuilder(root, wrong, `${issuePrefix} rule wrong`);
    const wrongCheck = root.locator('[data-qa-rule-check="true"]').first();
    if (!(await waitForEnabledLocator(wrongCheck))) throw new Error(`${issuePrefix}: rule wrong Tekshirish ochilmadi`);
    await wrongCheck.click();
    await assertStrictFeedback(page, `${issuePrefix} rule wrong`, 'wrong', lang);
    await assertOuterNextLocked(page, `${issuePrefix} rule wrong`);
  }

  await clearRuleBuilder(root, `${issuePrefix} rule correct`);
  await fillRuleBuilder(root, answer, `${issuePrefix} rule correct`);
  const check = root.locator('[data-qa-rule-check="true"]').first();
  if (!(await waitForEnabledLocator(check))) throw new Error(`${issuePrefix}: rule correct Tekshirish ochilmadi`);
  await check.click();
  if (!(await waitForAttached(inLesson(page, '[data-qa-rule-complete="true"]')))) {
    throw new Error(`${issuePrefix}: rule yakun markeri chiqmagan`);
  }
  await assertStrictFeedback(page, `${issuePrefix} rule correct`, 'solution', lang);
  if (!(await waitForEnabledLocator(await theoryNextButton(page)))) {
    throw new Error(`${issuePrefix}: rule tugagach outer Next ochilmadi`);
  }
  buildBranchScreensChecked += 1;
  return true;
}

async function auditVisibleCaseConsole(page, issuePrefix, lang, { auditWrong = false } = {}) {
  const root = await firstVisible(inLesson(page, '[data-qa-case-console="true"]'));
  if (!root) return false;
  const stageCount = Number(await root.getAttribute('data-qa-case-count'));
  if (!Number.isInteger(stageCount) || stageCount < 2) {
    throw new Error(`${issuePrefix}: case stage count ${stageCount} noto'g'ri`);
  }
  let branchCount = 0;

  for (let stage = 0; stage < stageCount; stage += 1) {
    if (!(await waitForAttributeValue(root, 'data-qa-case-stage', stage))) {
      throw new Error(`${issuePrefix}: case ${stage + 1}-bosqich markeriga o'tmadi`);
    }
    const choices = root.locator('[data-g4-branch="choice"]');
    if (await choices.count()) {
      const choice = await strictChoiceMetadata(page, root, `${issuePrefix} case ${stage + 1}`, lang, { auditWrong });
      branchCount += choice.choiceCount;
      await choice.correct.click();
      await assertPostCorrectChoiceState(root, `${issuePrefix} case ${stage + 1} post-correct`, choice.choiceCount);
    } else {
      const input = await waitForVisibleMatch(root.locator('input:not(:disabled)'), 4_000);
      if (!input) throw new Error(`${issuePrefix}: case ${stage + 1} choice ham numeric input ham emas`);
      const answer = await input.getAttribute('data-qa-answer');
      if (!answer) throw new Error(`${issuePrefix}: case ${stage + 1} numeric preview answer yo'q`);
      const compactAnswer = String(answer).replace(/\s/g, '');
      if (auditWrong) {
        await input.fill(compactAnswer === '1' ? '2' : '1');
        const wrongSubmit = await waitForNumericSubmit(input);
        if (!wrongSubmit) throw new Error(`${issuePrefix}: case wrong Tekshirish topilmadi`);
        await wrongSubmit.click();
        await assertStrictFeedback(page, `${issuePrefix} case ${stage + 1} wrong numeric`, 'wrong', lang);
        await assertOuterNextLocked(page, `${issuePrefix} case ${stage + 1} wrong numeric`);
      }
      await input.fill(answer);
      const correctSubmit = await waitForNumericSubmit(input);
      if (!correctSubmit) throw new Error(`${issuePrefix}: case correct Tekshirish topilmadi`);
      await correctSubmit.click();
    }
    await assertStrictFeedback(page, `${issuePrefix} case ${stage + 1} correct`, 'solution', lang);

    if (stage < stageCount - 1) {
      await assertOuterNextLocked(page, `${issuePrefix} case ${stage + 1}`);
      const innerNext = await waitForVisibleMatch(root.locator('[data-qa-case-next="true"]:not(:disabled)'));
      if (!innerNext) throw new Error(`${issuePrefix}: case ${stage + 1} ichki Next ochilmadi`);
      await innerNext.click();
      if (!(await waitForAttributeValue(root, 'data-qa-case-stage', stage + 1))) {
        throw new Error(`${issuePrefix}: case ${stage + 2}-bosqichga o'tmadi`);
      }
    }
  }

  if (!(await waitForAttached(root.locator('[data-qa-case-complete="true"]')))) {
    throw new Error(`${issuePrefix}: case yakun markeri chiqmagan`);
  }
  if (!(await waitForEnabledLocator(await theoryNextButton(page)))) {
    throw new Error(`${issuePrefix}: case tugagach outer Next ochilmadi`);
  }
  choiceBranchScreensChecked += 1;
  choiceBranchesChecked += branchCount;
  return true;
}

async function waitForChoiceRetryReset(retryRoot, option, expectedAttempts, checkpoint) {
  const deadline = Date.now() + 3_000;
  while (Date.now() < deadline) {
    const pending = await retryRoot.getAttribute('data-qa-choice-pending-wrong');
    const attemptCount = Number(await retryRoot.getAttribute('data-qa-choice-attempts'));
    const className = String(await option.getAttribute('class') ?? '');
    if (pending === ''
      && attemptCount >= expectedAttempts
      && !className.split(/\s+/).includes('option-picked-wrong')
      && await option.isEnabled().catch(() => false)) return;
    await sleep(25);
  }
  throw new Error(`${checkpoint}: xato variant izohdan keyin boshlang'ich holatga qaytmadi`);
}

async function auditVisibleChoiceBranches(page, issuePrefix, lang) {
  const choices = inLesson(page, 'button[data-g4-source-index][data-g4-correct]');
  const choiceCount = await choices.count();
  if (!choiceCount) return false;
  const activeLesson = lessons.find((lesson) => page.url().includes(`/${lesson.slug}`));
  const activeScreen = activeLesson?.file === 'Dars08.jsx' ? await currentScreenCount(page) : null;
  const dars08SingleChoiceScreens = new Set([2, 4, 6, 8, 9, 13, 14]);
  if (dars08SingleChoiceScreens.has(activeScreen?.current)) {
    const groups = await visibleAnswerOrderSnapshot(page);
    const staleMultiStep = await firstVisible(inLesson(
      page,
      '[data-qa-build-round-console], [data-qa-round-console], [data-qa-round-count], '
      + '[data-qa-round-next], [data-qa-matching-stage], [data-qa-case-console], '
      + '.matching-screen, .case-screen, .explanation-timeline',
    ));
    const choiceRoot = await firstVisible(inLesson(page, '.choice-screen[data-qa-step-count="1"]'));
    if (groups.length !== 1 || staleMultiStep || !choiceRoot) {
      throw new Error(
        `${issuePrefix}: Dars08 s${activeScreen.current - 1} bitta Choice kontraktiga mos emas`,
      );
    }
  }
  if ([8, 9].includes(activeScreen?.current)) {
    const solutionOnly = await firstVisible(inLesson(page, '[data-qa-solution-only="true"]'));
    if (!solutionOnly) {
      throw new Error(`${issuePrefix}: Dars08 s${activeScreen.current - 1} solution-only markeri yo'q`);
    }
  }
  await waitForEnabledCard(choices);
  const dars10MainState = await captureDars10MainState(page);
  const requiresStrictChoiceContract = await choices.evaluateAll((elements) => (
    elements.every((element) => element.getAttribute('data-g4-branch') === 'choice')
  ));
  const genericHook = await choices.evaluateAll((elements) => (
    elements.every((element) => Boolean(element.closest(
      '[data-g4-screen="hook"], .hook-answers, .stage-hook, .stage-diagnostic',
    )))
  ));
  const allowsDiagnosticAdvance = await choices.evaluateAll((elements) => (
    elements.every((element) => element.getAttribute('data-g4-diagnostic-advance') === 'true')
  ));
  const requiresDistinctWrongFeedback = requiresStrictChoiceContract || !genericHook;
  const feedbackAuditOptions = requiresStrictChoiceContract
    ? {}
    : { requireBit: false, requireSolutionLabel: false };

  const correct = inLesson(page, 'button[data-g4-source-index][data-g4-correct="true"]');
  const wrong = inLesson(page, 'button[data-g4-source-index][data-g4-correct="false"]');
  const correctCount = await correct.count();
  const wrongCount = await wrong.count();
  if (correctCount !== 1 || wrongCount < 1 || correctCount + wrongCount !== choiceCount) {
    throw new Error(`${issuePrefix}: choice semantikasi correct=${correctCount}, wrong=${wrongCount}, total=${choiceCount}`);
  }

  const wrongFeedbacks = new Set();
  const retryRoot = await firstVisible(inLesson(page, '[data-qa-choice-retry="after-wrong-audio"]'));

  for (let index = 0; index < wrongCount; index += 1) {
    const option = wrong.nth(index);
    if (!(await option.isEnabled())) throw new Error(`${issuePrefix}: wrong choice ${index + 1} retrydan oldin bloklangan`);
    const sourceIndex = await option.getAttribute('data-g4-source-index');
    const attemptsBefore = retryRoot
      ? Number(await retryRoot.getAttribute('data-qa-choice-attempts'))
      : 0;
    await option.click();
    if (retryRoot) {
      if (!(await waitForAttributeValue(retryRoot, 'data-qa-choice-pending-wrong', sourceIndex))
        || !(await waitForDisabledLocator(option))
        || !(await waitForClassToken(option, 'option-picked-wrong'))) {
        throw new Error(`${issuePrefix}: wrong choice ${index + 1} izoh vaqtida xato/bloklangan holatga o'tmadi`);
      }
    }
    const feedbackText = await assertStrictFeedback(
      page,
      `${issuePrefix} wrong ${index + 1}`,
      'wrong',
      lang,
      feedbackAuditOptions,
    );
    wrongFeedbacks.add(feedbackText);
    if (retryRoot) {
      await waitForChoiceRetryReset(retryRoot, option, attemptsBefore + 1, `${issuePrefix} wrong choice ${index + 1}`);
      if (index === 0) {
        const retryAttemptsBefore = Number(await retryRoot.getAttribute('data-qa-choice-attempts'));
        await option.click();
        if (!(await waitForAttributeValue(retryRoot, 'data-qa-choice-pending-wrong', sourceIndex))
          || !(await waitForDisabledLocator(option))
          || !(await waitForClassToken(option, 'option-picked-wrong'))) {
          throw new Error(`${issuePrefix}: ayni xato variant qayta tanlanmadi`);
        }
        await assertStrictFeedback(
          page,
          `${issuePrefix} wrong ${index + 1} retry`,
          'wrong',
          lang,
          feedbackAuditOptions,
        );
        await waitForChoiceRetryReset(
          retryRoot,
          option,
          retryAttemptsBefore + 1,
          `${issuePrefix} wrong choice ${index + 1} retry`,
        );
      }
    }
    if (genericHook && !allowsDiagnosticAdvance) {
      const retryAvailable = await choices.evaluateAll((elements) => elements.some((element) => {
        const style = getComputedStyle(element);
        return !element.disabled
          && element.getClientRects().length > 0
          && style.display !== 'none'
          && style.visibility !== 'hidden'
          && Number.parseFloat(style.opacity || '1') > 0.01;
      }));
      if (!retryAvailable) {
        throw new Error(`${issuePrefix}: wrong hook feedback retry variantlarini yashirdi`);
      }
    }
    const nextEnabled = await (await theoryNextButton(page)).isEnabled();
    if (!allowsDiagnosticAdvance && !THEORY_CONTINUE_UNLOCKED && nextEnabled) {
      throw new Error(`${issuePrefix}: wrong choice ${index + 1} dan keyin Next ochildi`);
    }
    if (allowsDiagnosticAdvance && !nextEnabled) {
      throw new Error(`${issuePrefix}: diagnostik wrong choice ${index + 1} dan keyin Next ochilmadi`);
    }
  }
  if (requiresDistinctWrongFeedback && wrongCount > 1 && wrongFeedbacks.size !== wrongCount) {
    throw new Error(`${issuePrefix}: ${wrongCount} distractor uchun xatoga xos feedbacklar takrorlangan`);
  }

  const correctOption = correct.first();
  if (!(await correctOption.isEnabled())) throw new Error(`${issuePrefix}: correct choice retrydan keyin bloklangan`);
  await correctOption.click();
  await assertPostCorrectChoiceState(page.locator(LESSON_ROOT), `${issuePrefix} post-correct`, choiceCount);
  await assertStrictFeedback(page, `${issuePrefix} correct`, 'solution', lang, feedbackAuditOptions);
  await assertDars10MainStatePreserved(page, dars10MainState, `${issuePrefix} correct`);
  const next = await theoryNextButton(page);
  if (!(await waitForEnabledLocator(next))) throw new Error(`${issuePrefix}: correct choicedan keyin Next ochilmadi`);
  choiceBranchScreensChecked += 1;
  choiceBranchesChecked += choiceCount;
  return true;
}

async function nearestNumericSubmit(input) {
  return firstVisible(input.locator(
    'xpath=ancestor::*[(self::section or self::div) and .//button][1]//button[not(@disabled)]',
  ));
}

async function auditVisibleNumericBranches(page, issuePrefix, lang) {
  const input = await firstVisible(inLesson(page, 'input[data-qa-answer]:not(:disabled)'));
  if (!input) return false;
  const dars10MainState = await captureDars10MainState(page);
  const answer = await input.getAttribute('data-qa-answer');
  if (!answer) throw new Error(`${issuePrefix}: numeric preview answer yo'q`);
  const compactAnswer = String(answer).replace(/\s/g, '');
  const wrongAnswer = compactAnswer === '1' ? '2' : '1';

  await input.fill(wrongAnswer);
  await input.press('Enter');
  await sleep(60);
  if (!await firstVisible(inLesson(page, '[data-g4-feedback="wrong"]'))) {
    const submit = await nearestNumericSubmit(input);
    if (!submit) throw new Error(`${issuePrefix}: numeric Tekshirish tugmasi topilmadi`);
    await submit.click();
  }
  await assertStrictFeedback(page, `${issuePrefix} wrong numeric`, 'wrong', lang);
  if (!THEORY_CONTINUE_UNLOCKED && await (await theoryNextButton(page)).isEnabled()) {
    throw new Error(`${issuePrefix}: wrong numeric javobdan keyin Next ochildi`);
  }

  await input.fill(answer);
  await input.press('Enter');
  await sleep(60);
  if (!await firstVisible(inLesson(page, '[data-g4-feedback="solution"]'))) {
    const submit = await nearestNumericSubmit(input);
    if (!submit) throw new Error(`${issuePrefix}: numeric qayta Tekshirish tugmasi topilmadi`);
    await submit.click();
  }
  await assertStrictFeedback(page, `${issuePrefix} correct numeric`, 'solution', lang);
  await assertDars10MainStatePreserved(page, dars10MainState, `${issuePrefix} correct numeric`);
  const next = await theoryNextButton(page);
  if (!(await waitForEnabledLocator(next))) throw new Error(`${issuePrefix}: correct numeric javobdan keyin Next ochilmadi`);
  numericBranchScreensChecked += 1;
  return true;
}

async function findBuildCard(board, value) {
  const cards = board.locator('[data-qa-build-card]');
  for (let index = 0; index < await cards.count(); index += 1) {
    const card = cards.nth(index);
    if (
      await card.getAttribute('data-qa-build-card') === String(value)
      && await card.isVisible()
      && await card.isEnabled()
    ) return card;
  }
  return null;
}

async function waitForBuildSlot(slot, filled, expectedValue = null, timeout = 2_000) {
  const expectedFilled = filled ? 'true' : 'false';
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const stateMatches = await slot.getAttribute('data-qa-filled') === expectedFilled;
    const valueMatches = expectedValue === null
      || normalizeText(await slot.innerText()).includes(normalizeText(String(expectedValue)));
    if (stateMatches && valueMatches) return true;
    await sleep(25);
  }
  return false;
}

async function waitForBuildCardSelected(card, timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await card.getAttribute('aria-pressed') === 'true') return true;
    await sleep(25);
  }
  return false;
}

async function fillBuildBoard(board, values, mode, issuePrefix) {
  const slots = board.locator('[data-qa-build-slot]');
  const slotCount = await slots.count();
  if (slotCount !== values.length) {
    throw new Error(`${issuePrefix}: build slot ${slotCount}, kutilgan ${values.length}`);
  }
  const clickValues = mode === 'auto-right' ? [...values].reverse() : values;
  for (let index = 0; index < clickValues.length; index += 1) {
    const value = clickValues[index];
    const card = await findBuildCard(board, value);
    if (!card || !(await card.isEnabled())) {
      throw new Error(`${issuePrefix}: build card "${value}" topilmadi yoki bloklangan`);
    }
    await card.click();
    if (mode === 'select-slot') {
      if (!(await waitForBuildCardSelected(card))) {
        throw new Error(`${issuePrefix}: build card "${value}" tanlangan holatga o'tmadi`);
      }
      const slot = slots.nth(index);
      if (!(await slot.isEnabled())) throw new Error(`${issuePrefix}: build slot ${index + 1} bloklangan`);
      await slot.click();
      if (!(await waitForBuildSlot(slot, true, value))) {
        throw new Error(`${issuePrefix}: build slot ${index + 1} ga "${value}" joylashmadi`);
      }
    } else {
      const slotIndex = mode === 'auto-right' ? slotCount - index - 1 : index;
      if (!(await waitForBuildSlot(slots.nth(slotIndex), true, value))) {
        throw new Error(`${issuePrefix}: build slot ${slotIndex + 1} ga "${value}" joylashmadi`);
      }
    }
  }
}

async function clearBuildBoard(board, issuePrefix) {
  const slots = board.locator('[data-qa-build-slot]');
  for (let index = 0; index < await slots.count(); index += 1) {
    const slot = slots.nth(index);
    if (await slot.getAttribute('data-qa-filled') !== 'true') continue;
    if (!(await slot.isEnabled())) throw new Error(`${issuePrefix}: retry uchun build slot ${index + 1} bloklangan`);
    await slot.click();
    if (!(await waitForBuildSlot(slot, false))) {
      throw new Error(`${issuePrefix}: retryda build slot ${index + 1} tozalanmadi`);
    }
  }
  const uncleared = board.locator('[data-qa-build-slot][data-qa-filled="true"]');
  if (await uncleared.count()) throw new Error(`${issuePrefix}: build retryda ${await uncleared.count()} slot tozalanmadi`);
}

async function submitBuildBoardWhenExplicit(board, page, feedbackKind, issuePrefix) {
  await sleep(40);
  if (await firstVisible(inLesson(page, strictFeedbackSelector(feedbackKind)))) return;
  const check = board.locator('[data-qa-build-check="true"]').first();
  if (!(await waitForEnabledLocator(check))) {
    throw new Error(`${issuePrefix}: explicit build Tekshirish markeri yo'q yoki bloklangan`);
  }
  await check.click();
}

async function auditVisibleBuildBranches(page, issuePrefix, lang) {
  const board = await firstVisible(inLesson(page, '[data-qa-build-answer]'));
  if (!board) return false;
  let answer;
  try {
    answer = JSON.parse(await board.getAttribute('data-qa-build-answer'));
  } catch {
    throw new Error(`${issuePrefix}: build answer JSON noto'g'ri`);
  }
  if (!Array.isArray(answer) || answer.length < 2) throw new Error(`${issuePrefix}: build answer yetarli emas`);
  const mode = await board.getAttribute('data-qa-build-mode');
  if (!['auto', 'auto-right', 'select-slot'].includes(mode)) throw new Error(`${issuePrefix}: build mode ${mode} noma'lum`);

  await clearBuildBoard(board, issuePrefix + ' initial');
  const swapIndex = answer.findIndex((value, index) => index > 0 && String(value) !== String(answer[0]));
  if (swapIndex < 0) throw new Error(`${issuePrefix}: build uchun noto'g'ri tartib yasab bo'lmaydi`);
  const wrongOrder = [...answer];
  [wrongOrder[0], wrongOrder[swapIndex]] = [wrongOrder[swapIndex], wrongOrder[0]];
  await fillBuildBoard(board, wrongOrder, mode, issuePrefix + ' wrong');
  await submitBuildBoardWhenExplicit(board, page, 'wrong', issuePrefix + ' wrong');
  await assertStrictFeedback(page, issuePrefix + ' wrong build', 'wrong', lang);
  if (!THEORY_CONTINUE_UNLOCKED && await (await theoryNextButton(page)).isEnabled()) {
    throw new Error(`${issuePrefix}: wrong builddan keyin Next ochildi`);
  }

  await clearBuildBoard(board, issuePrefix);
  await fillBuildBoard(board, answer, mode, issuePrefix + ' correct');
  await submitBuildBoardWhenExplicit(board, page, 'solution', issuePrefix + ' correct');
  await assertStrictFeedback(page, issuePrefix + ' correct build', 'solution', lang);
  if (!(await waitForEnabledLocator(await theoryNextButton(page)))) {
    throw new Error(`${issuePrefix}: correct builddan keyin Next ochilmadi`);
  }
  buildBranchScreensChecked += 1;
  return true;
}

async function auditVisibleDigitSlots(page, issuePrefix, lang) {
  const slots = inLesson(page, '.digit-slots > div');
  const slotCount = await slots.count();
  if (!slotCount) return false;
  const choiceCounts = [];
  for (let slotIndex = 0; slotIndex < slotCount; slotIndex += 1) {
    const count = await slots.nth(slotIndex).locator('button').count();
    if (count < 2) throw new Error(`${issuePrefix}: digit slot ${slotIndex + 1} variantlari yetarli emas`);
    choiceCounts.push(count);
  }

  const combinationCount = choiceCounts.reduce((total, count) => total * count, 1);
  for (let combination = 0; combination < combinationCount; combination += 1) {
    let cursor = combination;
    for (let slotIndex = slotCount - 1; slotIndex >= 0; slotIndex -= 1) {
      const choiceIndex = cursor % choiceCounts[slotIndex];
      cursor = Math.floor(cursor / choiceCounts[slotIndex]);
      const choice = slots.nth(slotIndex).locator('button').nth(choiceIndex);
      if (await choice.isEnabled()) await choice.click();
    }
    await sleep(35);
    if (await (await theoryNextButton(page)).isEnabled()) {
      await assertStrictFeedback(page, issuePrefix + ' digit slots complete', 'solution', lang, {
        requireSolutionLabel: false,
      });
      return true;
    }
  }
  throw new Error(`${issuePrefix}: digit slotlar ${combinationCount} kombinatsiyada yechilmadi`);
}

async function auditVisibleRepeatedPlaceFlow(page, issuePrefix, lang, { auditWrong = false } = {}) {
  const root = await firstVisible(inLesson(page, '[data-qa-repeated-place-flow="true"]'));
  if (!root) return false;

  let phase = await root.getAttribute('data-qa-place-phase');
  if (phase === 'discover') {
    if (await root.locator('[data-qa-place-number="404 204"]').count() !== 1) {
      throw new Error(`${issuePrefix}: birinchi qadam soni 404 204 emas`);
    }
    const digitButtons = root.locator('[data-qa-place-digit]');
    if (await digitButtons.count() !== 3) {
      throw new Error(`${issuePrefix}: takroriy raqam tugmalari 3 ta emas`);
    }
    const numberIndexes = await digitButtons.evaluateAll((buttons) => (
      buttons.map((button) => Number(button.getAttribute('data-qa-number-index')))
    ));
    if (JSON.stringify(numberIndexes) !== JSON.stringify([0, 2, 5])) {
      throw new Error(`${issuePrefix}: 404204 dagi 4 indekslari ${numberIndexes.join(', ')}`);
    }

    for (let ordinal = 0; ordinal < 3; ordinal += 1) {
      const current = root.locator(`[data-qa-place-digit="${ordinal}"]`).first();
      if (!(await waitForAttributeValue(current, 'data-qa-place-state', 'current'))) {
        throw new Error(`${issuePrefix}: ${ordinal + 1}-raqam current holatiga o'tmadi`);
      }
      if (!(await waitForEnabledLocator(current))) {
        throw new Error(`${issuePrefix}: ${ordinal + 1}-raqam bosish uchun ochilmadi`);
      }
      if (await root.locator('[data-qa-place-arrow]').count() !== 0) {
        throw new Error(`${issuePrefix}: 6-slaydda strelka qolgan`);
      }
      for (let visited = 0; visited < ordinal; visited += 1) {
        const prior = root.locator(`[data-qa-place-digit="${visited}"]`).first();
        if (await prior.getAttribute('data-qa-place-state') !== 'visited' || await prior.isEnabled()) {
          throw new Error(`${issuePrefix}: bosilgan ${visited + 1}-raqam qayta faol bo'lib qoldi`);
        }
      }
      for (let locked = ordinal + 1; locked < 3; locked += 1) {
        const future = root.locator(`[data-qa-place-digit="${locked}"]`).first();
        if (await future.getAttribute('data-qa-place-state') !== 'locked' || await future.isEnabled()) {
          throw new Error(`${issuePrefix}: kelajakdagi ${locked + 1}-raqam muddatidan oldin ochildi`);
        }
      }
      await assertOuterNextLocked(page, `${issuePrefix} discover ${ordinal + 1}`);
      await current.click();
      const expectedReveals = JSON.stringify(['400 000', '4 000', '4'].slice(0, ordinal + 1));
      if (!(await waitForAttributeValue(root, 'data-qa-place-reveals', expectedReveals))) {
        throw new Error(`${issuePrefix}: ${ordinal + 1}-raqam qiymati ochilmadi (${expectedReveals})`);
      }
      if (ordinal < 2 && !(await waitForAttributeValue(current, 'data-qa-place-state', 'visited'))) {
        throw new Error(`${issuePrefix}: ${ordinal + 1}-raqam visited holatiga o'tmadi`);
      }
    }
    if (!(await waitForAttributeValue(root, 'data-qa-place-phase', 'practice', 4_000))) {
      throw new Error(`${issuePrefix}: uchinchi tushuntirishdan keyin 2-qadam ochilmadi`);
    }
    phase = 'practice';
  }

  if (phase === 'solved') {
    await assertStrictFeedback(page, `${issuePrefix} restored repeated place`, 'solution', lang);
    const pressed = await root.locator('[data-qa-place-option][aria-pressed="true"]').evaluateAll((buttons) => (
      buttons.map((button) => button.getAttribute('data-qa-place-option')).sort()
    ));
    if (JSON.stringify(pressed) !== JSON.stringify(['30', '3 000', '300 000'].sort())) {
      throw new Error(`${issuePrefix}: solved qiymatlar ${JSON.stringify(pressed)}`);
    }
    if (!(await waitForEnabledLocator(await theoryNextButton(page)))) {
      throw new Error(`${issuePrefix}: saqlangan takroriy-raqam yechimida Next ochilmadi`);
    }
    repeatedPlaceFlowsChecked += 1;
    return true;
  }
  if (phase !== 'practice') throw new Error(`${issuePrefix}: takroriy-raqam fazasi ${phase} noma'lum`);
  if (await root.locator('[data-qa-place-number="303 536"]').count() !== 1) {
    throw new Error(`${issuePrefix}: ikkinchi qadam soni 303 536 emas`);
  }

  let answer;
  try {
    answer = JSON.parse(await root.getAttribute('data-qa-place-answer'));
  } catch {
    throw new Error(`${issuePrefix}: takroriy-raqam answer JSON noto'g'ri`);
  }
  if (JSON.stringify(answer) !== JSON.stringify(['300 000', '3 000', '30'])) {
    throw new Error(`${issuePrefix}: 303536 javobi ${JSON.stringify(answer)}`);
  }
  const options = root.locator('[data-qa-place-option]');
  const optionValues = await options.evaluateAll((buttons) => (
    buttons.map((button) => button.getAttribute('data-qa-place-option'))
  ));
  const expectedOptions = ['300 000', '30 000', '3 000', '300', '30', '3'];
  if (JSON.stringify(optionValues) !== JSON.stringify(expectedOptions)) {
    throw new Error(`${issuePrefix}: takroriy-raqam variantlari ${JSON.stringify(optionValues)}`);
  }
  const optionFor = (value) => root.locator(`[data-qa-place-option=${JSON.stringify(value)}]`).first();

  if (auditWrong) {
    const wrongValue = optionValues.find((value) => !answer.includes(value));
    const beforeAttempts = Number(await root.getAttribute('data-qa-place-attempts'));
    for (const value of [answer[0], answer[1], wrongValue]) {
      const option = optionFor(value);
      if (!(await waitForEnabledLocator(option))) throw new Error(`${issuePrefix}: wrong branchda ${value} ochilmadi`);
      await option.click();
    }
    await assertStrictFeedback(page, `${issuePrefix} wrong repeated place`, 'wrong', lang);
    const afterAttempts = Number(await root.getAttribute('data-qa-place-attempts'));
    if (afterAttempts !== beforeAttempts + 1) {
      throw new Error(`${issuePrefix}: wrong branch urinish hisoblagichi oshmadi`);
    }
    const pressedAfterWrong = await options.evaluateAll((buttons) => (
      buttons.filter((button) => button.getAttribute('aria-pressed') === 'true').length
    ));
    if (pressedAfterWrong !== 0) throw new Error(`${issuePrefix}: wrong branch barcha belgilarni tozalamadi`);
    await assertOuterNextLocked(page, `${issuePrefix} wrong repeated place`);
  }

  for (const value of answer) {
    const option = optionFor(value);
    if (!(await waitForEnabledLocator(option))) throw new Error(`${issuePrefix}: correct branchda ${value} ochilmadi`);
    await option.click();
  }
  if (!(await waitForAttributeValue(root, 'data-qa-place-phase', 'solved', 4_000))) {
    throw new Error(`${issuePrefix}: uchta to'g'ri qiymatdan keyin solved bo'lmadi`);
  }
  await assertStrictFeedback(page, `${issuePrefix} correct repeated place`, 'solution', lang);
  if (!(await waitForEnabledLocator(await theoryNextButton(page)))) {
    throw new Error(`${issuePrefix}: takroriy-raqam yechimidan keyin Next ochilmadi`);
  }
  repeatedPlaceFlowsChecked += 1;
  return true;
}

async function assertUnlockedFeedbackWhenPresent(page, issuePrefix, lang) {
  const visibleFeedback = await firstVisible(inLesson(page, '[data-g4-feedback]:not([aria-hidden="true"])'));
  if (!visibleFeedback) return;
  const kind = canonicalFeedbackKind(await visibleFeedback.getAttribute('data-g4-feedback'));
  if (kind !== 'solution') {
    const neutralSelection = Boolean(await firstVisible(inLesson(
      page,
      '.stage-hook, .stage-diagnostic, .stage-strategy',
    )));
    if (!neutralSelection) throw new Error(`${issuePrefix}: Next ochilganda ${kind} feedback qolgan`);
    return;
  }
  await assertStrictFeedback(page, issuePrefix + ' unlocked', 'solution', lang, {
    requireBit: false,
    requireSolutionLabel: false,
  });
}

async function deterministicNumericAnswer(page, input, issuePrefix) {
  const explicit = await input.getAttribute('data-qa-answer');
  if (explicit) return explicit;

  const activeLesson = lessons.find((lesson) => page.url().includes(`/${lesson.slug}`));
  const count = await currentScreenCount(page);
  const staticAnswer = activeLesson ? theoryNumericAnswers.get(activeLesson.file)?.[count.current - 1] : null;
  if (staticAnswer) return staticAnswer;

  // The Dars12–17 family predates preview-only data-qa-answer attributes.
  // Its numeric tasks expose an integer division formula in the active model;
  // derive that exact result instead of guessing or invoking a React callback.
  const formula = await firstVisible(inLesson(page, '.main-formula, .rule-formula, .summary-formula'));
  const formulaText = normalizeText(formula ? await formula.innerText() : '');
  const match = formulaText.match(/([\d\s]+)\s*(?::|÷)\s*([\d\s]+)/u);
  if (!match) throw new Error(issuePrefix + ': numeric inputda preview-only data-qa-answer yoki bo\'lish formulasi yo‘q');
  const dividend = Number(match[1].replace(/\s/g, ''));
  const divisor = Number(match[2].replace(/\s/g, ''));
  if (!Number.isSafeInteger(dividend) || !Number.isSafeInteger(divisor) || divisor === 0 || dividend % divisor !== 0) {
    throw new Error(issuePrefix + ': numeric formula aniq butun javob bermaydi');
  }
  return String(dividend / divisor);
}

async function naturallyUnlockStrictTheoryScreen(
  page,
  issuePrefix,
  { auditBranches = false, lang = 'en', requireAction = false } = {},
) {
  await muteLesson(page);
  const componentOptions = { auditWrong: auditBranches, lang };
  if (await auditVisibleRoundingLineFlow(page, issuePrefix, componentOptions)) return;
  const next = await theoryNextButton(page);
  const nextAlreadyEnabled = await next.isEnabled();
  const markedChoiceCount = auditBranches
    ? await inLesson(page, 'button[data-g4-source-index][data-g4-correct]').count()
    : 0;
  const deterministicFlowCount = await inLesson(
    page,
    '[data-qa-build-answer], [data-qa-repeated-place-flow="true"], [data-qa-rapid-console="true"]',
  ).count();
  if (nextAlreadyEnabled && requireAction && !THEORY_CONTINUE_UNLOCKED) {
    throw new Error(`${issuePrefix}: faol ekranda javobsiz Continue ochiq`);
  }
  if (nextAlreadyEnabled && !(auditBranches && markedChoiceCount) && !deterministicFlowCount) {
    return;
  }

  // Multi-phase components need their own deterministic traversal. These run
  // for every viewport, and the strict matrix exercises each wrong/correct
  // path at every target size so responsive feedback geometry is verified.
  if (await auditVisibleRapidConsole(page, issuePrefix, lang, componentOptions)) return;
  if (await auditVisibleReasoningRounds(page, issuePrefix, lang, componentOptions)) return;
  if (await auditVisibleGuidedChoiceSteps(page, issuePrefix, lang, componentOptions)) return;
  if (await auditVisibleBuildRounds(page, issuePrefix, lang, componentOptions)) return;
  if (await auditVisibleCaseConsole(page, issuePrefix, lang, componentOptions)) return;
  if (await auditVisibleStagedMatching(page, issuePrefix, lang, componentOptions)) return;
  if (await auditVisibleExplanationSteps(page, issuePrefix, lang)) return;
  if (await auditVisibleRuleBuilder(page, issuePrefix, lang, componentOptions)) return;
  if (await auditVisibleRepeatedPlaceFlow(page, issuePrefix, lang, componentOptions)) return;

  if (auditBranches) {
    if (await auditVisibleChoiceBranches(page, issuePrefix, lang)) return;
    if (await auditVisibleNumericBranches(page, issuePrefix, lang)) return;
  }

  // Construction boards cannot be unlocked by the generic click fallback:
  // their cards must be placed in a deterministic order. Run this helper in
  // every viewport and every traversal path, while the wider wrong-branch
  // matrix for ordinary choice/numeric questions remains desktop-only.
  if (await auditVisibleBuildBranches(page, issuePrefix, lang)) return;
  if (await auditVisibleDigitSlots(page, issuePrefix, lang)) return;

  const clickCounts = new Map();
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const inputs = inLesson(page, 'input[inputmode="numeric"]:not(:disabled), input[type="number"]:not(:disabled)');
    for (let index = 0; index < await inputs.count(); index += 1) {
      const input = inputs.nth(index);
      if (!(await input.isVisible())) continue;
      const answer = await deterministicNumericAnswer(page, input, issuePrefix);
      await input.fill(answer);
      await input.press('Enter');
      await sleep(40);
      if (await next.isEnabled()) {
        await assertUnlockedFeedbackWhenPresent(page, issuePrefix, lang);
        return;
      }
    }

    const ranges = inLesson(page, 'input[type="range"]:not(:disabled)');
    for (let index = 0; index < await ranges.count(); index += 1) {
      const range = ranges.nth(index);
      if (!(await range.isVisible())) continue;
      await range.focus();
      await range.press('ArrowRight');
      await sleep(40);
      if (await next.isEnabled()) {
        await assertUnlockedFeedbackWhenPresent(page, issuePrefix, lang);
        return;
      }
    }

    const buttons = inLesson(page, 'button');
    let clicked = false;
    let waitingForPointer = false;
    for (let index = 0; index < await buttons.count(); index += 1) {
      const button = buttons.nth(index);
      if (!(await button.isVisible()) || !(await button.isEnabled())) continue;
      const excluded = await button.evaluate((element) => Boolean(element.closest(
        '.stage-nav, .audio-controls, .lesson-language, .preview-language, .g4-title-claim',
      )));
      if (excluded) continue;
      if (!(await pointerCanReach(button))) {
        waitingForPointer = true;
        continue;
      }
      const textValue = normalizeText(await button.innerText());
      const aria = normalizeText(await button.getAttribute('aria-label'));
      const key = `${index}:${textValue}:${aria}`;
      const used = clickCounts.get(key) ?? 0;
      if (used >= 6) continue;
      clickCounts.set(key, used + 1);
      await button.click({ timeout: 2_000 });
      await sleep(35);
      clicked = true;
      if (await next.isEnabled()) {
        await assertUnlockedFeedbackWhenPresent(page, issuePrefix, lang);
        return;
      }
    }
    if (!clicked && !waitingForPointer) break;
    if (!clicked) await sleep(35);
  }

  const count = await currentScreenCount(page);
  const candidates = await visibleTheoryButtonDiagnostics(page);
  throw new Error(issuePrefix + ': ' + count.text + ' tabiiy interaksiya bilan ochilmadi; candidates=' + JSON.stringify(candidates));
}

async function finalReflectionIsRemoved(page, lesson) {
  if (!NO_FINAL_REFLECTION_LESSONS.has(lesson?.file)) return false;
  return Boolean(await firstVisible(inLesson(page, '[data-g4-final-reflection="none"]')));
}

async function assertStandardFinalLayout(page, lesson, issuePrefix) {
  const finale = await firstVisible(inLesson(page, '.finale-screen[data-g4-final-reflection="none"]'));
  if (!finale) throw new Error(issuePrefix + ': standart no-reflection finale topilmadi');
  const contract = await finale.evaluate((root, file) => {
    const takeaways = [...root.querySelectorAll('.finale-takeaway')];
    const mastery = root.querySelector('.finale-mastery');
    const actions = root.querySelector('.finale-actions');
    const proof = root.querySelector('.finale-proof');
    const bridge = root.querySelector('.finale-bridge');
    const layout = root.querySelector('.finale-layout');
    const rect = (element) => element?.getBoundingClientRect() ?? null;
    const layoutRect = rect(layout);
    const masteryRect = rect(mastery);
    const actionsRect = rect(actions);
    const proofRect = rect(proof);
    const bridgeRect = rect(bridge);
    const desktop = window.innerWidth >= 768;
    const titleBeforeSteps = desktop
      ? Boolean(actionsRect && masteryRect && actionsRect.left < masteryRect.left)
      : Boolean(actionsRect && masteryRect && actionsRect.top <= masteryRect.top + 1);
    const spanningRows = Boolean(
      layoutRect
      && proofRect
      && bridgeRect
      && proofRect.width >= layoutRect.width * 0.84
      && bridgeRect.width >= layoutRect.width * 0.84,
    );
    const terminal = bridge?.getAttribute('data-g4-terminal') === 'true';
    const bridgeText = bridge?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    return {
      takeaways: takeaways.length,
      hasHeading: Boolean(root.querySelector('.finale-heading')),
      hasMastery: Boolean(mastery),
      hasActions: Boolean(actions),
      hasProof: Boolean(proof),
      hasBridge: Boolean(bridge),
      layoutMarker: root.getAttribute('data-g4-final-layout'),
      titleBeforeSteps,
      spanningRows,
      terminal,
      bridgeText,
      file,
    };
  }, lesson.file);

  if (contract.takeaways !== 3) {
    throw new Error(issuePrefix + `: finale takeaway soni ${contract.takeaways}, kutilgan 3`);
  }
  if (!contract.hasHeading || !contract.hasMastery || !contract.hasActions
    || !contract.hasProof || !contract.hasBridge) {
    throw new Error(issuePrefix + ': finale heading/mastery/actions/proof/bridge tarkibi to\'liq emas');
  }
  if (lesson.file !== 'Dars02.jsx' && contract.layoutMarker !== 'title-left-steps-right') {
    throw new Error(issuePrefix + ': title-left-steps-right layout markeri yo\'q');
  }
  if (!contract.titleBeforeSteps) throw new Error(issuePrefix + ': unvon qismi takeaway qismidan oldin/chapda emas');
  if (!contract.spanningRows) throw new Error(issuePrefix + ': proof yoki bridge to\'liq kenglikni egallamadi');
}

async function naturallyRevealStrictFinalReward(page, lesson, issuePrefix) {
  if (await finalReflectionIsRemoved(page, lesson)) {
    await assertStandardFinalLayout(page, lesson, issuePrefix);
    let claim = await firstVisible(inLesson(page, '.g4-title-claim'));
    if (!claim) throw new Error(issuePrefix + ': no-reflection final title claim topilmadi');
    if (await lessonAudioIsMuted(page) && !(await unmuteLesson(page))) {
      throw new Error(issuePrefix + ': no-reflection final audio qayta yoqilmadi');
    }
    // A freshly mounted shared finale may already be narrating all five
    // summary segments, in which case the control intentionally shows no
    // Replay action yet. The disabled claim below is the authoritative
    // in-flight audio gate; replay is used when it is already available.
    await replayLessonAudio(page);
    claim = await firstVisible(inLesson(page, '.g4-title-claim'));
    if (!claim || !(await waitForDisabledLocator(claim))) {
      throw new Error(issuePrefix + ': no-reflection final claim audio davomida yopilmadi');
    }
    const lingeringReflection = await firstVisible(inLesson(
      page,
      '.finale-reflection, .final-reflection, [data-g4-role="reflection"], .reflection-options',
    ));
    if (lingeringReflection) throw new Error(issuePrefix + ': no-reflection finalda eski reflection UI bor');
    await muteLesson(page);
    claim = await firstVisible(inLesson(page, '.g4-title-claim'));
    if (!claim || !(await waitForEnabledLocator(claim))) {
      const audioControls = await inLesson(page, '.audio-controls button, .audio-indicator button')
        .evaluateAll((buttons) => buttons.map((button) => ({
          label: button.getAttribute('aria-label'),
          text: button.textContent,
          disabled: button.disabled,
        })));
      throw new Error(
        issuePrefix + ': no-reflection final claim audio o\'chirilgach ochilmadi; controls='
        + JSON.stringify(audioControls),
      );
    }
    return;
  }
  await muteLesson(page);
  const rewardIsVisible = async () => {
    const claim = await firstVisible(inLesson(page, '.g4-title-claim'));
    if (!claim) return false;
    return Boolean(await firstVisible(inLesson(
      page,
      '.finale-reflection button, .final-reflection button, [data-g4-role="reflection"] button, .reflection-options button',
    )));
  };
  if (await rewardIsVisible()) return;

  const clickCounts = new Map();
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const buttons = inLesson(page, 'button');
    let clicked = false;
    for (let index = 0; index < await buttons.count(); index += 1) {
      const button = buttons.nth(index);
      if (!(await button.isVisible()) || !(await button.isEnabled())) continue;
      const excluded = await button.evaluate((element) => Boolean(element.closest(
        '.stage-nav, .audio-controls, .lesson-language, .preview-language, .g4-title-claim, '
          + '.finale-reflection, .final-reflection, [data-g4-role="reflection"], .reflection-options',
      )));
      if (excluded) continue;
      const key = `${index}:${normalizeText(await button.innerText())}:${normalizeText(await button.getAttribute('aria-label'))}`;
      const used = clickCounts.get(key) ?? 0;
      if (used >= 6) continue;
      clickCounts.set(key, used + 1);
      await button.click({ timeout: 2_000 });
      await sleep(35);
      clicked = true;
      if (await rewardIsVisible()) return;
    }
    if (!clicked) break;
  }
  const count = await currentScreenCount(page);
  throw new Error(issuePrefix + ': ' + count.text + ' final reward boshqaruvi tabiiy interaksiya bilan ochilmadi');
}

async function advanceTheoryNormallyOrFallback(page, next, issuePrefix) {
  if (await next.isEnabled()) {
    await clickEnabledTheoryButton(next, issuePrefix);
    return;
  }
  const mute = await firstVisible(inLesson(page, '.audio-controls button'));
  if (mute) {
    const label = normalizeText(await mute.getAttribute('aria-label'));
    if (/turn sound off/i.test(label)) {
      await mute.click();
      await sleep(30);
    }
  }
  if (await next.isEnabled()) {
    await clickEnabledTheoryButton(next, issuePrefix);
    return;
  }
  theoryGateFallbacks += 1;
  await forceClick(next);
}

async function waitForScreenChange(page, previous, timeout = 4_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const next = await currentScreenCount(page);
    if (next.text !== previous) return next;
    await sleep(20);
  }
  throw new Error('Theory screen ' + previous + ' dan keyingisiga o\'tmadi');
}

async function auditAnswerOrderLanguagePersistence(page, issuePrefix, currentCount, baselineGroups) {
  const baseline = JSON.stringify(answerOrderIdentity(baselineGroups));
  for (const code of ['ru', 'uz', 'en']) {
    await switchLessonLanguage(page, code);
    const afterSwitch = await currentScreenCount(page);
    if (afterSwitch.text !== currentCount.text) {
      throw new Error(
        `${issuePrefix}: ${code.toUpperCase()} tilida savol ekrani ${currentCount.text} dan ${afterSwitch.text} ga o'zgardi`,
      );
    }
    const switched = await visibleAnswerOrderSnapshot(page);
    validateAnswerOrderGroups(switched, `${issuePrefix} ${code.toUpperCase()}`);
    if (JSON.stringify(answerOrderIdentity(switched)) !== baseline) {
      throw new Error(`${issuePrefix}: ${code.toUpperCase()} tiliga o'tganda variant tartibi o'zgardi`);
    }
  }
}

async function auditSolvedAnswerOrderBackPersistence(page, issuePrefix, currentCount, baselineGroups) {
  const baseline = baselineGroups.length
    ? JSON.stringify(answerOrderStateIdentity(baselineGroups))
    : null;
  for (const code of ['ru', 'uz', 'en']) {
    await switchLessonLanguage(page, code);
    const afterSwitch = await currentScreenCount(page);
    if (afterSwitch.text !== currentCount.text) {
      throw new Error(
        `${issuePrefix}: yechimdan keyin ${code.toUpperCase()} tilida ekran `
          + `${currentCount.text} dan ${afterSwitch.text} ga o'zgardi`,
      );
    }
    const switched = await visibleAnswerOrderSnapshot(page);
    if (baseline === null) {
      if (switched.length) {
        throw new Error(`${issuePrefix}: ${code.toUpperCase()} tilida yashirilgan yechilgan kartalar qayta ochildi`);
      }
    } else {
      validateAnswerOrderGroups(switched, `${issuePrefix} solved ${code.toUpperCase()}`);
      if (JSON.stringify(answerOrderStateIdentity(switched)) !== baseline) {
        throw new Error(
          `${issuePrefix}: ${code.toUpperCase()} tiliga o'tganda yechilgan source javob holati o'zgardi`,
        );
      }
    }
  }
  const next = await theoryNextButton(page);
  if (!(await waitForEnabledLocator(next, 4_000))) {
    throw new Error(`${issuePrefix}: yechilgan savolda Next ochilmadi`);
  }
  await clickEnabledTheoryButton(next, issuePrefix, false);
  const advanced = await waitForScreenChange(page, currentCount.text);
  const back = inLesson(page, '.stage-nav button').first();
  if (!(await back.isVisible()) || !(await back.isEnabled())) throw new Error(`${issuePrefix}: Back ishlamaydi`);
  await back.click();
  const returned = await waitForScreenChange(page, advanced.text);
  if (returned.text !== currentCount.text) throw new Error(`${issuePrefix}: Back boshqa ekranga qaytardi`);

  // FeedbackBlock remounts with `open=false` and reveals a stored solution
  // after two animation frames. Wait for that restored state before checking
  // the persistent disabled/green answer-card contract.
  const restoredSolution = await waitForVisibleMatch(inLesson(
    page,
    '[data-g4-feedback="solution"], [data-g4-feedback="correct"], [data-g4-feedback="diagnostic"]',
  ), 4_000);
  if (!restoredSolution) {
    throw new Error(`${issuePrefix}: Backdan keyin yechilgan feedback holati tiklanmadi`);
  }

  const restored = await visibleAnswerOrderSnapshot(page);
  if (baseline === null) {
    if (restored.length) {
      throw new Error(`${issuePrefix}: yechimda yashirilgan kartalar Backdan keyin qayta ochildi`);
    }
  } else {
    validateAnswerOrderGroups(restored, `${issuePrefix} Back`);
    const restoredIdentity = JSON.stringify(answerOrderStateIdentity(restored));
    if (restoredIdentity !== baseline) {
      throw new Error(
        `${issuePrefix}: Backdan keyin variant tartibi yoki source javob holati o'zgardi `
          + `(old=${baseline}, new=${restoredIdentity})`,
      );
    }
  }
  const restoredChoiceCount = restored.reduce((sum, group) => sum + group.order.length, 0);
  await assertPostCorrectChoiceState(
    page.locator(LESSON_ROOT),
    `${issuePrefix} Back post-correct`,
    restoredChoiceCount,
  );
  const forward = await theoryNextButton(page);
  if (!(await waitForEnabledLocator(forward, 4_000))) {
    throw new Error(`${issuePrefix}: Backdan keyin yechilgan savol Next holatini saqlamadi`);
  }
  await clickEnabledTheoryButton(forward, `${issuePrefix} restored`, false);
  await waitForScreenChange(page, returned.text);
  answerOrderPersistenceChecked += 1;
}

async function runTheoryTraversal(page, diagnostics, lesson) {
  const prefix = 'deep theory ' + lesson.file;
  diagnostics.reset();
  await openLesson(page, lesson, 'en');
  const firstCount = await currentScreenCount(page);
  const visited = [];
  const auditedMatchingScreens = new Set();
  const visibleAnswerGroups = [];
  let answerOrderLanguageChecked = false;
  let answerOrderStateChecked = false;
  let observedMedalTier = null;

  for (let expected = 1; expected <= firstCount.total; expected += 1) {
    const count = await currentScreenCount(page);
    if (count.current !== expected || count.total !== firstCount.total) {
      throw new Error(prefix + ': screen tartibi ' + count.text + ', kutilgan ' + expected + ' / ' + firstCount.total);
    }
    visited.push(count.current);
    theoryScreensTraversed += 1;
    const screenAnswerGroups = await auditVisibleAnswerOrders(page, `${prefix} screen ${expected}`);
    if (screenAnswerGroups.length && !answerOrderLanguageChecked && isStrictEtalonLesson(lesson)) {
      await auditAnswerOrderLanguagePersistence(
        page,
        `${prefix} screen ${expected} language persistence`,
        count,
        screenAnswerGroups,
      );
      answerOrderLanguageChecked = true;
    }
    const snapshot = await lessonSnapshot(page);
    const issues = snapshotIssues(snapshot, 'en');
    issues.forEach((issue) => failures.push(prefix + ' screen ' + expected + ': ' + issue));

    let next = await theoryNextButton(page);
    if (isStrictEtalonLesson(lesson) && !auditedMatchingScreens.has(count.current)) {
      const audited = await auditVisibleTheoryMatching(page, prefix + ' screen ' + expected);
      if (audited) auditedMatchingScreens.add(count.current);
    }
    if (expected < firstCount.total) {
      if (isStrictEtalonLesson(lesson)) {
        const observedGroups = await collectAnswerOrderGroupsDuring(
          page,
          `${prefix} screen ${expected}`,
          () => naturallyUnlockStrictTheoryScreen(page, prefix + ' screen ' + expected, {
            auditBranches: THEORY_CONTINUE_UNLOCKED,
            lang: 'en',
          }),
        );
        visibleAnswerGroups.push(...observedGroups);

        let advancedByPersistenceAudit = false;
        const resetsOnReturn = theoryScreenMeta.get(lesson.file)?.[expected - 1]?.resetOnReturn === true;
        if (screenAnswerGroups.length && !answerOrderStateChecked && !resetsOnReturn) {
          const solvedFeedback = await firstVisible(inLesson(
            page,
            '[data-g4-feedback="solution"], [data-g4-feedback="correct"], [data-g4-feedback="diagnostic"]',
          ));
          if (!solvedFeedback) {
            throw new Error(`${prefix} screen ${expected} persistence: yechilgan feedback markeri yo'q`);
          }
          const solvedGroups = await visibleAnswerOrderSnapshot(page);
          validateAnswerOrderGroups(solvedGroups, `${prefix} screen ${expected} solved`);
          await auditSolvedAnswerOrderBackPersistence(
            page,
            `${prefix} screen ${expected} persistence`,
            count,
            solvedGroups,
          );
          answerOrderStateChecked = true;
          advancedByPersistenceAudit = true;
        }
        if (!advancedByPersistenceAudit) {
          next = await theoryNextButton(page);
          await clickEnabledTheoryButton(next, prefix + ' screen ' + expected, false);
          await waitForScreenChange(page, count.text);
        }
      } else {
        visibleAnswerGroups.push(...screenAnswerGroups);
        await advanceTheoryNormallyOrFallback(page, next, prefix + ' screen ' + expected);
        await waitForScreenChange(page, count.text);
      }
    } else {
      if (isStrictEtalonLesson(lesson)) {
        const observedGroups = await collectAnswerOrderGroupsDuring(
          page,
          `${prefix} final screen ${expected}`,
          () => naturallyRevealStrictFinalReward(page, lesson, prefix + ' final screen ' + expected),
        );
        visibleAnswerGroups.push(...observedGroups);
      } else {
        visibleAnswerGroups.push(...screenAnswerGroups);
      }
      let claim = await firstVisible(inLesson(page, '.g4-title-claim'));
      const revealBeforeClaim = await firstVisible(page.locator(TITLE_OVERLAY_SELECTOR));
      const cardBeforeClaim = await firstVisible(inLesson(page, '[data-g4-role="title-card"]'));
      if (revealBeforeClaim || cardBeforeClaim) throw new Error(prefix + ': unvon claim bosilishidan oldin chiqdi');
      if (isStrictEtalonLesson(lesson) && !claim) throw new Error(prefix + ': majburiy Unvonni olish tugmasi topilmadi');
      if (claim) {
        const reflectionRemoved = await finalReflectionIsRemoved(page, lesson);
        if (isStrictEtalonLesson(lesson) && !reflectionRemoved) {
          const reflection = await firstVisible(inLesson(
            page,
            '.finale-reflection button, .final-reflection button, [data-g4-role="reflection"] button, .reflection-options button',
          ));
          if (!reflection) throw new Error(prefix + ': claimdan oldingi reflection tanlovi topilmadi');
          if (await claim.isEnabled()) throw new Error(prefix + ': reflection tanlanmasidan claim faol');
          await muteLesson(page);
          await reflection.click();
          await sleep(50);
          claim = await firstVisible(inLesson(page, '.g4-title-claim'));
          const preClaimBack = inLesson(page, '.stage-nav button').first();
          if (!(await preClaimBack.isVisible()) || !(await preClaimBack.isEnabled())) {
            throw new Error(prefix + ': reflectiondan keyingi Back tugmasi ishlamaydi');
          }
          await preClaimBack.click();
          const preClaimPrevious = await waitForScreenChange(page, count.text);
          const preClaimForward = await theoryNextButton(page);
          if (!(await preClaimForward.isEnabled())) {
            await naturallyUnlockStrictTheoryScreen(page, prefix + ' pre-claim-back ' + preClaimPrevious.text);
          }
          await clickEnabledTheoryButton(preClaimForward, prefix + ' pre-claim-back', false);
          await waitForScreenChange(page, preClaimPrevious.text);
          if (await firstVisible(page.locator(TITLE_OVERLAY_SELECTOR))
            || await firstVisible(inLesson(page, '[data-g4-role="title-card"]'))) {
            throw new Error(prefix + ': pre-claim Back→Forward unvonni avtomatik ochdi');
          }
          const restoredReflection = await firstVisible(inLesson(
            page,
            '.finale-reflection button[aria-pressed="true"], .final-reflection button[aria-pressed="true"], '
              + '[data-g4-role="reflection"] button[aria-pressed="true"], .reflection-options button[aria-pressed="true"], '
              + '.finale-reflection button.picked, .finale-reflection button.is-selected, .finale-reflection button.reflection-active, .finale-reflection button.reflection-selected, '
              + '.final-reflection button.picked, .final-reflection button.is-selected, .final-reflection button.reflection-active, .final-reflection button.reflection-selected, '
              + '[data-g4-role="reflection"] button.picked, [data-g4-role="reflection"] button.is-selected, '
              + '[data-g4-role="reflection"] button.selected, .final-reflection button.selected, .finale-reflection button.selected, '
              + '[data-g4-role="reflection"] button.reflection-active, [data-g4-role="reflection"] button.reflection-selected, '
              + '.reflection-options button.picked, .reflection-options button.is-selected, .reflection-options button.reflection-active, .reflection-options button.reflection-selected',
          ));
          if (!restoredReflection) throw new Error(prefix + ': pre-claim Back→Forward reflection tanlovini saqlamadi');
          await muteLesson(page);
          claim = await firstVisible(inLesson(page, '.g4-title-claim'));
          if (!claim || !(await waitForEnabledLocator(claim, 4_000))) {
            throw new Error(prefix + ': pre-claim Back→Forward claim gate saqlanmadi');
          }
        } else if (reflectionRemoved) {
          const lingeringReflection = await firstVisible(inLesson(
            page,
            '.finale-reflection, .final-reflection, [data-g4-role="reflection"], .reflection-options',
          ));
          if (lingeringReflection) throw new Error(prefix + ': no-reflection finalda eski reflection UI saqlanib qolgan');
          await muteLesson(page);
          claim = await firstVisible(inLesson(page, '.g4-title-claim'));
          if (!claim || !(await waitForEnabledLocator(claim, 4_000))) {
            throw new Error(prefix + ': no-reflection finalda claim audio tugagach ochilmadi');
          }
        } else if (!(await claim.isEnabled())) {
          await muteLesson(page);
          const reflection = await firstVisible(inLesson(page, '.finale-reflection button, .final-reflection button, [data-g4-role="reflection"] button, .reflection-options button'));
          if (reflection) await reflection.click();
          await sleep(50);
          claim = await firstVisible(inLesson(page, '.g4-title-claim'));
        }
        if (await next.isEnabled()) throw new Error(prefix + ': Finish claimdan oldin faol');
        if (!(await claim.isEnabled())) throw new Error(prefix + ': final gate tugagach claim ochilmadi');
        await claim.click({ timeout: 8_000 });
        const revealOverlay = page.locator(TITLE_OVERLAY_SELECTOR);
        await revealOverlay.waitFor({ state: 'visible', timeout: 2_000 });
        await assertRankOverlayVisual(page, `${prefix} rank overlay`);
        const reducedRevealStarted = Date.now();
        await revealOverlay.waitFor({ state: 'hidden', timeout: 1_200 });
        const reducedRevealElapsed = Date.now() - reducedRevealStarted;
        if (isStrictEtalonLesson(lesson) && reducedRevealElapsed > 650) {
          throw new Error(prefix + `: reduced-motion reveal ${reducedRevealElapsed}ms, 650ms limitdan oshdi`);
        }
        const titleCard = inLesson(page, '[data-g4-role="title-card"]');
        await titleCard.waitFor({ state: 'visible', timeout: 4_000 });
        await assertPersistentRewardVisual(titleCard, `${prefix} title card`);
        if (lesson.file === 'Dars51.jsx') observedMedalTier = await titleCard.getAttribute('data-medal-tier');
        const rewardParts = await titleCard.evaluate((element) => ({
          bit: Boolean(element.querySelector('[data-g4-role~="reward-bit"]')),
          noBitContract: element.getAttribute('data-g4-title-bit') === 'absent',
          medal: Boolean(element.querySelector('[data-g4-role~="reward-medal"]')),
          confetti: Boolean(element.querySelector('[data-g4-role~="reward-confetti"]')),
        }));
        if ((rewardParts.noBitContract ? rewardParts.bit : !rewardParts.bit)
          || !rewardParts.medal || !rewardParts.confetti) {
          throw new Error(prefix + ': persistent reward card Bit/medal/confetti to‘liq emas');
        }
        if (!(await next.isEnabled())) throw new Error(prefix + ': Finish claimdan keyin ochilmadi');
        if (isStrictEtalonLesson(lesson)) {
          const navButtons = inLesson(page, '.stage-nav button');
          const back = navButtons.first();
          if (!(await back.isVisible()) || !(await back.isEnabled())) throw new Error(prefix + ': final Back tugmasi ishlamaydi');
          await back.click();
          const previous = await waitForScreenChange(page, count.text);
          const forward = await theoryNextButton(page);
          if (!(await forward.isEnabled())) await naturallyUnlockStrictTheoryScreen(page, prefix + ' final-back ' + previous.text);
          await clickEnabledTheoryButton(forward, prefix + ' final-back', false);
          await waitForScreenChange(page, previous.text);
          if (await firstVisible(page.locator(TITLE_OVERLAY_SELECTOR))) {
            throw new Error(prefix + ': finalga qaytganda full-screen reveal avtomatik takrorlandi');
          }
          await inLesson(page, '[data-g4-role="title-card"]').waitFor({ state: 'visible', timeout: 2_000 });
          next = await theoryNextButton(page);
          if (!(await next.isEnabled())) {
            throw new Error(prefix + ': finalga qaytganda olingan unvon saqlansa ham Finish audio bilan qayta bloklandi');
          }
          await muteLesson(page);
          if (SCREENSHOT_DIR) {
            await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${lesson.file.replace('.jsx', '')}-en-desktop-final.png`) });
          }
        }
      }
      const finishLabel = normalizeText(await next.innerText());
      if (!/finish|complete/i.test(finishLabel) || hasCyrillic(finishLabel)) {
        throw new Error(prefix + ': final action English Finish emas: ' + finishLabel);
      }
      await diagnostics.flush();
      if (diagnostics.completionCalls.length) {
        throw new Error(prefix + ': onFinished explicit Finishdan oldin chaqirildi');
      }
      if (await next.isEnabled()) {
        await next.evaluate((element) => {
          element.click();
          element.click();
        });
      } else if (isStrictEtalonLesson(lesson)) {
        throw new Error(prefix + ': Finish claimdan keyin ham bloklangan');
      } else {
        theoryGateFallbacks += 1;
        const invoked = await invokeNearestReactCallback(next, 'finishLesson', 2);
        if (!invoked) await forceClick(next, 2);
      }
    }
  }

  if (new Set(visited).size !== firstCount.total) {
    throw new Error(prefix + ': ' + visited.length + '/' + firstCount.total + ' unique screen traversed');
  }
  if (lesson.file !== 'Dars01.jsx') {
    if (!visibleAnswerGroups.length) throw new Error(prefix + ': aralashtiriladigan javob kartalari topilmadi');
    const expectedAnswerGroups = EXPECTED_ANSWER_ORDER_GROUPS.get(lesson.file);
    const managedAnswerGroups = visibleAnswerGroups.filter((group) => !group.naturalOrder);
    if (managedAnswerGroups.length !== expectedAnswerGroups) {
      throw new Error(
        `${prefix}: ${managedAnswerGroups.length} ta shuffled savol kuzatildi, kutilgan ${expectedAnswerGroups}`,
      );
    }
    if (!answerOrderLanguageChecked) throw new Error(prefix + ': variant order til almashtirishda tekshirilmadi');
    if (!answerOrderStateChecked) throw new Error(prefix + ': variant order/state til va Back orqali tekshirilmadi');
    assertBalancedVisibleAnswerPositions(visibleAnswerGroups, prefix);
  }
  const payload = await validateCompletion(prefix, diagnostics, lesson);
  if (lesson.file !== 'Dars01.jsx') {
    const comparedGroups = assertDisplayedOptionSourceAlignment(visibleAnswerGroups, payload, prefix);
    if (!comparedGroups && !ANSWER_SOURCE_ALIGNMENT_EXEMPT.has(lesson.file)) {
      throw new Error(prefix + ': DOM option matni va LMS payload source-index mosligi tekshirilmadi');
    }
  }
  if (lesson.file === 'Dars51.jsx') {
    const expectedMedalTier = payload.correctAnswers === 5 ? 'gold' : payload.correctAnswers === 4 ? 'silver' : 'bronze';
    if (observedMedalTier !== expectedMedalTier) {
      throw new Error(`${prefix}: medal tier ${observedMedalTier ?? 'yo‘q'}, kutilgan ${expectedMedalTier}`);
    }
  }
  diagnostics.pageErrors.forEach((message) => failures.push(prefix + ': pageerror ' + message));
}

async function runProgressPersistence(browser) {
  const first = lessons.find((lesson) => lesson.section === 'nazariy');
  if (!first) return;
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await openLesson(page, first, 'uz');
    const before = await currentScreenCount(page);
    const next = await theoryNextButton(page);
    if (isStrictEtalonLesson(first)) {
      await naturallyUnlockStrictTheoryScreen(page, 'progress ' + first.file, { lang: 'uz' });
      await clickEnabledTheoryButton(next, 'progress ' + first.file, false);
    } else await forceClick(next);
    const advanced = await waitForScreenChange(page, before.text);
    for (const code of ['ru', 'en', 'uz']) {
      await switchLessonLanguage(page, code);
      const afterSwitch = await currentScreenCount(page);
      if (advanced.text !== afterSwitch.text) {
        failures.push('progress: ' + code + 'ga o\'tganda ' + advanced.text + ' -> ' + afterSwitch.text);
      }
    }
  } catch (error) {
    failures.push('progress: ' + error.message);
  } finally {
    await context.close();
  }
}

async function runInvalidLanguageFallback(browser) {
  const lesson = lessons[0];
  if (!lesson) return;
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await openLesson(page, lesson, 'uz');
    await muteLesson(page);
    await sleep(100);
    const uzSnapshot = await lessonSnapshot(page);
    await openLesson(page, lesson, 'xx');
    await muteLesson(page);
    await sleep(100);
    const invalidSnapshot = await lessonSnapshot(page);
    if (invalidSnapshot.activeLanguage !== 'UZ') {
      failures.push('invalid lang: active language ' + (invalidSnapshot.activeLanguage ?? 'none') + ', kutilgan UZ');
    }
    if (invalidSnapshot.contentCanonicalText !== uzSnapshot.contentCanonicalText) {
      failures.push('invalid lang: ?lang=xx lesson state explicit UZ bilan mos emas');
    }
  } catch (error) {
    failures.push('invalid lang: ' + error.message);
  } finally {
    await context.close();
  }
}

async function muteLesson(page) {
  const controls = inLesson(page, '.audio-controls button, .audio-indicator button, [data-audio-control="mute"]');
  const count = await controls.count();
  for (let index = 0; index < count; index += 1) {
    const button = controls.nth(index);
    if (!(await button.isVisible())) continue;
    const label = normalizeText(await button.getAttribute('aria-label'));
    if (/mute|sound off|turn sound off|ovozni o'ch|выключить звук/i.test(label)) {
      await button.click();
      await sleep(40);
      return;
    }
  }
}

async function lessonAudioIsMuted(page) {
  const controls = inLesson(page, '.audio-controls button, .audio-indicator button, [data-audio-control="mute"]');
  for (let index = 0; index < await controls.count(); index += 1) {
    const button = controls.nth(index);
    if (!(await button.isVisible())) continue;
    const label = normalizeText(await button.getAttribute('aria-label'));
    const icon = normalizeText(await button.innerText());
    if (icon.includes('🔇') || /turn sound on|ovozni yoqish|включить звук/i.test(label)) return true;
  }
  return false;
}

async function unmuteLesson(page) {
  const controls = inLesson(page, '.audio-controls button, .audio-indicator button, [data-audio-control="mute"]');
  for (let index = 0; index < await controls.count(); index += 1) {
    const button = controls.nth(index);
    if (!(await button.isVisible())) continue;
    const label = normalizeText(await button.getAttribute('aria-label'));
    const icon = normalizeText(await button.innerText());
    if (icon.includes('🔇') || /turn sound on|ovozni yoqish|включить звук/i.test(label)) {
      await button.click();
      await sleep(40);
      return true;
    }
  }
  return false;
}

async function replayLessonAudio(page, timeout = 2_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const controls = inLesson(page, '.audio-controls button, .audio-indicator button');
    for (let index = 0; index < await controls.count(); index += 1) {
      const button = controls.nth(index);
      if (!(await button.isVisible())) continue;
      const label = normalizeText(await button.getAttribute('aria-label'));
      if (/replay|qayta eshitish|повторить/i.test(label)) {
        await button.click();
        await sleep(40);
        return true;
      }
    }
    await sleep(25);
  }
  return false;
}

async function waitForEnabledCard(cards, timeout = 4_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    for (let index = 0; index < await cards.count(); index += 1) {
      if (await cards.nth(index).isEnabled()) return;
    }
    await sleep(30);
  }
  throw new Error('hook answer cards audio/visual introdan keyin ochilmadi');
}

function strictHookAnswerCards(page, lesson) {
  // Dars12–21 retain the canonical hook marker on the question wrapper (or an
  // sr-only description); their real, visible answer branches are `.option`
  // buttons. Keep this family mapping narrow so malformed answer-card markup
  // in other lessons cannot silently pass the hook contract.
  if (/^Dars(?:1[2-9]|2[0-9]|3[0-9]|4[01])\.jsx$/.test(lesson.file)) {
    return inLesson(page, '.option');
  }
  return inLesson(page, '[data-g4-role="answer-card"]');
}

async function runPracticeProgressPersistence(browser) {
  const practiceLessons = lessons.filter((item) => requiresPracticeRestartAudit(item));
  if (!practiceLessons.length) return;
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    for (const lesson of practiceLessons) {
      try {
        const tasks = practiceTasks.get(lesson.file);
        activePracticeLang = 'uz';
        await openLesson(page, lesson, 'uz');
        await solvePracticeTask(page, tasks[0]);
        await clickCheck(page);
        const ready = await waitForPracticeOutcome(page);
        if (ready.kind !== 'ready') throw new Error('1-topshiriq yechilmadi');
        await ready.button.click();
        await waitForVisible(page, CHECK_ACTION);
        const counterSelector = '.p4-counter, .g4p-counter, .p4-task-top > span:first-child, .p4-root > header > div:last-child > b';
        const before = normalizeText(await inLesson(page, counterSelector).first().innerText());
        const beforeCount = parseScreenCount(before);
        if (beforeCount?.current !== 2 || beforeCount.total !== 10) throw new Error('task counter 2/10 emas: ' + before);
        for (const code of ['ru', 'en', 'uz']) {
          await page.locator('.lesson-language button', { hasText: code.toUpperCase() }).click();
          await waitForVisible(page, CHECK_ACTION);
          const after = normalizeText(await inLesson(page, counterSelector).first().innerText());
          const afterCount = parseScreenCount(after);
          if (afterCount?.current !== beforeCount.current || afterCount.total !== beforeCount.total) {
            failures.push('practice progress ' + lesson.file + ': ' + code + 'ga o\'tganda ' + before + ' -> ' + after);
          }
        }
      } catch (error) {
        failures.push('practice progress ' + lesson.file + ': ' + error.message);
      }
    }
  } finally {
    await context.close();
  }
}

// The lesson-specific distractor set is content, not presentation. Preserve
// approved two-, three- or four-choice hooks while enforcing one visual shell.
const strictHookCardContract = (lesson) => (
  lesson.file === 'Dars05.jsx'
    ? { min: 2, max: 2, minFontSize: 14, label: '2', labels: ['A', 'B'] }
    : lesson.file === 'Dars03.jsx'
      ? { min: 2, max: 2, minFontSize: 13, label: '2', labels: ['A', 'B'] }
    : lesson.file === 'Dars10.jsx'
      ? { min: 2, max: 2, minFontSize: 14, label: '2', labels: ['A', 'B'] }
    : { min: 2, max: 4, minFontSize: 14, label: '2–4' }
);

const strictHookRequiresCorrectAnswer = (lesson) => !/^Dars(?:1[2-6]|29|3[0-4]|3[6-9]|4[01])\.jsx$/.test(lesson.file);
const strictHookRequiresWrongBranch = (lesson) => !/^Dars(?:1[4-6]|1[8-9]|2[0-7]|29|3[0-4]|3[6-9]|4[01])\.jsx$/.test(lesson.file);
const strictHookUsesNeutralDiagnostic = (lesson) => /^Dars(?:29|3[0-4]|3[6-9]|4[01])\.jsx$/.test(lesson.file);

async function runStrictHookContracts(browser) {
  const strictLessons = lessons.filter(isStrictEtalonLesson);
  if (!strictLessons.length) return;
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    for (const lesson of strictLessons) {
      for (const lang of LANGS) {
        try {
          let wrongSeen = false;
          let solutionSeen = false;
          let expectedCardCount = null;
          for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
          await openLesson(page, lesson, lang);
          const hook = await waitForVisibleMatch(inLesson(page, '[data-g4-screen="hook"]'));
          const scene = await waitForVisibleMatch(inLesson(page, '[data-g4-role~="hook-scene"]'));
          if (!hook || !scene) throw new Error(`${lesson.file} ${lang}: canonical hook/scene marker topilmadi`);
          await assertCanonicalHookVisual(page, { name: 'desktop', width: 1366, height: 768 }, lesson, lang);
          const cards = strictHookAnswerCards(page, lesson);
          const cardCount = await cards.count();
          const cardContract = strictHookCardContract(lesson);
          if (cardCount < cardContract.min || cardCount > cardContract.max) {
            throw new Error(`${lesson.file} ${lang}: hook ${cardCount} ta answer card, kutilgan ${cardContract.label}`);
          }
          if (cardContract.labels) {
            const labels = await cards.evaluateAll((elements) => elements.map((element) => (
              element.querySelector('.hook-option-letter,.option-letter')?.textContent?.trim() ?? ''
            )));
            if (JSON.stringify(labels) !== JSON.stringify(cardContract.labels)) {
              throw new Error(`${lesson.file} ${lang}: hook belgilar ${labels.join(', ')}, kutilgan ${cardContract.labels.join(', ')}`);
            }
          }
          if (lesson.file === 'Dars03.jsx') {
            const metrics = await cards.evaluateAll((elements) => elements.map((element) => {
              const letter = element.querySelector('.option-letter');
              const text = element.querySelector('.option-text') ?? element.querySelector('span:last-child');
              const rect = element.getBoundingClientRect();
              return {
                top: rect.top,
                width: rect.width,
                letterSize: Number.parseFloat(getComputedStyle(letter).fontSize),
                textSize: Number.parseFloat(getComputedStyle(text).fontSize),
              };
            }));
            if (metrics.some((item) => item.letterSize !== 13 || item.textSize !== 13)) {
              throw new Error(`${lesson.file} ${lang}: A/B yoki variant shrifti 13px emas (${JSON.stringify(metrics)})`);
            }
            if (Math.abs(metrics[0].top - metrics[1].top) > 2 || Math.abs(metrics[0].width - metrics[1].width) > 2) {
              throw new Error(`${lesson.file} ${lang}: ikki variant bitta teng qatorda emas (${JSON.stringify(metrics)})`);
            }
          }
          if (lesson.file === 'Dars06.jsx') {
            const structure = await hook.evaluate((root) => {
              const selectors = [
                '[data-g4-role="hook-topic"]',
                '[data-g4-role="hook-title"]',
                '[data-g4-role="hook-question"]',
                '[data-g4-role~="hook-scene"]',
                '[data-g4-role="answer-card"]',
              ];
              const nodes = selectors.map((selector) => root.querySelector(selector));
              return {
                missing: selectors.filter((_, index) => !nodes[index]),
                ordered: nodes.every(Boolean) && nodes.slice(0, -1).every((node, index) => (
                  Boolean(node.compareDocumentPosition(nodes[index + 1]) & Node.DOCUMENT_POSITION_FOLLOWING)
                )),
                nestedModelPanel: Boolean(nodes[3]?.querySelector('.model-panel')),
              };
            });
            if (structure.missing.length) {
              throw new Error(`${lesson.file} ${lang}: hook etalon structure markerlari yetishmaydi (${structure.missing.join(', ')})`);
            }
            if (!structure.ordered) throw new Error(`${lesson.file} ${lang}: hook tartibi topic → title → question → scene → answers emas`);
            if (structure.nestedModelPanel) throw new Error(`${lesson.file} ${lang}: ko'k hook scene ichida .model-panel qolgan`);
          }
          const fontSizes = await cards.evaluateAll((elements) => elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize)));
          if (fontSizes.some((fontSize) => !Number.isFinite(fontSize) || fontSize < cardContract.minFontSize)) {
            throw new Error(`${lesson.file} ${lang}: hook answer shrifti ${cardContract.minFontSize}px dan kichik (${fontSizes.join(', ')})`);
          }
          if (await firstVisible(scene.locator('.bit-dark-speech, [data-g4-role="bit-transcript"]'))) {
            throw new Error(`${lesson.file} ${lang}: Bit replikasi hookda yozma ko‘rsatilgan; u faqat audioda qolishi kerak`);
          }
          if (expectedCardCount === null) expectedCardCount = cardCount;
          if (cardCount !== expectedCardCount) throw new Error(`${lesson.file} ${lang}: hook card soni qayta mountda o'zgardi`);
          if (optionIndex >= cardCount) break;
          await muteLesson(page);
          await waitForEnabledCard(cards);
          await cards.nth(optionIndex).click();
          const feedback = inLesson(page, '[data-g4-feedback]');
          await feedback.first().waitFor({ state: 'visible', timeout: 2_000 });
          const rawKind = await feedback.first().getAttribute('data-g4-feedback');
          const neutralDiagnostic = strictHookUsesNeutralDiagnostic(lesson) && rawKind === 'diagnostic';
          const kind = neutralDiagnostic ? 'solution' : canonicalFeedbackKind(rawKind);
          if (!neutralDiagnostic) {
            await assertStrictFeedback(page, `strict hook ${lesson.file} ${lang}`, kind, lang);
            if (kind === 'solution') {
              const role = await feedback.first().getAttribute('data-g4-role');
              if (!String(role ?? '').split(/\s+/).includes('bit-answer-comment')) {
                throw new Error(`${lesson.file} ${lang}: choice solution BitAnswerComment emas`);
              }
            }
          }
          const feedbackText = normalizeText(await feedback.first().innerText());
          if (kind === 'wrong') {
            wrongSeen = true;
            const next = await theoryNextButton(page);
            if (!THEORY_CONTINUE_UNLOCKED && strictHookRequiresCorrectAnswer(lesson) && await next.isEnabled()) {
              throw new Error(`${lesson.file} ${lang}: wrong javobdan keyin Next ochildi`);
            }
          } else if (kind === 'solution') {
            solutionSeen = true;
            if (rawKind === 'solution') {
              const label = { uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' }[lang];
              if (!feedbackText.includes(label)) throw new Error(`${lesson.file} ${lang}: solution label ${label} yo'q`);
            }
          } else {
            throw new Error(`${lesson.file} ${lang}: noma'lum feedback turi ${kind}`);
          }
          const snapshot = await lessonSnapshot(page);
          snapshotIssues(snapshot, lang).forEach((issue) => failures.push(`strict hook ${lesson.file} ${lang}: ${issue}`));
          }
          if ((strictHookRequiresWrongBranch(lesson) && !wrongSeen) || !solutionSeen) {
            throw new Error(`${lesson.file} ${lang}: hook wrong=${wrongSeen}, solution=${solutionSeen}; ikkala branch ham shart`);
          }
        } catch (error) {
          failures.push(`strict hook ${lesson.file} ${lang}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    failures.push('strict hook: ' + error.message);
  } finally {
    await context.close();
  }
}

async function reachStrictFinalScreen(page, lesson, issuePrefix) {
  await openLesson(page, lesson, 'en');
  let count = await currentScreenCount(page);
  while (count.current < count.total) {
    await naturallyUnlockStrictTheoryScreen(page, `${issuePrefix} screen ${count.current}`);
    // Generic unlock helpers may replace the current CTA while they advance a
    // multi-step interaction. Resolve the live button after unlock so the
    // pointer assertion never targets a detached element.
    const liveNext = await theoryNextButton(page);
    await clickEnabledTheoryButton(liveNext, `${issuePrefix} screen ${count.current}`, false);
    count = await waitForScreenChange(page, count.text);
  }
  await naturallyRevealStrictFinalReward(page, lesson, `${issuePrefix} final screen ${count.current}`);
  return count;
}

async function reachStrictFinalScreenFast(page, lesson, lang, issuePrefix) {
  if (!THEORY_CONTINUE_UNLOCKED) {
    throw new Error(issuePrefix + ': fast finale matrix review-navigation yoqilmagan');
  }
  await openLesson(page, lesson, lang);
  let count = await currentScreenCount(page);
  if (count.current >= count.total) return count;

  const remaining = count.total - count.current;
  const next = await theoryNextButton(page);
  await forceClick(next, remaining);
  const deadline = Date.now() + 3_000;
  while (Date.now() < deadline) {
    count = await currentScreenCount(page);
    if (count.current === count.total) return count;
    if (count.current > count.total) break;
    await sleep(20);
  }

  // A lesson-specific button wrapper may collapse repeated callbacks into one
  // update. Fall back to live one-screen callbacks while keeping this mode
  // independent from question mechanics.
  count = await currentScreenCount(page);
  while (count.current < count.total) {
    const liveNext = await theoryNextButton(page);
    await forceClick(liveNext);
    count = await waitForScreenChange(page, count.text);
  }
  return count;
}

async function runFinaleMatrix(browser) {
  const finaleLessons = lessons.filter((lesson) => (
    lesson.section === 'nazariy' && NO_FINAL_REFLECTION_LESSONS.has(lesson.file)
  ));
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: 'reduce',
    });
    await installSpeechMock(context);
    const page = await context.newPage();
    const diagnostics = monitorPage(page);
    try {
      for (const lesson of finaleLessons) {
        for (const lang of LANGS) {
          const prefix = `finale matrix ${viewport.name} ${lesson.file} ${lang}`;
          diagnostics.reset();
          try {
            const count = await reachStrictFinalScreenFast(page, lesson, lang, prefix);
            await naturallyRevealStrictFinalReward(page, lesson, prefix);
            const finishBeforeClaim = await theoryNextButton(page);
            if (await finishBeforeClaim.isEnabled()) {
              throw new Error(prefix + ': Finish unvondan oldin ochiq');
            }

            const beforeClaim = await lessonSnapshot(page);
            snapshotIssues(beforeClaim, lang).forEach((issue) => failures.push(`${prefix} preclaim: ${issue}`));
            const claim = await firstVisible(inLesson(page, '.g4-title-claim'));
            if (!claim || !(await claim.isEnabled())) throw new Error(prefix + ': title claim ochilmadi');
            await claim.click({ timeout: 8_000 });

            const overlay = page.locator(TITLE_OVERLAY_SELECTOR);
            await overlay.waitFor({ state: 'visible', timeout: 2_000 });
            await assertRankOverlayVisual(page, prefix);
            await overlay.waitFor({ state: 'hidden', timeout: 1_200 });
            const titleCard = inLesson(page, '[data-g4-role="title-card"]');
            await titleCard.waitFor({ state: 'visible', timeout: 2_000 });
            await assertPersistentRewardVisual(titleCard, prefix);
            const finishAfterClaim = await theoryNextButton(page);
            if (!(await finishAfterClaim.isEnabled())) throw new Error(prefix + ': Finish claimdan keyin ochilmadi');

            const claimed = await lessonSnapshot(page);
            snapshotIssues(claimed, lang).forEach((issue) => failures.push(`${prefix} claimed: ${issue}`));

            if (lang === 'en') {
              const navButtons = inLesson(page, '.stage-nav button');
              const back = await firstVisible(navButtons);
              if (!back || !(await back.isEnabled())) throw new Error(prefix + ': final Back ishlamaydi');
              await back.click();
              const previous = await waitForScreenChange(page, count.text);
              const forward = await theoryNextButton(page);
              await forceClick(forward);
              await waitForScreenChange(page, previous.text);
              if (await firstVisible(page.locator(TITLE_OVERLAY_SELECTOR))) {
                throw new Error(prefix + ': Back qaytishida reveal takrorlandi');
              }
              await inLesson(page, '[data-g4-role="title-card"]').waitFor({ state: 'visible', timeout: 2_000 });
              const restoredFinish = await theoryNextButton(page);
              if (!(await restoredFinish.isEnabled())) {
                throw new Error(prefix + ': Back qaytishida Finish audio bilan bloklandi');
              }
            }

            await diagnostics.flush();
            diagnostics.pageErrors.forEach((message) => failures.push(`${prefix}: pageerror ${message}`));
            finaleRoutesChecked += 1;
          } catch (error) {
            failures.push(prefix + ': ' + error.message);
          }
        }
      }
    } finally {
      await context.close();
    }
    console.log(
      `[Grade 4 finale] ${viewport.name} tugadi: ${finaleLessons.length} route × 3 til.`,
    );
  }
}

async function enableStrictTitleClaim(page, lesson, issuePrefix) {
  await muteLesson(page);
  let claim = await firstVisible(inLesson(page, '.g4-title-claim'));
  if (!claim) throw new Error(issuePrefix + ': title claim topilmadi');
  if (await finalReflectionIsRemoved(page, lesson)) {
    const lingeringReflection = await firstVisible(inLesson(
      page,
      '.finale-reflection, .final-reflection, [data-g4-role="reflection"], .reflection-options',
    ));
    if (lingeringReflection) throw new Error(issuePrefix + ': no-reflection finalda eski reflection UI bor');
    if (!(await waitForEnabledLocator(claim))) throw new Error(issuePrefix + ': no-reflection final claim ochilmadi');
    return claim;
  }
  const reflection = await firstVisible(inLesson(
    page,
    '.finale-reflection button, .final-reflection button, [data-g4-role="reflection"] button, .reflection-options button',
  ));
  if (!reflection) throw new Error(issuePrefix + ': reflection topilmadi');
  if (await claim.isEnabled()) throw new Error(issuePrefix + ': reflectiondan oldin claim faol');
  await reflection.click();
  await sleep(50);
  claim = await firstVisible(inLesson(page, '.g4-title-claim'));
  if (!claim || !(await claim.isEnabled())) throw new Error(issuePrefix + ': reflectiondan keyin claim ochilmadi');
  return claim;
}

async function runStrictNormalMotionTitleTiming(browser) {
  const strictLessons = lessons.filter(isStrictEtalonLesson);
  if (!strictLessons.length) return;
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  try {
    for (const lesson of strictLessons) {
      const prefix = `normal-motion title ${lesson.file}`;
      try {
        await reachStrictFinalScreen(page, lesson, prefix);
        const claim = await enableStrictTitleClaim(page, lesson, prefix);
        const overlay = page.locator(TITLE_OVERLAY_SELECTOR);
        await claim.click({ timeout: 8_000 });
        await overlay.waitFor({ state: 'visible', timeout: 2_000 });
        await assertRankOverlayVisual(page, prefix);
        const visibleAt = Date.now();
        await overlay.waitFor({ state: 'hidden', timeout: 5_000 });
        const elapsed = Date.now() - visibleAt;
        if (elapsed < 3_400 || elapsed > 4_700) {
          throw new Error(`${prefix}: rank boost ${elapsed}ms, kutilgan 3900ms (3400–4700ms tolerantlik)`);
        }
        const titleCard = inLesson(page, '[data-g4-role="title-card"]');
        await titleCard.waitFor({ state: 'visible', timeout: 2_000 });
        await assertPersistentRewardVisual(titleCard, prefix);
        normalMotionTitleTimingsChecked += 1;
      } catch (error) {
        failures.push(prefix + ': ' + error.message);
      }
    }
  } finally {
    await context.close();
  }
}

async function runDars10FinaleNarrationReveal(browser) {
  const lesson = lessons.find((item) => item.file === 'Dars10.jsx' && item.section === 'nazariy');
  if (!lesson) return;
  const prefix = 'Dars10 finale audio reveal';
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    reducedMotion: 'no-preference',
  });
  await installSpeechMock(context);
  const page = await context.newPage();
  try {
    await openLesson(page, lesson, 'en');
    let count = await currentScreenCount(page);
    while (count.current < count.total - 1) {
      const matchingAudited = await auditVisibleTheoryMatching(
        page,
        `${prefix} screen ${count.current}`,
        'en',
        false,
        false,
      );
      if (!matchingAudited) {
        await naturallyUnlockStrictTheoryScreen(page, `${prefix} screen ${count.current}`, { lang: 'en' });
      }
      const next = await theoryNextButton(page);
      await clickEnabledTheoryButton(next, `${prefix} screen ${count.current}`, false);
      count = await waitForScreenChange(page, count.text);
    }
    if (count.current !== count.total - 1) {
      throw new Error(`finaldan oldingi ekran ${count.text}, kutilgan ${count.total - 1} / ${count.total}`);
    }

    await auditDars10MethodistRevisions(page, 14, `${prefix} screen 14`);
    if (!(await unmuteLesson(page))) throw new Error('finalga kirishdan oldin audio qayta yoqilmadi');
    await page.evaluate(() => { window.__grade4SpeechDurationMs = 650; });
    const beforeFinalSpeech = (await speechState(page)).utterances.length;
    const beforeFinal = count.text;
    await clickEnabledTheoryButton(await theoryNextButton(page), `${prefix} screen 14`, false);
    count = await waitForScreenChange(page, beforeFinal);
    if (count.current !== count.total) throw new Error(`final ekran ${count.text} emas`);

    const finale = await waitForVisibleMatch(inLesson(page, '[data-qa-d10-finale-visible]'), 4_000);
    if (!finale) throw new Error('finale visible-count hook topilmadi');
    const revealFrames = finale.locator(
      '[data-g4-role="final-takeaway"], [data-g4-role="final-proof"], [data-g4-role="final-bridge"]',
    );
    if (await revealFrames.count() !== 5) {
      throw new Error(`finalda 5 ta reveal frame yo'q (${await revealFrames.count()})`);
    }

    for (let step = 1; step <= 5; step += 1) {
      await waitForSpeechCount(page, beforeFinalSpeech + step, 15_000, `${prefix} step ${step}`);
      if (!(await waitForAttributeValue(finale, 'data-qa-d10-finale-visible', step, 2_000))) {
        const actual = await finale.getAttribute('data-qa-d10-finale-visible');
        throw new Error(`audio ${step}-segmentida visible=${actual}, kutilgan ${step}`);
      }
      const settleDeadline = Date.now() + 500;
      let visibleFrames = 0;
      while (Date.now() < settleDeadline) {
        visibleFrames = await revealFrames.evaluateAll((elements) => elements.filter((element) => {
          const style = getComputedStyle(element);
          return element.classList.contains('is-visible')
            && element.getClientRects().length > 0
            && style.display !== 'none'
            && style.visibility !== 'hidden'
            && Number.parseFloat(style.opacity || '1') > 0.95;
        }).length);
        if (visibleFrames === step) break;
        await sleep(20);
      }
      if (visibleFrames !== step) {
        throw new Error(`audio ${step}-segmentida ${visibleFrames}/5 frame ko'rindi`);
      }
      if (!(await page.evaluate(() => window.speechSynthesis.speaking))) {
        throw new Error(`audio ${step}-segment tekshiruvidan oldin tugab qoldi`);
      }
      const claim = await firstVisible(inLesson(page, '.g4-title-claim'));
      if (!claim || await claim.isEnabled()) {
        throw new Error(`audio ${step}-segment davomida unvon tugmasi ochildi`);
      }
    }

    await page.waitForFunction(() => !window.speechSynthesis.speaking, null, { timeout: 5_000 });
    if (!(await waitForAttributeValue(finale, 'data-qa-d10-finale-complete', 'true', 2_000))) {
      throw new Error('5-audio tugagach finale complete bo\'lmadi');
    }
    const claim = await firstVisible(inLesson(page, '.g4-title-claim'));
    if (!claim || !(await waitForEnabledLocator(claim, 2_000))) {
      throw new Error('5-audio tugagach unvon tugmasi ochilmadi');
    }
    dars10FinaleAudioRevealChecked += 1;
  } catch (error) {
    failures.push(`${prefix}: ${error.message}`);
  } finally {
    await context.close();
  }
}

async function runStrictBackNavigation(browser) {
  const strictLessons = lessons.filter(isStrictEtalonLesson);
  if (!strictLessons.length) return;
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    for (const lesson of strictLessons) {
      try {
        await openLesson(page, lesson, 'en');
        const hookCount = await currentScreenCount(page);
        const next = await theoryNextButton(page);
        const initialAnswerOrder = lesson.file === 'Dars01.jsx'
          ? []
          : await auditVisibleAnswerOrders(page, `hook-back ${lesson.file}`);
        await naturallyUnlockStrictTheoryScreen(page, 'hook-back ' + lesson.file, {
          auditBranches: THEORY_CONTINUE_UNLOCKED,
          lang: 'en',
        });
        const solvedAnswerOrder = initialAnswerOrder.length ? await visibleAnswerOrderSnapshot(page) : [];
        await clickEnabledTheoryButton(next, 'hook-back ' + lesson.file, false);
        const second = await waitForScreenChange(page, hookCount.text);
        const back = inLesson(page, '.stage-nav button').first();
        if (!(await back.isVisible()) || !(await back.isEnabled())) throw new Error(lesson.file + ': Back ishlamaydi');
        await back.click();
        const returned = await waitForScreenChange(page, second.text);
        if (returned.current !== 1) throw new Error(lesson.file + ': Back hookka qaytarmadi');
        if (solvedAnswerOrder.length) {
          const resetsOnReturn = theoryScreenMeta.get(lesson.file)?.[0]?.resetOnReturn === true;
          const restoredAnswerOrder = await visibleAnswerOrderSnapshot(page);
          if (JSON.stringify(answerOrderIdentity(restoredAnswerOrder))
            !== JSON.stringify(answerOrderIdentity(solvedAnswerOrder))) {
            throw new Error(lesson.file + ": Backdan keyin variant tartibi o'zgardi");
          }
          if (!resetsOnReturn && JSON.stringify(restoredAnswerOrder.map((group) => group.states))
            !== JSON.stringify(solvedAnswerOrder.map((group) => group.states))) {
            throw new Error(lesson.file + ": Backdan keyin javob holati boshqa source variantga ko'chdi");
          }
          answerOrderPersistenceChecked += 1;
        }
        await muteLesson(page);
        const restoredFeedback = await firstVisible(inLesson(page, '[data-g4-feedback]:not([aria-hidden="true"])'));
        if (restoredFeedback) {
          const restoredKind = canonicalFeedbackKind(await restoredFeedback.getAttribute('data-g4-feedback'));
          const restoredSelectionIsValid = restoredKind === 'solution'
            || (strictHookUsesNeutralDiagnostic(lesson) && restoredKind === 'diagnostic')
            || (!strictHookRequiresCorrectAnswer(lesson) && restoredKind === 'wrong');
          if (!restoredSelectionIsValid || !(await (await theoryNextButton(page)).isEnabled())) {
            throw new Error(lesson.file + ': hook javobi Backdan keyin noto\'g\'ri tiklandi');
          }
        } else if (await (await theoryNextButton(page)).isEnabled()) {
          if (!THEORY_CONTINUE_UNLOCKED) {
            throw new Error(lesson.file + ': hook javobisiz Next oldindan ochiq');
          }
        } else {
          const cards = strictHookAnswerCards(page, lesson);
          // An unanswered hook must become interactive after narration is
          // muted. Solved hooks are handled above through feedback + Next and
          // may intentionally replace their cards with a proof layer.
          const anySelected = await cards.evaluateAll((elements) => elements.some((element) => (
            element.getAttribute('aria-pressed') === 'true'
              || /(?:selected|picked|correct|right)/.test(element.className)
          )));
          if (!anySelected) await waitForEnabledCard(cards);
        }
      } catch (error) {
        failures.push('strict back-navigation ' + lesson.file + ': ' + error.message);
      }
    }
  } catch (error) {
    failures.push('strict back-navigation: ' + error.message);
  } finally {
    await context.close();
  }
}

async function runDars51MedalTierMatrix(browser) {
  const lesson = lessons.find((item) => item.file === 'Dars51.jsx');
  if (!lesson) return;
  const scoredScreens = new Set([8, 9, 10, 12, 13]);
  const scenarios = [
    { label: 'gold', wrongScreens: new Set(), expectedScore: 5 },
    { label: 'silver', wrongScreens: new Set([8]), expectedScore: 4 },
    { label: 'bronze', wrongScreens: new Set([8, 9]), expectedScore: 3 },
  ];
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const diagnostics = monitorPage(page);
  try {
    for (const scenario of scenarios) {
      const prefix = `Dars51 ${scenario.label} medal`;
      try {
        diagnostics.reset();
        await openLesson(page, lesson, 'en');
        let count = await currentScreenCount(page);
        while (count.current < count.total) {
          const screenIndex = count.current - 1;
          await muteLesson(page);
          if (scoredScreens.has(screenIndex)) {
            const choices = inLesson(page, '[data-g4-branch="choice"]');
            const correct = inLesson(page, '[data-g4-branch="choice"][data-g4-correct="true"]');
            const wrong = inLesson(page, '[data-g4-branch="choice"][data-g4-correct="false"]');
            if (await correct.count() !== 1 || await wrong.count() < 1) {
              throw new Error(`s${screenIndex} deterministic choice markerlari noto'g'ri`);
            }
            await waitForEnabledCard(choices);
            if (scenario.wrongScreens.has(screenIndex)) {
              await wrong.first().click();
              await assertStrictFeedback(page, `${prefix} s${screenIndex} wrong`, 'wrong', 'en');
              if (!THEORY_CONTINUE_UNLOCKED && await (await theoryNextButton(page)).isEnabled()) {
                throw new Error(`s${screenIndex} wrong javobdan keyin Next ochildi`);
              }
            }
            const liveCorrect = inLesson(page, '[data-g4-branch="choice"][data-g4-correct="true"]');
            await liveCorrect.first().click();
            await assertStrictFeedback(page, `${prefix} s${screenIndex} correct`, 'solution', 'en');
          } else {
            await naturallyUnlockStrictTheoryScreen(page, `${prefix} s${screenIndex}`, {
              auditBranches: false,
              lang: 'en',
              requireAction: screenRequiresExplicitAction(lesson.file, screenIndex),
            });
          }
          const next = await theoryNextButton(page);
          await clickEnabledTheoryButton(next, `${prefix} s${screenIndex}`, false);
          count = await waitForScreenChange(page, count.text);
        }

        await naturallyRevealStrictFinalReward(page, lesson, `${prefix} final`);
        const claim = await enableStrictTitleClaim(page, lesson, `${prefix} final`);
        await claim.click({ timeout: 8_000 });
        const overlay = page.locator(TITLE_OVERLAY_SELECTOR);
        await overlay.waitFor({ state: 'visible', timeout: 2_000 });
        await assertRankOverlayVisual(page, prefix);
        await overlay.waitFor({ state: 'hidden', timeout: 1_200 });
        const titleCard = inLesson(page, '[data-g4-role="title-card"]');
        await titleCard.waitFor({ state: 'visible', timeout: 2_000 });
        await assertPersistentRewardVisual(titleCard, prefix);
        const tier = await titleCard.getAttribute('data-medal-tier');
        if (tier !== scenario.label) {
          throw new Error(`medal tier ${tier ?? 'yo\'q'}, kutilgan ${scenario.label}`);
        }
        const finish = await theoryNextButton(page);
        if (!(await finish.isEnabled())) throw new Error('Finish claimdan keyin ochilmadi');
        await finish.click();
        const payload = await validateCompletion(prefix, diagnostics, lesson);
        if (payload.correctAnswers !== scenario.expectedScore) {
          throw new Error(`payload ${payload.correctAnswers}/5, kutilgan ${scenario.expectedScore}/5`);
        }
      } catch (error) {
        failures.push(`${prefix}: ${error.message}`);
      }
    }
  } finally {
    await context.close();
  }
}

async function runDars05NarratedTheoryContract(browser) {
  const lesson = lessons.find((item) => item.file === 'Dars05.jsx');
  if (!lesson) return;
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const prefix = 'Dars05 narrated theory contract';

  try {
    await openLesson(page, lesson, 'en');
    await muteLesson(page);
    const hookCards = strictHookAnswerCards(page, lesson);
    if (await hookCards.count() !== 2) throw new Error('hookda aynan 2 ta javob yo\'q');
    const correctHook = inLesson(page, 'button[data-g4-role~="answer-card"][data-g4-correct="true"]');
    const wrongHook = inLesson(page, 'button[data-g4-role~="answer-card"][data-g4-correct="false"]');
    if (await correctHook.count() !== 1 || await wrongHook.count() !== 1) {
      throw new Error('hookda bitta to\'g\'ri va bitta xato marker yo\'q');
    }
    await waitForEnabledCard(hookCards);
    await wrongHook.click();
    await assertStrictFeedback(page, `${prefix} wrong`, 'wrong', 'en');
    if (!THEORY_CONTINUE_UNLOCKED && await (await theoryNextButton(page)).isEnabled()) {
      throw new Error('xato hook javobidan keyin Next ochildi');
    }
    if (!(await waitForEnabledLocator(correctHook, 2_000))) {
      throw new Error('xato javobdan keyin to\'g\'ri variant qayta urinish uchun ochilmadi');
    }
    await correctHook.click();
    await assertPostCorrectChoiceState(inLesson(page, '.d05-hook-options-card'), `${prefix} correct`, 2);
    await assertStrictFeedback(page, `${prefix} correct`, 'solution', 'en');

    let count = await currentScreenCount(page);
    await clickEnabledTheoryButton(await theoryNextButton(page), `${prefix} hook`, false);
    count = await waitForScreenChange(page, count.text);
    if (count.current !== 2) throw new Error(`aniq/taxminiy ekran ${count.text}, kutilgan 2 / 15`);

    const exactBoard = await firstVisible(inLesson(page, '.d05-narrated-1 .d05-exact-board'));
    if (!exactBoard) throw new Error('2-slayd static taqqoslash framei topilmadi');
    if (await exactBoard.locator('button').count() !== 0) {
      throw new Error('2-slayd frameida bosiladigan yechim/qadam qolgan');
    }
    if (await exactBoard.locator('.d05-exact-card').count() !== 2) {
      throw new Error('2-slaydda aniq va taxminiy kartalar birga ko\'rinmaydi');
    }

    await clickEnabledTheoryButton(await theoryNextButton(page), `${prefix} exact comparison`, false);
    const lineCount = await waitForScreenChange(page, count.text);
    if (lineCount.current !== 3) throw new Error(`sonlar o\'qi ekrani ${lineCount.text}, kutilgan 3 / 15`);

    const lineBoard = await firstVisible(inLesson(page, '.d05-narrated-2 .d05-line-proof'));
    if (!lineBoard) throw new Error('3-slayd audio boshqaradigan sonlar o\'qi framei topilmadi');
    if (await lineBoard.locator('button').count() !== 0) {
      throw new Error('3-slayd frameida bosiladigan yechim/qadam qolgan');
    }
    if (await lineBoard.locator('.d05-proof-distances.is-visible').count() !== 1
      || await lineBoard.locator('.d05-narrated-conclusion.is-visible').count() !== 1) {
      throw new Error('3-slaydning masofa va xulosa freymlari audio fallbackda ochilmadi');
    }

    const back = inLesson(page, '.stage-nav button').first();
    if (!(await back.isVisible()) || !(await back.isEnabled())) throw new Error('narrated ekran uchun Back faol emas');
    await back.click();
    const restored = await waitForScreenChange(page, lineCount.text);
    if (restored.current !== 2 || !await firstVisible(inLesson(page, '.d05-narrated-1 .d05-exact-board'))) {
      throw new Error('Backdan keyin static taqqoslash ekrani tiklanmadi');
    }
    roundingBackPersistenceChecked += 1;
  } catch (error) {
    failures.push(`${prefix}: ${error.message}`);
  } finally {
    await context.close();
  }
}

const DARS05_LIGHT_FRAME_BY_SCREEN = new Map([
  [2, '.d05-exact-board'],
  [3, '.d05-line-proof'],
  [4, '.d05-line-board'],
  [5, '.d05-pairing-board'],
  [6, '.d05-algorithm-board'],
  [7, '.d05-precision-board'],
  [8, '.d05-focus-board'],
  [9, '.d05-focus-board'],
  [10, '.d05-carry-board'],
  [11, '.d05-error-board'],
  [12, '.d05-focus-board'],
  [13, '.d05-focus-board'],
  [14, '.d05-boundary-board'],
]);

async function auditDars05LightBlueFrame(page, screenNumber, issuePrefix) {
  const selector = DARS05_LIGHT_FRAME_BY_SCREEN.get(screenNumber);
  if (!selector) return;

  const frames = inLesson(page, `.stage-content > .screen-stack > ${selector}`);
  const visibleCount = await frames.evaluateAll((elements) => elements.filter((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 0 && rect.height > 0
      && style.display !== 'none'
      && style.visibility !== 'hidden';
  }).length);
  if (visibleCount !== 1) {
    throw new Error(`${issuePrefix}: asosiy frame ${visibleCount} ta, kutilgan 1`);
  }

  const frame = await firstVisible(frames);
  const palette = await frame.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      backgroundColor: style.backgroundColor,
      backgroundImage: style.backgroundImage,
      color: style.color,
    };
  });
  if (palette.backgroundColor !== 'rgb(229, 245, 246)' || palette.backgroundImage !== 'none') {
    throw new Error(`${issuePrefix}: frame och ko'k emas (${JSON.stringify(palette)})`);
  }
  if (palette.color !== 'rgb(23, 59, 82)') {
    throw new Error(`${issuePrefix}: frame matni to'q ko'k emas (${palette.color})`);
  }
}

async function runDars08RapidBackPersistence(browser) {
  const lesson = lessons.find((item) => item.file === 'Dars08.jsx');
  if (!lesson) return;
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const diagnostics = monitorPage(page);
  const prefix = 'Dars08 rapid partial Back persistence';
  try {
    diagnostics.reset();
    await openLesson(page, lesson, 'en');
    let count = await currentScreenCount(page);
    while (count.current < 12) {
      const next = await theoryNextButton(page);
      await naturallyUnlockStrictTheoryScreen(page, `${prefix} reach screen ${count.current}`, { lang: 'en' });
      await clickEnabledTheoryButton(next, `${prefix} reach screen ${count.current}`, false);
      count = await waitForScreenChange(page, count.text);
    }
    if (count.current !== 12 || count.total !== 15) {
      throw new Error(`rapid ekran ${count.text}, kutilgan 12 / 15`);
    }

    let rapid = await waitForVisibleMatch(inLesson(page, '[data-qa-rapid-console="true"]'));
    if (!rapid || !(await waitForAttributeValue(rapid.locator('[data-qa-rapid-round]').first(), 'data-qa-rapid-round', 0))) {
      throw new Error("rapid round 0 boshlang'ich markerida ochilmadi");
    }
    const roundZero = rapid.locator('[data-qa-rapid-round="0"]').first();
    const input = await waitForVisibleMatch(roundZero.locator('input[data-qa-answer]:not(:disabled)'));
    if (!input) throw new Error('rapid round 0 numeric inputi faol emas');
    const answer = await input.getAttribute('data-qa-answer');
    if (!answer) throw new Error('rapid round 0 preview javobi yo\'q');
    const compactAnswer = answer.replace(/\s/g, '');
    const wrongAnswer = compactAnswer === '1' ? '2' : '1';
    await input.fill(wrongAnswer);
    const wrongSubmit = await waitForNumericSubmit(input);
    if (!wrongSubmit) throw new Error('rapid round 0 numeric Tekshirish tugmasi yo\'q');
    await wrongSubmit.click();
    await assertStrictFeedback(page, `${prefix} first wrong numeric`, 'wrong', 'en');
    const firstTryAfterWrong = await waitForJsonAttribute(
      rapid,
      'data-qa-rapid-first-try',
      (value) => Array.isArray(value) && value.length === 1 && value[0] === false,
    );
    const attemptsAfterWrong = await waitForJsonAttribute(
      rapid,
      'data-qa-rapid-attempts',
      (value) => Array.isArray(value) && value.length === 1 && value[0] === 1,
    );
    const wrongAfterWrong = await waitForJsonAttribute(
      rapid,
      'data-qa-rapid-wrong',
      (value) => Array.isArray(value) && value.length === 0,
    );
    if (!firstTryAfterWrong || !attemptsAfterWrong || !wrongAfterWrong) {
      throw new Error('rapid partial firstTry/attempts/wrong snapshot saqlanmadi');
    }
    await assertOuterNextLocked(page, `${prefix} after wrong`);

    const back = inLesson(page, '.stage-nav button').first();
    if (!(await back.isVisible()) || !(await back.isEnabled())) throw new Error('rapid Back faol emas');
    await back.click();
    const previous = await waitForScreenChange(page, count.text);
    if (previous.current !== 11 || previous.total !== 15) {
      throw new Error(`Back ${previous.text} ga o'tdi, kutilgan 11 / 15`);
    }
    const ruleNext = await theoryNextButton(page);
    await naturallyUnlockStrictTheoryScreen(page, `${prefix} restored rule`, { lang: 'en' });
    await clickEnabledTheoryButton(ruleNext, `${prefix} restored rule`, false);
    count = await waitForScreenChange(page, previous.text);
    if (count.current !== 12 || count.total !== 15) {
      throw new Error(`rapid re-entry ${count.text}, kutilgan 12 / 15`);
    }

    rapid = await waitForVisibleMatch(inLesson(page, '[data-qa-rapid-console="true"]'));
    const restoredRound = rapid?.locator('[data-qa-rapid-round="0"]').first();
    if (!rapid || !restoredRound || !(await restoredRound.isVisible().catch(() => false))) {
      throw new Error('re-entry rapid round 0ni saqlamadi');
    }
    const restoredInput = await waitForVisibleMatch(restoredRound.locator('input[data-qa-answer]:not(:disabled)'));
    if (!restoredInput || (await restoredInput.inputValue()).replace(/\s/g, '') !== wrongAnswer) {
      throw new Error('re-entry wrong numeric qiymatini saqlamadi');
    }
    if (!await waitForJsonAttribute(rapid, 'data-qa-rapid-first-try', (value) => value?.length === 1 && value[0] === false)
      || !await waitForJsonAttribute(rapid, 'data-qa-rapid-attempts', (value) => value?.length === 1 && value[0] === 1)
      || !await waitForJsonAttribute(rapid, 'data-qa-rapid-wrong', (value) => Array.isArray(value) && value.length === 0)) {
      throw new Error('re-entry firstTry/attempts/wrong markerlari saqlanmadi');
    }
    await assertStrictFeedback(page, `${prefix} restored wrong`, 'wrong', 'en');
    await assertOuterNextLocked(page, `${prefix} restored round 0`);

    await auditVisibleRapidConsole(page, `${prefix} resume`, 'en', { auditWrong: false, startRound: 0 });
    count = await currentScreenCount(page);
    const rapidNext = await theoryNextButton(page);
    await clickEnabledTheoryButton(rapidNext, `${prefix} completed rapid`, false);
    count = await waitForScreenChange(page, count.text);
    while (count.current < count.total) {
      const next = await theoryNextButton(page);
      await naturallyUnlockStrictTheoryScreen(page, `${prefix} finish screen ${count.current}`, { lang: 'en' });
      await clickEnabledTheoryButton(next, `${prefix} finish screen ${count.current}`, false);
      count = await waitForScreenChange(page, count.text);
    }

    if (count.current !== 15 || count.total !== 15) {
      throw new Error(`final ekran ${count.text}, kutilgan 15 / 15`);
    }
    await naturallyRevealStrictFinalReward(page, lesson, `${prefix} final`);
    const claim = await firstVisible(inLesson(page, '.g4-title-claim'));
    if (!claim || !(await waitForEnabledLocator(claim))) throw new Error('no-reflection final claim ochilmadi');
    await claim.click();
    const overlay = page.locator(TITLE_OVERLAY_SELECTOR);
    await overlay.waitFor({ state: 'visible', timeout: 2_000 });
    await overlay.waitFor({ state: 'hidden', timeout: 5_000 });
    await inLesson(page, '[data-g4-role="title-card"]').waitFor({ state: 'visible', timeout: 2_000 });
    await diagnostics.flush();
    if (diagnostics.completionCalls.length) throw new Error('explicit Finishdan oldin onFinished chaqirildi');
    const finish = await theoryNextButton(page);
    if (!(await waitForEnabledLocator(finish))) throw new Error('claimed final Finish faol emas');
    await finish.evaluate((element) => {
      element.click();
      element.click();
    });
    await validateCompletion(prefix, diagnostics, lesson);
    const payload = diagnostics.completionCalls[0];
    const rapidAnswer = payload.answers.find((answer) => answer?.screenIdx === 11);
    if (rapidAnswer?.totalQuestions !== 1
      || JSON.stringify(rapidAnswer?.subResults) !== JSON.stringify([false])
      || JSON.stringify(rapidAnswer?.attemptsByRound) !== JSON.stringify([2])
      || JSON.stringify(rapidAnswer?.wrongByRound) !== JSON.stringify([[]])
      || rapidAnswer?.numeric?.replace(/\s/g, '') !== compactAnswer
      || rapidAnswer?.correctCount !== 0
      || rapidAnswer?.firstTry !== false
      || rapidAnswer?.attempts !== 2
      || payload.correctAnswers !== 0
      || payload.firstTryStats?.total !== 4
      || payload.firstTryStats?.firstTryCorrect !== 0
      || payload.attemptsTotal !== 2) {
      throw new Error(`LMS rapid persistence noto'g'ri: ${JSON.stringify({
        totalQuestions: rapidAnswer?.totalQuestions,
        subResults: rapidAnswer?.subResults,
        attemptsByRound: rapidAnswer?.attemptsByRound,
        wrongByRound: rapidAnswer?.wrongByRound,
        numeric: rapidAnswer?.numeric,
        correctCount: rapidAnswer?.correctCount,
        firstTry: rapidAnswer?.firstTry,
        attempts: rapidAnswer?.attempts,
        payloadCorrect: payload.correctAnswers,
        firstTryStats: payload.firstTryStats,
        attemptsTotal: payload.attemptsTotal,
      })}`);
    }
    rapidBackPersistenceChecked += 1;
  } catch (error) {
    failures.push(`${prefix}: ${error.message}`);
  } finally {
    await context.close();
  }
}

async function auditDars03MethodistRevisions(page, screenNumber, viewport, issuePrefix) {
  if (screenNumber === 4) {
    const frame = await firstVisible(inLesson(page, '.stage[data-g4-screen-id="s3"] .place-ladder-board'));
    if (!frame) throw new Error(`${issuePrefix}: 4-slayd asosiy framei topilmadi`);
    const colours = await frame.evaluate((element) => {
      const topCopy = element.querySelector('.place-ladder-topline>span');
      const stepLabel = element.querySelector('.place-ladder-step>span');
      const stepValue = element.querySelector('.place-ladder-step>strong');
      const greenFrame = element.querySelector('.place-ladder-topline>strong');
      return {
        frame: getComputedStyle(element).backgroundColor,
        frameText: getComputedStyle(element).color,
        topCopy: getComputedStyle(topCopy).color,
        stepLabel: getComputedStyle(stepLabel).color,
        stepValue: getComputedStyle(stepValue).color,
        greenFrame: getComputedStyle(greenFrame).backgroundColor,
        greenText: getComputedStyle(greenFrame).color,
      };
    });
    const navy = 'rgb(23, 59, 82)';
    if (colours.frame !== 'rgb(229, 245, 246)'
      || [colours.frameText, colours.topCopy, colours.stepLabel, colours.stepValue].some((value) => value !== navy)) {
      throw new Error(`${issuePrefix}: 4-slayd och ko'k/to'q ko'k kontrakti buzilgan (${JSON.stringify(colours)})`);
    }
    if (colours.greenFrame !== 'rgb(149, 201, 61)' || colours.greenText !== navy) {
      throw new Error(`${issuePrefix}: 4-slayd ichki yashil framei o'zgargan (${JSON.stringify(colours)})`);
    }
    return;
  }

  if (screenNumber === 6) {
    const flow = await firstVisible(inLesson(page, '[data-qa-repeated-place-flow="true"]'));
    if (!flow) throw new Error(`${issuePrefix}: 6-slayd takroriy raqam framei topilmadi`);
    if (await flow.locator('[data-qa-place-arrow]').count() !== 0) {
      throw new Error(`${issuePrefix}: 6-slaydda strelka qolgan`);
    }
    return;
  }

  if (screenNumber === 10) {
    const frame = await firstVisible(inLesson(page, '[data-qa-zero-rule="true"]'));
    if (!frame) throw new Error(`${issuePrefix}: 10-slaydning yangi qoida framei topilmadi`);
    const rows = frame.locator(':scope > [data-qa-zero-rule-row]');
    const reveals = frame.locator(':scope > [data-qa-zero-reveal-step]');
    if (await rows.count() !== 2) {
      throw new Error(`${issuePrefix}: 10-slaydda aynan 2 ta taqqoslash qatori yo'q`);
    }
    if (await frame.locator('[data-qa-zero-rule-summary="true"]').count() !== 1) {
      throw new Error(`${issuePrefix}: 10-slaydda bitta qisqa qoida yo'q`);
    }
    if (await reveals.count() !== 3
      || await reveals.evaluateAll((elements) => elements.map((element) => element.dataset.qaZeroRevealStep).join(',')) !== '0,1,2') {
      throw new Error(`${issuePrefix}: 10-slaydning 3 bosqichli ochilish tartibi buzilgan`);
    }
    if (await frame.getAttribute('data-qa-zero-rule-tone') !== 'light-blue'
      || await frame.getAttribute('data-qa-zero-visible-count') !== '3') {
      throw new Error(`${issuePrefix}: 10-slayd och ko'k yoki yakuniy reveal holatida emas`);
    }
    const visual = await frame.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const directBlocks = [...element.querySelectorAll(':scope > [data-qa-zero-reveal-step]')];
      const bodyCopy = [
        ...element.querySelectorAll('.zero-rule-card>strong,.zero-rule-summary>p'),
      ];
      return {
        background: getComputedStyle(element).backgroundColor,
        directCount: directBlocks.length,
        allRevealed: directBlocks.every((block) => (
          block.getAttribute('aria-hidden') === 'false'
          && getComputedStyle(block).visibility === 'visible'
          && Number(getComputedStyle(block).opacity) > 0.99
        )),
        blocksInside: directBlocks.every((block) => {
          const child = block.getBoundingClientRect();
          return child.left >= rect.left - 1 && child.right <= rect.right + 1
            && child.top >= rect.top - 1 && child.bottom <= rect.bottom + 1;
        }),
        noFrameOverflow: element.scrollWidth <= element.clientWidth + 1
          && element.scrollHeight <= element.clientHeight + 1,
        bodyColours: bodyCopy.map((node) => getComputedStyle(node).color),
      };
    });
    if (visual.background !== 'rgb(229, 245, 246)'
      || visual.directCount !== 3
      || !visual.allRevealed
      || !visual.blocksInside
      || !visual.noFrameOverflow
      || visual.bodyColours.some((colour) => colour !== 'rgb(23, 59, 82)')) {
      throw new Error(`${issuePrefix}: 10-slayd vizual kontrakti buzilgan (${JSON.stringify(visual)})`);
    }
    const formulas = await rows.locator(':scope > strong').allTextContents();
    if (formulas.map(normalizeText).join('|') !== '400 + 0 + 7 = 407|530 407 ≠ 53 407') {
      throw new Error(`${issuePrefix}: 10-slaydning ikki sodda misoli noto'g'ri (${formulas.join(' | ')})`);
    }
    if (await inLesson(page, '.zero-place-grid,.zero-contrast-grid,.zero-rule-row,.zero-rule-expression,.zero-coefficient-screen>.theory-callout').count() !== 0) {
      throw new Error(`${issuePrefix}: 10-slaydda eski zich elementlar qolgan`);
    }
    if (await frame.locator('svg,.g1-char').count() !== 0) {
      throw new Error(`${issuePrefix}: 10-slayd asosiy frameida ortiqcha rasm qolgan`);
    }
    const activeLang = new URL(page.url()).searchParams.get('lang');
    if (SCREENSHOT_DIR && activeLang === 'uz' && ['compact-mobile', 'desktop'].includes(viewport.name)) {
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `Dars03-uz-${viewport.name}-screen10.png`),
      });
    }
    return;
  }

  if (screenNumber === 11) {
    const explanation = await firstVisible(inLesson(page, '.deep-sequence-screen .deep-sequence-explanation'));
    if (!explanation) throw new Error(`${issuePrefix}: 11-slayd qadam izohi topilmadi`);
    if (await explanation.locator('strong,small').count() !== 0 || await explanation.locator('p').count() !== 1) {
      throw new Error(`${issuePrefix}: 11-slayd qadamida ortiqcha izoh elementlari qolgan`);
    }
    return;
  }

  if (screenNumber === 12) {
    const cards = inLesson(page, '.choice-slide-12 .options-grid>.option');
    if (await cards.count() !== 3) throw new Error(`${issuePrefix}: 12-slaydda 3 ta variant yo'q`);
    const metrics = await cards.evaluateAll((elements) => elements.map((element) => {
      const rect = element.getBoundingClientRect();
      const letter = element.querySelector('.option-letter');
      const copy = element.querySelector('span:last-child');
      return {
        label: letter?.textContent?.trim() ?? '',
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        letterSize: Number.parseFloat(getComputedStyle(letter).fontSize),
        copySize: Number.parseFloat(getComputedStyle(copy).fontSize),
        whiteSpace: getComputedStyle(copy).whiteSpace,
      };
    }));
    if (JSON.stringify(metrics.map((item) => item.label)) !== JSON.stringify(['A', 'B', 'C'])) {
      throw new Error(`${issuePrefix}: 12-slayd belgilari A/B/C emas (${JSON.stringify(metrics)})`);
    }
    if (metrics.some((item) => item.height < 43.5 || item.letterSize !== 12 || item.copySize !== (viewport.width < 640 ? 9 : 10) || item.whiteSpace !== 'nowrap')) {
      throw new Error(`${issuePrefix}: 12-slayd variant o'lchamlari noto'g'ri (${JSON.stringify(metrics)})`);
    }
    if (metrics.some((item, index) => index > 0 && (
      item.top <= metrics[index - 1].top
      || Math.abs(item.left - metrics[0].left) > 2
      || Math.abs(item.width - metrics[0].width) > 2
    ))) {
      throw new Error(`${issuePrefix}: 12-slayd variantlari uchta alohida qatorda emas (${JSON.stringify(metrics)})`);
    }
    return;
  }

  if (screenNumber === 13) {
    const panel = await firstVisible(inLesson(page, '.choice-slide-13>.model-panel'));
    if (!panel) throw new Error(`${issuePrefix}: 13-slayd asosiy framei topilmadi`);
    const metrics = await panel.evaluate((element) => {
      const style = getComputedStyle(element);
      const heading = element.querySelector('.model-heading');
      const number = element.querySelector('.model-number');
      const label = element.querySelector('.model-row-list span');
      const value = element.querySelector('.model-row-list strong');
      return {
        padding: Number.parseFloat(style.paddingTop),
        heading: Number.parseFloat(getComputedStyle(heading).fontSize),
        number: Number.parseFloat(getComputedStyle(number).fontSize),
        label: Number.parseFloat(getComputedStyle(label).fontSize),
        value: Number.parseFloat(getComputedStyle(value).fontSize),
      };
    });
    const mobile = viewport.width < 640;
    const valid = mobile
      ? metrics.padding === 10 && metrics.heading === 11 && metrics.number === 32 && metrics.label === 9 && metrics.value === 13
      : metrics.padding === 12 && metrics.heading === 13 && metrics.number >= 33 && metrics.label === 11 && metrics.value >= 15;
    if (!valid) throw new Error(`${issuePrefix}: 13-slayd frame/tekst +2 o'lchamlari noto'g'ri (${JSON.stringify(metrics)})`);
  }
}

async function auditDars10MethodistRevisions(page, screenNumber, issuePrefix) {
  const visuallyRevealed = (locator) => locator.evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0
      && style.display !== 'none'
      && style.visibility !== 'hidden'
      && Number.parseFloat(style.opacity || '1') > 0.05;
  }).catch(() => false);

  if (screenNumber === 6) {
    await muteLesson(page);
    const proof = await firstVisible(inLesson(page, '[data-qa-tens-shift-proof]'));
    if (!proof) throw new Error(`${issuePrefix}: qayta yaratilgan o'nlik siljish framei topilmadi`);
    if (!(await waitForAttributeValue(proof, 'data-qa-tens-shift-phase', 4))) {
      throw new Error(`${issuePrefix}: 6-slaydning 4 audio bosqichi yakuniy holatga kelmadi`);
    }
    const contract = await proof.evaluate((root) => {
      const compact = (value) => String(value ?? '').replace(/\s+/g, '');
      const steps = [...root.querySelectorAll('.tens-proof-step')];
      const before = root.querySelector('.place-shift-before');
      const after = root.querySelector('.place-shift-after');
      const shift = root.querySelector('.place-shift-board');
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        return element.getClientRects().length > 0
          && style.display !== 'none'
          && style.visibility !== 'hidden'
          && Number.parseFloat(style.opacity || '1') > 0.05;
      };
      return {
        copy: compact(root.textContent),
        stepCount: steps.length,
        allStepsVisible: steps.every(visible),
        before: compact(before?.getAttribute('aria-label') ?? before?.textContent),
        after: compact(after?.getAttribute('aria-label') ?? after?.textContent),
        shifted: shift?.classList.contains('is-shifted') === true && visible(shift),
        noOverflow: root.scrollWidth <= root.clientWidth + 1 && root.scrollHeight <= root.clientHeight + 1,
      };
    });
    if (contract.stepCount !== 2
      || !contract.allStepsVisible
      || !contract.copy.includes('324×2=648')
      || !contract.copy.includes('20=2×10')
      || contract.before !== '648'
      || contract.after !== '6480'
      || !contract.shifted
      || !contract.noOverflow) {
      throw new Error(`${issuePrefix}: 6-slayd o'nlik siljish kontrakti buzilgan (${JSON.stringify(contract)})`);
    }
    return;
  }

  if (screenNumber === 7) {
    await muteLesson(page);
    const flow = await firstVisible(inLesson(page, '[data-qa-matching-flow]'));
    if (!flow) throw new Error(`${issuePrefix}: qayta yaratilgan matching framei topilmadi`);
    const left = flow.locator('[data-match-left]');
    const right = flow.locator('[data-match-right]');
    const check = flow.locator('[data-qa-matching-check="true"]');
    if (await left.count() !== 2 || await right.count() !== 2 || await check.count() !== 1) {
      throw new Error(`${issuePrefix}: 7-slayd 2×2 matching + Tekshirish tuzilmasi to'liq emas`);
    }
    const leftCopy = (await left.allTextContents()).map((value) => normalizeText(value).replace(/\s/g, '')).join('|');
    if (!leftCopy.includes('972') || !leftCopy.includes('6480')) {
      throw new Error(`${issuePrefix}: 7-slayd matchingida 972 va 6 480 aniq qatorlari yo'q (${leftCopy})`);
    }
    if (await check.isEnabled()) {
      throw new Error(`${issuePrefix}: 7-slayd Tekshirish juftliklar tuzilmasidan oldin faol`);
    }
    return;
  }

  if (screenNumber === 11) {
    const column = await firstVisible(inLesson(page, '.error-column'));
    const calculation = column ? await firstVisible(column.locator('pre')) : null;
    if (!column || !calculation) throw new Error(`${issuePrefix}: 11-slayd xato hisob framei topilmadi`);
    if (await column.locator('.g1-char').count() !== 0) {
      throw new Error(`${issuePrefix}: 11-slayd asosiy hisob frameida Bit rasmi qolgan`);
    }
    const copy = normalizeText(await calculation.innerText()).replace(/\s/g, '');
    if (!copy.includes('1205') || !copy.includes('×30') || !copy.includes('3615')) {
      throw new Error(`${issuePrefix}: 11-slayd asosiy xato hisob matni saqlanmagan (${copy})`);
    }
    return;
  }

  if (screenNumber === 14) {
    await muteLesson(page);
    const board = await firstVisible(inLesson(page, '[data-qa-column-board]'));
    if (!board) throw new Error(`${issuePrefix}: qayta yaratilgan 14-slayd ustun framei topilmadi`);
    const ones = board.locator('[data-qa-column-row="ones"]');
    const tens = board.locator('[data-qa-column-row="tens"]');
    const total = board.locator('[data-qa-column-row="total"]');
    const shift = board.locator('[data-qa-column-shift]');
    if (await ones.count() !== 1 || await tens.count() !== 1 || await total.count() !== 1 || await shift.count() !== 1) {
      throw new Error(`${issuePrefix}: 14-slayd ones/tens/total/shift tuzilmasi to'liq emas`);
    }
    if (!normalizeText(await ones.innerText()).replace(/\s/g, '').includes('972')) {
      throw new Error(`${issuePrefix}: 14-slayd birliklar qatori 972 ni ko'rsatmaydi`);
    }
    if (await visuallyRevealed(total)) {
      throw new Error(`${issuePrefix}: 14-slayd yakuniy 7 452 siljishdan oldin ochilgan`);
    }
    if (!(await waitForEnabledLocator(shift))) {
      throw new Error(`${issuePrefix}: 14-slayd siljitish tugmasi audio tugagach ochilmadi`);
    }
    const headingBefore = await captureDars10MainState(page);
    await shift.click();
    const deadline = Date.now() + 4_000;
    let solved = false;
    while (Date.now() < deadline) {
      const liveBoard = await firstVisible(inLesson(page, '[data-qa-column-board]'));
      const liveTens = liveBoard?.locator('[data-qa-column-row="tens"]');
      const liveTotal = liveBoard?.locator('[data-qa-column-row="total"]');
      const tensCopy = liveTens ? normalizeText(await liveTens.innerText()).replace(/\s/g, '') : '';
      const totalCopy = liveTotal ? normalizeText(await liveTotal.innerText()).replace(/\s/g, '') : '';
      if (liveTens && liveTotal
        && tensCopy.includes('6480')
        && totalCopy.includes('7452')
        && await visuallyRevealed(liveTens)
        && await visuallyRevealed(liveTotal)) {
        solved = true;
        break;
      }
      await sleep(25);
    }
    if (!solved) throw new Error(`${issuePrefix}: 14-slayd siljishdan keyin 6 480 va 7 452 ochilmadi`);
    const solution = await firstVisible(inLesson(page, '[data-g4-feedback="solution"]'));
    if (!solution) throw new Error(`${issuePrefix}: siljishdan keyin yechim frame'i chiqmagan`);
    await assertDars10MainStatePreserved(page, headingBefore, `${issuePrefix} solved`);
    if (!(await waitForEnabledLocator(await theoryNextButton(page)))) {
      throw new Error(`${issuePrefix}: 14-slayd tugagach Next ochilmadi`);
    }
  }
}

async function runStrictScreenMatrix(browser) {
  const strictLessons = lessons.filter(isStrictEtalonLesson);
  if (!strictLessons.length) return;

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const diagnostics = monitorPage(page);
    try {
      for (const lesson of strictLessons) {
        for (const lang of LANGS) {
          const prefix = `strict matrix ${viewport.name} ${lesson.file} ${lang}`;
          try {
            diagnostics.reset();
            await openLesson(page, lesson, lang);
            const first = await currentScreenCount(page);
            for (let expected = 1; expected <= first.total; expected += 1) {
              const count = await currentScreenCount(page);
              if (count.current !== expected || count.total !== first.total) {
                throw new Error(`screen tartibi ${count.text}, kutilgan ${expected} / ${first.total}`);
              }
              const snapshot = await lessonSnapshot(page);
              snapshotIssues(snapshot, lang).forEach((issue) => failures.push(`${prefix} screen ${expected}: ${issue}`));
              if (lesson.file === 'Dars03.jsx') {
                const visibleBits = await inLesson(page, '.g1-char').evaluateAll((elements) => elements.filter((element) => {
                  const rect = element.getBoundingClientRect();
                  const style = getComputedStyle(element);
                  return !element.parentElement?.closest('[aria-hidden="true"]')
                    && rect.width > 0 && rect.height > 0
                    && style.display !== 'none' && style.visibility !== 'hidden';
                }).length);
                const expectedBits = expected === 1 ? 1 : 0;
                if (visibleBits !== expectedBits) {
                  throw new Error(`screen ${expected}: Bit ${visibleBits} ta, kutilgan ${expectedBits}`);
                }
                await auditDars03MethodistRevisions(page, expected, viewport, `${prefix} screen ${expected}`);
              }
              if (lesson.file === 'Dars10.jsx') {
                await auditDars10MethodistRevisions(page, expected, `${prefix} screen ${expected}`);
              }
              if (lesson.file === 'Dars05.jsx') {
                await auditDars05LightBlueFrame(page, expected, `${prefix} screen ${expected}`);
              }
              const matchingAudited = await auditVisibleTheoryMatching(
                page,
                `${prefix} screen ${expected}`,
                lang,
                false,
              );

              if (expected < first.total) {
                if (!matchingAudited) {
                  await naturallyUnlockStrictTheoryScreen(page, `${prefix} screen ${expected}`, {
                    auditBranches: true,
                    lang,
                    requireAction: screenRequiresExplicitAction(lesson.file, expected - 1),
                  });
                }
                const next = await theoryNextButton(page);
                await clickEnabledTheoryButton(next, `${prefix} screen ${expected}`, false);
                await waitForScreenChange(page, count.text);
                continue;
              }

              await naturallyRevealStrictFinalReward(page, lesson, `${prefix} final screen ${expected}`);
              let claim = await firstVisible(inLesson(page, '.g4-title-claim'));
              const reflectionRemoved = await finalReflectionIsRemoved(page, lesson);
              if (!claim) throw new Error('final claim topilmadi');
              if (reflectionRemoved) {
                const lingeringReflection = await firstVisible(inLesson(
                  page,
                  '.finale-reflection, .final-reflection, [data-g4-role="reflection"], .reflection-options',
                ));
                if (lingeringReflection) throw new Error('no-reflection finalda eski reflection UI bor');
                await muteLesson(page);
                claim = await firstVisible(inLesson(page, '.g4-title-claim'));
                if (!claim || !(await waitForEnabledLocator(claim))) {
                  throw new Error('no-reflection final claim ochilmadi');
                }
              } else {
                const reflection = await firstVisible(inLesson(
                  page,
                  '.finale-reflection button, .final-reflection button, [data-g4-role="reflection"] button, .reflection-options button',
                ));
                if (!reflection) throw new Error('final reflection topilmadi');
                if (await claim.isEnabled()) throw new Error('reflection tanlanmasidan claim faol');
                await muteLesson(page);
                await reflection.click();
                await sleep(50);
                claim = await firstVisible(inLesson(page, '.g4-title-claim'));
                if (!claim || !(await claim.isEnabled())) throw new Error('reflectiondan keyin claim ochilmadi');
              }
              await claim.click({ timeout: 8_000 });
              const overlay = page.locator(TITLE_OVERLAY_SELECTOR);
              await overlay.waitFor({ state: 'visible', timeout: 2_000 });
              await assertRankOverlayVisual(page, prefix);
              const duringReveal = await lessonSnapshot(page);
              snapshotIssues(duringReveal, lang).forEach((issue) => failures.push(`${prefix} reveal: ${issue}`));
              await overlay.waitFor({ state: 'hidden', timeout: 5_000 });
              const titleCard = inLesson(page, '[data-g4-role="title-card"]');
              await titleCard.waitFor({ state: 'visible', timeout: 2_000 });
              await assertPersistentRewardVisual(titleCard, prefix);
              if (lesson.file === 'Dars03.jsx' && await inLesson(page, '.g1-char').count() !== 0) {
                throw new Error('Bit final mukofot frameida qolgan');
              }
              const claimed = await lessonSnapshot(page);
              snapshotIssues(claimed, lang).forEach((issue) => failures.push(`${prefix} claimed: ${issue}`));
              if (SCREENSHOT_DIR && lang === 'en' && REVIEW_LESSONS.has(lesson.file)) {
                const key = `${lesson.file}:${viewport.name}:final`;
                if (!finalScreenshotKeys.has(key)) {
                  finalScreenshotKeys.add(key);
                  await page.screenshot({
                    path: path.join(
                      SCREENSHOT_DIR,
                      `${lesson.file.replace('.jsx', '')}-en-${viewport.name}-final.png`,
                    ),
                  });
                }
              }
            }
            await diagnostics.flush();
            diagnostics.pageErrors.forEach((message) => failures.push(`${prefix}: pageerror ${message}`));
          } catch (error) {
            failures.push(`${prefix}: ${error.message}`);
          }
        }
      }
    } finally {
      await context.close();
    }
    console.log(`[Grade 4 smoke] strict all-screen matrix ${viewport.name} tugadi: ${strictLessons.length} route × 3 til.`);
  }
}

async function startViteServer() {
  const { createServer } = await import('vite');
  const viteServer = await createServer({
    root: ROOT,
    clearScreen: false,
    plugins: registryOnlyFiles.size ? [missingRegistryLessonPlugin()] : [],
    server: {
      host: HOST,
      port: Number(process.env.GRADE4_PORT || PORT),
      strictPort: false,
      // Browser smoke does not need hot reload; disabling it prevents a save in
      // a parallel authoring session from resetting in-flight screen progress.
      hmr: false,
    },
  });
  await viteServer.listen();
  const address = viteServer.httpServer?.address();
  if (address && typeof address === 'object') {
    baseUrl = 'http://' + HOST + ':' + address.port;
  }
  if (registryOnlyFiles.size) {
    console.log(
      '[Grade 4 smoke isolation] scope tashqarisidagi registry-only importlar test serverida virtual stub bilan yopildi; '
      + 'source fayllar o\'zgartirilmadi va bu route-lar sinovdan o\'tkazilmadi.',
    );
  }
  return viteServer;
}

try {
  if (!process.env.GRADE4_BASE_URL) {
    server = await startViteServer();
  } else if (registryOnlyFiles.size) {
    console.log(
      '[Grade 4 smoke scope] Scope tashqarisidagi registry-only route sinovdan chiqarildi; tashqi server mavjud bo\'lmagan '
      + 'importlarni alohida izolatsiya qilishi kerak.',
    );
  }
  await waitForServer();
  const browser = await chromium.launch({ headless: true, ...(CHROME_PATH ? { executablePath: CHROME_PATH } : {}) });
  try {
    if (RAPID_BACK_ONLY) {
      await runDars08RapidBackPersistence(browser);
    } else if (AUDIO_ONLY) {
      await runAudioContractSmoke(browser);
    } else if (FINALE_ONLY) {
      await runFinaleMatrix(browser);
    } else {
      if (!DEEP_ONLY) {
      for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      const diagnostics = monitorPage(page);
      for (const lesson of lessons) {
        for (const lang of LANGS) {
          try {
            await runInitialRouteSmoke(page, diagnostics, viewport, lesson, lang);
          } catch (error) {
            failures.push(viewport.name + ' ' + lesson.file + ' ' + lang + ': ' + error.message);
          }
        }
      }
      await context.close();
      console.log('[Grade 4 smoke] mount matrix ' + viewport.name + ' tugadi: ' + lessons.length + ' route × 3 til.');
      }

      await runStrictHookContracts(browser);
      await runStrictNormalMotionTitleTiming(browser);
      await runDars10FinaleNarrationReveal(browser);
      await runDars51MedalTierMatrix(browser);
      await runStrictBackNavigation(browser);
      await runDars05NarratedTheoryContract(browser);
      await runDars08RapidBackPersistence(browser);
      await runStrictScreenMatrix(browser);
    await runAudioContractSmoke(browser);
    await runProgressPersistence(browser);
    await runPracticeProgressPersistence(browser);
    await runInvalidLanguageFallback(browser);
      }

      const deepContext = await browser.newContext({
        viewport: { width: deepViewport.width, height: deepViewport.height },
        reducedMotion: 'reduce',
      });
      await installSpeechMock(deepContext);
      const deepPage = await deepContext.newPage();
      const deepDiagnostics = monitorPage(deepPage);
      for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex += 1) {
        const lesson = lessons[lessonIndex];
        try {
        if (lesson.section === 'nazariy') {
          await runTheoryTraversal(deepPage, deepDiagnostics, lesson);
        } else {
          const number = practiceLessonNumber(lesson);
          if (number !== null && number >= 22 && number <= 30) {
            for (const lang of LANGS) {
              await runPracticeTraversal(deepPage, deepDiagnostics, lesson, practiceTasks.get(lesson.file), lang, true);
            }
          } else {
            await runPracticeTraversal(deepPage, deepDiagnostics, lesson, practiceTasks.get(lesson.file));
          }
        }
        } catch (error) {
          failures.push(error.message);
        }
        if ((lessonIndex + 1) % 5 === 0 || lessonIndex + 1 === lessons.length) {
          console.log('[Grade 4 smoke] deep traversal ' + (lessonIndex + 1) + '/' + lessons.length + ' route tugadi.');
        }
      }
      await deepContext.close();
    }
  } finally {
    await browser.close();
  }
} finally {
  await server?.close();
}

if (failures.length) {
  console.error('Grade 4 browser smoke: ' + failures.length + ' ta xato');
  failures.forEach((message) => console.error('- ' + message));
  process.exitCode = 1;
} else {
  const theoryCount = lessons.filter((lesson) => lesson.section === 'nazariy').length;
  const practiceCount = lessons.filter((lesson) => lesson.section === 'amaliy').length;
  if (RAPID_BACK_ONLY) {
    console.log(`Grade 4 Dars08 rapid partial Back persistence o'tdi: ${rapidBackPersistenceChecked} flow.`);
    process.exit(0);
  }
  if (AUDIO_ONLY) {
    console.log(`Grade 4 audio runtime contract o'tdi: ${lessons.length} route.`);
    process.exit(0);
  }
  if (FINALE_ONLY) {
    console.log(
      `Grade 4 finale browser matrix o'tdi: ${finaleRoutesChecked} lesson/til/viewport holati.`,
    );
    process.exit(0);
  }
  console.log(
    'Grade 4 browser smoke o\'tdi: ' + lessons.length + ' route × 3 til × ' + VIEWPORTS.length + ' viewport; '
    + theoryCount + ' theory / ' + theoryScreensTraversed + ' EN screen; '
    + practiceCount + ' practice / ' + practiceTasksTraversed + ' EN task; '
    + theoryGateFallbacks + ' theory gate fallback; '
    + choiceBranchScreensChecked + ' choice screens / ' + choiceBranchesChecked + ' choice branches; '
    + numericBranchScreensChecked + ' numeric wrong/correct branch screens; '
    + buildBranchScreensChecked + ' build wrong/retry/correct screens; '
    + repeatedPlaceFlowsChecked + ' repeated-place flows; '
    + matchingBranchScreensChecked + ' matching wrong/correct connector screens; '
    + rapidBranchScreensChecked + ' rapid branch screens; '
    + roundingLineScreensChecked + ' rounding-line three-step screens; '
    + roundingBackPersistenceChecked + ' rounding-line Back persistence; '
    + rapidBackPersistenceChecked + ' rapid partial Back persistence; '
    + answerOrderGroupsChecked + ' answer-order groups; '
    + answerOrderPersistenceChecked + ' answer-order language/Back persistence; '
    + postCorrectChoiceStatesChecked + ' persistent post-correct choice states; '
    + normalMotionTitleTimingsChecked + ' normal-motion title timing; '
    + dars10FinaleAudioRevealChecked + ' Dars10 finale audio reveal; '
    + (audioContractChecked ? 'audio runtime contract checked.' : 'audio runtime contract skipped.'),
);
}
