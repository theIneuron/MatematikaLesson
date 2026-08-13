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
    <div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={lang === 'en' ? `Title: ${title}` : lang === 'ru' ? `Звание: ${title}` : `Unvon: ${title}`}>
      <div className="rank-boost-card g4-title-reveal-card">
        <div className="g4-title-reveal-rays" aria-hidden="true" />
        <div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }} />)}
        </div>
        <div className="rank-boost-medal g4-title-reveal-medal" aria-hidden="true">★</div><h2>{title}</h2>
      </div>
    </div>, document.body,
  );
}

function G4TitleCard({ title, lang, firstTry, totalScored }) {
  return <div className="g4-title-card-stage" data-g4-role="title-card" role="status" aria-live="polite" aria-atomic="true">
    <div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
    <div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy" /></div><div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div>
    <span className="g4-title-card-kicker">{lang === 'en' ? "TITLE EARNED" : lang === 'ru' ? 'ЗВАНИЕ ПОЛУЧЕНО' : 'UNVON OLINDI'}</span><h2>{title}</h2>
    <div className="g4-title-card-score"><strong>{firstTry}/{totalScored}</strong><span>{lang === 'en' ? "on the first attempt" : lang === 'ru' ? 'с первой попытки' : 'birinchi urinishda'}</span></div>
  </div>;
}

// ============================================================================
// 4-SINF · Dars03 · Ko'p xonali sonning xona tarkibi
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

