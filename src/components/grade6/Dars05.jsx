// 6-sinf, 5-dars — «Наибольший общий делитель (НОД)» / "Eng katta umumiy bo'luvchi (EKUB)".
// lessonId: div_6_05.
//
// Файл написан С НУЛЯ: прежний урок 5 удалён целиком, ни одна строка из него
// не перенесена. Экраны, визуальный слой, тексты и озвучка построены по новому
// техническому заданию методиста.
//
// ЧТО НАСЛЕДУЕТСЯ И ПОЧЕМУ. Движок — AudioEngine, useAudio, LangContext,
// Stage, навигация и контракт TTS v5.2 — ИМПОРТИРУЕТСЯ из Dars01.jsx.
// Причины две: (1) ТЗ прямо требует сохранить существующую аудиоинфраструктуру
// и LangContext; (2) правило проекта запрещает КОПИРОВАТЬ инфраструктуру из
// урока в урок. Dars01.jsx в 6 классе де-факто служит общим модулем — из него
// же берут движок уроки 7–46.
//
// ВИЗУАЛЬНЫЙ СЛОЙ — полностью собственный. Все стили внутри селектора
// `.lesson-root.g6d05`, остальные 45 уроков не затрагиваются. Ни фотографий,
// ни растровых картинок, ни тега img, ни фоновых изображений, ни base64 —
// только HTML/CSS и встроенные SVG.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './Grade6TheoryTheme.css';
import {
  configureLesson,
  LangContext,
  useLang,
  useT,
  useMobileZoom,
  useAudio,
  Stage,
  NavBack,
  NavNext,
  NextLabel,
  BackLabel,
  STYLES,
} from './Dars01.jsx';

const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'div_6_05',
  lessonTitle: { ru: 'Наибольший общий делитель', uz: "Eng katta umumiy bo'luvchi" },
};

