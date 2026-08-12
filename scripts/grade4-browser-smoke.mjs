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
const HOST = '127.0.0.1';
const PORT = 4173;
let baseUrl = process.env.GRADE4_BASE_URL || 'http://' + HOST + ':' + PORT;
const DEFAULT_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CHROME_PATH = process.env.GRADE4_CHROME_PATH || (existsSync(DEFAULT_CHROME) ? DEFAULT_CHROME : undefined);
const SCREENSHOT_DIR = process.env.GRADE4_SCREENSHOT_DIR
  ? path.resolve(ROOT, process.env.GRADE4_SCREENSHOT_DIR)
  : null;
const RAPID_BACK_ONLY = process.env.GRADE4_RAPID_BACK_ONLY === '1';
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
const failures = [];
let theoryScreensTraversed = 0;
let practiceTasksTraversed = 0;
let theoryGateFallbacks = 0;
let audioContractChecked = false;
let normalMotionTitleTimingsChecked = 0;
let choiceBranchScreensChecked = 0;
let choiceBranchesChecked = 0;
let numericBranchScreensChecked = 0;
let matchingBranchScreensChecked = 0;
let buildBranchScreensChecked = 0;
let rapidBranchScreensChecked = 0;
let rapidBackPersistenceChecked = 0;
const requested = new Set(process.argv.slice(2).map((value) => value.replace(/\.jsx$/, '')));

if (SCREENSHOT_DIR) await mkdir(SCREENSHOT_DIR, { recursive: true });

const registryPath = path.join(ROOT, 'src/lessons/grade4.js');
const registry = await readFile(registryPath, 'utf8');
const registeredLessons = [...registry.matchAll(/slug:\s*'([^']+)'[\s\S]*?Component:\s*lazy\(\(\)\s*=>\s*import\('\.\.\/components\/grade4\/(Dars\d{2}(Practice)?\.jsx)'\)\)/g)]
  .map((match) => ({ slug: match[1], file: match[2], section: match[3] ? 'amaliy' : 'nazariy' }));
