// УРОК 6 класса № 5 — «Наибольший общий делитель (НОД)» / "Eng katta umumiy bo'luvchi (EKUB)".
// lessonId: div_6_05.
//
// Инфраструктура НЕ дублируется: движок (AudioEngine, useAudio, Stage, навигация,
// контракт TTS v5.2 с языковым маркером) импортируется из Dars01.jsx — он де-факто
// служит общим модулем для Dars07–46. Прежняя версия этого файла держала свою копию
// движка на 1260 строк; копия удалена, поведение звука и замка «Продолжить» прежнее.
//
// Визуальный слой урока — собственный, по заданию методиста: фон #F4EFE6, карточки,
// бирюзовый/оранжевый/зелёный, только CSS и встроенные SVG. Ни одной растровой картинки,
// ни одного тега img. Стили ограничены классом .g6d05, поэтому остальные 45 уроков
// 6 класса не затрагиваются.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Floaters,
  mt,
  STYLES,
} from './Dars01.jsx';

const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'div_6_05',
  lessonTitle: { ru: 'Наибольший общий делитель', uz: "Eng katta umumiy bo'luvchi" },
};

// ============================================================
// СТИЛИ УРОКА. Всё под .g6d05 — тема 6 класса задаёт фон через
// `.lesson-root { background: ... !important }`, поэтому перебиваем
// селектором из двух классов: он специфичнее и выигрывает.
// Внутри шаблонной строки НЕ ДОЛЖНО быть обратных кавычек — они рвут файл.
// ============================================================
const D05_CSS = `
.lesson-root.g6d05 {
  --p-bg: #F4EFE6;
  --p-card: rgba(255, 253, 250, 0.93);
  --p-ink: #182224;
  --p-ink2: #667174;
  --p-teal: #126E73;
  --p-teal-soft: #DCEEED;
  --p-orange: #E75A2C;
  --p-orange-soft: #F9DFD2;
  --p-green: #287B54;
  --p-green-soft: #E0F0E6;
  --p-line: rgba(24, 34, 36, 0.13);
  --p-ui: 'Manrope', system-ui, -apple-system, sans-serif;
  --p-disp: 'Source Serif 4', 'Fraunces', Georgia, serif;
  --p-mono: 'JetBrains Mono', ui-monospace, Menlo, monospace;
  --p-fast: 220ms;
  --p-math: 520ms;
  --p-ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  background: var(--p-bg) !important;
  color: var(--p-ink);
  font-family: var(--p-ui) !important;
}

/* Урок живёт в одном экране 1366x768: прокрутки нет нигде, включая контент.
   Тема 6 класса разрешает .stage-content скроллиться — здесь запрещаем. */
.lesson-root.g6d05,
.lesson-root.g6d05 .stage { height: 100dvh; max-height: 100dvh; overflow: hidden !important; }
.lesson-root.g6d05 .stage { display: flex; flex-direction: column; }
.lesson-root.g6d05 .stage-content {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 8px;
  padding-bottom: 8px;
}
.lesson-root.g6d05 .stage-nav { flex: 0 0 auto; }
.lesson-root.g6d05 .progress-bar { background: var(--p-orange); }
.lesson-root.g6d05 .chrome-left .dot { background: var(--p-orange); }

.g6d05 .d5-wrap {
  width: 100%;
  max-width: 1060px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
}
.g6d05 h2.d5-h1 {
  font-family: var(--p-disp);
  font-size: clamp(26px, 3.1vw, 40px);
  line-height: 1.12;
  font-weight: 600;
  color: var(--p-ink);
  margin: 0;
  letter-spacing: -0.01em;
}
.g6d05 p.d5-lead {
  font-family: var(--p-ui);
  font-size: clamp(15px, 1.35vw, 18px);
  line-height: 1.45;
  color: var(--p-ink2);
  margin: 0;
  max-width: 70ch;
}
.g6d05 .d5-card {
  background: var(--p-card);
  border: 1px solid var(--p-line);
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 8px 22px -14px rgba(24, 34, 36, 0.35);
}
.g6d05 .d5-row { display: flex; gap: 14px; align-items: stretch; flex-wrap: wrap; }
.g6d05 .d5-col { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.g6d05 .d5-mono {
  font-family: var(--p-mono);
  font-variant-numeric: tabular-nums;
  color: var(--p-ink);
}
.g6d05 .d5-formula {
  font-family: var(--p-mono);
  font-size: clamp(24px, 2.6vw, 38px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--p-ink);
}
.g6d05 .d5-formula.is-teal { color: var(--p-teal); }
.g6d05 .d5-formula.is-green { color: var(--p-green); }
.g6d05 .d5-cap {
  font-family: var(--p-ui);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--p-ink2);
}

/* Подсказка «куда нажать»: оранжевая рамка и мягкая пульсация. */
.g6d05 .d5-hint {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--p-ui);
  font-size: 14px;
  font-weight: 700;
  color: var(--p-orange);
  background: var(--p-orange-soft);
  border-radius: 99px;
  padding: 7px 14px;
  align-self: flex-start;
}
.g6d05 .d5-hint .d5-hint-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--p-orange);
  animation: d5pulse 1.6s var(--p-ease) infinite;
}
@keyframes d5pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.7); } }

.g6d05 .d5-zone { border: 2px solid var(--p-orange); border-radius: 14px; animation: d5zone 2s var(--p-ease) infinite; }
@keyframes d5zone { 0%,100% { box-shadow: 0 0 0 0 rgba(231, 90, 44, 0.28); } 50% { box-shadow: 0 0 0 7px rgba(231, 90, 44, 0); } }

/* Кнопки-варианты. Все состояния обязательны по ТЗ. */
.g6d05 button.d5-opt {
  font-family: var(--p-ui);
  font-size: clamp(16px, 1.5vw, 20px);
  font-weight: 700;
  color: var(--p-ink);
  background: var(--p-card);
  border: 1.5px solid var(--p-line);
  border-radius: 13px;
  padding: 12px 16px;
  min-height: 50px;
  cursor: pointer;
  transition: background var(--p-fast) var(--p-ease), border-color var(--p-fast) var(--p-ease), transform var(--p-fast) var(--p-ease);
  text-align: left;
}
.g6d05 button.d5-opt:hover:not(:disabled) { border-color: var(--p-orange); background: #FFFFFF; }
.g6d05 button.d5-opt:active:not(:disabled) { transform: translateY(1px); }
.g6d05 button.d5-opt:focus-visible { outline: 3px solid var(--p-teal); outline-offset: 2px; }
.g6d05 button.d5-opt:disabled { cursor: default; opacity: 0.55; }
.g6d05 button.d5-opt.is-armed { border-color: var(--p-orange); }
.g6d05 button.d5-opt.is-wrong { background: var(--p-orange-soft); border-color: var(--p-orange); color: var(--p-ink); }
.g6d05 button.d5-opt.is-right { background: var(--p-green-soft); border-color: var(--p-green); color: var(--p-green); }
/* ТЗ: «варианты ответа: 16-20 px». Числовой вариант остаётся моноширинным,
   но не выходит за верхнюю границу диапазона. */
.g6d05 button.d5-opt.is-num { font-family: var(--p-mono); font-size: clamp(17px, 1.6vw, 20px); text-align: center; }

.g6d05 .d5-opts { display: grid; gap: 10px; }
.g6d05 .d5-opts.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.g6d05 .d5-opts.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.g6d05 .d5-opts.cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.g6d05 .d5-opts.cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }

/* Комментарий к ответу. Полноэкранного красного нет — только мягкий фон. */
.g6d05 .d5-fb {
  border-radius: 13px;
  padding: 12px 15px;
  font-family: var(--p-ui);
  font-size: clamp(14px, 1.25vw, 17px);
  line-height: 1.45;
  animation: d5in var(--p-math) var(--p-ease) both;
}
.g6d05 .d5-fb.bad { background: var(--p-orange-soft); color: var(--p-ink); border: 1px solid rgba(231, 90, 44, 0.4); }
.g6d05 .d5-fb.good { background: var(--p-green-soft); color: var(--p-ink); border: 1px solid rgba(40, 123, 84, 0.4); }

.g6d05 .d5-step {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--p-mono);
  font-size: clamp(17px, 1.7vw, 24px);
  font-weight: 600;
  color: var(--p-ink);
  animation: d5in var(--p-math) var(--p-ease) both;
}
@keyframes d5in { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: none; } }

/* Числа-фишки: делители, множители. */
.g6d05 .d5-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.g6d05 .d5-chip {
  font-family: var(--p-mono);
  font-size: clamp(15px, 1.5vw, 21px);
  font-weight: 700;
  min-width: 42px;
  padding: 7px 10px;
  text-align: center;
  border-radius: 10px;
  border: 1.5px solid var(--p-line);
  background: #FFFFFF;
  color: var(--p-ink2);
  transition: background var(--p-math) var(--p-ease), color var(--p-math) var(--p-ease), border-color var(--p-math) var(--p-ease), transform var(--p-math) var(--p-ease);
}
.g6d05 .d5-chip.is-common { background: var(--p-teal-soft); border-color: var(--p-teal); color: var(--p-teal); }
.g6d05 .d5-chip.is-best { background: var(--p-orange); border-color: var(--p-orange); color: #FFFFFF; transform: scale(1.1); }
.g6d05 button.d5-chip { cursor: pointer; }
.g6d05 button.d5-chip:hover:not(:disabled) { border-color: var(--p-orange); }
.g6d05 button.d5-chip:active:not(:disabled) { transform: translateY(1px); }
.g6d05 button.d5-chip:focus-visible { outline: 3px solid var(--p-teal); outline-offset: 2px; }
.g6d05 button.d5-chip:disabled { cursor: default; opacity: 0.5; }

/* Шаги-вкладки: будущий шаг недоступен. */
.g6d05 .d5-steps { display: flex; gap: 8px; flex-wrap: wrap; }
.g6d05 button.d5-tab {
  font-family: var(--p-ui);
  font-size: 14px;
  font-weight: 700;
  border-radius: 99px;
  padding: 9px 15px;
  border: 1.5px solid var(--p-line);
  background: var(--p-card);
  color: var(--p-ink2);
  cursor: pointer;
  transition: all var(--p-fast) var(--p-ease);
}
.g6d05 button.d5-tab:hover:not(:disabled) { border-color: var(--p-orange); color: var(--p-orange); }
.g6d05 button.d5-tab:active:not(:disabled) { transform: translateY(1px); }
.g6d05 button.d5-tab.is-active { border-color: var(--p-orange); color: var(--p-orange); background: var(--p-orange-soft); }
.g6d05 button.d5-tab.is-done { border-color: var(--p-green); color: var(--p-green); background: var(--p-green-soft); }
.g6d05 button.d5-tab:disabled { cursor: default; opacity: 0.45; }
.g6d05 button.d5-tab:focus-visible { outline: 3px solid var(--p-teal); outline-offset: 2px; }

/* Счёт (чек) — только CSS, без картинок. */
.g6d05 .d5-bill {
  background: #FFFFFF;
  border: 1px solid var(--p-line);
  border-radius: 12px;
  padding: 13px 15px;
  min-width: 150px;
  position: relative;
}
.g6d05 .d5-bill::after {
  content: '';
  position: absolute; left: 0; right: 0; bottom: -1px; height: 7px;
  background: repeating-linear-gradient(135deg, transparent 0 6px, var(--p-bg) 6px 12px);
}
.g6d05 .d5-bill-sum { font-family: var(--p-mono); font-size: clamp(22px, 2.2vw, 31px); font-weight: 800; color: var(--p-ink); }
.g6d05 .d5-people { display: flex; gap: 6px; flex-wrap: wrap; min-height: 40px; align-items: center; }
.g6d05 .d5-person { animation: d5pop var(--p-math) var(--p-ease) both; }
@keyframes d5pop { from { opacity: 0; transform: translateY(8px) scale(0.8); } to { opacity: 1; transform: none; } }

.g6d05 .d5-input {
  font-family: var(--p-mono);
  font-size: clamp(20px, 2vw, 28px);
  font-weight: 700;
  width: 120px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 2px solid var(--p-line);
  background: #FFFFFF;
  color: var(--p-ink);
  text-align: center;
}
.g6d05 .d5-input:focus { outline: none; border-color: var(--p-orange); }
.g6d05 .d5-input.is-right { border-color: var(--p-green); background: var(--p-green-soft); }
.g6d05 .d5-input.is-wrong { border-color: var(--p-orange); background: var(--p-orange-soft); }

.g6d05 button.d5-btn {
  font-family: var(--p-ui);
  font-size: 15px;
  font-weight: 700;
  border-radius: 12px;
  padding: 12px 20px;
  border: none;
  background: var(--p-orange);
  color: #FFFFFF;
  cursor: pointer;
  transition: filter var(--p-fast) var(--p-ease), transform var(--p-fast) var(--p-ease);
}
.g6d05 button.d5-btn:hover:not(:disabled) { filter: brightness(1.07); }
.g6d05 button.d5-btn:active:not(:disabled) { transform: translateY(1px); }
.g6d05 button.d5-btn:focus-visible { outline: 3px solid var(--p-teal); outline-offset: 2px; }
.g6d05 button.d5-btn:disabled { background: #C9C4BC; cursor: default; }
.g6d05 button.d5-btn.is-teal { background: var(--p-teal); }

.g6d05 .d5-tasknum {
  font-family: var(--p-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--p-ink2);
  letter-spacing: 0.05em;
}
.g6d05 .d5-dots { display: flex; gap: 6px; }
.g6d05 .d5-dots i { width: 22px; height: 5px; border-radius: 99px; background: var(--p-line); display: block; transition: background var(--p-fast) var(--p-ease); }
.g6d05 .d5-dots i.is-done { background: var(--p-green); }
.g6d05 .d5-dots i.is-now { background: var(--p-orange); }

.g6d05 .d5-rule {
  border: 1.5px solid var(--p-line);
  border-radius: 13px;
  background: var(--p-card);
  padding: 13px 15px;
  cursor: pointer;
  text-align: left;
  font-family: var(--p-ui);
  transition: border-color var(--p-fast) var(--p-ease);
  width: 100%;
}
.g6d05 .d5-rule:hover:not(:disabled) { border-color: var(--p-teal); }
.g6d05 .d5-rule:active:not(:disabled) { transform: translateY(1px); }
.g6d05 .d5-rule:focus-visible { outline: 3px solid var(--p-teal); outline-offset: 2px; }
.g6d05 .d5-rule:disabled { cursor: default; opacity: 0.55; }
.g6d05 .d5-rule.is-open { border-color: var(--p-teal); background: var(--p-teal-soft); }

.g6d05 .d5-bonus {
  border: 1.5px solid var(--p-teal);
  background: var(--p-teal-soft);
  border-radius: 14px;
  padding: 14px 16px;
  animation: d5in var(--p-math) var(--p-ease) both;
}

.g6d05 .d5-skill {
  display: flex; align-items: center; gap: 11px;
  background: var(--p-card);
  border: 1px solid var(--p-line);
  border-radius: 13px;
  padding: 12px 14px;
  animation: d5in var(--p-math) var(--p-ease) both;
}
.g6d05 .d5-skill-n {
  flex: 0 0 auto;
  width: 29px; height: 29px; border-radius: 50%;
  background: var(--p-green-soft); color: var(--p-green);
  display: grid; place-items: center;
  font-family: var(--p-mono); font-weight: 800; font-size: 14px;
}

/* Ученик мог попросить систему убрать анимацию — уважаем настройку. */
@media (prefers-reduced-motion: reduce) {
  .g6d05 *, .g6d05 *::before, .g6d05 *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}
`;

