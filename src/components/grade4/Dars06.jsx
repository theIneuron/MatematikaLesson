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
.g4-title-claim{width:100%;min-height:76px;padding:10px 16px;border:0;border-radius:17px;display:grid;grid-template-columns:42px 1fr;align-items:center;gap:12px;color:#fff;background:linear-gradient(135deg,#0E6978,#173B52);box-shadow:0 22px 42px -25px rgba(14,105,120,.9);text-align:left;cursor:pointer;transition:transform .5s ease,box-shadow .5s ease}.g4-title-claim>span{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);font-size:19px}.g4-title-claim>strong{font:750 16px/1.2 'Source Serif 4',Georgia,serif}.g4-title-claim:hover:not(:disabled){transform:translateY(-2px)}.g4-title-claim:disabled{cursor:default;filter:saturate(.55);opacity:.68}
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
  useEffect(() => {
    if (!active || !playNow || shownRef.current || typeof window === 'undefined') return undefined;
    let timer;
    const frame = window.requestAnimationFrame(() => {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      shownRef.current = true;
      setVisible(true);
      timer = window.setTimeout(() => setVisible(false), reduced ? 120 : 3900);
    });
    return () => { window.cancelAnimationFrame(frame); window.clearTimeout(timer); };
  }, [active, playNow]);
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
// 4-SINF · Dars06 · Sonlarning xonalari va sinflari
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
  "s0": {
    "eyebrow": {
      "ru": "Миссия данных",
      "uz": "Ma'lumotlar missiyasi",
      "en": "Data mission",
    },
    "title": {
      "ru": "Собираем полный пакет Lumo City",
      "uz": "Lumo City uchun to'liq paket yig'amiz",
      "en": "Building the complete Lumo City package",
    },
    "lead": {
      "ru": "Городской центр получил число 704 018. Чтобы открыть маршрут, нужно понять его классы, разряды и связи между представлениями.",
      "uz": "Shahar markazi 704 018 sonini oldi. Yo'nalishni ochish uchun uning sinflari, xonalari va ko'rinishlari orasidagi bog'lanishni tushunish kerak.",
      "en": "The city centre received the number 704,018. To open the route, identify its classes and places and connect its different forms.",
    },
    "instruction": {
      "ru": "Какие действия войдут в полный пакет?",
      "uz": "To'liq paketga qaysi harakatlar kiradi?",
      "en": "What actions will be included in the full package?",
    },
    "model": {
      "kind": "city",
      "badge": {
        "ru": "Пакет данных",
        "uz": "Ma'lumotlar paketi",
        "en": "Data packet",
      },
      "number": "704 018",
      "rows": [
        {
          "label": {
            "ru": "структура",
            "uz": "tuzilishi",
            "en": "structure",
          },
          "value": {
            "ru": "КЛАССЫ И РАЗРЯДЫ",
            "uz": "SINFLAR VA XONALAR",
            "en": "CLASSES AND PLACES",
          }
        },
        {
          "label": {
            "ru": "обработка",
            "uz": "ishlov",
            "en": "processing",
          },
          "value": {
            "ru": "? · ? · ? · ?",
            "uz": "? · ? · ? · ?",
            "en": "? · ? · ? · ?",
          }
        }
      ]
    },
    "result": {
      "ru": "прочитать, разложить, сравнить и округлить",
      "uz": "o'qish, yoyish, taqqoslash va yaxlitlash",
      "en": "read, expand, compare and round",
    },
    "options": [
      {
        "ru": "Прочитать, разложить, сравнить и округлить число",
        "uz": "Sonni o'qish, yoyish, taqqoslash va yaxlitlash",
        "en": "Read, expand, compare and round the number",
      },
      {
        "ru": "Только прочитать число вслух",
        "uz": "Faqat sonni ovoz chiqarib o'qish",
        "en": "Only read the number aloud",
      },
      {
        "ru": "Удалить нули и работать с оставшимися цифрами",
        "uz": "Nollarni olib tashlab, qolgan raqamlar bilan ishlash",
        "en": "Remove the zeros and work with the remaining digits",
      },
      {
        "ru": "Сразу округлить число, не проверяя разряды",
        "uz": "Xonalarni tekshirmasdan sonni darhol yaxlitlash",
        "en": "Round the number immediately without checking its places",
      },
    ],
    "correctIndex": 0,
    "wrong": [
      null,
      {
        "ru": "Одного чтения недостаточно: пакет должен связать все представления числа.",
        "uz": "Faqat o'qish yetarli emas: paket sonning barcha ko'rinishlarini bog'lashi kerak.",
        "en": "Reading alone is not enough: the packet must connect all forms of the number.",
      },
      {
        "ru": "Нули удерживают разряды, поэтому удалять их нельзя.",
        "uz": "Nollar xonalarni saqlaydi, shuning uchun ularni olib tashlab bo'lmaydi.",
        "en": "Zeros hold place values, so they must not be removed.",
      },
      {
        "ru": "Перед округлением нужно определить разряд и понять структуру числа.",
        "uz": "Yaxlitlashdan oldin xonani aniqlash va son tuzilishini tushunish kerak.",
        "en": "Before rounding, identify the target place and understand the number's structure.",
      },
    ],
    "correctText": {
      "ru": "Полный пакет объединяет чтение, разрядный состав, сравнение и округление. Все действия опираются на место каждой цифры.",
      "uz": "To'liq paket o'qish, xona tarkibi, taqqoslash va yaxlitlashni birlashtiradi. Barcha harakatlar har bir raqamning o'rniga tayanadi.",
      "en": "The complete package combines reading, place-value composition, comparison and rounding. Every action depends on the place of each digit.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Центр Lumo City получил число семьсот четыре тысячи восемнадцать. Биту нужно выбрать полную цепочку проверки, которая сохранит место каждой цифры."
        ],
        "uz": [
          "Lumo City markazi yetti yuz to'rt ming o'n sakkiz sonini oldi. Bit har bir raqam o'rnini saqlaydigan to'liq tekshirish zanjirini tanlashi kerak."
        ],
        "en": [
          "The Lumo City centre received the number seven hundred and four thousand and eighteen. Bit must choose a complete checking chain that preserves the place of every digit."
        ],
      },
      "on_correct": {
        "ru": "Полный пакет начинается с места цифры. Оно помогает прочитать, разложить, сравнить и округлить число.",
        "uz": "To'liq paket raqam o'rnidan boshlanadi. U sonni o'qish, yoyish, taqqoslash va yaxlitlashga yordam beradi.",
        "en": "The complete packet begins with the place of each digit. It helps you read, expand, compare and round the number.",
      },
      "on_wrong": [
        null,
        {
          "ru": "Полный пакет включает несколько связанных действий, а не только чтение.",
          "uz": "To'liq paket faqat o'qishni emas, bir nechta bog'langan harakatni o'z ichiga oladi.",
          "en": "A complete packet includes several connected actions, not only reading.",
        },
        {
          "ru": "Нули показывают места цифр и должны остаться в записи.",
          "uz": "Nollar raqamlarning o'rnini ko'rsatadi va yozuvda qolishi kerak.",
          "en": "Zeros show the places of digits and must remain in the notation.",
        },
        {
          "ru": "Сначала проверь разряды, затем выбирай действие.",
          "uz": "Avval xonalarni tekshiring, keyin amalni tanlang.",
          "en": "Check the place values first, then choose the operation.",
        },
      ]
    }
  },
  "s1": {
    "eyebrow": {
      "ru": "Классы и масштаб",
      "uz": "Sinflar va ko'lam",
      "en": "Classes and scale",
    },
    "title": {
      "ru": "Две тройки разрядов и рост в десять раз",
      "uz": "Ikki xona uchligi va o'n marta o'sish",
      "en": "Two classes of three places and tenfold growth",
    },
    "lead": {
      "ru": "Каждый класс повторяет сотни, десятки и единицы. Но один шаг цифры влево сразу меняет масштаб её значения.",
      "uz": "Har bir sinf yuzlik, o'nlik va birlikni takrorlaydi. Ammo raqamning chapga bir qadami uning qiymat ko'lamini darhol o'zgartiradi.",
      "en": "Each class repeats hundreds, tens and ones, but one step to the left immediately changes the scale of its value.",
    },
    "instruction": {
      "ru": "Как связаны классы, разряды и значения одной цифры?",
      "uz": "Sinflar, xonalar va bitta raqam qiymatlari qanday bog'langan?",
      "en": "How are classes, places and the value of a digit connected?",
    },
    "model": {
      "kind": "shift",
      "badge": {
        "ru": "Карта шести разрядов",
        "uz": "Oltita xona xaritasi",
        "en": "Six-place map",
      },
      "number": "7 → 70 → 700 → 7 000 → 70 000 → 700 000",
      "groups": [
        {
          "value": "704",
          "label": {
            "ru": "класс тысяч",
            "uz": "minglar sinfi",
            "en": "thousands class",
          },
          "tone": "cyan"
        },
        {
          "value": "018",
          "label": {
            "ru": "класс единиц",
            "uz": "birlar sinfi",
            "en": "ones class",
          },
          "tone": "accent"
        }
      ],
      "steps": [
        {
          "ru": "единицы",
          "uz": "birlar"
        , en: "ones"},
        {
          "ru": "десятки",
          "uz": "o'nlar"
        , en: "tens"},
        {
          "ru": "сотни",
          "uz": "yuzlar",
          "en": "hundreds",
        },
        {
          "ru": "тысячи",
          "uz": "minglar",
          "en": "thousands",
        },
        {
          "ru": "десятки тысяч",
          "uz": "o'n minglar"
        , en: "ten-thousands"},
        {
          "ru": "сотни тысяч",
          "uz": "yuz minglar"
        , en: "hundred-thousands"}
      ]
    },
    "result": {
      "ru": "три разряда в классе, каждый шаг влево увеличивает значение в 10 раз",
      "uz": "sinfda uchta xona, chapga har qadam qiymatni 10 marta oshiradi",
      "en": "three places in each class; each step to the left makes the value ten times greater",
    },
    "correctText": {
      "ru": "В каждом классе повторяется тройка сотни, десятки, единицы. Соседний разряд слева в десять раз старше, поэтому место цифры задаёт её масштаб.",
      "uz": "Har bir sinfda yuzlik, o'nlik, birlik uchligi takrorlanadi. Chapdagi qo'shni xona o'n marta katta, shuning uchun raqam o'rni uning ko'lamini belgilaydi.",
      "en": "Each class repeats hundreds, tens and ones. The neighbouring place to the left has ten times the value, so the digit's place sets its scale.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Каждый класс повторяет сотни, десятки и единицы.",
          "При каждом сдвиге цифры на один разряд влево её значение становится в десять раз больше."
        ],
        "uz": [
          "Har bir sinf yuzlik, o'nlik va birlikni takrorlaydi.",
          "Raqam chapga bir xona siljiganda uning qiymati o'n marta ortadi."
        ],
        "en": [
          "Each class repeats hundreds, tens and ones.",
          "Each time a digit moves one place to the left, its value becomes ten times greater."
        ],
      },
      "on_correct": {
        "ru": "Классы группируют разряды по три, а движение между соседними разрядами меняет значение в десять раз.",
        "uz": "Sinflar xonalarni uchtadan guruhlaydi, qo'shni xonalar orasidagi siljish esa qiymatni o'n marta o'zgartiradi.",
        "en": "Correct. Classes group places in threes, and moving between neighbouring places changes the value by a factor of ten.",
      }
    }
  },
  "s2": {
    "eyebrow": {
      "ru": "Граница класса",
      "uz": "Sinf chegarasi",
      "en": "Class boundary",
    },
    "title": {
      "ru": "После 999 999 открывается новый класс",
      "uz": "999 999 dan keyin yangi sinf ochiladi",
      "en": "After 999,999, a new class opens.",
    },
    "lead": {
      "ru": "Шесть девяток заполняют классы единиц и тысяч. Ещё одна единица запускает переход через все разряды и создаёт класс миллионов.",
      "uz": "Oltita to'qqiz birliklar va minglar sinfini to'ldiradi. Yana bir birlik barcha xonalardan o'tib, millionlar sinfini yaratadi.",
      "en": "Six nines fill the ones class and the thousands class. Adding one carries through every place and creates the millions class.",
    },
    "instruction": {
      "ru": "Почему после двух заполненных троек появляется третья?",
      "uz": "Nega to'lgan ikkita uchlikdan keyin uchinchi uchlik paydo bo'ladi?",
      "en": "Why does a third class appear after two full classes?",
    },
    "model": {
      "kind": "boundary",
      "badge": {
        "ru": "ПЕРЕХОД ЧЕРЕЗ ГРАНИЦУ",
        "uz": "CHEGARADAN O'TISH",
        "en": "CROSSING A CLASS BOUNDARY",
      },
      "number": "999 999 → 1 000 000",
      "groups": [
        {
          "value": "999 | 999",
          "label": {
            "ru": "два класса заполнены",
            "uz": "ikki sinf to'lgan",
            "en": "two classes full",
          },
          "tone": "cyan"
        },
        {
          "value": "1 | 000 | 000",
          "label": {
            "ru": "открылся класс миллионов",
            "uz": "millionlar sinfi ochildi",
            "en": "millions class",
          },
          "tone": "accent"
        }
      ],
      "steps": [
        {
          "ru": "Оба знакомых класса заполнены девятками",
          "uz": "Tanish ikkala sinf to'qqizlar bilan to'lgan",
          "en": "Both familiar classes are filled with nines",
        },
        {
          "ru": "Одна единица проходит через шесть разрядов",
          "uz": "Bir birlik oltita xonadan o'tadi",
          "en": "The added one carries through six places",
        },
        {
          "ru": "Слева открывается новая тройка разрядов",
          "uz": "Chap tomonda yangi uchta xona ochiladi",
          "en": "A new group of three places opens on the left",
        }
      ]
    },
    "result": {
      "ru": "999 999 + 1 = 1 000 000",
      "uz": "999 999 + 1 = 1 000 000"
    , en: "999 999 + 1 = 1 000 000"},
    "correctText": {
      "ru": "Классы строятся тройками справа налево. Когда все разряды двух классов заполнены, следующая единица превращает их в нули и открывает слева класс миллионов.",
      "uz": "Sinflar o'ngdan chapga uchtadan tuziladi. Ikki sinfning barcha xonalari to'lganda keyingi birlik ularni nolga aylantirib, chapda millionlar sinfini ochadi.",
      "en": "Classes are built in groups of three from right to left. When every place in two classes is filled, the next one turns them into zeros and opens the millions class on the left.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Число девятьсот девяносто девять тысяч девятьсот девяносто девять заполняет оба знакомых класса до конца.",
          "Прибавляем одну единицу. Все шесть девяток превращаются в нули, а слева открывается класс миллионов."
        ],
        "uz": [
          "To'qqiz yuz to'qson to'qqiz ming to'qqiz yuz to'qson to'qqiz sonida tanish ikkala sinf ham to'liq band.",
          "Bir birlik qo'shiladi. Oltita to'qqiz nolga aylanadi va chap tomonda millionlar sinfi ochiladi."
        ],
        "en": [
          "The number nine hundred and ninety-nine thousand nine hundred and ninety-nine completely fills both familiar classes.",
          "Add one unit. All six nines become zeros, and the millions class opens on the left."
        ],
      },
      "on_correct": {
        "ru": "Граница класса работает так. Новая тройка разрядов появляется, когда предыдущие классы полностью заполнены.",
        "uz": "Sinf chegarasi shunday ishlaydi. Oldingi sinflar to'lganda chap tomonda yangi uchta xona ochiladi.",
        "en": "Correct. A class boundary works this way: a new group of three places appears when the previous classes are full.",
      }
    }
  },
  "s3": {
    "eyebrow": {
      "ru": "От записи к составу",
      "uz": "Yozuvdan tarkibga",
      "en": "From standard form to place-value composition",
    },
    "title": {
      "ru": "Читаем 704 018 и сразу раскрываем его состав",
      "uz": "704 018 ni o'qib, tarkibini darhol ochamiz",
      "en": "Read 704 018 and expand it by place value",
    },
    "lead": {
      "ru": "Деление на классы подсказывает чтение, а разрядная таблица превращает каждую ненулевую цифру в слагаемое.",
      "uz": "Sinflarga ajratish o'qishni ko'rsatadi, xona jadvali esa har bir noldan farqli raqamni qo'shiluvchiga aylantiradi.",
      "en": "Splitting the number into classes helps you read it, and a place-value chart turns each non-zero digit into an addend.",
    },
    "instruction": {
      "ru": "Как из одной записи получить чтение и развёрнутую форму?",
      "uz": "Bitta yozuvdan o'qish va yoyiq ko'rinishni qanday olamiz?",
      "en": "How can one standard form give both a reading and an expanded form?",
    },
    "model": {
      "kind": "table",
      "badge": {
        "ru": "Чтение и разложение",
        "uz": "O'qish va yoyish",
        "en": "Reading and expanded form",
      },
      "number": "704 | 018",
      "columns": [
        {
          "label": {
            "ru": "сотни тысяч",
            "uz": "yuz minglar"
          , en: "hundred-thousands"},
          "value": "7"
        },
        {
          "label": {
            "ru": "десятки тысяч",
            "uz": "o'n minglar"
          , en: "ten-thousands"},
          "value": "0"
        },
        {
          "label": {
            "ru": "тысячи",
            "uz": "minglar",
            "en": "thousands",
          },
          "value": "4"
        },
        {
          "label": {
            "ru": "сотни",
            "uz": "yuzlar",
            "en": "hundreds",
          },
          "value": "0"
        },
        {
          "label": {
            "ru": "десятки",
            "uz": "o'nlar"
          , en: "tens"},
          "value": "1"
        },
        {
          "label": {
            "ru": "единицы",
            "uz": "birlar"
          , en: "ones"},
          "value": "8"
        }
      ],
      "rows": [
        {
          "label": {
            "ru": "чтение",
            "uz": "o'qish",
            "en": "reading",
          },
          "value": {
            "ru": "семьсот четыре тысячи восемнадцать",
            "uz": "yetti yuz to'rt ming o'n sakkiz",
            "en": "seven hundred and four thousand and eighteen",
          }
        },
        {
          "label": {
            "ru": "развёрнутая запись",
            "uz": "yoyiq yozuv"
          , en: "expanded form"},
          "value": "700 000 + 4 000 + 10 + 8"
        }
      ]
    },
    "result": {
      "ru": "семьсот четыре тысячи восемнадцать; 700 000 + 4 000 + 10 + 8",
      "uz": "yetti yuz to'rt ming o'n sakkiz; 700 000 + 4 000 + 10 + 8",
      "en": "seven hundred and four thousand and eighteen; 700,000 + 4,000 + 10 + 8",
    },
    "correctText": {
      "ru": "Левая тройка читается как семьсот четыре тысячи, правая как восемнадцать. Ненулевые цифры дают четыре разрядных слагаемых.",
      "uz": "Chap uchlik yetti yuz to'rt ming, o'ng uchlik o'n sakkiz deb o'qiladi. Noldan farqli raqamlar to'rtta xona qo'shiluvchisini beradi.",
      "en": "The left class reads as seven hundred and four thousand, and the right class reads as eighteen. The non-zero digits give four place-value addends.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Сначала читаем семьсот четыре тысячи, затем восемнадцать.",
          "Семь даёт семьсот тысяч, четыре даёт четыре тысячи, единица даёт десять, восемь даёт восемь."
        ],
        "uz": [
          "Avval yetti yuz to'rt mingni, keyin o'n sakkizni o'qiymiz.",
          "Yetti yetti yuz mingni, to'rt to'rt mingni, bir o'nni, sakkiz esa sakkizni beradi."
        ],
        "en": [
          "First we read seven hundred and four thousand, then eighteen.",
          "The digit seven represents seven hundred thousand, four represents four thousand, one represents ten and eight represents eight."
        ],
      },
      "on_correct": {
        "ru": "Нули удерживают пустые места в обычной записи, но нулевые слагаемые в развёрнутой форме можно не писать.",
        "uz": "Nollar odatiy yozuvdagi bo'sh o'rinlarni saqlaydi, yoyiq yozuvda esa nol qo'shiluvchilarni yozmaslik mumkin.",
        "en": "Correct. Zeros hold empty places in standard form, but zero addends may be omitted from expanded form.",
      }
    }
  },
  "s4": {
    "eyebrow": {
      "ru": "Карта инварианта",
      "uz": "Invariant xaritasi",
      "en": "Invariant map",
    },
    "title": {
      "ru": "Четыре записи показывают одно число",
      "uz": "To'rtta ko'rinish bitta sonni ko'rsatadi",
      "en": "Four forms represent the same number",
    },
    "lead": {
      "ru": "Обычная запись, чтение, таблица разрядов и развёрнутая сумма выглядят по-разному, но сохраняют те же цифры на тех же местах.",
      "uz": "Oddiy yozuv, o'qilishi, xona jadvali va yoyiq yig'indi turlicha ko'rinadi, ammo bir xil raqamlarni o'z joyida saqlaydi.",
      "en": "Standard form, reading, a place-value chart and an expanded sum look different, but keep the same digits in the same places.",
    },
    "instruction": {
      "ru": "Что остаётся неизменным во всех четырёх формах?",
      "uz": "To'rtta ko'rinishning barchasida nima o'zgarmaydi?",
      "en": "What remains the same in all four forms?",
    },
    "model": {
      "kind": "invariant",
      "badge": {
        "ru": "ЧЕТЫРЕ РАВНЫЕ ФОРМЫ",
        "uz": "TO'RTTA TENG KO'RINISH",
        "en": "FOUR EQUIVALENT FORMS",
      },
      "number": "482 307",
      "columns": [
        {
          "label": {
            "ru": "сотни тысяч",
            "uz": "yuz minglar"
          , en: "hundred-thousands"},
          "value": "4"
        },
        {
          "label": {
            "ru": "десятки тысяч",
            "uz": "o'n minglar"
          , en: "ten-thousands"},
          "value": "8"
        },
        {
          "label": {
            "ru": "тысячи",
            "uz": "minglar",
            "en": "thousands",
          },
          "value": "2"
        },
        {
          "label": {
            "ru": "сотни",
            "uz": "yuzlar",
            "en": "hundreds",
          },
          "value": "3"
        },
        {
          "label": {
            "ru": "десятки",
            "uz": "o'nlar"
          , en: "tens"},
          "value": "0"
        },
        {
          "label": {
            "ru": "единицы",
            "uz": "birlar"
          , en: "ones"},
          "value": "7"
        }
      ],
      "rows": [
        {
          "label": {
            "ru": "чтение",
            "uz": "o'qilishi",
            "en": "reading",
          },
          "value": {
            "ru": "четыреста восемьдесят две тысячи триста семь",
            "uz": "to'rt yuz sakson ikki ming uch yuz yetti",
            "en": "four hundred and eighty-two thousand three hundred and seven",
          }
        },
        {
          "label": {
            "ru": "развёрнутая сумма",
            "uz": "yoyiq yig'indi",
            "en": "expanded sum",
          },
          "value": "400 000 + 80 000 + 2 000 + 300 + 7"
        }
      ]
    },
    "result": {
      "ru": "значения разрядов сохраняются",
      "uz": "xona qiymatlari saqlanadi",
      "en": "place values stay the same",
    },
    "correctText": {
      "ru": "Во всех четырёх формах цифра 8 означает 80 000, цифра 0 удерживает разряд десятков, а сумма разрядных значений снова даёт 482 307.",
      "uz": "To'rtta ko'rinishda ham 8 raqami 80 000 ni bildiradi, 0 raqami o'nlar xonasini saqlaydi, xona qiymatlari yig'indisi esa yana 482 307 ni beradi.",
      "en": "In all four forms, the digit 8 means 80,000, the digit 0 holds the tens place, and the sum of the place values gives 482,307 again.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Одно и то же число можно записать цифрами, прочитать словами, разместить в таблице и разложить на разрядные значения.",
          "В каждой форме восемь означает восемьдесят тысяч, а ноль сохраняет пустой разряд десятков."
        ],
        "uz": [
          "Bitta sonni raqamlar bilan yozish, so'zlar bilan o'qish, jadvalga joylash va xona qiymatlariga yoyish mumkin.",
          "Har bir ko'rinishda sakkiz sakson mingni bildiradi, nol esa bo'sh o'nlar xonasini saqlaydi."
        ],
        "en": [
          "The same number can be written in digits, read in words, placed in a chart and expanded into place values.",
          "In each form, eight means eighty thousand, and zero retains the empty tens place."
        ],
      },
      "on_correct": {
        "ru": "Если собрать все разрядные значения, снова получится четыреста восемьдесят две тысячи триста семь. Форма меняется, но число остаётся тем же.",
        "uz": "Barcha xona qiymatlari yig'ilsa, yana to'rt yuz sakson ikki ming uch yuz yetti hosil bo'ladi. Ko'rinish o'zgaradi, son esa o'sha son bo'lib qoladi.",
        "en": "Correct. Combine all the place values and you get four hundred and eighty-two thousand three hundred and seven again. The form changes, but the number stays the same.",
      }
    }
  },
  "s5": {
    "eyebrow": {
      "ru": "Сравнение и оценка",
      "uz": "Taqqoslash va baholash",
      "en": "Comparison and rounding",
    },
    "title": {
      "ru": "Сначала первое отличие, затем ближайшая тысяча",
      "uz": "Avval birinchi farq, keyin eng yaqin minglik",
      "en": "First find the first difference, then the nearest thousand",
    },
    "lead": {
      "ru": "Одна разрядная карта помогает решить две задачи: сравнить число и определить направление округления.",
      "uz": "Bitta xona xaritasi ikki vazifani bajaradi: sonni taqqoslaydi va yaxlitlash yo'nalishini aniqlaydi.",
      "en": "One place-value chart helps solve two problems: comparing the number and choosing the rounding direction.",
    },
    "instruction": {
      "ru": "Почему 704 018 больше 699 950 и округляется к 704 000?",
      "uz": "Nega 704 018 soni 699 950 dan katta va 704 000 ga yaxlitlanadi?",
      "en": "Why is 704,018 greater than 699,950 and why does it round to 704,000?",
    },
    "model": {
      "kind": "numberline",
      "badge": {
        "ru": "Два решения на одной карте",
        "uz": "Bitta xaritada ikki yechim",
        "en": "Two solutions on the same map",
      },
      "number": "704 000 ─ 704 018 ───────────── 705 000",
      "rows": [
        {
          "label": {
            "ru": "сравнение слева",
            "uz": "chapdan taqqoslash",
            "en": "comparison from the left",
          },
          "value": "7 0 4 0 1 8  >  6 9 9 9 5 0"
        },
        {
          "label": {
            "ru": "первое отличие",
            "uz": "birinchi farq",
            "en": "first difference",
          },
          "value": "7 > 6"
        },
        {
          "label": {
            "ru": "остаток до тысяч",
            "uz": "minglikdan keyingi qoldiq",
      "en": "remainder after the thousands place",
          },
          "value": "018 < 500"
        },
        {
          "label": {
            "ru": "результат округления",
            "uz": "yaxlitlash natijasi",
            "en": "rounded result",
          },
          "value": "704 000"
        }
      ]
    },
    "result": "704 018 > 699 950; 704 018 ≈ 704 000",
    "correctText": {
      "ru": "Числа шестизначные, и первое отличие находится в сотнях тысяч. Для округления остаток восемнадцать меньше пятисот, поэтому выбирается нижняя тысяча.",
      "uz": "Sonlar olti xonali, birinchi farq yuz minglarda. Yaxlitlashda o'n sakkiz qoldiq besh yuzdan kichik, shuning uchun quyi minglik tanlanadi.",
      "en": "Both numbers have six digits, and their first difference is in the hundred-thousands place. For rounding, the remainder eighteen is less than five hundred, so choose the lower thousand.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Оба числа шестизначные. Первое отличие слева показывает семь сотен тысяч против шести.",
          "Для округления остаток равен восемнадцати. Он меньше пятисот, поэтому выбираем нижнюю тысячу."
        ],
        "uz": [
          "Ikkala son ham olti xonali. Chapdagi birinchi farq yetti yuz mingni olti yuz ming bilan solishtiradi.",
          "Yaxlitlashda qoldiq o'n sakkiz. U besh yuzdan kichik, shuning uchun quyi minglikni tanlaymiz."
        ],
        "en": [
          "Both numbers have six digits. At the first difference from the left, the hundred-thousands digits are seven and six.",
          "For rounding, the remainder is eighteen. It is less than five hundred, so choose the lower thousand."
        ],
      },
      "on_correct": {
        "ru": "Сравнение использует старшие разряды, округление использует ближайшие границы. Обе стратегии сохраняют структуру числа.",
        "uz": "Taqqoslash katta xonalardan, yaxlitlash yaqin chegaralardan foydalanadi. Ikkala strategiya ham son tuzilishini saqlaydi.",
        "en": "Correct. Comparison uses the higher places, while rounding uses the nearest boundaries. Both strategies preserve the place-value structure.",
      }
    }
  },
  "s6": {
    "eyebrow": {
      "ru": "Общий алгоритм",
      "uz": "Umumiy algoritm",
      "en": "Complete algorithm",
    },
    "title": {
      "ru": "Один порядок для полного пакета",
      "uz": "To'liq paket uchun bitta tartib",
      "en": "One order for a complete package",
    },
    "lead": {
      "ru": "Каждое следующее действие использует результат предыдущего. Разрядная структура остаётся общей опорой.",
      "uz": "Har bir keyingi harakat oldingi natijadan foydalanadi. Xona tuzilishi umumiy tayanch bo'lib qoladi.",
      "en": "Each action uses the previous result. The place-value structure guides every step.",
    },
    "instruction": {
      "ru": "В каком порядке обрабатывать многозначное число?",
      "uz": "Ko'p xonali songa qaysi tartibda ishlov beramiz?",
      "en": "In what order should a multi-digit number be processed?",
    },
    "model": {
      "kind": "flow",
      "badge": {
        "ru": "Маршрут решения",
        "uz": "Yechim yo'nalishi",
        "en": "Solution route",
      },
      "steps": [
        {
          "ru": "1. Разделить на классы и прочитать",
          "uz": "1. Sinflarga ajratish va o'qish",
          "en": "1. Split into classes and read",
        },
        {
          "ru": "2. Назвать разряды и разложить",
          "uz": "2. Xonalarni aytish va yoyish",
          "en": "2. Name the places and expand",
        },
        {
          "ru": "3. Сравнить слева направо",
          "uz": "3. Chapdan o'ngga taqqoslash",
          "en": "3. Compare from left to right",
        },
        {
          "ru": "4. Выбрать разряд округления",
          "uz": "4. Yaxlitlash xonasini tanlash",
          "en": "4. Choose the rounding place",
        }
      ]
    },
    "result": {
      "ru": "прочитать → разложить → сравнить → округлить",
      "uz": "o'qish → yoyish → taqqoslash → yaxlitlash",
      "en": "read → expand → compare → round",
    },
    "correctText": {
      "ru": "Сначала раскрываем структуру числа. Затем используем её для разложения, сравнения и выбора ближайшего круглого числа.",
      "uz": "Avval sonning tuzilishini ochamiz. Keyin undan yoyish, taqqoslash va eng yaqin yaxlit sonni tanlashda foydalanamiz.",
      "en": "First reveal the structure of the number. Then use it to expand, compare and choose the nearest round number.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Сначала читаем число по классам. Затем раскладываем, сравниваем слева направо и выбираем нужную точность округления."
        ],
        "uz": [
          "Avval sonni sinflar bo'yicha o'qiymiz. Keyin yoyamiz, chapdan taqqoslaymiz va yaxlitlash aniqligini tanlaymiz."
        ],
        "en": [
          "First read the number by classes. Then expand it, compare it from left to right and round it to the required place."
        ],
      },
      "on_correct": {
        "ru": "Все четыре действия опираются на разряды. Поэтому таблица остаётся общей картой решения.",
        "uz": "To'rtta harakatning barchasi xonalarga tayanadi. Shuning uchun jadval umumiy yechim xaritasi bo'lib qoladi.",
        "en": "Correct. All four actions rely on places, so the place-value chart remains the common solution map.",
      }
    }
  },
  "s7": {
    "eyebrow": {
      "ru": "Разбор пакета",
      "uz": "Paket tahlili",
      "en": "Worked packet",
    },
    "title": {
      "ru": "Полный пример для числа 620 405",
      "uz": "620 405 soni uchun to'liq misol",
      "en": "A complete worked example for 620 405",
    },
    "lead": {
      "ru": "Проследи, как одно число проходит чтение, разложение, сравнение и округление.",
      "uz": "Bitta son o'qish, yoyish, taqqoslash va yaxlitlashdan qanday o'tishini kuzating.",
      "en": "Follow one number through reading, expanded form, comparison and rounding.",
    },
    "instruction": {
      "ru": "Как связаны четыре результата?",
      "uz": "To'rtta natija qanday bog'langan?",
      "en": "How do the four outcomes relate?",
    },
    "model": {
      "kind": "rows",
      "badge": {
        "ru": "Готовый пакет",
        "uz": "Tayyor paket",
        "en": "Completed packet",
      },
      "number": "620 405",
      "rows": [
        {
          "label": {
            "ru": "чтение",
            "uz": "o'qish",
            "en": "reading",
          },
          "value": {
            "ru": "шестьсот двадцать тысяч четыреста пять",
            "uz": "olti yuz yigirma ming to'rt yuz besh",
            "en": "six hundred and twenty thousand four hundred and five",
          }
        },
        {
          "label": {
            "ru": "разложение",
            "uz": "yoyish",
            "en": "expanded form",
          },
          "value": "600 000 + 20 000 + 400 + 5"
        },
        {
          "label": {
            "ru": "сравнение",
            "uz": "taqqoslash",
            "en": "comparison",
          },
          "value": "620 405 > 620 045"
        },
        {
          "label": {
            "ru": "до тысяч",
            "uz": "minglikkacha",
            "en": "to the nearest thousand",
          },
          "value": "620 000"
        }
      ]
    },
    "result": {
      "ru": "все результаты сохраняют разрядную структуру",
      "uz": "barcha natijalar xona tuzilishini saqlaydi",
      "en": "Every result preserves the place-value structure.",
    },
    "correctText": {
      "ru": "Число читается по классам, раскладывается по ненулевым цифрам, сравнивается по сотням и округляется вниз, потому что остаток равен 405.",
      "uz": "Son sinflar bo'yicha o'qiladi, noldan farqli raqamlar bo'yicha yoyiladi, yuzlarda taqqoslanadi va 405 qoldiq sabab pastga yaxlitlanadi.",
      "en": "The number is read by classes, expanded using its non-zero digits, compared at the hundreds place, and rounded down because the remainder is 405.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Читаем шестьсот двадцать тысяч четыреста пять. Разложение сохраняет четыре ненулевых разрядных значения."
        ],
        "uz": [
          "Olti yuz yigirma ming to'rt yuz besh deb o'qiymiz. Yoyiq yozuv to'rtta noldan farqli xona qiymatini saqlaydi."
        ],
        "en": [
          "Read six hundred and twenty thousand four hundred and five. Its expanded form contains four non-zero place values."
        ],
      },
      "on_correct": {
        "ru": "Первое число больше по сотням. Остаток четыреста пять меньше пятисот, поэтому округляем к шестистам двадцати тысячам.",
        "uz": "Birinchi son yuzlar bo'yicha katta. Qoldiq to'rt yuz besh besh yuzdan kichik, shuning uchun pastga yaxlitlaymiz.",
        "en": "Correct. The first number is greater at the hundreds place. Four hundred and five is less than five hundred, so round to six hundred and twenty thousand.",
      }
    }
  },
  "s8": {
    "eyebrow": {
      "ru": "Мини-проверка",
      "uz": "Kichik tekshiruv",
      "en": "Mini check",
    },
    "title": {
      "ru": "Найди значение цифры 7",
      "uz": "7 raqamining qiymatini toping",
      "en": "Find the value of the digit 7",
    },
    "lead": {
      "ru": "Используй разрядную таблицу. Запиши значение цифры без пробелов.",
      "uz": "Xona jadvalidan foydalaning. Raqamning qiymatini bo'sh joysiz yozing.",
      "en": "Use a place-value chart. Enter the value of the digit without spaces.",
    },
    "instruction": {
      "ru": "Чему равно значение цифры 7 в числе 704 018?",
      "uz": "704 018 sonidagi 7 raqamining qiymati qancha?",
      "en": "What is the value of the digit 7 in 704 018?",
    },
    "model": {
      "kind": "table",
      "badge": {
        "ru": "Сотни тысяч",
        "uz": "Yuz minglar",
        "en": "Hundred-thousands",
      },
      "number": "704 018",
      "columns": [
        {
          "label": {
            "ru": "сотни тысяч",
            "uz": "yuz minglar"
          , en: "hundred-thousands"},
          "value": "7"
        },
        {
          "label": {
            "ru": "десятки тысяч",
            "uz": "o'n minglar"
          , en: "ten-thousands"},
          "value": "0"
        },
        {
          "label": {
            "ru": "тысячи",
            "uz": "minglar",
            "en": "thousands",
          },
          "value": "4"
        },
        {
          "label": {
            "ru": "сотни",
            "uz": "yuzlar",
            "en": "hundreds",
          },
          "value": "0"
        },
        {
          "label": {
            "ru": "десятки",
            "uz": "o'nlar"
          , en: "tens"},
          "value": "1"
        },
        {
          "label": {
            "ru": "единицы",
            "uz": "birlar"
          , en: "ones"},
          "value": "8"
        }
      ]
    },
    "placeholder": {
      "ru": "0",
      "uz": "0"
    , en: "0"},
    "correctValue": "700000",
    "correctText": {
      "ru": "Цифра 7 стоит в сотнях тысяч, поэтому её значение равно 700 000.",
      "uz": "7 raqami yuz minglar xonasida, shuning uchun uning qiymati 700 000.",
      "en": "The digit 7 is in the hundred-thousands place, so its value is 700,000.",
    },
    "wrongText": {
      "ru": "Найди столбец цифры 7. Она стоит в сотнях тысяч, поэтому к семёрке нужны пять нулей.",
      "uz": "7 raqamining ustunini toping. U yuz minglarda turibdi, shuning uchun yettiga beshta nol kerak.",
      "en": "Find the column containing the digit 7. It is in the hundred-thousands place, so write five zeros after the seven.",
    },
    "wrongByValue": {
      "7": {
        "ru": "Это цифра без её разрядного значения. Учти сотни тысяч.",
        "uz": "Bu xona qiymatisiz raqam. Yuz minglarni hisobga oling.",
        "en": "That is the digit without its place value. Remember the hundred-thousands place.",
      },
      "7000": {
        "ru": "Это тысячи. Верни цифру 7 в сотни тысяч.",
        "uz": "Bu minglar. 7 raqamini yuz minglarga qaytaring.",
        "en": "That is the thousands place. Move the digit 7 back to the hundred-thousands place.",
      },
      "70000": {
        "ru": "Это десятки тысяч. Цифра 7 стоит на один разряд левее.",
        "uz": "Bu o'n minglar. 7 raqami bir xona chapda turibdi.",
        "en": "That is the ten-thousands place. The digit 7 is one place farther left.",
      }
    },
    "inputWrongAudio": {
      "ru": "Проверь столбец сотен тысяч. Значение цифры семь должно содержать пять нулей.",
      "uz": "Yuz minglar ustunini tekshiring. Yetti raqamining qiymatida beshta nol bo'lishi kerak.",
      "en": "Check the hundred-thousands column. The value of the digit seven must contain five zeros.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Определи значение цифры семь в числе семьсот четыре тысячи восемнадцать. Ответ запиши цифрами."
        ],
        "uz": [
          "Yetti yuz to'rt ming o'n sakkiz sonidagi yetti raqamining qiymatini aniqlang. Javobni raqamlar bilan yozing."
        ],
        "en": [
          "Find the value of the digit seven in seven hundred and four thousand and eighteen. Enter the answer in digits."
        ],
      },
      "on_correct": {
        "ru": "Верно. Семёрка в сотнях тысяч означает семьсот тысяч.",
        "uz": "To'g'ri. Yuz minglardagi yetti raqami yetti yuz mingni bildiradi.",
        "en": "Correct. A seven in the hundred-thousands place means seven hundred thousand.",
      },
      "on_wrong": {
        "ru": "Проверь столбец сотен тысяч. К семёрке нужны пять нулей.",
        "uz": "Yuz minglar ustunini tekshiring. Yettiga beshta nol kerak.",
        "en": "Check the hundred-thousands column. Write five zeros after the seven.",
      }
    }
  },
  "s9": {
    "eyebrow": {
      "ru": "Стена решений",
      "uz": "Yechimlar devori",
      "en": "Solution wall",
    },
    "title": {
      "ru": "Четыре готовых шага для 508 070",
      "uz": "508 070 uchun to'rtta tayyor qadam",
      "en": "Four worked steps for 508,070",
    },
    "lead": {
      "ru": "Это не тест. Каждый пример уже решён и показывает отдельную часть полного пакета.",
      "uz": "Bu test emas. Har bir misol yechilgan va to'liq paketning alohida qismini ko'rsatadi.",
      "en": "This is not a test. Each example has already been solved and shows a separate part of the complete package.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Разберём четыре готовых решения для числа пятьсот восемь тысяч семьдесят."
        ],
        "uz": [
          "Besh yuz sakkiz ming yetmish soni uchun to'rtta tayyor yechimni tahlil qilamiz."
        ],
        "en": [
          "Let us examine four worked solutions for the number five hundred and eight thousand and seventy."
        ],
      }
    },
    "items": [
      {
        "question": {
          "ru": "Как прочитать число 508 070?",
          "uz": "508 070 soni qanday o'qiladi?",
          "en": "How do you read the number 508,070?",
        },
        "answer": {
          "ru": "пятьсот восемь тысяч семьдесят",
          "uz": "besh yuz sakkiz ming yetmish",
          "en": "five hundred and eight thousand and seventy",
        },
        "correctText": {
          "ru": "Класс тысяч читается первым, затем читается семьдесят.",
          "uz": "Avval minglar sinfi, keyin yetmish o'qiladi.",
          "en": "The thousands group is read first, then read seventy.",
        },
        "audio": {
          "intro": {
            "ru": [
              "Сначала читаем класс тысяч, затем класс единиц."
            ],
            "uz": [
              "Avval minglar sinfini, keyin birlar sinfini o'qiymiz."
            ],
            "en": [
              "First we read the thousands group, then the ones group."
            ],
          },
          "on_correct": {
            "ru": "Получаем пятьсот восемь тысяч семьдесят.",
            "uz": "Besh yuz sakkiz ming yetmish hosil bo'ladi.",
            "en": "Correct. We get five hundred and eight thousand and seventy.",
          }
        }
      },
      {
        "question": {
          "ru": "Как выглядит развёрнутая запись?",
          "uz": "Yoyiq yozuv qanday ko'rinadi?",
          "en": "What does the expanded form look like?",
        },
        "answer": "500 000 + 8 000 + 70",
        "correctText": {
          "ru": "Три ненулевые цифры дают три разрядных слагаемых.",
          "uz": "Uchta noldan farqli raqam uchta xona qo'shiluvchisini beradi.",
          "en": "Three non-zero digits give three place-value terms.",
        },
        "audio": {
          "intro": {
            "ru": [
              "Пятьсот тысяч, восемь тысяч и семьдесят образуют развёрнутую запись."
            ],
            "uz": [
              "Besh yuz ming, sakkiz ming va yetmish yoyiq yozuvni hosil qiladi."
            ],
            "en": [
              "Five hundred thousand, eight thousand and seventy form an expanded form."
            ],
          },
          "on_correct": {
            "ru": "Нулевые разрядные слагаемые можно не записывать.",
            "uz": "Nol xona qo'shiluvchilarini yozmaslik mumkin.",
            "en": "Correct. Zero place-value terms may be omitted.",
          }
        }
      },
      {
        "question": {
          "ru": "Как сравнить 508 070 и 508 007?",
          "uz": "508 070 va 508 007 qanday taqqoslanadi?",
          "en": "How do you compare 508,070 and 508,007?",
        },
        "answer": "508 070 > 508 007",
        "correctText": {
          "ru": "Первое отличие находится в десятках: семь десятков больше нуля десятков.",
          "uz": "Birinchi farq o'nlarda: yetti o'nlik nol o'nlikdan katta.",
          "en": "The first difference is in the tens place: seven tens is greater than zero tens.",
        },
        "audio": {
          "intro": {
            "ru": [
              "Первые четыре разряда совпадают. В десятках первое число имеет семь, второе ноль."
            ],
            "uz": [
              "Dastlabki to'rtta xona teng. O'nlarda birinchi sonda yetti, ikkinchisida nol bor."
            ],
            "en": [
              "The first four digits match. In the tens place, the first number has seven and the second has zero."
            ],
          },
          "on_correct": {
            "ru": "Поэтому первое число больше второго.",
            "uz": "Shuning uchun birinchi son ikkinchisidan katta.",
            "en": "Correct. The first number is greater than the second.",
          }
        }
      },
      {
        "question": {
          "ru": "Как округлить 508 070 до тысяч?",
          "uz": "508 070 sonini minglikkacha qanday yaxlitlaymiz?",
          "en": "How do you round 508,070 to the nearest thousand?",
        },
        "answer": "508 000",
        "correctText": {
          "ru": "Остаток 070 меньше 500, поэтому выбирается нижняя тысяча.",
          "uz": "070 qoldiq 500 dan kichik, shuning uchun quyi minglik tanlanadi.",
          "en": "The remainder 070 is less than 500, so choose the lower thousand.",
        },
        "audio": {
          "intro": {
            "ru": [
              "Остаток равен семидесяти. Он меньше пятисот, поэтому число округляется вниз."
            ],
            "uz": [
              "Qoldiq yetmishga teng. U besh yuzdan kichik, shuning uchun son pastga yaxlitlanadi."
            ],
            "en": [
              "The remainder is seventy. It is less than five hundred, so the number rounds down."
            ],
          },
          "on_correct": {
            "ru": "Получаем пятьсот восемь тысяч.",
            "uz": "Besh yuz sakkiz ming hosil bo'ladi.",
            "en": "Correct. The result is five hundred and eight thousand.",
          }
        }
      }
    ],
    "completionText": {
      "ru": "Четыре части пакета разобраны.",
      "uz": "Paketning to'rtta qismi tahlil qilindi.",
      "en": "Four parts of the packet have been reviewed.",
    }
  },
  "s10": {
    "eyebrow": {
      "ru": "Выбор модели",
      "uz": "Modelni tanlash",
      "en": "Choosing a model",
    },
    "title": {
      "ru": "Каждой задаче свой инструмент",
      "uz": "Har bir vazifa uchun o'z vositasi",
      "en": "Each task has its own tool",
    },
    "lead": {
      "ru": "Одна модель не обязана быть лучшей для всех действий. Выбор зависит от вопроса.",
      "uz": "Bitta model barcha harakatlar uchun eng yaxshi bo'lishi shart emas. Tanlov savolga bog'liq.",
      "en": "One model doesn't have to be the best for all actions. The choice depends on the question.",
    },
    "instruction": {
      "ru": "Какая стратегия делает полный пакет надёжным?",
      "uz": "Qaysi strategiya to'liq paketni ishonchli qiladi?",
      "en": "What strategy makes a complete package reliable?",
    },
    "model": {
      "kind": "flow",
      "badge": {
        "ru": "Три инструмента",
        "uz": "Uchta vosita",
        "en": "Three tools",
      },
      "steps": [
        {
          "ru": "Таблица для чтения и разложения",
          "uz": "O'qish va yoyish uchun jadval",
          "en": "Place-value chart for reading and expanded form",
        },
        {
          "ru": "Первое отличие для сравнения",
          "uz": "Taqqoslash uchun birinchi farq",
          "en": "First difference for comparison",
        },
        {
          "ru": "Числовая прямая для округления",
          "uz": "Yaxlitlash uchun son chizig'i",
          "en": "Number line for rounding",
        }
      ]
    },
    "options": [
      {
        "ru": "Выбирать модель по задаче и проверять разряды",
        "uz": "Modelni vazifaga ko'ra tanlash va xonalarni tekshirish",
        "en": "Select a model for the task and check the places",
      },
      {
        "ru": "Всегда использовать только разрядную таблицу",
        "uz": "Har doim faqat xona jadvalidan foydalanish",
        "en": "Always use only the place-value chart.",
      },
      {
        "ru": "Смотреть только на последнюю цифру",
        "uz": "Faqat oxirgi raqamga qarash",
        "en": "Look only at the last digit.",
      },
      {
        "ru": "Удалять нули перед выбором модели",
        "uz": "Model tanlashdan oldin nollarni olib tashlash",
        "en": "Remove zeros before choosing a model",
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Таблица раскрывает места цифр, первое различие ускоряет сравнение, а числовая прямая показывает ближайшее круглое число.",
      "uz": "Jadval raqamlar o'rnini ochadi, birinchi farq taqqoslashni tezlashtiradi, son chizig'i esa eng yaqin yaxlit sonni ko'rsatadi.",
      "en": "The place-value chart shows each digit's place, the first difference speeds up comparison, and the number line shows the nearest round number.",
    },
    "wrong": [
      null,
      {
        "ru": "Таблица полезна, но для округления числовая прямая яснее, а для сравнения достаточно первого различия.",
        "uz": "Jadval foydali, ammo yaxlitlashda son chizig'i aniqroq, taqqoslashda esa birinchi farq yetarli.",
        "en": "The chart is useful, but a number line is clearer for rounding, while the first difference is enough for comparison.",
      },
      {
        "ru": "Последняя цифра не показывает старшие разряды и не решает все задачи.",
        "uz": "Oxirgi raqam katta xonalarni ko'rsatmaydi va barcha vazifani hal qilmaydi.",
        "en": "The last digit does not show the higher places and cannot solve every problem.",
      },
      {
        "ru": "Нули сохраняют пустые разряды. Их удаление меняет структуру числа.",
        "uz": "Nollar bo'sh xonalarni saqlaydi. Ularni olib tashlash son tuzilishini o'zgartiradi.",
        "en": "Zeros hold empty places. Removing them changes the structure of the number.",
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Для чтения и разложения удобна таблица. Для сравнения ищем первое отличие. Для округления помогает числовая прямая."
        ],
        "uz": [
          "O'qish va yoyishda jadval qulay. Taqqoslashda birinchi farqni izlaymiz. Yaxlitlashda son chizig'i yordam beradi."
        ],
        "en": [
          "Use a place-value chart for reading and expanded form. For comparison, find the first difference. For rounding, use a number line."
        ],
      },
      "on_correct": {
        "ru": "Надёжная стратегия выбирает модель по задаче и сохраняет разрядную структуру.",
        "uz": "Ishonchli strategiya modelni vazifaga ko'ra tanlaydi va xona tuzilishini saqlaydi.",
        "en": "Correct. A reliable strategy chooses a model to suit the task and preserves the place-value structure.",
      },
      "on_wrong": [
        null,
        {
          "ru": "Один инструмент не всегда показывает нужную связь лучше остальных.",
          "uz": "Bitta vosita kerakli bog'lanishni har doim boshqalardan yaxshiroq ko'rsatmaydi.",
          "en": "One tool is not always the best for showing every relationship.",
        },
        {
          "ru": "Последняя цифра не заменяет анализ старших разрядов.",
          "uz": "Oxirgi raqam katta xonalar tahlilini almashtirmaydi.",
          "en": "The last digit cannot replace an analysis of the higher places.",
        },
        {
          "ru": "Нули нельзя удалять, они удерживают пустые места.",
          "uz": "Nollarni olib tashlab bo'lmaydi, ular bo'sh o'rinlarni saqlaydi.",
          "en": "Zeros cannot be removed because they hold empty places.",
        }
      ]
    }
  },
  "s11": {
    "eyebrow": {
      "ru": "Лаборатория ошибок",
      "uz": "Xatolar laboratoriyasi",
      "en": "Error Lab",
    },
    "title": {
      "ru": "Три сдвига, три способа повредить число",
      "uz": "Uch siljish, sonni buzishning uch usuli",
      "en": "Three shifts, three ways to damage the number",
    },
    "lead": {
      "ru": "Перестановка цифр, неверное слагаемое и ошибочное округление выглядят по-разному, но все три ошибки возникают, когда не проверяют разрядное значение.",
      "uz": "Raqamlarni boshqa xonalarga ko'chirish, noto'g'ri qo'shiluvchi va xato yaxlitlash turlicha ko'rinadi, ammo uchala xato ham xona qiymati tekshirilmaganda yuz beradi.",
      "en": "Reordering digits, using an incorrect addend and rounding incorrectly look different, but all three errors arise when place value is not checked.",
    },
    "instruction": {
      "ru": "Как восстановить разрядную структуру в каждом случае?",
      "uz": "Har bir holatda xona tuzilishini qanday tiklaymiz?",
      "en": "How can the place-value structure be restored in each case?",
    },
    "model": {
      "kind": "table",
      "badge": {
        "ru": "Три неисправности",
        "uz": "Uchta nosozlik",
        "en": "Three malfunctions",
      },
      "rows": [
        {
          "label": {
            "ru": "цифры переставлены по разрядам",
            "uz": "raqamlar boshqa xonalarga ko'chgan",
            "en": "Digits moved to different places",
          },
          "value": "704 018 → 740 180"
        },
        {
          "label": {
            "ru": "четвёрка сдвинута влево",
            "uz": "to'rt chapga siljigan",
            "en": "digit 4 shifted left",
          },
          "value": "4 000 → 40 000"
        },
        {
          "label": {
            "ru": "неверно прочитана проверочная цифра",
            "uz": "tekshiruvchi raqam noto'g'ri o'qilgan",
            "en": "The deciding digit was read incorrectly",
          },
          "value": "704 018 → 705 000"
        }
      ]
    },
    "repairs": [
      {
        "label": {
          "ru": "Вернуть цифры в свои разряды",
          "uz": "Raqamlarni o'z xonalariga qaytarish",
          "en": "Return each digit to its place",
        },
        "before": "740 180",
        "after": "704 018",
        "text": {
          "ru": "Каждая цифра снова занимает свой разряд, а нули сохраняют пустые места.",
          "uz": "Har bir raqam yana o'z xonasini egallaydi, nollar esa bo'sh xonalarni saqlaydi.",
          "en": "Each digit returns to its place, while zeros preserve the empty places.",
        }
      },
      {
        "label": {
          "ru": "Вернуть разряд",
          "uz": "Xonani qaytarish",
          "en": "Restore the place",
        },
        "before": "40 000",
        "after": "4 000",
        "text": {
          "ru": "Сдвиг вправо уменьшает значение в десять раз.",
          "uz": "O'ngga bir xona siljish qiymatni o'n marta kamaytiradi.",
          "en": "Shifting to the right reduces the value tenfold.",
        }
      },
      {
        "label": {
          "ru": "Проверить границу",
          "uz": "Chegarani tekshirish",
          "en": "Check the boundary",
        },
        "before": "705 000",
        "after": "704 000",
        "text": {
          "ru": "Остаток восемнадцать меньше пятисот, поэтому выбирается нижняя тысяча.",
          "uz": "O'n sakkiz qoldiq besh yuzdan kichik, shuning uchun quyi minglik tanlanadi.",
          "en": "The remainder eighteen is less than five hundred, so choose the lower thousand.",
        }
      }
    ],
    "result": {
      "ru": "704 018; 4 000; 704 000",
      "uz": "704 018; 4 000; 704 000"
    , en: "704 018; 4 000; 704 000"},
    "correctText": {
      "ru": "Сначала возвращаем каждую цифру в свой разряд, затем проверяем разряд слагаемого, а при округлении смотрим на цифру сразу справа от тысяч.",
      "uz": "Avval har bir raqamni o'z xonasiga qaytaramiz, keyin qo'shiluvchining xonasini tekshiramiz, yaxlitlashda esa mingliklarning darhol o'ngidagi raqamga qaraymiz.",
      "en": "First return each digit to its place, then check the place of the addend; when rounding, inspect the digit immediately to the right of the thousands place.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Первая ошибка переставляет цифры по разрядам. Вторая сдвигает четвёрку на один разряд влево.",
          "Третья ошибка неверно читает проверочную цифру и выбирает верхнюю тысячу, хотя остаток меньше пятисот."
        ],
        "uz": [
          "Birinchi xato raqamlarni boshqa xonalarga ko'chiradi. Ikkinchisi to'rtni bir xona chapga siljitadi.",
          "Uchinchi xato tekshiruvchi raqamni noto'g'ri o'qib, qoldiq besh yuzdan kichik bo'lsa ham yuqori minglikni tanlaydi."
        ],
        "en": [
          "The first error moves digits into different places. The second shifts the digit four one place to the left.",
          "The third error misreads the deciding digit and chooses the upper thousand even though the remainder is less than five hundred."
        ],
      },
      "on_correct": {
        "ru": "Все три исправления возвращают цифры и границы на правильные места.",
        "uz": "Uchala tuzatish ham raqamlar va chegaralarni to'g'ri o'rinlarga qaytaradi.",
        "en": "Correct. All three fixes put the digits and boundaries back in the correct places.",
      }
    }
  },
  "s12": {
    "eyebrow": {
      "ru": "Лаборатория решений",
      "uz": "Yechimlar laboratoriyasi",
      "en": "Solution lab",
    },
    "title": {
      "ru": "Два городских пакета проходят одну проверку",
      "uz": "Ikki shahar paketi bitta tekshiruvdan o'tadi",
      "en": "Two city packages pass one inspection",
    },
    "lead": {
      "ru": "Северный и южный секторы прислали разные числа. Для каждого пакета сохраняем одну цепочку: прочитать, разложить, сравнить и округлить.",
      "uz": "Shimoliy va janubiy sektorlar turli sonlarni yubordi. Har bir paket uchun bitta zanjir saqlanadi: o'qish, yoyish, taqqoslash va yaxlitlash.",
      "en": "The north and south sectors sent different numbers. For each packet, follow the same chain: read, expand, compare and round.",
    },
    "instruction": {
      "ru": "Как одна разрядная система согласует все четыре действия?",
      "uz": "Bitta xona tizimi to'rtta harakatni qanday moslashtiradi?",
      "en": "How does one place-value system connect all four actions?",
    },
    "packets": [
      {
        "label": {
          "ru": "СЕВЕРНЫЙ СЕКТОР",
          "uz": "SHIMOLIY SEKTOR",
          "en": "NORTH SECTOR",
        },
        "number": "408 750",
        "reading": {
          "ru": "четыреста восемь тысяч семьсот пятьдесят",
          "uz": "to'rt yuz sakkiz ming yetti yuz ellik",
          "en": "four hundred and eight thousand seven hundred and fifty",
        },
        "expanded form": "400 000 + 8 000 + 700 + 50",
        "comparison": "408 750 > 407 980",
        "rounded": "408 750 → 409 000",
        "note": {
          "ru": "Первое отличие находится в тысячах: 8 больше 7. Остаток 750 ведёт к верхней тысяче.",
          "uz": "Birinchi farq minglarda: 8 soni 7 dan katta. 750 qoldiq yuqori minglikka olib boradi.",
          "en": "The first difference is in the thousands place: 8 is greater than 7. The remainder 750 rounds to the upper thousand.",
        }
      },
      {
        "label": {
          "ru": "ЮЖНЫЙ СЕКТОР",
          "uz": "JANUBIY SEKTOR",
          "en": "SOUTH SECTOR",
        },
        "number": "407 980",
        "reading": {
          "ru": "четыреста семь тысяч девятьсот восемьдесят",
          "uz": "to'rt yuz yetti ming to'qqiz yuz sakson",
          "en": "four hundred and seven thousand nine hundred and eighty",
        },
        "expanded form": "400 000 + 7 000 + 900 + 80",
        "comparison": "407 980 < 408 750",
        "rounded": "407 980 → 408 000",
        "note": {
          "ru": "В тысячах стоит 7, поэтому пакет меньше. Остаток 980 переводит число к следующей тысяче.",
          "uz": "Minglarda 7 turibdi, shuning uchun paket kichik. 980 qoldiq sonni keyingi minglikka o'tkazadi.",
          "en": "The thousands digit is 7, so this packet is smaller. The remainder 980 rounds the number to the next thousand.",
        }
      }
    ],
    "result": {
      "ru": "408 750 > 407 980, но оба числа округляются вверх",
      "uz": "408 750 > 407 980, ammo ikkala son ham yuqoriga yaxlitlanadi",
      "en": "408,750 > 407,980, but both numbers round up",
    },
    "correctText": {
      "ru": "Чтение и разложение сохраняют позиции цифр. Сравнение ищет первое отличие слева, а округление отдельно оценивает остаток до ближайшей тысячи.",
      "uz": "O'qish va yoyish raqamlar o'rnini saqlaydi. Taqqoslash chapdan birinchi farqni topadi, yaxlitlash esa eng yaqin minglikkacha qoldiqni alohida baholaydi.",
      "en": "Reading and expanded form preserve each digit's place. Comparison finds the first difference from the left, while rounding checks the remainder against the nearest thousand.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Северный сектор прислал четыреста восемь тысяч семьсот пятьдесят. После разложения видны тысячи, сотни и десятки, а округление ведёт к четырёмстам девяти тысячам.",
          "Южный сектор прислал четыреста семь тысяч девятьсот восемьдесят. Он меньше уже в разряде тысяч и округляется к четырёмстам восьми тысячам."
        ],
        "uz": [
          "Shimoliy sektor to'rt yuz sakkiz ming yetti yuz ellikni yubordi. Yoyilganda minglar, yuzlar va o'nlar ko'rinadi, yaxlitlash esa to'rt yuz to'qqiz mingga olib boradi.",
          "Janubiy sektor to'rt yuz yetti ming to'qqiz yuz saksonni yubordi. U minglar xonasidayoq kichik va to'rt yuz sakkiz mingga yaxlitlanadi."
        ],
        "en": [
          "The North Sector sent four hundred and eight thousand seven hundred and fifty. Its expansion shows thousands, hundreds and tens before rounding to four hundred and nine thousand.",
          "The South Sector sent four hundred and seven thousand nine hundred and eighty. It is smaller in the thousands place and rounds to four hundred and eight thousand."
        ],
      },
      "on_correct": {
        "ru": "Оба пакета проверены одной цепочкой. Сначала читаем и раскладываем, затем сравниваем слева и после этого выбираем точность округления.",
        "uz": "Ikkala paket bitta zanjir bilan tekshirildi. Avval o'qiymiz va yoyamiz, keyin chapdan taqqoslaymiz, shundan so'ng yaxlitlash aniqligini tanlaymiz.",
        "en": "Correct. Check both packets with the same chain: read and expand, compare from the left, then round to the required place.",
      }
    }
  },
  "s13": {
    "eyebrow": {
      "ru": "Финальный пакет",
      "uz": "Yakuniy paket",
      "en": "Final package",
    },
    "title": {
      "ru": "Выбери полностью верный пакет для 306 450",
      "uz": "306 450 uchun to'liq to'g'ri paketni tanlang",
      "en": "Choose the completely correct packet for 306 450",
    },
    "lead": {
      "ru": "Только один пакет точно сохраняет чтение, разложение, сравнение и округление.",
      "uz": "Faqat bitta paket o'qish, yoyish, taqqoslash va yaxlitlashni aniq saqlaydi.",
      "en": "Only one packet has the correct reading, expanded form, comparison and rounding.",
    },
    "instruction": {
      "ru": "Какой пакет не содержит ошибок?",
      "uz": "Qaysi paketda xato yo'q?",
      "en": "Which package does not contain errors?",
    },
    "model": {
      "kind": "city",
      "badge": {
        "ru": "Данные сенсора",
        "uz": "Sensor ma'lumotlari",
        "en": "Sensor data",
      },
      "number": "306 450",
      "rows": [
        {
          "label": {
            "ru": "сравнить с",
            "uz": "bilan taqqoslash",
            "en": "compare with",
          },
          "value": "306 405"
        },
        {
          "label": {
            "ru": "округлить до",
            "uz": "yaxlitlash aniqligi",
            "en": "round to the nearest",
          },
          "value": "1 000"
        }
      ]
    },
    "options": [
      {
        "ru": "триста шесть тысяч четыреста пятьдесят; 300 000 + 6 000 + 400 + 50; больше 306 405; до тысяч 306 000",
        "uz": "uch yuz olti ming to'rt yuz ellik; 300 000 + 6 000 + 400 + 50; 306 405 dan katta; minglikkacha 306 000",
        "en": "three hundred and six thousand four hundred and fifty; 300,000 + 6,000 + 400 + 50; greater than 306,405; to the nearest thousand: 306,000",
      },
      {
        "ru": "триста шесть тысяч четыреста пятьдесят; 300 000 + 60 000 + 400 + 50; больше 306 405; до тысяч 306 000",
        "uz": "uch yuz olti ming to'rt yuz ellik; 300 000 + 60 000 + 400 + 50; 306 405 dan katta; minglikkacha 306 000",
        "en": "three hundred and six thousand four hundred and fifty; 300,000 + 60,000 + 400 + 50; greater than 306,405; to the nearest thousand: 306,000",
      },
      {
        "ru": "триста шесть тысяч четыреста пятьдесят; 300 000 + 6 000 + 400 + 50; меньше 306 405; до тысяч 306 000",
        "uz": "uch yuz olti ming to'rt yuz ellik; 300 000 + 6 000 + 400 + 50; 306 405 dan kichik; minglikkacha 306 000",
        "en": "three hundred and six thousand four hundred and fifty; 300,000 + 6,000 + 400 + 50; less than 306,405; to the nearest thousand: 306,000",
      },
      {
        "ru": "триста шесть тысяч четыреста пятьдесят; 300 000 + 6 000 + 400 + 50; больше 306 405; до тысяч 307 000",
        "uz": "uch yuz olti ming to'rt yuz ellik; 300 000 + 6 000 + 400 + 50; 306 405 dan katta; minglikkacha 307 000",
        "en": "three hundred and six thousand four hundred and fifty; 300,000 + 6,000 + 400 + 50; greater than 306,405; to the nearest thousand: 307,000",
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Пакет точный. Число разложено по разрядам, оно больше 306 405 по десяткам и округляется к 306 000.",
      "uz": "Paket aniq. Son xonalar bo'yicha yoyilgan, o'nlarda 306 405 dan katta va 306 000 ga yaxlitlanadi.",
      "en": "The packet is correct. The number is expanded by place value, it is greater than 306,405 at the tens place, and it rounds to 306,000.",
    },
    "wrong": [
      null,
      {
        "ru": "Цифра 6 стоит в тысячах, а не в десятках тысяч. Нужно слагаемое 6 000.",
        "uz": "6 raqami o'n minglarda emas, minglarda turibdi. 6 000 qo'shiluvchisi kerak.",
        "en": "The digit 6 is in the thousands place, not the ten-thousands place. The correct addend is 6,000.",
      },
      {
        "ru": "Первые три цифры совпадают, но в десятках 5 больше 0. Поэтому 306 450 больше.",
        "uz": "Dastlabki uchta raqam teng, ammo o'nlarda 5 soni 0 dan katta. Shuning uchun 306 450 katta.",
        "en": "The first three digits match, but in the tens place 5 is greater than 0. Therefore 306,450 is greater.",
      },
      {
        "ru": "Остаток 450 меньше 500, поэтому число округляется вниз к 306 000.",
        "uz": "450 qoldiq 500 dan kichik, shuning uchun son 306 000 ga pastga yaxlitlanadi.",
        "en": "The remaining 450 is less than 500, so the number is rounded down to 306,000.",
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Проверь четыре части пакета для числа триста шесть тысяч четыреста пятьдесят. Выбери полностью точный вариант."
        ],
        "uz": [
          "Uch yuz olti ming to'rt yuz ellik soni paketining to'rtta qismini tekshiring. To'liq aniq variantni tanlang."
        ],
        "en": [
          "Check all four parts of the packet for three hundred and six thousand four hundred and fifty. Choose the completely correct option."
        ],
      },
      "on_correct": {
        "ru": "Пакет принят. Все четыре части согласованы с разрядной структурой числа.",
        "uz": "Paket qabul qilindi. To'rtta qismning barchasi sonning xona tuzilishiga mos.",
        "en": "Correct. The packet is accepted. All four parts match the number's place-value structure.",
      },
      "on_wrong": [
        null,
        {
          "ru": "Шесть означает тысячи, а не десятки тысяч. Исправь развёрнутую запись.",
          "uz": "Olti minglarni bildiradi, o'n minglarni emas. Yoyiq yozuvni tuzating.",
          "en": "Six represents six thousand, not sixty thousand. Correct the expanded form.",
        },
        {
          "ru": "В десятках первое число имеет пять, второе ноль. Первое число больше.",
          "uz": "O'nlarda birinchi sonda besh, ikkinchisida nol bor. Birinchi son katta.",
          "en": "In the tens place, the first number has five and the second has zero. The first number is greater.",
        },
        {
          "ru": "Четыреста пятьдесят меньше пятисот. Выбираем нижнюю тысячу.",
          "uz": "To'rt yuz ellik besh yuzdan kichik. Quyi minglikni tanlaymiz.",
          "en": "Four hundred and fifty is less than five hundred, so choose the lower thousand.",
        }
      ]
    }
  },
  "s14": {
    "eyebrow": {
      "ru": "Итог и мост",
      "uz": "Yakun va ko'prik"
    , en: "Summary and link"},
    "title": {
      "ru": "Разряды и классы управляют записью числа",
      "uz": "Xonalar va sinflar son yozuvini boshqaradi",
      "en": "Places and classes control how a number is written",
    },
    "lead": {
      "ru": "Подготовка полного пакета завершена. Теперь каждое действие можно объяснить через место цифры.",
      "uz": "To'liq paket tayyor. Endi har bir harakatni raqamning o'rni orqali tushuntirish mumkin.",
      "en": "The complete packet is ready. Every action can now be explained through the place of each digit.",
    },
    "instruction": {
      "ru": "Какие связи нужно сохранить?",
      "uz": "Qaysi bog'lanishlarni saqlash kerak?",
      "en": "What kind of connections do we need to keep?",
    },
    "model": {
      "kind": "reward",
      "badge": {
        "ru": "Пакет завершён",
        "uz": "Paket yakunlandi",
        "en": "Package complete.",
      },
      "number": {
        "ru": "КЛАСС → РАЗРЯД → ЗНАЧЕНИЕ",
        "uz": "SINF → XONA → QIYMAT",
        "en": "CLASS → PLACE → VALUE",
      },
      "steps": [
        {
          "ru": "В каждом классе три разряда",
          "uz": "Har bir sinfda uchta xona bor",
          "en": "There are three places in each class.",
        },
        {
          "ru": "Шаг влево увеличивает значение в десять раз",
          "uz": "Chapga qadam qiymatni o'n marta oshiradi",
          "en": "A step to the left increases the value tenfold.",
        },
        {
          "ru": "Чтение, разложение, сравнение и округление используют разряды",
          "uz": "O'qish, yoyish, taqqoslash va yaxlitlash xonalardan foydalanadi",
          "en": "Reading, expanded form, comparison and rounding use places",
        }
      ]
    },
    "result": {
      "ru": "место цифры определяет её значение",
      "uz": "raqam o'rni uning qiymatini belgilaydi",
      "en": "The place of a digit determines its value.",
    },
    "correctText": {
      "ru": "В позиционной записи значение цифры зависит от её места. Именно эта связь объединяет все действия сегодняшнего урока.",
      "uz": "Pozitsion yozuvda raqam qiymati uning o'rniga bog'liq. Aynan shu bog'lanish bugungi darsdagi barcha harakatlarni birlashtiradi.",
      "en": "In positional notation, the value of a digit depends on its place. This connection unites every action in today's lesson.",
    },
    "bridge": {
      "ru": "На следующем уроке сравним позиционные и непозиционные системы счисления.",
      "uz": "Keyingi darsda pozitsion va nopozitsion sanoq sistemalarini taqqoslaymiz.",
      "en": "In the next lesson, we will compare positional and non-positional numeral systems.",
    },
    "audio": {
      "intro": {
        "ru": [
          "В каждом классе три разряда. Место цифры определяет её значение и помогает выполнять все изученные действия."
        ],
        "uz": [
          "Har bir sinfda uchta xona bor. Raqam o'rni uning qiymatini belgilaydi va barcha o'rganilgan harakatlarga yordam beradi."
        ],
        "en": [
          "There are three places in each class. The place of a digit determines its value and supports every action learned today."
        ],
      },
      "on_correct": {
        "ru": "Следующий шаг покажет, чем позиционная запись отличается от непозиционной системы счисления.",
        "uz": "Keyingi qadam pozitsion yozuv nopozitsion sanoq sistemasidan qanday farq qilishini ko'rsatadi.",
        "en": "Correct. The next step will show how a positional numeral system differs from a non-positional one.",
      }
    }
  }
};