// ============================================================
// СТИЛИ УРОКА
// Тема 6 класса пишет `.lesson-root { background: ... !important }`, поэтому
// здесь тоже нужен `!important` — иначе фон не сменится.
// ВНУТРИ ШАБЛОННОЙ СТРОКИ НЕ ДОЛЖНО БЫТЬ ОБРАТНЫХ КАВЫЧЕК: они рвут файл.
// ============================================================
const D05_CSS = `
.lesson-root.g6d05 {
  --bg: #F4EFE6;
  --card: rgba(255, 253, 250, 0.93);
  --ink: #182224;
  --ink2: #667174;
  --teal: #126E73;
  --tealS: #DCEEED;
  --or: #E75A2C;
  --orS: #F9DFD2;
  --gr: #287B54;
  --grS: #E0F0E6;
  --line: rgba(24, 34, 36, 0.13);
  --ui: 'Manrope', system-ui, -apple-system, sans-serif;
  --disp: 'Source Serif 4', 'Fraunces', Georgia, serif;
  --mono: 'JetBrains Mono', ui-monospace, Menlo, monospace;
  --tUi: 220ms;
  --tMath: 520ms;
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  background: var(--bg) !important;
  color: var(--ink);
  font-family: var(--ui) !important;
}

/* Один экран 1366x768. Прокрутки нет нигде, включая контент: тема 6 класса
   разрешает .stage-content скроллиться, здесь это закрыто. */
.lesson-root.g6d05,
.lesson-root.g6d05 .stage { height: 100dvh; max-height: 100dvh; overflow: hidden !important; }
.lesson-root.g6d05 .stage { max-width: 1140px; display: flex; flex-direction: column; }
.lesson-root.g6d05 .stage-header { background: var(--bg); padding-top: 12px; padding-bottom: 8px; }
.lesson-root.g6d05 .stage-content {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  padding-top: 6px;
  padding-bottom: 6px;
}
.lesson-root.g6d05 .stage-nav {
  background: var(--bg);
  border-top: 1px solid var(--line);
  padding-top: 11px;
  padding-bottom: 11px;
  align-items: center;
}
.lesson-root.g6d05 .progress-track { height: 5px; background: rgba(24, 34, 36, 0.10); margin-bottom: 9px; }
.lesson-root.g6d05 .progress-bar { background: var(--teal); box-shadow: none; }
.lesson-root.g6d05 .chrome-left { color: var(--ink2); }
.lesson-root.g6d05 .dot { background: var(--or); box-shadow: none; }
.lesson-root.g6d05 .eyebrow { font-size: 12px; letter-spacing: 0.14em; }

/* Кнопки нижней навигации */
.lesson-root.g6d05 .btn-white-accent {
  background: var(--or); color: #FFFFFF; border-radius: 12px;
  box-shadow: 0 6px 16px -8px rgba(231, 90, 44, 0.55);
  font-family: var(--ui); font-weight: 700; font-size: 15px;
  transition: background var(--tUi) var(--ease), box-shadow var(--tUi) var(--ease), transform var(--tUi) var(--ease);
}
.lesson-root.g6d05 .btn-white-accent:hover:not(:disabled) { background: #CE4A21; color: #FFFFFF; box-shadow: 0 10px 22px -8px rgba(231, 90, 44, 0.65); }
.lesson-root.g6d05 .btn-white-accent:active:not(:disabled) { transform: translateY(1px); }
.lesson-root.g6d05 .btn-white-accent:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }
.lesson-root.g6d05 .btn-white-accent:disabled { background: #E3DCD0; color: #9AA1A2; box-shadow: none; opacity: 1; }
.lesson-root.g6d05 .btn-ghost { color: var(--ink2); font-family: var(--ui); font-weight: 600; font-size: 15px; border-radius: 12px; }
.lesson-root.g6d05 .btn-ghost:hover:not(:disabled) { background: rgba(255, 253, 250, 0.93); color: var(--ink); box-shadow: none; }
.lesson-root.g6d05 .btn-ghost:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }

/* ---------- общие блоки ---------- */
.g5-wrap { display: flex; flex-direction: column; gap: 12px; height: 100%; min-height: 0; }
.g5-h1 { font-family: var(--disp); font-weight: 600; font-size: 40px; line-height: 1.06; letter-spacing: -0.015em; color: var(--ink); }
.g5-h1.sm { font-size: 32px; }
.g5-q { font-family: var(--disp); font-weight: 600; font-size: 29px; line-height: 1.14; color: var(--ink); }
.g5-q.mini { font-size: 20px; font-weight: 600; color: var(--ink2); }
.g5-lead { font-family: var(--ui); font-size: 17px; line-height: 1.5; color: var(--ink2); max-width: 74ch; }
.g5-note { font-family: var(--ui); font-size: 13px; line-height: 1.45; color: var(--ink2); }
.g5-mono { font-family: var(--mono); font-weight: 700; font-variant-numeric: tabular-nums; }
.g5-card { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 16px 18px; }
.g5-row { display: flex; align-items: center; gap: 12px; }
.g5-col { display: flex; flex-direction: column; }
.g5-grow { flex: 1 1 auto; min-height: 0; }
.g5-center { display: flex; align-items: center; justify-content: center; }

/* Указатель действия: куда нажать */
.g5-cue {
  display: inline-flex; align-items: center; gap: 8px; align-self: flex-start;
  font-family: var(--ui); font-size: 13px; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--or);
  background: var(--orS); border-radius: 999px; padding: 6px 14px;
}
.g5-cue.teal { color: var(--teal); background: var(--tealS); }
.g5-cue.green { color: var(--gr); background: var(--grS); }
.g5-cue-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
@keyframes g5-breathe { 0%, 100% { box-shadow: 0 0 0 0 rgba(231, 90, 44, 0.00); } 50% { box-shadow: 0 0 0 7px rgba(231, 90, 44, 0.13); } }
.g5-live { animation: g5-breathe 2.1s var(--ease) infinite; }

/* Варианты ответа */
.g5-opts { display: grid; gap: 10px; }
.g5-opts.c2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.g5-opts.c3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.g5-opts.c4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.g5-opts.c5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.g5-opt {
  font-family: var(--ui); font-size: 18px; font-weight: 600; color: var(--ink);
  background: var(--card); border: 1.5px solid var(--line); border-radius: 14px;
  padding: 13px 14px; min-height: 52px; cursor: pointer; text-align: center;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: border-color var(--tUi) var(--ease), background var(--tUi) var(--ease), transform var(--tUi) var(--ease);
}
.g5-opt .num { font-family: var(--mono); font-weight: 700; font-size: 20px; }
.g5-opt:hover:not(:disabled) { border-color: var(--or); background: #FFFFFF; }
.g5-opt:active:not(:disabled) { transform: translateY(1px); }
.g5-opt:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }
.g5-opt:disabled { cursor: default; }
.g5-opt.isWrong { background: var(--orS); border-color: var(--or); color: #A33F1C; }
.g5-opt.isRight { background: var(--grS); border-color: var(--gr); color: var(--gr); }
.g5-opt.isMuted { opacity: 0.42; }

/* Обратная связь */
.g5-fb { border-radius: 14px; padding: 12px 15px; font-family: var(--ui); font-size: 15px; line-height: 1.45; border: 1px solid transparent; }
.g5-fb.bad { background: var(--orS); border-color: rgba(231, 90, 44, 0.35); color: #8F3617; }
.g5-fb.good { background: var(--grS); border-color: rgba(40, 123, 84, 0.32); color: #1F5F41; }
.g5-fb b { font-weight: 700; }

/* Строка формулы */
.g5-fx { font-family: var(--mono); font-weight: 700; color: var(--ink); font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.g5-fx.xl { font-size: 38px; }
.g5-fx.lg { font-size: 30px; }
.g5-fx.md { font-size: 24px; }
.g5-fx.sm { font-size: 19px; }
.g5-fx .teal { color: var(--teal); }
.g5-fx .or { color: var(--or); }
.g5-fx .gr { color: var(--gr); }

/* Строка, появляющаяся по шагам */
@keyframes g5-rise { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: translateY(0); } }
.g5-step { animation: g5-rise var(--tMath) var(--ease) both; }
.g5-step.d1 { animation-delay: 300ms; }
.g5-step.d2 { animation-delay: 620ms; }
.g5-step.d3 { animation-delay: 940ms; }
.g5-step.d4 { animation-delay: 1260ms; }
@keyframes g5-fade { from { opacity: 0; } to { opacity: 1; } }
.g5-soft { animation: g5-fade var(--tUi) var(--ease) both; }

/* Плитки чисел (ряд делителей) */
.g5-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.g5-chip {
  font-family: var(--mono); font-weight: 700; font-size: 19px; color: var(--ink);
  background: var(--card); border: 1.5px solid var(--line); border-radius: 12px;
  min-width: 52px; padding: 9px 10px; text-align: center;
  transition: background var(--tMath) var(--ease), border-color var(--tMath) var(--ease), color var(--tMath) var(--ease), transform var(--tMath) var(--ease);
}
.g5-chip.isCommon { background: var(--tealS); border-color: var(--teal); color: var(--teal); }
.g5-chip.isBest { background: var(--orS); border-color: var(--or); color: var(--or); transform: translateY(-3px); }
.g5-chip.isGhost { opacity: 0.34; }

/* Рельс шагов (экран 2) и рельс заданий (экраны 9-14) */
.g5-rail { display: flex; gap: 8px; flex-wrap: wrap; }
.g5-railBtn {
  font-family: var(--ui); font-size: 14px; font-weight: 700; color: var(--ink2);
  background: var(--card); border: 1.5px solid var(--line); border-radius: 999px;
  padding: 9px 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
  transition: all var(--tUi) var(--ease);
}
.g5-railBtn .idx { font-family: var(--mono); font-size: 12px; opacity: 0.75; }
.g5-railBtn:hover:not(:disabled) { border-color: var(--or); color: var(--ink); }
.g5-railBtn:active:not(:disabled) { transform: translateY(1px); }
.g5-railBtn:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }
.g5-railBtn:disabled { cursor: not-allowed; opacity: 0.45; }
.g5-railBtn.isActive { border-color: var(--or); background: var(--orS); color: #A33F1C; }
.g5-railBtn.isDone { border-color: var(--gr); background: var(--grS); color: var(--gr); }

.g5-pips { display: flex; gap: 6px; align-items: center; }
.g5-pip {
  font-family: var(--mono); font-size: 12px; font-weight: 700; letter-spacing: 0.02em;
  border-radius: 999px; padding: 5px 11px; border: 1.5px solid var(--line);
  color: var(--ink2); background: var(--card);
  transition: all var(--tUi) var(--ease);
}
.g5-pip.isActive { border-color: var(--or); background: var(--orS); color: #A33F1C; }
.g5-pip.isDone { border-color: var(--gr); background: var(--grS); color: var(--gr); }
.g5-pip.isLocked { opacity: 0.4; }

/* Счёт (экран 1) */
.g5-bill { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 12px 16px 14px; min-width: 190px; position: relative; }
.g5-bill::after { content: ''; position: absolute; left: 10px; right: 10px; bottom: 6px; height: 3px; border-radius: 2px; background: repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 12px); }
.g5-bill .cap { font-family: var(--ui); font-size: 12px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: var(--ink2); }
.g5-bill .sum { font-family: var(--mono); font-weight: 800; font-size: 34px; color: var(--ink); line-height: 1.15; }
.g5-bill .cur { font-family: var(--ui); font-size: 13px; font-weight: 600; color: var(--ink2); }
.g5-bill .lines { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; }
.g5-bill .lines i { display: block; height: 3px; border-radius: 2px; background: var(--line); }
.g5-bill .lines i:nth-child(2) { width: 72%; }
.g5-bill .lines i:nth-child(3) { width: 48%; }

/* Люди (экран 1) */
.g5-people { display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end; min-height: 96px; }
.g5-person { display: flex; flex-direction: column; align-items: center; gap: 5px; animation: g5-rise 420ms var(--ease) both; }
.g5-person .fig { display: block; }
.g5-person .share { font-family: var(--mono); font-size: 13px; font-weight: 700; color: var(--teal); background: var(--tealS); border-radius: 8px; padding: 3px 8px; white-space: nowrap; }
.g5-person .share.bad { color: #A33F1C; background: var(--orS); }

/* Сравнение в два столбца */
.g5-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.g5-side { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 13px 15px; }
.g5-side .cap { font-family: var(--ui); font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink2); margin-bottom: 7px; }
.g5-side.teal { border-color: rgba(18, 110, 115, 0.4); background: var(--tealS); }
.g5-side.teal .cap { color: var(--teal); }
.g5-side.green { border-color: rgba(40, 123, 84, 0.4); background: var(--grS); }
.g5-side.green .cap { color: var(--gr); }
.g5-side.or { border-color: rgba(231, 90, 44, 0.4); background: var(--orS); }
.g5-side.or .cap { color: #A33F1C; }
.g5-side ul { list-style: none; display: flex; flex-direction: column; gap: 5px; }
.g5-side li { font-family: var(--ui); font-size: 15px; line-height: 1.4; color: var(--ink); display: flex; gap: 8px; }
.g5-side li::before { content: ''; flex: 0 0 auto; width: 6px; height: 6px; border-radius: 50%; background: currentColor; margin-top: 8px; opacity: 0.55; }

/* Множители (экран 6) */
.g5-fact { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.g5-fBox {
  font-family: var(--mono); font-weight: 700; font-size: 26px; color: var(--ink);
  background: var(--card); border: 1.5px solid var(--line); border-radius: 12px;
  min-width: 50px; padding: 8px 12px; text-align: center;
  transition: all var(--tMath) var(--ease);
}
.g5-fBox.isPair { background: var(--tealS); border-color: var(--teal); color: var(--teal); }
.g5-fBox.isDim { opacity: 0.4; }
.g5-fDot { font-family: var(--mono); font-size: 22px; color: var(--ink2); }

/* Правила (экран 8) */
.g5-rules { display: flex; flex-direction: column; gap: 9px; }
.g5-rule {
  text-align: left; width: 100%; cursor: pointer;
  background: var(--card); border: 1.5px solid var(--line); border-radius: 14px; padding: 11px 15px;
  transition: all var(--tUi) var(--ease);
}
.g5-rule:hover:not(:disabled) { border-color: var(--or); }
.g5-rule:active:not(:disabled) { transform: translateY(1px); }
.g5-rule:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }
.g5-rule:disabled { cursor: not-allowed; opacity: 0.45; }
.g5-rule.isOpen { border-color: var(--teal); background: var(--tealS); cursor: default; }
.g5-rule .rHead { display: flex; align-items: center; gap: 10px; }
.g5-rule .rNo { font-family: var(--mono); font-size: 12px; font-weight: 700; color: var(--or); background: var(--orS); border-radius: 999px; padding: 3px 9px; }
.g5-rule.isOpen .rNo { color: var(--teal); background: #FFFFFF; }
.g5-rule .rName { font-family: var(--ui); font-size: 16px; font-weight: 700; color: var(--ink); }
.g5-rule .rBody { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; }
.g5-rule .rText { font-family: var(--ui); font-size: 14px; line-height: 1.42; color: var(--ink2); }
.g5-rule .rEx { font-family: var(--ui); font-size: 13px; color: var(--ink2); }

/* Классификация (экран 13) */
.g5-pairs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.g5-pair { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; }
.g5-pair .pv { font-family: var(--mono); font-weight: 700; font-size: 21px; color: var(--ink); text-align: center; }
.g5-pair .pb { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.g5-pair.isDone { border-color: var(--gr); background: var(--grS); }
.g5-mini {
  font-family: var(--mono); font-size: 13px; font-weight: 700; color: var(--ink2);
  background: #FFFFFF; border: 1.5px solid var(--line); border-radius: 9px; padding: 7px 4px; cursor: pointer;
  transition: all var(--tUi) var(--ease);
}
.g5-mini:hover:not(:disabled) { border-color: var(--or); color: var(--ink); }
.g5-mini:active:not(:disabled) { transform: translateY(1px); }
.g5-mini:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }
.g5-mini:disabled { cursor: default; }
.g5-mini.isRight { background: var(--grS); border-color: var(--gr); color: var(--gr); }
.g5-mini.isWrong { background: var(--orS); border-color: var(--or); color: #A33F1C; }
.g5-mini.isOff { opacity: 0.35; }

/* Бонус-карточка */
.g5-bonus { background: var(--tealS); border: 1px solid rgba(18, 110, 115, 0.35); border-radius: 16px; padding: 13px 16px; display: flex; gap: 14px; align-items: center; animation: g5-rise 620ms var(--ease) both; }
.g5-bonus .bCap { font-family: var(--ui); font-size: 12px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: var(--teal); }
.g5-bonus .bText { font-family: var(--ui); font-size: 15px; line-height: 1.42; color: var(--ink); }

/* Дробь */
.g5-frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; line-height: 1; font-family: var(--mono); font-weight: 700; margin: 0 4px; }
.g5-frac .n, .g5-frac .d { padding: 0 3px; }
.g5-frac .bar { height: 2px; width: 100%; background: currentColor; margin: 3px 0; border-radius: 2px; }

/* Поле ввода (экран 10) */
.g5-input {
  font-family: var(--mono); font-size: 26px; font-weight: 700; color: var(--ink);
  background: #FFFFFF; border: 2px solid var(--or); border-radius: 14px;
  width: 132px; padding: 10px 14px; text-align: center;
  transition: border-color var(--tUi) var(--ease);
}
.g5-input::placeholder { color: #C3BDB2; font-weight: 600; }
.g5-input:focus { outline: 3px solid rgba(18, 110, 115, 0.45); outline-offset: 2px; }
.g5-input:disabled { border-color: var(--gr); background: var(--grS); color: var(--gr); }
.g5-check {
  font-family: var(--ui); font-size: 15px; font-weight: 700; color: #FFFFFF;
  background: var(--teal); border: none; border-radius: 12px; padding: 13px 22px; cursor: pointer;
  transition: background var(--tUi) var(--ease), transform var(--tUi) var(--ease);
}
.g5-check:hover:not(:disabled) { background: #0E585C; }
.g5-check:active:not(:disabled) { transform: translateY(1px); }
.g5-check:focus-visible { outline: 3px solid rgba(231, 90, 44, 0.6); outline-offset: 2px; }
.g5-check:disabled { background: #E3DCD0; color: #9AA1A2; cursor: not-allowed; }

/* Большая кнопка (экран 1, «Разделить оба счёта») */
.g5-big {
  font-family: var(--ui); font-size: 16px; font-weight: 700; color: #FFFFFF;
  background: var(--or); border: none; border-radius: 14px; padding: 14px 26px; cursor: pointer;
  transition: background var(--tUi) var(--ease), transform var(--tUi) var(--ease), box-shadow var(--tUi) var(--ease);
  box-shadow: 0 8px 20px -10px rgba(231, 90, 44, 0.7);
}
.g5-big:hover:not(:disabled) { background: #CE4A21; }
.g5-big:active:not(:disabled) { transform: translateY(1px); }
.g5-big:focus-visible { outline: 3px solid rgba(18, 110, 115, 0.55); outline-offset: 2px; }
.g5-big:disabled { background: #E3DCD0; color: #9AA1A2; box-shadow: none; cursor: not-allowed; }

/* Карточки итогового экрана */
.g5-skills { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.g5-skill { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 13px 14px; display: flex; flex-direction: column; gap: 7px; animation: g5-rise 480ms var(--ease) both; }
.g5-skill .sNo { font-family: var(--mono); font-size: 12px; font-weight: 700; color: var(--teal); background: var(--tealS); border-radius: 999px; padding: 3px 9px; align-self: flex-start; }
.g5-skill .sText { font-family: var(--ui); font-size: 15px; line-height: 1.35; color: var(--ink); }

.g5-final { display: flex; gap: 12px; align-items: stretch; }
.g5-final .fMain { flex: 1 1 auto; background: var(--grS); border: 1px solid rgba(40, 123, 84, 0.35); border-radius: 16px; padding: 14px 18px; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
.g5-final .fNext { flex: 0 0 auto; background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 14px 18px; display: flex; flex-direction: column; justify-content: center; gap: 4px; min-width: 300px; }
.g5-final .cap { font-family: var(--ui); font-size: 12px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: var(--ink2); }

/* prefers-reduced-motion: останавливаются и математическое движение, и пульсация */
@media (prefers-reduced-motion: reduce) {
  .lesson-root.g6d05 *, .lesson-root.g6d05 *::before, .lesson-root.g6d05 *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

// ============================================================
// МЕЛКИЕ ХЕЛПЕРЫ
// ============================================================

// Озвучка. При смене состояния экрана очередь заменяется целиком: прежняя
// фраза обрывается, строки нового состояния читаются подряд. Так выполняется
// порядок из ТЗ: команда -> подсветка -> озвучка останавливается и ждёт ->
// ученик нажимает -> следующий сегмент. После смены очереди «Продолжить»
// снова заблокирована (useAudio.canAdvance).
const useVoice = (key, lines) => {
  const list = (lines || []).filter(Boolean);
  return useAudio(list.map((text, i) => ({
    id: key + '_' + i,
    text,
    trigger: i === 0 ? 'on_mount' : 'after_previous',
    waits_for: null,
  })));
};

// Выбор дорожки по языку: контент всегда {ru:[...], uz:[...]}.
const useVoiceLines = (bank, stateKey) => {
  const lang = useLang();
  const entry = bank[stateKey];
  if (!entry) return [];
  return entry[lang] || entry.ru || [];
};

const Cue = ({ tone = 'or', children }) => (
  <span className={'g5-cue ' + (tone === 'or' ? '' : tone)}>
    <span className="g5-cue-dot" />
    {children}
  </span>
);

const Frac = ({ n, d, size = 20 }) => (
  <span className="g5-frac" style={{ fontSize: size }}>
    <span className="n">{n}</span>
    <span className="bar" />
    <span className="d">{d}</span>
  </span>
);

// Запись НОД / EKUB. Код НИКОГДА не собирает готовую русскую строку —
// именно на этом ломался прежний урок: в узбекской версии вылезала кириллица.
const useGcdWord = () => (useLang() === 'uz' ? 'EKUB' : 'НОД');

const GcdFx = ({ a, b, value, size = 'lg', tone = 'gr' }) => {
  const w = useGcdWord();
  return (
    <span className={'g5-fx ' + size}>
      {w}({a}; {b})
      {value !== undefined && value !== null && (<> = <span className={tone}>{value}</span></>)}
    </span>
  );
};

const Pips = ({ total, current, done }) => (
  <div className="g5-pips" aria-hidden="true">
    {Array.from({ length: total }, (_, i) => (
      <span
        key={i}
        className={'g5-pip ' + (done[i] ? 'isDone' : i === current ? 'isActive' : 'isLocked')}
      >
        {String(i + 1).padStart(2, '0')}
      </span>
    ))}
  </div>
);

// Фигура человека — встроенный SVG, без внешних файлов и растра.
const PersonFig = ({ tone }) => (
  <svg className="fig" width="30" height="46" viewBox="0 0 30 46" role="presentation" focusable="false">
    <circle cx="15" cy="10" r="8" fill={tone} />
    <path d="M15 21c-7 0-12 5-12 12v11h24V33c0-7-5-12-12-12z" fill={tone} opacity="0.85" />
  </svg>
);

// Оболочка экрана: верхняя панель, контент, нижняя навигация — всегда на
// одних и тех же местах (ТЗ, «Общая композиция», пункт 4).
const Shell = ({ screen, totalScreens, eyebrow, audio, onPrev, onNext, nextDisabled, nextLabel, children, extraNav }) => (
  <Stage screen={screen} totalScreens={totalScreens} eyebrow={eyebrow} audioState={audio}
    navContent={(
      <>
        <NavBack onPrev={onPrev} label={<BackLabel />} />
        {extraNav}
        <NavNext label={nextLabel || <NextLabel />} onClick={onNext} disabled={nextDisabled} />
      </>
    )}>
    <div className="g5-wrap">{children}</div>
  </Stage>
);

const EYEBROW = { ru: 'НОД · 6 класс', uz: "EKUB · 6-sinf" };

// ============================================================
// ЭКРАН 1 — ДИНАМИЧЕСКИЙ ХУК. Два счёта на 12 000 и 18 000 сум.
// Ответ НЕ ОЦЕНИВАЕТСЯ. При возврате хук начинается заново.
// ============================================================
const S1 = {
  title: { ru: 'Два счёта на одном столе', uz: "Bitta stolda ikkita hisob" },
  q: {
    ru: 'Сколько человек максимум смогут разделить поровну оба счёта?',
    uz: "Ikkala hisobni ham teng bo'lib olishi mumkin bo'lgan eng ko'p necha kishi?",
  },
  bill1: { ru: 'Счёт 1', uz: '1-hisob' },
  bill2: { ru: 'Счёт 2', uz: '2-hisob' },
  cur: { ru: 'сум', uz: "so'm" },
  cue1: { ru: 'Шаг 1 · нажмите число', uz: '1-qadam · sonni bosing' },
  cue2: { ru: 'Шаг 2 · нажмите кнопку', uz: '2-qadam · tugmani bosing' },
  split: { ru: 'Разделить оба счёта', uz: "Ikkala hisobni bo'lish" },
  people: { ru: 'человек', uz: 'kishi' },
  nope: { ru: 'не поровну', uz: 'teng emas' },
  audio: {
    start: {
      ru: [
        'На столе два счёта. Первый на двенадцать тысяч сум, второй на восемнадцать тысяч.',
        'Компания хочет разделить оба счёта поровну. Сколько человек максимум смогут это сделать?',
        'Нажмите число, которое кажется вам верным. Здесь ответ не оценивается.',
      ],
      uz: [
        "Stolda ikkita hisob turibdi. Birinchisi o'n ikki ming so'm, ikkinchisi o'n sakkiz ming so'm.",
        "Do'stlar ikkala hisobni ham teng bo'lishmoqchi. Eng ko'pi bilan necha kishi buni qila oladi?",
        "O'zingizga to'g'ri ko'ringan sonni bosing. Bu yerda javob baholanmaydi.",
      ],
    },
    picked: {
      ru: ['Число выбрано. Теперь нажмите кнопку и посмотрите, что получится.'],
      uz: ["Son tanlandi. Endi tugmani bosing va nima chiqishini ko'ring."],
    },
    done: {
      ru: [
        'Смотрите, как люди подходят к столу один за другим.',
        'Двенадцать делится на шесть и выходит два. Восемнадцать делится на шесть и выходит три.',
        'Значит, максимум шесть человек. Дальше разберём, почему именно шесть.',
      ],
      uz: [
        "Qarang, odamlar stolga birin ketin kelmoqda.",
        "O'n ikkini oltiga bo'lsak ikki chiqadi. O'n sakkizni oltiga bo'lsak uch chiqadi.",
        "Demak, eng ko'pi olti kishi. Keyin nega aynan olti ekanini ko'rib chiqamiz.",
      ],
    },
  },
};

function Screen01({ screen, totalScreens, onNext, onPrev, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const [picked, setPicked] = useState(null);
  const [split, setSplit] = useState(false);
  const voiceKey = split ? 'done' : picked ? 'picked' : 'start';
  const audio = useVoice('s1_' + voiceKey, useVoiceLines(S1.audio, voiceKey));
  const OPTS = [2, 3, 6, 9];

  const doSplit = () => {
    if (!picked || split) return;
    setSplit(true);
    onAnswer({ screen: 1, kind: 'hook', picked, graded: false });
  };

  const share = (total) => (picked && total % picked === 0 ? total / picked : null);

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={onNext} nextDisabled={!audio.canAdvance}>
      <div className="g5-col" style={{ gap: 6 }}>
        <h1 className="g5-h1 sm">{t(S1.title)}</h1>
        <p className="g5-lead">{t(S1.q)}</p>
      </div>

      <div className="g5-row" style={{ gap: 16 }}>
        {[{ cap: S1.bill1, sum: '12 000', n: 12 }, { cap: S1.bill2, sum: '18 000', n: 18 }].map((b, i) => (
          <div className="g5-bill" key={i}>
            <div className="cap">{t(b.cap)}</div>
            <div className="sum">{b.sum} <span className="cur">{t(S1.cur)}</span></div>
            <div className="lines"><i /><i /><i /></div>
          </div>
        ))}
      </div>

      <div className="g5-col" style={{ gap: 8 }}>
        <Cue>{t(split ? S1.cue2 : picked ? S1.cue2 : S1.cue1)}</Cue>
        <div className={'g5-opts c4 ' + (picked || split ? '' : 'g5-live')} style={{ maxWidth: 560, borderRadius: 16 }}>
          {OPTS.map((n) => (
            <button key={n} type="button" className={'g5-opt ' + (picked === n ? 'isRight' : picked ? 'isMuted' : '')}
              onClick={() => { if (!split) setPicked(n); }} disabled={split}
              aria-label={n + ' ' + t(S1.people)}>
              <span className="num">{n}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="g5-row">
        <button type="button" className={'g5-big ' + (picked && !split ? 'g5-live' : '')}
          onClick={doSplit} disabled={!picked || split} aria-label={t(S1.split)}>
          {t(S1.split)}
        </button>
      </div>

      <div className="g5-people" aria-live="polite">
        {split && Array.from({ length: picked }, (_, i) => {
          const s1 = share(12);
          const s2 = share(18);
          return (
            <div className="g5-person" key={i} style={{ animationDelay: (i * 180) + 'ms' }}>
              <PersonFig tone={s1 && s2 ? '#126E73' : '#E75A2C'} />
              <span className={'share ' + (s1 && s2 ? '' : 'bad')}>
                {s1 && s2 ? s1 + ' + ' + s2 : t(S1.nope)}
              </span>
            </div>
          );
        })}
      </div>

      {split && (
        <div className="g5-card g5-step d2" style={{ padding: '12px 18px' }}>
          <div className="g5-row" style={{ gap: 26, flexWrap: 'wrap' }}>
            <span className="g5-fx md">12 : <span className="or">6</span> = 2</span>
            <span className="g5-fx md">18 : <span className="or">6</span> = 3</span>
            <span className="g5-fx md gr">
              {lang === 'uz' ? "eng ko'pi 6 kishi" : 'максимум 6 человек'}
            </span>
          </div>
        </div>
      )}
    </Shell>
  );
}

// ============================================================
// ЭКРАН 2 — ДВА СПИСКА ДЕЛИТЕЛЕЙ, ЧЕТЫРЕ ШАГА
// ============================================================
const S2 = {
  title: { ru: 'Выпишем делители по шагам', uz: "Bo'luvchilarni qadamma qadam yozamiz" },
  steps: [
    { ru: 'Делители 12', uz: "12 ning bo'luvchilari" },
    { ru: 'Делители 18', uz: "18 ning bo'luvchilari" },
    { ru: 'Общие делители', uz: "Umumiy bo'luvchilar" },
    { ru: 'Самый большой', uz: 'Eng kattasi' },
  ],
  cue: { ru: 'Нажимайте шаги по порядку', uz: 'Qadamlarni tartib bilan bosing' },
  d12: { ru: 'Делители 12', uz: "12 ning bo'luvchilari" },
  d18: { ru: 'Делители 18', uz: "18 ning bo'luvchilari" },
  audio: {
    s0: {
      ru: ['Четыре шага, и наибольший общий делитель найден. Нажмите первый шаг.'],
      uz: ["To'rt qadam, va eng katta umumiy bo'luvchi topiladi. Birinchi qadamni bosing."],
    },
    s1: {
      ru: [
        'Выписываем делители двенадцати. Один, два, три, четыре, шесть, двенадцать.',
        'Каждое из этих чисел делит двенадцать без остатка. Нажмите второй шаг.',
      ],
      uz: [
        "O'n ikkining bo'luvchilarini yozamiz. Bir, ikki, uch, to'rt, olti, o'n ikki.",
        "Bu sonlarning har biri o'n ikkini qoldiqsiz bo'ladi. Ikkinchi qadamni bosing.",
      ],
    },
    s2: {
      ru: [
        'Теперь делители восемнадцати. Один, два, три, шесть, девять, восемнадцать.',
        'Два ряда готовы. Нажмите третий шаг и найдём общие числа.',
      ],
      uz: [
        "Endi o'n sakkizning bo'luvchilari. Bir, ikki, uch, olti, to'qqiz, o'n sakkiz.",
        "Ikkala qator tayyor. Uchinchi qadamni bosing va umumiy sonlarni topamiz.",
      ],
    },
    s3: {
      ru: [
        'Бирюзовым горят числа, которые есть в обоих рядах. Один, два, три и шесть.',
        'Это общие делители. Нажмите четвёртый шаг.',
      ],
      uz: [
        "Ikkala qatorda ham bor sonlar moviy rangda yonmoqda. Bir, ikki, uch va olti.",
        "Bular umumiy bo'luvchilar. To'rtinchi qadamni bosing.",
      ],
    },
    s4: {
      ru: [
        'Из общих делителей выбираем самый большой. Это шесть.',
        'Наибольший общий делитель двенадцати и восемнадцати равен шести.',
      ],
      uz: [
        "Umumiy bo'luvchilardan eng kattasini tanlaymiz. Bu olti.",
        "O'n ikki va o'n sakkizning eng katta umumiy bo'luvchisi oltiga teng.",
      ],
    },
  },
};

function Screen02({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const [step, setStep] = useState(() => (storedAnswer && storedAnswer.step) || 0);
  const audio = useVoice('s2_' + step, useVoiceLines(S2.audio, 's' + step));
  const D12 = [1, 2, 3, 4, 6, 12];
  const D18 = [1, 2, 3, 6, 9, 18];
  const COMMON = [1, 2, 3, 6];

  const go = (i) => {
    if (i !== step + 1) return;
    setStep(i);
    onAnswer({ screen: 2, kind: 'walk', step: i });
  };

  const chipCls = (n, row) => {
    if (step < row) return 'isGhost';
    if (step >= 4 && n === 6) return 'isBest';
    if (step >= 3 && COMMON.includes(n)) return 'isCommon';
    return '';
  };

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={onNext} nextDisabled={step < 4 || !audio.canAdvance}>
      <h1 className="g5-h1 sm">{t(S2.title)}</h1>

      <div className="g5-col" style={{ gap: 8 }}>
        <Cue>{t(S2.cue)}</Cue>
        <div className="g5-rail">
          {S2.steps.map((s, i) => (
            <button key={i} type="button"
              className={'g5-railBtn ' + (step >= i + 1 ? 'isDone' : step + 1 === i + 1 ? 'isActive g5-live' : '')}
              onClick={() => go(i + 1)} disabled={step + 1 !== i + 1}
              aria-label={t(s)}>
              <span className="idx">{i + 1}</span>{t(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="g5-card g5-col" style={{ gap: 14 }}>
        <div className="g5-col" style={{ gap: 7 }}>
          <span className="g5-note" style={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t(S2.d12)}</span>
          <div className="g5-chips">
            {D12.map((n) => <span key={n} className={'g5-chip ' + chipCls(n, 1)}>{n}</span>)}
          </div>
        </div>
        <div className="g5-col" style={{ gap: 7 }}>
          <span className="g5-note" style={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t(S2.d18)}</span>
          <div className="g5-chips">
            {D18.map((n) => <span key={n} className={'g5-chip ' + chipCls(n, 2)}>{n}</span>)}
          </div>
        </div>
      </div>

      <div style={{ minHeight: 58 }}>
        {step >= 4 && (
          <div className="g5-card g5-step" style={{ padding: '12px 18px', display: 'inline-block' }}>
            <GcdFx a={12} b={18} value={6} size="lg" />
          </div>
        )}
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 3 — МЕДЛЕННАЯ ПОДСТАНОВКА
// ============================================================
const S3 = {
  title: { ru: 'Подставим число вместо d', uz: "d o'rniga sonni qo'yamiz" },
  cue: { ru: 'Нажмите число', uz: 'Sonni bosing' },
  def: {
    ru: 'Наибольший общий делитель двух чисел — это самое большое число, на которое оба делятся без остатка.',
    uz: "Ikki sonning eng katta umumiy bo'luvchisi — bu ikkala son ham qoldiqsiz bo'linadigan eng katta son.",
  },
  verdict: {
    1: { ru: 'Один делит оба числа, но это самый маленький общий делитель.', uz: "Bir ikkala sonni ham bo'ladi, lekin bu eng kichik umumiy bo'luvchi." },
    2: { ru: 'Два делит оба числа, но есть общий делитель больше.', uz: "Ikki ikkala sonni ham bo'ladi, lekin undan katta umumiy bo'luvchi bor." },
    3: { ru: 'Три делит оба числа, но шесть тоже делит, а шесть больше.', uz: "Uch ikkala sonni ham bo'ladi, lekin olti ham bo'ladi, olti esa kattaroq." },
    6: { ru: 'Шесть — самый большой общий делитель.', uz: "Olti — eng katta umumiy bo'luvchi." },
  },
  audio: {
    idle: {
      ru: ['Здесь d — это общий делитель. Нажмите число, и оно медленно подставится в обе строки.'],
      uz: ["Bu yerda d — umumiy bo'luvchi. Sonni bosing, u ikkala satrga sekin qo'yiladi."],
    },
    p1: {
      ru: ['Двенадцать делится на один и выходит двенадцать. Восемнадцать делится на один и выходит восемнадцать.', 'Один подходит обоим, но это самый маленький общий делитель. Попробуйте больше.'],
      uz: ["O'n ikkini birga bo'lsak o'n ikki chiqadi. O'n sakkizni birga bo'lsak o'n sakkiz chiqadi.", "Bir ikkalasiga ham to'g'ri keladi, lekin bu eng kichik umumiy bo'luvchi. Kattarog'ini sinab ko'ring."],
    },
    p2: {
      ru: ['Двенадцать делится на два и выходит шесть. Восемнадцать делится на два и выходит девять.', 'Два подходит обоим, но общий делитель может быть больше.'],
      uz: ["O'n ikkini ikkiga bo'lsak olti chiqadi. O'n sakkizni ikkiga bo'lsak to'qqiz chiqadi.", "Ikki ikkalasiga ham to'g'ri keladi, lekin umumiy bo'luvchi kattaroq bo'lishi mumkin."],
    },
    p3: {
      ru: ['Двенадцать делится на три и выходит четыре. Восемнадцать делится на три и выходит шесть.', 'Три подходит обоим, но самое большое число мы ещё не нашли.'],
      uz: ["O'n ikkini uchga bo'lsak to'rt chiqadi. O'n sakkizni uchga bo'lsak olti chiqadi.", "Uch ikkalasiga ham to'g'ri keladi, lekin eng katta sonni hali topmadik."],
    },
    p6: {
      ru: ['Двенадцать делится на шесть и выходит два. Восемнадцать делится на шесть и выходит три.', 'Больше шести общего делителя нет. Значит, наибольший общий делитель равен шести.', 'Запомните определение. Это самое большое число, на которое делятся оба числа без остатка.'],
      uz: ["O'n ikkini oltiga bo'lsak ikki chiqadi. O'n sakkizni oltiga bo'lsak uch chiqadi.", "Oltidan katta umumiy bo'luvchi yo'q. Demak, eng katta umumiy bo'luvchi oltiga teng.", "Ta'rifni eslab qoling. Bu ikkala son ham qoldiqsiz bo'linadigan eng katta son."],
    },
  },
};

function Screen03({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const w = useGcdWord();
  const [d, setD] = useState(() => (storedAnswer && storedAnswer.d) || null);
  const [solved, setSolved] = useState(() => Boolean(storedAnswer && storedAnswer.solved));
  const triesRef = useRef(0);
  const key = d ? 'p' + d : 'idle';
  const audio = useVoice('s3_' + key, useVoiceLines(S3.audio, key));

  const pick = (n) => {
    if (solved) return;
    triesRef.current += 1;
    setD(n);
    if (n === 6) {
      setSolved(true);
      onAnswer({ screen: 3, kind: 'substitute', d: 6, solved: true, firstTry: triesRef.current === 1 });
    }
  };

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !audio.canAdvance}>
      <h1 className="g5-h1 sm">{t(S3.title)}</h1>

      <div className="g5-col" style={{ gap: 8 }}>
        <Cue>{t(S3.cue)}</Cue>
        <div className={'g5-opts c4 ' + (d ? '' : 'g5-live')} style={{ maxWidth: 460, borderRadius: 16 }}>
          {[1, 2, 3, 6].map((n) => (
            <button key={n} type="button"
              className={'g5-opt ' + (d === n ? (n === 6 ? 'isRight' : 'isWrong') : solved ? 'isMuted' : '')}
              onClick={() => pick(n)} disabled={solved} aria-label={'d = ' + n}>
              <span className="num">{n}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="g5-card g5-col" style={{ gap: 12, minHeight: 176, justifyContent: 'center' }}>
        <div className="g5-fx lg">12 : <span className="or">{d || 'd'}</span>{d ? ' = ' + 12 / d : ''}</div>
        <div className={'g5-fx lg ' + (d ? 'g5-step d1' : '')}>18 : <span className="or">{d || 'd'}</span>{d ? ' = ' + 18 / d : ''}</div>
        <div className={'g5-fx md ' + (d ? 'g5-step d2' : '')}>
          {w}(12; 18){d === 6 ? <> = <span className="gr">6</span></> : ''}
        </div>
      </div>

      <div style={{ minHeight: 82 }}>
        {d && (
          <div className={'g5-fb ' + (d === 6 ? 'good' : 'bad') + ' g5-step d3'}>
            {t(S3.verdict[d])}
            {d === 6 && <div style={{ marginTop: 6 }}><b>{t(S3.def)}</b></div>}
          </div>
        )}
        {!d && <p className="g5-note">{lang === 'uz' ? "d ni tanlang, satrlar birin ketin to'ladi." : 'Выберите d — строки заполнятся одна за другой.'}</p>}
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 4 — ЧЁТКОЕ РАЗЛИЧИЕ: делит одно число / делит оба числа
// ============================================================
const S4 = {
  q: { ru: 'Какое число делит и 8, и 12?', uz: "Qaysi son 8 ni ham, 12 ni ham bo'ladi?" },
  cue: { ru: 'Выберите ответ', uz: 'Javobni tanlang' },
  fb: {
    3: { ru: '12 делится на 3, а 8 — нет: 8 : 3 даёт остаток. Значит, 3 делит только одно число.', uz: "12 uchga bo'linadi, 8 esa yo'q: 8 ni 3 ga bo'lsak qoldiq qoladi. Demak, 3 faqat bitta sonni bo'ladi." },
    4: { ru: 'Верно. 8 : 4 = 2 и 12 : 4 = 3 — оба деления без остатка.', uz: "To'g'ri. 8 : 4 = 2 va 12 : 4 = 3 — ikkala bo'lish ham qoldiqsiz." },
    5: { ru: 'На 5 не делится ни 8, ни 12. Пятёрка не подходит ни одному числу.', uz: "5 ga na 8, na 12 bo'linadi. Beshlik ikkala songa ham to'g'ri kelmaydi." },
    6: { ru: '12 делится на 6, а 8 — нет: 8 : 6 даёт остаток 2. Одного числа мало.', uz: "12 oltiga bo'linadi, 8 esa yo'q: 8 ni 6 ga bo'lsak 2 qoldiq qoladi. Bitta son yetarli emas." },
  },
  one: { ru: 'делит одно число', uz: "bitta sonni bo'ladi" },
  both: { ru: 'делит оба числа', uz: "ikkala sonni bo'ladi" },
  concl: {
    ru: 'Делитель одного числа не является общим. Общий делитель должен делить оба числа без остатка.',
    uz: "Bitta sonning bo'luvchisi umumiy bo'luvchi emas. Umumiy bo'luvchi ikkala sonni ham qoldiqsiz bo'lishi shart.",
  },
  audio: {
    idle: {
      ru: ['Два числа, восемь и двенадцать. Найдите то, что делит оба. Выберите ответ.'],
      uz: ["Ikkita son, sakkiz va o'n ikki. Ikkalasini ham bo'ladiganini toping. Javobni tanlang."],
    },
    ok: {
      ru: [
        'Верно, это четыре. Восемь делится на четыре и выходит два. Двенадцать делится на четыре и выходит три.',
        'Теперь сравните два случая. Слева тройка делит только двенадцать. Справа четвёрка делит оба числа.',
        'Запомните. Делитель одного числа общим не является.',
      ],
      uz: [
        "To'g'ri, bu to'rt. Sakkizni to'rtga bo'lsak ikki chiqadi. O'n ikkini to'rtga bo'lsak uch chiqadi.",
        "Endi ikki holatni solishtiring. Chapda uchlik faqat o'n ikkini bo'ladi. O'ngda to'rtlik ikkala sonni ham bo'ladi.",
        "Eslab qoling. Bitta sonning bo'luvchisi umumiy bo'luvchi bo'lmaydi.",
      ],
    },
  },
};

function Screen04({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const [pick, setPick] = useState(() => (storedAnswer && storedAnswer.pick) || null);
  const [solved, setSolved] = useState(() => Boolean(storedAnswer && storedAnswer.solved));
  const triesRef = useRef(0);
  // Каждый неверный вариант озвучивается СВОИМ разбором, а не повтором вопроса.
  const baseLines = useVoiceLines(S4.audio, solved ? 'ok' : 'idle');
  const vKey = solved ? 'ok' : (pick ? 'w' + pick : 'idle');
  const audio = useVoice('s4_' + vKey, (!solved && pick) ? [S4.fb[pick][lang]] : baseLines);

  const choose = (n) => {
    if (solved) return;
    triesRef.current += 1;
    setPick(n);
    if (n === 4) {
      setSolved(true);
      onAnswer({ screen: 4, kind: 'mc', pick: 4, solved: true, firstTry: triesRef.current === 1 });
    }
  };

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !audio.canAdvance}>
      <h1 className={'g5-q ' + (solved ? 'mini' : '')}>{t(S4.q)}</h1>

      <div className="g5-col" style={{ gap: 8 }}>
        {!solved && <Cue>{t(S4.cue)}</Cue>}
        <div className={'g5-opts c4 ' + (pick || solved ? '' : 'g5-live')} style={{ maxWidth: 520, borderRadius: 16 }}>
          {[3, 4, 5, 6].map((n) => (
            <button key={n} type="button"
              className={'g5-opt ' + (solved ? (n === 4 ? 'isRight' : 'isMuted') : pick === n ? 'isWrong' : '')}
              onClick={() => choose(n)} disabled={solved} aria-label={String(n)}>
              <span className="num">{n}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ minHeight: 62 }}>
        {pick && <div className={'g5-fb ' + (solved ? 'good' : 'bad')}>{t(S4.fb[pick])}</div>}
      </div>

      {solved && (
        <>
          <div className="g5-two g5-step d1">
            <div className="g5-side or">
              <div className="cap">{t(S4.one)}</div>
              <div className="g5-fx md">12 : 3 = 4</div>
              <div className="g5-fx sm" style={{ marginTop: 6, color: '#A33F1C' }}>
                8 : 3 {lang === 'uz' ? "— bo'linmaydi" : '— не делится'}
              </div>
            </div>
            <div className="g5-side green">
              <div className="cap">{t(S4.both)}</div>
              <div className="g5-fx md">8 : 4 = 2</div>
              <div className="g5-fx md" style={{ marginTop: 6 }}>12 : 4 = 3</div>
            </div>
          </div>
          <div className="g5-fb good g5-step d2">{t(S4.concl)}</div>
        </>
      )}
    </Shell>
  );
}

// ============================================================
// ЭКРАН 5 — НОД(16; 24)
// ============================================================
const S5 = {
  cue: { ru: 'Выберите ответ', uz: 'Javobni tanlang' },
  fb: {
    2: { ru: '2 делит и 16, и 24 — это общий делитель. Но он не самый большой.', uz: "2 ham 16 ni, ham 24 ni bo'ladi — bu umumiy bo'luvchi. Lekin u eng katta emas." },
    4: { ru: '4 тоже общий делитель, но между 4 и 16 есть ещё одно общее число.', uz: "4 ham umumiy bo'luvchi, lekin 4 va 16 orasida yana bitta umumiy son bor." },
    6: { ru: '16 на 6 не делится: 16 : 6 даёт остаток 4. Значит, 6 не общий делитель.', uz: "16 oltiga bo'linmaydi: 16 ni 6 ga bo'lsak 4 qoldiq qoladi. Demak, 6 umumiy bo'luvchi emas." },
    8: { ru: 'Верно. 16 : 8 = 2 и 24 : 8 = 3.', uz: "To'g'ri. 16 : 8 = 2 va 24 : 8 = 3." },
  },
  st1: { ru: 'Общие делители 16 и 24', uz: "16 va 24 ning umumiy bo'luvchilari" },
  st2: { ru: 'Самое большое из них', uz: 'Ular ichida eng kattasi' },
  audio: {
    idle: {
      ru: ['Найдите наибольший общий делитель шестнадцати и двадцати четырёх. Выберите ответ.'],
      uz: ["O'n olti va yigirma to'rtning eng katta umumiy bo'luvchisini toping. Javobni tanlang."],
    },
    ok: {
      ru: [
        'Верно. Сначала посмотрим на все общие делители. Это один, два, четыре и восемь.',
        'Теперь выбираем самое большое из них. Это восемь.',
        'Значит, наибольший общий делитель шестнадцати и двадцати четырёх равен восьми.',
      ],
      uz: [
        "To'g'ri. Avval barcha umumiy bo'luvchilarga qaraymiz. Bular bir, ikki, to'rt va sakkiz.",
        "Endi ular ichidan eng kattasini tanlaymiz. Bu sakkiz.",
        "Demak, o'n olti va yigirma to'rtning eng katta umumiy bo'luvchisi sakkizga teng.",
      ],
    },
  },
};

function Screen05({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const [pick, setPick] = useState(() => (storedAnswer && storedAnswer.pick) || null);
  const [solved, setSolved] = useState(() => Boolean(storedAnswer && storedAnswer.solved));
  const triesRef = useRef(0);
  const baseLines = useVoiceLines(S5.audio, solved ? 'ok' : 'idle');
  const vKey = solved ? 'ok' : (pick ? 'w' + pick : 'idle');
  const audio = useVoice('s5_' + vKey, (!solved && pick) ? [S5.fb[pick][lang]] : baseLines);

  const choose = (n) => {
    if (solved) return;
    triesRef.current += 1;
    setPick(n);
    if (n === 8) {
      setSolved(true);
      onAnswer({ screen: 5, kind: 'mc', pick: 8, solved: true, firstTry: triesRef.current === 1 });
    }
  };

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !audio.canAdvance}>
      <div className="g5-row" style={{ gap: 16, flexWrap: 'wrap' }}>
        <span className="g5-fx xl"><GcdFx a={16} b={24} size="xl" /> = ?</span>
      </div>

      <div className="g5-col" style={{ gap: 8 }}>
        {!solved && <Cue>{t(S5.cue)}</Cue>}
        <div className={'g5-opts c4 ' + (pick || solved ? '' : 'g5-live')} style={{ maxWidth: 520, borderRadius: 16 }}>
          {[2, 4, 6, 8].map((n) => (
            <button key={n} type="button"
              className={'g5-opt ' + (solved ? (n === 8 ? 'isRight' : 'isMuted') : pick === n ? 'isWrong' : '')}
              onClick={() => choose(n)} disabled={solved} aria-label={String(n)}>
              <span className="num">{n}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ minHeight: 60 }}>
        {pick && <div className={'g5-fb ' + (solved ? 'good' : 'bad')}>{t(S5.fb[pick])}</div>}
      </div>

      {solved && (
        <div className="g5-card g5-col" style={{ gap: 12 }}>
          <div className="g5-col g5-step" style={{ gap: 6 }}>
            <span className="g5-note" style={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t(S5.st1)}</span>
            <div className="g5-chips">
              {[1, 2, 4, 8].map((n) => <span key={n} className="g5-chip isCommon">{n}</span>)}
            </div>
          </div>
          <div className="g5-col g5-step d2" style={{ gap: 6 }}>
            <span className="g5-note" style={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t(S5.st2)}</span>
            <div className="g5-chips"><span className="g5-chip isBest">8</span></div>
          </div>
          <div className="g5-step d3"><GcdFx a={16} b={24} value={8} size="lg" /></div>
        </div>
      )}
    </Shell>
  );
}

// ============================================================
// ЭКРАН 6 — РАЗЛОЖЕНИЕ НА ПРОСТЫЕ МНОЖИТЕЛИ + БОНУС-ФАКТ
// ============================================================
const S6 = {
  title: { ru: 'Разложим на простые множители', uz: "Tub ko'paytuvchilarga ajratamiz" },
  q: { ru: 'Чему равен НОД(12; 18) по разложению?', uz: "Yoyilma bo'yicha EKUB(12; 18) nechaga teng?" },
  cue: { ru: 'Выберите ответ', uz: 'Javobni tanlang' },
  fb: {
    4: { ru: '4 — это 2 · 2. Но у 18 в разложении только одна двойка, вторую взять неоткуда.', uz: "4 — bu 2 · 2. Lekin 18 ning yoyilmasida bitta ikkilik bor, ikkinchisini olib bo'lmaydi." },
    5: { ru: 'Пятёрки нет ни в одном разложении. Общий множитель можно брать только из обеих строк.', uz: "Beshlik ikkala yoyilmada ham yo'q. Umumiy ko'paytuvchini faqat ikkala satrdan olish mumkin." },
    6: { ru: 'Верно. Общая двойка и общая тройка дают 2 · 3 = 6.', uz: "To'g'ri. Umumiy ikkilik va umumiy uchlik 2 · 3 = 6 ni beradi." },
    9: { ru: '9 — это 3 · 3. Но у 12 в разложении только одна тройка.', uz: "9 — bu 3 · 3. Lekin 12 ning yoyilmasida bitta uchlik bor." },
  },
  steps: [
    { ru: 'Общая двойка', uz: 'Umumiy ikkilik' },
    { ru: 'Общая тройка', uz: 'Umumiy uchlik' },
    { ru: 'Перемножаем общие множители', uz: "Umumiy ko'paytuvchilarni ko'paytiramiz" },
  ],
  bonusCap: { ru: 'Бонус-факт', uz: 'Bonus fakt' },
  bonus: {
    ru: 'Евклид описал быстрый алгоритм нахождения НОД больше двух тысяч лет назад.',
    uz: "Evklid EKUB ni topishning tez algoritmini ikki ming yildan ko'proq vaqt oldin yozib qoldirgan.",
  },
  audio: {
    idle: {
      ru: [
        'Двенадцать это два умножить на два умножить на три. Восемнадцать это два умножить на три умножить на три.',
        'Общие множители подсвечены. Чему равен наибольший общий делитель? Выберите ответ.',
      ],
      uz: [
        "O'n ikki bu ikki karra ikki karra uch. O'n sakkiz bu ikki karra uch karra uch.",
        "Umumiy ko'paytuvchilar ajratib ko'rsatilgan. Eng katta umumiy bo'luvchi nechaga teng? Javobni tanlang.",
      ],
    },
    ok: {
      ru: [
        'Верно. Берём общую двойку. Она есть и у двенадцати, и у восемнадцати.',
        'Берём общую тройку. Она тоже есть в обеих строках.',
        'Перемножаем. Два умножить на три равно шести. Наибольший общий делитель равен шести.',
        'И бонус. Евклид описал быстрый способ находить это число больше двух тысяч лет назад.',
      ],
      uz: [
        "To'g'ri. Umumiy ikkilikni olamiz. U o'n ikkida ham, o'n sakkizda ham bor.",
        "Umumiy uchlikni olamiz. U ham ikkala satrda bor.",
        "Ko'paytiramiz. Ikki karra uch teng olti. Eng katta umumiy bo'luvchi oltiga teng.",
        "Va bonus. Evklid bu sonni tez topish usulini ikki ming yildan ko'proq vaqt oldin yozib qoldirgan.",
      ],
    },
  },
};

function Screen06({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const [pick, setPick] = useState(() => (storedAnswer && storedAnswer.pick) || null);
  const [solved, setSolved] = useState(() => Boolean(storedAnswer && storedAnswer.solved));
  const triesRef = useRef(0);
  const baseLines = useVoiceLines(S6.audio, solved ? 'ok' : 'idle');
  const vKey = solved ? 'ok' : (pick ? 'w' + pick : 'idle');
  const audio = useVoice('s6_' + vKey, (!solved && pick) ? [S6.fb[pick][lang]] : baseLines);

  const choose = (n) => {
    if (solved) return;
    triesRef.current += 1;
    setPick(n);
    if (n === 6) {
      setSolved(true);
      onAnswer({ screen: 6, kind: 'mc', pick: 6, solved: true, firstTry: triesRef.current === 1 });
    }
  };

  // 12 = 2 · 2 · 3 ; 18 = 2 · 3 · 3. Общая пара: одна двойка и одна тройка.
  const row = (n, parts, pairIdx) => (
    <div className="g5-row" style={{ gap: 10 }}>
      <span className="g5-fx md" style={{ minWidth: 74 }}>{n} =</span>
      <div className="g5-fact">
        {parts.map((p, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="g5-fDot">·</span>}
            <span className={'g5-fBox ' + (pairIdx.includes(i) ? 'isPair' : 'isDim')}>{p}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !audio.canAdvance}>
      <div className="g5-col" style={{ gap: 4 }}>
        <h1 className="g5-h1 sm">{t(S6.title)}</h1>
      </div>

      <div className="g5-card g5-col" style={{ gap: 10 }}>
        {row(12, [2, 2, 3], [0, 2])}
        {row(18, [2, 3, 3], [0, 1])}
      </div>

      <div className="g5-col" style={{ gap: 8 }}>
        <h2 className={'g5-q ' + (solved ? 'mini' : 'mini')}>{t(S6.q)}</h2>
        {!solved && <Cue>{t(S6.cue)}</Cue>}
        <div className={'g5-opts c4 ' + (pick || solved ? '' : 'g5-live')} style={{ maxWidth: 520, borderRadius: 16 }}>
          {[4, 5, 6, 9].map((n) => (
            <button key={n} type="button"
              className={'g5-opt ' + (solved ? (n === 6 ? 'isRight' : 'isMuted') : pick === n ? 'isWrong' : '')}
              onClick={() => choose(n)} disabled={solved} aria-label={String(n)}>
              <span className="num">{n}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ minHeight: 56 }}>
        {pick && <div className={'g5-fb ' + (solved ? 'good' : 'bad')}>{t(S6.fb[pick])}</div>}
      </div>

      {solved && (
        <>
          <div className="g5-row g5-step d1" style={{ gap: 22, flexWrap: 'wrap' }}>
            <span className="g5-fx md teal">2</span>
            <span className="g5-fx md teal g5-step d2">3</span>
            <span className="g5-fx md g5-step d3">2 · 3 = <span className="gr">6</span></span>
            <span className="g5-step d4"><GcdFx a={12} b={18} value={6} size="md" /></span>
          </div>
          <div className="g5-bonus g5-step d4">
            <div className="g5-col" style={{ gap: 3 }}>
              <span className="bCap">{t(S6.bonusCap)}</span>
              <span className="bText">{t(S6.bonus)}</span>
            </div>
          </div>
        </>
      )}
    </Shell>
  );
}

// ============================================================
// ЭКРАН 7 — ДВА СПОСОБА
// ============================================================
const S7 = {
  q: { ru: 'Как удобнее найти НОД(84; 126)?', uz: "EKUB(84; 126) ni qanday topish qulayroq?" },
  cue: { ru: 'Выберите ответ', uz: 'Javobni tanlang' },
  opts: [
    { ru: 'Выписать все делители', uz: "Barcha bo'luvchilarni yozib chiqish" },
    { ru: 'Разложить на простые множители', uz: "Tub ko'paytuvchilarga ajratish" },
    { ru: 'Угадать общий делитель', uz: "Umumiy bo'luvchini taxmin qilish" },
  ],
  fb: [
    { ru: 'Способ рабочий, но у 84 двенадцать делителей, а у 126 — двенадцать. Выписывать оба ряда долго и легко ошибиться.', uz: "Usul ishlaydi, lekin 84 ning o'n ikkita bo'luvchisi bor, 126 niki ham o'n ikkita. Ikkala qatorni yozish uzoq va xato qilish oson." },
    { ru: 'Верно. Разложение сразу показывает общие множители, ряды выписывать не нужно.', uz: "To'g'ri. Yoyilma umumiy ko'paytuvchilarni darrov ko'rsatadi, qatorlarni yozish shart emas." },
    { ru: 'Угадывание не даёт гарантии: можно найти общий делитель, но не самый большой. Нужен способ с доказательством.', uz: "Taxmin qilish kafolat bermaydi: umumiy bo'luvchini topish mumkin, lekin eng kattasini emas. Isbotli usul kerak." },
  ],
  w1: { ru: 'Способ 1 · списки', uz: "1-usul · ro'yxatlar" },
  w2: { ru: 'Способ 2 · разложение', uz: '2-usul · yoyilma' },
  l1: [
    { ru: 'надёжно', uz: 'ishonchli' },
    { ru: 'удобно для малых чисел', uz: 'kichik sonlar uchun qulay' },
    { ru: 'для больших чисел получается длинно', uz: "katta sonlar uchun uzun chiqadi" },
  ],
  audio: {
    idle: {
      ru: ['Числа стали больше. Восемьдесят четыре и сто двадцать шесть. Какой способ здесь удобнее? Выберите ответ.'],
      uz: ["Sonlar kattalashdi. Sakson to'rt va bir yuz yigirma olti. Bu yerda qaysi usul qulayroq? Javobni tanlang."],
    },
    ok: {
      ru: [
        'Верно. Списки надёжны, но для больших чисел они слишком длинные.',
        'Разложение короче. Восемьдесят четыре это два в квадрате умножить на три умножить на семь.',
        'Сто двадцать шесть это два умножить на три в квадрате умножить на семь.',
        'Общие множители два, три и семь. Их произведение сорок два. Значит, ответ сорок два.',
      ],
      uz: [
        "To'g'ri. Ro'yxatlar ishonchli, lekin katta sonlar uchun juda uzun.",
        "Yoyilma qisqaroq. Sakson to'rt bu ikki kvadrati karra uch karra yetti.",
        "Bir yuz yigirma olti bu ikki karra uch kvadrati karra yetti.",
        "Umumiy ko'paytuvchilar ikki, uch va yetti. Ularning ko'paytmasi qirq ikki. Demak, javob qirq ikki.",
      ],
    },
  },
};

function Screen07({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const [pick, setPick] = useState(() => (storedAnswer && typeof storedAnswer.pick === 'number' ? storedAnswer.pick : null));
  const [solved, setSolved] = useState(() => Boolean(storedAnswer && storedAnswer.solved));
  const triesRef = useRef(0);
  const baseLines = useVoiceLines(S7.audio, solved ? 'ok' : 'idle');
  const vKey = solved ? 'ok' : (pick !== null ? 'w' + pick : 'idle');
  const audio = useVoice('s7_' + vKey, (!solved && pick !== null) ? [S7.fb[pick][lang]] : baseLines);

  const choose = (i) => {
    if (solved) return;
    triesRef.current += 1;
    setPick(i);
    if (i === 1) {
      setSolved(true);
      onAnswer({ screen: 7, kind: 'mc', pick: 1, solved: true, firstTry: triesRef.current === 1 });
    }
  };

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !audio.canAdvance}>
      <h1 className={'g5-q ' + (solved ? 'mini' : '')}>{t(S7.q)}</h1>

      <div className="g5-col" style={{ gap: 8 }}>
        {!solved && <Cue>{t(S7.cue)}</Cue>}
        <div className={'g5-opts c3 ' + (pick !== null || solved ? '' : 'g5-live')} style={{ borderRadius: 16 }}>
          {S7.opts.map((o, i) => (
            <button key={i} type="button"
              className={'g5-opt ' + (solved ? (i === 1 ? 'isRight' : 'isMuted') : pick === i ? 'isWrong' : '')}
              onClick={() => choose(i)} disabled={solved} aria-label={t(o)}
              style={{ fontSize: 16, lineHeight: 1.28 }}>
              {t(o)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ minHeight: 58 }}>
        {pick !== null && <div className={'g5-fb ' + (solved ? 'good' : 'bad')}>{t(S7.fb[pick])}</div>}
      </div>

      {solved && (
        <>
          <div className="g5-two g5-step d1">
            <div className="g5-side">
              <div className="cap">{t(S7.w1)}</div>
              <ul>{S7.l1.map((x, i) => <li key={i}>{t(x)}</li>)}</ul>
            </div>
            <div className="g5-side teal">
              <div className="cap">{t(S7.w2)}</div>
              <div className="g5-fx sm" style={{ marginBottom: 4 }}>84 = 2² · 3 · 7</div>
              <div className="g5-fx sm" style={{ marginBottom: 4 }}>126 = 2 · 3² · 7</div>
              <div className="g5-fx sm teal">2 · 3 · 7 = 42</div>
            </div>
          </div>
          <div className="g5-card g5-step d2" style={{ padding: '11px 18px', alignSelf: 'flex-start' }}>
            <GcdFx a={84} b={126} value={42} size="lg" />
          </div>
        </>
      )}
    </Shell>
  );
}

// ============================================================
// ЭКРАН 8 — ПРИМЕНЕНИЕ ТРЁХ ПРАВИЛ
// ============================================================
const S8 = {
  q: { ru: 'Какое число не является общим делителем 24 и 36?', uz: "Qaysi son 24 va 36 ning umumiy bo'luvchisi emas?" },
  cue: { ru: 'Выберите ответ', uz: 'Javobni tanlang' },
  cue2: { ru: 'Нажимайте правила по порядку', uz: 'Qoidalarni tartib bilan bosing' },
  fb: {
    2: { ru: '24 : 2 = 12 и 36 : 2 = 18 — оба деления целые. Двойка общим делителем является.', uz: "24 : 2 = 12 va 36 : 2 = 18 — ikkala bo'lish ham butun. Ikkilik umumiy bo'luvchi bo'ladi." },
    3: { ru: '24 : 3 = 8 и 36 : 3 = 12 — оба целые. Тройка тоже общий делитель.', uz: "24 : 3 = 8 va 36 : 3 = 12 — ikkalasi ham butun. Uchlik ham umumiy bo'luvchi." },
    4: { ru: '24 : 4 = 6 и 36 : 4 = 9 — деления без остатка. Четвёрка подходит обоим.', uz: "24 : 4 = 6 va 36 : 4 = 9 — bo'lishlar qoldiqsiz. To'rtlik ikkalasiga ham to'g'ri keladi." },
    5: { ru: 'Верно. Ни 24, ни 36 на 5 не делятся.', uz: "To'g'ri. Na 24, na 36 beshga bo'linadi." },
    6: { ru: '24 : 6 = 4 и 36 : 6 = 6 — оба деления целые. Шестёрка общий делитель.', uz: "24 : 6 = 4 va 36 : 6 = 6 — ikkala bo'lish ham butun. Oltilik umumiy bo'luvchi." },
  },
  rules: [
    {
      name: { ru: 'Проверить первое число', uz: 'Birinchi sonni tekshirish' },
      text: { ru: 'Делим первое число на кандидата и смотрим на остаток.', uz: "Birinchi sonni nomzodga bo'lamiz va qoldiqqa qaraymiz." },
      fx: '24 = 5 · 4 + 4',
      ex: { ru: 'Остаток 4, значит деление не целое.', uz: "Qoldiq 4, demak bo'lish butun emas." },
    },
    {
      name: { ru: 'Проверить второе число', uz: 'Ikkinchi sonni tekshirish' },
      text: { ru: 'То же самое делаем со вторым числом.', uz: "Xuddi shuni ikkinchi son bilan qilamiz." },
      fx: '36 = 5 · 7 + 1',
      ex: { ru: 'Остаток 1, деление снова не целое.', uz: "Qoldiq 1, bo'lish yana butun emas." },
    },
    {
      name: { ru: 'Сделать вывод', uz: 'Xulosa chiqarish' },
      text: { ru: 'Общий делитель обязан делить оба числа без остатка.', uz: "Umumiy bo'luvchi ikkala sonni ham qoldiqsiz bo'lishi shart." },
      fx: '24 : 5 ✗    36 : 5 ✗',
      ex: { ru: '5 не проходит ни одну проверку, значит общим делителем не является.', uz: "5 birorta tekshiruvdan ham o'tmadi, demak umumiy bo'luvchi emas." },
    },
  ],
  audio: {
    idle: {
      ru: ['Здесь пять чисел. Четыре из них общие делители двадцати четырёх и тридцати шести, одно нет. Выберите ответ.'],
      uz: ["Bu yerda beshta son bor. To'rttasi yigirma to'rt va o'ttiz oltining umumiy bo'luvchisi, bittasi esa yo'q. Javobni tanlang."],
    },
    r0: {
      ru: ['Верно, это пять. Теперь откройте три правила по порядку. Нажмите первое.'],
      uz: ["To'g'ri, bu besh. Endi uchta qoidani tartib bilan oching. Birinchisini bosing."],
    },
    r1: {
      ru: ['Правило первое. Делим двадцать четыре на пять. Выходит четыре и остаток четыре. Деление не целое. Нажмите второе правило.'],
      uz: ["Birinchi qoida. Yigirma to'rtni beshga bo'lamiz. To'rt chiqadi va to'rt qoldiq qoladi. Bo'lish butun emas. Ikkinchi qoidani bosing."],
    },
    r2: {
      ru: ['Правило второе. Делим тридцать шесть на пять. Выходит семь и остаток один. Снова не целое. Нажмите третье правило.'],
      uz: ["Ikkinchi qoida. O'ttiz oltini beshga bo'lamiz. Yetti chiqadi va bir qoldiq qoladi. Yana butun emas. Uchinchi qoidani bosing."],
    },
    r3: {
      ru: ['Правило третье. Общий делитель обязан делить оба числа без остатка. Пять не прошло ни одну проверку, поэтому общим делителем оно не является.'],
      uz: ["Uchinchi qoida. Umumiy bo'luvchi ikkala sonni ham qoldiqsiz bo'lishi shart. Besh birorta tekshiruvdan ham o'tmadi, shuning uchun u umumiy bo'luvchi emas."],
    },
  },
};

function Screen08({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const [pick, setPick] = useState(() => (storedAnswer && storedAnswer.pick) || null);
  const [solved, setSolved] = useState(() => Boolean(storedAnswer && storedAnswer.solved));
  const [open, setOpen] = useState(() => (storedAnswer && storedAnswer.open) || 0);
  const triesRef = useRef(0);
  const baseLines = useVoiceLines(S8.audio, solved ? 'r' + open : 'idle');
  const vKey = solved ? 'r' + open : (pick ? 'w' + pick : 'idle');
  const audio = useVoice('s8_' + vKey, (!solved && pick) ? [S8.fb[pick][lang]] : baseLines);

  const choose = (n) => {
    if (solved) return;
    triesRef.current += 1;
    setPick(n);
    if (n === 5) {
      setSolved(true);
      onAnswer({ screen: 8, kind: 'mc', pick: 5, solved: true, open: 0, firstTry: triesRef.current === 1 });
    }
  };
  const openRule = (i) => {
    if (i !== open + 1) return;
    setOpen(i);
    onAnswer({ screen: 8, kind: 'mc', pick: 5, solved: true, open: i, firstTry: triesRef.current === 1 });
  };

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={onNext} nextDisabled={!solved || open < 3 || !audio.canAdvance}>
      <h1 className={'g5-q ' + (solved ? 'mini' : '')}>{t(S8.q)}</h1>

      <div className="g5-col" style={{ gap: 8 }}>
        {!solved && <Cue>{t(S8.cue)}</Cue>}
        <div className={'g5-opts c5 ' + (pick || solved ? '' : 'g5-live')} style={{ maxWidth: 620, borderRadius: 16 }}>
          {[2, 3, 4, 5, 6].map((n) => (
            <button key={n} type="button"
              className={'g5-opt ' + (solved ? (n === 5 ? 'isRight' : 'isMuted') : pick === n ? 'isWrong' : '')}
              onClick={() => choose(n)} disabled={solved} aria-label={String(n)}
              style={{ minHeight: 46 }}>
              <span className="num">{n}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ minHeight: 48 }}>
        {pick && !solved && <div className="g5-fb bad">{t(S8.fb[pick])}</div>}
        {solved && <div className="g5-fb good">{t(S8.fb[5])}</div>}
      </div>

      {solved && (
        <div className="g5-col" style={{ gap: 8 }}>
          {open < 3 && <Cue>{t(S8.cue2)}</Cue>}
          <div className="g5-rules">
            {S8.rules.map((r, i) => {
              const isOpen = open >= i + 1;
              const isNext = open + 1 === i + 1;
              return (
                <button key={i} type="button"
                  className={'g5-rule ' + (isOpen ? 'isOpen' : isNext ? 'g5-live' : '')}
                  onClick={() => openRule(i + 1)} disabled={!isNext}
                  aria-label={t(r.name)} aria-expanded={isOpen}>
                  <span className="rHead">
                    <span className="rNo">{i + 1}</span>
                    <span className="rName">{t(r.name)}</span>
                    {isOpen && <span className="g5-fx sm teal" style={{ marginLeft: 'auto' }}>{r.fx}</span>}
                  </span>
                  {isOpen && (
                    <span className="rBody g5-soft">
                      <span className="rText">{t(r.text)}</span>
                      <span className="rEx">{t(r.ex)}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Shell>
  );
}

// ============================================================
// ЭКРАН 9 — ПЯТЬ ПРОВЕРОК: взаимно простые или нет
// ============================================================
const S9_TASKS = [
  { a: 8, b: 9, g: 1, cd: null },
  { a: 6, b: 10, g: 2, cd: 2 },
  { a: 7, b: 12, g: 1, cd: null },
  { a: 14, b: 21, g: 7, cd: 7 },
  { a: 9, b: 15, g: 3, cd: 3 },
];

const S9 = {
  title: { ru: 'Взаимно простые или нет', uz: "O'zaro tub yoki yo'q" },
  cue: { ru: 'Выберите ответ', uz: 'Javobni tanlang' },
  optEq: { ru: 'НОД = 1', uz: 'EKUB = 1' },
  optGt: { ru: 'НОД > 1', uz: 'EKUB > 1' },
  cdCap: { ru: 'Общий делитель', uz: "Umumiy bo'luvchi" },
  cdNone: { ru: 'только 1', uz: 'faqat 1' },
  coYes: { ru: 'взаимно простые', uz: "o'zaro tub" },
  coNo: { ru: 'не взаимно простые', uz: "o'zaro tub emas" },
  wrongEq: { ru: 'Общий делитель больше единицы здесь есть, значит НОД не равен 1.', uz: "Bu yerda birdan katta umumiy bo'luvchi bor, demak EKUB 1 ga teng emas." },
  wrongGt: { ru: 'Общего делителя больше единицы у этих чисел нет. Проверьте ещё раз.', uz: "Bu sonlarning birdan katta umumiy bo'luvchisi yo'q. Yana bir bor tekshiring." },
  done: { ru: 'Пять проверок пройдено.', uz: "Beshta tekshiruv bajarildi." },
  audio: {
    q0: { ru: ['Восемь и девять. Есть ли у них общий делитель больше единицы? Выберите ответ.'], uz: ["Sakkiz va to'qqiz. Ularning birdan katta umumiy bo'luvchisi bormi? Javobni tanlang."] },
    q1: { ru: ['Шесть и десять. Проверьте.'], uz: ["Olti va o'n. Tekshiring."] },
    q2: { ru: ['Семь и двенадцать. Проверьте.'], uz: ["Yetti va o'n ikki. Tekshiring."] },
    q3: { ru: ['Четырнадцать и двадцать один. Проверьте.'], uz: ["O'n to'rt va yigirma bir. Tekshiring."] },
    q4: { ru: ['Девять и пятнадцать. Последняя пара.'], uz: ["To'qqiz va o'n besh. Oxirgi juftlik."] },
    a0: { ru: ['Верно. Общих делителей больше единицы нет. Наибольший общий делитель равен одному, значит числа взаимно простые.'], uz: ["To'g'ri. Birdan katta umumiy bo'luvchi yo'q. Eng katta umumiy bo'luvchi birga teng, demak sonlar o'zaro tub."] },
    a1: { ru: ['Верно. Оба числа делятся на два. Наибольший общий делитель равен двум, взаимно простыми они не являются.'], uz: ["To'g'ri. Ikkala son ham ikkiga bo'linadi. Eng katta umumiy bo'luvchi ikkiga teng, ular o'zaro tub emas."] },
    a2: { ru: ['Верно. Семь простое, а двенадцать на семь не делится. Наибольший общий делитель равен одному.'], uz: ["To'g'ri. Yetti tub son, o'n ikki esa yettiga bo'linmaydi. Eng katta umumiy bo'luvchi birga teng."] },
    a3: { ru: ['Верно. Оба числа делятся на семь. Наибольший общий делитель равен семи.'], uz: ["To'g'ri. Ikkala son ham yettiga bo'linadi. Eng katta umumiy bo'luvchi yettiga teng."] },
    a4: { ru: ['Верно. Оба числа делятся на три. Наибольший общий делитель равен трём. Пять проверок пройдено.'], uz: ["To'g'ri. Ikkala son ham uchga bo'linadi. Eng katta umumiy bo'luvchi uchga teng. Beshta tekshiruv bajarildi."] },
  },
};

function Screen09({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const w = useGcdWord();
  const [cur, setCur] = useState(() => (storedAnswer && storedAnswer.cur) || 0);
  const [done, setDone] = useState(() => (storedAnswer && storedAnswer.done) || [false, false, false, false, false]);
  const [wrong, setWrong] = useState(null);
  const triesRef = useRef(0);
  const baseLines = useVoiceLines(S9.audio, done[cur] ? 'a' + cur : 'q' + cur);
  const wrongLine = (!done[cur] && wrong) ? (wrong === 'eq' ? S9.wrongEq : S9.wrongGt)[lang] : null;
  const audio = useVoice('s9_' + cur + '_' + (done[cur] ? 'a' : wrong ? 'w' + wrong : 'q'),
    wrongLine ? [wrongLine] : baseLines);
  const task = S9_TASKS[cur];

  const answer = (isOne) => {
    if (done[cur]) return;
    triesRef.current += 1;
    const right = (task.g === 1) === isOne;
    if (!right) { setWrong(isOne ? 'eq' : 'gt'); return; }
    setWrong(null);
    const nd = done.slice();
    nd[cur] = true;
    setDone(nd);
    onAnswer({ screen: 9, kind: 'series', cur, done: nd, firstTry: triesRef.current === 1 });
  };

  const goNext = () => {
    if (!done[cur] || cur >= 4) return;
    setWrong(null);
    triesRef.current = 0;
    setCur(cur + 1);
    onAnswer({ screen: 9, kind: 'series', cur: cur + 1, done });
  };

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={done[cur] && cur < 4 ? goNext : onNext}
      nextDisabled={!done[cur] || !audio.canAdvance}
      nextLabel={done[cur] && cur < 4 ? (lang === 'uz' ? 'Keyingi misol' : 'Следующий пример') : undefined}>
      <div className="g5-row" style={{ justifyContent: 'space-between' }}>
        <h1 className="g5-h1 sm">{t(S9.title)}</h1>
        <Pips total={5} current={cur} done={done} />
      </div>

      <div className="g5-card g5-center" style={{ minHeight: 120 }}>
        <span className="g5-fx xl">{task.a} <span className="teal">{lang === 'uz' ? 'va' : 'и'}</span> {task.b}</span>
      </div>

      <div className="g5-col" style={{ gap: 8 }}>
        {!done[cur] && <Cue>{t(S9.cue)}</Cue>}
        <div className={'g5-opts c2 ' + (done[cur] || wrong ? '' : 'g5-live')} style={{ maxWidth: 520, borderRadius: 16 }}>
          <button type="button" aria-label={t(S9.optEq)}
            className={'g5-opt ' + (done[cur] ? (task.g === 1 ? 'isRight' : 'isMuted') : wrong === 'eq' ? 'isWrong' : '')}
            onClick={() => answer(true)} disabled={done[cur]}>{t(S9.optEq)}</button>
          <button type="button" aria-label={t(S9.optGt)}
            className={'g5-opt ' + (done[cur] ? (task.g > 1 ? 'isRight' : 'isMuted') : wrong === 'gt' ? 'isWrong' : '')}
            onClick={() => answer(false)} disabled={done[cur]}>{t(S9.optGt)}</button>
        </div>
      </div>

      <div style={{ minHeight: 92 }}>
        {wrong && !done[cur] && <div className="g5-fb bad">{t(wrong === 'eq' ? S9.wrongEq : S9.wrongGt)}</div>}
        {done[cur] && (
          <div className="g5-fb good g5-step">
            <div className="g5-row" style={{ gap: 22, flexWrap: 'wrap' }}>
              <span><b>{t(S9.cdCap)}:</b> {task.cd ? task.cd : t(S9.cdNone)}</span>
              <span className="g5-fx sm">{w}({task.a}; {task.b}) = {task.g}</span>
              <span><b>{t(task.g === 1 ? S9.coYes : S9.coNo)}</b></span>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 10 — ПЯТЬ ЖИЗНЕННЫХ ЗАДАЧ, ВВОД ЧИСЛА
// ============================================================
const S10_TASKS = [
  {
    a: 30, b: 45, g: 15,
    q: { ru: '30 000 и 45 000 сум делят поровну между группами. Какое наибольшее число групп?', uz: "30 000 va 45 000 so'm guruhlar orasida teng bo'linadi. Guruhlar soni eng ko'pi bilan nechta?" },
    why: { ru: 'Каждая группа получит 2000 и 3000 сум.', uz: "Har bir guruh 2000 va 3000 so'm oladi." },
  },
  {
    a: 24, b: 36, g: 12,
    q: { ru: '24 красных и 36 синих предметов раскладывают в одинаковые наборы. Сколько наборов максимум?', uz: "24 ta qizil va 36 ta ko'k buyum bir xil to'plamlarga taqsimlanadi. Eng ko'pi bilan nechta to'plam?" },
    why: { ru: 'В каждом наборе будет 2 красных и 3 синих.', uz: "Har bir to'plamda 2 ta qizil va 3 ta ko'k bo'ladi." },
  },
  {
    a: 18, b: 42, g: 6,
    q: { ru: 'Две ленты 18 и 42 метра режут на равные куски без остатка. Какая наибольшая длина куска?', uz: "18 va 42 metrli ikkita lenta qoldiqsiz teng bo'laklarga kesiladi. Bo'lakning eng katta uzunligi qancha?" },
    why: { ru: 'Выйдет 3 куска и 7 кусков по 6 метров.', uz: "6 metrdan 3 ta va 7 ta bo'lak chiqadi." },
  },
  {
    a: 16, b: 40, g: 8,
    q: { ru: '16 и 40 предметов раскладывают в одинаковые коробки. Сколько коробок максимум?', uz: "16 va 40 ta buyum bir xil qutilarga joylanadi. Eng ko'pi bilan nechta quti?" },
    why: { ru: 'В каждой коробке будет 2 и 5 предметов.', uz: "Har bir qutida 2 ta va 5 ta buyum bo'ladi." },
  },
  {
    a: 27, b: 36, g: 9,
    q: { ru: 'Маршруты 27 и 36 километров делят на равные отрезки. Какой наибольший общий шаг?', uz: "27 va 36 kilometrli marshrutlar teng bo'laklarga bo'linadi. Eng katta umumiy qadam qancha?" },
    why: { ru: 'Получится 3 и 4 отрезка по 9 километров.', uz: "9 kilometrdan 3 ta va 4 ta bo'lak chiqadi." },
  },
];

const S10 = {
  title: { ru: 'Пять задач из жизни', uz: 'Beshta hayotiy masala' },
  cue: { ru: 'Введите число', uz: 'Sonni kiriting' },
  check: { ru: 'Проверить', uz: 'Tekshirish' },
  ph: { ru: '?', uz: '?' },
  bad: { ru: 'Это не наибольший общий делитель. Найдите общие делители обоих чисел и возьмите самый большой.', uz: "Bu eng katta umumiy bo'luvchi emas. Ikkala sonning umumiy bo'luvchilarini toping va eng kattasini oling." },
  badSmall: { ru: 'Число делит оба, но есть общий делитель больше.', uz: "Son ikkalasini ham bo'ladi, lekin undan katta umumiy bo'luvchi bor." },
  audio: {
    q0: { ru: ['Тридцать тысяч и сорок пять тысяч сум делят поровну. Введите наибольшее число групп.'], uz: ["O'ttiz ming va qirq besh ming so'm teng bo'linadi. Guruhlarning eng ko'p sonini kiriting."] },
    q1: { ru: ['Двадцать четыре красных и тридцать шесть синих предметов. Введите наибольшее число наборов.'], uz: ["Yigirma to'rtta qizil va o'ttiz oltita ko'k buyum. To'plamlarning eng ko'p sonini kiriting."] },
    q2: { ru: ['Ленты восемнадцать и сорок два метра. Введите наибольшую длину куска.'], uz: ["Lentalar o'n sakkiz va qirq ikki metr. Bo'lakning eng katta uzunligini kiriting."] },
    q3: { ru: ['Шестнадцать и сорок предметов. Введите наибольшее число коробок.'], uz: ["O'n olti va qirqta buyum. Qutilarning eng ko'p sonini kiriting."] },
    q4: { ru: ['Маршруты двадцать семь и тридцать шесть километров. Введите наибольший общий шаг.'], uz: ["Marshrutlar yigirma yetti va o'ttiz olti kilometr. Eng katta umumiy qadamni kiriting."] },
    a0: { ru: ['Верно, пятнадцать. Тридцать делится на пятнадцать и выходит два, сорок пять делится на пятнадцать и выходит три.'], uz: ["To'g'ri, o'n besh. O'ttizni o'n beshga bo'lsak ikki chiqadi, qirq beshni o'n beshga bo'lsak uch chiqadi."] },
    a1: { ru: ['Верно, двенадцать. В каждом наборе окажется два красных и три синих предмета.'], uz: ["To'g'ri, o'n ikki. Har bir to'plamda ikkita qizil va uchta ko'k buyum bo'ladi."] },
    a2: { ru: ['Верно, шесть метров. Первая лента даст три куска, вторая семь.'], uz: ["To'g'ri, olti metr. Birinchi lenta uchta bo'lak, ikkinchisi yettita bo'lak beradi."] },
    a3: { ru: ['Верно, восемь коробок. В каждой окажется два и пять предметов.'], uz: ["To'g'ri, sakkizta quti. Har birida ikkita va beshta buyum bo'ladi."] },
    a4: { ru: ['Верно, девять километров. Первый маршрут это три шага, второй четыре. Пять задач решены.'], uz: ["To'g'ri, to'qqiz kilometr. Birinchi marshrut uchta qadam, ikkinchisi to'rtta. Beshta masala yechildi."] },
  },
};

function Screen10({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const w = useGcdWord();
  const [cur, setCur] = useState(() => (storedAnswer && storedAnswer.cur) || 0);
  const [done, setDone] = useState(() => (storedAnswer && storedAnswer.done) || [false, false, false, false, false]);
  const [val, setVal] = useState('');
  const [bad, setBad] = useState(null);
  const triesRef = useRef(0);
  const task = S10_TASKS[cur];
  const baseLines = useVoiceLines(S10.audio, done[cur] ? 'a' + cur : 'q' + cur);
  const wrongLine = (!done[cur] && bad) ? (bad === 'small' ? S10.badSmall : S10.bad)[lang] : null;
  const audio = useVoice('s10_' + cur + '_' + (done[cur] ? 'a' : bad ? 'w' + bad : 'q'),
    wrongLine ? [wrongLine] : baseLines);

  const check = () => {
    if (done[cur]) return;
    const n = parseInt(val, 10);
    if (!Number.isFinite(n)) return;
    triesRef.current += 1;
    if (n !== task.g) {
      const divides = task.a % n === 0 && task.b % n === 0;
      setBad(divides ? 'small' : 'no');
      return;
    }
    setBad(null);
    const nd = done.slice();
    nd[cur] = true;
    setDone(nd);
    onAnswer({ screen: 10, kind: 'input', cur, done: nd, firstTry: triesRef.current === 1 });
  };

  const goNext = () => {
    if (!done[cur] || cur >= 4) return;
    setVal(''); setBad(null); triesRef.current = 0;
    setCur(cur + 1);
    onAnswer({ screen: 10, kind: 'input', cur: cur + 1, done });
  };

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={done[cur] && cur < 4 ? goNext : onNext}
      nextDisabled={!done[cur] || !audio.canAdvance}
      nextLabel={done[cur] && cur < 4 ? (lang === 'uz' ? 'Keyingi masala' : 'Следующая задача') : undefined}>
      <div className="g5-row" style={{ justifyContent: 'space-between' }}>
        <h1 className="g5-h1 sm">{t(S10.title)}</h1>
        <Pips total={5} current={cur} done={done} />
      </div>

      <div className="g5-card g5-col" style={{ gap: 10, minHeight: 128, justifyContent: 'center' }}>
        <p className="g5-q mini" style={{ fontSize: 21, color: '#182224' }}>{t(task.q)}</p>
        <div className="g5-fx lg teal">{task.a} · {task.b}</div>
      </div>

      <div className="g5-col" style={{ gap: 8 }}>
        {!done[cur] && <Cue>{t(S10.cue)}</Cue>}
        <div className={'g5-row ' + (done[cur] || bad ? '' : 'g5-live')} style={{ gap: 12, borderRadius: 16, width: 'fit-content' }}>
          <input className="g5-input" inputMode="numeric" value={done[cur] ? String(task.g) : val}
            onChange={(e) => setVal(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
            onKeyDown={(e) => { if (e.key === 'Enter') check(); }}
            placeholder={t(S10.ph)} disabled={done[cur]}
            aria-label={t(S10.cue)} />
          <button type="button" className="g5-check" onClick={check} disabled={done[cur] || !val}
            aria-label={t(S10.check)}>{t(S10.check)}</button>
        </div>
      </div>

      <div style={{ minHeight: 84 }}>
        {bad && !done[cur] && <div className="g5-fb bad">{t(bad === 'small' ? S10.badSmall : S10.bad)}</div>}
        {done[cur] && (
          <div className="g5-fb good g5-step">
            <div className="g5-row" style={{ gap: 22, flexWrap: 'wrap' }}>
              <span className="g5-fx sm">{w}({task.a}; {task.b}) = {task.g}</span>
              <span className="g5-fx sm">{task.a} : {task.g} = {task.a / task.g}</span>
              <span className="g5-fx sm">{task.b} : {task.g} = {task.b / task.g}</span>
            </div>
            <div style={{ marginTop: 5 }}>{t(task.why)}</div>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 11 — ПЯТЬ КОРОТКИХ СЛУЧАЕВ
// ============================================================
const S11_TASKS = [
  { a: 6, b: 18, k: 3 },
  { a: 7, b: 35, k: 5 },
  { a: 8, b: 32, k: 4 },
  { a: 9, b: 45, k: 5 },
  { a: 12, b: 60, k: 5 },
];

const S11 = {
  title: { ru: 'Короткий случай', uz: 'Qisqa holat' },
  q: { ru: 'Делится ли большее число на меньшее?', uz: "Katta son kichigiga bo'linadimi?" },
  cue: { ru: 'Выберите ответ', uz: 'Javobni tanlang' },
  yes: { ru: 'Да, делится', uz: "Ha, bo'linadi" },
  no: { ru: 'Нет, с остатком', uz: "Yo'q, qoldiq bilan" },
  wrong: { ru: 'Посмотрите на полосу: большее число полностью составлено из одинаковых частей. Остатка нет.', uz: "Yo'lakchaga qarang: katta son butunlay bir xil bo'laklardan tuzilgan. Qoldiq yo'q." },
  rule: { ru: 'Если большее число делится на меньшее, НОД равен меньшему числу.', uz: "Agar katta son kichigiga bo'linsa, EKUB kichik songa teng." },
  audio: {
    q0: { ru: ['Шесть и восемнадцать. Полоса показывает, из скольких равных частей собрано большее число. Делится ли оно на меньшее?'], uz: ["Olti va o'n sakkiz. Yo'lakcha katta son nechta teng bo'lakdan yig'ilganini ko'rsatadi. U kichigiga bo'linadimi?"] },
    q1: { ru: ['Семь и тридцать пять. Посмотрите на полосу и ответьте.'], uz: ["Yetti va o'ttiz besh. Yo'lakchaga qarang va javob bering."] },
    q2: { ru: ['Восемь и тридцать два. Посмотрите на полосу.'], uz: ["Sakkiz va o'ttiz ikki. Yo'lakchaga qarang."] },
    q3: { ru: ['Девять и сорок пять. Проверьте.'], uz: ["To'qqiz va qirq besh. Tekshiring."] },
    q4: { ru: ['Двенадцать и шестьдесят. Последний случай.'], uz: ["O'n ikki va oltmish. Oxirgi holat."] },
    a0: { ru: ['Верно. Восемнадцать это три раза по шесть. Значит, наибольший общий делитель равен шести, то есть меньшему числу.'], uz: ["To'g'ri. O'n sakkiz bu uch marta olti. Demak, eng katta umumiy bo'luvchi oltiga, ya'ni kichik songa teng."] },
    a1: { ru: ['Верно. Тридцать пять это пять раз по семь. Наибольший общий делитель равен семи.'], uz: ["To'g'ri. O'ttiz besh bu besh marta yetti. Eng katta umumiy bo'luvchi yettiga teng."] },
    a2: { ru: ['Верно. Тридцать два это четыре раза по восемь. Наибольший общий делитель равен восьми.'], uz: ["To'g'ri. O'ttiz ikki bu to'rt marta sakkiz. Eng katta umumiy bo'luvchi sakkizga teng."] },
    a3: { ru: ['Верно. Сорок пять это пять раз по девять. Наибольший общий делитель равен девяти.'], uz: ["To'g'ri. Qirq besh bu besh marta to'qqiz. Eng katta umumiy bo'luvchi to'qqizga teng."] },
    a4: { ru: ['Верно. Шестьдесят это пять раз по двенадцать. Наибольший общий делитель равен двенадцати. Правило работает всегда, когда большее делится на меньшее.'], uz: ["To'g'ri. Oltmish bu besh marta o'n ikki. Eng katta umumiy bo'luvchi o'n ikkiga teng. Bu qoida katta son kichigiga bo'linganda doim ishlaydi."] },
  },
};

function Screen11({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const w = useGcdWord();
  const [cur, setCur] = useState(() => (storedAnswer && storedAnswer.cur) || 0);
  const [done, setDone] = useState(() => (storedAnswer && storedAnswer.done) || [false, false, false, false, false]);
  const [bad, setBad] = useState(false);
  const triesRef = useRef(0);
  const task = S11_TASKS[cur];
  const baseLines = useVoiceLines(S11.audio, done[cur] ? 'a' + cur : 'q' + cur);
  const audio = useVoice('s11_' + cur + '_' + (done[cur] ? 'a' : bad ? 'w' : 'q'),
    (!done[cur] && bad) ? [S11.wrong[lang]] : baseLines);

  const answer = (isYes) => {
    if (done[cur]) return;
    triesRef.current += 1;
    if (!isYes) { setBad(true); return; }
    setBad(false);
    const nd = done.slice();
    nd[cur] = true;
    setDone(nd);
    onAnswer({ screen: 11, kind: 'series', cur, done: nd, firstTry: triesRef.current === 1 });
  };

  const goNext = () => {
    if (!done[cur] || cur >= 4) return;
    setBad(false); triesRef.current = 0;
    setCur(cur + 1);
    onAnswer({ screen: 11, kind: 'series', cur: cur + 1, done });
  };

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={done[cur] && cur < 4 ? goNext : onNext}
      nextDisabled={!done[cur] || !audio.canAdvance}
      nextLabel={done[cur] && cur < 4 ? (lang === 'uz' ? 'Keyingi misol' : 'Следующий пример') : undefined}>
      <div className="g5-row" style={{ justifyContent: 'space-between' }}>
        <h1 className="g5-h1 sm">{t(S11.title)}</h1>
        <Pips total={5} current={cur} done={done} />
      </div>

      <div className="g5-card g5-col" style={{ gap: 12 }}>
        <div className="g5-row" style={{ gap: 18 }}>
          <span className="g5-fx lg">{task.a}</span>
          <span className="g5-fx lg teal">{task.b}</span>
        </div>
        <div className="g5-row" style={{ gap: 5 }} aria-hidden="true">
          {Array.from({ length: task.k }, (_, i) => (
            <span key={i} style={{
              flex: '1 1 0', height: 34, borderRadius: 9,
              background: done[cur] ? '#DCEEED' : 'rgba(255,253,250,0.93)',
              border: '1.5px solid ' + (done[cur] ? '#126E73' : 'rgba(24,34,36,0.13)'),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 15,
              color: done[cur] ? '#126E73' : '#667174',
              transition: 'all 520ms cubic-bezier(0.22,0.61,0.36,1)',
            }}>{task.a}</span>
          ))}
        </div>
        <p className="g5-note">{task.k} × {task.a} = {task.b}</p>
      </div>

      <div className="g5-col" style={{ gap: 8 }}>
        <h2 className="g5-q mini">{t(S11.q)}</h2>
        {!done[cur] && <Cue>{t(S11.cue)}</Cue>}
        <div className={'g5-opts c2 ' + (done[cur] || bad ? '' : 'g5-live')} style={{ maxWidth: 520, borderRadius: 16 }}>
          <button type="button" aria-label={t(S11.yes)}
            className={'g5-opt ' + (done[cur] ? 'isRight' : '')}
            onClick={() => answer(true)} disabled={done[cur]}>{t(S11.yes)}</button>
          <button type="button" aria-label={t(S11.no)}
            className={'g5-opt ' + (done[cur] ? 'isMuted' : bad ? 'isWrong' : '')}
            onClick={() => answer(false)} disabled={done[cur]}>{t(S11.no)}</button>
        </div>
      </div>

      <div style={{ minHeight: 74 }}>
        {bad && !done[cur] && <div className="g5-fb bad">{t(S11.wrong)}</div>}
        {done[cur] && (
          <div className="g5-fb good g5-step">
            <div style={{ marginBottom: 4 }}>{t(S11.rule)}</div>
            <span className="g5-fx sm">{w}({task.a}; {task.b}) = {task.a}</span>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 12 — ПЯТЬ СМЕШАННЫХ ПАР
// ============================================================
const S12_TASKS = [
  {
    a: 12, b: 20, g: 4, opts: [2, 4, 6, 10],
    method: { ru: 'способ списков', uz: "ro'yxat usuli" },
    show: { ru: 'Общие делители: 1, 2, 4', uz: "Umumiy bo'luvchilar: 1, 2, 4" },
    fb: {
      2: { ru: '2 делит оба, но 4 тоже делит оба и оно больше.', uz: "2 ikkalasini ham bo'ladi, lekin 4 ham bo'ladi va u kattaroq." },
      6: { ru: '20 на 6 не делится: 20 : 6 даёт остаток 2.', uz: "20 oltiga bo'linmaydi: 20 ni 6 ga bo'lsak 2 qoldiq qoladi." },
      10: { ru: '12 на 10 не делится: остаток 2.', uz: "12 o'nga bo'linmaydi: qoldiq 2." },
    },
  },
  {
    a: 9, b: 15, g: 3, opts: [3, 5, 9, 15],
    method: { ru: 'способ списков', uz: "ro'yxat usuli" },
    show: { ru: 'Общие делители: 1, 3', uz: "Umumiy bo'luvchilar: 1, 3" },
    fb: {
      5: { ru: '9 на 5 не делится: остаток 4.', uz: "9 beshga bo'linmaydi: qoldiq 4." },
      9: { ru: '15 на 9 не делится: остаток 6.', uz: "15 to'qqizga bo'linmaydi: qoldiq 6." },
      15: { ru: '9 меньше 15, поэтому на 15 оно делиться не может.', uz: "9 son 15 dan kichik, shuning uchun u 15 ga bo'lina olmaydi." },
    },
  },
  {
    a: 18, b: 30, g: 6, opts: [3, 6, 9, 15],
    method: { ru: 'разложение', uz: 'yoyilma' },
    show: { ru: '18 = 2 · 3 · 3     30 = 2 · 3 · 5', uz: '18 = 2 · 3 · 3     30 = 2 · 3 · 5' },
    fb: {
      3: { ru: '3 общий делитель, но общая двойка тоже есть: 2 · 3 больше.', uz: "3 umumiy bo'luvchi, lekin umumiy ikkilik ham bor: 2 · 3 kattaroq." },
      9: { ru: '30 на 9 не делится: остаток 3.', uz: "30 to'qqizga bo'linmaydi: qoldiq 3." },
      15: { ru: '18 на 15 не делится: остаток 3.', uz: "18 o'n beshga bo'linmaydi: qoldiq 3." },
    },
  },
  {
    a: 24, b: 36, g: 12, opts: [6, 9, 12, 18],
    method: { ru: 'разложение', uz: 'yoyilma' },
    show: { ru: '24 = 2 · 2 · 2 · 3     36 = 2 · 2 · 3 · 3', uz: '24 = 2 · 2 · 2 · 3     36 = 2 · 2 · 3 · 3' },
    fb: {
      6: { ru: '6 делит оба, но общих множителей больше: 2 · 2 · 3 = 12.', uz: "6 ikkalasini ham bo'ladi, lekin umumiy ko'paytuvchilar ko'proq: 2 · 2 · 3 = 12." },
      9: { ru: '24 на 9 не делится: остаток 6.', uz: "24 to'qqizga bo'linmaydi: qoldiq 6." },
      18: { ru: '24 на 18 не делится: остаток 6.', uz: "24 o'n sakkizga bo'linmaydi: qoldiq 6." },
    },
  },
  {
    a: 25, b: 40, g: 5, opts: [2, 5, 8, 10],
    method: { ru: 'способ списков', uz: "ro'yxat usuli" },
    show: { ru: 'Общие делители: 1, 5', uz: "Umumiy bo'luvchilar: 1, 5" },
    fb: {
      2: { ru: '25 нечётное, на 2 оно не делится.', uz: "25 toq son, u ikkiga bo'linmaydi." },
      8: { ru: '25 на 8 не делится: остаток 1.', uz: "25 sakkizga bo'linmaydi: qoldiq 1." },
      10: { ru: '25 на 10 не делится: остаток 5.', uz: "25 o'nga bo'linmaydi: qoldiq 5." },
    },
  },
];

const S12 = {
  title: { ru: 'Смешанные пары', uz: 'Aralash juftliklar' },
  cue: { ru: 'Выберите ответ', uz: 'Javobni tanlang' },
  mCap: { ru: 'Способ', uz: 'Usul' },
  audio: {
    q0: { ru: ['Двенадцать и двадцать. Выберите ответ.'], uz: ["O'n ikki va yigirma. Javobni tanlang."] },
    q1: { ru: ['Девять и пятнадцать. Выберите ответ.'], uz: ["To'qqiz va o'n besh. Javobni tanlang."] },
    q2: { ru: ['Восемнадцать и тридцать. Выберите ответ.'], uz: ["O'n sakkiz va o'ttiz. Javobni tanlang."] },
    q3: { ru: ['Двадцать четыре и тридцать шесть. Выберите ответ.'], uz: ["Yigirma to'rt va o'ttiz olti. Javobni tanlang."] },
    q4: { ru: ['Двадцать пять и сорок. Последняя пара.'], uz: ["Yigirma besh va qirq. Oxirgi juftlik."] },
    a0: { ru: ['Верно, четыре. По спискам общие делители это один, два и четыре. Самый большой четыре.'], uz: ["To'g'ri, to'rt. Ro'yxat bo'yicha umumiy bo'luvchilar bir, ikki va to'rt. Eng kattasi to'rt."] },
    a1: { ru: ['Верно, три. Общие делители это один и три.'], uz: ["To'g'ri, uch. Umumiy bo'luvchilar bir va uch."] },
    a2: { ru: ['Верно, шесть. По разложению общие множители два и три, их произведение шесть.'], uz: ["To'g'ri, olti. Yoyilma bo'yicha umumiy ko'paytuvchilar ikki va uch, ularning ko'paytmasi olti."] },
    a3: { ru: ['Верно, двенадцать. Общие множители два, два и три, их произведение двенадцать.'], uz: ["To'g'ri, o'n ikki. Umumiy ko'paytuvchilar ikki, ikki va uch, ularning ko'paytmasi o'n ikki."] },
    a4: { ru: ['Верно, пять. Общие делители это один и пять. Пять пар разобраны.'], uz: ["To'g'ri, besh. Umumiy bo'luvchilar bir va besh. Beshta juftlik ko'rib chiqildi."] },
  },
};

function Screen12({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const [cur, setCur] = useState(() => (storedAnswer && storedAnswer.cur) || 0);
  const [done, setDone] = useState(() => (storedAnswer && storedAnswer.done) || [false, false, false, false, false]);
  const [pick, setPick] = useState(null);
  const triesRef = useRef(0);
  const task = S12_TASKS[cur];
  const baseLines = useVoiceLines(S12.audio, done[cur] ? 'a' + cur : 'q' + cur);
  const wrongLine = (!done[cur] && pick && task.fb[pick]) ? task.fb[pick][lang] : null;
  const audio = useVoice('s12_' + cur + '_' + (done[cur] ? 'a' : wrongLine ? 'w' + pick : 'q'),
    wrongLine ? [wrongLine] : baseLines);

  const choose = (n) => {
    if (done[cur]) return;
    triesRef.current += 1;
    setPick(n);
    if (n !== task.g) return;
    const nd = done.slice();
    nd[cur] = true;
    setDone(nd);
    onAnswer({ screen: 12, kind: 'series', cur, done: nd, firstTry: triesRef.current === 1 });
  };

  const goNext = () => {
    if (!done[cur] || cur >= 4) return;
    setPick(null); triesRef.current = 0;
    setCur(cur + 1);
    onAnswer({ screen: 12, kind: 'series', cur: cur + 1, done });
  };

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={done[cur] && cur < 4 ? goNext : onNext}
      nextDisabled={!done[cur] || !audio.canAdvance}
      nextLabel={done[cur] && cur < 4 ? (lang === 'uz' ? 'Keyingi juftlik' : 'Следующая пара') : undefined}>
      <div className="g5-row" style={{ justifyContent: 'space-between' }}>
        <h1 className="g5-h1 sm">{t(S12.title)}</h1>
        <Pips total={5} current={cur} done={done} />
      </div>

      <div className="g5-card g5-center" style={{ minHeight: 108 }}>
        <span className="g5-fx xl"><GcdFx a={task.a} b={task.b} size="xl" /> = ?</span>
      </div>

      <div className="g5-col" style={{ gap: 8 }}>
        {!done[cur] && <Cue>{t(S12.cue)}</Cue>}
        <div className={'g5-opts c4 ' + (pick || done[cur] ? '' : 'g5-live')} style={{ maxWidth: 560, borderRadius: 16 }}>
          {task.opts.map((n) => (
            <button key={n} type="button"
              className={'g5-opt ' + (done[cur] ? (n === task.g ? 'isRight' : 'isMuted') : pick === n ? 'isWrong' : '')}
              onClick={() => choose(n)} disabled={done[cur]} aria-label={String(n)}>
              <span className="num">{n}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ minHeight: 92 }}>
        {pick && !done[cur] && task.fb[pick] && <div className="g5-fb bad">{t(task.fb[pick])}</div>}
        {done[cur] && (
          <div className="g5-fb good g5-step">
            <div className="g5-row" style={{ gap: 18, flexWrap: 'wrap' }}>
              <span><b>{t(S12.mCap)}:</b> {t(task.method)}</span>
              <span className="g5-fx sm">{t(task.show)}</span>
            </div>
            <div style={{ marginTop: 6 }}><GcdFx a={task.a} b={task.b} value={task.g} size="md" /></div>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 13 — КЛАССИФИКАЦИЯ + БОНУС-КАРТОЧКА
// ============================================================
const S13_PAIRS = [
  { a: 8, b: 9, g: 1 },
  { a: 6, b: 10, g: 2 },
  { a: 7, b: 12, g: 1 },
  { a: 15, b: 20, g: 5 },
  { a: 5, b: 9, g: 1 },
  { a: 14, b: 21, g: 7 },
];

const S13 = {
  title: { ru: 'Разложите пары по двум категориям', uz: "Juftliklarni ikki toifaga ajrating" },
  cue: { ru: 'Нажмите категорию под каждой парой', uz: 'Har bir juftlik ostidagi toifani bosing' },
  eq: { ru: '= 1', uz: '= 1' },
  gt: { ru: '> 1', uz: '> 1' },
  wrongEq: { ru: 'У этой пары есть общий делитель больше единицы.', uz: "Bu juftlikning birdan katta umumiy bo'luvchisi bor." },
  wrongGt: { ru: 'У этой пары общих делителей больше единицы нет.', uz: "Bu juftlikning birdan katta umumiy bo'luvchisi yo'q." },
  expl: {
    ru: 'Если НОД равен единице, числа называют взаимно простыми. Если НОД больше единицы, у чисел есть общая часть, на которую делятся оба.',
    uz: "Agar EKUB birga teng bo'lsa, sonlar o'zaro tub deyiladi. Agar EKUB birdan katta bo'lsa, sonlarda ikkalasi ham bo'linadigan umumiy qism bor.",
  },
  bonusCap: { ru: 'Бонус-факт', uz: 'Bonus fakt' },
  bonus: { ru: 'НОД помогает сокращать дроби.', uz: "EKUB kasrlarni qisqartirishga yordam beradi." },
  bonusWhy: { ru: 'Числитель и знаменатель делим на их наибольший общий делитель.', uz: "Surat va maxrajni ularning eng katta umumiy bo'luvchisiga bo'lamiz." },
  audio: {
    idle: {
      ru: ['Шесть пар и две категории. Для каждой пары нажмите нужную категорию.'],
      uz: ["Oltita juftlik va ikkita toifa. Har bir juftlik uchun kerakli toifani bosing."],
    },
    done: {
      ru: [
        'Все пары разложены верно.',
        'Если наибольший общий делитель равен единице, числа называют взаимно простыми. Если он больше единицы, у чисел есть общая часть.',
        'И бонус. Наибольший общий делитель помогает сокращать дроби. Восемнадцать двадцать четвёртых делим на шесть и получаем три четвёртых.',
      ],
      uz: [
        "Barcha juftliklar to'g'ri ajratildi.",
        "Agar eng katta umumiy bo'luvchi birga teng bo'lsa, sonlar o'zaro tub deyiladi. Agar u birdan katta bo'lsa, sonlarda umumiy qism bor.",
        "Va bonus. Eng katta umumiy bo'luvchi kasrlarni qisqartirishga yordam beradi. Yigirma to'rtdan o'n sakkizni oltiga bo'lsak, to'rtdan uch chiqadi.",
      ],
    },
  },
};

function Screen13({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const [state, setState] = useState(() => (storedAnswer && storedAnswer.state) || S13_PAIRS.map(() => null));
  const [wrong, setWrong] = useState({});
  const triesRef = useRef(0);
  const allDone = state.every((x) => x === 'ok');
  const firstWrongKey = Object.keys(wrong)[0];
  const baseLines = useVoiceLines(S13.audio, allDone ? 'done' : 'idle');
  const wrongLine = (!allDone && firstWrongKey !== undefined)
    ? (wrong[firstWrongKey] === 'eq' ? S13.wrongEq : S13.wrongGt)[lang] : null;
  const audio = useVoice(
    's13_' + (allDone ? 'done' : wrongLine ? 'w' + firstWrongKey + wrong[firstWrongKey] : 'idle'),
    wrongLine ? [wrongLine] : baseLines,
  );

  const put = (i, isOne) => {
    if (state[i] === 'ok') return;
    triesRef.current += 1;
    const right = (S13_PAIRS[i].g === 1) === isOne;
    if (!right) { setWrong({ ...wrong, [i]: isOne ? 'eq' : 'gt' }); return; }
    const ns = state.slice();
    ns[i] = 'ok';
    setState(ns);
    const nw = { ...wrong }; delete nw[i]; setWrong(nw);
    onAnswer({ screen: 13, kind: 'classify', state: ns, firstTry: triesRef.current === S13_PAIRS.length });
  };

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={onNext} nextDisabled={!allDone || !audio.canAdvance}>
      <div className="g5-col" style={{ gap: 6 }}>
        <h1 className="g5-h1 sm">{t(S13.title)}</h1>
        {!allDone && <Cue>{t(S13.cue)}</Cue>}
      </div>

      <div className="g5-pairs">
        {S13_PAIRS.map((p, i) => {
          const ok = state[i] === 'ok';
          const wr = wrong[i];
          return (
            <div className={'g5-pair ' + (ok ? 'isDone' : '')} key={i}>
              <div className="pv">{p.a} · {p.b}{ok && <span style={{ color: '#287B54' }}> = {p.g}</span>}</div>
              <div className="pb">
                <button type="button" aria-label={p.a + ' ' + p.b + ' = 1'}
                  className={'g5-mini ' + (ok ? (p.g === 1 ? 'isRight' : 'isOff') : wr === 'eq' ? 'isWrong' : '')}
                  onClick={() => put(i, true)} disabled={ok}>{t(S13.eq)}</button>
                <button type="button" aria-label={p.a + ' ' + p.b + ' > 1'}
                  className={'g5-mini ' + (ok ? (p.g > 1 ? 'isRight' : 'isOff') : wr === 'gt' ? 'isWrong' : '')}
                  onClick={() => put(i, false)} disabled={ok}>{t(S13.gt)}</button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ minHeight: 148 }}>
        {!allDone && firstWrongKey !== undefined && (
          <div className="g5-fb bad">{t(wrong[firstWrongKey] === 'eq' ? S13.wrongEq : S13.wrongGt)}</div>
        )}
        {allDone && (
          <div className="g5-col" style={{ gap: 10 }}>
            <div className="g5-fb good g5-step">{t(S13.expl)}</div>
            <div className="g5-bonus g5-step d2">
              <div className="g5-col" style={{ gap: 3, flex: '1 1 auto' }}>
                <span className="bCap">{t(S13.bonusCap)}</span>
                <span className="bText">{t(S13.bonus)}</span>
                <span className="bText" style={{ color: '#667174', fontSize: 14 }}>{t(S13.bonusWhy)}</span>
              </div>
              <div className="g5-fx md teal" style={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}>
                <Frac n={18} d={24} size={22} /> : 6 = <Frac n={3} d={4} size={22} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 14 — ФИНАЛЬНЫЙ МИКС (5 заданий)
// ============================================================
const S14_TASKS = [
  {
    fx: { ru: 'НОД(20; 30) = ?', uz: 'EKUB(20; 30) = ?' },
    tag: { ru: 'через списки', uz: "ro'yxat orqali" },
    opts: [2, 5, 10, 15], g: 10,
    sol: { ru: 'Общие делители 20 и 30: 1, 2, 5, 10. Самый большой — 10.', uz: "20 va 30 ning umumiy bo'luvchilari: 1, 2, 5, 10. Eng kattasi — 10." },
    fb: {
      2: { ru: '2 делит оба, но 10 тоже делит оба и оно больше.', uz: "2 ikkalasini ham bo'ladi, lekin 10 ham bo'ladi va u kattaroq." },
      5: { ru: '5 общий делитель, но не самый большой: есть ещё 10.', uz: "5 umumiy bo'luvchi, lekin eng kattasi emas: yana 10 bor." },
      15: { ru: '20 на 15 не делится: остаток 5.', uz: "20 o'n beshga bo'linmaydi: qoldiq 5." },
    },
  },
  {
    fx: { ru: 'НОД(36; 48) = ?', uz: 'EKUB(36; 48) = ?' },
    tag: { ru: 'через простые множители', uz: "tub ko'paytuvchilar orqali" },
    opts: [6, 9, 12, 18], g: 12,
    sol: { ru: '36 = 2² · 3², 48 = 2⁴ · 3. Общие множители 2² · 3 = 12.', uz: "36 = 2² · 3², 48 = 2⁴ · 3. Umumiy ko'paytuvchilar 2² · 3 = 12." },
    fb: {
      6: { ru: '6 делит оба, но общих множителей больше: 2 · 2 · 3 = 12.', uz: "6 ikkalasini ham bo'ladi, lekin umumiy ko'paytuvchilar ko'proq: 2 · 2 · 3 = 12." },
      9: { ru: '48 на 9 не делится: остаток 3.', uz: "48 to'qqizga bo'linmaydi: qoldiq 3." },
      18: { ru: '48 на 18 не делится: остаток 12.', uz: "48 o'n sakkizga bo'linmaydi: qoldiq 12." },
    },
  },
  {
    fx: { ru: 'У какой пары НОД = 1?', uz: 'Qaysi juftlikda EKUB = 1?' },
    tag: { ru: 'взаимно простые', uz: "o'zaro tub" },
    opts: ['8; 12', '10; 21', '9; 15', '14; 35'], g: '10; 21',
    sol: { ru: 'У 10 и 21 нет общих делителей, кроме единицы. Это взаимно простые числа.', uz: "10 va 21 ning birdan boshqa umumiy bo'luvchisi yo'q. Bu o'zaro tub sonlar." },
    fb: {
      '8; 12': { ru: '8 и 12 оба делятся на 4, значит НОД = 4.', uz: "8 va 12 ikkalasi ham 4 ga bo'linadi, demak EKUB = 4." },
      '9; 15': { ru: '9 и 15 оба делятся на 3, значит НОД = 3.', uz: "9 va 15 ikkalasi ham 3 ga bo'linadi, demak EKUB = 3." },
      '14; 35': { ru: '14 и 35 оба делятся на 7, значит НОД = 7.', uz: "14 va 35 ikkalasi ham 7 ga bo'linadi, demak EKUB = 7." },
    },
  },
  {
    fx: { ru: 'НОД(11; 44) = ?', uz: 'EKUB(11; 44) = ?' },
    tag: { ru: 'короткий случай', uz: 'qisqa holat' },
    opts: [1, 4, 11, 44], g: 11,
    sol: { ru: '44 : 11 = 4 без остатка. Большее делится на меньшее, значит НОД равен меньшему числу.', uz: "44 : 11 = 4 qoldiqsiz. Katta son kichigiga bo'linadi, demak EKUB kichik songa teng." },
    fb: {
      1: { ru: '1 всегда общий делитель, но здесь есть общий делитель больше.', uz: "1 doim umumiy bo'luvchi, lekin bu yerda undan katta umumiy bo'luvchi bor." },
      4: { ru: '11 на 4 не делится: остаток 3.', uz: "11 to'rtga bo'linmaydi: qoldiq 3." },
      44: { ru: '11 меньше 44, на 44 оно делиться не может.', uz: "11 son 44 dan kichik, u 44 ga bo'lina olmaydi." },
    },
  },
  {
    fx: { ru: '32 конфеты и 48 печений — максимум одинаковых пакетов?', uz: "32 ta konfet va 48 ta pechene — eng ko'pi nechta bir xil paket?" },
    tag: { ru: 'жизненная задача', uz: 'hayotiy masala' },
    opts: [4, 8, 16, 24], g: 16,
    sol: { ru: 'НОД(32; 48) = 16. В каждом пакете 2 конфеты и 3 печенья.', uz: "EKUB(32; 48) = 16. Har bir paketda 2 ta konfet va 3 ta pechene bo'ladi." },
    fb: {
      4: { ru: '4 подходит, но пакетов можно сделать больше.', uz: "4 to'g'ri keladi, lekin paketlarni ko'proq qilish mumkin." },
      8: { ru: '8 тоже общий делитель, но не самый большой.', uz: "8 ham umumiy bo'luvchi, lekin eng kattasi emas." },
      24: { ru: '32 на 24 не делится: остаток 8.', uz: "32 yigirma to'rtga bo'linmaydi: qoldiq 8." },
    },
  },
];

const S14 = {
  title: { ru: 'Финальный микс', uz: 'Yakuniy aralashma' },
  cue: { ru: 'Выберите ответ', uz: 'Javobni tanlang' },
  audio: {
    q0: { ru: ['Задание первое. Наибольший общий делитель двадцати и тридцати. Выберите ответ.'], uz: ["Birinchi topshiriq. Yigirma va o'ttizning eng katta umumiy bo'luvchisi. Javobni tanlang."] },
    q1: { ru: ['Задание второе. Тридцать шесть и сорок восемь через простые множители.'], uz: ["Ikkinchi topshiriq. O'ttiz olti va qirq sakkiz tub ko'paytuvchilar orqali."] },
    q2: { ru: ['Задание третье. Найдите пару взаимно простых чисел.'], uz: ["Uchinchi topshiriq. O'zaro tub sonlar juftligini toping."] },
    q3: { ru: ['Задание четвёртое. Одиннадцать и сорок четыре. Это короткий случай.'], uz: ["To'rtinchi topshiriq. O'n bir va qirq to'rt. Bu qisqa holat."] },
    q4: { ru: ['Задание пятое. Тридцать две конфеты и сорок восемь печений.'], uz: ["Beshinchi topshiriq. O'ttiz ikkita konfet va qirq sakkizta pechene."] },
    a0: { ru: ['Верно, десять. Общие делители двадцати и тридцати это один, два, пять и десять.'], uz: ["To'g'ri, o'n. Yigirma va o'ttizning umumiy bo'luvchilari bir, ikki, besh va o'n."] },
    a1: { ru: ['Верно, двенадцать. Общие множители дают два умножить на два умножить на три.'], uz: ["To'g'ri, o'n ikki. Umumiy ko'paytuvchilar ikki karra ikki karra uchni beradi."] },
    a2: { ru: ['Верно, десять и двадцать один. Общих делителей, кроме единицы, у них нет.'], uz: ["To'g'ri, o'n va yigirma bir. Ularning birdan boshqa umumiy bo'luvchisi yo'q."] },
    a3: { ru: ['Верно, одиннадцать. Сорок четыре делится на одиннадцать без остатка.'], uz: ["To'g'ri, o'n bir. Qirq to'rt o'n birga qoldiqsiz bo'linadi."] },
    a4: { ru: ['Верно, шестнадцать пакетов. В каждом окажется две конфеты и три печенья. Все пять заданий решены.'], uz: ["To'g'ri, o'n oltita paket. Har birida ikkita konfet va uchta pechene bo'ladi. Beshala topshiriq yechildi."] },
  },
};

function Screen14({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const [cur, setCur] = useState(() => (storedAnswer && storedAnswer.cur) || 0);
  const [done, setDone] = useState(() => (storedAnswer && storedAnswer.done) || [false, false, false, false, false]);
  const [pick, setPick] = useState(null);
  const triesRef = useRef(0);
  const task = S14_TASKS[cur];
  const baseLines = useVoiceLines(S14.audio, done[cur] ? 'a' + cur : 'q' + cur);
  const wrongLine = (!done[cur] && pick !== null && task.fb[pick]) ? task.fb[pick][lang] : null;
  const audio = useVoice('s14_' + cur + '_' + (done[cur] ? 'a' : wrongLine ? 'w' + pick : 'q'),
    wrongLine ? [wrongLine] : baseLines);

  const choose = (n) => {
    if (done[cur]) return;
    triesRef.current += 1;
    setPick(n);
    if (n !== task.g) return;
    const nd = done.slice();
    nd[cur] = true;
    setDone(nd);
    onAnswer({ screen: 14, kind: 'final', cur, done: nd, firstTry: triesRef.current === 1 });
  };

  const goNext = () => {
    if (!done[cur] || cur >= 4) return;
    setPick(null); triesRef.current = 0;
    setCur(cur + 1);
    onAnswer({ screen: 14, kind: 'final', cur: cur + 1, done });
  };

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={done[cur] && cur < 4 ? goNext : onNext}
      nextDisabled={!done[cur] || !audio.canAdvance}
      nextLabel={done[cur] && cur < 4 ? (lang === 'uz' ? 'Keyingi topshiriq' : 'Следующее задание') : undefined}>
      <div className="g5-row" style={{ justifyContent: 'space-between' }}>
        <h1 className="g5-h1 sm">{t(S14.title)}</h1>
        <Pips total={5} current={cur} done={done} />
      </div>

      <div className="g5-card g5-col" style={{ gap: 9, minHeight: 116, justifyContent: 'center' }}>
        <span className="g5-note" style={{ fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#126E73' }}>{t(task.tag)}</span>
        <span className="g5-fx lg">{t(task.fx)}</span>
      </div>

      <div className="g5-col" style={{ gap: 8 }}>
        {!done[cur] && <Cue>{t(S14.cue)}</Cue>}
        <div className={'g5-opts c4 ' + (pick || done[cur] ? '' : 'g5-live')} style={{ maxWidth: 620, borderRadius: 16 }}>
          {task.opts.map((n) => (
            <button key={String(n)} type="button"
              className={'g5-opt ' + (done[cur] ? (n === task.g ? 'isRight' : 'isMuted') : pick === n ? 'isWrong' : '')}
              onClick={() => choose(n)} disabled={done[cur]} aria-label={String(n)}>
              <span className="num">{n}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ minHeight: 86 }}>
        {pick !== null && !done[cur] && task.fb[pick] && <div className="g5-fb bad">{t(task.fb[pick])}</div>}
        {done[cur] && <div className="g5-fb good g5-step">{t(task.sol)}</div>}
      </div>
    </Shell>
  );
}

// ============================================================
// ЭКРАН 15 — ИТОГ УРОКА
// ============================================================
const S15 = {
  title: { ru: 'Что я изучил за урок', uz: "Darsda nimani o'rgandim" },
  skills: [
    { ru: 'Нахожу общие делители двух чисел', uz: "Ikki sonning umumiy bo'luvchilarini topaman" },
    { ru: 'Выбираю из них самый большой', uz: 'Ular ichidan eng kattasini tanlayman' },
    { ru: 'Использую разложение на простые множители', uz: "Tub ko'paytuvchilarga ajratishdan foydalanaman" },
    { ru: 'Узнаю взаимно простые числа', uz: "O'zaro tub sonlarni taniyman" },
  ],
  mainCap: { ru: 'Главный результат', uz: 'Asosiy natija' },
  nextCap: { ru: 'Следующая тема', uz: 'Keyingi mavzu' },
  nextTopic: { ru: 'Наименьшее общее кратное', uz: 'Eng kichik umumiy karrali' },
  finish: { ru: 'Завершить урок', uz: 'Darsni yakunlash' },
  audio: {
    a: {
      ru: [
        'Урок закончен. Коротко о том, что вы теперь умеете.',
        'Первое. Находить общие делители двух чисел.',
        'Второе. Выбирать из них самый большой.',
        'Третье. Пользоваться разложением на простые множители, когда числа большие.',
        'Четвёртое. Узнавать взаимно простые числа, у которых наибольший общий делитель равен единице.',
        'Главный результат урока. Наибольший общий делитель двенадцати и восемнадцати равен шести. Следующая тема это наименьшее общее кратное.',
      ],
      uz: [
        "Dars tugadi. Endi nimalarni bilishingiz haqida qisqacha.",
        "Birinchi. Ikki sonning umumiy bo'luvchilarini topish.",
        "Ikkinchi. Ular ichidan eng kattasini tanlash.",
        "Uchinchi. Sonlar katta bo'lganda tub ko'paytuvchilarga ajratishdan foydalanish.",
        "To'rtinchi. Eng katta umumiy bo'luvchisi birga teng bo'lgan o'zaro tub sonlarni tanish.",
        "Darsning asosiy natijasi. O'n ikki va o'n sakkizning eng katta umumiy bo'luvchisi oltiga teng. Keyingi mavzu eng kichik umumiy karrali.",
      ],
    },
  },
};

function Screen15({ screen, totalScreens, onPrev, finishLesson }) {
  const t = useT();
  const audio = useVoice('s15', useVoiceLines(S15.audio, 'a'));
  const [shown, setShown] = useState(0);

  // Карточки появляются по очереди вместе с озвучкой. При выключенном звуке
  // порядок сохраняется: таймер не зависит от TTS.
  useEffect(() => {
    const ids = [0, 1, 2, 3].map((i) => setTimeout(() => setShown((s) => Math.max(s, i + 1)), 500 + i * 900));
    return () => ids.forEach(clearTimeout);
  }, []);

  return (
    <Shell screen={screen} totalScreens={totalScreens} eyebrow={EYEBROW} audio={audio}
      onPrev={onPrev} onNext={finishLesson} nextDisabled={false} nextLabel={t(S15.finish)}>
      <h1 className="g5-h1">{t(S15.title)}</h1>

      <div className="g5-skills">
        {S15.skills.map((s, i) => (
          <div className="g5-skill" key={i} style={{ visibility: shown > i ? 'visible' : 'hidden', animationDelay: '0ms' }}>
            <span className="sNo">{String(i + 1).padStart(2, '0')}</span>
            <span className="sText">{t(s)}</span>
          </div>
        ))}
      </div>

      <div className="g5-final">
        <div className="fMain">
          <span className="cap">{t(S15.mainCap)}</span>
          <GcdFx a={12} b={18} value={6} size="lg" />
        </div>
        <div className="fNext">
          <span className="cap">{t(S15.nextCap)}</span>
          <span className="g5-fx md teal" style={{ fontSize: 20 }}>{t(S15.nextTopic)}</span>
        </div>
      </div>
    </Shell>
  );
}

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ — default export (контракт платформы §1)
// ============================================================
const SCREENS = [
  Screen01, Screen02, Screen03, Screen04, Screen05,
  Screen06, Screen07, Screen08, Screen09, Screen10,
  Screen11, Screen12, Screen13, Screen14, Screen15,
];

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
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers((prev) => { const next = prev.slice(); next[screenIdx] = data; return next; });
  }, []);

  const finishLesson = useCallback(() => {
    const checked = answers.filter((a) => a && typeof a.firstTry === 'boolean');
    safeOnFinished({
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: null, correctAnswers: null, scorePercent: null,
      finalScore: null, finalTotal: null, passed: null,
      firstTryStats: { total: checked.length, firstTryCorrect: checked.filter((a) => a.firstTry === true).length },
      answers: answers.filter(Boolean),
    });
  }, [answers, safeOnFinished]);

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

  const Current = SCREENS[current];
  // Экран 1 (хук) при возврате начинается ЗАНОВО — требование ТЗ.
  // Остальные экраны сохраняют ответ.
  const stored = current === 0 ? undefined : answers[current];

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <style>{D05_CSS}</style>
      <div className="lesson-root g6d05">
        {isPreview && (
          <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 4, background: '#FFFFFF', borderRadius: 99, padding: 4, boxShadow: '0 4px 12px -4px rgba(24, 34, 36, 0.22)' }}>
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
        <Current
          key={'scr' + current}
          screen={current}
          studentName={safeName}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={stored}
          onAnswer={handleAnswer}
          onNext={next}
          onPrev={prev}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
