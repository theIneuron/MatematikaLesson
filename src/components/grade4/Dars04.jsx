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
.g4-title-claim{width:100%;min-height:96px;padding:12px 18px;border:0;border-radius:17px;display:grid;grid-template-columns:42px 1fr;align-items:center;gap:12px;color:#fff;background:linear-gradient(135deg,#0E6978,#173B52);box-shadow:0 22px 42px -25px rgba(14,105,120,.9);text-align:left;cursor:pointer;transition:transform .5s ease,box-shadow .5s ease}.g4-title-claim>span{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);font-size:19px}.g4-title-claim>strong{font:750 16px/1.2 'Source Serif 4',Georgia,serif}.g4-title-claim:hover:not(:disabled){transform:translateY(-2px)}.g4-title-claim:disabled{cursor:default;filter:saturate(.55);opacity:.68}
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
  useEffect(() => { if (!active || shownRef.current || typeof window === 'undefined') return undefined; let timer; const frame = window.requestAnimationFrame(() => { shownRef.current = true; setVisible(true); const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches; timer = window.setTimeout(() => setVisible(false), reduced ? 120 : 3900); }); return () => { window.cancelAnimationFrame(frame); window.clearTimeout(timer); }; }, [active]);
  if (!visible || typeof document === 'undefined') return null;
  return createPortal(<div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={lang === 'en' ? `Title: ${title}` : lang === 'ru' ? `Звание: ${title}` : `Unvon: ${title}`}><div className="rank-boost-card g4-title-reveal-card"><div className="g4-title-reveal-rays" aria-hidden="true" /><div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }} />)}</div><div className="rank-boost-medal g4-title-reveal-medal" aria-hidden="true">★</div><h2>{title}</h2></div></div>, document.body);
}

function G4TitleCard({ title, lang, firstTry, totalScored }) {
  return <div className="g4-title-card-stage" data-g4-role="title-card" role="status" aria-live="polite" aria-atomic="true"><div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div><div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy" /></div><div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{lang === 'en' ? "TITLE EARNED" : lang === 'ru' ? 'ЗВАНИЕ ПОЛУЧЕНО' : 'UNVON OLINDI'}</span><h2>{title}</h2><div className="g4-title-card-score"><strong>{firstTry}/{totalScored}</strong><span>{lang === 'en' ? "on the first attempt" : lang === 'ru' ? 'с первой попытки' : 'birinchi urinishda'}</span></div></div>;
}

