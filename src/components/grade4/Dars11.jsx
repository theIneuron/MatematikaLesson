import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const G4_TITLE_STYLES = `
.g4-title-reveal-overlay {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  place-items: center;
  overflow: hidden;
  overscroll-behavior: contain;
  pointer-events: none;
  background: rgba(8,13,24,.64);
  backdrop-filter: blur(2px) saturate(.78);
  animation: g4-title-reveal-overlay-life 3.8s ease both;
}
.g4-title-reveal-card {
  position: relative;
  isolation: isolate;
  width: 100%;
  min-height: 100dvh;
  padding: 36px 24px;
  border: 0;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow: hidden;
  color: #FFFFFF;
  text-align: center;
  background: radial-gradient(circle at 50% 50%, rgba(255,214,80,.17), transparent 31%);
}
.g4-title-reveal-card::after {
  content: '';
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  width: min(440px, 82vw);
  height: min(440px, 82vw);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,222,105,.17), transparent 68%);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.g4-title-reveal-rays {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  width: 160vmax;
  height: 160vmax;
  border-radius: 50%;
  opacity: .28;
  background: repeating-conic-gradient(from -4deg, rgba(255,218,91,.88) 0 8deg, transparent 8deg 20deg);
  transform: translate(-50%, -50%);
  animation: g4-title-reveal-rays-in .8s cubic-bezier(.16,1,.3,1) both, g4-title-reveal-rays 26s linear .8s 1;
}
.g4-title-reveal-medal {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  width: 112px;
  height: 112px;
  border: 6px solid rgba(255,255,255,.72);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #653C00;
  background: linear-gradient(145deg, #FFF2A0, #FFC13B);
  box-shadow: 0 0 0 13px rgba(255,255,255,.09), 0 0 54px 10px rgba(255,204,63,.38), 0 22px 38px -18px rgba(0,0,0,.7);
  font-size: 52px;
  animation: g4-title-reveal-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both;
}
.g4-title-reveal-card h2 {
  position: absolute;
  top: calc(50% + 82px);
  left: 50%;
  z-index: 2;
  width: min(680px, calc(100vw - 48px));
  margin: 0;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(34px, 5vw, 58px);
  line-height: 1.02;
  text-shadow: 0 4px 24px rgba(0,0,0,.72);
  transform: translateX(-50%);
  animation: g4-title-reveal-title-in .7s ease .52s both;
}
.g4-title-reveal-confetti { position: absolute; inset: 0; pointer-events: none; }
.g4-title-reveal-confetti i {
  position: absolute;
  top: -20px;
  left: calc(3% + var(--g4-title-i) * 5.35%);
  width: 8px;
  height: 14px;
  border-radius: 2px;
  background: #FFE284;
  animation: g4-title-reveal-confetti-fall 2.4s linear var(--g4-title-delay) 2 both;
}
.g4-title-reveal-confetti i:nth-child(3n+2) { background: #FF7050; }
.g4-title-reveal-confetti i:nth-child(3n) { background: #77E1EA; }
.g4-title-card-stage {
  position: relative;
  width: 100%;
  min-height: 116px;
  margin: 0;
  padding: 12px 82px 11px 67px;
  border-radius: 17px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  overflow: hidden;
  color: #FFFFFF;
  background: radial-gradient(circle at 82% 20%, rgba(255,194,60,.26), transparent 30%), linear-gradient(135deg, #173B52, #0E6978);
  box-shadow: 0 28px 58px -27px rgba(22,143,163,.8);
  transform: translateY(-2px);
}
.g4-title-card-bit { position: absolute; z-index: 1; right: 3px; bottom: 2px; width: 72px; height: 90px; animation: g4-title-card-bit-float 2.8s ease-in-out 1 both; }
.g4-title-card-bit .g1-char { width: 100%; height: 100%; }
.g4-title-card-medal {
  position: absolute;
  z-index: 2;
  left: 11px;
  top: 50%;
  width: 44px;
  height: 44px;
  border: 3px solid rgba(255,255,255,.58);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #5A3A00;
  background: linear-gradient(145deg, #FFE284, #FFC23C);
  box-shadow: 0 0 0 8px rgba(255,255,255,.08), 0 15px 30px -15px rgba(0,0,0,.6);
  font-size: 19px;
  transform: translateY(-50%);
}
.g4-title-card-kicker { position: relative; z-index: 2; color: #A8EAF0; font: 900 10px/1 'JetBrains Mono', monospace; letter-spacing: .13em; }
.g4-title-card-stage h2 { position: relative; z-index: 2; margin: 0; color: #FFFFFF; font: 750 clamp(16px, 2.2vw, 21px)/1.05 'Source Serif 4', Georgia, serif; }
.g4-title-card-score {
  position: relative;
  z-index: 2;
  align-self: flex-start;
  margin-top: 5px;
  padding: 5px 9px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,.10);
}
.g4-title-card-score strong { color: #FFE284; font-family: 'JetBrains Mono', monospace; }
.g4-title-card-score span { color: rgba(255,255,255,.72); font-size: 9px; }
.g4-title-card-confetti { position: absolute; inset: 0; pointer-events: none; }
.g4-title-card-confetti i { position: absolute; top: -16px; width: 7px; height: 12px; border-radius: 2px; animation: g4-title-card-confetti-fall 2.4s linear 2 both; }
.g4-title-card-confetti i:nth-child(4n+1) { background: #FFC23C; }
.g4-title-card-confetti i:nth-child(4n+2) { background: #FF5B35; }
.g4-title-card-confetti i:nth-child(4n+3) { background: #77E1EA; }
.g4-title-card-confetti i:nth-child(4n) { background: #95C93D; }
.g4-title-card-confetti i:nth-child(1) { left: 8%; animation-delay: -.3s; }
.g4-title-card-confetti i:nth-child(2) { left: 17%; animation-delay: -1.1s; }
.g4-title-card-confetti i:nth-child(3) { left: 29%; animation-delay: -.7s; }
.g4-title-card-confetti i:nth-child(4) { left: 41%; animation-delay: -1.7s; }
.g4-title-card-confetti i:nth-child(5) { left: 52%; animation-delay: -.2s; }
.g4-title-card-confetti i:nth-child(6) { left: 63%; animation-delay: -1.3s; }
.g4-title-card-confetti i:nth-child(7) { left: 73%; animation-delay: -.8s; }
.g4-title-card-confetti i:nth-child(8) { left: 84%; animation-delay: -1.9s; }
.g4-title-card-confetti i:nth-child(9) { left: 12%; animation-delay: -2s; }
.g4-title-card-confetti i:nth-child(10) { left: 36%; animation-delay: -1.4s; }
.g4-title-card-confetti i:nth-child(11) { left: 68%; animation-delay: -.5s; }
.g4-title-card-confetti i:nth-child(12) { left: 91%; animation-delay: -1.6s; }
@keyframes g4-title-reveal-overlay-life { 0% { opacity: 0; } 12%,84% { opacity: 1; } 100% { opacity: 0; } }
@keyframes g4-title-reveal-medal-in { from { opacity: 0; transform: translate(-50%,-50%) scale(.25) rotate(-25deg); } to { opacity: 1; transform: translate(-50%,-50%) scale(1) rotate(0); } }
@keyframes g4-title-reveal-title-in { from { opacity: 0; transform: translate(-50%,14px); } to { opacity: 1; transform: translate(-50%,0); } }
@keyframes g4-title-reveal-rays-in { from { opacity: 0; transform: translate(-50%,-50%) scale(.5); } to { opacity: .28; transform: translate(-50%,-50%) scale(1); } }
@keyframes g4-title-reveal-rays { from { transform: translate(-50%,-50%) rotate(0); } to { transform: translate(-50%,-50%) rotate(360deg); } }
@keyframes g4-title-reveal-confetti-fall { to { transform: translateY(470px) rotate(560deg); } }
@keyframes g4-title-card-confetti-fall { to { transform: translateY(230px) rotate(460deg); } }
@keyframes g4-title-card-bit-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@media (max-width: 639.98px) {
  .g4-title-reveal-card { min-height: 100dvh; padding: 24px 18px; }
  .g4-title-reveal-medal { width: 88px; height: 88px; border-width: 5px; font-size: 40px; }
  .g4-title-reveal-card h2 { top: calc(50% + 62px); font-size: 29px; }
  .g4-title-card-stage { min-height: 88px; padding: 9px 59px 8px 51px; border-radius: 14px; }
  .g4-title-card-medal { left: 8px; width: 34px; height: 34px; font-size: 14px; }
  .g4-title-card-bit { width: 57px; height: 71px; }
  .g4-title-card-stage h2 { font-size: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .g4-title-reveal-overlay { opacity: 1; animation: none; }
  .g4-title-reveal-rays { opacity: .28; transform: translate(-50%,-50%); animation: none; }
  .g4-title-reveal-medal { opacity: 1; transform: translate(-50%,-50%); animation: none; }
  .g4-title-reveal-card h2 { opacity: 1; transform: translateX(-50%); animation: none; }
  .g4-title-reveal-confetti, .g4-title-card-confetti { display: none; }
  .g4-title-card-bit { animation: none; }
}
`;

function G4TitleReveal({ active, title, lang }) {
  const [visible, setVisible] = useState(false); const shownRef = useRef(false);
  useEffect(() => { if (!active || shownRef.current || typeof window === 'undefined') return undefined; let timer; const frame = window.requestAnimationFrame(() => { shownRef.current = true; setVisible(true); timer = window.setTimeout(() => setVisible(false), 3900); }); return () => { window.cancelAnimationFrame(frame); window.clearTimeout(timer); }; }, [active]);
  if (!visible || typeof document === 'undefined') return null;
  const ariaPrefix = ({ uz: 'Unvon', ru: 'Звание', en: 'Title' })[lang] ?? 'Unvon';
  const ariaLabel = `${ariaPrefix}: ${title}`;
  return createPortal(<div className="g4-title-reveal-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={ariaLabel}><div className="g4-title-reveal-card"><div className="g4-title-reveal-rays" aria-hidden="true" /><div className="g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }} />)}</div><div className="g4-title-reveal-medal" aria-hidden="true">★</div><h2>{title}</h2></div></div>, document.body);
}

function G4TitleCard({ title, lang, firstTry, totalScored }) {
  const kicker = ({ uz: 'UNVON OLINDI', ru: 'ЗВАНИЕ ПОЛУЧЕНО', en: 'TITLE EARNED' })[lang] ?? 'UNVON OLINDI';
  const scoreLabel = ({ uz: 'birinchi urinishda', ru: 'с первой попытки', en: 'on the first attempt' })[lang] ?? 'birinchi urinishda';
  return <div className="g4-title-card-stage" role="status" aria-live="polite" aria-atomic="true"><div className="g4-title-card-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div><div className="g4-title-card-bit"><BitSVG state="happy" /></div><div className="g4-title-card-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{kicker}</span><h2>{title}</h2><div className="g4-title-card-score"><strong>{firstTry}/{totalScored}</strong><span>{scoreLabel}</span></div></div>;
}

// 4-SINF · 11-DARS · Ko'p xonali sonni uch xonali songa ko'paytirish

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-4-11-v1',
  slug: 'dars11-kop-xonali-sonni-uch-xonali-songa-kopaytirish',
  lessonTitle: {
    uz: "11-dars. Ko'p xonali sonni uch xonali songa ko'paytirish",
    ru: 'Урок 11. Умножение многозначного числа на трёхзначное',
    en: 'Lesson 11. Multiplying a multi-digit number by a three-digit number',
  },
  skillTags: ['place_value', 'partial_products', 'row_shift', 'internal_zero', 'estimation'],
};