// ============================================================
// МАТЕМАТИКА
// ============================================================
const divisorsOf = (n) => { const r = []; for (let i = 1; i <= n; i++) if (n % i === 0) r.push(i); return r; };
const gcdOf = (a, b) => { let x = a, y = b; while (y) { const t = x % y; x = y; y = t; } return x; };
const commonDivisors = (a, b) => divisorsOf(a).filter((d) => b % d === 0);
const primeFactors = (n) => { const r = []; let x = n; for (let p = 2; p * p <= x; p++) while (x % p === 0) { r.push(p); x /= p; } if (x > 1) r.push(x); return r; };
const fmtThousands = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// ============================================================
// ОБЩИЕ ЭЛЕМЕНТЫ УРОКА
// ============================================================

// Подсказка «куда нажать». По ТЗ на каждом интерактивном экране.
const ActionHint = ({ text }) => {
  const t = useT();
  return (
    <span className="d5-hint"><span className="d5-hint-dot" aria-hidden="true"/>{t(text)}</span>
  );
};

// Обозначение НОД в формулах. mt() только верстает дроби и числа, ничего не
// переводит, поэтому строку 'НОД(12; 18)' узбекский ученик видел кириллицей —
// в том числе в главном результате урока. Везде, где формула собирается кодом,
// подпись берётся отсюда.
const GCD = { ru: 'НОД', uz: 'EKUB' };

const HINT_TAP = { ru: 'Нажмите число', uz: 'Sonni bosing' };
const HINT_PICK = { ru: 'Выберите ответ', uz: 'Javobni tanlang' };
const HINT_TYPE = { ru: 'Введите число', uz: 'Sonni kiriting' };
const HINT_STEP = { ru: 'Нажмите шаг', uz: 'Qadamni bosing' };

const PersonIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="7.5" r="3.6" fill="#126E73"/>
    <path d="M4.6 20.5c0-4 3.3-6.6 7.4-6.6s7.4 2.6 7.4 6.6" stroke="#126E73" strokeWidth="2.1" strokeLinecap="round"/>
  </svg>
);

// Ряд вариантов с отдельным комментарием на каждый. Повторная попытка разрешена.
const Options = ({ items, correctIdx, picked, onPick, cols = 4, disabled = false, numeric = false }) => {
  const t = useT();
  return (
    <div className={`d5-opts cols-${cols}`}>
      {items.map((it, i) => {
        const isPicked = picked === i;
        const solved = picked !== null && picked === correctIdx;
        const cls = isPicked ? (i === correctIdx ? 'is-right' : 'is-wrong') : (!solved && picked === null ? 'is-armed' : '');
        return (
          <button
            key={i}
            className={`d5-opt ${numeric ? 'is-num' : ''} ${cls}`}
            disabled={disabled || solved}
            aria-label={typeof it === 'object' ? t(it) : String(it)}
            onClick={() => onPick(i)}
          >
            {typeof it === 'object' ? t(it) : mt(String(it))}
          </button>
        );
      })}
    </div>
  );
};

const Feedback = ({ node, good }) => {
  const t = useT();
  if (!node) return null;
  return <div className={`d5-fb ${good ? 'good' : 'bad'}`} role="status">{mt(t(node))}</div>;
};

const Dots = ({ total, done, now }) => (
  <div className="d5-dots" aria-hidden="true">
    {Array.from({ length: total }).map((_, i) => (
      <i key={i} className={i < done ? 'is-done' : i === now ? 'is-now' : ''}/>
    ))}
  </div>
);

// Оболочка экрана: заголовок, подзаголовок, тело, навигация.
const Screen = ({ screen, totalScreens, eyebrow, audio, title, lead, children, onPrev, onNext, nextDisabled, nextLabel }) => {
  const t = useT();
  return (
    <Stage
      eyebrow={eyebrow}
      screen={screen}
      totalScreens={totalScreens}
      audioState={audio}
      navContent={(
        <>
          <NavBack onPrev={onPrev} label={<BackLabel/>}/>
          <NavNext label={nextLabel || <NextLabel/>} onClick={onNext} disabled={nextDisabled}/>
        </>
      )}
    >
      <Floaters/>
      <div className="d5-wrap">
        {title && <h2 className="d5-h1">{mt(t(title))}</h2>}
        {lead && <p className="d5-lead">{mt(t(lead))}</p>}
        {children}
      </div>
    </Stage>
  );
};

// Сегменты озвучки: первый звучит сам, каждый следующий — по действию ученика.
// Именно это даёт «команда -> подсветка -> ожидание -> следующий шаг».
const useStepAudio = (linesByLang) => {
  const lang = useLang();
  const segs = useMemo(() => (linesByLang[lang] || []).map((text, i) => ({
    id: `a${i}`,
    text,
    trigger: i === 0 ? 'on_mount' : `on_event:step_${i}`,
    waits_for: null,
  })), [linesByLang, lang]);
  return useAudio(segs);
};

// ============================================================
// ЭКРАН 1 — ХУК: два счёта
// ============================================================
const S1_AUDIO = {
  ru: [
    'Два счёта в кафе. Первый на двенадцать тысяч сумов, второй на восемнадцать тысяч. Оба нужно разделить поровну между одними и теми же людьми. Выберите, сколько человек смогут это сделать.',
    'Теперь нажмите кнопку и разделите оба счёта.',
    'Шесть человек делят оба счёта без остатка. Двенадцать разделить на шесть равно два, восемнадцать разделить на шесть равно три. Больше шести не получится. Это число называют наибольшим общим делителем.',
  ],
  uz: [
    "Kafeda ikkita hisob. Birinchisi o'n ikki ming so'm, ikkinchisi o'n sakkiz ming so'm. Ikkalasini ham bir xil odamlar orasida teng bo'lish kerak. Nechta odam buni uddalashini tanlang.",
    "Endi tugmani bosing va ikkala hisobni ham bo'ling.",
    "Olti kishi ikkala hisobni ham qoldiqsiz bo'ladi. O'n ikki bo'lingan olti teng ikki, o'n sakkiz bo'lingan olti teng uch. Oltidan ko'p bo'lmaydi. Bu sonni eng katta umumiy bo'luvchi deyishadi.",
  ],
};

