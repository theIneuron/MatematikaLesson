import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { useAudio, useGrader, useSfx } from '@lesson/runtime'

const LESSON_ID = 'math-7-01-v1'
const TOTAL_SCREENS = 16
const FREE_NAV = true

const C = {
  bg: 'rgb(245, 245, 245)',
  paper: '#ffffff',
  text: '#171717',
  muted: '#68717f',
  primary: '#fe5b1a',
  primarySoft: '#fff1e9',
  green: '#10b981',
  greenSoft: '#ecfdf5',
  yellow: '#fcd34d',
  yellowSoft: '#fffbeb',
  blue: '#019acb',
  blueSoft: '#eefaff',
  red: '#ff6a6a',
  redSoft: '#fff5f5',
  line: '#dedede',
  inkSoft: '#f1f2f4',
}

const F = {
  sans: '"Manrope", "Inter", system-ui, sans-serif',
  serif: '"Fraunces", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
}

const L = (uz, ru, en) => ({ uz, ru, en })
const A = (uz, ru, en) => L(
  `[O'zbekcha tallaffuz] ${uz}`,
  `[Русское произношение] ${ru}`,
  `[English pronunciation] ${en}`,
)
const tr = (value, lang) => value?.[lang] ?? value?.uz ?? value ?? ''

const UI = {
  back: L('Orqaga', 'Назад', 'Back'),
  next: L('Davom etish', 'Продолжить', 'Continue'),
  check: L('Tekshirish', 'Проверить', 'Check'),
  retry: L('Yana urinib ko‘ring', 'Попробуй ещё раз', 'Try again'),
  hint: L('Maslahat', 'Подсказка', 'Hint'),
  finish: L('Darsni tugatish', 'Завершить урок', 'Finish lesson'),
  correct: L('To‘g‘ri yo‘l topildi.', 'Верный ход найден.', 'You found the correct step.'),
  choose: L('Variantni tanlang', 'Выбери вариант', 'Choose an option'),
  selected: L('Tanlangan', 'Выбрано', 'Selected'),
  reset: L('Qayta boshlash', 'Начать заново', 'Start again'),
  listening: L('Ovoz ketmoqda', 'Идёт озвучивание', 'Narration is playing'),
  replay: L('Qayta tinglash', 'Повторить озвучивание', 'Replay narration'),
  mute: L('Ovozni o‘chirish', 'Выключить звук', 'Mute'),
  unmute: L('Ovozni yoqish', 'Включить звук', 'Unmute'),
}

