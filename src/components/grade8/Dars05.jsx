// ============================================================================
// 8-sinf, Dars 5. KASRLARNI KO'PAYTIRISH VA BO'LISH.
//
// Bu fayl — FAQAT MA'LUMOT (ETALON_8SINF.md §2). Mexanika `tools.jsx` da,
// o'ram `screens.jsx` da, javob tekshiruvi `mathcore.js` da.
//
// BLOK 1 KONVEYERI: 2, 3, 4, 5-darslar bitta skeletda.
//
// DARSNING ENG QIMMAT JOYI — BO'LISHDAGI UCHINCHI SHART. Ko'paytirishda
// shartni maxrajlar beradi; bo'lishda esa BO'LUVCHINING SURATI ham nolga
// aylanmasligi kerak, aks holda nolga bo'lish chiqadi. Aynan shu narsa
// 4-darsda ham, 3-darsda ham yo'q edi.
//
// DARSLIK. O'zbek darsligi, 5-§, 27-bet:
//   a/b * c/d = ac/(bd),   a/b : c/d = ad/(bc)
// «Algebraik kasrlarni ko'paytirish va bo'lish ham oddiy kasrlarni
// ko'paytirish va bo'lish qoidalari bo'yicha bajariladi.»
//
// ADASHISHLAR: З2, З15, З16 — §11 ro'yxatidan. З26 (bo'luvchi teskari
// qilinmadi) YANGI, metodist so'zini kutadi.
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
  id: 'alg-8-05',
  n: 5,
  row: 5,
  block: 'Б1',
  topic: L(
    "Kasrlarni ko'paytirish va bo'lish",
    'Умножение и деление рациональных дробей',
    'Multiplying and dividing rational fractions',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Ko'paytirishda suratlar suratga, maxrajlar maxrajga ko'paytiriladi",
    'При умножении числители идут в числитель, знаменатели в знаменатель',
    'When multiplying, numerators go to the numerator and denominators to the denominator',
  ),
  L(
    "Bo'lish teskari kasrga ko'paytirish bilan almashtiriladi",
    'Деление заменяют умножением на обратную дробь',
    'Division is replaced by multiplication by the reciprocal',
  ),
  L(
    "Bo'lishda uchinchi shart bor, bo'luvchining surati ham nol bo'lmaydi",
    'При делении есть третье условие: числитель делителя тоже не нуль',
    'Division has a third condition: the numerator of the divisor is not zero either',
  ),
]

export const MISS = {
  'З2': {
    what: L(
      "bo'lishda uchinchi shart yozilmadi",
      'при делении не записано третье условие',
      'the third condition was not written for the division',
    ),
    wrong: '((x+1)/x)/((x+1)/(2x))',
    at: -1,
  },
  'З15': {
    what: L(
      "qisqartirish ko'paytirishdan keyin qilindi, oldin emas",
      'сокращение сделано после умножения, а не до',
      'the reducing was done after multiplying instead of before',
    ),
    wrong: '(6a*10)/(5*3a)',
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
  'З26': {
    what: L(
      "bo'luvchi teskari qilinmadi, unga ko'paytirilgan",
      'делитель не перевёрнут: на него умножили',
      'the divisor was not flipped: it was multiplied by as it is',
    ),
    wrong: '(x/3)*(x/6)',
    at: 3,
  },
}

// ============================================================
// USULLAR (§4).
// ============================================================
const M_MUL = {
  name: L(
    "1-USUL. Ko'paytirish",
    'СПОСОБ 1. Умножение',
    'METHOD 1. Multiplication',
  ),
  steps: [
    L('Ko\'paytuvchilarni ajrating', 'Разложи на множители', 'Factor both parts'),
    L('Bir xilini qisqartiring', 'Сократи одинаковые', 'Reduce the identical ones'),
    L('Qolganini ko\'paytiring', 'Перемножь остальное', 'Multiply what is left'),
  ],
}

const M_DIV = {
  name: L(
    "2-USUL. Bo'lish",
    'СПОСОБ 2. Деление',
    'METHOD 2. Division',
  ),
  steps: [
    L('Bo\'luvchini teskari qiling', 'Переверни делитель', 'Flip the divisor'),
    L('Bo\'lishni ko\'paytirishga aylantiring', 'Замени деление умножением', 'Replace division by multiplication'),
    L('Keyin qisqartiring', 'И только потом сокращай', 'Only then reduce'),
  ],
}

const M_THREE = {
  name: L(
    "3-USUL. Uchinchi shart",
    'СПОСОБ 3. Третье условие',
    'METHOD 3. The third condition',
  ),
  steps: [
    L('Ikki maxrajga qarang', 'Посмотри оба знаменателя', 'Look at both denominators'),
    L('Bo\'luvchining suratiga qarang', 'Посмотри числитель делителя', 'Look at the numerator of the divisor'),
    L('Uchala shartni yozing', 'Запиши все три условия', 'Write all three conditions'),
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
      "Bo'linma va qisqa javob",
      'Частное и короткий ответ',
      'A quotient and a short answer',
    )}>
      {/* CHAP: bo'linma. */}
      <text x="60" y="62" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20" fill={T.ink}>x</text>
      <line x1="42" y1="74" x2="78" y2="74" stroke={T.ink} strokeWidth="2.4"/>
      <text x="60" y="102" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20" fill={T.ink}>3</text>
      <circle cx="100" cy="70" r="2.2" fill={T.ink3}/>
      <circle cx="100" cy="82" r="2.2" fill={T.ink3}/>
      <text x="140" y="62" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20" fill={T.ink}>x</text>
      <line x1="122" y1="74" x2="158" y2="74" stroke={T.ink} strokeWidth="2.4"/>
      <text x="140" y="102" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20" fill={T.ink}>6</text>

      {/* O'NG: qisqa javob KELADI. */}
      <g className="g8-fly" style={{ '--d': '2900ms' }}>
        <text x="300" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="30"
          fill={T.accent}>2</text>
      </g>

      <g className="g8-seat" style={{ '--d': '3400ms' }}>
        <circle cx="215" cy="80" r="17" fill={T.graphSoft} stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="215" y="87" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="132" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_ODZ)}</text>
      <line x1="132" y1="142" x2="268" y2="142" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5" pathLength="1" className="g8-draw"/>
    </SceneBand>
  )
}

