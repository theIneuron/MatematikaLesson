// 6 класс, урок 5 — «Наибольший общий делитель (НОД)» / "Eng katta umumiy bo'luvchi (EKUB)".
// lessonId: div_6_05.
//
// Урок собран под УТВЕРЖДЁННЫЙ макет из artifacts/grade6-dars05-design/:
// оболочка (бейдж 6, 15 сегментов прогресса, название раздела, счётчик, панель
// инструментов, футер с точками глав), тёмная полоса озвучки, указатели
// «Нажмите…», варианты с буквенными ключами, карточки-счета, плитки делителей,
// кирпичи множителей, корзины классификации, рельс из пяти вкладок.
// Ни одной строки из прежних уроков 6 класса не взято.
//
// Из общего модуля Dars01.jsx берётся ТОЛЬКО звук и язык: AudioEngine, useAudio,
// LangContext, lang. Этого требует ТЗ, а правило проекта запрещает копировать
// движок в файл урока. Визуальная оболочка Dars01 (Stage, NavNext, STYLES) НЕ
// используется — вся вёрстка своя, по макету.
//
// Ни фотографий, ни растровых картинок, ни тега img, ни фоновых изображений,
// ни base64 — только HTML/CSS и встроенный SVG.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  configureLesson,
  LangContext,
  useLang,
  useT,
  useMobileZoom,
  useAudio,
} from './Dars01.jsx';

const TOTAL_SCREENS = 15;
// Оцениваемых заданий в уроке и порог зачёта (методический профиль: агрегат ≥60%).
const TOTAL_TASKS = 36;
const PASS_PERCENT = 60;
const LESSON_META = {
  lessonId: 'div_6_05',
  lessonTitle: { ru: 'Наибольший общий делитель', uz: "Eng katta umumiy bo'luvchi" },
};

