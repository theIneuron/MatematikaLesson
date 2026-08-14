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
  font-size: 58px;
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
  const [visible, setVisible] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    if (!active || shownRef.current || typeof window === 'undefined') return undefined;
    let timer;
    const frame = window.requestAnimationFrame(() => {
      shownRef.current = true;
      setVisible(true);
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      timer = window.setTimeout(() => setVisible(false), reduced ? 120 : 3900);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [active]);

  if (!visible || typeof document === 'undefined') return null;
  return createPortal(
    <div
      className="rank-boost-overlay g4-title-reveal-overlay"
      data-g4-role="rank-overlay"
      role="status"
      aria-live="assertive"
      aria-atomic="true"
      aria-label={lang === 'en' ? `Title: ${title}` : lang === 'ru' ? `Звание: ${title}` : `Unvon: ${title}`}
    >
      <div className="rank-boost-card g4-title-reveal-card">
        <div className="g4-title-reveal-rays" aria-hidden="true" />
        <div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }} />
          ))}
        </div>
        <div className="rank-boost-medal g4-title-reveal-medal" aria-hidden="true">★</div>
        <h2>{title}</h2>
      </div>
    </div>,
    document.body,
  );
}

function G4TitleCard({ title, lang, firstTry, totalScored }) {
  return (
    <div className="g4-title-card-stage" data-g4-role="title-card" role="status" aria-live="polite" aria-atomic="true">
      <div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
      </div>
      <div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy" /></div>
      <div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div>
      <span className="g4-title-card-kicker">{lang === 'en' ? "TITLE EARNED" : lang === 'ru' ? 'ЗВАНИЕ ПОЛУЧЕНО' : 'UNVON OLINDI'}</span>
      <h2>{title}</h2>
      <div className="g4-title-card-score">
        <strong>{firstTry}/{totalScored}</strong>
        <span>{lang === 'en' ? "on the first attempt" : lang === 'ru' ? 'с первой попытки' : 'birinchi urinishda'}</span>
      </div>
    </div>
  );
}

