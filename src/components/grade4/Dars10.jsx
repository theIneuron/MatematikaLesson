import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

// ============================================================================
// 4-SINF · Dars10 · Ko'p xonali sonni ikki xonali songa ko'paytirish
// Approved 15-screen build. Explanations advance from narration, never from
// internal "step" controls. The footer remains freely navigable.
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
    eyebrow: { ru: 'Незаконченный расчёт', uz: 'Tugallanmagan hisob', en: "Unfinished calculation" },
    title: { ru: 'Бит закончил вычисление?', uz: 'Bit hisobni tugatdimi?', en: "Has Bit finished the calculation?" },
    lead: {
      ru: 'Бит считает, что вычисление закончено. Он прав?',
      uz: "Bit hisob tugadi deb o'ylayapti. U haqmi?",
      en: "Bit thinks the calculation is complete. Is he right?",
    },
    audio: {
      intro: {
        ru: [
          'Бит умножил триста двадцать четыре на три единицы и получил девятьсот семьдесят два.',
          'Он считает, что умножение на двадцать три закончено.',
          'Ты с ним согласен?',
        ],
        uz: [
          "Bit uch yuz yigirma to'rtni uch birlikka ko'paytirib, to'qqiz yuz yetmish ikki oldi.",
          "U yigirma uchga ko'paytirish tugadi deb o'ylayapti.",
          "Siz bunga qo'shilasizmi?",
        ],
        en: [
          "Bit multiplied three hundred and twenty-four by three ones and got nine hundred and seventy-two.",
          "He believes that multiplication by twenty-three is complete.",
          "Do you agree with him?",
        ],
      },
      on_correct: {
        ru: 'Теперь разберём две части числа двадцать три.',
        uz: 'Endi yigirma uch sonining ikki qismini tekshiramiz.',
        en: "Now let's examine the two parts of twenty-three.",
      },
      on_wrong: [
        {
          ru: 'В числе двадцать три остались ещё два десятка. Теперь разберём две части числа двадцать три.',
          uz: "Yigirma uch sonida yana ikki o'nlik bor. Endi uning ikki qismini tekshiramiz.",
          en: "There are still two tens in twenty-three. Now let's examine its two parts.",
        },
        {
          ru: 'Теперь разберём две части числа двадцать три.',
          uz: 'Endi yigirma uch sonining ikki qismini tekshiramiz.',
          en: "Now let's examine the two parts of twenty-three.",
        },
      ],
    },
    options: [
      { ru: 'Да, 972 — окончательный ответ.', uz: 'Ha, 972 yakuniy javob.', en: "Yes, 972 is the final answer." },
      { ru: 'Нет, у числа 23 есть ещё одна часть.', uz: "Yo'q, 23 sonining yana bir qismi bor.", en: "No, the number 23 has another part." },
    ],
    bridge: {
      ru: 'Теперь разберём две части числа 23.',
      uz: 'Endi 23 sonining ikki qismini tekshiramiz.',
      en: "Now let's examine the two parts of 23.",
    },
  },
  s1: {
    eyebrow: { ru: 'Разряды множителя', uz: "Ko'paytiruvchi xonalari", en: "Place values in the multiplier" },
    title: { ru: 'Из чего состоит 23?', uz: '23 nimalardan tuzilgan?', en: "What does 23 consist of?" },
    lead: {
      ru: 'Цифра показывает не только количество, но и разряд.',
      uz: 'Raqam nafaqat miqdorni, balki xonani ham bildiradi.',
      en: "A digit shows both a value and a place.",
    },
    audio: {
      ru: [
        'Цифра два в числе двадцать три стоит в разряде десятков.',
        'Она означает два десятка, то есть двадцать.',
        'Цифра три означает три единицы.',
      ],
      uz: [
        "Yigirma uch sonidagi ikki raqami o'nlar xonasida turadi.",
        "U ikki o'nlikni, ya'ni yigirmani bildiradi.",
        'Uch raqami uch birlikni bildiradi.',
      ],
      en: [
        "The digit two in twenty-three is in the tens place.",
        "It represents two tens, or twenty.",
        "The digit three represents three ones.",
      ],
    },
    options: ['20 + 3', '2 + 3', '200 + 3'],
    closedSet: true,
    wrong: [
      null,
      {
        ru: 'Цифра 2 здесь означает десятки, а не единицы.',
        uz: "2 bu yerda birlik emas, o'nlikni bildiradi.",
        en: "The digit 2 here represents tens, not ones.",
      },
      {
        ru: 'Цифра 2 стоит в десятках, а не в сотнях.',
        uz: "2 yuzlar emas, o'nlar xonasida.",
        en: "The digit 2 is in the tens place, not the hundreds place.",
      },
    ],
  },
  s2: {
    eyebrow: { ru: 'Распределительная модель', uz: 'Taqsimot modeli', en: "Distributive model" },
    title: {
      ru: 'Разделим 23 группы на две части',
      uz: '23 ta guruhni ikki qismga ajratamiz',
      en: "Split the 23 groups into two parts",
    },
    lead: {
      ru: 'Каждая часть создаёт своё неполное произведение.',
      uz: "Har bir qism o'z to'liqsiz ko'paytmasini yaratadi.",
      en: "Each part creates its own partial product.",
    },
    audio: {
      ru: [
        'Двадцать три равные группы разделим на двадцать групп и три группы.',
        'Число триста двадцать четыре сначала берётся двадцать раз, затем три раза.',
        'В конце результаты двух частей складываются.',
      ],
      uz: [
        'Yigirma uchta teng guruhni yigirmata va uchta guruhga ajratamiz.',
        "Uch yuz yigirma to'rt soni avval yigirma marta, keyin uch marta olinadi.",
        "Ikki qismning natijalarini oxirida qo'shamiz.",
      ],
      en: [
        "Split twenty-three equal groups into twenty groups and three groups.",
        "First take three hundred and twenty-four twenty times, then take it three times.",
        "Finally, add the results of the two parts.",
      ],
    },
  },
  s3: {
    eyebrow: { ru: 'Строка единиц', uz: 'Birliklar qatori' , en: "Ones row"},
    title: { ru: 'Первое неполное произведение', uz: "Birinchi to'liqsiz ko'paytma", en: "First partial product" },
    lead: {
      ru: 'Строка единиц начинается с единиц.',
      uz: 'Birliklar qatori birliklardan boshlanadi.',
      en: "The ones row starts in the ones place.",
    },
    audio: {
      ru: [
        'Четыре единицы умножаем на три и получаем двенадцать единиц.',
        'Записываем две единицы и переносим один десяток.',
        'Два десятка умножаем на три и прибавляем перенос. Получаем семь десятков.',
        'Три сотни умножаем на три и получаем девять сотен.',
        'Первое неполное произведение равно девятистам семидесяти двум.',
      ],
      uz: [
        "To'rt birlikni uchga ko'paytirib, o'n ikki birlik olamiz.",
        "Ikki birlikni yozib, bir o'nlikni keyingi xonaga o'tkazamiz.",
        "Ikki o'nlikni uchga ko'paytirib, ko'chgan birni qo'shsak, yetti o'nlik bo'ladi.",
        "Uch yuzlikni uchga ko'paytirib, to'qqiz yuzlik olamiz.",
        "Birinchi to'liqsiz ko'paytma to'qqiz yuz yetmish ikki.",
      ],
      en: [
        "Multiply four ones by three to get twelve ones.",
        "Write two ones and carry one ten.",
        "Multiply two tens by three and add the carried ten to get seven tens.",
        "Multiply three hundreds by three to get nine hundreds.",
        "The first partial product is nine hundred and seventy-two.",
      ],
    },
  },
  s4: {
    eyebrow: { ru: 'Строка десятков', uz: "O'nliklar qatori" , en: "Tens row"},
    title: {
      ru: 'Почему строка десятков сдвигается на один разряд?',
      uz: "O'nliklar qatori nega bir xona siljiydi?",
      en: "Why is the tens row shifted one place to the left?",
    },
    lead: {
      ru: 'Цифра 2 означает 20.',
      uz: '2 raqami 20 ni bildiradi.',
      en: "The digit 2 represents 20.",
    },
    audio: {
      ru: [
        'Теперь умножим триста двадцать четыре на двадцать.',
        'Цифра два в числе двадцать означает два десятка.',
        'Выбери подходящий результат.',
      ],
      uz: [
        "Endi uch yuz yigirma to'rtni yigirmaga ko'paytiramiz.",
        "Yigirma sonidagi ikki raqami ikki o'nlikni bildiradi.",
        'Mos natijani tanlang.',
      ],
      en: [
        "Now multiply three hundred and twenty-four by twenty.",
        "The digit two in twenty represents two tens.",
        "Choose the correct result.",
      ],
    },
    options: ['648', '6 480', '64 800'],
    closedSet: true,
    wrong: [
      {
        ru: 'Это произведение на две единицы; нужны два десятка.',
        uz: "Bu ikki birlikka ko'paytma; bizga ikki o'nlik kerak.",
        en: "That is the product by two ones; we need the product by two tens.",
      },
      null,
      {
        ru: 'Строка десятков сдвигается на один разряд, а не на два.',
        uz: "O'nliklar qatori ikki emas, bir xona siljiydi.",
       en: "The tens row shifts by one place, not two."},
    ],
  },
  s5: {
    eyebrow: { ru: 'Сложение строк', uz: "Qatorlarni qo'shish", en: "Adding the rows" },
    title: {
      ru: 'Объединим два неполных произведения',
      uz: "Ikki to'liqsiz ko'paytmani birlashtiramiz",
      en: "Add the two partial products",
    },
    lead: {
      ru: 'Готовые значения только выравниваются по разрядам.',
      uz: "Tayyor qiymatlar faqat xonalar bo'yicha tekislanadi.",
      en: 'Align the partial products by place value.',
    },
    audio: {
      ru: [
        'Произведение на три единицы равно девятистам семидесяти двум.',
        'Произведение на два десятка равно шести тысячам четырёмстам восьмидесяти.',
        'Складываем результаты и получаем семь тысяч четыреста пятьдесят два.',
      ],
      uz: [
        "Uch birlikka ko'paytma to'qqiz yuz yetmish ikkiga teng.",
        "Ikki o'nlikka ko'paytma olti ming to'rt yuz saksonga teng.",
        "Ikki natijani qo'shib, yetti ming to'rt yuz ellik ikki olamiz.",
      ],
      en: [
        "The product by three ones is nine hundred and seventy-two.",
        "The product by two tens is six thousand four hundred and eighty.",
        "Add the results to get seven thousand four hundred and fifty-two.",
      ],
    },
  },
  s6: {
    eyebrow: { ru: 'Запись столбиком', uz: 'Ustun yozuvi', en: "Column method" },
    title: {
      ru: 'Тот же смысл в компактной записи',
      uz: "Shu ma'noning ixcham ustun yozuvi",
      en: "The same idea in a compact layout",
    },
    lead: {
      ru: 'Единицы — ноль разрядов; десятки — один разряд.',
      uz: "Birliklar — 0 xona; o'nliklar — 1 xona.",
      en: "Ones mean no shift; tens mean a shift of one place.",
    },
    audio: {
      ru: [
        'Первая строка показывает умножение на три единицы.',
        'Вторая строка показывает умножение на два десятка.',
        'Поэтому вторая строка начинается на один разряд левее.',
        'После сложения получается семь тысяч четыреста пятьдесят два.',
      ],
      uz: [
        "Birinchi qator uch birlikka ko'paytirishni ko'rsatadi.",
        "Ikkinchi qator ikki o'nlikka ko'paytirishni ko'rsatadi.",
        'Shuning uchun ikkinchi qator bir xona chapdan boshlanadi.',
        "Qatorlar qo'shilganda yetti ming to'rt yuz ellik ikki chiqadi.",
      ],
      en: [
        "The first row shows multiplication by three ones.",
        "The second row shows multiplication by two tens.",
        "Therefore, the second row begins one place to the left.",
        "After adding, the result is seven thousand four hundred and fifty-two.",
      ],
    },
  },
  s7: {
    eyebrow: { ru: 'Ноль в единицах', uz: 'Birliklarda nol', en: "Zero in the ones place" },
    title: { ru: 'Если цифра единиц равна нулю', uz: "Birliklar raqami nol bo'lsa", en: "If the ones digit is zero" },
    lead: { ru: 'Ноль единиц, три десятка.', uz: "0 birlik, 3 o'nlik.", en: "Zero ones, three tens." },
    audio: {
      ru: [
        'Цифра единиц в числе тридцать равна нулю.',
        'Неполное произведение для единиц равно нулю.',
        'Цифра три означает три десятка.',
        'Выбери подходящий результат.',
      ],
      uz: [
        "O'ttiz sonining birliklar raqami nol.",
        "Birliklar uchun to'liqsiz ko'paytma nol bo'ladi.",
        "Uch raqami esa uch o'nlikni bildiradi.",
        'Mos natijani tanlang.',
      ],
      en: [
        "The ones digit in thirty is zero.",
        "The partial product for the ones is zero.",
        "The digit three represents three tens.",
        "Choose the correct result.",
      ],
    },
    options: ['3 615', '36 150', '361 500'],
    closedSet: true,
    wrong: [
      {
        ru: 'Это произведение на три единицы; нужны три десятка.',
        uz: "Bu uch birlikka ko'paytma, bizga uch o'nlik kerak.",
        en: "That is the product by three ones; we need the product by three tens.",
      },
      null,
      {
        ru: 'Для десятков нужен сдвиг только на один разряд.',
        uz: "O'nliklar uchun faqat bir xona siljishi kerak.",
        en: "The tens row must shift only one place to the left.",
      },
    ],
  },
  s8: {
    eyebrow: { ru: 'Связи разрядов', uz: "Xonalar bog'lanishi", en: "Place-value links" },
    title: {
      ru: 'Соедини разряд множителя со сдвигом строки',
      uz: "Ko'paytiruvchi xonasini qator siljishi bilan bog'lang",
      en: "Match each multiplier place to its row shift",
    },
    lead: {
      ru: 'Смотри на место цифры во множителе.',
      uz: "Raqamning ko'paytiruvchidagi o'rniga qarang.",
      en: "Look at the place of the digit in the multiplier.",
    },
    audio: {
      ru: [
        'Для цифры единиц строка не сдвигается.',
        'Для цифры десятков строка начинается на один разряд левее.',
        'Составь подходящие пары.',
      ],
      uz: [
        'Birliklar raqami uchun qator siljimaydi.',
        "O'nliklar raqami uchun qator bir xona chapdan boshlanadi.",
        'Mos juftliklarni tuzing.',
      ],
      en: [
        "For the ones digit, the row does not shift.",
        "For the tens digit, the row begins one place to the left.",
        "Make the correct pairs.",
      ],
    },
    feedback: {
      ru: 'Смотри не только на цифру, а на её разряд в множителе.',
      uz: "Raqamning o'ziga emas, ko'paytiruvchidagi xonasiga qarang.",
     en: "Look not only at the digit, but also at its place in the multiplier."},
  },
  s9: {
    eyebrow: { ru: 'Сумма строк', uz: "Qatorlar yig'indisi", en: "Sum of the rows" },
    title: {
      ru: 'Сложи два неполных произведения',
      uz: "Ikki to'liqsiz ko'paytmani qo'shing",
      en: "Add the two partial products",
    },
    lead: {
      ru: '984 + 2 460 = ?',
      uz: '984 + 2 460 = ?',
     en: "984 + 2 460 = ?"},
    audio: {
      ru: [
        'Для произведения двухсот сорока шести на четырнадцать строка единиц равна девятистам восьмидесяти четырём.',
        'Строка десятков равна двум тысячам четырёмстам шестидесяти.',
        'Сложи девятьсот восемьдесят четыре и две тысячи четыреста шестьдесят и введи общий результат.',
      ],
      uz: [
        "Ikki yuz qirq oltini o'n to'rtga ko'paytirishda birliklar qatori to'qqiz yuz sakson to'rtga teng.",
        "O'nliklar qatori ikki ming to'rt yuz oltmishga teng.",
        "To'qqiz yuz sakson to'rtga ikki ming to'rt yuz oltmishni qo'shing va umumiy natijani kiriting.",
      ],
      en: [
        "For the product of two hundred and forty-six and fourteen, the ones row is nine hundred and eighty-four.",
        "The tens row is two thousand four hundred and sixty.",
        "Add nine hundred and eighty-four and two thousand four hundred and sixty, then enter the total.",
      ],
    },
  },
  s10: {
    eyebrow: { ru: 'Первая строка', uz: 'Birinchi qator', en: 'First row' },
    title: { ru: '417 × 2 = ?', uz: '417 × 2 = ?' , en: "417 × 2 = ?"},
    lead: { ru: 'Введи первое неполное произведение.', uz: "Birinchi to'liqsiz ko'paytmani kiriting.", en: "Enter the first partial product." },
    audio: {
      ru: [
        'Найди строку единиц для произведения четырёхсот семнадцати на тридцать два.',
        'Умножь четыреста семнадцать на две единицы.',
        'Семь, взятое два раза, даёт четырнадцать. Запиши четыре и перенеси один десяток.',
        'Один десяток, взятый два раза, с переносом даёт три десятка.',
        'Четыре сотни, взятые два раза, дают восемь сотен. Введи первое неполное произведение.',
      ],
      uz: [
        "To'rt yuz o'n yettini o'ttiz ikkiga ko'paytirishdagi birliklar qatorini toping.",
        "To'rt yuz o'n yettini ikki birlikka ko'paytiring.",
        "Yettini ikki marta olsak, o'n to'rt bo'ladi. To'rtni yozib, bir o'nlikni ko'chiring.",
        "Bir o'nlikni ikki marta olib, ko'chgan birni qo'shsak, uch o'nlik bo'ladi.",
        "To'rt yuzlikni ikki marta olsak, sakkiz yuzlik bo'ladi. Birinchi to'liqsiz ko'paytmani kiriting.",
      ],
      en: [
        "Find the ones row for the product of four hundred and seventeen and thirty-two.",
        "Multiply four hundred and seventeen by two ones.",
        "Seven taken twice makes fourteen. Write four and carry one ten.",
        "One ten taken twice, plus the carried ten, makes three tens.",
        "Four hundreds taken twice make eight hundreds. Enter the first partial product.",
      ],
    },
  },
  s11: {
    eyebrow: { ru: 'Выбор стратегии', uz: 'Strategiyani tanlash' , en: "Choosing a strategy"},
    title: {
      ru: 'Какой способ удобнее для 500 × 24?',
      uz: '500 × 24 uchun qaysi usul eng qulay?',
      en: 'Which method is more convenient for 500 × 24?',
    },
    lead: {
      ru: 'Выбери самый удобный надёжный способ.',
      uz: 'Eng qulay ishonchli usulni tanlang.',
      en: "Choose the most convenient and reliable way.",
    },
    audio: {
      ru: [
        'Пятьсот является круглым числом.',
        'Разложение двадцати четырёх на двадцать и четыре сокращает вычисление.',
        'Выбери самый удобный надёжный способ.',
      ],
      uz: [
        'Besh yuz yaxlit son.',
        "Yigirma to'rtni yigirma va to'rtga ajratish hisobni qisqartiradi.",
        'Eng qulay ishonchli usulni tanlang.',
      ],
      en: [
        "Five hundred is a round number.",
        "Breaking twenty-four into twenty and four makes the calculation shorter.",
        "Choose the most convenient and reliable way.",
      ],
    },
    options: [
      '500 × 20 + 500 × 4',
      '500 + 24',
      {
        ru: '24 × 5 и убрать нули',
        uz: '24 × 5 va nollarni olib tashlash',
        en: '24 × 5 and remove the zeros',
      },
    ],
    closedSet: true,
    wrong: [
      null,
      {
        ru: 'Сложение не создаёт двадцать четыре равные группы.',
        uz: "Qo'shish yigirma to'rtta teng guruhni bermaydi.",
        en: "Addition does not create twenty-four equal groups.",
      },
      {
        ru: 'Нули сохраняют разрядное значение; их нельзя просто убрать.',
        uz: "Nollar xona qiymatini saqlaydi; ularni shunchaki olib tashlab bo'lmaydi.",
        en: 'Zeros keep their place values; they cannot simply be removed.',
      },
    ],
  },
  s12: {
    eyebrow: { ru: 'Ноль в единицах', uz: 'Birliklarda nol', en: "Zero in the ones place" },
    title: { ru: 'Где первая ошибка Бита?', uz: 'Bitning birinchi xatosi qayerda?', en: "Where is Bit's first mistake?" },
    lead: {
      ru: 'Бит записал 1 205 × 30 = 3 615. Найди первую ошибку.',
      uz: "Bit 1 205 × 30 = 3 615 deb yozdi. Birinchi xatoni toping.",
      en: "Bit wrote 1 205 × 30 = 3 615. Find the first error.",
    },
    audio: {
      ru: [
        'Бит умножал одну тысячу двести пять на тридцать и записал три тысячи шестьсот пятнадцать.',
        'Ноль единиц даёт нулевую строку.',
        'Цифра три означает три десятка, поэтому три тысячи шестьсот пятнадцать нужно сдвинуть на один разряд.',
        'Найди первую ошибку в рассуждении Бита.',
      ],
      uz: [
        "Bit bir ming ikki yuz beshni o'ttizga ko'paytirib, uch ming olti yuz o'n besh deb yozdi.",
        "Nol birlik birliklar qatorini nol qiladi.",
        "Uch raqami uch o'nlikni bildiradi, shuning uchun uch ming olti yuz o'n besh bir xona chapga siljishi kerak.",
        "Bitning fikridagi birinchi xatoni toping.",
      ],
      en: [
        "Bit multiplied one thousand two hundred and five by thirty and wrote three thousand six hundred and fifteen.",
        "The partial product for zero ones is zero.",
        "The digit three represents three tens, so three thousand six hundred and fifteen must be shifted one place to the left.",
        "Find the first mistake in Bit's reasoning.",
      ],
    },
    options: [
      {
        ru: '3 означает десятки, поэтому 3 615 нужно сдвинуть на один разряд',
        uz: "3 o'nlikni bildiradi, shuning uchun 3 615 bir xona siljishi kerak",
        en: 'The digit 3 represents three tens, so 3 615 must be shifted one place to the left',
      },
      {
        ru: 'К нулю единиц нужно прибавить ещё 1 205',
        uz: "Nol birlikka yana 1 205 ni qo'shish kerak",
        en: "Add another 1 205 to the zero in the ones row",
      },
      {
        ru: 'Ноль нужно удалить из множителя',
        uz: "Ko'paytiruvchidagi nolni olib tashlash kerak",
        en: "Zero must be removed from the multiplier.",
      },
    ],
    closedSet: true,
    wrong: [
      null,
      {
        ru: 'Ноль единиц не создаёт ещё одну копию числа; строка единиц равна нулю.',
        uz: "Nol birlik sonning yana bir nusxasini yaratmaydi; birliklar qatori nolga teng.",
        en: "Zero ones do not make another copy of the number; the ones row is zero.",
      },
      {
        ru: 'Ноль сохраняет разряд десятков. Удалять его нельзя.',
        uz: "Nol o'nliklar xonasini saqlaydi. Uni olib tashlab bo'lmaydi.",
        en: "Zero holds the tens place. It must not be removed.",
      },
    ],
  },
  s13: {
    eyebrow: { ru: 'Городские панели', uz: 'Shahar panellari' , en: "City panels"},
    title: {
      ru: 'В каждой из 24 панелей по 128 датчиков',
      uz: '24 ta panelning har birida 128 ta sensor',
      en: "Each of the 24 panels contains 128 sensors",
    },
    lead: {
      ru: 'Какие неполные произведения нужны?',
      uz: "Qaysi to'liqsiz ko'paytmalar kerak?",
     en: "Which partial products are needed?"},
    audio: {
      ru: [
        'В каждой панели находится сто двадцать восемь датчиков.',
        'Для двадцати четырёх панелей учти четыре единицы и два десятка.',
        'Выбери два подходящих результата.',
      ],
      uz: [
        'Har bir panelda bir yuz yigirma sakkizta sensor bor.',
        "Yigirma to'rtta panel uchun to'rt birlik va ikki o'nlik qismlarini hisobga oling.",
        'Mos ikkita natijani tanlang.',
      ],
      en: [
        "Each panel contains one hundred and twenty-eight sensors.",
        "For twenty-four panels, account for four ones and two tens.",
        "Choose the two correct results.",
      ],
    },
    options: [
      { ru: '512 и 2 560', uz: '512 va 2 560', en: "512 and 2,560" },
      { ru: '512 и 256', uz: '512 va 256', en: "512 and 256" },
      { ru: '1 280 и 2 400', uz: '1 280 va 2 400', en: "1,280 and 2,400" },
    ],
    closedSet: true,
    wrong: [
      null,
      {
        ru: '256 — произведение на два; нужно произведение на двадцать.',
        uz: "256 ikkiga ko'paytma; bizga yigirmaga ko'paytma kerak.",
        en: "Two hundred and fifty-six is the product by two; you need the product by twenty.",
      },
      {
        ru: 'Части множителя равны двадцати и четырём; каждую умножь на 128.',
        uz: "Ko'paytiruvchining qismlari 20 va 4; har ikkisini 128 ga ko'paytiring.",
        en: "The multiplier parts are twenty and four; multiply one hundred and twenty-eight by each part.",
      },
    ],
  },
  s14: {
    eyebrow: { ru: 'ФИНАЛЬНЫЙ ЭТАП', uz: "YAKUNIY BOSQICH" , en: "FINAL STAGE"},
    title: {
      ru: 'Две строки сохраняют два разряда',
      uz: 'Ikki qator ikki xonani saqlaydi',
      en: "Two rows represent two place values",
    },
    lead: {
      ru: 'Единицы не сдвигаются, десятки начинаются на один разряд левее.',
      uz: "Birliklar siljimaydi, o'nliklar bir xona chapdan boshlanadi.",
      en: "The ones row does not shift; the tens row begins one place to the left.",
    },
    audio: {
      ru: [
        'Двузначный множитель раскладывается на единицы и десятки.',
        'Строка единиц не сдвигается.',
        'Строка десятков начинается на один разряд левее.',
        'Неполные произведения складываются, а результат проверяется оценкой.',
      ],
      uz: [
        "Ikki xonali ko'paytiruvchi birliklar va o'nliklarga ajraladi.",
        'Birliklar qatori siljimaydi.',
        "O'nliklar qatori bir xona chapdan boshlanadi.",
        "To'liqsiz ko'paytmalar qo'shiladi va natija taxmin bilan tekshiriladi.",
      ],
      en: [
        "Decompose the two-digit multiplier into ones and tens.",
        "The ones row does not shift.",
        "The tens row begins one place to the left.",
        "Add the partial products and check the result with an estimate.",
      ],
    },
  },
};

