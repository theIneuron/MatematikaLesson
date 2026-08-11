import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

const selectLocale = (lang, values) => values[lang] ?? values.uz;

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
  const titleLabel = selectLocale(lang, { uz: 'Unvon', ru: 'Звание', en: 'Title' });
  return createPortal(<div className="g4-title-reveal-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={`${titleLabel}: ${title}`}><div className="g4-title-reveal-card"><div className="g4-title-reveal-rays" aria-hidden="true" /><div className="g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }} />)}</div><div className="g4-title-reveal-medal" aria-hidden="true">★</div><h2>{title}</h2></div></div>, document.body);
}

function G4TitleCard({ title, lang, firstTry, totalScored }) {
  const kicker = selectLocale(lang, { uz: 'UNVON OLINDI', ru: 'ЗВАНИЕ ПОЛУЧЕНО', en: 'TITLE EARNED' });
  const scoreLabel = selectLocale(lang, { uz: 'birinchi urinishda', ru: 'с первой попытки', en: 'on the first attempt' });
  return <div className="g4-title-card-stage" role="status" aria-live="polite" aria-atomic="true"><div className="g4-title-card-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div><div className="g4-title-card-bit"><BitSVG state="happy" /></div><div className="g4-title-card-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{kicker}</span><h2>{title}</h2><div className="g4-title-card-score"><strong>{firstTry}/{totalScored}</strong><span>{scoreLabel}</span></div></div>;
}

// 4-SINF · 9-DARS · Ko'p xonali sonni bir xonali songa ko'paytirish
// Dars01 vizual/audio kontrakti asosida. 15 ekran, ichki majburiy o'tishlar yo'q.

const T = {
  bg: '#F5F5F0',
  ink: '#12212C',
  ink2: '#50616D',
  ink3: '#87949D',
  paper: '#FFFFFF',
  accent: '#FF5B35',
  accentSoft: '#FFF0EA',
  cyan: '#168FA3',
  cyanSoft: '#E5F5F6',
  navy: '#173B52',
  lime: '#95C93D',
  success: '#227A53',
  successSoft: '#E7F3EC',
  warn: '#A96F13',
  warnSoft: '#FFF5D9',
  shadowBase: '58, 53, 48',
};

const TOTAL_SCREENS = 15;
const MOBILE_DESIGN_W = 390;

const LESSON_META = {
  lessonId: 'num-4-09-v1',
  slug: 'dars09-kop-xonali-sonni-bir-xonali-songa-kopaytirish',
  lessonTitle: {
    uz: "9-dars. Ko'p xonali sonni bir xonali songa ko'paytirish",
    ru: 'Урок 9. Умножение многозначного числа на однозначное',
    en: "Lesson 9: Multiplying a multi-digit number by a single-digit number",
  },
  skillTags: ['equal_groups', 'place_value', 'column_multiplication', 'carry', 'internal_zero', 'estimation'],
};

const SOURCE_ORDER = [0, 1, 9, 3, 8, 2, 10, 6, 11, 4, 12, 7, 13, 5, 14];
const SCREEN_META = [
  { id: 's0', sourceId: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', sourceId: 's1', type: 'exploration', template: 'OptionalPrediction', scored: false, scope: null },
  { id: 's2', sourceId: 's9', type: 'practice', template: 'Construction', scored: true, scope: 'module-mikro' },
  { id: 's3', sourceId: 's3', type: 'exploration', template: 'MultiplierPlacement', scored: false, scope: null },
  { id: 's4', sourceId: 's8', type: 'practice', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's5', sourceId: 's2', type: 'exploration', template: 'PartialProducts', scored: false, scope: null },
  { id: 's6', sourceId: 's10', type: 'practice', template: 'DigitGrid', scored: true, scope: 'module-mikro' },
  { id: 's7', sourceId: 's6', type: 'exploration', template: 'InternalZero', scored: false, scope: null },
  { id: 's8', sourceId: 's11', type: 'practice', template: 'ErrorRepair', scored: true, scope: 'module-mikro' },
  { id: 's9', sourceId: 's4', type: 'exploration', template: 'EstimateModel', scored: false, scope: null },
  { id: 's10', sourceId: 's12', type: 'practice', template: 'Matching', scored: true, scope: 'module-mikro' },
  { id: 's11', sourceId: 's7', type: 'exploration', template: 'LifeModel', scored: false, scope: null },
  { id: 's12', sourceId: 's13', type: 'case', template: 'NumInputScreen', scored: true, scope: 'final' },
  { id: 's13', sourceId: 's5', type: 'exploration', template: 'CarryConsolidation', scored: false, scope: null },
  { id: 's14', sourceId: 's14', type: 'summary', template: 'SummaryScreen', scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: 'Teng guruhlar', ru: 'Равные группы', en: "Equal groups" },
    title: { uz: 'Natija kattaligi mosmi?', ru: 'Подходит ли величина ответа?', en: 'Is the answer a reasonable size?' },
    question: {
      uz: "Har qutida 2 408 ta detal. 3 ta qutida 6 024 ta detal bo'ladimi?",
      ru: 'В каждой коробке 2 408 деталей. В трёх коробках будет 6 024 детали?',
      en: 'Each box has 2,408 parts. Would three boxes contain 6,024 parts?',
    },
    options: [
      { uz: 'Ha, natija mos.', ru: 'Да, ответ подходит.', en: 'Yes, the answer is reasonable.' },
      { uz: "Yo'q, natija juda kichik.", ru: 'Нет, ответ слишком мал.', en: "No, the answer is too small." },
    ],
    wrong: [
      { uz: "Bitta qutida 2 408 ta detal bor; uchta quti uchun 6 024 juda kichik.", ru: 'В одной коробке 2 408 деталей; для трёх коробок 6 024 слишком мало.', en: "There are 2,408 parts in one box; 6,024 is too few for three boxes." },
      { uz: "Taxmin to'g'ri yo'nalishda: uchta guruh 7 200 atrofida bo'ladi.", ru: 'Оценка верна: три группы дают около 7 200.', en: "The estimate is correct: the three groups give about 7,200." },
    ],
    audio: {
      uz: [
        'Zaynab uchta bir xil qutini sanadi.',
        "Har bir qutida ikki ming to'rt yuz sakkizta detal bor.",
        "U jami olti ming yigirma to'rtta detal chiqdi dedi.",
        'Sizningcha, bu natija uchta guruhga mos keladimi?',
      ],
      ru: [
        'Зайнаб посчитала три одинаковые коробки.',
        'В каждой коробке две тысячи четыреста восемь деталей.',
        'Она получила шесть тысяч двадцать четыре детали.',
        'Как ты думаешь, подходит ли такой ответ для трёх групп?',
      ],
      en: [
        "Zaynab counted three identical boxes.",
        "Each box contains two thousand four hundred and eight parts.",
        "She got six thousand and twenty-four parts.",
        "Do you think that answer is reasonable for three groups?",
      ],
    },
  },
  s1: {
    eyebrow: { uz: 'Xona qiymatini eslaymiz', ru: 'Вспоминаем разряды', en: 'Revisiting place values' },
    title: { uz: "Sonni xona qo'shiluvchilariga ajrating", ru: 'Разложи число на разрядные слагаемые', en: 'Partition the number by place value' },
    question: { uz: "2 408 sonining yoyiq yozuvini tanlang.", ru: 'Выбери разложение числа 2 408.', en: 'Choose the expanded form of 2 408.' },
    options: [
      { uz: '2 000 + 400 + 0 + 8', ru: '2 000 + 400 + 0 + 8' , en: "2 000 + 400 + 0 + 8"},
      { uz: '2 000 + 40 + 8', ru: '2 000 + 40 + 8' , en: "2 000 + 40 + 8"},
      { uz: '200 + 400 + 8', ru: '200 + 400 + 8' , en: "200 + 400 + 8"},
    ],
    closedSet: true,
    wrong: [
      { uz: "To'g'ri yoyiq yozuv.", ru: 'Верное разложение.' , en: 'Correct.'},
      { uz: '4 yuzlar xonasida turib, 400 ni bildiradi.', ru: 'Цифра 4 стоит в сотнях и означает 400.', en: 'The digit 4 is in the hundreds place, so it represents 400.' },
      { uz: 'Chapdagi 2 minglar xonasida turib, 2 000 ni bildiradi.', ru: 'Цифра 2 слева стоит в тысячах и означает 2 000.', en: 'The digit 2 on the left is in the thousands place, so it represents 2 000.' },
    ],
    audio: {
      uz: [
        "Ko'paytirishdan oldin sonning xona qiymatlarini ko'ramiz.",
        "Ikki ming to'rt yuz sakkizda ikki minglik, to'rt yuzlik, nol o'nlik va sakkiz birlik bor.",
      ],
      ru: [
        'Перед умножением рассмотрим разрядные значения числа.',
        'В числе две тысячи четыреста восемь есть две тысячи, четыре сотни, ноль десятков и восемь единиц.',
      ],
      en: [
        "Before multiplying, examine the place values in the number.",
        "Two thousand four hundred and eight has two thousands, four hundreds, zero tens and eight ones.",
      ],
    },
  },
  s2: {
    eyebrow: { uz: 'Yoyiq model', ru: 'Развёрнутая модель', en: 'Expanded model' },
    title: { uz: 'Har bir xona miqdorini uch marta olamiz', ru: 'Берём значение каждого разряда три раза', en: 'Take each place value three times' },
    lead: { uz: '2 408 × 3', ru: '2 408 × 3' , en: "2 408 × 3"},
    audio: {
      uz: [
        "Ikki mingni uch marta olsak, olti ming bo'ladi.",
        "To'rt yuzni uch marta olsak, bir ming ikki yuz bo'ladi.",
        "Nol o'nlik nol bo'lib qoladi.",
        "Sakkiz birlikni uch marta olsak, yigirma to'rt bo'ladi.",
        "Barcha qismlarning yig'indisi yetti ming ikki yuz yigirma to'rt.",
      ],
      ru: [
        'Две тысячи, взятые три раза, дают шесть тысяч.',
        'Четыре сотни, взятые три раза, дают одну тысячу двести.',
        'Ноль десятков остаётся нулём.',
        'Восемь единиц, взятые три раза, дают двадцать четыре.',
        'Сумма всех частей равна семи тысячам двумстам двадцати четырём.',
      ],
      en: [
        "Two thousand taken three times gives six thousand.",
        "Four hundreds taken three times make one thousand two hundred.",
        "Zero tens remain zero.",
        "Eight ones taken three times make twenty-four.",
        "The sum of all parts is seven thousand two hundred and twenty-four.",
      ],
    },
  },
  s3: {
    eyebrow: { uz: 'Ustun yozuvi', ru: 'Запись столбиком', en: 'Column method' },
    title: { uz: "Ko'paytiruvchini qayerga yozamiz?", ru: 'Куда записать множитель?', en: 'Where should the multiplier be written?' },
    question: { uz: '3 ni ustunda qayerga yozamiz?', ru: 'Где записать 3 в столбике?', en: 'Where should 3 be written in the column method?' },
    options: [
      { uz: 'Minglar ostiga', ru: 'Под тысячами', en: 'Under the thousands' },
      { uz: 'Yuzlar ostiga', ru: 'Под сотнями', en: "Under the hundreds" },
      { uz: 'Birlar ostiga', ru: 'Под единицами', en: 'Under the ones' },
    ],
    closedSet: true,
    wrong: [
      { uz: "Ko'paytiruvchini birlar ostiga yozing.", ru: 'Запиши множитель под единицами.', en: 'Write the multiplier under the ones.' },
      { uz: "Ko'paytiruvchi butun sonni necha marta olishni bildiradi.", ru: 'Множитель показывает, сколько раз берут всё число.', en: 'The multiplier shows how many groups of the whole number there are.' },
      { uz: "To'g'ri joylashuv.", ru: 'Верное расположение.', en: 'Correct.' },
    ],
    audio: {
      uz: [
        "Bir xonali ko'paytiruvchi birliklar ustuniga yoziladi.",
        "Hisob o'ngdagi birlar xonasidan boshlanadi.",
        "Shunda har bir natija o'z xona ustunida qoladi.",
      ],
      ru: [
        'Однозначный множитель записывают под единицами.',
        'Вычисление начинается с правого разряда единиц.',
        'Тогда каждая цифра результата остаётся в своём столбце.',
      ],
      en: [
        "Write the single-digit multiplier under the ones.",
        "Start the calculation from the ones place on the right.",
        "Then each digit in the result stays in the correct place-value column.",
      ],
    },
  },
  s4: {
    eyebrow: { uz: 'Taxmin', ru: 'Оценка', en: 'Estimate' },
    title: { uz: 'Aniq javobning kattaligini oldindan tekshiring', ru: 'Заранее проверь величину точного ответа', en: 'Estimate the size of the exact answer first' },
    lead: { uz: '3 746 × 4 ≈ 15 000', ru: '3 746 × 4 ≈ 15 000' , en: "3 746 × 4 ≈ 15 000"},
    audio: {
      uz: [
        "Uch ming yetti yuz qirq olti soni uch ming yetti yuzga yaqin.",
        "Uch ming yetti yuzni to'rtga ko'paytirsak, o'n to'rt ming sakkiz yuz bo'ladi.",
        "Demak, aniq javob taxminan o'n besh ming bo'lishi kerak.",
      ],
      ru: [
        'Число три тысячи семьсот сорок шесть близко к трём тысячам семистам.',
        'Три тысячи семьсот, взятые четыре раза, дают четырнадцать тысяч восемьсот.',
        'Значит, точный ответ должен быть примерно равен пятнадцати тысячам.',
      ],
      en: [
        "Three thousand seven hundred and forty-six is close to three thousand seven hundred.",
        "Three thousand seven hundred taken four times makes fourteen thousand eight hundred.",
        "So the exact answer should be about fifteen thousand.",
      ],
    },
  },
  s5: {
    eyebrow: { uz: "Ko'chirishning ma'nosi", ru: 'Смысл переноса', en: 'Regrouping' },
    title: { uz: "24 birlikni qanday almashtiramiz?", ru: 'Как разменять 24 единицы?', en: 'How can 24 ones be regrouped?' },
    question: { uz: '124 × 6 da 24 birlik nimaga teng?', ru: 'Чему равны 24 единицы в примере 124 × 6?', en: 'How can the 24 ones in 124 × 6 be regrouped?' },
    options: [
      { uz: "2 o'nlik va 4 birlik", ru: '2 десятка и 4 единицы', en: '2 tens and 4 ones' },
      { uz: "24 o'nlik", ru: '24 десятка', en: '24 tens' },
      { uz: "4 o'nlik va 2 birlik", ru: '4 десятка и 2 единицы', en: '4 tens and 2 ones' },
    ],
    closedSet: true,
    wrong: [
      { uz: "To'g'ri. 24 birlik 2 o'nlik va 4 birlik.", ru: 'Верно. Двадцать четыре единицы равны двум десяткам и четырём единицам.', en: 'Correct. Twenty-four ones equal two tens and four ones.' },
      { uz: "20 birlikni 2 o'nlikka almashtiring.", ru: 'Замени двадцать единиц двумя десятками.', en: 'Regroup twenty ones as two tens.' },
      { uz: "24 sonidagi raqamlarning o'rnini almashtirmang.", ru: 'Не меняй цифры в числе двадцать четыре местами.', en: 'Do not swap the digits in twenty-four.' },
    ],
    audio: {
      uz: [
        "Ko'chirilgan raqam o'zidan paydo bo'lmaydi.",
        "Olti guruhdagi to'rt birlik yigirma to'rt birlik bo'ladi.",
        "Yigirma birlik ikki o'nlikka aylanadi, to'rt birlik esa o'z xonasida qoladi.",
        "Olti guruhdagi ikki o'nlik o'n ikki o'nlik bo'ladi.",
        "Ko'chgan ikki o'nlik bilan jami o'n to'rt o'nlik hosil bo'ladi.",
        "To'rt o'nlikni yozib, bir yuzlikni ko'chiramiz.",
        "Olti yuzlikka ko'chgan bir yuzlik qo'shilsa, yetti yuzlik bo'ladi.",
      ],
      ru: [
        'Переносимая цифра не появляется сама по себе.',
        'Четыре единицы в шести группах дают двадцать четыре единицы.',
        'Двадцать единиц превращаются в два десятка, а четыре единицы остаются на месте.',
        'Два десятка в шести группах дают двенадцать десятков.',
        'С двумя перенесёнными десятками получается четырнадцать десятков.',
        'Записываем четыре десятка и переносим одну сотню.',
        'Шесть сотен и одна перенесённая сотня дают семь сотен.',
      ],
      en: [
        "A carried digit does not appear by itself.",
        "Four ones in six groups make twenty-four ones.",
        "Regroup twenty ones as two tens, leaving four ones.",
        "Two tens in six groups make twelve tens.",
        "Add the two carried tens to make fourteen tens.",
        "Write four tens and carry one hundred.",
        "Six hundreds plus the carried hundred make seven hundreds.",
      ],
    },
  },
  s6: {
    eyebrow: { uz: 'Ichki nol', ru: 'Внутренний ноль', en: 'Internal zero' },
    title: { uz: "Nol turgan xona yo'qolmaydi", ru: 'Разряд с нулём не исчезает', en: 'A place containing zero does not disappear' },
    question: { uz: '4 052 × 6 da 0 × 6 + 3 nechaga teng?', ru: 'Чему равно 0 × 6 + 3 в примере 4 052 × 6?', en: "What is 0 × 6 + 3 in the example of 4,052 × 6?" },
    options: [{ uz: '0', ru: '0' , en: "0"}, { uz: '3', ru: '3' , en: "3"}, { uz: '6', ru: '6' , en: "6"}],
    closedSet: true,
    wrong: [
      { uz: "Ko'chgan 3 ni ham qo'shing.", ru: 'Прибавь перенос три.', en: 'Add the carried 3.' },
      { uz: "To'g'ri. Nol xonasi ko'chgan 3 ni saqlaydi.", ru: 'Верно. Разряд с нулём сохраняет перенос три.', en: 'Correct. The zero place still receives the carried 3.' },
      { uz: "Nolni olti marta olish oltini bermaydi.", ru: 'Ноль, взятый шесть раз, не даёт шесть.', en: 'Taking zero six times gives zero, not six.' },
    ],
    audio: {
      uz: [
        "Nol turgan xona yo'qolmaydi.",
        "Nolni olti marta olsak, nol bo'ladi.",
        "Lekin oldingi xonadan ko'chgan uch yuzlik shu xonaga qo'shiladi.",
        "Shuning uchun bu ustunda uch yoziladi.",
      ],
      ru: [
        'Разряд с нулём не исчезает.',
        'Ноль, взятый шесть раз, остаётся нулём.',
        'Но три сотни из предыдущего переноса прибавляются в этом разряде.',
        'Поэтому в этом столбце записывается три.',
      ],
      en: [
        "A place containing zero does not disappear.",
        "A zero taken six times remains zero.",
        "But add the three hundreds carried from the previous place.",
        "So write three in this column.",
      ],
    },
  },
  s7: {
    eyebrow: { uz: 'Hayotiy model', ru: 'Модель задачи' , en: 'Problem model'},
    title: { uz: "Teng qutilar soni ko'paytirishni bildiradi", ru: 'Одинаковые коробки задают умножение', en: 'Equal boxes represent multiplication' },
    question: { uz: '4 ta qutining har birida 1 250 ta detal. Qaysi amal kerak?', ru: 'В каждой из 4 коробок по 1 250 деталей. Какое действие нужно?', en: 'Each of the 4 boxes has 1 250 parts. Which operation is needed?' },
    options: [
      { uz: '1 250 × 4', ru: '1 250 × 4' , en: "1 250 × 4"},
      { uz: '1 250 + 4', ru: '1 250 + 4' , en: "1 250 + 4"},
      { uz: '1 250 − 4', ru: '1 250 − 4' , en: "1 250 − 4"},
    ],
    closedSet: true,
    wrong: [
      { uz: "To'g'ri. 1 250 soni to'rt marta olinadi.", ru: 'Верно. Число 1 250 берётся четыре раза.', en: 'Correct. Take 1 250 four times.' },
      { uz: "To'rtta teng guruh uchun ko'paytirish kerak.", ru: 'Для четырёх равных групп нужно умножение.', en: "For four equal groups, multiplication is required." },
      { uz: "Qutilardagi detallar birlashtiriladi, ayirilmaydi.", ru: 'Детали из коробок объединяют, а не вычитают.', en: 'The parts in the boxes are combined, not subtracted.' },
    ],
    audio: {
      uz: [
        "To'rtta qutining har birida bir ming ikki yuz ellikta detal bor.",
        "Bir qutidagi miqdorni qutilar soniga ko'paytiramiz.",
        "Bir ming ikki yuz ellikni to'rtga ko'paytirib, besh ming detal olamiz.",
      ],
      ru: [
        'В каждой из четырёх коробок по одной тысяче двести пятьдесят деталей.',
        'Количество в одной коробке умножаем на число коробок.',
        'Одна тысяча двести пятьдесят, взятая четыре раза, даёт пять тысяч деталей.',
      ],
      en: [
        "Each of the four boxes contains one thousand two hundred and fifty parts.",
        "Multiply the number of parts in one box by the number of boxes.",
        "One thousand two hundred and fifty taken four times makes five thousand parts.",
      ],
    },
  },
  s8: {
    eyebrow: { uz: "Ko'paytiruvchini joylash", ru: 'Размещение множителя', en: "Multiplier placement" },
    title: { uz: "Bir xonali ko'paytiruvchi qayerda turadi?", ru: 'Где записывают однозначный множитель?', en: "Where do you record a single-digit multiplier?" },
    question: { uz: "4 206 × 3 ni ustunda yozganda 3 qaysi raqam ostida turadi?", ru: 'Под какой цифрой записать 3 в столбике для 4 206 × 3?', en: 'Under which digit should 3 be written for 4 206 × 3?' },
    options: [
      { uz: '6 ostida', ru: 'Под цифрой 6', en: 'Under the digit 6' },
      { uz: '2 ostida', ru: 'Под цифрой 2', en: 'Under the digit 2' },
      { uz: '4 ostida', ru: 'Под цифрой 4', en: 'Under the digit 4' },
    ],
    closedSet: true,
    wrong: [
      { uz: "To'g'ri. 6 birlar xonasida turadi.", ru: 'Верно. Цифра 6 стоит в разряде единиц.', en: 'Correct. The digit 6 is in the ones place.' },
      { uz: "2 yuzlar xonasida turadi; ko'paytiruvchi birlar ostiga yoziladi.", ru: 'Цифра 2 стоит в сотнях; множитель записывают под единицами.', en: 'The digit 2 is in the hundreds place; write the multiplier under the ones.' },
      { uz: "4 minglar xonasida turadi; ko'paytiruvchi birlar ostiga yoziladi.", ru: 'Цифра 4 стоит в тысячах; множитель записывают под единицами.', en: 'The digit 4 is in the thousands place; write the multiplier under the ones.' },
    ],
    audio: {
      uz: [
        "Bir xonali ko'paytiruvchi birlar ustuniga yoziladi.",
        "To'rt ming ikki yuz olti sonida olti raqami birlar xonasida turadi.",
        "Shuning uchun uch raqamini olti raqami ostiga yozing.",
      ],
      ru: [
        'Однозначный множитель записывают в столбце единиц.',
        'В числе четыре тысячи двести шесть цифра шесть стоит в разряде единиц.',
        'Поэтому запиши цифру три под цифрой шесть.',
      ],
      en: [
        "Write a single-digit multiplier in the ones column.",
        "In four thousand two hundred and six, the digit six is in the ones place.",
        "Therefore, write the digit three under the digit six.",
      ],
    },
  },
  s9: {
    eyebrow: { uz: 'Xona modeli', ru: 'Разрядная модель', en: 'Place-value model' },
    title: { uz: "Sonning yoyiq qismlarini joylashtiring", ru: 'Расположи части разложения числа', en: 'Arrange the parts of the expanded number' },
    question: { uz: "2 306 sonidagi har bir raqam qiymatini o'z xonasiga qo'ying.", ru: 'Поставь значение каждой цифры числа 2 306 в её разряд.', en: "Put the value of each digit of the number 2,306 in its place." },
    audio: {
      uz: ["Ikki ming uch yuz olti sonida ikki minglik, uch yuzlik, nol o'nlik va olti birlik bor.", "Ikki ming, uch yuz, nol va olti kartalarini mos xonalarga joylashtiring."],
      ru: ['В числе две тысячи триста шесть есть две тысячи, три сотни, ноль десятков и шесть единиц.', 'Размести карточки две тысячи, триста, ноль и шесть по подходящим разрядам.'],
      en: ["Two thousand three hundred and six has two thousands, three hundreds, zero tens and six ones.", "Place the cards for two thousand, three hundred, zero and six in the correct places."],
    },
  },
  s10: {
    eyebrow: { uz: 'Oraliq natija', ru: 'Промежуточный результат', en: 'Partial product' },
    title: { uz: "Bitta xona qiymatini ko'paytiring", ru: 'Умножь значение одного разряда', en: 'Multiply one place value' },
    question: { uz: '800 × 3 = ?', ru: '800 × 3 = ?' , en: "800 × 3 = ?"},
    audio: {
      uz: ["Sakkiz yuzlikni uch marta olamiz.", "Sakkizni uchga ko'paytirib, yigirma to'rt olamiz.", "Yigirma to'rt yuzlik ikki ming to'rt yuzga teng. Natijani kiriting."],
      ru: ['Берём восемь сотен три раза.', 'Восемь, взятое три раза, даёт двадцать четыре.', 'Двадцать четыре сотни равны двум тысячам четырёмстам. Введи результат.'],
      en: ["Take eight hundreds three times.", "Eight taken three times makes twenty-four.", "Twenty-four hundreds equal two thousand four hundred. Enter the result."],
    },
  },
  s11: {
    eyebrow: { uz: 'Xatoni tuzatish', ru: 'Исправление ошибки', en: 'Correcting an error' },
    title: { uz: "Yo'qolgan nol xonasini tiklang", ru: 'Восстанови разряд с нулём', en: 'Restore the missing zero place' },
    question: { uz: "Jasurning yechimi: 3 017 × 5 = 15 □ 85", ru: 'Решение Жасура: 3 017 × 5 = 15 □ 85', en: "Jasur's solution: 3 017 × 5 = 15 □ 85" },
    audio: {
      uz: [
        "Jasur ichki nol xonasini tashlab yubordi va son qisqarib qoldi.",
        "Bo'sh yuzlar xonasiga mos raqamni qo'ying.",
      ],
      ru: [
        'Жасур пропустил внутренний нулевой разряд, и число стало короче.',
        'Поставь подходящую цифру в пустой разряд сотен.',
      ],
      en: [
        "Jasur omitted the internal zero place, so the number became shorter.",
        "Put the correct digit in the empty hundreds place.",
      ],
    },
  },
  s12: {
    eyebrow: { uz: 'Taxmin bilan tekshirish', ru: 'Проверка оценкой', en: 'Checking with an estimate' },
    title: { uz: 'Aniq natijani taxmin bilan juftlang', ru: 'Соедини точный ответ с оценкой', en: 'Match each exact answer to an estimate' },
    question: { uz: "Har aniq natijani eng yaqin taxmin bilan juftlang.", ru: 'Соедини каждый точный ответ с ближайшей оценкой.', en: 'Match each exact answer to the nearest estimate.' },
    audio: {
      uz: ["Taxmin oxirgi raqamlarni emas, natijaning umumiy kattaligini tekshiradi.", "Ikki ming to'rt yuz sakkizni uchga, olti ming bir yuz o'nni to'rtga va bir ming to'qqiz yuz to'qson beshni beshga ko'paytirish natijalarini yetti ming ikki yuz, yigirma to'rt ming va o'n mingga yaqin taxminlar bilan juftlang."],
      ru: ['Оценка проверяет не последние цифры, а общую величину ответа.', 'Соедини точные результаты умножения двух тысяч четырёхсот восьми на три, шести тысяч ста десяти на четыре и одной тысячи девятисот девяноста пяти на пять с оценками около семи тысяч двухсот, двадцати четырёх тысяч и десяти тысяч.'],
      en: ["An estimate checks the overall size of the answer, not its final digits.", "Match products for two thousand four hundred eight times three, six thousand one hundred ten times four, and one thousand nine hundred ninety-five times five to their estimates."],
    },
  },
  s13: {
    eyebrow: { uz: 'Ombor vazifasi', ru: 'Задача про склад', en: 'Warehouse problem' },
    title: { uz: 'Oltita bir xil quti', ru: 'Шесть одинаковых коробок', en: "Six identical boxes" },
    question: { uz: '6 ta quti. Har birida 2 375 ta detal. Jami nechta detal?', ru: '6 коробок. В каждой 2 375 деталей. Сколько всего деталей?', en: 'There are 6 boxes with 2,375 parts in each. How many parts are there altogether?' },
    audio: {
      uz: [
        "Bekzod ombordagi oltita bir xil qutini sanayapti.",
        "Har qutidagi ikki ming uch yuz yetmish beshta detal olti marta olinadi.",
        "Javob taxminan o'n to'rt ming to'rt yuz atrofida bo'lishi kerak.",
      ],
      ru: [
        'Бекзод считает шесть одинаковых коробок на складе.',
        'Количество две тысячи триста семьдесят пять берётся шесть раз.',
        'Ответ должен быть около четырнадцати тысяч четырёхсот.',
      ],
      en: [
        "Bekzod is counting six identical boxes in the warehouse.",
        "There are six groups of two thousand three hundred and seventy-five parts.",
        "The answer should be about fourteen thousand four hundred.",
      ],
    },
  },
  s14: {
    eyebrow: { uz: "Yakuniy missiya", ru: 'Финальная миссия', en: "Final mission" },
    title: { uz: "Bir xonali songa ko'paytirish", ru: 'Умножение на однозначное число', en: 'Multiplying by a single-digit number' },
    audio: {
      uz: [
        "Ko'p xonali sonni bir xonali songa ko'paytirishda har bir xona miqdori ko'paytiriladi.",
        "O'nta kichik xona birligi bitta katta xona birligiga almashtiriladi.",
        "Ichki nol o'z xonasini va unga kelgan ko'chirilgan qiymatni saqlaydi.",
        "Taxmin natijaning kattaligini tekshiradi.",
      ],
      ru: [
        'При умножении многозначного числа на однозначное умножается значение каждого разряда.',
        'Десять меньших разрядных единиц заменяются одной большей.',
        'Внутренний ноль сохраняет свой разряд и пришедший перенос.',
        'Оценка проверяет величину результата.',
      ],
      en: [
        "Multiply each place value in the multi-digit number by the single-digit multiplier.",
        "Regroup ten units of one place as one unit of the next place.",
        "An internal zero keeps its place and receives the carried value.",
        "An estimate checks the size of the result.",
      ],
    },
  },
};