const SOURCE_ORDER = [0, 2, 8, 3, 9, 7, 10, 6, 12, 1, 11, 4, 13, 5, 14];
const SCREEN_META = [
  { id: 's0', sourceId: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', sourceId: 's2', type: 'exploration', template: 'ShiftOverview', scored: false, scope: null },
  { id: 's2', sourceId: 's8', type: 'practice', template: 'Matching', scored: true, scope: 'module-mikro' },
  { id: 's3', sourceId: 's3', type: 'exploration', template: 'RowPlacement', scored: false, scope: null },
  { id: 's4', sourceId: 's9', type: 'practice', template: 'Construction', scored: true, scope: 'module-mikro' },
  { id: 's5', sourceId: 's7', type: 'exploration', template: 'RowsResult', scored: false, scope: null },
  { id: 's6', sourceId: 's10', type: 'practice', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 's7', sourceId: 's6', type: 'exploration', template: 'ZeroPlaceholder', scored: false, scope: null },
  { id: 's8', sourceId: 's12', type: 'practice', template: 'ErrorRepair', scored: true, scope: 'module-mikro' },
  { id: 's9', sourceId: 's1', type: 'exploration', template: 'ReliableMethod', scored: false, scope: null },
  { id: 's10', sourceId: 's11', type: 'practice', template: 'Strategy', scored: true, scope: 'module-mikro' },
  { id: 's11', sourceId: 's4', type: 'exploration', template: 'TransferModel', scored: false, scope: null },
  { id: 's12', sourceId: 's13', type: 'case', template: 'MCScreen', scored: true, scope: 'final' },
  { id: 's13', sourceId: 's5', type: 'exploration', template: 'TensShiftConsolidation', scored: false, scope: null },
  { id: 's14', sourceId: 's14', type: 'summary', template: 'SummaryScreen', scored: false, scope: null },
];

const CONTENT = ({
  s0: {
    eyebrow: { uz: 'Shahar panellari', ru: 'Городские панели', en: 'City panels' },
    title: { uz: 'Natija qanchalik katta?', ru: 'Насколько велик результат?', en: "How large is the result?" },
    question: { uz: "Natija qaysi oraliqda bo'ladi?", ru: 'В каком диапазоне будет результат?', en: "Which range will contain the result?" },
    options: [
      { uz: '7 000–8 000', ru: '7 000–8 000', en: "7 000–8 000" },
      { uz: '70 000–80 000', ru: '70 000–80 000', en: "70 000–80 000" },
      { uz: '700 000–800 000', ru: '700 000–800 000', en: "700 000–800 000" },
    ],
    closedSet: true,
    wrong: [
      { uz: "Bu oraliq 314 ta guruh uchun juda kichik.", ru: 'Этот диапазон слишком мал для 314 групп.', en: "This range is too small for 314 groups." },
      { uz: "To'g'ri taxmin.", ru: 'Верная оценка.', en: "Good estimate." },
      { uz: "Bu oraliq 314 ta guruh uchun juda katta.", ru: 'Этот диапазон слишком велик для 314 групп.', en: "This range is too large for 314 groups." },
    ],
    audio: {
      uz: ["Bitta panelga ikki yuz o'ttiz oltita kontakt kerak.", "Shahar uch yuz o'n to'rtta bir xil panel o'rnatmoqda.", 'Aniq hisoblamasdan javobning kattaligini taxmin qiling.'],
      ru: ['Для одной панели нужны двести тридцать шесть контактов.', 'Город устанавливает триста четырнадцать одинаковых панелей.', 'Не вычисляя точно, оцени величину ответа.'],
      en: ["One panel needs two hundred and thirty-six contacts.", "The city is installing three hundred and fourteen identical panels.", "Without calculating exactly, estimate the size of the answer."],
    },
  },
  s1: {
    eyebrow: { uz: 'Ishonchli usul', ru: 'Надёжный способ', en: "A reliable method" },
    title: { uz: '201 ni xona qismlariga ajrating', ru: 'Разложи 201 на разрядные части', en: "Partition 201 by place value" },
    question: { uz: "201 sonining to'g'ri yoyiq yozuvini tanlang.", ru: 'Выбери верное разложение числа 201.', en: "Choose the correct partition of 201." },
    options: [
      { uz: '200 + 0 + 1', ru: '200 + 0 + 1', en: "200 + 0 + 1" }, { uz: '20 + 1', ru: '20 + 1', en: "20 + 1" },
      { uz: '200 + 10', ru: '200 + 10', en: "200 + 10" }, { uz: '2 000 + 1', ru: '2 000 + 1', en: "2 000 + 1" },
    ],
    wrong: [
      { uz: "To'g'ri yoyiq yozuv.", ru: 'Верное разложение.', en: "Correct partition." },
      { uz: "2 yuzlar xonasida va 200 ni bildiradi.", ru: 'Цифра 2 стоит в сотнях и означает 200.', en: "The digit 2 is in the hundreds place and represents 200." },
      { uz: "O'nliklar xonasidagi nolni saqlang.", ru: 'Сохрани ноль в разряде десятков.', en: "Keep the zero in the tens place." },
      { uz: '2 yuzlar xonasida, minglar xonasida emas.', ru: 'Цифра 2 стоит в сотнях, а не в тысячах.', en: "The digit 2 is in the hundreds, not the thousands." },
    ],
    audio: {
      uz: ["Ikki yuz bir sonida ikki yuzlik, nol o'nlik va bir birlik bor.", "Shuning uchun ikki yuz birni ikki yuzga, nolga va birga ajratish mumkin.", "Bu ajratish har bir xona qismiga alohida ko'paytirish uchun ishonchli reja beradi."],
      ru: ['В числе двести один есть две сотни, ноль десятков и одна единица.', 'Поэтому двести один можно разложить на двести, ноль и один.', 'Такое разложение даёт надёжный план умножения по разрядным частям.'],
      en: ["The number two hundred and one has two hundreds, zero tens and one one.", "Therefore, two hundred and one can be partitioned into two hundred, zero and one.", "This partition gives a reliable plan for multiplying each place-value part."],
    },
  },
  s2: {
    eyebrow: { uz: "To'liqsiz ko'paytmalar", ru: 'Неполные произведения', en: "Partial products" },
    title: { uz: 'Nechta qator kerak?', ru: 'Сколько строк нужно?', en: "How many rows are needed?" },
    question: { uz: "Nechta to'liqsiz ko'paytma kerak?", ru: 'Сколько неполных произведений нужно?', en: "How many partial products are needed?" },
    options: [{ uz: '2 ta', ru: '2', en: "2" }, { uz: '3 ta', ru: '3', en: "3" }, { uz: '314 ta', ru: '314', en: "314" }],
    closedSet: true,
    wrong: [
      { uz: 'Ikki qator yuzlik qismini qoldirib ketadi.', ru: 'Две строки теряют часть сотен.', en: "Two rows omit the hundreds part." },
      { uz: "To'g'ri. Har bir xona qismiga bitta qator.", ru: 'Верно. По одной строке для каждой разрядной части.', en: "Correct. Use one row for each place-value part." },
      { uz: 'Har bir guruhga emas, har bir xona qismiga bitta qator kerak.', ru: 'Нужна одна строка для каждой разрядной части, а не для каждой группы.', en: "You need one row for each place-value part, not for each group." },
    ],
    audio: {
      uz: ["Ikki xonali ko'paytiruvchida ikkita qator ishlatgan edik.", "Uch yuz o'n to'rt sonida uchta xona qismi bor.", "Nechta to'liqsiz ko'paytma kerakligini tanlang."],
      ru: ['Для двузначного множителя мы использовали две строки.', 'В числе триста четырнадцать есть три разрядные части.', 'Выбери количество неполных произведений.'],
      en: ["We used two rows for a two-digit multiplier.", "The number three hundred and fourteen has three place-value parts.", "Choose the number of partial products."],
    },
  },
  s3: {
    eyebrow: { uz: 'Qatorlarni joylash', ru: 'Размещение строк', en: "Positioning the rows" },
    title: { uz: "Uch qatorni birliklar bo'yicha tekislang", ru: 'Выровняй три строки по единицам', en: "Align the three rows by the ones place" },
    audio: {
      uz: ["Birliklar qatori to'qqiz yuz qirq to'rt bo'lib, siljimaydi.", "O'nliklar qatoridagi ikki yuz o'ttiz olti bir xona siljib, ikki ming uch yuz oltmish bo'ladi.", "Yuzliklar qatoridagi yetti yuz sakkiz ikki xona siljib, yetmish ming sakkiz yuz bo'ladi.", "Tayyor qatorlarni birliklar xonasi bo'yicha tekislang."],
      ru: ['Строка единиц равна девятистам сорока четырём и не сдвигается.', 'Строка десятков сдвигает двести тридцать шесть на один разряд и даёт две тысячи триста шестьдесят.', 'Строка сотен сдвигает семьсот восемь на два разряда и даёт семьдесят тысяч восемьсот.', 'Готовые строки выравнивай по разряду единиц.'],
      en: ["The ones row is nine hundred and forty-four and does not shift.", "The tens row shifts two hundred and thirty-six by one place to make two thousand three hundred and sixty.", "The hundreds row shifts seven hundred and eight by two places to make seventy thousand eight hundred.", "Align the completed rows by the ones place."],
    },
  },
  s4: {
    eyebrow: { uz: 'Hayotiy model', ru: 'Модель задачи', en: "Problem model" },
    title: { uz: "Har bir paneldagi miqdorni panellar soniga ko'paytiring", ru: 'Умножь число контактов на количество панелей', en: "Multiply the number of contacts by the number of panels" },
    audio: {
      uz: ["Bitta panelda ikki yuz o'ttiz oltita kontakt bor.", "To'rtta bir xil panel uchun ikki yuz o'ttiz oltini to'rtga ko'paytiramiz.", "Natija to'qqiz yuz qirq to'rtta kontakt bo'ladi.", "Masalada har bir guruhdagi miqdor guruhlar soniga ko'paytiriladi."],
      ru: ['В одной панели двести тридцать шесть контактов.', 'Для четырёх одинаковых панелей умножаем двести тридцать шесть на четыре.', 'Получаем девятьсот сорок четыре контакта.', 'В задаче количество в одной группе умножается на число групп.'],
      en: ["One panel contains two hundred and thirty-six contacts.", "For four identical panels, multiply two hundred and thirty-six by four.", "This gives nine hundred and forty-four contacts.", "In the problem, multiply the quantity in one group by the number of groups."],
    },
  },
  s5: {
    eyebrow: { uz: "O'nliklar qatori", ru: 'Строка десятков', en: "Tens row" },
    title: { uz: 'Bir xona siljishi', ru: 'Сдвиг на один разряд', en: "A shift of one place" },
    question: { uz: '236 × 10 nechaga teng?', ru: 'Чему равно 236 × 10?', en: "What is 236 × 10?" },
    options: [{ uz: '236', ru: '236', en: "236" }, { uz: '2 360', ru: '2 360', en: "2 360" }, { uz: '23 600', ru: '23 600', en: "23 600" }],
    closedSet: true,
    wrong: [
      { uz: "Bu bir birlikka ko'paytma; bizga bir o'nlik kerak.", ru: 'Это произведение на одну единицу; нужен один десяток.', en: "This is a product by one unit; we need one ten." },
      { uz: "To'g'ri. Xom 236 bir xona siljib 2 360 bo'ladi.", ru: 'Верно. Исходное 236 сдвигается на один разряд и становится 2 360.', en: "Correct. The original 236 shifts by one place to become 2 360." },
      { uz: "O'nliklar qatori ikki emas, bir xona siljiydi.", ru: 'Строка десятков сдвигается на один разряд, а не на два.', en: "The tens row shifts by one place, not two." },
    ],
    audio: {
      uz: ["Uch yuz o'n to'rt sonidagi bir raqami bir o'nlikni bildiradi.", "Ikki yuz o'ttiz oltini bir o'nlikka ko'paytirish natijasini tanlang."],
      ru: ['Цифра один в числе триста четырнадцать означает один десяток.', 'Выбери результат умножения двухсот тридцати шести на один десяток.'],
      en: ["The digit one in three hundred and fourteen represents one ten.", "Choose the result of multiplying two hundred and thirty-six by one ten."],
    },
  },
  s6: {
    eyebrow: { uz: "O'rtadagi nol", ru: 'Ноль в середине', en: "A zero in the middle" },
    title: { uz: 'Nol qator joyini saqlaydi', ru: 'Нулевая строка сохраняет место', en: "The zero row preserves its place" },
    question: { uz: '213 × 100 nechaga teng?', ru: 'Чему равно 213 × 100?', en: "What is 213 × 100?" },
    options: [{ uz: '213', ru: '213', en: "213" }, { uz: '2 130', ru: '2 130', en: "2 130" }, { uz: '21 300', ru: '21 300', en: "21 300" }],
    closedSet: true,
    wrong: [
      { uz: "Bu bir birlikka ko'paytma; bizga bir yuzlik kerak.", ru: 'Это произведение на одну единицу; нужна одна сотня.', en: "This is a product by one unit; we need one hundred." },
      { uz: 'Yuzliklar qatori bir emas, ikki xona chapdan boshlanadi.', ru: 'Строка сотен начинается на два разряда левее, а не на один.', en: "The hundreds row starts two places to the left, not one." },
      { uz: "To'g'ri. 213 ikki xona siljib 21 300 bo'ladi.", ru: 'Верно. 213 сдвигается на два разряда и становится 21 300.', en: "Correct. 213 shifts by two places to become 21 300." },
    ],
    audio: {
      uz: ["Bir yuz uch sonida nol o'nliklar qatorini saqlaydi.", "Bir raqami yuzlar xonasida turib, bir yuzni bildiradi.", "Shuning uchun ikki yuz o'n uchni bir yuzga ko'paytirganda qator ikki xona siljiydi va yigirma bir ming uch yuz bo'ladi."],
      ru: ['В числе сто три ноль сохраняет строку десятков.', 'Цифра один стоит в разряде сотен и означает сто.', 'Поэтому при умножении двухсот тринадцати на сто строка сдвигается на два разряда и получается двадцать одна тысяча триста.'],
      en: ["In the number one hundred and three, zero preserves the tens row.", "The digit one is in the hundreds place and represents one hundred.", "Therefore, when multiplying two hundred and thirteen by one hundred, the row shifts by two places to make twenty-one thousand three hundred."],
    },
  },
  s7: {
    eyebrow: { uz: 'Uch qator', ru: 'Три строки', en: "Three rows" },
    title: { uz: 'Uch qator bitta natijani beradi', ru: 'Три строки дают один результат', en: "Three rows make one result" },
    audio: {
      uz: ["Birliklar qatori to'qqiz yuz qirq to'rt.", "O'nliklar qatori ikki ming uch yuz oltmish.", 'Yuzliklar qatori yetmish ming sakkiz yuz.', "Uch qatorning yig'indisi yetmish to'rt ming bir yuz to'rt.", 'Natija dars boshidagi yetmish mingdan sakson minggacha oraliqqa mos.'],
      ru: ['Строка единиц равна девятистам сорока четырём.', 'Строка десятков равна двум тысячам трёмстам шестидесяти.', 'Строка сотен равна семидесяти тысячам восьмистам.', 'Сумма трёх строк равна семидесяти четырём тысячам ста четырём.', 'Результат входит в диапазон от семидесяти до восьмидесяти тысяч.'],
      en: ["The ones row is nine hundred and forty-four.", "The tens row is two thousand three hundred and sixty.", "The hundreds row is seventy thousand eight hundred.", "The sum of the three rows is seventy-four thousand one hundred and four.", "The result lies between seventy and eighty thousand."],
    },
  },
  s8: {
    eyebrow: { uz: 'Moslashtirish', ru: 'Соответствие', en: "Matching" },
    title: { uz: '0, 1 va 2 xona siljishi', ru: 'Сдвиг на 0, 1 и 2 разряда', en: "Shifts of 0, 1 and 2 places" },
    question: { uz: "Har bir qismni qator siljishi bilan bog'lang.", ru: 'Соедини каждую часть со сдвигом строки.', en: "Match each part to its row shift." },
    audio: {
      uz: ["Birliklar qatori siljimaydi.", "O'nliklar qatori bir xona chapdan boshlanadi.", 'Yuzliklar qatori ikki xona chapdan boshlanadi.', 'Mos juftliklarni tuzing.'],
      ru: ['Строка единиц не сдвигается.', 'Строка десятков начинается на один разряд левее.', 'Строка сотен начинается на два разряда левее.', 'Составь подходящие пары.'],
      en: ["The ones row does not shift.", "The tens row starts one place to the left.", "The hundreds row starts two places to the left.", "Make the correct pairs."],
    },
  },
  s9: {
    eyebrow: { uz: "O'rtadagi nol", ru: 'Ноль в середине', en: "A zero in the middle" },
    title: { uz: 'Uch qatorni joylashtiring', ru: 'Размести три строки', en: "Position the three rows" },
    question: { uz: "132 × 204 uchun uch qatorni joylashtiring.", ru: 'Размести три строки для 132 × 204.', en: "Position the three rows for 132 × 204." },
    audio: {
      uz: ["Ikki yuz to'rt sonida to'rt birlik, nol o'nlik va ikki yuzlik bor.", "Nol o'nlik qatori natijani oshirmaydi, lekin o'z xona o'rnini saqlaydi.", "Uchta to'g'ri qatorni joylashtiring."],
      ru: ['В числе двести четыре есть четыре единицы, ноль десятков и две сотни.', 'Нулевая строка десятков не увеличивает результат, но сохраняет разрядное место.', 'Размести три правильные строки.'],
      en: ["The number two hundred and four has four ones, zero tens and two hundreds.", "The zero tens row does not increase the result, but it preserves its place.", "Position the three correct rows."],
    },
  },
  s10: {
    eyebrow: { uz: 'Mustaqil hisob', ru: 'Самостоятельное вычисление', en: "Independent calculation" },
    title: { uz: 'Sonli javobni kiriting', ru: 'Введи числовой ответ', en: "Enter a numerical answer" },
    question: { uz: '145 × 326 = ?', ru: '145 × 326 = ?', en: "145 × 326 = ?" },
    audio: {
      uz: ["Bir yuz qirq beshni uch yuz yigirma oltiga ko'paytiring.", "Birliklar, o'nliklar va yuzliklar qatorlarini to'g'ri joylashtiring.", 'Natijani taxminan qirq besh ming bilan solishtiring.'],
      ru: ['Умножь сто сорок пять на триста двадцать шесть.', 'Правильно размести строки единиц, десятков и сотен.', 'Сравни результат с оценкой примерно сорок пять тысяч.'],
      en: ["Multiply one hundred and forty-five by three hundred and twenty-six.", "Position the ones, tens and hundreds rows correctly.", "Compare the result with an estimate of approximately forty-five thousand."],
    },
  },
  s11: {
    eyebrow: { uz: 'Strategiya', ru: 'Стратегия', en: "Strategy" },
    title: { uz: 'Eng qisqa ishonchli usul', ru: 'Самый короткий надёжный способ', en: "The shortest reliable method" },
    question: { uz: '398 × 201 uchun eng qisqa ishonchli usul qaysi?', ru: 'Какой способ самый короткий и надёжный для 398 × 201?', en: "Which method is the shortest and most reliable for 398 × 201?" },
    options: [{ uz: '398 × 200 + 398', ru: '398 × 200 + 398', en: "398 × 200 + 398" }, { uz: '400 × 201', ru: '400 × 201', en: "400 × 201" }, { uz: '398 + 201', ru: '398 + 201', en: "398 + 201" }],
    closedSet: true,
    wrong: [
      { uz: "To'g'ri aniq usul.", ru: 'Верный точный способ.', en: "A correct exact method." },
      { uz: 'Aniq javob uchun 80 400 dan 402 ni ayirish kerak.', ru: 'Для точного ответа нужно вычесть 402 из 80 400.', en: "To get the exact answer, subtract 402 from 80 400." },
      { uz: "Qo'shish 201 ta teng guruhni ifodalamaydi.", ru: 'Сложение не показывает 201 равную группу.', en: "Addition does not represent 201 equal groups." },
    ],
    audio: {
      uz: ['Ikki yuz bir soni ikki yuz va birdan tuzilgan.', "Uch yuz to'qson sakkizni ikki yuzga va birga alohida ko'paytirish qulay.", 'Eng qisqa aniq usulni tanlang.'],
      ru: ['Число двести один состоит из двухсот и одного.', 'Удобно отдельно умножить триста девяносто восемь на двести и на один.', 'Выбери самый короткий точный способ.'],
      en: ["The number two hundred and one consists of two hundred plus one.", "It is convenient to multiply three hundred and ninety-eight separately by two hundred and by one.", "Choose the shortest exact method."],
    },
  },
  s12: {
    eyebrow: { uz: 'Bit xatosi', ru: 'Ошибка Бита', en: "Bit's error" },
    title: { uz: 'Yuzlik qatorini tuzating', ru: 'Исправь строку сотен', en: "Correct the hundreds row" },
    question: { uz: 'Qaysi qatorni tuzatish kerak?', ru: 'Какую строку нужно исправить?', en: "Which row needs correcting?" },
    options: [{ uz: '21 300', ru: '21 300', en: "21 300" }, { uz: '213', ru: '213', en: "213" }, { uz: '213 000', ru: '213 000', en: "213 000" }],
    closedSet: true,
    wrong: [
      { uz: "To'g'ri. Yuzlik qatori 21 300.", ru: 'Верно. Строка сотен равна 21 300.', en: "Correct. The hundreds row is 21 300." },
      { uz: "Bu bir birlikka ko'paytma; 1 bu yerda yuzni bildiradi.", ru: 'Это произведение на одну единицу; здесь 1 означает сто.', en: "This is a product by one unit; here 1 represents one hundred." },
      { uz: 'Yuzliklar qatori uch emas, ikki xona siljiydi.', ru: 'Строка сотен сдвигается на два разряда, а не на три.', en: "The hundreds row shifts by two places, not three." },
    ],
    audio: {
      uz: ["Bit ikki yuz o'n uchni bir yuz uchga ko'paytirdi.", "U yuzlik raqamini o'nlik deb joylashtirdi.", "Noto'g'ri qator o'rniga mos qiymatni tanlang."],
      ru: ['Бит умножал двести тринадцать на сто три.', 'Он разместил цифру сотен как цифру десятков.', 'Выбери правильное значение вместо неверной строки.'],
      en: ["Bit was multiplying two hundred and thirteen by one hundred and three.", "He positioned the hundreds digit as if it were a tens digit.", "Choose the correct value to replace the incorrect row."],
    },
  },
  s13: {
    eyebrow: { uz: 'Shahar bloklari', ru: 'Городские блоки', en: "City blocks" },
    title: { uz: "To'g'ri hisob rejasini tanlang", ru: 'Выбери верный план вычисления', en: "Choose the correct calculation plan" },
    question: { uz: "203 ta blokning har birida 124 ta ulanish bor. Qaysi hisob rejasi to'g'ri?", ru: 'В каждом из 203 блоков по 124 соединения. Какой план вычисления верен?', en: "Each of 203 blocks has 124 connections. Which calculation plan is correct?" },
    options: [
      { uz: '124 × 200 = 24 800, 124 × 0 = 0 va 124 × 3 = 372', ru: '124 × 200 = 24 800, 124 × 0 = 0 и 124 × 3 = 372', en: "124 × 200 = 24 800, 124 × 0 = 0 and 124 × 3 = 372" },
      { uz: '124 × 20 = 2 480 va 124 × 3 = 372', ru: '124 × 20 = 2 480 и 124 × 3 = 372', en: "124 × 20 = 2 480 and 124 × 3 = 372" },
      { uz: '124 × 200 = 24 800 va 124 × 30 = 3 720', ru: '124 × 200 = 24 800 и 124 × 30 = 3 720', en: "124 × 200 = 24 800 and 124 × 30 = 3 720" },
    ],
    closedSet: true,
    wrong: [
      { uz: "To'g'ri hisob rejasi.", ru: 'Верный план вычисления.', en: "Correct calculation plan." },
      { uz: '2 yuzlar xonasida va 200 ni bildiradi.', ru: 'Цифра 2 стоит в сотнях и означает 200.', en: "The digit 2 is in the hundreds place and represents 200." },
      { uz: "O'nlar raqami nol; 30 ga ko'paytma kerak emas.", ru: 'Цифра десятков равна нулю; произведение на 30 не нужно.', en: "The tens digit is zero, so a product by 30 is not needed." },
    ],
    audio: {
      uz: ["Ikki yuz uchta blokning har birida bir yuz yigirma to'rtta ulanish bor.", "Ikki yuz uch soni ikki yuzdan, noldan va uchdan tuzilgan.", "Nol o'nliklar qatorini saqlaydi. Har bir xona qismi uchun to'g'ri hisob rejasini tanlang."],
      ru: ['В каждом из двухсот трёх блоков находится сто двадцать четыре соединения.', 'Число двести три состоит из двухсот, нуля и трёх.', 'Ноль сохраняет строку десятков. Выбери верный план для каждой разрядной части.'],
      en: ["Each of two hundred and three blocks contains one hundred and twenty-four connections.", "The number two hundred and three consists of two hundred, zero and three.", "Zero preserves the tens row. Choose the correct plan for each place-value part."],
    },
  },
  s14: {
    eyebrow: { uz: "YAKUNIY BOSQICH", ru: 'ФИНАЛЬНЫЙ ЭТАП', en: "FINAL STAGE" },
    title: { uz: "Uch xonali songa ko'paytirish", ru: 'Умножение на трёхзначное число', en: "Multiplying by a three-digit number" },
    audio: {
      uz: ["Uch xonali ko'paytiruvchi yuzliklar, o'nliklar va birliklarga ajraladi.", 'Birliklar qatori siljimaydi.', "O'nliklar qatori bir xona, yuzliklar qatori ikki xona chapdan boshlanadi.", "Nol tegishli xona o'rnini saqlaydi.", "Qatorlar qo'shiladi va natija taxmin bilan tekshiriladi."],
      ru: ['Трёхзначный множитель раскладывается на сотни, десятки и единицы.', 'Строка единиц не сдвигается.', 'Строка десятков начинается на один, а строка сотен на два разряда левее.', 'Ноль сохраняет место соответствующего разряда.', 'Строки складываются, а результат проверяется оценкой.'],
      en: ["A three-digit multiplier is partitioned into hundreds, tens and ones.", "The ones row does not shift.", "The tens row starts one place to the left, and the hundreds row starts two places to the left.", "Zero preserves the corresponding place value.", "Add the rows and check the result with an estimate."],
    },
  },
});

let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };
const LangContext = createContext('uz');
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value == null) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') return value;
    return value[lang] ?? '';
  }, [lang]);
};

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return mobile;
}

