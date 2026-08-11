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
  uz: { revealPrefix: 'Unvon', earned: 'UNVON OLINDI', firstTry: 'birinchi urinishda' },
  ru: { revealPrefix: 'Звание', earned: 'ЗВАНИЕ ПОЛУЧЕНО', firstTry: 'с первой попытки' },
  en: { revealPrefix: 'Title', earned: 'TITLE EARNED', firstTry: 'on the first attempt' },
};

function G4TitleReveal({ active, title, lang }) {
  const [visible, setVisible] = useState(false); const shownRef = useRef(false);
  useEffect(() => { if (!active || shownRef.current || typeof window === 'undefined') return undefined; let timer; const frame = window.requestAnimationFrame(() => { shownRef.current = true; setVisible(true); timer = window.setTimeout(() => setVisible(false), 3900); }); return () => { window.cancelAnimationFrame(frame); window.clearTimeout(timer); }; }, [active]);
  if (!visible || typeof document === 'undefined') return null;
  const copy = G4_TITLE_COPY[lang] ?? G4_TITLE_COPY.uz;
  return createPortal(<div className="g4-title-reveal-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={`${copy.revealPrefix}: ${title}`}><div className="g4-title-reveal-card"><div className="g4-title-reveal-rays" aria-hidden="true" /><div className="g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }} />)}</div><div className="g4-title-reveal-medal" aria-hidden="true">★</div><h2>{title}</h2></div></div>, document.body);
}