let runtimeConfig = {
  ttsApiBase: '',
  correctSoundUrl: '',
  wrongSoundUrl: '',
  voiceGender: 'f',
  previewMode: false,
};

const configureLesson = (next) => {
  runtimeConfig = { ...runtimeConfig, ...next };
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';

const LangContext = createContext('uz');
const useLang = () => useContext(LangContext);

const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value === null || value === undefined) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? '';
  }, [lang]);
};

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return isMobile;
}

function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = document.documentElement;
    const update = () => {
      const zoom = window.innerWidth < breakpoint ? window.innerWidth / MOBILE_DESIGN_W : 1;
      root.style.setProperty('--g4z', String(zoom));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      root.style.removeProperty('--g4z');
    };
  }, [breakpoint]);
}

const buildTtsUrl = (base, text, gender) => {
  const encoded = encodeURIComponent(String(text).slice(0, 1000));
  return `${base}/api/tts?text=${encoded}&g=${gender === 'm' ? 'm' : 'f'}`;
};

class AudioEngine {
  constructor() {
    this.queue = [];
    this.index = 0;
    this.audio = null;
    this.previewUtterance = null;
    this.timer = null;
    this.lang = 'uz';
    this.muted = false;
    this.isPlaying = false;
    this.onStateChange = null;
  }

  emit(extra = {}) {
    this.onStateChange?.({ isPlaying: this.isPlaying, muted: this.muted, ...extra });
  }

  ensureAudio() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.preload = 'auto';
    }
    return this.audio;
  }

  setLang(lang) {
    this.lang = lang;
  }

  loadQueue(segments) {
    this.stop(false);
    this.queue = Array.isArray(segments) ? segments : [];
    this.index = 0;
    this.emit({ completed: false, currentSegment: null, visualOnly: false });
  }

  start() {
    if (!this.queue.length) {
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.playCurrent();
  }

  simulate(segment, duration = null) {
    this.isPlaying = false;
    this.emit({ completed: false, currentSegment: segment.id, visualOnly: true });
    const wait = duration
      ?? Math.max(1150, Math.min(2350, String(segment.text).length * 31));
    this.timer = window.setTimeout(() => {
      this.timer = null;
      this.index += 1;
      this.playCurrent();
    }, wait);
  }

  playPreviewSpeech(segment) {
    const speech = typeof window !== 'undefined' ? window.speechSynthesis : null;
    const Utterance = typeof window !== 'undefined'
      ? (window.SpeechSynthesisUtterance || globalThis.SpeechSynthesisUtterance)
      : null;
    if (!speech || !Utterance) {
      this.simulate(segment);
      return;
    }

    try {
      speech.cancel();
      const utterance = new Utterance(String(segment.text));
      utterance.lang = selectLocale(this.lang, { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' });
      utterance.rate = 0.94;
      utterance.onstart = () => {
        this.isPlaying = true;
        this.emit({ completed: false, currentSegment: segment.id, visualOnly: false });
      };
      utterance.onend = () => {
        this.isPlaying = false;
        this.index += 1;
        this.playCurrent();
      };
      utterance.onerror = () => {
        this.isPlaying = false;
        this.simulate(segment);
      };
      this.previewUtterance = utterance;
      this.timer = window.setTimeout(() => {
        this.timer = null;
        try {
          speech.speak(utterance);
        } catch {
          this.simulate(segment);
        }
      }, 50);
    } catch {
      this.simulate(segment);
    }
  }

  playCurrent() {
    const segment = this.queue[this.index];
    if (!segment) {
      this.isPlaying = false;
      this.emit({ completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase });
      return;
    }

    if (this.muted) {
      this.simulate(segment);
      return;
    }

    if (!runtimeConfig.ttsApiBase) {
      if (runtimeConfig.previewMode) {
        this.playPreviewSpeech(segment);
      } else {
        this.simulate(segment);
      }
      return;
    }

    const audio = this.ensureAudio();
    if (!audio) {
      this.index += 1;
      this.playCurrent();
      return;
    }
    audio.onended = () => {
      this.isPlaying = false;
      this.index += 1;
      this.playCurrent();
    };
    audio.onerror = audio.onended;
    audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, segment.text, runtimeConfig.voiceGender);
    const promise = audio.play();
    if (promise?.then) {
      promise.then(() => {
        this.isPlaying = true;
        this.emit({ completed: false, currentSegment: segment.id, visualOnly: false });
      }).catch(() => {
        this.simulate(segment, 1250);
      });
    }
  }

  pushOneOff(text) {
    if (!text) return;
    this.loadQueue([{ id: `feedback-${Date.now()}`, text }]);
    this.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    this.stop(false);
    this.index = 0;
    this.emit({ muted: this.muted, completed: false });
    this.start();
  }

  stop(emit = true) {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.onended = null;
        this.audio.onerror = null;
      } catch {
        // Audio is optional in preview.
      }
    }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
    }
    if (runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Browser speech is optional in local preview.
      }
    }
    this.previewUtterance = null;
    this.isPlaying = false;
    if (emit) this.emit({ currentSegment: null });
  }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({
    isPlaying: false,
    muted: audioEngineInstance?.muted ?? false,
    completed: false,
    currentSegment: null,
    visualOnly: !runtimeConfig.ttsApiBase,
  });

  /* eslint-disable react-hooks/refs -- stable segment identity prevents audio restart loops */
  const segmentsRef = useRef(segments);
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) {
    segmentsRef.current = segments;
    prevKeyRef.current = segmentsKey;
  }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.onStateChange = (next) => setState((previous) => ({ ...previous, ...next }));
    engine.loadQueue(stableSegments);
    const timer = window.setTimeout(() => engine.start(), 240);
    return () => {
      window.clearTimeout(timer);
      engine.stop(false);
      engine.onStateChange = null;
    };
  }, [stableSegments, lang]);

  return {
    ...state,
    replay: () => {
      const engine = getAudioEngine();
      if (!engine) return;
      engine.loadQueue(stableSegments);
      engine.start();
    },
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

function useNarration(audioValue, screen) {
  const lang = useLang();
  const segments = useMemo(() => {
    const texts = audioValue?.[lang] ?? [];
    return (Array.isArray(texts) ? texts : [texts])
      .filter(Boolean)
      .map((text, index) => ({ id: `s${screen}-beat-${index}`, text }));
  }, [audioValue, lang, screen]);
  const audio = useAudio(segments);
  const activeIndex = segments.findIndex((segment) => segment.id === audio.currentSegment);
  const beat = activeIndex >= 0 ? activeIndex : (audio.completed ? Math.max(0, segments.length - 1) : 0);
  const caption = activeIndex >= 0 ? segments[activeIndex]?.text : '';
  return { ...audio, beat, caption, segmentCount: segments.length };
}

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try {
    const sound = new Audio(url);
    sound.play().catch(() => {});
  } catch {
    // Sound effects are optional.
  }
};

