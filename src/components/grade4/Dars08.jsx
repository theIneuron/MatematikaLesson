import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

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

const G4_TITLE_COPY = {
  uz: { revealPrefix: "Unvon", earned: "UNVON OLINDI", firstTry: "birinchi urinishda" },
  ru: { revealPrefix: "Звание", earned: "ЗВАНИЕ ПОЛУЧЕНО", firstTry: "с первой попытки" },
  en: { revealPrefix: "Title", earned: "TITLE EARNED", firstTry: "on the first attempt" },
};

function G4TitleReveal({ active, title, lang }) {
  const [visible, setVisible] = useState(false); const shownRef = useRef(false);
  useEffect(() => { if (!active || shownRef.current || typeof window === "undefined") return undefined; let timer; const frame = window.requestAnimationFrame(() => { shownRef.current = true; setVisible(true); timer = window.setTimeout(() => setVisible(false), 3900); }); return () => { window.cancelAnimationFrame(frame); window.clearTimeout(timer); }; }, [active]);
  if (!visible || typeof document === "undefined") return null;
  const copy = G4_TITLE_COPY[lang] ?? G4_TITLE_COPY.uz;
  return createPortal(<div className="g4-title-reveal-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={`${copy.revealPrefix}: ${title}`}><div className="g4-title-reveal-card"><div className="g4-title-reveal-rays" aria-hidden="true" /><div className="g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--g4-title-i": index, "--g4-title-delay": `${(index % 7) * -0.21}s` }} />)}</div><div className="g4-title-reveal-medal" aria-hidden="true">★</div><h2>{title}</h2></div></div>, document.body);
}

function G4TitleCard({ title, lang, firstTry, totalScored }) {
  const copy = G4_TITLE_COPY[lang] ?? G4_TITLE_COPY.uz;
  return <div className="g4-title-card-stage" role="status" aria-live="polite" aria-atomic="true"><div className="g4-title-card-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div><div className="g4-title-card-bit"><BitSVG state="happy" /></div><div className="g4-title-card-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{copy.earned}</span><h2>{title}</h2><div className="g4-title-card-score"><strong>{firstTry}/{totalScored}</strong><span>{copy.firstTry}</span></div></div>;
}

// 4-sinf · 8-dars · Ko'p xonali sonlarni qo'shish va ayirish
// The lesson follows the approved 15-screen plan. Explanation beats never wait
// for a learner action; audio/currentSegment drives the microanimations.

const b = (uz, ru, en) => ({ uz, ru, en });
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const SPEECH_LOCALES = { uz: "uz-UZ", ru: "ru-RU", en: "en-GB" };
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : "uz");

const CONTENT = {
  0: {
    eyebrow: b("Xona qiymati detektivi", "Детектор разрядов", "Place-value detector"),
    title: b("Bir misol, ikki natija", "Один пример, два результата", "One calculation, two results"),
    lead: b(
      "Bit bir xil misoldan ikki natija oldi. Qaysi yozuvga ishonasiz?",
      "Бит получил два ответа для одного примера. Какой записи ты доверяешь?",
      "Bit got two answers for the same calculation. Which layout do you trust?",
    ),
    audio: {
      uz: [
        "Bit qirq sakkiz ming uch yuz to'qson ikkiga yetti ming olti yuz beshni qo'shdi.",
        "Bir yozuvda birliklar birliklar ostida, ikkinchisida sonlar chapdan tekislangan.",
        "Qaysi yozuv matematik ma'noni saqlaydi?",
      ],
      ru: [
        "Бит складывал сорок восемь тысяч триста девяносто два и семь тысяч шестьсот пять.",
        "В одной записи единицы стоят под единицами, а во второй числа выровнены слева.",
        "Какая запись сохраняет разрядный смысл?",
      ],
      en: [
        "Bit added forty-eight thousand three hundred and ninety-two to seven thousand six hundred and five.",
        "In one layout, the ones are under the ones. In the other, the numbers are aligned on the left.",
        "Which layout preserves the place values?",
      ],
    },
  },
  1: {
    eyebrow: b("Xona ostiga xona", "Разряд под разрядом", "Place under place"),
    title: b("Sonlarni o'ngdan tekislaymiz", "Выравниваем числа справа", "Align the numbers on the right"),
    lead: b("32 415 + 6 203", "32 415 + 6 203", "32 415 + 6 203"),
    instruction: b("Ikkinchi sonni to'g'ri joyga qo'ying.", "Поставь второе число на правильное место.", "Put the second number in the correct place."),
    audio: {
      uz: [
        "Sonlar uzunligi turlicha bo'lsa ham, ularni chap tomondan tekislamaymiz.",
        "Birlar xonasini birlar xonasi ostiga qo'yamiz.",
        "Shunda har bir xona faqat o'ziga teng xona bilan qo'shiladi.",
      ],
      ru: [
        "Даже если числа разной длины, их не выравнивают слева.",
        "Поставим единицы под единицами.",
        "Тогда каждый разряд складывается только с одноимённым разрядом.",
      ],
      en: [
        "Even when numbers have different lengths, we do not align them on the left.",
        "Put the ones under the ones.",
        "Then each place is added only to the matching place.",
      ],
    },
  },
  2: {
    eyebrow: b("Almashtirishsiz qo'shish", "Сложение без обмена", "Addition without regrouping"),
    title: b("Har xona o'z ustunida", "Каждый разряд в своём столбце", "Each place has its own column"),
    lead: b("32 415 + 6 203 = 38 618", "32 415 + 6 203 = 38 618", "32 415 + 6 203 = 38 618"),
    audio: {
      uz: [
        "Birliklardan boshlaymiz.",
        "Besh birlik va uch birlik sakkiz birlik bo'ladi.",
        "Bir o'nlik va nol o'nlik bir o'nlik bo'ladi.",
        "To'rt yuzlik va ikki yuzlik olti yuzlik bo'ladi.",
        "Ikki minglik va olti minglik sakkiz minglik bo'ladi.",
        "Natija o'ttiz sakkiz ming olti yuz o'n sakkiz.",
      ],
      ru: [
        "Начинаем с единиц.",
        "Пять единиц и три единицы дают восемь.",
        "Один десяток и ноль десятков дают один десяток.",
        "Четыре сотни и две сотни дают шесть сотен.",
        "Две тысячи и шесть тысяч дают восемь тысяч.",
        "Получается тридцать восемь тысяч шестьсот восемнадцать.",
      ],
      en: [
        "Start with the ones.",
        "Five ones and three ones make eight ones.",
        "One ten and zero tens make one ten.",
        "Four hundreds and two hundreds make six hundreds.",
        "Two thousands and six thousands make eight thousands.",
        "The result is thirty-eight thousand six hundred and eighteen.",
      ],
    },
  },
  3: {
    eyebrow: b("Yiriklashtirish", "Укрупнение", "Regrouping"),
    title: b("O'n ikkita birlikni almashtiramiz", "Обмениваем двенадцать единиц", "Regroup twelve ones"),
    lead: b("28 467 + 15 785", "28 467 + 15 785", "28 467 + 15 785"),
    instruction: b("12 birlikni qanday yozamiz?", "Как записать 12 единиц?", "How do we write 12 ones?"),
    audio: {
      uz: [
        "Yetti birlik va besh birlik o'n ikki birlik bo'ladi.",
        "O'n ikkita birlikni bitta o'nlik va ikkita birlikka almashtiramiz.",
        "Ikki birlik natijada qoladi, bitta o'nlik keyingi xonaga o'tadi.",
      ],
      ru: [
        "Семь единиц и пять единиц дают двенадцать единиц.",
        "Заменим двенадцать единиц одним десятком и двумя единицами.",
        "Две единицы остаются в ответе, а один десяток переходит в следующий разряд.",
      ],
      en: [
        "Seven ones and five ones make twelve ones.",
        "Regroup twelve ones as one ten and two ones.",
        "Two ones stay in the answer, and one ten moves to the next place.",
      ],
    },
  },
  4: {
    eyebrow: b("Matnli masala modeli", "Модель текстовой задачи", "Word-problem model"),
    title: b("Bor edi, berildi, qoldi", "Было, передали, осталось", "There were, some were sent, some remained"),
    lead: b("15 430 − 3 210 = 12 220", "15 430 − 3 210 = 12 220", "15 430 − 3 210 = 12 220"),
    audio: {
      uz: [
        "Omborda o'n besh ming to'rt yuz o'ttizta kitob bor edi.",
        "Uch ming ikki yuz o'nta kitob filiallarga berildi.",
        "Qolgan miqdorni topish uchun bor miqdordan berilgan miqdorni ayiramiz.",
        "O'n besh ming to'rt yuz o'ttizdan uch ming ikki yuz o'nni ayirsak, o'n ikki ming ikki yuz yigirma qoladi.",
      ],
      ru: [
        "На складе было пятнадцать тысяч четыреста тридцать книг.",
        "Три тысячи двести десять книг передали в филиалы.",
        "Чтобы найти остаток, из количества, которое было, вычитаем переданное количество.",
        "Из пятнадцати тысяч четырёхсот тридцати вычитаем три тысячи двести десять и получаем двенадцать тысяч двести двадцать.",
      ],
      en: [
        "There were fifteen thousand four hundred and thirty books in the warehouse.",
        "Three thousand two hundred and ten books were sent to the branches.",
        "To find how many remain, subtract the number sent from the number there was at first.",
        "Fifteen thousand four hundred and thirty minus three thousand two hundred and ten equals twelve thousand two hundred and twenty.",
      ],
    },
  },
  5: {
    eyebrow: b("Maydalash", "Размен", "Exchanging"),
    title: b("Bitta o'nlik o'nta birlik bo'ladi", "Один десяток становится десятью единицами", "One ten becomes ten ones"),
    lead: b("63 241 − 27 856", "63 241 − 27 856", "63 241 − 27 856"),
    instruction: b(
      "1 birlikdan 6 birlikni ayirish uchun qaysi xonadan foydalanamiz?",
      "Из какого разряда возьмём единицу, чтобы вычесть 6 из 1?",
      "Which place can we use to subtract 6 ones from 1 one?",
    ),
    audio: {
      uz: [
        "Bir birlikdan olti birlikni ayirib bo'lmaydi.",
        "Eng yaqin chapdagi o'nlikdan bitta o'nlikni olamiz.",
        "Bitta o'nlik o'nta birlikka aylanadi.",
        "Endi o'n bir birlikdan oltini ayirib, besh birlik qoladi.",
      ],
      ru: [
        "Из одной единицы нельзя вычесть шесть.",
        "Возьмём один десяток из ближайшего разряда слева.",
        "Один десяток превращается в десять единиц.",
        "Теперь из одиннадцати единиц вычитаем шесть, остаётся пять.",
      ],
      en: [
        "We cannot subtract six ones from one one.",
        "Take one ten from the nearest place on the left.",
        "One ten becomes ten ones.",
        "Now subtract six from eleven ones. Five ones remain.",
      ],
    },
  },
  6: {
    eyebrow: b("Nollar zanjiri", "Цепочка нулей", "Chain of zeros"),
    title: b("Birinchi nol bo'lmagan donor", "Первый ненулевой донор", "First non-zero place to exchange from"),
    lead: b("40 005 − 17 268", "40 005 − 17 268", "40 005 − 17 268"),
    instruction: b(
      "5 birlik yetmaydi. Chapdagi qaysi raqam birinchi donor bo'la oladi?",
      "Пяти единиц не хватает. Какая цифра слева первой может стать донором?",
      "Five ones are not enough. Which digit on the left can be the first one to exchange from?",
    ),
    audio: {
      uz: [
        "Nolning o'zidan xona birligini olib bo'lmaydi.",
        "Chapga qarab birinchi nol bo'lmagan xonani topamiz.",
        "Bitta o'n minglik ketma-ket minglik, yuzlik, o'nlik va birliklarga maydalanadi.",
        "Shundan keyin har ustunda ayirish mumkin bo'ladi.",
      ],
      ru: [
        "Из нуля нельзя взять разрядную единицу.",
        "Найдём первый ненулевой разряд слева.",
        "Один десяток тысяч последовательно разменивается на тысячи, сотни, десятки и единицы.",
        "После этого вычитание возможно в каждом столбце.",
      ],
      en: [
        "We cannot take a place-value unit from zero.",
        "Look to the left for the first non-zero place.",
        "One ten-thousand is exchanged step by step into thousands, hundreds, tens and ones.",
        "After that, subtraction is possible in every column.",
      ],
    },
  },
  7: {
    eyebrow: b("Ikki xil tekshiruv", "Два способа проверки", "Two ways to check"),
    title: b("Taxmin va teskari amal", "Оценка и обратное действие", "Estimate and inverse operation"),
    lead: b(
      "Taxmin kattalikni, teskari amal aniq hisobni tekshiradi.",
      "Оценка проверяет величину, обратное действие — точность.",
      "An estimate checks the size of the answer. An inverse operation checks the exact calculation.",
    ),
    audio: {
      uz: [
        "Taxmin javob qaysi kattalikda bo'lishi kerakligini ko'rsatadi.",
        "Teskari amal esa aniq natijani tekshiradi.",
        "Qo'shish ayirish bilan, ayirish qo'shish bilan tekshiriladi.",
      ],
      ru: [
        "Оценка показывает ожидаемую величину ответа.",
        "Обратное действие проверяет точный результат.",
        "Сложение проверяют вычитанием, а вычитание сложением.",
      ],
      en: [
        "An estimate shows the expected size of the answer.",
        "An inverse operation checks the exact result.",
        "Check addition with subtraction, and check subtraction with addition.",
      ],
    },
  },
  8: {
    eyebrow: b("Tekshiruv", "Проверка", "Check"),
    title: b("To'g'ri tekislangan yozuv", "Верно выровненная запись", "Correctly aligned calculation"),
    lead: b(
      "84 215 − 19 730 misoli qaysi ustunda to'g'ri yozilgan?",
      "В каком столбике верно записан пример 84 215 − 19 730?",
      "Which column shows 84 215 − 19 730 aligned correctly?",
    ),
    audio: {
      uz: ["Sakson to'rt ming ikki yuz o'n beshdan o'n to'qqiz ming yetti yuz o'ttizni ayirish uchun birlar ostiga birlarni, o'nlar ostiga o'nlarni yozing.", "Uch yozuvdan to'g'ri tekislangan ustunni tanlang."],
      ru: ['Чтобы вычесть девятнадцать тысяч семьсот тридцать из восьмидесяти четырёх тысяч двухсот пятнадцати, запиши единицы под единицами, а десятки под десятками.', 'Выбери из трёх вариантов верно выровненный столбик.'],
      en: ['To subtract nineteen thousand seven hundred and thirty from eighty-four thousand two hundred and fifteen, put the ones under the ones and the tens under the tens.', 'Choose the correctly aligned column from the three options.'],
    },
  },
  9: {
    eyebrow: b("Xona kartalari", "Карточки разрядов", "Place-value cards"),
    title: b("Natijani yasang", "Составь результат", "Build the result"),
    lead: b("63 708 + 8 596", "63 708 + 8 596", "63 708 + 8 596"),
    instruction: b(
      "Hisobni birliklardan boshlang va raqamlarni o'z xonasiga joylashtiring.",
      "Начни с единиц и поставь каждую полученную цифру в свой разряд.",
      "Start with the ones and put each resulting digit in its correct place.",
    ),
    audio: {
      uz: ["Oltmish uch ming yetti yuz sakkizga sakkiz ming besh yuz to'qson oltini qo'shing.", "Birliklardan boshlang, ko'chgan raqamni keyingi xonaga qo'shing va natija raqamlarini o'z kataklariga joylashtiring."],
      ru: ['Сложи шестьдесят три тысячи семьсот восемь и восемь тысяч пятьсот девяносто шесть.', 'Начни с единиц, добавляй перенос в следующий разряд и размещай цифры ответа в своих ячейках.'],
      en: ['Add sixty-three thousand seven hundred and eight and eight thousand five hundred and ninety-six.', 'Start with the ones, add each carried digit to the next place, and put the digits of the answer in their boxes.'],
    },
  },
  10: {
    eyebrow: b("Maydalash qadami", "Шаг размена", "Exchange step"),
    title: b("Birinchi to'g'ri qadamni tanlang", "Выбери первый верный шаг", "Choose the first correct step"),
    lead: b("63 241 − 27 856", "63 241 − 27 856", "63 241 − 27 856"),
    instruction: b(
      "1 birlikdan 6 birlikni qanday ayiramiz?",
      "Как вычесть 6 единиц из 1 единицы?",
      "How can we subtract 6 ones from 1 one?",
    ),
    audio: {
      uz: [
        "Oltmish uch ming ikki yuz qirq birdan yigirma yetti ming sakkiz yuz ellik oltini ayiramiz.",
        "Bir birlikdan olti birlikni ayirib bo'lmaydi.",
        "Eng yaqin o'nlikdan bitta o'nlikni maydalab, o'n bir birlik hosil qilamiz.",
        "Birinchi to'g'ri qadamni tanlang.",
      ],
      ru: [
        'Вычитаем двадцать семь тысяч восемьсот пятьдесят шесть из шестидесяти трёх тысяч двухсот сорока одного.',
        'Из одной единицы нельзя вычесть шесть единиц.',
        'Размениваем один ближайший десяток и получаем одиннадцать единиц.',
        'Выбери первый верный шаг.',
      ],
      en: [
        "Subtract twenty-seven thousand eight hundred and fifty-six from sixty-three thousand two hundred and forty-one.",
        "We cannot subtract six ones from one one.",
        "Exchange one ten from the nearest tens place to make eleven ones.",
        "Choose the first correct step.",
      ],
    },
  },
  11: {
    eyebrow: b("Holatni tiklash", "Восстановление состояния", "Restore the place values"),
    title: b("Nollar zanjirini tuzing", "Составь цепочку размена", "Build the chain of exchanges"),
    lead: b("60 002 − 24 785", "60 002 − 24 785", "60 002 − 24 785"),
    instruction: b(
      "2 dan 5 ni ayirishdan oldingi holatni tuzing.",
      "Составь состояние перед вычитанием 5 из 2.",
      "Build the place-value state before subtracting 5 from 2.",
    ),
    audio: {
      uz: [
        "Chapdagi birinchi nol bo'lmagan xonada olti o'n minglik bor. Undan bitta o'n minglikni olamiz.",
        "U nollar zanjiri orqali birliklargacha maydalanadi.",
      ],
      ru: [
        "В первом ненулевом разряде слева есть шесть десятков тысяч. Возьмём один десяток тысяч.",
        "Она последовательно разменивается через нулевые разряды до единиц.",
      ],
      en: [
        "The first non-zero place on the left contains six ten-thousands. Take one ten-thousand from it.",
        "It is exchanged step by step through the zero places until it reaches the ones.",
      ],
    },
  },
  12: {
    eyebrow: b("Teskari amal", "Обратное действие", "Inverse operation"),
    title: b("Hisob va tekshiruvni juftlang", "Соедини вычисление и проверку", "Match each calculation to its check"),
    lead: b(
      "Har hisobni mos teskari amal bilan juftlang.",
      "Соедини каждое вычисление с подходящей проверкой.",
      "Match each calculation to the correct inverse-operation check.",
    ),
    audio: {
      uz: [
        "Natijadan bir qo'shiluvchini ayirsak, ikkinchi qo'shiluvchi chiqadi.",
        "Ayirma va ayriluvchini qo'shsak, kamayuvchi qaytadi.",
        "Uchta hisobning har birini aynan shu sonlardan tuzilgan teskari tekshiruv bilan juftlang.",
      ],
      ru: [
        "Если из суммы вычесть одно слагаемое, получится другое.",
        "Если сложить разность и вычитаемое, получится уменьшаемое.",
        "Соедини каждое из трёх вычислений с обратной проверкой из тех же чисел.",
      ],
      en: [
        "If you subtract one addend from the sum, you get the other addend.",
        "If you add the difference and the subtrahend, you get the minuend.",
        "Match each of the three calculations to an inverse check made from the same numbers.",
      ],
    },
  },
  13: {
    eyebrow: b("Shahar kutubxonasi", "Городская библиотека", "City library"),
    title: b("Nechta kitob qoldi?", "Сколько книг осталось?", "How many books are left?"),
    lead: b(
      "Kutubxonada 72 384 ta kitob bor edi. 11 252 tasi filiallarga berildi. Nechta kitob qoldi?",
      "В библиотеке было 72 384 книги. В филиалы передали 11 252. Сколько книг осталось?",
      "The library had 72 384 books. It sent 11 252 books to its branches. How many books are left?",
    ),
    audio: {
      uz: [
        "Kutubxonada yetmish ikki ming uch yuz sakson to'rtta kitob bor edi. O'n bir ming ikki yuz ellik ikkitasi filiallarga berildi.",
        "Qolgan miqdorni topish uchun yetmish ikki ming uch yuz sakson to'rtdan o'n bir ming ikki yuz ellik ikkini ayiramiz.",
        "Har bir ustunda yuqoridagi raqam yetarli, shuning uchun maydalash kerak emas.",
        "Javob oltmish bir ming atrofida bo'lishini taxmin bilan tekshiring.",
      ],
      ru: [
        'В библиотеке было семьдесят две тысячи триста восемьдесят четыре книги. Одиннадцать тысяч двести пятьдесят две из них передали в филиалы.',
        'Чтобы найти остаток, вычти одиннадцать тысяч двести пятьдесят два из семидесяти двух тысяч трёхсот восьмидесяти четырёх.',
        'В каждом столбце верхней цифры достаточно, поэтому размен не нужен.',
        'Проверь оценкой, что ответ должен быть около шестидесяти одной тысячи.',
      ],
      en: [
        "The library had seventy-two thousand three hundred and eighty-four books. Eleven thousand two hundred and fifty-two of them were sent to its branches.",
        "To find how many remain, subtract eleven thousand two hundred and fifty-two from seventy-two thousand three hundred and eighty-four.",
        "The top digit is large enough in every column, so no exchange is needed.",
        "Use an estimate to check that the answer should be about sixty-one thousand.",
      ],
    },
  },
  14: {
    eyebrow: b("Yakuniy missiya", "Финальная миссия", "Final mission"),
    title: b("To'rt tayanch qoida", "Четыре опорных правила", "Four key rules"),
    lead: b(
      "Yozma qo'shish va ayirishning ma'nosini bir sahnada qaytaramiz.",
      "Соберём смысл письменного сложения и вычитания в одной сцене.",
      "Bring the meaning of written addition and subtraction together in one scene.",
    ),
    audio: {
      uz: [
        "Qo'shish va ayirishda sonlarni birlar xonasi bo'yicha tekislang.",
        "Qo'shishda o'nta kichik xona birligini bitta katta xona birligiga almashtiring.",
        "Ayirishda kerak bo'lsa, chapdagi birinchi nol bo'lmagan xonadan boshlab maydalang.",
        "Javobni taxmin va teskari amal bilan tekshiring.",
      ],
      ru: [
        "При сложении и вычитании выравнивай числа по единицам.",
        "При сложении заменяй десять меньших разрядных единиц одной большей.",
        "При вычитании при необходимости начинай размен с первого ненулевого разряда слева.",
        "Проверяй ответ оценкой и обратным действием.",
      ],
      en: [
        "When adding or subtracting, align the numbers by their ones places.",
        "When adding, regroup ten smaller place-value units as one unit of the next place.",
        "When subtracting, exchange from the first non-zero place on the left when needed.",
        "Check the answer with an estimate and an inverse operation.",
      ],
    },
  },
};