// ============================================================
// СТИЛИ УТВЕРЖДЁННОГО МАКЕТА
// Всё под .lesson-root.g6d05 — остальные уроки 6 класса не затрагиваются.
// Тема класса красит .lesson-root правилом с !important, поэтому фон здесь
// тоже задаётся с !important.
// ВНУТРИ ШАБЛОННОЙ СТРОКИ НЕ ДОЛЖНО БЫТЬ ОБРАТНЫХ КАВЫЧЕК: они рвут файл.
// ============================================================
const STYLES = `
.lesson-root.g6d05 {
  --bg: #F4EFE6;
  --paper: #FFFDFA;
  --ink: #182224;
  --muted: #667174;
  --line: rgba(24, 34, 36, 0.13);
  --teal: #126E73;
  --teal-soft: #DCEEED;
  --orange: #E75A2C;
  --orange-soft: #F9DFD2;
  --green: #287B54;
  --green-soft: #E0F0E6;
  --red: #A84B32;
  --shadow: 0 16px 36px rgba(35, 42, 40, 0.10);
  --sans: 'Manrope', system-ui, -apple-system, sans-serif;
  --serif: 'Source Serif 4', 'Fraunces', Georgia, serif;
  --mono: 'JetBrains Mono', ui-monospace, Consolas, monospace;
  --t-ui: 220ms;
  --t-math: 520ms;
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);

  position: fixed;
  inset: 0;
  overflow: hidden !important;
  overscroll-behavior: none;
  background: var(--bg) !important;
  color: var(--ink);
  font-family: var(--sans) !important;
  -webkit-font-smoothing: antialiased;
  zoom: var(--g1z, 1);
}
.lesson-root.g6d05 *, .lesson-root.g6d05 *::before, .lesson-root.g6d05 *::after { box-sizing: border-box; }
.lesson-root.g6d05 h1, .lesson-root.g6d05 h2, .lesson-root.g6d05 h3, .lesson-root.g6d05 p { margin: 0; }
.lesson-root.g6d05 button, .lesson-root.g6d05 input, .lesson-root.g6d05 textarea { font: inherit; }
@media (max-width: 639.98px) { .lesson-root.g6d05 { width: 390px; } }

/* Вертикальная шкала отступов. Всё, что задаёт расстояние по высоте, сжимается
   вместе с окном: у реального ноутбука странице достаётся около 600px, а не 768,
   и фиксированные margin съедали бы весь выигрыш от clamp у блоков. */
.lesson-root.g6d05 {
  --v1: clamp(4px, 0.9vh, 7px);
  --v2: clamp(6px, 1.3vh, 10px);
  --v3: clamp(8px, 1.8vh, 14px);
  --v4: clamp(10px, 2.3vh, 18px);
  --v5: clamp(12px, 3.2vh, 25px);
}
.g6d05 .choices { gap: var(--v2); }
.g6d05 .chip-row { margin-top: var(--v3); }
.g6d05 .lists { gap: var(--v3); }
.g6d05 .action-list { gap: var(--v2); margin-top: var(--v3); }
.g6d05 .bricks { margin-top: var(--v3); }
.g6d05 .practice-sequence { gap: var(--v2); }

.g6d05 .deck { width: 100%; height: 100dvh; max-height: 100dvh; display: flex; flex-direction: column; overflow: hidden; position: relative; }

/* ---------- верхняя панель ---------- */
.g6d05 .topbar {
  flex: 0 0 auto; min-height: clamp(56px, 11.2vh, 86px);
  padding: clamp(9px, 2.34vh, 18px) clamp(18px, 3.5vw, 48px) clamp(6px, 1.56vh, 12px);
  display: grid; grid-template-columns: 240px 1fr 250px; align-items: start; gap: 20px;
  border-bottom: 1px solid rgba(24, 34, 36, 0.07);
}
.g6d05 .brand { display: flex; align-items: center; gap: 12px; font-size: clamp(11px, min(0.878vw, 1.562vh), 12px); font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; }
.g6d05 .badge6 {
  width: clamp(28px, 4.7vh, 36px); height: clamp(28px, 4.7vh, 36px); border-radius: 10px; background: var(--ink); color: #FFFFFF;
  display: grid; place-items: center; font-family: var(--mono); font-size: clamp(13px, min(1.318vw, 2.344vh), 18px); font-weight: 800;
  box-shadow: inset 0 0 0 3px var(--orange); flex: 0 0 auto;
}
.g6d05 .progress-wrap { padding-top: 2px; }
.g6d05 .segments { display: grid; grid-template-columns: repeat(15, 1fr); gap: 5px; }
.g6d05 .seg { height: 6px; border-radius: 9px; background: rgba(24, 34, 36, 0.12); transition: background var(--t-ui) var(--ease); }
.g6d05 .seg.done { background: var(--teal); }
.g6d05 .seg.active { background: var(--orange); box-shadow: 0 0 0 4px rgba(231, 90, 44, 0.13); }
.g6d05 .bar-meta { display: flex; justify-content: space-between; margin-top: clamp(5px, 1.3vh, 10px); color: var(--muted); font-size: 10px; font-weight: 850; letter-spacing: 0.13em; text-transform: uppercase; }
.g6d05 .bar-meta .count { font-family: var(--mono); font-variant-numeric: tabular-nums; }
.g6d05 .tools { display: flex; justify-content: flex-end; gap: 9px; }
.g6d05 .tool {
  height: clamp(31px, 5.2vh, 40px); padding: 0 14px; border: 1px solid var(--line); border-radius: 12px;
  background: rgba(255, 255, 255, 0.78); font-size: clamp(11px, min(0.878vw, 1.562vh), 12px); font-weight: 800; color: var(--ink);
  cursor: pointer; display: inline-flex; align-items: center; gap: 7px;
  transition: border-color var(--t-ui) var(--ease), background var(--t-ui) var(--ease), transform var(--t-ui) var(--ease);
}
.g6d05 .tool:hover:not(:disabled) { border-color: var(--orange); background: #FFFFFF; }
.g6d05 .tool:active:not(:disabled) { transform: translateY(1px); }
.g6d05 .tool:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }
.g6d05 .tool:disabled { opacity: 0.45; cursor: not-allowed; }
.g6d05 .tool.on { border-color: var(--orange); background: var(--orange-soft); color: var(--red); }

.g6d05 .notes-pop {
  position: absolute; top: 78px; right: 48px; z-index: 30; width: 320px;
  background: var(--paper); border: 1px solid var(--line); border-radius: 16px;
  padding: 14px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 9px;
}
.g6d05 .notes-pop textarea {
  width: 100%; height: 122px; resize: none; border: 1px solid var(--line); border-radius: 11px;
  padding: 10px 12px; font-family: var(--sans); font-size: clamp(11px, min(1.025vw, 1.823vh), 14px); line-height: 1.45;
  background: #FFFFFF; color: var(--ink);
}
.g6d05 .notes-pop textarea:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.45); outline-offset: 1px; }

/* ---------- сцена ---------- */
.g6d05 .stage { flex: 1 1 auto; min-height: 0; padding: clamp(5px, 1.04vh, 8px) clamp(18px, 3.5vw, 48px) clamp(6px, 1.3vh, 10px); display: flex; flex-direction: column; overflow: hidden; background-color: transparent !important; max-width: none; max-height: none; }
.g6d05 .screen-head { flex: 0 0 auto; min-height: clamp(42px, 8.85vh, 68px); display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
.g6d05 .eyebrow { display: flex; align-items: center; gap: 9px; color: var(--orange); font-size: 11px; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase; }
.g6d05 .eyebrow::before { content: ''; width: 26px; height: 2px; background: currentColor; flex: 0 0 auto; }
.g6d05 .screen-head h1 { font-family: var(--serif); font-weight: 650; font-size: clamp(24px, min(2.78vw, 4.95vh), 38px); line-height: 1.03; letter-spacing: -0.025em; margin-top: clamp(3px, 0.8vh, 6px); text-wrap: balance; }
.g6d05 .phase {
  flex: 0 0 auto; align-self: center; padding: 8px 13px; border-radius: 99px;
  background: rgba(18, 110, 115, 0.1); color: var(--teal);
  font-size: 10px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap;
}
.g6d05 .phase i { font-style: normal; color: var(--orange); margin-right: 5px; }
.g6d05 .body { flex: 1 1 auto; min-height: 0; margin-top: clamp(5px, 1.04vh, 8px); overflow: hidden; }

.g6d05 .card { background: rgba(255, 253, 250, 0.93); border: 1px solid rgba(255, 255, 255, 0.9); border-radius: 20px; box-shadow: var(--shadow); }
.g6d05 .pad { padding: clamp(12px, 2.5vh, 19px) clamp(14px, 1.6vw, 22px); }
.g6d05 .label { font-size: 10px; font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); }
.g6d05 .formula { font-family: var(--mono); font-weight: 750; font-variant-numeric: tabular-nums; }
.g6d05 .formula.big { font-size: clamp(21px, min(2.2vw, 3.9vh), 30px); }
.g6d05 .formula.huge { font-size: clamp(28px, min(3.1vw, 5.5vh), 42px); }
.g6d05 .muted { color: var(--muted); }
.g6d05 .teal { color: var(--teal); }
.g6d05 .green { color: var(--green); }

/* ---------- полоса озвучки ---------- */
.g6d05 .audio-guide {
  flex: 0 0 auto; min-height: clamp(38px, 6.25vh, 48px); padding: clamp(6px, 1.04vh, 8px) 15px; border-radius: 15px;
  background: linear-gradient(135deg, #172224, #1F3031); color: #FFFFFF;
  display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 26px rgba(24, 34, 36, 0.14);
}
.g6d05 .audio-dot {
  width: clamp(26px, 4.4vh, 34px); height: clamp(26px, 4.4vh, 34px); border-radius: 50%; background: var(--orange); flex: 0 0 auto;
  display: grid; place-items: center; color: #FFFFFF; box-shadow: 0 0 0 6px rgba(231, 90, 44, 0.17);
}
.g6d05 .audio-copy { font-size: clamp(11px, min(0.952vw, 1.693vh), 13px); font-weight: 850; line-height: 1.3; }
.g6d05 .audio-copy small { display: block; margin-top: 3px; font-size: 10px; font-weight: 600; color: #CBD6D4; }
.g6d05 .audio-wave { margin-left: auto; height: 25px; display: flex; gap: 3px; align-items: center; flex: 0 0 auto; }
.g6d05 .audio-wave i { width: 3px; border-radius: 4px; background: #75CBC7; animation: g5wave 0.8s ease-in-out infinite alternate; }
.g6d05 .audio-wave i:nth-child(1) { height: 7px; }
.g6d05 .audio-wave i:nth-child(2) { height: 16px; animation-delay: 0.12s; }
.g6d05 .audio-wave i:nth-child(3) { height: 23px; animation-delay: 0.24s; }
.g6d05 .audio-wave i:nth-child(4) { height: 13px; animation-delay: 0.36s; }
.g6d05 .audio-wave i:nth-child(5) { height: 20px; animation-delay: 0.48s; }
.g6d05 .audio-wave.off i { animation: none; opacity: 0.3; }

/* ---------- указатель действия и кнопки ---------- */
.g6d05 .tap {
  display: inline-flex; align-items: center; gap: 8px; min-height: clamp(30px, 4.95vh, 38px); padding: 0 13px;
  border: 1px solid rgba(231, 90, 44, 0.3); border-radius: 11px; background: #FFF5EE;
  color: #AA4728; font-size: clamp(11px, min(0.878vw, 1.562vh), 12px); font-weight: 900; box-shadow: 0 8px 18px rgba(231, 90, 44, 0.08);
  align-self: flex-start;
}
.g6d05 .tap b { font-size: clamp(11px, min(1.098vw, 1.953vh), 15px); font-weight: 400; animation: g5tap 1.1s ease-in-out infinite; }
.g6d05 .tap.done { border-color: rgba(40, 123, 84, 0.35); background: var(--green-soft); color: var(--green); box-shadow: none; }
.g6d05 .tap.done b { animation: none; }
.g6d05 .primary {
  height: clamp(36px, 6.1vh, 47px); padding: 0 clamp(13px, 1.4vw, 19px); border: 0; border-radius: 12px; background: var(--ink); color: #FFFFFF;
  font-weight: 900; cursor: pointer; box-shadow: 0 10px 22px rgba(24, 34, 36, 0.18);
  transition: background var(--t-ui) var(--ease), transform var(--t-ui) var(--ease);
}
.g6d05 .primary.orange { background: var(--orange); }
.g6d05 .primary:hover:not(:disabled) { background: #33474A; }
.g6d05 .primary.orange:hover:not(:disabled) { background: #CE4A21; }
.g6d05 .primary:active:not(:disabled) { transform: translateY(1px); }
.g6d05 .primary:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }
.g6d05 .primary:disabled { background: #DCD5C9; color: #8D9694; box-shadow: none; cursor: not-allowed; }

/* ---------- варианты ответа ---------- */
.g6d05 .choices { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.g6d05 .c2 { grid-template-columns: 1fr 1fr; }
.g6d05 .c5 { grid-template-columns: repeat(5, 1fr); }
.g6d05 .choice {
  min-height: clamp(42px, 7.16vh, 55px); padding: clamp(8px, 1.4vh, 11px) 14px; border: 1px solid var(--line); border-radius: 13px;
  background: #FFFFFF; display: flex; align-items: center; gap: 11px; cursor: pointer;
  font-weight: 800; font-size: clamp(12px, min(1.245vw, 2.214vh), 17px); text-align: left; color: var(--ink);
  transition: border-color var(--t-ui) var(--ease), background var(--t-ui) var(--ease), box-shadow var(--t-ui) var(--ease), transform var(--t-ui) var(--ease);
}
.g6d05 .choice:hover:not(:disabled) { border-color: var(--teal); box-shadow: 0 0 0 4px rgba(18, 110, 115, 0.08); }
.g6d05 .choice:active:not(:disabled) { transform: translateY(1px); }
.g6d05 .choice:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }
.g6d05 .choice:disabled { cursor: default; }
.g6d05 .choice.selected { background: var(--teal-soft); border-color: rgba(18, 110, 115, 0.45); }
.g6d05 .choice.correct { background: var(--green-soft); border-color: var(--green); }
.g6d05 .choice.wrong { background: var(--orange-soft); border-color: var(--orange); }
.g6d05 .choice.dim { opacity: 0.45; }
.g6d05 .key {
  width: 30px; height: 30px; border-radius: 9px; background: #ECE9E2; color: #6A7272;
  display: grid; place-items: center; font-family: var(--mono); font-size: 11px; font-weight: 800; flex: none;
}
.g6d05 .choice.correct .key { background: #FFFFFF; color: var(--green); }
.g6d05 .choice.wrong .key { background: #FFFFFF; color: var(--red); }

/* ---------- обратная связь и раскрытие ---------- */
.g6d05 .feedback {
  min-height: clamp(40px, 6.8vh, 52px); padding: clamp(9px, 1.56vh, 12px) 15px; border-left: 4px solid var(--teal); border-radius: 12px;
  background: var(--teal-soft); font-size: clamp(11px, min(0.952vw, 1.693vh), 13px); line-height: 1.35;
  opacity: 0.2; filter: blur(2px); transition: opacity 0.45s var(--ease), filter 0.45s var(--ease);
}
.g6d05 .feedback.show { opacity: 1; filter: none; }
.g6d05 .feedback.right { border-color: var(--green); background: var(--green-soft); color: #245F43; }
.g6d05 .feedback.wrong { border-color: var(--orange); background: var(--orange-soft); color: #8C4029; }
.g6d05 .feedback .formula { font-size: clamp(11px, min(1.025vw, 1.823vh), 14px); }
.g6d05 .reveal { opacity: 0.08; filter: blur(3px); transform: translateY(9px); transition: opacity 0.65s var(--ease), filter 0.65s var(--ease), transform 0.65s var(--ease); pointer-events: none; }
.g6d05 .reveal.show { opacity: 1; filter: none; transform: none; pointer-events: auto; }
.g6d05 .reveal.flat { transform: none; }
/* На низком окне (реальный ноутбук отдаёт странице около 600px) скрытый блок
   решения перестаёт резервировать высоту: иначе вопрос и заранее забронированный
   разбор вместе не помещаются. Оба лежат НИЖЕ зоны нажатия, поэтому кнопки при
   раскрытии не двигаются. Исключение — модификатор flat: это полновысотные
   карточки в соседней колонке, их скрытие сложило бы сетку. */
@media (max-height: 700px) {
  .g6d05 .reveal:not(.show):not(.flat) { display: none; }
  /* Блоки разбора на низком окне идут плотнее: смысл тот же, высоты на 16px меньше. */
  .g6d05 .method-note { padding: 8px 10px; }
  .g6d05 .method-note b { font-size: 13px; margin-bottom: 2px; }
  .g6d05 .method-note p { font-size: 11.5px; line-height: 1.3; }
  .g6d05 .method-note p.formula { font-size: 15px; }
  .g6d05 .division { min-height: 38px; }
  /* Экран 5: правая колонка переполняется, а левая занята наполовину. Две
     заметки разбора встают рядом, итоговая запись растягивается под ними. */
  .g6d05 .s5-solution { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: start; }
  .g6d05 .s5-solution .method-note { margin-top: 0 !important; }
  .g6d05 .s5-solution .rule-eq { grid-column: 1 / -1; margin-top: 0; }
  /* Подсказка открывается поверх и без того плотного экрана — на низком окне
     она идёт в одну плотную строку, а крупная формула задания теряет воздух. */
  .g6d05 .yordam { padding: 5px 10px; margin-top: 5px; gap: 8px; }
  .g6d05 .yordam p { font-size: 11.5px; line-height: 1.3; }
  .g6d05 .yordam .yb { padding: 2px 7px; font-size: 8.5px; }
  .g6d05 .mix-work > .formula { margin-top: 6px !important; margin-bottom: 6px !important; }
  .g6d05 .mix-work .label { font-size: 9px; }
  .g6d05 .seq-progress { gap: 6px; }
  .g6d05 .mix-side .stepbar { gap: 5px; }
  /* Экран 7: в шлюзе три способа, разбор ошибки и подсказка в одной колонке. */
  .g6d05 .rule-gate .tap { margin-top: 8px !important; margin-bottom: 6px !important; }
  .g6d05 .rule-gate .action { min-height: 30px; padding-top: 4px; padding-bottom: 4px; }
  .g6d05 .rule-gate .action-list { gap: 6px; margin-top: 0; }
}
.g6d05 .stagger { opacity: 0; transform: translateY(8px); }
.g6d05 .reveal.show .stagger { animation: g5stagger 0.55s var(--ease) forwards; }
.g6d05 .reveal.show .stagger:nth-child(2) { animation-delay: 0.42s; }
.g6d05 .reveal.show .stagger:nth-child(3) { animation-delay: 0.84s; }
.g6d05 .reveal.show .stagger:nth-child(4) { animation-delay: 1.26s; }

/* ---------- рельс шагов ---------- */
.g6d05 .stepbar { display: flex; gap: 8px; }
.g6d05 .stepbar.col { flex-direction: column; }
.g6d05 .step {
  min-height: clamp(28px, 4.55vh, 35px); padding: clamp(5px, 0.9vh, 7px) 12px; border-radius: 10px; background: #E6E4DE; color: #7A8282;
  display: flex; align-items: center; font-size: 10px; font-weight: 900; letter-spacing: 0.08em;
  text-transform: uppercase; transition: all var(--t-ui) var(--ease);
}
.g6d05 .step.active { background: var(--orange); color: #FFFFFF; }
.g6d05 .step.done { background: var(--green-soft); color: var(--green); }

/* ---------- экран 1: счета и люди ---------- */
.g6d05 .hook { display: grid; grid-template-columns: 0.82fr 1.18fr; grid-template-rows: minmax(0, 1fr); gap: 18px; height: 100%; }
.g6d05 .hook-left, .g6d05 .hook-right { padding: clamp(12px, 2.34vh, 18px) clamp(14px, 1.5vw, 21px); display: flex; flex-direction: column; }
.g6d05 .bill-row { display: grid; grid-template-columns: 1fr 44px 1fr; align-items: center; gap: 14px; }
.g6d05 .bill {
  height: clamp(82px, 15.4vh, 118px); border: 2px solid var(--teal); border-radius: 16px;
  background: linear-gradient(135deg, #E9F4EF, #FFFFFF); display: grid; place-items: center;
  position: relative; overflow: hidden; text-align: center;
}
.g6d05 .bill::before, .g6d05 .bill::after { content: ''; position: absolute; width: 38px; height: 38px; border: 1px solid rgba(18, 110, 115, 0.16); border-radius: 50%; }
.g6d05 .bill::before { left: -15px; }
.g6d05 .bill::after { right: -15px; }
.g6d05 .bill b { display: block; font-family: var(--mono); font-size: clamp(26px, min(2.8vw, 4.95vh), 38px); font-weight: 850; color: var(--teal); line-height: 1.1; }
.g6d05 .bill span { font-size: 11px; font-weight: 850; color: var(--muted); }
.g6d05 .people { display: flex; justify-content: center; gap: 7px; margin-top: clamp(9px, 1.95vh, 15px); min-height: clamp(34px, 5.7vh, 44px); flex-wrap: wrap; }
.g6d05 .person { width: clamp(24px, 4vh, 31px); height: clamp(29px, 4.95vh, 38px); position: relative; animation: g5person 0.5s cubic-bezier(0.2, 0.8, 0.3, 1) both; }
.g6d05 .person::before { content: ''; position: absolute; left: 9px; width: 13px; height: 13px; border-radius: 50%; background: var(--orange); }
.g6d05 .person::after { content: ''; position: absolute; left: 4px; bottom: 0; width: 23px; height: 22px; border-radius: 12px 12px 5px 5px; background: var(--teal); }

/* ---------- списки делителей ---------- */
.g6d05 .lists { display: grid; grid-template-columns: 1fr 110px 1fr; gap: 14px; align-items: center; }
.g6d05 .lists.narrow { grid-template-columns: 1fr 40px 1fr; }
.g6d05 .number-box { padding: clamp(11px, 2.08vh, 16px); border-radius: 17px; background: #FFFFFF; border: 1px solid var(--line); }
.g6d05 .number-title { font-family: var(--mono); font-size: clamp(20px, min(2vw, 3.5vh), 27px); font-weight: 850; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.g6d05 .number-title small { font-family: var(--sans); font-size: clamp(11px, min(0.952vw, 1.693vh), 13px); font-weight: 700; color: var(--muted); }
.g6d05 .chip-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 13px; }
.g6d05 .chip {
  height: clamp(30px, 4.95vh, 38px); min-width: 42px; padding: 0 12px; border: 1px solid var(--line); border-radius: 11px;
  background: #F7F5EF; display: grid; place-items: center; font-family: var(--mono); font-size: clamp(12px, min(1.171vw, 2.083vh), 16px); font-weight: 750;
  transition: all var(--t-math) var(--ease);
}
.g6d05 .chip.common { background: var(--teal-soft); border-color: var(--teal); color: var(--teal); }
.g6d05 .chip.max { background: var(--orange); border-color: var(--orange); color: #FFFFFF; transform: translateY(-4px); box-shadow: 0 8px 16px rgba(231, 90, 44, 0.22); }
.g6d05 .chip.ghost { opacity: 0.32; }
.g6d05 .venn-link { text-align: center; color: var(--orange); font-size: clamp(19px, min(1.977vw, 3.516vh), 27px);  pointer-events: none; }

/* ---------- две колонки с боковым рельсом ---------- */
.g6d05 .explore-layout { display: grid; grid-template-columns: 1fr 300px; grid-template-rows: minmax(0, 1fr); gap: 16px; height: 100%; }
.g6d05 .explore-main, .g6d05 .explore-side { padding: clamp(11px, 2.2vh, 17px) clamp(13px, 1.5vw, 20px); display: flex; flex-direction: column; }
.g6d05 .action-list { display: flex; flex-direction: column; gap: 9px; margin-top: 12px; }
.g6d05 .action {
  min-height: clamp(34px, 5.6vh, 43px); padding: clamp(6px, 1vh, 8px) 13px; border: 1px solid var(--line); border-radius: 11px; background: #FFFFFF;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  font-size: clamp(11px, min(0.878vw, 1.562vh), 12px); font-weight: 850; cursor: pointer; text-align: left; color: var(--ink);
  transition: all var(--t-ui) var(--ease);
}
.g6d05 .action:hover:not(:disabled) { border-color: var(--orange); }
.g6d05 .action:active:not(:disabled) { transform: translateY(1px); }
.g6d05 .action:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }
.g6d05 .action:disabled { opacity: 0.45; cursor: not-allowed; }
.g6d05 .action.active { background: var(--ink); color: #FFFFFF; border-color: var(--ink); opacity: 1; }
.g6d05 .action.done { background: var(--green-soft); color: var(--green); border-color: rgba(40, 123, 84, 0.35); opacity: 1; }
.g6d05 .action.wrong { background: var(--orange-soft); color: var(--red); border-color: var(--orange); opacity: 1; }

/* ---------- правила ---------- */
.g6d05 .rule-grid { display: grid; grid-template-columns: 330px 1fr; grid-template-rows: minmax(0, 1fr); gap: 17px; height: 100%; }
.g6d05 .rule-gate, .g6d05 .rule-board { padding: clamp(12px, 2.34vh, 18px); display: flex; flex-direction: column; }
.g6d05 .rule-eq { margin-top: clamp(6px, 1.2vh, 9px); padding: clamp(7px, 1.3vh, 10px) 12px; border-radius: 11px; background: var(--green-soft); color: var(--green); font-family: var(--mono); font-size: clamp(16px, min(1.55vw, 2.75vh), 21px); font-weight: 800; }
.g6d05 .apply-rule {
  padding: clamp(8px, 1.43vh, 11px) 14px; border: 1px solid var(--line); border-radius: 13px; background: #FFFFFF;
  cursor: pointer; margin-bottom: 8px; text-align: left; width: 100%; color: var(--ink);
  transition: all var(--t-ui) var(--ease);
}
.g6d05 .apply-rule:hover:not(:disabled) { border-color: var(--orange); }
.g6d05 .apply-rule:active:not(:disabled) { transform: translateY(1px); }
.g6d05 .apply-rule:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }
.g6d05 .apply-rule:disabled { cursor: not-allowed; opacity: 0.45; }
.g6d05 .apply-rule.open { border-color: var(--orange); background: #FFF5EE; opacity: 1; cursor: default; }
.g6d05 .apply-rule b { display: flex; justify-content: space-between; gap: 10px; font-size: clamp(11px, min(1.025vw, 1.823vh), 14px); }
.g6d05 .apply-detail { display: block; margin-top: 9px; font-size: clamp(11px, min(0.878vw, 1.562vh), 12px); line-height: 1.38; color: #586264; font-weight: 500; }
.g6d05 .apply-detail .formula { color: var(--teal); font-size: clamp(11px, min(0.952vw, 1.693vh), 13px); }

/* ---------- множители ---------- */
.g6d05 .factor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
.g6d05 .factor-line { padding: clamp(12px, 2.34vh, 18px); border-radius: 16px; background: #FFFFFF; border: 1px solid var(--line); }
.g6d05 .bricks { display: flex; gap: 9px; margin-top: 15px; }
.g6d05 .brick {
  height: clamp(38px, 6.4vh, 49px); min-width: 55px; border: 2px solid transparent; border-radius: 11px; background: #E8E7E0;
  display: grid; place-items: center; font-family: var(--mono); font-size: clamp(14px, min(1.464vw, 2.604vh), 20px); font-weight: 850;
  transition: all var(--t-math) var(--ease);
}
.g6d05 .brick.common { background: var(--teal-soft); border-color: var(--teal); color: var(--teal); }
.g6d05 .brick.picked { background: var(--orange); border-color: var(--orange); color: #FFFFFF; transform: translateY(-5px); }

/* ---------- два способа ---------- */
.g6d05 .method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.g6d05 .method { padding: clamp(10px, 1.95vh, 15px); border: 2px solid transparent; border-radius: 17px; background: #FFFFFF; cursor: pointer; text-align: left; color: var(--ink); transition: all var(--t-ui) var(--ease); }
.g6d05 .method:hover:not(:disabled) { border-color: rgba(18, 110, 115, 0.4); }
.g6d05 .method:active:not(:disabled) { transform: translateY(1px); }
.g6d05 .method:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }
.g6d05 .method.active { border-color: var(--teal); background: #F3FBF9; }
.g6d05 .method h3 { font-family: var(--serif); font-size: clamp(17px, min(1.7vw, 3vh), 23px); font-weight: 700; margin: clamp(3px, 0.65vh, 5px) 0; }
.g6d05 .method p { font-size: clamp(11px, min(0.952vw, 1.693vh), 13px); line-height: 1.4; color: #5C6667; }
.g6d05 .method .formula { display: block; margin-top: 6px; font-size: clamp(13px, min(1.318vw, 2.344vh), 18px); color: var(--teal); }

/* ---------- ввод числа ---------- */
.g6d05 .input {
  height: clamp(42px, 7.16vh, 55px); width: 155px; border: 2px solid rgba(24, 34, 36, 0.2); border-radius: 13px;
  background: #FFFFFF; color: var(--ink); padding: 0 15px; text-align: center; font-family: var(--mono); font-size: clamp(17px, min(1.684vw, 2.995vh), 23px); font-weight: 800;
}
.g6d05 .input::placeholder { color: #B9B3A8; font-weight: 600; font-size: clamp(11px, min(1.098vw, 1.953vh), 15px); }
.g6d05 .input:focus { border-color: var(--orange); box-shadow: 0 0 0 4px rgba(231, 90, 44, 0.11); outline: 0; }
.g6d05 .input:disabled { border-color: var(--green); background: var(--green-soft); color: var(--green); }

/* ---------- факт ---------- */
.g6d05 .fact { padding: clamp(9px, 1.7vh, 13px) 15px; border-radius: 14px; background: var(--ink); color: #FFFFFF; display: grid; grid-template-columns: 105px 1fr; gap: 14px; align-items: center; }
.g6d05 .fact.solo { grid-template-columns: 1fr; }
.g6d05 .fact-badge { height: 38px; border-radius: 10px; background: var(--orange); display: grid; place-items: center; text-align: center; font-size: 10px; font-weight: 900; letter-spacing: 0.09em; text-transform: uppercase; padding: 0 6px; }
.g6d05 .fact p { font-size: clamp(11px, min(0.878vw, 1.562vh), 12px); line-height: 1.4; }
.g6d05 .fact .formula { font-size: clamp(12px, min(1.245vw, 2.214vh), 17px); color: #BCE4DF; }

/* ---------- деления и заметка ---------- */
.g6d05 .division-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.g6d05 .division { min-height: clamp(42px, 7vh, 54px); padding: clamp(6px, 1.2vh, 9px) 14px; border-radius: 12px; background: #FFFFFF; border: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; gap: 10px; font-family: var(--mono); font-size: clamp(12px, min(1.245vw, 2.214vh), 17px); font-weight: 750; }
.g6d05 .division span { font-family: var(--sans); font-size: clamp(11px, min(0.878vw, 1.562vh), 12px); font-weight: 800; }
.g6d05 .division.yes { background: var(--green-soft); color: var(--green); }
.g6d05 .division.no { background: var(--orange-soft); color: #9B4327; }
.g6d05 .yordam {
  margin-top: clamp(5px, 1vh, 8px); padding: clamp(6px, 1.04vh, 8px) 12px; border-radius: 12px;
  background: #FFF8E8; border: 1px solid rgba(180, 138, 30, 0.34); border-left: 4px solid #B48A1E;
  display: flex; gap: 11px; align-items: flex-start;
  animation: g5stagger 0.45s var(--ease) both;
}
.g6d05 .yordam .yb {
  flex: 0 0 auto; font-size: 9px; font-weight: 900; letter-spacing: 0.09em; text-transform: uppercase;
  color: #7A5C0F; background: #F4E3B4; border-radius: 7px; padding: 3px 8px; margin-top: 1px;
}
.g6d05 .yordam p { font-size: clamp(11px, min(0.915vw, 1.628vh), 12.5px); line-height: 1.35; color: #6B551C; }
/* Пока открыта подсказка, скрытый блок решения не резервирует высоту: он
   всё равно появится только после верного ответа, а подсказка к тому моменту
   исчезнет. Оба лежат НИЖЕ зоны нажатия, поэтому кнопки не двигаются. */
.g6d05 .yordam + .reveal:not(.show) { display: none; }

.g6d05 .method-note { padding: clamp(9px, 1.7vh, 13px); border-radius: 12px; background: #FFFFFF; border: 1px solid var(--line); }
.g6d05 .method-note b { display: block; font-size: clamp(11px, min(1.025vw, 1.823vh), 14px); margin-bottom: 4px; }
.g6d05 .method-note p { font-size: clamp(11px, min(0.878vw, 1.562vh), 12px); line-height: 1.35; color: #5C6667; }
.g6d05 .method-note p.formula { font-size: clamp(12px, min(1.245vw, 2.214vh), 17px); color: var(--teal); }

/* ---------- подстановка ---------- */
.g6d05 .substitute-row { min-height: clamp(48px, 8.6vh, 66px); padding: clamp(7px, 1.3vh, 10px) 14px; border-bottom: 1px solid var(--line); display: grid; grid-template-columns: 170px 1fr 110px; align-items: center; gap: 14px; }
.g6d05 .substitute-row:last-child { border-bottom: 0; }
.g6d05 .substitute-value { min-height: 38px; border-radius: 10px; background: #ECE9E2; display: grid; place-items: center; font-family: var(--mono); font-size: clamp(12px, min(1.245vw, 2.214vh), 17px); font-weight: 800; color: #747D7D; padding: 4px 8px; text-align: center; }
.g6d05 .substitute-row.show .substitute-value { background: var(--green-soft); color: var(--green); animation: g5stagger 0.55s var(--ease) both; }

/* ---------- классификация ---------- */
.g6d05 .classify { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.g6d05 .bin { min-height: clamp(78px, 15.4vh, 118px); padding: clamp(10px, 1.95vh, 15px); border: 2px dashed rgba(18, 110, 115, 0.4); border-radius: 17px; background: rgba(255, 255, 255, 0.6); }
.g6d05 .bin h3 { text-align: center; margin-bottom: clamp(7px, 1.43vh, 11px); font-family: var(--serif); font-size: clamp(17px, min(1.7vw, 3vh), 23px); font-weight: 700; }
.g6d05 .class-cards { display: grid; grid-template-columns: repeat(6, 1fr); gap: 9px; }
.g6d05 .class-card { min-height: clamp(46px, 7.55vh, 58px); padding: clamp(6px, 1.2vh, 9px); border-radius: 12px; background: #FFFFFF; border: 1px solid var(--line); font-family: var(--mono); font-size: clamp(11px, min(1.025vw, 1.823vh), 14px); font-weight: 800; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.g6d05 .class-card.done { background: var(--green-soft); color: var(--green); border-color: rgba(40, 123, 84, 0.35); }
.g6d05 .class-card .picks { display: flex; gap: 4px; flex: 0 0 auto; }
.g6d05 .class-card button {
  width: 27px; height: 28px; padding: 0; border: 1px solid var(--line); border-radius: 8px; background: #EBE8E1;
  cursor: pointer; font-family: var(--mono); font-size: 11px; font-weight: 800; color: var(--ink);
  transition: all var(--t-ui) var(--ease);
}
.g6d05 .class-card button:hover:not(:disabled) { border-color: var(--orange); }
.g6d05 .class-card button:active:not(:disabled) { transform: translateY(1px); }
.g6d05 .class-card button:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 1px; }
.g6d05 .class-card button:disabled { cursor: default; opacity: 0.5; }
.g6d05 .class-card button.hit { background: var(--green); border-color: var(--green); color: #FFFFFF; opacity: 1; }
.g6d05 .class-card button.miss { background: var(--orange-soft); border-color: var(--orange); color: var(--red); }

/* ---------- серии из пяти заданий ---------- */
.g6d05 .practice-sequence { display: flex; flex-direction: column; gap: 9px; height: 100%; }
.g6d05 .seq-progress { flex: 0 0 auto; display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.g6d05 .seq-tab { height: clamp(32px, 5.2vh, 40px); padding: clamp(4px, 0.8vh, 6px) 10px; border-radius: 11px; border: 1px solid var(--line); background: #FFFFFF; color: var(--muted); display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 10px; font-weight: 800; }
.g6d05 .seq-tab b { font-family: var(--mono); font-size: clamp(11px, min(1.025vw, 1.823vh), 14px); font-weight: 800; color: var(--ink); }
.g6d05 .seq-tab.active { background: var(--ink); color: #FFFFFF; border-color: var(--ink); }
.g6d05 .seq-tab.active b { color: #FFFFFF; }
.g6d05 .seq-tab.done { background: var(--green-soft); color: var(--green); border-color: rgba(40, 123, 84, 0.35); }
.g6d05 .seq-tab.done b { color: var(--green); }
.g6d05 .seq-tab.locked { opacity: 0.45; }
.g6d05 .mix { flex: 1 1 auto; min-height: 0; padding: clamp(10px, 1.95vh, 15px) clamp(12px, 1.3vw, 18px); display: grid; grid-template-columns: 1fr 310px; grid-template-rows: minmax(0, 1fr); gap: 17px; }
.g6d05 .mix-work, .g6d05 .mix-side { padding: clamp(10px, 1.95vh, 15px); border-radius: 16px; border: 1px solid var(--line); background: rgba(255, 255, 255, 0.7); display: flex; flex-direction: column; }

/* ---------- итог ---------- */
.g6d05 .summary { height: 100%; display: grid; grid-template-columns: 1.25fr 0.75fr; grid-template-rows: minmax(0, 1fr); gap: 16px; }
.g6d05 .summary-left, .g6d05 .summary-right { padding: clamp(12px, 2.34vh, 18px) clamp(13px, 1.5vw, 20px); display: flex; flex-direction: column; }
.g6d05 .skills { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
.g6d05 .skill { min-height: clamp(66px, 12.4vh, 95px); padding: clamp(9px, 1.8vh, 14px); border-radius: 14px; background: #FFFFFF; border: 1px solid var(--line); animation: g5stagger 0.5s var(--ease) both; }
.g6d05 .skill i { display: inline-grid; width: 29px; height: 29px; border-radius: 9px; background: var(--teal-soft); place-items: center; color: var(--teal); font-weight: 900; font-style: normal; font-family: var(--mono); font-size: clamp(11px, min(0.952vw, 1.693vh), 13px); }
.g6d05 .skill b { display: block; margin-top: 9px; font-size: clamp(11px, min(1.025vw, 1.823vh), 14px); }
.g6d05 .skill .formula { display: block; font-size: clamp(12px, min(1.171vw, 2.083vh), 16px); color: var(--teal); margin-top: 5px; }
.g6d05 .ready-ring { width: clamp(84px, 15.9vh, 122px); height: clamp(84px, 15.9vh, 122px); margin: clamp(5px, 1.3vh, 10px) auto; border-radius: 50%; background: conic-gradient(var(--green) 0 100%, #DDD 0); display: grid; place-items: center; flex: 0 0 auto; }
.g6d05 .ready-ring i { width: clamp(63px, 12vh, 92px); height: clamp(63px, 12vh, 92px); border-radius: 50%; background: var(--paper); display: grid; place-items: center; font-family: var(--mono); font-size: clamp(17px, min(1.757vw, 3.125vh), 24px); font-weight: 850; color: var(--green); font-style: normal; font-variant-numeric: tabular-nums; }
.g6d05 .verdict { margin-top: 5px; font-size: clamp(11px, min(1.025vw, 1.823vh), 14px); font-weight: 800; color: var(--green); }
.g6d05 .verdict.low { color: var(--red); }

/* ---------- футер ---------- */
.g6d05 .footer {
  flex: 0 0 auto; min-height: clamp(54px, 10.4vh, 80px); height: clamp(54px, 10.4vh, 80px);
  padding: 0 clamp(18px, 3.5vw, 48px); border-top: 1px solid var(--line);
  display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; background: rgba(244, 239, 230, 0.94);
}
.g6d05 .back { justify-self: start; border: 0; background: none; color: #5C6667; font-size: clamp(11px, min(0.952vw, 1.693vh), 13px); font-weight: 850; cursor: pointer; padding: 10px 6px; border-radius: 10px; }
.g6d05 .back:hover:not(:disabled) { color: var(--ink); }
.g6d05 .back:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }
.g6d05 .back:disabled { opacity: 0.35; cursor: not-allowed; }
.g6d05 .dots { justify-self: center; display: flex; gap: 7px; }
.g6d05 .dot { width: 6px; height: 6px; border-radius: 50%; background: #ADB2AD; transition: all var(--t-ui) var(--ease); }
.g6d05 .dot.active { width: 28px; background: var(--orange); }
.g6d05 .next {
  justify-self: end; height: clamp(36px, 6.1vh, 47px); padding: 0 clamp(14px, 1.6vw, 22px); border: 0; border-radius: 13px; background: var(--ink);
  color: #FFFFFF; font-weight: 900; cursor: pointer; box-shadow: 0 10px 20px rgba(24, 34, 36, 0.18);
  transition: background var(--t-ui) var(--ease), transform var(--t-ui) var(--ease);
}
.g6d05 .next:hover:not(:disabled) { background: #33474A; }
.g6d05 .next:active:not(:disabled) { transform: translateY(1px); }
.g6d05 .next:focus-visible { outline: 3px solid rgba(231, 90, 44, 0.7); outline-offset: 2px; }
.g6d05 .next:disabled { background: #DCD5C9; color: #8D9694; box-shadow: none; cursor: not-allowed; }

@keyframes g5wave { from { transform: scaleY(0.55); } to { transform: scaleY(1); } }
@keyframes g5tap { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
@keyframes g5person { from { opacity: 0; transform: translateY(15px) scale(0.8); } to { opacity: 1; transform: none; } }
@keyframes g5stagger { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

/* ============================================================
   УЗКАЯ РАСКЛАДКА (< 900px): телефон и узкое окно на десктопе
   По контракту src/books/MOBIL_DESKTOP_MOSLASH.md: урок раскладывается в
   эталонной ширине 390px и масштабируется zoom, оболочка не скроллится,
   а контентная область получает СВОЙ вертикальный скролл с overscroll-behavior:
   contain. Десктоп 1366x768 не затрагивается и остаётся без прокрутки.
   Раньше сюда просто сжималась десктопная сетка: правая колонка уходила за
   экран, а overflow: hidden это прятал.
   ============================================================ */
/* Порог 900, а не 640: две колонки карточек ниже этой ширины уже не
   помещаются, и урок начинал обрезаться. Масштаб 390px остаётся отдельным
   правилом и включается только на телефоне. */
@media (max-width: 899.98px) {
  .g6d05 .topbar {
    height: auto; padding: 10px 14px 8px;
    grid-template-columns: 1fr auto; grid-template-areas: 'brand tools' 'prog prog'; gap: 8px;
  }
  .g6d05 .brand { grid-area: brand; font-size: 10px; gap: 8px; }
  .g6d05 .badge6 { width: 28px; height: 28px; font-size: 14px; border-radius: 8px; }
  .g6d05 .tools { grid-area: tools; gap: 6px; }
  .g6d05 .tool { height: 32px; padding: 0 10px; font-size: 11px; }
  .g6d05 .progress-wrap { grid-area: prog; padding-top: 0; }
  .g6d05 .segments { gap: 3px; }
  .g6d05 .seg { height: 4px; }
  .g6d05 .bar-meta { margin-top: 6px; font-size: 9px; }
  .g6d05 .notes-pop { top: 96px; right: 14px; left: 14px; width: auto; }

  .g6d05 .stage { padding: 8px 14px 8px; }
  .g6d05 .screen-head { min-height: 0; flex-direction: column; align-items: flex-start; gap: 8px; }
  .g6d05 .screen-head h1 { font-size: 25px; margin-top: 4px; }
  .g6d05 .phase { align-self: flex-start; font-size: 9px; padding: 6px 10px; white-space: normal; }

  /* Единственное место, где разрешена прокрутка: содержимое экрана. */
  .g6d05 .body { overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; margin-top: 8px; }

  /* Все двухколоночные сетки становятся одной колонкой с высотой по контенту. */
  .g6d05 .hook, .g6d05 .explore-layout, .g6d05 .rule-grid, .g6d05 .summary, .g6d05 .mix {
    grid-template-columns: minmax(0, 1fr); grid-template-rows: none; height: auto; gap: 12px;
  }
  .g6d05 .lists, .g6d05 .lists.narrow, .g6d05 .factor-grid, .g6d05 .method-grid,
  .g6d05 .division-grid, .g6d05 .classify, .g6d05 .skills, .g6d05 .two {
    grid-template-columns: minmax(0, 1fr); gap: 10px;
  }
  .g6d05 .venn-link { transform: rotate(90deg); }
  .g6d05 .class-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .g6d05 .choices, .g6d05 .c5 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .g6d05 .seq-tab { height: 36px; padding: 5px 6px; font-size: 8px; }
  .g6d05 .seq-tab b { font-size: 11px; }

  .g6d05 .card { border-radius: 16px; }
  .g6d05 .pad, .g6d05 .hook-left, .g6d05 .hook-right, .g6d05 .explore-main,
  .g6d05 .explore-side, .g6d05 .rule-gate, .g6d05 .rule-board,
  .g6d05 .summary-left, .g6d05 .summary-right { padding: 14px; }
  .g6d05 .mix { padding: 14px; }
  .g6d05 .mix-work, .g6d05 .mix-side { padding: 13px; }

  .g6d05 .formula.huge { font-size: 30px; }
  .g6d05 .formula.big { font-size: 23px; }
  .g6d05 .bill { height: 92px; }
  .g6d05 .bill b { font-size: 28px; }
  .g6d05 .brick { height: 42px; min-width: 44px; font-size: 17px; }
  .g6d05 .chip { height: 34px; min-width: 38px; font-size: 15px; padding: 0 9px; }
  .g6d05 .input { width: 100%; }
  .g6d05 .ready-ring { width: 92px; height: 92px; }
  .g6d05 .ready-ring i { width: 70px; height: 70px; font-size: 19px; }
  .g6d05 .method h3 { font-size: 20px; }
  .g6d05 .bin { min-height: 84px; }

  .g6d05 .footer { height: 66px; padding: 0 14px; }
  .g6d05 .next { height: 42px; padding: 0 14px; font-size: 12px; white-space: nowrap; }
  .g6d05 .back { font-size: 12px; white-space: nowrap; }
  .g6d05 .dots { gap: 5px; }
}

@media (prefers-reduced-motion: reduce) {
  .lesson-root.g6d05 *, .lesson-root.g6d05 *::before, .lesson-root.g6d05 *::after {
    animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important;
  }
}
`;