// ============================================================================
// 4-SINF · Dars02 · Ko'p xonali sonlarni o'qish va yozish
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
    eyebrow: { ru: 'Новая миссия', uz: 'Yangi missiya', en: "New mission" },
    title: { ru: 'Голосовой адрес потерял структуру', uz: "Ovozli manzil tuzilishini yo'qotdi", en: "Voice address loses structure" },
    lead: {
      ru: 'Центр данных услышал адрес, но сохранил его как сплошную цепочку цифр. Нужно восстановить запись без потерь.',
      uz: "Ma'lumotlar markazi manzilni eshitdi, ammo uni uzluksiz raqamlar qatori sifatida saqladi. Yozuvni yo'qotishsiz tiklash kerak.",
      en: "The data centre heard the address, but it saved it as a chain of numbers, so we need to restore the notation without losing any digits.",
    },
    instruction: { ru: 'Первый шаг: восстановить границу классов и сохранить каждое место.', uz: "Birinchi qadam: sinflar chegarasini tiklash va har bir o'rinni saqlash.", en: "The first step is to restore the group boundary and save every place." },
    hookQuestion: { ru: 'Как сохранить нули на своих местах?', uz: "Nollarni o'z o'rnida qanday saqlaymiz?", en: "How do you keep the zeros in their places?" },
    model: {
      kind: 'classes',
      badge: { ru: 'Голосовой код', uz: 'Ovozli kod', en: "Voice code." },
      number: '304 018',
      groups: [
        { value: '304', label: { ru: 'класс тысяч', uz: 'minglar sinfi', en: "group" }, tone: 'cyan' },
        { value: '018', label: { ru: 'класс единиц', uz: 'birlar sinfi', en: "unit" }, tone: 'accent' },
      ],
    },
    options: [
      { ru: 'Разделить на классы и сохранить каждое место', uz: "Sinflarga ajratib, har bir o'rinni saqlash", en: "Divide into groups and save each place" },
      { ru: 'Убрать нули, потому что они не звучат отдельно', uz: "Nollar alohida aytilmagani uchun ularni olib tashlash", en: "Remove the zeros because they don't sound separate." },
    ],
    closedSet: true,
    correctIndex: 0,
    correctText: {
      ru: 'Классы сохраняют порядок всех шести разрядов. Так внутренние нули остаются на своих местах.',
      uz: "Sinflar oltita xonaning tartibini saqlaydi. Shunda ichki nollar o'z o'rnida qoladi.",
      en: "groups keep the order of all six places, so the inner zeros stay in place.",
    },
    wrong: [
      null,
      { ru: 'Ноль удерживает пустой разряд. Если его убрать, значение соседних цифр изменится.', uz: "Nol bo'sh xonani saqlaydi. Uni olib tashlasak, qo'shni raqamlarning qiymati o'zgaradi.", en: "Zero holds the empty place. If you remove it, the value of the neighbouring digits will change." },
    ],
    audio: {
      intro: {
        ru: [
          'Центр данных получил новый голосовой адрес. Система услышала триста четыре тысячи восемнадцать, но не знает, как надёжно записать число.',
          'Сравни способы записи и выбери тот, который сохранит все шесть разрядов.',
          'Как сохранить нули на своих местах?',
        ],
        uz: [
          "Ma'lumotlar markazi yangi ovozli manzil oldi. Tizim uch yuz to'rt ming o'n sakkiz sonini eshitdi, ammo uni ishonchli yozishni bilmayapti.",
          "Yozish usullarini solishtiring va oltita xonani ham saqlaydigan usulni tanlang.",
          "Nollarni o'z o'rnida qanday saqlaymiz?",
        ],
        en: [
          "The data centre received a spoken address: three hundred and four thousand eighteen. The system does not know how to write the number reliably.",
          'Compare the recording methods and choose the one that preserves all six places.',
          "How do you keep the zeros in their places?",
        ],
      },
      on_correct: {
        ru: 'Деление на классы сохраняет каждое место и помогает записать число без потерь.',
        uz: "Sinflarga ajratish har bir o'rinni saqlaydi va sonni yo'qotishsiz yozishga yordam beradi.",
        en: "Dividing into groups saves each place and helps write down a number without loss.",
      },
      on_wrong: [
        null,
        { ru: 'Ноль показывает пустой разряд. Его нужно сохранить в записи.', uz: "Nol bo'sh xonani ko'rsatadi. Uni yozuvda saqlash kerak.", en: "Zero shows an empty place. It needs to be kept in the notation." },
      ],
    },
  },
  s1: {
    eyebrow: { ru: 'Диагностика', uz: 'Diagnostika', en: "Diagnostics" },
    title: { ru: 'Знакомый порядок разрядов', uz: 'Tanish xonalar tartibi', en: "Familiar order of places" },
    lead: { ru: 'Сначала восстановим опору на трёхзначном числе.', uz: 'Avval uch xonali son yordamida tayanchni tiklaymiz.', en: "First, we'll reassert a three-digit foothold." },
    instruction: { ru: '7 сотен, 3 десятка и 5 единиц занимают три последовательных места.', uz: "7 yuzlik, 3 o'nlik va 5 birlik ketma-ket uchta o'rinni egallaydi.", en: "7 hundred, 3 tens and 5 units occupy three consecutive places." },
    model: {
      kind: 'table',
      badge: { ru: 'Опорная таблица', uz: 'Tayanch jadval', en: "Reference table" },
      columns: [
        { label: { ru: 'сотни', uz: 'yuzlar', en: "hundred" }, value: '7' },
        { label: { ru: 'десятки', uz: "o'nlar", en: "tens" }, value: '3' },
        { label: { ru: 'единицы', uz: 'birlar', en: "unit" }, value: '5' },
      ],
    },
    options: ['735', '753', '375', '7035'],
    correctIndex: 0,
    correctText: { ru: '735: сотни, десятки и единицы заняли свои места.', uz: "735: yuzlar, o'nlar va birlar o'z o'rnini egalladi.", en: "735: Hundreds, tens and units took their places." },
    wrong: [
      null,
      { ru: 'В числе 753 цифра 5 стоит в десятках, а 3 в единицах. Проверь последние два разряда.', uz: "753 sonida 5 o'nlar, 3 esa birlar xonasida. Oxirgi ikki xonani tekshiring.", en: "Of the 753, 5 is in the tens and 3 is in the units." },
      { ru: 'В числе 375 сначала записаны сотни как 3. Начни с семи сотен.', uz: "375 sonida yuzlar xonasiga 3 yozilgan. Yetti yuzlikdan boshlang.", en: "The number 375 is first written hundreds as 3. Start with seven hundred." },
      { ru: 'Получилось четырёхзначное число. Для сотен, десятков и единиц нужны три места.', uz: "To'rt xonali son hosil bo'ldi. Yuzlar, o'nlar va birlar uchun uchta o'rin kerak.", en: "It's a four-digit number. Hundreds, tens and ones need three places." },
    ],
    audio: {
      intro: {
        ru: ['Вспомним знакомые разряды. Семь сотен, три десятка и пять единиц ставим слева направо.'],
        uz: ["Tanish xonalarni eslaymiz. Yetti yuzlik, uch o'nlik va besh birlikni chapdan o'ngga joylaymiz."],
        en: ["Think of the familiar digits. Think of the familiar places from left to right: seven hundreds, three tens and five ones."],
      },
      on_correct: { ru: 'Семь сотен, три десятка и пять единиц образуют семьсот тридцать пять.', uz: "Yetti yuzlik, uch o'nlik va besh birlik yetti yuz o'ttiz besh sonini hosil qiladi.", en: "Seven hundred, three tens and five units make up seven hundred and thirty-five." },
      on_wrong: [
        null,
        { ru: 'Проверь порядок последних двух разрядов. Сначала десятки, затем единицы.', uz: "Oxirgi ikki xona tartibini tekshiring. Avval o'nlar, keyin birlar.", en: "Check the order of the last two digits, first the tens, then the ones." },
        { ru: 'Начни с сотен. В первом месте должна стоять цифра семь.', uz: "Yuzlardan boshlang. Birinchi o'rinda yetti raqami turishi kerak.", en: "Start with hundreds. The first number should be seven." },
        { ru: 'Названы только три разряда. Значит, в записи должно быть три места.', uz: "Faqat uchta xona aytilgan. Demak, yozuvda uchta o'rin bo'lishi kerak.", en: "There's only three digits, so there's got to be three places in the notation." },
      ],
    },
  },
  s2: {
    eyebrow: { ru: 'Показ чтения', uz: "O'qishni ko'rsatish", en: "Reading screening" },
    title: { ru: 'Код звучит по классам', uz: "Kod sinflar bo'yicha aytiladi", en: "Code sounds group by group." },
    lead: { ru: 'Посмотрим, как две группы превращаются в название одного числа.', uz: "Ikki guruh bitta son nomiga qanday aylanishini ko'ramiz.", en: "Let's see how two groups turn into the name of the same number." },
    instruction: { ru: '402 018 читаем двумя целыми группами, а не шестью отдельными цифрами.', uz: "402 018 ni oltita alohida raqam emas, ikkita yaxlit guruh sifatida o'qiymiz.", en: "402,018 is read in two whole groups, not six separate digits." },
    model: {
      kind: 'classes',
      badge: { ru: 'Два класса', uz: 'Ikki sinf', en: "Two groups" },
      number: '402 018',
      groups: [
        { value: '402', label: { ru: 'тысячи', uz: 'minglar', en: "thousand" }, tone: 'cyan' },
        { value: '018', label: { ru: 'единицы', uz: 'birlar', en: "unit" }, tone: 'accent' },
      ],
    },
    options: [
      { ru: 'четыреста две тысячи восемнадцать', uz: "to'rt yuz ikki ming o'n sakkiz", en: "four hundred and two thousand eighteen" },
      { ru: 'четыре ноль две тысячи ноль один восемь', uz: "to'rt nol ikki ming nol bir sakkiz", en: "four zeros two thousand zeros one eight" },
      { ru: 'сорок две тысячи сто восемь', uz: "qirq ikki ming bir yuz sakkiz", en: "forty-two hundred eight" },
      { ru: 'четыреста двадцать тысяч восемнадцать', uz: "to'rt yuz yigirma ming o'n sakkiz", en: "four hundred and twenty thousand eighteen" },
    ],
    correctIndex: 0,
    correctText: { ru: 'Каждый класс читается как обычное трёхзначное число. Нули внутри группы сохраняют места.', uz: "Har bir sinf odatdagi uch xonali son kabi o'qiladi. Guruh ichidagi nollar o'rinlarni saqlaydi.", en: "Each group reads like a regular three-digit number, and the zeros within the group retain their places." },
    wrong: [
      null,
      { ru: 'Это чтение отдельных цифр, а не числа. Прочитай каждую тройку целиком.', uz: "Bu sonni emas, alohida raqamlarni o'qish. Har bir uchlikni yaxlit o'qing.", en: "It's reading individual numbers, not numbers. Read every three as a whole." },
      { ru: 'Здесь нули исчезли и разряды сдвинулись. Сохрани три места в каждой группе.', uz: "Bu yerda nollar yo'qolib, xonalar siljigan. Har bir guruhda uchta o'rinni saqlang.", en: "Here the zeros are gone and the places are shifted. Save three places in each group." },
      { ru: 'В группе 402 нет двух десятков. Прочитай сотни, десятки и единицы этой группы точно.', uz: "402 guruhida ikki o'nlik yo'q. Guruhdagi yuzlar, o'nlar va birlarni aniq o'qing.", en: "In a group of 402, there are no two tens. Read the hundreds, tens and units of that group exactly." },
    ],
    audio: {
      intro: {
        ru: ['Посмотри на две группы числа. Сначала прочитаем класс тысяч, затем класс единиц.'],
        uz: ["Sonning ikki guruhiga qarang. Avval minglar sinfini, keyin birlar sinfini o'qiymiz."],
        en: ["Look at the two groups of digits. First read the thousands group, then the ones group."],
      },
      on_correct: { ru: 'Сначала читаем четыреста две тысячи, затем восемнадцать единиц.', uz: "Avval to'rt yuz ikki mingni, keyin o'n sakkiz birlikni o'qiymiz.", en: "First we read four hundred and two thousand, then eighteen." },
      on_wrong: [
        null,
        { ru: 'Не называй цифры по одной. Прочитай каждую группу как число.', uz: "Raqamlarni bittadan aytmang. Har bir guruhni son sifatida o'qing.", en: "Don't call the numbers one by one. Read each group as a number." },
        { ru: 'Нули удерживают пустые разряды. Верни их на свои места.', uz: "Nollar bo'sh xonalarni saqlaydi. Ularni o'z o'rniga qaytaring.", en: "The zeros hold the empty places." },
        { ru: 'Проверь средний разряд первой группы. Там стоит ноль.', uz: "Birinchi guruhning o'rta xonasini tekshiring. U yerda nol turibdi.", en: "Check the middle place of the first group. It contains zero." },
      ],
    },
  },
  s3: {
    eyebrow: { ru: 'Первая модель', uz: 'Birinchi model', en: "First model" },
    title: { ru: 'Читаем по классам', uz: "Sinflar bo'yicha o'qiymiz", en: "Reading by group." },
    lead: { ru: 'Таблица показывает, какую группу читать первой.', uz: "Jadval qaysi guruhni birinchi o'qishni ko'rsatadi.", en: "The table shows which group to read first." },
    instruction: { ru: 'Левая группа 426 относится к классу тысяч и звучит первой.', uz: "Chapdagi 426 guruhi minglar sinfiga tegishli va birinchi aytiladi.", en: "The left group 426 belongs to the thousands group and sounds the first." },
    model: {
      kind: 'classes',
      badge: { ru: 'Код объекта', uz: 'Obyekt kodi', en: "Object code" },
      number: '426 305',
      groups: [
        { value: '426', label: { ru: 'класс тысяч', uz: 'minglar sinfi', en: "group" }, tone: 'cyan' },
        { value: '305', label: { ru: 'класс единиц', uz: 'birlar sinfi', en: "unit" }, tone: 'accent' },
      ],
    },
    options: [
      { ru: 'четыреста двадцать шесть тысяч', uz: "to'rt yuz yigirma olti ming", en: 'four hundred and twenty-six thousand' },
      { ru: 'триста пять', uz: 'uch yuz besh', en: 'three hundred and five' },
      { ru: 'четыреста двадцать шесть', uz: "to'rt yuz yigirma olti", en: 'four hundred and twenty-six' },
      { ru: 'триста пять тысяч', uz: 'uch yuz besh ming', en: 'three hundred and five thousand' },
    ],
    correctIndex: 0,
    correctText: { ru: 'Чтение идёт слева направо: сначала класс тысяч, затем класс единиц.', uz: "O'qish chapdan o'ngga boradi: avval minglar sinfi, keyin birlar sinfi.", en: "Reading goes from left to right: first the thousands group, then the ones group." },
    wrong: [
      null,
      { ru: '305 находится справа. Этот класс читаем после класса тысяч.', uz: "305 o'ng tomonda. Bu sinfni minglar sinfidan keyin o'qiymiz.", en: "305 is on the right. This group is read after the thousands group." },
      { ru: 'Группа названа без слова «тысяч». Добавь название класса.', uz: "Guruh ming so'zisiz aytilgan. Sinf nomini qo'shing.", en: "The group is named without the word \"thousand.\" Add the group name." },
      { ru: 'Слово «тысяч» относится к левой группе 426, а не к правой 305.', uz: "Ming so'zi chapdagi 426 guruhiga tegishli, o'ngdagi 305 guruhiga emas.", en: "The word “thousand” refers to the left-hand group 426, not the right-hand group 305." },
    ],
    audio: {
      intro: {
        ru: ['Разделим код на две тройки. Чтение начинаем с крайнего левого непустого класса.'],
        uz: ["Kodni ikkita uchlikka ajratamiz. O'qishni eng chapdagi bo'sh bo'lmagan sinfdan boshlaymiz."],
        en: ["Let us split the code into two groups of three digits, and we start with the leftmost non-empty group."],
      },
      on_correct: { ru: 'Сначала звучит четыреста двадцать шесть тысяч. Затем читается правая группа.', uz: "Avval to'rt yuz yigirma olti ming aytiladi. Keyin o'ng guruh o'qiladi.", en: "First it sounds four hundred and twenty-six thousand. Then it reads the right group." },
      on_wrong: [
        null,
        { ru: 'Правая группа читается второй. Начни с левой группы тысяч.', uz: "O'ng guruh ikkinchi o'qiladi. Chapdagi minglar guruhidan boshlang.", en: "The right group reads second. Start with the left group of thousands." },
        { ru: 'После левой группы обязательно назови класс тысяч.', uz: "Chap guruhdan keyin minglar sinfini albatta ayting.", en: "After the left group, be sure to name the thousands group." },
        { ru: 'Название класса тысяч ставится после левой группы.', uz: "Minglar sinfi nomi chap guruhdan keyin aytiladi.", en: "The thousands group is named after the left group." },
      ],
    },
  },
  s4: {
    eyebrow: { ru: 'Вторая модель', uz: 'Ikkinchi model', en: "Second model" },
    title: { ru: 'Ноль держит пустое место', uz: "Nol bo'sh o'rinni saqlaydi", en: "Zero holds an empty space" },
    lead: { ru: 'Разрядная таблица объясняет, почему 040 читается как сорок.', uz: "Xona jadvali nima uchun 040 qirq deb o'qilishini tushuntiradi.", en: "The place-value chart explains why 040 reads like forty." },
    instruction: { ru: 'Ноль в разряде сотен показывает пустое место и удерживает цифру 4 в десятках.', uz: "Yuzlar xonasidagi nol bo'sh o'rinni ko'rsatadi va 4 raqamini o'nlarda saqlaydi.", en: 'A zero in the hundreds place marks the empty place and keeps the digit 4 in the tens place.' },
    model: {
      kind: 'table',
      badge: { ru: 'Разрядная таблица', uz: 'Xona jadvali', en: "Place-value chart." },
      number: '508 040',
      columns: [
        { label: { ru: 'сотни тысяч', uz: 'yuz minglar', en: "hundred thousand" }, value: '5' },
        { label: { ru: 'десятки тысяч', uz: "o'n minglar", en: 'ten-thousands' }, value: '0' },
        { label: { ru: 'тысячи', uz: 'minglar', en: "thousand" }, value: '8' },
        { label: { ru: 'сотни', uz: 'yuzlar', en: "hundred" }, value: '0' },
        { label: { ru: 'десятки', uz: "o'nlar", en: "tens" }, value: '4' },
        { label: { ru: 'единицы', uz: 'birlar', en: "unit" }, value: '0' },
      ],
    },
    fact: { ru: 'Ноль может обозначать пустой разряд. Удаление такого нуля меняет значения соседних цифр.', uz: "Nol bo'sh xonani bildirishi mumkin. Bunday nolni olib tashlash qo'shni raqamlar qiymatini o'zgartiradi.", en: "A zero can mean an empty place, and removing that zero changes the values of the neighbouring digits." },
    options: [
      { ru: 'Сотен единиц нет, но место сотен сохраняется', uz: "Birlar sinfida yuzlik yo'q, ammo yuzlar o'rni saqlanadi", en: "There are no hundreds of units, but the place of hundreds is preserved." },
      { ru: 'Число нужно закончить после тысяч', uz: 'Sonni minglardan keyin tugatish kerak', en: "The number must be completed after thousands." },
      { ru: 'Цифра 4 относится к сотням', uz: '4 raqami yuzlarga tegishli', en: "The digit 4 is in the hundreds place" },
      { ru: 'Ноль можно удалить без изменения числа', uz: "Nolni sonni o'zgartirmasdan olib tashlash mumkin", en: "Zero can be removed without changing the number." },
    ],
    correctIndex: 0,
    correctText: { ru: 'Ноль сохраняет разряд сотен, поэтому 4 остаётся в десятках.', uz: "Nol yuzlar xonasini saqlaydi, shuning uchun 4 o'nlar xonasida qoladi.", en: "Zero retains the hundreds place, so 4 remains in the tens." },
    wrong: [
      null,
      { ru: 'После класса тысяч есть класс единиц. Его три места нельзя отбросить.', uz: "Minglar sinfidan keyin birlar sinfi bor. Uning uchta o'rnini tashlab bo'lmaydi.", en: "After the thousands group, there is a ones group. Its three places cannot be discarded." },
      { ru: 'В таблице 4 стоит под десятками. Ноль слева не даёт ей сдвинуться.', uz: "Jadvalda 4 o'nlar ostida turibdi. Chapdagi nol uning siljishiga yo'l qo'ymaydi.", en: "Table 4 is under tens. Zero on the left keeps it from moving." },
      { ru: 'Без нуля цифра 4 перейдёт в сотни или число станет короче. Значение изменится.', uz: "Nolsiz 4 raqami yuzlarga o'tadi yoki son qisqaradi. Qiymat o'zgaradi.", en: "Without zero, 4 will go into the hundreds or the number will get shorter." },
    ],
    audio: {
      intro: {
        ru: ['В правой группе нет сотен и единиц, но есть четыре десятка. Нули сохраняют пустые места вокруг цифры четыре.'],
        uz: ["O'ng guruhda yuzlik va birlik yo'q, ammo to'rtta o'nlik bor. Nollar to'rt raqami atrofidagi bo'sh o'rinlarni saqlaydi."],
        en: ["In the right-hand group, there are no hundreds and no ones, but there are four tens. The zeros keep the empty places around the digit four."],
      },
      on_correct: { ru: 'Ноль удерживает место сотен, а цифра четыре остаётся в десятках.', uz: "Nol yuzlar o'rnini saqlaydi, to'rt raqami esa o'nlarda qoladi.", en: "Zero holds the place of hundreds, and the digit four stays in the tens place." },
      on_wrong: [
        null,
        { ru: 'Класс единиц всё равно занимает три места. Проверь правую группу.', uz: "Birlar sinfi baribir uchta o'rinni egallaydi. O'ng guruhni tekshiring.", en: "The ones group still takes three places." },
        { ru: 'Посмотри на заголовок столбца над цифрой четыре. Это десятки.', uz: "To'rt raqami ustidagi ustun nomiga qarang. Bu o'nlar.", en: "Look at the column header above the digit four. That's tens." },
        { ru: 'Удаление нуля сдвигает цифры. Значит, число изменится.', uz: "Nolni olib tashlash raqamlarni siljitadi. Demak, son o'zgaradi.", en: "Removing zero shifts the numbers. That means the number will change." },
      ],
    },
  },
  s5: {
    eyebrow: { ru: 'Пошаговая запись', uz: 'Bosqichli yozuv', en: "Writing step by step" },
    title: { ru: 'Запись по голосу', uz: "Ovoz bo'yicha yozuv", en: "Spoken form" },
    lead: { ru: 'Сначала заполняем класс тысяч, затем класс единиц.', uz: "Avval minglar sinfini, keyin birlar sinfini to'ldiramiz.", en: "First we fill in the thousands group, then the ones group." },
    instruction: { ru: '«Двести четырнадцать тысяч семьдесят» раскладываем на группы 214 и 070.', uz: "Ikki yuz o'n to'rt ming yetmish sonini 214 va 070 guruhlariga ajratamiz.", en: "Two hundred and fourteen thousand seventy are grouped into groups 214 and 070." },
    model: {
      kind: 'classes',
      badge: { ru: 'Два контейнера', uz: 'Ikki konteyner', en: "Two containers." },
      groups: [
        { value: '214', label: { ru: 'класс тысяч', uz: 'minglar sinfi', en: "group" }, tone: 'cyan' },
        { value: '___', label: { ru: 'класс единиц', uz: 'birlar sinfi', en: "unit" }, tone: 'accent' },
      ],
    },
    options: ['214 070', '214 700', '214 007', '21 470'],
    correctIndex: 0,
    inputWrongDefault: { ru: 'Раздели запись на класс тысяч и класс единиц. В правой группе для семидесяти нужны цифры 0, 7, 0.', uz: "Yozuvni minglar sinfi va birlar sinfiga ajrating. O'ng guruhda yetmish uchun 0, 7, 0 raqamlari kerak.", en: "Divide the notation into the thousands group and the ones group. In the right group, seventy needs the digits 0, 7, 0." },
    inputWrongAudio: { ru: 'Сначала отдели класс тысяч от класса единиц. В правой группе у семидесяти нет сотен и единиц.', uz: "Avval minglar sinfini birlar sinfidan ajrating. O'ng guruhdagi yetmishda yuzlik va birlik yo'q.", en: "First, separate the thousands group from the ones group. In the right group, seventy don't have hundreds or units." },
    correctText: { ru: '214 070: в классе единиц нет сотен, есть 7 десятков и нет единиц.', uz: "214 070: birlar sinfida yuzlik yo'q, 7 o'nlik bor va birlik yo'q.", en: "214,070: There are no hundreds in a ones group, there are 7 tens and no units." },
    wrong: [
      null,
      { ru: 'Запись 700 означает семь сотен. В голосе названы семьдесят, то есть 070.', uz: "700 yozuvi yetti yuzni bildiradi. Ovozda yetmish aytilgan, ya'ni 070.", en: "700 means seven hundred. Seventy is called in voice, that is, 070." },
      { ru: 'Запись 007 означает семь единиц. Нужны семь десятков.', uz: "007 yozuvi yetti birlikni bildiradi. Yetti o'nlik kerak.", en: "007 means seven units. It takes seven tens." },
      { ru: 'Граница классов сдвинулась. Левая группа должна полностью содержать 214.', uz: "Sinflar chegarasi siljigan. Chap guruh 214 ni to'liq saqlashi kerak.", en: "The group boundary has shifted. The left group should contain 214." },
    ],
    audio: {
      intro: { ru: ['Разберём двести четырнадцать тысяч семьдесят. В правой группе сохраняем сотни, десятки и единицы.'], uz: ["Ikki yuz o'n to'rt ming yetmish sonini tahlil qilamiz. O'ng guruhda yuzlar, o'nlar va birlar o'rnini saqlaymiz."], en: ["Let's take two hundred and fourteen thousand seventy. In the right-hand group, keep the hundreds, tens and ones places."] },
      on_correct: { ru: 'Получается двести четырнадцать тысяч семьдесят. Нули сохраняют сотни и единицы правой группы.', uz: "Ikki yuz o'n to'rt ming yetmish hosil bo'ladi. Nollar o'ng guruhdagi yuzlar va birlar o'rnini saqlaydi.", en: "So you get two hundred and fourteen thousand seventy, and the zeros keep hundreds and units of the right group." },
      on_wrong: [
        null,
        { ru: 'Семьдесят означает ноль сотен, семь десятков и ноль единиц.', uz: "Yetmish nol yuzlik, yetti o'nlik va nol birlikni bildiradi.", en: "Seventy means zero hundreds, seven tens, and zero units." },
        { ru: 'Семь единиц и семь десятков занимают разные места. Нужны десятки.', uz: "Yetti birlik va yetti o'nlik turli o'rinlarda turadi. O'nliklar kerak.", en: "Seven units and seven tens occupy different places. You need tens." },
        { ru: 'Сохрани первую группу целиком. Она обозначает двести четырнадцать тысяч.', uz: "Birinchi guruhni to'liq saqlang. U ikki yuz o'n to'rt mingni bildiradi.", en: "Keep the first group as a whole. It stands for two hundred and fourteen thousand." },
      ],
    },
  },
  s6: {
    eyebrow: { ru: 'Собираем число', uz: "Sonni yig'amiz", en: "Collect a number." },
    title: { ru: 'Разрядные слагаемые возвращаются на свои места', uz: "Xona qo'shiluvchilari o'z o'rniga qaytadi", en: "The digits are returned to their places." },
    lead: {
      ru: 'Каждое ненулевое слагаемое задаёт цифру в своём разряде, а пустые разряды сохраняют нули.',
      uz: "Har bir noldan farqli qo'shiluvchi o'z xonasidagi raqamni belgilaydi, bo'sh xonalarni esa nollar saqlaydi.",
      en: "Each non-zero component sets a digit in its digit, and empty digits retain zeros.",
    },
    instruction: {
      ru: 'Для 500 000 + 2 000 + 30 + 6 заполняем шесть разрядов слева направо.',
      uz: "500 000 + 2 000 + 30 + 6 uchun oltita xonani chapdan o'ngga to'ldiramiz.",
      en: "For 500,000 + 2,000 + 30 + 6, fill six places from left to right.",
    },
    model: {
      kind: 'code',
      badge: { ru: 'Разрядные значения', uz: 'Xona qiymatlari', en: "Place values" },
      number: '500 000 + 2 000 + 30 + 6',
    },
    correctText: {
      ru: 'Получается 502 036: пустые десятки тысяч и сотни отмечены нулями.',
      uz: "502 036 hosil bo'ladi: bo'sh o'n minglar va yuzlar xonalari nollar bilan belgilandi.",
      en: "So 502,036: empty tens of thousands and hundreds are marked with zeros.",
    },
    audio: {
      intro: {
        ru: [
          'Соберём число из пятисот тысяч, двух тысяч, трёх десятков и шести единиц. Каждое слагаемое занимает свой разряд.',
          'Разряды десятков тысяч и сотен пусты, поэтому записываем в них нули. Получается пятьсот две тысячи тридцать шесть.',
        ],
        uz: [
          "Besh yuz ming, ikki ming, uch o'nlik va olti birlikdan son yig'amiz. Har bir qo'shiluvchi o'z xonasini egallaydi.",
          "O'n minglar va yuzlar xonalari bo'sh, shuning uchun ularga nol yozamiz. Besh yuz ikki ming o'ttiz olti hosil bo'ladi.",
        ],
        en: [
          "Let us build a number from five hundred thousand, two thousand, three tens and six ones, placing each value correctly.",
          "The ten-thousands and hundreds places are empty, so we write zeros in them. The result is five hundred and two thousand and thirty-six.",
        ],
      },
      on_correct: {
        ru: 'Чтобы восстановить число, ставим каждое слагаемое в его разряд, а пустые места заполняем нулями.',
        uz: "Sonni tiklash uchun har bir qo'shiluvchini o'z xonasiga qo'yamiz, bo'sh xonalarni esa nollar bilan to'ldiramiz.",
        en: "To restore the number, put each component in its place, and fill the empty spaces with zeros.",
      },
    },
  },
  s7: {
    eyebrow: { ru: 'Практика без опоры', uz: 'Kam yordamli mashq', en: "Unsupported practice" },
    title: { ru: 'Старший класс может быть коротким', uz: "Katta sinf qisqa bo'lishi mumkin", en: "The leftmost group can be short." },
    lead: { ru: 'В старшем классе одна цифра, а класс единиц всё равно занимает три места.', uz: "Katta sinfda bitta raqam bor, birlar sinfi esa baribir uchta o'rinni egallaydi.", en: "In high school, there is one digit, and the ones group still occupies three places." },
    instruction: { ru: 'Как записать «семь тысяч сорок»?', uz: "Yetti ming qirq qanday yoziladi?", en: "How to write \"seven thousand forty\"?" },
    model: { kind: 'classes', badge: { ru: 'Четырёхзначный код', uz: "To'rt xonali kod", en: "Four-digit code." }, groups: [
      { value: '7', label: { ru: 'класс тысяч', uz: 'minglar sinfi', en: "group" }, tone: 'cyan' },
      { value: '___', label: { ru: 'класс единиц', uz: 'birlar sinfi', en: "unit" }, tone: 'accent' },
    ] },
    options: ['7 040', '7 400', '7 004', '70 040'],
    correctIndex: 0,
    inputWrongDefault: { ru: 'Старший класс содержит только цифру 7. Справа запиши три места класса единиц: 0 сотен, 4 десятка, 0 единиц.', uz: "Katta sinfda faqat 7 raqami bor. O'ngda birlar sinfining uchta xonasini yozing: 0 yuzlik, 4 o'nlik, 0 birlik.", en: "The left-hand group contains only the digit 7. On the right, write down three places of the ones group: 0 hundreds, 4 tens and 0 ones." },
    inputWrongAudio: { ru: 'Старший класс содержит только семь тысяч. Справа нужны ноль сотен, четыре десятка и ноль единиц.', uz: "Katta sinfda faqat yetti ming bor. O'ngda nol yuzlik, to'rt o'nlik va nol birlik kerak.", en: "The leftmost group only has seven thousand. On the right, you need zero hundred, four tens, and zero." },
    correctText: { ru: '7 040: старший класс записан одной цифрой, а справа стоят 0 сотен, 4 десятка и 0 единиц.', uz: "7 040: katta sinf bitta raqam bilan yozildi, o'ngda esa 0 yuzlik, 4 o'nlik va 0 birlik turibdi.", en: "7,040: The leftmost group is written in one digit, and on the right are 0 hundred, 4 tens and 0 units." },
    wrong: [
      null,
      { ru: '400 означает четыре сотни, а в условии названы четыре десятка.', uz: "400 to'rt yuzlikni bildiradi, shartda esa to'rt o'nlik aytilgan.", en: "400 means four hundred, and in the condition four tens are named." },
      { ru: '004 означает четыре единицы. Для сорока цифра 4 должна стоять в десятках.', uz: "004 to'rt birlikni bildiradi. Qirq uchun 4 o'nlar xonasida turishi kerak.", en: "004 means four units. For forty, the digit 4 should be in the tens." },
      { ru: '70 040 — это семьдесят тысяч сорок. В условии названо только семь тысяч.', uz: "70 040 yetmish ming qirqni bildiradi. Shartda faqat yetti ming aytilgan.", en: "70,040 is seventy thousand forty. In the condition only seven thousand are named." },
    ],
    audio: {
      intro: { ru: ['Теперь запиши семь тысяч сорок. Старший класс может состоять из одной цифры, а правый класс сохраняет три места.'], uz: ["Endi yetti ming qirq sonini yozing. Katta sinf bitta raqamdan iborat bo'lishi mumkin, o'ng sinf esa uchta xonani saqlaydi."], en: ["Now write down seven thousand forty. The left-hand group can be one digit, and the group on the right keeps all three places."] },
      on_correct: { ru: 'Да. Семь тысяч записаны одной цифрой, а правая группа показывает ноль сотен, четыре десятка и ноль единиц.', uz: "Ha. Yetti ming bitta raqam bilan yozildi, o'ng guruh esa nol yuzlik, to'rt o'nlik va nol birlikni ko'rsatdi.", en: "Yes. Seven thousand are written in one digit, and the right group shows zero hundreds, four tens and zero units." },
      on_wrong: [
        null,
        { ru: 'Четыре должно стоять в десятках, не в сотнях.', uz: "To'rt raqami yuzlarda emas, o'nlarda turishi kerak.", en: "Four should stand in tens, not in hundreds." },
        { ru: 'Четыре должно стоять в десятках, не в единицах.', uz: "To'rt raqami birlarda emas, o'nlarda turishi kerak.", en: "Four should be in tens, not in units." },
        { ru: 'Слева нужна одна цифра семь. Две цифры дали бы семьдесят тысяч.', uz: "Chapda bitta yetti raqami kerak. Ikkita raqam yetmish mingni bildirardi.", en: "On the left you need one digit seven. Two digits would make seventy thousand." },
      ],
    },
  },
  s8: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: "Opening" },
    title: { ru: 'Чтение проверяет запись', uz: "O'qish yozuvni tekshiradi", en: "Reading checks the notation" },
    lead: { ru: 'Сопоставим код с его словесной формой и увидим надёжную проверку.', uz: "Kodni uning so'zli shakli bilan solishtirib, ishonchli tekshiruvni ko'ramiz.", en: "Compare the code with its verbal form and see a reliable check." },
    instruction: { ru: 'Обратное чтение подтверждает, что каждый класс и разряд совпадает с записью.', uz: "Qayta o'qish har bir sinf va xona yozuvga mosligini tasdiqlaydi.", en: "Reading the number back confirms every group and place in the notation." },
    model: {
      kind: 'rows',
      badge: { ru: 'Запись и чтение', uz: "Yozuv va o'qish", en: "Write and read" },
      rows: [
        { label: { ru: 'четыреста две тысячи восемнадцать', uz: "to'rt yuz ikki ming o'n sakkiz", en: "four hundred and two thousand eighteen" }, value: '402 018' },
        { label: { ru: 'семь тысяч сорок', uz: 'yetti ming qirq', en: "seventy" }, value: '7 040' },
      ],
    },
    options: [
      { ru: 'Каждый названный класс и разряд совпадает с записью', uz: "Aytilgan har bir sinf va xona yozuvga mos keladi", en: "Every named group and place matches the notation." },
      { ru: 'Число произнесённых слов равно числу цифр', uz: "Aytilgan so'zlar soni raqamlar soniga teng", en: "The number of words spoken is the number of numbers" },
      { ru: 'Все нули нужно произнести отдельно', uz: 'Barcha nollarni alohida aytish kerak', en: "All zeros should be pronounced separately." },
      { ru: 'Код удобнее читать справа налево', uz: "Kodni o'ngdan chapga o'qish qulayroq", en: "The code is easier to read from right to left." },
    ],
    correctIndex: 0,
    correctText: { ru: 'Обратное чтение восстанавливает те же классы и разряды. Значит, запись можно так проверить.', uz: "Qayta o'qish ayni sinf va xonalarni tiklaydi. Demak, yozuvni shu usulda tekshirish mumkin.", en: "Reading back restores the same groups and digits, so you can check the notation that way." },
    wrong: [
      null,
      { ru: 'Одно число может требовать разное количество слов. Проверять нужно классы и разряды, а не число слов.', uz: "Bir son turli miqdordagi so'z bilan aytilishi mumkin. So'zlar sonini emas, sinf va xonalarni tekshirish kerak.", en: "One number can require different number of words, and you need to check the groups and digits, not the number of words." },
      { ru: 'Пустые разряды нулями не называют. Их положение слышно по названиям остальных разрядов.', uz: "Bo'sh xonalardagi nollar aytilmaydi. Ularning o'rni boshqa xonalar nomidan bilinadi.", en: "Empty digits are not called zeros. Their position is heard from the names of the other digits." },
      { ru: 'Чтение начинается с крайнего левого непустого класса. Справа налево порядок числа разрушится.', uz: "O'qish eng chapdagi bo'sh bo'lmagan sinfdan boshlanadi. O'ngdan chapga o'qish son tartibini buzadi.", en: "Reading begins with the far left, the non-empty group, and from right to left, the order of the number will collapse." },
    ],
    audio: {
      intro: { ru: ['Сопоставим два кода с их названиями. Чтение помогает проверить цифровую запись по классам и разрядам.'], uz: ["Ikki kodni ularning nomlari bilan solishtiramiz. O'qish raqamli yozuvni sinf va xonalar bo'yicha tekshiradi."], en: ["Compare the two codes to their names. Reading helps you check the written notation place by place."] },
      on_correct: { ru: 'При обратном чтении классы и разряды должны совпасть с цифровой записью.', uz: "Qayta o'qishda sinf va xonalar raqamli yozuvga mos kelishi kerak.", en: "On reverse reading, groups and digits must match the written notation." },
      on_wrong: [
        null,
        { ru: 'Не считай слова. Сверь, какие классы и разряды они называют.', uz: "So'zlarni sanamang. Ular qaysi sinf va xonalarni aytayotganini solishtiring.", en: "Don't count the words, check what groups and places they call." },
        { ru: 'Нули сохраняем в записи, но отдельно не произносим.', uz: "Nollarni yozuvda saqlaymiz, ammo alohida aytmaymiz.", en: "Zeros are kept in the notation, but not separately pronounced." },
        { ru: 'Начни с левого непустого класса и сохрани порядок групп.', uz: "Chapdagi bo'sh bo'lmagan sinfdan boshlang va guruhlar tartibini saqlang.", en: "Start with the left non-empty group and keep the order of the groups." },
      ],
    },
  },
  s9: {
    eyebrow: { ru: 'Собираем правило', uz: "Qoidani yig'amiz", en: "Making a rule" },
    title: { ru: 'Правило чтения и записи', uz: "O'qish va yozish qoidasi", en: "Rule of reading and writing" },
    lead: { ru: 'Три шага объединяют все рассмотренные примеры.', uz: "Uchta qadam ko'rilgan barcha misollarni birlashtiradi.", en: "The three steps combine all the examples considered." },
    instruction: { ru: 'Собираем надёжный алгоритм чтения и записи.', uz: "O'qish va yozishning ishonchli algoritmini yig'amiz.", en: "Collect a reliable reading and writing algorithm." },
    model: { kind: 'steps', badge: { ru: 'Алгоритм', uz: 'Algoritm', en: "The algorithm." }, steps: [
      { ru: '1. Выделить классы', uz: '1. Sinflarni ajratish', en: "1. Set up groups" },
      { ru: '2. Читать или заполнять слева направо', uz: "2. Chapdan o'ngga o'qish yoki to'ldirish", en: "2. Read or fill from left to right" },
      { ru: '3. Справа от старшего класса сохранять по три разряда', uz: "3. Katta sinfdan o'ngda uchtadan xonani saqlash", en: "3. To the right of the leftmost group, keep three places." },
    ] },
    options: [
      { ru: 'Читаем классы слева направо, а справа от старшего класса сохраняем по три разряда', uz: "Sinflarni chapdan o'ngga o'qiymiz, katta sinfdan o'ngda esa uchtadan xonani saqlaymiz", en: "Read groups from left to right, and to the right of the leftmost group save three places." },
      { ru: 'Читаем каждую цифру отдельно и записываем только ненулевые цифры', uz: "Har bir raqamni alohida o'qiymiz va faqat noldan farqli raqamlarni yozamiz", en: "Read each digit separately and write only non-zero digits." },
      { ru: 'Начинаем с класса единиц и перестраиваем число справа налево', uz: "Birlar sinfidan boshlaymiz va sonni o'ngdan chapga qayta tuzamiz", en: "Start with the ones group and rearrange the number from right to left." },
      { ru: 'Нули учитываем только в начале всего числа', uz: 'Nollarni faqat butun son boshida hisobga olamiz', en: "We count zeros only at the beginning of the whole number." },
    ],
    correctIndex: 0,
    correctText: { ru: 'Правило собрано: классы читаем слева направо, пустые разряды в записи сохраняем нулями.', uz: "Qoida yig'ildi: sinflarni chapdan o'ngga o'qiymiz, yozuvdagi bo'sh xonalarni nollar bilan saqlaymiz.", en: "The rule is compiled: groups are read from left to right, zeros hold empty places in the notation." },
    wrong: [
      null,
      { ru: 'По отдельным цифрам нельзя услышать сотни и десятки как единое число. Нули тоже нельзя терять.', uz: "Alohida raqamlardan yuzlik va o'nliklarni yaxlit son sifatida eshitib bo'lmaydi. Nollarni ham yo'qotib bo'lmaydi.", en: "You can't hear hundreds and tens of numbers as a single number, and you can't lose zeros." },
      { ru: 'Чтение начинается с крайнего левого непустого класса, а не справа.', uz: "O'qish o'ngdan emas, eng chapdagi bo'sh bo'lmagan sinfdan boshlanadi.", en: "Reading begins with the far left non-empty group, not the right." },
      { ru: 'Внутренние нули важнее начальных: они удерживают разряды внутри числа.', uz: "Ichki nollar muhim: ular son ichidagi xonalarni saqlaydi.", en: 'Internal zeros matter more than leading zeros here: they hold places within the number.' },
    ],
    audio: {
      intro: { ru: ['Мы уже прочитали и записали несколько кодов. Теперь три шага соберутся в общее правило.'], uz: ["Biz bir nechta kodni o'qib va yozib ko'rdik. Endi uchta qadam umumiy qoidaga birlashadi."], en: ["We've already read and written some codes, and now we will combine the three steps into one general rule."] },
      on_correct: { ru: 'Правило точное. Классы читаем слева направо, а пустые разряды при записи отмечаем нулями.', uz: "Qoida aniq. Sinflarni chapdan o'ngga o'qiymiz, yozishda bo'sh xonalarni nollar bilan belgilaymiz.", en: "groups are read from left to right, and empty places are written with zeros." },
      on_wrong: [
        null,
        { ru: 'Вспомни модели. Мы читали группы целиком и сохраняли нули.', uz: "Modellarni eslang. Biz guruhlarni yaxlit o'qidik va nollarni saqladik.", en: "Remember the models. We read the whole group and saved the zeros." },
        { ru: 'Читать начинаем с левой группы, потому что она задаёт старший класс.', uz: "O'qishni chap guruhdan boshlaymiz, chunki u katta sinfni ko'rsatadi.", en: "We start with the left-hand group, because it is the leftmost place-value group." },
        { ru: 'Проверь примеры с нулями внутри правой группы. Эти нули нельзя пропускать.', uz: "O'ng guruh ichidagi nolli misollarni tekshiring. Bu nollarni tashlab bo'lmaydi.", en: "Check the zeros in the right group. These zeros can't be missed." },
      ],
    },
  },
  s10: {
    eyebrow: { ru: 'Новый пример', uz: 'Yangi misol', en: "A new example" },
    title: { ru: 'Записываем новый код', uz: 'Yangi kodni yozamiz', en: "Write a new code" },
    lead: { ru: 'Применим правило к числу с двумя внутренними нулями.', uz: "Qoidani ikkita ichki noli bor songa qo'llaymiz.", en: "Apply the rule to a number with two internal zeros." },
    instruction: { ru: '«Девятьсот три тысячи шестнадцать» образует группы 903 и 016.', uz: "To'qqiz yuz uch ming o'n olti soni 903 va 016 guruhlarini hosil qiladi.", en: "The nine hundred and three thousand sixteen are groups 903 and 016." },
    model: { kind: 'code', badge: { ru: 'Самостоятельная запись', uz: 'Mustaqil yozuv', en: "Write independently" }, number: '□ □ □   □ □ □' },
    options: ['903 016', '930 016', '903 160', '90 316'],
    correctIndex: 0,
    inputWrongDefault: { ru: 'Сначала запиши 903 в классе тысяч. Затем сохрани три места справа: 0 сотен, 1 десяток, 6 единиц.', uz: "Avval minglar sinfiga 903 ni yozing. Keyin o'ngda uchta xonani saqlang: 0 yuzlik, 1 o'nlik, 6 birlik.", en: "First, write 903 in the thousands group. Then save three places on the right: 0 hundred, 1 ten, 6 units." },
    inputWrongAudio: { ru: 'Сначала запиши девятьсот три в классе тысяч. Затем справа сохрани ноль сотен, один десяток и шесть единиц.', uz: "Avval minglar sinfiga to'qqiz yuz uchni yozing. Keyin o'ngda nol yuzlik, bir o'nlik va olti birlikni saqlang.", en: "First, write nine hundred and three in a thousands group. Then on the right, save zero hundred, one ten, and six." },
    correctText: { ru: '903 016: обе группы занимают по три места, внутренние нули сохранены.', uz: "903 016: ikkala guruh ham uchtadan o'rinni egallaydi, ichki nollar saqlangan.", en: "903,016: Both groups occupy three places each, with internal zeros retained." },
    wrong: [
      null,
      { ru: 'В классе тысяч переставлены 0 и 3. Нужно девятьсот три, то есть 903.', uz: "Minglar sinfida 0 va 3 o'rni almashgan. To'qqiz yuz uch, ya'ni 903 kerak.", en: "In a thousands group, 0s and 3s are rearranged. You need nine hundred and three, which is 903." },
      { ru: '160 означает сто шестьдесят. В условии названы шестнадцать.', uz: "160 bir yuz oltmishni bildiradi. Shartda o'n olti aytilgan.", en: "160 means one hundred and sixty. In the condition sixteen are named." },
      { ru: 'Граница классов сдвинулась и пропал разряд. Сохрани две тройки.', uz: "Sinflar chegarasi siljib, bitta xona yo'qolgan. Ikkita uchlikni saqlang.", en: "The group boundary has shifted and the place is gone, save two threes." },
    ],
    audio: {
      intro: { ru: ['Разберём девятьсот три тысячи шестнадцать. Сначала представим две группы по три места.'], uz: ["To'qqiz yuz uch ming o'n olti sonini tahlil qilamiz. Avval uchtadan o'rinli ikkita guruhni tasavvur qilamiz."], en: ["Let's look at nine hundred and three thousand sixteen. First, picture two groups of three digits."] },
      on_correct: { ru: 'Получается девятьсот три тысячи шестнадцать. Класс тысяч и класс единиц заняли свои места.', uz: "To'qqiz yuz uch ming o'n olti hosil bo'ladi. Minglar sinfi va birlar sinfi o'z o'rnini egallaydi.", en: "That makes nine hundred and three thousand sixteen. The thousands group and the ones group have taken their place." },
      on_wrong: [
        null,
        { ru: 'Прочитай левую группу ещё раз. Нужны девятьсот три.', uz: "Chap guruhni yana o'qing. To'qqiz yuz uch kerak.", en: "Read the left group again. It takes nine hundred and three." },
        { ru: 'Шестнадцать занимает десятки и единицы. Перед ним в группе нужен ноль сотен.', uz: "O'n olti o'nlar va birlarni egallaydi. Guruh boshida nol yuzlik kerak.", en: "Sixteen takes tens and one. In front of him, a group needs zero hundred." },
        { ru: 'Сохрани три места для класса тысяч и три для класса единиц.', uz: "Minglar sinfi uchun uchta, birlar sinfi uchun uchta o'rinni saqlang.", en: "Save three places for the thousands group and three for the ones group." },
      ],
    },
  },
  s11: {
    eyebrow: { ru: 'Лаборатория примеров', uz: 'Misollar laboratoriyasi', en: "Example laboratory" },
    title: { ru: 'Четыре разобранных примера', uz: "To'rtta tahlil qilingan misol", en: "Four examples taken apart" },
    lead: { ru: 'В каждом примере сразу видны точная запись, чтение и причина.', uz: "Har bir misolda aniq yozuv, o'qish va sabab darhol ko'rinadi.", en: "In each example, the exact notation, reading, and reason are immediately visible." },
    audio: {
      intro: { ru: ['Разберём четыре коротких примера. В каждом используем классы и сохраняем пустые разряды.'], uz: ["To'rtta qisqa misolni tahlil qilamiz. Har birida sinflardan foydalanamiz va bo'sh xonalarni saqlaymiz."], en: ["Let us study four short examples. In each one, we use place-value groups and keep every empty place."] },
    },
    items: [
      {
        question: { ru: 'Как записать «четыреста семь тысяч двести пять»?', uz: "To'rt yuz yetti ming ikki yuz besh qanday yoziladi?", en: "How to write “four hundred and seven thousand two hundred and five”?" },
        options: ['407 205', '470 205', '407 025', '40 725'],
        correctIndex: 0,
        correctText: { ru: '407 205 сохраняет обе группы без перестановки.', uz: '407 205 ikkala guruhni almashtirmasdan saqlaydi.', en: "407 205 retains both groups without permutation." },
        wrong: [null, { ru: 'В левой группе переставлены 0 и 7.', uz: "Chap guruhda 0 va 7 o'rni almashgan.", en: "In the left group, 0 and 7 are rearranged." }, { ru: 'В правой группе 025 означает двадцать пять, а не двести пять.', uz: "O'ng guruhdagi 025 yigirma beshni bildiradi, ikki yuz beshni emas.", en: "In the right group, 025 means twenty-five, not two hundred-five." }, { ru: 'Сдвинута граница классов и потерян разряд.', uz: "Sinflar chegarasi siljib, bitta xona yo'qolgan.", en: "Group boundary is shifted and place is lost." }],
        audio: {
          intro: { ru: ['Четыреста семь тысяч двести пять разделяем на две группы.'], uz: ["To'rt yuz yetti ming ikki yuz besh sonini ikkita guruhga ajratamiz."], en: ["Four hundred and seven thousand two hundred and five is divided into two groups."] },
          on_correct: { ru: 'Обе группы записаны точно. Получается четыреста семь тысяч двести пять.', uz: "Ikkala guruh ham aniq yozilgan. To'rt yuz yetti ming ikki yuz besh hosil bo'ladi.", en: "Both groups are recorded exactly. That's four hundred and seven thousand two hundred and five." },
          on_wrong: [null, { ru: 'Проверь порядок цифр в левой группе.', uz: "Chap guruhdagi raqamlar tartibini tekshiring.", en: "Check the order of the numbers in the left group." }, { ru: 'Проверь сотни в правой группе.', uz: "O'ng guruhdagi yuzlarni tekshiring.", en: "Check the hundreds in the right group." }, { ru: 'Верни границу между двумя тройками.', uz: 'Ikkita uchlik orasidagi chegarani qaytaring.', en: "Return the line between the two threes." }],
        },
      },
      {
        question: { ru: 'Как читается 620 009?', uz: "620 009 qanday o'qiladi?", en: "How does 620,009 read?" },
        options: [
          { ru: 'шестьсот двадцать тысяч девять', uz: "olti yuz yigirma ming to'qqiz", en: "six hundred and twenty-nine" },
          { ru: 'шестьсот двадцать тысяч девяносто', uz: "olti yuz yigirma ming to'qson", en: "six hundred and twenty thousand ninety" },
          { ru: 'шестьдесят две тысячи девять', uz: "oltmish ikki ming to'qqiz", en: "sixty-two" },
          { ru: 'шестьсот две тысячи девять', uz: "olti yuz ikki ming to'qqiz", en: "sixty-two" },
        ],
        correctIndex: 0,
        correctText: { ru: '009 читается как девять, но оба нуля остаются в записи.', uz: "009 to'qqiz deb o'qiladi, ammo ikkala nol ham yozuvda qoladi.", en: "009 reads as nine, but both zeros remain in the notation." },
        wrong: [null, { ru: '090 читалось бы как девяносто. Здесь 9 стоит в единицах.', uz: "090 to'qson deb o'qilardi. Bu yerda 9 birlar xonasida.", en: "090 would read like ninety. Here 9 is in units." }, { ru: 'Левая группа 620 прочитана как 62. Ноль в конце группы меняет значение.', uz: "Chapdagi 620 guruhi 62 deb o'qilgan. Guruh oxiridagi nol qiymatni o'zgartiradi.", en: "The left group 620 reads 62. The zero at the end of the group changes meaning." }, { ru: 'В левой группе есть 2 десятка, поэтому читаем шестьсот двадцать.', uz: "Chap guruhda 2 o'nlik bor, shuning uchun olti yuz yigirma deb o'qiymiz.", en: "In the left group there are 2 tens, so we read six hundred and twenty." }],
        audio: {
          intro: { ru: ['Слева записан класс тысяч со значением шестьсот двадцать. Справа в классе единиц только девять единиц.'], uz: ["Chapda olti yuz yigirma qiymatli minglar sinfi yozilgan. O'ngdagi birlar sinfida faqat to'qqiz birlik bor."], en: ["On the left is a thousands group with a value of six hundred and twenty. On the right, the ones group contains only nine ones."] },
          on_correct: { ru: 'Нули не произносятся отдельно, но сохраняют места.', uz: "Nollar alohida aytilmaydi, ammo o'rinlarni saqlaydi.", en: "The zeros are not pronounced separately, but they retain places." },
          on_wrong: [null, { ru: 'Девять стоит в единицах, не в десятках.', uz: "To'qqiz o'nlarda emas, birlarda turibdi.", en: "Nine is in units, not in tens." }, { ru: 'Прочитай левую группу целиком как шестьсот двадцать.', uz: "Chap guruhni olti yuz yigirma deb yaxlit o'qing.", en: "Read the whole left group as six hundred and twenty." }, { ru: 'Проверь десятки в левой группе. Там стоит цифра два.', uz: "Chap guruhdagi o'nlarni tekshiring. U yerda ikki raqami turibdi.", en: "Check the tens place in the left group. It contains the digit two." }],
        },
      },
      {
        question: { ru: 'Как записать «восемьдесят одна тысяча сорок»?', uz: "Sakson bir ming qirq qanday yoziladi?", en: "How to write “eighty-one thousand forty”?" },
        options: ['81 040', '81 400', '810 040', '8 140'],
        correctIndex: 0,
        correctText: { ru: '81 040: правый класс записан как 040.', uz: "81 040: o'ng sinf 040 ko'rinishida yozilgan.", en: "81,040: The group on the right is written as 040." },
        wrong: [null, { ru: '400 означает четыре сотни, а нужно сорок.', uz: "400 to'rt yuzni bildiradi, qirq kerak.", en: "400 means four hundred and you need forty." }, { ru: 'Слева получилось восемьсот десять тысяч, а не восемьдесят одна тысяча.', uz: "Chapda sakson bir ming emas, sakkiz yuz o'n ming hosil bo'lgan.", en: "On the left was eight hundred and ten thousand, not eighty-one thousand." }, { ru: 'Потеряна граница и один пустой разряд правой группы.', uz: "Chegara va o'ng guruhdagi bitta bo'sh xona yo'qolgan.", en: "Lost the boundary and one empty place of the right group." }],
        audio: {
          intro: { ru: ['Восемьдесят одну тысячу сорок разделяем на класс тысяч и класс единиц.'], uz: ["Sakson bir ming qirq sonini minglar sinfi va birlar sinfiga ajratamiz."], en: ["Eighty-one thousand and forty is divided into a thousands group and a ones group."] },
          on_correct: { ru: 'Сорок занимает десятки правой группы, поэтому вокруг цифры четыре стоят нули.', uz: "Qirq o'ng guruhning o'nlar xonasini egallaydi, shuning uchun to'rt raqami atrofida nollar turadi.", en: "Forty occupies tens of the right group, so around the digit four are zeros." },
          on_wrong: [null, { ru: 'Сорок означает четыре десятка.', uz: "Qirq to'rt o'nlikni bildiradi.", en: "Forty means four tens." }, { ru: 'Левая группа должна обозначать восемьдесят одну тысячу.', uz: 'Chap guruh sakson bir mingni bildirishi kerak.', en: "The left group should stand for eighty-one thousand." }, { ru: 'Сохрани три места в правой группе.', uz: "O'ng guruhda uchta o'rinni saqlang.", en: "Save three places in the right group." }],
        },
      },
      {
        question: { ru: 'Какая проверка подтверждает запись 305 070?', uz: '305 070 yozuvini qaysi tekshiruv tasdiqlaydi?', en: "What verification does 305,070 confirm?" },
        options: [
          { ru: 'триста пять тысяч семьдесят', uz: 'uch yuz besh ming yetmish', en: "three hundred and five thousand seven" },
          { ru: 'триста пятьдесят тысяч семь', uz: "uch yuz ellik ming yetti", en: "three hundred and fifty seven" },
          { ru: 'тридцать пять тысяч семьдесят', uz: "o'ttiz besh ming yetmish", en: "thirty-five thousand seventy" },
          { ru: 'триста пять тысяч семьсот', uz: 'uch yuz besh ming yetti yuz', en: "three hundred and five thousand seven" },
        ],
        correctIndex: 0,
        correctText: { ru: 'Обратное чтение совпало с записью: 305 тысяч и 70 единиц.', uz: "Qayta o'qish yozuvga mos keldi: 305 ming va 70 birlik.", en: "The reverse reading coincided with the entry: 305,000 and 70." },
        wrong: [null, { ru: 'Это чтение соответствует другой левой группе и другой позиции 7.', uz: "Bu o'qish boshqa chap guruhga va 7 ning boshqa o'rniga mos.", en: "This reading corresponds to the other left group and the other position 7." }, { ru: 'Левая группа потеряла разряд сотен тысяч.', uz: "Chap guruh yuz minglar xonasini yo'qotgan.", en: "The left group lost hundreds of thousands." }, { ru: '700 поставило бы 7 в сотни, но в записи она стоит в десятках.', uz: "700 da 7 yuzlarda turardi, yozuvda esa u o'nlarda.", en: "700 would put 7 in the hundreds, but in the notation the digit stands in the tens place." }],
        audio: {
          intro: { ru: ['Прочитаем запись обратно и сопоставим её с точным названием числа.'], uz: ["Yozuvni qayta o'qib, sonning aniq nomi bilan solishtiramiz."], en: ["Read the notation back and compare it to the exact name of the number."] },
          on_correct: { ru: 'Проверка совпала. Запись и чтение обозначают одно число.', uz: "Tekshiruv mos keldi. Yozuv va o'qish bitta sonni bildiradi.", en: "The check matched. Write and read represent the same number." },
          on_wrong: [null, { ru: 'Сравни левую группу и место цифры семь.', uz: "Chap guruh va yetti raqami o'rnini solishtiring.", en: "Compare the left group and the digit seven." }, { ru: 'Верни сотни тысяч в левую группу.', uz: 'Yuz minglar xonasini chap guruhga qaytaring.', en: "Put hundreds of thousands back in the left group." }, { ru: 'Цифра семь стоит в десятках, а не в сотнях.', uz: "Yetti raqami yuzlarda emas, o'nlarda turibdi.", en: "The digit seven is in the tens place, not the hundreds place." }],
        },
      },
    ],
    completionText: { ru: 'Четыре примера разобраны.', uz: "To'rtta misol tahlil qilindi.", en: "Four examples disassembled." },
  },
  s12: {
    eyebrow: { ru: 'Разбор стратегии', uz: 'Strategiyani tahlil qilish', en: "Analysis of the strategy" },
    title: { ru: 'Надёжная короткая проверка', uz: 'Ishonchli qisqa tekshiruv', en: "Reliable short check" },
    lead: { ru: 'Три действия защищают запись от перестановки классов и пропуска нуля.', uz: "Uchta harakat yozuvni sinflar almashishi va nol tushib qolishidan himoya qiladi.", en: "Three actions protect the notation from rearranged groups and omitted zeros." },
    instruction: { ru: 'Разделяем на классы, читаем обратно и сверяем с исходным названием.', uz: "Sinflarga ajratamiz, qayta o'qiymiz va dastlabki nom bilan solishtiramiz.", en: "Divide into groups, read back and check with the original name." },
    model: { kind: 'steps', badge: { ru: 'Проверка', uz: 'Tekshiruv', en: "Verification" }, steps: [
      { ru: 'Разделить на классы', uz: 'Sinflarga ajratish', en: "Divide into groups" },
      { ru: 'Прочитать запись', uz: "Yozuvni o'qish", en: "Read the tape." },
      { ru: 'Сверить с голосом', uz: 'Ovoz bilan solishtirish', en: "Verify your voice." },
    ] },
    options: [
      { ru: 'Разделить на классы, прочитать обратно и сверить с условием', uz: "Sinflarga ajratib, qayta o'qish va shart bilan solishtirish", en: "Divide into groups, read back and check with the condition" },
      { ru: 'Посчитать сумму всех цифр', uz: "Barcha raqamlar yig'indisini hisoblash", en: 'Calculate the sum of all the digits' },
      { ru: 'Проверить только первую и последнюю цифры', uz: 'Faqat birinchi va oxirgi raqamni tekshirish', en: "Check only the first and last digits." },
      { ru: 'Убрать пробел между классами и посмотреть ещё раз', uz: "Sinflar orasidagi bo'shliqni olib tashlab, yana qarash", en: "Remove the gap between groups and look again." },
    ],
    correctIndex: 0,
    correctText: { ru: 'Обратное чтение проверяет и порядок классов, и сохранность внутренних нулей.', uz: "Qayta o'qish sinflar tartibini ham, ichki nollar saqlanganini ham tekshiradi.", en: "The reverse reading checks both the order of the groups and the safety of the inner zeros." },
    wrong: [
      null,
      { ru: 'Сумма цифр может совпасть у разных чисел и не показывает позиции.', uz: "Raqamlar yig'indisi turli sonlarda bir xil bo'lishi mumkin va o'rinlarni ko'rsatmaydi.", en: "The sum of the digits can coincide with different numbers and does not show the position." },
      { ru: 'Средние разряды останутся без проверки, именно там часто пропадает ноль.', uz: "O'rta xonalar tekshirilmay qoladi, aynan shu yerda nol ko'p tushib qoladi.", en: 'The middle places remain unchecked, and that is where a zero is often lost.' },
      { ru: 'Удаление границы скрывает структуру и не сравнивает запись с голосом.', uz: "Chegarani olib tashlash tuzilishni yashiradi va yozuvni ovoz bilan solishtirmaydi.", en: "Removing the boundary hides the structure and does not compare the written form with the spoken form." },
    ],
    audio: {
      intro: { ru: ['Короткая проверка должна заметить и перестановку классов, и пропущенный ноль. Проследим три шага.'], uz: ["Qisqa tekshiruv sinflar almashganini ham, tushib qolgan nolni ham sezishi kerak. Uchta qadamni kuzatamiz."], en: ["A reliable check must detect both rearranged groups and a missing zero."] },
      on_correct: { ru: 'Это надёжная стратегия. Обратное чтение сразу сравнивает запись с исходным названием.', uz: "Bu ishonchli strategiya. Qayta o'qish yozuvni darhol dastlabki nom bilan solishtiradi.", en: "It's a solid strategy. Reading back immediately compares the notation with the original wording." },
      on_wrong: [
        null,
        { ru: 'Сумма не хранит информацию о местах цифр. Нужна проверка структуры.', uz: "Yig'indi raqamlar o'rni haqidagi ma'lumotni saqlamaydi. Tuzilishni tekshirish kerak.", en: "The sum doesn't store the location of the digits, we need to check the structure." },
        { ru: 'Проверь все разряды, особенно нули внутри числа.', uz: "Barcha xonalarni, ayniqsa son ichidagi nollarni tekshiring.", en: "Check all the places, especially the zeros inside the number." },
        { ru: 'Граница классов помогает проверять, поэтому её нужно сохранить.', uz: 'Sinflar chegarasi tekshirishga yordam beradi, shuning uchun uni saqlash kerak.', en: "The group boundary helps to check, so it needs to be preserved." },
      ],
    },
  },
  s13: {
    eyebrow: { ru: 'Работа с ошибкой', uz: 'Xato bilan ishlash', en: "Dealing with a mistake" },
    title: { ru: 'Bit потерял ноль', uz: "Bit nolni yo'qotdi", en: "Bit lost a zero" },
    lead: { ru: 'Он услышал «семьдесят две тысячи сорок пять» и записал 7 245.', uz: "U yetmish ikki ming qirq beshni eshitib, 7 245 deb yozdi.", en: "Bit heard \"seventy-two thousand forty-five\" and recorded 7,245." },
    instruction: { ru: 'Какую первую ошибку видно при сравнении услышанного числа 72 045 с черновиком 7 245?', uz: "Eshitilgan 72 045 sonini 7 245 qoralamasi bilan taqqoslaganda qaysi birinchi xato ko'rinadi?", en: 'What is the first error you see when you compare the heard number 72,045 with the draft 7,245?' },
    model: { kind: 'compare', badge: { ru: 'Черновик Bit', uz: 'Bit qoralamasi', en: "Bit's draft" }, rows: [
      { label: { ru: 'услышал', uz: 'eshitdi', en: "heard" }, value: '72 045' },
      { label: { ru: 'записал', uz: 'yozdi', en: "recorded" }, value: '7 245' },
    ] },
    options: [
      { ru: 'Пропущен ноль сотен в классе единиц; верная запись 72 045', uz: "Birlar sinfidagi nol yuzlik tushib qolgan; to'g'ri yozuv 72 045", en: "Missed zero hundred in the ones group; correct entry 72,045" },
      { ru: 'Лишняя цифра 2; верная запись 7 045', uz: "2 raqami ortiqcha; to'g'ri yozuv 7 045", en: "Extra digit 2; correct entry 7,045" },
      { ru: 'Нужно переставить классы; верная запись 45 072', uz: "Sinflarni almashtirish kerak; to'g'ri yozuv 45 072", en: "groups need to be rearranged; correct entry 45,072" },
      { ru: 'Ошибка только в пробеле; число 7 245 верное', uz: "Xato faqat bo'shliqda; 7 245 soni to'g'ri", en: 'Only the spacing is wrong; 7,245 is correct' },
    ],
    correctIndex: 0,
    correctText: { ru: 'В правой группе сорок пять записывается как 045. Ноль удерживает разряд сотен.', uz: "O'ng guruhda qirq besh 045 ko'rinishida yoziladi. Nol yuzlar xonasini saqlaydi.", en: "In the right group, forty-five is written as 045. Zero holds the hundreds place." },
    wrong: [
      null,
      { ru: 'Цифра 2 нужна для семидесяти двух тысяч. Ошибка находится в правой группе.', uz: "2 raqami yetmish ikki ming uchun kerak. Xato o'ng guruhda.", en: "The digit 2 belongs to the thousands group in seventy-two thousand. The error is in the right group." },
      { ru: 'Группы уже названы в правильном порядке. Перестановка изменит число.', uz: "Guruhlar allaqachon to'g'ri tartibda aytilgan. Almashtirish sonni o'zgartiradi.", en: "The groups are already named in the right order. The shift will change the number." },
      { ru: 'Без нуля правая группа сдвигается, и число становится семью тысячами.', uz: "Nolsiz o'ng guruh siljiydi va son yetti mingga aylanadi.", en: "Without zero, the right-hand group shifts and the number becomes seven thousand." },
    ],
    audio: {
      intro: { ru: ['Бит услышал семьдесят две тысячи сорок пять, но записал в черновике семь тысяч двести сорок пять. Сравни классы и найди первую ошибку.'], uz: ["Bit yetmish ikki ming qirq besh sonini eshitdi, ammo qoralamaga yetti ming ikki yuz qirq besh deb yozdi. Sinflarni solishtirib, birinchi xatoni toping."], en: ['Bit heard seventy-two thousand forty-five but wrote seven thousand two hundred and forty-five in the draft. Compare the groups and find the first error.'] },
      on_correct: { ru: 'Ноль сотен возвращает правой группе три места и восстанавливает число.', uz: "Nol yuzlik o'ng guruhga uchta o'rinni qaytaradi va sonni tiklaydi.", en: "Zero hundred returns the right group three places and restores the number." },
      on_wrong: [
        null,
        { ru: 'Сохрани семьдесят две тысячи слева и проверь правую группу.', uz: "Chapda yetmish ikki mingni saqlang va o'ng guruhni tekshiring.", en: "Save seventy-two thousand on the left and check the right group." },
        { ru: 'Не меняй порядок классов. Ищи пропущенное место справа.', uz: "Sinflar tartibini o'zgartirmang. O'ng tomondagi tushib qolgan o'rinni izlang.", en: "Don't change the group order. Look for the missing place on the right." },
        { ru: 'Пробел показывает границу, но внутри правой группы всё равно нужны три места.', uz: "Bo'shliq chegarani ko'rsatadi, ammo o'ng guruh ichida baribir uchta o'rin kerak.", en: "The gap shows the boundary, but inside the right group you still need three places." },
      ],
    },
  },
  s14: {
    eyebrow: { ru: 'Городской перенос', uz: "Shahar vaziyatiga ko'chirish", en: "Urban transfer" },
    title: { ru: 'Восстанови адрес станции', uz: 'Stansiya manzilini tiklang', en: "Get the station address back." },
    lead: { ru: 'Станция продиктовала код. Центр данных примет только запись, прошедшую обратную проверку.', uz: "Stansiya kodni aytdi. Ma'lumotlar markazi faqat qayta tekshiruvdan o'tgan yozuvni qabul qiladi.", en: "The station dictated the code. The data centre will only accept notation that has been reverse-checked." },
    instruction: { ru: 'Какой пакет верно передаёт «шестьсот четыре тысячи восемнадцать»?', uz: "Qaysi paket olti yuz to'rt ming o'n sakkizni to'g'ri uzatadi?", en: "Which packet correctly transmits “six hundred and four thousand eighteen”?" },
    model: { kind: 'city', badge: { ru: 'Станция L-18', uz: 'L-18 stansiyasi', en: "Station L-18" }, number: 'VOICE → DATA' },
    options: [
      { ru: '604 018 → шестьсот четыре тысячи восемнадцать', uz: "604 018 → olti yuz to'rt ming o'n sakkiz", en: "604,018 → six hundred and four thousand eighteen" },
      { ru: '640 018 → шестьсот сорок тысяч восемнадцать', uz: "640 018 → olti yuz qirq ming o'n sakkiz", en: "640,018 → six hundred and forty thousand eighteen" },
      { ru: '604 180 → шестьсот четыре тысячи сто восемьдесят', uz: "604 180 → olti yuz to'rt ming bir yuz sakson", en: "604 180 Six hundred four thousand one hundred and eighty" },
      { ru: '60 418 → шестьдесят тысяч четыреста восемнадцать', uz: "60 418 → oltmish ming to'rt yuz o'n sakkiz", en: "60,418 → sixty thousand four hundred and eighteen" },
    ],
    correctIndex: 0,
    correctText: { ru: 'Запись 604 018 и обратное чтение совпадают. Адрес можно передавать.', uz: "604 018 yozuvi va qayta o'qish mos keldi. Manzilni uzatish mumkin.", en: "Write 604 018 and read back match. Address can be transmitted." },
    wrong: [
      null,
      { ru: 'В классе тысяч 4 сдвинута из единиц в десятки. Это уже 640 тысяч.', uz: "Minglar sinfida 4 birlardan o'nlarga siljigan. Bu endi 640 ming.", en: 'In the thousands group, the digit 4 moved from the thousands place to the ten-thousands place. That gives 640,000.' },
      { ru: 'Правая группа 180 означает сто восемьдесят, а станция назвала восемнадцать.', uz: "O'ng guruhdagi 180 bir yuz saksonni bildiradi, stansiya esa o'n sakkiz dedi.", en: "The right-hand group 180 means one hundred and eighty, and the station named eighteen." },
      { ru: 'Старший класс может иметь две цифры, но здесь правая группа стала 418 вместо 018. Пропущен ноль сотен перед восемнадцатью.', uz: "Katta sinf ikki raqamli bo'lishi mumkin, ammo bu yerda o'ng guruh 018 o'rniga 418 bo'lib qolgan. O'n sakkiz oldidagi nol yuzlik tushib qolgan.", en: "The leftmost group may have two digits, but here the right group is 418 instead of 018. missed zero hundred before eighteen." },
    ],
    audio: {
      intro: { ru: ['Станция продиктовала шестьсот четыре тысячи восемнадцать. Выбери запись и обратное чтение, которые полностью совпадают.'], uz: ["Stansiya olti yuz to'rt ming o'n sakkiz sonini aytdi. To'liq mos keladigan yozuv va qayta o'qishni tanlang."], en: ['The station dictated six hundred and four thousand eighteen. Choose the notation and reading that match exactly.'] },
      on_correct: { ru: 'Адрес подтверждён. Классы и внутренние нули переданы без потерь.', uz: "Manzil tasdiqlandi. Sinflar va ichki nollar yo'qotishsiz uzatildi.", en: "Address confirmed. groups and internal zeros transmitted without loss." },
      on_wrong: [
        null,
        { ru: 'Проверь место цифры четыре в классе тысяч.', uz: "Minglar sinfidagi to'rt raqami o'rnini tekshiring.", en: "Check the place of the digit four in the thousands group." },
        { ru: 'Проверь правую группу. Нужны восемнадцать, а не сто восемьдесят.', uz: "O'ng guruhni tekshiring. Bir yuz sakson emas, o'n sakkiz kerak.", en: "You need eighteen, not one hundred and eighty." },
        { ru: 'Проверь правую группу. Перед восемнадцатью нужен ноль сотен.', uz: "O'ng guruhni tekshiring. O'n sakkiz oldida nol yuzlik kerak.", en: "Check the right group. It takes zero hundred before eighteen." },
      ],
    },
  },
  s15: {
    eyebrow: { ru: 'Итог и мост', uz: "Yakun va ko'prik", en: "Bottom line" },
    title: { ru: 'Центр данных читает адреса точно', uz: "Ma'lumotlar markazi manzillarni aniq o'qiydi", en: "The data centre reads the addresses accurately." },
    lead: { ru: 'Соберём чтение, запись и проверку в одну памятку.', uz: "O'qish, yozish va tekshirishni bitta eslatmaga birlashtiramiz.", en: "Let's collect reading, writing and checking in one memo." },
    instruction: { ru: 'Полный способ соединяет структуру классов, точную запись и обратное чтение.', uz: "To'liq usul sinflar tuzilishi, aniq yozuv va qayta o'qishni birlashtiradi.", en: "The complete method combines the structure of groups, exact writing and reverse reading." },
    model: { kind: 'reward', badge: { ru: 'Модуль восстановлен', uz: 'Modul tiklandi', en: "Module restored" }, number: 'READ ↔ WRITE' },
    options: [
      { ru: 'Делю на классы, справа от старшего сохраняю по три разряда и проверяю запись обратным чтением', uz: "Sinflarga ajrataman, katta sinfdan o'ngda uchtadan xonani saqlayman va yozuvni qayta o'qib tekshiraman", en: "Divide into groups, to the right of the leftmost group, keep three places in every group and check the record by reading back" },
      { ru: 'Читаю цифры по одной и пропускаю нули', uz: "Raqamlarni bittadan o'qiyman va nollarni tashlab ketaman", en: "I read the numbers one by one and miss zeros." },
      { ru: 'Начинаю чтение справа и меняю классы местами', uz: "O'qishni o'ngdan boshlayman va sinflarni almashtiraman", en: "I start reading on the right and change groups." },
      { ru: 'Проверяю только количество цифр', uz: 'Faqat raqamlar sonini tekshiraman', en: "I only check the number of digits." },
    ],
    correctIndex: 0,
    correctText: { ru: 'Способ полный: структура, точная запись и обратная проверка работают вместе.', uz: "Usul to'liq: tuzilish, aniq yozuv va qayta tekshiruv birga ishlaydi.", en: "The method is complete: structure, accurate notation, and reverse verification work together." },
    bridge: { ru: 'Следующий вопрос: какое значение получает каждая цифра на своём месте?', uz: "Keyingi savol: har bir raqam o'z o'rnida qanday qiymat oladi?", en: "The next question is, what is the value of each number in its place?" },
    wrong: [
      null,
      { ru: 'Так внутренние нули исчезнут и число изменится. Вернись к классам.', uz: "Bunday qilsangiz ichki nollar yo'qoladi va son o'zgaradi. Sinflarga qayting.", en: "So the inner zeros will disappear and the number will change." },
      { ru: 'Чтение начинается слева, а порядок классов сохраняется.', uz: "O'qish chapdan boshlanadi va sinflar tartibi saqlanadi.", en: "Reading begins on the left, and the order of groups is maintained." },
      { ru: 'Количество цифр не проверяет их позиции. Нужна обратная проверка чтением.', uz: "Raqamlar soni ularning o'rnini tekshirmaydi. Qayta o'qib tekshirish kerak.", en: "The number of digits doesn't check their position. We need to reverse-check by reading." },
    ],
    audio: {
      intro: { ru: ['Миссия завершена. Объединим чтение, запись и проверку многозначного числа в одну памятку.'], uz: ["Missiya yakunlandi. Ko'p xonali sonni o'qish, yozish va tekshirishni bitta eslatmaga birlashtiramiz."], en: ["Mission complete. Combine reading, writing and checking a multi-digit number into one rule card."] },
      on_correct: { ru: 'Центр данных работает точно. Дальше выясним, какое значение получает цифра в каждом разряде.', uz: "Ma'lumotlar markazi aniq ishlayapti. Keyin raqam har bir xonada qanday qiymat olishini aniqlaymiz.", en: 'The data centre is working accurately. Next, we will find the value a digit has in each place.' },
      on_wrong: [
        null,
        { ru: 'Нули нужно сохранять, а группы читать как числа.', uz: "Nollarni saqlash, guruhlarni esa son sifatida o'qish kerak.", en: "Zeros should be saved and groups should be read as numbers." },
        { ru: 'Классы читаются слева направо без перестановки.', uz: "Sinflar chapdan o'ngga almashtirmasdan o'qiladi.", en: "groups are read from left to right without reshuffling." },
        { ru: 'Добавь проверку позиций с помощью обратного чтения.', uz: "Qayta o'qish yordamida o'rinlarni tekshirishni qo'shing.", en: "Add position verification with reverse reading." },
      ],
    },
  },
  s16: {
    eyebrow: { ru: 'Граница разрядов', uz: 'Xonalar chegarasi', en: "Boundary of places" },
    title: { ru: 'Пять цифр превращаются в шесть', uz: 'Beshta raqam oltita raqamga aylanadi', en: "Five digits turn into six" },
    lead: {
      ru: 'Один шаг после 99 999 расширяет старший класс тысяч и создаёт шестизначную запись.',
      uz: "99 999 dan keyingi bitta qadam katta minglar sinfini kengaytirib, olti xonali yozuv hosil qiladi.",
      en: "One step after 99,999 expands the leftmost thousands group and creates a six-digit notation.",
    },
    instruction: {
      ru: 'После 99 999 идёт 100 000: класс тысяч меняется с 99 на 100, а класс единиц полностью обнуляется.',
      uz: "99 999 dan keyin 100 000 keladi: minglar sinfi 99 dan 100 ga o'zgaradi, birlar sinfi esa to'liq nollanadi.",
      en: "After 99,999, 100,000 goes: the thousands group changes from 99 to 100, and the ones group is completely zeroed.",
    },
    model: {
      kind: 'classBoundary',
      badge: { ru: 'Переход через границу', uz: "Chegaradan o'tish", en: "Crossing the border" },
      before: '99 999',
      after: '100 000',
      beforeGroups: ['99', '999'],
      afterGroups: ['100', '000'],
      labels: [
        { ru: 'класс тысяч', uz: 'minglar sinfi', en: "group" },
        { ru: 'класс единиц', uz: 'birlar sinfi', en: "unit" },
      ],
    },
    options: [
      { ru: '99 999 → 100 000', uz: '99 999 → 100 000', en: '99 999 → 100 000' },
      { ru: '99 999 → 99 991', uz: '99 999 → 99 991', en: '99 999 → 99 991' },
      { ru: '99 999 → 100 999', uz: '99 999 → 100 999', en: '99 999 → 100 999' },
      { ru: '99 999 → 10 000', uz: '99 999 → 10 000', en: '99 999 → 10 000' },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Перенос проходит через все пять девяток. Запись становится шестизначной, но группировка справа по три цифры не меняется.',
      uz: "O'tish beshta to'qqizning barchasidan o'tadi. Yozuv olti xonali bo'ladi, ammo o'ngdan uchtadan guruhlash o'zgarmaydi.",
      en: "The transfer goes through all five nines. The notation becomes six-digit, but the three-digit grouping on the right doesn't change.",
    },
    wrong: [
      null,
      { ru: 'После последнего пятизначного числа начинается шестизначное.', uz: 'Oxirgi besh xonali sondan keyin olti xonali son boshlanadi.', en: "After the last five-digit number, a six-digit number begins." },
      { ru: 'Класс единиц после переноса должен состоять из трёх нулей.', uz: "O'tishdan keyin birlar sinfi uchta noldan iborat bo'lishi kerak.", en: "The ones group after transfer should consist of three zeros." },
      { ru: 'Число увеличивается, поэтому количество разрядов не может уменьшиться.', uz: 'Son oshadi, shuning uchun xonalar soni kamaymaydi.', en: "The number increases, so the number of digits cannot decrease." },
    ],
    audio: {
      intro: {
        ru: [
          'Девяносто девять тысяч девятьсот девяносто девять завершает пятизначные числа.',
          'Следующий шаг переносит единицу через все девятки и создаёт сто тысяч.',
        ],
        uz: [
          "To'qson to'qqiz ming to'qqiz yuz to'qson to'qqiz besh xonali sonlarni yakunlaydi.",
          "Keyingi qadam birlikni barcha to'qqizlardan o'tkazib, yuz mingni hosil qiladi.",
        ],
        en: [
          "Ninety-nine thousand nine hundred and ninety-nine is the last five-digit number.",
          "Adding one carries through all five nines and creates one hundred thousand.",
        ],
      },
      on_correct: {
        ru: 'Старший класс расширяется до трёх цифр, а класс единиц становится полностью пустым.',
        uz: "Katta sinf uchta raqamgacha kengayadi, birlar sinfi esa to'liq bo'sh qoladi.",
        en: "The left-hand group expands to three digits, and the ones group becomes completely empty.",
      },
      on_wrong: [
        null,
        { ru: 'После всех девяток возникает новый старший разряд.', uz: "Barcha to'qqizlardan keyin yangi katta xona paydo bo'ladi.", en: "After all nine there is a new senior place." },
        { ru: 'Перенос оставляет справа три нуля.', uz: "O'tish o'ng tomonda uchta nol qoldiradi.", en: "The transfer leaves three zeros on the right." },
        { ru: 'Новый разряд добавляется слева.', uz: "Yangi xona chap tomonga qo'shiladi.", en: "A new place is added to the left." },
      ],
    },
  },
  s17: {
    eyebrow: { ru: 'Контраст нулей', uz: 'Nollar kontrasti', en: "Contrast of zeros" },
    title: { ru: 'Пустой класс и пустые разряды — не одно и то же', uz: "Bo'sh sinf va bo'sh xonalar bir xil emas", en: "Empty group and empty places are not the same thing." },
    lead: {
      ru: 'Числа 400 006 и 406 000 содержат нули в разных ролях, поэтому читаются по-разному.',
      uz: "400 006 va 406 000 sonlarida nollar turli vazifani bajaradi, shuning uchun ular turlicha o'qiladi.",
      en: "The numbers 400,006 and 406,000 contain zeros in different roles, so they are read differently.",
    },
    instruction: {
      ru: 'В 400 006 класс единиц содержит 6 единиц. В 406 000 весь класс единиц пуст и при чтении не называется.',
      uz: "400 006 da birlar sinfi 6 birlikni saqlaydi. 406 000 da butun birlar sinfi bo'sh va o'qishda aytilmaydi.",
      en: "In 400,006, the ones group contains 6 units. In 406,000, the whole ones group is empty and is not called when read.",
    },
    model: {
      kind: 'zeroContrast',
      badge: { ru: 'Два положения нуля', uz: 'Nolning ikki holati', en: "Two zero positions" },
      cases: [
        {
          number: '400 006',
          groups: ['400', '006'],
          reading: { ru: 'четыреста тысяч шесть', uz: "to'rt yuz ming olti", en: "four hundred and six" },
          note: { ru: 'класс единиц не пуст', uz: "birlar sinfi bo'sh emas", en: "unit" },
        },
        {
          number: '406 000',
          groups: ['406', '000'],
          reading: { ru: 'четыреста шесть тысяч', uz: "to'rt yuz olti ming", en: "four hundred and six" },
          note: { ru: 'класс единиц полностью пуст', uz: "birlar sinfi to'liq bo'sh", en: "ones group" },
        },
      ],
    },
    options: [
      { ru: 'Положение нулей меняет чтение и значение', uz: "Nollarning o'rni o'qish va qiymatni o'zgartiradi", en: "Position of zeros changes reading and meaning" },
      { ru: 'Оба числа читаются одинаково', uz: "Ikkala son bir xil o'qiladi", en: "Both numbers read the same." },
      { ru: 'Все нули можно удалить', uz: 'Barcha nollarni olib tashlash mumkin', en: "All zeros can be removed." },
      { ru: 'Пустой класс нужно произнести словом ноль', uz: "Bo'sh sinfni nol so'zi bilan aytish kerak", en: "Empty group should be pronounced with the word zero." },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Внутренние нули удерживают места внутри непустого класса. Полностью пустой класс сохраняется в записи как 000, но вслух пропускается.',
      uz: "Ichki nollar bo'sh bo'lmagan sinf ichidagi o'rinlarni saqlaydi. To'liq bo'sh sinf yozuvda 000 bo'lib qoladi, ammo ovozda aytilmaydi.",
      en: "The inner zeros hold spaces within the non-empty group, and the completely empty group is written as 000 in the notation, but is omitted aloud.",
    },
    wrong: [
      null,
      { ru: 'Цифра 6 находится в разных классах и получает разное значение.', uz: "6 raqami turli sinflarda joylashib, turli qiymat oladi.", en: "The digit 6 is in different groups and therefore has different values." },
      { ru: 'Удаление нулей сдвинет цифру 6 в другие разряды.', uz: "Nollarni olib tashlash 6 raqamini boshqa xonalarga siljitadi.", en: "Removing the zeros will move the digit 6 to other places." },
      { ru: 'Пустой класс не произносится отдельно, но три его места сохраняются.', uz: "Bo'sh sinf alohida aytilmaydi, ammo uning uchta o'rni saqlanadi.", en: "The empty group is not pronounced separately, but its three places are retained." },
    ],
    audio: {
      intro: {
        ru: [
          'Сравним четыреста тысяч шесть и четыреста шесть тысяч.',
          'В первом числе класс единиц содержит шесть, а во втором он полностью пуст.',
        ],
        uz: [
          "To'rt yuz ming olti va to'rt yuz olti ming sonlarini solishtiramiz.",
          "Birinchi sonda birlar sinfi oltini saqlaydi, ikkinchisida esa u to'liq bo'sh.",
        ],
        en: [
          "Let us compare four hundred thousand six and four hundred and six thousand.",
          "In the first number, the ones group contains six; in the second number, the ones group is completely empty.",
        ],
      },
      on_correct: {
        ru: 'Нули внутри непустого класса удерживают места. Полностью пустой класс в чтении не называем.',
        uz: "Bo'sh bo'lmagan sinf ichidagi nollar o'rinlarni saqlaydi. To'liq bo'sh sinfni o'qishda aytmaymiz.",
        en: "The zeros inside the non-empty group hold the places. You don't call a completely empty group in reading.",
      },
      on_wrong: [
        null,
        { ru: 'Сначала определи, в каком классе стоит цифра шесть.', uz: "Avval olti raqami qaysi sinfda turganini aniqlang.", en: "First, determine which group contains the digit six." },
        { ru: 'Нули сохраняют разряды и менять их нельзя.', uz: "Nollar xonalarni saqlaydi, ularni o'zgartirib bo'lmaydi.", en: "The zeros keep the places and you can not change them." },
        { ru: 'Пустую группу не произносим отдельным словом.', uz: "Bo'sh guruhni alohida so'z bilan aytmaymiz.", en: "We do not pronounce an empty group in a single word." },
      ],
    },
  },
  s18: {
    eyebrow: { ru: 'Лаборатория диктанта', uz: 'Diktant laboratoriyasi', en: "Dictation lab" },
    title: { ru: 'Три городских кода от голоса до проверки', uz: 'Uchta shahar kodi ovozdan tekshiruvgacha', en: "Three City Codes From Voice to Verification" },
    lead: {
      ru: 'Каждый код проходит полный путь: услышать, разделить на классы, записать и прочитать обратно.',
      uz: "Har bir kod to'liq yo'lni o'tadi: eshitish, sinflarga ajratish, yozish va qayta o'qish.",
      en: "Each code goes a full way: hear, classify, write and read back.",
    },
    instruction: {
      ru: 'Открой все три решения и проследи, как словесная форма превращается в точную запись.',
      uz: "Uchala yechimni ochib, so'zli shakl aniq yozuvga qanday aylanishini kuzating.",
      en: "Open all three solutions and see how the word form turns into accurate notation.",
    },
    model: { kind: 'cityLab', badge: { ru: 'Три пакета данных', uz: "Uchta ma'lumot paketi", en: "Three data packets" } },
    items: [
      {
        station: 'A-47',
        spoken: { ru: 'двести тридцать тысяч сорок семь', uz: "ikki yuz o'ttiz ming qirq yetti", en: 'two hundred and thirty thousand forty-seven' },
        groups: ['230', '047'],
        written: '230 047',
        readBack: { ru: 'двести тридцать тысяч сорок семь', uz: "ikki yuz o'ttiz ming qirq yetti", en: 'two hundred and thirty thousand forty-seven' },
        note: { ru: 'ноль сотен удерживает 47 в десятках и единицах', uz: "nol yuzlik 47 ni o'nlar va birlarda saqlaydi", en: "zero hundred holds 47 in tens and units" },
        audio: {
          intro: { ru: 'Станция передала двести тридцать тысяч сорок семь.', uz: "Stansiya ikki yuz o'ttiz ming qirq yetti sonini uzatdi.", en: "The station delivered two hundred and thirty thousand forty-seven." },
          on_correct: { ru: 'Записываем две группы и читаем обратно без потери нуля сотен.', uz: "Ikki guruhni yozib, nol yuzlikni yo'qotmasdan qayta o'qiymiz.", en: "Write down two groups and read back without losing zero hundred." },
        },
      },
      {
        station: 'B-08',
        spoken: { ru: 'пятьсот шесть тысяч восемь', uz: 'besh yuz olti ming sakkiz', en: 'five hundred and six thousand eight' },
        groups: ['506', '008'],
        written: '506 008',
        readBack: { ru: 'пятьсот шесть тысяч восемь', uz: 'besh yuz olti ming sakkiz', en: 'five hundred and six thousand eight' },
        note: { ru: 'два нуля сохраняют 8 в единицах', uz: "ikkita nol 8 ni birlar xonasida saqlaydi", en: "two zeros keep 8 in units" },
        audio: {
          intro: { ru: 'Следующая станция передала пятьсот шесть тысяч восемь.', uz: 'Keyingi stansiya besh yuz olti ming sakkiz sonini uzatdi.', en: "The next station delivered five hundred and six thousand eight." },
          on_correct: { ru: 'В правой группе восемь занимает единицы, поэтому перед ним остаются два нуля.', uz: "O'ng guruhda sakkiz birlar xonasida, shuning uchun undan oldin ikkita nol qoladi.", en: 'In the right-hand group, eight is in the ones place, so two zeros remain in front of it.' },
        },
      },
      {
        station: 'C-90',
        spoken: { ru: 'девяносто тысяч девятьсот', uz: "to'qson ming to'qqiz yuz", en: "ninety thousand nine hundred" },
        groups: ['90', '900'],
        written: '90 900',
        readBack: { ru: 'девяносто тысяч девятьсот', uz: "to'qson ming to'qqiz yuz", en: "ninety thousand nine hundred" },
        note: { ru: 'старший класс может содержать две цифры', uz: "katta sinf ikkita raqamdan iborat bo'lishi mumkin", en: 'A leftmost group can contain two digits.' },
        audio: {
          intro: { ru: 'Третий код звучит как девяносто тысяч девятьсот.', uz: "Uchinchi kod to'qson ming to'qqiz yuz deb aytiladi.", en: "The third code sounds like ninety thousand nine hundred." },
          on_correct: { ru: 'Старший класс записываем двумя цифрами, а правый класс сохраняем полной тройкой.', uz: "Katta sinfni ikkita raqam bilan, o'ng sinfni esa to'liq uchlik bilan yozamiz.", en: "The leftmost group is written in two digits, and the group on the right is kept in full three." },
        },
      },
    ],
    options: [
      { ru: 'Все три записи подтверждены обратным чтением', uz: "Uchala yozuv qayta o'qish bilan tasdiqlangan", en: "All three entries confirmed by reverse reading" },
      { ru: 'Нули в правых группах можно убрать', uz: "O'ng guruhlardagi nollarni olib tashlash mumkin", en: "The zeros in the right groups can be removed." },
      { ru: 'Старший класс всегда должен иметь три цифры', uz: "Katta sinf har doim uchta raqamli bo'lishi kerak", en: "The leftmost group should always have three numbers." },
      { ru: 'Коды нужно читать по отдельным цифрам', uz: "Kodlarni alohida raqamlar bo'yicha o'qish kerak", en: "Codes should be read by individual numbers." },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Полный цикл совпал для каждого кода: голос, классы, запись и обратное чтение обозначают одно число.',
      uz: "Har bir kod uchun to'liq sikl mos keldi: ovoz, sinflar, yozuv va qayta o'qish bitta sonni bildiradi.",
      en: "The full cycle coincided for each code: voice, groups, writing, and reverse reading represent a single number.",
    },
    wrong: [
      null,
      { ru: 'Нули сохраняют точные места цифр в классе единиц.', uz: "Nollar birlar sinfidagi raqamlarning aniq o'rnini saqlaydi.", en: "The zeros retain the exact places of the digits in the ones group." },
      { ru: 'Только классы справа от старшего всегда записываются тремя цифрами.', uz: "Faqat katta sinfdan o'ngdagi sinflar doim uchta raqam bilan yoziladi.", en: "Only the groups to the right of the senior are always written in three digits." },
      { ru: 'Каждую группу читаем как целое число.', uz: "Har bir guruhni yaxlit son sifatida o'qiymiz.", en: "Each group is read as a whole number." },
    ],
    audio: {
      intro: {
        ru: ['Разберём три новых городских кода от диктанта до обратной проверки.'],
        uz: ["Uchta yangi shahar kodini diktantdan qayta tekshiruvgacha tahlil qilamiz."],
        en: ["Let's analyse three new city codes from dictation through to reading back."],
      },
      on_correct: {
        ru: 'Во всех трёх пакетах запись и обратное чтение совпадают.',
        uz: "Uchala paketda yozuv va qayta o'qish bir-biriga mos keladi.",
        en: "In all three packages, writing and reading back are the same.",
      },
      on_wrong: [
        null,
        { ru: 'Сохраняй каждое место правой группы.', uz: "O'ng guruhning har bir o'rnini saqlang.", en: "Save every place in the right group." },
        { ru: 'Старший класс может быть короче трёх цифр.', uz: "Katta sinf uchta raqamdan qisqa bo'lishi mumkin.", en: "A leftmost group can be shorter than three digits." },
        { ru: 'Читай классы целиком слева направо.', uz: "Sinflarni chapdan o'ngga yaxlit o'qing.", en: "Read the whole group from left to right." },
      ],
    },
  },
};