const numberedFile = (number, suffix = '') => 'Dars' + String(number).padStart(2, '0') + suffix + '.jsx';
const targetLessonFiles = new Set([
  ...Array.from({ length: 51 }, (_, index) => numberedFile(index + 1)),
  ...Array.from({ length: 21 }, (_, index) => numberedFile(index + 1, 'Practice')),
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
if ((requested.size === 0 && lessons.length !== 72) || (requested.size > 0 && lessons.length !== requested.size)) {
  console.error('Grade 4 registrydan ' + lessons.length + ' mavjud route topildi, kutilgan ' + (requested.size || 72) + '.');
  process.exit(1);
}
if (registryOnlyLessons.length) {
  console.log(
    '[Grade 4 smoke scope] ' + registryOnlyLessons.map((lesson) => lesson.file).join(', ')
    + ' registry-only route sifatida tashlab ketildi; smoke Dars01–Dars51 va Dars01Practice–Dars21Practice bilan cheklangan.',
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
  const initializer = findVariableInitializer(ast, 'SCREEN_META') ?? findVariableInitializer(ast, 'SCREEN_PLAN');
  const meta = staticAstValue(initializer);
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
  const expression = source.slice(initializer.start, initializer.end);
  const tasks = runInNewContext('(' + expression + ')', {
    addEnglish: (value) => value,
    b,
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
  return issues;
}

const isTheoryContractLesson = (lesson) => lesson.section === 'nazariy'
  && /^Dars(?:0[2-9]|[1-4]\d|5[01])\.jsx$/.test(lesson.file);

const isStrictEtalonLesson = isTheoryContractLesson;

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
    const count = await currentScreenCount(page);
    if (count.current !== 1 || count.total < 13 || count.total > 17) {
      failures.push(prefix + ': screen-count ' + count.text + ', kutilgan 1 / 13–17');
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
        const timer = setTimeout(() => {
          timers.delete(timer);
          this.speaking = false;
          utterance.onend?.();
        }, 120);
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

async function waitForSpeechCount(page, minimum, timeout = 15_000) {
  await page.waitForFunction(
    (count) => (window.__grade4SpeechSmoke?.utterances.length ?? 0) >= count,
    minimum,
    { timeout },
  );
}

async function waitForCancellation(page, previous, timeout = 15_000) {
  await page.waitForFunction(
    (count) => (window.__grade4SpeechSmoke?.cancelCount ?? 0) > count,
    previous,
    { timeout },
  );
}

async function lessonLanguageControl(page, code) {
  const label = code.toUpperCase();
  const host = page.locator('.lesson-language button', { hasText: label });
  if (await host.count()) {
    return {
      button: host,
      active: page.locator('.lesson-language button.is-active', { hasText: label }),
      internalPreview: false,
    };
  }
  const preview = inLesson(page, '.preview-language button').filter({ hasText: label });
  const visiblePreview = await firstVisible(preview);
  if (visiblePreview) {
    return {
      button: visiblePreview,
      active: inLesson(page, '.preview-language button.preview-active').filter({ hasText: label }),
      internalPreview: true,
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
      await waitForSpeechCount(speechPage, 1);
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
        const beforeFeedback = (await speechState(speechPage)).utterances.length;
        await hookCards.first().click();
        await waitForSpeechCount(speechPage, beforeFeedback + 1);
      }

      const mute = await waitForVisible(speechPage, 'button[aria-label="Turn sound off"]');
      const beforeMuteCancel = (await speechState(speechPage)).cancelCount;
      await mute.click();
      await waitForCancellation(speechPage, beforeMuteCancel);
      if (await firstVisible(inLesson(speechPage, 'button[aria-label="Replay"]'))) {
        throw new Error('mute holatida Replay yashirilmadi');
      }

      const unmute = await waitForVisible(speechPage, 'button[aria-label="Turn sound on"]');
      await unmute.click();
      const replay = await waitForVisible(speechPage, 'button[aria-label="Replay"]');
      const beforeReplay = (await speechState(speechPage)).utterances.length;
      await replay.click();
      await waitForSpeechCount(speechPage, beforeReplay + 1);

      const beforeSwitchCancel = (await speechState(speechPage)).cancelCount;
      await switchLessonLanguage(speechPage, 'ru');
      await waitForCancellation(speechPage, beforeSwitchCancel);

      const beforeEnglish = (await speechState(speechPage)).utterances.length;
      await switchLessonLanguage(speechPage, 'en');
      await waitForSpeechCount(speechPage, beforeEnglish + 1);
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

async function validateCompletion(prefix, diagnostics, lesson = null) {
  await waitForCompletion(diagnostics);
  if (diagnostics.completionCalls.length !== 1) {
    throw new Error(prefix + ': [Lesson preview] onFinished soni ' + diagnostics.completionCalls.length + ', kutilgan 1');
  }
  const payload = diagnostics.completionCalls[0];
  const title = payload?.lessonTitle;
  if (typeof title !== 'string' || !title.trim() || hasCyrillic(title)) {
    throw new Error(prefix + ': English lessonTitle noto\'g\'ri: ' + JSON.stringify(title));
  }
  if (lesson && isStrictEtalonLesson(lesson) && lesson.file !== 'Dars51.jsx') {
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
        throw new Error(prefix + ': Dars08 faqat to\'rtta rapid score-unit bilan baholanishi kerak');
      }
      const rapidAnswer = payload.answers.find((answer) => answer?.screenIdx === 11);
      if (
        !rapidAnswer
        || rapidAnswer.totalQuestions !== 4
        || !Array.isArray(rapidAnswer.subResults)
        || rapidAnswer.subResults.length !== 4
        || !Array.isArray(rapidAnswer.attemptsByRound)
        || rapidAnswer.attemptsByRound.length !== 4
      ) {
        throw new Error(prefix + ': Dars08 s11 rapid LMS tafsilotlari to\'liq emas');
      }
    }
  }
  if (lesson?.file === 'Dars51.jsx') {
    if (payload?.assessment !== false) throw new Error(prefix + ': Dars51 assessment:false emas');
    for (const field of ['totalQuestions', 'correctAnswers', 'scorePercent', 'finalScore', 'finalTotal', 'passed']) {
      if (payload?.[field] !== null) throw new Error(prefix + ': Dars51 ' + field + ' null emas');
    }
    if (!Array.isArray(payload?.answers) || payload.answers.length < 1) {
      throw new Error(prefix + ': Dars51 ixtiyoriy javob LMS answers ichida qayd qilinmadi');
    }
  }
}

async function runPracticeTraversal(page, diagnostics, lesson, tasks) {
  const prefix = 'deep practice ' + lesson.file;
  diagnostics.reset();
  await openLesson(page, lesson, 'en');

  for (let index = 0; index < tasks.length; index += 1) {
    const task = tasks[index];
    const snapshot = await lessonSnapshot(page);
    const issues = snapshotIssues(snapshot, 'en');
    issues.forEach((issue) => failures.push(prefix + ' task ' + task.id + ': ' + issue));

    if (index === 0) {
      await selectChoice(page, task, false);
      await clickCheck(page);
      const wrongOutcome = await waitForPracticeOutcome(page);
      if (wrongOutcome.kind !== 'retry') throw new Error(prefix + ': wrong answer retry bermadi');
      const retryLabel = normalizeText(await wrongOutcome.button.innerText());
      if (!retryLabel || hasCyrillic(retryLabel)) throw new Error(prefix + ': retry label English emas');
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
      if (!/finish|complete|next|continue/i.test(finishLabel) || hasCyrillic(finishLabel)) {
        throw new Error(prefix + ': final transition English emas: ' + finishLabel);
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
  const finalIssues = snapshotIssues(finalSnapshot, 'en');
  finalIssues.forEach((issue) => failures.push(prefix + ' result: ' + issue));
  await validateCompletion(prefix, diagnostics);
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

async function auditVisibleTheoryMatching(
  page,
  issuePrefix,
  lang = 'en',
  checkLanguageSwitch = true,
  checkResize = true,
) {
  const left = inLesson(page, '[data-match-left]');
  const right = inLesson(page, '[data-match-right]');
  const leftCount = await left.count();
  const rightCount = await right.count();
  if (!leftCount && !rightCount) return false;
  if (!leftCount || !rightCount) throw new Error(issuePrefix + ': matching endpointlarining ikki tomoni to‘liq emas');

  let wrongSeen = false;
  let correctSeen = false;
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
  if (await (await theoryNextButton(page)).isEnabled()) {
    throw new Error(`${issuePrefix}: ichki faoliyat tugamasidan outer Next ochildi`);
  }
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
  if (requireBit) {
    const bit = await waitForVisibleMatch(feedback.locator('svg'));
    if (!bit) throw new Error(`${issuePrefix}: ${kind} feedbackda Bit yo'q`);
  }
  const feedbackText = normalizeText(await feedback.innerText());
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
  if (expectedUnits !== 4) throw new Error(`${issuePrefix}: rapid score unit ${expectedUnits}, kutilgan 4`);
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
      throw new Error(`${issuePrefix}: rapid 4-raund numeric input bo'lishi kerak`);
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
      if (await (await theoryNextButton(page)).isEnabled()) {
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
  if (!Number.isInteger(roundCount) || roundCount < 2) {
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
    if (!(await waitForAttributeValue(root, 'data-qa-guided-phase', 'steps'))) {
      throw new Error(`${issuePrefix}: guided choice yechilgach steps fazasi ochilmadi`);
    }
  } else if (phase !== 'steps') {
    throw new Error(`${issuePrefix}: guided phase ${phase} noma'lum`);
  }

  const stage = root.locator('[data-qa-guided-step-count]').first();
  if (!(await waitForAttached(stage))) throw new Error(`${issuePrefix}: guided step paneli ochilmadi`);
  const stepCount = Number(await stage.getAttribute('data-qa-guided-step-count'));
  if (!Number.isInteger(stepCount) || stepCount < 1) {
    throw new Error(`${issuePrefix}: guided step count ${stepCount} noto'g'ri`);
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
  if (!Number.isInteger(stepCount) || stepCount < 1) {
    throw new Error(`${issuePrefix}: explanation step count ${stepCount} noto'g'ri`);
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

async function auditVisibleChoiceBranches(page, issuePrefix, lang) {
  const choices = inLesson(page, '[data-g4-branch="choice"]');
  const choiceCount = await choices.count();
  if (!choiceCount) return false;
  await waitForEnabledCard(choices);

  const correct = inLesson(page, '[data-g4-branch="choice"][data-g4-correct="true"]');
  const wrong = inLesson(page, '[data-g4-branch="choice"][data-g4-correct="false"]');
  const correctCount = await correct.count();
  const wrongCount = await wrong.count();
  if (correctCount !== 1 || wrongCount < 1 || correctCount + wrongCount !== choiceCount) {
    throw new Error(`${issuePrefix}: choice semantikasi correct=${correctCount}, wrong=${wrongCount}, total=${choiceCount}`);
  }

  const wrongFeedbacks = new Set();
  for (let index = 0; index < wrongCount; index += 1) {
    const option = wrong.nth(index);
    if (!(await option.isEnabled())) throw new Error(`${issuePrefix}: wrong choice ${index + 1} retrydan oldin bloklangan`);
    await option.click();
    const feedbackText = await assertStrictFeedback(page, `${issuePrefix} wrong ${index + 1}`, 'wrong', lang);
    wrongFeedbacks.add(feedbackText);
    if (await (await theoryNextButton(page)).isEnabled()) {
      throw new Error(`${issuePrefix}: wrong choice ${index + 1} dan keyin Next ochildi`);
    }
  }
  if (wrongCount > 1 && wrongFeedbacks.size !== wrongCount) {
    throw new Error(`${issuePrefix}: ${wrongCount} distractor uchun xatoga xos feedbacklar takrorlangan`);
  }

  const correctOption = correct.first();
  if (!(await correctOption.isEnabled())) throw new Error(`${issuePrefix}: correct choice retrydan keyin bloklangan`);
  await correctOption.click();
  await assertStrictFeedback(page, `${issuePrefix} correct`, 'solution', lang);
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
  if (await (await theoryNextButton(page)).isEnabled()) {
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
  await assertStrictFeedback(page, issuePrefix + ' wrong build', 'wrong', lang);
  if (await (await theoryNextButton(page)).isEnabled()) {
    throw new Error(`${issuePrefix}: wrong builddan keyin Next ochildi`);
  }

  await clearBuildBoard(board, issuePrefix);
  await fillBuildBoard(board, answer, mode, issuePrefix + ' correct');
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
  const next = await theoryNextButton(page);
  if (await next.isEnabled()) {
    if (requireAction) throw new Error(`${issuePrefix}: faol ekranda javobsiz Continue ochiq`);
    return;
  }

  // Multi-phase components need their own deterministic traversal. These run
  // for every viewport; desktop branch QA additionally exercises each wrong
  // path, while mobile/tablet take the same natural correct path a learner can.
  const componentOptions = { auditWrong: auditBranches };
  if (await auditVisibleRapidConsole(page, issuePrefix, lang, componentOptions)) return;
  if (await auditVisibleReasoningRounds(page, issuePrefix, lang, componentOptions)) return;
  if (await auditVisibleGuidedChoiceSteps(page, issuePrefix, lang, componentOptions)) return;
  if (await auditVisibleBuildRounds(page, issuePrefix, lang, componentOptions)) return;
  if (await auditVisibleCaseConsole(page, issuePrefix, lang, componentOptions)) return;
  if (await auditVisibleStagedMatching(page, issuePrefix, lang, componentOptions)) return;
  if (await auditVisibleExplanationSteps(page, issuePrefix, lang)) return;
  if (await auditVisibleRuleBuilder(page, issuePrefix, lang, componentOptions)) return;

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

async function naturallyRevealStrictFinalReward(page, issuePrefix) {
  await muteLesson(page);
  const rewardIsVisible = async () => Boolean(
    await firstVisible(inLesson(page, '.g4-title-claim'))
    && await firstVisible(inLesson(
      page,
      '.finale-reflection button, .final-reflection button, [data-g4-role="reflection"] button, .reflection-options button',
    )),
  );
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
  throw new Error(issuePrefix + ': ' + count.text + ' final reflection tabiiy interaksiya bilan ochilmadi');
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

async function runTheoryTraversal(page, diagnostics, lesson) {
  const prefix = 'deep theory ' + lesson.file;
  diagnostics.reset();
  await openLesson(page, lesson, 'en');
  const firstCount = await currentScreenCount(page);
  const visited = [];
  const auditedMatchingScreens = new Set();

  for (let expected = 1; expected <= firstCount.total; expected += 1) {
    const count = await currentScreenCount(page);
    if (count.current !== expected || count.total !== firstCount.total) {
      throw new Error(prefix + ': screen tartibi ' + count.text + ', kutilgan ' + expected + ' / ' + firstCount.total);
    }
    visited.push(count.current);
    theoryScreensTraversed += 1;
    if (lesson.file === 'Dars51.jsx' && expected === 9) {
      const option = await firstVisible(inLesson(page, '.option'));
      if (!option) throw new Error(prefix + ': Dars51 ixtiyoriy javob varianti topilmadi');
      await option.click();
      await sleep(40);
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
        await naturallyUnlockStrictTheoryScreen(page, prefix + ' screen ' + expected);
        await clickEnabledTheoryButton(next, prefix + ' screen ' + expected, false);
      } else await advanceTheoryNormallyOrFallback(page, next, prefix + ' screen ' + expected);
      await waitForScreenChange(page, count.text);
    } else {
      if (isStrictEtalonLesson(lesson)) await naturallyRevealStrictFinalReward(page, prefix + ' final screen ' + expected);
      let claim = await firstVisible(inLesson(page, '.g4-title-claim'));
      const revealBeforeClaim = await firstVisible(page.locator('.g4-title-reveal-overlay'));
      const cardBeforeClaim = await firstVisible(inLesson(page, '[data-g4-role="title-card"]'));
      if (revealBeforeClaim || cardBeforeClaim) throw new Error(prefix + ': unvon claim bosilishidan oldin chiqdi');
      if (isStrictEtalonLesson(lesson) && !claim) throw new Error(prefix + ': majburiy Unvonni olish tugmasi topilmadi');
      if (claim) {
        if (isStrictEtalonLesson(lesson)) {
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
          if (await firstVisible(page.locator('.g4-title-reveal-overlay'))
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
          claim = await firstVisible(inLesson(page, '.g4-title-claim'));
          if (!claim || !(await claim.isEnabled())) throw new Error(prefix + ': pre-claim Back→Forward claim gate saqlanmadi');
        } else if (!(await claim.isEnabled())) {
          await muteLesson(page);
          const reflection = await firstVisible(inLesson(page, '.finale-reflection button, .final-reflection button, [data-g4-role="reflection"] button, .reflection-options button'));
          if (reflection) await reflection.click();
          await sleep(50);
          claim = await firstVisible(inLesson(page, '.g4-title-claim'));
        }
        if (await next.isEnabled()) throw new Error(prefix + ': Finish claimdan oldin faol');
        if (!(await claim.isEnabled())) throw new Error(prefix + ': reflectiondan keyin claim ochilmadi');
        await claim.click({ timeout: 8_000 });
        const revealOverlay = page.locator('.g4-title-reveal-overlay');
        await revealOverlay.waitFor({ state: 'visible', timeout: 2_000 });
        const reducedRevealStarted = Date.now();
        await revealOverlay.waitFor({ state: 'hidden', timeout: 1_200 });
        const reducedRevealElapsed = Date.now() - reducedRevealStarted;
        if (isStrictEtalonLesson(lesson) && reducedRevealElapsed > 650) {
          throw new Error(prefix + `: reduced-motion reveal ${reducedRevealElapsed}ms, 650ms limitdan oshdi`);
        }
        const titleCard = inLesson(page, '[data-g4-role="title-card"]');
        await titleCard.waitFor({ state: 'visible', timeout: 4_000 });
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
          if (await firstVisible(page.locator('.g4-title-reveal-overlay'))) {
            throw new Error(prefix + ': finalga qaytganda full-screen reveal avtomatik takrorlandi');
          }
          await inLesson(page, '[data-g4-role="title-card"]').waitFor({ state: 'visible', timeout: 2_000 });
          next = await theoryNextButton(page);
          if (!(await next.isEnabled())) throw new Error(prefix + ': finalga qaytganda olingan unvon saqlanmadi');
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
  await validateCompletion(prefix, diagnostics, lesson);
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
  const controls = inLesson(page, '.audio-controls button, [data-audio-control="mute"]');
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
  if (/^Dars(?:1[2-9]|2[0-7]|(?:29|3[0-4]|3[6-9]|4[01]))\.jsx$/.test(lesson.file)) {
    return inLesson(page, '.option');
  }
  return inLesson(page, '[data-g4-role="answer-card"]');
}

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
          const hook = await firstVisible(inLesson(page, '[data-g4-screen="hook"]'));
          const scene = await firstVisible(inLesson(page, '[data-g4-role="hook-scene"]'));
          if (!hook || !scene) throw new Error(`${lesson.file} ${lang}: canonical hook/scene marker topilmadi`);
          const cards = strictHookAnswerCards(page, lesson);
          const cardCount = await cards.count();
          if (cardCount < 3 || cardCount > 4) throw new Error(`${lesson.file} ${lang}: hook ${cardCount} ta answer card, kutilgan 3–4`);
          if (lesson.file === 'Dars06.jsx') {
            const structure = await hook.evaluate((root) => {
              const selectors = [
                '[data-g4-role="hook-topic"]',
                '[data-g4-role="hook-title"]',
                '[data-g4-role="hook-question"]',
                '[data-g4-role="hook-scene"]',
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
          if (fontSizes.some((fontSize) => !Number.isFinite(fontSize) || fontSize < 14)) {
            throw new Error(`${lesson.file} ${lang}: hook answer shrifti 14px dan kichik (${fontSizes.join(', ')})`);
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
            const feedbackBit = feedback.first().locator('svg').first();
            try {
              await feedbackBit.waitFor({ state: 'visible', timeout: 2_000 });
            } catch {
              throw new Error(`${lesson.file} ${lang}: ${rawKind} feedbackda Bit yo'q`);
            }
          }
          const feedbackText = normalizeText(await feedback.first().innerText());
          if (kind === 'wrong') {
            wrongSeen = true;
            const next = await theoryNextButton(page);
            if (strictHookRequiresCorrectAnswer(lesson) && await next.isEnabled()) {
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
  await naturallyRevealStrictFinalReward(page, `${issuePrefix} final screen ${count.current}`);
  return count;
}

async function enableStrictTitleClaim(page, issuePrefix) {
  await muteLesson(page);
  let claim = await firstVisible(inLesson(page, '.g4-title-claim'));
  if (!claim) throw new Error(issuePrefix + ': title claim topilmadi');
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
        const claim = await enableStrictTitleClaim(page, prefix);
        const overlay = page.locator('.g4-title-reveal-overlay');
        await claim.click({ timeout: 8_000 });
        await overlay.waitFor({ state: 'visible', timeout: 2_000 });
        const visibleAt = Date.now();
        await overlay.waitFor({ state: 'hidden', timeout: 5_000 });
        const elapsed = Date.now() - visibleAt;
        if (elapsed < 2_800 || elapsed > 4_500) {
          throw new Error(`${prefix}: reveal ${elapsed}ms, kutilgan 3200ms (2800–4500ms tolerantlik)`);
        }
        await inLesson(page, '[data-g4-role="title-card"]').waitFor({ state: 'visible', timeout: 2_000 });
        normalMotionTitleTimingsChecked += 1;
      } catch (error) {
        failures.push(prefix + ': ' + error.message);
      }
    }
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
        await naturallyUnlockStrictTheoryScreen(page, 'hook-back ' + lesson.file);
        await clickEnabledTheoryButton(next, 'hook-back ' + lesson.file, false);
        const second = await waitForScreenChange(page, hookCount.text);
        const back = inLesson(page, '.stage-nav button').first();
        if (!(await back.isVisible()) || !(await back.isEnabled())) throw new Error(lesson.file + ': Back ishlamaydi');
        await back.click();
        const returned = await waitForScreenChange(page, second.text);
        if (returned.current !== 1) throw new Error(lesson.file + ': Back hookka qaytarmadi');
        await muteLesson(page);
        const cards = strictHookAnswerCards(page, lesson);
        // A solved diagnostic may intentionally lock its cards while keeping
        // the restored selection, feedback and Continue gate visible.
        const anySelected = await cards.evaluateAll((elements) => elements.some((element) => (
          element.getAttribute('aria-pressed') === 'true'
            || /(?:selected|picked|correct|right)/.test(element.className)
        )));
        if (!anySelected) await waitForEnabledCard(cards);
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
          throw new Error(lesson.file + ': hook javobisiz Next oldindan ochiq');
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
    if (count.current !== 12 || count.total !== 16) {
      throw new Error(`rapid ekran ${count.text}, kutilgan 12 / 16`);
    }

    let rapid = await waitForVisibleMatch(inLesson(page, '[data-qa-rapid-console="true"]'));
    if (!rapid || !(await waitForAttributeValue(rapid.locator('[data-qa-rapid-round]').first(), 'data-qa-rapid-round', 0))) {
      throw new Error("rapid round 0 boshlang'ich markerida ochilmadi");
    }
    const roundZero = rapid.locator('[data-qa-rapid-round="0"]').first();
    const wrong = roundZero.locator('[data-g4-branch="choice"][data-g4-correct="false"]').first();
    const correct = roundZero.locator('[data-g4-branch="choice"][data-g4-correct="true"]').first();
    if (!(await waitForEnabledLocator(wrong)) || !(await waitForEnabledLocator(correct))) {
      throw new Error('rapid round 0 correct/wrong variantlari faol emas');
    }
    const wrongIndex = Number(await wrong.getAttribute('data-qa-rapid-option'));
    if (!Number.isInteger(wrongIndex)) throw new Error('rapid wrong option marker raqam emas');
    await wrong.click();
    if (!(await waitForDisabledLocator(wrong)) || !(await waitForClassToken(wrong, 'option-wrong'))) {
      throw new Error("rapid wrong branch disabled/visual holatga o'tmadi");
    }
    await assertStrictFeedback(page, `${prefix} first wrong`, 'wrong', 'en');
    const firstTryAfterWrong = await waitForJsonAttribute(
      rapid,
      'data-qa-rapid-first-try',
      (value) => Array.isArray(value) && value.length === 4 && value[0] === false && value.slice(1).every((item) => item === null),
    );
    const attemptsAfterWrong = await waitForJsonAttribute(
      rapid,
      'data-qa-rapid-attempts',
      (value) => Array.isArray(value) && value.length === 4 && value[0] === 1 && value.slice(1).every((item) => item === 0),
    );
    const wrongAfterWrong = await waitForJsonAttribute(
      rapid,
      'data-qa-rapid-wrong',
      (value) => Array.isArray(value) && value.length === 1 && value[0] === wrongIndex,
    );
    if (!firstTryAfterWrong || !attemptsAfterWrong || !wrongAfterWrong) {
      throw new Error('rapid partial firstTry/attempts/wrong snapshot saqlanmadi');
    }
    await assertOuterNextLocked(page, `${prefix} after wrong`);

    const back = inLesson(page, '.stage-nav button').first();
    if (!(await back.isVisible()) || !(await back.isEnabled())) throw new Error('rapid Back faol emas');
    await back.click();
    const previous = await waitForScreenChange(page, count.text);
    if (previous.current !== 11) throw new Error(`Back ${previous.text} ga o'tdi, kutilgan 11 / 16`);
    const ruleNext = await theoryNextButton(page);
    await naturallyUnlockStrictTheoryScreen(page, `${prefix} restored rule`, { lang: 'en' });
    await clickEnabledTheoryButton(ruleNext, `${prefix} restored rule`, false);
    count = await waitForScreenChange(page, previous.text);
    if (count.current !== 12) throw new Error(`rapid re-entry ${count.text}, kutilgan 12 / 16`);

    rapid = await waitForVisibleMatch(inLesson(page, '[data-qa-rapid-console="true"]'));
    const restoredRound = rapid?.locator('[data-qa-rapid-round="0"]').first();
    if (!rapid || !restoredRound || !(await restoredRound.isVisible().catch(() => false))) {
      throw new Error('re-entry rapid round 0ni saqlamadi');
    }
    const restoredWrong = restoredRound.locator(`[data-qa-rapid-option="${wrongIndex}"]`).first();
    if (!(await waitForDisabledLocator(restoredWrong)) || !(await waitForClassToken(restoredWrong, 'option-wrong'))) {
      throw new Error('re-entry wrong variant disabled/visual holatini saqlamadi');
    }
    if (!await waitForJsonAttribute(rapid, 'data-qa-rapid-first-try', (value) => value?.[0] === false)
      || !await waitForJsonAttribute(rapid, 'data-qa-rapid-attempts', (value) => value?.[0] === 1)
      || !await waitForJsonAttribute(rapid, 'data-qa-rapid-wrong', (value) => value?.includes(wrongIndex))) {
      throw new Error('re-entry firstTry/attempts/wrong markerlari saqlanmadi');
    }
    await assertStrictFeedback(page, `${prefix} restored wrong`, 'wrong', 'en');
    await assertOuterNextLocked(page, `${prefix} restored round 0`);

    await auditVisibleRapidConsole(page, `${prefix} resume`, 'en', { auditWrong: false, startRound: 0 });
    count = await currentScreenCount(page);
    while (count.current < count.total) {
      const next = await theoryNextButton(page);
      await naturallyUnlockStrictTheoryScreen(page, `${prefix} finish screen ${count.current}`, { lang: 'en' });
      await clickEnabledTheoryButton(next, `${prefix} finish screen ${count.current}`, false);
      count = await waitForScreenChange(page, count.text);
    }

    await muteLesson(page);
    const reflectionCorrect = await waitForVisibleMatch(inLesson(
      page,
      '[data-g4-role="reflection"] [data-g4-branch="choice"][data-g4-correct="true"]:not(:disabled)',
    ));
    if (!reflectionCorrect) throw new Error('final correct reflection faol emas');
    await reflectionCorrect.click();
    const claim = inLesson(page, '.g4-title-claim').first();
    if (!(await waitForEnabledLocator(claim))) throw new Error('reflectiondan keyin claim ochilmadi');
    await claim.click();
    const overlay = page.locator('.g4-title-reveal-overlay');
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
    const expectedFirstTry = [false, true, true, true];
    const expectedAttempts = [2, 1, 1, 1];
    if (JSON.stringify(rapidAnswer?.subResults) !== JSON.stringify(expectedFirstTry)
      || JSON.stringify(rapidAnswer?.attemptsByRound) !== JSON.stringify(expectedAttempts)
      || rapidAnswer?.correctCount !== 3
      || payload.correctAnswers !== 3
      || payload.firstTryStats?.firstTryCorrect !== 3) {
      throw new Error(`LMS rapid persistence noto'g'ri: ${JSON.stringify({
        subResults: rapidAnswer?.subResults,
        attemptsByRound: rapidAnswer?.attemptsByRound,
        correctCount: rapidAnswer?.correctCount,
        payloadCorrect: payload.correctAnswers,
        firstTryStats: payload.firstTryStats,
      })}`);
    }
    rapidBackPersistenceChecked += 1;
  } catch (error) {
    failures.push(`${prefix}: ${error.message}`);
  } finally {
    await context.close();
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
              const matchingAudited = viewport.name === 'desktop'
                ? await auditVisibleTheoryMatching(page, `${prefix} screen ${expected}`, lang, false)
                : false;

              if (expected < first.total) {
                if (!matchingAudited) {
                  await naturallyUnlockStrictTheoryScreen(page, `${prefix} screen ${expected}`, {
                    auditBranches: viewport.name === 'desktop',
                    lang,
                    requireAction: theoryScreenMeta.get(lesson.file)?.[expected - 1]?.active === true,
                  });
                }
                const next = await theoryNextButton(page);
                await clickEnabledTheoryButton(next, `${prefix} screen ${expected}`, false);
                await waitForScreenChange(page, count.text);
                continue;
              }

              await naturallyRevealStrictFinalReward(page, `${prefix} final screen ${expected}`);
              let claim = await firstVisible(inLesson(page, '.g4-title-claim'));
              const reflection = await firstVisible(inLesson(
                page,
                '.finale-reflection button, .final-reflection button, [data-g4-role="reflection"] button, .reflection-options button',
              ));
              if (!claim || !reflection) throw new Error('final reflection yoki claim topilmadi');
              if (await claim.isEnabled()) throw new Error('reflection tanlanmasidan claim faol');
              await muteLesson(page);
              await reflection.click();
              await sleep(50);
              claim = await firstVisible(inLesson(page, '.g4-title-claim'));
              if (!claim || !(await claim.isEnabled())) throw new Error('reflectiondan keyin claim ochilmadi');
              await claim.click({ timeout: 8_000 });
              const overlay = page.locator('.g4-title-reveal-overlay');
              await overlay.waitFor({ state: 'visible', timeout: 2_000 });
              const duringReveal = await lessonSnapshot(page);
              snapshotIssues(duringReveal, lang).forEach((issue) => failures.push(`${prefix} reveal: ${issue}`));
              await overlay.waitFor({ state: 'hidden', timeout: 5_000 });
              await inLesson(page, '[data-g4-role="title-card"]').waitFor({ state: 'visible', timeout: 2_000 });
              const claimed = await lessonSnapshot(page);
              snapshotIssues(claimed, lang).forEach((issue) => failures.push(`${prefix} claimed: ${issue}`));
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
    } else {
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
      await runStrictBackNavigation(browser);
      await runDars08RapidBackPersistence(browser);
      await runStrictScreenMatrix(browser);
      await runAudioContractSmoke(browser);
      await runProgressPersistence(browser);
      await runInvalidLanguageFallback(browser);

      const deepContext = await browser.newContext({
        viewport: { width: deepViewport.width, height: deepViewport.height },
        reducedMotion: 'reduce',
      });
      const deepPage = await deepContext.newPage();
      const deepDiagnostics = monitorPage(deepPage);
      for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex += 1) {
        const lesson = lessons[lessonIndex];
        try {
          if (lesson.section === 'nazariy') {
            await runTheoryTraversal(deepPage, deepDiagnostics, lesson);
          } else {
            await runPracticeTraversal(deepPage, deepDiagnostics, lesson, practiceTasks.get(lesson.file));
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
  console.log(
    'Grade 4 browser smoke o\'tdi: ' + lessons.length + ' route × 3 til × ' + VIEWPORTS.length + ' viewport; '
    + theoryCount + ' theory / ' + theoryScreensTraversed + ' EN screen; '
    + practiceCount + ' practice / ' + practiceTasksTraversed + ' EN task; '
    + theoryGateFallbacks + ' theory gate fallback; '
    + choiceBranchScreensChecked + ' choice screens / ' + choiceBranchesChecked + ' choice branches; '
    + numericBranchScreensChecked + ' numeric wrong/correct branch screens; '
    + buildBranchScreensChecked + ' build wrong/retry/correct screens; '
    + matchingBranchScreensChecked + ' matching wrong/correct connector screens; '
    + rapidBranchScreensChecked + ' rapid four-round branch screens; '
    + rapidBackPersistenceChecked + ' rapid partial Back persistence; '
    + normalMotionTitleTimingsChecked + ' normal-motion title timing; '
    + (audioContractChecked ? 'audio runtime contract checked.' : 'audio runtime contract skipped.'),
);
}