const makeMicroPractice = ({ audioIntro, correctAudio, wrongAudio, ...content }) => ({
  ...content,
  audio: { intro: audioIntro, on_correct: correctAudio, on_wrong: content.options.map((_, index) => (index === content.correctIndex ? null : wrongAudio)) },
});

const PRACTICE_CONTENT = {
  p1: makeMicroPractice({ eyebrow: { ru: 'Практика 1', uz: '1-mashq' , en: "Practice 1"}, title: { ru: 'Читаем число', uz: 'Sonni o\'qiymiz', en: "Reading the number" }, lead: { ru: 'Читаем классы слева направо.', uz: 'Sinflarni chapdan o\'ngga o\'qiymiz.', en: "We read classes from left to right." }, instruction: { ru: 'Как правильно прочитать 704 018?', uz: '704 018 soni qanday to\'g\'ri o\'qiladi?', en: "How is 704,018 read correctly?" }, options: [{ ru: 'семьсот четыре тысячи восемнадцать', uz: 'yetti yuz to\'rt ming o\'n sakkiz', en: "seven hundred and four thousand and eighteen" }, { ru: 'семьсот сорок тысяч восемнадцать', uz: 'yetti yuz qirq ming o\'n sakkiz', en: "seven hundred and forty thousand and eighteen" }, { ru: 'семьсот четыре тысячи сто восемь', uz: 'yetti yuz to\'rt ming bir yuz sakkiz', en: "seven hundred and four thousand one hundred and eight" }], correctIndex: 0, correctText: { ru: 'Левая группа читается как 704 тысячи, правая — как 18.', uz: 'Chap guruh 704 ming, o\'ng guruh esa 18 deb o\'qiladi.', en: "The left class reads as seven hundred and four thousand, and the right class reads as eighteen." }, wrong: [null, { ru: 'В левой группе ноль сохраняет разряд десятков тысяч.', uz: 'Chap guruhdagi nol o\'n mingliklar xonasini saqlaydi.', en: "In the left class, zero holds the ten-thousands place." }, { ru: 'Правая группа 018 означает восемнадцать.', uz: 'O\'ngdagi 018 guruhi o\'n sakkizni bildiradi.', en: "The right-hand group 018 stands for eighteen." }], audioIntro: { ru: 'Прочитай число семьсот четыре тысячи восемнадцать по классам.', uz: 'Yetti yuz to\'rt ming o\'n sakkiz sonini sinflar bo\'yicha o\'qing.', en: "Read the number seven hundred and four thousand and eighteen by classes." }, correctAudio: { ru: 'Верно. Оба класса прочитаны целыми группами.', uz: 'To\'g\'ri. Ikkala sinf ham yaxlit guruh sifatida o\'qildi.', en: "Correct. Both classes were read as complete groups." }, wrongAudio: { ru: 'Сохрани внутренние нули и прочитай каждую тройку целиком.', uz: 'Ichki nollarni saqlang va har bir uchlikni yaxlit o\'qing.', en: "Keep the internal zeros and read each class as a complete group." } }),
  p2: makeMicroPractice({ eyebrow: { ru: 'Практика 2', uz: '2-mashq' , en: "Practice 2"}, title: { ru: 'Находим значение цифры', uz: 'Raqam qiymatini topamiz', en: "Find the value of a digit" }, lead: { ru: 'Значение зависит от места.', uz: 'Qiymat o\'ringa bog\'liq.', en: "The value depends on the place." }, instruction: { ru: 'Каково значение цифры 7 в числе 704 018?', uz: '704 018 sonidagi 7 raqamining qiymati qancha?', en: "What is the value of the digit 7 in 704 018?" }, options: ['700 000', '70 000', '7 000'], correctIndex: 0, correctText: { ru: 'Цифра 7 стоит в разряде сотен тысяч.', uz: '7 raqami yuz mingliklar xonasida turibdi.', en: "The digit 7 is in the hundred-thousands place." }, wrong: [null, { ru: '70 000 — это разряд десятков тысяч.', uz: '70 000 o\'n mingliklar xonasini bildiradi.', en: "70,000 is the value of the ten-thousands place." }, { ru: '7 000 — это разряд тысяч.', uz: '7 000 mingliklar xonasini bildiradi.', en: "7,000 is the value of the thousands place." }], audioIntro: { ru: 'Найди значение цифры семь в числе семьсот четыре тысячи восемнадцать.', uz: 'Yetti yuz to\'rt ming o\'n sakkiz sonidagi yetti raqamining qiymatini toping.', en: "Find the value of the digit seven in seven hundred and four thousand and eighteen." }, correctAudio: { ru: 'Верно. Семь сотен тысяч дают семьсот тысяч.', uz: 'To\'g\'ri. Yetti yuz minglik yetti yuz mingni beradi.', en: "Correct. A seven in the hundred-thousands place represents seven hundred thousand." }, wrongAudio: { ru: 'Назови разряд цифры семь.', uz: 'Yetti raqami turgan xonani ayting.', en: "Name the place of the digit seven." } }),
  p3: makeMicroPractice({ eyebrow: { ru: 'Практика 3', uz: '3-mashq' , en: "Practice 3"}, title: { ru: 'Раскладываем число', uz: 'Sonni yoyamiz', en: "Expanding the number" }, lead: { ru: 'Каждую ненулевую цифру заменяем её значением.', uz: 'Har bir noldan farqli raqamni uning qiymati bilan almashtiramiz.', en: "We replace each non-zero digit with its value." }, instruction: { ru: 'Какая развёрнутая запись соответствует 620 405?', uz: '620 405 soniga qaysi yoyiq yozuv mos keladi?', en: "Which expanded form represents 620,405?" }, options: ['600 000 + 20 000 + 400 + 5', '600 000 + 2 000 + 400 + 5', '600 000 + 20 000 + 40 + 5'], correctIndex: 0, correctText: { ru: 'Двойка означает 20 000, а четвёрка — 400.', uz: '2 raqami 20 000 ni, 4 raqami esa 400 ni bildiradi.', en: "The digit two represents 20,000, and the digit four represents 400." }, wrong: [null, { ru: 'Цифра 2 стоит в десятках тысяч.', uz: '2 raqami o\'n mingliklar xonasida turibdi.', en: "The digit 2 is in the ten-thousands place." }, { ru: 'Цифра 4 стоит в сотнях.', uz: '4 raqami yuzliklar xonasida turibdi.', en: "The digit 4 is in the hundreds place." }], audioIntro: { ru: 'Выбери развёрнутую запись числа шестьсот двадцать тысяч четыреста пять.', uz: 'Olti yuz yigirma ming to\'rt yuz besh sonining yoyiq yozuvini tanlang.', en: "Choose the expanded form of the number six hundred and twenty thousand four hundred and five." }, correctAudio: { ru: 'Верно. Все ненулевые разрядные значения стоят на своих местах.', uz: 'To\'g\'ri. Barcha noldan farqli xona qiymatlari o\'z o\'rnida.', en: "Correct. All the non-zero place values are in the correct places." }, wrongAudio: { ru: 'Проверь место цифр два и четыре.', uz: 'Ikki va to\'rt raqamlarining o\'rnini tekshiring.', en: "Check the places of the digits two and four." } }),
  p4: makeMicroPractice({ eyebrow: { ru: 'Практика 4', uz: '4-mashq' , en: "Practice 4"}, title: { ru: 'Сравниваем слева', uz: 'Chapdan taqqoslaymiz', en: "Compare from the left" }, lead: { ru: 'Одинаковые старшие цифры пропускаем до первого различия.', uz: 'Bir xil katta xonalarni birinchi farqqacha o\'tkazamiz.', en: "Move from left to right past matching digits until you find the first difference." }, instruction: { ru: 'Какая запись верна?', uz: 'Qaysi yozuv to\'g\'ri?', en: "Which statement is correct?" }, options: ['508 070 < 508 700', '508 070 > 508 700', '508 070 = 508 700'], correctIndex: 0, correctText: { ru: 'Первое различие в разряде сотен: 0 меньше 7.', uz: 'Birinchi farq yuzlar xonasida: 0 soni 7 dan kichik.', en: "The first difference is in the hundreds place: 0 is less than 7." }, wrong: [null, { ru: 'В сотнях первое число меньше.', uz: 'Yuzlar xonasida birinchi son kichik.', en: "In the hundreds place, the first number is smaller." }, { ru: 'Разряд сотен различается, поэтому числа не равны.', uz: 'Yuzlar xonasi farq qiladi, shuning uchun sonlar teng emas.', en: "The hundreds digits differ, so the numbers are not equal." }], audioIntro: { ru: 'Сравни пятьсот восемь тысяч семьдесят и пятьсот восемь тысяч семьсот.', uz: 'Besh yuz sakkiz ming yetmish va besh yuz sakkiz ming yetti yuz sonlarini taqqoslang.', en: "Compare five hundred and eight thousand and seventy with five hundred and eight thousand seven hundred." }, correctAudio: { ru: 'Верно. Ноль сотен меньше семи сотен.', uz: 'To\'g\'ri. Nol yuzlik yetti yuzlikdan kichik.', en: "Correct. The first number has zero in the hundreds place, while the second has seven." }, wrongAudio: { ru: 'Найди первое различие слева.', uz: 'Chapdagi birinchi farqni toping.', en: "Find the first difference from the left." } }),
  p5: makeMicroPractice({ eyebrow: { ru: 'Практика 5', uz: '5-mashq' , en: "Practice 5"}, title: { ru: 'Округляем пакет', uz: 'Paketni yaxlitlaymiz', en: "Rounding the packet" }, lead: { ru: 'Для тысяч решение принимает цифра сотен.', uz: 'Mingliklar uchun qarorni yuzlar xonasidagi raqam beradi.', en: "For the nearest thousand, the hundreds digit makes the decision." }, instruction: { ru: 'Чему равно 306 450 при округлении до тысяч?', uz: '306 450 soni mingliklargacha yaxlitlanganda nechaga teng?', en: "What is 306,450 when rounded to the nearest thousand?" }, options: ['306 000', '307 000', '306 500'], correctIndex: 0, correctText: { ru: 'Цифра сотен 4, поэтому округляем вниз до 306 000.', uz: 'Yuzlar xonasida 4, shuning uchun pastga, 306 000 gacha yaxlitlaymiz.', en: "The hundreds digit is 4, so round down to 306,000." }, wrong: [null, { ru: 'При цифре 4 округляем вниз.', uz: '4 raqamida pastga yaxlitlaymiz.', en: "When the deciding digit is 4, round down." }, { ru: 'Нужно округлить до тысяч, поэтому справа три нуля.', uz: 'Mingliklargacha yaxlitlaymiz, shuning uchun o\'ngda uchta nol bo\'ladi.', en: "Round to the nearest thousand, so the result needs three zeros on the right." }], audioIntro: { ru: 'Округли триста шесть тысяч четыреста пятьдесят до тысяч.', uz: 'Uch yuz olti ming to\'rt yuz ellik sonini mingliklargacha yaxlitlang.', en: "Round three hundred and six thousand four hundred and fifty to the nearest thousand." }, correctAudio: { ru: 'Верно. Четыре сотни оставляют триста шесть тысяч.', uz: 'To\'g\'ri. To\'rt yuzlik uch yuz olti mingni saqlab qoladi.', en: "Correct. A hundreds digit of four rounds the number down to three hundred and six thousand." }, wrongAudio: { ru: 'Проверь цифру сотен и количество нулей справа.', uz: 'Yuzlar xonasidagi raqamni va o\'ngdagi nollar sonini tekshiring.', en: "Check the hundreds digit and the number of zeros on the right." } }),
  p6: makeMicroPractice({
    eyebrow: { ru: 'Городской перенос', uz: 'Shahar vaziyati', en: 'City transfer' },
    title: { ru: 'Пакет годового табло музея', uz: 'Muzeyning yillik tablo paketi', en: 'Museum annual dashboard packet' },
    lead: {
      ru: 'Музей Lumo City зарегистрировал 430 205 посетителей. Архиву нужна точная развёрнутая запись, а общему табло — число, округлённое до сотен.',
      uz: 'Lumo City muzeyi 430 205 nafar tashrifchini qayd etdi. Arxivga aniq yoyiq yozuv, umumiy tabloda esa yuzliklargacha yaxlitlangan son kerak.',
      en: 'The Lumo City museum recorded 430,205 visitors. The archive needs an exact expanded form, while the public dashboard needs the number rounded to the nearest hundred.',
    },
    instruction: {
      ru: 'Какой пакет передаст согласованные данные в архив и на табло?',
      uz: "Qaysi paket arxiv va tabloda o'zaro mos ma'lumotni ko'rsatadi?",
      en: 'Which packet sends consistent data to both the archive and the dashboard?',
    },
    options: [
      { ru: '430 205; 400 000 + 30 000 + 200 + 5; до сотен 430 200', uz: '430 205; 400 000 + 30 000 + 200 + 5; yuzliklargacha 430 200', en: '430,205; 400,000 + 30,000 + 200 + 5; to the nearest hundred: 430,200' },
      { ru: '430 205; 400 000 + 3 000 + 200 + 5; до сотен 430 300', uz: '430 205; 400 000 + 3 000 + 200 + 5; yuzliklargacha 430 300', en: '430,205; 400,000 + 3,000 + 200 + 5; to the nearest hundred: 430,300' },
      { ru: '430 205; 400 000 + 30 000 + 20 + 5; до сотен 430 000', uz: '430 205; 400 000 + 30 000 + 20 + 5; yuzliklargacha 430 000', en: '430,205; 400,000 + 30,000 + 20 + 5; to the nearest hundred: 430,000' },
    ],
    correctIndex: 0,
    correctText: { ru: 'Тройка означает 30 000, двойка — 200, а цифра десятков 0 округляет число до 430 200.', uz: "3 raqami 30 000 ni, 2 raqami 200 ni bildiradi, o'nlar xonasidagi 0 esa sonni 430 200 gacha yaxlitlaydi.", en: 'The digit three represents 30,000, the digit two represents 200, and the tens digit zero rounds the number to 430,200.' },
    wrong: [
      null,
      { ru: 'Цифра 3 стоит в десятках тысяч, а округление при нуле десятков идёт вниз.', uz: "3 raqami o'n mingliklarda turibdi, o'nlar xonasidagi 0 sababli pastga yaxlitlanadi.", en: 'The digit 3 is in the ten-thousands place, and a zero in the tens place means round down.' },
      { ru: 'Цифра 2 стоит в сотнях, а не в десятках.', uz: "2 raqami o'nliklarda emas, yuzliklarda turibdi.", en: 'The digit 2 is in the hundreds place, not the tens place.' },
    ],
    audioIntro: {
      ru: 'Музей зарегистрировал четыреста тридцать тысяч двести пять посетителей. Выбери согласованный пакет для точного архива и табло с округлением до сотен.',
      uz: "Muzey to'rt yuz o'ttiz ming ikki yuz besh nafar tashrifchini qayd etdi. Aniq arxiv va yuzliklargacha yaxlitlangan tablo uchun o'zaro mos paketni tanlang.",
      en: 'The museum recorded four hundred and thirty thousand two hundred and five visitors. Choose a consistent packet for the exact archive and the dashboard rounded to the nearest hundred.',
    },
    correctAudio: { ru: 'Верно. Чтение, разрядные значения и округление относятся к одному числу.', uz: "To'g'ri. O'qish, xona qiymatlari va yaxlitlash bitta songa tegishli.", en: 'Correct. The reading, place values and rounding all describe the same number.' },
    wrongAudio: { ru: 'Проверь место цифр три и два, затем посмотри на цифру десятков.', uz: "Uch va ikki raqamlarining o'rnini tekshiring, keyin o'nlar xonasiga qarang.", en: 'Check the places of the digits three and two, then look at the tens digit.' },
  }),
};