const SOURCE_ORDER = [0, 1, 8, 3, 9, 5, 10, 6, 11, 7, 12, 4, 13, 2, 14];
const SCREEN_META = [
  { id: "s0", sourceId: 0, type: "hook", scope: "hook", scored: false },
  { id: "s1", sourceId: 1, type: "exploration", scope: null, scored: false },
  { id: "s2", sourceId: 8, type: "test", scope: "module-mikro", scored: true },
  { id: "s3", sourceId: 3, type: "model", scope: null, scored: false },
  { id: "s4", sourceId: 9, type: "construction", scope: "module-mikro", scored: true },
  { id: "s5", sourceId: 5, type: "discovery", scope: null, scored: false },
  { id: "s6", sourceId: 10, type: "error", scope: "module-mikro", scored: true },
  { id: "s7", sourceId: 6, type: "exploration", scope: null, scored: false },
  { id: "s8", sourceId: 11, type: "construction", scope: "module-mikro", scored: true },
  { id: "s9", sourceId: 7, type: "strategy", scope: null, scored: false },
  { id: "s10", sourceId: 12, type: "matching", scope: "module-mikro", scored: true },
  { id: "s11", sourceId: 4, type: "exploration", scope: null, scored: false },
  { id: "s12", sourceId: 13, type: "case", scope: "final", scored: true },
  { id: "s13", sourceId: 2, type: "consolidation", scope: null, scored: false },
  { id: "s14", sourceId: 14, type: "summary", scope: null, scored: false },
];

const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: "num-4-08-v1",
  lessonTitle: b(
    "8-dars. Ko'p xonali sonlarni qo'shish va ayirish",
    "Урок 8. Сложение и вычитание многозначных чисел",
    "Lesson 8. Adding and subtracting multi-digit numbers",
  ),
};

let runtimeConfig = {
  ttsApiBase: "",
  voiceGender: "f",
  correctSoundUrl: "",
  wrongSoundUrl: "",
  previewMode: false,
};

const LangContext = createContext("uz");
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback(
    (value) => {
      if (value == null) return "";
      if (typeof value === "string" || typeof value === "number") return String(value);
      return value[lang] ?? "";
    },
    [lang],
  );
};

function useIsMobile() {
  const [mobile, setMobile] = useState(() => (
    typeof window !== "undefined" ? window.innerWidth <= 639 : false
  ));
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  return mobile;
}

const buildTtsUrl = (base, text, gender) => (
  base + "/api/tts?text=" + encodeURIComponent(String(text).slice(0, 1000))
  + "&g=" + (gender === "m" ? "m" : "f")
);

class AudioEngine {
  constructor() {
    this.audio = null;
    this.previewUtterance = null;
    this.queue = [];
    this.index = 0;
    this.lang = "uz";
    this.muted = false;
    this.playing = false;
    this.listener = null;
    this.timer = null;
  }

  emit(extra = {}) {
    this.listener?.({ isPlaying: this.playing, muted: this.muted, ...extra });
  }

  stop() {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) {
      this.audio.pause();
      this.audio.onended = null;
      this.audio.onerror = null;
    }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
    }
    if (runtimeConfig.previewMode && typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Browser speech is optional in local preview.
      }
    }
    this.previewUtterance = null;
    this.playing = false;
  }

  load(queue) {
    this.stop();
    this.queue = queue;
    this.index = 0;
  }

  setLang(lang) {
    this.lang = lang;
  }

  start() {
    if (!this.queue.length) {
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    if (this.muted) {
      this.emit({ completed: true, currentSegment: this.queue[this.queue.length - 1].id });
      return;
    }
    this.emit({ completed: false });
    this.playNext();
  }

  simulate(item) {
    this.playing = true;
    this.emit({ completed: false, currentSegment: item.id });
    this.timer = window.setTimeout(() => {
      this.index += 1;
      this.playNext();
    }, 1450);
  }

  playPreviewSpeech(item) {
    const speech = typeof window !== "undefined" ? window.speechSynthesis : null;
    const Utterance = typeof window !== "undefined"
      ? (window.SpeechSynthesisUtterance || globalThis.SpeechSynthesisUtterance)
      : null;
    if (!speech || !Utterance) {
      this.simulate(item);
      return;
    }

    try {
      speech.cancel();
      const utterance = new Utterance(String(item.text));
      utterance.lang = SPEECH_LOCALES[this.lang] ?? SPEECH_LOCALES.uz;
      utterance.rate = 0.94;
      utterance.onstart = () => {
        this.playing = true;
        this.emit({ completed: false, currentSegment: item.id });
      };
      utterance.onend = () => {
        this.playing = false;
        this.index += 1;
        this.playNext();
      };
      utterance.onerror = () => {
        this.playing = false;
        this.simulate(item);
      };
      this.previewUtterance = utterance;
      this.timer = window.setTimeout(() => {
        this.timer = null;
        try {
          speech.speak(utterance);
        } catch {
          this.simulate(item);
        }
      }, 50);
    } catch {
      this.simulate(item);
    }
  }

  playNext() {
    const item = this.queue[this.index];
    if (!item) {
      this.playing = false;
      this.emit({
        completed: true,
        currentSegment: this.queue[this.queue.length - 1]?.id || null,
      });
      return;
    }

    if (!runtimeConfig.ttsApiBase) {
      if (runtimeConfig.previewMode) {
        this.playPreviewSpeech(item);
      } else {
        this.simulate(item);
      }
      return;
    }

    if (typeof Audio === "undefined") {
      this.simulate(item);
      return;
    }

    if (!this.audio) this.audio = new Audio();
    this.audio.onended = () => {
      this.index += 1;
      this.playNext();
    };
    this.audio.onerror = () => {
      this.index += 1;
      this.playNext();
    };
    this.audio.src = buildTtsUrl(
      runtimeConfig.ttsApiBase,
      item.text,
      runtimeConfig.voiceGender,
    );
    this.emit({ completed: false, currentSegment: item.id });
    this.audio.play().then(() => {
      this.playing = true;
      this.emit({ completed: false, currentSegment: item.id });
    }).catch(() => this.simulate(item));
  }

  replay() {
    this.index = 0;
    this.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    this.stop();
    this.emit({
      muted: this.muted,
      completed: this.muted,
      currentSegment: this.muted ? this.queue[this.queue.length - 1]?.id || null : null,
    });
  }

  one(text) {
    this.load([{ id: "feedback-0", text }]);
    this.start();
  }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === "undefined") return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(audio, screen) {
  const lang = useLang();
  const stableSegments = useMemo(
    () => {
      const localized = audio?.[lang] ?? [];
      return (Array.isArray(localized) ? localized : [localized])
        .filter(Boolean)
        .map((text, index) => ({ id: "s" + screen + "-b" + index, text }));
    },
    [audio, lang, screen],
  );
  const segmentKey = JSON.stringify(stableSegments);
  const queueKey = "d8-s" + screen + "-" + lang + "-" + segmentKey;
  const [state, setState] = useState({
    isPlaying: false,
    muted: false,
    completed: false,
    currentSegment: null,
    queueKey: null,
  });

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.listener = (next) => {
      setState((old) => ({ ...old, ...next, queueKey }));
    };
    engine.load(stableSegments);
    const timer = window.setTimeout(() => engine.start(), 260);
    return () => {
      window.clearTimeout(timer);
      engine.stop();
      if (engine.listener) engine.listener = null;
    };
  }, [queueKey, stableSegments, lang]);

  const replay = useCallback(() => {
    const engine = getAudioEngine();
    if (!engine) return;
    engine.load(stableSegments);
    engine.start();
  }, [stableSegments]);

  const toggleMute = useCallback(() => {
    const engine = getAudioEngine();
    if (!engine) return;
    const turningOn = engine.muted;
    engine.toggleMute();
    if (turningOn) {
      engine.load(stableSegments);
      engine.start();
    }
  }, [stableSegments]);

  const pushOneOff = useCallback((text) => {
    if (text) getAudioEngine()?.one(text);
  }, []);

  return {
    ...state,
    completed: state.queueKey === queueKey && state.completed,
    replay,
    toggleMute,
    pushOneOff,
  };
}

function useAutoPhase(audio, count, screen) {
  const [fallbackPhase, setFallbackPhase] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      const reducedTimer = window.setTimeout(
        () => setFallbackPhase(Math.max(0, count - 1)),
        0,
      );
      return () => window.clearTimeout(reducedTimer);
    }
    const timer = window.setInterval(() => {
      setFallbackPhase((current) => Math.min(count - 1, current + 1));
    }, 1550);
    return () => window.clearInterval(timer);
  }, [count, screen]);

  const marker = "-b";
  const audioPhase = audio.currentSegment?.startsWith("s" + screen + marker)
    ? Number(audio.currentSegment.split(marker)[1])
    : 0;
  return Math.max(
    fallbackPhase,
    Number.isFinite(audioPhase) ? Math.min(count - 1, audioPhase) : 0,
  );
}