// Dars01 dagi canonical Bit SVG. Geometriya va holatlar o'zgartirilmagan.
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
  const lang = useLang();
  const muteLabel = audio.muted
    ? selectLocale(lang, { uz: 'Ovozni yoqish', ru: 'Включить звук', en: 'Turn sound on' })
    : selectLocale(lang, { uz: "Ovozni o'chirish", ru: 'Выключить звук', en: 'Turn sound off' });
  const replayLabel = selectLocale(lang, { uz: 'Qayta eshitish', ru: 'Повторить', en: 'Replay' });
  return (
    <div className="audio-controls">
      <button
        type="button"
        className="icon-btn"
        onClick={audio.toggleMute}
        aria-label={muteLabel}
        title={muteLabel}
      >
        {audio.muted ? '🔇' : (audio.isPlaying ? '🔊' : '🔉')}
      </button>
      {!audio.muted && (
        <button
          type="button"
          className="icon-btn"
          onClick={audio.replay}
          aria-label={replayLabel}
          title={replayLabel}
        >
          ↻
        </button>
      )}
    </div>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
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
    hook: { uz: 'Missiya', ru: 'Миссия', en: 'Mission' },
    diagnostic: { uz: 'Diagnostika', ru: 'Диагностика', en: 'Diagnostic' },
    exploration: { uz: 'Kashfiyot', ru: 'Исследование', en: 'Exploration' },
    rule: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
    practice: { uz: 'Mashq', ru: 'Практика', en: 'Practice' },
    test: { uz: 'Tekshiruv', ru: 'Проверка', en: 'Check' },
    case: { uz: 'Vazifa', ru: 'Задача', en: 'Problem' },
    summary: { uz: 'Yakun', ru: 'Итог', en: 'Summary' },
  };
  const semanticType = aliases[type] ?? type;
  return <span className="screen-type">{labels[semanticType] ? selectLocale(lang, labels[semanticType]) : type}</span>;
};

const NavBack = ({ onClick, hidden = false }) => {
  const lang = useLang();
  if (hidden) return <span />;
  return (
    <button type="button" className="btn btn-ghost" onClick={onClick}>
      ← {selectLocale(lang, { uz: 'Orqaga', ru: 'Назад', en: 'Back' })}
    </button>
  );
};

const NavNext = ({ onClick, finish = false }) => {
  const lang = useLang();
  return (
    <button type="button" className="btn btn-white-accent" onClick={onClick}>
      {finish
        ? selectLocale(lang, { uz: 'Darsni yakunlash', ru: 'Завершить урок', en: 'Finish lesson' })
        : selectLocale(lang, { uz: 'Davom etish', ru: 'Продолжить', en: 'Continue' })} →
    </button>
  );
};

const FeedbackBlock = ({ visible, correct, children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!visible) {
      const resetFrame = requestAnimationFrame(() => setMounted(false));
      return () => cancelAnimationFrame(resetFrame);
    }
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setMounted(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [visible]);
  if (!visible) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`feedback-block ${correct ? 'feedback-correct' : 'feedback-wrong'} ${mounted ? 'feedback-visible' : ''}`}
    >
      <span aria-hidden="true">{correct ? '✓' : '↻'}</span>
      <p>{children}</p>
    </div>
  );
};

const PageTitle = ({ c, lead, bitState = null }) => {
  const t = useT();
  return (
    <div className={`page-title ${bitState ? 'page-title-bit' : ''}`}>
      <div>
        <span>{t(c.eyebrow)}</span>
        <h1>{t(c.title)}</h1>
        {lead && <p>{typeof lead === 'string' ? lead : t(lead)}</p>}
      </div>
      {bitState && <BitSVG state={bitState} />}
    </div>
  );
};

const MiniCoach = ({ state, cue }) => (
  <div className="math-mini-coach" aria-hidden="true">
    <BitSVG state={state} />
    <span>{cue}</span>
  </div>
);

const PlaceConveyorSVG = ({ beat }) => (
  <svg
    className={`place-conveyor-svg ${beat >= 1 ? 'multiplier-docked' : ''}`}
    viewBox="0 0 600 104"
    aria-hidden="true"
    focusable="false"
  >
    <path className="place-conveyor-track" d="M54 83 H548" />
    {["2", "4", "0", "8"].map((digit, index) => {
      const x = 166 + index * 92;
      return (
        <g className={index === 3 ? 'place-crate unit-crate' : 'place-crate'} key={`${digit}-${index}`}>
          <rect x={x} y="27" width="66" height="48" rx="12" />
          <text x={x + 33} y="58">{digit}</text>
          <text className="place-power" x={x + 33} y="20">{`10${['³', '²', '¹', '⁰'][index]}`}</text>
        </g>
      );
    })}
    <g className="conveyor-multiplier">
      <rect x="54" y="35" width="70" height="38" rx="19" />
      <text x="89" y="60">×3</text>
    </g>
    {[92, 202, 294, 386, 478].map((x) => <circle className="conveyor-wheel" cx={x} cy="85" r="5" key={x} />)}
  </svg>
);

const ZeroCheckpointSVG = ({ beat }) => (
  <svg
    className={`zero-checkpoint-svg ${beat >= 2 ? 'accepts-carry' : ''} ${beat >= 3 ? 'checkpoint-done' : ''}`}
    viewBox="0 0 600 108"
    aria-hidden="true"
    focusable="false"
  >
    <path className="checkpoint-track" d="M48 63 H552" />
    <g className="zero-sensor">
      <rect x="232" y="18" width="136" height="72" rx="18" />
      <text className="zero-sensor-formula" x="300" y="48">0 × 6</text>
      <text className="zero-sensor-result" x="300" y="74">0</text>
    </g>
    <g className="checkpoint-carry">
      <rect x="64" y="28" width="54" height="38" rx="19" />
      <text x="91" y="54">+3</text>
    </g>
    <path className="checkpoint-arrow" d="M385 54 H445 M435 44 L447 54 L435 64" />
    <g className="checkpoint-output">
      <circle cx="503" cy="54" r="27" />
      <text x="503" y="62">3</text>
    </g>
    {[74, 174, 426, 526].map((x) => <circle className="checkpoint-wheel" cx={x} cy="65" r="5" key={x} />)}
  </svg>
);

const Stage = ({ screen, audio, onPrev, onNext, finish = false, children }) => {
  const t = useT();
  const c = CONTENT[`s${SOURCE_ORDER[screen]}`];
  const isMobile = useIsMobile();
  const pad = isMobile ? 14 : 48;

  return (
    <main className={`stage stage-${SCREEN_META[screen].type}`}>
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}>
          <div className="progress-bar" style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }} />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title"><span className="status-dot" /> <span>{t(c.eyebrow)}</span></div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={SCREEN_META[screen].type} />
            {audio && <AudioIndicator audio={audio} />}
            <span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span>
          </div>
        </div>
      </header>
      <section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="stage-happy-bit" aria-label={t({ uz: 'Bit xursand', ru: 'Бит улыбается' , en: "Bit is smiling"})}><BitSVG state="happy" /></div>
        {children}
        {audio?.caption && (audio.muted || audio.visualOnly) && (
          <div className="audio-caption" role="status">{audio.caption}</div>
        )}
      </section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>
        <NavBack onClick={onPrev} hidden={screen === 0} />
        <NavNext onClick={onNext} finish={finish} />
      </footer>
    </main>
  );
};

const OptionGrid = ({ options, picked, correctIndex = null, solved = false, showWrong = false, onPick, disabled = false }) => {
  const t = useT();
  return (
    <div className="options">
      {options.map((option, index) => {
        const isCorrect = solved && index === correctIndex;
        const isWrong = picked === index && (solved || showWrong) && index !== correctIndex;
        return (
          <button
            type="button"
            key={`${index}-${t(option)}`}
            className={`option ${picked === index ? 'option-picked' : ''} ${isCorrect ? 'option-correct' : ''} ${isWrong ? 'option-wrong' : ''}`}
            onClick={() => onPick(index)}
            disabled={disabled}
            aria-pressed={picked === index}
          >
            <b>{String.fromCharCode(65 + index)}</b>
            <span>{t(option)}</span>
          </button>
        );
      })}
    </div>
  );
};

const OptionalPrediction = ({ options, correctIndex, picked, onPick, feedback }) => {
  const t = useT();
  return (
    <div className="optional-content">
      <span className="optional-label">{t({ uz: 'IXTIYORIY TAXMIN', ru: 'НЕОБЯЗАТЕЛЬНАЯ ГИПОТЕЗА' , en: 'OPTIONAL PREDICTION'})}</span>
      <OptionGrid options={options} picked={picked} onPick={onPick} />
      <FeedbackBlock visible={picked !== null} correct={picked === correctIndex}>
        {picked !== null ? t(feedback[picked]) : ''}
      </FeedbackBlock>
    </div>
  );
};

const sanitizeNumeric = (value) => String(value ?? '')
  .replace(/[^0-9]/g, '')
  .replace(/^0+(?=\d)/, '')
  .slice(0, 8);

function Screen0({ screen, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s0;
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(null);

  const pick = (index) => {
    setPicked(index);
    onAnswer({
      stage: 'hook',
      screenIdx: screen,
      question: t(c.question),
      options: c.options.map((option) => t(option)),
      correctIndex: 1,
      correctAnswer: t(c.options[1]),
      studentAnswerIndex: index,
      studentAnswer: t(c.options[index]),
      correct: index === 1,
      firstTry: index === 1,
      attempts: 1,
      solved: true,
    });
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="hook-scene">
          <div className="hook-copy">
            <span>{t({ uz: 'ZAYNABNING HISOBI', ru: 'РАСЧЁТ ЗАЙНАБ', en: "ZAYNAB'S CALCULATION" })}</span>
            <strong>3 × 2 408</strong>
            <p>{t(c.question)}</p>
          </div>
          <div className={`box-groups beat-${audio.beat}`} aria-hidden="true">
            {[0, 1, 2].map((box) => (
              <div className="detail-box" key={box} style={{ '--box-delay': `${box * 100}ms` }}>
                <i /><i /><i /><i />
                <b>2 408</b>
              </div>
            ))}
          </div>
          <div className={`hook-estimate ${audio.beat >= 2 ? 'estimate-visible' : ''}`}>
            <span>6 024</span>
            <i />
            <span>≈ 7 200</span>
          </div>
          <BitSVG state="think" />
        </section>
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <OptionGrid options={c.options} picked={picked} onPick={pick} />
          <FeedbackBlock visible={picked !== null} correct>
            {t({
              uz: "Ajoyib, avval sonning har bir xonasini uch marta olamiz.",
              ru: 'Хорошо. Сначала возьмём каждый разряд числа три раза.',
              en: 'Now take each place value three times.',
            })}
          </FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s1;
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(null);
  const feedback = [
    { uz: "To'g'ri. Nol o'nlar xonasini saqlab turibdi.", ru: 'Верно. Ноль сохраняет разряд десятков.', en: 'Correct. Zero keeps the tens place.' },
    { uz: '4 yuzlar xonasida turib, 400 ni bildiradi.', ru: 'Цифра 4 стоит в сотнях и означает 400.', en: 'The digit 4 is in the hundreds place, so it represents 400.' },
    { uz: 'Chapdagi 2 minglar xonasida turib, 2 000 ni bildiradi.', ru: 'Цифра 2 слева стоит в тысячах и означает 2 000.', en: 'The digit 2 on the left is in the thousands place, so it represents 2 000.' },
  ];
  const reveal = audio.beat >= 1 || audio.completed;

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="place-model" aria-label={t(c.question)}>
          <div className="source-number">2 408</div>
          <div className={`split-arrow ${reveal ? 'revealed' : ''}`}>↓</div>
          <div className={`place-cards ${reveal ? 'revealed' : ''}`}>
            {[
              ['2 000', { uz: 'minglik', ru: 'тысячи', en: 'thousands' }],
              ['400', { uz: 'yuzlik', ru: 'сотни' , en: "hundreds"}],
              ['0', { uz: "o'nlik", ru: 'десятки', en: 'tens' }],
              ['8', { uz: 'birlik', ru: 'единицы' , en: "ones"}],
            ].map(([value, label], index) => (
              <div className={index === 2 ? 'zero-card' : ''} key={value} style={{ '--reveal-delay': `${index * 90}ms` }}>
                <strong>{value}</strong><span>{t(label)}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="question-card optional-question">
          <h2>{t(c.question)}</h2>
          <OptionalPrediction options={c.options} correctIndex={0} picked={picked} onPick={setPicked} feedback={feedback} />
        </section>
      </div>
    </Stage>
  );
}

function Screen2({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s2;
  const audio = useNarration(c.audio, screen);
  const parts = [
    ['2 000 × 3', '6 000'],
    ['400 × 3', '1 200'],
    ['0 × 3', '0'],
    ['8 × 3', '24'],
  ];

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} lead={c.lead} />
        <section className="expanded-model">
          <div className="expanded-source">2 408 = 2 000 + 400 + 0 + 8</div>
          <div className="expanded-parts">
            {parts.map(([formula, value], index) => (
              <div className={`expanded-part ${audio.beat === index ? 'active' : ''} ${audio.beat >= index ? 'revealed' : ''}`} key={formula}>
                <span>{formula}</span>
                <div className="triplicate" aria-hidden="true"><i /><i /><i /></div>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className={`expanded-sum ${audio.beat >= 4 || audio.completed ? 'revealed' : ''}`}>
            <span>6 000 + 1 200 + 0 + 24</span>
            <strong>= 7 224</strong>
          </div>
        </section>
        <div className="key-idea">
          <span>× 3</span>
          <p>{t({ uz: "Har bir xona miqdori uch marta olindi.", ru: 'Значение каждого разряда взято три раза.', en: 'Each place value is taken three times.' })}</p>
        </div>
      </div>
    </Stage>
  );
}

function Screen3({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s3;
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(null);
  const reveal = audio.beat >= 1 || audio.completed;
  const feedback = [
    { uz: "Ko'paytiruvchi butun sonni necha marta olishni bildiradi; uni birlar ostiga yozing.", ru: 'Множитель показывает, сколько раз берут всё число; запиши его под единицами.', en: 'The multiplier applies to the whole number; write it under the ones.' },
    { uz: "Ko'paytiruvchi yuzlikni emas, butun sonni ko'paytiradi.", ru: 'Множитель относится не только к сотням, а ко всему числу.', en: "The multiplier refers not only to hundreds, but to the whole number." },
    { uz: "To'g'ri. Bir xonali ko'paytiruvchi birlar ostiga yoziladi.", ru: 'Верно. Однозначный множитель записывается под единицами.', en: 'Correct. Write the single-digit multiplier under the ones.' },
  ];

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="column-placement">
          <PlaceConveyorSVG beat={audio.beat} />
          <div className="place-headings">
            {[{ uz: 'ming', ru: 'тыс.', en: 'thousands' }, { uz: 'yuz', ru: 'сот.', en: 'hundreds' }, { uz: "o'n", ru: 'дес.', en: 'tens' }, { uz: 'bir', ru: 'ед.', en: 'ones' }].map((label) => <span key={t(label)}>{t(label)}</span>)}
          </div>
          <div className="column-number"><span>2</span><span>4</span><span>0</span><span>8</span></div>
          <div className={`falling-multiplier ${reveal ? 'placed' : ''}`}>×<b>3</b></div>
          <div className={`start-marker ${audio.beat >= 1 ? 'revealed' : ''}`}>{t({ uz: "shu yerdan boshlaymiz", ru: 'начинаем отсюда', en: 'start here' })} ↑</div>
        </section>
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <OptionalPrediction options={c.options} correctIndex={2} picked={picked} onPick={setPicked} feedback={feedback} />
        </section>
      </div>
    </Stage>
  );
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s4;
  const audio = useNarration(c.audio, screen);
  const reveal = audio.beat >= 1 || audio.completed;

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} lead={c.lead} />
        <section className="strategy-model">
          <div className="strategy-source">3 746 × 4</div>
          <div className="strategy-bridge"><span>3 746</span><i>≈</i><strong>3 700</strong></div>
          <div className={`strategy-proof ${reveal ? 'revealed' : ''}`}><span>3 700 × 4 = 14 800</span><strong>≈ 15 000</strong></div>
        </section>
        <div className="key-idea">
          <span>≈ 15 000</span>
          <p>{t({ uz: "Aniq natija taxminga yaqin bo'lishi kerak.", ru: 'Точный результат должен быть близок к оценке.', en: "The exact result should be close to the estimate." })}</p>
        </div>
      </div>
    </Stage>
  );
}

function Screen5({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s5;
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(null);
  const exchanged = audio.beat >= 2 || audio.completed;
  const feedback = [
    { uz: "To'g'ri. 20 birlik 2 o'nlikka aylanadi, 4 birlik qoladi.", ru: 'Верно. Двадцать единиц превращаются в два десятка, четыре единицы остаются.', en: 'Correct. Regroup 20 ones as 2 tens, leaving 4 ones.' },
    { uz: "Birlar xonasida faqat 4 birlik qoladi; 20 birlik 2 o'nlikka aylanadi.", ru: 'В единицах остаётся 4; двадцать единиц превращаются в два десятка.', en: 'Leave 4 ones in the ones place and regroup 20 ones as 2 tens.' },
    { uz: "24 sonida 2 o'nlik va 4 birlik bor; raqamlarning o'rnini almashtirmang.", ru: 'В числе 24 есть 2 десятка и 4 единицы; не меняй цифры местами.', en: 'The number 24 has 2 tens and 4 ones; do not swap the digits.' },
  ];

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className={`exchange-model ${exchanged ? 'exchanged' : ''}`}>
          <div className="unit-cloud unit-cloud-compact" aria-label="24"><strong>24</strong><span>{t({ uz: 'birlik', ru: 'единицы' , en: "ones"})}</span></div>
          <div className="exchange-arrow">→</div>
          <div className="exchange-result">
            <div className="ten-rods"><span /><span /></div>
            <div className="single-units"><i /><i /><i /><i /></div>
            <strong>{t({ uz: "2 o'nlik + 4 birlik", ru: '2 десятка + 4 единицы', en: '2 tens + 4 ones' })}</strong>
          </div>
          <div className={`exchange-total ${audio.beat >= 6 || audio.completed ? 'revealed' : ''}`}>124 × 6 = 744</div>
        </section>
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <OptionalPrediction options={c.options} correctIndex={0} picked={picked} onPick={setPicked} feedback={feedback} />
        </section>
      </div>
    </Stage>
  );
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s6;
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(null);
  const feedback = [
    { uz: "Nolning ko'paytmasi nol, ammo ko'chgan 3 ni ham qo'shish kerak.", ru: 'Произведение нуля равно нулю, но нужно прибавить перенос 3.', en: 'The product of zero is zero, but you must add the carried 3.' },
    { uz: "To'g'ri. Nol xonasi ko'chirilgan 3 ni qabul qiladi.", ru: 'Верно. Разряд с нулём принимает перенос 3.', en: 'Correct. The zero place receives the carried 3.' },
    { uz: "Bu ustunda nol olti marta olinadi; oltita emas, nol hosil bo'ladi. Keyin ko'chgan 3 qo'shiladi.", ru: 'В этом разряде ноль берётся шесть раз; получается не шесть, а ноль. Затем прибавляется перенос 3.', en: 'Zero taken six times gives zero, not six. Then add the carried 3.' },
  ];

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="zero-carry-model">
          <ZeroCheckpointSVG beat={audio.beat} />
          <MiniCoach state="focus" cue="0 + 3" />
          <div className="mini-column">
            <div><span>4</span><span className="zero-place">0</span><span>5</span><span>2</span></div>
            <div className="mini-multiplier">× <b>6</b></div>
          </div>
          <div className={`zero-equation ${audio.beat >= 1 ? 'revealed' : ''}`}>
            0 × 6 <b className={audio.beat >= 2 ? 'shown' : ''}>+ 3</b> = <strong className={audio.beat >= 3 ? 'shown' : ''}>3</strong>
          </div>
          <div className={`zero-final ${audio.beat >= 3 || audio.completed ? 'revealed' : ''}`}>4 052 × 6 = 24 312</div>
        </section>
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <OptionalPrediction options={c.options} correctIndex={1} picked={picked} onPick={setPicked} feedback={feedback} />
        </section>
      </div>
    </Stage>
  );
}

function Screen7({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s7;
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(null);
  const proved = audio.beat >= 2 || audio.completed;
  const feedback = [
    { uz: "To'g'ri. Bir qutidagi miqdor to'rt marta olinadi.", ru: 'Верно. Количество в одной коробке берётся четыре раза.', en: 'Correct. Take the number in one box four times.' },
    { uz: "To'rtta teng guruh uchun ko'paytirish kerak.", ru: 'Для четырёх равных групп нужно умножение.', en: "For four equal groups, multiplication is required." },
    { uz: 'Detallar birlashtiriladi, ayirilmaydi.', ru: 'Детали объединяют, а не вычитают.', en: 'The parts are combined, not subtracted.' },
  ];

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="strategy-model">
          <div className="strategy-source">4 × 1 250</div>
          <div className="strategy-bridge"><span>1 250</span><i>× 4</i><strong>4 {t({ uz: 'quti', ru: 'коробки', en: 'boxes' })}</strong></div>
          <div className={`strategy-proof ${proved ? 'revealed' : ''}`}>
            <span>1 250 + 1 250 + 1 250 + 1 250</span>
            <strong>= 5 000</strong>
          </div>
        </section>
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <OptionalPrediction options={c.options} correctIndex={0} picked={picked} onPick={setPicked} feedback={feedback} />
        </section>
      </div>
    </Stage>
  );
}

function ScoredChoice({
  screen,
  c,
  options = c.options,
  correctIndex,
  feedback,
  feedbackAudio,
  storedAnswer,
  onAnswer,
  onNext,
  onPrev,
  bitState = null,
  visual = null,
}) {
  const t = useT();
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const [feedbackIndex, setFeedbackIndex] = useState(
    storedAnswer?.studentAnswerIndex ?? null,
  );
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const firstTryRef = useRef(storedAnswer?.firstTry ?? true);

  const pick = (index) => {
    if (solved) return;
    const attempts = attemptsRef.current + 1;
    attemptsRef.current = attempts;
    const correct = index === correctIndex;
    if (!correct) firstTryRef.current = false;
    setPicked(index);
    setFeedbackIndex(index);
    setSolved(correct);
    playSfx(correct ? 'correct' : 'wrong');
    audio.pushOneOff(t(feedbackAudio[index]));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.question),
      options: options.map((option) => t(option)),
      correctIndex,
      correctAnswer: t(options[correctIndex]),
      studentAnswerIndex: index,
      studentAnswer: t(options[index]),
      correct,
      firstTry: correct && firstTryRef.current && attempts === 1,
      attempts,
      solved: correct,
    });
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} bitState={bitState} />
        {visual}
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <OptionGrid
            options={options}
            picked={picked}
            correctIndex={correctIndex}
            solved={solved}
            showWrong={feedbackIndex !== null && !solved}
            onPick={pick}
            disabled={solved}
          />
          <FeedbackBlock visible={feedbackIndex !== null} correct={solved}>
            {feedbackIndex !== null ? t(feedback[feedbackIndex]) : ''}
          </FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}

