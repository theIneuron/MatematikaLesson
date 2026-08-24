// ============================================================================
// 8-sinf, Dars 16. CHALA KVADRAT TENGLAMALAR.
//
// Bu fayl — FAQAT MA'LUMOT. Mexanika `karkas.js`, `screens.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx`, `twosides.jsx` da.
//
// KARKAS. O'n to'rt pozitsiya — 1-darsning asboblari, bitta pozitsiya —
// blokning mexanikasi. 5-ekranda `twosides`: iks kvadratni ajratib, ikki
// tomondan ildiz olinadi.
//
// DARSNING UCH ISHI (darslik, 23-§, 139-bet):
//   1) b yoki c koeffitsiyentlardan kamida bittasi nolga teng bo'lsa,
//      tenglama CHALA KVADRAT TENGLAMA deyiladi, uch ko'rinishi bor:
//      ax² = 0,   ax² + c = 0 (c != 0),   ax² + bx = 0 (b != 0);
//   2) ax² + c = 0 holida ildiz bor-yo'qligi ISHORAGA bog'liq: iks kvadrat
//      manfiy songa teng bo'lolmaydi;
//   3) ax² + bx = 0 holida ko'paytuvchilarga ajratiladi, x(ax + b) = 0, va
//      ikki ildiz chiqadi — biri doim NOL.
//
// ENG NOZIK JOY. ax² + bx = 0 ni ikki tomonini x ga bo'lish — ILDIZ
// YO'QOTADI: x = 0 ni bo'lish orqali yo'qotib bo'lmaydi, u tenglamani
// tekshirmasdan chetga chiqarib tashlanadi. Bu darsning eng qimmat xatosi
// (12-ekran).
//
// DARSLIK. O'zbek darsligi, 23-§, 139-140-bet: ta'rif, uch ko'rinish, to'rt
// namunali masala (xuddi shu masalalar 5- va 9-13-ekranlarda ishlatilgan).
//
// ADASHISHLAR: uchtasi yangi, bittasi qaytadi:
//   З40 — kvadrat ildiz olinganda faqat musbat javob yozildi, minus
//         varianti unutildi;
//   З41 — ax² + c = 0 da ildiz bor-yo'qligini ishoraga qarab xato baholadi;
//   З42 — ax² + bx = 0 tenglama ikki tomoni x ga bo'lindi, natijada x = 0
//         ildizi yo'qotildi;
//   З16 — javob son bilan tekshirilmadi (11-ekranda).
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L, MATH_FONT, Row, T, useT } from './core.jsx'
import { SceneBand } from './method.jsx'
import { A, W, makeLesson } from './screens.jsx'
import { UI, buildScreens } from './karkas.js'

export const META = {
  id: 'alg-8-16',
  n: 16,
  row: 18,
  block: 'Б3',
  topic: L(
    'Chala kvadrat tenglamalar',
    'Неполные квадратные уравнения',
    'Incomplete quadratic equations',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "b yoki c dan kamida bittasi nolga teng bo'lsa, tenglama chala kvadrat tenglama deyiladi",
    'Если хотя бы один из коэффициентов b или c равен нулю, уравнение называется неполным квадратным',
    'If at least one of the coefficients b or c equals zero, the equation is called an incomplete quadratic',
  ),
  L(
    "ax² + c = 0 tenglamada ildiz borligi ishoraga bog'liq, chunki iks kvadrat manfiy bo'lmaydi",
    'В уравнении ax² + c = 0 наличие корней зависит от знака, потому что икс квадрат не бывает отрицательным',
    'In the equation ax squared plus c equals zero, whether roots exist depends on sign, since x squared is never negative',
  ),
  L(
    "ax² + bx = 0 tenglama har doim ikki ildizga ega, va ulardan biri nolga teng",
    'Уравнение ax² + bx = 0 всегда имеет два корня, и один из них равен нулю',
    'The equation a x squared plus b x equals zero always has two roots, and one of them is zero',
  ),
]

export const MISS = {
  'З16': {
    what: L(
      'javob son bilan tekshirilmadi',
      'ответ не проверен числом',
      'the answer was not checked with a number',
    ),
    wrong: null,
    at: 11,
  },
  'З40': {
    what: L(
      "kvadrat ildiz olinganda faqat musbat javob yozildi, minus varianti unutildi",
      'при извлечении квадратного корня записан только положительный ответ, отрицательный забыт',
      'when taking the square root, only the positive answer was written, the negative one forgotten',
    ),
    wrong: '3',
    at: 5,
  },
  'З41': {
    what: L(
      "ax² + c = 0 tenglamada ildiz bor-yo'qligi ishoraga qarab xato baholandi",
      'в уравнении ax² + c = 0 наличие корней оценено по знаку неверно',
      'in a x squared plus c equals zero, whether roots exist was judged wrong by sign',
    ),
    wrong: 'x^2+7/2',
    at: 3,
  },
  'З42': {
    what: L(
      "ax² + bx = 0 tenglama ikki tomoni x ga bo'lindi, natijada x = 0 ildizi yo'qotildi",
      'обе части уравнения ax² + bx = 0 разделены на x, из-за чего потерян корень x = 0',
      'both sides of a x squared plus b x equals zero were divided by x, losing the root x equals zero',
    ),
    wrong: 'x-5/3',
    at: 12,
  },
  'З43': {
    what: L(
      "chala tenglamani tanishda qaysi koeffitsiyent yo'qligi payqalmadi",
      'при опознании неполного уравнения не замечено, какого коэффициента не хватает',
      'when spotting an incomplete equation, which coefficient was missing went unnoticed',
    ),
    wrong: '5*x^2-3*x+20',
    at: 4,
  },
}

// ============================================================
// SAHNALAR (§6). Xuk: ikki yozuv, faqat bittasi hozir yechiladi.
// Yakun: 3x² − 27 = 0, uch qadamda x = ±3.
// ============================================================
const SC_NOW = L('HOZIR YECHILADIMI', 'РЕШАЕТСЯ ЛИ СЕЙЧАС', 'CAN IT BE SOLVED NOW')
const SC_YES = L('HA, HOZIR', 'ДА, СЕЙЧАС', 'YES, NOW')
const SC_LATER = L('KEYINGI DARSDA', 'В СЛЕДУЮЩЕМ УРОКЕ', 'NEXT LESSON')

const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Ikki tenglama, ikkisi ham iks kvadratli",
      'Два уравнения, оба с икс квадрат',
      'Two equations, both with x squared',
    )}>
      <text x="96" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17"
        fill={T.ink}>{'3x² − 27 = 0'}</text>

      <text x="304" y="60" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17"
        fill={T.ink}>{'3x² − 4x − 27 = 0'}</text>

      <g className="g8-seat" style={{ '--d': '2400ms' }}>
        <circle cx="200" cy="70" r="17" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="77" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="126" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_NOW)}</text>
      <line x1="112" y1="138" x2="288" y2="138" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>
    </SceneBand>
  )
}