const playSfx = (kind) => {
  const url = kind === "correct"
    ? runtimeConfig.correctSoundUrl
    : runtimeConfig.wrongSoundUrl;
  if (!url || typeof Audio === "undefined") return;
  try {
    const sound = new Audio(url);
    sound.play().catch(() => {});
  } catch {
    // Sound effects are optional.
  }
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
    ? t(b("Ovozni yoqish", "Включить звук", "Turn sound on"))
    : t(b("Ovozni o'chirish", "Выключить звук", "Turn sound off"));
  const replayLabel = t(b("Qayta eshitish", "Повторить", "Replay"));
  return (
    <div className="audio-controls">
      <button
        type="button"
        className="icon-btn"
        onClick={audio.toggleMute}
        aria-label={muteLabel}
        title={muteLabel}
      >
        {audio.muted ? "🔇" : (audio.isPlaying ? "🔊" : "🔉")}
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
  const t = useT();
  const aliases = {
    model: "exploration",
    discovery: "exploration",
    comparison: "exploration",
    strategy: "exploration",
    construction: "practice",
    error: "practice",
    matching: "practice",
  };
  const labels = {
    hook: b("Missiya", "Миссия", "Mission"),
    diagnostic: b("Diagnostika", "Диагностика", "Diagnostic"),
    exploration: b("Kashfiyot", "Исследование", "Explore"),
    rule: b("Qoida", "Правило", "Rule"),
    practice: b("Mashq", "Практика", "Practice"),
    test: b("Tekshiruv", "Проверка", "Check"),
    case: b("Vazifa", "Задача", "Problem"),
    summary: b("Yakun", "Итог", "Summary"),
  };
  const semanticType = aliases[type] ?? type;
  return <span className="screen-type">{labels[semanticType] ? t(labels[semanticType]) : type}</span>;
};

function Stage({ screen, audio, onBack, onNext, onFinish, children }) {
  const t = useT();
  const isMobile = useIsMobile();
  const final = screen === TOTAL_SCREENS - 1;

  return (
    <main className={"stage stage-" + SCREEN_META[screen].type + (isMobile ? " stage-mobile" : "")}>
      <header className="stage-header">
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin="1"
          aria-valuemax={TOTAL_SCREENS}
          aria-valuenow={screen + 1}
        >
          <div
            className="progress-fill"
            style={{ width: ((screen + 1) / TOTAL_SCREENS * 100) + "%" }}
          />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title">
            <span className="status-dot" />
            <span>{t(LESSON_META.lessonTitle)}</span>
          </div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={SCREEN_META[screen].type} />
            <AudioIndicator audio={audio} />
            <span className="screen-count">{String(screen + 1).padStart(2, "0")} / {TOTAL_SCREENS}</span>
          </div>
        </div>
      </header>
      <section className="stage-content"><div className="stage-happy-bit" aria-label={t(b("Bit xursand", "Бит улыбается", "Bit is smiling"))}><BitSVG state="happy" /></div>{children}</section>
      <footer className="stage-nav">
        {screen > 0
          ? (
            <button type="button" className="button button-ghost" onClick={onBack}>
              ← {t(b("Orqaga", "Назад", "Back"))}
            </button>
          )
          : <span />}
        <button
          type="button"
          className="button button-primary"
          onClick={final ? onFinish : onNext}
        >
          {final ? t(b("Darsni yakunlash", "Завершить урок", "Finish lesson")) : t(b("Davom etish", "Продолжить", "Continue"))} →
        </button>
      </footer>
    </main>
  );
}

function Heading({ screen, contentScreen = screen, bitState = null }) {
  const t = useT();
  const c = CONTENT[contentScreen];
  return (
    <div className={
      "heading "
      + (bitState ? "heading-with-bit " : "")
      + (bitState && screen !== 0 ? "heading-with-small-bit" : "")
    }>
      <div>
        <span className="eyebrow">{t(c.eyebrow)}</span>
        <h1>{t(c.title)}</h1>
        <p>{t(c.lead)}</p>
      </div>
      {bitState && (
        <div className={"bit-shell " + (screen !== 0 ? "bit-shell-small" : "")}>
          <BitSVG state={bitState} />
        </div>
      )}
    </div>
  );
}

function MiniCoach({ state, cue }) {
  return (
    <div className="mini-coach" aria-hidden="true">
      <BitSVG state={state} />
      <span>{cue}</span>
    </div>
  );
}

function Feedback({ show, correct, children }) {
  if (!show) return null;
  return (
    <div
      className={"feedback feedback-visible " + (correct ? "feedback-correct" : "feedback-wrong")}
      aria-live="polite"
    >
      <span aria-hidden="true">{correct ? "✓" : "↻"}</span>
      <p>{children}</p>
    </div>
  );
}

const PLACE_LABELS = {
  uz: ["O'N MING", "MING", "YUZ", "O'N", "BIR"],
  ru: ["ДЕС. ТЫС.", "ТЫС.", "СОТ.", "ДЕС.", "ЕД."],
  en: ["TEN THOUSANDS", "THOUSANDS", "HUNDREDS", "TENS", "ONES"],
};
const PLACE_LABELS_LOWER = {
  uz: ["o'n ming", "ming", "yuz", "o'n", "bir"],
  ru: ["дес. тысяч", "тысяч", "сотен", "десятков", "единиц"],
  en: ["ten thousands", "thousands", "hundreds", "tens", "ones"],
};

function PlaceHeader() {
  const lang = useLang();
  return (
    <div className="place-row place-labels" aria-hidden="true">
      {(PLACE_LABELS[lang] ?? PLACE_LABELS.uz).map((label) => <span key={label}>{label}</span>)}
    </div>
  );
}

function PlaceWarehouseSVG({ phase }) {
  const places = ["10⁴", "10³", "10²", "10¹", "10⁰"];
  const topDigits = ["3", "2", "4", "1", "5"];
  const lowerDigits = ["6", "2", "0", "3"];
  const step = Math.max(0, Math.min(2, phase));
  return (
    <svg
      className={`place-warehouse-svg phase-${step}`}
      viewBox="0 0 600 118"
      aria-hidden="true"
      focusable="false"
    >
      <path className="warehouse-belt" d="M38 103 H562" />
      {places.map((place, index) => {
        const x = 42 + index * 104;
        return (
          <g className="warehouse-bay" key={place}>
            <rect x={x} y="12" width="84" height="88" rx="12" />
            <text x={x + 42} y="29">{place}</text>
            <rect className="warehouse-crate top-crate" x={x + 23} y="36" width="38" height="25" rx="7" />
            <text className="warehouse-digit" x={x + 42} y="54">{topDigits[index]}</text>
          </g>
        );
      })}
      <g className="warehouse-moving">
        {lowerDigits.map((digit, index) => {
          const x = 146 + index * 104;
          return (
            <g key={`${digit}-${index}`}>
              <rect className="warehouse-crate lower-crate" x={x + 23} y="68" width="38" height="25" rx="7" />
              <text className="warehouse-digit lower-digit" x={x + 42} y="86">{digit}</text>
            </g>
          );
        })}
      </g>
      <path className="warehouse-unit-guide" d="M498 96 V108 M490 101 L498 109 L506 101" />
    </svg>
  );
}

function ExchangeBundleSVG({ phase }) {
  const bundled = phase >= 1;
  return (
    <svg
      className={`exchange-bundle-svg ${bundled ? "is-bundled" : ""}`}
      viewBox="0 0 600 116"
      aria-hidden="true"
      focusable="false"
    >
      <g className="loose-ten">
        {Array.from({ length: 10 }, (_, index) => (
          <circle cx={72 + (index % 5) * 23} cy={43 + Math.floor(index / 5) * 24} r="8" key={index} />
        ))}
      </g>
      <path className="exchange-flow" d="M202 56 H252" />
      <path className="exchange-flow-tip" d="M242 47 L253 56 L242 65" />
      <g className="bundled-ten">
        <rect x="269" y="21" width="92" height="70" rx="15" />
        {Array.from({ length: 10 }, (_, index) => (
          <circle cx={289 + (index % 5) * 13} cy={42 + Math.floor(index / 5) * 18} r="4.5" key={index} />
        ))}
        <text x="315" y="82">10</text>
      </g>
      <path className="exchange-plus" d="M389 48 V66 M380 57 H398" />
      <g className="remainder-two">
        <circle cx="442" cy="56" r="11" />
        <circle cx="474" cy="56" r="11" />
        <text x="458" y="92">2</text>
      </g>
    </svg>
  );
}

function DonorPathSVG({ phase }) {
  const active = phase >= 2;
  const digits = ["4", "0", "0", "0", "5"];
  return (
    <svg
      className={`donor-path-svg ${active ? "path-active" : ""}`}
      viewBox="0 0 600 108"
      aria-hidden="true"
      focusable="false"
    >
      <path className="donor-route" d="M58 50 C150 4 450 4 542 50" />
      <path className="donor-route-tip" d="M531 40 L544 50 L530 58" />
      {digits.map((digit, index) => {
        const x = 58 + index * 121;
        return (
          <g className={digit === "0" ? "donor-checkpoint zero-checkpoint" : "donor-checkpoint"} key={`${digit}-${index}`}>
            <circle cx={x} cy="64" r="21" />
            <text x={x} y="71">{digit}</text>
          </g>
        );
      })}
      <g className="donor-token">
        <rect x="39" y="12" width="38" height="24" rx="12" />
        <text x="58" y="29">1</text>
      </g>
      <text className="donor-change donor-change-start" x="58" y="103">4→3</text>
      <text className="donor-change donor-change-zero" x="300" y="103">0→9</text>
    </svg>
  );
}

function DigitCells({
  digits,
  active = -1,
  tone = "",
  reveal = null,
  className = "",
}) {
  const t = useT();
  return (
    <div className={"place-row digit-row " + tone + " " + className}>
      {digits.map((digit, index) => {
        const shown = !reveal || reveal(index);
        return (
          <span
            className={(index === active ? "active-place " : "") + (!shown ? "digit-hidden" : "")}
            key={index}
          >
            {digit === "" ? <i aria-label={t(b("bo'sh", "пусто", "empty"))} /> : digit}
          </span>
        );
      })}
    </div>
  );
}

function ColumnMath({ top, bottom, result, operator, phase, beatCount, borrowed = null }) {
  const active = Math.max(0, 5 - Math.min(5, phase + 1));
  const reveal = (index) => {
    if (beatCount <= 4) return phase >= beatCount - 1;
    return phase >= 5 - index;
  };
  return (
    <div className="column-board" aria-label={top.join("") + " " + operator + " " + bottom.join("")}>
      <PlaceHeader />
      {borrowed && (
        <DigitCells
          digits={borrowed}
          active={active}
          tone="borrow-row"
        />
      )}
      <DigitCells digits={top} active={active} />
      <div className="operator-row">
        <b>{operator}</b>
        <DigitCells digits={bottom} active={active} tone="second-row" />
      </div>
      <div className="column-rule" />
      <DigitCells digits={result} active={active} tone="result-row" reveal={reveal} />
    </div>
  );
}

function Captions({ lines, phase }) {
  return (
    <div className="captions" aria-live="polite">
      {lines.map((line, index) => (
        <p
          className={index === phase ? "caption-active" : index < phase ? "caption-done" : ""}
          key={line}
        >
          <span aria-hidden="true">{index < phase ? "✓" : "•"}</span>
          {line}
        </p>
      ))}
    </div>
  );
}

function OptionalGuess({ options, correctIndex, feedback, onPick }) {
  const t = useT();
  const [picked, setPicked] = useState(null);
  return (
    <div className="optional-guess">
      <span>{t(b("Ixtiyoriy taxmin", "Необязательный прогноз", "Optional prediction"))}</span>
      <div className="guess-options">
        {options.map((option, index) => (
          <button
            type="button"
            className={
              "guess-chip "
              + (picked === index ? (index === correctIndex ? "is-correct" : "is-wrong") : "")
            }
            onClick={() => {
              setPicked(index);
              onPick?.(index);
            }}
            key={t(option)}
          >
            {t(option)}
          </button>
        ))}
      </div>
      {picked != null && (
        <small className={picked === correctIndex ? "guess-good" : "guess-hint"}>
          {picked === correctIndex
            ? t(b("Taxmin mos keldi.", "Прогноз совпал.", "The prediction matches."))
            : t(feedback)}
        </small>
      )}
    </div>
  );
}

function AlignmentScene({ phase }) {
  return (
    <div className="alignment-board">
      <PlaceWarehouseSVG phase={phase} />
      <PlaceHeader />
      <DigitCells digits={["3", "2", "4", "1", "5"]} />
      <div className={"sliding-row slide-position-" + Math.min(2, phase)}>
        <b>+</b>
        <DigitCells digits={["", "6", "2", "0", "3"]} tone="second-row" />
      </div>
      <div className={"alignment-guide " + (phase >= 1 ? "guide-visible" : "")}>
        <span />
        <span />
        <span />
        <span />
        <span className="units-guide">↕</span>
      </div>
      <strong className={phase >= 2 ? "answer-visible" : ""}>38 618</strong>
    </div>
  );
}

function ExchangeScene({ phase }) {
  const lang = useLang();
  const copyByLang = {
    uz: { onesTen: "birlik", oneTen: "o'nlik", onesTwo: "birlik" },
    ru: { onesTen: "единиц", oneTen: "десяток", onesTwo: "единицы" },
    en: { onesTen: "ones", oneTen: "ten", onesTwo: "ones" },
  };
  const copy = copyByLang[lang] ?? copyByLang.uz;
  return (
    <div className="exchange-scene">
      <div className="equation-focus">
        <span>7 {phase >= 0 ? "+" : ""} 5</span>
        <b className={phase >= 0 ? "pop-in" : ""}>= 12</b>
      </div>
      <ExchangeBundleSVG phase={phase} />
      <MiniCoach state="point" cue="10 → 1" />
      <div className={"exchange-result " + (phase >= 1 ? "answer-visible" : "")}>
        <span className="ten-bundle">10 {copy.onesTen}</span>
        <b>→</b>
        <span>1 {copy.oneTen}</span>
        <span>+</span>
        <span>2 {copy.onesTwo}</span>
      </div>
      <div className={"final-equation " + (phase >= 2 ? "answer-visible" : "")}>
        28 467 + 15 785 = <b>44 252</b>
      </div>
    </div>
  );
}

function BorrowScene({ phase, picked, onPick }) {
  const lang = useLang();
  const labels = PLACE_LABELS_LOWER[lang] ?? PLACE_LABELS_LOWER.uz;
  return (
    <div className="borrow-scene">
      <div className="donor-strip">
        {["6", "3", "2", "4", "1"].map((digit, index) => (
          <button
            type="button"
            className={
              (picked === index ? "guessed " : "")
              + (phase >= 1 && index === 3 ? "auto-donor" : "")
            }
            onClick={() => onPick(index)}
            aria-label={digit + " " + labels[index]}
            key={index}
          >
            <small>{labels[index]}</small>
            <b>{digit}</b>
          </button>
        ))}
      </div>
      <div className={"borrow-arrow " + (phase >= 1 ? "answer-visible" : "")}>
        <span>4 → 3</span>
        <i>↘</i>
        <span>1 → 11</span>
      </div>
      <div className={"borrow-units " + (phase >= 2 ? "answer-visible" : "")}>
        <b>11 − 6 = 5</b>
        <div>{Array.from({ length: 11 }, (_, index) => <i className={index >= 5 ? "taken" : ""} key={index} />)}</div>
      </div>
      <div className={"final-equation " + (phase >= 3 ? "answer-visible" : "")}>
        63 241 − 27 856 = <b>35 385</b>
      </div>
    </div>
  );
}

function ZeroChainScene({ phase, picked, onPick }) {
  const lang = useLang();
  const labels = PLACE_LABELS_LOWER[lang] ?? PLACE_LABELS_LOWER.uz;
  const after = ["3", "9", "9", "9", "15"];
  return (
    <div className="zero-chain-scene">
      <div className="donor-strip">
        {["4", "0", "0", "0", "5"].map((digit, index) => (
          <button
            type="button"
            className={
              (picked === index ? "guessed " : "")
              + (phase >= 1 && index === 0 ? "auto-donor" : "")
              + (digit === "0" ? "zero-donor" : "")
            }
            onClick={() => onPick(index)}
            aria-label={digit + " " + labels[index]}
            key={index}
          >
            <small>{labels[index]}</small>
            <b>{digit}</b>
          </button>
        ))}
      </div>
      <DonorPathSVG phase={phase} />
      <MiniCoach state="focus" cue="4 → 3" />
      <div className={"state-row " + (phase >= 2 ? "answer-visible" : "")}>
        {after.map((value, index) => (
          <span key={index}><small>{labels[index]}</small><b>{value}</b></span>
        ))}
      </div>
      <div className={"final-equation " + (phase >= 3 ? "answer-visible" : "")}>
        40 005 − 17 268 = <b>22 737</b>
      </div>
    </div>
  );
}

function StrategyScene({ phase }) {
  const t = useT();
  return (
    <div className="strategy-scene">
      <div className={"strategy-card " + (phase >= 0 ? "strategy-live" : "")}>
        <span>≈</span>
        <h3>{t(b("Taxmin", "Оценка", "Estimate"))}</h3>
        <p>{t(b("Javobning kattaligini tekshiradi", "Проверяет величину ответа", "Checks the size of the answer"))}</p>
        <strong className={phase >= 1 ? "answer-visible" : ""}>28 467 + 15 785 ≈ 44 000</strong>
      </div>
      <div className={"strategy-card strategy-inverse " + (phase >= 1 ? "strategy-live" : "")}>
        <span>↔</span>
        <h3>{t(b("Teskari amal", "Обратное действие", "Inverse operation"))}</h3>
        <p>{t(b("Aniq hisobni tekshiradi", "Проверяет точность вычисления", "Checks the exact calculation"))}</p>
        <strong className={phase >= 2 ? "answer-visible" : ""}>44 252 − 15 785 = 28 467</strong>
      </div>
    </div>
  );
}

function ExplanationScreen({ screen, contentScreen = screen, audio }) {
  const t = useT();
  const lang = useLang();
  const c = CONTENT[contentScreen];
  const phase = useAutoPhase(audio, c.audio[lang].length, screen);
  const [donor, setDonor] = useState(null);
  const [donorFeedback, setDonorFeedback] = useState(null);

  const pickBorrowDonor = (index) => {
    setDonor(index);
    setDonorFeedback(
      index === 3
        ? b("Eng yaqin o'nlik tanlandi.", "Выбран ближайший десяток.", "The nearest tens place is selected.")
        : b("Avval eng yaqin chapdagi xonani tekshiring.", "Сначала проверь ближайший разряд слева.", "Check the nearest place on the left first."),
    );
  };
  const pickZeroDonor = (index) => {
    setDonor(index);
    setDonorFeedback(
      index === 0
        ? b("Birinchi nol bo'lmagan donor topildi.", "Первый ненулевой донор найден.", "The first non-zero place to exchange from has been found.")
        : b(
          "Nol donor bo'la olmaydi; chapdagi birinchi nol bo'lmagan raqamni toping.",
          "Ноль не может быть донором; найди первую ненулевую цифру слева.",
          "You cannot exchange from zero. Find the first non-zero digit on the left.",
        ),
    );
  };

  return (
    <>
      <Heading screen={screen} contentScreen={contentScreen} />
      {c.instruction && <h2 className="scene-question">{t(c.instruction)}</h2>}
      <section className="semantic-scene">
        {contentScreen === 1 && (
          <>
            <AlignmentScene phase={phase} />
            <OptionalGuess
              options={[
                b("O'ngdan", "Справа", "On the right"),
                b("O'rtadan", "По центру", "In the centre"),
                b("Chapdan", "Слева", "On the left"),
              ]}
              correctIndex={0}
              feedback={b(
                "Birlar xonasini birlar xonasi ostiga qo'ying.",
                "Поставь единицы под единицами.",
                "Put the ones under the ones.",
              )}
            />
          </>
        )}
        {contentScreen === 2 && (
          <ColumnMath
            top={["3", "2", "4", "1", "5"]}
            bottom={["", "6", "2", "0", "3"]}
            result={["3", "8", "6", "1", "8"]}
            operator="+"
            phase={phase}
            beatCount={6}
          />
        )}
        {contentScreen === 3 && (
          <>
            <ExchangeScene phase={phase} />
            <OptionalGuess
              options={[
                b("1 o'nlik va 2 birlik", "1 десяток и 2 единицы", "1 ten and 2 ones"),
                b("12 ni birlar katagiga", "12 в разряд единиц", "Put 12 in the ones box"),
                b("2 o'nlik va 1 birlik", "2 десятка и 1 единица", "2 tens and 1 one"),
              ]}
              correctIndex={0}
              feedback={b(
                "Birlar katagida faqat 0 dan 9 gacha birlik qoladi.",
                "В разряде единиц остаётся только число от 0 до 9.",
                "Only a digit from 0 to 9 can remain in the ones place.",
              )}
            />
          </>
        )}
        {contentScreen === 4 && (
          <ColumnMath
            top={["1", "5", "4", "3", "0"]}
            bottom={["", "3", "2", "1", "0"]}
            result={["1", "2", "2", "2", "0"]}
            operator="−"
            phase={phase}
            beatCount={4}
          />
        )}
        {contentScreen === 5 && (
          <>
            <BorrowScene phase={phase} picked={donor} onPick={pickBorrowDonor} />
            {donorFeedback && <small className={donor === 3 ? "guess-good" : "guess-hint"}>{t(donorFeedback)}</small>}
          </>
        )}
        {contentScreen === 6 && (
          <>
            <ZeroChainScene phase={phase} picked={donor} onPick={pickZeroDonor} />
            {donorFeedback && <small className={donor === 0 ? "guess-good" : "guess-hint"}>{t(donorFeedback)}</small>}
          </>
        )}
        {contentScreen === 7 && (
          <>
            <StrategyScene phase={phase} />
            <OptionalGuess
              options={[
                b("Taxmin", "Оценка", "Estimate"),
                b("Teskari amal", "Обратное действие", "Inverse operation"),
              ]}
              correctIndex={1}
              feedback={b(
                "Taxmin javob kattaligini tekshiradi; aniq hisobni teskari amal tekshiradi.",
                "Оценка проверяет величину; точный расчёт проверяет обратное действие.",
                "An estimate checks the size of the answer; an inverse operation checks the exact calculation.",
              )}
            />
          </>
        )}
      </section>
      <Captions lines={c.audio[lang]} phase={phase} />
    </>
  );
}

function recordPayload(screen, correct, attempts, extra = {}) {
  return {
    screenIdx: screen,
    stage: SCREEN_META[screen].scope,
    question: extra.question || "",
    correct,
    firstTry: correct && attempts === 1,
    attempts,
    ...extra,
  };
}

function HookScreen({ onAnswer, audio }) {
  const screen = 0;
  const t = useT();
  const c = CONTENT[screen];
  const phase = useAutoPhase(audio, 3, screen);
  const [picked, setPicked] = useState(null);
  const correct = picked === 0;
  const choose = (index) => {
    setPicked(index);
    onAnswer(recordPayload(screen, index === 0, 1, {
      question: t(c.lead),
      studentAnswerIndex: index,
      studentAnswer: index === 0
        ? t(b("Xonalar o'ngdan tekislangan yozuvga.", "Записи, выровненной справа.", "The layout aligned on the right."))
        : t(b("Xonalar chapdan tekislangan yozuvga.", "Записи, выровненной слева.", "The layout aligned on the left.")),
      correctAnswer: t(b("Xonalar o'ngdan tekislangan yozuvga.", "Записи, выровненной справа.", "The layout aligned on the right.")),
    }));
  };
  return (
    <>
      <Heading screen={screen} bitState="awkward" />
      <section className="hook-terminals">
        <article
          className={"terminal terminal-correct " + (picked === 0 ? "terminal-picked" : "")}
        >
          <span>{t(b("O'ngdan tekislangan", "Выровнено справа", "Aligned on the right"))}</span>
          <small>48 392 + 7 605</small>
          <div className="terminal-column">
            <b>48 392</b>
            <b>+ 7 605</b>
            <i />
            <strong>55 997</strong>
          </div>
          <em className={phase >= 1 ? "units-lit" : ""}>{t(b("birlar ↕ birlar", "единицы ↕ единицы", "ones ↕ ones"))}</em>
        </article>
        <article
          className={"terminal terminal-wrong " + (picked === 1 ? "terminal-picked" : "")}
        >
          <span>{t(b("Chapdan tekislangan", "Выровнено слева", "Aligned on the left"))}</span>
          <small>48 392 + 7 605</small>
          <div className="wrong-digit-cards">
            {["7", "6", "0", "5", ""].map((digit, index) => (
              <i className={phase >= 2 && index === 3 ? "misplaced-digit" : ""} key={index}>
                {digit || "·"}
              </i>
            ))}
          </div>
          <div className="terminal-column">
            <b>48 392</b>
            <b>+ 7 6 0 5 ·</b>
            <i />
            <strong>124 442</strong>
          </div>
        </article>
      </section>
      <div className="choice-grid hook-choice-grid">
        {[
          b("Xonalar o'ngdan tekislangan yozuvga.", "Записи, выровненной справа.", "The layout aligned on the right."),
          b("Xonalar chapdan tekislangan yozuvga.", "Записи, выровненной слева.", "The layout aligned on the left."),
        ].map((option, index) => (
          <button
            type="button"
            className={"choice-button " + (picked === index ? (index === 0 ? "choice-correct" : "choice-wrong") : "")}
            onClick={() => choose(index)}
            key={index}
          >
            {t(option)}
          </button>
        ))}
      </div>
      <Feedback show={picked != null} correct={correct}>
        {t(correct
          ? b("Javobni xonalar yordamida tekshiramiz.", "Проверим ответ с помощью разрядов.", "Check the answer using place values.")
          : b(
            "Chapdan tekislash 7 605 sonining xona qiymatini o'zgartirib yubordi.",
            "Выравнивание слева изменило разрядное значение числа 7 605.",
            "Aligning on the left changed the place value of the digits in 7 605.",
          ))}
      </Feedback>
    </>
  );
}

function MiniColumn({ top, bottom, mode }) {
  const t = useT();
  const topDigits = {
    left: ["", "8", "4", "2", "1", "5"],
    right: ["8", "4", "2", "1", "5", ""],
    correct: ["", "8", "4", "2", "1", "5"],
  }[mode];
  const bottomDigits = {
    left: ["1", "9", "7", "3", "0", ""],
    right: ["", "", "1", "9", "7", "3"],
    correct: ["", "1", "9", "7", "3", "0"],
  }[mode];
  return (
    <div className="mini-column" aria-label={top + " " + t(b("minus", "минус", "minus")) + " " + bottom}>
      <small>{top}</small>
      <div>{topDigits.map((digit, index) => <span key={index}>{digit}</span>)}</div>
      <b>−</b>
      <div>{bottomDigits.map((digit, index) => <span key={index}>{digit}</span>)}</div>
      <i />
    </div>
  );
}

function ChoicePractice({
  screen,
  contentScreen = screen,
  storedAnswer,
  onAnswer,
  audio,
  options,
  correctIndex,
  correctFeedback,
  wrongFeedback,
  feedbackAudio = null,
  renderOption,
  bit = false,
}) {
  const t = useT();
  const c = CONTENT[contentScreen];
  const [picked, setPicked] = useState(
    storedAnswer?.correct ? storedAnswer.studentAnswerIndex : null,
  );
  const [solved, setSolved] = useState(Boolean(storedAnswer?.correct));
  const [attempts, setAttempts] = useState(storedAnswer?.attempts || 0);
  const [lastCorrect, setLastCorrect] = useState(Boolean(storedAnswer?.correct));

  const choose = (index) => {
    if (solved) return;
    const nextAttempts = attempts + 1;
    const isCorrect = index === correctIndex;
    setPicked(index);
    setAttempts(nextAttempts);
    setLastCorrect(isCorrect);
    if (isCorrect) setSolved(true);
    playSfx(isCorrect ? "correct" : "wrong");
    const spokenFeedback = isCorrect
      ? (feedbackAudio?.correct || correctFeedback)
      : (feedbackAudio?.wrong?.[index] || wrongFeedback[index] || wrongFeedback[0]);
    audio.pushOneOff(t(spokenFeedback));
    onAnswer(recordPayload(screen, isCorrect, nextAttempts, {
      question: t(c.lead),
      options: options.map(t),
      correctIndex,
      correctAnswer: t(options[correctIndex]),
      studentAnswerIndex: index,
      studentAnswer: t(options[index]),
      solved: isCorrect,
    }));
  };

  return (
    <>
      <Heading
        screen={screen}
        contentScreen={contentScreen}
        bitState={bit ? (solved ? "nod" : "awkward") : null}
      />
      {c.instruction && <h2 className="scene-question">{t(c.instruction)}</h2>}
      <div className={"choice-grid practice-options " + (renderOption ? "visual-options" : "")}>
        {options.map((option, index) => (
          <button
            type="button"
            className={
              "choice-button "
              + (picked === index ? (index === correctIndex ? "choice-correct" : "choice-wrong") : "")
            }
            onClick={() => choose(index)}
            key={index}
          >
            {renderOption ? renderOption(index) : t(option)}
          </button>
        ))}
      </div>
      {contentScreen === 10 && solved && (
        <div className="repair-animation" aria-live="polite">
          <span>6 + 8 + 1 = 15</span>
          <i>1 ↘</i>
          <strong>36 475 + 28 689 = 65 164</strong>
        </div>
      )}
      <Feedback show={picked != null} correct={lastCorrect}>
        {t(lastCorrect ? correctFeedback : wrongFeedback[picked] || wrongFeedback[0])}
      </Feedback>
    </>
  );
}

const RESULT_FEEDBACK = [
  b(
    "6 va ko'chgan 1 yig'indisi 7.",
    "Сумма 6 и переноса 1 равна 7.",
    "The sum of 6 and the carried 1 is 7.",
  ),
  b(
    "3, 8 va ko'chgan 1 yig'indisi 12; minglar xonasida 2 qoladi.",
    "Сумма 3, 8 и переноса 1 равна 12; в тысячах остаётся 2.",
    "The sum of 3, 8 and the carried 1 is 12; 2 remains in the thousands place.",
  ),
  b(
    "7, 5 va ko'chgan 1 yig'indisi 13; yuzlar xonasida 3 qoladi.",
    "Сумма 7, 5 и переноса 1 равна 13; в сотнях остаётся 3.",
    "The sum of 7, 5 and the carried 1 is 13; 3 remains in the hundreds place.",
  ),
  b(
    "0, 9 va ko'chgan 1 yig'indisi 10; o'nlar xonasida 0 qoladi. Nol xona o'rnini saqlaydi.",
    "Сумма 0, 9 и переноса 1 равна 10; в десятках остаётся 0. Ноль сохраняет разряд.",
    "The sum of 0, 9 and the carried 1 is 10; 0 remains in the tens place. Zero keeps the place.",
  ),
  b(
    "8 va 6 yig'indisi 14; 4 yozilib, 1 o'nlik ko'chadi.",
    "Сумма 8 и 6 равна 14; записывается 4 и переносится 1 десяток.",
    "The sum of 8 and 6 is 14; write 4 and carry 1 ten.",
  ),
];

function BuildPractice({
  screen,
  contentScreen = screen,
  storedAnswer,
  onAnswer,
  audio,
  cards,
  correct,
  labels,
  feedbackBySlot,
  feedbackAudioBySlot = null,
  solvedResult,
  fillFromRight = false,
}) {
  const t = useT();
  const c = CONTENT[contentScreen];
  const restored = storedAnswer?.correct
    ? correct.map((value, index) => ({ id: "restored-" + index, value }))
    : Array(correct.length).fill(null);
  const [slots, setSlots] = useState(restored);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts || 0);
  const [solved, setSolved] = useState(Boolean(storedAnswer?.correct));
  const [feedbackIndex, setFeedbackIndex] = useState(null);
  const [lastCorrect, setLastCorrect] = useState(Boolean(storedAnswer?.correct));

  const check = (next) => {
    if (next.some((slot) => !slot)) return;
    const values = next.map((slot) => slot.value);
    const mismatch = values.findIndex((value, index) => value !== correct[index]);
    const nextAttempts = attempts + 1;
    const isCorrect = mismatch === -1;
    setAttempts(nextAttempts);
    setLastCorrect(isCorrect);
    setFeedbackIndex(isCorrect ? -1 : mismatch);
    if (isCorrect) setSolved(true);
    playSfx(isCorrect ? "correct" : "wrong");
    const feedback = isCorrect
      ? b("Barcha xonalar to'g'ri tiklandi.", "Все разряды восстановлены верно.", "All the place values have been restored correctly.")
      : feedbackBySlot[mismatch];
    audio.pushOneOff(t(
      isCorrect
        ? feedback
        : (feedbackAudioBySlot?.[mismatch] || feedback),
    ));
    onAnswer(recordPayload(screen, isCorrect, nextAttempts, {
      question: t(c.instruction),
      correctAnswer: correct.join("|"),
      studentAnswer: values.join("|"),
      solved: isCorrect,
      details: { values },
    }));
  };

  const placeCard = (card) => {
    if (solved || slots.some((slot) => slot?.id === card.id)) return;
    const emptyIndex = fillFromRight
      ? slots.map((slot) => Boolean(slot)).lastIndexOf(false)
      : slots.findIndex((slot) => !slot);
    if (emptyIndex < 0) return;
    const next = [...slots];
    next[emptyIndex] = card;
    setSlots(next);
    check(next);
  };

  const clearSlot = (index) => {
    if (solved || !slots[index]) return;
    const next = [...slots];
    next[index] = null;
    setSlots(next);
    setFeedbackIndex(null);
  };

  return (
    <>
      <Heading screen={screen} contentScreen={contentScreen} />
      <h2 className="scene-question">{t(c.instruction)}</h2>
      <section className="build-board">
        <div className="build-slots">
          {slots.map((slot, index) => (
            <button
              type="button"
              className={
                "build-slot "
                + (feedbackIndex === index ? "slot-wrong " : "")
                + (solved ? "slot-correct" : "")
              }
              onClick={() => clearSlot(index)}
              aria-label={t(labels[index]) + ": " + (slot?.value || t(b("bo'sh", "пусто", "empty")))}
              key={index}
            >
              <small>{t(labels[index])}</small>
              <b>{slot?.value || "·"}</b>
            </button>
          ))}
        </div>
        <div className="card-pool" aria-label={t(b("Raqam kartalari", "Карточки чисел", "Digit cards"))}>
          {cards.map((card) => {
            const used = slots.some((slot) => slot?.id === card.id);
            return (
              <button
                type="button"
                className={"number-card " + (used ? "card-used" : "")}
                disabled={used || solved}
                onClick={() => placeCard(card)}
                key={card.id}
              >
                {card.value}
              </button>
            );
          })}
        </div>
        <p className="tap-help">
          {t(b(
            "Kartani bosing; o'chirish uchun to'ldirilgan katakni bosing.",
            "Нажми карточку; чтобы убрать её, нажми заполненную ячейку.",
            "Select a card. To remove it, select the filled box.",
          ))}
        </p>
        {solved && solvedResult && (
          <div className="build-result" aria-live="polite">{solvedResult}</div>
        )}
      </section>
      <Feedback show={feedbackIndex != null} correct={lastCorrect}>
        {t(lastCorrect
          ? b("To'g'ri. Har bir qiymat o'z xonasida.", "Верно. Каждое значение стоит в своём разряде.", "Correct. Each value is in its proper place.")
          : feedbackBySlot[feedbackIndex])}
      </Feedback>
    </>
  );
}