// ============================================================================
// 4-SINF · Dars04 · Ko'p xonali sonlarni taqqoslash
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

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Сигнал из Лумо Сити', uz: 'Lumo Sitidan signal', en: "Signal from Lumo City" },
    title: { ru: 'Бит поставил короткий маршрут первым', uz: "Bit qisqa yo'nalishni birinchi qo'ydi", en: "Bit put short route first" },
    lead: {
      ru: 'Сортировщик сравнил только последние цифры и решил, что 842 107 больше 842 190. Из-за этого городские машины получили неверный порядок.',
      uz: "Saralash qurilmasi faqat oxirgi raqamlarni taqqosladi va 842 107 soni 842 190 sonidan katta deb o'yladi. Shahar mashinalari noto'g'ri tartib oldi.",
      en: "The sorter compared only the last digits and decided that 842,107 was greater than 842,190. As a result, the city vehicles were put in the wrong order.",
    },
    badge: { ru: 'СБОЙ СОРТИРОВКИ', uz: 'SARALASH XATOSI', en: "SORTING ERROR" },
    prompt: { ru: 'Разберём, где число действительно становится больше.', uz: "Son qayerda haqiqatan katta bo'lishini aniqlaymiz.", en: "Let's see where the number really gets bigger." },
    hookQuestion: { ru: 'С какой стороны нужно начинать сравнение?', uz: 'Taqqoslashni qaysi tomondan boshlash kerak?', en: "From which side should the comparison begin?" },
    options: [
      { ru: 'Слева, со старшего разряда', uz: 'Chapdan, eng katta xonadan', en: 'From the left, at the highest place' },
      { ru: 'Справа, с последней цифры', uz: "O'ngdan, oxirgi raqamdan", en: 'From the right, at the last digit' },
      { ru: 'Сложить цифры каждого числа', uz: "Har bir sonning raqamlarini qo'shish", en: 'Add the digits in each number' },
    ],
    correctIndex: 0,
    correctText: { ru: 'Начинаем слева: первое различие в разряде десятков, 0 < 9. Поэтому 842 107 < 842 190.', uz: "Chapdan boshlaymiz: birinchi farq o'nlar xonasida, 0 < 9. Shuning uchun 842 107 < 842 190.", en: 'Start from the left: the first difference is in the tens place, 0 < 9. Therefore 842,107 < 842,190.' },
    wrong: [
      null,
      { ru: 'Последняя цифра показывает только единицы. Она не может отменить более важное различие слева.', uz: "Oxirgi raqam faqat birliklarni ko'rsatadi. U chapdagi muhimroq farqni bekor qila olmaydi.", en: 'The last digit only shows ones. It cannot override a more important difference farther left.' },
      { ru: 'Сумма цифр не определяет порядок многозначных чисел. Сравнивай одинаковые разряды слева направо.', uz: "Raqamlar yig'indisi ko'p xonali sonlar tartibini aniqlamaydi. Bir xil xonalarni chapdan o'ngga taqqoslang.", en: 'A digit sum does not determine the order of multi-digit numbers. Compare matching places from left to right.' },
    ],
    feedbackAudio: {
      on_correct: { ru: 'Верно. Сравнение начинаем слева и останавливаемся на первом различии.', uz: "To'g'ri. Taqqoslashni chapdan boshlaymiz va birinchi farqda to'xtaymiz.", en: 'Correct. Start comparing on the left and stop at the first difference.' },
      on_wrong: [
        null,
        { ru: 'Последняя цифра недостаточна. Начни со старшего разряда слева.', uz: "Oxirgi raqam yetarli emas. Chapdagi eng katta xonadan boshlang.", en: 'The last digit is not enough. Start at the highest place on the left.' },
        { ru: 'Не складывай цифры. Сравни одинаковые разряды слева направо.', uz: "Raqamlarni qo'shmang. Bir xil xonalarni chapdan o'ngga taqqoslang.", en: 'Do not add the digits. Compare matching places from left to right.' },
      ],
    },
    audio: {
      ru: [
        'В Лумо Сити сбился сортировщик маршрутов. Бит сравнил только последние цифры двух чисел.',
        'Сегодня разберём надёжный способ сравнения многозначных чисел.',
        'С какой стороны нужно начинать сравнение?',
      ],
      uz: [
        "Lumo Sitida yo'nalishlarni saralash qurilmasi adashdi. Bit ikki sonning faqat oxirgi raqamlarini taqqosladi.",
        "Bugun ko'p xonali sonlarni taqqoslashning ishonchli usulini o'rganamiz.",
        'Taqqoslashni qaysi tomondan boshlash kerak?',
      ],
      en: [
        "The route sorter in Lumo City has gone wrong. Bit compared only the last digits of the two numbers.",
        "Today we will learn a reliable way to compare multi-digit numbers.",
        "From which side should the comparison begin?",
      ],
    },
  },
  s1: {
    eyebrow: { ru: 'Первая опора', uz: 'Birinchi tayanch', en: "First clue" },
    title: { ru: 'Разная длина записи решает сравнение', uz: "Yozuv uzunligi har xil bo'lsa, taqqoslash hal bo'ladi", en: "Different numbers of digits decide the comparison" },
    lead: {
      ru: 'Чем левее находится старший разряд, тем больше целое число. Поэтому сначала полезно посчитать цифры.',
      uz: "Eng katta xona qancha chapda bo'lsa, butun son shuncha katta bo'ladi. Shuning uchun avval raqamlar sonini sanash foydali.",
      en: "The farther left the highest place is, the greater the whole number. So first count the digits.",
    },
    left: { number: '98 765', count: { ru: '5 цифр', uz: '5 ta raqam', en: "5 digits" } },
    right: { number: '102 304', count: { ru: '6 цифр', uz: '6 ta raqam', en: "6 digits" } },
    formula: '98 765 < 102 304',
    steps: [
      { ru: 'Считаем цифры: 5 и 6', uz: 'Raqamlarni sanaymiz: 5 va 6', en: "Count the digits: 5 and 6" },
      { ru: 'У второго числа есть разряд сотен тысяч', uz: 'Ikkinchi sonda yuz mingliklar xonasi bor', en: "The second number has a hundred-thousands place." },
      { ru: 'Поэтому 102 304 больше любого пятизначного числа', uz: 'Shuning uchun 102 304 har qanday besh xonali sondan katta', en: "Therefore, 102,304 is greater than any five-digit number." },
    ],
    conclusion: { ru: 'Шестизначное число больше пятизначного.', uz: "Olti xonali son besh xonali sondan katta.", en: "A six-digit number is greater than a five-digit number." },
    audio: {
      ru: [
        'Сначала считаем цифры. У первого числа пять цифр, а у второго шесть.',
        'Во втором числе есть разряд сотен тысяч. Поэтому оно больше любого пятизначного числа.',
      ],
      uz: [
        "Avval raqamlarni sanaymiz. Birinchi sonda beshta, ikkinchi sonda esa oltita raqam bor.",
        "Ikkinchi sonda yuz mingliklar xonasi bor. Shuning uchun u har qanday besh xonali sondan katta.",
      ],
      en: [
        "First count the digits. The first number has five digits, and the second has six.",
        "The second number has a hundred-thousands place, so it is greater than any five-digit number.",
      ],
    },
  },
  s2: {
    eyebrow: { ru: 'Таблица разрядов', uz: 'Xonalar jadvali', en: "Place-value chart" },
    title: { ru: 'Одинаковая длина: идём слева направо', uz: "Uzunligi teng bo'lsa, chapdan o'ngga yuramiz", en: "Same length: from left to right" },
    lead: {
      ru: 'Оба числа шестизначные. Теперь сравниваем цифры одного и того же разряда, начиная с самого старшего.',
      uz: "Ikkala son ham olti xonali. Endi eng katta xonadan boshlab bir xil xonalardagi raqamlarni taqqoslaymiz.",
      en: "Both numbers have six digits. Compare digits in the same places, starting with the highest place.",
    },
    headers: {
      ru: ['сот. тыс.', 'дес. тыс.', 'тыс.', 'сот.', 'дес.', 'ед.'],
      uz: ['yuz mingl.', "o'n mingl.", 'mingl.', 'yuzl.', "o'nl.", 'birl.'],
      en: ['hundred-thousands', 'ten-thousands', 'thousands', 'hundreds', 'tens', 'ones'],
    },
    a: ['5', '7', '2', '4', '1', '8'],
    b: ['5', '7', '2', '4', '9', '1'],
    firstDifferent: 4,
    conclusion: { ru: 'В разряде десятков: 1 < 9, значит 572 418 < 572 491.', uz: "O'nlar xonasida 1 < 9, demak 572 418 < 572 491.", en: 'In the tens place, 1 < 9, so 572 418 < 572 491.' },
    contrast: {
      a: '482 731',
      b: '485 112',
      trail: ['4 = 4', '8 = 8', '2 < 5'],
      result: '482 731 < 485 112',
      note: { ru: 'Первое различие в тысячах. Сотни, десятки и единицы уже не меняют результат.', uz: "Birinchi farq mingliklarda. Yuzliklar, o'nliklar va birliklar natijani endi o'zgartirmaydi.", en: "The first difference is in the thousands. Hundreds, tens and ones don't change the outcome." },
    },
    audio: {
      ru: [
        'У чисел одинаковое количество цифр. Сравниваем разряды слева направо.',
        'Первые четыре цифры равны. В разряде десятков один меньше девяти, поэтому первое число меньше.',
        'После первого различия младшие разряды уже не могут изменить результат.',
      ],
      uz: [
        "Sonlardagi raqamlar soni teng. Xonalarni chapdan o'ngga taqqoslaymiz.",
        "Birinchi to'rtta raqam teng. O'nlar xonasida bir to'qqizdan kichik, shuning uchun birinchi son kichik.",
        "Birinchi farqdan keyin kichik xonalar natijani o'zgartira olmaydi.",
      ],
      en: [
        "Numbers have the same number of digits. We compare digits from left to right.",
        "The first four digits are equal. In the tens place, one is less than nine, so the first number is smaller.",
        "After the first difference, the lower places can no longer change the result.",
      ],
    },
  },
  s3: {
    eyebrow: { ru: 'Числовая прямая', uz: "Sonlar chizig'i", en: "Number line" },
    title: { ru: 'Близкие числа видно на линии', uz: "Yaqin sonlar chiziqda ko'rinadi", en: "Close numbers can be seen on the line" },
    lead: {
      ru: 'На числовой прямой больше то число, которое расположено правее. Модель особенно удобна для близких значений.',
      uz: "Sonlar chizig'ida o'ngroqda joylashgan son katta bo'ladi. Bu model yaqin qiymatlar uchun ayniqsa qulay.",
      en: "On a number line, the number farther to the right is greater. This model is especially useful for close values.",
    },
    start: '705 000',
    end: '705 100',
    left: '705 009',
    right: '705 090',
    formula: '705 009 < 705 090',
    audio: {
      ru: [
        'Посмотрим на близкие числа на числовой прямой. Большее число находится правее.',
        'Семьсот пять тысяч девяносто правее семисот пяти тысяч девяти, поэтому оно больше.',
      ],
      uz: [
        "Yaqin sonlarni sonlar chizig'ida ko'ramiz. Katta son o'ngroqda joylashadi.",
        "Yetti yuz besh ming to'qson soni yetti yuz besh ming to'qqizdan o'ngroqda, shuning uchun u katta.",
      ],
      en: [
        "Let us look at close numbers on a number line. The greater number is farther to the right.",
        "Seven hundred and five thousand and ninety is to the right of seven hundred and five thousand and nine, so it is greater.",
      ],
    },
  },
  s4: {
    eyebrow: { ru: 'Особый случай', uz: 'Alohida holat', en: "Special case" },
    title: { ru: 'Если различия нет, числа равны', uz: "Farq bo'lmasa, sonlar teng", en: "If there is no difference, the numbers are equal." },
    lead: {
      ru: 'Нули внутри числа занимают свои разряды. Их нельзя пропускать, но одинаковые нули подтверждают равенство.',
      uz: "Son ichidagi nollar o'z xonasini egallaydi. Ularni tashlab bo'lmaydi, teng nollar esa tenglikni tasdiqlaydi.",
      en: "Zeros inside a number occupy places too. They cannot be skipped, and matching zeros confirm equality.",
    },
    a: '406 020',
    b: '406 020',
    formula: '406 020 = 406 020',
    conclusion: { ru: 'Все шесть разрядов совпали.', uz: 'Barcha oltita xona mos keldi.', en: "All six places match." },
    audio: {
      ru: [
        'Если все разряды совпали, числа равны. Нули внутри числа тоже участвуют в сравнении.',
        'В обоих числах каждая цифра занимает один и тот же разряд.',
      ],
      uz: [
        "Barcha xonalar mos kelsa, sonlar teng bo'ladi. Son ichidagi nollar ham taqqoslashda qatnashadi.",
        "Ikkala sonda har bir raqam bir xil xonani egallagan.",
      ],
      en: [
        "If all the places match, the numbers are equal. Zeros inside a number are part of the comparison too.",
        "In both numbers, each digit occupies the same place.",
      ],
    },
  },
  s5: {
    eyebrow: { ru: 'Короткая проверка', uz: 'Qisqa tekshiruv', en: "Quick check" },
    title: { ru: 'Какой знак вернёт сортировщик?', uz: 'Saralash qurilmasi qaysi belgini qaytaradi?', en: "What kind of sign will the sorter return?" },
    lead: { ru: 'Сравни 705 090 и 705 009.', uz: '705 090 va 705 009 sonlarini taqqoslang.', en: "Compare 705,090 and 705,009." },
    options: [
      { ru: '705 090 > 705 009', uz: '705 090 > 705 009' , en: "705 090 > 705 009"},
      { ru: '705 090 < 705 009', uz: '705 090 < 705 009' , en: "705 090 < 705 009"},
      { ru: '705 090 = 705 009', uz: '705 090 = 705 009' , en: "705 090 = 705 009"},
      { ru: 'Эти числа нельзя сравнить', uz: "Bu sonlarni taqqoslab bo'lmaydi", en: "These numbers cannot be compared." },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Первые четыре разряда совпадают. В разряде десятков 9 больше 0, поэтому 705 090 больше.',
      uz: "Birinchi to'rtta xona mos keladi. O'nlar xonasida 9 raqami 0 dan katta, shuning uchun 705 090 katta.",
      en: "The first four digits match. In the tens place, 9 is greater than 0, so 705,090 is greater.",
    },
    wrong: [
      null,
      { ru: 'Знак направлен неверно. Первое различие находится в разряде десятков: 9 больше 0.', uz: "Belgi noto'g'ri yo'nalgan. Birinchi farq o'nlar xonasida, 9 raqami 0 dan katta.", en: "The sign points the wrong way. The first difference is in the tens place: 9 is greater than 0." },
      { ru: 'Числа начинаются одинаково, но не равны. В разряде десятков стоят 9 и 0.', uz: "Sonlarning boshi bir xil, ammo ular teng emas. O'nlar xonasida 9 va 0 turibdi.", en: "The numbers begin in the same way, but they are not equal. Their tens digits are 9 and 0." },
      { ru: 'Любые натуральные числа можно сравнить. Здесь достаточно найти первый различающийся разряд.', uz: "Har qanday natural sonni taqqoslash mumkin. Bu yerda birinchi farqli xonani topish yetarli.", en: "Any natural numbers can be compared. Find the first place where the digits differ." },
    ],
    audio: {
      intro: { ru: 'Сравни семьсот пять тысяч девяносто и семьсот пять тысяч девять. Выбери верную запись.', uz: "Yetti yuz besh ming to'qson va yetti yuz besh ming to'qqiz sonlarini taqqoslang. To'g'ri yozuvni tanlang.", en: "Compare seven hundred and five thousand and ninety with seven hundred and five thousand and nine. Choose the correct statement." },
      on_correct: { ru: 'Верно. В разряде десятков девять больше нуля.', uz: "To'g'ri. O'nlar xonasida to'qqiz noldan katta.", en: "Correct. In the tens place, nine is greater than zero." },
      on_wrong: [
        null,
        { ru: 'Проверь направление знака. Первое число больше.', uz: "Belgi yo'nalishini tekshiring. Birinchi son katta.", en: "Check the direction of the sign. The first number is larger." },
        { ru: 'Числа не равны. Сравни разряд десятков.', uz: "Sonlar teng emas. O'nlar xonasini taqqoslang.", en: "The numbers are not equal. Compare the tens place." },
        { ru: 'Эти числа можно сравнить. Ищи первый разный разряд.', uz: "Bu sonlarni taqqoslash mumkin. Birinchi farqli xonani toping.", en: "These numbers can be compared. Look for the first place where the digits differ." },
      ],
    },
  },
  s6: {
    eyebrow: { ru: 'Разбираем примеры', uz: 'Misollarni tahlil qilamiz', en: "Let's look at examples." },
    title: { ru: 'Один алгоритм, разные ситуации', uz: 'Bitta algoritm, turli vaziyatlar', en: "One algorithm, different situations" },
    lead: { ru: 'Посмотри, на каком шаге заканчивается каждое сравнение.', uz: "Har bir taqqoslash qaysi qadamda tugashiga qarang.", en: "See where each comparison ends." },
    examples: [
      { formula: '87 650 < 103 002', reason: { ru: '5 цифр < 6 цифр', uz: '5 ta raqam < 6 ta raqam', en: "5 digits < 6 digits" }, tone: 'cyan' },
      { formula: '640 215 > 639 999', reason: { ru: '6 > 3 в разряде десятков тысяч', uz: "o'n mingliklar xonasida 6 > 3", en: "6 > 3 in the ten-thousands place" }, tone: 'accent' },
      { formula: '520 608 > 520 086', reason: { ru: '6 > 0 в разряде сотен', uz: 'yuzliklar xonasida 6 > 0', en: "6 > 0 in the hundreds place" }, tone: 'lime' },
      { formula: '401 070 = 401 070', reason: { ru: 'все разряды совпали', uz: 'barcha xonalar mos keldi', en: "all places match" }, tone: 'navy' },
    ],
    audio: {
      ru: [
        'В первом примере различается количество цифр. В остальных примерах числа имеют одинаковую длину.',
        'Тогда ищем первое различие слева. Если различий нет, ставим знак равенства.',
      ],
      uz: [
        "Birinchi misolda raqamlar soni farq qiladi. Qolgan misollarda sonlarning uzunligi teng.",
        "Bunday holatda chapdan birinchi farqni topamiz. Farq bo'lmasa, tenglik belgisini qo'yamiz.",
      ],
      en: [
        "In the first example, the number of digits differs. In the other examples, the numbers are the same length.",
        "Then we look for the first difference on the left. If there's no difference, we put an equal sign.",
      ],
    },
  },
  s7: {
    eyebrow: { ru: 'Открываем закономерность', uz: 'Qonuniyatni ochamiz', en: "Discovering the pattern" },
    title: { ru: 'Почему справа уже можно не смотреть?', uz: "Nega keyin o'ng tomonga qarash shart emas?", en: "Why can you stop looking to the right?" },
    lead: {
      ru: 'У чисел 631 204 и 631 240 первое различие возникает в разряде десятков.',
      uz: "631 204 va 631 240 sonlarida birinchi farq o'nlar xonasida paydo bo'ladi.",
      en: "In the numbers 631 204 and 631 240, the first difference occurs in the tens place.",
    },
    a: '631 204',
    b: '631 240',
    proof: { ru: 'В десятках: 0 < 4. Единицы уже не меняют результат.', uz: "O'nlarda 0 < 4. Birliklar natijani endi o'zgartirmaydi.", en: "In tens: 0 < 4. Units do not change the result." },
    discovery: { ru: 'Старший различающийся разряд сильнее всех разрядов справа.', uz: "Eng katta farqli xona o'ngdagi barcha xonalardan kuchliroq.", en: "The highest place where the digits differ outweighs every place to its right." },
    audio: {
      ru: [
        'Сравниваем цифры слева. Первое различие появляется в разряде десятков.',
        'Ноль десятков меньше четырёх десятков. Единицы уже не могут изменить результат.',
      ],
      uz: [
        "Raqamlarni chapdan taqqoslaymiz. Birinchi farq o'nlar xonasida paydo bo'ladi.",
        "Nol o'nlik to'rt o'nlikdan kichik. Birliklar natijani endi o'zgartira olmaydi.",
      ],
      en: [
        "Compare the digits from the left. The first difference is in the tens place.",
        "Zero tens is less than four tens. The ones cannot change the result.",
      ],
    },
  },
  s8: {
    eyebrow: { ru: 'Собираем правило', uz: "Qoidani yig'amiz" , en: "Making a rule"},
    title: { ru: 'Надёжный алгоритм сравнения', uz: 'Ishonchli taqqoslash algoritmi', en: "A reliable comparison algorithm" },
    lead: { ru: 'Три шага работают для любых натуральных многозначных чисел.', uz: "Uch qadam barcha ko'p xonali natural sonlar uchun ishlaydi.", en: "The three steps work for any natural multi-digit numbers." },
    rules: [
      { n: '01', title: { ru: 'Сравни количество цифр', uz: 'Raqamlar sonini taqqoslang', en: "Compare the number of digits" }, body: { ru: 'Больше цифр означает большее число.', uz: "Raqamlari ko'p son kattaroq bo'ladi.", en: "More digits mean a greater number." } },
      { n: '02', title: { ru: 'Если длина равна, иди слева', uz: "Uzunlik teng bo'lsa, chapdan yuring", en: "If the lengths are equal, compare from the left" }, body: { ru: 'Найди первый разряд, где цифры различаются.', uz: 'Raqamlari farq qiladigan birinchi xonani toping.', en: "Find the first place where the digits differ." } },
      { n: '03', title: { ru: 'Поставь знак', uz: "Belgini qo'ying", en: "Choose the sign" }, body: { ru: 'Сравни цифры первого различающегося разряда. Если различий нет, числа равны.', uz: "Birinchi farqli xonadagi raqamlarni taqqoslang. Farq bo'lmasa, sonlar teng.", en: "Compare the digits in the first place where they differ. If there is no difference, the numbers are equal." } },
    ],
    audio: {
      ru: [
        'Соберём правило. Сначала сравни количество цифр.',
        'Если длина одинакова, двигайся слева направо до первого различия. Если различий нет, числа равны.',
      ],
      uz: [
        "Qoidani yig'amiz. Avval raqamlar sonini taqqoslang.",
        "Uzunlik teng bo'lsa, birinchi farqqacha chapdan o'ngga yuring. Farq bo'lmasa, sonlar teng.",
      ],
      en: [
        "Let us make the rule. First compare the number of digits.",
        "If the length is the same, move from left to right until the first difference. If there is no difference, the numbers are equal.",
      ],
    },
  },
  s9: {
    eyebrow: { ru: 'Язык знаков', uz: 'Belgilar tili', en: "Language of signs" },
    title: { ru: 'Один факт можно прочитать с двух сторон', uz: "Bitta fikrni ikki tomondan o'qish mumkin", en: "One fact can be read from both sides." },
    lead: { ru: 'Широкая сторона знака смотрит на большее число, а острый угол указывает на меньшее.', uz: "Belgining keng tomoni katta songa qaraydi, o'tkir uchi esa kichik sonni ko'rsatadi.", en: "The wide side of the sign looks at the larger number, and the sharp angle indicates the smaller." },
    rows: [
      { formula: '640 215 > 639 999', reason: { ru: 'слева: первое число больше', uz: 'chapdan: birinchi son katta', en: "left: the first number is larger" } },
      { formula: '639 999 < 640 215', reason: { ru: 'справа: тот же факт, знак повернулся', uz: "o'ngdan: o'sha fikr, belgi burildi", en: "on the right: same fact, the sign has turned" } },
      { formula: '406 020 = 406 020', reason: { ru: 'равенство не меняется при перестановке', uz: "tenglik o'rinlar almashganda o'zgarmaydi", en: "Equality does not change with permutation." } },
      { formula: { ru: 'большее  >  меньшее', uz: 'katta  >  kichik', en: "greater number > smaller number" }, reason: { ru: 'широкая сторона обращена к большему', uz: 'keng tomon katta songa qaragan', en: "The wide side faces the greater number" } },
    ],
    audio: {
      ru: [
        'Знак можно читать с любой стороны. Широкая сторона всегда обращена к большему числу.',
        'Если числа поменять местами, знак больше превращается в знак меньше. Равенство не меняется.',
      ],
      uz: [
        "Belgini istalgan tomondan o'qish mumkin. Keng tomon doim katta songa qaraydi.",
        "Sonlar o'rin almashsa, katta belgisi kichik belgisiga aylanadi. Tenglik esa o'zgarmaydi.",
      ],
      en: [
        "The sign can be read from either side. The wide side always faces the larger number.",
        "If the numbers swap places, the greater-than sign becomes a less-than sign. Equality does not change.",
      ],
    },
  },
  s10: {
    eyebrow: { ru: 'Выбираем стратегию', uz: 'Strategiyani tanlaymiz', en: "Choosing a strategy" },
    title: { ru: 'Какая модель удобнее?', uz: 'Qaysi model qulayroq?', en: "Which model is more convenient?" },
    lead: { ru: 'Способ выбирают по виду чисел. Ответ останется тем же, но путь может быть короче.', uz: "Usul sonlarning ko'rinishiga qarab tanlanadi. Javob o'zgarmaydi, ammo yo'l qisqaroq bo'lishi mumkin.", en: "The answer will remain the same, but the path may be shorter." },
    strategies: [
      { icon: '≠', title: { ru: 'Разное число цифр', uz: 'Raqamlar soni har xil', en: "Different number of digits" }, body: { ru: 'Сразу сравни длину записи.', uz: 'Darhol yozuv uzunligini taqqoslang.', en: "Compare the number of digits straight away." }, example: '78 900 < 101 000' },
      { icon: '⇢', title: { ru: 'Одинаковая длина', uz: 'Uzunligi teng', en: "Same length." }, body: { ru: 'Ищи первую разную цифру слева.', uz: 'Chapdagi birinchi farqli raqamni toping.', en: "Look for the first different digit from the left." }, example: '452 910 > 451 999' },
      { icon: '—', title: { ru: 'Очень близкие числа', uz: 'Juda yaqin sonlar', en: "Very close numbers." }, body: { ru: 'Числовая прямая делает порядок наглядным.', uz: "Sonlar chizig'i tartibni ko'rsatadi.", en: "A number line makes the order clear." }, example: '705 009 < 705 090' },
    ],
    note: { ru: 'Таблица разрядов остаётся самым надёжным способом проверки.', uz: "Xonalar jadvali tekshirishning eng ishonchli usuli bo'lib qoladi.", en: "A place-value chart remains the most reliable way to check." },
    audio: {
      ru: [
        'Для чисел разной длины достаточно посчитать цифры. Для одинаковой длины сравниваем разряды.',
        'Если числа близки, порядок удобно показать на числовой прямой. Таблица разрядов подходит всегда.',
      ],
      uz: [
        "Uzunligi har xil sonlar uchun raqamlarni sanash yetarli. Uzunligi teng bo'lsa, xonalarni taqqoslaymiz.",
        "Sonlar yaqin bo'lsa, tartibni sonlar chizig'ida ko'rsatish qulay. Xonalar jadvali doim mos keladi.",
      ],
      en: [
        "For numbers with different numbers of digits, just count the digits. If they have the same number of digits, compare their places.",
        "If the numbers are close, a number line shows their order clearly. A place-value chart always works.",
      ],
    },
  },
  s11: {
    eyebrow: { ru: 'Лаборатория ошибок', uz: 'Xatolar laboratoriyasi', en: "Error Lab" },
    title: { ru: 'Три ловушки, которые сбивают сортировщик', uz: 'Saralash qurilmasini adashtiradigan uchta tuzoq', en: "Three traps that mislead the sorter" },
    lead: { ru: 'Каждую ошибку исправляет один и тот же вопрос: где находится первое различие слева?', uz: "Har bir xatoni bitta savol tuzatadi: chapdagi birinchi farq qayerda?", en: "Each error is corrected by the same question: where is the first difference on the left?" },
    errors: [
      {
        tag: { ru: 'Последняя цифра', uz: 'Oxirgi raqam', en: "Last digit" },
        wrong: '842 107 > 842 190',
        why: { ru: '7 > 0, но единицы проверены слишком рано', uz: '7 > 0, ammo birliklar juda erta tekshirildi', en: "7 > 0, but units tested too early" },
        correct: '842 107 < 842 190',
      },
      {
        tag: { ru: 'Сумма цифр', uz: "Raqamlar yig'indisi", en: "Sum of digits" },
        wrong: '510 002 < 499 999',
        why: { ru: 'Сумма цифр не показывает величину числа', uz: "Raqamlar yig'indisi sonning kattaligini ko'rsatmaydi", en: "The sum of the digits does not show the value of the number" },
        correct: '510 002 > 499 999',
      },
      {
        tag: { ru: 'Знак наоборот', uz: 'Teskari belgi', en: "Sign reversed" },
        wrong: '705 090 < 705 009',
        why: { ru: '9 десятков больше 0 десятков', uz: "9 o'nlik 0 o'nlikdan katta", en: "Nine tens is greater than zero tens" },
        correct: '705 090 > 705 009',
      },
    ],
    repair: { ru: 'Длина записи, затем первое различие слева, затем знак.', uz: "Yozuv uzunligi, keyin chapdagi birinchi farq, so'ng belgi.", en: "Count the digits, then find the first difference from the left, then choose the sign." },
    audio: {
      ru: [
        'Разберём три ловушки. Нельзя начинать с последней цифры или сравнивать суммы цифр.',
        'Даже после верного сравнения нужно проверить направление знака. Широкая сторона смотрит на большее число.',
      ],
      uz: [
        "Uchta tuzoqni tahlil qilamiz. Oxirgi raqamdan boshlash yoki raqamlar yig'indisini taqqoslash mumkin emas.",
        "To'g'ri taqqoslashdan keyin ham belgi yo'nalishini tekshiring. Keng tomon katta songa qaraydi.",
      ],
      en: [
        "Let's break down three traps. You can't start with the last digit or compare the sums of the digits.",
        "Even after the right comparison, you need to check the direction of the sign. The wide side looks at the larger number.",
      ],
    },
  },
  s12: {
    eyebrow: { ru: 'Финальная миссия', uz: 'Yakuniy missiya', en: "Final mission" },
    title: { ru: 'Расставь городские данные по убыванию', uz: "Shahar ma'lumotlarini kamayish tartibida joylashtiring", en: "Arrange the city data in descending order" },
    lead: { ru: 'Самое большое значение должно стоять первым.', uz: 'Eng katta qiymat birinchi turishi kerak.', en: "The greatest value must come first." },
    options: [
      { ru: '608 450 > 608 405 > 607 999', uz: '608 450 > 608 405 > 607 999' , en: "608 450 > 608 405 > 607 999"},
      { ru: '607 999 > 608 405 > 608 450', uz: '607 999 > 608 405 > 608 450' , en: "607 999 > 608 405 > 608 450"},
      { ru: '608 405 > 608 450 > 607 999', uz: '608 405 > 608 450 > 607 999' , en: "608 405 > 608 450 > 607 999"},
      { ru: '608 450 > 607 999 > 608 405', uz: '608 450 > 607 999 > 608 405' , en: "608 450 > 607 999 > 608 405"},
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Сначала идут два числа с 608 тысячами. Между ними 450 больше 405. Число 607 999 стоит последним.',
      uz: "Avval 608 mingli ikkita son keladi. Ularning orasida 450 soni 405 dan katta. 607 999 soni oxirida turadi.",
      en: "The two numbers beginning with 608 thousand come first. Of these, 450 is greater than 405. The number 607,999 comes last.",
    },
    wrong: [
      null,
      { ru: 'Порядок перевёрнут. Числа с 608 тысячами больше числа с 607 тысячами.', uz: "Tartib teskari. 608 mingli sonlar 607 mingli sondan katta.", en: "The order is reversed. The numbers with 608,000 are bigger than the numbers with 607,000." },
      { ru: 'Первые два числа перепутаны. После общей части 608 сравни 450 и 405.', uz: "Birinchi ikkita son almashgan. Umumiy 608 qismidan keyin 450 va 405 ni taqqoslang.", en: "The first two numbers are in the wrong order. After the shared part 608, compare 450 and 405." },
      { ru: 'Число 607 999 не может стоять между числами с 608 тысячами. Оно меньше обоих.', uz: "607 999 soni 608 mingli sonlar orasida tura olmaydi. U ikkalasidan ham kichik.", en: "607,999 can't stand between 608,000 numbers. It's smaller than both." },
    ],
    audio: {
      intro: { ru: 'Расположи три городских показателя по убыванию. Самое большое значение поставь первым.', uz: "Uchta shahar ko'rsatkichini kamayish tartibida joylashtiring. Eng katta qiymatni birinchi qo'ying.", en: "Arrange the three city readings in descending order. Put the greatest value first." },
      on_correct: { ru: 'Верно. Два числа с шестьюстами восемью тысячами идут раньше меньшего числа.', uz: "To'g'ri. Olti yuz sakkiz mingli ikkita son kichik sondan oldin turadi.", en: "Correct. The two numbers beginning with six hundred and eight thousand come before the smaller number." },
      on_wrong: [
        null,
        { ru: 'Сейчас порядок возрастает. Начни с самого большого числа.', uz: "Hozir tartib o'sib boryapti. Eng katta sondan boshlang.", en: "Now the order is increasing. Start with the largest number." },
        { ru: 'Сравни последние три цифры первых двух чисел.', uz: "Birinchi ikkita sonning oxirgi uchta raqamini taqqoslang.", en: "Compare the last three digits of the first two numbers." },
        { ru: 'Сначала сравни тысячи. Число с шестьюстами семью тысячами меньше.', uz: "Avval mingliklarni taqqoslang. Olti yuz yetti mingli son kichik.", en: "First, compare the thousands. The number with six hundred and seven thousand is smaller." },
      ],
    },
  },
  s13: {
    eyebrow: { ru: 'Разбор финальной цепочки', uz: 'Yakuniy zanjir tahlili', en: "Proof of the final chain" },
    title: { ru: 'Три числа упорядочиваются двумя сравнениями', uz: 'Uchta son ikki taqqoslash bilan tartiblanadi', en: "The three numbers are arranged by two comparisons." },
    lead: {
      ru: 'После выбора ответа докажем порядок: сравним соседей цепочки и назовём разряд, который решил каждую пару.',
      uz: "Javob tanlangach, tartibni isbotlaymiz: zanjirdagi qo'shni sonlarni taqqoslab, har bir juftlikni hal qilgan xonani aytamiz.",
      en: "After choosing an answer, prove the order. Compare neighbouring numbers in the chain and name the place that decides each pair.",
    },
    comparisons: [
      {
        pair: '608 450  ?  608 405',
        formula: '608 450 > 608 405',
        reason: { ru: 'Первые четыре цифры совпали; в десятках 5 > 0.', uz: "Birinchi to'rtta raqam mos; o'nlarda 5 > 0.", en: "The first four digits match; in the tens place, 5 > 0." },
      },
      {
        pair: '608 405  ?  607 999',
        formula: '608 405 > 607 999',
        reason: { ru: 'Первое различие в тысячах: 8 > 7.', uz: 'Birinchi farq minglarda: 8 > 7.', en: "The first difference is in thousands: 8 > 7." },
      },
    ],
    chain: '608 450 > 608 405 > 607 999',
    conclusion: {
      ru: 'Если первое число больше второго, а второе больше третьего, вся цепочка записана по убыванию.',
      uz: "Birinchi son ikkinchisidan, ikkinchisi uchinchisidan katta bo'lsa, butun zanjir kamayish tartibida yozilgan bo'ladi.",
      en: "If the first number is greater than the second and the second number is greater than the third, the entire chain is written down.",
    },
    audio: {
      ru: [
        'В первой паре первые четыре цифры совпали. Сравнение решают десятки.',
        'Во второй паре первое различие находится в тысячах. Они и решают сравнение.',
        'Оба знака направлены от большего числа к меньшему. Двух сравнений достаточно для всей цепочки.',
      ],
      uz: [
        "Birinchi juftlikda dastlabki to'rtta raqam mos keladi. Taqqoslashni o'nlar hal qiladi.",
        "Ikkinchi juftlikda birinchi farq minglar xonasida. Taqqoslashni minglar hal qiladi.",
        "Ikkala belgi ham katta sondan kichik songa yo'nalgan. Butun zanjirni asoslash uchun ikkita taqqoslash yetarli.",
      ],
      en: [
        "In the first pair, the first four digits match. The tens place decides the comparison.",
        "In the second pair, the first difference is in the thousands. They decide the comparison.",
        "Both signs are pointing from a larger number to a smaller number. Two comparisons are enough for the entire chain.",
      ],
    },
  },
  s14: {
    eyebrow: { ru: 'Маршруты восстановлены', uz: "Yo'nalishlar tiklandi", en: "Routes restored" },
    title: { ru: 'Теперь Бит сравнивает слева направо', uz: "Endi Bit chapdan o'ngga taqqoslaydi", en: "Now Bit compares from left to right" },
    lead: { ru: 'Сортировщик снова работает. Ты умеешь объяснить не только знак, но и разряд, который решил сравнение.', uz: "Saralash qurilmasi yana ishlayapti. Siz nafaqat belgini, balki taqqoslashni hal qilgan xonani ham tushuntira olasiz.", en: "The sorter works again. You know how to explain not only the sign, but also the place that decided the comparison." },
    takeaways: [
      { ru: 'Сначала сравни количество цифр.', uz: 'Avval raqamlar sonini taqqoslang.', en: "First compare the number of digits." },
      { ru: 'При равной длине ищи первую разную цифру слева.', uz: "Uzunlik teng bo'lsa, chapdagi birinchi farqli raqamni toping.", en: "If the length is equal, look for the first different digit on the left." },
      { ru: 'Если все разряды совпали, числа равны.', uz: "Barcha xonalar mos kelsa, sonlar teng.", en: "If all the places match, the numbers are equal." },
    ],
    bridge: { ru: 'Дальше узнаем, как заменять точное число близким круглым числом.', uz: "Keyingi darsda aniq sonni yaqin yumaloq son bilan almashtirishni o'rganamiz.", en: "Next we will learn how to replace the exact number with a close round number." },
    finish: { ru: 'Завершить урок', uz: 'Darsni yakunlash' , en: "Finish lesson"},
    audio: {
      ru: [
        'Маршруты восстановлены. Теперь Бит сначала сравнивает количество цифр, затем ищет первое различие слева.',
        'В следующем уроке научимся заменять точное число близким круглым числом.',
      ],
      uz: [
        "Yo'nalishlar tiklandi. Endi Bit avval raqamlar sonini taqqoslaydi, keyin chapdagi birinchi farqni topadi.",
        "Keyingi darsda aniq sonni yaqin yumaloq son bilan almashtirishni o'rganamiz.",
      ],
      en: [
        "Routes restored. Now Bit compares the number of digits, then looks for the first difference on the left.",
        "In the next lesson, we will learn to replace the exact number with a close round number.",
      ],
    },
  },
};