const SCREENS = [
  {
    type: 'hook',
    scope: 'hook',
    phase: L('Muammo', 'Проблема', 'Problem'),
    kicker: L('BIR YOZUV — IKKI JAVOB', 'ОДНА ЗАПИСЬ — ДВА ОТВЕТА', 'ONE EXPRESSION — TWO ANSWERS'),
    title: L('Nega Nova 20, Bit esa 8 oldi?', 'Почему Nova получила 20, а Bit — 8?', 'Why did Nova get 20 while Bit got 8?'),
    lead: L(
      'Ikkala modul ham bir xil 18 − 6 : 3 + 4 ifodasini hisoblagan.',
      'Оба модуля вычисляли одно и то же выражение 18 − 6 : 3 + 4.',
      'Both modules evaluated the same expression: 18 − 6 : 3 + 4.',
    ),
    hint: L(
      'Muammo sonlarda emas, amallarni qaysi tartibda bajarishda bo‘lishi mumkin.',
      'Проблема может быть не в числах, а в порядке выполнения действий.',
      'The issue may be the order of operations rather than the numbers.',
    ),
    audio: A(
      'Bir xil sonli ifoda ikki xil javob berdi. Buning sababini topish uchun hisoblash tartibini tekshiramiz.',
      'Одно и то же числовое выражение дало два разных ответа. Найдём причину, проверив порядок действий.',
      'The same numerical expression produced two different answers. Let us inspect the order of operations.',
    ),
  },
  {
    type: 'exploration',
    scope: null,
    phase: L('Muammo', 'Проблема', 'Problem'),
    kicker: L('KIRISH DIAGNOSTIKASI', 'ВХОДНАЯ ДИАГНОСТИКА', 'ENTRY CHECK'),
    title: L('Uchta tayanch ko‘nikma', 'Три опорных навыка', 'Three foundation skills'),
    lead: L(
      'Qavslar, amal darajasi va chapdan o‘ngga tartibni qisqa topshiriqlarda eslang.',
      'Вспомни скобки, приоритет действий и движение слева направо.',
      'Recall brackets, operation priority and left-to-right order.',
    ),
    hint: L(
      'Bu baho emas. Javoblar keyingi tushuntirishni moslashtirishga yordam beradi.',
      'Это не оценка. Ответы помогут настроить дальнейшее объяснение.',
      'This is not a grade. Your answers help shape the explanation.',
    ),
    audio: A(
      'Yangi mavzu oldidan uchta tanish ko‘nikmani faollashtiramiz. Har bir qatorda bitta javobni tanlang.',
      'Перед новой темой активируем три знакомых навыка. Выбери один ответ в каждой строке.',
      'Before the new topic, activate three familiar skills. Choose one answer in each row.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Tuzilish', 'Структура', 'Structure'),
    kicker: L('IFODANING ANATOMIYASI', 'АНАТОМИЯ ВЫРАЖЕНИЯ', 'ANATOMY OF AN EXPRESSION'),
    title: L('Sonlar va amal belgilarini ajrating', 'Отдели числа от знаков действий', 'Separate numbers from operation signs'),
    lead: L(
      '18 − 6 : 3 + 4 yozuvidagi barcha amal belgilarini tanlang.',
      'Выбери все знаки действий в записи 18 − 6 : 3 + 4.',
      'Select every operation sign in 18 − 6 : 3 + 4.',
    ),
    hint: L(
      'Amal belgisi ikki son bilan nima qilish kerakligini ko‘rsatadi.',
      'Знак действия показывает, что нужно сделать с числами.',
      'An operation sign tells us what to do with the numbers.',
    ),
    audio: A(
      'Ifodada sonlar va amal belgilari bor. Ayirish, bo‘lish va qo‘shish belgilarini tanlang.',
      'В выражении есть числа и знаки действий. Выбери знаки вычитания, деления и сложения.',
      'The expression contains numbers and operation signs. Select subtraction, division and addition.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Tuzilish', 'Структура', 'Structure'),
    kicker: L('MATEMATIK OBYEKT', 'МАТЕМАТИЧЕСКИЙ ОБЪЕКТ', 'MATHEMATICAL OBJECT'),
    title: L('Ifoda, tenglik yoki taqiqlangan yozuv?', 'Выражение, равенство или недопустимая запись?', 'Expression, equality or invalid notation?'),
    lead: L(
      'Har bir yozuvning turini aniqlang.',
      'Определи тип каждой записи.',
      'Identify the type of each notation.',
    ),
    hint: L(
      'Tenglikda tenglik belgisi bor. Nolga bo‘lish mumkin emas.',
      'В равенстве есть знак равенства. Делить на ноль нельзя.',
      'An equality has an equals sign. Division by zero is undefined.',
    ),
    audio: A(
      'Uchta yozuvni sonli ifoda, sonli tenglik va taqiqlangan yozuv guruhlariga ajrating.',
      'Распредели три записи по группам: числовое выражение, числовое равенство и недопустимая запись.',
      'Sort the three notations into numerical expression, numerical equality and invalid notation.',
    ),
  },
  {
    type: 'exploration',
    scope: null,
    phase: L('Tuzilish', 'Структура', 'Structure'),
    kicker: L('IFODA VA QIYMAT', 'ВЫРАЖЕНИЕ И ЗНАЧЕНИЕ', 'EXPRESSION AND VALUE'),
    title: L('Yozuvdan songacha bo‘lgan yo‘l', 'Путь от записи к числу', 'The path from notation to number'),
    lead: L(
      'Uchta bosqichni mantiqiy tartibga qo‘ying.',
      'Расположи три этапа в логическом порядке.',
      'Arrange the three stages in logical order.',
    ),
    hint: L(
      'Avval yozuvni ko‘ramiz, keyin hisoblaymiz, oxirida qiymat olamiz.',
      'Сначала видим запись, затем вычисляем, в конце получаем значение.',
      'First we see the notation, then calculate, and finally obtain its value.',
    ),
    audio: A(
      'Ifoda va uning qiymati bir xil obyekt emas. Ularni hisoblash jarayoni bog‘laydi.',
      'Выражение и его значение не один и тот же объект. Их связывает вычисление.',
      'An expression and its value are not the same object. Calculation connects them.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Model', 'Модель', 'Model'),
    kicker: L('QAVSLAR TUZILISHNI O‘ZGARTIRADI', 'СКОБКИ МЕНЯЮТ СТРУКТУРУ', 'BRACKETS CHANGE STRUCTURE'),
    title: L('Bir xil sonlar — boshqa qiymatlar', 'Те же числа — другие значения', 'Same numbers — different values'),
    lead: L(
      '2 + 3 · 4 va (2 + 3) · 4 ifodalarining qiymatini toping.',
      'Найди значения выражений 2 + 3 · 4 и (2 + 3) · 4.',
      'Find the values of 2 + 3 · 4 and (2 + 3) · 4.',
    ),
    hint: L(
      'Birinchi ifodada ko‘paytirish, ikkinchisida qavs ichidagi qo‘shish avval bajariladi.',
      'В первом выражении сначала умножение, во втором — сложение в скобках.',
      'Multiply first in the first expression; add inside the brackets first in the second.',
    ),
    audio: A(
      'Sonlar va amal belgilari bir xil. Ammo qavslar qaysi amal birinchi bajarilishini o‘zgartiradi.',
      'Числа и знаки действий одинаковы. Но скобки меняют действие, которое выполняется первым.',
      'The numbers and operation signs are the same. Brackets change which operation comes first.',
    ),
  },
  {
    type: 'rule',
    scope: null,
    phase: L('Model', 'Модель', 'Model'),
    kicker: L('AMALLAR IERARXIYASI', 'ИЕРАРХИЯ ДЕЙСТВИЙ', 'OPERATION HIERARCHY'),
    title: L('Uch darajali tartibni tuzing', 'Собери трёхуровневый порядок', 'Build the three-level order'),
    lead: L(
      'Amal guruhlarini bajarilish tartibida joylashtiring.',
      'Расположи группы действий в порядке выполнения.',
      'Arrange the operation groups in execution order.',
    ),
    hint: L(
      'Qavs ichidagi amal birinchi. Bir xil darajadagi amallar chapdan o‘ngga bajariladi.',
      'Сначала действие в скобках. Действия одного уровня выполняются слева направо.',
      'Operations in brackets come first. Equal-priority operations go from left to right.',
    ),
    audio: A(
      'Birinchi daraja qavslar. Ikkinchi daraja ko‘paytirish va bo‘lish. Uchinchi daraja qo‘shish va ayirish.',
      'Первый уровень это скобки. Второй уровень это умножение и деление. Третий уровень это сложение и вычитание.',
      'The first level is brackets. The second is multiplication and division. The third is addition and subtraction.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Model', 'Модель', 'Model'),
    kicker: L('AMALLAR DARAXTI', 'ДЕРЕВО ДЕЙСТВИЙ', 'OPERATION TREE'),
    title: L('Bog‘lanishlarni buzmasdan hisoblang', 'Вычисли, не разрушая связи', 'Calculate without breaking the links'),
    lead: L(
      '36 : (9 − 3) + 5 · 2 ifodasidagi amallarni tartiblang.',
      'Расположи действия выражения 36 : (9 − 3) + 5 · 2.',
      'Order the operations in 36 : (9 − 3) + 5 · 2.',
    ),
    hint: L(
      'Qavs tuguni birinchi, qo‘shish tuguni esa oxirgi ishlaydi.',
      'Узел скобок работает первым, а узел сложения — последним.',
      'The brackets node runs first and the addition node runs last.',
    ),
    audio: A(
      'Ifodani daraxt sifatida tasavvur qiling. Yuqori tugun faqat pastki shoxlar tayyor bo‘lganda ishlaydi.',
      'Представь выражение как дерево. Верхний узел работает только после готовности нижних ветвей.',
      'Imagine the expression as a tree. A higher node runs only after its lower branches are ready.',
    ),
  },
  {
    type: 'rule',
    scope: null,
    phase: L('Qoida', 'Правило', 'Rule'),
    kicker: L('QOIDANI O‘ZINGIZ YIG‘ING', 'СОБЕРИ ПРАВИЛО', 'BUILD THE RULE'),
    title: L('Hisoblash protokoli', 'Протокол вычисления', 'Calculation protocol'),
    lead: L(
      'To‘rtta qoida qismini to‘g‘ri ketma-ketlikka qo‘ying.',
      'Расположи четыре части правила в правильной последовательности.',
      'Arrange the four parts of the rule in the correct sequence.',
    ),
    hint: L(
      'Bir xil darajadagi amallar chapdan o‘ngga bajariladi. Tekshirish oxirida keladi.',
      'Действия одного уровня идут слева направо. Проверка выполняется в конце.',
      'Equal-priority operations go left to right. Verification comes last.',
    ),
    audio: A(
      'Tayyor qoidani yodlamang. Uning qismlarini mantiqiy protokolga yig‘ing.',
      'Не заучивай готовое правило. Собери его части в логичный протокол.',
      'Do not memorise a finished rule. Assemble its parts into a logical protocol.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Amaliyot', 'Практика', 'Practice'),
    kicker: L('FAOL TAHLIL', 'АКТИВНЫЙ РАЗБОР', 'ACTIVE WALKTHROUGH'),
    title: L('Keyingi amalni boshqaring', 'Управляй следующим действием', 'Control the next operation'),
    lead: L(
      '42 − 18 : 3 · 2 ifodasida amallarni to‘g‘ri tartiblang.',
      'Расположи действия в выражении 42 − 18 : 3 · 2.',
      'Order the operations in 42 − 18 : 3 · 2.',
    ),
    hint: L(
      'Bo‘lish va ko‘paytirish teng darajada. Eng chapdagisidan boshlang.',
      'Деление и умножение равноправны. Начни с самого левого.',
      'Division and multiplication have equal priority. Start with the leftmost one.',
    ),
    audio: A(
      'Bo‘lish va ko‘paytirish teng darajada turadi. Shuning uchun avval chapdagi bo‘lishni bajaring.',
      'Деление и умножение имеют равный приоритет. Поэтому сначала выполни деление слева.',
      'Division and multiplication have equal priority. Therefore, perform the leftmost division first.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Amaliyot', 'Практика', 'Practice'),
    kicker: L('TAYANCH BILAN MASHQ', 'ПРАКТИКА С ОПОРОЙ', 'GUIDED PRACTICE'),
    title: L('To‘rtta qadamli zinapoya', 'Лестница из четырёх шагов', 'A four-step ladder'),
    lead: L(
      '7 + 24 : (8 − 2) · 3 ifodasidagi amallarni tartiblang.',
      'Расположи действия в выражении 7 + 24 : (8 − 2) · 3.',
      'Order the operations in 7 + 24 : (8 − 2) · 3.',
    ),
    hint: L(
      'Avval qavs, keyin bo‘lish, ko‘paytirish va qo‘shish.',
      'Сначала скобки, затем деление, умножение и сложение.',
      'Start with brackets, then division, multiplication and addition.',
    ),
    audio: A(
      'Har bir to‘g‘ri qadam ifodani qisqartiradi. Tartibni qavsdan boshlang.',
      'Каждый верный шаг сокращает выражение. Начни порядок со скобок.',
      'Each correct step makes the expression shorter. Begin the sequence with the brackets.',
    ),
  },
  {
    type: 'test',
    scope: 'module-mikro',
    phase: L('Amaliyot', 'Практика', 'Practice'),
    kicker: L('MUSTAQIL YECHIM', 'САМОСТОЯТЕЛЬНОЕ РЕШЕНИЕ', 'INDEPENDENT SOLUTION'),
    title: L('Birinchi amal va yakuniy qiymat', 'Первое действие и итоговое значение', 'First operation and final value'),
    lead: L(
      '60 − 4 · (9 + 3) : 6 ifodasini hisoblang.',
      'Вычисли выражение 60 − 4 · (9 + 3) : 6.',
      'Evaluate 60 − 4 · (9 + 3) : 6.',
    ),
    hint: L(
      'Qavs ichidagi qo‘shishdan boshlang. Keyin chapdan o‘ngga yuring.',
      'Начни со сложения в скобках. Затем двигайся слева направо.',
      'Begin with the addition in brackets, then move from left to right.',
    ),
    audio: A(
      'Birinchi amalni tanlang va hisoblashning yakuniy qiymatini kiriting.',
      'Выбери первое действие и введи итоговое значение выражения.',
      'Choose the first operation and enter the final value of the expression.',
    ),
  },
  {
    type: 'case',
    scope: 'module-mikro',
    phase: L('Strategiya', 'Стратегия', 'Strategy'),
    kicker: L('O‘Z SO‘ZINGIZ BILAN', 'СВОИМИ СЛОВАМИ', 'IN YOUR OWN WORDS'),
    title: L('To‘g‘ri va qulay usul', 'Верный и удобный способ', 'A correct and convenient method'),
    lead: L(
      '25 · 17 · 4 ni qanday qulay hisoblash mumkinligini tushuntiring.',
      'Объясни, как удобно вычислить 25 · 17 · 4.',
      'Explain a convenient way to calculate 25 · 17 · 4.',
    ),
    hint: L(
      '25 va 4 ko‘paytmasi qulay yaxlit son beradi.',
      'Произведение 25 и 4 даёт удобное круглое число.',
      'The product of 25 and 4 gives a convenient round number.',
    ),
    audio: A(
      'Qaysi ko‘paytuvchilarni avval birlashtirish qulayligini va nima uchunligini ikki jumlada tushuntiring.',
      'В двух предложениях объясни, какие множители удобно объединить сначала и почему.',
      'In two sentences, explain which factors are convenient to group first and why.',
    ),
  },
  {
    type: 'case',
    scope: 'module-mikro',
    phase: L('Audit', 'Аудит', 'Audit'),
    kicker: L('XATO AUDITI', 'АУДИТ ОШИБКИ', 'ERROR AUDIT'),
    title: L('Birinchi noto‘g‘ri qadam qayerda?', 'Где первый неверный шаг?', 'Where is the first incorrect step?'),
    lead: L(
      'Bit yozdi: 48 − 12 : 3 → 36 : 3 → 12.',
      'Bit записал: 48 − 12 : 3 → 36 : 3 → 12.',
      'Bit wrote: 48 − 12 : 3 → 36 : 3 → 12.',
    ),
    hint: L(
      'Ayirishdan oldin yuqori darajali amal bor.',
      'Перед вычитанием есть действие более высокого приоритета.',
      'A higher-priority operation must happen before subtraction.',
    ),
    audio: A(
      'Faqat noto‘g‘ri javobni emas, birinchi xato o‘tishni toping. Keyingi xatolar undan kelib chiqadi.',
      'Найди не только неверный ответ, а первый ошибочный переход. Остальные ошибки следуют из него.',
      'Find not merely the wrong answer, but the first incorrect transition. Every later error follows from it.',
    ),
  },
  {
    type: 'test',
    scope: 'final',
    phase: L('Yakun', 'Финал', 'Final'),
    kicker: L('YAKUNIY TEKSHIRUV', 'ФИНАЛЬНАЯ ПРОВЕРКА', 'FINAL CHECK'),
    title: L('Natija va sabab', 'Результат и основание', 'Result and reason'),
    lead: L(
      '64 : (10 − 2) + 3 · 7 ifodasini hisoblang va birinchi amalni asoslang.',
      'Вычисли 64 : (10 − 2) + 3 · 7 и обоснуй первое действие.',
      'Evaluate 64 : (10 − 2) + 3 · 7 and justify the first operation.',
    ),
    hint: L(
      'Birinchi amal qavs ichida. Yakuniy qiymat yigirmadan katta.',
      'Первое действие находится в скобках. Итоговое значение больше двадцати.',
      'The first operation is inside brackets. The final value is greater than twenty.',
    ),
    audio: A(
      'Yakuniy tekshiruvda birinchi amalni, ifodaning qiymatini va qoida sababini ko‘rsating.',
      'В финальной проверке укажи первое действие, значение выражения и основание правила.',
      'For the final check, give the first operation, the value and the rule that explains your choice.',
    ),
  },
  {
    type: 'summary',
    scope: null,
    phase: L('Xulosa', 'Итог', 'Summary'),
    kicker: L('ASOSIY G‘OYA', 'ГЛАВНАЯ ИДЕЯ', 'CORE IDEA'),
    title: L('Bitta ifoda — bitta tekshirilgan qiymat', 'Одно выражение — одно проверенное значение', 'One expression — one verified value'),
    lead: L(
      'Tartib tasodifiy emas: u sonli ifodaning tuzilishini saqlaydi.',
      'Порядок не случаен: он сохраняет структуру числового выражения.',
      'The order is not arbitrary: it preserves the structure of a numerical expression.',
    ),
    hint: L('', '', ''),
    audio: A(
      'Sonli ifodani hisoblashda avval qavslar, keyin ko‘paytirish va bo‘lish, so‘ng qo‘shish va ayirish bajariladi.',
      'В числовом выражении сначала выполняют действия в скобках, затем умножение и деление, после них сложение и вычитание.',
      'In a numerical expression, evaluate brackets first, then multiplication and division, followed by addition and subtraction.',
    ),
  },
]