const MATCH_PAIRS = [
  {
    id: "a",
    left: "27 908 + 6 754 = 34 662",
    right: "34 662 − 6 754 = 27 908",
  },
  {
    id: "b",
    left: "84 215 − 19 730 = 64 485",
    right: "64 485 + 19 730 = 84 215",
  },
  {
    id: "c",
    left: "60 002 − 24 785 = 35 217",
    right: "35 217 + 24 785 = 60 002",
  },
];

function MatchingPractice({ screen, storedAnswer, onAnswer, audio }) {
  const contentScreen = 12;
  const t = useT();
  const c = CONTENT[contentScreen];
  const allRestored = Boolean(storedAnswer?.correct);
  const [selected, setSelected] = useState(null);
  const [matches, setMatches] = useState(allRestored ? { a: "a", b: "b", c: "c" } : {});
  const [attempts, setAttempts] = useState(storedAnswer?.attempts || 0);
  const [feedback, setFeedback] = useState(allRestored ? "correct" : null);
  const shuffledRight = [MATCH_PAIRS[1], MATCH_PAIRS[2], MATCH_PAIRS[0]];

  const pickRight = (rightId) => {
    if (!selected || matches[selected]) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (rightId !== selected) {
      setFeedback("wrong");
      playSfx("wrong");
      audio.pushOneOff(t(b(
        "Qo'shish va ayirish teskari juftligini tekshiring.",
        "Проверь пару обратных действий сложения и вычитания.",
        "Check that addition and subtraction form an inverse pair.",
      )));
      onAnswer(recordPayload(screen, false, nextAttempts, {
        question: t(c.lead),
        studentAnswer: selected + "→" + rightId,
        correctAnswer: selected + "→" + selected,
      }));
      return;
    }
    const nextMatches = { ...matches, [selected]: rightId };
    const complete = Object.keys(nextMatches).length === MATCH_PAIRS.length;
    setMatches(nextMatches);
    setFeedback(complete ? "correct" : "pair");
    setSelected(null);
    playSfx("correct");
    if (complete) {
      audio.pushOneOff(t(b(
        "Barcha hisoblar mos teskari amal bilan tekshirildi.",
        "Все вычисления проверены подходящими обратными действиями.",
        "Every calculation has been checked with the correct inverse operation.",
      )));
      onAnswer(recordPayload(screen, true, nextAttempts, {
        question: t(c.lead),
        studentAnswer: "a→a, b→b, c→c",
        correctAnswer: "a→a, b→b, c→c",
        solved: true,
      }));
    }
  };

  return (
    <>
      <Heading screen={screen} contentScreen={contentScreen} />
      <section className="matching-board">
        <div className="match-column">
          <span>{t(b("Hisob", "Вычисление", "Calculation"))}</span>
          {MATCH_PAIRS.map((pair) => (
            <button
              type="button"
              className={
                "match-card "
                + (selected === pair.id ? "match-selected " : "")
                + (matches[pair.id] ? "match-done" : "")
              }
              disabled={Boolean(matches[pair.id])}
              onClick={() => setSelected(pair.id)}
              key={pair.id}
            >
              {pair.left}
            </button>
          ))}
        </div>
        <div className="match-arrows" aria-hidden="true">
          <span>↔</span><span>↔</span><span>↔</span>
        </div>
        <div className="match-column">
          <span>{t(b("Teskari tekshiruv", "Обратная проверка", "Inverse check"))}</span>
          {shuffledRight.map((pair) => {
            const used = Object.values(matches).includes(pair.id);
            return (
              <button
                type="button"
                className={"match-card " + (used ? "match-done" : "")}
                disabled={used}
                onClick={() => pickRight(pair.id)}
                key={pair.id}
              >
                {pair.right}
              </button>
            );
          })}
        </div>
      </section>
      <Feedback show={feedback != null} correct={feedback !== "wrong"}>
        {t(feedback === "wrong"
          ? b(
            "Xato juft uzildi. Qo'shish ↔ ayirish belgilarini solishtiring.",
            "Неверная пара разорвана. Сравни знаки сложения ↔ вычитания.",
            "The incorrect pair has been removed. Compare the addition and subtraction signs.",
          )
          : feedback === "correct"
            ? b("Barcha juftlar to'g'ri.", "Все пары верны.", "All the pairs are correct.")
            : b("Bu juft mos. Qolganlarini davom ettiring.", "Эта пара подходит. Продолжай.", "This pair matches. Continue with the others."))}
      </Feedback>
    </>
  );
}