const makeMicroPractice = ({ audioIntro, correctAudio, wrongAudio, ...content }) => ({
  ...content,
  audio: {
    intro: audioIntro,
    on_correct: correctAudio,
    on_wrong: content.options.map((_, index) => (index === content.correctIndex ? null : wrongAudio)),
  },
});

const PRACTICE_CONTENT = {
  p1: makeMicroPractice({
    eyebrow: { ru: 'Практика 1', uz: '1-mashq', en: "Practice 1" },
    title: { ru: 'Находим классы', uz: 'Sinflarni topamiz', en: "Finding groups" },
    lead: { ru: 'Число 304 018 разделено на две группы.', uz: '304 018 soni ikki guruhga ajratilgan.', en: "The number 304,018 is divided into two groups." },
    instruction: { ru: 'Какая группа образует класс тысяч?', uz: 'Qaysi guruh minglar sinfini hosil qiladi?', en: "Which group makes up a thousands group?" },
    options: ['304', '018', '304 018'],
    correctIndex: 0,
    correctText: { ru: '304 — это класс тысяч. Правая группа 018 образует класс единиц.', uz: '304 minglar sinfi. O\'ngdagi 018 guruhi birlar sinfini hosil qiladi.', en: "304 is a thousands group. The right-hand group 018 forms a ones group." },
    wrong: [null, { ru: '018 находится справа и образует класс единиц.', uz: '018 o\'ngda joylashgan va birlar sinfini hosil qiladi.', en: "018 is on the right and forms a ones group." }, { ru: 'Нужно назвать только левую группу, а не всё число.', uz: 'Butun sonni emas, faqat chap guruhni tanlash kerak.', en: "You only need to name the left group, not the whole number." }],
    audioIntro: { ru: 'Посмотри на число триста четыре тысячи восемнадцать. Какая группа образует класс тысяч?', uz: 'Uch yuz to\'rt ming o\'n sakkiz soniga qarang. Qaysi guruh minglar sinfini hosil qiladi?', en: "Look at the number three hundred and four thousand eighteen. Which group forms a thousands group?" },
    correctAudio: { ru: 'Верно. Левая группа триста четыре образует класс тысяч.', uz: 'To\'g\'ri. Chapdagi uch yuz to\'rt guruhi minglar sinfini hosil qiladi.', en: "Right. The left group of three hundred and four forms a thousands group." },
    wrongAudio: { ru: 'Проверь границу классов. Класс тысяч находится слева.', uz: 'Sinflar chegarasini tekshiring. Minglar sinfi chap tomonda joylashadi.', en: "Check the group boundary. Thousands group is on the left." },
  }),
  p2: makeMicroPractice({
    eyebrow: { ru: 'Практика 2', uz: '2-mashq', en: "Practice 2" },
    title: { ru: 'Читаем группами', uz: 'Guruhlar bilan o\'qiymiz', en: "Reading in groups" },
    lead: { ru: 'Внутренние нули сохраняют разряды.', uz: 'Ichki nollar xonalarni saqlaydi.', en: "The inner zeros keep the places." },
    instruction: { ru: 'Как правильно прочитать 402 018?', uz: '402 018 soni qanday to\'g\'ri o\'qiladi?', en: "How to read 402,018 correctly?" },
    options: [{ ru: 'четыреста две тысячи восемнадцать', uz: 'to\'rt yuz ikki ming o\'n sakkiz', en: "four hundred and two thousand eighteen" }, { ru: 'сорок две тысячи сто восемь', uz: 'qirq ikki ming bir yuz sakkiz', en: "forty-two hundred eight" }, { ru: 'четыре ноль две тысячи ноль один восемь', uz: 'to\'rt nol ikki ming nol bir sakkiz', en: "four zeros two thousand zeros one eight" }],
    correctIndex: 0,
    correctText: { ru: 'Каждая тройка прочитана как целое число, а класс тысяч назван после левой группы.', uz: 'Har bir uchlik yaxlit son sifatida o\'qildi va chap guruhdan keyin ming so\'zi aytildi.', en: "Each three is read as an integer, and the thousands group is named after the left group." },
    wrong: [null, { ru: 'Так нули исчезают и разряды сдвигаются.', uz: 'Bunday o\'qishda nollar yo\'qolib, xonalar siljiydi.', en: "So the zeros disappear and the places shift." }, { ru: 'Цифры не читают по одной. Каждую тройку читают как число.', uz: 'Raqamlar bittadan o\'qilmaydi. Har bir uchlik son sifatida o\'qiladi.', en: "Numbers don't read one. Every three is read as a number." }],
    audioIntro: { ru: 'Прочитай четыреста две тысячи восемнадцать по двум классам. Выбери точную запись словами.', uz: 'To\'rt yuz ikki ming o\'n sakkiz sonini ikki sinf bo\'yicha o\'qing. Aniq yozuvni tanlang.', en: "Read four hundred and two thousand and eighteen in two groups. Choose the exact words." },
    correctAudio: { ru: 'Верно. Сначала читается класс тысяч, затем класс единиц.', uz: 'To\'g\'ri. Avval minglar sinfi, keyin birlar sinfi o\'qiladi.', en: "Right. First you read the thousands group, then the ones group." },
    wrongAudio: { ru: 'Прочитай каждую группу целиком и сохрани пустые разряды.', uz: 'Har bir guruhni yaxlit o\'qing va bo\'sh xonalarni saqlang.', en: "Read each group in its entirety and keep the empty places." },
  }),
  p3: makeMicroPractice({
    eyebrow: { ru: 'Практика 3', uz: '3-mashq', en: "Practice 3" },
    title: { ru: 'Записываем услышанное', uz: 'Eshitilgan sonni yozamiz', en: "Write what you heard" },
    lead: { ru: 'Правый класс всегда занимает три места.', uz: 'O\'ng sinf doim uchta o\'rinni egallaydi.', en: "The right-hand group always takes three places." },
    instruction: { ru: 'Как записать «двести четырнадцать тысяч семьдесят»?', uz: 'Ikki yuz o\'n to\'rt ming yetmish qanday yoziladi?', en: "How do you write “two hundred and fourteen thousand seventy”?" },
    options: ['214 070', '214 700', '214 007'],
    correctIndex: 0,
    correctText: { ru: 'В классе единиц нет сотен, поэтому перед 70 нужен ноль.', uz: 'Birlar sinfida yuzlik yo\'q, shuning uchun 70 oldiga nol yoziladi.', en: "There are no hundreds in a group, so you need zero before 70." },
    wrong: [null, { ru: '700 означает семь сотен, а нужно семь десятков.', uz: '700 yetti yuzni bildiradi, yetti o\'nlik kerak.', en: "700 means seven hundred, and you need seven tens." }, { ru: '007 означает семь единиц, а нужно семьдесят.', uz: '007 yetti birlikni bildiradi, yetmish kerak.', en: "007 means seven units, and seventy are needed." }],
    audioIntro: { ru: 'Запиши двести четырнадцать тысяч семьдесят. Сохрани три места в правом классе.', uz: 'Ikki yuz o\'n to\'rt ming yetmish sonini yozing. O\'ng sinfdagi uchta o\'rinni saqlang.', en: "Write down two hundred and fourteen thousand seventy, save three places in the group on the right." },
    correctAudio: { ru: 'Верно. Ноль сохраняет пустое место сотен в правом классе.', uz: 'To\'g\'ri. Nol o\'ng sinfdagi bo\'sh yuzlar o\'rnini saqlaydi.', en: "That's right. Zero saves the empty space of hundreds in the group on the right." },
    wrongAudio: { ru: 'Проверь сотни, десятки и единицы правого класса.', uz: 'O\'ng sinfdagi yuzlar, o\'nlar va birlarni tekshiring.', en: "Check hundreds, tens and ones in the right-hand group." },
  }),
  p4: makeMicroPractice({
    eyebrow: { ru: 'Практика 4', uz: '4-mashq', en: "Practice 4" },
    title: { ru: 'Сохраняем внутренний ноль', uz: 'Ichki nolni saqlaymiz', en: "Keeping the inner zero." },
    lead: { ru: 'Ноль удерживает пустой разряд.', uz: 'Nol bo\'sh xonani saqlaydi.', en: "Zero holds the empty place." },
    instruction: { ru: 'В каком разряде стоит цифра 4 в числе 508 040?', uz: '508 040 sonida 4 raqami qaysi xonada turibdi?', en: 'Which place does the digit 4 occupy in 508,040?' },
    options: [{ ru: 'в десятках', uz: 'o\'nlar xonasida', en: 'tens place' }, { ru: 'в сотнях', uz: 'yuzlar xonasida', en: 'hundreds place' }, { ru: 'в единицах', uz: 'birlar xonasida', en: 'ones place' }],
    correctIndex: 0,
    correctText: { ru: 'Справа от 4 стоит ноль единиц, значит 4 занимает разряд десятков.', uz: '4 dan o\'ngda nol birlik turibdi, demak 4 o\'nlar xonasini egallaydi.', en: "To the right of 4 is zero units, so 4 occupies the tens place." },
    wrong: [null, { ru: 'Разряд сотен в правой группе занят нулём.', uz: 'O\'ng guruhdagi yuzlar xonasini nol egallagan.', en: "The hundreds place in the right group is occupied by zero." }, { ru: 'В разряде единиц стоит последний ноль.', uz: 'Birlar xonasida oxirgi nol turibdi.', en: "In the ones place is the last zero." }],
    audioIntro: { ru: 'Определи разряд цифры четыре в числе пятьсот восемь тысяч сорок.', uz: 'Besh yuz sakkiz ming qirq sonida to\'rt raqamining o\'rnini toping.', en: 'Find the place of the digit four in the number five hundred and eight thousand forty.' },
    correctAudio: { ru: 'Верно. Цифра четыре находится в разряде десятков.', uz: 'To\'g\'ri. To\'rt raqami o\'nlar xonasida turibdi.', en: "That's right. The digit four is in the tens place." },
    wrongAudio: { ru: 'Посчитай разряды справа: единицы, затем десятки.', uz: 'Xonalarni o\'ngdan sanang: birlar, keyin o\'nlar.', en: "Count the digits on the right: units, then tens." },
  }),
  p5: makeMicroPractice({
    eyebrow: { ru: 'Практика 5', uz: '5-mashq', en: "Practice 5" },
    title: { ru: 'Собираем число', uz: 'Sonni yig\'amiz', en: "Collect a number." },
    lead: { ru: 'Каждое разрядное слагаемое занимает своё место.', uz: 'Har bir xona qo\'shiluvchisi o\'z o\'rnini egallaydi.', en: "Each piece of content takes its place." },
    instruction: { ru: 'Какое число получится из 300 000 + 4 000 + 20 + 7?', uz: '300 000 + 4 000 + 20 + 7 yig\'indisidan qaysi son hosil bo\'ladi?', en: "What number will you get from 300,000 + 4,000 + 20 + 7?" },
    options: ['304 027', '340 027', '304 207'],
    correctIndex: 0,
    correctText: { ru: 'Пустые десятки тысяч и сотни единиц сохранены нулями: 304 027.', uz: 'Bo\'sh o\'n mingliklar va yuzliklar nol bilan saqlandi: 304 027.', en: "The empty tens of thousands and hundreds of units are saved by zeros: 304,027." },
    wrong: [null, { ru: 'Цифра 4 сдвинулась в десятки тысяч.', uz: '4 raqami o\'n mingliklar xonasiga siljigan.', en: "The digit 4 has moved into the ten-thousands place." }, { ru: 'Две десятки превратились в две сотни.', uz: 'Ikki o\'nlik ikki yuzlikka aylangan.', en: "Two tens turned into two hundred." }],
    audioIntro: { ru: 'Собери число из трёхсот тысяч, четырёх тысяч, двух десятков и семи единиц.', uz: 'Uch yuz ming, to\'rt ming, ikki o\'nlik va yetti birlikdan son tuzing.', en: "Collect a number of three hundred thousand, four thousand, two tens and seven units." },
    correctAudio: { ru: 'Верно. Пустые разряды сохранены нулями.', uz: 'To\'g\'ri. Bo\'sh xonalar nollar bilan saqlandi.', en: "That's right. Empty places are saved by zeros." },
    wrongAudio: { ru: 'Проверь место каждого ненулевого разрядного слагаемого.', uz: 'Har bir noldan farqli xona qo\'shiluvchisining o\'rnini tekshiring.', en: "Check the location of each non-zero place-value component." },
  }),
  p6: makeMicroPractice({
    eyebrow: { ru: 'Практика 6', uz: '6-mashq', en: "Practice 6" },
    title: { ru: 'Проверяем обратным чтением', uz: 'Qayta o\'qib tekshiramiz', en: "Checking back with reverse reading" },
    lead: { ru: 'Запись должна совпасть с исходным названием.', uz: 'Yozuv boshlang\'ich nom bilan mos kelishi kerak.', en: "The notation must match the original wording." },
    instruction: { ru: 'Какая запись соответствует словам «восемьдесят одна тысяча сорок»?', uz: 'Sakson bir ming qirq so\'zlariga qaysi yozuv mos keladi?', en: "Which entry corresponds to the words “eighty-one thousand and forty”?" },
    options: ['81 040', '810 040', '81 400'],
    correctIndex: 0,
    correctText: { ru: '81 040 читается как восемьдесят одна тысяча сорок.', uz: '81 040 soni sakson bir ming qirq deb o\'qiladi.', en: "81,040 reads as eighty-one thousand forty." },
    wrong: [null, { ru: '810 040 — это восемьсот десять тысяч сорок.', uz: '810 040 sakkiz yuz o\'n ming qirq bo\'ladi.', en: "810,040 is eight hundred and ten thousand forty." }, { ru: '81 400 — это восемьдесят одна тысяча четыреста.', uz: '81 400 sakson bir ming to\'rt yuz bo\'ladi.', en: "81,400 is eighty-one thousand four hundred." }],
    audioIntro: { ru: 'Выбери запись для слов восемьдесят одна тысяча сорок и затем прочитай её обратно.', uz: 'Sakson bir ming qirq so\'zlariga mos yozuvni tanlang va uni qayta o\'qing.', en: "Choose an entry for the words eighty-one thousand and forty and then read it back." },
    correctAudio: { ru: 'Верно. Обратное чтение полностью совпало с исходным названием.', uz: 'To\'g\'ri. Qayta o\'qish boshlang\'ich nom bilan to\'liq mos keldi.', en: "That's right. The reverse reading is exactly the same as the original title." },
    wrongAudio: { ru: 'Прочитай выбранную запись по классам и сравни с исходными словами.', uz: 'Tanlangan yozuvni sinflar bo\'yicha o\'qing va boshlang\'ich so\'zlar bilan solishtiring.', en: "Read the selected entry by group and compare it with the original words." },
  }),
};