// Runtime and Notion share one index: CONTENT.sN, SCREEN_META[N], and
// SCREENS[N] describe the same screen. Dense theory screens keep their
// connected source ideas inside parts instead of becoming extra slides.
const CONTENT = {
  "s0": {
    "eyebrow": {
      "ru": "Новая миссия",
      "uz": "Yangi missiya",
      "en": "New mission",
    },
    "title": {
      "ru": "Бит дал трём четвёркам одно значение",
      "uz": "Bit uchta to'rtga bir xil qiymat berdi",
      "en": "Bit gave three fours the same value",
    },
    "lead": {
      "ru": "В коде 404 204 Бит увидел три одинаковые цифры и решил, что каждая означает просто 4. Датчик сообщает об ошибке.",
      "uz": "404 204 kodida Bit uchta bir xil raqamni ko'rdi va har biri faqat 4 ni bildiradi deb o'yladi. Sensor xato haqida xabar berdi.",
      "en": "In the 404 204 code, Bit saw three identical digits and decided that each meant just 4.",
    },
    "instruction": {
      "ru": "Какое действие нужно выполнить первым?",
      "uz": "Birinchi bo'lib qaysi harakatni bajarish kerak?",
      "en": "What action should be performed first?",
    },
    "model": {
      "kind": "rows",
      "badge": {
        "ru": "Ошибка Бита",
        "uz": "Bitning xatosi",
        "en": "Bit's mistake",
      },
      "number": "404 204",
      "rows": [
        {
          "label": {
            "ru": "решение Бита",
            "uz": "Bitning yechimi",
            "en": "decision by Bit",
          },
          "value": "4 = 4 = 4"
        }
      ]
    },
    "options": [
      {
        "ru": "Определить, в каком разряде стоит каждая цифра 4",
        "uz": "Har bir 4 raqami qaysi xonada turganini aniqlash",
        "en": "Determine which place each digit 4 occupies",
      },
      {
        "ru": "Оставить всем трём цифрам значение 4",
        "uz": "Uchala raqamga ham 4 qiymatini qoldirish",
        "en": "Assign the value 4 to all three digits",
      },
      {
        "ru": "Сложить три цифры 4",
        "uz": "Uchta 4 raqamini qo'shish",
        "en": "Add the three digits 4",
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Сначала нужно найти место каждой цифры. Только после этого можно определить её значение.",
      "uz": "Avval har bir raqamning o'rnini topish kerak. Shundan keyingina uning qiymatini aniqlash mumkin.",
      "en": "First, find the place of each digit. Only then can you work out its value.",
    },
    "wrong": [
      null,
      {
        "ru": "Так ошибка Бита сохранится: одинаковая цифра может стоять в разных разрядах. Сначала найди каждое место.",
        "uz": "Bunday qilsangiz Bitning xatosi qoladi, bir xil raqam turli xonalarda turishi mumkin. Avval har bir o'rinni toping.",
        "en": "This keeps Bit's error: the same digit can be in different places. First, find each place.",
      },
      {
        "ru": "Сумма цифр не показывает их вклад в число. Нужно определить разряд каждой цифры.",
        "uz": "Raqamlar yig'indisi ularning sondagi hissasini ko'rsatmaydi. Har bir raqamning xonasini aniqlash kerak.",
        "en": "The digit sum does not show each digit's place value. Find the place of each digit.",
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Бит увидел в коде три цифры четыре и дал им одинаковое значение. Сенсор сообщает об ошибке.",
          "Выбери первое действие, которое поможет проверить решение Бита."
        ],
        "uz": [
          "Bit kodda uchta to'rt raqamini ko'rib, ularga bir xil qiymat berdi. Sensor xato haqida xabar beryapti.",
          "Bitning yechimini tekshirishga yordam beradigan birinchi harakatni tanlang."
        ],
        "en": [
          "Bit saw three digits equal to four in the code and gave them the same value.",
          "Select the first action that will help verify Bit's decision."
        ],
      },
      "on_correct": {
        "ru": "Верно. Сначала определяем разряд каждой цифры.",
        "uz": "To'g'ri. Avval har bir raqamning xonasini aniqlaymiz.",
        "en": "Correct. First, determine the place of each digit.",
      },
      "on_wrong": [
        null,
        {
          "ru": "Одинаковая цифра может занимать разные разряды. Сначала найди её места.",
          "uz": "Bir xil raqam turli xonalarni egallashi mumkin. Avval uning o'rinlarini toping.",
          "en": "The same digit can occupy different places. First, find its place.",
        },
        {
          "ru": "Складывать цифры не нужно. Проверь место каждой четвёрки.",
          "uz": "Raqamlarni qo'shish kerak emas. Har bir to'rtning o'rnini tekshiring.",
          "en": "Do not add the digits. Check the place of each four.",
        }
      ]
    }
  },
  "s1": {
    "parts": [
      {
        "eyebrow": {
          "ru": "Диагностика",
          "uz": "Diagnostika",
          "en": "Diagnostics",
        },
        "title": {
          "ru": "Вспомни запись числа по голосу",
          "uz": "Sonni ovozdan yozishni eslang",
          "en": "Remember the spoken form of the number.",
        },
        "lead": {
          "ru": "Это умение из прошлого урока поможет не потерять разряды.",
          "uz": "Oldingi darsdagi bu ko'nikma xonalarni yo'qotmaslikka yordam beradi.",
          "en": "This skill from the past lesson will help not to lose the places.",
        },
        "instruction": {
          "ru": "Как записать число триста восемнадцать тысяч сорок?",
          "uz": "Uch yuz o'n sakkiz ming qirq soni qanday yoziladi?",
          "en": "How to write down the number three hundred and eighteen thousand forty?",
        },
        "model": {
          "kind": "code",
          "badge": {
            "ru": "Голосовой код",
            "uz": "Ovozli kod",
            "en": "Voice code.",
          },
          "number": "□□□ □□□"
        },
        "options": [
          "318 040",
          "318 400",
          "310 840",
          "31 840"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "318 040 записано двумя классами. Ноль сотен и ноль единиц сохранили свои места.",
          "uz": "318 040 ikkita sinf bilan yozildi. Nol yuzlik va nol birlik o'z o'rnini saqladi.",
          "en": "318,040 is written in two groups, zero hundred and zero units have retained their places.",
        },
        "wrong": [
          null,
          {
            "ru": "400 означает четыре сотни, а в условии названы сорок. Цифра 4 должна стоять в десятках.",
            "uz": "400 to'rt yuzni bildiradi, shartda esa qirq aytilgan. 4 raqami o'nlar xonasida turishi kerak.",
            "en": "400 means four hundred, and in the condition forty is named. The digit 4 should be in the tens place.",
          },
          {
            "ru": "Левая и правая группы смешались. Сначала запиши 318 тысяч, затем 040.",
            "uz": "Chap va o'ng guruhlar aralashgan. Avval 318 mingni, keyin 040 ni yozing.",
            "en": "The left and right groups mixed. First, write 318,000, then 040.",
          },
          {
            "ru": "Потерян разряд сотен тысяч. Для 318 тысяч нужна полная левая группа.",
            "uz": "Yuz minglar xonasi yo'qolgan. 318 ming uchun to'liq chap guruh kerak.",
            "en": "We've lost hundreds of thousands. We need 318,000 left-handers.",
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Запиши цифрами триста восемнадцать тысяч сорок. В классе единиц сохрани три места."
            ],
            "uz": [
              "Uch yuz o'n sakkiz ming qirq sonini raqamlar bilan yozing. Birlar sinfida uchta xonani saqlang."
            ],
            "en": [
              "Write down three hundred and eighteen thousand forty. In the ones group, save three places."
            ],
          },
          "on_correct": {
            "ru": "Запись точная. Получилось триста восемнадцать тысяч сорок.",
            "uz": "Yozuv aniq. Uch yuz o'n sakkiz ming qirq hosil bo'ldi.",
            "en": "It's accurate. It's three hundred and eighteen thousand forty.",
          },
          "on_wrong": [
            null,
            {
              "ru": "Сорок занимает десятки и единицы. Перед ним нужен ноль сотен.",
              "uz": "Qirq o'nlar va birliklarni egallaydi. Uning oldida nol yuzlik kerak.",
              "en": "Forty takes tens and one. You need zero hundred in front of it.",
            },
            {
              "ru": "Сохрани отдельно класс тысяч и класс единиц.",
              "uz": "Minglar sinfi va birlar sinfini alohida saqlang.",
              "en": "Separate the thousands group and the ones group.",
            },
            {
              "ru": "Верни сотни тысяч в левую группу.",
              "uz": "Yuz minglar xonasini chap guruhga qaytaring.",
              "en": "Put hundreds of thousands back in the left group.",
            }
          ]
        }
      },
      {
        "eyebrow": {
          "ru": "Прогноз",
          "uz": "Bashorat",
          "en": "Forecast",
        },
        "title": {
          "ru": "Какая четвёрка весит больше?",
          "uz": "Qaysi to'rtning qiymati kattaroq?",
          "en": "Which four weighs more?",
        },
        "lead": {
          "ru": "Правило ещё не готово. Сделай прогноз по месту цифры.",
          "uz": "Qoida hali tayyor emas. Raqam o'rniga qarab bashorat qiling.",
          "en": "The rule isn't ready yet. Make a prediction of where the numbers are.",
        },
        "instruction": {
          "ru": "Какая цифра 4 в коде 404 204 имеет наибольшее значение?",
          "uz": "404 204 kodidagi qaysi 4 raqami eng katta qiymatga ega?",
          "en": "Which digit 4 in the code 404,204 has the greatest value?",
        },
        "model": {
          "kind": "code",
          "badge": {
            "ru": "Три одинаковые цифры",
            "uz": "Uchta bir xil raqam",
            "en": "Three identical numbers",
          },
          "number": "404 204"
        },
        "options": [
          {
            "ru": "Левая цифра 4",
            "uz": "Chapdagi 4 raqami",
            "en": "Left digit 4",
          },
          {
            "ru": "Средняя цифра 4",
            "uz": "O'rtadagi 4 raqami",
            "en": "Middle digit 4",
          },
          {
            "ru": "Правая цифра 4",
            "uz": "O'ngdagi 4 raqami",
            "en": "Right digit 4",
          },
          {
            "ru": "Все три имеют одинаковое значение",
            "uz": "Uchalasining qiymati bir xil",
            "en": "All three have the same meaning.",
          }
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Левая четвёрка стоит в самом старшем из трёх разрядов. Следующая модель покажет точные значения.",
          "uz": "Chapdagi to'rt uchalasining eng katta xonasida turibdi. Keyingi model aniq qiymatlarni ko'rsatadi.",
          "en": "The left four has the highest place value of the three. The next model will show the exact values.",
        },
        "wrong": [
          null,
          {
            "ru": "Средняя четвёрка находится правее левой, поэтому занимает меньший разряд. Сравни их места.",
            "uz": "O'rtadagi to'rt chapdagidan o'ngda, shuning uchun kichikroq xonani egallaydi. Ularning o'rnini solishtiring.",
            "en": "The middle four is to the right of the left, so it's a smaller place. Compare their places.",
          },
          {
            "ru": "Правая четвёрка стоит в единицах. Она занимает самый младший из трёх разрядов.",
            "uz": "O'ngdagi to'rt birliklar xonasida turibdi. U uchalasining eng kichik xonasini egallaydi.",
            "en": "The right four is in the ones place. It has the lowest place value of the three.",
          },
          {
            "ru": "Цифры одинаковы, но их места различаются. Значения нужно сравнивать по разрядам.",
            "uz": "Raqamlar bir xil, ammo ularning o'rinlari turlicha. Qiymatlarni xonalar bo'yicha solishtirish kerak.",
            "en": "The numbers are the same, but their places are different. Values need to be compared by digits.",
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "В коде три одинаковые цифры четыре. Предположи, какая из них имеет наибольшее значение."
            ],
            "uz": [
              "Kodda uchta bir xil to'rt raqami bor. Ulardan qaysi biri eng katta qiymatga ega ekanini taxmin qiling."
            ],
            "en": [
              "The code contains three identical digits, all fours. Predict which one has the greatest value."
            ],
          },
          "on_correct": {
            "ru": "Прогноз принят. Левая цифра занимает самый старший разряд.",
            "uz": "Bashorat qabul qilindi. Chapdagi raqam eng katta xonani egallaydi.",
            "en": "Prediction accepted. The left digit is the highest.",
          },
          "on_wrong": [
            null,
            {
              "ru": "Средняя цифра находится правее левой. Сравни их разряды.",
              "uz": "O'rtadagi raqam chapdagidan o'ngda. Ularning xonalarini solishtiring.",
              "en": "The middle digit is to the right of the left one. Compare their places.",
            },
            {
              "ru": "Правая цифра стоит в единицах. Это самый младший разряд.",
              "uz": "O'ngdagi raqam birliklarda turibdi. Bu eng kichik xona.",
              "en": "The right digit is in units. It's the lowest digit.",
            },
            {
              "ru": "Одинаковые цифры могут иметь разные значения. Их определяет место.",
              "uz": "Bir xil raqamlar turli qiymatlarga ega bo'lishi mumkin. Qiymatni o'rin belgilaydi.",
              "en": "The same digits can have different values. Their values are determined by their places.",
            }
          ]
        }
      }
    ]
  },
  "s2": {
    "eyebrow": {
      "ru": "Лестница разрядов",
      "uz": "Xonalar zinasi",
      "en": "Staircase of places",
    },
    "title": {
      "ru": "Один шаг влево увеличивает значение в 10 раз",
      "uz": "Chapga bir qadam qiymatni 10 marta oshiradi",
      "en": "One step to the left makes the value ten times greater",
    },
    "lead": {
      "ru": "Цифра остаётся той же, но новое место делает её значение в десять раз больше.",
      "uz": "Raqam o'zgarmaydi, ammo yangi o'rin uning qiymatini o'n marta kattalashtiradi.",
      "en": "The digit remains the same, but the new place makes its value ten times greater.",
    },
    "instruction": {
      "ru": "Проследи путь одной цифры 6 от единиц до тысяч.",
      "uz": "Bitta 6 raqamining birlardan minglargacha yo'lini kuzating.",
      "en": "Track the digit 6 as it moves from the ones place to the thousands place.",
    },
    "direction": {
      "ru": "каждый шаг влево · × 10",
      "uz": "har bir qadam chapga · × 10",
      "en": "each step to the left · × 10",
    },
    "steps": [
      {
        "place": {
          "ru": "тысячи",
          "uz": "minglar",
          "en": "thousand",
        },
        "value": "6 000",
        "digit": "6"
      },
      {
        "place": {
          "ru": "сотни",
          "uz": "yuzlar",
          "en": "hundred",
        },
        "value": "600",
        "digit": "6"
      },
      {
        "place": {
          "ru": "десятки",
          "uz": "o'nlar",
          "en": "tens",
        },
        "value": "60",
        "digit": "6"
      },
      {
        "place": {
          "ru": "единицы",
          "uz": "birlar",
          "en": "unit",
        },
        "value": "6",
        "digit": "6"
      }
    ],
    "contrasts": [
      {
        "number": "406 052",
        "place": {
          "ru": "6 стоит в тысячах",
          "uz": "6 minglar xonasida",
          "en": "6 stands in the thousands",
        },
        "value": "6 000"
      },
      {
        "number": "460 052",
        "place": {
          "ru": "6 сдвинулась на одно место влево",
          "uz": "6 bir xona chapga siljidi",
          "en": "6 moved one place left",
        },
        "value": "60 000"
      }
    ],
    "conclusion": {
      "ru": "В 460 052 цифра 6 стала означать 60 000. Один сдвиг влево умножил её прежнее значение 6 000 на 10.",
      "uz": "460 052 sonida 6 raqami 60 000 ni bildirdi. Chapga bir siljish uning oldingi 6 000 qiymatini 10 ga ko'paytirdi.",
      "en": "At 460,052, 6 became 60,000, and one shift to the left multiplied its previous value of 6,000 by 10.",
    },
    "audio": {
      "ru": [
        "Проследим путь одной цифры шесть. В единицах она означает шесть, в десятках шестьдесят, в сотнях шестьсот, а в тысячах шесть тысяч.",
        "Каждый шаг влево сохраняет цифру, но увеличивает её значение в десять раз.",
        "В числе четыреста шесть тысяч пятьдесят два цифра шесть означает шесть тысяч. После сдвига влево в числе четыреста шестьдесят тысяч пятьдесят два она означает шестьдесят тысяч."
      ],
      "uz": [
        "Bitta olti raqamining yo'lini kuzatamiz. Birlarda u olti, o'nlarda oltmish, yuzlarda olti yuz, minglarda esa olti mingni bildiradi.",
        "Har bir chapga qadam raqamni saqlaydi, ammo uning qiymatini o'n marta oshiradi.",
        "To'rt yuz olti ming ellik ikki sonida olti raqami olti mingni bildiradi. Chapga siljigach, to'rt yuz oltmish ming ellik ikki sonida u oltmish mingni bildiradi."
      ],
      "en": [
        "In the ones place, six means six; in tens, sixty; in hundreds, six hundred; and in thousands, six thousand.",
        "Each step to the left keeps the same digit but makes its value ten times greater.",
        "In four hundred and six thousand fifty-two, six means six thousand. In four hundred and sixty thousand fifty-two, one place left, six means sixty thousand."
      ],
    }
  },
  "s3": {
    "parts": [
      {
        "eyebrow": {
          "ru": "Первая модель",
          "uz": "Birinchi model",
          "en": "First model",
        },
        "title": {
          "ru": "Таблица раскрыла три значения",
          "uz": "Jadval uchta qiymatni ochdi",
          "en": "Table reveals three values",
        },
        "lead": {
          "ru": "Теперь каждую цифру можно связать с её разрядом.",
          "uz": "Endi har bir raqamni uning xonasi bilan bog'lash mumkin.",
          "en": "Now each digit can be linked to its place.",
        },
        "instruction": {
          "ru": "Какие значения имеют три цифры 4 слева направо?",
          "uz": "Uchta 4 raqami chapdan o'ngga qanday qiymatlarga ega?",
          "en": "What are the meanings of the three digits 4 from left to right?",
        },
        "model": {
          "kind": "table",
          "badge": {
            "ru": "Разрядная таблица",
            "uz": "Xona jadvali",
            "en": "Place-value chart.",
          },
          "number": "404 204",
          "columns": [
            {
              "label": {
                "ru": "сотни тысяч",
                "uz": "yuz minglar",
                "en": "hundred thousand",
              },
              "value": "4"
            },
            {
              "label": {
                "ru": "десятки тысяч",
                "uz": "o'n minglar",
                "en": "ten-thousands",
              },
              "value": "0"
            },
            {
              "label": {
                "ru": "тысячи",
                "uz": "minglar",
                "en": "thousand",
              },
              "value": "4"
            },
            {
              "label": {
                "ru": "сотни",
                "uz": "yuzlar",
                "en": "hundred",
              },
              "value": "2"
            },
            {
              "label": {
                "ru": "десятки",
                "uz": "o'nlar",
                "en": "tens",
              },
              "value": "0"
            },
            {
              "label": {
                "ru": "единицы",
                "uz": "birlar",
                "en": "unit",
              },
              "value": "4"
            }
          ]
        },
        "options": [
          "400 000; 4 000; 4",
          "4; 4; 4",
          "40 000; 400; 4",
          "400 000; 40 000; 400"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Слева направо четвёрки обозначают 400 000, 4 000 и 4. Место каждой цифры определило её значение.",
          "uz": "Chapdan o'ngga to'rtlar 400 000, 4 000 va 4 ni bildiradi. Har bir raqamning o'rni uning qiymatini belgiladi.",
          "en": "From left to right, the fours represent 400,000, 4,000 and 4. The place of each digit determines its value.",
        },
        "wrong": [
          null,
          {
            "ru": "Это повторяет ошибку Бита и учитывает только цифры. Добавь значение каждого разряда.",
            "uz": "Bu Bitning xatosini takrorlaydi va faqat raqamlarni hisobga oladi. Har bir xona qiymatini qo'shing.",
            "en": "This repeats Bit's error and looks only at the digits. Use the place value of each digit.",
          },
          {
            "ru": "Средняя четвёрка стоит в тысячах, а не в сотнях. Левая стоит в сотнях тысяч.",
            "uz": "O'rtadagi to'rt yuzlarda emas, minglarda turibdi. Chapdagisi yuz minglarda.",
            "en": "The middle four is in the thousands place, not the hundreds place. The left four is in the hundred-thousands place.",
          },
          {
            "ru": "В этом варианте все три цифры сдвинуты в другие разряды. Читай заголовки их столбцов.",
            "uz": "Bu variantda uchala raqam boshqa xonalarga siljigan. Ularning ustun nomlarini o'qing.",
            "en": "In this version, all three digits are shifted to other places. Read the headings of their columns.",
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Разрядная таблица показывает места трёх цифр четыре. Выбери их значения слева направо."
            ],
            "uz": [
              "Xona jadvali uchta to'rt raqamining o'rnini ko'rsatadi. Ularning qiymatlarini chapdan o'ngga tanlang."
            ],
            "en": [
              "The place-value chart shows the places of the three digits equal to four. Choose their values from left to right."
            ],
          },
          "on_correct": {
            "ru": "Теперь ошибка Бита понятна. Одинаковые цифры получили три разных разрядных значения.",
            "uz": "Endi Bitning xatosi aniq. Bir xil raqamlar uch xil xona qiymatini oldi.",
            "en": "Now Bit's error is clear. The same digits got three different place values.",
          },
          "on_wrong": [
            null,
            {
              "ru": "Нужно учесть не только цифры, но и их разряды.",
              "uz": "Faqat raqamlarni emas, ularning xonalarini ham hisobga olish kerak.",
              "en": "It is necessary to take into account not only the numbers, but also their places.",
            },
            {
              "ru": "Средняя четвёрка стоит в тысячах. Проверь левую четвёрку.",
              "uz": "O'rtadagi to'rt minglarda turibdi. Chapdagi to'rtni tekshiring.",
              "en": "The middle four is in the thousands. Check the left four.",
            },
            {
              "ru": "Сопоставь каждую четвёрку с заголовком её столбца.",
              "uz": "Har bir to'rtni uning ustuni nomi bilan moslang.",
              "en": "Compare each four to the header of its column.",
            }
          ]
        }
      },
      {
        "eyebrow": {
          "ru": "Вторая модель",
          "uz": "Ikkinchi model",
          "en": "Second model",
        },
        "title": {
          "ru": "Переводим таблицу в сумму",
          "uz": "Jadvalni yig'indiga aylantiramiz",
          "en": "Translating the table into an amount",
        },
        "lead": {
          "ru": "Разрядные значения становятся слагаемыми развёрнутой записи.",
          "uz": "Xona qiymatlari yoyiq yozuvning qo'shiluvchilariga aylanadi.",
          "en": "The place values become the components of the expanded form.",
        },
        "instruction": {
          "ru": "Какое слагаемое пропущено в разложении числа 404 204?",
          "uz": "404 204 sonining yoyiq yozuvida qaysi qo'shiluvchi tushib qolgan?",
          "en": "What is missing in the 404 204 expansion?",
        },
        "model": {
          "kind": "rows",
          "badge": {
            "ru": "Неполное разложение",
            "uz": "Tugallanmagan yoyiq yozuv",
            "en": "Incomplete expanded form",
          },
          "number": "404 204",
          "rows": [
            {
              "label": {
                "ru": "развёрнутая запись",
                "uz": "yoyiq yozuv",
                "en": "expanded",
              },
              "value": "400 000 + □ + 200 + 4"
            },
            {
              "label": {
                "ru": "средняя цифра 4",
                "uz": "o'rtadagi 4 raqami",
                "en": "middle digit 4",
              },
              "value": {
                "ru": "тысячи",
                "uz": "minglar",
                "en": "thousand",
              }
            }
          ]
        },
        "options": [
          "4 000",
          "40 000",
          "400",
          "4"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Средняя цифра 4 стоит в тысячах, поэтому пропущено слагаемое 4 000.",
          "uz": "O'rtadagi 4 raqami minglar xonasida, shuning uchun 4 000 qo'shiluvchisi tushib qolgan.",
          "en": "The middle 4 is in the thousands place, so the 4,000 term is missing.",
        },
        "wrong": [
          null,
          {
            "ru": "40 000 относится к десяткам тысяч, где в числе стоит ноль. Нужны единицы тысяч.",
            "uz": "40 000 o'n minglar xonasiga tegishli, sonda u yerda nol turibdi. Minglar birligi kerak.",
            "en": "40,000 is in the tens of thousands, where the number is zero. You need one thousand.",
          },
          {
            "ru": "400 относится к сотням, где уже стоит цифра 2. Четвёрка находится левее.",
            "uz": "400 yuzlar xonasiga tegishli, u yerda 2 raqami turibdi. To'rt undan chapda.",
            "en": "400 would place the digit 4 in the hundreds place, which is already occupied by 2. The digit 4 belongs farther left.",
          },
          {
            "ru": "Это значение правой четвёрки в единицах. Пропущена средняя цифра в тысячах.",
            "uz": "Bu o'ngdagi to'rtning birliklardagi qiymati. Minglardagi o'rtadagi raqam tushib qolgan.",
            "en": "That's the right four in units. Missed the mean in thousands.",
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Число четыреста четыре тысячи двести четыре начали раскладывать на разрядные слагаемые. Найди пропущенное значение средней четвёрки."
            ],
            "uz": [
              "To'rt yuz to'rt ming ikki yuz to'rt soni xona qo'shiluvchilariga ajratila boshlandi. O'rtadagi to'rtning tushib qolgan qiymatini toping."
            ],
            "en": [
              "The number four hundred and four thousand two hundred and four is being decomposed by place value. Find the missing value of the middle digit four."
            ],
          },
          "on_correct": {
            "ru": "Верно. Средняя четвёрка в тысячах даёт четыре тысячи.",
            "uz": "To'g'ri. Minglardagi o'rtadagi to'rt to'rt mingni beradi.",
            "en": "Correct. The middle four is in the thousands place, so its value is four thousand.",
          },
          "on_wrong": [
            null,
            {
              "ru": "Десятки тысяч заняты нулём. Нужны четыре тысячи.",
              "uz": "O'n minglar xonasida nol turibdi. To'rt ming kerak.",
              "en": "Tens of thousands are occupied by zero. It takes four thousand.",
            },
            {
              "ru": "Сотни заняты цифрой два. Четвёрка стоит в тысячах.",
              "uz": "Yuzlar xonasida ikki turibdi. To'rt minglar xonasida.",
              "en": "The hundreds place is occupied by the digit two. The middle four is in the thousands place.",
            },
            {
              "ru": "Единицы уже представлены последним слагаемым. Найди значение средней четвёрки.",
              "uz": "Birliklar oxirgi qo'shiluvchida berilgan. O'rtadagi to'rtning qiymatini toping.",
              "en": "The units are already represented by the last term. Find the value of the middle four.",
            }
          ]
        }
      }
    ]
  },
  "s4": {
    "parts": [
      {
        "eyebrow": {
          "ru": "Действие с моделью",
          "uz": "Model bilan harakat",
          "en": "Action with the model",
        },
        "title": {
          "ru": "Запиши значение цифры",
          "uz": "Raqamning qiymatini yozing",
          "en": "Write down the value of the digit.",
        },
        "lead": {
          "ru": "Таблица оставляет одну задачу: превратить место цифры в её значение.",
          "uz": "Jadval bitta vazifani qoldiradi: raqam o'rnini uning qiymatiga aylantirish.",
          "en": "The table leaves one task: to turn the place of a digit into its value.",
        },
        "instruction": {
          "ru": "Чему равна цифра 6 в числе 306 052?",
          "uz": "306 052 sonidagi 6 raqamining qiymati qancha?",
          "en": "What is the value of the digit 6 in 306,052?",
        },
        "model": {
          "kind": "table",
          "badge": {
            "ru": "Найди столбец",
            "uz": "Ustunni toping",
            "en": "Find the column.",
          },
          "number": "306 052",
          "columns": [
            {
              "label": {
                "ru": "сотни тысяч",
                "uz": "yuz minglar",
                "en": "hundred thousand",
              },
              "value": "3"
            },
            {
              "label": {
                "ru": "десятки тысяч",
                "uz": "o'n minglar",
                "en": "ten-thousands",
              },
              "value": "0"
            },
            {
              "label": {
                "ru": "тысячи",
                "uz": "minglar",
                "en": "thousand",
              },
              "value": "6"
            },
            {
              "label": {
                "ru": "сотни",
                "uz": "yuzlar",
                "en": "hundred",
              },
              "value": "0"
            },
            {
              "label": {
                "ru": "десятки",
                "uz": "o'nlar",
                "en": "tens",
              },
              "value": "5"
            },
            {
              "label": {
                "ru": "единицы",
                "uz": "birlar",
                "en": "unit",
              },
              "value": "2"
            }
          ]
        },
        "placeholder": {
          "ru": "0",
          "uz": "0",
          "en": "0",
        },
        "correctValue": "6000",
        "correctText": {
          "ru": "Цифра 6 стоит в тысячах, поэтому её значение равно 6 000.",
          "uz": "6 raqami minglar xonasida, shuning uchun uning qiymati 6 000.",
          "en": "The digit 6 is in the thousands place, so its value is 6,000.",
        },
        "wrongText": {
          "ru": "Сначала найди столбец цифры 6. Она стоит в тысячах, поэтому в значении нужны три нуля.",
          "uz": "Avval 6 raqamining ustunini toping. U minglar xonasida, shuning uchun qiymatda uchta nol kerak.",
          "en": "First, find the column containing the digit 6. It's in the thousands, so you need three zeros in the value.",
        },
        "wrongByValue": {
          "6": {
            "ru": "Записана только цифра 6. Добавь значение разряда тысяч.",
            "uz": "Faqat 6 raqami yozildi. Minglar xonasi qiymatini qo'shing.",
            "en": "Only the digit 6 is shown. Multiply it by the value of the thousands place.",
          },
          "600": {
            "ru": "600 относится к сотням. Цифра 6 стоит на одно место левее.",
            "uz": "600 yuzlar xonasiga tegishli. 6 raqami undan bir xona chapda.",
            "en": "600 is in the hundreds. 6 is one place to the left.",
          },
          "60000": {
            "ru": "60 000 относится к десяткам тысяч. Цифра 6 стоит на одно место правее.",
            "uz": "60 000 o'n minglar xonasiga tegishli. 6 raqami undan bir xona o'ngda.",
            "en": "60,000 is in the tens of thousands. 6 is one place to the right.",
          }
        },
        "inputWrongAudio": {
          "ru": "Проверь разряд цифры шесть и количество нулей в её значении.",
          "uz": "Olti raqamining xonasini va uning qiymatidagi nollar sonini tekshiring.",
          "en": "Check the place of the digit six and the number of zeros in its value.",
        },
        "audio": {
          "intro": {
            "ru": [
              "Введи значение цифры шесть в числе триста шесть тысяч пятьдесят два."
            ],
            "uz": [
              "Uch yuz olti ming ellik ikki sonidagi olti raqamining qiymatini kiriting."
            ],
            "en": [
              "Enter the value of the digit six in three hundred and six thousand fifty-two."
            ],
          },
          "on_correct": {
            "ru": "Верно. Цифра шесть в тысячах имеет значение шесть тысяч.",
            "uz": "To'g'ri. Minglar xonasidagi olti raqami olti ming qiymatga ega.",
            "en": "That's right. Six in thousands is six thousand.",
          },
          "on_wrong": {
            "ru": "Проверь разряд цифры шесть и количество нулей в её значении.",
            "uz": "Olti raqamining xonasini va uning qiymatidagi nollar sonini tekshiring.",
            "en": "Check the place of the digit six and the number of zeros in its value.",
          }
        }
      },
      {
        "eyebrow": {
          "ru": "Вместе",
          "uz": "Birgalikda",
          "en": "Together.",
        },
        "title": {
          "ru": "Разложи число полностью",
          "uz": "Sonni to'liq yoying",
          "en": "Expand the number completely",
        },
        "lead": {
          "ru": "Нулевые слагаемые можно не писать, но их места нельзя сдвигать.",
          "uz": "Nol qo'shiluvchilarni yozmaslik mumkin, ammo ularning o'rnini siljitib bo'lmaydi.",
          "en": "Zero-valued terms may be omitted, but their places must not shift.",
        },
        "instruction": {
          "ru": "Какая сумма точно показывает состав числа 581 240?",
          "uz": "Qaysi yig'indi 581 240 sonining tarkibini aniq ko'rsatadi?",
          "en": "Which sum exactly represents 581,240?",
        },
        "model": {
          "kind": "code",
          "badge": {
            "ru": "Число для разложения",
            "uz": "Yoyiladigan son",
            "en": "Number for decomposition",
          },
          "number": "581 240"
        },
        "options": [
          "500 000 + 80 000 + 1 000 + 200 + 40",
          "500 000 + 8 000 + 1 000 + 200 + 40",
          "500 000 + 80 000 + 100 + 20 + 4",
          "58 000 + 1 000 + 240"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Каждая ненулевая цифра получила своё разрядное значение. Ноль единиц не требует отдельного слагаемого.",
          "uz": "Har bir noldan farqli raqam o'z xona qiymatini oldi. Nol birlik uchun alohida qo'shiluvchi kerak emas.",
          "en": "Each non-zero digit has its own place value. Zero units doesn't require a separate term.",
        },
        "wrong": [
          null,
          {
            "ru": "Цифра 8 стоит в десятках тысяч, а не в тысячах. Её значение равно 80 000.",
            "uz": "8 raqami minglarda emas, o'n minglar xonasida turibdi. Uning qiymati 80 000.",
            "en": "The digit 8 is in the ten-thousands place, not in the thousands. It's 80,000.",
          },
          {
            "ru": "В этой сумме цифры 1, 2 и 4 сдвинуты вправо. Сохрани их исходные разряды.",
            "uz": "Bu yig'indida 1, 2 va 4 raqamlari o'ngga siljigan. Ularning dastlabki xonalarini saqlang.",
            "en": "In this sum, the numbers 1, 2 and 4 are shifted to the right.",
          },
          {
            "ru": "Первое слагаемое потеряло разряд сотен тысяч. Разлагай каждую цифру отдельно.",
            "uz": "Birinchi qo'shiluvchi yuz minglar xonasini yo'qotgan. Har bir raqamni alohida yoying.",
            "en": "The first component has lost the order of hundreds of thousands.",
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Выбери полное разложение числа пятьсот восемьдесят одна тысяча двести сорок."
            ],
            "uz": [
              "Besh yuz sakson bir ming ikki yuz qirq sonining to'liq yoyiq yozuvini tanlang."
            ],
            "en": [
              "Choose the complete expanded form of the number five hundred and eighty-one thousand and two hundred and forty."
            ],
          },
          "on_correct": {
            "ru": "Точно. Пять разрядных слагаемых сохраняют все ненулевые цифры.",
            "uz": "Aniq. Beshta xona qo'shiluvchisi barcha noldan farqli raqamlarni saqlaydi.",
            "en": "That's right. Five digits keep all the non-zero digits.",
          },
          "on_wrong": [
            null,
            {
              "ru": "Цифра восемь обозначает десятки тысяч. Увеличь это слагаемое.",
              "uz": "Sakkiz raqami o'n minglarni bildiradi. Bu qo'shiluvchini kattalashtiring.",
              "en": "The digit eight stands for eight tens of thousands. Expand that.",
            },
            {
              "ru": "Последние цифры сдвинулись вправо. Верни их в исходные разряды.",
              "uz": "Oxirgi raqamlar o'ngga siljigan. Ularni dastlabki xonalarga qaytaring.",
              "en": "The last digits have moved to the right. Return them to the original digits.",
            },
            {
              "ru": "Сотни тысяч нельзя заменить десятками тысяч. Разложи каждую цифру.",
              "uz": "Yuz minglarni o'n minglar bilan almashtirib bo'lmaydi. Har bir raqamni yoying.",
              "en": "Hundreds of thousands can't be replaced by tens of thousands. Spread out each number.",
            }
          ]
        }
      }
    ]
  },
  "s5": {
    "eyebrow": {
      "ru": "Нулевой разряд",
      "uz": "Nol qiymatli xona",
      "en": "Zero place.",
    },
    "title": {
      "ru": "В сумме ноль можно опустить, в числе — нельзя",
      "uz": "Yig'indida nolni yozmaslik mumkin, sonda esa mumkin emas",
      "en": "Omit zero-valued terms; keep zero places",
    },
    "lead": {
      "ru": "Ноль играет две разные роли: не меняет сумму и одновременно удерживает место цифр в обычной записи.",
      "uz": "Nol ikki xil vazifani bajaradi: yig'indini o'zgartirmaydi va odatiy yozuvda raqamlar o'rnini saqlaydi.",
      "en": "Zero does not change a sum, but it holds a digit's place in standard form.",
    },
    "instruction": {
      "ru": "Сравни два контраста на числе 530 407.",
      "uz": "530 407 sonidagi ikki qarama-qarshi holatni solishtiring.",
      "en": "Compare the two contrasts to the number 530,407.",
    },
    "number": "530 407",
    "places": [
      {
        "label": {
          "ru": "сотни тысяч",
          "uz": "yuz minglar",
          "en": "hundred thousand",
        },
        "digit": "5"
      },
      {
        "label": {
          "ru": "десятки тысяч",
          "uz": "o'n minglar",
          "en": "ten-thousands",
        },
        "digit": "3"
      },
      {
        "label": {
          "ru": "тысячи",
          "uz": "minglar",
          "en": "thousand",
        },
        "digit": "0",
        "zero": true
      },
      {
        "label": {
          "ru": "сотни",
          "uz": "yuzlar",
          "en": "hundred",
        },
        "digit": "4"
      },
      {
        "label": {
          "ru": "десятки",
          "uz": "o'nlar",
          "en": "tens",
        },
        "digit": "0",
        "zero": true
      },
      {
        "label": {
          "ru": "единицы",
          "uz": "birlar",
          "en": "unit",
        },
        "digit": "7"
      }
    ],
    "sumWithZeros": "500 000 + 30 000 + 0 + 400 + 0 + 7",
    "sumCompact": "500 000 + 30 000 + 400 + 7",
    "brokenNumber": "53 407",
    "sumLabel": {
      "ru": "СУММА НЕ ИЗМЕНИЛАСЬ",
      "uz": "YIG'INDI O'ZGARMADI",
      "en": "SUM IS UNCHANGED",
    },
    "sumExplanation": {
      "ru": "Нулевые слагаемые можно убрать: прибавление нуля не меняет результат.",
      "uz": "Nol qo'shiluvchilarni olib tashlash mumkin, chunki nol qo'shish natijani o'zgartirmaydi.",
      "en": "Zero-valued terms may be omitted because adding zero does not change the sum.",
    },
    "notationLabel": {
      "ru": "ЧИСЛО ИЗМЕНИЛОСЬ",
      "uz": "SON O'ZGARDI",
      "en": "NUMBER CHANGED.",
    },
    "notationExplanation": {
      "ru": "Если убрать ноль тысяч из 530 407, получится 53 407. Все цифры слева займут другие разряды.",
      "uz": "530 407 sonidan minglar xonasidagi nol olib tashlansa, 53 407 hosil bo'ladi. Chapdagi raqamlar boshqa xonalarni egallaydi.",
      "en": "Removing the thousands-place zero turns 530,407 into 53,407 and shifts the digits on its left.",
    },
    "conclusion": {
      "ru": "Коэффициент нулевого разряда не пишем отдельным слагаемым, но сам разряд в обычной записи обязательно сохраняем нулём.",
      "uz": "Nol qiymatli xona uchun alohida qo'shiluvchi yozmaymiz, ammo odatiy yozuvda shu xonani nol bilan albatta saqlaymiz.",
      "en": "Omit a zero-valued term from expanded form, but keep its place with zero in standard form.",
    },
    "audio": {
      "ru": [
        "В числе пятьсот тридцать тысяч четыреста семь пусты разряды тысяч и десятков.",
        "В развёрнутой сумме нулевые слагаемые можно не писать, потому что прибавление нуля не меняет результат.",
        "В обычной записи нули удалять нельзя. Без нуля тысяч получится уже пятьдесят три тысячи четыреста семь, то есть другое число."
      ],
      "uz": [
        "Besh yuz o'ttiz ming to'rt yuz yetti sonida minglar va o'nlar xonalari bo'sh.",
        "Yoyiq yig'indida nol qo'shiluvchilarni yozmaslik mumkin, chunki nol qo'shish natijani o'zgartirmaydi.",
        "Odatiy yozuvdagi nollarni olib tashlab bo'lmaydi. Minglar xonasidagi nolsiz ellik uch ming to'rt yuz yetti, ya'ni boshqa son hosil bo'ladi."
      ],
      "en": [
        "In five hundred and thirty thousand four hundred and seven, the thousands and tens places are empty.",
        "In the expanded sum, terms with a value of zero may be omitted, because adding zero does not change the result.",
        "In a standard form, you can't delete zeros. Without the zero in the thousands place, you get fifty-three thousand four hundred and seven, which is another number."
      ],
    }
  },
  "s6": {
    "parts": [
      {
        "eyebrow": {
          "ru": "Открытие",
          "uz": "Kashfiyot",
          "en": "Opening",
        },
        "title": {
          "ru": "Нулевое слагаемое не пишем, место сохраняем",
          "uz": "Nol qo'shiluvchini yozmaymiz, o'rnini saqlaymiz",
          "en": "We don't write zero, we save space.",
        },
        "lead": {
          "ru": "Сравни обычную и развёрнутую записи числа 462 305.",
          "uz": "462 305 sonining odatiy va yoyiq yozuvlarini solishtiring.",
          "en": "Compare the standard and expanded forms of the number 462 305.",
        },
        "instruction": {
          "ru": "Какой вывод объясняет обе записи?",
          "uz": "Qaysi xulosa ikkala yozuvni tushuntiradi?",
          "en": "What conclusion explains both records?",
        },
        "model": {
          "kind": "rows",
          "badge": {
            "ru": "Две формы одного числа",
            "uz": "Bitta sonning ikki ko'rinishi",
            "en": "Two forms of the same number",
          },
          "number": "462 305",
          "rows": [
            {
              "label": {
                "ru": "обычная запись",
                "uz": "odatiy yozuv",
                "en": "standard form",
              },
              "value": "462 305"
            },
            {
              "label": {
                "ru": "развёрнутая запись",
                "uz": "yoyiq yozuv",
                "en": "expanded form",
              },
              "value": "400 000 + 60 000 + 2 000 + 300 + 5"
            },
            {
              "label": {
                "ru": "разряд десятков",
                "uz": "o'nlar xonasi",
                "en": "tens",
              },
              "value": "0"
            }
          ]
        },
        "options": [
          {
            "ru": "Слагаемое 0 можно не писать, но ноль в числе сохраняет разряд десятков",
            "uz": "0 qo'shiluvchini yozmaslik mumkin, ammo sondagi nol o'nlar xonasini saqlaydi",
            "en": "The zero-valued term may be omitted, but the zero in the number retains the tens place.",
          },
          {
            "ru": "Ноль нужно удалить и из обычной записи",
            "uz": "Nolni odatiy yozuvdan ham olib tashlash kerak",
            "en": "Zero must also be removed from the standard form.",
          },
          {
            "ru": "В развёрнутой записи обязательно писать + 0",
            "uz": "Yoyiq yozuvda + 0 ni albatta yozish kerak",
            "en": "The expanded form must include + 0",
          },
          {
            "ru": "Ноль означает, что число заканчивается на сотнях",
            "uz": "Nol son yuzlar xonasida tugashini bildiradi",
            "en": "Zero means that the number ends in hundreds.",
          }
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Нулевое разрядное слагаемое не меняет сумму, поэтому его опускают. В записи 462 305 ноль остаётся и удерживает десятки.",
          "uz": "Nol xona qo'shiluvchisi yig'indini o'zgartirmaydi, shuning uchun yozilmaydi. 462 305 yozuvida nol qolib, o'nlar xonasini saqlaydi.",
          "en": "The zero-place-value term doesn't change the sum, so it's omitted. In the standard form 462,305, zero remains and holds the tens place.",
        },
        "wrong": [
          null,
          {
            "ru": "Без нуля получится 46 235, и цифры справа сдвинутся. В обычной записи пустой разряд нужно сохранить.",
            "uz": "Nolsiz 46 235 hosil bo'lib, o'ngdagi raqamlar siljiydi. Odatiy yozuvda bo'sh xonani saqlash kerak.",
            "en": "Without zero, you get 46,235, and the digits on the right will shift. In a standard form, you need to save the empty place.",
          },
          {
            "ru": "Добавить 0 можно, но это лишнее слагаемое: сумма не изменится. Развёрнутая запись остаётся полной и без него.",
            "uz": "0 ni qo'shish mumkin, ammo bu ortiqcha qo'shiluvchi, yig'indi o'zgarmaydi. Yoyiq yozuv usiz ham to'liq.",
            "en": "You can add 0, but that's an extra element: the amount won't change. The expanded form stays complete without it.",
          },
          {
            "ru": "После нуля есть цифра 5 в единицах. Число не заканчивается в разряде сотен.",
            "uz": "Noldan keyin birliklar xonasida 5 raqami bor. Son yuzlar xonasida tugamaydi.",
            "en": "After zero, there's a 5 in units. The number doesn't end in the hundreds.",
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Сравни обычную и развёрнутую записи числа четыреста шестьдесят две тысячи триста пять. Обрати внимание на пустые десятки."
            ],
            "uz": [
              "To'rt yuz oltmish ikki ming uch yuz besh sonining odatiy va yoyiq yozuvlarini solishtiring. Bo'sh o'nlarga e'tibor bering."
            ],
            "en": [
              "Compare the standard and expanded forms of the number four hundred and sixty-two thousand three hundred and five. Pay attention to the empty tens."
            ],
          },
          "on_correct": {
            "ru": "Открытие верно. Нулевое слагаемое опускаем, а ноль в обычной записи сохраняем.",
            "uz": "Kashfiyot to'g'ri. Nol qo'shiluvchini yozmaymiz, odatiy yozuvdagi nolni esa saqlaymiz.",
            "en": "Discovery is correct. Zero term is omitted, and zero in the standard form is saved.",
          },
          "on_wrong": [
            null,
            {
              "ru": "Ноль в обычной записи удерживает десятки. Его удалять нельзя.",
              "uz": "Odatiy yozuvdagi nol o'nlar xonasini saqlaydi. Uni olib tashlab bo'lmaydi.",
              "en": "A zero in a standard form holds tens. It can't be deleted.",
            },
            {
              "ru": "Нулевое слагаемое можно не писать, потому что оно не меняет сумму.",
              "uz": "Nol qo'shiluvchini yozmaslik mumkin, chunki u yig'indini o'zgartirmaydi.",
              "en": "The zero term may be omitted because it does not change the sum.",
            },
            {
              "ru": "Проверь цифру пять в единицах. Запись продолжается после сотен.",
              "uz": "Birliklar xonasidagi besh raqamini tekshiring. Yozuv yuzlardan keyin davom etadi.",
              "en": "Check that the digit five is in the ones place. The notation continues through tens and ones after hundreds.",
            }
          ]
        }
      },
      {
        "eyebrow": {
          "ru": "Самостоятельно",
          "uz": "Mustaqil",
          "en": "Independently.",
        },
        "title": {
          "ru": "Собери код без таблицы",
          "uz": "Kodni jadvalsiz yig'ing",
          "en": "Collect a code without a table.",
        },
        "lead": {
          "ru": "Теперь разряды нужно удержать мысленно.",
          "uz": "Endi xonalarni fikran saqlash kerak.",
          "en": "Now the places must be held mentally.",
        },
        "instruction": {
          "ru": "Введи число: 900 000 + 3 000 + 70.",
          "uz": "Sonni kiriting: 900 000 + 3 000 + 70.",
          "en": "Enter the number: 900,000 + 3000 + 70.",
        },
        "model": {
          "kind": "rows",
          "badge": {
            "ru": "Разрядные значения",
            "uz": "Xona qiymatlari",
            "en": "Place values",
          },
          "rows": [
            {
              "label": {
                "ru": "сотни тысяч",
                "uz": "yuz minglar",
                "en": "hundred thousand",
              },
              "value": "900 000"
            },
            {
              "label": {
                "ru": "тысячи",
                "uz": "minglar",
                "en": "thousand",
              },
              "value": "3 000"
            },
            {
              "label": {
                "ru": "десятки",
                "uz": "o'nlar",
                "en": "tens",
              },
              "value": "70"
            }
          ]
        },
        "placeholder": {
          "ru": "0",
          "uz": "0",
          "en": "0",
        },
        "correctValue": "903070",
        "correctText": {
          "ru": "Код 903 070 восстановлен. Нули сохранили десятки тысяч, сотни и единицы.",
          "uz": "903 070 kodi tiklandi. Nollar o'n minglar, yuzlar va birlar xonalarini saqladi.",
          "en": "Code 903,070 recovered. Zeros saved tens of thousands, hundreds and ones.",
        },
        "wrongText": {
          "ru": "Проверь все шесть мест слева направо. Для отсутствующих значений запиши нули.",
          "uz": "Chapdan o'ngga oltita o'rinni tekshiring. Yo'q qiymatlar uchun nollarni yozing.",
          "en": "Check all six places from left to right. Write down zeros for missing values.",
        },
        "wrongByValue": {
          "90370": {
            "ru": "Пропущен пустой разряд десятков тысяч. Число должно иметь шесть цифр.",
            "uz": "Bo'sh o'n minglar xonasi tushib qolgan. Son oltita raqamdan iborat bo'lishi kerak.",
            "en": "The empty ten-thousands place was omitted. The number should have six digits.",
          },
          "903700": {
            "ru": "Значение 70 сдвинуто в сотни. Оно должно занять десятки.",
            "uz": "70 qiymati yuzlar xonasiga siljigan. U o'nlar xonasini egallashi kerak.",
            "en": "The value of 70 is shifted to hundreds. It should take tens.",
          },
          "930070": {
            "ru": "Цифра 3 поставлена в десятки тысяч. Значение 3 000 относится к тысячам.",
            "uz": "3 raqami o'n minglar xonasiga qo'yilgan. 3 000 qiymati minglarga tegishli.",
            "en": "The digit 3 is in the ten-thousands place. The value of 3,000 is in the thousands.",
          }
        },
        "inputWrongAudio": {
          "ru": "Проверь места тысяч и десятков. Пустые разряды отметь нулями.",
          "uz": "Minglar va o'nlar o'rnini tekshiring. Bo'sh xonalarni nollar bilan belgilang.",
          "en": "Check the places of thousands and tens, mark the empty places with zeros.",
        },
        "audio": {
          "intro": {
            "ru": [
              "Самостоятельно восстанови число из девятисот тысяч, трёх тысяч и семидесяти."
            ],
            "uz": [
              "To'qqiz yuz ming, uch ming va yetmish qiymatlaridan sonni mustaqil tiklang."
            ],
            "en": [
              "Independently reconstruct the number from nine hundred thousand, three thousand and seventy."
            ],
          },
          "on_correct": {
            "ru": "Запись точная. Получилось девятьсот три тысячи семьдесят.",
            "uz": "Yozuv aniq. To'qqiz yuz uch ming yetmish hosil bo'ldi.",
            "en": "It's accurate. It's nine hundred and three thousand seventy.",
          },
          "on_wrong": {
            "ru": "Проверь места тысяч и десятков. Пустые разряды отметь нулями.",
            "uz": "Minglar va o'nlar o'rnini tekshiring. Bo'sh xonalarni nollar bilan belgilang.",
            "en": "Check the places of thousands and tens, mark the empty places with zeros.",
          }
        }
      }
    ]
  },
  "s7": {
    "eyebrow": {
      "ru": "Собираем правило",
      "uz": "Qoidani yig'amiz",
      "en": "Making a rule",
    },
    "title": {
      "ru": "От цифры к разложению",
      "uz": "Raqamdan yoyiq yozuvgacha",
      "en": "From number to decomposition",
    },
    "lead": {
      "ru": "Теперь можно собрать правило из найденных действий.",
      "uz": "Endi topilgan harakatlardan qoidani yig'ish mumkin.",
      "en": "Now you can compile a rule from the actions found.",
    },
    "instruction": {
      "ru": "Какой алгоритм работает и для разложения, и для восстановления числа?",
      "uz": "Qaysi algoritm sonni yoyish va tiklash uchun ham ishlaydi?",
      "en": "What algorithm works both to decompose and to restore a number?",
    },
    "model": {
      "kind": "steps",
      "badge": {
        "ru": "Алгоритм",
        "uz": "Algoritm",
        "en": "The algorithm.",
      },
      "steps": [
        {
          "ru": "1. Назвать цифру и её разряд",
          "uz": "1. Raqam va uning xonasini aytish",
          "en": "1. Name the number and its place",
        },
        {
          "ru": "2. Определить разрядное значение",
          "uz": "2. Xona qiymatini aniqlash",
          "en": "2. Determine the place value",
        },
        {
          "ru": "3. Сложить значения или заполнить разряды",
          "uz": "3. Qiymatlarni qo'shish yoki xonalarni to'ldirish",
          "en": "3. Add the values or fill in the places",
        }
      ]
    },
    "options": [
      {
        "ru": "Определить место каждой цифры, записать её значение и сохранить пустые разряды нулями",
        "uz": "Har bir raqam o'rnini aniqlash, qiymatini yozish va bo'sh xonalarni nollar bilan saqlash",
        "en": "Determine the place of each digit, write its value and preserve empty places with zeros.",
      },
      {
        "ru": "Выписать только ненулевые цифры подряд",
        "uz": "Faqat noldan farqli raqamlarni ketma-ket yozish",
        "en": "Write only non-zero numbers in a row",
      },
      {
        "ru": "Сложить названия всех разрядов",
        "uz": "Barcha xonalar nomini qo'shish",
        "en": "Add the names of all places",
      },
      {
        "ru": "Определять значение по соседней цифре",
        "uz": "Qiymatni qo'shni raqam orqali aniqlash",
        "en": "Determine a digit's value from a neighbouring digit",
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Алгоритм связывает цифру, разряд и значение. Нули при восстановлении удерживают пустые места.",
      "uz": "Algoritm raqam, xona va qiymatni bog'laydi. Tiklashda nollar bo'sh o'rinlarni saqlaydi.",
      "en": "The algorithm links the digit, its place and its value. During reconstruction, zeros hold the empty places.",
    },
    "wrong": [
      null,
      {
        "ru": "Так пустые разряды исчезнут и остальные цифры сдвинутся. Нули нужно сохранить.",
        "uz": "Bunday qilsangiz bo'sh xonalar yo'qolib, boshqa raqamlar siljiydi. Nollarni saqlash kerak.",
        "en": "So the empty places will disappear and the remaining digits will shift.",
      },
      {
        "ru": "Названия разрядов не являются числами для сложения. Складывают разрядные значения цифр.",
        "uz": "Xona nomlari qo'shiladigan sonlar emas. Raqamlarning xona qiymatlari qo'shiladi.",
        "en": "The names of the places are not numbers to add up. They add up the place values of the numbers.",
      },
      {
        "ru": "Соседняя цифра не задаёт значение. Его определяет место цифры.",
        "uz": "Qo'shni raqam qiymatni belgilamaydi. Uni raqamning o'rni belgilaydi.",
        "en": "The next digit doesn't give a value. It's where the digit is.",
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Собери правило, которое помогает разложить число и восстановить его из разрядных значений."
        ],
        "uz": [
          "Sonni yoyish va xona qiymatlaridan tiklashga yordam beradigan qoidani yig'ing."
        ],
        "en": [
          "Build a rule that helps you decompose a number and reconstruct it from its place values."
        ],
      },
      "on_correct": {
        "ru": "Правило полное. Сначала место, затем значение, после этого сумма или запись числа.",
        "uz": "Qoida to'liq. Avval o'rin, keyin qiymat, undan so'ng yig'indi yoki son yozuvi.",
        "en": "The rule is complete. First the place, then the value, then the sum or the standard form of the number.",
      },
      "on_wrong": [
        null,
        {
          "ru": "Ненулевых цифр недостаточно. Пустые разряды тоже нужно сохранить.",
          "uz": "Noldan farqli raqamlarning o'zi yetarli emas. Bo'sh xonalarni ham saqlash kerak.",
          "en": "Non-zero digits are not enough. Empty digits need to be saved, too.",
        },
        {
          "ru": "Складывают значения цифр, а не названия разрядов.",
          "uz": "Xona nomlari emas, raqamlarning qiymatlari qo'shiladi.",
          "en": "Add up the values of numbers, not the names of places.",
        },
        {
          "ru": "Ищи значение по месту цифры, а не по соседу.",
          "uz": "Qiymatni qo'shni raqamdan emas, raqam o'rnidan toping.",
          "en": "Look for the value by location, not by neighbour.",
        }
      ]
    }
  },
  "s8": {
    "eyebrow": {
      "ru": "Меньше подсказок",
      "uz": "Kamroq yordam",
      "en": "Fewer clues",
    },
    "title": {
      "ru": "Восстанови число по значениям",
      "uz": "Sonni qiymatlardan tiklang",
      "en": "Restore the number to the values",
    },
    "lead": {
      "ru": "Пустые десятки тысяч и сотни нужно обозначить нулями.",
      "uz": "Bo'sh o'n minglar va yuzlar xonalarini nollar bilan belgilash kerak.",
      "en": "The empty tens of thousands and hundreds should be denoted by zeros.",
    },
    "instruction": {
      "ru": "Введи число: 700 000 + 9 000 + 50 + 3.",
      "uz": "Sonni kiriting: 700 000 + 9 000 + 50 + 3.",
      "en": "Enter the number: 700,000 + 9,000 + 50 + 3.",
    },
    "model": {
      "kind": "rows",
      "badge": {
        "ru": "Карточки значений",
        "uz": "Qiymat kartalari",
        "en": "Value cards",
      },
      "rows": [
        {
          "label": {
            "ru": "сотни тысяч",
            "uz": "yuz minglar",
            "en": "hundred thousand",
          },
          "value": "700 000"
        },
        {
          "label": {
            "ru": "тысячи",
            "uz": "minglar",
            "en": "thousand",
          },
          "value": "9 000"
        },
        {
          "label": {
            "ru": "десятки",
            "uz": "o'nlar",
            "en": "tens",
          },
          "value": "50"
        },
        {
          "label": {
            "ru": "единицы",
            "uz": "birlar",
            "en": "unit",
          },
          "value": "3"
        }
      ]
    },
    "placeholder": {
      "ru": "0",
      "uz": "0",
      "en": "0",
    },
    "correctValue": "709053",
    "correctText": {
      "ru": "Получилось 709 053. Нули сохранили пустые десятки тысяч и сотни.",
      "uz": "709 053 hosil bo'ldi. Nollar bo'sh o'n minglar va yuzlar xonalarini saqladi.",
      "en": "That's 709,053. The zeros kept the empty tens of thousands and hundreds.",
    },
    "wrongText": {
      "ru": "Размести каждую карточку в своём разряде. Пустые разряды заполни нулями.",
      "uz": "Har bir kartani o'z xonasiga joylashtiring. Bo'sh xonalarni nollar bilan to'ldiring.",
      "en": "Place each card in your place, fill the empty places with zeros.",
    },
    "wrongByValue": {
      "7953": {
        "ru": "Пропущены два пустых разряда. Число должно занимать шесть мест.",
        "uz": "Ikkita bo'sh xona tushib qolgan. Son oltita o'rinni egallashi kerak.",
        "en": "Two empty places are missing. The number should occupy six places.",
      },
      "709530": {
        "ru": "Все правые значения сдвинуты на одно место влево. Проверь единицы.",
        "uz": "O'ngdagi barcha qiymatlar bir xona chapga siljigan. Birliklarni tekshiring.",
        "en": "All right values are shifted one place to the left.",
      },
      "790053": {
        "ru": "Цифра 9 поставлена в десятки тысяч. Карточка 9 000 относится к тысячам.",
        "uz": "9 raqami o'n minglar xonasiga qo'yilgan. 9 000 kartasi minglarga tegishli.",
        "en": "The digit 9 is in the ten-thousands place. The card 9,000 is in the thousands.",
      }
    },
    "inputWrongAudio": {
      "ru": "Проверь шесть разрядов и верни нули в пустые места.",
      "uz": "Oltita xonani tekshiring va nollarni bo'sh o'rinlarga qaytaring.",
      "en": "Check six digits and put the zeros back in the blanks.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Восстанови число из семисот тысяч, девяти тысяч, пятидесяти и трёх. Пустые разряды заполни нулями."
        ],
        "uz": [
          "Yetti yuz ming, to'qqiz ming, ellik va uch qiymatlaridan sonni tiklang. Bo'sh xonalarni nollar bilan to'ldiring."
        ],
        "en": [
          "Reconstruct the number from seven hundred thousand, nine thousand, fifty and three, fill the empty places with zeros."
        ],
      },
      "on_correct": {
        "ru": "Запись точная. Нули удержали пустые разряды.",
        "uz": "Yozuv aniq. Nollar bo'sh xonalarni saqladi.",
        "en": "The notation is accurate. The zeros have held the empty places.",
      },
      "on_wrong": {
        "ru": "Проверь шесть разрядов и верни нули в пустые места.",
        "uz": "Oltita xonani tekshiring va nollarni bo'sh o'rinlarga qaytaring.",
        "en": "Check six digits and put the zeros back in the blanks.",
      }
    }
  },
  "s9": {
    "eyebrow": {
      "ru": "Разбор примеров",
      "uz": "Misollar tahlili",
      "en": "Example analysis",
    },
    "title": {
      "ru": "Четыре решения в одном обзоре",
      "uz": "To'rtta yechim bitta sharhda",
      "en": "Four solutions in one review",
    },
    "lead": {
      "ru": "Проследи, как место цифры помогает назвать разряд, значение, число и его развёрнутую запись.",
      "uz": "Raqamning o'rni xona, qiymat, son va uning yoyiq yozuvini aniqlashga qanday yordam berishini kuzating.",
      "en": "See how the location of a digit helps to name a digit, a value, a number, and its expanded form.",
    },
    "audio": {
      "intro": {
        "ru": [
          "Разберём четыре готовых примера о цифрах, разрядах, значениях и разложении числа."
        ],
        "uz": [
          "Raqam, xona, qiymat va sonning yoyiq yozuviga oid to'rtta tayyor misolni tahlil qilamiz."
        ],
        "en": [
          "Let's analyse four worked examples about numbers, digits, place values and decomposition."
        ],
      }
    },
    "items": [
      {
        "question": {
          "ru": "В каком разряде стоит цифра 8 в числе 681 407?",
          "uz": "681 407 sonida 8 raqami qaysi xonada turibdi?",
          "en": "What is the value of the digit 8 in 681,407?",
        },
        "options": [
          {
            "ru": "десятки тысяч",
            "uz": "o'n minglar",
            "en": "ten-thousands",
          },
          {
            "ru": "тысячи",
            "uz": "minglar",
            "en": "thousand",
          },
          {
            "ru": "сотни тысяч",
            "uz": "yuz minglar",
            "en": "hundred thousand",
          },
          {
            "ru": "сотни",
            "uz": "yuzlar",
            "en": "hundred",
          }
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Цифра 8 стоит в десятках тысяч.",
          "uz": "8 raqami o'n minglar xonasida turibdi.",
          "en": "The digit 8 is in the ten-thousands place.",
        },
        "wrong": [
          null,
          {
            "ru": "В тысячах стоит цифра 1. Цифра 8 находится левее.",
            "uz": "Minglar xonasida 1 turibdi. 8 raqami undan chapda.",
            "en": "The thousands place contains the digit 1. The digit 8 is farther left.",
          },
          {
            "ru": "В сотнях тысяч стоит цифра 6. Цифра 8 находится правее.",
            "uz": "Yuz minglar xonasida 6 turibdi. 8 raqami undan o'ngda.",
            "en": "The hundred-thousands place contains the digit 6. The digit 8 is to its right.",
          },
          {
            "ru": "В сотнях стоит цифра 4. Считай разряды справа налево.",
            "uz": "Yuzlar xonasida 4 turibdi. Xonalarni o'ngdan chapga sanang.",
            "en": "The hundreds place contains the digit 4. Count the digits from right to left.",
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Назови разряд цифры восемь в числе шестьсот восемьдесят одна тысяча четыреста семь."
            ],
            "uz": [
              "Olti yuz sakson bir ming to'rt yuz yetti sonidagi sakkiz raqamining xonasini toping."
            ],
            "en": [
              "Find the digit eight in the number six hundred eighty-one thousand four hundred seven."
            ],
          },
          "on_correct": {
            "ru": "Верно. Это разряд десятков тысяч.",
            "uz": "To'g'ri. Bu o'n minglar xonasi.",
            "en": "That's tens of thousands.",
          },
          "on_wrong": [
            null,
            {
              "ru": "В тысячах стоит единица. Посмотри на один столбец левее.",
              "uz": "Minglar xonasida bir turibdi. Bir ustun chapga qarang.",
              "en": "There's one in thousands. Look at one to the left.",
            },
            {
              "ru": "В сотнях тысяч стоит шесть. Цифра восемь находится правее.",
              "uz": "Yuz minglarda olti turibdi. Sakkiz undan o'ngda.",
              "en": "The hundred-thousands place contains six. The digit eight is to its right.",
            },
            {
              "ru": "Сотни находятся в правом классе. Цифра восемь стоит левее.",
              "uz": "Yuzlar o'ng sinfda. Sakkiz raqami undan chapda.",
              "en": "The hundreds place is in the group on the right. The digit eight is to its left.",
            }
          ]
        }
      },
      {
        "question": {
          "ru": "Чему равно значение цифры 6 в числе 306 254?",
          "uz": "306 254 sonidagi 6 raqamining qiymati qancha?",
          "en": "What is the value of the digit 6 in 306 254?",
        },
        "options": [
          "6 000",
          "600",
          "60 000",
          "6"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "В разряде тысяч цифра 6 имеет значение 6 000.",
          "uz": "Minglar xonasidagi 6 raqami 6 000 qiymatga ega.",
          "en": "The digit 6 is in the thousands place, so its value is 6,000.",
        },
        "wrong": [
          null,
          {
            "ru": "600 относится к сотням. Цифра 6 стоит левее.",
            "uz": "600 yuzlar xonasiga tegishli. 6 raqami undan chapda.",
            "en": "600 is the value of a digit in the hundreds place. The digit 6 is farther left.",
          },
          {
            "ru": "60 000 относится к десяткам тысяч. В этом разряде стоит ноль.",
            "uz": "60 000 o'n minglar xonasiga tegishli. Bu xonada nol turibdi.",
            "en": "60,000 is in the tens of thousands. That's zero.",
          },
          {
            "ru": "Это цифра без учёта разряда. В тысячах её значение больше.",
            "uz": "Bu xona hisobga olinmagan raqam. Minglarda uning qiymati kattaroq.",
            "en": "It's a number that doesn't count the digits. It's bigger in the thousands.",
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Определи значение цифры шесть в числе триста шесть тысяч двести пятьдесят четыре."
            ],
            "uz": [
              "Uch yuz olti ming ikki yuz ellik to'rt sonidagi olti raqamining qiymatini aniqlang."
            ],
            "en": [
              "Determine the value of the digit six in the number three hundred and six thousand two hundred and fifty-four."
            ],
          },
          "on_correct": {
            "ru": "Да. Цифра шесть в тысячах означает шесть тысяч.",
            "uz": "Ha. Minglardagi olti raqami olti mingni bildiradi.",
            "en": "The digit six in the thousands place means six thousand.",
          },
          "on_wrong": [
            null,
            {
              "ru": "Шестьсот относится к сотням. Найди разряд тысяч.",
              "uz": "Olti yuz yuzlarga tegishli. Minglar xonasini toping.",
              "en": "Six hundred are among the hundreds. Find the thousands place.",
            },
            {
              "ru": "Шестьдесят тысяч относится к соседнему разряду слева.",
              "uz": "Oltmish ming chapdagi qo'shni xonaga tegishli.",
              "en": "Sixty thousand belongs to the next place on the left.",
            },
            {
              "ru": "Добавь значение разряда тысяч к цифре шесть.",
              "uz": "Olti raqamiga minglar xonasi qiymatini qo'shing.",
              "en": "Multiply the digit six by the value of the thousands place.",
            }
          ]
        }
      },
      {
        "question": {
          "ru": "Какое число получится из 700 000 + 40 000 + 900 + 2?",
          "uz": "700 000 + 40 000 + 900 + 2 dan qaysi son hosil bo'ladi?",
          "en": "What number will you get from 700,000 + 40,000 + 900 + 2?",
        },
        "options": [
          "740 902",
          "704 902",
          "740 920",
          "74 902"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "740 902 сохраняет каждое значение и пустой разряд десятков.",
          "uz": "740 902 har bir qiymatni va bo'sh o'nlar xonasini saqlaydi.",
          "en": "740 902 retains each value and an empty place of tens.",
        },
        "wrong": [
          null,
          {
            "ru": "40 000 поставлено в тысячи. Оно относится к десяткам тысяч.",
            "uz": "40 000 minglarga qo'yilgan. U o'n minglarga tegishli.",
            "en": "40,000 is in the thousands. It's in the tens of thousands.",
          },
          {
            "ru": "Цифра 2 сдвинута в десятки. Значение 2 относится к единицам.",
            "uz": "2 raqami o'nlarga siljigan. 2 qiymati birliklarga tegishli.",
            "en": "The digit 2 has shifted into the tens place. Its correct value belongs in the ones place.",
          },
          {
            "ru": "Потерян разряд сотен тысяч. Число должно иметь шесть цифр.",
            "uz": "Yuz minglar xonasi yo'qolgan. Son oltita raqamdan iborat bo'lishi kerak.",
            "en": "The hundred-thousands place was lost. The number should have six digits.",
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Собери число из семисот тысяч, сорока тысяч, девятисот и двух."
            ],
            "uz": [
              "Yetti yuz ming, qirq ming, to'qqiz yuz va ikki qiymatlaridan sonni yig'ing."
            ],
            "en": [
              "Build a number from seven hundred thousand, forty thousand, nine hundred and two."
            ],
          },
          "on_correct": {
            "ru": "Точно. Получилось семьсот сорок тысяч девятьсот два.",
            "uz": "Aniq. Yetti yuz qirq ming to'qqiz yuz ikki hosil bo'ldi.",
            "en": "That's right. That's seven hundred and forty thousand nine hundred and two.",
          },
          "on_wrong": [
            null,
            {
              "ru": "Сорок тысяч должны занять десятки тысяч.",
              "uz": "Qirq ming o'n minglar xonasini egallashi kerak.",
              "en": "Forty thousand should take tens of thousands.",
            },
            {
              "ru": "Двойка относится к единицам. Верни ноль в десятки.",
              "uz": "Ikki birliklarga tegishli. Nolni o'nlar xonasiga qaytaring.",
              "en": "A two is a one. Put zero back in the tens.",
            },
            {
              "ru": "Семьсот тысяч требует разряда сотен тысяч.",
              "uz": "Yetti yuz ming yuz minglar xonasini talab qiladi.",
              "en": "Seven hundred thousand requires the hundred-thousands place.",
            }
          ]
        }
      },
      {
        "question": {
          "ru": "Как разложить число 205 070?",
          "uz": "205 070 sonini qanday yoyamiz?",
          "en": "How do you decompose the number 205,070?",
        },
        "options": [
          "200 000 + 5 000 + 70",
          "200 000 + 50 000 + 70",
          "200 000 + 5 000 + 700",
          "20 000 + 5 000 + 70"
        ],
        "correctIndex": 0,
        "correctText": {
          "ru": "Ненулевые цифры дают 200 000, 5 000 и 70.",
          "uz": "Noldan farqli raqamlar 200 000, 5 000 va 70 ni beradi.",
          "en": "Non-zero numbers give 200,000, 5,000 and 70.",
        },
        "wrong": [
          null,
          {
            "ru": "Цифра 5 стоит в тысячах, а не в десятках тысяч. Уменьши это слагаемое.",
            "uz": "5 raqami o'n minglarda emas, minglarda turibdi. Bu qo'shiluvchini kichraytiring.",
            "en": "The digit 5 is in the thousands place, not the tens of thousands.",
          },
          {
            "ru": "Цифра 7 стоит в десятках, а не в сотнях. Нужно слагаемое 70.",
            "uz": "7 raqami yuzlarda emas, o'nlarda turibdi. 70 qo'shiluvchisi kerak.",
            "en": "The digit 7 is in the tens place, not in the hundreds. It's 70.",
          },
          {
            "ru": "Цифра 2 стоит в сотнях тысяч. Первое слагаемое должно быть 200 000.",
            "uz": "2 raqami yuz minglar xonasida. Birinchi qo'shiluvchi 200 000 bo'lishi kerak.",
            "en": "The digit 2 is in the hundred-thousands place. The first component should be 200,000.",
          }
        ],
        "audio": {
          "intro": {
            "ru": [
              "Выбери разложение числа двести пять тысяч семьдесят."
            ],
            "uz": [
              "Ikki yuz besh ming yetmish sonining yoyiq yozuvini tanlang."
            ],
            "en": [
              "Choose the expanded form of two hundred and five thousand seventy."
            ],
          },
          "on_correct": {
            "ru": "Верно. Три ненулевые цифры дали три разрядных слагаемых.",
            "uz": "To'g'ri. Uchta noldan farqli raqam uchta xona qo'shiluvchisini berdi.",
            "en": "That's right. Three non-zero digits gave us three place-value terms.",
          },
          "on_wrong": [
            null,
            {
              "ru": "Пятёрка стоит в тысячах. Уменьши второе слагаемое.",
              "uz": "Besh minglar xonasida turibdi. Ikkinchi qo'shiluvchini kichraytiring.",
              "en": "Five is in the thousands. Reduce the second.",
            },
            {
              "ru": "Семёрка стоит в десятках. Нужны семь десятков.",
              "uz": "Yetti o'nlar xonasida. Yetti o'nlik kerak.",
              "en": "Seven is in the tens. You need seven tens.",
            },
            {
              "ru": "Двойка обозначает сотни тысяч. Верни первый разряд.",
              "uz": "Ikki yuz minglarni bildiradi. Birinchi xonani qaytaring.",
              "en": "Two's worth hundreds of thousands.",
            }
          ]
        }
      }
    ],
    "completionText": {
      "ru": "Четыре решения разобраны.",
      "uz": "To'rtta yechim tahlil qilindi.",
      "en": "Four solutions disassembled.",
    }
  },
  "s10": {
    "eyebrow": {
      "ru": "Лаборатория решения",
      "uz": "Yechim laboratoriyasi",
      "en": "Solution laboratory",
    },
    "title": {
      "ru": "Собираем число из перемешанных карточек",
      "uz": "Aralash kartalardan sonni yig'amiz",
      "en": "Build a number from shuffled cards",
    },
    "lead": {
      "ru": "Карточки пришли без порядка. Полное решение сначала возвращает каждой карточке разряд, затем восстанавливает пустое место.",
      "uz": "Kartalar tartibsiz keldi. To'liq yechim avval har bir kartani o'z xonasiga qaytaradi, keyin bo'sh joyni tiklaydi.",
      "en": "The cards came in without order. The complete solution first returns each card a place, then restores the empty space.",
    },
    "instruction": {
      "ru": "Восстановим число из пяти разрядных значений и проверим его обратным разложением.",
      "uz": "Sonni beshta xona qiymatidan tiklaymiz va uni qayta yoyib tekshiramiz.",
      "en": "Restore the number of five place values and check it by reverse decomposition.",
    },
    "shuffledCards": [
      "5",
      "80 000",
      "4 000",
      "600 000",
      "200"
    ],
    "slots": [
      {
        "place": {
          "ru": "сотни тысяч",
          "uz": "yuz minglar",
          "en": "hundred thousand",
        },
        "digit": "6",
        "value": "600 000"
      },
      {
        "place": {
          "ru": "десятки тысяч",
          "uz": "o'n minglar",
          "en": "ten-thousands",
        },
        "digit": "8",
        "value": "80 000"
      },
      {
        "place": {
          "ru": "тысячи",
          "uz": "minglar",
          "en": "thousand",
        },
        "digit": "4",
        "value": "4 000"
      },
      {
        "place": {
          "ru": "сотни",
          "uz": "yuzlar",
          "en": "hundred",
        },
        "digit": "2",
        "value": "200"
      },
      {
        "place": {
          "ru": "десятки",
          "uz": "o'nlar",
          "en": "tens",
        },
        "digit": "0",
        "value": {
          "ru": "карточки нет",
          "uz": "karta yo'q",
          "en": "No card.",
        },
        "empty": true
      },
      {
        "place": {
          "ru": "единицы",
          "uz": "birlar",
          "en": "unit",
        },
        "digit": "5",
        "value": "5"
      }
    ],
    "steps": [
      {
        "label": {
          "ru": "1. Найти место",
          "uz": "1. O'rinni topish",
          "en": "1.Find a place.",
        },
        "text": {
          "ru": "Количество нулей и значение карточки показывают её разряд.",
          "uz": "Nollar soni va karta qiymati uning xonasini ko'rsatadi.",
          "en": "The number of zeros and the value of the card indicate its place.",
        }
      },
      {
        "label": {
          "ru": "2. Заполнить пробел",
          "uz": "2. Bo'sh joyni to'ldirish",
          "en": "2. Fill in the gap",
        },
        "text": {
          "ru": "Карточки десятков нет, поэтому в этот разряд ставим 0.",
          "uz": "O'nlar kartasi yo'q, shuning uchun bu xonaga 0 qo'yamiz.",
          "en": "There are no tens of cards, so we put 0 in this place.",
        }
      },
      {
        "label": {
          "ru": "3. Проверить",
          "uz": "3. Tekshirish",
          "en": "3.Verify",
        },
        "text": {
          "ru": "Снова раскладываем полученное число и сравниваем набор значений.",
          "uz": "Hosil bo'lgan sonni yana yoyib, qiymatlar to'plami bilan solishtiramiz.",
          "en": "Again, we lay out the resulting number and compare the set of values.",
        }
      }
    ],
    "result": "684 205",
    "verification": "600 000 + 80 000 + 4 000 + 200 + 5",
    "conclusion": {
      "ru": "684 205 — единственная запись, в которой каждая карточка сохранила свой разряд, а отсутствующие десятки обозначены нулём.",
      "uz": "684 205 har bir karta o'z xonasini saqlagan va yo'q o'nlar nol bilan belgilangan yagona yozuvdir.",
      "en": "684,205 is the only notation in which each card has retained its place, and the missing tens are marked with zero.",
    },
    "replay": {
      "ru": "Повторить сборку",
      "uz": "Yig'ishni takrorlash",
      "en": "Re-assembly",
    },
    "audio": {
      "ru": [
        "Карточки пришли в случайном порядке. Сначала определим разряд каждой карточки по её значению.",
        "Шестьсот тысяч ставим в сотни тысяч, восемьдесят тысяч в десятки тысяч, четыре тысячи в тысячи, двести в сотни, а пять в единицы.",
        "Карточки десятков нет, поэтому пустое место заполняем нулём. Получается шестьсот восемьдесят четыре тысячи двести пять.",
        "Обратное разложение возвращает все пять исходных значений. Значит, число восстановлено точно."
      ],
      "uz": [
        "Kartalar tasodifiy tartibda keldi. Avval har bir kartaning xonasini uning qiymati orqali aniqlaymiz.",
        "Olti yuz mingni yuz minglarga, sakson mingni o'n minglarga, to'rt mingni minglarga, ikki yuzni yuzlarga, beshni esa birlarga joylaymiz.",
        "O'nlar kartasi yo'q, shuning uchun bo'sh joyni nol bilan to'ldiramiz. Olti yuz sakson to'rt ming ikki yuz besh hosil bo'ladi.",
        "Qayta yoyish beshta dastlabki qiymatning barchasini qaytaradi. Demak, son aniq tiklandi."
      ],
      "en": [
        "The cards came in random order. First, let's place each card by its value.",
        "Place six hundred thousand in the hundred-thousands column, eighty thousand in ten-thousands, four thousand in thousands, two hundred in hundreds and five in ones.",
        "There is no tens card, so you fill the empty space with zero, and you get six hundred and eighty-four thousand two hundred and five.",
        "Reverse decomposition returns all five original values, which means that the number is restored exactly."
      ],
    }
  },
  "s11": {
    "eyebrow": {
      "ru": "Выбор стратегии",
      "uz": "Strategiyani tanlash",
      "en": "Choosing a strategy",
    },
    "title": {
      "ru": "Как надёжнее собрать число?",
      "uz": "Sonni qanday ishonchli yig'amiz?",
      "en": "What is the most reliable way to build the number?",
    },
    "lead": {
      "ru": "Сложение тоже даст ответ, но таблица лучше показывает пустые разряды.",
      "uz": "Qo'shish ham javob beradi, ammo jadval bo'sh xonalarni yaxshiroq ko'rsatadi.",
      "en": "Addition will also give an answer, but the table better shows empty places.",
    },
    "instruction": {
      "ru": "Какой способ надёжнее восстановит 608 401 из разрядных значений?",
      "uz": "608 401 sonini xona qiymatlaridan qaysi usul ishonchliroq tiklaydi?",
      "en": "What is the most reliable way to reconstruct 608,401 from its place values?",
    },
    "model": {
      "kind": "rows",
      "badge": {
        "ru": "Пакет значений",
        "uz": "Qiymatlar to'plami",
        "en": "Package of values",
      },
      "rows": [
        {
          "label": {
            "ru": "сотни тысяч",
            "uz": "yuz minglar",
            "en": "hundred thousand",
          },
          "value": "600 000"
        },
        {
          "label": {
            "ru": "тысячи",
            "uz": "minglar",
            "en": "thousand",
          },
          "value": "8 000"
        },
        {
          "label": {
            "ru": "сотни",
            "uz": "yuzlar",
            "en": "hundred",
          },
          "value": "400"
        },
        {
          "label": {
            "ru": "единицы",
            "uz": "birlar",
            "en": "unit",
          },
          "value": "1"
        }
      ]
    },
    "options": [
      {
        "ru": "Разместить значения в разрядной таблице, заполнить пустые места нулями и проверить сложением",
        "uz": "Qiymatlarni xona jadvaliga joylashtirish, bo'sh o'rinlarni nollar bilan to'ldirish va qo'shib tekshirish",
        "en": "Place the values in the place-value chart, fill the empty spaces with zeros and check with addition",
      },
      {
        "ru": "Сразу сложить все значения без разрядной таблицы",
        "uz": "Barcha qiymatlarni xona jadvalisiz darhol qo'shish",
        "en": "Put all the values together without a place-value chart.",
      },
      {
        "ru": "Записать подряд только ненулевые цифры",
        "uz": "Faqat noldan farqli raqamlarni ketma-ket yozish",
        "en": "Write down only non-zero numbers in a row",
      },
      {
        "ru": "Посчитать количество карточек",
        "uz": "Kartalar sonini sanash",
        "en": "Count the number of cards",
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Таблица явно показывает шесть мест, а сложение служит проверкой. Так нули не исчезнут.",
      "uz": "Jadval oltita o'rinni aniq ko'rsatadi, qo'shish esa tekshiruv bo'ladi. Shunda nollar yo'qolmaydi.",
      "en": "The table clearly shows six places, and the addition serves as a test, so the zeros don't disappear.",
    },
    "wrong": [
      null,
      {
        "ru": "Сложение математически верно, но без таблицы легче пропустить пустой разряд. Добавь позиционную проверку.",
        "uz": "Qo'shish matematik jihatdan to'g'ri, ammo jadvalsiz bo'sh xonani o'tkazib yuborish oson. Xona bo'yicha tekshiruv qo'shing.",
        "en": "The addition is mathematically correct, but without a table, it's easier to miss an empty place.",
      },
      {
        "ru": "Так получится 6841 и пустые разряды исчезнут. Нули должны удержать их места.",
        "uz": "Bunday usulda 6841 hosil bo'lib, bo'sh xonalar yo'qoladi. Nollar ularning o'rnini saqlashi kerak.",
        "en": "That's 6,841, and the empty places are gone, and the zeros are supposed to hold their places.",
      },
      {
        "ru": "Количество карточек не показывает разряды. Нужно разместить каждое значение по месту.",
        "uz": "Kartalar soni xonalarni ko'rsatmaydi. Har bir qiymatni o'z o'rniga joylashtirish kerak.",
        "en": "The number of cards does not show the places. Put each value in its correct place.",
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Выбери самый надёжный способ собрать число шестьсот восемь тысяч четыреста один и сохранить пустые разряды."
        ],
        "uz": [
          "Olti yuz sakkiz ming to'rt yuz bir sonini yig'ish va bo'sh xonalarni saqlashning eng ishonchli usulini tanlang."
        ],
        "en": [
          "Choose the most reliable way to reconstruct the number six hundred and eight thousand four hundred and one and keep the empty places."
        ],
      },
      "on_correct": {
        "ru": "Это надёжная стратегия. Таблица сохраняет места, а сложение проверяет результат.",
        "uz": "Bu ishonchli strategiya. Jadval o'rinlarni saqlaydi, qo'shish esa natijani tekshiradi.",
        "en": "It's a reliable strategy. The table saves the places, and the addition checks the results.",
      },
      "on_wrong": [
        null,
        {
          "ru": "Сложение подходит, но таблица лучше защищает от пропуска нулей.",
          "uz": "Qo'shish mos, ammo jadval nollarni tushirib qoldirishdan yaxshiroq himoya qiladi.",
          "en": "Addition is suitable, but the table better protects against skipping zeros.",
        },
        {
          "ru": "Ненулевые цифры без позиций дают другое число.",
          "uz": "Noldan farqli raqamlar xonalarsiz boshqa sonni beradi.",
          "en": "Non-zero numbers without positions give a different number.",
        },
        {
          "ru": "Нужно знать место каждой карточки, а не их количество.",
          "uz": "Kartalar sonini emas, har birining o'rnini bilish kerak.",
          "en": "You need to know the place of each card, not the number.",
        }
      ]
    }
  },
  "s12": {
    "eyebrow": {
      "ru": "Работа с ошибкой",
      "uz": "Xato bilan ishlash",
      "en": "Dealing with a mistake",
    },
    "title": {
      "ru": "Значение увеличили в десять раз",
      "uz": "Qiymat o'n marta oshirib yuborildi",
      "en": "The value was increased tenfold.",
    },
    "lead": {
      "ru": "Алишер разложил число 407 206, но одна цифра попала не в свой разряд.",
      "uz": "Alisher 407 206 sonini yoydi, ammo bitta raqam noto'g'ri xonaga tushdi.",
      "en": "Alisher decomposed the number 407,206, but one digit fell into the wrong place.",
    },
    "instruction": {
      "ru": "Как исправить слагаемое 70 000?",
      "uz": "70 000 qo'shiluvchisini qanday tuzatamiz?",
      "en": "How do you fix the 70,000?",
    },
    "model": {
      "kind": "rows",
      "badge": {
        "ru": "Запись Алишера",
        "uz": "Alisherning yozuvi",
        "en": "Alisher's notation",
      },
      "number": "407 206",
      "rows": [
        {
          "label": {
            "ru": "записанное разложение",
            "uz": "yozilgan yoyiq yozuv",
            "en": "decomposition",
          },
          "value": "400 000 + 70 000 + 200 + 6"
        },
        {
          "label": {
            "ru": "место цифры 7",
            "uz": "7 raqamining o'rni",
            "en": "digit 7",
          },
          "value": {
            "ru": "тысячи",
            "uz": "minglar",
            "en": "thousand",
          }
        }
      ]
    },
    "options": [
      {
        "ru": "Заменить 70 000 на 7 000",
        "uz": "70 000 ni 7 000 ga almashtirish",
        "en": "Replace 70,000 with 7,000",
      },
      {
        "ru": "Заменить 70 000 на 700",
        "uz": "70 000 ni 700 ga almashtirish",
        "en": "Replace 70,000 with 700",
      },
      {
        "ru": "Оставить 70 000 без изменения",
        "uz": "70 000 ni o'zgarishsiz qoldirish",
        "en": "Leave 70,000 unchanged",
      },
      {
        "ru": "Удалить слагаемое полностью",
        "uz": "Qo'shiluvchini butunlay olib tashlash",
        "en": "Remove the entire sentence",
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Цифра 7 стоит в тысячах, поэтому её значение 7 000. Исправленное разложение снова даёт 407 206.",
      "uz": "7 raqami minglar xonasida, shuning uchun uning qiymati 7 000. Tuzatilgan yoyiq yozuv yana 407 206 ni beradi.",
      "en": "The digit 7 is in the thousands place, so its value is 7,000. Corrected decomposition again gives 407,206.",
    },
    "wrong": [
      null,
      {
        "ru": "700 относится к сотням, где уже стоит цифра 2. Семёрка находится левее.",
        "uz": "700 yuzlar xonasiga tegishli, u yerda 2 raqami turibdi. Yetti undan chapda.",
        "en": "700 would place the digit 7 in the hundreds place, which is already occupied by 2. Seven belongs farther left.",
      },
      {
        "ru": "70 000 поставило семёрку в десятки тысяч. В исходном числе там стоит цифра 0.",
        "uz": "70 000 yettini o'n minglar xonasiga qo'ydi. Dastlabki sonda u yerda 0 raqami turibdi.",
        "en": "70,000 puts the digit seven in the ten-thousands place, but the ten-thousands digit in the original number is zero.",
      },
      {
        "ru": "Семёрку нельзя удалять: она есть в исходном числе. Нужно вернуть ей значение тысяч.",
        "uz": "Yettini olib tashlab bo'lmaydi, u dastlabki sonda bor. Unga minglar qiymatini qaytarish kerak.",
        "en": "Seven can't be deleted; it's in the original number. You have to return it to the value of thousands.",
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Алишер записал для цифры семь значение семьдесят тысяч. Найди ошибку и верни цифру в правильный разряд."
        ],
        "uz": [
          "Alisher yetti raqami uchun yetmish ming qiymatini yozdi. Xatoni toping va raqamni to'g'ri xonaga qaytaring."
        ],
        "en": [
          "Alisher gave the digit seven the value seventy thousand. Find the error and return it to the correct place."
        ],
      },
      "on_correct": {
        "ru": "Ошибка исправлена. Семёрка в разряде тысяч означает семь тысяч.",
        "uz": "Xato tuzatildi. Minglar xonasidagi yetti raqami yetti mingni bildiradi.",
        "en": "The error is corrected. Seven in the order of thousands means seven thousand.",
      },
      "on_wrong": [
        null,
        {
          "ru": "Семьсот относится к сотням. Семёрка стоит в тысячах.",
          "uz": "Yetti yuz yuzlarga tegishli. Yetti minglar xonasida turibdi.",
          "en": "Seven hundred is in the hundreds. Seven is in the thousands.",
        },
        {
          "ru": "Семьдесят тысяч сдвигает цифру влево. Уменьши значение в десять раз.",
          "uz": "Yetmish ming raqamni chapga siljitadi. Qiymatni o'n marta kamaytiring.",
          "en": "Seventy thousand shifts the number to the left. Decrease the value tenfold.",
        },
        {
          "ru": "Цифра семь нужна. Исправь её значение, а не удаляй.",
          "uz": "Yetti raqami kerak. Uni olib tashlamang, qiymatini tuzating.",
          "en": "You need seven. You need to fix it, not delete it.",
        }
      ]
    }
  },
  "s13": {
    "eyebrow": {
      "ru": "Финальный перенос",
      "uz": "Yakuniy ko'chirish",
      "en": "Final transfer",
    },
    "title": {
      "ru": "Восстанови код городского сенсора",
      "uz": "Shahar sensori kodini tiklang",
      "en": "Recover the city's sensor code",
    },
    "lead": {
      "ru": "Сенсор передал только разрядные значения. Нужно вернуть полный шестизначный код.",
      "uz": "Sensor faqat xona qiymatlarini yubordi. To'liq olti xonali kodni tiklash kerak.",
      "en": "Sensor only transmitted place values, we need to return the full six-digit code.",
    },
    "instruction": {
      "ru": "Какой код составлен из 500 000, 20 000, 600 и 8?",
      "uz": "500 000, 20 000, 600 va 8 dan qaysi kod tuziladi?",
      "en": "Which code is made up of 500,000, 20,000, 600, and 8?",
    },
    "model": {
      "kind": "city",
      "badge": {
        "ru": "Сигнал Lumo City",
        "uz": "Lumo City signali",
        "en": "Lumo City Signal",
      },
      "rows": [
        {
          "label": {
            "ru": "сотни тысяч",
            "uz": "yuz minglar",
            "en": "hundred thousand",
          },
          "value": "500 000"
        },
        {
          "label": {
            "ru": "десятки тысяч",
            "uz": "o'n minglar",
            "en": "ten-thousands",
          },
          "value": "20 000"
        },
        {
          "label": {
            "ru": "сотни",
            "uz": "yuzlar",
            "en": "hundred",
          },
          "value": "600"
        },
        {
          "label": {
            "ru": "единицы",
            "uz": "birlar",
            "en": "unit",
          },
          "value": "8"
        }
      ]
    },
    "options": [
      "520 608",
      "502 608",
      "520 068",
      "520 680"
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Код 520 608 сохраняет все значения. Нули удерживают пустые тысячи и десятки.",
      "uz": "520 608 kodi barcha qiymatlarni saqlaydi. Nollar bo'sh minglar va o'nlar xonalarini ushlab turadi.",
      "en": "The code 520 608 keeps all the values. The zeros hold the empty thousands and tens.",
    },
    "wrong": [
      null,
      {
        "ru": "20 000 превратилось в 2 000. Цифра 2 должна стоять в десятках тысяч.",
        "uz": "20 000 qiymati 2 000 ga aylangan. 2 raqami o'n minglar xonasida turishi kerak.",
        "en": "20,000 turned into 2,000. The digit 2 should be in the ten-thousands place.",
      },
      {
        "ru": "Значение 600 уменьшено до 60. Цифра 6 должна стоять в сотнях.",
        "uz": "600 qiymati 60 gacha kamaygan. 6 raqami yuzlar xonasida turishi kerak.",
        "en": "The value of 600 is reduced to 60. The digit 6 should be in the hundreds place.",
      },
      {
        "ru": "Цифра 8 сдвинута в десятки. Значение 8 относится к единицам.",
        "uz": "8 raqami o'nlarga siljigan. 8 qiymati birliklarga tegishli.",
        "en": "The digit 8 has shifted into the tens place. Its correct value belongs in the ones place.",
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Городской сенсор передал пятьсот тысяч, двадцать тысяч, шестьсот и восемь. Восстанови полный код."
        ],
        "uz": [
          "Shahar sensori besh yuz ming, yigirma ming, olti yuz va sakkiz qiymatlarini yubordi. To'liq kodni tiklang."
        ],
        "en": [
          "The city sensor transmitted five hundred thousand, twenty thousand, six hundred and eight. Reconstruct the full code."
        ],
      },
      "on_correct": {
        "ru": "Код восстановлен. Получилось пятьсот двадцать тысяч шестьсот восемь.",
        "uz": "Kod tiklandi. Besh yuz yigirma ming olti yuz sakkiz hosil bo'ldi.",
        "en": "The code was restored. It was five hundred and twenty thousand six hundred and eight.",
      },
      "on_wrong": [
        null,
        {
          "ru": "Двадцать тысяч должны занять десятки тысяч.",
          "uz": "Yigirma ming o'n minglar xonasini egallashi kerak.",
          "en": "Twenty thousand should take tens of thousands.",
        },
        {
          "ru": "Шестьсот относится к сотням. Верни цифру шесть на одно место влево.",
          "uz": "Olti yuz yuzlar xonasiga tegishli. Olti raqamini bir xona chapga qaytaring.",
          "en": "Six hundred is in the hundreds. Put six back one place to the left.",
        },
        {
          "ru": "Восемь относится к единицам. Верни ноль в десятки.",
          "uz": "Sakkiz birliklarga tegishli. Nolni o'nlar xonasiga qaytaring.",
          "en": "Eight refers to units. Put zero back in the tens.",
        }
      ]
    }
  },
  "s14": {
    "eyebrow": {
      "ru": "Итог и мост",
      "uz": "Yakun va ko'prik",
      "en": "Bottom line",
    },
    "title": {
      "ru": "Цифра, разряд и значение работают вместе",
      "uz": "Raqam, xona va qiymat birga ishlaydi",
      "en": "Number, place and value work together.",
    },
    "lead": {
      "ru": "Полная цепочка откроется автоматически и соберёт способ целиком.",
      "uz": "To'liq ketma-ketlik avtomatik ochilib, usulni yaxlit ko'rsatadi.",
      "en": "The full chain will open automatically and assemble the entire method.",
    },
    "instruction": {
      "ru": "Переходим от записи числа к его составу по одной связной цепочке.",
      "uz": "Son yozuvidan uning tarkibiga bitta bog'langan ketma-ketlik orqali o'tamiz.",
      "en": "We go from writing a number to its composition on one connected chain.",
    },
    "model": {
      "kind": "reward",
      "badge": {
        "ru": "Модуль восстановлен",
        "uz": "Modul tiklandi",
        "en": "Module restored",
      },
      "number": {
        "ru": "ЦИФРА → РАЗРЯД → ЗНАЧЕНИЕ",
        "uz": "RAQAM → XONA → QIYMAT",
        "en": "DIGIT → PLACE → VALUE",
      },
      "steps": [
        {
          "ru": "Найти цифру",
          "uz": "Raqamni topish",
          "en": "Find the digit.",
        },
        {
          "ru": "Назвать разряд",
          "uz": "Xonani aytish",
          "en": "Name the place.",
        },
        {
          "ru": "Записать разрядное значение",
          "uz": "Xona qiymatini yozish",
          "en": "Write the place value",
        }
      ]
    },
    "options": [
      {
        "ru": "Цифра → разряд → разрядное значение → разложение или восстановление",
        "uz": "Raqam → xona → xona qiymati → yoyish yoki tiklash",
        "en": "Digit → place → place value → expansion or reconstruction",
      },
      {
        "ru": "Цифра → соседняя цифра → сумма цифр",
        "uz": "Raqam → qo'shni raqam → raqamlar yig'indisi",
        "en": "Digit → Neighbouring digit → Sum of digits",
      },
      {
        "ru": "Разряд → удаление нулей → короткая запись",
        "uz": "Xona → nollarni olib tashlash → qisqa yozuv",
        "en": "Place → remove zeros → shortened notation",
      },
      {
        "ru": "Чтение справа налево → перестановка значений",
        "uz": "O'ngdan chapga o'qish → qiymatlarni almashtirish",
        "en": "Reading from right to left → changing the values",
      }
    ],
    "correctIndex": 0,
    "correctText": {
      "ru": "Полная цепочка связывает знак, место и значение. Она помогает и разложить число, и собрать его обратно.",
      "uz": "To'liq ketma-ketlik belgi, o'rin va qiymatni bog'laydi. U sonni yoyish va qayta yig'ishga yordam beradi.",
      "en": "A complete chain connects the sign, the place and the value, and it helps you both decompose the number and put it back together.",
    },
    "bridge": {
      "ru": "Дальше сравним многозначные числа: решающим станет первое различающееся разрядное значение слева.",
      "uz": "Keyin ko'p xonali sonlarni taqqoslaymiz: chapdagi birinchi farqli xona qiymati hal qiluvchi bo'ladi.",
      "en": "Then we compare the multi-digit numbers: the decisive will be the first different place value on the left.",
    },
    "wrong": [
      null,
      {
        "ru": "Соседняя цифра и сумма цифр не показывают разрядное значение. Начни с места цифры.",
        "uz": "Qo'shni raqam va raqamlar yig'indisi xona qiymatini ko'rsatmaydi. Raqam o'rnidan boshlang.",
        "en": "The next digit and the sum of the digits don't show the place value.",
      },
      {
        "ru": "Удаление нулей сдвигает разряды. Пустые места нужно сохранять.",
        "uz": "Nollarni olib tashlash xonalarni siljitadi. Bo'sh o'rinlarni saqlash kerak.",
        "en": "Removing zeros shifts the digits. Empty spaces need to be saved.",
      },
      {
        "ru": "Разряды читаются и анализируются слева направо без перестановки. Значения должны остаться на местах.",
        "uz": "Xonalar chapdan o'ngga almashtirilmasdan o'qiladi va tahlil qilinadi. Qiymatlar o'z o'rnida qolishi kerak.",
        "en": "The digits are read and analysed from left to right without reshuffling. The values should remain in place.",
      }
    ],
    "audio": {
      "intro": {
        "ru": [
          "Цепочка автоматически свяжет цифру, разряд, значение и разложение многозначного числа."
        ],
        "uz": [
          "Ketma-ketlik raqam, xona, qiymat va ko'p xonali sonning yoyiq yozuvini avtomatik bog'laydi."
        ],
        "en": [
          "The chain links the digit, place, value and decomposition of a multi-digit number."
        ],
      },
      "on_correct": {
        "ru": "Состав числа раскрыт. На следующем уроке разрядные значения помогут сравнивать многозначные числа.",
        "uz": "Sonning tarkibi ochildi. Keyingi darsda xona qiymatlari ko'p xonali sonlarni taqqoslashga yordam beradi.",
        "en": "The composition of the number is disclosed. In the next lesson, the place values will help you compare multi-digit numbers.",
      },
      "on_wrong": [
        null,
        {
          "ru": "Вернись к месту цифры. Именно оно определяет значение.",
          "uz": "Raqamning o'rniga qayting. Aynan shu o'rin qiymatni belgilaydi.",
          "en": "Go back to where the number is. It's the number that determines the value.",
        },
        {
          "ru": "Нули сохраняют пустые разряды. Их нельзя удалять.",
          "uz": "Nollar bo'sh xonalarni saqlaydi. Ularni olib tashlab bo'lmaydi.",
          "en": "Zeros keep empty places. They can't be removed.",
        },
        {
          "ru": "Сохрани порядок разрядов слева направо.",
          "uz": "Xonalar tartibini chapdan o'ngga saqlang.",
          "en": "Keep the order from left to right.",
        }
      ]
    }
  }
};