function G4TitleCard({ title, lang, firstTry, totalScored }) {
  const copy = G4_TITLE_COPY[lang] ?? G4_TITLE_COPY.uz;
  return <div className="g4-title-card-stage" role="status" aria-live="polite" aria-atomic="true"><div className="g4-title-card-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div><div className="g4-title-card-bit"><BitSVG state="happy" /></div><div className="g4-title-card-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{copy.earned}</span><h2>{title}</h2><div className="g4-title-card-score"><strong>{firstTry}/{totalScored}</strong><span>{copy.firstTry}</span></div></div>;
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
    eyebrow: B('Загадка Бита', "Bitning topishmog'i", "Bit's puzzle"),
    title: B('Знак I означает число 1. Бит прав?', 'I belgisi 1 sonini bildiradi. Bit haqmi?', 'The symbol I represents the number 1. Is Bit right?'),
    options: [
      B('Да, этот знак читается как 1.', "Ha, bu raqam 1 deb o'qiladi.", 'Yes, this symbol is read as 1.'),
      B('Нет, число один записывается иначе.', "Yo'q, bir soni boshqacha yoziladi.", 'No, the number one is written differently.'),
    ],
    after: B('Отлично, теперь разберёмся вместе.', "Ajoyib, keling endi buni o'rganib chiqamiz.", 'Now let us work it out together.'),
    audio: B(
      ['Бит увидел на экране знак, похожий на вертикальную черту.', 'Он думает, что этот знак означает один.', 'Как ты думаешь, Бит прав?'],
      ["Bit ekranda tik chiziqqa o'xshash belgini ko'rdi.", "U bu belgini bir deb o'ylayapti.", 'Sizningcha, Bit haqmi?'],
      ['Bit saw a symbol on the screen that looks like a vertical line.', 'He thinks this symbol represents one.', 'Do you think Bit is right?'],
    ),
  },
  s1: {
    eyebrow: B('Римские соответствия', 'Rimcha mosliklar', 'Roman numeral matches'),
    title: B('Соедини запись с её числом', "Yozuvni uning soni bilan bog'lang", 'Match each numeral to its number'),
    caption: B('Опорные знаки: I = 1, V = 5, X = 10.', 'Tayanch belgilar: I = 1, V = 5, X = 10.', 'Key symbols: I = 1, V = 5, X = 10.'),
    bridge: B('IV = 4 · IX = 9 · XIV = 14 · XX = 20', 'IV = 4 · IX = 9 · XIV = 14 · XX = 20', 'IV = 4 · IX = 9 · XIV = 14 · XX = 20'),
    audio: B(
      ['Знак и означает один, знак вэ означает пять, знак икс означает десять.', 'Запись и вэ означает четыре, а и икс означает девять.', 'Запись икс и вэ означает четырнадцать, а два знака икс означают двадцать.', 'Запомни эти четыре соответствия перед заданием.'],
      ["I belgisi birni, V belgisi beshni, X belgisi o'nni bildiradi.", "IV yozuvi to'rtni, IX yozuvi to'qqizni bildiradi.", "XIV yozuvi o'n to'rtni, ikkita X esa yigirmani bildiradi.", "Topshiriqdan oldin shu to'rtta moslikni eslab qoling."],
      ['The symbol I represents one, V represents five, and X represents ten.', 'The numeral IV represents four, while IX represents nine.', 'The numeral XIV represents fourteen, while two X symbols represent twenty.', 'Remember these four matches before the task.'],
    ),
  },
  s2: {
    eyebrow: B('Римская запись', 'Rim yozuvi', 'Roman numerals'),
    title: B('Римская запись чисел от 1 до 20', "Rim yozuvi 1 dan 20 gacha", 'Roman numerals from 1 to 20'),
    rule: B(
      'При повторении I и X значения складываются. Если I стоит перед V или X, единица вычитается.',
      'I va X takrorlansa, qiymatlar qo\'shiladi. I belgisi V yoki X dan oldin tursa, 1 ayiriladi.',
      'When I and X are repeated, their values are added. If I comes before V or X, one is subtracted.',
    ),
    bridge: B('14 и XIV означают одно число, но записаны двумя разными способами.', '14 va XIV bir xil sonni bildiradi, lekin ikki xil usulda yozilgan.', '14 and XIV represent the same number, but they are written in two different ways.'),
    audio: B(
      ['В римской записи знак и означает один, знак вэ означает пять, знак икс означает десять.', 'Если знак и или икс повторяется, их значения складываются.', 'Если знак и стоит после вэ или икс, единица прибавляется.', 'Если знак и стоит перед вэ или икс, единица вычитается.', 'Этих трёх знаков достаточно, чтобы записать числа от одного до двадцати.', 'Основное значение знака сохраняется, а порядок показывает, как объединяются значения.'],
      ["Rim yozuvida i belgisi birni, ve belgisi beshni, iks belgisi o'nni bildiradi.", "i yoki iks belgisi takrorlansa, ularning qiymatlari qo'shiladi.", "i belgisi ve yoki iks belgisidan keyin tursa, bir qo'shiladi.", 'i belgisi ve yoki iks belgisidan oldin tursa, bir ayriladi.', "Shu uchta belgi yordamida birdan yigirmagacha bo'lgan sonlarni yozish mumkin.", "Belgining asosiy qiymati saqlanadi, tartib esa qiymatlar qanday birlashishini ko'rsatadi."],
      ['In Roman numerals, I represents one, V represents five, and X represents ten.', 'When I or X is repeated, the values are added.', 'When I comes after V or X, one is added.', 'When I comes before V or X, one is subtracted.', 'These three symbols are enough to write the numbers from one to twenty.', 'A symbol keeps its basic value, while the order shows how the values are combined.'],
    ),
  },
  s3: {
    eyebrow: B('Позиционная запись', 'Pozitsion yozuv', 'Positional notation'),
    title: B('Как позиция цифры 1 меняет её значение?', "1 raqamining pozitsiyasi uning qiymatini qanday o'zgartiradi?", 'How does the place of the digit 1 change its value?'),
    conclusion: B('Десятичная запись позиционная: значение цифры зависит от её позиции, то есть места.', "O'nlik yozuv pozitsion: raqam qiymati uning pozitsiyasiga, ya'ni o'rniga bog'liq.", 'Decimal notation is positional: the value of a digit depends on its place.'),
    audio: B(
      ['В числе четырнадцать цифра один стоит в десятках и означает десять.', 'Теперь переместим её в разряд единиц.', 'В этой позиции цифра один означает единицу.', 'Поэтому десятичная запись называется позиционной: значение цифры зависит от её позиции, то есть места.'],
      ["O'n to'rt sonida bir raqami o'nlar xonasida turib, o'nni bildiradi.", "Endi uni birlar xonasiga ko'chiramiz.", 'Bu pozitsiyada bir raqami birni bildiradi.', "Shuning uchun o'nlik yozuv pozitsion deyiladi: raqam qiymati uning pozitsiyasiga, ya'ni o'rniga bog'liq."],
      ['In the number fourteen, the digit one is in the tens place and represents ten.', 'Now let us move it to the ones place.', 'In this place, the digit one represents one.', 'This is why decimal notation is positional: the value of a digit depends on its place.'],
    ),
  },
  s4: {
    eyebrow: B('Исследуем порядок знаков', 'Belgilar tartibini tekshiramiz', 'Explore symbol order'),
    title: B('Что изменится, если переместить знак I перед V?', 'I belgisini V ning oldiga ko\'chirsangiz, nima o\'zgaradi?', 'What changes if the symbol I moves before V?'),
    conclusion: B('Знак сохраняет значение, а порядок меняет действие.', "Belgi qiymatini saqlaydi, tartib esa amalni o'zgartiradi.", 'The symbol keeps its value, but the order changes the operation.'),
    audio: B(
      ['В римской записи числа шесть знак и означает один и прибавляется к пяти.', 'Теперь переместим знак и перед знаком вэ.', 'Знак и по-прежнему означает один.', 'Но из-за нового порядка единица теперь вычитается из пяти.'],
      ["Olti sonining Rim yozuvida i belgisi birni bildiradi va beshga qo'shiladi.", 'Endi i belgisini ve belgisining oldiga ko\'chiramiz.', 'i belgisi hamon birni bildiradi.', "Lekin tartib o'zgargani uchun endi bir beshdan ayriladi."],
      ['In the Roman numeral for six, I represents one and is added to five.', 'Now let us move I before V.', 'The symbol I still represents one.', 'Because the order has changed, one is now subtracted from five.'],
    ),
  },
  s5: {
    eyebrow: B('Сравниваем системы', 'Tizimlarni taqqoslaymiz', 'Compare the systems'),
    title: B('Какую работу выполняет место в двух записях?', "Ikki yozuvda o'rin qanday vazifa bajaradi?", 'What does place do in the two notations?'),
    decimal: B('Значение цифры меняется', "Raqam qiymati o'zgaradi", "The digit's value changes"),
    roman: B('Значение знака сохраняется, действие меняется', "Belgi qiymati saqlanadi, amal o'zgaradi", "The symbol's value stays the same; the operation changes"),
    audio: B(
      ['В десятичной записи место изменило значение цифры.', 'В римской записи значение знака и не изменилось.', 'Порядок римских знаков показал сложение или вычитание.'],
      ["O'nlik yozuvda o'rin raqamning qiymatini o'zgartirdi.", "Rim yozuvida i belgisining qiymati o'zgarmadi.", "Rim yozuvida tartib qo'shish yoki ayirishni ko'rsatdi."],
      ["In decimal notation, the place changed the digit's value.", 'In the Roman numeral, the value of I did not change.', 'The order of the Roman symbols showed addition or subtraction.'],
    ),
  },
  s6: {
    eyebrow: B('Открываем названия', 'Nomlarni ochamiz', 'Discover the names'),
    title: B('У двух способов записи есть названия', 'Ikki yozuv usulining nomi bor', 'The two ways of writing numbers have names'),
    positional: B('Позиционная', 'Pozitsion', 'Positional'),
    nonpositional: B('Непозиционная', 'Nopozitsion', 'Non-positional'),
    pDef: B('Значение цифры зависит от места.', "Raqam qiymati o'rniga bog'liq.", 'The value of a digit depends on its place.'),
    nDef: B('Знак сохраняет основное значение.', 'Belgi asosiy qiymatini saqlaydi.', 'A symbol keeps its basic value.'),
    audio: B(
      ['Система, в которой значение цифры зависит от места, называется позиционной.', 'Система, в которой знак сохраняет основное значение, называется непозиционной.'],
      ["Raqam qiymati turgan o'rniga bog'liq bo'lgan tizim pozitsion deyiladi.", "Belgi o'z asosiy qiymatini saqlaydigan tizim nopozitsion deyiladi."],
      ['A system in which the value of a digit depends on its place is called positional.', 'A system in which a symbol keeps its basic value is called non-positional.'],
    ),
  },
  s7: {
    eyebrow: B('Стратегия чтения', "O'qish strategiyasi", 'Reading strategy'),
    title: B('Как читать две разные записи?', 'Ikki xil yozuvni qanday o\'qiymiz?', 'How do we read the two different notations?'),
    decimalMethod: B('Проверь разряды', 'Xonalarni tekshiring', 'Check the place values'),
    romanMethod: B('Проверь значения и порядок знаков', 'Belgilar qiymati va tartibni tekshiring', 'Check the values and order of the symbols'),
    conclusion: B('Порядок важен в обеих системах, но выполняет разные функции.', 'Tartib ikkala tizimda ham muhim, lekin uning vazifasi turlicha.', 'Order matters in both systems, but it has a different role in each one.'),
    audio: B(
      ['В десятичной записи проверяем разряды цифр.', 'В римской записи проверяем значения знаков и их порядок.', 'Порядок важен в обеих системах, но выполняет разные функции.'],
      ["O'nlik yozuvni o'qishda raqamlarning xonasini tekshiramiz.", "Rim yozuvini o'qishda belgilar qiymati va ularning tartibini tekshiramiz.", 'Tartib ikkala tizimda ham muhim, lekin uning vazifasi turlicha.'],
      ['In decimal notation, check the place value of each digit.', 'In Roman numerals, check the values and order of the symbols.', 'Order matters in both systems, but it has a different role in each one.'],
    ),
  },
  s8: {
    eyebrow: B('Проверка', 'Tekshiruv', 'Check'),
    title: B('Какая запись позиционная?', 'Qaysi yozuv pozitsion?', 'Which notation is positional?'),
    options: [B('14', '14', '14'), B('XIV', 'XIV', 'XIV'), B('В обеих', 'Ikkalasida ham', 'Both')],
    correct: 0,
    feedback: [
      B('В записи 14 цифра 1 стоит в десятках и означает 10.', "14 yozuvida 1 o'nlar xonasida turib, 10 ni bildiradi.", 'In 14, the digit 1 is in the tens place and represents 10.'),
      B('В римской записи знаки I, V и X сохраняют основные значения.', 'Rim yozuvida I, V va X belgilarining asosiy qiymati saqlanadi.', 'In Roman numerals, the symbols I, V and X keep their basic values.'),
      B('Порядок важен в обеих записях, но только в 14 значение цифры зависит от разряда.', 'Tartib ikkala yozuvda ham muhim, ammo faqat 14 da raqam qiymati xonaga bog\'liq.', 'Order matters in both notations, but only in 14 does the value of a digit depend on its place.'),
    ],
    feedbackAudio: B(
      ['В десятичной записи четырнадцать цифра один стоит в десятках и означает десять.', 'В римской записи знаки и, вэ и икс сохраняют основные значения.', 'Порядок важен в обеих записях, но только в десятичной записи значение цифры зависит от разряда.'],
      ["O'n to'rt yozuvida bir raqami o'nlar xonasida turib, o'nni bildiradi.", 'Rim yozuvida i, ve va iks belgilarining asosiy qiymati saqlanadi.', "Tartib ikkala yozuvda ham muhim, ammo faqat o'nlik yozuvda raqam qiymati xonaga bog'liq."],
      ['In the decimal notation for fourteen, the digit one is in the tens place and represents ten.', 'In Roman numerals, the symbols I, V and X keep their basic values.', 'Order matters in both notations, but only in decimal notation does the value of a digit depend on its place.'],
    ),
    audio: B(
      ['Сравни десятичную запись четырнадцати и запись из знаков икс, и, вэ.', 'Выбери позиционную запись.'],
      ["O'n to'rt va iks, i, ve yozuvlarini taqqoslang.", 'Qaysi yozuv pozitsion ekanini tanlang.'],
      ['Compare the decimal notation for fourteen with the Roman numeral X I V.', 'Choose the positional notation.'],
    ),
  },
  s9: {
    eyebrow: B('Соответствие', 'Moslashtirish', 'Matching'),
    title: B('Соедини римскую запись с числом', 'Rim yozuvini son bilan moslang', 'Match each Roman numeral to its number'),
    hint: B('I = 1 · V = 5 · X = 10', 'I = 1 · V = 5 · X = 10', 'I = 1 · V = 5 · X = 10'),
    audio: B(
      ['Знак и означает один, знак вэ означает пять, знак икс означает десять.', 'Соедини числа четыре, девять, четырнадцать и двадцать с равными им римскими записями.'],
      ["I belgisi birni, V belgisi beshni, X belgisi esa o'nni bildiradi.", "To'rt, to'qqiz, o'n to'rt va yigirma sonlarini ularga teng Rim yozuvlari bilan juftlang."],
      ['The symbol I represents one, V represents five, and X represents ten.', 'Match the numbers four, nine, fourteen and twenty to the Roman numerals with the same values.'],
    ),
  },
  s10: {
    eyebrow: B('Конструктор', 'Konstruktor', 'Builder'),
    title: B('Составь число 14 римскими знаками', '14 sonini Rim raqamlaridan foydalanib yasang', 'Build the number 14 with Roman symbols'),
    audio: B(
      ['Четырнадцать состоит из десяти и четырёх.', 'Размести нужные знаки в пустых ячейках.'],
      ["O'n to'rt o'n va to'rtga ajraladi.", "Kerakli belgilarni bo'sh joylarga joylashtiring."],
      ['Fourteen is made from ten and four.', 'Place the correct symbols in the empty boxes.'],
    ),
  },
  s11: {
    eyebrow: B('Классификация', 'Tasniflash', 'Classify'),
    title: B('Разделите записи на две системы', 'Yozuvlarni ikki sistemaga ajrating', 'Sort the notations into two systems'),
    positional: B('Позиционная', 'Pozitsion', 'Positional'),
    nonpositional: B('Непозиционная', 'Nopozitsion', 'Non-positional'),
    audio: B(
      ['В десятичной записи значение цифры зависит от разряда.', 'В римской записи знаки сохраняют основные значения.', 'Распредели десятичные записи двадцать четыре, семьсот семь и восемнадцать, а также римские записи шесть, двенадцать и девятнадцать по двум системам.'],
      ["O'nlik yozuvda raqam qiymati xonaga bog'liq.", 'Rim yozuvida belgilar asosiy qiymatini saqlaydi.', "Yigirma to'rt, yetti yuz yetti va o'n sakkiz o'nlik yozuvlarini hamda olti, o'n ikki va o'n to'qqiz Rim yozuvlarini ikki tizimga ajrating."],
      ['In decimal notation, the value of a digit depends on its place.', 'In Roman numerals, the symbols keep their basic values.', 'Sort the decimal notations for twenty-four, seven hundred and seven, and eighteen, and the Roman numerals for six, twelve and nineteen into the two systems.'],
    ),
  },
  s12: {
    eyebrow: B('Исправляем ошибку', 'Xatoni tuzatamiz', 'Fix the error'),
    title: B('Найди первую неверную мысль в решении Бита', "Bitning hisobida birinchi noto'g'ri fikrni toping", "Find the first incorrect idea in Bit's reasoning"),
    claim: B('В записи XIV знак I означает 10, потому что стоит после X.', 'XIV dagi I belgisi 10 ni bildiradi, chunki u X dan keyin turibdi.', 'In XIV, the symbol I represents 10 because it comes after X.'),
    options: [
      B('I всегда означает 1; он стоит перед V, поэтому вычитается.', 'I har doim 1 ni bildiradi; V dan oldin turgani uchun ayriladi.', 'I always represents 1; it comes before V, so it is subtracted.'),
      B('I здесь означает 10, а X означает 1.', 'I bu yerda 10 ni, X esa 1 ni bildiradi.', 'Here I represents 10 and X represents 1.'),
      B('I и V вместе означают 6.', 'I va V birgalikda 6 ni bildiradi.', 'Together, I and V represent 6.'),
    ],
    correct: 0,
    feedback: [
      B('Значение знака не изменилось. Порядок показал вычитание.', "Belgining qiymati o'zgarmadi. Faqat tartib ayirishni ko'rsatdi.", "The symbol's value did not change. The order showed subtraction."),
      B('Значения знаков не меняются: I означает 1, X означает 10.', 'I va X belgilarining qiymati almashmaydi: I birni, X o\'nni bildiradi.', 'The values of the symbols do not change: I represents 1 and X represents 10.'),
      B('Когда I стоит перед V, единица не прибавляется, а вычитается.', 'I V dan oldin turganda qo\'shilmaydi, ayriladi.', 'When I comes before V, one is subtracted rather than added.'),
    ],
    feedbackAudio: B(
      ['Значение знака не изменилось. Порядок показал вычитание.', 'Значения знаков не меняются. И означает один, икс означает десять.', 'Когда и стоит перед вэ, единица не прибавляется, а вычитается.'],
      ["Belgining qiymati o'zgarmadi. Faqat tartib ayirishni ko'rsatdi.", "I va iks belgilarining qiymati almashmaydi. I birni, iks o'nni bildiradi.", "I ve dan oldin turganda qo'shilmaydi, ayriladi."],
      ["The symbol's value did not change. The order showed subtraction.", 'The values of the symbols do not change. I represents one and X represents ten.', 'When I comes before V, one is subtracted rather than added.'],
    ),
    audio: B(
      ['Найди первую неверную мысль в решении Бита.', 'Знак икс означает десять, а знак и означает один.', 'Знак и стоит перед вэ, поэтому единица вычитается из пяти.'],
      ["Bitning hisobida birinchi noto'g'ri fikrni toping.", "Iks belgisi o'nni, i belgisi esa birni bildiradi.", 'i belgisi ve dan oldin turgani uchun bir beshdan ayriladi.'],
      ["Find the first incorrect idea in Bit's reasoning.", 'The symbol X represents ten, while I represents one.', 'The symbol I comes before V, so one is subtracted from five.'],
    ),
  },
  s13: {
    eyebrow: B('Перенос в новую ситуацию', "Yangi vaziyatga ko'chirish", 'Apply the idea'),
    title: B('Как проверить два кода?', 'Ikki kodni qanday tekshirasiz?', 'How can you check the two codes?'),
    methods: [
      B('Разложить по разрядам', 'Xonalarga ajratish', 'Split into place values'),
      B('Проверить значения и порядок знаков', 'Belgilar qiymati va tartibni tekshirish', 'Check the values and order of the symbols'),
    ],
    audio: B(
      ['Эти два кода читаются разными способами.', 'Подбери способ проверки для каждого кода.'],
      ["Bu ikki kod bir xil usulda o'qilmaydi.", 'Har bir kodga mos tekshirish usulini joylashtiring.'],
      ['These two codes are read in different ways.', 'Choose the correct checking method for each code.'],
    ),
  },
  s14: {
    eyebrow: B('Финальная миссия', "Yakuniy missiya", 'Final mission'),
    title: B('Теперь две системы не перепутаются', "Endi ikki tizim chalkashmaydi", 'Now the two systems will not be confused'),
    points: [
      B('Позиционная: значение цифры зависит от места.', "Pozitsion: raqam qiymati o'rniga bog'liq.", 'Positional: the value of a digit depends on its place.'),
      B('Непозиционная: знак сохраняет основное значение.', "Nopozitsion: belgi asosiy qiymatini saqlaydi.", 'Non-positional: a symbol keeps its basic value.'),
      B('В римской записи порядок показывает сложение или вычитание.', "Rim yozuvida tartib qo'shish yoki ayirishni ko'rsatadi.", 'In Roman numerals, the order shows addition or subtraction.'),
      B('Бит правильно узнал знак в начале: I = 1.', "Bit boshidagi belgini to'g'ri tanidi: I = 1.", 'Bit identified the symbol correctly at the start: I = 1.'),
    ],
    bridge: B('Сложение и вычитание многозначных чисел', "Ko'p xonali sonlarni qo'shish va ayirish", 'Adding and subtracting multi-digit numbers'),
    audio: B(
      ['Десятичная запись является позиционной системой.', 'Римская запись служит примером непозиционной системы.', 'Теперь ты различаешь роль места цифры и порядок знаков.', 'Бит правильно узнал знак в начале урока. Знак и означает один.'],
      ["O'nlik yozuv pozitsion tizimdir.", "Rim yozuvi nopozitsion tizimga misol bo'ladi.", "Endi siz raqamning o'rni bilan belgilar tartibining vazifasini farqlay olasiz.", "Bit dars boshidagi belgini to'g'ri tanidi. i belgisi birni bildiradi."],
      ['Decimal notation is a positional system.', 'Roman numerals are an example of a non-positional system.', 'You can now distinguish the role of a digit\'s place from the role of symbol order.', 'Bit identified the symbol correctly at the start of the lesson. The symbol I represents one.'],
    ),
  },
};