// ============================================================
// ОЗВУЧКА
// Дорожки — функция состояния экрана. Смена состояния заменяет очередь целиком:
// прежняя фраза обрывается, строки нового состояния читаются подряд. Отсюда
// порядок из ТЗ: команда, подсветка, пауза, действие ученика, следующий сегмент.
// После смены очереди «Продолжить» снова заперта (useAudio.canAdvance).
// ============================================================
const useVoice = (key, lines) => useAudio(
  (lines || []).filter(Boolean).map((text, i) => ({
    id: key + '_' + i,
    text,
    trigger: i === 0 ? 'on_mount' : 'after_previous',
    waits_for: null,
  })),
);

// Реплики хранятся как {ru:[...], uz:[...]}. Готовая строка НИКОГДА не
// собирается в коде: иначе в узбекскую версию попадает кириллица.
const useLines = (bank, key) => {
  const lang = useLang();
  const entry = bank[key];
  if (!entry) return [];
  return entry[lang] || entry.ru || [];
};

const useGcd = () => (useLang() === 'uz' ? 'EKUB' : 'НОД');

// ------------------------------------------------------------
// Полоса озвучки: визуальный двойник текущего аудиосегмента.
// ------------------------------------------------------------
const AudioGuide = ({ title, sub, playing }) => {
  const t = useT();
  return (
    <div className="audio-guide">
      <span className="audio-dot" aria-hidden="true">
        <svg width="11" height="12" viewBox="0 0 11 12" focusable="false"><path d="M1 1l9 5-9 5z" fill="currentColor" /></svg>
      </span>
      <span className="audio-copy">
        {t(title)}
        {sub && <small>{t(sub)}</small>}
      </span>
      <span className={'audio-wave' + (playing ? '' : ' off')} aria-hidden="true">
        <i /><i /><i /><i /><i />
      </span>
    </div>
  );
};

// Указатель зоны нажатия. Место занимает ВСЕГДА: если убрать его после ответа,
// колонка меняет высоту и варианты уезжают из-под пальца.
const DONE_WORD = { ru: 'Готово', uz: 'Bajarildi' };
const Tap = ({ done, children, style }) => {
  const t = useT();
  return (
    <span className={'tap' + (done ? ' done' : '')} style={style}>
      <b aria-hidden="true">{done ? '✓' : '☝'}</b>
      {done ? t(DONE_WORD) : children}
    </span>
  );
};

const KEYS = ['A', 'B', 'C', 'D', 'E'];

// Вариант ответа. Состояния: обычный, выбранный неверно, верный, погашенный.
const Choice = ({ i, label, state, onPick, disabled, ariaLabel }) => (
  <button
    type="button"
    className={'choice' + (state ? ' ' + state : '')}
    onClick={onPick}
    disabled={disabled}
    aria-label={ariaLabel}
  >
    <span className="key" aria-hidden="true">{KEYS[i]}</span>
    <span className="formula">{label}</span>
  </button>
);

const Feedback = ({ tone, show, children, style, className }) => (
  <div
    className={'feedback' + (show ? ' show' : '') + (tone ? ' ' + tone : '') + (className ? ' ' + className : '')}
    style={style}
    aria-live="polite"
  >
    {children}
  </div>
);

// Дифференциация из методического профиля: после ДВУХ ошибок на задании
// открывается наводящая подсказка. Она даёт способ, а не ответ, и появляется
// только по факту двух промахов — сильному ученику её видно не будет.
const YORDAM_WORD = { ru: 'Подсказка', uz: 'Yordam' };
const Yordam = ({ show, text }) => {
  const t = useT();
  if (!show) return null;
  return (
    <div className="yordam" role="note">
      <span className="yb">{t(YORDAM_WORD)}</span>
      <p>{t(text)}</p>
    </div>
  );
};

const Reveal = ({ show, children, style, className }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!show || !ref.current) return undefined;
    const box = ref.current.closest('.body');
    if (!box || box.scrollHeight - box.clientHeight < 8) return undefined;
    const reduce = typeof window !== 'undefined' && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = setTimeout(() => {
      if (ref.current) ref.current.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    }, 420);
    return () => clearTimeout(id);
  }, [show]);
  return (
    <div ref={ref} className={'reveal' + (show ? ' show' : '') + (className ? ' ' + className : '')}
      style={style} aria-hidden={!show}>{children}</div>
  );
};

// Рельс из пяти вкладок: сделано / сейчас / закрыто.
const SEQ_WORD = {
  now: { ru: 'сейчас', uz: 'hozir' },
  locked: { ru: 'закрыто', uz: 'yopiq' },
};
const SeqTabs = ({ current, done }) => {
  const t = useT();
  return (
    <div className="seq-progress" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={'seq-tab ' + (done[i] ? 'done' : i === current ? 'active' : 'locked')}>
          <b>{String(i + 1).padStart(2, '0')}</b>
          <span>{done[i] ? '✓' : i === current ? t(SEQ_WORD.now) : t(SEQ_WORD.locked)}</span>
        </div>
      ))}
    </div>
  );
};

const Stepbar = ({ steps, at, col }) => {
  const t = useT();
  return (
    <div className={'stepbar' + (col ? ' col' : '')} aria-hidden="true">
      {steps.map((s, i) => (
        <span key={i} className={'step' + (i < at ? ' done' : i === at ? ' active' : '')}>{t(s)}</span>
      ))}
    </div>
  );
};

// ------------------------------------------------------------
// Оболочка урока. Верхняя панель, сцена и футер стоят на одних и тех же
// местах на всех пятнадцати экранах — требование макета и ТЗ.
// ------------------------------------------------------------
const BRAND = { ru: 'Математика · Урок 5', uz: 'Matematika · 5-dars' };
const NOTES_WORD = { ru: 'Заметки', uz: 'Eslatma' };
const NOTES_PH = { ru: 'Запишите, что важно запомнить', uz: 'Esda qoladigan narsani yozing' };
const BACK_WORD = { ru: '← Назад', uz: '← Orqaga' };
const NEXT_WORD = { ru: 'Продолжить →', uz: 'Davom etish →' };
const FINISH_WORD = { ru: 'Завершить урок', uz: 'Darsni yakunlash' };
const MUTE_ON = { ru: 'Включить звук', uz: 'Ovozni yoqish' };
const MUTE_OFF = { ru: 'Выключить звук', uz: "Ovozni o'chirish" };
const REPLAY_WORD = { ru: 'Повторить озвучку', uz: 'Ovozni takrorlash' };

// Точка главы кодирует реальное деление урока, а не украшает футер.
const CHAPTER_OF = [0, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4];

const Shell = ({
  screen, section, eyebrow, title, phase, audio, notes, onNotes, notesOpen,
  onPrev, onNext, nextDisabled, nextLabel, children,
}) => {
  const t = useT();
  const noNotes = screen === 0 || screen === TOTAL_SCREENS - 1;
  return (
    <div className="deck">
      <header className="topbar">
        <div className="brand"><span className="badge6" aria-hidden="true">6</span><span>{t(BRAND)}</span></div>
        <div className="progress-wrap">
          <div className="segments" aria-hidden="true">
            {Array.from({ length: TOTAL_SCREENS }, (_, i) => (
              <span key={i} className={'seg' + (i < screen ? ' done' : i === screen ? ' active' : '')} />
            ))}
          </div>
          <div className="bar-meta">
            <span>{t(section)}</span>
            <span className="count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span>
          </div>
        </div>
        <div className="tools">
          {!noNotes && (
            <button type="button" className={'tool' + (notesOpen ? ' on' : '')} onClick={onNotes}
              aria-expanded={notesOpen} aria-label={t(NOTES_WORD)}>
              <span aria-hidden="true">{'✎'}</span>{t(NOTES_WORD)}
            </button>
          )}
          <button type="button" className="tool" onClick={audio.replay} disabled={audio.muted}
            aria-label={t(REPLAY_WORD)}><span aria-hidden="true">{'↻'}</span></button>
          <button type="button" className={'tool' + (audio.muted ? ' on' : '')} onClick={audio.toggleMute}
            aria-label={t(audio.muted ? MUTE_ON : MUTE_OFF)}><span aria-hidden="true">{audio.muted ? '✕' : '♫'}</span></button>
        </div>
      </header>

      {notesOpen && !noNotes && (
        <div className="notes-pop">
          <span className="label">{t(NOTES_WORD)}</span>
          <textarea value={notes.value} onChange={(e) => notes.set(e.target.value)}
            placeholder={t(NOTES_PH)} aria-label={t(NOTES_WORD)} />
        </div>
      )}

      <main className="stage">
        <div className="screen-head">
          <div>
            <div className="eyebrow">{t(eyebrow)}</div>
            <h1>{t(title)}</h1>
          </div>
          <div className="phase"><i aria-hidden="true">{'↗'}</i>{t(phase)}</div>
        </div>
        <div className="body">{children}</div>
      </main>

      <footer className="footer">
        <button type="button" className="back" onClick={onPrev} disabled={screen === 0} aria-label={t(BACK_WORD)}>
          {t(BACK_WORD)}
        </button>
        <div className="dots" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={'dot' + (CHAPTER_OF[screen] === i ? ' active' : '')} />
          ))}
        </div>
        <button type="button" className="next" onClick={onNext} disabled={nextDisabled}
          aria-label={t(nextLabel || NEXT_WORD)}>
          {t(nextLabel || NEXT_WORD)}
        </button>
      </footer>
    </div>
  );
};

const SECTION = {
  hook: { ru: 'Хук', uz: 'Xuk' },
  explain: { ru: 'Объяснение', uz: 'Tushuntirish' },
  rule: { ru: 'Правило', uz: 'Qoida' },
  check: { ru: 'Проверка', uz: 'Tekshiruv' },
  practice: { ru: 'Практика', uz: 'Amaliyot' },
  finalPractice: { ru: 'Итоговая практика', uz: 'Yakuniy amaliyot' },
  summary: { ru: 'Итог', uz: 'Yakun' },
};

// ============================================================
// ЭКРАН 1 — ХУК. Два счёта, 12 000 и 18 000.
// Ответ НЕ ОЦЕНИВАЕТСЯ, при возврате хук начинается заново, заметок нет.
// ============================================================
const S1 = {
  eyebrow: { ru: 'Два ответа', uz: 'Ikki javob' },
  title: { ru: 'Двое поделили счета. Кто прав?', uz: "Ikki kishi hisobni bo'ldi. Kim haqli?" },
  phase: { ru: 'проверь и рассуди', uz: 'tekshiring va hal qiling' },
  label: { ru: 'два счёта · одно число людей', uz: "ikkita hisob · bitta odam soni" },
  sum: { ru: 'тысяч сумов', uz: "ming so'm" },
  tap1: { ru: 'Нажмите один ответ', uz: 'Bitta javobni bosing' },
  split: { ru: '2. Разделить оба счёта →', uz: "2. Ikkala hisobni bo'lish →" },
  people: { ru: 'человек', uz: 'kishi' },
  nope: { ru: 'не делится', uz: "bo'linmaydi" },
  other: { ru: 'Другой ответ', uz: 'Boshqa javob' },
  claims: [
    { who: { ru: 'Азиз', uz: 'Aziz' }, n: 6 },
    { who: { ru: 'Дилноза', uz: 'Dilnoza' }, n: 9 },
  ],
  wait: { ru: 'Сначала выберите, чей ответ проверяем.', uz: 'Avval kimning javobini tekshirishni tanlang.' },
  guide: {
    pick: [{ ru: 'Азиз говорит шесть, Дилноза девять', uz: "Aziz olti, Dilnoza to'qqiz deydi" },
      { ru: 'Оба счёта должны делиться без остатка', uz: "Ikkala hisob ham qoldiqsiz bo'linishi kerak" }],
    check: [{ ru: 'Шаг 2. Проверьте деление', uz: "2-qadam. Bo'lishni tekshiring" },
      { ru: 'Нажмите оранжевую кнопку справа', uz: "O'ngdagi to'q sariq tugmani bosing" }],
    done6: [{ ru: 'Прав Азиз: разделились оба счёта', uz: "Aziz haqli: ikkala hisob ham bo'lindi" },
      { ru: 'Дальше разберём, почему именно шесть', uz: "Keyin nega aynan olti ekanini ko'ramiz" }],
    done9: [{ ru: 'Девять делит только один счёт', uz: "To'qqiz faqat bitta hisobni bo'ladi" },
      { ru: 'Проверьте второй ответ', uz: 'Ikkinchi javobni tekshiring' }],
  },
  audio: {
    pick: {
      ru: ['На столе два счёта. Первый на двенадцать тысяч сум, второй на восемнадцать тысяч.',
        'Азиз говорит, что разделить смогут шесть человек. Дилноза говорит, что девять.',
        'Оба ответа звучат разумно, но верен только один. Нажмите ответ, который хотите проверить.'],
      uz: ["Stolda ikkita hisob turibdi. Birinchisi o'n ikki ming so'm, ikkinchisi o'n sakkiz ming so'm.",
        "Aziz olti kishi bo'lib oladi deydi. Dilnoza esa to'qqiz kishi deydi.",
        "Ikkala javob ham mantiqli tuyuladi, lekin faqat bittasi to'g'ri. Tekshirmoqchi bo'lgan javobni bosing."],
    },
    check: {
      ru: ['Ответ выбран. Теперь нажмите оранжевую кнопку и посмотрите, что получится.'],
      uz: ["Javob tanlandi. Endi to'q sariq tugmani bosing va nima chiqishini ko'ring."],
    },
    done6: {
      ru: ['Двенадцать делится на шесть и выходит два. Восемнадцать делится на шесть и выходит три.',
        'Оба счёта разделились, значит прав Азиз. Дальше разберём, почему именно шесть.'],
      uz: ["O'n ikkini oltiga bo'lsak ikki chiqadi. O'n sakkizni oltiga bo'lsak uch chiqadi.",
        "Ikkala hisob ham bo'lindi, demak Aziz haqli. Keyin nega aynan olti ekanini ko'rib chiqamiz."],
    },
    done9: {
      ru: ['Восемнадцать на девять делится, выходит два. А двенадцать на девять не делится.',
        'Дилноза проверила только один счёт. Общее число должно делить оба. Проверьте второй ответ.'],
      uz: ["O'n sakkiz to'qqizga bo'linadi, ikki chiqadi. O'n ikki esa to'qqizga bo'linmaydi.",
        "Dilnoza faqat bitta hisobni tekshirdi. Umumiy son ikkalasini ham bo'lishi kerak. Ikkinchi javobni tekshiring."],
    },
  },
};