// Connected ideas are grouped into deep screens; the lesson does not use
// one slide per tiny fact.
const makeMicroPractice = ({ audioIntro, correctAudio, wrongAudio, ...content }) => ({
  ...content,
  audio: { intro: audioIntro, on_correct: correctAudio, on_wrong: content.options.map((_, index) => (index === content.correctIndex ? null : wrongAudio)) },
});

const PRACTICE_CONTENT = {
  p1: makeMicroPractice({ eyebrow: { ru: 'Практика 1', uz: '1-mashq', en: "Practice 1" }, title: { ru: 'Цифра и её место', uz: 'Raqam va uning o\'rni', en: "The digit and its place" }, lead: { ru: 'Одна цифра получает значение от своего разряда.', uz: 'Bitta raqam qiymatni o\'z xonasidan oladi.', en: "One digit gets its value from its place." }, instruction: { ru: 'Каково значение цифры 4 в числе 347 205?', uz: '347 205 sonidagi 4 raqamining qiymati qancha?', en: "What is the value of the digit 4 in 347 205?" }, options: ['40 000', '4 000', '400 000'], correctIndex: 0, correctText: { ru: 'Цифра 4 стоит в разряде десятков тысяч, поэтому её значение 40 000.', uz: '4 raqami o\'n mingliklar xonasida, shuning uchun uning qiymati 40 000.', en: "The digit 4 is in the ten-thousands place, so its value is 40,000." }, wrong: [null, { ru: '4 000 получилось бы в разряде тысяч.', uz: '4 000 mingliklar xonasida hosil bo\'lardi.', en: "4,000 would be the value of a digit in the thousands place." }, { ru: '400 000 получилось бы в разряде сотен тысяч.', uz: '400 000 yuz mingliklar xonasida hosil bo\'lardi.', en: "400,000 would be the value of a digit in the hundred-thousands place." }], audioIntro: { ru: 'Найди значение цифры четыре в числе триста сорок семь тысяч двести пять.', uz: 'Uch yuz qirq yetti ming ikki yuz besh sonidagi to\'rt raqamining qiymatini toping.', en: "Find the value of the digit four in the number three hundred and forty-seven thousand two hundred and five." }, correctAudio: { ru: 'Верно. Четыре десятка тысяч дают сорок тысяч.', uz: 'To\'g\'ri. To\'rtta o\'n minglik qirq mingni beradi.', en: "That's right. Four tens of thousands make forty thousand." }, wrongAudio: { ru: 'Назови разряд цифры четыре и умножь цифру на значение разряда.', uz: 'To\'rt raqamining xonasini ayting va raqamni xona qiymatiga ko\'paytiring.', en: "Name the place of the digit four, then multiply the digit by the value of that place." } }),
  p2: makeMicroPractice({ eyebrow: { ru: 'Практика 2', uz: '2-mashq', en: "Practice 2" }, title: { ru: 'Шаг влево', uz: 'Chapga bir qadam', en: "Step left" }, lead: { ru: 'Каждый шаг влево увеличивает значение цифры в десять раз.', uz: 'Chapga har bir qadam raqam qiymatini o\'n marta oshiradi.', en: "Each step to the left makes the value of the digit ten times greater." }, instruction: { ru: 'Что произойдёт со значением цифры 6 при сдвиге на один разряд влево?', uz: '6 raqami bir xona chapga siljisa, uning qiymati nima bo\'ladi?', en: "What happens to the value of the digit 6 when it moves one place to the left?" }, options: [{ ru: 'увеличится в 10 раз', uz: '10 marta ortadi', en: "will increase tenfold" }, { ru: 'увеличится на 1', uz: '1 ga ortadi', en: "increase by 1" }, { ru: 'не изменится', uz: 'o\'zgarmaydi', en: "will not change" }], correctIndex: 0, correctText: { ru: 'Соседний разряд слева имеет в десять раз большее значение.', uz: 'Chapdagi qo\'shni xona o\'n marta katta qiymatga ega.', en: "The neighbouring place on the left has ten times the value." }, wrong: [null, { ru: 'Меняется не сама цифра, а её разрядное значение.', uz: 'Raqamning o\'zi emas, uning xona qiymati o\'zgaradi.', en: "The digit itself does not change; its place value does." }, { ru: 'Положение изменилось, поэтому значение тоже изменится.', uz: 'O\'rni o\'zgardi, demak qiymati ham o\'zgaradi.', en: "The position has changed, so the value changes too." }], audioIntro: { ru: 'Представь цифру шесть. Что происходит с её значением после одного шага влево?', uz: 'Olti raqamini tasavvur qiling. U bir qadam chapga siljiganda qiymati nima bo\'ladi?', en: "Imagine the digit six. What happens to its value after one step to the left?" }, correctAudio: { ru: 'Верно. Один шаг влево увеличивает значение в десять раз.', uz: 'To\'g\'ri. Chapga bir qadam qiymatni o\'n marta oshiradi.', en: "Right. One step to the left increases the value tenfold." }, wrongAudio: { ru: 'Вспомни лестницу разрядов. Соседний разряд слева в десять раз крупнее.', uz: 'Xonalar zinapoyasini eslang. Chapdagi qo\'shni xona o\'n marta katta.', en: "Think of the place-value ladder. The next place on the left is ten times bigger." } }),
  p3: makeMicroPractice({ eyebrow: { ru: 'Практика 3', uz: '3-mashq', en: "Practice 3" }, title: { ru: 'Развёрнутая запись', uz: 'Yoyiq yozuv', en: "Expanded form" }, lead: { ru: 'Нулевые разряды можно не писать как слагаемые.', uz: 'Nol qiymatli xonalarni qo\'shiluvchi sifatida yozmaslik mumkin.', en: "Places with a value of zero can be omitted as terms." }, instruction: { ru: 'Какая развёрнутая запись соответствует числу 504 030?', uz: '504 030 soniga qaysi yoyiq yozuv mos keladi?', en: "Which expanded form represents 504,030?" }, options: ['500 000 + 4 000 + 30', '500 000 + 40 000 + 30', '500 000 + 4 000 + 300'], correctIndex: 0, correctText: { ru: 'Цифра 4 означает 4 000, а цифра 3 означает 30.', uz: '4 raqami 4 000 ni, 3 raqami esa 30 ni bildiradi.', en: "4 stands for 4,000 and 3 stands for 30." }, wrong: [null, { ru: 'Цифра 4 находится в тысячах, а не в десятках тысяч.', uz: '4 raqami o\'n mingliklarda emas, mingliklarda turibdi.', en: "The digit 4 is in the thousands place, not the ten-thousands place." }, { ru: 'Цифра 3 находится в десятках, а не в сотнях.', uz: '3 raqami yuzliklarda emas, o\'nliklarda turibdi.', en: "The digit 3 is in the tens place, not the hundreds place." }], audioIntro: { ru: 'Выбери развёрнутую запись числа пятьсот четыре тысячи тридцать.', uz: 'Besh yuz to\'rt ming o\'ttiz sonining yoyiq yozuvini tanlang.', en: "Select the expanded form of the number five hundred and four thousand thirty." }, correctAudio: { ru: 'Верно. Пятьсот тысяч, четыре тысячи и три десятка дают исходное число.', uz: 'To\'g\'ri. Besh yuz ming, to\'rt ming va uch o\'nlik boshlang\'ich sonni beradi.', en: "Right. Five hundred thousand, four thousand and three tens give the original number." }, wrongAudio: { ru: 'Проверь место каждой ненулевой цифры.', uz: 'Har bir noldan farqli raqamning o\'rnini tekshiring.', en: "Check the location of each non-zero digit." } }),
  p4: makeMicroPractice({ eyebrow: { ru: 'Практика 4', uz: '4-mashq', en: "Practice 4" }, title: { ru: 'Возвращаем нули', uz: 'Nollarni qaytaramiz', en: "Return the zeros." }, lead: { ru: 'Пустые разряды остаются в обычной записи числа.', uz: 'Bo\'sh xonalar sonning oddiy yozuvida saqlanadi.', en: "Empty places remain in the standard form." }, instruction: { ru: 'Какое число составлено из 300 000 + 7 000 + 5?', uz: '300 000 + 7 000 + 5 dan qaysi son tuziladi?', en: "What number is made up of 300,000 + 7000 + 5?" }, options: ['307 005', '370 005', '307 500'], correctIndex: 0, correctText: { ru: 'Нули сохранили пустые десятки тысяч, сотни и десятки.', uz: 'Nollar bo\'sh o\'n mingliklar, yuzliklar va o\'nliklarni saqladi.', en: "The zeros have kept empty tens of thousands, hundreds and tens." }, wrong: [null, { ru: 'Цифра 7 сдвинулась из тысяч в десятки тысяч.', uz: '7 raqami mingliklardan o\'n mingliklarga siljigan.', en: "The digit 7 has moved from thousands to tens of thousands." }, { ru: 'Пять единиц сдвинулись в сотни.', uz: 'Besh birlik yuzliklarga siljigan.', en: "Five units have moved into the hundreds." }], audioIntro: { ru: 'Собери число из трёхсот тысяч, семи тысяч и пяти единиц.', uz: 'Uch yuz ming, yetti ming va besh birlikdan son tuzing.', en: "Collect a number of three hundred thousand, seven thousand and five units." }, correctAudio: { ru: 'Верно. Пустые разряды записаны нулями.', uz: 'To\'g\'ri. Bo\'sh xonalar nollar bilan yozildi.', en: "Empty places are written in zeros." }, wrongAudio: { ru: 'Расставь слагаемые по разрядам и заполни пустые места нулями.', uz: 'Qo\'shiluvchilarni xonalarga joylang va bo\'sh o\'rinlarni nollar bilan to\'ldiring.', en: "Set them up and fill the empty spaces with zeros." } }),
  p5: makeMicroPractice({ eyebrow: { ru: 'Практика 5', uz: '5-mashq', en: "Practice 5" }, title: { ru: 'Ноль как держатель места', uz: 'Nol o\'rin saqlaydi', en: "Zero as a placeholder" }, lead: { ru: 'В обычной записи внутренний ноль нельзя удалять.', uz: 'Oddiy yozuvda ichki nolni olib tashlab bo\'lmaydi.', en: "In a standard form, the inner zero cannot be deleted." }, instruction: { ru: 'Какая запись сохраняет все разряды числа четыреста двадцать тысяч шесть?', uz: 'To\'rt yuz yigirma ming olti sonining barcha xonalarini qaysi yozuv saqlaydi?', en: "Which notation preserves every place in the number four hundred and twenty thousand six?" }, options: ['420 006', '420 06', '42 006'], correctIndex: 0, correctText: { ru: 'Правый класс занимает три места: 006.', uz: 'O\'ng sinf uchta o\'rinni egallaydi: 006.', en: "The right-hand group occupies three places: 006." }, wrong: [null, { ru: 'В правой группе должно быть три цифры.', uz: 'O\'ng guruhda uchta raqam bo\'lishi kerak.', en: "The right group should have three digits." }, { ru: 'Потерян ноль в классе тысяч, поэтому число стало другим.', uz: 'Minglar sinfidagi nol yo\'qolgan, shuning uchun son o\'zgargan.', en: "A zero was lost from the thousands group, so the number changed." }], audioIntro: { ru: 'Выбери запись числа четыреста двадцать тысяч шесть. Сохрани три места в правом классе.', uz: 'To\'rt yuz yigirma ming olti sonining yozuvini tanlang. O\'ng sinfdagi uchta o\'rinni saqlang.', en: "Choose the notation for four hundred and twenty thousand six. Keep all three places in the group on the right." }, correctAudio: { ru: 'Верно. Два нуля сохраняют сотни и десятки правого класса.', uz: 'To\'g\'ri. Ikki nol o\'ng sinfdagi yuzlar va o\'nlar xonasini saqlaydi.', en: "That's right. Two zeros hold the hundreds and tens places in the right-hand group." }, wrongAudio: { ru: 'Проверь, что каждый класс справа содержит три цифры.', uz: 'O\'ngdagi har bir sinf uchta raqamdan iboratligini tekshiring.', en: "Check that every group to the right of the leftmost group contains three digits." } }),
  p6: makeMicroPractice({ eyebrow: { ru: 'Практика 6', uz: '6-mashq', en: "Practice 6" }, title: { ru: 'Исправляем десятикратную ошибку', uz: 'O\'n martalik xatoni tuzatamiz', en: "Fixing a tenfold error" }, lead: { ru: 'Лишний шаг влево увеличивает значение цифры в десять раз.', uz: 'Chapga ortiqcha bir qadam raqam qiymatini o\'n marta oshiradi.', en: "An extra step to the left makes the digit's value ten times too great." }, instruction: { ru: 'В числе 407 206 цифре 7 приписали значение 70 000. Какое значение верно?', uz: '407 206 sonidagi 7 raqamiga 70 000 qiymati berildi. To\'g\'ri qiymat qaysi?', en: "In 407,206, the digit 7 was assigned the value 70,000. Which value is correct?" }, options: ['7 000', '70 000', '700'], correctIndex: 0, correctText: { ru: 'Цифра 7 стоит в разряде тысяч, поэтому её значение 7 000.', uz: '7 raqami mingliklar xonasida, shuning uchun uning qiymati 7 000.', en: "The digit 7 is in the thousands place, so its value is 7,000." }, wrong: [null, { ru: '70 000 означало бы разряд десятков тысяч.', uz: '70 000 o\'n mingliklar xonasini bildirardi.', en: "70,000 would put the digit in the ten-thousands place." }, { ru: '700 означало бы разряд сотен.', uz: '700 yuzliklar xonasini bildirardi.', en: "700 would put the digit in the hundreds place." }], audioIntro: { ru: 'Исправь значение цифры семь в числе четыреста семь тысяч двести шесть.', uz: 'To\'rt yuz yetti ming ikki yuz olti sonidagi yetti raqamining qiymatini tuzating.', en: "Correct the value of the digit seven in the number four hundred and seven thousand two hundred and six." }, correctAudio: { ru: 'Верно. Семь находится в разряде тысяч и означает семь тысяч.', uz: 'To\'g\'ri. Yetti mingliklar xonasida turib, yetti mingni bildiradi.', en: "That's right. Seven is in the thousands place and means seven thousand." }, wrongAudio: { ru: 'Найди столбец цифры семь в разрядной таблице.', uz: 'Xonalar jadvalidan yetti raqami turgan ustunni toping.', en: "Find the column containing the digit seven in the place-value chart." } }),
};