// Reviewed revision package for slides 2-6 and 12-15. The original CONTENT
// entries stay intact as migration history; active screens read this package.
const D2_REVISION_CONTENT = {
  foundation: {
    eyebrow: { ru: 'Разряды и классы', uz: 'Xonalar va sinflar', en: 'Places and groups' },
    title: { ru: 'Разберём число 304 018', uz: '304 018 sonini tahlil qilamiz', en: 'Explore the number 304 018' },
    lead: {
      ru: 'Каждая цифра занимает своё место, а две тройки образуют два класса.',
      uz: 'Har bir raqam o\'z xonasini egallaydi, ikkita uchlik esa ikkita sinfni hosil qiladi.',
      en: 'Each digit has its own place, and the two groups of three form two place-value groups.',
    },
    number: '304 018',
    digits: ['3', '0', '4', '0', '1', '8'],
    placeLabels: [
      { ru: 'сотни тысяч', uz: 'yuz minglar', en: 'hundred-thousands' },
      { ru: 'десятки тысяч', uz: 'o\'n minglar', en: 'ten-thousands' },
      { ru: 'тысячи', uz: 'minglar', en: 'thousands' },
      { ru: 'сотни', uz: 'yuzlar', en: 'hundreds' },
      { ru: 'десятки', uz: 'o\'nlar', en: 'tens' },
      { ru: 'единицы', uz: 'birlar', en: 'ones' },
    ],
    classLabels: [
      { ru: 'класс тысяч', uz: 'minglar sinfi', en: 'thousands group' },
      { ru: 'класс единиц', uz: 'birlar sinfi', en: 'ones group' },
    ],
    captions: [
      { ru: 'В числе два класса по три разряда.', uz: 'Sonda uchtadan xonali ikkita sinf bor.', en: 'The number has two groups of three places.' },
      { ru: '3 стоит в разряде сотен тысяч.', uz: '3 raqami yuz minglar xonasida turibdi.', en: '3 is in the hundred-thousands place.' },
      { ru: '0 сохраняет место десятков тысяч.', uz: '0 o\'n minglar xonasini saqlaydi.', en: '0 holds the ten-thousands place.' },
      { ru: '4 обозначает тысячи. Группа 304 читается как триста четыре тысячи.', uz: '4 minglar xonasida. 304 guruhi uch yuz to\'rt ming deb o\'qiladi.', en: '4 is in the thousands place. The group 304 is read as three hundred and four thousand.' },
      { ru: '0 сохраняет место сотен в классе единиц.', uz: '0 birlar sinfidagi yuzlar xonasini saqlaydi.', en: '0 holds the hundreds place in the ones group.' },
      { ru: '1 стоит в разряде десятков.', uz: '1 raqami o\'nlar xonasida turibdi.', en: '1 is in the tens place.' },
      { ru: '8 стоит в единицах. Всё число читается как триста четыре тысячи восемнадцать.', uz: '8 birlar xonasida. Son uch yuz to\'rt ming o\'n sakkiz deb o\'qiladi.', en: '8 is in the ones place. The full number is read as three hundred and four thousand eighteen.' },
    ],
    audio: {
      ru: [
        'Посмотрим на число триста четыре тысячи восемнадцать. В нём два класса, и в каждом классе по три разряда.',
        'Начинаем слева. Цифра три стоит в разряде сотен тысяч и обозначает триста тысяч.',
        'Следующая цифра ноль сохраняет пустой разряд десятков тысяч. Отдельно этот ноль не произносится.',
        'Цифра четыре стоит в разряде тысяч. Поэтому первая группа читается как триста четыре тысячи.',
        'Переходим к классу единиц. Первый ноль сохраняет пустой разряд сотен.',
        'Цифра один стоит в разряде десятков и вместе со следующей цифрой образует восемнадцать.',
        'Цифра восемь стоит в единицах. Полностью число читается так: триста четыре тысячи восемнадцать.',
      ],
      uz: [
        'Uch yuz to\'rt ming o\'n sakkiz soniga qaraymiz. Unda ikkita sinf bor, har bir sinfda uchtadan xona mavjud.',
        'Chapdan boshlaymiz. Uch raqami yuz minglar xonasida turadi va uch yuz mingni bildiradi.',
        'Keyingi nol o\'n minglar xonasidagi bo\'sh o\'rinni saqlaydi. Bu nol alohida aytilmaydi.',
        'To\'rt raqami minglar xonasida turadi. Shuning uchun birinchi guruh uch yuz to\'rt ming deb o\'qiladi.',
        'Endi birlar sinfiga o\'tamiz. Birinchi nol yuzlar xonasidagi bo\'sh o\'rinni saqlaydi.',
        'Bir raqami o\'nlar xonasida turadi va keyingi raqam bilan o\'n sakkiz sonini hosil qiladi.',
        'Sakkiz raqami birlar xonasida turadi. Son to\'liq uch yuz to\'rt ming o\'n sakkiz deb o\'qiladi.',
      ],
      en: [
        'Look at the number three hundred and four thousand eighteen. It has two groups, with three places in each group.',
        'Start on the left. The digit three is in the hundred-thousands place and represents three hundred thousand.',
        'The next digit is zero. It holds the empty ten-thousands place, but we do not say this zero separately.',
        'The digit four is in the thousands place. The first group is read as three hundred and four thousand.',
        'Now move to the ones group. The first zero holds the empty hundreds place.',
        'The digit one is in the tens place and joins the next digit to make eighteen.',
        'The digit eight is in the ones place. The full number is read as three hundred and four thousand eighteen.',
      ],
    },
  },
  zeroReading: {
    eyebrow: { ru: 'Ноль внутри числа', uz: 'Son ichidagi nol', en: 'Zero inside a number' },
    title: { ru: 'Как прочитать 508 040', uz: '508 040 qanday o\'qiladi', en: 'How to read 508 040' },
    lead: {
      ru: 'Нули сохраняют пустые разряды, но отдельно не произносятся.',
      uz: 'Nollar bo\'sh xonalarni saqlaydi, ammo alohida aytilmaydi.',
      en: 'Zeros hold empty places, but they are not spoken separately.',
    },
    number: '508 040',
    digits: ['5', '0', '8', '0', '4', '0'],
    placeLabels: [
      { ru: 'сотни тысяч', uz: 'yuz minglar', en: 'hundred-thousands' },
      { ru: 'десятки тысяч', uz: 'o\'n minglar', en: 'ten-thousands' },
      { ru: 'тысячи', uz: 'minglar', en: 'thousands' },
      { ru: 'сотни', uz: 'yuzlar', en: 'hundreds' },
      { ru: 'десятки', uz: 'o\'nlar', en: 'tens' },
      { ru: 'единицы', uz: 'birlar', en: 'ones' },
    ],
    classLabels: [
      { ru: 'класс тысяч', uz: 'minglar sinfi', en: 'thousands group' },
      { ru: 'класс единиц', uz: 'birlar sinfi', en: 'ones group' },
    ],
    captions: [
      { ru: 'Сначала сохраняем все шесть разрядов.', uz: 'Avval oltita xonaning barchasini saqlaymiz.', en: 'First, keep all six places.' },
      { ru: '5 обозначает сотни тысяч.', uz: '5 yuz minglarni bildiradi.', en: '5 represents hundred-thousands.' },
      { ru: '0 держит место десятков тысяч и не читается отдельно.', uz: '0 o\'n minglar xonasini saqlaydi va alohida o\'qilmaydi.', en: '0 holds the ten-thousands place and is not spoken separately.' },
      { ru: '8 обозначает тысячи. Получается пятьсот восемь тысяч.', uz: '8 minglarni bildiradi. Besh yuz sakkiz ming hosil bo\'ladi.', en: '8 represents thousands. This gives five hundred and eight thousand.' },
      { ru: '0 показывает, что сотен в правой группе нет.', uz: '0 o\'ng guruhda yuzlik yo\'qligini ko\'rsatadi.', en: '0 shows that there are no hundreds in the right-hand group.' },
      { ru: '4 стоит в десятках и читается как сорок.', uz: '4 o\'nlar xonasida turadi va qirq deb o\'qiladi.', en: '4 is in the tens place and is read as forty.' },
      { ru: 'Последний 0 держит место единиц. Всё число: пятьсот восемь тысяч сорок.', uz: 'Oxirgi 0 birlar xonasini saqlaydi. Son: besh yuz sakkiz ming qirq.', en: 'The final 0 holds the ones place. The full number is five hundred and eight thousand forty.' },
    ],
    audio: {
      ru: [
        'Разберём число пятьсот восемь тысяч сорок. Сохраняем все шесть разрядов и читаем число по классам.',
        'Цифра пять стоит в разряде сотен тысяч и обозначает пятьсот тысяч.',
        'Ноль сохраняет пустой разряд десятков тысяч. Отдельно этот ноль не произносится.',
        'Цифра восемь стоит в разряде тысяч. Левая группа читается как пятьсот восемь тысяч.',
        'В правой группе первый ноль показывает, что сотен нет. Он сохраняет место сотен.',
        'Цифра четыре стоит в десятках. Поэтому правая группа читается как сорок.',
        'Последний ноль сохраняет место единиц. Полностью число читается так: пятьсот восемь тысяч сорок.',
      ],
      uz: [
        'Besh yuz sakkiz ming qirq sonini tahlil qilamiz. Oltita xonani saqlab, sonni sinflar bo\'yicha o\'qiymiz.',
        'Besh raqami yuz minglar xonasida turadi va besh yuz mingni bildiradi.',
        'Nol o\'n minglar xonasidagi bo\'sh o\'rinni saqlaydi. Bu nol alohida aytilmaydi.',
        'Sakkiz raqami minglar xonasida turadi. Chap guruh besh yuz sakkiz ming deb o\'qiladi.',
        'O\'ng guruhdagi birinchi nol yuzlik yo\'qligini ko\'rsatib, yuzlar xonasini saqlaydi.',
        'To\'rt raqami o\'nlar xonasida turadi. Shuning uchun o\'ng guruh qirq deb o\'qiladi.',
        'Oxirgi nol birlar xonasini saqlaydi. Son to\'liq besh yuz sakkiz ming qirq deb o\'qiladi.',
      ],
      en: [
        'Explore the number five hundred and eight thousand forty. Keep all six places and read the number group by group.',
        'The digit five is in the hundred-thousands place and represents five hundred thousand.',
        'Zero holds the empty ten-thousands place. We do not say this zero separately.',
        'The digit eight is in the thousands place. The left group is read as five hundred and eight thousand.',
        'In the right-hand group, the first zero shows that there are no hundreds and holds that place.',
        'The digit four is in the tens place. The right-hand group is therefore read as forty.',
        'The final zero holds the ones place. The full number is read as five hundred and eight thousand forty.',
      ],
    },
  },
  p1: { ...PRACTICE_CONTENT.p1, displayNumber: '304 018' },
  p2: { ...PRACTICE_CONTENT.p2, displayNumber: '402 018' },
  builder: {
    eyebrow: { ru: 'Слушаем и строим', uz: 'Eshitamiz va yasaymiz', en: 'Listen and build' },
    title: { ru: 'От названия к записи', uz: 'Aytilishidan yozuviga', en: 'From spoken form to notation' },
    lead: {
      ru: 'Сначала разберём пример, затем соберём новое число из шести цифр.',
      uz: 'Avval misolni tahlil qilamiz, keyin oltita raqamdan yangi son yasaymiz.',
      en: 'First, explore an example. Then build a new number from six digits.',
    },
    guidedNumber: '734 058',
    guidedDigits: ['7', '3', '4', '0', '5', '8'],
    guidedCaption: {
      ru: 'В правой группе не названы сотни, поэтому перед 58 ставим 0.',
      uz: 'O\'ng guruhda yuzlik aytilmagan, shuning uchun 58 oldiga 0 qo\'yamiz.',
      en: 'No hundreds are spoken in the right-hand group, so place 0 before 58.',
    },
    prompt: {
      ru: 'Теперь послушай и собери число из шести цифр.',
      uz: 'Endi eshitib, sonni oltita raqamdan yasang.',
      en: 'Now listen and build the six-digit number.',
    },
    classLabels: [
      { ru: 'класс тысяч', uz: 'minglar sinfi', en: 'thousands group' },
      { ru: 'класс единиц', uz: 'birlar sinfi', en: 'ones group' },
    ],
    targetDigits: ['1', '0', '9', '7', '6', '2'],
    trayDigits: ['7', '1', '2', '0', '6', '9'],
    doneText: {
      ru: 'Получилось 109 762. Оба класса заполнены точно.',
      uz: '109 762 hosil bo\'ldi. Ikkala sinf ham aniq to\'ldirildi.',
      en: 'You built 109 762. Both groups are complete and accurate.',
    },
    hint: {
      ru: 'Прочитай собранное число слева направо и сравни с тем, что услышал.',
      uz: 'Yig\'ilgan sonni chapdan o\'ngga o\'qib, eshitganingiz bilan solishtiring.',
      en: 'Read the number you built from left to right and compare it with what you heard.',
    },
    audio: {
      guided: {
        ru: [
          'Сначала разберём число семьсот тридцать четыре тысячи пятьдесят восемь. Левая группа даёт цифры семь, три и четыре.',
          'В правой группе слышим пятьдесят восемь. Сотни не названы, поэтому перед цифрами пять и восемь ставим ноль. Получается семьсот тридцать четыре тысячи пятьдесят восемь.',
        ],
        uz: [
          'Avval yetti yuz o\'ttiz to\'rt ming ellik sakkiz sonini tahlil qilamiz. Chap guruh yetti, uch va to\'rt raqamlarini beradi.',
          'O\'ng guruhda ellik sakkiz aytilgan. Yuzlik aytilmagani uchun besh va sakkiz oldiga nol qo\'yamiz. Yetti yuz o\'ttiz to\'rt ming ellik sakkiz hosil bo\'ladi.',
        ],
        en: [
          'First, explore the number seven hundred and thirty-four thousand fifty-eight. The left group gives the digits seven, three and four.',
          'In the right-hand group we hear fifty-eight. No hundreds are spoken, so place zero before five and eight. This gives seven hundred and thirty-four thousand fifty-eight.',
        ],
      },
      builder: {
        ru: ['Теперь послушай новое число: сто девять тысяч семьсот шестьдесят два. Расставь шесть цифр по своим местам.'],
        uz: ['Endi yangi sonni tinglang: bir yuz to\'qqiz ming yetti yuz oltmish ikki. Oltita raqamni o\'z joyiga qo\'ying.'],
        en: ['Now listen to the new number: one hundred and nine thousand seven hundred and sixty-two. Put the six digits in their correct places.'],
      },
      on_correct: {
        ru: 'Запись сто девять тысяч семьсот шестьдесят два собрана верно.',
        uz: 'Bir yuz to\'qqiz ming yetti yuz oltmish ikki soni to\'g\'ri yasaldi.',
        en: 'One hundred and nine thousand seven hundred and sixty-two has been built correctly.',
      },
      on_wrong: {
        ru: 'Проверь сначала класс тысяч, затем три места класса единиц.',
        uz: 'Avval minglar sinfini, keyin birlar sinfining uchta xonasini tekshiring.',
        en: 'Check the thousands group first, then the three places in the ones group.',
      },
    },
  },
  strategyBuilder: {
    eyebrow: { ru: 'Собери проверку', uz: 'Tekshiruvni yig\'ing', en: 'Build the checking rule' },
    title: { ru: 'Восстанови правильный порядок действий', uz: 'Harakatlarni to\'g\'ri tartibda joylashtiring', en: 'Put the checking steps in order' },
    lead: {
      ru: 'Нажимай на фрагменты, чтобы собрать надёжную проверку записи.',
      uz: 'Yozuvni ishonchli tekshirish uchun bo\'laklarni bosing.',
      en: 'Select the fragments to build a reliable way to check the notation.',
    },
    fragments: {
      uz: ['Sonni', 'sinflarga ajrating', 'qayta o\'qing', 'va', 'shart bilan solishtiring'],
      ru: ['Раздели число', 'на классы', 'прочитай обратно', 'и', 'сверь с условием'],
      en: ['Divide the number', 'into groups', 'read it back', 'and', 'compare with the prompt'],
    },
    rule: {
      ru: 'Раздели число на классы, прочитай обратно и сверь с условием.',
      uz: 'Sonni sinflarga ajrating, qayta o\'qing va shart bilan solishtiring.',
      en: 'Divide the number into groups, read it back and compare with the prompt.',
    },
    audio: {
      intro: {
        ru: ['Собери короткую проверку из пяти частей. Сначала раздели число на классы, затем прочитай его обратно и сравни с условием.'],
        uz: ['Besh bo\'lakdan qisqa tekshiruv tuzing. Avval sonni sinflarga ajrating, keyin qayta o\'qib, shart bilan solishtiring.'],
        en: ['Build the short checking rule from five fragments. First divide the number into groups, then read it back and compare it with the prompt.'],
      },
      on_correct: { ru: 'Порядок действий собран верно.', uz: 'Harakatlar tartibi to\'g\'ri yig\'ildi.', en: 'The checking steps are in the correct order.' },
      on_wrong: { ru: 'Начни с числа и деления на классы. Сравнение выполняется последним.', uz: 'Son va sinflarga ajratishdan boshlang. Solishtirish oxirida bajariladi.', en: 'Start with the number and divide it into groups. The comparison comes last.' },
    },
  },
  readingMatch: {
    eyebrow: { ru: 'Соедини пары', uz: 'Juftliklarni ulang', en: 'Match the pairs' },
    title: { ru: 'Число и его чтение', uz: 'Son va uning o\'qilishi', en: 'Match each number to its reading' },
    lead: {
      ru: 'Соедини каждую цифровую запись с точным чтением.',
      uz: 'Har bir raqamli yozuvni uning aniq o\'qilishi bilan ulang.',
      en: 'Connect each numeral to its exact reading.',
    },
    pairs: [
      { id: '7034', number: '7 034', reading: { ru: 'семь тысяч тридцать четыре', uz: 'yetti ming o\'ttiz to\'rt', en: 'seven thousand thirty-four' } },
      { id: '7304', number: '7 304', reading: { ru: 'семь тысяч триста четыре', uz: 'yetti ming uch yuz to\'rt', en: 'seven thousand three hundred and four' } },
      { id: '7340', number: '7 340', reading: { ru: 'семь тысяч триста сорок', uz: 'yetti ming uch yuz qirq', en: 'seven thousand three hundred and forty' } },
    ],
    rightOrder: ['7340', '7034', '7304'],
    doneText: { ru: 'Все три числа соединены с точным чтением.', uz: 'Uchala son ham aniq o\'qilishi bilan ulandi.', en: 'All three numbers are matched to their exact readings.' },
    hint: { ru: 'Проверь сотни, десятки и единицы в правой группе.', uz: 'O\'ng guruhdagi yuzlar, o\'nlar va birlarni tekshiring.', en: 'Check the hundreds, tens and ones in the right-hand group.' },
    audio: {
      intro: {
        ru: ['Слева записаны три похожих числа. Справа даны их чтения. Соедини каждое число с точным чтением.'],
        uz: ['Chap tomonda uchta o\'xshash son yozilgan. O\'ng tomonda ularning o\'qilishi berilgan. Har bir sonni to\'g\'ri o\'qilishi bilan ulang.'],
        en: ['Three similar numbers are shown on the left, with their readings on the right. Match each number to its exact reading.'],
      },
      pair_correct: { ru: 'Эта пара составлена верно.', uz: 'Bu juftlik to\'g\'ri tuzildi.', en: 'This pair is correct.' },
      on_correct: { ru: 'Все три пары составлены верно.', uz: 'Uchala juftlik ham to\'g\'ri tuzildi.', en: 'All three pairs are correct.' },
      on_wrong: { ru: 'Прочитай правую группу ещё раз и проверь место каждой цифры.', uz: 'O\'ng guruhni yana o\'qib, har bir raqam o\'rnini tekshiring.', en: 'Read the right-hand group again and check the place of each digit.' },
    },
  },
  s14: {
    eyebrow: { ru: 'Итоговая проверка', uz: 'Yakuniy tekshiruv', en: 'Final check' },
    title: { ru: 'Запиши услышанное число', uz: 'Eshitilgan sonni yozing', en: 'Write the number you hear' },
    lead: { ru: 'Нули сохраняют пустые разряды внутри обоих классов.', uz: 'Nollar ikkala sinf ichidagi bo\'sh xonalarni saqlaydi.', en: 'Zeros hold empty places inside both groups.' },
    instruction: { ru: 'Какая запись соответствует услышанному числу?', uz: 'Eshitilgan songa qaysi yozuv mos keladi?', en: 'Which notation matches the spoken number?' },
    promptFrame: { ru: 'шестьсот двадцать тысяч пять', uz: 'olti yuz yigirma ming besh', en: 'six hundred and twenty thousand five' },
    options: ['620 005', '620 050', '602 005', '62 005'],
    correctIndex: 0,
    correctText: { ru: '620 005: в правой группе нет сотен и десятков, поэтому перед 5 стоят два нуля.', uz: '620 005: o\'ng guruhda yuzlik va o\'nlik yo\'q, shuning uchun 5 oldida ikkita nol turadi.', en: '620 005: there are no hundreds or tens in the right-hand group, so two zeros come before 5.' },
    wrong: [
      null,
      { ru: '620 050 читается как шестьсот двадцать тысяч пятьдесят. Цифра 5 стоит в десятках.', uz: '620 050 olti yuz yigirma ming ellik deb o\'qiladi. 5 o\'nlar xonasida turibdi.', en: '620 050 is read as six hundred and twenty thousand fifty. The digit 5 is in the tens place.' },
      { ru: 'В классе тысяч названы шестьсот двадцать, а не шестьсот два. Проверь среднюю цифру слева.', uz: 'Minglar sinfida olti yuz yigirma aytilgan, olti yuz ikki emas. Chap guruhdagi o\'rta raqamni tekshiring.', en: 'The thousands group is six hundred and twenty, not six hundred and two. Check the middle digit on the left.' },
      { ru: 'Запись 62 005 означает шестьдесят две тысячи пять. В классе тысяч потерян ноль.', uz: '62 005 oltmish ikki ming beshni bildiradi. Minglar sinfida nol tushib qolgan.', en: '62 005 means sixty-two thousand five. A zero is missing from the thousands group.' },
    ],
    audio: {
      intro: { ru: ['Послушай число: шестьсот двадцать тысяч пять. Выбери запись, которая сохраняет все разряды.'], uz: ['Sonni tinglang: olti yuz yigirma ming besh. Barcha xonalarni saqlagan yozuvni tanlang.'], en: ['Listen to the number: six hundred and twenty thousand five. Choose the notation that keeps every place.'] },
      on_correct: { ru: 'Верно. Два нуля сохраняют сотни и десятки в правой группе.', uz: 'To\'g\'ri. Ikkita nol o\'ng guruhdagi yuzlar va o\'nlar xonasini saqlaydi.', en: 'Correct. Two zeros hold the hundreds and tens places in the right-hand group.' },
      on_wrong: [
        null,
        { ru: 'В условии названы пять единиц, а не пять десятков.', uz: 'Shartda beshta birlik aytilgan, beshta o\'nlik emas.', en: 'The prompt names five ones, not five tens.' },
        { ru: 'Проверь класс тысяч. Он должен обозначать шестьсот двадцать тысяч.', uz: 'Minglar sinfini tekshiring. U olti yuz yigirma mingni bildirishi kerak.', en: 'Check the thousands group. It must represent six hundred and twenty thousand.' },
        { ru: 'Не сокращай класс тысяч. Сохрани все три цифры слева.', uz: 'Minglar sinfini qisqartirmang. Chapdagi uchta raqamni saqlang.', en: 'Do not shorten the thousands group. Keep all three digits on the left.' },
      ],
    },
  },
  finale: {
    ...CONTENT.s15,
    audio: {
      intro: {
        ru: [
          'Голосовой адрес восстановлен. Теперь соберём точный способ чтения и записи в три последовательных шага.',
          'Первый шаг. Разделяй число справа на группы по три цифры. Так становятся видны классы.',
          'Второй шаг. Читай классы слева направо как целые числа и называй класс тысяч после левой группы.',
          'Третий шаг. Сохраняй внутренние нули и проверяй запись обратным чтением.',
        ],
        uz: [
          'Ovozli manzil tiklandi. Endi sonni o\'qish va yozishning aniq usulini uchta ketma-ket qadamga yig\'amiz.',
          'Birinchi qadam. Sonni o\'ngdan uchtadan raqamga ajrating. Shunda sinflar aniq ko\'rinadi.',
          'Ikkinchi qadam. Sinflarni chapdan o\'ngga yaxlit son sifatida o\'qing va chap guruhdan keyin ming so\'zini ayting.',
          'Uchinchi qadam. Ichki nollarni saqlang va yozuvni qayta o\'qib tekshiring.',
        ],
        en: [
          'The voice address has been restored. Now collect the exact reading and writing method into three clear steps.',
          'Step one. Separate the number into groups of three digits, starting from the right, so the groups become clear.',
          'Step two. Read the groups from left to right as whole numbers and name the thousands group after the left group.',
          'Step three. Keep internal zeros and check the notation by reading the number back.',
        ],
      },
      on_correct: {
        ru: 'Все три шага работают вместе. Адрес можно читать, записывать и проверять без потерь.',
        uz: 'Uchala qadam birga ishlaydi. Manzilni yo\'qotishsiz o\'qish, yozish va tekshirish mumkin.',
        en: 'All three steps work together, so the address can be read, written and checked without loss.',
      },
    },
  },
};

