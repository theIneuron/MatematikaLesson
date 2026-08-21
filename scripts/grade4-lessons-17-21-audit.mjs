#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = globalThis.nodeRepl?.cwd ?? process.cwd();
const GRADE4_DIR = path.join(ROOT, 'src/components/grade4');

const EXPECTED = {
  17: { screens: 15, frames: [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5], scored: [8, 9, 10, 11, 12, 13], slug: 'dars17-shkalalar', badge: ['Shkala kalibratori', 'Калибровщик шкал'] },
  18: { screens: 16, frames: [3, 4, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5], scored: [9, 10, 11, 12, 13, 14], slug: 'dars18-kasr-tushunchasi', badge: ['Kasrlar tadqiqotchisi', 'Исследователь дробей'] },
  19: { screens: 16, frames: [3, 4, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5], scored: [9, 10, 11, 12, 13, 14], slug: 'dars19-kasrlarni-taqqoslash', badge: ['Taqqoslash eksperti', 'Эксперт сравнения'] },
  20: { screens: 15, frames: [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5], scored: [8, 9, 10, 11, 12, 13], slug: 'dars20-kasrlarni-qoshish', badge: ["Kasrlar yig'indisi ustasi", 'Мастер суммы дробей'] },
  // Dars21 metodist qaroriga ko'ra 2026-08-19 da qaytadan qurildi (21-30 blokining
  // pilot darsi): tushuntirish -> misol ritmi, bosib ochiladigan qadamlar, och ko'k
  // ramkalar. Shuning uchun spec eski 15 ekranlik qolipdan yangisiga ko'chirildi.
  21: { screens: 16, frames: [3, 2, 3, 2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 5], scored: [5, 9, 10, 12, 13, 14], slug: 'dars21-kasrlarni-ayirish', badge: ['Taqsimot muhandisi', 'Инженер распределения'] },
};

// Bosib ochiladigan qadam UI si eski 17-20 darslarda taqiqlangan (ular ovoz bilan
// sinxron ochiladi). Qaytadan qurilgan darslarda esa qadamni bola boshqaradi -
// ovoz o'chirilganda tushuntirish yo'qolib qolmasligi uchun (metodist 2026-08-19).
const REBUILT_LESSONS = new Set(['21']);

const failures = [];
const notes = [];

const fail = (lesson, message) => failures.push(`Dars${lesson}: ${message}`);
const note = (lesson, message) => notes.push(`Dars${lesson}: ${message}`);