const makeMicroPractice = ({ audioIntro, correctAudio, wrongAudio, ...content }) => ({
  ...content,
  audio: { intro: audioIntro, on_correct: correctAudio, on_wrong: content.options.map((_, index) => (index === content.correctIndex ? null : wrongAudio)) },
});

const PRACTICE_CONTENT = {
  p1: makeMicroPractice({ eyebrow: { ru: 'Практика 1', uz: '1-mashq' , en: "Practice 1"}, title: { ru: 'Сначала длина записи', uz: 'Avval yozuv uzunligi', en: "First count the digits" }, lead: { ru: 'У чисел разное количество цифр.', uz: 'Sonlardagi raqamlar soni har xil.', en: "The numbers have different numbers of digits." }, instruction: { ru: 'Какое число больше?', uz: 'Qaysi son katta?', en: "Which number is greater?" }, options: ['102 304', '98 765', { ru: 'числа равны', uz: 'sonlar teng', en: "the numbers are equal" }], correctIndex: 0, correctText: { ru: '102 304 — шестизначное число, поэтому оно больше пятизначного 98 765.', uz: '102 304 olti xonali, shuning uchun u besh xonali 98 765 dan katta.', en: "102,304 is a six-digit number, so it is larger than the five-digit 98,765." }, wrong: [null, { ru: '98 765 имеет только пять цифр.', uz: '98 765 sonida faqat beshta raqam bor.', en: "98,765 has only five digits." }, { ru: 'Количество цифр различается, поэтому числа не равны.', uz: 'Raqamlar soni har xil, shuning uchun sonlar teng emas.', en: "The number of digits varies, so the numbers are not equal." }], audioIntro: { ru: 'Сравни девяносто восемь тысяч семьсот шестьдесят пять и сто две тысячи триста четыре. Какое число больше?', uz: 'To\'qson sakkiz ming yetti yuz oltmish besh va bir yuz ikki ming uch yuz to\'rt sonlarini taqqoslang. Qaysi son katta?', en: "Compare ninety-eight thousand seven hundred and sixty-five with one hundred and two thousand three hundred and four. Which number is greater?" }, correctAudio: { ru: 'Верно. Шестизначное число больше пятизначного.', uz: 'To\'g\'ri. Olti xonali son besh xonali sondan katta.', en: "Correct. The six-digit number is greater than the five-digit number." }, wrongAudio: { ru: 'Сначала посчитай цифры в каждом числе.', uz: 'Avval har bir sondagi raqamlarni sanang.', en: "First count the digits in each number." } }),
  p2: makeMicroPractice({ eyebrow: { ru: 'Практика 2', uz: '2-mashq' , en: "Practice 2"}, title: { ru: 'Первое различие', uz: 'Birinchi farq', en: "First difference" }, lead: { ru: 'Длина чисел одинакова.', uz: 'Sonlarning uzunligi teng.', en: "Number lengths are the same." }, instruction: { ru: 'В каком разряде впервые различаются 572 418 и 572 491?', uz: '572 418 va 572 491 sonlari birinchi marta qaysi xonada farq qiladi?', en: "At which place do 572,418 and 572,491 first differ?" }, options: [{ ru: 'в десятках', uz: 'o\'nlar xonasida' , en: "in the tens place"}, { ru: 'в сотнях', uz: 'yuzlar xonasida' , en: "in the hundreds place"}, { ru: 'в единицах', uz: 'birlar xonasida' , en: "in the ones place"}], correctIndex: 0, correctText: { ru: 'Слева совпадают 572 4. Первое различие — 1 и 9 в разряде десятков.', uz: 'Chapdan 572 4 qismi mos keladi. Birinchi farq o\'nlar xonasidagi 1 va 9.', en: "The first four digits, 5724, match. The first difference is between 1 and 9 in the tens place." }, wrong: [null, { ru: 'В сотнях обеих групп стоит цифра 4.', uz: 'Ikkala guruhning yuzlar xonasida 4 turibdi.', en: "The hundreds digit is 4 in both numbers." }, { ru: 'До единиц сравнение уже завершилось в десятках.', uz: 'Birliklargacha yetmasdan, taqqoslash o\'nliklarda tugaydi.', en: "The comparison ends in the tens place before you reach the ones." }], audioIntro: { ru: 'Сравни пятьсот семьдесят две тысячи четыреста восемнадцать и пятьсот семьдесят две тысячи четыреста девяносто один. Где первое различие?', uz: 'Besh yuz yetmish ikki ming to\'rt yuz o\'n sakkiz va besh yuz yetmish ikki ming to\'rt yuz to\'qson bir sonlarini taqqoslang. Birinchi farq qayerda?', en: "Compare five hundred and seventy-two thousand four hundred and eighteen with five hundred and seventy-two thousand four hundred and ninety-one. Where is the first difference?" }, correctAudio: { ru: 'Верно. Первое различие находится в разряде десятков.', uz: 'To\'g\'ri. Birinchi farq o\'nlar xonasida.', en: "Correct. The first difference is in the tens place." }, wrongAudio: { ru: 'Двигайся слева направо и остановись на первой разной цифре.', uz: 'Chapdan o\'ngga yuring va birinchi farqli raqamda to\'xtang.', en: "Move from left to right and stop at the first different digit." } }),
  p3: makeMicroPractice({ eyebrow: { ru: 'Практика 3', uz: '3-mashq' , en: "Practice 3"}, title: { ru: 'Выбираем знак', uz: 'Belgini tanlaymiz', en: "Choosing a sign" }, lead: { ru: 'Большее число на прямой находится правее.', uz: 'Sonlar chizig\'ida katta son o\'ngroqda joylashadi.', en: "The greater number is farther to the right on a number line." }, instruction: { ru: 'Какая запись верна?', uz: 'Qaysi yozuv to\'g\'ri?', en: "Which statement is correct?" }, options: ['705 009 < 705 090', '705 009 > 705 090', '705 009 = 705 090'], correctIndex: 0, correctText: { ru: 'В разряде десятков 0 меньше 9, поэтому первое число меньше.', uz: 'O\'nlar xonasida 0 soni 9 dan kichik, shuning uchun birinchi son kichik.', en: "In the tens place 0 is less than 9, so the first number is smaller." }, wrong: [null, { ru: 'Знак повёрнут неверно: 705 090 больше.', uz: 'Belgi noto\'g\'ri burilgan: 705 090 katta.', en: "The sign points the wrong way: 705,090 is greater." }, { ru: 'В разряде десятков стоят разные цифры.', uz: 'O\'nlar xonasida turli raqamlar turibdi.', en: "The tens digits are different." }], audioIntro: { ru: 'Сравни семьсот пять тысяч девять и семьсот пять тысяч девяносто. Выбери верную запись.', uz: 'Yetti yuz besh ming to\'qqiz va yetti yuz besh ming to\'qson sonlarini taqqoslang. To\'g\'ri yozuvni tanlang.', en: "Compare seven hundred and five thousand and nine with seven hundred and five thousand and ninety. Choose the correct statement." }, correctAudio: { ru: 'Верно. Первое число меньше второго.', uz: 'To\'g\'ri. Birinchi son ikkinchi sondan kichik.', en: "Correct. The first number is less than the second." }, wrongAudio: { ru: 'Проверь разряд десятков и направление знака.', uz: 'O\'nlar xonasini va belgi yo\'nalishini tekshiring.', en: "Check the tens place and the direction of the sign." } }),
  p4: makeMicroPractice({ eyebrow: { ru: 'Практика 4', uz: '4-mashq' , en: "Practice 4"}, title: { ru: 'Проверяем равенство', uz: 'Tenglikni tekshiramiz', en: "Checking equality" }, lead: { ru: 'Внутренние нули тоже занимают разряды.', uz: 'Ichki nollar ham xonalarni egallaydi.', en: "Zeros inside a number occupy places too." }, instruction: { ru: 'Какой знак нужен между 406 020 и 406 020?', uz: '406 020 va 406 020 orasiga qaysi belgi qo\'yiladi?', en: "Which sign belongs between 406,020 and 406,020?" }, options: ['=', '>', '<'], correctIndex: 0, correctText: { ru: 'Все шесть разрядов совпадают, поэтому числа равны.', uz: 'Barcha oltita xona mos keladi, shuning uchun sonlar teng.', en: "All six places are the same, so the numbers are equal." }, wrong: [null, { ru: 'Ни в одном разряде первое число не больше.', uz: 'Hech bir xonada birinchi son katta emas.', en: "There is no place where the first number is greater than the second." }, { ru: 'Ни в одном разряде первое число не меньше.', uz: 'Hech bir xonada birinchi son kichik emas.', en: "There is no place where the first number is less than the second." }], audioIntro: { ru: 'Сравни два одинаковых числа четыреста шесть тысяч двадцать. Какой знак нужен?', uz: 'Bir xil ikki dona to\'rt yuz olti ming yigirma sonini taqqoslang. Qaysi belgi kerak?', en: "Compare two identical numbers: four hundred and six thousand and twenty. Which sign is needed?" }, correctAudio: { ru: 'Верно. Все разряды совпали, значит числа равны.', uz: 'To\'g\'ri. Barcha xonalar mos keldi, demak sonlar teng.', en: "Correct. All the places match, so the numbers are equal." }, wrongAudio: { ru: 'Сравни все разряды. Различий нет.', uz: 'Barcha xonalarni taqqoslang. Farq yo\'q.', en: "Compare every place. There are no differences." } }),
  p5: makeMicroPractice({ eyebrow: { ru: 'Практика 5', uz: '5-mashq' , en: "Practice 5"}, title: { ru: 'Младшие разряды не меняют ответ', uz: 'Kichik xonalar javobni o\'zgartirmaydi', en: "Lower places do not change the answer" }, lead: { ru: 'Первое различие важнее всех цифр справа.', uz: 'Birinchi farq o\'ngdagi barcha raqamlardan muhimroq.', en: "The first difference matters more than every digit to its right." }, instruction: { ru: 'Как сравнить 631 204 и 631 240?', uz: '631 204 va 631 240 qanday taqqoslanadi?', en: "How do you compare 631 204 and 631 240?" }, options: ['631 204 < 631 240', '631 204 > 631 240', '631 204 = 631 240'], correctIndex: 0, correctText: { ru: 'Первое различие в десятках: 0 меньше 4. Единицы ответ не меняют.', uz: 'Birinchi farq o\'nliklarda: 0 soni 4 dan kichik. Birliklar javobni o\'zgartirmaydi.', en: "The first difference is in tens: 0 is less than 4. Units do not change the answer." }, wrong: [null, { ru: 'Сравнение завершается в разряде десятков.', uz: 'Taqqoslash o\'nlar xonasida tugaydi.', en: "The comparison ends in the tens place." }, { ru: 'В разряде десятков стоят 0 и 4, поэтому числа не равны.', uz: 'O\'nlar xonasida 0 va 4 turibdi, shuning uchun sonlar teng emas.', en: "In the tens place are 0 and 4, so the numbers are not equal." }], audioIntro: { ru: 'Сравни шестьсот тридцать одну тысячу двести четыре и шестьсот тридцать одну тысячу двести сорок.', uz: 'Olti yuz o\'ttiz bir ming ikki yuz to\'rt va olti yuz o\'ttiz bir ming ikki yuz qirq sonlarini taqqoslang.', en: "Compare six hundred and thirty-one thousand two hundred and four and six hundred and thirty-one thousand two hundred and forty." }, correctAudio: { ru: 'Верно. Ноль десятков меньше четырёх десятков.', uz: 'To\'g\'ri. Nol o\'nlik to\'rt o\'nlikdan kichik.', en: "Correct. Zero tens is less than four tens." }, wrongAudio: { ru: 'Остановись на первом различии слева.', uz: 'Chapdagi birinchi farqda to\'xtang.', en: "Stop at the first difference on the left." } }),
  p6: makeMicroPractice({ eyebrow: { ru: 'Городской перенос', uz: 'Shahar vaziyati', en: 'City transfer' }, title: { ru: 'Расставляем маршрутные коды', uz: "Yo'nalish kodlarini tartiblaymiz", en: 'Ordering route codes' }, lead: { ru: 'Диспетчер ставит больший код первым.', uz: 'Dispetcher katta kodni birinchi qo\'yadi.', en: 'The dispatcher puts the greater code first.' }, instruction: { ru: 'Диспетчер сравнивает коды 618 420 и 618 402. Какая запись верна?', uz: 'Dispetcher 618 420 va 618 402 kodlarini taqqoslaydi. Qaysi yozuv to\'g\'ri?', en: 'A dispatcher compares the route codes 618,420 and 618,402. Which statement is correct?' }, options: ['618 420 > 618 402', '618 420 < 618 402', '618 420 = 618 402'], correctIndex: 0, correctText: { ru: 'Первые четыре цифры совпадают. В разряде десятков 2 больше 0, поэтому 618 420 > 618 402.', uz: 'Birinchi to\'rtta raqam mos keladi. O\'nlar xonasida 2 soni 0 dan katta, shuning uchun 618 420 > 618 402.', en: 'The first four digits match. In the tens place, 2 is greater than 0, so 618,420 > 618,402.' }, wrong: [null, { ru: 'Знак направлен неверно. Сравни слева и остановись в разряде десятков: 2 больше 0.', uz: 'Belgi noto\'g\'ri yo\'nalgan. Chapdan taqqoslab, o\'nlar xonasida to\'xtang: 2 soni 0 dan katta.', en: 'The sign points the wrong way. Compare from the left and stop in the tens place: 2 is greater than 0.' }, { ru: 'Коды не равны: первое различие находится в разряде десятков.', uz: 'Kodlar teng emas: birinchi farq o\'nlar xonasida.', en: 'The codes are not equal: their first difference is in the tens place.' }], audioIntro: { ru: 'Городской диспетчер сравнивает маршрутные коды шестьсот восемнадцать тысяч четыреста двадцать и шестьсот восемнадцать тысяч четыреста два. Выбери верную запись.', uz: 'Shahar dispetcheri olti yuz o\'n sakkiz ming to\'rt yuz yigirma va olti yuz o\'n sakkiz ming to\'rt yuz ikki yo\'nalish kodlarini taqqoslaydi. To\'g\'ri yozuvni tanlang.', en: 'A city dispatcher compares route codes six hundred and eighteen thousand four hundred and twenty and six hundred and eighteen thousand four hundred and two. Choose the correct statement.' }, correctAudio: { ru: 'Верно. В разряде десятков два больше нуля, поэтому первый код больше.', uz: 'To\'g\'ri. O\'nlar xonasida ikki noldan katta, shuning uchun birinchi kod katta.', en: 'Correct. In the tens place, two is greater than zero, so the first code is greater.' }, wrongAudio: { ru: 'Начни слева и остановись на первом различии.', uz: 'Chapdan boshlang va birinchi farqda to\'xtang.', en: 'Start on the left and stop at the first difference.' } }),
};