const SCREEN_META = [
  { id: 's0', contentKey: 's0', type: 'hook', subtype: 'story-decision', template: 'StoryChoice', mechanic: 'StoryChoice', goal: 'Choose how to preserve a spoken code', misconceptions: ['zero removal', 'pair grouping'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', contentKey: 'foundation', type: 'exploration', subtype: 'foundation-to-classes', template: 'AudioSequence', mechanic: 'AudioSequence', goal: 'Connect digits, places and class reading', misconceptions: ['grouping from the left'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's2', contentKey: 'p1', type: 'test', subtype: 'class-groups-check', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Identify the thousands class', misconceptions: ['right class selected'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's3', contentKey: 'zeroReading', type: 'exploration', subtype: 'reading-zero-models', template: 'AudioSequence', mechanic: 'AudioSequence', goal: 'Explain how internal zeros affect reading', misconceptions: ['digit-by-digit reading', 'zeros dropped'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's4', contentKey: 'p2', type: 'test', subtype: 'class-reading-check', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Read a number by classes', misconceptions: ['zeros dropped'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's5', contentKey: 'builder', type: 'exploration', subtype: 'inverse-reading-writing', template: 'DigitBuilder', mechanic: 'DigitBuilder', goal: 'Move from a guided spoken number to independent construction', misconceptions: ['right group not padded'], active: true, scored: false, scope: null, resetOnReturn: false },
  { id: 's6', contentKey: 'p3', type: 'test', subtype: 'spoken-to-written-check', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Write a spoken number', misconceptions: ['place shift'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's7', contentKey: 's7', type: 'practice', subtype: 'short-left-class-input', template: 'NumInputScreen', mechanic: 'NumInputScreen', goal: 'Write a code whose leftmost class is short', misconceptions: ['right class not padded'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's8', contentKey: 'p4', type: 'test', subtype: 'internal-zero-check', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Preserve an internal zero', misconceptions: ['wrong place'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's9', contentKey: 's18', type: 'rule', subtype: 'city-code-rule-lab', template: 'DictationTabs', mechanic: 'DictationTabs', goal: 'Formulate and apply the read-write-recheck rule after discovery', misconceptions: ['partial checking'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's10', contentKey: 'p5', type: 'test', subtype: 'reconstruction-check', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Reconstruct a number', misconceptions: ['place shift'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's11', contentKey: 'strategyBuilder', type: 'practice', subtype: 'strategy-builder', template: 'RuleBuilder', mechanic: 'RuleBuilder', goal: 'Assemble a reliable reverse-check strategy', misconceptions: ['step order changed'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's12', contentKey: 'readingMatch', type: 'practice', subtype: 'reading-error-matching', template: 'MatchingBoard', mechanic: 'MatchingBoard', goal: 'Repair place-value reading errors by matching similar numbers to their exact readings', misconceptions: ['internal zero removed'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's13', contentKey: 's14', type: 'test', subtype: 'city-transfer', template: 'TransferChoice', mechanic: 'TransferChoice', goal: 'Write six hundred and twenty thousand five', misconceptions: ['missing zeros', 'place shift'], active: true, scored: true, scope: 'final' },
  { id: 's14', contentKey: 's15', type: 'summary', subtype: 'reflection-and-title', template: 'ReflectionClaim', mechanic: 'ReflectionClaim', goal: 'Reflect on the strategy and claim the title', misconceptions: ['partial checking'], active: true, scored: false, scope: null },
];

const TOTAL_SCREENS = 15;
const MOBILE_DESIGN_W = 390;
const NOTION_FLOW = SCREEN_META.map((meta, screen) => ({ screen, meta, contentKeys: [meta.contentKey] }));

const LESSON_META = {
  lessonId: 'num-4-02-v1',
  lessonTitle: {
    ru: 'Урок 2. Чтение и запись многозначных чисел',
    uz: "2-dars. Ko'p xonali sonlarni o'qish va yozish",
    en: "Lesson 2: Reading and writing multi-digit numbers",
  },
  skillTags: ['multi_digit_reading', 'multi_digit_writing', 'class_grouping', 'internal_zero', 'reverse_check'],
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
  const localized = audioValue[lang] ?? '';
  const values = Array.isArray(localized) ? localized : [localized];
  return values.filter(Boolean).map((text, index) => ({ id: `${prefix}-${index}`, text }));
};

function useCanAnswer(audio) {
  return audio.muted || audio.completed;
}

function useAdvanceGate(solved, audio) {
  if (!solved) return false;
  if (audio.muted) return true;
  return audio.completed;
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
    <div data-g4-role={correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame'} data-g4-feedback={visible ? (correct ? 'solution' : 'wrong') : undefined} className={`feedback ${visible ? 'feedback-visible' : ''}`} aria-hidden={!visible} aria-live="polite">
      <div className={`feedback-card ${correct ? 'feedback-correct' : 'feedback-hint'}`}>
        <span className="feedback-bit" data-g4-role="feedback-bit" aria-hidden="true">
          <BitSVG state={correct ? 'nod' : 'awkward'} />
        </span>
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

const ModelPanel = ({ model, solved }) => {
  const t = useT();
  if (!model) return null;
  return (
    <div className={`model-panel model-${model.kind} ${solved ? 'model-solved' : ''}`}>
      <div className="model-heading">
        <span>{t(model.badge)}</span>
        {model.kind === 'city' && <i aria-hidden="true">● ● ●</i>}
      </div>
      {model.kind === 'classBoundary' && (
        <div className="class-boundary-model">
          <div className="class-boundary-state boundary-before">
            <span>{model.before}</span>
            <div>
              {model.beforeGroups.map((group, index) => <strong key={`${group}-${index}`}><i>{t(model.labels[index])}</i>{group}</strong>)}
            </div>
          </div>
          <div className="class-boundary-carry" aria-hidden="true"><b>+1</b><span>→</span></div>
          <div className="class-boundary-state boundary-after">
            <span>{model.after}</span>
            <div>
              {model.afterGroups.map((group, index) => <strong key={`${group}-${index}`}><i>{t(model.labels[index])}</i>{group}</strong>)}
            </div>
          </div>
        </div>
      )}
      {model.kind === 'zeroContrast' && (
        <div className="zero-contrast-model">
          {model.cases.map((item, index) => (
            <article style={{ '--model-delay': `${index * 170}ms` }} key={item.number}>
              <div className="zero-contrast-number">{item.groups.map((group, groupIndex) => <strong className={group === '000' ? 'empty-class' : ''} key={`${group}-${groupIndex}`}>{group}</strong>)}</div>
              <p>{t(item.reading)}</p>
              <span>{t(item.note)}</span>
            </article>
          ))}
        </div>
      )}
      {model.number && <div className="model-number">{model.number}</div>}
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
      {model.rows && (
        <div className="model-row-list">
          {model.rows.map((row, index) => (
            <div key={`${row.value}-${index}`}><span>{t(row.label)}</span><strong>{row.value}</strong></div>
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
  const c = D2_REVISION_CONTENT[contentKey] ?? PRACTICE_CONTENT[contentKey] ?? CONTENT[contentKey ?? `s${screen}`];
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
  const isHook = screen === 0;
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

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} hidden={screen === 0} /><NavNext onClick={proceed} disabled={!canAdvance} finish={isFinal} /></>}
    >
      <div className={`screen-stack choice-screen choice-slide-${screen + 1} ${isHook ? 'etalon-hook-screen' : ''}`} data-g4-screen={isHook ? 'hook' : undefined}>
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker" data-g4-role={isHook ? 'hook-topic' : undefined}>LUMO CITY · DATA CENTER</span>
            <h1 data-g4-role={isHook ? 'hook-title' : undefined}>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
        </div>
        {isHook && <h2 className="hook-question-title" data-g4-role="hook-question">{t(c.instruction)}</h2>}
        {isHook ? (
          <section className="hook-story-scene" data-g4-role="hook-scene">
            <div className="hook-story-frame" data-g4-role="visual-frame">
              <div className="hook-story-bit" data-g4-role="hook-bit"><BitSVG state={solved ? 'nod' : picked !== null ? 'awkward' : 'think'} /></div>
              <div className="hook-story-model"><ModelPanel model={c.model} solved={solved} /></div>
            </div>
          </section>
        ) : (
          <>
            {c.displayNumber && <div className="choice-number-frame" aria-label={c.displayNumber}>{c.displayNumber}</div>}
            {c.promptFrame && <div className="choice-prompt-frame">{t(c.promptFrame)}</div>}
            <ModelPanel model={c.model} solved={solved} />
          </>
        )}
        <section className="question-card" aria-labelledby={`question-${screen}`}>
          <div className="question-topline">
            <span>{lang === 'en' ? "YOUR DECISION." : lang === 'ru' ? 'ТВОЁ РЕШЕНИЕ' : 'SIZNING QARORINGIZ'}</span>
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
                  data-g4-role={isHook ? 'answer-card' : undefined}
                  data-g4-branch="choice"
                  data-g4-correct={sourceIndex === c.correctIndex ? 'true' : 'false'}
                  className={`option ${isWrong ? 'option-picked-wrong' : ''} ${isCorrect ? 'option-correct' : ''} ${solved && !isCorrect ? 'option-dismissed' : ''}`}
                  key={`${t(option)}-${sourceIndex}`}
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
            {t(solved ? c.correctText : c.wrong?.[picked])}
          </FeedbackBlock>
          {solved && c.fact && <div className="fact-card"><strong>{lang === 'en' ? "FACT" : lang === 'ru' ? 'ФАКТ' : 'FAKT'}</strong><p>{t(c.fact)}</p></div>}
          {solved && c.bridge && <div className="bridge-card"><span aria-hidden="true">→</span><p>{t(c.bridge)}</p></div>}
        </section>
      </div>
    </Stage>
  );
};

const normalizeNumberEntry = (value) => String(value ?? '').replace(/\s/g, '');

const NumberInputScreen = ({ screen, contentKey, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey ?? `s${screen}`];
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
      <div className={`screen-stack number-input-screen input-slide-${screen + 1}`}>
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DATA CENTER</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
        </div>
        <ModelPanel
          model={{
            ...c.model,
            groups: c.model?.groups?.map((group, index) => (
              index === 1 ? { ...group, value: solved ? '040' : '---' } : group
            )),
          }}
          solved={solved}
        />
        <section className="question-card" aria-labelledby={`question-${screen}`}>
          <div className="question-topline">
            <span>{lang === 'en' ? "ENTER THE NUMBER." : lang === 'ru' ? 'ВВЕДИ ЧИСЛО' : 'SONNI KIRITING'}</span>
            {!canAnswer && <small>{lang === 'en' ? "Listen to the full explanation first" : lang === 'ru' ? 'Сначала дослушай объяснение' : 'Avval tushuntirishni tinglang'}</small>}
          </div>
          <h2 id={`question-${screen}`}>{t(c.instruction)}</h2>
          <div className="number-entry-row">
            <input
              data-qa-answer={runtimeConfig.previewMode ? normalizeNumberEntry(target) : undefined}
              className={`answer-input ${solved ? 'answer-input-correct' : ''}`}
              value={value}
              onChange={(event) => {
                setValue(event.target.value.replace(/[^0-9\s]/g, ''));
                if (!solved) setFeedback(null);
              }}
              onKeyDown={(event) => { if (event.key === 'Enter') submit(); }}
              inputMode="numeric"
              autoComplete="off"
              aria-label={lang === 'en' ? "Numerical response" : lang === 'ru' ? 'Числовой ответ' : 'Son javobi'}
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

const TheoryExplanation = ({ c, label, canAdvance, variant = 'default' }) => {
  const lang = useLang();
  const t = useT();
  return (
    <section className={`theory-callout theory-callout-${variant}`}>
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

const TheoryBody = ({ screen, c, meta, label, canAdvance }) => {
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
        <div className="foundation-recap-strip">
          {(c.model?.columns ?? []).map((column, index) => (
            <div className="foundation-recap-card" style={{ '--theory-delay': `${index * 120}ms` }} key={`${column.value}-${index}`}>
              <span>{t(column.label)}</span><strong>{column.value}</strong>
            </div>
          ))}
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
        <div className="strategy-route">
          {(c.model?.steps ?? []).map((step, index) => (
            <React.Fragment key={`${t(step)}-${index}`}>
              <div className="strategy-route-step" style={{ '--theory-delay': `${index * 140}ms` }}><span>{index + 1}</span><p>{t(step)}</p></div>
              {index < c.model.steps.length - 1 && <i aria-hidden="true">→</i>}
            </React.Fragment>
          ))}
        </div>
        <div className="strategy-contrast-grid">
          <article className="strategy-contrast-reliable">
            <span>{lang === 'en' ? 'RELIABLE CHECK' : lang === 'ru' ? 'НАДЁЖНАЯ ПРОВЕРКА' : 'ISHONCHLI TEKSHIRUV'}</span>
            <strong>{t(c.options[c.correctIndex])}</strong>
            <p>{t(c.correctText)}</p>
          </article>
          <article className="strategy-contrast-trap">
            <span>{lang === 'en' ? 'WHY NOT THE SUM OF THE DIGITS?' : lang === 'ru' ? 'ПОЧЕМУ НЕ СУММА ЦИФР?' : "NEGA YIG'INDI EMAS?"}</span>
            <strong>{t(c.options[1])}</strong>
            <p>{t(c.wrong[1])}</p>
          </article>
        </div>
      </div>
    );
  }

  if (meta.subtype.includes('error')) {
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
          <div className="error-repair-result"><span>{lang === 'en' ? 'correct notation' : lang === 'ru' ? 'верная запись' : "to'g'ri yozuv"}</span><strong>{t(c.options[c.correctIndex]).match(/[0-9 ]+/)?.[0]?.trim() || '72 045'}</strong></div>
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="error" />
      </div>
    );
  }

  if (meta.type === 'summary') {
    return (
      <div className="summary-theory-layout">
        <div className="summary-signal"><BitSVG state="happy" /><strong>{t(c.model?.number)}</strong></div>
        <div className="summary-theory-cards">
          <div><span>01</span><p>{lang === 'en' ? 'Separate the number into groups of three digits, starting from the right.' : lang === 'ru' ? 'Разделяй число справа на группы по три цифры.' : 'Sonni o\'ngdan uchtadan raqamga ajrating.'}</p></div>
          <div><span>02</span><p>{lang === 'en' ? 'Read the groups from left to right as whole numbers.' : lang === 'ru' ? 'Читай классы слева направо целыми группами.' : "Sinflarni chapdan o'ngga yaxlit o'qing."}</p></div>
          <div><span>03</span><p>{lang === 'en' ? 'Keep internal zeros and check by reading the number back.' : lang === 'ru' ? 'Сохраняй внутренние нули и проверяй обратным чтением.' : "Ichki nollarni saqlab, qayta o'qib tekshiring."}</p></div>
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="summary" />
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

// Retained as a local approved-pattern reference for later Grade 4 revisions.
const DEEP_SCREEN_COPY = {
  foundation: {
    title: { ru: 'От знакомых разрядов к классам', uz: 'Tanish xonalardan sinflarga', en: "From familiar places to groups" },
    lead: {
      ru: 'Сначала находим знакомую тройку справа, затем видим, как слева открывается следующий класс.',
      uz: "Avval o'ngdagi tanish uchlikni topamiz, keyin chapda keyingi sinf qanday ochilishini ko'ramiz.",
      en: "First we find the familiar three on the right, then we see the next group on the left.",
    },
  },
  reading: {
    title: { ru: 'Читаем классы и слышим место нуля', uz: "Sinflarni o'qiymiz va nolning o'rnini anglaymiz", en: "We read groups and hear the place of zero." },
    lead: {
      ru: 'Один экран связывает порядок классов с ролью внутреннего нуля: число читается группами, а места не сдвигаются.',
      uz: "Bitta model sinflar tartibini ichki nol vazifasi bilan bog'laydi: son guruhlar bilan o'qiladi, xonalar esa siljimaydi.",
      en: "One screen associates the order of groups with the role of the inner zero: the number is read in groups, and the places are not moved.",
    },
  },
  inverse: {
    title: { ru: 'Слышим, записываем и читаем обратно', uz: "Eshitamiz, yozamiz va qayta o'qiymiz", en: "We listen, write and read back." },
    lead: {
      ru: 'Запись и чтение — обратные действия. Проверим обе стороны на двух разных кодах.',
      uz: "Yozish va o'qish teskari amallardir. Ikkala yo'nalishni ikki xil kodda tekshiramiz.",
      en: "Write and read are backwards. Let's test both sides on two different codes.",
    },
  },
};

// eslint-disable-next-line no-unused-vars
const DeepSequenceScreen = ({ screen, contentKeys, copyKey, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const contents = useMemo(() => contentKeys.map((key) => CONTENT[key]), [contentKeys]);
  const copy = DEEP_SCREEN_COPY[copyKey];
  const [activeStep, setActiveStep] = useState(0);
  const [seenSteps, setSeenSteps] = useState(() => new Set([0]));
  const active = contents[activeStep];
  const segments = useMemo(() => [
    ...localizedSegments(active.audio?.intro ?? active.audio, lang, `s${screen}-deep-${activeStep}-intro`),
    ...localizedSegments(active.audio?.on_correct ?? active.correctText, lang, `s${screen}-deep-${activeStep}-result`),
  ], [active, activeStep, lang, screen]);
  const audio = useAudio(segments);
  const canAdvance = useTheoryAdvanceGate(audio) && seenSteps.size >= contents.length;

  const selectStep = (index) => {
    setActiveStep(index);
    setSeenSteps((previous) => {
      if (previous.has(index)) return previous;
      const next = new Set(previous);
      next.add(index);
      return next;
    });
  };

  return (
    <Stage
      screen={screen}
      eyebrow={active.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack deep-sequence-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DEEP DIVE</span>
            <h1>{t(copy.title)}</h1>
            <p>{t(copy.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-theory" data-g4-role="visual-frame"><BitSVG state={activeStep === contents.length - 1 ? 'idea' : 'point'} /></div>
        </div>
        <div className="deep-sequence-tabs" role="tablist" aria-label={t(copy.title)}>
          {contents.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeStep === index}
              className={activeStep === index ? 'deep-tab-active' : seenSteps.has(index) ? 'deep-tab-seen' : ''}
              onClick={() => selectStep(index)}
              key={contentKeys[index]}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{t(item.title)}</strong>
            </button>
          ))}
        </div>
        <div className="deep-sequence-stage" key={`${copyKey}-${activeStep}`}>
          <ModelPanel model={active.model} solved />
          <section className="deep-sequence-explanation">
            <span>{lang === 'en' ? `STEP ${activeStep + 1}` : lang === 'ru' ? `ШАГ ${activeStep + 1}` : `${activeStep + 1}-QADAM`}</span>
            <h2>{t(active.instruction)}</h2>
            <p>{t(active.correctText)}</p>
            {active.wrong?.[1] && <small className="deep-sequence-misconception">{t(active.wrong[1])}</small>}
          </section>
        </div>
        <button type="button" className="deep-replay" onClick={() => selectStep(activeStep < contents.length - 1 ? activeStep + 1 : 0)}>
          <span aria-hidden="true">{activeStep < contents.length - 1 ? '→' : '↻'}</span>
          {activeStep < contents.length - 1
            ? (lang === 'en' ? "Show the following model" : lang === 'ru' ? 'Показать следующую модель' : "Keyingi modelni ko'rish")
            : (lang === 'en' ? "Show the chain again." : lang === 'ru' ? 'Показать цепочку ещё раз' : "Bosqichlarni yana ko'rish")}
        </button>
      </div>
    </Stage>
  );
};

const phaseFromAudio = (audio, prefix, lastPhase) => {
  if (audio.muted || audio.completed) return lastPhase;
  const marker = `${prefix}-`;
  if (!audio.currentSegment?.startsWith(marker)) return 0;
  const parsed = Number(audio.currentSegment.slice(marker.length));
  return Number.isInteger(parsed) ? Math.min(lastPhase, parsed) : 0;
};

const GroupedNumberLessonScreen = ({ screen, contentKey, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = D2_REVISION_CONTENT[contentKey];
  const prefix = `s${screen}-places`;
  const segments = useMemo(
    () => localizedSegments(c.audio, lang, prefix),
    [c.audio, lang, prefix],
  );
  const audio = useAudio(segments);
  const phase = phaseFromAudio(audio, prefix, c.digits.length);
  const activeDigit = phase === 0 ? -1 : Math.min(c.digits.length - 1, phase - 1);
  const canAdvance = useTheoryAdvanceGate(audio);

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className={`screen-stack grouped-number-lesson grouped-number-slide-${screen + 1}`}>
        <div className="screen-heading bit-free-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · PLACE LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
        </div>
        <section className="grouped-number-frame" aria-live="polite">
          <div className="grouped-number-display" aria-label={c.number}>
            {c.digits.map((digit, index) => (
              <div
                className={`grouped-digit-card ${activeDigit === index ? 'grouped-digit-active' : ''} ${index < activeDigit ? 'grouped-digit-seen' : ''} ${index === 3 ? 'grouped-digit-boundary' : ''}`}
                key={`${digit}-${index}`}
                style={{ '--digit-delay': `${index * 80}ms` }}
              >
                <strong>{digit}</strong>
                <span>{t(c.placeLabels[index])}</span>
              </div>
            ))}
          </div>
          <div className="grouped-class-labels">
            <span className={activeDigit >= 0 && activeDigit <= 2 ? 'grouped-class-active' : ''}>{t(c.classLabels[0])}</span>
            <span className={activeDigit >= 3 ? 'grouped-class-active' : ''}>{t(c.classLabels[1])}</span>
          </div>
          <div className="grouped-number-caption" key={`${screen}-${phase}`}>
            <span>{String(Math.min(phase + 1, c.captions.length)).padStart(2, '0')}</span>
            <p>{t(c.captions[Math.min(phase, c.captions.length - 1)])}</p>
          </div>
        </section>
      </div>
    </Stage>
  );
};

const SpokenNumberBuilderScreen = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = D2_REVISION_CONTENT.builder;
  const guidedSegments = useMemo(
    () => localizedSegments(c.audio.guided, lang, `s${screen}-guided`),
    [c.audio.guided, lang, screen],
  );
  const builderSegments = useMemo(
    () => localizedSegments(c.audio.builder, lang, `s${screen}-builder`),
    [c.audio.builder, lang, screen],
  );
  const segments = useMemo(() => [...guidedSegments, ...builderSegments], [builderSegments, guidedSegments]);
  const audio = useAudio(segments);
  const builderPhase = Boolean(storedAnswer?.finalSlots)
    || audio.muted
    || audio.completed
    || audio.currentSegment?.startsWith(`s${screen}-builder`);
  const sourceDigits = useMemo(
    () => c.trayDigits.map((value, index) => ({ id: `${value}-${index}`, value })),
    [c.trayDigits],
  );
  const [slots, setSlots] = useState(() => (
    Array.isArray(storedAnswer?.finalSlots)
      ? storedAnswer.finalSlots
      : Array(c.targetDigits.length).fill(null)
  ));
  const [selectedId, setSelectedId] = useState(null);
  const [solved, setSolved] = useState(storedAnswer?.solved === true);
  const [checked, setChecked] = useState(storedAnswer?.solved === true);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const audioReady = useCanAnswer(audio);
  const canAnswer = builderPhase && audioReady;
  const canAdvance = useAdvanceGate(solved, audio);
  const usedIds = new Set(slots.filter(Boolean).map((slot) => slot.id));
  const available = sourceDigits.filter((digit) => !usedIds.has(digit.id));

  const recordDraft = (nextSlots) => onAnswer({
    stage: null,
    screenIdx: screen,
    question: t(c.prompt),
    options: null,
    correctIndex: null,
    correctAnswer: c.targetDigits.join(''),
    studentAnswerIndex: null,
    studentAnswer: nextSlots.map((slot) => slot?.value ?? '').join(''),
    correct: false,
    firstTry: false,
    attempts,
    solved: false,
    finalSlots: nextSlots,
  });

  const evaluateSlots = (nextSlots, nextAttempts) => {
    const correct = nextSlots.every((slot, index) => slot?.value === c.targetDigits[index]);
    setAttempts(nextAttempts);
    setChecked(true);
    if (!correct) {
      playSfx('wrong');
      audio.pushOneOff(t(c.audio.on_wrong));
      onAnswer({
        stage: null,
        screenIdx: screen,
        question: t(c.prompt),
        options: null,
        correctIndex: null,
        correctAnswer: c.targetDigits.join(''),
        studentAnswerIndex: null,
        studentAnswer: nextSlots.map((slot) => slot?.value ?? '').join(''),
        correct: false,
        firstTry: false,
        attempts: nextAttempts,
        solved: false,
        finalSlots: nextSlots,
      });
      return;
    }
    setSolved(true);
    playSfx('correct');
    audio.pushOneOff(t(c.audio.on_correct));
    onAnswer({
      stage: null,
      screenIdx: screen,
      question: t(c.prompt),
      options: null,
      correctIndex: null,
      correctAnswer: c.targetDigits.join(''),
      studentAnswerIndex: null,
      studentAnswer: c.targetDigits.join(''),
      correct: true,
      firstTry: nextAttempts === 1,
      attempts: nextAttempts,
      solved: true,
      finalSlots: nextSlots,
    });
  };

  const place = (digitId, slotIndex) => {
    if (!canAnswer || solved) return;
    const digit = sourceDigits.find((item) => item.id === digitId);
    if (!digit) return;
    setChecked(false);
    const next = slots.map((slot) => (slot?.id === digitId ? null : slot));
    next[slotIndex] = digit;
    setSlots(next);
    recordDraft(next);
    setSelectedId(null);
  };

  const clearSlot = (slotIndex) => {
    if (!canAnswer || solved) return;
    if (selectedId) {
      place(selectedId, slotIndex);
      return;
    }
    setChecked(false);
    const next = slots.map((slot, index) => (index === slotIndex ? null : slot));
    setSlots(next);
    recordDraft(next);
  };

  const check = () => {
    if (!canAnswer || solved || available.length > 0) return;
    evaluateSlots(slots, attempts + 1);
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack spoken-builder-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · VOICE BUILDER</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-theory" data-g4-role="visual-frame"><BitSVG state={builderPhase ? 'focus' : 'point'} /></div>
        </div>
        {!builderPhase ? (
          <section className="builder-guided-frame" aria-live="polite">
            <span className="builder-phase-badge">01</span>
            <div className="builder-guided-digits">
              {c.guidedDigits.map((digit, index) => (
                <strong className={index === 3 ? 'builder-class-gap' : ''} key={`${digit}-${index}`}>{digit}</strong>
              ))}
            </div>
            <div className="builder-class-labels"><span>{t(c.classLabels[0])}</span><span>{t(c.classLabels[1])}</span></div>
            <p>{t(c.guidedCaption)}</p>
          </section>
        ) : (
          <section
            className="builder-interactive-frame"
            data-qa-build-answer={JSON.stringify(c.targetDigits)}
            data-qa-build-mode="select-slot"
            aria-live="polite"
          >
            <div className="builder-prompt"><span>02</span><h2>{t(c.prompt)}</h2></div>
            <div className="builder-slots" aria-label={t(c.prompt)}>
              {slots.map((slot, index) => (
                <button
                  type="button"
                  className={`builder-slot ${selectedId ? 'builder-slot-ready' : ''} ${index === 3 ? 'builder-class-gap' : ''}`}
                  data-qa-build-slot={index}
                  data-qa-filled={slot ? 'true' : 'false'}
                  key={`slot-${index}`}
                  onClick={() => clearSlot(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    place(event.dataTransfer.getData('text/plain'), index);
                  }}
                  aria-label={`${index + 1}`}
                >
                  {slot?.value ?? '·'}
                </button>
              ))}
            </div>
            <div className="builder-class-labels"><span>{t(c.classLabels[0])}</span><span>{t(c.classLabels[1])}</span></div>
            <div className="builder-digit-tray">
              {available.map((digit) => (
                <button
                  type="button"
                  className={`builder-digit ${selectedId === digit.id ? 'builder-digit-selected' : ''}`}
                  data-qa-build-card={digit.value}
                  draggable={!solved}
                  key={digit.id}
                  onDragStart={(event) => event.dataTransfer.setData('text/plain', digit.id)}
                  onClick={() => setSelectedId((current) => (current === digit.id ? null : digit.id))}
                  disabled={!canAnswer || solved}
                  aria-pressed={selectedId === digit.id}
                >
                  {digit.value}
                </button>
              ))}
              {available.length === 0 && <span>{lang === 'en' ? 'All digits placed' : lang === 'ru' ? 'Все цифры размещены' : 'Barcha raqamlar joylashtirildi'}</span>}
            </div>
            {!solved && (
              <div className="builder-action-row">
                <button type="button" className="btn btn-white-accent" data-qa-build-check="true" disabled={!canAnswer || available.length > 0} onClick={check}>
                  {lang === 'en' ? 'Check' : lang === 'ru' ? 'Проверить' : 'Tekshirish'}
                </button>
              </div>
            )}
            <FeedbackBlock show={checked || solved} correct={solved}>{t(solved ? c.doneText : c.hint)}</FeedbackBlock>
          </section>
        )}
      </div>
    </Stage>
  );
};

const StrategyBuilderScreen = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = D2_REVISION_CONTENT.strategyBuilder;
  const fragments = c.fragments[lang] ?? c.fragments.uz;
  const order = [3, 0, 4, 1, 2];
  const [built, setBuilt] = useState(storedAnswer?.built ?? []);
  const [checked, setChecked] = useState(storedAnswer?.solved === true);
  const [solved, setSolved] = useState(storedAnswer?.solved === true);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const segments = useMemo(
    () => localizedSegments(c.audio.intro, lang, `s${screen}-strategy`),
    [c.audio.intro, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);

  const recordDraft = (nextBuilt) => onAnswer({
    stage: SCREEN_META[screen].scope,
    screenIdx: screen,
    question: t(c.title),
    options: fragments,
    correctIndex: null,
    correctAnswer: t(c.rule),
    studentAnswerIndex: null,
    studentAnswer: nextBuilt.map((index) => fragments[index]).join(' '),
    correct: false,
    firstTry: false,
    attempts,
    solved: false,
    built: nextBuilt,
  });

  const add = (index) => {
    if (!canAnswer || solved || built.includes(index)) return;
    const nextBuilt = [...built, index];
    setChecked(false);
    setBuilt(nextBuilt);
    recordDraft(nextBuilt);
  };

  const remove = (index) => {
    if (!canAnswer || solved) return;
    const nextBuilt = built.filter((item) => item !== index);
    setChecked(false);
    setBuilt(nextBuilt);
    recordDraft(nextBuilt);
  };

  const check = () => {
    if (!canAnswer || solved || built.length !== fragments.length) return;
    const nextAttempts = attempts + 1;
    const correct = built.join(',') === '0,1,2,3,4';
    setAttempts(nextAttempts);
    setChecked(true);
    if (!correct) {
      playSfx('wrong');
      audio.pushOneOff(t(c.audio.on_wrong));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.title),
        options: fragments,
        correctIndex: null,
        correctAnswer: t(c.rule),
        studentAnswerIndex: null,
        studentAnswer: built.map((index) => fragments[index]).join(' '),
        correct: false,
        firstTry: false,
        attempts: nextAttempts,
        solved: false,
        built,
      });
      return;
    }
    setSolved(true);
    playSfx('correct');
    audio.pushOneOff(t(c.audio.on_correct));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.title),
      options: fragments,
      correctIndex: null,
      correctAnswer: t(c.rule),
      studentAnswerIndex: null,
      studentAnswer: t(c.rule),
      correct: true,
      firstTry: nextAttempts === 1,
      attempts: nextAttempts,
      solved: true,
      built,
    });
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack strategy-builder-screen">
        <div className="screen-heading bit-free-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · CHECK LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
        </div>
        <section
          className="strategy-builder-frame"
          data-qa-rule-builder="true"
          data-qa-rule-answer={JSON.stringify(fragments)}
        >
          <div className="strategy-built" aria-live="polite">
            {built.length === 0 && <span>{lang === 'en' ? 'Build the sentence here' : lang === 'ru' ? 'Собери предложение здесь' : 'Gapni shu yerda yig\'ing'}</span>}
            {built.map((index) => (
              <button type="button" data-qa-build-slot={index} key={index} onClick={() => remove(index)} disabled={solved}>{fragments[index]}</button>
            ))}
          </div>
          <div className="strategy-fragment-tray">
            {order.filter((index) => !built.includes(index)).map((index) => (
              <button type="button" data-qa-build-card={fragments[index]} key={index} className="strategy-fragment" onClick={() => add(index)} disabled={!canAnswer || solved}>
                {fragments[index]}
              </button>
            ))}
          </div>
          {!solved && (
            <div className="builder-action-row">
              <button type="button" className="btn btn-white-accent" data-qa-rule-check="true" disabled={!canAnswer || built.length !== fragments.length} onClick={check}>
                {lang === 'en' ? 'Check' : lang === 'ru' ? 'Проверить' : 'Tekshirish'}
              </button>
            </div>
          )}
          {solved && <span className="sr-only" data-qa-rule-complete="true">complete</span>}
        </section>
        <FeedbackBlock show={checked || solved} correct={solved}>{t(solved ? c.rule : c.audio.on_wrong)}</FeedbackBlock>
      </div>
    </Stage>
  );
};

const readMatchingPoint = (element, board, side) => {
  const box = element.getBoundingClientRect();
  const host = board.getBoundingClientRect();
  return {
    x: side === 'left' ? box.right - host.left : box.left - host.left,
    y: box.top + box.height / 2 - host.top,
  };
};

const MatchingLines = ({ boardRef, pairs, wrongPair, localeKey }) => {
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
          return {
            from: readMatchingPoint(left, board, 'left'),
            to: readMatchingPoint(right, board, 'right'),
            wrong: pair.wrong,
          };
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
  }, [boardRef, localeKey, pairs, wrongPair]);

  return (
    <svg className="reading-match-connectors" width={geometry.width} height={geometry.height} viewBox={`0 0 ${geometry.width || 1} ${geometry.height || 1}`} aria-hidden="true">
      {geometry.lines.map((line, index) => {
        const bend = Math.max(24, (line.to.x - line.from.x) * 0.42);
        const path = `M ${line.from.x} ${line.from.y} C ${line.from.x + bend} ${line.from.y}, ${line.to.x - bend} ${line.to.y}, ${line.to.x} ${line.to.y}`;
        return (
          <path
            key={`${path}-${index}`}
            className={line.wrong ? 'matching-connector-wrong' : 'matching-connector-correct'}
            d={path}
            fill="none"
            stroke={line.wrong ? T.warn : T.success}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={line.wrong ? '8 7' : undefined}
          />
        );
      })}
    </svg>
  );
};

const ReadingMatchingScreen = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = D2_REVISION_CONTENT.readingMatch;
  const boardRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [pairs, setPairs] = useState(storedAnswer?.pairs ?? {});
  const [wrongPair, setWrongPair] = useState(null);
  const [feedback, setFeedback] = useState(storedAnswer?.solved ? c.doneText : null);
  const [lastCorrect, setLastCorrect] = useState(storedAnswer?.solved === true ? true : null);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const wrongTimerRef = useRef(null);
  const segments = useMemo(
    () => localizedSegments(c.audio.intro, lang, `s${screen}-matching`),
    [c.audio.intro, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const solved = Object.keys(pairs).length === c.pairs.length;
  const canAdvance = useAdvanceGate(solved, audio);

  useEffect(() => () => {
    if (wrongTimerRef.current !== null) window.clearTimeout(wrongTimerRef.current);
  }, []);

  const match = (rightId, leftId = selected) => {
    if (!canAnswer || solved || !leftId || pairs[leftId]) return;
    if (wrongTimerRef.current !== null) window.clearTimeout(wrongTimerRef.current);
    setWrongPair(null);
    const correct = leftId === rightId;
    if (!correct) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setWrongPair({ left: leftId, right: rightId });
      setLastCorrect(false);
      setFeedback(c.hint);
      playSfx('wrong');
      audio.pushOneOff(t(c.audio.on_wrong));
      wrongTimerRef.current = window.setTimeout(() => {
        setWrongPair(null);
        wrongTimerRef.current = null;
      }, 1200);
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.title),
        options: null,
        correctIndex: null,
        correctAnswer: c.pairs.map((pair) => `${pair.number} — ${t(pair.reading)}`).join('; '),
        studentAnswerIndex: null,
        studentAnswer: `${leftId} — ${rightId}`,
        correct: false,
        firstTry: false,
        attempts: nextAttempts,
        solved: false,
        pairs,
      });
      return;
    }
    const nextPairs = { ...pairs, [leftId]: rightId };
    const complete = Object.keys(nextPairs).length === c.pairs.length;
    setPairs(nextPairs);
    setSelected(null);
    setLastCorrect(true);
    setFeedback(complete ? c.doneText : c.audio.pair_correct);
    playSfx('correct');
    audio.pushOneOff(t(complete ? c.audio.on_correct : c.audio.pair_correct));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.title),
      options: null,
      correctIndex: null,
      correctAnswer: c.pairs.map((pair) => `${pair.number} — ${t(pair.reading)}`).join('; '),
      studentAnswerIndex: null,
      studentAnswer: JSON.stringify(nextPairs),
      correct: complete,
      firstTry: complete && attempts === 0,
      attempts: attempts + 1,
      solved: complete,
      pairs: nextPairs,
    });
  };

  const connectorPairs = Object.entries(pairs).map(([left, right]) => ({ left, right }));
  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className={`screen-stack reading-matching-screen ${solved ? 'is-solved' : ''}`}>
        <div className="screen-heading bit-free-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · MATCH LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
        </div>
        <section className="reading-matching-board" ref={boardRef} data-g4-role="visual-frame">
          <div className="reading-matching-column">
            {c.pairs.map((pair) => (
              <button
                type="button"
                draggable={!pairs[pair.id]}
                data-match-left={pair.id}
                className={`reading-match-card reading-number-card ${selected === pair.id ? 'reading-match-selected' : ''} ${pairs[pair.id] ? 'reading-match-done' : ''} ${wrongPair?.left === pair.id ? 'reading-match-wrong' : ''}`}
                key={pair.id}
                aria-pressed={selected === pair.id}
                onDragStart={(event) => event.dataTransfer.setData('text/plain', pair.id)}
                onClick={() => !pairs[pair.id] && setSelected(pair.id)}
                disabled={!canAnswer || Boolean(pairs[pair.id])}
              >
                {pair.number}
              </button>
            ))}
          </div>
          <MatchingLines boardRef={boardRef} pairs={connectorPairs} wrongPair={wrongPair} localeKey={lang} />
          <div className="reading-matching-column">
            {c.rightOrder.map((id) => {
              const pair = c.pairs.find((item) => item.id === id);
              const used = Object.values(pairs).includes(id);
              return (
                <button
                  type="button"
                  data-match-right={id}
                  className={`reading-match-card reading-text-card ${used ? 'reading-match-done' : ''} ${wrongPair?.right === id ? 'reading-match-wrong' : ''}`}
                  key={id}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => match(id, event.dataTransfer.getData('text/plain'))}
                  onClick={() => match(id)}
                  disabled={!canAnswer || used}
                >
                  {t(pair.reading)}
                </button>
              );
            })}
          </div>
        </section>
        <span className="sr-only" aria-live="polite">{feedback ? t(feedback) : ''}</span>
        <FeedbackBlock show={Boolean(feedback)} correct={lastCorrect === true}>{t(feedback)}</FeedbackBlock>
      </div>
    </Stage>
  );
};