const SCREEN_PLAN = [
  { id: 's0', type: 'hook', subtype: 'complete-packet-mission', template: 'HookChoice', goal: 'Frame the integrated data packet', misconceptions: ['operations unrelated'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', contentKey: 's3', type: 'exploration', subtype: 'read-write', template: 'GuidedReveal', goal: 'Explain reading and writing by classes', misconceptions: ['zeros removed'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's2', contentKey: 'p1', type: 'test', subtype: 'reading-check', template: 'MCScreen', goal: 'Read a number by classes', misconceptions: ['digit-by-digit'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's3', contentKey: 's1', type: 'exploration', subtype: 'place-value', template: 'PlaceValueModel', goal: 'Explain positional value', misconceptions: ['digit equals value'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's4', contentKey: 'p2', type: 'test', subtype: 'place-value-check', template: 'MCScreen', goal: 'Find a digit value', misconceptions: ['wrong place'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's5', contentKey: 's4', type: 'exploration', subtype: 'expanded-form', template: 'RepresentationBuilder', goal: 'Connect standard and expanded forms', misconceptions: ['representations differ'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's6', contentKey: 'p3', type: 'test', subtype: 'expanded-form-check', template: 'MCScreen', goal: 'Choose expanded form', misconceptions: ['place shift'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's7', contentKey: 's5', type: 'exploration', subtype: 'comparison', template: 'CompareScanner', goal: 'Explain comparison from the left', misconceptions: ['last digit decides'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's8', contentKey: 'p4', type: 'test', subtype: 'comparison-check', template: 'MCScreen', goal: 'Compare two numbers', misconceptions: ['compare from right'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's9', contentKey: 's7', type: 'exploration', subtype: 'rounding', template: 'RoundingDecision', goal: 'Explain rounding in an integrated packet', misconceptions: ['wrong deciding digit'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's10', contentKey: 'p5', type: 'test', subtype: 'rounding-check', template: 'MCScreen', goal: 'Round to thousands', misconceptions: ['wrong target'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's11', type: 'rule', subtype: 'integrated-error', template: 'ErrorRepair', goal: 'Explain linked place-value errors', misconceptions: ['zeros optional'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's12', contentKey: 's6', type: 'strategy', subtype: 'integrated-strategy', template: 'RuleBuilder', goal: 'Build and choose the complete integrated workflow', misconceptions: ['partial workflow'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's13', contentKey: 'p6', type: 'case', subtype: 'life-transfer-packet', template: 'MCScreen', goal: 'Transfer the workflow to a complete real-world data packet', misconceptions: ['expansion or rounding shifted'], active: true, scored: true, scope: 'final', resetOnReturn: false },
  { id: 's14', type: 'summary', subtype: 'positional-bridge', template: 'ReflectionClaim', goal: 'Summarize place structure', misconceptions: ['value independent of position'], active: true, scored: false, scope: null, resetOnReturn: false },
];

const SCREEN_META = SCREEN_PLAN.map((meta) => ({ ...meta, contentKey: meta.contentKey ?? meta.id }));

const TOTAL_SCREENS = 15;
const MOBILE_DESIGN_W = 390;
const NOTION_FLOW = SCREEN_META.map((meta, screen) => ({ screen, meta, contentKeys: [meta.contentKey] }));

const LESSON_META = {
  lessonId: 'num-4-06-v1',
  lessonTitle: {
    ru: 'Урок 6. Разряды и классы чисел',
    uz: '6-dars. Sonlarning xonalari va sinflari',
    en: "Lesson 6: Places and number classes",
  },
  skillTags: ['classes_and_places', 'tenfold_shift', 'class_boundary', 'representation_invariant', 'read_write', 'expanded_form', 'comparison', 'rounding', 'integrated_packet', 'solution_lab'],
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

// The same canonical Bit used by the approved grade 4 lesson template.
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
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{nav}</footer>
    </main>
  );
};

const ShiftRoute = ({ model, t }) => {
  const values = model.number.split('→').map((value) => value.trim());
  return (
    <div className="shift-route" aria-label={model.number}>
      <div className="shift-track" aria-hidden="true" />
      {values.map((value, index) => (
        <div className="shift-stop" key={`${value}-${index}`} style={{ '--reveal-i': index }}>
          <strong>{value}</strong>
          <span>{t(model.steps[index])}</span>
          {index < values.length - 1 && <i aria-hidden="true">×10</i>}
        </div>
      ))}
    </div>
  );
};

const ModelPanel = ({ model, solved, theory = false }) => {
  const t = useT();
  if (!model) return null;
  return (
    <div className={`model-panel model-${model.kind} ${solved ? 'model-solved' : ''} ${theory ? 'theory-model' : ''}`}>
      <div className="model-heading">
        <span>{t(model.badge)}</span>
        {model.kind === 'city' && <i aria-hidden="true">● ● ●</i>}
      </div>
      {model.number && model.kind === 'shift' && <ShiftRoute model={model} t={t} />}
      {model.number && model.kind !== 'shift' && <div className="model-number">{t(model.number)}</div>}
      {model.groups && (
        <div className="class-groups">
          {model.groups.map((group, index) => (
            <div className={`class-group group-${group.tone ?? (index ? 'accent' : 'cyan')}`} key={`${group.value}-${index}`} style={{ '--reveal-i': index }}>
              <strong>{t(group.value)}</strong><span>{t(group.label)}</span>
            </div>
          ))}
        </div>
      )}
      {model.columns && (
        <div className="place-table" style={{ gridTemplateColumns: `repeat(${model.columns.length}, minmax(0, 1fr))` }}>
          {model.columns.map((column, index) => (
            <div className="place-cell" key={`${column.value}-${index}`} style={{ '--reveal-i': index }}>
              <span>{t(column.label)}</span><strong>{column.value}</strong>
            </div>
          ))}
        </div>
      )}
      {model.rows && (
        <div className={`model-rows ${model.rows.some((row) => String(t(row.value)).length > 20) ? 'model-rows-dense' : ''}`}>
          {model.rows.map((row, index) => (
            <div key={`${String(row.value)}-${index}`} style={{ '--reveal-i': index }}><span>{t(row.label)}</span><strong>{t(row.value)}</strong></div>
          ))}
        </div>
      )}
      {model.steps && model.kind !== 'shift' && (
        <ol className="model-steps">
          {model.steps.map((step, index) => <li key={`${t(step)}-${index}`} style={{ '--reveal-i': index }}>{t(step)}</li>)}
        </ol>
      )}
    </div>
  );
};

const PacketHookScene = ({ model, solved, picked }) => {
  const t = useT();
  const digits = String(model.number ?? '').replace(/\s/g, '').split('');
  const bitState = solved ? 'nod' : picked !== null ? 'think' : 'present';

  return (
    <section
      className={`hook-data-scene ${solved ? 'hook-data-scene-resolved' : ''}`}
      data-g4-role="hook-scene visual-frame"
      aria-hidden="true"
    >
      <div className="hook-data-grid" />
      <div className="hook-data-orbit hook-data-orbit-one" />
      <div className="hook-data-orbit hook-data-orbit-two" />

      <div className="hook-data-tower">
        <div className="hook-data-console-head">
          <span className="hook-data-node"><i /> LUMO DATA · NODE 06</span>
          <span className="hook-data-state">{t(model.badge)}</span>
        </div>

        <div className="hook-data-console">
          <div className="hook-data-label-row">
            <span>{t(model.badge)}</span>
            <small>№ {digits.length}</small>
          </div>
          <strong className="hook-data-number">
            {digits.map((digit, index) => (
              <React.Fragment key={`${digit}-${index}`}>
                {index === digits.length - 3 && <i className="hook-data-divider" />}
                <span style={{ '--hook-digit-delay': `${index * 90}ms` }}>{digit}</span>
              </React.Fragment>
            ))}
          </strong>
          <div className="hook-data-rows">
            {model.rows?.map((row, index) => (
              <div key={`${String(row.value)}-${index}`}>
                <span>{t(row.label)}</span>
                <strong>{t(row.value)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hook-city-network">
        <svg viewBox="0 0 150 72">
          <path className="hook-network-route" d="M12 54 C34 18 55 54 76 31 S119 11 139 35" />
          <circle className="hook-network-node hook-node-a" cx="12" cy="54" r="5" />
          <circle className="hook-network-node hook-node-b" cx="76" cy="31" r="5" />
          <circle className="hook-network-node hook-node-c" cx="139" cy="35" r="5" />
          <path className="hook-network-building" d="M119 58V37h9V25h12v33M115 58h30" />
          <path className="hook-network-windows" d="M124 43h4m5 0h4m-13 7h4m5 0h4" />
        </svg>
        <span>LUMO CITY</span>
      </div>

      <div className="hook-data-bit" data-g4-role="hook-bit"><BitSVG state={bitState} /></div>
    </section>
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

const THEORY_BIT_STATES = [
  'awkward', 'present', 'think', 'point', 'idea', 'focus', 'point', 'present',
  'idea', 'nod', 'focus', 'present', 'think', 'awkward', 'happy',
];

const formatTheoryResult = (value, t) => {
  const localized = t(value);
  if (/^\d{6}$/.test(localized)) return `${localized.slice(0, 3)} ${localized.slice(3)}`;
  return localized;
};

const TheoryCallout = ({ screen, result, children, tone = 'cyan' }) => {
  const lang = useLang();
  return (
    <section className={`theory-callout theory-callout-${tone}`} style={{ '--reveal-i': screen % 4 }}>
      <div className="theory-callout-mark" aria-hidden="true">{tone === 'warn' ? '!' : '✓'}</div>
      <div className="theory-callout-copy">
        <span>{lang === 'en' ? "EXPLANATION" : lang === 'ru' ? 'ОБЪЯСНЕНИЕ' : 'TUSHUNTIRISH'}</span>
        {result && <strong>{result}</strong>}
        <p>{children}</p>
      </div>
    </section>
  );
};

const PacketSolutionLab = ({ screen, content, t }) => {
  const lang = useLang();
  const labels = lang === 'en'
    ? { reading: 'READING', expanded: 'EXPANDED FORM', comparison: 'COMPARISON', rounded: 'TO THE NEAREST THOUSAND' }
    : lang === 'ru'
      ? { reading: 'ЧТЕНИЕ', expanded: 'РАЗЛОЖЕНИЕ', comparison: 'СРАВНЕНИЕ', rounded: 'ДО ТЫСЯЧ' }
      : { reading: "O'QILISHI", expanded: "YOYIQ YOZUV", comparison: 'TAQQOSLASH', rounded: 'MINGLIKKACHA' };

  return (
    <section className="packet-solution-lab" aria-label={t(content.instruction)}>
      <div className="packet-lab-question">
        <span>{lang === 'en' ? 'SOLUTION ROUTE' : lang === 'ru' ? 'МАРШРУТ РЕШЕНИЯ' : "YECHIM YO'LI"}</span>
        <strong>{t(content.instruction)}</strong>
      </div>
      <div className="packet-grid">
        {content.packets.map((packet, index) => (
          <article className={`packet-card packet-card-${index ? 'south' : 'north'}`} key={packet.number} style={{ '--reveal-i': index }}>
            <header><span>{t(packet.label)}</span><strong>{packet.number}</strong></header>
            <div className="packet-row"><i>{labels.reading}</i><b>{t(packet.reading)}</b></div>
            <div className="packet-row"><i>{labels.expanded}</i><b>{packet.expanded}</b></div>
            <div className="packet-row packet-row-accent"><i>{labels.comparison}</i><b>{packet.comparison}</b></div>
            <div className="packet-row packet-row-lime"><i>{labels.rounded}</i><b>{packet.rounded}</b></div>
            <p>{t(packet.note)}</p>
          </article>
        ))}
      </div>
      <TheoryCallout screen={screen} result={t(content.result)}>{t(content.correctText)}</TheoryCallout>
    </section>
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
    ? { ru: 'Эксперт по числам', uz: 'Sonlar eksperti', en: "Expert on numbers" }
    : firstTry >= Math.max(1, totalScored - 1)
      ? { ru: 'Мастер числовой системы', uz: 'Sonlar tizimi ustasi', en: "Number-system master" }
      : { ru: 'Исследователь данных', uz: "Ma'lumotlar tadqiqotchisi", en: "Data explorer" };
  const reflectionCopy = ({
    uz: { question: "Qaysi ko'nikma sizda eng ishonchli?", options: ["Sonni sinflar bo'yicha o'qish", "Xona qiymatini topish", "Ko'rinishlarni bog'lash"], wait: "Avval bitta xulosani tanlang" },
    ru: { question: 'Какой навык у тебя самый уверенный?', options: ['Читать число по классам', 'Находить разрядное значение', 'Связывать формы числа'], wait: 'Сначала выбери один вывод' },
    en: { question: 'Which skill feels most secure?', options: ['Reading by classes', 'Finding place value', 'Connecting number forms'], wait: 'Choose one reflection first' },
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
          <p>{lang === 'en' ? "The 704,018 data pack from the start of the lesson is complete. Classes, places and values are connected, so the Lumo City route is open." : lang === 'ru' ? 'Пакет данных 704 018 из начала урока полностью собран. Классы, разряды и значения связаны — маршрут Lumo City открыт.' : "Dars boshidagi 704 018 ma'lumot paketi to'liq yig'ildi. Sinf, xona va qiymat bog'langani uchun Lumo City yo'nalishi ochildi."}</p>
        </header>
        <div className="finale-layout">
          <div className="finale-main">
            <div className="finale-mastery">
              {c.model.steps.map((item, index) => (
                <article className={`finale-takeaway ${visible >= index + 1 ? 'is-visible' : ''}`} key={t(item)}><span>{String(index + 1).padStart(2, '0')}</span><p>{t(item)}</p></article>
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
  const isFinal = screen === TOTAL_SCREENS - 1;
  const resultSource = c.result ?? c.correctValue ?? c.options?.[c.correctIndex];
  const result = resultSource ? formatTheoryResult(resultSource, t) : '';
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}-intro`),
    ...localizedSegments(c.audio?.on_correct, lang, `s${screen}-explanation`),
  ], [c.audio, lang, screen]);
  const audio = useAudio(segments);
  const canContinue = useCanAnswer(audio);
  const isFoundation = meta.template === 'FoundationTheory' || meta.template === 'RecapTheory';
  const isRule = meta.template === 'RuleReveal';
  const isStrategy = meta.template === 'StrategyTheory';
  const isError = meta.template === 'ErrorWalkthrough';
  const isPacketLab = meta.template === 'PacketSolutionLab';
  const isSummary = meta.template === 'SummaryTheory';

  const proceed = () => {
    if (isFinal) finishLesson();
    else onNext();
  };
  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} hidden={screen === 0} /><NavNext onClick={proceed} disabled={!canContinue} finish={isFinal} /></>}
    >
      <div className={`screen-stack theory-screen theory-screen-${meta.template.toLowerCase()}`}>
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">{lang === 'en' ? 'LUMO CITY · KNOWLEDGE LAB' : lang === 'ru' ? 'LUMO CITY · ЛАБОРАТОРИЯ ЗНАНИЙ' : 'LUMO CITY · BILIM LABORATORIYASI'}</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className={`bit-coach bit-coach-${THEORY_BIT_STATES[screen]}`} data-g4-role="visual-frame">
            <BitSVG state={THEORY_BIT_STATES[screen]} />
          </div>
        </div>

        {isFoundation && (
          <div className="foundation-layout">
            <ModelPanel model={c.model} theory />
            <div className="foundation-copy">
              <span>{lang === 'en' ? "MAIN QUESTION" : lang === 'ru' ? 'ГЛАВНЫЙ ВОПРОС' : 'ASOSIY SAVOL'}</span>
              <h2>{t(c.instruction)}</h2>
              <TheoryCallout screen={screen} result={result}>{t(c.correctText)}</TheoryCallout>
            </div>
          </div>
        )}

        {!isFoundation && !isSummary && !isPacketLab && <ModelPanel model={c.model} theory />}

        {!isFoundation && !isRule && !isStrategy && !isError && !isPacketLab && !isSummary && (
          <div className="animated-explanation">
            <div className="theory-focus">
              <span>{lang === 'en' ? "OBSERVATION" : lang === 'ru' ? 'НАБЛЮДЕНИЕ' : 'KUZATUV'}</span>
              <h2>{t(c.instruction)}</h2>
            </div>
            <TheoryCallout screen={screen} result={result}>{t(c.correctText)}</TheoryCallout>
          </div>
        )}

        {isRule && (
          <section className="rule-reveal">
            <div className="rule-ribbon"><span>1</span><b>{lang === 'en' ? "Split into classes and read" : lang === 'ru' ? 'Раздели на классы и прочитай' : "Sinflarga ajrating va o'qing"}</b></div>
            <div className="rule-ribbon"><span>2</span><b>{lang === 'en' ? "Expand by place value" : lang === 'ru' ? 'Разложи по разрядным значениям' : 'Xona qiymatlariga yoying'}</b></div>
            <div className="rule-ribbon"><span>3</span><b>{lang === 'en' ? "Compare from left to right" : lang === 'ru' ? 'Сравни слева направо' : "Chapdan taqqoslang"}</b></div>
            <div className="rule-ribbon"><span>4</span><b>{lang === 'en' ? "Round to the required place" : lang === 'ru' ? 'Округли до нужной точности' : 'Kerakli aniqlikkacha yaxlitlang'}</b></div>
            <TheoryCallout screen={screen} result={result}>{t(c.correctText)}</TheoryCallout>
          </section>
        )}

        {isStrategy && (
          <section className="strategy-walkthrough">
            <div className="strategy-card strategy-recommended">
              <span>{lang === 'en' ? "THE MOST RELIABLE" : lang === 'ru' ? 'САМЫЙ НАДЁЖНЫЙ' : 'ENG ISHONCHLI'}</span>
              <strong>{t(c.options[c.correctIndex])}</strong>
              <p>{t(c.correctText)}</p>
            </div>
            <div className="strategy-card strategy-valid">
              <span>{lang === 'en' ? "CORRECT, BUT CHECK IT" : lang === 'ru' ? 'ВЕРНО, НО НУЖНА ПРОВЕРКА' : "TO'G'RI, AMMO EHTIYOT BO'LING"}</span>
              <strong>{t(c.options[1])}</strong>
              <p>{t(c.wrong[1])}</p>
            </div>
          </section>
        )}

        {isError && c.repairs && (
          <section className="multi-error-lab">
            {c.repairs.map((repair, index) => (
              <article className="repair-card" key={`${repair.before}-${index}`} style={{ '--reveal-i': index }}>
                <span>{t(repair.label)}</span>
                <div><s>{repair.before}</s><i aria-hidden="true">→</i><strong>{repair.after}</strong></div>
                <p>{t(repair.text)}</p>
              </article>
            ))}
            <TheoryCallout screen={screen} result={result} tone="cyan">{t(c.correctText)}</TheoryCallout>
          </section>
        )}

        {isError && !c.repairs && (
          <section className="error-walkthrough">
            <div className="error-state error-before">
              <span>{lang === 'en' ? "INCORRECT FORM" : lang === 'ru' ? 'ОШИБОЧНАЯ ЗАПИСЬ' : 'XATO YOZUV'}</span>
              <strong>{c.model.rows[0].value}</strong>
              <p>{t(c.lead)}</p>
            </div>
            <div className="repair-arrow" aria-hidden="true">→</div>
            <div className="error-state error-after">
              <span>{lang === 'en' ? "CORRECTION" : lang === 'ru' ? 'ИСПРАВЛЕНИЕ' : 'TUZATISH'}</span>
              <strong>{result}</strong>
              <p>{t(c.correctText)}</p>
            </div>
          </section>
        )}

        {isPacketLab && <PacketSolutionLab screen={screen} content={c} t={t} />}

        {isSummary && (
          <section className="summary-theory">
            <div className="summary-core">
              <ModelPanel model={c.model} theory />
              <TheoryCallout screen={screen} result={result} tone="cyan">{t(c.correctText)}</TheoryCallout>
            </div>
            <div className="summary-bridge"><span aria-hidden="true">→</span><p>{t(c.bridge)}</p></div>
          </section>
        )}
      </div>
    </Stage>
  );
};

const WorkedExamplesScreen = ({ screen, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const segments = useMemo(() => [
    ...localizedSegments(c.audio.intro, lang, `s${screen}-intro`),
    ...c.items.flatMap((item, index) => [
      ...localizedSegments(item.audio.intro, lang, `s${screen}-example-${index}-question`),
      ...localizedSegments(item.audio.on_correct, lang, `s${screen}-example-${index}-solution`),
    ]),
  ], [c.audio.intro, c.items, lang, screen]);
  const audio = useAudio(segments);
  const canContinue = useCanAnswer(audio);

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canContinue} /></>}
    >
      <div className="screen-stack worked-screen">
        <div className="screen-heading compact-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">{lang === 'en' ? 'LUMO CITY · SOLUTION WALL' : lang === 'ru' ? 'LUMO CITY · СТЕНА РЕШЕНИЙ' : 'LUMO CITY · YECHIMLAR DEVORI'}</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-point" data-g4-role="visual-frame"><BitSVG state="point" /></div>
        </div>
        <section className="worked-example-grid">
          {c.items.map((item, index) => (
            <article className="worked-example" key={`${t(item.question)}-${index}`} style={{ '--reveal-i': index }}>
              <div className="worked-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="worked-copy">
                <span>{lang === 'en' ? "EXAMPLE" : lang === 'ru' ? 'ПРИМЕР' : 'MISOL'}</span>
                <h2>{t(item.question)}</h2>
                <strong>{t(item.answer ?? item.options?.[item.correctIndex])}</strong>
                <p>{t(item.correctText)}</p>
              </div>
            </article>
          ))}
        </section>
        <div className="worked-complete" data-g4-role="visual-frame"><BitSVG state="nod" /><p>{t(c.completionText)}</p></div>
      </div>
    </Stage>
  );
};

const ChoiceScreen = ({ screen, contentKey, figure, choiceOrdinal, storedAnswer, onAnswer, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = PRACTICE_CONTENT[contentKey] ?? CONTENT[contentKey ?? `s${screen}`];
  const restorableAnswer = storedAnswer;
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
  const optionOrder = buildOptionOrder(c.options.length, c.correctIndex, LESSON_META.lessonId, choiceOrdinal);

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
      skillTag: SCREEN_META[screen].scope,
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
  const answerCards = (
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
            data-g4-source-index={sourceIndex}
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
  );
  const answerFeedback = (
    <FeedbackBlock show={picked !== null} correct={solved}>
      {feedbackCopy}
    </FeedbackBlock>
  );

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} hidden={screen === 0} /><NavNext onClick={proceed} disabled={!canAdvance} finish={isFinal} /></>}
    >
      <div className={`screen-stack ${isHook ? 'etalon-hook-screen' : ''}`} data-g4-screen={isHook ? 'hook' : undefined}>
        {isHook ? (
          <>
            <div className="topic-chip" data-g4-role="hook-topic">{t(c.eyebrow)}</div>
            <h1 className="title h-title" data-g4-role="hook-title">{t(c.title)}</h1>
            <h2 className="question-title" id={`question-${screen}`} data-g4-role="hook-question">{t(c.instruction)}</h2>
            {figure?.({ solved, picked })}
            <section className="hook-answer-panel" aria-labelledby={`question-${screen}`}>
              {answerCards}
              {answerFeedback}
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
            <section className="question-card" aria-labelledby={`question-${screen}`}>
              <div className="question-topline">
                <span>{lang === 'en' ? "YOUR DECISION" : lang === 'ru' ? 'ТВОЁ РЕШЕНИЕ' : 'SIZNING QARORINGIZ'}</span>
                {!canAnswer && <small>{lang === 'en' ? "Listen to the full explanation first" : lang === 'ru' ? 'Сначала дослушай объяснение' : 'Avval tushuntirishni tinglang'}</small>}
              </div>
              <h2 id={`question-${screen}`}>{t(c.instruction)}</h2>
              {answerCards}
              {answerFeedback}
            </section>
          </>
        )}
      </div>
    </Stage>
  );
};

const sanitizeNumeric = (raw) => String(raw ?? '')
  .replace(/[^\d]/g, '')
  .replace(/^0+(?=\d)/, '')
  .slice(0, 6);

const NumericInputScreen = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT['s' + screen];
  const restored = storedAnswer?.solved === true;
  const [value, setValue] = useState(restored ? String(storedAnswer.studentAnswer) : String(storedAnswer?.studentAnswer ?? ''));
  const [solved, setSolved] = useState(restored);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [lastWrongValue, setLastWrongValue] = useState(restored ? null : (storedAnswer?.lastWrongValue ?? null));
  const segments = useMemo(
    () => localizedSegments(c.audio.intro, lang, 's' + screen),
    [c.audio.intro, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);

  const submit = () => {
    const normalized = sanitizeNumeric(value);
    if (!canAnswer || solved || !normalized) return;
    const nextAttempts = attempts + 1;
    const correct = normalized === c.correctValue;
    setAttempts(nextAttempts);
    if (!correct) {
      setLastWrongValue(normalized);
      playSfx('wrong');
      audio.pushOneOff(t(c.inputWrongAudio));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.instruction),
        options: null,
        correctIndex: null,
        correctAnswer: c.correctValue,
        studentAnswerIndex: null,
        studentAnswer: normalized,
        correct: false,
        firstTry: false,
        attempts: nextAttempts,
        skillTag: SCREEN_META[screen].subtype,
        solved: false,
        lastWrongValue: normalized,
      });
      return;
    }
    setValue(normalized);
    setSolved(true);
    setLastWrongValue(null);
    playSfx('correct');
    audio.pushOneOff(t(c.audio.on_correct));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.instruction),
      options: null,
      correctIndex: null,
      correctAnswer: c.correctValue,
      studentAnswerIndex: null,
      studentAnswer: normalized,
      correct: true,
      firstTry: nextAttempts === 1,
      attempts: nextAttempts,
      skillTag: SCREEN_META[screen].subtype,
      solved: true,
      lastWrongValue: null,
    });
  };

  const wrongFeedback = c.wrongByValue?.[lastWrongValue] ?? c.wrongText;

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
            <span className="lesson-kicker">{lang === 'en' ? 'LUMO CITY · VALUE CONSOLE' : lang === 'ru' ? 'LUMO CITY · ПАНЕЛЬ ЗНАЧЕНИЙ' : 'LUMO CITY · QIYMAT PANELI'}</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach" data-g4-role="visual-frame"><BitSVG state={solved ? 'nod' : 'present'} /></div>
        </div>
        <ModelPanel model={c.model} solved={solved} />
        <section className="question-card" aria-labelledby={'question-' + screen}>
          <div className="question-topline">
            <span>{lang === 'en' ? "ENTER YOUR ANSWER" : lang === 'ru' ? 'ВВЕДИ ОТВЕТ' : 'JAVOBNI KIRITING'}</span>
            {!canAnswer && <small>{lang === 'en' ? "Listen to the full explanation first" : lang === 'ru' ? 'Сначала дослушай объяснение' : 'Avval tushuntirishni tinglang'}</small>}
          </div>
          <h2 id={'question-' + screen}>{t(c.instruction)}</h2>
          <div className="input-action-row">
            <input
              type="text"
              inputMode="numeric"
              data-qa-answer={runtimeConfig.previewMode ? c.correctValue : undefined}
              className={'answer-input ' + (solved ? 'correct' : lastWrongValue !== null ? 'wrong' : '')}
              value={value}
              placeholder={t(c.placeholder)}
              aria-label={t(c.instruction)}
              disabled={solved || !canAnswer}
              onChange={(event) => {
                setValue(sanitizeNumeric(event.target.value));
                setLastWrongValue(null);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submit();
              }}
            />
            <button
              type="button"
              className={'btn btn-white-accent ' + (value && canAnswer && !solved ? 'btn-ready' : '')}
              disabled={!value || !canAnswer || solved}
              onClick={submit}
            >
              {lang === 'en' ? "Check" : lang === 'ru' ? 'Проверить' : 'Tekshirish'}
            </button>
          </div>
          <FeedbackBlock show={solved || lastWrongValue !== null} correct={solved}>
            {t(solved ? c.correctText : wrongFeedback)}
          </FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
};

const MicroTheoryScreen = ({ screen, contentKey, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey];
  const meta = SCREEN_META[screen];
  const [step, setStep] = useState(0);
  const isRuleBuilder = meta.template === 'RuleBuilder';
  const isCompare = ['PlaceValueModel', 'RepresentationBuilder', 'CompareScanner'].includes(meta.template);
  const requiredStep = isRuleBuilder ? 2 : 1;
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}-micro-intro`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canInteract = audio.muted || audio.completed || !audio.isPlaying;
  const canAdvance = useCanAnswer(audio) && step >= requiredStep;
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
        <section className="micro-theory-card">
          <span>{lang === 'en' ? "OBSERVATION" : lang === 'ru' ? 'НАБЛЮДЕНИЕ' : 'KUZATUV'}</span>
          {example && <strong className="micro-theory-example">{t(example)}</strong>}
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

const screenFigure = (screen) => {
  if (screen === 0) {
    return ({ solved, picked }) => <PacketHookScene model={CONTENT.s0.model} solved={solved} picked={picked} />;
  }
  return null;
};

const Screen0 = (props) => <ChoiceScreen {...props} contentKey="s0" figure={screenFigure(0)} choiceOrdinal={0} />;
const Screen1 = (props) => <MicroTheoryScreen {...props} contentKey="s3" />;
const Screen2 = (props) => <ChoiceScreen {...props} contentKey="p1" choiceOrdinal={0} />;
const Screen3 = (props) => <MicroTheoryScreen {...props} contentKey="s1" />;
const Screen4 = (props) => <ChoiceScreen {...props} contentKey="p2" choiceOrdinal={1} />;
const Screen5 = (props) => <MicroTheoryScreen {...props} contentKey="s4" />;
const Screen6 = (props) => <ChoiceScreen {...props} contentKey="p3" choiceOrdinal={2} />;
const Screen7 = (props) => <MicroTheoryScreen {...props} contentKey="s5" />;
const Screen8 = (props) => <ChoiceScreen {...props} contentKey="p4" choiceOrdinal={3} />;
const Screen9 = (props) => <MicroTheoryScreen {...props} contentKey="s7" />;
const Screen10 = (props) => <ChoiceScreen {...props} contentKey="p5" choiceOrdinal={4} />;
const Screen11 = (props) => <MicroTheoryScreen {...props} contentKey="s11" />;
const Screen12 = (props) => <MicroTheoryScreen {...props} contentKey="s6" />;
const Screen13 = (props) => <ChoiceScreen {...props} contentKey="p6" choiceOrdinal={5} />;
const Screen14 = (props) => <FinaleScreen {...props} />;

// Kept as approved visual references while the compact, no-scroll flow is active.
Object.freeze([TheoryScreen, WorkedExamplesScreen, NumericInputScreen]);

const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars06({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
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
    else console.log('[Grade4 Dars06 preview]', payload);
  }, [answers, lang, onFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
  const previous = () => setCurrent((value) => Math.max(value - 1, 0));

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className={`lesson-root ${showPreviewControls ? 'lesson-root-preview' : ''}`}>
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
  padding-top: 10px;
  padding-bottom: 8px;
  background: rgba(245,245,240,.94);
  backdrop-filter: blur(14px);
  z-index: 3;
}
.progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 10px;
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
  justify-content: center;
}
.stage-content > .screen-stack { max-height: 100%; transform-origin: top center; }
.screen-stack.etalon-hook-screen { min-height: 100%; gap: 8px; }
.title { font-family: 'Source Serif 4', Georgia, serif; font-weight: 650; line-height: 1.08; letter-spacing: -.012em; }
.h-title { font-size: clamp(24px, 3.7vw, 34px); text-align: center; }
.topic-chip { align-self: center; padding: 6px 11px; border-radius: 999px; color: ${T.cyan}; background: ${T.cyanSoft}; font-size: 10px; font-weight: 800; }
.question-title { color: ${T.ink}; font-size: clamp(16px, 2.2vw, 20px); line-height: 1.25; font-weight: 750; text-align: center; }
.etalon-hook-screen .h-title,
.etalon-hook-screen .question-title { text-align: left; }
.hook-data-scene {
  position: relative;
  isolation: isolate;
  width: min(760px, 100%);
  min-height: 206px;
  margin: 0 auto;
  padding: 17px 184px 15px 20px;
  border-radius: 24px;
  overflow: hidden;
  color: #EAF9FB;
  background:
    radial-gradient(circle at 87% 24%, rgba(121,211,218,.16), transparent 24%),
    radial-gradient(circle at 9% 88%, rgba(149,201,61,.11), transparent 25%),
    linear-gradient(145deg, rgba(22,143,163,.25), transparent 48%),
    linear-gradient(135deg, #153B50, #0B2232 72%);
  box-shadow: 0 22px 50px -30px rgba(14,33,44,.75);
}
.hook-data-scene::after { content: ''; position: absolute; inset: 1px; z-index: -1; border: 1px solid rgba(144,228,235,.12); border-radius: 23px; pointer-events: none; }
.hook-data-grid { position: absolute; inset: 0; z-index: -2; opacity: .18; background-image: linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px); background-size: 30px 30px; }
.hook-data-orbit { position: absolute; z-index: -1; border: 1px solid rgba(121,211,218,.15); border-radius: 50%; pointer-events: none; }
.hook-data-orbit-one { width: 210px; height: 210px; right: -75px; top: -98px; }
.hook-data-orbit-two { width: 145px; height: 145px; right: -43px; top: -57px; }
.hook-data-tower { position: relative; z-index: 2; }
.hook-data-console-head { min-height: 22px; margin-bottom: 7px; display: flex; align-items: center; justify-content: space-between; gap: 8px; font-family: 'JetBrains Mono',monospace; }
.hook-data-node { display: inline-flex; align-items: center; gap: 7px; color: #9DE3E7; font-size: 8px; font-weight: 800; letter-spacing: .13em; }
.hook-data-node > i { width: 9px; height: 9px; flex: 0 0 9px; border-radius: 50%; background: ${T.lime}; box-shadow: 0 0 15px rgba(149,201,61,.9); }
.hook-data-state { padding: 4px 7px; border: 1px solid rgba(255,183,107,.22); border-radius: 999px; color: #FFD29E; background: rgba(169,111,19,.16); font-size: 7px; font-weight: 850; letter-spacing: .06em; white-space: nowrap; transition: color .8s ease,border-color .8s ease,background .8s ease; }
.hook-data-scene-resolved .hook-data-state { border-color: rgba(119,222,168,.26); color: #B5F2D2; background: rgba(34,122,83,.2); }
.hook-data-console { position: relative; width: 100%; padding: 10px 14px 8px; border-radius: 15px; overflow: hidden; background: rgba(1,13,22,.62); box-shadow: inset 0 0 0 1px rgba(144,228,235,.18),0 12px 26px -22px rgba(1,13,22,.9); }
.hook-data-label-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: #79D3DA; font-family: 'JetBrains Mono',monospace; font-size: 8px; font-weight: 800; letter-spacing: .16em; }
.hook-data-label-row small { color: rgba(234,249,251,.55); font-size: 7px; font-weight: 800; letter-spacing: .08em; }
.hook-data-number { min-height: 58px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono',monospace; font-size: clamp(28px,5vw,43px); font-weight: 800; letter-spacing: .08em; }
.hook-data-number > span { display: inline-grid; place-items: center; min-width: .78em; animation: hook-data-digit-in .65s cubic-bezier(.16,1,.3,1) both; animation-delay: var(--hook-digit-delay); transition: color .8s ease,transform 1.15s cubic-bezier(.22,.8,.3,1); }
@keyframes hook-data-digit-in { from { opacity: 0; transform: translateY(9px) scale(.9); filter: blur(4px); } to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
.hook-data-divider { width: 4px; height: 48px; margin: 0 9px; border-radius: 99px; background: ${T.accent}; box-shadow: 0 0 16px rgba(255,91,53,.45); }
.hook-data-scene-resolved .hook-data-number > span:nth-of-type(-n+3) { color: #A8EAF0; transform: translateX(-3px); }
.hook-data-scene-resolved .hook-data-number > span:nth-last-of-type(-n+3) { color: #FFFFFF; transform: translateX(3px); }
.hook-data-rows { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
.hook-data-rows > div { min-width: 0; min-height: 30px; padding: 4px 7px; border: 1px solid rgba(144,228,235,.08); border-radius: 7px; display: flex; align-items: center; justify-content: space-between; gap: 7px; color: rgba(234,249,251,.68); background: rgba(255,255,255,.055); }
.hook-data-rows span { flex: 0 0 auto; font-family: 'JetBrains Mono',monospace; font-size: 7px; font-weight: 800; text-transform: uppercase; }
.hook-data-rows strong { min-width: 0; overflow-wrap: anywhere; color: #D6F5F7; font-size: 9px; line-height: 1.2; text-align: right; }
.hook-city-network { position: absolute; z-index: 1; top: 18px; right: 14px; width: 154px; color: rgba(157,227,231,.58); }
.hook-city-network svg { display: block; width: 100%; height: auto; overflow: visible; }
.hook-city-network > span { display: block; margin-top: -1px; font-family: 'JetBrains Mono',monospace; font-size: 6px; font-weight: 800; letter-spacing: .1em; text-align: center; }
.hook-network-route { fill: none; stroke: rgba(121,211,218,.45); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 4 6; transition: stroke .8s ease,stroke-width .8s ease; }
.hook-network-node { fill: #12384B; stroke: #79D3DA; stroke-width: 2; transform-box: fill-box; transform-origin: center; }
.hook-network-building,.hook-network-windows { fill: none; stroke: rgba(234,249,251,.68); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.hook-network-windows { stroke-width: 1.4; }
.hook-data-scene-resolved .hook-network-route { stroke: #77DEA8; stroke-width: 3; }
.hook-data-scene-resolved .hook-network-node { fill: #77DEA8; stroke: #B5F2D2; }
.hook-data-bit { position: absolute; z-index: 2; right: 42px; bottom: -4px; width: 88px; height: 110px; }
.hook-data-bit .g1-char { width: 100%; height: 100%; filter: drop-shadow(0 7px 13px rgba(1,13,22,.28)); }
.hook-answer-panel { width: min(760px,100%); margin: 0 auto; }
.hook-answer-panel .options-grid { margin-top: 0; }
.etalon-hook-screen .option { min-height: 54px; padding: 9px 12px; font-size: 14px; }
.etalon-hook-screen .feedback { height: 74px; margin-top: 6px; }
.etalon-hook-screen .feedback-card { min-height: 74px; padding-block: 5px; grid-template-columns: 64px minmax(0,1fr); }
.etalon-hook-screen .feedback-card .g1-char { width: 56px; height: 60px; }
.micro-theory-screen { gap: 10px; }
.micro-theory-screen { width: 100%; max-height: 100%; gap: 10px; }
.micro-theory-card { display: grid; gap: 8px; min-width: 0; padding: clamp(12px, 2vw, 18px); border-radius: 20px; background: rgba(255,255,255,.88); box-shadow: 0 12px 30px -22px rgba(${T.shadowBase},.45); }
.micro-theory-card > span { color: ${T.cyan}; font-size: 10px; font-weight: 900; letter-spacing: .12em; }
.micro-theory-card h2, .micro-theory-card p { margin: 0; overflow-wrap: anywhere; }
.micro-theory-card h2 { font: 700 clamp(16px, 2.4vw, 23px)/1.2 'Source Serif 4', serif; }
.micro-theory-card p { color: ${T.ink2}; font-size: clamp(12px, 1.7vw, 15px); line-height: 1.45; }
.micro-theory-example { color: ${T.navy}; font: 800 clamp(22px, 4vw, 38px)/1 'JetBrains Mono', monospace; overflow-wrap: anywhere; }
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
.stage-nav {
  flex: 0 0 auto;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: max(10px, env(safe-area-inset-bottom));
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
.bit-coach .g1-char { width: 92px; height: 115px; }
.g1-char {
  display: block;
  height: 100%;
  width: auto;
  overflow: visible;
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
.g1-char-state-awkward .g1-bit-ant {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: bit-awkward-antenna .7s ease both;
}
.g1-char-state-awkward .bit-awkward-face { animation: bit-awkward-blink 1.4s ease-in-out 2; }
@keyframes bit-wave-left { 0%, 100% { transform: rotate(2deg); } 50% { transform: rotate(25deg); } }
@keyframes bit-wave-right { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(-25deg); } }
@keyframes bit-think-tap { 0%, 100% { transform: translate(0, 0) rotate(0); } 50% { transform: translate(-2px, -3px) rotate(-7deg); } }
@keyframes bit-point { 0%, 100% { transform: translateX(0) rotate(0); } 48% { transform: translateX(4px) rotate(-5deg); } }
@keyframes bit-target { 0%, 100% { opacity: .38; transform: scale(.72); } 50% { opacity: 1; transform: scale(1.1); } }
@keyframes bit-idea { 0%, 100% { opacity: .72; transform: translateY(1px) scale(.9); } 50% { opacity: 1; transform: translateY(-3px) scale(1.08); } }
@keyframes bit-focus { 0%, 100% { transform: scale(.96); } 50% { transform: scale(1.05); } }
@keyframes bit-scan { 0%, 100% { opacity: .42; transform: translateY(-3px); } 50% { opacity: 1; transform: translateY(6px); } }
@keyframes bit-nod-hand { 0%, 100% { transform: rotate(0); } 48% { transform: rotate(-11deg); } }
@keyframes bit-check { 0%, 100% { transform: scale(.86); opacity: .72; } 50% { transform: scale(1.08); opacity: 1; } }
@keyframes bit-awkward-antenna { to { transform: rotate(-13deg) translateY(2px); } }
@keyframes bit-awkward-blink { 45%, 55% { opacity: .55; transform: translateY(1px); } }
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
.model-rows-dense strong { max-width: 72%; font-size: clamp(12px, 2vw, 17px); line-height: 1.35; text-align: right; white-space: normal; }
.model-boundary .model-number { font-size: clamp(28px, 5vw, 46px); }
.model-boundary .class-group strong { font-size: clamp(22px, 3.8vw, 34px); white-space: nowrap; }
.model-steps { position: relative; z-index: 1; list-style: none; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px; counter-reset: none; }
.model-steps li { min-height: 64px; padding: 11px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(255,255,255,.10); text-align: center; font-size: 12px; line-height: 1.35; font-weight: 720; }
.model-solved { box-shadow: 0 15px 34px -18px rgba(34,122,83,.58), inset 0 0 0 2px rgba(149,201,61,.26); }
.shift-route {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}
.shift-track {
  position: absolute;
  z-index: -1;
  left: 5%;
  right: 5%;
  top: 37px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, ${T.cyan}, ${T.lime});
  box-shadow: 0 0 12px rgba(149,201,61,.35);
  transform-origin: left;
  animation: shift-track-grow 1.25s cubic-bezier(.16,1,.3,1) .18s both;
}
.shift-stop {
  position: relative;
  min-width: 0;
  min-height: 91px;
  padding: 11px 5px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid rgba(121,211,218,.17);
  border-radius: 13px;
  background: rgba(255,255,255,.10);
  animation: shift-stop-in .68s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.24s + var(--reveal-i, 0) * .14s);
}
.shift-stop strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2vw, 18px); white-space: nowrap; }
.shift-stop span { color: rgba(255,255,255,.68); font-size: 8px; line-height: 1.2; text-align: center; }
.shift-stop i {
  position: absolute;
  z-index: 3;
  right: -16px;
  top: 29px;
  padding: 2px 4px;
  border-radius: 6px;
  color: ${T.navy};
  background: ${T.lime};
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-style: normal;
  font-weight: 900;
}
.model-shift .class-groups { margin-top: 2px; }
@keyframes shift-track-grow { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }
@keyframes shift-stop-in { from { opacity: 0; transform: translateX(-16px) scale(.9); } to { opacity: 1; transform: translateX(0) scale(1); } }
.theory-model {
  animation: theory-model-in .62s cubic-bezier(.16,1,.3,1) .1s both;
}
.theory-model .model-number,
.theory-model .class-group,
.theory-model .place-cell,
.theory-model .model-rows > div,
.theory-model .model-steps > li {
  animation: theory-item-in .62s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.25s + var(--reveal-i, 0) * .09s);
}
@keyframes theory-model-in {
  from { opacity: 0; transform: translateY(12px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes theory-item-in {
  from { opacity: 0; transform: translateY(10px) scale(.94); filter: blur(3px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
.foundation-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
}
.foundation-layout > .model-panel {
  width: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.foundation-layout .model-city .model-rows {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.foundation-copy {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  border: 1px solid rgba(22,143,163,.12);
  border-radius: 20px;
  background: linear-gradient(145deg, ${T.paper}, ${T.cyanSoft});
  box-shadow: 0 14px 30px -22px rgba(${T.shadowBase},.36);
  animation: theory-copy-in .7s cubic-bezier(.16,1,.3,1) .28s both;
}
.foundation-copy > span,
.theory-focus > span,
.theory-callout-copy > span,
.strategy-card > span,
.error-state > span,
.worked-copy > span {
  color: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .13em;
}
.foundation-copy > h2,
.theory-focus > h2 {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(18px, 2.6vw, 25px);
  font-weight: 650;
  line-height: 1.25;
}
.animated-explanation {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
}
.theory-focus {
  min-height: 112px;
  padding: 17px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
  border-radius: 17px;
  color: ${T.navy};
  background: ${T.accentSoft};
  box-shadow: inset 4px 0 0 ${T.accent};
  animation: theory-copy-in .62s cubic-bezier(.16,1,.3,1) .38s both;
}
.theory-focus > span { color: ${T.accent}; }
.animated-explanation > .theory-focus,
.animated-explanation > .theory-callout {
  width: 100%;
  min-height: 0;
}
.animated-explanation > .theory-focus { padding: 14px 16px; }
.theory-callout {
  min-height: 112px;
  padding: 14px 16px 14px 10px;
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(34,122,83,.16);
  border-radius: 17px;
  color: ${T.ink};
  background: linear-gradient(135deg, ${T.paper}, ${T.successSoft});
  box-shadow: 0 14px 28px -22px rgba(34,122,83,.48);
  animation: theory-copy-in .68s cubic-bezier(.16,1,.3,1) calc(.5s + var(--reveal-i, 0) * .04s) both;
}
.theory-callout-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: ${T.paper};
  background: ${T.success};
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  font-weight: 900;
  box-shadow: 0 8px 18px -10px rgba(34,122,83,.65);
}
.theory-callout-copy { min-width: 0; display: grid; gap: 4px; }
.theory-callout-copy > span { color: ${T.success}; }
.theory-callout-copy > strong {
  color: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(15px, 2.4vw, 21px);
  line-height: 1.25;
}
.theory-callout-copy > p { color: ${T.ink2}; font-size: 13px; line-height: 1.45; }
.theory-callout-cyan { border-color: rgba(22,143,163,.16); background: linear-gradient(135deg, ${T.paper}, ${T.cyanSoft}); }
.theory-callout-cyan .theory-callout-mark { background: ${T.cyan}; }
.rule-reveal {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
}
.rule-ribbon {
  min-height: 86px;
  padding: 12px 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  border-radius: 15px;
  color: ${T.navy};
  background: ${T.paper};
  box-shadow: 0 10px 24px -18px rgba(${T.shadowBase},.36);
  animation: theory-item-in .62s cubic-bezier(.16,1,.3,1) both;
}
.rule-ribbon:nth-child(1) { animation-delay: .18s; }
.rule-ribbon:nth-child(2) { animation-delay: .3s; }
.rule-ribbon:nth-child(3) { animation-delay: .42s; }
.rule-ribbon:nth-child(4) { animation-delay: .54s; }
.rule-ribbon > span {
  width: 31px;
  height: 31px;
  flex: 0 0 31px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: ${T.paper};
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-weight: 900;
}
.rule-ribbon > b { font-size: 12px; line-height: 1.35; }
.rule-reveal > .theory-callout { grid-column: 1 / -1; }
.strategy-walkthrough {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.strategy-card {
  min-height: 154px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 18px;
  animation: theory-copy-in .68s cubic-bezier(.16,1,.3,1) both;
}
.strategy-card > strong { color: ${T.navy}; font-family: 'Source Serif 4', Georgia, serif; font-size: 17px; line-height: 1.32; }
.strategy-card > p { margin-top: auto; color: ${T.ink2}; font-size: 12px; line-height: 1.42; }
.strategy-recommended { border: 1px solid rgba(34,122,83,.2); background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; animation-delay: .35s; }
.strategy-recommended > span { color: ${T.success}; }
.strategy-valid { border: 1px solid rgba(169,111,19,.18); background: ${T.warnSoft}; box-shadow: inset 4px 0 0 ${T.warn}; animation-delay: .52s; }
.strategy-valid > span { color: ${T.warn}; }
.error-walkthrough {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 42px minmax(0, 1fr);
  align-items: stretch;
  gap: 10px;
}
.multi-error-lab { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.repair-card {
  min-height: 146px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  border: 1px solid rgba(22,143,163,.14);
  border-radius: 17px;
  background: ${T.paper};
  box-shadow: 0 12px 28px -22px rgba(${T.shadowBase},.38);
  animation: theory-item-in .68s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.24s + var(--reveal-i, 0) * .16s);
}
.repair-card > span { color: ${T.cyan}; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 900; letter-spacing: .11em; }
.repair-card > div { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 900; }
.repair-card s { color: ${T.warn}; text-decoration-thickness: 2px; }
.repair-card i { color: ${T.accent}; font-style: normal; }
.repair-card strong { color: ${T.success}; }
.repair-card p { margin-top: auto; color: ${T.ink2}; font-size: 11px; line-height: 1.42; }
.multi-error-lab > .theory-callout { grid-column: 1 / -1; }
.packet-solution-lab { display: grid; gap: 11px; }
.packet-lab-question {
  min-height: 64px;
  padding: 12px 16px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  border-radius: 16px;
  color: ${T.navy};
  background: ${T.accentSoft};
  box-shadow: inset 4px 0 0 ${T.accent}, 0 10px 24px -20px rgba(${T.shadowBase},.34);
  animation: theory-copy-in .62s cubic-bezier(.16,1,.3,1) .16s both;
}
.packet-lab-question > span { color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 900; letter-spacing: .1em; }
.packet-lab-question > strong { font-family: 'Source Serif 4', Georgia, serif; font-size: 17px; line-height: 1.3; }
.packet-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 11px; }
.packet-card {
  min-width: 0;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid rgba(22,143,163,.14);
  border-radius: 18px;
  background: ${T.paper};
  box-shadow: 0 16px 32px -24px rgba(${T.shadowBase},.44);
  animation: theory-item-in .68s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.3s + var(--reveal-i, 0) * .18s);
}
.packet-card-north { box-shadow: inset 4px 0 0 ${T.cyan}, 0 16px 32px -24px rgba(${T.shadowBase},.44); }
.packet-card-south { box-shadow: inset 4px 0 0 ${T.accent}, 0 16px 32px -24px rgba(${T.shadowBase},.44); }
.packet-card > header { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-bottom: 7px; }
.packet-card > header span { color: ${T.cyan}; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 900; letter-spacing: .1em; }
.packet-card-south > header span { color: ${T.accent}; }
.packet-card > header strong { color: ${T.navy}; font-family: 'JetBrains Mono', monospace; font-size: clamp(20px, 3vw, 27px); white-space: nowrap; }
.packet-row { min-height: 49px; padding: 8px 10px; display: grid; align-content: center; gap: 4px; border-radius: 12px; background: ${T.bg}; }
.packet-row > i { color: ${T.ink2}; font-family: 'JetBrains Mono', monospace; font-size: 8px; font-style: normal; font-weight: 900; letter-spacing: .1em; }
.packet-row > b { color: ${T.navy}; font-size: 11px; line-height: 1.38; overflow-wrap: anywhere; }
.packet-row-accent { background: ${T.cyanSoft}; }
.packet-row-accent > b { font-family: 'JetBrains Mono', monospace; color: ${T.cyan}; font-size: 14px; }
.packet-row-lime { background: ${T.successSoft}; }
.packet-row-lime > b { font-family: 'JetBrains Mono', monospace; color: ${T.success}; font-size: 14px; }
.packet-card > p { margin-top: auto; color: ${T.ink2}; font-size: 11px; line-height: 1.42; }
.packet-solution-lab > .theory-callout { animation-delay: .7s; }
.error-state {
  min-height: 150px;
  padding: 17px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 18px;
  animation: theory-copy-in .68s cubic-bezier(.16,1,.3,1) both;
}
.error-state > strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 2.5vw, 24px); line-height: 1.3; }
.error-state > p { margin-top: auto; font-size: 12px; line-height: 1.43; }
.error-before { color: ${T.warn}; background: ${T.warnSoft}; box-shadow: inset 4px 0 0 ${T.warn}; animation-delay: .3s; }
.error-before > span { color: ${T.warn}; }
.error-after { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; animation-delay: .58s; }
.error-after > span { color: ${T.success}; }
.repair-arrow { display: grid; place-items: center; color: ${T.accent}; font-size: 28px; font-weight: 900; animation: repair-arrow-in .7s cubic-bezier(.16,1,.3,1) .46s both; }
@keyframes repair-arrow-in { from { opacity: 0; transform: translateX(-8px) scale(.7); } to { opacity: 1; transform: translateX(0) scale(1); } }
.summary-theory { display: grid; gap: 12px; }
.summary-core { display: grid; grid-template-columns: minmax(0, 1fr); gap: 11px; align-items: stretch; }
.summary-core .model-panel, .summary-core .theory-callout { width: 100%; min-height: 0; }
.summary-bridge {
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 15px;
  color: ${T.navy};
  background: ${T.accentSoft};
  animation: theory-copy-in .7s cubic-bezier(.16,1,.3,1) .72s both;
}
.summary-bridge > span { color: ${T.accent}; font-size: 24px; font-weight: 900; }
.summary-bridge p { font-size: 13px; line-height: 1.45; }
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
.finale-reward { position: relative; min-width: 0; min-height: 206px; padding: 15px 76px 14px 62px; display: flex; align-items: center; overflow: hidden; border-radius: 18px; color: ${T.paper}; background: linear-gradient(145deg,${T.navy},#0f2c40); box-shadow: 0 16px 32px -22px rgba(${T.shadowBase},.58); }.finale-reward-copy { position: relative; z-index: 2; min-width: 0; }.finale-reward-copy > span { color: ${T.lime}; font: 900 9px/1.2 'JetBrains Mono',monospace; letter-spacing: .12em; }.finale-reward-copy h2 { margin-top: 5px; font: 650 19px/1.05 'Source Serif 4',serif; overflow-wrap: anywhere; }.finale-status { margin-top: 10px; }.finale-status strong { display: block; color: ${T.lime}; font: 850 25px/1 'JetBrains Mono',monospace; }.finale-status p { margin-top: 3px; font-size: 11px; line-height: 1.25; font-weight: 800; }.finale-status small { display: block; margin-top: 3px; color: rgba(255,255,255,.68); font-size: 9px; line-height: 1.3; }.finale-status-neutral strong { font-size: 22px; }
.finale-medal { position: absolute; z-index: 2; left: 11px; top: 50%; width: 39px; height: 39px; display: grid; place-items: center; border-radius: 50%; color: ${T.navy}; background: ${T.lime}; box-shadow: 0 0 0 5px rgba(149,201,61,.14); transform: translateY(-50%) scale(.78); transition: transform .38s ease; }.finale-reward.is-complete .finale-medal { transform: translateY(-50%) scale(1); }.finale-reward-bit { position: absolute; z-index: 1; right: 1px; bottom: -5px; width: 76px; height: 96px; }.finale-reward-bit .g1-char { width: 100%; height: 100%; }.finale-reward.is-complete .finale-reward-bit { animation: finale-bit-float 3.2s ease-in-out 2; }
.finale-confetti i { position: absolute; z-index: 0; top: 12px; left: 20%; width: 5px; height: 9px; border-radius: 3px; background: ${T.lime}; opacity: 0; }.finale-confetti i:nth-child(2) { left: 34%; background: ${T.accent}; transform: rotate(24deg); }.finale-confetti i:nth-child(3) { left: 49%; background: ${T.cyan}; transform: rotate(-20deg); }.finale-confetti i:nth-child(4) { left: 63%; top: 22px; background: ${T.paper}; }.finale-confetti i:nth-child(5) { left: 78%; background: ${T.accent}; transform: rotate(38deg); }.finale-confetti i:nth-child(6) { left: 27%; top: 34px; background: ${T.cyan}; }.finale-confetti i:nth-child(7) { left: 57%; top: 42px; background: ${T.lime}; transform: rotate(-34deg); }.finale-confetti i:nth-child(8) { left: 86%; top: 34px; background: ${T.paper}; }.finale-reward.is-complete .finale-confetti i { animation: finale-confetti-fall 1.45s ease-out both; }.finale-reward.is-complete .finale-confetti i:nth-child(even) { animation-delay: .1s; }
@keyframes finale-bit-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes finale-confetti-fall { 0% { opacity: 0; translate: 0 -8px; } 20% { opacity: .9; } 100% { opacity: 0; translate: 5px 78px; rotate: 160deg; } }
.worked-example-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 11px; }
.worked-example {
  min-height: 174px;
  padding: 14px;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 11px;
  border: 1px solid rgba(22,143,163,.11);
  border-radius: 17px;
  background: ${T.paper};
  box-shadow: 0 12px 28px -21px rgba(${T.shadowBase},.36);
  animation: theory-item-in .68s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.16s + var(--reveal-i, 0) * .13s);
}
.worked-index { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 13px; color: ${T.paper}; background: ${T.navy}; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 900; }
.worked-copy { min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.worked-copy h2 { font-family: 'Source Serif 4', Georgia, serif; font-size: 15px; line-height: 1.3; font-weight: 650; }
.worked-copy > strong { color: ${T.success}; font-family: 'JetBrains Mono', monospace; font-size: 16px; line-height: 1.3; }
.worked-copy > p { margin-top: auto; color: ${T.ink2}; font-size: 11px; line-height: 1.42; }
.worked-complete { min-height: 76px; padding: 7px 14px 7px 5px; display: flex; align-items: center; justify-content: center; gap: 10px; border-radius: 16px; color: ${T.success}; background: ${T.successSoft}; font-weight: 850; animation: theory-copy-in .68s cubic-bezier(.16,1,.3,1) .78s both; }
.worked-complete .g1-char { width: 55px; height: 68px; }
@keyframes theory-copy-in {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
.question-card { padding: 22px; border-radius: 20px; background: ${T.paper}; box-shadow: 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.question-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; color: ${T.accent}; font-size: 10px; font-weight: 900; letter-spacing: .14em; }
.question-topline small { color: ${T.warn}; font-size: 10px; letter-spacing: 0; }
.question-card h2 { max-width: 780px; font-family: 'Source Serif 4', serif; font-size: clamp(21px,3.2vw,30px); line-height: 1.18; font-weight: 620; }
.input-action-row {
  margin-top: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}
.answer-input {
  width: 100%;
  min-width: 0;
  min-height: 58px;
  padding: 10px 16px;
  border: 0;
  border-radius: 14px;
  outline: none;
  background: #F8F8F4;
  color: #12212C;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(23px, 4vw, 31px);
  font-weight: 800;
  letter-spacing: .08em;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.16), 0 6px 16px -10px rgba(58,53,48,.22);
  transition: background .18s ease, color .18s ease, box-shadow .18s ease;
}
.answer-input:focus {
  box-shadow: 0 10px 24px -10px rgba(255,91,53,.34), 0 0 0 3px rgba(22,143,163,.24);
}
.answer-input.wrong {
  color: #A96F13;
  background: #FFF5D9;
  box-shadow: inset 0 0 0 2px rgba(169,111,19,.28);
}
.answer-input.correct {
  color: #227A53;
  background: #E7F3EC;
  box-shadow: inset 0 0 0 2px rgba(34,122,83,.28), 0 8px 20px -12px rgba(34,122,83,.35);
}
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
.lesson-root button:focus-visible { outline: 3px solid rgba(22,143,163,.42); outline-offset: 3px; }
@media (min-width: 761px) and (max-width: 1100px) {
  .hook-data-scene { min-height: 184px; padding-top: 9px; padding-bottom: 9px; }
}
@media (max-width: 760px) {
  .screen-heading { grid-template-columns: minmax(0,1fr) 94px; }
  .bit-coach { width: 94px; height: 102px; }
  .bit-coach .g1-char { width: 78px; height: 100px; }
  .foundation-layout, .summary-core { grid-template-columns: 1fr; }
  .foundation-layout > .model-panel, .summary-core .model-panel, .summary-core .theory-callout { min-height: 0; }
  .rule-reveal { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .options-grid { grid-template-columns: 1fr; }
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
  .screen-stack.finale-screen { gap: 10px; }
  .etalon-hook-screen { gap: 7px; }
  .etalon-hook-screen .topic-chip { padding: 4px 9px; font-size: 8px; }
  .etalon-hook-screen .h-title { font-size: 23px; }
  .etalon-hook-screen .question-title { font-size: 16px; }
  .hook-data-scene { min-height: 164px; padding: 9px 91px 9px 10px; border-radius: 18px; }
  .hook-data-console-head { min-height: 17px; margin-bottom: 4px; }
  .hook-data-node { gap: 4px; font-size: 6px; letter-spacing: .07em; }
  .hook-data-node > i { width: 6px; height: 6px; flex-basis: 6px; }
  .hook-data-state { display: none; }
  .hook-data-console { padding: 7px 8px 5px; border-radius: 11px; }
  .hook-data-label-row,.hook-data-label-row small { font-size: 6px; }
  .hook-data-number { min-height: 43px; font-size: 27px; line-height: 1; }
  .hook-data-divider { height: 36px; margin: 0 5px; width: 3px; }
  .hook-data-rows { gap: 3px; }
  .hook-data-rows > div { min-height: 23px; padding: 3px; gap: 3px; border-radius: 5px; }
  .hook-data-rows span { font-size: 5px; }
  .hook-data-rows strong { font-size: 6px; line-height: 1.12; }
  .hook-city-network { top: 8px; right: 2px; width: 87px; }
  .hook-city-network > span { display: none; }
  .hook-data-bit { right: 12px; bottom: -7px; width: 68px; height: 85px; }
  .etalon-hook-screen .options-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 7px; }
  .etalon-hook-screen .option { min-height: 54px; padding: 7px 8px; font-size: 11px; }
  .micro-action-row button { min-height: 44px; }
  .screen-heading { grid-template-columns: minmax(0,1fr) 76px; gap: 8px; }
  .heading-copy h1 { font-size: 27px; }
  .heading-copy p { margin-top: 7px; font-size: 13px; line-height: 1.4; }
  .lesson-kicker { margin-bottom: 5px; font-size: 9px; }
  .bit-coach { width: 76px; height: 82px; border-radius: 20px; }
  .bit-coach .g1-char { width: 62px; height: 78px; }
  .model-panel { padding: 13px; border-radius: 16px; }
  .model-heading { margin-bottom: 9px; font-size: 9px; }
  .model-number { font-size: 30px; }
  .model-boundary .model-number { font-size: 23px; letter-spacing: .02em; white-space: nowrap; }
  .model-boundary .class-group strong { font-size: 17px; }
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
  .shift-route { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
  .shift-track { display: none; }
  .shift-stop { min-height: 72px; padding: 8px 3px 6px; }
  .shift-stop strong { font-size: 13px; }
  .shift-stop span { font-size: 7px; }
  .shift-stop i { right: -12px; top: 24px; font-size: 7px; }
  .shift-stop:nth-child(4) i { display: none; }
  .foundation-layout, .animated-explanation, .strategy-walkthrough, .summary-core { grid-template-columns: 1fr; }
  .foundation-layout .model-city .model-rows { grid-template-columns: 1fr; }
  .foundation-copy { padding: 14px; border-radius: 16px; }
  .foundation-copy > h2, .theory-focus > h2 { font-size: 19px; }
  .theory-focus, .theory-callout { min-height: 0; }
  .theory-focus { padding: 13px; }
  .theory-callout { padding: 11px 12px 11px 8px; grid-template-columns: 42px minmax(0, 1fr); }
  .theory-callout-mark { width: 36px; height: 36px; border-radius: 11px; font-size: 17px; }
  .theory-callout-copy > p { font-size: 12px; }
  .rule-reveal { grid-template-columns: 1fr; gap: 6px; }
  .rule-ribbon { min-height: 54px; padding: 8px; }
  .strategy-card { min-height: 0; padding: 14px; }
  .error-walkthrough { grid-template-columns: 1fr; gap: 7px; }
  .multi-error-lab { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .repair-card { min-height: 0; padding: 9px; gap: 6px; }
  .repair-card:last-of-type { grid-column: 1 / -1; }
  .repair-card p { font-size: 10px; }
  .packet-solution-lab { gap: 7px; }
  .packet-lab-question { min-height: 0; padding: 10px 12px; grid-template-columns: 1fr; gap: 5px; }
  .packet-lab-question > strong { font-size: 15px; }
  .packet-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .packet-card { padding: 8px; gap: 5px; }
  .packet-card > header { align-items: flex-start; gap: 4px; padding-bottom: 3px; }
  .packet-card > header span { font-size: 8px; }
  .packet-card > header strong { font-size: 17px; }
  .packet-row { min-height: 38px; padding: 6px; }
  .packet-row > i { font-size: 7px; }
  .packet-row > b { font-size: 9px; line-height: 1.28; }
  .packet-row-accent > b, .packet-row-lime > b { font-size: 11px; }
  .packet-card > p { font-size: 9px; line-height: 1.32; }
  .error-state { min-height: 0; padding: 14px; }
  .repair-arrow { min-height: 28px; font-size: 0; }
  .repair-arrow::before { content: '↓'; font-size: 24px; }
  .summary-core .model-panel, .summary-core .theory-callout { min-height: 0; }
  .summary-bridge { padding: 11px 13px; }
  .worked-example-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .worked-example { min-height: 0; padding: 9px; grid-template-columns: 30px minmax(0, 1fr); gap: 7px; }
  .worked-index { width: 30px; height: 30px; font-size: 10px; }
  .worked-copy { gap: 4px; }
  .worked-copy h2 { font-size: 13px; }
  .worked-copy > strong { font-size: 14px; }
  .worked-copy > p { font-size: 10px; }
  .worked-complete { min-height: 66px; }
  .worked-complete .g1-char { width: 47px; height: 58px; }
  .question-card { padding: 14px; border-radius: 16px; }
  .question-card h2 { font-size: 20px; }
  .input-action-row { margin-top: 11px; gap: 8px; }
  .answer-input { min-height: 50px; font-size: 23px; padding: 8px 11px; }
  .options-grid { margin-top: 11px; gap: 7px; }
  .option { min-height: 50px; padding: 8px 10px; font-size: 12px; }
  .option-letter { width: 29px; height: 29px; }
  .feedback-card { grid-template-columns: 66px minmax(0,1fr); min-height: 80px; padding: 8px 10px 8px 3px; }
  .feedback-card .g1-char { width: 62px; height: 76px; }
  .feedback-card p { font-size: 12px; }
  .btn { min-height: 48px; padding: 0 14px; font-size: 12px; }
  .lesson-root-preview .stage-header { padding-top: 60px; }
  .finale-heading { padding: 11px 12px; }.finale-heading h1 { font-size: 22px; }.finale-mastery { grid-template-columns: 1fr; gap: 6px; }.finale-takeaway { min-height: 0; padding: 8px 9px; }.finale-proof { grid-template-columns: 1fr; gap: 5px; }.finale-reward { min-height: 116px; padding: 11px 65px 11px 51px; }.finale-reward-copy h2 { font-size: 17px; }.finale-medal { left: 8px; width: 34px; height: 34px; }.finale-reward-bit { width: 62px; height: 78px; }
}
@media (max-width: 639.98px) and (max-height: 700px) {
  .stage-header { padding-top: 6px; padding-bottom: 5px; }
  .progress-track { height: 4px; margin-bottom: 5px; }
  .stage-content { padding-top: 4px; padding-bottom: 4px; }
  .stage-nav { min-height: 54px; padding-top: 4px; padding-bottom: 4px; }
  .btn, .option, .micro-action-row button, .final-reflection button { min-height: 44px; }
  .screen-stack { gap: 7px; }
  .screen-heading { grid-template-columns: minmax(0,1fr) 58px; gap: 6px; }
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
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    transition-delay: 0ms !important;
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
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]),
  :is(.lesson-root,.d8-root) .hook-decision:has(+[data-g4-feedback]){padding:7px 8px!important}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]) .question-topline{margin-bottom:4px}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]) h2{font-size:14px!important;line-height:1.14}
  :is(.lesson-root,.d8-root) .question-card:has([data-g4-feedback]) .options-grid,
  :is(.lesson-root,.d8-root) .hook-answer-panel:has([data-g4-feedback]) .options-grid{margin-top:4px;gap:4px}
}
@media(max-width:639.98px) and (max-height:700px){
  .screen-stack:not(.etalon-hook-screen):has(>.screen-heading+.question-card) .screen-heading{grid-template-columns:minmax(0,1fr) 54px;gap:5px}
  .screen-stack:not(.etalon-hook-screen):has(>.screen-heading+.question-card) .heading-copy h1{font-size:20px;line-height:1.04}
  .screen-stack:not(.etalon-hook-screen):has(>.screen-heading+.question-card) .heading-copy p{margin-top:2px;font-size:10px;line-height:1.2}
  .screen-stack:not(.etalon-hook-screen):has(>.screen-heading+.question-card) .bit-coach{width:54px;height:58px}
  .screen-stack:not(.etalon-hook-screen):has(>.screen-heading+.question-card) .bit-coach .g1-char{width:46px;height:56px}
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
