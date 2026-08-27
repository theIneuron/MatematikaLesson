// ============================================================================
// 8-sinf, Dars 3. RATSIONAL KASRLARNI QISQARTIRISH.
//
// Bu fayl — FAQAT MA'LUMOT (ETALON_8SINF.md §2). Mexanika `tools.jsx` da,
// o'ram `screens.jsx` da, javob tekshiruvi `mathcore.js` da.
//
// BLOK 1 KONVEYERI (metodist qarori 2026-08-20): 3, 4, 5, 6-darslar bitta
// skeletda yig'iladi — 15 rol, har rolda bitta asbob, ovoz hodisalari va
// ma'lumot shakli BIR XIL. Darsdan darsga o'zgaradigan narsa: matematika,
// adashishlar va razborlar, ikki sahna, usullar, uch tildagi matn va ovoz.
// Obvyazka ko'chirilmaydi, u qatlamda.
//
// 2-DARS DAVOMI. U yerda ko'paytuvchi KELDI va shart QO'SHILDI. Bu yerda
// teskarisi: ko'paytuvchi KETADI, shart esa QOLADI — ruhsat etilgan
// qiymatlarni BOSHLANG'ICH kasr belgilaydi.
//
// DARSLIK. O'zbek darsligi, 2-§, 14-bet: «Kasrlarni qisqartirish uchun bu
// kasrlarning surat va maxrajini ularning umumiy ko'paytuvchisiga bo'lish
// kerak.» Ko'paytuvchilarga ajratish misollari — o'sha betda.
//
// ADASHISHLAR HAMMASI TASDIQLANGAN RO'YXATDAN (§11): З1, З2, З15, З16.
// Yangi teg yo'q.
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
  id: 'alg-8-03',
  n: 3,
  row: 3,
  block: 'Б1',
  topic: L(
    'Ratsional kasrlarni qisqartirish',
    'Сокращение рациональных дробей',
    'Reducing rational fractions',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Qisqartirish faqat umumiy KO'PAYTUVCHI bo'yicha bo'ladi, yig'indi avval ko'paytuvchilarga ajratiladi",
    'Сокращают только на общий МНОЖИТЕЛЬ, сумму сначала разлагают на множители',
    'Reduce only by a common FACTOR: a sum must be factored first',
  ),
  L(
    "Qisqartirish ruhsat etilgan qiymatlarni o'zgartirmaydi, ularni boshlang'ich kasr belgilaydi",
    'Сокращение не меняет допустимые значения: их задаёт исходная дробь',
    'Reducing does not change the admissible values: the original fraction sets them',
  ),
  L(
    "Son qo'yish RAD ETADI, lekin ISBOTLAMAYDI, isbot esa almashtirishning o'zi",
    'Подстановка числа опровергает, но не доказывает; доказательство — само преобразование',
    'Substituting a number refutes but never proves; the transformation itself is the proof',
  ),
]

// Adashishlar — HAMMASI §11 ro'yxatidan, yangi teg yo'q. `at` — kontrprimer soni.
export const MISS = {
  'З1': {
    what: L(
      "had bo'yicha qisqartirildi, ko'paytuvchi bo'yicha emas",
      'сокращение по слагаемому, а не по множителю',
      'reduced by a term instead of by a factor',
    ),
    wrong: '(a+3)/3',
    at: 3,
  },
  'З2': {
    what: L(
      "qisqartirishda ruhsat etilgan qiymatlar yo'qoldi",
      'при сокращении потеряны допустимые значения',
      'the admissible values were lost while reducing',
    ),
    wrong: '(a*a-4)/(a-2)',
    at: 2,
  },
  'З15': {
    what: L(
      "ko'paytuvchilarga ajratishdan OLDIN qisqartirildi",
      'сократили до разложения на множители',
      'reduced before factoring',
    ),
    wrong: '(a*a-9)/(3a-9)',
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
}

// ============================================================
// USULLAR (§4). Nomi qisqa: 390 da lenta sarlavhasi razryadka bilan
// terilgan va uzun nom uch satr egallaydi (2-darsda o'lchandi).
// ============================================================
const M_FACTOR = {
  name: L(
    "1-USUL. Umumiy ko'paytuvchi",
    'СПОСОБ 1. Общий множитель',
    'METHOD 1. The common factor',
  ),
  steps: [
    L("Umumiy ko'paytuvchini ajratib oling", 'Вынеси общий множитель', 'Take out the common factor'),
    L("Surat va maxrajni unga bo'ling", 'Раздели на него верх и низ', 'Divide top and bottom by it'),
    L("Shart boshlang'ich kasrdan", 'Условие из исходной дроби', 'The condition from the original'),
  ],
}

const M_SQUARES = {
  name: L(
    '2-USUL. Kvadratlar ayirmasi',
    'СПОСОБ 2. Разность квадратов',
    'METHOD 2. Difference of squares',
  ),
  steps: [
    L("Ayirmani ko'paytmaga aylantiring", 'Разность превратите в произведение', 'Turn the difference into a product'),
    L("Bir xil ko'paytuvchini toping", 'Найди одинаковый множитель', 'Find the identical factor'),
    L("Unga bo'ling va shartni saqlang", 'Раздели на него, условие сохрани', 'Divide by it and keep the condition'),
  ],
}

const M_CHECK = {
  name: L(
    '3-USUL. Son bilan tekshirish',
    'СПОСОБ 3. Проверка числом',
    'METHOD 3. Check with a number',
  ),
  steps: [
    L("Ikki yozuvga bitta sonni qo'ying", 'Поставь одно число в обе записи', 'Put one number into both records'),
    L("Qiymatlar ajralsa, xato topildi", 'Значения разошлись — ошибка найдена', 'Values differ, the error is found'),
    L("Mos kelsa, bu hali isbot emas", 'Совпали — это ещё не доказательство', 'They matched, and that is not a proof yet'),
  ],
}

// ============================================================
// SAHNALAR (§6). Xuk savol beradi, yakun O'SHA obyektda javobni ko'rsatadi.
// Harakat qatlamdan: `g8-draw` chiziq chiziladi, `g8-fly` obyekt keladi,
// `g8-seat` natija o'tiradi.
// ============================================================
const SC_ODZ = L('RUHSAT ETILGAN QIYMATLAR', 'ДОПУСТИМЫЕ ЗНАЧЕНИЯ', 'ADMISSIBLE VALUES')

// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Kasr va qisqartirilgan yozuv",
      'Дробь и сокращённая запись',
      'A fraction and its reduced form',
    )}>
      {/* CHAP: boshlang'ich kasr, u berilgan. */}
      <text x="96" y="62" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21" fill={T.ink}>{'a · a − 4'}</text>
      <line x1="40" y1="74" x2="152" y2="74" stroke={T.ink} strokeWidth="2.4"/>
      <text x="96" y="102" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21" fill={T.ink}>{'a − 2'}</text>

      {/* O'NG: qisqartirilgandan keyingi yozuv KELADI. */}
      <g className="g8-fly" style={{ '--d': '2900ms' }}>
        <text x="306" y="84" textAnchor="middle" fontFamily={MATH_FONT} fontSize="23"
          fill={T.accent}>{'a + 2'}</text>
      </g>

      {/* SAVOL BELGISI oxirida o'tiradi. */}
      <g className="g8-seat" style={{ '--d': '3400ms' }}>
        <circle cx="212" cy="82" r="17" fill={T.graphSoft} stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="212" y="89" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      {/* Chiziq CHIZILADI: pastda ruhsat etilgan qiymatlar uchun bo'sh joy. */}
      <line x1="132" y1="142" x2="268" y2="142" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5" pathLength="1" className="g8-draw"/>
      <text x="200" y="132" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_ODZ)}</text>
    </SceneBand>
  )
}

// YAKUN: o'sha ikki yozuv, oralarida tenglik, ikkida esa TESHIK.
const FinalScene = (
  <SceneBand kind="final" label={L(
    "Yozuvlar teng, ikkida esa teshik",
    'Записи равны, а в двойке дырка',
    'The records are equal, and there is a hole at two',
  )}>
    <text x="90" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16" fill={T.ink}>{'a · a − 4'}</text>
    <line x1="46" y1="39" x2="134" y2="39" stroke={T.ink} strokeWidth="2"/>
    <text x="90" y="58" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16" fill={T.ink}>{'a − 2'}</text>

    <text x="196" y="46" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18" fill={T.ok}>=</text>

    <text x="270" y="48" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17" fill={T.ink}>{'a + 2'}</text>

    {/* Son o'qi va TESHIK ikkida: shart JOY bilan ko'rsatiladi. */}
    <line x1="120" y1="78" x2="280" y2="78" stroke="rgba(23,26,29,.28)" strokeWidth="1.4"/>
    <text x="160" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink3}>0</text>
    <text x="200" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink3}>2</text>
    <text x="240" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink3}>4</text>
    <g className="g8-seat" style={{ '--d': '600ms' }}>
      <circle cx="200" cy="78" r="5.2" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
    </g>
    <g className="g8-seat" style={{ '--d': '1000ms' }}>
      <rect x="300" y="68" width="76" height="19" rx="9.5" fill={T.tipSoft}/>
      <text x="338" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
        fontWeight="700" fill={T.tip}>{'a ≠ 2'}</text>
    </g>
  </SceneBand>
)

