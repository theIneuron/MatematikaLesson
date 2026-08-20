#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = globalThis.nodeRepl?.cwd ?? process.cwd();
const GRADE4_DIR = path.join(ROOT, 'src/components/grade4');
const FRAME_VECTOR = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
// Metodist qarori 2026-08-19: 21-30 darslar qaytadan quriladi (tushuntirish ->
// misol ritmi, bosib ochiladigan qadamlar, etalon yakuniy slaydi). Ularda eski
// 15 slaydli qolip va avtomatik frame vektori amal qilmaydi, shuning uchun
// qolipga bogliq tekshiruvlar otkazib yuboriladi; ornida qolipdan mustaqil
// tekshiruv ishlaydi va toliq kontraktni grade4-etalon-contract-audit.mjs
// tekshiradi. Qolgan hamma tekshiruv (ovoz tozaligi, skroll, a11y, importlar)
// bu darslarga ham baravar qollanadi.
const REBUILT_LESSONS = new Set([22]);
const QUESTION_SCREENS = [8, 9, 10, 11, 12, 13];
const scoredScreensFor = (lesson) => lesson >= 28
  ? [8, 9, 10, 12, 13]
  : QUESTION_SCREENS;
const EXPECTED = {
  22: 'dars22-sonning-kasr-qismini-topish',
  23: 'dars23-kasrli-masalalar',
  24: 'dars24-onli-kasrlar',
  25: 'dars25-toplamlar-eyler-venn-diagrammasi',
  26: 'dars26-uzunlik-birliklari',
  27: 'dars27-massa-birliklari',
  28: 'dars28-vaqt-birliklari',
  29: 'dars29-yuza-birliklari',
  30: 'dars30-kattalik-birliklarini-aylantirish',
};

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
    return vm.runInNewContext(`(${raw})`, {
      bi: (uz, ru, en) => ({ uz, ru, en }),
    }, { timeout: 3000 });
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

function walkSpoken(node, at = '', activeLang = null, inAudio = false, output = []) {
  if (typeof node === 'string') {
    if (inAudio) output.push({ at, lang: activeLang, value: node });
    return output;
  }
  if (Array.isArray(node)) {
    node.forEach((value, index) => walkSpoken(value, `${at}[${index}]`, activeLang, inAudio, output));
    return output;
  }
  if (node && typeof node === 'object') {
    Object.entries(node).forEach(([key, value]) => {
      const lang = key === 'uz' || key === 'ru' || key === 'en' ? key : activeLang;
      const spoken = inAudio || key === 'audio' || key === 'feedbackAudio' || key === 'neutralAudio';
      walkSpoken(value, at ? `${at}.${key}` : key, lang, spoken, output);
    });
  }
  return output;
}

function validateSpoken(lesson, content) {
  for (const item of walkSpoken(content)) {
    if (/\d/.test(item.value)) fail(lesson, `${item.at}: audio ichida raqam bor`);
    if (/[=<>≥≤×÷+−/%$€]/.test(item.value)) fail(lesson, `${item.at}: audio ichida formula belgisi bor`);
    if (/[—–«»“”„‟‘’ʻʼ✓✔✗✘]/.test(item.value)) fail(lesson, `${item.at}: audio ichida TTS uchun taqiqlangan belgi bor`);
    if (item.lang === 'uz' && /[Ѐ-ӿ]/.test(item.value)) fail(lesson, `${item.at}: UZ audioda kirill bor`);
    if (item.lang === 'en' && /[Ѐ-ӿ]/.test(item.value)) fail(lesson, `${item.at}: EN audioda kirill bor`);
    if (item.lang === 'uz' && /\b(sen|senga|sening|seni|senda|sendan)\b/i.test(item.value)) fail(lesson, `${item.at}: UZ audioda sen ishlatilgan`);
  }
}

function expectedOptionCount(lesson, screen) {
  if (lesson === 25) return 4;
  if ((lesson === 26 || lesson === 27) && screen <= 12) return 4;
  if ((lesson === 26 || lesson === 27) && screen === 13) return 0;
  return 3;
}

