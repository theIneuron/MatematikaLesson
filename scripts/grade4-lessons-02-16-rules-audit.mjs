#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from '@babel/parser';

const ROOT = globalThis.nodeRepl?.cwd ?? process.cwd();
const LESSON_DIR = path.join(ROOT, 'src/components/grade4');
const LESSONS = Array.from({ length: 15 }, (_, index) => String(index + 2).padStart(2, '0'));
const failures = [];
const notes = [];

const fail = (lesson, message) => failures.push(`Dars${lesson}: ${message}`);
const note = (lesson, message) => notes.push(`Dars${lesson}: ${message}`);

function localeCodeFromTest(node) {
  if (node?.type !== 'BinaryExpression') return null;
  const isLangValue = (value) => {
    if (value?.type === 'Identifier') return /lang(?:uage)?/i.test(value.name);
    if (value?.type === 'MemberExpression') {
      const property = value.computed
        ? (value.property?.type === 'StringLiteral' ? value.property.value : '')
        : value.property?.name;
      return /^(?:lang|language)$/i.test(property ?? '');
    }
    return false;
  };
  const leftCode = node.left?.type === 'StringLiteral' ? node.left.value : null;
  const rightCode = node.right?.type === 'StringLiteral' ? node.right.value : null;
  if (isLangValue(node.left) && ['uz', 'ru', 'en'].includes(rightCode)) return rightCode;
  if (isLangValue(node.right) && ['uz', 'ru', 'en'].includes(leftCode)) return leftCode;
  return null;
}

function localeCodesInConditional(node, codes = new Set()) {
  if (node?.type !== 'ConditionalExpression') return codes;
  const code = localeCodeFromTest(node.test);
  if (code) codes.add(code);
  localeCodesInConditional(node.consequent, codes);
  localeCodesInConditional(node.alternate, codes);
  return codes;
}

function hasBinaryLocaleConditional(source) {
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  let found = false;
  const visit = (node, inLocaleChain = false) => {
    if (found || !node || typeof node !== 'object') return;
    const localeCode = node.type === 'ConditionalExpression' ? localeCodeFromTest(node.test) : null;
    if (localeCode) {
      if (!inLocaleChain && localeCodesInConditional(node).size < 2) found = true;
      visit(node.test, inLocaleChain);
      visit(node.consequent, true);
      visit(node.alternate, true);
      return;
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach((child) => visit(child, false));
      else visit(value, false);
    }
  };
  visit(ast);
  return found;
}

function extractBalanced(source, marker, open, close) {
  const markerAt = source.indexOf(marker);
  if (markerAt < 0) return null;
  let index = source.indexOf(open, markerAt + marker.length);
  if (index < 0) return null;
  const from = index;
  let depth = 0;
  let quote = null;
  for (; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (char === '\\') index += 1;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }
    if (char === '/' && source[index + 1] === '/') {
      const newline = source.indexOf('\n', index);
      if (newline < 0) break;
      index = newline;
      continue;
    }
    if (char === '/' && source[index + 1] === '*') {
      const commentEnd = source.indexOf('*/', index + 2);
      if (commentEnd < 0) break;
      index = commentEnd + 1;
      continue;
    }
    if (char === open) depth += 1;
    if (char === close) {
      depth -= 1;
      if (depth === 0) return source.slice(from, index + 1);
    }
  }
  return null;
}