const buildTtsUrl = (base, text, gender) => `${base}/api/tts?text=${encodeURIComponent(String(text).slice(0, 1000))}&g=${gender === 'm' ? 'm' : 'f'}`;

class AudioEngine {
  constructor() { this.queue = []; this.index = 0; this.audio = null; this.previewUtterance = null; this.timer = null; this.lang = 'uz'; this.muted = false; this.listener = null; }
  emit(extra = {}) { this.listener?.({ muted: this.muted, ...extra }); }
  setLang(lang) { this.lang = lang; }
  stop() {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.pause(); this.audio.onended = null; this.audio.onerror = null; }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch { /* preview speech is optional */ }
    }
  }
  load(queue) { this.stop(); this.queue = queue || []; this.index = 0; this.emit({ completed: false, currentSegment: null }); }
  start() { this.play(); }
  timed(item, duration = null) {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.onended = null; this.audio.onerror = null; }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    this.emit({ isPlaying: false, completed: false, currentSegment: item.id, visualOnly: true });
    this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, duration ?? Math.max(1100, Math.min(2200, item.text.length * 30)));
  }
  play() {
    const item = this.queue[this.index];
    if (!item) { this.emit({ isPlaying: false, completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase }); return; }
    if (this.muted || !runtimeConfig.ttsApiBase) {
      if (!this.muted && runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(String(item.text));
          utterance.lang = ({ uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' })[this.lang] ?? 'uz-UZ';
          utterance.rate = 0.94;
          utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false });
          utterance.onend = () => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); };
          utterance.onerror = () => this.timed(item, 1200);
          this.previewUtterance = utterance;
          this.timer = window.setTimeout(() => {
            this.timer = null;
            try { window.speechSynthesis.speak(utterance); } catch { this.timed(item, 1200); }
          }, 50);
          return;
        } catch { /* fall through to the deterministic visual timer */ }
      }
      this.timed(item);
      return;
    }
    if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; }
    this.audio.onended = () => { this.index += 1; this.play(); };
    this.audio.onerror = () => this.timed(item, 1200);
    this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender);
    this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => {
      this.emit({ currentSegment: item.id, visualOnly: true });
      this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, 1200);
    });
  }
  toggleMute() { this.muted = !this.muted; this.stop(); this.index = 0; this.emit({ muted: this.muted }); this.start(); }
  one(text) { this.load([{ id: `feedback-${Date.now()}`, text }]); this.start(); }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({ isPlaying: false, muted: audioEngineInstance?.muted ?? false, completed: false, currentSegment: null, visualOnly: !runtimeConfig.ttsApiBase });
  /* eslint-disable react-hooks/refs -- audio queue stabilizer */
  const segmentsRef = useRef(segments);
  const key = JSON.stringify(segments || []);
  const oldKey = useRef(key);
  if (oldKey.current !== key) { oldKey.current = key; segmentsRef.current = segments; }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */
  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.listener = (next) => setState((previous) => ({ ...previous, ...next }));
    engine.load(stableSegments);
    const timer = window.setTimeout(() => engine.start(), 220);
    return () => { window.clearTimeout(timer); engine.stop(); engine.listener = null; };
  }, [lang, stableSegments]);
  return {
    ...state,
    replay: () => { const engine = getAudioEngine(); engine?.load(stableSegments); engine?.start(); },
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.one(text),
  };
}

function useNarration(value, screen) {
  const lang = useLang();
  const segments = useMemo(() => {
    const texts = value?.[lang] ?? [];
    return (Array.isArray(texts) ? texts : [texts]).filter(Boolean).map((text, index) => ({ id: `s${screen}-beat-${index}`, text }));
  }, [lang, screen, value]);
  const audio = useAudio(segments);
  const active = segments.findIndex((segment) => segment.id === audio.currentSegment);
  return { ...audio, beat: active >= 0 ? active : (audio.completed ? Math.max(0, segments.length - 1) : 0), caption: active >= 0 ? segments[active].text : '' };
}

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try { new Audio(url).play().catch(() => {}); } catch { /* optional */ }
};