const SCREEN_PLAN = [
  { id: 's0', type: 'hook', subtype: 'story-decision', template: 'StoryChoice', goal: 'Repair Bit\'s route-order conflict by choosing a comparison direction', misconceptions: ['last digit decides', 'digit sum decides'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'exploration', subtype: 'digit-count', template: 'GuidedSteps', goal: 'Compare digit counts through a three-step model', misconceptions: ['larger last digit'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's2', contentKey: 'p1', type: 'test', subtype: 'digit-count-check', template: 'MCScreen', goal: 'Compare unequal-length numbers', misconceptions: ['ignore digit count'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's3', contentKey: 's2', type: 'exploration', subtype: 'first-difference', template: 'GuidedPlaceTable', goal: 'Find the first different place in two worked comparisons', misconceptions: ['compare from right'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's4', contentKey: 'p2', type: 'test', subtype: 'first-difference-check', template: 'MCScreen', goal: 'Locate the first difference', misconceptions: ['wrong place'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's5', contentKey: 's3', type: 'exploration', subtype: 'comparison-sign', template: 'GuidedNumberLine', goal: 'Connect number-line order and signs step by step', misconceptions: ['reversed sign'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's6', contentKey: 'p3', type: 'test', subtype: 'comparison-sign-check', template: 'MCScreen', goal: 'Choose a comparison sign', misconceptions: ['reversed sign'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's7', contentKey: 's4', type: 'exploration', subtype: 'equality', template: 'GuidedEquality', goal: 'Verify equality place by place, including zero places', misconceptions: ['zeros ignored'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's8', contentKey: 'p4', type: 'test', subtype: 'equality-check', template: 'MCScreen', goal: 'Recognize equality', misconceptions: ['unnecessary inequality'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's9', contentKey: 's7', type: 'discovery', subtype: 'lower-place-proof', template: 'GuidedDiscovery', goal: 'Discover why lower places cannot reverse the first difference', misconceptions: ['last digit overrides'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's10', contentKey: 'p5', type: 'test', subtype: 'ordering-check', template: 'MCScreen', goal: 'Stop at the first difference', misconceptions: ['continue to units'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's11', contentKey: 's8', type: 'rule', subtype: 'comparison-rule', template: 'GuidedRule', goal: 'Assemble the comparison algorithm after discovery', misconceptions: ['partial algorithm'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's12', contentKey: 's10', type: 'practice', subtype: 'strategy-selection', template: 'GuidedStrategy', goal: 'Choose a fitting model for each comparison situation', misconceptions: ['one model for every pair'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's13', contentKey: 'p6', type: 'test', subtype: 'city-dispatch-life-transfer', template: 'TransferChoice', goal: 'Apply the comparison strategy to new city route codes', misconceptions: ['last digit decides', 'equal prefix means equal numbers'], active: true, scored: true, scope: 'final', resetOnReturn: false },
  { id: 's14', type: 'summary', subtype: 'reflection-and-title', template: 'ReflectionClaim', goal: 'Reflect on comparison and claim the title', misconceptions: ['partial algorithm'], active: true, scored: false, scope: null, resetOnReturn: true },
];

const SCREEN_META = SCREEN_PLAN.map((meta) => ({ ...meta, contentKey: meta.contentKey ?? meta.id }));

const TOTAL_SCREENS = 15;
const MOBILE_DESIGN_W = 390;
const NOTION_FLOW = SCREEN_META.map((meta, screen) => ({ screen, meta, contentKeys: [meta.contentKey] }));

const LESSON_META = {
  lessonId: 'num-4-04-v1',
  lessonTitle: {
    ru: 'Урок 4. Сравнение многозначных чисел',
    uz: "4-dars. Ko'p xonali sonlarni taqqoslash",
    en: "Lesson 4: Comparing multi-digit numbers",
  },
  skillTags: ['multi_digit_comparison', 'digit_count', 'first_different_place', 'comparison_signs', 'number_ordering', 'ordered_chain_proof'],
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

    // Local preview only. LMS playback keeps using the HTTP TTS branch above.
    if (!runtimeConfig.previewMode || typeof window === 'undefined' || !window.speechSynthesis) {
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

function useCanAdvance(audio) {
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

function useTimedReveal(count, interval = 520) {
  const [visible, setVisible] = useState(0);
  const [runKey, setRunKey] = useState(0);
  useEffect(() => {
    const reduced = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const frame = requestAnimationFrame(() => setVisible(count));
      return () => cancelAnimationFrame(frame);
    }
    const resetFrame = requestAnimationFrame(() => setVisible(0));
    const timers = Array.from({ length: count }, (_, index) => (
      window.setTimeout(() => setVisible(index + 1), 340 + index * interval)
    ));
    return () => {
      cancelAnimationFrame(resetFrame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [count, interval, runKey]);
  return { visible, replay: () => setRunKey((value) => value + 1), runKey };
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

const NextLabel = () => ({ uz: 'Davom etish', ru: 'Дальше', en: 'Continue' }[useLang()]);
const BackLabel = () => ({ uz: 'Orqaga', ru: 'Назад', en: 'Back' }[useLang()]);

const NavBack = ({ onClick, hidden = false }) => (
  <button type="button" className="btn btn-ghost" onClick={onClick} style={{ visibility: hidden ? 'hidden' : 'visible' }}>
    <span aria-hidden="true">←</span><BackLabel />
  </button>
);

const NavNext = ({ onClick, disabled, finish = false }) => {
  const lang = useLang();
  return (
    <button type="button" className={`btn btn-white-accent ${!disabled ? 'btn-ready' : ''}`} onClick={onClick} disabled={disabled}>
      {finish ? (lang === 'en' ? "Finish lesson" : lang === 'ru' ? 'Завершить урок' : 'Darsni yakunlash') : <NextLabel />}
      <span aria-hidden="true">→</span>
    </button>
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
          <div className="progress-fill progress-bar" style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }} />
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
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>
        {nav}
      </footer>
    </main>
  );
};

// The same canonical Bit used in grade 1-3 lessons and in Dars01.
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

const BitCoach = ({ text, mood = 'present', actionKey = 0 }) => (
  <div className="bit-coach" data-g4-role="visual-frame" key={actionKey}>
    <div className="bit-coach-figure"><BitSVG state={mood} /></div>
    <div className="bit-speech"><span>{text}</span></div>
  </div>
);

const FeedbackBlock = ({ show, correct, children }) => {
  const lang = useLang();
  const visible = show && children !== null && children !== undefined && String(children).trim().length > 0;
  return (
    <div data-g4-role={correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame'} data-g4-feedback={visible ? (correct ? 'solution' : 'wrong') : undefined} className={`feedback ${visible ? 'feedback-visible' : ''}`} aria-hidden={!visible} aria-live="polite">
      <div className={`feedback-card ${correct ? 'feedback-correct' : 'feedback-hint'}`}>
        <div className={`g4-bit-reaction-figure ${correct ? 'g4-bit-reaction-ok' : 'g4-bit-reaction-hint'}`} data-g4-role="feedback-bit">
          <BitSVG state={correct ? 'nod' : 'awkward'} />
        </div>
        <div className="g4-bit-reaction-copy">
          <strong>{correct ? (lang === 'en' ? "SOLUTION" : lang === 'ru' ? 'РЕШЕНИЕ' : 'YECHIM') : (lang === 'en' ? "CHECK YOUR STRATEGY" : lang === 'ru' ? 'ПРОВЕРЬ СТРАТЕГИЮ' : "YANA O'YLANG")}</strong>
          <p>{children}</p>
        </div>
      </div>
    </div>
  );
};

const ReplayReveal = ({ onClick }) => {
  const lang = useLang();
  return (
    <button type="button" className="btn btn-secondary replay-reveal" onClick={onClick}>
      <span aria-hidden="true">↻</span>{lang === 'en' ? "Show again" : lang === 'ru' ? 'Показать ещё раз' : "Yana ko'rish"}
    </button>
  );
};

const ScreenHeading = ({ c, hook = false }) => {
  const t = useT();
  return (
    <div className="heading-block">
      {hook && <span className="lesson-kicker" data-g4-role="hook-topic">{t(c.eyebrow)}</span>}
      <h1 className="title h-title" data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1>
      <p className="lead">{t(c.lead)}</p>
    </div>
  );
};

const TheoryNav = ({ audio, onNext, onPrev, first = false, ready = true }) => {
  const audioReady = useCanAdvance(audio);
  return (
    <>
      <NavBack onClick={onPrev} hidden={first} />
      <NavNext onClick={onNext} disabled={!audioReady || !ready} />
    </>
  );
};

const useGuidedReveal = (total, increment = 1) => {
  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [visible, setVisible] = useState(() => (reduced ? total : 0));
  const advance = () => setVisible((value) => Math.min(total, value + increment));
  return { visible, advance, complete: visible >= total };
};

const GuidedRevealControl = ({ reveal }) => {
  const lang = useLang();
  return (
    <button type="button" className="guided-reveal-control" onClick={reveal.advance} disabled={reveal.complete}>
      <span aria-hidden="true">{reveal.complete ? '✓' : '→'}</span>
      {reveal.complete
        ? (lang === 'en' ? 'All steps explored' : lang === 'ru' ? 'Все шаги исследованы' : "Barcha qadamlar ko'rildi")
        : (lang === 'en' ? 'Show the next step' : lang === 'ru' ? 'Показать следующий шаг' : "Keyingi qadamni ko'rish")}
    </button>
  );
};

const StoryHookScreen = ({ screen, onAnswer, onNext, onPrev }) => {
  const c = CONTENT.s0;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's0'));
  const reveal = useTimedReveal(3, 560);
  const [attempted, setAttempted] = useState([]);
  const [solved, setSolved] = useState(false);
  const [wrongIndex, setWrongIndex] = useState(null);
  const order = useMemo(() => buildOptionOrder(c.options.length, c.correctIndex, screen), [c.options.length, c.correctIndex, screen]);
  const canChoose = useCanAdvance(audio);
  const canNext = useAdvanceGate(solved, audio);

  const pick = (sourceIndex) => {
    if (!canChoose || solved || attempted.includes(sourceIndex)) return;
    const nextAttempted = [...attempted, sourceIndex];
    setAttempted(nextAttempted);
    if (sourceIndex === c.correctIndex) {
      setSolved(true);
      setWrongIndex(null);
      playSfx('correct');
      audio.pushOneOff(t(c.feedbackAudio.on_correct));
      onAnswer({
        screenIdx: screen,
        screenId: SCREEN_META[screen].id,
        studentAnswerIndex: sourceIndex,
        correct: true,
        firstTry: nextAttempted.length === 1,
        attempts: nextAttempted.length,
        attempted: nextAttempted,
        scope: SCREEN_META[screen].scope,
        skillTag: 'first_different_place',
      });
    } else {
      setWrongIndex(sourceIndex);
      playSfx('wrong');
      audio.pushOneOff(t(c.feedbackAudio.on_wrong[sourceIndex]));
      onAnswer({
        screenIdx: screen,
        screenId: SCREEN_META[screen].id,
        studentAnswerIndex: sourceIndex,
        correct: false,
        firstTry: false,
        attempts: nextAttempted.length,
        attempted: nextAttempted,
        lastWrong: sourceIndex,
        scope: SCREEN_META[screen].scope,
        skillTag: 'first_different_place',
      });
    }
  };
  const feedbackText = solved ? t(c.correctText) : (wrongIndex !== null ? t(c.wrong[wrongIndex]) : '');
  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} hidden /><NavNext onClick={onNext} disabled={!canNext} /></>}
    >
      <div className="screen-stack hook-stack" data-g4-screen="hook">
        <ScreenHeading c={c} hook />
        <h2 className="hook-question-title" data-g4-role="hook-question">{t(c.hookQuestion)}</h2>
        <div className="city-sort-scene" data-g4-role="hook-scene visual-frame">
          <div className="city-grid" />
          <div className="sort-console">
            <span className="console-badge">{t(c.badge)}</span>
            <div className="route-order">
              <div className={`route-card route-wrong reveal-item ${reveal.visible >= 1 ? 'is-visible' : ''}`}>
                <small>{lang === 'en' ? 'ROUTE A' : lang === 'ru' ? 'МАРШРУТ A' : "A YO'NALISHI"}</small><strong>842 107</strong><span>1</span>
              </div>
              <div className={`route-arrow reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`} aria-hidden="true">›</div>
              <div className={`route-card reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`}>
                <small>{lang === 'en' ? 'ROUTE B' : lang === 'ru' ? 'МАРШРУТ B' : "B YO'NALISHI"}</small><strong>842 190</strong><span>2</span>
              </div>
            </div>
            <div className={`sort-alert reveal-item ${reveal.visible >= 3 ? 'is-visible' : ''}`}>{t(c.prompt)}</div>
          </div>
          <div className="hook-bit" data-g4-role="hook-bit">
            <BitSVG state={solved ? 'nod' : wrongIndex !== null ? 'awkward' : 'think'} />
          </div>
        </div>
        <section className="hook-decision" aria-labelledby="d4-hook-question">
          <strong id="d4-hook-question">{t(c.hookQuestion)}</strong>
          <div className="hook-answer-grid" role="group" aria-label={t(c.hookQuestion)}>
            {order.map((sourceIndex, displayIndex) => {
              const inactiveWrong = attempted.includes(sourceIndex) && sourceIndex !== c.correctIndex;
              const correctReveal = solved && sourceIndex === c.correctIndex;
              return (
                <button
                  type="button"
                  data-g4-role="answer-card"
                  data-g4-branch="choice"
                  data-g4-correct={sourceIndex === c.correctIndex ? 'true' : 'false'}
                  className={`option ${inactiveWrong ? 'option-wrong' : ''} ${correctReveal ? 'option-correct-reveal' : ''}`}
                  key={sourceIndex}
                  onClick={() => pick(sourceIndex)}
                  disabled={!canChoose || solved || inactiveWrong}
                >
                  <span className="option-letter">{String.fromCharCode(65 + displayIndex)}</span>
                  <span>{t(c.options[sourceIndex])}</span>
                </button>
              );
            })}
          </div>
        </section>
        <FeedbackBlock show={solved || wrongIndex !== null} correct={solved}>{feedbackText}</FeedbackBlock>
      </div>
    </Stage>
  );
};

const RecapScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s1;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's1'));
  const reveal = useGuidedReveal(5);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} ready={reveal.complete} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack recap-stack">
        <ScreenHeading c={c} />
        <div className="recap-board">
          <div className={`recap-number reveal-item ${reveal.visible >= 1 ? 'is-visible' : ''}`}>
            <span>{c.left.number}</span><b>{t(c.left.count)}</b>
          </div>
          <div className={`recap-vs reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`}>vs</div>
          <div className={`recap-number recap-number-big reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`}>
            <span>{c.right.number}</span><b>{t(c.right.count)}</b>
          </div>
          <div className="step-rail recap-steps">
            {c.steps.map((step, index) => (
              <div key={t(step)} className={`model-step reveal-item ${reveal.visible >= index + 2 ? 'is-visible' : ''}`}>
                <span>{String(index + 1).padStart(2, '0')}</span><p>{t(step)}</p>
              </div>
            ))}
          </div>
          <div className={`recap-result reveal-item ${reveal.visible >= 5 ? 'is-visible' : ''}`}>
            <span aria-hidden="true">✓</span><b>{c.formula}</b><p>{t(c.conclusion)}</p>
          </div>
        </div>
        <GuidedRevealControl reveal={reveal} />
        <BitCoach text={t(c.conclusion)} mood={reveal.complete ? 'nod' : 'point'} actionKey={reveal.visible} />
      </div>
    </Stage>
  );
};

const PlaceTableScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s2;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's2'));
  const reveal = useGuidedReveal(8, 2);
  const headers = c.headers[lang] ?? [];
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} ready={reveal.complete} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack table-stack">
        <ScreenHeading c={c} />
        <div className="place-table-frame">
          <div className="place-table-grid place-table-head">
            {headers.map((header, index) => <span key={header} className={reveal.visible > index ? 'scan-done' : ''}>{header}</span>)}
          </div>
          {[c.a, c.b].map((row, rowIndex) => (
            <div className="place-table-grid place-table-row" key={row.join('')}>
              {row.map((digit, index) => (
                <span
                  key={`${rowIndex}-${index}`}
                  className={`${reveal.visible > index ? 'scan-done' : ''} ${index === c.firstDifferent && reveal.visible > index ? 'first-difference' : ''}`}
                >{digit}</span>
              ))}
            </div>
          ))}
          <div className={`table-scan-beam beam-${Math.min(reveal.visible, 6)}`} />
        </div>
        <div className={`explanation-callout reveal-item ${reveal.visible >= 6 ? 'is-visible' : ''}`}>{t(c.conclusion)}</div>
        <div className={`deep-contrast reveal-item ${reveal.visible >= 7 ? 'is-visible' : ''}`}>
          <div className="deep-contrast-numbers"><strong>{c.contrast.a}</strong><i>?</i><strong>{c.contrast.b}</strong></div>
          <div className="deep-contrast-trail">
            {c.contrast.trail.map((item, index) => <span className={index === 2 ? 'trail-stop' : ''} key={item}>{item}</span>)}
          </div>
          <div className={`deep-contrast-result reveal-item ${reveal.visible >= 8 ? 'is-visible' : ''}`}>
            <b>{c.contrast.result}</b><small>{t(c.contrast.note)}</small>
          </div>
        </div>
        <GuidedRevealControl reveal={reveal} />
      </div>
    </Stage>
  );
};

const NumberLineScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s3;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's3'));
  const reveal = useGuidedReveal(3);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} ready={reveal.complete} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack line-stack">
        <ScreenHeading c={c} />
        <div className="number-line-card">
          <div className="line-scale"><span>{c.start}</span><span>{c.end}</span></div>
          <div className="number-line-track">
            <div className="line-ticks" />
            <div className={`line-point point-left reveal-item ${reveal.visible >= 1 ? 'is-visible' : ''}`}><i /><b>{c.left}</b></div>
            <div className={`line-point point-right reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`}><i /><b>{c.right}</b></div>
            <div className={`line-flight reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`}><span>→</span></div>
          </div>
          <div className={`formula-answer reveal-item ${reveal.visible >= 3 ? 'is-visible' : ''}`}>{c.formula}</div>
        </div>
        <GuidedRevealControl reveal={reveal} />
        <BitCoach text={t(c.lead)} mood={reveal.complete ? 'nod' : 'point'} actionKey={reveal.visible} />
      </div>
    </Stage>
  );
};

const EqualityScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s4;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's4'));
  const reveal = useGuidedReveal(3);
  const digits = c.a.replace(' ', '').split('');
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} ready={reveal.complete} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack equality-stack">
        <ScreenHeading c={c} />
        <div className="equality-machine">
          <div className="digit-pairs">
            {digits.map((digit, index) => (
              <div key={`${digit}-${index}`} className={`digit-pair reveal-item ${reveal.visible >= 1 ? 'is-visible' : ''}`} style={{ '--delay': `${index * 80}ms` }}>
                <span>{digit}</span><i>=</i><span>{digit}</span>
              </div>
            ))}
          </div>
          <div className={`equal-pulse reveal-item ${reveal.visible >= 2 ? 'is-visible' : ''}`}>{c.formula}</div>
          <div className={`success-strip reveal-item ${reveal.visible >= 3 ? 'is-visible' : ''}`}><span>✓</span>{t(c.conclusion)}</div>
        </div>
        <GuidedRevealControl reveal={reveal} />
      </div>
    </Stage>
  );
};

const ChoiceScreen = ({ screen, c, storedAnswer, onAnswer, onNext, onPrev }) => {
  const t = useT();
  const lang = useLang();
  const intro = c.audio.intro;
  const audio = useAudio(localizedSegments(intro, lang, `s${screen}-intro`));
  const [attempted, setAttempted] = useState(storedAnswer?.attempted ?? []);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const [wrongIndex, setWrongIndex] = useState(storedAnswer?.lastWrong ?? null);
  const order = useMemo(() => buildOptionOrder(c.options.length, c.correctIndex, screen), [c.options.length, c.correctIndex, screen]);
  const canChoose = useCanAdvance(audio);
  const canNext = useAdvanceGate(solved, audio);

  const pick = (sourceIndex) => {
    if (!canChoose || solved || attempted.includes(sourceIndex)) return;
    const nextAttempted = [...attempted, sourceIndex];
    setAttempted(nextAttempted);
    if (sourceIndex === c.correctIndex) {
      setSolved(true);
      setWrongIndex(null);
      playSfx('correct');
      audio.pushOneOff(t(c.audio.on_correct));
      onAnswer({
        screenIdx: screen,
        screenId: SCREEN_META[screen].id,
        studentAnswerIndex: sourceIndex,
        correct: true,
        firstTry: nextAttempted.length === 1,
        attempts: nextAttempted.length,
        attempted: nextAttempted,
        scope: SCREEN_META[screen].scope,
        skillTag: SCREEN_META[screen].scope === 'final' ? 'number_ordering' : 'first_different_place',
      });
    } else {
      setWrongIndex(sourceIndex);
      playSfx('wrong');
      audio.pushOneOff(t(c.audio.on_wrong[sourceIndex]));
      onAnswer({
        screenIdx: screen,
        screenId: SCREEN_META[screen].id,
        studentAnswerIndex: sourceIndex,
        correct: false,
        firstTry: false,
        attempts: nextAttempted.length,
        attempted: nextAttempted,
        lastWrong: sourceIndex,
        scope: SCREEN_META[screen].scope,
        skillTag: SCREEN_META[screen].scope === 'final' ? 'number_ordering' : 'first_different_place',
      });
    }
  };

  const feedbackText = solved ? t(c.correctText) : (wrongIndex !== null ? t(c.wrong[wrongIndex]) : '');
  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canNext} /></>}
    >
      <div className="screen-stack choice-stack">
        <ScreenHeading c={c} />
        <div className="answer-stage">
          <div className={`options-grid ${solved ? 'options-solved' : ''}`} role="group" aria-label={t(c.title)}>
            {order.map((sourceIndex, displayIndex) => {
              const inactiveWrong = attempted.includes(sourceIndex) && sourceIndex !== c.correctIndex;
              const correctReveal = solved && sourceIndex === c.correctIndex;
              return (
                <button
                  type="button"
                  data-g4-branch="choice"
                  data-g4-correct={sourceIndex === c.correctIndex ? 'true' : 'false'}
                  className={`option ${inactiveWrong ? 'option-wrong' : ''} ${correctReveal ? 'option-correct-reveal' : ''}`}
                  key={sourceIndex}
                  onClick={() => pick(sourceIndex)}
                  disabled={!canChoose || solved || inactiveWrong}
                >
                  <span className="option-letter">{String.fromCharCode(65 + displayIndex)}</span>
                  <span>{t(c.options[sourceIndex])}</span>
                </button>
              );
            })}
          </div>
        </div>
        <FeedbackBlock show={solved || wrongIndex !== null} correct={solved}>{feedbackText}</FeedbackBlock>
      </div>
    </Stage>
  );
};

const WorkedExamplesScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s6;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's6'));
  const reveal = useTimedReveal(4, 430);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack examples-stack">
        <ScreenHeading c={c} />
        <div className="worked-grid">
          {c.examples.map((example, index) => (
            <article key={example.formula} className={`worked-card worked-${example.tone} reveal-item ${reveal.visible >= index + 1 ? 'is-visible' : ''}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{example.formula}</strong>
              <p>{t(example.reason)}</p>
            </article>
          ))}
        </div>
        <ReplayReveal onClick={reveal.replay} />
      </div>
    </Stage>
  );
};

const DiscoveryScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s7;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's7'));
  const reveal = useGuidedReveal(4);
  const pairs = c.a.replace(' ', '').split('').map((digit, index) => [digit, c.b.replace(' ', '')[index]]);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} ready={reveal.complete} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack discovery-stack">
        <ScreenHeading c={c} />
        <div className="discovery-lab">
          <div className="digit-lanes">
            {pairs.map((pair, index) => {
              const decision = index === 4;
              const faded = index > 4;
              return (
                <div key={`${pair.join('')}-${index}`} className={`lane-pair ${decision ? 'lane-decision' : ''} ${faded ? 'lane-faded' : ''} reveal-item ${reveal.visible >= (decision ? 2 : 1) ? 'is-visible' : ''}`}>
                  <span>{pair[0]}</span><i>{pair[0] === pair[1] ? '=' : '<'}</i><span>{pair[1]}</span>
                </div>
              );
            })}
          </div>
          <div className={`proof-strip reveal-item ${reveal.visible >= 3 ? 'is-visible' : ''}`}>{t(c.proof)}</div>
          <div className={`discovery-rule reveal-item ${reveal.visible >= 4 ? 'is-visible' : ''}`} data-g4-role="visual-frame"><BitSVG state="idea" /><strong>{t(c.discovery)}</strong></div>
        </div>
        <GuidedRevealControl reveal={reveal} />
      </div>
    </Stage>
  );
};

const RuleRevealScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s8;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's8'));
  const reveal = useGuidedReveal(3);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} ready={reveal.complete} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack rule-stack">
        <ScreenHeading c={c} />
        <div className="rule-path">
          {c.rules.map((rule, index) => (
            <article key={rule.n} className={`rule-card reveal-item ${reveal.visible >= index + 1 ? 'is-visible' : ''}`}>
              <span>{rule.n}</span><div><h2>{t(rule.title)}</h2><p>{t(rule.body)}</p></div>
            </article>
          ))}
          <div className="rule-path-line" />
        </div>
        <GuidedRevealControl reveal={reveal} />
        <BitCoach text={t(c.rules[2].body)} mood={reveal.complete ? 'nod' : 'idea'} actionKey={reveal.visible} />
      </div>
    </Stage>
  );
};

const WorkedCheckpointScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s9;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's9'));
  const reveal = useTimedReveal(4, 440);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack checkpoint-stack">
        <ScreenHeading c={c} />
        <div className="checkpoint-board">
          {c.rows.map((row, index) => (
            <div key={t(row.formula)} className={`checkpoint-row reveal-item ${reveal.visible >= index + 1 ? 'is-visible' : ''}`}>
              <span>{String(index + 1).padStart(2, '0')}</span><strong>{t(row.formula)}</strong><i>→</i><p>{t(row.reason)}</p>
            </div>
          ))}
        </div>
        <div className="not-test-label"><span aria-hidden="true">◉</span>{t(c.lead)}</div>
      </div>
    </Stage>
  );
};

const StrategyScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s10;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's10'));
  const reveal = useGuidedReveal(4);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} ready={reveal.complete} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack strategy-stack">
        <ScreenHeading c={c} />
        <div className="strategy-grid">
          {c.strategies.map((strategy, index) => (
            <article key={strategy.example} className={`strategy-card reveal-item ${reveal.visible >= index + 1 ? 'is-visible' : ''}`}>
              <span className="strategy-icon">{strategy.icon}</span>
              <h2>{t(strategy.title)}</h2><p>{t(strategy.body)}</p><code>{strategy.example}</code>
            </article>
          ))}
        </div>
        <div className={`strategy-note reveal-item ${reveal.visible >= 4 ? 'is-visible' : ''}`} data-g4-role="visual-frame"><BitSVG state="focus" /><span>{t(c.note)}</span></div>
        <GuidedRevealControl reveal={reveal} />
      </div>
    </Stage>
  );
};

const ErrorWalkthroughScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s11;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's11'));
  const reveal = useTimedReveal(4, 500);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack error-stack">
        <ScreenHeading c={c} />
        <div className="error-workbench">
          <div className="error-lab-grid">
            {c.errors.map((item, index) => (
              <article key={item.wrong} className={`error-case reveal-item ${reveal.visible >= index + 1 ? 'is-visible' : ''}`}>
                <span>{t(item.tag)}</span>
                <div className="error-formula"><s>{item.wrong}</s><i>→</i><strong>{item.correct}</strong></div>
                <p>{t(item.why)}</p>
              </article>
            ))}
          </div>
          <div className={`correct-equation reveal-item ${reveal.visible >= 4 ? 'is-visible' : ''}`}><strong>01 → 02 → 03</strong><small>{t(c.repair)}</small></div>
          <div className="workbench-bit"><BitSVG state={reveal.visible >= 4 ? 'nod' : 'awkward'} /></div>
        </div>
      </div>
    </Stage>
  );
};

const ChainProofScreen = ({ screen, onNext, onPrev }) => {
  const c = CONTENT.s13;
  const t = useT();
  const lang = useLang();
  const segments = useMemo(() => localizedSegments(c.audio, lang, 's13'), [c.audio, lang]);
  const audio = useAudio(segments);
  const reveal = useAudioSegmentReveal(audio, segments, 3);
  const syncedAudio = { ...audio, replay: reveal.replay, toggleMute: reveal.toggleMute };
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={syncedAudio} nav={<TheoryNav audio={syncedAudio} onNext={onNext} onPrev={onPrev} />}>
      <div className="screen-stack chain-proof-stack">
        <ScreenHeading c={c} />
        <section className="chain-proof-board">
          <div className="chain-proof-comparisons">
            {c.comparisons.map((item, index) => (
              <article
                className={`chain-proof-card reveal-item ${reveal.visible >= index + 1 ? 'is-visible' : ''}`}
                aria-hidden={reveal.visible < index + 1}
                key={item.pair}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <small>{item.pair}</small>
                <strong>{item.formula}</strong>
                <p>{t(item.reason)}</p>
              </article>
            ))}
          </div>
          <div className={`chain-proof-result reveal-item ${reveal.visible >= 3 ? 'is-visible' : ''}`} aria-hidden={reveal.visible < 3}>
            <BitSVG state="idea" />
            <div><span>{lang === 'en' ? "ORDER PROVED" : lang === 'ru' ? 'ПОРЯДОК ДОКАЗАН' : 'TARTIB ISBOTLANDI'}</span><strong>{c.chain}</strong><p>{t(c.conclusion)}</p></div>
          </div>
        </section>
      </div>
    </Stage>
  );
};

const SummaryScreen = ({ screen, storedAnswer, answers = [], onAnswer, onPrev, finishLesson }) => {
  const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true);
  const [revealRequested, setRevealRequested] = useState(false);
  const [reflectionChoice, setReflectionChoice] = useState(storedAnswer?.reflectionChoice ?? null);
  const c = CONTENT.s14;
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, 's14'));
  const reveal = useTimedReveal(4, 430);
  const scoredIndexes = useMemo(
    () => SCREEN_META.map((meta, index) => (meta.scored ? index : null)).filter((index) => index !== null),
    [],
  );
  const firstTry = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
  const complete = reveal.visible >= 4;
  const totalScored = scoredIndexes.length;
  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const finalState = complete || audio.completed || audio.muted || reduced;
  const rewardTitle = firstTry === totalScored
    ? { ru: 'Мастер сравнения', uz: 'Taqqoslash ustasi', en: "Comparison master" }
    : firstTry >= Math.max(1, totalScored - 1)
      ? { ru: 'Знаток порядка', uz: 'Tartib bilimdoni', en: "Order expert" }
      : { ru: 'Исследователь сравнений', uz: 'Taqqoslash tadqiqotchisi', en: "Comparison explorer" };
  const reflectionOptions = [
    { ru: 'Сначала сравню количество цифр.', uz: 'Avval raqamlar sonini taqqoslayman.', en: 'First, I will compare the number of digits.' },
    { ru: 'При равной длине пойду слева направо.', uz: "Uzunligi teng bo'lsa, chapdan o'ngga yuraman.", en: 'If the lengths match, I will move from left to right.' },
    { ru: 'Остановлюсь на первом различии.', uz: "Birinchi farqda to'xtayman.", en: 'I will stop at the first difference.' },
  ];
  const reflectionQuestion = { ru: 'Какой шаг ты точно возьмёшь в следующую задачу?', uz: 'Keyingi masalada qaysi qadamni albatta ishlatasiz?', en: 'Which step will you definitely use in the next problem?' };
  const chooseReflection = (index) => {
    if (titleClaimed) return;
    setReflectionChoice(index);
    onAnswer({
      ...(storedAnswer ?? {}),
      stage: null,
      screenIdx: screen,
      reflectionChoice: index,
      titleClaimed: false,
    });
    audio.pushOneOff(t(reflectionOptions[index]));
  };
  const claimTitle = () => {
    if (!finalState || reflectionChoice === null || titleClaimed) return;
    setTitleClaimed(true);
    setRevealRequested(true);
    onAnswer({
      stage: null,
      screenIdx: screen,
      question: t(reflectionQuestion),
      options: reflectionOptions.map((option) => t(option)),
      correctIndex: null,
      correctAnswer: null,
      studentAnswerIndex: reflectionChoice,
      studentAnswer: t(reflectionOptions[reflectionChoice]),
      correct: true,
      firstTry: true,
      attempts: 1,
      solved: true,
      reflectionChoice,
      titleClaimed: true,
    });
  };
  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={titleClaimed ? finishLesson : undefined} disabled={!titleClaimed} finish /></>}
    >
      <div className="screen-stack finale-screen">
        <G4TitleReveal active={revealRequested} title={t(rewardTitle)} lang={lang} />
        <style>{G4_TITLE_STYLES}</style>
        <header className="finale-heading">
          <span>{lang === 'en' ? "FINAL STAGE" : lang === 'ru' ? 'ФИНАЛЬНЫЙ ЭТАП' : 'YAKUNIY BOSQICH'}</span>
          <h1>{t(c.title)}</h1>
          <p>{lang === 'en' ? "The sorting error from the start of the lesson is fixed: Bit now looks for the first difference from the left, not at the last digit." : lang === 'ru' ? 'Ошибочная сортировка из начала урока исправлена: Бит смотрит не на последнюю цифру, а на первое различие слева.' : "Dars boshidagi noto'g'ri saralash tuzatildi: Bit endi oxirgi raqamga emas, chapdagi birinchi farqqa qaraydi."}</p>
        </header>

        <div className="finale-layout">
          <div className="finale-main">
            <div className="finale-mastery">
              {c.takeaways.map((item, index) => (
                <article className={`finale-takeaway ${reveal.visible >= index + 1 ? 'is-visible' : ''}`} key={t(item)}>
                  <span>{String(index + 1).padStart(2, '0')}</span><p>{t(item)}</p>
                </article>
              ))}
            </div>
            <div className={`finale-proof ${reveal.visible >= 3 ? 'is-visible' : ''}`}>
              <span>{lang === 'en' ? "OPENING MISSION SOLUTION" : lang === 'ru' ? 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ' : "BOSHLANG'ICH MISSIYA YECHIMI"}</span>
              <strong>{lang === 'en' ? "ROUTES RESTORED" : lang === 'ru' ? 'МАРШРУТЫ ВОССТАНОВЛЕНЫ' : "YO'NALISHLAR TIKLANDI"}</strong>
              <p>{t(c.lead)}</p>
            </div>
            <div className={`finale-bridge ${complete ? 'is-visible' : ''}`}>
              <span aria-hidden="true">→</span>
              <div><strong>{lang === 'en' ? "NEXT MISSION" : lang === 'ru' ? 'СЛЕДУЮЩАЯ МИССИЯ' : 'KEYINGI MISSIYA'}</strong><p>{t(c.bridge)}</p></div>
            </div>
          </div>

          <aside className="finale-actions">
          <section className="finale-reflection" aria-labelledby="d4-reflection-question">
            <strong id="d4-reflection-question">{t(reflectionQuestion)}</strong>
            <div>
              {reflectionOptions.map((option, index) => (
                <button type="button" className={reflectionChoice === index ? 'is-selected' : ''} aria-pressed={reflectionChoice === index} onClick={() => chooseReflection(index)} key={t(option)}>
                  <span>{index + 1}</span>{t(option)}
                </button>
              ))}
            </div>
          </section>

          {!titleClaimed && (
            <button
              type="button"
              className="btn-white-accent g4-title-claim"
              data-g4-role="title-claim"
              disabled={!finalState || reflectionChoice === null}
              onClick={claimTitle}
              aria-label={t({ uz: "Unvonni olish", ru: 'Получить звание', en: 'Claim title' })}
            >
              <span aria-hidden="true">★</span>
              <strong>{finalState && reflectionChoice !== null
                ? t({ uz: "Unvonni olish", ru: 'Получить звание', en: 'Claim title' })
                : t({ uz: "Avval fikringizni tanlang", ru: 'Сначала выбери свой вывод', en: 'Choose your reflection first' })}</strong>
            </button>
          )}
          {titleClaimed && <G4TitleCard title={t(rewardTitle)} lang={lang} firstTry={firstTry} totalScored={totalScored} />}
          </aside>
        </div>
      </div>
    </Stage>
  );
};

const MicroTheoryScreen = ({ screen, contentKey, onNext, onPrev }) => {
  const c = CONTENT[contentKey];
  const t = useT();
  const lang = useLang();
  const audio = useAudio(localizedSegments(c.audio, lang, `s${screen}-micro`));
  const example = c.formula ?? c.proof ?? c.discovery ?? c.prompt;
  const explanation = c.conclusion ?? c.discovery ?? c.prompt ?? c.lead;
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<TheoryNav audio={audio} onNext={onNext} onPrev={onPrev} first={screen === 0} />}>
      <div className="screen-stack micro-theory-screen">
        <ScreenHeading c={c} />
        {c.hookQuestion && <div className="hook-question"><span>?</span><strong>{t(c.hookQuestion)}</strong></div>}
        <section className="micro-theory-card">
          <span>{lang === 'en' ? "OBSERVATION" : lang === 'ru' ? 'НАБЛЮДЕНИЕ' : 'KUZATUV'}</span>
          {example && <strong className="micro-theory-example">{t(example)}</strong>}
          <p>{t(explanation)}</p>
        </section>
      </div>
    </Stage>
  );
};

const Screen0 = (props) => <StoryHookScreen {...props} screen={0} />;
const Screen1 = (props) => <RecapScreen {...props} screen={1} />;
const Screen2 = (props) => <ChoiceScreen {...props} screen={2} c={PRACTICE_CONTENT.p1} />;
const Screen3 = (props) => <PlaceTableScreen {...props} screen={3} />;
const Screen4 = (props) => <ChoiceScreen {...props} screen={4} c={PRACTICE_CONTENT.p2} />;
const Screen5 = (props) => <NumberLineScreen {...props} screen={5} />;
const Screen6 = (props) => <ChoiceScreen {...props} screen={6} c={PRACTICE_CONTENT.p3} />;
const Screen7 = (props) => <EqualityScreen {...props} screen={7} />;
const Screen8 = (props) => <ChoiceScreen {...props} screen={8} c={PRACTICE_CONTENT.p4} />;
const Screen9 = (props) => <DiscoveryScreen {...props} screen={9} />;
const Screen10 = (props) => <ChoiceScreen {...props} screen={10} c={PRACTICE_CONTENT.p5} />;
const Screen11 = (props) => <RuleRevealScreen {...props} screen={11} />;
const Screen12 = (props) => <StrategyScreen {...props} screen={12} />;
const Screen13 = (props) => <ChoiceScreen {...props} screen={13} c={PRACTICE_CONTENT.p6} />;
const Screen14 = (props) => <SummaryScreen {...props} screen={14} />;

// Kept as approved visual references while the compact, no-scroll flow is active.
Object.freeze([StoryHookScreen, RecapScreen, PlaceTableScreen, NumberLineScreen, EqualityScreen, WorkedExamplesScreen, DiscoveryScreen, RuleRevealScreen, WorkedCheckpointScreen, StrategyScreen, ErrorWalkthroughScreen, ChainProofScreen, MicroTheoryScreen]);

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6,
  Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14,
];

export default function Grade4Dars04({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode = false }) {
  useMobileZoom();
  const preview = langProp === undefined || langProp === null;
  const audioPreview = previewMode === true || preview;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(preview ? previewLang : langProp);
  const safeName = studentName || (lang === 'en' ? 'Student' : lang === 'ru' ? 'Ученик' : "O'quvchi");
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    studentName: safeName,
    voiceGender: voiceGender || 'f',
    previewMode: audioPreview,
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
    const correctAnswers = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
    const totalQuestions = scoredIndexes.length;
    const finalScore = correctAnswers;
    const finalTotal = totalQuestions;
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang],
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions,
      correctAnswers,
      scorePercent: Math.round((correctAnswers / totalQuestions) * 100),
      finalScore,
      finalTotal,
      passed: correctAnswers / totalQuestions >= 0.6,
      firstTryStats: { total: totalQuestions, firstTryCorrect: correctAnswers },
      attemptsTotal: scoredAnswers.reduce((sum, answer) => sum + (answer?.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else console.log('[Grade4 Dars04 preview]', payload);
  }, [answers, lang, onFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
  const previous = () => setCurrent((value) => Math.max(value - 1, 0));

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className={`lesson-root ${preview ? 'lesson-preview' : ''}`}>
        {preview && (
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
.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root p,
.lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }
.lesson-root button { font: inherit; }
.title {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 650;
  line-height: 1.08;
  letter-spacing: -.012em;
}
.h-title { font-size: clamp(26px, 4.2vw, 36px); }
.lead {
  width: min(780px, 100%);
  color: ${T.ink2};
  font-size: clamp(14px, 1.8vw, 16px);
  line-height: 1.48;
}
.heading-block { display: grid; gap: 8px; }
.stage {
  width: min(936px, 100%);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}
.stage-header {
  flex-shrink: 0;
  padding-top: 10px;
  padding-bottom: 8px;
  background: rgba(247,248,244,.88);
  backdrop-filter: blur(14px);
}
.progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 10px;
  border-radius: 999px;
  background: rgba(80,97,109,.16);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, ${T.cyan}, ${T.accent});
  box-shadow: 0 0 12px rgba(255,91,53,.42);
  transition: width .45s ease;
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
.screen-count { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; }
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
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: visible;
  padding-top: clamp(8px, 1.4vw, 13px);
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.stage-content > .screen-stack {
  max-height: 100%;
  transform-origin: top center;
}
.micro-theory-screen { width: 100%; max-height: 100%; gap: 12px; }
.micro-theory-card { display: grid; gap: 8px; min-width: 0; padding: clamp(12px, 2vw, 18px); border-radius: 20px; background: rgba(255,255,255,.9); box-shadow: 0 12px 30px -22px rgba(${T.shadowBase},.45); }
.micro-theory-card > span { color: ${T.cyan}; font-size: 10px; font-weight: 900; letter-spacing: .12em; }
.micro-theory-card p { margin: 0; color: ${T.ink2}; font-size: clamp(12px, 1.7vw, 15px); line-height: 1.45; overflow-wrap: anywhere; }
.micro-theory-example { color: ${T.navy}; font: 800 clamp(20px, 3.8vw, 36px)/1.1 'JetBrains Mono', monospace; overflow-wrap: anywhere; }
.hook-question { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 10px 14px; border-radius: 16px; color: ${T.navy}; background: ${T.cyanSoft}; }
.hook-question span { width: 28px; height: 28px; flex: 0 0 28px; display: grid; place-items: center; border-radius: 50%; color: white; background: ${T.cyan}; font-weight: 900; }
.hook-question strong { font-size: clamp(13px, 2vw, 17px); overflow-wrap: anywhere; }
.stage-nav {
  flex-shrink: 0;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
  background: rgba(247,248,244,.92);
  border-top: 1px solid rgba(80,97,109,.14);
  backdrop-filter: blur(14px);
}
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
.btn {
  min-height: 48px;
  padding: 11px 20px;
  border: 0;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease;
}
.btn-white-accent {
  margin-left: auto;
  color: ${T.accent};
  background: #FFFFFF;
  box-shadow: 0 9px 24px -12px rgba(255,91,53,.52), 0 0 0 1px rgba(255,91,53,.14);
}
.btn-white-accent:hover:not(:disabled), .btn-white-accent.btn-ready {
  color: #FFFFFF;
  background: ${T.accent};
  box-shadow: 0 12px 28px -12px rgba(255,91,53,.65);
}
.btn-ready { animation: ready-pulse .65s ease-in-out 1; }
@keyframes ready-pulse { 50% { transform: scale(1.035); box-shadow: 0 14px 32px -10px rgba(255,91,53,.68); } }
.btn-ghost { color: ${T.ink2}; background: transparent; }
.btn-ghost:hover { background: #FFFFFF; box-shadow: 0 8px 20px -15px rgba(${T.shadowBase},.4); }
.btn-secondary {
  color: ${T.cyan};
  background: #FFFFFF;
  box-shadow: 0 8px 22px -14px rgba(22,143,163,.55), 0 0 0 1px rgba(22,143,163,.12);
}
.btn-secondary:hover:not(:disabled) { color: #FFFFFF; background: ${T.cyan}; }
.btn:disabled { opacity: .4; cursor: not-allowed; animation: none; box-shadow: none; }
.replay-reveal { min-height: 44px; padding: 8px 14px; align-self: flex-end; font-size: 12px; }
.reveal-item {
  opacity: 0;
  transform: translateY(14px) scale(.985);
  filter: blur(3px);
  transition: opacity .6s ease, transform .7s cubic-bezier(.16,1,.3,1), filter .55s ease;
}
.reveal-item.is-visible { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }

/* Canonical Bit movement vocabulary from Dars01. */
.g1-char { width: 100%; height: 100%; overflow: visible; }
.g1-bit-wave, .bit-wave-left, .bit-wave-right, .bit-point-arm, .bit-think-hand,
.bit-nod-hand, .g1-bit-ant, .bit-idea-bulb, .bit-focus-scan {
  transform-box: fill-box;
  transform-origin: center;
}
.g1-bit-wave { animation: bit-wave 2.4s ease-in-out 2; transform-origin: 20% 80%; }
.bit-double-wave .bit-wave-left { animation: bit-wave-left 2.4s ease-in-out 2; transform-origin: 80% 80%; }
.bit-double-wave .bit-wave-right { animation: bit-wave 2.4s ease-in-out .12s 2; transform-origin: 20% 80%; }
.bit-point-arm { animation: bit-point 2.4s ease-in-out 2; transform-origin: 10% 70%; }
.bit-point-target { animation: target-pulse 2.4s ease-in-out 2; transform-origin: center; }
.bit-think-hand { animation: think-hand 2.4s ease-in-out 2; transform-origin: 20% 80%; }
.bit-idea-bulb { animation: bulb-pop 2.4s ease-in-out 2; }
.bit-focus-scan { animation: focus-scan 2.4s ease-in-out 2; }
.bit-nod-check { animation: nod-check .8s cubic-bezier(.16,1,.3,1) both; transform-origin: center; }
.g1-char-state-nod { animation: bit-nod .95s ease-in-out both; }
.g1-char-state-awkward .g1-bit-ant { animation: bit-awkward-ant .75s ease both; transform-origin: bottom; }
@keyframes bit-wave { 0%,100% { transform: rotate(0); } 45% { transform: rotate(13deg); } }
@keyframes bit-wave-left { 0%,100% { transform: rotate(0); } 45% { transform: rotate(-13deg); } }
@keyframes bit-point { 0%,100% { transform: rotate(0); } 50% { transform: rotate(-5deg) translateX(2px); } }
@keyframes target-pulse { 50% { transform: scale(1.2); opacity: .65; } }
@keyframes think-hand { 50% { transform: rotate(-4deg) translateY(-2px); } }
@keyframes bulb-pop { 0%,100% { transform: scale(.92); } 45% { transform: scale(1.12) rotate(3deg); } }
@keyframes focus-scan { 0%,100% { transform: translateY(-5px); opacity: .55; } 50% { transform: translateY(8px); opacity: 1; } }
@keyframes nod-check { from { opacity: 0; transform: scale(.3) rotate(-15deg); } to { opacity: 1; transform: scale(1); } }
@keyframes bit-nod { 35% { transform: translateY(3px) rotate(2deg); } 70% { transform: translateY(-2px); } }
@keyframes bit-awkward-ant { to { transform: rotate(-13deg) translateY(2px); } }
.bit-coach { display: flex; align-items: center; justify-content: center; gap: 10px; }
.bit-coach-figure { width: 66px; height: 82px; flex: 0 0 66px; animation: coach-enter .72s cubic-bezier(.16,1,.3,1) both; }
@keyframes coach-enter { from { opacity: 0; transform: translateY(12px) scale(.88); } to { opacity: 1; transform: none; } }
.bit-speech {
  max-width: 540px;
  padding: 10px 14px;
  border-radius: 15px 15px 15px 4px;
  color: ${T.ink2};
  background: #FFFFFF;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  box-shadow: 0 12px 25px -20px rgba(${T.shadowBase},.48);
}

/* Hook: Lumo City route console. */
.city-sort-scene {
  position: relative;
  isolation: isolate;
  width: min(790px, 100%);
  min-height: 246px;
  margin: 0 auto;
  padding: 22px 190px 22px 22px;
  border-radius: 25px;
  overflow: hidden;
  color: #EAF9FB;
  background:
    radial-gradient(circle at 87% 20%, rgba(121,211,218,.18), transparent 25%),
    linear-gradient(140deg, rgba(22,143,163,.28), transparent 48%),
    linear-gradient(135deg, #153B50, #0B2232 72%);
  box-shadow: 0 24px 52px -30px rgba(14,33,44,.78);
}
.city-sort-scene::after { content: ''; position: absolute; inset: 1px; border: 1px solid rgba(144,228,235,.12); border-radius: 24px; pointer-events: none; }
.city-grid { position: absolute; inset: 0; z-index: -1; opacity: .16; background-image: linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px); background-size: 28px 28px; }
.sort-console { display: grid; gap: 14px; position: relative; z-index: 2; }
.console-badge { width: max-content; padding: 5px 8px; border: 1px solid rgba(255,183,107,.25); border-radius: 999px; color: #FFD29E; background: rgba(169,111,19,.18); font: 800 11px 'JetBrains Mono', monospace; letter-spacing: .12em; }
.route-order { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; }
.route-card { position: relative; min-width: 0; padding: 12px; border: 1px solid rgba(121,211,218,.18); border-radius: 16px; background: rgba(1,13,22,.52); box-shadow: inset 0 0 22px rgba(121,211,218,.04); }
.route-card small { display: block; color: #79D3DA; font: 800 11px 'JetBrains Mono', monospace; letter-spacing: .12em; }
.route-card strong { display: block; margin-top: 7px; color: #FFFFFF; font: 850 clamp(18px,3vw,28px) 'JetBrains Mono', monospace; white-space: nowrap; }
.route-card > span { position: absolute; top: -9px; right: -7px; width: 25px; height: 25px; display: grid; place-items: center; border-radius: 50%; color: #FFFFFF; background: ${T.cyan}; font: 900 11px 'JetBrains Mono', monospace; }
.route-wrong { border-color: rgba(255,91,53,.45); box-shadow: inset 0 0 30px rgba(255,91,53,.08), 0 0 0 3px rgba(255,91,53,.08); }
.route-wrong > span { background: ${T.accent}; animation: alert-pulse 2.4s ease-in-out 2; }
.route-arrow { color: #79D3DA; font: 300 38px 'Manrope', sans-serif; }
.sort-alert { padding: 9px 12px; border-radius: 12px; color: #FFD4C9; background: rgba(255,91,53,.13); font-size: 11px; font-weight: 750; line-height: 1.35; }
.hook-bit { position: absolute; right: 24px; bottom: 13px; width: 136px; }
.hook-bit > svg { width: 102px; height: 128px; margin-left: 18px; }
.hook-stack { gap: 7px; }
.hook-stack .heading-block { gap: 4px; }
.hook-stack .h-title { font-size: clamp(23px,3.4vw,34px); }
.hook-stack .lead { font-size: 12px; line-height: 1.35; }
.hook-decision { padding: 9px; border-radius: 16px; background: rgba(255,255,255,.9); box-shadow: 0 12px 28px -22px rgba(${T.shadowBase},.46); }
.hook-decision > strong { display: block; color: ${T.navy}; font: 700 16px/1.2 'Source Serif 4',serif; }
.hook-answer-grid { margin-top: 7px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px; }
.hook-answer-grid .option { min-height: 54px; padding: 9px 12px; font-size: 14px; line-height: 1.3; }
@keyframes alert-pulse { 50% { transform: scale(1.12); box-shadow: 0 0 18px rgba(255,91,53,.65); } }

/* Recap and digit-count explanation. */
.recap-board, .model-frame, .place-table-frame, .number-line-card, .scan-console,
.equality-machine, .discovery-lab, .checkpoint-board, .error-workbench {
  width: min(790px, 100%);
  margin: 0 auto;
  border-radius: 22px;
  background: rgba(255,255,255,.88);
  box-shadow: 0 20px 44px -32px rgba(${T.shadowBase},.48), inset 0 0 0 1px rgba(80,97,109,.08);
}
.recap-board { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; padding: 16px; }
.recap-number { min-height: 116px; padding: 18px; display: grid; place-items: center; gap: 7px; border-radius: 18px; background: ${T.cyanSoft}; }
.recap-number-big { background: ${T.accentSoft}; }
.recap-number span { color: ${T.navy}; font: 850 clamp(22px,4vw,36px) 'JetBrains Mono', monospace; white-space: nowrap; }
.recap-number b { color: ${T.cyan}; font-size: 12px; }
.recap-number-big b { color: ${T.accent}; }
.recap-vs { color: ${T.ink3}; font: 800 12px 'JetBrains Mono', monospace; }
.recap-steps { grid-column: 1 / -1; }
.recap-result { grid-column: 1 / -1; display: grid; grid-template-columns: auto auto 1fr; align-items: center; justify-content: center; gap: 9px; padding: 10px; border-radius: 12px; color: ${T.success}; background: ${T.successSoft}; font-size: 12px; font-weight: 800; }
.recap-result > span { width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%; color: #FFFFFF; background: ${T.success}; }
.recap-result > b { color: ${T.navy}; font: 900 15px 'JetBrains Mono',monospace; }.recap-result > p { font-size: 10px; }
.recap-stack { gap: 8px; }
.recap-stack .heading-block { gap: 4px; }
.recap-stack .h-title { font-size: clamp(23px,3.2vw,30px); }
.recap-stack .lead { font-size: 12px; line-height: 1.35; }
.recap-stack .recap-board { padding: 10px; gap: 6px; }
.recap-stack .recap-number { min-height: 76px; padding: 8px; gap: 4px; }
.recap-stack .recap-number span { font-size: clamp(19px,3vw,27px); }
.recap-stack .recap-number b { font-size: 10px; }
.recap-stack .recap-steps { gap: 6px; }
.recap-stack .model-step { min-height: 52px; padding: 6px 8px; gap: 6px; }
.recap-stack .model-step > span { width: 24px; height: 24px; flex-basis: 24px; }
.recap-stack .model-step p { font-size: 10px; line-height: 1.3; }
.recap-stack .recap-result { padding: 6px 8px; gap: 6px; }
.recap-stack .guided-reveal-control { min-height: 42px; padding: 6px 12px; }
.recap-stack .bit-coach { gap: 7px; }
.recap-stack .bit-coach-figure { width: 50px; height: 62px; flex-basis: 50px; }
.recap-stack .bit-speech { padding: 7px 10px; font-size: 10px; line-height: 1.3; }
.digit-count-model { padding: 20px; display: grid; gap: 15px; }
.formula-display { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 14px; }
.formula-display span { padding: 13px; border-radius: 15px; color: ${T.navy}; background: #F8FAF8; text-align: center; font: 850 clamp(21px,4vw,34px) 'JetBrains Mono', monospace; }
.formula-display i { color: ${T.accent}; font: 900 30px 'Source Serif 4', serif; font-style: normal; }
.step-rail { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.model-step { min-height: 76px; padding: 10px; border-radius: 14px; display: flex; align-items: center; gap: 9px; background: ${T.cyanSoft}; }
.model-step > span { width: 29px; height: 29px; flex: 0 0 29px; display: grid; place-items: center; border-radius: 9px; color: #FFFFFF; background: ${T.cyan}; font: 850 9px 'JetBrains Mono', monospace; }
.model-step p { color: ${T.ink2}; font-size: 11px; font-weight: 750; line-height: 1.35; }
.formula-answer { padding: 11px 16px; border-radius: 14px; color: ${T.success}; background: ${T.successSoft}; text-align: center; font: 900 clamp(18px,3.2vw,26px) 'JetBrains Mono', monospace; box-shadow: 0 12px 24px -20px rgba(34,122,83,.48); }
.guided-reveal-control { min-height: 46px; margin: 0 auto; padding: 8px 15px; border: 0; border-radius: 13px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; color: #FFFFFF; background: ${T.cyan}; box-shadow: 0 12px 24px -16px rgba(22,143,163,.72); font-weight: 800; cursor: pointer; transition: transform .5s ease,opacity .5s ease; }
.guided-reveal-control > span { width: 25px; height: 25px; border-radius: 8px; display: grid; place-items: center; color: ${T.cyan}; background: #FFFFFF; }
.guided-reveal-control:hover:not(:disabled) { transform: translateY(-2px); }
.guided-reveal-control:disabled { color: ${T.success}; background: ${T.successSoft}; box-shadow: none; cursor: default; }
.guided-reveal-control:disabled > span { color: #FFFFFF; background: ${T.success}; }

/* Place table scanning. */
.place-table-frame { position: relative; padding: 15px; overflow: hidden; }
.place-table-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); }
.place-table-grid > span { min-width: 0; display: grid; place-items: center; border-right: 1px solid rgba(80,97,109,.10); opacity: .42; transition: color .45s ease, background .45s ease, opacity .45s ease, transform .45s ease; }
.place-table-grid > span:last-child { border-right: 0; }
.place-table-head > span { min-height: 37px; color: ${T.ink3}; background: #F6F8F6; font-size: 10px; font-weight: 800; text-align: center; }
.place-table-row > span { min-height: 55px; color: ${T.navy}; background: #FFFFFF; font: 850 clamp(18px,3vw,28px) 'JetBrains Mono', monospace; }
.place-table-row + .place-table-row { border-top: 1px solid rgba(80,97,109,.10); }
.place-table-grid > span.scan-done { opacity: 1; }
.place-table-grid > span.first-difference { color: #FFFFFF; background: ${T.accent}; transform: scale(.94); border-radius: 10px; box-shadow: 0 8px 18px -10px rgba(255,91,53,.7); }
.table-scan-beam { position: absolute; top: 15px; bottom: 15px; left: 15px; width: calc((100% - 30px) / 6); pointer-events: none; border: 2px solid rgba(22,143,163,.35); border-radius: 11px; box-shadow: 0 0 22px rgba(22,143,163,.16); transition: transform .38s cubic-bezier(.22,.8,.3,1); }
.beam-1 { transform: translateX(0); }.beam-2 { transform: translateX(100%); }.beam-3 { transform: translateX(200%); }.beam-4 { transform: translateX(300%); }.beam-5 { transform: translateX(400%); border-color: rgba(255,91,53,.55); }.beam-6 { transform: translateX(400%); border-color: rgba(255,91,53,.55); }
.explanation-callout { width: min(700px,100%); margin: 0 auto; padding: 11px 14px; border-left: 4px solid ${T.accent}; border-radius: 0 13px 13px 0; color: ${T.ink2}; background: ${T.accentSoft}; font-size: 12px; font-weight: 750; line-height: 1.4; }
.deep-contrast { width: min(700px,100%); margin: 0 auto; padding: 11px; border-radius: 15px; display: grid; grid-template-columns: 1fr auto 1.2fr; align-items: center; gap: 9px; background: #FFFFFF; box-shadow: 0 12px 25px -21px rgba(${T.shadowBase},.46); }
.deep-contrast-numbers { display: flex; align-items: center; justify-content: center; gap: 6px; }.deep-contrast-numbers strong { color: ${T.navy}; font: 850 13px 'JetBrains Mono',monospace; }.deep-contrast-numbers i { color: ${T.accent}; font-style: normal; font-weight: 900; }
.deep-contrast-trail { display: flex; gap: 4px; }.deep-contrast-trail span { padding: 5px 6px; border-radius: 8px; color: ${T.cyan}; background: ${T.cyanSoft}; font: 800 11px 'JetBrains Mono',monospace; }.deep-contrast-trail .trail-stop { color: #FFFFFF; background: ${T.accent}; }
.deep-contrast-result { display: grid; gap: 2px; }.deep-contrast-result b { color: ${T.success}; font: 850 12px 'JetBrains Mono',monospace; }.deep-contrast-result small { color: ${T.ink2}; font-size: 11px; line-height: 1.35; }

/* Number line and first-difference scan. */
.number-line-card { padding: 22px 26px 18px; }
.line-scale { display: flex; justify-content: space-between; color: ${T.ink3}; font: 750 11px 'JetBrains Mono', monospace; }
.number-line-track { position: relative; height: 116px; margin: 2px 16px 0; }
.line-ticks { position: absolute; left: 0; right: 0; top: 58px; height: 4px; border-radius: 999px; background: linear-gradient(90deg, ${T.cyan}, ${T.accent}); }
.line-ticks::after { content: ''; position: absolute; inset: -8px 0; opacity: .25; background: repeating-linear-gradient(90deg, transparent 0 calc(10% - 1px), ${T.ink2} calc(10% - 1px) 10%); }
.line-point { position: absolute; top: 22px; display: grid; justify-items: center; gap: 5px; }
.line-point i { width: 18px; height: 18px; border: 5px solid #FFFFFF; border-radius: 50%; background: ${T.cyan}; box-shadow: 0 0 0 3px rgba(22,143,163,.18), 0 7px 13px -7px rgba(${T.shadowBase},.6); }
.line-point b { padding: 5px 7px; border-radius: 8px; color: ${T.navy}; background: #FFFFFF; font: 800 10px 'JetBrains Mono', monospace; box-shadow: 0 8px 17px -13px rgba(${T.shadowBase},.5); }
.point-left { left: 5%; }.point-right { right: 5%; }
.point-right i { background: ${T.accent}; box-shadow: 0 0 0 3px rgba(255,91,53,.17), 0 7px 13px -7px rgba(${T.shadowBase},.6); }
.line-flight { position: absolute; left: 25%; right: 25%; top: 58px; color: ${T.accent}; text-align: center; font-size: 28px; transform-origin: left; }
.line-flight.is-visible { animation: flight-in .8s cubic-bezier(.16,1,.3,1) both; }
@keyframes flight-in { from { opacity: 0; transform: scaleX(.15); } to { opacity: 1; transform: scaleX(1); } }
.scan-console { padding: 18px; display: grid; gap: 15px; background: linear-gradient(145deg,#173B52,#102C3E); color: #FFFFFF; }
.scan-numbers { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.scan-numbers strong { padding: 12px; border: 1px solid rgba(121,211,218,.16); border-radius: 14px; background: rgba(1,13,22,.36); text-align: center; font: 850 clamp(22px,4vw,34px) 'JetBrains Mono', monospace; }
.comparison-scan { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; }
.scan-chip { min-height: 76px; padding: 10px; border: 1px solid rgba(121,211,218,.15); border-radius: 13px; display: grid; place-items: center; gap: 3px; background: rgba(121,211,218,.08); }
.scan-chip b { color: #9DE3E7; font: 850 17px 'JetBrains Mono', monospace; }
.scan-chip span { color: rgba(234,249,251,.7); font-size: 11px; font-weight: 750; text-align: center; }
.scan-decision { border-color: rgba(255,183,107,.3); background: rgba(255,91,53,.16); }
.scan-decision b { color: #FFD29E; }
.decision-banner { padding: 10px 13px; border-radius: 13px; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: #B5F2D2; background: rgba(34,122,83,.2); }
.decision-banner span { font: 850 17px 'JetBrains Mono', monospace; }.decision-banner small { max-width: 340px; text-align: right; font-size: 11px; line-height: 1.35; }

/* Equality machine. */
.equality-machine { padding: 21px; display: grid; gap: 14px; }
.digit-pairs { display: grid; grid-template-columns: repeat(6, 1fr); gap: 7px; }
.digit-pair { min-height: 96px; padding: 8px 4px; border-radius: 13px; display: grid; place-items: center; background: #F7F9F7; animation-delay: var(--delay); }
.digit-pair.is-visible { animation: pair-match .72s cubic-bezier(.16,1,.3,1) var(--delay) both; }
.digit-pair span { color: ${T.navy}; font: 850 21px 'JetBrains Mono', monospace; }
.digit-pair i { color: ${T.cyan}; font: 850 10px 'JetBrains Mono', monospace; font-style: normal; }
@keyframes pair-match { from { opacity: 0; transform: translateY(10px) scale(.9); } 70% { transform: translateY(-2px) scale(1.04); } to { opacity: 1; transform: none; } }
.equal-pulse { padding: 11px; border-radius: 14px; color: ${T.cyan}; background: ${T.cyanSoft}; text-align: center; font: 900 clamp(19px,3vw,27px) 'JetBrains Mono', monospace; }
.equal-pulse.is-visible { animation: equal-glow 1.2s ease both; }
@keyframes equal-glow { 50% { box-shadow: 0 0 0 8px rgba(22,143,163,.09); } }
.success-strip { padding: 9px 12px; border-radius: 12px; display: flex; justify-content: center; align-items: center; gap: 8px; color: ${T.success}; background: ${T.successSoft}; font-size: 11px; font-weight: 800; }

/* Two deliberate tests only. */
.choice-stack { justify-content: flex-start; }
.options-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.option {
  min-height: 61px;
  padding: 12px 14px;
  border: 1px solid rgba(80,97,109,.10);
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  color: ${T.ink};
  background: linear-gradient(145deg,#FFFFFF,#FBFCFA);
  cursor: pointer;
  text-align: left;
  font-weight: 650;
  box-shadow: 0 10px 24px -17px rgba(${T.shadowBase},.44);
  transition: transform .18s ease, box-shadow .18s ease, opacity .3s ease, background .3s ease;
  animation: option-in .45s cubic-bezier(.16,1,.3,1) both;
}
.option:nth-child(2) { animation-delay: .07s; }.option:nth-child(3) { animation-delay: .14s; }.option:nth-child(4) { animation-delay: .21s; }
@keyframes option-in { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: none; } }
.option:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 28px -16px rgba(${T.shadowBase},.5), 0 0 0 3px rgba(22,143,163,.07); }
.option:disabled { cursor: default; }.option-wrong { opacity: .25; filter: grayscale(.65); }
.option-correct-reveal { color: ${T.success}; background: ${T.successSoft}; box-shadow: 0 0 0 2px rgba(34,122,83,.18), 0 12px 26px -17px rgba(34,122,83,.45); }
.option-letter { width: 27px; height: 27px; flex: 0 0 27px; display: grid; place-items: center; border-radius: 8px; color: ${T.cyan}; background: ${T.cyanSoft}; font: 800 11px 'JetBrains Mono', monospace; }
.feedback { height: 88px; margin-top: 8px; opacity: 0; visibility: hidden; overflow: visible; transform: translateY(8px); transition: opacity .3s ease, transform .3s ease; }
.feedback-visible { opacity: 1; visibility: visible; transform: translateY(0); }
.feedback-card { min-height: 88px; padding: 8px 15px 8px 9px; border: 1px solid transparent; border-radius: 18px; display: flex; gap: 13px; align-items: center; line-height: 1.42; font-size: 14px; box-shadow: 0 14px 28px -22px rgba(${T.shadowBase},.48); }
.feedback-correct { border-color: rgba(34,122,83,.18); color: ${T.success}; background: linear-gradient(135deg,#FFFFFF,${T.successSoft}); }
.feedback-hint { border-color: rgba(169,111,19,.20); color: ${T.warn}; background: linear-gradient(135deg,#FFFFFF,${T.warnSoft}); }
.g4-bit-reaction-figure { width: 62px; height: 76px; flex: 0 0 62px; }.g4-bit-reaction-figure .g1-char { width: 100%; height: 100%; }
.g4-bit-reaction-copy { flex: 1; min-width: 0; display: grid; gap: 3px; font-family: 'Source Serif 4',Georgia,serif; font-size: clamp(15px,2vw,18px); font-weight: 700; }
.g4-bit-reaction-copy p { color: ${T.ink2}; font: 700 11px/1.4 'Manrope',sans-serif; }
.g4-bit-reaction-ok { animation: reaction-hop .72s ease both; }.g4-bit-reaction-hint { animation: reaction-awkward .9s cubic-bezier(.22,.8,.3,1) both; }
@keyframes reaction-hop { 35% { transform: translateY(-9px) scale(1.08); } 65% { transform: none; } }
@keyframes reaction-awkward { 25% { transform: translateX(-3px) rotate(-3deg); } 50% { transform: translateX(2px) translateY(3px) rotate(2deg); } 100% { transform: translateY(4px) rotate(-1deg); } }

/* Worked examples and discovery. */
.worked-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11px; }
.worked-card { position: relative; min-height: 110px; padding: 15px 15px 13px 50px; border-radius: 17px; display: grid; align-content: center; gap: 5px; background: #FFFFFF; box-shadow: 0 14px 30px -23px rgba(${T.shadowBase},.5); overflow: hidden; }
.worked-card > span { position: absolute; left: 14px; top: 15px; width: 25px; height: 25px; display: grid; place-items: center; border-radius: 8px; color: #FFFFFF; background: ${T.cyan}; font: 850 8px 'JetBrains Mono',monospace; }
.worked-card strong { color: ${T.navy}; font: 850 clamp(15px,2.5vw,21px) 'JetBrains Mono',monospace; white-space: nowrap; }
.worked-card p { color: ${T.ink2}; font-size: 10px; font-weight: 750; line-height: 1.35; }
.worked-card::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: ${T.cyan}; }
.worked-accent::after,.worked-accent > span { background: ${T.accent}; }.worked-lime::after,.worked-lime > span { background: ${T.success}; }.worked-navy::after,.worked-navy > span { background: ${T.navy}; }
.discovery-lab { padding: 18px; display: grid; gap: 13px; }
.digit-lanes { display: grid; grid-template-columns: repeat(6,1fr); gap: 6px; }
.lane-pair { min-height: 96px; padding: 7px 3px; border-radius: 12px; display: grid; place-items: center; color: ${T.navy}; background: #F5F8F6; }
.lane-pair span { font: 850 20px 'JetBrains Mono',monospace; }.lane-pair i { color: ${T.cyan}; font: 850 9px 'JetBrains Mono',monospace; font-style: normal; }
.lane-decision { color: #FFFFFF; background: ${T.accent}; box-shadow: 0 10px 22px -14px rgba(255,91,53,.7); }.lane-decision i { color: #FFFFFF; }
.lane-faded { opacity: .28 !important; filter: grayscale(.6) blur(0) !important; }
.proof-strip { padding: 10px 12px; border-radius: 12px; color: ${T.warn}; background: ${T.warnSoft}; font-size: 11px; font-weight: 750; text-align: center; }
.discovery-rule { min-height: 82px; padding: 7px 15px 7px 8px; border-radius: 16px; display: flex; align-items: center; gap: 10px; color: ${T.success}; background: ${T.successSoft}; font-family: 'Source Serif 4',serif; font-size: clamp(15px,2.2vw,19px); }
.discovery-rule > svg { width: 58px; height: 72px; flex: 0 0 58px; }

/* Rule, worked checkpoint and strategy. */
.rule-path { position: relative; width: min(790px,100%); margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 11px; }
.rule-path-line { position: absolute; left: 13%; right: 13%; top: 31px; height: 3px; z-index: -1; background: linear-gradient(90deg,${T.cyan},${T.accent},${T.success}); }
.rule-card { min-height: 152px; padding: 15px; border-radius: 18px; display: grid; align-content: start; gap: 11px; background: #FFFFFF; box-shadow: 0 15px 32px -24px rgba(${T.shadowBase},.5); }
.rule-card > span { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 11px; color: #FFFFFF; background: ${T.cyan}; font: 850 9px 'JetBrains Mono',monospace; }
.rule-card:nth-child(2) > span { background: ${T.accent}; }.rule-card:nth-child(3) > span { background: ${T.success}; }
.rule-card h2 { font: 700 16px/1.2 'Source Serif 4',serif; }.rule-card p { margin-top: 5px; color: ${T.ink2}; font-size: 10px; font-weight: 650; line-height: 1.4; }
.checkpoint-board { padding: 10px 15px; }
.checkpoint-row { min-height: 56px; display: grid; grid-template-columns: 28px minmax(175px,.8fr) auto 1fr; align-items: center; gap: 10px; border-bottom: 1px solid rgba(80,97,109,.10); }
.checkpoint-row:last-child { border-bottom: 0; }.checkpoint-row > span { color: ${T.cyan}; font: 850 10px 'JetBrains Mono',monospace; }.checkpoint-row strong { color: ${T.navy}; font: 850 clamp(13px,2vw,18px) 'JetBrains Mono',monospace; white-space: nowrap; }.checkpoint-row i { color: ${T.accent}; font-style: normal; }.checkpoint-row p { color: ${T.ink2}; font-size: 12px; font-weight: 700; line-height: 1.35; }
.not-test-label { align-self: center; display: flex; align-items: center; gap: 7px; color: ${T.cyan}; font-size: 10px; font-weight: 800; }.not-test-label > span { animation: data-node-pulse 2.4s ease-in-out 2; }
@keyframes data-node-pulse { 50% { transform: scale(.72); opacity: .6; } }
.strategy-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 11px; }
.strategy-card { min-height: 164px; padding: 15px; border-radius: 18px; display: grid; align-content: start; gap: 7px; background: #FFFFFF; box-shadow: 0 15px 32px -24px rgba(${T.shadowBase},.5); }
.strategy-icon { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 12px; color: ${T.cyan}; background: ${T.cyanSoft}; font: 900 18px 'JetBrains Mono',monospace; }.strategy-card:nth-child(2) .strategy-icon { color: ${T.accent}; background: ${T.accentSoft}; }.strategy-card:nth-child(3) .strategy-icon { color: ${T.success}; background: ${T.successSoft}; }
.strategy-card h2 { font: 700 16px/1.18 'Source Serif 4',serif; }.strategy-card p { color: ${T.ink2}; font-size: 12px; line-height: 1.42; }.strategy-card code { margin-top: auto; color: ${T.navy}; font: 800 12px 'JetBrains Mono',monospace; }
.strategy-note { min-height: 75px; padding: 4px 14px 4px 7px; border-radius: 16px; display: flex; align-items: center; gap: 10px; color: ${T.success}; background: ${T.successSoft}; font-size: 11px; font-weight: 750; }.strategy-note > svg { width: 56px; height: 68px; flex: 0 0 56px; }

/* Error repair. */
.error-workbench { position: relative; padding: 13px 115px 13px 13px; display: grid; gap: 9px; overflow: hidden; }
.error-lab-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 7px; }
.error-case { min-height: 128px; padding: 9px; border: 1px solid rgba(169,111,19,.14); border-radius: 13px; display: grid; align-content: start; gap: 7px; background: linear-gradient(145deg,#FFFFFF,${T.warnSoft}); }
.error-case > span { width: max-content; max-width: 100%; padding: 4px 6px; border-radius: 7px; color: #FFFFFF; background: ${T.warn}; font-size: 10px; font-weight: 850; white-space: nowrap; }
.error-formula { display: grid; gap: 2px; font: 800 11px 'JetBrains Mono',monospace; }.error-formula s { color: ${T.warn}; text-decoration-color: ${T.accent}; }.error-formula i { color: ${T.accent}; font-style: normal; }.error-formula strong { color: ${T.success}; }.error-case p { color: ${T.ink2}; font-size: 11px; font-weight: 700; line-height: 1.38; }
.wrong-equation { min-height: 54px; padding: 9px 13px; border: 1px solid rgba(169,111,19,.18); border-radius: 14px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; color: ${T.warn}; background: ${T.warnSoft}; }
.wrong-equation > span { padding: 4px 6px; border-radius: 7px; color: #FFFFFF; background: ${T.warn}; font: 850 10px 'JetBrains Mono',monospace; }.wrong-equation strong { color: ${T.navy}; font: 850 clamp(14px,2.4vw,20px) 'JetBrains Mono',monospace; text-align: center; }.wrong-equation i { width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; color: #FFFFFF; background: ${T.accent}; font-style: normal; font-weight: 900; }
.repair-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; }.repair-step { min-height: 61px; padding: 8px; border-radius: 12px; display: flex; align-items: center; gap: 7px; background: #F5F8F6; }.repair-step > span { width: 24px; height: 24px; flex: 0 0 24px; display: grid; place-items: center; border-radius: 8px; color: #FFFFFF; background: ${T.cyan}; font: 850 10px 'JetBrains Mono',monospace; }.repair-step p { color: ${T.ink2}; font-size: 11px; font-weight: 700; line-height: 1.36; }
.correct-equation { min-height: 58px; padding: 9px 13px; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: ${T.success}; background: ${T.successSoft}; }.correct-equation strong { font: 850 clamp(15px,2.5vw,21px) 'JetBrains Mono',monospace; }.correct-equation small { max-width: 245px; text-align: right; font-size: 11px; font-weight: 750; line-height: 1.36; }
.workbench-bit { position: absolute; right: 17px; bottom: 9px; width: 102px; height: 128px; transition: transform .6s ease; }

/* Post-transfer proof: two adjacent comparisons justify the full chain. */
.chain-proof-board { padding: 15px; display: grid; gap: 12px; border-radius: 21px; background: linear-gradient(145deg,#FFFFFF,${T.cyanSoft}); box-shadow: 0 17px 38px -28px rgba(${T.shadowBase},.5); }
.chain-proof-comparisons { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11px; }
.chain-proof-card { min-height: 174px; padding: 14px; display: grid; grid-template-columns: 34px minmax(0,1fr); align-content: start; gap: 7px 10px; border-radius: 17px; background: #FFFFFF; box-shadow: inset 0 0 0 1px rgba(22,143,163,.13), 0 12px 27px -22px rgba(${T.shadowBase},.4); }
.chain-proof-card > span { grid-row: 1 / 4; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 11px; color: #FFFFFF; background: ${T.cyan}; font: 900 10px 'JetBrains Mono',monospace; }
.chain-proof-card:nth-child(2) > span { background: ${T.accent}; }
.chain-proof-card small { color: ${T.ink3}; font: 800 11px 'JetBrains Mono',monospace; }
.chain-proof-card strong { color: ${T.navy}; font: 850 clamp(17px,2.7vw,24px) 'JetBrains Mono',monospace; }
.chain-proof-card p { grid-column: 2; color: ${T.ink2}; font-size: 12px; line-height: 1.42; }
.chain-proof-result { min-height: 104px; padding: 7px 15px 7px 7px; display: grid; grid-template-columns: 72px minmax(0,1fr); align-items: center; gap: 11px; border-radius: 17px; color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.chain-proof-result > svg { width: 67px; height: 84px; }
.chain-proof-result > div { display: grid; gap: 5px; }.chain-proof-result span { font-size: 11px; font-weight: 900; letter-spacing: .13em; }.chain-proof-result strong { color: ${T.navy}; font: 850 clamp(17px,3vw,24px) 'JetBrains Mono',monospace; }.chain-proof-result p { color: ${T.ink2}; font-size: 12px; line-height: 1.4; }

/* Summary. */
.summary-hero { min-height: 156px; padding: 14px 120px 14px 105px; position: relative; border-radius: 22px; display: flex; align-items: center; background: linear-gradient(135deg,#FFFFFF,${T.cyanSoft}); box-shadow: 0 18px 40px -29px rgba(${T.shadowBase},.5); }
.summary-bit { position: absolute; left: 15px; bottom: 3px; width: 82px; height: 104px; }.summary-score { position: absolute; right: 17px; top: 50%; transform: translateY(-50%); width: 88px; padding: 9px; border-radius: 15px; display: grid; place-items: center; gap: 2px; color: ${T.success}; background: ${T.successSoft}; }.summary-score strong { font: 900 23px 'JetBrains Mono',monospace; }.summary-score span { font-size: 10px; font-weight: 800; text-align: center; }
.takeaway-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }.takeaway-card { min-height: 82px; padding: 11px; border-radius: 15px; display: flex; align-items: center; gap: 9px; background: #FFFFFF; box-shadow: 0 12px 26px -21px rgba(${T.shadowBase},.44); }.takeaway-card > span { width: 28px; height: 28px; flex: 0 0 28px; display: grid; place-items: center; border-radius: 9px; color: #FFFFFF; background: ${T.cyan}; font: 850 10px 'JetBrains Mono',monospace; }.takeaway-card:nth-child(2) > span { background: ${T.accent}; }.takeaway-card:nth-child(3) > span { background: ${T.success}; }.takeaway-card p { color: ${T.ink2}; font-size: 11px; font-weight: 700; line-height: 1.4; }
.bridge-card { padding: 11px 14px; border-left: 4px solid ${T.accent}; border-radius: 0 14px 14px 0; display: flex; align-items: center; gap: 10px; color: ${T.ink2}; background: ${T.accentSoft}; }.bridge-card > span { color: ${T.accent}; font: 900 13px 'JetBrains Mono',monospace; }.bridge-card p { font-size: 11px; font-weight: 750; }
.finale-screen { gap: 10px; }
.finale-heading { min-width: 0; padding: 12px 15px; border-radius: 17px; background: linear-gradient(135deg,${T.paper},${T.cyanSoft}); box-shadow: 0 12px 28px -22px rgba(${T.shadowBase},.38); }
.finale-heading > span { display: block; margin-bottom: 4px; color: ${T.accent}; font: 900 9px/1 'JetBrains Mono',monospace; letter-spacing: .15em; }.finale-heading h1 { color: ${T.navy}; font: 650 clamp(20px,3vw,28px)/1.08 'Source Serif 4',serif; overflow-wrap: anywhere; }.finale-heading p { max-width: 760px; margin-top: 5px; color: ${T.ink2}; font-size: 12px; line-height: 1.42; overflow-wrap: anywhere; }
.finale-layout { min-width: 0; display: grid; grid-template-columns: minmax(0,1fr) minmax(248px,.42fr); gap: 10px; align-items: stretch; }.finale-main { min-width: 0; display: flex; flex-direction: column; gap: 9px; }
.finale-actions { min-width: 0; display: flex; flex-direction: column; gap: 8px; }.finale-reflection { padding: 10px; border-radius: 15px; background: ${T.paper}; box-shadow: 0 10px 24px -19px rgba(${T.shadowBase},.36); }.finale-reflection > strong { display: block; color: ${T.navy}; font: 700 13px/1.25 'Source Serif 4',serif; }.finale-reflection > div { margin-top: 7px; display: grid; gap: 5px; }.finale-reflection button { min-height: 36px; padding: 6px 7px; border: 0; border-radius: 10px; display: grid; grid-template-columns: 22px minmax(0,1fr); align-items: center; gap: 6px; color: ${T.ink2}; background: ${T.cyanSoft}; text-align: left; font-size: 9px; line-height: 1.25; cursor: pointer; }.finale-reflection button span { width: 22px; height: 22px; border-radius: 7px; display: grid; place-items: center; color: ${T.paper}; background: ${T.cyan}; font: 900 9px/1 'JetBrains Mono',monospace; }.finale-reflection button.is-selected { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 3px 0 0 ${T.success}; }.finale-actions .g4-title-claim { min-height: 70px; padding: 9px 12px; }
.finale-mastery { min-width: 0; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; }
.finale-takeaway { min-width: 0; min-height: 88px; padding: 10px; display: grid; grid-template-columns: 28px minmax(0,1fr); align-items: start; gap: 7px; border-radius: 14px; background: ${T.paper}; box-shadow: 0 10px 24px -19px rgba(${T.shadowBase},.36); opacity: 0; transform: translateY(8px); transition: opacity .34s ease,transform .34s ease; }.finale-takeaway.is-visible { opacity: 1; transform: none; }.finale-takeaway > span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px; color: ${T.paper}; background: ${T.cyan}; font: 900 10px/1 'JetBrains Mono',monospace; }.finale-takeaway:nth-child(2) > span { background: ${T.accent}; }.finale-takeaway:nth-child(3) > span { background: ${T.success}; }.finale-takeaway p { color: ${T.ink}; font-size: 11px; line-height: 1.38; font-weight: 720; overflow-wrap: anywhere; }
.finale-proof,.finale-bridge { min-width: 0; opacity: 0; transform: translateY(7px); transition: opacity .34s ease,transform .34s ease; }.finale-proof.is-visible,.finale-bridge.is-visible { opacity: 1; transform: none; }.finale-proof { padding: 9px 12px; display: grid; grid-template-columns: auto minmax(0,.7fr) minmax(0,1.3fr); align-items: center; gap: 9px; border-radius: 13px; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }.finale-proof > span,.finale-bridge strong { color: ${T.success}; font: 900 9px/1.2 'JetBrains Mono',monospace; letter-spacing: .1em; }.finale-proof > strong { min-width: 0; color: ${T.navy}; font: 800 12px/1.25 'JetBrains Mono',monospace; overflow-wrap: anywhere; }.finale-proof p,.finale-bridge p { color: ${T.ink2}; font-size: 11px; line-height: 1.35; overflow-wrap: anywhere; }
.finale-bridge { padding: 9px 11px; display: grid; grid-template-columns: 30px minmax(0,1fr); align-items: center; gap: 9px; border-radius: 13px; background: ${T.accentSoft}; }.finale-bridge > span { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 10px; color: ${T.paper}; background: ${T.accent}; font-weight: 900; }.finale-bridge strong { color: ${T.accent}; }.finale-bridge p { margin-top: 3px; }
.finale-reward { position: relative; min-width: 0; min-height: 206px; padding: 15px 76px 14px 62px; display: flex; align-items: center; overflow: hidden; border-radius: 18px; color: ${T.paper}; background: linear-gradient(145deg,${T.navy},#0f2c40); box-shadow: 0 16px 32px -22px rgba(${T.shadowBase},.58); }.finale-reward-copy { position: relative; z-index: 2; min-width: 0; }.finale-reward-copy > span { color: ${T.lime}; font: 900 9px/1.2 'JetBrains Mono',monospace; letter-spacing: .12em; }.finale-reward-copy h2 { margin-top: 5px; font: 650 19px/1.05 'Source Serif 4',serif; overflow-wrap: anywhere; }.finale-status { margin-top: 10px; }.finale-status strong { display: block; color: ${T.lime}; font: 850 25px/1 'JetBrains Mono',monospace; }.finale-status p { margin-top: 3px; font-size: 11px; line-height: 1.25; font-weight: 800; }.finale-status small { display: block; margin-top: 3px; color: rgba(255,255,255,.68); font-size: 9px; line-height: 1.3; }.finale-status-neutral strong { font-size: 22px; }
.finale-medal { position: absolute; z-index: 2; left: 11px; top: 50%; width: 39px; height: 39px; display: grid; place-items: center; border-radius: 50%; color: ${T.navy}; background: ${T.lime}; box-shadow: 0 0 0 5px rgba(149,201,61,.14); transform: translateY(-50%) scale(.78); transition: transform .38s ease; }.finale-reward.is-complete .finale-medal { transform: translateY(-50%) scale(1); }.finale-reward-bit { position: absolute; z-index: 1; right: 1px; bottom: -5px; width: 76px; height: 96px; }.finale-reward-bit .g1-char { width: 100%; height: 100%; }.finale-reward.is-complete .finale-reward-bit { animation: finale-bit-float 3.2s ease-in-out 2; }
.finale-confetti i { position: absolute; z-index: 0; top: 12px; left: 20%; width: 5px; height: 9px; border-radius: 3px; background: ${T.lime}; opacity: 0; }.finale-confetti i:nth-child(2) { left: 34%; background: ${T.accent}; transform: rotate(24deg); }.finale-confetti i:nth-child(3) { left: 49%; background: ${T.cyan}; transform: rotate(-20deg); }.finale-confetti i:nth-child(4) { left: 63%; top: 22px; background: ${T.paper}; }.finale-confetti i:nth-child(5) { left: 78%; background: ${T.accent}; transform: rotate(38deg); }.finale-confetti i:nth-child(6) { left: 27%; top: 34px; background: ${T.cyan}; }.finale-confetti i:nth-child(7) { left: 57%; top: 42px; background: ${T.lime}; transform: rotate(-34deg); }.finale-confetti i:nth-child(8) { left: 86%; top: 34px; background: ${T.paper}; }.finale-reward.is-complete .finale-confetti i { animation: finale-confetti-fall 1.45s ease-out both; }.finale-reward.is-complete .finale-confetti i:nth-child(even) { animation-delay: .1s; }
@keyframes finale-bit-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes finale-confetti-fall { 0% { opacity: 0; translate: 0 -8px; } 20% { opacity: .9; } 100% { opacity: 0; translate: 5px 78px; rotate: 160deg; } }

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
.lesson-root button:focus-visible { outline: 3px solid rgba(22,143,163,.42); outline-offset: 3px; }

@media (max-width: 760px) {
  .stage-content { padding-top: 8px; }
  .h-title { font-size: 29px; }
  .lead { font-size: 14px; }
  .city-sort-scene { padding-right: 160px; }
  .worked-card strong { font-size: 16px; }
  .finale-layout { grid-template-columns: 1fr; }
  .finale-reward { min-height: 132px; }
}
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
  .stage-header { padding-top: 8px; padding-bottom: 6px; }
  .stage-nav { min-height: 66px; padding-top: 8px; padding-bottom: 8px; }
  .stage-content { padding-bottom: 8px; }
  .screen-stack { gap: 10px; }
  .heading-block { gap: 5px; }
  .h-title { font-size: 24px; line-height: 1.05; }
  .lead { font-size: 12px; line-height: 1.38; }
  .chrome-title { max-width: 170px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 11px; }
  .screen-type { display: none; }
  .btn { min-height: 48px; padding: 9px 14px; }
  .replay-reveal { min-height: 48px; }
  .city-sort-scene { min-height: 224px; padding: 15px 112px 15px 14px; border-radius: 20px; }
  .route-order { grid-template-columns: 1fr; gap: 7px; }.route-arrow { display: none; }.route-card { padding: 9px; }.route-card strong { font-size: 18px; }.sort-alert { font-size: 11px; }
  .hook-bit { right: 8px; width: 104px; }.hook-bit > svg { width: 82px; height: 105px; }
  .hook-stack .lead { font-size: 10px; }.hook-decision { padding: 8px; }.hook-decision > strong { font-size: 13px; }.hook-answer-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }.hook-answer-grid .option { min-height: 62px; padding: 7px 8px; display: grid; grid-template-columns: 25px minmax(0,1fr); gap: 6px; font-size: 13px; }.hook-answer-grid .option-letter { width: 25px; height: 25px; }
  .recap-board { padding: 13px; gap: 7px; }.recap-number { min-height: 90px; padding: 9px; }.recap-number span { font-size: 19px; }.recap-number b { font-size: 11px; }
  .digit-count-model,.place-table-frame,.number-line-card,.scan-console,.equality-machine,.discovery-lab,.checkpoint-board,.error-workbench { border-radius: 17px; }
  .digit-count-model { padding: 12px; gap: 9px; }.formula-display { gap: 6px; }.formula-display span { padding: 9px 5px; font-size: 17px; }.formula-display i { font-size: 22px; }.step-rail { grid-template-columns: 1fr; gap: 5px; }.model-step { min-height: 64px; padding: 8px; display: grid; justify-items: center; text-align: center; }.model-step > span { width: 25px; height: 25px; }.model-step p { font-size: 11px; line-height: 1.38; }
  .place-table-frame { padding: 8px; }.place-table-head > span { min-height: 36px; font-size: 10px; line-height: 1.15; overflow-wrap: anywhere; }.place-table-row > span { min-height: 44px; font-size: 18px; }.table-scan-beam { top: 8px; bottom: 8px; left: 8px; width: calc((100% - 16px) / 6); }
  .deep-contrast { grid-template-columns: 1fr; gap: 6px; }.deep-contrast-trail { justify-content: center; }.deep-contrast-result { text-align: center; }
  .number-line-card { padding: 14px 11px 10px; }.line-point b { font-size: 10px; }.number-line-track { margin: 0 6px; }
  .scan-console { padding: 11px; gap: 9px; }.scan-numbers { gap: 7px; }.scan-numbers strong { padding: 9px 4px; font-size: 20px; }.comparison-scan { gap: 5px; }.scan-chip { min-height: 68px; padding: 6px 3px; }.scan-chip b { font-size: 13px; }.decision-banner { display: grid; text-align: center; }.decision-banner small { text-align: center; }
  .equality-machine { padding: 12px; gap: 8px; }.digit-pairs { gap: 3px; }.digit-pair { min-height: 74px; padding: 4px 2px; }.digit-pair span { font-size: 17px; }
  .options-grid { grid-template-columns: 1fr; gap: 7px; }.option { min-height: 50px; padding: 8px 10px; font-size: 11px; }.feedback-card { min-height: 76px; font-size: 12px; }.g4-bit-reaction-figure { width: 50px; height: 62px; flex-basis: 50px; }
  .worked-grid { gap: 6px; }.worked-card { min-height: 104px; padding: 10px 7px 9px 36px; }.worked-card > span { left: 8px; top: 10px; width: 22px; height: 22px; }.worked-card strong { font-size: 13px; }.worked-card p { font-size: 11px; line-height: 1.38; }
  .discovery-lab { padding: 10px; gap: 8px; }.digit-lanes { gap: 3px; }.lane-pair { min-height: 72px; padding: 4px 1px; }.lane-pair span { font-size: 16px; }.discovery-rule { min-height: 66px; font-size: 13px; }.discovery-rule > svg { width: 47px; height: 58px; flex-basis: 47px; }
  .rule-path { grid-template-columns: 1fr; gap: 7px; }.rule-path-line { display: none; }.rule-card { min-height: 0; padding: 11px; gap: 7px; }.rule-card > span { width: 29px; height: 29px; }.rule-card h2 { font-size: 14px; }.rule-card p { font-size: 11px; line-height: 1.38; }
  .checkpoint-board { padding: 8px 10px; }.checkpoint-row { min-height: 72px; grid-template-columns: 22px minmax(0,1fr) auto; gap: 5px 7px; padding: 7px 0; }.checkpoint-row strong { font-size: 13px; }.checkpoint-row p { grid-column: 2 / -1; font-size: 11px; line-height: 1.38; }
  .strategy-grid { grid-template-columns: 1fr; gap: 7px; }.strategy-card { min-height: 0; padding: 12px; gap: 6px; }.strategy-icon { width: 34px; height: 34px; }.strategy-card h2 { font-size: 15px; }.strategy-card p { font-size: 11px; }.strategy-card code { font-size: 11px; }
  .error-workbench { padding: 8px; }.error-lab-grid { grid-template-columns: 1fr; gap: 6px; }.error-case { min-height: 0; padding: 10px; gap: 6px; }.error-case > span { font-size: 10px; }.error-formula { grid-template-columns: 1fr auto 1fr; align-items: center; gap: 5px; font-size: 11px; }.error-formula strong { text-align: right; }.error-case p { font-size: 11px; line-height: 1.38; }.correct-equation { display: grid; gap: 4px; }.correct-equation strong { font-size: 14px; }.correct-equation small { text-align: left; font-size: 11px; }.workbench-bit { position: static; width: 62px; height: 78px; justify-self: center; }
  .chain-proof-board { padding: 10px; }.chain-proof-comparisons { grid-template-columns: 1fr; gap: 7px; }.chain-proof-card { min-height: 0; padding: 11px; }.chain-proof-card small { font-size: 11px; }.chain-proof-card strong { font-size: 16px; }.chain-proof-card p { font-size: 11px; }.chain-proof-result { grid-template-columns: 58px minmax(0,1fr); padding: 7px 10px 7px 4px; }.chain-proof-result > svg { width: 55px; height: 69px; }.chain-proof-result strong { font-size: 14px; }.chain-proof-result p { font-size: 11px; }
  .summary-hero { min-height: 150px; padding: 11px 76px 11px 73px; }.summary-bit { left: 6px; width: 62px; height: 80px; }.summary-score { right: 7px; width: 66px; }.summary-score strong { font-size: 18px; }.summary-score span { font-size: 9px; }.takeaway-grid { grid-template-columns: 1fr; gap: 6px; }.takeaway-card { min-height: 58px; padding: 9px; display: flex; justify-items: initial; text-align: left; }.takeaway-card p { font-size: 11px; }.bridge-card { padding: 9px 11px; }.bridge-card p { font-size: 11px; }
  .bit-coach-figure { width: 52px; height: 65px; flex-basis: 52px; }.bit-speech { padding: 7px 10px; font-size: 11px; }
  .lesson-preview .stage-header { padding-top: 60px; }
  .finale-screen { gap: 6px; }
  .finale-heading { padding: 8px 10px; }.finale-heading h1 { font-size: 19px; }.finale-heading p { display: none; }
  .finale-layout { gap: 6px; }
  .finale-main { gap: 5px; }
  .finale-mastery { grid-template-columns: repeat(3,minmax(0,1fr)); gap: 4px; }
  .finale-takeaway { min-height: 0; padding: 5px; grid-template-columns: 20px minmax(0,1fr); gap: 4px; }
  .finale-takeaway > span { width: 20px; height: 20px; border-radius: 6px; font-size: 8px; }
  .finale-takeaway p { font-size: 8px; line-height: 1.25; }
  .finale-proof { padding: 6px 8px; grid-template-columns: 1fr; gap: 2px; }
  .finale-proof > span { font-size: 8px; }.finale-proof > strong { font-size: 10px; }.finale-proof p { font-size: 9px; line-height: 1.25; }
  .finale-bridge { padding: 6px 8px; grid-template-columns: 24px minmax(0,1fr); gap: 6px; }.finale-bridge > span { width: 24px; height: 24px; }.finale-bridge p { font-size: 9px; line-height: 1.25; }
  .finale-actions { gap: 5px; }
  .finale-reflection { padding: 7px; }.finale-reflection > strong { font-size: 11px; }.finale-reflection > div { margin-top: 5px; gap: 3px; }
  .finale-reflection button { min-height: 44px; padding: 4px 5px; grid-template-columns: 18px minmax(0,1fr); gap: 4px; font-size: 8px; }.finale-reflection button span { width: 18px; height: 18px; border-radius: 5px; font-size: 8px; }
  .finale-actions .g4-title-claim { min-height: 48px; padding: 6px 9px; }
  .finale-reward { min-height: 116px; padding: 11px 65px 11px 51px; }.finale-reward-copy h2 { font-size: 17px; }.finale-medal { left: 8px; width: 34px; height: 34px; }.finale-reward-bit { width: 62px; height: 78px; }
}
@media (max-width: 639.98px) and (max-height: 700px) {
  .stage-header { padding-top: 6px; padding-bottom: 5px; }
  .progress-track { height: 4px; margin-bottom: 5px; }
  .stage-content { padding-top: 0; padding-bottom: 0; }
  .stage-content > .screen-stack { zoom: .9; }
  .stage-nav { min-height: 54px; padding-top: 4px; padding-bottom: 4px; }
  .btn, .option, .replay-reveal, .finale-reflection button { min-height: 44px; }
  .screen-stack { gap: 7px; }
  .h-title { font-size: 21px; }
  .lead { font-size: 11px; line-height: 1.25; }
  .hook-stack { gap: 4px; }
  .city-sort-scene { min-height: 180px; }
  .model-step, .checkpoint-row { min-height: 56px; }
  .worked-card { min-height: 88px; }
  .feedback-card { min-height: 66px; }
  .finale-reward { min-height: 96px; padding-top: 7px; padding-bottom: 7px; }
}
@media (max-height: 680px) and (min-width: 640px) {
  .screen-stack { gap: 9px; }.h-title { font-size: 29px; }.lead { font-size: 13px; }.stage-nav { min-height: 62px; }.city-sort-scene { min-height: 205px; }.rule-card,.strategy-card { min-height: 132px; }
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
    scroll-behavior: auto !important;
  }
  .finale-takeaway,.finale-proof,.finale-bridge { opacity: 1 !important; transform: none !important; }
  .option,.reveal-item { opacity: 1 !important; transform: none !important; animation: none !important; }
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
  :is(.lesson-root,.d8-root) .hook-stack{gap:2px!important}
  :is(.lesson-root,.d8-root) .hook-stack .lead{font-size:9px!important;line-height:1.15!important}
  :is(.lesson-root,.d8-root) .hook-decision>strong{display:none!important}
  :is(.lesson-root,.d8-root) .hook-decision{padding:6px!important}
  :is(.lesson-root,.d8-root) .hook-answer-grid{margin-top:0!important;gap:4px!important}
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"]{
    height:164px!important;min-height:164px!important;max-height:164px!important;
    box-sizing:border-box!important;padding:8px 82px 8px 10px!important
  }
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"] .sort-console{gap:5px!important}
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"] .route-order{
    grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important
  }
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"] .route-card{padding:6px!important;border-radius:11px}
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"] .route-card small{font-size:9px;letter-spacing:.08em}
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"] .route-card strong{margin-top:3px;font-size:14px!important}
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"] .sort-alert{padding:4px 6px;font-size:9px;line-height:1.15}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]),
  :is(.lesson-root,.d8-root) .hook-decision:has(+[data-g4-feedback]){padding:7px 8px!important}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]) .question-topline{margin-bottom:4px}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]) h2{font-size:14px!important;line-height:1.14}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]) .options-grid,
  :is(.lesson-root,.d8-root) .hook-answer-panel:has([data-g4-feedback]) .options-grid{margin-top:4px;gap:4px}
}
@media(max-width:639.98px) and (max-height:700px){
  .recap-stack .recap-steps{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}
  .recap-stack .model-step{min-height:54px;padding:5px 4px;display:grid;grid-template-columns:22px minmax(0,1fr);justify-items:start;text-align:left;gap:4px}
  .recap-stack .model-step>span{width:22px;height:22px;flex-basis:22px}
  .recap-stack .model-step p{font-size:8px;line-height:1.2}
  .recap-stack .recap-result{grid-template-columns:24px minmax(90px,auto) minmax(0,1fr);padding:5px;gap:4px}
  .recap-stack .recap-result>p{font-size:8px;line-height:1.2}
  .recap-stack .bit-coach{min-height:56px}
  .recap-stack .bit-coach-figure{width:44px;height:54px;flex-basis:44px}
  .recap-stack .bit-speech{font-size:9px;line-height:1.2}
  .rule-stack .rule-path{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
  .rule-stack .rule-card{min-height:0;padding:7px;gap:4px}
  .rule-stack .rule-card>span{width:25px;height:25px}
  .rule-stack .rule-card h2{font-size:11px;line-height:1.15}
  .rule-stack .rule-card p{margin-top:3px;font-size:8px;line-height:1.25}
  .rule-stack .bit-coach{min-height:58px}
  .rule-stack .bit-coach-figure{width:46px;height:57px;flex-basis:46px}
  .rule-stack .bit-speech{font-size:9px;line-height:1.2}
  .strategy-stack .strategy-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
  .strategy-stack .strategy-card{min-height:0;padding:7px;gap:4px}
  .strategy-stack .strategy-icon{width:28px;height:28px;font-size:14px}
  .strategy-stack .strategy-card h2{font-size:11px;line-height:1.15}
  .strategy-stack .strategy-card p{font-size:8px;line-height:1.25}
  .strategy-stack .strategy-card code{font-size:8px}
  .strategy-stack .strategy-note{min-height:60px;padding:3px 8px 3px 5px;gap:6px;font-size:9px;line-height:1.2}
  .strategy-stack .strategy-note>svg{width:46px;height:56px;flex-basis:46px}
  .strategy-stack .guided-reveal-control{min-height:42px;padding:6px 12px}
  .finale-screen .finale-reflection{padding:6px}
  .finale-screen .finale-reflection>strong{font-size:10px}
  .finale-screen .finale-reflection>div{margin-top:4px;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}
  .finale-screen .finale-reflection button{min-height:52px;padding:4px;grid-template-columns:18px minmax(0,1fr);gap:3px;font-size:8px;line-height:1.15}
  .finale-screen .finale-actions .g4-title-claim{min-height:52px}
}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-bit"],
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-bit"]>svg{
  transform:none!important;animation:none!important
}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-bit"]{position:relative!important;overflow:hidden!important}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-bit"]>svg{
  position:absolute!important;inset:0!important;display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important
}
`;
