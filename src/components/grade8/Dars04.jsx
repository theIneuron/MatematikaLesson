// ============================================================================
// 8-sinf, Dars 4. KASRLARNI QO'SHISH VA AYIRISH.
//
// Bu fayl — FAQAT MA'LUMOT (ETALON_8SINF.md §2). Mexanika `tools.jsx` da,
// o'ram `screens.jsx` da, javob tekshiruvi `mathcore.js` da.
//
// BLOK 1 KONVEYERI: 2, 3, 4-darslar bitta skeletda. Rollar, asboblar, ovoz
// hodisalari va ma'lumot shakli bir xil; matematika, adashishlar, sahnalar,
// usullar va matn — o'zining.
//
// IKKI OLDINGI DARS SHU YERDA ISHLAYDI: umumiy maxrajga keltirish 2-darsning
// asosiy xossasi (ko'paytuvchi keladi, shart qo'shiladi), javobni qisqartirish
// esa 3-darsning ishi. Yangi narsa uchta: bir xil maxrajli qo'shish, umumiy
// maxraj va AYIRISHDAGI QAVS.
//
// DARSLIK. O'zbek darsligi, 4-§, 22-bet:
//   a/m + b/m = (a+b)/m,   a/m - b/m = (a-b)/m
// va ramkada: «Har xil maxrajli kasrlarni qo'shish yoki ayirish uchun bu
// kasrlarni umumiy maxrajga keltirish va bir xil maxrajli kasrlarni qo'shish
// yoki ayirish qoidasidan foydalanish kerak.»
//
// ADASHISHLAR: З2, З15, З16 — §11 ro'yxatidan. З24 (maxrajlar ham
// qo'shildi) va З25 (ayirishda qavs yo'qoldi) YANGI, metodist so'zini kutadi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L, MATH_FONT, Row, T, useT } from './core.jsx'
import { SceneBand } from './method.jsx'
import { A, W, makeLesson } from './screens.jsx'
import { F } from './tools.jsx'

export const META = {
  id: 'alg-8-04',
  n: 4,
  row: 4,
  block: 'Б1',
  topic: L(
    "Kasrlarni qo'shish va ayirish",
    'Сложение и вычитание рациональных дробей',
    'Adding and subtracting rational fractions',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Maxrajlar bir xil bo'lsa, suratlar qo'shiladi yoki ayiriladi, maxraj esa o'zgarmaydi",
    'При одинаковых знаменателях складывают или вычитают числители, знаменатель остаётся',
    'With equal denominators you add or subtract the numerators and keep the denominator',
  ),
  L(
    "Maxrajlar boshqa bo'lsa, kasrlar umumiy maxrajga keltiriladi",
    'При разных знаменателях дроби приводят к общему знаменателю',
    'With different denominators the fractions are brought to a common denominator',
  ),
  L(
    "Ayirishda minus BUTUN suratga tegishli, shart esa ikkala maxrajdan yig'iladi",
    'При вычитании минус относится ко ВСЕМУ числителю, а условие собирают с обоих знаменателей',
    'When subtracting, the minus applies to the WHOLE numerator, and the condition collects both denominators',
  ),
]

export const MISS = {
  'З2': {
    what: L(
      "shart faqat bitta maxrajdan olindi",
      'условие взято только с одного знаменателя',
      'the condition was taken from only one denominator',
    ),
    wrong: '2/(x-5)+7/x',
    at: 0,
  },
  'З15': {
    what: L(
      "umumiy maxrajga keltirishdan OLDIN qo'shildi",
      'сложили до приведения к общему знаменателю',
      'added before bringing to a common denominator',
    ),
    wrong: '3/x+2/(x+1)',
    at: 1,
  },
  'З16': {
    what: L(
      'javob son bilan tekshirilmadi',
      'ответ не проверен числом',
      'the answer was not checked with a number',
    ),
    wrong: null,
    at: 0,
  },
  'З24': {
    what: L(
      "suratlar bilan birga maxrajlar ham qo'shildi",
      'вместе с числителями сложили и знаменатели',
      'the denominators were added along with the numerators',
    ),
    wrong: '2/(x+y)',
    at: 2,
  },
  'З25': {
    what: L(
      "ayirishda qavs yo'qoldi, minus faqat birinchi hadga tushdi",
      'при вычитании потеряна скобка: минус ушёл только на первое слагаемое',
      'the bracket was lost while subtracting: the minus hit only the first term',
    ),
    wrong: '(3x+1-x+5)/(x-2)',
    at: 0,
  },
}

// ============================================================
// USULLAR (§4). Nomi qisqa, qadamlar buyruq shaklida.
// ============================================================
const M_SAME = {
  name: L(
    '1-USUL. Bitta maxraj',
    'СПОСОБ 1. Один знаменатель',
    'METHOD 1. One denominator',
  ),
  steps: [
    L("Maxrajni o'z joyida qoldiring", 'Знаменатель оставь на месте', 'Leave the denominator as it is'),
    L("Suratlarni qo'shing yoki ayiring", 'Сложи или вычти числители', 'Add or subtract the numerators'),
    L('Ayirishda qavs qo\'ying', 'При вычитании ставь скобку', 'When subtracting, add a bracket'),
  ],
}

const M_COMMON = {
  name: L(
    '2-USUL. Umumiy maxraj',
    'СПОСОБ 2. Общий знаменатель',
    'METHOD 2. Common denominator',
  ),
  steps: [
    L('Maxrajlarni ko\'paytiring', 'Перемножь знаменатели', 'Multiply the denominators'),
    L('Har kasrni to\'ldiring', 'Домножь каждую дробь', 'Complete each fraction'),
    L('Bitta suratni yig\'ing', 'Собери один числитель', 'Collect a single numerator'),
  ],
}

const M_TWO = {
  name: L(
    '3-USUL. Ikki shart',
    'СПОСОБ 3. Два запрета',
    'METHOD 3. Two restrictions',
  ),
  steps: [
    L('Ikkala maxrajga qarang', 'Смотри оба знаменателя', 'Look at both denominators'),
    L('Har birining nolini toping', 'Найди нуль каждого', 'Find the zero of each'),
    L('Hamma shartni yozing', 'Запиши все условия', 'Write down all conditions'),
  ],
}

// ============================================================
// SAHNALAR (§6). Xuk savol beradi, yakun o'sha obyektda javob beradi.
// ============================================================
const SC_ODZ = L('RUHSAT ETILGAN QIYMATLAR', 'ДОПУСТИМЫЕ ЗНАЧЕНИЯ', 'ADMISSIBLE VALUES')

// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Ikki kasr yig'indisi va qisqa yozuv",
      'Сумма двух дробей и короткая запись',
      'A sum of two fractions and a short record',
    )}>
      {/* CHAP: yig'indi, u berilgan. */}
      <text x="52" y="62" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20" fill={T.ink}>1</text>
      <line x1="34" y1="74" x2="70" y2="74" stroke={T.ink} strokeWidth="2.4"/>
      <text x="52" y="102" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20" fill={T.ink}>x</text>
      <text x="90" y="84" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20" fill={T.ink3}>+</text>
      <text x="126" y="62" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20" fill={T.ink}>1</text>
      <line x1="108" y1="74" x2="144" y2="74" stroke={T.ink} strokeWidth="2.4"/>
      <text x="126" y="102" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20" fill={T.ink}>y</text>

      {/* O'NG: kimdir shunday yozdi. Yozuv KELADI, tayyor turmaydi. */}
      <g className="g8-fly" style={{ '--d': '2900ms' }}>
        <text x="300" y="62" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20" fill={T.accent}>2</text>
        <line x1="264" y1="74" x2="336" y2="74" stroke={T.accent} strokeWidth="2.4"/>
        <text x="300" y="102" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20" fill={T.accent}>x + y</text>
      </g>

      <g className="g8-seat" style={{ '--d': '3400ms' }}>
        <circle cx="205" cy="82" r="17" fill={T.graphSoft} stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="205" y="89" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="132" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_ODZ)}</text>
      <line x1="132" y1="142" x2="268" y2="142" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5" pathLength="1" className="g8-draw"/>
    </SceneBand>
  )
}

// YAKUN: yig'indi hisoblangan, xato yozuv esa o'chirilgan.
const FinalScene = (
  <SceneBand kind="final" label={L(
    "To'g'ri yig'indi va o'chirilgan yozuv",
    'Верная сумма и зачёркнутая запись',
    'The correct sum and the crossed out record',
  )}>
    <text x="30" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ink}>1</text>
    <line x1="18" y1="37" x2="42" y2="37" stroke={T.ink} strokeWidth="1.8"/>
    <text x="30" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ink}>x</text>
    <text x="56" y="44" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ink3}>+</text>
    <text x="82" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ink}>1</text>
    <line x1="70" y1="37" x2="94" y2="37" stroke={T.ink} strokeWidth="1.8"/>
    <text x="82" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ink}>y</text>

    <text x="112" y="44" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16" fill={T.ok}>=</text>

    <text x="156" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ok}>x + y</text>
    <line x1="128" y1="37" x2="184" y2="37" stroke={T.ok} strokeWidth="1.8"/>
    <text x="156" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ok}>xy</text>

    {/* Xato yozuv qoladi va O'CHIRILADI: uni o'quvchi birinchi ekranda ko'rgan. */}
    <g className="g8-seat" style={{ '--d': '700ms' }}>
      <text x="268" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.tip}>2</text>
      <line x1="240" y1="37" x2="296" y2="37" stroke={T.tip} strokeWidth="1.8"/>
      <text x="268" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.tip}>x + y</text>
      <line x1="234" y1="46" x2="302" y2="28" stroke={T.tip} strokeWidth="2"/>
    </g>
    <g className="g8-seat" style={{ '--d': '1100ms' }}>
      <rect x="132" y="66" width="136" height="19" rx="9.5" fill={T.tipSoft}/>
      <text x="200" y="80" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
        fontWeight="700" fill={T.tip}>{'x = 2,  y = 3   5/6  va  2/5'}</text>
    </g>
  </SceneBand>
)