const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g4bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g4bhead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EBF2F6" />
        <stop offset="100%" stopColor="#C4D3DC" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)" />
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="11" r="6" fill="#FF4F28" />
      <circle cx="58" cy="9" r="2" fill="#FFB9A6" />
    </g>
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g4bbody)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5" />
    {(state === 'happy' || isWave) && (
      <g className={isWave ? 'bit-double-wave' : ''}>
        <g className="bit-wave-left">
          <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="47" r="5" fill="#B6C7D2" />
        </g>
        <g className="bit-wave-right">
          <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="47" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="g1-bit-wave">
          <path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="43" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isThinking && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-think-hand">
          <path d="M84 76 C 92 74 92 66 84 61" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="83" cy="60" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isAwkward && (
      <g className="bit-awkward-hands">
        <path d="M36 76 C 39 88 46 96 54 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="54" cy="99" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 81 88 74 96 66 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="99" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'point' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-point-arm">
          <path d="M84 76 C 94 72 101 67 108 62" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="109" cy="61" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'idea' && (
      <g>
        <path d="M36 76 C 29 82 27 91 30 101" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="102" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 92 68 95 58 94 50" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="49" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-hands">
        <path d="M36 77 C 41 88 47 93 53 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="53" cy="94" r="5" fill="#B6C7D2" />
        <path d="M84 77 C 79 88 73 93 67 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="67" cy="94" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'nod' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-nod-hand">
          <path d="M84 75 C 93 70 99 62 99 54" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="99" cy="53" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g4bhead)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C" />
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)" />
    <g className="g1-eyes" fill="#5BD6F2">
      {isAwkward
        ? <><ellipse cx="50" cy="53" rx="4.8" ry="3.2" /><ellipse cx="70" cy="53" rx="4.8" ry="3.2" /></>
        : isThinking
        ? <><circle cx="50" cy="50" r="4.5" /><circle cx="70" cy="49" r="5.5" /></>
        : <><circle cx="50" cy="50" r="5" /><circle cx="70" cy="50" r="5" /></>}
    </g>
    {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
    {(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />}
    {isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
    {isAwkward && (
      <g className="bit-awkward-face">
        <path d="M53 62 Q60 57 67 62" stroke="#5BD6F2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
        <circle cx="77" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
      </g>
    )}
    {isThinking && (
      <g>
        <circle cx="99" cy="38" r="9" fill="#FFC23C" />
        <text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text>
      </g>
    )}
    {state === 'point' && (
      <g className="bit-point-target">
        <circle cx="110" cy="61" r="8" fill="none" stroke="#FF5B35" strokeWidth="2" />
        <circle cx="110" cy="61" r="2" fill="#FF5B35" />
      </g>
    )}
    {state === 'idea' && (
      <g className="bit-idea-bulb">
        <circle cx="99" cy="36" r="9" fill="#FFC23C" />
        <path d="M95 36 Q99 31 103 36 M97 42 h4" stroke="#7A5200" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-scan">
        <path d="M43 45 h34" stroke="#95C93D" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="45" r="3" fill="#95C93D" />
      </g>
    )}
    {state === 'nod' && (
      <g className="bit-nod-check">
        <circle cx="99" cy="38" r="9" fill="#95C93D" />
        <path d="M95 38 l3 3 6-7" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
  );
};

const AudioIndicator = ({ audio }) => {
  const t = useT();
  const muteLabel = audio.muted
    ? t({ uz: 'Ovozni yoqish', ru: 'Включить звук', en: 'Turn sound on' })
    : t({ uz: "Ovozni o'chirish", ru: 'Выключить звук', en: 'Turn sound off' });
  const replayLabel = t({ uz: 'Qayta eshitish', ru: 'Повторить', en: 'Replay' });
  return (
    <div className="audio-controls">
      <button type="button" className="icon-btn" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>
        {audio.muted ? '🔇' : (audio.isPlaying ? '🔊' : '🔉')}
      </button>
      {!audio.muted && (
        <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>
          ↻
        </button>
      )}
    </div>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const t = useT();
  const aliases = {
    model: 'exploration',
    discovery: 'exploration',
    comparison: 'exploration',
    strategy: 'exploration',
    construction: 'practice',
    error: 'practice',
    matching: 'practice',
  };
  const labels = {
    hook: t({ uz: 'Missiya', ru: 'Миссия', en: 'Mission' }),
    diagnostic: t({ uz: 'Diagnostika', ru: 'Диагностика', en: 'Diagnostic' }),
    exploration: t({ uz: 'Kashfiyot', ru: 'Исследование', en: 'Explore' }),
    rule: t({ uz: 'Qoida', ru: 'Правило', en: 'Rule' }),
    practice: t({ uz: 'Mashq', ru: 'Практика', en: 'Practice' }),
    test: t({ uz: 'Tekshiruv', ru: 'Проверка', en: 'Check' }),
    case: t({ uz: 'Vazifa', ru: 'Задача', en: 'Problem' }),
    summary: t({ uz: 'Yakun', ru: 'Итог', en: 'Summary' }),
  };
  const semanticType = aliases[type] ?? type;
  return <span className="screen-type">{labels[semanticType] ?? type}</span>;
};

const Feedback = ({ show, correct, children }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!show) { const frame = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(frame); }
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [show]);
  if (!show) return null;
  return <div role="status" className={`feedback ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><b>{correct ? '✓' : '↻'}</b><p>{children}</p></div>;
};

const Stage = ({ screen, audio, onPrev, onNext, finish = false, children }) => {
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const c = CONTENT[`s${SOURCE_ORDER[screen]}`];
  return (
    <main className="stage">
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track"><i style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }} /></div>
        <div className="stage-chrome">
          <div className="chrome-title"><span className="status-dot" /><span>{t(c.eyebrow)}</span></div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={SCREEN_META[screen].type} />
            {audio && <AudioIndicator audio={audio} />}
            <span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span>
          </div>
        </div>
      </header>
      <section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="stage-happy-bit" aria-label={t({ uz: 'Bit xursand', ru: 'Бит улыбается', en: "Bit is smiling" })}><BitSVG state="happy" /></div>
        {children}
        {audio?.caption && (audio.muted || audio.visualOnly) && <div className="caption">{audio.caption}</div>}
      </section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>
        {screen === 0 ? <span /> : <button type="button" className="btn ghost" onClick={onPrev}>← {t({ uz: 'Orqaga', ru: 'Назад', en: "Back" })}</button>}
        <button type="button" className="btn next" onClick={onNext}>{finish ? t({ uz: 'Darsni yakunlash', ru: 'Завершить урок', en: "Finish lesson" }) : t({ uz: 'Davom etish', ru: 'Продолжить', en: "Continue" })} →</button>
      </footer>
    </main>
  );
};

const Heading = ({ c, bit = null }) => {
  const t = useT();
  return <div className="heading"><div><span>{t(c.eyebrow)}</span><h1>{t(c.title)}</h1></div>{bit && <BitSVG state={bit} />}</div>;
};

const Options = ({ values, picked, onPick, correctIndex = null, solved = false, wrong = false, disabled = false }) => {
  const t = useT();
  return <div className="options">{values.map((value, index) => <button type="button" key={`${index}-${t(value)}`} className={`option ${picked === index ? 'picked' : ''} ${solved && index === correctIndex ? 'right' : ''} ${wrong && picked === index ? 'bad' : ''}`} onClick={() => onPick(index)} disabled={disabled}><b>{String.fromCharCode(65 + index)}</b>{t(value)}</button>)}</div>;
};

const Optional = ({ c, correctIndex, picked, setPicked }) => {
  const t = useT();
  return <div className="optional"><span>{t({ uz: 'IXTIYORIY TAXMIN', ru: 'НЕОБЯЗАТЕЛЬНАЯ ГИПОТЕЗА', en: "OPTIONAL HYPOTHESIS" })}</span><Options values={c.options} picked={picked} onPick={setPicked} /><Feedback show={picked !== null} correct={picked === correctIndex}>{picked !== null ? t(c.wrong[picked]) : ''}</Feedback></div>;
};

const RowShift = ({ raw, full, shift, active, label }) => (
  <div className={`row-shift shift-${shift} ${active ? 'active' : ''}`}>
    <small>{label}</small>
    <div className="row-rail"><span className="raw-row">{raw}</span><i>→</i><strong>{full}</strong></div>
    <em>{shift}</em>
  </div>
);

const ZeroPlaceholderIllustration = ({ solved }) => (
  <svg className={`flat-math-svg zero-placeholder-svg ${solved ? 'is-solved' : ''}`} viewBox="0 0 680 168" aria-hidden="true" focusable="false">
    <rect className="zero-scene-shell" x="2" y="2" width="676" height="164" rx="22" />
    <g className="zero-multiplier">
      <rect x="22" y="30" width="132" height="108" rx="18" />
      <rect className="digit-chip hundreds-chip" x="34" y="48" width="34" height="34" rx="10" />
      <rect className="digit-chip zero-chip" x="71" y="48" width="34" height="34" rx="10" />
      <rect className="digit-chip units-chip" x="108" y="48" width="34" height="34" rx="10" />
      <text x="51" y="71" textAnchor="middle">2</text>
      <text className="zero-digit" x="88" y="71" textAnchor="middle">0</text>
      <text x="125" y="71" textAnchor="middle">4</text>
      <text className="base-number" x="88" y="116" textAnchor="middle">132</text>
    </g>
    <path className="zero-branch branch-top" d="M160 62C206 62 210 37 260 37" />
    <path className="zero-branch branch-mid" d="M160 72C206 72 210 84 260 84" />
    <path className="zero-branch branch-bottom" d="M160 82C206 82 210 131 260 131" />
    <g className="placeholder-row row-units">
      <rect x="260" y="17" width="384" height="40" rx="12" />
      <circle cx="285" cy="37" r="8" />
      <text x="310" y="43">4</text>
      <text className="placeholder-value" x="618" y="43" textAnchor="end">{solved ? '528' : '···'}</text>
    </g>
    <g className="placeholder-row row-zero">
      <rect x="260" y="64" width="384" height="40" rx="12" />
      <circle cx="285" cy="84" r="8" />
      <text x="310" y="90">0</text>
      <path className="placeholder-dash" d="M350 84H574" />
      <text className="placeholder-value zero-value" x="618" y="90" textAnchor="end">0</text>
    </g>
    <g className="placeholder-row row-hundreds">
      <rect x="260" y="111" width="384" height="40" rx="12" />
      <circle cx="285" cy="131" r="8" />
      <text x="310" y="137">2</text>
      <text className="placeholder-value" x="618" y="137" textAnchor="end">{solved ? '26 400' : '···'}</text>
    </g>
  </svg>
);

const cleanNumber = (value) => String(value ?? '').replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '').slice(0, 8);

function Screen0({ screen, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null);
  const pick = (index) => { setPicked(index); onAnswer({ screenIdx: screen, stage: 'hook', question: t(c.question), options: c.options.map(t), correctIndex: 1, correctAnswer: t(c.options[1]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: index === 1, firstTry: index === 1, attempts: 1, solved: true }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="hook-scene"><div><span>1 {t({ uz: 'panel', ru: 'панель', en: "panel" })}</span><strong>236</strong><small>{t({ uz: 'kontakt', ru: 'контактов', en: "contacts" })}</small></div><i>×</i><div><span>{t({ uz: 'panellar', ru: 'панелей', en: "panels" })}</span><strong>314</strong></div><BitSVG state="think" /><div className={`range-hint beat-${audio.beat}`}><span>7 000</span><b>70 000–80 000</b><span>800 000</span></div></section><section className="question"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} /><Feedback show={picked !== null} correct>{t({ uz: 'Taxmin saqlandi. Endi 314 sonining tuzilishini tekshiramiz.', ru: 'Оценка сохранена. Теперь разберём строение числа 314.', en: "Estimate saved. Now examine the structure of 314." })}</Feedback></section></div></Stage>;
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s1; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null); const reveal = audio.beat >= 2 || audio.completed;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="decompose"><strong>201</strong><div className={reveal ? 'links reveal' : 'links'}><span>2 → <b>200</b></span><span>0 → <b>0</b></span><span>1 → <b>1</b></span></div><em className={reveal ? 'reveal' : ''}>201 = 200 + 0 + 1</em></section><section className="question"><h2>{t(c.question)}</h2><Optional c={c} correctIndex={0} picked={picked} setPicked={setPicked} /></section></div></Stage>;
}

function Screen2({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s2; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null); const reveal = audio.beat >= 1 || audio.completed;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="rails-model"><div className="formula-top">314 = 300 + 10 + 4</div><div className={reveal ? 'three-rails reveal' : 'three-rails'}><div><b>4 {t({ uz: 'birlik', ru: 'единицы', en: "ones" })}</b><span>0 {t({ uz: 'xona', ru: 'разрядов', en: "places" })}</span></div><div><b>1 {t({ uz: "o'nlik", ru: 'десяток', en: "ten" })}</b><span>1 {t({ uz: 'xona', ru: 'разряд', en: "place" })}</span></div><div><b>3 {t({ uz: 'yuzlik', ru: 'сотни', en: "hundreds" })}</b><span>2 {t({ uz: 'xona', ru: 'разряда', en: "places" })}</span></div></div></section><section className="question"><h2>{t(c.question)}</h2><Optional c={c} correctIndex={1} picked={picked} setPicked={setPicked} /></section></div></Stage>;
}

function Screen3({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s3; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="synthesis"><div className="formula-top">236 × 314</div><AlignedRows reveal={audio.beat} raw /><p>{t({ uz: "Qatorlar bir marta siljitiladi, so'ng birliklar bo'yicha tekislanadi.", ru: 'Строки сдвигаются один раз, затем выравниваются по единицам.', en: "The rows are shifted once, then aligned by the ones place." })}</p></section></div></Stage>;
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s4; const audio = useNarration(c.audio, screen); const reveal = audio.beat >= 2 || audio.completed;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="units-row"><div className="shift-badge">4 {t({ uz: 'panel', ru: 'панели', en: "panels" })} × 236</div><div className="mini-calc"><span>236</span><span>× 4</span><i /><strong className={reveal ? 'reveal' : ''}>944</strong></div><p>{t({ uz: 'Har bir guruhdagi miqdor × guruhlar soni', ru: 'Количество в группе × число групп', en: "Quantity in one group × number of groups" })}</p></section></div></Stage>;
}

function Screen5({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s5; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null); const shifted = audio.beat >= 1 || audio.completed;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="shift-scene"><div className="shift-badge">1 {t({ uz: "o'nlik", ru: 'десяток', en: "ten" })} → 1 {t({ uz: 'xona chapga', ru: 'разряд влево', en: "place to the left" })}</div><RowShift raw="236" full="2 360" shift={1} active={shifted} label={t({ uz: "O'nliklar qatori", ru: 'Строка десятков', en: "Tens row" })} /><p>{t({ uz: 'Xom 236 faqat bir marta chapga siljiydi.', ru: 'Исходное 236 сдвигается влево только один раз.', en: "The original 236 shifts left only once." })}</p></section><section className="question"><h2>{t(c.question)}</h2><Optional c={c} correctIndex={1} picked={picked} setPicked={setPicked} /></section></div></Stage>;
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s6; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null); const shifted = audio.beat >= 1 || audio.completed;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="shift-scene"><div className="shift-badge">103 = 100 + 0 + 3</div><RowShift raw="213" full="21 300" shift={2} active={shifted} label={t({ uz: 'Yuzliklar qatori', ru: 'Строка сотен', en: "Hundreds row" })} /><p>{t({ uz: "Nol o'nliklar qatorining o'rnini saqlaydi.", ru: 'Ноль сохраняет место строки десятков.', en: "Zero preserves the position of the tens row." })}</p></section><section className="question"><h2>{t(c.question)}</h2><Optional c={c} correctIndex={2} picked={picked} setPicked={setPicked} /></section></div></Stage>;
}

const AlignedRows = ({ reveal = 4, raw = false }) => (
  <div className="aligned-rows">
    <span className={reveal >= 0 ? 'show' : ''}>{raw ? '944' : '944'}</span>
    <span className={reveal >= 1 ? 'show' : ''}>{raw && reveal < 1 ? '236' : '2 360'}</span>
    <span className={reveal >= 2 ? 'show' : ''}>{raw && reveal < 2 ? '708' : '70 800'}</span>
    <i />
    <strong className={reveal >= 3 ? 'show' : ''}>74 104</strong>
  </div>
);

function Screen7({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s7; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="synthesis"><AlignedRows reveal={audio.beat} /><div className={audio.beat >= 4 ? 'range-result reveal' : 'range-result'}>70 000 &lt; <b>74 104</b> &lt; 80 000</div><p>{t({ uz: "944, 2 360 va 70 800 yig'indisi 74 104.", ru: 'Сумма 944, 2 360 и 70 800 равна 74 104.', en: "The sum of 944, 2 360 and 70 800 is 74 104." })}</p></section></div></Stage>;
}

function ChoicePractice({ screen, c, correctIndex, storedAnswer, onAnswer, onNext, onPrev, visual, correctProof, audioFeedback }) {
  const t = useT(); const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [solved, setSolved] = useState(storedAnswer?.correct === true); const attempts = useRef(storedAnswer?.attempts ?? 0); const firstTry = useRef(storedAnswer?.firstTry ?? true);
  const pick = (index) => { if (solved) return; attempts.current += 1; const ok = index === correctIndex; if (!ok) firstTry.current = false; setPicked(index); setSolved(ok); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(audioFeedback[index])); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex, correctAnswer: t(c.options[correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && firstTry.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit={screen === 12 ? 'awkward' : null} />{visual}<section className="question"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} correctIndex={correctIndex} solved={solved} wrong={picked !== null && !solved} disabled={solved} /><Feedback show={picked !== null} correct={solved}>{picked !== null ? t(c.wrong[picked]) : ''}</Feedback>{solved && correctProof}</section></div></Stage>;
}

function Screen8({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s8; const audio = useNarration(c.audio, screen); const left = [{ uz: '4 birlik', ru: '4 единицы', en: "4 ones" }, { uz: "1 o'nlik", ru: '1 десяток', en: "1 ten" }, { uz: '3 yuzlik', ru: '3 сотни', en: "3 hundreds" }]; const right = [{ uz: '0 xona', ru: '0 разрядов', en: "0 places" }, { uz: '1 xona', ru: '1 разряд', en: "1 place" }, { uz: '2 xona', ru: '2 разряда', en: "2 places" }]; const [active, setActive] = useState(null); const [pairs, setPairs] = useState(storedAnswer?.correct ? [0, 1, 2] : [null, null, null]); const [message, setMessage] = useState(null); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true); const solved = pairs.every((value, index) => value === index);
  const chooseRight = (index) => { if (active === null || solved) return; attempts.current += 1; if (index !== active) { clean.current = false; const hint = { uz: "Raqamning o'ziga emas, ko'paytiruvchidagi xonasiga qarang.", ru: 'Смотри не только на цифру, а на её разряд в множителе.', en: "Look not only at the digit, but also at its place in the multiplier." }; setMessage(hint); playSfx('wrong'); audio.pushOneOff(t(hint)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), correct: false, firstTry: false, attempts: attempts.current, solved: false, studentAnswer: `${active}:${index}` }); return; } const next = [...pairs]; next[active] = index; setPairs(next); setActive(null); const done = next.every((value, place) => value === place); if (done) { const ok = { uz: "To'g'ri. Birlik, o'nlik va yuzlik qatorlari nol, bir va ikki xona siljiydi.", ru: 'Верно. Строки единиц, десятков и сотен сдвигаются на ноль, один и два разряда.', en: "Correct. The ones, tens and hundreds rows shift by zero, one and two places." }; setMessage(ok); playSfx('correct'); audio.pushOneOff(t(ok)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), correct: true, firstTry: clean.current, attempts: attempts.current, solved: true, studentAnswer: next.join(','), correctAnswer: '0,1,2' }); } };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="matching"><div>{left.map((item, index) => <button type="button" key={t(item)} className={`${active === index ? 'picked' : ''} ${pairs[index] !== null ? 'matched' : ''}`} onClick={() => pairs[index] === null && setActive(index)} disabled={pairs[index] !== null}>{t(item)}{pairs[index] !== null && <b>{t(right[pairs[index]])}</b>}</button>)}</div><i>↔</i><div>{right.map((item, index) => <button type="button" key={t(item)} className={pairs.includes(index) ? 'matched' : ''} onClick={() => chooseRight(index)} disabled={pairs.includes(index)}>{t(item)}</button>)}</div></section><Feedback show={message !== null} correct={solved}>{message ? t(message) : ''}</Feedback></div></Stage>;
}

function Screen9({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s9; const audio = useNarration(c.audio, screen); const cards = ['528', '0', '2 640', '26 400', '5 280']; const correct = ['528', '0', '26 400']; const labels = [{ uz: 'birliklar qatori', ru: 'строка единиц', en: "ones row" }, { uz: "o'nliklar qatori", ru: 'строка десятков', en: "tens row" }, { uz: 'yuzliklar qatori', ru: 'строка сотен', en: "hundreds row" }]; const [slots, setSlots] = useState(storedAnswer?.correct ? correct : [null, null, null]); const [selected, setSelected] = useState(null); const [bad, setBad] = useState([]); const [message, setMessage] = useState(null); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true); const solved = slots.every((value, index) => value === correct[index]); const available = cards.filter((card) => !slots.includes(card));
  const evaluate = (next) => { if (next.some((value) => value === null)) return; attempts.current += 1; const wrong = next.map((value, index) => value !== correct[index] ? index : -1).filter((index) => index >= 0); const ok = wrong.length === 0; if (!ok) clean.current = false; setBad(wrong); const text = ok ? { uz: "To'g'ri. 528, 0 va 26 400 qatorlari 26 928 ni beradi.", ru: 'Верно. Строки 528, 0 и 26 400 дают 26 928.', en: "Correct. The rows 528, 0 and 26 400 make 26 928." } : next[2] === '2 640' ? { uz: '2 yuzlar xonasida, shuning uchun yuzliklar qatori ikki xona siljiydi.', ru: 'Цифра 2 стоит в сотнях, поэтому строка сотен сдвигается на два разряда.', en: "The digit 2 is in the hundreds, so the hundreds row shifts by two places." } : next[0] === '5 280' ? { uz: "132 ni 4 ga ko'paytirish 528 bo'ladi; birliklar qatorini siljitmang.", ru: 'Произведение 132 на 4 равно 528; не сдвигай строку единиц.', en: "132 multiplied by 4 is 528; do not shift the ones row." } : { uz: "528 birliklar, 0 o'nliklar, 26 400 yuzliklar qatoridir.", ru: '528 является строкой единиц, 0 строкой десятков, а 26 400 строкой сотен.', en: "528 is the ones row, 0 is the tens row and 26 400 is the hundreds row." }; setMessage(text); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(ok ? t({ uz: "To'g'ri. Qatorlarning yig'indisi yigirma olti ming to'qqiz yuz yigirma sakkiz.", ru: 'Верно. Сумма строк равна двадцати шести тысячам девятистам двадцати восьми.', en: "Correct. The sum of the rows is twenty-six thousand nine hundred and twenty-eight." }) : t({ uz: 'Har bir kartaning xona qiymatini yana tekshiring.', ru: 'Ещё раз проверь разрядное значение каждой карточки.', en: "Check the place value of each card again." })); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: cards, correctAnswer: correct.join('|'), studentAnswer: next.join('|'), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  const place = (index) => { if (solved) return; if (slots[index] !== null) { const next = [...slots]; next[index] = null; setSlots(next); setBad([]); setMessage(null); return; } if (selected === null) return; const next = [...slots]; next[index] = selected; setSlots(next); setSelected(null); setBad([]); setMessage(null); evaluate(next); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="construction"><ZeroPlaceholderIllustration solved={solved} /><div className="slots">{labels.map((label, index) => <button type="button" key={t(label)} className={`${slots[index] ? 'filled' : ''} ${bad.includes(index) ? 'bad' : ''}`} onClick={() => place(index)} disabled={solved}><small>{t(label)}</small><strong>{slots[index] ?? '···'}</strong></button>)}</div><div className="bank">{available.map((card) => <button type="button" key={card} className={selected === card ? 'picked' : ''} onClick={() => setSelected(card)} disabled={solved}>{card}</button>)}</div><div className={`aligned-zero ${solved ? 'reveal' : ''}`}><span>528</span><span className="zero-row">0</span><span>26 400</span><i /><b>26 928</b></div><p>{t({ uz: "26 400 tayyor yuzliklar qiymati, u qayta siljitilmaydi.", ru: '26 400 уже является значением строки сотен и больше не сдвигается.', en: "26 400 is already the value of the hundreds row and should not be shifted again." })}</p></section><Feedback show={message !== null} correct={solved}>{message ? t(message) : ''}</Feedback></div></Stage>;
}

function Screen10({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s10; const audio = useNarration(c.audio, screen); const [value, setValue] = useState(storedAnswer?.studentAnswer ?? ''); const [solved, setSolved] = useState(storedAnswer?.correct === true); const [message, setMessage] = useState(null); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const submit = () => { const answer = cleanNumber(value); if (!answer || solved) return; attempts.current += 1; const ok = answer === '47270'; if (!ok) clean.current = false; setSolved(ok); const numeric = Number(answer); const text = ok ? { uz: "To'g'ri. Natija 47 270.", ru: 'Верно. Результат равен 47 270.', en: "Correct. The result is 47 270." } : Math.abs(numeric - 45000) > 6000 ? { uz: "Javob qirq besh mingga yaqin bo'lishi kerak.", ru: 'Ответ должен быть близок к сорока пяти тысячам.', en: "The answer should be close to forty-five thousand." } : { uz: '43 500 yuzliklar qatori ikki xona siljishi bilan yoziladi.', ru: 'Строка сотен 43 500 записывается со сдвигом на два разряда.', en: "The hundreds row, 43 500, is written with a shift of two places." }; setMessage(text); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(ok ? t({ uz: "To'g'ri. Natija qirq yetti ming ikki yuz yetmish.", ru: 'Верно. Результат равен сорока семи тысячам двумстам семидесяти.', en: "Correct. The result is forty-seven thousand two hundred and seventy." }) : t({ uz: 'Javobni qirq besh minglik taxmin va yuzliklar qatori bilan tekshiring.', ru: 'Проверь ответ оценкой около сорока пяти тысяч и строкой сотен.', en: "Check the answer using an estimate of about forty-five thousand and the hundreds row." })); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), correctAnswer: '47270', studentAnswer: answer, correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="question"><h2>{t(c.question)}</h2><div className="input-row"><input className={solved ? 'answer correct-input' : message ? 'answer wrong-input' : 'answer'} inputMode="numeric" placeholder="0" value={value} disabled={solved} onChange={(event) => { setValue(cleanNumber(event.target.value)); setMessage(null); }} onKeyDown={(event) => event.key === 'Enter' && submit()} /><button type="button" className="btn next" onClick={submit} disabled={!value || solved}>{t({ uz: 'Tekshirish', ru: 'Проверить', en: "Check" })}</button></div><Feedback show={message !== null} correct={solved}>{message ? t(message) : ''}</Feedback>{solved && <div className="proof-grid"><span>145 × 6 = 870</span><span>145 × 20 = 2 900</span><span>145 × 300 = 43 500</span><b>47 270</b></div>}</section></div></Stage>;
}

function Screen11(props) {
  const t = useT(); const c = CONTENT.s11; const audioFeedback = [
    { uz: "To'g'ri. Uch yuz to'qson sakkiz ikki yuzga va birga alohida ko'paytiriladi.", ru: 'Верно. Триста девяносто восемь отдельно умножается на двести и на один.', en: "Correct. Three hundred and ninety-eight is multiplied separately by two hundred and by one." },
    { uz: "Aniq javob uchun sakson ming to'rt yuzdan to'rt yuz ikkini ayirish kerak.", ru: 'Для точного ответа нужно вычесть четыреста два из восьмидесяти тысяч четырёхсот.', en: "To get the exact answer, subtract four hundred and two from eighty thousand four hundred." },
    { uz: "Qo'shish ikki yuz bir teng guruhni ifodalamaydi.", ru: 'Сложение не показывает двести одну равную группу.', en: "Addition does not represent two hundred and one equal groups." },
  ];
  return <ChoicePractice {...props} c={c} correctIndex={0} audioFeedback={audioFeedback} visual={<div className="strategy-visual"><span>201 = 200 + 1</span><i>→</i><b>398 × 200 + 398</b></div>} correctProof={<div className="proof-grid"><span>398 × 200 = 79 600</span><span>398 × 1 = 398</span><b>79 600 + 398 = 79 998</b><small>{t({ uz: '80 000 taxminidan 2 kichik', ru: 'На 2 меньше оценки 80 000', en: "2 less than the estimate of 80 000" })}</small></div>} />;
}

function Screen12(props) {
  const c = CONTENT.s12; const audioFeedback = [
    { uz: "To'g'ri. Yuzlik qatori yigirma bir ming uch yuz.", ru: 'Верно. Строка сотен равна двадцати одной тысяче трёмстам.', en: "Correct. The hundreds row is twenty-one thousand three hundred." },
    { uz: "Bu bir birlikka ko'paytma. Bu yerda bir raqami yuzni bildiradi.", ru: 'Это произведение на одну единицу. Здесь цифра один означает сто.', en: "This is a product by one unit. Here the digit one represents one hundred." },
    { uz: 'Yuzliklar qatori uch emas, ikki xona siljiydi.', ru: 'Строка сотен сдвигается на два разряда, а не на три.', en: "The hundreds row shifts by two places, not three." },
  ];
  return <ChoicePractice {...props} c={c} correctIndex={0} audioFeedback={audioFeedback} visual={<div className="error-visual"><span>213 × 103</span><div><i>639</i><i>0</i><b>2 130</b><strong>2 769</strong></div></div>} correctProof={<div className="proof-grid"><span>2 130 → 21 300</span><b>21 300 + 639 = 21 939</b></div>} />;
}

function Screen13(props) {
  const t = useT(); const c = CONTENT.s13; const audioFeedback = [
    { uz: "To'g'ri. Ikki yuz, nol o'nlik va uch birlik qismlari alohida hisoblanadi.", ru: 'Верно. Части двухсот, нуля десятков и трёх единиц учтены отдельно.', en: "Correct. The two hundreds, zero tens and three ones have been handled separately." },
    { uz: 'Ikki raqami yuzlar xonasida turib, ikki yuzni bildiradi.', ru: 'Цифра два стоит в сотнях и означает двести.', en: "The digit two is in the hundreds place and represents two hundred." },
    { uz: "O'nlar raqami nol. O'ttizga ko'paytma kerak emas.", ru: 'Цифра десятков равна нулю. Произведение на тридцать не нужно.', en: "The tens digit is zero. A product by thirty is not needed." },
  ];
  return <ChoicePractice {...props} c={c} correctIndex={0} audioFeedback={audioFeedback} visual={<div className="blocks-visual"><span>203 {t({ uz: 'blok', ru: 'блока', en: "blocks" })}</span><b>124</b></div>} correctProof={<div className="proof-grid"><span>124 × 200 = 24 800</span><span>124 × 0 = 0</span><span>124 × 3 = 372</span><b>24 800 + 0 + 372 = 25 172</b></div>} />;
}

function Screen14({ screen, onPrev, finishLesson, answers = [] }) {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s14;
  const audio = useNarration(c.audio, screen);
  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const visibleBeat = reduced ? 4 : audio.beat;
  const finalBeat = reduced || visibleBeat >= 4 || audio.completed || audio.muted;
  const scoredIndexes = SCREEN_META.reduce((indexes, meta, index) => (meta.scored ? [...indexes, index] : indexes), []);
  const firstTryCount = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
  const totalScored = scoredIndexes.length;
  const rewardTitles = {
    top: { uz: "Uch qator me'mori", ru: 'Архитектор трёх строк', en: "Three-Row Architect" },
    middle: { uz: 'Uch qator ustasi', ru: 'Мастер трёх строк', en: "Three-Row Master" },
    base: { uz: 'Uch qator tadqiqotchisi', ru: 'Исследователь трёх строк', en: "Three-Row Explorer" },
  };
  const rewardTitle = firstTryCount === totalScored
    ? rewardTitles.top
    : firstTryCount >= Math.max(1, totalScored - 1)
      ? rewardTitles.middle
      : rewardTitles.base;
  const rules = [
    { uz: "Birliklar qatori — 0 xona", ru: 'Строка единиц — 0 разрядов', en: "Ones row — 0 places" },
    { uz: "O'nliklar qatori — 1 xona", ru: 'Строка десятков — 1 разряд', en: "Tens row — 1 place" },
    { uz: "Yuzliklar qatori — 2 xona", ru: 'Строка сотен — 2 разряда', en: "Hundreds row — 2 places" },
    { uz: "Nol xona o'rnini saqlaydi", ru: 'Ноль сохраняет место разряда', en: "Zero preserves the place value" },
    { uz: "Qatorlarni qo'shing va taxmin bilan tekshiring", ru: 'Сложи строки и проверь результат оценкой', en: "Add the rows and check the result with an estimate" },
  ];
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish>
      <div className="stack finale-layout">
        <G4TitleReveal active={finalBeat} title={t(rewardTitle)} lang={lang} />
        <style>{G4_TITLE_STYLES}</style>
        <header className="finale-heading">
          <Heading c={c} />
          <p>{t({ uz: "Uch qator, nol va taxminni bitta yakuniy hisobda birlashtiramiz.", ru: 'Соединим три строки, ноль и оценку в одном итоговом вычислении.', en: "Combine the three rows, the zero and the estimate in one final calculation." })}</p>
        </header>
        <div className="finale-main-grid">
          <section className="finale-payoff-card">
            <span className="finale-section-kicker">{t({ uz: "BOSHLANG'ICH MISSIYA YECHIMI", ru: 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ', en: "OPENING MISSION SOLUTION" })}</span>
            <b className="finale-hook-formula">236 × 314</b>
            <div className="summary">
              <div className="raw-shifts">
                <RowShift raw="944" full="944" shift={0} active={visibleBeat >= 1} label="0" />
                <RowShift raw="236" full="2 360" shift={1} active={visibleBeat >= 2} label="1" />
                <RowShift raw="708" full="70 800" shift={2} active={visibleBeat >= 2} label="2" />
              </div>
              <AlignedRows reveal={visibleBeat >= 4 ? 4 : visibleBeat} />
              <div className={visibleBeat >= 4 ? 'range-result reveal' : 'range-result'}>70 000 &lt; <b>74 104</b> &lt; 80 000</div>
            </div>
            <p className="finale-payoff-copy">{t({ uz: "Dars boshidagi 70 000–80 000 taxmini aniq 74 104 natijani tasdiqladi.", ru: 'Стартовая оценка 70 000–80 000 подтвердила точный результат 74 104.', en: "The opening estimate of 70 000–80 000 supports the exact result of 74 104." })}</p>
          </section>
          <section className="finale-mastery-card">
            <span className="finale-section-kicker">{t({ uz: "SIZ O'RGANGAN TAYANCHLAR", ru: 'ОСВОЕННЫЕ ОПОРЫ', en: "KEY IDEAS MASTERED" })}</span>
            <div className="rules">
              {rules.map((rule, index) => (
                <div className={visibleBeat >= index ? 'active' : ''} key={t(rule)}>
                  <b>{index + 1}</b>{t(rule)}
                </div>
              ))}
            </div>
          </section>
        </div>
        {finalBeat && <G4TitleCard title={t(rewardTitle)} lang={lang} firstTry={firstTryCount} totalScored={totalScored} />}
        <div className="bridge">
          <span>{t({ uz: "KEYINGI MISSIYA", ru: 'СЛЕДУЮЩАЯ МИССИЯ', en: "NEXT MISSION" })}</span>
          <strong>{t({ uz: "Ko'paytirishga teskari amal bo'lgan bo'lish", ru: 'Деление, обратное действие для умножения', en: "Division, the inverse operation of multiplication" })}</strong>
        </div>
      </div>
    </Stage>
  );
}

const SCREENS = [Screen0, Screen2, Screen8, Screen3, Screen9, Screen7, Screen10, Screen6, Screen12, Screen1, Screen11, Screen4, Screen13, Screen5, Screen14];

export default function Grade4Dars11({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const preview = previewMode ?? (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState(normalizeLang(langProp));
  const lang = preview ? normalizeLang(previewLang) : normalizeLang(langProp);
  configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview });
  const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- lesson duration starts when this component mounts
  const started = useRef(Date.now()); const finished = useRef(false);
  const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old?.firstTry === false ? false : answer.firstTry }; return next; }), []);
  const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - started.current) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars11 preview]', payload); }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  const selectorLabel = ({ uz: 'Til', ru: 'Язык', en: 'Language' })[lang] ?? 'Til';
  return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={`lesson-root ${preview ? 'lesson-root-preview' : ''}`}>{preview && <div className="preview-language" aria-label={selectorLabel}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} answers={answers} storedAnswer={answers[current]} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson} /></div></LangContext.Provider>;
}

const STYLES = `
html:has(.lesson-root),
body:has(.lesson-root),
#root:has(.lesson-root),
.lesson-page:has(.lesson-root),
.lesson-frame:has(.lesson-root) {
  width: 100%;
  height: 100%;
  min-height: 0 !important;
  margin: 0;
  overflow: hidden !important;
  overscroll-behavior: none;
}
.lesson-root,
.lesson-root * { box-sizing: border-box; }
.lesson-root h1,
.lesson-root h2,
.lesson-root p { margin: 0; }
.lesson-root button,
.lesson-root input { font: inherit; }
.lesson-root {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  min-height: 100dvh;
  overflow: hidden;
  color: ${T.ink};
  background:
    radial-gradient(circle at 7% 9%, rgba(22,143,163,.11), transparent 29%),
    radial-gradient(circle at 94% 89%, rgba(255,91,53,.09), transparent 31%),
    ${T.bg};
  font-family: Manrope, Arial, sans-serif;
}
.stage {
  width: min(936px, 100%);
  height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: transparent;
}
.stage-header {
  flex-shrink: 0;
  padding-top: 10px;
  padding-bottom: 8px;
  z-index: 5;
  background: rgba(247,248,244,.88);
  backdrop-filter: blur(14px);
}
.progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(80,97,109,.16);
}
.progress-track > i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, ${T.cyan}, ${T.accent});
  box-shadow: 0 0 12px rgba(255,91,53,.42);
  transition: width .45s ease;
}
.stage-chrome,
.chrome-title,
.chrome-actions,
.audio-controls {
  display: flex;
  align-items: center;
  gap: 9px;
}
.stage-chrome { justify-content: space-between; gap: 12px; }
.chrome-title {
  min-width: 0;
  overflow: hidden;
  color: ${T.ink2};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.status-dot {
  width: 8px;
  height: 8px;
  flex: none;
  border-radius: 50%;
  background: ${T.accent};
  box-shadow: 0 0 10px rgba(255,91,53,.65);
}
.chrome-actions { flex: none; }
.screen-type {
  padding: 4px 8px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-size: 10px;
  font-weight: 800;
}
.screen-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.icon-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  color: ${T.ink2};
  background: rgba(255,255,255,.75);
  cursor: pointer;
  box-shadow: 0 4px 12px -7px rgba(${T.shadowBase},.3);
}
.stage-content {
  min-height: 0;
  flex: 1 1 auto;
  overflow: visible;
  padding-top: 14px;
  padding-bottom: 10px;
  position: relative;
}
.stage-happy-bit { width: 42px; height: 42px; position: absolute; z-index: 3; top: 7px; right: 8px; display: grid; place-items: center; }
.stage-happy-bit .g1-char { width: 100%; height: 100%; display: block; }
.heading { padding-right: 52px; }
.shift-badge { justify-self: center; padding: 6px 12px; border-radius: 999px; color: ${T.navy}; background: ${T.cyanSoft}; font: 900 12px/1.2 'JetBrains Mono', monospace; }
.stage-nav {
  min-height: 72px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: 12px;
  z-index: 5;
  border-top: 1px solid rgba(23,59,82,.08);
  background: rgba(245,245,240,.94);
  backdrop-filter: blur(12px);
}
.btn {
  min-width: 124px;
  min-height: 50px;
  padding: 0 18px;
  border: 0;
  border-radius: 15px;
  color: ${T.ink2};
  background: transparent;
  font: 850 13px/1 Manrope, sans-serif;
  cursor: pointer;
  transition: transform .2s ease, background .2s ease, color .2s ease, opacity .2s ease;
}
.btn.next {
  color: ${T.accent};
  background: ${T.paper};
  box-shadow: 0 13px 28px -18px rgba(255,91,53,.60);
}
.btn:hover:not(:disabled),
.icon-btn:hover:not(:disabled) { transform: translateY(-2px); }
.btn.next:hover:not(:disabled) { color: white; background: ${T.accent}; }
.btn.ghost:hover:not(:disabled) { background: ${T.paper}; }
.btn:disabled,
button:disabled { cursor: default; opacity: .55; }
.lesson-root button:focus-visible,
.lesson-root input:focus-visible { outline: 3px solid rgba(22,143,163,.38); outline-offset: 3px; }
.option.right:disabled,
.matching button.matched:disabled,
.slots button.filled:disabled { opacity: 1; }
.stack { display: grid; gap: 14px; animation: pageEnter .5s cubic-bezier(.16,1,.3,1) both; }
.heading {
  min-height: 86px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}
.heading > div { min-width: 0; }
.heading span,
.bridge > span {
  display: block;
  margin-bottom: 7px;
  color: ${T.cyan};
  font-size: 10px;
  font-weight: 950;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.heading h1 {
  max-width: 770px;
  font: 750 clamp(27px,4vw,41px)/1.05 'Source Serif 4', Georgia, serif;
  letter-spacing: -.025em;
}
.heading .g1-char { width: 90px; height: 112px; flex: none; }
.question,
.decompose,
.rails-model,
.branch-model,
.units-row,
.shift-scene,
.synthesis,
.matching,
.construction,
.strategy-visual,
.error-visual,
.blocks-visual,
.summary,
.rules {
  padding: 17px 19px;
  border-radius: 22px;
  background: ${T.paper};
  box-shadow: 0 18px 42px -31px rgba(${T.shadowBase},.56);
}
.question h2 { font: 750 clamp(18px,2.6vw,25px)/1.28 'Source Serif 4', Georgia, serif; }
.options {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 10px;
  margin-top: 14px;
}
.option {
  min-height: 56px;
  padding: 10px 13px;
  border: 0;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 11px;
  color: ${T.ink};
  background: #F8F8F4;
  text-align: left;
  font: 750 13px/1.35 Manrope, sans-serif;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.17), 0 8px 17px -14px rgba(${T.shadowBase},.35);
  transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
}
.option:hover:not(:disabled),
.option.picked { transform: translateY(-2px); background: ${T.accentSoft}; }
.option > b {
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.paper};
  font: 900 12px/1 'JetBrains Mono', monospace;
}
.option.right { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.28); }
.option.right > b { color: white; background: ${T.success}; }
.option.bad { background: ${T.warnSoft}; box-shadow: inset 0 0 0 2px rgba(169,111,19,.25); }
.optional { margin-top: 12px; }
.optional > span {
  color: ${T.ink3};
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .1em;
}
.feedback {
  max-height: 0;
  margin-top: 0;
  padding: 0 14px;
  overflow: hidden;
  opacity: 0;
  border-radius: 15px;
  display: grid;
  grid-template-columns: 38px 1fr;
  align-items: center;
  gap: 9px;
  transform: translateY(8px);
  transition: max-height .38s ease, padding .34s ease, margin .34s ease, opacity .28s ease, transform .34s ease;
}
.feedback.open { max-height: 190px; margin-top: 12px; padding: 11px 14px; opacity: 1; transform: none; }
.feedback > b {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,.72);
  font-weight: 950;
}
.feedback p { color: ${T.ink2}; font-size: 13px; line-height: 1.45; }
.feedback.correct { background: ${T.successSoft}; box-shadow: inset 4px 0 ${T.success}; }
.feedback.correct > b { color: ${T.success}; }
.feedback.wrong { background: ${T.warnSoft}; box-shadow: inset 4px 0 ${T.warn}; }
.feedback.wrong > b { color: ${T.warn}; }
.caption {
  position: sticky;
  bottom: 4px;
  z-index: 4;
  width: fit-content;
  max-width: min(680px,100%);
  margin: 13px auto 0;
  padding: 9px 13px;
  border-radius: 12px;
  color: white;
  background: rgba(23,59,82,.94);
  text-align: center;
  font-size: 12px;
  line-height: 1.4;
  box-shadow: 0 12px 28px -18px rgba(23,59,82,.8);
}
.hook-scene {
  min-height: 250px;
  padding: 25px 134px 54px 26px;
  border-radius: 26px;
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(150px,1fr) 36px minmax(150px,1fr);
  align-items: center;
  gap: 14px;
  color: white;
  background:
    linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px),
    ${T.navy};
  background-size: 25px 25px;
  box-shadow: 0 24px 58px -35px rgba(23,59,82,.8);
}
.hook-scene > div:not(.range-hint) {
  min-width: 0;
  padding: 16px;
  border-radius: 18px;
  display: grid;
  gap: 4px;
  background: rgba(255,255,255,.08);
  box-shadow: inset 0 0 0 1px rgba(125,225,238,.18);
}
.hook-scene > div > span,
.hook-scene > div > small { color: #BDEEF3; font-size: 11px; font-weight: 800; }
.hook-scene > div > strong { font: 950 clamp(30px,5vw,49px)/1 'JetBrains Mono', monospace; }
.hook-scene > i { color: #7DE1EE; font: 900 30px/1 'JetBrains Mono', monospace; text-align: center; }
.hook-scene > .g1-char { position: absolute; right: 22px; top: 44px; width: 90px; height: 113px; }
.range-hint {
  position: absolute;
  left: 26px;
  right: 24px;
  bottom: 17px;
  display: grid !important;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}
.range-hint b { padding: 7px 10px; border-radius: 999px; color: ${T.navy}; background: ${T.lime}; text-align: center; font: 900 12px/1 'JetBrains Mono', monospace; animation: rangePulse 1.1s ease-in-out infinite alternate; }
.range-hint span { color: rgba(255,255,255,.58) !important; font: 750 10px/1 'JetBrains Mono', monospace; }
.decompose { display: grid; justify-items: center; gap: 14px; }
.decompose > strong { color: ${T.navy}; font: 950 clamp(48px,8vw,76px)/1 'JetBrains Mono', monospace; }
.links { width: min(540px,100%); display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; opacity: 0; transform: translateY(9px); }
.links.reveal { opacity: 1; transform: none; transition: .62s cubic-bezier(.16,1,.3,1); }
.links span { min-height: 58px; padding: 12px; border-radius: 15px; display: grid; place-items: center; color: ${T.ink2}; background: ${T.cyanSoft}; font: 800 16px/1.2 'JetBrains Mono', monospace; }
.links b { color: ${T.cyan}; }
.decompose > em { opacity: 0; color: ${T.accent}; font: normal 900 clamp(18px,3vw,28px)/1.2 'JetBrains Mono', monospace; transform: translateY(8px); }
.decompose > em.reveal { opacity: 1; transform: none; transition: .62s .12s cubic-bezier(.16,1,.3,1); }
.rails-model { display: grid; gap: 14px; }
.formula-top { color: ${T.navy}; text-align: center; font: 900 clamp(20px,3vw,28px)/1.2 'JetBrains Mono', monospace; }
.flat-math-svg { width: 100%; height: auto; display: block; overflow: visible; }
.rails-illustration-wrap {
  display: grid;
  grid-template-columns: minmax(0,1fr) 76px;
  align-items: center;
  gap: 9px;
}
.math-coach { width: 72px; align-self: center; justify-self: center; }
.math-coach .g1-char { width: 100%; height: auto; display: block; }
.parallel-rails-svg { min-width: 0; }
.rail-panel { fill: #F8FBF9; stroke: rgba(22,143,163,.20); stroke-width: 2; }
.rail-gridline { fill: none; stroke: rgba(135,148,157,.13); stroke-width: 1; stroke-dasharray: 3 7; }
.rail-digit { fill: ${T.navy}; }
.rail-digit-text { fill: white; font: 900 17px/1 'JetBrains Mono', monospace; }
.rail-track { fill: none; stroke: rgba(22,143,163,.38); stroke-width: 5; stroke-linecap: round; }
.rail-tie { fill: ${T.cyan}; opacity: .55; }
.rail-cart { opacity: .32; transform-origin: center; transform-box: fill-box; }
.rail-cart rect { fill: ${T.accentSoft}; stroke: ${T.accent}; stroke-width: 2; }
.rail-cart text { fill: ${T.accent}; font: 900 14px/1 'JetBrains Mono', monospace; }
.rail-signal circle { fill: ${T.cyanSoft}; stroke: ${T.cyan}; stroke-width: 2; }
.rail-signal path { fill: none; stroke: ${T.cyan}; stroke-width: 2; stroke-linecap: round; }
.parallel-rails-svg.is-live .rail-cart { opacity: 1; }
.parallel-rails-svg.is-live .rail-cart-0 { animation: railCartZero .48s cubic-bezier(.16,1,.3,1) both; }
.parallel-rails-svg.is-live .rail-cart-1 { animation: railCartOne .72s .09s cubic-bezier(.16,1,.3,1) both; }
.parallel-rails-svg.is-live .rail-cart-2 { animation: railCartTwo .72s .18s cubic-bezier(.16,1,.3,1) both; }
.parallel-rails-svg.is-live .rail-signal { animation: railSignal .62s .42s ease both; }
.three-rails { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; opacity: 0; transform: translateY(8px); }
.three-rails.reveal { opacity: 1; transform: none; transition: .62s cubic-bezier(.16,1,.3,1); }
.three-rails > div { min-height: 94px; padding: 14px; border-radius: 17px; display: grid; align-content: center; gap: 8px; background: #F8F8F4; box-shadow: inset 0 0 0 1px rgba(135,148,157,.16); }
.three-rails b { color: ${T.navy}; font: 850 15px/1.2 'JetBrains Mono', monospace; }
.three-rails span { color: ${T.cyan}; font-size: 12px; font-weight: 850; }
.branch-model { display: grid; justify-items: center; gap: 12px; }
.branch-model > strong { color: ${T.navy}; font: 950 clamp(26px,4vw,38px)/1 'JetBrains Mono', monospace; }
.branch-model > span { color: ${T.ink2}; font: 800 16px/1.2 'JetBrains Mono', monospace; }
.branch-model > div { width: 100%; display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.branch-model > div > b { min-height: 62px; padding: 12px; border-radius: 16px; display: grid; place-items: center; opacity: .16; color: ${T.cyan}; background: ${T.cyanSoft}; font: 850 15px/1.2 'JetBrains Mono', monospace; transform: translateY(9px); }
.branch-model > div > b.reveal,
.branch-model > em.reveal { opacity: 1; transform: none; transition: .55s cubic-bezier(.16,1,.3,1); }
.branch-model > em { opacity: .16; color: ${T.accent}; font: normal 900 19px/1.2 'JetBrains Mono', monospace; transform: translateY(8px); }
.units-row { display: grid; grid-template-columns: 150px 50px 1fr; align-items: center; gap: 18px; }
.mini-calc { padding: 12px 19px; display: grid; justify-items: end; color: ${T.navy}; font: 900 22px/1.35 'JetBrains Mono', monospace; }
.mini-calc > i { width: 100%; height: 2px; background: ${T.ink}; }
.mini-calc > strong { opacity: .16; }
.mini-calc > strong.reveal { opacity: 1; animation: digitDrop .42s ease both; }
.carry-arc { color: ${T.accent}; font-size: 42px; text-align: center; animation: carryArc .72s ease-in-out infinite alternate; }
.units-row > b { padding: 12px; border-radius: 14px; color: ${T.cyan}; background: ${T.cyanSoft}; text-align: center; font: 850 15px/1.25 'JetBrains Mono', monospace; animation: digitDrop .42s ease both; }
.units-row .row-shift { grid-column: 1 / -1; }
.shift-scene { display: grid; justify-items: center; gap: 16px; }
.place-value-note { padding: 9px 16px; border-radius: 999px; color: ${T.navy}; background: ${T.warnSoft}; font: 900 15px/1 'JetBrains Mono', monospace; }
.shift-scene > p,
.synthesis > p,
.construction > p { color: ${T.ink2}; text-align: center; font-size: 13px; line-height: 1.45; }
.row-shift { width: min(560px,100%); display: grid; grid-template-columns: 110px 1fr 34px; align-items: center; gap: 10px; }
.row-shift > small { color: ${T.ink2}; font-size: 11px; font-weight: 850; }
.row-shift > em { width: 30px; height: 30px; border-radius: 10px; display: grid; place-items: center; color: white; background: ${T.navy}; font: normal 900 12px/1 'JetBrains Mono', monospace; }
.row-rail { min-height: 62px; padding: 10px 16px; border-radius: 16px; position: relative; overflow: hidden; display: grid; grid-template-columns: 1fr 28px 1fr; align-items: center; color: ${T.navy}; background: linear-gradient(90deg,${T.cyanSoft},#F8F8F4); font: 900 clamp(17px,2.8vw,25px)/1 'JetBrains Mono', monospace; }
.row-rail span { text-align: center; }
.row-rail i { color: ${T.accent}; text-align: center; font-style: normal; }
.row-rail strong { opacity: .12; text-align: center; }
.row-shift.active .row-rail strong { opacity: 1; animation: fullAppear .62s .18s cubic-bezier(.16,1,.3,1) both; }
.row-shift.active .raw-row { animation: rawFade .46s ease both; }
.row-shift.shift-1.active .raw-row { animation: rawShiftOne .72s cubic-bezier(.16,1,.3,1) both; }
.row-shift.shift-2.active .raw-row { animation: rawShiftTwo .72s cubic-bezier(.16,1,.3,1) both; }
.synthesis,
.summary { display: grid; grid-template-columns: minmax(270px,1fr) minmax(180px,.72fr); align-items: center; gap: 16px; }
.synthesis-console { grid-template-columns: minmax(190px,.72fr) minmax(170px,.48fr); }
.control-panel-wrap {
  grid-column: 1 / -1;
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0,1fr) 78px;
  align-items: center;
  gap: 8px;
}
.console-coach { width: 74px; }
.shift-console-svg { min-width: 0; filter: drop-shadow(0 18px 24px rgba(23,59,82,.16)); }
.console-shell { fill: ${T.navy}; }
.console-topline { fill: none; stroke: rgba(255,255,255,.13); stroke-width: 1.5; }
.console-led { opacity: .9; }
.led-one { fill: ${T.accent}; }
.led-two { fill: #FFC23C; }
.led-three { fill: ${T.lime}; }
.console-place { fill: none; stroke: rgba(125,225,238,.10); stroke-width: 1; stroke-dasharray: 3 6; }
.console-index { fill: rgba(125,225,238,.15); stroke: #7DE1EE; stroke-width: 1.5; }
.console-index-text { fill: #BDEEF3; font: 900 14px/1 'JetBrains Mono', monospace; }
.console-raw { fill: rgba(255,255,255,.08); stroke: rgba(255,255,255,.14); stroke-width: 1; }
.console-raw-text { fill: white; font: 850 14px/1 'JetBrains Mono', monospace; }
.console-track { fill: none; stroke: rgba(125,225,238,.34); stroke-width: 4; stroke-linecap: round; }
.console-cart { opacity: .28; transform-box: fill-box; transform-origin: center; }
.console-cart rect { fill: ${T.accent}; }
.console-cart circle { fill: #FFD5C9; }
.console-arrow { fill: none; stroke: #7DE1EE; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; opacity: .55; }
.console-terminal { fill: rgba(255,255,255,.07); stroke: rgba(149,201,61,.35); stroke-width: 1.5; }
.console-terminal-text { fill: ${T.lime}; opacity: .18; font: 900 15px/1 'JetBrains Mono', monospace; }
.console-lane.is-active .console-cart { opacity: 1; }
.console-lane-0.is-active .console-cart { animation: consoleShiftZero .46s cubic-bezier(.16,1,.3,1) both; }
.console-lane-1.is-active .console-cart { animation: consoleShiftOne .72s cubic-bezier(.16,1,.3,1) both; }
.console-lane-2.is-active .console-cart { animation: consoleShiftTwo .72s cubic-bezier(.16,1,.3,1) both; }
.console-lane.is-active .console-terminal { stroke: ${T.lime}; }
.console-lane.is-active .console-terminal-text { animation: consoleTerminal .5s .22s ease both; }
.console-key { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; }
.console-key > span { min-height: 42px; border-radius: 13px; display: grid; place-items: center; color: ${T.cyan}; background: ${T.cyanSoft}; font: 900 13px/1 'JetBrains Mono', monospace; box-shadow: inset 0 0 0 1px rgba(22,143,163,.13); }
.raw-shifts { display: grid; gap: 8px; }
.raw-shifts .row-shift { grid-template-columns: 28px 1fr 30px; }
.raw-shifts .row-shift > small { width: 27px; height: 27px; border-radius: 9px; display: grid; place-items: center; color: ${T.cyan}; background: ${T.cyanSoft}; font: 900 11px/1 'JetBrains Mono', monospace; }
.aligned-rows,
.aligned-zero {
  width: min(220px,100%);
  justify-self: center;
  padding: 14px 18px;
  display: grid;
  justify-items: end;
  color: ${T.navy};
  font: 900 20px/1.4 'JetBrains Mono', monospace;
}
.aligned-rows span,
.aligned-rows strong { opacity: .14; transform: translateY(6px); }
.aligned-rows .show { opacity: 1; transform: none; transition: .42s ease; }
.aligned-rows i,
.aligned-zero i { width: 100%; height: 2px; margin: 2px 0; background: ${T.ink}; }
.synthesis > .range-result,
.summary > .range-result { grid-column: 1 / -1; }
.synthesis > p { grid-column: 1 / -1; }
.range-result { padding: 10px 16px; border-radius: 14px; opacity: .14; color: ${T.ink3}; background: #F8F8F4; text-align: center; font: 800 13px/1.2 'JetBrains Mono', monospace; }
.range-result b { margin: 0 15px; color: ${T.success}; font-size: 18px; }
.range-result.reveal { opacity: 1; animation: fullAppear .62s ease both; }
.matching { min-height: 260px; display: grid; grid-template-columns: 1fr 40px 1fr; align-items: stretch; gap: 12px; }
.matching > div { display: grid; gap: 10px; }
.matching > i { align-self: center; color: ${T.accent}; text-align: center; font: normal 900 24px/1 'JetBrains Mono', monospace; }
.matching button,
.slots button,
.bank button {
  min-height: 52px;
  padding: 10px 13px;
  border: 0;
  border-radius: 15px;
  color: ${T.ink};
  background: #F8F8F4;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.18);
  transition: .2s ease;
}
.matching button { display: grid; align-content: center; gap: 4px; text-align: left; font-size: 13px; font-weight: 800; }
.matching button b { color: ${T.cyan}; font: 850 11px/1.2 'JetBrains Mono', monospace; }
.matching button.picked,
.bank button.picked { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px rgba(255,91,53,.35); transform: translateY(-2px); }
.matching button.matched { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.25); }
.construction { display: grid; gap: 15px; }
.zero-placeholder-svg { filter: drop-shadow(0 14px 22px rgba(23,59,82,.10)); }
.zero-scene-shell { fill: #F8FBF9; stroke: rgba(22,143,163,.18); stroke-width: 2; }
.zero-multiplier > rect:first-child { fill: ${T.navy}; }
.digit-chip { stroke-width: 1.5; }
.hundreds-chip { fill: rgba(125,225,238,.18); stroke: #7DE1EE; }
.zero-chip { fill: ${T.warnSoft}; stroke: ${T.warn}; stroke-dasharray: 3 3; }
.units-chip { fill: ${T.accentSoft}; stroke: ${T.accent}; }
.zero-multiplier text { fill: white; font: 900 14px/1 'JetBrains Mono', monospace; }
.zero-multiplier .zero-digit { fill: ${T.warn}; }
.zero-multiplier .base-number { fill: #BDEEF3; font-size: 18px; }
.zero-branch { fill: none; stroke: rgba(22,143,163,.42); stroke-width: 2.5; stroke-linecap: round; }
.branch-mid { stroke: ${T.warn}; stroke-dasharray: 5 5; }
.placeholder-row rect { fill: white; stroke: rgba(135,148,157,.18); stroke-width: 1.5; }
.placeholder-row circle { fill: ${T.cyanSoft}; stroke: ${T.cyan}; stroke-width: 1.5; }
.placeholder-row text { fill: ${T.ink2}; font: 850 14px/1 'JetBrains Mono', monospace; }
.placeholder-row .placeholder-value { fill: ${T.navy}; font-size: 17px; }
.row-zero rect { fill: ${T.warnSoft}; stroke: ${T.warn}; stroke-dasharray: 5 5; }
.row-zero circle { fill: white; stroke: ${T.warn}; }
.row-zero text,
.placeholder-row .zero-value { fill: ${T.warn}; }
.placeholder-dash { fill: none; stroke: rgba(169,111,19,.45); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 5 7; }
.zero-placeholder-svg.is-solved .row-units,
.zero-placeholder-svg.is-solved .row-hundreds { animation: zeroRowConfirm .62s cubic-bezier(.16,1,.3,1) both; }
.slots { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.slots button { min-height: 88px; display: grid; align-content: center; gap: 8px; }
.slots button small { color: ${T.ink3}; font-size: 10px; font-weight: 850; }
.slots button strong { color: ${T.navy}; font: 900 18px/1 'JetBrains Mono', monospace; }
.slots button.filled { background: ${T.cyanSoft}; }
.slots button.bad { background: ${T.warnSoft}; box-shadow: inset 0 0 0 2px rgba(169,111,19,.28); }
.bank { display: flex; flex-wrap: wrap; justify-content: center; gap: 9px; }
.bank button { min-width: 88px; color: ${T.navy}; font: 900 15px/1 'JetBrains Mono', monospace; }
.aligned-zero { opacity: .13; transition: opacity .5s ease; }
.aligned-zero.reveal { opacity: 1; }
.aligned-zero .zero-row { color: ${T.ink3}; }
.input-row { margin-top: 15px; display: flex; align-items: stretch; gap: 10px; }
.answer {
  min-width: 0;
  min-height: 54px;
  flex: 1;
  padding: 10px 16px;
  border: 2px solid rgba(135,148,157,.25);
  border-radius: 15px;
  outline: 0;
  color: ${T.navy};
  background: #F8F8F4;
  font: 900 20px/1 'JetBrains Mono', monospace;
}
.answer:focus { border-color: ${T.cyan}; box-shadow: 0 0 0 4px rgba(22,143,163,.12); }
.answer.correct-input { border-color: ${T.success}; background: ${T.successSoft}; }
.answer.wrong-input { border-color: ${T.warn}; background: ${T.warnSoft}; }
.proof-grid {
  margin-top: 13px;
  padding: 13px;
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${T.navy};
  background: ${T.cyanSoft};
  font: 850 13px/1.3 'JetBrains Mono', monospace;
  animation: proofOpen .72s cubic-bezier(.16,1,.3,1) both;
}
.proof-grid span,
.proof-grid b,
.proof-grid small { padding: 8px 10px; border-radius: 10px; background: rgba(255,255,255,.66); }
.proof-grid b { color: ${T.success}; }
.proof-grid small { width: 100%; color: ${T.ink2}; text-align: center; font-family: Manrope, sans-serif; }
.strategy-visual,
.blocks-visual { min-height: 124px; display: flex; align-items: center; justify-content: center; gap: 20px; }
.strategy-visual span,
.strategy-visual b,
.blocks-visual span,
.blocks-visual b { padding: 14px 18px; border-radius: 15px; font: 900 clamp(17px,3vw,25px)/1 'JetBrains Mono', monospace; }
.strategy-visual span,
.blocks-visual span { color: ${T.ink2}; background: #F8F8F4; }
.strategy-visual b,
.blocks-visual b { color: ${T.cyan}; background: ${T.cyanSoft}; }
.strategy-visual i { color: ${T.accent}; font: normal 900 26px/1 Manrope, sans-serif; }
.error-visual { min-height: 160px; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 18px; }
.error-visual > span { color: ${T.navy}; text-align: center; font: 900 25px/1 'JetBrains Mono', monospace; }
.error-visual > div { padding: 12px 28px; display: grid; justify-items: end; color: ${T.navy}; font: 900 18px/1.35 'JetBrains Mono', monospace; }
.error-visual i,
.error-visual b,
.error-visual strong { font-style: normal; }
.error-visual b { padding: 2px 6px; border-radius: 7px; color: ${T.warn}; background: ${T.warnSoft}; text-decoration: line-through; }
.error-visual strong { width: 100%; margin-top: 4px; padding-top: 5px; border-top: 2px solid ${T.ink}; color: ${T.warn}; }
.summary { align-items: start; }
.finale-layout { gap: 12px; }
.finale-heading { padding: 12px 16px; border-left: 5px solid ${T.accent}; border-radius: 0 17px 17px 0; background: rgba(255,255,255,.78); box-shadow: 0 8px 22px rgba(${T.shadowBase},.12); }
.finale-heading .heading { min-height: 0; }
.finale-heading .heading span { margin-bottom: 4px; color: ${T.accent}; font-size: 9px; }
.finale-heading .heading h1 { font-size: clamp(21px,3.3vw,29px); line-height: 1.08; }
.finale-heading > p { margin-top: 4px; color: ${T.ink2}; font-size: 11px; font-weight: 750; line-height: 1.35; }
.finale-main-grid { display: grid; grid-template-columns: minmax(0,1.05fr) minmax(270px,.95fr); gap: 12px; align-items: stretch; }
.finale-payoff-card,
.finale-mastery-card { min-width: 0; padding: 14px; border-radius: 19px; background: rgba(255,255,255,.74); box-shadow: 0 8px 22px rgba(${T.shadowBase},.12); }
.finale-payoff-card { display: grid; align-content: center; gap: 8px; }
.finale-section-kicker { color: ${T.cyan}; font-size: 9px; font-weight: 900; letter-spacing: .1em; }
.finale-hook-formula { color: ${T.navy}; text-align: center; font: 900 15px/1 'JetBrains Mono',monospace; }
.finale-payoff-card .summary { margin-top: 9px; grid-template-columns: minmax(0,1fr) minmax(150px,.6fr); gap: 8px; }
.finale-payoff-card .raw-shifts { gap: 4px; }
.finale-payoff-card .row-shift { grid-template-columns: 25px 1fr 25px; gap: 5px; }
.finale-payoff-card .row-rail { min-height: 43px; padding: 6px 8px; font-size: 13px; }
.finale-payoff-card .aligned-rows { width: 150px; padding: 6px 10px; font-size: 14px; }
.finale-payoff-card .range-result { padding: 7px 9px; font-size: 10px; }
.finale-payoff-card .range-result b { margin: 0 7px; font-size: 14px; }
.finale-payoff-copy { color: ${T.ink2}; font-size: 10px; font-weight: 800; line-height: 1.35; }
.finale-mastery-card .rules { margin-top: 9px; grid-template-columns: 1fr; gap: 5px; }
.finale-mastery-card .rules > div { min-height: 44px; padding: 6px 8px; grid-template-columns: 27px 1fr; align-items: center; justify-items: start; gap: 8px; text-align: left; font-size: 9px; }
.finale-mastery-card .rules > div > b { width: 27px; height: 27px; }
.finale-reward { position: relative; min-height: 128px; padding: 10px 22px; display: grid; grid-template-columns: 82px 106px minmax(0,1fr); align-items: center; gap: 15px; border-radius: 22px; color: white; background: ${T.navy}; opacity: .52; overflow: hidden; transform: translateY(7px); transition: opacity .5s ease,transform .5s ease; }
.finale-reward-ready { opacity: 1; transform: none; }
.finale-medal { z-index: 1; display: grid; justify-items: center; gap: 6px; color: white; font-size: 7px; font-weight: 900; letter-spacing: .08em; }
.finale-medal i { width: 68px; height: 68px; border-radius: 50%; display: grid; place-items: center; color: #704800; background: radial-gradient(circle at 35% 28%,#FFF0A0,#FFC23C 57%,#D69300); box-shadow: 0 0 0 7px rgba(255,194,60,.12),0 12px 24px rgba(0,0,0,.22); font-size: 29px; font-style: normal; }
.finale-reward:not(.finale-reward-ready) .finale-medal i { color: #B7C3CA; background: radial-gradient(circle at 35% 28%,#F5F7F8,#B9C5CB 68%,#87949D); box-shadow: 0 0 0 7px rgba(255,255,255,.07); }
.finale-bit { z-index: 1; height: 112px; }
.finale-bit .g1-char { width: 100%; height: 100%; }
.finale-reward-copy { z-index: 1; min-width: 0; display: grid; gap: 5px; }
.finale-reward-copy > span { color: #9DEBF7; font-size: 9px; font-weight: 900; letter-spacing: .1em; }
.finale-reward-copy > strong { font: 800 clamp(18px,2.4vw,25px)/1.08 'Source Serif 4',Georgia,serif; }
.finale-reward-copy > small { color: rgba(255,255,255,.7); font-size: 10px; font-weight: 800; }
.finale-status { display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; gap: 8px; }
.finale-status > b { color: #FFC23C; font: 900 20px/1 'JetBrains Mono',monospace; }
.finale-status > span { display: grid; gap: 2px; color: white; font-size: 9px; font-weight: 850; }
.finale-status small { color: rgba(255,255,255,.68); font-size: 8px; }
.finale-confetti { position: absolute; inset: 0; pointer-events: none; }
.finale-confetti i { position: absolute; width: 6px; height: 10px; border-radius: 2px; background: ${T.accent}; animation: d11FinaleConfetti 1.2s cubic-bezier(.16,1,.3,1) both; }
.finale-confetti i:nth-child(1) { left: 8%; top: 12%; rotate: 17deg; }
.finale-confetti i:nth-child(2) { left: 22%; top: 72%; background: #FFC23C; rotate: -24deg; }
.finale-confetti i:nth-child(3) { left: 38%; top: 18%; background: #9DEBF7; rotate: 35deg; }
.finale-confetti i:nth-child(4) { left: 51%; top: 76%; background: ${T.lime}; rotate: -12deg; }
.finale-confetti i:nth-child(5) { left: 66%; top: 13%; background: #FFC23C; rotate: 28deg; }
.finale-confetti i:nth-child(6) { left: 78%; top: 70%; background: #9DEBF7; rotate: -30deg; }
.finale-confetti i:nth-child(7) { left: 89%; top: 20%; background: ${T.lime}; rotate: 12deg; }
.finale-confetti i:nth-child(8) { left: 95%; top: 67%; rotate: -18deg; }
.rules { display: grid; grid-template-columns: repeat(5,1fr); gap: 8px; }
.rules > div { min-height: 92px; padding: 10px; border-radius: 14px; display: grid; align-content: center; justify-items: center; gap: 8px; color: ${T.ink2}; background: #F8F8F4; text-align: center; font-size: 11px; line-height: 1.35; transition: .22s ease; }
.rules > div > b { width: 27px; height: 27px; border-radius: 9px; display: grid; place-items: center; color: ${T.cyan}; background: ${T.cyanSoft}; font: 900 11px/1 'JetBrains Mono', monospace; }
.rules > div.active { color: ${T.navy}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px rgba(255,91,53,.24); transform: translateY(-3px); }
.bridge { padding: 13px 16px; border-radius: 16px; color: white; background: ${T.navy}; }
.bridge > span { color: #7DE1EE; }
.bridge > strong { font: 750 16px/1.3 'Source Serif 4', Georgia, serif; }
.preview-language {
  position: fixed;
  top: 9px;
  right: 9px;
  z-index: 30;
  display: flex;
  gap: 3px;
  padding: 3px;
  border-radius: 999px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},.6);
}
.preview-language button { padding: 4px 9px; border: 0; border-radius: 999px; color: ${T.ink2}; background: transparent; cursor: pointer; font-size: 10px; font-weight: 900; }
.preview-language .preview-active { color: #FFFFFF; background: ${T.accent}; }
.g1-char { overflow: visible; filter: drop-shadow(0 9px 11px rgba(23,59,82,.20)); }
.g1-bit-ant { transform-origin: 60px 28px; animation: antennaBounce 2.1s ease-in-out infinite; }
.g1-bit-wave,
.bit-wave-right { transform-origin: 84px 76px; animation: bitWave 1.15s ease-in-out infinite alternate; }
.bit-wave-left { transform-origin: 36px 76px; animation: bitWaveLeft 1.15s ease-in-out infinite alternate; }
.bit-think-hand { transform-origin: 84px 76px; animation: thinkTap 1.7s ease-in-out infinite; }
.bit-point-arm { transform-origin: 84px 76px; animation: pointPulse 1.2s ease-in-out infinite alternate; }
.bit-idea-bulb,
.bit-nod-check { animation: bulbPulse 1.15s ease-in-out infinite alternate; }
.g1-eyes { animation: blink 4.6s ease-in-out infinite; transform-origin: center; }
@keyframes pageEnter { from { opacity: 0; transform: translateY(10px); } }
@keyframes rangePulse { to { box-shadow: 0 0 18px rgba(149,201,61,.55); transform: scale(1.025); } }
@keyframes digitDrop { from { opacity: 0; transform: translateY(-10px); } }
@keyframes carryArc { to { transform: translateY(-4px) rotate(-7deg); } }
@keyframes rawFade { to { opacity: 0; } }
@keyframes rawShiftOne { to { opacity: 0; transform: translateX(-42px); } }
@keyframes rawShiftTwo { to { opacity: 0; transform: translateX(-76px); } }
@keyframes railCartZero { from { transform: scale(.88); } to { transform: scale(1); } }
@keyframes railCartOne { from { transform: translateX(0); } to { transform: translateX(-78px); } }
@keyframes railCartTwo { from { transform: translateX(0); } to { transform: translateX(-156px); } }
@keyframes railSignal { from { opacity: .25; transform: scale(.76); } to { opacity: 1; transform: scale(1); } }
@keyframes consoleShiftZero { from { transform: scale(.84); } to { transform: scale(1); } }
@keyframes consoleShiftOne { from { transform: translateX(0); } to { transform: translateX(-52px); } }
@keyframes consoleShiftTwo { from { transform: translateX(0); } to { transform: translateX(-104px); } }
@keyframes consoleTerminal { from { opacity: .15; } to { opacity: 1; } }
@keyframes zeroRowConfirm { from { opacity: .45; transform: translateX(-7px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fullAppear { from { opacity: 0; transform: translateY(7px); } }
@keyframes proofOpen { from { opacity: 0; transform: translateY(10px); } }
@keyframes antennaBounce { 50% { transform: rotate(5deg); } }
@keyframes bitWave { to { transform: rotate(-11deg); } }
@keyframes bitWaveLeft { to { transform: rotate(11deg); } }
@keyframes thinkTap { 50% { transform: rotate(-5deg) translateY(-2px); } }
@keyframes pointPulse { to { transform: translateX(3px); } }
@keyframes bulbPulse { to { filter: drop-shadow(0 0 5px rgba(255,194,60,.75)); transform: scale(1.06); } }
@keyframes blink { 0%,45%,49%,100% { transform: scaleY(1); } 47% { transform: scaleY(.12); } }
@keyframes d11FinaleConfetti { from { opacity: 0; translate: 0 -14px; rotate: 0deg; } to { opacity: .82; } }
@media (max-height: 780px) {
  .stage-content { padding-top: 7px; padding-bottom: 5px; }
  .stage-nav { min-height: 58px; padding-block: 6px; }
  .stack { gap: 8px; }
  .heading { min-height: 62px; gap: 8px; }
  .question, .decompose, .rails-model, .branch-model, .units-row,
  .shift-scene, .synthesis, .matching, .construction { padding: 9px; }
  .options { gap: 8px; }
  .option { min-height: 50px; padding: 8px 10px; }
  .feedback { min-height: 44px; padding-block: 7px; }
  .parallel-rails { max-height: 112px; }
}

@media (max-width: 639.98px) {
  .stage { width: min(390px,100%); }
  .stage-header { padding-top: 60px; }
  .screen-type { display: none; }
  .stage-content { padding-top: 8px; padding-bottom: 6px; }
  .heading { min-height: 70px; gap: 10px; }
  .heading h1 { font-size: 27px; }
  .heading .g1-char { width: 67px; height: 83px; }
  .question,
  .decompose,
  .rails-model,
  .branch-model,
  .units-row,
  .shift-scene,
  .synthesis,
  .matching,
  .construction,
  .strategy-visual,
  .error-visual,
  .blocks-visual,
  .summary,
  .rules { padding: 14px; border-radius: 18px; }
  .options { grid-template-columns: 1fr; }
  .option { min-height: 52px; }
  .hook-scene { min-height: 275px; padding: 18px 16px 65px; grid-template-columns: 1fr 30px 1fr; gap: 7px; }
  .hook-scene > div:not(.range-hint) { padding: 12px 9px; }
  .hook-scene > div > strong { font-size: 30px; }
  .hook-scene > .g1-char { width: 69px; height: 88px; right: 12px; top: 10px; }
  .range-hint { left: 13px; right: 13px; bottom: 14px; gap: 6px !important; }
  .range-hint b { font-size: 10px; }
  .rails-illustration-wrap,
  .control-panel-wrap { position: relative; grid-template-columns: 1fr; padding-top: 22px; }
  .rails-model { gap: 10px; }
  .rails-coach,
  .console-coach { position: absolute; top: -23px; right: 1px; width: 58px; z-index: 2; }
  .parallel-rails-svg,
  .shift-console-svg,
  .zero-placeholder-svg { width: 100%; }
  .console-key { gap: 5px; }
  .console-key > span { min-height: 36px; }
  .links,
  .three-rails,
  .branch-model > div { gap: 6px; }
  .links span,
  .three-rails > div,
  .branch-model > div > b { padding: 8px 5px; font-size: 11px; }
  .three-rails > div { min-height: 60px; }
  .units-row { grid-template-columns: 115px 34px 1fr; gap: 7px; }
  .mini-calc { padding: 8px 10px; font-size: 18px; }
  .carry-arc { font-size: 30px; }
  .units-row > b { padding: 9px 6px; font-size: 11px; }
  .row-shift { grid-template-columns: 78px 1fr 30px; gap: 6px; }
  .row-rail { min-height: 55px; padding: 8px; grid-template-columns: 1fr 20px 1fr; font-size: 15px; }
  .synthesis,
  .summary { grid-template-columns: 1fr; }
  .finale-layout { gap: 8px; }
  .finale-heading { padding: 10px 12px; }
  .finale-heading .heading { min-height: 0; }
  .finale-heading .heading h1 { font-size: 21px; }
  .finale-heading > p { font-size: 9px; }
  .finale-main-grid { grid-template-columns: 1fr; gap: 8px; }
  .finale-payoff-card, .finale-mastery-card { padding: 10px; }
  .finale-payoff-card .summary { grid-template-columns: minmax(0,1fr) 132px; }
  .finale-payoff-card .row-rail { min-height: 39px; font-size: 12px; }
  .finale-payoff-card .aligned-rows { width: 132px; font-size: 12px; }
  .finale-mastery-card .rules { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 5px; }
  .finale-mastery-card .rules > div { min-height: 44px; padding: 5px; }
  .finale-reward { min-height: 108px; padding: 8px 10px; grid-template-columns: 58px 72px minmax(0,1fr); gap: 7px; }
  .finale-medal i { width: 54px; height: 54px; font-size: 23px; }
  .finale-bit { height: 88px; }
  .finale-reward-copy > span { font-size: 7px; }
  .finale-reward-copy > strong { font-size: 14px; }
  .finale-reward-copy > small { font-size: 8px; }
  .raw-shifts .row-shift { grid-template-columns: 27px 1fr 27px; }
  .aligned-rows { width: 184px; font-size: 17px; }
  .matching { min-height: 240px; grid-template-columns: 1fr 24px 1fr; gap: 6px; }
  .matching button { min-height: 58px; padding: 8px; font-size: 11px; }
  .slots { grid-template-columns: repeat(3,minmax(0,1fr)); gap: 5px; }
  .slots button { min-height: 65px; }
  .input-row { flex-direction: column; }
  .strategy-visual,
  .blocks-visual { min-height: 105px; flex-wrap: wrap; gap: 8px; }
  .strategy-visual span,
  .strategy-visual b,
  .blocks-visual span,
  .blocks-visual b { padding: 10px; font-size: 15px; }
  .error-visual { min-height: 130px; grid-template-columns: 1fr; gap: 4px; }
  .rules { grid-template-columns: 1fr; }
  .rules > div { min-height: 54px; grid-template-columns: 30px 1fr; justify-items: start; text-align: left; }
  .stage-nav { min-height: 68px; }
  .btn { min-width: 110px; min-height: 48px; padding: 0 13px; }
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root *,
  .lesson-root *::before,
  .lesson-root *::after { scroll-behavior: auto !important; animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
  .row-shift.active .raw-row { opacity: 0 !important; transform: none !important; }
  .row-shift.active .row-rail strong,
  .links.reveal,
  .three-rails.reveal,
  .branch-model .reveal,
  .range-result.reveal,
  .aligned-rows .show { opacity: 1 !important; transform: none !important; }
  .parallel-rails-svg.is-live .rail-cart-0,
  .console-lane-0.is-active .console-cart { opacity: 1 !important; transform: none !important; }
  .parallel-rails-svg.is-live .rail-cart-1 { opacity: 1 !important; transform: translateX(-78px) !important; }
  .parallel-rails-svg.is-live .rail-cart-2 { opacity: 1 !important; transform: translateX(-156px) !important; }
  .console-lane-1.is-active .console-cart { opacity: 1 !important; transform: translateX(-52px) !important; }
  .console-lane-2.is-active .console-cart { opacity: 1 !important; transform: translateX(-104px) !important; }
  .console-lane.is-active .console-terminal-text,
  .parallel-rails-svg.is-live .rail-signal,
  .zero-placeholder-svg.is-solved .placeholder-row { opacity: 1 !important; transform: none !important; }
  .finale-reward { opacity: 1 !important; transform: none !important; }
}
`;