const FinaleScreen = ({ screen, storedAnswer, answers = [], onAnswer, onPrev, finishLesson }) => {
  const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true);
  const [revealRequested, setRevealRequested] = useState(false);
  const [reflectionChoice, setReflectionChoice] = useState(storedAnswer?.reflectionChoice ?? null);
  const lang = useLang();
  const t = useT();
  const c = D2_REVISION_CONTENT.finale;
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, 's14-finale-intro'),
    ...localizedSegments(c.audio?.on_correct ?? c.correctText, lang, 's14-finale-result'),
  ], [c.audio, c.correctText, lang]);
  const audio = useAudio(segments);
  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const visible = (() => {
    if (audio.muted || audio.completed || reduced) return 4;
    if (audio.currentSegment?.startsWith('s14-finale-result')) return 4;
    const marker = 's14-finale-intro-';
    if (!audio.currentSegment?.startsWith(marker)) return 0;
    const segmentIndex = Number(audio.currentSegment.slice(marker.length));
    return Number.isInteger(segmentIndex) ? Math.min(3, Math.max(0, segmentIndex)) : 0;
  })();
  const scoredIndexes = useMemo(
    () => SCREEN_META.map((meta, index) => (meta.scored ? index : null)).filter((index) => index !== null),
    [],
  );
  const firstTry = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
  const complete = visible >= 4;
  const totalScored = scoredIndexes.length;
  const finalState = complete || audio.completed || audio.muted || reduced;
  const rewardTitle = firstTry === totalScored
    ? { ru: 'Архитектор чисел', uz: "Sonlar me'mori", en: 'Number Architect' }
    : firstTry >= Math.max(1, totalScored - 1)
      ? { ru: 'Знаток классов', uz: 'Sinflar bilimdoni', en: 'Place-value Expert' }
      : { ru: 'Исследователь чисел', uz: 'Sonlar tadqiqotchisi', en: 'Number Explorer' };
  const reflectionOptions = [
    { ru: 'Сначала делю число на классы справа.', uz: "Avval sonni o'ngdan sinflarga ajrataman.", en: 'First, I split the number into groups from the right.' },
    { ru: 'Сохраняю три места в каждом правом классе.', uz: "Har bir o'ng sinfda uchta o'rinni saqlayman.", en: 'I keep three places in every group to the right.' },
    { ru: 'Проверяю запись обратным чтением.', uz: "Yozuvni qayta o'qib tekshiraman.", en: 'I check the notation by reading it back.' },
  ];
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
      question: t({ ru: 'Какой шаг ты будешь использовать?', uz: 'Qaysi qadamdan foydalanasiz?', en: 'Which step will you use?' }),
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
  const takeaways = lang === 'en'
    ? [
      'Separate the number into groups of three digits, starting from the right.',
      'Read the groups from left to right as whole numbers.',
      'Keep internal zeros and check by reading the number back.',
    ]
    : lang === 'ru'
      ? [
        'Разделяй число справа на группы по три цифры.',
        'Читай классы слева направо целыми группами.',
        'Сохраняй внутренние нули и проверяй обратным чтением.',
      ]
      : [
        "Sonni o'ngdan uchtadan raqamga ajrating.",
        "Sinflarni chapdan o'ngga yaxlit o'qing.",
        "Ichki nollarni saqlab, qayta o'qib tekshiring.",
      ];

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
          <p>{lang === 'en' ? "The voice address from the beginning of the lesson is restored: the centre reads and writes the number without loss." : lang === 'ru' ? 'Голосовой адрес из начала урока восстановлен: центр читает и записывает число без потерь.' : "Dars boshidagi ovozli manzil tiklandi: markaz sonni yo'qotishsiz o'qiydi va yozadi."}</p>
        </header>

        <div className="finale-layout">
          <div className="finale-main">
            <div className="finale-mastery">
              {takeaways.map((item, index) => (
                <article className={`finale-takeaway ${visible >= index + 1 ? 'is-visible' : ''}`} key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
            <div className={`finale-proof ${visible >= 3 ? 'is-visible' : ''}`}>
              <span>{lang === 'en' ? 'STARTING MISSION SOLVED' : lang === 'ru' ? 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ' : "BOSHLANG'ICH MISSIYA YECHIMI"}</span>
              <strong>{t(c.model.number)}</strong>
              <p>{t(c.correctText)}</p>
            </div>
            <div className={`finale-bridge ${complete ? 'is-visible' : ''}`}>
              <span aria-hidden="true">→</span>
              <div><strong>{lang === 'en' ? "NEXT MISSION" : lang === 'ru' ? 'СЛЕДУЮЩАЯ МИССИЯ' : 'KEYINGI MISSIYA'}</strong><p>{t(c.bridge)}</p></div>
            </div>
          </div>

          <aside className="finale-actions">
          <section className="finale-reflection" aria-labelledby="d2-reflection-question">
            <strong id="d2-reflection-question">{t({ ru: 'Какой шаг ты будешь использовать?', uz: 'Qaysi qadamdan foydalanasiz?', en: 'Which step will you use?' })}</strong>
            <div>
              {reflectionOptions.map((option, index) => (
                <button type="button" className={reflectionChoice === index ? 'is-selected' : ''} aria-pressed={reflectionChoice === index} disabled={titleClaimed} onClick={() => chooseReflection(index)} key={t(option)}>
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

const TheoryScreen = ({ screen, contentKey, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey ?? `s${screen}`];
  const meta = SCREEN_META[screen];
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}-intro`),
    ...localizedSegments(c.audio?.on_correct ?? c.correctText, lang, `s${screen}-explanation`),
  ], [c.audio, c.correctText, lang, screen]);
  const audio = useAudio(segments);
  const canAdvance = useTheoryAdvanceGate(audio);
  const isFinal = screen === TOTAL_SCREENS - 1;
  const proceed = () => {
    if (isFinal) finishLesson();
    else onNext();
  };
  const label = meta.type === 'rule'
    ? (lang === 'en' ? 'RULE' : lang === 'ru' ? 'ПРАВИЛО' : 'QOIDA')
    : meta.subtype.includes('error')
      ? (lang === 'en' ? 'REVIEW THE MISTAKE' : lang === 'ru' ? 'РАЗБОР ОШИБКИ' : 'XATONI TUZATISH')
      : meta.subtype.includes('strategy')
        ? (lang === 'en' ? 'RELIABLE METHOD' : lang === 'ru' ? 'НАДЁЖНЫЙ СПОСОБ' : 'ISHONCHLI USUL')
        : meta.type === 'summary'
          ? (lang === 'en' ? 'REMEMBER' : lang === 'ru' ? 'ЗАПОМНИ' : 'ESLAB QOLING')
          : (lang === 'en' ? "BIT EXPLAINS" : lang === 'ru' ? 'БИТ ОБЪЯСНЯЕТ' : 'BIT TUSHUNTIRADI');

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
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
            <span className="lesson-kicker">LUMO CITY · DATA CENTER</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-theory" data-g4-role="visual-frame">
            <BitSVG state={theoryMoodFor(meta.subtype)} />
          </div>
        </div>
        <TheoryBody screen={screen} c={c} meta={meta} label={label} canAdvance={canAdvance} />
      </div>
    </Stage>
  );
};

const WorkedExamplesScreen = ({ screen, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s11;
  const guided = CONTENT.s10;
  const segments = useMemo(() => [
    ...localizedSegments(guided.audio?.intro, lang, 's10-guided-intro'),
    ...localizedSegments(guided.audio?.on_correct ?? guided.correctText, lang, 's10-guided-result'),
    ...localizedSegments(c.audio?.intro, lang, 's11-intro'),
    ...c.items.flatMap((item, index) => [
      ...localizedSegments(item.audio?.intro, lang, `s11-example-${index}-task`),
      ...localizedSegments(item.audio?.on_correct ?? item.correctText, lang, `s11-example-${index}-answer`),
    ]),
  ], [c.audio, c.items, guided.audio, guided.correctText, lang]);
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
            <span className="lesson-kicker">LUMO CITY · EXAMPLE LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-theory" data-g4-role="visual-frame"><BitSVG state="focus" /></div>
        </div>
        <section className="worked-featured-example">
          <ModelPanel model={{ ...guided.model, number: guided.options[guided.correctIndex] }} solved />
          <div>
            <span>{lang === 'en' ? 'FULL SOLUTION' : lang === 'ru' ? 'ПОЛНОЕ РЕШЕНИЕ' : "TO'LIQ YECHIM"}</span>
            <h2>{t(guided.instruction)}</h2>
            <p>{t(guided.correctText)}</p>
          </div>
        </section>
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
        <div className="worked-examples-finish">
          <BitSVG state="nod" />
          <p>{t(c.completionText)}</p>
        </div>
      </div>
    </Stage>
  );
};

const CityCodeLabScreen = ({ screen, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s18;
  const [activeStep, setActiveStep] = useState(0);
  const [seenSteps, setSeenSteps] = useState(() => new Set([0]));
  const active = c.items[activeStep];
  const segments = useMemo(() => [
    ...localizedSegments(active.audio?.intro, lang, `s18-lab-${activeStep}-dictation`),
    ...localizedSegments(active.audio?.on_correct, lang, `s18-lab-${activeStep}-solution`),
  ], [active, activeStep, lang]);
  const audio = useAudio(segments);
  const canAdvance = useTheoryAdvanceGate(audio) && seenSteps.size === c.items.length;

  const selectStep = (index) => {
    setActiveStep(index);
    setSeenSteps((previous) => {
      if (previous.has(index)) return previous;
      const next = new Set(previous);
      next.add(index);
      return next;
    });
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack city-code-lab-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DICTATION LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
        </div>
        <div className="city-lab-tabs" role="tablist" aria-label={t(c.title)}>
          {c.items.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeStep === index}
              className={activeStep === index ? 'city-lab-tab-active' : seenSteps.has(index) ? 'city-lab-tab-seen' : ''}
              onClick={() => selectStep(index)}
              key={item.station}
            >
              <span>{item.station}</span><strong>{item.written}</strong>
            </button>
          ))}
        </div>
        <section className="city-lab-solution" key={`city-lab-${activeStep}`}>
          <div className="city-lab-voice">
            <span>{lang === 'en' ? 'WHAT WE HEARD' : lang === 'ru' ? 'УСЛЫШАЛИ' : 'ESHITDIK'}</span>
            <p>{t(active.spoken)}</p>
          </div>
          <div className="city-lab-path" aria-label={t(c.instruction)}>
            <article>
              <span>01</span><small>{lang === 'en' ? 'groups' : lang === 'ru' ? 'классы' : 'sinflar'}</small>
              <div>{active.groups.map((group) => <strong key={group}>{group}</strong>)}</div>
            </article>
            <i aria-hidden="true">→</i>
            <article>
              <span>02</span><small>{lang === 'en' ? 'notation' : lang === 'ru' ? 'запись' : 'yozuv'}</small>
              <div><strong>{active.written}</strong></div>
            </article>
            <i aria-hidden="true">→</i>
            <article>
              <span>03</span><small>{lang === 'en' ? 'read back' : lang === 'ru' ? 'обратное чтение' : "qayta o'qish"}</small>
              <p>{t(active.readBack)}</p>
            </article>
          </div>
          <div className="city-lab-note" data-g4-role="visual-frame"><BitSVG state="point" /><p>{t(active.note)}</p></div>
        </section>
        <button type="button" className="deep-replay city-lab-next" onClick={() => selectStep(activeStep < c.items.length - 1 ? activeStep + 1 : 0)}>
          <span aria-hidden="true">{activeStep < c.items.length - 1 ? '→' : '↻'}</span>
          {activeStep < c.items.length - 1
            ? (lang === 'en' ? 'Show the next code' : lang === 'ru' ? 'Открыть следующий код' : 'Keyingi kodni ochish')
            : (lang === 'en' ? 'Review the codes' : lang === 'ru' ? 'Посмотреть коды ещё раз' : "Kodlarni yana ko'rish")}
        </button>
      </div>
    </Stage>
  );
};

// eslint-disable-next-line no-unused-vars
const D2_DEEP_FOUNDATION = ['s1', 's2'];
// eslint-disable-next-line no-unused-vars
const D2_DEEP_READING = ['s3', 's4'];
// eslint-disable-next-line no-unused-vars
const D2_DEEP_INVERSE = ['s5', 's6'];

const MicroTheoryScreen = ({ screen, contentKey, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey];
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}-micro-intro`),
    ...localizedSegments(c.audio?.on_correct ?? c.correctText ?? c.fact, lang, `s${screen}-micro-result`),
  ], [c, lang, screen]);
  const audio = useAudio(segments);
  const canAdvance = useTheoryAdvanceGate(audio);
  const example = c.model?.number ?? c.formula ?? c.options?.[c.correctIndex];
  const explanation = c.correctText ?? c.fact ?? c.conclusion ?? c.prompt;
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} hidden={screen === 0} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}>
      <div className="screen-stack micro-theory-screen">
        <div className="screen-heading">
          <div className="heading-copy"><span className="lesson-kicker">{t({ uz: 'LUMO CITY · BIR QADAM', ru: 'LUMO CITY · ОДИН ШАГ', en: 'LUMO CITY · ONE STEP' })}</span><h1>{t(c.title)}</h1><p>{t(c.lead)}</p></div>
          <div className="bit-coach bit-coach-theory" data-g4-role="visual-frame"><BitSVG state="point" /></div>
        </div>
        {c.hookQuestion && <div className="hook-question"><span>?</span><strong>{t(c.hookQuestion)}</strong></div>}
        <section className="micro-theory-card">
          <span>{lang === 'en' ? "OBSERVATION" : lang === 'ru' ? 'НАБЛЮДЕНИЕ' : 'KUZATUV'}</span>
          {example && <strong className="micro-theory-example">{t(example)}</strong>}
          <h2>{t(c.instruction ?? c.prompt ?? c.title)}</h2>
          {explanation && <p>{t(explanation)}</p>}
        </section>
      </div>
    </Stage>
  );
};

const Screen0 = (props) => <ChoiceScreen {...props} contentKey="s0" />;
const Screen1 = (props) => <GroupedNumberLessonScreen {...props} contentKey="foundation" />;
const Screen2 = (props) => <ChoiceScreen {...props} contentKey="p1" />;
const Screen3 = (props) => <GroupedNumberLessonScreen {...props} contentKey="zeroReading" />;
const Screen4 = (props) => <ChoiceScreen {...props} contentKey="p2" />;
const Screen5 = (props) => <SpokenNumberBuilderScreen {...props} />;
const Screen6 = (props) => <ChoiceScreen {...props} contentKey="p3" />;
const Screen7 = (props) => <NumberInputScreen {...props} contentKey="s7" />;
const Screen8 = (props) => <ChoiceScreen {...props} contentKey="p4" />;
const Screen9 = (props) => <CityCodeLabScreen {...props} />;
const Screen10 = (props) => <ChoiceScreen {...props} contentKey="p5" />;
const Screen11 = (props) => <StrategyBuilderScreen {...props} />;
const Screen12 = (props) => <ReadingMatchingScreen {...props} />;
const Screen13 = (props) => <ChoiceScreen {...props} contentKey="s14" />;
const Screen14 = (props) => <FinaleScreen {...props} />;

// Kept as approved visual references while the compact, no-scroll flow is active.
Object.freeze([TheoryScreen, WorkedExamplesScreen, MicroTheoryScreen]);

const SCREENS = [
  Screen0,
  Screen1,
  Screen2,
  Screen3,
  Screen4,
  Screen5,
  Screen6,
  Screen7,
  Screen8,
  Screen9,
  Screen10,
  Screen11,
  Screen12,
  Screen13,
  Screen14,
];