// Qolipdan mustaqil tekshiruv: variantli har bir blokda har bir variantga
// korinadigan izoh va TTS-toza izoh bolishi shart, correctIndex esa haqiqiy
// variantga ishora qilishi kerak. Xuk (bashorat) bloki chetlab otiladi: unda
// togri javob yoq, bitta neytral izoh bor.
function validateRebuiltContent(lesson, content) {
  if (!content || content.__parseError) {
    fail(lesson, "CONTENT parse bolmadi" + (content?.__parseError ? ": " + content.__parseError : ""));
    return;
  }
  const screens = Object.entries(content).filter(([key]) => /^s\d+$/.test(key));
  if (!screens.length) fail(lesson, "CONTENT ekranlari topilmadi");
  const blocks = [];
  for (const [key, item] of screens) {
    const neutralBlock = item?.neutral !== undefined && item?.correctIndex === undefined;
    if (Array.isArray(item?.options) && !neutralBlock) blocks.push([key, item]);
    for (const [nestedKey, nested] of Object.entries(item ?? {})) {
      if (!Array.isArray(nested)) continue;
      nested.forEach((entry, index) => {
        if (entry && Array.isArray(entry.options)) blocks.push([key + "." + nestedKey + "[" + index + "]", entry]);
      });
    }
  }
  for (const [at, item] of blocks) {
    const count = item.options.length;
    if (count < 3) fail(lesson, at + ": variantlar " + count + " ta, kamida uchta kerak");
    if (!Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex >= count) {
      fail(lesson, at + ": correctIndex notogri");
    }
    if (!Array.isArray(item.feedback) || item.feedback.length !== count) {
      fail(lesson, at + ": har variant uchun korinadigan izoh yoq");
    }
    if (!Array.isArray(item.feedbackAudio) || item.feedbackAudio.length !== count) {
      fail(lesson, at + ": har variant uchun TTS-toza feedbackAudio yoq");
    }
  }
  validateSpoken(lesson, content);
}

function validateContent(lesson, content) {
  if (!content || content.__parseError) {
    fail(lesson, `CONTENT parse bo'lmadi${content?.__parseError ? `: ${content.__parseError}` : ''}`);
    return;
  }
  const keys = Object.keys(content).filter((key) => /^s\d+$/.test(key));
  if (keys.length !== 15) fail(lesson, `CONTENT ekranlari ${keys.length}, kutilgan 15`);
  FRAME_VECTOR.forEach((count, screen) => {
    const item = content[`s${screen}`];
    if (!item) {
      fail(lesson, `s${screen} topilmadi`);
      return;
    }
    if (!Array.isArray(item.frames) || item.frames.length !== count) {
      fail(lesson, `s${screen} visible frame ${item.frames?.length ?? 0}, kutilgan ${count}`);
    }
    for (const lang of ['uz', 'ru', 'en']) {
      const segments = introSegments(item, lang);
      if (segments.length !== count) {
        fail(lesson, `s${screen}.${lang} avtomatik audio beat ${segments.length}, kutilgan ${count}`);
      }
    }
    if (QUESTION_SCREENS.includes(screen)) {
      const optionCount = expectedOptionCount(lesson, screen);
      if (optionCount === 0) {
        const numericAnswer = item.answer ?? item.correctAnswer ?? item.expectedAnswer ?? item.inputAnswer;
        if (numericAnswer == null) fail(lesson, `s${screen} numeric input javobi topilmadi`);
      } else {
        if (!Array.isArray(item.options) || item.options.length !== optionCount) {
          fail(lesson, `s${screen} variantlari ${item.options?.length ?? 0}, reja bo'yicha ${optionCount}`);
        }
        if (!Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex >= (item.options?.length ?? 0)) {
          fail(lesson, `s${screen} correctIndex noto'g'ri`);
        }
        const visibleFeedback = item.feedback ?? item.audio?.on_wrong;
        if (!Array.isArray(visibleFeedback) || visibleFeedback.length !== item.options?.length) {
          fail(lesson, `s${screen} har variant uchun visible feedback yo'q`);
        }
        if (!Array.isArray(item.feedbackAudio) || item.feedbackAudio.length !== item.options?.length) {
          fail(lesson, `s${screen} har variant uchun TTS-safe feedbackAudio yo'q`);
        }
      }
    }
  });
  validateSpoken(lesson, content);
}

