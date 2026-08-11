#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
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
const LANGS = ['uz', 'ru', 'en'];
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'desktop', width: 1366, height: 768 },
];
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
const requested = new Set(process.argv.slice(2).map((value) => value.replace(/\.jsx$/, '')));

const registryPath = path.join(ROOT, 'src/lessons/grade4.js');
const registry = await readFile(registryPath, 'utf8');
const registeredLessons = [...registry.matchAll(/slug:\s*'([^']+)'[\s\S]*?Component:\s*lazy\(\(\)\s*=>\s*import\('\.\.\/components\/grade4\/(Dars\d{2}(Practice)?\.jsx)'\)\)/g)]
  .map((match) => ({ slug: match[1], file: match[2], section: match[3] ? 'amaliy' : 'nazariy' }));
const numberedFile = (number, suffix = '') => 'Dars' + String(number).padStart(2, '0') + suffix + '.jsx';
const targetLessonFiles = new Set([
  ...Array.from({ length: 30 }, (_, index) => numberedFile(index + 1)),
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
if ((requested.size === 0 && lessons.length !== 51) || (requested.size > 0 && lessons.length !== requested.size)) {
  console.error('Grade 4 registrydan ' + lessons.length + ' mavjud route topildi, kutilgan ' + (requested.size || 51) + '.');
  process.exit(1);
}
if (registryOnlyLessons.length) {
  console.log(
    '[Grade 4 smoke scope] ' + registryOnlyLessons.map((lesson) => lesson.file).join(', ')
    + ' registry-only route sifatida tashlab ketildi; smoke Dars01–Dars30 va Dars01Practice–Dars21Practice bilan cheklangan.',
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
        if (intersects(rect, hostPanels[right].getBoundingClientRect())) {
          panelIssues.push(describeBox(hostPanels[left]) + ' ↔ ' + describeBox(hostPanels[right]));
        }
      }
      if (root) {
        const candidates = [...root.querySelectorAll('button,a,input,select,textarea,.chrome-actions > *,.p4-head-row > *,.g4p-head-row > *')]
          .filter(visible);
        for (const candidate of candidates) {
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
    const contentCanonicalText = (stageContent?.innerText ?? text)
      .split(/\n+/)
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .sort()
      .join('\n');
    return {
      text,
      canonicalText,
      contentCanonicalText,
      scrollWidth: root?.scrollWidth ?? 0,
      clientWidth: root?.clientWidth ?? 0,
      scrollHeight: root?.scrollHeight ?? 0,
      clientHeight: root?.clientHeight ?? 0,
      contentScrollHeight: stageContent?.scrollHeight ?? 0,
      contentClientHeight: stageContent?.clientHeight ?? 0,
      documentHeight: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0),
      viewportHeight: window.innerHeight,
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
  if (snapshot.emptyAriaLabels.length) issues.push('bo\'sh aria-label: ' + snapshot.emptyAriaLabels.join(', '));
  if (snapshot.clippedText.length) issues.push('matn clip: ' + snapshot.clippedText.join(', '));
  if (snapshot.panelIssues.length) issues.push('panel collision: ' + snapshot.panelIssues.join(', '));
  return issues;
}

const isNoGateTheory = (lesson) => lesson.section === 'nazariy'
  && /^Dars(?:3[1-9]|4\d|5[01])\.jsx$/.test(lesson.file);

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

  if (!isNoGateTheory(lesson)) return;
  const firstCount = await currentScreenCount(page);
  for (let expected = 1; expected <= firstCount.total; expected += 1) {
    const count = await currentScreenCount(page);
    if (count.current !== expected || count.total !== 15) {
      throw new Error(prefix + ': screen tartibi ' + count.text + ', kutilgan ' + expected + ' / 15');
    }
    if (expected >= 9 && expected <= 14) {
      const firstOption = await firstVisible(inLesson(page, '.option'));
      if (!firstOption) throw new Error(prefix + ' screen ' + expected + ': javob varianti topilmadi');
      await firstOption.click();
      await sleep(40);
    }
    const current = await lessonSnapshot(page);
    snapshotIssues(current, lang).forEach((issue) => failures.push(prefix + ' screen ' + expected + ': ' + issue));
    if (expected === firstCount.total) continue;
    const next = await theoryNextButton(page);
    if (!(await next.isEnabled())) {
      throw new Error(prefix + ' screen ' + expected + ': Continue audio, animatsiya yoki javob bilan bloklangan');
    }
    await next.click();
    await waitForScreenChange(page, count.text);
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

async function installSpeechMock(context, utteranceDuration = 120) {
  await context.addInitScript((duration) => {
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
  }, utteranceDuration);
}

async function speechState(page) {
  return page.evaluate(() => ({
    utterances: [...(window.__grade4SpeechSmoke?.utterances ?? [])],
    cancelCount: window.__grade4SpeechSmoke?.cancelCount ?? 0,
  }));
}

async function waitForSpeechCount(page, minimum, timeout = 3_000) {
  await page.waitForFunction(
    (count) => (window.__grade4SpeechSmoke?.utterances.length ?? 0) >= count,
    minimum,
    { timeout },
  );
}

async function waitForCancellation(page, previous, timeout = 3_000) {
  await page.waitForFunction(
    (count) => (window.__grade4SpeechSmoke?.cancelCount ?? 0) > count,
    previous,
    { timeout },
  );
}

async function runAudioContractSmoke(browser) {
  const lesson = lessons.find((item) => item.file === 'Dars01.jsx');
  if (!lesson) return;
  audioContractChecked = true;

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
      failures.push('audio Web Speech: EN utterance lang en-GB emas');
    }

    const mute = await waitForVisible(speechPage, 'button[aria-label="Turn sound off"]');
    const beforeMuteCancel = (await speechState(speechPage)).cancelCount;
    await mute.click();
    await waitForCancellation(speechPage, beforeMuteCancel);
    if (await firstVisible(inLesson(speechPage, 'button[aria-label="Replay"]'))) {
      failures.push('audio Web Speech: mute holatida Replay yashirilmadi');
    }

    const unmute = await waitForVisible(speechPage, 'button[aria-label="Turn sound on"]');
    await unmute.click();
    const replay = await waitForVisible(speechPage, 'button[aria-label="Replay"]');
    const beforeReplay = (await speechState(speechPage)).utterances.length;
    await replay.click();
    await waitForSpeechCount(speechPage, beforeReplay + 1);

    const beforeSwitchCancel = (await speechState(speechPage)).cancelCount;
    await speechPage.locator('.lesson-language button', { hasText: 'RU' }).click();
    await speechPage.locator('.lesson-language button.is-active', { hasText: 'RU' }).waitFor();
    await waitForCancellation(speechPage, beforeSwitchCancel);

    const beforeEnglish = (await speechState(speechPage)).utterances.length;
    await speechPage.locator('.lesson-language button', { hasText: 'EN' }).click();
    await speechPage.locator('.lesson-language button.is-active', { hasText: 'EN' }).waitFor();
    await waitForSpeechCount(speechPage, beforeEnglish + 1);
    const afterSwitch = await speechState(speechPage);
    if (afterSwitch.utterances.slice(beforeEnglish).some((item) => item.lang !== 'en-GB')) {
      failures.push('audio Web Speech: EN ga qaytganda utterance en-GB emas');
    }
  } catch (error) {
    failures.push('audio Web Speech: ' + error.message);
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
    const deadline = Date.now() + 3_000;
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
      failures.push('audio HTTP TTS: production branch Web Speech ishlatdi');
    }
  } catch (error) {
    failures.push('audio HTTP TTS: ' + error.message);
  } finally {
    await httpContext.close();
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

async function validateCompletion(prefix, diagnostics) {
  await waitForCompletion(diagnostics);
  if (diagnostics.completionCalls.length !== 1) {
    throw new Error(prefix + ': [Lesson preview] onFinished soni ' + diagnostics.completionCalls.length + ', kutilgan 1');
  }
  const payload = diagnostics.completionCalls[0];
  const title = payload?.lessonTitle;
  if (typeof title !== 'string' || !title.trim() || hasCyrillic(title)) {
    throw new Error(prefix + ': English lessonTitle noto\'g\'ri: ' + JSON.stringify(title));
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

async function clickEnabledTheoryButton(next, issuePrefix) {
  try {
    await next.click({ timeout: 1_500 });
  } catch (error) {
    const reason = normalizeText(error.message).split(' Call log:')[0];
    const pointerState = await next.evaluate((element) => {
      const describe = (node) => {
        if (!(node instanceof Element)) return String(node);
        const classes = [...node.classList].slice(0, 3).join('.');
        return node.tagName.toLowerCase() + (node.id ? '#' + node.id : '') + (classes ? '.' + classes : '');
      };
      const describeBox = (node) => {
        if (!(node instanceof Element)) return String(node);
        const rect = node.getBoundingClientRect();
        const box = [rect.left, rect.top, rect.width, rect.height]
          .map((value) => Math.round(value * 10) / 10)
          .join('/');
        return describe(node) + '[' + box + ']';
      };
      const rect = element.getBoundingClientRect();
      const x = Math.max(0, Math.min(innerWidth - 1, rect.left + rect.width / 2));
      const y = Math.max(0, Math.min(innerHeight - 1, rect.top + rect.height / 2));
      return describeBox(element) + ' center-hit ' + describeBox(document.elementFromPoint(x, y));
    });
    failures.push(issuePrefix + ': Next pointer interaction bloklandi: ' + reason + '; ' + pointerState);
    theoryGateFallbacks += 1;
    await next.evaluate((element) => element.click());
  }
}

async function waitForButtonEnabled(button, timeout = 250) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await button.isEnabled()) return true;
    await sleep(10);
  }
  return button.isEnabled();
}

async function advanceTheoryNormallyOrFallback(page, next, issuePrefix) {
  if (await next.isEnabled() || await waitForButtonEnabled(next)) {
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

  for (let expected = 1; expected <= firstCount.total; expected += 1) {
    const count = await currentScreenCount(page);
    if (count.current !== expected || count.total !== firstCount.total) {
      throw new Error(prefix + ': screen tartibi ' + count.text + ', kutilgan ' + expected + ' / ' + firstCount.total);
    }
    visited.push(count.current);
    theoryScreensTraversed += 1;
    const snapshot = await lessonSnapshot(page);
    const issues = snapshotIssues(snapshot, 'en');
    issues.forEach((issue) => failures.push(prefix + ' screen ' + expected + ': ' + issue));

    const next = await theoryNextButton(page);
    if (isNoGateTheory(lesson) && !(await next.isEnabled())) {
      throw new Error(prefix + ' screen ' + expected + ': Continue audio, animatsiya yoki javob bilan bloklangan');
    }
    if (expected < firstCount.total) {
      if (isNoGateTheory(lesson)) await next.click();
      else await advanceTheoryNormallyOrFallback(page, next, prefix + ' screen ' + expected);
      await waitForScreenChange(page, count.text);
    } else {
      const finishLabel = normalizeText(await next.innerText());
      if (!/finish|complete/i.test(finishLabel) || hasCyrillic(finishLabel)) {
        throw new Error(prefix + ': final action English Finish emas: ' + finishLabel);
      }
      if (isNoGateTheory(lesson)) {
        await next.evaluate((element) => {
          element.click();
          element.click();
        });
      } else {
        if (await next.isEnabled() || await waitForButtonEnabled(next)) {
          await next.evaluate((element) => {
            element.click();
            element.click();
          });
        } else {
          theoryGateFallbacks += 1;
          const invoked = await invokeNearestReactCallback(next, 'finishLesson', 2);
          if (!invoked) await forceClick(next, 2);
        }
      }
    }
  }

  if (new Set(visited).size !== firstCount.total) {
    throw new Error(prefix + ': ' + visited.length + '/' + firstCount.total + ' unique screen traversed');
  }
  await validateCompletion(prefix, diagnostics);
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
    await forceClick(next);
    const advanced = await waitForScreenChange(page, before.text);
    for (const code of ['ru', 'en', 'uz']) {
      await page.locator('.lesson-language button', { hasText: code.toUpperCase() }).click();
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
  const lesson = allLessons.find((item) => item.file === 'Dars01.jsx') ?? lessons[0];
  if (!lesson) return;
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await openLesson(page, lesson, 'uz');
    const uzSnapshot = await lessonSnapshot(page);
    await openLesson(page, lesson, 'xx');
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

    await runAudioContractSmoke(browser);
    await runProgressPersistence(browser);
    await runInvalidLanguageFallback(browser);

    const deepContext = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      reducedMotion: 'reduce',
    });
    await installSpeechMock(deepContext, 8);
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
  console.log(
    'Grade 4 browser smoke o\'tdi: ' + lessons.length + ' route × 3 til × 3 viewport; '
    + theoryCount + ' theory / ' + theoryScreensTraversed + ' EN screen; '
    + practiceCount + ' practice / ' + practiceTasksTraversed + ' EN task; '
    + theoryGateFallbacks + ' theory gate fallback; '
    + (audioContractChecked ? 'audio runtime contract checked.' : 'audio runtime contract skipped.'),
  );
}