function NumericPractice({ screen, storedAnswer, onAnswer, audio }) {
  const contentScreen = 13;
  const t = useT();
  const c = CONTENT[contentScreen];
  const [value, setValue] = useState(storedAnswer?.correct ? "61132" : "");
  const [attempts, setAttempts] = useState(storedAnswer?.attempts || 0);
  const [checked, setChecked] = useState(Boolean(storedAnswer?.correct));
  const [correct, setCorrect] = useState(Boolean(storedAnswer?.correct));

  const submit = () => {
    const normalized = value.replace(/\s/g, "");
    const nextAttempts = attempts + 1;
    const isCorrect = normalized === "61132";
    setAttempts(nextAttempts);
    setChecked(true);
    setCorrect(isCorrect);
    playSfx(isCorrect ? "correct" : "wrong");
    const message = isCorrect
      ? b(
        "To'g'ri. Oltmish bir ming bir yuz o'ttiz ikkita kitob qoldi.",
        "Верно. Осталось шестьдесят одна тысяча сто тридцать две книги.",
        "Correct. Sixty-one thousand one hundred and thirty-two books remain.",
      )
      : b(
        "Javob oltmish bir ming atrofida bo'lishi kerak. Sonlarni birlar bo'yicha tekislab, har ustunni tekshiring.",
        "Ответ должен быть около шестидесяти одной тысячи. Выровняй числа по единицам и проверь каждый столбец.",
        "The answer should be about sixty-one thousand. Align the numbers by the ones place and check every column.",
      );
    audio.pushOneOff(t(message));
    onAnswer(recordPayload(screen, isCorrect, nextAttempts, {
      question: t(c.lead),
      correctAnswer: "61 132",
      studentAnswer: value,
      solved: isCorrect,
    }));
  };

  return (
    <>
      <Heading screen={screen} contentScreen={contentScreen} />
      <section className="library-scene">
        <div className="books-visual" aria-hidden="true">
          <span>72 384</span>
          <i>−11 252</i>
          <b>?</b>
        </div>
        <div className="estimate-support">72 000 − 11 000 ≈ 61 000</div>
        <label className="numeric-answer">
          <span>{t(b("Javob", "Ответ", "Answer"))}</span>
          <input
            inputMode="numeric"
            value={value}
            placeholder="0"
            onChange={(event) => {
              setValue(event.target.value.replace(/[^\d\s]/g, ""));
              setChecked(false);
            }}
            aria-label={t(b("Qolgan kitoblar soni", "Количество оставшихся книг", "Number of books remaining"))}
          />
        </label>
        <button type="button" className="button button-check" onClick={submit}>
          {t(b("Tekshirish", "Проверить", "Check"))}
        </button>
      </section>
      <Feedback show={checked} correct={correct}>
        {t(correct
          ? b(
            "To'g'ri. Oltmish bir ming bir yuz o'ttiz ikkita kitob qoldi.",
            "Верно. Осталось шестьдесят одна тысяча сто тридцать две книги.",
            "Correct. Sixty-one thousand one hundred and thirty-two books remain.",
          )
          : b(
            "Javob oltmish bir ming atrofida bo'lishi kerak. Sonlarni birlar bo'yicha tekislab, har ustunni tekshiring.",
            "Ответ должен быть около шестидесяти одной тысячи. Выровняй числа по единицам и проверь каждый столбец.",
            "The answer should be about sixty-one thousand. Align the numbers by the ones place and check every column.",
          ))}
      </Feedback>
    </>
  );
}

