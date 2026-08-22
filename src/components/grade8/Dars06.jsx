// ============================================================================
// 8-sinf, Dars 6. RATSIONAL IFODALARNI ALMASHTIRISH.
//
// Bu fayl — FAQAT MA'LUMOT (ETALON_8SINF.md §2). Mexanika `tools.jsx` da,
// o'ram `screens.jsx` da, javob tekshiruvi `mathcore.js` da.
//
// BLOK 1 NING OXIRGI KASR DARSI: to'rt amal birga ishlaydi.
//
// DARSNING ENG QIMMAT JOYI — YASHIRIN SHARTLAR. Javob qisqa bo'lishi
// mumkin, hatto sonning o'zi; lekin shartlar ORALIQ maxrajlardan yig'iladi
// va javobda KO'RINMAYDI. Xuk shu haqda: javob bir, shartlar esa ikkita.
//
// DARSLIK. O'zbek darsligi, 6-§, 30-bet: kasr-ratsional ifodalarni ayniy
// almashtirish. Amallar tartibi oddiy sonlardagidek: avval qavs, keyin
// ko'paytirish va bo'lish.
//
// ADASHISHLAR: З1, З2, З15, З16 — HAMMASI §11 ro'yxatidan, yangi teg yo'q.
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
  id: 'alg-8-06',
  n: 6,
  row: 6,
  block: 'Б1',
  topic: L(
    'Ratsional ifodalarni almashtirish',
    'Преобразование рациональных выражений',
    'Transforming rational expressions',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Amallar tartibi sonlardagidek, avval qavs, keyin ko'paytirish va bo'lish",
    'Порядок действий как у чисел: сначала скобки, потом умножение и деление',
    'The order of operations is as with numbers: brackets first, then multiplying and dividing',
  ),
  L(
    "Ko'p qavatli kasr — bu bo'lish, u teskari kasrga ko'paytirish bilan almashtiriladi",
    'Многоэтажная дробь это деление: его заменяют умножением на обратную',
    'A multi-storey fraction is a division: it is replaced by multiplication by the reciprocal',
  ),
  L(
    "Shartlar HAMMA maxrajdan yig'iladi, oraliq maxrajlardan ham, va javobda ko'rinmaydi",
    'Условия собирают со ВСЕХ знаменателей, включая промежуточные, и в ответе их не видно',
    'Conditions are collected from ALL denominators, including intermediate ones, and the answer hides them',
  ),
]

export const MISS = {
  'З1': {
    what: L(
      "had bo'yicha qisqartirildi, ko'paytuvchi bo'yicha emas",
      'сокращение по слагаемому, а не по множителю',
      'reduced by a term instead of by a factor',
    ),
    wrong: '(1+1/a)',
    at: 1,
  },
  'З2': {
    what: L(
      "oraliq maxrajning sharti yo'qoldi",
      'потеряно условие промежуточного знаменателя',
      'the condition of an intermediate denominator was lost',
    ),
    wrong: '(1+1/a)/((a+1)/a)',
    at: -1,
  },
  'З15': {
    what: L(
      'amallar tartibi buzildi, qavsdan oldin bo\'lindi',
      'нарушен порядок действий: делили до скобок',
      'the order of operations was broken: dividing before the brackets',
    ),
    wrong: '(a-9/a)/(1+3/a)',
    at: 0,
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
}

// ============================================================
// USULLAR (§4).
// ============================================================
const M_ORDER = {
  name: L(
    '1-USUL. Avval qavs',
    'СПОСОБ 1. Сначала скобки',
    'METHOD 1. Brackets first',
  ),
  steps: [
    L('Har qavsni bitta kasr qiling', 'Каждую скобку в одну дробь', 'Turn each bracket into one fraction'),
    L('Keyin bo\'lish yoki ko\'paytirish', 'Потом деление или умножение', 'Then divide or multiply'),
    L('Oxirida qisqartiring', 'В конце сократи', 'Reduce at the end'),
  ],
}

const M_FLOOR = {
  name: L(
    "2-USUL. Ko'p qavatli kasr",
    'СПОСОБ 2. Многоэтажная дробь',
    'METHOD 2. Multi-storey fraction',
  ),
  steps: [
    L('Katta chiziq bu bo\'lish', 'Большая черта это деление', 'The long bar means division'),
    L('Pastdagi kasrni teskari qiling', 'Переверни нижнюю дробь', 'Flip the lower fraction'),
    L('Ko\'paytmani qisqartiring', 'Сократи произведение', 'Reduce the product'),
  ],
}

const M_ALL = {
  name: L(
    '3-USUL. Hamma maxraj',
    'СПОСОБ 3. Все знаменатели',
    'METHOD 3. Every denominator',
  ),
  steps: [
    L('Yozuvdagi hamma maxrajni sanang', 'Пересчитай все знаменатели записи', 'Count every denominator in the record'),
    L('Oraliqlarini ham hisobga oling', 'Промежуточные тоже считаются', 'Intermediate ones count too'),
    L('Javob shartni ko\'rsatmaydi', 'Ответ условий не показывает', 'The answer shows no conditions'),
  ],
}

// ============================================================
// SAHNALAR (§6).
// ============================================================
const SC_ODZ = L('RUHSAT ETILGAN QIYMATLAR', 'ДОПУСТИМЫЕ ЗНАЧЕНИЯ', 'ADMISSIBLE VALUES')

// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Uzun yozuv va qisqa javob",
      'Длинная запись и короткий ответ',
      'A long record and a short answer',
    )}>
      {/* CHAP: qavs va bo'lish. */}
      <text x="40" y="84" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19" fill={T.ink}>(1 +</text>
      <text x="76" y="70" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17" fill={T.ink}>1</text>
      <line x1="64" y1="78" x2="88" y2="78" stroke={T.ink} strokeWidth="2"/>
      <text x="76" y="98" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17" fill={T.ink}>a</text>
      <text x="98" y="84" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19" fill={T.ink}>)</text>
      <circle cx="114" cy="79" r="2" fill={T.ink3}/>
      <circle cx="114" cy="89" r="2" fill={T.ink3}/>
      <text x="146" y="70" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17" fill={T.ink}>a + 1</text>
      <line x1="124" y1="78" x2="170" y2="78" stroke={T.ink} strokeWidth="2"/>
      <text x="146" y="98" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17" fill={T.ink}>a</text>

      {/* O'NG: qisqa javob KELADI. */}
      <g className="g8-fly" style={{ '--d': '2900ms' }}>
        <text x="310" y="92" textAnchor="middle" fontFamily={MATH_FONT} fontSize="30"
          fill={T.accent}>1</text>
      </g>

      <g className="g8-seat" style={{ '--d': '3400ms' }}>
        <circle cx="224" cy="82" r="17" fill={T.graphSoft} stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="224" y="89" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="132" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_ODZ)}</text>
      <line x1="132" y1="142" x2="268" y2="142" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5" pathLength="1" className="g8-draw"/>
    </SceneBand>
  )
}