const TOTAL_SCREENS = 15;
const MOBILE_DESIGN_W = 390;

const LESSON_META = {
  lessonId: 'num-4-10-v1',
  slug: 'dars10-kop-xonali-sonni-ikki-xonali-songa-kopaytirish',
  lessonTitle: {
    ru: 'Урок 10. Умножение многозначного числа на двузначное',
    uz: "10-dars. Ko'p xonali sonni ikki xonali songa ko'paytirish",
    en: "Lesson 10: Multiplying a multi-digit number by a two-digit number",
  },
  skillTags: [
    'two_digit_multiplier',
    'place_value_multiplier',
    'partial_products',
    'column_multiplication',
    'tens_row_shift',
    'distributive_property',
    'estimate_product',
    'zero_units_multiplier',
    'error_repair',
  ],
};

const SCREEN_META = [
  { id: 's0', sourceId: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', sourceId: 's1', type: 'exploration', template: 'Decomposition', scored: false, scope: null },
  { id: 's2', sourceId: 's11', type: 'test', template: 'StrategyChoice', scored: true, scope: 'module-mikro' },
  { id: 's3', sourceId: 's3', type: 'exploration', template: 'UnitsPartialProduct', scored: false, scope: null },
  { id: 's4', sourceId: 's10', type: 'test', template: 'NumericInput', scored: true, scope: 'module-mikro' },
  { id: 's5', sourceId: 's4', type: 'exploration', template: 'TensShiftProof', scored: false, scope: null },
  { id: 's6', sourceId: 's8', type: 'test', template: 'Matching', scored: true, scope: 'module-mikro' },
  { id: 's7', sourceId: 's5', type: 'exploration', template: 'PartialProductsSum', scored: false, scope: null },
  { id: 's8', sourceId: 's9', type: 'test', template: 'NumericInput', scored: true, scope: 'module-mikro' },
  { id: 's9', sourceId: 's7', type: 'exploration', template: 'ZeroUnitsProof', scored: false, scope: null },
  { id: 's10', sourceId: 's12', type: 'test', template: 'ErrorRepair', scored: true, scope: 'module-mikro' },
  { id: 's11', sourceId: 's2', type: 'exploration', template: 'DistributiveModel', scored: false, scope: null },
  { id: 's12', sourceId: 's13', type: 'case', template: 'TransferChoice', scored: true, scope: 'final' },
  { id: 's13', sourceId: 's6', type: 'exploration', template: 'ColumnMorph', scored: false, scope: null },
  { id: 's14', sourceId: 's14', type: 'summary', template: 'Summary', scored: false, scope: null },
];

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
      const zoom = window.innerWidth < breakpoint
        ? window.innerWidth / MOBILE_DESIGN_W
        : 1;
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
  return base + '/api/tts?text=' + encoded + '&g=' + (gender === 'm' ? 'm' : 'f');
};

class AudioEngine {
  constructor() {
    this.queue = [];
    this.index = 0;
    this.audio = null;
    this.previewUtterance = null;
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
    this.emit({ completed: false, currentSegment: null });
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

    // Browser speech is restricted to the local preview. Production uses ttsApiBase.
    if (!runtimeConfig.previewMode || typeof window === 'undefined' || !window.speechSynthesis) {
      done?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = selectLocale(this.lang, { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' });
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
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        done?.();
      }
    }, 50);
  }