function SummaryScreen({ audio, answers = {} }) {
  const screen = 14;
  const t = useT();
  const lang = useLang();
  const c = CONTENT[screen];
  const phase = useAutoPhase(audio, 4, screen);
  const finalBeat = phase >= 3 || audio.completed || audio.muted;
  const scoredIndexes = SCREEN_META.reduce((indexes, meta, index) => (meta.scored ? [...indexes, index] : indexes), []);
  const firstTryCount = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
  const totalScored = scoredIndexes.length;
  const rewardTitles = {
    top: b("Yozma hisob me'mori", "Архитектор вычислений", "Written-calculation architect"),
    middle: b("Yozma hisob ustasi", "Мастер вычислений", "Written-calculation master"),
    base: b("Xonalar tadqiqotchisi", "Исследователь разрядов", "Place-value explorer"),
  };
  const rewardTitle = firstTryCount === totalScored
    ? rewardTitles.top
    : firstTryCount >= Math.max(1, totalScored - 1)
      ? rewardTitles.middle
      : rewardTitles.base;
  const rules = [
    b("Xona ostiga xona", "Разряд под разрядом", "Place under place"),
    b("10 ta kichik birlik → 1 ta katta birlik", "10 меньших единиц → 1 большая", "10 smaller units → 1 larger unit"),
    b("1 ta katta birlik → 10 ta kichik birlik", "1 большая единица → 10 меньших", "1 larger unit → 10 smaller units"),
    b("Taxmin + teskari amal", "Оценка + обратное действие", "Estimate + inverse operation"),
  ];
  return (
    <>
      <G4TitleReveal active={finalBeat} title={t(rewardTitle)} lang={lang} />
      <style>{G4_TITLE_STYLES}</style>
      <section className="summary-scene">
        <header className="finale-heading">
          <span>{t(b("YAKUNIY BOSQICH", "ФИНАЛЬНЫЙ ЭТАП", "FINAL STAGE"))}</span>
          <h1>{t(c.title)}</h1>
          <p>{t(c.lead)}</p>
        </header>
        <div className="finale-main-grid">
          <div className="finale-payoff-card">
            <span className="finale-section-kicker">{t(b("BOSHLANG'ICH MISSIYA YECHIMI", "РЕШЕНИЕ СТАРТОВОЙ МИССИИ", "OPENING MISSION SOLUTION"))}</span>
            <div className={"hook-repair " + (phase >= 2 ? "hook-repairing" : "")}>
              <div>
                <small>48 392 + 7 605</small>
                <span className="moving-number">7 605</span>
              </div>
              <b>{phase >= 3 ? "55 997" : "124 442"}</b>
            </div>
            <p className="finale-payoff-copy">{t(b(
              "Dars boshidagi noto'g'ri tekislash tuzatildi. Javob 55 997.",
              "Неверное выравнивание из начала урока исправлено. Ответ 55 997.",
              "The incorrect alignment from the start of the lesson has been fixed. The answer is 55 997.",
            ))}</p>
          </div>
          <div className="finale-mastery-card">
            <span className="finale-section-kicker">{t(b("SIZ O'RGANGAN TAYANCHLAR", "ОСВОЕННЫЕ ОПОРЫ", "KEY IDEAS YOU LEARNT"))}</span>
            <div className="summary-rules">
              {rules.map((rule, index) => (
                <div className={index <= phase ? "summary-rule rule-visible" : "summary-rule"} key={index}>
                  <span>{index + 1}</span>
                  <p>{t(rule)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {finalBeat && <G4TitleCard title={t(rewardTitle)} lang={lang} firstTry={firstTryCount} totalScored={totalScored} />}
        <div className={phase >= 3 ? "bridge bridge-visible" : "bridge"}>
          <span>{t(b("KEYINGI MISSIYA", "СЛЕДУЮЩАЯ МИССИЯ", "NEXT MISSION"))}</span>
          <strong>{t(b(
            "Ko'p xonali sonni bir xonali songa ko'paytirish",
            "Умножение многозначного числа на однозначное",
            "Multiplying a multi-digit number by a one-digit number",
          ))}</strong>
        </div>
      </section>
      <Captions lines={c.audio[lang]} phase={phase} />
    </>
  );
}

function ScreenBody({ screen, sourceScreen = screen, storedAnswer, onAnswer, audio, answers }) {
  const t = useT();
  if (sourceScreen === 0) return <HookScreen onAnswer={onAnswer} audio={audio} />;
  if (sourceScreen >= 1 && sourceScreen <= 7) return <ExplanationScreen screen={screen} contentScreen={sourceScreen} audio={audio} />;
  if (sourceScreen === 8) {
    const options = [
      b("Chapga siljigan", "Сдвинуто влево", "Shifted left"),
      b("Birlar ostiga birlar", "Единицы под единицами", "Ones under ones"),
      b("O'ngga siljigan", "Сдвинуто вправо", "Shifted right"),
    ];
    return (
      <ChoicePractice
        screen={screen}
        contentScreen={sourceScreen}
        storedAnswer={storedAnswer}
        onAnswer={onAnswer}
        audio={audio}
        options={options}
        correctIndex={1}
        correctFeedback={b(
          "To'g'ri: sonlar uzunligiga emas, birlar xonasiga qarab tekislanadi.",
          "Верно: числа выравниваются по единицам, а не по длине.",
          "Correct: align numbers by their ones places, not by their lengths.",
        )}
        wrongFeedback={[
          b(
            "Pastki son chapga siljigan: birlar bir chiziqda emas.",
            "Нижнее число сдвинуто влево: единицы не на одной линии.",
            "The lower number is shifted left: the ones are not in the same column.",
          ),
          b("To'g'ri variant.", "Верный вариант.", "Correct option."),
          b(
            "Pastki son o'ngga siljigan: birinchi mos kelmagan ustunni tekshiring.",
            "Нижнее число сдвинуто вправо: проверь первый несовпавший столбец.",
            "The lower number is shifted right. Check the first column that does not match.",
          ),
        ]}
        renderOption={(index) => (
          <MiniColumn
            top="84 215"
            bottom="19 730"
            mode={index === 0 ? "left" : index === 1 ? "correct" : "right"}
          />
        )}
      />
    );
  }
  if (sourceScreen === 9) {
    return (
      <BuildPractice
        screen={screen}
        contentScreen={sourceScreen}
        storedAnswer={storedAnswer}
        onAnswer={onAnswer}
        audio={audio}
        cards={[
          { id: "seven", value: "7" },
          { id: "two", value: "2" },
          { id: "three", value: "3" },
          { id: "zero", value: "0" },
          { id: "four", value: "4" },
          { id: "one", value: "1" },
          { id: "nine", value: "9" },
        ]}
        correct={["7", "2", "3", "0", "4"]}
        labels={[
          b("o'n ming", "дес. тысяч", "ten thousands"),
          b("ming", "тысяч", "thousands"),
          b("yuz", "сотен", "hundreds"),
          b("o'n", "десятков", "tens"),
          b("bir", "единиц", "ones"),
        ]}
        feedbackBySlot={RESULT_FEEDBACK}
        feedbackAudioBySlot={[
          b(
            "Olti va ko'chgan bir yig'indisi yetti bo'ladi.",
            "Шесть и перенесённая единица дают семь.",
            "Six and the carried one make seven.",
          ),
          b(
            "Uch, sakkiz va ko'chgan bir yig'indisi o'n ikki bo'ladi. Minglar xonasida ikki qoladi.",
            "Три, восемь и перенесённая единица дают двенадцать. В разряде тысяч остаётся два.",
            "Three, eight and the carried one make twelve. Two remains in the thousands place.",
          ),
          b(
            "Yetti, besh va ko'chgan bir yig'indisi o'n uch bo'ladi. Yuzlar xonasida uch qoladi.",
            "Семь, пять и перенесённая единица дают тринадцать. В разряде сотен остаётся три.",
            "Seven, five and the carried one make thirteen. Three remains in the hundreds place.",
          ),
          b(
            "Nol, to'qqiz va ko'chgan bir yig'indisi o'n bo'ladi. O'nlar xonasida nol qoladi.",
            "Ноль, девять и перенесённая единица дают десять. В разряде десятков остаётся ноль.",
            "Zero, nine and the carried one make ten. Zero remains in the tens place.",
          ),
          b(
            "Sakkiz va olti yig'indisi o'n to'rt bo'ladi. To'rt yozilib, bir o'nlik ko'chadi.",
            "Восемь и шесть дают четырнадцать. Записывается четыре и переносится один десяток.",
            "Eight and six make fourteen. Write four and carry one ten.",
          ),
        ]}
        solvedResult={<span>63 708 + 8 596 = <b>72 304</b></span>}
        fillFromRight
      />
    );
  }
  if (sourceScreen === 10) {
    const options = [
      b("1 o'nlik → 10 birlik; 11 − 6 = 5", "1 десяток → 10 единиц; 11 − 6 = 5", "1 ten → 10 ones; 11 − 6 = 5"),
      b("Teskari ayirish: 6 − 1 = 5", "Вычесть наоборот: 6 − 1 = 5", "Reverse the subtraction: 6 − 1 = 5"),
      b("Darhol yuzlikdan olish", "Сразу взять из сотен", "Exchange from the hundreds at once"),
    ];
    const wrong = [
      b("To'g'ri variant.", "Верный вариант.", "Correct option."),
      b(
        "Ayirishda raqamlarning o'rnini almashtirmaymiz; eng yaqin chapdagi xonadan maydalaymiz.",
        "При вычитании цифры не меняют местами; выполняют размен из ближайшего разряда слева.",
        "Do not reverse the digits when subtracting. Exchange from the nearest place on the left.",
      ),
      b(
        "Avval eng yaqin chapdagi o'nlikni tekshiring. Bu misolda u donor bo'la oladi.",
        "Сначала проверь ближайший разряд десятков. В этом примере он может быть донором.",
        "Check the nearest tens place on the left first. In this calculation, you can exchange from it.",
      ),
    ];
    return (
      <ChoicePractice
        screen={screen}
        contentScreen={sourceScreen}
        storedAnswer={storedAnswer}
        onAnswer={onAnswer}
        audio={audio}
        options={options}
        correctIndex={0}
        correctFeedback={b(
          "To'g'ri. Bitta o'nlik o'nta birlikka aylanadi: 11 − 6 = 5.",
          "Верно. Один десяток превращается в десять единиц: 11 − 6 = 5.",
          "Correct. One ten becomes ten ones: 11 − 6 = 5.",
        )}
        wrongFeedback={wrong}
        feedbackAudio={{
          correct: b(
            "To'g'ri. Bitta o'nlik o'nta birlikka aylanadi. O'n bir birlikdan olti birlikni ayirib, besh birlik olamiz.",
            "Верно. Один десяток превращается в десять единиц. Из одиннадцати единиц вычитаем шесть и получаем пять.",
            "Correct. One ten becomes ten ones. Eleven ones minus six ones leaves five ones.",
          ),
          wrong: [
            wrong[0],
            wrong[1],
            wrong[2],
          ],
        }}
        bit
      />
    );
  }
  if (sourceScreen === 11) {
    const zeroFeedback = b(
      "Bu nol orqali almashinuv hali oxirigacha yetmagan.",
      "Размен через этот нулевой разряд ещё не завершён.",
      "The exchange through this zero place is not complete yet.",
    );
    return (
      <BuildPractice
        screen={screen}
        contentScreen={sourceScreen}
        storedAnswer={storedAnswer}
        onAnswer={onAnswer}
        audio={audio}
        cards={[
          { id: "five", value: "5" },
          { id: "nine-a", value: "9" },
          { id: "nine-b", value: "9" },
          { id: "nine-c", value: "9" },
          { id: "twelve", value: "12" },
          { id: "six", value: "6" },
          { id: "zero", value: "0" },
        ]}
        correct={["5", "9", "9", "9", "12"]}
        labels={[
          b("o'n ming", "дес. тысяч", "ten thousands"),
          b("ming", "тысяч", "thousands"),
          b("yuz", "сотен", "hundreds"),
          b("o'n", "десятков", "tens"),
          b("bir", "единиц", "ones"),
        ]}
        feedbackBySlot={[zeroFeedback, zeroFeedback, zeroFeedback, zeroFeedback, b(
          "Birliklarda 2 ga maydalangan 10 birlik qo'shilib, 12 bo'ladi.",
          "В единицах к 2 добавляются 10 разменянных единиц, получается 12.",
          "In the ones place, add the 10 exchanged ones to 2 to make 12.",
        )]}
        feedbackAudioBySlot={[
          zeroFeedback,
          zeroFeedback,
          zeroFeedback,
          zeroFeedback,
          b(
            "Birliklardagi ikkiga maydalangan o'nta birlik qo'shilib, o'n ikki bo'ladi.",
            "К двум единицам добавляются десять разменянных единиц, получается двенадцать.",
            "Add ten exchanged ones to two ones to make twelve ones.",
          ),
        ]}
        solvedResult={<span>60 002 − 24 785 = <b>35 217</b></span>}
      />
    );
  }
  if (sourceScreen === 12) return <MatchingPractice screen={screen} storedAnswer={storedAnswer} onAnswer={onAnswer} audio={audio} />;
  if (sourceScreen === 13) return <NumericPractice screen={screen} storedAnswer={storedAnswer} onAnswer={onAnswer} audio={audio} />;
  if (sourceScreen === 14) return <SummaryScreen audio={audio} answers={answers} />;
  return <p>{t(b("Ekran topilmadi.", "Экран не найден.", "Screen not found."))}</p>;
}

function LessonRuntime({
  studentName,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  onFinished,
  preview,
  previewLang,
  onPreviewLang,
}) {
  const lang = useLang();
  const t = useT();
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState({});
  const startedAt = useRef(null);
  const finishedRef = useRef(false);
  const sourceScreen = SOURCE_ORDER[screen];
  const audio = useAudio(CONTENT[sourceScreen].audio, screen);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    runtimeConfig = {
      ttsApiBase: ttsApiBase || "",
      voiceGender: voiceGender || "f",
      correctSoundUrl: correctSoundUrl || "",
      wrongSoundUrl: wrongSoundUrl || "",
      previewMode: preview,
    };
  }, [ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, preview]);

  const recordAnswer = useCallback((answer) => {
    setAnswers((current) => ({ ...current, [answer.screenIdx]: answer }));
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const scored = Object.values(answers).filter((answer) => (
      SCREEN_META[answer.screenIdx]?.scored
    ));
    const correctAnswers = scored.filter((answer) => answer.firstTry).length;
    const totalQuestions = 6;
    const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);
    const durationSec = Math.max(
      1,
      Math.round((Date.now() - (startedAt.current || Date.now())) / 1000),
    );
    onFinished?.({
      lessonId: LESSON_META.lessonId,
      lessonTitle: t(LESSON_META.lessonTitle),
      studentName: studentName || "",
      lang,
      duration: durationSec,
      durationSec,
      totalQuestions,
      correctAnswers,
      scorePercent,
      finalScore: correctAnswers,
      finalTotal: totalQuestions,
      passed: scorePercent >= 60,
      firstTryStats: {
        total: totalQuestions,
        firstTryCorrect: scored.filter((answer) => answer.firstTry).length,
      },
      attemptsTotal: scored.reduce((sum, answer) => sum + (answer.attempts || 0), 0),
      answers: scored.sort((left, right) => left.screenIdx - right.screenIdx),
    });
  }, [answers, lang, onFinished, studentName, t]);

  return (
    <div className="d8-root">
      {preview && (
        <div className="preview-language" aria-label={t(b("Ko'rib chiqish tili", "Язык предпросмотра", "Preview language"))}>
          {SUPPORTED_LANGS.map((code) => (
            <button
              type="button"
              className={previewLang === code ? "preview-active" : ""}
              onClick={() => onPreviewLang(code)}
              key={code}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      <Stage
        screen={screen}
        audio={audio}
        onBack={() => setScreen((current) => Math.max(0, current - 1))}
        onNext={() => setScreen((current) => Math.min(TOTAL_SCREENS - 1, current + 1))}
        onFinish={finish}
      >
        <ScreenBody
          key={"screen-" + screen}
          screen={screen}
          sourceScreen={sourceScreen}
          answers={answers}
          storedAnswer={answers[screen]}
          onAnswer={recordAnswer}
          audio={audio}
        />
      </Stage>
    </div>
  );
}

export default function Grade4Dars08({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  onFinished,
}) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState("uz");
  const lang = preview ? normalizeLang(previewLang) : normalizeLang(langProp);
  return (
    <LangContext.Provider value={lang}>
      <LessonRuntime
        studentName={studentName}
        ttsApiBase={ttsApiBase}
        voiceGender={voiceGender}
        correctSoundUrl={correctSoundUrl}
        wrongSoundUrl={wrongSoundUrl}
        onFinished={onFinished}
        preview={preview}
        previewLang={previewLang}
        onPreviewLang={setPreviewLang}
      />
      <LessonStyles />
    </LangContext.Provider>
  );
}

function LessonStyles() {
  return <style>{LESSON_CSS}</style>;
}

const LESSON_CSS = `
.d8-root {
  --bg: #F5F5F0;
  --paper: #FFFFFF;
  --ink: #12212C;
  --ink-2: #4E606C;
  --ink-3: #82919A;
  --navy: #173B52;
  --accent: #FF5B35;
  --accent-soft: #FFF0EA;
  --cyan: #168FA3;
  --cyan-soft: #E4F5F6;
  --lime: #95C93D;
  --success: #247553;
  --success-soft: #E7F4EC;
  --warning: #A96F13;
  --warning-soft: #FFF4D8;
  --line: #DDE4E7;
  width: 100%;
  min-height: 100dvh;
  height: 100dvh;
  overflow: hidden;
  color: var(--ink);
  background:
    radial-gradient(circle at 8% 4%, rgba(22, 143, 163, .09), transparent 28%),
    radial-gradient(circle at 94% 82%, rgba(255, 91, 53, .08), transparent 30%),
    var(--bg);
  font-family: Manrope, Arial, sans-serif;
  box-sizing: border-box;
}

.d8-root *,
.d8-root *::before,
.d8-root *::after {
  box-sizing: inherit;
}

.d8-root button,
.d8-root input {
  font: inherit;
}

.d8-root button {
  min-height: 44px;
  touch-action: manipulation;
}

.d8-root .stage {
  width: min(936px, 100%);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: rgba(245, 245, 240, .94);
}

.d8-root .stage-header {
  flex: 0 0 auto;
  padding: 10px 24px 8px;
  background: rgba(247, 248, 244, .88);
  backdrop-filter: blur(14px);
}

.d8-root .progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(80, 97, 109, .16);
}

.d8-root .progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--cyan), var(--accent));
  box-shadow: 0 0 12px rgba(255, 91, 53, .42);
  transition: width .45s ease;
}

.d8-root .stage-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.d8-root .chrome-title,
.d8-root .chrome-actions,
.d8-root .audio-controls {
  display: flex;
  align-items: center;
  gap: 9px;
}

.d8-root .chrome-title {
  min-width: 0;
  color: var(--ink-2);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.d8-root .chrome-title > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.d8-root .status-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px rgba(255, 91, 53, .65);
}

.d8-root .screen-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.d8-root .screen-type {
  padding: 4px 8px;
  border-radius: 999px;
  color: var(--cyan);
  background: #E5F5F6;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.d8-root .icon-btn {
  width: 32px;
  height: 32px;
  min-height: 32px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  color: var(--ink-2);
  background: rgba(255, 255, 255, .75);
  cursor: pointer;
  box-shadow: 0 4px 12px -7px rgba(58, 53, 48, .3);
}

.d8-root .stage-content {
  min-height: 0;
  flex: 1 1 auto;
  overflow: visible;
  padding: 18px 32px 16px;
  position: relative;
}

.d8-root .stage-happy-bit {
  width: 40px;
  height: 40px;
  position: absolute;
  z-index: 3;
  top: 10px;
  right: 12px;
  display: grid;
  place-items: center;
}

.d8-root .stage-happy-bit .g1-char { width: 100%; height: 100%; display: block; }
.d8-root .heading { padding-right: 50px; }

.d8-root .stage-nav {
  flex: 0 0 auto;
  min-height: 74px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid var(--line);
  background: rgba(255, 255, 255, .92);
  backdrop-filter: blur(10px);
}

.d8-root .button {
  min-width: 132px;
  padding: 11px 18px;
  border: 0;
  border-radius: 14px;
  font-weight: 850;
  cursor: pointer;
}

.d8-root .button-primary {
  color: #FFFFFF;
  background: var(--accent);
  box-shadow: 0 8px 20px rgba(255, 91, 53, .24);
}

.d8-root .button-ghost {
  color: var(--ink-2);
  border: 1px solid var(--line);
  background: var(--paper);
}

.d8-root .button-check {
  color: #FFFFFF;
  background: var(--navy);
}

.d8-root .heading {
  margin: 0 0 20px;
}

.d8-root .heading-with-bit {
  min-height: 132px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 108px;
  align-items: center;
  gap: 22px;
}

.d8-root .eyebrow {
  display: block;
  margin-bottom: 7px;
  color: var(--accent);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .13em;
  text-transform: uppercase;
}

.d8-root h1 {
  max-width: 760px;
  margin: 0;
  font-family: "Source Serif 4", Georgia, serif;
  font-size: clamp(29px, 4vw, 46px);
  line-height: 1.04;
  letter-spacing: -.025em;
}

.d8-root .heading p {
  max-width: 720px;
  margin: 11px 0 0;
  color: var(--ink-2);
  font-size: 16px;
  line-height: 1.55;
}

.d8-root .bit-shell {
  width: 104px;
  height: 130px;
  display: grid;
  place-items: center;
}

.d8-root .heading-with-small-bit {
  min-height: 90px;
  grid-template-columns: minmax(0, 1fr) 72px;
}

.d8-root .bit-shell-small {
  width: 68px;
  height: 85px;
}

.d8-root .bit-shell-small .g1-char {
  width: 68px;
  height: 85px;
}

.d8-root .g1-char {
  width: 104px;
  height: 130px;
  overflow: visible;
}

.d8-root .g1-bit-ant {
  transform-origin: 60px 28px;
  animation: bitAntenna 2.4s ease-in-out infinite;
}

.d8-root .g1-bit-wave,
.d8-root .bit-wave-right {
  transform-origin: 84px 74px;
  animation: bitWave 1.6s ease-in-out infinite;
}

.d8-root .bit-wave-left {
  transform-origin: 36px 74px;
  animation: bitWaveLeft 1.6s ease-in-out infinite;
}

.d8-root .bit-awkward-hands {
  animation: awkwardHands 1.8s ease-in-out infinite;
}

.d8-root .mini-coach {
  width: max-content;
  max-width: 100%;
  margin: 7px 0 4px auto;
  display: grid;
  grid-template-columns: 68px auto;
  align-items: center;
  gap: 5px;
}

.d8-root .mini-coach .g1-char {
  width: 68px;
  height: 84px;
}

.d8-root .mini-coach > span {
  padding: 7px 10px;
  border: 1px solid rgba(255, 91, 53, .22);
  border-radius: 999px;
  color: var(--accent);
  background: var(--accent-soft);
  font: 900 13px/1 JetBrains Mono, monospace;
}

.d8-root .place-warehouse-svg,
.d8-root .exchange-bundle-svg,
.d8-root .donor-path-svg {
  width: 100%;
  display: block;
  overflow: visible;
}

.d8-root .place-warehouse-svg {
  height: 118px;
  margin: -5px auto 7px;
  overflow: hidden;
}

.d8-root .warehouse-belt {
  fill: none;
  stroke: var(--navy);
  stroke-width: 3;
  stroke-linecap: round;
  opacity: .16;
}

.d8-root .warehouse-bay > rect:first-child {
  fill: rgba(228, 245, 246, .72);
  stroke: rgba(22, 143, 163, .28);
  stroke-width: 1.5;
}

.d8-root .warehouse-bay > text {
  fill: var(--ink-3);
  font: 800 9px/1 JetBrains Mono, monospace;
  text-anchor: middle;
}

.d8-root .warehouse-crate {
  stroke-width: 1.5;
}

.d8-root .top-crate {
  fill: var(--paper);
  stroke: rgba(23, 59, 82, .2);
}

.d8-root .lower-crate {
  fill: var(--accent-soft);
  stroke: rgba(255, 91, 53, .34);
}

.d8-root .warehouse-digit {
  fill: var(--navy);
  font: 900 15px/1 JetBrains Mono, monospace;
  text-anchor: middle;
}

.d8-root .warehouse-digit.lower-digit {
  fill: var(--accent);
}

.d8-root .warehouse-moving {
  opacity: .45;
  transform: translateX(-46px);
  transition: transform .7s cubic-bezier(.16, 1, .3, 1), opacity .45s ease;
}

.d8-root .place-warehouse-svg.phase-1 .warehouse-moving,
.d8-root .place-warehouse-svg.phase-2 .warehouse-moving {
  opacity: 1;
  transform: translateX(0);
}

.d8-root .warehouse-unit-guide {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  transition: opacity .35s ease;
}

.d8-root .place-warehouse-svg.phase-2 .warehouse-unit-guide {
  opacity: 1;
}

.d8-root .exchange-bundle-svg {
  height: 116px;
  margin: 5px auto 0;
}

.d8-root .loose-ten circle,
.d8-root .remainder-two circle {
  fill: var(--cyan);
}

.d8-root .loose-ten {
  transform-origin: 126px 56px;
  transition: opacity .5s ease, transform .65s cubic-bezier(.16, 1, .3, 1);
}

.d8-root .exchange-flow,
.d8-root .exchange-flow-tip,
.d8-root .exchange-plus {
  fill: none;
  stroke: var(--accent);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.d8-root .bundled-ten {
  opacity: 0;
  transform: translateX(-28px) scale(.9);
  transform-origin: 315px 56px;
  transition: opacity .45s ease, transform .65s cubic-bezier(.16, 1, .3, 1);
}

.d8-root .bundled-ten rect {
  fill: var(--accent-soft);
  stroke: var(--accent);
  stroke-width: 2;
}

.d8-root .bundled-ten circle {
  fill: var(--accent);
}

.d8-root .bundled-ten text,
.d8-root .remainder-two text {
  fill: var(--navy);
  font: 900 13px/1 JetBrains Mono, monospace;
  text-anchor: middle;
}

.d8-root .exchange-bundle-svg.is-bundled .loose-ten {
  opacity: .12;
  transform: translateX(154px) scale(.5);
}

.d8-root .exchange-bundle-svg.is-bundled .bundled-ten {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.d8-root .donor-path-svg {
  height: 108px;
  margin: -2px auto 0;
}

.d8-root .donor-route,
.d8-root .donor-route-tip {
  fill: none;
  stroke: var(--accent);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 660;
  stroke-dashoffset: 660;
  opacity: .18;
  transition: stroke-dashoffset .95s ease, opacity .3s ease;
}

.d8-root .donor-checkpoint circle {
  fill: var(--cyan-soft);
  stroke: rgba(22, 143, 163, .36);
  stroke-width: 2;
}

.d8-root .zero-checkpoint circle {
  fill: var(--warning-soft);
  stroke: rgba(169, 111, 19, .42);
}

.d8-root .donor-checkpoint text,
.d8-root .donor-token text {
  fill: var(--navy);
  font: 900 17px/1 JetBrains Mono, monospace;
  text-anchor: middle;
}

.d8-root .donor-token {
  opacity: 0;
  transition: transform 1.05s cubic-bezier(.16, 1, .3, 1), opacity .25s ease;
}

.d8-root .donor-token rect {
  fill: var(--accent);
}

.d8-root .donor-token text {
  fill: #FFFFFF;
  font-size: 12px;
}

.d8-root .donor-change {
  fill: var(--success);
  font: 900 11px/1 JetBrains Mono, monospace;
  text-anchor: middle;
  opacity: 0;
  transition: opacity .4s ease .45s;
}

.d8-root .donor-path-svg.path-active .donor-route,
.d8-root .donor-path-svg.path-active .donor-route-tip {
  stroke-dashoffset: 0;
  opacity: 1;
}

.d8-root .donor-path-svg.path-active .donor-token {
  opacity: 1;
  transform: translateX(484px);
}

.d8-root .donor-path-svg.path-active .donor-change {
  opacity: 1;
}

.d8-root .scene-question {
  max-width: 760px;
  margin: -4px 0 16px;
  color: var(--navy);
  font-family: "Source Serif 4", Georgia, serif;
  font-size: clamp(20px, 2.5vw, 29px);
  line-height: 1.25;
}

.d8-root .semantic-scene {
  display: grid;
  gap: 18px;
  padding: 4px 0;
}

.d8-root .place-row {
  width: min(570px, 100%);
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(5, minmax(44px, 1fr));
  gap: 6px;
}

.d8-root .place-row > span {
  min-width: 0;
  min-height: 54px;
  display: grid;
  place-items: center;
  border-radius: 12px;
}

.d8-root .place-labels > span {
  min-height: 28px;
  color: var(--ink-3);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .03em;
}

.d8-root .digit-row > span {
  border: 1px solid var(--line);
  color: var(--navy);
  background: var(--paper);
  font: 800 clamp(25px, 5vw, 38px)/1 JetBrains Mono, monospace;
  transition: transform .3s ease, background .3s ease, opacity .3s ease;
}

.d8-root .digit-row > span.active-place {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
  transform: translateY(-3px);
  box-shadow: 0 7px 18px rgba(255, 91, 53, .17);
}

.d8-root .digit-row > span.digit-hidden {
  opacity: .08;
  transform: translateY(-12px);
}

.d8-root .digit-row > span i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--line);
}

.d8-root .second-row > span {
  background: var(--cyan-soft);
}

.d8-root .result-row > span {
  border-color: #B8DFC7;
  color: var(--success);
  background: var(--success-soft);
}

.d8-root .borrow-row > span {
  min-height: 34px;
  color: var(--warning);
  background: var(--warning-soft);
  font-size: 17px;
}

.d8-root .column-board,
.d8-root .alignment-board,
.d8-root .exchange-scene,
.d8-root .borrow-scene,
.d8-root .zero-chain-scene {
  width: min(680px, 100%);
  margin-inline: auto;
  padding: clamp(14px, 3vw, 26px);
  border-left: 4px solid var(--cyan);
  border-radius: 0 20px 20px 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, .98), rgba(228, 245, 246, .7));
  box-shadow: 0 16px 38px rgba(23, 59, 82, .08);
}

.d8-root .operator-row {
  width: min(620px, 100%);
  margin: 6px auto 0;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
}

.d8-root .operator-row > b {
  color: var(--accent);
  font: 900 32px/1 JetBrains Mono, monospace;
}

.d8-root .operator-row .place-row {
  width: 100%;
}

.d8-root .column-rule {
  width: min(570px, calc(100% - 34px));
  height: 3px;
  margin: 8px 0 8px auto;
  border-radius: 99px;
  background: var(--navy);
}

.d8-root .alignment-board {
  position: relative;
  min-height: 286px;
  overflow: hidden;
}

.d8-root .alignment-board .sliding-row {
  width: min(610px, 100%);
  margin: 8px auto;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  transition: transform .7s cubic-bezier(.2, .9, .2, 1);
}

.d8-root .alignment-board .sliding-row > b {
  color: var(--accent);
  font-size: 28px;
}

.d8-root .alignment-board .sliding-row .place-row {
  width: 100%;
}

.d8-root .slide-position-0 {
  transform: translateX(-58px);
  opacity: .55;
}

.d8-root .slide-position-1,
.d8-root .slide-position-2 {
  transform: translateX(0);
  opacity: 1;
}

.d8-root .alignment-guide {
  width: min(570px, 100%);
  margin: -4px auto 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  opacity: 0;
  transition: opacity .35s ease;
}

.d8-root .alignment-guide.guide-visible {
  opacity: 1;
}

.d8-root .alignment-guide span {
  height: 28px;
  display: grid;
  place-items: center;
  color: var(--accent);
  font-weight: 900;
}

.d8-root .alignment-board > strong {
  display: block;
  margin-top: 4px;
  color: var(--success);
  font: 900 31px/1 JetBrains Mono, monospace;
  text-align: center;
  opacity: 0;
  transform: translateY(-8px);
  transition: .4s ease;
}

.d8-root .answer-visible {
  opacity: 1 !important;
  transform: translate(0, 0) !important;
}

.d8-root .optional-guess {
  width: min(680px, 100%);
  margin-inline: auto;
}

.d8-root .optional-guess > span {
  display: block;
  margin-bottom: 8px;
  color: var(--ink-3);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.d8-root .guess-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.d8-root .guess-chip {
  padding: 9px 13px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--ink);
  background: var(--paper);
  cursor: pointer;
}

.d8-root .guess-chip.is-correct {
  border-color: var(--success);
  color: var(--success);
  background: var(--success-soft);
}

.d8-root .guess-chip.is-wrong {
  border-color: var(--warning);
  color: var(--warning);
  background: var(--warning-soft);
}

.d8-root .guess-good,
.d8-root .guess-hint {
  display: block;
  width: min(680px, 100%);
  margin: 9px auto 0;
  color: var(--success);
  line-height: 1.4;
}

.d8-root .guess-hint {
  color: var(--warning);
}

.d8-root .equation-focus {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font: 850 clamp(26px, 5vw, 42px)/1 JetBrains Mono, monospace;
}

.d8-root .equation-focus b {
  color: var(--accent);
}

.d8-root .unit-dots {
  width: min(430px, 100%);
  margin: 22px auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 6px;
}

.d8-root .unit-dots i {
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--cyan);
  transition: transform .55s ease, background .55s ease;
}

.d8-root .unit-dots.dots-bundled i:nth-child(-n+10) {
  background: var(--accent);
  transform: translateY(-8px) scale(.88);
}

.d8-root .exchange-result {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transform: translateY(10px);
  transition: .45s ease;
}

.d8-root .exchange-result span {
  padding: 10px 12px;
  border-radius: 11px;
  color: var(--navy);
  background: var(--cyan-soft);
  font-weight: 850;
}

.d8-root .exchange-result .ten-bundle {
  color: var(--accent);
  background: var(--accent-soft);
}

.d8-root .final-equation {
  margin-top: 20px;
  color: var(--navy);
  font: 800 clamp(22px, 4vw, 32px)/1.2 JetBrains Mono, monospace;
  text-align: center;
  opacity: 0;
  transform: translateY(10px);
  transition: .45s ease;
}

.d8-root .final-equation b {
  color: var(--success);
}

.d8-root .donor-strip {
  display: grid;
  grid-template-columns: repeat(5, minmax(54px, 1fr));
  gap: 7px;
}

.d8-root .donor-strip button {
  min-width: 0;
  padding: 8px 3px;
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--navy);
  background: var(--paper);
  cursor: pointer;
  transition: .3s ease;
}

.d8-root .donor-strip small {
  min-height: 26px;
  display: block;
  color: var(--ink-3);
  font-size: 9px;
}

.d8-root .donor-strip b {
  display: block;
  font: 900 28px/1 JetBrains Mono, monospace;
}

.d8-root .donor-strip .guessed {
  border-color: var(--warning);
}

.d8-root .donor-strip .auto-donor {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
  box-shadow: 0 0 0 4px rgba(255, 91, 53, .12);
}

.d8-root .donor-strip .zero-donor:not(.auto-donor) {
  color: var(--ink-3);
}

.d8-root .borrow-arrow {
  margin: 18px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  opacity: 0;
  transform: translateY(-10px);
  transition: .45s ease;
}

.d8-root .borrow-arrow span {
  padding: 10px 14px;
  border-radius: 12px;
  color: var(--accent);
  background: var(--accent-soft);
  font: 850 18px/1 JetBrains Mono, monospace;
}

.d8-root .borrow-arrow i {
  color: var(--accent);
  font-size: 28px;
}

.d8-root .borrow-units {
  margin-top: 18px;
  text-align: center;
  opacity: 0;
  transform: translateY(8px);
  transition: .4s ease;
}

.d8-root .borrow-units > b {
  font: 850 24px/1 JetBrains Mono, monospace;
}

.d8-root .borrow-units > div {
  width: min(330px, 100%);
  margin: 12px auto 0;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  gap: 5px;
}

.d8-root .borrow-units i {
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--lime);
}

.d8-root .borrow-units i.taken {
  opacity: .2;
  transform: scale(.75);
}

.d8-root .chain-arc {
  height: 56px;
  margin-top: -2px;
  opacity: 0;
}

.d8-root .chain-arc svg {
  width: 100%;
  height: 100%;
}

.d8-root .chain-arc path {
  fill: none;
  stroke: var(--accent);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 620;
  stroke-dashoffset: 620;
}

.d8-root .chain-arc.chain-running {
  opacity: 1;
}

.d8-root .chain-arc.chain-running path {
  animation: drawChain 1.2s ease forwards;
}

.d8-root .state-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 7px;
  opacity: 0;
  transform: translateY(10px);
  transition: .45s ease;
}

.d8-root .state-row span {
  min-width: 0;
  padding: 8px 3px;
  border-radius: 12px;
  color: var(--navy);
  background: var(--cyan-soft);
  text-align: center;
}

.d8-root .state-row small {
  min-height: 25px;
  display: block;
  color: var(--ink-3);
  font-size: 9px;
}

.d8-root .state-row b {
  font: 900 25px/1 JetBrains Mono, monospace;
}

.d8-root .strategy-scene {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.d8-root .strategy-card {
  min-height: 228px;
  padding: 22px;
  border-top: 5px solid var(--cyan);
  border-radius: 18px;
  background: var(--paper);
  box-shadow: 0 16px 35px rgba(23, 59, 82, .08);
  opacity: .45;
  transform: translateY(10px);
  transition: .45s ease;
}

.d8-root .strategy-card.strategy-live {
  opacity: 1;
  transform: none;
}

.d8-root .strategy-card > span {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: var(--cyan);
  background: var(--cyan-soft);
  font-size: 27px;
  font-weight: 900;
}

.d8-root .strategy-card h3 {
  margin: 14px 0 7px;
  font-family: "Source Serif 4", Georgia, serif;
  font-size: 26px;
}

.d8-root .strategy-card p {
  min-height: 46px;
  margin: 0 0 14px;
  color: var(--ink-2);
  line-height: 1.45;
}

.d8-root .strategy-card strong {
  display: block;
  color: var(--navy);
  font: 800 16px/1.45 JetBrains Mono, monospace;
  opacity: 0;
  transform: translateY(8px);
  transition: .4s ease;
}

.d8-root .strategy-inverse {
  border-color: var(--accent);
}

.d8-root .strategy-inverse > span {
  color: var(--accent);
  background: var(--accent-soft);
}

.d8-root .captions {
  width: min(760px, 100%);
  margin: 20px auto 0;
  display: grid;
  gap: 7px;
}

.d8-root .captions p {
  margin: 0;
  padding: 9px 12px;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 8px;
  border-left: 3px solid transparent;
  border-radius: 0 10px 10px 0;
  color: var(--ink-3);
  font-size: 13px;
  line-height: 1.45;
  transition: .3s ease;
}

.d8-root .captions p.caption-active {
  border-left-color: var(--accent);
  color: var(--ink);
  background: var(--accent-soft);
}

.d8-root .captions p.caption-done {
  color: var(--ink-2);
}

.d8-root .captions p span {
  color: var(--success);
  font-weight: 900;
}

.d8-root .hook-terminals {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.d8-root .terminal {
  position: relative;
  min-height: 260px;
  padding: 18px;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 20px;
  color: #EAF7FA;
  background: var(--navy);
  text-align: left;
  cursor: pointer;
  transition: transform .25s ease, border-color .25s ease;
}

.d8-root .terminal:hover,
.d8-root .terminal:focus-visible {
  transform: translateY(-3px);
}

.d8-root .terminal-picked {
  border-color: var(--accent);
}

.d8-root .terminal > span {
  display: block;
  color: #8FE5F3;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.d8-root .terminal > small {
  display: block;
  margin: 7px 0 14px;
  color: #C1D7DF;
}

.d8-root .terminal-column {
  width: min(220px, 100%);
  margin: 0 auto;
  display: grid;
  justify-items: end;
  gap: 4px;
  font: 800 clamp(20px, 4vw, 29px)/1.25 JetBrains Mono, monospace;
}

.d8-root .terminal-column i {
  width: 100%;
  height: 2px;
  background: #8FB1BE;
}

.d8-root .terminal-column strong {
  color: #A7E34C;
}

.d8-root .terminal-wrong .terminal-column strong {
  color: #FF9B82;
}

.d8-root .terminal em {
  display: block;
  margin-top: 13px;
  color: #C1D7DF;
  font-size: 12px;
  font-style: normal;
  text-align: center;
  opacity: .45;
}

.d8-root .terminal em.units-lit {
  color: #A7E34C;
  opacity: 1;
  animation: softPulse 1.2s ease-in-out infinite;
}

.d8-root .wrong-digit-cards {
  width: min(235px, 100%);
  margin: -3px auto 8px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
}

.d8-root .wrong-digit-cards i {
  min-height: 35px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 7px;
  color: #FFFFFF;
  font: 800 16px/1 JetBrains Mono, monospace;
  font-style: normal;
}

.d8-root .wrong-digit-cards i.misplaced-digit {
  border-color: #FF9B82;
  color: #FF9B82;
  box-shadow: 0 0 0 3px rgba(255, 155, 130, .18);
}

.d8-root .choice-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.d8-root .hook-choice-grid {
  margin-top: 14px;
}

.d8-root .choice-button {
  min-height: 54px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
  color: var(--ink);
  background: var(--paper);
  font-weight: 750;
  text-align: left;
  cursor: pointer;
  transition: .25s ease;
}

.d8-root .choice-button:hover,
.d8-root .choice-button:focus-visible {
  border-color: var(--cyan);
  transform: translateY(-2px);
}

.d8-root .choice-button.choice-correct {
  border-color: var(--success);
  color: var(--success);
  background: var(--success-soft);
}

.d8-root .choice-button.choice-wrong {
  border-color: var(--warning);
  color: var(--warning);
  background: var(--warning-soft);
}

.d8-root .practice-options {
  width: min(760px, 100%);
  margin-inline: auto;
}

.d8-root .visual-options {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.d8-root .visual-options .choice-button {
  padding: 8px;
}

.d8-root .mini-column {
  position: relative;
  padding: 8px 3px 4px;
}

.d8-root .mini-column > small {
  display: block;
  margin-bottom: 6px;
  color: var(--ink-3);
  text-align: center;
}

.d8-root .mini-column > div {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 2px;
}

.d8-root .mini-column span {
  min-width: 0;
  min-height: 27px;
  display: grid;
  place-items: center;
  border-radius: 5px;
  background: #F1F4F5;
  font: 800 14px/1 JetBrains Mono, monospace;
}

.d8-root .mini-column > b {
  position: absolute;
  left: 0;
  top: 76px;
  color: var(--accent);
}

.d8-root .mini-column > i {
  display: block;
  height: 2px;
  margin-top: 4px;
  background: var(--navy);
}

.d8-root .feedback {
  width: min(760px, 100%);
  margin: 14px auto 0;
  padding: 12px 14px;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: start;
  gap: 8px;
  border-radius: 13px;
}

.d8-root .feedback-correct {
  color: var(--success);
  background: var(--success-soft);
}

.d8-root .feedback-wrong {
  color: var(--warning);
  background: var(--warning-soft);
}

.d8-root .feedback > span {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, .72);
  font-weight: 900;
}

.d8-root .feedback p {
  margin: 3px 0 0;
  line-height: 1.48;
}

.d8-root .repair-animation {
  width: min(680px, 100%);
  margin: 16px auto 0;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-left: 4px solid var(--success);
  border-radius: 0 14px 14px 0;
  background: var(--success-soft);
}

.d8-root .repair-animation span,
.d8-root .repair-animation strong {
  font: 800 17px/1.4 JetBrains Mono, monospace;
}

.d8-root .repair-animation i {
  color: var(--accent);
  font-style: normal;
  animation: carryDrop 1s ease both;
}

.d8-root .build-board {
  width: min(760px, 100%);
  margin-inline: auto;
}

.d8-root .build-slots {
  display: grid;
  grid-template-columns: repeat(5, minmax(50px, 1fr));
  gap: 8px;
}

.d8-root .build-slot {
  min-width: 0;
  min-height: 84px;
  padding: 7px 3px;
  border: 2px dashed #B8C6CC;
  border-radius: 14px;
  color: var(--navy);
  background: rgba(255, 255, 255, .72);
  cursor: pointer;
}

.d8-root .build-slot small {
  min-height: 28px;
  display: block;
  color: var(--ink-3);
  font-size: 9px;
}

.d8-root .build-slot b {
  display: block;
  font: 900 clamp(21px, 5vw, 32px)/1 JetBrains Mono, monospace;
}

.d8-root .build-slot.slot-wrong {
  border-color: var(--warning);
  color: var(--warning);
  background: var(--warning-soft);
  animation: gentleShake .35s ease;
}

.d8-root .build-slot.slot-correct {
  border-style: solid;
  border-color: var(--success);
  color: var(--success);
  background: var(--success-soft);
}

.d8-root .card-pool {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 9px;
}

.d8-root .number-card {
  min-width: 55px;
  padding: 9px 13px;
  border: 1px solid var(--cyan);
  border-radius: 12px;
  color: var(--cyan);
  background: var(--cyan-soft);
  font: 900 22px/1 JetBrains Mono, monospace;
  cursor: pointer;
}

.d8-root .number-card.card-used {
  opacity: .22;
}

.d8-root .tap-help {
  margin: 11px 0 0;
  color: var(--ink-3);
  font-size: 12px;
  text-align: center;
}

.d8-root .build-result {
  margin-top: 14px;
  padding: 14px;
  border-radius: 13px;
  color: var(--success);
  background: var(--success-soft);
  font: 800 clamp(19px, 4vw, 27px)/1.3 JetBrains Mono, monospace;
  text-align: center;
}

.d8-root .matching-board {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 38px minmax(0, 1fr);
  gap: 10px;
  align-items: stretch;
}

.d8-root .match-column {
  display: grid;
  grid-template-rows: auto repeat(3, minmax(76px, auto));
  gap: 9px;
}

.d8-root .match-column > span {
  color: var(--ink-3);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.d8-root .match-card {
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 13px;
  color: var(--navy);
  background: var(--paper);
  font: 750 clamp(12px, 2vw, 15px)/1.4 JetBrains Mono, monospace;
  text-align: left;
  cursor: pointer;
}

.d8-root .match-card.match-selected {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.d8-root .match-card.match-done {
  border-color: var(--success);
  color: var(--success);
  background: var(--success-soft);
  opacity: .82;
}

.d8-root .match-arrows {
  padding-top: 29px;
  display: grid;
  grid-template-rows: repeat(3, minmax(76px, auto));
  place-items: center;
  gap: 9px;
  color: var(--accent);
  font-size: 23px;
}

.d8-root .library-scene {
  width: min(650px, 100%);
  margin-inline: auto;
  display: grid;
  justify-items: center;
  gap: 14px;
}

.d8-root .books-visual {
  width: 100%;
  min-height: 130px;
  padding: 22px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  border-left: 5px solid var(--cyan);
  border-radius: 0 18px 18px 0;
  background: linear-gradient(135deg, var(--paper), var(--cyan-soft));
}

.d8-root .books-visual span,
.d8-root .books-visual i,
.d8-root .books-visual b {
  font: 900 clamp(22px, 5vw, 34px)/1 JetBrains Mono, monospace;
  text-align: center;
}

.d8-root .books-visual i {
  color: var(--accent);
  font-size: clamp(17px, 4vw, 25px);
  font-style: normal;
}

.d8-root .books-visual b {
  color: var(--success);
}

.d8-root .estimate-support {
  padding: 9px 13px;
  border-radius: 999px;
  color: var(--cyan);
  background: var(--cyan-soft);
  font: 800 14px/1.2 JetBrains Mono, monospace;
}

.d8-root .numeric-answer {
  width: min(310px, 100%);
}

.d8-root .numeric-answer > span {
  display: block;
  margin-bottom: 6px;
  color: var(--ink-2);
  font-size: 12px;
  font-weight: 850;
}

.d8-root .numeric-answer input {
  width: 100%;
  min-height: 58px;
  padding: 10px 15px;
  border: 2px solid var(--line);
  border-radius: 14px;
  color: var(--navy);
  background: var(--paper);
  font: 850 25px/1 JetBrains Mono, monospace;
  text-align: center;
  outline: none;
}

.d8-root .numeric-answer input:focus {
  border-color: var(--cyan);
  box-shadow: 0 0 0 4px rgba(22, 143, 163, .12);
}

.d8-root .summary-scene {
  display: grid;
  gap: 12px;
}

.d8-root .finale-heading {
  padding: 12px 16px;
  display: grid;
  gap: 4px;
  border-left: 5px solid var(--orange);
  border-radius: 0 17px 17px 0;
  background: rgba(255, 255, 255, .78);
  box-shadow: 0 8px 22px var(--shadow);
}

.d8-root .finale-heading > span {
  color: var(--orange);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .11em;
}

.d8-root .finale-heading h1 {
  margin: 0;
  color: var(--ink);
  font: 800 clamp(21px, 3.3vw, 29px)/1.08 Source Serif 4, Georgia, serif;
}

.d8-root .finale-heading p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 11px;
  font-weight: 750;
  line-height: 1.35;
}

.d8-root .finale-main-grid {
  display: grid;
  grid-template-columns: minmax(260px, .8fr) minmax(0, 1.2fr);
  gap: 12px;
  align-items: stretch;
}

.d8-root .finale-payoff-card,
.d8-root .finale-mastery-card {
  min-width: 0;
  padding: 14px;
  border-radius: 19px;
  background: rgba(255, 255, 255, .74);
  box-shadow: 0 8px 22px var(--shadow);
}

.d8-root .finale-payoff-card {
  display: grid;
  align-content: center;
  gap: 9px;
}

.d8-root .finale-section-kicker {
  color: var(--cyan);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .1em;
}

.d8-root .summary-rules {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
  margin-top: 9px;
}

.d8-root .summary-rule {
  min-height: 56px;
  padding: 8px 9px;
  display: grid;
  grid-template-columns: 31px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  border-left: 3px solid var(--line);
  border-radius: 0 12px 12px 0;
  background: rgba(255, 255, 255, .6);
  opacity: .3;
  transform: translateX(-10px);
  transition: .4s ease;
}

.d8-root .summary-rule.rule-visible {
  border-left-color: var(--cyan);
  background: var(--paper);
  opacity: 1;
  transform: none;
}

.d8-root .summary-rule span {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: var(--cyan);
  background: var(--cyan-soft);
  font-weight: 900;
}

.d8-root .summary-rule p {
  margin: 0;
  font-size: 11px;
  font-weight: 750;
  line-height: 1.35;
}

.d8-root .hook-repair {
  min-height: 116px;
  padding: 14px;
  display: grid;
  align-content: center;
  gap: 12px;
  border-radius: 15px;
  color: #EAF7FA;
  background: var(--navy);
  text-align: center;
}

.d8-root .hook-repair div {
  display: grid;
  gap: 10px;
}

.d8-root .hook-repair small {
  color: #B9D0D9;
}

.d8-root .moving-number {
  display: block;
  font: 800 22px/1 JetBrains Mono, monospace;
  transition: transform .8s cubic-bezier(.2, .9, .2, 1);
}

.d8-root .hook-repairing .moving-number {
  transform: translateX(28px);
}

.d8-root .hook-repair > b {
  color: #FF9B82;
  font: 900 28px/1 JetBrains Mono, monospace;
  transition: color .35s ease;
}

.d8-root .hook-repairing > b {
  color: #A7E34C;
}

.d8-root .finale-payoff-copy {
  margin: 0;
  color: var(--ink-soft);
  font-size: 10px;
  font-weight: 800;
  line-height: 1.35;
}

.d8-root .finale-reward {
  position: relative;
  min-height: 128px;
  padding: 10px 22px;
  display: grid;
  grid-template-columns: 82px 106px minmax(0, 1fr);
  align-items: center;
  gap: 15px;
  border-radius: 22px;
  color: white;
  background: var(--navy);
  opacity: .52;
  overflow: hidden;
  transform: translateY(7px);
  transition: opacity .5s ease, transform .5s ease;
}

.d8-root .finale-reward-ready {
  opacity: 1;
  transform: none;
}

.d8-root .finale-medal {
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 6px;
  color: white;
  font-size: 7px;
  font-weight: 900;
  letter-spacing: .08em;
}

.d8-root .finale-medal i {
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

.d8-root .finale-reward:not(.finale-reward-ready) .finale-medal i {
  color: #B7C3CA;
  background: radial-gradient(circle at 35% 28%, #F5F7F8, #B9C5CB 68%, #87949D);
  box-shadow: 0 0 0 7px rgba(255, 255, 255, .07);
}

.d8-root .finale-bit {
  z-index: 1;
  height: 112px;
}

.d8-root .finale-bit .g1-char {
  width: 100%;
  height: 100%;
}

.d8-root .finale-reward-copy {
  z-index: 1;
  min-width: 0;
  display: grid;
  gap: 5px;
}

.d8-root .finale-reward-copy > span {
  color: #9DEBF7;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .1em;
}

.d8-root .finale-reward-copy > strong {
  font: 800 clamp(18px, 2.4vw, 25px)/1.08 Source Serif 4, Georgia, serif;
}

.d8-root .finale-reward-copy > small {
  color: rgba(255, 255, 255, .7);
  font-size: 10px;
  font-weight: 800;
}

.d8-root .finale-status { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 8px; }
.d8-root .finale-status > b { color: #FFC23C; font: 900 20px/1 JetBrains Mono, monospace; }
.d8-root .finale-status > span { display: grid; gap: 2px; color: white; font-size: 9px; font-weight: 850; }
.d8-root .finale-status small { color: rgba(255, 255, 255, .68); font-size: 8px; }

.d8-root .finale-confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.d8-root .finale-confetti i {
  position: absolute;
  width: 6px;
  height: 10px;
  border-radius: 2px;
  background: var(--orange);
  animation: d8FinaleConfetti 1.2s cubic-bezier(.16, 1, .3, 1) both;
}

.d8-root .finale-confetti i:nth-child(1) { left: 8%; top: 12%; rotate: 17deg; }
.d8-root .finale-confetti i:nth-child(2) { left: 22%; top: 72%; background: #FFC23C; rotate: -24deg; }
.d8-root .finale-confetti i:nth-child(3) { left: 38%; top: 18%; background: #9DEBF7; rotate: 35deg; }
.d8-root .finale-confetti i:nth-child(4) { left: 51%; top: 76%; background: #A7E34C; rotate: -12deg; }
.d8-root .finale-confetti i:nth-child(5) { left: 66%; top: 13%; background: #FFC23C; rotate: 28deg; }
.d8-root .finale-confetti i:nth-child(6) { left: 78%; top: 70%; background: #9DEBF7; rotate: -30deg; }
.d8-root .finale-confetti i:nth-child(7) { left: 89%; top: 20%; background: #A7E34C; rotate: 12deg; }
.d8-root .finale-confetti i:nth-child(8) { left: 95%; top: 67%; rotate: -18deg; }

.d8-root .bridge {
  padding: 11px 15px;
  display: grid;
  gap: 3px;
  border-radius: 13px;
  color: white;
  background: var(--navy);
  opacity: 0;
  transform: translateY(8px);
  transition: .4s ease;
}

.d8-root .bridge.bridge-visible {
  opacity: 1;
  transform: none;
}

.d8-root .bridge > span {
  color: #9DEBF7;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .1em;
}

.d8-root .bridge > strong {
  font: 750 14px/1.25 Source Serif 4, Georgia, serif;
}

@keyframes bitAntenna {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(5deg); }
}

@keyframes d8FinaleConfetti {
  from { opacity: 0; translate: 0 -14px; rotate: 0deg; }
  to { opacity: .82; }
}

@keyframes bitWave {
  0%, 100% { transform: rotate(0); }
  50% { transform: rotate(-12deg); }
}

@keyframes bitWaveLeft {
  0%, 100% { transform: rotate(0); }
  50% { transform: rotate(12deg); }
}

@keyframes awkwardHands {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(2px); }
}

@keyframes drawChain {
  to { stroke-dashoffset: 0; }
}

@keyframes softPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}

@keyframes gentleShake {
  0%, 100% { transform: translateX(0); }
  30% { transform: translateX(-4px); }
  65% { transform: translateX(4px); }
}

@keyframes carryDrop {
  from { transform: translateY(-12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.d8-root .preview-language {
  position: fixed;
  top: 9px;
  right: 9px;
  z-index: 30;
  display: flex;
  gap: 3px;
  padding: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .94);
  box-shadow: 0 8px 20px -14px rgba(58, 53, 48, .6);
}

.d8-root .preview-language button {
  min-height: 0;
  padding: 4px 9px;
  border: 0;
  border-radius: 999px;
  color: var(--ink-2);
  background: transparent;
  cursor: pointer;
  font-size: 10px;
  font-weight: 900;
}

.d8-root .preview-language .preview-active {
  color: #FFFFFF;
  background: var(--accent);
}

@media (max-height: 780px) {
  .d8-root .stage-content { padding-top: 8px; padding-bottom: 8px; }
  .d8-root .stage-nav { min-height: 58px; padding-block: 6px; }
  .d8-root .heading { margin-bottom: 8px; gap: 10px; }
  .d8-root .semantic-scene, .d8-root .question-card { gap: 8px; }
  .d8-root .choice-grid { gap: 8px; }
  .d8-root .choice-button { min-height: 54px; padding: 8px 10px; }
  .d8-root .feedback { min-height: 48px; padding-block: 8px; }
  .d8-root .hook-stage, .d8-root .hook-scene { min-height: 180px; }
  .d8-root .matching-board, .d8-root .build-board { gap: 8px; }
}

@media (max-width: 639px) {
  .d8-root .stage-header {
    padding: 60px 12px 8px;
  }

  .d8-root .screen-type {
    display: none;
  }

  .d8-root .stage-chrome,
  .d8-root .chrome-title {
    align-items: flex-start;
  }

  .d8-root .chrome-title > span:last-child {
    overflow: visible;
    white-space: normal;
    text-overflow: clip;
    line-height: 1.2;
  }

  .d8-root .stage-content {
    padding: 10px 14px 8px;
  }

  .d8-root .stage-nav {
    min-height: 68px;
    padding: 9px 12px;
  }

  .d8-root .button {
    min-width: 112px;
    padding-inline: 13px;
    font-size: 14px;
  }

  .d8-root .heading {
    margin-bottom: 15px;
  }

  .d8-root .heading-with-bit {
    min-height: 118px;
    grid-template-columns: minmax(0, 1fr) 86px;
    gap: 8px;
  }

  .d8-root .heading-with-small-bit {
    min-height: 80px;
    grid-template-columns: minmax(0, 1fr) 62px;
  }

  .d8-root .bit-shell,
  .d8-root .g1-char {
    width: 82px;
    height: 104px;
  }

  .d8-root .bit-shell-small {
    width: 58px;
    height: 73px;
  }

  .d8-root .bit-shell-small .g1-char {
    width: 58px;
    height: 73px;
  }

  .d8-root .mini-coach {
    grid-template-columns: 60px auto;
    margin-top: 3px;
  }

  .d8-root .mini-coach .g1-char {
    width: 60px;
    height: 74px;
  }

  .d8-root .mini-coach > span {
    padding: 6px 8px;
    font-size: 11px;
  }

  .d8-root h1 {
    font-size: clamp(27px, 9vw, 36px);
  }

  .d8-root .heading p {
    font-size: 14px;
    line-height: 1.45;
  }

  .d8-root .hook-terminals,
  .d8-root .strategy-scene,
  .d8-root .summary-scene,
  .d8-root .finale-main-grid {
    grid-template-columns: 1fr;
  }

  .d8-root .hook-terminals {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .d8-root .terminal {
    min-height: 176px;
    padding: 10px 8px;
  }

  .d8-root .terminal > span {
    font-size: 9px;
    line-height: 1.2;
  }

  .d8-root .terminal > small {
    margin: 4px 0 7px;
    font-size: 9px;
  }

  .d8-root .terminal-column {
    gap: 2px;
    font-size: 16px;
    line-height: 1.18;
  }

  .d8-root .terminal em {
    margin-top: 7px;
    font-size: 9px;
  }

  .d8-root .wrong-digit-cards {
    margin: -1px auto 5px;
    gap: 2px;
  }

  .d8-root .wrong-digit-cards i {
    min-height: 28px;
    font-size: 12px;
  }

  .d8-root .hook-choice-grid,
  .d8-root .choice-grid {
    grid-template-columns: 1fr;
  }

  .d8-root .visual-options {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 5px;
  }

  .d8-root .visual-options .choice-button {
    min-height: 150px;
    padding: 4px;
  }

  .d8-root .mini-column span {
    min-height: 22px;
    font-size: 11px;
  }

  .d8-root .mini-column > b {
    top: 66px;
  }

  .d8-root .column-board,
  .d8-root .alignment-board,
  .d8-root .exchange-scene,
  .d8-root .borrow-scene,
  .d8-root .zero-chain-scene {
    padding: 12px 8px;
  }

  .d8-root .place-warehouse-svg {
    height: 86px;
  }

  .d8-root .exchange-bundle-svg {
    height: 92px;
  }

  .d8-root .donor-path-svg {
    height: 82px;
  }

  .d8-root .place-row {
    gap: 3px;
  }

  .d8-root .place-row > span {
    min-height: 46px;
  }

  .d8-root .place-labels > span {
    min-height: 24px;
    font-size: 7px;
  }

  .d8-root .digit-row > span {
    font-size: 22px;
  }

  .d8-root .operator-row {
    grid-template-columns: 26px minmax(0, 1fr);
  }

  .d8-root .donor-strip {
    gap: 3px;
  }

  .d8-root .donor-strip small,
  .d8-root .state-row small {
    font-size: 7px;
  }

  .d8-root .donor-strip b,
  .d8-root .state-row b {
    font-size: 20px;
  }

  .d8-root .borrow-arrow {
    gap: 7px;
  }

  .d8-root .borrow-arrow span {
    padding: 8px;
    font-size: 14px;
  }

  .d8-root .unit-dots {
    gap: 3px;
  }

  .d8-root .matching-board {
    grid-template-columns: minmax(0, 1fr) 20px minmax(0, 1fr);
    gap: 5px;
  }

  .d8-root .match-arrows {
    padding-top: 24px;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, minmax(54px, auto));
    gap: 7px;
  }

  .d8-root .match-column {
    grid-template-rows: auto repeat(3, minmax(54px, auto));
    gap: 7px;
  }

  .d8-root .match-card {
    min-height: 54px;
    padding: 7px 6px;
    font-size: 10px;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  .d8-root .books-visual {
    grid-template-columns: 1fr;
  }

  .d8-root .finale-heading {
    padding: 10px 12px;
  }

  .d8-root .finale-heading h1 {
    font-size: 21px;
  }

  .d8-root .finale-heading p {
    font-size: 10px;
  }

  .d8-root .summary-scene .hook-repair {
    min-height: 104px;
  }

  .d8-root .finale-payoff-card,
  .d8-root .finale-mastery-card {
    padding: 10px;
  }

  .d8-root .summary-rules {
    gap: 5px;
  }

  .d8-root .summary-rule {
    min-height: 48px;
    padding: 6px;
  }

  .d8-root .summary-rule p {
    font-size: 9px;
  }

  .d8-root .finale-reward {
    min-height: 108px;
    padding: 8px 10px;
    grid-template-columns: 58px 72px minmax(0, 1fr);
    gap: 7px;
  }

  .d8-root .finale-medal i {
    width: 54px;
    height: 54px;
    font-size: 23px;
  }

  .d8-root .finale-bit {
    height: 88px;
  }

  .d8-root .finale-reward-copy > span {
    font-size: 7px;
  }

  .d8-root .finale-reward-copy > strong {
    font-size: 14px;
  }

  .d8-root .finale-reward-copy > small {
    font-size: 8px;
  }

  .d8-root .bridge {
    grid-column: auto;
  }
}

@media (max-width: 390px) {
  .d8-root .stage-content {
    padding-inline: 10px;
  }

  .d8-root .stage-nav {
    gap: 7px;
  }

  .d8-root .button {
    min-width: 102px;
    font-size: 13px;
  }

  .d8-root .chrome-actions {
    gap: 5px;
  }

  .d8-root .build-slots {
    gap: 4px;
  }

  .d8-root .build-slot {
    min-height: 76px;
    padding-inline: 1px;
  }

  .d8-root .build-slot small {
    font-size: 7px;
  }

  .d8-root .number-card {
    min-width: 48px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .d8-root *,
  .d8-root *::before,
  .d8-root *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }

  .d8-root .summary-rule,
  .d8-root .finale-reward,
  .d8-root .bridge {
    opacity: 1 !important;
    transform: none !important;
  }
}
`;