// YAKUN: o'sha bo'linma, tenglik va nolda teshik.
const FinalScene = (
  <SceneBand kind="final" label={L(
    "Bo'linma ikkiga teng, nolda esa teshik",
    'Частное равно двум, а в нуле дырка',
    'The quotient equals two, and there is a hole at zero',
  )}>
    <text x="46" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ink}>x</text>
    <line x1="34" y1="37" x2="58" y2="37" stroke={T.ink} strokeWidth="1.8"/>
    <text x="46" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ink}>3</text>
    <circle cx="72" cy="38" r="1.8" fill={T.ink3}/>
    <circle cx="72" cy="46" r="1.8" fill={T.ink3}/>
    <text x="98" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ink}>x</text>
    <line x1="86" y1="37" x2="110" y2="37" stroke={T.ink} strokeWidth="1.8"/>
    <text x="98" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ink}>6</text>

    <text x="132" y="44" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16" fill={T.ok}>=</text>

    <text x="164" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ok}>x</text>
    <line x1="152" y1="37" x2="176" y2="37" stroke={T.ok} strokeWidth="1.8"/>
    <text x="164" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ok}>3</text>
    <text x="190" y="44" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ok}>{'·'}</text>
    <text x="216" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ok}>6</text>
    <line x1="204" y1="37" x2="228" y2="37" stroke={T.ok} strokeWidth="1.8"/>
    <text x="216" y="54" textAnchor="middle" fontFamily={MATH_FONT} fontSize="15" fill={T.ok}>x</text>
    <text x="250" y="44" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16" fill={T.ok}>= 2</text>

    <line x1="120" y1="78" x2="280" y2="78" stroke="rgba(23,26,29,.28)" strokeWidth="1.4"/>
    <text x="160" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink3}>{'−2'}</text>
    <text x="200" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink3}>0</text>
    <text x="240" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink3}>2</text>
    <g className="g8-seat" style={{ '--d': '600ms' }}>
      <circle cx="200" cy="78" r="5.2" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
    </g>
    <g className="g8-seat" style={{ '--d': '1000ms' }}>
      <rect x="300" y="68" width="76" height="19" rx="9.5" fill={T.tipSoft}/>
      <text x="338" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
        fontWeight="700" fill={T.tip}>{'x ≠ 0'}</text>
    </g>
  </SceneBand>
)

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('IKKI YOZUV', 'ДВЕ ЗАПИСИ', 'TWO RECORDS'),
  title: L(
    "Bo'linma va qisqa javob",
    'Частное и короткий ответ',
    'A quotient and a short answer',
  ),
  lead: L(
    "Javobini dars davomida o'zingiz topasiz",
    'Ответ найдёшь сам по ходу урока',
    'You will find the answer yourself during the lesson',
  ),
  audio: [
    A('mount',
      "Chapda ikki kasrning bo'linmasi, o'ngda qisqa javob.",
      'Слева частное двух дробей, справа короткий ответ.',
      'On the left a quotient of two fractions, on the right a short answer.'),
    A('why',
      "Taxmin qiling, bu javob har qanday iks uchun to'g'ri bo'ladimi.",
      'Предположи, верен ли этот ответ при любом иксе.',
      'Predict whether this answer is right for every x.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Javob har qanday iksda to'g'rimi?",
      'Верен ли ответ при любом иксе?',
      'Is the answer right for every x?',
    ),
    items: [
      {
        id: 'always',
        show: L("Ha, har qanday iksda", 'Да, при любом иксе', 'Yes, for every x'),
      },
      {
        id: 'not',
        show: L("Yo'q, bir qiymatda buziladi", 'Нет, при одном значении ломается', 'No, it breaks at one value'),
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
// EKRAN 2. TAYANCH. Sonli ko'paytirish, sonli bo'lish va TESKARI KASR.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    'Teskari kasr',
    'Обратная дробь',
    'The reciprocal fraction',
  ),
  audio: [
    A('mount',
      "Uch narsa kerak. Ko'paytirish, bo'lish va teskari kasr.",
      'Нужны три вещи. Умножение, деление и обратная дробь.',
      'Three things are needed. Multiplication, division and the reciprocal.'),
    W('t1',
      "Ko'paytirishda suratlar suratga, maxrajlar maxrajga ketadi.",
      'При умножении числители идут в числитель, знаменатели в знаменатель.',
      'When multiplying, numerators go up and denominators go down.'),
    W('t2',
      "Yarimni chorakka bo'lsak ikki chiqadi. Chorak yarimda ikki marta bor.",
      'Половину разделить на четверть выходит два. Четверть в половине содержится дважды.',
      'A half divided by a quarter gives two. A quarter fits into a half twice.'),
    W('t3',
      "Teskari kasrda surat va maxraj joyini almashtiradi.",
      'В обратной дроби числитель и знаменатель меняются местами.',
      'In the reciprocal the numerator and denominator swap places.'),
  ],
  props: {
    items: [
      {
        prompt: L(
          "Ko'paytmani yozing",
          'Запиши произведение',
          'Write the product',
        ),
        show: (
          <Row size="row" align="center">
            {F('2', '3')}
            {' · '}
            {F('3', '4')}
          </Row>
        ),
        kind: 'expr',
        answer: '1/2',
        accepts: ['(2*3)/(3*4)', '6/12'],
        hints: {
          '5/7': L(
            "Ko'paytirishda qo'shish yo'q. Suratlar ko'paytiriladi.",
            'При умножении ничего не складывают. Числители умножают.',
            'Nothing is added when multiplying. The numerators are multiplied.',
          ),
          '6/4': L(
            "Uchlik faqat pastda qisqardi. U ikkinchi kasrning suratida ham bor.",
            'Тройка сократилась только внизу. Она есть и в числителе второй дроби.',
            'The three reduced only below. It is also in the numerator of the second fraction.',
          ),
        },
        closed: L('2/3 · 3/4 = 1/2', '2/3 · 3/4 = 1/2', '2/3 · 3/4 = 1/2'),
      },
      {
        prompt: L(
          "Bo'linmani yozing",
          'Запиши частное',
          'Write the quotient',
        ),
        show: (
          <Row size="row" align="center">
            {F('1', '2')}
            {'  :  '}
            {F('1', '4')}
          </Row>
        ),
        kind: 'expr',
        answer: '2',
        accepts: ['4/2', '(1/2)*(4/1)'],
        hints: {
          '1/8': L(
            "Bu ko'paytirish bo'ldi. Bo'lish esa boshqa amal.",
            'Это умножение. А деление другое действие.',
            'That is multiplication. Division is a different action.',
          ),
          '8': L(
            "Yarim chorakdan katta, lekin sakkiz marta emas.",
            'Половина больше четверти, но не в восемь раз.',
            'A half is bigger than a quarter, but not eight times.',
          ),
        },
        closed: L('1/2 : 1/4 = 2', '1/2 : 1/4 = 2', '1/2 : 1/4 = 2'),
      },
      {
        prompt: L(
          'Teskari kasrni yozing',
          'Запиши обратную дробь',
          'Write the reciprocal fraction',
        ),
        show: (
          <Row size="row" align="center">
            {F('3', 'x')}
          </Row>
        ),
        kind: 'expr',
        answer: 'x/3',
        accepts: ['x*(1/3)'],
        hints: {
          '3/x': L(
            "Bu o'sha kasr. Surat va maxraj almashishi kerak.",
            'Это та же дробь. Числитель и знаменатель должны поменяться местами.',
            'That is the same fraction. The numerator and denominator must swap.',
          ),
          '-3/x': L(
            "Teskari kasr belgini o'zgartirmaydi, joyini almashtiradi.",
            'Обратная дробь меняет не знак, а места.',
            'A reciprocal changes places, not the sign.',
          ),
        },
        closed: L('3/x uchun teskarisi x/3', 'обратная к 3/x это x/3', 'the reciprocal of 3/x is x/3'),
      },
    ],
  },
}

// ============================================================
// EKRAN 3. YADRO. Ko'paytirish qoidasi lenta bilan.
// ============================================================
const S3 = {
  eyebrow: L("KO'PAYTIRISH", 'УМНОЖЕНИЕ', 'MULTIPLICATION'),
  title: L(
    "Ko'paytirish qoidasi",
    'Правило умножения',
    'The rule of multiplication',
  ),
  audio: [
    A('mount',
      "Sonlarda ko'ramiz, keyin harflarga o'tamiz.",
      'Посмотрим на числах, потом перейдём к буквам.',
      'We look at numbers first and then move to letters.'),
    W('k2',
      "Ikki surat ko'paytirildi, ikki maxraj ham ko'paytirildi. Umumiy maxraj kerak emas.",
      'Два числителя перемножены, два знаменателя тоже. Общий знаменатель не нужен.',
      'Two numerators were multiplied and two denominators as well. No common denominator is needed.'),
    W('k3',
      "Harflar bilan ham shunday. Bu qoida qo'shishdan yengil.",
      'С буквами так же. Это правило легче, чем сложение.',
      'With letters the same. This rule is easier than addition.'),
  ],
  props: {
    film: {
      fig: 'mult',
      data: {
        left: (
          <Row size="row" align="center">
            {F('2', '3')}
            {' · '}
            {F('5', '7')}
          </Row>
        ),
        mid: F('2 · 5', '3 · 7'),
        right: F('10', '21'),
        same: L(
          "surat suratga, maxraj maxrajga",
          'числитель к числителю, знаменатель к знаменателю',
          'numerator to numerator, denominator to denominator',
        ),
        rule: (
          <Row size="row" align="center">
            {F('a', 'b')}
            {' · '}
            {F('c', 'd')}
            {' = '}
            {F('ac', 'bd')}
          </Row>
        ),
      },
      frames: [
        {
          id: 'k1',
          phase: 0,
          label: L('Ikki kasr', 'Две дроби', 'Two fractions'),
          text: L(
            "Maxrajlar boshqa, lekin bu ko'paytirishga xalaqit bermaydi",
            'Знаменатели разные, но умножению это не мешает',
            'The denominators differ, and that does not hinder multiplication',
          ),
        },
        {
          id: 'k2',
          phase: 1,
          label: L("Ko'paytirdik", 'Перемножили', 'Multiplied'),
          text: L(
            "Ikki surat va ikki maxraj alohida ko'paytirildi",
            'Два числителя и два знаменателя перемножены отдельно',
            'Two numerators and two denominators were multiplied separately',
          ),
          ask: {
            question: L(
              'Maxrajda nima turadi?',
              'Что стоит в знаменателе?',
              'What is in the denominator?',
            ),
            items: [
              { id: 'mul', right: true, label: L('3 · 7', '3 · 7', '3 · 7') },
              {
                id: 'sum',
                label: L('3 + 7', '3 + 7', '3 + 7'),
                hint: L(
                  "Qo'shish qo'shishda edi. Bu yerda ko'paytirish.",
                  'Сложение было при сложении. Здесь умножение.',
                  'Addition belonged to addition. Here it is multiplication.',
                ),
              },
              {
                id: 'one',
                label: L('7', '7', '7'),
                hint: L(
                  "Birinchi maxraj ham qoladi, u yo'qolmaydi.",
                  'Первый знаменатель тоже остаётся, он не исчезает.',
                  'The first denominator stays as well, it does not vanish.',
                ),
              },
              {
                id: 'div',
                label: L('7 : 3', '7 : 3', '7 : 3'),
                hint: L(
                  "Bo'lish keyingi mavzu. Hozir ko'paytirish.",
                  'Деление это следующая тема. Сейчас умножение.',
                  'Division is the next topic. Now it is multiplication.',
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
            "Harflar bilan qoida shunday yoziladi",
            'С буквами правило записывается так',
            'With letters the rule is written like this',
          ),
          ask: {
            question: L(
              "Ko'paytirishda umumiy maxraj kerakmi?",
              'Нужен ли общий знаменатель при умножении?',
              'Is a common denominator needed for multiplication?',
            ),
            items: [
              {
                id: 'no',
                right: true,
                label: L('Kerak emas', 'Не нужен', 'It is not needed'),
              },
              {
                id: 'yes',
                label: L('Kerak', 'Нужен', 'It is needed'),
                hint: L(
                  "Umumiy maxraj qo'shish uchun kerak edi. Bu yerda maxrajlar shunchaki ko'paytiriladi.",
                  'Общий знаменатель был нужен для сложения. Здесь знаменатели просто перемножаются.',
                  'A common denominator was needed for addition. Here the denominators are simply multiplied.',
                ),
              },
              {
                id: 'some',
                label: L("Faqat harflarda", 'Только с буквами', 'Only with letters'),
                hint: L(
                  "Qoida sonlar uchun ham, harflar uchun ham bir xil.",
                  'Правило одно и то же и для чисел, и для букв.',
                  'The rule is the same for numbers and for letters.',
                ),
              },
              {
                id: 'div',
                label: L("Faqat bo'lishda", 'Только при делении', 'Only when dividing'),
                hint: L(
                  "Bo'lish ham ko'paytirishga aylanadi, unda ham umumiy maxraj kerak emas.",
                  'Деление тоже превращается в умножение, и там общий знаменатель не нужен.',
                  'Division also turns into multiplication, and no common denominator is needed there.',
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
// EKRAN 4. 1-USUL: KO'PAYTIRISH, va qisqartirish KO'PAYTIRISHDAN OLDIN.
// ============================================================
const S4 = {
  eyebrow: L('1-USUL', 'СПОСОБ 1', 'METHOD 1'),
  title: L(
    "Ko'paytirishdan oldin qisqartirish",
    'Сокращение до умножения',
    'Reducing before multiplying',
  ),
  audio: [
    A('mount',
      "Bu yozuvni ko'paytirib, keyin qisqartirish mumkin. Lekin teskari tartib qulayroq.",
      'Эту запись можно сначала перемножить, а потом сократить. Но обратный порядок удобнее.',
      'This record can be multiplied first and reduced after. But the other order is easier.'),
    W('s2',
      "Suratlar va maxrajlar ko'paytirildi, endi bir xil ko'paytuvchi ko'rinadi.",
      'Числители и знаменатели перемножены, теперь виден одинаковый множитель.',
      'The numerators and denominators are multiplied, now the identical factor is visible.'),
    W('s3',
      "Iks qisqardi va harf butunlay ketdi. Javob son.",
      'Икс сократился, и буква ушла совсем. Ответ это число.',
      'The x reduced away and the letter is gone entirely. The answer is a number.'),
    W('s4',
      "Lekin shart qoladi, chunki boshlang'ich yozuvda maxrajda iks bor edi.",
      'Но условие остаётся, потому что в исходной записи икс стоял в знаменателе.',
      'But the condition stays, because in the original record x was in a denominator.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {F('6a', '5')}
        {' · '}
        {F('10', '3a')}
      </Row>
    ),
    actions: [
      { id: 'mul', label: L("Suratlarni va maxrajlarni ko'paytirish", 'Перемножить числители и знаменатели', 'Multiply numerators and denominators') },
      { id: 'add', label: L("Maxrajlarni qo'shish", 'Сложить знаменатели', 'Add the denominators') },
      { id: 'cross', label: L("Suratni maxrajga qo'shish", 'Сложить числитель со знаменателем', 'Add numerator to denominator') },
    ],
    steps: [
      {
        action: 'mul',
        wrongs: [
          {
            action: 'add',
            hint: L(
              "Umumiy maxraj qo'shishda kerak edi. Ko'paytirishda maxrajlar ko'paytiriladi.",
              'Общий знаменатель был нужен при сложении. При умножении знаменатели умножают.',
              'A common denominator was needed for addition. For multiplication the denominators are multiplied.',
            ),
          },
          {
            action: 'cross',
            hint: L(
              "Surat va maxraj aralashmaydi. Har biri o'z joyida ko'paytiriladi.",
              'Числитель и знаменатель не смешиваются. Каждый умножается на своём месте.',
              'Numerator and denominator do not mix. Each is multiplied in its own place.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'rule',
              right: true,
              label: L("Ko'paytirish qoidasi", 'Правило умножения дробей', 'The rule for multiplying fractions'),
            },
            {
              id: 'main',
              label: L('Kasrning asosiy xossasi', 'Основное свойство дроби', 'The basic property of a fraction'),
              hint: L(
                "Xossa bitta kasrni o'zgartiradi. Bu yerda ikki kasr ko'paytirilmoqda.",
                'Свойство меняет одну дробь. Здесь перемножаются две.',
                'The property changes one fraction. Here two are being multiplied.',
              ),
            },
            {
              id: 'sum',
              label: L("Qo'shish qoidasi", 'Правило сложения', 'The addition rule'),
              hint: L(
                "Yozuvda ko'paytirish belgisi turibdi.",
                'В записи стоит знак умножения.',
                'The record holds a multiplication sign.',
              ),
            },
          ],
        },
        ask: L(
          'Bitta kasr qilib yozing',
          'Запиши одной дробью',
          'Write it as a single fraction',
        ),
        answer: '(6a*10)/(5*3a)',
        accepts: ['(60a)/(15a)', '(6a/5)*(10/(3a))'],
        hints: {
          '4': L(
            "Bu javob, lekin keyingi qadamda. Hozir bitta kasr yozilishi kerak.",
            'Это итог, но следующим шагом. Сейчас нужна одна дробь.',
            'That is the result but it belongs to the next step. Now one fraction is needed.',
          ),
          '(6a*10)/(5+3a)': L(
            "Maxrajlar ko'paytiriladi, qo'shilmaydi.",
            'Знаменатели умножают, а не складывают.',
            'The denominators are multiplied, not added.',
          ),
          '(60a)/(15)': L(
            "Ikkinchi maxrajda a bor edi, u yo'qolmaydi.",
            'Во втором знаменателе была a, она не исчезает.',
            'The second denominator held an a and it does not vanish.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('6a · 10', '5 · 3a')}
            {' = '}
            {F('60a', '15a')}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'cut', label: L('Qisqartirish', 'Сократить', 'Reduce it') },
          { id: 'keep', label: L('Shundayligicha qoldirish', 'Оставить как есть', 'Leave it as it is') },
          { id: 'split', label: L("Hadlab bo'lish", 'Разделить по слагаемым', 'Divide term by term') },
        ],
        action: 'cut',
        wrongs: [
          {
            action: 'keep',
            hint: L(
              "Surat ham, maxraj ham a ga bo'linadi va 15 ga ham.",
              'И числитель, и знаменатель делятся на a, и ещё на 15.',
              'Both numerator and denominator divide by a and also by 15.',
            ),
          },
          {
            action: 'split',
            hint: L(
              "Yig'indi yo'q, ikkalasi ham ko'paytma.",
              'Суммы нет, и там, и там произведение.',
              'There is no sum, both are products.',
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
              label: L("Ko'paytirish qoidasi", 'Правило умножения', 'The multiplication rule'),
              hint: L(
                "Ko'paytirish bajarildi. Hozir kasr qisqartirilmoqda.",
                'Умножение выполнено. Сейчас дробь сокращают.',
                'The multiplication is done. Now the fraction is reduced.',
              ),
            },
            {
              id: 'div',
              label: L("Bo'lish qoidasi", 'Правило деления', 'The division rule'),
              hint: L(
                "Bo'lish bu yerda yo'q, yozuvda ko'paytirish edi.",
                'Деления здесь нет, в записи было умножение.',
                'There is no division here, the record held a multiplication.',
              ),
            },
          ],
        },
        ask: L('Nima qoldi?', 'Что осталось?', 'What is left?'),
        answer: '4',
        accepts: ['4'],
        hints: {
          '4a': L(
            "Iks emas, a. Va u ikkala qismda bor, demak qisqaradi.",
            'Буква a есть и сверху, и снизу, значит она сокращается.',
            'The letter a is above and below, so it reduces away.',
          ),
          '(60a)/(15a)': L(
            "Qisqartirish bajarilmagan. 60 ni 15 ga bo'ling.",
            'Сокращение не выполнено. Раздели 60 на 15.',
            'The reducing is not done. Divide 60 by 15.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('60a', '15a')}
            {' = 4'}
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
              "Javob to'rtlik, unda harf yo'q. Shart yozuvdan oldin paydo bo'lgan.",
              'Ответ это четвёрка, в нём буквы нет. Условие возникло до него.',
              'The answer is a four with no letter. The condition appeared before it.',
            ),
          },
          {
            action: 'none',
            hint: L(
              "Ikkinchi kasrning maxraji 3a. Bir qiymatda u nolga aylanadi.",
              'У второй дроби знаменатель 3a. При одном значении он обращается в нуль.',
              'The second fraction has denominator 3a. At one value it becomes zero.',
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
              label: L('Ikkinchi maxrajdan', 'От второго знаменателя', 'From the second denominator'),
            },
            {
              id: 'num',
              label: L('Suratdan', 'От числителя', 'From the numerator'),
              hint: L(
                "Suratdagi nol qiymatni nol qiladi, taqiq bermaydi.",
                'Нуль в числителе даёт нулевое значение, а не запрет.',
                'Zero in the numerator gives a zero value, not a restriction.',
              ),
            },
            {
              id: 'ten',
              label: L("O'nlikdan", 'От десятки', 'From the ten'),
              hint: L(
                "O'nlik son, u hech qachon nol emas.",
                'Десятка это число, она никогда не нуль.',
                'The ten is a number and it is never zero.',
              ),
            },
          ],
        },
        kind: 'odz',
        varName: 'a',
        excluded: [0],
        accepts: ['a != 0', '3a != 0'],
        ask: L(
          'Ruhsat etilgan qiymatlarni yozing',
          'Запиши допустимые значения',
          'Write the admissible values',
        ),
        hints: {
          'a != 3': L(
            "Uchda 3a to'qqizga teng, nolga emas.",
            'При трёх 3a равно девяти, а не нулю.',
            'At three, 3a equals nine, not zero.',
          ),
          'a != 5': L(
            "Beshlik birinchi maxrajda, u son va nolga aylanmaydi.",
            'Пятёрка в первом знаменателе, это число и в нуль оно не обращается.',
            'The five is in the first denominator; it is a number and never becomes zero.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'a ≠ 0'}
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 5. 2-USUL: BO'LISH va UCHINCHI SHART. Darsning asosiy joyi.
// ============================================================
const S5 = {
  eyebrow: L('2-USUL', 'СПОСОБ 2', 'METHOD 2'),
  title: L(
    "Bo'lish va uchinchi shart",
    'Деление и третье условие',
    'Division and the third condition',
  ),
  audio: [
    A('mount',
      "Bo'lish belgisi turibdi. Uni ko'paytirishga aylantiramiz.",
      'Стоит знак деления. Превратим его в умножение.',
      'A division sign is there. We turn it into a multiplication.'),
    W('s2',
      "Bo'luvchi teskari qilindi, surat va maxraj joyini almashtirdi.",
      'Делитель перевёрнут, числитель и знаменатель поменялись местами.',
      'The divisor is flipped, the numerator and denominator swapped places.'),
    W('s3',
      "Ko'paytirgandan keyin qavslar qisqardi va ikkilik qoldi.",
      'После умножения скобки сократились и осталась двойка.',
      'After multiplying the brackets reduced away and a two was left.'),
    W('s4',
      "Bu yerda uchta shart bor. Ikkitasi maxrajlardan, uchinchisi bo'luvchining suratidan.",
      'Здесь три условия. Два от знаменателей, а третье от числителя делителя.',
      'There are three conditions here. Two from the denominators and the third from the numerator of the divisor.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {F('x + 1', 'x')}
        {'  :  '}
        {F('x + 1', '2x')}
      </Row>
    ),
    actions: [
      { id: 'flip', label: L("Bo'luvchini teskari qilish", 'Перевернуть делитель', 'Flip the divisor') },
      { id: 'same', label: L("Bo'luvchiga ko'paytirish", 'Умножить на делитель', 'Multiply by the divisor') },
      { id: 'first', label: L("Bo'linuvchini teskari qilish", 'Перевернуть делимое', 'Flip the dividend') },
    ],
    steps: [
      {
        action: 'flip',
        wrongs: [
          {
            action: 'same',
            hint: L(
              "Bu bo'lish emas, ko'paytirish bo'lardi. Sonlarda tekshirib ko'ring.",
              'Это было бы умножение, а не деление. Проверь на числах.',
              'That would be multiplication, not division. Check it on numbers.',
            ),
          },
          {
            action: 'first',
            hint: L(
              "Teskari qilinadigan narsa BO'LUVCHI, ya'ni ikkinchi kasr.",
              'Переворачивают ДЕЛИТЕЛЬ, то есть вторую дробь.',
              'It is the DIVISOR that gets flipped, that is the second fraction.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'rule',
              right: true,
              label: L("Bo'lish qoidasi", 'Правило деления дробей', 'The rule for dividing fractions'),
            },
            {
              id: 'main',
              label: L('Kasrning asosiy xossasi', 'Основное свойство дроби', 'The basic property of a fraction'),
              hint: L(
                "Xossa surat va maxrajni bir xil narsaga ko'paytiradi. Bu yerda kasr TESKARI qilinadi.",
                'Свойство умножает числитель и знаменатель на одно и то же. Здесь дробь переворачивают.',
                'The property multiplies numerator and denominator by the same thing. Here a fraction is flipped.',
              ),
            },
            {
              id: 'sum',
              label: L("Qo'shish qoidasi", 'Правило сложения', 'The addition rule'),
              hint: L(
                "Yozuvda bo'lish belgisi turibdi.",
                'В записи стоит знак деления.',
                'The record holds a division sign.',
              ),
            },
          ],
        },
        ask: L(
          "Ko'paytiriladigan kasrni yozing",
          'Запиши дробь, на которую умножаем',
          'Write the fraction we multiply by',
        ),
        answer: '(2x)/(x+1)',
        accepts: ['2x/(x+1)'],
        hints: {
          '(x+1)/(2x)': L(
            "Bu bo'luvchining o'zi. Uni teskari qilish kerak.",
            'Это сам делитель. Его надо перевернуть.',
            'That is the divisor itself. It must be flipped.',
          ),
          '(2x)/(x-1)': L(
            "Belgiga qarang, bo'luvchining suratida x plyus bir edi.",
            'Посмотри на знак: в числителе делителя было x плюс один.',
            'Look at the sign: the numerator of the divisor held x plus one.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('x + 1', 'x')}
            {' · '}
            {F('2x', 'x + 1')}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'mul', label: L("Ko'paytirish va qisqartirish", 'Перемножить и сократить', 'Multiply and reduce') },
          { id: 'add', label: L("Suratlarni qo'shish", 'Сложить числители', 'Add the numerators') },
          { id: 'flip', label: L("Yana teskari qilish", 'Перевернуть ещё раз', 'Flip once more') },
        ],
        action: 'mul',
        wrongs: [
          {
            action: 'add',
            hint: L(
              "Belgi ko'paytirish. Qo'shish oldingi darsda edi.",
              'Знак умножения. Сложение было на прошлом уроке.',
              'The sign is multiplication. Addition was in the previous lesson.',
            ),
          },
          {
            action: 'flip',
            hint: L(
              "Bir marta teskari qilindi va bo'lish ketdi. Ikkinchi marta kerak emas.",
              'Один раз перевернули, и деление ушло. Второй раз не нужен.',
              'One flip removed the division. A second flip is not needed.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'mulrule',
              right: true,
              label: L("Ko'paytirish va qisqartirish", 'Умножение и сокращение', 'Multiplying and reducing'),
            },
            {
              id: 'divrule',
              label: L("Bo'lish qoidasi", 'Правило деления', 'The division rule'),
              hint: L(
                "Bo'lish allaqachon ko'paytirishga aylandi.",
                'Деление уже превратилось в умножение.',
                'The division already turned into multiplication.',
              ),
            },
            {
              id: 'sumrule',
              label: L("Qo'shish qoidasi", 'Правило сложения', 'The addition rule'),
              hint: L(
                "Yig'indi yo'q, ko'paytma bor.",
                'Суммы нет, есть произведение.',
                'There is no sum, there is a product.',
              ),
            },
          ],
        },
        ask: L('Nima qoldi?', 'Что осталось?', 'What is left?'),
        answer: '2',
        accepts: ['2'],
        hints: {
          '2x': L(
            "Maxrajda ham iks bor edi, u qisqaradi.",
            'В знаменателе тоже был икс, он сокращается.',
            'The denominator held an x too and it reduces away.',
          ),
          '(2x(x+1))/(x(x+1))': L(
            "Qisqartirish bajarilmagan. Bir xil qavslarni va iksni qisqartiring.",
            'Сокращение не выполнено. Сократи одинаковые скобки и икс.',
            'The reducing is not done. Reduce the identical brackets and the x.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('2x(x + 1)', 'x(x + 1)')}
            {' = 2'}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'three', label: L('Uchta shart', 'Три условия', 'Three conditions') },
          { id: 'two', label: L('Ikkita shart', 'Два условия', 'Two conditions') },
          { id: 'none', label: L("Shart kerak emas", 'Условие не нужно', 'No condition needed') },
        ],
        action: 'three',
        wrongs: [
          {
            action: 'two',
            hint: L(
              "Maxrajlardan ikkita chiqadi. Lekin bo'luvchining SURATI ham nolga aylanmasligi kerak.",
              'От знаменателей выходит два. Но и ЧИСЛИТЕЛЬ делителя не должен обращаться в нуль.',
              'The denominators give two. But the NUMERATOR of the divisor must not become zero either.',
            ),
          },
          {
            action: 'none',
            hint: L(
              "Yozuvda ikki maxrajda ham iks bor.",
              'В записи икс стоит в двух знаменателях.',
              'The record has x in two denominators.',
            ),
          },
        ],
        why: {
          question: L(
            "Nega bo'luvchining surati muhim?",
            'Почему важен числитель делителя?',
            'Why does the numerator of the divisor matter?',
          ),
          items: [
            {
              id: 'zero',
              right: true,
              label: L(
                "Nolga bo'lish mumkin emas",
                'На нуль делить нельзя',
                'Division by zero is impossible',
              ),
            },
            {
              id: 'big',
              label: L('U qavs ichida', 'Он в скобке', 'It is in a bracket'),
              hint: L(
                "Qavs ahamiyatsiz. Ahamiyatli narsa bo'luvchining nolga aylanishi.",
                'Скобка ни при чём. Важно, что делитель обращается в нуль.',
                'The bracket is irrelevant. What matters is the divisor becoming zero.',
              ),
            },
            {
              id: 'same',
              label: L("U birinchi surat bilan bir xil", 'Он такой же, как первый числитель', 'It is the same as the first numerator'),
              hint: L(
                "O'xshashligi ahamiyatsiz. Bo'luvchi nol bo'lsa, bo'lish yo'q.",
                'Схожесть ни при чём. Если делитель нуль, деления нет.',
                'The resemblance is irrelevant. If the divisor is zero there is no division.',
              ),
            },
          ],
        },
        kind: 'odz',
        varName: 'x',
        excluded: [-1, 0],
        accepts: ['x != 0, x != -1', 'x(x+1) != 0'],
        ask: L(
          'Hamma shartni yozing',
          'Запиши все условия',
          'Write all the conditions',
        ),
        hints: {
          'x != 0': L(
            "Bo'luvchining surati x plyus bir. U qaysi qiymatda nolga aylanadi?",
            'Числитель делителя это x плюс один. При каком значении он равен нулю?',
            'The numerator of the divisor is x plus one. At which value is it zero?',
          ),
          'x != -1': L(
            "Maxrajlarda iks turibdi, u ham nolga aylanadi.",
            'В знаменателях стоит икс, он тоже обращается в нуль.',
            'The denominators hold x and it becomes zero as well.',
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
// EKRAN 6. BIRGA YECHAMIZ. Xukning yozuvi. MUVAFFAQIYATSIZ QADAM:
// bo'luvchi teskari qilinmadi, unga ko'paytirildi (З26), va bu SON
// bilan rad etiladi.
// ============================================================
const S6 = {
  eyebrow: L('BIRGA YECHAMIZ', 'РЕШАЕМ ВМЕСТЕ', 'SOLVING TOGETHER'),
  title: L(
    "Bo'linma qanday hisoblanadi",
    'Как считается частное',
    'How a quotient is computed',
  ),
  audio: [
    A('mount',
      "Birinchi ekrandagi bo'linmani oxirigacha hisoblaymiz.",
      'Посчитаем до конца частное с первого экрана.',
      'We will compute the quotient from the first screen to the end.'),
    W('s3',
      "Uchda chapda ikki, o'ngda nol butun besh chiqadi. Qadam rad etildi.",
      'При трёх слева выходит два, а справа нуль целых пять. Шаг отвергнут.',
      'At three the left gives two and the right gives zero point five. The step is refuted.'),
    W('s5',
      "Teskari kasrga ko'paytirilganda esa ikkilik chiqadi.",
      'А при умножении на обратную дробь выходит двойка.',
      'And multiplying by the reciprocal gives a two.'),
    W('s6',
      "Javob ikki, lekin iks nolga teng bo'lmasa.",
      'Ответ два, но при иксе, не равном нулю.',
      'The answer is two, but only when x is not zero.'),
  ],
  props: {
    task: L(
      "x/3 : x/6 nimaga teng?",
      'Чему равно x/3 : x/6?',
      'What does x/3 : x/6 equal?',
    ),
    lines: [
      {
        text: 'x/3 : x/6',
        note: L('berilgan', 'дано', 'given'),
      },
      {
        text: L(
          "Bo'lish belgisi turibdi, ikki kasr bor",
          'Стоит знак деления, дробей две',
          'A division sign and two fractions',
        ),
      },
      {
        text: 'x/3 · x/6 = x · x / 18',
        tone: 'no',
        ask: {
          question: L(
            'x uchga teng. Chapda va bu yozuvda nima chiqadi?',
            'Икс равен трём. Что выйдет слева и в этой записи?',
            'x equals three. What comes out on the left and in this record?',
          ),
          items: [
            { id: 'diff', right: true, label: L('2 va 0,5', '2 и 0,5', '2 and 0.5') },
            {
              id: 'same',
              label: L('2 va 2', '2 и 2', '2 and 2'),
              hint: L(
                "To'qqizni o'n sakkizga bo'lsak nol butun besh chiqadi.",
                'Девять разделить на восемнадцать это нуль целых пять.',
                'Nine divided by eighteen is zero point five.',
              ),
            },
            {
              id: 'half',
              label: L('0,5 va 0,5', '0,5 и 0,5', '0.5 and 0.5'),
              hint: L(
                "Chapda bittani nol butun beshga bo'lamiz, bu ikki.",
                'Слева единицу делим на нуль целых пять, это два.',
                'On the left we divide one by zero point five, which is two.',
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
          "Demak bo'luvchiga ko'paytirish mumkin emas",
          'Значит умножать на делитель нельзя',
          'So multiplying by the divisor is not allowed',
        ),
        tone: 'no',
      },
      {
        text: 'x/3 · 6/x = 6x/(3x) = 2',
        ask: {
          question: L(
            'Ikkinchi kasr bilan nima qilindi?',
            'Что сделали со второй дробью?',
            'What was done to the second fraction?',
          ),
          items: [
            {
              id: 'flip',
              right: true,
              label: L('Teskari qilindi', 'Перевернули', 'It was flipped'),
            },
            {
              id: 'cut',
              label: L('Qisqartirildi', 'Сократили', 'It was reduced'),
              hint: L(
                "Qisqartirish keyin bo'ldi. Avval surat va maxraj joyini almashtirdi.",
                'Сокращение было потом. Сначала числитель и знаменатель поменялись местами.',
                'The reducing came later. First the numerator and denominator swapped.',
              ),
            },
            {
              id: 'mul',
              label: L("Ikkiga ko'paytirildi", 'Умножили на два', 'It was multiplied by two'),
              hint: L(
                "Ikkilik javobda paydo bo'ldi, yozuvda esa olti va uch turibdi.",
                'Двойка появилась в ответе, а в записи стоят шесть и три.',
                'The two appeared in the answer, while the record holds six and three.',
              ),
            },
          ],
          after: L(
            "Bo'lish ko'paytirishga aylandi",
            'Деление стало умножением',
            'The division became a multiplication',
          ),
        },
      },
      {
        text: L(
          "Bo'linma ikkiga teng, lekin iks nol emas",
          'Частное равно двум, но икс не нуль',
          'The quotient equals two, but x is not zero',
        ),
        tone: 'ok',
      },
    ],
  },
}

// ============================================================
// EKRAN 7. CHEGARA. Bo'linmaning UCHTA taqiqi bor, javob to'plam.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L(
    "Bo'linma qayerda yo'q",
    'Где частного нет',
    'Where the quotient does not exist',
  ),
  audio: [
    A('mount',
      "Chapda bo'linma, o'ngda ikkilik. Ular teng, lekin hamma joyda emas.",
      'Слева частное, справа двойка. Они равны, но не везде.',
      'On the left a quotient, on the right a two. They are equal, but not everywhere.'),
    A('why',
      "Maxrajlarga ham, bo'luvchining suratiga ham qarang.",
      'Смотри и на знаменатели, и на числитель делителя.',
      'Look at the denominators and at the numerator of the divisor.'),
  ],
  props: {
    left: (
      <Row size="row" align="center">
        {F('x + 1', 'x')}
        {'  :  '}
        {F('x + 1', '2x')}
      </Row>
    ),
    right: (
      <Row size="row" align="center">
        {'2'}
      </Row>
    ),
    odzLeft: L('?', '?', '?'),
    odzRight: L('har qanday x', 'любое x', 'any x'),
    question: L(
      "Chap yozuv hisoblanmaydigan hamma qiymatni yozing",
      'Запиши все значения, при которых левая запись не считается',
      'Write every value at which the left record does not compute',
    ),
    answer: [-1, 0],
    hints: {
      '0': L(
        "Bittasi to'g'ri. Bo'luvchining surati ham nolga aylanadi, uni ham yozing.",
        'Одно верно. Числитель делителя тоже обращается в нуль, запиши и его.',
        'One is right. The numerator of the divisor also becomes zero, write it too.',
      ),
      '-1': L(
        "Bittasi to'g'ri. Maxrajlarda iks turibdi, u ham nolga aylanadi.",
        'Одно верно. В знаменателях стоит икс, он тоже обращается в нуль.',
        'One is right. The denominators hold x and it becomes zero too.',
      ),
      '1': L(
        "Bittada maxrajlar bir va ikkiga teng, bo'luvchi esa ikkiga. Hammasi hisoblanadi.",
        'При единице знаменатели равны одному и двум, а делитель двум. Всё считается.',
        'At one the denominators equal one and two, and the divisor equals two. Everything computes.',
      ),
      '*': L(
        "Ikki maxraj va bo'luvchining surati, uchta joyga qarang.",
        'Два знаменателя и числитель делителя: смотри в три места.',
        'Two denominators and the numerator of the divisor: look in three places.',
      ),
    },
    note: L(
      "Bo'lishda taqiq maxrajdan ham, bo'luvchidan ham keladi",
      'При делении запрет приходит и от знаменателя, и от делителя',
      'In division the restriction comes from the denominator and from the divisor',
    ),
  },
}

// ============================================================
// EKRAN 8. QOIDA. Darslik 5-§, 27-bet.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    "Ko'paytirish va bo'lish qoidasi",
    'Правило умножения и деления',
    'The rule for multiplying and dividing',
  ),
  audio: [
    A('mount',
      "Qoidani o'zingiz yig'asiz, keyin darslik matni ochiladi.",
      'Правило соберёшь сам, потом откроется текст учебника.',
      'You will assemble the rule yourself, then the textbook text opens.'),
    W('card',
      "Birinchi ekrandagi javob to'g'ri, lekin bitta shart bilan.",
      'Ответ с первого экрана верен, но с одним условием.',
      'The answer from the first screen is right, but with one condition.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("Ko'paytirishda", 'При умножении', 'When multiplying') },
      { id: 'f2', label: L('surat suratga, maxraj maxrajga', 'числитель к числителю, знаменатель к знаменателю', 'numerator to numerator, denominator to denominator') },
      { id: 'f3', label: L("bo'lishda esa", 'а при делении', 'and when dividing') },
      { id: 'f4', label: L("bo'luvchi teskari qilinadi", 'делитель переворачивают', 'the divisor is flipped') },
      { id: 'w1', label: L('umumiy maxraj kerak', 'нужен общий знаменатель', 'a common denominator is needed') },
      { id: 'w2', label: L("bo'linuvchi teskari qilinadi", 'переворачивают делимое', 'the dividend is flipped') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilganda qoida buziladi. Qaysi kasr teskari qilinishini tekshiring.",
      'В такой сборке правило ломается. Проверь, какую дробь переворачивают.',
      'Assembled this way the rule breaks. Check which fraction gets flipped.',
    ),
    card: {
      title: L("KO'PAYTIRISH VA BO'LISH", 'УМНОЖЕНИЕ И ДЕЛЕНИЕ', 'MULTIPLICATION AND DIVISION'),
      lines: [
        L('a/b · c/d = ac/(bd),   a/b : c/d = ad/(bc)', 'a/b · c/d = ac/(bd),   a/b : c/d = ad/(bc)', 'a/b · c/d = ac/(bd),   a/b : c/d = ad/(bc)'),
        L(
          "Umumiy maxraj kerak emas",
          'Общий знаменатель не нужен',
          'No common denominator is needed',
        ),
        L(
          "Bo'lishda bo'luvchining surati ham nol bo'lmaydi",
          'При делении числитель делителя тоже не нуль',
          'When dividing, the numerator of the divisor is not zero either',
        ),
      ],
      source: L('Darslik, 5-§, 27-bet', 'Учебник, § 5, стр. 27', 'Textbook, section 5, page 27'),
      locked: L("Qoida yig'ilgandan keyin ochiladi", 'Откроется после сборки правила', 'Opens once the rule is assembled'),
    },
    recall: {
      left: L('x/3 : x/6', 'x/3 : x/6', 'x/3 : x/6'),
      right: L('2,  x ≠ 0', '2,  x ≠ 0', '2,  x ≠ 0'),
      winner: 'right',
      note: L(
        "Javob ikki, lekin nolda bo'linma yo'q",
        'Ответ два, но при нуле частного нет',
        'The answer is two, but at zero there is no quotient',
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
    "Ko'paytiring va bo'ling",
    'Умножай и дели',
    'Multiply and divide',
  ),
  audio: [
    A('mount',
      "To'rt topshiriq. Oxirgisi shartlar haqida.",
      'Четыре задания. Последнее про условия.',
      'Four tasks. The last one is about conditions.'),
    W('t1',
      "Iks qisqardi, javob son bo'lib qoldi.",
      'Икс сократился, ответ остался числом.',
      'The x reduced away and the answer stayed a number.'),
    W('t2',
      "Bo'luvchi teskari qilinganda iks yana qisqaradi.",
      'Когда делитель перевёрнут, икс снова сокращается.',
      'With the divisor flipped, the x reduces again.'),
    W('t3',
      "Teskari kasrda surat va maxraj joy almashadi.",
      'В обратной дроби числитель и знаменатель меняются местами.',
      'In the reciprocal the numerator and denominator swap places.'),
    W('t4',
      "Bo'lishda uchta joyga qaraladi.",
      'При делении смотрят в три места.',
      'When dividing you look in three places.'),
  ],
  props: {
    items: [
      {
        prompt: L(
          "Ko'paytmani yozing",
          'Запиши произведение',
          'Write the product',
        ),
        show: (
          <Row size="row" align="center">
            {F('3', 'a')}
            {' · '}
            {F('a', '5')}
          </Row>
        ),
        kind: 'expr',
        answer: '3/5',
        accepts: ['6/10'],
        hints: {
          '3a/(5a)': L(
            "Qisqartirish qolib ketdi. a surat va maxrajda ham bor.",
            'Сокращение не доведено: a есть и сверху, и снизу.',
            'The reducing is unfinished: a is both above and below.',
          ),
          '5/3': L(
            "Surat suratga ketadi. Uchlik yuqorida edi.",
            'Числитель идёт в числитель. Тройка была сверху.',
            'A numerator goes to the numerator. The three was above.',
          ),
          '3/(5a)': L(
            "Suratdagi a maxrajdagi a bilan qisqaradi.",
            'Буква a сверху сокращается с a снизу.',
            'The a above reduces with the a below.',
          ),
        },
        closed: L('3/a · a/5 = 3/5', '3/a · a/5 = 3/5', '3/a · a/5 = 3/5'),
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
            {F('4', 'x')}
          </Row>
        ),
        kind: 'expr',
        answer: '1/2',
        accepts: ['2/4'],
        hints: {
          '(2*x)/(x*4)': L(
            "Iks qisqarishi kerak, u ikkala qismda ham bor.",
            'Икс надо сократить, он есть в обеих частях.',
            'The x must be reduced away, it is in both parts.',
          ),
          '2': L(
            "Ikki to'rtdan kichik, demak javob birdan kichik.",
            'Два меньше четырёх, значит ответ меньше единицы.',
            'Two is less than four, so the answer is less than one.',
          ),
          '8/(x*x)': L(
            "Bu ko'paytirish bo'ldi. Bo'luvchi teskari qilinadi.",
            'Это умножение. Делитель надо перевернуть.',
            'That is multiplication. The divisor must be flipped.',
          ),
        },
        closed: L('2/x : 4/x = 1/2', '2/x : 4/x = 1/2', '2/x : 4/x = 1/2'),
      },
      {
        prompt: L(
          'Teskari kasrni yozing',
          'Запиши обратную дробь',
          'Write the reciprocal fraction',
        ),
        show: (
          <Row size="row" align="center">
            {F('a − 1', '3')}
          </Row>
        ),
        kind: 'expr',
        answer: '3/(a-1)',
        accepts: ['3/(-1+a)'],
        hints: {
          '(a-1)/3': L(
            "Bu o'sha kasr, joylar almashmagan.",
            'Это та же дробь, места не поменялись.',
            'That is the same fraction, nothing swapped.',
          ),
          '3/(a+1)': L(
            "Belgiga qarang, suratda a minus bir edi.",
            'Посмотри на знак: в числителе было a минус один.',
            'Look at the sign: the numerator held a minus one.',
          ),
        },
        closed: L('teskarisi 3/(a − 1)', 'обратная 3/(a − 1)', 'the reciprocal is 3/(a − 1)'),
      },
      {
        prompt: L(
          "Bo'linmaning shartlarini yozing",
          'Запиши условия частного',
          'Write the conditions of the quotient',
        ),
        show: (
          <Row size="row" align="center">
            {F('5', 'x')}
            {'  :  '}
            {F('2', 'x − 3')}
          </Row>
        ),
        kind: 'odz',
        varName: 'x',
        excluded: [0, 3],
        accepts: ['x != 0, x != 3', 'x(x-3) != 0'],
        hints: {
          'x != 0': L(
            "Ikkinchi maxraj x minus uch, u ham nolga aylanadi.",
            'Второй знаменатель это x минус три, он тоже обращается в нуль.',
            'The second denominator is x minus three and it becomes zero too.',
          ),
          'x != 3': L(
            "Birinchi maxraj iks, u nolda nolga aylanadi.",
            'Первый знаменатель это икс, он обращается в нуль при нуле.',
            'The first denominator is x and it becomes zero at zero.',
          ),
        },
        closed: L('x ≠ 0, x ≠ 3', 'x ≠ 0, x ≠ 3', 'x ≠ 0, x ≠ 3'),
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ, QADAMLAR NOMLANGAN. Ko'paytirish, oldin qisqartirish.
// ============================================================
const S10 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    'Qisqartirib, keyin ko\'paytirish',
    'Сначала сократить, потом умножить',
    'Reduce first, then multiply',
  ),
  audio: [
    A('mount',
      "Uch qadam nomlangan. Ko'paytirishdan oldin bir xil ko'paytuvchi qidiriladi.",
      'Три шага названы. До умножения ищут одинаковый множитель.',
      'Three steps are named. Before multiplying we look for the identical factor.'),
    W('f1',
      "Suratdagi kvadratlar ayirmasi ajratildi va bir xil qavs ko'rindi.",
      'Разность квадратов в числителе разложена, и одинаковая скобка стала видна.',
      'The difference of squares was factored and the identical bracket appeared.'),
    W('f2',
      "Qavs va a qisqardi. Ikkilik esa to'rt bo'lib ikkiga bo'lindi.",
      'Скобка и a сократились, а четвёрка разделилась на двойку.',
      'The bracket and the a reduced away, and the four divided by the two.'),
    W('f3',
      "Ikki maxraj ikki shart berdi.",
      'Два знаменателя дали два условия.',
      'Two denominators gave two conditions.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {F('a · a − 9', '2a')}
        {' · '}
        {F('4a', 'a + 3')}
      </Row>
    ),
    fields: [
      {
        ask: L(
          "Qaysi ko'paytuvchi bir xil?",
          'Какой множитель одинаковый?',
          'Which factor is identical?',
        ),
        kind: 'expr',
        answer: 'a+3',
        accepts: ['3+a'],
        hints: {
          'a-3': L(
            "Ikkinchi kasrning maxrajida a plyus uch turibdi.",
            'В знаменателе второй дроби стоит a плюс три.',
            'The denominator of the second fraction holds a plus three.',
          ),
          '2a': L(
            "Ikkilik va a alohida qisqaradi, lekin savol qavs haqida.",
            'Двойка и a сокращаются отдельно, но вопрос про скобку.',
            'The two and the a reduce separately, but the question is about the bracket.',
          ),
        },
      },
      {
        ask: L(
          "Ko'paytmani yozing",
          'Запиши произведение',
          'Write the product',
        ),
        kind: 'expr',
        answer: '2(a-3)',
        accepts: ['2a-6'],
        hints: {
          '2(a+3)': L(
            "Qisqargan qavs ketadi, qolgani a minus uch.",
            'Сокращённая скобка уходит, остаётся a минус три.',
            'The reduced bracket leaves and a minus three stays.',
          ),
          '4(a-3)': L(
            "To'rtlik ikkiga bo'linadi, chunki maxrajda 2a bor.",
            'Четвёрка делится на два, ведь в знаменателе 2a.',
            'The four divides by two because the denominator holds 2a.',
          ),
          'a-3': L(
            "To'rtni ikkiga bo'lsak ikki chiqadi, u ko'paytuvchi bo'lib qoladi.",
            'Четыре разделить на два это два, и двойка остаётся множителем.',
            'Four divided by two is two, and the two stays as a factor.',
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
        varName: 'a',
        excluded: [-3, 0],
        accepts: ['a != 0, a != -3', 'a(a+3) != 0'],
        hints: {
          'a != 0': L(
            "Ikkinchi maxraj a plyus uch, u minus uchda nolga aylanadi.",
            'Второй знаменатель a плюс три, он обращается в нуль при минус трёх.',
            'The second denominator is a plus three and it becomes zero at minus three.',
          ),
          'a != -3': L(
            "Birinchi maxraj 2a, u nolda nolga aylanadi.",
            'Первый знаменатель 2a, он обращается в нуль при нуле.',
            'The first denominator is 2a and it becomes zero at zero.',
          ),
        },
      },
    ],
  },
}

// ============================================================
// EKRAN 11. ASBOBSIZ. Bo'lish, uchta shart va o'z soni (З16).
// ============================================================
const S11 = {
  eyebrow: L('MUSTAQIL', 'САМ', 'ON YOUR OWN'),
  title: L(
    "Bo'lish yordamsiz",
    'Деление без подсказки',
    'Division without help',
  ),
  audio: [
    A('mount',
      "Bu ekranda asbob yo'q. Bo'lish, javob va shartlar o'zingizdan.",
      'На этом экране прибора нет. Деление, ответ и условия сам.',
      'There is no instrument here. The division, the answer and the conditions are yours.'),
    A('why',
      "Shartlar uchta bo'ladi, bo'luvchining suratini unutmang.",
      'Условий будет три, не забудь про числитель делителя.',
      'There will be three conditions; do not forget the numerator of the divisor.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {F('x', 'x − 2')}
        {'  :  '}
        {F('x', 'x + 2')}
      </Row>
    ),
    result: {
      ask: L(
        "Bo'linmani yozing",
        'Запиши частное',
        'Write the quotient',
      ),
      kind: 'expr',
      answer: '(x+2)/(x-2)',
      accepts: ['(-x-2)/(2-x)'],
      hints: {
        '(x-2)/(x+2)': L(
          "Bo'luvchi teskari qilinadi, demak x plyus ikki yuqoriga chiqadi.",
          'Делитель переворачивают, значит x плюс два уходит наверх.',
          'The divisor is flipped, so x plus two goes up.',
        ),
        '(x*x)/((x-2)(x+2))': L(
          "Bu bo'luvchiga ko'paytirish bo'ldi, teskarisiga emas.",
          'Это умножение на делитель, а не на обратную дробь.',
          'That is multiplying by the divisor, not by the reciprocal.',
        ),
      },
    },
    odz: {
      ask: L(
        'Uchta shartni yozing',
        'Запиши три условия',
        'Write the three conditions',
      ),
      varName: 'x',
      excluded: [-2, 0, 2],
      accepts: ['x != 2, x != -2, x != 0', 'x(x*x-4) != 0'],
      hints: {
        'x != 2, x != -2': L(
          "Bo'luvchining surati iks. U ham nolga aylanmasligi kerak.",
          'Числитель делителя это икс. Он тоже не должен обращаться в нуль.',
          'The numerator of the divisor is x. It must not become zero either.',
        ),
        'x != 2': L(
          "Ikkinchi maxraj x plyus ikki ham nolga aylanadi, va bo'luvchining surati ham.",
          'Второй знаменатель x плюс два тоже обращается в нуль, и числитель делителя тоже.',
          'The second denominator also becomes zero, and so does the numerator of the divisor.',
        ),
      },
    },
    proof: {
      varName: 'x',
      from: '(x/(x-2))/(x/(x+2))',
      to: '(x+2)/(x-2)',
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
        "Bu qiymatda bo'linma yo'q. Boshqa son oling.",
        'При этом значении частного нет. Возьми другое число.',
        'At this value there is no quotient. Take another number.',
      ),
    },
    note: L(
      'Qiymatlar mos keldi, uchala shart ham joyida',
      'Значения совпали, и все три условия на месте',
      'The values matched and all three conditions are in place',
    ),
  },
}

// ============================================================
// EKRAN 12. TUZOQ (З2). Uchinchi shart tushib qolgan, qolgan satrlar
// esa to'g'ri.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    'Uchinchi shart qani',
    'Где третье условие',
    'Where is the third condition',
  ),
  audio: [
    A('mount',
      "Boshqa odamning yechimi. Birinchi noto'g'ri satrni toping.",
      'Чужое решение. Найди первую неверную строку.',
      "Someone else's solution. Find the first incorrect line."),
    W('proof',
      "Endi son bilan ko'rsating. Teskari kasr qaysi qiymatda yo'q?",
      'Теперь покажи числом. При каком значении обратной дроби нет?',
      'Now show it with a number. At which value does the reciprocal not exist?'),
  ],
  props: {
    rows: [
      {
        id: 'r1',
        show: L(
          "Bo'luvchini teskari qilamiz",
          'Переворачиваем делитель',
          'We flip the divisor',
        ),
      },
      {
        id: 'r2',
        show: L(
          "Ko'paytiramiz va qisqartiramiz, ikki chiqadi",
          'Умножаем и сокращаем, выходит два',
          'We multiply and reduce, it gives two',
        ),
      },
      {
        id: 'r3',
        show: L(
          "Shart bitta, x nolga teng emas",
          'Условие одно: x не равен нулю',
          'One condition: x is not zero',
        ),
      },
      {
        id: 'r4',
        show: L(
          'Javob 2',
          'Ответ 2',
          'The answer is 2',
        ),
      },
    ],
    answerId: 'r3',
    hints: {
      'r1': L(
        "Bu satr to'g'ri, bo'lish shunday bajariladi.",
        'Эта строка верна, деление так и выполняется.',
        'This line is correct, that is how division is done.',
      ),
      'r2': L(
        "Bu ham to'g'ri, qavslar va iks qisqaradi.",
        'И это верно: скобки и икс сокращаются.',
        'This is correct too: the brackets and the x reduce away.',
      ),
      'r4': L(
        "Javobning o'zi to'g'ri. Xato shartlar satrida.",
        'Сам ответ верен. Ошибка в строке про условия.',
        'The answer itself is right. The error is in the line about conditions.',
      ),
    },
    ask: {
      label: L("Son qo'ying", 'Поставь число', 'Put in a number'),
      of: '2x/(x+1)',
      varName: 'x',
      wrong: L(
        "Bu qiymatda teskari kasr bor. Uning maxraji qaysi sonda nolga aylanadi?",
        'При этом значении обратная дробь есть. При каком числе её знаменатель обращается в нуль?',
        'At this value the reciprocal exists. At which number does its denominator become zero?',
      ),
      note: L(
        "Minus birda bo'luvchining surati nolga aylanadi, ya'ni nolga bo'lish chiqadi. Ikkinchi shart shu.",
        'При минус одном числитель делителя обращается в нуль, то есть выходит деление на нуль. Вот второе условие.',
        'At minus one the numerator of the divisor becomes zero, which means division by zero. That is the second condition.',
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
    "Ikkiga teng ko'paytma",
    'Произведение, равное двум',
    'A product equal to two',
  ),
  audio: [
    A('mount',
      "Endi teskarisi. Javob va shartlar berilgan, yozuvni o'zingiz tuzasiz.",
      'Теперь наоборот. Ответ и условия даны, запись составишь сам.',
      'Now the other way round. The answer and the conditions are given, you build the record.'),
    A('why',
      "Ikki shart ikki maxrajdan keladi. Ko'paytma ikkiga teng bo'lishi kerak.",
      'Два условия приходят от двух знаменателей. Произведение должно равняться двум.',
      'Two conditions come from two denominators. The product must equal two.'),
  ],
  props: {
    prompt: L(
      "Ikkiga teng ko'paytma yozing, uning shartlari x ≠ 0 va x ≠ −1 bo'lsin",
      'Запиши произведение, равное двум, с условиями x ≠ 0 и x ≠ −1',
      'Write a product equal to two whose conditions are x ≠ 0 and x ≠ −1',
    ),
    reduceTo: '2',
    excluded: [-1, 0],
    varName: 'x',
    hints: {
      '(2x)/(x+1)': L(
        "Bu bitta kasr va u ikkiga teng emas. Ko'paytma kerak.",
        'Это одна дробь, и она не равна двум. Нужно произведение.',
        'That is a single fraction and it does not equal two. A product is needed.',
      ),
      '2': L(
        "Ikkilikning o'zida hech qanday shart yo'q.",
        'У самой двойки никаких условий нет.',
        'The two by itself has no conditions at all.',
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
// EKRAN 14. BLITS.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Ko'paytirish belgilari",
    'Признаки умножения',
    'The marks of multiplication',
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
          "Ko'paytirishda umumiy maxraj kerakmi?",
          'Нужен ли общий знаменатель при умножении?',
          'Is a common denominator needed for multiplication?',
        ),
        options: [
          { id: 'no', right: true, label: L('Kerak emas', 'Не нужен', 'Not needed') },
          { id: 'yes', label: L('Kerak', 'Нужен', 'Needed') },
          { id: 'let', label: L('Faqat harflarda', 'Только с буквами', 'Only with letters') },
          { id: 'big', label: L('Faqat katta sonlarda', 'Только при больших числах', 'Only for big numbers') },
        ],
        hint: L(
          "Umumiy maxraj qo'shishning ishi. Ko'paytirishda maxrajlar shunchaki ko'paytiriladi.",
          'Общий знаменатель это работа сложения. При умножении знаменатели просто умножаются.',
          'A common denominator is the business of addition. In multiplication the denominators just multiply.',
        ),
        ok: L(
          "Maxrajlar ko'paytiriladi, keltirish kerak emas.",
          'Знаменатели перемножаются, приводить не нужно.',
          'The denominators multiply and no bringing is needed.',
        ),
      },
      {
        id: 'q2',
        tag: 'З26',
        ask: L(
          "a/b : c/d nimaga teng?",
          'Чему равно a/b : c/d?',
          'What does a/b : c/d equal?',
        ),
        options: [
          { id: 'ok', right: true, label: L('ad/(bc)', 'ad/(bc)', 'ad/(bc)') },
          { id: 'mul', label: L('ac/(bd)', 'ac/(bd)', 'ac/(bd)') },
          { id: 'flip1', label: L('bc/(ad)', 'bc/(ad)', 'bc/(ad)') },
          { id: 'add', label: L('(a + c)/(b + d)', '(a + c)/(b + d)', '(a + c)/(b + d)') },
        ],
        hint: L(
          "Teskari qilinadigan narsa bo'luvchi. Uning surati pastga tushadi.",
          'Переворачивают делитель. Его числитель уходит вниз.',
          'The divisor gets flipped. Its numerator goes down.',
        ),
        ok: L(
          "Bo'luvchi teskari bo'ldi, shuning uchun d yuqorida, c esa pastda.",
          'Делитель перевёрнут, поэтому d сверху, а c снизу.',
          'The divisor is flipped, so d is above and c is below.',
        ),
      },
      {
        id: 'q3',
        tag: 'З2',
        ask: L(
          "5/x : 3/(x − 1) da nechta shart bor?",
          'Сколько условий у 5/x : 3/(x − 1)?',
          'How many conditions does 5/x : 3/(x − 1) have?',
        ),
        options: [
          { id: 'two', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'one', label: L('Bitta', 'Одно', 'One') },
          { id: 'three', label: L('Uchta', 'Три', 'Three') },
          { id: 'none', label: L("Yo'q", 'Ни одного', 'None') },
        ],
        hint: L(
          "Ikki maxrajga qarang, keyin bo'luvchining suratiga. Uchlik nolga aylanadimi?",
          'Посмотри на два знаменателя, потом на числитель делителя. Обращается ли тройка в нуль?',
          'Look at the two denominators, then at the numerator of the divisor. Can a three be zero?',
        ),
        ok: L(
          "Maxrajlar ikki shart beradi, bo'luvchining surati esa uchlik va u nolga aylanmaydi.",
          'Знаменатели дают два условия, а числитель делителя это тройка, и она в нуль не обращается.',
          'The denominators give two conditions, and the numerator of the divisor is a three, which never becomes zero.',
        ),
      },
      {
        id: 'q4',
        tag: 'З16',
        ask: L(
          "Bo'lishni qanday tekshirasiz?",
          'Как проверить деление?',
          'How do you check a division?',
        ),
        options: [
          { id: 'sub', right: true, label: L("Ikki yozuvga son qo'yib", 'Подставить число в обе записи', 'Substitute a number into both records') },
          { id: 'short', label: L('Yozuv qisqarganiga qarab', 'По тому, что запись короче', 'By the record being shorter') },
          { id: 'flip', label: L('Kasr teskari bo\'lganiga qarab', 'По тому, что дробь перевёрнута', 'By the fraction being flipped') },
          { id: 'sign', label: L("Belgi o'zgarganiga qarab", 'По тому, что знак изменился', 'By the sign having changed') },
        ],
        hint: L(
          "Yozuvning ko'rinishi kafolat bermaydi. Sonni qo'yib ko'rish kerak.",
          'Вид записи гарантии не даёт. Надо подставить число.',
          'The look of a record gives no guarantee. A number must be put in.',
        ),
        ok: L(
          "Bitta son xatoni topadi. Faqat taqiqlangan qiymatni olmaslik kerak.",
          'Одно число находит ошибку. Только нельзя брать запрещённое значение.',
          'One number finds the error. Just do not take a forbidden value.',
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
    "Bo'linma va uchta shart",
    'Частное и три условия',
    'A quotient and three conditions',
  ),
  audio: [
    A('s0',
      "Xukdagi javob to'g'ri, lekin iks nolga teng bo'lmaganda.",
      'Ответ с хука верен, но при иксе, не равном нулю.',
      'The answer from the hook is right, but only when x is not zero.'),
    A('s1',
      "Uch usul qoldi. Ko'paytirish, bo'lish va uchinchi shart.",
      'Остаются три способа. Умножение, деление и третье условие.',
      'Three methods remain. Multiplication, division and the third condition.'),
    A('s2',
      "Keyingi darsda ratsional ifodalarni almashtirish. U yerda to'rt amal birga ishlaydi.",
      'В следующем уроке преобразование рациональных выражений. Там все четыре действия работают вместе.',
      'The next lesson transforms rational expressions. There all four operations work together.'),
  ],
  props: {
    predictedLabel: L('Taxmin', 'Прогноз', 'Prediction'),
    proved: L(
      "Javob ikki, lekin x nolga teng emas",
      'Ответ два, но x не равен нулю',
      'The answer is two, but x is not zero',
    ),
    canLabel: L('Endi nima qila olasiz', 'Что теперь умеешь', 'What you can do now'),
    can: [
      L(
        "Kasrlarni ko'paytirish va oldin qisqartirish",
        'Умножать дроби, сокращая заранее',
        'Multiply fractions, reducing in advance',
      ),
      L(
        "Bo'lishni teskari kasrga ko'paytirish bilan almashtirish",
        'Заменять деление умножением на обратную',
        'Replace division by multiplication by the reciprocal',
      ),
      L(
        "Bo'lishda uchinchi shartni ko'rish",
        'Видеть третье условие при делении',
        'See the third condition when dividing',
      ),
    ],
    proofNote: L(
      "Fakt. Kompyuter bo'lishni ham ko'paytirishga aylantiradi, chunki bo'lish amali eng sekin ishlaydi. Teskari sonni bir marta hisoblab, keyin uni ko'paytiradi, va bu xuddi bugungi qoida.",
      'Факт. Компьютер тоже превращает деление в умножение, потому что деление самая медленная операция. Он один раз считает обратное число, а потом умножает, и это ровно сегодняшнее правило.',
      'A fact. A computer also turns division into multiplication because division is the slowest operation. It computes the reciprocal once and then multiplies, which is exactly today rule.',
    ),
    bridge: L(
      "Keyingi dars, ifodalarni almashtirish, to'rt amalni birga oladi",
      'Следующий урок, преобразование выражений, берёт все четыре действия вместе',
      'The next lesson, transforming expressions, takes all four operations at once',
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
  { role: 'explain', tool: 'transform', kind: 'method1', tag: 'З15', method: M_MUL, ...S4 },
  { role: 'explain', tool: 'transform', kind: 'method2', tag: 'З2', method: M_DIV, ...S5 },
  { role: 'explain', tool: 'solve', kind: 'together', tag: 'З26', ...S6 },
  { role: 'explain', tool: 'boundary', kind: 'boundary', tag: 'З2', ...S7 },
  { role: 'rule', tool: 'rulebuild', tag: 'З26', ...S8 },
  { role: 'practice', tool: 'chain', kind: 'drill', tag: 'З26', method: M_DIV, ...S9 },
  { role: 'practice', tool: 'fields', kind: 'guided', tag: 'З15', method: M_MUL, ...S10 },
  { role: 'practice', tool: 'solo', kind: 'solo', tag: 'З16', method: M_THREE, ...S11 },
  { role: 'practice', tool: 'audit', kind: 'audit', tag: 'З2', method: M_THREE, ...S12 },
  { role: 'transfer', tool: 'inverse', kind: 'inverse', tag: 'З2', method: M_THREE, ...S13 },
  { role: 'blitz', tool: 'blitz', ...S14 },
  { role: 'summary', tool: 'summary', scene: FinalScene, ...S15 },
]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