function Screen1({ screen, totalScreens, onNext, onPrev }) {
  const t = useT();
  const audio = useStepAudio(S1_AUDIO);
  // Хук по ТЗ начинается заново при каждом заходе — ответ не сохраняется.
  const [pick, setPick] = useState(null);
  const [split, setSplit] = useState(false);
  const [shown, setShown] = useState(0);

  const OPTS = [2, 3, 6, 9];

  useEffect(() => {
    if (!split) return;
    const n = OPTS[pick];
    setShown(0);
    const timers = Array.from({ length: n }, (_, i) => setTimeout(() => setShown(i + 1), 160 * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, [split, pick]);

  const choose = (i) => { setPick(i); setSplit(false); setShown(0); audio.triggerInternal('step_1'); };
  const doSplit = () => { setSplit(true); audio.triggerInternal('step_2'); };

  const n = pick === null ? 0 : OPTS[pick];
  const ok = n === 6;

  return (
    <Screen
      screen={screen} totalScreens={totalScreens} audio={audio}
      eyebrow={{ ru: 'Тема урока', uz: 'Dars mavzusi' }}
      title={{ ru: 'Наибольший общий делитель', uz: "Eng katta umumiy bo'luvchi (EKUB)" }}
      lead={{ ru: 'Сколько человек максимум смогут разделить поровну оба счёта?', uz: "Ko'pi bilan nechta odam ikkala hisobni ham teng bo'la oladi?" }}
      onPrev={onPrev} onNext={onNext} nextDisabled={!audio.canAdvance}
    >
      <div className="d5-row" style={{ gap: 12 }}>
        {[12000, 18000].map((sum) => (
          <div className="d5-bill" key={sum}>
            <div className="d5-cap">{t({ ru: 'Счёт', uz: 'Hisob' })}</div>
            <div className="d5-bill-sum">{fmtThousands(sum)}</div>
            <div className="d5-cap" style={{ textTransform: 'none', letterSpacing: 0 }}>{t({ ru: 'сум', uz: "so'm" })}</div>
          </div>
        ))}
        <div className="d5-col" style={{ flex: '1 1 320px' }}>
          <ActionHint text={pick === null ? HINT_PICK : HINT_TAP}/>
          <div className={`d5-opts cols-4 ${pick === null ? 'd5-zone' : ''}`} style={{ padding: pick === null ? 6 : 0 }}>
            {OPTS.map((v, i) => (
              <button
                key={v}
                className={`d5-opt is-num ${pick === i ? (v === 6 ? 'is-right' : 'is-wrong') : ''}`}
                onClick={() => choose(i)}
                aria-label={`${v} ${t({ ru: 'человек', uz: 'kishi' })}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {pick !== null && !split && (
        <button className="d5-btn" style={{ alignSelf: 'flex-start' }} onClick={doSplit}
          aria-label={t({ ru: 'Разделить оба счёта', uz: "Ikkala hisobni bo'lish" })}>
          {t({ ru: 'Разделить оба счёта', uz: "Ikkala hisobni bo'lish" })}
        </button>
      )}

      {split && (
        <div className="d5-card d5-col">
          <div className="d5-people">
            {Array.from({ length: shown }).map((_, i) => (
              <span className="d5-person" key={i} style={{ animationDelay: `${i * 40}ms` }}><PersonIcon/></span>
            ))}
          </div>
          {shown >= n && (
            <div className="d5-col" style={{ gap: 6 }}>
              <div className="d5-step">{mt(`12 : ${n} = ${12000 / n / 1000 === Math.floor(12000 / n / 1000) && 12 % n === 0 ? 12 / n : '…'}`)}
                <span className="d5-cap" style={{ textTransform: 'none' }}>
                  {12 % n === 0 ? t({ ru: 'делится', uz: "bo'linadi" }) : t({ ru: 'не делится без остатка', uz: "qoldiqsiz bo'linmaydi" })}
                </span>
              </div>
              <div className="d5-step">{mt(`18 : ${n} = ${18 % n === 0 ? 18 / n : '…'}`)}
                <span className="d5-cap" style={{ textTransform: 'none' }}>
                  {18 % n === 0 ? t({ ru: 'делится', uz: "bo'linadi" }) : t({ ru: 'не делится без остатка', uz: "qoldiqsiz bo'linmaydi" })}
                </span>
              </div>
              <Feedback
                good={ok}
                node={ok
                  ? { ru: 'Максимум — 6 человек. Больше шести оба счёта поровну не делятся.', uz: "Ko'pi bilan 6 kishi. Oltidan ko'p bo'lsa, ikkala hisob teng bo'linmaydi." }
                  : (12 % n === 0 && 18 % n === 0)
                    ? { ru: 'Это число делит оба счёта, но оно не самое большое. Попробуйте больше.', uz: "Bu son ikkala hisobni ham bo'ladi, lekin u eng katta emas. Kattaroq sonni sinab ko'ring." }
                    : { ru: 'Хотя бы один счёт на это число поровну не делится. Выберите другое.', uz: "Kamida bitta hisob bu songa teng bo'linmaydi. Boshqa sonni tanlang." }}
              />
            </div>
          )}
        </div>
      )}
    </Screen>
  );
}

// ============================================================
// ЭКРАН 2 — ДВА СПИСКА ДЕЛИТЕЛЕЙ
// ============================================================
const S2_AUDIO = {
  ru: [
    'Найдём наибольший общий делитель по шагам. Нажмите первый шаг: выпишем делители двенадцати.',
    'Делители двенадцати: один, два, три, четыре, шесть и двенадцать. Теперь нажмите второй шаг.',
    'Делители восемнадцати: один, два, три, шесть, девять и восемнадцать. Нажмите третий шаг.',
    'Общие делители встречаются в обоих списках: один, два, три и шесть. Нажмите четвёртый шаг.',
    'Самый большой из общих — шесть. Значит наибольший общий делитель двенадцати и восемнадцати равен шести.',
  ],
  uz: [
    "Eng katta umumiy bo'luvchini bosqichma-bosqich topamiz. Birinchi qadamni bosing, o'n ikkining bo'luvchilarini yozamiz.",
    "O'n ikkining bo'luvchilari: bir, ikki, uch, to'rt, olti va o'n ikki. Endi ikkinchi qadamni bosing.",
    "O'n sakkizning bo'luvchilari: bir, ikki, uch, olti, to'qqiz va o'n sakkiz. Uchinchi qadamni bosing.",
    "Umumiy bo'luvchilar ikkala ro'yxatda ham uchraydi: bir, ikki, uch va olti. To'rtinchi qadamni bosing.",
    "Umumiylarning eng kattasi olti. Demak o'n ikki va o'n sakkizning eng katta umumiy bo'luvchisi oltiga teng.",
  ],
};

function Screen2({ screen, totalScreens, onNext, onPrev }) {
  const t = useT();
  const audio = useStepAudio(S2_AUDIO);
  const [step, setStep] = useState(0); // 0..4

  const D12 = divisorsOf(12);
  const D18 = divisorsOf(18);
  const COMMON = commonDivisors(12, 18);

  const go = (s) => { setStep(s); audio.triggerInternal(`step_${s}`); };

  const TABS = [
    { ru: 'Делители 12', uz: "12 ning bo'luvchilari" },
    { ru: 'Делители 18', uz: "18 ning bo'luvchilari" },
    { ru: 'Общие', uz: 'Umumiylari' },
    { ru: 'Самый большой', uz: 'Eng kattasi' },
  ];

  const chipCls = (v, listShown) => {
    if (!listShown) return '';
    if (step >= 4 && v === 6) return 'is-best';
    if (step >= 3 && COMMON.includes(v)) return 'is-common';
    return '';
  };

  // По ТЗ общие делители окрашиваются ПОСЛЕДОВАТЕЛЬНО, а не все разом.
  // Задержка перехода 260 мс попадает в диапазон «пауза между связанными
  // строками» (250-450 мс). На шаге 4 задержки нет: шестёрка вспыхивает сразу.
  const chipDelay = (v) => (step === 3 && COMMON.includes(v)
    ? { transitionDelay: `${COMMON.indexOf(v) * 260}ms` }
    : undefined);

  return (
    <Screen
      screen={screen} totalScreens={totalScreens} audio={audio}
      eyebrow={{ ru: 'Разбор', uz: 'Tahlil' }}
      title={{ ru: 'Два списка делителей', uz: "Ikkita bo'luvchilar ro'yxati" }}
      onPrev={onPrev} onNext={onNext} nextDisabled={step < 4 || !audio.canAdvance}
    >
      <ActionHint text={HINT_STEP}/>
      <div className="d5-steps">
        {TABS.map((tab, i) => (
          <button
            key={i}
            className={`d5-tab ${step === i + 1 ? 'is-active' : ''} ${step > i + 1 ? 'is-done' : ''}`}
            disabled={i > step}
            onClick={() => go(i + 1)}
            aria-label={t(tab)}
          >
            {i + 1}. {t(tab)}
          </button>
        ))}
      </div>

      <div className="d5-card d5-col">
        <div className="d5-row" style={{ alignItems: 'center', gap: 12 }}>
          <span className="d5-formula" style={{ minWidth: 54 }}>12</span>
          <div className="d5-chips">
            {D12.map((v) => <span key={v} className={`d5-chip ${chipCls(v, step >= 1)}`} style={chipDelay(v)}>{step >= 1 ? v : '·'}</span>)}
          </div>
        </div>
        <div className="d5-row" style={{ alignItems: 'center', gap: 12 }}>
          <span className="d5-formula" style={{ minWidth: 54 }}>18</span>
          <div className="d5-chips">
            {D18.map((v) => <span key={v} className={`d5-chip ${chipCls(v, step >= 2)}`} style={chipDelay(v)}>{step >= 2 ? v : '·'}</span>)}
          </div>
        </div>
      </div>

      {step >= 3 && (
        <div className="d5-step">
          {t({ ru: 'Общие делители:', uz: "Umumiy bo'luvchilar:" })}
          <span className="d5-mono" style={{ color: '#126E73', fontWeight: 800 }}>{COMMON.join(', ')}</span>
        </div>
      )}
      {step >= 4 && (
        <div className="d5-formula is-green" style={{ animation: 'd5in 520ms both' }}>{mt(`${t(GCD)}(12; 18) = 6`)}</div>
      )}
    </Screen>
  );
}

// ============================================================
// ЭКРАН 3 — МЕДЛЕННАЯ ПОДСТАНОВКА
// ============================================================
const S3_AUDIO = {
  ru: [
    'Проверим каждый общий делитель по очереди. Нажмите число, и оно подставится в оба деления.',
    'Смотрите, как число встаёт на место делителя. Оба деления идут без остатка, но это ещё не значит, что делитель самый большой.',
    'Шесть подходит и оно самое большое. Наибольший общий делитель двух чисел это самое большое число, на которое делятся оба без остатка.',
  ],
  uz: [
    "Har bir umumiy bo'luvchini navbat bilan tekshiramiz. Sonni bosing, u ikkala bo'lishga ham qo'yiladi.",
    "Qarang, son bo'luvchi o'rniga qanday turadi. Ikkala bo'lish ham qoldiqsiz, lekin bu hali bo'luvchi eng katta degani emas.",
    "Olti mos keladi va u eng kattasi. Ikki sonning eng katta umumiy bo'luvchisi bu ikkalasini ham qoldiqsiz bo'ladigan eng katta son.",
  ],
};

function Screen3({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const audio = useStepAudio(S3_AUDIO);
  const [d, setD] = useState(storedAnswer?.d ?? null);
  const [line, setLine] = useState(storedAnswer?.d === 6 ? 3 : 0);
  const CH = [1, 2, 3, 6];

  useEffect(() => {
    if (d === null) return;
    setLine(0);
    const timers = [1, 2, 3].map((k) => setTimeout(() => setLine(k), 380 * k));
    return () => timers.forEach(clearTimeout);
  }, [d]);

  const pick = (v) => {
    setD(v);
    audio.triggerInternal(v === 6 ? 'step_2' : 'step_1');
    onAnswer({ d: v, firstTry: storedAnswer ? storedAnswer.firstTry : v === 6 });
  };

  return (
    <Screen
      screen={screen} totalScreens={totalScreens} audio={audio}
      eyebrow={{ ru: 'Проверка', uz: 'Tekshiruv' }}
      title={{ ru: 'Подставим делитель', uz: "Bo'luvchini qo'yamiz" }}
      onPrev={onPrev} onNext={onNext} nextDisabled={d !== 6 || !audio.canAdvance}
    >
      <ActionHint text={HINT_TAP}/>
      <div className={`d5-chips ${d === null ? 'd5-zone' : ''}`} style={{ padding: d === null ? 8 : 0 }}>
        {CH.map((v) => (
          <button key={v} className={`d5-chip ${d === v ? (v === 6 ? 'is-best' : 'is-common') : ''}`}
            style={{ minWidth: 58, fontSize: 24 }} onClick={() => pick(v)} aria-label={`${t({ ru: 'делитель', uz: "bo'luvchi" })} ${v}`}>
            {v}
          </button>
        ))}
      </div>

      <div className="d5-card d5-col" style={{ minHeight: 132 }}>
        <div className="d5-formula">{mt(`12 : ${d ?? 'd'}`)}{line >= 1 && d !== null && <span className="is-teal"> {mt(`= ${12 / d}`)}</span>}</div>
        {line >= 2 && d !== null && <div className="d5-formula">{mt(`18 : ${d} = ${18 / d}`)}</div>}
        {line >= 3 && d !== null && (
          <Feedback
            good={d === 6}
            node={d === 6
              ? { ru: '6 — самый большой общий делитель. НОД(12; 18) = 6.', uz: "6 — eng katta umumiy bo'luvchi. EKUB(12; 18) = 6." }
              : { ru: `${d} делит и 12, и 18 без остатка, но это не самое большое такое число. Ищите больше.`, uz: `${d} soni 12 ni ham, 18 ni ham qoldiqsiz bo'ladi, lekin bu eng katta son emas. Kattaroq izlang.` }}
          />
        )}
      </div>

      {d === 6 && line >= 3 && (
        <div className="d5-card">
          <div className="d5-cap">{t({ ru: 'Определение', uz: "Ta'rif" })}</div>
          <p className="d5-lead" style={{ color: '#182224' }}>
            {t({ ru: 'Наибольший общий делитель двух чисел — это самое большое число, на которое оба делятся без остатка.', uz: "Ikki sonning eng katta umumiy bo'luvchisi — bu ikkalasi ham qoldiqsiz bo'linadigan eng katta son." })}
          </p>
        </div>
      )}
    </Screen>
  );
}

// ============================================================
// УНИВЕРСАЛЬНЫЙ ЭКРАН-ВОПРОС с отдельным комментарием на каждый вариант
// ============================================================

// Пошаговое раскрытие: строки выводятся сверху вниз, каждая со своей паузой.
// Пауза 640 мс попадает в диапазон «математическое преобразование» из ТЗ.
const useCascade = (total, ms = 640) => {
  const [k, setK] = useState(0);
  useEffect(() => {
    setK(0);
    const timers = Array.from({ length: total }, (_, i) => setTimeout(() => setK(i + 1), ms * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, [total, ms]);
  return k;
};

// Обёртка: комментарий к варианту озвучивается на текущем языке.
function AskScreenL(props) {
  const lang = useLang();
  return <AskScreenInner {...props} lang={lang}/>;
}

function AskScreenInner({
  screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer,
  eyebrow, title, lead, options, correctIdx, feedback, audioLines, cols = 4, numeric = true,
  revealAfter, figure, lang, revealAudioAt = [0],
}) {
  const audio = useStepAudio(audioLines);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const solved = picked === correctIdx;

  // ТЗ: «Каждый этап должен сопровождаться отдельной аудиорепликой».
  // revealAudioAt задаёт, на какой миллисекунде разбора звучит очередной
  // сегмент, — смещения совпадают с моментами появления строк разбора.
  const revealTimers = useRef([]);
  useEffect(() => () => revealTimers.current.forEach(clearTimeout), []);

  const pick = (i) => {
    setPicked(i);
    const first = storedAnswer?.firstTry;
    onAnswer({ picked: i, firstTry: typeof first === 'boolean' ? first : i === correctIdx });
    if (i === correctIdx) {
      revealTimers.current.forEach(clearTimeout);
      revealTimers.current = [];
      revealAudioAt.forEach((ms, s) => {
        const event = `step_${s + 1}`;
        if (ms <= 0) audio.triggerInternal(event);
        else revealTimers.current.push(setTimeout(() => audio.triggerInternal(event), ms));
      });
    } else audio.speakLatestFeedback(feedback[i]?.[lang] || '', `fb_${i}_${Date.now()}`);
  };

  return (
    <Screen
      screen={screen} totalScreens={totalScreens} audio={audio}
      eyebrow={eyebrow} title={title} lead={lead}
      onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !audio.canAdvance}
    >
      {figure}
      {/* Подсказка живёт, пока действия ждут. После верного ответа она не нужна,
          а место освобождает — на узбекском именно этих строк не хватало,
          чтобы разбор поместился в 1366x768. */}
      {!solved && <ActionHint text={HINT_PICK}/>}
      <Options items={options} correctIdx={correctIdx} picked={picked} onPick={pick} cols={cols} numeric={numeric}/>
      {picked !== null && <Feedback good={solved} node={feedback[picked]}/>}
      {solved && revealAfter}
    </Screen>
  );
}

// ============================================================
// ЭКРАН 4 — ЧЁТКОЕ РАЗЛИЧИЕ
// ============================================================
function Screen4(props) {
  const t = useT();
  return (
    <AskScreenL
      {...props}
      eyebrow={{ ru: 'Различаем', uz: 'Farqlaymiz' }}
      title={{ ru: 'Какое число делит и 8, и 12?', uz: "Qaysi son 8 ni ham, 12 ni ham bo'ladi?" }}
      options={[3, 4, 5, 6]}
      correctIdx={1}
      cols={4}
      audioLines={{
        ru: [
          'Выберите число, которое делит без остатка сразу оба числа: и восемь, и двенадцать.',
          'Верно, четыре. Восемь разделить на четыре равно два, двенадцать разделить на четыре равно три. Делитель одного числа общим ещё не является.',
        ],
        uz: [
          "Sakkizni ham, o'n ikkini ham qoldiqsiz bo'ladigan sonni tanlang.",
          "To'g'ri, to'rt. Sakkiz bo'lingan to'rt teng ikki, o'n ikki bo'lingan to'rt teng uch. Bitta sonning bo'luvchisi hali umumiy bo'lmaydi.",
        ],
      }}
      feedback={[
        { ru: '12 : 3 = 4, но 8 на 3 без остатка не делится. Общий делитель должен делить оба числа.', uz: "12 : 3 = 4, lekin 8 soni 3 ga qoldiqsiz bo'linmaydi. Umumiy bo'luvchi ikkala sonni ham bo'lishi kerak." },
        { ru: '8 : 4 = 2 и 12 : 4 = 3. Четыре делит оба числа без остатка.', uz: "8 : 4 = 2 va 12 : 4 = 3. To'rt ikkala sonni ham qoldiqsiz bo'ladi." },
        { ru: 'Ни 8, ни 12 на 5 без остатка не делятся.', uz: "Na 8, na 12 soni 5 ga qoldiqsiz bo'linmaydi." },
        { ru: '12 : 6 = 2, но 8 на 6 без остатка не делится.', uz: "12 : 6 = 2, lekin 8 soni 6 ga qoldiqsiz bo'linmaydi." },
      ]}
      revealAfter={(
        <div className="d5-row" style={{ gap: 12 }}>
          <div className="d5-card d5-col" style={{ flex: '1 1 260px' }}>
            <div className="d5-cap">{t({ ru: 'Делит одно число', uz: 'Bitta sonni bo\'ladi' })}</div>
            <div className="d5-step">{mt('12 : 3 = 4')}</div>
            <div className="d5-lead">{t({ ru: 'но 8 на 3 не делится', uz: "lekin 8 soni 3 ga bo'linmaydi" })}</div>
          </div>
          <div className="d5-card d5-col" style={{ flex: '1 1 260px', borderColor: '#287B54' }}>
            <div className="d5-cap" style={{ color: '#287B54' }}>{t({ ru: 'Делит оба числа', uz: "Ikkala sonni bo'ladi" })}</div>
            <div className="d5-step">{mt('8 : 4 = 2')}</div>
            <div className="d5-step">{mt('12 : 4 = 3')}</div>
          </div>
          <div className="d5-card" style={{ flex: '1 1 100%' }}>
            <p className="d5-lead" style={{ color: '#182224' }}>
              {t({ ru: 'Делитель одного числа не является общим. Общий делитель должен делить оба числа без остатка.', uz: "Bitta sonning bo'luvchisi umumiy bo'lmaydi. Umumiy bo'luvchi ikkala sonni ham qoldiqsiz bo'lishi shart." })}
            </p>
          </div>
        </div>
      )}
    />
  );
}

// ============================================================
// ЭКРАН 5 — НОД(16; 24)
// ============================================================
// Раскрытие ответа экрана 5: общие делители -> самое большое -> итог.
function S5Reveal() {
  const t = useT();
  const k = useCascade(3, 700);
  return (
    <div className="d5-card d5-col">
      <div className="d5-step">
        {t({ ru: 'Общие делители:', uz: "Umumiy bo'luvchilar:" })}
        <span className="d5-mono" style={{ color: '#126E73', fontWeight: 800 }}>1, 2, 4, 8</span>
      </div>
      {k >= 2 && <div className="d5-step">{t({ ru: 'Самое большое:', uz: 'Eng kattasi:' })} <span style={{ color: '#E75A2C', fontWeight: 800 }}>8</span></div>}
      {k >= 3 && <div className="d5-formula is-green">{mt(`${t(GCD)}(16; 24) = 8`)}</div>}
    </div>
  );
}

function Screen5(props) {
  return (
    <AskScreenL
      {...props}
      eyebrow={{ ru: 'Практика', uz: 'Mashq' }}
      title={{ ru: 'НОД(16; 24) = ?', uz: 'EKUB(16; 24) = ?' }}
      options={[2, 4, 6, 8]}
      correctIdx={3}
      cols={4}
      // Три этапа разбора — три отдельные реплики. Смещения совпадают с
      // useCascade(3, 700) внутри S5Reveal: строки и голос идут вместе.
      revealAudioAt={[0, 1400, 2100]}
      audioLines={{
        ru: [
          'Найдите наибольший общий делитель шестнадцати и двадцати четырёх.',
          'Верно. Выпишем общие делители шестнадцати и двадцати четырёх: один, два, четыре и восемь.',
          'Теперь выбираем из них самое большое число. Это восемь.',
          'Значит наибольший общий делитель шестнадцати и двадцати четырёх равен восьми.',
        ],
        uz: [
          "O'n olti va yigirma to'rtning eng katta umumiy bo'luvchisini toping.",
          "To'g'ri. O'n olti va yigirma to'rtning umumiy bo'luvchilarini yozamiz: bir, ikki, to'rt va sakkiz.",
          'Endi ular ichidan eng katta sonni tanlaymiz. Bu sakkiz.',
          "Demak o'n olti va yigirma to'rtning eng katta umumiy bo'luvchisi sakkizga teng.",
        ],
      }}
      feedback={[
        { ru: '2 делит и 16, и 24, но это не самый большой общий делитель.', uz: "2 soni 16 ni ham, 24 ni ham bo'ladi, lekin bu eng katta umumiy bo'luvchi emas." },
        { ru: '4 — общий делитель, но есть больше.', uz: "4 — umumiy bo'luvchi, lekin undan kattasi ham bor." },
        { ru: '16 на 6 без остатка не делится, значит 6 не общий делитель.', uz: "16 soni 6 ga qoldiqsiz bo'linmaydi, demak 6 umumiy bo'luvchi emas." },
        { ru: '16 : 8 = 2 и 24 : 8 = 3. Восемь — самый большой общий делитель.', uz: "16 : 8 = 2 va 24 : 8 = 3. Sakkiz — eng katta umumiy bo'luvchi." },
      ]}
      revealAfter={<S5Reveal/>}
    />
  );
}

// ============================================================
// ЭКРАН 6 — РАЗЛОЖЕНИЕ НА ПРОСТЫЕ МНОЖИТЕЛИ
// ============================================================
// Раскрытие экрана 6: общая двойка -> общая тройка -> произведение -> итог + факт.
// Четыре шага раскрытия идут ОДНОЙ строкой, а не столбиком: столбиком экран
// вырастал до 785 px при доступных 620 и последний шаг вместе с фактом Евклида
// уезжал под нижнюю навигацию — ученик их просто не видел.
function S6Reveal() {
  const t = useT();
  const k = useCascade(4, 640);
  return (
    <div className="d5-card d5-col" style={{ gap: 9 }}>
      <div className="d5-row" style={{ alignItems: 'center', gap: 18 }}>
        {k >= 1 && <div className="d5-step">{t({ ru: 'Общая двойка', uz: 'Umumiy ikkilik' })} <span className="d5-chip is-common">2</span></div>}
        {k >= 2 && <div className="d5-step">{t({ ru: 'Общая тройка', uz: 'Umumiy uchlik' })} <span className="d5-chip is-common">3</span></div>}
        {k >= 3 && <div className="d5-formula is-teal">{mt('2 · 3 = 6')}</div>}
        {k >= 4 && <div className="d5-formula is-green">{mt(`${t(GCD)}(12; 18) = 6`)}</div>}
      </div>
      {k >= 4 && (
        <div className="d5-bonus" style={{ padding: '9px 13px' }}>
          {/* Заголовок факта — в одну строку с текстом: на узбекском вариант
              столбиком не помещался в экран. maxWidth снят, иначе 70ch рвут
              строку надвое. */}
          <p className="d5-lead" style={{ color: '#182224', margin: 0, maxWidth: 'none' }}>
            <span className="d5-cap" style={{ color: '#126E73', marginRight: 9 }}>{t({ ru: 'Знаете ли вы', uz: 'Bilasizmi' })}</span>
            {t({ ru: 'Евклид описал быстрый алгоритм нахождения НОД больше двух тысяч лет назад.', uz: "Evklid EKUB topishning tez algoritmini ikki ming yildan ko'proq vaqt oldin ta'riflagan." })}
          </p>
        </div>
      )}
    </div>
  );
}

const Factor = ({ n, list, commonIdx }) => (
    <div className="d5-row" style={{ alignItems: 'center', gap: 10 }}>
      <span className="d5-formula" style={{ minWidth: 50 }}>{n}</span>
      <span className="d5-formula" style={{ color: '#667174' }}>=</span>
      <div className="d5-chips">
        {list.map((p, i) => (
          <span key={i} className={`d5-chip ${commonIdx.includes(i) ? 'is-common' : ''}`}>{p}</span>
        ))}
      </div>
    </div>
);

function Screen6(props) {
  return (
    <AskScreenL
      {...props}
      eyebrow={{ ru: 'Быстрый способ', uz: 'Tez usul' }}
      title={{ ru: 'Через простые множители', uz: "Tub ko'paytuvchilar orqali" }}
      lead={{ ru: 'Общие множители выделены. Чему равен НОД(12; 18)?', uz: "Umumiy ko'paytuvchilar ajratilgan. EKUB(12; 18) nechaga teng?" }}
      figure={(
        <div className="d5-card d5-col">
          <Factor n={12} list={[2, 2, 3]} commonIdx={[0, 2]}/>
          <Factor n={18} list={[2, 3, 3]} commonIdx={[0, 1]}/>
        </div>
      )}
      options={[4, 5, 6, 9]}
      correctIdx={2}
      cols={4}
      audioLines={{
        ru: [
          'Двенадцать это два умножить на два и на три. Восемнадцать это два умножить на три и на три. Возьмите только те множители, которые есть в обоих разложениях.',
          'Верно. Общая двойка одна и общая тройка одна. Два умножить на три равно шесть.',
        ],
        uz: [
          "O'n ikki bu ikki karra ikki karra uch. O'n sakkiz bu ikki karra uch karra uch. Faqat ikkala yoyilmada ham bor bo'lgan ko'paytuvchilarni oling.",
          "To'g'ri. Umumiy ikkilik bitta va umumiy uchlik bitta. Ikki karra uch teng olti.",
        ],
      }}
      feedback={[
        { ru: '4 = 2 · 2, но у 18 только одна двойка. Вторую взять неоткуда.', uz: "4 = 2 · 2, lekin 18 da faqat bitta ikkilik bor. Ikkinchisini olish mumkin emas." },
        { ru: 'Пятёрки нет ни в одном из разложений.', uz: "Beshlik hech qaysi yoyilmada yo'q." },
        { ru: 'Общая двойка и общая тройка: 2 · 3 = 6.', uz: "Umumiy ikkilik va umumiy uchlik: 2 · 3 = 6." },
        { ru: '9 = 3 · 3, но у 12 только одна тройка.', uz: "9 = 3 · 3, lekin 12 da faqat bitta uchlik bor." },
      ]}
      revealAfter={<S6Reveal/>}
    />
  );
}

// ============================================================
// ЭКРАН 7 — ДВА СПОСОБА
// ============================================================
function Screen7(props) {
  const t = useT();
  return (
    <AskScreenL
      {...props}
      eyebrow={{ ru: 'Выбор способа', uz: 'Usul tanlash' }}
      title={{ ru: 'Как удобнее найти НОД(84; 126)?', uz: 'EKUB(84; 126) ni qanday topish qulay?' }}
      options={[
        { ru: 'Выписать все делители', uz: "Barcha bo'luvchilarni yozish" },
        { ru: 'Разложить на простые множители', uz: "Tub ko'paytuvchilarga yoyish" },
        { ru: 'Угадать общий делитель', uz: "Umumiy bo'luvchini topishga urinish" },
      ]}
      correctIdx={1}
      cols={3}
      numeric={false}
      audioLines={{
        ru: [
          'Числа большие. Подумайте, какой способ даст ответ быстрее и при этом докажет, что делитель наибольший.',
          'Верно. Раскладываем оба числа на простые множители и перемножаем только общие. Получается сорок два.',
        ],
        uz: [
          "Sonlar katta. Qaysi usul javobni tezroq berishini va bo'luvchi eng katta ekanini isbotlashini o'ylang.",
          "To'g'ri. Ikkala sonni tub ko'paytuvchilarga yoyamiz va faqat umumiylarini ko'paytiramiz. Qirq ikki chiqadi.",
        ],
      }}
      feedback={[
        { ru: 'Способ надёжный, но у 84 и 126 много делителей — список выйдет длинным.', uz: "Usul ishonchli, lekin 84 va 126 ning bo'luvchilari ko'p, ro'yxat uzun bo'lib ketadi." },
        { ru: 'Для больших чисел разложение быстрее всего.', uz: "Katta sonlar uchun yoyish eng tez usul." },
        { ru: 'Догадка не доказывает, что найденный делитель наибольший.', uz: "Taxmin topilgan bo'luvchi eng katta ekanini isbotlamaydi." },
      ]}
      revealAfter={(
        <div className="d5-row" style={{ gap: 12 }}>
          <div className="d5-card d5-col" style={{ flex: '1 1 250px' }}>
            <div className="d5-cap">{t({ ru: 'Способ 1 — списки', uz: "1-usul — ro'yxatlar" })}</div>
            <p className="d5-lead">{t({ ru: 'Надёжно. Удобно для малых чисел. Для больших получается длинно.', uz: "Ishonchli. Kichik sonlar uchun qulay. Katta sonlar uchun uzun bo'ladi." })}</p>
          </div>
          <div className="d5-card d5-col" style={{ flex: '1 1 320px', borderColor: '#287B54' }}>
            <div className="d5-cap" style={{ color: '#287B54' }}>{t({ ru: 'Способ 2 — разложение', uz: '2-usul — yoyish' })}</div>
            <div className="d5-step">{mt('84 = 2² · 3 · 7')}</div>
            <div className="d5-step">{mt('126 = 2 · 3² · 7')}</div>
            <div className="d5-step" style={{ color: '#126E73' }}>{mt('2 · 3 · 7 = 42')}</div>
          </div>
          <div className="d5-formula is-green" style={{ flex: '1 1 100%' }}>{mt(`${t(GCD)}(84; 126) = 42`)}</div>
        </div>
      )}
    />
  );
}

// ============================================================
// ЭКРАН 8 — ТРИ ПРАВИЛА
// ============================================================
function Screen8(props) {
  const t = useT();
  const [open, setOpen] = useState(null);
  const RULES = [
    {
      name: { ru: 'Проверить первое число', uz: 'Birinchi sonni tekshirish' },
      text: { ru: 'Делится ли первое число на кандидата без остатка?', uz: "Birinchi son nomzodga qoldiqsiz bo'linadimi?" },
      formula: '24 : 5',
      example: { ru: '24 : 5 = 4 и остаток 4 — не делится', uz: "24 : 5 = 4 va qoldiq 4 — bo'linmaydi" },
    },
    {
      name: { ru: 'Проверить второе число', uz: 'Ikkinchi sonni tekshirish' },
      text: { ru: 'Делится ли второе число на того же кандидата?', uz: "Ikkinchi son ham shu nomzodga bo'linadimi?" },
      formula: '36 : 5',
      example: { ru: '36 : 5 = 7 и остаток 1 — не делится', uz: "36 : 5 = 7 va qoldiq 1 — bo'linmaydi" },
    },
    {
      name: { ru: 'Сделать вывод', uz: 'Xulosa chiqarish' },
      text: { ru: 'Общий делитель обязан делить оба числа без остатка.', uz: "Umumiy bo'luvchi ikkala sonni ham qoldiqsiz bo'lishi shart." },
      formula: '5 ∉ D(24) ∩ D(36)',
      example: { ru: '5 не делит ни 24, ни 36 — значит не общий делитель', uz: "5 na 24 ni, na 36 ni bo'ladi — demak umumiy bo'luvchi emas" },
    },
  ];

  return (
    <AskScreenL
      {...props}
      eyebrow={{ ru: 'Три правила', uz: 'Uch qoida' }}
      title={{ ru: 'Какое число НЕ является общим делителем 24 и 36?', uz: "Qaysi son 24 va 36 ning umumiy bo'luvchisi EMAS?" }}
      options={[2, 3, 4, 5, 6]}
      correctIdx={3}
      cols={5}
      audioLines={{
        ru: [
          'Найдите лишнее число. Четыре кандидата делят оба числа, а один не делит.',
          'Верно, пять. Ни двадцать четыре, ни тридцать шесть на пять без остатка не делятся. Откройте три правила проверки.',
        ],
        uz: [
          "Ortiqcha sonni toping. To'rt nomzod ikkala sonni ham bo'ladi, bittasi esa bo'lmaydi.",
          "To'g'ri, besh. Na yigirma to'rt, na o'ttiz olti beshga qoldiqsiz bo'linmaydi. Uchta tekshirish qoidasini oching.",
        ],
      }}
      feedback={[
        { ru: '24 : 2 = 12 и 36 : 2 = 18. Двойка делит оба числа.', uz: "24 : 2 = 12 va 36 : 2 = 18. Ikkilik ikkala sonni ham bo'ladi." },
        { ru: '24 : 3 = 8 и 36 : 3 = 12. Тройка делит оба числа.', uz: "24 : 3 = 8 va 36 : 3 = 12. Uchlik ikkala sonni ham bo'ladi." },
        { ru: '24 : 4 = 6 и 36 : 4 = 9. Четвёрка делит оба числа.', uz: "24 : 4 = 6 va 36 : 4 = 9. To'rtlik ikkala sonni ham bo'ladi." },
        { ru: '24 и 36 на 5 без остатка не делятся. Это и есть лишнее число.', uz: "24 va 36 beshga qoldiqsiz bo'linmaydi. Ortiqcha son shu." },
        { ru: '24 : 6 = 4 и 36 : 6 = 6. Шестёрка делит оба числа.', uz: "24 : 6 = 4 va 36 : 6 = 6. Oltilik ikkala sonni ham bo'ladi." },
      ]}
      revealAfter={(
        <div className="d5-col" style={{ gap: 8 }}>
          <ActionHint text={{ ru: 'Нажмите правило', uz: 'Qoidani bosing' }}/>
          {RULES.map((r, i) => (
            <button key={i} className={`d5-rule ${open === i ? 'is-open' : ''}`} onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-label={t(r.name)}>
              <div className="d5-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>{i + 1}. {t(r.name)}</span>
                <span className="d5-mono" style={{ color: '#126E73', fontWeight: 700 }}>{r.formula}</span>
              </div>
              {open === i && (
                <div className="d5-col" style={{ gap: 4, marginTop: 8 }}>
                  <span className="d5-lead">{t(r.text)}</span>
                  <span className="d5-mono" style={{ color: '#E75A2C', fontWeight: 700 }}>{t(r.example)}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    />
  );
}

// ============================================================
// СЕРИЯ ИЗ ПЯТИ ЗАДАНИЙ. Будущее задание заблокировано,
// открывается только после правильного ответа на текущее.
// ============================================================
function SeriesScreen({
  screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer,
  eyebrow, title, tasks, audioLines, renderTask, cols = 2, hint = HINT_PICK,
}) {
  const t = useT();
  const lang = useLang();
  const audio = useStepAudio(audioLines);
  const [cur, setCur] = useState(storedAnswer?.cur ?? 0);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? {});
  const task = tasks[cur];
  const solved = picked[cur] === task.correct;
  const allDone = cur === tasks.length - 1 && solved;

  const pick = (i) => {
    const nextPicked = { ...picked, [cur]: i };
    setPicked(nextPicked);
    const firstMap = storedAnswer?.firstMap || {};
    const nextFirst = { ...firstMap };
    if (!(cur in nextFirst)) nextFirst[cur] = i === task.correct;
    onAnswer({ cur, picked: nextPicked, firstMap: nextFirst, firstTry: Object.values(nextFirst).every(Boolean) });
    if (i === task.correct) audio.triggerInternal(`step_${Math.min(cur + 1, (audioLines[lang] || []).length - 1)}`);
    else audio.speakLatestFeedback(task.feedback[i]?.[lang] || '', `s_${cur}_${i}_${Date.now()}`);
  };

  const advance = () => {
    const n = Math.min(cur + 1, tasks.length - 1);
    setCur(n);
    onAnswer({ cur: n, picked, firstMap: storedAnswer?.firstMap || {}, firstTry: storedAnswer?.firstTry });
  };

  return (
    <Screen
      screen={screen} totalScreens={totalScreens} audio={audio}
      eyebrow={eyebrow} title={title}
      onPrev={onPrev} onNext={onNext} nextDisabled={!allDone || !audio.canAdvance}
    >
      <div className="d5-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="d5-tasknum">{String(cur + 1).padStart(2, '0')} / {String(tasks.length).padStart(2, '0')}</span>
        <Dots total={tasks.length} done={Object.keys(picked).filter((k) => picked[k] === tasks[k].correct).length} now={cur}/>
      </div>

      {renderTask ? renderTask(task, solved) : null}

      <ActionHint text={hint}/>
      <Options items={task.options} correctIdx={task.correct} picked={picked[cur] ?? null} onPick={pick} cols={cols} numeric={task.numeric !== false}/>
      {picked[cur] !== undefined && <Feedback good={solved} node={task.feedback[picked[cur]]}/>}
      {solved && task.reveal && <div className="d5-card d5-col">{task.reveal(t)}</div>}
      {solved && cur < tasks.length - 1 && (
        <button className="d5-btn is-teal" style={{ alignSelf: 'flex-start' }} onClick={advance}
          aria-label={t({ ru: 'Следующий пример', uz: 'Keyingi misol' })}>
          {t({ ru: 'Следующий пример', uz: 'Keyingi misol' })}
        </button>
      )}
    </Screen>
  );
}

// ============================================================
// ЭКРАН 9 — ВЗАИМНО ПРОСТЫЕ ЧИСЛА
// ============================================================
const COPRIME_PAIRS = [[8, 9], [6, 10], [7, 12], [14, 21], [9, 15]];

function Screen9(props) {
  const t = useT();
  const tasks = COPRIME_PAIRS.map(([a, b]) => {
    const g = gcdOf(a, b);
    const isCo = g === 1;
    return {
      a, b, g,
      options: [{ ru: 'НОД = 1', uz: 'EKUB = 1' }, { ru: 'НОД > 1', uz: 'EKUB > 1' }],
      numeric: false,
      correct: isCo ? 0 : 1,
      feedback: [
        isCo
          ? { ru: `Верно. У ${a} и ${b} общий делитель только 1 — числа взаимно простые.`, uz: `To'g'ri. ${a} va ${b} ning umumiy bo'luvchisi faqat 1 — sonlar o'zaro tub.` }
          : { ru: `Не только 1: оба числа делятся на ${g}.`, uz: `Faqat 1 emas: ikkala son ham ${g} ga bo'linadi.` },
        isCo
          ? { ru: `Общих делителей больше 1 нет: ${a} и ${b} взаимно простые.`, uz: `1 dan katta umumiy bo'luvchi yo'q: ${a} va ${b} o'zaro tub.` }
          : { ru: `Верно. Оба числа делятся на ${g}, значит НОД = ${g}.`, uz: `To'g'ri. Ikkala son ham ${g} ga bo'linadi, demak EKUB = ${g}.` },
      ],
      reveal: (tr) => (
        <>
          <div className="d5-step">{tr({ ru: 'Общий делитель:', uz: "Umumiy bo'luvchi:" })} <span style={{ color: '#126E73', fontWeight: 800 }}>{g}</span></div>
          <div className="d5-formula is-green">{mt(`${tr(GCD)}(${a}; ${b}) = ${g}`)}</div>
          <div className="d5-lead">{isCo ? tr({ ru: 'Числа взаимно простые.', uz: "Sonlar o'zaro tub." }) : tr({ ru: 'Числа не взаимно простые.', uz: "Sonlar o'zaro tub emas." })}</div>
        </>
      ),
    };
  });

  return (
    <SeriesScreen
      {...props}
      eyebrow={{ ru: 'Взаимно простые', uz: "O'zaro tub sonlar" }}
      title={{ ru: 'Взаимно простые или нет?', uz: "O'zaro tubmi yoki yo'q?" }}
      tasks={tasks}
      cols={2}
      renderTask={(task) => (
        <div className="d5-card d5-row" style={{ alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <span className="d5-formula">{task.a}</span>
          <span className="d5-cap">{t({ ru: 'и', uz: 'va' })}</span>
          <span className="d5-formula">{task.b}</span>
        </div>
      )}
      audioLines={{
        ru: [
          'Два числа называют взаимно простыми, если их наибольший общий делитель равен единице. Проверьте первую пару.',
          'Дальше вторая пара.', 'Третья пара.', 'Четвёртая пара.', 'Последняя пара.',
        ],
        uz: [
          "Ikki sonning eng katta umumiy bo'luvchisi birga teng bo'lsa, ular o'zaro tub deyiladi. Birinchi juftlikni tekshiring.",
          'Endi ikkinchi juftlik.', 'Uchinchi juftlik.', "To'rtinchi juftlik.", 'Oxirgi juftlik.',
        ],
      }}
    />
  );
}

// ============================================================
// ЭКРАН 10 — ПЯТЬ ЖИЗНЕННЫХ ЗАДАЧ С ВВОДОМ ЧИСЛА
// ============================================================
const LIFE_TASKS = [
  { a: 30, b: 45, ru: '30 и 45 тысяч сумов надо раздать поровну. Максимум групп?', uz: "30 va 45 ming so'mni teng ulashish kerak. Ko'pi bilan nechta guruh?", senseRu: 'Каждая группа получит 2 и 3 тысячи.', senseUz: 'Har bir guruh 2 va 3 ming oladi.' },
  { a: 24, b: 36, ru: '24 красных и 36 синих предметов. Максимум одинаковых наборов?', uz: '24 qizil va 36 ko\'k buyum. Ko\'pi bilan nechta bir xil to\'plam?', senseRu: 'В наборе 2 красных и 3 синих.', senseUz: "To'plamda 2 qizil va 3 ko'k." },
  { a: 18, b: 42, ru: 'Ленты 18 и 42 метра. Максимальная длина одинакового куска?', uz: '18 va 42 metrli lentalar. Bir xil bo\'lakning eng katta uzunligi?', senseRu: 'Получится 3 и 7 кусков.', senseUz: "3 va 7 ta bo'lak chiqadi." },
  { a: 16, b: 40, ru: '16 и 40 предметов. Максимум одинаковых коробок?', uz: '16 va 40 buyum. Ko\'pi bilan nechta bir xil quti?', senseRu: 'В коробке 2 и 5 предметов.', senseUz: 'Qutida 2 va 5 buyum.' },
  { a: 27, b: 36, ru: 'Маршруты 27 и 36 км. Максимальный общий шаг?', uz: '27 va 36 km marshrutlar. Eng katta umumiy qadam?', senseRu: 'Получится 3 и 4 отрезка.', senseUz: "3 va 4 ta bo'lak chiqadi." },
];

function Screen10({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const audio = useStepAudio({
    ru: [
      'В жизненных задачах наибольший общий делитель отвечает на вопрос: сколько максимум одинаковых частей получится. Решите первую задачу и введите число.',
      'Вторая задача.', 'Третья задача.', 'Четвёртая задача.', 'Последняя задача.',
    ],
    uz: [
      "Hayotiy masalalarda eng katta umumiy bo'luvchi shu savolga javob beradi: ko'pi bilan nechta bir xil qism chiqadi. Birinchi masalani yeching va sonni kiriting.",
      'Ikkinchi masala.', 'Uchinchi masala.', "To'rtinchi masala.", 'Oxirgi masala.',
    ],
  });
  const [cur, setCur] = useState(storedAnswer?.cur ?? 0);
  const [val, setVal] = useState('');
  const [state, setState] = useState(storedAnswer?.state ?? {});
  const task = LIFE_TASKS[cur];
  const answer = gcdOf(task.a, task.b);
  const solved = state[cur] === true;
  const allDone = cur === LIFE_TASKS.length - 1 && solved;

  const check = () => {
    const n = Number(val);
    const ok = n === answer;
    const nextState = { ...state, [cur]: ok };
    setState(nextState);
    const firstMap = storedAnswer?.firstMap || {};
    if (!(cur in firstMap)) firstMap[cur] = ok;
    onAnswer({ cur, state: nextState, firstMap, firstTry: Object.values(firstMap).every(Boolean) });
    if (ok) audio.triggerInternal(`step_${Math.min(cur + 1, 4)}`);
    else {
      const msg = n && task.a % n === 0 && task.b % n === 0
        ? (lang === 'uz' ? "Bu son ikkalasini ham bo'ladi, lekin eng kattasi emas." : 'Это число делит оба, но оно не самое большое.')
        : (lang === 'uz' ? "Bu songa kamida bittasi qoldiqsiz bo'linmaydi." : 'Хотя бы одно число на него без остатка не делится.');
      audio.speakLatestFeedback(msg, `life_${cur}_${Date.now()}`);
    }
  };

  const advance = () => { const n = Math.min(cur + 1, LIFE_TASKS.length - 1); setCur(n); setVal(''); onAnswer({ cur: n, state, firstMap: storedAnswer?.firstMap || {}, firstTry: storedAnswer?.firstTry }); };

  const wrongTyped = state[cur] === false;
  const n = Number(val);

  return (
    <Screen
      screen={screen} totalScreens={totalScreens} audio={audio}
      eyebrow={{ ru: 'Жизненные задачи', uz: 'Hayotiy masalalar' }}
      title={{ ru: 'Сколько получится максимум?', uz: "Ko'pi bilan nechta bo'ladi?" }}
      onPrev={onPrev} onNext={onNext} nextDisabled={!allDone || !audio.canAdvance}
    >
      <div className="d5-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="d5-tasknum">{String(cur + 1).padStart(2, '0')} / 05</span>
        <Dots total={LIFE_TASKS.length} done={Object.keys(state).filter((k) => state[k]).length} now={cur}/>
      </div>

      <div className="d5-card d5-col">
        <p className="d5-lead" style={{ color: '#182224', fontSize: 18 }}>{lang === 'uz' ? task.uz : task.ru}</p>
        <div className="d5-row" style={{ alignItems: 'center', gap: 12 }}>
          <span className="d5-formula">{mt(`${t(GCD)}(${task.a}; ${task.b}) =`)}</span>
          <input
            className={`d5-input ${solved ? 'is-right' : wrongTyped ? 'is-wrong' : ''}`}
            value={solved ? String(answer) : val}
            onChange={(e) => setVal(e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={(e) => { if (e.key === 'Enter' && val && !solved) check(); }}
            disabled={solved}
            inputMode="numeric"
            aria-label={t(HINT_TYPE)}
            placeholder=""
          />
          {!solved && <button className="d5-btn" onClick={check} disabled={!val} aria-label={t({ ru: 'Проверить ответ', uz: 'Javobni tekshirish' })}>{t({ ru: 'Проверить', uz: 'Tekshirish' })}</button>}
        </div>
        <ActionHint text={HINT_TYPE}/>
      </div>

      {wrongTyped && (
        <Feedback good={false} node={n && task.a % n === 0 && task.b % n === 0
          ? { ru: 'Это число делит оба, но оно не самое большое. Попробуйте больше.', uz: "Bu son ikkalasini ham bo'ladi, lekin eng kattasi emas. Kattaroq sinab ko'ring." }
          : { ru: 'Хотя бы одно число на него без остатка не делится.', uz: "Kamida bitta son unga qoldiqsiz bo'linmaydi." }}/>
      )}
      {solved && (
        <div className="d5-card d5-col">
          <div className="d5-step">{mt(`${task.a} : ${answer} = ${task.a / answer}`)}</div>
          <div className="d5-step">{mt(`${task.b} : ${answer} = ${task.b / answer}`)}</div>
          <div className="d5-lead" style={{ color: '#287B54', fontWeight: 700 }}>{lang === 'uz' ? task.senseUz : task.senseRu}</div>
        </div>
      )}
      {solved && cur < LIFE_TASKS.length - 1 && (
        <button className="d5-btn is-teal" style={{ alignSelf: 'flex-start' }} onClick={advance} aria-label={t({ ru: 'Следующая задача', uz: 'Keyingi masala' })}>{t({ ru: 'Следующая задача', uz: 'Keyingi masala' })}</button>
      )}
    </Screen>
  );
}

// ============================================================
// ЭКРАН 11 — ПЯТЬ КОРОТКИХ СЛУЧАЕВ
// ============================================================
// Как и на экране 12, варианты выписаны руками: у сгенерированных верный ответ
// стоял третьим во всех пяти примерах. Здесь позиции 3, 1, 4, 2, 3.
const SHORT_PAIRS = [
  [6, 18, [2, 3, 6, 18]],
  [7, 35, [7, 14, 21, 35]],
  [8, 32, [2, 4, 6, 8]],
  [9, 45, [3, 9, 15, 45]],
  [12, 60, [4, 6, 12, 60]],
];

// Свой комментарий на каждый вариант: «общий, но не наибольший»,
// «делит только большее», «не делит ни одного».
const shortFeedback = (v, small, big) => {
  if (v === small) return { ru: `Верно. ${big} делится на ${small}, поэтому НОД(${small}; ${big}) = ${small}.`, uz: `To'g'ri. ${big} soni ${small} ga bo'linadi, shuning uchun EKUB(${small}; ${big}) = ${small}.` };
  if (small % v === 0 && big % v === 0) return { ru: `${v} делит оба числа, но не наибольшее: ${big} делится и на ${small}.`, uz: `${v} ikkala sonni ham bo'ladi, lekin eng kattasi emas: ${big} soni ${small} ga ham bo'linadi.` };
  if (big % v === 0) return { ru: `${v} делит ${big}, но ${small} на ${v} без остатка не делится.`, uz: `${v} soni ${big} ni bo'ladi, lekin ${small} soni ${v} ga qoldiqsiz bo'linmaydi.` };
  return { ru: `${big} на ${v} без остатка не делится.`, uz: `${big} soni ${v} ga qoldiqsiz bo'linmaydi.` };
};

function Screen11({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const audio = useStepAudio({
    ru: [
      'Есть короткий путь. Сначала проверьте: делится ли большее число на меньшее. Нажмите кнопку проверки.',
      'Делится без остатка. Теперь выберите наибольший общий делитель.',
      'Второй пример.', 'Третий пример.', 'Четвёртый пример.', 'Последний пример.',
    ],
    uz: [
      "Qisqa yo'l bor. Avval tekshiring: katta son kichigiga bo'linadimi. Tekshirish tugmasini bosing.",
      "Qoldiqsiz bo'linadi. Endi eng katta umumiy bo'luvchini tanlang.",
      'Ikkinchi misol.', 'Uchinchi misol.', "To'rtinchi misol.", 'Oxirgi misol.',
    ],
  });
  const [cur, setCur] = useState(storedAnswer?.cur ?? 0);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? {});
  // ТЗ: состояние ответа сохраняется при возврате. Если пример уже решён,
  // деление считается проверенным — варианты снова на экране, а не спрятаны
  // за кнопкой «Проверить деление».
  const [checked, setChecked] = useState(() => (storedAnswer?.picked ?? {})[storedAnswer?.cur ?? 0] !== undefined);
  const [small, big, options] = SHORT_PAIRS[cur];
  const correctIdx = options.indexOf(small);
  const solved = picked[cur] === correctIdx;
  const allDone = cur === SHORT_PAIRS.length - 1 && solved;

  useEffect(() => { setChecked(picked[cur] !== undefined); }, [cur]);

  const doCheck = () => { setChecked(true); audio.triggerInternal('step_1'); };

  const pick = (i) => {
    const next = { ...picked, [cur]: i };
    setPicked(next);
    const firstMap = storedAnswer?.firstMap || {};
    if (!(cur in firstMap)) firstMap[cur] = i === correctIdx;
    onAnswer({ cur, picked: next, firstMap, firstTry: Object.values(firstMap).every(Boolean) });
    if (i === correctIdx) audio.triggerInternal(`step_${Math.min(cur + 2, 5)}`);
    else audio.speakLatestFeedback(shortFeedback(options[i], small, big)[lang] || '', `sh_${cur}_${i}_${Date.now()}`);
  };

  const advance = () => { const n = Math.min(cur + 1, SHORT_PAIRS.length - 1); setCur(n); onAnswer({ cur: n, picked, firstMap: storedAnswer?.firstMap || {}, firstTry: storedAnswer?.firstTry }); };

  return (
    <Screen
      screen={screen} totalScreens={totalScreens} audio={audio}
      eyebrow={{ ru: 'Короткий случай', uz: 'Qisqa holat' }}
      title={{ ru: 'Когда одно делится на другое', uz: "Biri ikkinchisiga bo'linganda" }}
      onPrev={onPrev} onNext={onNext} nextDisabled={!allDone || !audio.canAdvance}
    >
      <div className="d5-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="d5-tasknum">{String(cur + 1).padStart(2, '0')} / 05</span>
        <Dots total={SHORT_PAIRS.length} done={Object.keys(picked).filter((k) => picked[k] === SHORT_PAIRS[k][2].indexOf(SHORT_PAIRS[k][0])).length} now={cur}/>
      </div>

      <div className="d5-card d5-col">
        <div className="d5-row" style={{ alignItems: 'center', gap: 16 }}>
          <span className="d5-formula">{big}</span>
          <span className="d5-cap">{t({ ru: 'и', uz: 'va' })}</span>
          <span className="d5-formula">{small}</span>
        </div>
        {!checked ? (
          <>
            <p className="d5-lead">{t({ ru: 'Делится ли большее число на меньшее?', uz: "Katta son kichigiga bo'linadimi?" })}</p>
            <button className="d5-btn" style={{ alignSelf: 'flex-start' }} onClick={doCheck} aria-label={t({ ru: 'Проверить деление', uz: "Bo'linishni tekshirish" })}>{t({ ru: 'Проверить деление', uz: "Bo'linishni tekshirish" })}</button>
          </>
        ) : (
          <div className="d5-step" style={{ color: '#287B54' }}>{mt(`${big} : ${small} = ${big / small}`)} — {t({ ru: 'без остатка', uz: 'qoldiqsiz' })}</div>
        )}
      </div>

      {checked && (
        <>
          <ActionHint text={HINT_PICK}/>
          <Options items={options} correctIdx={correctIdx} picked={picked[cur] ?? null} onPick={pick} cols={4}/>
          {picked[cur] !== undefined && (
            <Feedback good={solved} node={shortFeedback(options[picked[cur]], small, big)}/>
          )}
          {solved && (
            <div className="d5-card">
              <div className="d5-cap">{t({ ru: 'Правило', uz: 'Qoida' })}</div>
              <p className="d5-lead" style={{ color: '#182224', margin: 0 }}>
                {t({ ru: 'Если большее число делится на меньшее, НОД равен меньшему числу.', uz: "Agar katta son kichigiga bo'linsa, EKUB kichik songa teng." })}
              </p>
            </div>
          )}
          {solved && cur < SHORT_PAIRS.length - 1 && (
            <button className="d5-btn is-teal" style={{ alignSelf: 'flex-start' }} onClick={advance} aria-label={t({ ru: 'Следующий пример', uz: 'Keyingi misol' })}>{t({ ru: 'Следующий пример', uz: 'Keyingi misol' })}</button>
          )}
        </>
      )}
    </Screen>
  );
}

// ============================================================
// ЭКРАН 12 — ПЯТЬ СМЕШАННЫХ ПАР
// ============================================================
// Варианты выписаны руками, а не сгенерированы: генератор ставил правильный
// ответ во вторую клетку во всех пяти заданиях, и серию можно было пройти,
// не считая, — просто нажимая одно и то же место. Здесь верный ответ стоит
// на позициях 2, 1, 3, 4, 2. Отвлекающие числа осмысленные: общий делитель,
// но не наибольший, либо делитель только одного из двух чисел.
const MIX_PAIRS = [
  [12, 20, [2, 4, 6, 10]],
  [9, 15, [3, 5, 9, 15]],
  [18, 30, [2, 3, 6, 9]],
  [24, 36, [4, 6, 8, 12]],
  [25, 40, [1, 5, 8, 10]],
];

// Шапка задания — отдельный компонент: useT() нельзя звать внутри callback
// renderTask, это не тело компонента (та же причина, что и у S14Head).
function S12Head({ task }) {
  const t = useT();
  return (
    <div className="d5-card" style={{ textAlign: 'center' }}>
      <span className="d5-formula">{mt(`${t(GCD)}(${task.a}; ${task.b}) = ?`)}</span>
    </div>
  );
}

function Screen12(props) {
  const tasks = MIX_PAIRS.map(([a, b, opts]) => {
    const g = gcdOf(a, b);
    const correct = opts.indexOf(g);
    return {
      a, b, g, options: opts, correct,
      feedback: opts.map((v) => v === g
        ? { ru: `Верно. ${a} : ${v} = ${a / v} и ${b} : ${v} = ${b / v}.`, uz: `To'g'ri. ${a} : ${v} = ${a / v} va ${b} : ${v} = ${b / v}.` }
        : (a % v === 0 && b % v === 0)
          ? { ru: `${v} делит оба числа, но это не самый большой общий делитель.`, uz: `${v} ikkala sonni ham bo'ladi, lekin bu eng katta umumiy bo'luvchi emas.` }
          : { ru: `${a % v !== 0 ? a : b} на ${v} без остатка не делится.`, uz: `${a % v !== 0 ? a : b} soni ${v} ga qoldiqsiz bo'linmaydi.` }),
      // Оба разложения — в одной строке. Столбиком карточка выталкивала кнопку
      // «Следующий пример» под нижнюю навигацию, и серия обрывалась на первом же
      // задании: нажать было не на что.
      reveal: (tr) => (
        <>
          <div className="d5-step">{tr({ ru: 'Общие делители:', uz: "Umumiy bo'luvchilar:" })} <span style={{ color: '#126E73', fontWeight: 800 }}>{commonDivisors(a, b).join(', ')}</span></div>
          <div className="d5-row" style={{ alignItems: 'center', gap: 22 }}>
            <div className="d5-step">{tr({ ru: 'Разложение:', uz: 'Yoyilma:' })} <span className="d5-mono">{a} = {primeFactors(a).join(' · ')}</span></div>
            <div className="d5-step"><span className="d5-mono">{b} = {primeFactors(b).join(' · ')}</span></div>
          </div>
          <div className="d5-formula is-green">{mt(`${tr(GCD)}(${a}; ${b}) = ${g}`)}</div>
        </>
      ),
    };
  });

  return (
    <SeriesScreen
      {...props}
      eyebrow={{ ru: 'Смешанные пары', uz: 'Aralash juftliklar' }}
      title={{ ru: 'Найдите НОД', uz: 'EKUB ni toping' }}
      tasks={tasks}
      cols={4}
      renderTask={(task) => <S12Head task={task}/>}
      audioLines={{
        ru: [
          'Выбирайте способ сами: списки делителей или разложение на простые множители. Первая пара.',
          'Вторая пара.', 'Третья пара.', 'Четвёртая пара.', 'Последняя пара.',
        ],
        uz: [
          "Usulni o'zingiz tanlang: bo'luvchilar ro'yxati yoki tub ko'paytuvchilarga yoyish. Birinchi juftlik.",
          'Ikkinchi juftlik.', 'Uchinchi juftlik.', "To'rtinchi juftlik.", 'Oxirgi juftlik.',
        ],
      }}
    />
  );
}

// ============================================================
// ЭКРАН 13 — КЛАССИФИКАЦИЯ И БОНУС
// ============================================================
const CLASSIFY_PAIRS = [[8, 9], [6, 10], [7, 12], [15, 20], [5, 9], [14, 21]];

function Screen13({ screen, totalScreens, onNext, onPrev, storedAnswer, onAnswer }) {
  const t = useT();
  const lang = useLang();
  const audio = useStepAudio({
    ru: [
      'Разложите шесть пар по двум корзинам. Слева пары с наибольшим общим делителем равным единице, справа все остальные.',
      'Все пары разложены верно. Наибольший общий делитель нужен не только для задач на деление.',
    ],
    uz: [
      "Olti juftlikni ikkita savatga ajrating. Chapda eng katta umumiy bo'luvchisi birga teng juftliklar, o'ngda qolganlari.",
      "Barcha juftliklar to'g'ri ajratildi. Eng katta umumiy bo'luvchi faqat bo'lish masalalari uchun kerak emas.",
    ],
  });
  const [placed, setPlaced] = useState(storedAnswer?.placed ?? {});
  const [bad, setBad] = useState(null);
  const [bonus, setBonus] = useState(false);

  const allDone = CLASSIFY_PAIRS.every((_, i) => placed[i] !== undefined);
  const allRight = CLASSIFY_PAIRS.every(([a, b], i) => placed[i] === (gcdOf(a, b) === 1 ? 0 : 1));

  useEffect(() => {
    if (allDone && allRight) {
      audio.triggerInternal('step_1');
      const id = setTimeout(() => setBonus(true), 900);
      return () => clearTimeout(id);
    }
  }, [allDone, allRight]);

  const put = (idx, bin) => {
    const [a, b] = CLASSIFY_PAIRS[idx];
    const right = bin === (gcdOf(a, b) === 1 ? 0 : 1);
    if (!right) {
      setBad(idx);
      audio.speakLatestFeedback(
        lang === 'uz'
          ? `${a} va ${b} ning eng katta umumiy bo'luvchisi ${gcdOf(a, b)}. Boshqa savatga qo'ying.`
          : `Наибольший общий делитель ${a} и ${b} равен ${gcdOf(a, b)}. Положите в другую корзину.`,
        `cl_${idx}_${Date.now()}`,
      );
      setTimeout(() => setBad(null), 1200);
      return;
    }
    const next = { ...placed, [idx]: bin };
    setPlaced(next);
    const firstMap = storedAnswer?.firstMap || {};
    if (!(idx in firstMap)) firstMap[idx] = true;
    onAnswer({ placed: next, firstMap, firstTry: Object.keys(next).length === CLASSIFY_PAIRS.length });
  };

  const rest = CLASSIFY_PAIRS.map((p, i) => i).filter((i) => placed[i] === undefined);

  return (
    <Screen
      screen={screen} totalScreens={totalScreens} audio={audio}
      eyebrow={{ ru: 'Классификация', uz: 'Tasniflash' }}
      title={{ ru: 'Разложите пары по корзинам', uz: 'Juftliklarni savatlarga ajrating' }}
      onPrev={onPrev} onNext={onNext} nextDisabled={!allDone || !allRight || !audio.canAdvance}
    >
      <ActionHint text={{ ru: 'Нажмите пару, затем корзину', uz: 'Juftlikni, keyin savatni bosing' }}/>
      <div className="d5-chips">
        {rest.map((i) => (
          <span key={i} className={`d5-chip ${bad === i ? 'is-best' : ''}`} style={{ minWidth: 84, fontSize: 18 }}>
            {CLASSIFY_PAIRS[i][0]} {t({ ru: 'и', uz: 'va' })} {CLASSIFY_PAIRS[i][1]}
          </span>
        ))}
        {rest.length === 0 && <span className="d5-lead">{t({ ru: 'Все пары разложены.', uz: 'Barcha juftliklar ajratildi.' })}</span>}
      </div>

      <div className="d5-row" style={{ gap: 12 }}>
        {[0, 1].map((bin) => (
          <div key={bin} className="d5-card d5-col" style={{ flex: '1 1 300px', minHeight: 110, borderColor: bin === 0 ? '#126E73' : '#E75A2C' }}>
            <div className="d5-cap" style={{ color: bin === 0 ? '#126E73' : '#E75A2C' }}>
              {bin === 0 ? t({ ru: 'НОД = 1', uz: 'EKUB = 1' }) : t({ ru: 'НОД больше 1', uz: 'EKUB 1 dan katta' })}
            </div>
            <div className="d5-chips">
              {CLASSIFY_PAIRS.map((p, i) => placed[i] === bin && (
                <span key={i} className="d5-chip is-common" style={{ minWidth: 84 }}>{p[0]} {t({ ru: 'и', uz: 'va' })} {p[1]}</span>
              ))}
            </div>
            {/* У двух кнопок одинаковая надпись: без aria-label читалка назовёт
                обе одинаково и корзины будет не различить. */}
            {rest.length > 0 && (
              <button
                className="d5-btn is-teal" style={{ alignSelf: 'flex-start', padding: '8px 14px', fontSize: 13 }}
                onClick={() => put(rest[0], bin)}
                aria-label={`${CLASSIFY_PAIRS[rest[0]][0]} ${t({ ru: 'и', uz: 'va' })} ${CLASSIFY_PAIRS[rest[0]][1]} — ${bin === 0 ? t({ ru: 'НОД равен 1', uz: "EKUB 1 ga teng" }) : t({ ru: 'НОД больше 1', uz: "EKUB 1 dan katta" })}`}
              >
                {t({ ru: 'Положить сюда', uz: "Shu yerga qo'yish" })}
              </button>
            )}
          </div>
        ))}
      </div>

      {allDone && allRight && (
        <p className="d5-lead" style={{ color: '#287B54', fontWeight: 700 }}>
          {t({ ru: 'Пары с НОД = 1 — взаимно простые. У остальных есть общий делитель больше единицы.', uz: "EKUB = 1 bo'lgan juftliklar o'zaro tub. Qolganlarida birdan katta umumiy bo'luvchi bor." })}
        </p>
      )}

      {bonus && (
        <div className="d5-bonus">
          <div className="d5-cap" style={{ color: '#126E73' }}>{t({ ru: 'Зачем это нужно', uz: 'Bu nima uchun kerak' })}</div>
          <p className="d5-lead" style={{ color: '#182224', margin: '4px 0 8px' }}>{t({ ru: 'НОД помогает сокращать дроби.', uz: 'EKUB kasrlarni qisqartirishga yordam beradi.' })}</p>
          <div className="d5-formula is-teal">{mt('18/24 : 6 = 3/4')}</div>
          <p className="d5-lead" style={{ margin: '6px 0 0' }}>{t({ ru: 'Числитель и знаменатель делим на их наибольший общий делитель.', uz: "Surat va maxrajni ularning eng katta umumiy bo'luvchisiga bo'lamiz." })}</p>
        </div>
      )}
    </Screen>
  );
}

// ============================================================
// ЭКРАН 14 — ФИНАЛЬНЫЙ МИКС
// ============================================================
// Шапка задания финала — отдельный компонент: useT() нельзя звать
// внутри callback renderTask, это не тело компонента.
function S14Head({ task }) {
  const t = useT();
  return (
    <div className="d5-card d5-col">
      <div className="d5-cap">{t(task.kind)}</div>
      <span className="d5-formula">{mt(`${t(GCD)}(${task.a}; ${task.b}) = ?`)}</span>
    </div>
  );
}

function Screen14(props) {
  const tasks = [
    {
      kind: { ru: 'НОД через списки', uz: "Ro'yxatlar orqali EKUB" },
      a: 10, b: 15, options: [3, 5, 10, 15], correct: 1,
      solution: { ru: 'Общие делители 10 и 15: 1 и 5. Наибольший — 5.', uz: "10 va 15 ning umumiy bo'luvchilari: 1 va 5. Eng kattasi — 5." },
    },
    {
      kind: { ru: 'НОД через простые множители', uz: "Tub ko'paytuvchilar orqali EKUB" },
      a: 20, b: 30, options: [2, 5, 10, 15], correct: 2,
      solution: { ru: '20 = 2 · 2 · 5, 30 = 2 · 3 · 5. Общие: 2 · 5 = 10.', uz: '20 = 2 · 2 · 5, 30 = 2 · 3 · 5. Umumiylari: 2 · 5 = 10.' },
    },
    {
      kind: { ru: 'Взаимно простые числа', uz: "O'zaro tub sonlar" },
      a: 8, b: 15, options: [1, 2, 4, 8], correct: 0,
      solution: { ru: 'У 8 и 15 общий делитель только 1 — числа взаимно простые.', uz: "8 va 15 ning umumiy bo'luvchisi faqat 1 — sonlar o'zaro tub." },
    },
    {
      kind: { ru: 'Короткий случай', uz: 'Qisqa holat' },
      a: 7, b: 28, options: [4, 7, 14, 28], correct: 1,
      solution: { ru: '28 делится на 7 без остатка, значит НОД = 7.', uz: "28 soni 7 ga qoldiqsiz bo'linadi, demak EKUB = 7." },
    },
    {
      kind: { ru: 'Жизненная задача', uz: 'Hayotiy masala' },
      a: 21, b: 28, options: [3, 4, 7, 14], correct: 2,
      solution: { ru: '21 : 7 = 3 и 28 : 7 = 4. Максимум 7 одинаковых наборов.', uz: "21 : 7 = 3 va 28 : 7 = 4. Ko'pi bilan 7 ta bir xil to'plam." },
    },
  ].map((task) => ({
    ...task,
    feedback: task.options.map((v) => {
      const g = gcdOf(task.a, task.b);
      if (v === g) return { ru: `Верно. НОД(${task.a}; ${task.b}) = ${v}.`, uz: `To'g'ri. EKUB(${task.a}; ${task.b}) = ${v}.` };
      if (task.a % v === 0 && task.b % v === 0) return { ru: `${v} делит оба числа, но не является наибольшим.`, uz: `${v} ikkala sonni ham bo'ladi, lekin eng kattasi emas.` };
      return { ru: `${task.a % v !== 0 ? task.a : task.b} на ${v} без остатка не делится.`, uz: `${task.a % v !== 0 ? task.a : task.b} soni ${v} ga qoldiqsiz bo'linmaydi.` };
    }),
    reveal: (tr) => (
      <>
        <div className="d5-cap">{tr(task.kind)}</div>
        <div className="d5-lead" style={{ color: '#182224' }}>{tr(task.solution)}</div>
        <div className="d5-formula is-green">{mt(`${tr(GCD)}(${task.a}; ${task.b}) = ${gcdOf(task.a, task.b)}`)}</div>
      </>
    ),
  }));

  return (
    <SeriesScreen
      {...props}
      eyebrow={{ ru: 'Финал', uz: 'Yakun' }}
      title={{ ru: 'Пять заданий подряд', uz: 'Ketma-ket besh topshiriq' }}
      tasks={tasks}
      cols={4}
      renderTask={(task) => <S14Head task={task}/>}
      audioLines={{
        ru: [
          'Пять заданий на всё, что разобрали. Первое задание.',
          'Второе задание.', 'Третье задание.', 'Четвёртое задание.', 'Последнее задание.',
        ],
        uz: [
          "Ko'rib chiqilgan hamma narsaga beshta topshiriq. Birinchi topshiriq.",
          'Ikkinchi topshiriq.', 'Uchinchi topshiriq.', "To'rtinchi topshiriq.", 'Oxirgi topshiriq.',
        ],
      }}
    />
  );
}

// ============================================================
// ЭКРАН 15 — ИТОГ
// ============================================================
const SKILLS = [
  { ru: 'Нахожу общие делители', uz: "Umumiy bo'luvchilarni topaman" },
  { ru: 'Выбираю самый большой', uz: 'Eng kattasini tanlayman' },
  { ru: 'Использую разложение', uz: 'Yoyishdan foydalanaman' },
  { ru: 'Узнаю взаимно простые числа', uz: "O'zaro tub sonlarni bilaman" },
];

function Screen15({ screen, totalScreens, onPrev, finishLesson }) {
  const t = useT();
  const audio = useStepAudio({
    ru: [
      'Урок закончен. Вы научились находить общие делители двух чисел.',
      'Вы выбираете среди них самый большой и умеете пользоваться разложением на простые множители. А ещё узнаёте взаимно простые числа. Следующая тема — наименьшее общее кратное.',
    ],
    uz: [
      "Dars tugadi. Siz ikki sonning umumiy bo'luvchilarini topishni o'rgandingiz.",
      "Siz ular ichidan eng kattasini tanlaysiz va tub ko'paytuvchilarga yoyishdan foydalana olasiz. Yana o'zaro tub sonlarni ham bilasiz. Keyingi mavzu — eng kichik umumiy karrali.",
    ],
  });
  const [n, setN] = useState(0);

  useEffect(() => {
    const timers = SKILLS.map((_, i) => setTimeout(() => {
      setN(i + 1);
      if (i === 1) audio.triggerInternal('step_1');
    }, 700 * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Screen
      screen={screen} totalScreens={totalScreens} audio={audio}
      eyebrow={{ ru: 'Итог', uz: 'Yakun' }}
      title={{ ru: 'Что я изучил за урок', uz: "Darsda nimani o'rgandim" }}
      onPrev={onPrev} onNext={finishLesson}
      nextDisabled={!audio.canAdvance}
      nextLabel={t({ ru: 'Завершить урок', uz: 'Darsni yakunlash' })}
    >
      <div className="d5-col" style={{ gap: 9 }}>
        {SKILLS.slice(0, n).map((s, i) => (
          <div className="d5-skill" key={i} style={{ animationDelay: `${i * 60}ms` }}>
            <span className="d5-skill-n">{i + 1}</span>
            <span style={{ fontSize: 17, fontWeight: 700 }}>{t(s)}</span>
          </div>
        ))}
      </div>

      {n >= SKILLS.length && (
        <div className="d5-row" style={{ gap: 12 }}>
          <div className="d5-card d5-col" style={{ flex: '1 1 300px', borderColor: '#287B54' }}>
            <div className="d5-cap" style={{ color: '#287B54' }}>{t({ ru: 'Главный результат', uz: 'Asosiy natija' })}</div>
            <div className="d5-formula is-green">{mt(`${t(GCD)}(12; 18) = 6`)}</div>
          </div>
          <div className="d5-card d5-col" style={{ flex: '1 1 300px' }}>
            <div className="d5-cap">{t({ ru: 'Следующая тема', uz: 'Keyingi mavzu' })}</div>
            <span style={{ fontSize: 18, fontWeight: 700 }}>{t({ ru: 'Наименьшее общее кратное', uz: 'Eng kichik umumiy karrali' })}</span>
          </div>
        </div>
      )}
    </Screen>
  );
}

// ============================================================
// КОРЕНЬ УРОКА
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
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers((prev) => { const next = [...prev]; next[screenIdx] = data; return next; });
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

  const screens = [
    Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8,
    Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
  ];
  const CurrentScreen = screens[current];

  // Защита от двойного клика по «Дальше»: экран не должен перескакивать через один.
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

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <style>{D05_CSS}</style>
      <div className="lesson-root grade6-theory-etalon g6d05">
        {isPreview && (
          <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 4, background: '#FFFFFF', borderRadius: 99, padding: 4, boxShadow: '0 4px 12px -4px rgba(24, 34, 36, 0.25)' }}>
            {['ru', 'uz'].map((l) => (
              <button key={l} onClick={() => setPreviewLang(l)} aria-label={l === 'ru' ? 'Русский' : "O'zbekcha"}
                style={{ border: 'none', cursor: 'pointer', borderRadius: 99, padding: '4px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
                  background: previewLang === l ? '#E75A2C' : 'transparent', color: previewLang === l ? '#FFFFFF' : '#667174' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen
          key={current}
          screen={current}
          studentName={safeName}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={next}
          onPrev={prev}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