// YAKUN: javob bir, shartlar esa IKKITA, va ular o'qda ko'rinadi.
const FinalScene = (
  <SceneBand kind="final" label={L(
    "Javob bir, shartlar ikkita",
    'Ответ один, а условий два',
    'One answer and two conditions',
  )}>
    <text x="34" y="44" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14" fill={T.ink}>(1 +</text>
    <text x="62" y="34" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13" fill={T.ink}>1</text>
    <line x1="52" y1="40" x2="72" y2="40" stroke={T.ink} strokeWidth="1.6"/>
    <text x="62" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13" fill={T.ink}>a</text>
    <text x="80" y="44" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14" fill={T.ink}>)</text>
    <circle cx="92" cy="40" r="1.6" fill={T.ink3}/>
    <circle cx="92" cy="48" r="1.6" fill={T.ink3}/>
    <text x="118" y="34" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13" fill={T.ink}>a + 1</text>
    <line x1="102" y1="40" x2="134" y2="40" stroke={T.ink} strokeWidth="1.6"/>
    <text x="118" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13" fill={T.ink}>a</text>

    <text x="152" y="45" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16" fill={T.ok}>=</text>
    <text x="176" y="46" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18" fill={T.ok}>1</text>

    <line x1="120" y1="78" x2="280" y2="78" stroke="rgba(23,26,29,.28)" strokeWidth="1.4"/>
    <text x="160" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink3}>{'−1'}</text>
    <text x="200" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink3}>0</text>
    <text x="240" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink3}>1</text>
    <g className="g8-seat" style={{ '--d': '600ms' }}>
      <circle cx="160" cy="78" r="5" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
    </g>
    <g className="g8-seat" style={{ '--d': '900ms' }}>
      <circle cx="200" cy="78" r="5" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
    </g>
    <g className="g8-seat" style={{ '--d': '1200ms' }}>
      <rect x="296" y="68" width="88" height="19" rx="9.5" fill={T.tipSoft}/>
      <text x="340" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
        fontWeight="700" fill={T.tip}>{'a ≠ 0,  a ≠ −1'}</text>
    </g>
  </SceneBand>
)

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('IKKI YOZUV', 'ДВЕ ЗАПИСИ', 'TWO RECORDS'),
  title: L(
    'Uzun yozuv va bir',
    'Длинная запись и единица',
    'A long record and a one',
  ),
  lead: L(
    "Javobini dars davomida o'zingiz topasiz",
    'Ответ найдёшь сам по ходу урока',
    'You will find the answer yourself during the lesson',
  ),
  audio: [
    A('mount',
      "Chapda qavs va bo'lish, o'ngda esa bitta son.",
      'Слева скобка и деление, справа всего одно число.',
      'On the left a bracket and a division, on the right a single number.'),
    A('why',
      "Taxmin qiling, uzun yozuv har qanday a da birga tengmi.",
      'Предположи, равна ли длинная запись единице при любом a.',
      'Predict whether the long record equals one for every a.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Uzun yozuv har qanday a da birga tengmi?",
      'Равна ли длинная запись единице при любом a?',
      'Does the long record equal one for every a?',
    ),
    items: [
      {
        id: 'always',
        show: L('Ha, har qanday a da', 'Да, при любом a', 'Yes, for every a'),
      },
      {
        id: 'not',
        show: L("Yo'q, ba'zi qiymatlarda yo'q", 'Нет, при некоторых значениях нет', 'No, at some values it fails'),
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
// EKRAN 2. TAYANCH. Uch oldingi darsning uchta ishi: qavsni bitta kasr
// qilish, bo'lish va shartni ko'rish.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    'Uch amal bir joyda',
    'Три действия в одном месте',
    'Three operations in one place',
  ),
  audio: [
    A('mount',
      "Uch oldingi darsning ishi kerak bo'ladi.",
      'Понадобится работа трёх прошлых уроков.',
      'The work of three previous lessons will be needed.'),
    W('t1',
      "Butun son ham kasr qilib yoziladi, maxraji a bo'ladi.",
      'Целое тоже записывают дробью, знаменателем становится a.',
      'A whole number is written as a fraction too, with a as the denominator.'),
    W('t2',
      "Bo'lishda bo'luvchi teskari qilinadi.",
      'При делении делитель переворачивают.',
      'When dividing, the divisor is flipped.'),
    W('t3',
      "Maxrajda harf bor, demak shart bor.",
      'В знаменателе есть буква, значит есть условие.',
      'There is a letter in the denominator, so there is a condition.'),
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
            {'1 + '}
            {F('1', 'a')}
          </Row>
        ),
        kind: 'expr',
        answer: '(a+1)/a',
        accepts: ['(1+a)/a'],
        hints: {
          '(a-1)/a': L(
            "Yozuvda plyus turibdi. Belgiga qarang.",
            'В записи стоит плюс. Посмотри на знак.',
            'The record holds a plus. Look at the sign.',
          ),
          'a+1': L(
            "Maxraj ham kerak. Bittani a maxraji bilan yozing.",
            'Знаменатель тоже нужен. Запиши единицу со знаменателем a.',
            'The denominator is needed too. Write the one with denominator a.',
          ),
        },
        closed: L('1 + 1/a = (a + 1)/a', '1 + 1/a = (a + 1)/a', '1 + 1/a = (a + 1)/a'),
      },
      {
        prompt: L(
          "Bo'linmani yozing",
          'Запиши частное',
          'Write the quotient',
        ),
        show: (
          <Row size="row" align="center">
            {F('2', 'x')}
            {'  :  '}
            {F('3', 'x')}
          </Row>
        ),
        kind: 'expr',
        answer: '2/3',
        accepts: ['4/6'],
        hints: {
          '3/2': L(
            "Teskari qilinadigan narsa bo'luvchi, ya'ni ikkinchi kasr.",
            'Переворачивают делитель, то есть вторую дробь.',
            'It is the divisor, the second fraction, that gets flipped.',
          ),
          '6/(x*x)': L(
            "Bu ko'paytirish bo'ldi. Bo'lishda bo'luvchi teskari bo'ladi.",
            'Это умножение. При делении делитель переворачивают.',
            'That is multiplication. In division the divisor is flipped.',
          ),
        },
        closed: L('2/x : 3/x = 2/3', '2/x : 3/x = 2/3', '2/x : 3/x = 2/3'),
      },
      {
        prompt: L(
          'Shartni yozing',
          'Запиши условие',
          'Write the condition',
        ),
        show: (
          <Row size="row" align="center">
            {F('a + 1', 'a')}
          </Row>
        ),
        kind: 'odz',
        varName: 'a',
        excluded: [0],
        accepts: ['a != 0', '0 != a'],
        hints: {
          'a != -1': L(
            "Minus bir suratni nolga aylantiradi, maxrajni emas.",
            'Минус один обращает в нуль числитель, а не знаменатель.',
            'Minus one makes the numerator zero, not the denominator.',
          ),
          'a != 1': L(
            "Bittada maxraj birga teng, kasr hisoblanadi.",
            'При единице знаменатель равен единице, дробь считается.',
            'At one the denominator equals one and the fraction computes.',
          ),
        },
        closed: L('a ≠ 0', 'a ≠ 0', 'a ≠ 0'),
      },
    ],
  },
}

