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
  return <div className="g4-title-card-stage" data-g4-role="title-card" role="status" aria-live="polite" aria-atomic="true"><div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div><div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy" /></div><div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{copy.earned}</span><h2>{title}</h2><div className="g4-title-card-score"><strong>{firstTry}/{totalScored}</strong><span>{copy.firstTry}</span></div></div>;
}

// ============================================================================
// 4-SINF · Dars05 · Ko'p xonali sonlarni yaxlitlash
// Local fallback contract: SCREEN_META is the Notion-ready skeleton;
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

const ROUNDING_LINE_COPY = {
  guided: {
    eyebrow: { uz: "Sonlar o'qida yaxlitlash", ru: 'Округление на числовой прямой', en: 'Rounding on a number line' },
    title: { uz: "48 764 ni uch miqyosda yaxlitlaymiz", ru: 'Округляем 48 764 в трёх масштабах', en: 'Round 48,764 at three scales' },
    lead: { uz: "Har qadamda sonlar o'qidagi yaqin yaxlit qo'shnini topamiz.", ru: 'На каждом шаге найдём ближайшего круглого соседа на числовой прямой.', en: 'At each step, find the nearest round neighbour on the number line.' },
    steps: [
      {
        label: { uz: "O'nlikkacha", ru: 'До десятков', en: 'To the nearest ten' },
        explanation: { uz: "48 764 soni 48 760 ga yaqinroq: masofalar 4 va 6.", ru: '48 764 ближе к 48 760: расстояния равны 4 и 6.', en: '48,764 is closer to 48,760: the distances are 4 and 6.' },
        audio: {
          intro: {
            uz: [
              "Yaxlitlash sonni unga yaqin, ishlatish qulayroq bo'lgan yaxlit son bilan almashtirishdir. Qirq sakkiz ming yetti yuz oltmish to'rt sonini o'nlikkacha yaxlitlaymiz. Kesmaga qarang.",
              "Son qirq sakkiz ming yetti yuz oltmish va qirq sakkiz ming yetti yuz yetmish orasida. U quyi o'nlikka to'rt birlik, yuqori o'nlikka olti birlik masofada. Demak, quyi o'nlikka yaqinroq.",
            ],
            ru: [
              'Округление означает замену числа близким круглым числом, с которым удобнее работать. Округлим сорок восемь тысяч семьсот шестьдесят четыре до десятков. Посмотри на отрезок.',
              'Число находится между сорока восемью тысячами семьюстами шестьюдесятью и сорока восемью тысячами семьюстами семьюдесятью. До нижнего десятка четыре единицы, до верхнего шесть. Значит, нижний десяток ближе.',
            ],
            en: [
              'Rounding replaces a number with a nearby round number that is easier to use. Round forty-eight thousand seven hundred and sixty-four to the nearest ten. Look at the number line.',
              'The number lies between forty-eight thousand seven hundred and sixty and forty-eight thousand seven hundred and seventy. It is four units from the lower ten and six from the upper ten, so the lower ten is closer.',
            ],
          },
        },
      },
      {
        label: { uz: 'Yuzlikkacha', ru: 'До сотен', en: 'To the nearest hundred' },
        explanation: { uz: "48 764 soni 48 800 ga yaqinroq: masofalar 64 va 36.", ru: '48 764 ближе к 48 800: расстояния равны 64 и 36.', en: '48,764 is closer to 48,800: the distances are 64 and 36.' },
        audio: {
          intro: {
            uz: [
              "Endi qirq sakkiz ming yetti yuz oltmish to'rt sonini yuzlikkacha yaxlitlaymiz. Kesmada u qirq sakkiz ming yetti yuz va qirq sakkiz ming sakkiz yuz orasida turibdi.",
              "Quyi yuzlikkacha oltmish to'rt birlik, yuqori yuzlikkacha o'ttiz olti birlik bor. Shuning uchun yuqori yuzlik yaqinroq.",
            ],
            ru: [
              'Теперь округлим сорок восемь тысяч семьсот шестьдесят четыре до сотен. На отрезке число находится между сорока восемью тысячами семьюстами и сорока восемью тысячами восемьюстами.',
              'До нижней сотни шестьдесят четыре единицы, а до верхней тридцать шесть. Поэтому верхняя сотня ближе.',
            ],
            en: [
              'Now round forty-eight thousand seven hundred and sixty-four to the nearest hundred. On the number line it lies between forty-eight thousand seven hundred and forty-eight thousand eight hundred.',
              'The lower hundred is sixty-four units away, while the upper hundred is thirty-six units away. Therefore, the upper hundred is closer.',
            ],
          },
        },
      },
      {
        label: { uz: 'Minglikkacha', ru: 'До тысяч', en: 'To the nearest thousand' },
        explanation: { uz: "48 764 soni 49 000 ga yaqinroq: masofalar 764 va 236.", ru: '48 764 ближе к 49 000: расстояния равны 764 и 236.', en: '48,764 is closer to 49,000: the distances are 764 and 236.' },
        audio: {
          intro: {
            uz: [
              "Uchinchi qadamda qirq sakkiz ming yetti yuz oltmish to'rt sonini minglikkacha yaxlitlaymiz. Kesmada u qirq sakkiz ming va qirq to'qqiz ming orasida turibdi.",
              "Quyi minglikkacha yetti yuz oltmish to'rt birlik, yuqori minglikkacha ikki yuz o'ttiz olti birlik bor. Demak, qirq to'qqiz ming yaqinroq.",
            ],
            ru: [
              'На третьем шаге округлим сорок восемь тысяч семьсот шестьдесят четыре до тысяч. На отрезке число находится между сорока восемью тысячами и сорока девятью тысячами.',
              'До нижней тысячи семьсот шестьдесят четыре единицы, а до верхней двести тридцать шесть. Значит, сорок девять тысяч ближе.',
            ],
            en: [
              'At the third step, round forty-eight thousand seven hundred and sixty-four to the nearest thousand. On the number line it lies between forty-eight thousand and forty-nine thousand.',
              'The lower thousand is seven hundred and sixty-four units away, while the upper thousand is two hundred and thirty-six units away. Therefore, forty-nine thousand is closer.',
            ],
          },
        },
      },
    ],
  },
  practice: {
    eyebrow: { uz: "Chizmada o'zingiz ishlang", ru: 'Работаем по чертежу', en: 'Work from the diagram' },
    title: { uz: "27 364 uchun yaqin sonni tanlang", ru: 'Выбери ближайшее число для 27 364', en: 'Choose the nearest number for 27,364' },
    lead: { uz: "Har qadamda javobni belgilash uchun sonlar o'qidagi mos nuqtani bosing.", ru: 'На каждом шаге нажмите подходящую точку на числовой прямой, чтобы отметить ответ.', en: 'At each step, press the matching point on the number line to mark your answer.' },
    steps: [
      {
        label: { uz: "O'nlikkacha", ru: 'До десятков', en: 'To the nearest ten' },
        audio: {
          intro: { uz: "Yigirma yetti ming uch yuz oltmish to'rt sonini o'nlikkacha yaxlitlang. Kesmada yaqinroq chegarani tanlang.", ru: 'Округли двадцать семь тысяч триста шестьдесят четыре до десятков. Выбери ближайшую границу отрезка.', en: 'Round twenty-seven thousand three hundred and sixty-four to the nearest ten. Select the closer endpoint on the number line.' },
          on_correct: { uz: "To'g'ri. Son quyi o'nlikka to'rt birlik masofada, shuning uchun quyi chegara yaqinroq.", ru: 'Верно. До нижнего десятка четыре единицы, поэтому нижняя граница ближе.', en: 'Correct. The lower ten is four units away, so the lower endpoint is closer.' },
          on_wrong: { uz: "Yuqori o'nlikkacha masofa kattaroq. Kesmada berilgan son bilan ikki chegara orasidagi masofani yana solishtiring.", ru: 'До верхнего десятка расстояние больше. Ещё раз сравни расстояния от числа до двух границ.', en: 'The upper ten is farther away. Compare the distances from the number to both endpoints again.' },
        },
      },
      {
        label: { uz: 'Yuzlikkacha', ru: 'До сотен', en: 'To the nearest hundred' },
        audio: {
          intro: { uz: "Yigirma yetti ming uch yuz oltmish to'rt sonini yuzlikkacha yaxlitlang. Yaqinroq yuzlikni tanlang.", ru: 'Округли двадцать семь тысяч триста шестьдесят четыре до сотен. Выбери ближайшую сотню.', en: 'Round twenty-seven thousand three hundred and sixty-four to the nearest hundred. Select the closer hundred.' },
          on_correct: { uz: "To'g'ri. Yuqori yuzlikkacha o'ttiz olti birlik, quyi yuzlikkacha oltmish to'rt birlik bor. Yuqori chegara yaqinroq.", ru: 'Верно. До верхней сотни тридцать шесть единиц, а до нижней шестьдесят четыре. Верхняя граница ближе.', en: 'Correct. The upper hundred is thirty-six units away and the lower hundred is sixty-four units away. The upper endpoint is closer.' },
          on_wrong: { uz: "Quyi yuzlikkacha masofa kattaroq. Kesmada ikki masofani yana solishtiring.", ru: 'До нижней сотни расстояние больше. Ещё раз сравни два расстояния на отрезке.', en: 'The lower hundred is farther away. Compare the two distances on the number line again.' },
        },
      },
      {
        label: { uz: 'Minglikkacha', ru: 'До тысяч', en: 'To the nearest thousand' },
        audio: {
          intro: { uz: "Yigirma yetti ming uch yuz oltmish to'rt sonini minglikkacha yaxlitlang. Yaqinroq minglikni tanlang.", ru: 'Округли двадцать семь тысяч триста шестьдесят четыре до тысяч. Выбери ближайшую тысячу.', en: 'Round twenty-seven thousand three hundred and sixty-four to the nearest thousand. Select the closer thousand.' },
          on_correct: { uz: "To'g'ri. Quyi minglikkacha uch yuz oltmish to'rt birlik, yuqori minglikkacha olti yuz o'ttiz olti birlik bor. Quyi chegara yaqinroq.", ru: 'Верно. До нижней тысячи триста шестьдесят четыре единицы, а до верхней шестьсот тридцать шесть. Нижняя граница ближе.', en: 'Correct. The lower thousand is three hundred and sixty-four units away and the upper thousand is six hundred and thirty-six units away. The lower endpoint is closer.' },
          on_wrong: { uz: "Yuqori minglikkacha masofa kattaroq. Kesmada ikki masofani yana solishtiring.", ru: 'До верхней тысячи расстояние больше. Ещё раз сравни два расстояния на отрезке.', en: 'The upper thousand is farther away. Compare the two distances on the number line again.' },
        },
      },
    ],
  },
};

