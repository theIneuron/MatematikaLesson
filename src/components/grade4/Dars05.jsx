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
import { canUseGrade4TheoryContinue } from './theoryNavigation.js';
import { Grade4Finale, useGrade4TitleClaim } from './Grade4Finale.jsx';

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
  background: rgba(229,245,246,.94);
  backdrop-filter: blur(2px) saturate(.9);
  animation: g4-title-reveal-overlay-life 3.2s ease both;
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
  color: #173B52;
  text-align: center;
  background: radial-gradient(circle at 50% 50%, rgba(255,214,80,.18), transparent 31%), linear-gradient(145deg,#F2FBFC,#E5F5F6);
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
  text-shadow: 0 4px 24px rgba(255,255,255,.82);
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
  background: rgba(255,255,255,.76);
}
.g4-title-card-score strong { color: #227A53; font-family: 'JetBrains Mono', monospace; }
.g4-title-card-score span { color: #586A75; font-size: 9px; }
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
.g4-title-claim{width:100%;min-height:76px;padding:10px 16px;border:0;border-radius:17px;display:grid;grid-template-columns:42px 1fr;align-items:center;gap:12px;color:#173B52;background:linear-gradient(135deg,#F2FBFC,#E5F5F6);box-shadow:inset 0 0 0 1px rgba(22,143,163,.18),0 22px 42px -27px rgba(14,105,120,.48);text-align:left;cursor:pointer;transition:transform .5s ease,box-shadow .5s ease}.g4-title-claim>span{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);font-size:19px}.g4-title-claim>strong{font:750 16px/1.2 'Source Serif 4',Georgia,serif}.g4-title-claim:hover:not(:disabled){transform:translateY(-2px)}.g4-title-claim:disabled{cursor:default;filter:saturate(.55);opacity:.68}
@media (prefers-reduced-motion: reduce) {
  .g4-title-reveal-overlay { opacity: 1; animation: none; }
  .g4-title-reveal-rays { opacity: .28; transform: translate(-50%,-50%); animation: none; }
  .g4-title-reveal-medal { opacity: 1; transform: translate(-50%,-50%); animation: none; }
  .g4-title-reveal-card h2 { opacity: 1; transform: translateX(-50%); animation: none; }
  .g4-title-reveal-confetti, .g4-title-card-confetti { display: none; }
  .g4-title-card-bit { animation: none; }
}
`;

function G4TitleReveal({ active, playNow = active, title, lang }) {
  const [visible, setVisible] = useState(false); const shownRef = useRef(false);
  useEffect(() => { if (!active || !playNow || shownRef.current || typeof window === 'undefined') return undefined; let timer; const frame = window.requestAnimationFrame(() => { shownRef.current = true; setVisible(true); const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches; timer = window.setTimeout(() => setVisible(false), reduced ? 120 : 3900); }); return () => { window.cancelAnimationFrame(frame); window.clearTimeout(timer); }; }, [active, playNow]);
  if (!visible || typeof document === 'undefined') return null;
  const prefix = ({ uz: 'Unvon', ru: 'Звание', en: 'Title' })[lang] ?? 'Unvon';
  return createPortal(<div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={`${prefix}: ${title}`}><div className="rank-boost-card g4-title-reveal-card"><div className="g4-title-reveal-rays" aria-hidden="true" /><div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }} />)}</div><div className="rank-boost-medal g4-title-reveal-medal" aria-hidden="true">★</div><h2>{title}</h2></div></div>, document.body);
}

function G4TitleCard({ title, lang, firstTry, totalScored }) {
  const copy = ({
    uz: { earned: 'UNVON OLINDI', firstTry: 'birinchi urinishda' },
    ru: { earned: 'ЗВАНИЕ ПОЛУЧЕНО', firstTry: 'с первой попытки' },
    en: { earned: 'TITLE EARNED', firstTry: 'on the first attempt' },
  })[lang] ?? { earned: 'UNVON OLINDI', firstTry: 'birinchi urinishda' };
  return <div className="g4-title-card-stage" data-g4-role="title-card" data-g4-title-bit="absent" role="status" aria-live="polite" aria-atomic="true"><div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div><div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{copy.earned}</span><h2>{title}</h2><div className="g4-title-card-score"><strong>{firstTry}/{totalScored}</strong><span>{copy.firstTry}</span></div></div>;
}

// ============================================================================
// 4-SINF · Dars05 · Ko'p xonali sonlarni yaxlitlash
// Local contract: SCREEN_META is the reviewed lesson skeleton;
// CONTENT is the complete RU/UZ and audio package.
// ============================================================================

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

// eslint-disable-next-line no-unused-vars -- deterministic Grade 4 math-audit fixture
const ROUNDING_LINE_FLOWS = {
  guided: [
    { id: 'tens', value: 48764, lower: 48760, upper: 48770, result: 48760 },
    { id: 'hundreds', value: 48764, lower: 48700, upper: 48800, result: 48800 },
    { id: 'thousands', value: 48764, lower: 48000, upper: 49000, result: 49000 },
  ],
  practice: [
    { id: 'tens', value: 27364, lower: 27360, upper: 27370, result: 27360 },
    { id: 'hundreds', value: 27364, lower: 27300, upper: 27400, result: 27400 },
    { id: 'thousands', value: 27364, lower: 27000, upper: 28000, result: 27000 },
  ],
};

const LESSON_META = {
  lessonId: 'num-4-05-v1',
  slug: 'dars05-kop-xonali-sonlarni-yaxlitlash',
  grade: 4,
  lessonNumber: 5,
  profile: 'theory',
  lessonTitle: {
    uz: "5-dars. Ko'p xonali sonlarni yaxlitlash",
    ru: 'Урок 5. Округление многозначных чисел',
    en: 'Lesson 5: Rounding multi-digit numbers',
  },
  skillTags: [
    'multi_digit_rounding',
    'round_to_tens',
    'round_to_hundreds',
    'round_to_thousands',
    'exact_vs_approximate',
    'rounding_carry',
    'rounding_interval',
    'context_precision',
  ],
  screensCount: 15,
  audioLocales: ['uz', 'ru', 'en-GB'],
  finalReflectionRequired: false,
  contentVersion: 'v2',
  sourcePolicy: 'local-etalon-only',
  implementationContract: {
    hookFrameReference: 'Grade4 Dars01 data-scene',
    hookOptionsReference: 'Grade4 Dars01 hook options',
    hookAnswerPolicy: 'binary-correct-wrong-with-retry',
    explanationInteractionPolicy: 'no-user-click-to-reveal',
    finaleComponent: 'Grade4Finale',
    finaleFlowReference: 'Grade4 Dars02',
    finaleRevealHook: 'useAudioSegmentReveal',
    finaleRevealCount: 5,
    finaleRevealSteps: { takeaways: [1, 2, 3], proof: 4, bridge: 5 },
    finaleCompactFrames: ['proof', 'bridge'],
    finaleCompactCss: {
      paddingBlockPx: 5,
      textLineHeight: 1.22,
      bridgeIconPx: 24,
      bridgeGapPx: 7,
      scope: 'Dars05-only',
    },
    approvedPatternReferences: {
      narratedReveal: 'Grade4 Dars04 useAudioSegmentReveal',
      algorithmRail: 'Grade4 Dars14 flow-board',
      precisionRows: 'Grade4 Dars14 FormulaRow',
      carryCalculation: 'Grade4 Dars11 AlignedRows and carry-arc',
      boundaryProof: 'Grade4 Dars04 ChainProofScreen',
    },
  },
};

const CONTENT = {
  s0: {
    eyebrow: { uz: 'Yangi missiya', ru: 'Новая миссия', en: 'New mission' },
    question: {
      uz: "Shaharda umumiy 120 789 kishi yashaydi.\n\nBit esa shaharda taxminan 121 000 kishi yashaydi, dedi. Bitning gapi rostmi?",
      ru: 'В городе живут всего 120 789 человек.\n\nБит сказал, что в городе живут примерно 121 000 человек. Прав ли Бит?',
      en: 'The city has a total population of 120,789.\n\nBit said that about 121,000 people live in the city. Is Bit right?',
    },
    model: {
      kind: 'cityPopulationHook',
      badge: { uz: 'Shahar aholisi', ru: 'Население города', en: 'City population' },
      exactLabel: { uz: "Aniq ma'lumot", ru: 'Точные данные', en: 'Exact data' },
      exactValue: '120 789',
      bitLabel: { uz: 'Bitning taxmini', ru: 'Оценка Бита', en: "Bit's estimate" },
      bitClaim: {
        uz: 'Taxminan 121 000 kishi',
        ru: 'Примерно 121 000 человек',
        en: 'About 121,000 people',
      },
    },
    options: [
      {
        uz: 'Ha, Bitning gapi rost',
        ru: 'Да, Бит прав',
        en: 'Yes, Bit is right',
      },
      {
        uz: "Yo'q, Bitning gapi rost emas",
        ru: 'Нет, Бит не прав',
        en: 'No, Bit is wrong',
      },
    ],
    scored: false,
    scope: 'hook',
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. 120 789 ni minglikkacha yaxlitlasak, 121 000 hosil bo'ladi. Shuning uchun Bitning gapi rost.",
      ru: 'Верно. Если округлить 120 789 до тысяч, получится 121 000. Поэтому Бит прав.',
      en: 'Correct. When 120,789 is rounded to the nearest thousand, it becomes 121,000. Therefore, Bit is right.',
    },
    wrong: [
      null,
      {
        uz: "Sonlar aynan teng emas, lekin Bit aniq sonni emas, taxminiy qiymatni aytdi. 120 789 ni minglikkacha yaxlitlasak, 121 000 hosil bo'ladi. Shuning uchun Bitning gapi rost.",
        ru: 'Числа не равны точно, но Бит назвал не точное, а приближённое значение. Если округлить 120 789 до тысяч, получится 121 000. Поэтому Бит прав.',
        en: 'The numbers are not exactly equal, but Bit gave an estimate rather than an exact value. When 120,789 is rounded to the nearest thousand, it becomes 121,000. Therefore, Bit is right.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Shaharda bir yuz yigirma ming yetti yuz sakson to'qqiz kishi yashaydi.",
          'Bit esa shaharda taxminan bir yuz yigirma bir ming kishi yashaydi, dedi.',
          'Sizning fikringizcha, Bitning gapi rostmi? Javobni tanlang.',
        ],
        ru: [
          'Всего в городе живут сто двадцать тысяч семьсот восемьдесят девять человек.',
          'Бит сказал, что в городе живут примерно сто двадцать одна тысяча человек.',
          'Как ты думаешь, прав ли Бит? Выбери ответ.',
        ],
        en: [
          'The city has one hundred and twenty thousand seven hundred and eighty-nine residents.',
          'Bit says that about one hundred and twenty-one thousand people live in the city.',
          'Do you think Bit is right? Choose an answer.',
        ],
      },
      on_correct: {
        uz: "To'g'ri. Bir yuz yigirma ming yetti yuz sakson to'qqizni minglikkacha yaxlitlasak, bir yuz yigirma bir ming hosil bo'ladi.",
        ru: 'Верно. Если округлить сто двадцать тысяч семьсот восемьдесят девять до тысяч, получится сто двадцать одна тысяча.',
        en: 'Correct. One hundred and twenty thousand seven hundred and eighty-nine rounds to one hundred and twenty-one thousand.',
      },
      on_wrong: {
        uz: "Unchalik emas. Bit taxminiy qiymatni aytganiga e'tibor bering.",
        ru: 'Не совсем. Обрати внимание, Бит назвал приближённое значение.',
        en: 'Not quite. Remember that Bit gave an estimated value.',
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Tushuntirish', ru: 'Объяснение', en: 'Explanation' },
    title: {
      uz: 'Aniq son va taxminiy qiymat',
      ru: 'Точное число и приближённое значение',
      en: 'An exact number and an estimate',
    },
    lead: {
      uz: "Aniq ma'lumot har bir birlikni saqlaydi. Taxminiy qiymat esa miqdorning umumiy ko'lamini tez ko'rsatadi.",
      ru: 'Точные данные сохраняют каждую единицу. Приближённое значение быстро показывает общий масштаб.',
      en: 'Exact data keeps every unit. An estimate quickly shows the overall size.',
    },
    instruction: {
      uz: '120 789 va 121 000 yozuvlarini yonma-yon solishtiring: birinchisi aniq son, ikkinchisi taxminiy qiymat.',
      ru: 'Сравни записи 120 789 и 121 000 рядом: первая является точным числом, вторая — приближённым значением.',
      en: 'Compare 120,789 and 121,000 side by side: the first is exact and the second is an estimate.',
    },
    presentation: {
      mode: 'static-comparison',
      userAction: 'none',
      audioHighlightOrder: ['exact', 'estimate', 'conclusion'],
    },
    model: {
      kind: 'exactVsApproximate',
      showAll: true,
      badge: { uz: 'Ikki xil aniqlik', ru: 'Два уровня точности', en: 'Two levels of accuracy' },
      relation: '120 789 ≈ 121 000',
      cards: [
        {
          id: 'exact',
          value: '120 789',
          label: { uz: 'Aniq son', ru: 'Точное число', en: 'Exact number' },
          note: {
            uz: 'Har bir kishi hisobga olingan.',
            ru: 'Учтён каждый человек.',
            en: 'Every resident is included.',
          },
          tone: 'cyan',
        },
        {
          id: 'estimate',
          mark: '≈',
          value: '121 000',
          label: { uz: 'Taxminiy qiymat', ru: 'Приближённое значение', en: 'Estimate' },
          note: {
            uz: 'Eng yaqin minglikkacha yaxlitlangan.',
            ru: 'Округлено до ближайшей тысячи.',
            en: 'Rounded to the nearest thousand.',
          },
          tone: 'accent',
        },
      ],
    },
    conclusion: {
      uz: 'Taxminiy qiymat aniq tenglik emas, ammo miqdorni yaqin va qulay ko\'rsatadi.',
      ru: 'Приближённое значение не означает точного равенства, но удобно показывает близкую величину.',
      en: 'An estimate is not an exact equality, but it gives a useful nearby value.',
    },
    audio: {
      intro: {
        uz: [
          "Bir yuz yigirma ming yetti yuz sakson to'qqiz aholining aniq sonidir. Unda har bir kishi hisobga olingan.",
          'Bir yuz yigirma bir ming esa eng yaqin minglikkacha yaxlitlangan taxminiy qiymatdir.',
          "Taxminiy qiymat aniq tenglik emas. U miqdorning umumiy ko'lamini tez ko'rsatadi.",
        ],
        ru: [
          'Сто двадцать тысяч семьсот восемьдесят девять является точным числом жителей. В нём учтён каждый человек.',
          'Сто двадцать одна тысяча является приближённым значением, округлённым до ближайшей тысячи.',
          'Приближённое значение не означает точного равенства. Оно быстро показывает общий масштаб величины.',
        ],
        en: [
          'One hundred and twenty thousand seven hundred and eighty-nine is the exact population. Every resident is included.',
          'One hundred and twenty-one thousand is an estimate rounded to the nearest thousand.',
          'An estimate is not an exact equality. It quickly shows the overall size.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: "Sonlar o'qida", ru: 'На числовой прямой', en: 'On the number line' },
    title: {
      uz: 'Qaysi minglik yaqinroq?',
      ru: 'Какая тысяча ближе?',
      en: 'Which thousand is nearer?',
    },
    lead: {
      uz: '120 789 soni 120 000 va 121 000 orasida joylashgan.',
      ru: 'Число 120 789 находится между 120 000 и 121 000.',
      en: 'The number 120,789 lies between 120,000 and 121,000.',
    },
    instruction: {
      uz: 'Masofalarni solishtiring: 120 000 gacha 789, 121 000 gacha 211. Kichik masofa 121 000 ni ko\'rsatadi.',
      ru: 'Сравни расстояния: до 120 000 — 789, до 121 000 — 211. Меньшее расстояние ведёт к 121 000.',
      en: 'Compare the distances: 789 to 120,000 and 211 to 121,000. The shorter distance leads to 121,000.',
    },
    presentation: {
      mode: 'audio-sequenced',
      userAction: 'none',
      frameCount: 3,
      audioFrameOrder: ['placement', 'distances', 'conclusion'],
    },
    model: {
      kind: 'guidedRoundingLine',
      showAll: true,
      badge: { uz: 'Ikki masofa', ru: 'Два расстояния', en: 'Two distances' },
      lower: '120 000',
      midpoint: '120 500',
      upper: '121 000',
      number: '120 789',
      position: 78.9,
      distances: [
        { endpoint: '120 000', value: '789', tone: 'cyan' },
        { endpoint: '121 000', value: '211', tone: 'accent' },
      ],
    },
    conclusion: {
      uz: '121 000 gacha masofa 211. Bu 789 dan kichik, shuning uchun 120 789 soni 121 000 ga yaqinroq.',
      ru: 'До 121 000 осталось 211. Это меньше 789, поэтому 120 789 ближе к 121 000.',
      en: 'The distance to 121,000 is 211. This is less than 789, so 120,789 is nearer to 121,000.',
    },
    audio: {
      intro: {
        uz: [
          "Minglikkacha yaxlitlash uchun sonni ikki qo'shni minglik orasiga joylaymiz. O'rta nuqta bir yuz yigirma ming besh yuzdir.",
          "Bir yuz yigirma minggacha masofa yetti yuz sakson to'qqiz. Bir yuz yigirma bir minggacha masofa ikki yuz o'n bir.",
          "Ikki yuz o'n bir kichikroq. Demak, son bir yuz yigirma bir mingga yaqinroq va Bitning taxmini asosli.",
        ],
        ru: [
          'Чтобы округлить до тысяч, помещаем число между двумя соседними тысячами. Середина находится в точке сто двадцать тысяч пятьсот.',
          'До ста двадцати тысяч расстояние равно семистам восьмидесяти девяти. До ста двадцати одной тысячи расстояние равно двумстам одиннадцати.',
          'Двести одиннадцать меньше. Значит, число ближе к ста двадцати одной тысяче, и оценка Бита обоснована.',
        ],
        en: [
          'To round to the nearest thousand, place the number between two neighbouring thousands. The midpoint is one hundred and twenty thousand five hundred.',
          'The distance to one hundred and twenty thousand is seven hundred and eighty-nine. The distance to one hundred and twenty-one thousand is two hundred and eleven.',
          'Two hundred and eleven is smaller. The number is nearer to one hundred and twenty-one thousand, so Bit\'s estimate is reasonable.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: '1-misol', ru: 'Пример 1', en: 'Example 1' },
    title: {
      uz: '64 372 ni minglikkacha yaxlitlang',
      ru: 'Округли 64 372 до тысяч',
      en: 'Round 64,372 to the nearest thousand',
    },
    lead: {
      uz: 'Son 64 000 va 65 000 orasida turibdi.',
      ru: 'Число находится между 64 000 и 65 000.',
      en: 'The number lies between 64,000 and 65,000.',
    },
    instruction: {
      uz: "Sonlar o'qidagi yaqinroq minglikni tanlang.",
      ru: 'Выбери ближайшую тысячу на числовой прямой.',
      en: 'Choose the nearer thousand on the number line.',
    },
    model: {
      kind: 'roundingLineSelection',
      badge: { uz: 'Eng yaqin minglik', ru: 'Ближайшая тысяча', en: 'Nearest thousand' },
      lower: '64 000',
      midpoint: '64 500',
      upper: '65 000',
      number: '64 372',
      position: 37.2,
      distances: [
        { endpoint: '64 000', value: '372' },
        { endpoint: '65 000', value: '628' },
      ],
    },
    options: ['64 000', '65 000'],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. 64 000 gacha 372, 65 000 gacha esa 628 birlik bor. 64 000 yaqinroq.",
      ru: 'Верно. До 64 000 осталось 372, а до 65 000 — 628. Число 64 000 ближе.',
      en: 'Correct. The distance to 64,000 is 372, while the distance to 65,000 is 628. The nearer thousand is 64,000.',
    },
    wrong: [
      null,
      {
        uz: '65 000 gacha masofa 628, 64 000 gacha esa 372. 628 katta, shuning uchun 65 000 uzoqroq.',
        ru: 'До 65 000 расстояние равно 628, а до 64 000 — 372. Число 65 000 находится дальше.',
        en: 'The distance to 65,000 is 628, while the distance to 64,000 is 372. Therefore, 65,000 is farther away.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Oltmish to'rt ming uch yuz yetmish ikki soni oltmish to'rt ming va oltmish besh ming orasida turibdi.",
          "Sonlar o'qidagi yaqinroq minglikni tanlang.",
        ],
        ru: [
          'Шестьдесят четыре тысячи триста семьдесят два находится между шестьюдесятью четырьмя и шестьюдесятью пятью тысячами.',
          'Выбери ближайшую тысячу на числовой прямой.',
        ],
        en: [
          'Sixty-four thousand three hundred and seventy-two lies between sixty-four thousand and sixty-five thousand.',
          'Choose the nearer thousand on the number line.',
        ],
      },
      on_correct: {
        uz: "To'g'ri. Uch yuz yetmish ikki olti yuz yigirma sakkizdan kichik, shuning uchun son oltmish to'rt minggacha yaxlitlanadi.",
        ru: 'Верно. Триста семьдесят два меньше шестисот двадцати восьми, поэтому число округляется до шестидесяти четырёх тысяч.',
        en: 'Correct. Three hundred and seventy-two is less than six hundred and twenty-eight, so the number rounds to sixty-four thousand.',
      },
      on_wrong: {
        uz: 'Masofalarni solishtiring. Uch yuz yetmish ikki qisqaroq masofadir.',
        ru: 'Сравни расстояния. Триста семьдесят два является более коротким расстоянием.',
        en: 'Compare the distances. Three hundred and seventy-two is the shorter distance.',
      },
    },
  },

  s4: {
    eyebrow: { uz: '2-misol', ru: 'Пример 2', en: 'Example 2' },
    title: {
      uz: 'Aniq va taxminiy yozuvlarni moslang',
      ru: 'Сопоставь точную и приближённую записи',
      en: 'Match the exact and estimated forms',
    },
    lead: {
      uz: 'Bir xil sonning kerakli aniqligi uning vazifasiga bog\'liq.',
      ru: 'Нужная точность одного и того же числа зависит от его назначения.',
      en: 'The required accuracy of the same number depends on its purpose.',
    },
    instruction: {
      uz: 'Har bir vaziyatni mos yozuv bilan juftlang.',
      ru: 'Соедини каждую ситуацию с подходящей записью.',
      en: 'Match each context to the suitable form.',
    },
    model: {
      kind: 'exactApproxMatching',
      badge: { uz: 'Aniqlikni tanlash', ru: 'Выбор точности', en: 'Choosing accuracy' },
      leftCards: [
        {
          id: 'station',
          label: { uz: 'Stansiya kodi', ru: 'Код станции', en: 'Station code' },
          note: {
            uz: 'Har bir raqam muhim.',
            ru: 'Важна каждая цифра.',
            en: 'Every digit matters.',
          },
        },
        {
          id: 'passengers',
          label: {
            uz: "Bir oydagi yo'lovchilar soni",
            ru: 'Число пассажиров за месяц',
            en: 'Monthly passenger total',
          },
          note: {
            uz: "Tezkor umumiy ko'rinish kerak.",
            ru: 'Нужен быстрый общий обзор.',
            en: 'A quick overview is needed.',
          },
        },
      ],
      rightCards: [
        {
          id: 'exact',
          value: '48 764',
          label: { uz: 'Aniq yozuv', ru: 'Точная запись', en: 'Exact form' },
        },
        {
          id: 'approximate',
          value: '49 000',
          prefix: { uz: 'taxminan', ru: 'примерно', en: 'about' },
          label: { uz: 'Taxminiy yozuv', ru: 'Приближённая запись', en: 'Estimated form' },
        },
      ],
      pairs: { station: 'exact', passengers: 'approximate' },
    },
    correctText: {
      uz: "Stansiya kodi 48 764 bo'lib aniq qoldi. Yo'lovchilar soni esa taxminan 49 000 deb ko'rsatildi.",
      ru: 'Код станции остался точным: 48 764. Число пассажиров показано приближённо: около 49 000.',
      en: 'The station code stays exact at 48,764. The passenger total is shown as an estimate of about 49,000.',
    },
    wrongByPair: {
      'station:approximate': {
        uz: "Yaxlitlash stansiya kodini o'zgartiradi. 49 000 boshqa kodni bildirishi mumkin. Koddagi barcha raqamlarni aniq saqlang.",
        ru: 'Округление изменит код станции. Число 49 000 может обозначать другой код. Сохрани все цифры точно.',
        en: 'Rounding changes the station code. The number 49,000 could identify a different station. Keep every digit exact.',
      },
      'passengers:exact': {
        uz: "48 764 aniq ma'lumot, ammo bu vaziyat tezkor umumiy ko'rinishni so'raydi. Eng yaqin minglik 49 000.",
        ru: '48 764 — точное значение, но здесь нужен быстрый общий обзор. Ближайшая тысяча — 49 000.',
        en: '48,764 is exact, but this context needs a quick overview. The nearest thousand is 49,000.',
      },
    },
    audio: {
      intro: {
        uz: [
          'Bir xil son turli vaziyatlarda turlicha aniqlikda yozilishi mumkin.',
          "Stansiya kodini aniq qoldiring. Bir oydagi yo'lovchilar sonini esa eng yaqin minglikkacha taxminiy ko'rsating.",
          'Har bir vaziyatni mos yozuv bilan juftlang.',
        ],
        ru: [
          'Одно и то же число в разных ситуациях может требовать разной точности.',
          'Код станции оставь точным. Число пассажиров за месяц покажи приближённо до ближайшей тысячи.',
          'Соедини каждую ситуацию с подходящей записью.',
        ],
        en: [
          'The same number may need a different level of accuracy in different contexts.',
          'Keep the station code exact. Show the monthly passenger total as an estimate to the nearest thousand.',
          'Match each context to the suitable form.',
        ],
      },
      on_correct: {
        uz: "Stansiya kodi qirq sakkiz ming yetti yuz oltmish to'rt bo'lib qoldi. Yo'lovchilar soni esa taxminan qirq to'qqiz ming deb ko'rsatildi.",
        ru: 'Код станции остался равен сорока восьми тысячам семистам шестидесяти четырём. Число пассажиров показано как примерно сорок девять тысяч.',
        en: 'The station code stays as forty-eight thousand seven hundred and sixty-four. The monthly passenger total is shown as about forty-nine thousand.',
      },
      on_wrong: {
        uz: 'Juftlik vaziyatga mos emas. Son kodni yoki umumiy miqdorni bildirishini tekshiring.',
        ru: 'Эта пара не подходит ситуации. Проверь, обозначает число код или общее количество.',
        en: 'This pair does not suit the context. Check whether the number is a code or an overall total.',
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
    title: {
      uz: "Yaxlitlashning to'rt qadami",
      ru: 'Четыре шага округления',
      en: 'Four rounding steps',
    },
    lead: {
      uz: "Maqsad xonasi, o'ngdagi qo'shni raqam, yo'nalish va nollar bitta tartibda ishlaydi.",
      ru: 'Целевой разряд, соседняя цифра справа, направление и нули работают в одном порядке.',
      en: 'The target place, the digit to its right, the direction and the zeros follow one order.',
    },
    instruction: {
      uz: "To'rt qadamni chapdan o'ngga kuzating: maqsad xonasi, qo'shni raqam, yo'nalish va natija.",
      ru: 'Проследи четыре шага слева направо: целевой разряд, соседняя цифра, направление и результат.',
      en: 'Follow the four steps from left to right: target place, neighbouring digit, direction and result.',
    },
    presentation: {
      mode: 'static-algorithm-strip',
      userAction: 'none',
      showAll: true,
      audioHighlightOrder: [0, 1, 2, 3],
    },
    model: {
      kind: 'steps',
      showAll: true,
      badge: { uz: 'Algoritm', ru: 'Алгоритм', en: 'Algorithm' },
      number: '48 764',
      targetIndex: 1,
      inspectIndex: 2,
      columns: [
        { label: { uz: "o'n minglar", ru: 'десятки тысяч', en: 'ten-thousands' }, value: '4' },
        { label: { uz: 'minglar', ru: 'тысячи', en: 'thousands' }, value: '8' },
        { label: { uz: 'yuzlar', ru: 'сотни', en: 'hundreds' }, value: '7' },
        { label: { uz: "o'nlar", ru: 'десятки', en: 'tens' }, value: '6' },
        { label: { uz: 'birlar', ru: 'единицы', en: 'ones' }, value: '4' },
      ],
      steps: [
        {
          uz: '1. Maqsad xonasini toping: minglar',
          ru: '1. Найди целевой разряд: тысячи',
          en: '1. Find the target place: thousands',
        },
        {
          uz: "2. Darhol o'ngdagi raqamni tekshiring: 7",
          ru: '2. Проверь цифру сразу справа: 7',
          en: '2. Check the digit immediately to the right: 7',
        },
        {
          uz: '3. 7 sabab yuqoriga yaxlitlang',
          ru: '3. Из-за цифры 7 округли вверх',
          en: '3. Round up because the digit is 7',
        },
        {
          uz: "4. O'ngdagi raqamlarni nolga almashtiring: 49 000",
          ru: '4. Замени цифры справа нулями: 49 000',
          en: '4. Replace the digits on the right with zeros: 49,000',
        },
      ],
      result: '49 000',
    },
    equation: {
      uz: '48 764 ≈ 49 000',
      ru: '48 764 ≈ 49 000',
      en: '48,764 ≈ 49,000',
    },
    conclusion: {
      uz: "Maqsad xonasi minglar, hal qiluvchi raqam 7. U yuqoriga yo'naltiradi, shuning uchun natija 49 000.",
      ru: 'Целевой разряд — тысячи, решающая цифра — 7. Она направляет вверх, поэтому результат равен 49 000.',
      en: 'The target place is thousands and the deciding digit is 7. It rounds the number up to 49,000.',
    },
    audio: {
      intro: {
        uz: [
          "Birinchi qadamda qirq sakkiz ming yetti yuz oltmish to'rt sonining minglar xonasini belgilaymiz.",
          "Ikkinchi qadamda minglarning darhol o'ngidagi yuzlar raqamiga qaraymiz. Bu raqam yetti.",
          "Uchinchi qadamda yetti sabab sonni yuqoriga yaxlitlaymiz va minglar xonasidagi sakkizni oshiramiz.",
          "To'rtinchi qadamda o'ngdagi raqamlarni nolga almashtiramiz. Natija qirq to'qqiz ming.",
        ],
        ru: [
          'На первом шаге отмечаем разряд тысяч в числе сорок восемь тысяч семьсот шестьдесят четыре.',
          'На втором шаге смотрим на цифру сотен сразу справа от тысяч. Это цифра семь.',
          'На третьем шаге из-за семи округляем вверх и увеличиваем цифру тысяч.',
          'На четвёртом шаге заменяем цифры справа нулями. Получается сорок девять тысяч.',
        ],
        en: [
          'In the first step, mark the thousands place in forty-eight thousand seven hundred and sixty-four.',
          'In the second step, look at the hundreds digit immediately to the right. This digit is seven.',
          'In the third step, seven rounds the number up and increases the thousands digit.',
          'In the fourth step, replace the digits on the right with zeros. The result is forty-nine thousand.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Aniqlik', ru: 'Точность', en: 'Accuracy' },
    title: {
      uz: 'Bitta son, uch xil aniqlik',
      ru: 'Одно число, три уровня точности',
      en: 'One number, three levels of accuracy',
    },
    lead: {
      uz: "Maqsad xonasi o'zgarsa, hal qiluvchi raqam va natija ham o'zgaradi.",
      ru: 'При смене целевого разряда меняются решающая цифра и результат.',
      en: 'Changing the target place changes both the deciding digit and the result.',
    },
    instruction: {
      uz: 'Bir sonning uch xil aniqlikdagi natijalarini solishtiring.',
      ru: 'Сравни результаты одного числа при трёх уровнях точности.',
      en: 'Compare the same number at three levels of accuracy.',
    },
    presentation: {
      mode: 'audio-sequenced-rows',
      userAction: 'none',
      frameCount: 4,
      audioFrameOrder: ['source', 'tens', 'hundreds', 'thousands'],
    },
    model: {
      kind: 'precision',
      revealByAudio: true,
      badge: { uz: 'Aniqlikni almashtirish', ru: 'Смена точности', en: 'Change of accuracy' },
      number: '48 764',
      rows: [
        {
          id: 'tens',
          label: { uz: "o'nlikkacha", ru: 'до десятков', en: 'to the nearest ten' },
          inspect: '4',
          value: '48 760',
        },
        {
          id: 'hundreds',
          label: { uz: 'yuzlikkacha', ru: 'до сотен', en: 'to the nearest hundred' },
          inspect: '6',
          value: '48 800',
        },
        {
          id: 'thousands',
          label: { uz: 'minglikkacha', ru: 'до тысяч', en: 'to the nearest thousand' },
          inspect: '7',
          value: '49 000',
        },
      ],
    },
    conclusion: {
      uz: "O'nlik uchun birlar, yuzlik uchun o'nlar, minglik uchun yuzlar xonasidagi raqam qaror beradi.",
      ru: 'Для десятков решение принимают единицы, для сотен — десятки, для тысяч — сотни.',
      en: 'The ones digit decides for tens, the tens digit for hundreds, and the hundreds digit for thousands.',
    },
    audio: {
      intro: {
        uz: [
          "Qirq sakkiz ming yetti yuz oltmish to'rt sonini turli aniqlikda yaxlitlash mumkin.",
          "O'nlikkacha yaxlitlashda birlar xonasidagi to'rt qaror beradi. Natija qirq sakkiz ming yetti yuz oltmish.",
          "Yuzlikkacha yaxlitlashda o'nlar xonasidagi olti qaror beradi. Natija qirq sakkiz ming sakkiz yuz.",
          "Minglikkacha yaxlitlashda yuzlar xonasidagi yetti qaror beradi. Natija qirq to'qqiz ming.",
        ],
        ru: [
          'Число сорок восемь тысяч семьсот шестьдесят четыре можно округлить с разной точностью.',
          'При округлении до десятков решение принимает четыре в единицах. Получается сорок восемь тысяч семьсот шестьдесят.',
          'При округлении до сотен решение принимает шесть в десятках. Получается сорок восемь тысяч восемьсот.',
          'При округлении до тысяч решение принимает семь в сотнях. Получается сорок девять тысяч.',
        ],
        en: [
          'Forty-eight thousand seven hundred and sixty-four can be rounded to different places.',
          'For the nearest ten, the ones digit four makes the decision. The result is forty-eight thousand seven hundred and sixty.',
          'For the nearest hundred, the tens digit six makes the decision. The result is forty-eight thousand eight hundred.',
          'For the nearest thousand, the hundreds digit seven makes the decision. The result is forty-nine thousand.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: '3-misol', ru: 'Пример 3', en: 'Example 3' },
    title: {
      uz: 'Qaysi raqam qaror beradi?',
      ru: 'Какая цифра принимает решение?',
      en: 'Which digit makes the decision?',
    },
    lead: {
      uz: "538 476 ni minglikkacha yaxlitlashda faqat bitta qo'shni raqam kerak.",
      ru: 'Для округления 538 476 до тысяч нужна только одна соседняя цифра.',
      en: 'Only one neighbouring digit is needed to round 538,476 to the nearest thousand.',
    },
    instruction: {
      uz: 'Minglik uchun hal qiluvchi raqamni tanlang.',
      ru: 'Выбери решающую цифру для округления до тысяч.',
      en: 'Choose the deciding digit for rounding to the nearest thousand.',
    },
    mechanic: 'digit-selection',
    model: {
      kind: 'roundingFocus',
      badge: { uz: 'Minglikkacha', ru: 'До тысяч', en: 'Nearest thousand' },
      number: '538 476',
      separator: '538 | 476',
      targetIndex: 2,
      inspectIndex: 3,
      result: '538 000',
      direction: 'down',
    },
    options: ['8', '4', '7', '6'],
    correctIndex: 1,
    correctText: {
      uz: "4 yuzlar xonasida va minglarning darhol o'ngida turibdi. 4 pastga yo'naltiradi: 538 476 ≈ 538 000.",
      ru: 'Цифра 4 стоит в сотнях, сразу справа от тысяч. Она направляет вниз: 538 476 ≈ 538 000.',
      en: 'The 4 is in the hundreds place, immediately to the right of the thousands place. It rounds down: 538,476 ≈ 538,000.',
    },
    wrong: [
      {
        uz: "8 minglar xonasining o'zida turibdi. Maqsad xonasi qaror bermaydi, uning darhol o'ngidagi 4 ga qarang.",
        ru: 'Цифра 8 находится в самом разряде тысяч. Целевой разряд не принимает решение: посмотри на 4 справа.',
        en: 'The 8 is the thousands digit itself. The target place does not decide; look at the 4 immediately to its right.',
      },
      null,
      {
        uz: "7 o'nlar xonasida va mingliklardan ikki xona uzoqda. Darhol o'ngdagi yuzlar xonasiga qarang.",
        ru: 'Цифра 7 стоит в десятках, слишком далеко от тысяч. Посмотри на соседний разряд сотен.',
        en: 'The 7 is in the tens place, too far from thousands. Look at the neighbouring hundreds place.',
      },
      {
        uz: "6 birlar xonasida va mingliklarning qo'shnisi emas. Darhol o'ngdagi 4 ni tanlang.",
        ru: 'Цифра 6 стоит в единицах и не соседствует с тысячами. Выбери 4 сразу справа от тысяч.',
        en: 'The 6 is in the ones place and is not next to the thousands place. Choose the 4 immediately to the right.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Besh yuz o'ttiz sakkiz ming to'rt yuz yetmish olti sonini minglikkacha yaxlitlaymiz.",
          "Minglar xonasining darhol o'ngidagi hal qiluvchi raqamni tanlang.",
        ],
        ru: [
          'Округлим пятьсот тридцать восемь тысяч четыреста семьдесят шесть до ближайшей тысячи.',
          'Выбери цифру сразу справа от разряда тысяч.',
        ],
        en: [
          'Round five hundred and thirty-eight thousand four hundred and seventy-six to the nearest thousand.',
          'Choose the digit immediately to the right of the thousands place.',
        ],
      },
      on_correct: {
        uz: "To'g'ri. Yuzlar xonasidagi to'rt minglarni o'zgartirmaydi, shuning uchun besh yuz o'ttiz sakkiz ming hosil bo'ladi.",
        ru: 'Верно. Четыре в сотнях не увеличивает тысячи, поэтому получается пятьсот тридцать восемь тысяч.',
        en: 'Correct. Four in the hundreds place does not increase the thousands digit, so the result is five hundred and thirty-eight thousand.',
      },
      on_wrong: {
        uz: "Unchalik emas. Minglar xonasining darhol o'ngidagi raqamni toping.",
        ru: 'Не совсем. Найди цифру сразу справа от разряда тысяч.',
        en: 'Not quite. Find the digit immediately to the right of the thousands place.',
      },
    },
  },

  s8: {
    eyebrow: { uz: '4-misol', ru: 'Пример 4', en: 'Example 4' },
    title: {
      uz: 'Natijani raqamlar bilan kiriting',
      ru: 'Введи результат цифрами',
      en: 'Enter the result using digits',
    },
    lead: {
      uz: "Bu safar tayyor variantlar yo'q. Natijani sonli klaviaturada tering.",
      ru: 'На этот раз готовых вариантов нет. Набери результат на цифровой клавиатуре.',
      en: 'This time there are no ready-made options. Enter the result on the number pad.',
    },
    instruction: {
      uz: '417 286 ni eng yaqin minglikkacha yaxlitlang.',
      ru: 'Округли 417 286 до ближайшей тысячи.',
      en: 'Round 417,286 to the nearest thousand.',
    },
    mechanic: 'number-input',
    model: {
      kind: 'roundingFocus',
      badge: { uz: 'Sonli kiritish', ru: 'Числовой ввод', en: 'Number entry' },
      number: '417 286',
      targetIndex: 2,
      inspectIndex: 3,
      result: '?',
      direction: 'down',
    },
    answer: '417 000',
    acceptedAnswers: ['417000', '417 000'],
    maxLength: 6,
    correctText: {
      uz: "417 000. Yuzlar xonasida 2 turibdi, shuning uchun minglar o'zgarmaydi va o'ngdagi uchta raqam nol bo'ladi.",
      ru: '417 000. В сотнях стоит 2, поэтому тысячи не меняются, а три цифры справа становятся нулями.',
      en: '417,000. The hundreds digit is 2, so the thousands digit stays unchanged and the three digits on the right become zeros.',
    },
    inputWrongDefault: {
      uz: "Minglar xonasini belgilang, so'ng uning darhol o'ngidagi yuzlar xonasiga qarang. Natijada uchta nol bo'lishi kerak.",
      ru: 'Отметь разряд тысяч, затем посмотри на соседний разряд сотен. В результате должны быть три нуля.',
      en: 'Mark the thousands place, then check the neighbouring hundreds digit. The result needs three zeros.',
    },
    hints: [
      {
        uz: "Birinchi ishora: minglar xonasining darhol o'ngidagi raqam 2.",
        ru: 'Первая подсказка: сразу справа от тысяч стоит цифра 2.',
        en: 'First hint: the digit immediately to the right of thousands is 2.',
      },
      {
        uz: "Ikkinchi ishora: 2 pastga yo'naltiradi, minglar o'zgarmaydi.",
        ru: 'Вторая подсказка: 2 направляет вниз, поэтому тысячи не меняются.',
        en: 'Second hint: 2 rounds down, so the thousands digit stays unchanged.',
      },
      {
        uz: "Uchinchi ishora: o'ngdagi uchta raqamni nolga almashtiring.",
        ru: 'Третья подсказка: замени три цифры справа нулями.',
        en: 'Third hint: replace the three digits on the right with zeros.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "To'rt yuz o'n yetti ming ikki yuz sakson olti sonini eng yaqin minglikkacha yaxlitlang.",
          'Javobni raqamlar bilan kiriting.',
        ],
        ru: [
          'Округли четыреста семнадцать тысяч двести восемьдесят шесть до ближайшей тысячи.',
          'Введи ответ цифрами.',
        ],
        en: [
          'Round four hundred and seventeen thousand two hundred and eighty-six to the nearest thousand.',
          'Enter the answer using digits.',
        ],
      },
      on_correct: {
        uz: "To'g'ri. Yuzlar xonasidagi ikki pastga yo'naltiradi. Natija to'rt yuz o'n yetti ming.",
        ru: 'Верно. Два в сотнях направляет вниз. Результат равен четырёмстам семнадцати тысячам.',
        en: 'Correct. Two in the hundreds place rounds down. The result is four hundred and seventeen thousand.',
      },
      on_wrong: {
        uz: 'Unchalik emas. Yuzlar xonasidagi raqamni va natijadagi nollar sonini tekshiring.',
        ru: 'Не совсем. Проверь цифру в сотнях и количество нулей в результате.',
        en: 'Not quite. Check the hundreds digit and the number of zeros in the result.',
      },
    },
  },

  s9: {
    eyebrow: { uz: "Xonadan o'tish", ru: 'Переход через разряд', en: 'Carrying into a new place' },
    title: {
      uz: "99 650 qanday qilib 100 000 bo'ladi?",
      ru: 'Как 99 650 превращается в 100 000?',
      en: 'How does 99,650 become 100,000?',
    },
    lead: {
      uz: "Yuqoriga yaxlitlash 9 lar orqali o'tib, yangi yuz minglikni hosil qiladi.",
      ru: 'При округлении вверх перенос проходит через цифры 9 и создаёт новый разряд сотен тысяч.',
      en: 'Rounding up carries through the 9s and creates a new hundred-thousands place.',
    },
    instruction: {
      uz: "99 650 dan 100 000 gacha o'tish qanday hosil bo'lishini kuzating.",
      ru: 'Проследи, как число 99 650 переходит в 100 000.',
      en: 'Follow how 99,650 changes into 100,000.',
    },
    presentation: {
      mode: 'audio-sequenced-carry',
      userAction: 'none',
      frameCount: 3,
      audioFrameOrder: ['decision', 'addition', 'carry'],
    },
    model: {
      kind: 'carry',
      layout: 'aligned-rows',
      showCarryArc: true,
      badge: { uz: 'Yangi xona', ru: 'Новый разряд', en: 'A new place' },
      number: '99 650',
      target: { uz: 'minglikkacha', ru: 'до тысяч', en: 'to the nearest thousand' },
      inspect: '6',
      result: '100 000',
      phases: [
        {
          id: 'decision',
          expression: '6 ≥ 5',
          label: {
            uz: "Yuzlar xonasidagi 6 yuqoriga yo'naltiradi",
            ru: 'Цифра 6 в сотнях направляет вверх',
            en: 'The 6 in the hundreds place rounds up',
          },
        },
        {
          id: 'addition',
          expression: '99 000 + 1 000',
          label: {
            uz: "99 mingga yana 1 ming qo'shiladi",
            ru: 'К 99 тысячам прибавляется ещё 1 тысяча',
            en: 'Add 1 thousand to 99 thousand',
          },
        },
        {
          id: 'carry',
          expression: '99 650 ≈ 100 000',
          label: {
            uz: "O'tish ikkita 9 orqali davom etadi va o'ngdagi raqamlar nol bo'ladi",
            ru: 'Перенос проходит через две девятки, а цифры справа становятся нулями',
            en: 'The carry passes through two nines and the digits on the right become zeros',
          },
        },
      ],
    },
    conclusion: {
      uz: '99 650 ≈ 100 000',
      ru: '99 650 ≈ 100 000',
      en: '99,650 ≈ 100,000',
    },
    audio: {
      intro: {
        uz: [
          "To'qson to'qqiz ming olti yuz ellik sonini minglikkacha yaxlitlaymiz.",
          "Yuzlar xonasidagi olti yuqoriga yo'naltiradi. To'qson to'qqiz mingga yana bir ming qo'shiladi.",
          "O'tish ikkita to'qqiz orqali davom etadi va yuz ming hosil bo'ladi.",
        ],
        ru: [
          'Округлим девяносто девять тысяч шестьсот пятьдесят до ближайшей тысячи.',
          'Шесть в сотнях направляет вверх. К девяноста девяти тысячам прибавляется ещё одна тысяча.',
          'Перенос проходит через две девятки, и получается сто тысяч.',
        ],
        en: [
          'Round ninety-nine thousand six hundred and fifty to the nearest thousand.',
          'The hundreds digit is six, so round up. Add one thousand to ninety-nine thousand.',
          'The carry passes through two nines and makes one hundred thousand.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Xatoni tahlil qilish', ru: 'Разбор ошибки', en: 'Error analysis' },
    title: {
      uz: "Bit juda o'ngdagi raqamga qaradi",
      ru: 'Бит посмотрел слишком далеко вправо',
      en: 'Bit looked too far to the right',
    },
    lead: {
      uz: 'Bit 246 349 sonini yuzlikkacha yaxlitlab, 246 400 natijasini oldi.',
      ru: 'Бит округлил 246 349 до сотен и получил 246 400.',
      en: 'Bit rounded 246,349 to the nearest hundred and got 246,400.',
    },
    instruction: {
      uz: "Bit birlar xonasidagi 9 ga qaradi. To'g'ri qarorni esa yuzlarning darhol o'ngidagi o'nlar xonasidagi 4 beradi.",
      ru: 'Бит посмотрел на 9 в единицах. Правильное решение принимает 4 в десятках, сразу справа от сотен.',
      en: 'Bit looked at the 9 in the ones place. The correct decision comes from the tens digit 4, immediately to the right of the hundreds place.',
    },
    scored: false,
    presentation: {
      mode: 'audio-sequenced-error-compare',
      userAction: 'none',
      frameCount: 3,
      audioFrameOrder: ['bit-draft', 'correct-place', 'correct-result'],
    },
    model: {
      kind: 'roundingError',
      layout: 'wrong-vs-correct',
      badge: { uz: 'Bit qoralamasi', ru: 'Черновик Бита', en: "Bit's draft" },
      number: '246 349',
      target: { uz: 'yuzlikkacha', ru: 'до сотен', en: 'to the nearest hundred' },
      targetIndex: 3,
      inspectIndex: 4,
      wrongInspect: '9',
      wrongResult: '246 400',
      correctInspect: '4',
      correctResult: '246 300',
      comparisons: [
        {
          id: 'bit-draft',
          tone: 'warning',
          inspect: '9',
          result: '246 400',
          label: { uz: "Bitning yo'li", ru: 'Путь Бита', en: "Bit's route" },
        },
        {
          id: 'correct-route',
          tone: 'success',
          inspect: '4',
          result: '246 300',
          label: { uz: "To'g'ri yo'l", ru: 'Верный путь', en: 'Correct route' },
        },
      ],
    },
    conclusion: {
      uz: "Yuzlikkacha yaxlitlashda qarorni o'nlar xonasidagi 4 beradi. 4 sonni oshirmaydi, shuning uchun 246 349 soni 246 300 ga yaxlitlanadi.",
      ru: 'При округлении до сотен решение принимает цифра десятков 4. Она не увеличивает сотни, поэтому 246 349 округляется до 246 300.',
      en: 'When rounding to the nearest hundred, the tens digit 4 makes the decision. It does not increase the hundreds digit, so 246,349 rounds to 246,300.',
    },
    audio: {
      intro: {
        uz: [
          "Bit ikki yuz qirq olti ming uch yuz qirq to'qqizni yuzlikkacha yaxlitlashda birlar xonasidagi to'qqizga qaradi. Shu sababli xato natija oldi.",
          "Yuzlikkacha yaxlitlashda qarorni yuzlarning darhol o'ngidagi o'nlar raqami beradi. Bu raqam to'rt.",
          "To'rt beshdan kichik, shuning uchun yuzlar saqlanadi. To'g'ri natija ikki yuz qirq olti ming uch yuz.",
        ],
        ru: [
          'При округлении двести сорок шесть тысяч триста сорок девять до сотен Бит посмотрел на девять в единицах. Поэтому он получил неверный результат.',
          'При округлении до сотен решение принимает цифра десятков сразу справа. Это цифра четыре.',
          'Четыре меньше пяти, поэтому сотни сохраняются. Верный результат равен двумстам сорока шести тысячам трёмстам.',
        ],
        en: [
          'Bit rounded two hundred and forty-six thousand three hundred and forty-nine to the nearest hundred. He used the ones digit nine and got an incorrect result.',
          'For the nearest hundred, the tens digit immediately to the right makes the decision. This digit is four.',
          'Four is less than five, so the hundreds digit stays the same. The correct result is two hundred and forty-six thousand three hundred.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: '5-misol', ru: 'Пример 5', en: 'Example 5' },
    title: {
      uz: "To'qqizlar orqali o'ting",
      ru: 'Перейди через девятки',
      en: 'Carry through the nines',
    },
    lead: {
      uz: "Yuqoriga yaxlitlash bir nechta 9 dan o'tib, yangi katta xonani hosil qilishi mumkin.",
      ru: 'При округлении вверх перенос может пройти через несколько девяток и создать новый старший разряд.',
      en: 'Rounding up can carry through several nines and create a new highest place.',
    },
    instruction: {
      uz: '999 650 sonini eng yaqin minglikkacha yaxlitlang.',
      ru: 'Округли 999 650 до ближайшей тысячи.',
      en: 'Round 999,650 to the nearest thousand.',
    },
    question: {
      uz: "Qaysi natija to'g'ri?",
      ru: 'Какой результат верный?',
      en: 'Which result is correct?',
    },
    mechanic: 'multiple-choice',
    scope: 'final',
    model: {
      kind: 'roundingFocus',
      badge: { uz: 'Minglikkacha', ru: 'До тысяч', en: 'To the nearest thousand' },
      number: '999 650',
      targetIndex: 2,
      inspectIndex: 3,
      result: '?',
      direction: 'up',
    },
    options: ['1 000 000', '999 000', '999 700', '990 000'],
    correctIndex: 0,
    correctText: {
      uz: "Yuzlar xonasidagi 6 yuqoriga yaxlitlashni bildiradi. O'tish uchta 9 orqali davom etib, 1 000 000 ni hosil qiladi.",
      ru: 'Цифра 6 в сотнях требует округлить вверх. Перенос проходит через три девятки и создаёт 1 000 000.',
      en: 'The hundreds digit is 6, so the number rounds up. The carry passes through three nines and creates 1,000,000.',
    },
    wrong: [
      null,
      {
        uz: '999 000 pastga yaxlitlash natijasi. Yuzlar xonasidagi 6 sabab minglar oshishi kerak.',
        ru: '999 000 получилось бы при округлении вниз. Цифра 6 в сотнях требует увеличить тысячи.',
        en: '999,000 is the result of rounding down. The hundreds digit is 6, so the thousands must increase.',
      },
      {
        uz: "999 700 yuzlikkacha yaxlitlash natijasi. Minglikkacha yaxlitlashda o'ngda uchta nol bo'lishi kerak.",
        ru: '999 700 — результат округления до сотен. При округлении до тысяч справа должны быть три нуля.',
        en: '999,700 is rounded to the nearest hundred. Rounding to the nearest thousand requires three zeros.',
      },
      {
        uz: "990 000 da yuzlar xonasidagi 6 e'tiborsiz qoldirilib, son pastga kesilgan. Bu raqam minglarni oshirishi kerak.",
        ru: 'В числе 990 000 цифру 6 в сотнях проигнорировали и просто отбросили правую часть. Эта цифра должна увеличить тысячи.',
        en: 'In 990,000, the hundreds digit 6 has been ignored and the right-hand part has simply been cut off. This digit must increase the thousands.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "To'qqiz yuz to'qson to'qqiz ming olti yuz ellik sonini eng yaqin minglikkacha yaxlitlang.",
          "To'g'ri javobni tanlang.",
        ],
        ru: [
          'Округли девятьсот девяносто девять тысяч шестьсот пятьдесят до ближайшей тысячи.',
          'Выбери правильный ответ.',
        ],
        en: [
          'Round nine hundred and ninety-nine thousand six hundred and fifty to the nearest thousand.',
          'Choose the correct answer.',
        ],
      },
      on_correct: {
        uz: "To'g'ri. Yuzlar xonasidagi olti minglarni oshiradi. O'tish uchta to'qqiz orqali davom etib, bir millionni hosil qiladi.",
        ru: 'Верно. Шесть в сотнях увеличивает тысячи. Перенос проходит через три девятки и создаёт один миллион.',
        en: 'Correct. The hundreds digit six increases the thousands. The carry passes through three nines and creates one million.',
      },
      on_wrong: {
        uz: "Unchalik emas. Yuzlar xonasidagi raqamni tekshiring, so'ng to'qqizlar orqali o'tishni davom ettiring.",
        ru: 'Не совсем. Проверь цифру сотен, затем продолжи перенос через девятки.',
        en: 'Not quite. Check the hundreds digit, then carry through the nines.',
      },
    },
  },

  s12: {
    eyebrow: { uz: '6-misol', ru: 'Пример 6', en: 'Example 6' },
    title: {
      uz: "Aholi sonini qulay ko'rsating",
      ru: 'Покажи население удобным числом',
      en: 'Show the population clearly',
    },
    lead: {
      uz: "Lumo shahrida 237 481 kishi yashaydi. Qisqa hisobotda aholi soni minglik aniqligida ko'rsatiladi.",
      ru: 'В городе Лумо живёт 237 481 человек. В кратком отчёте население указывают с точностью до тысяч.',
      en: 'Lumo City has 237,481 residents. The short report shows the population to the nearest thousand.',
    },
    instruction: {
      uz: '237 481 sonini eng yaqin minglikkacha yaxlitlang.',
      ru: 'Округли 237 481 до ближайшей тысячи.',
      en: 'Round 237,481 to the nearest thousand.',
    },
    question: {
      uz: 'Hisobotda qaysi son yoziladi?',
      ru: 'Какое число нужно записать в отчёте?',
      en: 'Which number should appear in the report?',
    },
    mechanic: 'context-choice',
    scope: 'final',
    model: {
      kind: 'roundingFocus',
      badge: { uz: 'Aholi hisoblagichi', ru: 'Счётчик населения', en: 'Population counter' },
      number: '237 481',
      targetIndex: 2,
      inspectIndex: 3,
      result: '?',
      direction: 'down',
    },
    options: ['237 000', '237 500', '240 000', '237 481'],
    correctIndex: 0,
    correctText: {
      uz: "Yuzlar xonasidagi 4 beshdan kichik. Minglar saqlanadi va o'ngdagi uchta raqam nolga almashtiriladi.",
      ru: 'Цифра 4 в сотнях меньше пяти. Тысячи сохраняются, а три цифры справа заменяются нулями.',
      en: 'The hundreds digit is 4, which is less than five. The thousands stay the same and the three digits on the right become zeros.',
    },
    wrong: [
      null,
      {
        uz: "237 500 yuzlikkacha yaxlitlash natijasi. Hisobot minglik aniqligini so'raydi.",
        ru: '237 500 — результат округления до сотен. В отчёте нужна точность до тысяч.',
        en: '237,500 is rounded to the nearest hundred. The report asks for the nearest thousand.',
      },
      {
        uz: "240 000 o'n minglikkacha yaxlitlangan va so'ralganidan qo'polroq. Qo'shni mingliklar 237 000 va 238 000.",
        ru: '240 000 округлено до десятков тысяч и грубее требуемой точности. Соседние тысячи — 237 000 и 238 000.',
        en: '240,000 is rounded to the nearest ten thousand, so it is less precise than requested. The neighbouring thousands are 237,000 and 238,000.',
      },
      {
        uz: "237 481 aniq qiymat, ammo hisobot taxminiy minglik qiymatini so'raydi.",
        ru: '237 481 — точное значение, но отчёту нужно приближённое значение до тысяч.',
        en: '237,481 is the exact value, but the report needs an approximate value to the nearest thousand.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Lumo shahrida ikki yuz o'ttiz yetti ming to'rt yuz sakson bir kishi yashaydi.",
          'Bu sonni eng yaqin minglikkacha yaxlitlab, hisobot uchun mos variantni tanlang.',
        ],
        ru: [
          'В городе Лумо живёт двести тридцать семь тысяч четыреста восемьдесят один человек.',
          'Округли это число до ближайшей тысячи и выбери подходящий вариант для отчёта.',
        ],
        en: [
          'Lumo City has two hundred and thirty-seven thousand four hundred and eighty-one residents.',
          'Round this number to the nearest thousand and choose the suitable report value.',
        ],
      },
      on_correct: {
        uz: "To'g'ri. Yuzlar xonasidagi to'rt sonni pastga, ikki yuz o'ttiz yetti minggacha yaxlitlaydi.",
        ru: 'Верно. Четыре в сотнях округляет число вниз до двухсот тридцати семи тысяч.',
        en: 'Correct. The hundreds digit four rounds the number down to two hundred and thirty-seven thousand.',
      },
      on_wrong: {
        uz: "Unchalik emas. Vazifa minglik aniqligini so'raydi. Qarorni yuzlar xonasidagi raqam beradi.",
        ru: 'Не совсем. Нужна точность до тысяч, а решение принимает цифра сотен.',
        en: 'Not quite. The task asks for the nearest thousand, and the hundreds digit makes the decision.',
      },
    },
  },

  s13: {
    eyebrow: { uz: 'Qiziqarli savol', ru: 'Интересный вопрос', en: 'Interesting question' },
    title: {
      uz: 'Atigi 2 birlik farq: qaysi minglik yaqinroq?',
      ru: 'Разница всего 2: какая тысяча ближе?',
      en: 'Only 2 apart: which thousand is nearer?',
    },
    lead: {
      uz: '121 499 soni 121 000 va 122 000 orasida turibdi.',
      ru: 'Число 121 499 находится между 121 000 и 122 000.',
      en: 'The number 121,499 lies between 121,000 and 122,000.',
    },
    instruction: {
      uz: "Sonlar o'qidagi masofalarni o'ylab, yaqinroq minglikni tanlang.",
      ru: 'Сравни расстояния на числовой прямой и выбери ближайшую тысячу.',
      en: 'Compare the distances on the number line and choose the nearer thousand.',
    },
    model: {
      kind: 'roundingLineSelection',
      badge: { uz: '2 birlikli sir', ru: 'Загадка в 2 единицы', en: 'A 2-unit mystery' },
      lower: '121 000',
      midpoint: '121 500',
      upper: '122 000',
      number: '121 499',
      position: 49.9,
      distances: [
        { endpoint: '121 000', value: '499' },
        { endpoint: '122 000', value: '501' },
      ],
    },
    question: {
      uz: '121 499 soni minglikkacha qaysi songa yaxlitlanadi?',
      ru: 'До какой тысячи округлится число 121 499?',
      en: 'Which thousand does 121,499 round to?',
    },
    options: ['121 000', '122 000'],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. 121 000 gacha masofa 499, 122 000 gacha esa 501. Farq atigi 2 birlik, shuning uchun 121 000 yaqinroq.",
      ru: 'Верно. До 121 000 — 499, а до 122 000 — 501. Разница всего 2, поэтому 121 000 ближе.',
      en: 'Correct. The distance to 121,000 is 499, while the distance to 122,000 is 501. The difference is only 2, so 121,000 is nearer.',
    },
    wrong: [
      null,
      {
        uz: "122 000 juda yaqin ko'rinadi, ammo ungacha 501 birlik bor. 121 000 gacha 499 birlik. 499 kichik bo'lgani uchun 121 000 ni tanlang.",
        ru: 'Число 122 000 кажется очень близким, но до него 501. До 121 000 — 499. Число 499 меньше, поэтому выбери 121 000.',
        en: 'The number 122,000 looks very close, but it is 501 away. The distance to 121,000 is 499. Since 499 is smaller, choose 121,000.',
      },
    ],
    audio: {
      intro: {
        uz: "Qiziqarli savol. Bir yuz yigirma bir ming to'rt yuz to'qson to'qqiz soni ikki qo'shni minglik orasida turibdi. Qaysi minglik yaqinroq? Javobni tanlang.",
        ru: 'Интересный вопрос. Сто двадцать одна тысяча четыреста девяносто девять находится между двумя соседними тысячами. Какая тысяча ближе? Выбери ответ.',
        en: 'Here is an interesting question. One hundred and twenty-one thousand four hundred and ninety-nine lies between two neighbouring thousands. Which thousand is nearer? Choose an answer.',
      },
      on_correct: {
        uz: "To'g'ri. Chapdagi minglikkacha masofa to'rt yuz to'qson to'qqiz. O'ngdagi minglikkacha besh yuz bir. Chapdagi minglik yaqinroq.",
        ru: 'Верно. До тысячи слева четыреста девяносто девять. До тысячи справа пятьсот один. Тысяча слева ближе.',
        en: 'Correct. The left thousand is four hundred and ninety-nine away. The right thousand is five hundred and one away. The left thousand is nearer.',
      },
      on_wrong: {
        uz: "Unchalik emas. To'rt yuz to'qson to'qqiz besh yuz birdan kichik. Chapdagi minglik yaqinroq.",
        ru: 'Не совсем. Четыреста девяносто девять меньше пятисот одного. Тысяча слева ближе.',
        en: 'Not quite. Four hundred and ninety-nine is less than five hundred and one. The thousand on the left is nearer.',
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Yakuniy bosqich', ru: 'Финальный этап', en: 'Final stage' },
    title: {
      uz: 'Bitning taxmini asoslandi',
      ru: 'Оценка Бита обоснована',
      en: "Bit's estimate is justified",
    },
    lead: {
      uz: 'Dars boshidagi savolga endi dalil bilan javob berish mumkin: 120 789 soni 121 000 ga yaqinroq.',
      ru: 'Теперь на вопрос из начала урока можно ответить с доказательством: число 120 789 ближе к 121 000.',
      en: 'The opening question can now be answered with evidence: 120,789 is closer to 121,000.',
    },
    takeaways: [
      {
        uz: 'Vaziyatga mos aniqlik va yaxlitlash xonasini tanlang.',
        ru: 'Выбирай точность и разряд округления по смыслу задачи.',
        en: 'Choose the accuracy and target place to suit the situation.',
      },
      {
        uz: "Qaror uchun tanlangan xonaning darhol o'ngidagi raqamga qarang.",
        ru: 'Для решения смотри на цифру сразу справа от выбранного разряда.',
        en: 'Use the digit immediately to the right of the target place.',
      },
      {
        uz: "0–4 da pastga, 5–9 da yuqoriga yaxlitlang va o'ng qismini nollar bilan almashtiring.",
        ru: 'При 0–4 округляй вниз, при 5–9 — вверх и заменяй правую часть нулями.',
        en: 'Round down for 0–4, up for 5–9, then replace the digits on the right with zeros.',
      },
    ],
    model: {
      kind: 'reward',
      badge: { uz: "Boshlang'ich missiya yechimi", ru: 'Решение стартовой миссии', en: 'Opening mission solution' },
      number: '120 789 ≈ 121 000',
      proof: '120 789 ≈ 121 000',
    },
    correctText: {
      uz: '120 789 dan 121 000 gacha 211, 120 000 gacha esa 789. Shuning uchun Bitning gapi taxmin sifatida rost.',
      ru: 'От 120 789 до 121 000 — 211, а до 120 000 — 789. Поэтому как приближённое утверждение слова Бита верны.',
      en: "The distance from 120,789 to 121,000 is 211, while the distance to 120,000 is 789. Bit's statement is therefore true as an estimate.",
    },
    bridge: {
      uz: "6-darsda yaxlitlashni sonlarning xonalari va sinflari bilan bog'laymiz.",
      ru: 'В уроке 6 свяжем округление с разрядами и классами чисел.',
      en: 'In Lesson 6, rounding will be connected with places and number classes.',
    },
    rewardTitles: {
      gold: { uz: 'Yaxlitlash ustasi', ru: 'Мастер округления', en: 'Rounding Master' },
      silver: { uz: 'Aniqlik bilimdoni', ru: 'Знаток точности', en: 'Accuracy Expert' },
      bronze: { uz: 'Taxmin tadqiqotchisi', ru: 'Исследователь оценок', en: 'Estimation Explorer' },
    },
    claimLabel: { uz: 'Unvonni olish', ru: 'Получить звание', en: 'Claim title' },
    pendingLabel: {
      uz: 'Avval yakuniy xulosani tinglang',
      ru: 'Сначала дослушайте итог',
      en: 'Listen to the summary first',
    },
    finish: { uz: 'Darsni yakunlash', ru: 'Завершить урок', en: 'Finish lesson' },
    revealPlan: {
      mode: 'audio-segment',
      count: 5,
      steps: { takeaways: [1, 2, 3], proof: 4, bridge: 5 },
      revealHook: 'useAudioSegmentReveal',
      showAllFallbacks: ['muted', 'completed', 'reduced-motion'],
    },
    frameLayout: {
      proof: 'compact-y',
      bridge: 'compact-y',
      scopedCss: true,
    },
    audio: {
      intro: {
        uz: [
          "Shahar hisoboti tayyor. Birinchi qadamda vaziyatga mos aniqlikni va yaxlitlash xonasini tanlang.",
          "Ikkinchi qadam. Tanlangan xonaning darhol o'ngidagi raqamga qarang. Noldan to'rtgacha pastga, beshdan to'qqizgacha yuqoriga yaxlitlanadi.",
          "Uchinchi qadam. Tanlangan xonadan o'ngdagi raqamlarni nolga almashtiring. Yuqoriga yaxlitlashda kerak bo'lsa, to'qqizlar orqali o'ting.",
        ],
        ru: [
          'Городской отчёт перед вами. На первом шаге выбери подходящую для ситуации точность и разряд округления.',
          'Второй шаг. Посмотри на цифру сразу справа. От нуля до четырёх округляй вниз, от пяти до девяти округляй вверх.',
          'Третий шаг. Замени цифры справа нулями. При округлении вверх выполни перенос через девятки, если это нужно.',
        ],
        en: [
          'The city report is ready. In step one, choose the accuracy and target place that suit the situation.',
          'Step two. Look at the digit immediately to the right. Round down from zero to four and round up from five to nine.',
          'Step three. Replace the digits on the right with zeros. When rounding up, carry through any nines if needed.',
        ],
      },
      on_correct: {
        uz: [
          "Boshlang'ich missiya yechimi. Son bir yuz yigirma bir minggacha ikki yuz o'n bir, bir yuz yigirma minggacha yetti yuz sakson to'qqiz qadam. Bitning taxmini rost.",
          "Keyingi missiya. Oltinchi darsda yaxlitlashni sonlarning xonalari va sinflari bilan bog'laymiz.",
        ],
        ru: [
          'Решение стартовой миссии. До ста двадцати одной тысячи двести одиннадцать шагов, а расстояние до ста двадцати тысяч составляет семьсот восемьдесят девять. Оценка Бита верна.',
          'Следующая миссия. В шестом уроке свяжем округление с разрядами и классами чисел.',
        ],
        en: [
          "Opening mission solution. The shorter distance is two hundred and eleven, leading to one hundred and twenty-one thousand. This proves that Bit's estimate is true.",
          'Next mission. In Lesson Six, rounding will be connected with places and number classes.',
        ],
      },
    },
  },
};

const SCREEN_PLAN = [
  { id: 's0', type: 'hook', subtype: 'population-estimate-choice', template: 'HookChoice', mechanic: 'multiple-choice', goal: 'Decide whether Bit\'s estimate is correct and expose the exact-versus-approximate misconception', misconceptions: ['an estimate must equal the exact value digit for digit'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'rule', subtype: 'exact-vs-approximate', template: 'NarratedComparison', mechanic: 'audio-highlight-comparison', goal: 'Distinguish exact and approximate values', misconceptions: ['approximate means exactly equal'], active: true, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'nearest-thousand-proof', template: 'NarratedNumberLine', mechanic: 'audio-sequenced-proof', goal: 'Justify the nearest thousand with distances', misconceptions: ['choose the farther endpoint'], active: true, scored: false, scope: null },
  { id: 's3', type: 'test', subtype: 'number-line-example', template: 'RoundingLineChoice', mechanic: 'multiple-choice', goal: 'Choose the nearer thousand on a number line', misconceptions: ['ignore the midpoint'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's4', type: 'test', subtype: 'context-precision-pairing', template: 'PairingBoard', mechanic: 'pairing', goal: 'Pair exact and approximate forms with their contexts', misconceptions: ['always round identifiers'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's5', type: 'rule', subtype: 'rounding-strategy-algorithm', template: 'NarratedAlgorithmRail', mechanic: 'audio-highlight-algorithm', goal: 'Build the four-step rounding strategy', misconceptions: ['inspect the target digit itself'], active: true, scored: false, scope: null },
  { id: 's6', type: 'rule', subtype: 'precision-comparison', template: 'NarratedPrecisionRows', mechanic: 'audio-sequenced-rows', goal: 'Compare one number at three rounding precisions', misconceptions: ['one result fits every target place'], active: true, scored: false, scope: null },
  { id: 's7', type: 'test', subtype: 'deciding-digit-example', template: 'DigitChoice', mechanic: 'digit-selection', goal: 'Select the digit that decides rounding to thousands', misconceptions: ['inspect the target place or the last digit'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's8', type: 'test', subtype: 'number-input-example', template: 'NumInputScreen', mechanic: 'number-input', goal: 'Enter a rounded value independently', misconceptions: ['keep digits to the right', 'round in the wrong direction'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'rule', subtype: 'carry-through-nines', template: 'NarratedCarry', mechanic: 'audio-sequenced-carry', goal: 'Explain carrying through nines into a new place', misconceptions: ['carry stops at the first nine'], active: true, scored: false, scope: null },
  { id: 's10', type: 'case', subtype: 'rounding-error-analysis', template: 'NarratedErrorComparison', mechanic: 'audio-sequenced-error-analysis', goal: 'Repair an error caused by inspecting the wrong digit', misconceptions: ['inspect the ones digit for hundred rounding'], active: true, scored: false, scope: null },
  { id: 's11', type: 'test', subtype: 'carry-example', template: 'MCScreen', mechanic: 'multiple-choice', goal: 'Round through three nines to one million', misconceptions: ['stop the carry early', 'round to hundreds'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's12', type: 'test', subtype: 'city-report-transfer', template: 'MCScreen', mechanic: 'context-choice', goal: 'Choose a context-appropriate rounded population', misconceptions: ['use the wrong precision', 'leave the exact value'], active: true, scored: true, scope: 'final' },
  { id: 's13', type: 'exploration', subtype: 'near-boundary-question', template: 'RoundingLineChoice', mechanic: 'multiple-choice', goal: 'Choose the nearer thousand when the distances differ by only two', misconceptions: ['choose the upper endpoint because the number looks larger'], active: true, scored: false, scope: null },
  { id: 's14', type: 'summary', subtype: 'title-claim', template: 'TitleClaim', mechanic: 'title-claim', goal: 'Resolve the opening mission and summarize the method', misconceptions: ['partial algorithm'], active: true, scored: false, scope: null },
];

const SCREEN_META = SCREEN_PLAN.map((entry) => ({ ...entry, contentKey: entry.id }));
const TOTAL_SCREENS = 15;
const MOBILE_DESIGN_W = 390;

let runtimeConfig = {
  ttsApiBase: '',
  correctSoundUrl: '',
  wrongSoundUrl: '',
  studentName: '',
  voiceGender: 'f',
  previewMode: false,
};

const configureLesson = (next) => {
  runtimeConfig = { ...runtimeConfig, ...next };
};

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');

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
      const widthScale = window.innerWidth / MOBILE_DESIGN_W;
      const heightScale = window.innerHeight / 760;
      const zoom = window.innerWidth < breakpoint ? Math.min(widthScale, heightScale, 1) : 1;
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
    this.previewTimer = null;
    this.lang = 'ru';
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
  }

  start() {
    if (this.muted) {
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.emit({ completed: false });
    this.playCurrent();
  }

  playCurrent() {
    const segment = this.queue[this.index];
    if (!segment) {
      this.isPlaying = false;
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.playText(segment.text, () => {
      this.index += 1;
      this.playCurrent();
    }, segment.id);
  }

  playText(text, done, id = 'one-off') {
    if (!text || this.muted) {
      done?.();
      return;
    }
    const base = runtimeConfig.ttsApiBase;
    if (base) {
      const audio = this.ensureAudio();
      if (!audio) {
        done?.();
        return;
      }
      audio.onended = () => {
        this.isPlaying = false;
        this.emit({ currentSegment: null });
        done?.();
      };
      audio.onerror = () => {
        this.isPlaying = false;
        this.emit({ currentSegment: null });
        done?.();
      };
      audio.src = buildTtsUrl(base, text, runtimeConfig.voiceGender);
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
          this.isPlaying = true;
          this.emit({ currentSegment: id });
        }).catch(() => {
          this.isPlaying = false;
          this.emit({ completed: true, currentSegment: null });
          done?.();
        });
      }
      return;
    }

    if (!runtimeConfig.previewMode) {
      if (typeof window === 'undefined') {
        done?.();
        return;
      }
      this.isPlaying = true;
      this.emit({ currentSegment: id });
      this.previewTimer = window.setTimeout(() => {
        this.previewTimer = null;
        this.isPlaying = false;
        this.emit({ currentSegment: null });
        done?.();
      }, 1450);
      return;
    }

    // Browser speech is available only in an explicitly enabled local preview.
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      done?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = this.lang === 'en' ? 'en-GB' : this.lang === 'ru' ? 'ru-RU' : 'uz-UZ';
    utterance.rate = 0.94;
    utterance.onstart = () => {
      this.isPlaying = true;
      this.emit({ currentSegment: id });
    };
    utterance.onend = () => {
      if (this.previewUtterance === utterance) this.previewUtterance = null;
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    utterance.onerror = () => {
      if (this.previewUtterance === utterance) this.previewUtterance = null;
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    this.previewUtterance = utterance;
    this.previewTimer = window.setTimeout(() => {
      this.previewTimer = null;
      if (this.previewUtterance !== utterance || this.muted) return;
      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        this.previewUtterance = null;
        done?.();
      }
    }, 50);
  }

  pushOneOff(text) {
    this.stop(false);
    this.queue = [{ id: `feedback-${Date.now()}`, text }];
    this.index = 0;
    this.start();
  }

  replay() {
    this.stop(false);
    this.index = 0;
    this.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stop(false);
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.index = 0;
    this.start();
  }

  stop(emit = true) {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.onended = null;
        this.audio.onerror = null;
      } catch {
        // Audio cleanup is best effort.
      }
    }
    if (this.previewTimer !== null && typeof window !== 'undefined') {
      window.clearTimeout(this.previewTimer);
      this.previewTimer = null;
    }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    if (runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Preview speech cleanup is best effort.
      }
    }
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
  const initiallyMuted = audioEngineInstance?.muted ?? false;
  const [state, setState] = useState({
    isPlaying: false,
    muted: initiallyMuted,
    completed: initiallyMuted,
    currentSegment: null,
  });

  /* eslint-disable react-hooks/refs -- stable queue prevents audio restart loops */
  const segmentsRef = useRef(segments);
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  const previousKeyRef = useRef(segmentsKey);
  if (previousKeyRef.current !== segmentsKey) {
    segmentsRef.current = segments;
    previousKeyRef.current = segmentsKey;
  }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.onStateChange = (next) => setState((previous) => ({ ...previous, ...next }));
    engine.loadQueue(stableSegments);
    if (stableSegments?.length && !engine.muted) {
      const timer = window.setTimeout(() => engine.start(), 250);
      return () => {
        window.clearTimeout(timer);
        engine.stop(false);
        engine.onStateChange = null;
      };
    }
    engine.emit({ completed: true, currentSegment: null });
    return () => {
      engine.stop(false);
      engine.onStateChange = null;
    };
  }, [stableSegments, lang]);

  return {
    ...state,
    replay: () => getAudioEngine()?.replay(),
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

const localizedSegments = (audioValue, lang, prefix) => {
  if (!audioValue) return [];
  const localized = audioValue[lang] ?? audioValue.uz ?? '';
  const values = Array.isArray(localized) ? localized : [localized];
  return values.filter(Boolean).map((text, index) => ({ id: `${prefix}-${index}`, text }));
};

function useCanAnswer(audio) {
  return audio.muted || audio.completed;
}

function useAdvanceGate(solved, audio) {
  if (!solved) return false;
  if (audio.muted) return true;
  return !audio.isPlaying;
}

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try {
    const sound = new Audio(url);
    sound.volume = 0.6;
    const promise = sound.play();
    promise?.catch?.(() => {});
  } catch {
    // SFX must never block the lesson.
  }
};

const stableChoiceOffset = (lessonId, length) => {
  const input = `${lessonId}:${length}`;
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return length > 0 ? (hash >>> 0) % length : 0;
};

const buildOptionOrder = (length, correctIndex, lessonId, ordinal = 0) => {
  const natural = Array.from({ length }, (_, index) => index);
  if (length < 2 || !natural.includes(correctIndex)) return natural;
  const target = (stableChoiceOffset(lessonId, length) + ordinal * (length - 1)) % length;
  const order = natural.filter((index) => index !== correctIndex);
  order.splice(target, 0, correctIndex);
  return order;
};

function useAudioSegmentReveal(audio, segments, count) {
  const [visible, setVisible] = useState(0);
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const fallback = reducedMotion || audio.muted || audio.completed;
  const segmentIds = segments.map((segment) => segment.id);
  const activeIndex = segmentIds.indexOf(audio.currentSegment);

  useEffect(() => {
    if (fallback) {
      const frame = requestAnimationFrame(() => setVisible(count));
      return () => cancelAnimationFrame(frame);
    }
    if (activeIndex >= 0) {
      const frame = requestAnimationFrame(() => setVisible(Math.min(count, activeIndex + 1)));
      return () => cancelAnimationFrame(frame);
    }
    return undefined;
  }, [activeIndex, count, fallback]);

  const replay = useCallback(() => {
    if (!reducedMotion && !audio.muted) setVisible(0);
    audio.replay();
  }, [audio, reducedMotion]);

  const toggleMute = useCallback(() => {
    setVisible(audio.muted ? 0 : count);
    audio.toggleMute();
  }, [audio, count]);

  return { visible, replay, toggleMute };
}

const AudioIndicator = ({ audio }) => {
  const lang = useLang();
  const muteLabel = audio.muted
    ? (lang === 'en' ? "Turn sound on" : lang === 'ru' ? 'Включить звук' : 'Ovozni yoqish')
    : (lang === 'en' ? "Turn sound off" : lang === 'ru' ? 'Выключить звук' : "Ovozni o'chirish");
  const replayLabel = lang === 'en' ? "Replay" : lang === 'ru' ? 'Повторить' : 'Qayta eshitish';
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

// The same canonical Bit used by the approved grade 4 base lesson.
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

const FeedbackBlock = ({ show, correct, children }) => {
  const lang = useLang();
  const visible = show && children !== null && children !== undefined && String(children).trim().length > 0;
  return (
    <div className={`feedback ${visible ? 'feedback-visible' : ''}`} data-g4-role={correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame'} data-g4-feedback={visible ? (correct ? 'solution' : 'wrong') : undefined} aria-hidden={!visible} aria-live="polite">
      <div className={`feedback-card ${correct ? 'feedback-correct' : 'feedback-hint'}`}>
        <span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'} /></span>
        <div>
          <strong>{correct ? (lang === 'en' ? "SOLUTION" : lang === 'ru' ? 'РЕШЕНИЕ' : 'YECHIM') : (lang === 'en' ? "CHECK YOUR STRATEGY" : lang === 'ru' ? 'ПРОВЕРЬ СТРАТЕГИЮ' : "YANA O'YLANG")}</strong>
          <p>{children}</p>
        </div>
      </div>
    </div>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
  const labels = {
    hook: lang === 'en' ? "Mission" : lang === 'ru' ? 'Миссия' : 'Missiya',
    diagnostic: lang === 'en' ? "Diagnostic" : lang === 'ru' ? 'Диагностика' : 'Diagnostika',
    exploration: lang === 'en' ? "Exploration" : lang === 'ru' ? 'Исследование' : 'Kashfiyot',
    rule: lang === 'en' ? "Rule" : lang === 'ru' ? 'Правило' : 'Qoida',
    practice: lang === 'en' ? "Practice" : lang === 'ru' ? 'Практика' : 'Mashq',
    test: lang === 'en' ? "Check" : lang === 'ru' ? 'Проверка' : 'Tekshiruv',
    case: lang === 'en' ? "Problem" : lang === 'ru' ? 'Задача' : 'Vazifa',
    summary: lang === 'en' ? "Summary" : lang === 'ru' ? 'Итог' : 'Yakun',
  };
  return <span className="screen-type">{labels[type] ?? type}</span>;
};

const Stage = ({ screen, eyebrow, audio, children, nav }) => {
  const t = useT();
  const isMobile = useIsMobile();
  const pad = isMobile ? 14 : 48;
  const meta = SCREEN_META[screen];

  return (
    <main className={`stage stage-${meta.type}`}>
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}>
          <div className="progress-bar" style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }} />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title"><span className="status-dot" /><span>{t(eyebrow)}</span></div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={meta.type} />
            {audio && <AudioIndicator audio={audio} />}
            <span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span>
          </div>
        </div>
      </header>
      <section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>
        {children}
      </section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{nav}</footer>
    </main>
  );
};

const NavBack = ({ onClick, hidden = false }) => {
  const lang = useLang();
  return hidden ? <span /> : (
    <button type="button" className="btn btn-ghost" onClick={onClick}>
      <span aria-hidden="true">←</span> {lang === 'en' ? "Back" : lang === 'ru' ? 'Назад' : 'Orqaga'}
    </button>
  );
};

const NavNext = ({ onClick, disabled, finish = false, label }) => {
  const lang = useLang();
  const isDisabled = !canUseGrade4TheoryContinue(!disabled, finish);
  return (
    <button type="button" className={`btn btn-white-accent ${!isDisabled ? 'btn-ready' : ''}`} disabled={isDisabled} aria-disabled={isDisabled} onClick={onClick}>
      {label ?? (finish ? (lang === 'en' ? "Finish lesson" : lang === 'ru' ? 'Завершить урок' : 'Darsni yakunlash') : (lang === 'en' ? "Continue" : lang === 'ru' ? 'Дальше' : 'Davom etish'))}
      <span aria-hidden="true">{finish ? '✓' : '→'}</span>
    </button>
  );
};

const D05Heading = ({ c, kicker }) => {
  const t = useT();
  return (
    <div className="screen-heading screen-heading-no-bit d05-heading">
      <div className="heading-copy">
        <span className="lesson-kicker">{kicker}</span>
        <h1>{t(c.title)}</h1>
        <p>{t(c.lead)}</p>
      </div>
    </div>
  );
};

const D05ModelHeading = ({ badge }) => {
  const t = useT();
  return <div className="d05-model-heading"><span>{t(badge)}</span><i aria-hidden="true">● ● ●</i></div>;
};

const D05RoundingLine = ({ model, showDistances = false, compact = false }) => (
  <div className={'d05-rounding-line ' + (compact ? 'is-compact' : '')}>
    <div className="d05-line-labels">
      <strong>{model.lower}</strong>
      <span>{model.midpoint}</span>
      <strong>{model.upper}</strong>
    </div>
    <div className="d05-line-rail">
      <i className="d05-line-midpoint" aria-hidden="true" />
      <i className="d05-line-marker" style={{ left: model.position + '%' }} aria-hidden="true">
        <b>{model.number}</b>
      </i>
    </div>
    {showDistances && (
      <div className="d05-distance-cards">
        {model.distances.map((distance) => (
          <div key={distance.endpoint}>
            <span>{distance.endpoint}</span>
            <strong>{distance.value}</strong>
          </div>
        ))}
      </div>
    )}
  </div>
);

const D05RoundingFocus = ({ model, solved = false, revealInspect = true, resultOverride = null }) => {
  const digits = String(model.number ?? '').replace(/\s/g, '').split('');
  const result = resultOverride ?? model.result;
  return (
    <div className="d05-focus-board" data-g4-role="visual-frame">
      <D05ModelHeading badge={model.badge} />
      {model.separator && <div className="d05-separator">{model.separator}</div>}
      <div className="d05-focus-digits">
        {digits.map((digit, index) => {
          const inspectVisible = revealInspect || solved;
          const className = index === model.targetIndex
            ? 'is-target'
            : inspectVisible && index === model.inspectIndex
              ? 'is-inspect'
              : '';
          return <span className={className} key={digit + '-' + index}>{digit}</span>;
        })}
      </div>
      <div className="d05-focus-result">
        <i aria-hidden="true">{model.direction === 'up' ? '↗' : '↘'}</i>
        <strong>{result ?? '?'}</strong>
      </div>
    </div>
  );
};

const D05HookVisual = ({ c, selected }) => {
  const t = useT();
  return (
    <section className="data-scene d05-data-scene" data-g4-role="hook-scene visual-frame">
      <div className="city-grid" aria-hidden="true" />
      <div className="d05-hook-data">
        <span>{t(c.model.badge)}</span>
        <div>
          <small>{t(c.model.exactLabel)}</small>
          <strong>{c.model.exactValue}</strong>
        </div>
        <div>
          <small>{t(c.model.bitLabel)}</small>
          <strong>{t(c.model.bitClaim)}</strong>
        </div>
      </div>
      <div className="d05-hook-bit" data-g4-role="hook-bit">
        <BitSVG state={selected === null ? 'present' : 'think'} />
      </div>
    </section>
  );
};

const D05HookScreen = ({ screen, onAnswer, onNext }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT['s' + screen];
  const [picked, setPicked] = useState(null);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [wrongIndices, setWrongIndices] = useState(() => new Set());
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, 's' + screen + '-hook'),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const question = t(c.question);
  const optionOrder = buildOptionOrder(c.options.length, c.correctIndex, LESSON_META.lessonId, 1);

  const choose = (sourceIndex) => {
    if (!canAnswer || solved || wrongIndices.has(sourceIndex)) return;
    const nextAttempts = attempts + 1;
    setPicked(sourceIndex);
    setAttempts(nextAttempts);
    const correct = sourceIndex === c.correctIndex;

    if (!correct) {
      const nextWrong = new Set(wrongIndices);
      nextWrong.add(sourceIndex);
      setWrongIndices(nextWrong);
      playSfx('wrong');
      audio.pushOneOff(t(c.audio?.on_wrong ?? c.wrong?.[sourceIndex]));
      onAnswer?.({
        stage: 'hook',
        screenIdx: screen,
        question,
        options: c.options.map((option) => t(option)),
        correctIndex: c.correctIndex,
        correctAnswer: t(c.options[c.correctIndex]),
        studentAnswerIndex: sourceIndex,
        studentAnswer: t(c.options[sourceIndex]),
        correct: false,
        firstTry: false,
        attempts: nextAttempts,
        wrongIndices: [...nextWrong],
        skillTag: SCREEN_META[screen].subtype,
        solved: false,
      });
      return;
    }

    setSolved(true);
    playSfx('correct');
    audio.pushOneOff(t(c.audio?.on_correct ?? c.correctText));
    onAnswer?.({
      stage: 'hook',
      screenIdx: screen,
      question,
      options: c.options.map((option) => t(option)),
      correctIndex: c.correctIndex,
      correctAnswer: t(c.options[c.correctIndex]),
      studentAnswerIndex: sourceIndex,
      studentAnswer: t(c.options[sourceIndex]),
      correct: true,
      firstTry: nextAttempts === 1,
      attempts: nextAttempts,
      wrongIndices: [...wrongIndices],
      skillTag: SCREEN_META[screen].subtype,
      solved: true,
    });
  };

  const feedback = solved
    ? t(c.correctText)
    : picked !== null
      ? t(c.wrong?.[picked])
      : '';

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack hidden /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack d05-choice-screen d05-hook-screen" data-g4-screen="hook" data-g4-mechanic="multiple-choice">
        <div className="d05-hook-heading">
          <h1 id={'question-' + screen} className="d05-hook-prompt" data-g4-role="hook-title hook-question">{question}</h1>
        </div>
        <D05HookVisual c={c} selected={picked} />
        <section className="question-card d05-hook-options-card" aria-labelledby={'question-' + screen}>
          <div className="question-topline">
            <span>{lang === 'en' ? 'YOUR ANSWER' : lang === 'ru' ? 'ТВОЙ ОТВЕТ' : 'SIZNING JAVOBINGIZ'}</span>
            {!canAnswer && <small>{lang === 'en' ? 'Listen first' : lang === 'ru' ? 'Сначала послушай' : 'Avval tinglang'}</small>}
          </div>
          <div className="options-grid">
            {optionOrder.map((sourceIndex, displayIndex) => {
              const option = c.options[sourceIndex];
              const isWrong = wrongIndices.has(sourceIndex);
              const isCorrect = solved && sourceIndex === c.correctIndex;
              return (
                <button
                  type="button"
                  className={'option ' + (isWrong ? 'option-picked-wrong ' : '') + (isCorrect ? 'option-correct ' : '') + (solved && !isCorrect ? 'option-dismissed ' : '')}
                  key={t(option) + '-' + sourceIndex}
                  disabled={!canAnswer || solved || isWrong}
                  onClick={() => choose(sourceIndex)}
                  data-g4-role="answer-card"
                  data-g4-branch="choice"
                  data-g4-source-index={sourceIndex}
                  data-g4-correct={sourceIndex === c.correctIndex ? 'true' : 'false'}
                >
                  <span className="option-letter">{String.fromCharCode(65 + displayIndex)}</span>
                  <span>{t(option)}</span>
                </button>
              );
            })}
          </div>
          <FeedbackBlock show={picked !== null} correct={solved}>{feedback}</FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
};

const D05ChoiceScreen = ({ screen, choiceOrdinal = 0, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT['s' + screen];
  const restoredAnswer = storedAnswer;
  const restored = restoredAnswer?.solved === true;
  const [picked, setPicked] = useState(restored ? restoredAnswer.studentAnswerIndex : null);
  const [solved, setSolved] = useState(restored);
  const [attempts, setAttempts] = useState(restoredAnswer?.attempts ?? 0);
  const [wrongIndices, setWrongIndices] = useState(() => new Set(restoredAnswer?.wrongIndices ?? []));
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, 's' + screen + '-choice'),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const optionOrder = buildOptionOrder(c.options.length, c.correctIndex, LESSON_META.lessonId, choiceOrdinal);
  const question = t(c.question ?? c.instruction ?? c.title);

  const choose = (sourceIndex) => {
    if (!canAnswer || solved || wrongIndices.has(sourceIndex)) return;
    const nextAttempts = attempts + 1;
    setPicked(sourceIndex);
    setAttempts(nextAttempts);

    const correct = sourceIndex === c.correctIndex;
    if (!correct) {
      const nextWrong = new Set(wrongIndices);
      nextWrong.add(sourceIndex);
      setWrongIndices(nextWrong);
      playSfx('wrong');
      audio.pushOneOff(t(c.audio?.on_wrong ?? c.wrong?.[sourceIndex]));
      onAnswer?.({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question,
        options: c.options.map((option) => t(option)),
        correctIndex: c.correctIndex,
        correctAnswer: t(c.options[c.correctIndex]),
        studentAnswerIndex: sourceIndex,
        studentAnswer: t(c.options[sourceIndex]),
        correct: false,
        firstTry: false,
        attempts: nextAttempts,
        wrongIndices: [...nextWrong],
        skillTag: SCREEN_META[screen].subtype,
        solved: false,
      });
      return;
    }

    setSolved(true);
    playSfx('correct');
    audio.pushOneOff(t(c.audio?.on_correct ?? c.correctText));
    onAnswer?.({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question,
      options: c.options.map((option) => t(option)),
      correctIndex: c.correctIndex,
      correctAnswer: t(c.options[c.correctIndex]),
      studentAnswerIndex: sourceIndex,
      studentAnswer: t(c.options[sourceIndex]),
      correct: true,
      firstTry: nextAttempts === 1,
      attempts: nextAttempts,
      wrongIndices: [...wrongIndices],
      skillTag: SCREEN_META[screen].subtype,
      solved: true,
    });
  };

  const feedback = solved
    ? t(c.correctText)
    : picked !== null
      ? t(c.wrong?.[picked])
      : '';
  const optionClass = c.options.length === 3
    ? 'options-three'
    : '';
  const isDigitChoice = c.mechanic === 'digit-selection';

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack d05-choice-screen" data-g4-mechanic={c.mechanic}>
        <D05Heading
          c={c}
          kicker={lang === 'en' ? 'LUMO CITY · EXAMPLE LAB' : lang === 'ru' ? 'LUMO CITY · ЛАБОРАТОРИЯ ПРИМЕРОВ' : 'LUMO CITY · MISOLLAR LABORATORIYASI'}
        />
        {c.model.kind === 'roundingLineSelection'
          ? <div className="d05-line-board" data-g4-role="visual-frame"><D05ModelHeading badge={c.model.badge} /><D05RoundingLine model={c.model} showDistances={solved} compact /></div>
          : <D05RoundingFocus
              model={c.model}
              solved={solved}
              revealInspect={screen !== 7}
              resultOverride={solved && c.model.result === '?' ? c.options[c.correctIndex] : null}
            />}
        <section className="question-card" aria-labelledby={'question-' + screen}>
          <div className="question-topline">
            <span>{lang === 'en' ? 'YOUR ANSWER' : lang === 'ru' ? 'ТВОЙ ОТВЕТ' : 'SIZNING JAVOBINGIZ'}</span>
            {!canAnswer && <small>{lang === 'en' ? 'Listen first' : lang === 'ru' ? 'Сначала послушай' : 'Avval tinglang'}</small>}
          </div>
          <h2 id={'question-' + screen}>{question}</h2>
          <div className={'options-grid ' + optionClass + (isDigitChoice ? ' digit-options' : '')}>
            {optionOrder.map((sourceIndex, displayIndex) => {
              const option = c.options[sourceIndex];
              const isWrong = wrongIndices.has(sourceIndex);
              const isCorrect = solved && sourceIndex === c.correctIndex;
              return (
                <button
                  type="button"
                  className={'option ' + (isWrong ? 'option-picked-wrong ' : '') + (isCorrect ? 'option-correct ' : '') + (solved && !isCorrect ? 'option-dismissed ' : '')}
                  key={t(option) + '-' + sourceIndex}
                  disabled={!canAnswer || solved || isWrong}
                  onClick={() => choose(sourceIndex)}
                  data-g4-branch="choice"
                  data-g4-source-index={sourceIndex}
                  data-g4-correct={sourceIndex === c.correctIndex ? 'true' : 'false'}
                >
                  <span className="option-letter">{String.fromCharCode(65 + displayIndex)}</span>
                  <span>{t(option)}</span>
                </button>
              );
            })}
          </div>
          <FeedbackBlock show={picked !== null} correct={solved}>{feedback}</FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
};

const D05AudioFrame = ({ as: Tag = 'div', step, visible, className = '', children }) => (
  <Tag
    className={className + ' audio-reveal ' + (visible >= step ? 'is-visible' : '')}
    aria-hidden={visible < step}
  >
    {children}
  </Tag>
);

const d05VoiceState = (visible, step) => (
  visible === step ? 'is-current' : visible > step ? 'is-heard' : ''
);

const D05NarratedVisual = ({ c, visible }) => {
  const t = useT();
  const model = c.model;

  if (model.kind === 'exactVsApproximate') {
    return (
      <section className="d05-narrated-board d05-exact-board" data-g4-role="visual-frame">
        <D05ModelHeading badge={model.badge} />
        <div className="d05-exact-grid">
          {model.cards.map((card, index) => (
            <article className={'d05-exact-card tone-' + card.tone + ' ' + d05VoiceState(visible, index + 1)} key={card.id}>
              <span>{t(card.label)}</span>
              <strong>{card.mark ? card.mark + ' ' : ''}{card.value}</strong>
              <p>{t(card.note)}</p>
            </article>
          ))}
        </div>
        <div className={'d05-relation-strip ' + d05VoiceState(visible, 3)}>
          <strong>{model.relation}</strong>
          <p>{t(c.conclusion)}</p>
        </div>
      </section>
    );
  }

  if (model.kind === 'guidedRoundingLine') {
    return (
      <section className="d05-narrated-board d05-line-proof" data-g4-role="visual-frame">
        <D05ModelHeading badge={model.badge} />
        <D05AudioFrame step={1} visible={visible} className="d05-line-frame">
          <D05RoundingLine model={model} />
        </D05AudioFrame>
        <D05AudioFrame step={2} visible={visible} className="d05-distance-cards d05-proof-distances">
          {model.distances.map((distance) => (
            <div key={distance.endpoint}>
              <span>{distance.endpoint}</span>
              <strong>{distance.value}</strong>
            </div>
          ))}
        </D05AudioFrame>
        <D05AudioFrame step={3} visible={visible} className="d05-narrated-conclusion">
          <strong>{model.number} ≈ {model.upper}</strong>
          <p>{t(c.conclusion)}</p>
        </D05AudioFrame>
      </section>
    );
  }

  if (model.kind === 'steps') {
    return (
      <section className="d05-narrated-board d05-algorithm-board" data-g4-role="visual-frame">
        <D05ModelHeading badge={model.badge} />
        <div className="d05-algorithm-rail">
          {model.steps.map((step, index) => (
            <React.Fragment key={index}>
              <article className={'d05-algorithm-node ' + d05VoiceState(visible, index + 1)}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{t(step).replace(/^\d+\.\s*/, '')}</p>
              </article>
              {index < model.steps.length - 1 && <i aria-hidden="true">→</i>}
            </React.Fragment>
          ))}
        </div>
        <div className="d05-algorithm-result">
          <strong>{model.number} ≈ {model.result}</strong>
          <p>{t(c.conclusion)}</p>
        </div>
      </section>
    );
  }

  if (model.kind === 'precision') {
    return (
      <section className="d05-narrated-board d05-precision-board" data-g4-role="visual-frame">
        <D05ModelHeading badge={model.badge} />
        <D05AudioFrame step={1} visible={visible} className="d05-precision-source">{model.number}</D05AudioFrame>
        <div className="d05-precision-rows">
          {model.rows.map((row, index) => (
            <D05AudioFrame as="article" step={index + 2} visible={visible} className="d05-precision-row" key={row.id}>
              <span>{t(row.label)}</span>
              <i>{row.inspect}</i>
              <strong>{model.number} ≈ {row.value}</strong>
            </D05AudioFrame>
          ))}
        </div>
        <p className="d05-board-note">{t(c.conclusion)}</p>
      </section>
    );
  }

  if (model.kind === 'carry') {
    return (
      <section className="d05-narrated-board d05-carry-board" data-g4-role="visual-frame">
        <D05ModelHeading badge={model.badge} />
        <D05AudioFrame step={1} visible={visible} className="d05-carry-decision">
          <strong>{model.phases[0].expression}</strong>
          <p>{t(model.phases[0].label)}</p>
        </D05AudioFrame>
        <D05AudioFrame step={2} visible={visible} className="d05-aligned-rounding">
          <span>99 000</span>
          <span>+ 1 000</span>
          <i aria-hidden="true" />
          <strong>100 000</strong>
          <b className="d05-carry-arc" aria-hidden="true">↷</b>
          <p>{t(model.phases[1].label)}</p>
        </D05AudioFrame>
        <D05AudioFrame step={3} visible={visible} className="d05-carry-result">
          <strong>{model.phases[2].expression}</strong>
          <p>{t(model.phases[2].label)}</p>
        </D05AudioFrame>
      </section>
    );
  }

  if (model.kind === 'roundingError') {
    const [wrong, right] = model.comparisons;
    return (
      <section className="d05-narrated-board d05-error-board" data-g4-role="visual-frame">
        <D05ModelHeading badge={model.badge} />
        <div className="d05-error-source"><strong>{model.number}</strong><span>{t(model.target)}</span></div>
        <div className="d05-error-grid">
          <D05AudioFrame as="article" step={1} visible={visible} className="d05-error-route d05-error-wrong">
            <span>{t(wrong.label)}</span>
            <div><i>{wrong.inspect}</i><b>→</b><strong>{wrong.result}</strong></div>
          </D05AudioFrame>
          <D05AudioFrame as="article" step={2} visible={visible} className="d05-error-route d05-error-correct">
            <span>{t(right.label)}</span>
            <div><i>{right.inspect}</i><b>→</b><strong className={visible >= 3 ? 'is-visible' : ''}>{right.result}</strong></div>
          </D05AudioFrame>
        </div>
        <D05AudioFrame step={3} visible={visible} className="d05-error-conclusion">
          <strong>{model.number} ≈ {model.correctResult}</strong>
          <p>{t(c.conclusion)}</p>
        </D05AudioFrame>
      </section>
    );
  }

  if (model.kind === 'accuracyCorridor') {
    const points = Object.fromEntries(model.points.map((point) => [point.id, point]));
    const pairs = [
      { outside: points.below, boundary: points.lower },
      { outside: points.upper, boundary: points.above },
    ];
    return (
      <section className="d05-narrated-board d05-boundary-board" data-g4-role="visual-frame">
        <D05ModelHeading badge={model.badge} />
        <div className="d05-boundary-grid">
          {pairs.map((pair, index) => (
            <D05AudioFrame as="article" step={index + 1} visible={visible} className="d05-boundary-card" key={pair.outside.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <small>{t(pair.boundary.label)}</small>
              <strong>{pair.outside.value} → {pair.outside.result}</strong>
              <strong>{pair.boundary.value} → {pair.boundary.result}</strong>
              <p>{t(pair.boundary.note)}</p>
            </D05AudioFrame>
          ))}
        </div>
        <D05AudioFrame step={3} visible={visible} className="d05-boundary-result">
          <BitSVG state="idea" />
          <div>
            <span>{model.count} {t({ uz: 'TA BUTUN SON', ru: 'ЦЕЛЫХ ЧИСЕЛ', en: 'WHOLE NUMBERS' })}</span>
            <strong>{model.lower} ≤ {points.hook.value} ≤ {model.upper}</strong>
            <p>{t(c.rangeSummary)}</p>
          </div>
        </D05AudioFrame>
      </section>
    );
  }

  return null;
};

const D05NarratedScreen = ({ screen, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT['s' + screen];
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, 's' + screen + '-theory'),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const revealCount = c.presentation?.frameCount ?? segments.length;
  const reveal = useAudioSegmentReveal(audio, segments, revealCount);
  const syncedAudio = { ...audio, replay: reveal.replay, toggleMute: reveal.toggleMute };
  const canAdvance = audio.muted || audio.completed;

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={syncedAudio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className={'screen-stack d05-narrated-screen d05-narrated-' + screen} data-g4-mechanic={SCREEN_META[screen].mechanic}>
        <D05Heading
          c={c}
          kicker={lang === 'en' ? 'LUMO CITY · DATA CENTRE' : lang === 'ru' ? 'LUMO CITY · ЦЕНТР ДАННЫХ' : "LUMO CITY · MA'LUMOT MARKAZI"}
        />
        <p className="d05-instruction">{t(c.instruction)}</p>
        <D05NarratedVisual c={c} visible={reveal.visible} />
      </div>
    </Stage>
  );
};

const D05PairingScreen = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT['s' + screen];
  const [matched, setMatched] = useState(storedAnswer?.matched ?? {});
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [hadWrong, setHadWrong] = useState(storedAnswer?.hadWrong ?? false);
  const [wrongPair, setWrongPair] = useState(storedAnswer?.wrongPair ?? null);
  const restored = storedAnswer?.solved === true;
  const [solved, setSolved] = useState(restored);
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, 's' + screen + '-pairing'),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);

  const record = (nextMatched, nextAttempts, nextHadWrong, complete, pairKey = null) => {
    const pairs = Object.entries(nextMatched).map(([contextId, valueId]) => contextId + ':' + valueId);
    onAnswer?.({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.instruction),
      options: c.model.rightCards.map((card) => card.value),
      correctIndex: null,
      correctAnswer: Object.entries(c.model.pairs).map(([left, right]) => left + ':' + right).join(', '),
      studentAnswerIndex: null,
      studentAnswer: pairs.join(', '),
      correct: complete,
      firstTry: complete ? !nextHadWrong : false,
      attempts: nextAttempts,
      matched: nextMatched,
      hadWrong: nextHadWrong,
      wrongPair: pairKey,
      skillTag: SCREEN_META[screen].subtype,
      solved: complete,
    });
  };

  const choosePair = (contextId, valueId) => {
    if (!canAnswer || solved || matched[contextId]) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const pairKey = contextId + ':' + valueId;
    const correct = c.model.pairs[contextId] === valueId;

    if (!correct) {
      setHadWrong(true);
      setWrongPair(pairKey);
      playSfx('wrong');
      audio.pushOneOff(t(c.audio?.on_wrong));
      record(matched, nextAttempts, true, false, pairKey);
      return;
    }

    const nextMatched = { ...matched, [contextId]: valueId };
    const complete = Object.keys(nextMatched).length === c.model.leftCards.length;
    setMatched(nextMatched);
    setWrongPair(null);
    setSolved(complete);
    if (complete) {
      playSfx('correct');
      audio.pushOneOff(t(c.audio?.on_correct ?? c.correctText));
    }
    record(nextMatched, nextAttempts, hadWrong, complete);
  };

  const wrongFeedback = wrongPair ? t(c.wrongByPair?.[wrongPair]) : '';

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack d05-pairing-screen" data-g4-mechanic="pairing">
        <D05Heading
          c={c}
          kicker={lang === 'en' ? 'LUMO CITY · CONTEXT LAB' : lang === 'ru' ? 'LUMO CITY · ЛАБОРАТОРИЯ КОНТЕКСТА' : 'LUMO CITY · VAZIYAT LABORATORIYASI'}
        />
        <section className="d05-pairing-board" data-g4-role="visual-frame" aria-labelledby={'pairing-' + screen}>
          <D05ModelHeading badge={c.model.badge} />
          <h2 id={'pairing-' + screen}>{t(c.instruction)}</h2>
          <div className="d05-pairing-rows">
            {c.model.leftCards.map((contextCard) => (
              <article className={'d05-pairing-row ' + (matched[contextCard.id] ? 'is-matched' : '')} key={contextCard.id}>
                <div>
                  <strong>{t(contextCard.label)}</strong>
                  <p>{t(contextCard.note)}</p>
                </div>
                <div>
                  {c.model.rightCards.map((valueCard) => {
                    const selected = matched[contextCard.id] === valueCard.id;
                    return (
                      <button
                        type="button"
                        className={selected ? 'is-selected' : ''}
                        key={valueCard.id}
                        disabled={!canAnswer || solved || Boolean(matched[contextCard.id])}
                        aria-pressed={selected}
                        data-pair={contextCard.id + ':' + valueCard.id}
                        onClick={() => choosePair(contextCard.id, valueCard.id)}
                      >
                        {valueCard.prefix && <small>{t(valueCard.prefix)}</small>}
                        <strong>{valueCard.value}</strong>
                        <span>{t(valueCard.label)}</span>
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
          <FeedbackBlock show={solved || Boolean(wrongPair)} correct={solved}>
            {solved ? t(c.correctText) : wrongFeedback}
          </FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
};

const D05NumberInputScreen = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT['s' + screen];
  const target = c.answer;
  const restored = storedAnswer?.solved === true;
  const [value, setValue] = useState(restored ? target : (storedAnswer?.studentAnswer ?? ''));
  const [solved, setSolved] = useState(restored);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [hintIndex, setHintIndex] = useState(storedAnswer?.hintIndex ?? null);
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, 's' + screen + '-input'),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const normalize = (entry) => String(entry ?? '').replace(/\s/g, '');
  const feedback = solved
    ? t(c.correctText)
    : hintIndex !== null
      ? t(c.inputWrongDefault) + ' ' + t(c.hints[hintIndex])
      : '';

  const submit = () => {
    const entered = normalize(value);
    if (!canAnswer || solved || !entered) return;
    const nextAttempts = attempts + 1;
    const correct = c.acceptedAnswers.some((answer) => normalize(answer) === entered);
    setAttempts(nextAttempts);

    if (!correct) {
      const nextHint = Math.min(nextAttempts - 1, c.hints.length - 1);
      setHintIndex(nextHint);
      playSfx('wrong');
      audio.pushOneOff(t(c.audio?.on_wrong));
      onAnswer?.({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.instruction),
        options: null,
        correctIndex: null,
        correctAnswer: target,
        studentAnswerIndex: null,
        studentAnswer: entered,
        correct: false,
        firstTry: false,
        attempts: nextAttempts,
        hintIndex: nextHint,
        skillTag: SCREEN_META[screen].subtype,
        solved: false,
      });
      return;
    }

    setValue(target);
    setSolved(true);
    setHintIndex(null);
    playSfx('correct');
    audio.pushOneOff(t(c.audio?.on_correct ?? c.correctText));
    onAnswer?.({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.instruction),
      options: null,
      correctIndex: null,
      correctAnswer: target,
      studentAnswerIndex: null,
      studentAnswer: target,
      correct: true,
      firstTry: nextAttempts === 1,
      attempts: nextAttempts,
      skillTag: SCREEN_META[screen].subtype,
      solved: true,
    });
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack d05-input-screen" data-g4-mechanic="number-input">
        <D05Heading
          c={c}
          kicker={lang === 'en' ? 'LUMO CITY · NUMBER LAB' : lang === 'ru' ? 'LUMO CITY · ЧИСЛОВАЯ ЛАБОРАТОРИЯ' : 'LUMO CITY · SONLAR LABORATORIYASI'}
        />
        <D05RoundingFocus model={c.model} solved={solved} revealInspect resultOverride={solved ? target : null} />
        <section className="question-card" aria-labelledby={'question-' + screen}>
          <div className="question-topline">
            <span>{lang === 'en' ? 'ENTER THE NUMBER' : lang === 'ru' ? 'ВВЕДИ ЧИСЛО' : 'SONNI KIRITING'}</span>
            {!canAnswer && <small>{lang === 'en' ? 'Listen first' : lang === 'ru' ? 'Сначала послушай' : 'Avval tinglang'}</small>}
          </div>
          <h2 id={'question-' + screen}>{t(c.instruction)}</h2>
          <div className="d05-input-row">
            <input
              className={'answer-input ' + (solved ? 'answer-input-correct' : '')}
              value={value}
              onChange={(event) => {
                setValue(event.target.value.replace(/[^0-9\s]/g, ''));
                if (!solved) setHintIndex(null);
              }}
              onKeyDown={(event) => { if (event.key === 'Enter') submit(); }}
              inputMode="numeric"
              data-qa-answer={runtimeConfig.previewMode ? normalize(target) : undefined}
              autoComplete="off"
              aria-label={lang === 'en' ? 'Number answer' : lang === 'ru' ? 'Числовой ответ' : 'Son javobi'}
              placeholder="0"
              maxLength={c.maxLength}
              disabled={!canAnswer || solved}
            />
            <div className="d05-check-row">
              <button type="button" className="btn btn-white-accent btn-ready btn-check" onClick={submit} disabled={!canAnswer || solved || !normalize(value)}>
                {lang === 'en' ? 'Check' : lang === 'ru' ? 'Проверить' : 'Tekshirish'}
              </button>
            </div>
          </div>
          <FeedbackBlock show={solved || hintIndex !== null} correct={solved}>{feedback}</FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
};

const D05FinaleScreen = ({ screen, storedAnswer, answers = [], onAnswer, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s14;
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro, lang, 's14-finale-takeaway'),
    ...localizedSegments(c.audio?.on_correct, lang, 's14-finale-mission'),
  ], [c.audio, lang]);
  const audio = useAudio(segments);
  const reveal = useAudioSegmentReveal(audio, segments, 5);
  const syncedAudio = { ...audio, replay: reveal.replay, toggleMute: reveal.toggleMute };
  const visible = reveal.visible;
  const complete = visible >= 5;
  const scoredIndexes = useMemo(
    () => SCREEN_META.map((metaEntry, index) => (metaEntry.scored ? index : null)).filter((index) => index !== null),
    [],
  );
  const firstTry = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
  const totalScored = scoredIndexes.length;
  const medalTier = firstTry === totalScored
    ? 'gold'
    : firstTry >= Math.max(1, totalScored - 1)
      ? 'silver'
      : 'bronze';
  const rewardTitle = c.rewardTitles[medalTier];

  const emitTitleClaim = useCallback(() => {
    onAnswer?.({
      stage: null,
      screenIdx: screen,
      question: t(c.claimLabel),
      options: null,
      correctIndex: null,
      correctAnswer: null,
      studentAnswerIndex: null,
      studentAnswer: t(rewardTitle),
      correct: true,
      firstTry: true,
      attempts: 1,
      solved: true,
      titleClaimed: true,
    });
  }, [c.claimLabel, onAnswer, rewardTitle, screen, t]);
  const { titleClaimed, canClaimTitle, revealRequested, claimTitle } = useGrade4TitleClaim({
    storedAnswer,
    audio: syncedAudio,
    onClaim: emitTitleClaim,
  });
  const stageAudio = titleClaimed ? { ...syncedAudio, completed: true } : syncedAudio;

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={stageAudio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={titleClaimed ? finishLesson : undefined} disabled={!titleClaimed} finish label={t(c.finish)} /></>}
    >
      <style>{G4_TITLE_STYLES}</style>
      <Grade4Finale
        lang={lang}
        heading={{
          eyebrow: t({ uz: 'YAKUNIY BOSQICH', ru: 'ФИНАЛЬНЫЙ ЭТАП', en: 'FINAL STAGE' }),
          title: t(c.title),
          lead: t(c.lead),
        }}
        takeaways={c.takeaways.map((takeaway) => t(takeaway))}
        proof={{
          label: t(c.model.badge),
          value: c.model.number,
          text: t(c.correctText),
        }}
        bridge={{
          label: t({ uz: 'KEYINGI MISSIYA', ru: 'СЛЕДУЮЩАЯ МИССИЯ', en: 'NEXT MISSION' }),
          text: t(c.bridge),
          terminal: false,
        }}
        visible={visible}
        complete={complete}
        revealSteps={{ proof: 4, bridge: 5 }}
        canClaimTitle={canClaimTitle}
        canFinish={titleClaimed}
        titleClaimed={titleClaimed}
        onClaimTitle={claimTitle}
        claimLabel={t(c.claimLabel)}
        pendingLabel={t(c.pendingLabel)}
        renderTitleReveal={() => <G4TitleReveal active={titleClaimed} playNow={revealRequested} title={t(rewardTitle)} lang={lang} />}
        renderTitleCard={() => <G4TitleCard title={t(rewardTitle)} lang={lang} firstTry={firstTry} totalScored={totalScored} />}
        bitSlot={<BitSVG state="idea" />}
        medalTier={medalTier}
      />
    </Stage>
  );
};

const Screen0 = (props) => <D05HookScreen {...props} />;
const Screen1 = (props) => <D05NarratedScreen {...props} />;
const Screen2 = (props) => <D05NarratedScreen {...props} />;
const Screen3 = (props) => <D05ChoiceScreen {...props} choiceOrdinal={0} />;
const Screen4 = (props) => <D05PairingScreen {...props} />;
const Screen5 = (props) => <D05NarratedScreen {...props} />;
const Screen6 = (props) => <D05NarratedScreen {...props} />;
const Screen7 = (props) => <D05ChoiceScreen {...props} choiceOrdinal={1} />;
const Screen8 = (props) => <D05NumberInputScreen {...props} />;
const Screen9 = (props) => <D05NarratedScreen {...props} />;
const Screen10 = (props) => <D05NarratedScreen {...props} />;
const Screen11 = (props) => <D05ChoiceScreen {...props} choiceOrdinal={2} />;
const Screen12 = (props) => <D05ChoiceScreen {...props} choiceOrdinal={3} />;
const Screen13 = (props) => <D05ChoiceScreen {...props} choiceOrdinal={4} />;
const Screen14 = (props) => <D05FinaleScreen {...props} />;

const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars05({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  useMobileZoom();
  const showPreviewControls = langProp === undefined || langProp === null;
  const preview = previewMode ?? showPreviewControls;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(showPreviewControls ? previewLang : langProp);
  const safeName = studentName || (lang === 'en' ? 'Student' : lang === 'ru' ? 'Ученик' : "O'quvchi");
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    studentName: safeName,
    voiceGender: voiceGender || 'f',
    previewMode: preview,
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- duration requires a mount timestamp
  const startTimeRef = useRef(Date.now());
  const finishedRef = useRef(false);

  const recordAnswer = useCallback((data) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[data.screenIdx] = data;
      return next;
    });
  }, []);

  const finishLesson = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const scoredIndexes = SCREEN_META.map((meta, index) => (meta.scored ? index : null)).filter((index) => index !== null);
    const scoredAnswers = scoredIndexes.map((index) => answers[index]).filter(Boolean);
    const totalQuestions = scoredIndexes.length;
    const correctAnswers = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang],
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions,
      correctAnswers,
      scorePercent: totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      finalScore: correctAnswers,
      finalTotal: totalQuestions,
      passed: totalQuestions ? correctAnswers / totalQuestions >= 0.6 : false,
      firstTryStats: { total: totalQuestions, firstTryCorrect: correctAnswers },
      attemptsTotal: scoredAnswers.reduce((sum, answer) => sum + (answer.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else console.log('[Grade4 Dars05 preview]', payload);
  }, [answers, lang, onFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
  const previous = () => setCurrent((value) => Math.max(value - 1, 0));

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className={`lesson-root dars05-root ${showPreviewControls ? 'lesson-preview' : ''}`}>
        {showPreviewControls && (
          <div className="preview-language" aria-label={lang === 'en' ? 'Preview language' : lang === 'ru' ? 'Язык предпросмотра' : "Ko'rib chiqish tili"}>
            {SUPPORTED_LANGS.map((code) => (
              <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen
          key={current}
          screen={current}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={recordAnswer}
          onNext={next}
          onPrev={previous}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
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
  overflow: hidden !important;
  overscroll-behavior: none;
}
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root {
  position: fixed;
  inset: 0;
  overflow: clip;
  overscroll-behavior: none;
  contain: strict;
  isolation: isolate;
  font-family: 'Manrope', system-ui, sans-serif;
  color: ${T.ink};
  background:
    radial-gradient(circle at 12% 12%, rgba(22,143,163,.12), transparent 30%),
    radial-gradient(circle at 88% 80%, rgba(255,91,53,.10), transparent 32%),
    linear-gradient(145deg, #F7F8F4 0%, #EEF3F1 100%);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
  zoom: var(--g4z, 1);
}
.lesson-root h1, .lesson-root h2, .lesson-root h3,
.lesson-root h4, .lesson-root h5, .lesson-root h6,
.lesson-root p, .lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }
.lesson-root button { font: inherit; }
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
.preview-language button {
  padding: 4px 9px;
  border: 0;
  border-radius: 999px;
  color: ${T.ink2};
  background: transparent;
  cursor: pointer;
  font-size: 10px;
  font-weight: 900;
}
.preview-language .preview-active { color: #FFFFFF; background: ${T.accent}; }
.stage {
  width: min(936px, 100%);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: rgba(245,245,240,.86);
  box-shadow: 0 0 50px -24px rgba(${T.shadowBase},.28);
}
.stage-header {
  flex: 0 0 auto;
  padding-top: 17px;
  padding-bottom: 12px;
  background: rgba(245,245,240,.94);
  backdrop-filter: blur(14px);
  z-index: 3;
}
.progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(135,148,157,.22);
}
.progress-bar {
  height: 100%;
  border-radius: inherit;
  background: ${T.accent};
  box-shadow: 0 0 10px rgba(255,91,53,.55), 0 0 3px rgba(255,91,53,.42);
  transition: width .45s cubic-bezier(.4,0,.2,1);
}
.stage-chrome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.chrome-title, .chrome-actions, .audio-controls {
  display: flex;
  align-items: center;
  gap: 9px;
}
.chrome-title {
  min-width: 0;
  color: ${T.ink2};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.chrome-title > span:last-child { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.status-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: ${T.accent};
  box-shadow: 0 0 10px rgba(255,91,53,.65);
}
.chrome-actions { flex: 0 0 auto; }
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
  flex: 1 1 auto;
  min-height: 0;
  position: relative;
  padding-top: 10px;
  padding-bottom: 10px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.stage-content > .screen-stack { max-height: 100%; transform-origin: top center; }
.hook-topic-scene { min-height: 196px; padding: 14px 18px; display: grid; grid-template-columns: 96px minmax(0,1fr); align-items: center; gap: 16px; overflow: hidden; border-radius: 23px; color: ${T.paper}; background: radial-gradient(circle at 87% 24%, rgba(121,211,218,.16), transparent 24%),radial-gradient(circle at 9% 88%, rgba(149,201,61,.11), transparent 25%),linear-gradient(145deg, rgba(22,143,163,.25), transparent 48%),linear-gradient(135deg, #153B50, #0B2232 72%); box-shadow: 0 20px 38px -27px rgba(23,59,82,.78); }
.hook-screen { gap: 8px; }
.hook-screen .hook-topic-scene { min-height: 116px; padding-block: 8px; }
.hook-screen .hook-topic-bit { width: 78px; height: 102px; }
.hook-screen .hook-question-card { padding-block: 9px; }
.hook-screen .hook-question-card .option { font-size: 12px; }
.hook-screen .hook-question-card .option > span:last-child { font-weight: 800; }
.hook-screen .feedback { height: 74px; margin-top: 6px; }
.hook-screen .feedback-card { min-height: 74px; padding-block: 5px; grid-template-columns: 64px minmax(0,1fr); }
.hook-screen .feedback-card .g1-char { width: 56px; height: 60px; }
.hook-topic-bit { width: 92px; height: 120px; align-self: end; }
.hook-topic-bit .g1-char { width: 100%; height: 100%; }
.hook-topic-heading { grid-template-columns: minmax(0,1fr); }
.hook-topic-heading .heading-copy h1 { font-size: clamp(24px,3.4vw,34px); }
.hook-topic-heading .heading-copy p { margin-top: 5px; font-size: 12px; line-height: 1.35; }
.hook-topic-model { min-width: 0; }
.hook-topic-model .model-panel { min-height: 0; padding: 8px 10px; border-radius: 0; background: transparent; box-shadow: none; }
.hook-topic-model .model-panel::after { display: none; }
.hook-topic-model .model-heading { margin-bottom: 5px; }
.hook-topic-model .context-card { min-height: 54px; padding: 7px 9px; }
.hook-question-card { padding: 13px 15px; }
.hook-question-card .options-grid { margin-top: 10px; }
.micro-theory-screen { width: 100%; max-height: 100%; gap: 10px; }
.micro-theory-card { display: grid; gap: 8px; min-width: 0; padding: clamp(12px, 2vw, 18px); border-radius: 20px; background: rgba(255,255,255,.88); box-shadow: 0 12px 30px -22px rgba(${T.shadowBase},.45); }
.micro-theory-card > span { color: ${T.cyan}; font-size: 10px; font-weight: 900; letter-spacing: .12em; }
.micro-theory-card h2, .micro-theory-card p { margin: 0; overflow-wrap: anywhere; }
.micro-theory-card h2 { font: 700 clamp(16px, 2.4vw, 23px)/1.2 'Source Serif 4', serif; }
.micro-theory-card p { color: ${T.ink2}; font-size: clamp(12px, 1.7vw, 15px); line-height: 1.45; }
.micro-theory-example { color: ${T.navy}; font: 800 clamp(22px, 4vw, 38px)/1 'JetBrains Mono', monospace; overflow-wrap: anywhere; }
.micro-scale-model { display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; gap: 12px; padding: 9px 11px; border-radius: 15px; color: ${T.navy}; background: linear-gradient(145deg,#F2FBFC,${T.cyanSoft}); box-shadow: inset 0 0 0 1px rgba(22,143,163,.18); }
.micro-scale-model > strong { font: 850 clamp(17px,2.8vw,25px)/1 'JetBrains Mono', monospace; }
.micro-scale-model > div { display: grid; gap: 5px; }
.micro-scale-row { min-width: 0; display: grid; grid-template-columns: minmax(70px,.7fr) minmax(120px,1.3fr) minmax(90px,.8fr); align-items: center; gap: 8px; }
.micro-scale-row > span { color: ${T.navy}; font-size: 9px; font-weight: 850; }
.micro-scale-row > div { position: relative; height: 22px; display: flex; align-items: end; justify-content: space-between; border-top: 2px solid rgba(23,59,82,.36); }
.micro-scale-row small { color: ${T.ink2}; font: 750 8px/1 'JetBrains Mono', monospace; }
.micro-scale-row i { position: absolute; top: -6px; left: var(--micro-marker); width: 11px; height: 11px; border: 2px solid ${T.paper}; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 0 1px ${T.accent}; transform: translateX(-50%); }
.micro-scale-row b { color: ${T.success}; font: 800 10px/1 'JetBrains Mono', monospace; text-align: right; }
.micro-error-model { display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: stretch; gap: 8px; padding: 9px; border-radius: 15px; color: ${T.navy}; background: linear-gradient(145deg,#F2FBFC,${T.cyanSoft}); box-shadow: inset 0 0 0 1px rgba(22,143,163,.18); }
.micro-error-source, .micro-error-fix { min-width: 94px; padding: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; border-radius: 11px; background: rgba(255,255,255,.74); }
.micro-error-source strong, .micro-error-fix strong { font: 850 clamp(16px,2.6vw,24px)/1 'JetBrains Mono', monospace; }
.micro-error-source span { color: ${T.ink2}; font-size: 8px; font-weight: 850; text-align: center; }
.micro-error-drafts { min-width: 0; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 5px; }
.micro-error-drafts > div { min-width: 0; padding: 7px; display: flex; flex-direction: column; justify-content: center; gap: 4px; border-radius: 10px; color: ${T.ink}; background: ${T.warnSoft}; box-shadow: inset 0 3px 0 ${T.warn}; }
.micro-error-drafts span { font-size: 8px; line-height: 1.18; }
.micro-error-drafts strong { font: 800 clamp(12px,2vw,18px)/1 'JetBrains Mono', monospace; }
.micro-error-fix { color: ${T.ink2}; }
.micro-error-fix-visible { color: ${T.navy}; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.28); }
.micro-error-fix span { width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%; color: ${T.paper}; background: ${T.success}; }
.micro-action-row { min-height: 44px; display: flex; justify-content: flex-end; align-items: center; gap: 8px; }
.micro-action-row button { min-height: 42px; padding: 8px 15px; border: 0; border-radius: 12px; color: ${T.cyan}; background: ${T.cyanSoft}; box-shadow: 0 8px 18px -14px rgba(${T.shadowBase},.42); cursor: pointer; font-weight: 850; transition: transform .55s ease, color .55s ease, background .55s ease; }
.micro-action-row button:hover:not(:disabled) { transform: translateY(-1px); }
.micro-action-row button:disabled { cursor: default; opacity: .52; }
.micro-action-row .micro-action-active { color: ${T.paper}; background: ${T.cyan}; }
.micro-action-steps button { min-width: 44px; padding: 8px; }
.micro-theory-result { min-height: 76px; padding: 8px 12px; display: grid; grid-template-columns: 54px minmax(0,1fr); align-items: center; gap: 10px; border-radius: 14px; color: ${T.ink2}; background: #F3F5F2; box-shadow: inset 4px 0 0 ${T.warn}; transition: background .55s ease, box-shadow .55s ease; }
.micro-theory-result-visible { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.micro-theory-result .g1-char { width: 52px; height: 65px; }
.micro-theory-result p { color: inherit; font-size: 12px; line-height: 1.4; font-weight: 750; }
.rounding-flow-screen {
  height: 100%;
  max-height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0,1fr);
  gap: 9px;
  overflow: hidden;
}
.rounding-flow-heading { min-width: 0; }
.rounding-flow-heading .lesson-kicker { margin-bottom: 5px; }
.rounding-flow-heading h1 {
  font: 650 clamp(24px,3.8vw,38px)/1.04 'Source Serif 4',serif;
  letter-spacing: -.02em;
}
.rounding-flow-heading p {
  margin-top: 5px;
  color: ${T.ink2};
  font-size: 12px;
  line-height: 1.35;
}
.rounding-flow-card {
  min-height: 0;
  padding: 10px 14px;
  display: grid;
  grid-template-rows: 20px minmax(126px,1fr) 48px 62px 46px;
  gap: 5px;
  overflow: hidden;
  border-radius: 20px;
  background: rgba(255,255,255,.9);
  box-shadow: 0 14px 32px -22px rgba(${T.shadowBase},.44);
}
.rounding-progress {
  display: grid;
  grid-template-columns: repeat(3,minmax(24px,1fr)) auto;
  align-items: center;
  gap: 6px;
}
.rounding-progress > span {
  height: 5px;
  border-radius: 999px;
  background: rgba(135,148,157,.22);
}
.rounding-progress > span.is-current { background: ${T.accent}; box-shadow: 0 0 9px rgba(255,91,53,.38); }
.rounding-progress > span.is-done { background: ${T.success}; }
.rounding-progress b {
  color: ${T.ink2};
  font: 800 9px/1 'JetBrains Mono',monospace;
  white-space: nowrap;
}
.rounding-number-line {
  min-height: 126px;
  padding: 5px 11px 0;
  display: grid;
  grid-template-rows: 37px minmax(82px,1fr);
  align-content: center;
  border-radius: 15px;
  color: ${T.navy};
  background:
    radial-gradient(circle at 84% 16%,rgba(255,255,255,.72),transparent 26%),
    linear-gradient(145deg,#F2FBFC,${T.cyanSoft});
  background-color: ${T.cyanSoft};
  box-shadow: inset 0 0 0 1px rgba(22,143,163,.18),0 12px 28px -23px rgba(23,59,82,.36);
}
.rounding-source-number {
  align-self: center;
  color: ${T.navy};
  font: 850 clamp(23px,4vw,35px)/1 'JetBrains Mono',monospace;
  letter-spacing: .05em;
  text-align: center;
}
.rounding-axis {
  position: relative;
  min-height: 82px;
  margin: 21px 48px 0;
  border-top: 3px solid rgba(23,59,82,.4);
}
.rounding-midpoint {
  position: absolute;
  top: -9px;
  left: 50%;
  width: 2px;
  height: 15px;
  border-radius: 2px;
  background: rgba(23,59,82,.4);
  transform: translateX(-50%);
}
.rounding-endpoint,
.rounding-given-point {
  position: absolute;
  top: -22px;
  width: 54px;
  height: 54px;
  min-height: 54px;
  display: block;
  padding: 0;
  overflow: visible;
  color: ${T.navy};
  background: transparent;
  border: 0;
  border-radius: 50%;
  font: 800 12px/1 'JetBrains Mono',monospace;
  white-space: nowrap;
  transform: translateX(-50%);
}
.rounding-endpoint-lower { left: 0; }
.rounding-endpoint-upper { left: 100%; }
.rounding-given-point { left: var(--rounding-position); color: ${T.cyan}; pointer-events: none; }
.rounding-endpoint i,
.rounding-given-point i {
  position: absolute;
  top: 22px;
  left: 50%;
  width: 22px;
  height: 22px;
  border: 3px solid ${T.cyan};
  border-radius: 50%;
  background: ${T.paper};
  box-shadow: 0 0 0 2px rgba(22,143,163,.18);
  transform: translate(-50%,-50%);
}
.rounding-given-point i { width: 18px; height: 18px; border-color: ${T.navy}; background: ${T.cyan}; box-shadow: 0 0 0 2px rgba(22,143,163,.18),0 0 12px rgba(22,143,163,.28); }
.rounding-endpoint b,
.rounding-given-point b { position: absolute; top: 37px; left: 50%; width: max-content; padding: 0; border-radius: 0; background: transparent; transform: translateX(-50%); }
.rounding-number-line.is-interactive .rounding-endpoint { cursor: pointer; transition: color .18s ease,transform .18s ease; }
.rounding-number-line.is-interactive .rounding-endpoint:hover:not(:disabled),
.rounding-number-line.is-interactive .rounding-endpoint:focus-visible { color: ${T.cyan}; background: transparent; box-shadow: none; outline: 0; transform: translateX(-50%); }
.rounding-number-line.is-interactive .rounding-endpoint:hover:not(:disabled) i,
.rounding-number-line.is-interactive .rounding-endpoint:focus-visible i { border-color: ${T.navy}; box-shadow: 0 0 0 4px rgba(22,143,163,.22); transform: translate(-50%,-50%) scale(1.08); }
.rounding-number-line.is-interactive .rounding-endpoint:disabled { cursor: default; }
.rounding-endpoint.is-wrong { color: ${T.accent}; background: transparent; box-shadow: none; }
.rounding-endpoint.is-wrong i { background: ${T.accent}; box-shadow: 0 0 0 2px #FFB4A3; }
.rounding-endpoint.is-correct { color: ${T.success}; background: transparent; box-shadow: none; }
.rounding-endpoint.is-correct i { background: ${T.lime}; box-shadow: 0 0 0 2px #C8E88D,0 0 12px rgba(149,201,61,.42); }
.rounding-equation-slot {
  min-height: 48px;
  display: grid;
  place-items: center;
}
.rounding-equation {
  min-height: 44px;
  padding: 6px 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 13px;
  color: ${T.navy};
  background: ${T.cyanSoft};
  font: 850 clamp(17px,2.8vw,24px)/1 'JetBrains Mono',monospace;
  animation: explanation-copy-in .35s ease both;
}
.rounding-equation strong { color: ${T.accent}; font-size: 1.2em; }
.rounding-guided-explanation,
.rounding-feedback-slot {
  min-height: 62px;
}
.rounding-guided-explanation,
.rounding-feedback {
  height: 100%;
  min-height: 62px;
  padding: 7px 10px;
  display: grid;
  grid-template-columns: 31px minmax(0,1fr);
  align-items: center;
  gap: 8px;
  overflow: hidden;
  border-radius: 13px;
  color: ${T.warn};
  background: ${T.warnSoft};
  box-shadow: inset 4px 0 0 ${T.warn};
}
.rounding-guided-explanation.is-visible,
.rounding-feedback-solution { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.rounding-feedback-solution { grid-template-columns: 44px minmax(0,1fr); padding: 4px 8px 4px 5px; }
.rounding-feedback-bit { width: 44px; height: 54px; }
.rounding-feedback-bit .g1-char { width: 100%; height: 100%; }
.rounding-feedback-copy { min-width: 0; display: grid; gap: 1px; }
.rounding-feedback-copy strong { color: ${T.success}; font: 800 12px/1.05 'Source Serif 4',serif; letter-spacing: .04em; }
.rounding-guided-explanation > span,
.rounding-feedback > span {
  width: 29px;
  height: 29px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: ${T.paper};
  background: ${T.warn};
  font-weight: 900;
}
.rounding-guided-explanation.is-visible > span { background: ${T.success}; }
.rounding-feedback-wrong > span { background: ${T.accent}; }
.rounding-guided-explanation > span,
.rounding-feedback > span { text-shadow: 0 1px 0 rgba(0,0,0,.18); }
.rounding-guided-explanation p,
.rounding-feedback p { color: ${T.ink2}; font-size: 11px; line-height: 1.3; font-weight: 730; }
.rounding-feedback-wrong { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 4px 0 0 ${T.accent}; }
.rounding-action-slot {
  min-height: 46px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.rounding-step-next { min-height: 44px; }
.rounding-complete-note {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${T.success};
  font-size: 12px;
  font-weight: 850;
  opacity: 0;
}
.rounding-complete-note.is-visible { opacity: 1; }
.rounding-complete-note i { width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; color: ${T.paper}; background: ${T.success}; font-style: normal; }
.hook-question { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 10px 14px; border-radius: 16px; color: ${T.navy}; background: ${T.cyanSoft}; }
.hook-question span { width: 28px; height: 28px; flex: 0 0 28px; display: grid; place-items: center; border-radius: 50%; color: white; background: ${T.cyan}; font-weight: 900; }
.hook-question strong { font-size: clamp(13px, 2vw, 17px); overflow-wrap: anywhere; }
.stage-nav {
  flex: 0 0 auto;
  min-height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  background: rgba(245,245,240,.97);
  box-shadow: 0 -12px 28px -25px rgba(${T.shadowBase},.45);
  z-index: 3;
}
.btn {
  min-height: 48px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 0;
  border-radius: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .2s ease, color .2s ease, background .2s ease, box-shadow .2s ease, opacity .2s ease;
}
.btn-ghost { color: ${T.ink}; background: transparent; }
.btn-ghost:hover { background: ${T.paper}; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},.28); }
.btn-white-accent {
  margin-left: auto;
  color: ${T.accent};
  background: ${T.paper};
  box-shadow: 0 8px 22px -6px rgba(255,91,53,.30), 0 0 0 1px rgba(255,91,53,.12);
}
.btn-white-accent.btn-ready:hover { color: ${T.paper}; background: ${T.accent}; transform: translateY(-1px); box-shadow: 0 12px 28px -6px rgba(255,91,53,.50); }
.btn:disabled { opacity: .42; cursor: not-allowed; transform: none; box-shadow: none; }
.screen-stack {
  width: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(12px, 2vw, 18px);
  animation: screen-in .5s cubic-bezier(.22,.8,.3,1) both;
}
@keyframes screen-in {
  from { opacity: 0; transform: translateY(16px) scale(.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.audio-reveal {
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px) scale(.985);
  filter: blur(3px);
  transition: opacity .5s ease, transform .6s cubic-bezier(.16,1,.3,1), filter .45s ease, visibility 0s linear .5s;
}
.audio-reveal.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
  filter: blur(0);
  transition-delay: 0s;
}
.screen-heading { display: grid; grid-template-columns: minmax(0,1fr) 118px; align-items: center; gap: 20px; }
.screen-heading-no-bit { grid-template-columns: minmax(0,1fr); }
.heading-copy { min-width: 0; }
.lesson-kicker {
  display: inline-block;
  margin-bottom: 8px;
  color: ${T.cyan};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .15em;
}
.heading-copy h1 {
  max-width: 760px;
  font-family: 'Source Serif 4', serif;
  font-size: clamp(29px, 4.6vw, 47px);
  line-height: 1.04;
  letter-spacing: -.025em;
  font-weight: 650;
}
.heading-copy p { max-width: 720px; margin-top: 10px; color: ${T.ink2}; font-size: 15px; line-height: 1.52; }
.bit-coach { width: 118px; height: 118px; display: flex; align-items: center; justify-content: center; border-radius: 28px; background: rgba(255,255,255,.66); box-shadow: 0 12px 26px -16px rgba(${T.shadowBase},.28); }
.bit-coach .g1-char { width: 92px; height: 115px; overflow: visible; }
.g1-char {
  display: block;
  height: 100%;
  width: auto;
  filter: drop-shadow(0 6px 12px rgba(58,53,48,.22));
}
.g1-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: g4blink 4.4s 2;
}
@keyframes g4blink {
  0%, 93%, 100% { transform: scaleY(1); }
  96.5% { transform: scaleY(.12); }
}
.g1-bit-ant {
  transform-box: fill-box;
  transform-origin: bottom center;
  animation: g4antbob 2.4s ease-in-out 2;
}
@keyframes g4antbob {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}
.g1-bit-wave {
  transform-box: fill-box;
  transform-origin: bottom left;
  animation: g4wavebig 2.4s ease-in-out 2;
}
@keyframes g4wavebig {
  0%, 100% { transform: rotate(2deg); }
  50% { transform: rotate(-26deg); }
}
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
.bit-double-wave .bit-wave-left { transform-origin: bottom right; animation: bit-wave-left 2.4s ease-in-out 2; }
.bit-double-wave .bit-wave-right { transform-origin: bottom left; animation: bit-wave-right 2.4s ease-in-out 2; }
.bit-think-hand { animation: bit-think-tap 2.4s ease-in-out 2; }
.bit-point-arm { transform-origin: left center; animation: bit-point 2.4s ease-in-out 2; }
.bit-point-target { transform-box: fill-box; transform-origin: center; animation: bit-target 2.4s ease-in-out 2; }
.bit-idea-bulb { animation: bit-idea 2.4s ease-in-out 2; }
.bit-focus-hands { transform-origin: center bottom; animation: bit-focus 2.4s ease-in-out 2; }
.bit-focus-scan { animation: bit-scan 2.4s ease-in-out 2; }
.bit-nod-hand { animation: bit-nod-hand 2.4s ease-in-out 2; }
.bit-nod-check { animation: bit-check 2.4s ease-in-out 2; }
@keyframes bit-wave-left { 0%,100% { transform: rotate(2deg); } 50% { transform: rotate(25deg); } }
@keyframes bit-wave-right { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(-25deg); } }
@keyframes bit-think-tap { 0%,100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(-2px,-3px) rotate(-7deg); } }
@keyframes bit-point { 0%,100% { transform: translateX(0) rotate(0); } 48% { transform: translateX(4px) rotate(-5deg); } }
@keyframes bit-target { 0%,100% { opacity: .38; transform: scale(.72); } 50% { opacity: 1; transform: scale(1.1); } }
@keyframes bit-idea { 0%,100% { opacity: .72; transform: translateY(1px) scale(.9); } 50% { opacity: 1; transform: translateY(-3px) scale(1.08); } }
@keyframes bit-focus { 0%,100% { transform: scale(.96); } 50% { transform: scale(1.05); } }
@keyframes bit-scan { 0%,100% { opacity: .42; transform: translateY(-3px); } 50% { opacity: 1; transform: translateY(6px); } }
@keyframes bit-nod-hand { 0%,100% { transform: rotate(0); } 48% { transform: rotate(-11deg); } }
@keyframes bit-check { 0%,100% { transform: scale(.86); opacity: .72; } 50% { transform: scale(1.08); opacity: 1; } }
.model-panel {
  position: relative;
  padding: 19px;
  overflow: hidden;
  border-radius: 20px;
  background: ${T.navy};
  color: ${T.paper};
  box-shadow: 0 15px 34px -18px rgba(23,59,82,.58);
}
.model-panel::after { content: ''; position: absolute; width: 190px; height: 190px; right: -80px; top: -95px; border-radius: 50%; background: rgba(149,201,61,.12); pointer-events: none; }
.model-heading { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 13px; color: rgba(255,255,255,.74); font-size: 11px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
.model-heading i { color: ${T.lime}; font-style: normal; letter-spacing: .18em; }
.model-number { position: relative; z-index: 1; font-family: 'JetBrains Mono', monospace; font-size: clamp(31px, 6vw, 52px); font-weight: 800; letter-spacing: .08em; text-align: center; white-space: pre-wrap; }
.class-groups { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
.class-group { min-height: 92px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; border-radius: 15px; background: rgba(255,255,255,.10); }
.class-group strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(28px,5vw,42px); letter-spacing: .08em; }
.class-group span { color: rgba(255,255,255,.74); font-size: 12px; font-weight: 700; }
.group-cyan { box-shadow: inset 0 0 0 2px rgba(22,143,163,.65); }
.group-accent { box-shadow: inset 0 0 0 2px rgba(255,91,53,.68); }
.place-table { position: relative; z-index: 1; display: grid; gap: 7px; }
.place-cell { min-width: 0; min-height: 82px; padding: 8px 4px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 7px; border-radius: 12px; background: rgba(255,255,255,.10); text-align: center; }
.place-cell span { min-height: 28px; display: flex; align-items: center; color: rgba(255,255,255,.70); font-size: 9px; line-height: 1.15; }
.place-cell strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(21px,3.7vw,31px); }
.model-rows { position: relative; z-index: 1; display: grid; gap: 9px; }
.model-rows > div { min-height: 58px; padding: 9px 14px; display: flex; align-items: center; justify-content: space-between; gap: 14px; border-radius: 13px; background: rgba(255,255,255,.10); }
.model-rows span { color: rgba(255,255,255,.72); font-size: 12px; font-weight: 750; }
.model-rows strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(20px,4vw,29px); }
.model-accuracyCorridor .model-rows { padding-left: 15px; }
.model-accuracyCorridor .model-rows::before { content: ''; position: absolute; left: 3px; top: 13px; bottom: 13px; width: 4px; border-radius: 4px; background: linear-gradient(${T.lime} 0 74%, ${T.accent} 74% 100%); }
.model-accuracyCorridor .model-rows > div:nth-child(2) { color: ${T.navy}; background: ${T.lime}; box-shadow: 0 10px 24px -16px rgba(149,201,61,.72); }
.model-accuracyCorridor .model-rows > div:nth-child(2) span { color: rgba(23,59,82,.72); }
.model-accuracyCorridor .model-rows > div:last-child { color: #FFD9CF; background: rgba(255,91,53,.17); box-shadow: inset 3px 0 0 ${T.accent}; }
.model-steps { position: relative; z-index: 1; list-style: none; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px; counter-reset: none; }
.model-steps li { min-height: 64px; padding: 11px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(255,255,255,.10); text-align: center; font-size: 12px; line-height: 1.35; font-weight: 720; }
.model-solved { box-shadow: 0 15px 34px -18px rgba(34,122,83,.58), inset 0 0 0 2px rgba(149,201,61,.26); }
.context-cards { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.context-cards-3 { grid-template-columns: repeat(3,minmax(0,1fr)); }
.context-card { min-width: 0; min-height: 112px; padding: 13px; display: flex; flex-direction: column; justify-content: center; gap: 8px; border-radius: 15px; background: rgba(255,255,255,.10); animation: digit-group-in .48s ease var(--model-delay) both; }
.context-card span { color: rgba(255,255,255,.68); font-size: 10px; font-weight: 780; text-transform: uppercase; letter-spacing: .08em; }
.context-card strong { font: 800 clamp(20px,3.4vw,30px)/1.1 'JetBrains Mono', monospace; }
.context-card em { width: fit-content; padding: 5px 8px; border-radius: 8px; color: ${T.navy}; background: ${T.lime}; font-size: 10px; font-style: normal; font-weight: 850; }
.context-accent { box-shadow: inset 0 0 0 2px rgba(255,91,53,.46); }
.context-cyan { box-shadow: inset 0 0 0 2px rgba(22,143,163,.55); }
.context-lime { box-shadow: inset 0 0 0 2px rgba(149,201,61,.54); }
.target-map { position: relative; z-index: 1; display: grid; gap: 8px; }
.target-map-number, .multi-line-source, .precision-source { color: ${T.paper}; font: 800 clamp(27px,4.8vw,43px)/1 'JetBrains Mono', monospace; letter-spacing: .06em; text-align: center; }
.target-map-row { min-height: 54px; padding: 9px 12px; display: grid; grid-template-columns: minmax(70px,.7fr) 1fr auto 1fr auto; align-items: center; gap: 8px; border-radius: 13px; background: rgba(255,255,255,.10); animation: digit-group-in .48s ease var(--model-delay) both; }
.target-map-row > span { color: #9DE3E7; font-size: 11px; font-weight: 850; text-transform: uppercase; }
.target-map-row strong { font: 800 clamp(16px,2.5vw,22px)/1 'JetBrains Mono', monospace; text-align: center; }
.target-map-row i { color: rgba(255,255,255,.42); font-style: normal; }
.target-map-row em { padding: 5px 7px; border-radius: 8px; color: ${T.navy}; background: ${T.lime}; font: 850 10px/1 'JetBrains Mono', monospace; font-style: normal; }
.multi-number-lines { position: relative; z-index: 1; display: grid; gap: 12px; }
.multi-line-source { margin-bottom: 3px; }
.number-line-row { padding: 10px 12px 14px; border-radius: 14px; background: rgba(255,255,255,.09); animation: digit-group-in .5s ease var(--model-delay) both; }
.number-line-meta { margin-bottom: 16px; display: flex; justify-content: space-between; gap: 12px; }
.number-line-meta span { color: #9DE3E7; font-size: 10px; font-weight: 850; text-transform: uppercase; letter-spacing: .08em; }
.number-line-meta em { color: ${T.lime}; font: 800 11px/1 'JetBrains Mono', monospace; font-style: normal; }
.number-line-track { position: relative; height: 32px; display: flex; justify-content: space-between; align-items: end; border-top: 3px solid rgba(255,255,255,.38); }
.number-line-track > span { color: rgba(255,255,255,.78); font: 750 10px/1 'JetBrains Mono', monospace; }
.number-line-marker { position: absolute; top: -10px; left: var(--line-position); width: 17px; height: 17px; border: 4px solid ${T.navy}; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 0 2px ${T.accent}, 0 0 14px rgba(255,91,53,.6); transform: translateX(-50%); animation: marker-drop .7s cubic-bezier(.16,1,.3,1) .4s both; }
.number-line-marker b { position: absolute; left: 50%; bottom: 17px; padding: 4px 6px; border-radius: 7px; color: ${T.navy}; background: ${T.paper}; font: 850 9px/1 'JetBrains Mono', monospace; white-space: nowrap; transform: translateX(-50%); }
.number-line-midpoint { position: absolute; top: -7px; left: 50%; width: 2px; height: 12px; background: ${T.lime}; transform: translateX(-50%); }
@keyframes marker-drop { from { opacity: 0; transform: translate(-50%,-12px) scale(.7); } to { opacity: 1; transform: translate(-50%,0) scale(1); } }
.decision-contrast { position: relative; z-index: 1; display: grid; gap: 13px; }
.decision-scale { height: 48px; padding: 0 10px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; border-radius: 13px; background: linear-gradient(90deg,rgba(22,143,163,.20) 0 49.8%,rgba(149,201,61,.18) 50.2% 100%); }
.decision-scale strong { font: 800 15px/1 'JetBrains Mono', monospace; }
.decision-scale strong:last-child { text-align: right; }
.decision-scale span { padding: 7px; border-radius: 8px; color: ${T.navy}; background: ${T.lime}; font: 850 11px/1 'JetBrains Mono', monospace; }
.decision-cases { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; }
.decision-case { min-width: 0; min-height: 88px; padding: 10px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 7px; border-radius: 13px; background: rgba(255,255,255,.10); animation: digit-group-in .48s ease var(--model-delay) both; }
.decision-case span, .decision-case strong { font: 800 14px/1 'JetBrains Mono', monospace; }
.decision-case strong { text-align: right; }
.decision-case i { width: 27px; height: 27px; display: grid; place-items: center; border-radius: 8px; color: ${T.navy}; background: ${T.paper}; font: 900 12px/1 'JetBrains Mono', monospace; font-style: normal; }
.decision-case b { color: ${T.lime}; text-align: right; font-size: 20px; }
.carry-examples { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11px; }
.carry-example { min-height: 146px; padding: 14px; display: flex; flex-direction: column; justify-content: center; gap: 12px; border-radius: 15px; background: rgba(255,255,255,.10); animation: digit-group-in .5s ease var(--model-delay) both; }
.carry-example > span { color: #9DE3E7; font-size: 10px; font-weight: 850; text-transform: uppercase; }
.carry-example > div { display: flex; align-items: center; justify-content: center; gap: 12px; }
.carry-example strong { font: 800 clamp(20px,3.2vw,30px)/1 'JetBrains Mono', monospace; }
.carry-example i { color: ${T.lime}; font-style: normal; font-size: 22px; animation: carry-arrow 2.4s ease-in-out 2; }
.carry-example small { color: rgba(255,255,255,.66); font: 700 11px/1 'JetBrains Mono', monospace; text-align: center; }
.carry-example small b { color: ${T.lime}; }
@keyframes carry-arrow { 50% { transform: translateX(5px); } }
.precision-board { position: relative; z-index: 1; display: grid; gap: 8px; }
.precision-source { margin-bottom: 4px; }
.precision-row { min-height: 55px; padding: 9px 12px; display: grid; grid-template-columns: 1fr 34px auto 1fr; align-items: center; gap: 9px; border-radius: 13px; background: rgba(255,255,255,.10); animation: digit-group-in .48s ease var(--model-delay) both; }
.precision-row span { color: #9DE3E7; font-size: 11px; font-weight: 850; }
.precision-row i { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 9px; color: ${T.navy}; background: ${T.lime}; font: 900 12px/1 'JetBrains Mono', monospace; font-style: normal; }
.precision-row b { color: rgba(255,255,255,.58); }
.precision-row strong { font: 800 clamp(18px,3vw,26px)/1 'JetBrains Mono', monospace; text-align: right; }
.rounding-focus { position: relative; z-index: 1; display: grid; gap: 17px; }
.rounding-digits { display: flex; justify-content: center; gap: 7px; }
.rounding-digits span { width: clamp(38px,7vw,57px); height: clamp(50px,8vw,68px); display: grid; place-items: center; border-radius: 12px; background: rgba(255,255,255,.10); font: 800 clamp(24px,4vw,37px)/1 'JetBrains Mono', monospace; animation: data-digit-in .55s cubic-bezier(.16,1,.3,1) both; }
.rounding-digits .round-target { box-shadow: inset 0 0 0 3px ${T.cyan}; background: rgba(22,143,163,.24); }
.rounding-digits .round-inspect { color: ${T.navy}; background: ${T.lime}; box-shadow: 0 0 18px rgba(149,201,61,.36); animation: digit-anchor-pulse 2.4s ease-in-out 2; }
@keyframes digit-anchor-pulse { 50% { transform: translateY(-5px); box-shadow: 0 15px 28px -15px rgba(149,201,61,.72); } }
.rounding-result { display: flex; align-items: center; justify-content: center; gap: 14px; }
.rounding-result i { color: ${T.lime}; font-style: normal; font-size: 28px; }
.rounding-result strong { color: ${T.paper}; font: 800 clamp(27px,5vw,43px)/1 'JetBrains Mono', monospace; }
.rounding-error-board { position: relative; z-index: 1; display: grid; gap: 9px; }
.rounding-error-source { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.rounding-error-source span { font: 800 clamp(26px,4vw,38px)/1 'JetBrains Mono', monospace; }
.rounding-error-source em { padding: 6px 9px; border-radius: 9px; color: ${T.navy}; background: ${T.lime}; font-size: 10px; font-style: normal; font-weight: 850; }
.rounding-error-drafts { display: grid; gap: 7px; }
.rounding-error-drafts > div { min-height: 49px; padding: 8px 11px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-radius: 12px; color: #FFD9A0; background: rgba(169,111,19,.17); box-shadow: inset 3px 0 0 ${T.warn}; animation: digit-group-in .48s ease var(--model-delay) both; }
.rounding-error-drafts span { font-size: 10px; font-weight: 760; }
.rounding-error-drafts strong { font: 800 19px/1 'JetBrains Mono', monospace; }
.rounding-error-repair { min-height: 54px; padding: 8px 12px; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 13px; color: ${T.navy}; background: ${T.successSoft}; animation: explanation-copy-in .55s ease .52s both; }
.rounding-error-repair span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 50%; color: ${T.paper}; background: ${T.success}; }
.rounding-error-repair strong { font: 850 25px/1 'JetBrains Mono', monospace; }
.theory-screen .model-panel {
  animation: digit-group-in .48s cubic-bezier(.22,.8,.3,1) .08s both;
}
.theory-screen .class-group,
.theory-screen .place-cell,
.theory-screen .model-rows > div,
.theory-screen .model-steps > li {
  animation: digit-group-in .48s cubic-bezier(.22,.8,.3,1) both;
}
.theory-screen .class-group:nth-child(1),
.theory-screen .place-cell:nth-child(1),
.theory-screen .model-rows > div:nth-child(1),
.theory-screen .model-steps > li:nth-child(1) { animation-delay: .16s; }
.theory-screen .class-group:nth-child(2),
.theory-screen .place-cell:nth-child(2),
.theory-screen .model-rows > div:nth-child(2),
.theory-screen .model-steps > li:nth-child(2) { animation-delay: .27s; }
.theory-screen .place-cell:nth-child(3),
.theory-screen .model-rows > div:nth-child(3),
.theory-screen .model-steps > li:nth-child(3) { animation-delay: .38s; }
.theory-screen .model-rows > div:nth-child(4),
.theory-screen .model-steps > li:nth-child(4) { animation-delay: .49s; }
.theory-screen .place-cell:nth-child(4) { animation-delay: .49s; }
.theory-screen .place-cell:nth-child(5) { animation-delay: .60s; }
.theory-screen .place-cell:nth-child(6) { animation-delay: .71s; }
@keyframes digit-group-in {
  from { opacity: .35; transform: translateY(9px) scale(.94); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.theory-callout {
  padding: 20px 22px;
  border-radius: 20px;
  background: ${T.paper};
  box-shadow: 0 12px 30px -18px rgba(${T.shadowBase},.30);
  animation: explanation-copy-in .56s cubic-bezier(.22,.8,.3,1) .38s both;
}
@keyframes explanation-copy-in {
  from { opacity: .2; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}
.theory-callout h2 {
  font-family: 'Source Serif 4', serif;
  font-size: clamp(20px,3vw,28px);
  line-height: 1.2;
  font-weight: 620;
}
.theory-answer {
  margin-top: 14px;
  padding: 14px 16px;
  display: grid;
  grid-template-columns: 34px minmax(0,1fr);
  align-items: start;
  gap: 10px;
  border-radius: 14px;
  color: ${T.ink};
  background: ${T.cyanSoft};
  box-shadow: inset 4px 0 0 ${T.cyan};
}
.theory-answer-mark {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: ${T.paper};
  background: ${T.cyan};
  font-weight: 900;
}
.theory-answer p { color: ${T.ink2}; font-size: 14px; line-height: 1.5; }
.hook-theory-layout { display: grid; grid-template-columns: 1fr; gap: 14px; align-items: start; }
.hook-mission-scene { position: relative; min-width: 0; }
.hook-mission-scene .model-panel { height: auto; min-height: 0; }
.hook-signal { position: absolute; z-index: 2; top: 18px; right: 18px; display: flex; align-items: end; gap: 4px; }
.hook-signal i { width: 4px; border-radius: 999px; background: ${T.lime}; animation: data-digit-in .65s cubic-bezier(.16,1,.3,1) both; }
.hook-signal i:nth-child(1) { height: 8px; animation-delay: .1s; }
.hook-signal i:nth-child(2) { height: 14px; animation-delay: .2s; }
.hook-signal i:nth-child(3) { height: 20px; animation-delay: .3s; }
.hook-signal i:nth-child(4) { height: 27px; animation-delay: .4s; }
@keyframes data-digit-in {
  from { opacity: 0; transform: translateY(9px) scale(.9); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
.theory-callout-mission { display: flex; flex-direction: column; justify-content: center; background: ${T.accentSoft}; box-shadow: inset 4px 0 0 ${T.accent}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.foundation-theory-layout { display: grid; grid-template-columns: 1fr; gap: 14px; align-items: start; }
.foundation-model-wrap { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.foundation-model-wrap .model-panel { flex: 0 0 auto; }
.foundation-scale-legend { padding: 9px 12px; display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: 7px; border-radius: 12px; color: ${T.ink2}; background: ${T.cyanSoft}; font-size: 10px; font-weight: 850; text-align: center; text-transform: uppercase; }
.foundation-scale-legend i { color: ${T.cyan}; font-style: normal; }
.foundation-recap-strip { padding: 18px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; border-radius: 20px; background: ${T.navy}; }
.foundation-recap-card { min-width: 0; min-height: 130px; padding: 12px 8px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 11px; border-radius: 15px; color: ${T.paper}; background: rgba(255,255,255,.1); animation: digit-group-in .48s ease var(--theory-delay) both; }
.foundation-recap-card span { color: rgba(255,255,255,.68); font-size: 11px; text-align: center; }
.foundation-recap-card strong { font: 800 38px/1 'JetBrains Mono', monospace; }
.rule-theory-layout { position: relative; }
.rule-assembly-line { width: min(480px,86%); height: 34px; margin: -7px auto 5px; display: grid; grid-template-columns: repeat(4,1fr); align-items: center; position: relative; }
.rule-assembly-line::before { content: ''; position: absolute; left: 14%; right: 14%; height: 3px; border-radius: 999px; background: ${T.lime}; transform: scaleX(0); transform-origin: left; animation: rule-line-in .7s ease .55s forwards; }
.rule-assembly-line i { z-index: 1; width: 28px; height: 28px; margin: auto; display: grid; place-items: center; border-radius: 50%; color: ${T.navy}; background: ${T.lime}; font-style: normal; font: 900 12px/1 'JetBrains Mono', monospace; animation: digit-group-in .45s ease var(--theory-delay) both; }
@keyframes rule-line-in { to { transform: scaleX(1); } }
.theory-callout-rule { box-shadow: inset 4px 0 0 ${T.lime}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.strategy-route { padding: 16px; display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: stretch; gap: 9px; border-radius: 20px; background: ${T.navy}; }
.strategy-route > i { align-self: center; color: ${T.lime}; font-style: normal; font-weight: 900; }
.strategy-route-step { min-width: 0; min-height: 92px; padding: 11px; display: flex; flex-direction: column; justify-content: center; gap: 8px; border-radius: 14px; color: ${T.paper}; background: rgba(255,255,255,.1); animation: digit-group-in .48s ease var(--theory-delay) both; }
.strategy-route-step span { width: 27px; height: 27px; display: grid; place-items: center; border-radius: 9px; color: ${T.navy}; background: ${T.lime}; font: 900 11px/1 'JetBrains Mono', monospace; }
.strategy-route-step p { font-size: 12px; line-height: 1.35; font-weight: 720; }
.theory-callout-strategy { margin-top: 14px; box-shadow: inset 4px 0 0 ${T.success}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.error-theory-layout { display: grid; grid-template-columns: minmax(270px,.82fr) minmax(0,1.18fr); gap: 16px; }
.error-theory-layout.error-rounding-layout { grid-template-columns: 1fr; gap: 14px; align-items: start; }
.error-rounding-layout > .model-panel { height: auto; min-height: 0; }
.error-walkthrough-board { padding: 17px; display: flex; flex-direction: column; justify-content: center; gap: 8px; border-radius: 20px; background: ${T.navy}; }
.error-walkthrough-row, .error-repair-result { min-height: 56px; padding: 9px 13px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-radius: 13px; color: ${T.paper}; background: rgba(255,255,255,.1); animation: digit-group-in .48s ease var(--theory-delay) both; }
.error-walkthrough-row span, .error-repair-result span { color: rgba(255,255,255,.68); font-size: 11px; font-weight: 800; text-transform: uppercase; }
.error-walkthrough-row strong, .error-repair-result strong { font: 800 25px/1 'JetBrains Mono', monospace; }
.error-row-draft { box-shadow: inset 4px 0 0 ${T.warn}; }
.error-repair-arrow { color: ${T.lime}; text-align: center; font-size: 22px; font-weight: 900; }
.error-repair-result { color: ${T.navy}; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.error-repair-result span { color: ${T.success}; }
.theory-callout-error { box-shadow: inset 4px 0 0 ${T.warn}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.summary-signal { min-height: 120px; padding: 8px 24px; display: flex; align-items: center; justify-content: center; gap: 24px; border-radius: 20px; color: ${T.paper}; background: ${T.navy}; }
.summary-signal .g1-char { width: 78px; height: 98px; }
.summary-signal strong { font: 800 clamp(27px,5vw,45px)/1 'JetBrains Mono', monospace; letter-spacing: .05em; }
.summary-theory-cards { margin-top: 12px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; }
.summary-theory-cards > div { min-height: 90px; padding: 13px; display: grid; grid-template-columns: 31px minmax(0,1fr); gap: 9px; align-items: start; border-radius: 15px; background: ${T.paper}; box-shadow: 0 10px 25px -18px rgba(${T.shadowBase},.3); animation: digit-group-in .48s ease both; }
.summary-theory-cards > div:nth-child(2) { animation-delay: .12s; }
.summary-theory-cards > div:nth-child(3) { animation-delay: .24s; }
.summary-theory-cards span { color: ${T.accent}; font: 900 11px/1 'JetBrains Mono', monospace; }
.summary-theory-cards p { color: ${T.ink2}; font-size: 12px; line-height: 1.42; }
.theory-callout-summary { margin-top: 12px; box-shadow: inset 4px 0 0 ${T.lime}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.finale-screen { gap: 10px; }
.final-reflection { min-width: 0; display: grid; align-content: start; gap: 7px; }
.final-reflection > span { color: ${T.navy}; font: 800 12px/1.3 'Source Serif 4',serif; }
.final-reflection > div { display: grid; gap: 5px; }
.final-reflection > div button { min-height: 34px; padding: 6px 9px; border: 0; border-radius: 10px; color: ${T.ink2}; background: ${T.paper}; box-shadow: 0 6px 16px -13px rgba(${T.shadowBase},.42); cursor: pointer; text-align: left; font-size: 10px; font-weight: 800; transition: color .55s ease,background .55s ease,transform .55s ease; }
.final-reflection > div button:hover { transform: translateY(-1px); }
.final-reflection > div .reflection-active { color: ${T.paper}; background: ${T.cyan}; }
.finale-heading { min-width: 0; padding: 12px 15px; border-radius: 17px; background: linear-gradient(135deg,${T.paper},${T.cyanSoft}); box-shadow: 0 12px 28px -22px rgba(${T.shadowBase},.38); }.finale-heading > span { display: block; margin-bottom: 4px; color: ${T.accent}; font: 900 9px/1 'JetBrains Mono',monospace; letter-spacing: .15em; }.finale-heading h1 { color: ${T.navy}; font: 650 clamp(20px,3vw,28px)/1.08 'Source Serif 4',serif; overflow-wrap: anywhere; }.finale-heading p { max-width: 760px; margin-top: 5px; color: ${T.ink2}; font-size: 12px; line-height: 1.42; overflow-wrap: anywhere; }
.finale-layout { min-width: 0; display: grid; grid-template-columns: minmax(0,1fr) minmax(248px,.42fr); gap: 10px; align-items: stretch; }.finale-main { min-width: 0; display: flex; flex-direction: column; gap: 9px; }.finale-mastery { min-width: 0; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; }
.finale-takeaway { min-width: 0; min-height: 88px; padding: 10px; display: grid; grid-template-columns: 28px minmax(0,1fr); align-items: start; gap: 7px; border-radius: 14px; background: ${T.paper}; box-shadow: 0 10px 24px -19px rgba(${T.shadowBase},.36); opacity: 0; transform: translateY(8px); transition: opacity .34s ease,transform .34s ease; }.finale-takeaway.is-visible { opacity: 1; transform: none; }.finale-takeaway > span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px; color: ${T.paper}; background: ${T.cyan}; font: 900 10px/1 'JetBrains Mono',monospace; }.finale-takeaway:nth-child(2) > span { background: ${T.accent}; }.finale-takeaway:nth-child(3) > span { background: ${T.success}; }.finale-takeaway p { color: ${T.ink}; font-size: 11px; line-height: 1.38; font-weight: 720; overflow-wrap: anywhere; }
.finale-proof,.finale-bridge { min-width: 0; opacity: 0; transform: translateY(7px); transition: opacity .34s ease,transform .34s ease; }.finale-proof.is-visible,.finale-bridge.is-visible { opacity: 1; transform: none; }.finale-proof { padding: 9px 12px; display: grid; grid-template-columns: auto minmax(0,.7fr) minmax(0,1.3fr); align-items: center; gap: 9px; border-radius: 13px; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }.finale-proof > span,.finale-bridge strong { color: ${T.success}; font: 900 9px/1.2 'JetBrains Mono',monospace; letter-spacing: .1em; }.finale-proof > strong { min-width: 0; color: ${T.navy}; font: 800 12px/1.25 'JetBrains Mono',monospace; overflow-wrap: anywhere; }.finale-proof p,.finale-bridge p { color: ${T.ink2}; font-size: 11px; line-height: 1.35; overflow-wrap: anywhere; }
.finale-bridge { padding: 9px 11px; display: grid; grid-template-columns: 30px minmax(0,1fr); align-items: center; gap: 9px; border-radius: 13px; background: ${T.accentSoft}; }.finale-bridge > span { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 10px; color: ${T.paper}; background: ${T.accent}; font-weight: 900; }.finale-bridge strong { color: ${T.accent}; }.finale-bridge p { margin-top: 3px; }
.finale-reward { position: relative; min-width: 0; min-height: 206px; padding: 15px 76px 14px 62px; display: flex; align-items: center; overflow: hidden; border-radius: 18px; color: ${T.navy}; background: linear-gradient(145deg,#F2FBFC,${T.cyanSoft}); box-shadow: inset 0 0 0 1px rgba(22,143,163,.18),0 16px 32px -22px rgba(${T.shadowBase},.36); }.finale-reward-copy { position: relative; z-index: 2; min-width: 0; }.finale-reward-copy > span { color: ${T.success}; font: 900 9px/1.2 'JetBrains Mono',monospace; letter-spacing: .12em; }.finale-reward-copy h2 { margin-top: 5px; font: 650 19px/1.05 'Source Serif 4',serif; overflow-wrap: anywhere; }.finale-status { margin-top: 10px; }.finale-status strong { display: block; color: ${T.success}; font: 850 25px/1 'JetBrains Mono',monospace; }.finale-status p { margin-top: 3px; font-size: 11px; line-height: 1.25; font-weight: 800; }.finale-status small { display: block; margin-top: 3px; color: ${T.ink2}; font-size: 9px; line-height: 1.3; }.finale-status-neutral strong { font-size: 22px; }
.finale-medal { position: absolute; z-index: 2; left: 11px; top: 50%; width: 39px; height: 39px; display: grid; place-items: center; border-radius: 50%; color: ${T.navy}; background: ${T.lime}; box-shadow: 0 0 0 5px rgba(149,201,61,.14); transform: translateY(-50%) scale(.78); transition: transform .38s ease; }.finale-reward.is-complete .finale-medal { transform: translateY(-50%) scale(1); }.finale-reward-bit { position: absolute; z-index: 1; right: 1px; bottom: -5px; width: 76px; height: 96px; }.finale-reward-bit .g1-char { width: 100%; height: 100%; }.finale-reward.is-complete .finale-reward-bit { animation: finale-bit-float 3.2s ease-in-out 2; }
.finale-confetti i { position: absolute; z-index: 0; top: 12px; left: 20%; width: 5px; height: 9px; border-radius: 3px; background: ${T.lime}; opacity: 0; }.finale-confetti i:nth-child(2) { left: 34%; background: ${T.accent}; transform: rotate(24deg); }.finale-confetti i:nth-child(3) { left: 49%; background: ${T.cyan}; transform: rotate(-20deg); }.finale-confetti i:nth-child(4) { left: 63%; top: 22px; background: ${T.navy}; }.finale-confetti i:nth-child(5) { left: 78%; background: ${T.accent}; transform: rotate(38deg); }.finale-confetti i:nth-child(6) { left: 27%; top: 34px; background: ${T.cyan}; }.finale-confetti i:nth-child(7) { left: 57%; top: 42px; background: ${T.lime}; transform: rotate(-34deg); }.finale-confetti i:nth-child(8) { left: 86%; top: 34px; background: ${T.navy}; }.finale-reward.is-complete .finale-confetti i { animation: finale-confetti-fall 1.45s ease-out both; }.finale-reward.is-complete .finale-confetti i:nth-child(even) { animation-delay: .1s; }
@keyframes finale-bit-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes finale-confetti-fall { 0% { opacity: 0; translate: 0 -8px; } 20% { opacity: .9; } 100% { opacity: 0; translate: 5px 78px; rotate: 160deg; } }
.worked-examples-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.worked-example-card { min-height: 132px; padding: 15px; display: grid; grid-template-columns: 38px minmax(0,1fr); gap: 11px; border-radius: 17px; background: ${T.paper}; box-shadow: 0 12px 28px -20px rgba(${T.shadowBase},.34); animation: digit-group-in .5s ease var(--example-delay) both; }
.worked-example-number { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 11px; color: ${T.paper}; background: ${T.cyan}; font: 900 11px/1 'JetBrains Mono', monospace; }
.worked-example-card h2 { color: ${T.ink}; font-family: 'Source Serif 4', serif; font-size: 16px; line-height: 1.28; font-weight: 650; }
.worked-example-card strong { display: block; margin-top: 8px; color: ${T.success}; font: 800 17px/1.3 'JetBrains Mono', monospace; }
.worked-example-card p { margin-top: 6px; color: ${T.ink2}; font-size: 12px; line-height: 1.4; }
.worked-examples-finish { padding: 8px 15px; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 15px; color: ${T.success}; background: ${T.successSoft}; font-weight: 800; animation: explanation-copy-in .55s ease .55s both; }
.worked-examples-finish .g1-char { width: 54px; height: 68px; }
.question-card { padding: 22px; border-radius: 20px; background: ${T.paper}; box-shadow: 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.question-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; color: ${T.accent}; font-size: 10px; font-weight: 900; letter-spacing: .14em; }
.question-topline small { color: ${T.warn}; font-size: 10px; letter-spacing: 0; }
.question-card h2 { max-width: 780px; font-family: 'Source Serif 4', serif; font-size: clamp(21px,3.2vw,30px); line-height: 1.18; font-weight: 620; }
.options-grid { margin-top: 16px; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.option {
  min-height: 58px;
  padding: 11px 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  border: 0;
  border-radius: 14px;
  background: #F8F8F4;
  color: ${T.ink};
  cursor: pointer;
  text-align: left;
  line-height: 1.34;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.16), 0 6px 16px -10px rgba(${T.shadowBase},.22);
  transition: transform .18s ease, background .18s ease, box-shadow .18s ease, opacity .18s ease;
}
.option:hover:not(:disabled) { transform: translateY(-1px); background: ${T.accentSoft}; box-shadow: inset 0 0 0 1px rgba(255,91,53,.24), 0 10px 20px -12px rgba(255,91,53,.34); }
.option:disabled { cursor: default; }
.option-letter { width: 32px; height: 32px; flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; background: ${T.paper}; color: ${T.cyan}; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 900; box-shadow: 0 4px 12px -8px rgba(${T.shadowBase},.3); }
.option-picked-wrong { color: ${T.warn}; background: ${T.warnSoft}; box-shadow: inset 0 0 0 2px rgba(169,111,19,.28); opacity: .64; }
.option-correct { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.28), 0 8px 20px -12px rgba(34,122,83,.35); }
.option-correct .option-letter { color: ${T.paper}; background: ${T.success}; }
.option-dismissed { opacity: .42; }
.number-entry-row { margin-top: 16px; display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: center; gap: 10px; }
.answer-input {
  width: 100%;
  min-width: 0;
  min-height: 58px;
  padding: 10px 16px;
  border: 0;
  border-radius: 14px;
  outline: none;
  background: #F8F8F4;
  color: ${T.ink};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(21px,4vw,29px);
  font-weight: 800;
  letter-spacing: .07em;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.20), 0 6px 16px -10px rgba(${T.shadowBase},.22);
  transition: box-shadow .18s ease, background .18s ease;
}
.answer-input:focus { background: ${T.paper}; box-shadow: inset 0 0 0 2px rgba(22,143,163,.48), 0 8px 22px -12px rgba(22,143,163,.35); }
.answer-input-correct { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.30); }
.answer-input:disabled { opacity: .72; }
.number-entry-row .answer-input { grid-column: 1 / -1; }
.btn-check { grid-column: 2; justify-self: end; }
.feedback { height: 94px; margin-top: 10px; overflow: visible; opacity: 0; visibility: hidden; transition: opacity .28s ease; }
.feedback-visible { opacity: 1; visibility: visible; }
.feedback-visible > .feedback-card, .feedback-visible > .feedback-card * { visibility: visible; }
.feedback-card { min-height: 94px; padding: 12px 15px 12px 7px; display: grid; grid-template-columns: 82px minmax(0,1fr); align-items: center; gap: 10px; border-radius: 15px; }
.feedback-card .g1-char { width: 76px; height: 92px; }
.feedback-card strong { display: block; margin-bottom: 5px; font-family: 'Source Serif 4', serif; font-size: 13px; letter-spacing: .08em; }
.feedback-card p { color: ${T.ink2}; font-size: 13px; line-height: 1.45; }
.feedback-correct { background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.feedback-correct strong { color: ${T.success}; }
.feedback-hint { background: ${T.warnSoft}; box-shadow: inset 4px 0 0 ${T.warn}; }
.feedback-hint strong { color: ${T.warn}; }
.fact-card, .bridge-card { margin-top: 12px; padding: 13px 15px; display: flex; align-items: flex-start; gap: 11px; border-radius: 13px; }
.fact-card { background: ${T.cyanSoft}; color: ${T.cyan}; }
.fact-card strong { font-size: 10px; letter-spacing: .14em; }
.fact-card p, .bridge-card p { color: ${T.ink2}; font-size: 13px; line-height: 1.42; }
.bridge-card { background: ${T.accentSoft}; }
.bridge-card > span { color: ${T.accent}; font-weight: 900; }
.compact-heading { grid-template-columns: minmax(0,1fr) auto; }
.rapid-score { width: 96px; height: 96px; display: flex; align-items: baseline; justify-content: center; border-radius: 26px; background: ${T.navy}; color: ${T.paper}; box-shadow: 0 12px 26px -15px rgba(23,59,82,.55); }
.rapid-score strong { align-self: center; font-family: 'JetBrains Mono', monospace; font-size: 38px; }
.rapid-score span { align-self: center; color: rgba(255,255,255,.62); font-size: 14px; }
.rapid-dots { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
.rapid-dots i { height: 7px; border-radius: 999px; background: rgba(135,148,157,.24); transition: background .2s ease, box-shadow .2s ease; }
.rapid-dots i.current { background: ${T.accent}; box-shadow: 0 0 9px rgba(255,91,53,.45); }
.rapid-dots i.done { background: ${T.success}; }
.test-complete { margin-top: 14px; padding: 10px 16px; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 15px; background: ${T.successSoft}; color: ${T.success}; font-weight: 800; }
.test-complete .g1-char { width: 62px; height: 74px; }
@keyframes bit-nod { 0%,100% { transform: translateY(0) rotate(0); } 45% { transform: translateY(-5px) rotate(-3deg); } 70% { transform: translateY(1px) rotate(2deg); } }
.lesson-root button:focus-visible { outline: 3px solid rgba(22,143,163,.42); outline-offset: 3px; }
@media (max-width: 760px) {
  .screen-heading { grid-template-columns: minmax(0,1fr) 94px; }
  .bit-coach { width: 94px; height: 102px; }
  .bit-coach .g1-char { width: 78px; height: 100px; }
  .options-grid { grid-template-columns: 1fr; }
  .error-theory-layout { grid-template-columns: 1fr; }
  .finale-layout { grid-template-columns: 1fr; }
  .final-reflection > div { grid-template-columns: repeat(3,minmax(0,1fr)); }
  .final-reflection > div button { text-align: center; }
  .finale-reward { min-height: 132px; }
}
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
  .stage { width: 390px; }
  .stage-header { padding-top: 10px; padding-bottom: 8px; }
  .stage-content { padding-top: 8px; padding-bottom: 8px; }
  .stage-nav { min-height: 66px; padding-top: 8px; }
  .screen-type { display: none; }
  .chrome-title { max-width: 170px; font-size: 11px; }
  .screen-stack { gap: 12px; }
  .hook-screen { gap: 6px; }
  .hook-topic-heading .lesson-kicker { margin-bottom: 3px; font-size: 9px; }
  .hook-topic-heading .heading-copy h1 { font-size: 20px; line-height: 1.05; }
  .hook-topic-heading .heading-copy p { margin-top: 3px; font-size: 10px; line-height: 1.22; }
  .hook-screen .hook-topic-scene { min-height: 108px; padding: 5px 8px; grid-template-columns: 56px minmax(0,1fr); gap: 5px; border-radius: 19px; }
  .hook-screen .hook-topic-bit { width: 56px; height: 78px; }
  .hook-topic-model .model-panel { padding: 4px 6px; }
  .hook-topic-copy h1 { font-size: 20px; }
  .hook-topic-copy > p { font-size: 10px; line-height: 1.28; }
  .hook-topic-copy .model-panel { padding: 7px 8px; }
  .hook-screen .model-dashboard .model-heading { margin-bottom: 5px; font-size: 8px; }
  .hook-screen .model-dashboard .context-cards { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 5px; }
  .hook-screen .model-dashboard .context-card { min-height: 58px; padding: 4px 5px; gap: 3px; }
  .hook-screen .model-dashboard .context-card span { font-size: 7px; letter-spacing: .04em; }
  .hook-screen .model-dashboard .context-card strong { font-size: 16px; }
  .hook-screen .model-dashboard .context-card em { padding: 4px 5px; font-size: 8px; }
  .hook-question-card { padding: 7px 9px; }
  .hook-question-card .question-topline { margin-bottom: 4px; }
  .hook-question-card h2 { font-size: 16px; line-height: 1.15; }
  .hook-question-card .options-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 7px; }
  .hook-question-card .option { min-height: 54px; padding: 7px 8px; font-size: 11px; }
  .hook-screen .feedback { height: 64px; margin-top: 4px; }
  .hook-screen .feedback-card { min-height: 64px; padding-block: 4px; grid-template-columns: 54px minmax(0,1fr); }
  .hook-screen .feedback-card .g1-char { width: 48px; height: 54px; }
  .micro-action-row button { min-height: 44px; }
  .micro-scale-model { grid-template-columns: 1fr; gap: 6px; padding: 7px 8px; }
  .micro-scale-model > strong { font-size: 17px; text-align: center; }
  .micro-scale-row { grid-template-columns: 62px minmax(118px,1fr) 76px; gap: 5px; }
  .micro-scale-row > span { font-size: 8px; }
  .micro-scale-row b { font-size: 8px; }
  .micro-error-model { grid-template-columns: 72px minmax(0,1fr) 58px; gap: 5px; padding: 6px; }
  .micro-error-source, .micro-error-fix { min-width: 0; padding: 5px; }
  .micro-error-source strong, .micro-error-fix strong { font-size: 14px; }
  .micro-error-drafts { gap: 3px; }
  .micro-error-drafts > div { padding: 5px 3px; }
  .micro-error-drafts span { font-size: 7px; }
  .micro-error-drafts strong { font-size: 10px; }
  .rounding-flow-screen { gap: 7px; }
  .rounding-flow-heading .lesson-kicker { margin-bottom: 3px; font-size: 9px; }
  .rounding-flow-heading h1 { font-size: 23px; }
  .rounding-flow-heading p { margin-top: 3px; font-size: 10px; line-height: 1.25; }
  .rounding-flow-card { padding: 8px 9px; grid-template-rows: 18px minmax(122px,1fr) 46px 60px 44px; gap: 4px; border-radius: 16px; }
  .rounding-progress { gap: 4px; }
  .rounding-progress b { font-size: 8px; }
  .rounding-number-line { min-height: 122px; padding-inline: 5px; grid-template-rows: 34px minmax(80px,1fr); }
  .rounding-source-number { font-size: 25px; }
  .rounding-axis { min-height: 80px; margin: 20px 47px 0; }
  .rounding-endpoint,.rounding-given-point { width: 54px; height: 54px; min-height: 54px; font-size: 11px; }
  .rounding-equation-slot { min-height: 46px; }
  .rounding-equation { min-height: 42px; padding-inline: 10px; gap: 8px; font-size: 17px; }
  .rounding-guided-explanation,.rounding-feedback-slot { min-height: 60px; }
  .rounding-guided-explanation,.rounding-feedback { min-height: 60px; padding: 5px 7px; grid-template-columns: 27px minmax(0,1fr); gap: 6px; }
  .rounding-feedback-solution { grid-template-columns: 40px minmax(0,1fr); padding: 3px 6px 3px 4px; }
  .rounding-feedback-bit { width: 40px; height: 50px; }
  .rounding-feedback-copy strong { font-size: 11px; }
  .rounding-guided-explanation > span,.rounding-feedback > span { width: 26px; height: 26px; }
  .rounding-guided-explanation p,.rounding-feedback p { font-size: 9px; line-height: 1.23; }
  .rounding-action-slot { min-height: 44px; }
  .screen-heading { grid-template-columns: minmax(0,1fr) 76px; gap: 8px; }
  .heading-copy h1 { font-size: 27px; }
  .heading-copy p { margin-top: 7px; font-size: 13px; line-height: 1.4; }
  .lesson-kicker { margin-bottom: 5px; font-size: 11px; }
  .bit-coach { width: 76px; height: 82px; border-radius: 20px; }
  .bit-coach .g1-char { width: 62px; height: 78px; }
  .model-panel { padding: 13px; border-radius: 16px; }
  .model-heading { margin-bottom: 9px; font-size: 11px; }
  .model-number { font-size: 30px; }
  .class-groups { gap: 7px; }
  .class-group { min-height: 72px; }
  .class-group strong { font-size: 27px; }
  .class-group span { font-size: 10px; }
  .place-table { gap: 4px; }
  .place-cell { min-height: 64px; padding: 5px 2px; }
  .place-cell span { min-height: 24px; font-size: 7px; }
  .place-cell strong { font-size: 20px; }
  .model-steps { grid-template-columns: 1fr; gap: 5px; }
  .model-steps li { min-height: 42px; padding: 8px; }
  .question-card { padding: 14px; border-radius: 16px; }
  .question-card h2 { font-size: 20px; }
  .options-grid { margin-top: 11px; gap: 7px; }
  .option { min-height: 50px; padding: 8px 10px; font-size: 12px; }
  .option-letter { width: 29px; height: 29px; }
  .feedback-card { grid-template-columns: 66px minmax(0,1fr); min-height: 80px; padding: 8px 10px 8px 3px; }
  .feedback-card .g1-char { width: 62px; height: 76px; }
  .feedback-card p { font-size: 12px; }
  .btn { min-height: 48px; padding: 0 14px; font-size: 12px; }
  .number-entry-row { gap: 7px; }
  .answer-input { min-height: 50px; padding: 8px 11px; font-size: 20px; }
  .lesson-preview .stage-header { padding-top: 60px; }
  .rapid-score { width: 72px; height: 72px; border-radius: 20px; }
  .rapid-score strong { font-size: 30px; }
  .theory-callout { padding: 14px; border-radius: 16px; }
  .theory-answer { padding: 11px; grid-template-columns: 30px minmax(0,1fr); }
  .theory-answer p { font-size: 12px; }
  .foundation-recap-strip { padding: 12px; gap: 6px; }
  .foundation-recap-card { min-height: 90px; padding: 8px 4px; }
  .foundation-recap-card span { font-size: 9px; }
  .foundation-recap-card strong { font-size: 28px; }
  .context-cards, .context-cards-3, .carry-examples, .decision-cases { grid-template-columns: 1fr; }
  .context-card { min-height: 82px; }
  .target-map-row { grid-template-columns: minmax(58px,.7fr) 1fr auto 1fr; padding: 8px; gap: 4px; }
  .target-map-row em { display: none; }
  .target-map-row strong { font-size: 14px; }
  .number-line-row { padding: 8px 8px 13px; }
  .number-line-marker b { font-size: 11px; }
  .decision-case { min-height: 70px; }
  .carry-example { min-height: 102px; }
  .precision-row { grid-template-columns: minmax(78px,1fr) 29px auto 1fr; gap: 5px; padding: 8px; }
  .precision-row strong { font-size: 16px; }
  .rounding-digits { gap: 4px; }
  .rounding-digits span { width: 39px; height: 49px; font-size: 23px; }
  .rounding-error-source span { font-size: 25px; }
  .rounding-error-drafts strong { font-size: 16px; }
  .strategy-route { padding: 11px; grid-template-columns: 1fr; gap: 6px; }
  .strategy-route > i { transform: rotate(90deg); text-align: center; }
  .strategy-route-step { min-height: 62px; }
  .summary-theory-cards { grid-template-columns: 1fr; }
  .worked-examples-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .worked-example-card { min-height: 0; padding: 9px; grid-template-columns: 30px minmax(0,1fr); gap: 7px; }
  .worked-example-number { width: 30px; height: 30px; }
  .worked-example-card h2 { font-size: 13px; }
  .worked-example-card strong { margin-top: 5px; font-size: 14px; }
  .worked-example-card p { margin-top: 4px; font-size: 10px; }
  .summary-signal { min-height: 96px; }
  .finale-heading { padding: 11px 12px; }.finale-heading h1 { font-size: 22px; }.finale-mastery { grid-template-columns: 1fr; gap: 6px; }.finale-takeaway { min-height: 0; padding: 8px 9px; }.finale-proof { grid-template-columns: 1fr; gap: 5px; }.finale-reward { min-height: 116px; padding: 11px 65px 11px 51px; }.finale-reward-copy h2 { font-size: 17px; }.finale-medal { left: 8px; width: 34px; height: 34px; }.finale-reward-bit { width: 62px; height: 78px; }
}
@media (max-width: 639.98px) and (max-height: 700px) {
  .stage-header { padding-top: 6px; padding-bottom: 5px; }
  .progress-track { height: 4px; margin-bottom: 5px; }
  .stage-content { padding-top: 4px; padding-bottom: 4px; }
  .stage-nav { min-height: 54px; padding-top: 4px; padding-bottom: 4px; }
  .btn, .option, .micro-action-row button, .final-reflection button { min-height: 44px; }
  .screen-stack { gap: 7px; }
  .hook-topic-heading .heading-copy h1 { font-size: 18px; line-height: 1.02; }
  .hook-topic-heading .heading-copy p { margin-top: 2px; font-size: 9px; line-height: 1.16; }
  .hook-screen .hook-topic-scene { min-height: 90px; padding-block: 3px; }
  .hook-screen .hook-topic-bit { width: 50px; height: 68px; }
  .hook-question-card h2 { font-size: 14px; line-height: 1.1; }
  .hook-question-card .option { min-height: 48px; padding-block: 5px; font-size: 11px; line-height: 1.18; }
  .hook-screen .feedback { height: 54px; }
  .hook-screen .feedback-card { min-height: 54px; grid-template-columns: 46px minmax(0,1fr); }
  .hook-screen .feedback-card .g1-char { width: 42px; height: 48px; }
  .hook-screen .feedback-card p { font-size: 9px; line-height: 1.2; }
  .screen-heading { grid-template-columns: minmax(0,1fr) 58px; gap: 6px; }
  .rounding-flow-screen { gap: 4px; }
  .rounding-flow-heading h1 { font-size: 19px; }
  .rounding-flow-heading p { font-size: 9px; line-height: 1.18; }
  .rounding-flow-card { padding: 5px 7px; grid-template-rows: 16px minmax(112px,1fr) 40px 54px 44px; gap: 3px; }
  .rounding-progress > span { height: 4px; }
  .rounding-number-line { min-height: 112px; grid-template-rows: 29px minmax(76px,1fr); border-radius: 13px; }
  .rounding-source-number { font-size: 21px; }
  .rounding-axis { min-height: 76px; margin-top: 18px; }
  .rounding-endpoint,.rounding-given-point { top: -22px; width: 54px; height: 54px; min-height: 54px; padding: 0; font-size: 10px; }
  .rounding-equation-slot { min-height: 40px; }
  .rounding-equation { min-height: 38px; font-size: 15px; }
  .rounding-guided-explanation,.rounding-feedback-slot { min-height: 54px; }
  .rounding-guided-explanation,.rounding-feedback { min-height: 54px; }
  .rounding-feedback-solution { grid-template-columns: 34px minmax(0,1fr); padding: 2px 5px 2px 3px; }
  .rounding-feedback-bit { width: 34px; height: 43px; }
  .rounding-feedback-copy strong { font-size: 10px; }
  .rounding-guided-explanation p,.rounding-feedback p { font-size: 8px; line-height: 1.18; }
  .heading-copy h1 { font-size: 21px; }
  .heading-copy p { margin-top: 3px; font-size: 11px; line-height: 1.25; }
  .bit-coach { width: 58px; height: 62px; }
  .bit-coach .g1-char { width: 48px; height: 59px; }
  .model-panel, .question-card { padding: 9px; }
  .feedback-card { min-height: 66px; }
  .finale-reward { min-height: 96px; padding-top: 7px; padding-bottom: 7px; }
  .finale-screen { gap: 5px; }
  .finale-heading { padding: 6px 8px; }
  .finale-heading h1 { font-size: 18px; }
  .finale-heading p { display: none; }
  .finale-layout, .finale-main { gap: 5px; }
  .finale-mastery { grid-template-columns: repeat(3,minmax(0,1fr)); gap: 4px; }
  .finale-takeaway { min-height: 50px; padding: 5px; grid-template-columns: 20px minmax(0,1fr); gap: 4px; }
  .finale-takeaway > span { width: 20px; height: 20px; font-size: 8px; }
  .finale-takeaway p { font-size: 8px; line-height: 1.2; }
  .finale-proof, .finale-bridge { padding: 5px 7px; }
  .final-reflection { gap: 4px; }
  .final-reflection > div { gap: 3px; }
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  .screen-stack { animation: none !important; transform: none !important; }
  .feedback, .feedback * { transition: none !important; }
  .feedback-visible, .feedback-visible * { opacity: 1 !important; visibility: visible !important; }
  .finale-takeaway,.finale-proof,.finale-bridge { opacity: 1 !important; transform: none !important; }
  .finale-confetti { display: none; }
}
/* Grade 4 Dars01 local visual contract */
.lesson-frame .preview-language{display:none!important}
:is(.lesson-root,.d8-root):has([data-g4-screen="hook"]) .stage-content>:is(.stage-fit,.screen-stack){zoom:1!important;transform:none!important}
@media(max-width:639.98px){:is(.lesson-root,.d8-root){width:100%!important;max-width:100%!important;zoom:1!important;transform:none!important}:is(.lesson-root,.d8-root) .stage{width:100%!important;max-width:100%!important}:is(.lesson-root,.d8-root) .stage-content>:is(.stage-fit,.screen-stack){zoom:1!important;transform:none!important}}
:is(.lesson-root,.d8-root){font-family:'Manrope',system-ui,sans-serif}
:is(.lesson-root,.d8-root) h1{font-family:'Source Serif 4',Georgia,serif}
:is(.lesson-root,.d8-root) .question h2,
:is(.lesson-root,.d8-root) .question-card h2{font-family:'Manrope',system-ui,sans-serif}
.screen-count,[class*="formula"],[class*="equation"],[class*="proof-label"]{font-family:'JetBrains Mono',monospace}
.lead,.screen-heading p,.heading-copy p{font-size:clamp(14px,1.8vw,16px)}
[data-g4-role~="hook-title"],[data-g4-role~="hook-question"]{width:100%;text-align:left}
[data-g4-role~="hook-title"]{font:650 clamp(26px,4.2vw,36px)/1.08 'Source Serif 4',Georgia,serif;letter-spacing:-.012em}
[data-g4-role~="hook-question"]{font:750 clamp(17px,2.5vw,21px)/1.3 'Manrope',system-ui,sans-serif}
[data-g4-role~="visual-frame"]{position:relative;isolation:isolate;min-width:0;max-width:100%;overflow:hidden}
[data-g4-role~="visual-frame"] :is(img,svg,canvas,video){display:block;max-width:100%;max-height:100%}
[data-g4-role~="visual-frame"] :is(img,video){width:100%;height:100%;object-fit:contain}
[data-g4-role~="hook-scene"]{width:min(760px, 100%);min-width:0;margin-inline:auto}
[data-g4-role~="hook-scene"] .hook-topic-model{grid-column:1/-1;width:100%;min-width:0;padding-right:116px}
[data-g4-role~="hook-scene"][data-g4-role~="visual-frame"],
[data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{position:relative;isolation:isolate;width:100%;min-width:0;min-height:206px;border-radius:24px;overflow:hidden;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
[data-g4-role~="hook-bit"]{position:absolute!important;right:42px!important;bottom:-4px!important;width:88px!important;height:110px!important;display:block!important;z-index:4}
[data-g4-role~="hook-bit"]>.bit,[data-g4-role~="hook-bit"]>.g1-char,[data-g4-role~="hook-bit"]>svg{width:100%!important;height:100%!important}
[data-g4-role~="feedback-frame"]{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;display:grid;grid-template-columns:62px minmax(0,1fr);align-items:center}
[data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:62px;height:76px}
[data-g4-feedback="wrong"]{background:linear-gradient(135deg,#FFFFFF,#FFF5D9);box-shadow:inset 4px 0 #A96F13}
[data-g4-feedback="solution"]{min-height:72px;padding:7px 12px 7px 6px;border-radius:15px;grid-template-columns:51px minmax(0,1fr);background:linear-gradient(135deg,#FFFFFF,#E7F3EC);box-shadow:inset 4px 0 #227A53}
[data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:51px;height:64px}
[data-g4-role~="bit-answer-comment"] p,[data-g4-role~="bit-answer-comment"] .feedback-copy{font:700 clamp(15px,2vw,18px)/1.35 'Source Serif 4',Georgia,serif}
.rank-boost-overlay{animation-duration:3.8s}
@media(max-width:639.98px){
  [data-g4-role~="hook-title"]{font-size:25px}
  [data-g4-role~="hook-scene"][data-g4-role~="visual-frame"],
  [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}
  [data-g4-role~="hook-bit"]{right:12px!important;bottom:-7px!important;width:68px!important;height:85px!important}
  [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:54px;height:68px}
  [data-g4-feedback="solution"]{min-height:68px}
  [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:47px;height:59px}
}
:is(.lesson-root,.d8-root) [data-g4-role~="hook-title"]{font-size:clamp(26px,4.2vw,36px);font-family:'Source Serif 4',Georgia,serif}
:is(.lesson-root,.d8-root) [data-g4-role~="hook-question"]{font-size:clamp(17px,2.5vw,21px);font-family:'Manrope',system-ui,sans-serif}
:is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"][data-g4-role~="visual-frame"],
:is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{width:min(760px,100%);margin-inline:auto;min-height:206px;border-radius:24px;overflow:hidden}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"]{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;grid-template-columns:62px minmax(0,1fr)}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:62px;height:76px}
:is(.lesson-root,.d8-root) [data-g4-feedback="solution"]{min-height:72px;padding:7px 12px 7px 6px;border-radius:15px;grid-template-columns:51px minmax(0,1fr);background:linear-gradient(135deg,#FFFFFF,#E7F3EC)}
:is(.lesson-root,.d8-root) [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:51px;height:64px}
:is(.lesson-root,.d8-root) [data-g4-feedback="wrong"]{background:linear-gradient(135deg,#FFFFFF,#FFF5D9)}
@media(max-width:639.98px){
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-title"]{font-size:25px}
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"][data-g4-role~="visual-frame"],
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}
  :is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:54px;height:68px}
  :is(.lesson-root,.d8-root) [data-g4-feedback="solution"]{min-height:68px}
  :is(.lesson-root,.d8-root) [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:47px;height:59px}
}
/* Canonical full-width feedback adapter for the nested early-family card. */
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"]:has(>.feedback-card){
  width:100%!important;max-width:100%;box-sizing:border-box;display:block!important;
  padding:0!important;grid-template-columns:none!important
}
:is(.lesson-root,.d8-root) [data-g4-feedback="wrong"][aria-hidden="false"]:has(>.feedback-card){
  height:auto!important;min-height:88px!important;border-radius:18px!important;
  overflow:hidden!important;background:linear-gradient(135deg,#FFFFFF,#FFF5D9)!important;
  box-shadow:inset 4px 0 #A96F13!important
}
:is(.lesson-root,.d8-root) [data-g4-feedback="solution"][aria-hidden="false"]:has(>.feedback-card){
  height:auto!important;min-height:72px!important;border-radius:15px!important;
  overflow:hidden!important;background:linear-gradient(135deg,#FFFFFF,#E7F3EC)!important;
  box-shadow:inset 4px 0 #227A53!important
}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"]:has(>.feedback-card)>.feedback-card{
  width:100%;min-height:inherit;box-sizing:border-box;display:grid!important;align-items:center;
  background:transparent!important;box-shadow:none!important;border-radius:inherit
}
:is(.lesson-root,.d8-root) [data-g4-feedback="wrong"]:has(>.feedback-card)>.feedback-card{
  grid-template-columns:62px minmax(0,1fr)!important;gap:9px;padding:6px 15px 6px 9px!important
}
:is(.lesson-root,.d8-root) [data-g4-feedback="solution"]:has(>.feedback-card)>.feedback-card{
  grid-template-columns:51px minmax(0,1fr)!important;gap:8px;padding:4px 12px 4px 6px!important
}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"][aria-hidden="true"]:has(>.feedback-card){
  height:0!important;min-height:0!important;margin-top:0!important;padding:0!important;
  overflow:hidden!important;background:none!important;box-shadow:none!important;border-radius:0!important
}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]>:is(.bit,.g1-char,svg){
  width:100%!important;height:100%!important
}
@media(max-width:639.98px){
  :is(.lesson-root,.d8-root) [data-g4-feedback="wrong"]:has(>.feedback-card)>.feedback-card{
    grid-template-columns:54px minmax(0,1fr)!important
  }
  :is(.lesson-root,.d8-root) [data-g4-feedback="solution"]:has(>.feedback-card)>.feedback-card{
    grid-template-columns:47px minmax(0,1fr)!important
  }
  :is(.lesson-root,.d8-root) [data-g4-feedback="solution"][aria-hidden="false"]:has(>.feedback-card){min-height:68px!important}
}
@media(max-width:639.98px){
  :is(.lesson-root,.d8-root) .stage-content{overflow:hidden!important;overscroll-behavior:contain}
}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"][data-g4-feedback="solution"]{min-height:72px!important}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"][data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:51px!important;height:64px!important}
@media(max-width:639.98px){
  :is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"][data-g4-feedback="solution"]{min-height:68px!important}
  :is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"][data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:47px!important;height:59px!important}
}
/* Feedback replaces non-essential teaching chrome; no programmatic scroll. */
@media(max-width:639.98px){
  :is(.lesson-root,.d8-root) .screen-stack:has([data-g4-feedback]){
    height:auto!important;min-height:0!important;max-height:100%!important;
    align-content:start!important;gap:6px!important;transform:none!important;animation:none!important
  }
  :is(.lesson-root,.d8-root) .screen-stack:has([data-g4-feedback])>:is(.screen-heading,.heading-block){display:none!important}
  :is(.lesson-root,.d8-root) .screen-stack:has([data-g4-feedback])>.model-panel{display:none!important}
  :is(.lesson-root,.d8-root) :is(.etalon-hook-screen,.hook-screen,.hook-stack):has([data-g4-feedback])>:is(
    .screen-heading,.heading-block,.hook-question-title,.topic-chip,.h-title,.question-title,
    [data-g4-role~="hook-scene"]
  ){display:none!important}
  :is(.lesson-root,.d8-root) .screen-stack:has([data-g4-feedback]) :is(.fact-card,.bridge-card){display:none!important}
  :is(.lesson-root,.d8-root) .screen-stack:has([data-g4-feedback]) [data-g4-role~="feedback-frame"]{
    flex:0 0 auto;max-width:100%
  }
  :is(.lesson-root,.d8-root) .strategy-builder-screen:has([data-g4-feedback="solution"])>.strategy-builder-frame,
  :is(.lesson-root,.d8-root) .reading-matching-screen:has([data-g4-feedback="solution"])>.reading-matching-board{
    display:none!important
  }
  :is(.lesson-root,.d8-root) .builder-interactive-frame:has(>[data-g4-feedback="solution"])>:not([data-g4-feedback]){
    display:none!important
  }
}
@media(max-width:639.98px){
  :is(.lesson-root,.d8-root) .screen-stack:has([data-g4-feedback]){gap:4px!important}
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-title"]{font-size:25px!important;line-height:1.08!important}
  :is(.lesson-root,.d8-root) .hook-topic-heading{display:block!important;width:100%;grid-template-columns:minmax(0,1fr)!important}
  :is(.lesson-root,.d8-root) .hook-topic-heading .heading-copy{width:100%;max-width:none!important}
  :is(.lesson-root,.d8-root) .hook-question-card>h2{display:none!important}
  :is(.lesson-root,.d8-root) .hook-question-card{padding:7px!important}
  :is(.lesson-root,.d8-root) .hook-question-card .options-grid{margin-top:4px!important;gap:4px!important}
  :is(.lesson-root,.d8-root) .hook-question-card .option{gap:4px!important;padding-inline:4px!important}
  :is(.lesson-root,.d8-root) .hook-question-card .option-letter{width:24px!important;height:24px!important;flex-basis:24px!important}
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"]{
    height:164px!important;min-height:164px!important;max-height:164px!important;
    box-sizing:border-box!important;grid-template-columns:minmax(0,1fr)!important;padding:8px 82px 8px 10px!important
  }
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"] .hook-topic-model{
    grid-column:1/-1;width:100%;min-width:0;padding-right:0
  }
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]),
  :is(.lesson-root,.d8-root) .hook-decision:has(+[data-g4-feedback]){padding:7px 8px!important}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]) .question-topline{margin-bottom:4px}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]) h2{font-size:14px!important;line-height:1.14}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]) .options-grid,
  :is(.lesson-root,.d8-root) .hook-answer-panel:has([data-g4-feedback]) .options-grid{margin-top:4px;gap:4px}
}
@media(max-width:639.98px) and (max-height:700px){
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .screen-heading{grid-template-columns:minmax(0,1fr) 54px;gap:5px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .heading-copy h1{font-size:20px;line-height:1.04}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .heading-copy p{margin-top:2px;font-size:10px;line-height:1.2}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .bit-coach{width:54px;height:58px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .bit-coach .g1-char{width:46px;height:56px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-theory-card{padding:8px;gap:5px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-scale-model{grid-template-columns:54px minmax(0,1fr);gap:5px;padding:6px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-scale-model>strong{font-size:15px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-scale-model>div{gap:3px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-scale-row{grid-template-columns:46px minmax(76px,1fr) 54px;gap:3px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-scale-row>span,
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-scale-row b{font-size:7px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-scale-row>div{height:18px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-theory-card h2{font-size:14px;line-height:1.14}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-action-row{min-height:42px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-action-row button{min-height:42px;padding:6px 12px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-theory-result{min-height:68px;padding:4px 8px;grid-template-columns:47px minmax(0,1fr);gap:7px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-theory-result .g1-char{width:47px;height:59px}
  .micro-theory-screen[data-g4-mechanic="ModelCompare"] .micro-theory-result p{font-size:10px;line-height:1.25}
}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-bit"],
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-bit"]>svg{
  transform:none!important;animation:none!important
}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-bit"]{position:relative!important;overflow:hidden!important}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-bit"]>svg{
  position:absolute!important;inset:0!important;display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important
}
.lesson-root .hook-topic-heading .heading-copy h1[data-g4-role~="hook-title"]{font-size:36px}
.lesson-root .hook-screen .hook-question-card{padding:7px 9px}
.lesson-root .hook-screen .hook-question-card>h2{display:none}
.lesson-root .hook-screen .hook-question-card .question-topline{margin-bottom:0}
.lesson-root .hook-screen .hook-question-card .options-grid{margin-top:4px;gap:7px}
.lesson-root .hook-screen:has(.hook-question-card .feedback-visible)>[data-g4-role~="hook-scene"]{display:none}

/* Dars05 v2 · lesson-scoped implementation of approved Grade 4 patterns */
.lesson-root.dars05-root .d05-heading{display:block;margin:0}
.lesson-root.dars05-root .d05-heading .heading-copy{max-width:860px}
.lesson-root.dars05-root .d05-heading h1{font-size:clamp(24px,3.2vw,34px);line-height:1.05}
.lesson-root.dars05-root .d05-heading p{max-width:820px;margin-top:4px;font-size:13px;line-height:1.35}
.lesson-root.dars05-root .d05-instruction{margin:-2px 0 0;color:#50616D;font-size:13px;line-height:1.35}

.lesson-root.dars05-root .d05-hook-screen{gap:9px}
.lesson-root.dars05-root .d05-hook-heading{width:min(900px,100%);margin:0 auto;text-align:left}
.lesson-root.dars05-root .d05-hook-heading .d05-hook-prompt{
  max-width:860px;margin:0;white-space:pre-line;text-align:left;color:#12212C;
  font:750 clamp(18px,2.5vw,21px)/1.3 'Manrope',system-ui,sans-serif
}
.lesson-root.dars05-root .data-scene.d05-data-scene{
  position:relative;isolation:isolate;width:min(760px,100%);min-height:206px;margin:0 auto;
  padding:17px 184px 15px 20px;border-radius:24px;overflow:hidden;color:#EAF9FB;
  background:
    radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),
    radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),
    linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),
    linear-gradient(135deg,#153B50,#0B2232 72%);
  box-shadow:0 22px 50px -30px rgba(14,33,44,.75)
}
.lesson-root.dars05-root .data-scene.d05-data-scene::after{
  content:'';position:absolute;inset:1px;z-index:-1;border:1px solid rgba(144,228,235,.12);
  border-radius:23px;pointer-events:none
}
.lesson-root.dars05-root .d05-data-scene .city-grid{
  position:absolute;inset:0;z-index:-2;opacity:.18;
  background-image:linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px);
  background-size:30px 30px
}
.lesson-root.dars05-root .d05-hook-data{height:100%;display:grid;align-content:center;gap:9px}
.lesson-root.dars05-root .d05-hook-data>span{
  width:max-content;padding:4px 8px;border:1px solid rgba(121,211,218,.22);border-radius:999px;
  color:#A8E3E8;background:rgba(22,143,163,.14);font-size:8px;font-weight:800;letter-spacing:.1em;text-transform:uppercase
}
.lesson-root.dars05-root .d05-hook-data>div{
  min-height:58px;padding:8px 12px;border:1px solid rgba(255,255,255,.10);border-radius:13px;
  display:grid;grid-template-columns:minmax(105px,.72fr) minmax(0,1fr);align-items:center;gap:10px;
  background:rgba(255,255,255,.055);box-shadow:inset 0 1px rgba(255,255,255,.05)
}
.lesson-root.dars05-root .d05-hook-data small{color:#9FDCE2;font-size:9px;font-weight:750;letter-spacing:.05em;text-transform:uppercase}
.lesson-root.dars05-root .d05-hook-data strong{color:#FFFFFF;font-family:'JetBrains Mono',monospace;font-size:clamp(18px,2.8vw,27px);line-height:1;font-weight:800}
.lesson-root.dars05-root .d05-hook-bit{
  position:absolute;right:42px;bottom:-4px;width:88px;height:110px;overflow:hidden
}
.lesson-root.dars05-root .d05-hook-bit>svg{display:block;width:100%;height:100%}
.lesson-root.dars05-root .d05-hook-options-card{width:min(900px,100%);margin:0 auto;padding:8px 10px}
.lesson-root.dars05-root .d05-hook-options-card .question-topline{margin-bottom:5px}

.lesson-root.dars05-root .options-grid{gap:10px}
.lesson-root.dars05-root .options-three{grid-template-columns:repeat(3,minmax(0,1fr))}
.lesson-root.dars05-root .options-six{grid-template-columns:repeat(3,minmax(0,1fr))}
.lesson-root.dars05-root .option{
  min-height:58px;padding:12px 14px;border:1px solid rgba(80,97,109,.10);border-radius:14px;
  display:flex;align-items:center;gap:11px;color:#12212C;background:linear-gradient(145deg,#FFFFFF,#FBFCFA);
  cursor:pointer;text-align:left;font-weight:650;box-shadow:0 10px 24px -17px rgba(58,53,48,.44);
  transition:transform .18s ease,box-shadow .18s ease,opacity .18s ease
}
.lesson-root.dars05-root .option:hover:not(:disabled){
  transform:translateY(-2px);box-shadow:0 14px 28px -16px rgba(58,53,48,.5),0 0 0 3px rgba(22,143,163,.07)
}
.lesson-root.dars05-root .option:disabled{cursor:default}
.lesson-root.dars05-root .option-letter{
  width:25px;height:25px;flex:0 0 25px;display:grid;place-items:center;border-radius:8px;
  color:#168FA3;background:#E5F5F6;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:800
}
.lesson-root.dars05-root .option.option-correct{
  border-color:rgba(34,122,83,.34)!important;color:#227A53!important;background:#E7F3EC!important;
  box-shadow:0 0 0 3px rgba(34,122,83,.07),0 12px 26px -18px rgba(34,122,83,.52)!important
}
.lesson-root.dars05-root .option.option-correct .option-letter{color:#FFFFFF;background:#227A53}
.lesson-root.dars05-root .option.option-picked-wrong{
  color:#A96F13;background:#FFF5D9;
  box-shadow:inset 0 0 0 2px rgba(169,111,19,.28);opacity:.64
}
.lesson-root.dars05-root .option.option-picked-wrong .option-letter{color:#FFFFFF;background:#A96F13}
.lesson-root.dars05-root .option.option-dismissed{opacity:.58}

.lesson-root.dars05-root .d05-model-heading{
  min-height:22px;display:flex;align-items:center;justify-content:space-between;gap:10px
}
.lesson-root.dars05-root .d05-model-heading>span{color:#8FD7DE;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.lesson-root.dars05-root .d05-model-heading>i{color:rgba(143,215,222,.35);font-style:normal;font-size:7px;letter-spacing:.25em}
.lesson-root.dars05-root :is(.d05-narrated-board,.d05-line-board,.d05-focus-board,.d05-pairing-board){
  width:min(900px,100%);margin:0 auto;padding:15px;border:1px solid rgba(124,210,219,.12);
  flex:0 0 auto;
  border-radius:20px;color:#EAF9FB;background:
    radial-gradient(circle at 90% 10%,rgba(22,143,163,.18),transparent 27%),
    linear-gradient(145deg,#153B50,#0B2232 74%);
  box-shadow:0 20px 44px -30px rgba(14,33,44,.72)
}
.lesson-root.dars05-root .audio-reveal{visibility:hidden;opacity:0;transform:translateY(5px);transition:opacity .24s ease,transform .24s ease}
.lesson-root.dars05-root .audio-reveal.is-visible{visibility:visible;opacity:1;transform:none}
.lesson-root.dars05-root .d05-board-note{margin:7px 0 0;color:#B9CFD5;font-size:11px;line-height:1.3}
.lesson-root.dars05-root .d05-narrated-conclusion,
.lesson-root.dars05-root .d05-algorithm-result,
.lesson-root.dars05-root .d05-error-conclusion{
  margin-top:9px;padding:8px 11px;border:1px solid rgba(149,201,61,.22);border-radius:12px;
  display:flex;align-items:center;gap:12px;background:rgba(149,201,61,.09)
}
.lesson-root.dars05-root :is(.d05-narrated-conclusion,.d05-algorithm-result,.d05-error-conclusion)>strong{
  color:#DDF5A9;font-family:'JetBrains Mono',monospace;font-size:19px;white-space:nowrap
}
.lesson-root.dars05-root :is(.d05-narrated-conclusion,.d05-algorithm-result,.d05-error-conclusion)>p{margin:0;color:#D8E7EA;font-size:10px;line-height:1.3}
.lesson-root.dars05-root .d05-error-conclusion>strong{font-size:22px}
.lesson-root.dars05-root .d05-error-conclusion>p{font-size:13px}

.lesson-root.dars05-root .d05-rounding-line{padding:8px 5px 3px}
.lesson-root.dars05-root .d05-line-labels{display:grid;grid-template-columns:1fr 1fr 1fr;align-items:end;color:#B7CFD4;font-family:'JetBrains Mono',monospace;font-size:11px}
.lesson-root.dars05-root .d05-line-labels>*:nth-child(2){text-align:center;color:#F3CD67}
.lesson-root.dars05-root .d05-line-labels>*:last-child{text-align:right}
.lesson-root.dars05-root .d05-line-rail{position:relative;height:34px;margin-top:5px}
.lesson-root.dars05-root .d05-line-rail::before{
  content:'';position:absolute;left:0;right:0;top:17px;height:4px;border-radius:999px;
  background:linear-gradient(90deg,#7ACBD3,#F3CD67 50%,#95C93D)
}
.lesson-root.dars05-root .d05-line-rail::after{content:'';position:absolute;left:0;right:0;top:12px;height:14px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.32) 0 1px,transparent 1px 10%);opacity:.5}
.lesson-root.dars05-root .d05-line-midpoint{position:absolute;z-index:2;left:50%;top:10px;width:2px;height:18px;background:#F3CD67}
.lesson-root.dars05-root .d05-line-marker{
  position:absolute;z-index:3;top:9px;width:18px;height:18px;border:4px solid #0B2232;border-radius:50%;
  background:#FFFFFF;box-shadow:0 0 0 3px rgba(255,255,255,.22);transform:translateX(-50%)
}
.lesson-root.dars05-root .d05-line-marker>b{
  position:absolute;left:50%;bottom:22px;padding:4px 7px;border-radius:8px;color:#0B2232;background:#FFFFFF;
  font-family:'JetBrains Mono',monospace;font-size:10px;white-space:nowrap;transform:translateX(-50%)
}
.lesson-root.dars05-root .d05-distance-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:7px}
.lesson-root.dars05-root .d05-distance-cards>div{
  padding:7px 9px;border:1px solid rgba(255,255,255,.1);border-radius:10px;display:flex;justify-content:space-between;
  color:#AFC9CE;background:rgba(255,255,255,.05);font-size:9px
}
.lesson-root.dars05-root .d05-distance-cards strong{color:#FFFFFF;font-family:'JetBrains Mono',monospace;font-size:14px}
.lesson-root.dars05-root .d05-proof-distances{margin-top:5px}

.lesson-root.dars05-root .d05-focus-board{display:grid;gap:9px}
.lesson-root.dars05-root .d05-separator{justify-self:center;color:#9FDCE2;font-family:'JetBrains Mono',monospace;font-size:14px;letter-spacing:.1em}
.lesson-root.dars05-root .d05-focus-digits{display:flex;justify-content:center;gap:6px}
.lesson-root.dars05-root .d05-focus-digits>span{
  width:44px;height:48px;border:1px solid rgba(255,255,255,.12);border-radius:11px;display:grid;place-items:center;
  color:#F2FAFB;background:rgba(255,255,255,.05);font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:800
}
.lesson-root.dars05-root .d05-focus-digits>span.is-target{border-color:rgba(149,201,61,.58);color:#E1F7AF;background:rgba(149,201,61,.16)}
.lesson-root.dars05-root .d05-focus-digits>span.is-inspect{border-color:rgba(255,205,103,.64);color:#FFE49E;background:rgba(255,205,103,.16);transform:translateY(-3px)}
.lesson-root.dars05-root .d05-focus-result{display:flex;justify-content:center;align-items:center;gap:9px}
.lesson-root.dars05-root .d05-focus-result>i{color:#F3CD67;font-style:normal;font-size:20px}
.lesson-root.dars05-root .d05-focus-result>strong{color:#FFFFFF;font-family:'JetBrains Mono',monospace;font-size:22px}

.lesson-root.dars05-root .d05-exact-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:7px}
.lesson-root.dars05-root .d05-exact-card{
  min-height:92px;padding:10px;border:1px solid rgba(255,255,255,.10);border-radius:13px;
  display:grid;align-content:center;gap:4px;background:rgba(255,255,255,.045);transition:border-color .2s,background .2s,transform .2s
}
.lesson-root.dars05-root .d05-exact-card>span{color:#A9C5CB;font-size:8px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.lesson-root.dars05-root .d05-exact-card>strong{color:#FFFFFF;font-family:'JetBrains Mono',monospace;font-size:23px}
.lesson-root.dars05-root .d05-exact-card>p{margin:0;color:#B9CFD5;font-size:10px;line-height:1.25}
.lesson-root.dars05-root .d05-exact-card.is-current{border-color:#79D3DA;background:rgba(22,143,163,.18);transform:translateY(-2px)}
.lesson-root.dars05-root .d05-exact-card.is-heard{border-color:rgba(121,211,218,.25)}
.lesson-root.dars05-root .d05-relation-strip{
  margin-top:8px;padding:7px 10px;border:1px solid rgba(149,201,61,.18);border-radius:11px;
  display:flex;align-items:center;gap:12px;background:rgba(149,201,61,.07);transition:border-color .2s,background .2s
}
.lesson-root.dars05-root .d05-relation-strip.is-current{border-color:rgba(149,201,61,.55);background:rgba(149,201,61,.14)}
.lesson-root.dars05-root .d05-relation-strip>strong{color:#DDF5A9;font-family:'JetBrains Mono',monospace;font-size:18px;white-space:nowrap}
.lesson-root.dars05-root .d05-relation-strip>p{margin:0;color:#D8E7EA;font-size:10px;line-height:1.28}

.lesson-root.dars05-root .d05-algorithm-rail{
  display:grid;grid-template-columns:minmax(0,1fr) 18px minmax(0,1fr) 18px minmax(0,1fr) 18px minmax(0,1fr);
  align-items:stretch;gap:5px;margin-top:8px
}
.lesson-root.dars05-root .d05-algorithm-rail>i{align-self:center;color:#6E9CA5;font-style:normal;text-align:center}
.lesson-root.dars05-root .d05-algorithm-node{
  min-height:82px;padding:9px;border:1px solid rgba(255,255,255,.09);border-radius:12px;display:grid;align-content:start;gap:7px;
  background:rgba(255,255,255,.045);transition:border-color .2s,background .2s,transform .2s
}
.lesson-root.dars05-root .d05-algorithm-node>span{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;color:#8FD7DE;background:rgba(22,143,163,.18);font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:800}
.lesson-root.dars05-root .d05-algorithm-node>p{margin:0;color:#D6E6E9;font-size:12px;line-height:1.28}
.lesson-root.dars05-root .d05-algorithm-node.is-current{border-color:#79D3DA;background:rgba(22,143,163,.18);transform:translateY(-2px)}
.lesson-root.dars05-root .d05-algorithm-node.is-heard{border-color:rgba(121,211,218,.23)}

.lesson-root.dars05-root .d05-precision-source{
  width:max-content;margin:7px auto;padding:6px 12px;border-radius:10px;color:#FFFFFF;background:rgba(255,255,255,.08);
  font-family:'JetBrains Mono',monospace;font-size:21px;font-weight:800
}
.lesson-root.dars05-root .d05-precision-rows{display:grid;gap:6px}
.lesson-root.dars05-root .d05-precision-row{
  min-height:42px;padding:7px 10px;border:1px solid rgba(255,255,255,.09);border-radius:10px;
  display:grid;grid-template-columns:minmax(105px,.7fr) 44px minmax(160px,1fr);align-items:center;gap:9px;background:rgba(255,255,255,.045)
}
.lesson-root.dars05-root .d05-precision-row>span{color:#B8CED3;font-size:9px;font-weight:750}
.lesson-root.dars05-root .d05-precision-row>i{width:32px;height:29px;border-radius:8px;display:grid;place-items:center;color:#FFE49E;background:rgba(255,205,103,.15);font-style:normal;font-family:'JetBrains Mono',monospace;font-weight:800}
.lesson-root.dars05-root .d05-precision-row>strong{color:#FFFFFF;font-family:'JetBrains Mono',monospace;font-size:16px}

.lesson-root.dars05-root .d05-carry-board{
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch;gap:8px
}
.lesson-root.dars05-root .d05-carry-board>.d05-model-heading{grid-column:1/-1}
.lesson-root.dars05-root :is(.d05-carry-decision,.d05-aligned-rounding,.d05-carry-result){
  min-height:128px;padding:10px;border:1px solid rgba(255,255,255,.09);border-radius:12px;
  display:grid;place-items:center;align-content:center;gap:6px;text-align:center;background:rgba(255,255,255,.045)
}
.lesson-root.dars05-root :is(.d05-carry-decision,.d05-carry-result)>strong{color:#FFFFFF;font-family:'JetBrains Mono',monospace;font-size:19px}
.lesson-root.dars05-root :is(.d05-carry-decision,.d05-carry-result)>p,.lesson-root.dars05-root .d05-aligned-rounding>p{margin:0;color:#B9CFD5;font-size:9px;line-height:1.25}
.lesson-root.dars05-root .d05-aligned-rounding{position:relative;font-family:'JetBrains Mono',monospace}
.lesson-root.dars05-root .d05-aligned-rounding>span{width:96px;color:#EAF9FB;text-align:right;font-size:16px}
.lesson-root.dars05-root .d05-aligned-rounding>i{width:102px;height:1px;background:#79D3DA}
.lesson-root.dars05-root .d05-aligned-rounding>strong{color:#DDF5A9;font-size:18px}
.lesson-root.dars05-root .d05-carry-arc{position:absolute;top:8px;right:12px;color:#F3CD67;font-size:23px}

.lesson-root.dars05-root .d05-error-source{
  width:max-content;margin:7px auto;padding:6px 11px;border-radius:10px;display:flex;align-items:center;gap:9px;background:rgba(255,255,255,.07)
}
.lesson-root.dars05-root .d05-error-source>strong{color:#FFFFFF;font-family:'JetBrains Mono',monospace;font-size:20px}
.lesson-root.dars05-root .d05-error-source>span{color:#AFC9CE;font-size:9px}
.lesson-root.dars05-root .d05-error-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.lesson-root.dars05-root .d05-error-route{min-height:78px;padding:9px;border:1px solid rgba(255,255,255,.09);border-radius:11px;background:rgba(255,255,255,.045)}
.lesson-root.dars05-root .d05-error-route>span{display:block;margin-bottom:7px;color:#B8CED3;font-size:8px;font-weight:800;text-transform:uppercase}
.lesson-root.dars05-root .d05-error-route>div{display:flex;align-items:center;justify-content:center;gap:11px}
.lesson-root.dars05-root .d05-error-route i{width:31px;height:31px;border-radius:8px;display:grid;place-items:center;font-style:normal;font-family:'JetBrains Mono',monospace;font-weight:800}
.lesson-root.dars05-root .d05-error-route strong{font-family:'JetBrains Mono',monospace;font-size:17px}
.lesson-root.dars05-root .d05-error-wrong{border-color:rgba(255,91,53,.25);background:rgba(255,91,53,.07)}
.lesson-root.dars05-root .d05-error-wrong i{color:#FFB5A2;background:rgba(255,91,53,.15)}
.lesson-root.dars05-root .d05-error-correct{border-color:rgba(149,201,61,.23);background:rgba(149,201,61,.06)}
.lesson-root.dars05-root .d05-error-correct i{color:#DDF5A9;background:rgba(149,201,61,.14)}
.lesson-root.dars05-root .d05-error-correct strong{opacity:.18;transition:opacity .2s}
.lesson-root.dars05-root .d05-error-correct strong.is-visible{opacity:1;color:#DDF5A9}

.lesson-root.dars05-root .d05-boundary-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:7px}
.lesson-root.dars05-root .d05-boundary-card{
  padding:9px;border:1px solid rgba(255,255,255,.09);border-radius:11px;
  display:grid;grid-template-columns:28px minmax(0,1fr);gap:4px 8px;background:rgba(255,255,255,.045)
}
.lesson-root.dars05-root .d05-boundary-card>span{grid-row:1/5;width:26px;height:26px;border-radius:8px;display:grid;place-items:center;color:#8FD7DE;background:rgba(22,143,163,.18);font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:800}
.lesson-root.dars05-root .d05-boundary-card>small{color:#AFC9CE;font-size:8px;font-weight:750}
.lesson-root.dars05-root .d05-boundary-card>strong{grid-column:2;color:#FFFFFF;font-family:'JetBrains Mono',monospace;font-size:13px}
.lesson-root.dars05-root .d05-boundary-card>p{grid-column:2;margin:0;color:#B9CFD5;font-size:9px;line-height:1.24}
.lesson-root.dars05-root .d05-boundary-result{
  margin-top:8px;padding:7px 10px;border:1px solid rgba(149,201,61,.22);border-radius:12px;
  display:grid;grid-template-columns:49px minmax(0,1fr);align-items:center;gap:9px;background:rgba(149,201,61,.09)
}
.lesson-root.dars05-root .d05-boundary-result>svg{width:49px;height:58px}
.lesson-root.dars05-root .d05-boundary-result>div{display:grid;gap:2px}
.lesson-root.dars05-root .d05-boundary-result span{color:#DDF5A9;font-size:8px;font-weight:850;letter-spacing:.08em}
.lesson-root.dars05-root .d05-boundary-result strong{color:#FFFFFF;font-family:'JetBrains Mono',monospace;font-size:17px}
.lesson-root.dars05-root .d05-boundary-result p{margin:0;color:#D8E7EA;font-size:9px;line-height:1.25}

.lesson-root.dars05-root .d05-pairing-board>h2{margin:6px 0;color:#EAF9FB;font-size:13px;line-height:1.28}
.lesson-root.dars05-root .d05-pairing-rows{display:grid;gap:7px}
.lesson-root.dars05-root .d05-pairing-row{
  padding:8px;border:1px solid rgba(255,255,255,.09);border-radius:12px;
  display:grid;grid-template-columns:minmax(180px,.72fr) minmax(0,1fr);align-items:center;gap:9px;background:rgba(255,255,255,.045)
}
.lesson-root.dars05-root .d05-pairing-row>div:first-child strong{color:#FFFFFF;font-size:13px}
.lesson-root.dars05-root .d05-pairing-row>div:first-child p{margin:2px 0 0;color:#AFC9CE;font-size:9px;line-height:1.25}
.lesson-root.dars05-root .d05-pairing-row>div:last-child{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.lesson-root.dars05-root .d05-pairing-row button{
  min-height:48px;padding:6px 8px;border:1px solid rgba(121,211,218,.16);border-radius:10px;
  display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:1px 6px;color:#EAF9FB;background:rgba(22,143,163,.08);cursor:pointer;text-align:left
}
.lesson-root.dars05-root .d05-pairing-row button small{grid-row:1/3;color:#8FD7DE;font-size:11px}
.lesson-root.dars05-root .d05-pairing-row button strong{font-family:'JetBrains Mono',monospace;font-size:14px}
.lesson-root.dars05-root .d05-pairing-row button span{color:#AFC9CE;font-size:8px}
.lesson-root.dars05-root .d05-pairing-row button.is-selected{border-color:rgba(149,201,61,.48);color:#DDF5A9;background:rgba(149,201,61,.13)}
.lesson-root.dars05-root .d05-pairing-row.is-matched{border-color:rgba(149,201,61,.25)}

.lesson-root.dars05-root .d05-input-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:8px}
.lesson-root.dars05-root .d05-input-row .answer-input{min-width:0}
.lesson-root.dars05-root .d05-check-row{display:flex;justify-content:flex-end}
.lesson-root.dars05-root .d05-choice-screen:has(.feedback-visible)>.d05-heading{display:none}

/* Slides 02-14: canonical Grade 4 light-cyan main visual frames. */
.lesson-root.dars05-root :is(.d05-narrated-board,.d05-line-board,.d05-focus-board,.d05-pairing-board){
  border:0;color:${T.navy};background:${T.cyanSoft};
  box-shadow:0 15px 34px -18px rgba(23,59,82,.28)
}
.lesson-root.dars05-root .d05-model-heading>span{color:${T.cyan}}
.lesson-root.dars05-root .d05-model-heading>i{color:rgba(22,143,163,.3)}
.lesson-root.dars05-root :is(
  .d05-exact-card,.d05-algorithm-node,.d05-precision-row,
  .d05-carry-decision,.d05-aligned-rounding,.d05-boundary-card,.d05-pairing-row
),
.lesson-root.dars05-root .d05-distance-cards>div,
.lesson-root.dars05-root :is(.d05-precision-source,.d05-error-source){
  border-color:rgba(22,143,163,.14);background:rgba(255,255,255,.84)
}
.lesson-root.dars05-root :is(
  .d05-exact-card>span,.d05-exact-card>p,.d05-algorithm-node>p,
  .d05-precision-row>span,.d05-board-note,
  .d05-carry-decision>p,.d05-carry-result>p,.d05-aligned-rounding>p,
  .d05-error-route>span,.d05-boundary-card>small,.d05-boundary-card>p,
  .d05-pairing-row>div:first-child p
){color:${T.ink2}}
.lesson-root.dars05-root :is(
  .d05-exact-card>strong,.d05-precision-row>strong,.d05-precision-source,
  .d05-carry-decision>strong,.d05-aligned-rounding>span,
  .d05-error-source>strong,.d05-error-route strong,.d05-boundary-card>strong,
  .d05-pairing-row>div:first-child strong
){color:${T.navy}}
.lesson-root.dars05-root .d05-line-labels{color:${T.ink2}}
.lesson-root.dars05-root .d05-line-labels>*:nth-child(2){color:${T.warn}}
.lesson-root.dars05-root .d05-line-rail::after{
  background:repeating-linear-gradient(90deg,rgba(23,59,82,.22) 0 1px,transparent 1px 10%)
}
.lesson-root.dars05-root .d05-distance-cards>div{color:${T.ink2}}
.lesson-root.dars05-root .d05-distance-cards strong{color:${T.navy}}
.lesson-root.dars05-root .d05-separator{color:${T.cyan}}
.lesson-root.dars05-root .d05-focus-digits>span{
  border-color:rgba(22,143,163,.16);color:${T.navy};background:${T.paper}
}
.lesson-root.dars05-root .d05-focus-digits>span.is-target{
  border-color:rgba(34,122,83,.32);color:${T.success};background:${T.successSoft}
}
.lesson-root.dars05-root .d05-focus-digits>span.is-inspect{
  border-color:rgba(169,111,19,.32);color:${T.warn};background:${T.warnSoft}
}
.lesson-root.dars05-root .d05-focus-result>i{color:${T.warn}}
.lesson-root.dars05-root .d05-focus-result>strong{color:${T.navy}}
.lesson-root.dars05-root .d05-algorithm-rail>i{color:${T.cyan}}
.lesson-root.dars05-root :is(.d05-algorithm-node>span,.d05-boundary-card>span){
  color:${T.cyan};background:rgba(22,143,163,.12)
}
.lesson-root.dars05-root .d05-precision-row>i{color:${T.warn};background:${T.warnSoft}}
.lesson-root.dars05-root .d05-carry-arc{color:${T.warn}}
.lesson-root.dars05-root .d05-aligned-rounding>i{background:${T.cyan}}
.lesson-root.dars05-root .d05-aligned-rounding>strong{color:${T.success}}
.lesson-root.dars05-root .d05-error-source>span{color:${T.ink2}}
.lesson-root.dars05-root :is(
  .d05-relation-strip,.d05-narrated-conclusion,.d05-algorithm-result,
  .d05-carry-result,.d05-error-conclusion,.d05-boundary-result
){
  border-color:rgba(34,122,83,.22);background:${T.successSoft}
}
.lesson-root.dars05-root :is(
  .d05-relation-strip,.d05-narrated-conclusion,.d05-algorithm-result,
  .d05-carry-result,.d05-error-conclusion,.d05-boundary-result
) strong{color:${T.success}}
.lesson-root.dars05-root :is(
  .d05-relation-strip,.d05-narrated-conclusion,.d05-algorithm-result,
  .d05-carry-result,.d05-error-conclusion,.d05-boundary-result
) p{color:${T.ink2}}
.lesson-root.dars05-root .d05-boundary-result span{color:${T.success}}
.lesson-root.dars05-root .d05-error-wrong{border-color:rgba(255,91,53,.28);background:${T.accentSoft}}
.lesson-root.dars05-root .d05-error-correct{border-color:rgba(34,122,83,.26);background:${T.successSoft}}
.lesson-root.dars05-root .d05-error-wrong i{color:${T.accent};background:rgba(255,91,53,.12)}
.lesson-root.dars05-root .d05-error-correct i{color:${T.success};background:rgba(34,122,83,.12)}
.lesson-root.dars05-root .d05-error-correct strong.is-visible{color:${T.success}}
.lesson-root.dars05-root .d05-pairing-board>h2{color:${T.navy}}
.lesson-root.dars05-root .d05-pairing-row button{
  border-color:rgba(22,143,163,.18);color:${T.navy};background:${T.paper}
}
.lesson-root.dars05-root .d05-pairing-row button span{color:${T.ink2}}
.lesson-root.dars05-root .d05-pairing-row button small{color:${T.cyan}}
.lesson-root.dars05-root .d05-pairing-row button.is-selected{
  border-color:rgba(34,122,83,.34);color:${T.success};background:${T.successSoft}
}

.lesson-root.dars05-root .g4-shared-finale .finale-proof,
.lesson-root.dars05-root .g4-shared-finale .finale-bridge{padding-block:5px}
.lesson-root.dars05-root .g4-shared-finale .finale-proof p,
.lesson-root.dars05-root .g4-shared-finale .finale-bridge p{line-height:1.22}
.lesson-root.dars05-root .g4-shared-finale .finale-bridge{grid-template-columns:24px minmax(0,1fr);gap:7px}
.lesson-root.dars05-root .g4-shared-finale .finale-bridge>span{width:24px;height:24px;border-radius:8px}

@media(max-width:639.98px){
  .lesson-root.dars05-root .d05-heading h1{font-size:22px}
  .lesson-root.dars05-root .d05-heading p,.lesson-root.dars05-root .d05-instruction{font-size:10px;line-height:1.24}
  .lesson-root.dars05-root .d05-hook-screen{gap:6px}
  .lesson-root.dars05-root .d05-hook-heading .d05-hook-prompt{font-size:17px!important;line-height:1.25!important}
  .lesson-root.dars05-root .data-scene.d05-data-scene{
    height:164px;min-height:164px;max-height:164px;padding:9px 91px 9px 10px;border-radius:18px
  }
  .lesson-root.dars05-root .data-scene.d05-data-scene::after{border-radius:17px}
  .lesson-root.dars05-root .d05-hook-data{gap:5px}
  .lesson-root.dars05-root .d05-hook-data>span{padding:2px 6px;font-size:6px}
  .lesson-root.dars05-root .d05-hook-data>div{min-height:47px;padding:5px 7px;grid-template-columns:74px minmax(0,1fr);gap:5px;border-radius:9px}
  .lesson-root.dars05-root .d05-hook-data small{font-size:6px}
  .lesson-root.dars05-root .d05-hook-data strong{font-size:16px}
  .lesson-root.dars05-root .d05-hook-bit{right:12px;bottom:-7px;width:68px;height:85px}
  .lesson-root.dars05-root .d05-hook-options-card{padding:6px 7px}
  .lesson-root.dars05-root .options-grid,.lesson-root.dars05-root .options-three,.lesson-root.dars05-root .options-six{grid-template-columns:1fr;gap:5px}
  .lesson-root.dars05-root .option{min-height:44px;padding:8px 10px}
  .lesson-root.dars05-root .d05-hook-screen:has(.feedback.feedback-visible)>.d05-hook-heading,
  .lesson-root.dars05-root .d05-hook-screen:has(.feedback.feedback-visible)>.d05-data-scene{display:none!important}
  .lesson-root.dars05-root .d05-hook-screen:has(.feedback.feedback-visible){gap:4px}
  .lesson-root.dars05-root :is(.d05-narrated-board,.d05-line-board,.d05-focus-board,.d05-pairing-board){padding:10px;border-radius:17px}
  .lesson-root.dars05-root .d05-model-heading{min-height:16px}
  .lesson-root.dars05-root .d05-model-heading>span{font-size:7px}
  .lesson-root.dars05-root .d05-exact-grid,.lesson-root.dars05-root .d05-error-grid,.lesson-root.dars05-root .d05-boundary-grid{grid-template-columns:1fr;gap:5px}
  .lesson-root.dars05-root .d05-exact-card{min-height:61px;padding:7px}
  .lesson-root.dars05-root .d05-exact-card>strong{font-size:17px}
  .lesson-root.dars05-root .d05-exact-card>p{font-size:8px}
  .lesson-root.dars05-root .d05-relation-strip{margin-top:5px;padding:5px 7px}
  .lesson-root.dars05-root .d05-relation-strip>strong{font-size:14px}
  .lesson-root.dars05-root .d05-relation-strip>p{font-size:8px}
  .lesson-root.dars05-root .d05-line-labels{font-size:8px}
  .lesson-root.dars05-root .d05-line-marker>b{font-size:8px}
  .lesson-root.dars05-root .d05-distance-cards>div{padding:5px 6px;font-size:7px}
  .lesson-root.dars05-root .d05-distance-cards strong{font-size:11px}
  .lesson-root.dars05-root :is(.d05-narrated-conclusion,.d05-algorithm-result,.d05-error-conclusion){margin-top:5px;padding:5px 7px}
  .lesson-root.dars05-root :is(.d05-narrated-conclusion,.d05-algorithm-result,.d05-error-conclusion)>strong{font-size:13px}
  .lesson-root.dars05-root :is(.d05-narrated-conclusion,.d05-algorithm-result,.d05-error-conclusion)>p{font-size:8px}
  .lesson-root.dars05-root .d05-error-conclusion>strong{font-size:16px}
  .lesson-root.dars05-root .d05-error-conclusion>p{font-size:11px}
  .lesson-root.dars05-root .d05-algorithm-rail{grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}
  .lesson-root.dars05-root .d05-algorithm-rail>i{display:none}
  .lesson-root.dars05-root .d05-algorithm-node{min-height:58px;padding:6px;gap:4px}
  .lesson-root.dars05-root .d05-algorithm-node>span{width:19px;height:19px;font-size:9px}
  .lesson-root.dars05-root .d05-algorithm-node>p{font-size:10px;line-height:1.2}
  .lesson-root.dars05-root .d05-precision-source{margin:4px auto;padding:4px 8px;font-size:16px}
  .lesson-root.dars05-root .d05-precision-rows{gap:4px}
  .lesson-root.dars05-root .d05-precision-row{min-height:35px;padding:4px 6px;grid-template-columns:78px 30px minmax(0,1fr);gap:5px}
  .lesson-root.dars05-root .d05-precision-row>span{font-size:7px}
  .lesson-root.dars05-root .d05-precision-row>i{width:26px;height:25px;font-size:11px}
  .lesson-root.dars05-root .d05-precision-row>strong{font-size:11px}
  .lesson-root.dars05-root .d05-carry-board{grid-template-columns:1fr;gap:5px}
  .lesson-root.dars05-root :is(.d05-carry-decision,.d05-aligned-rounding,.d05-carry-result){min-height:58px;padding:6px}
  .lesson-root.dars05-root .d05-aligned-rounding{grid-template-columns:repeat(4,auto);display:grid}
  .lesson-root.dars05-root .d05-aligned-rounding>span{width:auto;font-size:12px}
  .lesson-root.dars05-root .d05-aligned-rounding>i{width:34px}
  .lesson-root.dars05-root .d05-aligned-rounding>strong{font-size:13px}
  .lesson-root.dars05-root .d05-aligned-rounding>p{grid-column:1/-1}
  .lesson-root.dars05-root .d05-error-source{margin:4px auto;padding:4px 7px}
  .lesson-root.dars05-root .d05-error-source>strong{font-size:15px}
  .lesson-root.dars05-root .d05-error-route{min-height:54px;padding:6px}
  .lesson-root.dars05-root .d05-error-route>span{margin-bottom:4px;font-size:7px}
  .lesson-root.dars05-root .d05-error-route strong{font-size:13px}
  .lesson-root.dars05-root .d05-boundary-card{padding:6px;gap:2px 6px}
  .lesson-root.dars05-root .d05-boundary-card>strong{font-size:10px}
  .lesson-root.dars05-root .d05-boundary-card>p{font-size:7px}
  .lesson-root.dars05-root .d05-boundary-result{margin-top:5px;padding:4px 7px;grid-template-columns:39px minmax(0,1fr)}
  .lesson-root.dars05-root .d05-boundary-result>svg{width:39px;height:46px}
  .lesson-root.dars05-root .d05-boundary-result strong{font-size:12px}
  .lesson-root.dars05-root .d05-boundary-result p{font-size:7px}
  .lesson-root.dars05-root .d05-focus-digits{gap:3px}
  .lesson-root.dars05-root .d05-focus-digits>span{width:31px;height:35px;border-radius:8px;font-size:18px}
  .lesson-root.dars05-root .d05-focus-result>strong{font-size:17px}
  .lesson-root.dars05-root .d05-pairing-board>h2{margin:4px 0;font-size:10px}
  .lesson-root.dars05-root .d05-pairing-row{padding:5px;grid-template-columns:1fr;gap:4px}
  .lesson-root.dars05-root .d05-pairing-row>div:first-child p{font-size:7px}
  .lesson-root.dars05-root .d05-pairing-row button{min-height:38px;padding:4px 6px}
  .lesson-root.dars05-root .d05-pairing-row button strong{font-size:11px}
  .lesson-root.dars05-root .d05-input-row{grid-template-columns:1fr}
  .lesson-root.dars05-root .d05-check-row .btn{width:100%}
  .lesson-root.dars05-root .g4-shared-finale .finale-proof,
  .lesson-root.dars05-root .g4-shared-finale .finale-bridge{padding-block:4px}
}
@media(max-width:639.98px) and (max-height:700px){
  .lesson-root.dars05-root .d05-hook-screen{gap:1px}
  .lesson-root.dars05-root .d05-hook-options-card{padding:3px 7px}
  .lesson-root.dars05-root .d05-hook-options-card .question-topline{display:none}
  .lesson-root.dars05-root .data-scene.d05-data-scene{
    padding:9px 91px 9px 10px!important
  }
  .lesson-root.dars05-root .d05-choice-screen:not(.d05-hook-screen) .question-card h2{
    font-size:14px;line-height:1.2
  }
  .lesson-root.dars05-root .d05-choice-screen:not(.d05-hook-screen) .options-grid{
    grid-template-columns:repeat(2,minmax(0,1fr))
  }
  .lesson-root.dars05-root .d05-choice-screen:not(.d05-hook-screen) .digit-options{
    grid-template-columns:repeat(4,minmax(0,1fr))
  }
  .lesson-root.dars05-root .digit-options .option{justify-content:center;padding-inline:5px;gap:5px}
}
`;