const SCREEN_PLAN = [
  { id: 's0', type: 'hook', subtype: 'story-decision', template: 'StoryChoice', goal: 'Choose how to investigate Bit\'s equal-digit error', misconceptions: ['equal digits always have equal values', 'digit sum gives place value'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'exploration', subtype: 'position-foundation', template: 'ModelTabs', goal: 'Connect a digit with its place through two guided models', misconceptions: ['digit equals value'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's2', contentKey: 'p1', type: 'test', subtype: 'digit-place-check', template: 'MCScreen', goal: 'Find a digit value', misconceptions: ['wrong place'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's3', contentKey: 's2', type: 'exploration', subtype: 'tenfold-shift', template: 'PlaceValueLadder', goal: 'Explain the tenfold place ladder with two contrasted cases', misconceptions: ['left shift adds one'], active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's4', contentKey: 'p2', type: 'test', subtype: 'tenfold-check', template: 'MCScreen', goal: 'Apply a one-place shift', misconceptions: ['value unchanged'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's5', contentKey: 's3', type: 'exploration', subtype: 'equal-digits-different-values', template: 'ModelTabs', goal: 'Compare equal digits in different places', misconceptions: ['equal digits always have equal values'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's6', contentKey: 'p3', type: 'test', subtype: 'expanded-form-check', template: 'MCScreen', goal: 'Choose an expanded form', misconceptions: ['place shifted'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's7', contentKey: 's4', type: 'exploration', subtype: 'expanded-form', template: 'ModelTabs', goal: 'Build expanded form from digit values', misconceptions: ['digit used instead of value'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's8', type: 'practice', subtype: 'number-reconstruction-input', template: 'NumInputScreen', goal: 'Reconstruct a six-place number from place values', misconceptions: ['empty places omitted', 'place shift'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's9', contentKey: 's5', type: 'exploration', subtype: 'zero-coefficient', template: 'ZeroContrast', goal: 'Contrast an omitted zero term with a required zero place', misconceptions: ['internal zero removed'], active: false, scored: false, scope: null, resetOnReturn: true },
  { id: 's10', contentKey: 's6', type: 'rule', subtype: 'zero-placeholder-rule', template: 'ModelTabs', goal: 'State and apply why zero disappears from a sum but remains in notation', misconceptions: ['zeros omitted'], active: true, scored: false, scope: null, resetOnReturn: true },
  { id: 's11', type: 'practice', subtype: 'strategy-choice', template: 'StrategyChoice', goal: 'Choose a dependable place-value strategy', misconceptions: ['digit-count check'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's12', type: 'practice', subtype: 'error-repair', template: 'ErrorRepairChoice', goal: 'Repair a tenfold place-value error', misconceptions: ['thousands as ten-thousands'], active: true, scored: true, scope: 'module-mikro', resetOnReturn: false },
  { id: 's13', type: 'test', subtype: 'life-transfer', template: 'TransferChoice', goal: 'Transfer place-value reasoning to a new city code', misconceptions: ['wrong place', 'internal zero removed'], active: true, scored: true, scope: 'final', resetOnReturn: false },
  { id: 's14', type: 'summary', subtype: 'reflection-and-title', template: 'ReflectionClaim', goal: 'Reflect on the place-value strategy and claim the title', misconceptions: ['digit sum replaces place value'], active: true, scored: false, scope: null, resetOnReturn: false },
];

const SCREEN_META = SCREEN_PLAN.map((meta) => ({ ...meta, contentKey: meta.contentKey ?? meta.id }));

const TOTAL_SCREENS = 15;
const MOBILE_DESIGN_W = 390;
const NOTION_FLOW = SCREEN_META.map((meta, screen) => ({ screen, meta, contentKeys: [meta.contentKey] }));

const LESSON_META = {
  lessonId: 'num-4-03-v1',
  lessonTitle: {
    ru: 'Урок 3. Разрядный состав многозначного числа',
    uz: "3-dars. Ko'p xonali sonning xona tarkibi",
    en: 'Lesson 3: Place-value composition of a multi-digit number',
  },
  skillTags: ['digit_place_value', 'place_table', 'expanded_form', 'number_reconstruction', 'internal_zero'],
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
  return !audio.isPlaying;
}

const useTheoryAdvanceGate = (audio) => (
  audio.muted || audio.completed
);

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

function useRevealScroll() {
  const ref = useRef(null);
  return ref;
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
  const revealRef = useRevealScroll(show);
  return (
    <div ref={revealRef} data-g4-role={correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame'} data-g4-feedback={show ? (correct ? 'solution' : 'wrong') : undefined} className={`feedback ${show ? 'feedback-visible' : ''}`} aria-hidden={!show} aria-live="polite">
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

const ModelPanel = ({ model, solved, theory = false }) => {
  const t = useT();
  if (!model) return null;
  return (
    <div className={`model-panel model-${model.kind} ${solved ? 'model-solved' : ''} ${theory ? 'theory-model' : ''}`}>
      <div className="model-heading">
        <span>{t(model.badge)}</span>
        {model.kind === 'city' && <i aria-hidden="true">● ● ●</i>}
      </div>
      {model.number && <div className="model-number">{t(model.number)}</div>}
      {model.groups && (
        <div className="class-groups">
          {model.groups.map((group, index) => (
            <div className={`class-group group-${group.tone ?? (index ? 'accent' : 'cyan')}`} key={`${t(group.value)}-${index}`} style={{ '--reveal-i': index }}>
              <strong>{t(group.value)}</strong><span>{t(group.label)}</span>
            </div>
          ))}
        </div>
      )}
      {model.columns && (
        <div className="place-table" style={{ gridTemplateColumns: `repeat(${model.columns.length}, minmax(0, 1fr))` }}>
          {model.columns.map((column, index) => (
            <div className="place-cell" key={`${t(column.value)}-${index}`} style={{ '--reveal-i': index }}>
              <span>{t(column.label)}</span><strong>{t(column.value)}</strong>
            </div>
          ))}
        </div>
      )}
      {model.rows && (
        <div className="model-row-list">
          {model.rows.map((row, index) => (
            <div key={`${t(row.value)}-${index}`} style={{ '--reveal-i': index }}><span>{t(row.label)}</span><strong>{t(row.value)}</strong></div>
          ))}
        </div>
      )}
      {model.steps && (
        <ol className="model-steps">
          {model.steps.map((step, index) => <li key={`${t(step)}-${index}`} style={{ '--reveal-i': index }}>{t(step)}</li>)}
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

const THEORY_BIT_STATES = [
  'awkward', 'point', 'idea', 'point', 'focus', 'think', 'focus', 'idea',
  'present', 'point', 'idea', 'think', 'awkward', 'present', 'happy',
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

const DEEP_SCREEN_COPY = {
  position: {
    title: { ru: 'От записи числа к месту цифры', uz: "Son yozuvidan raqam o'rniga", en: "From number to place of number" },
    lead: {
      ru: 'Сначала восстанавливаем точную запись, затем смотрим не на размер цифры, а на её позицию.',
      uz: "Avval aniq yozuvni tiklaymiz, keyin raqamning kattaligiga emas, uning o'rniga qaraymiz.",
      en: "First we restore the exact notation, then we look not at the digit itself, but at its position.",
    },
  },
  values: {
    title: { ru: 'Одинаковые цифры — три разных значения', uz: 'Bir xil raqamlar, uch xil qiymat', en: "Same digits — three different values" },
    lead: {
      ru: 'Разрядная таблица и развёрнутая запись показывают одну закономерность с двух сторон.',
      uz: "Xona jadvali va yoyiq yozuv bitta qonuniyatni ikki tomondan ko'rsatadi.",
      en: "The place-value chart and the expanded form show one pattern from both sides.",
    },
  },
  expansion: {
    title: { ru: 'От одной цифры к составу всего числа', uz: 'Bitta raqamdan butun son tarkibiga', en: "From one digit to the total number" },
    lead: {
      ru: 'Определяем значение выбранной цифры, а затем тем же способом раскрываем все ненулевые разряды.',
      uz: "Tanlangan raqam qiymatini aniqlaymiz, keyin shu usul bilan barcha noldan farqli xonalarni ochamiz.",
      en: "Determine the value of the selected digit, and then in the same way disclose all non-zero digits.",
    },
  },
  zeros: {
    title: { ru: 'Ноль исчезает из суммы, но не из записи', uz: "Nol yig'indida ko'rinmaydi, yozuvda esa qoladi", en: "Zero disappears from the sum, but not from the standard form." },
    lead: {
      ru: 'Сопоставим развёрнутую и обычную формы: пустое слагаемое не пишем, пустой разряд обязательно сохраняем.',
      uz: "Yoyiq va oddiy shakllarni solishtiramiz: bo'sh qo'shiluvchini yozmaymiz, bo'sh xonani esa albatta saqlaymiz.",
      en: "Let us compare the expanded and standard forms: we do not write the empty component, we necessarily save the empty place.",
    },
  },
};

const DeepSequenceScreen = ({ screen, contentKey, copyKey, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const contents = CONTENT[contentKey ?? `s${screen}`].parts;
  const copy = DEEP_SCREEN_COPY[copyKey];
  const [activeStep, setActiveStep] = useState(0);
  const [seenSteps, setSeenSteps] = useState(() => new Set([0]));
  const active = contents[activeStep];
  const segments = useMemo(
    () => [
      ...localizedSegments(active.audio?.intro ?? active.audio, lang, `s${screen}-deep-${activeStep}-intro`),
      ...localizedSegments(active.audio?.on_correct, lang, `s${screen}-deep-${activeStep}-result`),
    ],
    [active, activeStep, lang, screen],
  );
  const audio = useAudio(segments);
  const canContinue = useTheoryAdvanceGate(audio) && seenSteps.size >= contents.length;

  const selectStep = (index) => {
    setActiveStep(index);
    setSeenSteps((previous) => {
      if (previous.has(index)) return previous;
      const next = new Set(previous);
      next.add(index);
      return next;
    });
  };

  const resultSource = active.correctValue ?? active.options?.[active.correctIndex];
  const result = resultSource ? formatTheoryResult(resultSource, t) : '';
  return (
    <Stage
      screen={screen}
      eyebrow={active.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canContinue} /></>}
    >
      <div className="screen-stack deep-sequence-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DEEP DIVE</span>
            <h1>{t(copy.title)}</h1>
            <p>{t(copy.lead)}</p>
          </div>
          <div className={`bit-coach bit-coach-${activeStep === contents.length - 1 ? 'idea' : 'point'}`}>
            <BitSVG state={activeStep === contents.length - 1 ? 'idea' : 'point'} />
          </div>
        </div>
        <div className="deep-sequence-tabs" role="tablist" aria-label={t(copy.title)}>
          {contents.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeStep === index}
              className={activeStep === index ? 'deep-tab-active' : seenSteps.has(index) ? 'deep-tab-seen' : ''}
              onClick={() => selectStep(index)}
              key={`s${screen}-part-${index}`}
            >
              <span>{String(index + 1).padStart(2, '0')}</span><strong>{t(item.title)}</strong>
            </button>
          ))}
        </div>
        <div className="deep-sequence-stage" key={`${copyKey}-${activeStep}`}>
          <ModelPanel model={active.model} theory />
          <section className="deep-sequence-explanation">
            <span>{lang === 'en' ? `STEP ${activeStep + 1}` : lang === 'ru' ? `ШАГ ${activeStep + 1}` : `${activeStep + 1}-QADAM`}</span>
            <h2>{t(active.instruction)}</h2>
            {result && <strong>{result}</strong>}
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

const PlaceValueLadderScreen = ({ screen, contentKey, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey ?? `s${screen}`];
  const segments = useMemo(
    () => localizedSegments(c.audio, lang, `s${screen}-ladder`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canContinue = useTheoryAdvanceGate(audio);

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canContinue} /></>}
    >
      <div className="screen-stack ladder-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · PLACE-VALUE LIFT</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-idea"><BitSVG state="idea" /></div>
        </div>

        <section className="place-ladder-board" aria-label={t(c.instruction)}>
          <div className="place-ladder-topline">
            <span>{t(c.instruction)}</span>
            <strong><span aria-hidden="true">←</span> {t(c.direction)}</strong>
          </div>
          <div className="place-ladder-track">
            {c.steps.map((step, index) => (
              <article className="place-ladder-step" key={`${step.value}-${index}`} style={{ '--reveal-i': index }}>
                <span>{t(step.place)}</span>
                <strong>{step.value}</strong>
                <i>{lang === 'en' ? `Digit ${step.digit}` : lang === 'ru' ? `цифра ${step.digit}` : `${step.digit} raqami`}</i>
              </article>
            ))}
          </div>
        </section>

        <section className="ladder-contrast-grid">
          {c.contrasts.map((example, index) => (
            <article key={example.number} className={index ? 'ladder-example-shifted' : ''} style={{ '--reveal-i': index }}>
              <div><span>{lang === 'en' ? `CASE ${index + 1}` : lang === 'ru' ? `СЛУЧАЙ ${index + 1}` : `HOLAT ${index + 1}`}</span><strong>{example.number}</strong></div>
              <p>{t(example.place)}</p>
              <b>{example.value}</b>
            </article>
          ))}
        </section>

        <TheoryCallout screen={screen} result="6 000 × 10 = 60 000">{t(c.conclusion)}</TheoryCallout>
      </div>
    </Stage>
  );
};

const ZeroCoefficientScreen = ({ screen, contentKey, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey ?? `s${screen}`];
  const segments = useMemo(
    () => localizedSegments(c.audio, lang, `s${screen}-zero-contrast`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canContinue = useTheoryAdvanceGate(audio);

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canContinue} /></>}
    >
      <div className="screen-stack zero-coefficient-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · ZERO LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-think"><BitSVG state="think" /></div>
        </div>

        <section className="zero-place-board" aria-label={t(c.instruction)}>
          <div className="zero-place-heading"><span>{t(c.instruction)}</span><strong>{c.number}</strong></div>
          <div className="zero-place-grid">
            {c.places.map((place, index) => (
              <div className={place.zero ? 'zero-place-empty' : ''} key={`${t(place.label)}-${index}`} style={{ '--reveal-i': index }}>
                <span>{t(place.label)}</span><strong>{place.digit}</strong>
                {place.zero && <i>{lang === 'en' ? 'empty place' : lang === 'ru' ? 'пустой разряд' : "bo'sh xona"}</i>}
              </div>
            ))}
          </div>
        </section>

        <section className="zero-contrast-grid">
          <article className="zero-contrast-sum">
            <span>{t(c.sumLabel)}</span>
            <strong>{c.sumWithZeros}</strong>
            <i aria-hidden="true">↓</i>
            <strong>{c.sumCompact}</strong>
            <p>{t(c.sumExplanation)}</p>
          </article>
          <article className="zero-contrast-notation">
            <span>{t(c.notationLabel)}</span>
            <div><strong>{c.number}</strong><i aria-hidden="true">≠</i><strong>{c.brokenNumber}</strong></div>
            <p>{t(c.notationExplanation)}</p>
          </article>
        </section>

        <TheoryCallout screen={screen} result={lang === 'en' ? '0 term ≠ zero place' : lang === 'ru' ? 'слагаемое 0 ≠ разряд 0' : "0 qo'shiluvchi ≠ 0 xona"}>
          {t(c.conclusion)}
        </TheoryCallout>
      </div>
    </Stage>
  );
};

const CardSolutionLabScreen = ({ screen, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const [replayKey, setReplayKey] = useState(0);
  const segments = useMemo(
    () => localizedSegments(c.audio, lang, `s${screen}-card-lab`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canContinue = useTheoryAdvanceGate(audio);

  const replaySolution = () => {
    setReplayKey((value) => value + 1);
    if (!audio.muted) audio.replay();
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canContinue} /></>}
    >
      <div className="screen-stack card-lab-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · SOLUTION LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-point"><BitSVG state="point" /></div>
        </div>

        <section className="card-lab-solution" key={replayKey} aria-label={t(c.instruction)}>
          <div className="shuffled-card-zone">
            <div className="card-lab-label"><span>01</span><strong>{lang === 'en' ? "MIXED CARDS" : lang === 'ru' ? 'ПЕРЕМЕШАННЫЕ КАРТОЧКИ' : 'ARALASH KARTALAR'}</strong></div>
            <div className="value-card-cloud">
              {c.shuffledCards.map((card, index) => (
                <span key={`${card}-${index}`} style={{ '--reveal-i': index }}>{card}</span>
              ))}
            </div>
          </div>

          <div className="card-lab-arrow" aria-hidden="true">↓</div>

          <div className="ordered-card-zone">
            <div className="card-lab-label"><span>02</span><strong>{lang === 'en' ? 'EVERY CARD IN ITS OWN PLACE' : lang === 'ru' ? 'КАЖДАЯ КАРТОЧКА В СВОЁМ РАЗРЯДЕ' : "HAR BIR KARTA O'Z XONASIDA"}</strong></div>
            <div className="card-place-grid">
              {c.slots.map((slot, index) => (
                <article className={slot.empty ? 'card-place-empty' : ''} key={`${t(slot.place)}-${index}`} style={{ '--reveal-i': index }}>
                  <span>{t(slot.place)}</span><strong>{slot.digit}</strong><i>{t(slot.value)}</i>
                </article>
              ))}
            </div>
          </div>

          <div className="card-lab-result">
            <div className="card-lab-label"><span>03</span><strong>{lang === 'en' ? "RESULT AND VERIFICATION" : lang === 'ru' ? 'РЕЗУЛЬТАТ И ПРОВЕРКА' : 'NATIJA VA TEKSHIRUV'}</strong></div>
            <div className="card-result-number">{c.result}</div>
            <div className="card-result-check"><span>{lang === 'en' ? 'reverse decomposition' : lang === 'ru' ? 'обратное разложение' : 'qayta yoyish'}</span><strong>{c.verification}</strong></div>
          </div>
        </section>

        <section className="card-lab-steps">
          {c.steps.map((step, index) => (
            <article key={`${t(step.label)}-${index}`} style={{ '--reveal-i': index }}><strong>{t(step.label)}</strong><p>{t(step.text)}</p></article>
          ))}
        </section>

        <div className="card-lab-conclusion">
          <TheoryCallout screen={screen} result={c.result}>{t(c.conclusion)}</TheoryCallout>
          <button type="button" className="deep-replay" onClick={replaySolution}><span aria-hidden="true">↻</span> {t(c.replay)}</button>
        </div>
      </div>
    </Stage>
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

const FinaleScreen = ({ screen, storedAnswer, answers = [], onAnswer, onPrev, finishLesson }) => {
  const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true);
  const [revealRequested, setRevealRequested] = useState(false);
  const [reflectionChoice, setReflectionChoice] = useState(storedAnswer?.reflectionChoice ?? null);
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
    ? { ru: 'Мастер разрядов', uz: 'Xonalar ustasi', en: "Master of places" }
    : firstTry >= Math.max(1, totalScored - 1)
      ? { ru: 'Знаток значений', uz: 'Qiymatlar bilimdoni', en: "Knowledge of values" }
      : { ru: 'Исследователь разрядов', uz: 'Xonalar tadqiqotchisi', en: "Place researcher" };
  const reflectionOptions = [
    { ru: 'Сначала нахожу разряд цифры.', uz: "Avval raqamning xonasini topaman.", en: 'First, I find the place of the digit.' },
    { ru: 'Помню: шаг влево увеличивает значение в 10 раз.', uz: "Chapga bir qadam qiymatni 10 marta oshirishini eslayman.", en: 'I remember that one place left makes the value ten times greater.' },
    { ru: 'Сохраняю нулями все пустые разряды.', uz: "Barcha bo'sh xonalarni nollar bilan saqlayman.", en: 'I keep every empty place with zeros.' },
  ];
  const reflectionQuestion = { ru: 'Какой вывод поможет тебе в следующей задаче?', uz: 'Keyingi masalada qaysi xulosa sizga yordam beradi?', en: 'Which conclusion will help you in the next problem?' };
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
          <p>{lang === 'en' ? "Three identical fours from the beginning of the lesson got different values in their places, Bit corrected the sensor error." : lang === 'ru' ? 'Три одинаковые четвёрки из начала урока получили разные значения по своим местам. Бит исправил ошибку датчика.' : "Dars boshidagi uchta bir xil to'rt endi o'z o'rniga ko'ra turli qiymat oldi. Bit sensor xatosini tuzatdi."}</p>
        </header>

        <div className="finale-layout">
          <div className="finale-main">
            <div className="finale-mastery">
              {c.model.steps.map((item, index) => (
                <article className={`finale-takeaway ${visible >= index + 1 ? 'is-visible' : ''}`} key={t(item)}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{t(item)}</p>
                </article>
              ))}
            </div>
            <div className={`finale-proof ${visible >= 3 ? 'is-visible' : ''}`}>
              <span>{lang === 'en' ? 'STARTING MISSION SOLVED' : lang === 'ru' ? 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ' : "BOSHLANG'ICH MISSIYA YECHIMI"}</span>
              <strong>{t(c.model.number)}</strong>
              <p>{t(c.options[c.correctIndex])}. {t(c.correctText)}</p>
            </div>
            <div className={`finale-bridge ${complete ? 'is-visible' : ''}`}>
              <span aria-hidden="true">→</span>
              <div><strong>{lang === 'en' ? "NEXT MISSION" : lang === 'ru' ? 'СЛЕДУЮЩАЯ МИССИЯ' : 'KEYINGI MISSIYA'}</strong><p>{t(c.bridge)}</p></div>
            </div>
          </div>

          <aside className="finale-actions">
          <section className="finale-reflection" aria-labelledby="d3-reflection-question">
            <strong id="d3-reflection-question">{t(reflectionQuestion)}</strong>
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

const TheoryScreen = ({ screen, contentKey, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey ?? `s${screen}`];
  const meta = SCREEN_META[screen];
  const isFinal = screen === TOTAL_SCREENS - 1;
  const resultSource = c.correctValue ?? c.options?.[c.correctIndex];
  const result = resultSource ? formatTheoryResult(resultSource, t) : '';
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}-intro`),
    ...localizedSegments(c.audio?.on_correct, lang, `s${screen}-explanation`),
  ], [c.audio, lang, screen]);
  const audio = useAudio(segments);
  const canContinue = useTheoryAdvanceGate(audio);
  const isFoundation = meta.template === 'FoundationTheory' || meta.template === 'RecapTheory';
  const isRule = meta.template === 'RuleReveal';
  const isStrategy = meta.template === 'StrategyTheory';
  const isError = meta.template === 'ErrorWalkthrough';
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
            <span className="lesson-kicker">LUMO CITY · KNOWLEDGE LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className={`bit-coach bit-coach-${THEORY_BIT_STATES[screen]}`}>
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

        {!isFoundation && !isSummary && <ModelPanel model={c.model} theory />}

        {!isFoundation && !isRule && !isStrategy && !isError && !isSummary && (
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
            <div className="rule-ribbon"><span>1</span><b>{lang === 'en' ? 'Find the digit' : lang === 'ru' ? 'Найди цифру' : 'Raqamni toping'}</b></div>
            <div className="rule-ribbon"><span>2</span><b>{lang === 'en' ? "Identify the place." : lang === 'ru' ? 'Определи разряд' : 'Xonasini aniqlang'}</b></div>
            <div className="rule-ribbon"><span>3</span><b>{lang === 'en' ? 'Write the place value.' : lang === 'ru' ? 'Запиши разрядное значение' : 'Xona qiymatini yozing'}</b></div>
            <div className="rule-ribbon"><span>4</span><b>{lang === 'en' ? "Decompose or restore" : lang === 'ru' ? 'Разложи или восстанови' : "Yoying yoki qayta tiklang"}</b></div>
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
              <span>{lang === 'en' ? 'CORRECT, BUT VERIFY IT' : lang === 'ru' ? 'ВЕРНО, НО НУЖНА ПРОВЕРКА' : "TO'G'RI, AMMO EHTIYOT BO'LING"}</span>
              <strong>{t(c.options[1])}</strong>
              <p>{t(c.wrong[1])}</p>
            </div>
          </section>
        )}

        {isError && (
          <section className="error-walkthrough">
            <div className="error-state error-before">
              <span>{lang === 'en' ? 'INCORRECT NOTATION' : lang === 'ru' ? 'ОШИБОЧНАЯ ЗАПИСЬ' : 'XATO YOZUV'}</span>
              <strong>{t(c.model.rows[0].value)}</strong>
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
  const canContinue = useTheoryAdvanceGate(audio);

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
            <span className="lesson-kicker">LUMO CITY · SOLUTION WALL</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-point"><BitSVG state="point" /></div>
        </div>
        <section className="worked-example-grid">
          {c.items.map((item, index) => (
            <article className="worked-example" key={`${t(item.question)}-${index}`} style={{ '--reveal-i': index }}>
              <div className="worked-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="worked-copy">
                <span>{lang === 'en' ? "EXAMPLE" : lang === 'ru' ? 'ПРИМЕР' : 'MISOL'}</span>
                <h2>{t(item.question)}</h2>
                <strong>{t(item.options[item.correctIndex])}</strong>
                <p>{t(item.correctText)}</p>
              </div>
            </article>
          ))}
        </section>
        <div className="worked-complete"><BitSVG state="nod" /><p>{t(c.completionText)}</p></div>
      </div>
    </Stage>
  );
};

const ChoiceScreen = ({ screen, contentKey, storedAnswer, onAnswer, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = PRACTICE_CONTENT[contentKey] ?? CONTENT[contentKey ?? `s${screen}`];
  const resetOnReturn = SCREEN_META[screen].resetOnReturn === true;
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
      <div className={`screen-stack choice-screen ${isHook ? 'etalon-hook-screen' : ''}`} data-g4-screen={isHook ? 'hook' : undefined}>
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker" data-g4-role={isHook ? 'hook-topic' : undefined}>LUMO CITY · DATA CENTER</span>
            <h1 data-g4-role={isHook ? 'hook-title' : undefined}>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          {!isHook && <div className="bit-coach"><BitSVG state={solved ? 'nod' : picked !== null ? 'awkward' : 'present'} /></div>}
        </div>
        {isHook && <h2 className="hook-question-title" data-g4-role="hook-question">{t(c.instruction)}</h2>}
        {isHook ? (
          <section className="hook-story-frame" data-g4-role="hook-scene visual-frame">
            <div className="hook-story-bit" data-g4-role="hook-bit"><BitSVG state={solved ? 'nod' : picked !== null ? 'awkward' : 'think'} /></div>
            <div className="hook-story-model"><ModelPanel model={c.model} solved={solved} /></div>
          </section>
        ) : <ModelPanel model={c.model} solved={solved} />}
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

const sanitizeNumeric = (raw) => String(raw ?? '')
  .replace(/[^\d]/g, '')
  .replace(/^0+(?=\d)/, '')
  .slice(0, 6);

const NumericInputScreen = ({ screen, contentKey, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey ?? ('s' + screen)];
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
            <span className="lesson-kicker">LUMO CITY · VALUE CONSOLE</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach"><BitSVG state={solved ? 'nod' : 'present'} /></div>
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
              data-qa-answer={runtimeConfig.previewMode ? c.correctValue : undefined}
              type="text"
              inputMode="numeric"
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
  const content = CONTENT[contentKey];
  const c = content.parts?.[content.parts.length - 1] ?? content;
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}-micro-intro`),
    ...localizedSegments(c.audio?.on_correct ?? c.correctText ?? c.fact, lang, `s${screen}-micro-result`),
  ], [c, lang, screen]);
  const audio = useAudio(segments);
  const canAdvance = useTheoryAdvanceGate(audio);
  const rowExample = (c.model?.rows ?? []).map((row) => t(row.value)).filter(Boolean).join(' + ');
  const example = c.model?.number ?? c.formula ?? c.options?.[c.correctIndex] ?? rowExample;
  const explanation = c.correctText ?? c.fact ?? c.conclusion ?? c.prompt;
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} audio={audio} nav={<><NavBack onClick={onPrev} hidden={screen === 0} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}>
      <div className="screen-stack micro-theory-screen">
        <div className="screen-heading"><div className="heading-copy"><span className="lesson-kicker">{t({ uz: 'LUMO CITY · BIR QADAM', ru: 'LUMO CITY · ОДИН ШАГ', en: 'LUMO CITY · ONE STEP' })}</span><h1>{t(c.title)}</h1><p>{t(c.lead)}</p></div><div className="bit-coach bit-coach-theory"><BitSVG state="point" /></div></div>
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
const Screen1 = (props) => <DeepSequenceScreen {...props} contentKey="s1" copyKey="position" />;
const Screen2 = (props) => <ChoiceScreen {...props} contentKey="p1" />;
const Screen3 = (props) => <PlaceValueLadderScreen {...props} contentKey="s2" />;
const Screen4 = (props) => <ChoiceScreen {...props} contentKey="p2" />;
const Screen5 = (props) => <DeepSequenceScreen {...props} contentKey="s3" copyKey="values" />;
const Screen6 = (props) => <ChoiceScreen {...props} contentKey="p3" />;
const Screen7 = (props) => <DeepSequenceScreen {...props} contentKey="s4" copyKey="expansion" />;
const Screen8 = (props) => <NumericInputScreen {...props} contentKey="s8" />;
const Screen9 = (props) => <ZeroCoefficientScreen {...props} contentKey="s5" />;
const Screen10 = (props) => <DeepSequenceScreen {...props} contentKey="s6" copyKey="zeros" />;
const Screen11 = (props) => <ChoiceScreen {...props} contentKey="s11" />;
const Screen12 = (props) => <ChoiceScreen {...props} contentKey="s12" />;
const Screen13 = (props) => <ChoiceScreen {...props} contentKey="s13" />;
const Screen14 = (props) => <FinaleScreen {...props} />;

// Kept as approved visual references while the compact, no-scroll flow is active.
Object.freeze([DeepSequenceScreen, PlaceValueLadderScreen, ZeroCoefficientScreen, CardSolutionLabScreen, TheoryScreen, WorkedExamplesScreen, NumericInputScreen, MicroTheoryScreen]);

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

export default function Grade4Dars03({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode = false }) {
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
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang],
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions,
      correctAnswers,
      scorePercent: totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      finalScore,
      finalTotal: totalQuestions,
      passed: totalQuestions ? correctAnswers / totalQuestions >= 0.6 : false,
      firstTryStats: { total: totalQuestions, firstTryCorrect: correctAnswers },
      attemptsTotal: scoredAnswers.reduce((sum, answer) => sum + (answer.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else console.log('[Grade4 Dars03 preview]', payload);
  }, [answers, lang, onFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
  const previous = () => setCurrent((value) => Math.max(value - 1, 0));

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className={`lesson-root ${preview ? 'lesson-root-preview' : ''}`}>
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
.stage-content > .screen-stack {
  max-height: 100%;
  transform-origin: top center;
}
.micro-theory-screen { width: 100%; max-height: 100%; gap: 12px; }
.micro-theory-card { display: grid; gap: 8px; min-width: 0; padding: clamp(12px, 2vw, 18px); border-radius: 20px; background: rgba(255,255,255,.88); box-shadow: 0 12px 30px -22px rgba(${T.shadowBase},.45); }
.micro-theory-card > span { color: ${T.cyan}; font-size: 10px; font-weight: 900; letter-spacing: .12em; }
.micro-theory-card h2, .micro-theory-card p { margin: 0; overflow-wrap: anywhere; }
.micro-theory-card h2 { font: 700 clamp(16px, 2.4vw, 23px)/1.2 'Source Serif 4', serif; }
.micro-theory-card p { color: ${T.ink2}; font-size: clamp(12px, 1.7vw, 15px); line-height: 1.45; }
.micro-theory-example { color: ${T.navy}; font: 800 clamp(22px, 4vw, 38px)/1 'JetBrains Mono', monospace; overflow-wrap: anywhere; }
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
.hook-story-frame .model-heading, .hook-story-frame .model-heading span, .hook-story-frame .model-row span { color: rgba(255,255,255,.76); }
.hook-story-frame .model-number, .hook-story-frame .model-row strong { color: ${T.paper}; }
.etalon-hook-screen .question-card { padding: 13px; }
.etalon-hook-screen .question-card h2 { font-size: 18px; }
.etalon-hook-screen .options-grid { margin-top: 8px; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 7px; }
.etalon-hook-screen .option { min-height: 52px; padding: 9px 12px; font-size: 14px; }
.choice-screen { gap: 10px; }
.choice-screen > .model-panel .model-row-list { grid-template-columns: repeat(auto-fit,minmax(110px,1fr)); gap: 5px; }
.choice-screen > .model-panel .model-row-list > div { min-height: 44px; padding: 6px 8px; gap: 6px; }
.choice-screen > .model-panel .model-row-list span { font-size: 9px; }
.choice-screen > .model-panel .model-row-list strong { font-size: clamp(13px,1.7vw,17px); }
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
.model-number { position: relative; z-index: 1; font-family: 'JetBrains Mono', monospace; font-size: clamp(31px, 6vw, 52px); font-weight: 800; letter-spacing: .08em; text-align: center; white-space: nowrap; }
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
.model-row-list { position: relative; z-index: 1; display: grid; gap: 9px; }
.model-row-list > div { min-height: 58px; padding: 9px 14px; display: flex; align-items: center; justify-content: space-between; gap: 14px; border-radius: 13px; background: rgba(255,255,255,.10); }
.model-row-list span { color: rgba(255,255,255,.72); font-size: 12px; font-weight: 750; }
.model-row-list strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(20px,4vw,29px); }
.model-steps { position: relative; z-index: 1; list-style: none; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px; counter-reset: none; }
.model-steps li { min-height: 64px; padding: 11px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(255,255,255,.10); text-align: center; font-size: 12px; line-height: 1.35; font-weight: 720; }
.model-solved { box-shadow: 0 15px 34px -18px rgba(34,122,83,.58), inset 0 0 0 2px rgba(149,201,61,.26); }
.theory-model {
  animation: theory-model-in .62s cubic-bezier(.16,1,.3,1) .1s both;
}
.theory-model .model-number,
.theory-model .class-group,
.theory-model .place-cell,
.theory-model .model-row-list > div,
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
  grid-auto-rows: max-content;
  gap: 12px;
  align-items: start;
}
.foundation-layout > .model-panel { min-height: 0; display: block; }
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
  grid-template-columns: minmax(220px, .7fr) minmax(0, 1.3fr);
  gap: 12px;
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
.summary-core { display: grid; grid-template-columns: minmax(0, 1fr); grid-auto-rows: max-content; gap: 12px; align-items: start; }
.summary-core .model-panel, .summary-core .theory-callout { min-height: 0; }
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
.finale-heading { min-width: 0; padding: 12px 15px; border-radius: 17px; background: linear-gradient(135deg, ${T.paper}, ${T.cyanSoft}); box-shadow: 0 12px 28px -22px rgba(${T.shadowBase},.38); }
.finale-heading > span { display: block; margin-bottom: 4px; color: ${T.accent}; font: 900 9px/1 'JetBrains Mono', monospace; letter-spacing: .15em; }
.finale-heading h1 { color: ${T.navy}; font: 650 clamp(20px,3vw,28px)/1.08 'Source Serif 4', serif; overflow-wrap: anywhere; }
.finale-heading p { max-width: 760px; margin-top: 5px; color: ${T.ink2}; font-size: 12px; line-height: 1.42; overflow-wrap: anywhere; }
.finale-layout { min-width: 0; display: grid; grid-template-columns: minmax(0,1fr) minmax(248px,.42fr); gap: 10px; align-items: stretch; }
.finale-main { min-width: 0; display: flex; flex-direction: column; gap: 9px; }
.finale-actions { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.finale-reflection { padding: 10px; border-radius: 15px; background: ${T.paper}; box-shadow: 0 10px 24px -19px rgba(${T.shadowBase},.36); }
.finale-reflection > strong { display: block; color: ${T.navy}; font: 700 13px/1.25 'Source Serif 4',serif; }
.finale-reflection > div { margin-top: 7px; display: grid; gap: 5px; }
.finale-reflection button { min-height: 36px; padding: 6px 7px; border: 0; border-radius: 10px; display: grid; grid-template-columns: 22px minmax(0,1fr); align-items: center; gap: 6px; color: ${T.ink2}; background: ${T.cyanSoft}; text-align: left; font-size: 9px; line-height: 1.25; cursor: pointer; }
.finale-reflection button span { width: 22px; height: 22px; border-radius: 7px; display: grid; place-items: center; color: ${T.paper}; background: ${T.cyan}; font: 900 9px/1 'JetBrains Mono',monospace; }
.finale-reflection button.is-selected { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 3px 0 0 ${T.success}; }
.finale-actions .g4-title-claim { min-height: 70px; padding: 9px 12px; }
.finale-mastery { min-width: 0; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; }
.finale-takeaway { min-width: 0; min-height: 88px; padding: 10px; display: grid; grid-template-columns: 28px minmax(0,1fr); align-items: start; gap: 7px; border-radius: 14px; background: ${T.paper}; box-shadow: 0 10px 24px -19px rgba(${T.shadowBase},.36); opacity: 0; transform: translateY(8px); transition: opacity .34s ease, transform .34s ease; }
.finale-takeaway.is-visible { opacity: 1; transform: none; }
.finale-takeaway > span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px; color: ${T.paper}; background: ${T.cyan}; font: 900 10px/1 'JetBrains Mono', monospace; }
.finale-takeaway:nth-child(2) > span { background: ${T.accent}; }
.finale-takeaway:nth-child(3) > span { background: ${T.success}; }
.finale-takeaway p { color: ${T.ink}; font-size: 11px; line-height: 1.38; font-weight: 720; overflow-wrap: anywhere; }
.finale-proof, .finale-bridge { min-width: 0; opacity: 0; transform: translateY(7px); transition: opacity .34s ease, transform .34s ease; }
.finale-proof.is-visible, .finale-bridge.is-visible { opacity: 1; transform: none; }
.finale-proof { padding: 9px 12px; display: grid; grid-template-columns: auto minmax(0,.7fr) minmax(0,1.3fr); align-items: center; gap: 9px; border-radius: 13px; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.finale-proof > span, .finale-bridge strong { color: ${T.success}; font: 900 9px/1.2 'JetBrains Mono', monospace; letter-spacing: .1em; }
.finale-proof > strong { min-width: 0; color: ${T.navy}; font: 800 12px/1.25 'JetBrains Mono', monospace; overflow-wrap: anywhere; }
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
.finale-medal { position: absolute; z-index: 2; left: 11px; top: 50%; width: 39px; height: 39px; display: grid; place-items: center; border-radius: 50%; color: ${T.navy}; background: ${T.lime}; box-shadow: 0 0 0 5px rgba(149,201,61,.14); transform: translateY(-50%) scale(.78); transition: transform .38s ease; }
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}
.deep-sequence-tabs button {
  min-height: 58px;
  padding: 10px 13px;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: 15px;
  color: ${T.ink2};
  background: ${T.paper};
  cursor: pointer;
  font-weight: 820;
  line-height: 1.3;
  text-align: left;
  box-shadow: inset 0 0 0 1px rgba(22,143,163,.13), 0 10px 22px -18px rgba(${T.shadowBase},.35);
  transition: transform .2s ease, color .2s ease, background .2s ease, box-shadow .2s ease;
}
.deep-sequence-tabs button:hover { transform: translateY(-1px); }
.deep-sequence-tabs button > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font: 900 11px/1 'JetBrains Mono', monospace;
}
.deep-sequence-tabs button strong { min-width: 0; font-size: 12px; line-height: 1.3; }
.deep-sequence-tabs .deep-tab-active {
  color: ${T.navy};
  background: ${T.paper};
  box-shadow: inset 0 0 0 2px rgba(22,143,163,.38), 0 12px 24px -16px rgba(22,143,163,.48);
}
.deep-sequence-tabs .deep-tab-active > span { color: ${T.paper}; background: ${T.cyan}; }
.deep-sequence-tabs .deep-tab-seen > span { color: ${T.navy}; background: ${T.lime}; }
.deep-sequence-screen { gap: 10px; }
.deep-sequence-screen .screen-heading { grid-template-columns: minmax(0,1fr) 86px; gap: 12px; }
.deep-sequence-screen .heading-copy h1 { font-size: clamp(23px,3vw,32px); line-height: 1.06; }
.deep-sequence-screen .heading-copy p { margin-top: 6px; font-size: 12px; line-height: 1.35; }
.deep-sequence-screen .lesson-kicker { margin-bottom: 5px; font-size: 9px; }
.deep-sequence-screen .bit-coach { width: 86px; height: 90px; border-radius: 20px; }
.deep-sequence-screen .bit-coach .g1-char { width: 70px; height: 88px; }
.deep-sequence-stage {
  display: grid;
  grid-template-columns: minmax(0,1fr) minmax(260px,.72fr);
  gap: 10px;
  align-items: start;
  animation: deep-stage-in .62s cubic-bezier(.16,1,.3,1) both;
}
.deep-sequence-stage > .model-panel {
  min-height: 0;
  padding: 12px;
  display: block;
}
.deep-sequence-stage .model-heading { margin-bottom: 7px; font-size: 9px; }
.deep-sequence-stage .model-number { font-size: 32px; line-height: 1.15; }
.deep-sequence-stage .model-row-list { gap: 6px; }
.deep-sequence-stage .model-row-list > div { min-height: 44px; padding: 7px 9px; gap: 6px; }
.deep-sequence-stage .model-row-list span { font-size: 10px; }
.deep-sequence-stage .model-row-list strong { max-width: 68%; font-size: clamp(13px,1.7vw,17px); line-height: 1.25; overflow-wrap: anywhere; text-align: right; }
.deep-sequence-explanation {
  min-height: 0;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 6px;
  border: 1px solid rgba(22,143,163,.15);
  border-radius: 20px;
  background: linear-gradient(145deg, ${T.paper}, ${T.cyanSoft});
  box-shadow: inset 4px 0 0 ${T.cyan}, 0 14px 30px -22px rgba(${T.shadowBase},.38);
}
.deep-sequence-explanation > span,
.deep-contrast-card > span {
  color: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .13em;
  text-transform: uppercase;
}
.deep-sequence-explanation h2 {
  color: ${T.navy};
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(17px, 2vw, 21px);
  line-height: 1.25;
  font-weight: 650;
}
.deep-sequence-explanation p { color: ${T.ink2}; font-size: 11px; line-height: 1.35; }
.deep-sequence-misconception { padding: 6px 8px; border-radius: 9px; color: ${T.warn}; background: ${T.warnSoft}; font-size: 9px; line-height: 1.3; }
.deep-sequence-explanation strong {
  margin-top: auto;
  padding: 7px 9px;
  border-radius: 12px;
  color: ${T.success};
  background: ${T.successSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(13px, 1.8vw, 16px);
  line-height: 1.35;
}
.deep-contrast-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.deep-contrast-row article {
  min-height: 105px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  border-radius: 16px;
  background: ${T.paper};
  opacity: .2;
  transform: translateY(8px);
  box-shadow: 0 11px 26px -20px rgba(${T.shadowBase},.36);
  transition: opacity .35s ease, transform .35s ease, box-shadow .35s ease;
}
.deep-contrast-row article.deep-insight-visible {
  opacity: 1;
  transform: translateY(0);
  box-shadow: inset 3px 0 0 ${T.success}, 0 11px 26px -20px rgba(${T.shadowBase},.36);
}
.deep-contrast-row article > span { color: ${T.success}; }
.deep-contrast-row article strong { color: ${T.navy}; font-size: 12px; line-height: 1.35; }
.deep-contrast-row article p { margin-top: auto; color: ${T.ink2}; font-size: 12px; line-height: 1.42; }
.deep-replay {
  min-height: 48px;
  padding: 8px 14px;
  justify-self: end;
  border: 0;
  border-radius: 13px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  cursor: pointer;
  font-weight: 850;
  box-shadow: inset 0 0 0 1px rgba(22,143,163,.15);
}
.deep-replay:hover { transform: translateY(-1px); }
.ladder-screen,.zero-coefficient-screen { gap: 10px; }
@keyframes deep-stage-in {
  from { opacity: 0; transform: translateY(13px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.place-ladder-board,
.zero-place-board,
.card-lab-solution {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  color: ${T.paper};
  background:
    radial-gradient(circle at 92% 12%, rgba(149,201,61,.17), transparent 25%),
    linear-gradient(145deg, ${T.navy}, #102F43);
  box-shadow: 0 16px 36px -20px rgba(23,59,82,.62);
  animation: theory-model-in .62s cubic-bezier(.16,1,.3,1) .08s both;
}
.place-ladder-board { padding: 18px; }
.place-ladder-topline,
.zero-place-heading {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.place-ladder-topline > span,
.zero-place-heading > span {
  color: rgba(255,255,255,.74);
  font-size: 12px;
  font-weight: 760;
}
.place-ladder-topline > strong {
  flex: 0 0 auto;
  padding: 8px 11px;
  border-radius: 999px;
  color: ${T.navy};
  background: ${T.lime};
  font: 900 10px/1.2 'JetBrains Mono', monospace;
  letter-spacing: .03em;
  animation: ladder-direction-in .72s cubic-bezier(.16,1,.3,1) .54s both;
}
.place-ladder-track {
  position: relative;
  z-index: 1;
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
}
.place-ladder-step {
  min-height: 126px;
  padding: 12px 9px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 16px;
  background: rgba(255,255,255,.10);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
  text-align: center;
  animation: ladder-step-in .68s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.18s + var(--reveal-i, 0) * .13s);
}
.place-ladder-step > span { min-height: 28px; color: rgba(255,255,255,.68); font-size: 10px; font-weight: 760; }
.place-ladder-step > strong { font: 900 clamp(23px,4vw,34px)/1 'JetBrains Mono', monospace; letter-spacing: .04em; }
.place-ladder-step > i { padding: 5px 8px; border-radius: 999px; color: ${T.navy}; background: ${T.cyanSoft}; font-size: 9px; font-style: normal; font-weight: 850; }
.ladder-contrast-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
}
.ladder-contrast-grid article {
  min-height: 128px;
  padding: 15px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px 14px;
  border-radius: 17px;
  background: ${T.paper};
  box-shadow: inset 4px 0 0 ${T.cyan}, 0 12px 27px -21px rgba(${T.shadowBase},.38);
  animation: theory-copy-in .68s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.5s + var(--reveal-i, 0) * .17s);
}
.ladder-contrast-grid article.ladder-example-shifted { box-shadow: inset 4px 0 0 ${T.accent}, 0 12px 27px -21px rgba(${T.shadowBase},.38); }
.ladder-contrast-grid article > div { min-width: 0; display: grid; gap: 4px; }
.ladder-contrast-grid article > div span { color: ${T.cyan}; font: 900 9px/1.2 'JetBrains Mono', monospace; letter-spacing: .12em; }
.ladder-contrast-grid article > div strong { color: ${T.navy}; font: 900 clamp(19px,3vw,27px)/1.2 'JetBrains Mono', monospace; }
.ladder-contrast-grid article > p { grid-column: 1; color: ${T.ink2}; font-size: 12px; line-height: 1.4; }
.ladder-contrast-grid article > b { grid-column: 2; grid-row: 1 / span 2; color: ${T.success}; font: 900 clamp(20px,3vw,29px)/1.1 'JetBrains Mono', monospace; }
@keyframes ladder-step-in {
  from { opacity: 0; transform: translateX(18px) scale(.92); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes ladder-direction-in {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
.zero-place-board { padding: 17px; }
.zero-place-heading > strong { color: ${T.paper}; font: 900 clamp(27px,5vw,43px)/1 'JetBrains Mono', monospace; letter-spacing: .08em; }
.zero-place-grid {
  position: relative;
  z-index: 1;
  margin-top: 13px;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 6px;
}
.zero-place-grid > div {
  min-width: 0;
  min-height: 92px;
  padding: 8px 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  border-radius: 13px;
  background: rgba(255,255,255,.10);
  text-align: center;
  animation: theory-item-in .62s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.2s + var(--reveal-i, 0) * .08s);
}
.zero-place-grid > div > span { min-height: 25px; color: rgba(255,255,255,.68); font-size: 8px; line-height: 1.15; }
.zero-place-grid > div > strong { font: 900 clamp(22px,3.8vw,31px)/1 'JetBrains Mono', monospace; }
.zero-place-grid > div > i { min-height: 17px; color: rgba(255,255,255,.55); font-size: 7px; font-style: normal; font-weight: 800; }
.zero-place-grid > div.zero-place-empty { background: rgba(255,91,53,.17); box-shadow: inset 0 0 0 2px rgba(255,91,53,.52); }
.zero-place-grid > div.zero-place-empty > strong { color: #FFD2C7; animation: zero-place-pulse 2.4s ease-in-out 2; }
.zero-contrast-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
}
.zero-contrast-grid article {
  min-height: 184px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  border-radius: 18px;
  background: ${T.paper};
  animation: theory-copy-in .68s cubic-bezier(.16,1,.3,1) both;
}
.zero-contrast-grid article > span { font: 900 9px/1.2 'JetBrains Mono', monospace; letter-spacing: .12em; }
.zero-contrast-grid article > strong { overflow-wrap: anywhere; color: ${T.navy}; font: 800 clamp(12px,1.8vw,16px)/1.35 'JetBrains Mono', monospace; }
.zero-contrast-grid article > i { color: ${T.success}; font-size: 20px; font-style: normal; font-weight: 900; text-align: center; }
.zero-contrast-grid article > p { margin-top: auto; color: ${T.ink2}; font-size: 12px; line-height: 1.43; }
.zero-contrast-sum { box-shadow: inset 4px 0 0 ${T.success}, 0 12px 27px -21px rgba(${T.shadowBase},.38); animation-delay: .44s !important; }
.zero-contrast-sum > span { color: ${T.success}; }
.zero-contrast-notation { box-shadow: inset 4px 0 0 ${T.warn}, 0 12px 27px -21px rgba(${T.shadowBase},.38); animation-delay: .62s !important; }
.zero-contrast-notation > span { color: ${T.warn}; }
.zero-contrast-notation > div { display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: center; gap: 8px; }
.zero-contrast-notation > div strong { color: ${T.navy}; font: 900 clamp(19px,3.4vw,29px)/1.2 'JetBrains Mono', monospace; text-align: center; }
.zero-contrast-notation > div i { color: ${T.warn}; font-size: 25px; font-style: normal; font-weight: 900; }
@keyframes zero-place-pulse { 50% { color: ${T.paper}; transform: scale(1.12); } }
.card-lab-solution { padding: 17px; display: grid; gap: 11px; }
.shuffled-card-zone,
.ordered-card-zone,
.card-lab-result { position: relative; z-index: 1; display: grid; gap: 10px; }
.card-lab-label { display: flex; align-items: center; gap: 9px; color: rgba(255,255,255,.72); font-size: 9px; letter-spacing: .11em; }
.card-lab-label > span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px; color: ${T.navy}; background: ${T.lime}; font: 900 9px/1 'JetBrains Mono', monospace; }
.value-card-cloud { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.value-card-cloud > span {
  min-height: 44px;
  padding: 8px 13px;
  display: inline-flex;
  align-items: center;
  border-radius: 12px;
  color: ${T.navy};
  background: ${T.paper};
  font: 900 clamp(14px,2.4vw,19px)/1 'JetBrains Mono', monospace;
  box-shadow: 0 8px 18px -11px rgba(0,0,0,.38);
  animation: shuffled-card-in .62s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.16s + var(--reveal-i, 0) * .1s);
}
.value-card-cloud > span:nth-child(odd) { transform: rotate(-1.5deg); }
.value-card-cloud > span:nth-child(even) { transform: rotate(1.5deg); }
.card-lab-arrow { position: relative; z-index: 1; height: 20px; display: grid; place-items: center; color: ${T.lime}; font-size: 22px; font-weight: 900; animation: card-arrow-in .6s cubic-bezier(.16,1,.3,1) .7s both; }
.card-place-grid { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 6px; }
.card-place-grid article {
  min-width: 0;
  min-height: 100px;
  padding: 7px 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  border-radius: 12px;
  background: rgba(255,255,255,.10);
  text-align: center;
  animation: ordered-card-in .62s cubic-bezier(.16,1,.3,1) both;
  animation-delay: calc(.78s + var(--reveal-i, 0) * .08s);
}
.card-place-grid article > span { min-height: 25px; color: rgba(255,255,255,.67); font-size: 7px; line-height: 1.15; }
.card-place-grid article > strong { font: 900 clamp(21px,3.5vw,29px)/1 'JetBrains Mono', monospace; }
.card-place-grid article > i { color: rgba(255,255,255,.58); font-size: 7px; font-style: normal; font-weight: 760; }
.card-place-grid article.card-place-empty { background: rgba(255,91,53,.17); box-shadow: inset 0 0 0 2px rgba(255,91,53,.48); }
.card-place-grid article.card-place-empty > strong { color: #FFD2C7; }
.card-lab-result { grid-template-columns: auto minmax(0, .7fr) minmax(260px, 1.3fr); align-items: center; animation: result-lock-in .7s cubic-bezier(.16,1,.3,1) 1.4s both; }
.card-lab-result .card-lab-label { align-self: stretch; }
.card-result-number { padding: 12px 14px; border-radius: 14px; color: ${T.navy}; background: ${T.lime}; font: 900 clamp(24px,4.3vw,38px)/1 'JetBrains Mono', monospace; letter-spacing: .06em; text-align: center; }
.card-result-check { min-width: 0; padding: 11px 13px; display: grid; gap: 4px; border-radius: 14px; background: rgba(255,255,255,.10); }
.card-result-check > span { color: rgba(255,255,255,.62); font-size: 8px; font-weight: 850; letter-spacing: .09em; text-transform: uppercase; }
.card-result-check > strong { overflow-wrap: anywhere; font: 800 clamp(11px,1.8vw,15px)/1.35 'JetBrains Mono', monospace; }
.card-lab-steps { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 9px; }
.card-lab-steps article { min-height: 110px; padding: 14px; display: flex; flex-direction: column; gap: 7px; border-radius: 16px; background: ${T.paper}; box-shadow: 0 11px 26px -20px rgba(${T.shadowBase},.36); animation: theory-item-in .62s cubic-bezier(.16,1,.3,1) both; animation-delay: calc(.28s + var(--reveal-i, 0) * .13s); }
.card-lab-steps article > strong { color: ${T.cyan}; font-size: 12px; }
.card-lab-steps article > p { margin-top: auto; color: ${T.ink2}; font-size: 11px; line-height: 1.42; }
.card-lab-conclusion { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: end; gap: 10px; }
.card-lab-conclusion .deep-replay { white-space: nowrap; }
@keyframes shuffled-card-in { from { opacity: 0; transform: translate(18px,-10px) rotate(6deg) scale(.82); } to { opacity: 1; transform: translate(0,0) rotate(0) scale(1); } }
@keyframes card-arrow-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes ordered-card-in { from { opacity: 0; transform: translateY(-18px) scale(.88); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes result-lock-in { from { opacity: 0; transform: scale(.95); filter: blur(3px); } to { opacity: 1; transform: scale(1); filter: blur(0); } }
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
.fact-card strong { font-size: 10px; letter-spacing: .14em; }
.fact-card p, .bridge-card p { color: ${T.ink2}; font-size: 13px; line-height: 1.42; }
.bridge-card { background: ${T.accentSoft}; }
.bridge-card > span { color: ${T.accent}; font-weight: 900; }
.compact-heading { grid-template-columns: minmax(0,1fr) auto; }
.screen-stack.choice-screen { gap: 8px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel { padding: 10px; }
.choice-screen:not(.etalon-hook-screen) > .model-panel .model-heading { margin-bottom: 5px; }
.choice-screen:not(.etalon-hook-screen) .question-card { padding: 14px; }
.choice-screen:not(.etalon-hook-screen) .question-card h2 { font-size: 22px; }
.choice-screen:not(.etalon-hook-screen) .options-grid { margin-top: 9px; gap: 7px; }
.choice-screen:not(.etalon-hook-screen) .option { min-height: 56px; padding: 8px 10px; font-size: 12px; }
.choice-screen:not(.etalon-hook-screen) .feedback { height: 74px; margin-top: 5px; overflow: hidden; }
.choice-screen:not(.etalon-hook-screen) .feedback-card { min-height: 74px; padding: 6px 10px 6px 4px; grid-template-columns: 62px minmax(0,1fr); gap: 7px; }
.choice-screen:not(.etalon-hook-screen) .feedback-bit { width: 62px; height: 68px; }
.choice-screen:not(.etalon-hook-screen) .feedback-card .g1-char { width: 56px; height: 68px; }
.choice-screen:not(.etalon-hook-screen) .feedback-card p { font-size: 11px; line-height: 1.35; }
.lesson-root button:focus-visible { outline: 3px solid rgba(22,143,163,.42); outline-offset: 3px; }
@media (max-width: 760px) {
  .screen-heading { grid-template-columns: minmax(0,1fr) 94px; }
  .bit-coach { width: 94px; height: 102px; }
  .bit-coach .g1-char { width: 78px; height: 100px; }
  .place-ladder-track { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .card-lab-result { grid-template-columns: 1fr 1fr; }
  .card-lab-result .card-lab-label { grid-column: 1 / -1; }
  .rule-reveal { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .options-grid { grid-template-columns: 1fr; }
  .etalon-hook-screen .options-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .finale-layout { grid-template-columns: 1fr; }
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
  .heading-copy h1 { font-size: 27px; }
  .heading-copy p { margin-top: 7px; font-size: 13px; line-height: 1.4; }
  .lesson-kicker { margin-bottom: 5px; font-size: 9px; }
  .bit-coach { width: 76px; height: 82px; border-radius: 20px; }
  .bit-coach .g1-char { width: 62px; height: 78px; }
  .model-panel { padding: 13px; border-radius: 16px; }
  .model-heading { margin-bottom: 9px; font-size: 9px; }
  .model-number { font-size: 30px; }
  .class-groups { gap: 7px; }
  .class-group { min-height: 72px; }
  .class-group strong { font-size: 27px; }
  .class-group span { font-size: 10px; }
  .place-table { gap: 4px; }
  .place-cell { min-height: 76px; padding: 5px 2px; }
  .place-cell span { min-height: 30px; font-size: 10px; line-height: 1.1; }
  .place-cell strong { font-size: 20px; }
  .model-steps { grid-template-columns: 1fr; gap: 5px; }
  .model-steps li { min-height: 42px; padding: 8px; }
  .foundation-layout, .animated-explanation, .strategy-walkthrough, .summary-core { grid-template-columns: 1fr; }
  .worked-example-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .deep-sequence-tabs, .deep-contrast-row { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .deep-sequence-tabs button { min-height: 52px; padding: 7px; grid-template-columns: 28px minmax(0,1fr); gap: 6px; }
  .deep-sequence-tabs button > span { width: 28px; height: 28px; font-size: 9px; }
  .deep-sequence-tabs button strong { font-size: 10px; }
  .deep-sequence-stage { grid-template-columns: 1fr; gap: 9px; }
  .deep-sequence-stage > .model-panel, .deep-sequence-explanation { min-height: 0; }
  .deep-sequence-explanation { padding: 14px; border-radius: 16px; }
  .deep-contrast-row article { min-height: 0; padding: 8px; gap: 4px; }
  .deep-contrast-row article > span { font-size: 8px; }
  .deep-contrast-row article strong { font-size: 10px; line-height: 1.3; }
  .deep-contrast-row article p { font-size: 9px; line-height: 1.3; }
  .deep-replay { width: 100%; min-height: 52px; justify-self: stretch; }
  .place-ladder-board, .zero-place-board, .card-lab-solution { padding: 11px; border-radius: 16px; }
  .place-ladder-topline, .zero-place-heading { align-items: flex-start; }
  .place-ladder-topline { flex-direction: row; align-items: center; gap: 6px; }
  .place-ladder-topline > span { font-size: 10px; line-height: 1.25; }
  .place-ladder-topline > strong { align-self: auto; padding: 6px 7px; font-size: 8px; text-align: center; }
  .place-ladder-track { margin-top: 8px; gap: 5px; }
  .place-ladder-step { min-height: 80px; padding: 6px 4px; gap: 4px; }
  .place-ladder-step > span { min-height: 22px; font-size: 9px; line-height: 1.1; }
  .place-ladder-step > strong { font-size: 21px; }
  .place-ladder-step > i { padding: 4px 5px; font-size: 9px; }
  .ladder-contrast-grid, .zero-contrast-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .ladder-contrast-grid article { min-height: 0; padding: 8px; gap: 5px; }
  .ladder-contrast-grid article > div strong { font-size: 16px; }
  .ladder-contrast-grid article > p { font-size: 9px; line-height: 1.3; }
  .ladder-contrast-grid article > b { font-size: 16px; }
  .zero-place-heading > span { max-width: 190px; font-size: 11px; }
  .zero-place-heading > strong { font-size: 28px; }
  .zero-place-grid { margin-top: 10px; gap: 3px; }
  .zero-place-grid > div { min-height: 90px; padding: 6px 2px; border-radius: 10px; }
  .zero-place-grid > div > span { min-height: 30px; font-size: 10px; line-height: 1.1; overflow-wrap: anywhere; }
  .zero-place-grid > div > strong { font-size: 21px; }
  .zero-place-grid > div > i { min-height: 20px; font-size: 9px; line-height: 1.1; overflow-wrap: anywhere; }
  .zero-contrast-grid article { min-height: 0; padding: 9px; gap: 5px; }
  .zero-contrast-grid article > strong { font-size: 11px; }
  .zero-contrast-grid article > p { font-size: 9px; line-height: 1.3; }
  .zero-contrast-notation > div { gap: 4px; }
  .zero-contrast-notation > div strong { font-size: 17px; }
  .zero-contrast-notation > div i { font-size: 18px; }
  .card-lab-solution { gap: 6px; }
  .card-lab-label { gap: 5px; font-size: 9px; line-height: 1.15; }
  .card-lab-label > span { width: 27px; height: 27px; font-size: 9px; }
  .value-card-cloud { flex-wrap: nowrap; gap: 4px; }
  .value-card-cloud > span { min-height: 32px; padding: 5px 7px; font-size: 10px; }
  .card-lab-arrow { height: 14px; font-size: 18px; }
  .card-place-grid { gap: 3px; }
  .card-place-grid article { min-height: 72px; padding: 5px 2px; border-radius: 9px; }
  .card-place-grid article > span { min-height: 22px; font-size: 8px; line-height: 1.05; overflow-wrap: anywhere; }
  .card-place-grid article > strong { font-size: 18px; }
  .card-place-grid article > i { min-height: 16px; font-size: 7px; line-height: 1.05; overflow-wrap: anywhere; }
  .card-lab-result { grid-template-columns: auto minmax(70px,.6fr) minmax(0,1.4fr); gap: 6px; }
  .card-lab-result .card-lab-label { grid-column: auto; }
  .card-result-number { padding: 7px 5px; font-size: 19px; }
  .card-result-check { padding: 6px; }
  .card-result-check > span { font-size: 7px; }
  .card-result-check > strong { font-size: 8px; }
  .card-lab-steps { grid-template-columns: repeat(3,minmax(0,1fr)); }
  .card-lab-conclusion { grid-template-columns: minmax(0,1fr) 104px; align-items: stretch; gap: 6px; }
  .card-lab-steps { gap: 6px; }
  .card-lab-steps article { min-height: 0; padding: 8px; }
  .card-lab-steps article > strong { font-size: 10px; }
  .card-lab-steps article > p { font-size: 9px; line-height: 1.3; }
  .card-lab-conclusion .deep-replay { width: auto; min-width: 0; padding: 6px; white-space: normal; }
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
  .error-state { min-height: 0; padding: 14px; }
  .repair-arrow { min-height: 28px; font-size: 0; }
  .repair-arrow::before { content: '↓'; font-size: 24px; }
  .summary-core .model-panel, .summary-core .theory-callout { min-height: 0; }
  .summary-bridge { padding: 11px 13px; }
  .worked-example { min-height: 0; padding: 9px; grid-template-columns: 30px minmax(0, 1fr); gap: 7px; }
  .worked-index { width: 30px; height: 30px; }
  .worked-copy h2 { font-size: 12px; }
  .worked-copy > strong { font-size: 13px; }
  .worked-copy > p { font-size: 9px; }
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
  .finale-heading { padding: 11px 12px; }
  .finale-heading h1 { font-size: 22px; }
  .finale-heading p { display: none; }
  .finale-mastery { grid-template-columns: repeat(3,minmax(0,1fr)); gap: 5px; }
  .finale-takeaway { min-height: 0; padding: 8px 9px; }
  .finale-takeaway p { font-size: 9px; line-height: 1.3; }
  .finale-proof { grid-template-columns: 1fr; gap: 5px; }
  .finale-reward { min-height: 116px; padding: 11px 65px 11px 51px; }
  .finale-reward-copy h2 { font-size: 17px; }
  .finale-medal { left: 8px; width: 34px; height: 34px; }
  .finale-reward-bit { width: 62px; height: 78px; }
  .deep-sequence-screen { gap: 8px; }
  .deep-sequence-screen .screen-heading { grid-template-columns: minmax(0,1fr) 70px; gap: 8px; }
  .deep-sequence-screen .heading-copy p { display: none; }
  .deep-sequence-screen .heading-copy h1 { font-size: 22px; }
  .deep-sequence-screen .bit-coach { width: 70px; height: 74px; }
  .deep-sequence-screen .bit-coach .g1-char { width: 58px; height: 72px; }
  .deep-sequence-tabs button { min-height: 46px; }
  .deep-sequence-stage { gap: 6px; }
  .deep-sequence-stage > .model-panel { padding: 8px; }
  .deep-sequence-stage .model-number { font-size: 26px; }
  .deep-sequence-stage .model-row-list > div { min-height: 38px; padding: 5px 7px; }
  .deep-sequence-explanation { padding: 8px; }
  .deep-sequence-misconception { display: none; }
  .deep-replay { min-height: 44px; }
  .choice-screen { gap: 8px; }
  .choice-screen > .model-panel { padding: 8px; }
  .choice-screen > .model-panel .model-heading { margin-bottom: 5px; }
  .choice-screen > .model-panel .model-row-list { grid-template-columns: repeat(4,minmax(0,1fr)); gap: 3px; }
  .choice-screen > .model-panel .model-row-list > div { min-height: 38px; padding: 4px 2px; display: grid; justify-items: center; gap: 2px; text-align: center; }
  .choice-screen > .model-panel .model-row-list span { font-size: 7px; }
  .choice-screen > .model-panel .model-row-list strong { font-size: 11px; }
  .choice-screen:not(.etalon-hook-screen) .options-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .choice-screen:not(.etalon-hook-screen) .option { min-height: 52px; padding: 6px; font-size: 10px; }
}
@media (max-width: 639.98px) and (max-height: 700px) {
  .stage-header { padding-top: 6px; padding-bottom: 5px; }
  .progress-track { height: 4px; margin-bottom: 5px; }
  .stage-content { padding-top: 4px; padding-bottom: 4px; }
  .stage-content > .screen-stack { transform: scale(.92); }
  .stage-nav { min-height: 54px; padding-top: 4px; padding-bottom: 4px; }
  .btn { min-height: 44px; }
  .screen-stack { gap: 7px; }
  .screen-heading { grid-template-columns: minmax(0,1fr) 58px; gap: 6px; }
  .heading-copy h1 { font-size: 21px; }
  .heading-copy p { margin-top: 3px; font-size: 11px; line-height: 1.25; }
  .bit-coach { width: 58px; height: 62px; }
  .bit-coach .g1-char { width: 48px; height: 59px; }
  .model-panel, .question-card { padding: 9px; }
  .question-card h2 { font-size: 16px; }
  .option { min-height: 44px; padding: 6px 8px; }
  .feedback-card { min-height: 66px; grid-template-columns: 52px minmax(0,1fr); padding: 5px 8px 5px 2px; }
  .feedback-card .g1-char { width: 50px; height: 61px; }
  .finale-layout { grid-template-columns: minmax(0,1.25fr) minmax(152px,.75fr); gap: 6px; }
  .finale-heading { padding: 7px 9px; }
  .finale-heading h1 { font-size: 18px; }
  .finale-mastery { gap: 3px; }
  .finale-takeaway { padding: 5px 6px; }
  .finale-reflection { padding: 6px; }
  .finale-reflection button { min-height: 44px; }
  .finale-actions .g4-title-claim { min-height: 54px; }
  .finale-reward { min-height: 90px; padding-top: 7px; padding-bottom: 7px; }
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
@media(max-width:639.98px){:is(.lesson-root,.d8-root):has([data-g4-screen="hook"]){width:100%!important;max-width:100%!important;zoom:1!important}:is(.lesson-root,.d8-root):has([data-g4-screen="hook"]) .stage{width:100%!important;max-width:100%!important}}
@media(max-width:390px) and (max-height:700px){.etalon-hook-screen .screen-heading .heading-copy p{display:none}.etalon-hook-screen .question-card{padding:7px 8px}.etalon-hook-screen .question-topline{margin-bottom:4px}.etalon-hook-screen .question-card h2{font-size:14px;line-height:1.14}.etalon-hook-screen .options-grid{margin-top:4px;gap:4px}.etalon-hook-screen .option{min-height:48px;padding:5px 6px;font-size:10px;line-height:1.2}.etalon-hook-screen .option-letter{width:24px;height:24px;flex-basis:24px}}
.hook-story-frame[data-g4-role~="hook-scene"]{grid-template-columns:minmax(0,1fr)!important}
.hook-story-frame[data-g4-role~="hook-scene"] .hook-story-model{grid-column:1/-1;width:100%;min-width:0;padding-right:116px}
@media(max-width:639.98px){.hook-story-frame[data-g4-role~="hook-scene"] .hook-story-model{padding-right:84px}}
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
`;