// ============================================================
// EKRAN 3. YADRO. Butun sonni kasrga aylantirish — bu qadamsiz qavs
// bitta kasr bo'lmaydi.
// ============================================================
const S3 = {
  eyebrow: L('TARTIB', 'ПОРЯДОК', 'THE ORDER'),
  title: L(
    'Qavs bitta kasrga',
    'Скобка в одну дробь',
    'A bracket into one fraction',
  ),
  audio: [
    A('mount',
      "Qavs ichida butun son va kasr bor. Ularni bitta kasr qilamiz.",
      'В скобке целое и дробь. Сделаем из них одну дробь.',
      'The bracket holds a whole number and a fraction. We turn them into one.'),
    W('k2',
      "Bittani a bo'lingan a shaklida yozdik, va maxrajlar bir xil bo'ldi.",
      'Единицу записали как a делённое на a, и знаменатели стали одинаковыми.',
      'The one was written as a over a, and the denominators became equal.'),
    W('k3',
      "Endi suratlar qo'shiladi. Qavs bitta kasr bo'ldi, va u bilan bo'lish mumkin.",
      'Теперь числители складываются. Скобка стала одной дробью, и с ней можно делить.',
      'Now the numerators add up. The bracket became one fraction and division can proceed.'),
  ],
  props: {
    film: {
      fig: 'mult',
      data: {
        left: (
          <Row size="row" align="center">
            {'1 + '}
            {F('1', 'a')}
          </Row>
        ),
        mid: (
          <Row size="row" align="center">
            {F('a', 'a')}
            {' + '}
            {F('1', 'a')}
          </Row>
        ),
        right: F('a + 1', 'a'),
        same: L(
          'qavs bitta kasr bo\'ldi',
          'скобка стала одной дробью',
          'the bracket became one fraction',
        ),
        rule: (
          <Row size="row" align="center">
            {'1 = '}
            {F('a', 'a')}
            {',  a ≠ 0'}
          </Row>
        ),
      },
      frames: [
        {
          id: 'k1',
          phase: 0,
          label: L('Qavs', 'Скобка', 'The bracket'),
          text: L(
            "Butun son va kasr yonma yon, ular hali qo'shilmagan",
            'Целое и дробь рядом, они пока не сложены',
            'A whole number and a fraction side by side, not yet added',
          ),
        },
        {
          id: 'k2',
          phase: 1,
          label: L('Bitta maxraj', 'Один знаменатель', 'One denominator'),
          text: L(
            "Butun son a maxraji bilan yozildi",
            'Целое записано со знаменателем a',
            'The whole number is written with denominator a',
          ),
          ask: {
            question: L(
              'Bittani qanday yozdik?',
              'Как записали единицу?',
              'How was the one written?',
            ),
            items: [
              { id: 'aa', right: true, label: L('a/a', 'a/a', 'a/a') },
              {
                id: 'a1',
                label: L('a/1', 'a/1', 'a/1'),
                hint: L(
                  "a bo'lingan bir bu a ning o'zi, bir emas.",
                  'a делённое на один это сама a, а не единица.',
                  'a divided by one is a itself, not one.',
                ),
              },
              {
                id: 'oneA',
                label: L('1/a', '1/a', '1/a'),
                hint: L(
                  "Bu ikkinchi had, u allaqachon yozuvda bor.",
                  'Это второе слагаемое, оно уже есть в записи.',
                  'That is the second term, it is already in the record.',
                ),
              },
              {
                id: 'zero',
                label: L('0/a', '0/a', '0/a'),
                hint: L(
                  "Nol bo'lingan a nolga teng, bir emas.",
                  'Нуль делённый на a равен нулю, а не единице.',
                  'Zero over a equals zero, not one.',
                ),
              },
            ],
          },
        },
        {
          id: 'k3',
          phase: 2,
          label: L('Shart', 'Условие', 'The condition'),
          text: L(
            "Bunday yozish uchun a nolga teng bo'lmasligi kerak",
            'Чтобы так записать, a не должно быть нулём',
            'To write it this way, a must not be zero',
          ),
          ask: {
            question: L(
              "Bu qadam qanday shart qo'shdi?",
              'Какое условие добавил этот шаг?',
              'Which condition did this step add?',
            ),
            items: [
              { id: 'zero', right: true, label: L('a ≠ 0', 'a ≠ 0', 'a ≠ 0') },
              {
                id: 'one',
                label: L('a ≠ 1', 'a ≠ 1', 'a ≠ 1'),
                hint: L(
                  "Bittada maxraj birga teng, hammasi hisoblanadi.",
                  'При единице знаменатель равен единице, всё считается.',
                  'At one the denominator equals one and everything computes.',
                ),
              },
              {
                id: 'minus',
                label: L('a ≠ −1', 'a ≠ −1', 'a ≠ −1'),
                hint: L(
                  "Minus bir keyingi qadamda paydo bo'ladi, bu qadamda emas.",
                  'Минус один появится на следующем шаге, а не на этом.',
                  'Minus one appears on the next step, not on this one.',
                ),
              },
              {
                id: 'none',
                label: L("Shart yo'q", 'Условия нет', 'No condition'),
                hint: L(
                  "Maxrajda harf paydo bo'ldi, demak shart ham paydo bo'ldi.",
                  'В знаменателе появилась буква, значит появилось и условие.',
                  'A letter appeared in the denominator, so a condition appeared too.',
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
// EKRAN 4. 1-USUL: AVVAL QAVS, keyin bo'lish. Xukning yozuvi.
// ============================================================
const S4 = {
  eyebrow: L('1-USUL', 'СПОСОБ 1', 'METHOD 1'),
  title: L(
    'Avval qavs, keyin bo\'lish',
    'Сначала скобка, потом деление',
    'Bracket first, division after',
  ),
  audio: [
    A('mount',
      "Birinchi ekrandagi yozuvni o'zingiz almashtirasiz.",
      'Запись с первого экрана преобразуешь сам.',
      'You will transform the record from the first screen yourself.'),
    W('s2',
      "Qavs bitta kasr bo'ldi, va endi ikki kasrning bo'linmasi turibdi.",
      'Скобка стала одной дробью, и теперь стоит частное двух дробей.',
      'The bracket became one fraction and now a quotient of two fractions stands there.'),
    W('s3',
      "Ikki bir xil kasrning bo'linmasi birga teng.",
      'Частное двух одинаковых дробей равно единице.',
      'A quotient of two identical fractions equals one.'),
    W('s4',
      "Ikkita shart. Bittasi a maxrajidan, ikkinchisi bo'luvchining suratidan.",
      'Два условия. Одно от знаменателя a, второе от числителя делителя.',
      'Two conditions. One from the denominator a, the other from the numerator of the divisor.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {'(1 + '}
        {F('1', 'a')}
        {')  :  '}
        {F('a + 1', 'a')}
      </Row>
    ),
    actions: [
      { id: 'brackets', label: L('Qavsni bitta kasr qilish', 'Скобку в одну дробь', 'Bracket into one fraction') },
      { id: 'divfirst', label: L("Darrov bo'lish", 'Сразу делить', 'Divide right away') },
      { id: 'cancel', label: L('Bittani qisqartirish', 'Сократить единицы', 'Reduce the ones') },
    ],
    steps: [
      {
        action: 'brackets',
        wrongs: [
          {
            action: 'divfirst',
            hint: L(
              "Qavs ichida ikki had bor, u hali bitta kasr emas. Tartib buziladi.",
              'В скобке два слагаемых, она ещё не одна дробь. Порядок нарушится.',
              'The bracket holds two terms, it is not one fraction yet. The order would break.',
            ),
          },
          {
            action: 'cancel',
            hint: L(
              "Bittalar had, ular ko'paytuvchi emas. Qisqartirish faqat ko'paytuvchi bo'yicha.",
              'Единицы это слагаемые, а не множители. Сокращают только по множителю.',
              'The ones are terms, not factors. Reducing goes only by a factor.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'order',
              right: true,
              label: L('Amallar tartibi', 'Порядок действий', 'The order of operations'),
            },
            {
              id: 'main',
              label: L('Kasrning asosiy xossasi', 'Основное свойство дроби', 'The basic property of a fraction'),
              hint: L(
                "Xossa qavs ichida ishlaydi, lekin nima uchun avval qavs ekanini tartib aytadi.",
                'Свойство работает внутри скобки, но почему сначала скобка говорит порядок действий.',
                'The property works inside the bracket, but the order of operations says why the bracket comes first.',
              ),
            },
            {
              id: 'div',
              label: L("Bo'lish qoidasi", 'Правило деления', 'The division rule'),
              hint: L(
                "Bo'lish keyin bo'ladi, hozir qavs yig'ilmoqda.",
                'Деление будет потом, сейчас собирают скобку.',
                'Division comes later, right now the bracket is being collected.',
              ),
            },
          ],
        },
        ask: L(
          'Qavsdan chiqqan kasrning suratini yozing',
          'Запиши числитель дроби из скобки',
          'Write the numerator of the fraction from the bracket',
        ),
        answer: 'a+1',
        accepts: ['1+a'],
        hints: {
          'a-1': L(
            "Qavsda plyus turibdi.",
            'В скобке стоит плюс.',
            'The bracket holds a plus.',
          ),
          'a': L(
            "Ikkinchi had ham qo'shiladi, u bittaga teng.",
            'Второе слагаемое тоже добавляется, оно равно единице.',
            'The second term is added too, and it equals one.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('a + 1', 'a')}
            {'  :  '}
            {F('a + 1', 'a')}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'flip', label: L("Bo'luvchini teskari qilib ko'paytirish", 'Перевернуть делитель и умножить', 'Flip the divisor and multiply') },
          { id: 'sub', label: L('Suratlarni ayirish', 'Вычесть числители', 'Subtract the numerators') },
          { id: 'add', label: L("Kasrlarni qo'shish", 'Сложить дроби', 'Add the fractions') },
        ],
        action: 'flip',
        wrongs: [
          {
            action: 'sub',
            hint: L(
              "Belgi bo'lish. Ayirish oldingi darsda edi.",
              'Знак деления. Вычитание было на прошлом уроке.',
              'The sign is division. Subtraction was in the previous lesson.',
            ),
          },
          {
            action: 'add',
            hint: L(
              "Qo'shish emas, bo'lish. Ikki kasr orasida ikki nuqta turibdi.",
              'Не сложение, а деление. Между дробями стоит двоеточие.',
              'Not addition but division. A colon stands between the fractions.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'div',
              right: true,
              label: L("Bo'lish qoidasi", 'Правило деления дробей', 'The rule for dividing fractions'),
            },
            {
              id: 'order',
              label: L('Amallar tartibi', 'Порядок действий', 'The order of operations'),
              hint: L(
                "Tartib qavsni birinchi qildi. Hozir amalning O'ZI bajarilmoqda.",
                'Порядок поставил скобку первой. Сейчас выполняется само действие.',
                'The order put the bracket first. Now the action itself is performed.',
              ),
            },
            {
              id: 'sum',
              label: L("Qo'shish qoidasi", 'Правило сложения', 'The addition rule'),
              hint: L(
                "Qo'shish qavs ichida bo'ldi va tugadi.",
                'Сложение было внутри скобки и закончилось.',
                'The addition happened inside the bracket and is over.',
              ),
            },
          ],
        },
        ask: L('Nima chiqdi?', 'Что вышло?', 'What came out?'),
        answer: '1',
        accepts: ['1'],
        hints: {
          'a': L(
            "Ikki kasr bir xil, ularning bo'linmasi son bo'ladi.",
            'Две дроби одинаковые, их частное это число.',
            'The two fractions are identical, their quotient is a number.',
          ),
          '(a+1)/a': L(
            "Bo'lish bajarilmagan. Bir xil kasrni o'ziga bo'lsak nima chiqadi?",
            'Деление не выполнено. Что выйдет, если разделить дробь на саму себя?',
            'The division is not done. What comes out if a fraction is divided by itself?',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('a + 1', 'a')}
            {' · '}
            {F('a', 'a + 1')}
            {' = 1'}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'all', label: L('Hamma maxrajdan', 'Со всех знаменателей', 'From every denominator') },
          { id: 'ans', label: L('Javobdan', 'Из ответа', 'From the answer') },
          { id: 'one', label: L('Bittasidan', 'С одного', 'From one of them') },
        ],
        action: 'all',
        wrongs: [
          {
            action: 'ans',
            hint: L(
              "Javob bir, unda harf yo'q. Shartlar oraliq yozuvlarda qoldi.",
              'Ответ единица, в нём буквы нет. Условия остались в промежуточных записях.',
              'The answer is one with no letter. The conditions stayed in the intermediate records.',
            ),
          },
          {
            action: 'one',
            hint: L(
              "Yozuvda a maxraji ham, a plyus bir surati ham bor. Ikkalasi ham shart beradi.",
              'В записи есть и знаменатель a, и числитель a плюс один. Оба дают условие.',
              'The record holds the denominator a and the numerator a plus one. Both give a condition.',
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
              id: 'both',
              right: true,
              label: L(
                "Maxraj va bo'luvchi",
                'Знаменатель и делитель',
                'The denominator and the divisor',
              ),
            },
            {
              id: 'long',
              label: L('Yozuv uzun', 'Запись длинная', 'The record is long'),
              hint: L(
                "Uzunlik ahamiyatsiz. Nolga aylanadigan joylar ahamiyatli.",
                'Длина ни при чём. Важны места, где выходит нуль.',
                'Length is irrelevant. What matters is where zero appears.',
              ),
            },
            {
              id: 'two',
              label: L('Ikki kasr bor', 'Дробей две', 'There are two fractions'),
              hint: L(
                "Kasrlar soni emas, MAXRAJ va BO'LUVCHI muhim.",
                'Важно не число дробей, а знаменатель и делитель.',
                'What matters is not the number of fractions but the denominator and the divisor.',
              ),
            },
          ],
        },
        kind: 'odz',
        varName: 'a',
        excluded: [-1, 0],
        accepts: ['a != 0, a != -1', 'a(a+1) != 0'],
        ask: L(
          'Hamma shartni yozing',
          'Запиши все условия',
          'Write all the conditions',
        ),
        hints: {
          'a != 0': L(
            "Bo'luvchining surati a plyus bir. U qaysi qiymatda nolga aylanadi?",
            'Числитель делителя это a плюс один. При каком значении он нуль?',
            'The numerator of the divisor is a plus one. At which value is it zero?',
          ),
          'a != -1': L(
            "Maxrajda a turibdi, u nolda nolga aylanadi.",
            'В знаменателе стоит a, он обращается в нуль при нуле.',
            'The denominator holds a and it becomes zero at zero.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'a ≠ 0,  a ≠ −1'}
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 5. 2-USUL: ikki qavs va bo'lish. Bu yerda javob SON emas,
// ifoda bo'lib chiqadi.
// ============================================================
const S5 = {
  eyebrow: L('2-USUL', 'СПОСОБ 2', 'METHOD 2'),
  title: L(
    'Ikki qavs va bo\'lish',
    'Две скобки и деление',
    'Two brackets and a division',
  ),
  audio: [
    A('mount',
      "Ikki qavs bor, va ikkalasini ham bitta kasr qilish kerak.",
      'Скобок две, и каждую надо превратить в одну дробь.',
      'There are two brackets and each must become one fraction.'),
    W('s2',
      "Birinchi qavsda kvadratlar ayirmasi chiqdi.",
      'В первой скобке получилась разность квадратов.',
      'The first bracket gave a difference of squares.'),
    W('s3',
      "Bo'lishdan keyin bir xil ko'paytuvchilar qisqardi va ifoda qoldi.",
      'После деления одинаковые множители сократились и осталось выражение.',
      'After the division the identical factors reduced away and an expression was left.'),
    W('s4',
      "Ikkita shart. Ikkalasi ham oraliq maxrajlardan.",
      'Два условия, и оба от промежуточных знаменателей.',
      'Two conditions and both come from intermediate denominators.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {'(a − '}
        {F('9', 'a')}
        {')  :  (1 + '}
        {F('3', 'a')}
        {')'}
      </Row>
    ),
    actions: [
      { id: 'brackets', label: L('Ikki qavsni kasr qilish', 'Обе скобки в дроби', 'Both brackets into fractions') },
      { id: 'nine', label: L("To'qqizni qisqartirish", 'Сократить девятку', 'Reduce the nine') },
      { id: 'divfirst', label: L("Darrov bo'lish", 'Сразу делить', 'Divide right away') },
    ],
    steps: [
      {
        action: 'brackets',
        wrongs: [
          {
            action: 'nine',
            hint: L(
              "To'qqiz va uch had, ular ko'paytuvchi emas.",
              'Девятка и тройка это слагаемые, а не множители.',
              'The nine and the three are terms, not factors.',
            ),
          },
          {
            action: 'divfirst',
            hint: L(
              "Qavs ichida ikki had turibdi. Avval qavs, keyin bo'lish.",
              'В скобке два слагаемых. Сначала скобка, потом деление.',
              'The bracket holds two terms. Bracket first, division after.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'order',
              right: true,
              label: L('Amallar tartibi', 'Порядок действий', 'The order of operations'),
            },
            {
              id: 'div',
              label: L("Bo'lish qoidasi", 'Правило деления', 'The division rule'),
              hint: L(
                "Bo'lish keyingi qadamda. Hozir qavslar yig'ilmoqda.",
                'Деление на следующем шаге. Сейчас собирают скобки.',
                'Division comes on the next step. Now the brackets are collected.',
              ),
            },
            {
              id: 'cut',
              label: L('Qisqartirish qoidasi', 'Правило сокращения', 'The reducing rule'),
              hint: L(
                "Qisqartirish oxirida bo'ladi, ko'paytuvchilar paydo bo'lgandan keyin.",
                'Сокращение будет в конце, когда появятся множители.',
                'Reducing comes at the end, once factors appear.',
              ),
            },
          ],
        },
        ask: L(
          'Birinchi qavsning suratini yozing',
          'Запиши числитель первой скобки',
          'Write the numerator of the first bracket',
        ),
        answer: 'a*a-9',
        accepts: ['(a-3)(a+3)'],
        hints: {
          'a*a+9': L(
            "Qavsda minus turibdi.",
            'В скобке стоит минус.',
            'The bracket holds a minus.',
          ),
          'a-9': L(
            "Birinchi hadni ham a maxraji bilan yozish kerak, u a karra a bo'ladi.",
            'Первое слагаемое тоже надо записать со знаменателем a, оно станет a на a.',
            'The first term must also be written over a; it becomes a times a.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('a · a − 9', 'a')}
            {'  :  '}
            {F('a + 3', 'a')}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'flip', label: L("Teskari qilib ko'paytirish", 'Перевернуть и умножить', 'Flip and multiply') },
          { id: 'add', label: L("Kasrlarni qo'shish", 'Сложить дроби', 'Add the fractions') },
          { id: 'open', label: L('Qavslarni ochish', 'Раскрыть скобки', 'Open the brackets') },
        ],
        action: 'flip',
        wrongs: [
          {
            action: 'add',
            hint: L(
              "Kasrlar orasida bo'lish belgisi turibdi.",
              'Между дробями стоит знак деления.',
              'A division sign stands between the fractions.',
            ),
          },
          {
            action: 'open',
            hint: L(
              "Qavslar allaqachon kasrga aylandi. Endi bo'lish bajariladi.",
              'Скобки уже стали дробями. Теперь выполняется деление.',
              'The brackets already became fractions. Now the division is performed.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'div',
              right: true,
              label: L("Bo'lish qoidasi", 'Правило деления дробей', 'The rule for dividing fractions'),
            },
            {
              id: 'order',
              label: L('Amallar tartibi', 'Порядок действий', 'The order of operations'),
              hint: L(
                "Tartib qavslarni birinchi qildi, hozir amal bajarilmoqda.",
                'Порядок поставил скобки первыми, сейчас выполняется действие.',
                'The order put the brackets first; now the action is performed.',
              ),
            },
            {
              id: 'squares',
              label: L('Kvadratlar ayirmasi', 'Разность квадратов', 'Difference of squares'),
              hint: L(
                "Formula suratda ishladi. Bo'lishning asosi boshqa.",
                'Формула сработала в числителе. Основание деления другое.',
                'The formula worked in the numerator. The grounds for division are different.',
              ),
            },
          ],
        },
        ask: L('Nima qoldi?', 'Что осталось?', 'What is left?'),
        answer: 'a-3',
        accepts: ['-3+a'],
        hints: {
          'a+3': L(
            "Qisqargan ko'paytuvchi a plyus uch, qolgani ikkinchisi.",
            'Сократился множитель a плюс три, остался второй.',
            'The factor a plus three reduced away; the other one stayed.',
          ),
          '(a*a-9)/a': L(
            "Bo'lish bajarilmagan. Ikkinchi kasrni teskari qilib ko'paytiring.",
            'Деление не выполнено. Переверни вторую дробь и умножь.',
            'The division is not done. Flip the second fraction and multiply.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('(a − 3)(a + 3)', 'a')}
            {' · '}
            {F('a', 'a + 3')}
            {' = a − 3'}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'all', label: L('Hamma maxrajdan', 'Со всех знаменателей', 'From every denominator') },
          { id: 'ans', label: L('Javobdan', 'Из ответа', 'From the answer') },
          { id: 'none', label: L("Shart kerak emas", 'Условие не нужно', 'No condition needed') },
        ],
        action: 'all',
        wrongs: [
          {
            action: 'ans',
            hint: L(
              "Javob a minus uch, u har qanday qiymatda hisoblanadi. Shartlar oraliqda qoldi.",
              'Ответ a минус три считается при любом значении. Условия остались в промежуточных записях.',
              'The answer a minus three computes at every value. The conditions stayed in the intermediate records.',
            ),
          },
          {
            action: 'none',
            hint: L(
              "Ikki qavsda ham a maxrajda edi, va bo'luvchining surati a plyus uch.",
              'В обеих скобках a стояла в знаменателе, а числитель делителя это a плюс три.',
              'In both brackets a was in a denominator, and the numerator of the divisor is a plus three.',
            ),
          },
        ],
        why: {
          question: L(
            'Shartlar qaydan keldi?',
            'Откуда пришли условия?',
            'Where did the conditions come from?',
          ),
          items: [
            {
              id: 'mid',
              right: true,
              label: L('Oraliq maxrajlardan', 'От промежуточных знаменателей', 'From the intermediate denominators'),
            },
            {
              id: 'first',
              label: L('Faqat birinchi qavsdan', 'Только от первой скобки', 'Only from the first bracket'),
              hint: L(
                "Ikkinchi qavsda ham a maxrajda turgan edi.",
                'Во второй скобке a тоже стояла в знаменателе.',
                'In the second bracket a was in the denominator as well.',
              ),
            },
            {
              id: 'ans',
              label: L('Javobdan', 'От ответа', 'From the answer'),
              hint: L(
                "Javobda maxraj yo'q, u shart bermaydi.",
                'В ответе знаменателя нет, он условий не даёт.',
                'The answer has no denominator and gives no conditions.',
              ),
            },
          ],
        },
        kind: 'odz',
        varName: 'a',
        excluded: [-3, 0],
        accepts: ['a != 0, a != -3', 'a(a+3) != 0'],
        ask: L(
          'Hamma shartni yozing',
          'Запиши все условия',
          'Write all the conditions',
        ),
        hints: {
          'a != 0': L(
            "Bo'luvchining surati a plyus uch. U minus uchda nolga aylanadi.",
            'Числитель делителя это a плюс три. Он обращается в нуль при минус трёх.',
            'The numerator of the divisor is a plus three. It becomes zero at minus three.',
          ),
          'a != -3': L(
            "Ikki qavsda ham maxraj a edi.",
            'В обеих скобках знаменателем была a.',
            'In both brackets the denominator was a.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'a ≠ 0,  a ≠ −3'}
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 6. BIRGA YECHAMIZ. MUVAFFAQIYATSIZ QADAM: «javob bir, demak
// shart kerak emas» (З2), va u SON bilan rad etiladi.
// ============================================================
const S6 = {
  eyebrow: L('BIRGA YECHAMIZ', 'РЕШАЕМ ВМЕСТЕ', 'SOLVING TOGETHER'),
  title: L(
    'Javob bir, shart qani',
    'Ответ один, а условие где',
    'The answer is one, so where is the condition',
  ),
  audio: [
    A('mount',
      "Birinchi ekrandagi yozuvni oxirigacha tekshiramiz.",
      'Проверим до конца запись с первого экрана.',
      'We will check the record from the first screen to the end.'),
    W('s3',
      "Ikkida ikkala yozuv ham birga teng. Bu hech narsani isbotlamaydi.",
      'При двух обе записи равны единице. Это ничего не доказывает.',
      'At two both records equal one. That proves nothing.'),
    W('s5',
      "Minus birda chapda qiymat yo'q, o'ngda esa bir. Yozuvlar ajraldi.",
      'При минус одном слева значения нет, а справа единица. Записи разошлись.',
      'At minus one the left has no value and the right gives one. The records parted.'),
    W('s6',
      "Demak tenglik ikki shart bilan turadi.",
      'Значит равенство держится с двумя условиями.',
      'So the equality holds with two conditions.'),
  ],
  props: {
    task: L(
      "(1 + 1/a) : ((a + 1)/a) har doim birga tengmi?",
      'Всегда ли (1 + 1/a) : ((a + 1)/a) равно единице?',
      'Does (1 + 1/a) : ((a + 1)/a) always equal one?',
    ),
    lines: [
      {
        text: '(1 + 1/a) : ((a + 1)/a)      1',
        note: L('berilgan', 'дано', 'given'),
      },
      {
        text: L(
          "Qavs bitta kasr bo'ladi va bo'linma birga teng",
          'Скобка становится одной дробью, и частное равно единице',
          'The bracket becomes one fraction and the quotient equals one',
        ),
      },
      {
        text: 'a = 2:   1 = 1',
        ask: {
          question: L(
            'Ikkida nima chiqadi?',
            'Что выйдет при двух?',
            'What comes out at two?',
          ),
          items: [
            { id: 'one', right: true, label: L('1 va 1', '1 и 1', '1 and 1') },
            {
              id: 'three',
              label: L('1,5 va 1', '1,5 и 1', '1.5 and 1'),
              hint: L(
                "Qavs bir butun besh beradi, lekin bo'luvchi ham bir butun besh.",
                'Скобка даёт одна целая пять, но и делитель равен одна целая пять.',
                'The bracket gives one and a half, but the divisor is one and a half too.',
              ),
            },
            {
              id: 'two',
              label: L('2 va 1', '2 и 1', '2 and 1'),
              hint: L(
                "Bo'lish bajarilishi kerak, qavsni bo'luvchiga bo'lamiz.",
                'Деление надо выполнить: скобку делим на делитель.',
                'The division must be performed: the bracket is divided by the divisor.',
              ),
            },
          ],
          after: L(
            'Mos keldi',
            'Совпало',
            'It matched',
          ),
        },
      },
      {
        text: L(
          "Demak har qanday a da teng",
          'Значит равны при любом a',
          'So they are equal for every a',
        ),
        tone: 'no',
        note: L(
          'bunday xulosa qilinmaydi',
          'такой вывод делать нельзя',
          'this conclusion is not allowed',
        ),
      },
      {
        text: 'a = −1:   qiymat yo\'q      1',
        ask: {
          question: L(
            'Minus birda chapda nima bo\'ladi?',
            'Что будет слева при минус одном?',
            'What happens on the left at minus one?',
          ),
          items: [
            { id: 'no', right: true, label: L("Qiymat yo'q", 'Значения нет', 'There is no value') },
            {
              id: 'zero',
              label: L('Nol', 'Нуль', 'Zero'),
              hint: L(
                "Bo'luvchi nolga aylanadi, nolga bo'lish esa mumkin emas.",
                'Делитель обращается в нуль, а на нуль делить нельзя.',
                'The divisor becomes zero, and division by zero is impossible.',
              ),
            },
            {
              id: 'one',
              label: L('Bir', 'Единица', 'One'),
              hint: L(
                "Bo'luvchining surati a plyus bir, minus birda u nol bo'ladi.",
                'Числитель делителя это a плюс один, при минус одном он нуль.',
                'The numerator of the divisor is a plus one; at minus one it is zero.',
              ),
            },
          ],
          after: L(
            'Yozuvlar ajraldi',
            'Записи разошлись',
            'The records parted',
          ),
        },
        tone: 'no',
      },
      {
        text: L(
          "Tenglik a nol va minus bir bo'lmaganda turadi",
          'Равенство держится при a, не равном нулю и минус одному',
          'The equality holds when a is neither zero nor minus one',
        ),
        tone: 'ok',
      },
    ],
  },
}

// ============================================================
// EKRAN 7. CHEGARA. Ikki yashirin shart.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L(
    'Yashirin shartlar',
    'Скрытые условия',
    'Hidden conditions',
  ),
  audio: [
    A('mount',
      "Chapda uzun yozuv, o'ngda bir. Chap yozuv qayerda hisoblanmaydi?",
      'Слева длинная запись, справа единица. Где левая запись не считается?',
      'On the left a long record, on the right a one. Where does the left record fail?'),
    A('why',
      "Maxrajga ham, bo'luvchining suratiga ham qarang.",
      'Смотри и на знаменатель, и на числитель делителя.',
      'Look at the denominator and at the numerator of the divisor.'),
  ],
  props: {
    left: (
      <Row size="row" align="center">
        {'(1 + '}
        {F('1', 'a')}
        {')  :  '}
        {F('a + 1', 'a')}
      </Row>
    ),
    right: (
      <Row size="row" align="center">
        {'1'}
      </Row>
    ),
    odzLeft: L('?', '?', '?'),
    odzRight: L('har qanday a', 'любое a', 'any a'),
    question: L(
      "Chap yozuv hisoblanmaydigan hamma qiymatni yozing",
      'Запиши все значения, при которых левая запись не считается',
      'Write every value at which the left record does not compute',
    ),
    answer: [-1, 0],
    hints: {
      '0': L(
        "Bittasi to'g'ri. Bo'luvchining surati ham nolga aylanadi.",
        'Одно верно. Числитель делителя тоже обращается в нуль.',
        'One is right. The numerator of the divisor also becomes zero.',
      ),
      '-1': L(
        "Bittasi to'g'ri. Maxrajda a turibdi, u ham nolga aylanadi.",
        'Одно верно. В знаменателе стоит a, он тоже обращается в нуль.',
        'One is right. The denominator holds a and it becomes zero too.',
      ),
      '1': L(
        "Bittada hammasi hisoblanadi, qavs ikkiga teng bo'ladi.",
        'При единице всё считается, скобка равна двум.',
        'At one everything computes, the bracket equals two.',
      ),
      '*': L(
        "Ikki joyga qarang, maxrajga va bo'luvchining suratiga.",
        'Смотри в два места: знаменатель и числитель делителя.',
        'Look in two places: the denominator and the numerator of the divisor.',
      ),
    },
    note: L(
      "Javobda bu shartlar ko'rinmaydi",
      'В ответе этих условий не видно',
      'The answer does not show these conditions',
    ),
  },
}

// ============================================================
// EKRAN 8. QOIDA. Darslik 6-§, 30-bet.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    'Almashtirish tartibi',
    'Порядок преобразования',
    'The order of transforming',
  ),
  audio: [
    A('mount',
      "Qoidani o'zingiz yig'asiz, keyin darslik matni ochiladi.",
      'Правило соберёшь сам, потом откроется текст учебника.',
      'You will assemble the rule yourself, then the textbook text opens.'),
    W('card',
      "Birinchi ekrandagi javob to'g'ri, lekin ikki shart bilan.",
      'Ответ с первого экрана верен, но с двумя условиями.',
      'The answer from the first screen is right, but with two conditions.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L('Avval har qavsni', 'Сначала каждую скобку', 'First each bracket') },
      { id: 'f2', label: L('bitta kasr qilish', 'в одну дробь', 'into one fraction') },
      { id: 'f3', label: L("keyin ko'paytirish yoki bo'lish", 'потом умножение или деление', 'then multiply or divide') },
      { id: 'f4', label: L("shart hamma maxrajdan", 'условие со всех знаменателей', 'the condition from every denominator') },
      { id: 'w1', label: L("shart javobdan", 'условие из ответа', 'the condition from the answer') },
      { id: 'w2', label: L("avval bo'lish", 'сначала деление', 'division first') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilganda tartib buziladi. Nimadan boshlanishini tekshiring.",
      'В такой сборке порядок ломается. Проверь, с чего начинают.',
      'Assembled this way the order breaks. Check what comes first.',
    ),
    card: {
      title: L('IFODANI ALMASHTIRISH', 'ПРЕОБРАЗОВАНИЕ ВЫРАЖЕНИЯ', 'TRANSFORMING AN EXPRESSION'),
      lines: [
        L(
          "Amallar tartibi oddiy sonlardagidek",
          'Порядок действий такой же, как у обычных чисел',
          'The order of operations is the same as with ordinary numbers',
        ),
        L(
          "Ko'p qavatli kasr bu bo'lish",
          'Многоэтажная дробь это деление',
          'A multi-storey fraction is a division',
        ),
        L(
          "Shart hamma maxrajdan yig'iladi, javobda ko'rinmaydi",
          'Условие собирают со всех знаменателей, в ответе его не видно',
          'The condition is collected from every denominator and the answer hides it',
        ),
      ],
      source: L('Darslik, 6-§, 30-bet', 'Учебник, § 6, стр. 30', 'Textbook, section 6, page 30'),
      locked: L("Qoida yig'ilgandan keyin ochiladi", 'Откроется после сборки правила', 'Opens once the rule is assembled'),
    },
    recall: {
      left: L('(1 + 1/a) : ((a + 1)/a)', '(1 + 1/a) : ((a + 1)/a)', '(1 + 1/a) : ((a + 1)/a)'),
      right: L('1,  a ≠ 0,  a ≠ −1', '1,  a ≠ 0,  a ≠ −1', '1,  a ≠ 0,  a ≠ −1'),
      winner: 'right',
      note: L(
        "Javob bir, lekin ikki shart bilan",
        'Ответ единица, но с двумя условиями',
        'The answer is one, but with two conditions',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ, ZANJIR.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    'Qavs, bo\'lish, shart',
    'Скобка, деление, условие',
    'Bracket, division, condition',
  ),
  audio: [
    A('mount',
      "To'rt topshiriq. Oxirgisida qisqartirish umuman mumkin emas.",
      'Четыре задания. В последнем сокращать вообще нельзя.',
      'Four tasks. In the last one reducing is not possible at all.'),
    W('t1',
      "Butun son maxraj bilan yozildi va suratlar qo'shildi.",
      'Целое записали со знаменателем и сложили числители.',
      'The whole number was written over the denominator and the numerators added.'),
    W('t2',
      "Bir xil qavs qisqardi.",
      'Одинаковая скобка сократилась.',
      'The identical bracket reduced away.'),
    W('t3',
      "Ikki maxraj ikki shart berdi.",
      'Два знаменателя дали два условия.',
      'Two denominators gave two conditions.'),
    W('t4',
      "Suratda yig'indi, ko'paytuvchi esa yo'q.",
      'В числителе сумма, а множителя нет.',
      'The numerator is a sum with no factor.'),
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
            {'1 + '}
            {F('2', 'x')}
          </Row>
        ),
        kind: 'expr',
        answer: '(x+2)/x',
        accepts: ['1+2/x'],
        hints: {
          '(x-2)/x': L(
            "Yozuvda plyus turibdi.",
            'В записи стоит плюс.',
            'The record holds a plus.',
          ),
          'x+2': L(
            "Maxraj ham kerak, u iks.",
            'Знаменатель тоже нужен, это икс.',
            'The denominator is needed too, and it is x.',
          ),
        },
        closed: L('1 + 2/x = (x + 2)/x', '1 + 2/x = (x + 2)/x', '1 + 2/x = (x + 2)/x'),
      },
      {
        prompt: L(
          "Ko'paytmani yozing",
          'Запиши произведение',
          'Write the product',
        ),
        show: (
          <Row size="row" align="center">
            {F('x', 'x + 1')}
            {' · '}
            {F('x + 1', '2')}
          </Row>
        ),
        kind: 'expr',
        answer: 'x/2',
        accepts: ['(2x)/4'],
        hints: {
          '(x*(x+1))/(2*(x+1))': L(
            "Qisqartirish qolib ketdi. Qavs ikkala qismda ham bor.",
            'Сокращение не доведено: скобка есть в обеих частях.',
            'The reducing is unfinished: the bracket is in both parts.',
          ),
          '2/x': L(
            "Iks suratda edi, u yuqorida qoladi.",
            'Икс был в числителе, он остаётся сверху.',
            'The x was in the numerator and it stays above.',
          ),
          'x/(2(x+1))': L(
            "Qavs ikkala qismda ham bor, u qisqaradi.",
            'Скобка есть в обеих частях, она сокращается.',
            'The bracket is in both parts and it reduces away.',
          ),
        },
        closed: L('= x/2', '= x/2', '= x/2'),
      },
      {
        prompt: L(
          'Hamma shartni yozing',
          'Запиши все условия',
          'Write all the conditions',
        ),
        show: (
          <Row size="row" align="center">
            {'(1 + '}
            {F('1', 'x')}
            {')  :  '}
            {F('x + 1', 'x')}
          </Row>
        ),
        kind: 'odz',
        varName: 'x',
        excluded: [-1, 0],
        accepts: ['x != 0, x != -1', 'x(x+1) != 0'],
        hints: {
          'x != 0': L(
            "Bo'luvchining surati x plyus bir, u ham nolga aylanadi.",
            'Числитель делителя это x плюс один, он тоже обращается в нуль.',
            'The numerator of the divisor is x plus one and it becomes zero too.',
          ),
          'x != -1': L(
            "Maxrajda iks turibdi, u nolda nolga aylanadi.",
            'В знаменателе стоит икс, он обращается в нуль при нуле.',
            'The denominator holds x and it becomes zero at zero.',
          ),
        },
        closed: L('x ≠ 0, x ≠ −1', 'x ≠ 0, x ≠ −1', 'x ≠ 0, x ≠ −1'),
      },
      {
        prompt: L(
          "Bu kasrni qisqartirib ko'ring",
          'Попробуй сократить эту дробь',
          'Try to reduce this fraction',
        ),
        show: F('x + 2', 'x'),
        kind: 'expr',
        none: true,
        noneLabel: L("Qisqartirish mumkin emas", 'Сокращать нечего', 'Nothing to reduce'),
        closed: L('(x + 2)/x qisqarmaydi', '(x + 2)/x не сокращается', '(x + 2)/x does not reduce'),
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ, QADAMLAR NOMLANGAN.
// ============================================================
const S10 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    'Uzun yozuv qadamlab',
    'Длинная запись по шагам',
    'A long record step by step',
  ),
  audio: [
    A('mount',
      "Qavsda ikki kasr, ular boshqa maxrajli. Uch qadam nomlangan.",
      'В скобке две дроби с разными знаменателями. Три шага названы.',
      'The bracket holds two fractions with different denominators. Three steps are named.'),
    W('f1',
      "Umumiy maxraj ikki iks bo'ldi va suratlar yig'ildi.",
      'Общим знаменателем стало два икс, и числители собрались.',
      'The common denominator became two x and the numerators came together.'),
    W('f2',
      "Bo'lishdan keyin qavs qisqardi.",
      'После деления скобка сократилась.',
      'After the division the bracket reduced away.'),
    W('f3',
      "Shartlar oraliq maxrajlardan yig'iladi.",
      'Условия собирают с промежуточных знаменателей.',
      'The conditions are collected from the intermediate denominators.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {'('}
        {F('1', 'x')}
        {' + '}
        {F('1', '2')}
        {')  :  '}
        {F('x + 2', '4')}
      </Row>
    ),
    fields: [
      {
        ask: L(
          'Qavsdan chiqqan kasrning suratini yozing',
          'Запиши числитель дроби из скобки',
          'Write the numerator of the fraction from the bracket',
        ),
        kind: 'expr',
        answer: 'x+2',
        accepts: ['2+x'],
        hints: {
          'x-2': L(
            "Qavsda plyus turibdi.",
            'В скобке стоит плюс.',
            'The bracket holds a plus.',
          ),
          '2x': L(
            "Bu maxraj bo'ldi. Surat esa ikki plyus iks.",
            'Это знаменатель. А числитель это два плюс икс.',
            'That is the denominator. The numerator is two plus x.',
          ),
        },
      },
      {
        ask: L(
          "Bo'linmani yozing",
          'Запиши частное',
          'Write the quotient',
        ),
        kind: 'expr',
        answer: '2/x',
        accepts: ['4/(2x)'],
        hints: {
          'x/2': L(
            "Teskari qilingan kasr to'rt bo'lingan x plyus ikki. Iks maxrajda qoladi.",
            'Перевёрнутая дробь это четыре на x плюс два. Икс остаётся в знаменателе.',
            'The flipped fraction is four over x plus two. The x stays in the denominator.',
          ),
          '2/(x+2)': L(
            "Qavs qisqaradi, chunki u ikkala qismda ham bor.",
            'Скобка сокращается, ведь она есть в обеих частях.',
            'The bracket reduces away because it is in both parts.',
          ),
        },
      },
      {
        ask: L(
          'Hamma shartni yozing',
          'Запиши все условия',
          'Write all the conditions',
        ),
        kind: 'odz',
        varName: 'x',
        excluded: [-2, 0],
        accepts: ['x != 0, x != -2', 'x(x+2) != 0'],
        hints: {
          'x != 0': L(
            "Bo'luvchining surati x plyus ikki, u minus ikkida nolga aylanadi.",
            'Числитель делителя это x плюс два, он обращается в нуль при минус двух.',
            'The numerator of the divisor is x plus two and it becomes zero at minus two.',
          ),
          'x != -2': L(
            "Qavsda maxraj iks edi, u nolda nolga aylanadi.",
            'В скобке знаменателем был икс, он обращается в нуль при нуле.',
            'In the bracket the denominator was x and it becomes zero at zero.',
          ),
        },
      },
    ],
  },
}

// ============================================================
// EKRAN 11. ASBOBSIZ. Javob IFODA bo'lib chiqadi, shartlar esa ikkita
// va ular javobda ko'rinmaydi (З2, З16).
// ============================================================
const S11 = {
  eyebrow: L('MUSTAQIL', 'САМ', 'ON YOUR OWN'),
  title: L(
    'Uzun yozuv yordamsiz',
    'Длинная запись без подсказки',
    'A long record without help',
  ),
  audio: [
    A('mount',
      "Bu ekranda asbob yo'q. Qavs, bo'lish va shartlar o'zingizdan.",
      'На этом экране прибора нет. Скобка, деление и условия сам.',
      'There is no instrument here. The bracket, the division and the conditions are yours.'),
    A('why',
      "Javob qisqa chiqadi, lekin shartlar ikkita.",
      'Ответ выйдет коротким, но условий два.',
      'The answer comes out short, but there are two conditions.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {'('}
        {F('2', 'x − 1')}
        {' + '}
        {F('2', 'x + 1')}
        {')  :  '}
        {F('4', 'x · x − 1')}
      </Row>
    ),
    result: {
      ask: L(
        'Natijani yozing',
        'Запиши результат',
        'Write the result',
      ),
      kind: 'expr',
      answer: 'x',
      accepts: ['x*1'],
      hints: {
        '4x/(x*x-1)': L(
          "Bu qavsning natijasi. Endi uni bo'luvchiga bo'lish kerak.",
          'Это результат скобки. Теперь его надо разделить на делитель.',
          'That is the result of the bracket. Now it must be divided by the divisor.',
        ),
        '1/x': L(
          "Bo'luvchi teskari qilinadi, va iks yuqorida qoladi.",
          'Делитель переворачивают, и икс остаётся сверху.',
          'The divisor is flipped and the x stays above.',
        ),
        'x/4': L(
          "To'rtlik qisqaradi, chunki qavsda ham to'rt iks chiqdi.",
          'Четвёрка сокращается, ведь в скобке вышло четыре икс.',
          'The four reduces away because the bracket gave four x.',
        ),
      },
    },
    odz: {
      ask: L(
        'Shartlarni yozing',
        'Запиши условия',
        'Write the conditions',
      ),
      varName: 'x',
      excluded: [-1, 1],
      accepts: ['x != 1, x != -1', 'x*x-1 != 0'],
      hints: {
        'x != 1': L(
          "Ikkinchi maxraj x plyus bir, u ham nolga aylanadi.",
          'Второй знаменатель x плюс один, он тоже обращается в нуль.',
          'The second denominator is x plus one and it becomes zero too.',
        ),
        'x != -1': L(
          "Birinchi maxraj x minus bir, u bittada nolga aylanadi.",
          'Первый знаменатель x минус один, он обращается в нуль при единице.',
          'The first denominator is x minus one and it becomes zero at one.',
        ),
        'x != 0': L(
          "Nolda hamma maxraj hisoblanadi, taqiq boshqa joyda.",
          'При нуле все знаменатели считаются, запрет в другом месте.',
          'At zero every denominator computes; the restriction is elsewhere.',
        ),
      },
    },
    proof: {
      varName: 'x',
      from: '(2/(x-1)+2/(x+1))/(4/(x*x-1))',
      to: 'x',
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
      "Javob iks, shartlar esa yozuvda qoldi",
      'Ответ икс, а условия остались в записи',
      'The answer is x, and the conditions stayed in the record',
    ),
  },
}

// ============================================================
// EKRAN 12. TUZOQ (З2). «Javob iks, demak shart kerak emas».
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    'Javob qisqa, shart qani',
    'Ответ короткий, а условие',
    'The answer is short, and the condition',
  ),
  audio: [
    A('mount',
      "Boshqa odamning yechimi. Birinchi noto'g'ri satrni toping.",
      'Чужое решение. Найди первую неверную строку.',
      "Someone else's solution. Find the first incorrect line."),
    W('proof',
      "Endi son bilan ko'rsating. Qaysi qiymatda birinchi kasr hisoblanmaydi?",
      'Теперь покажи числом. При каком значении не считается первая дробь?',
      'Now show it with a number. At which value does the first fraction fail?'),
  ],
  props: {
    rows: [
      {
        id: 'r1',
        show: L(
          "Qavsni bitta kasr qildik, 4x/(x · x − 1) chiqdi",
          'Скобку свели в одну дробь, вышло 4x/(x · x − 1)',
          'The bracket became one fraction, giving 4x/(x · x − 1)',
        ),
      },
      {
        id: 'r2',
        show: L(
          "Bo'luvchini teskari qilib ko'paytirdik",
          'Перевернули делитель и умножили',
          'We flipped the divisor and multiplied',
        ),
      },
      {
        id: 'r3',
        show: L(
          "Javob iks, unda maxraj yo'q, demak shart ham yo'q",
          'Ответ икс, знаменателя в нём нет, значит и условий нет',
          'The answer is x with no denominator, so there are no conditions',
        ),
      },
      {
        id: 'r4',
        show: L(
          "Tekshirish, x uchga teng bo'lsa uch chiqadi",
          'Проверка: при x, равном трём, выходит три',
          'Check: at x equal to three it gives three',
        ),
      },
    ],
    answerId: 'r3',
    hints: {
      'r1': L(
        "Bu satr to'g'ri, umumiy maxraj kvadratlar ayirmasi.",
        'Эта строка верна: общий знаменатель это разность квадратов.',
        'This line is correct: the common denominator is the difference of squares.',
      ),
      'r2': L(
        "Bu ham to'g'ri, bo'lish shunday bajariladi.",
        'И это верно, деление так и выполняется.',
        'This is correct too, that is how division is done.',
      ),
      'r4': L(
        "Uchda tekshirish rost. Lekin bitta son shartni ko'rsatmaydi.",
        'При трёх проверка честная. Но одно число условия не покажет.',
        'The check at three is honest. But one number does not reveal the condition.',
      ),
    },
    ask: {
      label: L("Son qo'ying", 'Поставь число', 'Put in a number'),
      of: '2/(x-1)',
      varName: 'x',
      wrong: L(
        "Bu qiymatda birinchi kasr hisoblanadi. Uning maxraji qaysi sonda nolga aylanadi?",
        'При этом значении первая дробь считается. При каком числе её знаменатель обращается в нуль?',
        'At this value the first fraction computes. At which number does its denominator become zero?',
      ),
      note: L(
        "Bittada birinchi kasr yo'qoladi, va bu shart javobda ko'rinmaydi.",
        'При единице первая дробь исчезает, и это условие в ответе не видно.',
        'At one the first fraction disappears, and the answer does not show that condition.',
      ),
    },
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH, TESKARI TOPSHIRIQ.
// ============================================================
const S13 = {
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    'Shart bo\'yicha yozuv',
    'Запись по условию',
    'A record from the condition',
  ),
  audio: [
    A('mount',
      "Endi teskarisi. Javob va shartlar berilgan, yozuvni o'zingiz tuzasiz.",
      'Теперь наоборот. Ответ и условия даны, запись составишь сам.',
      'Now the other way round. The answer and the conditions are given, you build the record.'),
    A('why',
      "Ko'paytuvchi surat va maxrajda bir vaqtda turishi kerak.",
      'Множитель должен стоять и в числителе, и в знаменателе одновременно.',
      'The factor must stand in the numerator and in the denominator at once.'),
  ],
  props: {
    prompt: L(
      "Iksga teng kasr yozing, uning shartlari x ≠ 1 va x ≠ −1 bo'lsin",
      'Запиши дробь, равную x, с условиями x ≠ 1 и x ≠ −1',
      'Write a fraction equal to x whose conditions are x ≠ 1 and x ≠ −1',
    ),
    reduceTo: 'x',
    excluded: [-1, 1],
    varName: 'x',
    hints: {
      'x': L(
        "Iksning o'zida hech qanday shart yo'q.",
        'У самого икса никаких условий нет.',
        'The x by itself has no conditions.',
      ),
      'x(x-1)/(x-1)': L(
        "Bitta shart chiqdi. Minus birni ham beradigan ko'paytuvchi kerak.",
        'Условие вышло одно. Нужен множитель, который даёт и минус один.',
        'Only one condition came out. A factor giving minus one as well is needed.',
      ),
    },
    note: L(
      "Ko'paytuvchi ikki shart keltirdi",
      'Множитель принёс два условия',
      'The factor brought two conditions',
    ),
  },
}

// ============================================================
// EKRAN 14. BLITS.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    'Almashtirish belgilari',
    'Признаки преобразования',
    'The marks of transforming',
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
        tag: 'З15',
        ask: L(
          "(1 + 1/a) : b da nimadan boshlanadi?",
          'С чего начинают в (1 + 1/a) : b?',
          'Where do you start in (1 + 1/a) : b?',
        ),
        options: [
          { id: 'br', right: true, label: L('Qavsdan', 'Со скобки', 'With the bracket') },
          { id: 'div', label: L("Bo'lishdan", 'С деления', 'With the division') },
          { id: 'cut', label: L('Qisqartirishdan', 'С сокращения', 'With reducing') },
          { id: 'any', label: L('Farqi yo\'q', 'Всё равно', 'It makes no difference') },
        ],
        hint: L(
          "Qavs ichida ikki had bor, u hali bitta kasr emas.",
          'В скобке два слагаемых, она ещё не одна дробь.',
          'The bracket holds two terms, it is not one fraction yet.',
        ),
        ok: L(
          "Avval qavs bitta kasr bo'ladi, keyin bo'lish bajariladi.",
          'Сначала скобка становится одной дробью, потом выполняется деление.',
          'First the bracket becomes one fraction, then the division happens.',
        ),
      },
      {
        id: 'q2',
        tag: 'З1',
        ask: L(
          "(x + 2)/x kasrini qisqartirish mumkinmi?",
          'Можно ли сократить (x + 2)/x?',
          'Can (x + 2)/x be reduced?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, tepada yig'indi", 'Нет, сверху сумма', 'No, there is a sum above') },
          { id: 'yes', label: L('Ha, iksga', 'Да, на икс', 'Yes, by x') },
          { id: 'two', label: L('Ha, ikkiga', 'Да, на два', 'Yes, by two') },
          { id: 'one', label: L('Ha, bir qoladi', 'Да, останется единица', 'Yes, one remains') },
        ],
        hint: L(
          "Iks yig'indining hadi. Ikkida tekshirib ko'ring.",
          'Икс это слагаемое суммы. Проверь при двойке.',
          'The x is a term of the sum. Check at two.',
        ),
        ok: L(
          "Qisqartirish faqat ko'paytuvchi bo'yicha, bu 3-darsning qoidasi.",
          'Сокращают только по множителю, это правило третьего урока.',
          'Reducing goes only by a factor, that is the rule of lesson three.',
        ),
      },
      {
        id: 'q3',
        tag: 'З2',
        ask: L(
          "Javobda maxraj yo'q. Shart bormi?",
          'В ответе нет знаменателя. Есть ли условие?',
          'The answer has no denominator. Is there a condition?',
        ),
        options: [
          { id: 'yes', right: true, label: L("Bor, oraliq maxrajlardan", 'Есть, от промежуточных', 'Yes, from the intermediate ones') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
          { id: 'ans', label: L('Faqat javobdan', 'Только из ответа', 'Only from the answer') },
          { id: 'zero', label: L('Faqat nol', 'Только нуль', 'Only zero') },
        ],
        hint: L(
          "Yo'lda qanday maxrajlar bo'lganini eslang.",
          'Вспомни, какие знаменатели были по дороге.',
          'Recall which denominators appeared along the way.',
        ),
        ok: L(
          "Shart yozuvning yo'lidan yig'iladi, javobning ko'rinishidan emas.",
          'Условие собирают по пути записи, а не по виду ответа.',
          'The condition is collected along the record, not from the look of the answer.',
        ),
      },
      {
        id: 'q4',
        tag: 'З16',
        ask: L(
          "Uzun almashtirishni qanday tekshirasiz?",
          'Как проверить длинное преобразование?',
          'How do you check a long transformation?',
        ),
        options: [
          { id: 'sub', right: true, label: L("Ruhsat etilgan sonni qo'yib", 'Подставив допустимое число', 'By substituting an admissible number') },
          { id: 'len', label: L('Yozuv qisqarganiga qarab', 'По тому, что запись короче', 'By the record being shorter') },
          { id: 'taqiq', label: L("Taqiqlangan sonni qo'yib", 'Подставив запрещённое число', 'By substituting a forbidden number') },
          { id: 'eye', label: L("Ko'z bilan", 'Глазами', 'By eye') },
        ],
        hint: L(
          "Taqiqlangan qiymatda yozuvning qiymati yo'q, u tekshirish uchun yaramaydi.",
          'При запрещённом значении записи нет, для проверки оно не годится.',
          'At a forbidden value the record has no value, so it is useless for checking.',
        ),
        ok: L(
          "Ruhsat etilgan son ikki yozuvni solishtiradi. Bitta farq xatoni topadi.",
          'Допустимое число сравнивает две записи. Одно расхождение находит ошибку.',
          'An admissible number compares the two records. One mismatch finds the error.',
        ),
      },
    ],
    scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
    stepLabel: L('Savol', 'Вопрос', 'Question'),
  },
}

// ============================================================
// EKRAN 15. YAKUN. Bu dars blokning kasrlar qismini yopadi.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    'Qisqa javob va shartlar',
    'Короткий ответ и условия',
    'A short answer and its conditions',
  ),
  audio: [
    A('s0',
      "Xukdagi javob to'g'ri, lekin ikki shart bilan.",
      'Ответ с хука верен, но с двумя условиями.',
      'The answer from the hook is right, but with two conditions.'),
    A('s1',
      "Uch usul qoldi. Avval qavs, ko'p qavatli kasr va hamma maxraj.",
      'Остаются три способа. Сначала скобка, многоэтажная дробь и все знаменатели.',
      'Three methods remain. Brackets first, the multi-storey fraction, and every denominator.'),
    A('s2',
      "Kasrlar bo'limi tugadi. Keyingi darsda funksiya, u shu kasrni grafikda ko'rsatadi.",
      'Раздел дробей закончен. В следующем уроке функция, она покажет эту дробь на графике.',
      'The section on fractions is over. The next lesson brings a function that shows this fraction on a graph.'),
  ],
  props: {
    predictedLabel: L('Taxmin', 'Прогноз', 'Prediction'),
    proved: L(
      "Javob bir, lekin a nol va minus bir emas",
      'Ответ один, но a не нуль и не минус один',
      'The answer is one, but a is neither zero nor minus one',
    ),
    canLabel: L('Endi nima qila olasiz', 'Что теперь умеешь', 'What you can do now'),
    can: [
      L(
        "Qavsni bitta kasr qilib, keyin bo'lish",
        'Свести скобку в дробь и потом делить',
        'Collect a bracket into a fraction and then divide',
      ),
      L(
        "Ko'p qavatli kasrni bo'lish deb o'qish",
        'Читать многоэтажную дробь как деление',
        'Read a multi-storey fraction as a division',
      ),
      L(
        "Shartni hamma maxrajdan yig'ish",
        'Собирать условие со всех знаменателей',
        'Collect the condition from every denominator',
      ),
    ],
    proofNote: L(
      "Fakt. Grafik dasturlar uzun ifodani avval qisqartiradi, keyin chizadi, va shuning uchun uzilish nuqtasi ba'zan yo'qolib qoladi. Chizmadagi teshikni odam qo'yadi, dastur emas.",
      'Факт. Графические программы сначала упрощают длинное выражение, а потом рисуют, и поэтому точка разрыва иногда исчезает. Дырку на чертеже ставит человек, а не программа.',
      'A fact. Plotting software simplifies a long expression before drawing, which is why a break point sometimes disappears. The hole on the drawing is placed by a human, not by the program.',
    ),
    bridge: L(
      "Keyingi dars, y teng k bo'lingan iks funksiyasi, shu kasrni grafikda ko'rsatadi",
      'Следующий урок, функция y равно k делить на x, покажет эту дробь на графике',
      'The next lesson, the function y equals k over x, shows this fraction on a graph',
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
  { role: 'explain', tool: 'film', kind: 'film', tag: 'З15', ...S3 },
  { role: 'explain', tool: 'transform', kind: 'method1', tag: 'З15', method: M_ORDER, ...S4 },
  { role: 'explain', tool: 'transform', kind: 'method2', tag: 'З2', method: M_FLOOR, ...S5 },
  { role: 'explain', tool: 'solve', kind: 'together', tag: 'З2', ...S6 },
  { role: 'explain', tool: 'boundary', kind: 'boundary', tag: 'З2', ...S7 },
  { role: 'rule', tool: 'rulebuild', tag: 'З15', ...S8 },
  { role: 'practice', tool: 'chain', kind: 'drill', tag: 'З1', method: M_ORDER, ...S9 },
  { role: 'practice', tool: 'fields', kind: 'guided', tag: 'З15', method: M_FLOOR, ...S10 },
  { role: 'practice', tool: 'solo', kind: 'solo', tag: 'З16', method: M_ALL, ...S11 },
  { role: 'practice', tool: 'audit', kind: 'audit', tag: 'З2', method: M_ALL, ...S12 },
  { role: 'transfer', tool: 'inverse', kind: 'inverse', tag: 'З2', method: M_ALL, ...S13 },
  { role: 'blitz', tool: 'blitz', ...S14 },
  { role: 'summary', tool: 'summary', scene: FinalScene, ...S15 },
]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