function Screen8(props) {
  const c = CONTENT.s8;
  const feedback = [
    {
      uz: "To'g'ri. 6 birlar xonasida, shuning uchun 3 uning ostiga yoziladi.",
      ru: 'Верно. Цифра 6 стоит в единицах, поэтому 3 записывается под ней.',
      en: 'Correct. The digit 6 is in the ones place, so write 3 below it.',
    },
    {
      uz: "2 yuzlar xonasida. Ko'paytiruvchini birlar ostiga yozing.",
      ru: 'Цифра 2 стоит в сотнях. Запиши множитель под единицами.',
      en: 'The digit 2 is in the hundreds place. Write the multiplier under the ones.',
    },
    {
      uz: "4 minglar xonasida. Ko'paytiruvchini birlar ostiga yozing.",
      ru: 'Цифра 4 стоит в тысячах. Запиши множитель под единицами.',
      en: 'The digit 4 is in the thousands place. Write the multiplier under the ones.',
    },
  ];
  const feedbackAudio = [
    {
      uz: "To'g'ri. Uch raqami 6 ostidagi birlar ustuniga yoziladi.",
      ru: 'Верно. Цифра 3 записывается в столбце единиц под цифрой 6.',
      en: 'Correct. Write the digit three in the ones column under the digit six.',
    },
    {
      uz: "Ko'paytiruvchi birlar ustunida turishi kerak.",
      ru: 'Множитель должен стоять в столбце единиц.',
      en: 'The multiplier should be in the ones column.',
    },
    {
      uz: "Ko'paytiruvchi birlar ustunida turishi kerak.",
      ru: 'Множитель должен стоять в столбце единиц.',
      en: 'The multiplier should be in the ones column.',
    },
  ];
  return (
    <ScoredChoice
      {...props}
      c={c}
      correctIndex={0}
      feedback={feedback}
      feedbackAudio={feedbackAudio}
      visual={(
        <div className="compact-proof" aria-hidden="true">
          <span>4 206</span><i>×</i><strong>3 ↓ 6</strong>
        </div>
      )}
    />
  );
}