const FinalScene = () => {
  const t = useT()
  return (
    <SceneBand kind="final" label={L(
      "Uch qadamda x uchga va minus uchga teng",
      'За три шага x равен трём и минус трём',
      'In three steps x equals three and negative three',
    )}>
      <text x="70" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15"
        fill={T.ink}>{'3x² − 27 = 0'}</text>
      <path d="M148 26 L166 26 M160 20 L166 26 L160 32" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '500ms' }}>
        <text x="212" y="33" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.ok}>{'x² = 9'}</text>
      </g>

      <path d="M258 26 L276 26 M270 20 L276 26 L270 32" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <g className="g8-seat" style={{ '--d': '1000ms' }}>
        <text x="320" y="33" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16"
          fontWeight="700" fill={T.ok}>{'x = ±3'}</text>
      </g>

      <g className="g8-seat" style={{ '--d': '1500ms' }}>
        <line x1="60" y1="72" x2="340" y2="72" stroke="rgba(23,26,29,.28)" strokeWidth="1.3"/>
        <circle cx="150" cy="72" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
        <text x="150" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.tip}>{'−3'}</text>
        <circle cx="200" cy="72" r="4.4" fill={T.ok}/>
        <text x="200" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.ink3}>0</text>
        <circle cx="250" cy="72" r="4.4" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
        <text x="250" y="86" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10"
          fill={T.tip}>3</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  eyebrow: L('IKKISINI HAM', 'ОБА ЛИ', 'BOTH OF THEM'),
  title: L(
    "Ikkalasini ham hozir yechish mumkinmi",
    'Можно ли решить оба сейчас',
    'Can both be solved right now',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Ikki tenglama. Ikkalasida ham iks kvadrat bor.",
      'Два уравнения. В обоих есть икс квадрат.',
      'Two equations. Both have x squared.'),
    A('why',
      "Taxmin qiling, ikkalasini ham hozir yecha olamizmi.",
      'Предположи, можем ли мы решить оба прямо сейчас.',
      'Predict whether we can solve both right now.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, ikkalasini ham hozir yecha olamizmi?",
      'Как думаешь, можем мы решить оба прямо сейчас?',
      'Do you think we can solve both right now?',
    ),
    items: [
      { id: 'both', show: L('Ha, ikkalasini ham', 'Да, оба', 'Yes, both') },
      { id: 'one', show: L('Yo\'q, faqat bittasini', 'Нет, только одно', 'No, only one') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. 7-sinf: umumiy ko'paytuvchini qavsdan chiqarish.
// Shu tayanch 6, 9 va 12-ekranlarda ishlaydi.
// ============================================================
const S2 = {
  eyebrow: UI.supportEyebrow,
  title: L(
    "Umumiy ko'paytuvchi",
    'Общий множитель',
    'The common factor',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida qavsdan chiqarish to'g'ri.",
      'Четыре записи. Только в одной вынесение за скобку верно.',
      'Four records. Only one has the factoring done correctly.'),
    A('why',
      "Qavs ichidagi ifodani orqaga ko'paytirib tekshiring.",
      'Проверь, умножив выражение в скобке обратно.',
      'Check by multiplying the bracket back out.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuvda qavsdan chiqarish to'g'ri?",
      'В какой записи вынесение за скобку верно?',
      'In which record is the factoring correct?',
    ),
    items: [
      { id: 'right', show: '4x² − 8x = 4x(x − 2)', right: true, name: L("orqaga ko'paytirib tekshirildi", 'проверено обратным умножением', 'checked by multiplying back') },
      {
        id: 'sign', show: '4x² − 8x = 4x(x + 2)',
        hint: L(
          "Orqaga ko'paytirsak, 4x ko'paytirilgan x plyus ikkidan to'rt iks kvadrat plyus sakkiz iks chiqadi, bu boshqa yozuv.",
          'При обратном умножении четыре икс на икс плюс два дает четыре икс квадрат плюс восемь икс, а это другая запись.',
          'Multiplying back, four x times x plus two gives four x squared plus eight x, a different record.',
        ),
      },
      {
        id: 'extra', show: '4x² − 8x = 4x²(x − 2)',
        hint: L(
          "Bu yerda iks kvadrat ortiqcha qoldi, orqaga ko'paytirilganda daraja mos kelmaydi.",
          'Здесь лишний икс квадрат остался, при обратном умножении степень не совпадает.',
          'Here an extra x squared is left over, and multiplying back the power does not match.',
        ),
      },
      {
        id: 'coef', show: '4x² − 8x = 8x(x − 1)',
        hint: L(
          "Orqaga ko'paytirsak, sakkiz iks kvadrat minus sakkiz iks chiqadi, koeffitsiyent mos kelmaydi.",
          'При обратном умножении выходит восемь икс квадрат минус восемь икс, коэффициент не совпадает.',
          'Multiplying back gives eight x squared minus eight x, the coefficient does not match.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Orqaga ko'paytirib tekshirish har doim ishlaydi.",
      'Верно. Проверка обратным умножением работает всегда.',
      'Correct. Checking by multiplying back always works.',
    ),
  },
}

// ============================================================
// EKRAN 3. D NI BURANG (1-darsning `steppers`). Natija — d dan ildiz.
// d manfiyga tushganda qiymat yo'qoladi: З41 ning sabab bilan birinchi
// ko'rinishi.
// ============================================================
const S3 = {
  eyebrow: L('D NI BURANG', 'КРУТИ D', 'TURN D'),
  title: L(
    "D dan ildiz",
    'Корень из D',
    'The root of D',
  ),
  audio: [
    A('mount',
      "Iks kvadrat d ga teng bo'lsin. Natija d dan ildizga teng.",
      'Пусть икс квадрат равен d. Результат равен корню из d.',
      'Let x squared equal d. The result equals the root of d.'),
    A('why',
      "Uch maqsad beriladi. d ning turli qiymatlarida natijani toping.",
      'Даны три цели. Находи результат при разных значениях d.',
      'Three targets are given. Find the result at different values of d.'),
    A('why',
      "Oxirida d ni manfiyga tushiring va nima bo'lishini ko'ring.",
      'В конце опусти d в минус и посмотри, что будет.',
      'At the end bring d into the negatives and see what happens.'),
  ],
  props: {
    cols: [
      {
        id: 'd', label: L('d ning qiymati', 'значение d', 'the value of d'),
        start: 16, min: -4, max: 20, step: 1, risky: true,
      },
    ],
    calc: (v) => (v[0] < 0 ? null : Math.round(Math.sqrt(v[0]) * 100) / 100),
    resultLabel: L('√d', '√d', '√d'),
    stepLabel: UI.goalLabel,
    zeroNote: L(
      "d hali manfiyga tushmasin, avval maqsadlarni oling.",
      'd пока не опускай в минус, сначала возьми цели.',
      'Do not bring d into the negatives yet, take the targets first.',
    ),
    goals: [
      {
        value: 3,
        ask: L("Natija 3 ga teng bo'lsin", 'Пусть результат будет равен 3', 'Make the result equal 3'),
        after: L(
          "Uch. To'qqizdan ildiz uch.",
          'Три. Корень из девяти три.',
          'Three. The root of nine is three.',
        ),
      },
      {
        value: 2,
        ask: L("Endi natija 2 ga teng bo'lsin", 'Теперь пусть результат будет равен 2', 'Now make the result equal 2'),
        after: L(
          "Ikki. To'rtdan ildiz ikki.",
          'Два. Корень из четырёх два.',
          'Two. The root of four is two.',
        ),
      },
      {
        value: 1,
        ask: L("Oxirgisi, natija 1 ga teng bo'lsin", 'Последняя, пусть результат будет равен 1', 'The last one, make the result equal 1'),
        after: L(
          "Bir. Birdan ildiz bir.",
          'Один. Корень из единицы один.',
          'One. The root of one is one.',
        ),
      },
    ],
    ask: L("Natija 3 ga teng bo'lsin", 'Пусть результат будет равен 3', 'Make the result equal 3'),
    ask2: L("Endi d ni manfiyga tushiring", 'Теперь опусти d в минус', 'Now bring d into the negatives'),
    broke: L(
      "d manfiy bo'lganda qiymat yo'q, chunki iks ning istalgan qiymatida iks kvadrat manfiy bo'lmaydi.",
      'При отрицательном d значения нет, потому что икс квадрат не бывает отрицательным при любом иксе.',
      'With negative d there is no value, because x squared is never negative for any x.',
    ),
  },
}

// ============================================================
// EKRAN 4. QAYSI YOZUV CHALA (1-darsning `pick`). Ловушка — barcha
// noto'g'ri javoblarda uchta koeffitsiyent ham bor.
// ============================================================
const S4 = {
  eyebrow: L('QAYSI BIRI CHALA', 'КОТОРОЕ НЕПОЛНОЕ', 'WHICH ONE IS INCOMPLETE'),
  title: L(
    "Qaysi tenglama chala kvadrat tenglama",
    'Какое уравнение — неполное квадратное',
    'Which equation is an incomplete quadratic',
  ),
  audio: [
    A('mount',
      "To'rt yozuv. Faqat bittasida ikkinchi koeffitsiyent yoki ozod had yo'q.",
      'Четыре записи. Только в одной нет второго коэффициента или свободного члена.',
      'Four records. Only one is missing the second coefficient or the constant term.'),
    A('why',
      "Qolgan uchtasida a, b, c uchtasi ham bor.",
      'В остальных трёх коэффициенты a, b и c присутствуют все три.',
      'In the other three, a, b, and c are all present.'),
  ],
  props: {
    ask: L(
      "Qaysi tenglama chala kvadrat tenglama?",
      'Какое уравнение — неполное квадратное?',
      'Which equation is an incomplete quadratic?',
    ),
    items: [
      { id: 'right', show: '5x² − 20 = 0', right: true, name: L('ikkinchi had yo\'q', 'нет второго члена', 'no second term') },
      {
        id: 'a', show: '5x² − 3x + 20 = 0',
        hint: L("Bu yerda a, b, c uchtasi ham bor.", 'Здесь есть все три, a, b и c.', 'Here all three are present, a, b, and c.'),
      },
      {
        id: 'b', show: '2x² + 7x − 1 = 0',
        hint: L("Bu yerda ham uchtasi ham bor.", 'Здесь тоже все три.', 'Here too all three are present.'),
      },
      {
        id: 'c', show: 'x² − x + 4 = 0',
        hint: L("Bu yerda iks oldida yashirin bir, u ham koeffitsiyent.", 'Здесь перед иксом скрытая единица, это тоже коэффициент.', 'Here before x there is a hidden one, that is also a coefficient.'),
      },
    ],
    after: L(
      "To'g'ri. Bunda ikkinchi koeffitsiyent yo'q, faqat a va c bor.",
      'Верно. Здесь нет второго коэффициента, есть только a и c.',
      'Correct. There is no second coefficient here, only a and c.',
    ),
  },
}

// ============================================================
// EKRAN 5. BLOKNING MEXANIKASI — AJRATIB, ILDIZ OLISH (`twosides`). Xukdagi
// birinchi yozuv shu yerda to'liq yechiladi.
// ============================================================
const S5 = {
  eyebrow: L('YECHAMIZ', 'РЕШАЕМ', 'WE SOLVE IT'),
  title: L(
    "3x kvadrat minus 27 teng nolni yeching",
    'Решите три икс квадрат минус двадцать семь равно нулю',
    'Solve three x squared minus twenty seven equals zero',
  ),
  audio: [
    A('mount',
      "Xukdagi birinchi tenglama. Uch qadamda yechamiz.",
      'Первое уравнение с хука. Решаем его за три шага.',
      'The first equation from the hook. We solve it in three steps.'),
    A('why',
      "Amal ikkala tomonga birdan qo'llanadi. Qadamni tanlang.",
      'Действие применяется сразу к обеим частям. Выбери шаг.',
      'The action applies to both sides at once. Choose the step.'),
    W('a2',
      "Ikkinchi qadamda ikkala tomon uchga bo'lindi.",
      'На втором шаге обе части разделены на три.',
      'In the second step both sides were divided by three.'),
  ],
  props: {
    from: -6,
    to: 6,
    start: { left: '3x² − 27', rel: '=', right: '0', set: null },
    steps: [
      {
        ask: L('Nima qilamiz?', 'Что делаем?', 'What do we do?'),
        actions: [
          {
            id: 'add27', right: true,
            label: L("Ikki tomonga 27 ni qo'shish", 'Прибавить 27 к обеим частям', 'Add 27 to both sides'),
            to: { left: '3x²', rel: '=', right: '27' },
          },
          {
            id: 'div3early',
            label: L("Avval uchga bo'lish", 'Сначала разделить на три', 'Divide by three first'),
            hint: L(
              "O'ng tomonda hali nol turadi, avval iks kvadratni yolgiz qoldiramiz.",
              'Справа пока стоит нуль, сначала оставляем икс квадрат одного.',
              'The right side still holds zero; first we isolate x squared.',
            ),
          },
        ],
      },
      {
        ask: L('Endi nima qilamiz?', 'Что теперь?', 'And now?'),
        actions: [
          {
            id: 'div3', right: true,
            label: L('Ikki tomonni 3 ga bo\'lish', 'Разделить обе части на 3', 'Divide both sides by 3'),
            to: { left: 'x²', rel: '=', right: '9' },
          },
          {
            id: 'sub27',
            label: L("27 ni ikki tomondan ayirish", 'Вычесть 27 из обеих частей', 'Subtract 27 from both sides'),
            hint: L(
              "27 allaqachon o'ng tomonda turadi, uni ayirish iks kvadratni yolgiz qoldirmaydi.",
              '27 уже стоит справа, вычитание его не оставит икс квадрат одного.',
              '27 already stands on the right; subtracting it will not isolate x squared.',
            ),
          },
        ],
      },
      {
        ask: L('Oxirgi qadam. Nima qilamiz?', 'Последний шаг. Что делаем?', 'The last step. What do we do?'),
        actions: [
          {
            id: 'sqrt', right: true,
            label: L('Ikki tomondan kvadrat ildiz olish', 'Извлечь квадратный корень из обеих частей', 'Take the square root of both sides'),
            to: { left: 'x', rel: '=', right: '±3' },
            set: { points: [-3, 3] },
            note: L(
              "To'qqizdan ildiz ikki qiymat beradi: uch va minus uch.",
              'Корень из девяти даёт два значения: три и минус три.',
              'The root of nine gives two values: three and negative three.',
            ),
          },
          {
            id: 'sqrtpos',
            label: L("Faqat musbat ildizni olish", 'Взять только положительный корень', 'Take only the positive root'),
            hint: L(
              "Kvadratga oshirilganda ishora yo'qoladi, shuning uchun ikki javob bor, uch va minus uch.",
              'При возведении в квадрат знак исчезает, поэтому есть два ответа, три и минус три.',
              'Squaring erases the sign, so there are two answers, three and negative three.',
            ),
          },
        ],
      },
    ],
    note: L(
      "Ikkita ildiz chiqdi: uch va minus uch.",
      'Вышло два корня: три и минус три.',
      'Two roots came out: three and negative three.',
    ),
  },
}

// ============================================================
// EKRAN 6. IKKI USUL (1-darsning `twoways`): iks kvadrat toqqizni ikki
// yo'l bilan yechish.
// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO WAYS'),
  title: L(
    "Iks kvadrat to'qqizni ikki yo'l bilan yechish",
    'Решить икс квадрат девять двумя способами',
    'Solving x squared nine two ways',
  ),
  audio: [
    A('mount',
      "Bitta tenglama va ikki yo'l. Ikkalasi ham bir xil javob beradi.",
      'Одно уравнение и два пути. Оба дают один ответ.',
      'One equation and two ways. Both give the same answer.'),
    W('w2',
      "Birinchi yo'lda ikki tomondan ildiz olinadi.",
      'В первом пути из обеих частей извлекается корень.',
      'In the first way a root is taken from both sides.'),
    W('w4',
      "Ikkinchi yo'lda chap qism ikki kvadratning ayirmasi sifatida ko'paytuvchilarga ajratiladi.",
      'Во втором пути левая часть разлагается как разность двух квадратов.',
      'In the second way the left side is factored as a difference of two squares.'),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L("1-USUL — ILDIZ OLISH", 'СПОСОБ 1 — ИЗВЛЕЧЬ КОРЕНЬ', 'METHOD 1 — TAKE THE ROOT'),
        lead: L(
          "Ikki tomondan bir vaqtda ildiz olinadi",
          'Из обеих частей одновременно извлекается корень',
          'A root is taken from both sides at once',
        ),
        rows: [
          { text: 'x² = 9' },
          { text: 'x = ±3', tone: 'ok', note: L('ikki javob', 'два ответа', 'two answers') },
        ],
      },
      {
        name: L("2-USUL — KO'PAYTUVCHILARGA AJRATISH", 'СПОСОБ 2 — РАЗЛОЖИТЬ НА МНОЖИТЕЛИ', 'METHOD 2 — FACTOR'),
        lead: L(
          "To'qqiz ham to'liq kvadrat, ayirma ikki kvadratning ayirmasi",
          'Девять тоже полный квадрат, разность — разность двух квадратов',
          'Nine is also a perfect square, so the difference is a difference of two squares',
        ),
        rows: [
          { text: 'x² − 9 = 0' },
          { text: '(x − 3)(x + 3) = 0' },
          { text: 'x = 3,  x = −3', tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM BIR XIL JAVOB BERDI', 'ОБА ДАЛИ ОДИН ОТВЕТ', 'BOTH GAVE THE SAME ANSWER'),
        lead: L(
          "Ikkalasida ham ikki ildiz chiqadi, uch va minus uch",
          'В обоих способах выходят два корня, три и минус три',
          'Both ways give two roots, three and negative three',
        ),
        rows: [{ text: 'x = 3,  x = −3', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. QISMLARGA (1-darsning `parts`): x kvadrat minus yetti ikkidan
// ILDIZI YO'Q — chunki iks kvadrat manfiy bo'lolmaydi.
// ============================================================
const S7 = {
  eyebrow: L('ILDIZ YO\'Q HOLI', 'СЛУЧАЙ БЕЗ КОРНЕЙ', 'THE CASE WITH NO ROOTS'),
  title: L(
    "Nima uchun ba'zi tenglamalarning ildizi yo'q",
    'Почему у некоторых уравнений нет корней',
    'Why some equations have no roots',
  ),
  audio: [
    A('mount',
      "Ikki iks kvadrat plyus yetti teng nol. Uni yolgiz iks kvadratga keltiramiz.",
      'Два икс квадрат плюс семь равно нулю. Приводим его к одному икс квадрат.',
      'Two x squared plus seven equals zero. We reduce it to x squared alone.'),
    W('p2',
      "Iks kvadrat minus yetti ikkidan chiqadi, bu manfiy son.",
      'Икс квадрат выходит равным минус семь вторых, а это отрицательное число.',
      'x squared comes out to negative seven halves, and that is a negative number.'),
    W('p4',
      "Iks ning istalgan haqiqiy qiymatida iks kvadrat manfiy bo'lmaydi, shuning uchun ildiz yo'q.",
      'При любом действительном икс квадрат икс не бывает отрицательным, поэтому корней нет.',
      'For any real x, x squared is never negative, so there are no roots.',
    ),
  ],
  props: {
    tokens: [
      { t: 'x²', id: 'sq' },
      { t: ' = ', id: 'eq' },
      { t: '−7/2', id: 'val' },
    ],
    steps: [
      {
        focus: 'val',
        text: L(
          "Birinchi qadam. Iks kvadratni yolgiz qoldirib, o'ng tomon minus yetti ikkidan chiqadi.",
          'Первый шаг. Оставляя икс квадрат одного, справа выходит минус семь вторых.',
          'Step one. Isolating x squared, the right side comes out to negative seven halves.',
        ),
      },
      {
        focus: 'val',
        text: L(
          "Ikkinchi qadam. Bu son manfiy, chunki yetti musbat va u ikkiga bo'lingan, keyin minus qo'yilgan.",
          'Второй шаг. Это число отрицательно, потому что семь положительно и делится на два, а затем стоит минус.',
          'Step two. This number is negative, because seven is positive, divided by two, then given a minus sign.',
        ),
      },
      {
        focus: 'sq',
        text: L(
          "Uchinchi qadam. Iks kvadrat hech qachon manfiy bo'lmaydi, shuning uchun bunday iks yo'q.",
          'Третий шаг. Икс квадрат никогда не бывает отрицательным, поэтому такого икс не существует.',
          'Step three. x squared is never negative, so no such x exists.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Har qanday haqiqiy sonning kvadrati manfiy bo'lmasligi qadimgi yunon matematiklariga ma'lum edi, lekin manfiy sonlarning o'zi ko'p asrlar davomida son deb tanilmagan.",
        'То, что квадрат любого действительного числа не бывает отрицательным, знали ещё древнегреческие математики, хотя сами отрицательные числа многие века не признавались числами.',
        'That the square of any real number is never negative was known to ancient Greek mathematicians, though negative numbers themselves were not accepted as numbers for many centuries.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (1-darsning `rulebuild`). DARSLIK BOR: 23-§, 139-bet.
// ============================================================
const S8 = {
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Chala kvadrat tenglama ta'rifi",
    'Определение неполного квадратного уравнения',
    'The definition of an incomplete quadratic equation',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже видел. Теперь собери его.',
      'Everything the rule needs, you have already seen. Now assemble it.'),
    W('card',
      "Darslik ta'rifi ochildi, va xukdagi ikkinchi tenglama keyingi darsga qoldi.",
      'Открылось определение из учебника, и второе уравнение с хука осталось на следующий урок.',
      'The textbook definition opened, and the second equation from the hook waits for the next lesson.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("b yoki c dan kamida bittasi nolga teng bo'lgan", 'В котором хотя бы один из b или c равен нулю', 'In which at least one of b or c equals zero') },
      { id: 'f2', label: L("kvadrat tenglama chala kvadrat tenglama deyiladi", 'квадратное уравнение называется неполным квадратным', 'a quadratic equation is called incomplete') },
      { id: 'f3', label: L("uning uch ko'rinishi bor: ax kvadrat teng nol", 'у него три вида: a икс квадрат равно нулю', 'it has three forms: a x squared equals zero') },
      { id: 'f4', label: L("ax kvadrat plyus c teng nol, va ax kvadrat plyus bx teng nol", 'a икс квадрат плюс c равно нулю, и a икс квадрат плюс b икс равно нулю', 'a x squared plus c equals zero, and a x squared plus b x equals zero') },
      { id: 'w1', label: L("bunda ham a nolga teng bo'lishi mumkin", 'здесь a тоже может равняться нулю', 'here a can also equal zero') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. a har doim nolga teng emas, aks holda iks kvadratli had yo'qoladi.",
      'Так не складывается. a всегда не равен нулю, иначе член с икс квадрат исчезнет.',
      'That does not fit. a is always nonzero, otherwise the x-squared term would vanish.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Darslik, 23-§, 139-bet",
        'Учебник, § 23, стр. 139',
        'Textbook, section 23, page 139',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "ikkalasini ham hozir yechish mumkin",
        'оба можно решить прямо сейчас',
        'both can be solved right now',
      ),
      right: L(
        "faqat chala tenglama hozir yechiladi, to'liq tenglama formula bilan",
        'сейчас решается только неполное, полное — по формуле',
        'only the incomplete one solves now, the complete one needs the formula',
      ),
      winner: 'right',
      note: L(
        "Formula keyingi darsda",
        'Формула — в следующем уроке',
        'The formula comes in the next lesson',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (1-darsning `drill`): ax kvadrat teng nolni yeching.
// ============================================================
const ASK_SOLVE = L('Tenglamani yeching', 'Решите уравнение', 'Solve the equation')

const S9 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Eng sodda hol: ax kvadrat teng nol",
    'Самый простой случай: a икс квадрат равно нулю',
    'The simplest case: a x squared equals zero',
  ),
  audio: [
    A('mount',
      "Besh tenglama. Har birida faqat iks kvadratli had bor.",
      'Пять уравнений. В каждом есть только член с икс квадрат.',
      'Five equations. In each, only the x-squared term is present.'),
    A('why',
      "Bunday tenglamaning yagona ildizi doim nol.",
      'У такого уравнения единственный корень всегда нуль.',
      'Such an equation always has a single root, zero.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar yagona ildiz nolga teng chiqdi.",
      'Все пять разобраны. Каждый раз единственный корень выходил нулём.',
      'All five are done. Each time the single root came out zero.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'5x² = 0'}</Row>,
        ok: L("Ha. Ikki tomonni beshga bo'lsak iks kvadrat nolga teng qoladi.", 'Да. Разделив обе части на пять, икс квадрат остаётся равным нулю.', 'Yes. Dividing both sides by five, x squared stays equal to zero.'),
        question: ASK_SOLVE,
        items: [
          { id: 'a', right: true, label: 'x = 0' },
          { id: 'b', label: "Ildiz yo'q", hint: L("Nolning ildizi bor, u nolning o'zi.", 'У нуля есть корень, это сам нуль.', 'Zero has a root, and it is zero itself.') },
        ],
        solution: ['5x² = 0', 'x² = 0', 'x = 0'],
      },
      {
        expr: <Row size="big" align="center">{'−2x² = 0'}</Row>,
        ok: L("Ha. Koeffitsiyent manfiy bo'lsa ham ildiz hali nol.", 'Да. Даже при отрицательном коэффициенте корень всё равно нуль.', 'Yes. Even with a negative coefficient, the root is still zero.'),
        question: ASK_SOLVE,
        items: [
          { id: 'a', right: true, label: 'x = 0' },
          { id: 'b', label: 'x = −2', hint: L("Minus ikki koeffitsiyent, ildiz emas.", 'Минус два, это коэффициент, а не корень.', 'Negative two is the coefficient, not the root.') },
        ],
        solution: ['−2x² = 0', 'x² = 0', 'x = 0'],
      },
      {
        expr: <Row size="big" align="center">{'x²/4 = 0'}</Row>,
        ok: L("Ha. Ikki tomonni to'rtga ko'paytirsak iks kvadrat nolga teng.", 'Да. Умножив обе части на четыре, икс квадрат равен нулю.', 'Yes. Multiplying both sides by four, x squared equals zero.'),
        question: ASK_SOLVE,
        items: [
          { id: 'a', right: true, label: 'x = 0' },
          { id: 'b', label: 'x = 4', hint: L("To'rt maxrajda turadi, ildiz emas.", 'Четыре стоит в знаменателе, это не корень.', 'Four sits in the denominator, it is not the root.') },
        ],
        solution: ['x²/4 = 0', 'x² = 0', 'x = 0'],
      },
      {
        expr: <Row size="big" align="center">{'7x² = 0'}</Row>,
        ok: L("Ha. Koeffitsiyent qanday bo'lishidan qat'i nazar javob bir xil.", 'Да. Каким бы ни был коэффициент, ответ один и тот же.', 'Yes. Whatever the coefficient, the answer stays the same.'),
        question: ASK_SOLVE,
        items: [
          { id: 'a', right: true, label: 'x = 0' },
          { id: 'b', label: 'x = 7', hint: L("Yetti koeffitsiyent, ildiz emas.", 'Семь, коэффициент, а не корень.', 'Seven is the coefficient, not the root.') },
        ],
        solution: ['7x² = 0', 'x² = 0', 'x = 0'],
      },
      {
        expr: <Row size="big" align="center">{'0,5x² = 0'}</Row>,
        ok: L("Ha. O'nli koeffitsiyent bo'lsa ham xulosa o'zgarmaydi.", 'Да. Даже с десятичным коэффициентом вывод не меняется.', 'Yes. Even with a decimal coefficient, the conclusion stays the same.'),
        question: ASK_SOLVE,
        items: [
          { id: 'a', right: true, label: 'x = 0' },
          { id: 'b', label: "Ildiz yo'q", hint: L("Koeffitsiyent nolga teng emas, demak ildiz bor.", 'Коэффициент не равен нулю, значит корень есть.', 'The coefficient is not zero, so a root exists.') },
        ],
        solution: ['0,5x² = 0', 'x² = 0', 'x = 0'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (1-darsning `drill`): ax kvadrat plyus c teng nol —
// ildiz bor-yo'qligi ishoraga bog'liq.
// ============================================================
const S10 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ildiz bor-yo'qligini aniqlang",
    'Определи, есть ли корни',
    'Decide whether roots exist',
  ),
  audio: [
    A('mount',
      "Uch tenglama. Har birida ax kvadrat plyus c teng nol.",
      'Три уравнения. В каждом a икс квадрат плюс c равно нулю.',
      'Three equations. In each, a x squared plus c equals zero.'),
    A('why',
      "Iks kvadratni yolgiz qoldiring va ishoraga qarang.",
      'Оставь икс квадрат одного и посмотри на знак.',
      'Isolate x squared and look at the sign.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Ishorasi musbat bo'lganda ildiz bor, manfiy bo'lganda yo'q.",
      'Все три разобраны. При положительном знаке корни есть, при отрицательном нет.',
      'All three are done. Positive sign means roots exist, negative means they do not.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² − 16 = 0'}</Row>,
        ok: L("Ha. Iks kvadrat o'n oltiga teng, bu musbat, ildiz bor.", 'Да. Икс квадрат равен шестнадцати, это положительно, корни есть.', 'Yes. x squared equals sixteen, which is positive, so roots exist.'),
        question: L('Ildiz bormi?', 'Есть ли корни?', 'Do roots exist?'),
        items: [
          { id: 'a', right: true, label: L('Ha, ikkita', 'Да, два', 'Yes, two') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("O'n olti musbat son, iks kvadrat musbat bo'lishi mumkin.", 'Шестнадцать положительное число, икс квадрат может быть положительным.', 'Sixteen is positive, x squared can equal a positive number.') },
        ],
        solution: ['x² = 16', 'x = ±4'],
      },
      {
        expr: <Row size="big" align="center">{'x² + 5 = 0'}</Row>,
        ok: L("Ha. Iks kvadrat minus beshga teng, bu manfiy, ildiz yo'q.", 'Да. Икс квадрат равен минус пяти, это отрицательно, корней нет.', 'Yes. x squared equals negative five, which is negative, so no roots exist.'),
        question: L('Ildiz bormi?', 'Есть ли корни?', 'Do roots exist?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha, ikkita', 'Да, два', 'Yes, two'), hint: L("Minus besh manfiy, iks kvadrat manfiy songa teng bo'lolmaydi.", 'Минус пять отрицательно, икс квадрат не может равняться отрицательному числу.', 'Negative five is negative, and x squared cannot equal a negative number.') },
        ],
        solution: ['x² = −5', L("haqiqiy ildiz yo'q", 'действительного корня нет', 'no real root')],
      },
      {
        expr: <Row size="big" align="center">{'3x² − 27 = 0'}</Row>,
        ok: L("Ha. Iks kvadrat to'qqizga teng, bu musbat, ildiz bor.", 'Да. Икс квадрат равен девяти, это положительно, корни есть.', 'Yes. x squared equals nine, which is positive, so roots exist.'),
        question: L('Ildiz bormi?', 'Есть ли корни?', 'Do roots exist?'),
        items: [
          { id: 'a', right: true, label: L('Ha, ikkita', 'Да, два', 'Yes, two') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Ikki tomonni uchga bo'lsak, iks kvadrat to'qqizga teng, bu musbat.", 'Разделив обе части на три, икс квадрат равен девяти, это положительно.', 'Dividing both sides by three, x squared equals nine, which is positive.') },
        ],
        solution: ['x² = 9', 'x = ±3'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (1-darsning `drill`, приборсиз): ax kvadrat plyus bx
// teng nol tenglamaning ikkita ildizi to'liqligini tekshirish (З16).
// ============================================================
const S11 = {
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Ildizlar to'plami to'liqmi",
    'Полон ли набор корней',
    'Is the set of roots complete',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida ikkita ildiz taklif qilinadi.",
      'Три задания. В каждом предложены два корня.',
      'Three tasks. In each, two roots are proposed.'),
    A('why',
      "Ikkalasini ham qo'yib tekshiring, tenglama nolga aylanishi kerak.",
      'Подставь оба и проверь, уравнение должно обратиться в нуль.',
      'Substitute both and check, the equation must turn into zero.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar ikkala ildiz ham qo'yib tekshirildi.",
      'Все три разобраны. Каждый раз оба корня подставлялись и проверялись.',
      'All three are done. Each time both roots were substituted and checked.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'−3x² + 5x = 0,   x = 0,   x = 5/3'}</Row>,
        ok: L("Ha. Nolni qo'ysak nol chiqadi, besh uchdanni qo'ysak ham nol chiqadi.", 'Да. При нуле выходит нуль, и при пяти третьих тоже выходит нуль.', 'Yes. Substituting zero gives zero, and substituting five thirds also gives zero.'),
        question: L("Bu to'plam to'liqmi?", 'Полон ли этот набор?', 'Is this set complete?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q, faqat besh uchdan", 'Нет, только пять третьих', 'No, only five thirds'), hint: L("Nolni qo'yib ko'ring, minus uch karra nol plyus besh karra nol.", 'Подставь нуль, минус три на нуль плюс пять на нуль.', 'Substitute zero, negative three times zero plus five times zero.') },
        ],
        solution: ['x(−3x + 5) = 0', 'x = 0,  x = 5/3'],
      },
      {
        expr: <Row size="big" align="center">{'2x² − 8x = 0,   x = 0,   x = 4'}</Row>,
        ok: L("Ha. Ikkalasini qo'yganda ham tenglama nolga aylanadi.", 'Да. При подстановке обоих уравнение обращается в нуль.', 'Yes. Substituting both, the equation turns to zero.'),
        question: L("Bu to'plam to'liqmi?", 'Полон ли этот набор?', 'Is this set complete?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q, faqat to'rt", 'Нет, только четыре', 'No, only four'), hint: L("Nolni qo'yib ko'ring, ikki karra nol minus sakkiz karra nol.", 'Подставь нуль, два на нуль минус восемь на нуль.', 'Substitute zero, two times zero minus eight times zero.') },
        ],
        solution: ['2x(x − 4) = 0', 'x = 0,  x = 4'],
      },
      {
        expr: <Row size="big" align="center">{'x² + 6x = 0,   x = −6,   x = 6'}</Row>,
        ok: L("Yo'q. Nolni qo'ysak nol chiqadi, lekin oltini qo'ysak nolga teng chiqmaydi.", 'Нет. При нуле выходит нуль, а при шести не выходит нуль.', 'No. Substituting zero gives zero, but substituting six does not give zero.'),
        question: L("Bu to'plam to'liqmi?", 'Полон ли этот набор?', 'Is this set complete?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Oltini qo'yib ko'ring, oltmish oltiga besh, nolga teng emas.", 'Подставь шесть, шестьдесят шесть, а не нуль.', 'Substitute six, sixty six, not zero.') },
        ],
        solution: ['x(x + 6) = 0', 'x = 0,  x = −6'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. MASHQ 4 — TUZOQ (1-darsning `drill`): ikki tomon x ga
// bo'lingan, x = 0 ildizi yo'qotilgan (З42, darsning eng qimmat xatosi).
// ============================================================
const S12 = {
  eyebrow: UI.trapEyebrow,
  title: L(
    "X ga bo'lganda ildiz yo'qoladi",
    'При делении на x корень теряется',
    'Dividing by x loses a root',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham yechim ikki tomonni x ga bo'lgan.",
      'Два задания. В обоих решение разделило обе части на x.',
      'Two tasks. In both, the solution divided both sides by x.'),
    A('why',
      "X ga bo'lish x nolga teng bo'lishi mumkinligini unutadi.",
      'Деление на x забывает, что x может равняться нулю.',
      'Dividing by x forgets that x can equal zero.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. X ga bo'lish har safar nol ildizni yo'qotdi.",
      'Оба разобраны. Деление на x каждый раз теряло нулевой корень.',
      'Both are done. Dividing by x lost the zero root each time.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'x² − 5x = 0   →   x − 5 = 0,   x = 5'}</Row>,
        ok: L("Ha. X ga bo'lish nol ildizni yo'qotdi.", 'Да. Деление на x потеряло нулевой корень.', 'Yes. Dividing by x lost the zero root.'),
        question: L("To'liq javob qaysi?", 'Какой ответ полон?', 'Which answer is complete?'),
        items: [
          { id: 'a', right: true, label: 'x = 0,  x = 5' },
          { id: 'b', label: 'x = 5', hint: L("X ga bo'lishdan oldin x nolga teng bo'lishi ham mumkin edi, bu variant tekshirilmadi.", 'До деления на x значение x могло быть и нулём, этот вариант не проверен.', 'Before dividing by x, x could also equal zero, and that case was never checked.') },
          { id: 'c', label: 'x = −5', hint: L("Ishorasi xato. Ko'paytuvchilarga ajratsak x va x minus besh chiqadi.", 'Знак неверный. При разложении на множители выходит x и x минус пять.', 'The sign is wrong. Factoring gives x and x minus five.') },
        ],
        solution: ['x(x − 5) = 0', 'x = 0,  x = 5'],
      },
      {
        expr: <Row size="big" align="center">{'4x² + 3x = 0   →   4x + 3 = 0,   x = −3/4'}</Row>,
        ok: L("Ha. Bu yerda ham x ga bo'lish nol ildizni yo'qotdi.", 'Да. И здесь деление на x потеряло нулевой корень.', 'Yes. Here too, dividing by x lost the zero root.'),
        question: L("To'liq javob qaysi?", 'Какой ответ полон?', 'Which answer is complete?'),
        items: [
          { id: 'a', right: true, label: 'x = 0,  x = −3/4' },
          { id: 'b', label: 'x = −3/4', hint: L("X ga bo'lishdan oldin x nolga teng bo'lishi ham mumkin edi.", 'До деления на x x мог быть и нулём.', 'Before dividing by x, x could also be zero.') },
          { id: 'c', label: 'x = 3/4', hint: L("Ishorasi xato, to'rt iks plyus uch nolga teng bo'lganda iks manfiy.", 'Знак неверный, при четыре икс плюс три равно нулю икс отрицателен.', 'The sign is wrong; when four x plus three equals zero, x is negative.') },
        ],
        solution: ['x(4x + 3) = 0', 'x = 0,  x = −3/4'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YECHIMNI QADAMLAB YOZISH (1-darsning `fill`): erkin tushish
// masalasi ax kvadrat teng d ko'rinishiga keladi, manfiy ildiz tashlanadi.
// ============================================================
const S13 = {
  eyebrow: L('BALANDLIKDAN TUSHISH', 'ПАДЕНИЕ С ВЫСОТЫ', 'FALLING FROM A HEIGHT'),
  title: L(
    "Tushish vaqtini toping",
    'Найди время падения',
    'Find the time of the fall',
  ),
  audio: [
    A('mount',
      "Tosh tushganda bosib o'tgan masofa besh karra vaqt kvadratiga teng.",
      'Пройденный путь падающего камня равен пяти, умноженным на квадрат времени.',
      'The distance a falling stone covers equals five times the square of the time.'),
    A('why',
      "Masofani tenglamaga qo'yib, vaqtni toping. Manfiy vaqt bo'lmaydi.",
      'Подставь расстояние в уравнение и найди время. Отрицательного времени не бывает.',
      'Substitute the distance into the equation and find the time. There is no negative time.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar manfiy vaqt tashlab yuborildi.",
      'Все три заполнены. Каждый раз отрицательное время отброшено.',
      'All three are filled. Each time the negative time was discarded.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['4', '2'],
      lines: [
        [{ t: '5t² = 20   →   t² = ' }, { slot: '4' }],
        [{ t: 't = ' }, { slot: '2' }, { t: '  (manfiyi tashlanadi)' }],
      ],
    },
    tasks: [
      {
        chips: ['16', '4'],
        lines: [
          [{ t: '5t² = 80   →   t² = ' }, { slot: '16' }],
          [{ t: 't = ' }, { slot: '4' }, { t: '  (manfiyi tashlanadi)' }],
        ],
      },
      {
        chips: ['9', '3'],
        lines: [
          [{ t: '2t² = 18   →   t² = ' }, { slot: '9' }],
          [{ t: 't = ' }, { slot: '3' }, { t: '  (manfiyi tashlanadi)' }],
        ],
      },
      {
        chips: ['25', '5'],
        lines: [
          [{ t: '4t² = 100   →   t² = ' }, { slot: '25' }],
          [{ t: 't = ' }, { slot: '5' }, { t: '  (manfiyi tashlanadi)' }],
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS (to'rt savol va beshinchisi SBORKA).
// ============================================================
const S14 = {
  eyebrow: UI.blitzEyebrow,
  title: L(
    "Uch ko'rinish bo'yicha to'rt savol",
    'Четыре вопроса о трёх видах',
    'Four questions about the three forms',
  ),
  audio: [
    A('mount',
      "To'rt savol va oxirida yozuvni yig'ish.",
      'Четыре вопроса и в конце сборка записи.',
      'Four questions and an assembly at the end.'),
    A('why',
      "Har javobdan keyin izoh chiqadi.",
      'После каждого ответа выходит разбор.',
      'After each answer an explanation appears.'),
  ],
  props: {
    lead: UI.blitzLead,
    items: [
      {
        id: 'q1', tag: 'З41',
        ask: L('x² + 10 = 0 tenglamaning ildizi bormi?', 'Есть ли корни у уравнения x² + 10 = 0?', 'Does x² + 10 = 0 have roots?'),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'two', label: L('Ha, ikkita', 'Да, два', 'Yes, two') },
          { id: 'one', label: L('Ha, bitta', 'Да, один', 'Yes, one') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("Iks kvadrat minus o'nga teng bo'lardi, bu manfiy.", 'Икс квадрат был бы равен минус десяти, это отрицательно.', 'x squared would equal negative ten, which is negative.'),
        ok: L("To'g'ri, manfiy songa iks kvadrat teng bo'lolmaydi.", 'Верно, икс квадрат не может равняться отрицательному числу.', 'Correct, x squared cannot equal a negative number.'),
      },
      {
        id: 'q2', tag: 'З40',
        ask: L('x² = 25 tenglamaning ildizlari qaysi?', 'Каковы корни уравнения x² = 25?', 'What are the roots of x² = 25?'),
        options: [
          { id: 'ok', right: true, label: 'x = 5,  x = −5' },
          { id: 'onlyPos', label: 'x = 5' },
          { id: 'onlyNeg', label: 'x = −5' },
          { id: 'wrong', label: 'x = 12,5' },
        ],
        hint: L("Kvadratga oshirilganda ishora yo'qoladi, ikki javob bo'ladi.", 'При возведении в квадрат знак исчезает, есть два ответа.', 'Squaring erases the sign, so there are two answers.'),
        ok: L("To'g'ri, ikkalasi ham javob.", 'Верно, оба являются ответом.', 'Correct, both are the answer.'),
      },
      {
        id: 'q3', tag: 'З42',
        ask: L('x² − 7x = 0 tenglamaning ildizlari qaysi?', 'Каковы корни уравнения x² − 7x = 0?', 'What are the roots of x² − 7x = 0?'),
        options: [
          { id: 'ok', right: true, label: 'x = 0,  x = 7' },
          { id: 'onlySeven', label: 'x = 7' },
          { id: 'onlyZero', label: 'x = 0' },
          { id: 'neg', label: 'x = −7' },
        ],
        hint: L("Iksni qavsdan chiqaring, iks karra iks minus yetti.", 'Вынеси икс за скобку, икс умножить на икс минус семь.', 'Factor out x, x times x minus seven.'),
        ok: L("To'g'ri, x ham, yetti ham ildiz.", 'Верно, и x, и семь, корни.', 'Correct, both x and seven are roots.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('x = −2 son x² + 2x = 0 tenglamaning ildizimi?', 'Является ли x = −2 корнем уравнения x² + 2x = 0?', 'Is x = −2 a root of x² + 2x = 0?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
          { id: 'only0', label: L('Faqat nol ildiz', 'Только нуль — корень', 'Only zero is a root') },
          { id: 'cant', label: L("Aniqlab bo'lmaydi", 'Определить нельзя', 'It cannot be told') },
        ],
        hint: L("Minus ikkini qo'yib hisoblang, to'rt minus to'rt.", 'Подставь минус два и посчитай, четыре минус четыре.', 'Substitute negative two and compute, four minus four.'),
        ok: L("To'g'ri, to'rt minus to'rt nolga teng.", 'Верно, четыре минус четыре равно нулю.', 'Correct, four minus four equals zero.'),
      },
      {
        id: 'q5', tag: 'З40',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "X kvadrat qirq to'rtni yechib, ikki ildizni yig'ing.",
            'Реши икс квадрат равно сорок четыре и собери оба корня.',
            'Solve x squared equals forty four and assemble both roots.',
          ),
          lines: [
            [{ t: 'x² = 4   →   x = ' }, { slot: '2' }, { t: ',   x = ' }, { slot: '−2' }],
          ],
          tiles: [
            { id: 't1', v: '2', x: 12, y: 12 },
            { id: 't2', v: '−2', x: 70, y: 14 },
            { id: 't3', v: '4', x: 40, y: 50 },
            { id: 't4', v: '0', x: 78, y: 48 },
          ],
          hint: L(
            "To'rtdan ildiz ikki, va kvadratga oshirilganda ishora yo'qoladi.",
            'Корень из четырёх два, а при возведении в квадрат знак исчезает.',
            'The root of four is two, and squaring erases the sign.',
          ),
          doneNote: L(
            "Yig'ildi. Ikkala ishora ham javobga kiradi.",
            'Собрано. Оба знака входят в ответ.',
            'Assembled. Both signs belong in the answer.',
          ),
        },
      },
    ],
    scoreLabel: UI.scoreLabel,
    stepLabel: UI.taskLabel,
  },
}

// ============================================================
// EKRAN 15. YAKUN (1-darsning `takeaway`). Yangi matematika yo'q.
// ============================================================
const S15 = {
  eyebrow: UI.summaryEyebrow,
  title: L(
    "Chala tenglama tez yechiladi, ammo ikkita ildizni unutmang",
    'Неполное уравнение решается быстро, но не забудь про два корня',
    'An incomplete equation solves fast, but do not forget both roots',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi. 3x kvadrat minus 27 teng nol, javobi uch va minus uch.",
      'С урока остаётся одна запись. Три икс квадрат минус двадцать семь равно нулю, ответ три и минус три.',
      'One record stays with you. Three x squared minus twenty seven equals zero, the answer three and negative three.'),
    A('s1',
      "Bugun uch narsa qilindi. Uch ko'rinishni ko'rdingiz, ishoraga qarab ildiz bor-yo'qligini aniqladingiz va x ga bo'lish ildiz yo'qotishini ko'rdingiz.",
      'Сегодня сделано три вещи. Ты увидел три вида, по знаку определил наличие корней и увидел, как деление на x теряет корень.',
      'Three things are done today. You saw three forms, judged root existence by sign, and saw how dividing by x loses a root.'),
    A('s2',
      "Keyingi darsda to'liq kvadrat tenglamalar formulasi. Diskriminant bilan tanishasiz.",
      'В следующем уроке формула полного квадратного уравнения. Познакомишься с дискриминантом.',
      'The next lesson covers the formula for a complete quadratic equation. You will meet the discriminant.'),
  ],
  props: {
    mark: '3x² − 27 = 0',
    markNote: L(
      "ikki ildiz: uch va minus uch",
      'два корня: три и минус три',
      'two roots: three and negative three',
    ),
    lines: [
      L(
        "b yoki c nolga teng bo'lsa, tenglama chala",
        'Если b или c равен нулю, уравнение неполное',
        'If b or c equals zero, the equation is incomplete',
      ),
      L(
        "ildiz bor-yo'qligi ishoraga bog'liq",
        'Наличие корней зависит от знака',
        'Whether roots exist depends on sign',
      ),
      L(
        "x ga bo'lish nol ildizni yo'qotadi",
        'Деление на x теряет нулевой корень',
        'Dividing by x loses the zero root',
      ),
    ],
    bridge: L(
      "Keyingi dars: to'liq tenglama formulasi",
      'Следующий урок: формула полного уравнения',
      'Next lesson: the formula for the complete equation',
    ),
  },
}

// ============================================================
// EKRANLAR. Karkas yig'adi: o'n to'rt pozitsiya — 1-darsning asboblari,
// bitta pozitsiya (5-ekran) — AJRATIB, ILDIZ OLISH.
// ============================================================
export const SCREENS = buildScreens({
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
  tags: [
    null, null, 'З41', 'З43', 'З40',
    'З41', 'З41', 'З43', 'З43', 'З41',
    'З16', 'З42', 'З40', null, null,
  ],
  mechanic: { at: 5, tool: 'twosides', kind: 'isolate' },
  hook: <HookScene />,
  final: <FinalScene />,
})

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