// Хук-конфликт: два ответа, из которых один — типичная ошибка «проверил одно
// число из двух». Ответ не оценивается, ученик может проверить и вторую
// версию: именно на девятке видно, где ломается рассуждение.
function Screen01({ screen, onNext, onPrev, onAnswer, shell }) {
  const t = useT();
  const [picked, setPicked] = useState(null);
  const [split, setSplit] = useState(false);
  const key = split ? (picked === 6 ? 'done6' : 'done9') : picked ? 'check' : 'pick';
  const audio = useVoice('s1_' + key, useLines(S1.audio, key));

  const doSplit = () => {
    if (!picked || split) return;
    setSplit(true);
    onAnswer({ screen: 1, kind: 'hook', picked, graded: false });
  };
  const again = () => { setSplit(false); setPicked(null); };

  return (
    <Shell {...shell} screen={screen} section={SECTION.hook} eyebrow={S1.eyebrow} title={S1.title}
      phase={S1.phase} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!audio.canAdvance}>
      <div className="hook">
        <div className="card hook-left">
          <AudioGuide title={S1.guide[key][0]} sub={S1.guide[key][1]} playing={audio.isPlaying} />
          <div className="formula huge" style={{ margin: 'var(--v5) 0 8px' }}>12 000 {t({ ru: 'и', uz: 'va' })} 18 000</div>
          <Tap done={Boolean(picked)} style={{ margin: '8px 0 var(--v3)' }}>{t(S1.tap1)}</Tap>
          <div className="choices c2">
            {S1.claims.map((c, i) => (
              <Choice key={c.n} i={i} label={t(c.who) + ': ' + c.n + ' ' + t(S1.people)} disabled={split}
                state={picked === c.n ? 'selected' : picked ? 'dim' : ''}
                onPick={() => { if (!split) setPicked(c.n); }}
                ariaLabel={t(c.who) + ': ' + c.n + ' ' + t(S1.people)} />
            ))}
          </div>
        </div>

        <div className="card hook-right">
          <div className="label">{t(S1.label)}</div>
          <div className="bill-row" style={{ marginTop: 'var(--v4)' }}>
            <div className="bill"><div><b>12</b><span>{t(S1.sum)}</span></div></div>
            <div style={{ textAlign: 'center', fontSize: 'clamp(17px, min(1.68vw, 3vh), 23px)', color: '#E75A2C' }} aria-hidden="true">÷</div>
            <div className="bill"><div><b>18</b><span>{t(S1.sum)}</span></div></div>
          </div>
          <div className="people" aria-live="polite">
            {picked ? Array.from({ length: picked }, (_, i) => (
              <span className="person" key={i} style={{ animationDelay: (i * 120) + 'ms' }} />
            )) : null}
          </div>
          <div style={{ marginTop: 'var(--v3)', display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button type="button" className="primary orange" onClick={doSplit} disabled={!picked || split}
              aria-label={t(S1.split)}>{t(S1.split)}</button>
            {split && picked !== 6 && (
              <button type="button" className="primary" onClick={again} aria-label={t(S1.other)}>{t(S1.other)}</button>
            )}
          </div>
          <Feedback tone={split ? (picked === 6 ? 'right' : 'wrong') : ''} show={split} style={{ marginTop: 'var(--v3)' }}>
            {!split && t(S1.wait)}
            {split && picked === 6 && (
              <><span className="formula">12 : 6 = 2; 18 : 6 = 3</span> — {t({ ru: 'оба счёта разделились, прав Азиз.', uz: "ikkala hisob ham bo'lindi, Aziz haqli." })}</>
            )}
            {split && picked !== 6 && (
              <><span className="formula">18 : 9 = 2</span>, {t({ ru: 'но', uz: 'lekin' })} <span className="formula">12 : 9</span> — {t(S1.nope)}. {t({ ru: 'Дилноза проверила только один счёт.', uz: 'Dilnoza faqat bitta hisobni tekshirdi.' })}</>
            )}
          </Feedback>
        </div>
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 2 — ДВА СПИСКА ДЕЛИТЕЛЕЙ, ЧЕТЫРЕ ШАГА ПО ПОРЯДКУ
// ============================================================
const D12 = [1, 2, 3, 4, 6, 12];
const D18 = [1, 2, 3, 6, 9, 18];
const COMMON = [1, 2, 3, 6];

const S2 = {
  eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
  title: { ru: 'Выписываем оба списка', uz: "Ikkala ro'yxatni yozamiz" },
  phase: { ru: '4 шага синхронно', uz: "4 qadam ketma ket" },
  divisors: { ru: 'делители', uz: "bo'luvchilar" },
  tap: { ru: 'Нажмите текущий шаг', uz: 'Joriy qadamni bosing' },
  steps: [
    { ru: '1 · делители 12', uz: "1 · 12 ning bo'luvchilari" },
    { ru: '2 · делители 18', uz: "2 · 18 ning bo'luvchilari" },
    { ru: '3 · найти общие', uz: '3 · umumiylarini topish' },
    { ru: '4 · взять самый большой', uz: '4 · eng kattasini olish' },
  ],
  concl: [
    { ru: 'Общие делители появятся после третьего шага.', uz: "Umumiy bo'luvchilar uchinchi qadamdan keyin chiqadi." },
    { ru: 'Делители 12 готовы. Откройте второй список.', uz: "12 ning bo'luvchilari tayyor. Ikkinchi ro'yxatni oching." },
    { ru: 'Два списка готовы. Найдём числа, которые есть в обоих.', uz: "Ikkala ro'yxat tayyor. Ikkalasida ham bor sonlarni topamiz." },
    { ru: 'Общие делители: 1, 2, 3 и 6.', uz: "Umumiy bo'luvchilar: 1, 2, 3 va 6." },
    { ru: 'Самый большой общий делитель — 6.', uz: "Eng katta umumiy bo'luvchi — 6." },
  ],
  guide: [
    [{ ru: 'Шаг 1. Найдём делители 12', uz: "1-qadam. 12 ning bo'luvchilarini topamiz" }, { ru: 'Нажимайте шаги по порядку', uz: 'Qadamlarni tartib bilan bosing' }],
    [{ ru: 'Шаг 1. Делители 12 готовы', uz: "1-qadam. 12 ning bo'luvchilari tayyor" }, { ru: 'Теперь откройте делители 18', uz: "Endi 18 ning bo'luvchilarini oching" }],
    [{ ru: 'Шаг 2. Два списка готовы', uz: "2-qadam. Ikkala ro'yxat tayyor" }, { ru: 'Найдём числа, которые есть в обоих', uz: 'Ikkalasida ham bor sonlarni topamiz' }],
    [{ ru: 'Шаг 3. Общие: 1, 2, 3 и 6', uz: '3-qadam. Umumiylari: 1, 2, 3 va 6' }, { ru: 'Осталось взять самый большой', uz: 'Endi eng kattasini olish qoldi' }],
    [{ ru: 'Шаг 4. Наибольший общий делитель', uz: "4-qadam. Eng katta umumiy bo'luvchi" }, { ru: 'Это шесть', uz: 'Bu olti' }],
  ],
  audio: {
    s0: { ru: ['Четыре шага, и наибольший общий делитель найден. Нажмите первый шаг.'], uz: ["To'rt qadam, va eng katta umumiy bo'luvchi topiladi. Birinchi qadamni bosing."] },
    s1: { ru: ['Выписываем делители двенадцати. Один, два, три, четыре, шесть, двенадцать.', 'Нажмите второй шаг.'], uz: ["O'n ikkining bo'luvchilarini yozamiz. Bir, ikki, uch, to'rt, olti, o'n ikki.", 'Ikkinchi qadamni bosing.'] },
    s2: { ru: ['Теперь делители восемнадцати. Один, два, три, шесть, девять, восемнадцать.', 'Нажмите третий шаг.'], uz: ["Endi o'n sakkizning bo'luvchilari. Bir, ikki, uch, olti, to'qqiz, o'n sakkiz.", 'Uchinchi qadamni bosing.'] },
    s3: { ru: ['Бирюзовым горят числа, которые есть в обоих рядах. Один, два, три и шесть.', 'Это общие делители. Нажмите четвёртый шаг.'], uz: ["Ikkala qatorda ham bor sonlar moviy rangda yonmoqda. Bir, ikki, uch va olti.", "Bular umumiy bo'luvchilar. To'rtinchi qadamni bosing."] },
    s4: { ru: ['Из общих делителей выбираем самый большой. Это шесть.', 'Наибольший общий делитель двенадцати и восемнадцати равен шести.'], uz: ["Umumiy bo'luvchilardan eng kattasini tanlaymiz. Bu olti.", "O'n ikki va o'n sakkizning eng katta umumiy bo'luvchisi oltiga teng."] },
  },
};

function Screen02({ screen, onNext, onPrev, storedAnswer, onAnswer, shell }) {
  const t = useT();
  const w = useGcd();
  const [step, setStep] = useState(() => (storedAnswer && storedAnswer.step) || 0);
  const audio = useVoice('s2_' + step, useLines(S2.audio, 's' + step));

  const go = (i) => {
    if (i !== step + 1) return;
    setStep(i);
    onAnswer({ screen: 2, kind: 'walk', step: i });
  };

  const chip = (n, row) => {
    if (step < row) return 'chip ghost';
    if (step >= 4 && n === 6) return 'chip max';
    if (step >= 3 && COMMON.includes(n)) return 'chip common';
    return 'chip';
  };

  return (
    <Shell {...shell} screen={screen} section={SECTION.explain} eyebrow={S2.eyebrow} title={S2.title}
      phase={S2.phase} audio={audio} onPrev={onPrev} onNext={onNext}
      nextDisabled={step < 4 || !audio.canAdvance}>
      <div className="explore-layout">
        <div className="card explore-main">
          <AudioGuide title={S2.guide[step][0]} sub={S2.guide[step][1]} playing={audio.isPlaying} />
          <div className="lists" style={{ marginTop: 'var(--v4)' }}>
            <div className="number-box">
              <div className="number-title"><span>12</span><small>{t(S2.divisors)}</small></div>
              <div className="chip-row">{D12.map((n) => <span key={n} className={chip(n, 1)}>{n}</span>)}</div>
            </div>
            <div className="venn-link" aria-hidden="true">⇄</div>
            <div className="number-box">
              <div className="number-title"><span>18</span><small>{t(S2.divisors)}</small></div>
              <div className="chip-row">{D18.map((n) => <span key={n} className={chip(n, 2)}>{n}</span>)}</div>
            </div>
          </div>
          <Feedback tone={step >= 4 ? 'right' : ''} show={step > 0} style={{ marginTop: 'var(--v3)' }}>
            {t(S2.concl[step])}
          </Feedback>
        </div>

        <div className="card explore-side">
          <Tap done={step >= 4}>{t(S2.tap)}</Tap>
          <div className="action-list">
            {S2.steps.map((s, i) => (
              <button key={i} type="button" onClick={() => go(i + 1)} disabled={step + 1 !== i + 1}
                className={'action' + (step >= i + 1 ? ' done' : step + 1 === i + 1 ? ' active' : '')}
                aria-label={t(s)}>
                {t(s)}<span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
          <Reveal show={step >= 4} style={{ marginTop: 'var(--v3)' }}>
            <div className="rule-eq">{w}(12; 18) = 6</div>
          </Reveal>
        </div>
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 3 — МЕДЛЕННАЯ ПОДСТАНОВКА. Строки заполняются сверху вниз.
// ============================================================
const S3 = {
  eyebrow: { ru: 'Проверка числа', uz: 'Sonni tekshirish' },
  title: { ru: 'Подставим общий делитель', uz: "Umumiy bo'luvchini qo'yamiz" },
  phase: { ru: 'число появляется по шагам', uz: 'son qadamma qadam chiqadi' },
  tap: { ru: 'Нажмите число', uz: 'Sonni bosing' },
  wait: { ru: 'Сначала выберите число.', uz: 'Avval sonni tanlang.' },
  waitD: { ru: 'ждём d', uz: 'd ni kutamiz' },
  waitR: { ru: 'ждём вывод', uz: 'xulosani kutamiz' },
  c1: { ru: 'проверка 1', uz: '1-tekshiruv' },
  c2: { ru: 'проверка 2', uz: '2-tekshiruv' },
  res: { ru: 'результат', uz: 'natija' },
  steps: [
    { ru: '1 · подставить', uz: "1 · qo'yish" },
    { ru: '2 · проверить', uz: '2 · tekshirish' },
    { ru: '3 · сделать вывод', uz: '3 · xulosa chiqarish' },
  ],
  best: { ru: '6 — самый большой', uz: '6 — eng kattasi' },
  notBest: { ru: 'общий, но меньше 6', uz: "umumiy, lekin 6 dan kichik" },
  def: {
    ru: 'Наибольший общий делитель — самое большое число, которое делит оба без остатка.',
    uz: "Eng katta umumiy bo'luvchi — ikkala sonni ham qoldiqsiz bo'ladigan eng katta son.",
  },
  fb: {
    1: { ru: '1 делит оба, но он не самый большой.', uz: "1 ikkalasini ham bo'ladi, lekin u eng katta emas." },
    2: { ru: '2 делит оба, но в списке есть больше.', uz: "2 ikkalasini ham bo'ladi, lekin ro'yxatda kattarog'i bor." },
    3: { ru: '3 делит оба, но число 6 больше.', uz: "3 ikkalasini ham bo'ladi, lekin 6 kattaroq." },
    6: { ru: '6 делит оба и является самым большим общим.', uz: "6 ikkalasini ham bo'ladi va eng katta umumiy hisoblanadi." },
  },
  guide: {
    idle: [{ ru: 'Выберите число из общего списка', uz: "Umumiy ro'yxatdan sonni tanlang" }, { ru: 'Мы медленно подставим его в обе проверки', uz: "Uni ikkala tekshiruvga sekin qo'yamiz" }],
  },
  audio: {
    idle: { ru: ['Здесь d — общий делитель. Нажмите число, и оно медленно подставится в обе строки.'], uz: ["Bu yerda d — umumiy bo'luvchi. Sonni bosing, u ikkala satrga sekin qo'yiladi."] },
    p1: { ru: ['Двенадцать делится на один и выходит двенадцать. Восемнадцать делится на один и выходит восемнадцать.', 'Один подходит обоим, но это самый маленький общий делитель.'], uz: ["O'n ikkini birga bo'lsak o'n ikki chiqadi. O'n sakkizni birga bo'lsak o'n sakkiz chiqadi.", "Bir ikkalasiga ham to'g'ri keladi, lekin bu eng kichik umumiy bo'luvchi."] },
    p2: { ru: ['Двенадцать делится на два и выходит шесть. Восемнадцать делится на два и выходит девять.', 'Два подходит обоим, но общий делитель может быть больше.'], uz: ["O'n ikkini ikkiga bo'lsak olti chiqadi. O'n sakkizni ikkiga bo'lsak to'qqiz chiqadi.", "Ikki ikkalasiga ham to'g'ri keladi, lekin umumiy bo'luvchi kattaroq bo'lishi mumkin."] },
    p3: { ru: ['Двенадцать делится на три и выходит четыре. Восемнадцать делится на три и выходит шесть.', 'Три подходит обоим, но самое большое число мы ещё не нашли.'], uz: ["O'n ikkini uchga bo'lsak to'rt chiqadi. O'n sakkizni uchga bo'lsak olti chiqadi.", "Uch ikkalasiga ham to'g'ri keladi, lekin eng katta sonni hali topmadik."] },
    p6: { ru: ['Двенадцать делится на шесть и выходит два. Восемнадцать делится на шесть и выходит три.', 'Больше шести общего делителя нет.', 'Запомните определение. Это самое большое число, которое делит оба без остатка.'], uz: ["O'n ikkini oltiga bo'lsak ikki chiqadi. O'n sakkizni oltiga bo'lsak uch chiqadi.", "Oltidan katta umumiy bo'luvchi yo'q.", "Ta'rifni eslab qoling. Bu ikkala sonni ham qoldiqsiz bo'ladigan eng katta son."] },
  },
};

function Screen03({ screen, onNext, onPrev, storedAnswer, onAnswer, shell }) {
  const t = useT();
  const w = useGcd();
  const [d, setD] = useState(() => (storedAnswer && storedAnswer.d) || null);
  const [solved, setSolved] = useState(() => Boolean(storedAnswer && storedAnswer.solved));
  const [rows, setRows] = useState(() => (storedAnswer && storedAnswer.solved ? 3 : 0));
  const tries = useRef(0);
  const runRef = useRef(0);
  const key = d ? 'p' + d : 'idle';
  const audio = useVoice('s3_' + key, useLines(S3.audio, key));

  // Строки заполняются сверху вниз: 300 / 950 / 1650 мс — темп макета.
  useEffect(() => {
    if (!d) return undefined;
    const run = ++runRef.current;
    setRows(0);
    const ids = [300, 950, 1650].map((ms, i) => setTimeout(() => {
      if (run !== runRef.current) return;
      setRows(i + 1);
      if (i === 2 && d === 6) {
        setSolved(true);
        onAnswer({ screen: 3, kind: 'substitute', d: 6, solved: true, firstTry: tries.current === 1 });
      }
    }, ms));
    return () => ids.forEach(clearTimeout);
  }, [d, onAnswer]);

  const pick = (n) => {
    if (solved) return;
    tries.current += 1;
    setD(n);
  };

  const at = rows >= 3 ? 2 : rows;

  return (
    <Shell {...shell} screen={screen} section={SECTION.rule} eyebrow={S3.eyebrow} title={S3.title}
      phase={S3.phase} audio={audio} onPrev={onPrev} onNext={onNext}
      nextDisabled={!solved || !audio.canAdvance}>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gridTemplateRows: 'minmax(0, 1fr)', gap: 16, height: '100%' }}>
        <div className="card pad" style={{ display: 'flex', flexDirection: 'column' }}>
          <AudioGuide title={S3.guide.idle[0]} sub={S3.guide.idle[1]} playing={audio.isPlaying} />
          <Tap done={solved} style={{ margin: 'var(--v4) 0 var(--v2)' }}>{t(S3.tap)}</Tap>
          <div className="choices c2">
            {[1, 2, 3, 6].map((n, i) => (
              <Choice key={n} i={i} label={n} disabled={solved}
                state={d === n ? (rows >= 3 ? (n === 6 ? 'correct' : 'wrong') : 'selected') : solved ? 'dim' : ''}
                onPick={() => pick(n)} ariaLabel={'d = ' + n} />
            ))}
          </div>
          <Feedback tone={rows >= 3 ? (d === 6 ? 'right' : 'wrong') : ''} show={Boolean(d)} style={{ marginTop: 'var(--v3)' }}>
            {d ? t(S3.fb[d]) : t(S3.wait)}
          </Feedback>
        </div>

        <div className="card pad" style={{ display: 'flex', flexDirection: 'column' }}>
          <Stepbar steps={S3.steps} at={at} />
          <div style={{ marginTop: 'var(--v3)' }}>
            <div className={'substitute-row' + (rows >= 1 ? ' show' : '')}>
              <span className="formula">12 : d</span>
              <span className="substitute-value">{rows >= 1 ? '12 : ' + d + ' = ' + 12 / d : t(S3.waitD)}</span>
              <span className="muted">{t(S3.c1)}</span>
            </div>
            <div className={'substitute-row' + (rows >= 2 ? ' show' : '')}>
              <span className="formula">18 : d</span>
              <span className="substitute-value">{rows >= 2 ? '18 : ' + d + ' = ' + 18 / d : t(S3.waitD)}</span>
              <span className="muted">{t(S3.c2)}</span>
            </div>
            <div className={'substitute-row' + (rows >= 3 ? ' show' : '')}>
              <span className="formula">{w}(12; 18)</span>
              <span className="substitute-value">{rows >= 3 ? (d === 6 ? t(S3.best) : d + ' — ' + t(S3.notBest)) : t(S3.waitR)}</span>
              <span className="muted">{t(S3.res)}</span>
            </div>
          </div>
          <Reveal show={solved} style={{ marginTop: 'var(--v2)' }}>
            <div className="feedback right show"><b>{w}</b> — {t(S3.def)}</div>
          </Reveal>
        </div>
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 4 — ДЕЛИТ ОДНО ЧИСЛО ИЛИ ОБА
// ============================================================
const S4 = {
  eyebrow: { ru: 'Начнём с простого', uz: 'Oddiydan boshlaymiz' },
  title: { ru: 'Какое число делит и 8, и 12?', uz: "Qaysi son 8 ni ham, 12 ni ham bo'ladi?" },
  phase: { ru: 'у каждого ответа подсказка', uz: 'har bir javobda izoh bor' },
  tap: { ru: 'Нажмите число', uz: 'Sonni bosing' },
  wait: { ru: 'Выберите один вариант.', uz: 'Bitta variantni tanlang.' },
  one: { ru: 'делит одно', uz: "bittasini bo'ladi" },
  both: { ru: 'делит оба', uz: "ikkalasini bo'ladi" },
  noteT: { ru: 'Главное различие', uz: 'Asosiy farq' },
  note: {
    ru: 'Делитель одного числа не становится общим. Число должно делить без остатка и 8, и 12.',
    uz: "Bitta sonning bo'luvchisi umumiy bo'lib qolmaydi. Son 8 ni ham, 12 ni ham qoldiqsiz bo'lishi kerak.",
  },
  fb: {
    3: { ru: '3 делит только 12. Для общего делителя нужны две точные проверки.', uz: "3 faqat 12 ni bo'ladi. Umumiy bo'luvchi uchun ikkita aniq tekshiruv kerak." },
    4: { ru: 'Верно: 4 проходит обе проверки без остатка.', uz: "To'g'ri: 4 ikkala tekshiruvdan ham qoldiqsiz o'tadi." },
    5: { ru: '5 не делит ни 8, ни 12: обе проверки дают остаток.', uz: "5 na 8 ni, na 12 ni bo'ladi: ikkala tekshiruv ham qoldiq beradi." },
    6: { ru: '6 делит 12, но не 8. Одной точной проверки недостаточно.', uz: "6 12 ni bo'ladi, 8 ni esa yo'q. Bitta aniq tekshiruv yetarli emas." },
  },
  yordam: { ru: "Проверяйте каждое число дважды: сначала делите 8, потом 12. Общий делитель обязан пройти обе проверки.", uz: "Har bir sonni ikki marta tekshiring: avval 8 ni, keyin 12 ni bo'ling. Umumiy bo'luvchi ikkala tekshiruvdan ham o'tishi shart." },
  guide: [{ ru: 'Проверьте делением на оба числа', uz: "Ikkala songa ham bo'lib tekshiring" }, { ru: 'Решение откроется только после верного ответа', uz: "Yechim faqat to'g'ri javobdan keyin ochiladi" }],
  audio: {
    idle: { ru: ['Два числа, восемь и двенадцать. Найдите то, что делит оба. Выберите ответ.'], uz: ["Ikkita son, sakkiz va o'n ikki. Ikkalasini ham bo'ladiganini toping. Javobni tanlang."] },
    ok: {
      ru: ['Верно, это четыре. Восемь делится на четыре и выходит два. Двенадцать делится на четыре и выходит три.',
        'Сравните два случая. Слева тройка делит только двенадцать. Справа четвёрка делит оба числа.',
        'Запомните. Делитель одного числа общим не является.'],
      uz: ["To'g'ri, bu to'rt. Sakkizni to'rtga bo'lsak ikki chiqadi. O'n ikkini to'rtga bo'lsak uch chiqadi.",
        "Ikki holatni solishtiring. Chapda uchlik faqat o'n ikkini bo'ladi. O'ngda to'rtlik ikkala sonni ham bo'ladi.",
        "Eslab qoling. Bitta sonning bo'luvchisi umumiy bo'luvchi bo'lmaydi."],
    },
  },
};

function Screen04({ screen, onNext, onPrev, storedAnswer, onAnswer, recordTask, shell }) {
  const t = useT();
  const lang = useLang();
  const [pick, setPick] = useState(() => (storedAnswer && storedAnswer.pick) || null);
  const [solved, setSolved] = useState(() => Boolean(storedAnswer && storedAnswer.solved));
  const [misses, setMisses] = useState(0);
  const tries = useRef(0);
  const base = useLines(S4.audio, solved ? 'ok' : 'idle');
  const vKey = solved ? 'ok' : pick ? 'w' + pick + (misses >= 2 ? 'h' : '') : 'idle';
  const audio = useVoice('s4_' + vKey,
    (!solved && pick) ? (misses >= 2 ? [S4.fb[pick][lang], S4.yordam[lang]] : [S4.fb[pick][lang]]) : base);

  const choose = (n) => {
    if (solved) return;
    tries.current += 1;
    setPick(n);
    if (n === 4) {
      setSolved(true);
      onAnswer({ screen: 4, kind: 'mc', pick: 4, solved: true, firstTry: tries.current === 1 });
      recordTask('s04', tries.current === 1);
    } else setMisses((m) => m + 1);
  };

  return (
    <Shell {...shell} screen={screen} section={SECTION.check} eyebrow={S4.eyebrow} title={S4.title}
      phase={S4.phase} audio={audio} onPrev={onPrev} onNext={onNext}
      nextDisabled={!solved || !audio.canAdvance}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11, height: '100%' }}>
        <AudioGuide title={S4.guide[0]} sub={S4.guide[1]} playing={audio.isPlaying} />
        <div className="card pad" style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Tap done={solved}>{t(S4.tap)}</Tap>
          <div className="choices" style={{ marginTop: 'var(--v3)' }}>
            {[3, 4, 5, 6].map((n, i) => (
              <Choice key={n} i={i} label={n} disabled={solved}
                state={solved ? (n === 4 ? 'correct' : 'dim') : pick === n ? 'wrong' : ''}
                onPick={() => choose(n)} ariaLabel={String(n)} />
            ))}
          </div>
          <Feedback tone={solved ? 'right' : pick ? 'wrong' : ''} show={Boolean(pick)} style={{ marginTop: 'var(--v3)' }}>
            {pick ? t(S4.fb[pick]) : t(S4.wait)}
          </Feedback>
          <Yordam show={!solved && misses >= 2} text={S4.yordam} />
          <Reveal show={solved} style={{ marginTop: 'var(--v2)' }}>
            <div className="division-grid stagger">
              <div className="division no"><span>{t(S4.one)}</span><b>12 : 3 = 4</b></div>
              <div className="division yes"><span>{t(S4.both)}</span><b>8 : 4 = 2</b></div>
            </div>
            <div className="method-note stagger" style={{ marginTop: 'var(--v2)' }}>
              <b>{t(S4.noteT)}</b>
              <p>{t(S4.note)}</p>
            </div>
            <div className="feedback right show stagger" style={{ marginTop: 'var(--v2)' }}>
              <span className="formula">8 : 4 = 2; 12 : 4 = 3</span> → {t({ ru: '4 является общим делителем.', uz: "4 umumiy bo'luvchi hisoblanadi." })}
            </div>
          </Reveal>
        </div>
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 5 — НОД(16; 24). Разбор в три ступени со своей репликой.
// ============================================================
const S5 = {
  eyebrow: { ru: 'Другая пара', uz: 'Boshqa juftlik' },
  title: { ru: 'Чему равен НОД(16; 24)?', uz: 'EKUB(16; 24) nechaga teng?' },
  phase: { ru: 'сравниваем списки', uz: "ro'yxatlarni solishtiramiz" },
  tap: { ru: 'Нажмите НОД', uz: 'EKUB ni bosing' },
  wait: { ru: 'Выберите ответ.', uz: 'Javobni tanlang.' },
  st1: { ru: 'Шаг 1 · общие числа', uz: '1-qadam · umumiy sonlar' },
  st2: { ru: 'Шаг 2 · берём самое большое', uz: '2-qadam · eng kattasini olamiz' },
  st2p: { ru: 'Из общего списка самое большое число — 8.', uz: "Umumiy ro'yxatdagi eng katta son — 8." },
  fb: {
    2: { ru: '2 общий, но не самый большой. Продолжите сравнение вправо.', uz: "2 umumiy, lekin eng katta emas. Solishtirishni davom ettiring." },
    4: { ru: '4 общий, но 8 тоже делит оба числа без остатка.', uz: "4 umumiy, lekin 8 ham ikkala sonni qoldiqsiz bo'ladi." },
    6: { ru: '24 делится на 6, а 16 даёт остаток 4.', uz: "24 oltiga bo'linadi, 16 esa 4 qoldiq beradi." },
    8: { ru: 'Верно. Теперь озвучка соберёт решение по шагам.', uz: "To'g'ri. Endi ovoz yechimni qadamma qadam yig'adi." },
  },
  yordam: { ru: "Выпишите делители каждого числа и найдите те, что есть в обоих рядах. Из них возьмите самый большой.", uz: "Har bir sonning bo'luvchilarini yozing va ikkala qatorda ham borlarini toping. Ular ichidan eng kattasini oling." },
  guide: [{ ru: 'Найдите самый большой общий', uz: 'Eng katta umumiyni toping' }, { ru: 'Сначала сравните два списка', uz: "Avval ikkala ro'yxatni solishtiring" }],
  audio: {
    idle: { ru: ['Найдите наибольший общий делитель шестнадцати и двадцати четырёх. Выберите ответ.'], uz: ["O'n olti va yigirma to'rtning eng katta umumiy bo'luvchisini toping. Javobni tanlang."] },
    ok: {
      ru: ['Верно. Сначала посмотрим на все общие делители. Это один, два, четыре и восемь.',
        'Теперь выбираем самое большое из них. Это восемь.',
        'Значит, наибольший общий делитель шестнадцати и двадцати четырёх равен восьми.'],
      uz: ["To'g'ri. Avval barcha umumiy bo'luvchilarga qaraymiz. Bular bir, ikki, to'rt va sakkiz.",
        "Endi ular ichidan eng kattasini tanlaymiz. Bu sakkiz.",
        "Demak, o'n olti va yigirma to'rtning eng katta umumiy bo'luvchisi sakkizga teng."],
    },
  },
};

function Screen05({ screen, onNext, onPrev, storedAnswer, onAnswer, recordTask, shell }) {
  const t = useT();
  const lang = useLang();
  const w = useGcd();
  const [pick, setPick] = useState(() => (storedAnswer && storedAnswer.pick) || null);
  const [solved, setSolved] = useState(() => Boolean(storedAnswer && storedAnswer.solved));
  const [misses, setMisses] = useState(0);
  const tries = useRef(0);
  const base = useLines(S5.audio, solved ? 'ok' : 'idle');
  const vKey = solved ? 'ok' : pick ? 'w' + pick + (misses >= 2 ? 'h' : '') : 'idle';
  const audio = useVoice('s5_' + vKey,
    (!solved && pick) ? (misses >= 2 ? [S5.fb[pick][lang], S5.yordam[lang]] : [S5.fb[pick][lang]]) : base);

  const choose = (n) => {
    if (solved) return;
    tries.current += 1;
    setPick(n);
    if (n === 8) {
      setSolved(true);
      onAnswer({ screen: 5, kind: 'mc', pick: 8, solved: true, firstTry: tries.current === 1 });
      recordTask('s05', tries.current === 1);
    } else setMisses((m) => m + 1);
  };

  // Общие делители окрашиваются ТОЛЬКО после верного ответа. До этого оба ряда
  // нейтральны: найти общие числа и есть работа ученика. Подсветка заранее
  // делала ответ считываемым с экрана без математики.
  const chipCls = (n) => {
    if (!solved) return 'chip';
    if (n === 8) return 'chip max';
    return [1, 2, 4].includes(n) ? 'chip common' : 'chip';
  };

  return (
    <Shell {...shell} screen={screen} section={SECTION.practice} eyebrow={S5.eyebrow} title={S5.title}
      phase={S5.phase} audio={audio} onPrev={onPrev} onNext={onNext}
      nextDisabled={!solved || !audio.canAdvance}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gridTemplateRows: 'minmax(0, 1fr)', gap: 16, height: '100%' }}>
        <div className="card pad" style={{ display: 'flex', flexDirection: 'column' }}>
          <AudioGuide title={S5.guide[0]} sub={S5.guide[1]} playing={audio.isPlaying} />
          <div className="lists narrow" style={{ marginTop: 'var(--v4)' }}>
            <div className="number-box">
              <div className="number-title">16</div>
              <div className="chip-row">
                {[1, 2, 4, 8, 16].map((n) => <span key={n} className={chipCls(n)}>{n}</span>)}
              </div>
            </div>
            <div className="venn-link" aria-hidden="true">⇄</div>
            <div className="number-box">
              <div className="number-title">24</div>
              <div className="chip-row">
                {[1, 2, 4, 8, 12, 24].map((n) => <span key={n} className={chipCls(n)}>{n}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div className="card pad" style={{ display: 'flex', flexDirection: 'column' }}>
          <Tap done={solved}>{t(S5.tap)}</Tap>
          <div className="choices c2" style={{ marginTop: 'var(--v3)' }}>
            {[2, 4, 6, 8].map((n, i) => (
              <Choice key={n} i={i} label={n} disabled={solved}
                state={solved ? (n === 8 ? 'correct' : 'dim') : pick === n ? 'wrong' : ''}
                onPick={() => choose(n)} ariaLabel={String(n)} />
            ))}
          </div>
          <Feedback tone={solved ? 'right' : pick ? 'wrong' : ''} show={Boolean(pick)} style={{ marginTop: 'var(--v3)' }}>
            {pick ? t(S5.fb[pick]) : t(S5.wait)}
          </Feedback>
          <Yordam show={!solved && misses >= 2} text={S5.yordam} />
          <Reveal show={solved} className="s5-solution" style={{ marginTop: 'var(--v2)' }}>
            <div className="method-note stagger"><b>{t(S5.st1)}</b><p className="formula">1, 2, 4, 8</p></div>
            <div className="method-note stagger" style={{ marginTop: 'var(--v1)' }}><b>{t(S5.st2)}</b><p>{t(S5.st2p)}</p></div>
            <div className="rule-eq stagger">{w}(16; 24) = 8</div>
          </Reveal>
        </div>
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 6 — РАЗЛОЖЕНИЕ НА ПРОСТЫЕ МНОЖИТЕЛИ + ФАКТ ОБ ЕВКЛИДЕ
// ============================================================
const S6 = {
  eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
  title: { ru: 'Быстрый способ — разложение', uz: 'Tez usul — yoyilma' },
  phase: { ru: 'собери общие множители', uz: "umumiy ko'paytuvchilarni yig'ing" },
  tap: { ru: 'Нажмите результат', uz: 'Natijani bosing' },
  wait: { ru: 'Выберите произведение.', uz: "Ko'paytmani tanlang." },
  n1: { ru: 'Общие множители', uz: "Umumiy ko'paytuvchilar" },
  n1p: { ru: 'Одна двойка и одна тройка встречаются в обоих разложениях.', uz: "Bitta ikkilik va bitta uchlik ikkala yoyilmada ham uchraydi." },
  n2: { ru: 'Перемножаем только общие', uz: "Faqat umumiylarini ko'paytiramiz" },
  factBadge: { ru: 'Факт истории', uz: 'Tarixiy fakt' },
  fact: { ru: 'Евклид описал быстрый алгоритм НОД больше 2000 лет назад.', uz: "Evklid EKUB ning tez algoritmini 2000 yildan ko'proq vaqt oldin yozib qoldirgan." },
  fb: {
    4: { ru: '4 получилось бы из двух двоек, но в разложении 18 общая только одна двойка.', uz: "4 ikkita ikkilikdan chiqardi, lekin 18 ning yoyilmasida umumiy bitta ikkilik bor." },
    5: { ru: '5 не составляется из общих множителей 2 и 3.', uz: "5 ni umumiy ko'paytuvchilar 2 va 3 dan tuzib bo'lmaydi." },
    6: { ru: 'Верно: общие множители 2 и 3 дают 6.', uz: "To'g'ri: umumiy ko'paytuvchilar 2 va 3 oltini beradi." },
    9: { ru: '9 использует две тройки, но у 12 есть только одна тройка.', uz: "9 ikkita uchlikni oladi, lekin 12 da bitta uchlik bor." },
  },
  yordam: { ru: "Множитель берётся, только если он есть в обеих строках, и ровно столько раз, сколько его в более бедной строке.", uz: "Ko'paytuvchi faqat ikkala satrda ham bo'lsa olinadi, va u kamroq uchragan satrdagicha marta olinadi." },
  guide: [{ ru: 'Шаг 1. Сравните разложения', uz: '1-qadam. Yoyilmalarni solishtiring' }, { ru: 'Выберите произведение только общих множителей', uz: "Faqat umumiy ko'paytuvchilar ko'paytmasini tanlang" }],
  audio: {
    idle: {
      ru: ['Двенадцать это два умножить на два умножить на три. Восемнадцать это два умножить на три умножить на три.',
        'Сравните две строки и найдите множители, которые есть в обеих. Чему равен наибольший общий делитель?'],
      uz: ["O'n ikki bu ikki karra ikki karra uch. O'n sakkiz bu ikki karra uch karra uch.",
        "Ikkala satrni solishtiring va ikkalasida ham bor ko'paytuvchilarni toping. Eng katta umumiy bo'luvchi nechaga teng?"],
    },
    ok: {
      ru: ['Верно. Общая двойка есть и у двенадцати, и у восемнадцати.',
        'Общая тройка тоже есть в обеих строках.',
        'Перемножаем. Два умножить на три равно шести.',
        'И бонус. Евклид описал быстрый способ находить это число больше двух тысяч лет назад.'],
      uz: ["To'g'ri. Umumiy ikkilik o'n ikkida ham, o'n sakkizda ham bor.",
        "Umumiy uchlik ham ikkala satrda bor.",
        "Ko'paytiramiz. Ikki karra uch teng olti.",
        "Va bonus. Evklid bu sonni tez topish usulini ikki ming yildan ko'proq vaqt oldin yozib qoldirgan."],
    },
  },
};

function Screen06({ screen, onNext, onPrev, storedAnswer, onAnswer, recordTask, shell }) {
  const t = useT();
  const lang = useLang();
  const w = useGcd();
  const [pick, setPick] = useState(() => (storedAnswer && storedAnswer.pick) || null);
  const [solved, setSolved] = useState(() => Boolean(storedAnswer && storedAnswer.solved));
  const [fact, setFact] = useState(() => Boolean(storedAnswer && storedAnswer.solved));
  const [misses, setMisses] = useState(0);
  const tries = useRef(0);
  const base = useLines(S6.audio, solved ? 'ok' : 'idle');
  const vKey = solved ? 'ok' : pick ? 'w' + pick + (misses >= 2 ? 'h' : '') : 'idle';
  const audio = useVoice('s6_' + vKey,
    (!solved && pick) ? (misses >= 2 ? [S6.fb[pick][lang], S6.yordam[lang]] : [S6.fb[pick][lang]]) : base);

  // Бонус-факт открывается ПОСЛЕ решения, отдельным тактом.
  useEffect(() => {
    if (!solved || fact) return undefined;
    const id = setTimeout(() => setFact(true), 1450);
    return () => clearTimeout(id);
  }, [solved, fact]);

  const choose = (n) => {
    if (solved) return;
    tries.current += 1;
    setPick(n);
    if (n === 6) {
      setSolved(true);
      onAnswer({ screen: 6, kind: 'mc', pick: 6, solved: true, firstTry: tries.current === 1 });
      recordTask('s06', tries.current === 1);
    } else setMisses((m) => m + 1);
  };

  // Общие множители выделяются ТОЛЬКО после верного ответа: до этого сравнить
  // два разложения и найти общие множители — и есть задача экрана.
  const brick = (v, common, k) => (
    <span key={k} className={'brick' + (solved && common ? ' common picked' : '')}>{v}</span>
  );

  return (
    <Shell {...shell} screen={screen} section={SECTION.explain} eyebrow={S6.eyebrow} title={S6.title}
      phase={S6.phase} audio={audio} onPrev={onPrev} onNext={onNext}
      nextDisabled={!solved || !audio.canAdvance}>
      <div className="explore-layout">
        <div className="card explore-main">
          <AudioGuide title={S6.guide[0]} sub={S6.guide[1]} playing={audio.isPlaying} />
          <div className="factor-grid" style={{ marginTop: 'var(--v4)' }}>
            <div className="factor-line">
              <div className="formula big">12 =</div>
              <div className="bricks">{brick(2, true, 'a')}{brick(2, false, 'b')}{brick(3, true, 'c')}</div>
            </div>
            <div className="factor-line">
              <div className="formula big">18 =</div>
              <div className="bricks">{brick(2, true, 'd')}{brick(3, true, 'e')}{brick(3, false, 'f')}</div>
            </div>
          </div>
          <Reveal show={solved} style={{ marginTop: 'var(--v3)' }}>
            <div className="method-note stagger"><b>{t(S6.n1)}</b><p>{t(S6.n1p)}</p></div>
            <div className="method-note stagger" style={{ marginTop: 'var(--v1)' }}><b>{t(S6.n2)}</b><p className="formula">2 · 3 = 6</p></div>
            <div className="rule-eq stagger" style={{ textAlign: 'center' }}>{w}(12; 18) = 6</div>
          </Reveal>
        </div>

        <div className="card explore-side">
          <Tap done={solved}>{t(S6.tap)}</Tap>
          <div className="choices c2" style={{ marginTop: 'var(--v3)' }}>
            {[4, 5, 6, 9].map((n, i) => (
              <Choice key={n} i={i} label={n} disabled={solved}
                state={solved ? (n === 6 ? 'correct' : 'dim') : pick === n ? 'wrong' : ''}
                onPick={() => choose(n)} ariaLabel={String(n)} />
            ))}
          </div>
          <Feedback tone={solved ? 'right' : pick ? 'wrong' : ''} show={Boolean(pick)} style={{ marginTop: 'var(--v2)' }}>
            {pick ? t(S6.fb[pick]) : t(S6.wait)}
          </Feedback>
          <Yordam show={!solved && misses >= 2} text={S6.yordam} />
          <Reveal show={fact} style={{ marginTop: 'var(--v2)' }}>
            <div className="fact">
              <div className="fact-badge">{t(S6.factBadge)}</div>
              <p>{t(S6.fact)}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 7 — ДВА СПОСОБА ДЛЯ НОД(84; 126)
// ============================================================
const S7 = {
  eyebrow: { ru: 'Два способа', uz: 'Ikki usul' },
  title: { ru: 'Какой способ выбрать?', uz: 'Qaysi usulni tanlash kerak?' },
  phase: { ru: 'ответ → сравнение → применение', uz: "javob → solishtirish → qo'llash" },
  tap: { ru: 'Нажмите способ', uz: 'Usulni bosing' },
  wait: { ru: 'Выберите способ.', uz: 'Usulni tanlang.' },
  opts: [
    { ru: 'выписать все делители', uz: "barcha bo'luvchilarni yozish" },
    { ru: 'разложить на множители', uz: "ko'paytuvchilarga ajratish" },
    { ru: 'угадать общий делитель', uz: "umumiy bo'luvchini taxmin qilish" },
  ],
  fb: [
    { ru: 'Списки сработают, но придётся проверять много чисел.', uz: "Ro'yxatlar ishlaydi, lekin ko'p sonni tekshirishga to'g'ri keladi." },
    { ru: 'Верно: для больших чисел разложение обычно короче.', uz: "To'g'ri: katta sonlar uchun yoyilma odatda qisqaroq." },
    { ru: 'Угадывание не доказывает, что найден именно наибольший делитель.', uz: "Taxmin qilish aynan eng katta bo'luvchi topilganini isbotlamaydi." },
  ],
  m1: { ru: 'Списки', uz: "Ro'yxatlar" },
  m1p: { ru: 'Надёжно для малых чисел: выписать оба списка и взять максимум.', uz: "Kichik sonlar uchun ishonchli: ikkala ro'yxatni yozib, eng kattasini olamiz." },
  m2: { ru: 'Разложение', uz: 'Yoyilma' },
  m2p: { ru: 'Быстро для больших чисел: перемножить общие простые множители.', uz: "Katta sonlar uchun tez: umumiy tub ko'paytuvchilarni ko'paytiramiz." },
  w1: { ru: 'способ 1', uz: '1-usul' },
  w2: { ru: 'способ 2', uz: '2-usul' },
  explain: {
    lists: { ru: 'Списки дают точный ответ, но для 84 и 126 придётся выписать много делителей.', uz: "Ro'yxatlar aniq javob beradi, lekin 84 va 126 uchun ko'p bo'luvchi yozishga to'g'ri keladi." },
    factors: { ru: '84 = 2² · 3 · 7; 126 = 2 · 3² · 7 → общие 2 · 3 · 7 = 42.', uz: "84 = 2² · 3 · 7; 126 = 2 · 3² · 7 → umumiylari 2 · 3 · 7 = 42." },
  },
  yordam: { ru: "Прикиньте объём работы: сколько делителей придётся выписать у 84 и у 126 — и сколько простых множителей у каждого.", uz: "Ish hajmini chamalang: 84 va 126 uchun nechta bo'luvchi yozish kerak va har birida nechta tub ko'paytuvchi bor." },
  guide: [{ ru: 'Для больших чисел нужен короткий путь', uz: 'Katta sonlar uchun qisqa yo\'l kerak' }, { ru: 'Как удобнее найти НОД(84; 126)?', uz: 'EKUB(84; 126) ni qanday topish qulayroq?' }],
  audio: {
    idle: { ru: ['Числа стали больше. Восемьдесят четыре и сто двадцать шесть. Какой способ здесь удобнее?'], uz: ["Sonlar kattalashdi. Sakson to'rt va bir yuz yigirma olti. Bu yerda qaysi usul qulayroq?"] },
    ok: {
      ru: ['Верно. Списки надёжны, но для больших чисел они слишком длинные.',
        'Восемьдесят четыре это два в квадрате умножить на три умножить на семь.',
        'Сто двадцать шесть это два умножить на три в квадрате умножить на семь.',
        'Общие множители два, три и семь. Их произведение сорок два.'],
      uz: ["To'g'ri. Ro'yxatlar ishonchli, lekin katta sonlar uchun juda uzun.",
        "Sakson to'rt bu ikki kvadrati karra uch karra yetti.",
        "Bir yuz yigirma olti bu ikki karra uch kvadrati karra yetti.",
        "Umumiy ko'paytuvchilar ikki, uch va yetti. Ularning ko'paytmasi qirq ikki."],
    },
  },
};

function Screen07({ screen, onNext, onPrev, storedAnswer, onAnswer, recordTask, shell }) {
  const t = useT();
  const lang = useLang();
  const w = useGcd();
  const [pick, setPick] = useState(() => (storedAnswer && typeof storedAnswer.pick === 'number' ? storedAnswer.pick : null));
  const [solved, setSolved] = useState(() => Boolean(storedAnswer && storedAnswer.solved));
  const [method, setMethod] = useState('factors');
  const [misses, setMisses] = useState(0);
  const tries = useRef(0);
  const base = useLines(S7.audio, solved ? 'ok' : 'idle');
  const vKey = solved ? 'ok' : pick !== null ? 'w' + pick + (misses >= 2 ? 'h' : '') : 'idle';
  const audio = useVoice('s7_' + vKey,
    (!solved && pick !== null) ? (misses >= 2 ? [S7.fb[pick][lang], S7.yordam[lang]] : [S7.fb[pick][lang]]) : base);

  const choose = (i) => {
    if (solved) return;
    tries.current += 1;
    setPick(i);
    if (i === 1) {
      setSolved(true);
      onAnswer({ screen: 7, kind: 'mc', pick: 1, solved: true, firstTry: tries.current === 1 });
      recordTask('s07', tries.current === 1);
    } else setMisses((m) => m + 1);
  };

  return (
    <Shell {...shell} screen={screen} section={SECTION.rule} eyebrow={S7.eyebrow} title={S7.title}
      phase={S7.phase} audio={audio} onPrev={onPrev} onNext={onNext}
      nextDisabled={!solved || !audio.canAdvance}>
      <div className="rule-grid">
        <div className="card rule-gate">
          <AudioGuide title={S7.guide[0]} sub={S7.guide[1]} playing={audio.isPlaying} />
          <Tap done={solved} style={{ margin: 'var(--v4) 0 var(--v2)' }}>{t(S7.tap)}</Tap>
          <div className="action-list" style={{ marginTop: 0 }}>
            {S7.opts.map((o, i) => (
              <button key={i} type="button" onClick={() => choose(i)} disabled={solved}
                className={'action' + (solved ? (i === 1 ? ' done' : '') : pick === i ? ' wrong' : '')}
                aria-label={t(o)}>
                {t(o)}
              </button>
            ))}
          </div>
          <Feedback tone={solved ? 'right' : pick !== null ? 'wrong' : ''} show={pick !== null} style={{ marginTop: 'var(--v2)' }}>
            {pick !== null ? t(S7.fb[pick]) : t(S7.wait)}
          </Feedback>
          <Yordam show={!solved && misses >= 2} text={S7.yordam} />
        </div>

        <div className={'card rule-board reveal flat' + (solved ? ' show' : '')} aria-hidden={!solved}>
          <div className="method-grid">
            <button type="button" className={'method' + (method === 'lists' ? ' active' : '')}
              onClick={() => setMethod('lists')} aria-label={t(S7.m1)} aria-pressed={method === 'lists'}>
              <div className="label">{t(S7.w1)}</div>
              <h3>{t(S7.m1)}</h3>
              <p>{t(S7.m1p)}</p>
              <span className="formula">12, 18 → 1, 2, 3, 6</span>
            </button>
            <button type="button" className={'method' + (method === 'factors' ? ' active' : '')}
              onClick={() => setMethod('factors')} aria-label={t(S7.m2)} aria-pressed={method === 'factors'}>
              <div className="label">{t(S7.w2)}</div>
              <h3>{t(S7.m2)}</h3>
              <p>{t(S7.m2p)}</p>
              <span className="formula">84, 126 → 2 · 3 · 7 = 42</span>
            </button>
          </div>
          <div className="feedback right show" style={{ marginTop: 'var(--v2)' }}>{t(S7.explain[method])}</div>
          <div className="rule-eq">{w}(84; 126) = 42</div>
        </div>
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 8 — ЛИШНЕЕ ЧИСЛО И ТРИ ПРАВИЛА ПРОВЕРКИ
// Заголовок макета «Какое число здесь лишнее?» не называл чисел — без 24 и 36
// экран нечитаем. Взята формулировка из ТЗ, остальное по макету.
// ============================================================
const S8 = {
  eyebrow: { ru: 'Общий делитель', uz: "Umumiy bo'luvchi" },
  title: { ru: 'Какое число не является общим делителем 24 и 36?', uz: "Qaysi son 24 va 36 ning umumiy bo'luvchisi emas?" },
  phase: { ru: 'проверь на оба числа', uz: 'ikkala songa tekshiring' },
  tap: { ru: 'Нажмите лишнее', uz: 'Ortiqchasini bosing' },
  tap2: { ru: 'Нажмите каждое правило', uz: 'Har bir qoidani bosing' },
  wait: { ru: 'Выберите число.', uz: 'Sonni tanlang.' },
  fb: {
    2: { ru: '2 делит оба: 24 : 2 = 12 и 36 : 2 = 18.', uz: "2 ikkalasini ham bo'ladi: 24 : 2 = 12 va 36 : 2 = 18." },
    3: { ru: '3 делит оба: 24 : 3 = 8 и 36 : 3 = 12.', uz: "3 ikkalasini ham bo'ladi: 24 : 3 = 8 va 36 : 3 = 12." },
    4: { ru: '4 делит оба: 24 : 4 = 6 и 36 : 4 = 9.', uz: "4 ikkalasini ham bo'ladi: 24 : 4 = 6 va 36 : 4 = 9." },
    5: { ru: 'Верно: ни 24, ни 36 не делятся на 5.', uz: "To'g'ri: na 24, na 36 beshga bo'linadi." },
    6: { ru: '6 делит оба: 24 : 6 = 4 и 36 : 6 = 6.', uz: "6 ikkalasini ham bo'ladi: 24 : 6 = 4 va 36 : 6 = 6." },
  },
  rules: [
    {
      name: { ru: '1 · Проверить первое число', uz: '1 · Birinchi sonni tekshirish' },
      fx: '24 = 5 · 4 + 4',
      body: { ru: '24 : 5 не является целым числом. Уже можно подозревать, что 5 не общий делитель.', uz: "24 : 5 butun son emas. Endi 5 umumiy bo'luvchi emasligiga shubha qilish mumkin." },
    },
    {
      name: { ru: '2 · Проверить второе число', uz: '2 · Ikkinchi sonni tekshirish' },
      fx: '36 = 5 · 7 + 1',
      body: { ru: '36 : 5 тоже даёт остаток. Число 5 не делит ни одно из двух.', uz: "36 : 5 ham qoldiq beradi. 5 soni ikkalasidan birortasini ham bo'lmaydi." },
    },
    {
      name: { ru: '3 · Сформулировать вывод', uz: '3 · Xulosa chiqarish' },
      fx: '24, 36 → 5',
      body: { ru: 'Общий делитель обязан делить оба числа без остатка. Поэтому лишнее число — 5.', uz: "Umumiy bo'luvchi ikkala sonni ham qoldiqsiz bo'lishi shart. Shuning uchun ortiqcha son — 5." },
    },
  ],
  eq: { ru: '24, 36 → 5 не общий делитель', uz: "24, 36 → 5 umumiy bo'luvchi emas" },
  yordam: { ru: "Делите 24 и 36 на каждый вариант по очереди. Ищите тот, что даёт остаток оба раза.", uz: "24 va 36 ni har bir variantga navbat bilan bo'ling. Ikkala marta ham qoldiq beradiganini qidiring." },
  guide: [{ ru: 'Не делит ни 24, ни 36', uz: "Na 24 ni, na 36 ni bo'ladi" }, { ru: 'После ответа откроются три правила проверки', uz: 'Javobdan keyin uchta tekshiruv qoidasi ochiladi' }],
  audio: {
    idle: { ru: ['Здесь пять чисел. Четыре из них общие делители двадцати четырёх и тридцати шести, одно нет.'], uz: ["Bu yerda beshta son bor. To'rttasi yigirma to'rt va o'ttiz oltining umumiy bo'luvchisi, bittasi esa yo'q."] },
    r0: { ru: ['Верно, это пять. Теперь откройте три правила по порядку. Нажмите первое.'], uz: ["To'g'ri, bu besh. Endi uchta qoidani tartib bilan oching. Birinchisini bosing."] },
    r1: { ru: ['Правило первое. Делим двадцать четыре на пять. Выходит четыре и остаток четыре. Нажмите второе правило.'], uz: ["Birinchi qoida. Yigirma to'rtni beshga bo'lamiz. To'rt chiqadi va to'rt qoldiq qoladi. Ikkinchi qoidani bosing."] },
    r2: { ru: ['Правило второе. Делим тридцать шесть на пять. Выходит семь и остаток один. Нажмите третье правило.'], uz: ["Ikkinchi qoida. O'ttiz oltini beshga bo'lamiz. Yetti chiqadi va bir qoldiq qoladi. Uchinchi qoidani bosing."] },
    r3: { ru: ['Правило третье. Общий делитель обязан делить оба числа без остатка. Поэтому пять здесь лишнее.'], uz: ["Uchinchi qoida. Umumiy bo'luvchi ikkala sonni ham qoldiqsiz bo'lishi shart. Shuning uchun besh bu yerda ortiqcha."] },
  },
};

function Screen08({ screen, onNext, onPrev, storedAnswer, onAnswer, recordTask, shell }) {
  const t = useT();
  const lang = useLang();
  const [pick, setPick] = useState(() => (storedAnswer && storedAnswer.pick) || null);
  const [solved, setSolved] = useState(() => Boolean(storedAnswer && storedAnswer.solved));
  const [open, setOpen] = useState(() => (storedAnswer && storedAnswer.open) || 0);
  const [misses, setMisses] = useState(0);
  const tries = useRef(0);
  const base = useLines(S8.audio, solved ? 'r' + open : 'idle');
  const vKey = solved ? 'r' + open : pick ? 'w' + pick + (misses >= 2 ? 'h' : '') : 'idle';
  const audio = useVoice('s8_' + vKey,
    (!solved && pick) ? (misses >= 2 ? [S8.fb[pick][lang], S8.yordam[lang]] : [S8.fb[pick][lang]]) : base);

  const choose = (n) => {
    if (solved) return;
    tries.current += 1;
    setPick(n);
    if (n === 5) {
      setSolved(true);
      onAnswer({ screen: 8, kind: 'mc', pick: 5, solved: true, open: 0, firstTry: tries.current === 1 });
      recordTask('s08', tries.current === 1);
    } else setMisses((m) => m + 1);
  };
  const openRule = (i) => {
    if (i !== open + 1) return;
    setOpen(i);
    onAnswer({ screen: 8, kind: 'mc', pick: 5, solved: true, open: i, firstTry: tries.current === 1 });
  };

  return (
    <Shell {...shell} screen={screen} section={SECTION.practice} eyebrow={S8.eyebrow} title={S8.title}
      phase={S8.phase} audio={audio} onPrev={onPrev} onNext={onNext}
      nextDisabled={!solved || open < 3 || !audio.canAdvance}>
      <div style={{ display: 'grid', gridTemplateColumns: '0.72fr 1.28fr', gridTemplateRows: 'minmax(0, 1fr)', gap: 16, height: '100%' }}>
        <div className="card pad" style={{ display: 'flex', flexDirection: 'column' }}>
          <AudioGuide title={S8.guide[0]} sub={S8.guide[1]} playing={audio.isPlaying} />
          <Tap done={solved} style={{ margin: 'var(--v4) 0 var(--v2)' }}>{t(S8.tap)}</Tap>
          <div className="choices c5">
            {[2, 3, 4, 5, 6].map((n, i) => (
              <Choice key={n} i={i} label={n} disabled={solved}
                state={solved ? (n === 5 ? 'correct' : 'dim') : pick === n ? 'wrong' : ''}
                onPick={() => choose(n)} ariaLabel={String(n)} />
            ))}
          </div>
          <Feedback tone={solved ? 'right' : pick ? 'wrong' : ''} show={Boolean(pick)} style={{ marginTop: 'var(--v3)' }}>
            {pick ? t(S8.fb[pick]) : t(S8.wait)}
          </Feedback>
          <Yordam show={!solved && misses >= 2} text={S8.yordam} />
        </div>

        <div className={'card pad reveal flat' + (solved ? ' show' : '')} aria-hidden={!solved}>
          <Tap done={open >= 3} style={{ marginBottom: 'var(--v2)' }}>{t(S8.tap2)}</Tap>
          {S8.rules.map((r, i) => {
            const isOpen = open >= i + 1;
            const isNext = open + 1 === i + 1;
            return (
              <button key={i} type="button" className={'apply-rule' + (isOpen ? ' open' : '')}
                onClick={() => openRule(i + 1)} disabled={!isNext || !solved}
                aria-expanded={isOpen} aria-label={t(r.name)}>
                <b>{t(r.name)}<span className="formula" aria-hidden="true">{isOpen ? r.fx : '⌄'}</span></b>
                {isOpen && <span className="apply-detail">{t(r.body)}</span>}
              </button>
            );
          })}
          {open >= 3 && <div className="rule-eq">{t(S8.eq)}</div>}
        </div>
      </div>
    </Shell>
  );
}

// ============================================================
// СЕРИИ ИЗ ПЯТИ ЗАДАНИЙ (экраны 9-12 и 14)
// Один движок на все серии: рельс вкладок, карточка задания, боковая колонка
// с указателем, разбором и рельсом шагов. Следующее задание закрыто до верного
// ответа и открыть его напрямую нельзя.
// ============================================================
const SEQ_WAIT = { ru: 'Выберите ответ.', uz: 'Javobni tanlang.' };
const SEQ_WAIT_IN = { ru: 'Введите ответ.', uz: 'Javobni kiriting.' };
const SEQ_NEXT = { ru: 'Следующее задание →', uz: 'Keyingi topshiriq →' };
const CHECK_WORD = { ru: 'Проверить', uz: 'Tekshirish' };
const INPUT_PH = { ru: 'число', uz: 'son' };

// Общий каркас серии. `render` рисует рабочую зону конкретной серии.
const SeqFrame = ({
  shell, screen, section, eyebrow, title, phase, guide, audio,
  cur, done, tap, feedback, explain, steps, stepAt, onPrev, onNext, nextLabel, nextDisabled, children,
}) => {
  const t = useT();
  return (
    <Shell {...shell} screen={screen} section={section} eyebrow={eyebrow} title={title} phase={phase}
      audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={nextDisabled} nextLabel={nextLabel}>
      <div className="practice-sequence">
        <AudioGuide title={guide[0]} sub={guide[1]} playing={audio.isPlaying} />
        <SeqTabs current={cur} done={done} />
        <div className="card mix">
          <div className="mix-work">{children}</div>
          <div className="mix-side">
            <Tap done={done[cur]}>{t(tap)}</Tap>
            <Reveal show={done[cur]} style={{ marginTop: 'var(--v4)' }}>
              <div className="feedback right show">{t(explain)}</div>
            </Reveal>
            <div style={{ marginTop: 'var(--v4)' }}>
              <Stepbar steps={steps} at={stepAt} col />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

// Серия с выбором варианта.
function ChoiceSeq({ screen, tasks, meta, shell, storedAnswer, onAnswer, recordTask, onNext, onPrev, kind }) {
  const t = useT();
  const lang = useLang();
  const [cur, setCur] = useState(() => (storedAnswer && storedAnswer.cur) || 0);
  const [done, setDone] = useState(() => (storedAnswer && storedAnswer.done) || [false, false, false, false, false]);
  const [pick, setPick] = useState(null);
  const [misses, setMisses] = useState(0);
  const tries = useRef(0);
  const task = tasks[cur];
  const solved = done[cur];
  const hint = !solved && misses >= 2;
  const base = useLines(meta.audio, (solved ? 'a' : 'q') + cur);
  const wrongLine = (!solved && pick !== null) ? task.fb[pick][lang] : null;
  const audio = useVoice(
    meta.id + '_' + cur + '_' + (solved ? 'a' : pick !== null ? 'w' + pick + (hint ? 'h' : '') : 'q'),
    wrongLine ? (hint ? [wrongLine, meta.yordam[lang]] : [wrongLine]) : base,
  );

  const choose = (i) => {
    if (solved) return;
    tries.current += 1;
    setPick(i);
    if (i !== task.correct) { setMisses((m) => m + 1); return; }
    const nd = done.slice();
    nd[cur] = true;
    setDone(nd);
    onAnswer({ screen, kind, cur, done: nd, firstTry: tries.current === 1 });
    recordTask(meta.id + '_t' + cur, tries.current === 1);
  };
  const goNext = () => {
    if (!solved || cur >= 4) return;
    setPick(null); setMisses(0); tries.current = 0;
    setCur(cur + 1);
    onAnswer({ screen, kind, cur: cur + 1, done });
  };

  return (
    <SeqFrame shell={shell} screen={screen - 1} section={SECTION.practice} eyebrow={meta.eyebrow}
      title={meta.title} phase={meta.phase} guide={meta.guide} audio={audio}
      cur={cur} done={done} tap={meta.tap} explain={task.explain} steps={meta.steps}
      stepAt={solved ? 2 : 0} onPrev={onPrev}
      onNext={solved && cur < 4 ? goNext : onNext}
      nextLabel={solved && cur < 4 ? SEQ_NEXT : undefined}
      nextDisabled={!solved || !audio.canAdvance}>
      <span className="label">{t(task.category)}</span>
      <div className={'formula ' + (t(task.prompt).length > 18 ? 'big' : 'huge')} style={{ margin: 'var(--v4) 0' }}>
        {t(task.prompt)}
      </div>
      <div className="choices c2">
        {task.options.map((o, i) => (
          <Choice key={i} i={i} label={t(o)} disabled={solved}
            state={solved ? (i === task.correct ? 'correct' : 'dim') : pick === i ? 'wrong' : ''}
            onPick={() => choose(i)} ariaLabel={t(o)} />
        ))}
      </div>
      <Feedback tone={solved ? 'right' : pick !== null ? 'wrong' : ''} show={pick !== null} style={{ marginTop: 'var(--v3)' }}>
        {pick !== null ? t(task.fb[pick]) : t(SEQ_WAIT)}
      </Feedback>
      <Yordam show={hint} text={meta.yordam} />
    </SeqFrame>
  );
}

// Серия с вводом числа. В подсказке поля стоит слово «число», не ответ.
function InputSeq({ screen, tasks, meta, shell, storedAnswer, onAnswer, recordTask, onNext, onPrev }) {
  const t = useT();
  const lang = useLang();
  const [cur, setCur] = useState(() => (storedAnswer && storedAnswer.cur) || 0);
  const [done, setDone] = useState(() => (storedAnswer && storedAnswer.done) || [false, false, false, false, false]);
  const [val, setVal] = useState('');
  const [bad, setBad] = useState(false);
  const [misses, setMisses] = useState(0);
  const tries = useRef(0);
  const task = tasks[cur];
  const solved = done[cur];
  const hint = !solved && misses >= 2;
  const base = useLines(meta.audio, (solved ? 'a' : 'q') + cur);
  const audio = useVoice(
    meta.id + '_' + cur + '_' + (solved ? 'a' : bad ? 'w' + (hint ? 'h' : '') : 'q'),
    (!solved && bad) ? (hint ? [task.hint[lang], meta.yordam[lang]] : [task.hint[lang]]) : base,
  );

  const check = () => {
    if (solved || !val) return;
    tries.current += 1;
    if (val.trim() !== task.answer) { setBad(true); setMisses((m) => m + 1); return; }
    setBad(false);
    const nd = done.slice();
    nd[cur] = true;
    setDone(nd);
    onAnswer({ screen, kind: 'input', cur, done: nd, firstTry: tries.current === 1 });
    recordTask(meta.id + '_t' + cur, tries.current === 1);
  };
  const goNext = () => {
    if (!solved || cur >= 4) return;
    setVal(''); setBad(false); setMisses(0); tries.current = 0;
    setCur(cur + 1);
    onAnswer({ screen, kind: 'input', cur: cur + 1, done });
  };

  return (
    <SeqFrame shell={shell} screen={screen - 1} section={SECTION.practice} eyebrow={meta.eyebrow}
      title={meta.title} phase={meta.phase} guide={meta.guide} audio={audio}
      cur={cur} done={done} tap={meta.tap} explain={task.explain} steps={meta.steps}
      stepAt={solved ? 2 : 0} onPrev={onPrev}
      onNext={solved && cur < 4 ? goNext : onNext}
      nextLabel={solved && cur < 4 ? SEQ_NEXT : undefined}
      nextDisabled={!solved || !audio.canAdvance}>
      <span className="label">{t(task.category)}</span>
      <div className="formula big" style={{ margin: 'var(--v4) 0' }}>{t(task.prompt)}</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input className="input" inputMode="numeric" value={solved ? task.answer : val}
          onChange={(e) => setVal(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
          onKeyDown={(e) => { if (e.key === 'Enter') check(); }}
          placeholder={t(INPUT_PH)} disabled={solved} aria-label={t(meta.tap)} />
        <button type="button" className="primary" onClick={check} disabled={solved || !val}
          aria-label={t(CHECK_WORD)}>{t(CHECK_WORD)}</button>
      </div>
      <Feedback tone={solved ? 'right' : bad ? 'wrong' : ''} show={solved || bad} style={{ marginTop: 'var(--v3)' }}>
        {solved ? t(task.explain) : bad ? t(task.hint) : t(SEQ_WAIT_IN)}
      </Feedback>
      <Yordam show={hint} text={meta.yordam} />
    </SeqFrame>
  );
}

const EX = (n) => ({ ru: 'пример ' + n + ' из 5', uz: '5 tadan ' + n + '-misol' });

// ---------- экран 9: взаимно простые ----------
const OPT_EQ = { ru: 'НОД = 1', uz: 'EKUB = 1' };
const OPT_GT = { ru: 'НОД > 1', uz: 'EKUB > 1' };
const S9 = {
  id: 's9',
  eyebrow: { ru: 'Серия 1', uz: '1-seriya' },
  title: { ru: 'Взаимно простые: пять проверок', uz: "O'zaro tub: beshta tekshiruv" },
  phase: { ru: 'следующий только после верного', uz: "keyingisi faqat to'g'ridan keyin" },
  tap: { ru: 'Нажмите ответ', uz: 'Javobni bosing' },
  yordam: { ru: "Переберите маленькие делители: 2, 3, 5, 7. Если ни один не делит оба числа, наибольший общий делитель равен единице.", uz: "Kichik bo'luvchilarni sinab ko'ring: 2, 3, 5, 7. Agar birortasi ikkala sonni ham bo'lmasa, eng katta umumiy bo'luvchi birga teng." },
  guide: [{ ru: 'Определите, равен ли НОД единице', uz: 'EKUB birga tengmi, aniqlang' }, { ru: 'После ответа озвучка объяснит проверку', uz: 'Javobdan keyin ovoz tekshiruvni tushuntiradi' }],
  steps: [
    { ru: '1 · найти общий', uz: '1 · umumiyni topish' },
    { ru: '2 · сравнить с 1', uz: '2 · bir bilan solishtirish' },
    { ru: '3 · сделать вывод', uz: '3 · xulosa chiqarish' },
  ],
  audio: {
    q0: { ru: ['Восемь и девять. Есть ли у них общий делитель больше единицы?'], uz: ["Sakkiz va to'qqiz. Ularning birdan katta umumiy bo'luvchisi bormi?"] },
    q1: { ru: ['Шесть и десять. Проверьте.'], uz: ["Olti va o'n. Tekshiring."] },
    q2: { ru: ['Семь и двенадцать. Проверьте.'], uz: ["Yetti va o'n ikki. Tekshiring."] },
    q3: { ru: ['Четырнадцать и двадцать один. Проверьте.'], uz: ["O'n to'rt va yigirma bir. Tekshiring."] },
    q4: { ru: ['Девять и пятнадцать. Последняя пара.'], uz: ["To'qqiz va o'n besh. Oxirgi juftlik."] },
    a0: { ru: ['Верно. Общий делитель только один, значит числа взаимно простые.'], uz: ["To'g'ri. Umumiy bo'luvchi faqat bir, demak sonlar o'zaro tub."] },
    a1: { ru: ['Верно. Оба числа делятся на два, поэтому наибольший общий делитель равен двум.'], uz: ["To'g'ri. Ikkala son ham ikkiga bo'linadi, shuning uchun eng katta umumiy bo'luvchi ikkiga teng."] },
    a2: { ru: ['Верно. Семь простое, а двенадцать на семь не делится.'], uz: ["To'g'ri. Yetti tub son, o'n ikki esa yettiga bo'linmaydi."] },
    a3: { ru: ['Верно. Оба числа делятся на семь, наибольший общий делитель равен семи.'], uz: ["To'g'ri. Ikkala son ham yettiga bo'linadi, eng katta umumiy bo'luvchi yettiga teng."] },
    a4: { ru: ['Верно. Оба числа делятся на три. Пять проверок пройдено.'], uz: ["To'g'ri. Ikkala son ham uchga bo'linadi. Beshta tekshiruv bajarildi."] },
  },
};
const S9_TASKS = [
  { category: EX(1), prompt: { ru: '8 и 9', uz: "8 va 9" }, options: [OPT_EQ, OPT_GT], correct: 0,
    explain: { ru: 'Общий делитель только 1 → числа взаимно простые.', uz: "Umumiy bo'luvchi faqat 1 → sonlar o'zaro tub." },
    fb: [{ ru: 'Верно: у 8 и 9 общего, кроме 1, нет.', uz: "To'g'ri: 8 va 9 da 1 dan boshqa umumiysi yo'q." },
      { ru: '2 и 4 не делят 9, а 3 не делит 8.', uz: "2 va 4 to'qqizni bo'lmaydi, 3 esa sakkizni bo'lmaydi." }] },
  { category: EX(2), prompt: { ru: '6 и 10', uz: "6 va 10" }, options: [OPT_EQ, OPT_GT], correct: 1,
    explain: { ru: 'Оба числа делятся на 2 → НОД больше 1.', uz: "Ikkala son ham 2 ga bo'linadi → EKUB birdan katta." },
    fb: [{ ru: 'Проверьте число 2: оно делит оба.', uz: "2 sonini tekshiring: u ikkalasini ham bo'ladi." },
      { ru: 'Верно: общий делитель 2 уже больше 1.', uz: "To'g'ri: umumiy bo'luvchi 2 birdan katta." }] },
  { category: EX(3), prompt: { ru: '7 и 12', uz: "7 va 12" }, options: [OPT_EQ, OPT_GT], correct: 0,
    explain: { ru: 'У 7 и 12 нет общего делителя больше 1.', uz: "7 va 12 da birdan katta umumiy bo'luvchi yo'q." },
    fb: [{ ru: 'Верно: пара взаимно простая.', uz: "To'g'ri: juftlik o'zaro tub." },
      { ru: '7 не делит 12, а делители 12 не делят 7.', uz: "7 o'n ikkini bo'lmaydi, 12 ning bo'luvchilari esa yettini bo'lmaydi." }] },
  { category: EX(4), prompt: { ru: '14 и 21', uz: "14 va 21" }, options: [OPT_EQ, OPT_GT], correct: 1,
    explain: { ru: '14 и 21 делятся на 7 → НОД равен 7.', uz: "14 va 21 yettiga bo'linadi → EKUB yettiga teng." },
    fb: [{ ru: 'Оба числа делятся на 7.', uz: "Ikkala son ham yettiga bo'linadi." },
      { ru: 'Верно: НОД(14; 21) = 7.', uz: "To'g'ri: EKUB(14; 21) = 7." }] },
  { category: EX(5), prompt: { ru: '9 и 15', uz: "9 va 15" }, options: [OPT_EQ, OPT_GT], correct: 1,
    explain: { ru: 'Оба числа делятся на 3 → НОД равен 3.', uz: "Ikkala son ham uchga bo'linadi → EKUB uchga teng." },
    fb: [{ ru: 'Проверьте общий делитель 3.', uz: "Umumiy bo'luvchi 3 ni tekshiring." },
      { ru: 'Верно: НОД(9; 15) = 3.', uz: "To'g'ri: EKUB(9; 15) = 3." }] },
];

// ---------- экран 10: жизненные задачи ----------
const S10 = {
  id: 's10',
  eyebrow: { ru: 'Серия 2', uz: '2-seriya' },
  title: { ru: 'НОД в задачах: пять примеров', uz: 'Masalalarda EKUB: beshta misol' },
  phase: { ru: 'ввод → объяснение → следующий', uz: 'kiritish → izoh → keyingisi' },
  tap: { ru: 'Введите одно число', uz: 'Bitta sonni kiriting' },
  yordam: { ru: "Задача просит наибольшее число одинаковых частей. Это и есть наибольший общий делитель двух данных чисел.", uz: "Masala bir xil bo'laklarning eng ko'p sonini so'rayapti. Bu ikki sonning eng katta umumiy bo'luvchisi." },
  guide: [{ ru: 'Введите максимальное число одинаковых групп', uz: "Bir xil guruhlarning eng ko'p sonini kiriting" }, { ru: 'Следующий пример пока закрыт', uz: 'Keyingi misol hozircha yopiq' }],
  steps: [
    { ru: '1 · найти НОД', uz: '1 · EKUB ni topish' },
    { ru: '2 · проверить деление', uz: "2 · bo'lishni tekshirish" },
    { ru: '3 · назвать максимум', uz: "3 · eng kattasini aytish" },
  ],
  audio: {
    q0: { ru: ['Тридцать тысяч и сорок пять тысяч сум делят поровну. Введите наибольшее число групп.'], uz: ["O'ttiz ming va qirq besh ming so'm teng bo'linadi. Guruhlarning eng ko'p sonini kiriting."] },
    q1: { ru: ['Двадцать четыре красных и тридцать шесть синих предметов. Введите наибольшее число наборов.'], uz: ["Yigirma to'rtta qizil va o'ttiz oltita ko'k buyum. To'plamlarning eng ko'p sonini kiriting."] },
    q2: { ru: ['Ленты восемнадцать и сорок два метра. Введите наибольшую длину куска.'], uz: ["Lentalar o'n sakkiz va qirq ikki metr. Bo'lakning eng katta uzunligini kiriting."] },
    q3: { ru: ['Шестнадцать и сорок предметов. Введите наибольшее число коробок.'], uz: ["O'n olti va qirqta buyum. Qutilarning eng ko'p sonini kiriting."] },
    q4: { ru: ['Маршруты двадцать семь и тридцать шесть километров. Введите общий максимальный шаг.'], uz: ["Marshrutlar yigirma yetti va o'ttiz olti kilometr. Umumiy eng katta qadamni kiriting."] },
    a0: { ru: ['Верно, пятнадцать. Каждая группа получит две и три тысячи.'], uz: ["To'g'ri, o'n besh. Har bir guruh ikki va uch ming oladi."] },
    a1: { ru: ['Верно, двенадцать. В каждом наборе два красных и три синих предмета.'], uz: ["To'g'ri, o'n ikki. Har bir to'plamda ikkita qizil va uchta ko'k buyum bor."] },
    a2: { ru: ['Верно, шесть метров. Первая лента даст три куска, вторая семь.'], uz: ["To'g'ri, olti metr. Birinchi lenta uchta bo'lak, ikkinchisi yettita bo'lak beradi."] },
    a3: { ru: ['Верно, восемь коробок. В каждой два и пять предметов.'], uz: ["To'g'ri, sakkizta quti. Har birida ikkita va beshta buyum bor."] },
    a4: { ru: ['Верно, девять километров. Пять задач решены.'], uz: ["To'g'ri, to'qqiz kilometr. Beshta masala yechildi."] },
  },
};
const S10_TASKS = [
  { category: { ru: 'два счёта', uz: 'ikkita hisob' }, answer: '15',
    prompt: { ru: '30 и 45 тысяч → максимум групп?', uz: "30 va 45 ming → eng ko'pi nechta guruh?" },
    explain: { ru: 'НОД(30; 45) = 15: доли по 2 и 3 тысячи.', uz: "EKUB(30; 45) = 15: ulushlar 2 va 3 mingdan." },
    hint: { ru: 'Разложите 30 и 45; общие множители 3 и 5.', uz: "30 va 45 ni yoying; umumiy ko'paytuvchilar 3 va 5." } },
  { category: { ru: 'цветные наборы', uz: 'rangli to\'plamlar' }, answer: '12',
    prompt: { ru: '24 красных и 36 синих → максимум наборов?', uz: "24 qizil va 36 ko'k → eng ko'pi nechta to'plam?" },
    explain: { ru: 'НОД(24; 36) = 12: в наборе 2 красных и 3 синих.', uz: "EKUB(24; 36) = 12: to'plamda 2 qizil va 3 ko'k." },
    hint: { ru: 'Оба числа делятся на 12.', uz: "Ikkala son ham 12 ga bo'linadi." } },
  { category: { ru: 'две ленты', uz: 'ikkita lenta' }, answer: '6',
    prompt: { ru: '18 м и 42 м → максимальная длина куска?', uz: "18 m va 42 m → bo'lakning eng katta uzunligi?" },
    explain: { ru: 'НОД(18; 42) = 6 метров.', uz: "EKUB(18; 42) = 6 metr." },
    hint: { ru: 'Общие делители включают 2, 3 и 6.', uz: "Umumiy bo'luvchilar orasida 2, 3 va 6 bor." } },
  { category: { ru: 'две партии', uz: 'ikkita partiya' }, answer: '8',
    prompt: { ru: '16 и 40 предметов → максимум коробок?', uz: "16 va 40 buyum → eng ko'pi nechta quti?" },
    explain: { ru: 'НОД(16; 40) = 8 коробок.', uz: "EKUB(16; 40) = 8 quti." },
    hint: { ru: 'Проверьте делитель 8 для обоих чисел.', uz: "Ikkala son uchun 8 bo'luvchisini tekshiring." } },
  { category: { ru: 'два маршрута', uz: 'ikkita marshrut' }, answer: '9',
    prompt: { ru: '27 и 36 км → общий максимальный шаг?', uz: "27 va 36 km → umumiy eng katta qadam?" },
    explain: { ru: 'НОД(27; 36) = 9 километров.', uz: "EKUB(27; 36) = 9 kilometr." },
    hint: { ru: 'Оба числа делятся на 9.', uz: "Ikkala son ham 9 ga bo'linadi." } },
];

// ---------- экран 11: короткий случай ----------
const S11 = {
  id: 's11',
  eyebrow: { ru: 'Серия 3', uz: '3-seriya' },
  title: { ru: 'Короткий случай: пять пар', uz: 'Qisqa holat: beshta juftlik' },
  phase: { ru: 'сначала проверяем делимость', uz: "avval bo'linishni tekshiramiz" },
  tap: { ru: 'Нажмите НОД', uz: 'EKUB ni bosing' },
  yordam: { ru: "Разделите большее число на меньшее. Если остатка нет, ответом будет меньшее число.", uz: "Katta sonni kichigiga bo'ling. Agar qoldiq bo'lmasa, javob kichik son bo'ladi." },
  guide: [{ ru: 'Если большее делится на меньшее, ответ готов', uz: "Katta son kichigiga bo'linsa, javob tayyor" }, { ru: 'Выберите НОД текущей пары', uz: 'Joriy juftlikning EKUB ini tanlang' }],
  steps: [
    { ru: '1 · разделить большее', uz: "1 · kattasini bo'lish" },
    { ru: '2 · увидеть нулевой остаток', uz: "2 · qoldiq nolligini ko'rish" },
    { ru: '3 · взять меньшее', uz: '3 · kichigini olish' },
  ],
  audio: {
    q0: { ru: ['Шесть и восемнадцать. Делится ли большее на меньшее?'], uz: ["Olti va o'n sakkiz. Katta son kichigiga bo'linadimi?"] },
    q1: { ru: ['Семь и тридцать пять. Проверьте.'], uz: ["Yetti va o'ttiz besh. Tekshiring."] },
    q2: { ru: ['Восемь и тридцать два. Проверьте.'], uz: ["Sakkiz va o'ttiz ikki. Tekshiring."] },
    q3: { ru: ['Девять и сорок пять. Проверьте.'], uz: ["To'qqiz va qirq besh. Tekshiring."] },
    q4: { ru: ['Двенадцать и шестьдесят. Последний случай.'], uz: ["O'n ikki va oltmish. Oxirgi holat."] },
    a0: { ru: ['Верно. Восемнадцать делится на шесть и выходит три, поэтому ответ равен меньшему числу.'], uz: ["To'g'ri. O'n sakkizni oltiga bo'lsak uch chiqadi, shuning uchun javob kichik songa teng."] },
    a1: { ru: ['Верно. Тридцать пять делится на семь и выходит пять.'], uz: ["To'g'ri. O'ttiz beshni yettiga bo'lsak besh chiqadi."] },
    a2: { ru: ['Верно. Тридцать два делится на восемь и выходит четыре.'], uz: ["To'g'ri. O'ttiz ikkini sakkizga bo'lsak to'rt chiqadi."] },
    a3: { ru: ['Верно. Сорок пять делится на девять и выходит пять.'], uz: ["To'g'ri. Qirq beshni to'qqizga bo'lsak besh chiqadi."] },
    a4: { ru: ['Верно. Шестьдесят делится на двенадцать и выходит пять. Правило работает всегда, когда большее делится на меньшее.'], uz: ["To'g'ri. Oltmishni o'n ikkiga bo'lsak besh chiqadi. Bu qoida katta son kichigiga bo'linganda doim ishlaydi."] },
  },
};
const num = (v) => ({ ru: String(v), uz: String(v) });
const gcdPrompt = (a, b) => ({ ru: 'НОД(' + a + '; ' + b + ')', uz: 'EKUB(' + a + '; ' + b + ')' });
const S11_TASKS = [
  { category: EX(1), prompt: gcdPrompt(6, 18), options: [num(6), num(3), num(1), num(18)], correct: 0,
    explain: { ru: '18 : 6 = 3 → НОД равен меньшему числу 6.', uz: "18 : 6 = 3 → EKUB kichik son 6 ga teng." },
    fb: [{ ru: 'Верно: большее делится на меньшее.', uz: "To'g'ri: katta son kichigiga bo'linadi." },
      { ru: '3 общий, но 6 больше.', uz: "3 umumiy, lekin 6 kattaroq." },
      { ru: 'Есть общий делитель 6.', uz: "Umumiy bo'luvchi 6 bor." },
      { ru: 'НОД не может быть больше меньшего числа.', uz: "EKUB kichik sondan katta bo'lolmaydi." }] },
  { category: EX(2), prompt: gcdPrompt(7, 35), options: [num(7), num(5), num(1), num(35)], correct: 0,
    explain: { ru: '35 : 7 = 5 → НОД равен 7.', uz: "35 : 7 = 5 → EKUB yettiga teng." },
    fb: [{ ru: 'Верно: короткий случай.', uz: "To'g'ri: qisqa holat." },
      { ru: '7 не делится на 5.', uz: "7 beshga bo'linmaydi." },
      { ru: 'Есть общий делитель 7.', uz: "Umumiy bo'luvchi 7 bor." },
      { ru: 'Ответ не может превышать 7.', uz: "Javob yettidan oshmaydi." }] },
  { category: EX(3), prompt: gcdPrompt(8, 32), options: [num(8), num(4), num(2), num(32)], correct: 0,
    explain: { ru: '32 : 8 = 4 → НОД равен 8.', uz: "32 : 8 = 4 → EKUB sakkizga teng." },
    fb: [{ ru: 'Верно: 8 делит оба числа.', uz: "To'g'ri: 8 ikkala sonni ham bo'ladi." },
      { ru: '4 общий, но 8 больше.', uz: "4 umumiy, lekin 8 kattaroq." },
      { ru: '2 общий, но не максимальный.', uz: "2 umumiy, lekin eng kattasi emas." },
      { ru: 'НОД не больше 8.', uz: "EKUB sakkizdan katta emas." }] },
  { category: EX(4), prompt: gcdPrompt(9, 45), options: [num(9), num(5), num(3), num(45)], correct: 0,
    explain: { ru: '45 : 9 = 5 → НОД равен 9.', uz: "45 : 9 = 5 → EKUB to'qqizga teng." },
    fb: [{ ru: 'Верно: 9 меньшее и делит 45.', uz: "To'g'ri: 9 kichigi va 45 ni bo'ladi." },
      { ru: '9 не делится на 5.', uz: "9 beshga bo'linmaydi." },
      { ru: '3 общий, но 9 больше.', uz: "3 umumiy, lekin 9 kattaroq." },
      { ru: 'Ответ не больше 9.', uz: "Javob to'qqizdan katta emas." }] },
  { category: EX(5), prompt: gcdPrompt(12, 60), options: [num(12), num(6), num(4), num(60)], correct: 0,
    explain: { ru: '60 : 12 = 5 → НОД равен 12.', uz: "60 : 12 = 5 → EKUB o'n ikkiga teng." },
    fb: [{ ru: 'Верно: ответ виден сразу.', uz: "To'g'ri: javob darrov ko'rinadi." },
      { ru: '6 общий, но 12 больше.', uz: "6 umumiy, lekin 12 kattaroq." },
      { ru: '4 общий, но не максимальный.', uz: "4 umumiy, lekin eng kattasi emas." },
      { ru: 'НОД не больше 12.', uz: "EKUB o'n ikkidan katta emas." }] },
];

// ---------- экран 12: смешанные пары ----------
const S12 = {
  id: 's12',
  eyebrow: { ru: 'Серия 4', uz: '4-seriya' },
  title: { ru: 'Найди НОД: пять пар', uz: 'EKUB ni toping: beshta juftlik' },
  phase: { ru: 'пять заданий по очереди', uz: 'beshta topshiriq navbat bilan' },
  tap: { ru: 'Нажмите ответ', uz: 'Javobni bosing' },
  yordam: { ru: "Проверьте варианты по очереди: делит ли число оба числа пары. Из подошедших возьмите самый большой.", uz: "Variantlarni navbat bilan tekshiring: son juftlikdagi ikkala sonni ham bo'ladimi. To'g'ri kelganlaridan eng kattasini oling." },
  guide: [{ ru: 'Выберите НОД текущей пары', uz: 'Joriy juftlikning EKUB ini tanlang' }, { ru: 'После верного ответа увидите способ решения', uz: "To'g'ri javobdan keyin yechim usulini ko'rasiz" }],
  steps: [
    { ru: '1 · выбрать способ', uz: '1 · usulni tanlash' },
    { ru: '2 · найти общие', uz: '2 · umumiylarini topish' },
    { ru: '3 · взять максимум', uz: '3 · eng kattasini olish' },
  ],
  audio: {
    q0: { ru: ['Двенадцать и двадцать. Выберите ответ.'], uz: ["O'n ikki va yigirma. Javobni tanlang."] },
    q1: { ru: ['Девять и пятнадцать. Выберите ответ.'], uz: ["To'qqiz va o'n besh. Javobni tanlang."] },
    q2: { ru: ['Восемнадцать и тридцать. Выберите ответ.'], uz: ["O'n sakkiz va o'ttiz. Javobni tanlang."] },
    q3: { ru: ['Двадцать четыре и тридцать шесть. Выберите ответ.'], uz: ["Yigirma to'rt va o'ttiz olti. Javobni tanlang."] },
    q4: { ru: ['Двадцать пять и сорок. Последняя пара.'], uz: ["Yigirma besh va qirq. Oxirgi juftlik."] },
    a0: { ru: ['Верно, четыре. Общие делители это один, два и четыре.'], uz: ["To'g'ri, to'rt. Umumiy bo'luvchilar bir, ikki va to'rt."] },
    a1: { ru: ['Верно, три. Общие делители это один и три.'], uz: ["To'g'ri, uch. Umumiy bo'luvchilar bir va uch."] },
    a2: { ru: ['Верно, шесть. Общие множители два и три дают шесть.'], uz: ["To'g'ri, olti. Umumiy ko'paytuvchilar ikki va uch oltini beradi."] },
    a3: { ru: ['Верно, двенадцать. Общие множители дают два умножить на два умножить на три.'], uz: ["To'g'ri, o'n ikki. Umumiy ko'paytuvchilar ikki karra ikki karra uchni beradi."] },
    a4: { ru: ['Верно, пять. Общие делители это один и пять. Пять пар разобраны.'], uz: ["To'g'ri, besh. Umumiy bo'luvchilar bir va besh. Beshta juftlik ko'rib chiqildi."] },
  },
};
const S12_TASKS = [
  { category: EX(1), prompt: gcdPrompt(12, 20), options: [num(4), num(2), num(5), num(10)], correct: 0,
    explain: { ru: 'Общие делители 1, 2, 4 → НОД равен 4.', uz: "Umumiy bo'luvchilar 1, 2, 4 → EKUB to'rtga teng." },
    fb: [{ ru: 'Верно: максимум общего списка — 4.', uz: "To'g'ri: umumiy ro'yxatning eng kattasi — 4." },
      { ru: '2 общий, но 4 больше.', uz: "2 umumiy, lekin 4 kattaroq." },
      { ru: '12 не делится на 5.', uz: "12 beshga bo'linmaydi." },
      { ru: '12 не делится на 10.', uz: "12 o'nga bo'linmaydi." }] },
  { category: EX(2), prompt: gcdPrompt(9, 15), options: [num(1), num(3), num(5), num(9)], correct: 1,
    explain: { ru: 'Общие делители 1 и 3 → НОД равен 3.', uz: "Umumiy bo'luvchilar 1 va 3 → EKUB uchga teng." },
    fb: [{ ru: 'Есть общий делитель 3.', uz: "Umumiy bo'luvchi 3 bor." },
      { ru: 'Верно: НОД равен 3.', uz: "To'g'ri: EKUB uchga teng." },
      { ru: '9 не делится на 5.', uz: "9 beshga bo'linmaydi." },
      { ru: '15 не делится на 9.', uz: "15 to'qqizga bo'linmaydi." }] },
  { category: EX(3), prompt: gcdPrompt(18, 30), options: [num(9), num(3), num(6), num(12)], correct: 2,
    explain: { ru: 'Общие делители 1, 2, 3, 6 → НОД равен 6.', uz: "Umumiy bo'luvchilar 1, 2, 3, 6 → EKUB oltiga teng." },
    fb: [{ ru: '30 не делится на 9.', uz: "30 to'qqizga bo'linmaydi." },
      { ru: '3 общий, но 6 больше.', uz: "3 umumiy, lekin 6 kattaroq." },
      { ru: 'Верно: НОД равен 6.', uz: "To'g'ri: EKUB oltiga teng." },
      { ru: '18 не делится на 12.', uz: "18 o'n ikkiga bo'linmaydi." }] },
  { category: EX(4), prompt: gcdPrompt(24, 36), options: [num(6), num(18), num(24), num(12)], correct: 3,
    explain: { ru: '24 = 2³ · 3, 36 = 2² · 3² → общие 2² · 3 = 12.', uz: "24 = 2³ · 3, 36 = 2² · 3² → umumiylari 2² · 3 = 12." },
    fb: [{ ru: '6 общий, но 12 больше.', uz: "6 umumiy, lekin 12 kattaroq." },
      { ru: '24 не делится на 18.', uz: "24 o'n sakkizga bo'linmaydi." },
      { ru: '36 не делится на 24.', uz: "36 yigirma to'rtga bo'linmaydi." },
      { ru: 'Верно: НОД равен 12.', uz: "To'g'ri: EKUB o'n ikkiga teng." }] },
  { category: EX(5), prompt: gcdPrompt(25, 40), options: [num(5), num(10), num(15), num(20)], correct: 0,
    explain: { ru: 'Общие делители 1 и 5 → НОД равен 5.', uz: "Umumiy bo'luvchilar 1 va 5 → EKUB beshga teng." },
    fb: [{ ru: 'Верно: НОД равен 5.', uz: "To'g'ri: EKUB beshga teng." },
      { ru: '25 не делится на 10.', uz: "25 o'nga bo'linmaydi." },
      { ru: 'Ни одно не делится на 15.', uz: "Birortasi ham o'n beshga bo'linmaydi." },
      { ru: '25 не делится на 20.', uz: "25 yigirmaga bo'linmaydi." }] },
];

// ============================================================
// ЭКРАН 13 — КЛАССИФИКАЦИЯ ШЕСТИ ПАР И БОНУС-ФАКТ
// Бонус открывается только после полного верного распределения и занимает
// свой слот, поэтому ничего не перекрывает.
// ============================================================
const S13_PAIRS = [
  { a: 8, b: 9, bin: 'a', g: 1 },
  { a: 6, b: 10, bin: 'b', g: 2 },
  { a: 7, b: 12, bin: 'a', g: 1 },
  { a: 15, b: 20, bin: 'b', g: 5 },
  { a: 5, b: 9, bin: 'a', g: 1 },
  { a: 14, b: 21, bin: 'b', g: 7 },
];

const S13 = {
  eyebrow: { ru: 'Классификация', uz: 'Tasniflash' },
  title: { ru: 'Взаимно простые или нет?', uz: "O'zaro tub yoki yo'q?" },
  phase: { ru: '6 карточек', uz: '6 ta karta' },
  binA: { ru: 'НОД = 1', uz: 'EKUB = 1' },
  binB: { ru: 'НОД больше 1', uz: 'EKUB birdan katta' },
  yordam: { ru: "Переберите 2, 3, 5 и 7. Если хотя бы один делит оба числа пары, наибольший общий делитель больше единицы.", uz: "2, 3, 5 va 7 ni sinab ko'ring. Agar hech bo'lmaganda bittasi juftlikdagi ikkala sonni ham bo'lsa, eng katta umumiy bo'luvchi birdan katta." },
  guide: [{ ru: 'Для каждой пары выберите группу', uz: 'Har bir juftlik uchun guruhni tanlang' }, { ru: 'После полного ответа появятся объяснение и бонус-факт', uz: "To'liq javobdan keyin izoh va bonus fakt chiqadi" }],
  wrong: { ru: 'Не сюда: проверьте, есть ли общий делитель больше 1.', uz: "Bu yerga emas: birdan katta umumiy bo'luvchi bor yoki yo'qligini tekshiring." },
  count: { ru: 'Распределено', uz: 'Taqsimlandi' },
  of: { ru: 'из 6', uz: '6 tadan' },
  doneText: { ru: 'Верно. Пары с общим делителем 2, 5 и 7 находятся справа.', uz: "To'g'ri. Umumiy bo'luvchisi 2, 5 va 7 bo'lgan juftliklar o'ngda." },
  factBadge: { ru: 'Бонус к знаниям', uz: 'Bilimga bonus' },
  factText: { ru: 'НОД помогает сокращать дроби.', uz: 'EKUB kasrlarni qisqartirishga yordam beradi.' },
  factWhy: { ru: 'Делим числитель и знаменатель на их НОД.', uz: "Surat va maxrajni ularning EKUB iga bo'lamiz." },
  audio: {
    idle: { ru: ['Шесть пар и две группы. Для каждой пары нажмите нужную группу.'], uz: ["Oltita juftlik va ikkita guruh. Har bir juftlik uchun kerakli guruhni bosing."] },
    wrong: { ru: ['Не сюда. Проверьте, есть ли у пары общий делитель больше единицы.'], uz: ["Bu yerga emas. Juftlikda birdan katta umumiy bo'luvchi bor yoki yo'qligini tekshiring."] },
    done: {
      ru: ['Все пары разложены верно.',
        'Если наибольший общий делитель равен единице, числа называют взаимно простыми.',
        'И бонус. Наибольший общий делитель помогает сокращать дроби. Восемнадцать двадцать четвёртых делим на шесть и получаем три четвёртых.'],
      uz: ["Barcha juftliklar to'g'ri ajratildi.",
        "Agar eng katta umumiy bo'luvchi birga teng bo'lsa, sonlar o'zaro tub deyiladi.",
        "Va bonus. Eng katta umumiy bo'luvchi kasrlarni qisqartirishga yordam beradi. Yigirma to'rtdan o'n sakkizni oltiga bo'lsak, to'rtdan uch chiqadi."],
    },
  },
};

function Screen13({ screen, onNext, onPrev, storedAnswer, onAnswer, recordTask, shell }) {
  const t = useT();
  const lang = useLang();
  const [state, setState] = useState(() => (storedAnswer && storedAnswer.state) || S13_PAIRS.map(() => null));
  const [miss, setMiss] = useState({});
  const [misses, setMisses] = useState(0);
  const [fact, setFact] = useState(false);
  const tries = useRef(0);
  // Первая попытка считается ПО КАЖДОЙ паре: общий счётчик экрана здесь врал бы.
  const everMissed = useRef({});
  const placed = state.filter(Boolean).length;
  const allDone = placed === S13_PAIRS.length;
  const anyMiss = Object.keys(miss).length > 0;
  const hint = !allDone && misses >= 2;
  const key = allDone ? 'done' : anyMiss ? 'wrong' : 'idle';
  const baseLines = useLines(S13.audio, key);
  const yordamLine = S13.yordam[lang];
  const audio = useVoice('s13_' + key + '_' + placed + (hint ? '_h' : ''),
    hint && anyMiss ? [baseLines[0], yordamLine] : baseLines);

  useEffect(() => {
    if (!allDone || fact) return undefined;
    const id = setTimeout(() => setFact(true), 650);
    return () => clearTimeout(id);
  }, [allDone, fact]);

  const put = (i, bin) => {
    if (state[i]) return;
    tries.current += 1;
    if (bin !== S13_PAIRS[i].bin) {
      everMissed.current[i] = true;
      setMisses((m) => m + 1);
      setMiss({ ...miss, [i]: bin });
      return;
    }
    recordTask('s13_p' + i, !everMissed.current[i]);
    const ns = state.slice();
    ns[i] = bin;
    setState(ns);
    const nm = { ...miss }; delete nm[i]; setMiss(nm);
    onAnswer({ screen: 13, kind: 'classify', state: ns, firstTry: tries.current === S13_PAIRS.length });
  };

  const chips = (bin) => S13_PAIRS
    .map((p, i) => (state[i] === bin ? <span className="chip common" key={i}>{p.a} · {p.b}</span> : null))
    .filter(Boolean);

  return (
    <Shell {...shell} screen={screen} section={SECTION.practice} eyebrow={S13.eyebrow} title={S13.title}
      phase={S13.phase} audio={audio} onPrev={onPrev} onNext={onNext}
      nextDisabled={!allDone || !audio.canAdvance}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
        <AudioGuide title={S13.guide[0]} sub={S13.guide[1]} playing={audio.isPlaying} />
        <div className="class-cards">
          {S13_PAIRS.map((p, i) => {
            const ok = Boolean(state[i]);
            return (
              <div className={'class-card' + (ok ? ' done' : '')} key={i}>
                <span>{p.a} {t({ ru: 'и', uz: 'va' })} {p.b}</span>
                <span className="picks">
                  <button type="button" onClick={() => put(i, 'a')} disabled={ok}
                    className={ok && p.bin === 'a' ? 'hit' : miss[i] === 'a' ? 'miss' : ''}
                    aria-label={p.a + ' ' + p.b + ' ' + t(S13.binA)}>1</button>
                  <button type="button" onClick={() => put(i, 'b')} disabled={ok}
                    className={ok && p.bin === 'b' ? 'hit' : miss[i] === 'b' ? 'miss' : ''}
                    aria-label={p.a + ' ' + p.b + ' ' + t(S13.binB)}>›1</button>
                </span>
              </div>
            );
          })}
        </div>
        <div className="classify">
          <div className="bin"><h3>{t(S13.binA)}</h3><div className="chip-row">{chips('a')}</div></div>
          <div className="bin"><h3>{t(S13.binB)}</h3><div className="chip-row">{chips('b')}</div></div>
        </div>
        <Feedback tone={allDone ? 'right' : anyMiss ? 'wrong' : ''} show={placed > 0 || anyMiss}>
          {allDone ? t(S13.doneText) : anyMiss ? t(S13.wrong) : t(S13.count) + ' ' + placed + ' ' + t(S13.of) + '.'}
        </Feedback>
        <Yordam show={hint} text={S13.yordam} />
        <Reveal show={fact}>
          <div className="fact">
            <div className="fact-badge">{t(S13.factBadge)}</div>
            <p>
              <b>{t(S13.factText)}</b> <span className="formula">18/24 : 6 = 3/4</span>. {t(S13.factWhy)}
            </p>
          </div>
        </Reveal>
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 14 — ФИНАЛЬНЫЙ МИКС. Пять форматов подряд.
// Пометки о том, что баллы идут только на этом экране, здесь нет.
// ============================================================
const S14 = {
  id: 's14',
  eyebrow: { ru: 'Итог урока', uz: 'Dars yakuni' },
  title: { ru: 'Финальный микс: пять задач', uz: 'Yakuniy aralashma: beshta masala' },
  phase: { ru: 'всё главное в одном наборе', uz: "eng muhimi bitta to'plamda" },
  tap: { ru: 'Решите текущую задачу', uz: 'Joriy masalani yeching' },
  yordam: { ru: "Посмотрите на подпись над примером: она называет способ — списки, разложение, взаимно простые или короткий случай.", uz: "Misol ustidagi yozuvga qarang: u usulni aytadi — ro'yxatlar, yoyilma, o'zaro tub yoki qisqa holat." },
  guide: [{ ru: 'Решайте по одной задаче', uz: 'Masalalarni birma bir yeching' }, { ru: 'Следующая откроется только после правильного ответа', uz: "Keyingisi faqat to'g'ri javobdan keyin ochiladi" }],
  steps: [
    { ru: '1 · найти общие', uz: '1 · umumiylarini topish' },
    { ru: '2 · взять максимум', uz: '2 · eng kattasini olish' },
    { ru: '3 · проверить', uz: '3 · tekshirish' },
  ],
  audio: {
    q0: { ru: ['Задание первое. Наибольший общий делитель восемнадцати и двадцати четырёх.'], uz: ["Birinchi topshiriq. O'n sakkiz va yigirma to'rtning eng katta umumiy bo'luvchisi."] },
    q1: { ru: ['Задание второе. Сорок восемь и шестьдесят через простые множители.'], uz: ["Ikkinchi topshiriq. Qirq sakkiz va oltmish tub ko'paytuvchilar orqali."] },
    q2: { ru: ['Задание третье. Найдите пару взаимно простых чисел.'], uz: ["Uchinchi topshiriq. O'zaro tub sonlar juftligini toping."] },
    q3: { ru: ['Задание четвёртое. Семь и тридцать пять. Это короткий случай.'], uz: ["To'rtinchi topshiriq. Yetti va o'ttiz besh. Bu qisqa holat."] },
    q4: { ru: ['Задание пятое. Сорок и шестьдесят предметов.'], uz: ["Beshinchi topshiriq. Qirq va oltmishta buyum."] },
    a0: { ru: ['Верно, шесть. Общие делители это один, два, три и шесть.'], uz: ["To'g'ri, olti. Umumiy bo'luvchilar bir, ikki, uch va olti."] },
    a1: { ru: ['Верно, двенадцать. Общие множители дают два умножить на два умножить на три.'], uz: ["To'g'ri, o'n ikki. Umumiy ko'paytuvchilar ikki karra ikki karra uchni beradi."] },
    a2: { ru: ['Верно, восемь и девять. Общих делителей, кроме единицы, у них нет.'], uz: ["To'g'ri, sakkiz va to'qqiz. Ularning birdan boshqa umumiy bo'luvchisi yo'q."] },
    a3: { ru: ['Верно, семь. Тридцать пять делится на семь без остатка.'], uz: ["To'g'ri, yetti. O'ttiz besh yettiga qoldiqsiz bo'linadi."] },
    a4: { ru: ['Верно, двадцать наборов. Все пять заданий решены.'], uz: ["To'g'ri, yigirmata to'plam. Beshala topshiriq yechildi."] },
  },
};
const S14_TASKS = [
  { category: { ru: 'списки делителей', uz: "bo'luvchilar ro'yxati" }, prompt: { ru: 'НОД(18; 24) = ?', uz: 'EKUB(18; 24) = ?' },
    options: [num(6), num(3), num(8), num(12)], correct: 0,
    explain: { ru: 'Общие: 1, 2, 3, 6 → максимум 6.', uz: "Umumiylari: 1, 2, 3, 6 → eng kattasi 6." },
    fb: [{ ru: 'Верно: самый большой общий — 6.', uz: "To'g'ri: eng katta umumiy — 6." },
      { ru: '3 общий, но не самый большой.', uz: "3 umumiy, lekin eng kattasi emas." },
      { ru: '18 не делится на 8.', uz: "18 sakkizga bo'linmaydi." },
      { ru: '18 не делится на 12.', uz: "18 o'n ikkiga bo'linmaydi." }] },
  { category: { ru: 'простые множители', uz: "tub ko'paytuvchilar" }, prompt: { ru: 'НОД(48; 60) = ?', uz: 'EKUB(48; 60) = ?' },
    options: [num(12), num(6), num(4), num(24)], correct: 0,
    explain: { ru: '48 = 2⁴ · 3; 60 = 2² · 3 · 5 → 2² · 3 = 12.', uz: "48 = 2⁴ · 3; 60 = 2² · 3 · 5 → 2² · 3 = 12." },
    fb: [{ ru: 'Верно: общие 2 · 2 · 3 дают 12.', uz: "To'g'ri: umumiy 2 · 2 · 3 o'n ikkini beradi." },
      { ru: 'Вы взяли не все общие множители.', uz: "Barcha umumiy ko'paytuvchilarni olmadingiz." },
      { ru: 'Общая тройка тоже нужна.', uz: "Umumiy uchlik ham kerak." },
      { ru: '60 не делится на 24.', uz: "60 yigirma to'rtga bo'linmaydi." }] },
  { category: { ru: 'взаимно простые', uz: "o'zaro tub" }, prompt: { ru: 'Какая пара имеет НОД = 1?', uz: 'Qaysi juftlikda EKUB = 1?' },
    options: [{ ru: '8 и 9', uz: '8 va 9' }, { ru: '6 и 10', uz: '6 va 10' }, { ru: '15 и 20', uz: '15 va 20' }, { ru: '14 и 21', uz: '14 va 21' }], correct: 0,
    explain: { ru: 'У 8 и 9 общий делитель только 1.', uz: "8 va 9 ning umumiy bo'luvchisi faqat 1." },
    fb: [{ ru: 'Верно: 8 и 9 взаимно простые.', uz: "To'g'ri: 8 va 9 o'zaro tub." },
      { ru: 'Оба делятся на 2.', uz: "Ikkalasi ham ikkiga bo'linadi." },
      { ru: 'Оба делятся на 5.', uz: "Ikkalasi ham beshga bo'linadi." },
      { ru: 'Оба делятся на 7.', uz: "Ikkalasi ham yettiga bo'linadi." }] },
  { category: { ru: 'короткий случай', uz: 'qisqa holat' }, prompt: { ru: 'НОД(7; 35) = ?', uz: 'EKUB(7; 35) = ?' },
    options: [num(7), num(5), num(1), num(35)], correct: 0,
    explain: { ru: '35 делится на 7, поэтому НОД равен 7.', uz: "35 yettiga bo'linadi, shuning uchun EKUB yettiga teng." },
    fb: [{ ru: 'Верно: меньшее число делит большее.', uz: "To'g'ri: kichik son kattasini bo'ladi." },
      { ru: '7 не делится на 5.', uz: "7 beshga bo'linmaydi." },
      { ru: 'Есть общий делитель 7.', uz: "Umumiy bo'luvchi 7 bor." },
      { ru: 'НОД не может быть больше меньшего числа.', uz: "EKUB kichik sondan katta bo'lolmaydi." }] },
  { category: { ru: 'жизненная задача', uz: 'hayotiy masala' }, prompt: { ru: '40 и 60 предметов: максимум наборов?', uz: "40 va 60 buyum: eng ko'pi nechta to'plam?" },
    options: [num(20), num(10), num(15), num(30)], correct: 0,
    explain: { ru: 'НОД(40; 60) = 20 наборов.', uz: "EKUB(40; 60) = 20 to'plam." },
    fb: [{ ru: 'Верно: 20 одинаковых наборов.', uz: "To'g'ri: 20 ta bir xil to'plam." },
      { ru: 'Можно собрать больше наборов.', uz: "Ko'proq to'plam yig'ish mumkin." },
      { ru: '40 не делится на 15.', uz: "40 o'n beshga bo'linmaydi." },
      { ru: '40 не делится на 30.', uz: "40 o'ttizga bo'linmaydi." }] },
];

// ============================================================
// ЭКРАН 15 — ИТОГ УРОКА. Заметок нет, карточки выходят по очереди.
// ============================================================
const S15 = {
  eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi" },
  title: { ru: 'Что я изучил за урок', uz: "Darsda nimani o'rgandim" },
  phase: { ru: 'короткий итог с озвучкой', uz: 'ovoz bilan qisqa yakun' },
  guide: [{ ru: 'Соберём главное', uz: "Eng muhimini yig'amiz" }, { ru: 'Определение, два способа и быстрый случай', uz: "Ta'rif, ikki usul va tez holat" }],
  ready: { ru: 'готовность к следующей теме', uz: 'keyingi mavzuga tayyorlik' },
  passYes: { ru: 'Тема засчитана', uz: 'Mavzu hisobga olindi' },
  passNo: { ru: 'Нужно повторить тему', uz: 'Mavzuni takrorlash kerak' },
  ofTasks: { ru: 'верно с первой попытки', uz: "birinchi urinishda to'g'ri" },
  nextTopic: { ru: 'Наименьшее общее кратное', uz: 'Eng kichik umumiy karrali' },
  main: { ru: 'максимум для 12 и 18 — шесть человек.', uz: "12 va 18 uchun eng ko'pi olti kishi." },
  skills: [
    { text: { ru: 'Нахожу общие делители', uz: "Umumiy bo'luvchilarni topaman" }, fx: { ru: '12, 18 → 1, 2, 3, 6', uz: '12, 18 → 1, 2, 3, 6' } },
    { text: { ru: 'Выбираю самый большой', uz: 'Eng kattasini tanlayman' }, fx: { ru: 'НОД(12; 18) = 6', uz: 'EKUB(12; 18) = 6' } },
    { text: { ru: 'Использую разложение', uz: 'Yoyilmadan foydalanaman' }, fx: { ru: '2 · 3 = 6', uz: '2 · 3 = 6' } },
    { text: { ru: 'Узнаю взаимно простые', uz: "O'zaro tublarni taniyman" }, fx: { ru: 'НОД(8; 9) = 1', uz: 'EKUB(8; 9) = 1' } },
  ],
  audio: {
    a: {
      ru: ['Урок закончен. Коротко о том, что вы теперь умеете.',
        'Первое. Находить общие делители двух чисел.',
        'Второе. Выбирать из них самый большой.',
        'Третье. Пользоваться разложением, когда числа большие.',
        'Четвёртое. Узнавать взаимно простые числа.',
        'Главный результат урока. Наибольший общий делитель двенадцати и восемнадцати равен шести. Следующая тема это наименьшее общее кратное.'],
      uz: ["Dars tugadi. Endi nimalarni bilishingiz haqida qisqacha.",
        "Birinchi. Ikki sonning umumiy bo'luvchilarini topish.",
        "Ikkinchi. Ular ichidan eng kattasini tanlash.",
        "Uchinchi. Sonlar katta bo'lganda yoyilmadan foydalanish.",
        "To'rtinchi. O'zaro tub sonlarni tanish.",
        "Darsning asosiy natijasi. O'n ikki va o'n sakkizning eng katta umumiy bo'luvchisi oltiga teng. Keyingi mavzu eng kichik umumiy karrali."],
    },
  },
};

function Screen15({ screen, onPrev, finishLesson, shell, scorePercent, passed }) {
  const t = useT();
  const w = useGcd();
  const audio = useVoice('s15', useLines(S15.audio, 'a'));
  const [shown, setShown] = useState(0);

  // Карточки выходят по очереди вместе с озвучкой. При выключенном звуке
  // порядок сохраняется: таймер не зависит от TTS.
  useEffect(() => {
    const ids = [0, 1, 2, 3].map((i) => setTimeout(() => setShown((s) => Math.max(s, i + 1)), 450 + i * 850));
    return () => ids.forEach(clearTimeout);
  }, []);

  return (
    <Shell {...shell} screen={screen} section={SECTION.summary} eyebrow={S15.eyebrow} title={S15.title}
      phase={S15.phase} audio={audio} onPrev={onPrev} onNext={finishLesson}
      nextDisabled={false} nextLabel={FINISH_WORD}>
      <div className="summary">
        <div className="card summary-left">
          <AudioGuide title={S15.guide[0]} sub={S15.guide[1]} playing={audio.isPlaying} />
          <div className="skills">
            {S15.skills.map((s, i) => (
              <div className="skill" key={i} style={{ visibility: shown > i ? 'visible' : 'hidden' }}>
                <i aria-hidden="true">{i + 1}</i>
                <b>{t(s.text)}</b>
                <span className="formula">{t(s.fx)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card summary-right">
          {/* Кольцо показывает РЕАЛЬНЫЙ процент верных с первой попытки. Раньше
              оно было зелёным на все сто независимо от результата — индикатор
              врал. Порог зачёта 60 процентов, ниже кольцо оранжевое. */}
          <div className="ready-ring" role="img"
            aria-label={t(S15.ready) + ': ' + scorePercent + '%'}
            style={{ background: 'conic-gradient(' + (passed ? '#287B54' : '#E75A2C') + ' 0 ' + scorePercent + '%, #E2DED6 0)' }}>
            <i style={{ color: passed ? '#287B54' : '#A84B32' }}>{scorePercent}%</i>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="label">{t(S15.ready)}</div>
            <div className={'verdict' + (passed ? '' : ' low')}>{t(passed ? S15.passYes : S15.passNo)}</div>
            <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 'clamp(17px, min(1.68vw, 3vh), 23px)', fontWeight: 700, margin: 'var(--v1) 0' }}>
              {t(S15.nextTopic)}
            </h2>
            <div className="feedback right show">
              <span className="formula">{w}(12; 18) = 6</span> — {t(S15.main)}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ — default export (контракт платформы §1)
// ============================================================
export default function GcdLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    aiGradingEndpoint: aiGradingEndpoint || '',
    studentName: safeName,
    voiceGender: voiceGender || 'm',
  });
  const safeOnFinished = onFinished || ((payload) => { console.log('[Preview] onFinished payload:', payload); });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  // Итог считается по ЗАДАНИЯМ. Массив answers индексируется экраном, поэтому
  // на сериях из пяти он хранил только последнее задание: в отчёт попадало 12
  // записей вместо 36. Здесь каждое задание пишется под своим ключом и НЕ
  // перезаписывается — первая попытка фиксируется один раз.
  const [results, setResults] = useState({});
  const [notes, setNotes] = useState('');
  const [notesOpen, setNotesOpen] = useState(false);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers((prev) => { const next = prev.slice(); next[screenIdx] = data; return next; });
  }, []);

  const recordTask = useCallback((id, firstTry) => {
    setResults((prev) => (prev[id] ? prev : { ...prev, [id]: { firstTry: Boolean(firstTry) } }));
  }, []);

  // 36 оцениваемых заданий: по одному на экранах 4-8, по пять на 9-12 и 14,
  // шесть пар на 13. Экраны 1-3 не оцениваются: хук по ТЗ вне оценки, второй
  // экран объясняющий, третий — подстановка, где перебор 1, 2, 3 является
  // работой, а не ошибкой.
  const scored = Object.values(results);
  const firstTryCorrect = scored.filter((r) => r.firstTry).length;
  const scorePercent = Math.round((firstTryCorrect / TOTAL_TASKS) * 100);
  const passed = scorePercent >= PASS_PERCENT;

  const finishLesson = useCallback(() => {
    const done = Object.values(results);
    const correct = done.filter((r) => r.firstTry).length;
    const percent = Math.round((correct / TOTAL_TASKS) * 100);
    safeOnFinished({
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: TOTAL_TASKS,
      correctAnswers: correct,
      scorePercent: percent,
      finalScore: correct,
      finalTotal: TOTAL_TASKS,
      passed: percent >= PASS_PERCENT,
      firstTryStats: { total: done.length, firstTryCorrect: correct },
      answers: answers.filter(Boolean),
    });
  }, [answers, results, safeOnFinished]);

  // Защита от двойного касания: иначе один экран проскакивал бы мимо.
  const navLockRef = useRef(0);
  const navGuard = () => {
    const now = Date.now();
    if (now - navLockRef.current < 350) return false;
    navLockRef.current = now;
    return true;
  };
  const next = () => { if (navGuard()) setCurrent((s) => Math.min(s + 1, TOTAL_SCREENS - 1)); };
  const prev = () => { if (navGuard()) setCurrent((s) => Math.max(s - 1, 0)); };
  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  // Экран 1 (хук) при возврате начинается ЗАНОВО — требование ТЗ.
  // Остальные экраны сохраняют ответ.
  const stored = current === 0 ? undefined : answers[current];
  const shell = {
    notes: { value: notes, set: setNotes },
    notesOpen,
    onNotes: () => setNotesOpen((v) => !v),
  };
  const common = {
    screen: current, storedAnswer: stored, onAnswer: handleAnswer, recordTask,
    onNext: next, onPrev: prev, finishLesson, shell,
  };

  let body = null;
  if (current === 0) body = <Screen01 {...common} />;
  else if (current === 1) body = <Screen02 {...common} />;
  else if (current === 2) body = <Screen03 {...common} />;
  else if (current === 3) body = <Screen04 {...common} />;
  else if (current === 4) body = <Screen05 {...common} />;
  else if (current === 5) body = <Screen06 {...common} />;
  else if (current === 6) body = <Screen07 {...common} />;
  else if (current === 7) body = <Screen08 {...common} />;
  else if (current === 8) body = <ChoiceSeq {...common} screen={9} kind="coprime" meta={S9} tasks={S9_TASKS} />;
  else if (current === 9) body = <InputSeq {...common} screen={10} meta={S10} tasks={S10_TASKS} />;
  else if (current === 10) body = <ChoiceSeq {...common} screen={11} kind="short" meta={S11} tasks={S11_TASKS} />;
  else if (current === 11) body = <ChoiceSeq {...common} screen={12} kind="mixed" meta={S12} tasks={S12_TASKS} />;
  else if (current === 12) body = <Screen13 {...common} />;
  else if (current === 13) body = <ChoiceSeq {...common} screen={14} kind="final" meta={S14} tasks={S14_TASKS} />;
  else body = <Screen15 {...common} scorePercent={scorePercent} passed={passed} />;

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root g6d05">
        {isPreview && (
          <div style={{
            position: 'fixed', bottom: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
            display: 'flex', gap: 4, background: '#FFFFFF', borderRadius: 99, padding: 4,
            boxShadow: '0 4px 12px -4px rgba(24, 34, 36, 0.22)',
          }}>
            {['ru', 'uz'].map((l) => (
              <button key={l} onClick={() => setPreviewLang(l)} aria-label={l.toUpperCase()}
                style={{
                  border: 'none', cursor: 'pointer', borderRadius: 99, padding: '4px 12px',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700,
                  background: previewLang === l ? '#E75A2C' : 'transparent',
                  color: previewLang === l ? '#FFFFFF' : '#667174',
                }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <React.Fragment key={'scr' + current}>{body}</React.Fragment>
      </div>
    </LangContext.Provider>
  );
}