  pushOneOff(text) {
    this.stop(false);
    this.queue = [{ id: 'feedback-' + Date.now(), text }];
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
    if (typeof window !== 'undefined' && window.speechSynthesis) {
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

function useAudio(segments) {
  const lang = useLang();
  const initiallyMuted = audioEngineInstance?.muted ?? false;
  const [state, setState] = useState({
    isPlaying: false,
    muted: initiallyMuted,
    completed: initiallyMuted,
    currentSegment: null,
    reachedSegment: initiallyMuted ? Math.max(0, (segments?.length ?? 1) - 1) : -1,
  });

  /* eslint-disable react-hooks/refs -- stabilizes the narration queue */
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
    engine.onStateChange = (next) => setState((prev) => {
      const match = next.currentSegment?.match(/-(\d+)$/);
      const segmentIndex = match ? Number(match[1]) : -1;
      const reachedSegment = next.completed || next.muted
        ? Math.max(0, (stableSegments?.length ?? 1) - 1)
        : Math.max(prev.reachedSegment, segmentIndex);
      return { ...prev, ...next, reachedSegment };
    });
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
    replay: () => getAudioEngine()?.replay(),
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

const localizedSegments = (audioValue, lang, prefix) => {
  if (!audioValue) return [];
  const localized = audioValue[lang] ?? '';
  const items = Array.isArray(localized) ? localized : [localized];
  return items.filter(Boolean).map((text, index) => ({
    id: prefix + '-' + index,
    text,
  }));
};

function useScreenAudio(audioValue, screen) {
  const lang = useLang();
  const intro = audioValue?.intro ?? audioValue;
  return useAudio(localizedSegments(intro, lang, 's' + screen + '-audio'));
}

function useNarrationBeats(audio, total) {
  const match = audio.currentSegment?.match(/-(\d+)$/);
  const current = match ? Number(match[1]) : -1;
  const reached = audio.completed || audio.muted
    ? total - 1
    : Math.min(total - 1, audio.reachedSegment ?? -1);
  return { current, reached };
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

// Canonical Bit copied from Dars01 / the grade 1–3 lesson family.
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

const NextLabel = () => {
  const lang = useLang();
  return selectLocale(lang, { uz: 'Davom etish', ru: 'Дальше', en: 'Continue' });
};

const BackLabel = () => {
  const lang = useLang();
  return selectLocale(lang, { uz: 'Orqaga', ru: 'Назад', en: 'Back' });
};

const NavBack = ({ onClick, hidden = false }) => (
  hidden
    ? <span />
    : (
      <button type="button" className="btn btn-ghost" onClick={onClick}>
        <span aria-hidden="true">←</span> <BackLabel />
      </button>
    )
);

const NavNext = ({ onClick, finish = false }) => {
  const lang = useLang();
  return (
    <button type="button" className="btn btn-white-accent btn-ready" onClick={onClick}>
      {finish ? selectLocale(lang, { uz: 'Darsni yakunlash', ru: 'Завершить урок', en: 'Finish lesson' }) : <NextLabel />}
      <span aria-hidden="true">{finish ? '✓' : '→'}</span>
    </button>
  );
};

const FeedbackBlock = ({ show, correct, children }) => {
  if (!show) return null;
  return (
    <div
      className={'feedback feedback-visible ' + (correct ? 'feedback-correct' : 'feedback-wrong')}
      role="status"
      aria-live="polite"
    >
      <strong>{correct ? '✓' : '↺'}</strong>
      <span>{children}</span>
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

const Stage = ({ screen, eyebrow, audio, nav, children }) => {
  const t = useT();
  const isMobile = useIsMobile();
  const progress = ((screen + 1) / TOTAL_SCREENS) * 100;
  const pad = isMobile ? 14 : 48;
  const meta = SCREEN_META[screen];
  return (
    <section
      className={'stage stage-' + meta.type + (isMobile ? ' stage-mobile' : '')}
      style={{ color: T.ink }}
    >
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track" aria-label={(screen + 1) + ' / ' + TOTAL_SCREENS}>
          <div className="progress-fill progress-bar" style={{ width: progress + '%' }} />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title">
            <span className="status-dot" />
            <span>{t(eyebrow)}</span>
          </div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={meta.type} />
            <AudioIndicator audio={audio} />
            <span className="screen-count">
              {String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}
            </span>
          </div>
        </div>
      </header>
      <div className="stage-body">
        <main className="stage-scroll stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>
          {children}
        </main>
        <footer className="stage-footer stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>
          {nav}
        </footer>
      </div>
    </section>
  );
};

const ScreenHeading = ({ c, bit = 'present', className = '' }) => {
  const t = useT();
  return (
    <div className={'screen-heading ' + (!bit ? 'screen-heading-no-bit ' : '') + className}>
      <div className="heading-copy">
        <p className="lesson-kicker">{t(c.eyebrow)}</p>
        <h1 className="title">{t(c.title)}</h1>
        <p>{t(c.lead)}</p>
      </div>
      {bit && (
        <div className={'bit-coach bit-' + bit}>
          <BitSVG state={bit} />
        </div>
      )}
    </div>
  );
};

const LessonScreen = ({
  screen,
  c,
  audio,
  bit,
  onNext,
  onPrev,
  finishLesson,
  headingClassName,
  children,
}) => (
  <Stage
    screen={screen}
    eyebrow={c.eyebrow}
    audio={audio}
    nav={(
      <>
        <NavBack onClick={onPrev} hidden={screen === 0} />
        <NavNext
          onClick={screen === TOTAL_SCREENS - 1 ? finishLesson : onNext}
          finish={screen === TOTAL_SCREENS - 1}
        />
      </>
    )}
  >
    <div className="stage-happy-bit" aria-hidden="true"><BitSVG state="happy" /></div>
    <ScreenHeading c={c} bit={bit} className={headingClassName} />
    {children}
  </Stage>
);

const Formula = ({ children, tone = 'cyan', className = '' }) => (
  <div className={'formula formula-' + tone + ' ' + className}>{children}</div>
);

const ProductionRails = ({ current, reached }) => (
  <svg
    className={'production-rails ' + (reached >= 1 ? 'production-rails-visible' : '')}
    viewBox="0 0 720 190"
    aria-hidden="true"
    focusable="false"
  >
    <g className={'production-rail production-rail-units ' + (current === 1 ? 'production-rail-live' : '')}>
      <rect className="production-rail-bed" x="12" y="12" width="696" height="72" rx="18" />
      <g className="production-input" transform="translate(34 27)">
        <rect width="108" height="42" rx="11" />
        <text x="54" y="27">324</text>
      </g>
      <g className="production-multiplier" transform="translate(177 24)">
        <circle cx="23" cy="23" r="23" />
        <text x="23" y="29">×3</text>
      </g>
      <path className="production-belt" d="M236 48 H548" />
      {[278, 344, 410, 476].map((x) => <circle key={x} className="production-roller" cx={x} cy="48" r="8" />)}
      <path className="production-flow" d="M240 48 H538" />
      <g className="production-output" transform="translate(558 27)">
        <rect width="126" height="42" rx="11" />
        <text x="63" y="27">972</text>
      </g>
    </g>
    <g className={'production-rail production-rail-tens ' + (current === 1 ? 'production-rail-live' : '')}>
      <rect className="production-rail-bed" x="12" y="104" width="696" height="72" rx="18" />
      <g className="production-input" transform="translate(34 119)">
        <rect width="108" height="42" rx="11" />
        <text x="54" y="27">324</text>
      </g>
      <g className="production-multiplier" transform="translate(177 116)">
        <circle cx="23" cy="23" r="23" />
        <text x="23" y="29">×20</text>
      </g>
      <path className="production-belt" d="M236 140 H520" />
      {[270, 330, 390, 450].map((x) => <circle key={x} className="production-roller" cx={x} cy="140" r="8" />)}
      <path className="production-flow" d="M240 140 H510" />
      <path className="production-place-arrow" d="M544 128 h-28 l9-9 m-9 9 9 9" />
      <g className="production-output" transform="translate(548 119)">
        <rect width="136" height="42" rx="11" />
        <text x="68" y="27">6 480</text>
      </g>
    </g>
  </svg>
);

const ShiftWorkshopGraphic = ({ start, settled }) => (
  <svg
    className={
      'shift-workshop-svg'
      + (start ? ' shift-workshop-running' : '')
      + (settled ? ' shift-workshop-settled' : '')
    }
    viewBox="0 0 480 92"
    aria-hidden="true"
    focusable="false"
  >
    <rect className="workshop-shell" x="8" y="9" width="464" height="74" rx="17" />
    {[46, 144, 242, 340].map((x) => (
      <g key={x} className="workshop-bay">
        <rect x={x} y="25" width="82" height="42" rx="10" />
        <path d={'M' + (x + 12) + ' 67 v8 M' + (x + 70) + ' 67 v8'} />
      </g>
    ))}
    <path className="workshop-conveyor" d="M58 71 H422" />
    {[80, 142, 204, 266, 328, 390].map((x) => <circle key={x} cx={x} cy="71" r="6" />)}
    <g className="workshop-crane">
      <path d="M383 8 v18 h-24" />
      <rect x="350" y="21" width="18" height="12" rx="4" />
    </g>
    <path className="workshop-one-place-arrow" d="M322 17 H240 l14-10 m-14 10 14 10" />
  </svg>
);

const SensorPanelArray = () => (
  <svg
    className="sensor-panels-svg"
    viewBox="0 0 540 178"
    aria-hidden="true"
    focusable="false"
  >
    <rect className="sensor-yard" x="6" y="8" width="528" height="162" rx="20" />
    <g className="sensor-zone sensor-zone-tens">
      <rect x="18" y="18" width="390" height="30" rx="10" />
      <text x="213" y="39">20</text>
      {Array.from({ length: 20 }, (_, index) => {
        const x = 25 + (index % 10) * 38;
        const y = 59 + Math.floor(index / 10) * 49;
        return (
          <g key={index} className="sensor-panel sensor-panel-tens" transform={'translate(' + x + ' ' + y + ')'}>
            <rect width="29" height="38" rx="6" />
            <circle cx="9" cy="12" r="3" />
            <circle cx="20" cy="12" r="3" />
            <path d="M7 27 H22" />
          </g>
        );
      })}
    </g>
    <g className="sensor-zone sensor-zone-units">
      <rect x="422" y="18" width="100" height="30" rx="10" />
      <text x="472" y="39">4</text>
      {Array.from({ length: 4 }, (_, index) => {
        const x = 431 + (index % 2) * 42;
        const y = 59 + Math.floor(index / 2) * 49;
        return (
          <g key={index} className="sensor-panel sensor-panel-units" transform={'translate(' + x + ' ' + y + ')'}>
            <rect width="33" height="38" rx="6" />
            <circle cx="10" cy="12" r="3" />
            <circle cx="23" cy="12" r="3" />
            <path d="M8 27 H25" />
          </g>
        );
      })}
    </g>
    <path className="sensor-split" d="M414 19 V157" />
  </svg>
);

const OptionalPrediction = ({ options, selected, onSelect, correctIndex, labels }) => (
  <div className="prediction-options" role="group" aria-label={labels}>
    {options.map((option, index) => (
      <button
        type="button"
        key={typeof option === 'string' ? option : index}
        className={
          'prediction-chip'
          + (selected === index ? ' prediction-picked' : '')
          + (selected !== null && index === correctIndex ? ' prediction-correct' : '')
        }
        aria-pressed={selected === index}
        onClick={() => onSelect(index)}
      >
        {option}
      </button>
    ))}
  </div>
);

const ShiftOnce = ({
  raw,
  full,
  start,
  caption,
  compact = false,
  onSettled,
}) => {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!start || settled) return undefined;
    const timer = setTimeout(() => {
      setSettled(true);
      onSettled?.();
    }, 920);
    return () => clearTimeout(timer);
  }, [start, settled, onSettled]);

  return (
    <div className={'shift-once ' + (compact ? 'shift-once-compact' : '')}>
      <ShiftWorkshopGraphic start={start} settled={settled} />
      <div className="shift-place-head" aria-hidden="true">
        <span>1000</span><span>100</span><span>10</span><span>1</span>
      </div>
      <div className="shift-lane" aria-live="polite">
        {!settled && (
          <strong className={'raw-shift-token ' + (start ? 'raw-shift-moving' : '')}>
            {raw}
          </strong>
        )}
        {settled && <strong className="full-value-token">{full}</strong>}
      </div>
      {caption && <p className="shift-caption">{caption}</p>}
    </div>
  );
};

const ScoredChoice = ({
  screen,
  c,
  options,
  correctIndex,
  storedAnswer,
  onAnswer,
  proof,
}) => {
  const t = useT();
  const [selected, setSelected] = useState(storedAnswer?.answer ?? null);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [solved, setSolved] = useState(Boolean(storedAnswer?.correct));
  const initialMessage = storedAnswer?.correct
    ? { ru: 'Верно. Решение открыто ниже.', uz: "To'g'ri. Yechim quyida ochildi.", en: "Correct. The solution is shown below." }
    : (storedAnswer ? c.wrong?.[storedAnswer.answer] : null);
  const [message, setMessage] = useState(initialMessage);

  const choose = (index) => {
    if (solved) return;
    const nextAttempts = attempts + 1;
    const correct = index === correctIndex;
    const nextMessage = correct
      ? { ru: 'Верно. Решение открыто ниже.', uz: "To'g'ri. Yechim quyida ochildi.", en: "Correct. The solution is shown below." }
      : c.wrong?.[index];
    setSelected(index);
    setAttempts(nextAttempts);
    setSolved(correct);
    setMessage(nextMessage);
    playSfx(correct ? 'correct' : 'wrong');
    onAnswer({
      screenIdx: screen,
      screenId: 's' + screen,
      type: SCREEN_META[screen].template,
      answer: index,
      correct,
      firstTry: correct && nextAttempts === 1,
      attempts: nextAttempts,
    });
  };

  return (
    <>
      <div className="choice-grid">
        {options.map((option, index) => (
          <button
            type="button"
            key={index}
            className={
              'choice-card'
              + (selected === index ? ' choice-selected' : '')
              + (solved && index === correctIndex ? ' choice-correct' : '')
            }
            onClick={() => choose(index)}
            disabled={solved}
          >
            <span>{String.fromCharCode(65 + index)}</span>
            <b>{t(option)}</b>
          </button>
        ))}
      </div>
      <FeedbackBlock show={Boolean(message)} correct={solved}>
        {t(message)}
      </FeedbackBlock>
      {solved && proof}
    </>
  );
};

function HookScreen({ screen, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s0;
  const t = useT();
  const audio = useScreenAudio(c.audio, screen);
  const { current, reached } = useNarrationBeats(audio, 3);
  const [picked, setPicked] = useState(null);
  const pick = (index) => {
    setPicked(index);
    playSfx(index === 1 ? 'correct' : 'wrong');
    const feedbackAudio = index === 1 ? c.audio.on_correct : c.audio.on_wrong[index];
    audio.pushOneOff(t(feedbackAudio));
  };

  return (
    <LessonScreen
      screen={screen}
      c={c}
      audio={audio}
      bit={null}
      onNext={onNext}
      onPrev={onPrev}
      finishLesson={finishLesson}
    >
      <div className="hook-scene">
        <div className="terminal-card">
          <span className="terminal-label">{t({ ru: 'БИТ / ВЫЧИСЛЕНИЕ', uz: 'BIT / HISOB', en: 'BIT / CALCULATION' })}</span>
          <div className="hook-expression">
            324 × <span className={reached >= 1 ? 'tens-pulse' : ''}>2</span>
            <span className={current === 0 ? 'number-lit' : ''}>3</span>
          </div>
          <div className={'hook-line ' + (current === 0 ? 'number-lit' : '')}>
            324 × 3 = 972
          </div>
          <p>{t(c.lead)}</p>
        </div>
        <div className="hook-bit"><BitSVG state="awkward" /></div>
      </div>
      <div className="choice-grid hook-choices">
        {c.options.map((option, index) => (
          <button
            type="button"
            className={'choice-card ' + (picked === index ? 'choice-selected' : '')}
            key={index}
            aria-pressed={picked === index}
            onClick={() => pick(index)}
          >
            <span>{index === 0 ? '✓?' : '…'}</span>
            <b>{t(option)}</b>
          </button>
        ))}
      </div>
      <FeedbackBlock show={picked !== null} correct={picked === 1}>
        {picked === 0
          ? t({
              ru: 'В числе 23 остались ещё два десятка. ',
              uz: "23 sonida yana ikki o'nlik bor. ",
              en: 'There are still two tens in 23. ',
            })
          : ''}
        {t(c.bridge)}
      </FeedbackBlock>
    </LessonScreen>
  );
}

function DecompositionScreen({ screen, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s1;
  const t = useT();
  const lang = useLang();
  const audio = useScreenAudio(c.audio, screen);
  const { current, reached } = useNarrationBeats(audio, 3);
  const [picked, setPicked] = useState(null);
  const revealed = reached >= 1 || audio.completed || audio.muted;
  const message = picked === null
    ? null
    : (picked === 0
      ? { ru: '23 = 20 + 3', uz: '23 = 20 + 3' , en: "23 = 20 + 3"}
      : c.wrong[picked]);

  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit="point" onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <div className="decomposition-board math-card">
        <div className="number-23">
          <span className={current <= 1 && reached >= 0 ? 'digit-live' : ''}>2</span>
          <span className={current === 2 ? 'digit-live digit-units' : 'digit-units'}>3</span>
        </div>
        <div className={'place-links ' + (revealed ? 'links-visible' : '')}>
          <div>
            <span className="tens-blocks"><i /><i /></span>
            <b>{t({ ru: '2 десятка = 20', uz: "2 o'nlik = 20", en: "2 tens = 20" })}</b>
          </div>
          <div>
            <span className="units-blocks"><i /><i /><i /></span>
            <b>{t({ ru: '3 единицы = 3', uz: '3 birlik = 3', en: '3 ones = 3' })}</b>
          </div>
        </div>
        <Formula className={revealed ? 'formula-visible' : 'formula-soft'}>23 = 20 + 3</Formula>
      </div>
      <OptionalPrediction
        options={c.options}
        selected={picked}
        onSelect={setPicked}
        correctIndex={0}
        labels={selectLocale(lang, { uz: 'Ixtiyoriy taxmin', ru: 'Необязательный прогноз', en: 'Optional prediction' })}
      />
      <FeedbackBlock show={Boolean(message)} correct={picked === 0}>
        {t(message)}
      </FeedbackBlock>
    </LessonScreen>
  );
}

function DistributiveScreen({ screen, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s2;
  const t = useT();
  const audio = useScreenAudio(c.audio, screen);
  const { current, reached } = useNarrationBeats(audio, 3);
  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit={null} onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <div className="group-model math-card">
        <div className="group-strip" aria-label={t({ ru: '23 группы', uz: '23 ta guruh', en: '23 groups' })}>
          {Array.from({ length: 23 }, (_, index) => (
            <i
              key={index}
              className={
                (index < 20 ? 'group-tens' : 'group-units')
                + (reached >= 0 ? ' group-visible' : '')
                + (current === 0 ? ' group-live' : '')
              }
              style={{ '--group-index': index }}
            />
          ))}
        </div>
        <div className="group-labels">
          <span>20</span><span>+</span><span>3</span>
        </div>
        <Formula className={reached >= 1 ? 'formula-visible' : 'formula-soft'}>
          23 = 20 + 3
        </Formula>
        <ProductionRails current={current} reached={reached} />
        <Formula tone="accent" className={reached >= 2 ? 'formula-visible' : 'formula-soft'}>
          324 × 23 = 324 × 20 + 324 × 3
        </Formula>
      </div>
    </LessonScreen>
  );
}

function UnitsPartialScreen({ screen, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s3;
  const t = useT();
  const audio = useScreenAudio(c.audio, screen);
  const { current, reached } = useNarrationBeats(audio, 5);
  const labels = [
    { formula: '4 × 3 = 12', text: { ru: 'Пишем 2, переносим 1 десяток', uz: "2 ni yozib, 1 o'nlikni ko'chiramiz", en: "Write 2 and carry 1 ten" } },
    { formula: '2 × 3 + 1 = 7', text: { ru: '7 десятков', uz: "7 o'nlik", en: "7 tens" } },
    { formula: '3 × 3 = 9', text: { ru: '9 сотен', uz: '9 yuzlik', en: "9 hundreds" } },
  ];
  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit={null} onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <div className="units-workspace">
        <div className="column-mini math-card">
          <span className={'carry-one ' + (reached >= 1 && reached < 3 ? 'carry-visible' : '')}>1</span>
          <div>324</div>
          <div>× 3</div>
          <hr />
          <div className={reached >= 4 ? 'partial-complete' : ''}>
            <span className={reached >= 3 ? 'digit-shown' : ''}>9</span>
            <span className={reached >= 2 ? 'digit-shown' : ''}>7</span>
            <span className={reached >= 0 ? 'digit-shown' : ''}>2</span>
          </div>
        </div>
        <div className="calculation-notes">
          {labels.map((item, index) => (
            <div
              key={item.formula}
              className={
                'calculation-note'
                + (reached >= index ? ' note-visible' : '')
                + (current === index ? ' note-live' : '')
              }
            >
              <b>{item.formula}</b>
              <span>{t(item.text)}</span>
            </div>
          ))}
        </div>
      </div>
      <Formula tone="success" className={reached >= 4 ? 'formula-visible' : 'formula-soft'}>
        324 × 3 = 972
      </Formula>
    </LessonScreen>
  );
}

function TensShiftScreen({ screen, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s4;
  const t = useT();
  const lang = useLang();
  const audio = useScreenAudio(c.audio, screen);
  const { reached } = useNarrationBeats(audio, 3);
  const [picked, setPicked] = useState(null);
  const shouldShift = audio.completed || audio.muted;
  const message = picked === null
    ? null
    : (picked === 1
      ? { ru: 'Верно: 324 × 20 = 6 480.', uz: "To'g'ri: 324 × 20 = 6 480.", en: 'Correct. 324 × 20 = 6 480.' }
      : c.wrong[picked]);

  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit="point" onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <div className="shift-proof-card math-card">
        <Formula>324 × 20 = ?</Formula>
        <p className={'place-caption ' + (reached >= 1 ? 'caption-live' : '')}>
          {t(c.lead)}
        </p>
        <ShiftOnce
          raw="648"
          full="6 480"
          start={shouldShift}
          caption={t({
            ru: '324 × 2 = 648; 648 × 10 = 6 480',
            uz: '324 × 2 = 648; 648 × 10 = 6 480',
           en: "324 × 2 = 648; 648 × 10 = 6 480"})}
        />
      </div>
      <OptionalPrediction
        options={c.options}
        selected={picked}
        onSelect={setPicked}
        correctIndex={1}
        labels={selectLocale(lang, { uz: 'Ixtiyoriy taxmin', ru: 'Необязательный прогноз', en: 'Optional prediction' })}
      />
      <FeedbackBlock show={Boolean(message)} correct={picked === 1}>{t(message)}</FeedbackBlock>
    </LessonScreen>
  );
}

function CombineScreen({ screen, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s5;
  const t = useT();
  const audio = useScreenAudio(c.audio, screen);
  const { current, reached } = useNarrationBeats(audio, 3);
  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit={null} onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <div className="alignment-scene math-card">
        <div className="place-grid-labels"><span>1000</span><span>100</span><span>10</span><span>1</span></div>
        <div className={'aligned-row units-color ' + (reached >= 0 ? 'aligned-visible' : '') + (current === 0 ? ' aligned-live' : '')}>
          <small>324 × 3</small><strong>972</strong>
        </div>
        <div className={'aligned-row tens-color vertical-arrival ' + (reached >= 1 ? 'aligned-visible' : '') + (current === 1 ? ' aligned-live' : '')}>
          <small>324 × 20</small><strong>6 480</strong>
        </div>
        <div className="alignment-rule" />
        <div className={'aligned-row sum-color vertical-arrival ' + (reached >= 2 ? 'aligned-visible' : '') + (current === 2 ? ' aligned-live' : '')}>
          <small>972 + 6 480</small><strong>7 452</strong>
        </div>
      </div>
      <p className="contract-note">
        {t({
          uz: "6 480 tayyor qiymat sifatida faqat vertikal tekislandi.",
          ru: 'Готовое значение 6 480 только выровнено по вертикали.',
          en: 'The partial product 6 480 is aligned by place value.',
        })}
      </p>
    </LessonScreen>
  );
}

function ColumnMorphScreen({ screen, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s6;
  const t = useT();
  const audio = useScreenAudio(c.audio, screen);
  const { reached } = useNarrationBeats(audio, 4);
  const [shiftDone, setShiftDone] = useState(false);
  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit={null} onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <div className="column-morph math-card">
        <div className="column-fixed">
          <div className="column-line"><span /><strong>324</strong></div>
          <div className="column-line"><span>×</span><strong>23</strong></div>
          <div className="column-rule" />
          <div className={'column-line ' + (reached >= 0 ? 'line-visible' : 'line-hidden')}>
            <span /><strong>972</strong>
          </div>
        </div>
        <ShiftOnce
          raw="648"
          full="6 480"
          start={reached >= 2 || audio.completed || audio.muted}
          compact
          onSettled={() => setShiftDone(true)}
          caption={t({
            ru: 'Строка десятков начинает запись на один разряд левее',
            uz: "O'nliklar qatori bir xona chapdan boshlanadi",
            en: "The tens row begins one place to the left.",
          })}
        />
        <div className="column-fixed column-bottom">
          <div className="column-rule" />
          <div className={'column-line column-result ' + ((reached >= 3 || shiftDone) ? 'line-visible' : 'line-hidden')}>
            <span /><strong>7 452</strong>
          </div>
        </div>
        <div className="shift-legend">
          <span>{t({ ru: 'Единицы: 0 разрядов', uz: 'Birliklar: 0 xona', en: "Ones: no shift" })}</span>
          <span>{t({ ru: 'Десятки: 1 разряд', uz: "O'nliklar: 1 xona", en: "Tens: shift one place" })}</span>
        </div>
      </div>
    </LessonScreen>
  );
}

function ZeroUnitsScreen({ screen, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s7;
  const t = useT();
  const lang = useLang();
  const audio = useScreenAudio(c.audio, screen);
  const { reached } = useNarrationBeats(audio, 4);
  const [picked, setPicked] = useState(null);
  const shouldShift = audio.completed || audio.muted;
  const message = picked === null
    ? null
    : (picked === 1
      ? { ru: 'Верно: 1 205 × 30 = 36 150.', uz: "To'g'ri: 1 205 × 30 = 36 150.", en: 'Correct. 1 205 × 30 = 36 150.' }
      : c.wrong[picked]);
  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit={null} onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <div className="zero-units-layout">
        <div className="zero-track math-card">
          <Formula>1 205 × 30 = ?</Formula>
          <div className={'zero-placeholder ' + (reached >= 1 ? 'zero-visible' : '')}>
            <span>{t({ ru: 'строка единиц', uz: 'birliklar qatori' , en: "ones row"})}</span>
            <b>0</b>
          </div>
        </div>
        <div className="math-card">
          <p className="raw-equation">1 205 × 3 = 3 615</p>
          <ShiftOnce
            raw="3 615"
            full="36 150"
            start={shouldShift}
            compact
            caption={t({ ru: 'Три десятка: один сдвиг', uz: "Uch o'nlik: bir siljish", en: "Three tens: shift one place" })}
          />
        </div>
      </div>
      <OptionalPrediction
        options={c.options}
        selected={picked}
        onSelect={setPicked}
        correctIndex={1}
        labels={selectLocale(lang, { uz: 'Ixtiyoriy taxmin', ru: 'Необязательный прогноз', en: 'Optional prediction' })}
      />
      <FeedbackBlock show={Boolean(message)} correct={picked === 1}>{t(message)}</FeedbackBlock>
    </LessonScreen>
  );
}

function MatchingScreen({ screen, storedAnswer, onAnswer, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s8;
  const t = useT();
  const audio = useScreenAudio(c.audio, screen);
  const [pairs, setPairs] = useState(storedAnswer?.answer ?? { units: null, tens: null });
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [solved, setSolved] = useState(Boolean(storedAnswer?.correct));
  const [message, setMessage] = useState(
    storedAnswer?.correct
      ? { ru: 'Обе пары верны.', uz: "Ikkala juftlik ham to'g'ri.", en: "Both pairs are correct." }
      : (storedAnswer ? c.feedback : null),
  );

  const choose = (key, value) => {
    if (solved) return;
    const next = { ...pairs, [key]: value };
    setPairs(next);
    if (next.units === null || next.tens === null) return;
    const correct = next.units === 0 && next.tens === 1;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setSolved(correct);
    setMessage(correct
      ? { ru: 'Единицы не сдвигаются, десятки сдвигаются на один разряд.', uz: "Birliklar siljimaydi, o'nliklar bir xona siljiydi.", en: "The ones row does not shift; the tens row shifts one place to the left." }
      : c.feedback);
    playSfx(correct ? 'correct' : 'wrong');
    onAnswer({
      screenIdx: screen,
      screenId: 's' + screen,
      type: 'Matching',
      answer: next,
      correct,
      firstTry: correct && nextAttempts === 1,
      attempts: nextAttempts,
    });
  };

  const row = (key, label) => (
    <div className="match-row">
      <strong>{t(label)}</strong>
      <div>
        {[0, 1].map((value) => (
          <button
            type="button"
            key={value}
            className={'match-choice ' + (pairs[key] === value ? 'match-picked' : '')}
            aria-pressed={pairs[key] === value}
            disabled={solved}
            onClick={() => choose(key, value)}
          >
            {value} {t({ ru: value === 0 ? 'разрядов' : 'разряд', uz: 'xona', en: value === 1 ? 'place' : 'places' })}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit={null} onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <div className="matching-board math-card">
        {row('units', { ru: 'Цифра единиц', uz: 'Birliklar raqami', en: "Ones digit" })}
        {row('tens', { ru: 'Цифра десятков', uz: "O'nliklar raqami", en: "Tens digit" })}
      </div>
      <FeedbackBlock show={Boolean(message)} correct={solved}>{t(message)}</FeedbackBlock>
    </LessonScreen>
  );
}

function ConstructionScreen({ screen, storedAnswer, onAnswer, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s9;
  const t = useT();
  const audio = useScreenAudio(c.audio, screen);
  const [value, setValue] = useState(storedAnswer?.answer ?? '');
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [solved, setSolved] = useState(Boolean(storedAnswer?.correct));
  const [message, setMessage] = useState(
    storedAnswer?.correct
      ? { ru: 'Верно: 984 + 2 460 = 3 444.', uz: "To'g'ri: 984 + 2 460 = 3 444.", en: 'Correct. 984 + 2 460 = 3 444.' }
      : null,
  );

  const submit = () => {
    if (solved) return;
    const normalized = String(value).replace(/\s/g, '');
    const correct = normalized === '3444';
    const nextAttempts = attempts + 1;
    const nextMessage = correct
      ? { ru: 'Верно: 984 + 2 460 = 3 444.', uz: "To'g'ri: 984 + 2 460 = 3 444.", en: 'Correct. 984 + 2 460 = 3 444.' }
      : { ru: 'Выровняй разряды и сложи: 984 + 2 460.', uz: "Xonalarni tekislang va qo'shing: 984 + 2 460.", en: "Align the place values and add: 984 + 2 460." };
    setAttempts(nextAttempts);
    setSolved(correct);
    setMessage(nextMessage);
    playSfx(correct ? 'correct' : 'wrong');
    onAnswer({
      screenIdx: screen,
      screenId: 's' + screen,
      type: 'NumericInput',
      answer: value,
      correct,
      firstTry: correct && nextAttempts === 1,
      attempts: nextAttempts,
    });
  };

  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit={null} onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <div className="numeric-card math-card">
        <Formula>984 + 2 460 = ?</Formula>
        <label htmlFor="d10-sum-answer">{t(c.lead)}</label>
        <div className="numeric-entry">
          <input
            id="d10-sum-answer"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            value={value}
            disabled={solved}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submit();
            }}
          />
          <button type="button" className="primary-action" onClick={submit} disabled={!String(value).trim() || solved}>
            {t({ ru: 'Проверить', uz: 'Tekshirish' , en: "Check"})}
          </button>
        </div>
      </div>
      <FeedbackBlock show={Boolean(message)} correct={solved}>{t(message)}</FeedbackBlock>
      {solved && <Formula tone="success" className="formula-visible">246 × 14 = 3 444</Formula>}
    </LessonScreen>
  );
}

function NumericScreen({ screen, storedAnswer, onAnswer, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s10;
  const t = useT();
  const audio = useScreenAudio(c.audio, screen);
  const [value, setValue] = useState(storedAnswer?.answer ?? '');
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [solved, setSolved] = useState(Boolean(storedAnswer?.correct));
  const [message, setMessage] = useState(
    storedAnswer?.correct
      ? { ru: 'Верно: 834.', uz: "To'g'ri: 834.", en: 'Correct. 834.' }
      : null,
  );

  const submit = () => {
    if (solved) return;
    const normalized = String(value).replace(/\s/g, '');
    const numeric = Number(normalized);
    const correct = numeric === 834;
    const nextAttempts = attempts + 1;
    let nextMessage;
    if (correct) {
      nextMessage = { ru: 'Верно: 834.', uz: "To'g'ri: 834.", en: 'Correct. 834.' };
    } else if (Number.isFinite(numeric) && numeric > 1000) {
      nextMessage = {
        ru: 'Сейчас нужна только строка единиц: умножение на 2, а не на 32.',
        uz: "Hozir faqat birliklar qatori kerak: 32 ga emas, 2 ga ko'paytiring.",
        en: "You only need the ones row now: multiply by 2, not by 32.",
      };
    } else {
      nextMessage = {
        ru: 'Проверь перенос: 7 × 2 = 14, затем 1 × 2 + 1 = 3.',
        uz: "Ko'chirishni tekshiring: 7 × 2 = 14, keyin 1 × 2 + 1 = 3.",
        en: "Check the regrouping: 7 × 2 = 14, then 1 × 2 + 1 = 3.",
      };
    }
    setAttempts(nextAttempts);
    setSolved(correct);
    setMessage(nextMessage);
    playSfx(correct ? 'correct' : 'wrong');
    onAnswer({
      screenIdx: screen,
      screenId: 's' + screen,
      type: 'NumericInput',
      answer: value,
      correct,
      firstTry: correct && nextAttempts === 1,
      attempts: nextAttempts,
    });
  };

  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit={null} onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <div className="numeric-card math-card">
        <Formula>417 × 2 = ?</Formula>
        <label htmlFor="d10-answer">{t(c.lead)}</label>
        <div className="numeric-entry">
          <input
            id="d10-answer"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            value={value}
            disabled={solved}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submit();
            }}
          />
          <button type="button" className="btn btn-white-accent numeric-check" onClick={submit} disabled={solved || !value.trim()}>
            {t({ ru: 'Проверить', uz: 'Tekshirish' , en: "Check"})}
          </button>
        </div>
      </div>
      <FeedbackBlock show={Boolean(message)} correct={solved}>{t(message)}</FeedbackBlock>
      {!solved && attempts >= 2 && (
        <div className="hint-rows" aria-live="polite">
          <span>7 × 2 = 14 → 4, +1</span>
          <span>1 × 2 + 1 = 3</span>
        </div>
      )}
      {solved && (
        <div className="solution-proof">
          <span>{t({ ru: 'Строка единиц', uz: 'Birliklar qatori' , en: "Ones row"})}</span>
          <strong>417 × 2 = 834</strong>
        </div>
      )}
    </LessonScreen>
  );
}

function StrategyScreen({ screen, storedAnswer, onAnswer, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s11;
  const audio = useScreenAudio(c.audio, screen);
  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit={null} onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <Formula>500 × 24</Formula>
      <ScoredChoice
        screen={screen}
        c={c}
        options={c.options}
        correctIndex={0}
        storedAnswer={storedAnswer}
        onAnswer={onAnswer}
        proof={(
          <div className="solution-proof">
            <span>500 × 20 = 10 000</span>
            <span>500 × 4 = 2 000</span>
            <strong>10 000 + 2 000 = 12 000</strong>
          </div>
        )}
      />
    </LessonScreen>
  );
}

function ErrorRepairScreen({ screen, storedAnswer, onAnswer, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s12;
  const t = useT();
  const audio = useScreenAudio(c.audio, screen);
  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit={null} onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <div className="error-layout">
        <div className="error-column math-card" aria-label={t({ ru: 'Вычисление Бита', uz: 'Bitning hisobi', en: "Bit's calculation" })}>
          <pre>{' 1 205\n×   30\n──────\n 3 615'}</pre>
          <BitSVG state="awkward" />
        </div>
        <div>
          <ScoredChoice
            screen={screen}
            c={c}
            options={c.options}
            correctIndex={0}
            storedAnswer={storedAnswer}
            onAnswer={onAnswer}
            proof={(
              <div className="repair-proof">
                <span>1 205 × 3 = 3 615</span>
                <strong>1 205 × 30 = 36 150</strong>
              </div>
            )}
          />
        </div>
      </div>
    </LessonScreen>
  );
}

function CityCaseScreen({ screen, storedAnswer, onAnswer, onNext, onPrev, finishLesson }) {
  const c = CONTENT.s13;
  const audio = useScreenAudio(c.audio, screen);
  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit={null} onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <div className="sensor-scene math-card">
        <SensorPanelArray />
        <Formula>24 × 128</Formula>
      </div>
      <ScoredChoice
        screen={screen}
        c={c}
        options={c.options}
        correctIndex={0}
        storedAnswer={storedAnswer}
        onAnswer={onAnswer}
        proof={(
          <div className="solution-proof sensor-proof">
            <span>128 × 4 = 512</span>
            <span>128 × 20 = 2 560</span>
            <strong>512 + 2 560 = 3 072</strong>
          </div>
        )}
      />
    </LessonScreen>
  );
}

function SummaryScreen({ screen, onNext, onPrev, finishLesson, answers = [] }) {
  const c = CONTENT.s14;
  const t = useT();
  const lang = useLang();
  const audio = useScreenAudio(c.audio, screen);
  const { reached } = useNarrationBeats(audio, 4);
  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const visibleReached = reduced ? 3 : reached;
  const startShift = visibleReached >= 2 || audio.completed || audio.muted;
  const finalBeat = reduced || visibleReached >= 3 || audio.completed || audio.muted;
  const scoredIndexes = SCREEN_META.reduce((indexes, meta, index) => (meta.scored ? [...indexes, index] : indexes), []);
  const firstTryCount = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
  const totalScored = scoredIndexes.length;
  const rewardTitles = {
    top: { ru: 'Архитектор двух строк', uz: "Ikki qator me'mori", en: "Architect of two rows" },
    middle: { ru: 'Мастер двух строк', uz: 'Ikki qator ustasi', en: "Master of two rows" },
    base: { ru: 'Исследователь строк', uz: 'Qatorlar tadqiqotchisi', en: "Partial-product explorer" },
  };
  const rewardTitle = firstTryCount === totalScored
    ? rewardTitles.top
    : firstTryCount >= Math.max(1, totalScored - 1)
      ? rewardTitles.middle
      : rewardTitles.base;
  return (
    <LessonScreen screen={screen} c={c} audio={audio} bit={null} headingClassName="finale-heading" onNext={onNext} onPrev={onPrev} finishLesson={finishLesson}>
      <div className="finale-layout">
        <G4TitleReveal active={finalBeat} title={t(rewardTitle)} lang={lang} />
        <style>{G4_TITLE_STYLES}</style>
        <div className="finale-main-grid">
          <section className="finale-payoff-card math-card">
            <span className="finale-section-kicker">{t({ ru: 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ', uz: "BOSHLANG'ICH MISSIYA YECHIMI", en: "OPENING MISSION SOLUTION" })}</span>
            <div className="summary-demo">
              <small>{t({ ru: 'Точное вычисление из начала урока', uz: "Dars boshidagi aniq hisob", en: "Exact calculation from the opening of the lesson" })}</small>
              <b className="finale-hook-formula">324 × 23</b>
              <div className="summary-units">972</div>
              {reduced ? (
                <div className="summary-reduced-shift">6 480</div>
              ) : (
                <ShiftOnce
                  raw="648"
                  full="6 480"
                  start={startShift}
                  compact
                />
              )}
              <div className="column-rule" />
              <strong className={'summary-result ' + (finalBeat ? 'summary-result-visible' : '')}>7 452</strong>
            </div>
            <p className="finale-payoff-copy">{t({ ru: 'Произведения на три и на двадцать дают точный ответ 7 452.', uz: "Uchga va yigirmaga ko'paytmalar aniq 7 452 javobni beradi.", en: "The partial products for three and twenty add to the exact answer, 7 452." })}</p>
          </section>
          <section className="finale-mastery-card">
            <span className="finale-section-kicker">{t({ ru: 'ОСВОЕННЫЕ ОПОРЫ', uz: "SIZ O'RGANGAN TAYANCHLAR" , en: "KEY IDEAS MASTERED"})}</span>
            <div className="summary-rules">
              {[
                { ru: 'Строка единиц — 0 разрядов', uz: "Birliklar qatori — 0 xona" , en: "Ones row — no shift"},
                { ru: 'Строка десятков — 1 разряд', uz: "O'nliklar qatori — 1 xona" , en: "Tens row — shift one place"},
                { ru: 'Сложи неполные произведения', uz: "To'liqsiz ko'paytmalarni qo'shing", en: "Add the partial products" },
                { ru: 'Проверь результат оценкой', uz: "Natijani taxmin bilan tekshiring", en: "Check the result with an estimate" },
              ].map((item, index) => (
                <div
                  key={index}
                  className={'summary-rule ' + (visibleReached >= index ? 'summary-rule-visible' : '')}
                >
                  <span>{index + 1}</span><b>{t(item)}</b>
                </div>
              ))}
            </div>
          </section>
        </div>
        {finalBeat && <G4TitleCard title={t(rewardTitle)} lang={lang} firstTry={firstTryCount} totalScored={totalScored} />}
        <div className="next-rail">
          <span />
          <p><b>{t({ ru: 'СЛЕДУЮЩАЯ МИССИЯ', uz: "KEYINGI MISSIYA" , en: "NEXT MISSION"})}</b><span>{t({
            ru: 'Добавится строка сотен.',
            uz: "Yuzliklar qatori ham qo'shiladi.",
            en: "Next, a hundreds row will be added.",
          })}</span></p>
        </div>
      </div>
    </LessonScreen>
  );
}

const Screen0 = (props) => <HookScreen {...props} screen={props.screen} />;
const Screen1 = (props) => <DecompositionScreen {...props} screen={props.screen} />;
const Screen2 = (props) => <DistributiveScreen {...props} screen={props.screen} />;
const Screen3 = (props) => <UnitsPartialScreen {...props} screen={props.screen} />;
const Screen4 = (props) => <TensShiftScreen {...props} screen={props.screen} />;
const Screen5 = (props) => <CombineScreen {...props} screen={props.screen} />;
const Screen6 = (props) => <ColumnMorphScreen {...props} screen={props.screen} />;
const Screen7 = (props) => <ZeroUnitsScreen {...props} screen={props.screen} />;
const Screen8 = (props) => <MatchingScreen {...props} screen={props.screen} />;
const Screen9 = (props) => <ConstructionScreen {...props} screen={props.screen} />;
const Screen10 = (props) => <NumericScreen {...props} screen={props.screen} />;
const Screen11 = (props) => <StrategyScreen {...props} screen={props.screen} />;
const Screen12 = (props) => <ErrorRepairScreen {...props} screen={props.screen} />;
const Screen13 = (props) => <CityCaseScreen {...props} screen={props.screen} />;
const Screen14 = (props) => <SummaryScreen {...props} screen={props.screen} />;

const SCREENS = [
  Screen0,
  Screen1,
  Screen11,
  Screen3,
  Screen10,
  Screen4,
  Screen8,
  Screen5,
  Screen9,
  Screen7,
  Screen12,
  Screen2,
  Screen13,
  Screen6,
  Screen14,
];

export default function Grade4Dars10({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished }) {
  useMobileZoom();
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = normalizeLang(preview ? previewLang : langProp);
  const safeName = studentName || selectLocale(lang, { uz: "O'quvchi", ru: 'Ученик', en: 'Student' });
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
  // eslint-disable-next-line react-hooks/purity -- duration starts when the lesson mounts
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
    const scored = SCREEN_META
      .map((meta, index) => ({ meta, answer: answers[index] }))
      .filter((item) => item.meta.scored);
    const totalQuestions = scored.length;
    const correctAnswers = scored.filter((item) => item.answer?.firstTry).length;
    const firstTryCorrect = correctAnswers;
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
      firstTryStats: {
        total: totalQuestions,
        firstTryCorrect,
      },
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else console.log('[Grade4 Dars10 preview]', payload);
  }, [answers, lang, onFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
  const previous = () => setCurrent((value) => Math.max(value - 1, 0));

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>
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
  color: #12212C;
  background:
    radial-gradient(circle at 12% 12%, rgba(22,143,163,.12), transparent 30%),
    radial-gradient(circle at 88% 80%, rgba(255,91,53,.10), transparent 32%),
    linear-gradient(145deg, #F7F8F4 0%, #EEF3F1 100%);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
  zoom: var(--g4z, 1);
}
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
}
.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root p,
.lesson-root ul, .lesson-root ol, .lesson-root pre { margin: 0; padding: 0; }
.lesson-root button, .lesson-root input { font: inherit; }
.lesson-root button:focus-visible, .lesson-root input:focus-visible { outline: 3px solid rgba(22,143,163,.42); outline-offset: 3px; }
.stage {
  width: min(100%, 936px);
  max-width: 936px;
  height: 100dvh;
  min-height: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: transparent;
  animation: screen-in .45s both;
}
.stage-header {
  position: relative;
  z-index: 4;
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
  overflow: hidden;
  border-radius: 999px;
  background: rgba(80,97,109,.16);
}
.progress-bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #168FA3, #FF5B35);
  box-shadow: 0 0 12px rgba(255,91,53,.42);
  transition: width .45s ease;
}
.stage-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.chrome-title, .chrome-actions, .audio-controls {
  display: flex;
  align-items: center;
  gap: 9px;
}
.chrome-title {
  min-width: 0;
  color: #50616D;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.chrome-title > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.status-dot {
  flex: 0 0 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FF5B35;
  box-shadow: 0 0 10px rgba(255,91,53,.65);
}
.screen-type {
  padding: 4px 8px;
  border-radius: 999px;
  color: #168FA3;
  background: #E5F5F6;
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
  color: #50616D;
  background: rgba(255,255,255,.75);
  box-shadow: 0 4px 12px -7px rgba(58,53,48,.3);
  cursor: pointer;
}
.stage-body {
  min-height: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}
.stage-scroll {
  min-height: 0;
  flex: 1 1 auto;
  overflow: visible;
  padding-top: 18px;
  padding-bottom: 14px;
  position: relative;
}
.stage-happy-bit { width: 42px; height: 42px; position: absolute; z-index: 3; top: 10px; right: 8px; display: grid; place-items: center; }
.stage-happy-bit .g1-char { width: 100%; height: 100%; display: block; }
.screen-heading { padding-right: 52px; }
.stage-footer {
  position: relative;
  z-index: 4;
  flex: 0 0 auto;
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  padding-bottom: 14px;
  background: rgba(247,248,244,.94);
  backdrop-filter: blur(14px);
  border-top: 1px solid rgba(23,59,82,.08);
}
.screen-heading {
  min-height: 148px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 96px;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}
.screen-heading-no-bit {
  min-height: 112px;
  grid-template-columns: minmax(0, 1fr);
}
.heading-copy { min-width: 0; }
.lesson-kicker {
  margin-bottom: 7px !important;
  color: #168FA3;
  font: 900 10px/1 'JetBrains Mono', monospace;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.title {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(30px, 4.5vw, 46px);
  font-weight: 650;
  line-height: 1.06;
  letter-spacing: -.018em;
}
.heading-copy > p:last-child {
  max-width: 660px;
  margin-top: 11px;
  color: #50616D;
  font-size: 15px;
  line-height: 1.52;
}
.bit-coach {
  height: 94px;
  display: grid;
  place-items: center;
}
.bit-coach .g1-char {
  width: 68px;
  height: 85px;
  filter: drop-shadow(0 12px 13px rgba(58,53,48,.15));
  animation: bit-float 3.2s ease-in-out infinite;
}
.math-card {
  padding: 20px;
  border-radius: 22px;
  background: #FFFFFF;
  box-shadow:
    0 12px 30px rgba(58,53,48,.09),
    inset 0 0 0 1px rgba(23,59,82,.065);
}
.formula {
  width: 100%;
  padding: 16px 14px;
  border-radius: 17px;
  color: #173B52;
  background: linear-gradient(135deg, #E5F5F6, #F7FBFB);
  text-align: center;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font: 850 clamp(23px, 4vw, 38px)/1.18 'JetBrains Mono', monospace;
  box-shadow: inset 0 0 0 1px rgba(22,143,163,.10);
  transition: opacity .35s, transform .35s;
}
.formula-accent {
  color: #C93E20;
  background: linear-gradient(135deg, #FFF0EA, #FFF9F6);
}
.formula-success {
  margin-top: 14px;
  color: #227A53;
  background: linear-gradient(135deg, #E7F3EC, #F7FCF9);
}
.formula-soft { opacity: .16; transform: translateY(7px); }
.formula-visible { opacity: 1; transform: translateY(0); animation: reveal-up .48s both; }
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
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease, opacity .18s ease;
}
.btn:not(:disabled):hover { transform: translateY(-2px); }
.btn:disabled { opacity: .42; cursor: default; }
.btn-ghost {
  color: #50616D;
  background: transparent;
}
.btn-ghost:hover {
  background: #FFFFFF;
  box-shadow: 0 8px 20px -15px rgba(58,53,48,.4);
}
.btn-white-accent {
  margin-left: auto;
  color: #FF5B35;
  background: #FFFFFF;
  box-shadow: 0 9px 24px -12px rgba(255,91,53,.52), 0 0 0 1px rgba(255,91,53,.14);
}
.btn-white-accent:hover,
.btn-white-accent.btn-ready {
  color: #FFFFFF;
  background: #FF5B35;
  box-shadow: 0 12px 28px -12px rgba(255,91,53,.65);
}
.btn-ready { animation: ready-pulse 1.8s ease-in-out infinite; }
.numeric-check { min-width: 124px; }
.feedback {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: 16px;
  line-height: 1.46;
  animation: reveal-up .42s both;
}
.feedback strong {
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: #FFFFFF;
}
.feedback-correct { color: #227A53; background: #E7F3EC; }
.feedback-correct strong { background: #227A53; }
.feedback-wrong { color: #8A5A0E; background: #FFF5D9; }
.feedback-wrong strong { background: #A96F13; }
.choice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 11px;
  margin-top: 15px;
}
.choice-card {
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  border: 0;
  border-radius: 17px;
  color: #12212C;
  background: #FFFFFF;
  text-align: left;
  box-shadow: 0 6px 18px rgba(58,53,48,.11), inset 0 0 0 1px rgba(23,59,82,.08);
  cursor: pointer;
  transition: transform .2s, box-shadow .2s, background .2s, opacity .2s;
}
.choice-card:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(58,53,48,.14), inset 0 0 0 2px rgba(22,143,163,.24);
}
.choice-card:disabled { cursor: default; }
.choice-card > span {
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #FFFFFF;
  background: #173B52;
  font: 900 12px 'JetBrains Mono', monospace;
}
.choice-card > b { font-size: 14px; line-height: 1.35; }
.choice-selected {
  background: #E5F5F6;
  box-shadow: 0 0 0 2px rgba(22,143,163,.32);
}
.choice-selected > span { background: #168FA3; }
.choice-correct {
  background: #E7F3EC;
  box-shadow: 0 0 0 2px rgba(34,122,83,.34);
}
.choice-correct > span { background: #227A53; }
.prediction-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 9px;
  margin-top: 15px;
}
.prediction-chip {
  min-width: 116px;
  min-height: 48px;
  padding: 9px 14px;
  border: 0;
  border-radius: 14px;
  color: #173B52;
  background: #FFFFFF;
  font: 850 16px 'JetBrains Mono', monospace;
  box-shadow: 0 5px 16px rgba(58,53,48,.11);
  cursor: pointer;
}
.prediction-picked { box-shadow: 0 0 0 2px rgba(22,143,163,.35), 0 7px 18px rgba(58,53,48,.10); }
.prediction-correct { color: #227A53; background: #E7F3EC; }
.hook-scene {
  position: relative;
  min-height: 295px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 170px;
  align-items: center;
  gap: 18px;
  padding: 24px;
  overflow: hidden;
  border-radius: 25px;
  color: #FFFFFF;
  background: linear-gradient(145deg, #173B52, #102B3D);
  box-shadow: 0 16px 36px rgba(23,59,82,.22);
}
.terminal-card {
  position: relative;
  z-index: 1;
  padding: 20px;
  border-radius: 19px;
  background: rgba(255,255,255,.08);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.10);
}
.terminal-label {
  color: #AEE7E9;
  font: 900 9px/1 'JetBrains Mono', monospace;
  letter-spacing: .13em;
}
.hook-expression {
  margin-top: 14px;
  font: 900 clamp(32px, 7vw, 58px)/1.05 'JetBrains Mono', monospace;
}
.hook-line {
  margin-top: 18px;
  padding: 12px 14px;
  border-radius: 13px;
  color: #D6E4EB;
  background: rgba(0,0,0,.16);
  font: 800 clamp(19px, 3vw, 29px)/1.2 'JetBrains Mono', monospace;
  transition: color .28s, box-shadow .28s;
}
.terminal-card p { margin-top: 14px; color: #D2E1E8; line-height: 1.45; }
.hook-bit .g1-char { width: 104px; height: 130px; animation: bit-awkward 2.4s ease-in-out infinite; }
.number-lit { color: #AEE7E9; text-shadow: 0 0 20px rgba(174,231,233,.75); }
.tens-pulse {
  display: inline-block;
  color: #FFD08A;
  animation: tens-pulse 1.25s ease-in-out infinite;
}
.hook-choices { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.decomposition-board { display: grid; justify-items: center; gap: 17px; }
.number-23 {
  display: flex;
  font: 900 clamp(56px, 10vw, 92px)/1 'JetBrains Mono', monospace;
  color: #173B52;
}
.number-23 > span {
  width: .72em;
  display: inline-grid;
  place-items: center;
  border-radius: 13px;
  transition: color .25s, background .25s, transform .25s;
}
.number-23 .digit-units { color: #FF5B35; }
.number-23 .digit-live {
  color: #FFFFFF;
  background: #168FA3;
  transform: translateY(-4px);
  box-shadow: 0 10px 22px rgba(22,143,163,.25);
}
.number-23 .digit-live.digit-units { background: #FF5B35; }
.place-links {
  width: min(100%, 590px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  opacity: .15;
  transform: translateY(8px);
  transition: opacity .45s, transform .45s;
}
.place-links.links-visible { opacity: 1; transform: translateY(0); }
.place-links > div {
  min-height: 104px;
  display: grid;
  place-items: center;
  gap: 8px;
  padding: 13px;
  border-radius: 16px;
  background: #F5FAFA;
}
.place-links b { color: #50616D; font-size: 13px; }
.tens-blocks, .units-blocks { display: flex; gap: 5px; }
.tens-blocks i {
  width: 48px;
  height: 12px;
  border-radius: 4px;
  background: repeating-linear-gradient(90deg, #168FA3 0 3px, #AEE7E9 3px 5px);
}
.units-blocks i {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background: #FF5B35;
}
.group-model { display: grid; gap: 14px; }
.group-strip {
  display: grid;
  grid-template-columns: repeat(23, minmax(7px, 1fr));
  gap: 4px;
}
.group-strip i {
  aspect-ratio: 1;
  max-height: 26px;
  border-radius: 7px;
  opacity: .13;
  transform: translateY(9px);
}
.group-strip .group-tens { background: #168FA3; }
.group-strip .group-units { background: #FF5B35; }
.group-strip .group-visible {
  animation: group-in .38s both;
  animation-delay: calc(var(--group-index) * 25ms);
}
.group-strip .group-live { box-shadow: 0 0 12px currentColor; }
.group-labels {
  display: grid;
  grid-template-columns: 20fr auto 3fr;
  align-items: center;
  gap: 8px;
  color: #173B52;
  text-align: center;
  font: 900 15px 'JetBrains Mono', monospace;
}
.group-labels > span:first-child {
  color: #168FA3;
  border-top: 3px solid #168FA3;
  padding-top: 5px;
}
.group-labels > span:last-child {
  color: #FF5B35;
  border-top: 3px solid #FF5B35;
  padding-top: 5px;
}
.distributive-rail {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
  opacity: .16;
  transform: translateY(6px);
  transition: .42s;
}
.distributive-rail.rail-visible { opacity: 1; transform: translateY(0); }
.distributive-rail span {
  padding: 13px;
  border-radius: 13px;
  color: #173B52;
  background: #E5F5F6;
  text-align: center;
  font: 850 18px 'JetBrains Mono', monospace;
}
.distributive-rail span:last-child { color: #C93E20; background: #FFF0EA; }
.production-rails {
  width: 100%;
  height: auto;
  overflow: visible;
  opacity: .14;
  transform: translateY(8px);
  transition: opacity .45s ease, transform .45s ease;
}
.production-rails-visible { opacity: 1; transform: translateY(0); }
.production-rail { transition: opacity .28s ease, filter .28s ease; }
.production-rail-bed { fill: #F4F8F8; }
.production-rail-units .production-rail-bed { stroke: rgba(22,143,163,.18); stroke-width: 2; }
.production-rail-tens .production-rail-bed { fill: #FFF6F2; stroke: rgba(255,91,53,.18); stroke-width: 2; }
.production-input rect { fill: #FFFFFF; }
.production-input text,
.production-output text,
.production-multiplier text {
  text-anchor: middle;
  fill: #173B52;
  font: 850 18px 'JetBrains Mono', monospace;
}
.production-multiplier circle { fill: #168FA3; }
.production-multiplier text { fill: #FFFFFF; font-size: 14px; }
.production-rail-tens .production-multiplier circle { fill: #FF5B35; }
.production-belt {
  fill: none;
  stroke: rgba(23,59,82,.22);
  stroke-width: 15;
  stroke-linecap: round;
}
.production-roller { fill: #FFFFFF; stroke: rgba(23,59,82,.24); stroke-width: 3; }
.production-flow {
  fill: none;
  stroke: #168FA3;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 9 12;
}
.production-rail-tens .production-flow { stroke: #FF5B35; }
.production-output rect { fill: #DFF3F4; }
.production-rail-tens .production-output rect { fill: #FFE8DF; }
.production-place-arrow {
  fill: none;
  stroke: #FF5B35;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.production-rail-live {
  filter: drop-shadow(0 7px 8px rgba(22,143,163,.14));
}
.production-rail-live .production-flow { animation: production-flow 1.1s linear infinite; }
.production-rail-tens.production-rail-live {
  filter: drop-shadow(0 7px 8px rgba(255,91,53,.12));
}
.units-workspace {
  display: grid;
  grid-template-columns: minmax(240px, .78fr) minmax(300px, 1.22fr);
  gap: 16px;
  align-items: stretch;
}
.column-mini {
  position: relative;
  display: grid;
  align-content: center;
  justify-items: end;
  color: #173B52;
  font: 900 clamp(31px, 5vw, 45px)/1.16 'JetBrains Mono', monospace;
}
.column-mini hr {
  width: 100%;
  height: 3px;
  margin: 6px 0 8px;
  border: 0;
  border-radius: 9px;
  background: #173B52;
}
.column-mini > div:last-child span { opacity: .14; transition: opacity .3s, color .3s; }
.column-mini > div:last-child .digit-shown { opacity: 1; }
.column-mini > div:last-child.partial-complete { color: #227A53; }
.carry-one {
  position: absolute;
  top: 20px;
  right: 72px;
  color: #FF5B35;
  font-size: 15px;
  opacity: 0;
  transform: translateY(10px);
  transition: .35s;
}
.carry-one.carry-visible { opacity: 1; transform: translateY(0); animation: carry-hop .8s both; }
.calculation-notes { display: grid; gap: 9px; }
.calculation-note {
  min-height: 62px;
  display: grid;
  grid-template-columns: minmax(130px, .8fr) minmax(0, 1.2fr);
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 15px;
  opacity: .18;
  background: #FFFFFF;
  box-shadow: inset 0 0 0 1px rgba(23,59,82,.08);
  transform: translateX(8px);
  transition: opacity .35s, transform .35s, box-shadow .35s;
}
.calculation-note.note-visible { opacity: 1; transform: translateX(0); }
.calculation-note.note-live { box-shadow: inset 4px 0 0 #168FA3, 0 7px 19px rgba(22,143,163,.11); }
.calculation-note b { color: #173B52; font: 850 16px 'JetBrains Mono', monospace; }
.calculation-note span { color: #50616D; font-size: 13px; line-height: 1.35; }
.shift-proof-card { display: grid; gap: 13px; }
.place-caption {
  color: #50616D;
  text-align: center;
  font-weight: 800;
  opacity: .45;
}
.place-caption.caption-live { color: #168FA3; opacity: 1; animation: caption-pulse 1.1s ease-in-out infinite; }
.shift-once {
  --digit-step: 52px;
  width: min(100%, 480px);
  margin: 0 auto;
  padding: 13px;
  border-radius: 17px;
  background: #173B52;
  color: #FFFFFF;
}
.shift-workshop-svg {
  width: 100%;
  height: auto;
  max-height: 78px;
  display: block;
  margin: -2px auto 5px;
  overflow: visible;
}
.workshop-shell { fill: rgba(255,255,255,.045); stroke: rgba(174,231,233,.12); stroke-width: 2; }
.workshop-bay rect { fill: rgba(174,231,233,.07); stroke: rgba(174,231,233,.22); stroke-width: 2; }
.workshop-bay path {
  fill: none;
  stroke: rgba(174,231,233,.35);
  stroke-width: 3;
  stroke-linecap: round;
}
.workshop-conveyor {
  fill: none;
  stroke: rgba(255,255,255,.22);
  stroke-width: 9;
  stroke-linecap: round;
}
.shift-workshop-svg > circle { fill: #173B52; stroke: #AEE7E9; stroke-width: 2; }
.workshop-crane path {
  fill: none;
  stroke: #AEE7E9;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.workshop-crane rect { fill: #FF5B35; }
.workshop-one-place-arrow {
  fill: none;
  stroke: #FFD4C8;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 10 7;
  opacity: .55;
}
.shift-workshop-running .workshop-one-place-arrow {
  opacity: 1;
  animation: workshop-arrow 1s ease-in-out infinite;
}
.shift-workshop-running .workshop-conveyor { animation: workshop-belt 1.1s linear infinite; }
.shift-workshop-settled .workshop-one-place-arrow { opacity: .35; animation: none; }
.shift-place-head, .shift-lane {
  display: grid;
  grid-template-columns: repeat(4, var(--digit-step));
  justify-content: center;
}
.shift-place-head {
  color: #AFC5CF;
  text-align: center;
  font: 800 8px 'JetBrains Mono', monospace;
}
.shift-lane {
  position: relative;
  min-height: 62px;
  align-items: center;
  margin-top: 4px;
  overflow: visible;
  border-radius: 12px;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(255,255,255,.04) 0,
      rgba(255,255,255,.04) calc(var(--digit-step) - 1px),
      rgba(255,255,255,.14) calc(var(--digit-step) - 1px),
      rgba(255,255,255,.14) var(--digit-step)
    );
}
.raw-shift-token, .full-value-token {
  grid-column: 1 / 5;
  justify-self: end;
  padding-right: 10px;
  color: #FFD4C8;
  white-space: nowrap;
  font: 900 31px/1 'JetBrains Mono', monospace;
}
.raw-shift-token { transform: translateX(var(--digit-step)); }
.raw-shift-token.raw-shift-moving {
  animation: raw-shift-once .9s cubic-bezier(.2,.78,.2,1) both;
}
.full-value-token {
  color: #AEE7E9;
  animation: full-value-settle .3s ease-out both;
}
.shift-caption {
  margin-top: 8px !important;
  color: #C6D7DF;
  text-align: center;
  font-size: 11px;
  line-height: 1.35;
}
.shift-once-compact { --digit-step: 43px; padding: 9px; }
.shift-once-compact .shift-workshop-svg { max-height: 52px; }
.shift-once-compact .shift-lane { min-height: 48px; }
.shift-once-compact .raw-shift-token,
.shift-once-compact .full-value-token { font-size: 24px; }
.alignment-scene { display: grid; gap: 8px; }
.place-grid-labels {
  width: min(100%, 510px);
  margin-left: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  color: #87949D;
  text-align: center;
  font: 800 9px 'JetBrains Mono', monospace;
}
.aligned-row {
  min-height: 65px;
  display: grid;
  grid-template-columns: minmax(130px, 1fr) minmax(200px, 1.15fr);
  align-items: center;
  gap: 15px;
  padding: 10px 17px;
  border-radius: 15px;
  opacity: .13;
  transform: translateY(-9px);
  transition: opacity .34s, transform .34s, box-shadow .34s;
}
.aligned-row.aligned-visible { opacity: 1; transform: translateY(0); }
.aligned-row.aligned-live { box-shadow: inset 4px 0 0 currentColor; }
.aligned-row small {
  color: #50616D;
  text-align: right;
  font: 800 12px 'JetBrains Mono', monospace;
}
.aligned-row strong {
  justify-self: end;
  min-width: 210px;
  text-align: right;
  font: 900 clamp(26px, 4vw, 39px)/1 'JetBrains Mono', monospace;
}
.units-color { color: #168FA3; background: #E5F5F6; }
.tens-color { color: #C93E20; background: #FFF0EA; }
.sum-color { color: #227A53; background: #E7F3EC; }
.alignment-rule {
  height: 3px;
  margin-left: auto;
  width: min(100%, 510px);
  border-radius: 9px;
  background: #173B52;
}
.vertical-arrival.aligned-visible { animation: vertical-arrival .46s both; }
.contract-note {
  margin-top: 12px !important;
  color: #50616D;
  text-align: center;
  font-size: 12px;
}
.column-morph {
  width: min(100%, 590px);
  margin: 0 auto;
  display: grid;
  gap: 5px;
}
.column-fixed { width: min(100%, 360px); margin: 0 auto; }
.column-line {
  min-height: 38px;
  display: grid;
  grid-template-columns: 34px 1fr;
  align-items: center;
  color: #173B52;
  font: 900 29px/1.05 'JetBrains Mono', monospace;
  text-align: right;
  transition: opacity .35s, transform .35s;
}
.column-line span { text-align: center; }
.column-rule {
  height: 3px;
  border-radius: 9px;
  background: #173B52;
}
.line-hidden { opacity: .1; transform: translateY(-6px); }
.line-visible { opacity: 1; transform: translateY(0); }
.column-result { color: #227A53; font-size: 32px; }
.column-bottom { margin-top: 3px; }
.column-morph > .shift-once {
  width: min(100%, 360px);
}
.shift-legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
  margin-top: 8px;
}
.shift-legend span {
  padding: 9px 11px;
  border-radius: 11px;
  color: #50616D;
  background: #F4F7F7;
  text-align: center;
  font-size: 11px;
  font-weight: 800;
}
.zero-units-layout {
  display: grid;
  grid-template-columns: minmax(240px, .8fr) minmax(300px, 1.2fr);
  gap: 15px;
}
.zero-track { display: grid; align-content: center; gap: 15px; }
.zero-placeholder {
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 13px 16px;
  border-radius: 15px;
  color: #87949D;
  background: repeating-linear-gradient(135deg, #F4F6F6 0 8px, #ECEFEF 8px 16px);
  opacity: .25;
  transition: opacity .4s;
}
.zero-placeholder.zero-visible { opacity: .72; }
.zero-placeholder b { color: #50616D; font: 900 34px 'JetBrains Mono', monospace; }
.raw-equation {
  margin-bottom: 12px !important;
  color: #173B52;
  text-align: center;
  font: 850 20px 'JetBrains Mono', monospace;
}
.matching-board { display: grid; gap: 13px; }
.match-row {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) minmax(280px, 1.4fr);
  align-items: center;
  gap: 15px;
  padding: 13px;
  border-radius: 16px;
  background: #F7FAFA;
}
.match-row > strong { color: #173B52; }
.match-row > div { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.match-choice {
  min-height: 50px;
  border: 0;
  border-radius: 13px;
  color: #173B52;
  background: #FFFFFF;
  font-weight: 850;
  box-shadow: 0 4px 13px rgba(58,53,48,.10);
  cursor: pointer;
}
.match-picked {
  color: #FFFFFF;
  background: #168FA3;
  box-shadow: 0 8px 18px rgba(22,143,163,.25);
}
.construction-board {
  display: grid;
  grid-template-columns: minmax(310px, 1.1fr) minmax(250px, .9fr);
  gap: 15px;
}
.slot-stack { display: grid; gap: 11px; }
.product-slot {
  min-height: 82px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 13px 16px;
  border: 2px dashed rgba(22,143,163,.28);
  border-radius: 15px;
  color: #50616D;
  background: #F8FBFB;
  text-align: left;
  cursor: pointer;
}
.product-slot strong { color: #173B52; font: 900 24px 'JetBrains Mono', monospace; }
.product-slot.slot-active {
  border-style: solid;
  border-color: #168FA3;
  background: #E5F5F6;
  box-shadow: 0 0 0 4px rgba(22,143,163,.08);
}
.card-bank {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  align-content: center;
}
.card-bank button {
  min-height: 62px;
  border: 0;
  border-radius: 14px;
  color: #173B52;
  background: #FFFFFF;
  font: 900 20px 'JetBrains Mono', monospace;
  box-shadow: 0 5px 16px rgba(58,53,48,.12), inset 0 0 0 1px rgba(23,59,82,.08);
  cursor: pointer;
}
.card-bank button.card-used { color: #168FA3; background: #E5F5F6; }
.numeric-card {
  width: min(100%, 620px);
  margin: 0 auto;
  display: grid;
  gap: 14px;
}
.numeric-card label { color: #50616D; font-weight: 750; }
.numeric-entry { display: grid; grid-template-columns: 1fr auto; gap: 10px; }
.numeric-entry input {
  width: 100%;
  min-height: 56px;
  padding: 10px 16px;
  border: 2px solid rgba(23,59,82,.13);
  border-radius: 14px;
  outline: 0;
  color: #173B52;
  background: #FFFFFF;
  font: 900 23px 'JetBrains Mono', monospace;
}
.numeric-entry input:focus {
  border-color: #168FA3;
  box-shadow: 0 0 0 4px rgba(22,143,163,.10);
}
.hint-rows, .solution-proof, .repair-proof {
  margin-top: 14px;
  padding: 15px 17px;
  border-radius: 17px;
  display: grid;
  gap: 8px;
  color: #50616D;
  background: #FFF5D9;
  font: 800 15px 'JetBrains Mono', monospace;
  animation: reveal-up .45s both;
}
.solution-proof, .repair-proof {
  color: #227A53;
  background: #E7F3EC;
}
.solution-proof strong, .repair-proof strong {
  padding-top: 8px;
  border-top: 2px solid rgba(34,122,83,.26);
  font-size: 18px;
}
.error-layout {
  display: grid;
  grid-template-columns: minmax(220px, .7fr) minmax(360px, 1.3fr);
  gap: 16px;
  align-items: start;
}
.error-layout .choice-grid { grid-template-columns: 1fr; margin-top: 0; }
.error-column {
  position: relative;
  min-height: 330px;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: #173B52;
}
.error-column pre {
  position: relative;
  z-index: 1;
  font: 900 24px/1.27 'JetBrains Mono', monospace;
}
.error-column .g1-char {
  position: absolute;
  right: -15px;
  bottom: -24px;
  width: 64px;
  opacity: .42;
}
.sensor-scene {
  display: grid;
  grid-template-columns: minmax(270px, 1fr) minmax(250px, .8fr);
  gap: 18px;
  align-items: center;
}
.sensor-panels-svg { width: 100%; height: auto; display: block; overflow: visible; }
.sensor-yard { fill: #F4F8F8; stroke: rgba(23,59,82,.09); stroke-width: 2; }
.sensor-zone > rect { fill: #DFF3F4; }
.sensor-zone > text {
  text-anchor: middle;
  fill: #168FA3;
  font: 900 17px 'JetBrains Mono', monospace;
}
.sensor-zone-units > rect { fill: #FFE8DF; }
.sensor-zone-units > text { fill: #D94827; }
.sensor-panel rect { fill: #173B52; }
.sensor-panel circle { fill: #95C93D; }
.sensor-panel path {
  fill: none;
  stroke: rgba(255,255,255,.62);
  stroke-width: 3;
  stroke-linecap: round;
}
.sensor-panel-units rect { fill: #FF5B35; }
.sensor-zone-tens { animation: sensor-zone-glow 2.5s ease-in-out infinite; }
.sensor-zone-units { animation: sensor-zone-glow 2.5s .7s ease-in-out infinite; }
.sensor-split {
  fill: none;
  stroke: rgba(23,59,82,.23);
  stroke-width: 2;
  stroke-dasharray: 6 7;
}
.sensor-proof { margin-top: 14px; }
.screen-heading.finale-heading {
  min-height: 0;
  margin-bottom: 12px;
  padding: 12px 16px;
  display: block;
  border-left: 5px solid #FF5B35;
  border-radius: 0 17px 17px 0;
  background: rgba(255,255,255,.78);
  box-shadow: 0 8px 22px rgba(58,53,48,.12);
}
.finale-heading .lesson-kicker { margin-bottom: 4px !important; color: #FF5B35; font-size: 9px; }
.finale-heading .title { font-size: clamp(21px,3.3vw,29px); }
.finale-heading .heading-copy > p:last-child { margin-top: 4px; font-size: 11px; line-height: 1.35; }
.finale-layout { display: grid; gap: 12px; }
.finale-main-grid { display: grid; grid-template-columns: minmax(0,.95fr) minmax(0,1.05fr); gap: 12px; align-items: stretch; }
.finale-payoff-card,
.finale-mastery-card { min-width: 0; padding: 14px; border-radius: 19px; background: rgba(255,255,255,.74); box-shadow: 0 8px 22px rgba(58,53,48,.12); }
.finale-payoff-card { display: grid; align-content: center; gap: 8px; }
.finale-section-kicker { color: #168FA3; font-size: 9px; font-weight: 900; letter-spacing: .1em; }
.summary-layout {
  display: grid;
  grid-template-columns: minmax(300px, .9fr) minmax(320px, 1.1fr);
  gap: 16px;
  align-items: stretch;
}
.summary-rules { margin-top: 9px; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 7px; }
.summary-rule {
  min-height: 54px;
  display: grid;
  grid-template-columns: 31px 1fr;
  align-items: center;
  gap: 8px;
  padding: 8px 9px;
  border-radius: 15px;
  opacity: .16;
  transform: translateX(-8px);
  background: #FFFFFF;
  box-shadow: 0 6px 18px rgba(58,53,48,.09);
  transition: opacity .35s, transform .35s;
}
.summary-rule-visible { opacity: 1; transform: translateX(0); }
.summary-rule > span {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #FFFFFF;
  background: #168FA3;
  font: 900 12px 'JetBrains Mono', monospace;
}
.summary-rule b { font-size: 10px; line-height: 1.35; }
.summary-demo {
  display: grid;
  align-content: center;
  gap: 8px;
}
.summary-demo > small { color: #87949D; font-size: 9px; font-weight: 850; text-align: center; }
.finale-hook-formula { color: #173B52; text-align: center; font: 900 16px/1 'JetBrains Mono',monospace; }
.summary-units, .summary-result {
  width: min(100%, 360px);
  margin: 0 auto;
  padding: 8px 17px;
  color: #168FA3;
  text-align: right;
  font: 900 29px 'JetBrains Mono', monospace;
}
.summary-result {
  color: #227A53;
  opacity: .12;
  transform: translateY(-8px);
  transition: opacity .4s, transform .4s;
}
.summary-result-visible { opacity: 1; transform: translateY(0); }
.summary-reduced-shift {
  width: min(100%,360px);
  margin: 0 auto;
  padding: 8px 17px;
  color: #173B52;
  text-align: right;
  font: 900 29px 'JetBrains Mono', monospace;
}
.finale-payoff-copy { margin: 0; color: #50616D; font-size: 10px; font-weight: 800; line-height: 1.35; }
.finale-reward {
  position: relative;
  min-height: 128px;
  padding: 10px 22px;
  display: grid;
  grid-template-columns: 82px 106px minmax(0,1fr);
  align-items: center;
  gap: 15px;
  border-radius: 22px;
  color: white;
  background: #173B52;
  opacity: .52;
  overflow: hidden;
  transform: translateY(7px);
  transition: opacity .5s ease, transform .5s ease;
}
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
.finale-confetti i { position: absolute; width: 6px; height: 10px; border-radius: 2px; background: #FF5B35; animation: d10FinaleConfetti 1.2s cubic-bezier(.16,1,.3,1) both; }
.finale-confetti i:nth-child(1) { left: 8%; top: 12%; rotate: 17deg; }
.finale-confetti i:nth-child(2) { left: 22%; top: 72%; background: #FFC23C; rotate: -24deg; }
.finale-confetti i:nth-child(3) { left: 38%; top: 18%; background: #9DEBF7; rotate: 35deg; }
.finale-confetti i:nth-child(4) { left: 51%; top: 76%; background: #95C93D; rotate: -12deg; }
.finale-confetti i:nth-child(5) { left: 66%; top: 13%; background: #FFC23C; rotate: 28deg; }
.finale-confetti i:nth-child(6) { left: 78%; top: 70%; background: #9DEBF7; rotate: -30deg; }
.finale-confetti i:nth-child(7) { left: 89%; top: 20%; background: #95C93D; rotate: 12deg; }
.finale-confetti i:nth-child(8) { left: 95%; top: 67%; rotate: -18deg; }
.next-rail {
  display: grid;
  grid-template-columns: 42px 1fr;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  color: #50616D;
  font-size: 12px;
}
.next-rail > p { margin: 0; display: grid; gap: 3px; }
.next-rail > p > b { color: #168FA3; font-size: 8px; letter-spacing: .1em; }
.next-rail > span {
  height: 3px;
  border-radius: 9px;
  background: repeating-linear-gradient(90deg, #87949D 0 6px, transparent 6px 11px);
}
.preview-language {
  position: fixed;
  z-index: 30;
  top: 9px;
  right: 9px;
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
.preview-language .preview-active { color: #FFFFFF; background: #FF5B35; }
.g1-bit-ant { transform-box: fill-box; transform-origin: bottom; animation: g4antbob 2.2s ease-in-out infinite; }
.g1-eyes { transform-box: fill-box; transform-origin: center; animation: g4blink 3.8s infinite; }
.g1-bit-wave { transform-box: fill-box; transform-origin: bottom left; animation: g4wavebig 1.25s ease-in-out infinite; }
.bit-wave-left, .bit-wave-right, .bit-think-hand, .bit-point-arm, .bit-point-target,
.bit-idea-bulb, .bit-focus-hands, .bit-focus-scan, .bit-nod-hand, .bit-nod-check {
  transform-box: fill-box;
  transform-origin: center;
}
.bit-double-wave .bit-wave-left { transform-origin: bottom right; animation: bit-wave-left 1.05s ease-in-out infinite; }
.bit-double-wave .bit-wave-right { transform-origin: bottom left; animation: bit-wave-right 1.05s ease-in-out infinite; }
.bit-think-hand { animation: bit-think-tap 1.8s ease-in-out infinite; }
.bit-point-arm { transform-origin: left center; animation: bit-point 1.45s ease-in-out infinite; }
.bit-point-target { animation: bit-target 1.45s ease-in-out infinite; }
.bit-idea-bulb { animation: bit-idea 1.55s ease-in-out infinite; }
.bit-focus-hands { transform-origin: center bottom; animation: bit-focus 1.7s ease-in-out infinite; }
.bit-focus-scan { animation: bit-scan 1.7s ease-in-out infinite; }
.bit-nod-hand { animation: bit-nod-hand 1.35s ease-in-out infinite; }
.bit-nod-check { animation: bit-check 1.35s ease-in-out infinite; }
@keyframes raw-shift-once {
  from { opacity: .48; transform: translateX(var(--digit-step)); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes full-value-settle {
  from { opacity: 0; transform: translateY(-7px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes vertical-arrival {
  from { opacity: 0; transform: translateY(-11px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes production-flow { to { stroke-dashoffset: -42; } }
@keyframes workshop-arrow {
  50% { opacity: .58; transform: translateX(-5px); }
}
@keyframes workshop-belt { 50% { stroke: rgba(174,231,233,.48); } }
@keyframes sensor-zone-glow {
  50% { filter: drop-shadow(0 5px 7px rgba(22,143,163,.18)); }
}
@keyframes screen-in { from { opacity: 0; transform: translateY(10px); } }
@keyframes reveal-up { from { opacity: 0; transform: translateY(8px); } }
@keyframes group-in { from { opacity: .15; transform: translateY(9px); } to { opacity: 1; transform: translateY(0); } }
@keyframes carry-hop { 0% { transform: translate(28px, 34px); } 65% { transform: translate(-4px, -5px); } }
@keyframes caption-pulse { 50% { transform: scale(1.025); } }
@keyframes ready-pulse { 50% { transform: scale(1.025); box-shadow: 0 14px 31px -10px rgba(255,91,53,.66); } }
@keyframes bit-float { 50% { transform: translateY(-5px); } }
@keyframes bit-awkward { 0%,100% { transform: rotate(-1deg); } 50% { transform: rotate(1.5deg) translateY(-4px); } }
@keyframes tens-pulse { 50% { transform: scale(1.16); text-shadow: 0 0 18px rgba(255,208,138,.8); } }
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
@keyframes d10FinaleConfetti { from { opacity: 0; translate: 0 -14px; rotate: 0deg; } to { opacity: .82; } }
@media (max-height: 780px) {
  .stage-scroll { padding-top: 8px; padding-bottom: 6px; }
  .stage-footer { min-height: 58px; padding-block: 6px; }
  .screen-heading { min-height: 82px; margin-bottom: 8px; gap: 9px; }
  .screen-heading-no-bit { min-height: 72px; }
  .bit-coach { height: 76px; }
  .math-card { padding: 10px; }
  .choice-grid, .matching-board, .construction-board { gap: 8px; }
  .choice-card { min-height: 52px; padding: 8px 10px; }
  .feedback-block { min-height: 46px; padding-block: 7px; }
  .production-rails { max-height: 130px; }
}

@media (max-width: 640px) {
  .stage { width: 390px; max-width: 390px; height: 100dvh; margin: 0; }
  .stage-header { padding-top: 60px; }
  .screen-type { display: none; }
  .stage-scroll { padding-top: 9px; padding-bottom: 7px; }
  .stage-footer { min-height: 68px; padding-top: 9px; padding-bottom: 10px; }
  .screen-heading {
    min-height: 125px;
    grid-template-columns: minmax(0, 1fr) 76px;
    gap: 8px;
    margin-bottom: 13px;
  }
  .screen-heading-no-bit {
    min-height: 98px;
    grid-template-columns: minmax(0, 1fr);
  }
  .title { font-size: 28px; }
  .heading-copy > p:last-child { margin-top: 7px; font-size: 12px; line-height: 1.4; }
  .lesson-kicker { margin-bottom: 5px !important; font-size: 8px; }
  .bit-coach { height: 86px; }
  .bit-coach .g1-char { width: 68px; height: 85px; }
  .math-card { padding: 14px; border-radius: 18px; }
  .formula { padding: 13px 9px; font-size: 23px; }
  .btn { min-height: 46px; padding: 10px 13px; font-size: 13px; }
  .choice-grid { grid-template-columns: 1fr; gap: 8px; margin-top: 11px; }
  .choice-card { min-height: 54px; padding: 9px 11px; }
  .choice-card > span { flex-basis: 30px; width: 30px; height: 30px; }
  .choice-card > b { font-size: 12px; }
  .hook-scene {
    min-height: 246px;
    grid-template-columns: minmax(0, 1fr) 94px;
    gap: 8px;
    padding: 14px;
    border-radius: 20px;
  }
  .terminal-card { padding: 14px 11px; }
  .hook-expression { font-size: 35px; }
  .hook-line { margin-top: 12px; padding: 10px; font-size: 17px; }
  .terminal-card p { margin-top: 10px; font-size: 11px; }
  .hook-bit .g1-char { width: 78px; height: 98px; }
  .hook-choices { grid-template-columns: 1fr; }
  .number-23 { font-size: 59px; }
  .place-links { gap: 8px; }
  .place-links > div { min-height: 82px; padding: 9px; }
  .place-links b { font-size: 10px; }
  .tens-blocks i { width: 32px; }
  .group-strip { gap: 2px; }
  .group-labels { font-size: 12px; }
  .distributive-rail span { padding: 9px 5px; font-size: 13px; }
  .production-rails { margin: -2px 0; }
  .units-workspace { grid-template-columns: 126px minmax(0, 1fr); gap: 8px; }
  .column-mini { padding: 12px; font-size: 27px; }
  .carry-one { top: 13px; right: 39px; }
  .calculation-notes { gap: 6px; }
  .calculation-note {
    min-height: 47px;
    grid-template-columns: 1fr;
    gap: 2px;
    padding: 8px 9px;
  }
  .calculation-note b { font-size: 11px; }
  .calculation-note span { font-size: 9px; }
  .shift-once { --digit-step: 45px; padding: 9px; }
  .shift-workshop-svg { max-height: 48px; }
  .raw-shift-token, .full-value-token { font-size: 25px; }
  .shift-once-compact { --digit-step: 38px; }
  .shift-once-compact .raw-shift-token,
  .shift-once-compact .full-value-token { font-size: 21px; }
  .aligned-row {
    min-height: 54px;
    grid-template-columns: minmax(90px, 1fr) minmax(145px, 1.2fr);
    padding: 8px 10px;
  }
  .aligned-row small { font-size: 9px; }
  .aligned-row strong { min-width: 145px; font-size: 25px; }
  .contract-note { font-size: 10px; }
  .column-morph { padding: 12px; }
  .column-line { min-height: 31px; font-size: 24px; }
  .shift-legend { gap: 5px; }
  .shift-legend span { padding: 7px 5px; font-size: 9px; }
  .zero-units-layout { grid-template-columns: 1fr; gap: 9px; }
  .zero-placeholder { min-height: 52px; }
  .match-row { grid-template-columns: 1fr; gap: 8px; padding: 10px; }
  .match-choice { min-height: 44px; font-size: 12px; }
  .construction-board { grid-template-columns: 1fr; gap: 9px; }
  .product-slot { min-height: 61px; }
  .product-slot strong { font-size: 19px; }
  .card-bank { padding: 11px; }
  .card-bank button { min-height: 49px; font-size: 16px; }
  .numeric-entry { grid-template-columns: 1fr; }
  .numeric-entry input { min-height: 51px; }
  .error-layout { grid-template-columns: 128px minmax(0, 1fr); gap: 8px; }
  .error-column { min-height: 283px; padding: 9px; }
  .error-column pre { font-size: 17px; }
  .error-column .g1-char { width: 72px; }
  .error-layout .choice-card { padding: 8px; }
  .error-layout .choice-card > span { display: none; }
  .sensor-scene { grid-template-columns: 1fr; gap: 10px; }
  .sensor-panels-svg { max-height: 142px; }
  .screen-heading.finale-heading { min-height: 0; margin-bottom: 8px; padding: 10px 12px; }
  .finale-heading .title { font-size: 21px; }
  .finale-heading .heading-copy > p:last-child { font-size: 9px; }
  .finale-layout { gap: 8px; }
  .finale-main-grid { grid-template-columns: 1fr; gap: 8px; }
  .finale-payoff-card, .finale-mastery-card { padding: 10px; }
  .summary-layout { grid-template-columns: 1fr; gap: 9px; }
  .summary-rules { grid-template-columns: 1fr 1fr; gap: 5px; }
  .summary-rule {
    min-height: 47px;
    grid-template-columns: 27px 1fr;
    gap: 7px;
    padding: 6px;
  }
  .summary-rule > span { width: 27px; height: 27px; }
  .summary-rule b { font-size: 9px; }
  .summary-demo { padding: 0; }
  .summary-units, .summary-result { font-size: 23px; }
  .summary-reduced-shift { font-size: 23px; }
  .finale-reward { min-height: 108px; padding: 8px 10px; grid-template-columns: 58px 72px minmax(0,1fr); gap: 7px; }
  .finale-medal i { width: 54px; height: 54px; font-size: 23px; }
  .finale-bit { height: 88px; }
  .finale-reward-copy > span { font-size: 7px; }
  .finale-reward-copy > strong { font-size: 14px; }
  .finale-reward-copy > small { font-size: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  .summary-rule,
  .summary-result,
  .finale-reward { opacity: 1 !important; transform: none !important; }
}
`;
