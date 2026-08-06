// grade3-new-lesson.mjs — создаёт КАРКАС нового урока 3 класса на общем движке `_kit/`.
//
// Что делает: пишет файл урока со всей обвязкой — импорты кита, метаданные, пустой CONTENT
// на 15 экранов, мосты, корневой компонент, строку стилей — и регистрирует урок в
// `src/lessons/grade3.js`. Дальше остаётся работа, которую нельзя сгенерировать: контент
// RU+UZ, сцена и экраны.
//
// Чего НЕ делает намеренно: не сочиняет экраны. Механику каждого экрана выбирает методист
// в документе блока; готовые образцы — в соседних уроках (`Dars17.jsx` — самый свежий).
//
// Запуск: node scripts/grade3-new-lesson.mjs 18 dars18-ikki-xonalini-bolish "Ikki xonali sonni bir xonaliga bo'lish" "Двузначное разделить на однозначное"
import fs from 'node:fs';
import path from 'node:path';

const [num, slug, titleUz, titleRu] = process.argv.slice(2);
if (!num || !slug || !titleUz || !titleRu) {
  console.log('нужно: node scripts/grade3-new-lesson.mjs <номер> <slug> "<тема UZ>" "<тема RU>"');
  process.exit(1);
}
const NN = String(num).padStart(2, '0');
const file = path.resolve(`src/components/grade3/Dars${NN}.jsx`);
if (fs.existsSync(file)) { console.log(`${file} уже есть — не перезаписываю`); process.exit(1); }

const screens = Array.from({ length: 15 }, (_, i) => `s${i}`);
const contentStub = screens.map((s) => `  ${s}: {
    eyebrow: { ru: '', uz: '' },
    // TODO ${s}: экранный текст, вопрос, варианты, разборы на каждый неверный,
    // audio (RU+UZ). Правила: 4 варианта 2x2, разбор указывает на признак,
    // в озвучке нет цифр и знаков.
    audio: { intro: { ru: '', uz: '' } }
  }`).join(',\n\n');

const src = `import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
// Из кита берётся всё общее. NumPad в ките нет намеренно: его версии в уроках разошлись,
// поэтому клавиатуру пока копируют из соседнего урока (см. Dars17.jsx).
import { BackLabel, BitSVG, Chiroq, CheckStrip, Confetti, D2Defs, D2Motes, FeedbackBlock, FoldRow, FrameFx, GradientDefs, HeroContext, LangContext, LUMO_CAST, NavBack, NavNext, NextLabel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, TaskTable, getAudioEngine, makeBrgSeg, npKey, shuffleArr, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, useRevealScroll, useSfx, useT, useTapSteps } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars${NN} — "${titleUz}" (num-3-${NN})
// Syujet: TODO (SYUJET_3SINF.md, blok va joy)
// SAHNA: TODO — 1-9-darsdan olinib qayta ishlanadi (metodist qoidasi 31)
// MEXANIKA: TODO — faqat tayyor mexanikalar (qoida: yangi mexanika YARATMA)
// DARSLIK ASOSI: TODO — bet va topshiriq raqamlari (qoida 32)
// YADRO: TODO
// Misconception: M1 … M2 … M3 …
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars ${num}»
//
// FREE_NAV kitdan keladi (hozircha true).
// ============================================================================

const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-3-${NN}',
  lessonTitle: { ru: 'Урок ${num}. ${titleRu}', uz: "${num}-dars. ${titleUz}" }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's12', type: 'case',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: 'final' }
];

const CONTENT = {
${contentStub}
};

const BRIDGES = {
${screens.slice(1).map((s) => `  ${s}: { ru: '', uz: '' }`).join(',\n')}
};
const brgSeg = makeBrgSeg(BRIDGES);

const S14_PAYOFF = { ru: '', uz: '' };

// --- СЦЕНА УРОКА: TODO. Берётся из уроков 1-9 и перерабатывается: фон региона тот же,
// рабочий узел свой (решение методиста 2026-08-06).

// --- ЭКРАНЫ: TODO. Образцы механик — в Dars17.jsx (одиночный MC, NumPad с проверкой,
// консоль по частям, задача с таблицей, финальная панель с факткардой).

const screensList = [];   // TODO: [Screen0, … Screen14]

export default function Dars${NN}Lesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  return null;   // TODO: корневой компонент — скопировать структуру из Dars17.jsx
}

const STYLES = BASE_STYLES + \`
/* --- CSS этого урока: только своё, базовое приходит из кита --- */
.d${NN}-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.d${NN}-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }
\`;
`;

// регистрация в реестре: место вставки ищем ДО записи урока, иначе при неудаче остаётся
// файл без записи в реестре. Перевод строки в реестре бывает CRLF — учитываем оба.
const regPath = path.resolve('src/lessons/grade3.js');
let reg = fs.readFileSync(regPath, 'utf8');
const anchorRe = /\r?\n\]\r?\n\r?\n\/\/ 3-sinf AMALIY/;
const anchorMatch = reg.match(anchorRe);
if (!anchorMatch && !reg.includes(slug)) {
  console.log('ОСТАНОВЛЕНО: в src/lessons/grade3.js не найден конец массива grade3Nazariy.');
  console.log('Проверьте, что после последнего урока идёт «]» и комментарий «// 3-sinf AMALIY».');
  process.exit(1);
}

fs.writeFileSync(file, src, 'utf8');
console.log(`создан ${path.relative(process.cwd(), file)} (${src.split('\n').length} строк каркаса)`);
const entry = `  {
    slug: '${slug}',
    title: "Dars ${num}. ${titleUz}",
    desc: "TODO: одно-два предложения о сути урока — что ребёнок научится делать.",
    Component: lazy(() => import('../components/grade3/Dars${NN}.jsx')),
  },
`;
if (reg.includes(slug)) console.log('в реестре уже есть — не трогаю');
else {
  const at = anchorMatch.index + (anchorMatch[0].startsWith('\r\n') ? 2 : 1);
  reg = reg.slice(0, at) + entry + reg.slice(at);
  fs.writeFileSync(regPath, reg, 'utf8');
  console.log('добавлено в src/lessons/grade3.js');
}
console.log(`\nдальше: контент в KONTENT_3SINF.md «Dars ${num}», сцена, экраны;
проверка: node scripts/grade3-lesson-audit.mjs src/components/grade3/Dars${NN}.jsx`);