export default function Grade4Dars02({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode = false }) {
  useMobileZoom();
  const preview = langProp === undefined || langProp === null;
  const audioPreview = previewMode === true || preview;
  const [previewLang, setPreviewLang] = useState(() => normalizeLang(langProp));
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
    const totalQuestions = scoredIndexes.length;
    const correctAnswers = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
    const finalScore = correctAnswers;
    const finalTotal = totalQuestions;
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang],
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions,
      correctAnswers,
      scorePercent: totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      finalScore,
      finalTotal,
      passed: totalQuestions ? correctAnswers / totalQuestions >= 0.6 : false,
      firstTryStats: { total: totalQuestions, firstTryCorrect: correctAnswers },
      attemptsTotal: scoredAnswers.reduce((sum, answer) => sum + (answer.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else console.log('[Grade4 Dars02 preview]', payload);
  }, [answers, lang, onFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
  const previous = () => setCurrent((value) => Math.max(value - 1, 0));

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className={`lesson-root ${preview ? 'lesson-preview' : ''}`}>
        {preview && (
          <div className="preview-language" aria-label={{ uz: "Ko'rib chiqish tili", ru: 'Язык предпросмотра', en: 'Preview language' }[lang]}>
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
.bit-free-heading { grid-template-columns: minmax(0,1fr); }
.choice-number-frame, .choice-prompt-frame {
  width: min(100%, 680px);
  margin: 0 auto;
  padding: 14px 20px;
  border-radius: 18px;
  color: ${T.navy};
  background: ${T.cyanSoft};
  text-align: center;
  box-shadow: 0 12px 28px -22px rgba(${T.shadowBase},.38);
}
.choice-number-frame { font: 900 clamp(34px,7vw,58px)/1 'JetBrains Mono',monospace; letter-spacing: .09em; }
.choice-prompt-frame { font: 700 clamp(20px,3.4vw,30px)/1.25 'Source Serif 4',serif; }
.choice-slide-3 .options-grid { grid-template-columns: repeat(3,minmax(0,1fr)); }
.choice-slide-3 .option { justify-content: center; font: 850 clamp(17px,2.5vw,23px)/1 'JetBrains Mono',monospace; }
.choice-slide-5 .options-grid { grid-template-columns: 1fr; }
.choice-slide-5 .option { min-height: 56px; font-size: clamp(14px,2vw,18px); }
.choice-slide-9 .option { font-size: clamp(15px,2.1vw,19px); }
.choice-slide-9 .option-letter { width: 38px; height: 38px; font-size: 16px; }
.choice-slide-14 .question-card, .input-slide-8 > .model-panel { background: ${T.cyanSoft}; }
.input-slide-8 .class-group strong { transition: transform .36s ease, color .36s ease; }
.input-slide-8 .group-accent strong { color: ${T.accent}; animation: digit-group-in .48s ease both; }

.grouped-number-lesson { gap: 10px; }
.grouped-number-frame {
  width: min(100%, 820px);
  margin: 0 auto;
  padding: clamp(15px,2.8vw,24px);
  display: grid;
  gap: 12px;
  border-radius: 24px;
  background: ${T.cyanSoft};
  box-shadow: 0 16px 38px -28px rgba(${T.shadowBase},.46);
}
.grouped-number-display { display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); gap: 8px; }
.grouped-digit-card {
  min-width: 0;
  min-height: 116px;
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 16px;
  color: ${T.navy};
  background: rgba(255,255,255,.74);
  box-shadow: 0 8px 20px -16px rgba(${T.shadowBase},.42);
  transition: transform .4s cubic-bezier(.16,1,.3,1), background .35s ease, box-shadow .35s ease;
  animation: digit-group-in .45s ease both;
  animation-delay: var(--digit-delay);
}
.grouped-digit-boundary { margin-left: 18px; }
.grouped-digit-card strong { font: 900 clamp(31px,5.2vw,48px)/1 'JetBrains Mono',monospace; }
.grouped-digit-card span { min-height: 29px; display: grid; place-items: end center; color: ${T.ink2}; font-size: 9px; line-height: 1.15; text-align: center; }
.grouped-digit-active { transform: translateY(-7px) scale(1.035); color: ${T.paper}; background: ${T.accent}; box-shadow: 0 16px 26px -17px rgba(255,91,53,.72); }
.grouped-digit-active span { color: rgba(255,255,255,.88); }
.grouped-digit-seen { background: rgba(255,255,255,.96); box-shadow: inset 0 -4px 0 rgba(22,143,163,.36), 0 8px 20px -16px rgba(${T.shadowBase},.42); }
.grouped-class-labels, .builder-class-labels { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 26px; }
.grouped-class-labels span, .builder-class-labels span { padding: 7px 10px; border-radius: 10px; color: ${T.ink2}; background: rgba(255,255,255,.62); text-align: center; font-size: 11px; font-weight: 900; transition: color .3s, background .3s; }
.grouped-class-labels .grouped-class-active { color: ${T.paper}; background: ${T.cyan}; }
.grouped-number-caption { min-height: 66px; padding: 10px 13px; display: grid; grid-template-columns: 36px minmax(0,1fr); align-items: center; gap: 10px; border-radius: 14px; background: ${T.paper}; animation: screen-in .42s ease both; }
.grouped-number-caption span, .builder-phase-badge, .builder-prompt > span { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 10px; color: ${T.paper}; background: ${T.cyan}; font: 900 11px/1 'JetBrains Mono',monospace; }
.grouped-number-caption p { color: ${T.ink}; font-size: clamp(13px,1.8vw,16px); line-height: 1.42; font-weight: 720; }

.spoken-builder-screen { gap: 9px; }
.builder-guided-frame, .builder-interactive-frame, .strategy-builder-frame {
  width: min(100%, 820px);
  margin: 0 auto;
  padding: clamp(14px,2.5vw,22px);
  border-radius: 23px;
  background: ${T.cyanSoft};
  box-shadow: 0 16px 36px -27px rgba(${T.shadowBase},.45);
  animation: screen-in .45s ease both;
}
.builder-guided-frame { display: grid; gap: 12px; }
.builder-guided-digits, .builder-slots { display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); gap: 8px; }
.builder-guided-digits strong, .builder-slot {
  min-width: 0;
  min-height: 76px;
  border: 0;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: ${T.navy};
  background: ${T.paper};
  font: 900 clamp(28px,5vw,44px)/1 'JetBrains Mono',monospace;
  box-shadow: 0 9px 22px -17px rgba(${T.shadowBase},.46);
}
.builder-class-gap { margin-left: 18px; }
.builder-guided-frame > p { padding: 10px 12px; border-radius: 13px; color: ${T.ink}; background: ${T.paper}; font-size: clamp(13px,1.8vw,16px); line-height: 1.42; font-weight: 720; }
.builder-interactive-frame { display: grid; gap: 11px; }
.builder-prompt { display: grid; grid-template-columns: 38px minmax(0,1fr); align-items: center; gap: 10px; }
.builder-prompt h2 { font: 700 clamp(18px,2.7vw,25px)/1.2 'Source Serif 4',serif; }
.builder-slot { cursor: pointer; box-shadow: inset 0 0 0 2px rgba(22,143,163,.17), 0 9px 22px -17px rgba(${T.shadowBase},.46); }
.builder-slot-ready { box-shadow: inset 0 0 0 3px rgba(255,91,53,.34), 0 9px 22px -17px rgba(${T.shadowBase},.46); }
.builder-digit-tray { min-height: 66px; padding: 9px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; border-radius: 15px; background: rgba(255,255,255,.68); }
.builder-digit { width: 50px; height: 50px; border: 0; border-radius: 12px; color: ${T.paper}; background: ${T.navy}; font: 900 24px/1 'JetBrains Mono',monospace; cursor: grab; box-shadow: 0 9px 18px -12px rgba(23,59,82,.72); transition: transform .2s, background .2s; }
.builder-digit-selected { background: ${T.accent}; transform: translateY(-4px); }
.builder-digit-tray > span { color: ${T.success}; font-size: 12px; font-weight: 850; }
.builder-action-row { display: flex; justify-content: flex-end; }

.strategy-builder-frame { background: ${T.paper}; }
.strategy-built { min-height: 118px; padding: 12px; display: flex; flex-wrap: wrap; align-content: flex-start; gap: 8px; border-radius: 16px; color: ${T.ink3}; background: ${T.cyanSoft}; }
.strategy-built button, .strategy-fragment { min-height: 44px; padding: 9px 12px; border: 0; border-radius: 11px; cursor: pointer; font-size: 14px; font-weight: 780; }
.strategy-built button { color: ${T.paper}; background: ${T.cyan}; }
.strategy-fragment-tray { min-height: 72px; margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; }
.strategy-fragment { color: ${T.navy}; background: ${T.paper}; box-shadow: 0 8px 18px -14px rgba(${T.shadowBase},.6); }

.reading-matching-board { position: relative; width: min(100%,840px); min-height: 290px; margin: 0 auto; padding: 12px; display: grid; grid-template-columns: minmax(145px,.75fr) 90px minmax(260px,1.45fr); gap: 10px; align-items: center; border-radius: 22px; background: ${T.cyanSoft}; box-shadow: 0 16px 36px -27px rgba(${T.shadowBase},.45); }
.reading-matching-column { display: grid; gap: 12px; }
.reading-match-card { position: relative; z-index: 2; min-height: 62px; padding: 9px 13px; border: 0; border-radius: 14px; color: ${T.navy}; background: ${T.paper}; cursor: pointer; box-shadow: 0 7px 18px -13px rgba(${T.shadowBase},.52); transition: transform .2s, background .2s, box-shadow .2s; }
.reading-number-card { font: 900 clamp(20px,3.2vw,28px)/1 'JetBrains Mono',monospace; }
.reading-text-card { font-size: clamp(13px,1.7vw,16px); line-height: 1.32; font-weight: 760; text-align: left; }
.reading-match-selected { color: ${T.paper}; background: ${T.accent}; transform: translateY(-3px); }
.reading-match-done { color: ${T.success}; background: ${T.successSoft}; }
.reading-match-wrong { color: ${T.warn}; background: ${T.warnSoft}; box-shadow: inset 0 0 0 3px rgba(169,111,19,.36); }
.reading-match-connectors { position: absolute; inset: 0; z-index: 1; overflow: visible; pointer-events: none; }
.sr-only { position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0,0,0,0) !important; white-space: nowrap !important; border: 0 !important; }
.micro-theory-screen { width: 100%; max-height: 100%; gap: 12px; }
.micro-theory-card { display: grid; gap: 8px; min-width: 0; padding: clamp(12px, 2vw, 18px); border-radius: 20px; background: rgba(255,255,255,.88); box-shadow: 0 12px 30px -22px rgba(${T.shadowBase},.45); }
.micro-theory-card > span { color: ${T.cyan}; font-size: 10px; font-weight: 900; letter-spacing: .12em; }
.micro-theory-card h2, .micro-theory-card p { margin: 0; overflow-wrap: anywhere; }
.micro-theory-card h2 { font: 700 clamp(16px, 2.4vw, 23px)/1.2 'Source Serif 4', serif; }
.micro-theory-card p { color: ${T.ink2}; font-size: clamp(12px, 1.7vw, 15px); line-height: 1.45; }
.micro-theory-example { color: ${T.navy}; font: 800 clamp(22px, 4vw, 38px)/1 'JetBrains Mono', monospace; overflow-wrap: anywhere; }
.hook-question { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 10px 14px; border-radius: 16px; color: ${T.navy}; background: ${T.cyanSoft}; }
.hook-question span { width: 28px; height: 28px; flex: 0 0 28px; display: grid; place-items: center; border-radius: 50%; color: white; background: ${T.cyan}; font-weight: 900; }
.hook-question strong { font-size: clamp(13px, 2vw, 17px); overflow-wrap: anywhere; }
.etalon-hook-screen { min-height: 0; gap: 9px; }
.etalon-hook-screen .screen-heading { grid-template-columns: 1fr; }
.etalon-hook-screen .heading-copy h1 { font-size: clamp(24px,3.4vw,34px); }
.etalon-hook-screen .heading-copy p { margin-top: 5px; font-size: 12px; line-height: 1.35; }
.hook-story-frame { position: relative; isolation: isolate; min-height: 116px; padding: 8px 12px; border-radius: 20px; display: grid; grid-template-columns: 84px minmax(0,1fr); align-items: center; gap: 10px; overflow: hidden; color: ${T.paper}; background: radial-gradient(circle at 87% 24%, rgba(121,211,218,.16), transparent 24%),radial-gradient(circle at 9% 88%, rgba(149,201,61,.11), transparent 25%),linear-gradient(145deg, rgba(22,143,163,.25), transparent 48%),linear-gradient(135deg, #153B50, #0B2232 72%); box-shadow: 0 22px 50px -30px rgba(14,33,44,.75); }
.hook-story-frame::before { content: ''; position: absolute; inset: 0; z-index: 0; opacity: .18; background-image: linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px); background-size: 30px 30px; pointer-events: none; }
.hook-story-frame::after { content: ''; position: absolute; inset: 1px; z-index: 2; border: 1px solid rgba(144,228,235,.12); border-radius: 19px; pointer-events: none; }
.hook-story-frame > * { position: relative; z-index: 1; }
.hook-story-bit { width: 82px; height: 106px; align-self: end; }
.hook-story-bit .g1-char { width: 100%; height: 100%; }
.hook-story-model { min-width: 0; }
.hook-story-frame .model-panel { min-height: 96px; padding: 8px; color: ${T.paper}; background: rgba(255,255,255,.09); box-shadow: inset 0 0 0 1px rgba(255,255,255,.1); }
.hook-story-frame .model-heading, .hook-story-frame .model-heading span, .hook-story-frame .class-group span { color: rgba(255,255,255,.76); }
.hook-story-frame .model-number, .hook-story-frame .class-group strong { color: ${T.paper}; }
.etalon-hook-screen .question-card { padding: 13px; }
.etalon-hook-screen .question-card h2 { font-size: 18px; }
.etalon-hook-screen .options-grid { margin-top: 8px; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 7px; }
.etalon-hook-screen .option { min-height: 52px; padding: 9px 12px; font-size: 14px; }
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
.btn-white-accent.btn-ready { color: ${T.paper}; background: ${T.accent}; box-shadow: 0 12px 28px -12px rgba(255,91,53,.65); animation: ready-pulse .65s ease-in-out 1; }
.btn-white-accent.btn-ready:hover { transform: translateY(-1px); box-shadow: 0 12px 28px -6px rgba(255,91,53,.50); }
@keyframes ready-pulse { 50% { transform: scale(1.035); box-shadow: 0 14px 32px -10px rgba(255,91,53,.68); } }
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
  from { opacity: 0; }
  to { opacity: 1; }
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
.place-cell span { min-height: 32px; display: flex; align-items: center; color: rgba(255,255,255,.70); font-size: 11px; line-height: 1.15; }
.place-cell strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(21px,3.7vw,31px); }
.model-row-list { position: relative; z-index: 1; display: grid; gap: 9px; }
.model-row-list > div { min-height: 58px; padding: 9px 14px; display: flex; align-items: center; justify-content: space-between; gap: 14px; border-radius: 13px; background: rgba(255,255,255,.10); }
.model-row-list span { color: rgba(255,255,255,.72); font-size: 12px; font-weight: 750; }
.model-row-list strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(20px,4vw,29px); }
.model-steps { position: relative; z-index: 1; list-style: none; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px; counter-reset: none; }
.model-steps li { min-height: 64px; padding: 11px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(255,255,255,.10); text-align: center; font-size: 12px; line-height: 1.35; font-weight: 720; }
.model-solved { box-shadow: 0 15px 34px -18px rgba(34,122,83,.58), inset 0 0 0 2px rgba(149,201,61,.26); }
.class-boundary-model { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: stretch; gap: 12px; }
.class-boundary-state { min-width: 0; min-height: 154px; padding: 13px; display: flex; flex-direction: column; justify-content: center; gap: 14px; border-radius: 15px; background: rgba(255,255,255,.10); animation: digit-group-in .5s cubic-bezier(.16,1,.3,1) both; }
.boundary-after { box-shadow: inset 0 0 0 2px rgba(149,201,61,.56); animation-delay: .38s; }
.class-boundary-state > span { font: 850 clamp(25px,4.2vw,39px)/1 'JetBrains Mono', monospace; letter-spacing: .05em; text-align: center; }
.class-boundary-state > div { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 7px; }
.class-boundary-state strong { min-width: 0; padding: 8px 5px; display: flex; flex-direction: column; align-items: center; gap: 5px; border-radius: 10px; background: rgba(255,255,255,.09); font: 850 18px/1 'JetBrains Mono', monospace; }
.class-boundary-state strong i { color: rgba(255,255,255,.64); font: 750 11px/1.2 Manrope, sans-serif; font-style: normal; text-align: center; }
.boundary-after strong:last-child { color: ${T.lime}; }
.class-boundary-carry { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; color: ${T.lime}; }
.class-boundary-carry b { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 12px; color: ${T.navy}; background: ${T.lime}; font: 900 11px/1 'JetBrains Mono', monospace; animation: boundary-carry-hop 2.4s ease-in-out 2; }
.class-boundary-carry span { font-size: 25px; font-weight: 900; }
@keyframes boundary-carry-hop { 50% { transform: translateY(-5px) scale(1.06); } }
.zero-contrast-model { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11px; }
.zero-contrast-model article { min-width: 0; min-height: 162px; padding: 14px; display: flex; flex-direction: column; justify-content: center; gap: 10px; border-radius: 15px; background: rgba(255,255,255,.10); animation: digit-group-in .5s ease var(--model-delay) both; }
.zero-contrast-number { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 7px; }
.zero-contrast-number strong { min-width: 0; padding: 10px 4px; border-radius: 11px; background: rgba(22,143,163,.24); box-shadow: inset 0 0 0 2px rgba(22,143,163,.62); font: 850 clamp(24px,4vw,36px)/1 'JetBrains Mono', monospace; letter-spacing: .04em; text-align: center; }
.zero-contrast-number .empty-class { color: ${T.lime}; background: rgba(149,201,61,.13); box-shadow: inset 0 0 0 2px rgba(149,201,61,.58); }
.zero-contrast-model p { color: ${T.paper}; font-family: 'Source Serif 4', serif; font-size: 16px; line-height: 1.28; }
.zero-contrast-model article > span { color: #9DE3E7; font-size: 11px; font-weight: 850; letter-spacing: .06em; text-transform: uppercase; }
.theory-screen .model-panel {
  animation: digit-group-in .48s cubic-bezier(.22,.8,.3,1) .08s both;
}
.theory-screen .class-group,
.theory-screen .place-cell,
.theory-screen .model-row-list > div,
.theory-screen .model-steps > li {
  animation: digit-group-in .48s cubic-bezier(.22,.8,.3,1) both;
}
.theory-screen .class-group:nth-child(1),
.theory-screen .place-cell:nth-child(1),
.theory-screen .model-row-list > div:nth-child(1),
.theory-screen .model-steps > li:nth-child(1) { animation-delay: .16s; }
.theory-screen .class-group:nth-child(2),
.theory-screen .place-cell:nth-child(2),
.theory-screen .model-row-list > div:nth-child(2),
.theory-screen .model-steps > li:nth-child(2) { animation-delay: .27s; }
.theory-screen .place-cell:nth-child(3),
.theory-screen .model-row-list > div:nth-child(3),
.theory-screen .model-steps > li:nth-child(3) { animation-delay: .38s; }
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
.hook-mission-scene .model-panel {
  height: auto;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(190px,.48fr) minmax(0,1fr);
  align-items: center;
  column-gap: 16px;
}
.hook-mission-scene .model-heading { grid-column: 1 / -1; }
.hook-mission-scene .model-number { grid-column: 1; }
.hook-mission-scene .class-groups { grid-column: 2; }
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
.foundation-theory-layout { display: grid; grid-template-columns: minmax(0,.8fr) minmax(0,1.2fr); gap: 16px; }
.foundation-recap-strip { padding: 18px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; border-radius: 20px; background: ${T.navy}; }
.foundation-recap-card { min-width: 0; min-height: 130px; padding: 12px 8px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 11px; border-radius: 15px; color: ${T.paper}; background: rgba(255,255,255,.1); animation: digit-group-in .48s ease var(--theory-delay) both; }
.foundation-recap-card span { color: rgba(255,255,255,.68); font-size: 11px; text-align: center; }
.foundation-recap-card strong { font: 800 38px/1 'JetBrains Mono', monospace; }
.rule-theory-layout { position: relative; }
.rule-assembly-line { width: min(360px,80%); height: 34px; margin: -7px auto 5px; display: grid; grid-template-columns: repeat(3,1fr); align-items: center; position: relative; }
.rule-assembly-line::before { content: ''; position: absolute; left: 14%; right: 14%; height: 3px; border-radius: 999px; background: ${T.lime}; transform: scaleX(0); transform-origin: left; animation: rule-line-in .7s ease .55s forwards; }
.rule-assembly-line i { z-index: 1; width: 28px; height: 28px; margin: auto; display: grid; place-items: center; border-radius: 50%; color: ${T.navy}; background: ${T.lime}; font-style: normal; font: 900 12px/1 'JetBrains Mono', monospace; animation: digit-group-in .45s ease var(--theory-delay) both; }
@keyframes rule-line-in { to { transform: scaleX(1); } }
.theory-callout-rule { box-shadow: inset 4px 0 0 ${T.lime}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.strategy-route { padding: 16px; display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: stretch; gap: 9px; border-radius: 20px; background: ${T.navy}; }
.strategy-route > i { align-self: center; color: ${T.lime}; font-style: normal; font-weight: 900; }
.strategy-route-step { min-width: 0; min-height: 92px; padding: 11px; display: flex; flex-direction: column; justify-content: center; gap: 8px; border-radius: 14px; color: ${T.paper}; background: rgba(255,255,255,.1); animation: digit-group-in .48s ease var(--theory-delay) both; }
.strategy-route-step span { width: 27px; height: 27px; display: grid; place-items: center; border-radius: 9px; color: ${T.navy}; background: ${T.lime}; font: 900 11px/1 'JetBrains Mono', monospace; }
.strategy-route-step p { font-size: 12px; line-height: 1.35; font-weight: 720; }
.strategy-contrast-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11px; }
.strategy-contrast-grid article { min-height: 132px; padding: 16px; display: flex; flex-direction: column; gap: 7px; border-radius: 17px; animation: explanation-copy-in .52s ease both; }
.strategy-contrast-grid article > span { font-size: 11px; font-weight: 900; letter-spacing: .13em; }
.strategy-contrast-grid article > strong { color: ${T.navy}; font-family: 'Source Serif 4', serif; font-size: 16px; line-height: 1.3; }
.strategy-contrast-grid article > p { margin-top: auto; color: ${T.ink2}; font-size: 12px; line-height: 1.43; }
.strategy-contrast-reliable { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.strategy-contrast-trap { color: ${T.warn}; background: ${T.warnSoft}; box-shadow: inset 4px 0 0 ${T.warn}; animation-delay: .18s !important; }
.theory-callout-strategy { margin-top: 14px; box-shadow: inset 4px 0 0 ${T.success}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.error-theory-layout { display: grid; grid-template-columns: 1fr; gap: 14px; align-items: start; }
.error-walkthrough-board { padding: 17px; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)) auto minmax(0,1fr); align-items: stretch; gap: 8px; border-radius: 20px; background: ${T.navy}; }
.error-walkthrough-row, .error-repair-result { min-height: 56px; padding: 9px 13px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-radius: 13px; color: ${T.paper}; background: rgba(255,255,255,.1); animation: digit-group-in .48s ease var(--theory-delay) both; }
.error-walkthrough-row span, .error-repair-result span { color: rgba(255,255,255,.68); font-size: 11px; font-weight: 800; text-transform: uppercase; }
.error-walkthrough-row strong, .error-repair-result strong { font: 800 25px/1 'JetBrains Mono', monospace; }
.error-row-draft { box-shadow: inset 4px 0 0 ${T.warn}; }
.error-repair-arrow { display: grid; place-items: center; color: ${T.lime}; text-align: center; font-size: 22px; font-weight: 900; transform: rotate(-90deg); }
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
.finale-heading { min-width: 0; padding: 12px 15px; border-radius: 17px; background: linear-gradient(135deg, ${T.paper}, ${T.cyanSoft}); box-shadow: 0 12px 28px -22px rgba(${T.shadowBase},.38); }
.finale-heading > span { display: block; margin-bottom: 4px; color: ${T.accent}; font: 900 9px/1 'JetBrains Mono', monospace; letter-spacing: .15em; }
.finale-heading h1 { color: ${T.navy}; font: 650 clamp(20px,3vw,28px)/1.08 'Source Serif 4', serif; overflow-wrap: anywhere; }
.finale-heading p { max-width: 760px; margin-top: 5px; color: ${T.ink2}; font-size: 12px; line-height: 1.42; overflow-wrap: anywhere; }
.finale-layout { min-width: 0; display: grid; grid-template-columns: minmax(0,1fr) minmax(340px,.58fr); gap: 12px; align-items: stretch; }
.finale-main { min-width: 0; display: flex; flex-direction: column; gap: 9px; }
.finale-actions { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.finale-reflection { padding: 10px; border-radius: 15px; background: ${T.paper}; box-shadow: 0 10px 24px -19px rgba(${T.shadowBase},.36); }
.finale-reflection > strong { display: block; color: ${T.navy}; font: 700 13px/1.25 'Source Serif 4',serif; }
.finale-reflection > div { margin-top: 7px; display: grid; gap: 5px; }
.finale-reflection button { min-height: 36px; padding: 6px 7px; border: 0; border-radius: 10px; display: grid; grid-template-columns: 22px minmax(0,1fr); align-items: center; gap: 6px; color: ${T.ink2}; background: ${T.cyanSoft}; text-align: left; font-size: 9px; line-height: 1.25; cursor: pointer; }
.finale-reflection button span { width: 22px; height: 22px; border-radius: 7px; display: grid; place-items: center; color: ${T.paper}; background: ${T.cyan}; font: 900 9px/1 'JetBrains Mono',monospace; }
.finale-reflection button.is-selected { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 3px 0 0 ${T.success}; }
.finale-actions .g4-title-claim { min-height: 70px; padding: 9px 12px; }
.finale-mastery { min-width: 0; display: grid; grid-template-columns: 1fr; gap: 8px; }
.finale-takeaway { min-width: 0; min-height: 66px; padding: 10px; display: grid; grid-template-columns: 34px minmax(0,1fr); align-items: center; gap: 9px; border-radius: 14px; background: ${T.paper}; box-shadow: 0 10px 24px -19px rgba(${T.shadowBase},.36); opacity: 0; transform: translateY(8px); transition: opacity .34s ease, transform .34s ease; }
.finale-takeaway.is-visible { opacity: 1; transform: none; }
.finale-takeaway > span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px; color: ${T.paper}; background: ${T.cyan}; font: 900 10px/1 'JetBrains Mono', monospace; }
.finale-takeaway:nth-child(2) > span { background: ${T.accent}; }
.finale-takeaway:nth-child(3) > span { background: ${T.success}; }
.finale-takeaway p { color: ${T.ink}; font-size: 11px; line-height: 1.38; font-weight: 720; overflow-wrap: anywhere; }
.finale-proof, .finale-bridge { min-width: 0; opacity: 0; transform: translateY(7px); transition: opacity .34s ease, transform .34s ease; }
.finale-proof.is-visible, .finale-bridge.is-visible { opacity: 1; transform: none; }
.finale-proof { padding: 9px 12px; display: grid; grid-template-columns: auto auto minmax(0,1fr); align-items: center; gap: 9px; border-radius: 13px; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.finale-proof > span, .finale-bridge strong { color: ${T.success}; font: 900 9px/1.2 'JetBrains Mono', monospace; letter-spacing: .1em; }
.finale-proof > strong { color: ${T.navy}; font: 800 15px/1 'JetBrains Mono', monospace; white-space: nowrap; }
.finale-proof p, .finale-bridge p { color: ${T.ink2}; font-size: 11px; line-height: 1.35; overflow-wrap: anywhere; }
.finale-bridge { padding: 9px 11px; display: grid; grid-template-columns: 30px minmax(0,1fr); align-items: center; gap: 9px; border-radius: 13px; background: ${T.accentSoft}; }
.finale-bridge > span { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 10px; color: ${T.paper}; background: ${T.accent}; font-weight: 900; }
.finale-bridge strong { color: ${T.accent}; }
.finale-bridge p { margin-top: 3px; }
.finale-reward { position: relative; min-width: 0; min-height: 206px; padding: 15px 76px 14px 62px; display: flex; align-items: center; overflow: hidden; border-radius: 18px; color: ${T.paper}; background: linear-gradient(145deg, ${T.navy}, #0f2c40); box-shadow: 0 16px 32px -22px rgba(${T.shadowBase},.58); }
.finale-reward-copy { position: relative; z-index: 2; min-width: 0; }
.finale-reward-copy > span { color: ${T.lime}; font: 900 9px/1.2 'JetBrains Mono', monospace; letter-spacing: .12em; }
.finale-reward-copy h2 { margin-top: 5px; font: 650 19px/1.05 'Source Serif 4', serif; overflow-wrap: anywhere; }
.finale-status { margin-top: 10px; }
.finale-status strong { display: block; color: ${T.lime}; font: 850 25px/1 'JetBrains Mono', monospace; }
.finale-status p { margin-top: 3px; font-size: 11px; line-height: 1.25; font-weight: 800; }
.finale-status small { display: block; margin-top: 3px; color: rgba(255,255,255,.68); font-size: 9px; line-height: 1.3; }
.finale-status-neutral strong { font-size: 22px; }
.finale-medal { position: absolute; z-index: 2; left: 11px; top: 50%; width: 39px; height: 39px; display: grid; place-items: center; border-radius: 50%; color: ${T.navy}; background: ${T.lime}; box-shadow: 0 0 0 5px rgba(196,232,92,.14); transform: translateY(-50%) scale(.78); transition: transform .38s ease; }
.finale-reward.is-complete .finale-medal { transform: translateY(-50%) scale(1); }
.finale-reward-bit { position: absolute; z-index: 1; right: 1px; bottom: -5px; width: 76px; height: 96px; }
.finale-reward-bit .g1-char { width: 100%; height: 100%; }
.finale-reward.is-complete .finale-reward-bit { animation: finale-bit-float 3.2s ease-in-out 2; }
.finale-confetti i { position: absolute; z-index: 0; top: 12px; left: 20%; width: 5px; height: 9px; border-radius: 3px; background: ${T.lime}; opacity: 0; }
.finale-confetti i:nth-child(2) { left: 34%; background: ${T.accent}; transform: rotate(24deg); }
.finale-confetti i:nth-child(3) { left: 49%; background: ${T.cyan}; transform: rotate(-20deg); }
.finale-confetti i:nth-child(4) { left: 63%; top: 22px; background: ${T.paper}; }
.finale-confetti i:nth-child(5) { left: 78%; background: ${T.accent}; transform: rotate(38deg); }
.finale-confetti i:nth-child(6) { left: 27%; top: 34px; background: ${T.cyan}; }
.finale-confetti i:nth-child(7) { left: 57%; top: 42px; background: ${T.lime}; transform: rotate(-34deg); }
.finale-confetti i:nth-child(8) { left: 86%; top: 34px; background: ${T.paper}; }
.finale-reward.is-complete .finale-confetti i { animation: finale-confetti-fall 1.45s ease-out both; }
.finale-reward.is-complete .finale-confetti i:nth-child(even) { animation-delay: .1s; }
@keyframes finale-bit-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes finale-confetti-fall { 0% { opacity: 0; translate: 0 -8px; } 20% { opacity: .9; } 100% { opacity: 0; translate: 5px 78px; rotate: 160deg; } }
.deep-sequence-tabs {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 10px;
}
.deep-sequence-tabs button {
  min-height: 58px;
  padding: 10px 13px;
  display: grid;
  grid-template-columns: 34px minmax(0,1fr);
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: 14px;
  color: ${T.ink2};
  background: rgba(255,255,255,.72);
  cursor: pointer;
  text-align: left;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.17);
  transition: transform .2s ease, color .2s ease, background .2s ease, box-shadow .2s ease;
}
.deep-sequence-tabs button:hover { transform: translateY(-1px); }
.deep-sequence-tabs button > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: ${T.cyanSoft};
  color: ${T.cyan};
  font: 900 11px/1 'JetBrains Mono', monospace;
}
.deep-sequence-tabs button strong { font-size: 12px; line-height: 1.3; }
.deep-sequence-tabs .deep-tab-active {
  color: ${T.navy};
  background: ${T.paper};
  box-shadow: inset 0 0 0 2px rgba(22,143,163,.38), 0 10px 24px -16px rgba(22,143,163,.46);
}
.deep-sequence-tabs .deep-tab-active > span { color: ${T.paper}; background: ${T.cyan}; }
.deep-sequence-tabs .deep-tab-seen > span { color: ${T.navy}; background: ${T.lime}; }
.deep-sequence-stage {
  display: grid;
  grid-template-columns: minmax(0,1fr) minmax(260px,.72fr);
  gap: 10px;
  align-items: start;
  animation: deep-stage-in .5s cubic-bezier(.22,.8,.3,1) both;
}
@keyframes deep-stage-in {
  from { opacity: .28; transform: translateY(10px); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
.deep-sequence-stage .model-panel { width: 100%; min-height: 0; align-self: start; display: flex; flex-direction: column; justify-content: center; }
.deep-sequence-stage .model-classes:has(> .model-number),
.deep-sequence-stage .model-table:has(> .model-number) {
  display: grid;
  grid-template-columns: minmax(180px,.44fr) minmax(0,1fr);
  align-items: center;
  column-gap: 14px;
}
.deep-sequence-stage .model-classes:has(> .model-number) .model-heading,
.deep-sequence-stage .model-table:has(> .model-number) .model-heading { grid-column: 1 / -1; }
.deep-sequence-stage .model-classes:has(> .model-number) .model-number,
.deep-sequence-stage .model-table:has(> .model-number) .model-number { grid-column: 1; }
.deep-sequence-stage .model-classes:has(> .model-number) .class-groups,
.deep-sequence-stage .model-table:has(> .model-number) .place-table { grid-column: 2; }
.deep-sequence-explanation {
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  border-radius: 20px;
  background: ${T.accentSoft};
  box-shadow: inset 4px 0 0 ${T.accent}, 0 12px 28px -18px rgba(${T.shadowBase},.34);
}
.deep-sequence-explanation > span { color: ${T.accent}; font-size: 11px; font-weight: 900; letter-spacing: .14em; }
.deep-sequence-explanation h2 { font-family: 'Source Serif 4', serif; font-size: clamp(19px,2.6vw,26px); line-height: 1.2; font-weight: 650; }
.deep-sequence-explanation p { color: ${T.ink2}; font-size: 13px; line-height: 1.48; }
.deep-sequence-misconception { padding: 7px 9px; border-radius: 10px; color: ${T.warn}; background: ${T.warnSoft}; font-size: 10px; line-height: 1.35; }
.deep-contrast-row { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.deep-contrast-row article {
  min-height: 78px;
  padding: 12px 14px;
  border-radius: 14px;
  background: ${T.paper};
  opacity: .2;
  transform: translateY(8px);
  transition: opacity .35s ease, transform .35s ease, box-shadow .35s ease;
  box-shadow: inset 3px 0 0 rgba(135,148,157,.24);
}
.deep-contrast-row article.deep-insight-visible {
  opacity: 1;
  transform: translateY(0);
  box-shadow: inset 3px 0 0 ${T.success}, 0 9px 24px -20px rgba(${T.shadowBase},.3);
}
.deep-contrast-row article span { color: ${T.success}; font-size: 11px; font-weight: 900; letter-spacing: .13em; }
.deep-contrast-row article strong { display: block; margin-top: 6px; color: ${T.navy}; font-size: 12px; line-height: 1.35; }
.deep-contrast-row article p { margin-top: 5px; color: ${T.ink2}; font-size: 11px; line-height: 1.4; }
.deep-replay {
  min-width: 48px;
  min-height: 48px;
  align-self: center;
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 12px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
}
.worked-featured-example {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  align-items: start;
}
.worked-featured-example > .model-panel { width: 100%; min-height: 0; align-self: start; }
.worked-featured-example > div:last-child {
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 9px;
  border-radius: 18px;
  background: ${T.cyanSoft};
  box-shadow: inset 4px 0 0 ${T.cyan};
  animation: explanation-copy-in .5s ease .22s both;
}
.worked-featured-example > div:last-child > span { color: ${T.cyan}; font-size: 11px; font-weight: 900; letter-spacing: .14em; }
.worked-featured-example h2 { font-family: 'Source Serif 4', serif; font-size: clamp(17px,2.4vw,23px); line-height: 1.2; }
.worked-featured-example p { color: ${T.ink2}; font-size: 12px; line-height: 1.45; }
.worked-examples-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.worked-example-card { min-height: 132px; padding: 15px; display: grid; grid-template-columns: 38px minmax(0,1fr); gap: 11px; border-radius: 17px; background: ${T.paper}; box-shadow: 0 12px 28px -20px rgba(${T.shadowBase},.34); animation: digit-group-in .5s ease var(--example-delay) both; }
.worked-example-number { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 11px; color: ${T.paper}; background: ${T.cyan}; font: 900 11px/1 'JetBrains Mono', monospace; }
.worked-example-card h2 { color: ${T.ink}; font-family: 'Source Serif 4', serif; font-size: 16px; line-height: 1.28; font-weight: 650; }
.worked-example-card strong { display: block; margin-top: 8px; color: ${T.success}; font: 800 17px/1.3 'JetBrains Mono', monospace; }
.worked-example-card p { margin-top: 6px; color: ${T.ink2}; font-size: 12px; line-height: 1.4; }
.worked-examples-finish { padding: 8px 15px; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 15px; color: ${T.success}; background: ${T.successSoft}; font-weight: 800; animation: explanation-copy-in .55s ease .55s both; }
.worked-examples-finish .g1-char { width: 54px; height: 68px; }
.city-lab-tabs { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px; }
.city-lab-tabs button { min-height: 62px; padding: 9px 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px; border: 0; border-radius: 14px; color: ${T.ink2}; background: rgba(255,255,255,.72); cursor: pointer; box-shadow: inset 0 0 0 1px rgba(135,148,157,.17); transition: transform .2s ease, color .2s ease, background .2s ease, box-shadow .2s ease; }
.city-lab-tabs button:hover { transform: translateY(-1px); }
.city-lab-tabs button > span { padding: 6px 8px; border-radius: 9px; color: ${T.cyan}; background: ${T.cyanSoft}; font: 900 11px/1 'JetBrains Mono', monospace; }
.city-lab-tabs button > strong { font: 850 14px/1 'JetBrains Mono', monospace; }
.city-lab-tabs .city-lab-tab-active { color: ${T.navy}; background: ${T.paper}; box-shadow: inset 0 0 0 2px rgba(22,143,163,.42), 0 10px 24px -16px rgba(22,143,163,.5); }
.city-lab-tabs .city-lab-tab-active > span { color: ${T.paper}; background: ${T.cyan}; }
.city-lab-tabs .city-lab-tab-seen > span { color: ${T.navy}; background: ${T.lime}; }
.city-lab-solution { padding: 12px; display: grid; gap: 8px; border-radius: 18px; background: ${T.paper}; box-shadow: 0 12px 30px -18px rgba(${T.shadowBase},.32); animation: deep-stage-in .5s cubic-bezier(.22,.8,.3,1) both; }
.city-lab-voice { padding: 9px 12px; display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; gap: 10px; border-radius: 13px; color: ${T.paper}; background: ${T.navy}; }
.city-lab-voice span { color: ${T.lime}; font-size: 11px; font-weight: 900; letter-spacing: .13em; }
.city-lab-voice p { font-family: 'Source Serif 4', serif; font-size: clamp(17px,2.6vw,23px); line-height: 1.28; }
.city-lab-path { display: grid; grid-template-columns: 1fr auto 1fr auto 1.2fr; align-items: stretch; gap: 8px; }
.city-lab-path > i { align-self: center; color: ${T.accent}; font-style: normal; font-weight: 900; }
.city-lab-path article { min-width: 0; min-height: 90px; padding: 9px; display: flex; flex-direction: column; justify-content: center; gap: 6px; border-radius: 13px; background: #F8F8F4; animation: digit-group-in .5s ease both; }
.city-lab-path article:nth-of-type(2) { animation-delay: .14s; }
.city-lab-path article:nth-of-type(3) { animation-delay: .28s; }
.city-lab-path article > span { width: 29px; height: 29px; display: grid; place-items: center; border-radius: 9px; color: ${T.paper}; background: ${T.cyan}; font: 900 11px/1 'JetBrains Mono', monospace; }
.city-lab-path article > small { color: ${T.ink3}; font-size: 11px; font-weight: 850; letter-spacing: .1em; text-transform: uppercase; }
.city-lab-path article > div { display: flex; gap: 6px; }
.city-lab-path article strong { min-width: 0; padding: 7px; border-radius: 9px; color: ${T.navy}; background: ${T.cyanSoft}; font: 850 clamp(15px,2.4vw,21px)/1 'JetBrains Mono', monospace; text-align: center; }
.city-lab-path article p { color: ${T.ink2}; font-family: 'Source Serif 4', serif; font-size: 14px; line-height: 1.35; }
.city-lab-note { min-height: 58px; padding: 4px 12px 4px 3px; display: grid; grid-template-columns: 48px minmax(0,1fr); align-items: center; gap: 8px; border-radius: 13px; color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.city-lab-note .g1-char { width: 46px; height: 56px; }
.city-lab-note p { color: ${T.ink2}; font-size: 12px; line-height: 1.42; font-weight: 720; }
.city-lab-next { margin-top: -4px; }
.deep-sequence-screen { gap: 10px; }
.deep-sequence-screen .screen-heading { grid-template-columns: minmax(0,1fr) 86px; gap: 12px; }
.deep-sequence-screen .heading-copy h1 { font-size: clamp(23px,3vw,32px); line-height: 1.06; }
.deep-sequence-screen .heading-copy p { margin-top: 6px; font-size: 12px; line-height: 1.35; }
.deep-sequence-screen .lesson-kicker { margin-bottom: 5px; font-size: 9px; }
.deep-sequence-screen .bit-coach { width: 86px; height: 90px; border-radius: 20px; }
.deep-sequence-screen .bit-coach .g1-char { width: 70px; height: 88px; }
.deep-sequence-stage > .model-panel { min-height: 0; padding: 12px; }
.deep-sequence-stage .model-heading { margin-bottom: 7px; font-size: 9px; }
.deep-sequence-stage .model-number { font-size: 30px; line-height: 1.15; }
.deep-sequence-stage .class-groups { gap: 6px; }
.deep-sequence-stage .class-group { min-height: 58px; gap: 3px; }
.deep-sequence-stage .class-group strong { font-size: 24px; }
.deep-sequence-stage .class-group span { font-size: 9px; }
.deep-sequence-stage .place-table { gap: 4px; }
.deep-sequence-stage .place-cell { min-height: 50px; padding: 4px 2px; gap: 3px; }
.deep-sequence-stage .place-cell span { min-height: 22px; font-size: 8px; }
.deep-sequence-stage .place-cell strong { font-size: 18px; }
.deep-sequence-stage .model-row-list { gap: 5px; }
.deep-sequence-stage .model-row-list > div { min-height: 42px; padding: 6px 8px; gap: 6px; }
.deep-sequence-stage .model-row-list span { font-size: 9px; }
.deep-sequence-stage .model-row-list strong { max-width: 68%; font-size: clamp(13px,1.7vw,17px); line-height: 1.25; overflow-wrap: anywhere; text-align: right; }
.deep-sequence-explanation { min-height: 0; padding: 12px; justify-content: flex-start; gap: 6px; border-radius: 17px; }
.deep-sequence-explanation > span { font-size: 9px; }
.deep-sequence-explanation h2 { font-size: clamp(17px,2vw,21px); line-height: 1.25; }
.deep-sequence-explanation p { font-size: 11px; line-height: 1.35; }
.deep-sequence-misconception { padding: 6px 8px; font-size: 9px; line-height: 1.3; }
.screen-stack.choice-screen { gap: 8px; }
.choice-screen:not(.etalon-hook-screen) .screen-heading { grid-template-columns: minmax(0,1fr); gap: 10px; }
.number-input-screen .screen-heading, .bit-free-heading { grid-template-columns: minmax(0,1fr); }
.choice-screen:not(.etalon-hook-screen) .heading-copy h1 { font-size: clamp(22px,2.8vw,30px); line-height: 1.08; }
.choice-screen:not(.etalon-hook-screen) .heading-copy p { margin-top: 5px; font-size: 11px; line-height: 1.35; }
.choice-screen:not(.etalon-hook-screen) .bit-coach { width: 86px; height: 88px; border-radius: 19px; }
.choice-screen:not(.etalon-hook-screen) .bit-coach .g1-char { width: 68px; height: 85px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel { padding: 9px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .model-heading { margin-bottom: 5px; font-size: 9px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .model-number { font-size: 27px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .class-groups { gap: 5px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .class-group { min-height: 48px; gap: 2px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .class-group strong { font-size: 21px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .class-group span { font-size: 8px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .place-table { gap: 3px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .place-cell { min-height: 43px; padding: 3px 1px; gap: 2px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .place-cell span { min-height: 20px; font-size: 7px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .place-cell strong { font-size: 16px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .model-row-list { grid-template-columns: repeat(auto-fit,minmax(110px,1fr)); gap: 5px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .model-row-list > div { min-height: 40px; padding: 5px 7px; gap: 5px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .model-row-list span { font-size: 8px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .model-row-list strong { font-size: clamp(12px,1.6vw,16px); }
.choice-screen:not(.etalon-hook-screen) .question-card { padding: 12px; }
.choice-screen:not(.etalon-hook-screen) .question-card h2 { font-size: 19px; }
.choice-screen:not(.etalon-hook-screen) .options-grid { margin-top: 7px; gap: 6px; }
.choice-screen:not(.etalon-hook-screen) .option { min-height: 50px; padding: 7px 9px; font-size: 11px; }
.choice-screen:not(.etalon-hook-screen) .feedback { height: 70px; margin-top: 4px; overflow: hidden; }
.choice-screen:not(.etalon-hook-screen) .feedback-card { min-height: 70px; padding: 5px 9px 5px 3px; grid-template-columns: 58px minmax(0,1fr); gap: 6px; }
.choice-screen:not(.etalon-hook-screen) .feedback-bit { width: 58px; height: 64px; }
.choice-screen:not(.etalon-hook-screen) .feedback-card .g1-char { width: 53px; height: 64px; }
.choice-screen:not(.etalon-hook-screen) .feedback-card strong { margin-bottom: 2px; font-size: 11px; }
.choice-screen:not(.etalon-hook-screen) .feedback-card p { font-size: 10px; line-height: 1.3; }
.city-code-lab-screen { gap: 8px; }
.city-code-lab-screen .screen-heading { grid-template-columns: minmax(0,1fr); gap: 9px; }
.city-code-lab-screen .heading-copy h1 { font-size: clamp(22px,2.8vw,29px); }
.city-code-lab-screen .heading-copy p { margin-top: 5px; font-size: 11px; line-height: 1.32; }
.city-code-lab-screen .bit-coach { width: 82px; height: 84px; }
.city-code-lab-screen .bit-coach .g1-char { width: 65px; height: 81px; }
.city-code-lab-screen .city-lab-tabs button { min-height: 48px; padding: 6px 9px; }
.city-code-lab-screen .city-lab-solution { padding: 8px; gap: 6px; }
.city-code-lab-screen .city-lab-voice { padding: 7px 9px; }
.city-code-lab-screen .city-lab-path article { min-height: 74px; padding: 6px; gap: 4px; }
.city-code-lab-screen .city-lab-note { min-height: 50px; }
.city-code-lab-screen .city-lab-next { min-height: 44px; }
.question-card { padding: 22px; border-radius: 20px; background: ${T.paper}; box-shadow: 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.question-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; color: ${T.accent}; font-size: 11px; font-weight: 900; letter-spacing: .14em; }
.question-topline small { color: ${T.warn}; font-size: 11px; letter-spacing: 0; }
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
.number-entry-row { margin-top: 16px; display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
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
.btn-check { flex: 0 0 auto; }
.feedback { height: 82px; margin-top: 6px; overflow: visible; opacity: 0; visibility: hidden; transition: opacity .28s ease; }
.feedback-visible { opacity: 1; visibility: visible; }
.feedback-card { min-height: 82px; padding: 8px 13px 8px 5px; display: grid; grid-template-columns: 70px minmax(0,1fr); align-items: center; gap: 9px; border-radius: 15px; }
.feedback-bit { width: 70px; height: 80px; display: grid; place-items: center; }
.feedback-card .g1-char { width: 66px; height: 80px; }
.feedback-card strong { display: block; margin-bottom: 5px; font-family: 'Source Serif 4', serif; font-size: 13px; letter-spacing: .08em; }
.feedback-card p { color: ${T.ink2}; font-size: 13px; line-height: 1.45; }
.feedback-correct { background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.feedback-correct strong { color: ${T.success}; }
.feedback-hint { background: ${T.warnSoft}; box-shadow: inset 4px 0 0 ${T.warn}; }
.feedback-hint strong { color: ${T.warn}; }
.fact-card, .bridge-card { margin-top: 12px; padding: 13px 15px; display: flex; align-items: flex-start; gap: 11px; border-radius: 13px; }
.fact-card { background: ${T.cyanSoft}; color: ${T.cyan}; }
.fact-card strong { font-size: 11px; letter-spacing: .14em; }
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
  .bit-free-heading, .number-input-screen .screen-heading, .choice-screen:not(.etalon-hook-screen) .screen-heading, .city-code-lab-screen .screen-heading { grid-template-columns: minmax(0,1fr); }
  .bit-coach { width: 94px; height: 102px; }
  .bit-coach .g1-char { width: 78px; height: 100px; }
  .options-grid { grid-template-columns: 1fr; }
  .etalon-hook-screen .options-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .hook-theory-layout, .foundation-theory-layout, .error-theory-layout { grid-template-columns: 1fr; }
  .deep-sequence-stage, .worked-featured-example { grid-template-columns: 1fr; }
  .hook-mission-scene .model-panel,
  .deep-sequence-stage .model-classes:has(> .model-number),
  .deep-sequence-stage .model-table:has(> .model-number) { display: flex; flex-direction: column; }
  .error-walkthrough-board { display: flex; flex-direction: column; }
  .error-repair-arrow { transform: none; }
  .class-boundary-model { grid-template-columns: 1fr; }
  .class-boundary-carry { flex-direction: row; }
  .class-boundary-carry > span { transform: rotate(90deg); }
  .zero-contrast-model { grid-template-columns: 1fr; }
  .finale-layout { grid-template-columns: 1fr; }
  .finale-actions { width: 100%; }
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
  .screen-heading { grid-template-columns: minmax(0,1fr) 76px; gap: 8px; }
  .bit-free-heading, .number-input-screen .screen-heading, .choice-screen:not(.etalon-hook-screen) .screen-heading, .city-code-lab-screen .screen-heading { grid-template-columns: minmax(0,1fr); }
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
  .class-group span { font-size: 11px; }
  .place-table { gap: 4px; }
  .place-cell { min-height: 64px; padding: 5px 2px; }
  .place-cell span { min-height: 36px; font-size: 11px; }
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
  .etalon-hook-screen { gap: 7px; }
  .etalon-hook-screen .question-card { padding: 11px; }
  .etalon-hook-screen .option { min-height: 48px; padding: 7px 8px; font-size: 11px; }
  .btn { min-height: 48px; padding: 0 14px; font-size: 12px; }
  .number-entry-row { gap: 7px; }
  .answer-input { min-height: 50px; padding: 8px 11px; font-size: 20px; }
  .lesson-preview .stage-header { padding-top: 60px; }
  .rapid-score { width: 72px; height: 72px; border-radius: 20px; }
  .rapid-score strong { font-size: 30px; }
  .theory-callout { padding: 14px; border-radius: 16px; }
  .theory-answer { padding: 11px; grid-template-columns: 30px minmax(0,1fr); }
  .theory-answer p { font-size: 12px; }
  .hook-mission-scene .model-panel { min-height: 0; }
  .foundation-recap-strip { padding: 12px; gap: 6px; }
  .foundation-recap-card { min-height: 90px; padding: 8px 4px; }
  .foundation-recap-card span { font-size: 11px; }
  .foundation-recap-card strong { font-size: 28px; }
  .strategy-route { padding: 11px; grid-template-columns: 1fr; gap: 6px; }
  .strategy-route > i { transform: rotate(90deg); text-align: center; }
  .strategy-route-step { min-height: 62px; }
  .strategy-contrast-grid { grid-template-columns: 1fr; gap: 7px; }
  .strategy-contrast-grid article { min-height: 0; padding: 13px; }
  .summary-theory-cards { grid-template-columns: 1fr; }
  .worked-examples-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .deep-sequence-tabs, .deep-contrast-row { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .deep-sequence-tabs button { min-height: 52px; padding: 7px; grid-template-columns: 28px minmax(0,1fr); gap: 6px; }
  .deep-sequence-tabs button > span { width: 28px; height: 28px; font-size: 9px; }
  .deep-sequence-tabs button strong { font-size: 10px; }
  .deep-sequence-screen { gap: 8px; }
  .deep-sequence-screen .screen-heading { grid-template-columns: minmax(0,1fr) 70px; gap: 8px; }
  .deep-sequence-screen .heading-copy p { display: none; }
  .deep-sequence-screen .heading-copy h1 { font-size: 22px; }
  .deep-sequence-screen .bit-coach { width: 70px; height: 74px; }
  .deep-sequence-screen .bit-coach .g1-char { width: 58px; height: 72px; }
  .deep-sequence-tabs button { min-height: 46px; }
  .deep-sequence-stage { gap: 6px; }
  .deep-sequence-stage .model-panel { min-height: 0; padding: 8px; }
  .deep-sequence-stage .model-number { font-size: 25px; }
  .deep-sequence-stage .class-group { min-height: 48px; }
  .deep-sequence-stage .place-cell { min-height: 42px; }
  .deep-sequence-stage .model-row-list > div { min-height: 36px; padding: 4px 6px; }
  .deep-sequence-explanation { padding: 8px; border-radius: 14px; }
  .deep-sequence-misconception { display: none; }
  .deep-replay { min-height: 44px; }
  .deep-contrast-row article { min-height: 0; padding: 8px; }
  .deep-contrast-row article span { font-size: 8px; }
  .deep-contrast-row article strong { margin-top: 4px; font-size: 10px; }
  .deep-contrast-row article p { margin-top: 3px; font-size: 9px; line-height: 1.3; }
  .worked-example-card { min-height: 0; padding: 9px; grid-template-columns: 30px minmax(0,1fr); gap: 7px; }
  .worked-example-number { width: 30px; height: 30px; }
  .worked-example-card h2 { font-size: 13px; }
  .worked-example-card strong { margin-top: 5px; font-size: 14px; }
  .worked-example-card p { margin-top: 4px; font-size: 10px; }
  .summary-signal { min-height: 96px; }
  .class-boundary-state { min-height: 112px; padding: 10px; }
  .class-boundary-state > span { font-size: 27px; }
  .zero-contrast-model article { min-height: 124px; padding: 11px; }
  .zero-contrast-model p { font-size: 14px; }
  .city-lab-tabs { grid-template-columns: repeat(3,minmax(0,1fr)); gap: 5px; }
  .city-lab-tabs button { min-height: 50px; padding: 6px; flex-direction: column; justify-content: center; gap: 5px; }
  .city-lab-tabs button > span { padding: 4px 6px; font-size: 9px; }
  .city-lab-tabs button > strong { font-size: 11px; }
  .city-lab-solution { padding: 9px; gap: 7px; }
  .city-lab-voice { grid-template-columns: auto minmax(0,1fr); gap: 8px; padding: 8px 9px; }
  .city-lab-voice span { font-size: 9px; }
  .city-lab-voice p { font-size: 14px; }
  .city-lab-path { grid-template-columns: repeat(3,minmax(0,1fr)); gap: 5px; }
  .city-lab-path > i { display: none; }
  .city-lab-path article { min-height: 78px; padding: 7px; gap: 5px; }
  .city-lab-path article > span { width: 25px; height: 25px; }
  .city-lab-path article > small { font-size: 8px; }
  .city-lab-path article p { font-size: 10px; }
  .city-lab-note { min-height: 58px; padding-right: 9px; grid-template-columns: 44px minmax(0,1fr); }
  .city-lab-note .g1-char { width: 42px; height: 52px; }
  .city-lab-note p { font-size: 10px; }
  .choice-screen:not(.etalon-hook-screen) .heading-copy p { display: none; }
  .choice-screen:not(.etalon-hook-screen) .screen-heading { grid-template-columns: minmax(0,1fr); gap: 7px; }
  .choice-screen:not(.etalon-hook-screen) .heading-copy h1 { font-size: 20px; }
  .choice-screen:not(.etalon-hook-screen) .bit-coach { width: 66px; height: 68px; }
  .choice-screen:not(.etalon-hook-screen) .bit-coach .g1-char { width: 52px; height: 65px; }
  .choice-screen:not(.etalon-hook-screen) > .model-panel { padding: 7px; }
  .choice-screen:not(.etalon-hook-screen) > .model-panel .model-number { font-size: 23px; }
  .choice-screen:not(.etalon-hook-screen) > .model-panel .class-group { min-height: 40px; }
  .choice-screen:not(.etalon-hook-screen) > .model-panel .place-cell { min-height: 38px; }
  .choice-screen:not(.etalon-hook-screen) > .model-panel .model-row-list { grid-template-columns: repeat(4,minmax(0,1fr)); gap: 3px; }
  .choice-screen:not(.etalon-hook-screen) > .model-panel .model-row-list > div { min-height: 34px; padding: 3px 2px; display: grid; justify-items: center; gap: 2px; text-align: center; }
  .choice-screen:not(.etalon-hook-screen) > .model-panel .model-row-list span { font-size: 7px; }
  .choice-screen:not(.etalon-hook-screen) > .model-panel .model-row-list strong { font-size: 10px; }
  .choice-screen:not(.etalon-hook-screen) .question-card { padding: 9px; }
  .choice-screen:not(.etalon-hook-screen) .question-card h2 { font-size: 16px; }
  .choice-screen:not(.etalon-hook-screen) .options-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 5px; }
  .choice-screen:not(.etalon-hook-screen) .option { min-height: 46px; padding: 5px 6px; font-size: 9px; }
  .choice-screen:not(.etalon-hook-screen) .feedback { height: 64px; }
  .choice-screen:not(.etalon-hook-screen) .feedback-card { min-height: 64px; grid-template-columns: 50px minmax(0,1fr); }
  .choice-screen:not(.etalon-hook-screen) .feedback-bit { width: 50px; height: 58px; }
  .choice-screen:not(.etalon-hook-screen) .feedback-card .g1-char { width: 46px; height: 57px; }
  .choice-screen:not(.etalon-hook-screen) .feedback-card p { font-size: 9px; line-height: 1.25; }
  .choice-slide-3 .options-grid { grid-template-columns: repeat(3,minmax(0,1fr)); }
  .choice-slide-3 .option { min-height: 54px; padding: 6px 4px; justify-content: center; gap: 4px; font-size: 15px; }
  .choice-slide-3 .option-letter { width: 25px; height: 25px; }
  .choice-slide-5 .options-grid { grid-template-columns: 1fr; }
  .choice-slide-5 .option { min-height: 52px; padding: 7px 9px; font-size: 13px; }
  .choice-slide-9 .option { font-size: 13px; }
  .choice-slide-9 .option-letter { width: 32px; height: 32px; font-size: 14px; }
  .choice-number-frame { padding: 10px 12px; font-size: 33px; }
  .choice-prompt-frame { padding: 10px 12px; font-size: 18px; }
  .grouped-number-frame { padding: 11px; gap: 8px; border-radius: 18px; }
  .grouped-number-display { gap: 4px; }
  .grouped-digit-card { min-height: 88px; padding: 7px 2px; border-radius: 12px; }
  .grouped-digit-card strong { font-size: 28px; }
  .grouped-digit-card span { min-height: 24px; font-size: 7px; }
  .grouped-digit-boundary { margin-left: 8px; }
  .grouped-class-labels, .builder-class-labels { gap: 14px; }
  .grouped-class-labels span, .builder-class-labels span { padding: 5px 6px; font-size: 9px; }
  .grouped-number-caption { min-height: 58px; padding: 8px; grid-template-columns: 31px minmax(0,1fr); }
  .grouped-number-caption span { width: 31px; height: 31px; }
  .grouped-number-caption p { font-size: 11px; line-height: 1.32; }
  .spoken-builder-screen .screen-heading { grid-template-columns: minmax(0,1fr) 66px; }
  .spoken-builder-screen .bit-coach { width: 66px; height: 68px; }
  .spoken-builder-screen .bit-coach .g1-char { width: 52px; height: 65px; }
  .builder-guided-frame, .builder-interactive-frame, .strategy-builder-frame { padding: 10px; border-radius: 17px; }
  .builder-guided-digits, .builder-slots { gap: 4px; }
  .builder-guided-digits strong, .builder-slot { min-height: 58px; font-size: 27px; border-radius: 10px; }
  .builder-class-gap { margin-left: 8px; }
  .builder-guided-frame > p { padding: 8px; font-size: 11px; line-height: 1.3; }
  .builder-prompt { grid-template-columns: 31px minmax(0,1fr); gap: 7px; }
  .builder-prompt > span { width: 31px; height: 31px; }
  .builder-prompt h2 { font-size: 16px; }
  .builder-digit-tray { min-height: 57px; padding: 7px; gap: 7px; }
  .builder-digit { width: 44px; height: 44px; font-size: 21px; }
  .strategy-built { min-height: 96px; padding: 9px; }
  .strategy-built button, .strategy-fragment { min-height: 44px; padding: 7px 9px; font-size: 11px; }
  .strategy-fragment-tray { min-height: 58px; margin-top: 8px; gap: 6px; }
  .reading-matching-board { min-height: 250px; padding: 8px; grid-template-columns: minmax(78px,.6fr) 20px minmax(180px,1.4fr); gap: 4px; border-radius: 17px; }
  .reading-matching-column { gap: 8px; }
  .reading-match-card { min-height: 54px; padding: 7px 8px; border-radius: 11px; }
  .reading-number-card { font-size: 17px; }
  .reading-text-card { font-size: 10px; line-height: 1.22; }
  .city-code-lab-screen .heading-copy p { display: none; }
  .city-code-lab-screen .screen-heading { grid-template-columns: minmax(0,1fr); }
  .city-code-lab-screen .heading-copy h1 { font-size: 20px; }
  .city-code-lab-screen .bit-coach { width: 66px; height: 68px; }
  .city-code-lab-screen .bit-coach .g1-char { width: 52px; height: 65px; }
  .finale-heading { padding: 11px 12px; }
  .finale-heading h1 { font-size: 22px; }
  .finale-heading p { display: none; }
  .finale-mastery { grid-template-columns: 1fr; gap: 5px; }
  .finale-takeaway { min-height: 50px; padding: 7px 9px; }
  .finale-takeaway p { font-size: 9px; line-height: 1.3; }
  .finale-proof { grid-template-columns: 1fr; gap: 5px; }
  .finale-proof > strong { white-space: normal; }
  .finale-reward { min-height: 116px; padding: 11px 65px 11px 51px; }
  .finale-reward-copy h2 { font-size: 17px; }
  .finale-medal { left: 8px; width: 34px; height: 34px; }
  .finale-reward-bit { width: 62px; height: 78px; }
}
@media (max-width: 639.98px) and (max-height: 700px) {
  .stage-header { padding-top: 6px; padding-bottom: 5px; }
  .progress-track { height: 4px; margin-bottom: 6px; }
  .stage-content { padding-top: 5px; padding-bottom: 5px; }
  .stage-nav { min-height: 58px; padding-top: 5px; padding-bottom: 5px; }

  .etalon-hook-screen { gap: 5px; }
  .etalon-hook-screen .heading-copy h1 { font-size: 22px; line-height: 1.04; }
  .etalon-hook-screen .heading-copy p { margin-top: 3px; font-size: 11px; line-height: 1.25; }
  .etalon-hook-screen .lesson-kicker { margin-bottom: 3px; font-size: 9px; }
  .hook-story-frame { min-height: 88px; padding: 5px 8px; grid-template-columns: 64px minmax(0,1fr); gap: 7px; border-radius: 15px; }
  .hook-story-frame::after { border-radius: 14px; }
  .hook-story-bit { width: 62px; height: 80px; }
  .hook-story-frame .model-panel { min-height: 76px; padding: 6px; }
  .hook-story-frame .model-heading { margin-bottom: 4px; font-size: 8px; }
  .hook-story-frame .class-group { min-height: 48px; }
  .hook-story-frame .class-group strong { font-size: 21px; }
  .hook-story-frame .class-group span { font-size: 8px; }
  .etalon-hook-screen .question-card { padding: 8px; }
  .etalon-hook-screen .question-card h2 { font-size: 16px; line-height: 1.12; }
  .etalon-hook-screen .options-grid { margin-top: 5px; gap: 5px; }
  .etalon-hook-screen .option { min-height: 44px; padding: 5px 6px; font-size: 9px; }
  .etalon-hook-screen .option-letter { width: 25px; height: 25px; }
  .etalon-hook-screen .feedback { height: 66px; margin-top: 3px; overflow: hidden; }
  .etalon-hook-screen .feedback-card { min-height: 66px; padding: 5px 7px 5px 2px; grid-template-columns: 48px minmax(0,1fr); gap: 5px; }
  .etalon-hook-screen .feedback-bit { width: 48px; height: 58px; }
  .etalon-hook-screen .feedback-card .g1-char { width: 44px; height: 56px; }
  .etalon-hook-screen .feedback-card strong { margin-bottom: 2px; font-size: 9px; }
  .etalon-hook-screen .feedback-card p { font-size: 9px; line-height: 1.22; }

  .finale-screen { gap: 5px; }
  .finale-heading { padding: 7px 9px; border-radius: 13px; }
  .finale-heading > span { margin-bottom: 2px; font-size: 8px; }
  .finale-heading h1 { font-size: 18px; }
  .finale-layout { grid-template-columns: 1fr; gap: 6px; align-items: start; }
  .finale-main, .finale-actions { gap: 5px; }
  .finale-mastery { gap: 4px; }
  .finale-takeaway { padding: 6px; grid-template-columns: 22px minmax(0,1fr); gap: 4px; border-radius: 10px; }
  .finale-takeaway > span { width: 22px; height: 22px; border-radius: 7px; font-size: 8px; }
  .finale-takeaway p { font-size: 8px; line-height: 1.2; }
  .finale-proof { padding: 6px 7px; gap: 3px; border-radius: 10px; }
  .finale-proof > span, .finale-bridge strong { font-size: 7px; }
  .finale-proof > strong { font-size: 12px; }
  .finale-proof p, .finale-bridge p { font-size: 8px; line-height: 1.2; }
  .finale-bridge { padding: 6px; grid-template-columns: 24px minmax(0,1fr); gap: 5px; border-radius: 10px; }
  .finale-bridge > span { width: 24px; height: 24px; border-radius: 7px; }
  .finale-reflection { padding: 7px; border-radius: 11px; }
  .finale-reflection > strong { font-size: 11px; line-height: 1.15; }
  .finale-reflection > div { margin-top: 5px; gap: 4px; }
  .finale-reflection button { min-height: 44px; padding: 4px 5px; grid-template-columns: 20px minmax(0,1fr); gap: 4px; border-radius: 8px; font-size: 8px; line-height: 1.15; }
  .finale-reflection button span { width: 20px; height: 20px; border-radius: 6px; font-size: 8px; }
  .finale-actions .g4-title-claim { min-height: 58px; padding: 6px 8px; gap: 7px; }
  .finale-actions .g4-title-claim > span { width: 34px; height: 34px; }
  .finale-actions .g4-title-claim > strong { font-size: 12px; }
}
/* Match the approved Dars01 answer-text typography at every viewport. */
.lesson-root .option > span:last-child {
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 650;
  line-height: 1.5;
}
.lesson-root .option-letter {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-style: normal;
  font-weight: 650;
  line-height: normal;
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation: none !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  .finale-takeaway, .finale-proof, .finale-bridge { opacity: 1 !important; transform: none !important; }
  .finale-confetti { display: none; }
}
/* Grade 4 Dars01 local visual contract */
.lesson-frame .preview-language{display:none!important}
:is(.lesson-root,.d8-root):has([data-g4-screen="hook"]) .stage-content>:is(.stage-fit,.screen-stack){zoom:1!important;transform:none!important}
@media(max-width:639.98px){:is(.lesson-root,.d8-root){width:100%!important;max-width:100%!important;zoom:1!important}:is(.lesson-root,.d8-root) .stage{width:100%!important;max-width:100%!important}}
@media(max-width:390px) and (max-height:700px){.etalon-hook-screen .screen-heading .heading-copy p{display:none}.etalon-hook-screen .question-card{padding:7px 8px}.etalon-hook-screen .question-topline{margin-bottom:4px}.etalon-hook-screen .question-card h2{font-size:14px;line-height:1.14}.etalon-hook-screen .options-grid{margin-top:4px;gap:4px}.etalon-hook-screen .option{min-height:48px;padding:5px 6px;font-size:10px;line-height:1.2}.etalon-hook-screen .option>span:last-child{font-size:11px;line-height:1.2}.etalon-hook-screen .option-letter{width:24px;height:24px;flex-basis:24px}}
.hook-story-frame[data-g4-role="visual-frame"]{grid-template-columns:minmax(0,1fr)!important}
.hook-story-frame[data-g4-role="visual-frame"] .hook-story-model{grid-column:1/-1;width:100%;min-width:0;padding-right:116px}
@media(max-width:639.98px){.hook-story-frame[data-g4-role="visual-frame"] .hook-story-model{padding-right:84px}}
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
@media(min-width:640px){.etalon-hook-screen{gap:5px}}
@media(max-width:390px) and (max-height:700px){.spoken-builder-screen .heading-copy p{display:none}}
:is(.lesson-root,.d8-root) [data-g4-role~="hook-title"]{font-size:36px!important;font-family:'Source Serif 4',Georgia,serif}
:is(.lesson-root,.d8-root) [data-g4-role~="hook-question"]{font-size:21px!important;font-family:'Manrope',system-ui,sans-serif}
:is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"][data-g4-role~="visual-frame"],
:is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{width:min(760px,100%);margin-inline:auto;min-height:206px;border-radius:24px;overflow:hidden}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"]{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;grid-template-columns:62px minmax(0,1fr)}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:62px;height:76px}
:is(.lesson-root,.d8-root) [data-g4-feedback="solution"]{min-height:72px;padding:7px 12px 7px 6px;border-radius:15px;grid-template-columns:51px minmax(0,1fr);background:linear-gradient(135deg,#FFFFFF,#E7F3EC)}
:is(.lesson-root,.d8-root) [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:51px;height:64px}
:is(.lesson-root,.d8-root) [data-g4-feedback="wrong"]{background:linear-gradient(135deg,#FFFFFF,#FFF5D9)}
@media(max-width:639.98px){
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-title"]{font-size:25px!important}
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-question"]{font-size:17px!important}
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"][data-g4-role~="visual-frame"],
  :is(.lesson-root,.d8-root) [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}
  :is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:54px!important;height:68px!important}
  :is(.lesson-root,.d8-root) [data-g4-feedback="solution"]{min-height:68px!important}
  :is(.lesson-root,.d8-root) [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:47px!important;height:59px!important}
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
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"][data-g4-feedback="solution"]{min-height:72px!important}
:is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"][data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:51px!important;height:64px!important}
@media(max-width:639.98px){
  :is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"][data-g4-feedback="solution"]{min-height:68px!important}
  :is(.lesson-root,.d8-root) [data-g4-role~="feedback-frame"][data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:47px!important;height:59px!important}
}
@media(max-width:639.98px){
  :is(.lesson-root,.d8-root) .stage-content{overscroll-behavior:contain}
}
:is(.lesson-root,.d8-root) .stage-content{overflow:hidden!important}
@media(min-width:640px){
  :is(.lesson-root,.d8-root) .etalon-hook-screen .feedback{margin-top:0}
  :is(.lesson-root,.d8-root) .etalon-hook-screen .question-card{padding-bottom:12px}
}
@media(min-width:640px) and (max-width:1024px){
  .g4-title-reveal-card h2{font-size:58px}
}
@media(max-width:639.98px){
  :is(.lesson-root,.d8-root) .finale-screen{gap:3px}
  :is(.lesson-root,.d8-root) .finale-heading{padding:5px 8px}
  :is(.lesson-root,.d8-root) .finale-layout{gap:4px}
  :is(.lesson-root,.d8-root) .finale-main,
  :is(.lesson-root,.d8-root) .finale-actions{gap:3px}
  :is(.lesson-root,.d8-root) .finale-mastery{gap:3px}
  :is(.lesson-root,.d8-root) .finale-takeaway{min-height:0;padding:4px 6px}
  :is(.lesson-root,.d8-root) .finale-proof,
  :is(.lesson-root,.d8-root) .finale-bridge{padding:4px 6px}
  :is(.lesson-root,.d8-root) .finale-reflection{padding:5px}
  :is(.lesson-root,.d8-root) .finale-reflection>div{margin-top:3px;gap:3px}
  :is(.lesson-root,.d8-root) .finale-reflection button{min-height:36px;padding:3px 5px}
  :is(.lesson-root,.d8-root) .finale-actions .g4-title-claim{min-height:50px;padding:4px 7px}
  :is(.lesson-root,.d8-root) .strategy-builder-screen [data-g4-role~="feedback-frame"][data-g4-feedback="solution"]{min-height:96px!important;flex:0 0 auto}
  :is(.lesson-root,.d8-root) .strategy-builder-screen [data-g4-feedback="solution"]>.feedback-card{min-height:96px!important}
}
@media(max-width:390px) and (max-height:700px){
  :is(.lesson-root,.d8-root) .finale-heading>span{display:none}
  :is(.lesson-root,.d8-root) .finale-heading h1{font-size:16px}
  :is(.lesson-root,.d8-root) .finale-mastery{grid-template-columns:repeat(3,minmax(0,1fr))}
  :is(.lesson-root,.d8-root) .finale-takeaway{display:block;padding:4px}
  :is(.lesson-root,.d8-root) .finale-takeaway>span{width:18px;height:18px;margin-bottom:2px}
  :is(.lesson-root,.d8-root) .finale-takeaway p{font-size:7px;line-height:1.1}
  :is(.lesson-root,.d8-root) .finale-proof{grid-template-columns:auto auto minmax(0,1fr);gap:4px}
  :is(.lesson-root,.d8-root) .finale-bridge{grid-template-columns:20px minmax(0,1fr);gap:4px}
  :is(.lesson-root,.d8-root) .finale-bridge>span{width:20px;height:20px}
  :is(.lesson-root,.d8-root) .finale-reflection>strong{font-size:9px}
  :is(.lesson-root,.d8-root) .finale-reflection>div{grid-template-columns:repeat(3,minmax(0,1fr))}
  :is(.lesson-root,.d8-root) .finale-reflection button{min-height:34px;display:block;padding:3px;font-size:7px;line-height:1.05}
  :is(.lesson-root,.d8-root) .finale-reflection button span{float:left;width:16px;height:16px;margin-right:3px}
  :is(.lesson-root,.d8-root) .strategy-builder-screen [data-g4-role~="feedback-frame"][data-g4-feedback="solution"],
  :is(.lesson-root,.d8-root) .strategy-builder-screen [data-g4-feedback="solution"]>.feedback-card{min-height:112px!important}
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
  :is(.lesson-root,.d8-root) .reading-matching-screen.is-solved:has([data-g4-feedback="solution"])>.reading-matching-board{
    display:none!important
  }
  :is(.lesson-root,.d8-root) .builder-interactive-frame:has(>[data-g4-feedback="solution"])>:not([data-g4-feedback]){
    display:none!important
  }
}
@media(max-width:639.98px){
  :is(.lesson-root,.d8-root) .screen-stack:has([data-g4-feedback]){gap:4px!important}
  :is(.lesson-root,.d8-root) .etalon-hook-screen>.question-card>h2{display:none!important}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]),
  :is(.lesson-root,.d8-root) .hook-decision:has(+[data-g4-feedback]){padding:7px 8px!important}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]) .question-topline{margin-bottom:4px}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]) h2{font-size:14px!important;line-height:1.14}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]) .options-grid,
  :is(.lesson-root,.d8-root) .hook-answer-panel:has([data-g4-feedback]) .options-grid{margin-top:4px;gap:4px}
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