function Screen9({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s9;
  const audio = useNarration(c.audio, screen);
  const slotLabels = [
    { uz: 'minglar', ru: 'тысячи', en: 'thousands' },
    { uz: 'yuzlar', ru: 'сотни', en: 'hundreds' },
    { uz: "o'nlar", ru: 'десятки' , en: "tens"},
    { uz: 'birlar', ru: 'единицы' , en: 'ones'},
  ];
  const cards = ['2 000', '300', '0', '6'];
  const correct = ['2 000', '300', '0', '6'];
  const [placed, setPlaced] = useState(storedAnswer?.correct ? correct : [null, null, null, null]);
  const [selected, setSelected] = useState(null);
  const [wrongSlots, setWrongSlots] = useState([]);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const [message, setMessage] = useState(storedAnswer?.correct
    ? { uz: "To'g'ri. 2 306 = 2 000 + 300 + 0 + 6.", ru: 'Верно. 2 306 = 2 000 + 300 + 0 + 6.', en: 'Correct. 2 306 = 2 000 + 300 + 0 + 6.' }
    : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const firstTryRef = useRef(storedAnswer?.firstTry ?? true);

  const available = cards.filter((card) => !placed.includes(card));

  const evaluate = (next) => {
    if (next.some((value) => value === null)) return;
    const attempts = attemptsRef.current + 1;
    attemptsRef.current = attempts;
    const incorrect = next.map((value, index) => value !== correct[index] ? index : -1).filter((index) => index >= 0);
    const isCorrect = incorrect.length === 0;
    if (!isCorrect) firstTryRef.current = false;
    setWrongSlots(incorrect);
    setSolved(isCorrect);
    const nextMessage = isCorrect
      ? { uz: "To'g'ri. 2 000, 300, 0 va 6 sonning yoyiq qismlaridir.", ru: 'Верно. 2 000, 300, 0 и 6 — разрядные части числа.', en: 'Correct. 2 000, 300, 0 and 6 are the place-value parts of the number.' }
      : incorrect.includes(2)
        ? { uz: "Nol o'nliklar xonasini saqlaydi.", ru: 'Ноль сохраняет разряд десятков.', en: "Zero retains the tens place." }
        : { uz: "Ajratilgan kartadagi raqam qaysi xonada turganini tekshiring.", ru: 'Проверь, в каком разряде стоит цифра на выделенной карточке.', en: 'Check the place value shown on the highlighted card.' };
    setMessage(nextMessage);
    playSfx(isCorrect ? 'correct' : 'wrong');
    audio.pushOneOff(isCorrect
      ? t({ uz: "To'g'ri. Ikki ming uch yuz olti soni ikki ming, uch yuz, nol va oltidan tuzilgan.", ru: 'Верно. Число две тысячи триста шесть состоит из двух тысяч, трёхсот, нуля и шести.', en: 'Correct. Two thousand three hundred and six contains two thousands, three hundreds, zero tens and six ones.' })
      : t({ uz: 'Ajratilgan kartaning xona qiymatini yana tekshiring.', ru: 'Ещё раз проверь разрядное значение выделенной карточки.', en: 'Check the place value on the highlighted card again.' }));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.question),
      options: cards,
      correctIndex: null,
      correctAnswer: correct.join(' | '),
      studentAnswerIndex: null,
      studentAnswer: next.join(' | '),
      correct: isCorrect,
      firstTry: isCorrect && firstTryRef.current && attempts === 1,
      attempts,
      solved: isCorrect,
    });
  };

  const placeCard = (slotIndex) => {
    if (solved) return;
    if (placed[slotIndex] !== null) {
      const next = [...placed];
      next[slotIndex] = null;
      setPlaced(next);
      setWrongSlots([]);
      setMessage(null);
      return;
    }
    if (selected === null) return;
    const next = [...placed];
    next[slotIndex] = selected;
    setPlaced(next);
    setSelected(null);
    setWrongSlots([]);
    setMessage(null);
    evaluate(next);
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="construction-board">
          <div className="construction-formula">2 306 = 2 000 + 300 + 0 + 6</div>
          <div className="construction-slots">
            {slotLabels.map((label, index) => (
              <button
                type="button"
                key={t(label)}
                className={`construction-slot ${placed[index] !== null ? 'filled' : ''} ${wrongSlots.includes(index) ? 'slot-wrong' : ''}`}
                onClick={() => placeCard(index)}
                disabled={solved}
                aria-label={`${t(label)}: ${placed[index] ?? t({ uz: "bo'sh", ru: 'пусто', en: 'empty' })}`}
              >
                <small>{t(label)}</small>
                <strong>{placed[index] ?? '···'}</strong>
              </button>
            ))}
          </div>
          <div className="card-bank" aria-label={t({ uz: 'Kartalar', ru: 'Карточки', en: 'Cards' })}>
            {available.map((card) => (
              <button
                type="button"
                key={card}
                className={`math-card ${selected === card ? 'selected' : ''}`}
                onClick={() => setSelected(card)}
                disabled={solved}
                aria-pressed={selected === card}
              >
                {card}
              </button>
            ))}
          </div>
          <div className={`construction-total ${solved ? 'revealed' : ''}`}>2 000 + 300 + 0 + 6 = <b>2 306</b></div>
        </section>
        <FeedbackBlock visible={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen10({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s10;
  const audio = useNarration(c.audio, screen);
  const target = ['2', '4', '0', '0'];
  const initial = storedAnswer?.correct ? target : [null, null, null, null];
  const [digits, setDigits] = useState(initial);
  const [active, setActive] = useState(() => initial.every(Boolean) ? null : 3);
  const [wrongIndex, setWrongIndex] = useState(null);
  const [message, setMessage] = useState(storedAnswer?.correct
    ? { uz: "To'g'ri. Oraliq natija 2 400.", ru: 'Верно. Промежуточный результат равен 2 400.', en: 'Correct. The partial product is 2 400.' }
    : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const firstTryRef = useRef(storedAnswer?.firstTry ?? true);

  const hints = [
    { uz: "8 yuzlikni uch marta olsak, 24 yuzlik, ya'ni 2 400 bo'ladi.", ru: 'Восемь сотен, взятые три раза, дают 24 сотни, то есть 2 400.', en: 'Eight hundreds taken three times make 24 hundreds, or 2 400.' },
    { uz: "8 yuzlikni uch marta olsak, 24 yuzlik, ya'ni 2 400 bo'ladi.", ru: 'Восемь сотен, взятые три раза, дают 24 сотни, то есть 2 400.', en: 'Eight hundreds taken three times make 24 hundreds, or 2 400.' },
    { uz: "8 yuzlikni uch marta olsak, 24 yuzlik, ya'ni 2 400 bo'ladi.", ru: 'Восемь сотен, взятые три раза, дают 24 сотни, то есть 2 400.', en: 'Eight hundreds taken three times make 24 hundreds, or 2 400.' },
    { uz: "8 yuzlikni uch marta olsak, 24 yuzlik, ya'ni 2 400 bo'ladi.", ru: 'Восемь сотен, взятые три раза, дают 24 сотни, то есть 2 400.', en: 'Eight hundreds taken three times make 24 hundreds, or 2 400.' },
  ];
  const hintsAudio = [
    { uz: "Sakkiz yuzlikni uch marta olsak, yigirma to'rt yuzlik, ya'ni ikki ming to'rt yuz bo'ladi.", ru: 'Восемь сотен, взятые три раза, дают двадцать четыре сотни, то есть две тысячи четыреста.', en: 'Eight hundreds taken three times make twenty-four hundreds, or two thousand four hundred.' },
    { uz: "Sakkiz yuzlikni uch marta olsak, yigirma to'rt yuzlik, ya'ni ikki ming to'rt yuz bo'ladi.", ru: 'Восемь сотен, взятые три раза, дают двадцать четыре сотни, то есть две тысячи четыреста.', en: 'Eight hundreds taken three times make twenty-four hundreds, or two thousand four hundred.' },
    { uz: "Sakkiz yuzlikni uch marta olsak, yigirma to'rt yuzlik, ya'ni ikki ming to'rt yuz bo'ladi.", ru: 'Восемь сотен, взятые три раза, дают двадцать четыре сотни, то есть две тысячи четыреста.', en: 'Eight hundreds taken three times make twenty-four hundreds, or two thousand four hundred.' },
    { uz: "Sakkiz yuzlikni uch marta olsak, yigirma to'rt yuzlik, ya'ni ikki ming to'rt yuz bo'ladi.", ru: 'Восемь сотен, взятые три раза, дают двадцать четыре сотни, то есть две тысячи четыреста.', en: 'Eight hundreds taken three times make twenty-four hundreds, or two thousand four hundred.' },
  ];

  const enterDigit = (digit) => {
    if (active === null || digits[active] !== null) return;
    attemptsRef.current += 1;
    if (digit !== target[active]) {
      firstTryRef.current = false;
      setWrongIndex(active);
      setMessage(hints[active]);
      playSfx('wrong');
      audio.pushOneOff(t(hintsAudio[active]));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.question),
        options: null,
        correctIndex: null,
        correctAnswer: '2 400',
        studentAnswerIndex: null,
        studentAnswer: digits.map((value) => value ?? '□').join(''),
        correct: false,
        firstTry: false,
        attempts: attemptsRef.current,
        solved: false,
      });
      return;
    }
    const next = [...digits];
    next[active] = digit;
    setDigits(next);
    setWrongIndex(null);
    setMessage(null);
    const nextActive = [3, 2, 1, 0].find((index) => next[index] === null) ?? null;
    setActive(nextActive);
    if (nextActive === null) {
      const success = { uz: "To'g'ri. Oraliq natija ikki ming to'rt yuz.", ru: 'Верно. Промежуточный результат равен двум тысячам четырёмстам.', en: 'Correct. The partial product is two thousand four hundred.' };
      setMessage(success);
      playSfx('correct');
      audio.pushOneOff(t(success));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.question),
        options: null,
        correctIndex: null,
        correctAnswer: '2 400',
        studentAnswerIndex: null,
        studentAnswer: '2 400',
        correct: true,
        firstTry: firstTryRef.current,
        attempts: attemptsRef.current,
        solved: true,
      });
    }
  };

  const solved = digits.every(Boolean);
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="digit-task">
          <div className="digit-column">
            <span>800</span>
            <span>× 3</span>
            <i />
          </div>
          <p className="direction-hint">{t({ uz: "8 yuzlik × 3 = 24 yuzlik.", ru: '8 сотен × 3 = 24 сотни.', en: '8 hundreds × 3 = 24 hundreds.' })}</p>
          <div className="digit-slots" role="group" aria-label={t({ uz: 'Natija kataklari', ru: 'Ячейки ответа', en: 'Answer boxes' })}>
            {digits.map((digit, index) => (
              <button
                type="button"
                key={index}
                className={`${active === index ? 'active' : ''} ${digit !== null ? 'locked' : ''} ${wrongIndex === index ? 'wrong' : ''}`}
                onClick={() => digit === null && setActive(index)}
                disabled={digit !== null}
                aria-label={`${index + 1}: ${digit ?? t({ uz: "bo'sh", ru: 'пусто', en: 'empty' })}`}
              >
                {digit ?? '□'}
              </button>
            ))}
          </div>
          <div className="keypad" aria-label={t({ uz: 'Raqamlar paneli', ru: 'Цифровая панель', en: 'Number keypad' })}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
              <button type="button" key={digit} onClick={() => enterDigit(String(digit))} disabled={solved}>{digit}</button>
            ))}
          </div>
        </section>
        <FeedbackBlock visible={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen11(props) {
  const c = CONTENT.s11;
  const options = [{ uz: '0', ru: '0' , en: "0"}, { uz: '3', ru: '3' , en: "3"}, { uz: '5', ru: '5' , en: "5"}];
  const feedback = [
    { uz: "To'g'ri. Yuzlar katagidagi 0 yozuvni 15 085 qilib tiklaydi.", ru: 'Верно. Ноль в разряде сотен восстанавливает запись 15 085.', en: 'Correct. Zero in the hundreds place completes 15 085.' },
    { uz: "Katakni olib tashlash yoki 3 yozish mumkin emas; aks holda o'ngdagi raqamlarning xona qiymati o'zgaradi.", ru: 'Нельзя убрать ячейку или записать 3, иначе изменится разрядное значение цифр справа.', en: 'Do not remove the box or write 3; either change would alter the place values of the digits on the right.' },
    { uz: "Bu katak ko'paytiruvchi uchun emas, natijaning yuzlar xonasi uchun.", ru: 'Эта ячейка относится не к множителю, а к разряду сотен результата.', en: 'This box is for the hundreds place of the result, not the multiplier.' },
  ];
  const feedbackAudio = [
    { uz: "To'g'ri. Natija o'n besh ming sakson besh.", ru: 'Верно. Результат равен пятнадцати тысячам восьмидесяти пяти.', en: 'Correct. The result is fifteen thousand and eighty-five.' },
    { uz: "Yuzlar xonasining o'rnini saqlaydigan raqamni tekshiring.", ru: 'Проверь цифру, которая сохраняет место разряда сотен.', en: 'Check which digit keeps the hundreds place.' },
    { uz: "Bo'sh katak natijaning yuzlar xonasida turibdi.", ru: 'Пустая ячейка стоит в разряде сотен результата.', en: 'The empty box is in the hundreds place of the result.' },
  ];
  return (
    <ScoredChoice
      {...props}
      c={{ ...c, options }}
      options={options}
      correctIndex={0}
      feedback={feedback}
      feedbackAudio={feedbackAudio}
      bitState="awkward"
      visual={(
        <div className="error-equation">
          <span>3 017 × 5</span><i>=</i><strong>15 <b>□</b> 85</strong>
        </div>
      )}
    />
  );
}

function Screen12({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s12;
  const audio = useNarration(c.audio, screen);
  const left = ['2 408 × 3 = 7 224', '6 110 × 4 = 24 440', '1 995 × 5 = 9 975'];
  const right = ['≈ 10 000', '≈ 7 200', '≈ 24 000'];
  const mapping = [1, 2, 0];
  const [activeLeft, setActiveLeft] = useState(null);
  const [matches, setMatches] = useState(storedAnswer?.correct ? mapping : [null, null, null]);
  const [message, setMessage] = useState(storedAnswer?.correct
    ? { uz: "To'g'ri. Barcha aniq natijalar eng yaqin taxmin bilan juftlandi.", ru: 'Верно. Все точные результаты соединены с ближайшей оценкой.', en: 'Correct. Every exact product is matched to the nearest estimate.' }
    : null);
  const [wrongRight, setWrongRight] = useState(null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const firstTryRef = useRef(storedAnswer?.firstTry ?? true);
  const solved = matches.every((value, index) => value === mapping[index]);

  const chooseRight = (rightIndex) => {
    if (activeLeft === null || solved) return;
    attemptsRef.current += 1;
    if (mapping[activeLeft] !== rightIndex) {
      firstTryRef.current = false;
      setWrongRight(rightIndex);
      const hint = { uz: 'Yaqin minglik yoki yuzlikdan foydalanib yana taxmin qiling.', ru: 'Снова оцени выражение с помощью ближайших тысяч или сотен.', en: 'Estimate again using the nearest thousand or hundred.' };
      setMessage(hint);
      playSfx('wrong');
      audio.pushOneOff(t(hint));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.question),
        options: right,
        correctIndex: null,
        correctAnswer: mapping.join(','),
        studentAnswerIndex: null,
        studentAnswer: `${activeLeft}:${rightIndex}`,
        correct: false,
        firstTry: false,
        attempts: attemptsRef.current,
        solved: false,
      });
      return;
    }
    const next = [...matches];
    next[activeLeft] = rightIndex;
    setMatches(next);
    setActiveLeft(null);
    setWrongRight(null);
    const done = next.every((value, index) => value === mapping[index]);
    setMessage(done
      ? { uz: "To'g'ri. Taxminlar natijalarning umumiy kattaligiga mos.", ru: 'Верно. Оценки соответствуют общей величине результатов.', en: 'Correct. The estimates match the overall size of the products.' }
      : null);
    if (done) {
      playSfx('correct');
      audio.pushOneOff(t({ uz: "To'g'ri. Uchala natija eng yaqin taxmin bilan juftlandi.", ru: 'Верно. Все три результата соединены с ближайшей оценкой.', en: 'Correct. Each of the three products is matched to its nearest estimate.' }));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.question),
        options: right,
        correctIndex: null,
        correctAnswer: mapping.join(','),
        studentAnswerIndex: null,
        studentAnswer: next.join(','),
        correct: true,
        firstTry: firstTryRef.current,
        attempts: attemptsRef.current,
        solved: true,
      });
    }
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="matching-board">
          <div className="matching-column">
            {left.map((item, index) => (
              <button
                type="button"
                key={item}
                className={`${activeLeft === index ? 'selected' : ''} ${matches[index] !== null ? 'matched' : ''}`}
                onClick={() => matches[index] === null && setActiveLeft(index)}
                disabled={matches[index] !== null || solved}
              >
                <span>{item}</span>
                {matches[index] !== null && <b>{right[matches[index]]}</b>}
              </button>
            ))}
          </div>
          <div className="matching-arrow" aria-hidden="true">↔</div>
          <div className="matching-column right-column">
            {right.map((item, index) => {
              const used = matches.includes(index);
              return (
                <button
                  type="button"
                  key={item}
                  className={`${used ? 'matched' : ''} ${wrongRight === index ? 'wrong' : ''}`}
                  onClick={() => chooseRight(index)}
                  disabled={used || solved}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>
        <FeedbackBlock visible={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen13({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s13;
  const audio = useNarration(c.audio, screen);
  const [value, setValue] = useState(storedAnswer?.studentAnswer ?? '');
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const [message, setMessage] = useState(storedAnswer?.correct
    ? { uz: "To'g'ri. Jami 14 250 ta detal.", ru: 'Верно. Всего 14 250 деталей.', en: 'Correct. There are 14 250 parts in total.' }
    : null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const firstTryRef = useRef(storedAnswer?.firstTry ?? true);

  const submit = () => {
    const normalized = sanitizeNumeric(value);
    if (!normalized || solved) return;
    attemptsRef.current += 1;
    const correct = normalized === '14250';
    if (!correct) firstTryRef.current = false;
    setSolved(correct);
    const numeric = Number(normalized);
    const nextMessage = correct
      ? { uz: "To'g'ri. Jami 14 250 ta detal.", ru: 'Верно. Всего 14 250 деталей.', en: 'Correct. There are 14 250 parts in total.' }
      : Math.abs(numeric - 14400) > 2000
        ? { uz: "Javob 14 400 atrofida bo'lishi kerak. Natijaning umumiy kattaligini tekshiring.", ru: 'Ответ должен быть около 14 400. Проверь общую величину результата.', en: 'The answer should be about 14 400. Check its overall size.' }
        : { uz: "Natija taxminga yaqin. Birlar xonasidan boshlab ko'chirishlarni tekshiring.", ru: 'Ответ близок к оценке. Проверь переносы, начиная с единиц.', en: 'The answer is close to the estimate. Check the regrouping from the ones place.' };
    setMessage(nextMessage);
    playSfx(correct ? 'correct' : 'wrong');
    const spokenFeedback = correct
      ? { uz: "To'g'ri. Jami o'n to'rt ming ikki yuz ellikta detal.", ru: 'Верно. Всего четырнадцать тысяч двести пятьдесят деталей.', en: 'Correct. There are fourteen thousand two hundred and fifty parts in total.' }
      : Math.abs(numeric - 14400) > 2000
        ? { uz: "Javob o'n to'rt ming to'rt yuz atrofida bo'lishi kerak. Natijaning umumiy kattaligini tekshiring.", ru: 'Ответ должен быть около четырнадцати тысяч четырёхсот. Проверь общую величину результата.', en: 'The answer should be about fourteen thousand four hundred. Check its overall size.' }
        : { uz: "Natija taxminga yaqin. Birlar xonasidan boshlab ko'chirishlarni tekshiring.", ru: 'Ответ близок к оценке. Проверь переносы, начиная с единиц.', en: 'The answer is close to the estimate. Check the regrouping from the ones place.' };
    audio.pushOneOff(t(spokenFeedback));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.question),
      options: null,
      correctIndex: null,
      correctAnswer: '14250',
      studentAnswerIndex: null,
      studentAnswer: normalized,
      correct,
      firstTry: correct && firstTryRef.current && attemptsRef.current === 1,
      attempts: attemptsRef.current,
      solved: correct,
    });
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="screen-stack">
        <PageTitle c={c} />
        <section className="warehouse-scene" aria-hidden="true">
          <div className="warehouse-boxes">{Array.from({ length: 6 }, (_, index) => <span key={index}>2 375</span>)}</div>
          <div className="warehouse-estimate">2 400 × 6 ≈ 14 400</div>
        </section>
        <section className="question-card">
          <h2>{t(c.question)}</h2>
          <div className="input-row">
            <input
              className={`answer-input ${solved ? 'input-correct' : message ? 'input-wrong' : ''}`}
              inputMode="numeric"
              value={value}
              placeholder="0"
              disabled={solved}
              aria-label={t({ uz: 'Javob', ru: 'Ответ', en: 'Answer' })}
              onChange={(event) => {
                setValue(sanitizeNumeric(event.target.value));
                setMessage(null);
              }}
              onKeyDown={(event) => event.key === 'Enter' && submit()}
            />
            <button type="button" className="btn btn-white-accent" disabled={!value || solved} onClick={submit}>
              {t({ uz: 'Tekshirish', ru: 'Проверить' , en: "Check"})}
            </button>
          </div>
          <FeedbackBlock visible={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}

function Screen14({ screen, finishLesson, onPrev, answers = [] }) {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s14;
  const audio = useNarration(c.audio, screen);
  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const visibleBeat = reduced ? 3 : audio.beat;
  const corrected = visibleBeat >= 3 || audio.completed || audio.muted;
  const scoredIndexes = SCREEN_META.reduce((indexes, meta, index) => (meta.scored ? [...indexes, index] : indexes), []);
  const firstTryCount = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
  const totalScored = scoredIndexes.length;
  const rewardTitles = {
    top: { uz: "Ko'paytirish me'mori", ru: 'Архитектор умножения', en: 'Multiplication architect' },
    middle: { uz: "Ko'paytirish ustasi", ru: 'Мастер умножения', en: 'Multiplication master' },
    base: { uz: "Ko'paytma tadqiqotchisi", ru: 'Исследователь произведений', en: 'Product explorer' },
  };
  const rewardTitle = firstTryCount === totalScored
    ? rewardTitles.top
    : firstTryCount >= Math.max(1, totalScored - 1)
      ? rewardTitles.middle
      : rewardTitles.base;
  const rules = [
    { uz: "Har bir xona ko'payadi", ru: 'Умножается каждый разряд', en: 'Multiply each place value' },
    { uz: "To'liq o'nlik keyingi xonaga o'tadi", ru: 'Полные десятки переходят дальше', en: 'Regroup each complete ten into the next place' },
    { uz: "Nol xona o'rnini saqlaydi", ru: 'Ноль сохраняет разряд', en: 'Zero keeps its place' },
    { uz: "Javobni taxmin bilan tekshiring", ru: 'Проверяй ответ оценкой', en: 'Check the answer with an estimate' },
  ];

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish>
      <div className="screen-stack summary-screen">
        <G4TitleReveal active={corrected} title={t(rewardTitle)} lang={lang} />
        <style>{G4_TITLE_STYLES}</style>
        <header className="finale-heading">
          <span>{t({ uz: "YAKUNIY BOSQICH", ru: 'ФИНАЛЬНЫЙ ЭТАП' , en: "FINAL STAGE"})}</span>
          <h1>{t(c.title)}</h1>
          <p>{t({ uz: "Ko'paytirishning to'rtta tayanchini va dars boshidagi taxminni bir sahnada tekshiramiz.", ru: 'Проверим в одной сцене четыре опоры умножения и стартовую гипотезу.', en: 'Bring together the four key ideas for multiplication and the opening prediction.' })}</p>
        </header>
        <div className="finale-main-grid">
          <section className="finale-payoff-card">
            <span className="finale-section-kicker">{t({ uz: "BOSHLANG'ICH MISSIYA YECHIMI", ru: 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ', en: 'OPENING MISSION SOLUTION' })}</span>
            <div className="summary-correction">
              <div className="summary-wrong"><small>{t({ uz: "Boshlang'ich taxmin", ru: 'Стартовая гипотеза', en: 'Opening prediction' })}</small><span>6 024</span></div>
              <div className={`summary-parts ${corrected ? 'corrected' : ''}`}>
                <span>6 000</span><i>+</i><span>1 200</span><i>+</i><span>0</span><i>+</i><span>24</span>
              </div>
              <div className={`summary-answer ${corrected ? 'revealed' : ''}`}>= 7 224</div>
            </div>
            <p className="finale-payoff-copy">{t({ uz: "To'g'ri hisob taxminni 7 224 natija bilan almashtirdi.", ru: 'Точное вычисление заменило гипотезу результатом 7 224.', en: 'The exact calculation replaces the opening prediction with 7 224.' })}</p>
          </section>
          <section className="finale-mastery-card">
            <span className="finale-section-kicker">{t({ uz: "SIZ O'RGANGAN TAYANCHLAR", ru: 'ОСВОЕННЫЕ ОПОРЫ' , en: "KEY IDEAS MASTERED"})}</span>
            <div className="rule-grid">
              {rules.map((rule, index) => (
                <div className={visibleBeat >= index ? 'active' : ''} key={t(rule)}>
                  <b>{index + 1}</b><span>{t(rule)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        {corrected && <G4TitleCard title={t(rewardTitle)} lang={lang} firstTry={firstTryCount} totalScored={totalScored} />}
        <div className="next-bridge">
          <span>{t({ uz: "KEYINGI MISSIYA", ru: 'СЛЕДУЮЩАЯ МИССИЯ' , en: "NEXT MISSION"})}</span>
          <strong>{t({ uz: "Ko'p xonali sonni ikki xonali songa ko'paytirish", ru: 'Умножение многозначного числа на двузначное', en: 'Multiplying a multi-digit number by a two-digit number' })}</strong>
        </div>
      </div>
    </Stage>
  );
}

const SCREENS = [
  Screen0,
  Screen1,
  Screen9,
  Screen3,
  Screen8,
  Screen2,
  Screen10,
  Screen6,
  Screen11,
  Screen4,
  Screen12,
  Screen7,
  Screen13,
  Screen5,
  Screen14,
];

export default function Grade4Dars09({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  onFinished,
}) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(preview ? previewLang : langProp);
  useMobileZoom();
  useEffect(() => {
    configureLesson({
      ttsApiBase: ttsApiBase || '',
      voiceGender: voiceGender || 'f',
      correctSoundUrl: correctSoundUrl || '',
      wrongSoundUrl: wrongSoundUrl || '',
      previewMode: preview,
    });
  }, [correctSoundUrl, ttsApiBase, voiceGender, wrongSoundUrl, preview]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- the LMS payload requires elapsed time from mount
  const startTimeRef = useRef(Date.now());
  const finishedRef = useRef(false);

  const recordAnswer = useCallback((answer) => {
    setAnswers((previous) => {
      const next = [...previous];
      const old = previous[answer.screenIdx];
      next[answer.screenIdx] = {
        ...answer,
        firstTry: old?.firstTry === false ? false : answer.firstTry,
      };
      return next;
    });
  }, []);

  const finishLesson = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const scoredIndexes = SCREEN_META
      .map((meta, index) => meta.scored ? index : null)
      .filter((index) => index !== null);
    const correctAnswers = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
    const totalQuestions = scoredIndexes.length;
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang],
      studentName: studentName || null,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions,
      correctAnswers,
      scorePercent: Math.round((correctAnswers / totalQuestions) * 100),
      finalScore: correctAnswers,
      finalTotal: totalQuestions,
      passed: correctAnswers / totalQuestions >= 0.6,
      firstTryStats: { total: totalQuestions, firstTryCorrect: correctAnswers },
      attemptsTotal: scoredIndexes.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    onFinished?.(payload);
  }, [answers, lang, onFinished, studentName]);

  const CurrentScreen = SCREENS[current];
  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        {preview && (
          <div
            className="preview-language"
            aria-label={selectLocale(lang, { uz: "Ko'rib chiqish tili", ru: 'Язык предпросмотра', en: 'Preview language' })}
          >
            {SUPPORTED_LANGS.map((code) => (
              <button
                type="button"
                key={code}
                className={previewLang === code ? 'preview-active' : ''}
                onClick={() => setPreviewLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen
          key={current}
          screen={current}
          answers={answers}
          storedAnswer={answers[current]}
          onAnswer={recordAnswer}
          onPrev={() => setCurrent((value) => Math.max(0, value - 1))}
          onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}

const STYLES = `
  .lesson-page:has(.lesson-root),
  .lesson-frame:has(.lesson-root) {
    width: 100%;
    height: 100%;
    min-height: 0 !important;
    overflow: hidden !important;
    overscroll-behavior: none;
  }

  .lesson-root,
  .lesson-root * {
    box-sizing: border-box;
  }

  .lesson-root h1,
  .lesson-root h2,
  .lesson-root h3,
  .lesson-root p {
    margin: 0;
  }

  .lesson-root {
    width: 100%;
    min-height: 100dvh;
    overflow: hidden;
    color: ${T.ink};
    background:
      radial-gradient(circle at 8% 8%, rgba(22, 143, 163, .10), transparent 29%),
      radial-gradient(circle at 92% 92%, rgba(255, 91, 53, .08), transparent 31%),
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
    background: rgba(247, 248, 244, .88);
    backdrop-filter: blur(14px);
    z-index: 5;
  }

  .progress-track {
    width: 100%;
    height: 6px;
    margin-bottom: 10px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(80, 97, 109, .16);
  }

  .progress-bar {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, ${T.cyan}, ${T.accent});
    box-shadow: 0 0 12px rgba(255, 91, 53, .42);
    transition: width .45s ease;
  }

  .stage-chrome,
  .chrome-title,
  .chrome-actions,
  .audio-controls {
    display: flex;
    align-items: center;
  }

  .stage-chrome {
    justify-content: space-between;
    gap: 12px;
  }

  .chrome-title {
    min-width: 0;
    gap: 9px;
    color: ${T.ink2};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    flex: none;
    border-radius: 50%;
    background: ${T.accent};
    box-shadow: 0 0 10px rgba(255, 91, 53, .65);
  }

  .chrome-title span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chrome-actions {
    flex: none;
    gap: 9px;
  }

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

  .audio-controls {
    gap: 9px;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: 10px;
    color: ${T.ink2};
    background: rgba(255, 255, 255, .75);
    cursor: pointer;
    box-shadow: 0 4px 12px -7px rgba(${T.shadowBase}, .3);
  }

  .stage-content {
    min-height: 0;
    flex: 1 1 auto;
    overflow: visible;
    padding-top: 18px;
    padding-bottom: 12px;
    position: relative;
  }

  .stage-happy-bit { width: 42px; height: 42px; position: absolute; z-index: 3; top: 8px; right: 8px; display: grid; place-items: center; }
  .stage-happy-bit .g1-char { width: 100%; height: 100%; display: block; }
  .page-title { padding-right: 52px; }
  .unit-cloud.unit-cloud-compact { display: grid; grid-template-columns: 1fr; place-items: center; align-content: center; gap: 4px; }
  .unit-cloud-compact strong { font: 900 34px/1 'JetBrains Mono', monospace; color: ${T.cyan}; }
  .unit-cloud-compact span { color: ${T.ink2}; font-weight: 800; }

  .stage-nav {
    min-height: 72px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 10px;
    padding-bottom: 12px;
    background: rgba(245, 245, 240, .94);
    border-top: 1px solid rgba(23, 59, 82, .08);
    backdrop-filter: blur(12px);
    z-index: 5;
  }

  .btn {
    min-width: 124px;
    min-height: 50px;
    padding: 0 18px;
    border: 0;
    border-radius: 15px;
    font: 850 13px/1 Manrope, sans-serif;
    cursor: pointer;
    transition: transform .2s ease, background .2s ease, color .2s ease;
  }

  .btn:hover:not(:disabled),
  .icon-btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .btn-ghost {
    background: transparent;
    color: ${T.ink2};
  }

  .btn-ghost:hover {
    background: ${T.paper};
    box-shadow: 0 10px 24px -17px rgba(${T.shadowBase}, .45);
  }

  .btn-white-accent {
    background: ${T.paper};
    color: ${T.accent};
    box-shadow: 0 13px 28px -18px rgba(255, 91, 53, .60);
  }

  .btn-white-accent:hover:not(:disabled) {
    background: ${T.accent};
    color: white;
  }

  .btn:disabled,
  button:disabled {
    cursor: default;
    opacity: .54;
  }

  .screen-stack {
    display: grid;
    gap: 14px;
  }

  .page-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    min-height: 88px;
  }

  .page-title > div {
    min-width: 0;
  }

  .page-title > div > span,
  .question-card > span,
  .hook-copy > span,
  .next-bridge > span {
    display: block;
    margin-bottom: 7px;
    color: ${T.cyan};
    font-size: 10px;
    font-weight: 950;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .page-title h1 {
    max-width: 770px;
    font: 750 clamp(27px, 4vw, 41px)/1.05 'Source Serif 4', Georgia, serif;
    letter-spacing: -.025em;
  }

  .page-title p {
    margin-top: 8px;
    color: ${T.ink2};
    font: 850 18px/1.25 'JetBrains Mono', monospace;
  }

  .page-title-bit .g1-char {
    width: 72px;
    height: 90px;
    flex: none;
  }

  .math-mini-coach {
    z-index: 3;
    width: max-content;
    max-width: 100%;
    display: grid;
    grid-template-columns: 68px auto;
    align-items: center;
    gap: 5px;
    pointer-events: none;
  }

  .math-mini-coach .g1-char {
    width: 68px;
    height: 84px;
  }

  .math-mini-coach > span {
    padding: 7px 10px;
    border: 1px solid rgba(255, 91, 53, .22);
    border-radius: 999px;
    color: #FF5B35;
    background: #FFF0EA;
    font: 900 13px/1 'JetBrains Mono', monospace;
  }

  .carry-model > .math-mini-coach,
  .zero-carry-model > .math-mini-coach {
    position: absolute;
    top: 8px;
    right: 10px;
  }

  .sensor-factory-svg,
  .place-conveyor-svg,
  .carry-capsule-svg,
  .zero-checkpoint-svg {
    width: 100%;
    display: block;
    overflow: visible;
  }

  .sensor-factory-svg {
    height: 112px;
  }

  .factory-belt,
  .place-conveyor-track,
  .checkpoint-track {
    fill: none;
    stroke: #173B52;
    stroke-width: 4;
    stroke-linecap: round;
    opacity: .16;
  }

  .sensor-bay {
    opacity: .28;
    transform: translateY(7px);
    transition: opacity .42s ease, transform .52s cubic-bezier(.16, 1, .3, 1);
  }

  .sensor-bay.bay-online {
    opacity: 1;
    transform: translateY(0);
  }

  .sensor-bay rect {
    fill: #E4F5F6;
    stroke: rgba(22, 143, 163, .32);
    stroke-width: 2;
  }

  .sensor-bay circle {
    fill: #168FA3;
  }

  .sensor-bay text,
  .factory-counter text {
    fill: #173B52;
    font: 900 12px/1 'JetBrains Mono', monospace;
    text-anchor: middle;
  }

  .factory-output-arrow {
    fill: none;
    stroke: #FF5B35;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .factory-counter {
    opacity: .2;
    transform: scale(.9);
    transform-origin: 546px 50px;
    transition: opacity .45s ease, transform .55s cubic-bezier(.16, 1, .3, 1);
  }

  .factory-counter.counter-ready {
    opacity: 1;
    transform: scale(1);
  }

  .factory-counter rect {
    fill: #E7F4EC;
    stroke: rgba(36, 117, 83, .38);
    stroke-width: 2;
  }

  .factory-counter text {
    fill: #247553;
  }

  .belt-wheel,
  .conveyor-wheel,
  .checkpoint-wheel {
    fill: #173B52;
    opacity: .28;
  }

  .place-conveyor-svg {
    height: 104px;
    margin-bottom: 2px;
  }

  .place-crate rect {
    fill: #E4F5F6;
    stroke: rgba(22, 143, 163, .32);
    stroke-width: 2;
  }

  .place-crate.unit-crate rect {
    fill: #FFF0EA;
    stroke: rgba(255, 91, 53, .46);
  }

  .place-crate text,
  .conveyor-multiplier text {
    fill: #173B52;
    font: 900 17px/1 'JetBrains Mono', monospace;
    text-anchor: middle;
  }

  .place-crate .place-power {
    fill: #82919A;
    font-size: 9px;
  }

  .conveyor-multiplier {
    transform: translateX(0);
    transition: transform .85s cubic-bezier(.16, 1, .3, 1);
  }

  .conveyor-multiplier rect {
    fill: #FF5B35;
  }

  .conveyor-multiplier text {
    fill: #FFFFFF;
    font-size: 13px;
  }

  .place-conveyor-svg.multiplier-docked .conveyor-multiplier {
    transform: translateX(388px);
  }

  .carry-capsule-svg {
    position: absolute;
    top: 34px;
    width: min(420px, 80%);
    height: 92px;
    pointer-events: none;
  }

  .carry-transfer {
    opacity: .14;
    transition: opacity .4s ease;
  }

  .carry-transfer.transfer-visible {
    opacity: 1;
  }

  .carry-transfer > path {
    fill: none;
    stroke: #FF5B35;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 7 6;
  }

  .carry-capsule rect {
    fill: #FF5B35;
  }

  .carry-capsule text {
    fill: #FFFFFF;
    font: 900 12px/1 'JetBrains Mono', monospace;
    text-anchor: middle;
  }

  .carry-station {
    fill: #E4F5F6;
    stroke: #168FA3;
    stroke-width: 2;
  }

  .zero-checkpoint-svg {
    height: 108px;
    grid-column: 1 / -1;
    margin-bottom: -4px;
  }

  .zero-sensor rect {
    fill: #FFF4D8;
    stroke: rgba(169, 111, 19, .42);
    stroke-width: 2;
  }

  .zero-sensor text,
  .checkpoint-carry text,
  .checkpoint-output text {
    fill: #173B52;
    font: 900 15px/1 'JetBrains Mono', monospace;
    text-anchor: middle;
  }

  .zero-sensor-result {
    fill: #A96F13 !important;
    font-size: 17px !important;
  }

  .checkpoint-carry {
    transform: translateX(0);
    transition: transform .78s cubic-bezier(.16, 1, .3, 1);
  }

  .checkpoint-carry rect {
    fill: #FF5B35;
  }

  .checkpoint-carry text {
    fill: #FFFFFF;
    font-size: 12px;
  }

  .zero-checkpoint-svg.accepts-carry .checkpoint-carry {
    transform: translateX(180px);
  }

  .checkpoint-arrow {
    fill: none;
    stroke: #FF5B35;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: .22;
    transition: opacity .35s ease;
  }

  .checkpoint-output {
    opacity: .18;
    transform: scale(.85);
    transform-origin: 503px 54px;
    transition: opacity .4s ease, transform .5s cubic-bezier(.16, 1, .3, 1);
  }

  .checkpoint-output circle {
    fill: #E7F4EC;
    stroke: rgba(36, 117, 83, .42);
    stroke-width: 2;
  }

  .checkpoint-output text {
    fill: #247553;
    font-size: 20px;
  }

  .zero-checkpoint-svg.checkpoint-done .checkpoint-arrow,
  .zero-checkpoint-svg.checkpoint-done .checkpoint-output {
    opacity: 1;
    transform: scale(1);
  }

  .question-card,
  .place-model,
  .expanded-model,
  .column-placement,
  .carry-model,
  .exchange-model,
  .zero-carry-model,
  .strategy-model,
  .construction-board,
  .digit-task,
  .matching-board,
  .warehouse-scene,
  .summary-correction {
    padding: 17px 19px;
    border-radius: 22px;
    background: ${T.paper};
    box-shadow: 0 18px 42px -31px rgba(${T.shadowBase}, .56);
  }

  .question-card h2 {
    font: 750 clamp(18px, 2.6vw, 25px)/1.28 'Source Serif 4', Georgia, serif;
  }

  .options {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
    background: #F8F8F4;
    color: ${T.ink};
    text-align: left;
    font: 750 13px/1.35 Manrope, sans-serif;
    cursor: pointer;
    box-shadow: inset 0 0 0 1px rgba(135, 148, 157, .17), 0 8px 17px -14px rgba(${T.shadowBase}, .35);
    transition: transform .2s ease, background .2s ease, opacity .2s ease;
  }

  .option:hover:not(:disabled),
  .option-picked {
    transform: translateY(-2px);
    background: ${T.accentSoft};
  }

  .option b {
    width: 32px;
    height: 32px;
    flex: none;
    border-radius: 10px;
    display: grid;
    place-items: center;
    background: ${T.paper};
    color: ${T.cyan};
    font: 900 12px/1 'JetBrains Mono', monospace;
  }

  .option-correct {
    background: ${T.successSoft};
    box-shadow: inset 0 0 0 2px rgba(34, 122, 83, .28);
  }

  .option-correct b {
    background: ${T.success};
    color: white;
  }

  .option-wrong {
    background: ${T.warnSoft};
    box-shadow: inset 0 0 0 2px rgba(169, 111, 19, .25);
  }

  .optional-content {
    margin-top: 12px;
  }

  .optional-label {
    display: inline-block;
    color: ${T.ink3};
    font-size: 9px;
    font-weight: 900;
    letter-spacing: .10em;
  }

  .feedback-block {
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

  .feedback-visible {
    max-height: 180px;
    margin-top: 12px;
    padding: 11px 14px;
    opacity: 1;
    transform: translateY(0);
  }

  .feedback-block > span {
    width: 34px;
    height: 34px;
    border-radius: 11px;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, .72);
    font-weight: 950;
  }

  .feedback-block p {
    color: ${T.ink2};
    font-size: 13px;
    line-height: 1.45;
  }

  .feedback-correct {
    background: ${T.successSoft};
    box-shadow: inset 4px 0 ${T.success};
  }

  .feedback-correct > span {
    color: ${T.success};
  }

  .feedback-wrong {
    background: ${T.warnSoft};
    box-shadow: inset 4px 0 ${T.warn};
  }

  .feedback-wrong > span {
    color: ${T.warn};
  }

  .audio-caption {
    position: sticky;
    bottom: 4px;
    z-index: 4;
    width: fit-content;
    max-width: min(680px, 100%);
    margin: 13px auto 0;
    padding: 9px 13px;
    border-radius: 12px;
    background: rgba(23, 59, 82, .94);
    color: white;
    text-align: center;
    font-size: 12px;
    line-height: 1.4;
    box-shadow: 0 12px 28px -18px rgba(23, 59, 82, .8);
  }

  .hook-scene {
    min-height: 238px;
    padding: 22px;
    border-radius: 26px;
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(200px, .85fr) minmax(320px, 1.55fr) 100px;
    align-items: center;
    gap: 18px;
    color: white;
    background:
      linear-gradient(rgba(255, 255, 255, .025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, .025) 1px, transparent 1px),
      ${T.navy};
    background-size: 25px 25px;
    box-shadow: 0 24px 58px -35px rgba(23, 59, 82, .80);
  }

  .hook-copy {
    position: relative;
    z-index: 2;
  }

  .hook-copy > span {
    color: #7DE1EE;
  }

  .hook-copy strong {
    display: block;
    font: 950 clamp(25px, 4vw, 40px)/1 'JetBrains Mono', monospace;
  }

  .hook-copy p {
    margin-top: 12px;
    color: rgba(255, 255, 255, .76);
    font-size: 13px;
    line-height: 1.45;
  }

  .hook-scene > .g1-char {
    width: 90px;
    height: 113px;
    z-index: 2;
  }

  .box-groups {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    transition: transform .6s cubic-bezier(.16, 1, .3, 1);
  }

  .box-groups.beat-2,
  .box-groups.beat-3 {
    transform: scale(.92) translateX(-5px);
  }

  .detail-box {
    min-width: 0;
    aspect-ratio: 1.15;
    padding: 12px;
    border-radius: 17px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    background: rgba(255, 255, 255, .09);
    box-shadow: inset 0 0 0 1px rgba(125, 225, 238, .18);
    animation: boxJoin .65s cubic-bezier(.16, 1, .3, 1) both;
    animation-delay: var(--box-delay);
  }

  .detail-box i {
    min-height: 20px;
    border-radius: 6px;
    background: linear-gradient(145deg, ${T.cyan}, #5BD6F2);
  }

  .detail-box b {
    grid-column: 1 / -1;
    color: white;
    text-align: center;
    font: 850 12px/1 'JetBrains Mono', monospace;
  }

  .hook-estimate {
    position: absolute;
    left: 39%;
    right: 17%;
    bottom: 14px;
    display: flex;
    align-items: center;
    gap: 9px;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity .45s ease, transform .45s ease;
  }

  .hook-estimate.estimate-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hook-estimate span {
    color: #BDEEF3;
    font: 800 10px/1 'JetBrains Mono', monospace;
  }

  .hook-estimate i {
    height: 4px;
    flex: 1;
    border-radius: 9px;
    background: linear-gradient(90deg, ${T.warn}, ${T.lime});
  }

  .place-model {
    display: grid;
    justify-items: center;
    gap: 10px;
  }

  .source-number,
  .expanded-source,
  .construction-formula,
  .active-equation,
  .strategy-source,
  .compact-proof,
  .error-equation {
    color: ${T.navy};
    font: 900 clamp(20px, 3vw, 29px)/1.2 'JetBrains Mono', monospace;
  }

  .split-arrow {
    color: ${T.accent};
    font-size: 25px;
    opacity: .25;
    transition: opacity .4s ease, transform .4s ease;
  }

  .split-arrow.revealed {
    opacity: 1;
    transform: translateY(3px);
  }

  .place-cards {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 9px;
  }

  .place-cards > div {
    min-height: 75px;
    padding: 10px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 5px;
    opacity: 0;
    transform: translateY(-12px);
    background: ${T.cyanSoft};
    transition: opacity .48s ease, transform .58s cubic-bezier(.16, 1, .3, 1);
    transition-delay: var(--reveal-delay);
  }

  .place-cards.revealed > div {
    opacity: 1;
    transform: translateY(0);
  }

  .place-cards strong {
    color: ${T.navy};
    font: 900 19px/1 'JetBrains Mono', monospace;
  }

  .place-cards span {
    color: ${T.ink2};
    font-size: 10px;
    font-weight: 850;
  }

  .place-cards .zero-card {
    background: ${T.warnSoft};
    box-shadow: inset 0 0 0 2px rgba(169, 111, 19, .18);
  }

  .expanded-model {
    display: grid;
    gap: 14px;
  }

  .expanded-source {
    text-align: center;
    font-size: clamp(18px, 2.8vw, 26px);
  }

  .expanded-parts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .expanded-part {
    min-height: 118px;
    padding: 11px 7px;
    border-radius: 16px;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 9px;
    opacity: .34;
    background: #F8F8F4;
    transition: opacity .4s ease, transform .4s ease, background .4s ease;
  }

  .expanded-part.revealed {
    opacity: 1;
  }

  .expanded-part.active {
    transform: translateY(-5px);
    background: ${T.cyanSoft};
    box-shadow: 0 12px 24px -19px rgba(22, 143, 163, .75);
  }

  .expanded-part > span,
  .expanded-part > strong {
    font: 850 12px/1.2 'JetBrains Mono', monospace;
  }

  .expanded-part > strong {
    color: ${T.success};
    font-size: 17px;
  }

  .triplicate {
    display: flex;
    gap: 4px;
  }

  .triplicate i {
    width: 22px;
    height: 16px;
    border-radius: 5px;
    background: ${T.cyan};
    opacity: .74;
  }

  .expanded-sum {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 13px;
    padding: 12px;
    border-radius: 15px;
    opacity: 0;
    transform: translateY(10px);
    background: ${T.successSoft};
    transition: opacity .52s ease, transform .52s ease;
  }

  .expanded-sum.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .expanded-sum span,
  .expanded-sum strong {
    font: 900 16px/1.2 'JetBrains Mono', monospace;
  }

  .expanded-sum strong {
    color: ${T.success};
  }

  .key-idea {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 15px;
    border-radius: 16px;
    background: ${T.cyanSoft};
    box-shadow: inset 4px 0 ${T.cyan};
  }

  .key-idea > span {
    min-width: 72px;
    color: ${T.cyan};
    font: 950 18px/1 'JetBrains Mono', monospace;
  }

  .key-idea p {
    color: ${T.ink2};
    font-size: 13px;
    line-height: 1.4;
  }

  .column-placement {
    position: relative;
    min-height: 276px;
    display: grid;
    justify-content: center;
    align-content: center;
  }

  .place-headings,
  .column-number {
    width: min(420px, 100%);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .place-headings span {
    padding-bottom: 6px;
    color: ${T.ink3};
    text-align: center;
    font-size: 9px;
    font-weight: 850;
  }

  .column-number span {
    height: 54px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: ${T.cyanSoft};
    color: ${T.navy};
    font: 950 25px/1 'JetBrains Mono', monospace;
    box-shadow: inset 0 0 0 1px rgba(22, 143, 163, .12);
  }

  .falling-multiplier {
    position: absolute;
    left: 50%;
    top: 126px;
    width: min(420px, calc(100% - 40px));
    color: ${T.accent};
    text-align: right;
    padding-right: 4%;
    font: 900 21px/1 'JetBrains Mono', monospace;
    opacity: .35;
    transform: translateY(-10px);
    transition: opacity .55s ease, transform .72s cubic-bezier(.16, 1, .3, 1);
  }

  .falling-multiplier.placed {
    top: 218px;
    opacity: 1;
    transform: translate(-50%, 0);
  }

  .start-marker {
    position: absolute;
    right: 23%;
    bottom: 4px;
    color: ${T.cyan};
    font-size: 10px;
    font-weight: 850;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity .4s ease, transform .4s ease;
  }

  .start-marker.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .carry-model {
    min-height: 275px;
    position: relative;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 12px;
    overflow: hidden;
  }

  .carry-grid {
    width: min(420px, 88%);
    display: grid;
    gap: 5px;
  }

  .carry-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
  }

  .carry-row span {
    min-height: 42px;
    display: grid;
    place-items: center;
    border-radius: 11px;
    font: 950 24px/1 'JetBrains Mono', monospace;
    transition: background .22s ease, transform .22s ease, opacity .3s ease;
  }

  .carry-tokens span {
    min-height: 27px;
    opacity: 0;
    color: ${T.accent};
    font-size: 15px;
  }

  .carry-tokens span.shown,
  .result-row span.shown {
    opacity: 1;
    animation: resultDrop .42s cubic-bezier(.16, 1, .3, 1) both;
  }

  .top-number {
    grid-template-columns: 1fr repeat(4, 1fr);
  }

  .top-number span:first-child {
    grid-column: 2;
  }

  .top-number .active-place {
    background: ${T.cyan};
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 10px 18px -13px rgba(22, 143, 163, .85);
  }

  .multiplier-row {
    color: ${T.accent};
  }

  .multiplier-row i {
    grid-column: 1;
    text-align: center;
    font: 950 20px/1 'JetBrains Mono', monospace;
  }

  .multiplier-row span:last-child {
    grid-column: 5;
    font-size: 22px;
  }

  .carry-rule {
    height: 3px;
    border-radius: 9px;
    background: ${T.navy};
  }

  .result-row span {
    opacity: .13;
    color: ${T.success};
  }

  .carry-path {
    position: absolute;
    top: 36px;
    width: min(420px, 80%);
    height: 86px;
    overflow: visible;
    pointer-events: none;
  }

  .carry-path path {
    fill: none;
    stroke: ${T.accent};
    stroke-width: 2.5;
    stroke-linecap: round;
    opacity: .24;
    stroke-dasharray: 7 7;
  }

  .active-equation {
    min-height: 42px;
    padding: 10px 14px;
    border-radius: 13px;
    background: ${T.accentSoft};
    color: ${T.navy};
    font-size: 15px;
    animation: equationIn .42s ease both;
  }

  .exchange-model {
    min-height: 235px;
    display: grid;
    grid-template-columns: 1fr 48px 1fr;
    align-items: center;
    gap: 14px;
    overflow: hidden;
  }

  .unit-cloud {
    min-height: 145px;
    display: grid;
    grid-template-columns: repeat(6, 16px);
    place-content: center;
    gap: 5px;
  }

  .unit-cloud i {
    width: 16px;
    height: 16px;
    border-radius: 5px;
    background: ${T.cyan};
    opacity: .82;
    transition: opacity .42s ease, transform .62s cubic-bezier(.16, 1, .3, 1);
  }

  .exchange-model.exchanged .unit-cloud i:nth-child(-n+20) {
    opacity: 0;
    transform: translateX(150px) scale(.35);
  }

  .exchange-arrow {
    color: ${T.accent};
    text-align: center;
    font-size: 28px;
  }

  .exchange-result {
    display: grid;
    justify-items: center;
    gap: 10px;
    opacity: .22;
    transition: opacity .55s ease;
  }

  .exchanged .exchange-result {
    opacity: 1;
  }

  .ten-rods,
  .single-units {
    display: flex;
    gap: 8px;
  }

  .ten-rods span {
    width: 25px;
    height: 88px;
    border-radius: 8px;
    background: linear-gradient(${T.cyan}, #5BD6F2);
  }

  .single-units i {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    background: ${T.accent};
  }

  .exchange-result strong {
    color: ${T.ink2};
    font-size: 11px;
  }

  .exchange-total {
    grid-column: 1 / -1;
    justify-self: center;
    padding: 9px 14px;
    border-radius: 12px;
    opacity: 0;
    background: ${T.successSoft};
    color: ${T.success};
    font: 900 18px/1 'JetBrains Mono', monospace;
    transition: opacity .5s ease, transform .5s ease;
    transform: translateY(8px);
  }

  .exchange-total.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .zero-carry-model {
    min-height: 330px;
    position: relative;
    display: grid;
    grid-template-columns: .9fr 1.25fr;
    align-items: center;
    gap: 20px;
    overflow: hidden;
  }

  .mini-column {
    justify-self: center;
    display: grid;
    gap: 9px;
  }

  .mini-column > div:first-child {
    display: grid;
    grid-template-columns: repeat(4, 45px);
  }

  .mini-column span {
    height: 52px;
    display: grid;
    place-items: center;
    border-radius: 11px;
    background: ${T.cyanSoft};
    font: 950 23px/1 'JetBrains Mono', monospace;
  }

  .mini-column .zero-place {
    background: ${T.warnSoft};
    color: ${T.warn};
    box-shadow: inset 0 0 0 2px rgba(169, 111, 19, .22);
  }

  .mini-multiplier {
    color: ${T.accent};
    text-align: right;
    font: 900 21px/1 'JetBrains Mono', monospace;
  }

  .zero-equation {
    padding: 17px;
    border-radius: 17px;
    opacity: .22;
    background: #F8F8F4;
    color: ${T.navy};
    font: 900 clamp(19px, 3vw, 28px)/1.2 'JetBrains Mono', monospace;
    transition: opacity .45s ease;
  }

  .zero-equation.revealed {
    opacity: 1;
  }

  .zero-equation b,
  .zero-equation strong {
    opacity: .13;
    transition: opacity .45s ease, color .45s ease;
  }

  .zero-equation .shown {
    opacity: 1;
  }

  .zero-equation strong {
    color: ${T.success};
  }

  .carry-three {
    position: absolute;
    left: 34%;
    top: 28px;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    opacity: 0;
    background: ${T.accent};
    color: white;
    font: 950 17px/1 'JetBrains Mono', monospace;
  }

  .carry-three.travelling {
    opacity: 1;
    animation: carryTravel .72s cubic-bezier(.16, 1, .3, 1) both;
  }

  .zero-final {
    grid-column: 1 / -1;
    justify-self: center;
    padding: 9px 14px;
    border-radius: 12px;
    opacity: 0;
    background: ${T.successSoft};
    color: ${T.success};
    font: 900 17px/1 'JetBrains Mono', monospace;
    transform: translateY(9px);
    transition: opacity .45s ease, transform .45s ease;
  }

  .zero-final.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .strategy-model {
    min-height: 225px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 15px;
  }

  .strategy-source {
    grid-column: 1 / -1;
    text-align: center;
  }

  .strategy-bridge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 17px;
    border-radius: 16px;
    background: ${T.cyanSoft};
    font: 900 17px/1 'JetBrains Mono', monospace;
  }

  .strategy-bridge i {
    color: ${T.accent};
    font-style: normal;
  }

  .strategy-proof {
    display: grid;
    justify-items: center;
    gap: 7px;
    padding: 14px;
    border-radius: 16px;
    opacity: .18;
    background: ${T.successSoft};
    font: 850 14px/1.2 'JetBrains Mono', monospace;
    transition: opacity .52s ease, transform .52s ease;
    transform: translateX(-10px);
  }

  .strategy-proof.revealed {
    opacity: 1;
    transform: translateX(0);
  }

  .strategy-proof strong {
    color: ${T.success};
    font-size: 20px;
  }

  .estimate-band {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 9px;
    opacity: 0;
    transition: opacity .45s ease;
  }

  .estimate-band.revealed {
    opacity: 1;
  }

  .estimate-band i {
    height: 5px;
    flex: 1;
    border-radius: 9px;
    background: linear-gradient(90deg, ${T.cyan}, ${T.lime});
  }

  .estimate-band b,
  .estimate-band span {
    font: 850 11px/1 'JetBrains Mono', monospace;
  }

  .compact-proof,
  .error-equation {
    min-height: 78px;
    padding: 14px 18px;
    border-radius: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 13px;
    background: ${T.cyanSoft};
    font-size: clamp(17px, 2.7vw, 25px);
  }

  .compact-proof i,
  .error-equation i {
    color: ${T.accent};
    font-style: normal;
  }

  .error-equation {
    background: ${T.warnSoft};
  }

  .error-equation strong b {
    min-width: 43px;
    min-height: 48px;
    border-radius: 11px;
    display: inline-grid;
    place-items: center;
    background: white;
    color: ${T.warn};
  }

  .construction-board {
    display: grid;
    gap: 15px;
  }

  .construction-formula {
    text-align: center;
    font-size: clamp(15px, 2.5vw, 22px);
  }

  .construction-slots {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 9px;
  }

  .construction-slot {
    min-height: 82px;
    padding: 9px;
    border: 0;
    border-radius: 15px;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 8px;
    background: #F8F8F4;
    color: ${T.ink};
    cursor: pointer;
    box-shadow: inset 0 0 0 2px rgba(22, 143, 163, .13);
  }

  .construction-slot small {
    color: ${T.ink3};
    font: 800 9px/1.2 'JetBrains Mono', monospace;
  }

  .construction-slot strong {
    font: 900 17px/1 'JetBrains Mono', monospace;
  }

  .construction-slot.filled {
    background: ${T.cyanSoft};
  }

  .construction-slot.slot-wrong {
    background: ${T.warnSoft};
    animation: shake .38s ease both;
  }

  .card-bank {
    min-height: 66px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 10px;
    border-radius: 15px;
    background: ${T.accentSoft};
  }

  .math-card {
    min-width: 84px;
    min-height: 46px;
    padding: 8px 12px;
    border: 0;
    border-radius: 12px;
    background: white;
    color: ${T.navy};
    font: 900 14px/1 'JetBrains Mono', monospace;
    cursor: pointer;
    box-shadow: 0 8px 18px -14px rgba(${T.shadowBase}, .5);
  }

  .math-card.selected {
    background: ${T.accent};
    color: white;
    transform: translateY(-3px);
  }

  .construction-total {
    min-height: 44px;
    display: grid;
    place-items: center;
    border-radius: 13px;
    opacity: .16;
    background: ${T.successSoft};
    color: ${T.success};
    font: 900 16px/1 'JetBrains Mono', monospace;
    transition: opacity .45s ease;
  }

  .construction-total.revealed {
    opacity: 1;
  }

  .digit-task {
    display: grid;
    justify-items: center;
    gap: 12px;
  }

  .digit-column {
    width: 185px;
    display: grid;
    justify-items: end;
    gap: 5px;
    color: ${T.navy};
    font: 950 25px/1.15 'JetBrains Mono', monospace;
  }

  .digit-column i {
    width: 100%;
    height: 3px;
    border-radius: 9px;
    background: ${T.navy};
  }

  .direction-hint {
    color: ${T.ink3};
    text-align: center;
    font-size: 11px;
  }

  .digit-slots {
    display: flex;
    gap: 8px;
  }

  .digit-slots button {
    width: 54px;
    height: 58px;
    border: 0;
    border-radius: 13px;
    background: #F8F8F4;
    color: ${T.ink3};
    font: 950 24px/1 'JetBrains Mono', monospace;
    cursor: pointer;
    box-shadow: inset 0 0 0 2px rgba(135, 148, 157, .16);
  }

  .digit-slots button.active {
    background: ${T.cyanSoft};
    color: ${T.cyan};
    box-shadow: inset 0 0 0 3px rgba(22, 143, 163, .34), 0 0 0 5px rgba(22, 143, 163, .08);
  }

  .digit-slots button.locked {
    opacity: 1;
    background: ${T.successSoft};
    color: ${T.success};
  }

  .digit-slots button.wrong {
    background: ${T.warnSoft};
    color: ${T.warn};
    animation: shake .38s ease both;
  }

  .keypad {
    width: min(490px, 100%);
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 7px;
  }

  .keypad button {
    min-height: 46px;
    border: 0;
    border-radius: 12px;
    background: ${T.paper};
    color: ${T.navy};
    font: 900 16px/1 'JetBrains Mono', monospace;
    cursor: pointer;
    box-shadow: 0 8px 17px -14px rgba(${T.shadowBase}, .52), inset 0 0 0 1px rgba(135, 148, 157, .15);
  }

  .matching-board {
    display: grid;
    grid-template-columns: 1fr 42px 1fr;
    align-items: center;
    gap: 10px;
  }

  .matching-column {
    display: grid;
    gap: 9px;
  }

  .matching-column button {
    min-height: 61px;
    padding: 9px 12px;
    border: 0;
    border-radius: 14px;
    display: grid;
    align-content: center;
    gap: 5px;
    background: #F8F8F4;
    color: ${T.navy};
    text-align: left;
    font: 850 12px/1.3 'JetBrains Mono', monospace;
    cursor: pointer;
    box-shadow: inset 0 0 0 1px rgba(135, 148, 157, .15);
  }

  .matching-column button.selected {
    background: ${T.accentSoft};
    box-shadow: inset 0 0 0 2px rgba(255, 91, 53, .27);
  }

  .matching-column button.matched {
    opacity: 1;
    background: ${T.successSoft};
    color: ${T.success};
  }

  .matching-column button.wrong {
    background: ${T.warnSoft};
    animation: shake .38s ease both;
  }

  .matching-column button b {
    color: ${T.success};
    font-size: 10px;
  }

  .matching-arrow {
    color: ${T.cyan};
    text-align: center;
    font-size: 26px;
  }

  .right-column button {
    text-align: center;
    font-size: 15px;
  }

  .warehouse-scene {
    display: grid;
    gap: 12px;
    background: linear-gradient(145deg, ${T.cyanSoft}, ${T.paper});
  }

  .warehouse-boxes {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
  }

  .warehouse-boxes span {
    min-height: 66px;
    display: grid;
    place-items: center;
    border-radius: 12px 12px 7px 7px;
    background: ${T.navy};
    color: white;
    font: 800 10px/1 'JetBrains Mono', monospace;
    box-shadow: inset 0 7px rgba(255, 255, 255, .07);
    animation: boxJoin .55s cubic-bezier(.16, 1, .3, 1) both;
  }

  .warehouse-estimate {
    justify-self: center;
    padding: 9px 14px;
    border-radius: 12px;
    background: white;
    color: ${T.cyan};
    font: 900 16px/1 'JetBrains Mono', monospace;
  }

  .input-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    margin-top: 14px;
  }

  .answer-input {
    min-height: 54px;
    padding: 10px 15px;
    border: 0;
    border-radius: 14px;
    outline: 0;
    background: #F8F8F4;
    color: ${T.ink};
    font: 900 24px/1 'JetBrains Mono', monospace;
    box-shadow: inset 0 0 0 1px rgba(135, 148, 157, .18);
  }

  .answer-input:focus {
    box-shadow: 0 0 0 3px rgba(22, 143, 163, .24);
  }

  .input-correct {
    background: ${T.successSoft};
    color: ${T.success};
  }

  .input-wrong {
    background: ${T.warnSoft};
    color: ${T.warn};
  }

  .summary-screen {
    padding-bottom: 5px;
  }

  .finale-heading {
    padding: 12px 16px;
    display: grid;
    gap: 4px;
    border-left: 5px solid ${T.accent};
    border-radius: 0 17px 17px 0;
    background: rgba(255, 255, 255, .78);
    box-shadow: 0 8px 22px rgba(${T.shadowBase}, .12);
  }

  .finale-heading > span {
    color: ${T.accent};
    font-size: 9px;
    font-weight: 900;
    letter-spacing: .11em;
  }

  .finale-heading h1 {
    margin: 0;
    color: ${T.ink};
    font: 800 clamp(21px, 3.3vw, 29px)/1.08 'Source Serif 4', Georgia, serif;
  }

  .finale-heading p {
    margin: 0;
    color: ${T.ink2};
    font-size: 11px;
    font-weight: 750;
    line-height: 1.35;
  }

  .finale-main-grid {
    display: grid;
    grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
    gap: 12px;
    align-items: stretch;
  }

  .finale-payoff-card,
  .finale-mastery-card {
    min-width: 0;
    padding: 14px;
    border-radius: 19px;
    background: rgba(255, 255, 255, .74);
    box-shadow: 0 8px 22px rgba(${T.shadowBase}, .12);
  }

  .finale-payoff-card {
    display: grid;
    align-content: center;
    gap: 8px;
  }

  .finale-section-kicker {
    color: ${T.cyan};
    font-size: 9px;
    font-weight: 900;
    letter-spacing: .1em;
  }

  .summary-correction {
    min-height: 112px;
    display: grid;
    grid-template-columns: .72fr 1.55fr .7fr;
    align-items: center;
    gap: 14px;
  }

  .summary-wrong {
    display: grid;
    justify-items: center;
    gap: 6px;
    color: ${T.warn};
  }

  .summary-wrong small {
    color: ${T.ink3};
    font-size: 9px;
  }

  .summary-wrong span,
  .summary-answer {
    font: 950 24px/1 'JetBrains Mono', monospace;
  }

  .summary-wrong span {
    text-decoration: line-through;
    text-decoration-thickness: 3px;
  }

  .summary-parts {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
    opacity: .22;
    transition: opacity .62s ease;
  }

  .summary-parts.corrected {
    opacity: 1;
  }

  .summary-parts span {
    padding: 8px 10px;
    border-radius: 10px;
    background: ${T.cyanSoft};
    color: ${T.navy};
    font: 850 12px/1 'JetBrains Mono', monospace;
  }

  .summary-parts i {
    color: ${T.accent};
    font-style: normal;
    font-weight: 950;
  }

  .summary-answer {
    opacity: 0;
    color: ${T.success};
    transform: translateY(-10px);
    transition: opacity .42s ease, transform .42s ease;
  }

  .summary-answer.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .finale-payoff-copy {
    margin: 0;
    color: ${T.ink2};
    font-size: 10px;
    font-weight: 800;
    line-height: 1.35;
  }

  .rule-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 7px;
    margin-top: 9px;
  }

  .rule-grid > div {
    min-height: 54px;
    padding: 8px 9px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: ${T.paper};
    box-shadow: 0 12px 28px -22px rgba(${T.shadowBase}, .52);
    transition: background .25s ease, transform .25s ease;
  }

  .rule-grid > div.active {
    transform: translateY(-3px);
    background: ${T.cyanSoft};
  }

  .rule-grid b {
    width: 32px;
    height: 32px;
    flex: none;
    border-radius: 10px;
    display: grid;
    place-items: center;
    background: ${T.navy};
    color: white;
    font: 900 12px/1 'JetBrains Mono', monospace;
  }

  .rule-grid span {
    color: ${T.ink2};
    font-size: 10px;
    font-weight: 800;
  }

  .finale-reward {
    position: relative;
    min-height: 128px;
    padding: 10px 22px;
    display: grid;
    grid-template-columns: 82px 106px minmax(0, 1fr);
    align-items: center;
    gap: 15px;
    border-radius: 22px;
    color: white;
    background: ${T.navy};
    opacity: .52;
    overflow: hidden;
    transform: translateY(7px);
    transition: opacity .5s ease, transform .5s ease;
  }

  .finale-reward-ready { opacity: 1; transform: none; }

  .finale-medal {
    z-index: 1;
    display: grid;
    justify-items: center;
    gap: 6px;
    color: white;
    font-size: 7px;
    font-weight: 900;
    letter-spacing: .08em;
  }

  .finale-medal i {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: #704800;
    background: radial-gradient(circle at 35% 28%, #FFF0A0, #FFC23C 57%, #D69300);
    box-shadow: 0 0 0 7px rgba(255, 194, 60, .12), 0 12px 24px rgba(0, 0, 0, .22);
    font-size: 29px;
    font-style: normal;
  }

  .finale-reward:not(.finale-reward-ready) .finale-medal i {
    color: #B7C3CA;
    background: radial-gradient(circle at 35% 28%, #F5F7F8, #B9C5CB 68%, #87949D);
    box-shadow: 0 0 0 7px rgba(255, 255, 255, .07);
  }

  .finale-bit { z-index: 1; height: 112px; }
  .finale-bit .g1-char { width: 100%; height: 100%; }
  .finale-reward-copy { z-index: 1; min-width: 0; display: grid; gap: 5px; }
  .finale-reward-copy > span { color: #9DEBF7; font-size: 9px; font-weight: 900; letter-spacing: .1em; }
  .finale-reward-copy > strong { font: 800 clamp(18px, 2.4vw, 25px)/1.08 'Source Serif 4', Georgia, serif; }
  .finale-reward-copy > small { color: rgba(255, 255, 255, .7); font-size: 10px; font-weight: 800; }
  .finale-status { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 8px; }
  .finale-status > b { color: #FFC23C; font: 900 20px/1 'JetBrains Mono', monospace; }
  .finale-status > span { display: grid; gap: 2px; color: white; font-size: 9px; font-weight: 850; }
  .finale-status small { color: rgba(255, 255, 255, .68); font-size: 8px; }
  .finale-confetti { position: absolute; inset: 0; pointer-events: none; }
  .finale-confetti i { position: absolute; width: 6px; height: 10px; border-radius: 2px; background: ${T.accent}; animation: d9FinaleConfetti 1.2s cubic-bezier(.16, 1, .3, 1) both; }
  .finale-confetti i:nth-child(1) { left: 8%; top: 12%; rotate: 17deg; }
  .finale-confetti i:nth-child(2) { left: 22%; top: 72%; background: #FFC23C; rotate: -24deg; }
  .finale-confetti i:nth-child(3) { left: 38%; top: 18%; background: #9DEBF7; rotate: 35deg; }
  .finale-confetti i:nth-child(4) { left: 51%; top: 76%; background: ${T.lime}; rotate: -12deg; }
  .finale-confetti i:nth-child(5) { left: 66%; top: 13%; background: #FFC23C; rotate: 28deg; }
  .finale-confetti i:nth-child(6) { left: 78%; top: 70%; background: #9DEBF7; rotate: -30deg; }
  .finale-confetti i:nth-child(7) { left: 89%; top: 20%; background: ${T.lime}; rotate: 12deg; }
  .finale-confetti i:nth-child(8) { left: 95%; top: 67%; rotate: -18deg; }

  .next-bridge {
    padding: 12px 16px;
    border-radius: 16px;
    display: grid;
    gap: 3px;
    background: ${T.navy};
    color: white;
  }

  .next-bridge > span {
    color: #7DE1EE;
    font-size: 8px;
    font-weight: 900;
    letter-spacing: .1em;
  }

  .next-bridge strong {
    font: 750 16px/1.3 'Source Serif 4', Georgia, serif;
  }

  .g1-char-bit {
    overflow: visible;
    filter: drop-shadow(0 6px 12px rgba(58, 53, 48, .22));
  }

  .g1-eyes {
    transform-box: fill-box;
    transform-origin: center;
    animation: g4blink 4.4s infinite;
  }

  .g1-bit-ant {
    transform-box: fill-box;
    transform-origin: bottom center;
    animation: g4antbob 2.2s ease-in-out infinite;
  }

  .g1-bit-wave,
  .bit-wave-left,
  .bit-wave-right,
  .bit-think-hand,
  .bit-point-arm,
  .bit-idea-bulb,
  .bit-focus-hands,
  .bit-focus-scan,
  .bit-nod-hand,
  .bit-nod-check {
    transform-box: fill-box;
    transform-origin: center;
  }

  .g1-bit-wave { animation: g4wavebig 1s ease-in-out infinite; }
  .bit-double-wave .bit-wave-left { transform-origin: bottom right; animation: bitWaveLeft 1.05s ease-in-out infinite; }
  .bit-double-wave .bit-wave-right { transform-origin: bottom left; animation: bitWaveRight 1.05s ease-in-out infinite; }
  .bit-think-hand { animation: bitThinkTap 1.8s ease-in-out infinite; }
  .bit-nod-hand { animation: bitNodHand 1.35s ease-in-out infinite; }
  .bit-nod-check { animation: bitCheck 1.35s ease-in-out infinite; }

  button:focus-visible,
  input:focus-visible {
    outline: 3px solid rgba(22, 143, 163, .42);
    outline-offset: 3px;
  }

  @keyframes boxJoin {
    from { opacity: 0; transform: translateY(11px) scale(.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes resultDrop {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes equationIn {
    from { opacity: .35; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes carryTravel {
    from { transform: translate(0, 0) scale(.75); }
    to { transform: translate(130px, 76px) scale(1); }
  }
  @keyframes shake {
    25% { transform: translateX(-4px); }
    50% { transform: translateX(4px); }
    75% { transform: translateX(-2px); }
  }
  @keyframes g4blink {
    0%, 93%, 100% { transform: scaleY(1); }
    96.5% { transform: scaleY(.12); }
  }

  @keyframes d9FinaleConfetti {
    from { opacity: 0; translate: 0 -14px; rotate: 0deg; }
    to { opacity: .82; }
  }
  @keyframes g4antbob {
    0%, 100% { transform: rotate(-10deg); }
    50% { transform: rotate(10deg); }
  }
  @keyframes g4wavebig {
    0%, 100% { transform: rotate(2deg); }
    50% { transform: rotate(-26deg); }
  }
  @keyframes bitWaveLeft {
    0%, 100% { transform: rotate(2deg); }
    50% { transform: rotate(25deg); }
  }
  @keyframes bitWaveRight {
    0%, 100% { transform: rotate(-2deg); }
    50% { transform: rotate(-25deg); }
  }
  @keyframes bitThinkTap {
    0%, 100% { transform: translate(0) rotate(0); }
    50% { transform: translate(-2px, -3px) rotate(-7deg); }
  }
  @keyframes bitNodHand {
    0%, 100% { transform: rotate(0); }
    48% { transform: rotate(-11deg); }
  }
  @keyframes bitCheck {
    0%, 100% { transform: scale(.86); opacity: .72; }
    50% { transform: scale(1.08); opacity: 1; }
  }

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
    box-shadow: 0 8px 20px -14px rgba(58,53,48,.6);
  }

  .preview-language button {
    padding: 4px 9px;
    border: 0;
    border-radius: 999px;
    color: #50616D;
    background: transparent;
    cursor: pointer;
    font-size: 10px;
    font-weight: 900;
  }

  .preview-language .preview-active {
    color: #FFFFFF;
    background: #FF5B35;
  }

  @media (max-height: 780px) {
    .stage-content { padding-top: 8px; padding-bottom: 6px; }
    .stage-nav { min-height: 58px; padding-block: 6px; }
    .screen-stack { gap: 8px; }
    .page-title { min-height: 68px; gap: 8px; }
    .question-card, .expanded-model, .carry-model, .exchange-model,
    .matching-board, .construction-board, .digit-task { padding: 10px; }
    .choice-grid { gap: 8px; }
    .option-card { min-height: 52px; padding: 8px 10px; }
    .feedback-block { min-height: 46px; padding-block: 7px; }
  }

  @media (max-width: 639.98px) {
    .lesson-root {
      min-height: 100dvh;
    }

    .stage {
      width: 390px;
      max-width: 100%;
      height: 100dvh;
    }

    .stage-header {
      padding-top: 60px;
      padding-bottom: 7px;
    }

    .progress-track {
      margin-bottom: 7px;
    }

    .stage-chrome {
      gap: 5px;
    }

    .chrome-title {
      max-width: 175px;
      font-size: 10px;
    }

    .chrome-actions {
      gap: 5px;
    }

    .screen-type { display: none; }

    .stage-content {
      padding-top: 11px;
      padding-bottom: 8px;
    }

    .stage-nav {
      min-height: 66px;
      padding-top: 8px;
      padding-bottom: 9px;
    }

    .btn {
      min-width: 104px;
      min-height: 48px;
      padding: 0 12px;
      font-size: 11px;
    }

    .screen-stack {
      gap: 10px;
    }

    .page-title {
      min-height: 69px;
      gap: 8px;
    }

    .page-title h1 {
      font-size: 25px;
    }

    .page-title p {
      margin-top: 5px;
      font-size: 13px;
    }

    .page-title-bit .g1-char {
      width: 58px;
      height: 73px;
    }

    .math-mini-coach {
      grid-template-columns: 60px auto;
    }

    .math-mini-coach .g1-char {
      width: 60px;
      height: 74px;
    }

    .math-mini-coach > span {
      padding: 6px 8px;
      font-size: 11px;
    }

    .carry-model > .math-mini-coach,
    .zero-carry-model > .math-mini-coach {
      position: static;
      grid-column: 1 / -1;
      justify-self: end;
      margin-bottom: -9px;
    }

    .sensor-factory-svg {
      height: 86px;
    }

    .place-conveyor-svg {
      height: 82px;
    }

    .carry-capsule-svg {
      top: 92px;
      width: 88%;
      height: 78px;
    }

    .zero-checkpoint-svg {
      height: 82px;
    }

    .question-card,
    .place-model,
    .expanded-model,
    .column-placement,
    .carry-model,
    .exchange-model,
    .zero-carry-model,
    .strategy-model,
    .construction-board,
    .digit-task,
    .matching-board,
    .warehouse-scene,
    .summary-correction {
      padding: 13px;
      border-radius: 18px;
    }

    .question-card h2 {
      font-size: 18px;
    }

    .options {
      grid-template-columns: 1fr;
      gap: 7px;
      margin-top: 10px;
    }

    .option {
      min-height: 48px;
      padding: 8px 10px;
      font-size: 11px;
    }

    .option b {
      width: 29px;
      height: 29px;
    }

    .feedback-visible {
      max-height: 210px;
    }

    .feedback-block p {
      font-size: 11px;
    }

    .hook-scene {
      min-height: 205px;
      padding: 15px;
      grid-template-columns: 1fr 1.35fr 65px;
      gap: 8px;
      border-radius: 20px;
    }

    .hook-copy strong {
      font-size: 22px;
    }

    .hook-copy p {
      font-size: 10px;
    }

    .hook-scene > .g1-char {
      width: 63px;
      height: 80px;
    }

    .detail-box {
      padding: 6px;
      gap: 3px;
      border-radius: 11px;
    }

    .detail-box i {
      min-height: 15px;
    }

    .detail-box b {
      font-size: 8px;
    }

    .hook-estimate {
      left: 37%;
      right: 19%;
    }

    .place-cards {
      gap: 5px;
    }

    .place-cards > div {
      min-height: 61px;
      padding: 7px 4px;
    }

    .place-cards strong {
      font-size: 14px;
    }

    .expanded-parts {
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }

    .expanded-part {
      min-height: 82px;
      gap: 5px;
    }

    .expanded-sum {
      flex-wrap: wrap;
      gap: 7px;
      text-align: center;
    }

    .expanded-sum span,
    .expanded-sum strong {
      font-size: 12px;
    }

    .column-placement {
      min-height: 240px;
    }

    .falling-multiplier {
      top: 101px;
    }

    .falling-multiplier.placed {
      top: 189px;
    }

    .carry-model {
      min-height: 245px;
    }

    .carry-grid {
      width: 96%;
    }

    .carry-row span {
      min-height: 36px;
      font-size: 20px;
    }

    .carry-path {
      width: 88%;
    }

    .active-equation {
      font-size: 12px;
    }

    .exchange-model {
      min-height: 205px;
      grid-template-columns: 1fr 25px 1fr;
      gap: 5px;
    }

    .unit-cloud {
      grid-template-columns: repeat(6, 11px);
      gap: 3px;
    }

    .unit-cloud i {
      width: 11px;
      height: 11px;
    }

    .ten-rods span {
      width: 19px;
      height: 62px;
    }

    .exchange-result strong {
      font-size: 8px;
    }

    .zero-carry-model {
      min-height: 310px;
      gap: 7px;
    }

    .mini-column > div:first-child {
      grid-template-columns: repeat(4, 34px);
    }

    .mini-column span {
      height: 43px;
      font-size: 18px;
    }

    .zero-equation {
      padding: 11px;
      font-size: 18px;
    }

    .strategy-model {
      min-height: 205px;
      gap: 8px;
    }

    .strategy-bridge {
      padding: 11px 6px;
      font-size: 11px;
    }

    .strategy-proof {
      padding: 10px 4px;
      font-size: 10px;
    }

    .compact-proof,
    .error-equation {
      min-height: 64px;
      padding: 10px;
      font-size: 15px;
    }

    .construction-slots {
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }

    .construction-slot {
      min-height: 66px;
    }

    .digit-slots {
      gap: 5px;
    }

    .digit-slots button {
      width: 48px;
      height: 51px;
      font-size: 21px;
    }

    .keypad {
      gap: 5px;
    }

    .keypad button {
      min-height: 44px;
    }

    .matching-board {
      grid-template-columns: 1fr 28px 1fr;
      gap: 5px;
    }

    .matching-column button {
      min-height: 56px;
      padding: 7px;
      font-size: 9px;
    }

    .right-column button {
      font-size: 12px;
    }

    .warehouse-boxes {
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
    }

    .warehouse-boxes span {
      min-height: 42px;
    }

    .input-row {
      grid-template-columns: 1fr;
    }

    .finale-heading {
      padding: 10px 12px;
    }

    .finale-heading h1 {
      font-size: 21px;
    }

    .finale-heading p {
      font-size: 9px;
    }

    .finale-main-grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .finale-payoff-card,
    .finale-mastery-card {
      padding: 10px;
    }

    .summary-correction {
      min-height: 105px;
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .summary-parts {
      order: 2;
    }

    .summary-answer {
      order: 3;
      text-align: center;
    }

    .rule-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 5px;
    }

    .rule-grid > div {
      min-height: 47px;
      padding: 6px;
    }

    .rule-grid b {
      width: 27px;
      height: 27px;
    }

    .rule-grid span {
      font-size: 9px;
    }

    .finale-reward {
      min-height: 108px;
      padding: 8px 10px;
      grid-template-columns: 58px 72px minmax(0, 1fr);
      gap: 7px;
    }

    .finale-medal i {
      width: 54px;
      height: 54px;
      font-size: 23px;
    }

    .finale-bit {
      height: 88px;
    }

    .finale-reward-copy > span {
      font-size: 7px;
    }

    .finale-reward-copy > strong {
      font-size: 14px;
    }

    .finale-reward-copy > small {
      font-size: 8px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lesson-root *,
    .lesson-root *::before,
    .lesson-root *::after {
      animation-duration: .01ms !important;
      animation-delay: 0ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
      scroll-behavior: auto !important;
    }

    .place-cards > div,
    .expanded-part,
    .expanded-sum,
    .sensor-bay,
    .factory-counter,
    .conveyor-multiplier,
    .carry-transfer,
    .checkpoint-carry,
    .checkpoint-output,
    .exchange-result,
    .exchange-total,
    .zero-equation,
    .zero-final,
    .strategy-proof,
    .estimate-band,
    .summary-parts,
    .summary-answer,
    .finale-reward {
      opacity: 1 !important;
      transform: none !important;
    }

    .place-conveyor-svg.multiplier-docked .conveyor-multiplier {
      transform: translateX(388px) !important;
    }

    .zero-checkpoint-svg.accepts-carry .checkpoint-carry {
      transform: translateX(180px) !important;
    }
  }
`;