function useIsMobile(breakpoint = 720) {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const update = () => setMobile(window.innerWidth < breakpoint)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [breakpoint])
  return mobile
}

function IconButton({ label, onClick, children, active = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        border: `1px solid ${active ? C.primary : C.line}`,
        background: active ? C.primarySoft : C.paper,
        color: active ? C.primary : C.text,
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function PrimaryButton({ children, onClick, disabled = false, style = {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: 44,
        border: 0,
        borderRadius: 12,
        padding: '10px 18px',
        background: disabled ? '#d7d9dc' : C.primary,
        color: disabled ? '#8c929a' : C.paper,
        font: `800 14px ${F.sans}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 8px 20px rgba(254, 91, 26, 0.2)',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function QuietButton({ children, onClick, disabled = false, style = {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: 42,
        border: `1px solid ${C.line}`,
        borderRadius: 12,
        padding: '9px 15px',
        background: C.paper,
        color: disabled ? '#a4a8ad' : C.text,
        font: `750 14px ${F.sans}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function Panel({ children, tone = 'plain', style = {} }) {
  const tones = {
    plain: { background: C.paper, border: C.line },
    orange: { background: C.primarySoft, border: '#ffc8ad' },
    blue: { background: C.blueSoft, border: '#b8e9f7' },
    green: { background: C.greenSoft, border: '#a7e8d1' },
    yellow: { background: C.yellowSoft, border: '#f3dfa0' },
  }
  return (
    <div style={{
      border: `1px solid ${tones[tone].border}`,
      background: tones[tone].background,
      borderRadius: 18,
      padding: 18,
      ...style,
    }}>
      {children}
    </div>
  )
}

function Feedback({ ok, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 9,
        border: `1px solid ${ok ? '#a7e8d1' : '#ffc3c3'}`,
        background: ok ? C.greenSoft : C.redSoft,
        color: ok ? '#087a57' : '#a73b3b',
        borderRadius: 13,
        padding: '10px 13px',
        font: `700 13px/1.4 ${F.sans}`,
      }}
    >
      {ok ? <Check size={18} /> : <X size={18} />}
      <span>{children}</span>
    </motion.div>
  )
}

function ChoiceGrid({ options, selected, onSelect, lang, mobile, columns = 2, locked = false }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: mobile || columns === 1 ? '1fr' : `repeat(${columns}, minmax(0, 1fr))`,
      gap: mobile ? 8 : 10,
    }}>
      {options.map((option) => {
        const isSelected = selected === option.id
        return (
          <button
            type="button"
            key={option.id}
            disabled={locked}
            onClick={() => onSelect(option)}
            style={{
              minHeight: mobile ? 42 : 48,
              borderRadius: 13,
              border: `1.5px solid ${isSelected ? C.primary : C.line}`,
              background: isSelected ? C.primarySoft : C.paper,
              color: C.text,
              padding: mobile ? '8px 11px' : '11px 14px',
              textAlign: 'left',
              font: `750 ${mobile ? 13 : 14}px/1.3 ${F.sans}`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: locked ? 'default' : 'pointer',
            }}
          >
            {option.code && (
              <span style={{
                color: C.primary,
                font: `800 12px ${F.mono}`,
                minWidth: 20,
              }}>
                {option.code}
              </span>
            )}
            <span>{tr(option.label, lang)}</span>
          </button>
        )
      })}
    </div>
  )
}

function HookVisual() {
  return (
    <svg viewBox="0 0 620 190" role="img" aria-label="18 minus 6 divided by 3 plus 4" style={{ width: '100%', maxHeight: 190 }}>
      <rect x="12" y="18" width="596" height="154" rx="26" fill={C.paper} stroke={C.line} />
      <path d="M310 36V154" stroke={C.line} strokeDasharray="7 7" />
      <text x="310" y="72" textAnchor="middle" fontFamily={F.serif} fontWeight="800" fontSize="32" fill={C.text}>18 − 6 : 3 + 4</text>
      <circle cx="170" cy="125" r="32" fill={C.primarySoft} stroke="#ffc8ad" />
      <circle cx="450" cy="125" r="32" fill={C.blueSoft} stroke="#b8e9f7" />
      <text x="170" y="132" textAnchor="middle" fontFamily={F.serif} fontWeight="900" fontSize="23" fill={C.primary}>20</text>
      <text x="450" y="132" textAnchor="middle" fontFamily={F.serif} fontWeight="900" fontSize="23" fill={C.blue}>8</text>
      <text x="117" y="132" textAnchor="end" fontFamily={F.mono} fontWeight="800" fontSize="12" fill={C.muted}>NOVA</text>
      <text x="503" y="132" fontFamily={F.mono} fontWeight="800" fontSize="12" fill={C.muted}>BIT</text>
    </svg>
  )
}