// ============================================================
// EKRAN 1. XUK. Taxmin, razbor yo'q, xulosa yo'q (§5).
// Javobini o'quvchi 6-ekranda oladi, 15-ekranda ko'radi.
// ============================================================
const S1 = {
  eyebrow: L('IKKI YOZUV', 'ДВЕ ЗАПИСИ', 'TWO RECORDS'),
  title: L(
    'Kasr va qisqa yozuv',
    'Дробь и короткая запись',
    'A fraction and a short record',
  ),
  lead: L(
    "Javobini dars davomida o'zingiz topasiz",
    'Ответ найдёшь сам по ходу урока',
    'You will find the answer yourself during the lesson',
  ),
  audio: [
    A('mount',
      "Chapda kasr, o'ngda qisqa yozuv. Ikkinchisi birinchisidan qisqartirish bilan olingan.",
      'Слева дробь, справа короткая запись. Вторую получили из первой сокращением.',
      'On the left a fraction, on the right a short record. The second came from the first by reducing.'),
    A('why',
      "Taxmin qiling, ular har qanday a da bir xil qiymat beradimi.",
      'Предположи, дают ли они одно и то же значение при любом a.',
      'Predict whether they give the same value for every a.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Qiymatlar har qanday a da mos keladimi?",
      'Совпадут ли значения при любом a?',
      'Will the values match for every a?',
    ),
    items: [
      {
        id: 'always',
        show: L('Har qanday a da mos keladi', 'Совпадут при любом a', 'They match for every a'),
      },
      {
        id: 'not',
        show: L("Mos kelmaydigan a topiladi", 'Найдётся a, где не совпадут', 'There is an a where they differ'),
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
// EKRAN 2. TAYANCH. Sonli qisqartirish va ko'paytuvchini ajratish — dars
// shu ikkisiga tayanadi. 2-darsning oxirgi fikri («ko'paytuvchi shart
// qo'shadi») bu yerda teskari tomondan ishlatiladi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Umumiy bo'luvchi va ko'paytuvchi",
    'Общий делитель и множитель',
    'A common divisor and a factor',
  ),
  audio: [
    A('mount',
      "Oldingi darsda ko'paytuvchi keldi va shart qo'shildi. Bugun ko'paytuvchi ketadi.",
      'На прошлом уроке множитель пришёл и добавил условие. Сегодня множитель уходит.',
      'Last lesson the factor arrived and added a condition. Today the factor leaves.'),
    W('t1',
      "Surat va maxraj oltiga bo'lindi, kasrning qiymati esa o'zgarmadi.",
      'Числитель и знаменатель разделили на шесть, а значение дроби не изменилось.',
      'Numerator and denominator were divided by six and the value did not change.'),
    W('t2',
      "Umumiy bo'luvchi eng katta bo'lgani yaxshi, aks holda qisqartirish yarim yo'lda qoladi.",
      'Общий делитель лучше брать наибольший, иначе сокращение останется на полпути.',
      'It is better to take the greatest common divisor, otherwise the reducing stops halfway.'),
    W('t3',
      "Harfli yig'indida ham ko'paytuvchi ajratib olinadi, shundan keyin qisqartirish mumkin.",
      'В буквенной сумме множитель тоже выносится, и только после этого можно сокращать.',
      'In a letter sum the factor is taken out too, and only then reducing is possible.'),
  ],
  props: {
    items: [
      {
        prompt: L(
          "18 va 24 ni oltiga bo'ldik. Maxrajda qanday son turadi?",
          'Разделили 18 и 24 на шесть. Какое число стоит в знаменателе?',
          'We divided 18 and 24 by six. Which number is in the denominator?',
        ),
        show: F('18', '24'),
        kind: 'number',
        answer: '4',
        accepts: ['4'],
        hints: {
          '8': L(
            "Faqat maxraj bo'lindi. Surat ham oltiga bo'linadi.",
            'Разделён только знаменатель. Числитель тоже делится на шесть.',
            'Only the denominator was divided. The numerator is divided by six as well.',
          ),
          '12': L(
            "Bu ikkiga bo'lish. Oltiga bo'lsangiz, kasr oxirigacha qisqaradi.",
            'Это деление на два. Если разделить на шесть, дробь сократится до конца.',
            'That is division by two. Dividing by six reduces the fraction completely.',
          ),
        },
        closed: L('18/24 = 3/4', '18/24 = 3/4', '18/24 = 3/4'),
      },
      {
        prompt: L(
          "15 va 25 ning eng katta umumiy bo'luvchisini yozing",
          'Запиши наибольший общий делитель 15 и 25',
          'Write the greatest common divisor of 15 and 25',
        ),
        show: F('15', '25'),
        kind: 'number',
        answer: '5',
        accepts: ['5'],
        hints: {
          '3': L(
            "Uch 25 ni bo'lmaydi. Ikkala songa ham bo'linadigan son kerak.",
            'Три не делит 25. Нужно число, которое делит оба.',
            'Three does not divide 25. A number dividing both is needed.',
          ),
          '75': L(
            "75 bu umumiy karrali, bo'luvchi emas.",
            'Семьдесят пять это общее кратное, а не делитель.',
            'Seventy five is a common multiple, not a divisor.',
          ),
        },
        closed: L('15/25 = 3/5', '15/25 = 3/5', '15/25 = 3/5'),
      },
      {
        prompt: L(
          "3a − 9 ni ko'paytmaga aylantiring. Qavs ichida nima turadi?",
          'Преврати 3a − 9 в произведение. Что стоит в скобках?',
          'Turn 3a − 9 into a product. What stands in the brackets?',
        ),
        show: (
          <Row size="row" align="center">
            {'3a − 9 = 3 · ( ? )'}
          </Row>
        ),
        kind: 'expr',
        answer: 'a-3',
        accepts: ['-3+a'],
        hints: {
          'a-9': L(
            "To'qqizni ham uchga bo'lish kerak, uch karra uch to'qqiz.",
            'Девятку тоже надо разделить на три. Три на три это девять.',
            'The nine must be divided by three as well. Three times three is nine.',
          ),
          'a+3': L(
            "To'qqiz oldida minus turibdi, u qavsda ham saqlanadi.",
            'Перед девяткой стоит минус, он сохраняется и в скобках.',
            'The nine carries a minus and it stays inside the brackets.',
          ),
        },
        closed: L('3a − 9 = 3(a − 3)', '3a − 9 = 3(a − 3)', '3a − 9 = 3(a − 3)'),
      },
    ],
  },
}

// ============================================================
// EKRAN 3. YADRO. Lenta: sonlardan harflarga. Figura `mult` qatlamda,
// 2-darsda ko'paytirish yo'nalishida ishlatilgan, bu yerda TESKARI
// yo'nalishda: o'ngdan chapga qaraladi.
// ============================================================
const S3 = {
  eyebrow: L('QISQARTIRISH', 'СОКРАЩЕНИЕ', 'REDUCING'),
  title: L(
    "Umumiy ko'paytuvchi ketadi",
    'Общий множитель уходит',
    'The common factor leaves',
  ),
  audio: [
    A('mount',
      "Oldingi darsdagi zanjirni o'ngdan chapga o'qiymiz.",
      'Читаем цепочку прошлого урока справа налево.',
      'We read the chain of the previous lesson from right to left.'),
    W('k2',
      "Surat ham, maxraj ham beshga bo'lindi, va qiymat o'sha bo'lib qoldi.",
      'И числитель, и знаменатель разделили на пять, а значение осталось тем же.',
      'Both numerator and denominator were divided by five and the value stayed.'),
    W('k3',
      "Harflar bilan ham xuddi shunday. Faqat bo'linadigan narsa KO'PAYTUVCHI bo'lishi shart.",
      'С буквами то же самое. Только делить можно лишь на МНОЖИТЕЛЬ.',
      'With letters it is the same. Only a FACTOR may be divided out.'),
  ],
  props: {
    film: {
      fig: 'mult',
      data: {
        left: F('15', '20'),
        mid: F('3 · 5', '4 · 5'),
        right: F('3', '4'),
        same: L(
          "qiymat o'sha, 0,75 va 0,75",
          'значение то же, 0,75 и 0,75',
          'the value is the same, 0.75 and 0.75',
        ),
        rule: (
          <Row size="row" align="center">
            {F('a · m', 'b · m')}
            {' = '}
            {F('a', 'b')}
            {',  m ≠ 0'}
          </Row>
        ),
      },
      frames: [
        {
          id: 'k1',
          phase: 0,
          label: L('Kasr', 'Дробь', 'Fraction'),
          text: L(
            "O'n besh yigirmadan, qiymati 0,75",
            'Пятнадцать двадцатых, значение 0,75',
            'Fifteen twentieths, the value is 0.75',
          ),
        },
        {
          id: 'k2',
          phase: 1,
          label: L("Ko'paytuvchi", 'Множитель', 'Factor'),
          text: L(
            "Ikkalasida ham besh ko'paytuvchisi bor",
            'В обеих частях есть множитель пять',
            'Both parts contain the factor five',
          ),
          ask: {
            question: L(
              "Qanday umumiy ko'paytuvchi ko'rinadi?",
              'Какой общий множитель виден?',
              'Which common factor is visible?',
            ),
            items: [
              { id: 'five', right: true, label: L('5', '5', '5') },
              {
                id: 'three',
                label: L('3', '3', '3'),
                hint: L(
                  "Uch faqat suratda bor, yigirmada uch yo'q.",
                  'Три есть только в числителе, в двадцати тройки нет.',
                  'Three is only in the numerator; twenty has no three.',
                ),
              },
              {
                id: 'four',
                label: L('4', '4', '4'),
                hint: L(
                  "To'rt faqat maxrajda bor, o'n beshda to'rt yo'q.",
                  'Четыре есть только в знаменателе, в пятнадцати четвёрки нет.',
                  'Four is only in the denominator; fifteen has no four.',
                ),
              },
              {
                id: 'ten',
                label: L('10', '10', '10'),
                hint: L(
                  "O'n beshni o'nga bo'lsak butun son chiqmaydi.",
                  'Пятнадцать на десять не делится нацело.',
                  'Fifteen is not divisible by ten.',
                ),
              },
            ],
          },
        },
        {
          id: 'k3',
          phase: 2,
          label: L('Harflar', 'Буквы', 'Letters'),
          text: L(
            "Harflar bilan ham shunday, m nolga teng emas",
            'С буквами так же, m не равно нулю',
            'With letters the same, m is not zero',
          ),
          ask: {
            question: L(
              "Nimani bo'lish mumkin?",
              'Что можно делить?',
              'What may be divided out?',
            ),
            items: [
              {
                id: 'factor',
                right: true,
                label: L("Umumiy ko'paytuvchini", 'Общий множитель', 'A common factor'),
              },
              {
                id: 'term',
                label: L('Bitta hadni', 'Одно слагаемое', 'One term'),
                hint: L(
                  "Hadni bo'lsak, kasrning qiymati o'zgaradi. Buni son bilan tekshiramiz.",
                  'Если делить слагаемое, значение дроби меняется. Это проверим числом.',
                  'Dividing a term changes the value of the fraction. We will check that with a number.',
                ),
              },
              {
                id: 'any',
                label: L("Har qanday sonni", 'Любое число', 'Any number'),
                hint: L(
                  "Bo'linadigan narsa ikkala qismda ham bo'lishi kerak.",
                  'Делить можно лишь то, что есть в обеих частях.',
                  'Only what is present in both parts may be divided out.',
                ),
              },
              {
                id: 'nol',
                label: L('Nolni', 'Нуль', 'Zero'),
                hint: L(
                  "Nolga bo'lish mumkin emas, bu qoidada alohida aytilgan.",
                  'На нуль делить нельзя, это прямо сказано в правиле.',
                  'Division by zero is impossible, the rule says so directly.',
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
// EKRAN 4. 1-USUL, o'quvchi O'ZI bajaradi. Uch qadam:
//   1) umumiy ko'paytuvchini AYTISH (yozuvni yozish emas: yozuv bir xil
//      qiymatni beradi va yadro «ajratdim» bilan «ajratmadim» ni ajratmaydi),
//   2) qisqartirishdan keyin nima qolganini yozish,
//   3) SHARTNI yozish — u BOSHLANG'ICH kasrdan olinadi.
// Har qadamda ASOS ham so'raladi (WhyStep).
// ============================================================
const S4 = {
  eyebrow: L('1-USUL', 'СПОСОБ 1', 'METHOD 1'),
  title: L(
    "Yig'indidan ko'paytuvchi",
    'Множитель из суммы',
    'A factor out of a sum',
  ),
  audio: [
    A('mount',
      "Suratda yig'indi turibdi. Undan avval ko'paytuvchi ajratib olinadi.",
      'В числителе стоит сумма. Из неё сначала выносят множитель.',
      'The numerator holds a sum. A factor is taken out of it first.'),
    W('s2',
      "Endi ikkala qismda bir xil qavs turibdi, unga bo'lish mumkin.",
      'Теперь в обеих частях одинаковая скобка, на неё можно делить.',
      'Now both parts hold the same bracket and it can be divided out.'),
    W('s3',
      "Uchlik qoldi. Lekin shart boshlang'ich kasrdan olinadi, javobdan emas.",
      'Осталась тройка. Но условие берут у исходной дроби, а не у ответа.',
      'A three is left. But the condition comes from the original fraction, not from the answer.'),
    W('s4',
      "Minus uchda boshlang'ich kasrning maxraji nolga aylanadi.",
      'При минус трёх знаменатель исходной дроби обращается в нуль.',
      'At minus three the denominator of the original fraction becomes zero.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {F('3a + 9', 'a + 3')}
      </Row>
    ),
    actions: [
      { id: 'take', label: L("Ko'paytuvchini ajratish", 'Вынести множитель', 'Take out the factor') },
      { id: 'term', label: L("Uchlikni qisqartirish", 'Сократить тройки', 'Reduce the threes') },
      { id: 'split', label: L("Hadlab bo'lish", 'Разделить по слагаемым', 'Divide term by term') },
    ],
    steps: [
      {
        action: 'take',
        wrongs: [
          {
            action: 'term',
            hint: L(
              "Suratdagi uch yig'indining bir qismi. Buni son bilan tekshiramiz.",
              'Тройка в числителе это часть суммы. Проверим её числом.',
              'The three in the numerator is part of a sum. We will check it with a number.',
            ),
          },
          {
            action: 'split',
            hint: L(
              "Hadlab bo'lish boshqa amal. Bu yerda umumiy ko'paytuvchi qidiriladi.",
              'Деление по слагаемым это другое действие. Здесь ищут общий множитель.',
              'Dividing term by term is a different action. Here we look for a common factor.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'dist',
              right: true,
              label: L("Qavsdan tashqariga chiqarish", 'Вынесение за скобку', 'Taking out of the bracket'),
            },
            {
              id: 'main',
              label: L('Kasrning asosiy xossasi', 'Основное свойство дроби', 'The basic property of a fraction'),
              hint: L(
                "Xossa keyingi qadamda kerak bo'ladi. Hozir surat qayta yozilmoqda.",
                'Свойство понадобится на следующем шаге. Сейчас переписывается числитель.',
                'The property is needed on the next step. Right now the numerator is being rewritten.',
              ),
            },
            {
              id: 'like',
              label: L("O'xshash hadlarni yig'ish", 'Приведение подобных', 'Collecting like terms'),
              hint: L(
                "O'xshash hadlar yo'q, 3a va 9 boshqa turdagi hadlar.",
                'Подобных слагаемых нет. 3a и 9 разного рода.',
                'There are no like terms. 3a and 9 are of different kinds.',
              ),
            },
          ],
        },
        ask: L(
          "Umumiy ko'paytuvchini yozing",
          'Запиши общий множитель',
          'Write the common factor',
        ),
        answer: 'a+3',
        accepts: ['3+a'],
        hints: {
          '3': L(
            "Uch faqat suratda ko'paytuvchi. Maxrajda uchlik ko'paytuvchi emas.",
            'Три множитель только в числителе. В знаменателе тройка не множитель.',
            'Three is a factor only in the numerator. In the denominator it is not a factor.',
          ),
          'a': L(
            "a yolg'iz ko'paytuvchi emas, u qavs ichida turadi.",
            'Сама a не множитель, она стоит внутри скобки.',
            'The a alone is not a factor, it stands inside the bracket.',
          ),
          'a-3': L(
            "Belgiga qarang, maxrajda a plyus uch turibdi.",
            'Посмотри на знак. В знаменателе a плюс три.',
            'Look at the sign. The denominator holds a plus three.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('3a + 9', 'a + 3')}
            {' = '}
            {F('3(a + 3)', 'a + 3')}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'cut', label: L("Qavsga bo'lish", 'Разделить на скобку', 'Divide by the bracket') },
          { id: 'open', label: L('Qavsni ochish', 'Раскрыть скобку', 'Open the bracket') },
          { id: 'add', label: L("Qavslarni qo'shish", 'Сложить скобки', 'Add the brackets') },
        ],
        action: 'cut',
        wrongs: [
          {
            action: 'open',
            hint: L(
              "Qavsni ochsak, boshlang'ich yozuvga qaytamiz. Qisqartirish uchun qavs KERAK.",
              'Раскрыв скобку, мы вернёмся к исходной записи. Для сокращения скобка НУЖНА.',
              'Opening the bracket returns us to the original record. Reducing NEEDS the bracket.',
            ),
          },
          {
            action: 'add',
            hint: L(
              "Qo'shish bu yerda amal emas, qavslar bir xil ko'paytuvchi.",
              'Сложение здесь не действие. Скобки это одинаковый множитель.',
              'Addition is not the action here. The brackets are the same factor.',
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
              id: 'dist',
              label: L("Qavsdan chiqarish", 'Вынесение за скобку', 'Taking out of the bracket'),
              hint: L(
                "Chiqarish oldingi qadamda bo'ldi. Hozir ikkala qism ham bo'linadi.",
                'Вынесение было на прошлом шаге. Сейчас делятся обе части.',
                'Taking out happened on the previous step. Now both parts are divided.',
              ),
            },
            {
              id: 'zero',
              label: L("Nolga bo'lish taqiqi", 'Запрет деления на нуль', 'The ban on dividing by zero'),
              hint: L(
                "Bu taqiq shartda ishlatiladi, qisqartirishning asosi emas.",
                'Этот запрет работает в условии, а основанием сокращения он не является.',
                'That ban works in the condition; it is not the grounds for reducing.',
              ),
            },
          ],
        },
        ask: L(
          "Qisqartirgandan keyin nima qoldi?",
          'Что осталось после сокращения?',
          'What is left after reducing?',
        ),
        answer: '3',
        accepts: ['3'],
        hints: {
          '3a': L(
            "Qavs butunlay ketdi, unda a qolmaydi.",
            'Скобка ушла целиком, никакой a в ответе не остаётся.',
            'The bracket left entirely, no a remains in the answer.',
          ),
          '3(a+3)': L(
            "Maxrajdagi qavs ham ketishi kerak, u bo'linadi.",
            'Скобка в знаменателе тоже уходит. На неё делят.',
            'The bracket in the denominator leaves as well. We divide by it.',
          ),
          'a+3': L(
            "Uchlik ko'paytuvchi sifatida qoladi, qavs esa ketadi.",
            'Тройка остаётся множителем, а скобка уходит.',
            'The three stays as a factor and the bracket leaves.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('3(a + 3)', 'a + 3')}
            {' = 3'}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'src', label: L("Boshlang'ich kasrdan", 'Из исходной дроби', 'From the original fraction') },
          { id: 'ans', label: L('Javobdan', 'Из ответа', 'From the answer') },
          { id: 'none', label: L("Shart kerak emas", 'Условие не нужно', 'No condition needed') },
        ],
        action: 'src',
        wrongs: [
          {
            action: 'ans',
            hint: L(
              "Javobda harf yo'q, ya'ni u hech narsa taqiqlamaydi. Shart yozuvdan OLDIN paydo bo'lgan.",
              'В ответе буквы нет, значит он ничего не запрещает. Условие возникло ДО него.',
              'The answer has no letter, so it forbids nothing. The condition appeared BEFORE it.',
            ),
          },
          {
            action: 'none',
            hint: L(
              "Boshlang'ich kasrda maxrajda harf bor. Bir qiymatda u nolga aylanadi.",
              'В исходной дроби под чертой стоит буква. При одном значении она обращается в нуль.',
              'The original fraction holds a letter below the bar. At one value it becomes zero.',
            ),
          },
        ],
        why: {
          question: L(
            "Nega shart boshlang'ich kasrdan olinadi?",
            'Почему условие берут у исходной дроби?',
            'Why is the condition taken from the original fraction?',
          ),
          items: [
            {
              id: 'equal',
              right: true,
              label: L(
                "Tenglik ikkalasi aniqlangan joyda turadi",
                'Равенство держится там, где определены обе',
                'The equality holds where both are defined',
              ),
            },
            {
              id: 'longer',
              label: L("Boshlang'ich yozuv uzunroq", 'Исходная запись длиннее', 'The original record is longer'),
              hint: L(
                "Uzunlik ahamiyatsiz. Qiymat qaysi yozuvda yo'qolishi ahamiyatli.",
                'Длина ни при чём. Важно, у какой записи пропадает значение.',
                'Length is irrelevant. What matters is which record loses its value.',
              ),
            },
            {
              id: 'first',
              label: L('U birinchi yozilgan', 'Она записана первой', 'It was written first'),
              hint: L(
                "Tartib ahamiyatsiz. Maxraj nolga aylanishi ahamiyatli.",
                'Порядок ни при чём. Важно, что знаменатель обращается в нуль.',
                'Order is irrelevant. What matters is that the denominator becomes zero.',
              ),
            },
          ],
        },
        kind: 'odz',
        varName: 'a',
        excluded: [-3],
        accepts: ['a != -3', 'a+3 != 0'],
        ask: L(
          "Ruhsat etilgan qiymatlarni yozing",
          'Запиши допустимые значения',
          'Write the admissible values',
        ),
        hints: {
          'a != 3': L(
            "Uchda a plyus uch oltiga teng, nolga emas.",
            'При тройке a плюс три равно шести, а не нулю.',
            'At three, a plus three equals six, not zero.',
          ),
          'a != 0': L(
            "Nolda maxraj uchga teng, va kasr hisoblanadi.",
            'При нуле знаменатель равен трём, и дробь считается.',
            'At zero the denominator equals three and the fraction computes.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'a ≠ −3'}
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 5. 2-USUL. Kvadratlar ayirmasi — 7-sinf formulasi, bu yerda u
// qisqartirish uchun ISHLATILADI. Xukning yozuvi shu ekranda ochiladi.
// ============================================================
const S5 = {
  eyebrow: L('2-USUL', 'СПОСОБ 2', 'METHOD 2'),
  title: L(
    'Kvadratlar ayirmasi',
    'Разность квадратов',
    'Difference of squares',
  ),
  audio: [
    A('mount',
      "Bu yozuvni birinchi ekranda ko'rgan edingiz. Suratda kvadratlar ayirmasi turibdi.",
      'Эту запись ты видел на первом экране. В числителе стоит разность квадратов.',
      'You saw this record on the first screen. The numerator holds a difference of squares.'),
    W('s2',
      "Ayirma ko'paytmaga aylandi, va ikkala qismda bir xil qavs paydo bo'ldi.",
      'Разность превратилась в произведение, и в обеих частях появилась одинаковая скобка.',
      'The difference became a product, and both parts now hold the same bracket.'),
    W('s3',
      "Qisqa yozuv chiqdi. Ammo taqiq boshlang'ich kasrda qolgan.",
      'Вышла короткая запись. Но запрет остался у исходной дроби.',
      'A short record came out. But the restriction stays with the original fraction.'),
    W('s4',
      "Ikkida boshlang'ich kasrning maxraji nolga aylanadi, qisqa yozuvda esa hech narsa bo'lmaydi.",
      'При двойке знаменатель исходной дроби обращается в нуль, а с короткой записью ничего не происходит.',
      'At two the original denominator becomes zero, while nothing happens to the short record.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {F('a · a − 4', 'a − 2')}
      </Row>
    ),
    actions: [
      { id: 'sq', label: L("Ayirmani ko'paytmaga", 'Разность в произведение', 'Difference into a product') },
      { id: 'four', label: L("To'rtlikni qisqartirish", 'Сократить четвёрку', 'Reduce the four') },
      { id: 'aa', label: L("a · a ni qisqartirish", 'Сократить a · a', 'Reduce a · a') },
    ],
    steps: [
      {
        action: 'sq',
        wrongs: [
          {
            action: 'four',
            hint: L(
              "To'rt yig'indining qismi, ko'paytuvchi emas. Maxrajda to'rtlik ham yo'q.",
              'Четыре это часть разности, а не множитель. И в знаменателе четвёрки нет.',
              'Four is part of the difference, not a factor. And the denominator has no four.',
            ),
          },
          {
            action: 'aa',
            hint: L(
              "a · a ham yig'indining qismi. Qisqartirish faqat ko'paytuvchi bo'yicha.",
              'a · a тоже часть разности. Сокращают только по множителю.',
              'a · a is part of the difference too. Reducing goes only by a factor.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'formula',
              right: true,
              label: L('Kvadratlar ayirmasi formulasi', 'Формула разности квадратов', 'The difference of squares formula'),
            },
            {
              id: 'main',
              label: L('Kasrning asosiy xossasi', 'Основное свойство дроби', 'The basic property of a fraction'),
              hint: L(
                "Xossa keyingi qadamda ishlatiladi. Hozir surat ko'paytmaga aylanmoqda.",
                'Свойство пойдёт в дело на следующем шаге. Сейчас числитель превращается в произведение.',
                'The property comes into play next. Right now the numerator becomes a product.',
              ),
            },
            {
              id: 'sum',
              label: L("Yig'indining kvadrati", 'Квадрат суммы', 'The square of a sum'),
              hint: L(
                "Yig'indining kvadratida uch had bo'ladi. Bu yerda ikki had.",
                'В квадрате суммы три слагаемых. Здесь их два.',
                'The square of a sum has three terms. Here there are two.',
              ),
            },
          ],
        },
        ask: L(
          "Suratni ko'paytma sifatida yozing",
          'Запиши числитель как произведение',
          'Write the numerator as a product',
        ),
        answer: '(a-2)(a+2)',
        accepts: ['(a+2)(a-2)'],
        hints: {
          '(a-2)(a-2)': L(
            "Ikkinchi qavsda belgi boshqa bo'ladi. Ikkida tekshirib ko'ring.",
            'Во второй скобке знак другой. Проверь при двойке.',
            'The second bracket carries the other sign. Check at two.',
          ),
          '(a-4)(a+1)': L(
            "Ko'paytirib ko'ring, o'rtada qo'shimcha had chiqadi.",
            'Перемножь. В середине появится лишнее слагаемое.',
            'Multiply it out. An extra term appears in the middle.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('(a − 2)(a + 2)', 'a − 2')}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'cut', label: L("Qavsga bo'lish", 'Разделить на скобку', 'Divide by the bracket') },
          { id: 'open', label: L('Qavslarni ochish', 'Раскрыть скобки', 'Open the brackets') },
          { id: 'plus', label: L("Qavslarni qo'shish", 'Сложить скобки', 'Add the brackets') },
        ],
        action: 'cut',
        wrongs: [
          {
            action: 'open',
            hint: L(
              "Ochsak, boshlang'ich yozuv qaytadi. Qavs qisqartirish uchun kerak.",
              'Раскроем, и вернётся исходная запись. Скобка нужна для сокращения.',
              'Opening brings back the original record. The bracket is needed for reducing.',
            ),
          },
          {
            action: 'plus',
            hint: L(
              "Qavslar bu yerda ko'paytuvchilar, ular qo'shilmaydi.",
              'Скобки здесь множители, они не складываются.',
              'The brackets here are factors, they are not added.',
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
              id: 'formula',
              label: L('Kvadratlar ayirmasi formulasi', 'Формула разности квадратов', 'The difference of squares formula'),
              hint: L(
                "Formula oldingi qadamda ishladi. Hozir ikkala qism bir xil qavsga bo'linadi.",
                'Формула сработала на прошлом шаге. Сейчас обе части делятся на одинаковую скобку.',
                'The formula worked on the previous step. Now both parts are divided by the same bracket.',
              ),
            },
            {
              id: 'move',
              label: L("Hadni ko'chirish", 'Перенос слагаемого', 'Moving a term'),
              hint: L(
                "Ko'chirish tenglamada bo'ladi. Bu yerda kasr almashtirilmoqda.",
                'Перенос бывает в уравнении. Здесь преобразуют дробь.',
                'Moving terms happens in an equation. Here a fraction is transformed.',
              ),
            },
          ],
        },
        ask: L(
          "Nima qoldi?",
          'Что осталось?',
          'What is left?',
        ),
        answer: 'a+2',
        accepts: ['2+a'],
        hints: {
          'a-2': L(
            "Bo'lingan qavs ketadi, qolgani ikkinchisi.",
            'Уходит та скобка, на которую делили; остаётся вторая.',
            'The bracket we divided by leaves; the other one stays.',
          ),
          'a*a+2': L(
            "Suratda ko'paytma edi, kvadrat qolmaydi.",
            'В числителе было произведение, квадрат не остаётся.',
            'The numerator held a product; no square remains.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('(a − 2)(a + 2)', 'a − 2')}
            {' = a + 2'}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'src', label: L("Boshlang'ich kasrdan", 'Из исходной дроби', 'From the original fraction') },
          { id: 'ans', label: L('Javobdan', 'Из ответа', 'From the answer') },
          { id: 'none', label: L("Shart kerak emas", 'Условие не нужно', 'No condition needed') },
        ],
        action: 'src',
        wrongs: [
          {
            action: 'ans',
            hint: L(
              "a plyus ikki har qanday qiymatda hisoblanadi, ya'ni javob shartni ko'rsatmaydi.",
              'a плюс два считается при любом значении, то есть ответ условия не показывает.',
              'a plus two computes at every value, so the answer shows no condition.',
            ),
          },
          {
            action: 'none',
            hint: L(
              "Boshlang'ich kasrda maxraj a minus ikki. Bir qiymatda u nolga aylanadi.",
              'В исходной дроби знаменатель a минус два. При одном значении он обращается в нуль.',
              'The original denominator is a minus two. At one value it becomes zero.',
            ),
          },
        ],
        why: {
          question: L(
            'Nega shart saqlanadi?',
            'Почему условие сохраняется?',
            'Why is the condition kept?',
          ),
          items: [
            {
              id: 'equal',
              right: true,
              label: L(
                "Ikkida chap yozuvning qiymati yo'q",
                'При двойке у левой записи значения нет',
                'At two the left record has no value',
              ),
            },
            {
              id: 'habit',
              label: L('Shunday yozish qabul qilingan', 'Так принято записывать', 'It is the usual way to write'),
              hint: L(
                "Bu qabul emas, bu tekshiriladigan fakt. Ikkini qo'yib ko'ring.",
                'Это не обычай, а проверяемый факт. Подставь двойку.',
                'This is not a custom but a checkable fact. Substitute two.',
              ),
            },
            {
              id: 'zero',
              label: L("Javob nolga aylanadi", 'Ответ обращается в нуль', 'The answer becomes zero'),
              hint: L(
                "Ikkida javob to'rtga teng. Nolga aylanadigan narsa boshlang'ich maxraj.",
                'При двойке ответ равен четырём. В нуль обращается исходный знаменатель.',
                'At two the answer equals four. It is the original denominator that becomes zero.',
              ),
            },
          ],
        },
        kind: 'odz',
        varName: 'a',
        excluded: [2],
        accepts: ['a != 2', 'a-2 != 0'],
        ask: L(
          "Ruhsat etilgan qiymatlarni yozing",
          'Запиши допустимые значения',
          'Write the admissible values',
        ),
        hints: {
          'a != -2': L(
            "Minus ikkida maxraj minus to'rtga teng, nolga emas.",
            'При минус двух знаменатель равен минус четырём, а не нулю.',
            'At minus two the denominator equals minus four, not zero.',
          ),
          'a != 0': L(
            "Nolda maxraj minus ikkiga teng.",
            'При нуле знаменатель равен минус двум.',
            'At zero the denominator equals minus two.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'a ≠ 2'}
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 6. BIRGA YECHAMIZ. MUVAFFAQIYATSIZ QADAM (§4): «uchliklarni
// qisqartiramiz» satri chiqadi va SON bilan rad etiladi. Shundan keyin
// to'g'ri yo'l ko'rsatiladi. Xukning javobi ham shu ekranda tug'iladi.
// ============================================================
const S6 = {
  eyebrow: L('BIRGA YECHAMIZ', 'РЕШАЕМ ВМЕСТЕ', 'SOLVING TOGETHER'),
  title: L(
    "Yig'indi qisqartiriladimi",
    'Сокращается ли сумма',
    'Can a sum be reduced',
  ),
  audio: [
    A('mount',
      "Eng ko'p uchraydigan xatoni birga tekshiramiz.",
      'Проверим вместе самую частую ошибку.',
      'Let us check the most common mistake together.'),
    W('s3',
      "Bu qadam to'g'ri ko'rinadi. Uni son bilan tekshiramiz.",
      'Этот шаг выглядит верным. Проверим его числом.',
      'This step looks correct. We will check it with a number.'),
    W('s5',
      "Qiymatlar ajraldi, demak qadam noto'g'ri. Bitta son rad etish uchun yetadi.",
      'Значения разошлись, значит шаг неверен. Одного числа для опровержения достаточно.',
      'The values differ, so the step is wrong. One number is enough to refute it.'),
    W('s6',
      "Yig'indini avval ko'paytuvchilarga ajratamiz, keyin qisqartiramiz.",
      'Сумму сначала разлагаем на множители, и только потом сокращаем.',
      'We factor the sum first and only then reduce.'),
  ],
  props: {
    task: L(
      "(a + 3)/3 kasrini qisqartirish mumkinmi?",
      'Можно ли сократить дробь (a + 3)/3?',
      'Can the fraction (a + 3)/3 be reduced?',
    ),
    lines: [
      {
        text: '(a + 3)/3',
        note: L('berilgan', 'дано', 'given'),
      },
      {
        text: L(
          "Uchlik ham suratda, ham maxrajda turibdi",
          'Тройка стоит и в числителе, и в знаменателе',
          'A three stands both above and below the bar',
        ),
      },
      {
        text: '(a + 3)/3 = a',
        tone: 'no',
        ask: {
          question: L(
            "a uchga teng bo'lsa, ikki yozuv nima beradi?",
            'При a, равном трём, что дадут две записи?',
            'At a equal to three, what do the two records give?',
          ),
          items: [
            { id: 'two', right: true, label: L('2 va 3', '2 и 3', '2 and 3') },
            {
              id: 'same',
              label: L('3 va 3', '3 и 3', '3 and 3'),
              hint: L(
                "Chapda avval qo'shiladi, keyin bo'linadi. Uch plyus uch olti, olti bo'lingan uch ikki.",
                'Слева сначала складывают, потом делят. Три плюс три шесть, шесть на три два.',
                'On the left you add first, then divide. Three plus three is six, six over three is two.',
              ),
            },
            {
              id: 'six',
              label: L('6 va 3', '6 и 3', '6 and 3'),
              hint: L(
                "Olti bu surat. Uni maxrajga bo'lish kerak.",
                'Шесть это числитель. Его надо разделить на знаменатель.',
                'Six is the numerator. It must be divided by the denominator.',
              ),
            },
          ],
          after: L(
            "Qiymatlar ajraldi",
            'Значения разошлись',
            'The values differ',
          ),
        },
      },
      {
        text: L(
          "Demak bunday qisqartirish mumkin emas",
          'Значит так сокращать нельзя',
          'So reducing this way is not allowed',
        ),
        tone: 'ok',
      },
      {
        text: '(3a + 9)/3 = 3(a + 3)/3 = a + 3',
        ask: {
          question: L(
            "Bu yerda nima boshqacha?",
            'Что здесь по-другому?',
            'What is different here?',
          ),
          items: [
            {
              id: 'factor',
              right: true,
              label: L("Yig'indi ko'paytmaga aylandi", 'Сумма стала произведением', 'The sum became a product'),
            },
            {
              id: 'numbers',
              label: L('Sonlar kattaroq', 'Числа больше', 'The numbers are bigger'),
              hint: L(
                "Sonlarning kattaligi ahamiyatsiz. Yozuvning tuzilishiga qarang.",
                'Величина чисел ни при чём. Смотри на строение записи.',
                'The size of the numbers is irrelevant. Look at the structure of the record.',
              ),
            },
            {
              id: 'same',
              label: L("Farq yo'q", 'Разницы нет', 'There is no difference'),
              hint: L(
                "Bu yerda uchlik qavs oldida ko'paytuvchi, u yerda esa had edi.",
                'Здесь тройка множитель перед скобкой, а там она была слагаемым.',
                'Here the three is a factor before the bracket; there it was a term.',
              ),
            },
          ],
          after: L(
            "Ko'paytuvchi bo'yicha qisqartirish mumkin",
            'По множителю сокращать можно',
            'Reducing by a factor is allowed',
          ),
        },
      },
      {
        text: L(
          "Yig'indi avval ajratiladi, keyin qisqartiriladi",
          'Сумму сначала разлагают, потом сокращают',
          'A sum is factored first and reduced after',
        ),
        tone: 'ok',
      },
    ],
  },
}

// ============================================================
// EKRAN 7. CHEGARA (`kind: 'boundary'`). Xukning ikki yozuvi QAYERDA
// ajralishini o'quvchi SON bilan topadi. Variant bilan berish mumkin emas:
// har qanday variant javobni aytib qo'yadi.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L(
    'Yozuvlar qayerda ajraladi',
    'Где записи расходятся',
    'Where the records part ways',
  ),
  audio: [
    A('mount',
      "Ikki yozuv yonma yon. Qaysi sonda ular ajralishini toping.",
      'Две записи рядом. Найди число, на котором они расходятся.',
      'Two records side by side. Find the number where they part ways.'),
    A('why',
      "Chapda maxraj a minus ikki, o'ngda esa maxraj yo'q.",
      'Слева знаменатель a минус два, а справа знаменателя нет вовсе.',
      'On the left the denominator is a minus two; on the right there is no denominator at all.'),
  ],
  props: {
    left: (
      <Row size="row" align="center">
        {F('a · a − 4', 'a − 2')}
      </Row>
    ),
    right: (
      <Row size="row" align="center">
        {'a + 2'}
      </Row>
    ),
    odzLeft: L('?', '?', '?'),
    odzRight: L('har qanday a', 'любое a', 'any a'),
    question: L(
      "Qaysi qiymatda chap yozuv hisoblanmaydi?",
      'При каком значении не считается левая запись?',
      'At which value does the left record fail?',
    ),
    answer: [2],
    hints: {
      '0': L(
        "Nolda maxraj minus ikkiga teng, kasr hisoblanadi.",
        'При нуле знаменатель равен минус двум, дробь считается.',
        'At zero the denominator equals minus two and the fraction computes.',
      ),
      '-2': L(
        "Minus ikkida maxraj minus to'rtga teng, nolga emas.",
        'При минус двух знаменатель равен минус четырём, а не нулю.',
        'At minus two the denominator equals minus four, not zero.',
      ),
      '4': L(
        "To'rtda maxraj ikkiga teng. Nolga aylanadigan sonni qidiring.",
        'При четырёх знаменатель равен двум. Ищи число, дающее нуль.',
        'At four the denominator equals two. Look for the number that gives zero.',
      ),
      '*': L(
        "Maxraj a minus ikki. U qaysi sonda nolga aylanadi?",
        'Знаменатель a минус два. При каком числе он обращается в нуль?',
        'The denominator is a minus two. At which number does it become zero?',
      ),
    },
    note: L(
      "Tenglik shu nuqtadan tashqarida turadi",
      'Равенство держится везде, кроме этой точки',
      'The equality holds everywhere except this point',
    ),
  },
}

// ============================================================
// EKRAN 8. QOIDA. O'quvchi yig'adi, keyin darslik matni ochiladi va
// dars XUKKA QAYTADI.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    'Qisqartirish qoidasi',
    'Правило сокращения',
    'The rule of reducing',
  ),
  audio: [
    A('mount',
      "Qoidani o'zingiz yig'asiz, keyin darslik matni ochiladi.",
      'Правило соберёшь сам, потом откроется текст учебника.',
      'You will assemble the rule yourself, then the textbook text opens.'),
    W('card',
      "Birinchi ekrandagi yozuvlar javobini oldi. Ular teng, lekin a ikkiga teng bo'lmaganda.",
      'Записи с первого экрана получили ответ. Они равны, но при a, не равном двум.',
      'The records from the first screen got their answer. They are equal, but only when a is not two.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L('Surat va maxrajni', 'Числитель и знаменатель', 'Numerator and denominator') },
      { id: 'f2', label: L("umumiy KO'PAYTUVCHIGA", 'делят на общий МНОЖИТЕЛЬ', 'divide by a common FACTOR') },
      { id: 'f3', label: L("yig'indi avval ajratiladi", 'сумму сначала разлагают', 'a sum is factored first') },
      { id: 'f4', label: L("shart boshlang'ich kasrdan", 'условие от исходной дроби', 'the condition from the original') },
      { id: 'w1', label: L("har qanday hadga", 'делят на слагаемое', 'divide by a term') },
      { id: 'w2', label: L('shart javobdan', 'условие из ответа', 'the condition from the answer') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilganda qoida buziladi. Nimani bo'lish mumkinligini va shart qaydan kelishini tekshiring.",
      'В такой сборке правило ломается. Проверь, на что делят и откуда берётся условие.',
      'Assembled this way the rule breaks. Check what is divided out and where the condition comes from.',
    ),
    card: {
      title: L('KASRLARNI QISQARTIRISH', 'СОКРАЩЕНИЕ ДРОБЕЙ', 'REDUCING FRACTIONS'),
      lines: [
        L(
          "Kasrlarni qisqartirish uchun surat va maxrajni ularning umumiy ko'paytuvchisiga bo'lish kerak",
          'Чтобы сократить дробь, надо разделить её числитель и знаменатель на их общий множитель',
          'To reduce a fraction, divide its numerator and denominator by their common factor',
        ),
        L(
          "Yig'indi avval ajratiladi",
          'Сумму сначала разлагают на множители',
          'A sum is factored first',
        ),
        L(
          "Shart boshlang'ich kasrdan qoladi",
          'Условие остаётся от исходной дроби',
          'The condition stays from the original fraction',
        ),
      ],
      source: L('Darslik, 2-§, 14-bet', 'Учебник, § 2, стр. 14', 'Textbook, section 2, page 14'),
      locked: L("Qoida yig'ilgandan keyin ochiladi", 'Откроется после сборки правила', 'Opens once the rule is assembled'),
    },
    recall: {
      left: L('(a · a − 4)/(a − 2)', '(a · a − 4)/(a − 2)', '(a · a − 4)/(a − 2)'),
      right: L('a + 2,  a ≠ 2', 'a + 2,  a ≠ 2', 'a + 2,  a ≠ 2'),
      winner: 'right',
      note: L(
        "Ikkalasi teng, faqat a ikkiga teng bo'lmasa",
        'Обе равны, только при a, не равном двум',
        'Both are equal, but only when a is not two',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ, ZANJIR. To'rt topshiriq, to'rt xil format: son, ifoda,
// ruhsat etilgan qiymatlar va «qisqartirish mumkin emas» tugmasi.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    "Qisqartiring va shartni yozing",
    'Сократи и запиши условие',
    'Reduce it and write the condition',
  ),
  audio: [
    A('mount',
      "To'rt topshiriq. Oxirgisida qisqartirish umuman mumkin emas.",
      'Четыре задания. В последнем сокращать вообще нельзя.',
      'Four tasks. In the last one reducing is not possible at all.'),
    W('t1',
      "Eng katta umumiy bo'luvchi olinganda kasr oxirigacha qisqaradi.",
      'Если взять наибольший общий делитель, дробь сократится до конца.',
      'With the greatest common divisor the fraction reduces completely.'),
    W('t2',
      "Bir xil qavs ketdi, ikkinchisi maxrajda qoldi.",
      'Одинаковая скобка ушла, вторая осталась в знаменателе.',
      'The identical bracket left, the other one stayed in the denominator.'),
    W('t3',
      "Shart javobdan emas, boshlang'ich kasrdan olinadi.",
      'Условие берут не из ответа, а из исходной дроби.',
      'The condition comes from the original fraction, not from the answer.'),
    W('t4',
      "Suratda yig'indi, ko'paytuvchi esa yo'q. Bunday kasr qisqarmaydi.",
      'В числителе сумма, множителя нет. Такая дробь не сокращается.',
      'The numerator is a sum with no factor. Such a fraction does not reduce.'),
  ],
  props: {
    items: [
      {
        prompt: L(
          "Kasrni oxirigacha qisqartiring va maxrajni yozing",
          'Сократи дробь до конца и запиши знаменатель',
          'Reduce the fraction fully and write the denominator',
        ),
        show: F('18', '24'),
        kind: 'number',
        answer: '4',
        accepts: ['4'],
        hints: {
          '8': L(
            "Surat ham bo'linishi kerak, faqat maxraj emas.",
            'Числитель тоже надо разделить, а не только знаменатель.',
            'The numerator must be divided too, not just the denominator.',
          ),
          '12': L(
            "Ikkiga bo'lish yarim yo'l. Oltiga bo'lib ko'ring.",
            'Деление на два это полпути. Раздели на шесть.',
            'Dividing by two is halfway. Divide by six.',
          ),
        },
        closed: L('18/24 = 3/4', '18/24 = 3/4', '18/24 = 3/4'),
      },
      {
        prompt: L(
          "Qisqartirilgan kasrni yozing",
          'Запиши сокращённую дробь',
          'Write the reduced fraction',
        ),
        show: F('a + 1', '(a + 1)(a − 4)'),
        kind: 'expr',
        answer: '1/(a-4)',
        accepts: ['1/(a-4)'],
        hints: {
          '1/(a+1)': L(
            "Ketadigan qavs ikkalasida ham bor bo'lgani, ya'ni a plyus bir.",
            'Уходит та скобка, что есть в обеих частях, то есть a плюс один.',
            'The bracket present in both parts leaves, that is a plus one.',
          ),
          'a-4': L(
            "Qavs maxrajda turgan, ya'ni javobda ham chiziq ostida qoladi.",
            'Скобка стояла в знаменателе, значит и в ответе она под чертой.',
            'The bracket was in the denominator, so in the answer it stays below the bar.',
          ),
          '(a+1)/((a+1)(a-4))': L(
            "Bu boshlang'ich yozuv, qisqartirish qilinmagan.",
            'Это исходная запись, сокращение не выполнено.',
            'That is the original record, no reducing was done.',
          ),
        },
        closed: L('(a + 1)/((a + 1)(a − 4)) = 1/(a − 4)', '(a + 1)/((a + 1)(a − 4)) = 1/(a − 4)', '(a + 1)/((a + 1)(a − 4)) = 1/(a − 4)'),
      },
      {
        prompt: L(
          "Boshlang'ich kasrning ruhsat etilgan qiymatlarini yozing",
          'Запиши допустимые значения исходной дроби',
          'Write the admissible values of the original fraction',
        ),
        show: (
          <Row size="row" align="center">
            {F('a · a − 9', 'a − 3')}
            {' = a + 3'}
          </Row>
        ),
        kind: 'odz',
        varName: 'a',
        excluded: [3],
        accepts: ['a != 3', 'a-3 != 0'],
        hints: {
          'a != -3': L(
            "Minus uchda maxraj minus oltiga teng, nolga emas.",
            'При минус трёх знаменатель равен минус шести, а не нулю.',
            'At minus three the denominator equals minus six, not zero.',
          ),
          'a != 3, a != -3': L(
            "Minus uch faqat suratni nolga aylantiradi, maxrajni emas.",
            'Минус три обращает в нуль только числитель, а не знаменатель.',
            'Minus three makes only the numerator zero, not the denominator.',
          ),
        },
        closed: L('a ≠ 3', 'a ≠ 3', 'a ≠ 3'),
      },
      {
        prompt: L(
          "Bu kasrni qisqartirib ko'ring",
          'Попробуй сократить эту дробь',
          'Try to reduce this fraction',
        ),
        show: F('a + 5', '5'),
        kind: 'expr',
        none: true,
        noneLabel: L("Qisqartirish mumkin emas", 'Сокращать нечего', 'Nothing to reduce'),
        closed: L('(a + 5)/5 qisqarmaydi', '(a + 5)/5 не сокращается', '(a + 5)/5 does not reduce'),
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ, QADAMLAR NOMLANGAN. Usul kartochkasi topshiriq USTIDA.
// ============================================================
const S10 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    'Qadamlab qisqartirish',
    'Сокращение по шагам',
    'Reducing step by step',
  ),
  audio: [
    A('mount',
      "Uch qadam nomlangan. Suratda ikki karrali kvadratlar ayirmasi turibdi.",
      'Три шага названы. В числителе удвоенная разность квадратов.',
      'Three steps are named. The numerator holds a doubled difference of squares.'),
    W('f1',
      "Avval ikkilik chiqadi, keyin kvadratlar ayirmasi ko'paytmaga aylanadi.",
      'Сначала выносится двойка, потом разность квадратов становится произведением.',
      'First the two comes out, then the difference of squares becomes a product.'),
    W('f2',
      "Bir xil qavsga bo'lindi, ikkilik esa qoldi.",
      'Разделили на одинаковую скобку, а двойка осталась.',
      'We divided by the identical bracket and the two stayed.'),
    W('f3',
      "Shart boshlang'ich maxrajdan, ya'ni a plyus ikkidan keladi.",
      'Условие приходит от исходного знаменателя, то есть от a плюс два.',
      'The condition comes from the original denominator, that is from a plus two.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {F('2a · a − 8', 'a + 2')}
      </Row>
    ),
    fields: [
      {
        ask: L(
          "Suratni ko'paytma sifatida yozing",
          'Запиши числитель как произведение',
          'Write the numerator as a product',
        ),
        kind: 'expr',
        answer: '2(a-2)(a+2)',
        accepts: ['2*(a-2)*(a+2)', '(2a-4)(a+2)'],
        hints: {
          '2(a-4)(a+4)': L(
            "Ikkilikni ajratgandan keyin qavs ichida a kvadrat minus to'rt qoladi.",
            'После выноса двойки в скобке остаётся a в квадрате минус четыре.',
            'After the two comes out, the bracket holds a squared minus four.',
          ),
          '(a-2)(a+2)': L(
            "Ikkilik yo'qolib qoldi. Suratda 2a kvadrat turgan edi.",
            'Двойка потерялась. В числителе было 2a в квадрате.',
            'The two got lost. The numerator held 2a squared.',
          ),
        },
      },
      {
        ask: L(
          "Qisqartirgandan keyin nima qoldi?",
          'Что осталось после сокращения?',
          'What is left after reducing?',
        ),
        kind: 'expr',
        answer: '2(a-2)',
        accepts: ['2a-4'],
        hints: {
          '2(a+2)': L(
            "Bo'lingan qavs ketadi. Bo'lish a plyus ikkiga qilingan.",
            'Уходит та скобка, на которую делили. a плюс два.',
            'The bracket we divided by leaves. a plus two.',
          ),
          'a-2': L(
            "Ikkilik ko'paytuvchi bo'lib qoladi, u qisqarmaydi.",
            'Двойка остаётся множителем, она не сокращается.',
            'The two stays as a factor, it does not reduce.',
          ),
        },
      },
      {
        ask: L(
          "Ruhsat etilgan qiymatlarni yozing",
          'Запиши допустимые значения',
          'Write the admissible values',
        ),
        kind: 'odz',
        varName: 'a',
        excluded: [-2],
        accepts: ['a != -2', 'a+2 != 0'],
        hints: {
          'a != 2': L(
            "Ikkida boshlang'ich maxraj to'rtga teng, nolga emas.",
            'При двойке исходный знаменатель равен четырём, а не нулю.',
            'At two the original denominator equals four, not zero.',
          ),
          'a != 0, a != -2': L(
            "Nolda maxraj ikkiga teng, kasr hisoblanadi.",
            'При нуле знаменатель равен двум, дробь считается.',
            'At zero the denominator equals two and the fraction computes.',
          ),
        },
      },
    ],
  },
}

// ============================================================
// EKRAN 11. ASBOBSIZ. Yozuv, ikki maydon va O'QUVCHINING SONI (З16).
// ============================================================
const S11 = {
  eyebrow: L('MUSTAQIL', 'САМ', 'ON YOUR OWN'),
  title: L(
    'Qisqartirish yordamsiz',
    'Сокращение без подсказки',
    'Reducing without help',
  ),
  audio: [
    A('mount',
      "Bu ekranda asbob yo'q. Ikkala qismni ham ko'paytuvchilarga ajratish kerak.",
      'На этом экране прибора нет. Разложить придётся обе части.',
      'There is no instrument on this screen. Both parts must be factored.'),
    A('why',
      "Javobni o'z soningiz bilan tekshirasiz, va shart ikkita bo'ladi.",
      'Ответ проверишь своим числом, и условий будет два.',
      'You will check the answer with your own number, and there will be two conditions.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {F('3a + 12', 'a · a − 16')}
      </Row>
    ),
    result: {
      ask: L(
        "Qisqartirilgan kasrni yozing",
        'Запиши сокращённую дробь',
        'Write the reduced fraction',
      ),
      kind: 'expr',
      answer: '3/(a-4)',
      accepts: ['-3/(4-a)'],
      hints: {
        '3/(a+4)': L(
          "Ketadigan qavs ikkalasida ham bor bo'lgani, ya'ni a plyus to'rt.",
          'Уходит скобка, которая есть в обеих частях, то есть a плюс четыре.',
          'The bracket present in both parts leaves, that is a plus four.',
        ),
        '3(a+4)/((a-4)(a+4))': L(
          "Bu ajratilgan yozuv, qisqartirish hali qilinmagan.",
          'Это разложенная запись, сокращение ещё не выполнено.',
          'That is the factored record, the reducing is not done yet.',
        ),
        '3/(a*a-16)': L(
          "Maxraj ham qisqaradi, u yerda a plyus to'rt ko'paytuvchisi bor.",
          'Знаменатель тоже сокращается. В нём есть множитель a плюс четыре.',
          'The denominator reduces too. It holds the factor a plus four.',
        ),
      },
    },
    odz: {
      ask: L(
        "Boshlang'ich kasrning shartlari",
        'Допустимые значения исходной дроби',
        'Admissible values of the original',
      ),
      varName: 'a',
      excluded: [-4, 4],
      accepts: ['a != 4, a != -4', 'a*a-16 != 0'],
      hints: {
        'a != 4': L(
          "Maxrajda ikki ko'paytuvchi bor, ikkinchisi minus to'rtda nolga aylanadi.",
          'В знаменателе два множителя, второй обращается в нуль при минус четырёх.',
          'The denominator has two factors; the second becomes zero at minus four.',
        ),
        'a != -4': L(
          "To'rtda ham maxraj nolga aylanadi, uni ham yozing.",
          'При четырёх знаменатель тоже обращается в нуль, запиши и это.',
          'At four the denominator becomes zero as well, write that too.',
        ),
      },
    },
    proof: {
      varName: 'a',
      from: '(3a+12)/(a*a-16)',
      to: '3/(a-4)',
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
        "Bu qiymatda boshlang'ich kasrning qiymati yo'q. Boshqa son oling.",
        'При этом значении у исходной дроби значения нет. Возьми другое число.',
        'At this value the original fraction has no value. Take another number.',
      ),
    },
    note: L(
      "Qiymatlar mos keldi, ikki shart esa saqlandi",
      'Значения совпали, и оба условия сохранены',
      'The values matched and both conditions are kept',
    ),
  },
}

// ============================================================
// EKRAN 12. TUZOQ (З2, З16). Har satr alohida to'g'ri, javob ham to'g'ri —
// noto'g'ri narsa SHARTLAR haqidagi satr. Kontrprimerni o'quvchi kiritadi.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Shart haqidagi satr",
    'Строка про условие',
    'The line about the condition',
  ),
  audio: [
    A('mount',
      "Boshqa odamning yechimi. Birinchi noto'g'ri satrni toping.",
      'Чужое решение. Найди первую неверную строку.',
      "Someone else's solution. Find the first incorrect line."),
    W('proof',
      "Endi son bilan ko'rsating. Qaysi qiymatda chap yozuvning qiymati yo'q?",
      'Теперь покажи числом. При каком значении у левой записи значения нет?',
      'Now show it with a number. At which value does the left record have no value?'),
  ],
  props: {
    rows: [
      {
        id: 'r1',
        show: L(
          "a · a − 4 = (a − 2)(a + 2)",
          'a · a − 4 = (a − 2)(a + 2)',
          'a · a − 4 = (a − 2)(a + 2)',
        ),
      },
      {
        id: 'r2',
        show: L(
          "Ikkala qismni a − 2 ga bo'lamiz",
          'Делим обе части на a − 2',
          'We divide both parts by a − 2',
        ),
      },
      {
        id: 'r3',
        show: L(
          "Javob a + 2, u har qanday a da to'g'ri",
          'Ответ a + 2, он годится при любом a',
          'The answer a + 2 works for every a',
        ),
      },
      {
        id: 'r4',
        show: L(
          "Tekshirish, a uchga teng bo'lsa besh chiqadi",
          'Проверка: при a, равном трём, выходит пять',
          'Check: at a equal to three it gives five',
        ),
      },
    ],
    answerId: 'r3',
    hints: {
      'r1': L(
        "Bu satr to'g'ri, kvadratlar ayirmasi shunday ajratiladi.",
        'Эта строка верна. Разность квадратов так и разлагается.',
        'This line is correct. That is how a difference of squares factors.',
      ),
      'r2': L(
        "Bu ham to'g'ri, a minus ikki ikkala qismda ham ko'paytuvchi.",
        'И это верно. a минус два множитель в обеих частях.',
        'This is correct too. a minus two is a factor in both parts.',
      ),
      'r4': L(
        "Uchda tekshirish rost, lekin bitta son hech narsani isbotlamaydi.",
        'При тройке проверка честная, но одно число ничего не доказывает.',
        'The check at three is honest, but one number proves nothing.',
      ),
    },
    ask: {
      label: L("Son qo'ying", 'Поставь число', 'Put in a number'),
      of: '(a*a-4)/(a-2)',
      varName: 'a',
      wrong: L(
        "Bu qiymatda chap yozuv hisoblanadi. Maxraj qaysi sonda nolga aylanadi?",
        'При этом значении левая запись считается. При каком числе знаменатель обращается в нуль?',
        'At this value the left record computes. At which number does the denominator become zero?',
      ),
      note: L(
        "Ikkida maxraj nolga teng, va chap yozuvning qiymati yo'q. Javob esa to'rtni beradi.",
        'При двойке знаменатель равен нулю, и у левой записи значения нет. А ответ даёт четыре.',
        'At two the denominator is zero and the left record has no value. The answer gives four.',
      ),
    },
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH, TESKARI TOPSHIRIQ: qisqartirilgan yozuv va
// SHARTLAR berilgan, boshlang'ich kasrni o'quvchi tiklaydi.
// ============================================================
const S13 = {
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Boshlang'ich kasrni tiklash",
    'Восстанови исходную дробь',
    'Restore the original fraction',
  ),
  audio: [
    A('mount',
      "Endi teskarisi. Qisqartirilgan yozuv va shartlar berilgan.",
      'Теперь наоборот. Дана сокращённая запись и условия.',
      'Now the other way round. The reduced record and the conditions are given.'),
    A('why',
      "Shartlardan ikkinchi ko'paytuvchi ko'rinadi. Uni surat va maxrajga qo'ying.",
      'Из условий виден второй множитель. Поставь его и в числитель, и в знаменатель.',
      'The conditions reveal the second factor. Put it into both the numerator and the denominator.'),
  ],
  props: {
    prompt: L(
      "5/(x + 1) ga qisqaradigan kasrni yozing, uning ruhsat etilgan qiymatlari x ≠ −1 va x ≠ 3 bo'lsin",
      'Запиши дробь, которая сокращается до 5/(x + 1), а её допустимые значения x ≠ −1 и x ≠ 3',
      'Write a fraction that reduces to 5/(x + 1) whose admissible values are x ≠ −1 and x ≠ 3',
    ),
    reduceTo: '5/(x+1)',
    excluded: [-1, 3],
    varName: 'x',
    hints: {
      '5/(x+1)': L(
        "Bu qisqartirilgan yozuvning o'zi, unda uchlik sharti yo'q.",
        'Это сама сокращённая запись, в ней нет условия про тройку.',
        'That is the reduced record itself; it has no condition about three.',
      ),
      '5(x+3)/((x+1)(x+3))': L(
        "x plyus uch minus uchda nolga aylanadi, bizga esa uchda kerak.",
        'x плюс три обращается в нуль при минус трёх, а нужно при трёх.',
        'x plus three becomes zero at minus three, but three is what is needed.',
      ),
      '5(x-3)/(x+1)': L(
        "Ko'paytuvchi faqat suratga qo'yilgan, u qisqarmaydi.",
        'Множитель поставлен только в числитель, он не сократится.',
        'The factor went only into the numerator, it will not reduce.',
      ),
    },
    note: L(
      "Ikkinchi shartni ko'paytuvchi keltiradi",
      'Второе условие приносит множитель',
      'The second condition is brought by the factor',
    ),
  },
}

// ============================================================
// EKRAN 14. BLITS. To'rt savol BELGI haqida. Ball yo'q.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    'Qisqartirish belgilari',
    'Признаки сокращения',
    'The marks of reducing',
  ),
  audio: [
    A('mount',
      "To'rt savol. Ular yozuv haqida emas, belgi haqida.",
      'Четыре вопроса. Они не про запись, а про признак.',
      'Four questions. They are not about a record but about the mark.'),
    A('why',
      "Har javobdan keyin izoh chiqadi, uni o'qishga vaqt bor.",
      'После каждого ответа выходит разбор, время прочитать его есть.',
      'After each answer an explanation appears and there is time to read it.'),
  ],
  props: {
    lead: L(
      "Har savolga bitta javob",
      'На каждый вопрос один ответ',
      'One answer to each question',
    ),
    items: [
      {
        id: 'q1',
        tag: 'З1',
        ask: L(
          "(a + 3)/3 kasrini qisqartirish mumkinmi?",
          'Можно ли сократить (a + 3)/3?',
          'Can (a + 3)/3 be reduced?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, tepada yig'indi", 'Нет, сверху сумма', 'No, there is a sum above') },
          { id: 'yes3', label: L("Ha, uchga", 'Да, на три', 'Yes, by three') },
          { id: 'yesa', label: L('Ha, a qoladi', 'Да, останется a', 'Yes, a remains') },
          { id: 'yesd', label: L("Ha, hadlab", 'Да, по слагаемым', 'Yes, term by term') },
        ],
        hint: L(
          "a uchga teng bo'lsa tekshiring, chapda ikki chiqadi.",
          'Проверь при a, равном трём. Слева выйдет два.',
          'Check at a equal to three. The left gives two.',
        ),
        ok: L(
          "Uchlik yig'indining hadi, ko'paytuvchi emas, shuning uchun qisqarmaydi.",
          'Тройка это слагаемое суммы, а не множитель, поэтому сокращения нет.',
          'The three is a term of the sum, not a factor, so there is no reducing.',
        ),
      },
      {
        id: 'q2',
        tag: 'З15',
        ask: L(
          "(a · a − 9)/(3a − 9) bilan avval nima qilinadi?",
          'Что делают с (a · a − 9)/(3a − 9) сначала?',
          'What is done with (a · a − 9)/(3a − 9) first?',
        ),
        options: [
          { id: 'fact', right: true, label: L("Ko'paytuvchilarga ajratish", 'Разложить на множители', 'Factor both parts') },
          { id: 'nine', label: L("To'qqizliklarni qisqartirish", 'Сократить девятки', 'Reduce the nines') },
          { id: 'sq', label: L("a · a ni qisqartirish", 'Сократить a · a', 'Reduce a · a') },
          { id: 'split', label: L("Hadlab bo'lish", 'Разделить по слагаемым', 'Divide term by term') },
        ],
        hint: L(
          "Qisqartirish faqat ko'paytuvchi bo'yicha. Ko'paytuvchi hali ko'rinmayapti.",
          'Сокращают только по множителю. А множителя пока не видно.',
          'Reducing goes only by a factor. And no factor is visible yet.',
        ),
        ok: L(
          "Ajratgandan keyin ikkalasida ham a minus uch ko'paytuvchisi ko'rinadi.",
          'После разложения в обеих частях виден множитель a минус три.',
          'After factoring, the factor a minus three appears in both parts.',
        ),
      },
      {
        id: 'q3',
        tag: 'З2',
        ask: L(
          "(a · a − 4)/(a − 2) = a + 2 tengligi qachon ishlamaydi?",
          'Когда равенство (a · a − 4)/(a − 2) = a + 2 не работает?',
          'When does the equality (a · a − 4)/(a − 2) = a + 2 fail?',
        ),
        options: [
          { id: 'two', right: true, label: L('a = 2', 'a = 2', 'a = 2') },
          { id: 'mtwo', label: L('a = −2', 'a = −2', 'a = −2') },
          { id: 'always', label: L('Har doim ishlaydi', 'Работает всегда', 'It always works') },
          { id: 'zero', label: L('a = 0', 'a = 0', 'a = 0') },
        ],
        hint: L(
          "Chap yozuvning maxraji qaysi qiymatda nolga aylanadi?",
          'При каком значении знаменатель левой записи обращается в нуль?',
          'At which value does the left denominator become zero?',
        ),
        ok: L(
          "Ikkida chapda qiymat yo'q, o'ngda esa to'rt. Shuning uchun shart yoziladi.",
          'При двойке слева значения нет, а справа четыре. Поэтому и пишут условие.',
          'At two the left has no value while the right gives four. That is why the condition is written.',
        ),
      },
      {
        id: 'q4',
        tag: 'З16',
        ask: L(
          "Qisqartirishni qanday tekshirasiz?",
          'Как проверить сокращение?',
          'How do you check a reducing?',
        ),
        options: [
          { id: 'sub', right: true, label: L("Ikki yozuvga son qo'yib", 'Подставить число в обе записи', 'Substitute a number into both records') },
          { id: 'len', label: L("Yozuv qisqarganiga qarab", 'По тому, что запись стала короче', 'By the record getting shorter') },
          { id: 'gone', label: L("Ko'paytuvchi ketganiga qarab", 'По тому, что множитель ушёл', 'By the factor having left') },
          { id: 'den', label: L('Maxrajlarni solishtirib', 'Сравнив знаменатели', 'By comparing the denominators') },
        ],
        hint: L(
          "Yozuvning ko'rinishi hech narsani kafolatlamaydi. Sonni qo'yib ko'rish kerak.",
          'Вид записи ничего не гарантирует. Надо поставить число.',
          'The look of a record guarantees nothing. A number must be put in.',
        ),
        ok: L(
          "Bitta son xatoni topadi. Mos kelish esa hali isbot emas, isbot almashtirishning o'zi.",
          'Одно число находит ошибку. А совпадение ещё не доказательство. Доказательство это само преобразование.',
          'One number finds the error. A match is not a proof yet. The transformation itself is the proof.',
        ),
      },
    ],
    scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
    stepLabel: L('Savol', 'Вопрос', 'Question'),
  },
}

// ============================================================
// EKRAN 15. YAKUN. Yangi matematika yo'q. Sahna xukka javob beradi.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    'Qisqa yozuv va shart',
    'Короткая запись и условие',
    'A short record and its condition',
  ),
  audio: [
    A('s0',
      "Xukdagi savol javobini oldi. Yozuvlar teng, lekin a ikkiga teng bo'lmaganda.",
      'Вопрос с хука получил ответ. Записи равны, но при a, не равном двум.',
      'The question from the hook has its answer. The records are equal, but only when a is not two.'),
    A('s1',
      "Uch usul qoldi. Umumiy ko'paytuvchi, kvadratlar ayirmasi va son bilan tekshirish.",
      'Остаются три способа. Общий множитель, разность квадратов и проверка числом.',
      'Three methods remain. The common factor, the difference of squares, and the check with a number.'),
    A('s2',
      "Keyingi darsda kasrlarni qo'shish. U yerda umumiy maxraj kerak bo'ladi, va bugungi ikki usul ham ishlaydi.",
      'В следующем уроке сложение дробей. Там понадобится общий знаменатель, и оба сегодняшних способа пойдут в дело.',
      'The next lesson adds fractions. A common denominator will be needed there, and both of today methods come into play.'),
  ],
  props: {
    predictedLabel: L('Taxmin', 'Прогноз', 'Prediction'),
    proved: L(
      "Teng, lekin a ikkiga teng bo'lmaganda",
      'Равны, но при a, не равном двум',
      'Equal, but only when a is not two',
    ),
    canLabel: L('Endi nima qila olasiz', 'Что теперь умеешь', 'What you can do now'),
    can: [
      L(
        "Yig'indidan ko'paytuvchi ajratib qisqartirish",
        'Сократить, вынеся из суммы множитель',
        'Reduce by taking a factor out of a sum',
      ),
      L(
        "Kvadratlar ayirmasini ko'paytmaga aylantirish",
        'Превратить разность квадратов в произведение',
        'Turn a difference of squares into a product',
      ),
      L(
        "Shartni boshlang'ich kasrdan yozish",
        'Записать условие по исходной дроби',
        'Write the condition from the original fraction',
      ),
    ],
    proofNote: L(
      "Fakt. Kalkulyator qisqartirishni har amaldan keyin bajaradi, lekin taqiqni o'zi eslab qolmaydi. Shuning uchun grafik dasturlarda uzilish nuqtasi ba'zan chizilib qoladi, va uni odam ko'rsatadi.",
      'Факт. Калькулятор сокращает после каждого действия, но запрет сам не запоминает. Поэтому в графических программах точка разрыва иногда прорисовывается, и указывает на неё человек.',
      'A fact. A calculator reduces after every operation but does not remember the restriction. That is why plotting software sometimes draws through the break, and it is a human who points it out.',
    ),
    bridge: L(
      "Keyingi dars, qo'shish va ayirish, umumiy maxrajdan boshlanadi",
      'Следующий урок, сложение и вычитание, начинается с общего знаменателя',
      'The next lesson, addition and subtraction, starts from the common denominator',
    ),
    cheat: L('Xulosani chop etish', 'Распечатать памятку', 'Print the summary'),
    screenRef: L('8-ekranga qaytib qarang', 'посмотри снова экран 8', 'look at screen 8 again'),
  },
}

// ============================================================
// EKRANLAR. Rol va tartib — `ROLE_ORDER` bilan bir xil, uni
// check-grade8.mjs POZITSIYA bo'yicha tekshiradi.
// ============================================================
export const SCREENS = [
  { role: 'hook', tool: 'pick', scene: <HookScene />, ...S1 },
  { role: 'support', tool: 'chain', kind: 'pairs', ...S2 },
  { role: 'explain', tool: 'film', kind: 'film', tag: 'З1', ...S3 },
  { role: 'explain', tool: 'transform', kind: 'method1', tag: 'З1', method: M_FACTOR, ...S4 },
  { role: 'explain', tool: 'transform', kind: 'method2', tag: 'З2', method: M_SQUARES, ...S5 },
  { role: 'explain', tool: 'solve', kind: 'together', tag: 'З1', ...S6 },
  { role: 'explain', tool: 'boundary', kind: 'boundary', tag: 'З2', ...S7 },
  { role: 'rule', tool: 'rulebuild', tag: 'З15', ...S8 },
  { role: 'practice', tool: 'chain', kind: 'drill', tag: 'З15', method: M_FACTOR, ...S9 },
  { role: 'practice', tool: 'fields', kind: 'guided', tag: 'З15', method: M_SQUARES, ...S10 },
  { role: 'practice', tool: 'solo', kind: 'solo', tag: 'З16', method: M_FACTOR, ...S11 },
  { role: 'practice', tool: 'audit', kind: 'audit', tag: 'З2', method: M_CHECK, ...S12 },
  { role: 'transfer', tool: 'inverse', kind: 'inverse', tag: 'З2', method: M_CHECK, ...S13 },
  { role: 'blitz', tool: 'blitz', ...S14 },
  { role: 'summary', tool: 'summary', scene: FinalScene, ...S15 },
]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
