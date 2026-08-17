import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { canUseGrade4TheoryContinue } from './theoryNavigation.js';
import { Grade4Finale, useGrade4TitleClaim } from './Grade4Finale.jsx';

const readPoint = (element, board, side) => {
  const box = element.getBoundingClientRect();
  const host = board.getBoundingClientRect();
  return {
    x: side === 'left' ? box.right - host.left : box.left - host.left,
    y: box.top + box.height / 2 - host.top,
  };
};

function MatchingLines({ boardRef, pairs = [], wrongPair = null, localeKey }) {
  const [geometry, setGeometry] = useState({ width: 0, height: 0, lines: [] });

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const host = board.getBoundingClientRect();
        const allPairs = wrongPair ? [...pairs, { ...wrongPair, wrong: true }] : pairs;
        const lines = allPairs.map((pair) => {
          const left = board.querySelector(`[data-match-left="${pair.left}"]`);
          const right = board.querySelector(`[data-match-right="${pair.right}"]`);
          if (!left || !right) return null;
          return { from: readPoint(left, board, 'left'), to: readPoint(right, board, 'right'), wrong: pair.wrong };
        }).filter(Boolean);
        setGeometry({ width: host.width, height: host.height, lines });
      });
    };

    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(board);
    board.querySelectorAll('[data-match-left],[data-match-right]').forEach((node) => observer?.observe(node));
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [boardRef, pairs, wrongPair, localeKey]);

  return (
    <svg
      className="matching-connectors"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width || 1} ${geometry.height || 1}`}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'visible', pointerEvents: 'none' }}
    >
      {geometry.lines.map((line, index) => {
        const bend = Math.max(24, (line.to.x - line.from.x) * 0.42);
        const path = `M ${line.from.x} ${line.from.y} C ${line.from.x + bend} ${line.from.y}, ${line.to.x - bend} ${line.to.y}, ${line.to.x} ${line.to.y}`;
        return (
          <path
            key={`${path}-${index}`}
            className={line.wrong ? 'matching-connector-wrong' : 'matching-connector-correct'}
            d={path}
            fill="none"
            stroke={line.wrong ? '#B85C32' : '#227A53'}
            strokeWidth="4"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 2px 3px ${line.wrong ? 'rgba(184,92,50,.28)' : 'rgba(34,122,83,.28)'})`, transition: 'd .55s ease, stroke .55s ease' }}
          />
        );
      })}
    </svg>
  );
}

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
  padding: 12px 67px 11px;
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
.g4-title-card-confetti i {
  position: absolute;
  top: -16px;
  left: var(--g4-title-card-left);
  width: 7px;
  height: 12px;
  border-radius: 2px;
  opacity: 0;
  animation: g4-title-card-confetti-fall var(--g4-title-card-duration) linear var(--g4-title-card-delay) 3 both;
}
.g4-title-card-confetti i:nth-child(4n+1) { background: #FFC23C; }
.g4-title-card-confetti i:nth-child(4n+2) { background: #FF5B35; }
.g4-title-card-confetti i:nth-child(4n+3) { background: #77E1EA; }
.g4-title-card-confetti i:nth-child(4n) { background: #95C93D; }
@keyframes g4-title-reveal-overlay-life { 0% { opacity: 0; } 12%,84% { opacity: 1; } 100% { opacity: 0; } }
@keyframes g4-title-reveal-medal-in { from { opacity: 0; transform: translate(-50%,-50%) scale(.25) rotate(-25deg); } to { opacity: 1; transform: translate(-50%,-50%) scale(1) rotate(0); } }
@keyframes g4-title-reveal-title-in { from { opacity: 0; transform: translate(-50%,14px); } to { opacity: 1; transform: translate(-50%,0); } }
@keyframes g4-title-reveal-rays-in { from { opacity: 0; transform: translate(-50%,-50%) scale(.5); } to { opacity: .28; transform: translate(-50%,-50%) scale(1); } }
@keyframes g4-title-reveal-rays { from { transform: translate(-50%,-50%) rotate(0); } to { transform: translate(-50%,-50%) rotate(360deg); } }
@keyframes g4-title-reveal-confetti-fall { to { transform: translateY(470px) rotate(560deg); } }
@keyframes g4-title-card-confetti-fall {
  0% { opacity: 0; transform: translate3d(0,-10px,0) rotate(0); }
  16% { opacity: 1; }
  84% { opacity: .92; }
  100% { opacity: 0; transform: translate3d(var(--g4-title-card-drift),260px,0) rotate(420deg); }
}
@media (max-width: 639.98px) {
  .g4-title-reveal-card { min-height: 100dvh; padding: 24px 18px; }
  .g4-title-reveal-medal { width: 88px; height: 88px; border-width: 5px; font-size: 40px; }
  .g4-title-reveal-card h2 { top: calc(50% + 62px); font-size: 29px; }
  .g4-title-card-stage { min-height: 88px; padding: 9px 51px 8px; border-radius: 14px; }
  .g4-title-card-medal { left: 8px; width: 34px; height: 34px; font-size: 14px; }
  .g4-title-card-stage h2 { font-size: 14px; }
  @keyframes g4-title-card-confetti-fall {
    0% { opacity: 0; transform: translate3d(0,-10px,0) rotate(0); }
    16% { opacity: 1; }
    84% { opacity: .92; }
    100% { opacity: 0; transform: translate3d(var(--g4-title-card-drift),130px,0) rotate(420deg); }
  }
}
@media (max-height: 780px) {
  .g4-title-card-stage { min-height: 76px; padding: 7px 57px 6px; gap: 2px; }
  .g4-title-card-medal { left: 9px; width: 34px; height: 34px; font-size: 14px; }
  .g4-title-card-score { margin-top: 2px; padding: 3px 7px; gap: 5px; }
}
.g4-title-claim{width:100%;min-height:76px;padding:10px 16px;border:0;border-radius:17px;display:grid;grid-template-columns:42px 1fr;align-items:center;gap:12px;color:#fff;background:linear-gradient(135deg,#0E6978,#173B52);box-shadow:0 22px 42px -25px rgba(14,105,120,.9);text-align:left;cursor:pointer;transition:transform .5s ease,box-shadow .5s ease}.g4-title-claim>span{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);font-size:19px}.g4-title-claim>strong{font:750 16px/1.2 'Source Serif 4',Georgia,serif}.g4-title-claim:hover:not(:disabled){transform:translateY(-2px)}.g4-title-claim:disabled{cursor:default;filter:saturate(.55);opacity:.68}
@media (prefers-reduced-motion: reduce) {
  .g4-title-reveal-overlay { opacity: 1; animation: none; }
  .g4-title-reveal-rays { opacity: .28; transform: translate(-50%,-50%); animation: none; }
  .g4-title-reveal-medal { opacity: 1; transform: translate(-50%,-50%); animation: none; }
  .g4-title-reveal-card h2 { opacity: 1; transform: translateX(-50%); animation: none; }
  .g4-title-reveal-confetti, .g4-title-card-confetti { display: none; }
}
`;

const G4_TITLE_COPY = {
  uz: { revealPrefix: 'Unvon', earned: 'UNVON OLINDI', firstTry: 'birinchi urinishda' },
  ru: { revealPrefix: 'Звание', earned: 'ЗВАНИЕ ПОЛУЧЕНО', firstTry: 'с первой попытки' },
  en: { revealPrefix: 'Title', earned: 'TITLE EARNED', firstTry: 'on the first attempt' },
};

function G4TitleReveal({ active, playNow = active, title, lang, onComplete }) {
  const [visible, setVisible] = useState(false); const shownRef = useRef(false);
  useEffect(() => {
    if (!active || !playNow || shownRef.current || typeof window === 'undefined') return undefined;
    let timer;
    const frame = window.requestAnimationFrame(() => {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      shownRef.current = true;
      setVisible(true);
      timer = window.setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, reduced ? 120 : 3900);
    });
    return () => { window.cancelAnimationFrame(frame); window.clearTimeout(timer); };
  }, [active, onComplete, playNow]);
  if (!visible || typeof document === 'undefined') return null;
  const copy = G4_TITLE_COPY[lang] ?? G4_TITLE_COPY.uz;
  return createPortal(<div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={`${copy.revealPrefix}: ${title}`}><div className="rank-boost-card g4-title-reveal-card"><div className="g4-title-reveal-rays" aria-hidden="true" /><div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }} />)}</div><div className="rank-boost-medal g4-title-reveal-medal" aria-hidden="true">★</div><h2>{title}</h2></div></div>, document.body);
}

function G4TitleCard({ title, lang, firstTry, totalScored, celebrate }) {
  const copy = G4_TITLE_COPY[lang] ?? G4_TITLE_COPY.uz;
  return (
    <div className="g4-title-card-stage" data-g4-role="title-card" data-g4-title-bit="absent" data-g4-duration-ms="3000" role="status" aria-live="polite" aria-atomic="true">
      {celebrate && (
        <div className="g4-title-card-confetti" data-g4-role="reward-confetti" data-g4-duration-ms="3000" aria-hidden="true">
          {Array.from({ length: 24 }, (_, index) => {
            const delay = (index % 6) * 0.08;
            return (
              <i
                key={index}
                style={{
                  '--g4-title-card-left': `${6 + ((index * 17) % 89)}%`,
                  '--g4-title-card-delay': `${delay}s`,
                  '--g4-title-card-duration': `${((3 - delay) / 3).toFixed(3)}s`,
                  '--g4-title-card-drift': `${(index % 2 === 0 ? 1 : -1) * (5 + (index % 4) * 3)}px`,
                }}
              />
            );
          })}
        </div>
      )}
      <div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div>
      <span className="g4-title-card-kicker">{copy.earned}</span>
      <h2>{title}</h2>
      <div className="g4-title-card-score"><strong>{firstTry}/{totalScored}</strong><span>{copy.firstTry}</span></div>
    </div>
  );
}

// ============================================================================
// 4-SINF · Dars07 · Pozitsion va nopozitsion sanoq sistemalari
// Lokal Dars01 vizual kontrakti asosida. Notion ishlatilmaydi.
// ============================================================================

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const B = (ru, uz, en) => ({ ru, uz, en });
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const SPEECH_LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
const DEFAULT_STUDENT_NAMES = { uz: "O'quvchi", ru: 'Ученик', en: 'Student' };
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');

const CONTENT = {
  common: {
    back: B('Назад', 'Orqaga', 'Back'),
    next: B('Продолжить', 'Davom etish', 'Continue'),
    finish: B('Завершить урок', 'Darsni yakunlash', 'Finish lesson'),
    check: B('Проверить', 'Tekshirish', 'Check'),
    replay: B('Повторить', "Qayta ko'rish", 'Try again'),
  },
  s0: {
    eyebrow: B('Стартовая миссия', "Boshlang'ich missiya", 'Opening mission'),
    title: B('Коды 27 и 72 одинаковые?', '27 va 72 bir xil kodmi?', 'Are the codes 27 and 72 the same?'),
    question: B(
      'Бит видит одинаковые цифры и считает коды равными. Что нужно проверить сначала?',
      "Bit bir xil raqamlarni ko'rib, kodlar teng deb o'yladi. Avval nimani tekshirish kerak?",
      'Bit sees the same digits and thinks the codes are equal. What should be checked first?',
    ),
    options: [
      B('Проверить место каждой цифры.', "Har bir raqamning o'rnini tekshirish.", 'Check the place of each digit.'),
      B('Сложить цифры в каждом коде.', "Har bir koddagi raqamlarni qo'shish.", 'Add the digits in each code.'),
      B('Проверить только набор цифр.', "Faqat raqamlar to'plamini tekshirish.", 'Check only which digits are used.'),
    ],
    after: B('Проверим эту гипотезу на моделях.', "Bu taxminni modellar yordamida tekshiramiz.", 'We will test this idea with models.'),
    audio: B(
      ['На терминале Лумо-Сити появились коды двадцать семь и семьдесят два.', 'Бит заметил, что в них использованы одинаковые цифры, и решил, что коды равны.', 'Выбери, что нужно проверить прежде всего.'],
      ["Lumo Siti terminalida yigirma yetti va yetmish ikki kodlari paydo bo'ldi.", "Bit ularda bir xil raqamlar ishlatilganini ko'rib, kodlar teng deb o'yladi.", 'Avval nimani tekshirish kerakligini tanlang.'],
      ['The Lumo City terminal shows the codes twenty-seven and seventy-two.', 'Bit noticed that they use the same digits and decided that the codes are equal.', 'Choose what should be checked first.'],
    ),
  },
  s1: {
    eyebrow: B('Исследуем позицию', "Pozitsiyani o'rganamiz", 'Explore position'),
    title: B('Позиция — это место цифры в записи', "Pozitsiya raqamning yozuvdagi o'rnidir", "Position is a digit's place in a numeral"),
    instruction: B('Нажмите каждую цифру и откройте её место.', "Har bir raqamni bosib, uning o'rnini oching.", 'Press each digit to reveal its place.'),
    listenFirst: B('Сначала прослушайте аудио', 'Avval audioni eshiting', 'Listen to the audio first'),
    places: [B('сотни', 'yuzlar', 'hundreds'), B('десятки', "o'nlar", 'tens'), B('единицы', 'birlar', 'ones')],
    values: [B('2 сотни', '2 yuzlik', '2 hundreds'), B('7 десятков', "7 o'nlik", '7 tens'), B('2 единицы', '2 birlik', '2 ones')],
    conclusion: B('Позиция показывает, какое место занимает цифра среди других цифр.', "Pozitsiya raqam boshqa raqamlar orasida qaysi o'rinda turganini ko'rsatadi.", 'Position shows where a digit stands among the other digits.'),
    audio: B(
      ['Слово позиция означает место в определённом порядке.', 'В числе двести семьдесят два цифры стоят в сотнях, десятках и единицах.', 'Нажми каждую цифру и посмотри, какое место она занимает.'],
      ["Pozitsiya so'zi ma'lum tartibdagi o'rinni bildiradi.", "Ikki yuz yetmish ikki sonidagi raqamlar yuzlar, o'nlar va birlar xonalarida turadi.", "Har bir raqamni bosib, u qaysi o'rinda turganini ko'ring."],
      ['The word position means a place in an order.', 'In the number two hundred and seventy-two, the digits stand in the hundreds, tens and ones places.', 'Press each digit and see which place it occupies.'],
    ),
  },
  s2: {
    eyebrow: B('Порядок разрядов', 'Xonalar tartibi', 'Place-value order'),
    title: B('Расположите карточки в правильном порядке', "Kartalarni to'g'ri tartibda joylashtiring", 'Put the cards in the correct order'),
    instruction: B('Нажмите две карточки, чтобы поменять их местами.', "Joylarini almashtirish uchun ikkita kartani bosing.", 'Press two cards to swap their positions.'),
    selectionHint: B('Нажмите 7 и 700.', '7 va 700 sonlarini bosing.', 'Press 7 and 700.'),
    steps: [
      { number: '7', place: B('единицы', 'birlar', 'ones'), value: '7' },
      { number: '70', place: B('десятки', "o'nlar", 'tens'), value: '70' },
      { number: '700', place: B('сотни', 'yuzlar', 'hundreds'), value: '700' },
    ],
    conclusion: B('Верный порядок: 700, 70, 7. Слева направо идут сотни, десятки и единицы.', "To'g'ri tartib: 700, 70, 7. Chapdan o'ngga yuzlar, o'nlar va birlar joylashadi.", 'The correct order is 700, 70, 7. From left to right, the places are hundreds, tens and ones.'),
    audio: B(
      ['Расположите карточки по убыванию разрядного значения.', 'Нажмите карточки семь и семьсот. После второго нажатия они поменяются местами.'],
      ["Kartalarni xona qiymati bo'yicha katta qiymatdan kichik qiymatga joylashtiring.", "Yetti va yetti yuz sonlari yozilgan kartalarni bosing. Ikkinchi karta bosilgach, ularning joyi almashadi."],
      ['Arrange the cards from the greatest place value to the smallest.', 'Press the cards seven and seven hundred. After the second press, they will swap places.'],
    ),
  },
  s3: {
    eyebrow: B('Практика 1', '1-mashq', 'Practice 1'),
    title: B('Где стоит цифра 2 в числе 5 284?', '5 284 sonida 2 raqami qaysi xonada turibdi?', 'What place does the digit 2 occupy in 5,284?'),
    options: [
      B('Сотни, значение 200', 'Yuzlar, qiymati 200', 'Hundreds, value 200'),
      B('Тысячи, значение 2 000', 'Minglar, qiymati 2 000', 'Thousands, value 2,000'),
      B('Десятки, значение 20', "O'nlar, qiymati 20", 'Tens, value 20'),
      B('Единицы, значение 2', 'Birlar, qiymati 2', 'Ones, value 2'),
    ],
    correct: 0,
    displayNumber: '5284',
    highlightIndex: 1,
    feedback: [
      B('Правильно. Цифра 2 стоит в сотнях, поэтому её значение равно 200.', "To'g'ri. 2 raqami yuzlar xonasida, shuning uchun uning qiymati 200.", 'Correct. The digit 2 is in the hundreds place, so its value is 200.'),
      B('Это на один разряд левее. В тысячах стоит цифра 5, а цифра 2 стоит в сотнях.', 'Bu bir xona chapda. Minglar xonasida 5, yuzlar xonasida esa 2 turibdi.', 'That is one place too far left. The digit 5 is in the thousands place, while 2 is in the hundreds place.'),
      B('Это на один разряд правее. В десятках стоит цифра 8, а цифра 2 стоит в сотнях.', "Bu bir xona o'ngda. O'nlar xonasida 8, yuzlar xonasida esa 2 turibdi.", 'That is one place too far right. The digit 8 is in the tens place, while 2 is in the hundreds place.'),
      B('Значение цифры определяется её местом. Здесь 2 означает две сотни, а не две единицы.', "Raqam qiymati uning o'rniga bog'liq. Bu yerda 2 ikki birlikni emas, ikki yuzlikni bildiradi.", "A digit's value is set by its place. Here 2 represents two hundreds, not two ones."),
    ],
    feedbackAudio: B(
      ['Верно. Два стоит в сотнях и означает двести.', 'Посмотри на разряды справа налево. В тысячах стоит пять.', 'Посмотри на разряды справа налево. В десятках стоит восемь.', 'Учитывай место цифры. Здесь два означает двести.'],
      ["To'g'ri. Ikki yuzlar xonasida turib, ikki yuzni bildiradi.", "Xonalarni o'ngdan chapga tekshiring. Minglar xonasida besh turibdi.", "Xonalarni o'ngdan chapga tekshiring. O'nlar xonasida sakkiz turibdi.", "Raqamning o'rnini hisobga oling. Bu yerda ikki raqami ikki yuzni bildiradi."],
      ['Correct. Two is in the hundreds place and represents two hundred.', 'Check the places from right to left. Five is in the thousands place.', 'Check the places from right to left. Eight is in the tens place.', "Use the digit's place. Here two represents two hundred."],
    ),
    audio: B(
      ['В числе пять тысяч двести восемьдесят четыре выделена цифра два.', 'Определи её место и значение.'],
      ["Besh ming ikki yuz sakson to'rt sonida ikki raqami ajratilgan.", "Uning xonasi va qiymatini aniqlang."],
      ['The digit two is highlighted in the number five thousand two hundred and eighty-four.', 'Find its place and value.'],
    ),
  },
  s4: {
    eyebrow: B('Практика 2', '2-mashq', 'Practice 2'),
    title: B('Как правильно разложить число 444 по разрядам?', "444 sonini xona qiymatlariga qanday to'g'ri ajratish mumkin?", 'Which place-value expansion of 444 is correct?'),
    displayNumber: '444',
    options: [
      B('400 + 40 + 4', '400 + 40 + 4', '400 + 40 + 4'),
      B('4 + 4 + 4', '4 + 4 + 4', '4 + 4 + 4'),
      B('40 + 40 + 4', '40 + 40 + 4', '40 + 40 + 4'),
      B('400 + 4 + 4', '400 + 4 + 4', '400 + 4 + 4'),
    ],
    correct: 0,
    feedback: [
      B('Правильно. Левая цифра означает 400, средняя 40, а правая 4.', "To'g'ri. Chapdagi raqam 400 ni, o'rtadagi raqam 40 ni, o'ngdagi raqam esa 4 ni bildiradi.", 'Correct. The left digit represents 400, the middle digit 40, and the right digit 4.'),
      B('Одинаковые цифры не имеют одинакового значения. Их значения определяются местами.', "Bir xil raqamlar bir xil qiymatga ega bo'lmaydi. Ularning qiymati o'rniga qarab aniqlanadi.", 'Equal digits do not have equal values here. Their values are determined by their places.'),
      B('В сотнях стоит цифра 4, поэтому первое слагаемое должно быть 400.', "Yuzlar xonasida 4 turibdi, shuning uchun birinchi qo'shiluvchi 400 bo'lishi kerak.", 'The digit 4 is in the hundreds place, so the first addend must be 400.'),
      B('Средняя цифра стоит в десятках и означает 40, а не 4.', "O'rtadagi raqam o'nlar xonasida turib, 4 ni emas, 40 ni bildiradi.", 'The middle digit is in the tens place and represents 40, not 4.'),
    ],
    feedbackAudio: B(
      ['Верно. Четыреста сорок четыре равно четырёмстам плюс сорок плюс четыре.', 'Проверь место каждой цифры. Одинаковые цифры могут иметь разные значения.', 'Начни с сотен. Левая четвёрка означает четыреста.', 'Проверь среднюю четвёрку. Она означает сорок.'],
      ["To'g'ri. To'rt yuz qirq to'rt soni to'rt yuz, qirq va to'rt qiymatlaridan tuzilgan.", "Har bir raqamning o'rnini tekshiring. Bir xil raqamlar turli qiymatga ega bo'lishi mumkin.", "Yuzlar xonasidan boshlang. Chapdagi to'rt raqami to'rt yuzni bildiradi.", "O'rtadagi to'rt raqamini tekshiring. U qirqni bildiradi."],
      ['Correct. Four hundred and forty-four is four hundred plus forty plus four.', 'Check the place of each digit. Equal digits can have different values.', 'Start with the hundreds place. The left four represents four hundred.', 'Check the middle four. It represents forty.'],
    ),
    audio: B(
      ['В числе четыреста сорок четыре одинаковые цифры стоят в сотнях, десятках и единицах.', 'Выберите правильное разложение числа по разрядам.'],
      ["To'rt yuz qirq to'rt sonidagi bir xil raqamlar yuzlar, o'nlar va birlar xonalarida turibdi.", "Sonning xona qiymatlariga to'g'ri ajratilishini tanlang."],
      ['In four hundred and forty-four, equal digits stand in the hundreds, tens and ones places.', 'Choose the correct place-value expansion.'],
    ),
  },
  s5: {
    eyebrow: B('Позиционное открытие', 'Pozitsion kashfiyot', 'Positional discovery'),
    title: B('Что меняется в записях 14 и 41?', "14 va 41 yozuvlarida nima o'zgaradi?", 'What changes in 14 and 41?'),
    conclusion: B('Цифры те же, но после перестановки меняются их значения и всё число.', "Raqamlar bir xil, lekin o'rin almashganda ularning qiymati va butun son o'zgaradi.", 'The digits are the same, but swapping them changes their values and the whole number.'),
    audio: B(
      ['В числе четырнадцать цифра один означает десять, а цифра четыре означает четыре.', 'После перестановки получаем сорок один. Теперь четыре означает сорок, а один означает одну единицу.', 'Цифры не изменились, но их значения и всё число изменились.', 'Нажми модель и сравни оба состояния ещё раз.'],
      ["O'n to'rt sonida bir raqami o'nni, to'rt raqami esa to'rtni bildiradi.", "Raqamlar o'rni almashganda qirq bir hosil bo'ladi. Endi to'rt qirqni, bir esa bir birlikni bildiradi.", "Raqamlar o'zgarmadi, lekin ularning qiymati va butun son o'zgardi.", "Modelni bosib, ikkala holatni yana taqqoslang."],
      ['In fourteen, the digit one represents ten, while four represents four.', 'After swapping the digits, we get forty-one. Now four represents forty, while one represents one unit.', 'The digits did not change, but their values and the whole number changed.', 'Press the model and compare the two states again.'],
    ),
  },
  s6: {
    eyebrow: B('Правило', 'Qoida', 'Rule'),
    title: B('Десятичная запись — позиционная система', "O'nlik yozuv pozitsion sistemadir", 'Decimal notation is a positional system'),
    tabs: [B('Найти цифру', 'Raqamni topish', 'Find the digit'), B('Определить место', "O'rnini aniqlash", 'Identify its place'), B('Найти значение', 'Qiymatini topish', 'Find its value')],
    steps: [
      B('В записи 41 рассматриваем цифру 4.', "41 yozuvida 4 raqamini ko'ramiz.", 'In 41, we look at the digit 4.'),
      B('Цифра 4 стоит в разряде десятков.', "4 raqami o'nlar xonasida turibdi.", 'The digit 4 is in the tens place.'),
      B('Поэтому её значение равно 40.', 'Shuning uchun uning qiymati 40.', 'Therefore, its value is 40.'),
    ],
    definition: B('В позиционной системе значение цифры зависит от её места.', "Pozitsion sistemada raqamning qiymati uning o'rniga bog'liq.", 'In a positional system, the value of a digit depends on its place.'),
    audio: B(
      ['Десятичная запись называется позиционной системой счисления.', 'Чтобы определить значение цифры, сначала находим её место.', 'В числе сорок один цифра четыре стоит в десятках и означает сорок.', 'Значит, в позиционной системе значение цифры зависит от её места.'],
      ["O'nlik yozuv pozitsion sanoq sistemasi deyiladi.", "Raqam qiymatini aniqlash uchun avval uning o'rnini topamiz.", "Qirq bir sonida to'rt raqami o'nlar xonasida turib, qirqni bildiradi.", "Demak, pozitsion sistemada raqamning qiymati uning o'rniga bog'liq."],
      ['Decimal notation is called a positional numeral system.', "To find a digit's value, first identify its place.", 'In forty-one, the digit four is in the tens place and represents forty.', 'So, in a positional system, the value of a digit depends on its place.'],
    ),
  },
  s7: {
    eyebrow: B('Практика 3', '3-mashq', 'Practice 3'),
    title: B('Чему равна левая цифра 7 в числе 707?', '707 sonidagi chap 7 ning qiymati qancha?', 'What is the value of the left-hand 7 in 707?'),
    options: [B('700', '700', '700'), B('7', '7', '7'), B('70', '70', '70'), B('707', '707', '707')],
    correct: 0,
    feedback: [
      B('Правильно. Левая цифра 7 стоит в сотнях и означает 700.', "To'g'ri. Chapdagi 7 yuzlar xonasida turib, 700 ni bildiradi.", 'Correct. The left-hand 7 is in the hundreds place and represents 700.'),
      B('Это значение цифры 7 в единицах. Левая цифра стоит в сотнях.', "Bu birlar xonasidagi 7 ning qiymati. Chapdagi raqam yuzlar xonasida turibdi.", 'That is the value of 7 in the ones place. The left-hand digit is in the hundreds place.'),
      B('Это значение цифры 7 в десятках. В числе 707 десятки занимает 0.', "Bu o'nlar xonasidagi 7 ning qiymati. 707 sonida o'nlar xonasini 0 egallagan.", 'That is the value of 7 in the tens place. In 707, zero holds the tens place.'),
      B('707 — это значение всего числа. Вопрос только о левой цифре 7.', '707 butun sonning qiymati. Savol faqat chapdagi 7 raqami haqida.', '707 is the value of the whole number. The question asks only about the left-hand 7.'),
    ],
    feedbackAudio: B(
      ['Верно. Левая семёрка стоит в сотнях и означает семьсот.', 'Проверь место левой семёрки. Она не стоит в единицах.', 'Проверь средний разряд. В десятках стоит ноль.', 'Не смешивай значение одной цифры со значением всего числа.'],
      ["To'g'ri. Chapdagi yetti yuzlar xonasida turib, yetti yuzni bildiradi.", "Chapdagi yettining o'rnini tekshiring. U birlar xonasida emas.", "O'rtadagi xonani tekshiring. O'nlar xonasida nol turibdi.", "Bitta raqam qiymatini butun son qiymati bilan aralashtirmang."],
      ['Correct. The left-hand seven is in the hundreds place and represents seven hundred.', 'Check the place of the left-hand seven. It is not in the ones place.', 'Check the middle place. Zero is in the tens place.', 'Do not mix the value of one digit with the value of the whole number.'],
    ),
    audio: B(
      ['В числе семьсот семь выделена левая цифра семь.', 'Определи её значение по месту в записи.'],
      ["Yetti yuz yetti sonida chapdagi yetti raqami ajratilgan.", "Uning qiymatini yozuvdagi o'rniga qarab aniqlang."],
      ['The left-hand digit seven is highlighted in the number seven hundred and seven.', 'Use its place in the numeral to find its value.'],
    ),
  },
  s8: {
    eyebrow: B('Практика 4', '4-mashq', 'Practice 4'),
    title: B('Бит решил, что 63 и 36 равны, потому что цифры одинаковые. Какое объяснение исправляет ошибку?', "Bit 63 va 36 bir xil raqamlardan tuzilgani uchun teng deb o'yladi. Qaysi izoh xatoni tuzatadi?", 'Bit thinks 63 and 36 are equal because they use the same digits. Which explanation fixes the mistake?'),
    claim: B('63 = 36', '63 = 36', '63 = 36'),
    options: [
      B('В 63 цифра 6 означает 60, а в 36 — только 6.', '63 da 6 raqami 60 ni, 36 da esa faqat 6 ni bildiradi.', 'In 63, the digit 6 represents 60, but in 36 it represents only 6.'),
      B('Числа равны, потому что сумма цифр в обоих равна 9.', "Sonlar teng, chunki ikkalasida ham raqamlar yig'indisi 9.", 'The numbers are equal because the digit sum is 9 in both.'),
      B('Цифра 6 всегда имеет значение 6.', '6 raqami har doim 6 qiymatiga ega.', 'The digit 6 always has the value 6.'),
    ],
    correct: 0,
    feedback: [
      B('Правильно. Перестановка изменила место цифры 6 и значение всего числа.', "To'g'ri. O'rin almashganda 6 raqamining o'rni va butun son qiymati o'zgardi.", 'Correct. Swapping the digits changed the place of 6 and the value of the whole number.'),
      B('Одинаковая сумма цифр не делает числа равными. Нужно сравнить значения цифр по местам.', "Raqamlar yig'indisi bir xil bo'lishi sonlarni teng qilmaydi. Raqamlarning xona qiymatlarini solishtirish kerak.", "An equal digit sum does not make the numbers equal. Compare each digit's place value."),
      B('В позиционной записи значение цифры меняется с её местом. В 63 цифра 6 означает 60.', "Pozitsion yozuvda raqam qiymati uning o'rniga qarab o'zgaradi. 63 da 6 raqami 60 ni bildiradi.", "In positional notation, a digit's value changes with its place. In 63, the digit 6 represents 60."),
    ],
    feedbackAudio: B(
      ['Верно. В шестидесяти трёх шесть означает шестьдесят, а в тридцати шести означает шесть.', 'Сумма цифр не определяет значение всего числа. Проверь разряды.', 'В позиционной записи значение цифры зависит от её места.'],
      ["To'g'ri. Oltmish uchda olti oltmishni, o'ttiz oltida esa oltini bildiradi.", "Raqamlar yig'indisi butun son qiymatini aniqlamaydi. Xonalarni tekshiring.", "Pozitsion yozuvda raqam qiymati uning o'rniga bog'liq."],
      ['Correct. In sixty-three, six represents sixty, while in thirty-six it represents six.', 'The digit sum does not determine the value of the whole number. Check the place values.', "In positional notation, a digit's value depends on its place."],
    ),
    audio: B(
      ['Бит решил, что шестьдесят три и тридцать шесть равны, потому что состоят из одинаковых цифр.', 'Выбери объяснение, которое исправляет эту ошибку.'],
      ["Bit oltmish uch va o'ttiz olti bir xil raqamlardan tuzilgani uchun teng deb o'yladi.", "Bu xatoni tuzatadigan izohni tanlang."],
      ['Bit decided that sixty-three and thirty-six are equal because they use the same digits.', 'Choose the explanation that fixes this mistake.'],
    ),
  },
  s9: {
    eyebrow: B('Шаг 1. Предположение', '1-qadam. Taxmin', 'Step 1. Make a guess'),
    title: B('Как вы думаете, что означают эти знаки?', "Bu belgilarni nima deb o'ylaysiz?", 'What do you think these symbols are?'),
    symbols: 'I  V  X',
    hypothesisOptions: [
      B('Это знаки для записи чисел.', 'Bular sonlarni yozish belgilaridir.', 'They are symbols used to write numbers.'),
      B('Это условные знаки секретного кода.', 'Bular maxfiy kodning shartli belgilaridir.', 'They are symbols in a secret code.'),
    ],
    hypothesisAccepted: B('Предположение принято. Теперь проверим его.', 'Taxmin qabul qilindi. Endi uni tekshiramiz.', 'Your guess has been recorded. Now let us check it.'),
    lessonTitle: B('Шаг 2. Римские цифры от 1 до 10', '2-qadam. 1 dan 10 gacha Rim raqamlari', 'Step 2. Roman numerals from 1 to 10'),
    explanation: B('Слушайте по порядку. Карточка числа, о котором говорится, будет выделена.', "Ketma-ket tinglang. Aytilayotgan sonning kartasi ajratib ko'rsatiladi.", 'Listen in order. The card for the number being described will be highlighted.'),
    numerals: [
      ['1', 'I'], ['2', 'II'], ['3', 'III'], ['4', 'IV'], ['5', 'V'],
      ['6', 'VI'], ['7', 'VII'], ['8', 'VIII'], ['9', 'IX'], ['10', 'X'],
    ],
    audioIntro: B(
      ['Посмотрите на знаки и, вэ и икс.', 'Как вы думаете, что означают эти знаки? Выберите своё предположение.'],
      ["I, ve va iks belgilariga qarang.", "Bu belgilarni nima deb o'ylaysiz? Taxminingizni tanlang."],
      ['Look at the symbols I, V and X.', 'What do you think these symbols are? Choose your idea.'],
    ),
    audioTeach: B(
      [
        'Это римские цифры. Число один записывается одним знаком и.',
        'Число два записывается двумя знаками и. Получается и и.',
        'Число три записывается тремя знаками и. Получается и и и.',
        'Число четыре записывается знаками и и вэ. Знак и стоит перед знаком вэ. Получается и вэ.',
        'Число пять записывается одним знаком вэ.',
        'Число шесть записывается знаками вэ и и. Знак и стоит после знака вэ. Получается вэ и.',
        'Число семь записывается знаком вэ и двумя знаками и. Получается вэ и и.',
        'Число восемь записывается знаком вэ и тремя знаками и. Получается вэ и и и.',
        'Число девять записывается знаками и и икс. Знак и стоит перед знаком икс. Получается и икс.',
        'Число десять записывается одним знаком икс.',
        'Сравните четыре и шесть. В четырёх знак и стоит перед вэ. Один вычитается из пяти. В шести и стоит после вэ. Один прибавляется к пяти.',
      ],
      [
        'Bular Rim raqamlari. Bir soni bitta i belgisi bilan yoziladi.',
        "Ikki soni ikkita i belgisi bilan yoziladi. i i hosil bo'ladi.",
        "Uch soni uchta i belgisi bilan yoziladi. i i i hosil bo'ladi.",
        "To'rt soni i va ve belgilari bilan yoziladi. i belgisi ve belgisidan oldin turadi. i ve hosil bo'ladi.",
        'Besh soni bitta ve belgisi bilan yoziladi.',
        "Olti soni ve va i belgilari bilan yoziladi. i belgisi ve belgisidan keyin turadi. ve i hosil bo'ladi.",
        "Yetti soni ve va ikkita i belgisi bilan yoziladi. ve i i hosil bo'ladi.",
        "Sakkiz soni ve va uchta i belgisi bilan yoziladi. ve i i i hosil bo'ladi.",
        "To'qqiz soni i va iks belgilari bilan yoziladi. i belgisi iks belgisidan oldin turadi. i iks hosil bo'ladi.",
        "O'n soni bitta iks belgisi bilan yoziladi.",
        "To'rt va oltini solishtiring. To'rtda i ve belgisidan oldin turadi. Bir beshdan ayriladi. Oltida i ve belgisidan keyin turadi. Bir beshga qo'shiladi.",
      ],
      [
        'These are Roman numerals. One is written with one I symbol.',
        'Two is written with two I symbols. It is read as I I.',
        'Three is written with three I symbols. It is read as I I I.',
        'Four is written with I before V. It is read as I V.',
        'Five is written with one V symbol.',
        'Six is written with I after V. It is read as V I.',
        'Seven is written with V followed by two I symbols. It is read as V I I.',
        'Eight is written with V followed by three I symbols. It is read as V I I I.',
        'Nine is written with I before X. It is read as I X.',
        'Ten is written with one X symbol.',
        'Compare four and six. In four, I comes before V, so one is subtracted from five. In six, I comes after V, so one is added to five.',
      ],
    ),
  },
  s10: {
    eyebrow: B('Исследуем порядок', "Tartibni o'rganamiz", 'Explore order'),
    title: B('Сравните VI и IV: где стоит I и как порядок знаков меняет значение числа?', "VI va IV ni taqqoslang: I belgisi qayerda turadi va belgilar tartibi son qiymatini qanday o'zgartiradi?", 'Compare VI and IV: where is I placed, and how does the symbol order change the number?'),
    conclusion: B('Знак I сохраняет значение 1, а порядок меняет действие.', "I belgisi 1 qiymatini saqlaydi, tartib esa amalni o'zgartiradi.", 'The symbol I keeps the value 1, while the order changes the operation.'),
    audio: B(
      ['В записи числа шесть знак и означает один и прибавляется к пяти.', 'Переместим знак и перед знаком вэ.', 'Знак и по-прежнему означает один.', 'Теперь порядок показывает, что один нужно вычесть из пяти.'],
      ["Ve i Rim yozuvida i belgisining qiymati bir bo'lib, beshga qo'shiladi.", "I belgisini ve belgisining oldiga ko'chiramiz.", "I belgisi hamon birni bildiradi.", "Endi tartib birni beshdan ayirish kerakligini ko'rsatadi."],
      ['In the Roman numeral V I, the symbol I has the value one and is added to five.', 'Now move I before V.', 'The symbol I still represents one.', 'The new order shows that one must be subtracted from five.'],
    ),
  },
  s11: {
    eyebrow: B('Правило', 'Qoida', 'Rule'),
    title: B('Римская запись — пример непозиционной системы', 'Rim yozuvi nopozitsion sistemaga misol', 'Roman numerals are an example of a non-positional system'),
    tabs: [B('Значения знаков', 'Belgilar qiymati', 'Symbol values'), B('Порядок знаков', 'Belgilar tartibi', 'Symbol order'), B('Чтение числа', "Sonni o'qish", 'Read the number')],
    steps: [
      B('I всегда означает 1, V — 5, X — 10.', 'I har doim 1 ni, V 5 ni, X esa 10 ni bildiradi.', 'I always represents 1, V represents 5, and X represents 10.'),
      B('Порядок показывает, складывать или вычитать значения.', "Tartib qiymatlarni qo'shish yoki ayirishni ko'rsatadi.", 'The order shows whether the values are added or subtracted.'),
      B('XIV = 10 + (5 − 1) = 14.', 'XIV = 10 + (5 − 1) = 14.', 'XIV = 10 + (5 − 1) = 14.'),
    ],
    definition: B('В непозиционной системе значение знака не зависит от его места.', "Nopozitsion sistemada belgining qiymati uning o'rniga bog'liq emas.", "In a non-positional system, a symbol's value does not depend on its place."),
    warning: B('Непозиционная не означает, что порядок не важен.', 'Nopozitsion degani tartib muhim emas degani emas.', 'Non-positional does not mean that order is unimportant.'),
    audio: B(
      ['Римская запись служит примером непозиционной системы счисления.', 'Значение каждого знака не зависит от его места.', 'Но порядок по-прежнему важен, потому что он показывает сложение или вычитание.', 'Запись икс, и, вэ читается как десять плюс пять минус один, то есть четырнадцать.'],
      ["Rim yozuvi nopozitsion sanoq sistemasiga misol bo'ladi.", "Har bir belgining qiymati uning o'rniga bog'liq emas.", "Lekin tartib baribir muhim, chunki u qo'shish yoki ayirishni ko'rsatadi.", "Iks i ve yozuvi o'n plyus besh minus bir, ya'ni o'n to'rt deb o'qiladi."],
      ['Roman numerals are an example of a non-positional numeral system.', 'The value of each symbol does not depend on its place.', 'However, order still matters because it shows addition or subtraction.', 'The numeral X I V is read as ten plus five minus one, which is fourteen.'],
    ),
  },
  s12: {
    eyebrow: B('Практика 5', '5-mashq', 'Practice 5'),
    title: B('Сначала изучите римские записи от 11 до 20, затем выполните сопоставление', "Avval 11 dan 20 gacha Rim yozuvlarini o'rganing, keyin moslashtirishni bajaring", 'First learn the Roman numerals from 11 to 20, then complete the matching task'),
    stepOneTitle: B('Шаг 1. Римские цифры от 11 до 20', '1-qadam. 11 dan 20 gacha Rim raqamlari', 'Step 1. Roman numerals from 11 to 20'),
    stepOneLead: B('Числа от 11 до 19 начинаются со знака X. Число 20 записывается двумя знаками X.', "11 dan 19 gacha sonlar X belgisi bilan boshlanadi. 20 soni ikkita X belgisi bilan yoziladi.", 'The numbers from 11 to 19 begin with X. The number 20 is written with two X symbols.'),
    numerals: [
      ['11', 'XI'], ['12', 'XII'], ['13', 'XIII'], ['14', 'XIV'], ['15', 'XV'],
      ['16', 'XVI'], ['17', 'XVII'], ['18', 'XVIII'], ['19', 'XIX'], ['20', 'XX'],
    ],
    toPractice: B('Перейти к заданию', "Mashqqa o'tish", 'Go to the task'),
    stepTwoTitle: B('Шаг 2. Сначала нажмите число слева, затем равную ему римскую запись справа.', "2-qadam. Avval chapdagi sonni, keyin unga teng Rim yozuvini o'ng tomondan bosing.", 'Step 2. Press a number on the left, then press the equal Roman numeral on the right.'),
    hint: B('Проверь значения I, V, X и их порядок.', 'I, V, X qiymatlari va ularning tartibini tekshiring.', 'Check the values of I, V and X and their order.'),
    audio: B(
      ['Одиннадцать записывается икс и, двенадцать икс два знака и, тринадцать икс три знака и, четырнадцать икс и вэ, пятнадцать икс вэ.', 'Шестнадцать записывается икс вэ и, семнадцать икс вэ два знака и, восемнадцать икс вэ три знака и, девятнадцать икс и икс, двадцать двумя знаками икс.'],
      ["O'n bir iks i, o'n ikki iks ikkita i, o'n uch iks uchta i, o'n to'rt iks i ve, o'n besh iks ve bilan yoziladi.", "O'n olti iks ve i, o'n yetti iks ve va ikkita i, o'n sakkiz iks ve va uchta i, o'n to'qqiz iks i iks, yigirma esa ikkita iks bilan yoziladi."],
      ['Eleven is X I, twelve is X I I, thirteen is X I I I, fourteen is X I V, and fifteen is X V.', 'Sixteen is X V I, seventeen is X V I I, eighteen is X V I I I, nineteen is X I X, and twenty is X X.'],
    ),
    taskAudio: B(
      'Теперь выполните сопоставление. Сначала нажмите число слева, затем равную ему римскую запись справа.',
      "Endi moslashtirishni bajaring. Avval chapdagi sonni, keyin unga teng Rim yozuvini o'ng tomondan bosing.",
      'Now complete the matching task. Press a number on the left, then press the equal Roman numeral on the right.',
    ),
  },
  s13: {
    eyebrow: B('Практика 6', '6-mashq', 'Practice 6'),
    title: B('Бит решил, что в записи XIV знак I равен 10. Какое объяснение исправляет ошибку?', "Bit XIV yozuvida I belgisi 10 ga teng deb o'yladi. Qaysi izoh xatoni tuzatadi?", 'Bit thinks the symbol I equals 10 in XIV. Which explanation fixes the mistake?'),
    claim: B('I = 10', 'I = 10', 'I = 10'),
    options: [
      B('I всегда означает 1; перед V он показывает вычитание.', "I har doim 1 ni bildiradi; V dan oldin u ayirishni ko'rsatadi.", 'I always represents 1; before V it shows subtraction.'),
      B('I здесь означает 10, а X означает 1.', 'I bu yerda 10 ni, X esa 1 ni bildiradi.', 'Here I represents 10, while X represents 1.'),
      B('Все знаки нужно сложить, поэтому XIV равно 16.', "Barcha belgilarni qo'shish kerak, shuning uchun XIV 16 ga teng.", 'All the symbols must be added, so XIV equals 16.'),
    ],
    correct: 0,
    feedback: [
      B('Правильно. Значение I осталось равным 1, а положение перед V показало вычитание.', "To'g'ri. I ning qiymati 1 bo'lib qoldi, V dan oldingi o'rni esa ayirishni ko'rsatdi.", 'Correct. I kept the value 1, while its place before V showed subtraction.'),
      B('Значения знаков не меняются местами. I означает 1, а X означает 10.', "Belgilar qiymati o'rin almashmaydi. I 1 ni, X esa 10 ni bildiradi.", 'The symbol values do not swap. I represents 1, while X represents 10.'),
      B('Когда меньший знак I стоит перед V, единица вычитается. Поэтому часть IV равна 4.', 'Kichik I belgisi V dan oldin tursa, bir ayriladi. Shuning uchun IV qismi 4 ga teng.', 'When the smaller symbol I comes before V, one is subtracted. So the part IV equals 4.'),
    ],
    feedbackAudio: B(
      ['Верно. И всегда означает один, а перед вэ показывает вычитание.', 'Значения знаков не меняются местами. И означает один, а икс означает десять.', 'Проверь порядок и и вэ. Один нужно вычесть из пяти.'],
      ["To'g'ri. I har doim birni bildiradi, ve dan oldin esa ayirishni ko'rsatadi.", "Belgilar qiymati o'rin almashmaydi. I birni, iks esa o'nni bildiradi.", "I va ve tartibini tekshiring. Birni beshdan ayirish kerak."],
      ['Correct. I always represents one, and before V it shows subtraction.', 'The symbol values do not swap. I represents one, while X represents ten.', 'Check the order of I and V. One must be subtracted from five.'],
    ),
    audio: B(
      ['Бит решил, что в записи икс и вэ знак и стал равен десяти.', 'Выбери объяснение, которое первым исправляет эту ошибку.'],
      ["Bit iks i ve yozuvida i belgisi o'nga aylandi, deb o'yladi.", "Bu xatoni birinchi bo'lib tuzatadigan izohni tanlang."],
      ['Bit decided that the symbol I became ten in the numeral X I V.', 'Choose the explanation that fixes this mistake first.'],
    ),
  },
  s14: {
    eyebrow: B('Сравнение систем', 'Sistemalarni taqqoslash', 'Compare the systems'),
    title: B('Что делает место в двух системах?', "Ikki sistemada o'rin nima qiladi?", 'What does place do in the two systems?'),
    decimal: B('Значение цифры меняется', "Raqam qiymati o'zgaradi", "The digit's value changes"),
    roman: B('Значение знака сохраняется, действие меняется', "Belgi qiymati saqlanadi, amal o'zgaradi", "The symbol's value stays the same; the operation changes"),
    audio: B(
      ['В десятичной записи перестановка изменила значение каждой цифры.', 'В римской записи знак и сохранил значение один.', 'Порядок римских знаков изменил действие со сложения на вычитание.', 'Сравни обе модели и назови главное различие.'],
      ["O'nlik yozuvda o'rin almashishi har bir raqamning qiymatini o'zgartirdi.", "Rim yozuvida i belgisi bir qiymatini saqladi.", "Rim belgilarining tartibi amalni qo'shishdan ayirishga o'zgartirdi.", "Ikki modelni taqqoslab, asosiy farqni aniqlang."],
      ['In decimal notation, swapping the digits changed the value of each digit.', 'In the Roman numeral, the symbol I kept the value one.', 'The order of the Roman symbols changed the operation from addition to subtraction.', 'Compare the two models and identify the main difference.'],
    ),
  },
  s15: {
    eyebrow: B('Стратегия', 'Strategiya', 'Strategy'),
    title: B('Выбери способ чтения для каждой системы', "Har bir sistema uchun o'qish usulini tanlang", 'Choose a reading method for each system'),
    methods: [
      B('Разложить по разрядам', 'Xonalarga ajratish', 'Split into place values'),
      B('Проверить значения и порядок знаков', 'Belgilar qiymati va tartibini tekshirish', 'Check the symbol values and order'),
    ],
    retry: B('Попробовать ещё раз', "Qayta joylashtirish", 'Try again'),
    audio: B(
      ['Код четыреста четыре записан десятичными цифрами, поэтому его читаем по разрядам.', 'Код икс и вэ записан римскими знаками, поэтому проверяем значения знаков и их порядок.', 'Сначала определи систему, затем выбери подходящий способ чтения.'],
      ["To'rt yuz to'rt kodi o'nlik raqamlar bilan yozilgan, shuning uchun uni xonalar bo'yicha o'qiymiz.", "Iks i ve kodi Rim belgilari bilan yozilgan, shuning uchun belgilar qiymati va ularning tartibini tekshiramiz.", "Avval sistemani aniqlang, keyin mos o'qish usulini tanlang."],
      ['The code four hundred and four uses decimal digits, so read it by place value.', 'The code X I V uses Roman symbols, so check the symbol values and their order.', 'Identify the system first, then choose the matching reading method.'],
    ),
  },
  s16: {
    eyebrow: B('Финальная миссия', 'Yakuniy missiya', 'Final mission'),
    title: B('Теперь место цифры раскрывает код', "Endi raqamning o'rni kodni ochadi", "Now a digit's place reveals the code"),
    points: [
      B('Позиция — это место цифры в записи числа.', "Pozitsiya raqamning son yozuvidagi o'rnidir.", "Position is a digit's place in a numeral."),
      B('В позиционной системе значение цифры зависит от места.', "Pozitsion sistemada raqam qiymati uning o'rniga bog'liq.", "In a positional system, a digit's value depends on its place."),
      B('В непозиционной системе знак сохраняет значение, а порядок может менять действие.', "Nopozitsion sistemada belgi qiymatini saqlaydi, tartib esa amalni o'zgartirishi mumkin.", 'In a non-positional system, a symbol keeps its value, while order can change the operation.'),
      B('27 = 20 + 7, а 72 = 70 + 2. Поэтому коды не равны.', '27 = 20 + 7, 72 = 70 + 2. Shuning uchun kodlar teng emas.', '27 = 20 + 7, while 72 = 70 + 2. Therefore, the codes are not equal.'),
    ],
    bridge: B('Сложение и вычитание многозначных чисел', "Ko'p xonali sonlarni qo'shish va ayirish", 'Adding and subtracting multi-digit numbers'),
    audio: B(
      ['Позиция показывает место цифры в записи числа.', 'В десятичной позиционной системе значение цифры зависит от этого места.', 'В римской непозиционной системе знак сохраняет значение, а порядок показывает действие.', 'Двадцать семь состоит из двадцати и семи, а семьдесят два состоит из семидесяти и двух. Поэтому коды не равны.', 'Следующая тема применит эти знания при сложении и вычитании многозначных чисел.'],
      ["Pozitsiya raqamning son yozuvidagi o'rnini ko'rsatadi.", "O'nlik pozitsion sistemada raqam qiymati shu o'ringa bog'liq.", "Rim nopozitsion sistemasida belgi qiymatini saqlaydi, tartib esa amalni ko'rsatadi.", "Yigirma yetti yigirma va yettidan, yetmish ikki esa yetmish va ikkidan tuzilgan. Shuning uchun kodlar teng emas.", "Keyingi mavzuda bu bilimlar ko'p xonali sonlarni qo'shish va ayirishda qo'llanadi."],
      ["Position shows a digit's place in a numeral.", "In the decimal positional system, a digit's value depends on that place.", 'In the Roman non-positional system, a symbol keeps its value, while the order shows the operation.', 'Twenty-seven is made of twenty and seven, while seventy-two is made of seventy and two. Therefore, the codes are not equal.', 'The next topic uses these ideas when adding and subtracting multi-digit numbers.'],
    ),
  },
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story-decision', goal: 'Choose the place-value check that can distinguish 27 from 72.', template: 'HookChoice', active: true, scored: false, scope: 'hook', resetOnReturn: true, misconceptions: ['equal digits always make equal numbers', 'digit sum determines number value'] },
  { id: 's1', type: 'exploration', subtype: 'position-foundation', goal: 'Connect position with hundreds, tens and ones in 272.', template: 'PlaceValueTable', active: true, scored: false, scope: null, resetOnReturn: true, misconceptions: [] },
  { id: 's2', type: 'exploration', subtype: 'place-value-order', goal: 'Order 700, 70 and 7 by swapping two selected cards.', template: 'TapSwapOrder', active: true, scored: false, scope: null, resetOnReturn: true, misconceptions: [] },
  { id: 's3', type: 'test', subtype: 'choice', goal: 'Identify the place and value of 2 in 5,284.', template: 'MCScreen', active: true, scored: true, scope: 'module-mikro', resetOnReturn: false, misconceptions: ['place shifted left', 'place shifted right', 'face value only'] },
  { id: 's4', type: 'test', subtype: 'choice', goal: 'Choose the correct place-value expansion of 444.', template: 'MCScreen', active: true, scored: true, scope: 'module-mikro', resetOnReturn: false, misconceptions: ['all equal digits have equal values', 'hundreds omitted', 'tens treated as ones'] },
  { id: 's5', type: 'exploration', subtype: 'decimal-swap', goal: 'Observe that swapping digits changes their values and the whole number.', template: 'ModelToggle', active: true, scored: false, scope: null, resetOnReturn: true, misconceptions: [] },
  { id: 's6', type: 'rule', subtype: 'positional-system', goal: 'State and apply the rule of a positional numeral system.', template: 'RuleBuilder', active: true, scored: false, scope: null, resetOnReturn: true, misconceptions: [] },
  { id: 's7', type: 'test', subtype: 'choice', goal: 'Find the value of the left-hand 7 in 707.', template: 'MCScreen', active: true, scored: true, scope: 'module-mikro', resetOnReturn: false, misconceptions: ['face value only', 'one-place shift', 'whole-number confusion'] },
  { id: 's8', type: 'error', subtype: 'error-repair', goal: 'Repair the claim that 63 and 36 are equal.', template: 'ErrorChoice', active: true, scored: true, scope: 'module-mikro', resetOnReturn: false, misconceptions: ['same digits mean same number', 'same digit sum means equal numbers'] },
  { id: 's9', type: 'exploration', subtype: 'roman-hypothesis-and-table', goal: 'Record a neutral hypothesis, then learn Roman numerals from 1 to 10.', template: 'TwoStepTheory', active: true, scored: false, scope: null, resetOnReturn: true, misconceptions: [] },
  { id: 's10', type: 'exploration', subtype: 'roman-order', goal: 'Observe that Roman order changes the operation, not the symbol value.', template: 'ModelToggle', active: true, scored: false, scope: null, resetOnReturn: true, misconceptions: [] },
  { id: 's11', type: 'rule', subtype: 'nonpositional-system', goal: 'State the non-positional rule and the role of order in Roman numerals.', template: 'StrategyTabs', active: true, scored: false, scope: null, resetOnReturn: true, misconceptions: [] },
  { id: 's12', type: 'matching', subtype: 'roman-teach-and-match', goal: 'Learn Roman numerals from 11 to 20, then match selected examples.', template: 'TwoStepMatchingBoard', active: true, scored: true, scope: 'final', resetOnReturn: false, misconceptions: ['IV and VI reversed', 'IX and XI reversed', 'XIV read as XVI'] },
  { id: 's13', type: 'error', subtype: 'error-repair', goal: 'Repair the transfer of decimal place-value rules to XIV.', template: 'ErrorChoice', active: true, scored: true, scope: 'final', resetOnReturn: false, misconceptions: ['I becomes ten', 'all symbols are added'] },
  { id: 's14', type: 'exploration', subtype: 'system-comparison', goal: 'Compare the role of place in decimal and Roman notation.', template: 'CompareTabs', active: true, scored: false, scope: null, resetOnReturn: true, misconceptions: [] },
  { id: 's15', type: 'strategy', subtype: 'life-transfer', goal: 'Choose the correct reading method for 404 and XIV.', template: 'MethodMatch', active: true, scored: false, scope: null, resetOnReturn: true, misconceptions: ['one reading method fits both systems'] },
  { id: 's16', type: 'summary', subtype: 'title-claim', goal: 'Resolve the opening code problem and summarise both numeral systems.', template: 'TitleClaim', mechanic: 'title-claim', active: true, scored: false, scope: null, resetOnReturn: false, misconceptions: ['rules can be applied before identifying the system'] },
];

const TOTAL_SCREENS = 17;
const MOBILE_DESIGN_W = 390;
const LESSON_META = {
  lessonId: 'num-4-07-v1',
  slug: 'dars07-pozitsion-va-nopozitsion-sanoq-sistemalari',
  lessonTitle: B('Урок 7. Позиционные и непозиционные системы счисления', '7-dars. Pozitsion va nopozitsion sanoq sistemalari', 'Lesson 7. Positional and non-positional numeral systems'),
  skillTags: ['roman_1_20', 'positional_system', 'nonpositional_system', 'system_comparison'],
  finalReflectionRequired: false,
};

let runtimeConfig = {
  ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', studentName: '', voiceGender: 'f',
  previewMode: false,
};
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };

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
    this.lang = 'uz';
    this.muted = false;
    this.isPlaying = false;
    this.onStateChange = null;
  }

  emit(extra = {}) {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        muted: this.muted,
        ...extra,
      });
    }
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
      this.emit({ completed: true });
      return;
    }
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
      const promise = audio.play();
      if (promise && typeof promise.then === 'function') {
        promise.then(() => {
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

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      done?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = SPEECH_LOCALES[this.lang] ?? SPEECH_LOCALES.uz;
    utterance.rate = 0.94;
    utterance.onstart = () => {
      this.isPlaying = true;
      this.emit({ currentSegment: id });
    };
    utterance.onend = () => {
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    utterance.onerror = () => {
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    this.previewUtterance = utterance;
    this.previewTimer = window.setTimeout(() => {
      this.previewTimer = null;
      try {
        window.speechSynthesis.speak(utterance);
      } catch {
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
    if (this.muted) this.stop(false);
    this.emit({ completed: this.muted });
  }

  stop(emit = true) {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.onended = null;
        this.audio.onerror = null;
      } catch {
        // no-op
      }
    }
    if (this.previewTimer !== null && typeof window !== 'undefined') {
      window.clearTimeout(this.previewTimer);
      this.previewTimer = null;
    }
    if (runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // no-op
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

const localizedSegments = (audioValue, lang, prefix) => {
  if (!audioValue) return [];
  const localized = audioValue[lang] ?? '';
  const values = Array.isArray(localized) ? localized : [localized];
  return values.filter(Boolean).map((text, index) => ({ id: `${prefix}-${index}`, text }));
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

  /* eslint-disable react-hooks/refs -- required audio segment stabilizer; prevents cancel/restart loops */
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
    engine.onStateChange = (next) => setState((prev) => ({ ...prev, ...next }));
    engine.emit({ completed: engine.muted, currentSegment: null });
    if (stableSegments?.length && !engine.muted) {
      engine.loadQueue(stableSegments);
      const timer = setTimeout(() => engine.start(), 250);
      return () => {
        clearTimeout(timer);
        engine.stop(false);
      };
    }
    return () => engine.stop(false);
  }, [stableSegments, lang]);

  return {
    ...state,
    replay: () => {
      const engine = getAudioEngine();
      if (!engine) return;
      setState((prev) => ({ ...prev, completed: engine.muted, currentSegment: null }));
      engine.loadQueue(stableSegments);
      engine.start();
    },
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

function useNarratedSequence(screen, audioValue, beatCount, interval = 1050) {
  const lang = useLang();
  const [run, setRun] = useState(0);
  const segments = useMemo(
    () => localizedSegments(audioValue, lang, `s${screen}`),
    [audioValue, lang, screen],
  );
  const baseAudio = useAudio(segments);
  const [timeline, setTimeline] = useState({ run: 0, beat: 0 });

  useEffect(() => {
    const timers = Array.from({ length: Math.max(0, beatCount - 1) }, (_, index) => (
      window.setTimeout(() => setTimeline({ run, beat: index + 1 }), 520 + ((index + 1) * interval))
    ));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [beatCount, interval, run, lang, screen]);

  const narratedBeat = typeof baseAudio.currentSegment === 'string'
    && baseAudio.currentSegment.startsWith(`s${screen}-`)
    ? Number(baseAudio.currentSegment.split('-').pop())
    : null;
  const replay = useCallback(() => {
    setRun((value) => value + 1);
    baseAudio.replay();
  }, [baseAudio]);

  const timedBeat = timeline.run === run ? timeline.beat : 0;
  return [{ ...baseAudio, sequenceRun: run, replay }, Number.isFinite(narratedBeat) ? narratedBeat : timedBeat];
}

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

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try {
    const sound = new Audio(url);
    sound.volume = 0.6;
    sound.play()?.catch?.(() => {});
  } catch {
    // Sound effects never block the lesson.
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

const AudioIndicator = ({ audio }) => {
  const t = useT();
  const muteLabel = audio.muted
    ? t(B('Включить звук', 'Ovozni yoqish', 'Turn sound on'))
    : t(B('Выключить звук', "Ovozni o'chirish", 'Turn sound off'));
  const replayLabel = t(B('Повторить', 'Qayta eshitish', 'Replay'));
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
    hook: B('Миссия', 'Missiya', 'Mission'),
    diagnostic: B('Диагностика', 'Diagnostika', 'Diagnostic'),
    exploration: B('Исследование', 'Kashfiyot', 'Explore'),
    rule: B('Правило', 'Qoida', 'Rule'),
    practice: B('Практика', 'Mashq', 'Practice'),
    test: B('Проверка', 'Tekshiruv', 'Check'),
    case: B('Задача', 'Vazifa', 'Problem'),
    summary: B('Итог', 'Yakun', 'Summary'),
  };
  const semanticType = aliases[type] ?? type;
  return <span className="screen-type">{labels[semanticType] ? t(labels[semanticType]) : type}</span>;
};

const NavBack = ({ onClick, hidden = false }) => {
  const t = useT();
  return (
    <button type="button" className={`btn btn-ghost ${hidden ? 'nav-hidden' : ''}`} onClick={onClick} disabled={hidden}>
      <span aria-hidden="true">←</span> {t(CONTENT.common.back)}
    </button>
  );
};

const NavNext = ({ onClick, finish = false, disabled = false }) => {
  const t = useT();
  const isDisabled = !canUseGrade4TheoryContinue(!disabled, finish);
  return (
    <button type="button" className={`btn btn-white-accent ${isDisabled ? '' : 'btn-ready'}`} onClick={onClick} disabled={isDisabled} aria-disabled={isDisabled}>
      {t(finish ? CONTENT.common.finish : CONTENT.common.next)} <span aria-hidden="true">{finish ? '✓' : '→'}</span>
    </button>
  );
};

const FeedbackBlock = ({ show, correct, children }) => {
  const t = useT();
  return (
    <div
      className={`feedback feedback-slot ${show ? 'feedback-slot-visible' : 'feedback-slot-hidden'} ${correct ? 'feedback-correct' : 'feedback-wrong'}`}
      data-g4-role={correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame'}
      data-g4-feedback={show ? (correct ? 'solution' : 'wrong') : undefined}
      role="status"
      aria-hidden={!show}
    >
      <div className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'} /></div>
      <div className="feedback-copy">
        <strong>{t(correct ? B('РЕШЕНИЕ', 'YECHIM', 'SOLUTION') : B('ЕЩЁ РАЗ', 'QAYTA URINISH', 'TRY AGAIN'))}</strong>
        <div>{children}</div>
      </div>
    </div>
  );
};

// Canonical Bit copied from the local grade 4 Dars01 visual contract.
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

const SceneBit = ({ state = 'point', className = '' }) => (
  <div className={`scene-bit ${className}`} aria-hidden="true">
    <BitSVG state={state} />
  </div>
);

const PlaceValueBatteryDefs = () => (
  <defs>
    <linearGradient id="g4D7BatteryBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#0E6E96" />
      <stop offset="22%" stopColor="#43B6E0" />
      <stop offset="50%" stopColor="#8FE0F4" />
      <stop offset="74%" stopColor="#2FA0CC" />
      <stop offset="100%" stopColor="#0A5876" />
    </linearGradient>
    <linearGradient id="g4D7BatteryCap" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#8FA0AE" />
      <stop offset="35%" stopColor="#EEF3F7" />
      <stop offset="65%" stopColor="#C6D2DB" />
      <stop offset="100%" stopColor="#7E93A2" />
    </linearGradient>
    <linearGradient id="g4D7BatteryBand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#B23A26" />
      <stop offset="30%" stopColor="#FF7A5E" />
      <stop offset="100%" stopColor="#C7401F" />
    </linearGradient>
    <linearGradient id="g4D7CassetteBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#4E5E82" />
      <stop offset="24%" stopColor="#7385AB" />
      <stop offset="52%" stopColor="#8C9EC4" />
      <stop offset="76%" stopColor="#63739A" />
      <stop offset="100%" stopColor="#4E5E82" />
    </linearGradient>
  </defs>
);

const PlaceValueBatterySvg = ({ x, y, width, height, className = '', unitIndex }) => (
  <svg
    className={`place-battery-svg ${className}`}
    x={x}
    y={y}
    width={width}
    height={height}
    viewBox="0 0 22 34"
    overflow="visible"
    data-g4-place-value-kind="one"
    data-g4-place-value-index={unitIndex}
  >
    <rect x="8" y="0.6" width="6" height="3.6" rx="1.5" fill="url(#g4D7BatteryCap)" stroke="#6E828F" strokeWidth="0.6" />
    <rect x="9.4" y="0.2" width="3.2" height="1.4" rx="0.7" fill="#F4F8FA" />
    <rect x="1.4" y="4" width="19.2" height="29.4" rx="4.2" fill="url(#g4D7BatteryBody)" stroke="#093F55" strokeWidth="1" />
    <rect x="1.4" y="4" width="19.2" height="29.4" rx="4.2" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
    <rect x="1.4" y="12.5" width="19.2" height="9" fill="url(#g4D7BatteryBand)" opacity="0.95" />
    <path d="M12.6 14L8.8 20.4h2.4l-1.4 5.2 4.6-7.2h-2.6z" fill="#FFE9A6" stroke="#D89A18" strokeWidth="0.4" />
    <rect x="3.4" y="6" width="2.4" height="25" rx="1.2" fill="rgba(255,255,255,0.4)" />
    <rect x="16.4" y="6" width="1.4" height="25" rx="0.7" fill="rgba(0,0,0,0.18)" />
  </svg>
);

const PlaceValueCassetteSvg = ({ x, y, width, height, className = '', unitIndex }) => (
  <svg
    className={`place-cassette-svg ${className}`}
    x={x}
    y={y}
    width={width}
    height={height}
    viewBox="0 0 48 66"
    overflow="visible"
    data-g4-place-value-kind="ten"
    data-g4-place-value-index={unitIndex}
  >
    <rect x="1" y="4" width="46" height="61" rx="7" fill="url(#g4D7CassetteBody)" stroke="#33415F" strokeWidth="1.4" />
    <rect x="1" y="4" width="46" height="61" rx="7" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.7" />
    <g fill="rgba(0,0,0,0.22)">
      <rect x="3.4" y="18" width="2" height="30" rx="1" />
      <rect x="42.6" y="18" width="2" height="30" rx="1" />
    </g>
    <g fill="#8494AE">
      <circle cx="6" cy="9.5" r="1.3" /><circle cx="42" cy="9.5" r="1.3" />
      <circle cx="6" cy="60" r="1.3" /><circle cx="42" cy="60" r="1.3" />
    </g>
    <rect x="17" y="6.6" width="14" height="5.2" rx="2.6" fill="#0C121F" stroke="#2A3550" strokeWidth="0.6" />
    <circle cx="24" cy="9.2" r="2" fill="#6EF29B" stroke="#10182A" strokeWidth="0.6" />
    <circle cx="24" cy="9.2" r="4.4" fill="rgba(110,242,155,0.4)" />
    {Array.from({ length: 10 }, (_, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      return (
        <g key={index} transform={`translate(${6.5 + column * 19.5} ${16 + row * 9.4})`}>
          <rect width="15" height="7.4" rx="2.4" fill="#33415F" stroke="#5A6B88" strokeOpacity=".25" strokeWidth="0.5" />
          <rect x="1" y="1" width="13" height="5.4" rx="1.8" fill="url(#g4D7BatteryBody)" stroke="#093F55" strokeWidth="0.4" />
          <rect x="1.8" y="1.6" width="11.4" height="1.5" rx="0.7" fill="rgba(255,255,255,0.3)" />
        </g>
      );
    })}
  </svg>
);

const PlaceValueCityIllustration = ({ moved }) => {
  const cassettePositions = moved ? [83, 147, 211, 275] : [116];
  const batteryPositions = moved ? [363] : [204, 246, 288, 330];
  return (
    <div
      className={`place-value-city ${moved ? 'place-value-city-moved' : ''}`}
      data-g4-place-value-state={moved ? '41' : '14'}
      aria-hidden="true"
    >
      <svg viewBox="0 0 520 105" role="presentation">
        <PlaceValueBatteryDefs />
        <path d="M20 91H500" stroke="#173B52" strokeOpacity=".16" strokeWidth="3" strokeLinecap="round" />
        {cassettePositions.map((x, index) => (
          <PlaceValueCassetteSvg key={`ten-${index}`} className="place-quantity-ten" x={x} y="11" width="58" height="80" unitIndex={index} />
        ))}
        {batteryPositions.map((x, index) => (
          <PlaceValueBatterySvg key={`one-${index}`} className="place-quantity-one" x={x} y="39" width="34" height="52" unitIndex={index} />
        ))}
      </svg>
      <SceneBit state={moved ? 'nod' : 'focus'} className="place-value-bit" />
    </div>
  );
};

const StrategyScannerIllustration = ({ beat }) => (
  <div className={`strategy-scanner scanner-beat-${beat}`} data-g4-role="visual-frame" aria-hidden="true">
    <SceneBit state={beat >= 2 ? 'nod' : 'point'} className="strategy-scanner-bit" />
    <svg viewBox="0 0 420 86" role="presentation">
      <rect x="30" y="19" width="136" height="50" rx="14" fill="#173B52" />
      <rect x="254" y="19" width="136" height="50" rx="14" fill="#173B52" />
      <path d="M166 44H254" stroke="#95C93D" strokeWidth="4" strokeDasharray="8 7" />
      <circle className="scanner-pulse" cx={beat >= 1 ? 244 : 176} cy="44" r="9" fill="#FF5B35" />
      <path d="M58 44h77M282 44h77" stroke="#5BD6F2" strokeOpacity=".58" strokeWidth="4" strokeLinecap="round" />
      <path d="M58 54h48M282 54h48" stroke="#5BD6F2" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

const Stage = ({ screen, eyebrow, title, audio, children, onPrev, onNext, finish = false, nextDisabled = false }) => {
  const t = useT();
  const isMobile = useIsMobile();
  const pad = isMobile ? 14 : 48;
  const meta = SCREEN_META[screen];

  return (
    <main className={`stage stage-${meta.type}`}>
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}>
          <div className="progress-fill progress-bar" style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }} />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title"><span className="status-dot" aria-hidden="true" /><span>{t(eyebrow)}</span></div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={meta.type} />
            {audio && <AudioIndicator audio={audio} />}
            <span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span>
          </div>
        </div>
      </header>
      <section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="stage-fit">
          {title && <h1>{t(title)}</h1>}
          {children}
        </div>
      </section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>
        <NavBack onClick={onPrev} hidden={screen === 0} />
        <NavNext onClick={onNext} finish={finish} disabled={nextDisabled} />
      </footer>
    </main>
  );
};

const TheoryStage = ({ screen, contentScreen = screen, children, onPrev, onNext, beatCount, interval, nextDisabled = false }) => {
  const c = CONTENT[`s${contentScreen}`];
  const t = useT();
  const [audio, beat] = useNarratedSequence(screen, c.audio, beatCount, interval);
  const audioReady = audio.muted || audio.completed;
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} title={c.title} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={nextDisabled || !audioReady}>
      {children({ beat, audio, t })}
    </Stage>
  );
};

const Screen0 = ({ screen, storedAnswer, onPrev, onNext, onAnswer }) => {
  const c = CONTENT.s0;
  const t = useT();
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const optionOrder = buildOptionOrder(c.options.length, 0, LESSON_META.lessonId, 0);
  const [audio] = useNarratedSequence(screen, c.audio, 3, 1250);
  const canChoose = audio.muted || audio.completed;
  const narrationLocked = !canChoose && !solved;
  const choose = (index) => {
    if (!canChoose || solved) return;
    const nextAttempts = attempts + 1;
    const isCorrect = index === 0;
    setPicked(index);
    setAttempts(nextAttempts);
    setSolved(isCorrect);
    playSfx(isCorrect ? 'correct' : 'wrong');
    const feedbackAudio = isCorrect
      ? B('Верно. Сначала нужно проверить место каждой цифры. Ответ найдём в конце урока.', "To'g'ri. Avval har bir raqamning o'rnini tekshirish kerak. Javobni dars oxirida topamiz.", 'Correct. First, check the place of each digit. We will find the answer at the end of the lesson.')
      : index === 1
        ? B('Сумма цифр совпадает, но она не показывает значение всего числа. Проверь места цифр.', "Raqamlar yig'indisi teng, lekin u butun sonning qiymatini ko'rsatmaydi. Raqamlarning o'rnini tekshiring.", 'The digit sums are equal, but that does not show the value of the whole number. Check the digit places.')
        : B('Одинаковый набор цифр ещё не делает числа равными. Проверь, где стоит каждая цифра.', "Bir xil raqamlar to'plami sonlarni hali teng qilmaydi. Har bir raqam qayerda turganini tekshiring.", "Using the same digits does not make the numbers equal. Check where each digit stands.");
    audio.pushOneOff(t(feedbackAudio));
    onAnswer?.({ stage: 'hook', screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: 0,
      correctAnswer: t(c.options[0]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: isCorrect,
      firstTry: isCorrect && nextAttempts === 1, attempts: nextAttempts });
  };
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} title={null} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved}>
      <div className="hook-screen" data-g4-screen="hook" data-g4-mechanic="HookChoice">
      <header className="hook-contract-intro">
        <span data-g4-role="hook-topic">{t(c.eyebrow)}</span>
        <h1 data-g4-role="hook-title">{t(c.title)}</h1>
        <h2 data-g4-role="hook-question">{t(c.question)}</h2>
      </header>
      <div className="hook-scene" data-g4-role="hook-scene visual-frame">
        <div className="hook-bit" data-g4-role="hook-bit"><BitSVG state={solved ? 'nod' : picked !== null ? 'think' : 'present'} /></div>
        <div className="hook-code-panel" aria-label="27 va 72">
          <span className="hook-code-label">LUMO CITY · 27 / 72</span>
          <div className="hook-code-values">
            <strong>27</strong><i aria-hidden="true">?</i><strong>72</strong>
          </div>
          <div className="hook-code-digits" aria-hidden="true">
            <span>2</span><span>7</span><b>↔</b><span>7</span><span>2</span>
          </div>
        </div>
      </div>
      <div className="choice-grid">
        {optionOrder.map((sourceIndex, displayIndex) => (
          <button
            type="button"
            key={sourceIndex}
            className={`choice-card ${picked === sourceIndex ? 'choice-picked' : ''} ${solved && sourceIndex === 0 ? 'choice-correct' : ''}`}
            data-g4-role="answer-card"
            data-g4-branch="choice"
            data-g4-source-index={sourceIndex}
            data-g4-correct={sourceIndex === 0 ? 'true' : 'false'}
            data-g4-narration-locked={narrationLocked ? 'true' : undefined}
            aria-pressed={picked === sourceIndex}
            disabled={!canChoose || solved}
            onClick={() => choose(sourceIndex)}
          >
            <span className="choice-letter">{String.fromCharCode(65 + displayIndex)}</span>
            <span>{t(c.options[sourceIndex])}</span>
          </button>
        ))}
      </div>
      <FeedbackBlock show={picked !== null} correct={solved}>
        {solved
          ? t(B('Проверка места цифр — верная стратегия. Равны ли коды, докажем в финале.', "Raqamlar o'rnini tekshirish to'g'ri strategiya. Kodlar teng yoki teng emasligini yakunda isbotlaymiz.", 'Checking the digit places is the correct strategy. We will prove whether the codes are equal in the finale.'))
          : picked === 1
            ? t(B('Сумма цифр в обоих кодах равна 9, но разные числа могут иметь одинаковую сумму цифр. Проверь места цифр.', "Ikkala kodda ham raqamlar yig'indisi 9, lekin turli sonlarning raqamlar yig'indisi bir xil bo'lishi mumkin. Raqamlarning o'rnini tekshiring.", 'Both codes have a digit sum of 9, but different numbers can have the same digit sum. Check the digit places.'))
            : t(B('Набор цифр совпадает, но их порядок различается. Проверь место каждой цифры, а не только её вид.', "Raqamlar to'plami bir xil, lekin ularning tartibi boshqa. Faqat raqamning ko'rinishini emas, har bir raqamning o'rnini tekshiring.", "The same digits are used, but their order is different. Check each digit's place, not only its shape."))}
      </FeedbackBlock>
      </div>
    </Stage>
  );
};

const Screen1 = (props) => {
  const [selected, setSelected] = useState(null);
  const [seen, setSeen] = useState([]);
  const reveal = (index) => {
    setSelected(index);
    setSeen((previous) => (previous.includes(index) ? previous : [...previous, index]));
  };
  return (
    <TheoryStage {...props} screen={props.screen} contentScreen={1} beatCount={3} interval={1150} nextDisabled={seen.length !== 3}>
      {({ audio, t }) => {
        const c = CONTENT.s1;
        const digits = ['2', '7', '2'];
        const audioReady = audio.muted || audio.completed;
        return (
          <div className="position-foundation" data-g4-mechanic="PlaceValueTable">
            <div className="position-number main-light-blue-frame" data-g4-role="visual-frame">
              <span className="listen-first-note">{t(c.listenFirst)}</span>
              <SceneBit state={seen.length === 3 ? 'nod' : 'point'} className="position-bit" />
              <span className="position-number-label">272</span>
              <p>{t(c.instruction)}</p>
            </div>
            <div className="position-place-grid">
              {digits.map((digit, index) => {
                const isSeen = seen.includes(index);
                return (
                  <button
                    type="button"
                    key={`${digit}-${index}`}
                    className={`position-place-card ${selected === index ? 'position-place-active' : ''} ${isSeen ? 'position-place-seen' : ''}`}
                    aria-pressed={selected === index}
                    disabled={!audioReady}
                    onClick={() => reveal(index)}
                  >
                    <strong>{digit}</strong>
                    <span>{isSeen ? t(c.places[index]) : '\u2026'}</span>
                    <small>{isSeen ? t(c.values[index]) : t(c.instruction)}</small>
                  </button>
                );
              })}
            </div>
            <div className={`conclusion-band ${seen.length === 3 ? 'reveal-visible' : ''}`}>{t(c.conclusion)}</div>
          </div>
        );
      }}
    </TheoryStage>
  );
};

const Screen2 = (props) => {
  const c = CONTENT.s2;
  const t = useT();
  const [cards, setCards] = useState(c.steps);
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [message, setMessage] = useState('');

  const swapCards = (index, audio) => {
    if (solved) return;
    if (selected === null) {
      setSelected(index);
      setMessage(t(c.selectionHint));
      return;
    }
    if (selected === index) {
      setSelected(null);
      setMessage('');
      return;
    }
    const nextCards = [...cards];
    [nextCards[selected], nextCards[index]] = [nextCards[index], nextCards[selected]];
    const correct = nextCards.map((item) => item.number).join(',') === '700,70,7';
    setCards(nextCards);
    setSelected(null);
    setSolved(correct);
    if (correct) {
      const successAudio = B(
        'Карточки расположены верно. Семьсот, семьдесят, семь.',
        "Kartalar to'g'ri joylashdi. Yetti yuz, yetmish, yetti.",
        'The cards are in the correct order. Seven hundred, seventy, seven.',
      );
      setMessage(t(c.conclusion));
      playSfx('correct');
      audio.pushOneOff(t(successAudio));
    } else {
      setMessage(t(B('Порядок пока неверный. Выберите ещё две карточки.', "Tartib hali noto'g'ri. Yana ikkita kartani tanlang.", 'The order is not correct yet. Select two more cards.')));
    }
  };

  return (
    <TheoryStage {...props} screen={props.screen} contentScreen={2} beatCount={2} interval={1200} nextDisabled={!solved}>
      {({ audio }) => {
        const audioReady = audio.muted || audio.completed;
        return (
          <div className="place-ladder place-order main-light-blue-frame" data-g4-role="visual-frame" data-g4-mechanic="TapSwapOrder">
            <p className="place-ladder-instruction">{t(c.instruction)}</p>
            <p className="place-order-hint">{t(c.selectionHint)}</p>
            <div className="place-ladder-track">
              {cards.map((step, index) => (
                <button
                  type="button"
                  key={step.number}
                  className={`place-ladder-step ${selected === index ? 'place-ladder-active' : ''} ${solved ? 'place-ladder-seen' : ''}`}
                  aria-pressed={selected === index}
                  disabled={!audioReady || solved}
                  onClick={() => swapCards(index, audio)}
                >
                  <small>{t(step.place)}</small>
                  <strong>{step.number}</strong>
                  <span>{step.value}</span>
                </button>
              ))}
            </div>
            <div className={`conclusion-band ${message ? 'reveal-visible' : ''}`} aria-live="polite">{message}</div>
          </div>
        );
      }}
    </TheoryStage>
  );
};

const ROMAN_LEARN_CARD_MAP = [
  [0], [1], [2], [3], [4], [5], [6], [7], [8], [9], [3, 5],
];

const Screen9 = ({ screen, onPrev, onNext }) => {
  const c = CONTENT.s9;
  const t = useT();
  const lang = useLang();
  const [phase, setPhase] = useState('hypothesis');
  const [picked, setPicked] = useState(null);
  const audioValue = phase === 'hypothesis'
    ? c.audioIntro
    : c.audioTeach;
  const segments = useMemo(
    () => localizedSegments(audioValue, lang, `s${screen}-${phase}`),
    [audioValue, lang, phase, screen],
  );
  const audio = useAudio(segments);
  const audioReady = audio.muted || audio.completed;
  const teachSegmentIndex = phase === 'learn' && audio.isPlaying && !audio.muted
    ? segments.findIndex(({ id }) => id === audio.currentSegment)
    : -1;
  const activeCardIndexes = ROMAN_LEARN_CARD_MAP[teachSegmentIndex] ?? [];
  const comparingFourAndSix = teachSegmentIndex === ROMAN_LEARN_CARD_MAP.length - 1;
  const chooseHypothesis = (index) => {
    if (!audioReady || phase !== 'hypothesis') return;
    setPicked(index);
    setPhase('learn');
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      title={phase === 'hypothesis' ? c.title : c.lessonTitle}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
      nextDisabled={phase !== 'learn' || !audioReady}
    >
      {phase === 'hypothesis' ? (
        <section className="roman-hypothesis" data-g4-mechanic="NeutralHypothesis">
          <div className="roman-symbol-question main-light-blue-frame" data-g4-role="visual-frame" aria-label={c.symbols}>{c.symbols}</div>
          <div className="hypothesis-options">
            {c.hypothesisOptions.map((option, index) => (
              <button
                type="button"
                key={index}
                className={picked === index ? 'hypothesis-picked' : ''}
                disabled={!audioReady}
                aria-pressed={picked === index}
                onClick={() => chooseHypothesis(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                <strong>{t(option)}</strong>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="roman-learning-frame main-light-blue-frame" data-g4-role="visual-frame" data-g4-mechanic="RomanTable1To10">
          <p className="neutral-hypothesis-note">{t(c.hypothesisAccepted)}</p>
          <p className="roman-learning-lead">{t(c.explanation)}</p>
          <div className="roman-learning-grid">
            {c.numerals.map(([decimal, roman], index) => {
              const active = activeCardIndexes.includes(index);
              const className = [
                active ? 'roman-learning-card-active' : '',
                active && comparingFourAndSix ? 'roman-learning-card-compare' : '',
              ].filter(Boolean).join(' ');

              return (
                <article
                  key={decimal}
                  className={className}
                  data-g4-audio-active={active ? 'true' : 'false'}
                >
                  <span>{decimal}</span>
                  <strong>{roman}</strong>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </Stage>
  );
};

const DecimalSwap = ({ moved, onToggle, disabled }) => {
  const t = useT();
  const toggleLabel = moved
    ? B(
      'Сейчас показано число 41: четыре кассеты и одна батарейка. Показать модель числа 14.',
      "Hozir 41 soni ko'rsatilgan: to'rtta kasseta va bitta batareya. 14 soni modelini ko'rsatish.",
      'The model shows 41: four cassettes and one battery. Show the model for 14.',
    )
    : B(
      'Сейчас показано число 14: одна кассета и четыре батарейки. Показать модель числа 41.',
      "Hozir 14 soni ko'rsatilgan: bitta kasseta va to'rtta batareya. 41 soni modelini ko'rsatish.",
      'The model shows 14: one cassette and four batteries. Show the model for 41.',
    );
  return (
  <button
    type="button"
    className="swap-scene place-value-swap"
    onClick={onToggle}
    disabled={disabled}
    aria-label={t(toggleLabel)}
    aria-pressed={moved}
    data-g4-place-value-state={moved ? '41' : '14'}
  >
    <PlaceValueCityIllustration moved={moved} />
    <div className="place-labels"><span>10</span><span>1</span></div>
    <div className={`digit-track ${moved ? 'digit-track-moved' : ''}`}>
      <span className="digit digit-one">1<small>{moved ? '1' : '10'}</small></span>
      <span className="digit digit-four">4<small>{moved ? '40' : '4'}</small></span>
    </div>
    <strong>{moved ? '41' : '14'}</strong>
  </button>
  );
};

const NarrationReplayReset = ({ sequenceRun, onReplayStart }) => {
  const sequenceRunRef = useRef(sequenceRun);
  useEffect(() => {
    const replayStarted = sequenceRunRef.current !== sequenceRun;
    sequenceRunRef.current = sequenceRun;
    if (replayStarted) {
      const timer = window.setTimeout(() => onReplayStart(null), 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [onReplayStart, sequenceRun]);
  return null;
};

const Screen5 = (props) => {
  const c = CONTENT.s5;
  const t = useT();
  const [manual, setManual] = useState(null);
  return (
    <TheoryStage {...props} screen={props.screen} contentScreen={5} beatCount={4} interval={1200} nextDisabled={manual === null}>
      {({ beat, audio }) => {
        const audioReady = audio.muted || audio.completed;
        const moved = audioReady ? (manual ?? false) : beat >= 1;
        return (
          <>
            <NarrationReplayReset sequenceRun={audio.sequenceRun} onReplayStart={setManual} />
            <div className="single-model-layout place-value-model-frame main-light-blue-frame" data-g4-role="visual-frame" data-g4-mechanic="ModelToggle">
              <DecimalSwap moved={moved} disabled={!audioReady} onToggle={() => setManual((value) => !(value ?? moved))} />
              <div className={`conclusion-band place-value-conclusion-frame ${beat >= 3 ? 'reveal-visible' : ''}`}>{t(c.conclusion)}</div>
            </div>
          </>
        );
      }}
    </TheoryStage>
  );
};

const RomanSwap = ({ moved, onToggle, disabled }) => {
  const t = useT();
  return (
  <button type="button" className="swap-scene roman-swap main-light-blue-frame" onClick={onToggle} disabled={disabled} aria-label={t(B('VI и IV', 'VI va IV', 'VI and IV'))}>
    <div className={`roman-token-track ${moved ? 'roman-token-moved' : ''}`}>
      <span className="roman-v">V<small>5</small></span>
      <span className="roman-i">I<small>1</small></span>
    </div>
    <div className="operation-arc">{moved ? '5 − 1' : '5 + 1'}</div>
    <strong>{moved ? 'IV = 4' : 'VI = 6'}</strong>
  </button>
  );
};

const Screen10 = (props) => {
  const c = CONTENT.s10;
  const t = useT();
  const [manual, setManual] = useState(null);
  return (
    <TheoryStage {...props} screen={props.screen} contentScreen={10} beatCount={4} interval={1200} nextDisabled={manual === null}>
      {({ beat, audio }) => {
        const audioReady = audio.muted || audio.completed;
        const moved = audioReady ? (manual ?? false) : beat >= 1;
        return (
          <>
            <NarrationReplayReset sequenceRun={audio.sequenceRun} onReplayStart={setManual} />
            <div className="single-model-layout" data-g4-mechanic="ModelToggle">
              <RomanSwap moved={moved} disabled={!audioReady} onToggle={() => setManual((value) => !(value ?? moved))} />
              <div className={`conclusion-band ${beat >= 3 ? 'reveal-visible' : ''}`}>{t(c.conclusion)}</div>
            </div>
          </>
        );
      }}
    </TheoryStage>
  );
};

const Screen14 = (props) => {
  const [selected, setSelected] = useState(null);
  const [seen, setSeen] = useState([]);
  const reveal = (index) => {
    setSelected(index);
    setSeen((previous) => (previous.includes(index) ? previous : [...previous, index]));
  };
  return (
  <TheoryStage {...props} screen={props.screen} contentScreen={14} beatCount={4} interval={1200} nextDisabled={seen.length !== 2}>
    {({ beat, audio, t }) => {
      const c = CONTENT.s14;
      const audioReady = audio.muted || audio.completed;
      return (
        <div className="comparison-layout" data-g4-mechanic="CompareTabs">
          <div className="theory-action-row">
            {[B('Десятичная запись', "O'nlik yozuv", 'Decimal notation'), B('Римская запись', 'Rim yozuvi', 'Roman numerals')].map((label, index) => (
              <button type="button" key={index} disabled={!audioReady} className={`${selected === index ? 'theory-action-active' : ''} ${seen.includes(index) ? 'theory-action-seen' : ''}`} aria-pressed={selected === index} onClick={() => reveal(index)}>{t(label)}</button>
            ))}
          </div>
          <div className="comparison-model">
            <div className="comparison-formula">14 <span>↔</span> 41</div>
            <div className={`comparison-result ${beat >= 0 ? 'reveal-visible' : ''}`}><i className="decimal-mark" />{t(c.decimal)}</div>
          </div>
          <div className="comparison-model">
            <div className="comparison-formula">VI <span>↔</span> IV</div>
            <div className={`comparison-result ${beat >= 1 ? 'reveal-visible' : ''}`}><i className="roman-mark" />{t(c.roman)}</div>
          </div>
          <div className={`mini-proof ${beat >= 2 ? 'reveal-visible' : ''}`}><span>I = 1</span><span>+ / −</span></div>
        </div>
      );
    }}
  </TheoryStage>
  );
};

const RuleTabsScreen = ({ contentScreen, mechanic, ...props }) => {
  const c = CONTENT[`s${contentScreen}`];
  const [selected, setSelected] = useState(null);
  const [seen, setSeen] = useState([]);
  const formulas = contentScreen === 6
    ? ['41', '4 × 10', '4 × 10 = 40']
    : ['I \u00b7 V \u00b7 X', 'VI \u2194 IV', 'XIV = 10 + (5 \u2212 1) = 14'];
  const reveal = (index) => {
    setSelected(index);
    setSeen((previous) => (previous.includes(index) ? previous : [...previous, index]));
  };
  return (
    <TheoryStage {...props} screen={props.screen} contentScreen={contentScreen} beatCount={4} interval={1200} nextDisabled={seen.length !== c.tabs.length}>
      {({ beat, audio, t }) => {
        const active = selected ?? Math.min(beat, c.steps.length - 1);
        const audioReady = audio.muted || audio.completed;
        return (
          <div className="rule-builder" data-g4-mechanic={mechanic}>
            {contentScreen === 11 ? <StrategyScannerIllustration beat={beat} /> : null}
            <div className="theory-action-row">
              {c.tabs.map((label, index) => (
                <button
                  type="button"
                  key={index}
                  disabled={!audioReady}
                  className={`${selected === index ? 'theory-action-active' : ''} ${seen.includes(index) ? 'theory-action-seen' : ''}`}
                  aria-pressed={selected === index}
                  onClick={() => reveal(index)}
                >
                  {t(label)}
                </button>
              ))}
            </div>
            <section className="rule-builder-card main-light-blue-frame" data-g4-role="visual-frame">
              <strong>{formulas[active]}</strong>
              <p>{t(c.steps[active])}</p>
            </section>
            <div className={`rule-strip ${seen.length === c.tabs.length ? 'reveal-visible' : ''}`}>{t(c.definition)}</div>
            {c.warning && <div className={`warning-strip ${seen.length === c.tabs.length ? 'reveal-visible' : ''}`}>{t(c.warning)}</div>}
          </div>
        );
      }}
    </TheoryStage>
  );
};

const Screen6 = (props) => <RuleTabsScreen {...props} contentScreen={6} mechanic="RuleBuilder" />;
const Screen11 = (props) => <RuleTabsScreen {...props} contentScreen={11} mechanic="StrategyTabs" />;

const ChoicePractice = ({ screen, contentScreen = screen, choiceOrdinal, storedAnswer, onAnswer, onPrev, onNext, extra, gridClassName = '' }) => {
  const c = CONTENT[`s${contentScreen}`];
  const t = useT();
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [audio] = useNarratedSequence(screen, c.audio, Array.isArray(t(c.audio)) ? t(c.audio).length : 1, 1200);
  const correct = storedAnswer?.correct === true || picked === c.correct;
  const canChoose = correct || audio.muted || audio.completed;
  const optionOrder = buildOptionOrder(c.options.length, c.correct, LESSON_META.lessonId, choiceOrdinal);

  const choose = (index) => {
    if (!canChoose || correct) return;
    const nextAttempts = attempts + 1;
    const isCorrect = index === c.correct;
    setAttempts(nextAttempts);
    setPicked(index);
    playSfx(isCorrect ? 'correct' : 'wrong');
    const audioLines = t(c.feedbackAudio);
    audio.pushOneOff(Array.isArray(audioLines) ? audioLines[index] : audioLines);
    onAnswer?.({
      stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.title),
      options: c.options.map((option) => t(option)), correctIndex: c.correct,
      correctAnswer: t(c.options[c.correct]), studentAnswerIndex: index,
      studentAnswer: t(c.options[index]), correct: isCorrect,
      firstTry: isCorrect && nextAttempts === 1, attempts: nextAttempts,
    });
  };

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} title={c.title} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!correct}>
      {extra}
      <div className={`choice-grid ${gridClassName}`}>
        {optionOrder.map((sourceIndex, displayIndex) => (
          <button
            type="button"
            key={sourceIndex}
            data-g4-branch="choice"
            data-g4-role="answer-card"
            data-g4-source-index={sourceIndex}
            data-g4-correct={sourceIndex === c.correct ? 'true' : 'false'}
            data-g4-narration-locked={!canChoose && !correct ? 'true' : undefined}
            className={`choice-card ${picked === sourceIndex ? 'choice-picked' : ''} ${correct && sourceIndex === c.correct ? 'choice-correct' : ''}`}
            aria-pressed={picked === sourceIndex}
            disabled={!canChoose || correct}
            onClick={() => choose(sourceIndex)}
          >
            <span className="choice-letter">{String.fromCharCode(65 + displayIndex)}</span><span>{t(c.options[sourceIndex])}</span>
          </button>
        ))}
      </div>
      <FeedbackBlock show={picked !== null} correct={correct}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock>
    </Stage>
  );
};

const HighlightedNumberFrame = ({ number, highlightIndex = null }) => (
  <div className="highlighted-number-frame main-light-blue-frame" data-g4-role="visual-frame" aria-label={number}>
    <div className="highlighted-number-digits" aria-hidden="true">
      {String(number).split('').map((digit, index) => (
        <span className={index === highlightIndex ? 'highlighted-number-target' : ''} key={`${digit}-${index}`}>{digit}</span>
      ))}
    </div>
  </div>
);

const Screen3 = (props) => (
  <ChoicePractice
    {...props}
    screen={props.screen}
    contentScreen={3}
    choiceOrdinal={3}
    gridClassName="choice-grid-two choice-grid-compact"
    extra={<HighlightedNumberFrame number={CONTENT.s3.displayNumber} highlightIndex={CONTENT.s3.highlightIndex} />}
  />
);
const Screen4 = (props) => (
  <ChoicePractice
    {...props}
    screen={props.screen}
    contentScreen={4}
    choiceOrdinal={5}
    gridClassName="choice-grid-two choice-grid-compact choice-grid-formulas"
    extra={<HighlightedNumberFrame number={CONTENT.s4.displayNumber} />}
  />
);
const Screen7 = (props) => (
  <ChoicePractice
    {...props}
    screen={props.screen}
    contentScreen={7}
    choiceOrdinal={4}
    gridClassName="choice-grid-two choice-grid-compact"
    extra={<HighlightedNumberFrame number="707" highlightIndex={0} />}
  />
);
const Screen8 = (props) => {
  const t = useT();
  return (
    <ChoicePractice
      {...props}
      screen={props.screen}
      contentScreen={8}
      choiceOrdinal={2}
      gridClassName="choice-grid-single"
      extra={(
        <div className="error-claim equation-claim main-light-blue-frame" data-g4-role="visual-frame">
          <p>{t(CONTENT.s8.claim)}</p>
        </div>
      )}
    />
  );
};

const MATCH_PAIRS = { 4: 'IV', 9: 'IX', 14: 'XIV', 20: 'XX' };
const Screen12 = ({ screen, storedAnswer, onAnswer, onPrev, onNext }) => {
  const boardRef = useRef(null);
  const c = CONTENT.s12;
  const t = useT();
  const lang = useLang();
  const initialPairs = storedAnswer?.pairs ?? {};
  const [phase, setPhase] = useState(Object.keys(initialPairs).length > 0 ? 'practice' : 'learn');
  const [audio] = useNarratedSequence(screen, c.audio, 2);
  const audioReady = audio.muted || audio.completed;
  const [selected, setSelected] = useState(null);
  const [pairs, setPairs] = useState(initialPairs);
  const [wrongPair, setWrongPair] = useState(null);
  const [message, setMessage] = useState(storedAnswer?.message ?? '');
  const [lastCorrect, setLastCorrect] = useState(storedAnswer?.lastCorrect ?? storedAnswer?.correct ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const wrongTimerRef = useRef(null);

  useEffect(() => () => {
    if (wrongTimerRef.current !== null) window.clearTimeout(wrongTimerRef.current);
  }, []);

  const match = (roman, decimalValue = selected) => {
    if (phase !== 'practice' || !audioReady || decimalValue === null || pairs[decimalValue] || Object.values(pairs).includes(roman)) return;
    if (wrongTimerRef.current !== null) window.clearTimeout(wrongTimerRef.current);
    setWrongPair(null);
    const isCorrect = MATCH_PAIRS[decimalValue] === roman;
    if (isCorrect) {
      const nextPairs = { ...pairs, [decimalValue]: roman };
      const complete = Object.keys(nextPairs).length === 4;
      setPairs(nextPairs);
      setSelected(null);
      setLastCorrect(true);
      const nextMessage = decimalValue === 4
        ? t(B('В IV знак I стоит перед V, поэтому единица вычитается.', 'IV da I V dan oldin, shuning uchun 1 ayriladi.', 'In IV, I comes before V, so one is subtracted.'))
        : decimalValue === 9
          ? t(B('В IX знак I стоит перед X, поэтому единица вычитается.', 'IX da I X dan oldin, shuning uchun 1 ayriladi.', 'In IX, I comes before X, so one is subtracted.'))
          : t(B('Пара составлена верно.', "Juftlik to'g'ri tuzildi.", 'The pair is correct.'));
      setMessage(nextMessage);
      playSfx('correct');
      onAnswer?.({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.title),
        options: null,
        correctIndex: null,
        correctAnswer: '4-IV; 9-IX; 14-XIV; 20-XX',
        studentAnswerIndex: null,
        studentAnswer: JSON.stringify(nextPairs),
        correct: complete,
        firstTry: complete && attemptsRef.current === 0,
        attempts: complete ? attemptsRef.current + 1 : attemptsRef.current,
        pairs: nextPairs,
        message: nextMessage,
        lastCorrect: true,
      });
      if (complete) {
        audio.pushOneOff(t(B('Все четыре пары составлены верно.', "To'rtta juftlik ham to'g'ri tuzildi.", 'All four pairs are correct.')));
      }
    } else {
      attemptsRef.current += 1;
      setWrongPair({ left: decimalValue, right: roman });
      wrongTimerRef.current = window.setTimeout(() => {
        setWrongPair(null);
        wrongTimerRef.current = null;
      }, 1200);
      setLastCorrect(false);
      setMessage(t(c.hint));
      playSfx('wrong');
      audio.pushOneOff(t(B('Проверь значения знаков и их порядок.', 'Belgilar qiymati va tartibini tekshiring.', 'Check the values and order of the symbols.')));
      onAnswer?.({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.title), options: null,
        correctIndex: null, correctAnswer: '4-IV; 9-IX; 14-XIV; 20-XX',
        studentAnswerIndex: null, studentAnswer: `${decimalValue}-${roman}`, correct: false,
        firstTry: false, attempts: attemptsRef.current, pairs, message: t(c.hint), lastCorrect: false });
    }
  };

  const beginPractice = () => {
    setPhase('practice');
    setSelected(null);
    setMessage('');
    setLastCorrect(null);
    audio.pushOneOff(t(c.taskAudio));
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      title={phase === 'learn' ? c.stepOneTitle : c.stepTwoTitle}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
      nextDisabled={phase !== 'practice' || Object.keys(pairs).length !== 4}
    >
      {phase === 'learn' ? (
        <section className="roman-learning-frame roman-11-20-frame main-light-blue-frame" data-g4-role="visual-frame" data-g4-mechanic="RomanTeachTable">
          <p className="roman-learning-lead">{t(c.stepOneLead)}</p>
          <div className="roman-learning-grid roman-learning-grid-extended">
            {c.numerals.map(([decimal, roman]) => (
              <div className="roman-learning-card" key={decimal}>
                <span>{decimal}</span>
                <strong>{roman}</strong>
              </div>
            ))}
          </div>
          <div className="local-action-row">
            <button type="button" className="btn btn-white-accent" disabled={!audioReady} onClick={beginPractice}>
              {t(c.toPractice)}
            </button>
          </div>
        </section>
      ) : (
        <>
          <div className="matching-board roman-learning-match main-light-blue-frame" ref={boardRef} data-g4-role="visual-frame" data-g4-mechanic="MatchingBoard">
            <div className="matching-column matching-column-numbers">
              {[4, 9, 14, 20].map((value) => (
                <button
                  type="button" draggable={audioReady && !pairs[value]} key={value} data-match-left={value}
                  disabled={!audioReady || Boolean(pairs[value])}
                  className={`match-card ${selected === value ? 'match-selected' : ''} ${pairs[value] ? 'match-done' : ''} ${wrongPair?.left === value ? 'match-wrong' : ''}`}
                  aria-pressed={selected === value}
                  aria-disabled={Boolean(pairs[value])}
                  aria-label={`${value}${pairs[value] ? `, ${pairs[value]}` : ''}`}
                  onDragStart={(event) => event.dataTransfer.setData('text/plain', String(value))}
                  onClick={() => !pairs[value] && setSelected(value)}
                >{value}{pairs[value] && <small>→ {pairs[value]}</small>}</button>
              ))}
            </div>
            <MatchingLines boardRef={boardRef} pairs={Object.entries(pairs).filter(([, right]) => right).map(([left, right]) => ({ left, right }))} wrongPair={wrongPair} localeKey={lang} />
            <div className="matching-column matching-column-romans">
              {['XIV', 'XX', 'IV', 'IX'].map((roman) => (
                <button
                  type="button" key={roman} data-match-right={roman} disabled={!audioReady || Object.values(pairs).includes(roman)} className={`match-card roman-match ${Object.values(pairs).includes(roman) ? 'match-done' : ''} ${wrongPair?.right === roman ? 'match-wrong' : ''}`}
                  aria-pressed={Object.values(pairs).includes(roman)}
                  aria-label={roman}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => match(roman, Number(event.dataTransfer.getData('text/plain')))}
                  onClick={() => match(roman)}
                >{roman}</button>
              ))}
            </div>
          </div>
          <span className="sr-only" aria-live="polite">{message}</span>
          <FeedbackBlock show={Boolean(message)} correct={lastCorrect === true}>{message}</FeedbackBlock>
        </>
      )}
    </Stage>
  );
};

const Screen13 = (props) => {
  const t = useT();
  return (
    <ChoicePractice
      {...props}
      screen={props.screen}
      contentScreen={13}
      choiceOrdinal={1}
      gridClassName="choice-grid-single"
      extra={(
        <div className="error-claim equation-claim main-light-blue-frame" data-g4-role="visual-frame">
          <p>{t(CONTENT.s13.claim)}</p>
        </div>
      )}
    />
  );
};

const Screen15 = ({ screen, onPrev, onNext }) => {
  const c = CONTENT.s15;
  const t = useT();
  const [audio] = useNarratedSequence(screen, c.audio, 3, 1200);
  const audioReady = audio.muted || audio.completed;
  const [selected, setSelected] = useState(null);
  const [placed, setPlaced] = useState({});
  const [checked, setChecked] = useState('idle');
  const [message, setMessage] = useState('');
  const [lastCorrect, setLastCorrect] = useState(null);
  const targetFor = { 0: '404', 1: 'XIV' };

  const put = (code, method = selected) => {
    if (
      !audioReady
      || checked !== 'idle'
      || method === null
      || method === undefined
      || placed[method]
      || Object.values(placed).includes(code)
    ) return;
    const nextPlaced = { ...placed, [method]: code };
    const complete = Object.keys(nextPlaced).length === 2;
    setPlaced(nextPlaced);
    setSelected(null);
    if (!complete) return;

    const isCorrect = Object.entries(targetFor).every(([methodIndex, target]) => nextPlaced[methodIndex] === target);
    if (isCorrect) {
      const nextMessage = t(B('Оба способа размещены верно.', "Ikkala usul ham to'g'ri joylashtirildi.", 'Both methods are placed correctly.'));
      setChecked('correct');
      setLastCorrect(true);
      setMessage(nextMessage);
      playSfx('correct');
      audio.pushOneOff(t(B('Оба кода проверяются своими правилами.', "Ikki kod ham o'z qoidasiga ko'ra tekshirildi.", 'Each code is checked with its own rule.')));
      return;
    }

    const nextMessage = t(B('Методы перепутаны. Для 404 нужны разряды, а для XIV — значения и порядок знаков. Разместите их заново.', "Usullar almashib qolgan. 404 uchun xonalar, XIV uchun belgilar qiymati va tartibi kerak. Ularni qayta joylashtiring.", 'The methods are swapped. Use place values for 404 and symbol values and order for XIV. Place them again.'));
    setChecked('wrong');
    setLastCorrect(false);
    setMessage(nextMessage);
    playSfx('wrong');
    audio.pushOneOff(t(B('Методы перепутаны. Разместите их заново.', 'Usullar almashib qolgan. Ularni qayta joylashtiring.', 'The methods are swapped. Place them again.')));
  };

  const retry = () => {
    setSelected(null);
    setPlaced({});
    setChecked('idle');
    setMessage('');
    setLastCorrect(null);
  };

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} title={c.title} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={checked !== 'correct'}>
      <div className="method-match" data-g4-role="visual-frame" data-g4-mechanic="MethodMatch">
        <div className="code-targets">
          {['404', 'XIV'].map((code) => {
            const methodIndex = Object.keys(placed).find((key) => placed[key] === code);
            return (
              <button
                type="button"
                key={code}
                className="code-target"
                disabled={!audioReady || checked !== 'idle' || Object.values(placed).includes(code)}
                onClick={() => put(code)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => put(code, Number(event.dataTransfer.getData('text/plain')))}
              >
                <strong>{code}</strong>
                <span>{methodIndex !== undefined ? t(c.methods[Number(methodIndex)]) : '＋'}</span>
                {methodIndex !== undefined && <em>{code === '404' ? '404 = 400 + 0 + 4' : 'XIV = 10 + 4 = 14'}</em>}
              </button>
            );
          })}
        </div>
        <div className="method-source">
          {c.methods.map((method, index) => !placed[index] && (
            <button
              type="button"
              draggable={audioReady && checked === 'idle'}
              disabled={!audioReady || checked !== 'idle'}
              key={index}
              className={`method-card ${selected === index ? 'method-selected' : ''}`}
              onDragStart={(event) => event.dataTransfer.setData('text/plain', String(index))}
              onClick={() => setSelected(index)}
            >{t(method)}</button>
          ))}
        </div>
      </div>
      <FeedbackBlock show={Boolean(message)} correct={lastCorrect === true}>{message}</FeedbackBlock>
      {checked === 'wrong' && (
        <div className="local-action-row method-retry-row">
          <button type="button" className="btn btn-white-accent" onClick={retry}>{t(c.retry)}</button>
        </div>
      )}
    </Stage>
  );
};

const Screen16 = ({ screen, storedAnswer, onPrev, finishLesson, answers = {}, onAnswer }) => {
  const c = CONTENT.s16;
  const t = useT();
  const lang = useLang();
  const segments = useMemo(
    () => localizedSegments(c.audio, lang, `s${screen}-final`),
    [c.audio, lang, screen],
  );
  const baseAudio = useAudio(segments);
  const reveal = useAudioSegmentReveal(baseAudio, segments, 5);
  const audio = { ...baseAudio, replay: reveal.replay, toggleMute: reveal.toggleMute };
  const visible = reveal.visible;
  const complete = visible >= 5;
  const [titleCardCelebration, setTitleCardCelebration] = useState(false);
  const celebrationTimerRef = useRef(null);
  useEffect(() => () => {
    if (celebrationTimerRef.current !== null) window.clearTimeout(celebrationTimerRef.current);
  }, []);
  const startTitleCardCelebration = useCallback(() => {
    if (celebrationTimerRef.current !== null) window.clearTimeout(celebrationTimerRef.current);
    setTitleCardCelebration(true);
    celebrationTimerRef.current = window.setTimeout(() => {
      setTitleCardCelebration(false);
      celebrationTimerRef.current = null;
    }, 3000);
  }, []);
  const scoredKeys = SCREEN_META.reduce((keys, meta, index) => (meta.scored ? [...keys, `s${index}`] : keys), []);
  const firstTryCount = scoredKeys.filter((key) => answers[key]?.firstTry === true).length;
  const totalScored = scoredKeys.length;
  const rewardTitles = {
    top: { uz: "Sanoq tizimlari me'mori", ru: 'Архитектор систем счисления', en: 'Numeral-system architect' },
    middle: { uz: 'Tizimlar tahlilchisi', ru: 'Аналитик систем', en: 'Systems analyst' },
    base: { uz: 'Raqamlar tadqiqotchisi', ru: 'Исследователь чисел', en: 'Number explorer' },
  };
  const rewardTitle = firstTryCount === totalScored
    ? rewardTitles.top
    : firstTryCount >= Math.max(1, totalScored - 1)
      ? rewardTitles.middle
      : rewardTitles.base;
  const emitTitleClaim = useCallback(() => {
    onAnswer?.({
      stage: null,
      screenIdx: screen,
      question: t(B('Получить звание', 'Unvonni olish', 'Claim title')),
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
  }, [onAnswer, rewardTitle, screen, t]);
  const { titleClaimed, canClaimTitle, revealRequested, claimTitle } = useGrade4TitleClaim({
    storedAnswer,
    audio,
    onClaim: emitTitleClaim,
  });

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} title={null} audio={titleClaimed ? { ...audio, completed: true } : audio} onPrev={onPrev} onNext={titleClaimed ? finishLesson : undefined} finish nextDisabled={!titleClaimed}>
      <style>{G4_TITLE_STYLES}</style>
      <Grade4Finale
        lang={lang}
        heading={{
          eyebrow: t(B('ФИНАЛЬНЫЙ ЭТАП', 'YAKUNIY BOSQICH', 'FINAL STAGE')),
          title: t(c.title),
          lead: t(B('Соберём в одной сцене все опоры для различения двух систем счисления.', "Ikki sanoq tizimini farqlash uchun barcha tayanchlarni bir joyga jamlaymiz.", 'Bring together all the key ideas for distinguishing the two numeral systems.')),
        }}
        takeaways={c.points.slice(0, 3).map(t)}
        proof={{
          label: t(B('РЕШЕНИЕ СТАРТОВОЙ МИССИИ', "BOSHLANG'ICH MISSIYA YECHIMI", 'OPENING MISSION SOLUTION')),
          value: '27 ≠ 72',
          text: t(c.points[3]),
        }}
        bridge={{
          label: t(B('СЛЕДУЮЩАЯ МИССИЯ', 'KEYINGI MISSIYA', 'NEXT MISSION')),
          text: t(c.bridge),
          terminal: false,
        }}
        visible={visible}
        complete={complete}
        revealSteps={{ proof: 4, bridge: 5 }}
        canFinish={titleClaimed}
        canClaimTitle={canClaimTitle}
        titleClaimed={titleClaimed}
        onClaimTitle={claimTitle}
        claimLabel={t(B('Получить звание', 'Unvonni olish', 'Claim title'))}
        pendingLabel={t(B('Прослушайте итоговое объяснение', 'Yakuniy tushuntirishni tinglang', 'Listen to the final explanation'))}
        renderTitleReveal={() => <G4TitleReveal active={titleClaimed} playNow={revealRequested} title={t(rewardTitle)} lang={lang} onComplete={startTitleCardCelebration} />}
        renderTitleCard={() => <G4TitleCard title={t(rewardTitle)} lang={lang} firstTry={firstTryCount} totalScored={totalScored} celebrate={titleCardCelebration} />}
        bitSlot={<BitSVG state="happy" />}
        medalTier={firstTryCount === totalScored ? 'gold' : firstTryCount >= Math.max(1, totalScored - 1) ? 'silver' : 'bronze'}
      />
    </Stage>
  );
};
const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5,
  Screen6, Screen7, Screen8, Screen9, Screen10, Screen11,
  Screen12, Screen13, Screen14, Screen15, Screen16,
];

export default function Grade4Dars07({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  onFinished,
  previewMode,
}) {
  useMobileZoom();
  const showPreviewControls = langProp === undefined || langProp === null;
  const preview = previewMode ?? showPreviewControls;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = showPreviewControls ? normalizeLang(previewLang) : normalizeLang(langProp);
  configureLesson({
    ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '', studentName: studentName || (DEFAULT_STUDENT_NAMES[lang] ?? DEFAULT_STUDENT_NAMES.uz),
    voiceGender: voiceGender || 'f',
    previewMode: preview,
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  // eslint-disable-next-line react-hooks/purity -- lesson duration begins on mount
  const startTimeRef = useRef(Date.now());
  const finishedRef = useRef(false);

  const recordAnswer = useCallback((key, data) => {
    setAnswers((previous) => ({ ...previous, [key]: data }));
  }, []);

  const finishLesson = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const scoredIndexes = SCREEN_META.map((meta, index) => (meta.scored ? index : null)).filter((index) => index !== null);
    const scoredAnswers = scoredIndexes.map((index) => answers[`s${index}`]).filter(Boolean);
    const totalQuestions = scoredIndexes.length;
    const correctAnswers = scoredAnswers.filter((answer) => answer.correct && answer.firstTry).length;
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang] ?? '',
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions,
      correctAnswers,
      scorePercent: Math.round((correctAnswers / totalQuestions) * 100),
      finalScore: correctAnswers,
      finalTotal: totalQuestions,
      passed: correctAnswers / totalQuestions >= 0.6,
      firstTryStats: { total: totalQuestions, firstTryCorrect: correctAnswers },
      attemptsTotal: scoredAnswers.reduce((sum, answer) => sum + (answer.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: scoredAnswers,
    };
    if (onFinished) onFinished(payload);
    else console.log('[Grade4 Dars07 preview]', payload);
  }, [answers, lang, onFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
  const previous = () => setCurrent((value) => Math.max(value - 1, 0));
  const previewLanguageLabel = B('Язык предпросмотра', "Ko'rib chiqish tili", 'Preview language')[lang] ?? '';

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className={`lesson-root ${showPreviewControls ? 'lesson-root-preview' : ''}`}>
        <div className="lesson-ambient" aria-hidden="true"><i /><i /><i /></div>
        {showPreviewControls && (
          <div className="preview-language" aria-label={previewLanguageLabel}>
            {SUPPORTED_LANGS.map((code) => (
              <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>
            ))}
          </div>
        )}
        <CurrentScreen
          key={current}
          screen={current}
          answers={answers}
          storedAnswer={answers[`s${current}`]}
          onAnswer={(data) => recordAnswer(`s${current}`, data)}
          onNext={next}
          onPrev={previous}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}

const STYLES = `
html:has(.lesson-root), body:has(.lesson-root), #root:has(.lesson-root),
.lesson-page:has(.lesson-root), .lesson-frame:has(.lesson-root) {
  width: 100%; height: 100%; min-height: 0 !important; overflow: hidden !important;
  overscroll-behavior: none;
}
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root {
  position: fixed; inset: 0; width: 100%; height: 100dvh; min-height: 0;
  --shadow: rgba(${T.shadowBase}, .13);
  overflow: hidden; background: ${T.bg}; color: ${T.ink};
  font-family: 'Manrope', system-ui, sans-serif; isolation: isolate;
  zoom: var(--g4z, 1);
}
.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root p,
.lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }
.lesson-root button, .lesson-root input { font: inherit; }
.lesson-root button:focus-visible, .lesson-root input:focus-visible { outline: 3px solid rgba(22,143,163,.42); outline-offset: 3px; }
.lesson-ambient { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: -1; }
.lesson-ambient i { position: absolute; border-radius: 999px; filter: blur(2px); opacity: .45; }
.lesson-ambient i:nth-child(1) { width: 320px; height: 320px; right: -130px; top: 9%; background: rgba(22,143,163,.08); }
.lesson-ambient i:nth-child(2) { width: 260px; height: 260px; left: -120px; bottom: 3%; background: rgba(255,91,53,.07); }
.lesson-ambient i:nth-child(3) { width: 9px; height: 9px; left: 12%; top: 20%; background: ${T.lime}; box-shadow: 55vw 42vh 0 rgba(22,143,163,.32), 72vw 12vh 0 rgba(255,91,53,.25); }
.preview-language {
  position: fixed; top: 9px; right: 9px; z-index: 30; display: flex; gap: 3px;
  padding: 3px; border-radius: 999px; background: rgba(255,255,255,.94);
  box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},.6);
}
.preview-language button { padding: 4px 9px; border: 0; border-radius: 999px; color: ${T.ink2}; background: transparent; cursor: pointer; font-size: 10px; font-weight: 900; }
.preview-language .preview-active { color: #FFFFFF; background: ${T.accent}; }
.stage {
  width: min(936px, 100%); max-width: 936px; height: 100%; min-height: 0; margin: 0 auto;
  display: flex; flex-direction: column; overflow: hidden; position: relative;
}
.stage-header { flex-shrink: 0; padding-top: 10px; padding-bottom: 8px; background: rgba(247,248,244,.88); backdrop-filter: blur(14px); z-index: 5; }
.progress-track { width: 100%; height: 6px; margin-bottom: 10px; overflow: hidden; border-radius: 999px; background: rgba(80,97,109,.16); }
.progress-fill, .progress-bar { height: 100%; border-radius: inherit; background: linear-gradient(90deg, ${T.cyan}, ${T.accent}); box-shadow: 0 0 12px rgba(255,91,53,.42); transition: width .45s ease; }
.stage-chrome { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.chrome-title, .chrome-actions, .audio-controls { display: flex; align-items: center; gap: 9px; }
.chrome-title { min-width: 0; color: ${T.ink2}; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.chrome-title span:last-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.status-dot { width: 8px; height: 8px; flex: 0 0 8px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 10px rgba(255,91,53,.65); }
.screen-type { padding: 4px 8px; border-radius: 999px; color: ${T.cyan}; background: ${T.cyanSoft}; font-size: 10px; font-weight: 800; }
.screen-count { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; white-space: nowrap; }
.icon-btn { width: 32px; height: 32px; padding: 0; border: 0; border-radius: 10px; color: ${T.ink2}; background: rgba(255,255,255,.75); box-shadow: 0 4px 12px -7px rgba(${T.shadowBase},.3); cursor: pointer; }
.stage-content { min-height: 0; flex: 1 1 auto; overflow: visible; padding-top: 6px; padding-bottom: 12px; position: relative; }
.stage-fit { min-width: 0; transform-origin: top center; }
.stage-fit > h1 { padding-right: 52px; }
.stage-fit > h1 { max-width: 820px; font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(25px, 3.2vw, 39px); line-height: 1.08; letter-spacing: -.025em; color: ${T.ink}; animation: rise-in .5s both; }
.stage-hook { background: #EAF6FA; }
.btn:disabled, .choice-card:disabled { opacity: .55; cursor: default; transform: none; }
.stage-nav { flex: 0 0 auto; min-height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 10px; padding-bottom: 14px; background: linear-gradient(rgba(245,245,240,0), ${T.bg} 28%); z-index: 6; }
.btn { min-height: 48px; border: 0; border-radius: 14px; padding: 0 20px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-weight: 900; cursor: pointer; transition: transform .2s, box-shadow .2s, background .2s; }
.btn-ghost { color: ${T.ink2}; background: transparent; }
.btn-ghost:hover { background: ${T.paper}; box-shadow: 0 6px 18px var(--shadow); }
.btn-white-accent, .btn-check { color: ${T.accent}; background: ${T.paper}; box-shadow: 0 7px 0 rgba(255,91,53,.24), 0 13px 28px rgba(255,91,53,.13); }
.btn-white-accent:hover, .btn-check:hover { color: white; background: ${T.accent}; transform: translateY(-2px); box-shadow: 0 8px 0 rgba(185,53,23,.28), 0 15px 28px rgba(255,91,53,.21); }
.btn-white-accent:active, .btn-check:active { transform: translateY(3px); box-shadow: 0 3px 0 rgba(185,53,23,.28); }
.btn-check:disabled { opacity: .36; cursor: default; transform: none; box-shadow: none; }
.nav-hidden { visibility: hidden; pointer-events: none; }

.hook-scene { margin-top: 10px; min-height: 226px; padding: 20px clamp(18px, 4vw, 46px); border-radius: 28px; display: grid; grid-template-columns: minmax(92px,1fr) minmax(180px,1.18fr) minmax(92px,1fr); align-items: center; gap: 22px; overflow: hidden; position: relative; background: radial-gradient(circle at 78% 48%, rgba(91,214,242,.13), transparent 34%), ${T.navy}; box-shadow: 0 18px 44px rgba(23,59,82,.22); }
.hook-scene::before { content: ''; position: absolute; inset: 0; opacity: .17; background-image: linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.09) 1px, transparent 1px); background-size: 34px 34px; mask-image: linear-gradient(to left, #000, transparent 88%); }
.hook-scene::after { content: ''; position: absolute; inset: 1px; z-index: -1; border: 1px solid rgba(144,228,235,.12); border-radius: 23px; pointer-events: none; }
.hook-bit { height: 132px; position: relative; z-index: 1; display: flex; justify-content: center; align-items: flex-end; }
.hook-bit .g1-char { height: 100%; }
.hook-code-panel { position: absolute; z-index: 2; left: clamp(18px, 6vw, 58px); right: 150px; top: 50%; min-height: 142px; padding: 18px 22px; border: 1px solid rgba(157,235,247,.28); border-radius: 22px; display: grid; align-content: center; gap: 10px; color: #FFFFFF; background: linear-gradient(145deg, rgba(255,255,255,.12), rgba(91,214,242,.04)); box-shadow: inset 0 1px rgba(255,255,255,.13), 0 18px 34px rgba(1,13,22,.24); transform: translateY(-50%); }
.hook-code-label { color: #9DEBF7; font-size: 10px; font-weight: 900; letter-spacing: .13em; text-transform: uppercase; }
.hook-code-values { display: flex; align-items: center; justify-content: center; gap: clamp(14px,4vw,38px); font-family: 'JetBrains Mono', monospace; }
.hook-code-values strong { font-size: clamp(40px,7vw,68px); line-height: 1; text-shadow: 0 0 22px rgba(91,214,242,.34); }
.hook-code-values i { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; color: ${T.navy}; background: ${T.lime}; font-style: normal; font-size: 21px; font-weight: 900; }
.hook-code-digits { display: flex; align-items: center; justify-content: center; gap: 8px; color: #D9F8FC; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 900; }
.hook-code-digits span { min-width: 28px; min-height: 28px; border-radius: 8px; display: grid; place-items: center; background: rgba(255,255,255,.1); }
.hook-code-digits b { padding-inline: 7px; color: #9DEBF7; font-size: 18px; }
.choice-grid { margin-top: 18px; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
.choice-grid-two { grid-template-columns: repeat(2, minmax(0,1fr)); }
.choice-grid-single { grid-template-columns: 1fr; }
.choice-grid-compact { width: min(760px,100%); margin-inline: auto; }
.choice-grid-formulas .choice-card { justify-content: center; font-family: 'JetBrains Mono', monospace; text-align: center; }
.choice-card { min-height: 72px; border: 0; border-radius: 17px; padding: 13px 15px; display: flex; align-items: center; gap: 12px; text-align: left; color: ${T.ink}; background: ${T.paper}; box-shadow: 0 7px 22px var(--shadow); cursor: pointer; font-weight: 750; line-height: 1.35; transition: transform .22s, box-shadow .22s, background .22s; }
.choice-card:hover { transform: translateY(-3px); box-shadow: 0 12px 26px rgba(${T.shadowBase},.16); }
.hook-screen .choice-card[data-g4-narration-locked="true"]:disabled { opacity: 1; cursor: default; transform: none; box-shadow: 0 7px 22px var(--shadow); }
.choice-letter { width: 32px; height: 32px; flex: 0 0 32px; border-radius: 10px; display: grid; place-items: center; color: ${T.cyan}; background: ${T.cyanSoft}; font-family: 'JetBrains Mono', monospace; font-weight: 900; }
.choice-picked { background: ${T.accentSoft}; box-shadow: 0 0 0 2px rgba(255,91,53,.4), 0 9px 24px rgba(255,91,53,.12); }
.choice-picked .choice-letter { color: white; background: ${T.accent}; }
.choice-correct { background: ${T.successSoft}; box-shadow: 0 0 0 2px rgba(34,122,83,.35), 0 9px 24px rgba(34,122,83,.12); }
.choice-correct .choice-letter { background: ${T.success}; }
.hook-after { margin: 14px auto 0; max-width: 650px; min-height: 52px; border-radius: 15px; padding: 14px 18px; text-align: center; color: ${T.success}; background: ${T.successSoft}; font-weight: 900; animation: feedback-in .46s both; }

@media (max-height: 780px) {
  .stage-nav { min-height: 58px; padding-top: 5px; padding-bottom: 7px; }
  .stage-content { padding-top: 3px; padding-bottom: 6px; }
  .stage-fit > h1 { font-size: clamp(24px, 3vw, 34px); }
  .hook-scene { min-height: 174px; margin-top: 10px; padding-block: 12px; }
  .hook-code-panel { min-height: 118px; padding: 12px 16px; }
  .hook-bit { height: 108px; }
  .choice-grid { margin-top: 10px; gap: 8px; }
  .choice-card { min-height: 58px; padding: 9px 11px; }
  .roman-board, .comparison-layout, .system-zone-layout, .strategy-layout,
  .matching-board, .constructor-scene, .classification-scene { margin-top: 8px; }
  .roman-table { gap: 5px; }
  .roman-row { min-height: 34px; }
  .feedback { margin-top: 8px; padding-block: 8px; }
}

.recall-layout, .single-model-layout, .roman-board, .comparison-layout, .system-zones, .strategy-layout, .summary-layout { margin-top: 26px; }
.recall-layout, .roman-board, .single-model-layout, .system-zone-layout, .strategy-layout { position: relative; }
.recall-visual { position: relative; }
.scene-bit { width: 72px; height: 90px; flex: 0 0 72px; pointer-events: none; filter: drop-shadow(0 9px 17px rgba(23,59,82,.14)); }
.scene-bit .g1-char { width: 100%; height: 100%; }
.recall-bit { position: absolute; z-index: 2; right: 2px; top: -18px; width: 66px; height: 82px; opacity: .96; }
.number-row { min-height: 130px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: clamp(9px, 2vw, 18px); }
.number-chip { min-width: 110px; min-height: 86px; border: 0; border-radius: 18px; display: grid; place-items: center; color: ${T.navy}; background: ${T.paper}; box-shadow: 0 8px 23px var(--shadow); cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: clamp(27px, 4vw, 42px); font-weight: 900; transition: transform .34s, color .34s, box-shadow .34s; }
.number-speaking { color: ${T.accent}; transform: translateY(-7px) scale(1.04); box-shadow: 0 0 0 3px rgba(255,91,53,.36), 0 15px 30px rgba(255,91,53,.17); }
.system-caption, .bridge-line, .conclusion-band { opacity: 0; transform: translateY(10px); }
.system-caption { min-height: 46px; text-align: center; color: ${T.cyan}; font-weight: 900; }
.roman-preview { opacity: 0; min-height: 90px; display: flex; justify-content: center; align-items: center; gap: 18px; }
.roman-preview span { min-width: 82px; min-height: 65px; border-radius: 14px; display: grid; place-items: center; color: white; background: ${T.navy}; font-family: 'Source Serif 4', serif; font-size: 32px; box-shadow: 0 8px 22px rgba(23,59,82,.22); }
.bridge-line { margin-top: 10px; text-align: center; color: ${T.ink2}; font-weight: 750; }
.reveal-visible { opacity: 1 !important; transform: none !important; transition: opacity .5s, transform .5s; }

.position-foundation, .place-ladder, .rule-builder { margin-top: 20px; }
.position-number { min-height: 104px; border-radius: 20px; padding: 21px 104px 14px 24px; display: flex; align-items: center; gap: 22px; position: relative; color: ${T.navy}; background: linear-gradient(145deg,#F2FBFC,${T.cyanSoft}); box-shadow: 0 12px 28px rgba(23,59,82,.12); }
.position-number-label { font-family: 'JetBrains Mono', monospace; font-size: clamp(38px,6vw,60px); font-weight: 900; letter-spacing: .08em; }
.position-number p { color: ${T.navy}; font-weight: 800; line-height: 1.4; }
.listen-first-note { position: absolute; z-index: 3; top: 8px; right: 14px; color: #B77900; font-size: 12px; font-weight: 900; line-height: 1.15; }
.position-bit { position: absolute; z-index: 2; right: 15px; bottom: -9px; width: 74px; height: 92px; }
.position-place-grid { margin-top: 14px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
.position-place-card { min-height: 142px; border: 0; border-radius: 18px; padding: 12px; display: grid; place-items: center; gap: 5px; color: ${T.navy}; background: ${T.paper}; box-shadow: 0 7px 22px var(--shadow); cursor: pointer; transition: transform .24s, box-shadow .24s, background .24s; }
.position-place-card strong { font-family: 'JetBrains Mono', monospace; font-size: 38px; }
.position-place-card span { color: ${T.cyan}; font-weight: 900; }
.position-place-card small { min-height: 34px; color: ${T.ink2}; font-size: 11px; font-weight: 800; line-height: 1.25; }
.position-place-active, .position-place-card:hover { transform: translateY(-3px); box-shadow: 0 0 0 2px rgba(22,143,163,.32), 0 12px 25px rgba(22,143,163,.14); }
.position-place-seen { background: linear-gradient(145deg,#FFFFFF,${T.cyanSoft}); }

.place-ladder { border-radius: 24px; padding: 18px; background: linear-gradient(145deg,#FFFFFF,#F1F8F6); box-shadow: 0 16px 36px -28px rgba(${T.shadowBase},.62); }
.place-ladder-instruction, .roman-instruction { text-align: center; color: ${T.ink2}; font-weight: 850; }
.place-order-hint { margin: 7px 0 0; text-align: center; color: ${T.accent}; font-size: 12px; font-weight: 900; }
.place-ladder-track { margin-top: 14px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 34px; }
.place-ladder-step { min-height: 150px; border: 0; border-radius: 20px; padding: 12px; display: grid; place-items: center; gap: 4px; color: ${T.navy}; background: ${T.paper}; box-shadow: 0 7px 22px var(--shadow); cursor: pointer; transition: transform .28s, box-shadow .28s, background .28s; }
.place-ladder-step small { color: ${T.cyan}; font-weight: 900; }
.place-ladder-step strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(34px,5vw,52px); }
.place-ladder-step span { min-width: 56px; min-height: 32px; border-radius: 10px; display: grid; place-items: center; color: ${T.accent}; background: ${T.accentSoft}; font-family: 'JetBrains Mono', monospace; font-weight: 900; }
.place-ladder-active, .place-ladder-step:hover { transform: translateY(-5px); box-shadow: 0 0 0 3px rgba(255,91,53,.28), 0 14px 28px rgba(255,91,53,.14); }
.place-ladder-seen { background: linear-gradient(145deg,#FFFFFF,#FFF4EF); }

.roman-instruction { margin-bottom: 10px; }
.anchor-card { padding: 10px; gap: 6px; }
.anchor-card strong { font-family: 'Source Serif 4', serif; font-size: 28px; }
.anchor-card small { min-height: 20px; color: ${T.ink2}; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; }
.anchor-seen { background: linear-gradient(145deg,#FFFFFF,${T.cyanSoft}); }

.rule-builder { display: grid; gap: 12px; }
.rule-builder .theory-action-row { grid-template-columns: repeat(3,minmax(0,1fr)); }
.rule-builder-card { width: min(100%,660px); min-height: 156px; margin: 0 auto; border-radius: 22px; padding: 22px; display: grid; align-content: center; justify-items: center; gap: 14px; text-align: center; background: ${T.paper}; box-shadow: 0 10px 27px var(--shadow); }
.rule-builder-card strong { color: ${T.navy}; font-family: 'JetBrains Mono', monospace; font-size: clamp(26px,4vw,42px); }
.rule-builder-card p { color: ${T.ink2}; font-weight: 850; line-height: 1.45; }
.theory-action-seen { box-shadow: inset 0 -3px ${T.lime}, 0 5px 16px var(--shadow) !important; }
.warning-strip { opacity: 0; transform: translateY(10px); border-radius: 14px; padding: 11px 15px; color: #7A4A06; background: ${T.warnSoft}; text-align: center; font-weight: 900; }

.match-card:disabled, .method-card:disabled, .anchor-card:disabled, .theory-action-row button:disabled { cursor: default; opacity: .62; transform: none; }
.method-match { margin-top: 16px; border-radius: 24px; padding: 2px 14px 14px; background: linear-gradient(145deg,rgba(255,255,255,.72),rgba(229,245,246,.6)); }

.anchor-row { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
.anchor-card { min-height: 82px; border: 0; border-radius: 17px; display: grid; place-items: center; color: ${T.navy}; background: ${T.paper}; box-shadow: 0 7px 22px var(--shadow); cursor: pointer; font-family: 'Source Serif 4', serif; font-size: 30px; font-weight: 800; transition: transform .32s, box-shadow .32s, color .32s; }
.anchor-active { color: ${T.accent}; transform: translateY(-3px); box-shadow: 0 0 0 2px rgba(255,91,53,.32), 0 12px 25px rgba(255,91,53,.14); }
.roman-table { margin-top: 16px; display: grid; gap: 8px; }
.roman-row { opacity: 0; transform: translateY(8px); display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 7px; transition: opacity .55s, transform .55s; }
.roman-row-visible { opacity: 1; transform: none; }
.roman-row span { min-height: 48px; border-radius: 11px; display: grid; place-items: center; color: ${T.ink}; background: rgba(255,255,255,.82); box-shadow: 0 3px 12px rgba(${T.shadowBase},.08); font-family: 'Source Serif 4', serif; font-size: 19px; font-weight: 800; }
.roman-row .roman-subtract { color: ${T.accent}; background: ${T.accentSoft}; position: relative; }
.roman-row .roman-subtract::after { content: '↶'; position: absolute; top: -8px; color: ${T.accent}; font-size: 15px; animation: arc-pop 1.15s ease both; }
.rule-strip, .conclusion-band { margin-top: 16px; border-radius: 16px; padding: 15px 18px; color: ${T.navy}; background: ${T.cyanSoft}; font-weight: 850; line-height: 1.45; text-align: center; }

.highlighted-number-frame {
  width: min(760px,100%);
  min-height: 126px;
  margin: 15px auto 0;
  border: 1px solid rgba(22,143,163,.18);
  border-radius: 24px;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: ${T.navy};
  background: linear-gradient(145deg,#F4FCFD,${T.cyanSoft});
  box-shadow: 0 18px 38px -29px rgba(23,59,82,.54);
}
.highlighted-number-digits { display: flex; align-items: baseline; justify-content: center; gap: .04em; font-family: 'JetBrains Mono', monospace; font-size: clamp(56px,9vw,84px); font-weight: 950; letter-spacing: .045em; line-height: 1; }
.highlighted-number-target { min-width: .82em; border-radius: 14px; padding: .08em .05em; color: #FFFFFF; background: ${T.accent}; box-shadow: 0 9px 24px rgba(255,91,53,.25); text-align: center; }

.roman-hypothesis { margin-top: 18px; display: grid; gap: 14px; }
.roman-symbol-question { min-height: 150px; border: 1px solid rgba(22,143,163,.18); border-radius: 24px; display: grid; place-items: center; color: ${T.navy}; background: linear-gradient(145deg,#F4FCFD,${T.cyanSoft}); box-shadow: 0 18px 38px -29px rgba(23,59,82,.54); font-family: 'Source Serif 4',serif; font-size: clamp(52px,9vw,82px); font-weight: 850; letter-spacing: .18em; }
.hypothesis-options { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
.hypothesis-options button { min-height: 78px; border: 0; border-radius: 18px; padding: 12px 16px; display: flex; align-items: center; gap: 13px; color: ${T.ink}; background: ${T.paper}; box-shadow: 0 7px 22px var(--shadow); cursor: pointer; text-align: left; }
.hypothesis-options button > span { width: 34px; height: 34px; flex: 0 0 34px; border-radius: 10px; display: grid; place-items: center; color: ${T.cyan}; background: ${T.cyanSoft}; font-family: 'JetBrains Mono',monospace; font-weight: 900; }
.hypothesis-options button > strong { font-weight: 850; line-height: 1.35; }
.hypothesis-options button:hover, .hypothesis-options .hypothesis-picked { transform: translateY(-2px); box-shadow: 0 0 0 2px rgba(22,143,163,.26), 0 12px 25px rgba(22,143,163,.13); }
.hypothesis-options button:disabled { opacity: .56; cursor: default; transform: none; }

.roman-learning-frame { width: min(820px,100%); margin: 14px auto 0; border: 1px solid rgba(22,143,163,.17); border-radius: 24px; padding: 16px 18px; color: ${T.navy}; background: linear-gradient(145deg,#F6FCFD,${T.cyanSoft}); box-shadow: 0 18px 38px -29px rgba(23,59,82,.48); }
.neutral-hypothesis-note { margin: 0 0 7px; color: ${T.cyan}; font-size: 11px; font-weight: 900; text-align: center; }
.roman-learning-lead { margin: 0 0 12px; color: ${T.navy}; font-weight: 850; line-height: 1.4; text-align: center; }
.roman-learning-grid { display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: 8px; }
.roman-learning-grid article, .roman-learning-card { min-height: 72px; border: 1px solid rgba(22,143,163,.14); border-radius: 14px; display: grid; grid-template-columns: minmax(24px,.65fr) 1fr; align-items: center; overflow: hidden; background: rgba(255,255,255,.84); box-shadow: 0 6px 17px rgba(23,59,82,.08); }
.roman-learning-grid span { color: ${T.ink2}; font-family: 'JetBrains Mono',monospace; font-size: 14px; font-weight: 900; text-align: center; }
.roman-learning-grid strong { min-height: 100%; display: grid; place-items: center; color: ${T.navy}; background: rgba(22,143,163,.08); font-family: 'Source Serif 4',serif; font-size: clamp(22px,3vw,30px); }
.roman-learning-frame[data-g4-mechanic="RomanTable1To10"] .roman-learning-grid article { position: relative; transition: transform .28s ease, border-color .28s ease, background .28s ease, box-shadow .28s ease; }
.roman-learning-frame[data-g4-mechanic="RomanTable1To10"] .roman-learning-grid article > span,
.roman-learning-frame[data-g4-mechanic="RomanTable1To10"] .roman-learning-grid article > strong { transition: color .28s ease, background .28s ease; }
.roman-learning-frame[data-g4-mechanic="RomanTable1To10"] .roman-learning-card-active { z-index: 1; transform: translateY(-4px) scale(1.04); border-color: rgba(255,91,53,.58); background: #FFFFFF; box-shadow: 0 0 0 3px rgba(255,91,53,.24), 0 13px 25px rgba(255,91,53,.18); }
.roman-learning-frame[data-g4-mechanic="RomanTable1To10"] .roman-learning-card-active > span { color: ${T.accent}; }
.roman-learning-frame[data-g4-mechanic="RomanTable1To10"] .roman-learning-card-active > strong { color: #FFFFFF; background: ${T.accent}; }
.roman-learning-frame[data-g4-mechanic="RomanTable1To10"] .roman-learning-card-compare { border-color: rgba(22,143,163,.62); box-shadow: 0 0 0 3px rgba(22,143,163,.24), 0 13px 25px rgba(22,143,163,.19); }
.roman-learning-frame[data-g4-mechanic="RomanTable1To10"] .roman-learning-card-compare > span { color: ${T.cyan}; }
.roman-learning-frame[data-g4-mechanic="RomanTable1To10"] .roman-learning-card-compare > strong { background: ${T.cyan}; }
.roman-learning-grid-extended { grid-template-columns: repeat(5,minmax(0,1fr)); }
.roman-11-20-frame .local-action-row { justify-content: center; }

.single-model-layout { display: grid; justify-items: center; gap: 18px; }
.place-value-model-frame {
  width: min(760px, 100%);
  margin: 18px auto 0;
  padding: 8px 16px;
  border: 1px solid rgba(22,143,163,.13);
  border-radius: 24px;
  background:
    radial-gradient(circle at 85% 18%, rgba(255,91,53,.10), transparent 30%),
    linear-gradient(145deg, #FFFFFF, #F1F8F6);
  box-shadow: 0 20px 42px -31px rgba(${T.shadowBase},.58);
}
.place-value-city { width: min(100%, 600px); height: 105px; margin-bottom: -18px; position: relative; overflow: hidden; background: transparent; }
.place-value-city > svg { display: block; width: 100%; height: 100%; }
.place-battery-svg, .place-cassette-svg { filter: drop-shadow(0 4px 5px rgba(23,59,82,.25)); }
.place-value-bit { position: absolute; right: 13px; bottom: -8px; width: 62px; height: 78px; }
.place-quantity-ten, .place-quantity-one { transform-box: fill-box; transform-origin: center bottom; animation: token-drop .45s ease both; }
.place-value-model-frame .conclusion-band {
  width: 100%;
  margin-top: 8px;
  padding: 8px 10px;
  border: 1px solid rgba(22,143,163,.18);
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255,255,255,.92), rgba(229,245,246,.9));
  box-shadow: 0 7px 18px -16px rgba(23,59,82,.55);
  text-align: left;
}
.swap-scene { width: min(100%, 560px); min-height: 280px; border: 0; border-radius: 26px; padding: 24px; color: ${T.ink}; background: transparent; cursor: pointer; position: relative; }
.place-value-swap { width: min(100%, 600px); }
.place-value-swap:disabled { opacity: 1; cursor: default; }
.place-labels { display: grid; grid-template-columns: repeat(2, 1fr); color: ${T.ink3}; font-size: 11px; font-weight: 900; text-transform: uppercase; }
.digit-track { width: 280px; height: 115px; margin: 18px auto; display: grid; grid-template-columns: repeat(2, 1fr); position: relative; }
.digit { width: 96px; height: 105px; border-radius: 22px; display: grid; place-items: center; position: absolute; top: 0; color: white; background: ${T.navy}; box-shadow: 0 13px 28px rgba(23,59,82,.22); font-family: 'JetBrains Mono', monospace; font-size: 48px; font-weight: 900; transition: transform 1.1s cubic-bezier(.16,1,.3,1), background .3s; }
.digit small, .roman-token-track small { position: absolute; bottom: -26px; color: ${T.ink2}; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 900; }
.digit-one { left: 15px; background: ${T.accent}; }
.digit-four { right: 15px; }
.digit-track-moved .digit-one { transform: translateX(154px); }
.digit-track-moved .digit-four { transform: translateX(-154px); }
.swap-scene > strong { display: block; margin-top: 32px; color: ${T.navy}; font-family: 'JetBrains Mono', monospace; font-size: 28px; }
.roman-token-track { width: 260px; height: 110px; margin: 12px auto 28px; position: relative; }
.roman-token-track > span { width: 98px; height: 104px; border-radius: 22px; display: grid; place-items: center; position: absolute; top: 0; color: white; background: ${T.navy}; box-shadow: 0 13px 28px rgba(23,59,82,.22); font-family: 'Source Serif 4', serif; font-size: 52px; font-weight: 800; transition: transform 1.1s cubic-bezier(.16,1,.3,1); }
.roman-v { left: 12px; }
.roman-i { right: 12px; background: ${T.accent} !important; }
.roman-token-moved .roman-i { transform: translateX(-138px); }
.roman-token-moved .roman-v { transform: translateX(138px); }
.operation-arc { width: 132px; min-height: 44px; margin: 0 auto; border-radius: 99px; display: grid; place-items: center; color: ${T.cyan}; background: ${T.cyanSoft}; font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 900; }

.comparison-layout { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 18px; }
.comparison-model { min-height: 235px; display: flex; flex-direction: column; justify-content: center; gap: 24px; }
.comparison-formula { text-align: center; color: ${T.navy}; font-family: 'JetBrains Mono', monospace; font-size: clamp(34px, 5vw, 54px); font-weight: 900; }
.comparison-formula span { color: ${T.accent}; }
.comparison-result { opacity: 0; min-height: 0; border-radius: 16px; padding: 8px 12px; display: flex; align-items: center; justify-content: center; gap: 10px; text-align: center; background: ${T.paper}; box-shadow: 0 7px 21px var(--shadow); color: ${T.ink2}; font-weight: 850; }
.comparison-result i { width: 10px; height: 34px; border-radius: 5px; }
.decimal-mark { background: ${T.accent}; }
.roman-mark { background: ${T.cyan}; }
.mini-proof { grid-column: 1 / -1; opacity: 0; display: flex; justify-content: center; gap: 12px; }
.mini-proof span { min-height: 44px; padding: 0 20px; border-radius: 99px; display: grid; place-items: center; color: ${T.navy}; background: ${T.cyanSoft}; font-family: 'JetBrains Mono', monospace; font-weight: 900; }
.theory-action-row { grid-column: 1 / -1; width: min(100%,620px); margin: 0 auto; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; }
.theory-action-row button { min-height: 44px; border: 0; border-radius: 13px; padding: 7px 12px; color: ${T.cyan}; background: ${T.paper}; box-shadow: 0 5px 16px var(--shadow); cursor: pointer; font-weight: 850; }
.theory-action-row .theory-action-active { color: white; background: ${T.cyan}; }

.system-zone-layout { margin-top: 20px; }
.system-zones { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px; }
.system-zone { min-height: 300px; border-radius: 28px; padding: 28px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; text-align: center; opacity: .45; transform: scale(.96); transition: opacity .55s, transform .55s, box-shadow .55s; }
.positional-zone { background: ${T.accentSoft}; }
.nonpositional-zone { background: ${T.cyanSoft}; }
.zone-active { opacity: 1; transform: none; box-shadow: 0 13px 31px var(--shadow); }
.zone-example { min-height: 58px; padding: 0 22px; border-radius: 15px; display: grid; place-items: center; color: white; background: ${T.navy}; font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 900; }
.system-zone h2 { font-family: 'Source Serif 4', serif; font-size: 30px; }
.system-zone p { color: ${T.ink2}; font-weight: 800; line-height: 1.45; }

.strategy-layout { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px; }
.strategy-scanner { grid-column: 1 / -1; width: min(100%, 560px); height: 86px; margin: 0 auto -3px; position: relative; }
.strategy-scanner > svg { display: block; width: 100%; height: 100%; }
.strategy-scanner-bit { position: absolute; z-index: 2; right: -4px; bottom: -2px; width: 66px; height: 82px; }
.scanner-pulse { transition: cx .72s cubic-bezier(.16,1,.3,1); filter: drop-shadow(0 0 7px rgba(255,91,53,.55)); }
.strategy-column { min-height: 270px; border-radius: 26px; padding: 28px 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; opacity: .42; transform: translateY(10px); transition: opacity .5s, transform .5s, box-shadow .5s; background: rgba(255,255,255,.78); }
.strategy-active { opacity: 1; transform: none; box-shadow: 0 12px 29px var(--shadow); }
.strategy-column strong { color: ${T.navy}; font-family: 'Source Serif 4', serif; font-size: 58px; line-height: 1; }
.strategy-column span { min-height: 52px; border-radius: 14px; padding: 10px 15px; display: grid; place-items: center; text-align: center; color: ${T.cyan}; background: ${T.cyanSoft}; font-weight: 900; }
.strategy-column em { color: ${T.ink2}; font-family: 'JetBrains Mono', monospace; font-style: normal; font-weight: 800; }
.strategy-conclusion { grid-column: 1 / -1; }

.feedback { margin-top: 10px; min-height: 80px; border-radius: 18px; padding: 12px 16px; display: grid; grid-template-columns: 68px 1fr; align-items: center; gap: 12px; animation: feedback-in .5s both; }
.feedback-slot-hidden { visibility: hidden; opacity: 0; pointer-events: none; }
.feedback-slot-visible { visibility: visible; opacity: 1; }
.feedback-correct { color: ${T.success}; background: ${T.successSoft}; }
.feedback-wrong { color: ${T.warn}; background: ${T.warnSoft}; }
.feedback-bit { width: 64px; height: 72px; overflow: hidden; }
.feedback-bit .g1-char { width: 100%; height: 100%; }
.feedback-copy { display: flex; align-items: flex-start; gap: 10px; font-weight: 800; line-height: 1.45; }
.feedback-copy > strong { font-size: 23px; }

.matching-board { position: relative; margin-top: 24px; min-height: 330px; display: grid; grid-template-columns: minmax(120px,1fr) 80px minmax(120px,1fr); gap: 12px; align-items: center; }
.matching-board .match-card { position: relative; z-index: 2; }
.matching-column { display: grid; gap: 10px; }
.match-card { min-height: 58px; border: 0; border-radius: 14px; padding: 8px 14px; color: ${T.navy}; background: ${T.paper}; box-shadow: 0 6px 18px var(--shadow); cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 900; transition: transform .2s, box-shadow .2s; }
.match-card:hover, .match-selected { transform: translateY(-2px); box-shadow: 0 0 0 2px rgba(255,91,53,.34), 0 9px 21px rgba(255,91,53,.12); }
.match-card small { display: block; margin-top: 3px; color: ${T.success}; font-size: 10px; }
.match-done { color: ${T.success}; background: ${T.successSoft}; }
.match-wrong { color: #923A2D; background: #FFEAE4; box-shadow: 0 0 0 3px rgba(184,92,50,.4); }
.matching-connector-correct, .matching-connector-wrong { transition: stroke .55s ease; }
.sr-only { position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0,0,0,0) !important; white-space: nowrap !important; border: 0 !important; }
.roman-match { font-family: 'Source Serif 4', serif; font-size: 25px; }
.roman-learning-match { width: min(820px,100%); min-height: 292px; margin: 14px auto 0; padding: 14px; border-radius: 24px; background: linear-gradient(145deg,#F6FCFD,${T.cyanSoft}); }
.roman-learning-match .matching-column { width: 100%; }
.roman-learning-match > .matching-column-numbers { grid-column: 1; grid-row: 1; }
.roman-learning-match > .matching-column-romans { grid-column: 3; grid-row: 1; }
.roman-learning-match .match-card { width: 100%; min-height: 54px; border: 1px solid rgba(22,143,163,.18); color: ${T.navy}; background: ${T.cyanSoft}; }
.roman-learning-match .roman-match { letter-spacing: .08em; }
.roman-learning-match .match-done { color: ${T.success}; background: ${T.successSoft}; }
.match-lines { height: 100%; display: grid; align-content: space-around; }
.match-lines i { height: 2px; border-radius: 2px; background: linear-gradient(90deg, rgba(22,143,163,.08), rgba(22,143,163,.5), rgba(22,143,163,.08)); }

.constructor-scene { margin-top: 24px; }
.slot-row { min-height: 130px; display: flex; align-items: center; justify-content: center; gap: 14px; }
.symbol-slot, .source-symbol { width: 88px; min-height: 88px; border: 0; border-radius: 18px; display: grid; place-items: center; cursor: pointer; font-family: 'Source Serif 4', serif; font-size: 39px; font-weight: 800; }
.symbol-slot { color: ${T.ink3}; background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 2px rgba(23,59,82,.13); }
.slot-filled { color: white; background: ${T.navy}; box-shadow: 0 9px 24px rgba(23,59,82,.23); animation: token-drop .42s both; }
.source-cards { min-height: 110px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px; }
.source-symbol { color: ${T.navy}; background: ${T.paper}; box-shadow: 0 7px 20px var(--shadow); }
.source-symbol:hover { transform: translateY(-3px); }
.source-symbol:disabled { opacity: .22; transform: scale(.92); }
.local-action-row { display: flex; justify-content: flex-end; margin-top: 10px; }

.classification-scene { margin-top: 22px; }
.class-source { min-height: 92px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px; }
.class-card { min-width: 82px; min-height: 58px; border: 0; border-radius: 14px; color: ${T.navy}; background: ${T.paper}; box-shadow: 0 6px 18px var(--shadow); cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 900; }
.class-selected { color: white; background: ${T.accent}; transform: translateY(-3px); }
.class-bins { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; }
.class-bin { min-height: 220px; border: 0; border-radius: 24px; padding: 20px; cursor: pointer; color: ${T.ink}; }
.class-bin-p { background: ${T.accentSoft}; }
.class-bin-n { background: ${T.cyanSoft}; }
.class-bin > strong { display: block; font-family: 'Source Serif 4', serif; font-size: 25px; }
.class-bin > span { margin-top: 18px; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.class-bin i { min-width: 70px; min-height: 44px; border-radius: 12px; display: grid; place-items: center; color: ${T.navy}; background: white; box-shadow: 0 4px 13px var(--shadow); font-family: 'JetBrains Mono', monospace; font-style: normal; font-weight: 900; animation: token-drop .42s both; }

.error-claim { margin-top: 22px; min-height: 140px; border-radius: 22px; padding: 14px 22px; display: grid; grid-template-columns: 100px 1fr; align-items: center; gap: 18px; color: #923A2D; background: #FFEAE4; }
.error-bit { height: 112px; }
.error-bit .g1-char { width: 100%; height: 100%; }
.error-claim p { font-weight: 900; line-height: 1.45; }
.equation-claim { width: min(760px,100%); min-height: 132px; margin: 15px auto 0; padding: 16px 22px; grid-template-columns: 1fr; justify-items: center; color: ${T.navy}; background: linear-gradient(145deg,#F4FCFD,${T.cyanSoft}); }
.equation-claim p { margin: 0; color: ${T.navy}; font-family: 'JetBrains Mono',monospace; font-size: clamp(46px,8vw,72px); font-weight: 950; line-height: 1; letter-spacing: .035em; text-align: center; }
.main-light-blue-frame { color: ${T.navy}; background: ${T.cyanSoft}; }

.method-source { margin-top: 12px; min-height: 76px; display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 12px; }
.method-card { min-height: 58px; max-width: 340px; border: 0; border-radius: 15px; padding: 12px 18px; color: ${T.navy}; background: ${T.paper}; box-shadow: 0 7px 20px var(--shadow); cursor: pointer; font-weight: 900; }
.method-selected { color: white; background: ${T.accent}; transform: translateY(-3px); }
.code-targets { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px; }
.code-target { min-height: 176px; border: 0; border-radius: 25px; padding: 17px 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 11px; color: ${T.ink}; background: ${T.navy}; cursor: pointer; box-shadow: 0 13px 30px rgba(23,59,82,.22); }
.code-target > strong { color: white; font-family: 'Source Serif 4', serif; font-size: 54px; }
.code-target > span { min-height: 56px; width: 100%; border-radius: 14px; padding: 10px; display: grid; place-items: center; color: ${T.navy}; background: white; font-weight: 900; }
.code-target > em { color: #9DEBF7; font-family: 'JetBrains Mono', monospace; font-style: normal; font-weight: 800; }
.code-target:disabled { cursor: default; opacity: 1; }
.method-retry-row { justify-content: flex-end; }

.finale-layout { display: grid; gap: 12px; }
.final-reflection { display: grid; gap: 7px; }
.final-reflection > strong { color: ${T.ink2}; font-size: 11px; }
.final-reflection-options { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 7px; }
.final-reflection-options button { min-height: 42px; border: 0; border-radius: 12px; padding: 6px 8px; color: ${T.ink2}; background: ${T.paper}; box-shadow: 0 4px 14px var(--shadow); cursor: pointer; font-size: 10px; font-weight: 850; }
.final-reflection-options .reflection-selected { color: white; background: ${T.cyan}; }
.finale-heading { padding: 12px 16px; display: grid; gap: 4px; border-left: 5px solid ${T.accent}; border-radius: 0 17px 17px 0; background: rgba(255,255,255,.78); box-shadow: 0 8px 22px var(--shadow); }
.finale-heading > span { color: ${T.accent}; font-size: 9px; font-weight: 900; letter-spacing: .11em; }
.finale-heading h1 { margin: 0; color: ${T.ink}; font-family: 'Source Serif 4', serif; font-size: clamp(21px,3.3vw,29px); line-height: 1.08; }
.finale-heading p { color: ${T.ink2}; font-size: 11px; font-weight: 750; line-height: 1.35; }
.finale-main-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 12px; }
.finale-payoff,
.finale-mastery { min-width: 0; border-radius: 20px; padding: 14px; background: rgba(255,255,255,.76); box-shadow: 0 8px 22px var(--shadow); }
.finale-payoff { opacity: 0; display: grid; align-content: center; gap: 10px; }
.finale-section-kicker { color: ${T.cyan}; font-size: 9px; font-weight: 900; letter-spacing: .1em; }
.finale-payoff-models { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; }
.finale-payoff-models > div { min-width: 0; border-radius: 13px; padding: 10px 7px; display: grid; justify-items: center; gap: 6px; background: ${T.paper}; }
.finale-payoff-models strong { color: ${T.navy}; font-family: 'JetBrains Mono', monospace; font-size: 18px; }
.finale-payoff-models span { color: ${T.cyan}; font-size: 10px; font-weight: 900; }
.finale-hook-result { display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; gap: 10px; }
.finale-hook-result b { padding: 8px 12px; border-radius: 12px; color: white; background: ${T.success}; font: 900 18px/1 'JetBrains Mono', monospace; }
.finale-hook-result p { color: ${T.ink2}; font-size: 11px; font-weight: 800; line-height: 1.35; }
.summary-points { margin-top: 9px !important; display: grid; gap: 7px; list-style: none; }
.summary-points li { opacity: 0; min-height: 48px; border-radius: 13px; padding: 8px 10px; display: flex; align-items: center; gap: 9px; color: ${T.ink2}; background: ${T.paper}; font-size: 11px; font-weight: 800; line-height: 1.3; }
.summary-points li > span { width: 28px; height: 28px; flex: 0 0 28px; border-radius: 50%; display: grid; place-items: center; color: white; background: ${T.success}; }
.finale-reward { position: relative; opacity: .52; min-height: 132px; border-radius: 22px; padding: 12px 22px; display: grid; grid-template-columns: 84px 106px minmax(0,1fr); align-items: center; gap: 15px; color: white; background: ${T.navy}; overflow: hidden; transform: translateY(7px); }
.finale-reward-ready { opacity: 1; transform: none; }
.summary-bit { z-index: 1; height: 116px; }
.summary-bit .g1-char { width: 100%; height: 100%; }
.medal { display: grid; justify-items: center; gap: 8px; text-align: center; color: white; font-size: 10px; font-weight: 900; letter-spacing: .06em; }
.medal i { width: 74px; height: 74px; border-radius: 50%; display: grid; place-items: center; color: #704800; background: radial-gradient(circle at 35% 28%, #FFF0A0, #FFC23C 57%, #D69300); box-shadow: 0 0 0 8px rgba(255,194,60,.12), 0 12px 24px rgba(0,0,0,.22); font-size: 32px; font-style: normal; animation: medal-in 1.1s cubic-bezier(.16,1,.3,1) both; }
.finale-reward:not(.finale-reward-ready) .medal i { color: #B7C3CA; background: radial-gradient(circle at 35% 28%,#F5F7F8,#B9C5CB 68%,#87949D); box-shadow: 0 0 0 7px rgba(255,255,255,.07); }
.finale-medal { z-index: 1; }
.finale-reward-copy { z-index: 1; min-width: 0; display: grid; gap: 5px; }
.finale-reward-copy > span { color: #9DEBF7; font-size: 9px; font-weight: 900; letter-spacing: .1em; }
.finale-reward-copy > strong { font-family: 'Source Serif 4', serif; font-size: clamp(18px,2.4vw,25px); line-height: 1.08; }
.finale-reward-copy > small { color: rgba(255,255,255,.7); font-size: 10px; font-weight: 800; }
.finale-status { display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; gap: 8px; }
.finale-status > b { color: #FFC23C; font: 900 20px/1 'JetBrains Mono', monospace; }
.finale-status > span { display: grid; gap: 2px; color: white; font-size: 9px; font-weight: 850; }
.finale-status small { color: rgba(255,255,255,.68); font-size: 8px; }
.finale-confetti { position: absolute; inset: 0; pointer-events: none; }
.finale-confetti i { position: absolute; width: 6px; height: 11px; border-radius: 2px; background: ${T.accent}; animation: finale-confetti 1.25s cubic-bezier(.16,1,.3,1) both; }
.finale-confetti i:nth-child(1) { left: 8%; top: 11%; transform: rotate(17deg); }
.finale-confetti i:nth-child(2) { left: 22%; top: 72%; background: #FFC23C; transform: rotate(-24deg); }
.finale-confetti i:nth-child(3) { left: 38%; top: 18%; background: #9DEBF7; transform: rotate(35deg); }
.finale-confetti i:nth-child(4) { left: 51%; top: 76%; background: ${T.lime}; transform: rotate(-12deg); }
.finale-confetti i:nth-child(5) { left: 66%; top: 13%; background: #FFC23C; transform: rotate(28deg); }
.finale-confetti i:nth-child(6) { left: 78%; top: 70%; background: #9DEBF7; transform: rotate(-30deg); }
.finale-confetti i:nth-child(7) { left: 89%; top: 20%; background: ${T.lime}; transform: rotate(12deg); }
.finale-confetti i:nth-child(8) { left: 95%; top: 67%; transform: rotate(-18deg); }
.summary-visible { opacity: 1 !important; transform: none !important; transition: opacity .58s, transform .58s; }
.next-bridge { border-radius: 16px; padding: 11px 15px; display: grid; gap: 3px; color: white; background: ${T.navy}; }
.next-bridge > span { color: #9DEBF7; font-size: 8px; font-weight: 900; letter-spacing: .1em; }
.next-bridge > strong { font-family: 'Source Serif 4', serif; font-size: 14px; line-height: 1.25; }

.g1-char { display: block; height: 100%; width: auto; filter: drop-shadow(0 6px 12px rgba(58,53,48,.22)); }
.g1-eyes { transform-box: fill-box; transform-origin: center; animation: g4blink 4.4s 2; }
.g1-bit-ant { transform-box: fill-box; transform-origin: bottom center; animation: g4antbob 2.4s ease-in-out 2; }
.g1-bit-wave { transform-box: fill-box; transform-origin: bottom left; animation: g4wavebig 2.4s ease-in-out 2; }
.bit-wave-left, .bit-wave-right, .bit-think-hand, .bit-point-arm, .bit-idea-bulb,
.bit-focus-hands, .bit-focus-scan, .bit-nod-hand, .bit-nod-check { transform-box: fill-box; transform-origin: center; }
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

@keyframes rise-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes feedback-in { from { opacity: 0; transform: translateY(10px) scale(.98); } to { opacity: 1; transform: none; } }
@keyframes arc-pop { from { opacity: 0; transform: translateY(5px) scale(.7); } to { opacity: 1; transform: none; } }
@keyframes token-drop { from { opacity: 0; transform: translateY(-10px) scale(.9); } to { opacity: 1; transform: none; } }
@keyframes medal-in { from { opacity: 0; transform: translateY(18px) rotate(-12deg) scale(.55); } to { opacity: 1; transform: none; } }
@keyframes finale-confetti { from { opacity: 0; translate: 0 -14px; rotate: 0deg; } to { opacity: .82; } }
@keyframes g4blink { 0%,93%,100% { transform: scaleY(1); } 96.5% { transform: scaleY(.12); } }
@keyframes g4antbob { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
@keyframes g4wavebig { 0%,100% { transform: rotate(2deg); } 50% { transform: rotate(-26deg); } }
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

@media (max-width: 640px) {
  .lesson-root { width: 390px; height: 100dvh; }
  .lesson-root .stage-header { padding-top: 8px; }
  .lesson-root.lesson-root-preview .stage-header { padding-top: 60px; }
  .stage-chrome { min-height: 36px; gap: 5px; }
  .chrome-title { font-size: 8px; }
  .screen-type { display: none; }
  .screen-count { font-size: 8px; }
  .stage-content { padding-top: 2px; padding-bottom: 16px; }
  .stage-fit > h1 { font-size: 25px; line-height: 1.08; }
  .stage-nav { min-height: 66px; padding-top: 7px; padding-bottom: 9px; }
  .btn { min-height: 44px; padding: 0 15px; font-size: 12px; }
  .hook-scene { margin-top: 8px; min-height: 174px; padding: 9px 11px; grid-template-columns: 72px minmax(0,1fr) 72px; gap: 8px; border-radius: 21px; }
  .hook-scene::after { border-radius: 17px; }
  .hook-bit { height: 102px; }
  .hook-code-panel { left: 10px; right: 76px; min-height: 124px; padding: 10px 12px; border-radius: 15px; gap: 7px; }
  .hook-code-label { font-size: 7px; letter-spacing: .08em; }
  .hook-code-values { justify-content: flex-start; gap: 11px; }
  .hook-code-values strong { font-size: 36px; }
  .hook-code-values i { width: 27px; height: 27px; font-size: 17px; }
  .hook-code-digits { justify-content: flex-start; gap: 4px; font-size: 11px; }
  .hook-code-digits span { min-width: 23px; min-height: 23px; }
  .position-foundation, .place-ladder, .rule-builder { margin-top: 12px; }
  .position-number { min-height: 82px; padding: 20px 67px 8px 12px; gap: 10px; border-radius: 15px; }
  .position-number-label { font-size: 31px; }
  .position-number p { font-size: 10px; }
  .listen-first-note { top: 5px; right: 8px; font-size: 12px; }
  .position-bit { right: 7px; width: 53px; height: 67px; }
  .position-place-grid { margin-top: 8px; gap: 6px; }
  .position-place-card { min-height: 105px; padding: 6px 4px; border-radius: 13px; }
  .position-place-card strong { font-size: 27px; }
  .position-place-card span { font-size: 10px; }
  .position-place-card small { min-height: 27px; font-size: 8px; }
  .place-ladder { padding: 10px; border-radius: 17px; }
  .place-ladder-instruction, .roman-instruction { font-size: 10px; }
  .place-ladder-track { margin-top: 8px; gap: 7px; }
  .place-ladder-step { min-height: 112px; padding: 7px 3px; border-radius: 14px; }
  .place-ladder-step small { font-size: 9px; }
  .place-ladder-step strong { font-size: 29px; }
  .place-ladder-step span { min-width: 42px; min-height: 26px; font-size: 10px; }
  .choice-grid { grid-template-columns: 1fr; gap: 8px; margin-top: 12px; }
  .choice-grid.choice-grid-two { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .choice-grid.choice-grid-single { grid-template-columns: 1fr; }
  .choice-card { min-height: 58px; border-radius: 14px; padding: 9px 11px; font-size: 12px; }
  .choice-grid-two .choice-card { min-height: 54px; padding: 7px 8px; gap: 7px; font-size: 10px; }
  .choice-grid-two .choice-letter { width: 25px; height: 25px; flex-basis: 25px; }
  .choice-letter { width: 28px; height: 28px; flex-basis: 28px; }
  .recall-layout, .single-model-layout, .roman-board, .comparison-layout, .system-zones, .strategy-layout, .summary-layout { margin-top: 17px; }
  .scene-bit { width: 54px; height: 68px; flex-basis: 54px; }
  .recall-bit { right: -4px; top: -11px; width: 49px; height: 61px; }
  .number-row { min-height: 112px; gap: 8px; }
  .number-chip { min-width: calc(50% - 6px); min-height: 54px; border-radius: 13px; font-size: 23px; }
  .roman-preview { min-height: 70px; gap: 7px; }
  .roman-preview span { min-width: 70px; min-height: 50px; font-size: 23px; }
  .anchor-row { gap: 7px; }
  .anchor-card { min-height: 58px; font-size: 21px; border-radius: 13px; }
  .anchor-card strong { font-size: 20px; }
  .anchor-card small { min-height: 16px; font-size: 7px; }
  .roman-table { gap: 5px; margin-top: 10px; }
  .roman-row { gap: 4px; }
  .roman-row span { min-height: 39px; font-size: 15px; border-radius: 8px; }
  .highlighted-number-frame { min-height: 92px; margin-top: 9px; border-radius: 17px; }
  .highlighted-number-digits { font-size: 48px; }
  .highlighted-number-target { border-radius: 10px; }
  .roman-hypothesis { margin-top: 10px; gap: 9px; }
  .roman-symbol-question { min-height: 100px; border-radius: 17px; font-size: 47px; }
  .hypothesis-options { gap: 7px; }
  .hypothesis-options button { min-height: 66px; border-radius: 14px; padding: 8px; gap: 7px; font-size: 10px; }
  .hypothesis-options button > span { width: 27px; height: 27px; flex-basis: 27px; border-radius: 8px; }
  .roman-learning-frame { margin-top: 8px; padding: 10px 8px; border-radius: 17px; }
  .neutral-hypothesis-note { margin-bottom: 4px; font-size: 8px; }
  .roman-learning-lead { margin-bottom: 7px; font-size: 9px; }
  .roman-learning-grid, .roman-learning-grid-extended { gap: 4px; }
  .roman-learning-grid article, .roman-learning-card { min-height: 50px; border-radius: 9px; grid-template-columns: 1fr; grid-template-rows: 18px 1fr; }
  .roman-learning-grid span { font-size: 9px; }
  .roman-learning-grid strong { font-size: 16px; }
  .rule-strip, .conclusion-band { margin-top: 10px; padding: 10px 12px; font-size: 11px; }
  .place-value-model-frame { margin-top: 17px; padding: 8px 12px; }
  .place-value-model-frame .conclusion-band { margin-top: 8px; padding: 8px 10px; }
  .place-value-city { height: 78px; margin-bottom: -13px; }
  .place-value-bit { right: 5px; bottom: -6px; width: 45px; height: 57px; }
  .swap-scene { min-height: 240px; padding: 12px; }
  .digit-track { width: 250px; }
  .digit { width: 84px; height: 94px; font-size: 41px; }
  .digit-track-moved .digit-one { transform: translateX(136px); }
  .digit-track-moved .digit-four { transform: translateX(-136px); }
  .comparison-layout, .system-zones, .strategy-layout { grid-template-columns: 1fr; gap: 10px; }
  .theory-action-row { gap: 6px; }
  .theory-action-row button { min-height: 44px; padding: 5px 7px; font-size: 9px; }
  .rule-builder .theory-action-row { gap: 4px; }
  .rule-builder .theory-action-row button { padding: 4px; font-size: 8px; }
  .rule-builder-card { min-height: 116px; padding: 12px; border-radius: 16px; gap: 8px; }
  .rule-builder-card strong { font-size: 24px; }
  .rule-builder-card p { font-size: 10px; }
  .warning-strip { padding: 8px 10px; font-size: 10px; }
  .comparison-model { min-height: 126px; gap: 10px; }
  .comparison-formula { font-size: 32px; }
  .comparison-result { min-height: 0; padding: 6px 10px; font-size: 11px; }
  .system-zone { min-height: 175px; padding: 16px; gap: 9px; border-radius: 18px; }
  .system-zone-layout { margin-top: 12px; }
  .zone-example { min-height: 45px; font-size: 20px; }
  .system-zone h2 { font-size: 23px; }
  .system-zone p { font-size: 11px; }
  .strategy-column { min-height: 160px; padding: 14px; gap: 10px; border-radius: 18px; }
  .strategy-scanner { height: 62px; margin-bottom: -5px; }
  .strategy-scanner-bit { right: -1px; width: 48px; height: 60px; }
  .strategy-column strong { font-size: 39px; }
  .strategy-column span { min-height: 43px; font-size: 11px; }
  .strategy-column em { font-size: 10px; }
  .feedback { min-height: 68px; grid-template-columns: 52px 1fr; padding: 8px 10px; font-size: 11px; }
  .feedback-bit { width: 48px; height: 58px; }
  .matching-board { min-height: 285px; grid-template-columns: 1fr 30px 1fr; gap: 6px; }
  .roman-learning-match { min-height: 252px; margin-top: 8px; padding: 8px; border-radius: 17px; }
  .match-card { min-height: 50px; padding: 6px 8px; font-size: 16px; }
  .symbol-slot, .source-symbol { width: 64px; min-height: 64px; border-radius: 14px; font-size: 29px; }
  .slot-row { min-height: 92px; gap: 9px; }
  .source-cards { min-height: 82px; gap: 8px; }
  .class-source { min-height: 75px; }
  .class-card { min-width: 68px; min-height: 48px; font-size: 16px; }
  .class-bins { gap: 9px; }
  .class-bin { min-height: 165px; padding: 12px 8px; border-radius: 18px; }
  .class-bin > strong { font-size: 18px; }
  .class-bin i { min-width: 58px; min-height: 40px; font-size: 12px; }
  .error-claim { min-height: 112px; grid-template-columns: 74px 1fr; padding: 9px 12px; gap: 9px; font-size: 11px; }
  .equation-claim { min-height: 96px; grid-template-columns: 1fr; padding: 10px; }
  .equation-claim p { font-size: 40px; }
  .error-bit { height: 84px; }
  .method-source { min-height: 74px; gap: 8px; }
  .method-match { margin-top: 10px; padding: 2px 8px 9px; border-radius: 17px; }
  .method-card { min-height: 49px; padding: 8px 11px; font-size: 11px; }
  .code-targets { gap: 9px; }
  .code-target { min-height: 138px; padding: 10px 8px; border-radius: 18px; gap: 7px; }
  .code-target > strong { font-size: 38px; }
  .code-target > span { min-height: 49px; font-size: 10px; }
  .code-target > em { font-size: 9px; }
  .finale-layout { gap: 8px; }
  .final-reflection { gap: 5px; }
  .final-reflection > strong { font-size: 9px; }
  .final-reflection-options { gap: 4px; }
  .final-reflection-options button { min-height: 44px; padding: 4px; font-size: 8px; }
  .finale-heading { padding: 10px 12px; }
  .finale-heading h1 { font-size: 21px; }
  .finale-heading p { font-size: 9px; }
  .finale-main-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .finale-payoff, .finale-mastery { padding: 10px; border-radius: 16px; }
  .finale-payoff-models > div { padding: 7px 5px; }
  .finale-payoff-models strong { font-size: 15px; }
  .finale-hook-result p { font-size: 9px; }
  .summary-points { gap: 5px; }
  .summary-points li { min-height: 42px; padding: 6px 8px; font-size: 9px; }
  .summary-points li > span { width: 24px; height: 24px; flex-basis: 24px; }
  .finale-reward { min-height: 108px; padding: 8px 10px; grid-template-columns: 58px 72px minmax(0,1fr); gap: 7px; }
  .summary-bit { height: 88px; }
  .medal i { width: 55px; height: 55px; font-size: 23px; }
  .medal span { font-size: 7px; }
  .finale-reward-copy > span { font-size: 7px; }
  .finale-reward-copy > strong { font-size: 14px; }
  .finale-reward-copy > small { font-size: 8px; }
  .next-bridge { padding: 9px 11px; }
  .next-bridge > strong { font-size: 11px; }
}

@media (max-width: 639.98px) and (max-height: 700px) {
  .stage-header { padding-top: 6px; padding-bottom: 5px; }
  .progress-track { height: 4px; margin-bottom: 5px; }
  .stage-content { padding-top: 0; padding-bottom: 0; }
  .stage-content > .stage-fit { zoom: .72; }
  .stage-nav { min-height: 54px; padding-top: 4px; padding-bottom: 4px; }
  .btn, .choice-card, .theory-action-row button, .final-reflection-options button { min-height: 44px; }
}

@media (max-height: 780px) {
  .summary-layout.finale-layout { margin-top: 12px; }
  .finale-layout { gap: 8px; }
}

@media (min-width: 641px) and (max-height: 780px) {
  .strategy-layout { margin-top: 8px; }
}

@media (prefers-reduced-motion: reduce) {
  .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .001ms !important; animation-iteration-count: 1 !important;
    scroll-behavior: auto !important; transition-duration: .001ms !important;
  }
  .finale-payoff,
  .summary-points li,
  .finale-reward { opacity: 1 !important; transform: none !important; }
}
/* Grade 4 Dars01 local visual contract */
.lesson-frame .preview-language{display:none!important}
:is(.lesson-root,.d8-root):has([data-g4-screen="hook"]) .stage-content>:is(.stage-fit,.screen-stack){zoom:1!important;transform:none!important}
@media(max-width:639.98px){:is(.lesson-root,.d8-root):has([data-g4-screen="hook"]){width:100%!important;max-width:100%!important;zoom:1!important}:is(.lesson-root,.d8-root):has([data-g4-screen="hook"]) .stage{width:100%!important;max-width:100%!important}}
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
.hook-contract-intro{width:100%;min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:8px}
:is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"][data-g4-role~="visual-frame"],
:is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{width:min(760px,100%);margin-inline:auto;min-height:206px;border-radius:24px;overflow:hidden}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"]{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;grid-template-columns:62px minmax(0,1fr)}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:62px;height:76px}
:is(.lesson-root,.d8-root) [data-g4-feedback="solution"]{min-height:72px;padding:7px 12px 7px 6px;border-radius:15px;grid-template-columns:51px minmax(0,1fr);background:linear-gradient(135deg,#FFFFFF,#E7F3EC)}
:is(.lesson-root,.d8-root) [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:51px;height:64px}
:is(.lesson-root,.d8-root) [data-g4-feedback="wrong"]{background:linear-gradient(135deg,#FFFFFF,#FFF5D9)}
.lesson-root .g4-title-card-stage{min-height:116px;padding:12px 67px 11px;border-radius:17px}
.lesson-root .g4-title-card-stage .g4-title-card-medal{width:44px;height:44px}
@media(max-width:639.98px){
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-title"]{font-size:25px}
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"][data-g4-role~="visual-frame"],
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}
  :is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:54px;height:68px}
  :is(.lesson-root,.d8-root) [data-g4-feedback="solution"]{min-height:68px}
  :is(.lesson-root,.d8-root) [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:47px;height:59px}
  .lesson-root .g4-title-card-stage{min-height:88px;padding:9px 51px 8px;border-radius:14px}
  .lesson-root .g4-title-card-stage .g4-title-card-medal{width:34px;height:34px}
  .lesson-root .hook-screen>.feedback-slot-hidden{display:none!important}
  .lesson-root .hook-screen>.choice-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:8px}
  .lesson-root .hook-screen>.choice-grid .choice-card{min-height:44px;padding:5px 6px;gap:5px;font-size:11px;line-height:1.2}
  .lesson-root .hook-screen>.choice-grid .choice-letter{width:24px;height:24px;flex-basis:24px}
  .lesson-root .hook-screen:has([data-g4-feedback]){display:grid;align-content:start;gap:6px}
  .lesson-root .hook-screen:has([data-g4-feedback])>.hook-contract-intro{gap:0}
  .lesson-root .hook-screen:has([data-g4-feedback])>.hook-contract-intro>[data-g4-role~="hook-topic"],
  .lesson-root .hook-screen:has([data-g4-feedback])>[data-g4-role~="hook-scene"]{display:none!important}
  .lesson-root .hook-screen:has([data-g4-feedback])>.hook-contract-intro>[data-g4-role~="hook-question"]{margin:0}
  .lesson-root .hook-screen:has([data-g4-feedback])>.choice-grid{grid-template-columns:1fr;margin-top:0}
  .lesson-root .hook-screen:has([data-g4-feedback])>.feedback{margin-top:0!important}
  .lesson-root .stage:not(.stage-hook) .stage-fit:has([data-g4-feedback]) [data-g4-feedback]{zoom:1.3888889}
  .lesson-root .stage:not(.stage-hook) .stage-fit:has([data-g4-feedback]) [data-g4-feedback="wrong"]{min-height:calc(88px / var(--g4z,1));grid-template-columns:calc(54px / var(--g4z,1)) minmax(0,1fr)}
  .lesson-root .stage:not(.stage-hook) .stage-fit:has([data-g4-feedback]) [data-g4-feedback="wrong"] [data-g4-role~="feedback-bit"]{width:calc(54px / var(--g4z,1));height:calc(68px / var(--g4z,1))}
  .lesson-root .stage:not(.stage-hook) .stage-fit:has([data-g4-feedback]) [data-g4-feedback="solution"]{min-height:calc(68px / var(--g4z,1));grid-template-columns:calc(47px / var(--g4z,1)) minmax(0,1fr)}
  .lesson-root .stage:not(.stage-hook) .stage-fit:has([data-g4-feedback]) [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:calc(47px / var(--g4z,1));height:calc(59px / var(--g4z,1))}
  .lesson-root .stage-summary .g4-title-card-stage{zoom:1.3888889;min-height:calc(88px / var(--g4z,1));padding:calc(9px / var(--g4z,1)) calc(51px / var(--g4z,1)) calc(8px / var(--g4z,1))}
  .lesson-root .stage-summary .g4-title-card-stage .g4-title-card-medal{width:calc(34px / var(--g4z,1));height:calc(34px / var(--g4z,1))}
}
@media(max-width:639.98px) and (min-height:700.01px){
  .lesson-root .stage-summary .g4-title-card-stage{zoom:1}
  .lesson-root .stage:not(.stage-hook) .stage-fit:has([data-g4-feedback]) [data-g4-feedback]{zoom:1}
  .lesson-root .stage:not(.stage-hook) .stage-fit:has([data-g4-feedback]) [data-g4-feedback="wrong"]{min-height:88px;grid-template-columns:54px minmax(0,1fr)}
  .lesson-root .stage:not(.stage-hook) .stage-fit:has([data-g4-feedback]) [data-g4-feedback="wrong"] [data-g4-role~="feedback-bit"]{width:54px;height:68px}
  .lesson-root .stage:not(.stage-hook) .stage-fit:has([data-g4-feedback]) [data-g4-feedback="solution"]{min-height:68px;grid-template-columns:47px minmax(0,1fr)}
  .lesson-root .stage:not(.stage-hook) .stage-fit:has([data-g4-feedback]) [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:47px;height:59px}
}
.lesson-root [data-g4-screen="hook"]>.hook-contract-intro>[data-g4-role~="hook-title"]{font-size:clamp(25px,calc(4.2vw - 1px),35px)}
@media(max-width:639.98px){
  .lesson-root [data-g4-screen="hook"]>.hook-contract-intro>[data-g4-role~="hook-title"]{font-size:24px}
}
.lesson-root [data-g4-screen="hook"]>[data-g4-role~="feedback-frame"] .feedback-copy>strong{font-size:16px}
.lesson-root [data-g4-screen="hook"]>[data-g4-role~="feedback-frame"] .feedback-copy>div{font-size:14px}
`;