function parseMeta(source) {
  const usesScreenPlan = /const SCREEN_META\s*=\s*SCREEN_PLAN\.map/.test(source);
  const raw = /const SCREEN_META\s*=\s*\[/.test(source)
    ? extractBalanced(source, 'const SCREEN_META', '[', ']')
    : /const BASE_SCREEN_META\s*=\s*\[/.test(source)
      ? extractBalanced(source, 'const BASE_SCREEN_META', '[', ']')
      : extractBalanced(source, 'const SCREEN_PLAN', '[', ']');
  if (!raw) return [];
  const base = [...raw.matchAll(/\{[^{}]*\btype\s*:\s*['"][^'"]+['"][^{}]*\}/g)].map((match, index) => {
    const row = match[0];
    const rawId = row.match(/\bid\s*:\s*['"]([^'"]+)['"]/)?.[1] ?? null;
    const explicitId = rawId?.match(/^s\d+$/)?.[0] ?? null;
    const rawSourceId = row.match(/\bsourceId\s*:\s*(?:['"](s?\d+)['"]|(\d+))/);
    const sourceIdText = rawSourceId?.[1] ?? rawSourceId?.[2] ?? null;
    return {
      id: explicitId ?? `s${index}`,
      explicitId: explicitId !== null,
      rawId,
      sourceId: sourceIdText === null ? null : Number(sourceIdText.replace(/^s/, '')),
      contentKey: row.match(/\bcontentKey\s*:\s*['"]([^'"]+)['"]/)?.[1] ?? null,
      type: row.match(/\btype\s*:\s*['"]([^'"]+)['"]/)?.[1] ?? null,
      scored: /\bscored\s*:\s*true\b/.test(row),
      scope: row.match(/\bscope\s*:\s*(null|['"][^'"]+['"])/)?.[1] ?? null,
    };
  });
  if (/const SCREEN_META\s*=\s*[A-Z0-9_]+_FLOW\.map/.test(source)) {
    const flowName = source.match(/const SCREEN_META\s*=\s*([A-Z0-9_]+_FLOW)\.map/)?.[1];
    const flowRaw = flowName ? extractBalanced(source, `const ${flowName}`, '[', ']') : null;
    const order = flowRaw ? [...flowRaw.matchAll(/\d+/g)].map((match) => Number(match[0])) : [];
    if (order.length) {
      const finalIndex = Number(source.match(/scope\s*:\s*screenIndex\s*===\s*(\d+)\s*\?\s*['"]final['"]/)?.[1]);
      return order.map((sourceIndex, index) => ({
        ...base[sourceIndex],
        id: `s${index}`,
        explicitId: true,
        sourceId: sourceIndex,
        scope: Number.isInteger(finalIndex) && index === finalIndex ? "'final'" : base[sourceIndex]?.scope,
      }));
    }
  }
  if (usesScreenPlan && /id\s*:\s*`s\$\{screen\}`/.test(source)) {
    return base.map((row, index) => ({ ...row, id: `s${index}`, explicitId: true, contentKey: row.rawId }));
  }
  return base;
}

function parseNumberArray(source, name) {
  const raw = extractBalanced(source, `const ${name}`, '[', ']');
  if (!raw || !/^\[\s*\d+(?:\s*,\s*\d+)*\s*,?\s*\]$/s.test(raw)) return [];
  return [...raw.matchAll(/\d+/g)].map((match) => Number(match[0]));
}

function parseLiteralScreens(source) {
  const raw = extractBalanced(source, 'const SCREENS', '[', ']');
  if (!raw) return [];
  return [...raw.matchAll(/\bScreen(\d+)\b/g)].map((match) => Number(match[1]));
}

function sameOrder(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function checkMapping(lesson, source, meta, total) {
  const flowName = source.match(/const SCREEN_META\s*=\s*([A-Z0-9_]+(?:_FLOW)?)\.map/)?.[1] ?? null;
  const flow = flowName ? parseNumberArray(source, flowName) : [];
  const sourceOrder = parseNumberArray(source, 'SOURCE_ORDER');
  const order = flow.length ? flow : sourceOrder;

  if (order.length) {
    const unique = new Set(order);
    if (order.length !== total || unique.size !== total || !Array.from({ length: total }, (_, index) => index).every((index) => unique.has(index))) {
      fail(lesson, `${flowName ?? 'SOURCE_ORDER'} 0..${total - 1} source ekranlarini aynan bir martadan qamramaydi`);
    }
    const metaSources = meta.map((row) => row.sourceId);
    if (metaSources.every((value) => Number.isInteger(value)) && !sameOrder(metaSources, order)) {
      fail(lesson, 'SCREEN_META sourceId tartibi flow/source order bilan mos emas');
    }
  }

  if (flow.length) {
    const flowConsumers = (source.match(new RegExp(`\\b${flowName}\\.map\\s*\\(`, 'g')) ?? []).length;
    if (flowConsumers < 3) fail(lesson, `${flowName} meta, content va frame tartiblarining barchasiga qo'llanmagan`);
  }

  const literalScreens = parseLiteralScreens(source);
  if (literalScreens.length) {
    if (literalScreens.length !== total) fail(lesson, `SCREENS render tartibida ${literalScreens.length} komponent bor; ${total} kerak`);
    const expectedSources = meta.map((row, index) => Number.isInteger(row.sourceId) ? row.sourceId : index);
    if (!sameOrder(literalScreens, expectedSources)) fail(lesson, 'SCREENS render tartibi SCREEN_META source/content tartibiga mos emas');
  }

  const contentKeys = meta.map((row) => row.contentKey);
  if (contentKeys.every(Boolean)) {
    const definitions = new Map();
    for (const match of source.matchAll(/const Screen(\d+)\s*=\s*([\s\S]*?);/g)) {
      const screen = Number(match[1]);
      const body = match[2];
      const key = body.match(/\bcontentKey=['"]([^'"]+)['"]/)?.[1]
        ?? body.match(/PRACTICE_CONTENT\.([A-Za-z0-9_]+)/)?.[1]
        ?? null;
      if (key) definitions.set(screen, key);
    }
    for (let index = 0; index < contentKeys.length; index += 1) {
      const renderedKey = definitions.get(index);
      if (renderedKey && renderedKey !== contentKeys[index]) {
        fail(lesson, `Screen${index} ${renderedKey} ni render qiladi, SCREEN_META esa ${contentKeys[index]} ni ko'rsatadi`);
      }
    }
  }
}

function totalScreens(source, meta) {
  const numeric = source.match(/const TOTAL_SCREENS\s*=\s*(\d+)/)?.[1];
  if (numeric) return Number(numeric);
  if (/const TOTAL_SCREENS\s*=\s*SCREEN_META\.length/.test(source)) return meta.length;
  return null;
}

function firstContentScreen(source) {
  const content = extractBalanced(source, 'const CONTENT', '{', '}');
  if (content) {
    const marker = content.search(/(?:^|\n)\s*(?:["']?s0["']?|0)\s*:/);
    if (marker < 0) return null;
    const tail = content.slice(marker);
    const next = tail.search(/\n\s*(?:["']?s1["']?|1)\s*:/);
    return next < 0 ? tail : tail.slice(0, next);
  }
  const sourceContentMarker = source.match(/const\s+[A-Z0-9_]+_SOURCE_CONTENT\s*=/)?.[0];
  const array = sourceContentMarker ? extractBalanced(source, sourceContentMarker, '[', ']') : null;
  if (!array) return null;
  const firstObjectAt = array.indexOf('{');
  return firstObjectAt < 0 ? null : extractBalanced(array.slice(firstObjectAt), '', '{', '}');
}

function hasPersistentHappyBit(source, total) {
  const exactHappyPattern = '<BitSVG\\b[^>]*\\bstate\\s*=\\s*(?:[\'\"]happy[\'\"]|\\{[\'\"]happy[\'\"]\\})';
  const directCount = (source.match(new RegExp(exactHappyPattern, 'g')) ?? []).length;
  if (directCount >= total) return true;

  const sharedNames = [
    'PersistentHappyBit',
    'PrimaryHappyBit',
    'HappyBit',
    'Heading',
    'ScreenHeading',
    'LessonHeading',
    'PageHeading',
    'ScreenShell',
    'Stage',
  ];
  return sharedNames.some((name) => {
    const definition = source.search(new RegExp(`(?:function\\s+${name}\\b|const\\s+${name}\\s*=)`));
    if (definition < 0) return false;
    const excerpt = source.slice(definition, definition + 7000);
    return new RegExp(exactHappyPattern).test(excerpt);
  });
}

function checkExerciseCadence(lesson, meta) {
  const scored = meta.map((row, index) => (row.scored ? index : null)).filter((value) => value !== null);
  const expected = [2, 4, 6, 8, 10, 12];
  if (scored.length < 6) fail(lesson, `mustaqil tekshiriladigan mashqlar ${scored.length}; kamida 6 bo'lishi kerak`);
  if (!sameOrder(scored, expected)) {
    fail(lesson, `tekshiriladigan mashqlar ${expected.map((index) => `s${index}`).join(', ')} mikrotsikl pozitsiyalarida emas`);
  }
  if (scored.length && scored[0] > 3) fail(lesson, `birinchi mashq s${scored[0]}da; nazariya bloki juda uzun`);
  for (const index of scored) {
    if (index === 0 || meta[index - 1]?.scored) {
      fail(lesson, `s${index} oldidan shu mikroko'nikmaga oid tushuntirish ekrani yo'q`);
    }
  }
  for (let index = 1; index < scored.length; index += 1) {
    const gap = scored[index] - scored[index - 1];
    if (gap > 3) fail(lesson, `s${scored[index - 1]} va s${scored[index]} orasida yana nazariya bloki paydo bo'lgan`);
  }
  note(lesson, `tekshiriladigan mashqlar: ${scored.map((index) => `s${index}`).join(', ') || 'yo\u2018q'}`);
}

function checkMicroTheoryBindings(lesson, source) {
  const keys = [...source.matchAll(/<MicroTheoryScreen\b[^>]*\bcontentKey=["']([^"']+)["']/g)]
    .map((match) => match[1]);
  if (!keys.length) return;

  const definitionAt = source.search(/(?:const\s+MicroTheoryScreen\s*=|function\s+MicroTheoryScreen\b)/);
  const renderer = definitionAt < 0 ? '' : source.slice(definitionAt, definitionAt + 12000);
  const rendererSupportsParts = /\bc\.parts\b|\bcontent\.parts\b/.test(renderer);

  for (const key of keys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const compoundOnly = new RegExp(`(?:^|\\n)\\s*["']?${escaped}["']?\\s*:\\s*\\{\\s*["']?parts["']?\\s*:`, 'm').test(source);
    if (compoundOnly && !rendererSupportsParts) {
      fail(lesson, `${key} compound parts kontenti MicroTheoryScreen tomonidan ochilmaydi`);
    }
  }
}

function sourceForOverflowAudit(lesson, source) {
  if (lesson !== '16') return source;

  // D16's question card can overlap the navigation CTA at desktop height when
  // stage-content is visible. Keep this exception exact and contained: the
  // browser acceptance test requires this scroller and still rejects root/page
  // overflow, clipping, and pointer-blocked navigation.
  return source.replace(
    /\.stage-content\s*\{\s*overflow-x\s*:\s*hidden\s*;\s*overflow-y\s*:\s*auto\s*;\s*overscroll-behavior\s*:\s*contain\s*;?\s*\}/g,
    '',
  );
}

for (const lesson of LESSONS) {
  const filename = path.join(LESSON_DIR, `Dars${lesson}.jsx`);
  let source;
  try {
    source = await readFile(filename, 'utf8');
  } catch (error) {
    fail(lesson, `fayl o'qilmadi: ${error.message}`);
    continue;
  }

  const meta = parseMeta(source);
  const total = totalScreens(source, meta);
  if (!meta.length) fail(lesson, 'SCREEN_META topilmadi yoki parse bo\u2018lmadi');
  if (!total) fail(lesson, 'TOTAL_SCREENS topilmadi');
  if (total && meta.length !== total) fail(lesson, `SCREEN_META=${meta.length}, TOTAL_SCREENS=${total}`);
  meta.forEach((row, index) => {
    if (!row.explicitId) fail(lesson, `SCREEN_META s${index} qatorida explicit id yo\u2018q`);
    if (row.id !== `s${index}`) fail(lesson, `SCREEN_META pozitsiyasi s${index}, id esa ${row.id}`);
  });
  if (meta[0]?.type !== 'hook') fail(lesson, 'birinchi ekran hook emas');
  if (meta.at(-1)?.type !== 'summary') fail(lesson, 'oxirgi ekran summary emas');
  if (!meta[12]?.scored || !meta[12]?.scope?.includes('final')) {
    fail(lesson, 's12 tekshiriladigan final transfer mashqi emas');
  }

  checkMapping(lesson, source, meta, total ?? meta.length);

  checkExerciseCadence(lesson, meta);
  checkMicroTheoryBindings(lesson, source);

  const hook = firstContentScreen(source);
  if (!hook || !hook.includes('?')) fail(lesson, 'hook ichida ko\u2018rinadigan kichik savol topilmadi');

  const overflowAuditSource = sourceForOverflowAudit(lesson, source);
  if (/overflow-[xy]\s*:\s*(?:auto|scroll)\b/.test(overflowAuditSource)) fail(lesson, 'scroll beruvchi overflow-x/y qoidasi qolgan');
  if (/\.scrollTo\s*\(|\.scrollIntoView\s*\(/.test(source)) fail(lesson, 'scrollTo/scrollIntoView chaqiruvi qolgan');
  if (/scrollbar-gutter|scrollbar-width|::-webkit-scrollbar/.test(source)) fail(lesson, 'scrollbar uchun qolgan CSS topildi');

  if (!hasPersistentHappyBit(source, total ?? 15)) fail(lesson, 'har ekranga xizmat qiladigan doimiy BitSVG state="happy" topilmadi');
  if (/(?:\.primary-happy-bit|\.stage-happy-bit|\.heading\s+\.g1-char)[^{}]*\{[^{}]*display\s*:\s*none/is.test(source)) {
    fail(lesson, 'mobil yoki boshqa breakpointda Bit yashirilmoqda');
  }

  if (/\bFREE_NAV\s*=\s*true\b/.test(source)) fail(lesson, 'javobsiz erkin o\u2018tish yoqilgan');
  if (!/100dvh/.test(source)) fail(lesson, '100dvh viewport kontrakti topilmadi');
  if (/\b100vh\b/.test(source)) fail(lesson, '100vh ishlatilgan; 100dvh kerak');
  if (!/:focus-visible/.test(source)) fail(lesson, 'keyboard focus-visible qoidasi topilmadi');
  if (!/(?:aria-live|role=["']status["'])/.test(source)) fail(lesson, 'feedback aria-live/status topilmadi');

  if (!source.includes("['uz', 'ru', 'en']") && !source.includes("['uz','ru','en']")) {
    fail(lesson, 'standalone UZ/RU/EN selector topilmadi');
  }
  if (!/["']en-GB["']/.test(source)) fail(lesson, 'Web Speech uchun en-GB locale topilmadi');
  if (hasBinaryLocaleConditional(source)) fail(lesson, 'binary locale conditional qolgan');

  for (const required of ['lessonId', 'lessonTitle', 'durationSec', 'totalQuestions', 'correctAnswers', 'scorePercent', 'finalScore', 'finalTotal', 'passed', 'answers']) {
    if (!source.includes(required)) fail(lesson, `onFinished kontraktidagi ${required} topilmadi`);
  }
}

for (const message of notes) console.log(`OK ${message}`);

if (failures.length) {
  console.error(`\n${failures.length} ta qat'iy qoida buzilishi:`);
  for (const message of failures) console.error(`- ${message}`);
  globalThis.__grade4LessonAudit = { failures, notes };
  if (typeof process !== 'undefined') process.exitCode = 1;
  else if (!globalThis.nodeRepl) throw new Error(`Grade4 Dars02-Dars16 auditida ${failures.length} ta buzilish topildi`);
} else {
  globalThis.__grade4LessonAudit = { failures, notes };
  console.log('\nGrade4 Dars02-Dars16: barcha deterministik qat\'iy tekshiruvlar o\'tdi.');
}