const createRoundingFlowState = () => ({
  guided: {
    step: 0,
    completed: [false, false, false],
  },
  practice: {
    step: 0,
    selected: [null, null, null],
    wrongValues: [[], [], []],
    attempts: [0, 0, 0],
    completed: [false, false, false],
  },
});

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Новая миссия', uz: 'Yangi missiya' , en: "New mission"},
    title: { ru: 'Городу нужны точные и примерные данные', uz: "Shaharga aniq va taqribiy ma'lumotlar kerak", en: "The city needs exact and approximate data" },
    lead: {
      ru: 'Табло Lumo City смешало точные показатели с приблизительными. Bit поможет выбрать подходящую точность для каждого сообщения.',
      uz: "Lumo City tablosi aniq ko'rsatkichlarni taqribiylari bilan aralashtirib yubordi. Bit har bir xabar uchun mos aniqlikni tanlashga yordam beradi.",
      en: "The Lumo City scoreboard mixed exact values with approximate ones. Bit will help choose the right level of accuracy for each message.",
    },
    instruction: {
      ru: 'Точный код сохраняем без изменений, а большое значение для быстрого обзора можно округлить.',
      uz: "Aniq kodni o'zgartirmay saqlaymiz, katta qiymatni esa tez ko'rish uchun yaxlitlash mumkin.",
      en: "Keep the exact code unchanged. A large value can be rounded for a quick overview.",
    },
    hookQuestion: { ru: 'Когда точное число можно заменить приближённым?', uz: 'Qachon aniq sonni yaqin qiymat bilan almashtirish mumkin?', en: "When can an exact number be replaced by an approximate value?" },
    model: {
      kind: 'dashboard',
      badge: { ru: 'Городское табло', uz: 'Shahar tablosi', en: "City scoreboard" },
      cards: [
        { label: { ru: 'код станции', uz: 'stansiya kodi', en: "station code" }, value: '48 764', result: { ru: 'точно', uz: 'aniq', en: "exact" }, tone: 'cyan' },
        { label: { ru: 'пассажиры за месяц', uz: "bir oydagi yo'lovchilar", en: "passengers per month" }, value: '48 764', result: { ru: 'примерно 49 000', uz: 'taxminan 49 000', en: "approximately 49,000" }, tone: 'accent' },
      ],
    },
    options: [
      { ru: 'Сначала определить, нужна точная или приблизительная запись', uz: 'Avval aniq yoki taqribiy yozuv kerakligini aniqlash', en: "First decide whether an exact or approximate form is needed" },
      { ru: 'Всегда заменять число ближайшей тысячей', uz: 'Har doim sonni eng yaqin minglik bilan almashtirish', en: "Always round to the nearest thousand" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Контекст определяет точность: код нужен полностью, а обзорный показатель удобно показать округлённо.',
      uz: "Aniqlik vaziyatga bog'liq: kod to'liq kerak, umumiy ko'rsatkichni esa yaxlitlab ko'rsatish qulay.",
      en: "Context determines the accuracy: the full code is needed, while a general figure is easier to read when rounded.",
    },
    wrong: [
      null,
      { ru: 'Тысячная точность подходит не каждой задаче.', uz: "Minglik aniqligi har bir vazifaga mos kelmaydi.", en: "Rounding to the nearest thousand does not suit every task." },
    ],
    audio: {
      intro: {
        ru: [
          'Привет, друг! Сегодня мы научимся округлять многозначные числа. Табло города смешало точные данные с приблизительными.',
          'Код станции нужно сохранить полностью, а большой поток пассажиров можно показать округлённо.',
          'Когда точное число можно заменить приближённым?',
        ],
        uz: [
          "Salom, do'stim! Bugun ko'p xonali sonlarni yaxlitlashni o'rganamiz. Shahar tablosi aniq ma'lumotlarni taqribiylari bilan aralashtirdi.",
          "Stansiya kodini to'liq saqlash kerak, katta yo'lovchilar oqimini esa yaxlitlab ko'rsatish mumkin.",
          'Qachon aniq sonni yaqin qiymat bilan almashtirish mumkin?',
        ],
        en: [
          "Hey, buddy! Today we'll learn how to round multi-digit numbers. The city scoreboard mixed exact data with approximate data.",
          "Keep the full station code, but show a large passenger total as a rounded value.",
          "When can an exact number be replaced by an approximate value?",
        ],
      },
      on_correct: {
        ru: 'Контекст подсказывает точность. Код оставляем точным, а обзорный показатель можно округлить.',
        uz: "Vaziyat aniqlikni ko'rsatadi. Kodni aniq qoldiramiz, umumiy ko'rsatkichni esa yaxlitlash mumkin.",
        en: "Correct. The context tells us the required accuracy. Keep the code exact, but the general figure can be rounded.",
      },
      on_wrong: [
        null,
        { ru: 'Сначала решаем, какая точность нужна в этой ситуации.', uz: "Avval bu vaziyatda qanday aniqlik kerakligini hal qilamiz.", en: "First, we decide what accuracy is needed in this situation." },
      ],
    },
  },
  s1: {
    eyebrow: { ru: 'Опорная карта', uz: 'Tayanch xarita', en: "Reference map" },
    title: { ru: 'Один разряд задаёт двух соседей', uz: "Bitta xona ikkita qo'shnini belgilaydi", en: "One place defines two neighbours." },
    lead: {
      ru: 'Перед округлением отмечаем целевой разряд. Он определяет шаг между соседними круглыми числами и количество будущих нулей.',
      uz: "Yaxlitlashdan oldin maqsad xonasini belgilaymiz. U qo'shni yaxlit sonlar orasidagi qadamni va kelajakdagi nollar sonini belgilaydi.",
      en: "Before rounding, mark the target place. It determines the interval between neighbouring round numbers and how many zeros the result will have.",
    },
    instruction: {
      ru: 'Для 48 764 меняются и соседи, и масштаб: десятки 48 760–48 770, сотни 48 700–48 800, тысячи 48 000–49 000.',
      uz: "48 764 uchun qo'shnilar va miqyos o'zgaradi: o'nliklar 48 760–48 770, yuzliklar 48 700–48 800, mingliklar 48 000–49 000.",
      en: "For 48,764, both the neighbours and the scale change: 48,760–48,770 for tens, 48,700–48,800 for hundreds, and 48,000–49,000 for thousands.",
    },
    model: {
      kind: 'targetMap',
      badge: { ru: 'Три масштаба', uz: 'Uch miqyos', en: "Three scales" },
      number: '48 764',
      rows: [
        { label: { ru: 'десятки', uz: "o'nlar" , en: "tens"}, lower: '48 760', upper: '48 770', zeros: '1' },
        { label: { ru: 'сотни', uz: 'yuzlar', en: 'hundreds' }, lower: '48 700', upper: '48 800', zeros: '2' },
        { label: { ru: 'тысячи', uz: 'minglar', en: 'thousands' }, lower: '48 000', upper: '49 000', zeros: '3' },
      ],
    },
    options: [
      { ru: 'Целевой разряд определяет соседей', uz: "Maqsad xonasi qo'shnilarni belgilaydi", en: "The target place determines the neighbours" },
      { ru: 'Соседи всегда одинаковы', uz: "Qo'shnilar har doim bir xil", en: "Neighbours are always the same" },
      { ru: 'Нужны обычные соседние числа', uz: "Oddiy qo'shni sonlar kerak", en: "Use consecutive whole numbers" },
      { ru: 'Целевой разряд не важен', uz: 'Maqsad xonasi muhim emas', en: "The target place does not matter" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Чем крупнее выбранный разряд, тем шире интервал между соседями и тем больше цифр справа позже станут нулями.',
      uz: "Tanlangan xona qanchalik katta bo'lsa, qo'shnilar oralig'i shunchalik keng va keyin nolga aylanadigan o'ng raqamlar shunchalik ko'p bo'ladi.",
      en: "The larger the selected place, the wider the interval between neighbours and the more digits on the right later become zeros.",
    },
    wrong: [
      null,
      { ru: 'Каждый разряд создаёт свою пару круглых соседей.', uz: "Har bir xona o'zining yaxlit qo'shnilar juftini yaratadi.", en: "Each place creates its own pair of round neighbours." },
      { ru: 'Нужны соседние числа выбранного разряда, а не соседние единицы.', uz: "Qo'shni birliklar emas, tanlangan xonaning qo'shni sonlari kerak.", en: "Use neighbouring round numbers for the selected place, not consecutive whole numbers." },
      { ru: 'Без целевого разряда нельзя выбрать масштаб округления.', uz: "Maqsad xonasisiz yaxlitlash miqyosini tanlab bo'lmaydi.", en: "Without a target place, you cannot choose the rounding scale." },
    ],
    audio: {
      intro: {
        ru: [
          'Сначала выбираем целевой разряд. Он задаёт шаг между двумя круглыми соседями.',
          'Для десятков шаг равен десяти, для сотен ста, для тысяч тысяче.',
        ],
        uz: [
          "Avval maqsad xonasini tanlaymiz. U ikkita yaxlit qo'shni orasidagi qadamni belgilaydi.",
          "O'nliklar uchun qadam o'n, yuzliklar uchun yuz, mingliklar uchun ming bo'ladi.",
        ],
        en: [
          "First select the target place. It sets the interval between two round neighbours.",
          "The interval is ten for tens, one hundred for hundreds, and one thousand for thousands.",
        ],
      },
      on_correct: {
        ru: 'Чем крупнее разряд, тем шире интервал и тем больше правых цифр после решения станут нулями.',
        uz: "Xona qanchalik katta bo'lsa, oraliq shunchalik keng va qarordan keyin ko'proq o'ng raqamlar nol bo'ladi.",
        en: "The larger the target place, the wider the interval and the more digits to its right will become zeros.",
      },
      on_wrong: [
        null,
        { ru: 'У каждого разряда своя пара круглых соседей.', uz: "Har bir xonaning o'z yaxlit qo'shnilar jufti bor.", en: "Each place has its own pair of round neighbours." },
        { ru: 'Ищем соседей выбранного масштаба.', uz: "Tanlangan miqyosdagi qo'shnilarni izlaymiz.", en: "Find the round neighbours for the chosen place." },
        { ru: 'Целевой разряд задаёт весь дальнейший алгоритм.', uz: 'Maqsad xonasi keyingi butun algoritmni belgilaydi.', en: "The target place determines the rest of the algorithm." },
      ],
    },
  },
  s2: {
    eyebrow: { ru: 'Три числовые прямые', uz: "Uchta son chizig'i", en: "Three number lines" },
    title: { ru: 'Одно число занимает три разных положения', uz: "Bitta son uch xil o'rinni egallaydi", en: "One number occupies three different positions." },
    lead: {
      ru: 'На каждом масштабе число 48 764 остаётся тем же, но его положение между круглыми соседями меняется.',
      uz: "Har bir miqyosda 48 764 soni o'zgarmaydi, ammo yaxlit qo'shnilar orasidagi o'rni o'zgaradi.",
      en: "On each scale, the number 48,764 remains the same, but its position between round neighbours varies.",
    },
    instruction: {
      ru: 'До десятков число ближе к 48 760, до сотен — к 48 800, до тысяч — к 49 000.',
      uz: "O'nlikkacha son 48 760 ga, yuzlikkacha 48 800 ga, minglikkacha esa 49 000 ga yaqin.",
      en: "To the nearest ten, the number is closer to 48,760; to the nearest hundred, it is closer to 48,800; and to the nearest thousand, it is closer to 49,000.",
    },
    model: {
      kind: 'multiNumberLine',
      badge: { ru: 'Сравнение масштабов', uz: 'Miqyoslarni solishtirish', en: "Comparing scales" },
      number: '48 764',
      lines: [
        { label: { ru: 'до десятков', uz: "o'nlikkacha", en: "to the nearest ten" }, lower: '48 760', upper: '48 770', position: 40, inspect: '4', result: '48 760' },
        { label: { ru: 'до сотен', uz: 'yuzlikkacha', en: "to the nearest hundred" }, lower: '48 700', upper: '48 800', position: 64, inspect: '6', result: '48 800' },
        { label: { ru: 'до тысяч', uz: 'minglikkacha', en: 'to the nearest thousand' }, lower: '48 000', upper: '49 000', position: 76.4, inspect: '7', result: '49 000' },
      ],
    },
    options: [
      { ru: '48 760, 48 800, 49 000', uz: '48 760, 48 800, 49 000' , en: "48 760, 48 800, 49 000"},
      { ru: '48 770, 48 700, 48 000', uz: '48 770, 48 700, 48 000' , en: "48 770, 48 700, 48 000"},
      { ru: '48 764 во всех случаях', uz: 'Barcha holatda 48 764', en: "48,764 in all cases" },
      { ru: '49 000 во всех случаях', uz: 'Barcha holatda 49 000', en: "49,000 in all cases" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Проверочные цифры 4, 6 и 7 объясняют три разных направления. После выбора соседа справа остаются 1, 2 или 3 нуля.',
      uz: "Tekshiruvchi 4, 6 va 7 raqamlari uch xil yo'nalishni tushuntiradi. Qo'shni tanlangach, o'ngda 1, 2 yoki 3 nol qoladi.",
      en: "The deciding digits 4, 6 and 7 explain the three different directions. After rounding, the result has one, two or three zeros on the right.",
    },
    wrong: [
      null,
      { ru: 'Направление определяется расстоянием до соседей.', uz: "Yo'nalish qo'shnilargacha masofa bilan belgilanadi.", en: "The direction is determined by the distance to the neighbours." },
      { ru: 'Округлённый результат меняется вместе с масштабом.', uz: "Yaxlitlangan natija miqyos bilan birga o'zgaradi.", en: "The rounded result changes with the scale." },
      { ru: 'Для каждого разряда выбирается своя пара соседей.', uz: "Har bir xona uchun o'z qo'shnilar jufti tanlanadi.", en: "For each place, a pair of neighbours is selected." },
    ],
    audio: {
      intro: {
        ru: [
          'Сравним три числовые прямые для одного числа.',
          'На десятках проверяем единицы, на сотнях десятки, на тысячах сотни.',
        ],
        uz: [
          "Bitta son uchun uchta son chizig'ini solishtiramiz.",
          "O'nliklarda birlarni, yuzliklarda o'nlarni, mingliklarda yuzlarni tekshiramiz.",
        ],
        en: [
          "Let us compare three number lines for the same number.",
          "For tens, check the ones digit; for hundreds, check the tens digit; and for thousands, check the hundreds digit.",
        ],
      },
      on_correct: {
        ru: 'Четыре ведёт к нижнему десятку, шесть к верхней сотне, а семь к верхней тысяче.',
        uz: "To'rt quyi o'nlikka, olti yuqori yuzlikka, yetti esa yuqori minglikka olib boradi.",
        en: "Four rounds to the lower ten, six to the upper hundred, and seven to the upper thousand.",
      },
      on_wrong: [
        null,
        { ru: 'Сравни положение маркера на каждой прямой.', uz: "Har bir chiziqdagi belgi o'rnini solishtiring.", en: "Compare the position of the marker on each line." },
        { ru: 'Три масштаба дают три разных приближения.', uz: 'Uch miqyos uch xil taqribiy qiymat beradi.', en: "Three scales give three different approximations." },
        { ru: 'Каждая прямая имеет собственных круглых соседей.', uz: "Har bir chiziqning o'z yaxlit qo'shnilari bor.", en: "Each number line has its own round-number neighbours." },
      ],
    },
  },
  s3: {
    eyebrow: { ru: 'Граница решения', uz: 'Qaror chegarasi', en: "Decision boundary" },
    title: { ru: 'Середина отделяет вниз от вверх', uz: "O'rta nuqta pastni yuqoridan ajratadi", en: "The midpoint separates rounding down from rounding up" },
    lead: {
      ru: 'На отрезке между круглыми соседями цифры от 0 до 4 лежат в нижней половине, а от 5 до 9 — в верхней.',
      uz: "Yaxlit qo'shnilar orasidagi kesmada 0 dan 4 gacha raqamlar quyi, 5 dan 9 gacha raqamlar yuqori yarmida yotadi.",
      en: "Between round neighbours, the digits from 0 to 4 are in the lower half, and the digits from 5 to 9 are in the upper half.",
    },
    instruction: {
      ru: '48 764 идёт к 48 760, 48 765 находится на границе и идёт к 48 770, а 48 766 тоже идёт вверх.',
      uz: "48 764 soni 48 760 ga boradi, 48 765 chegarada turib 48 770 ga boradi, 48 766 ham yuqoriga boradi.",
      en: "48,764 rounds to 48,760. The boundary value 48,765 rounds to 48,770, and 48,766 rounds up too.",
    },
    model: {
      kind: 'decisionContrast',
      badge: { ru: 'Нижняя и верхняя половины', uz: 'Quyi va yuqori yarimlar', en: "Lower and upper halves" },
      lower: '48 760',
      midpoint: '48 765',
      upper: '48 770',
      cases: [
        { value: '48 764', inspect: '4', result: '48 760', direction: 'down' },
        { value: '48 765', inspect: '5', result: '48 770', direction: 'up' },
        { value: '48 766', inspect: '6', result: '48 770', direction: 'up' },
      ],
    },
    options: [
      { ru: '0–4 вниз, 5–9 вверх', uz: '0–4 pastga, 5–9 yuqoriga', en: "0–4 round down, 5–9 round up" },
      { ru: '0–5 вниз, 6–9 вверх', uz: '0–5 pastga, 6–9 yuqoriga', en: "0–5 round down, 6–9 round up" },
      { ru: 'Только 9 ведёт вверх', uz: 'Faqat 9 yuqoriga olib boradi', en: "Only 9 rounds up" },
      { ru: 'Всегда выбираем нижнего соседа', uz: "Har doim quyi qo'shnini tanlaymiz", en: "Always choose the lower neighbour" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Цифра 5 принадлежит верхней половине. Это правило заменяет подсчёт расстояний и работает для любого выбранного разряда.',
      uz: "5 raqami yuqori yarmiga kiradi. Bu qoida masofani sanash o'rnini bosadi va har qanday tanlangan xona uchun ishlaydi.",
      en: "The digit 5 belongs to the upper half. This rule avoids calculating distances and works for any target place.",
    },
    wrong: [
      null,
      { ru: 'На границе 5 округляем вверх.', uz: '5 chegarasida yuqoriga yaxlitlaymiz.', en: "At the boundary digit 5, round up." },
      { ru: 'Вверх ведут пять разных цифр.', uz: 'Beshta turli raqam yuqoriga olib boradi.', en: "The five digits from 5 to 9 round up." },
      { ru: 'Верхняя половина ведёт к верхнему соседу.', uz: "Yuqori yarim yuqori qo'shniga olib boradi.", en: "The upper half leads to the upper neighbour." },
    ],
    audio: {
      intro: {
        ru: [
          'Середина делит отрезок на нижнюю и верхнюю половины.',
          'Цифры от нуля до четырёх ведут вниз, а от пяти до девяти вверх.',
        ],
        uz: [
          "O'rta nuqta kesmani quyi va yuqori yarmiga ajratadi.",
          "Noldan to'rtgacha raqamlar pastga, beshdan to'qqizgacha esa yuqoriga olib boradi.",
        ],
        en: [
          "The midpoint divides the interval into a lower half and an upper half.",
          "Digits from zero to four round down, and digits from five to nine round up.",
        ],
      },
      on_correct: {
        ru: 'Пять уже относится к верхней половине. Поэтому число на границе округляется вверх.',
        uz: "Besh allaqachon yuqori yarmiga kiradi. Shuning uchun chegaradagi son yuqoriga yaxlitlanadi.",
        en: "Correct. Five is in the upper half, so the boundary value rounds up.",
      },
      on_wrong: [
        null,
        { ru: 'Граница начинается с пяти.', uz: 'Chegara beshdan boshlanadi.', en: "The upper half begins with five." },
        { ru: 'Верхняя половина включает пять, шесть, семь, восемь и девять.', uz: "Yuqori yarim besh, olti, yetti, sakkiz va to'qqizni o'z ichiga oladi.", en: "The top half includes five, six, seven, eight and nine." },
        { ru: 'Сравни число с серединой отрезка.', uz: "Sonni kesmaning o'rta nuqtasi bilan solishtiring.", en: "Compare the number with the midpoint of the interval." },
      ],
    },
  },
  s4: {
    eyebrow: { ru: 'Граница и перенос', uz: "Chegara va o'tish", en: "Boundary and carrying" },
    title: { ru: 'Пять ведёт вверх, девять переносит разряд', uz: "Besh yuqoriga olib boradi, to'qqiz xonani o'tkazadi", en: "Five rounds up, and nine causes carrying" },
    lead: {
      ru: 'На границе пяти округляем вверх. Иногда увеличение проходит через цифру 9 и создаёт новый разряд.',
      uz: "Besh chegarasida yuqoriga yaxlitlaymiz. Ba'zan oshirish 9 raqamidan o'tib, yangi xona hosil qiladi.",
      en: "When the deciding digit is five, round up. Sometimes the increase carries through a 9 and creates a new place.",
    },
    instruction: {
      ru: '27 450 до сотен даёт 27 500, а 9 950 до сотен даёт 10 000.',
      uz: "27 450 yuzlikkacha 27 500, 9 950 esa yuzlikkacha 10 000 bo'ladi.",
      en: "Rounding 27,450 to the nearest hundred gives 27,500, while rounding 9,950 to the nearest hundred gives 10,000.",
    },
    model: {
      kind: 'carry',
      badge: { ru: 'Два граничных случая', uz: 'Ikki chegaraviy holat', en: "Two boundary cases" },
      examples: [
        { from: '27 450', inspect: '5', target: '4', to: '27 500', note: { ru: 'граница пяти', uz: 'besh chegarasi', en: "midpoint at five" } },
        { from: '9 950', inspect: '5', target: '9', to: '10 000', note: { ru: 'перенос через девять', uz: "to'qqizdan o'tish", en: "carry through nine" } },
      ],
    },
    options: [
      { ru: 'Оба числа округляются вверх', uz: 'Ikkala son ham yuqoriga yaxlitlanadi', en: "Both numbers are rounded up" },
      { ru: 'Оба числа округляются вниз', uz: 'Ikkala son ham pastga yaxlitlanadi', en: "Both numbers are rounded down." },
      { ru: 'Первое вниз, второе вверх', uz: 'Birinchisi pastga, ikkinchisi yuqoriga', en: "The first rounds down; the second rounds up" },
      { ru: 'Сохраняются исходные числа', uz: "Boshlang'ich sonlar o'zgarmaydi", en: "The original numbers stay unchanged" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Цифра 5 относится к верхней половине. Если выбранный разряд равен 9, увеличение переносится влево.',
      uz: "5 raqami yuqori yarmiga kiradi. Tanlangan xona 9 bo'lsa, oshirish chapga o'tadi.",
      en: "The digit 5 belongs to the upper half. If the target-place digit is 9, the increase carries to the left.",
    },
    wrong: [
      null,
      { ru: 'На границе 5 округление идёт вверх.', uz: '5 chegarasida yaxlitlash yuqoriga boradi.', en: "When the deciding digit is 5, round up." },
      { ru: 'В обоих примерах справа от сотен стоит 5.', uz: "Ikkala misolda ham yuzlarning o'ngida 5 turibdi.", en: "In both examples, the digit immediately to the right of the hundreds place is 5." },
      { ru: 'При округлении правые цифры не сохраняются.', uz: "Yaxlitlashda o'ngdagi raqamlar saqlanmaydi.", en: "The digits to the right are not kept after rounding." },
    ],
    audio: {
      intro: {
        ru: ['Цифра пять открывает верхнюю половину, поэтому на границе округляем вверх.'],
        uz: ['Besh raqami yuqori yarmini boshlaydi, shuning uchun chegarada yuqoriga yaxlitlaymiz.'],
        en: ["The digit five begins the upper half, so at the midpoint we round up."],
      },
      on_correct: {
        ru: 'Если сотни равны девяти, их увеличение переносится в разряд тысяч и может создать новый разряд.',
        uz: "Yuzlar to'qqiz bo'lsa, oshirish minglar xonasiga o'tadi va yangi xona hosil qilishi mumkin.",
        en: "Correct. If the hundreds digit is nine, increasing it carries into the thousands place and can create a new place.",
      },
      on_wrong: [
        null,
        { ru: 'Пять всегда относится к округлению вверх.', uz: 'Besh har doim yuqoriga yaxlitlashga kiradi.', en: "Five always means round up." },
        { ru: 'Сравни цифру сразу справа от сотен в обоих примерах.', uz: "Ikkala misolda yuzlarning darhol o'ngidagi raqamni solishtiring.", en: "Compare the digit immediately to the right of the hundreds place in both examples." },
        { ru: 'После решения все цифры справа заменяются нулями.', uz: "Qarordan keyin o'ngdagi barcha raqamlar nolga almashtiriladi.", en: "After the decision, replace every digit to the right with zeros." },
      ],
    },
  },
  s5: {
    eyebrow: { ru: 'Три уровня точности', uz: 'Uch aniqlik darajasi', en: "Three levels of accuracy" },
    title: { ru: 'Одно число, три результата', uz: 'Bitta son, uchta natija', en: "One number, three results" },
    lead: {
      ru: 'Результат зависит от выбранного разряда, хотя исходное число остаётся тем же.',
      uz: "Boshlang'ich son bir xil bo'lsa ham, natija tanlangan xonaga bog'liq.",
      en: "The result depends on the selected place, although the original number remains the same.",
    },
    instruction: {
      ru: '126 549 округляется до десятков как 126 550, до сотен как 126 500, до тысяч как 127 000.',
      uz: "126 549 o'nlikkacha 126 550, yuzlikkacha 126 500, minglikkacha 127 000 bo'ladi.",
      en: "Rounding 126,549 gives 126,550 to the nearest ten, 126,500 to the nearest hundred, and 127,000 to the nearest thousand.",
    },
    model: {
      kind: 'precision',
      badge: { ru: 'Смена точности', uz: "Aniqlikni o'zgartirish", en: "Change of accuracy" },
      number: '126 549',
      rows: [
        { label: { ru: 'до десятков', uz: "o'nlikkacha", en: "to the nearest ten" }, inspect: '9', value: '126 550' },
        { label: { ru: 'до сотен', uz: 'yuzlikkacha', en: "to the nearest hundred" }, inspect: '4', value: '126 500' },
        { label: { ru: 'до тысяч', uz: 'minglikkacha', en: 'to the nearest thousand' }, inspect: '5', value: '127 000' },
      ],
    },
    options: [
      { ru: 'Выбранный разряд меняет результат', uz: "Tanlangan xona natijani o'zgartiradi", en: "The selected place changes the result" },
      { ru: 'Результат всегда один', uz: 'Natija har doim bitta', en: "The result is always the same" },
      { ru: 'Все три записи точные', uz: 'Uchala yozuv ham aniq', en: "All three forms are exact" },
      { ru: 'Нули можно не записывать', uz: "Nollarni yozmasa ham bo'ladi", en: "Zeros don't have to be written down." },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Каждая точность использует свою проверочную цифру и своё количество нулей справа.',
      uz: "Har bir aniqlik o'z tekshiruvchi raqami va o'ngdagi nollar sonidan foydalanadi.",
      en: "Each level of accuracy uses its own deciding digit and its own number of zeros on the right.",
    },
    wrong: [
      null,
      { ru: 'Для разных разрядов получаются разные приближения.', uz: "Turli xonalar uchun turli taqribiy qiymatlar hosil bo'ladi.", en: "Different target places give different approximations." },
      { ru: 'Это приблизительные, а не точные записи.', uz: 'Bular aniq emas, taqribiy yozuvlar.', en: "These are approximate forms, not exact values." },
      { ru: 'Нули показывают выбранную точность и должны остаться.', uz: "Nollar tanlangan aniqlikni ko'rsatadi va saqlanishi kerak.", en: "The zeros show the chosen accuracy and must remain." },
    ],
    audio: {
      intro: {
        ru: ['Одно число можно округлить с разной точностью. Каждый раз меняется целевой разряд и проверочная цифра.'],
        uz: ["Bitta sonni turli aniqlikda yaxlitlash mumkin. Har safar maqsad xonasi va tekshiruvchi raqam o'zgaradi."],
        en: ["One number can be rounded to different levels of accuracy. Each time, the target place and deciding digit change."],
      },
      on_correct: {
        ru: 'До десятков проверяем единицы, до сотен десятки, а до тысяч сотни.',
        uz: "O'nlikkacha birlarni, yuzlikkacha o'nlarni, minglikkacha esa yuzlarni tekshiramiz.",
        en: "Correct. For the nearest ten, check the ones digit; for the nearest hundred, check the tens digit; and for the nearest thousand, check the hundreds digit.",
      },
      on_wrong: [
        null,
        { ru: 'Смена целевого разряда меняет ближайших соседей.', uz: "Maqsad xonasi o'zgarsa, eng yaqin qo'shnilar ham o'zgaradi.", en: "Changing the target place changes the nearest neighbours." },
        { ru: 'Округлённая запись показывает приближённое значение.', uz: "Yaxlitlangan yozuv taqribiy qiymatni ko'rsatadi.", en: "A rounded form shows an approximate value." },
        { ru: 'Правые нули фиксируют уровень точности.', uz: "O'ngdagi nollar aniqlik darajasini ko'rsatadi.", en: "The zeros on the right show the level of accuracy." },
      ],
    },
  },
  s6: {
    eyebrow: { ru: 'Собираем правило', uz: "Qoidani yig'amiz" , en: "Making a rule"},
    title: { ru: 'Четыре шага округления', uz: "Yaxlitlashning to'rt qadami", en: "Four rounding steps" },
    lead: {
      ru: 'Наблюдения превращаются в единый алгоритм для десятков, сотен и тысяч.',
      uz: "Kuzatuvlar o'nlik, yuzlik va mingliklar uchun yagona algoritmga aylanadi.",
      en: "Observations become a single algorithm for tens, hundreds and thousands.",
    },
    instruction: {
      ru: 'Находим целевой разряд, проверяем соседнюю цифру справа, принимаем решение и обнуляем правую часть.',
      uz: "Maqsad xonasini topamiz, o'ngdagi qo'shni raqamni tekshiramiz, qaror qilamiz va o'ng qismini nollaymiz.",
      en: "Find the target place, check the digit immediately to its right, decide the direction, and replace all digits to the right with zeros.",
    },
    model: {
      kind: 'steps',
      badge: { ru: 'Алгоритм', uz: 'Algoritm' , en: "Algorithm"},
      steps: [
        { ru: '1. Найти целевой разряд', uz: '1. Maqsad xonasini topish', en: "1. Find the target place" },
        { ru: '2. Посмотреть на цифру справа', uz: "2. O'ngdagi raqamga qarash", en: "2. Look at the digit to the right" },
        { ru: '3. От 0 до 4 вниз, от 5 до 9 вверх', uz: '3. 0 dan 4 gacha pastga, 5 dan 9 gacha yuqoriga', en: "3. 0–4 round down; 5–9 round up" },
        { ru: '4. Справа записать нули', uz: "4. O'ng tomonga nollar yozish", en: "4. Write the zeros on the right." },
      ],
    },
    options: [
      { ru: 'Целевой разряд → сосед справа → решение → нули', uz: "Maqsad xonasi → o'ng qo'shni → qaror → nollar", en: "target place → digit to the right → decision → zeros" },
      { ru: 'Округлить каждую цифру отдельно', uz: 'Har bir raqamni alohida yaxlitlash', en: "Round each digit separately" },
      { ru: 'Смотреть только на целевой разряд', uz: 'Faqat maqsad xonasiga qarash', en: "Look only at the target place" },
      { ru: 'Сохранить все цифры справа', uz: "O'ngdagi barcha raqamlarni saqlash", en: "Keep all the digits on the right" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Решение принимает только цифра сразу справа. Остальные правые цифры после этого заменяются нулями.',
      uz: "Qarorni faqat darhol o'ngdagi raqam qiladi. Shundan keyin boshqa o'ng raqamlar nolga almashtiriladi.",
      en: "Only the digit immediately to the right makes the decision. Then replace the other digits to the right with zeros.",
    },
    wrong: [
      null,
      { ru: 'Число округляется целиком до одного выбранного разряда.', uz: 'Son bitta tanlangan xonagacha yaxlitlanadi.', en: "Round the whole number to one selected place." },
      { ru: 'Нужна цифра сразу справа от цели.', uz: "Maqsadning darhol o'ngidagi raqam kerak.", en: "Use the digit immediately to the right of the target place." },
      { ru: 'Правые цифры заменяются нулями.', uz: "O'ngdagi raqamlar nolga almashtiriladi.", en: "The digits to the right are replaced by zeros." },
    ],
    audio: {
      intro: {
        ru: ['Соберём правило. Сначала выбираем разряд, затем смотрим на цифру сразу справа.'],
        uz: ["Qoidani yig'amiz. Avval xonani tanlaymiz, keyin darhol o'ngdagi raqamga qaraymiz."],
        en: ["Let us make the rule. First choose the target place, then look at the digit immediately to its right."],
      },
      on_correct: {
        ru: 'От нуля до четырёх округляем вниз, от пяти до девяти вверх. После решения справа записываем нули.',
        uz: "Noldan to'rtgacha pastga, beshdan to'qqizgacha yuqoriga yaxlitlaymiz. Qarordan keyin o'ng tomonga nollar yozamiz.",
        en: "Correct. Round down for zero to four and round up for five to nine. Then write zeros to the right.",
      },
      on_wrong: [
        null,
        { ru: 'Округление работает с выбранным разрядом, а не с каждой цифрой отдельно.', uz: 'Yaxlitlash har bir raqam bilan alohida emas, tanlangan xona bilan ishlaydi.', en: "Round to the selected place, not each digit separately." },
        { ru: 'Целевой разряд сам не принимает решение.', uz: "Maqsad xonasining o'zi qaror qilmaydi.", en: "The target place does not make the decision itself." },
        { ru: 'После решения правую часть заменяем нулями.', uz: "Qarordan keyin o'ng qismini nollar bilan almashtiramiz.", en: "After the decision, the right side is replaced by zeros." },
      ],
    },
  },
  s7: {
    eyebrow: { ru: 'Мини-проверка', uz: 'Mini tekshiruv', en: "Mini check" },
    title: { ru: 'Округли до сотен', uz: 'Yuzlikkacha yaxlitlang', en: "Round to the nearest hundred" },
    lead: {
      ru: 'Теперь один короткий ответ без готовых вариантов.',
      uz: 'Endi tayyor variantlarsiz bitta qisqa javob.',
      en: "Now one short answer with no ready-made options.",
    },
    instruction: {
      ru: 'Округли 63 746 до ближайших сотен.',
      uz: '63 746 sonini eng yaqin yuzlikkacha yaxlitlang.',
      en: "Round 63,746 to the nearest hundred.",
    },
    model: {
      kind: 'roundingFocus',
      badge: { ru: 'Мини-проверка', uz: 'Mini tekshiruv', en: "Mini check" },
      number: '63 746',
      targetIndex: 2,
      inspectIndex: 3,
      result: '?',
      direction: 'down',
    },
    options: ['63 700', '63 800', '63 740', '64 000'],
    correctIndex: 0,
    inputWrongDefault: {
      ru: 'Отметь сотни, посмотри на десятки и замени две правые цифры нулями.',
      uz: "Yuzlarni belgilang, o'nlarga qarang va o'ngdagi ikkita raqamni nolga almashtiring.",
      en: "Mark the hundreds place, look at the tens digit, and replace the two digits on the right with zeros.",
    },
    inputWrongAudio: {
      ru: 'Для сотен решение принимает цифра десятков. После решения справа остаются два нуля.',
      uz: "Yuzlik uchun qarorni o'nlar raqami qiladi. Qarordan keyin o'ngda ikkita nol qoladi.",
      en: "For rounding to the nearest hundred, the tens digit makes the decision. Afterwards, two zeros remain on the right.",
    },
    correctText: {
      ru: '63 700: в десятках стоит 4, поэтому сотни сохраняются, а десятки и единицы становятся нулями.',
      uz: "63 700: o'nlar xonasida 4 turibdi, shuning uchun yuzlar saqlanadi, o'nlar va birlar nol bo'ladi.",
      en: "63,700: the tens digit is 4, so the hundreds digit stays the same, while the tens and ones become zeros.",
    },
    wrong: [
      null,
      { ru: '63 800 получилось бы при цифре десятков от 5 до 9. Здесь стоит 4.', uz: "63 800 o'nlar raqami 5 dan 9 gacha bo'lganda hosil bo'lardi. Bu yerda 4 turibdi.", en: "63,800 would be the result if the tens digit were from 5 to 9. Here it is 4." },
      { ru: '63 740 сохраняет десятки. После округления до сотен нужны два нуля.', uz: "63 740 o'nlarni saqlaydi. Yuzlikkacha yaxlitlashdan keyin ikkita nol kerak.", en: "63,740 keeps the tens digit. After rounding to the nearest hundred, two zeros are needed." },
      { ru: '64 000 — округление до тысяч, а не до сотен.', uz: '64 000 minglikkacha yaxlitlash, yuzlikkacha emas.', en: "64,000 is the result of rounding to the nearest thousand, not the nearest hundred." },
    ],
    audio: {
      intro: {
        ru: ['Округли шестьдесят три тысячи семьсот сорок шесть до ближайших сотен.'],
        uz: ['Oltmish uch ming yetti yuz qirq olti sonini eng yaqin yuzlikkacha yaxlitlang.'],
        en: ["Round sixty-three thousand seven hundred and forty-six to the nearest hundred."],
      },
      on_correct: {
        ru: 'В десятках стоит четыре. Сотни сохраняются, а две правые цифры становятся нулями.',
        uz: "O'nlar xonasida to'rt turibdi. Yuzlar saqlanadi, o'ngdagi ikkita raqam nol bo'ladi.",
        en: "Correct. The tens digit is four. The hundreds digit stays the same, and the two digits on the right become zeros.",
      },
      on_wrong: [
        null,
        { ru: 'Четыре не увеличивает сотни.', uz: "To'rt yuzlarni oshirmaydi.", en: "Four does not increase the hundreds digit." },
        { ru: 'После округления до сотен справа остаются два нуля.', uz: "Yuzlikkacha yaxlitlashdan keyin o'ngda ikkita nol qoladi.", en: "After rounding to the nearest hundred, two zeros remain on the right." },
        { ru: 'Сохрани точность до сотен, не до тысяч.', uz: 'Minglikkacha emas, yuzlikkacha aniqlikni saqlang.', en: "Round to the nearest hundred, not the nearest thousand." },
      ],
    },
  },
  s8: {
    eyebrow: { ru: 'Развёрнутый пример', uz: 'Batafsil misol', en: "Worked example" },
    title: { ru: 'Проверяем три точности на новом числе', uz: 'Yangi sonda uch aniqlikni tekshiramiz', en: "Test three levels of accuracy with a new number" },
    lead: {
      ru: 'В каждом ряду отмечен свой целевой разряд и своя проверочная цифра.',
      uz: "Har bir qatorda o'z maqsad xonasi va o'z tekshiruvchi raqami belgilangan.",
      en: "Each row has its own target place and deciding digit.",
    },
    instruction: {
      ru: '395 860 даёт 395 860 до десятков, 395 900 до сотен и 396 000 до тысяч.',
      uz: "395 860 o'nlikkacha 395 860, yuzlikkacha 395 900 va minglikkacha 396 000 bo'ladi.",
      en: "Rounding 395,860 gives 395,860 to the nearest ten, 395,900 to the nearest hundred, and 396,000 to the nearest thousand.",
    },
    model: {
      kind: 'precision',
      badge: { ru: 'Рабочая таблица', uz: 'Ish jadvali', en: "Working table" },
      number: '395 860',
      rows: [
        { label: { ru: 'до десятков', uz: "o'nlikkacha", en: "to the nearest ten" }, inspect: '0', value: '395 860' },
        { label: { ru: 'до сотен', uz: 'yuzlikkacha', en: "to the nearest hundred" }, inspect: '6', value: '395 900' },
        { label: { ru: 'до тысяч', uz: 'minglikkacha', en: 'to the nearest thousand' }, inspect: '8', value: '396 000' },
      ],
    },
    options: [
      { ru: 'Все три результата согласованы с правилом', uz: 'Uchala natija ham qoidaga mos', en: "All three results are consistent with the rule." },
      { ru: 'До сотен должно быть 395 800', uz: "Yuzlikkacha 395 800 bo'lishi kerak", en: "To the nearest hundred, the result should be 395,800" },
      { ru: 'До тысяч должно быть 395 000', uz: "Minglikkacha 395 000 bo'lishi kerak", en: "To the nearest thousand, the result should be 395,000" },
      { ru: 'До десятков нужно менять число', uz: "O'nlikkacha sonni o'zgartirish kerak", en: "To the nearest ten, the number must change" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Ноль сохраняет десятки, шесть увеличивает сотни, а восемь увеличивает тысячи.',
      uz: "Nol o'nlarni saqlaydi, olti yuzlarni oshiradi, sakkiz esa minglarni oshiradi.",
      en: "Zero keeps the tens digit unchanged, six increases the hundreds digit, and eight increases the thousands digit.",
    },
    wrong: [
      null,
      { ru: 'Шесть в десятках ведёт к верхней сотне.', uz: "O'nlardagi olti yuqori yuzlikka olib boradi.", en: "A six in the tens place rounds to the upper hundred." },
      { ru: 'Восемь в сотнях ведёт к верхней тысяче.', uz: 'Yuzlardagi sakkiz yuqori minglikka olib boradi.', en: "An eight in the hundreds place rounds to the upper thousand." },
      { ru: 'Ноль в единицах оставляет число на том же десятке.', uz: "Birlar xonasidagi nol sonni shu o'nlikda qoldiradi.", en: "A zero in the ones place keeps the number at the same ten." },
    ],
    audio: {
      intro: {
        ru: ['Разберём новое число с тремя уровнями точности. Проверочная цифра каждый раз меняется.'],
        uz: ["Yangi sonni uch aniqlik darajasida tahlil qilamiz. Tekshiruvchi raqam har safar o'zgaradi."],
        en: ["Let us examine a new number at three levels of accuracy. The deciding digit changes each time."],
      },
      on_correct: {
        ru: 'Ноль сохраняет десятки, шесть повышает сотни, а восемь повышает тысячи.',
        uz: "Nol o'nlarni saqlaydi, olti yuzlarni, sakkiz esa minglarni oshiradi.",
        en: "Zero keeps the tens digit unchanged, six increases the hundreds digit, and eight increases the thousands digit.",
      },
      on_wrong: [
        null,
        { ru: 'Шесть относится к верхней половине.', uz: 'Olti yuqori yarmiga kiradi.', en: "Six belongs to the upper half." },
        { ru: 'Восемь относится к верхней половине.', uz: 'Sakkiz yuqori yarmiga kiradi.', en: "Eight belongs to the upper half." },
        { ru: 'Ноль не увеличивает выбранный разряд.', uz: 'Nol tanlangan xonani oshirmaydi.', en: "Zero does not increase the selected place." },
      ],
    },
  },
  s9: {
    eyebrow: { ru: 'Лаборатория примеров', uz: 'Misollar laboratoriyasi' , en: "Worked-example lab"},
    title: { ru: 'Четыре готовых решения', uz: "To'rtta tayyor yechim", en: "Four worked solutions" },
    lead: {
      ru: 'Каждая карточка показывает целевой разряд, проверочную цифру и готовый результат.',
      uz: "Har bir kartochka maqsad xonasi, tekshiruvchi raqam va tayyor natijani ko'rsatadi.",
      en: "Each card shows the target place, deciding digit and final result.",
    },
    audio: {
      intro: {
        ru: ['Разберём четыре готовых решения. Следи, какая цифра принимает решение и сколько нулей остаётся справа.'],
        uz: ["To'rtta tayyor yechimni tahlil qilamiz. Qaysi raqam qaror qilishi va o'ngda nechta nol qolishini kuzating."],
        en: ["Let us examine four worked solutions. Notice which digit decides and how many zeros remain on the right."],
      },
    },
    items: [
      {
        question: { ru: '72 345 до десятков', uz: "72 345 o'nlikkacha", en: "72,345 to the nearest ten" },
        options: ['72 350', '72 340', '72 300', '73 000'],
        correctIndex: 0,
        correctText: {
          ru: 'В единицах стоит 5, поэтому десятки увеличиваются.',
          uz: "Birlar xonasida 5 turibdi, shuning uchun o'nlar oshadi.",
          en: "The ones digit is 5, so the tens digit increases.",
        },
        wrong: [
          null,
          { ru: 'При 5 округляем вверх.', uz: "5 bo'lganda yuqoriga yaxlitlaymiz.", en: "When the deciding digit is 5, round up." },
          { ru: 'Это округление до сотен.', uz: 'Bu yuzlikkacha yaxlitlash.', en: "That is rounding to the nearest hundred." },
          { ru: 'Это слишком крупная точность.', uz: 'Bu juda katta aniqlik.', en: "That rounding is too coarse." },
        ],
        audio: {
          intro: { ru: ['Округляем семьдесят две тысячи триста сорок пять до десятков.'], uz: ["Yetmish ikki ming uch yuz qirq beshni o'nlikkacha yaxlitlaymiz."], en: ["Round seventy-two thousand three hundred and forty-five to the nearest ten."] },
          on_correct: { ru: 'Пять в единицах увеличивает десятки. Получаем семьдесят две тысячи триста пятьдесят.', uz: "Birlar xonasidagi besh o'nlarni oshiradi. Yetmish ikki ming uch yuz ellik hosil bo'ladi.", en: "Correct. The ones digit is five, so the tens place increases. The result is seventy-two thousand three hundred and fifty." },
          on_wrong: [null, { ru: 'Пять ведёт вверх.', uz: 'Besh yuqoriga olib boradi.', en: "Five means round up." }, { ru: 'Сохрани точность до десятков.', uz: "O'nlikkacha aniqlikni saqlang.", en: "Round to the nearest ten." }, { ru: 'В этом примере округляем до десятков, а не до тысяч.', uz: "Bu misolda minglikkacha emas, o'nlikkacha yaxlitlash kerak.", en: "In this example, round to the nearest ten, not the nearest thousand." }],
        },
      },
      {
        question: { ru: '72 345 до сотен', uz: '72 345 yuzlikkacha', en: "72,345 to the nearest hundred" },
        options: ['72 300', '72 400', '72 340', '72 000'],
        correctIndex: 0,
        correctText: {
          ru: 'В десятках стоит 4, поэтому сотни сохраняются.',
          uz: "O'nlar xonasida 4 turibdi, shuning uchun yuzlar saqlanadi.",
          en: "The tens digit is 4, so the hundreds digit stays the same.",
        },
        wrong: [
          null,
          { ru: 'Четыре не увеличивает сотни.', uz: "To'rt yuzlarni oshirmaydi.", en: "Four does not increase the hundreds digit." },
          { ru: 'После сотен справа нужны два нуля.', uz: "Yuzlardan keyin o'ngda ikkita nol kerak.", en: "Rounding to the nearest hundred requires two zeros on the right." },
          { ru: 'Это округление до тысяч.', uz: 'Bu minglikkacha yaxlitlash.', en: "That is rounding to the nearest thousand." },
        ],
        audio: {
          intro: { ru: ['Теперь округляем то же число до сотен и смотрим на десятки.'], uz: ["Endi shu sonni yuzlikkacha yaxlitlab, o'nlar xonasiga qaraymiz."], en: ["Now round the same number to the nearest hundred and look at the tens digit."] },
          on_correct: { ru: 'Четыре в десятках сохраняет сотни. Получаем семьдесят две тысячи триста.', uz: "O'nlardagi to'rt yuzlarni saqlaydi. Yetmish ikki ming uch yuz hosil bo'ladi.", en: "Correct. Four in the tens place leaves the hundreds digit unchanged. The result is seventy-two thousand three hundred." },
          on_wrong: [null, { ru: 'Четыре ведёт вниз.', uz: "To'rt pastga olib boradi.", en: "Four means round down." }, { ru: 'Справа от сотен нужны нули.', uz: "Yuzlarning o'ngida nollar kerak.", en: "Zeros are needed to the right of the hundreds place." }, { ru: 'Сохрани точность до сотен.', uz: 'Yuzlikkacha aniqlikni saqlang.', en: "Round to the nearest hundred." }],
        },
      },
      {
        question: { ru: '72 345 до тысяч', uz: '72 345 minglikkacha', en: "72,345 to the nearest thousand" },
        options: ['72 000', '73 000', '72 300', '70 000'],
        correctIndex: 0,
        correctText: {
          ru: 'В сотнях стоит 3, поэтому тысячи сохраняются.',
          uz: 'Yuzlar xonasida 3 turibdi, shuning uchun minglar saqlanadi.',
          en: "The hundreds digit is 3, so the thousands digit stays the same.",
        },
        wrong: [
          null,
          { ru: 'Три не увеличивает тысячи.', uz: 'Uch minglarni oshirmaydi.', en: "Three does not increase the thousands digit." },
          { ru: 'После тысяч справа нужны три нуля.', uz: "Minglardan keyin o'ngda uchta nol kerak.", en: "Rounding to the nearest thousand requires three zeros on the right." },
          { ru: 'Это округление до десятков тысяч.', uz: "Bu o'n minglikkacha yaxlitlash.", en: "That is rounding to the nearest ten thousand." },
        ],
        audio: {
          intro: { ru: ['Теперь округляем то же число до тысяч и смотрим на сотни.'], uz: ['Endi shu sonni minglikkacha yaxlitlab, yuzlar xonasiga qaraymiz.'], en: ["Now round the same number to the nearest thousand and look at the hundreds digit."] },
          on_correct: { ru: 'Три в сотнях сохраняет тысячи. Получаем семьдесят две тысячи.', uz: "Yuzlardagi uch minglarni saqlaydi. Yetmish ikki ming hosil bo'ladi.", en: "Correct. Three in the hundreds place leaves the thousands digit unchanged. The result is seventy-two thousand." },
          on_wrong: [null, { ru: 'Три ведёт вниз.', uz: 'Uch pastga olib boradi.', en: "Three means round down." }, { ru: 'Справа от тысяч нужны нули.', uz: "Minglarning o'ngida nollar kerak.", en: "Zeros are needed to the right of the thousands place." }, { ru: 'Не переходи к десяткам тысяч.', uz: "O'n mingliklarga o'tmang.", en: "Do not round to the nearest ten thousand." }],
        },
      },
      {
        question: { ru: '999 500 до тысяч', uz: '999 500 minglikkacha', en: "999,500 to the nearest thousand" },
        options: ['1 000 000', '999 000', '999 500', '100 000'],
        correctIndex: 0,
        correctText: {
          ru: 'Пять в сотнях увеличивает 999 тысяч и создаёт 1 миллион.',
          uz: 'Yuzlardagi 5 raqami 999 mingni oshirib, 1 million hosil qiladi.',
          en: "The hundreds digit is 5, so 999 thousand increases to 1 million.",
        },
        wrong: [
          null,
          { ru: 'Пять требует округлить вверх.', uz: 'Besh yuqoriga yaxlitlashni talab qiladi.', en: "The deciding digit 5 means round up." },
          { ru: 'Правые цифры должны стать нулями.', uz: "O'ngdagi raqamlar nolga aylanishi kerak.", en: "The digits on the right must become zeros." },
          { ru: 'Потерян один разряд.', uz: "Bitta xona yo'qolgan.", en: "One place is missing." },
        ],
        audio: {
          intro: { ru: ['Округляем девятьсот девяносто девять тысяч пятьсот до тысяч.'], uz: ["To'qqiz yuz to'qson to'qqiz ming besh yuzni minglikkacha yaxlitlaymiz."], en: ["Round nine hundred and ninety-nine thousand five hundred to the nearest thousand."] },
          on_correct: { ru: 'Пять увеличивает тысячи. Перенос проходит через три девятки и создаёт один миллион.', uz: "Besh minglarni oshiradi. O'tish uchta to'qqizdan o'tib, bir million hosil qiladi.", en: "Correct. The deciding digit five increases the thousands place. The carry passes through three nines and creates one million." },
          on_wrong: [null, { ru: 'Пять ведёт вверх.', uz: 'Besh yuqoriga olib boradi.', en: "Five means round up." }, { ru: 'После решения справа остаются нули.', uz: "Qarordan keyin o'ngda nollar qoladi.", en: "After the decision, there are zeros on the right." }, { ru: 'Сохрани новый старший разряд.', uz: 'Yangi katta xonani saqlang.', en: "Keep the new highest place." }],
        },
      },
    ],
    completionText: { ru: 'Четыре решения разобраны.', uz: "To'rtta yechim tahlil qilindi." , en: "Four solutions reviewed"},
  },
  s10: {
    eyebrow: { ru: 'Стратегия точности', uz: 'Aniqlik strategiyasi', en: "Accuracy strategy" },
    title: { ru: 'Когда нужна точность, а когда приближение', uz: 'Qachon aniqlik, qachon taqribiylik kerak', en: "When to use an exact value and when to use an approximation" },
    lead: {
      ru: 'Округление полезно не всегда. Сначала определяем, какую задачу решает число.',
      uz: "Yaxlitlash har doim ham foydali emas. Avval son qanday vazifani bajarishini aniqlaymiz.",
      en: "Rounding is not always useful. First decide what the number is used for.",
    },
    instruction: {
      ru: 'Код и платёж сохраняем точно, а поток людей и расстояние для обзора можно показать приблизительно.',
      uz: "Kod va to'lovni aniq saqlaymiz, odamlar oqimi va masofani umumiy ko'rish uchun taqribiy ko'rsatish mumkin.",
      en: "Keep a code and a payment exact, but a visitor total or an overview distance may be approximate.",
    },
    model: {
      kind: 'contexts',
      badge: { ru: 'Выбор точности', uz: 'Aniqlikni tanlash', en: "Choosing accuracy" },
      cards: [
        { label: { ru: 'код датчика', uz: 'sensor kodi', en: "sensor code" }, value: '286 471', result: { ru: 'точно', uz: 'aniq', en: "exact" }, tone: 'cyan' },
        { label: { ru: 'посетители', uz: 'tashrifchilar', en: "visitors" }, value: '286 471', result: { ru: 'примерно 286 000', uz: 'taxminan 286 000', en: "approximately 286,000" }, tone: 'accent' },
        { label: { ru: 'расстояние', uz: 'masofa', en: "distance" }, value: '48 764 м', result: { ru: 'примерно 49 000 м', uz: 'taxminan 49 000 m', en: "approximately 49,000 metres" }, tone: 'lime' },
      ],
    },
    options: [
      { ru: 'Сначала определить назначение числа', uz: 'Avval sonning vazifasini aniqlash', en: "First, determine the purpose of a number." },
      { ru: 'Всегда округлять до тысяч', uz: 'Har doim minglikkacha yaxlitlash', en: "Always round to the nearest thousand" },
      { ru: 'Всегда сохранять все цифры', uz: 'Har doim barcha raqamlarni saqlash', en: "Always keep every digit" },
      { ru: 'Выбирать точность случайно', uz: 'Aniqlikni tasodifiy tanlash', en: "Choose the accuracy at random" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Чем важнее каждая единица, тем точнее запись. Для общего масштаба выбираем удобный крупный разряд.',
      uz: "Har bir birlik qanchalik muhim bo'lsa, yozuv shunchalik aniq bo'ladi. Umumiy miqyos uchun qulay katta xonani tanlaymiz.",
      en: "The more each unit matters, the more exact the form should be. For an overview, choose a suitably large target place.",
    },
    wrong: [
      null,
      { ru: 'Тысячи слишком грубы для кода или оплаты.', uz: "Mingliklar kod yoki to'lov uchun juda qo'pol.", en: "Rounding to the nearest thousand is too coarse for a code or payment." },
      { ru: 'Для обзора лишние цифры могут мешать.', uz: "Umumiy ko'rishda ortiqcha raqamlar xalaqit berishi mumkin.", en: "For an overview, extra digits can get in the way." },
      { ru: 'Точность выбирают по смыслу ситуации.', uz: "Aniqlik vaziyat ma'nosiga ko'ra tanlanadi.", en: "The context determines the appropriate accuracy." },
    ],
    audio: {
      intro: {
        ru: ['Сначала определяем назначение числа. Код и платёж требуют точности, а общий поток можно показать приблизительно.'],
        uz: ["Avval sonning vazifasini aniqlaymiz. Kod va to'lov aniqlikni talab qiladi, umumiy oqimni esa taqribiy ko'rsatish mumkin."],
        en: ["First decide what the number is for. A code and a payment need exact values, while an overall count can be approximate."],
      },
      on_correct: {
        ru: 'Если важна каждая единица, число не округляем. Для быстрого обзора выбираем удобный крупный разряд.',
        uz: "Har bir birlik muhim bo'lsa, sonni yaxlitlamaymiz. Tez ko'rish uchun qulay katta xonani tanlaymiz.",
        en: "If every unit matters, do not round the number. For a quick overview, choose a suitably large target place.",
      },
      on_wrong: [
        null,
        { ru: 'Смысл числа определяет допустимую точность.', uz: "Sonning ma'nosi mumkin bo'lgan aniqlikni belgilaydi.", en: "The purpose of the number determines the appropriate accuracy." },
        { ru: 'Иногда приблизительная запись понятнее.', uz: "Ba'zan taqribiy yozuv tushunarliroq bo'ladi.", en: "Sometimes an approximate value is clearer." },
        { ru: 'Выбор точности должен объясняться задачей.', uz: 'Aniqlik tanlovi vazifa bilan tushuntirilishi kerak.', en: "The choice of accuracy must suit the task." },
      ],
    },
  },
  s11: {
    eyebrow: { ru: 'Разбор ошибки', uz: 'Xatoni tahlil qilish', en: "Error analysis" },
    title: { ru: 'Bit посмотрел не на тот разряд', uz: "Bit noto'g'ri xonaga qaradi", en: "Bit looked at the wrong place" },
    lead: {
      ru: 'Bit округлял 84 768 до сотен и оставил неверный результат. Проследим три типичные ошибки.',
      uz: "Bit 84 768 sonini yuzlikkacha yaxlitlab, noto'g'ri natija qoldirdi. Uchta odatiy xatoni kuzatamiz.",
      en: "Bit rounded 84,768 to the nearest hundred but got the wrong result. Let us examine three common errors.",
    },
    instruction: {
      ru: 'Сравни три черновика: какой разряд должен принять решение и что должно произойти с цифрами справа?',
      uz: "Uchta qoralamani solishtiring: qaysi xona qaror berishi va o'ngdagi raqamlar bilan nima bo'lishi kerak?",
      en: "Compare the three drafts: which place should make the decision, and what should happen to the digits on the right?",
    },
    model: {
      kind: 'roundingError',
      badge: { ru: 'Черновик Bit', uz: 'Bit qoralamasi' , en: "Bit's draft"},
      number: '84 768',
      target: { ru: 'до сотен', uz: 'yuzlikkacha', en: "to the nearest hundred" },
      drafts: [
        { value: '84 700', label: { ru: 'посмотрел на 7 сотен', uz: '7 yuzlikka qaradi', en: "looked at 7 in the hundreds place" } },
        { value: '85 000', label: { ru: 'округлил каждую цифру', uz: 'har bir raqamni yaxlitladi', en: "rounded each digit" } },
        { value: '84 868', label: { ru: 'сохранил правые цифры', uz: "o'ng raqamlarni saqladi", en: "kept the digits on the right" } },
      ],
      result: '84 800',
    },
    options: ['84 800', '84 700', '85 000', '84 868'],
    correctIndex: 0,
    correctText: {
      ru: 'Проверяем только десятки, увеличиваем сотни и заменяем десятки с единицами нулями.',
      uz: "Faqat o'nlarni tekshiramiz, yuzlarni oshiramiz va o'nlar bilan birlarni nolga almashtiramiz.",
      en: "Check only the tens digit, increase the hundreds digit, and replace both the tens and ones with zeros.",
    },
    wrong: [
      null,
      { ru: 'Целевая цифра 7 не принимает решение. Нужно смотреть на 6 десятков.', uz: "Maqsad raqami 7 qaror qilmaydi. 6 o'nlikka qarash kerak.", en: "The target digit 7 does not make the decision. Look at the tens digit 6." },
      { ru: 'Нельзя округлять каждую цифру независимо.', uz: "Har bir raqamni mustaqil yaxlitlab bo'lmaydi.", en: "You cannot round each digit separately." },
      { ru: 'После округления до сотен две правые цифры становятся нулями.', uz: "Yuzlikkacha yaxlitlashdan keyin o'ngdagi ikki raqam nol bo'ladi.", en: "After rounding to the nearest hundred, the two digits on the right become zeros." },
    ],
    audio: {
      intro: {
        ru: ['Bit округляет восемьдесят четыре тысячи семьсот шестьдесят восемь до сотен. Проверим его рассуждение.'],
        uz: ["Bit sakson to'rt ming yetti yuz oltmish sakkizni yuzlikkacha yaxlitlayapti. Uning fikrini tekshiramiz."],
        en: ["Bit rounds eighty-four thousand seven hundred and sixty-eight to the nearest hundred. Let us check the reasoning."],
      },
      on_correct: {
        ru: 'Решение принимает шесть в десятках. Сотни увеличиваются, а десятки и единицы становятся нулями.',
        uz: "Qarorni o'nlardagi olti qiladi. Yuzlar oshadi, o'nlar va birlar esa nolga aylanadi.",
        en: "The tens digit six makes the decision. The hundreds digit increases, and the tens and ones become zeros.",
      },
      on_wrong: [
        null,
        { ru: 'Смотри на цифру сразу справа от сотен.', uz: "Yuzlarning darhol o'ngidagi raqamga qarang.", en: "Look at the digit immediately to the right of the hundreds place." },
        { ru: 'Округляем число до одного выбранного разряда.', uz: 'Sonni bitta tanlangan xonagacha yaxlitlaymiz.', en: "Round the number to one selected place." },
        { ru: 'Правые цифры после решения заменяем нулями.', uz: "Qarordan keyin o'ngdagi raqamlarni nolga almashtiramiz.", en: "The right digits are replaced by zeros after the decision." },
      ],
    },
  },
  s12: {
    eyebrow: { ru: 'Городской перенос', uz: "Shahar vaziyatiga ko'chirish" , en: "City carry"},
    title: { ru: 'Обнови главное табло', uz: 'Asosiy tabloni yangilang', en: "Update the main scoreboard" },
    lead: {
      ru: 'На табло нужно показать число посетителей с точностью до тысяч.',
      uz: "Tabloda tashrifchilar sonini minglikkacha aniqlikda ko'rsatish kerak.",
      en: "The scoreboard must show the number of visitors to the nearest thousand.",
    },
    instruction: {
      ru: 'Округли 286 471 до ближайших тысяч.',
      uz: '286 471 sonini eng yaqin minglikkacha yaxlitlang.',
      en: "Round 286,471 to the nearest thousand.",
    },
    model: {
      kind: 'roundingFocus',
      badge: { ru: 'Финальное табло', uz: 'Yakuniy tablo', en: "Final scoreboard" },
      number: '286 471',
      targetIndex: 2,
      inspectIndex: 3,
      result: '?',
      direction: 'down',
    },
    options: ['286 000', '287 000', '286 400', '280 000'],
    correctIndex: 0,
    correctText: {
      ru: 'В сотнях стоит 4, поэтому тысячи сохраняются, а три правые цифры становятся нулями.',
      uz: "Yuzlar xonasida 4 turibdi, shuning uchun minglar saqlanadi, o'ngdagi uchta raqam nol bo'ladi.",
      en: "The hundreds digit is 4, so the thousands digit stays the same and the three digits on the right become zeros.",
    },
    wrong: [
      null,
      { ru: '287 000 получилось бы при сотнях от 5 до 9. Здесь стоит 4.', uz: "287 000 yuzlar 5 dan 9 gacha bo'lganda hosil bo'lardi. Bu yerda 4 turibdi.", en: "287,000 would be the result if the hundreds digit were from 5 to 9. Here it is 4." },
      { ru: '286 400 сохраняет сотни. После округления до тысяч нужны три нуля.', uz: '286 400 yuzlarni saqlaydi. Minglikkacha yaxlitlashdan keyin uchta nol kerak.', en: "286,400 keeps the hundreds digit. Rounding to the nearest thousand requires three zeros." },
      { ru: '280 000 округлено до десятков тысяч, а не до тысяч.', uz: "280 000 o'n minglikkacha yaxlitlangan, minglikkacha emas.", en: "280,000 is rounded to the nearest ten thousand, not the nearest thousand." },
    ],
    audio: {
      intro: {
        ru: ['Округли двести восемьдесят шесть тысяч четыреста семьдесят один до ближайших тысяч.'],
        uz: ["Ikki yuz sakson olti ming to'rt yuz yetmish birni eng yaqin minglikkacha yaxlitlang."],
        en: ["Round two hundred and eighty-six thousand four hundred and seventy-one to the nearest thousand."],
      },
      on_correct: {
        ru: 'В сотнях стоит четыре. Тысячи сохраняются, а три правые цифры становятся нулями.',
        uz: "Yuzlar xonasida to'rt turibdi. Minglar saqlanadi, o'ngdagi uchta raqam nol bo'ladi.",
        en: "Correct. The hundreds digit is four. The thousands digit stays the same, and the three digits on the right become zeros.",
      },
      on_wrong: [
        null,
        { ru: 'Четыре не увеличивает тысячи.', uz: "To'rt minglarni oshirmaydi.", en: "Four does not increase the thousands digit." },
        { ru: 'После округления до тысяч справа остаются три нуля.', uz: "Minglikkacha yaxlitlashdan keyin o'ngda uchta nol qoladi.", en: "After rounding to the nearest thousand, three zeros remain on the right." },
        { ru: 'Сохрани точность до тысяч, не до десятков тысяч.', uz: "O'n minglikkacha emas, minglikkacha aniqlikni saqlang.", en: "Round to the nearest thousand, not the nearest ten thousand." },
      ],
    },
  },
  s13: {
    eyebrow: { ru: 'Точность результата', uz: 'Natija aniqligi', en: "Accuracy of the result" },
    title: { ru: 'Круглое число хранит коридор возможных значений', uz: "Yaxlit son mumkin bo'lgan qiymatlar oralig'ini saqlaydi", en: "A rounded number represents a range of possible values" },
    lead: {
      ru: 'После финальной миссии посмотрим глубже: результат 84 800 не раскрывает исходное число точно, но задаёт его границы.',
      uz: "Yakuniy missiyadan keyin chuqurroq qaraymiz: 84 800 natijasi boshlang'ich sonni aniq ko'rsatmaydi, ammo uning chegaralarini belgilaydi.",
      en: "After the final mission, let's take a closer look: 84,800 doesn't reveal the original number exactly, but sets its boundaries.",
    },
    instruction: {
      ru: 'До сотен все числа от 84 750 до 84 849 округляются к 84 800. Число 84 850 уже переходит к следующей сотне.',
      uz: "Yuzlikkacha 84 750 dan 84 849 gacha bo'lgan barcha sonlar 84 800 ga yaxlitlanadi. 84 850 esa keyingi yuzlikka o'tadi.",
      en: "When rounding to the nearest hundred, every number from 84,750 to 84,849 rounds to 84,800. The number 84,850 rounds to the next hundred.",
    },
    model: {
      kind: 'accuracyCorridor',
      badge: { ru: 'Коридор округления', uz: "Yaxlitlash oralig'i", en: "Rounding interval" },
      rows: [
        { label: { ru: 'нижняя граница', uz: 'quyi chegara', en: "lower bound" }, value: '84 750' },
        { label: { ru: 'круглый результат', uz: 'yaxlit natija', en: "rounded result" }, value: '84 800' },
        { label: { ru: 'верхняя граница', uz: 'yuqori chegara', en: "upper bound" }, value: '84 849' },
        { label: { ru: 'следующий шаг', uz: 'keyingi qadam', en: "next interval" }, value: '84 850 → 84 900' },
      ],
    },
    options: [
      { ru: 'Результат задаёт диапазон, но не единственное исходное число', uz: "Natija oraliqni belgilaydi, ammo yagona boshlang'ich sonni emas", en: "The result specifies a range, but not a single original number." },
      { ru: 'Исходное число обязательно равно 84 800', uz: "Boshlang'ich son albatta 84 800 ga teng", en: "The original number must be 84,800." },
      { ru: 'Все числа до 84 899 дадут 84 800', uz: '84 899 gacha barcha sonlar 84 800 ni beradi', en: "All numbers up to 84,899 will yield 84,800" },
      { ru: 'По округлению нельзя узнать даже порядок величины', uz: "Yaxlitlashdan son miqyosini ham bilib bo'lmaydi", en: "A rounded value does not even show the approximate size" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Округлённая запись показывает масштаб и коридор точных значений. Чем крупнее выбранный разряд, тем шире этот коридор.',
      uz: "Yaxlit yozuv miqyosni va aniq qiymatlar oralig'ini ko'rsatadi. Tanlangan xona qanchalik katta bo'lsa, oraliq shunchalik keng bo'ladi.",
      en: "A rounded form shows the scale and a range of exact values. The larger the target place, the wider this range.",
    },
    fact: {
      ru: 'При округлении до сотен отличие от точного числа не превышает 50.',
      uz: 'Yuzlikkacha yaxlitlashda aniq sondan farq 50 dan oshmaydi.',
      en: "When rounded to the nearest hundred, the difference from the exact number is no more than 50.",
    },
    wrong: [
      null,
      { ru: 'Одному круглому результату соответствует много точных чисел.', uz: "Bitta yaxlit natijaga ko'p aniq sonlar mos keladi.", en: "One round result corresponds to many exact numbers." },
      { ru: 'На числе 84 850 начинается переход к 84 900.', uz: "84 850 sonidan 84 900 ga o'tish boshlanadi.", en: "At 84,850, the transition to 84,900 begins." },
      { ru: 'Круглый результат сохраняет общий масштаб исходного числа.', uz: "Yaxlit natija boshlang'ich sonning umumiy miqyosini saqlaydi.", en: "The round result retains the total scale of the original number." },
    ],
    audio: {
      intro: {
        ru: [
          'Нижняя граница коридора равна восьмидесяти четырём тысячам семистам пятидесяти. Это число округляется к восьмидесяти четырём тысячам восьмистам.',
          'Круглый результат восемьдесят четыре тысячи восемьсот может получиться из многих точных чисел.',
          'Верхняя граница этого коридора равна восьмидесяти четырём тысячам восьмистам сорока девяти. Она ещё даёт тот же результат.',
          'С восьмидесяти четырёх тысяч восьмисот пятидесяти начинается следующий коридор. Число округляется к восьмидесяти четырём тысячам девятистам.',
        ],
        uz: [
          "Oraliqning quyi chegarasi sakson to'rt ming yetti yuz ellik. Bu son sakson to'rt ming sakkiz yuzga yaxlitlanadi.",
          "Sakson to'rt ming sakkiz yuz yaxlit natijasi ko'p aniq sonlardan hosil bo'lishi mumkin.",
          "Bu oraliqning yuqori chegarasi sakson to'rt ming sakkiz yuz qirq to'qqiz. U ham ayni natijani beradi.",
          "Sakson to'rt ming sakkiz yuz ellikdan keyingi oraliq boshlanadi. Son sakson to'rt ming to'qqiz yuzga yaxlitlanadi.",
        ],
        en: [
          "The lower bound of the interval is eighty-four thousand seven hundred and fifty. It rounds to eighty-four thousand eight hundred.",
          "The rounded result eighty-four thousand eight hundred can come from many exact numbers.",
          "The upper bound of this interval is eighty-four thousand eight hundred and forty-nine. It still gives the same result.",
          "The next interval begins at eighty-four thousand eight hundred and fifty. This number rounds to eighty-four thousand nine hundred.",
        ],
      },
      on_correct: {
        ru: 'Чем крупнее выбранный разряд округления, тем шире коридор возможных исходных значений.',
        uz: "Yaxlitlash xonasi qanchalik katta bo'lsa, mumkin bo'lgan boshlang'ich qiymatlar oralig'i shunchalik keng bo'ladi.",
        en: "The larger the target place, the wider the range of possible original values.",
      },
      on_wrong: [
        null,
        { ru: 'Один округлённый результат может получиться из многих точных чисел.', uz: "Bitta yaxlit natija ko'p aniq sonlardan hosil bo'lishi mumkin.", en: "One rounded result can be obtained from many exact numbers." },
        { ru: 'Следующая сотня начинается с восьмидесяти четырёх тысяч восьмисот пятидесяти.', uz: "Keyingi yuzlik sakson to'rt ming sakkiz yuz ellikdan boshlanadi.", en: "The next hundred begins with eighty-four thousand eight hundred and fifty." },
        { ru: 'Округление сохраняет масштаб числа, хотя скрывает часть точности.', uz: "Yaxlitlash aniqlikning bir qismini yashirsa ham, son miqyosini saqlaydi.", en: "Rounding retains the scale of the number, although it hides some of the accuracy." },
      ],
    },
  },
  s14: {
    eyebrow: { ru: 'Итог и мост', uz: "Yakun va ko'prik" , en: "Summary and link"},
    title: { ru: 'Табло показывает нужную точность', uz: "Tablo kerakli aniqlikni ko'rsatadi", en: "The scoreboard shows the desired accuracy" },
    lead: {
      ru: 'Соберём выбор точности и четыре шага округления в одну памятку.',
      uz: "Aniqlikni tanlash va yaxlitlashning to'rt qadamini bitta eslatmaga birlashtiramiz.",
      en: "Put the choice of accuracy and the four rounding steps into one guide.",
    },
    instruction: {
      ru: 'Сначала выбираем точность, затем проверяем соседнюю цифру справа и обнуляем всю правую часть.',
      uz: "Avval aniqlikni tanlaymiz, keyin o'ngdagi qo'shni raqamni tekshirib, butun o'ng qismini nollaymiz.",
      en: "First choose the target place, then check the next digit on the right and replace all digits farther right with zeros.",
    },
    model: {
      kind: 'reward',
      badge: { ru: 'Модуль округления восстановлен', uz: 'Yaxlitlash moduli tiklandi', en: "Rounding module restored" },
      number: { ru: 'ТОЧНО ≈ ОКРУГЛЁННО', uz: 'ANIQ ≈ YAXLIT', en: "EXACT ≈ ROUNDED" },
    },
    options: [
      { ru: 'Выбрать разряд, проверить цифру справа, решить направление и записать нули', uz: "Xonani tanlash, o'ngdagi raqamni tekshirish, yo'nalishni hal qilish va nollar yozish", en: "Choose the target place, check the digit to its right, decide the direction, and write the zeros." },
      { ru: 'Округлить каждую цифру отдельно', uz: 'Har bir raqamni alohida yaxlitlash', en: "Round each digit separately" },
      { ru: 'Смотреть только на целевой разряд', uz: 'Faqat maqsad xonasiga qarash', en: "Look only at the target place" },
      { ru: 'Всегда округлять до тысяч', uz: 'Har doim minglikkacha yaxlitlash', en: "Always round to the nearest thousand" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Алгоритм работает для десятков, сотен и тысяч, а контекст помогает выбрать нужную точность.',
      uz: "Algoritm o'nlik, yuzlik va mingliklar uchun ishlaydi, vaziyat esa kerakli aniqlikni tanlashga yordam beradi.",
      en: "The algorithm works for tens, hundreds and thousands, and context helps you choose the right accuracy.",
    },
    bridge: {
      ru: 'В следующем уроке чтение, разрядный состав, сравнение и округление соединятся в одной задаче.',
      uz: "Keyingi darsda o'qish, xona tarkibi, taqqoslash va yaxlitlash bitta vazifada birlashadi.",
      en: "In the next lesson, reading, place-value composition, comparison and rounding will be combined in one problem.",
    },
    wrong: [
      null,
      { ru: 'Число округляется целиком до выбранного разряда.', uz: 'Son tanlangan xonagacha yaxlitlanadi.', en: "Round the whole number to the selected place." },
      { ru: 'Решение принимает цифра сразу справа.', uz: "Qarorni darhol o'ngdagi raqam qiladi.", en: "The digit immediately to the right makes the decision." },
      { ru: 'Точность выбирают по смыслу задачи.', uz: "Aniqlik vazifa ma'nosiga ko'ra tanlanadi.", en: "Accuracy is chosen according to the meaning of the task." },
    ],
    audio: {
      intro: {
        ru: ['Миссия завершена. Соединим выбор точности и шаги округления в одну памятку.'],
        uz: ["Missiya yakunlandi. Aniqlikni tanlash va yaxlitlash qadamlarini bitta eslatmaga birlashtiramiz."],
        en: ["Mission complete. Combine the choice of accuracy and the rounding steps into one guide."],
      },
      on_correct: {
        ru: 'Выбираем разряд, смотрим на соседнюю цифру справа, принимаем решение и заменяем правую часть нулями.',
        uz: "Xonani tanlaymiz, o'ngdagi qo'shni raqamga qaraymiz, qaror qilamiz va o'ng qismini nollar bilan almashtiramiz.",
        en: "Choose the target place, look at the digit immediately to its right, decide, and replace every digit to the right with zeros.",
      },
      on_wrong: [
        null,
        { ru: 'Округление выполняем до одного выбранного разряда.', uz: 'Yaxlitlashni bitta tanlangan xonagacha bajaramiz.', en: "Round the whole number to one selected place." },
        { ru: 'Проверочная цифра находится сразу справа.', uz: "Tekshiruvchi raqam darhol o'ngda joylashadi.", en: "The deciding digit is immediately to the right." },
        { ru: 'Контекст определяет полезную точность.', uz: 'Vaziyat foydali aniqlikni belgilaydi.', en: "Context defines useful accuracy." },
      ],
    },
  },
};
const makeMicroPractice = ({ audioIntro, correctAudio, wrongAudio, ...content }) => ({
  ...content,
  audio: {
    intro: audioIntro,
    on_correct: correctAudio,
    on_wrong: content.options.map((_, index) => (
      index === content.correctIndex
        ? null
        : (Array.isArray(wrongAudio) ? wrongAudio[index] : wrongAudio)
    )),
  },
});

const PRACTICE_CONTENT = {
  p1: makeMicroPractice({ eyebrow: { ru: 'Практика 1', uz: '1-mashq' , en: "Practice 1"}, title: { ru: 'Округляем до десятков', uz: 'O\'nliklargacha yaxlitlaymiz', en: "Round to the nearest ten" }, lead: { ru: 'Смотрим на цифру единиц.', uz: 'Birlar xonasidagi raqamga qaraymiz.', en: "Look at the ones digit." }, instruction: { ru: 'Чему равно 326 при округлении до десятков?', uz: '326 soni o\'nliklargacha yaxlitlanganda nechaga teng?', en: "What is 326 when rounded to the nearest ten?" }, options: ['330', '320', '300'], correctIndex: 0, correctText: { ru: 'Цифра единиц 6, поэтому 326 округляется вверх до 330.', uz: 'Birlar xonasidagi 6 sababli 326 yuqoriga, 330 gacha yaxlitlanadi.', en: "The ones digit is 6, so 326 rounds up to 330." }, wrong: [null, { ru: 'При цифре 6 округляем вверх, а не вниз.', uz: '6 bo\'lganda pastga emas, yuqoriga yaxlitlaymiz.', en: "When the deciding digit is 6, round up, not down." }, { ru: 'Нужно округлить до десятков, а не до сотен.', uz: 'Yuzliklargacha emas, o\'nliklargacha yaxlitlash kerak.', en: "Round to the nearest ten, not the nearest hundred." }], audioIntro: { ru: 'Округли триста двадцать шесть до десятков. Посмотри на цифру единиц.', uz: 'Uch yuz yigirma olti sonini o\'nliklargacha yaxlitlang. Birlar xonasidagi raqamga qarang.', en: "Round three hundred and twenty-six to the nearest ten. Look at the ones digit." }, correctAudio: { ru: 'Верно. Шесть единиц поднимают число до трёхсот тридцати.', uz: 'To\'g\'ri. Olti birlik sonni uch yuz o\'ttizgacha oshiradi.', en: "Correct. Six ones round the number up to three hundred and thirty." }, wrongAudio: { ru: 'Проверь цифру справа от десятков.', uz: 'O\'nlar xonasidan o\'ngdagi raqamni tekshiring.', en: "Check the digit immediately to the right of the tens place." } }),
  p2: makeMicroPractice({ eyebrow: { ru: 'Практика 2', uz: '2-mashq' , en: "Practice 2"}, title: { ru: 'Округляем до сотен', uz: 'Yuzliklargacha yaxlitlaymiz', en: "Round to the nearest hundred" }, lead: { ru: 'Решение принимает цифра десятков.', uz: 'Qarorni o\'nlar xonasidagi raqam beradi.', en: "The tens digit makes the decision." }, instruction: { ru: 'Чему равно 3 462 при округлении до сотен?', uz: '3 462 soni yuzliklargacha yaxlitlanganda nechaga teng?', en: "What is 3,462 when rounded to the nearest hundred?" }, options: ['3 500', '3 400', '3 460'], correctIndex: 0, correctText: { ru: 'В десятках стоит 6, поэтому сотни увеличиваются на один.', uz: 'O\'nlar xonasida 6 turibdi, shuning uchun yuzliklar bittaga oshadi.', en: "The tens digit is 6, so the hundreds digit increases by one." }, wrong: [null, { ru: 'При цифре 6 нужно округлять вверх.', uz: '6 raqamida yuqoriga yaxlitlash kerak.', en: "When the deciding digit is 6, round up." }, { ru: 'Справа от сотен должны стоять два нуля.', uz: 'Yuzliklardan o\'ngda ikkita nol turishi kerak.', en: "There must be two zeros to the right of the hundreds place." }], audioIntro: { ru: 'Округли три тысячи четыреста шестьдесят два до сотен.', uz: 'Uch ming to\'rt yuz oltmish ikki sonini yuzliklargacha yaxlitlang.', en: "Round three thousand four hundred and sixty-two to the nearest hundred." }, correctAudio: { ru: 'Верно. Результат равен трём тысячам пятистам.', uz: 'To\'g\'ri. Natija uch ming besh yuz.', en: "Correct. The result is three thousand five hundred." }, wrongAudio: { ru: 'Посмотри на цифру десятков и замени правые цифры нулями.', uz: 'O\'nlar xonasidagi raqamga qarang va o\'ngdagi raqamlarni nolga almashtiring.', en: "Look at the tens digit and replace the digits to the right with zeros." } }),
  p3: makeMicroPractice({ eyebrow: { ru: 'Практика 3', uz: '3-mashq' , en: "Practice 3"}, title: { ru: 'Переходим через разряд', uz: 'Xonadan o\'tamiz', en: "Carrying into a new place" }, lead: { ru: 'Округление может увеличить несколько девяток подряд.', uz: 'Yaxlitlash ketma-ket bir nechta to\'qqizni oshirishi mumkin.', en: "Rounding can carry through several nines in a row." }, instruction: { ru: 'Чему равно 99 650 при округлении до тысяч?', uz: '99 650 soni mingliklargacha yaxlitlanganda nechaga teng?', en: "What is 99,650 when rounded to the nearest thousand?" }, options: ['100 000', '99 000', '99 700'], correctIndex: 0, correctText: { ru: 'Сотни равны 6, поэтому округляем вверх и получаем 100 000.', uz: 'Yuzliklar xonasida 6, shuning uchun yuqoriga yaxlitlab, 100 000 ni olamiz.', en: "The hundreds digit is 6, so round up to 100,000." }, wrong: [null, { ru: 'При шести сотнях округляем вверх.', uz: 'Olti yuzlik bo\'lganda yuqoriga yaxlitlaymiz.', en: "When the hundreds digit is six, round up." }, { ru: 'Нужно округлить до тысяч, поэтому справа должны быть три нуля.', uz: 'Mingliklargacha yaxlitlaymiz, shuning uchun o\'ngda uchta nol bo\'lishi kerak.', en: "Round to the nearest thousand, so the result must have three zeros on the right." }], audioIntro: { ru: 'Округли девяносто девять тысяч шестьсот пятьдесят до тысяч.', uz: 'To\'qson to\'qqiz ming olti yuz ellik sonini mingliklargacha yaxlitlang.', en: "Round ninety-nine thousand six hundred and fifty to the nearest thousand." }, correctAudio: { ru: 'Верно. Округление вверх переносит число к ста тысячам.', uz: 'To\'g\'ri. Yuqoriga yaxlitlash sonni yuz mingga olib keladi.', en: "Correct. Rounding up takes the number to one hundred thousand." }, wrongAudio: { ru: 'Проверь цифру сотен и выполни перенос через девятки.', uz: 'Yuzlar xonasidagi raqamni tekshiring va to\'qqizlar orqali o\'tishni bajaring.', en: "Check the hundreds digit and carry through the nines." } }),
  p4: makeMicroPractice({ eyebrow: { ru: 'Практика 4', uz: '4-mashq' , en: "Practice 4"}, title: { ru: 'Выбираем точность', uz: 'Aniqlikni tanlaymiz', en: "Choosing accuracy" }, lead: { ru: 'Для короткого обзора большое количество удобно округлить.', uz: 'Qisqa sharh uchun katta miqdorni yaxlitlash qulay.', en: "For a quick overview, it is useful to round a large number." }, instruction: { ru: 'Как показать 237 481 жителя примерно до тысяч?', uz: '237 481 aholini mingliklargacha taxminan qanday ko\'rsatamiz?', en: "How should 237,481 residents be shown to the nearest thousand?" }, options: ['237 000', '237 500', '240 000'], correctIndex: 0, correctText: { ru: 'Цифра сотен 4, поэтому 237 481 округляется вниз до 237 000.', uz: 'Yuzlar xonasidagi 4 sababli 237 481 pastga, 237 000 gacha yaxlitlanadi.', en: "The hundreds digit is 4, so 237,481 rounds down to 237,000." }, wrong: [null, { ru: '237 500 — это округление до сотен.', uz: '237 500 yuzliklargacha yaxlitlash natijasi.', en: "237,500 is the result of rounding to the nearest hundred." }, { ru: '240 000 слишком грубо и не является ближайшей тысячей.', uz: '240 000 juda qo\'pol va eng yaqin minglik emas.', en: "240,000 is too coarse and is not the nearest thousand." }], audioIntro: { ru: 'Покажи двести тридцать семь тысяч четыреста восемьдесят одного жителя примерно до тысяч.', uz: 'Ikki yuz o\'ttiz yetti ming to\'rt yuz sakson bir aholini mingliklargacha taxminan ko\'rsating.', en: "Show two hundred and thirty-seven thousand four hundred and eighty-one residents to the nearest thousand." }, correctAudio: { ru: 'Верно. Четыре сотни оставляют двести тридцать семь тысяч.', uz: 'To\'g\'ri. To\'rt yuzlik ikki yuz o\'ttiz yetti mingni saqlab qoladi.', en: "Correct. A hundreds digit of four rounds the number down to two hundred and thirty-seven thousand." }, wrongAudio: { ru: 'Для тысяч решение принимает цифра сотен.', uz: 'Mingliklar uchun qarorni yuzlar xonasidagi raqam beradi.', en: "For the nearest thousand, the hundreds digit makes the decision." } }),
  p5: makeMicroPractice({ eyebrow: { ru: 'Практика 5', uz: '5-mashq' , en: "Practice 5"}, title: { ru: 'Точно или приблизительно', uz: 'Aniq yoki taqribiy', en: "Exact or approximate" }, lead: { ru: 'Коды не округляют, потому что каждая цифра важна.', uz: 'Kodlar yaxlitlanmaydi, chunki har bir raqam muhim.', en: "Codes are not rounded because every digit matters." }, instruction: { ru: 'Как показать номер автобуса 407?', uz: '407 avtobus raqamini qanday ko\'rsatish kerak?', en: "How should the bus number 407 be shown?" }, options: [{ ru: 'оставить 407 точно', uz: '407 ni aniq qoldirish', en: "keep 407 exact" }, { ru: 'округлить до 400', uz: '400 gacha yaxlitlash', en: "round to 400" }, { ru: 'округлить до 410', uz: '410 gacha yaxlitlash', en: "round to 410" }], correctIndex: 0, correctText: { ru: 'Номер автобуса — идентификатор. Его нельзя менять округлением.', uz: 'Avtobus raqami identifikator. Uni yaxlitlab o\'zgartirib bo\'lmaydi.', en: "A bus number is an identifier. It cannot be changed by rounding." }, wrong: [null, { ru: 'Округление до 400 меняет десятки и единицы. Получится номер другого автобуса.', uz: "400 gacha yaxlitlash o'nlik va birlik raqamlarini o'zgartiradi. Bu boshqa avtobus raqami bo'ladi.", en: "Rounding to 400 changes the tens and ones digits, producing a different bus number." }, { ru: 'Округление до 410 меняет цифру единиц. Номер автобуса должен остаться 407.', uz: "410 gacha yaxlitlash birlik raqamini o'zgartiradi. Avtobus raqami 407 bo'lib qolishi kerak.", en: "Rounding to 410 changes the ones digit. The bus number must remain 407." }], audioIntro: { ru: 'Реши, нужно ли округлять номер автобуса четыреста семь.', uz: 'To\'rt yuz yetti avtobus raqamini yaxlitlash kerakmi, aniqlang.', en: "Decide whether to round the bus number four hundred and seven." }, correctAudio: { ru: 'Верно. Код и номер сохраняют точно.', uz: 'To\'g\'ri. Kod va raqam aniq saqlanadi.', en: "Correct. Keep codes and identification numbers exact." }, wrongAudio: [null, { ru: 'Округление до четырёхсот меняет десятки и единицы. Это будет номер другого автобуса.', uz: "To'rt yuzgacha yaxlitlash o'nlik va birlik raqamlarini o'zgartiradi. Bu boshqa avtobus raqami bo'ladi.", en: "Rounding to four hundred changes the tens and ones digits. That would be a different bus number." }, { ru: 'Округление до четырёхсот десяти меняет цифру единиц. Сохрани номер четыреста семь точно.', uz: "To'rt yuz o'ngacha yaxlitlash birlik raqamini o'zgartiradi. To'rt yuz yetti raqamini aniq saqlang.", en: "Rounding to four hundred and ten changes the ones digit. Keep the number four hundred and seven exact." }] }),
  p6: makeMicroPractice({ eyebrow: { ru: 'Итоговая практика', uz: 'Yakuniy mashq', en: "Final practice" }, title: { ru: 'Проверяем интервал', uz: 'Oraliqni tekshiramiz', en: "Checking the interval" }, lead: { ru: 'К 8 000 округляются числа от 7 500 до 8 499.', uz: '7 500 dan 8 499 gacha bo\'lgan sonlar 8 000 ga yaxlitlanadi.', en: "Numbers from 7,500 to 8,499 are rounded to 8,000." }, instruction: { ru: 'Какое число округлится до 8 000 при округлении до тысяч?', uz: 'Qaysi son mingliklargacha yaxlitlanganda 8 000 bo\'ladi?', en: "Which number rounds to 8,000 when rounded to the nearest thousand?" }, options: ['7 650', '7 480', '8 520'], correctIndex: 0, correctText: { ru: '7 650 находится в интервале от 7 500 до 8 499.', uz: '7 650 soni 7 500 dan 8 499 gacha bo\'lgan oraliqda.', en: "7,650 lies in the interval from 7,500 to 8,499." }, wrong: [null, { ru: '7 480 округляется вниз до 7 000.', uz: '7 480 pastga, 7 000 gacha yaxlitlanadi.', en: "7,480 is rounded down to 7,000." }, { ru: '8 520 округляется вверх до 9 000.', uz: '8 520 yuqoriga, 9 000 gacha yaxlitlanadi.', en: "8,520 is rounded up to 9,000." }], audioIntro: { ru: 'Выбери число, которое при округлении до тысяч даст восемь тысяч.', uz: 'Mingliklargacha yaxlitlanganda sakkiz mingni beradigan sonni tanlang.', en: "Choose a number that rounds to eight thousand when rounded to the nearest thousand." }, correctAudio: { ru: 'Верно. Семь тысяч шестьсот пятьдесят округляется до восьми тысяч.', uz: 'To\'g\'ri. Yetti ming olti yuz ellik sakkiz minggacha yaxlitlanadi.', en: "Correct. Seven thousand six hundred and fifty rounds to eight thousand." }, wrongAudio: { ru: 'Проверь, находится ли число между нижней и верхней границей нужного интервала.', uz: 'Son kerakli oraliqning quyi va yuqori chegaralari orasida ekanini tekshiring.', en: "Check whether the number lies between the lower and upper bounds of the required interval." } }),
};

const SCREEN_PLAN = [
  { id: 's0', type: 'hook', subtype: 'rounding-mission', template: 'HookChoice', goal: 'Distinguish exact data from approximation', misconceptions: ['always round'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'exploration', subtype: 'guided-rounding-line', template: 'GuidedRoundingLine', goal: 'Discover rounding to tens, hundreds and thousands on number lines', misconceptions: ['wrong deciding digit', 'one result for every target'], active: true, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'rounding-line-selection', template: 'RoundingLineSelection', goal: 'Choose the nearest endpoint at three rounding scales', misconceptions: ['choose the farther endpoint', 'one result for every target'], active: true, scored: false, scope: null },
  { id: 's3', contentKey: 'p1', type: 'test', subtype: 'round-to-tens-check', template: 'MCScreen', goal: 'Round to tens after the decision rule is known', misconceptions: ['round down on six'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's4', contentKey: 's2', type: 'exploration', subtype: 'multi-scale-rounding', template: 'ModelCompare', goal: 'Connect one number to tens, hundreds and thousands models', misconceptions: ['one result for every target'], active: true, scored: false, scope: null },
  { id: 's5', contentKey: 'p2', type: 'test', subtype: 'round-to-hundreds-check', template: 'MCScreen', goal: 'Round to hundreds', misconceptions: ['keep tens'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's6', contentKey: 's4', type: 'exploration', subtype: 'rounding-carry', template: 'GuidedReveal', goal: 'Explain carrying through nines', misconceptions: ['carry stops'], active: true, scored: false, scope: null },
  { id: 's7', contentKey: 'p3', type: 'test', subtype: 'round-to-thousands-check', template: 'MCScreen', goal: 'Round through a place boundary', misconceptions: ['round down'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's8', contentKey: 's6', type: 'strategy', subtype: 'rounding-strategy', template: 'RuleBuilder', goal: 'Build the complete rounding strategy before independent transfer', misconceptions: ['partial algorithm'], active: true, scored: false, scope: null },
  { id: 's9', contentKey: 's5', type: 'exploration', subtype: 'precision-choice', template: 'PrecisionCompare', goal: 'Compare rounding precisions', misconceptions: ['one result for all targets'], active: true, scored: false, scope: null },
  { id: 's10', contentKey: 'p4', type: 'test', subtype: 'precision-check', template: 'MCScreen', goal: 'Round to a requested precision', misconceptions: ['wrong target'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'case', subtype: 'typical-error-repair', template: 'ErrorRepair', goal: 'Diagnose the deciding-place and trailing-zero errors', misconceptions: ['look at target digit', 'round every digit', 'keep right digits'], active: true, scored: false, scope: null },
  { id: 's12', contentKey: 's10', type: 'exploration', subtype: 'context-choice', template: 'ContextDecision', goal: 'Choose exact or approximate data', misconceptions: ['always round'], active: true, scored: false, scope: null },
  { id: 's13', contentKey: 'p5', type: 'test', subtype: 'context-check', template: 'MCScreen', goal: 'Transfer the strategy by keeping identifiers exact', misconceptions: ['round codes'], active: true, scored: true, scope: 'final' },
  { id: 's14', type: 'summary', subtype: 'theory-summary', template: 'ReflectionClaim', goal: 'Summarize precision choice', misconceptions: ['partial algorithm'], active: true, scored: false, scope: null },
];

const SCREEN_META = SCREEN_PLAN.map((meta) => ({ ...meta, contentKey: meta.contentKey ?? meta.id }));

const TOTAL_SCREENS = 15;
const MOBILE_DESIGN_W = 390;
const NOTION_FLOW = SCREEN_META.map((meta, screen) => ({ screen, meta, contentKeys: [meta.contentKey] }));

const LESSON_META = {
  lessonId: 'num-4-05-v1',
  lessonTitle: {
    ru: 'Урок 5. Округление многозначных чисел',
    uz: "5-dars. Ko'p xonali sonlarni yaxlitlash",
    en: "Lesson 5: Rounding multi-digit numbers",
  },
  skillTags: ['multi_digit_rounding', 'round_to_tens', 'round_to_hundreds', 'round_to_thousands', 'exact_vs_approximate', 'rounding_carry', 'rounding_interval'],
  notionFlow: NOTION_FLOW,
};

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

const buildOptionOrder = (length, correctIndex, seed = 0) => {
  const natural = Array.from({ length }, (_, index) => index);
  if (length < 2 || !natural.includes(correctIndex)) return natural;
  const target = Math.abs(seed * 3 + 1) % length;
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

const ModelPanel = ({ model, solved, revealRows = null }) => {
  const t = useT();
  if (!model) return null;
  const plainDigits = String(model.number ?? '').replace(/\s/g, '').split('');
  const customNumberKinds = new Set(['targetMap', 'multiNumberLine', 'roundingFocus', 'precision', 'roundingError']);
  return (
    <div className={`model-panel model-${model.kind} ${solved ? 'model-solved' : ''}`}>
      <div className="model-heading">
        <span>{t(model.badge)}</span>
        {model.kind === 'city' && <i aria-hidden="true">● ● ●</i>}
      </div>
      {model.number && !customNumberKinds.has(model.kind) && <div className="model-number">{t(model.number)}</div>}
      {(model.kind === 'dashboard' || model.kind === 'contexts') && (
        <div className={`context-cards context-cards-${model.cards.length}`}>
          {model.cards.map((card, index) => (
            <div className={`context-card context-${card.tone ?? 'cyan'}`} style={{ '--model-delay': `${index * 120}ms` }} key={`${card.value}-${index}`}>
              <span>{t(card.label)}</span><strong>{card.value}</strong><em>{t(card.result)}</em>
            </div>
          ))}
        </div>
      )}
      {model.kind === 'targetMap' && (
        <div className="target-map">
          <div className="target-map-number">{model.number}</div>
          {model.rows.map((row, index) => (
            <div className="target-map-row" style={{ '--model-delay': `${index * 130}ms` }} key={t(row.label)}>
              <span>{t(row.label)}</span><strong>{row.lower}</strong><i aria-hidden="true">—</i><strong>{row.upper}</strong><em>{row.zeros} × 0</em>
            </div>
          ))}
        </div>
      )}
      {model.kind === 'multiNumberLine' && (
        <div className="multi-number-lines">
          <div className="multi-line-source">{model.number}</div>
          {model.lines.map((line, index) => (
            <div className="number-line-row" style={{ '--model-delay': `${index * 150}ms` }} key={t(line.label)}>
              <div className="number-line-meta"><span>{t(line.label)}</span><em>{line.inspect} → {line.result}</em></div>
              <div className="number-line-track">
                <span>{line.lower}</span><span>{line.upper}</span>
                <i className="number-line-marker" style={{ '--line-position': `${line.position}%` }}><b>{model.number}</b></i>
                <u className="number-line-midpoint" />
              </div>
            </div>
          ))}
        </div>
      )}
      {model.kind === 'decisionContrast' && (
        <div className="decision-contrast">
          <div className="decision-scale"><strong>{model.lower}</strong><span>{model.midpoint}</span><strong>{model.upper}</strong></div>
          <div className="decision-cases">
            {model.cases.map((item, index) => (
              <div className={`decision-case decision-${item.direction}`} style={{ '--model-delay': `${index * 140}ms` }} key={item.value}>
                <span>{item.value}</span><i>{item.inspect}</i><b aria-hidden="true">{item.direction === 'up' ? '↗' : '↘'}</b><strong>{item.result}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
      {model.kind === 'carry' && (
        <div className="carry-examples">
          {model.examples.map((example, index) => (
            <div className="carry-example" style={{ '--model-delay': `${index * 170}ms` }} key={example.from}>
              <span>{t(example.note)}</span>
              <div><strong>{example.from}</strong><i aria-hidden="true">→</i><strong>{example.to}</strong></div>
              <small>{example.target}<b> + 1</b> · {example.inspect}</small>
            </div>
          ))}
        </div>
      )}
      {model.kind === 'precision' && (
        <div className="precision-board">
          <div className="precision-source">{model.number}</div>
          {model.rows.map((row, index) => (
            <div className="precision-row" style={{ '--model-delay': `${index * 130}ms` }} key={t(row.label)}>
              <span>{t(row.label)}</span><i>{row.inspect}</i><b aria-hidden="true">→</b><strong>{row.value}</strong>
            </div>
          ))}
        </div>
      )}
      {model.kind === 'roundingFocus' && (
        <div className="rounding-focus">
          <div className="rounding-digits">
            {plainDigits.map((digit, index) => (
              <span className={index === model.targetIndex ? 'round-target' : index === model.inspectIndex ? 'round-inspect' : ''} key={`${digit}-${index}`}>{digit}</span>
            ))}
          </div>
          <div className={`rounding-result rounding-${model.direction}`}><i aria-hidden="true">{model.direction === 'up' ? '↗' : '↘'}</i><strong>{model.result}</strong></div>
        </div>
      )}
      {model.kind === 'roundingError' && (
        <div className="rounding-error-board">
          <div className="rounding-error-source"><span>{model.number}</span><em>{t(model.target)}</em></div>
          <div className="rounding-error-drafts">
            {model.drafts.map((draft, index) => (
              <div style={{ '--model-delay': `${index * 120}ms` }} key={draft.value}><span>{t(draft.label)}</span><strong>{draft.value}</strong></div>
            ))}
          </div>
          <div className="rounding-error-repair"><span aria-hidden="true">✓</span><strong>{model.result}</strong></div>
        </div>
      )}
      {model.groups && (
        <div className="class-groups">
          {model.groups.map((group, index) => (
            <div className={`class-group group-${group.tone ?? (index ? 'accent' : 'cyan')}`} key={`${group.value}-${index}`}>
              <strong>{group.value}</strong><span>{t(group.label)}</span>
            </div>
          ))}
        </div>
      )}
      {model.columns && (
        <div className="place-table" style={{ gridTemplateColumns: `repeat(${model.columns.length}, minmax(0, 1fr))` }}>
          {model.columns.map((column, index) => (
            <div className="place-cell" key={`${column.value}-${index}`}>
              <span>{t(column.label)}</span><strong>{column.value}</strong>
            </div>
          ))}
        </div>
      )}
      {model.rows && !['targetMap', 'precision'].includes(model.kind) && (
        <div className="model-rows">
          {model.rows.map((row, index) => (
            <div
              className={revealRows === null ? '' : `audio-reveal ${revealRows >= index + 1 ? 'is-visible' : ''}`}
              aria-hidden={revealRows === null ? undefined : revealRows < index + 1}
              key={`${row.value}-${index}`}
            >
              <span>{t(row.label)}</span><strong>{row.value}</strong>
            </div>
          ))}
        </div>
      )}
      {model.steps && (
        <ol className="model-steps">
          {model.steps.map((step, index) => <li key={`${t(step)}-${index}`}>{t(step)}</li>)}
        </ol>
      )}
    </div>
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
  return (
    <button type="button" className={`btn btn-white-accent ${!disabled ? 'btn-ready' : ''}`} disabled={disabled} onClick={onClick}>
      {label ?? (finish ? (lang === 'en' ? "Finish lesson" : lang === 'ru' ? 'Завершить урок' : 'Darsni yakunlash') : (lang === 'en' ? "Continue" : lang === 'ru' ? 'Дальше' : 'Davom etish'))}
      <span aria-hidden="true">{finish ? '✓' : '→'}</span>
    </button>
  );
};

const ChoiceScreen = ({ screen, contentKey, storedAnswer, onAnswer, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = PRACTICE_CONTENT[contentKey] ?? CONTENT[contentKey ?? `s${screen}`];
  const resetOnReturn = screen === 0 || SCREEN_META[screen].type === 'exploration';
  const restorableAnswer = resetOnReturn ? null : storedAnswer;
  const restored = restorableAnswer?.solved === true;
  const [picked, setPicked] = useState(restorableAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(restored);
  const [attempts, setAttempts] = useState(restorableAnswer?.attempts ?? 0);
  const [wrongIndices, setWrongIndices] = useState(() => new Set(restorableAnswer?.wrongIndices ?? []));
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const isFinal = screen === TOTAL_SCREENS - 1;
  const optionOrder = buildOptionOrder(c.options.length, c.correctIndex, screen);

  const choose = (index) => {
    if (!canAnswer || solved || wrongIndices.has(index)) return;
    const nextAttempts = attempts + 1;
    const correct = index === c.correctIndex;
    setPicked(index);
    setAttempts(nextAttempts);
    if (!correct) {
      const nextWrong = new Set(wrongIndices);
      nextWrong.add(index);
      setWrongIndices(nextWrong);
      playSfx('wrong');
      audio.pushOneOff(t(c.audio?.on_wrong?.[index] ?? c.wrong?.[index]));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.instruction),
        options: c.options.map((option) => t(option)),
        correctIndex: c.correctIndex,
        correctAnswer: t(c.options[c.correctIndex]),
        studentAnswerIndex: index,
        studentAnswer: t(c.options[index]),
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
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.instruction),
      options: c.options.map((option) => t(option)),
      correctIndex: c.correctIndex,
      correctAnswer: t(c.options[c.correctIndex]),
      studentAnswerIndex: index,
      studentAnswer: t(c.options[index]),
      correct: true,
      firstTry: nextAttempts === 1,
      attempts: nextAttempts,
      wrongIndices: [...wrongIndices],
      skillTag: SCREEN_META[screen].subtype,
      solved: true,
    });
  };

  const proceed = () => {
    if (isFinal) finishLesson();
    else onNext();
  };
  const isHook = screen === 0;
  const retryCopy = t({
    uz: "Modeldagi belgilarga qarab, boshqa javobni tanlang.",
    ru: 'Проверь признаки в модели и выбери другой ответ.',
    en: 'Check the clues in the model and choose another answer.',
  });
  const feedbackCopy = solved
    ? t(c.correctText)
    : picked !== null
      ? `${t(c.wrong?.[picked])} ${retryCopy}`
      : '';

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} hidden={screen === 0} /><NavNext onClick={proceed} disabled={!canAdvance} finish={isFinal} /></>}
    >
      <div className={`screen-stack ${isHook ? 'hook-screen' : ''}`} data-g4-screen={isHook ? 'hook' : undefined}>
        {isHook ? (
          <>
            <div className="screen-heading hook-topic-heading">
              <div className="heading-copy">
                <span className="lesson-kicker" data-g4-role="hook-topic">{lang === 'en' ? 'LUMO CITY · MISSION' : lang === 'ru' ? 'LUMO CITY · МИССИЯ' : 'LUMO CITY · MISSIYA'}</span>
                <h1 data-g4-role="hook-title">{t(c.title)}</h1>
                <p>{t(c.lead)}</p>
              </div>
            </div>
            <h2 className="hook-question-title" data-g4-role="hook-question">{t(c.instruction)}</h2>
            <section className="hook-topic-scene" data-g4-role="hook-scene visual-frame">
              <div className="hook-topic-bit" data-g4-role="hook-bit"><BitSVG state={solved ? 'nod' : picked !== null ? 'think' : 'present'} /></div>
              <div className="hook-topic-model">
                <ModelPanel model={c.model} solved={solved} />
              </div>
            </section>
          </>
        ) : (
          <>
            <div className="screen-heading">
              <div className="heading-copy">
                <span className="lesson-kicker">{lang === 'en' ? 'LUMO CITY · DATA CENTRE' : lang === 'ru' ? 'LUMO CITY · ЦЕНТР ДАННЫХ' : "LUMO CITY · MA'LUMOT MARKAZI"}</span>
                <h1>{t(c.title)}</h1>
                <p>{t(c.lead)}</p>
              </div>
              <div className="bit-coach" data-g4-role="visual-frame"><BitSVG state={solved ? 'nod' : picked !== null ? 'think' : 'present'} /></div>
            </div>
            <ModelPanel model={c.model} solved={solved} />
          </>
        )}
        <section className={`question-card ${isHook ? 'hook-question-card' : ''}`} aria-labelledby={`question-${screen}`}>
          <div className="question-topline">
            <span>{lang === 'en' ? "YOUR DECISION" : lang === 'ru' ? 'ТВОЁ РЕШЕНИЕ' : 'SIZNING QARORINGIZ'}</span>
            {!canAnswer && <small>{lang === 'en' ? "Listen to the full explanation first" : lang === 'ru' ? 'Сначала дослушай объяснение' : 'Avval tushuntirishni tinglang'}</small>}
          </div>
          <h2 id={`question-${screen}`}>{t(c.instruction)}</h2>
          <div className="options-grid">
            {optionOrder.map((sourceIndex, displayIndex) => {
              const option = c.options[sourceIndex];
              const isWrong = wrongIndices.has(sourceIndex);
              const isCorrect = solved && sourceIndex === c.correctIndex;
              return (
                <button
                  type="button"
                  className={`option ${isWrong ? 'option-picked-wrong' : ''} ${isCorrect ? 'option-correct' : ''} ${solved && !isCorrect ? 'option-dismissed' : ''}`}
                  key={`${t(option)}-${sourceIndex}`}
                  data-g4-role={isHook ? 'answer-card' : undefined}
                  data-g4-branch="choice"
                  data-g4-correct={sourceIndex === c.correctIndex ? 'true' : 'false'}
                  disabled={!canAnswer || solved || isWrong}
                  onClick={() => choose(sourceIndex)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + displayIndex)}</span>
                  <span>{t(option)}</span>
                </button>
              );
            })}
          </div>
          <FeedbackBlock show={picked !== null} correct={solved}>
            {feedbackCopy}
          </FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
};

const normalizeNumberEntry = (value) => String(value ?? '').replace(/\s/g, '');

const NumberInputScreen = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const restored = storedAnswer?.solved === true;
  const [value, setValue] = useState(storedAnswer?.studentAnswer ?? '');
  const [solved, setSolved] = useState(restored);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [feedback, setFeedback] = useState(restored ? c.correctText : (storedAnswer?.feedback ?? null));
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const target = c.options[c.correctIndex];

  const submit = () => {
    if (!canAnswer || solved || !normalizeNumberEntry(value)) return;
    const nextAttempts = attempts + 1;
    const entered = normalizeNumberEntry(value);
    const correct = entered === normalizeNumberEntry(target);
    setAttempts(nextAttempts);

    if (!correct) {
      const matchedIndex = c.options.findIndex((option, index) => index !== c.correctIndex && normalizeNumberEntry(option) === entered);
      const wrongText = matchedIndex >= 0 ? c.wrong[matchedIndex] : c.inputWrongDefault;
      setFeedback(wrongText);
      playSfx('wrong');
      audio.pushOneOff(t(matchedIndex >= 0 ? c.audio?.on_wrong?.[matchedIndex] : c.inputWrongAudio));
      onAnswer({
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
        feedback: wrongText,
        skillTag: SCREEN_META[screen].subtype,
        solved: false,
      });
      return;
    }

    setValue(target);
    setSolved(true);
    setFeedback(c.correctText);
    playSfx('correct');
    audio.pushOneOff(t(c.audio?.on_correct ?? c.correctText));
    onAnswer({
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
      <div className="screen-stack">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">{lang === 'en' ? 'LUMO CITY · DATA CENTRE' : lang === 'ru' ? 'LUMO CITY · ЦЕНТР ДАННЫХ' : "LUMO CITY · MA'LUMOT MARKAZI"}</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach" data-g4-role="visual-frame"><BitSVG state={solved ? 'nod' : 'present'} /></div>
        </div>
        <ModelPanel model={c.model} solved={solved} />
        <section className="question-card" aria-labelledby={`question-${screen}`}>
          <div className="question-topline">
            <span>{lang === 'en' ? "ENTER THE NUMBER" : lang === 'ru' ? 'ВВЕДИ ЧИСЛО' : 'SONNI KIRITING'}</span>
            {!canAnswer && <small>{lang === 'en' ? "Listen to the full explanation first" : lang === 'ru' ? 'Сначала дослушай объяснение' : 'Avval tushuntirishni tinglang'}</small>}
          </div>
          <h2 id={`question-${screen}`}>{t(c.instruction)}</h2>
          <div className="number-entry-row">
            <input
              className={`answer-input ${solved ? 'answer-input-correct' : ''}`}
              value={value}
              onChange={(event) => {
                setValue(event.target.value.replace(/[^0-9\s]/g, ''));
                if (!solved) setFeedback(null);
              }}
              onKeyDown={(event) => { if (event.key === 'Enter') submit(); }}
              inputMode="numeric"
              data-qa-answer={runtimeConfig.previewMode ? String(target) : undefined}
              autoComplete="off"
              aria-label={lang === 'en' ? "Number answer" : lang === 'ru' ? 'Числовой ответ' : 'Son javobi'}
              placeholder="0"
              maxLength={10}
              disabled={!canAnswer || solved}
            />
            <button type="button" className="btn btn-white-accent btn-ready btn-check" onClick={submit} disabled={!canAnswer || solved || !normalizeNumberEntry(value)}>
              {lang === 'en' ? "Check" : lang === 'ru' ? 'Проверить' : 'Tekshirish'}
            </button>
          </div>
          <FeedbackBlock show={feedback !== null} correct={solved}>{t(feedback)}</FeedbackBlock>
          {solved && c.fact && <div className="fact-card"><strong>{lang === 'en' ? "FACT" : lang === 'ru' ? 'ФАКТ' : 'FAKT'}</strong><p>{t(c.fact)}</p></div>}
          {solved && c.bridge && <div className="bridge-card"><span aria-hidden="true">→</span><p>{t(c.bridge)}</p></div>}
        </section>
      </div>
    </Stage>
  );
};

const useTheoryAdvanceGate = (audio) => (
  audio.muted || audio.completed
);

const theoryMoodFor = (subtype) => {
  if (subtype.includes('error')) return 'awkward';
  if (subtype.includes('rule')) return 'idea';
  if (subtype.includes('strategy')) return 'focus';
  if (subtype.includes('summary')) return 'nod';
  if (subtype.includes('table') || subtype.includes('class')) return 'point';
  if (subtype.includes('foundation')) return 'think';
  return 'present';
};

const TheoryExplanation = ({ c, label, canAdvance, variant = 'default', revealed = null }) => {
  const lang = useLang();
  const t = useT();
  return (
    <section
      className={`theory-callout theory-callout-${variant}${revealed === null ? '' : ` audio-reveal ${revealed ? 'is-visible' : ''}`}`}
      aria-hidden={revealed === null ? undefined : !revealed}
    >
      <div className="question-topline">
        <span>{label}</span>
        {!canAdvance && <small>{lang === 'en' ? "Explanation continues" : lang === 'ru' ? 'Объяснение продолжается' : 'Tushuntirish davom etmoqda'}</small>}
      </div>
      <h2>{t(c.instruction)}</h2>
      <div className="theory-answer">
        <span className="theory-answer-mark" aria-hidden="true">→</span>
        <p>{t(c.correctText)}</p>
      </div>
      {c.fact && <div className="fact-card"><strong>{lang === 'en' ? "FACT" : lang === 'ru' ? 'ФАКТ' : 'FAKT'}</strong><p>{t(c.fact)}</p></div>}
      {c.bridge && <div className="bridge-card"><span aria-hidden="true">→</span><p>{t(c.bridge)}</p></div>}
    </section>
  );
};

const TheoryBody = ({ screen, c, meta, label, canAdvance, audioReveal = null }) => {
  const lang = useLang();
  const t = useT();

  if (meta.type === 'hook') {
    return (
      <div className="hook-theory-layout">
        <div className="hook-mission-scene">
          <div className="hook-signal" aria-hidden="true"><i /><i /><i /><i /></div>
          <ModelPanel model={c.model} solved />
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="mission" />
      </div>
    );
  }

  if (meta.subtype.includes('foundation')) {
    return (
      <div className="foundation-theory-layout">
        <div className="foundation-model-wrap">
          <ModelPanel model={c.model} solved />
          <div className="foundation-scale-legend">
            <span>{lang === 'en' ? "place" : lang === 'ru' ? 'разряд' : 'xona'}</span><i aria-hidden="true">→</i>
            <span>{lang === 'en' ? "round neighbours" : lang === 'ru' ? 'соседи' : "qo'shnilar"}</span><i aria-hidden="true">→</i>
            <span>{lang === 'en' ? "zeros" : lang === 'ru' ? 'нули' : 'nollar'}</span>
          </div>
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="foundation" />
      </div>
    );
  }

  if (meta.type === 'rule') {
    return (
      <div className="rule-theory-layout">
        <ModelPanel model={c.model} solved />
        <div className="rule-assembly-line" aria-hidden="true">
          {(c.model?.steps ?? []).map((step, index) => <i style={{ '--theory-delay': `${index * 150}ms` }} key={`${t(step)}-${index}`}>{index + 1}</i>)}
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="rule" />
      </div>
    );
  }

  if (meta.subtype.includes('strategy')) {
    return (
      <div className="strategy-theory-layout">
        <ModelPanel model={c.model} solved />
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="strategy" />
      </div>
    );
  }

  if (meta.subtype.includes('error')) {
    if (c.model?.kind === 'roundingError') {
      return (
        <div className="error-theory-layout error-rounding-layout">
          <ModelPanel model={c.model} solved />
          <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="error" />
        </div>
      );
    }
    const rows = c.model?.rows ?? [];
    return (
      <div className="error-theory-layout">
        <div className="error-walkthrough-board">
          {rows.map((row, index) => (
            <div className={`error-walkthrough-row ${index ? 'error-row-draft' : 'error-row-source'}`} style={{ '--theory-delay': `${index * 170}ms` }} key={`${row.value}-${index}`}>
              <span>{t(row.label)}</span><strong>{row.value}</strong>
            </div>
          ))}
          <div className="error-repair-arrow" aria-hidden="true">↓</div>
          <div className="error-repair-result"><span>{lang === 'en' ? "correct form" : lang === 'ru' ? 'верная запись' : "to'g'ri yozuv"}</span><strong>{t(c.options[c.correctIndex]).match(/[0-9 ]+/)?.[0]?.trim() || '72 045'}</strong></div>
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="error" />
      </div>
    );
  }

  if (meta.type === 'summary') {
    return (
      <div className="summary-theory-layout">
        <div className="summary-signal" data-g4-role="visual-frame"><BitSVG state="nod" /><strong>{t(c.model?.number)}</strong></div>
        <div className="summary-theory-cards">
          <div><span>01</span><p>{lang === 'en' ? "Choose the accuracy that suits the situation and mark the target place." : lang === 'ru' ? 'Выбери точность по ситуации и отметь целевой разряд.' : 'Vaziyatga mos aniqlik va maqsad xonasini tanlang.'}</p></div>
          <div><span>02</span><p>{lang === 'en' ? "Use the next digit on the right to decide whether to round down or up." : lang === 'ru' ? 'По соседней цифре справа реши, округлять вниз или вверх.' : "Darhol o'ngdagi raqam bo'yicha pastga yoki yuqoriga qaror qiling."}</p></div>
          <div><span>03</span><p>{lang === 'en' ? "Replace all digits to the right of the selected place with zeros." : lang === 'ru' ? 'Замени все цифры справа от выбранного разряда нулями.' : "Tanlangan xonadan o'ngdagi barcha raqamlarni nolga almashtiring."}</p></div>
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="summary" />
      </div>
    );
  }

  if (meta.subtype === 'accuracy-corridor') {
    const visible = audioReveal?.visible ?? 5;
    return (
      <div className={`animated-theory-layout animated-theory-${screen}`}>
        <ModelPanel model={c.model} solved revealRows={visible} />
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="animated" revealed={visible >= 5} />
      </div>
    );
  }

  return (
    <div className={`animated-theory-layout animated-theory-${screen}`}>
      <ModelPanel model={c.model} solved />
      <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="animated" />
    </div>
  );
};

function useFinaleReveal(count = 4, interval = 500) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const reduced = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const frame = requestAnimationFrame(() => setVisible(count));
      return () => cancelAnimationFrame(frame);
    }
    const resetFrame = requestAnimationFrame(() => setVisible(0));
    const timers = Array.from({ length: count }, (_, index) => (
      window.setTimeout(() => setVisible(index + 1), 300 + index * interval)
    ));
    return () => {
      cancelAnimationFrame(resetFrame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [count, interval]);
  return visible;
}

const FinaleScreen = ({ screen, answers = [], onPrev, finishLesson, titleClaimed = false, onClaimTitle, reflectionChoice = null, onReflectionChoice }) => {
  const [revealNow, setRevealNow] = useState(false);
  const [reflection, setReflection] = useState(reflectionChoice);
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s14;
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, 's14-finale-intro'),
    ...localizedSegments(c.audio?.on_correct ?? c.correctText, lang, 's14-finale-result'),
  ], [c.audio, c.correctText, lang]);
  const audio = useAudio(segments);
  const visible = useFinaleReveal(4, 500);
  const scoredIndexes = useMemo(
    () => SCREEN_META.map((meta, index) => (meta.scored ? index : null)).filter((index) => index !== null),
    [],
  );
  const firstTry = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
  const complete = visible >= 4;
  const totalScored = scoredIndexes.length;
  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const finalState = complete || audio.completed || audio.muted || reduced;
  const rewardTitle = firstTry === totalScored
    ? { ru: 'Мастер округления', uz: 'Yaxlitlash ustasi', en: "Rounding master" }
    : firstTry >= Math.max(1, totalScored - 1)
      ? { ru: 'Знаток точности', uz: 'Aniqlik bilimdoni', en: "Accuracy expert" }
      : { ru: 'Исследователь оценок', uz: 'Taxmin tadqiqotchisi', en: "Estimation explorer" };
  const takeaways = lang === 'en'
    ? [
      'Choose the accuracy and target place that suit the situation.',
      'Use the digit immediately to the right to decide whether to round down or up.',
      'Replace every digit to the right of the target place with zeros.',
    ]
    : lang === 'ru'
      ? [
        'Выбери точность по ситуации и отметь целевой разряд.',
        'По соседней цифре справа реши, округлять вниз или вверх.',
        'Замени все цифры справа от выбранного разряда нулями.',
      ]
      : [
        'Vaziyatga mos aniqlik va maqsad xonasini tanlang.',
        "Darhol o'ngdagi raqam bo'yicha pastga yoki yuqoriga qaror qiling.",
        "Tanlangan xonadan o'ngdagi barcha raqamlarni nolga almashtiring.",
      ];
  const reflectionCopy = ({
    uz: { question: "Qaysi ko'nikma sizda eng ishonchli?", options: ["Aniqlikni tanlash", "Qaror raqamini tekshirish", "Natijani nollar bilan yozish"], wait: "Avval bitta xulosani tanlang" },
    ru: { question: 'Какой навык у тебя самый уверенный?', options: ['Выбирать точность', 'Проверять решающую цифру', 'Записывать нули в результате'], wait: 'Сначала выбери один вывод' },
    en: { question: 'Which skill feels most secure?', options: ['Choosing accuracy', 'Checking the deciding digit', 'Writing zeros in the result'], wait: 'Choose one reflection first' },
  })[lang];
  const claimTitle = () => {
    if (!finalState || reflection === null || titleClaimed) return;
    onClaimTitle?.();
    setRevealNow(true);
  };
  const chooseReflection = (index) => {
    if (titleClaimed) return;
    setReflection(index);
    onReflectionChoice?.(index);
  };

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} /><NavNext onClick={titleClaimed ? finishLesson : undefined} disabled={!titleClaimed} finish /></>}>
      <div className="screen-stack finale-screen">
        <G4TitleReveal active={titleClaimed} playNow={revealNow} title={t(rewardTitle)} lang={lang} />
        <style>{G4_TITLE_STYLES}</style>
        <header className="finale-heading">
          <span>{lang === 'en' ? "FINAL STAGE" : lang === 'ru' ? 'ФИНАЛЬНЫЙ ЭТАП' : 'YAKUNIY BOSQICH'}</span>
          <h1>{t(c.title)}</h1>
          <p>{lang === 'en' ? "The scoreboard error from the start of the lesson is fixed: the station code is shown exactly, and the general figure is shown at the required accuracy." : lang === 'ru' ? 'Табло, перепутавшее данные в начале урока, исправлено: код станции показан точно, а обзорный показатель — с нужной точностью.' : "Dars boshida aralashib ketgan tablo tuzatildi: stansiya kodi aniq, umumiy ko'rsatkich esa kerakli aniqlikda ko'rsatiladi."}</p>
        </header>
        <div className="finale-layout">
          <div className="finale-main">
            <div className="finale-mastery">
              {takeaways.map((item, index) => (
                <article className={`finale-takeaway ${visible >= index + 1 ? 'is-visible' : ''}`} key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></article>
              ))}
            </div>
            <div className={`finale-proof ${visible >= 3 ? 'is-visible' : ''}`}>
              <span>{lang === 'en' ? "OPENING MISSION SOLUTION" : lang === 'ru' ? 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ' : "BOSHLANG'ICH MISSIYA YECHIMI"}</span><strong>{t(c.model.number)}</strong><p>{t(c.correctText)}</p>
            </div>
            <div className={`finale-bridge ${complete ? 'is-visible' : ''}`}><span aria-hidden="true">→</span><div><strong>{lang === 'en' ? "NEXT MISSION" : lang === 'ru' ? 'СЛЕДУЮЩАЯ МИССИЯ' : 'KEYINGI MISSIYA'}</strong><p>{t(c.bridge)}</p></div></div>
          </div>
          {!titleClaimed && (
            <div className="final-reflection" data-g4-mechanic="ReflectionClaim" data-g4-role="reflection">
              <span>{reflectionCopy.question}</span>
              <div>{reflectionCopy.options.map((option, index) => <button type="button" key={option} className={reflection === index ? 'reflection-active' : ''} aria-pressed={reflection === index} disabled={titleClaimed} onClick={() => chooseReflection(index)}>{option}</button>)}</div>
              <button type="button" className="btn-white-accent g4-title-claim" data-g4-role="title-claim" disabled={!finalState || reflection === null} onClick={claimTitle} aria-label={t({ uz: "Unvonni olish", ru: 'Получить звание', en: 'Claim title' })}>
                <span aria-hidden="true">★</span>
                <strong>{!finalState
                  ? t({ uz: "Yakuniy tushuntirishni tinglang", ru: 'Прослушайте итоговое объяснение', en: 'Listen to the final explanation' })
                  : reflection === null
                    ? reflectionCopy.wait
                    : t({ uz: "Unvonni olish", ru: 'Получить звание', en: 'Claim title' })}</strong>
              </button>
            </div>
          )}
          {titleClaimed && <G4TitleCard title={t(rewardTitle)} lang={lang} firstTry={firstTry} totalScored={totalScored} />}
        </div>
      </div>
    </Stage>
  );
};

const TheoryScreen = ({ screen, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const meta = SCREEN_META[screen];
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}-intro`),
    ...localizedSegments(c.audio?.on_correct ?? c.correctText, lang, `s${screen}-explanation`),
  ], [c.audio, c.correctText, lang, screen]);
  const audio = useAudio(segments);
  const revealCount = meta.subtype === 'accuracy-corridor' ? 5 : 0;
  const audioReveal = useAudioSegmentReveal(audio, segments, revealCount);
  const stageAudio = revealCount
    ? { ...audio, replay: audioReveal.replay, toggleMute: audioReveal.toggleMute }
    : audio;
  const canAdvance = useTheoryAdvanceGate(audio);
  const isFinal = screen === TOTAL_SCREENS - 1;
  const proceed = () => {
    if (isFinal) finishLesson();
    else onNext();
  };
  const label = meta.type === 'rule'
    ? (lang === 'en' ? "RULE" : lang === 'ru' ? 'ПРАВИЛО' : 'QOIDA')
    : meta.subtype.includes('error')
      ? (lang === 'en' ? "ERROR ANALYSIS" : lang === 'ru' ? 'РАЗБОР ОШИБКИ' : 'XATONI TUZATISH')
      : meta.subtype.includes('strategy')
        ? (lang === 'en' ? "RELIABLE METHOD" : lang === 'ru' ? 'НАДЁЖНЫЙ СПОСОБ' : 'ISHONCHLI USUL')
        : meta.type === 'summary'
          ? (lang === 'en' ? "REMEMBER" : lang === 'ru' ? 'ЗАПОМНИ' : 'ESLAB QOLING')
          : (lang === 'en' ? "BIT EXPLAINS" : lang === 'ru' ? 'БИТ ОБЪЯСНЯЕТ' : 'BIT TUSHUNTIRADI');

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={stageAudio}
      nav={(
        <>
          <NavBack onClick={onPrev} hidden={screen === 0} />
          <NavNext onClick={proceed} disabled={!canAdvance} finish={isFinal} />
        </>
      )}
    >
      <div className={`screen-stack theory-screen theory-${meta.subtype}`}>
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">{lang === 'en' ? 'LUMO CITY · DATA CENTRE' : lang === 'ru' ? 'LUMO CITY · ЦЕНТР ДАННЫХ' : "LUMO CITY · MA'LUMOT MARKAZI"}</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-theory" data-g4-role="visual-frame">
            <BitSVG state={theoryMoodFor(meta.subtype)} />
          </div>
        </div>
        <TheoryBody
          screen={screen}
          c={c}
          meta={meta}
          label={label}
          canAdvance={canAdvance}
          audioReveal={revealCount ? audioReveal : null}
        />
      </div>
    </Stage>
  );
};

const WorkedExamplesScreen = ({ screen, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro, lang, `s${screen}-intro`),
    ...c.items.flatMap((item, index) => [
      ...localizedSegments(item.audio?.intro, lang, `s${screen}-example-${index}-task`),
      ...localizedSegments(item.audio?.on_correct ?? item.correctText, lang, `s${screen}-example-${index}-answer`),
    ]),
  ], [c.audio, c.items, lang, screen]);
  const audio = useAudio(segments);
  const canAdvance = useTheoryAdvanceGate(audio);

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack worked-examples-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">{lang === 'en' ? 'LUMO CITY · EXAMPLE LAB' : lang === 'ru' ? 'LUMO CITY · ЛАБОРАТОРИЯ ПРИМЕРОВ' : 'LUMO CITY · MISOLLAR LABORATORIYASI'}</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-theory" data-g4-role="visual-frame"><BitSVG state="focus" /></div>
        </div>
        <div className="worked-examples-grid">
          {c.items.map((item, index) => (
            <article className="worked-example-card" style={{ '--example-delay': `${index * 110}ms` }} key={t(item.question)}>
              <span className="worked-example-number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{t(item.question)}</h2>
                <strong>{t(item.options[item.correctIndex])}</strong>
                <p>{t(item.correctText)}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="worked-examples-finish" data-g4-role="visual-frame">
          <BitSVG state="nod" />
          <p>{t(c.completionText)}</p>
        </div>
      </div>
    </Stage>
  );
};
const ROUNDING_LINE_UI = {
  step: { uz: 'Qadam', ru: 'Шаг', en: 'Step' },
  nextStep: { uz: 'Keyingi qadam', ru: 'Следующий шаг', en: 'Next step' },
  allStepsDone: { uz: 'Uch qadam bajarildi', ru: 'Три шага выполнены', en: 'All three steps are complete' },
  listenFirst: { uz: 'Avval tushuntirishni tinglang', ru: 'Сначала послушай объяснение', en: 'Listen to the explanation first' },
  approximateEquals: { uz: 'taqriban teng', ru: 'приблизительно равно', en: 'is approximately equal to' },
  lowerEndpoint: { uz: 'Quyi chegara', ru: 'Нижняя граница', en: 'Lower endpoint' },
  upperEndpoint: { uz: 'Yuqori chegara', ru: 'Верхняя граница', en: 'Upper endpoint' },
  givenNumber: { uz: 'Berilgan son', ru: 'Данное число', en: 'Given number' },
  numberLine: { uz: "Gorizontal sonlar o'qi", ru: 'Горизонтальная числовая прямая', en: 'Horizontal number line' },
};

const formatRoundingNumber = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const RoundingProgress = ({ step }) => {
  const t = useT();
  return (
    <div className="rounding-progress" aria-label={`${t(ROUNDING_LINE_UI.step)} ${step + 1} / 3`}>
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={index < step ? 'is-done' : index === step ? 'is-current' : ''}
          aria-hidden="true"
        />
      ))}
      <b>{t(ROUNDING_LINE_UI.step)} {step + 1} / 3</b>
    </div>
  );
};

const RoundingNumberLine = ({ data, interactive = false, selected = null, wrongValues = [], complete = false, disabled = false, onSelect }) => {
  const t = useT();
  const markerPosition = ((data.value - data.lower) / (data.upper - data.lower)) * 100;
  const endpointValues = [data.lower, data.upper];
  const lineLabel = `${t(ROUNDING_LINE_UI.numberLine)}. ${formatRoundingNumber(data.lower)}, ${t(ROUNDING_LINE_UI.givenNumber)} ${formatRoundingNumber(data.value)}, ${formatRoundingNumber(data.upper)}.`;

  return (
    <div className={`rounding-number-line ${interactive ? 'is-interactive' : ''}`} aria-label={lineLabel}>
      <div className="rounding-source-number">{formatRoundingNumber(data.value)}</div>
      <div className="rounding-axis" aria-hidden={!interactive}>
        <span className="rounding-midpoint" aria-hidden="true" />
        <span
          className="rounding-given-point"
          style={{ '--rounding-position': `${markerPosition}%` }}
          aria-hidden="true"
        >
          <i />
          <b>{formatRoundingNumber(data.value)}</b>
        </span>
        {endpointValues.map((value, index) => {
          const side = index === 0 ? 'lower' : 'upper';
          const isCorrect = value === data.result;
          const isWrong = wrongValues.includes(value);
          const isSelected = selected === value;
          const className = [
            'rounding-endpoint',
            `rounding-endpoint-${side}`,
            isWrong ? 'is-wrong' : '',
            complete && isCorrect ? 'is-correct' : '',
            isSelected ? 'is-selected' : '',
          ].filter(Boolean).join(' ');
          const endpointLabel = side === 'lower' ? ROUNDING_LINE_UI.lowerEndpoint : ROUNDING_LINE_UI.upperEndpoint;

          if (!interactive) {
            return (
              <span className={className} key={value} aria-hidden="true">
                <i />
                <b>{formatRoundingNumber(value)}</b>
              </span>
            );
          }

          return (
            <button
              type="button"
              className={className}
              key={value}
              data-g4-branch="line-point"
              data-g4-correct={String(isCorrect)}
              data-qa-rounding-endpoint={side}
              aria-label={`${t(endpointLabel)}: ${formatRoundingNumber(value)}`}
              aria-pressed={isSelected}
              disabled={disabled || complete || isWrong}
              onClick={() => onSelect?.(value)}
            >
              <i aria-hidden="true" />
              <b>{formatRoundingNumber(value)}</b>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const RoundingEquation = ({ data, show }) => {
  const t = useT();
  const left = formatRoundingNumber(data.value);
  const right = formatRoundingNumber(data.result);
  return (
    <div className="rounding-equation-slot" aria-live="polite">
      {show && (
        <div
          className="rounding-equation"
          data-qa-rounding-equation
          role="img"
          aria-label={`${left} ${t(ROUNDING_LINE_UI.approximateEquals)} ${right}`}
        >
          <span aria-hidden="true">{left}</span>
          <strong aria-hidden="true">≈</strong>
          <span aria-hidden="true">{right}</span>
        </div>
      )}
    </div>
  );
};

const RoundingFeedback = ({ kind, children }) => {
  const lang = useLang();
  return (
    <div className="rounding-feedback-slot" aria-live="polite">
      {kind && (
        <div className={`rounding-feedback rounding-feedback-${kind}`} data-g4-feedback={kind} role="status">
          {kind === 'solution' ? (
            <>
              <div className="rounding-feedback-bit" aria-hidden="true"><BitSVG state="nod" /></div>
              <div className="rounding-feedback-copy">
                <strong>{lang === 'en' ? 'SOLUTION' : lang === 'ru' ? 'РЕШЕНИЕ' : 'YECHIM'}</strong>
                <p>{children}</p>
              </div>
            </>
          ) : (
            <>
              <span aria-hidden="true">↺</span>
              <p>{children}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const GuidedRoundingLineStep = ({ screen, onNext, onPrev, roundingFlowState, onRoundingFlowState }) => {
  const lang = useLang();
  const t = useT();
  const flowState = roundingFlowState.guided;
  const step = Math.max(0, Math.min(2, flowState.step));
  const data = ROUNDING_LINE_FLOWS.guided[step];
  const copy = ROUNDING_LINE_COPY.guided;
  const stepCopy = copy.steps[step];
  const segments = useMemo(
    () => localizedSegments(stepCopy.audio.intro, lang, `s1-rounding-${data.id}`),
    [data.id, lang, stepCopy.audio.intro],
  );
  const audio = useAudio(segments);
  const narrationDone = audio.muted || audio.completed;
  const storedComplete = flowState.completed[step] === true;
  const revealed = storedComplete || narrationDone;

  useEffect(() => {
    if (!narrationDone || storedComplete) return;
    onRoundingFlowState('guided', (previous) => {
      if (previous.completed[step]) return previous;
      const completed = [...previous.completed];
      completed[step] = true;
      return { ...previous, completed };
    });
  }, [narrationDone, onRoundingFlowState, step, storedComplete]);

  const goToNextStep = () => {
    if (!revealed || !narrationDone || step >= 2) return;
    onRoundingFlowState('guided', (previous) => ({ ...previous, step: step + 1 }));
  };
  const canAdvance = step === 2 && revealed && narrationDone;

  return (
    <Stage
      screen={screen}
      eyebrow={copy.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div
        className="screen-stack rounding-flow-screen"
        data-g4-mechanic="GuidedRoundingLine"
        data-qa-rounding-flow="guided"
        data-qa-rounding-step={step}
      >
        <div className="rounding-flow-heading">
          <span className="lesson-kicker">LUMO CITY · {t(stepCopy.label)}</span>
          <h1>{t(copy.title)}</h1>
          <p>{t(copy.lead)}</p>
        </div>
        <section className="rounding-flow-card">
          <RoundingProgress step={step} />
          <RoundingNumberLine data={data} />
          <RoundingEquation data={data} show={revealed} />
          <div className={`rounding-guided-explanation ${revealed ? 'is-visible' : ''}`} aria-live="polite">
            <span aria-hidden="true">{revealed ? '✓' : '♪'}</span>
            <p>{revealed ? t(stepCopy.explanation) : t(ROUNDING_LINE_UI.listenFirst)}</p>
          </div>
          <div className="rounding-action-slot">
            {step < 2 ? (
              <button
                type="button"
                className="btn btn-white-accent rounding-step-next"
                data-qa-rounding-next
                disabled={!revealed || !narrationDone}
                onClick={goToNextStep}
              >
                {t(ROUNDING_LINE_UI.nextStep)} <span aria-hidden="true">→</span>
              </button>
            ) : (
              <span className={`rounding-complete-note ${canAdvance ? 'is-visible' : ''}`}>
                <i aria-hidden="true">✓</i> {t(ROUNDING_LINE_UI.allStepsDone)}
              </span>
            )}
          </div>
        </section>
      </div>
    </Stage>
  );
};

const GuidedRoundingLineScreen = (props) => {
  const lang = useLang();
  const step = props.roundingFlowState.guided.step;
  return <GuidedRoundingLineStep key={`guided-${lang}-${step}`} {...props} />;
};

const RoundingLinePracticeStep = ({ screen, onNext, onPrev, roundingFlowState, onRoundingFlowState }) => {
  const lang = useLang();
  const t = useT();
  const flowState = roundingFlowState.practice;
  const step = Math.max(0, Math.min(2, flowState.step));
  const data = ROUNDING_LINE_FLOWS.practice[step];
  const copy = ROUNDING_LINE_COPY.practice;
  const stepCopy = copy.steps[step];
  const selected = flowState.selected[step];
  const wrongValues = flowState.wrongValues[step];
  const complete = flowState.completed[step] === true;
  const segments = useMemo(
    () => localizedSegments(stepCopy.audio.intro, lang, `s2-rounding-${data.id}`),
    [data.id, lang, stepCopy.audio.intro],
  );
  const audio = useAudio(segments);
  const audioReady = audio.muted || audio.completed;

  const selectEndpoint = (value) => {
    if (!audioReady || complete || wrongValues.includes(value)) return;
    const correct = value === data.result;
    onRoundingFlowState('practice', (previous) => {
      const nextSelected = [...previous.selected];
      const nextWrongValues = previous.wrongValues.map((items) => [...items]);
      const nextAttempts = [...previous.attempts];
      const nextCompleted = [...previous.completed];
      nextSelected[step] = value;
      nextAttempts[step] += 1;
      if (correct) nextCompleted[step] = true;
      else if (!nextWrongValues[step].includes(value)) nextWrongValues[step].push(value);
      return {
        ...previous,
        selected: nextSelected,
        wrongValues: nextWrongValues,
        attempts: nextAttempts,
        completed: nextCompleted,
      };
    });
    playSfx(correct ? 'correct' : 'wrong');
    audio.pushOneOff(t(correct ? stepCopy.audio.on_correct : stepCopy.audio.on_wrong));
  };

  const goToNextStep = () => {
    if (!complete || !audioReady || step >= 2) return;
    onRoundingFlowState('practice', (previous) => ({ ...previous, step: step + 1 }));
  };
  const feedbackKind = selected === null ? null : complete ? 'solution' : 'wrong';
  const canAdvance = step === 2 && complete && audioReady;

  return (
    <Stage
      screen={screen}
      eyebrow={copy.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div
        className="screen-stack rounding-flow-screen"
        data-g4-mechanic="RoundingLineSelection"
        data-qa-rounding-flow="practice"
        data-qa-rounding-step={step}
      >
        <div className="rounding-flow-heading">
          <span className="lesson-kicker">LUMO CITY · {t(stepCopy.label)}</span>
          <h1>{t(copy.title)}</h1>
          <p>{t(copy.lead)}</p>
        </div>
        <section className="rounding-flow-card rounding-practice-card">
          <RoundingProgress step={step} />
          <RoundingNumberLine
            data={data}
            interactive
            selected={selected}
            wrongValues={wrongValues}
            complete={complete}
            disabled={!audioReady}
            onSelect={selectEndpoint}
          />
          <RoundingEquation data={data} show={complete} />
          <RoundingFeedback kind={feedbackKind}>
            {feedbackKind === 'solution'
              ? t(stepCopy.audio.on_correct)
              : t(stepCopy.audio.on_wrong)}
          </RoundingFeedback>
          <div className="rounding-action-slot">
            {step < 2 ? (
              <button
                type="button"
                className="btn btn-white-accent rounding-step-next"
                data-qa-rounding-next
                disabled={!complete || !audioReady}
                onClick={goToNextStep}
              >
                {t(ROUNDING_LINE_UI.nextStep)} <span aria-hidden="true">→</span>
              </button>
            ) : (
              <span className={`rounding-complete-note ${canAdvance ? 'is-visible' : ''}`}>
                <i aria-hidden="true">✓</i> {t(ROUNDING_LINE_UI.allStepsDone)}
              </span>
            )}
          </div>
        </section>
      </div>
    </Stage>
  );
};

const RoundingLinePracticeScreen = (props) => {
  const lang = useLang();
  const step = props.roundingFlowState.practice.step;
  return <RoundingLinePracticeStep key={`practice-${lang}-${step}`} {...props} />;
};

const MicroTheoryScreen = ({ screen, contentKey, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey];
  const meta = SCREEN_META[screen];
  const [step, setStep] = useState(0);
  const isRuleBuilder = meta.template === 'RuleBuilder';
  const isCompare = ['ModelCompare', 'PrecisionCompare'].includes(meta.template);
  const requiredStep = isRuleBuilder ? 2 : 1;
  const detailedModelKind = c.model?.kind;
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}-micro-intro`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canInteract = audio.muted || audio.completed || !audio.isPlaying;
  const canAdvance = useTheoryAdvanceGate(audio) && step >= requiredStep;
  const example = c.model?.number ?? c.formula ?? c.options?.[c.correctIndex];
  const explanation = c.correctText ?? c.fact ?? c.conclusion ?? c.prompt;
  const copy = ({
    uz: { model: "Model", result: "Xulosa", reveal: "Yechimni ochish", next: "Keyingi qadam", waiting: "Modelni kuzating, so'ng qadamni o'zingiz oching." },
    ru: { model: 'Модель', result: 'Вывод', reveal: 'Открыть решение', next: 'Следующий шаг', waiting: 'Рассмотри модель, затем сам открой следующий шаг.' },
    en: { model: 'Model', result: 'Conclusion', reveal: 'Reveal the solution', next: 'Next step', waiting: 'Study the model, then reveal the next step yourself.' },
  })[lang];
  const advanceStep = (nextStep) => {
    if (!canInteract || nextStep <= step) return;
    const bounded = Math.min(requiredStep, nextStep);
    setStep(bounded);
    if (bounded === requiredStep) audio.pushOneOff(t(c.audio?.on_correct ?? explanation));
  };
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}>
      <div className="screen-stack micro-theory-screen" data-g4-mechanic={meta.template}>
        <div className="screen-heading"><div className="heading-copy"><span className="lesson-kicker">{lang === 'en' ? 'LUMO CITY · ONE STEP' : lang === 'ru' ? 'LUMO CITY · ОДИН ШАГ' : 'LUMO CITY · BIR QADAM'}</span><h1>{t(c.title)}</h1><p>{t(c.lead)}</p></div><div className="bit-coach bit-coach-theory" data-g4-role="visual-frame"><BitSVG state="point" /></div></div>
        {c.hookQuestion && <div className="hook-question"><span>?</span><strong>{t(c.hookQuestion)}</strong></div>}
        <section className="micro-theory-card">
          <span>{lang === 'en' ? "OBSERVATION" : lang === 'ru' ? 'НАБЛЮДЕНИЕ' : 'KUZATUV'}</span>
          {detailedModelKind === 'multiNumberLine' ? (
            <div className="micro-scale-model" aria-label={t(c.model.badge)}>
              <strong>{c.model.number}</strong>
              <div>
                {c.model.lines.map((line) => (
                  <div className="micro-scale-row" key={t(line.label)}>
                    <span>{t(line.label)}</span>
                    <div><small>{line.lower}</small><i style={{ '--micro-marker': `${line.position}%` }} /><small>{line.upper}</small></div>
                    <b>{line.inspect} → {line.result}</b>
                  </div>
                ))}
              </div>
            </div>
          ) : detailedModelKind === 'roundingError' ? (
            <div className="micro-error-model" aria-label={t(c.model.badge)}>
              <div className="micro-error-source"><strong>{c.model.number}</strong><span>{t(c.model.target)}</span></div>
              <div className="micro-error-drafts">
                {c.model.drafts.map((draft) => <div key={draft.value}><span>{t(draft.label)}</span><strong>{draft.value}</strong></div>)}
              </div>
              <div className={`micro-error-fix ${step >= requiredStep ? 'micro-error-fix-visible' : ''}`} aria-live="polite">
                <span aria-hidden="true">✓</span><strong>{step >= requiredStep ? c.model.result : '?'}</strong>
              </div>
            </div>
          ) : example ? <strong className="micro-theory-example">{t(example)}</strong> : null}
          <h2>{t(c.instruction ?? c.prompt ?? c.title)}</h2>
          <div className={`micro-action-row ${isRuleBuilder ? 'micro-action-steps' : ''}`}>
            {isRuleBuilder ? [0, 1, 2].map((item) => (
              <button type="button" key={item} className={step >= item ? 'micro-action-active' : ''} disabled={!canInteract || item > step + 1} onClick={() => advanceStep(item)}>{item + 1}</button>
            )) : isCompare ? (
              <>
                <button type="button" className={step === 0 ? 'micro-action-active' : ''} aria-pressed={step === 0} onClick={() => setStep(0)}>{copy.model}</button>
                <button type="button" className={step >= 1 ? 'micro-action-active' : ''} aria-pressed={step >= 1} disabled={!canInteract} onClick={() => advanceStep(1)}>{copy.result}</button>
              </>
            ) : (
              <button type="button" className={step >= 1 ? 'micro-action-active' : ''} disabled={!canInteract || step >= 1} onClick={() => advanceStep(1)}>{meta.template === 'ErrorRepair' ? copy.next : copy.reveal}</button>
            )}
          </div>
          <div className={`micro-theory-result ${step >= requiredStep ? 'micro-theory-result-visible' : ''}`} data-g4-role="visual-frame" aria-live="polite">
            <BitSVG state={step >= requiredStep ? 'nod' : 'think'} />
            <p>{step >= requiredStep && explanation ? t(explanation) : copy.waiting}</p>
          </div>
        </section>
      </div>
    </Stage>
  );
};

const Screen0 = (props) => <ChoiceScreen {...props} contentKey="s0" />;
const Screen1 = (props) => <GuidedRoundingLineScreen {...props} />;
const Screen2 = (props) => <RoundingLinePracticeScreen {...props} />;
const Screen3 = (props) => <ChoiceScreen {...props} contentKey="p1" />;
const Screen4 = (props) => <MicroTheoryScreen {...props} contentKey="s2" />;
const Screen5 = (props) => <ChoiceScreen {...props} contentKey="p2" />;
const Screen6 = (props) => <MicroTheoryScreen {...props} contentKey="s4" />;
const Screen7 = (props) => <ChoiceScreen {...props} contentKey="p3" />;
const Screen8 = (props) => <MicroTheoryScreen {...props} contentKey="s6" />;
const Screen9 = (props) => <MicroTheoryScreen {...props} contentKey="s5" />;
const Screen10 = (props) => <ChoiceScreen {...props} contentKey="p4" />;
const Screen11 = (props) => <MicroTheoryScreen {...props} contentKey="s11" />;
const Screen12 = (props) => <MicroTheoryScreen {...props} contentKey="s10" />;
const Screen13 = (props) => <ChoiceScreen {...props} contentKey="p5" />;
const Screen14 = (props) => <FinaleScreen {...props} />;

// Kept as approved visual references while the compact, no-scroll flow is active.
Object.freeze([NumberInputScreen, TheoryScreen, WorkedExamplesScreen]);

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
  const [roundingFlowState, setRoundingFlowState] = useState(createRoundingFlowState);
  const [titleClaimed, setTitleClaimed] = useState(false);
  const [finalReflection, setFinalReflection] = useState(null);
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

  const updateRoundingFlowState = useCallback((flow, updater) => {
    setRoundingFlowState((previous) => {
      const nextFlow = typeof updater === 'function' ? updater(previous[flow]) : updater;
      if (nextFlow === previous[flow]) return previous;
      return { ...previous, [flow]: nextFlow };
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
      <div className={`lesson-root ${showPreviewControls ? 'lesson-preview' : ''}`}>
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
          titleClaimed={titleClaimed}
          onClaimTitle={() => setTitleClaimed(true)}
          reflectionChoice={finalReflection}
          onReflectionChoice={setFinalReflection}
          roundingFlowState={roundingFlowState}
          onRoundingFlowState={updateRoundingFlowState}
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
    radial-gradient(circle at 10% 14%, rgba(22,143,163,.12), transparent 30%),
    radial-gradient(circle at 90% 84%, rgba(255,91,53,.10), transparent 32%),
    linear-gradient(145deg, #F7F8F4 0%, #EEF3F1 100%);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
  zoom: var(--g4z, 1);
}
.lesson-root h1, .lesson-root h2, .lesson-root h3,
.lesson-root p, .lesson-root ol { margin: 0; padding: 0; }
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
  justify-content: center;
}
.stage-content > .screen-stack { max-height: 100%; transform-origin: top center; }
.hook-topic-scene { min-height: 196px; padding: 14px 18px; display: grid; grid-template-columns: 96px minmax(0,1fr); align-items: center; gap: 16px; overflow: hidden; border-radius: 23px; color: ${T.paper}; background: radial-gradient(circle at 87% 24%, rgba(121,211,218,.16), transparent 24%),radial-gradient(circle at 9% 88%, rgba(149,201,61,.11), transparent 25%),linear-gradient(145deg, rgba(22,143,163,.25), transparent 48%),linear-gradient(135deg, #153B50, #0B2232 72%); box-shadow: 0 20px 38px -27px rgba(23,59,82,.78); }
.hook-screen { gap: 8px; }
.hook-screen .hook-topic-scene { min-height: 116px; padding-block: 8px; }
.hook-screen .hook-topic-bit { width: 78px; height: 102px; }
.hook-screen .hook-question-card { padding-block: 9px; }
.hook-screen .hook-question-card .option { font-size: 12px; }
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
`;