const SCREEN_META = [
  { id: 's0', sourceId: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', sourceId: 's3', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's2', sourceId: 's8', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's3', sourceId: 's1', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's4', sourceId: 's9', type: 'test', template: 'custom', scored: true, scope: 'module-mikro' },
  { id: 's5', sourceId: 's2', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's6', sourceId: 's10', type: 'test', template: 'custom', scored: true, scope: 'module-mikro' },
  { id: 's7', sourceId: 's6', type: 'rule', template: 'custom', scored: false, scope: null },
  { id: 's8', sourceId: 's11', type: 'test', template: 'custom', scored: true, scope: 'module-mikro' },
  { id: 's9', sourceId: 's4', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's10', sourceId: 's12', type: 'case', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's11', sourceId: 's7', type: 'rule', template: 'custom', scored: false, scope: null },
  { id: 's12', sourceId: 's13', type: 'test', template: 'custom', scored: true, scope: 'final' },
  { id: 's13', sourceId: 's5', type: 'consolidation', template: 'custom', scored: false, scope: null },
  { id: 's14', sourceId: 's14', type: 'summary', template: 'custom', scored: false, scope: null },
];

const TOTAL_SCREENS = 15;
const MOBILE_DESIGN_W = 390;
const LESSON_META = {
  lessonId: 'num-4-07-v1',
  slug: 'dars07-pozitsion-va-nopozitsion-sanoq-sistemalari',
  lessonTitle: B('Урок 7. Позиционные и непозиционные системы счисления', '7-dars. Pozitsion va nopozitsion sanoq sistemalari', 'Lesson 7. Positional and non-positional numeral systems'),
  skillTags: ['roman_1_20', 'positional_system', 'nonpositional_system', 'system_comparison'],
};

let runtimeConfig = {
  ttsApiBase: '', correctSoundUrl: '', wrongSoundUrl: '', studentName: '', voiceGender: 'f',
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
  return [{ ...baseAudio, replay }, Number.isFinite(narratedBeat) ? narratedBeat : timedBeat];
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

const NavNext = ({ onClick, finish = false }) => {
  const t = useT();
  return (
    <button type="button" className="btn btn-white-accent btn-ready" onClick={onClick}>
      {t(finish ? CONTENT.common.finish : CONTENT.common.next)} <span aria-hidden="true">{finish ? '✓' : '→'}</span>
    </button>
  );
};

const FeedbackBlock = ({ show, correct, children }) => {
  if (!show) return null;
  return (
    <div className={`feedback ${correct ? 'feedback-correct' : 'feedback-wrong'}`} role="status">
      <div className="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'} /></div>
      <div className="feedback-copy"><strong>{correct ? '✓' : '↺'}</strong><div>{children}</div></div>
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

const RomanGalleryIllustration = ({ beat }) => (
  <div className={`roman-gallery-illustration gallery-beat-${Math.min(beat, 3)}`} aria-hidden="true">
    <SceneBit state={beat >= 2 ? 'idea' : 'point'} className="roman-gallery-bit" />
    <svg viewBox="0 0 520 116" role="presentation">
      <defs>
        <linearGradient id="g4RomanWall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#173B52" />
          <stop offset="100%" stopColor="#0C2535" />
        </linearGradient>
      </defs>
      <path d="M18 103V24c0-8 6-14 14-14h456c8 0 14 6 14 14v79" fill="url(#g4RomanWall)" />
      <path d="M18 103h484" stroke="#5BD6F2" strokeOpacity=".28" strokeWidth="3" />
      {[82, 228, 374].map((x, index) => (
        <g key={x} className={`roman-arch roman-arch-${index}`}>
          <path d={`M${x} 98V54c0-25 20-42 42-42s42 17 42 42v44`} fill="#F5F5F0" fillOpacity=".08" stroke="#5BD6F2" strokeOpacity=".28" strokeWidth="2" />
          <rect x={x + 14} y="70" width="56" height="27" rx="8" fill={index === 1 ? '#FFF0EA' : '#E5F5F6'} />
          <text x={x + 42} y="91" textAnchor="middle" fill={index === 1 ? '#FF5B35' : '#173B52'} fontFamily="Source Serif 4, serif" fontSize="25" fontWeight="800">
            {['I', 'V', 'X'][index]}
          </text>
          <circle cx={x + 42} cy="47" r="5" fill={index === 1 ? '#FF5B35' : '#95C93D'} />
        </g>
      ))}
      <path className="gallery-scan" d="M65 64H455" stroke="#5BD6F2" strokeWidth="2" strokeDasharray="7 9" strokeLinecap="round" />
    </svg>
  </div>
);

const PlaceValueCityIllustration = ({ moved }) => (
  <div className={`place-value-city ${moved ? 'place-value-city-moved' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 520 105" role="presentation">
      <path d="M20 91H500" stroke="#173B52" strokeOpacity=".16" strokeWidth="3" strokeLinecap="round" />
      <g className="city-tens">
        <rect x="74" y="20" width="112" height="71" rx="14" fill="#FFF0EA" stroke="#FF5B35" strokeOpacity=".35" strokeWidth="2" />
        {Array.from({ length: 10 }, (_, index) => <rect key={index} x={92 + (index % 2) * 39} y={27 + Math.floor(index / 2) * 12} width="20" height="8" rx="3" fill="#FF5B35" fillOpacity=".55" />)}
        <path d="M68 20h124L174 7H86z" fill="#FF5B35" fillOpacity=".22" />
      </g>
      <g className="city-ones">
        <rect x="337" y="52" width="94" height="39" rx="13" fill="#E5F5F6" stroke="#168FA3" strokeOpacity=".4" strokeWidth="2" />
        <rect x="370" y="65" width="28" height="26" rx="6" fill="#168FA3" fillOpacity=".55" />
        <path d="M328 52h112l-18-13h-76z" fill="#168FA3" fillOpacity=".2" />
      </g>
      <path className="city-route" d="M191 56C240 17 283 17 330 57" fill="none" stroke="#95C93D" strokeWidth="4" strokeLinecap="round" strokeDasharray="7 8" />
      <path className="city-route-arrow" d="M321 48l12 10-15 5" fill="none" stroke="#95C93D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="city-signal city-signal-one" cx={moved ? 329 : 193} cy="57" r="7" fill="#FF5B35" />
      <circle className="city-signal city-signal-four" cx={moved ? 193 : 329} cy="57" r="7" fill="#168FA3" />
    </svg>
    <SceneBit state={moved ? 'nod' : 'focus'} className="place-value-bit" />
  </div>
);

const SystemRouteIllustration = ({ beat }) => (
  <div className={`system-route-illustration route-beat-${beat}`} aria-hidden="true">
    <svg viewBox="0 0 520 82" role="presentation">
      <rect x="36" y="19" width="118" height="44" rx="16" fill="#FFF0EA" />
      <rect x="366" y="19" width="118" height="44" rx="16" fill="#E5F5F6" />
      <path d="M154 41H366" stroke="#173B52" strokeOpacity=".16" strokeWidth="7" strokeLinecap="round" />
      <path className="route-orange" d="M154 41H250" stroke="#FF5B35" strokeWidth="7" strokeLinecap="round" />
      <path className="route-cyan" d="M270 41H366" stroke="#168FA3" strokeWidth="7" strokeLinecap="round" />
      <circle cx="260" cy="41" r="13" fill="#FFFFFF" stroke="#95C93D" strokeWidth="5" />
      <circle cx="260" cy="41" r="4" fill="#95C93D" />
      <g fill="#173B52" fillOpacity=".5">
        <circle cx="75" cy="41" r="5" /><circle cx="95" cy="41" r="5" /><circle cx="115" cy="41" r="5" />
      </g>
      <path d="M402 48l9-14 9 14 9-14 9 14" fill="none" stroke="#168FA3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <SceneBit state={beat >= 1 ? 'idea' : 'think'} className="system-route-bit" />
  </div>
);

const StrategyScannerIllustration = ({ beat }) => (
  <div className={`strategy-scanner scanner-beat-${beat}`} aria-hidden="true">
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

const Stage = ({ screen, eyebrow, title, audio, children, onPrev, onNext, finish = false }) => {
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
        <div className="stage-happy-bit" aria-label={t(B('Bit улыбается', 'Bit xursand', 'Bit is smiling'))}><BitSVG state="happy" /></div>
        {title && <h1>{t(title)}</h1>}
        {children}
      </section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>
        <NavBack onClick={onPrev} hidden={screen === 0} />
        <NavNext onClick={onNext} finish={finish} />
      </footer>
    </main>
  );
};

const TheoryStage = ({ screen, contentScreen = screen, children, onPrev, onNext, beatCount, interval }) => {
  const c = CONTENT[`s${contentScreen}`];
  const t = useT();
  const [audio, beat] = useNarratedSequence(screen, c.audio, beatCount, interval);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} title={c.title} audio={audio} onPrev={onPrev} onNext={onNext}>
      {children({ beat, audio, t })}
    </Stage>
  );
};

const Screen0 = ({ screen, onPrev, onNext }) => {
  const c = CONTENT.s0;
  const t = useT();
  const [picked, setPicked] = useState(null);
  const [audio] = useNarratedSequence(screen, c.audio, 3, 1250);
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} title={c.title} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="hook-scene">
        <div className="hook-bit"><BitSVG state={picked === null ? 'present' : 'idea'} /></div>
        <div className="hook-terminal" aria-label="I"><span>I</span><i /></div>
      </div>
      <div className="choice-grid choice-grid-two">
        {c.options.map((option, index) => (
          <button
            type="button"
            key={index}
            className={`choice-card ${picked === index ? 'choice-picked' : ''}`}
            aria-pressed={picked === index}
            onClick={() => setPicked(index)}
          >
            <span className="choice-letter">{String.fromCharCode(65 + index)}</span>
            <span>{t(option)}</span>
          </button>
        ))}
      </div>
      {picked !== null && <div className="hook-after" role="status">{t(c.after)}</div>}
    </Stage>
  );
};

const Screen1 = (props) => (
  <TheoryStage {...props} screen={props.screen} contentScreen={1} beatCount={4} interval={1050}>
    {({ beat, t }) => {
      const c = CONTENT.s1;
      const numbers = ['4', '9', '14', '20'];
      const active = Math.min(beat, numbers.length - 1);
      return (
        <div className="recall-layout">
          <SceneBit state={beat >= 3 ? 'nod' : 'wave'} className="recall-bit" />
          <div className="number-row" aria-label="4, 9, 14, 20">
            {numbers.map((number, index) => (
              <span key={number} className={`number-chip ${active === index ? 'number-speaking' : ''}`}>{number}</span>
            ))}
          </div>
          <p className={`system-caption ${beat >= 1 ? 'reveal-visible' : ''}`}>{t(c.caption)}</p>
          <div className={`roman-preview ${beat >= 1 ? 'reveal-visible' : ''}`}>
            <span>IV</span><span>IX</span><span>XIV</span><span>XX</span>
          </div>
          <p className={`bridge-line ${beat >= 2 ? 'reveal-visible' : ''}`}>{t(c.bridge)}</p>
        </div>
      );
    }}
  </TheoryStage>
);

const ROMAN_ROWS = [
  ['I', 'IV', 'V', 'IX'],
  ['X', 'XIV', 'XIX', 'XX'],
];

const Screen2 = (props) => (
  <TheoryStage {...props} screen={props.screen} contentScreen={2} beatCount={6} interval={1050}>
    {({ beat, t }) => {
      const c = CONTENT.s2;
      return (
        <div className="roman-board">
          <RomanGalleryIllustration beat={beat} />
          <div className="anchor-row">
            {['I = 1', 'V = 5', 'X = 10'].map((item, index) => (
              <div key={item} className={`anchor-card ${beat === 0 || beat === index ? 'anchor-active' : ''}`}>{item}</div>
            ))}
          </div>
          <div className="roman-table">
            {ROMAN_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className={`roman-row ${beat >= Math.min(rowIndex + 1, 4) ? 'roman-row-visible' : ''}`}>
                {row.map((value) => <span key={value} className={['IV', 'IX', 'XIV', 'XIX'].includes(value) ? 'roman-subtract' : ''}>{value}</span>)}
              </div>
            ))}
          </div>
          <div className={`rule-strip ${beat >= 4 ? 'reveal-visible' : ''}`}>{t(c.rule)}</div>
          <div className={`bridge-line ${beat >= 5 ? 'reveal-visible' : ''}`}>{t(c.bridge)}</div>
        </div>
      );
    }}
  </TheoryStage>
);

const DecimalSwap = ({ moved, onToggle }) => {
  const t = useT();
  return (
  <button type="button" className="swap-scene" onClick={onToggle} aria-label={t(B('14 и 41', '14 va 41', '14 and 41'))}>
    <div className="place-labels"><span>10</span><span>1</span></div>
    <div className={`digit-track ${moved ? 'digit-track-moved' : ''}`}>
      <span className="digit digit-one">1<small>{moved ? '1' : '10'}</small></span>
      <span className="digit digit-four">4<small>{moved ? '40' : '4'}</small></span>
    </div>
    <strong>{moved ? '41' : '14'}</strong>
  </button>
  );
};

const Screen3 = (props) => {
  const c = CONTENT.s3;
  const t = useT();
  const [manual, setManual] = useState(null);
  return (
    <TheoryStage {...props} screen={props.screen} contentScreen={3} beatCount={4} interval={1200}>
      {({ beat }) => {
        const moved = manual ?? beat >= 1;
        return (
          <div className="single-model-layout">
            <PlaceValueCityIllustration moved={moved} />
            <DecimalSwap moved={moved} onToggle={() => setManual((value) => !(value ?? moved))} />
            <div className={`conclusion-band ${beat >= 3 ? 'reveal-visible' : ''}`}>{t(c.conclusion)}</div>
          </div>
        );
      }}
    </TheoryStage>
  );
};

const RomanSwap = ({ moved, onToggle }) => {
  const t = useT();
  return (
  <button type="button" className="swap-scene roman-swap" onClick={onToggle} aria-label={t(B('VI и IV', 'VI va IV', 'VI and IV'))}>
    <div className={`roman-token-track ${moved ? 'roman-token-moved' : ''}`}>
      <span className="roman-v">V<small>5</small></span>
      <span className="roman-i">I<small>1</small></span>
    </div>
    <div className="operation-arc">{moved ? '5 − 1' : '5 + 1'}</div>
    <strong>{moved ? 'IV = 4' : 'VI = 6'}</strong>
  </button>
  );
};

const Screen4 = (props) => {
  const c = CONTENT.s4;
  const t = useT();
  const [manual, setManual] = useState(null);
  return (
    <TheoryStage {...props} screen={props.screen} contentScreen={4} beatCount={4} interval={1200}>
      {({ beat }) => {
        const moved = manual ?? beat >= 1;
        return (
          <div className="single-model-layout">
            <RomanSwap moved={moved} onToggle={() => setManual((value) => !(value ?? moved))} />
            <div className={`conclusion-band ${beat >= 3 ? 'reveal-visible' : ''}`}>{t(c.conclusion)}</div>
          </div>
        );
      }}
    </TheoryStage>
  );
};

const Screen5 = (props) => (
  <TheoryStage {...props} screen={props.screen} contentScreen={5} beatCount={3} interval={1350}>
    {({ beat, t }) => {
      const c = CONTENT.s5;
      return (
        <div className="comparison-layout">
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

const Screen6 = (props) => (
  <TheoryStage {...props} screen={props.screen} contentScreen={6} beatCount={2} interval={1550}>
    {({ beat, t }) => {
      const c = CONTENT.s6;
      return (
        <div className="system-zone-layout">
          <SystemRouteIllustration beat={beat} />
          <div className="system-zones">
            <section className={`system-zone positional-zone ${beat >= 0 ? 'zone-active' : ''}`}>
              <span className="zone-example">14 ↔ 41</span>
              <h2>{t(c.positional)}</h2>
              <p>{t(c.pDef)}</p>
            </section>
            <section className={`system-zone nonpositional-zone ${beat >= 1 ? 'zone-active' : ''}`}>
              <span className="zone-example">VI ↔ IV</span>
              <h2>{t(c.nonpositional)}</h2>
              <p>{t(c.nDef)}</p>
            </section>
          </div>
        </div>
      );
    }}
  </TheoryStage>
);

const Screen7 = (props) => (
  <TheoryStage {...props} screen={props.screen} contentScreen={7} beatCount={3} interval={1350}>
    {({ beat, t }) => {
      const c = CONTENT.s7;
      return (
        <div className="strategy-layout">
          <StrategyScannerIllustration beat={beat} />
          <section className={`strategy-column ${beat >= 0 ? 'strategy-active' : ''}`}>
            <strong>14</strong><span>{t(c.decimalMethod)}</span><em>14 = 1 × 10 + 4</em>
          </section>
          <section className={`strategy-column ${beat >= 1 ? 'strategy-active' : ''}`}>
            <strong>XIV</strong><span>{t(c.romanMethod)}</span><em>XIV = X + IV = 14</em>
          </section>
          <div className={`conclusion-band strategy-conclusion ${beat >= 2 ? 'reveal-visible' : ''}`}>{t(c.conclusion)}</div>
        </div>
      );
    }}
  </TheoryStage>
);

const ChoicePractice = ({ screen, contentScreen = screen, storedAnswer, onAnswer, onPrev, onNext, extra }) => {
  const c = CONTENT[`s${contentScreen}`];
  const t = useT();
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [audio] = useNarratedSequence(screen, c.audio, Array.isArray(t(c.audio)) ? t(c.audio).length : 1, 1200);
  const correct = picked === c.correct;

  const choose = (index) => {
    if (correct) return;
    const nextAttempts = attempts + 1;
    const isCorrect = index === c.correct;
    setAttempts(nextAttempts);
    setPicked(index);
    playSfx(isCorrect ? 'correct' : 'wrong');
    const audioLines = t(c.feedbackAudio);
    audio.pushOneOff(Array.isArray(audioLines) ? audioLines[index] : audioLines);
    onAnswer({
      stage: 'final', screenIdx: screen, question: t(c.title),
      options: c.options.map((option) => t(option)), correctIndex: c.correct,
      correctAnswer: t(c.options[c.correct]), studentAnswerIndex: index,
      studentAnswer: t(c.options[index]), correct: isCorrect,
      firstTry: isCorrect && nextAttempts === 1, attempts: nextAttempts,
    });
  };

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} title={c.title} audio={audio} onPrev={onPrev} onNext={onNext}>
      {extra}
      <div className="choice-grid">
        {c.options.map((option, index) => (
          <button
            type="button"
            key={index}
            className={`choice-card ${picked === index ? 'choice-picked' : ''} ${picked === index && correct ? 'choice-correct' : ''}`}
            aria-pressed={picked === index}
            onClick={() => choose(index)}
          >
            <span className="choice-letter">{String.fromCharCode(65 + index)}</span><span>{t(option)}</span>
          </button>
        ))}
      </div>
      <FeedbackBlock show={picked !== null} correct={correct}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock>
    </Stage>
  );
};

const Screen8 = (props) => <ChoicePractice {...props} screen={props.screen} contentScreen={8} />;

const MATCH_PAIRS = { 4: 'IV', 9: 'IX', 14: 'XIV', 20: 'XX' };
const Screen9 = ({ screen, storedAnswer, onAnswer, onPrev, onNext }) => {
  const c = CONTENT.s9;
  const t = useT();
  const [audio] = useNarratedSequence(screen, c.audio, 1);
  const [selected, setSelected] = useState(null);
  const [pairs, setPairs] = useState(storedAnswer?.pairs ?? {});
  const [message, setMessage] = useState(storedAnswer?.message ?? '');
  const [lastCorrect, setLastCorrect] = useState(storedAnswer?.correct ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);

  const match = (roman, decimalValue = selected) => {
    if (decimalValue === null || pairs[decimalValue]) return;
    const isCorrect = MATCH_PAIRS[decimalValue] === roman;
    if (isCorrect) {
      const nextPairs = { ...pairs, [decimalValue]: roman };
      const complete = Object.keys(nextPairs).length === 4;
      setPairs(nextPairs);
      setSelected(null);
      setLastCorrect(true);
      setMessage(decimalValue === 4
        ? t(B('В IV знак I стоит перед V, поэтому единица вычитается.', 'IV da I V dan oldin, shuning uchun 1 ayriladi.', 'In IV, I comes before V, so one is subtracted.'))
        : decimalValue === 9
        ? t(B('В IX знак I стоит перед X, поэтому единица вычитается.', 'IX da I X dan oldin, shuning uchun 1 ayriladi.', 'In IX, I comes before X, so one is subtracted.'))
        : t(B('Пара составлена верно.', "Juftlik to'g'ri tuzildi.", 'The pair is correct.')));
      playSfx('correct');
      if (complete) {
        audio.pushOneOff(t(B('Все четыре пары составлены верно.', "To'rtta juftlik ham to'g'ri tuzildi.", 'All four pairs are correct.')));
        onAnswer({ stage: 'final', screenIdx: screen, question: t(c.title), options: null,
          correctIndex: null, correctAnswer: '4–IV; 9–IX; 14–XIV; 20–XX',
          studentAnswerIndex: null, studentAnswer: JSON.stringify(nextPairs), correct: true,
          firstTry: attemptsRef.current === 0, attempts: attemptsRef.current + 1,
          pairs: nextPairs, message: t(B('Все пары готовы.', 'Barcha juftliklar tayyor.', 'All the pairs are complete.')) });
      }
    } else {
      attemptsRef.current += 1;
      setLastCorrect(false);
      setMessage(t(c.hint));
      playSfx('wrong');
      audio.pushOneOff(t(B('Проверь значения знаков и их порядок.', 'Belgilar qiymati va tartibini tekshiring.', 'Check the values and order of the symbols.')));
      onAnswer({ stage: 'final', screenIdx: screen, question: t(c.title), options: null,
        correctIndex: null, correctAnswer: '4–IV; 9–IX; 14–XIV; 20–XX',
        studentAnswerIndex: null, studentAnswer: `${decimalValue}–${roman}`, correct: false,
        firstTry: false, attempts: attemptsRef.current, pairs, message: t(c.hint) });
    }
  };

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} title={c.title} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="matching-board">
        <div className="matching-column">
          {[4, 9, 14, 20].map((value) => (
            <button
              type="button" draggable={!pairs[value]} key={value}
              className={`match-card ${selected === value ? 'match-selected' : ''} ${pairs[value] ? 'match-done' : ''}`}
              onDragStart={(event) => event.dataTransfer.setData('text/plain', String(value))}
              onClick={() => !pairs[value] && setSelected(value)}
            >{value}{pairs[value] && <small>→ {pairs[value]}</small>}</button>
          ))}
        </div>
        <div className="match-lines" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="matching-column">
          {['XIV', 'XX', 'IV', 'IX'].map((roman) => (
            <button
              type="button" key={roman} className="match-card roman-match"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => match(roman, Number(event.dataTransfer.getData('text/plain')))}
              onClick={() => match(roman)}
            >{roman}</button>
          ))}
        </div>
      </div>
      <FeedbackBlock show={Boolean(message)} correct={lastCorrect === true}>{message}</FeedbackBlock>
    </Stage>
  );
};

const SOURCE_SYMBOLS = [
  { id: 'x0', value: 'X' }, { id: 'i0', value: 'I' }, { id: 'v0', value: 'V' },
  { id: 'i1', value: 'I' }, { id: 'x1', value: 'X' },
];
const Screen10 = ({ screen, storedAnswer, onAnswer, onPrev, onNext }) => {
  const c = CONTENT.s10;
  const t = useT();
  const [audio] = useNarratedSequence(screen, c.audio, 2, 1300);
  const [slots, setSlots] = useState(storedAnswer?.slots ?? [null, null, null]);
  const [message, setMessage] = useState(storedAnswer?.message ?? '');
  const [correct, setCorrect] = useState(storedAnswer?.correct ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);

  const place = (id, index = slots.findIndex((slot) => slot === null)) => {
    if (correct || index < 0 || slots.includes(id)) return;
    const next = [...slots];
    next[index] = id;
    setSlots(next);
    setMessage('');
    setCorrect(null);
  };
  const remove = (index) => {
    if (correct) return;
    const next = [...slots];
    next[index] = null;
    setSlots(next);
    setMessage('');
  };
  const check = () => {
    const value = slots.map((id) => SOURCE_SYMBOLS.find((item) => item.id === id)?.value ?? '').join('');
    const isCorrect = value === 'XIV';
    attemptsRef.current += 1;
    setCorrect(isCorrect);
    let nextMessage;
    if (isCorrect) nextMessage = t(B('XIV состоит из X и пары IV: десять и четыре.', "XIV X va IV juftligidan, ya'ni o'n va to'rtdan tuzilgan.", 'XIV is made from X and the pair IV: ten and four.'));
    else if (value === 'XVI') nextMessage = t(B('I осталось после V, поэтому единица прибавляется.', "I V dan keyin qolib ketdi; bu holda u qo'shiladi.", 'I is still after V, so one is added.'));
    else if (value === 'IXV') nextMessage = t(B('Разложи 14 на 10 и 4; проверь порядок знаков во второй части.', '14 ni 10 va 4 ga ajrating; ikkinchi qismdagi belgilar tartibini tekshiring.', 'Split 14 into 10 and 4, then check the symbol order in the second part.'));
    else if (value === 'XXI') nextMessage = t(B('Два знака X означают двадцать; для 14 достаточно одного X.', 'Ikki X yigirmani bildiradi; 14 uchun bitta X yetadi.', 'Two X symbols represent twenty; one X is enough for 14.'));
    else nextMessage = t(B('Сначала нужен знак десяти, затем пара для четырёх.', "Avval o'nni bildiradigan belgi, keyin to'rtni bildiradigan juftlik kerak.", 'First use the symbol for ten, then the pair for four.'));
    setMessage(nextMessage);
    playSfx(isCorrect ? 'correct' : 'wrong');
    audio.pushOneOff(isCorrect
      ? t(B('Верно. Икс, и и вэ образуют четырнадцать.', "To'g'ri. Iks, i va ve o'n to'rtni hosil qiladi.", 'Correct. X, I and V make fourteen.'))
      : t(B('Разложи четырнадцать на десять и четыре и проверь порядок знаков.', "O'n to'rtni o'n va to'rtga ajratib, belgilar tartibini tekshiring.", 'Split fourteen into ten and four, then check the order of the symbols.')));
    onAnswer({ stage: 'final', screenIdx: screen, question: t(c.title), options: null,
      correctIndex: null, correctAnswer: 'XIV', studentAnswerIndex: null,
      studentAnswer: value, correct: isCorrect, firstTry: isCorrect && attemptsRef.current === 1,
      attempts: attemptsRef.current, slots, message: nextMessage });
  };

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} title={c.title} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="constructor-scene">
        <div className="slot-row">
          {slots.map((id, index) => {
            const symbol = SOURCE_SYMBOLS.find((item) => item.id === id)?.value;
            return (
              <button
                type="button" key={index} className={`symbol-slot ${symbol ? 'slot-filled' : ''}`}
                onClick={() => remove(index)} onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => place(event.dataTransfer.getData('text/plain'), index)}
                aria-label={symbol || t(B(`Ячейка ${index + 1}`, `${index + 1}-katak`, `Slot ${index + 1}`))}
              >{symbol || '□'}</button>
            );
          })}
        </div>
        <div className="source-cards">
          {SOURCE_SYMBOLS.map((item) => (
            <button
              type="button" draggable={!slots.includes(item.id)} key={item.id}
              disabled={slots.includes(item.id)} className="source-symbol"
              onDragStart={(event) => event.dataTransfer.setData('text/plain', item.id)}
              onClick={() => place(item.id)}
            >{item.value}</button>
          ))}
        </div>
        <div className="local-action-row"><button type="button" className="btn btn-white-accent btn-check" disabled={slots.some((slot) => !slot)} onClick={check}>{t(CONTENT.common.check)}</button></div>
      </div>
      <FeedbackBlock show={Boolean(message)} correct={correct === true}>{message}</FeedbackBlock>
    </Stage>
  );
};

const CLASSIFY_CARDS = [
  { id: '24', value: '24', bin: 'p' }, { id: '707', value: '707', bin: 'p' },
  { id: '18', value: '18', bin: 'p' }, { id: 'VI', value: 'VI', bin: 'n' },
  { id: 'XII', value: 'XII', bin: 'n' }, { id: 'XIX', value: 'XIX', bin: 'n' },
];
const Screen11 = ({ screen, storedAnswer, onAnswer, onPrev, onNext }) => {
  const c = CONTENT.s11;
  const t = useT();
  const [audio] = useNarratedSequence(screen, c.audio, 1);
  const [selected, setSelected] = useState(null);
  const [placed, setPlaced] = useState(storedAnswer?.placed ?? {});
  const [message, setMessage] = useState(storedAnswer?.message ?? '');
  const [lastCorrect, setLastCorrect] = useState(storedAnswer?.correct ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);

  const put = (bin, id = selected) => {
    if (!id || placed[id]) return;
    const card = CLASSIFY_CARDS.find((item) => item.id === id);
    const isCorrect = card.bin === bin;
    if (!isCorrect) {
      attemptsRef.current += 1;
      setLastCorrect(false);
      const nextMessage = bin === 'n'
        ? t(B('Это десятичная запись; значение цифры зависит от разряда.', "Bu o'nlik yozuv; raqam qiymati xonasiga bog'liq.", 'This is decimal notation; the value of a digit depends on its place.'))
        : t(B('Это римская запись; знаки сохраняют основные значения.', 'Bu Rim yozuvi; belgilar asosiy qiymatini saqlaydi.', 'This is a Roman numeral; the symbols keep their basic values.'));
      setMessage(nextMessage);
      setSelected(null);
      playSfx('wrong');
      audio.pushOneOff(nextMessage);
      onAnswer({ stage: 'final', screenIdx: screen, question: t(c.title), options: null,
        correctIndex: null, correctAnswer: '24, 707, 18 / VI, XII, XIX',
        studentAnswerIndex: null, studentAnswer: `${id}:${bin}`, correct: false,
        firstTry: false, attempts: attemptsRef.current, placed, message: nextMessage });
      return;
    }
    const nextPlaced = { ...placed, [id]: bin };
    const complete = Object.keys(nextPlaced).length === CLASSIFY_CARDS.length;
    setPlaced(nextPlaced);
    setSelected(null);
    setLastCorrect(true);
    setMessage(t(B('Запись помещена верно.', "Yozuv to'g'ri joylashtirildi.", 'The notation is in the correct group.')));
    playSfx('correct');
    if (complete) {
      audio.pushOneOff(t(B('Все записи распределены верно.', "Barcha yozuvlar to'g'ri ajratildi.", 'All the notations have been sorted correctly.')));
      onAnswer({ stage: 'final', screenIdx: screen, question: t(c.title), options: null,
        correctIndex: null, correctAnswer: '24, 707, 18 / VI, XII, XIX',
        studentAnswerIndex: null, studentAnswer: JSON.stringify(nextPlaced), correct: true,
        firstTry: attemptsRef.current === 0, attempts: attemptsRef.current + 1,
        placed: nextPlaced, message: t(B('Все записи готовы.', 'Barcha yozuvlar tayyor.', 'All the notations are complete.')) });
    }
  };

  const bin = (key, label) => (
    <button
      type="button" className={`class-bin class-bin-${key}`}
      onClick={() => put(key)} onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => put(key, event.dataTransfer.getData('text/plain'))}
    >
      <strong>{label}</strong>
      <span>{CLASSIFY_CARDS.filter((card) => placed[card.id] === key).map((card) => <i key={card.id}>{card.value}</i>)}</span>
    </button>
  );

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} title={c.title} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="classification-scene">
        <div className="class-source">
          {CLASSIFY_CARDS.filter((card) => !placed[card.id]).map((card) => (
            <button type="button" draggable key={card.id} className={`class-card ${selected === card.id ? 'class-selected' : ''}`}
              onDragStart={(event) => event.dataTransfer.setData('text/plain', card.id)} onClick={() => setSelected(card.id)}>{card.value}</button>
          ))}
        </div>
        <div className="class-bins">{bin('p', t(c.positional))}{bin('n', t(c.nonpositional))}</div>
      </div>
      <FeedbackBlock show={Boolean(message)} correct={lastCorrect === true}>{message}</FeedbackBlock>
    </Stage>
  );
};

const Screen12 = (props) => {
  const t = useT();
  return (
    <ChoicePractice
      {...props}
      screen={props.screen}
      contentScreen={12}
      extra={(
        <div className="error-claim">
          <div className="error-bit"><BitSVG state="awkward" /></div>
          <p>{t(CONTENT.s12.claim)}</p>
        </div>
      )}
    />
  );
};

const Screen13 = ({ screen, storedAnswer, onAnswer, onPrev, onNext }) => {
  const c = CONTENT.s13;
  const t = useT();
  const [audio] = useNarratedSequence(screen, c.audio, 2, 1300);
  const [selected, setSelected] = useState(null);
  const [placed, setPlaced] = useState(storedAnswer?.placed ?? {});
  const [message, setMessage] = useState(storedAnswer?.message ?? '');
  const [lastCorrect, setLastCorrect] = useState(storedAnswer?.correct ?? null);
  const attemptsRef = useRef(storedAnswer?.attempts ?? 0);
  const targetFor = { 0: '404', 1: 'XIV' };

  const put = (code, method = selected) => {
    if (method === null || method === undefined || placed[method]) return;
    const isCorrect = targetFor[method] === code;
    if (!isCorrect) {
      attemptsRef.current += 1;
      const nextMessage = t(B('404 является десятичной записью, а XIV римской. Используй правило каждой системы.', "404 o'nlik yozuv, XIV esa Rim yozuvi. Har biri uchun o'z qoidasini ishlating.", '404 is decimal notation, while XIV is a Roman numeral. Use the rule for each system.'));
      setLastCorrect(false);
      setMessage(nextMessage);
      setSelected(null);
      playSfx('wrong');
      audio.pushOneOff(t(B('Используй правило каждой системы.', "Har biri uchun o'z qoidasini ishlating.", 'Use the rule for each system.')));
      onAnswer({ stage: 'final', screenIdx: screen, question: t(c.title), options: c.methods.map((methodItem) => t(methodItem)),
        correctIndex: null, correctAnswer: '404-разряды; XIV-знаки', studentAnswerIndex: method,
        studentAnswer: code, correct: false, firstTry: false, attempts: attemptsRef.current,
        placed, message: nextMessage });
      return;
    }
    const nextPlaced = { ...placed, [method]: code };
    const complete = Object.keys(nextPlaced).length === 2;
    setPlaced(nextPlaced);
    setSelected(null);
    setLastCorrect(true);
    setMessage(t(B('Способ выбран верно.', "Usul to'g'ri tanlandi.", 'The method is correct.')));
    playSfx('correct');
    if (complete) {
      audio.pushOneOff(t(B('Оба кода проверяются своими правилами.', "Ikki kod ham o'z qoidasiga ko'ra tekshirildi.", 'Each code is checked with its own rule.')));
      onAnswer({ stage: 'final', screenIdx: screen, question: t(c.title), options: c.methods.map((methodItem) => t(methodItem)),
        correctIndex: null, correctAnswer: '404-разряды; XIV-знаки', studentAnswerIndex: null,
        studentAnswer: JSON.stringify(nextPlaced), correct: true, firstTry: attemptsRef.current === 0,
        attempts: attemptsRef.current + 1, placed: nextPlaced, message: t(B('Оба способа размещены.', 'Ikki usul ham joylashtirildi.', 'Both methods have been placed.')) });
    }
  };

  return (
    <Stage screen={screen} eyebrow={c.eyebrow} title={c.title} audio={audio} onPrev={onPrev} onNext={onNext}>
      <div className="method-source">
        {c.methods.map((method, index) => !placed[index] && (
          <button type="button" draggable key={index} className={`method-card ${selected === index ? 'method-selected' : ''}`}
            onDragStart={(event) => event.dataTransfer.setData('text/plain', String(index))} onClick={() => setSelected(index)}>{t(method)}</button>
        ))}
      </div>
      <div className="code-targets">
        {['404', 'XIV'].map((code) => {
          const methodIndex = Object.keys(placed).find((key) => placed[key] === code);
          return (
            <button type="button" key={code} className="code-target" onClick={() => put(code)}
              onDragOver={(event) => event.preventDefault()} onDrop={(event) => put(code, Number(event.dataTransfer.getData('text/plain')))}>
              <strong>{code}</strong>
              <span>{methodIndex !== undefined ? t(c.methods[Number(methodIndex)]) : '＋'}</span>
              {methodIndex !== undefined && <em>{code === '404' ? '404 = 400 + 0 + 4' : 'XIV = 10 + 4 = 14'}</em>}
            </button>
          );
        })}
      </div>
      <FeedbackBlock show={Boolean(message)} correct={lastCorrect === true}>{message}</FeedbackBlock>
    </Stage>
  );
};

const Screen14 = ({ screen, onPrev, finishLesson, answers = {} }) => {
  const c = CONTENT.s14;
  const t = useT();
  const lang = useLang();
  const [audio, beat] = useNarratedSequence(screen, c.audio, 4, 1250);
  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const visibleBeat = reduced ? 3 : beat;
  const finalBeat = reduced || visibleBeat >= 3 || audio.completed || audio.muted;
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
  return (
    <Stage screen={screen} eyebrow={c.eyebrow} title={null} audio={audio} onPrev={onPrev} onNext={finishLesson} finish>
      <div className="summary-layout finale-layout">
        <G4TitleReveal active={finalBeat} title={t(rewardTitle)} lang={lang} />
        <style>{G4_TITLE_STYLES}</style>
        <header className="finale-heading">
          <span>{t(B('ФИНАЛЬНЫЙ ЭТАП', 'YAKUNIY BOSQICH', 'FINAL STAGE'))}</span>
          <h1>{t(c.title)}</h1>
          <p>{t(B('Соберём в одной сцене все опоры для различения двух систем счисления.', "Ikki sanoq tizimini farqlash uchun barcha tayanchlarni bir joyga jamlaymiz.", 'Bring together all the key ideas for distinguishing the two numeral systems.'))}</p>
        </header>
        <div className="finale-main-grid">
          <section className={`finale-payoff ${visibleBeat >= 3 ? 'summary-visible' : ''}`}>
            <span className="finale-section-kicker">{t(B('РЕШЕНИЕ СТАРТОВОЙ МИССИИ', "BOSHLANG'ICH MISSIYA YECHIMI", 'OPENING MISSION SOLUTION'))}</span>
            <div className="finale-payoff-models">
              <div><strong>14 ↔ 41</strong><span>1 = 10 ↔ 1</span></div>
              <div><strong>VI ↔ IV</strong><span>I = 1 · + ↔ −</span></div>
            </div>
            <div className="finale-hook-result"><b>I = 1</b><p>{t(c.points[3])}</p></div>
          </section>
          <section className="finale-mastery">
            <span className="finale-section-kicker">{t(B('ОСВОЕННЫЕ ОПОРЫ', "SIZ O'RGANGAN TAYANCHLAR", 'KEY IDEAS YOU LEARNT'))}</span>
            <ul className="summary-points">
              {c.points.slice(0, 3).map((point, index) => (
                <li key={index} className={visibleBeat >= index ? 'summary-visible' : ''}>
                  <span>✓</span>{t(point)}
                </li>
              ))}
            </ul>
          </section>
        </div>
        {finalBeat && <G4TitleCard title={t(rewardTitle)} lang={lang} firstTry={firstTryCount} totalScored={totalScored} />}
        <div className="next-bridge">
          <span>{t(B('СЛЕДУЮЩАЯ МИССИЯ', 'KEYINGI MISSIYA', 'NEXT MISSION'))}</span>
          <strong>{t(c.bridge)}</strong>
        </div>
      </div>
    </Stage>
  );
};

const SCREENS = [
  Screen0, Screen3, Screen8, Screen1, Screen9,
  Screen2, Screen10, Screen6, Screen11, Screen4,
  Screen12, Screen7, Screen13, Screen5, Screen14,
];

export default function Grade4Dars07({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  onFinished,
}) {
  useMobileZoom();
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = preview ? normalizeLang(previewLang) : normalizeLang(langProp);
  configureLesson({
    ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '', studentName: studentName || (DEFAULT_STUDENT_NAMES[lang] ?? DEFAULT_STUDENT_NAMES.uz),
    voiceGender: voiceGender || 'f',
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
      <div className={`lesson-root ${preview ? 'lesson-root-preview' : ''}`}>
        <div className="lesson-ambient" aria-hidden="true"><i /><i /><i /></div>
        {preview && (
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
  --shadow: rgba(${T.shadowBase}, .13);
  position: relative; width: 100%; height: 100dvh; min-height: 0;
  overflow: hidden; background: ${T.bg}; color: ${T.ink};
  font-family: 'Manrope', Arial, sans-serif; isolation: isolate;
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
  width: min(100%, 936px); height: 100%; min-height: 0; margin: 0 auto;
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
.stage-happy-bit { width: 42px; height: 42px; position: absolute; z-index: 3; top: 4px; right: 8px; display: grid; place-items: center; }
.stage-happy-bit .g1-char { width: 100%; height: 100%; display: block; }
.stage-content > h1 { padding-right: 52px; }
.stage-content > h1 { max-width: 820px; font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(25px, 3.2vw, 39px); line-height: 1.08; letter-spacing: -.025em; color: ${T.ink}; animation: rise-in .5s both; }
.stage-nav { flex: 0 0 auto; min-height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 10px; padding-bottom: 14px; background: linear-gradient(rgba(245,245,240,0), ${T.bg} 28%); z-index: 6; }
.btn { min-height: 48px; border: 0; border-radius: 14px; padding: 0 20px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-weight: 900; cursor: pointer; transition: transform .2s, box-shadow .2s, background .2s; }
.btn-ghost { color: ${T.ink2}; background: transparent; }
.btn-ghost:hover { background: ${T.paper}; box-shadow: 0 6px 18px var(--shadow); }
.btn-white-accent, .btn-check { color: ${T.accent}; background: ${T.paper}; box-shadow: 0 7px 0 rgba(255,91,53,.24), 0 13px 28px rgba(255,91,53,.13); }
.btn-white-accent:hover, .btn-check:hover { color: white; background: ${T.accent}; transform: translateY(-2px); box-shadow: 0 8px 0 rgba(185,53,23,.28), 0 15px 28px rgba(255,91,53,.21); }
.btn-white-accent:active, .btn-check:active { transform: translateY(3px); box-shadow: 0 3px 0 rgba(185,53,23,.28); }
.btn-check:disabled { opacity: .36; cursor: default; transform: none; box-shadow: none; }
.nav-hidden { visibility: hidden; pointer-events: none; }

.hook-scene { margin-top: 20px; min-height: 226px; padding: 20px clamp(18px, 6vw, 70px); border-radius: 28px; display: grid; grid-template-columns: minmax(92px, .48fr) minmax(190px, 1.52fr); align-items: end; gap: 26px; overflow: hidden; position: relative; background: radial-gradient(circle at 75% 48%, rgba(91,214,242,.13), transparent 34%), ${T.navy}; box-shadow: 0 18px 44px rgba(23,59,82,.22); }
.hook-scene::before { content: ''; position: absolute; inset: 0; opacity: .17; background-image: linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.09) 1px, transparent 1px); background-size: 34px 34px; mask-image: linear-gradient(to left, #000, transparent 88%); }
.hook-bit { height: 132px; position: relative; z-index: 1; display: flex; justify-content: center; align-items: flex-end; }
.hook-bit .g1-char { height: 100%; }
.hook-terminal { min-height: 174px; position: relative; z-index: 1; border-radius: 20px; display: grid; place-items: center; overflow: hidden; background: #0C202F; box-shadow: inset 0 0 0 3px rgba(91,214,242,.13), 0 0 44px rgba(91,214,242,.13); }
.hook-terminal::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 5px); }
.hook-terminal span { position: relative; color: white; font-family: 'Source Serif 4', serif; font-size: clamp(80px, 13vw, 132px); line-height: 1; text-shadow: 0 0 24px rgba(91,214,242,.72); animation: roman-pulse 2.4s ease-in-out infinite; }
.hook-terminal i { position: absolute; width: 64%; height: 2px; bottom: 24px; background: rgba(91,214,242,.45); box-shadow: 0 0 12px rgba(91,214,242,.8); animation: scan-line 2.8s ease-in-out infinite; }
.choice-grid { margin-top: 18px; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
.choice-grid-two { grid-template-columns: repeat(2, minmax(0,1fr)); }
.choice-card { min-height: 72px; border: 0; border-radius: 17px; padding: 13px 15px; display: flex; align-items: center; gap: 12px; text-align: left; color: ${T.ink}; background: ${T.paper}; box-shadow: 0 7px 22px var(--shadow); cursor: pointer; font-weight: 750; line-height: 1.35; transition: transform .22s, box-shadow .22s, background .22s; }
.choice-card:hover { transform: translateY(-3px); box-shadow: 0 12px 26px rgba(${T.shadowBase},.16); }
.choice-letter { width: 32px; height: 32px; flex: 0 0 32px; border-radius: 10px; display: grid; place-items: center; color: ${T.cyan}; background: ${T.cyanSoft}; font-family: 'JetBrains Mono', monospace; font-weight: 900; }
.choice-picked { background: ${T.accentSoft}; box-shadow: 0 0 0 2px rgba(255,91,53,.4), 0 9px 24px rgba(255,91,53,.12); }
.choice-picked .choice-letter { color: white; background: ${T.accent}; }
.choice-correct { background: ${T.successSoft}; box-shadow: 0 0 0 2px rgba(34,122,83,.35), 0 9px 24px rgba(34,122,83,.12); }
.choice-correct .choice-letter { background: ${T.success}; }
.hook-after { margin: 14px auto 0; max-width: 650px; min-height: 52px; border-radius: 15px; padding: 14px 18px; text-align: center; color: ${T.success}; background: ${T.successSoft}; font-weight: 900; animation: feedback-in .46s both; }

@media (max-height: 780px) {
  .stage-nav { min-height: 58px; padding-top: 5px; padding-bottom: 7px; }
  .stage-content { padding-top: 3px; padding-bottom: 6px; }
  .stage-content > h1 { font-size: clamp(24px, 3vw, 34px); }
  .hook-scene { min-height: 174px; margin-top: 10px; padding-block: 12px; }
  .hook-terminal { min-height: 132px; }
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
.scene-bit { width: 72px; height: 90px; flex: 0 0 72px; pointer-events: none; filter: drop-shadow(0 9px 17px rgba(23,59,82,.14)); }
.scene-bit .g1-char { width: 100%; height: 100%; }
.recall-bit { position: absolute; z-index: 2; right: 2px; top: -18px; width: 66px; height: 82px; opacity: .96; }
.number-row { min-height: 130px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: clamp(9px, 2vw, 18px); }
.number-chip { min-width: 110px; min-height: 86px; border-radius: 18px; display: grid; place-items: center; color: ${T.navy}; background: ${T.paper}; box-shadow: 0 8px 23px var(--shadow); font-family: 'JetBrains Mono', monospace; font-size: clamp(27px, 4vw, 42px); font-weight: 900; transition: transform .34s, color .34s, box-shadow .34s; }
.number-speaking { color: ${T.accent}; transform: translateY(-7px) scale(1.04); box-shadow: 0 0 0 3px rgba(255,91,53,.36), 0 15px 30px rgba(255,91,53,.17); }
.system-caption, .bridge-line, .conclusion-band { opacity: 0; transform: translateY(10px); }
.system-caption { min-height: 46px; text-align: center; color: ${T.cyan}; font-weight: 900; }
.roman-preview { opacity: 0; min-height: 90px; display: flex; justify-content: center; align-items: center; gap: 18px; }
.roman-preview span { min-width: 82px; min-height: 65px; border-radius: 14px; display: grid; place-items: center; color: white; background: ${T.navy}; font-family: 'Source Serif 4', serif; font-size: 32px; box-shadow: 0 8px 22px rgba(23,59,82,.22); }
.bridge-line { margin-top: 10px; text-align: center; color: ${T.ink2}; font-weight: 750; }
.reveal-visible { opacity: 1 !important; transform: none !important; transition: opacity .5s, transform .5s; }

.roman-gallery-illustration { min-height: 116px; margin: 0 auto 14px; position: relative; overflow: hidden; border-radius: 20px; background: ${T.navy}; box-shadow: 0 12px 29px rgba(23,59,82,.16); }
.roman-gallery-illustration > svg { display: block; width: 100%; height: 116px; }
.roman-gallery-bit { position: absolute; z-index: 2; left: 9px; bottom: -9px; width: 64px; height: 80px; }
.roman-arch { opacity: .42; transform-box: fill-box; transform-origin: bottom center; transition: opacity .45s, transform .45s; }
.gallery-beat-0 .roman-arch-0, .gallery-beat-1 .roman-arch-0,
.gallery-beat-1 .roman-arch-1, .gallery-beat-2 .roman-arch,
.gallery-beat-3 .roman-arch { opacity: 1; transform: translateY(-2px); }
.gallery-scan { animation: gallery-scan 2.6s ease-in-out infinite; }

.anchor-row { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
.anchor-card { min-height: 82px; border-radius: 17px; display: grid; place-items: center; color: ${T.navy}; background: ${T.paper}; box-shadow: 0 7px 22px var(--shadow); font-family: 'Source Serif 4', serif; font-size: 30px; font-weight: 800; transition: transform .32s, box-shadow .32s, color .32s; }
.anchor-active { color: ${T.accent}; transform: translateY(-3px); box-shadow: 0 0 0 2px rgba(255,91,53,.32), 0 12px 25px rgba(255,91,53,.14); }
.roman-table { margin-top: 16px; display: grid; gap: 8px; }
.roman-row { opacity: 0; transform: translateY(8px); display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 7px; transition: opacity .55s, transform .55s; }
.roman-row-visible { opacity: 1; transform: none; }
.roman-row span { min-height: 48px; border-radius: 11px; display: grid; place-items: center; color: ${T.ink}; background: rgba(255,255,255,.82); box-shadow: 0 3px 12px rgba(${T.shadowBase},.08); font-family: 'Source Serif 4', serif; font-size: 19px; font-weight: 800; }
.roman-row .roman-subtract { color: ${T.accent}; background: ${T.accentSoft}; position: relative; }
.roman-row .roman-subtract::after { content: '↶'; position: absolute; top: -8px; color: ${T.accent}; font-size: 15px; animation: arc-pop 1.15s ease both; }
.rule-strip, .conclusion-band { margin-top: 16px; border-radius: 16px; padding: 15px 18px; color: ${T.navy}; background: ${T.cyanSoft}; font-weight: 850; line-height: 1.45; text-align: center; }

.single-model-layout { display: grid; justify-items: center; gap: 18px; }
.place-value-city { width: min(100%, 600px); height: 105px; margin-bottom: -18px; position: relative; overflow: hidden; border-radius: 20px; background: linear-gradient(180deg, rgba(229,245,246,.82), rgba(255,255,255,.14)); }
.place-value-city > svg { display: block; width: 100%; height: 100%; }
.place-value-bit { position: absolute; right: 13px; bottom: -8px; width: 62px; height: 78px; }
.city-tens, .city-ones { transform-box: fill-box; transform-origin: center bottom; }
.city-signal { transition: cx 1.1s cubic-bezier(.16,1,.3,1), filter .4s; filter: drop-shadow(0 0 6px rgba(23,59,82,.22)); }
.city-route { stroke-dashoffset: 42; animation: city-route 2.1s linear infinite; }
.place-value-city-moved .city-route-arrow { transform-box: fill-box; transform-origin: center; transform: rotate(180deg); }
.swap-scene { width: min(100%, 560px); min-height: 280px; border: 0; border-radius: 26px; padding: 24px; color: ${T.ink}; background: transparent; cursor: pointer; position: relative; }
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
.comparison-result { opacity: 0; min-height: 68px; border-radius: 16px; padding: 14px; display: flex; align-items: center; justify-content: center; gap: 10px; text-align: center; background: ${T.paper}; box-shadow: 0 7px 21px var(--shadow); color: ${T.ink2}; font-weight: 850; }
.comparison-result i { width: 10px; height: 34px; border-radius: 5px; }
.decimal-mark { background: ${T.accent}; }
.roman-mark { background: ${T.cyan}; }
.mini-proof { grid-column: 1 / -1; opacity: 0; display: flex; justify-content: center; gap: 12px; }
.mini-proof span { min-height: 44px; padding: 0 20px; border-radius: 99px; display: grid; place-items: center; color: ${T.navy}; background: ${T.cyanSoft}; font-family: 'JetBrains Mono', monospace; font-weight: 900; }

.system-zone-layout { margin-top: 20px; }
.system-route-illustration { width: min(100%, 620px); height: 82px; margin: 0 auto -7px; position: relative; }
.system-route-illustration > svg { display: block; width: 100%; height: 100%; }
.system-route-bit { position: absolute; z-index: 2; left: calc(50% - 34px); top: -22px; width: 68px; height: 85px; }
.route-orange, .route-cyan { transform-box: fill-box; transition: opacity .45s, transform .45s; }
.route-beat-0 .route-cyan { opacity: .18; transform: scaleX(.45); transform-origin: left center; }
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

.feedback { margin-top: 16px; min-height: 80px; border-radius: 18px; padding: 12px 16px; display: grid; grid-template-columns: 68px 1fr; align-items: center; gap: 12px; animation: feedback-in .5s both; }
.feedback-correct { color: ${T.success}; background: ${T.successSoft}; }
.feedback-wrong { color: ${T.warn}; background: ${T.warnSoft}; }
.feedback-bit { width: 64px; height: 72px; overflow: hidden; }
.feedback-bit .g1-char { width: 100%; height: 100%; }
.feedback-copy { display: flex; align-items: flex-start; gap: 10px; font-weight: 800; line-height: 1.45; }
.feedback-copy > strong { font-size: 23px; }

.matching-board { margin-top: 24px; min-height: 330px; display: grid; grid-template-columns: minmax(120px,1fr) 80px minmax(120px,1fr); gap: 12px; align-items: center; }
.matching-column { display: grid; gap: 10px; }
.match-card { min-height: 58px; border: 0; border-radius: 14px; padding: 8px 14px; color: ${T.navy}; background: ${T.paper}; box-shadow: 0 6px 18px var(--shadow); cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 900; transition: transform .2s, box-shadow .2s; }
.match-card:hover, .match-selected { transform: translateY(-2px); box-shadow: 0 0 0 2px rgba(255,91,53,.34), 0 9px 21px rgba(255,91,53,.12); }
.match-card small { display: block; margin-top: 3px; color: ${T.success}; font-size: 10px; }
.match-done { color: ${T.success}; background: ${T.successSoft}; }
.roman-match { font-family: 'Source Serif 4', serif; font-size: 25px; }
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

.method-source { margin-top: 22px; min-height: 94px; display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 12px; }
.method-card { min-height: 58px; max-width: 340px; border: 0; border-radius: 15px; padding: 12px 18px; color: ${T.navy}; background: ${T.paper}; box-shadow: 0 7px 20px var(--shadow); cursor: pointer; font-weight: 900; }
.method-selected { color: white; background: ${T.accent}; transform: translateY(-3px); }
.code-targets { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px; }
.code-target { min-height: 245px; border: 0; border-radius: 25px; padding: 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: ${T.ink}; background: ${T.navy}; cursor: pointer; box-shadow: 0 13px 30px rgba(23,59,82,.22); }
.code-target > strong { color: white; font-family: 'Source Serif 4', serif; font-size: 54px; }
.code-target > span { min-height: 56px; width: 100%; border-radius: 14px; padding: 10px; display: grid; place-items: center; color: ${T.navy}; background: white; font-weight: 900; }
.code-target > em { color: #9DEBF7; font-family: 'JetBrains Mono', monospace; font-style: normal; font-weight: 800; }

.finale-layout { display: grid; gap: 12px; }
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
.g1-eyes { transform-box: fill-box; transform-origin: center; animation: g4blink 4.4s infinite; }
.g1-bit-ant { transform-box: fill-box; transform-origin: bottom center; animation: g4antbob 2.2s ease-in-out infinite; }
.g1-bit-wave { transform-box: fill-box; transform-origin: bottom left; animation: g4wavebig 1s ease-in-out infinite; }
.bit-wave-left, .bit-wave-right, .bit-think-hand, .bit-point-arm, .bit-idea-bulb,
.bit-focus-hands, .bit-focus-scan, .bit-nod-hand, .bit-nod-check { transform-box: fill-box; transform-origin: center; }
.bit-double-wave .bit-wave-left { transform-origin: bottom right; animation: bit-wave-left 1.05s ease-in-out infinite; }
.bit-double-wave .bit-wave-right { transform-origin: bottom left; animation: bit-wave-right 1.05s ease-in-out infinite; }
.bit-think-hand { animation: bit-think-tap 1.8s ease-in-out infinite; }
.bit-point-arm { transform-origin: left center; animation: bit-point 1.45s ease-in-out infinite; }
.bit-point-target { transform-box: fill-box; transform-origin: center; animation: bit-target 1.45s ease-in-out infinite; }
.bit-idea-bulb { animation: bit-idea 1.55s ease-in-out infinite; }
.bit-focus-hands { transform-origin: center bottom; animation: bit-focus 1.7s ease-in-out infinite; }
.bit-focus-scan { animation: bit-scan 1.7s ease-in-out infinite; }
.bit-nod-hand { animation: bit-nod-hand 1.35s ease-in-out infinite; }
.bit-nod-check { animation: bit-check 1.35s ease-in-out infinite; }

@keyframes rise-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes feedback-in { from { opacity: 0; transform: translateY(10px) scale(.98); } to { opacity: 1; transform: none; } }
@keyframes roman-pulse { 0%,100% { transform: scale(1); opacity: .92; } 50% { transform: scale(1.045); opacity: 1; } }
@keyframes scan-line { 0%,100% { transform: translateX(-18%); opacity: .35; } 50% { transform: translateX(18%); opacity: .9; } }
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
@keyframes gallery-scan { 0%,100% { opacity: .18; transform: translateX(-32px); } 50% { opacity: .75; transform: translateX(32px); } }
@keyframes city-route { to { stroke-dashoffset: -42; } }

@media (max-width: 640px) {
  .lesson-root { width: 390px; height: 100dvh; transform-origin: top left; }
  .stage-header { padding-top: 60px; }
  .stage-chrome { min-height: 36px; gap: 5px; }
  .chrome-title { font-size: 8px; }
  .screen-type { display: none; }
  .screen-count { font-size: 8px; }
  .stage-content { padding-top: 2px; padding-bottom: 16px; }
  .stage-content > h1 { font-size: 25px; line-height: 1.08; }
  .stage-nav { min-height: 66px; padding-top: 7px; padding-bottom: 9px; }
  .btn { min-height: 46px; padding: 0 15px; font-size: 12px; }
  .hook-scene { margin-top: 14px; min-height: 185px; padding: 10px 16px; grid-template-columns: 78px 1fr; gap: 10px; border-radius: 21px; }
  .hook-bit { height: 102px; }
  .hook-terminal { min-height: 150px; }
  .hook-terminal span { font-size: 86px; }
  .choice-grid { grid-template-columns: 1fr; gap: 8px; margin-top: 12px; }
  .choice-card { min-height: 58px; border-radius: 14px; padding: 9px 11px; font-size: 12px; }
  .choice-letter { width: 28px; height: 28px; flex-basis: 28px; }
  .recall-layout, .single-model-layout, .roman-board, .comparison-layout, .system-zones, .strategy-layout, .summary-layout { margin-top: 17px; }
  .scene-bit { width: 54px; height: 68px; flex-basis: 54px; }
  .recall-bit { right: -4px; top: -11px; width: 49px; height: 61px; }
  .number-row { min-height: 112px; gap: 8px; }
  .number-chip { min-width: calc(50% - 6px); min-height: 54px; border-radius: 13px; font-size: 23px; }
  .roman-preview { min-height: 70px; gap: 7px; }
  .roman-preview span { min-width: 70px; min-height: 50px; font-size: 23px; }
  .roman-gallery-illustration { min-height: 82px; margin-bottom: 9px; border-radius: 15px; }
  .roman-gallery-illustration > svg { height: 82px; }
  .roman-gallery-bit { left: 3px; bottom: -7px; width: 46px; height: 58px; }
  .anchor-row { gap: 7px; }
  .anchor-card { min-height: 58px; font-size: 21px; border-radius: 13px; }
  .roman-table { gap: 5px; margin-top: 10px; }
  .roman-row { gap: 4px; }
  .roman-row span { min-height: 39px; font-size: 15px; border-radius: 8px; }
  .rule-strip, .conclusion-band { margin-top: 10px; padding: 10px 12px; font-size: 11px; }
  .place-value-city { height: 78px; margin-bottom: -13px; border-radius: 15px; }
  .place-value-bit { right: 5px; bottom: -6px; width: 45px; height: 57px; }
  .swap-scene { min-height: 240px; padding: 12px; }
  .digit-track { width: 250px; }
  .digit { width: 84px; height: 94px; font-size: 41px; }
  .digit-track-moved .digit-one { transform: translateX(136px); }
  .digit-track-moved .digit-four { transform: translateX(-136px); }
  .comparison-layout, .system-zones, .strategy-layout { grid-template-columns: 1fr; gap: 10px; }
  .comparison-model { min-height: 126px; gap: 10px; }
  .comparison-formula { font-size: 32px; }
  .comparison-result { min-height: 53px; font-size: 11px; }
  .system-zone { min-height: 175px; padding: 16px; gap: 9px; border-radius: 18px; }
  .system-zone-layout { margin-top: 12px; }
  .system-route-illustration { height: 62px; margin-bottom: -4px; }
  .system-route-bit { left: calc(50% - 25px); top: -13px; width: 50px; height: 63px; }
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
  .error-bit { height: 84px; }
  .method-source { min-height: 74px; gap: 8px; }
  .method-card { min-height: 49px; padding: 8px 11px; font-size: 11px; }
  .code-targets { gap: 9px; }
  .code-target { min-height: 185px; padding: 12px 8px; border-radius: 18px; }
  .code-target > strong { font-size: 38px; }
  .code-target > span { min-height: 49px; font-size: 10px; }
  .code-target > em { font-size: 9px; }
  .finale-layout { gap: 8px; }
  .finale-heading { padding: 10px 12px; }
  .finale-heading h1 { font-size: 21px; }
  .finale-heading p { font-size: 9px; }
  .finale-main-grid { grid-template-columns: 1fr; gap: 8px; }
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

@media (max-width: 420px) {
  .lesson-root { transform: scale(var(--g4z, 1)); }
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
`;