for (const [lessonText, slug] of Object.entries(EXPECTED)) {
  const lesson = Number(lessonText);
  const filename = path.join(GRADE4_DIR, `Dars${lesson}.jsx`);
  let source;
  try {
    source = await readFile(filename, 'utf8');
  } catch (error) {
    fail(lesson, `fayl o'qilmadi: ${error.message}`);
    continue;
  }

  const rebuilt = REBUILT_LESSONS.has(lesson);
  const frames = extractLiteral(source, 'FRAME_COUNTS', '[', ']');
  if (!Array.isArray(frames) || (!rebuilt && frames.join(',') !== FRAME_VECTOR.join(','))) {
    fail(lesson, `FRAME_COUNTS noto'g'ri: ${JSON.stringify(frames)}`);
  } else {
    note(lesson, `${frames.length} slayd, ${frames.reduce((sum, value) => sum + value, 0)} avtomatik frame`);
  }

  const total = Number(source.match(/const TOTAL_SCREENS\s*=\s*(\d+)/)?.[1] ?? frames?.length);
  if (rebuilt) {
    // Qayta qurilgan darsda slayd soni 13-17 orasida (4-sinf etaloni), lekin
    // FRAME_COUNTS, SCREEN_META va SCREENS uzunliklari bir-biriga mos kelishi shart.
    if (!Number.isInteger(total) || total < 13 || total > 17) fail(lesson, `TOTAL_SCREENS ${total}, kutilgan 13-17`);
    if (Array.isArray(frames) && frames.length !== total) fail(lesson, `FRAME_COUNTS uzunligi ${frames.length}, TOTAL_SCREENS ${total}`);
    validateRebuiltContent(lesson, extractLiteral(source, 'CONTENT'));
  } else {
    if (total !== 15) fail(lesson, `TOTAL_SCREENS ${total}, kutilgan 15`);
    validateContent(lesson, extractLiteral(source, 'CONTENT'));
  }

  const screenMetaRaw = extractBalanced(source, 'const SCREEN_META =', '[', ']');
  const metaRows = screenMetaRaw?.match(/\{\s*id:\s*['"]s\d+['"][\s\S]*?\}/g) ?? [];
  if (rebuilt) {
    if (metaRows.length !== total) fail(lesson, `SCREEN_META qatorlari ${metaRows.length}, TOTAL_SCREENS ${total}`);
  } else {
    if (metaRows.length !== 15) fail(lesson, `SCREEN_META qatorlari ${metaRows.length}, kutilgan 15`);
    const scored = metaRows.map((row, index) => (/scored:\s*true/.test(row) ? index : null)).filter((value) => value !== null);
    const expectedScored = scoredScreensFor(lesson);
    if (scored.join(',') !== expectedScored.join(',')) fail(lesson, `scored slaydlar [${scored}], kutilgan [${expectedScored}]`);
  }

  const screensRaw = extractBalanced(source, 'const SCREENS', '[', ']');
  const screenComponents = screensRaw?.match(/Screen\d+/g) ?? [];
  if (screenComponents.length !== (rebuilt ? total : 15)) {
    fail(lesson, `SCREENS komponentlari ${screenComponents.length}, kutilgan ${rebuilt ? total : 15}`);
  }

  if (!source.includes(`slug: '${slug}'`)) fail(lesson, `LESSON_META slug ${slug} emas`);
  if (/[‘’ʻʼ]/.test(source)) fail(lesson, "ASCII bo'lmagan apostrof topildi");
  if (!source.includes("['uz', 'ru', 'en']") && !source.includes("['uz','ru','en']")) fail(lesson, 'standalone UZ/RU/EN selector topilmadi');
  if (!/["']en-GB["']/.test(source)) fail(lesson, 'Web Speech uchun en-GB locale topilmadi');
  if (/\blang\s*===\s*["'](?:uz|ru)["']\s*\?/.test(source)) fail(lesson, 'binary locale conditional qolgan');
  if (/\bFREE_NAV\b|setTimeout\([^)]*(?:advance|onNext|finish)/.test(source)) {
    fail(lesson, 'majburiy o\'quv harakatini chetlab o\'tadigan navigatsiya topildi');
  }
  if (/\bdraggable=|onDragStart=|onDrop=/.test(source)) fail(lesson, 'majburiy drag topildi');
  if (/\bFREE_NAV\b/.test(source)) fail(lesson, 'FREE_NAV flagi topildi');
  if (/<img\b|https?:\/\/[^'"`)]+\.(?:png|jpe?g|webp|gif)/i.test(source)) fail(lesson, 'tashqi raster rasm topildi');
  if (/from\s+['"]\.\//.test(source)) fail(lesson, 'LMS single-file kontraktini buzuvchi relative import topildi');
  if (/\boverflow(?:-[xy])?\s*:\s*(?:auto|scroll)\b/i.test(source) || /\boverflow(?:X|Y)?\s*:\s*["'](?:auto|scroll)["']/i.test(source)) fail(lesson, 'scroll beruvchi overflow qoidasi qolgan');
  if (/\b(?:scrollTo|scrollIntoView)(?:\?\.)?\s*\(/.test(source)) fail(lesson, 'scrollTo/scrollIntoView chaqiruvi qolgan');
  if (/scrollbar-(?:gutter|width|color)|::-webkit-scrollbar/i.test(source)) fail(lesson, 'scrollbar CSS qolgan');
  if (/\binfinite\b/.test(source)) fail(lesson, 'cheksiz animatsiya topildi');
  if (/UNVON YOPIQ|ЗВАНИЕ ЗАКРЫТО|🔒/.test(source)) fail(lesson, 'yakuniy badge qulflangan');
  if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(source)) fail(lesson, "prefers-reduced-motion yo'q");
  if (!/role=['"]status['"]|aria-live=/.test(source)) fail(lesson, "feedback uchun aria-live/status yo'q");
  if (!/:focus-visible/.test(source)) fail(lesson, "keyboard focus-visible yo'q");
  if (!/min-height:\s*(?:4[4-9]|[5-9]\d)px/.test(source)) fail(lesson, "44px touch target dalili yo'q");
  if (!/width:min\(936px,100%\)/.test(source)) fail(lesson, '936px stage kontrakti topilmadi');
  if (!/const BitSVG/.test(source)) fail(lesson, 'tasdiqlangan BitSVG topilmadi');
  if (!/const AudioIndicator/.test(source)) fail(lesson, 'audio paneli topilmadi');
  if (!/studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode/.test(source)) fail(lesson, "platform props to'liq emas");
  if (/pushOneOff\(t\(ok \? c\.audio\.on_correct : c\.feedback\[index\]\)\)/.test(source)) fail(lesson, 'visible feedback TTSga xom yuborilmoqda');
  if (!/audio\.pushOneOff\([^;\n]*feedbackAudio|const spoken = c\.feedbackAudio/.test(source)) fail(lesson, 'TTS-safe per-option feedback ishlatilmagan');

  if (lesson === 24 && /taqqoslash|сравнен|yaxlit|округл|qo'shish|ayirish|сложен|вычитан/i.test(source)) fail(lesson, "o'nli kasr mavzu chegarasidan tashqari amal/taqqoslash topildi");
  if (lesson === 25 && /[∪∩]|kesishma|пересечени[ея]/i.test(source)) fail(lesson, "formal to'plam amali yoki termin topildi");
  if (lesson === 29 && /\b(?:ar|gektar)\b|\b(?:ар|гектар)\b/i.test(source)) fail(lesson, 'ar/gektar mavzudan tashqari topildi');
  if (lesson === 30 && !/Universal ×10 yo'q|Универсального ×10 нет/.test(source)) fail(lesson, "universal ×10 rad etilishi aniq ko'rsatilmagan");
}

const registry = await readFile(path.join(ROOT, 'src/lessons/grade4.js'), 'utf8');
for (const [lesson, slug] of Object.entries(EXPECTED)) {
  if (!registry.includes(`slug: '${slug}'`)) fail(lesson, 'registry slug topilmadi');
  if (!registry.includes(`components/grade4/Dars${lesson}.jsx`)) fail(lesson, 'registry lazy import topilmadi');
}

notes.forEach((message) => console.log(`✓ ${message}`));
if (failures.length) {
  console.error(`\n${failures.length} ta audit xatosi:`);
  failures.forEach((message) => console.error(`  - ${message}`));
  process.exitCode = 1;
} else {
  console.log('\nGrade4 Dars22-30 audit: barcha deterministik tekshiruvlar o\'tdi.');
}