function extractBalanced(source, startToken, open = '{', close = '}') {
  const start = source.indexOf(startToken);
  if (start < 0) return null;
  let index = source.indexOf(open, start);
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
      index = source.indexOf('\n', index);
      if (index < 0) break;
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

function extractLiteral(source, name, open = '{', close = '}') {
  const raw = extractBalanced(source, `const ${name} =`, open, close);
  if (!raw) return null;
  try {
    return vm.runInNewContext(`(${raw})`, { bi: (uz, ru, en) => ({ uz, ru, en }) }, { timeout: 2000 });
  } catch (error) {
    return { __parseError: error.message };
  }
}

function introSegments(screen, lang) {
  const source = screen?.audio?.intro ?? screen?.audio;
  const value = source?.[lang];
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function conditionalSegments(screen, lang) {
  const value = screen?.audio?.on_correct?.[lang];
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function walkAudio(node, at = '', inAudio = false, output = []) {
  if (typeof node === 'string') {
    if (inAudio) output.push({ at, value: node });
    return output;
  }
  if (Array.isArray(node)) {
    node.forEach((value, index) => walkAudio(value, `${at}[${index}]`, inAudio, output));
    return output;
  }
  if (node && typeof node === 'object') {
    Object.entries(node).forEach(([key, value]) => walkAudio(value, at ? `${at}.${key}` : key, inAudio || key === 'audio' || /Audio$/.test(key), output));
  }
  return output;
}

function audioTextFailures(lesson, items) {
  for (const item of items) {
    if (/\d/.test(item.value)) fail(lesson, `${item.at}: audioda raqam bor`);
    if (/[=<>≥≤×÷+−/%$€]/.test(item.value)) fail(lesson, `${item.at}: audioda formula belgisi bor`);
    if (/[—–«»“”„‟‘’ʻʼ]/.test(item.value)) fail(lesson, `${item.at}: TTS uchun taqiqlangan tipografik belgi bor`);
  }
}

for (const [lesson, spec] of Object.entries(EXPECTED)) {
  const filename = path.join(GRADE4_DIR, `Dars${lesson}.jsx`);
  let source;
  try {
    source = await readFile(filename, 'utf8');
  } catch (error) {
    fail(lesson, `fayl o'qilmadi: ${error.message}`);
    continue;
  }

  const frames = extractLiteral(source, 'FRAME_COUNTS', '[', ']');
  if (!Array.isArray(frames) || frames.join(',') !== spec.frames.join(',')) {
    fail(lesson, `FRAME_COUNTS noto'g'ri: ${JSON.stringify(frames)}`);
  } else {
    note(lesson, `${frames.length} ekran, ${frames.reduce((sum, value) => sum + value, 0)} frame`);
  }

  const content = extractLiteral(source, 'CONTENT');
  const dataScreens = content
    ? null
    : extractLiteral(source, lesson === '18' ? 'D18_SCREENS' : 'SCREENS', '[', ']');
  const total = Number(source.match(/const TOTAL_SCREENS\s*=\s*(\d+)/)?.[1] ?? dataScreens?.length);
  if (total !== spec.screens) fail(lesson, `ekranlar soni=${total}, kutilgan ${spec.screens}`);

  if (!content || content.__parseError) {
    if (!Array.isArray(dataScreens) || dataScreens.__parseError) {
      fail(lesson, `CONTENT/data screens parse bo'lmadi${content?.__parseError ? `: ${content.__parseError}` : ''}`);
    } else {
      if (dataScreens.length !== spec.screens) fail(lesson, `data ekranlari ${dataScreens.length}, kutilgan ${spec.screens}`);
      spec.frames.forEach((count, screen) => {
        const item = dataScreens[screen];
        if (!item || (!spec.scored.includes(screen) && item.frames?.length !== count) || (spec.scored.includes(screen) && count > 2 && item.frames?.length !== count)) {
          fail(lesson, `s${screen} visible framelari ${item?.frames?.length}, kutilgan ${count}`);
        }
        for (const lang of ['uz', 'ru', 'en']) {
          const actual = introSegments(item, lang).length;
          if (spec.scored.includes(screen)) {
            const proofCount = conditionalSegments(item, lang).length;
            if (count === 2 && actual !== 1) fail(lesson, `s${screen}.${lang} scored F1 intro segmentlari ${actual}, kutilgan 1`);
            if (actual + proofCount !== count) fail(lesson, `s${screen}.${lang} intro+on_correct ${actual}+${proofCount}, kutilgan ${count}`);
          } else if (actual !== count) {
            fail(lesson, `s${screen}.${lang} intro segmentlari ${actual}, frame ${count}`);
          }
        }
      });
      audioTextFailures(lesson, walkAudio(dataScreens));
    }
  } else {
    const keys = Object.keys(content).filter((key) => /^s\d+$/.test(key));
    if (keys.length !== spec.screens) fail(lesson, `CONTENT ekranlari ${keys.length}, kutilgan ${spec.screens}`);
    spec.frames.forEach((count, screen) => {
      for (const lang of ['uz', 'ru', 'en']) {
        const item = content[`s${screen}`];
        const actual = introSegments(item, lang).length;
        if (spec.scored.includes(screen)) {
          const proofCount = conditionalSegments(item, lang).length;
          if (count === 2 && actual !== 1) fail(lesson, `s${screen}.${lang} scored F1 intro segmentlari ${actual}, kutilgan 1`);
          if (actual + proofCount !== count) fail(lesson, `s${screen}.${lang} intro+on_correct ${actual}+${proofCount}, kutilgan ${count}`);
        } else if (actual !== count) {
          fail(lesson, `s${screen}.${lang} intro segmentlari ${actual}, frame ${count}`);
        }
      }
    });
    const spokenItems = walkAudio(content);
    if (/pushOneOff\(t\(ok \? c\.audio\.on_correct : c\.feedback\[index\]\)\)/.test(source)) {
      Object.entries(content).forEach(([screen, item]) => {
        (item.feedback ?? []).forEach((value, index) => walkAudio({ audio: value }, `${screen}.spokenFeedback[${index}]`, false, spokenItems));
      });
    }
    audioTextFailures(lesson, spokenItems);
  }

  const screenMetaRaw = extractBalanced(source, 'const SCREEN_META =', '[', ']');
  const metaRows = screenMetaRaw?.match(/\{\s*id:\s*['"]s\d+['"][\s\S]*?\}/g) ?? [];
  if (!dataScreens && metaRows.length !== spec.screens) fail(lesson, `SCREEN_META qatorlari ${metaRows.length}, kutilgan ${spec.screens}`);
  const scored = dataScreens
    ? dataScreens.map((item, index) => (item.type === 'test' || item.type === 'case' ? index : null)).filter((value) => value !== null)
    : metaRows.map((row, index) => (/scored:\s*true/.test(row) ? index : null)).filter((value) => value !== null);
  if (scored.join(',') !== spec.scored.join(',')) fail(lesson, `scored ekranlar [${scored}], kutilgan [${spec.scored}]`);

  if (!dataScreens) {
    const screensRaw = extractBalanced(source, 'const SCREENS', '[', ']');
    const screenComponents = screensRaw?.match(/Screen\d+/g) ?? [];
    if (screenComponents.length !== spec.screens) fail(lesson, `SCREENS komponentlari ${screenComponents.length}, kutilgan ${spec.screens}`);
  }

  if (!source.includes(`slug: '${spec.slug}'`)) fail(lesson, `LESSON_META slug ${spec.slug} emas`);
  if (!source.includes("['uz', 'ru', 'en']") && !source.includes("['uz','ru','en']")) fail(lesson, 'standalone UZ/RU/EN selector topilmadi');
  if (!/["']en-GB["']/.test(source)) fail(lesson, 'Web Speech uchun en-GB locale topilmadi');
  if (/\blang\s*===\s*["'](?:uz|ru)["']\s*\?/.test(source)) fail(lesson, 'binary locale conditional qolgan');
  for (const badge of spec.badge) if (!source.includes(badge)) fail(lesson, `final badge topilmadi: ${badge}`);
  if (!REBUILT_LESSONS.has(lesson) && /useTapSteps|phase-dots|phaseDots|Keyingi qadam|Следующий шаг/.test(source)) fail(lesson, 'majburiy qadam/phase UI topildi');
  if (/\bdraggable=|onDragStart=/.test(source)) fail(lesson, 'tap alternativisiz majburiy drag topildi');
  if (/<img\b|https?:\/\/[^'"`)]+\.(?:png|jpe?g|webp|gif)/i.test(source)) fail(lesson, 'tashqi raster rasm topildi');
  // Umumiy 4-sinf modullari ruxsat etilgan (metodist qarori 2026-08-18):
  // ular LMS uchun build vaqtida bitta bundle ga yigiladi, har darsga
  // nusxalash esa CLAUDE.md 5-bandini buzardi. Boshqa relative import - xato.
  const SHARED_GRADE4_MODULES = new Set([
    './theoryNavigation.js',
    './Grade4Finale.jsx',
    './mobileZoom.js',
    './modelSteps.jsx',
    './supportHint.jsx',
    './grade4GeometryFrameStyles.js',
    // 2026-08-21: xato javob ko'rsatkichi va maket tuzatishlari umumiy modulga
    // chiqarildi (bitta bagni 20 faylda tuzatmaslik uchun) — CLAUDE.md §5.
    './wrongAnswerFlash.js',
    './grade4LayoutFixStyles.js',
  ]);
  const foreignImports = [...source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)]
    .map((match) => match[1])
    .filter((specifier) => !SHARED_GRADE4_MODULES.has(specifier));
  if (foreignImports.length) {
    fail(lesson, 'LMS single-file kontraktini buzuvchi relative import topildi: ' + foreignImports.join(', '));
  }
  if (/\bFREE_NAV\b/.test(source)) fail(lesson, 'FREE_NAV orqali javobsiz o\u2018tish kontrakti qolgan');
  if (/\boverflow(?:-[xy])?\s*:\s*(?:auto|scroll)\b/i.test(source) || /\boverflow(?:X|Y)?\s*:\s*["'](?:auto|scroll)["']/i.test(source)) fail(lesson, 'scroll beruvchi overflow qoidasi qolgan');
  if (/\b(?:scrollTo|scrollIntoView)(?:\?\.)?\s*\(/.test(source)) fail(lesson, 'scrollTo/scrollIntoView chaqiruvi qolgan');
  if (/scrollbar-(?:gutter|width|color)|::-webkit-scrollbar/i.test(source)) fail(lesson, 'scrollbar CSS qolgan');
  if (/\binfinite\b/.test(source)) fail(lesson, 'cheksiz dekorativ animatsiya topildi');
  if (/UNVON YOPIQ|ЗВАНИЕ ЗАКРЫТО|🔒/.test(source)) fail(lesson, 'yakuniy badge qulflanadigan holat topildi');
  if (/Nunito Sans/.test(source)) fail(lesson, 'tasdiqlanmagan Nunito Sans ishlatilgan');
  if (!/@media\(prefers-reduced-motion:reduce\)/.test(source)) fail(lesson, 'prefers-reduced-motion yo‘q');
  if (!/role="status"|aria-live=/.test(source)) fail(lesson, 'feedback uchun aria-live/status yo‘q');
  if (!/:focus-visible/.test(source)) fail(lesson, 'keyboard uchun ko‘rinadigan focus-visible yo‘q');
  if (!/min-height:\s*(?:4[4-9]|[5-9]\d)px/.test(source)) fail(lesson, '44px touch target dalili topilmadi');
  if (!/const BitSVG/.test(source)) fail(lesson, 'tasdiqlangan BitSVG komponenti topilmadi');
  if (!/const AudioIndicator/.test(source)) fail(lesson, 'audio paneli topilmadi');
  if (!/studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode/.test(source)) {
    fail(lesson, 'platform props Dars16 kontraktiga mos emas');
  }
  if (lesson === '17' && /masshtab|масштаб|chizmadagi uzunlik|длина на чертеже/i.test(source)) fail(lesson, 'mavzudan tashqari xarita/chizma masshtabi topildi');
  if (lesson === '18' && /qisqartirish|сокращени[ея]|aralash son|смешанн(?:ое|ые) чис/i.test(source)) fail(lesson, 'dars chegarasidan tashqari kasr mavzusi topildi');
  if (lesson === '19' && /umumiy maxraj|общ(?:ий|его) знаменател|ko'ndalang ko'paytir|крест-накрест/i.test(source)) fail(lesson, 'taqiqlangan umumiy maxraj/ko‘ndalang usul topildi');
  if (lesson === '20' && !/7\/10/.test(source)) fail(lesson, 'qisqartirilmaydigan 7/10 natija topilmadi');
  // 4-sinfda natija qisqartirilmaydi. Qayta qurilgan 21-darsda buni 6/16 va 6/14
  // natijalari ko'rsatadi (ilgari 4/10 va 5/12 edi).
  if (lesson === '21' && (!/6\/16/.test(source) || !/6\/14/.test(source))) fail(lesson, 'qisqartirilmaydigan 6/16 yoki 6/14 natija topilmadi');
}

const dars16 = await readFile(path.join(GRADE4_DIR, 'Dars16.jsx'), 'utf8');
for (const expected of [
  "Shkalalar: bo'linma qiymati",
  'Шкалы: цена деления',
  "Keyingi darsda shkaladagi bitta bo'linmaning qiymatini topishni o'rganamiz.",
  'На следующем уроке научимся находить цену одного деления шкалы.',
]) {
  if (!dars16.includes(expected)) fail(16, `bridge matni topilmadi: ${expected}`);
}

const registry = await readFile(path.join(ROOT, 'src/lessons/grade4.js'), 'utf8');
for (const [lesson, spec] of Object.entries(EXPECTED)) {
  if (!registry.includes(`slug: '${spec.slug}'`)) fail(lesson, 'registry slug topilmadi');
  if (!registry.includes(`components/grade4/Dars${lesson}.jsx`)) fail(lesson, 'registry lazy import topilmadi');
}

notes.forEach((message) => console.log(`✓ ${message}`));
if (failures.length) {
  console.error(`\n${failures.length} ta audit xatosi:`);
  failures.forEach((message) => console.error(`  - ${message}`));
  if (typeof process !== 'undefined') process.exitCode = 1;
} else {
  console.log("\nGrade4 Dars17–21 audit: barcha deterministik tekshiruvlar o'tdi.");
}