function HookActivity({ lang, storedAnswer, onAnswer, mobile }) {
  const options = [
    { id: 'two-values', label: L('Ifoda ikkita qiymatga ega', 'У выражения два значения', 'The expression has two values') },
    { id: 'different-order', label: L('Modullar amallarni turli tartibda bajargan', 'Модули выполняли действия в разном порядке', 'The modules used different operation orders') },
    { id: 'not-enough', label: L('Ma’lumot yetarli emas', 'Недостаточно данных', 'There is not enough information') },
  ]
  const selected = storedAnswer?.picked ?? null
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <HookVisual />
      <ChoiceGrid
        options={options}
        selected={selected}
        onSelect={(option) => onAnswer({ type: 'hook', picked: option.id })}
        lang={lang}
        mobile={mobile}
        columns={3}
      />
      {selected && (
        <Feedback ok={selected === 'different-order'}>
          {tr(L(
            'Tekshiriladigan gipoteza aniq: tartib natijani o‘zgartirgan.',
            'Гипотеза определена: результат изменился из-за порядка действий.',
            'The testable hypothesis is clear: the operation order changed the result.',
          ), lang)}
        </Feedback>
      )}
    </div>
  )
}

function DiagnosticActivity({ lang, storedAnswer, onAnswer, mobile }) {
  const [values, setValues] = useState(storedAnswer?.responses ?? {})
  const [done, setDone] = useState(Boolean(storedAnswer))
  const tasks = [
    { id: 'a', expr: '7 + 2 · 5', options: ['17', '45', '19'], correct: '17' },
    { id: 'b', expr: '(15 − 3) : 4', options: ['3', '6', '12'], correct: '3' },
    { id: 'c', expr: '24 : 6 · 2', options: ['2', '8', '12'], correct: '8' },
  ]
  const submit = () => {
    const correctCount = tasks.filter((task) => values[task.id] === task.correct).length
    onAnswer({ type: 'diagnostic', correct: null, responses: values, correctCount })
    setDone(true)
  }
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {tasks.map((task, index) => (
        <Panel key={task.id} style={{
          padding: mobile ? 10 : 12,
          display: 'grid',
          gridTemplateColumns: mobile ? '95px 1fr' : '150px 1fr',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{ font: `850 ${mobile ? 18 : 21}px ${F.serif}`, color: C.text }}>
            <span style={{ color: C.primary, font: `800 11px ${F.mono}`, marginRight: 8 }}>0{index + 1}</span>
            {task.expr}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
            {task.options.map((value) => (
              <button
                type="button"
                key={value}
                disabled={done}
                onClick={() => setValues((current) => ({ ...current, [task.id]: value }))}
                style={{
                  minHeight: 36,
                  borderRadius: 10,
                  border: `1px solid ${values[task.id] === value ? C.primary : C.line}`,
                  background: values[task.id] === value ? C.primarySoft : C.paper,
                  font: `800 14px ${F.mono}`,
                  cursor: done ? 'default' : 'pointer',
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </Panel>
      ))}
      {!done ? (
        <PrimaryButton
          disabled={Object.keys(values).length !== tasks.length}
          onClick={submit}
          style={{ justifySelf: 'end' }}
        >
          <Check size={17} /> {tr(UI.check, lang)}
        </PrimaryButton>
      ) : (
        <Feedback ok>
          {tr(L(
            `Faollashtirildi: ${storedAnswer?.correctCount ?? tasks.filter((task) => values[task.id] === task.correct).length} / 3.`,
            `Активировано: ${storedAnswer?.correctCount ?? tasks.filter((task) => values[task.id] === task.correct).length} из 3.`,
            `Activated: ${storedAnswer?.correctCount ?? tasks.filter((task) => values[task.id] === task.correct).length} of 3.`,
          ), lang)}
        </Feedback>
      )}
    </div>
  )
}

function MultiSelectActivity({ lang, storedAnswer, onAnswer, mobile, audio }) {
  const sfx = useSfx()
  const tokens = ['18', '−', '6', ':', '3', '+', '4']
  const correct = ['−', ':', '+']
  const [selected, setSelected] = useState(storedAnswer?.selected ?? [])
  const [message, setMessage] = useState(storedAnswer ? 'ok' : null)
  const [mistakes, setMistakes] = useState(storedAnswer?.mistakes ?? 0)
  const toggle = (token) => {
    if (storedAnswer) return
    setSelected((current) => current.includes(token) ? current.filter((item) => item !== token) : [...current, token])
    setMessage(null)
  }
  const check = () => {
    const ok = selected.length === correct.length && correct.every((item) => selected.includes(item))
    if (!ok) {
      setMistakes((value) => value + 1)
      setMessage('wrong')
      sfx.playWrong()
      audio.pushOneOff(tr(A(
        'Sonlarni emas, faqat amal belgilarini tanlang.',
        'Выбирай только знаки действий, а не числа.',
        'Select only operation signs, not numbers.',
      ), lang))
      return
    }
    sfx.playCorrect()
    setMessage('ok')
    onAnswer({ type: 'multi-select', correct: mistakes === 0, selected, mistakes })
  }
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <Panel tone="orange" style={{ display: 'flex', justifyContent: 'center', gap: mobile ? 7 : 12, padding: mobile ? 14 : 24 }}>
        {tokens.map((token, index) => (
          <button
            type="button"
            key={`${token}-${index}`}
            onClick={() => toggle(token)}
            style={{
              width: mobile ? 38 : 54,
              height: mobile ? 46 : 58,
              borderRadius: 12,
              border: `1.5px solid ${selected.includes(token) ? C.primary : C.line}`,
              background: selected.includes(token) ? C.primary : C.paper,
              color: selected.includes(token) ? C.paper : C.text,
              font: `850 ${mobile ? 20 : 27}px ${F.serif}`,
              cursor: 'pointer',
            }}
          >
            {token}
          </button>
        ))}
      </Panel>
      <PrimaryButton onClick={check} disabled={selected.length === 0 || Boolean(storedAnswer)} style={{ justifySelf: 'end' }}>
        <Check size={17} /> {tr(UI.check, lang)}
      </PrimaryButton>
      {message === 'wrong' && <Feedback ok={false}>{tr(L('Uchta amal belgisi kerak.', 'Нужно выбрать три знака действий.', 'Select three operation signs.'), lang)}</Feedback>}
      {message === 'ok' && <Feedback ok>{tr(L('Ayirish, bo‘lish va qo‘shish — ifodadagi amallar.', 'Вычитание, деление и сложение — действия выражения.', 'Subtraction, division and addition are the operations.'), lang)}</Feedback>}
    </div>
  )
}

function ClassifyActivity({ lang, storedAnswer, onAnswer, mobile, audio }) {
  const sfx = useSfx()
  const rows = [
    { id: 'expression', value: '7 + 5 · 2', correct: 'expression' },
    { id: 'equality', value: '7 + 5 · 2 = 17', correct: 'equality' },
    { id: 'invalid', value: '8 : 0', correct: 'invalid' },
  ]
  const categories = [
    { id: 'expression', label: L('Ifoda', 'Выражение', 'Expression') },
    { id: 'equality', label: L('Tenglik', 'Равенство', 'Equality') },
    { id: 'invalid', label: L('Taqiqlangan', 'Недопустимо', 'Invalid') },
  ]
  const [values, setValues] = useState(storedAnswer?.responses ?? {})
  const [message, setMessage] = useState(storedAnswer ? 'ok' : null)
  const [mistakes, setMistakes] = useState(storedAnswer?.mistakes ?? 0)
  const check = () => {
    const wrong = rows.find((row) => values[row.id] !== row.correct)
    if (wrong) {
      setMistakes((value) => value + 1)
      setMessage(wrong.id)
      sfx.playWrong()
      audio.pushOneOff(tr(A(
        'Tenglik belgisi va nolga bo‘lish holatini yana tekshiring.',
        'Ещё раз проверь знак равенства и деление на ноль.',
        'Check the equals sign and division by zero once more.',
      ), lang))
      return
    }
    sfx.playCorrect()
    setMessage('ok')
    onAnswer({ type: 'classify', correct: mistakes === 0, responses: values, mistakes })
  }
  return (
    <div style={{ display: 'grid', gap: 9 }}>
      {rows.map((row) => (
        <Panel key={row.id} style={{
          padding: mobile ? 10 : 12,
          display: 'grid',
          gridTemplateColumns: mobile ? '110px 1fr' : '190px 1fr',
          alignItems: 'center',
          gap: 10,
        }}>
          <strong style={{ font: `850 ${mobile ? 17 : 21}px ${F.serif}` }}>{row.value}</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                disabled={Boolean(storedAnswer)}
                onClick={() => {
                  setValues((current) => ({ ...current, [row.id]: category.id }))
                  setMessage(null)
                }}
                style={{
                  minHeight: 34,
                  borderRadius: 9,
                  border: `1px solid ${values[row.id] === category.id ? C.primary : C.line}`,
                  background: values[row.id] === category.id ? C.primarySoft : C.paper,
                  color: C.text,
                  font: `750 ${mobile ? 10 : 12}px ${F.sans}`,
                  cursor: 'pointer',
                }}
              >
                {tr(category.label, lang)}
              </button>
            ))}
          </div>
        </Panel>
      ))}
      <PrimaryButton disabled={Object.keys(values).length !== rows.length || Boolean(storedAnswer)} onClick={check} style={{ justifySelf: 'end' }}>
        <Check size={17} /> {tr(UI.check, lang)}
      </PrimaryButton>
      {message && message !== 'ok' && <Feedback ok={false}>{tr(L('Bitta tur noto‘g‘ri. Belgilarga e’tibor bering.', 'Один тип определён неверно. Обрати внимание на знаки.', 'One type is incorrect. Pay attention to the symbols.'), lang)}</Feedback>}
      {message === 'ok' && <Feedback ok>{tr(L('Uchala matematik obyekt to‘g‘ri ajratildi.', 'Все три математических объекта определены верно.', 'All three mathematical objects are classified correctly.'), lang)}</Feedback>}
    </div>
  )
}

function SequenceActivity({ lang, storedAnswer, onAnswer, mobile, audio, items, order, resultText }) {
  const sfx = useSfx()
  const [chosen, setChosen] = useState(storedAnswer?.chosen ?? [])
  const [mistakes, setMistakes] = useState(storedAnswer?.mistakes ?? 0)
  const [wrong, setWrong] = useState(false)
  const complete = chosen.length === order.length
  const choose = (item) => {
    if (complete || chosen.includes(item.id)) return
    const expected = order[chosen.length]
    if (item.id !== expected) {
      setMistakes((value) => value + 1)
      setWrong(true)
      sfx.playWrong()
      audio.pushOneOff(tr(A(
        'Bu qadam hali erta. Ifodaning tuzilishini yana tekshiring.',
        'Для этого шага ещё рано. Снова проверь структуру выражения.',
        'It is too early for that step. Inspect the structure again.',
      ), lang))
      return
    }
    setWrong(false)
    const next = [...chosen, item.id]
    setChosen(next)
    if (next.length === order.length) {
      sfx.playCorrect()
      onAnswer({ type: 'sequence', correct: mistakes === 0, chosen: next, mistakes })
    }
  }
  const reset = () => {
    if (storedAnswer) return
    setChosen([])
    setMistakes(0)
    setWrong(false)
  }
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${order.length}, minmax(0, 1fr))`, gap: mobile ? 6 : 9 }}>
        {order.map((_, index) => {
          const item = items.find((candidate) => candidate.id === chosen[index])
          return (
            <div key={index} style={{
              minHeight: mobile ? 48 : 62,
              borderRadius: 12,
              border: `1.5px dashed ${item ? C.primary : '#bfc3c8'}`,
              background: item ? C.primarySoft : C.paper,
              display: 'grid',
              placeItems: 'center',
              padding: 7,
              textAlign: 'center',
              color: item ? C.text : C.muted,
              font: `750 ${mobile ? 10 : 12}px/1.25 ${F.sans}`,
            }}>
              {item ? tr(item.label, lang) : `${index + 1}`}
            </div>
          )
        })}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr 1fr' : `repeat(${Math.min(items.length, 4)}, minmax(0, 1fr))`,
        gap: 8,
      }}>
        {items.map((item) => {
          const used = chosen.includes(item.id)
          return (
            <button
              type="button"
              key={item.id}
              disabled={used || complete}
              onClick={() => choose(item)}
              style={{
                minHeight: mobile ? 42 : 50,
                border: `1px solid ${used ? '#cfd2d6' : C.line}`,
                borderRadius: 11,
                background: used ? C.inkSoft : C.paper,
                color: used ? '#a0a4aa' : C.text,
                padding: '8px 10px',
                font: `750 ${mobile ? 11 : 13}px/1.25 ${F.sans}`,
                cursor: used || complete ? 'default' : 'pointer',
              }}
            >
              {tr(item.label, lang)}
            </button>
          )
        })}
      </div>
      {!complete && chosen.length > 0 && (
        <QuietButton onClick={reset} style={{ justifySelf: 'start' }}>
          <RotateCcw size={16} /> {tr(UI.reset, lang)}
        </QuietButton>
      )}
      {wrong && <Feedback ok={false}>{tr(L('Tartibni qavs va amal darajasidan boshlang.', 'Начинай порядок со скобок и приоритета действий.', 'Start from brackets and operation priority.'), lang)}</Feedback>}
      {complete && <Feedback ok>{tr(resultText, lang)}</Feedback>}
    </div>
  )
}

function PairValuesActivity({ lang, storedAnswer, onAnswer, mobile, audio }) {
  const sfx = useSfx()
  const [left, setLeft] = useState(storedAnswer?.left ?? null)
  const [right, setRight] = useState(storedAnswer?.right ?? null)
  const [mistakes, setMistakes] = useState(storedAnswer?.mistakes ?? 0)
  const [message, setMessage] = useState(storedAnswer ? 'ok' : null)
  const values = ['14', '20', '24', '32']
  const check = () => {
    if (left !== '14' || right !== '20') {
      setMistakes((value) => value + 1)
      setMessage('wrong')
      sfx.playWrong()
      audio.pushOneOff(tr(A(
        'Birinchi ifodada ko‘paytirishni, ikkinchisida qavs ichidagi qo‘shishni avval bajaring.',
        'В первом выражении сначала умножай, а во втором сначала сложи числа в скобках.',
        'Multiply first in the first expression and add inside the brackets first in the second.',
      ), lang))
      return
    }
    setMessage('ok')
    sfx.playCorrect()
    onAnswer({ type: 'pair-values', correct: mistakes === 0, left, right, mistakes })
  }
  const card = (expression, value, setValue) => (
    <Panel tone="orange" style={{ display: 'grid', gap: 10, textAlign: 'center', padding: mobile ? 12 : 18 }}>
      <strong style={{ font: `900 ${mobile ? 24 : 31}px ${F.serif}` }}>{expression}</strong>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {values.map((option) => (
          <button
            type="button"
            key={option}
            disabled={Boolean(storedAnswer)}
            onClick={() => {
              setValue(option)
              setMessage(null)
            }}
            style={{
              minHeight: 38,
              borderRadius: 9,
              border: `1px solid ${value === option ? C.primary : C.line}`,
              background: value === option ? C.primary : C.paper,
              color: value === option ? C.paper : C.text,
              font: `800 13px ${F.mono}`,
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </Panel>
  )
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 10 }}>
        {card('2 + 3 · 4', left, setLeft)}
        {card('(2 + 3) · 4', right, setRight)}
      </div>
      <PrimaryButton disabled={!left || !right || Boolean(storedAnswer)} onClick={check} style={{ justifySelf: 'end' }}>
        <Check size={17} /> {tr(UI.check, lang)}
      </PrimaryButton>
      {message === 'wrong' && <Feedback ok={false}>{tr(L('Qavslar birinchi amalni o‘zgartiradi.', 'Скобки меняют первое действие.', 'Brackets change the first operation.'), lang)}</Feedback>}
      {message === 'ok' && <Feedback ok>{tr(L('Qavslar natijani 14 dan 20 ga o‘zgartirdi.', 'Скобки изменили значение с 14 на 20.', 'The brackets changed the value from 14 to 20.'), lang)}</Feedback>}
    </div>
  )
}

function DualAnswerActivity({ lang, storedAnswer, onAnswer, mobile, audio, final = false }) {
  const sfx = useSfx()
  const [first, setFirst] = useState(storedAnswer?.first ?? null)
  const [reason, setReason] = useState(storedAnswer?.reason ?? null)
  const [value, setValue] = useState(storedAnswer?.value ?? '')
  const [mistakes, setMistakes] = useState(storedAnswer?.mistakes ?? 0)
  const [message, setMessage] = useState(storedAnswer ? 'ok' : null)
  const firstOptions = final
    ? [
        { id: 'brackets', label: L('10 − 2', '10 − 2', '10 − 2') },
        { id: 'division', label: L('64 : 10', '64 : 10', '64 : 10') },
        { id: 'multiply', label: L('3 · 7', '3 · 7', '3 · 7') },
      ]
    : [
        { id: 'brackets', label: L('9 + 3', '9 + 3', '9 + 3') },
        { id: 'multiply', label: L('4 · 9', '4 · 9', '4 · 9') },
        { id: 'division', label: L('3 : 6', '3 : 6', '3 : 6') },
      ]
  const reasonOptions = [
    { id: 'brackets-first', label: L('Qavs ichidagi amal birinchi', 'Действие в скобках выполняется первым', 'The operation in brackets comes first') },
    { id: 'left-only', label: L('Har doim eng chap amal birinchi', 'Всегда первым идёт самое левое действие', 'The leftmost operation always comes first') },
    { id: 'largest', label: L('Eng katta sonli amal birinchi', 'Сначала действие с самым большим числом', 'The operation with the largest number comes first') },
  ]
  const expectedValue = final ? '29' : '52'
  const check = () => {
    const ok = first === 'brackets' && value.trim() === expectedValue && (!final || reason === 'brackets-first')
    if (!ok) {
      setMistakes((count) => count + 1)
      setMessage('wrong')
      sfx.playWrong()
      audio.pushOneOff(tr(A(
        'Birinchi amal qavs ichida. Keyin teng darajadagi amallarni chapdan o‘ngga bajaring.',
        'Первое действие находится в скобках. Затем выполняй равноправные действия слева направо.',
        'The first operation is inside the brackets. Then perform equal-priority operations from left to right.',
      ), lang))
      return
    }
    setMessage('ok')
    sfx.playCorrect()
    onAnswer({
      type: final ? 'final-test' : 'numeric-test',
      correct: mistakes === 0,
      first,
      reason: final ? reason : undefined,
      value,
      mistakes,
    })
  }
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: mobile || !final ? '1fr' : '1fr 1fr', gap: 12 }}>
        <div style={{ display: 'grid', gap: 7 }}>
          <span style={{ font: `800 11px ${F.mono}`, color: C.muted, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            {tr(L('Birinchi amal', 'Первое действие', 'First operation'), lang)}
          </span>
          <ChoiceGrid options={firstOptions} selected={first} onSelect={(option) => { setFirst(option.id); setMessage(null) }} lang={lang} mobile={mobile} columns={1} locked={Boolean(storedAnswer)} />
        </div>
        {final && (
          <div style={{ display: 'grid', gap: 7 }}>
            <span style={{ font: `800 11px ${F.mono}`, color: C.muted, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              {tr(L('Sabab', 'Основание', 'Reason'), lang)}
            </span>
            <ChoiceGrid options={reasonOptions} selected={reason} onSelect={(option) => { setReason(option.id); setMessage(null) }} lang={lang} mobile={mobile} columns={1} locked={Boolean(storedAnswer)} />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end', gap: 10 }}>
        <label style={{ display: 'grid', gap: 5 }}>
          <span style={{ font: `800 11px ${F.mono}`, color: C.muted, textTransform: 'uppercase' }}>
            {tr(L('Qiymat', 'Значение', 'Value'), lang)}
          </span>
          <input
            inputMode="numeric"
            value={value}
            disabled={Boolean(storedAnswer)}
            onChange={(event) => {
              setValue(event.target.value)
              setMessage(null)
            }}
            placeholder="0"
            style={{
              width: 110,
              height: 44,
              border: `1.5px solid ${C.line}`,
              borderRadius: 11,
              padding: '0 13px',
              background: C.paper,
              color: C.text,
              font: `850 18px ${F.mono}`,
              outline: 'none',
            }}
          />
        </label>
        <PrimaryButton disabled={!first || !value || (final && !reason) || Boolean(storedAnswer)} onClick={check}>
          <ShieldCheck size={17} /> {tr(UI.check, lang)}
        </PrimaryButton>
      </div>
      {message === 'wrong' && <Feedback ok={false}>{tr(L('Birinchi amal va qiymatni yana tekshiring.', 'Ещё раз проверь первое действие и значение.', 'Check the first operation and value again.'), lang)}</Feedback>}
      {message === 'ok' && <Feedback ok>{tr(final ? L('Yakuniy protokol to‘liq asoslandi.', 'Финальный протокол полностью обоснован.', 'The final protocol is fully justified.') : L('Birinchi amal va 52 qiymati to‘g‘ri.', 'Первое действие и значение 52 верны.', 'The first operation and the value 52 are correct.'), lang)}</Feedback>}
    </div>
  )
}

function OpenStrategyActivity({ lang, storedAnswer, onAnswer, mobile }) {
  const grade = useGrader()
  const sfx = useSfx()
  const [answer, setAnswer] = useState(storedAnswer?.answerText ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(storedAnswer ? {
    correct: storedAnswer.correct,
    feedback: storedAnswer.feedback,
  } : null)
  const question = tr(L(
    '25 · 17 · 4 ni qanday qulay hisoblash mumkin?',
    'Как удобно вычислить 25 · 17 · 4?',
    'What is a convenient way to calculate 25 · 17 · 4?',
  ), lang)
  const rubric = tr(L(
    'Javobda 25 va 4 ni avval ko‘paytirib 100 olish, so‘ng 17 ga ko‘paytirish va guruhlash xossasi aytilishi kerak.',
    'Ответ должен предложить сначала умножить 25 на 4, получить 100, затем умножить на 17 и сослаться на перегруппировку множителей.',
    'The answer should group 25 and 4 first to make 100, then multiply by 17 and refer to regrouping factors.',
  ), lang)
  const submit = async () => {
    if (!answer.trim() || submitting || storedAnswer) return
    setSubmitting(true)
    try {
      const response = await grade({
        screenIdx: 12,
        question,
        rubric,
        mode: 'text',
        answerText: answer.trim(),
      })
      const next = { correct: response?.correct ?? null, feedback: response?.feedback || tr(L('Javob qabul qilindi.', 'Ответ принят.', 'Answer received.'), lang) }
      setResult(next)
      if (next.correct === true) sfx.playCorrect()
      if (next.correct === false) sfx.playWrong()
      onAnswer({ type: 'ai-open', correct: next.correct, answerText: answer.trim(), feedback: next.feedback })
    } catch {
      const feedback = tr(L(
        'Tekshiruv hozir mavjud emas. Javob saqlandi va darsni davom ettirish mumkin.',
        'Проверка сейчас недоступна. Ответ сохранён, можно продолжать урок.',
        'Grading is unavailable right now. Your answer was saved and you may continue.',
      ), lang)
      setResult({ correct: null, feedback })
      onAnswer({ type: 'ai-open', correct: null, answerText: answer.trim(), feedback })
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div style={{ display: 'grid', gap: 11 }}>
      <Panel tone="yellow" style={{ padding: mobile ? 12 : 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ font: `900 ${mobile ? 26 : 34}px ${F.serif}` }}>25 · 17 · 4</span>
          <ArrowRight size={20} color={C.primary} />
          <span style={{ font: `850 ${mobile ? 18 : 24}px ${F.serif}`, color: C.primary }}>(25 · 4) · 17</span>
        </div>
      </Panel>
      <textarea
        value={answer}
        disabled={Boolean(storedAnswer)}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder={tr(L('Ikki jumlada tushuntiring…', 'Объясни в двух предложениях…', 'Explain in two sentences…'), lang)}
        style={{
          width: '100%',
          minHeight: mobile ? 76 : 96,
          resize: 'none',
          border: `1.5px solid ${C.line}`,
          borderRadius: 13,
          background: C.paper,
          color: C.text,
          padding: 13,
          font: `600 14px/1.5 ${F.sans}`,
          boxSizing: 'border-box',
          outline: 'none',
        }}
      />
      {!result && (
        <PrimaryButton disabled={answer.trim().length < 12 || submitting} onClick={submit} style={{ justifySelf: 'end' }}>
          <Send size={17} /> {submitting ? tr(L('Tekshirilmoqda…', 'Проверяем…', 'Checking…'), lang) : tr(UI.check, lang)}
        </PrimaryButton>
      )}
      {result && <Feedback ok={result.correct !== false}>{result.feedback}</Feedback>}
    </div>
  )
}

function ErrorAuditActivity({ lang, storedAnswer, onAnswer, mobile, audio }) {
  const options = [
    {
      id: 'subtract',
      label: L('48 − 12 ni birinchi bajarish', 'Сначала выполнить 48 − 12', 'Subtract 12 from 48 first'),
      correct: true,
      wrong: L('', '', ''),
    },
    {
      id: 'divide-result',
      label: L('36 : 3 ni hisoblash', 'Вычислить 36 : 3', 'Calculate 36 : 3'),
      correct: false,
      wrong: L('Bu keyingi qadam. Birinchi xato oldinroq sodir bo‘lgan.', 'Это следующий шаг. Первая ошибка появилась раньше.', 'That is a later step. The first error happened earlier.'),
    },
    {
      id: 'answer',
      label: L('12 yakuniy javobini yozish', 'Записать итоговый ответ 12', 'Write 12 as the final answer'),
      correct: false,
      wrong: L('Yakuniy javob xato, lekin uning sababi oldingi qadamda.', 'Ответ неверен, но причина находится в предыдущем переходе.', 'The answer is wrong, but its cause is in an earlier transition.'),
    },
  ]
  return (
    <QuizActivity
      lang={lang}
      storedAnswer={storedAnswer}
      onAnswer={onAnswer}
      mobile={mobile}
      audio={audio}
      options={options}
      correctText={L('Birinchi xato — ayirishni bo‘lishdan oldin bajarish.', 'Первая ошибка — вычитание выполнено раньше деления.', 'The first error is subtracting before dividing.')}
      type="error-audit"
    />
  )
}

function QuizActivity({ lang, storedAnswer, onAnswer, mobile, audio, options, correctText, type }) {
  const sfx = useSfx()
  const [selected, setSelected] = useState(storedAnswer?.picked ?? null)
  const [wrongText, setWrongText] = useState(null)
  const [mistakes, setMistakes] = useState(storedAnswer?.mistakes ?? 0)
  const resolved = Boolean(storedAnswer)
  const choose = (option) => {
    if (resolved) return
    setSelected(option.id)
    if (!option.correct) {
      setMistakes((count) => count + 1)
      setWrongText(option.wrong)
      sfx.playWrong()
      audio.pushOneOff(tr(A(
        'Bu variant birinchi sababni ko‘rsatmaydi. Oldingi o‘tishni tekshiring.',
        'Этот вариант не показывает первую причину. Проверь предыдущий переход.',
        'This option does not identify the first cause. Inspect the earlier transition.',
      ), lang))
      return
    }
    setWrongText(null)
    sfx.playCorrect()
    onAnswer({ type, correct: mistakes === 0, picked: option.id, mistakes })
  }
  return (
    <div style={{ display: 'grid', gap: 11 }}>
      <ChoiceGrid options={options} selected={selected} onSelect={choose} lang={lang} mobile={mobile} columns={1} locked={resolved} />
      {wrongText && <Feedback ok={false}>{tr(wrongText, lang)}</Feedback>}
      {resolved && <Feedback ok>{tr(correctText, lang)}</Feedback>}
    </div>
  )
}

function SummaryActivity({ lang, studentName, answers, onFinish, finished, mobile }) {
  const scored = Object.values(answers).filter((answer) => typeof answer.correct === 'boolean')
  const correct = scored.filter((answer) => answer.correct).length
  const percent = scored.length ? Math.round((correct / scored.length) * 100) : 100
  const message = percent >= 85
    ? L('Protokol ishonchli ishlayapti.', 'Протокол работает уверенно.', 'Your protocol is working reliably.')
    : percent >= 60
      ? L('Asosiy tartib tushunildi. Xato auditini yana mashq qiling.', 'Основной порядок понят. Ещё потренируй аудит ошибок.', 'You understand the core order. Practise error auditing once more.')
      : L('Qavslar va amal darajalariga yana qayting.', 'Вернись к скобкам и уровням действий.', 'Review brackets and operation levels once more.')
  const rules = [
    L('Qavs ichidagi amallar birinchi bajariladi.', 'Действия в скобках выполняются первыми.', 'Operations in brackets come first.'),
    L('Ko‘paytirish va bo‘lish chapdan o‘ngga bajariladi.', 'Умножение и деление выполняются слева направо.', 'Multiplication and division go from left to right.'),
    L('Qo‘shish va ayirish ham chapdan o‘ngga bajariladi.', 'Сложение и вычитание тоже выполняются слева направо.', 'Addition and subtraction also go from left to right.'),
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '0.72fr 1.28fr', gap: 14 }}>
      <Panel tone="orange" style={{ display: 'grid', alignContent: 'center', justifyItems: 'center', textAlign: 'center', gap: 8 }}>
        <Sparkles size={28} color={C.primary} />
        <strong style={{ font: `900 ${mobile ? 38 : 52}px ${F.serif}`, color: C.primary }}>{percent}%</strong>
        <span style={{ font: `800 13px ${F.sans}`, color: C.text }}>{studentName}</span>
        <span style={{ font: `650 12px/1.4 ${F.sans}`, color: C.muted }}>{tr(message, lang)}</span>
      </Panel>
      <Panel style={{ display: 'grid', gap: 10 }}>
        {rules.map((rule, index) => (
          <div key={index} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 9, alignItems: 'start' }}>
            <span style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              display: 'grid',
              placeItems: 'center',
              background: C.greenSoft,
              color: C.green,
              font: `900 12px ${F.mono}`,
            }}>
              {index + 1}
            </span>
            <span style={{ font: `700 ${mobile ? 12 : 14}px/1.45 ${F.sans}`, color: C.text }}>{tr(rule, lang)}</span>
          </div>
        ))}
        <PrimaryButton onClick={onFinish} disabled={finished} style={{ marginTop: 3, width: '100%' }}>
          <Check size={18} /> {finished ? tr(L('Natija saqlandi', 'Результат сохранён', 'Result saved'), lang) : tr(UI.finish, lang)}
        </PrimaryButton>
      </Panel>
    </div>
  )
}

function Activity({ screenIdx, lang, storedAnswer, onAnswer, mobile, audio, studentName, answers, onFinish, finished }) {
  const sequenceData = {
    4: {
      items: [
        { id: 'expression', label: L('Sonli ifoda', 'Числовое выражение', 'Numerical expression') },
        { id: 'calculate', label: L('Amallarni bajarish', 'Выполнение действий', 'Perform operations') },
        { id: 'value', label: L('Ifoda qiymati', 'Значение выражения', 'Expression value') },
      ],
      order: ['expression', 'calculate', 'value'],
      result: L('Ifoda hisoblash orqali bitta qiymatga olib keladi.', 'Вычисление приводит выражение к одному значению.', 'Calculation takes an expression to one value.'),
    },
    6: {
      items: [
        { id: 'brackets', label: L('Qavslar', 'Скобки', 'Brackets') },
        { id: 'high', label: L('Ko‘paytirish va bo‘lish', 'Умножение и деление', 'Multiplication and division') },
        { id: 'low', label: L('Qo‘shish va ayirish', 'Сложение и вычитание', 'Addition and subtraction') },
      ],
      order: ['brackets', 'high', 'low'],
      result: L('Uch darajali tartib to‘g‘ri tuzildi.', 'Трёхуровневый порядок собран верно.', 'The three-level order is correct.'),
    },
    7: {
      items: [
        { id: 'bracket', label: L('9 − 3', '9 − 3', '9 − 3') },
        { id: 'divide', label: L('36 : 6', '36 : 6', '36 : 6') },
        { id: 'multiply', label: L('5 · 2', '5 · 2', '5 · 2') },
        { id: 'add', label: L('6 + 10', '6 + 10', '6 + 10') },
      ],
      order: ['bracket', 'divide', 'multiply', 'add'],
      result: L('Daraxtning qiymati 16 ga teng.', 'Значение дерева равно 16.', 'The value of the tree is 16.'),
    },
    8: {
      items: [
        { id: 'brackets', label: L('Qavslarni hisoblang', 'Вычисли скобки', 'Evaluate brackets') },
        { id: 'high', label: L('Yuqori darajali amallar', 'Действия высокого уровня', 'Higher-priority operations') },
        { id: 'low', label: L('Past darajali amallar', 'Действия низкого уровня', 'Lower-priority operations') },
        { id: 'verify', label: L('Natijani tekshiring', 'Проверь результат', 'Verify the result') },
      ],
      order: ['brackets', 'high', 'low', 'verify'],
      result: L('Hisoblash protokoli tayyor.', 'Протокол вычисления готов.', 'The calculation protocol is complete.'),
    },
    9: {
      items: [
        { id: 'divide', label: L('18 : 3', '18 : 3', '18 : 3') },
        { id: 'multiply', label: L('6 · 2', '6 · 2', '6 · 2') },
        { id: 'subtract', label: L('42 − 12', '42 − 12', '42 − 12') },
      ],
      order: ['divide', 'multiply', 'subtract'],
      result: L('Yakuniy qiymat 30. Teng darajada chapdan o‘ngga yurildi.', 'Итоговое значение 30. Равноправные действия выполнены слева направо.', 'The final value is 30. Equal-priority operations went left to right.'),
    },
    10: {
      items: [
        { id: 'bracket', label: L('8 − 2', '8 − 2', '8 − 2') },
        { id: 'divide', label: L('24 : 6', '24 : 6', '24 : 6') },
        { id: 'multiply', label: L('4 · 3', '4 · 3', '4 · 3') },
        { id: 'add', label: L('7 + 12', '7 + 12', '7 + 12') },
      ],
      order: ['bracket', 'divide', 'multiply', 'add'],
      result: L('Zinapoyaning yuqorisida 19 qiymati hosil bo‘ldi.', 'На вершине лестницы получилось значение 19.', 'The ladder ends at the value 19.'),
    },
  }
  if (screenIdx === 0) return <HookActivity {...{ lang, storedAnswer, onAnswer, mobile }} />
  if (screenIdx === 1) return <DiagnosticActivity {...{ lang, storedAnswer, onAnswer, mobile }} />
  if (screenIdx === 2) return <MultiSelectActivity {...{ lang, storedAnswer, onAnswer, mobile, audio }} />
  if (screenIdx === 3) return <ClassifyActivity {...{ lang, storedAnswer, onAnswer, mobile, audio }} />
  if (sequenceData[screenIdx]) {
    const data = sequenceData[screenIdx]
    return <SequenceActivity {...{ lang, storedAnswer, onAnswer, mobile, audio }} items={data.items} order={data.order} resultText={data.result} />
  }
  if (screenIdx === 5) return <PairValuesActivity {...{ lang, storedAnswer, onAnswer, mobile, audio }} />
  if (screenIdx === 11) return <DualAnswerActivity {...{ lang, storedAnswer, onAnswer, mobile, audio }} />
  if (screenIdx === 12) return <OpenStrategyActivity {...{ lang, storedAnswer, onAnswer, mobile }} />
  if (screenIdx === 13) return <ErrorAuditActivity {...{ lang, storedAnswer, onAnswer, mobile, audio }} />
  if (screenIdx === 14) return <DualAnswerActivity {...{ lang, storedAnswer, onAnswer, mobile, audio }} final />
  if (screenIdx === 15) return <SummaryActivity {...{ lang, studentName, answers, onFinish, finished, mobile }} />
  return null
}

export default function Grade7Dars01({ studentName, lang = 'uz', onFinished }) {
  const safeLang = ['uz', 'ru', 'en'].includes(lang) ? lang : 'uz'
  const safeName = studentName || (safeLang === 'ru' ? 'Ученик' : safeLang === 'en' ? 'Student' : "O'quvchi")
  const mobile = useIsMobile()
  const startTimeRef = useRef(null)
  const finishedRef = useRef(false)
  const [screenIdx, setScreenIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [hintOpen, setHintOpen] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (startTimeRef.current === null) startTimeRef.current = Date.now()
  }, [])

  const copy = SCREENS[screenIdx]
  const audioSegments = useMemo(() => [{
    id: `s${screenIdx}_intro`,
    text: tr(copy.audio, safeLang),
    trigger: 'on_mount',
    waits_for: null,
  }], [copy.audio, safeLang, screenIdx])
  const audio = useAudio(audioSegments)

  const recordAnswer = useCallback((payload) => {
    setAnswers((current) => ({
      ...current,
      [screenIdx]: {
        ...payload,
        question: tr(SCREENS[screenIdx].title, safeLang),
        scope: SCREENS[screenIdx].scope,
      },
    }))
  }, [safeLang, screenIdx])

  const goNext = () => {
    if (screenIdx >= TOTAL_SCREENS - 1) return
    if (!FREE_NAV && !answers[screenIdx]) return
    setHintOpen(false)
    setScreenIdx((index) => Math.min(index + 1, TOTAL_SCREENS - 1))
  }

  const goBack = () => {
    setHintOpen(false)
    setScreenIdx((index) => Math.max(index - 1, 0))
  }

  const finishLesson = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    setFinished(true)
    const scored = Object.values(answers).filter((answer) => typeof answer.correct === 'boolean')
    const correctAnswers = scored.filter((answer) => answer.correct).length
    const scorePercent = scored.length ? Math.round((correctAnswers / scored.length) * 100) : 100
    const payload = {
      lessonId: LESSON_ID,
      lessonTitle: tr(L('Sonli ifodalar', 'Числовые выражения', 'Numerical expressions'), safeLang),
      durationSec: Math.max(1, Math.floor((Date.now() - (startTimeRef.current ?? Date.now())) / 1000)),
      totalQuestions: scored.length,
      correctAnswers,
      scorePercent,
      passed: scorePercent >= 60,
      answers: Object.entries(answers)
        .sort(([left], [right]) => Number(left) - Number(right))
        .map(([index, answer]) => ({
          questionIndex: Number(index),
          type: answer.type,
          question: answer.question,
          correct: answer.correct ?? null,
          response: answer.picked ?? answer.value ?? answer.answerText ?? answer.responses ?? answer.chosen ?? answer.selected ?? null,
        })),
    }
    if (typeof onFinished === 'function') onFinished(payload)
  }, [answers, onFinished, safeLang])

  const progress = ((screenIdx + 1) / TOTAL_SCREENS) * 100
  const canContinue = FREE_NAV || Boolean(answers[screenIdx])
  const contentPadding = mobile ? '10px 14px 8px' : '16px 34px 12px'

  return (
    <div
      lang={safeLang}
      style={{
        height: '100dvh',
        background: C.bg,
        color: C.text,
        fontFamily: F.sans,
        overflow: 'hidden',
        padding: mobile ? 0 : 14,
        boxSizing: 'border-box',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: 936,
        height: '100%',
        margin: '0 auto',
        background: C.paper,
        border: mobile ? 0 : `1px solid ${C.line}`,
        borderRadius: mobile ? 0 : 22,
        boxShadow: mobile ? 'none' : '0 18px 55px rgba(35, 35, 35, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <header style={{ padding: mobile ? '48px 14px 8px' : '14px 34px 10px', borderBottom: `1px solid ${C.line}` }}>
          <div style={{ height: 5, borderRadius: 999, background: '#ececed', overflow: 'hidden', marginBottom: mobile ? 9 : 12 }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35 }}
              style={{ height: '100%', borderRadius: 999, background: C.primary, boxShadow: '0 0 12px rgba(254, 91, 26, .36)' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: C.primary, font: `850 ${mobile ? 10 : 11}px ${F.mono}`, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                {tr(copy.phase, safeLang)} · {String(screenIdx + 1).padStart(2, '0')}/{TOTAL_SCREENS}
              </div>
              <div style={{ color: C.muted, font: `650 ${mobile ? 11 : 12}px ${F.sans}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                {tr(L('7-sinf · Sonli ifodalar', '7 класс · Числовые выражения', 'Grade 7 · Numerical expressions'), safeLang)} · {safeName}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <IconButton label={tr(UI.replay, safeLang)} onClick={audio.replay} active={audio.isPlaying}>
                <Volume2 size={18} />
              </IconButton>
              <IconButton label={tr(audio.muted ? UI.unmute : UI.mute, safeLang)} onClick={audio.toggleMute} active={audio.muted}>
                {audio.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </IconButton>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={screenIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24 }}
            style={{
              flex: 1,
              minHeight: 0,
              padding: contentPadding,
              display: 'flex',
              flexDirection: 'column',
              gap: mobile ? 8 : 12,
              overflow: 'hidden',
            }}
          >
            <section>
              <div style={{
                color: C.primary,
                font: `850 ${mobile ? 9 : 10}px ${F.mono}`,
                letterSpacing: '.13em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                {tr(copy.kicker, safeLang)}
              </div>
              <h1 style={{
                margin: 0,
                color: C.text,
                font: `850 ${mobile ? 23 : 34}px/1.08 ${F.serif}`,
                letterSpacing: '-.025em',
              }}>
                {screenIdx === 0 ? `${safeName}, ${tr(copy.title, safeLang).charAt(0).toLowerCase()}${tr(copy.title, safeLang).slice(1)}` : tr(copy.title, safeLang)}
              </h1>
              <p style={{
                margin: mobile ? '5px 0 0' : '7px 0 0',
                color: C.muted,
                font: `600 ${mobile ? 12 : 14}px/1.4 ${F.sans}`,
                maxWidth: 790,
              }}>
                {tr(copy.lead, safeLang)}
              </p>
            </section>

            {hintOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  padding: mobile ? '8px 10px' : '10px 12px',
                  borderRadius: 12,
                  background: C.yellowSoft,
                  border: '1px solid #f3dfa0',
                  color: '#745f18',
                  font: `700 ${mobile ? 11 : 13}px/1.4 ${F.sans}`,
                }}
              >
                <Lightbulb size={17} />
                <span>{tr(copy.hint, safeLang)}</span>
              </motion.div>
            )}

            <section style={{ flex: 1, minHeight: 0, display: 'grid', alignItems: 'center' }}>
              <Activity
                key={screenIdx}
                screenIdx={screenIdx}
                lang={safeLang}
                studentName={safeName}
                storedAnswer={answers[screenIdx]}
                answers={answers}
                onAnswer={recordAnswer}
                mobile={mobile}
                audio={audio}
                onFinish={finishLesson}
                finished={finished}
              />
            </section>
          </motion.main>
        </AnimatePresence>

        <footer style={{
          minHeight: mobile ? 58 : 66,
          borderTop: `1px solid ${C.line}`,
          padding: mobile ? '8px 14px' : '10px 34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          background: '#fcfcfc',
        }}>
          <QuietButton
            onClick={() => setHintOpen((value) => !value)}
            disabled={!copy.hint}
            style={{ padding: mobile ? '8px 10px' : '9px 14px' }}
          >
            <Lightbulb size={16} />
            {!mobile && tr(UI.hint, safeLang)}
          </QuietButton>
          <div style={{ display: 'flex', gap: 8 }}>
            <QuietButton onClick={goBack} disabled={screenIdx === 0}>
              <ArrowLeft size={17} />
              {!mobile && tr(UI.back, safeLang)}
            </QuietButton>
            {screenIdx < TOTAL_SCREENS - 1 && (
              <PrimaryButton onClick={goNext} disabled={!canContinue}>
                {tr(UI.next, safeLang)} <ArrowRight size={17} />
              </PrimaryButton>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}