// ============================================================
// EKRAN 1. XUK. Taxmin, razbor yo'q (§5).
// ============================================================
const S1 = {
  eyebrow: L('IKKI YOZUV', 'ДВЕ ЗАПИСИ', 'TWO RECORDS'),
  title: L(
    "Yig'indi va qisqa yozuv",
    'Сумма и короткая запись',
    'A sum and a short record',
  ),
  lead: L(
    "Javobini dars davomida o'zingiz topasiz",
    'Ответ найдёшь сам по ходу урока',
    'You will find the answer yourself during the lesson',
  ),
  audio: [
    A('mount',
      "Chapda ikki kasr yig'indisi. O'ngda kimning yozuvi, unda suratlar ham, maxrajlar ham qo'shilgan.",
      'Слева сумма двух дробей. Справа чья-то запись, в ней сложены и числители, и знаменатели.',
      'On the left a sum of two fractions. On the right someone record where both numerators and denominators were added.'),
    A('why',
      "Taxmin qiling, bu ikki yozuv bir xil qiymat beradimi.",
      'Предположи, дают ли эти две записи одно и то же значение.',
      'Predict whether these two records give the same value.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Qiymatlar mos keladimi?",
      'Совпадут ли значения?',
      'Will the values match?',
    ),
    items: [
      {
        id: 'yes',
        show: L('Ha, bu bir xil narsa', 'Да, это одно и то же', 'Yes, it is the same thing'),
      },
      {
        id: 'no',
        show: L("Yo'q, qiymatlar boshqa", 'Нет, значения разные', 'No, the values differ'),
      },
    ],
    after: L(
      "Taxmin qayd etildi. Uni dars davomida tekshiramiz.",
      'Прогноз записан. Проверим его по ходу урока.',
      'The prediction is recorded. We will check it during the lesson.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Uchta narsa kerak bo'ladi: bir xil maxrajli
// qo'shish, sonli umumiy maxraj va 2-darsdagi to'ldirish.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    'Bir xil va boshqa maxrajlar',
    'Одинаковые и разные знаменатели',
    'Equal and different denominators',
  ),
  audio: [
    A('mount',
      "Uchta narsani eslaymiz. Ularsiz bugungi dars yurmaydi.",
      'Вспомним три вещи. Без них сегодняшний урок не пойдёт.',
      'Let us recall three things. Without them today lesson will not move.'),
    W('t1',
      "Maxrajlar bir xil bo'lganda faqat suratlar qo'shiladi.",
      'Когда знаменатели одинаковые, складывают только числители.',
      'When the denominators are equal, only the numerators are added.'),
    W('t2',
      "Ikki va uchning umumiy maxraji olti, chunki oltiga ikkisi ham bo'linadi.",
      'Общий знаменатель двух и трёх это шесть, на шесть делятся оба.',
      'The common denominator of two and three is six, and both divide it.'),
    W('t3',
      "Bu 2-darsning ishi. Maxrajga y kelsa, suratga ham y keladi.",
      'Это работа второго урока. Если в знаменатель пришёл y, он приходит и в числитель.',
      'This is the work of lesson two. If a y came into the denominator, it comes into the numerator too.'),
  ],
  props: {
    items: [
      {
        prompt: L(
          "Suratda qanday son turadi?",
          'Какое число будет в числителе?',
          'Which number will be in the numerator?',
        ),
        show: (
          <Row size="row" align="center">
            {F('2', '7')}
            {' + '}
            {F('3', '7')}
          </Row>
        ),
        kind: 'number',
        answer: '5',
        accepts: ['5'],
        hints: {
          '6': L(
            "Suratlar qo'shiladi, ko'paytirilmaydi.",
            'Числители складывают, а не умножают.',
            'The numerators are added, not multiplied.',
          ),
          '14': L(
            "Maxrajlar bir xil, ular qo'shilmaydi.",
            'Знаменатели одинаковые, они не складываются.',
            'The denominators are equal and they are not added.',
          ),
        },
        closed: L('2/7 + 3/7 = 5/7', '2/7 + 3/7 = 5/7', '2/7 + 3/7 = 5/7'),
      },
      {
        prompt: L(
          "Umumiy maxrajni yozing",
          'Запиши общий знаменатель',
          'Write the common denominator',
        ),
        show: (
          <Row size="row" align="center">
            {F('1', '2')}
            {' + '}
            {F('1', '3')}
          </Row>
        ),
        kind: 'number',
        answer: '6',
        accepts: ['6'],
        hints: {
          '5': L(
            "Besh bu maxrajlarning yig'indisi. Umumiy maxraj ikkisiga ham bo'linadi.",
            'Пять это сумма знаменателей. Общий знаменатель делится на оба.',
            'Five is the sum of the denominators. A common denominator is divisible by both.',
          ),
          '2': L(
            "Ikki uchga bo'linmaydi, demak u umumiy emas.",
            'Два не делится на три, значит он не общий.',
            'Two is not divisible by three, so it is not common.',
          ),
        },
        closed: L('umumiy maxraj 6', 'общий знаменатель 6', 'common denominator 6'),
      },
      {
        prompt: L(
          "Maxraj xy bo'ldi. Suratda nima turadi?",
          'Знаменатель стал xy. Что будет в числителе?',
          'The denominator became xy. What will be in the numerator?',
        ),
        show: (
          <Row size="row" align="center">
            {F('3', 'x')}
            {' = '}
            {F('?', 'xy')}
          </Row>
        ),
        kind: 'expr',
        answer: '3y',
        accepts: ['3*y', 'y*3'],
        hints: {
          '3': L(
            "Maxraj y ga ko'paytirildi, surat ham ko'paytirilishi kerak.",
            'Знаменатель умножили на y, числитель тоже надо умножить.',
            'The denominator was multiplied by y, the numerator must be multiplied too.',
          ),
          '3+y': L(
            "Qo'shish emas, ko'paytirish. Bu kasrning asosiy xossasi.",
            'Не прибавление, а умножение. Это основное свойство дроби.',
            'Not addition but multiplication. That is the basic property of a fraction.',
          ),
        },
        closed: L('3/x = 3y/(xy)', '3/x = 3y/(xy)', '3/x = 3y/(xy)'),
      },
    ],
  },
}

// ============================================================
// EKRAN 3. YADRO. Lenta: sonlarda umumiy maxraj va qo'shish, keyin
// harfli qoida. Figura `mult` qatlamda: uchta holat, bitta obyekt.
// ============================================================
const S3 = {
  eyebrow: L("QO'SHISH", 'СЛОЖЕНИЕ', 'ADDITION'),
  title: L(
    'Bitta maxraj ostida',
    'Под одним знаменателем',
    'Under one denominator',
  ),
  audio: [
    A('mount',
      "Sonlarda ko'ramiz, keyin harflarga o'tamiz.",
      'Посмотрим на числах, потом перейдём к буквам.',
      'We look at numbers first and then move to letters.'),
    W('k2',
      "Ikkala kasr ham oltinchiga keltirildi. Endi maxrajlar bir xil.",
      'Обе дроби приведены к шестым. Теперь знаменатели одинаковые.',
      'Both fractions are brought to sixths. Now the denominators are equal.'),
    W('k3',
      "Bir xil maxrajli kasrlarda faqat suratlar qo'shiladi, maxraj esa o'z joyida qoladi.",
      'У дробей с одинаковым знаменателем складывают только числители, а знаменатель остаётся на месте.',
      'For fractions with an equal denominator only the numerators are added and the denominator stays.'),
  ],
  props: {
    film: {
      fig: 'mult',
      data: {
        left: (
          <Row size="row" align="center">
            {F('1', '2')}
            {' + '}
            {F('1', '3')}
          </Row>
        ),
        mid: (
          <Row size="row" align="center">
            {F('3', '6')}
            {' + '}
            {F('2', '6')}
          </Row>
        ),
        right: F('5', '6'),
        same: L(
          "maxraj bitta, suratlar qo'shildi",
          'знаменатель один, числители сложены',
          'one denominator, the numerators are added',
        ),
        rule: (
          <Row size="row" align="center">
            {F('a', 'm')}
            {' + '}
            {F('b', 'm')}
            {' = '}
            {F('a + b', 'm')}
          </Row>
        ),
      },
      frames: [
        {
          id: 'k1',
          phase: 0,
          label: L('Maxrajlar', 'Знаменатели', 'Denominators'),
          text: L(
            "Maxrajlar boshqa, shuning uchun qo'shib bo'lmaydi",
            'Знаменатели разные, поэтому складывать нельзя',
            'The denominators differ, so adding is not possible yet',
          ),
        },
        {
          id: 'k2',
          phase: 1,
          label: L('Umumiy maxraj', 'Общий знаменатель', 'Common denominator'),
          text: L(
            "Ikkalasi ham oltinchiga keltirildi va qo'shildi",
            'Обе привели к шестым и сложили',
            'Both were brought to sixths and added',
          ),
          ask: {
            question: L(
              'Qaysi maxraj umumiy bo\'ldi?',
              'Какой знаменатель стал общим?',
              'Which denominator became the common one?',
            ),
            items: [
              { id: 'six', right: true, label: L('6', '6', '6') },
              {
                id: 'five',
                label: L('5', '5', '5'),
                hint: L(
                  "Besh bu maxrajlarning yig'indisi, u ikkiga ham bo'linmaydi.",
                  'Пять это сумма знаменателей, и на два она не делится.',
                  'Five is the sum of the denominators and it is not divisible by two.',
                ),
              },
              {
                id: 'two',
                label: L('2', '2', '2'),
                hint: L(
                  "Ikki uchga bo'linmaydi, ikkinchi kasr keltirilmaydi.",
                  'Два не делится на три, вторую дробь к нему не привести.',
                  'Two is not divisible by three, the second fraction cannot go there.',
                ),
              },
              {
                id: 'three',
                label: L('3', '3', '3'),
                hint: L(
                  "Uch ikkiga bo'linmaydi, birinchi kasr keltirilmaydi.",
                  'Три не делится на два, первую дробь к нему не привести.',
                  'Three is not divisible by two, the first fraction cannot go there.',
                ),
              },
            ],
          },
        },
        {
          id: 'k3',
          phase: 2,
          label: L('Qoida', 'Правило', 'The rule'),
          text: L(
            "Harflar bilan ham shunday, maxraj o'z joyida qoladi",
            'С буквами так же, знаменатель остаётся на месте',
            'With letters the same, the denominator stays in place',
          ),
          ask: {
            question: L(
              "Bir xil maxrajli kasrlarda nima qo'shiladi?",
              'Что складывают у дробей с одинаковым знаменателем?',
              'What is added for fractions with an equal denominator?',
            ),
            items: [
              {
                id: 'num',
                right: true,
                label: L('Faqat suratlar', 'Только числители', 'Only the numerators'),
              },
              {
                id: 'den',
                label: L('Faqat maxrajlar', 'Только знаменатели', 'Only the denominators'),
                hint: L(
                  "Maxrajlar qo'shilsa, qiymat butunlay boshqa chiqadi. Sonlarda tekshiramiz.",
                  'Если сложить знаменатели, значение выйдет совсем другим. Проверим на числах.',
                  'Adding the denominators gives a completely different value. We will check on numbers.',
                ),
              },
              {
                id: 'both',
                label: L('Ikkalasi ham', 'И то, и другое', 'Both of them'),
                hint: L(
                  "Ikki yettidan va uch yettidan besh yettidan beradi, o'n to'rtdan emas.",
                  'Две седьмых и три седьмых дают пять седьмых, а не пять четырнадцатых.',
                  'Two sevenths and three sevenths give five sevenths, not five fourteenths.',
                ),
              },
              {
                id: 'none',
                label: L("Hech narsa", 'Ничего', 'Nothing'),
                hint: L(
                  "Yig'indi hisoblanadi. Suratlarga qarang.",
                  'Сумма считается. Посмотри на числители.',
                  'The sum is computed. Look at the numerators.',
                ),
              },
            ],
          },
        },
      ],
    },
  },
}

// ============================================================
// EKRAN 4. 1-USUL: bir xil maxraj va AYIRISH. Darsning eng qimmat joyi —
// QAVS. Minus butun suratga tegishli, aks holda ikkinchi had belgisini
// o'zgartirmaydi (З25). Javob esa 3-darsdagidek QISQARADI.
// ============================================================
const S4 = {
  eyebrow: L('1-USUL', 'СПОСОБ 1', 'METHOD 1'),
  title: L(
    'Ayirishdagi qavs',
    'Скобка при вычитании',
    'The bracket when subtracting',
  ),
  audio: [
    A('mount',
      "Maxrajlar bir xil, demak ayirish suratlarda bo'ladi.",
      'Знаменатели одинаковые, значит вычитание идёт в числителях.',
      'The denominators are equal, so the subtraction happens in the numerators.'),
    W('s2',
      "Ikkinchi surat qavsga olindi. Minus unga butunlay tegishli.",
      'Второй числитель взят в скобку. Минус относится к нему целиком.',
      'The second numerator is taken in a bracket. The minus applies to all of it.'),
    W('s3',
      "Surat ikki iks minus to'rt bo'ldi, va unda maxraj ko'paytuvchisi bor.",
      'Числитель стал два икс минус четыре, и в нём есть множитель знаменателя.',
      'The numerator became two x minus four, and it contains the factor of the denominator.'),
    W('s4',
      "Shart boshlang'ich yozuvdan qoladi, javobda harf yo'q.",
      'Условие остаётся от исходной записи, в ответе буквы нет.',
      'The condition stays from the original record; the answer has no letter.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {F('3x + 1', 'x − 2')}
        {' − '}
        {F('x + 5', 'x − 2')}
      </Row>
    ),
    actions: [
      { id: 'sub', label: L('Suratlarni ayirish', 'Вычесть числители', 'Subtract the numerators') },
      { id: 'dens', label: L('Maxrajlarni ayirish', 'Вычесть знаменатели', 'Subtract the denominators') },
      { id: 'add', label: L("Suratlarni qo'shish", 'Сложить числители', 'Add the numerators') },
    ],
    steps: [
      {
        action: 'sub',
        wrongs: [
          {
            action: 'dens',
            hint: L(
              "Maxrajlar bir xil, ular o'z joyida qoladi. Ayirish suratlarda.",
              'Знаменатели одинаковые, они остаются на месте. Вычитание в числителях.',
              'The denominators are equal and they stay. The subtraction is in the numerators.',
            ),
          },
          {
            action: 'add',
            hint: L(
              "Yozuvda minus turibdi. Belgiga qarang.",
              'В записи стоит минус. Посмотри на знак.',
              'The record holds a minus. Look at the sign.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'rule',
              right: true,
              label: L(
                "Bir xil maxrajli ayirish qoidasi",
                'Правило вычитания при одном знаменателе',
                'The rule for subtracting with one denominator',
              ),
            },
            {
              id: 'main',
              label: L('Kasrning asosiy xossasi', 'Основное свойство дроби', 'The basic property of a fraction'),
              hint: L(
                "Xossa maxrajni o'zgartirganda kerak. Bu yerda maxraj o'sha.",
                'Свойство нужно, когда меняют знаменатель. Здесь знаменатель тот же.',
                'The property is needed when the denominator changes. Here it stays the same.',
              ),
            },
            {
              id: 'open',
              label: L('Qavsni ochish qoidasi', 'Правило раскрытия скобок', 'The rule for opening brackets'),
              hint: L(
                "Qavs hali qo'yilgani yo'q. Avval ayirish yoziladi.",
                'Скобка ещё не поставлена. Сначала записывают вычитание.',
                'The bracket is not there yet. The subtraction is written first.',
              ),
            },
          ],
        },
        ask: L(
          "Bitta kasr qilib yozing",
          'Запиши одной дробью',
          'Write it as a single fraction',
        ),
        answer: '((3x+1)-(x+5))/(x-2)',
        accepts: ['(2x-4)/(x-2)', '(3x+1-x-5)/(x-2)'],
        hints: {
          '(3x+1-x+5)/(x-2)': L(
            "Minus butun suratga tegishli. Beshlik oldidagi belgi ham o'zgaradi.",
            'Минус относится ко всему числителю. Знак перед пятёркой тоже меняется.',
            'The minus applies to the whole numerator. The sign before the five changes too.',
          ),
          '(4x+6)/(x-2)': L(
            "Bu qo'shish bo'ldi. Yozuvda esa ayirish turibdi.",
            'Это сложение. А в записи стоит вычитание.',
            'That is addition. But the record holds a subtraction.',
          ),
          '2': L(
            "Javob shu, lekin bu keyingi qadam. Hozir bitta kasr yozilishi kerak.",
            'Это верный итог, но следующим шагом. Сейчас нужна одна дробь.',
            'That is the right result but it belongs to the next step. Now one fraction is needed.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('(3x + 1) − (x + 5)', 'x − 2')}
            {' = '}
            {F('2x − 4', 'x − 2')}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'cut', label: L('Qisqartirish', 'Сократить', 'Reduce it') },
          { id: 'keep', label: L('Shundayligicha qoldirish', 'Оставить как есть', 'Leave it as it is') },
          { id: 'open', label: L('Qavsni ochish', 'Раскрыть скобку', 'Open the bracket') },
        ],
        action: 'cut',
        wrongs: [
          {
            action: 'keep',
            hint: L(
              "Suratda ikkilik ajratilsa, maxrajning ko'paytuvchisi ko'rinadi.",
              'Если в числителе вынести двойку, покажется множитель знаменателя.',
              'Taking a two out of the numerator reveals the factor of the denominator.',
            ),
          },
          {
            action: 'open',
            hint: L(
              "Qavs allaqachon ochilgan, surat ikki iks minus to'rt.",
              'Скобка уже раскрыта: числитель это два икс минус четыре.',
              'The bracket is already opened: the numerator is two x minus four.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'main',
              right: true,
              label: L('Kasrning asosiy xossasi', 'Основное свойство дроби', 'The basic property of a fraction'),
            },
            {
              id: 'rule',
              label: L('Ayirish qoidasi', 'Правило вычитания', 'The subtraction rule'),
              hint: L(
                "Ayirish bajarildi. Hozir kasr qisqartirilmoqda.",
                'Вычитание уже выполнено. Сейчас дробь сокращают.',
                'The subtraction is done. Now the fraction is being reduced.',
              ),
            },
            {
              id: 'sum',
              label: L("Yig'indi qoidasi", 'Правило суммы', 'The sum rule'),
              hint: L(
                "Bu yerda yig'indi yo'q, ko'paytuvchi qidiriladi.",
                'Здесь нет суммы, здесь ищут множитель.',
                'There is no sum here, a factor is being sought.',
              ),
            },
          ],
        },
        ask: L(
          'Nima qoldi?',
          'Что осталось?',
          'What is left?',
        ),
        answer: '2',
        accepts: ['2'],
        hints: {
          '2x-4': L(
            "Bu surat. Maxrajga ham bo'lish kerak.",
            'Это числитель. Надо разделить и на знаменатель.',
            'That is the numerator. The denominator must be divided too.',
          ),
          '(2x-4)/(x-2)': L(
            "Qisqartirish bajarilmagan. Suratda ikkilikni ajratib ko'ring.",
            'Сокращение не выполнено. Вынеси в числителе двойку.',
            'The reducing is not done. Take a two out of the numerator.',
          ),
          'x-2': L(
            "Bo'lingan ko'paytuvchi ketadi, ikkilik esa qoladi.",
            'Множитель, на который делили, уходит, а двойка остаётся.',
            'The factor we divided by leaves and the two stays.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('2(x − 2)', 'x − 2')}
            {' = 2'}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'src', label: L("Boshlang'ich yozuvdan", 'Из исходной записи', 'From the original record') },
          { id: 'ans', label: L('Javobdan', 'Из ответа', 'From the answer') },
          { id: 'none', label: L("Shart kerak emas", 'Условие не нужно', 'No condition needed') },
        ],
        action: 'src',
        wrongs: [
          {
            action: 'ans',
            hint: L(
              "Javob ikkilik, unda harf yo'q. Shart yozuvdan OLDIN paydo bo'lgan.",
              'Ответ это двойка, в нём буквы нет. Условие возникло ДО него.',
              'The answer is a two with no letter. The condition appeared BEFORE it.',
            ),
          },
          {
            action: 'none',
            hint: L(
              "Ikkala kasrning maxraji iks minus ikki. Bir qiymatda u nolga aylanadi.",
              'У обеих дробей знаменатель икс минус два. При одном значении он обращается в нуль.',
              'Both fractions have denominator x minus two. At one value it becomes zero.',
            ),
          },
        ],
        why: {
          question: L(
            'Shart qaydan keladi?',
            'Откуда берётся условие?',
            'Where does the condition come from?',
          ),
          items: [
            {
              id: 'den',
              right: true,
              label: L('Maxrajdan', 'От знаменателя', 'From the denominator'),
            },
            {
              id: 'num',
              label: L('Suratdan', 'От числителя', 'From the numerator'),
              hint: L(
                "Suratdagi nol qiymatni nol qiladi, qiymatni yo'q qilmaydi.",
                'Нуль в числителе делает значение нулём, а не убирает его.',
                'Zero in the numerator makes the value zero, it does not remove it.',
              ),
            },
            {
              id: 'sign',
              label: L('Minus belgisidan', 'От знака минус', 'From the minus sign'),
              hint: L(
                "Belgi shartni bermaydi. Shartni nolga aylanadigan maxraj beradi.",
                'Знак условия не даёт. Условие даёт знаменатель, обращающийся в нуль.',
                'A sign gives no condition. The condition comes from a denominator that becomes zero.',
              ),
            },
          ],
        },
        kind: 'odz',
        varName: 'x',
        excluded: [2],
        accepts: ['x != 2', 'x-2 != 0'],
        ask: L(
          'Ruhsat etilgan qiymatlarni yozing',
          'Запиши допустимые значения',
          'Write the admissible values',
        ),
        hints: {
          'x != -2': L(
            "Minus ikkida maxraj minus to'rtga teng, nolga emas.",
            'При минус двух знаменатель равен минус четырём, а не нулю.',
            'At minus two the denominator equals minus four, not zero.',
          ),
          'x != 0': L(
            "Nolda maxraj minus ikkiga teng, yozuv hisoblanadi.",
            'При нуле знаменатель равен минус двум, запись считается.',
            'At zero the denominator equals minus two and the record computes.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'x ≠ 2'}
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 5. 2-USUL: BOSHQA maxrajlar. Bu yerda 2-dars ishga tushadi —
// har kasr o'z ko'paytuvchisiga to'ldiriladi. Surat SO'RALADI, butun yozuv
// emas: butun yozuvni so'rasak, o'quvchi boshlang'ich yig'indini qaytadan
// ko'chirishi ham «to'g'ri» bo'lib chiqadi (qiymat va soha bir xil).
// ============================================================
const S5 = {
  eyebrow: L('2-USUL', 'СПОСОБ 2', 'METHOD 2'),
  title: L(
    'Boshqa maxrajlar',
    'Разные знаменатели',
    'Different denominators',
  ),
  audio: [
    A('mount',
      "Maxrajlar boshqa. Avval umumiy maxraj, keyin qo'shish.",
      'Знаменатели разные. Сначала общий знаменатель, потом сложение.',
      'The denominators differ. First the common denominator, then the addition.'),
    W('s2',
      "Umumiy maxraj ikkalasining ko'paytmasi. Har kasr o'z ko'paytuvchisiga to'ldiriladi.",
      'Общий знаменатель это произведение обоих. Каждую дробь дополняют своим множителем.',
      'The common denominator is the product of both. Each fraction is completed by its own factor.'),
    W('s3',
      "Ikki surat bitta bo'ldi. Endi o'xshash hadlar yig'iladi.",
      'Два числителя стали одним. Теперь собирают подобные слагаемые.',
      'Two numerators became one. Now the like terms are collected.'),
    W('s4',
      "Ikki maxraj ikki shart beradi.",
      'Два знаменателя дают два условия.',
      'Two denominators give two conditions.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {F('3', 'x')}
        {' + '}
        {F('2', 'x + 1')}
      </Row>
    ),
    actions: [
      { id: 'mul', label: L("Maxrajlarni ko'paytirish", 'Перемножить знаменатели', 'Multiply the denominators') },
      { id: 'sum', label: L("Maxrajlarni qo'shish", 'Сложить знаменатели', 'Add the denominators') },
      { id: 'now', label: L("Darrov suratlarni qo'shish", 'Сразу сложить числители', 'Add the numerators right away') },
    ],
    steps: [
      {
        action: 'mul',
        wrongs: [
          {
            action: 'sum',
            hint: L(
              "Maxrajlarning yig'indisi umumiy maxraj bermaydi. Ikki uchdan va bir uchdan bilan tekshirib ko'ring.",
              'Сумма знаменателей общего знаменателя не даёт. Проверь на половине и трети.',
              'The sum of denominators is not a common denominator. Check it on a half and a third.',
            ),
          },
          {
            action: 'now',
            hint: L(
              "Maxrajlar boshqa. Bir xil bo'lmaguncha suratlar qo'shilmaydi.",
              'Знаменатели разные. Пока они не одинаковые, числители не складывают.',
              'The denominators differ. Until they are equal the numerators are not added.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'common',
              right: true,
              label: L('Umumiy maxrajga keltirish', 'Приведение к общему знаменателю', 'Bringing to a common denominator'),
            },
            {
              id: 'rule',
              label: L("Qo'shish qoidasi", 'Правило сложения', 'The addition rule'),
              hint: L(
                "Qoida bir xil maxraj uchun. Uni keyin ishlatamiz.",
                'Правило работает при одинаковом знаменателе. Его применим потом.',
                'The rule works for equal denominators. We will use it later.',
              ),
            },
            {
              id: 'cut',
              label: L('Qisqartirish qoidasi', 'Правило сокращения', 'The reducing rule'),
              hint: L(
                "Qisqartirish keyin, javobda kerak bo'lishi mumkin.",
                'Сокращение будет позже, в ответе, если понадобится.',
                'Reducing comes later, in the answer, if needed at all.',
              ),
            },
          ],
        },
        ask: L(
          'Umumiy maxrajni yozing',
          'Запиши общий знаменатель',
          'Write the common denominator',
        ),
        answer: 'x(x+1)',
        accepts: ['x*x+x', '(x+1)x'],
        hints: {
          'x+1': L(
            "Bu faqat ikkinchi maxraj. Birinchi kasr unga keltirilmaydi.",
            'Это только второй знаменатель. Первую дробь к нему не привести.',
            'That is only the second denominator. The first fraction cannot go there.',
          ),
          '2x+1': L(
            "Bu maxrajlarning yig'indisi, ko'paytmasi emas.",
            'Это сумма знаменателей, а не произведение.',
            'That is the sum of the denominators, not the product.',
          ),
          'x': L(
            "Bu faqat birinchi maxraj. Ikkinchi kasr unga keltirilmaydi.",
            'Это только первый знаменатель. Вторую дробь к нему не привести.',
            'That is only the first denominator. The second fraction cannot go there.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('3(x + 1)', 'x(x + 1)')}
            {' + '}
            {F('2x', 'x(x + 1)')}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'collect', label: L("Suratlarni yig'ish", 'Собрать числители', 'Collect the numerators') },
          { id: 'cut', label: L('Iksni qisqartirish', 'Сократить икс', 'Reduce the x') },
          { id: 'dens', label: L("Maxrajlarni qo'shish", 'Сложить знаменатели', 'Add the denominators') },
        ],
        action: 'collect',
        wrongs: [
          {
            action: 'cut',
            hint: L(
              "Suratda yig'indi bor, unda iks ko'paytuvchi emas. Bu 3-darsning qoidasi.",
              'В числителе сумма, и икс там не множитель. Это правило третьего урока.',
              'The numerator holds a sum where x is not a factor. That is the rule of lesson three.',
            ),
          },
          {
            action: 'dens',
            hint: L(
              "Maxrajlar allaqachon bir xil. Ular qo'shilmaydi.",
              'Знаменатели уже одинаковые. Они не складываются.',
              'The denominators are already equal. They are not added.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'rule',
              right: true,
              label: L("Bir xil maxrajli qo'shish qoidasi", 'Правило сложения при одном знаменателе', 'The rule for adding with one denominator'),
            },
            {
              id: 'common',
              label: L('Umumiy maxrajga keltirish', 'Приведение к общему знаменателю', 'Bringing to a common denominator'),
              hint: L(
                "Keltirish bajarildi, maxrajlar bir xil bo'ldi.",
                'Приведение уже выполнено, знаменатели стали одинаковыми.',
                'The bringing is done, the denominators are equal now.',
              ),
            },
            {
              id: 'main',
              label: L('Kasrning asosiy xossasi', 'Основное свойство дроби', 'The basic property of a fraction'),
              hint: L(
                "Xossa oldingi qadamda ishladi, u yerda kasrlar to'ldirildi.",
                'Свойство сработало на прошлом шаге, там дроби дополняли.',
                'The property worked on the previous step where the fractions were completed.',
              ),
            },
          ],
        },
        ask: L(
          'Umumiy suratni yozing',
          'Запиши общий числитель',
          'Write the common numerator',
        ),
        answer: '5x+3',
        accepts: ['3(x+1)+2x', '3x+3+2x'],
        hints: {
          '5x+1': L(
            "Uchlik qavsga ham ko'paytiriladi, uch karra bir uch beradi.",
            'Тройка умножается и на единицу в скобке: три на один это три.',
            'The three multiplies the one in the bracket as well: three times one is three.',
          ),
          '5': L(
            "Faqat sonlar qo'shilgan. Iksli hadlar ham bor.",
            'Сложены только числа. Есть ещё слагаемые с иксом.',
            'Only the numbers were added. There are terms with x as well.',
          ),
          '3x+3': L(
            "Ikkinchi kasrning surati qo'shilmagan.",
            'Числитель второй дроби не добавлен.',
            'The numerator of the second fraction was not added.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('5x + 3', 'x(x + 1)')}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'both', label: L('Ikkala maxrajdan', 'С обоих знаменателей', 'From both denominators') },
          { id: 'one', label: L('Bittasidan', 'С одного', 'From one of them') },
          { id: 'none', label: L("Shart kerak emas", 'Условие не нужно', 'No condition needed') },
        ],
        action: 'both',
        wrongs: [
          {
            action: 'one',
            hint: L(
              "Ikkala kasr ham yozuvda turibdi, demak ikkalasining sharti ham kerak.",
              'В записи стоят обе дроби, значит нужны условия обеих.',
              'Both fractions are in the record, so both conditions are needed.',
            ),
          },
          {
            action: 'none',
            hint: L(
              "Ikkala maxrajda ham harf bor. Har biri bir qiymatda nolga aylanadi.",
              'В обоих знаменателях есть буква. Каждый при своём значении обращается в нуль.',
              'Both denominators hold a letter. Each becomes zero at its own value.',
            ),
          },
        ],
        why: {
          question: L(
            'Nega ikkita shart?',
            'Почему условий два?',
            'Why are there two conditions?',
          ),
          items: [
            {
              id: 'two',
              right: true,
              label: L('Ikki maxraj bor', 'Знаменателей два', 'There are two denominators'),
            },
            {
              id: 'plus',
              label: L("Yig'indi ikki hadli", 'В сумме два слагаемых', 'The sum has two terms'),
              hint: L(
                "Hadlar soni ahamiyatsiz. Maxrajlar nolga aylanishi ahamiyatli.",
                'Число слагаемых ни при чём. Важно, что знаменатели обращаются в нуль.',
                'The number of terms is irrelevant. What matters is denominators becoming zero.',
              ),
            },
            {
              id: 'big',
              label: L('Umumiy maxraj uzun', 'Общий знаменатель длинный', 'The common denominator is long'),
              hint: L(
                "Uzunlik ahamiyatsiz. Nolga aylanadigan joylar ahamiyatli.",
                'Длина ни при чём. Важны места, где выходит нуль.',
                'Length is irrelevant. What matters is where zero appears.',
              ),
            },
          ],
        },
        kind: 'odz',
        varName: 'x',
        excluded: [-1, 0],
        accepts: ['x != 0, x != -1', 'x(x+1) != 0'],
        ask: L(
          'Ruhsat etilgan qiymatlarni yozing',
          'Запиши допустимые значения',
          'Write the admissible values',
        ),
        hints: {
          'x != 0': L(
            "Ikkinchi maxraj ham nolga aylanadi. Qaysi qiymatda?",
            'Второй знаменатель тоже обращается в нуль. При каком значении?',
            'The second denominator also becomes zero. At which value?',
          ),
          'x != -1': L(
            "Birinchi maxraj iks. U nolda nolga aylanadi.",
            'Первый знаменатель это икс. Он обращается в нуль при нуле.',
            'The first denominator is x. It becomes zero at zero.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'x ≠ 0,  x ≠ −1'}
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 6. BIRGA YECHAMIZ. Xukning yozuvi tekshiriladi. MUVAFFAQIYATSIZ
// QADAM: «maxrajlarni ham qo'shamiz» satri chiqadi va SON bilan rad
// etiladi (З24).
// ============================================================
const S6 = {
  eyebrow: L('BIRGA YECHAMIZ', 'РЕШАЕМ ВМЕСТЕ', 'SOLVING TOGETHER'),
  title: L(
    "Yig'indi qanday hisoblanadi",
    'Как считается сумма',
    'How the sum is computed',
  ),
  audio: [
    A('mount',
      "Birinchi ekrandagi yozuvni oxirigacha tekshiramiz.",
      'Проверим до конца запись с первого экрана.',
      'We will check the record from the first screen all the way.'),
    W('s3',
      "Ikki va uchda chapda besh oltidan, o'ngda ikki beshdan chiqadi.",
      'При двух и трёх слева выходит пять шестых, а справа две пятых.',
      'At two and three the left gives five sixths and the right gives two fifths.'),
    W('s5',
      "Bitta son yetdi. Yozuv rad etildi.",
      'Одного числа хватило. Запись отвергнута.',
      'One number was enough. The record is refuted.'),
    W('s6',
      "To'g'ri yo'l umumiy maxrajdan o'tadi, va u maxrajlarning ko'paytmasi.",
      'Верный путь идёт через общий знаменатель, а он произведение знаменателей.',
      'The correct path goes through the common denominator, which is the product of the denominators.'),
  ],
  props: {
    task: L(
      "1/x + 1/y va 2/(x + y) bitta narsami?",
      'Одно ли это и то же: 1/x + 1/y и 2/(x + y)?',
      'Are 1/x + 1/y and 2/(x + y) the same thing?',
    ),
    lines: [
      {
        text: '1/x + 1/y      2/(x + y)',
        note: L('berilgan', 'дано', 'given'),
      },
      {
        text: L(
          "Suratlar bir, maxrajlar esa boshqa",
          'Числители по одному, а знаменатели разные',
          'The numerators are ones and the denominators differ',
        ),
      },
      {
        text: 'x = 2,  y = 3',
        ask: {
          question: L(
            "Chapda va o'ngda nima chiqadi?",
            'Что выйдет слева и справа?',
            'What comes out on the left and on the right?',
          ),
          items: [
            { id: 'diff', right: true, label: L('5/6 va 2/5', '5/6 и 2/5', '5/6 and 2/5') },
            {
              id: 'same',
              label: L('5/6 va 5/6', '5/6 и 5/6', '5/6 and 5/6'),
              hint: L(
                "O'ngda surat ikki, maxraj esa besh. Bu ikki beshdan.",
                'Справа числитель два, а знаменатель пять. Это две пятых.',
                'On the right the numerator is two and the denominator is five. That is two fifths.',
              ),
            },
            {
              id: 'two',
              label: L('2/5 va 2/5', '2/5 и 2/5', '2/5 and 2/5'),
              hint: L(
                "Chapda yarim va bir uchdan qo'shiladi, bu besh oltidan.",
                'Слева складывают половину и треть, это пять шестых.',
                'On the left a half and a third are added, that is five sixths.',
              ),
            },
          ],
          after: L(
            'Qiymatlar ajraldi',
            'Значения разошлись',
            'The values differ',
          ),
        },
      },
      {
        text: L(
          "Demak maxrajlarni qo'shish mumkin emas",
          'Значит складывать знаменатели нельзя',
          'So the denominators cannot be added',
        ),
        tone: 'no',
      },
      {
        text: '1/x + 1/y = y/(xy) + x/(xy)',
        ask: {
          question: L(
            'Umumiy maxraj qanday olindi?',
            'Как получен общий знаменатель?',
            'How was the common denominator obtained?',
          ),
          items: [
            {
              id: 'mul',
              right: true,
              label: L("Maxrajlar ko'paytirildi", 'Знаменатели перемножены', 'The denominators were multiplied'),
            },
            {
              id: 'add',
              label: L("Maxrajlar qo'shildi", 'Знаменатели сложены', 'The denominators were added'),
              hint: L(
                "Qo'shish hozir rad etildi. Yozuvda xy turibdi, x plyus y emas.",
                'Сложение только что отвергли. В записи стоит xy, а не x плюс y.',
                'Addition was just refuted. The record holds xy, not x plus y.',
              ),
            },
            {
              id: 'pick',
              label: L('Kattasi tanlandi', 'Выбрали больший', 'The bigger one was chosen'),
              hint: L(
                "Harflarda kattasini tanlab bo'lmaydi. Ko'paytmaga ikkisi ham bo'linadi.",
                'У букв больший не выбрать. На произведение делятся оба.',
                'With letters you cannot pick the bigger one. Both divide the product.',
              ),
            },
          ],
          after: L(
            "Har kasr o'z ko'paytuvchisiga to'ldirildi",
            'Каждую дробь дополнили своим множителем',
            'Each fraction was completed by its own factor',
          ),
        },
      },
      {
        text: L(
          "Yig'indi (x + y)/(xy) ga teng, shart esa ikkita",
          'Сумма равна (x + y)/(xy), а условий два',
          'The sum equals (x + y)/(xy), and there are two conditions',
        ),
        tone: 'ok',
      },
    ],
  },
}

// ============================================================
// EKRAN 7. CHEGARA (`kind: 'boundary'`). Yig'indining sharti IKKI
// maxrajdan yig'iladi — javob SONLAR TO'PLAMI, bitta son emas.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L(
    "Yig'indining ikki sharti",
    'Два условия суммы',
    'Two conditions of a sum',
  ),
  audio: [
    A('mount',
      "Ikki yozuv teng, lekin ular hamma joyda hisoblanmaydi.",
      'Две записи равны, но считаются они не везде.',
      'The two records are equal, but they do not compute everywhere.'),
    A('why',
      "Chapda ikki maxraj bor, o'ngda esa bitta, lekin u ko'paytma.",
      'Слева два знаменателя, справа один, но он произведение.',
      'On the left there are two denominators, on the right one, but it is a product.'),
  ],
  props: {
    left: (
      <Row size="row" align="center">
        {F('1', 'x − 1')}
        {' + '}
        {F('1', 'x + 1')}
      </Row>
    ),
    right: (
      <Row size="row" align="center">
        {F('2x', 'x · x − 1')}
      </Row>
    ),
    odzLeft: L('?', '?', '?'),
    odzRight: L('?', '?', '?'),
    question: L(
      "Yozuvlar hisoblanmaydigan hamma qiymatni yozing",
      'Запиши все значения, при которых записи не считаются',
      'Write every value at which the records do not compute',
    ),
    answer: [-1, 1],
    hints: {
      '1': L(
        "Bittasi to'g'ri. Ikkinchi maxraj ham nolga aylanadi, uni ham yozing.",
        'Одно верно. Второй знаменатель тоже обращается в нуль, запиши и его.',
        'One is right. The second denominator becomes zero too, write it as well.',
      ),
      '-1': L(
        "Bittasi to'g'ri. Birinchi maxraj ham nolga aylanadi.",
        'Одно верно. Первый знаменатель тоже обращается в нуль.',
        'One is right. The first denominator becomes zero too.',
      ),
      '0': L(
        "Nolda ikkala maxraj ham nolga aylanmaydi, minus bir va bir chiqadi.",
        'При нуле ни один знаменатель в нуль не обращается: выходит минус один и один.',
        'At zero neither denominator becomes zero: they give minus one and one.',
      ),
      '*': L(
        "Ikki maxrajga qarang, har biri o'z qiymatida nolga aylanadi.",
        'Посмотри на оба знаменателя: каждый обращается в нуль при своём значении.',
        'Look at both denominators: each becomes zero at its own value.',
      ),
    },
    note: L(
      "Ikki maxraj ikki shart berdi",
      'Два знаменателя дали два условия',
      'Two denominators gave two conditions',
    ),
  },
}

// ============================================================
// EKRAN 8. QOIDA. Darslik matni 4-§, 22-bet. Xukka QAYTISH.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    "Qo'shish va ayirish qoidasi",
    'Правило сложения и вычитания',
    'The rule for adding and subtracting',
  ),
  audio: [
    A('mount',
      "Qoidani o'zingiz yig'asiz, keyin darslik matni ochiladi.",
      'Правило соберёшь сам, потом откроется текст учебника.',
      'You will assemble the rule yourself, then the textbook text opens.'),
    W('card',
      "Birinchi ekrandagi yozuv javobini oldi. U yig'indiga teng emas.",
      'Запись с первого экрана получила ответ. Она сумме не равна.',
      'The record from the first screen got its answer. It does not equal the sum.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L('Maxrajlar bir xil bo\'lsa', 'Если знаменатели равны', 'If the denominators are equal') },
      { id: 'f2', label: L('suratlar qo\'shiladi', 'складывают числители', 'add the numerators') },
      { id: 'f3', label: L('boshqa bo\'lsa', 'если разные', 'if they differ') },
      { id: 'f4', label: L('umumiy maxrajga keltiriladi', 'приводят к общему знаменателю', 'bring to a common denominator') },
      { id: 'w1', label: L('maxrajlar ham qo\'shiladi', 'складывают и знаменатели', 'add the denominators too') },
      { id: 'w2', label: L('kattasi tanlanadi', 'выбирают больший', 'pick the bigger one') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilganda qoida buziladi. Maxrajlar bilan nima qilinishini tekshiring.",
      'В такой сборке правило ломается. Проверь, что делают со знаменателями.',
      'Assembled this way the rule breaks. Check what is done with the denominators.',
    ),
    card: {
      title: L("QO'SHISH VA AYIRISH", 'СЛОЖЕНИЕ И ВЫЧИТАНИЕ', 'ADDITION AND SUBTRACTION'),
      lines: [
        L('a/m + b/m = (a + b)/m,   a/m − b/m = (a − b)/m', 'a/m + b/m = (a + b)/m,   a/m − b/m = (a − b)/m', 'a/m + b/m = (a + b)/m,   a/m − b/m = (a − b)/m'),
        L(
          "Har xil maxrajli kasrlarni umumiy maxrajga keltirish kerak",
          'Дроби с разными знаменателями надо привести к общему знаменателю',
          'Fractions with different denominators must be brought to a common denominator',
        ),
        L(
          "Ayirishda minus butun suratga tegishli",
          'При вычитании минус относится ко всему числителю',
          'When subtracting, the minus applies to the whole numerator',
        ),
      ],
      source: L('Darslik, 4-§, 22-bet', 'Учебник, § 4, стр. 22', 'Textbook, section 4, page 22'),
      locked: L("Qoida yig'ilgandan keyin ochiladi", 'Откроется после сборки правила', 'Opens once the rule is assembled'),
    },
    recall: {
      left: L('2/(x + y)', '2/(x + y)', '2/(x + y)'),
      right: L('(x + y)/(xy)', '(x + y)/(xy)', '(x + y)/(xy)'),
      winner: 'right',
      note: L(
        "Yig'indi o'ngdagi yozuvga teng, chapdagisiga emas",
        'Сумма равна правой записи, а не левой',
        'The sum equals the record on the right, not the one on the left',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ, ZANJIR. To'rt topshiriq, to'rt xil format.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    "Qo'shing, ayiring, shartni yozing",
    'Сложи, вычти, запиши условие',
    'Add, subtract, write the condition',
  ),
  audio: [
    A('mount',
      "To'rt topshiriq. Ikkinchisida ayirish, unda qavs kerak.",
      'Четыре задания. Во втором вычитание, там нужна скобка.',
      'Four tasks. The second is a subtraction and it needs a bracket.'),
    W('t1',
      "Maxraj o'z joyida qoldi, suratlar qo'shildi.",
      'Знаменатель остался на месте, числители сложились.',
      'The denominator stayed in place and the numerators were added.'),
    W('t2',
      "Minus qavsdagi ikki hadga ham tegdi.",
      'Минус достался обоим слагаемым в скобке.',
      'The minus reached both terms in the bracket.'),
    W('t3',
      "Umumiy maxraj ikkalasining ko'paytmasi.",
      'Общий знаменатель это произведение обоих.',
      'The common denominator is the product of both.'),
    W('t4',
      "Ikki maxraj, ikki shart.",
      'Два знаменателя, два условия.',
      'Two denominators, two conditions.'),
  ],
  props: {
    items: [
      {
        prompt: L(
          'Bitta kasr qilib yozing',
          'Запиши одной дробью',
          'Write it as a single fraction',
        ),
        show: (
          <Row size="row" align="center">
            {F('5', 'a + 2')}
            {' + '}
            {F('3', 'a + 2')}
          </Row>
        ),
        kind: 'expr',
        answer: '8/(a+2)',
        accepts: ['(5+3)/(a+2)'],
        hints: {
          '8/(2a+4)': L(
            "Maxrajlar qo'shilib ketdi. Ular bir xil, shuning uchun o'zgarmaydi.",
            'Знаменатели сложились. Они одинаковые, поэтому не меняются.',
            'The denominators got added. They are equal, so they do not change.',
          ),
          '15/(a+2)': L(
            "Suratlar qo'shiladi, ko'paytirilmaydi.",
            'Числители складывают, а не умножают.',
            'The numerators are added, not multiplied.',
          ),
        },
        closed: L('= 8/(a + 2)', '= 8/(a + 2)', '= 8/(a + 2)'),
      },
      {
        prompt: L(
          'Ayirmani bitta kasr qilib yozing',
          'Запиши разность одной дробью',
          'Write the difference as a single fraction',
        ),
        show: (
          <Row size="row" align="center">
            {F('2a', 'a − 1')}
            {' − '}
            {F('a + 3', 'a − 1')}
          </Row>
        ),
        kind: 'expr',
        answer: '(a-3)/(a-1)',
        accepts: ['(2a-a-3)/(a-1)'],
        hints: {
          '(a+3)/(a-1)': L(
            "Minus uchlikka ham tegishli. Qavsni eslang.",
            'Минус относится и к тройке. Вспомни про скобку.',
            'The minus applies to the three as well. Remember the bracket.',
          ),
          '(3a+3)/(a-1)': L(
            "Bu qo'shish bo'ldi, yozuvda esa ayirish.",
            'Это сложение, а в записи вычитание.',
            'That is addition, but the record holds a subtraction.',
          ),
        },
        closed: L('= (a − 3)/(a − 1)', '= (a − 3)/(a − 1)', '= (a − 3)/(a − 1)'),
      },
      {
        prompt: L(
          'Umumiy maxrajni yozing',
          'Запиши общий знаменатель',
          'Write the common denominator',
        ),
        show: (
          <Row size="row" align="center">
            {F('1', 'x')}
            {' + '}
            {F('1', 'x + 4')}
          </Row>
        ),
        kind: 'expr',
        answer: 'x(x+4)',
        accepts: ['x*x+4x'],
        hints: {
          'x+4': L(
            "Bu faqat ikkinchi maxraj. Birinchi kasr unga keltirilmaydi.",
            'Это только второй знаменатель. Первую дробь к нему не привести.',
            'That is only the second denominator. The first fraction cannot go there.',
          ),
          '2x+4': L(
            "Bu maxrajlarning yig'indisi, ko'paytmasi emas.",
            'Это сумма знаменателей, а не произведение.',
            'That is the sum of the denominators, not the product.',
          ),
        },
        closed: L('umumiy maxraj x(x + 4)', 'общий знаменатель x(x + 4)', 'common denominator x(x + 4)'),
      },
      {
        prompt: L(
          "Yig'indining ruhsat etilgan qiymatlarini yozing",
          'Запиши допустимые значения суммы',
          'Write the admissible values of the sum',
        ),
        show: (
          <Row size="row" align="center">
            {F('2', 'x − 5')}
            {' + '}
            {F('7', 'x')}
          </Row>
        ),
        kind: 'odz',
        varName: 'x',
        excluded: [0, 5],
        accepts: ['x != 0, x != 5', 'x(x-5) != 0'],
        hints: {
          'x != 5': L(
            "Ikkinchi maxraj iks. U ham nolga aylanadi.",
            'Второй знаменатель это икс. Он тоже обращается в нуль.',
            'The second denominator is x. It becomes zero as well.',
          ),
          'x != 0': L(
            "Birinchi maxraj iks minus besh. U beshda nolga aylanadi.",
            'Первый знаменатель икс минус пять. Он обращается в нуль при пяти.',
            'The first denominator is x minus five. It becomes zero at five.',
          ),
        },
        closed: L('x ≠ 0, x ≠ 5', 'x ≠ 0, x ≠ 5', 'x ≠ 0, x ≠ 5'),
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ, QADAMLAR NOMLANGAN. Ayirish va boshqa maxrajlar
// birga — eng ko'p xato shu joyda tug'iladi.
// ============================================================
const S10 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    'Ayirish qadamlab',
    'Вычитание по шагам',
    'Subtraction step by step',
  ),
  audio: [
    A('mount',
      "Maxrajlar boshqa va amal ayirish. Uch qadam nomlangan.",
      'Знаменатели разные, а действие вычитание. Три шага названы.',
      'The denominators differ and the action is subtraction. Three steps are named.'),
    W('f1',
      "Umumiy maxraj ikkalasining ko'paytmasi.",
      'Общий знаменатель это произведение обоих.',
      'The common denominator is the product of both.'),
    W('f2',
      "Ikkinchi surat qavsga olinadi, minus unga butunlay tegishli.",
      'Второй числитель берут в скобку, минус относится к нему целиком.',
      'The second numerator goes into a bracket; the minus applies to all of it.'),
    W('f3',
      "Ikki maxraj ikki shart berdi.",
      'Два знаменателя дали два условия.',
      'Two denominators gave two conditions.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {F('4', 'x + 3')}
        {' − '}
        {F('1', 'x')}
      </Row>
    ),
    fields: [
      {
        ask: L(
          'Umumiy maxrajni yozing',
          'Запиши общий знаменатель',
          'Write the common denominator',
        ),
        kind: 'expr',
        answer: 'x(x+3)',
        accepts: ['x*x+3x'],
        hints: {
          'x+3': L(
            "Bu faqat birinchi maxraj.",
            'Это только первый знаменатель.',
            'That is only the first denominator.',
          ),
          '2x+3': L(
            "Bu yig'indi, ko'paytma esa boshqa.",
            'Это сумма, а произведение другое.',
            'That is the sum; the product is different.',
          ),
        },
      },
      {
        ask: L(
          'Umumiy suratni yozing',
          'Запиши общий числитель',
          'Write the common numerator',
        ),
        kind: 'expr',
        answer: '3x-3',
        accepts: ['4x-(x+3)', '3(x-1)'],
        hints: {
          '4x-x+3': L(
            "Minus qavsdagi uchlikka ham tegishli.",
            'Минус относится и к тройке в скобке.',
            'The minus applies to the three in the bracket as well.',
          ),
          '3x+3': L(
            "Uchlik oldida minus turadi, chunki u qavs ichida edi.",
            'Перед тройкой стоит минус, потому что она была в скобке.',
            'The three carries a minus because it was inside the bracket.',
          ),
          '5x+3': L(
            "Bu qo'shish bo'ldi, yozuvda esa ayirish.",
            'Это сложение, а в записи вычитание.',
            'That is addition, but the record holds a subtraction.',
          ),
        },
      },
      {
        ask: L(
          'Ruhsat etilgan qiymatlarni yozing',
          'Запиши допустимые значения',
          'Write the admissible values',
        ),
        kind: 'odz',
        varName: 'x',
        excluded: [-3, 0],
        accepts: ['x != 0, x != -3', 'x(x+3) != 0'],
        hints: {
          'x != 0': L(
            "Birinchi maxraj minus uchda nolga aylanadi.",
            'Первый знаменатель обращается в нуль при минус трёх.',
            'The first denominator becomes zero at minus three.',
          ),
          'x != -3': L(
            "Ikkinchi maxraj iks, u nolda nolga aylanadi.",
            'Второй знаменатель это икс, он обращается в нуль при нуле.',
            'The second denominator is x and it becomes zero at zero.',
          ),
        },
      },
    ],
  },
}

// ============================================================
// EKRAN 11. ASBOBSIZ. Yig'indi, ikki shart va O'QUVCHINING SONI (З16).
// ============================================================
const S11 = {
  eyebrow: L('MUSTAQIL', 'САМ', 'ON YOUR OWN'),
  title: L(
    "Yig'indi yordamsiz",
    'Сумма без подсказки',
    'A sum without help',
  ),
  audio: [
    A('mount',
      "Bu ekranda asbob yo'q. Umumiy maxraj, surat va ikki shart o'zingizdan.",
      'На этом экране прибора нет. Общий знаменатель, числитель и два условия сам.',
      'There is no instrument here. The common denominator, the numerator and two conditions are yours.'),
    A('why',
      "Javobni o'z soningiz bilan tekshirasiz.",
      'Ответ проверишь своим числом.',
      'You will check the answer with your own number.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {F('1', 'a − 2')}
        {' + '}
        {F('1', 'a + 2')}
      </Row>
    ),
    result: {
      ask: L(
        'Bitta kasr qilib yozing',
        'Запиши одной дробью',
        'Write it as a single fraction',
      ),
      kind: 'expr',
      answer: '2a/(a*a-4)',
      accepts: ['2a/((a-2)(a+2))', '(a+2+a-2)/((a-2)(a+2))'],
      hints: {
        '2/(a*a-4)': L(
          "Suratlar to'ldirilmagan. Har biri o'z ko'paytuvchisiga ko'paytiriladi.",
          'Числители не дополнены. Каждый умножается на свой множитель.',
          'The numerators were not completed. Each is multiplied by its own factor.',
        ),
        '1/(2a)': L(
          "Maxrajlar qo'shilib ketdi. Umumiy maxraj ko'paytma.",
          'Знаменатели сложились. Общий знаменатель это произведение.',
          'The denominators got added. The common denominator is a product.',
        ),
        '2a/(a-2)': L(
          "Ikkinchi maxraj yo'qoldi, umumiy maxraj ikkisining ko'paytmasi.",
          'Второй знаменатель потерялся: общий знаменатель это произведение обоих.',
          'The second denominator got lost: the common denominator is the product of both.',
        ),
      },
    },
    odz: {
      ask: L(
        'Ikki shartni yozing',
        'Запиши два условия',
        'Write the two conditions',
      ),
      varName: 'a',
      excluded: [-2, 2],
      accepts: ['a != 2, a != -2', 'a*a-4 != 0'],
      hints: {
        'a != 2': L(
          "Ikkinchi maxraj ham nolga aylanadi, minus ikkida.",
          'Второй знаменатель тоже обращается в нуль, при минус двух.',
          'The second denominator becomes zero too, at minus two.',
        ),
        'a != -2': L(
          "Birinchi maxraj ikkida nolga aylanadi.",
          'Первый знаменатель обращается в нуль при двух.',
          'The first denominator becomes zero at two.',
        ),
      },
    },
    proof: {
      varName: 'a',
      from: '1/(a-2)+1/(a+2)',
      to: '2a/(a*a-4)',
      ask: L(
        "Javobni o'z soningiz bilan tekshiring",
        'Проверь ответ своим числом',
        'Check the answer with your own number',
      ),
      done: L('son bilan tekshirildi', 'проверено числом', 'checked with a number'),
      diff: L(
        "Qiymatlar mos kelmadi. Yozuvni yana bir qarang.",
        'Значения не совпали. Посмотри запись ещё раз.',
        'The values did not match. Look at the record again.',
      ),
      hole: L(
        "Bu qiymatda yozuvning qiymati yo'q. Boshqa son oling.",
        'При этом значении записи нет. Возьми другое число.',
        'At this value the record has no value. Take another number.',
      ),
    },
    note: L(
      'Qiymatlar mos keldi, ikki shart ham joyida',
      'Значения совпали, и оба условия на месте',
      'The values matched and both conditions are in place',
    ),
  },
}

// ============================================================
// EKRAN 12. TUZOQ (З25). Qavs yo'qolgan, keyingi satrlar esa undan
// TO'G'RI chiqarilgan — shuning uchun birinchi noto'g'ri satrni topish
// kerak, oxirgisini emas.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Yo'qolgan qavs",
    'Потерянная скобка',
    'The lost bracket',
  ),
  audio: [
    A('mount',
      "Boshqa odamning yechimi. Birinchi noto'g'ri satrni toping.",
      'Чужое решение. Найди первую неверную строку.',
      "Someone else's solution. Find the first incorrect line."),
    W('proof',
      "Endi son bilan ko'rsating. Qaysi qiymatda yozuv hisoblanmaydi?",
      'Теперь покажи числом. При каком значении запись не считается?',
      'Now show it with a number. At which value does the record not compute?'),
  ],
  props: {
    rows: [
      {
        id: 'r1',
        show: L(
          "Maxrajlar bir xil, suratlarni ayiramiz",
          'Знаменатели одинаковые, вычитаем числители',
          'The denominators are equal, we subtract the numerators',
        ),
      },
      {
        id: 'r2',
        show: L(
          '5 − x + 4 = 9 − x',
          '5 − x + 4 = 9 − x',
          '5 − x + 4 = 9 − x',
        ),
      },
      {
        id: 'r3',
        show: L(
          'Javob (9 − x)/(x − 1)',
          'Ответ (9 − x)/(x − 1)',
          'The answer is (9 − x)/(x − 1)',
        ),
      },
      {
        id: 'r4',
        show: L(
          "Bittada yozuv hisoblanmaydi",
          'При единице запись не считается',
          'At one the record does not compute',
        ),
      },
    ],
    answerId: 'r2',
    hints: {
      'r1': L(
        "Bu satr to'g'ri, maxrajlar haqiqatan bir xil.",
        'Эта строка верна: знаменатели действительно одинаковые.',
        'This line is correct: the denominators really are equal.',
      ),
      'r3': L(
        "Javob yuqoridagi satrdan to'g'ri chiqarilgan. Xato balandroqda.",
        'Ответ верно выведен из строки выше. Ошибка выше.',
        'The answer follows correctly from the line above. The error is higher.',
      ),
      'r4': L(
        "Bu rost, iks minus bir bittada nolga aylanadi.",
        'Это правда: икс минус один обращается в нуль при единице.',
        'That is true: x minus one becomes zero at one.',
      ),
    },
    ask: {
      label: L("Son qo'ying", 'Поставь число', 'Put in a number'),
      of: '(1-x)/(x-1)',
      varName: 'x',
      wrong: L(
        "Bu qiymatda yozuv hisoblanadi. Maxraj qaysi sonda nolga aylanadi?",
        'При этом значении запись считается. При каком числе знаменатель обращается в нуль?',
        'At this value the record computes. At which number does the denominator become zero?',
      ),
      note: L(
        "To'g'ri surat 5 minus qavs ochilgan x plyus 4, ya'ni 1 minus x. Qavs tushib qolganda belgi buzildi.",
        'Верный числитель это 5 минус скобка x плюс 4, то есть 1 минус x. Потеряв скобку, автор испортил знак.',
        'The correct numerator is 5 minus the bracket x plus 4, that is 1 minus x. Losing the bracket broke the sign.',
      ),
    },
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH, TESKARI TOPSHIRIQ: bitta kasr berilgan, uni
// IKKI kasr yig'indisi qilib yozish kerak. Shartlar ham berilgan.
// ============================================================
const S13 = {
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Kasrni yig'indi qilib yozish",
    'Дробь как сумма двух',
    'A fraction as a sum of two',
  ),
  audio: [
    A('mount',
      "Endi teskarisi. Bitta kasr berilgan, uni ikki kasr yig'indisi qilib yozing.",
      'Теперь наоборот. Дана одна дробь, запиши её суммой двух.',
      'Now the other way round. One fraction is given, write it as a sum of two.'),
    A('why',
      "Maxraj ko'paytmaga ajratiladi, va har ko'paytuvchi bitta kasrning maxraji bo'ladi.",
      'Знаменатель разлагается на произведение, и каждый множитель становится знаменателем одной дроби.',
      'The denominator factors into a product, and each factor becomes one fraction denominator.'),
  ],
  props: {
    prompt: L(
      "2x/(x · x − 1) ni maxrajlari x − 1 va x + 1 bo'lgan ikki kasr yig'indisi qilib yozing",
      'Запиши 2x/(x · x − 1) суммой двух дробей со знаменателями x − 1 и x + 1',
      'Write 2x/(x · x − 1) as a sum of two fractions with denominators x − 1 and x + 1',
    ),
    reduceTo: '2x/(x*x-1)',
    excluded: [-1, 1],
    varName: 'x',
    hints: {
      '2x/(x-1)': L(
        "Ikkinchi maxraj yo'qoldi. Yig'indi ikki kasrdan bo'lishi kerak.",
        'Второй знаменатель потерялся. Сумма должна быть из двух дробей.',
        'The second denominator got lost. The sum must have two fractions.',
      ),
      '1/(x-1)+1/(x-1)': L(
        "Ikki had bir xil maxrajli. Ikkinchisining maxraji x plyus bir.",
        'Оба слагаемых с одним знаменателем. У второго знаменатель x плюс один.',
        'Both terms share one denominator. The second one needs x plus one.',
      ),
    },
    note: L(
      "Ikki ko'paytuvchi ikki kasr berdi",
      'Два множителя дали две дроби',
      'Two factors gave two fractions',
    ),
  },
}

// ============================================================
// EKRAN 14. BLITS. To'rt savol BELGI haqida.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Qo'shish belgilari",
    'Признаки сложения',
    'The marks of addition',
  ),
  audio: [
    A('mount',
      "To'rt savol. Ular yozuv haqida emas, belgi haqida.",
      'Четыре вопроса. Они не про запись, а про признак.',
      'Four questions. They are not about a record but about the mark.'),
    A('why',
      "Har javobdan keyin izoh chiqadi.",
      'После каждого ответа выходит разбор.',
      'After each answer an explanation appears.'),
  ],
  props: {
    lead: L(
      'Har savolga bitta javob',
      'На каждый вопрос один ответ',
      'One answer to each question',
    ),
    items: [
      {
        id: 'q1',
        tag: 'З24',
        ask: L(
          "a/m + b/m nimaga teng?",
          'Чему равно a/m + b/m?',
          'What does a/m + b/m equal?',
        ),
        options: [
          { id: 'ok', right: true, label: L('(a + b)/m', '(a + b)/m', '(a + b)/m') },
          { id: 'dd', label: L('(a + b)/(2m)', '(a + b)/(2m)', '(a + b)/(2m)') },
          { id: 'mm', label: L('(a + b)/(m · m)', '(a + b)/(m · m)', '(a + b)/(m · m)') },
          { id: 'ab', label: L('(a · b)/m', '(a · b)/m', '(a · b)/m') },
        ],
        hint: L(
          "Ikki yettidan va uch yettidan qancha beradi? Maxraj o'zgarmaydi.",
          'Сколько дадут две седьмых и три седьмых? Знаменатель не меняется.',
          'What do two sevenths and three sevenths give? The denominator does not change.',
        ),
        ok: L(
          "Maxraj o'z joyida qoladi, faqat suratlar qo'shiladi.",
          'Знаменатель остаётся на месте, складываются только числители.',
          'The denominator stays and only the numerators are added.',
        ),
      },
      {
        id: 'q2',
        tag: 'З15',
        ask: L(
          "1/a + 1/b bilan avval nima qilinadi?",
          'Что делают с 1/a + 1/b сначала?',
          'What is done with 1/a + 1/b first?',
        ),
        options: [
          { id: 'common', right: true, label: L('Umumiy maxrajga keltirish', 'Привести к общему знаменателю', 'Bring to a common denominator') },
          { id: 'add', label: L("Suratlarni qo'shish", 'Сложить числители', 'Add the numerators') },
          { id: 'dens', label: L("Maxrajlarni qo'shish", 'Сложить знаменатели', 'Add the denominators') },
          { id: 'cut', label: L('Qisqartirish', 'Сократить', 'Reduce') },
        ],
        hint: L(
          "Maxrajlar boshqa. Qo'shish qoidasi bir xil maxraj uchun yozilgan.",
          'Знаменатели разные. Правило сложения написано для одинакового знаменателя.',
          'The denominators differ. The addition rule is written for an equal denominator.',
        ),
        ok: L(
          "Umumiy maxraj ab, va har kasr o'z ko'paytuvchisiga to'ldiriladi.",
          'Общий знаменатель ab, и каждую дробь дополняют своим множителем.',
          'The common denominator is ab, and each fraction is completed by its own factor.',
        ),
      },
      {
        id: 'q3',
        tag: 'З25',
        ask: L(
          "7/m − (x + 2)/m ning surati qanday?",
          'Каким будет числитель у 7/m − (x + 2)/m?',
          'What is the numerator of 7/m − (x + 2)/m?',
        ),
        options: [
          { id: 'ok', right: true, label: L('5 − x', '5 − x', '5 − x') },
          { id: 'bad', label: L('9 − x', '9 − x', '9 − x') },
          { id: 'plus', label: L('x + 9', 'x + 9', 'x + 9') },
          { id: 'seven', label: L('7 − x', '7 − x', '7 − x') },
        ],
        hint: L(
          "Minus qavsdagi ikki hadga ham tegadi. Ikkilikning belgisi qanday bo'ladi?",
          'Минус достаётся обоим слагаемым в скобке. Какой знак будет у двойки?',
          'The minus reaches both terms in the bracket. What sign will the two have?',
        ),
        ok: L(
          "Yetti minus iks minus ikki, ya'ni besh minus iks.",
          'Семь минус икс минус два, то есть пять минус икс.',
          'Seven minus x minus two, that is five minus x.',
        ),
      },
      {
        id: 'q4',
        tag: 'З2',
        ask: L(
          "3/(x − 4) + 5/x yig'indisining sharti qanday?",
          'Какое условие у суммы 3/(x − 4) + 5/x?',
          'What is the condition of the sum 3/(x − 4) + 5/x?',
        ),
        options: [
          { id: 'both', right: true, label: L('x ≠ 4 va x ≠ 0', 'x ≠ 4 и x ≠ 0', 'x ≠ 4 and x ≠ 0') },
          { id: 'four', label: L('faqat x ≠ 4', 'только x ≠ 4', 'only x ≠ 4') },
          { id: 'zero', label: L('faqat x ≠ 0', 'только x ≠ 0', 'only x ≠ 0') },
          { id: 'none', label: L("shart yo'q", 'условия нет', 'no condition') },
        ],
        hint: L(
          "Yozuvda ikki maxraj bor. Har biriga alohida qarang.",
          'В записи два знаменателя. Посмотри на каждый отдельно.',
          'The record holds two denominators. Look at each one separately.',
        ),
        ok: L(
          "Ikki maxraj ikki shart beradi, va ikkalasi ham yoziladi.",
          'Два знаменателя дают два условия, и записывают оба.',
          'Two denominators give two conditions and both are written down.',
        ),
      },
    ],
    scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
    stepLabel: L('Savol', 'Вопрос', 'Question'),
  },
}

// ============================================================
// EKRAN 15. YAKUN.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Yig'indi va ikki shart",
    'Сумма и два условия',
    'A sum and two conditions',
  ),
  audio: [
    A('s0',
      "Xukdagi yozuv rad etildi. Ikki kasr yig'indisi umumiy maxraj orqali hisoblanadi.",
      'Запись с хука отвергнута. Сумма двух дробей считается через общий знаменатель.',
      'The record from the hook is refuted. A sum of two fractions goes through a common denominator.'),
    A('s1',
      "Uch usul qoldi. Bitta maxraj, umumiy maxraj va ikki shart.",
      'Остаются три способа. Один знаменатель, общий знаменатель и два условия.',
      'Three methods remain. One denominator, the common denominator, and two conditions.'),
    A('s2',
      "Keyingi darsda ko'paytirish va bo'lish. U yerda umumiy maxraj kerak bo'lmaydi, va bu yengillik.",
      'В следующем уроке умножение и деление. Там общий знаменатель не нужен, и это облегчение.',
      'The next lesson is multiplication and division. No common denominator is needed there, which is a relief.'),
  ],
  props: {
    predictedLabel: L('Taxmin', 'Прогноз', 'Prediction'),
    proved: L(
      "Qiymatlar boshqa, yig'indi (x + y)/(xy)",
      'Значения разные, сумма это (x + y)/(xy)',
      'The values differ; the sum is (x + y)/(xy)',
    ),
    canLabel: L('Endi nima qila olasiz', 'Что теперь умеешь', 'What you can do now'),
    can: [
      L(
        "Bir xil maxrajli kasrlarni qo'shish va ayirish",
        'Складывать и вычитать дроби с одним знаменателем',
        'Add and subtract fractions with one denominator',
      ),
      L(
        "Umumiy maxrajga keltirib qo'shish",
        'Приводить к общему знаменателю и складывать',
        'Bring to a common denominator and add',
      ),
      L(
        "Ayirishda qavs qo'yish va ikki shartni yozish",
        'Ставить скобку при вычитании и писать оба условия',
        'Put the bracket when subtracting and write both conditions',
      ),
    ],
    proofNote: L(
      "Fakt. Qadimgi Misr hisobida faqat surati bir bo'lgan kasrlar ishlatilgan, va har kasr shunday yig'indi qilib yozilgan. Shuning uchun bugungi teskari topshiriq minglab yil oldin oddiy ish edi.",
      'Факт. В древнеегипетском счёте использовали только дроби с числителем один, и любую дробь записывали такой суммой. Поэтому сегодняшняя обратная задача была обычной работой тысячи лет назад.',
      'A fact. Ancient Egyptian arithmetic used only fractions with numerator one and wrote every fraction as such a sum. So today reverse task was ordinary work thousands of years ago.',
    ),
    bridge: L(
      "Keyingi dars, ko'paytirish va bo'lish, umumiy maxrajsiz ishlaydi",
      'Следующий урок, умножение и деление, работает без общего знаменателя',
      'The next lesson, multiplication and division, works without a common denominator',
    ),
    cheat: L('Xulosani chop etish', 'Распечатать памятку', 'Print the summary'),
    screenRef: L('8-ekranga qaytib qarang', 'посмотри снова экран 8', 'look at screen 8 again'),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook', tool: 'pick', scene: <HookScene />, ...S1 },
  { role: 'support', tool: 'chain', kind: 'pairs', ...S2 },
  { role: 'explain', tool: 'film', kind: 'film', tag: 'З24', ...S3 },
  { role: 'explain', tool: 'transform', kind: 'method1', tag: 'З25', method: M_SAME, ...S4 },
  { role: 'explain', tool: 'transform', kind: 'method2', tag: 'З15', method: M_COMMON, ...S5 },
  { role: 'explain', tool: 'solve', kind: 'together', tag: 'З24', ...S6 },
  { role: 'explain', tool: 'boundary', kind: 'boundary', tag: 'З2', ...S7 },
  { role: 'rule', tool: 'rulebuild', tag: 'З15', ...S8 },
  { role: 'practice', tool: 'chain', kind: 'drill', tag: 'З25', method: M_SAME, ...S9 },
  { role: 'practice', tool: 'fields', kind: 'guided', tag: 'З25', method: M_COMMON, ...S10 },
  { role: 'practice', tool: 'solo', kind: 'solo', tag: 'З16', method: M_COMMON, ...S11 },
  { role: 'practice', tool: 'audit', kind: 'audit', tag: 'З25', method: M_TWO, ...S12 },
  { role: 'transfer', tool: 'inverse', kind: 'inverse', tag: 'З24', method: M_TWO, ...S13 },
  { role: 'blitz', tool: 'blitz', ...S14 },
  { role: 'summary', tool: 'summary', scene: FinalScene, ...S15 },
]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
