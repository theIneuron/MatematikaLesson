// ============================================================================
// 8-sinf, Dars 8. ARIFMETIK ILDIZ VA RATSIONAL KO'RSATKICHLI DARAJA.
//
// Bu fayl — FAQAT MA'LUMOT (ETALON_8SINF.md §2). Mexanika `tools.jsx` da,
// o'ram `screens.jsx` da, javob tekshiruvi `mathcore.js` da.
//
// BLOK 1 NING OXIRGI DARSI.
//
// ASOSIY ASBOB — LESTNITSA (`ladder`, 2026-08-20 da yozildi). Kasr
// ko'rsatkich KELISHUV bilan berilmaydi: o'quvchi qatorni o'zi davom ettiradi
// va yarim ko'rsatkich ildizni BERISHINI ko'radi. Shundan keyin qoida
// aytiladi, undan oldin emas.
//
// IKKINCHI QIMMAT JOY — ARIFMETIK ILDIZ BITTA SON. x kvadrati 16 ga teng
// tenglamaning ikki ildizi bor, ildiz belgisi esa NOMANFIY sonni beradi.
// Uchinchisi — MODUL: kvadrat ildiz ostidagi kvadratdan a emas, |a| chiqadi.
//
// DARSLIK. O'zbek darsligi, 8-§, 39-bet:
//   «a nomanfiy sonning n >= 2 natural ko'rsatkichli arifmetik ildizi deb,
//   n-darajasi a ga teng bo'lgan NOMANFIY soniga aytiladi.»
//   x^4 = 81 ning ikki haqiqiy ildizi bor, musbati esa 4-darajali arifmetik
//   ildiz deyiladi va shunday belgilanadi: to'rtinchi darajali ildiz 81 dan.
// 9-§, 42-bet: n-darajali ildiz a^m dan a^(m/n) ga teng (a > 0).
// Tarixiy fakt: n-darajali ildiz chiqarishni Jamshid ibn Ma'sud
// al-Koshiy «Arifmetika kaliti» asarida (taxminan 1430) bergan.
//
// ADASHISHLAR: З4 (ildiz hadlarga bo'linadi), З5 (modul yo'qoldi), З16 —
// §11 ro'yxatidan. З29 (arifmetik ildiz ikki son deb olindi) YANGI.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L, MATH_FONT, Row, T, useT } from './core.jsx'
import { SceneBand } from './method.jsx'
import { A, W, makeLesson } from './screens.jsx'

export const META = {
  id: 'alg-8-08',
  n: 8,
  row: 8,
  block: 'Б1',
  topic: L(
    "Arifmetik ildiz va ratsional ko'rsatkichli daraja",
    'Арифметический корень и степень с рациональным показателем',
    'The arithmetic root and powers with rational exponents',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Arifmetik ildiz — NOMANFIY son, uning n-darajasi ildiz ostidagi ifodaga teng",
    'Арифметический корень это НЕОТРИЦАТЕЛЬНОЕ число, чья n-я степень равна подкоренному',
    'An arithmetic root is a NON-NEGATIVE number whose n-th power equals the radicand',
  ),
  L(
    "Kasr ko'rsatkich ildiz bilan bir xil, a^(m/n) — bu n-darajali ildiz a^m dan",
    'Дробный показатель это тот же корень: a^(m/n) это корень n-й степени из a^m',
    'A fractional exponent is the same root: a^(m/n) is the n-th root of a^m',
  ),
  L(
    "Juft darajali ildiz ostida kvadrat bo'lsa, modul chiqadi, a emas",
    'Из квадрата под корнем чётной степени выходит модуль, а не само число',
    'A square under an even root yields the modulus, not the number itself',
  ),
]

export const MISS = {
  'З4': {
    what: L(
      "ildiz hadlarga bo'lib chiqarildi",
      'корень «раздали» по слагаемым',
      'the root was distributed over the terms',
    ),
    wrong: 'sqrt(a+b)',
    at: 9,
  },
  'З5': {
    what: L(
      "modul yo'qoldi, kvadratdan a chiqarildi",
      'модуль забыт: из квадрата извлекли само число',
      'the modulus was dropped: the number itself was taken out of the square',
    ),
    wrong: 'sqrt(a*a)',
    at: -3,
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
  'З29': {
    what: L(
      'arifmetik ildiz ikki son deb olindi',
      'арифметический корень принят за два числа',
      'the arithmetic root was taken for two numbers',
    ),
    wrong: 'sqrt(16)',
    at: 16,
  },
}

// ============================================================
// USULLAR (§4).
// ============================================================
const M_LADDER = {
  name: L(
    "1-USUL. Qatorni davom ettirish",
    'СПОСОБ 1. Продолжить ряд',
    'METHOD 1. Continue the row',
  ),
  steps: [
    L("Qadamni toping", 'Найди шаг', 'Find the step'),
    L("Qatorni pastga davom ettiring", 'Продолжи ряд вниз', 'Continue the row downwards'),
    L("Yarim ko'rsatkich ildizni beradi", 'Половинный показатель даёт корень', 'A half exponent gives the root'),
  ],
}

const M_EXP = {
  name: L(
    "2-USUL. Ildizni daraja bilan",
    'СПОСОБ 2. Корень через степень',
    'METHOD 2. Root through a power',
  ),
  steps: [
    L("Ildiz ostini daraja qilib yozing", 'Подкоренное запиши степенью', 'Write the radicand as a power'),
    L("Ko'rsatkichni ildiz darajasiga bo'ling", 'Показатель раздели на степень корня', 'Divide the exponent by the root index'),
    L("Natijani yozing", 'Запиши результат', 'Write the result'),
  ],
}

const M_ABS = {
  name: L(
    '3-USUL. Modulni tekshirish',
    'СПОСОБ 3. Проверка модулём',
    'METHOD 3. Test with the modulus',
  ),
  steps: [
    L("Manfiy son qo'ying", 'Поставь отрицательное число', 'Put in a negative number'),
    L("Ildiz nomanfiy chiqadi", 'Корень выходит неотрицательным', 'The root comes out non-negative'),
    L("Demak javobda modul turadi", 'Значит в ответе стоит модуль', 'So the answer holds a modulus'),
  ],
}

// ============================================================
// SAHNALAR (§6).
// ============================================================
const SC_ODZ = L('ILDIZ QIYMATI', 'ЗНАЧЕНИЕ КОРНЯ', 'THE VALUE OF THE ROOT')

// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Ildiz belgisi va ikki son",
      'Знак корня и два числа',
      'The root sign and two numbers',
    )}>
      {/* CHAP: ildiz belgisi. Chiziq CHIZILADI. */}
      <path d="M46 84 L58 96 L74 52 L128 52" fill="none" stroke={T.ink} strokeWidth="2.6"
        pathLength="1" className="g8-draw"/>
      <text x="100" y="80" textAnchor="middle" fontFamily={MATH_FONT} fontSize="24" fill={T.ink}>16</text>

      {/* O'NG: ikki son KELADI. */}
      <g className="g8-fly" style={{ '--d': '2900ms' }}>
        <text x="286" y="66" textAnchor="middle" fontFamily={MATH_FONT} fontSize="22"
          fill={T.accent}>4</text>
      </g>
      <g className="g8-fly" style={{ '--d': '3200ms' }}>
        <text x="286" y="104" textAnchor="middle" fontFamily={MATH_FONT} fontSize="22"
          fill={T.accent}>{'−4'}</text>
      </g>

      <g className="g8-seat" style={{ '--d': '3600ms' }}>
        <circle cx="196" cy="80" r="16" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="196" y="87" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="136" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_ODZ)}</text>
      <line x1="140" y1="146" x2="260" y2="146" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>
    </SceneBand>
  )
}

// YAKUN: to'rt qoladi, minus to'rt o'chiriladi.
const FinalScene = (
  <SceneBand kind="final" label={L(
    "Ildiz bitta nomanfiy son beradi",
    'Корень даёт одно неотрицательное число',
    'A root gives one non-negative number',
  )}>
    <path d="M40 52 L50 62 L64 26 L112 26" fill="none" stroke={T.ink} strokeWidth="2.2"/>
    <text x="88" y="50" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18" fill={T.ink}>16</text>
    <text x="132" y="46" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17" fill={T.ok}>=</text>
    <text x="158" y="47" textAnchor="middle" fontFamily={MATH_FONT} fontSize="20"
      fontWeight="700" fill={T.ok}>4</text>

    <g className="g8-seat" style={{ '--d': '600ms' }}>
      <text x="236" y="47" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18"
        fill={T.tip}>{'−4'}</text>
      <line x1="216" y1="52" x2="256" y2="34" stroke={T.tip} strokeWidth="2.2"/>
    </g>
    <g className="g8-seat" style={{ '--d': '1000ms' }}>
      <rect x="272" y="30" width="112" height="20" rx="10" fill={T.tipSoft}/>
      <text x="328" y="44" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
        fontWeight="700" fill={T.tip}>{'x · x = 16'}</text>
    </g>
    <g className="g8-seat" style={{ '--d': '1300ms' }}>
      <text x="200" y="78" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
        fill={T.ink2}>{'tenglamaning ikki ildizi bor, belgi esa bittasini beradi'}</text>
    </g>
  </SceneBand>
)

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('ILDIZ BELGISI', 'ЗНАК КОРНЯ', 'THE ROOT SIGN'),
  title: L(
    'Bitta son yoki ikkita',
    'Одно число или два',
    'One number or two',
  ),
  lead: L(
    "Javobini dars davomida o'zingiz topasiz",
    'Ответ найдёшь сам по ходу урока',
    'You will find the answer yourself during the lesson',
  ),
  audio: [
    A('mount',
      "Chapda ildiz belgisi va o'n olti. O'ngda ikki son, ikkalasining kvadrati o'n olti.",
      'Слева знак корня и шестнадцать. Справа два числа, квадрат каждого равен шестнадцати.',
      'On the left the root sign and sixteen. On the right two numbers whose squares are both sixteen.'),
    A('why',
      "Taxmin qiling, bu yozuv bitta sonni beradimi yoki ikkitasini.",
      'Предположи, даёт эта запись одно число или два.',
      'Predict whether this record gives one number or two.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Ildiz belgisi nechta son beradi?",
      'Сколько чисел даёт знак корня?',
      'How many numbers does the root sign give?',
    ),
    items: [
      {
        id: 'one',
        show: L("Bitta, to'rt", 'Одно, четыре', 'One, four'),
      },
      {
        id: 'two',
        show: L("Ikkita, to'rt va minus to'rt", 'Два, четыре и минус четыре', 'Two, four and minus four'),
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
// EKRAN 2. TAYANCH. Uchta hisob, va uchinchisi xukning tuzog'i: manfiy
// sonning juft darajasi ham musbat chiqadi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    'Juft daraja va ishora',
    'Чётная степень и знак',
    'An even power and the sign',
  ),
  audio: [
    A('mount',
      "Uch hisob. Uchinchisi darsning butun savolini ochadi.",
      'Три вычисления. Третье открывает весь вопрос урока.',
      'Three computations. The third opens the whole question of the lesson.'),
    W('t1',
      "Uch to'rtinchi darajada sakson bir.",
      'Три в четвёртой степени восемьдесят один.',
      'Three to the fourth power is eighty one.'),
    W('t2',
      "Nomanfiy son izlandi, u uchga teng.",
      'Искали неотрицательное число, оно равно трём.',
      'We looked for a non-negative number and it is three.'),
    W('t3',
      "Minus uchning to'rtinchi darajasi ham sakson bir. Juft daraja ishorani yo'q qiladi.",
      'Минус три в четвёртой степени тоже восемьдесят один. Чётная степень убирает знак.',
      'Minus three to the fourth is eighty one as well. An even power removes the sign.'),
  ],
  props: {
    items: [
      {
        prompt: L(
          "Uch to'rtinchi darajada qancha?",
          'Чему равно три в четвёртой степени?',
          'What is three to the fourth power?',
        ),
        show: (
          <Row size="row" align="center">
            {'3'}
            <sup>4</sup>
          </Row>
        ),
        kind: 'number',
        answer: '81',
        accepts: ['81'],
        hints: {
          '12': L(
            "Bu ko'paytirish bo'ldi. Daraja bu o'zini o'ziga ko'paytirish.",
            'Это умножение. Степень это умножение числа на себя.',
            'That is multiplication. A power multiplies the number by itself.',
          ),
          '64': L(
            "To'rtni uchinchi darajaga oshirdingiz. Asos uchta.",
            'Возведено четыре в третью. Основание это три.',
            'Four was raised to the third. The base is three.',
          ),
        },
        closed: L('3 daraja 4 = 81', '3 в 4-й = 81', '3 to the 4th = 81'),
      },
      {
        prompt: L(
          "Qanday NOMANFIY son to'rtinchi darajada sakson bir beradi?",
          'Какое НЕОТРИЦАТЕЛЬНОЕ число в четвёртой степени даёт 81?',
          'Which NON-NEGATIVE number gives 81 in the fourth power?',
        ),
        show: (
          <Row size="row" align="center">
            {'? '}
            <sup>4</sup>
            {' = 81'}
          </Row>
        ),
        kind: 'number',
        answer: '3',
        accepts: ['3'],
        hints: {
          '9': L(
            "To'qqiz ikkinchi darajada sakson bir beradi, bizga to'rtinchi kerak.",
            'Девять в квадрате даёт восемьдесят один, а нужна четвёртая степень.',
            'Nine squared gives eighty one, but the fourth power is needed.',
          ),
          '81': L(
            "Sakson bir bu natija, asos emas.",
            'Восемьдесят один это результат, а не основание.',
            'Eighty one is the result, not the base.',
          ),
        },
        closed: L('3 daraja 4 = 81', '3 в 4-й = 81', '3 to the 4th = 81'),
      },
      {
        prompt: L(
          "Minus uch to'rtinchi darajada qancha?",
          'Чему равно минус три в четвёртой степени?',
          'What is minus three to the fourth power?',
        ),
        show: (
          <Row size="row" align="center">
            {'(−3)'}
            <sup>4</sup>
          </Row>
        ),
        kind: 'number',
        answer: '81',
        accepts: ['81'],
        hints: {
          '-81': L(
            "Juft daraja musbat chiqadi. To'rtta minus juft juft ko'paytiriladi.",
            'Чётная степень выходит положительной. Четыре минуса перемножаются парами.',
            'An even power comes out positive. Four minuses multiply in pairs.',
          ),
          '-12': L(
            "Bu ko'paytirish. Daraja to'rt marta ko'paytirishni bildiradi.",
            'Это умножение. Степень означает умножение четыре раза.',
            'That is multiplication. A power means multiplying four times.',
          ),
        },
        closed: L('(−3) daraja 4 = 81', '(−3) в 4-й = 81', '(−3) to the 4th = 81'),
      },
    ],
  },
}

// ============================================================
// EKRAN 3. YADRO — LESTNITSA. Bu ekranda KO'RSATISH emas, HARAKAT: kasr
// ko'rsatkich kelishuv bilan berilmaydi, o'quvchi qatorni O'ZI davom
// ettiradi va yarim ko'rsatkich ildizni berishini KO'RADI (§7.3).
// Ikki yuqori qator berilgan, qolgan beshtasi o'quvchining ishi.
// ============================================================
const S3 = {
  eyebrow: L('QATOR', 'РЯД', 'THE ROW'),
  title: L(
    "Daraja qatori pastga",
    'Ряд степеней вниз',
    'The row of powers going down',
  ),
  audio: [
    A('mount',
      "Qator yuqoridan pastga tushadi. Har qadamda ko'rsatkich yarimga kamayadi.",
      'Ряд идёт сверху вниз. На каждом шаге показатель уменьшается на половину.',
      'The row goes from top to bottom. At each step the exponent drops by a half.'),
    W('l3',
      "Qiymat ikkiga bo'lindi. Qadam hamma joyda bir xil.",
      'Значение разделилось на два. Шаг всюду одинаковый.',
      'The value was divided by two. The step is the same everywhere.'),
    W('l6',
      "Mana yarim ko'rsatkich. Qator uni ikki deb aytadi, va ikkining kvadrati to'rt.",
      'Вот половинный показатель. Ряд говорит, что это два, а два в квадрате четыре.',
      'Here is the half exponent. The row says it is two, and two squared is four.'),
    W('l7',
      "Nolinchi daraja bir. Bu ham qatorning davomi, kelishuv emas.",
      'Нулевая степень это единица. И это продолжение ряда, а не соглашение.',
      'The zero power is one. That too is the continuation of the row, not a convention.'),
  ],
  props: {
    base: 4,
    known: 2,
    rows: [
      { e: 3 },
      { e: 2.5, show: '5/2' },
      { e: 2 },
      { e: 1.5, show: '3/2' },
      { e: 1 },
      { e: 0.5, show: '1/2' },
      { e: 0 },
    ],
    stepLabel: L(': 2', ': 2', ': 2'),
    labels: {
      pow: L('DARAJA', 'СТЕПЕНЬ', 'POWER'),
      val: L('QIYMAT', 'ЗНАЧЕНИЕ', 'VALUE'),
    },
    ask: L(
      'Keyingi qiymatni yozing',
      'Запиши следующее значение',
      'Write the next value',
    ),
    hints: {
      '0': L(
        "Nol chiqmaydi. Har qadam ikkiga BO'LISH, ayirish emas.",
        'Нуль не выйдет. Каждый шаг это ДЕЛЕНИЕ на два, а не вычитание.',
        'Zero will not come out. Each step is DIVISION by two, not subtraction.',
      ),
      '-2': L(
        "Manfiy son ham chiqmaydi. Musbat sonni ikkiga bo'lsak musbat qoladi.",
        'Отрицательное тоже не выйдет. Положительное на два делится в положительное.',
        'A negative will not come out either. A positive divided by two stays positive.',
      ),
      '*': L(
        "Yuqoridagi qiymatni ikkiga bo'ling.",
        'Раздели значение сверху на два.',
        'Divide the value above by two.',
      ),
    },
    after: L(
      "Qator tugadi. Yarim ko'rsatkich ildizni beradi, nolinchi daraja esa birni.",
      'Ряд закончен. Половинный показатель даёт корень, а нулевая степень единицу.',
      'The row is complete. A half exponent gives the root and the zero power gives one.',
    ),
  },
}

// ============================================================
// EKRAN 4. 2-USUL: ILDIZNI DARAJA BILAN. Darslikning misoli (9-§, 42-bet):
// to'rtinchi darajali ildiz besh o'n ikkinchi darajadan.
// ============================================================
const S4 = {
  eyebrow: L('2-USUL', 'СПОСОБ 2', 'METHOD 2'),
  title: L(
    "Ildiz ostidagi daraja",
    'Степень под корнем',
    'A power under the root',
  ),
  audio: [
    A('mount',
      "Ildiz ostida katta daraja turibdi. Uni hisoblab chiqarish shart emas.",
      'Под корнем стоит большая степень. Её не нужно вычислять.',
      'A big power stands under the root. There is no need to compute it.'),
    W('s2',
      "Besh o'n ikkinchi darajada, bu besh uchinchi darajaning to'rtinchi darajasi.",
      'Пять в двенадцатой это четвёртая степень пяти в кубе.',
      'Five to the twelfth is the fourth power of five cubed.'),
    W('s3',
      "To'rtinchi darajali ildiz to'rtinchi darajani olib tashlaydi.",
      'Корень четвёртой степени убирает четвёртую степень.',
      'A fourth root removes the fourth power.'),
    W('s4',
      "Xuddi shu narsa ko'rsatkichni bo'lish bilan chiqadi. O'n ikkini to'rtga bo'ldik.",
      'То же самое выходит делением показателя. Двенадцать разделили на четыре.',
      'The same comes out by dividing the exponent. Twelve divided by four.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {'⁴√(5'}
        <sup>12</sup>
        {')'}
      </Row>
    ),
    actions: [
      { id: 'pow', label: L("Ildiz ostini daraja qilib yozish", 'Записать подкоренное степенью', 'Write the radicand as a power') },
      { id: 'calc', label: L("Beshning darajasini hisoblash", 'Вычислить степень пяти', 'Compute the power of five') },
      { id: 'split', label: L("Ildizni hadlarga bo'lish", 'Раздать корень по слагаемым', 'Distribute the root over terms') },
    ],
    steps: [
      {
        action: 'pow',
        wrongs: [
          {
            action: 'calc',
            hint: L(
              "Bu son juda katta va u kerak emas. Daraja shaklida qoldirish qulayroq.",
              'Это число очень большое, и оно не нужно. Удобнее оставить в виде степени.',
              'That number is huge and it is not needed. Keeping the power form is easier.',
            ),
          },
          {
            action: 'split',
            hint: L(
              "Ildiz ostida yig'indi yo'q, ko'paytma bor. Bo'lishga hech narsa yo'q.",
              'Под корнем нет суммы, есть произведение. Раздавать нечего.',
              'There is no sum under the root, only a product. Nothing to distribute.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'pow',
              right: true,
              label: L('Darajaning darajasi', 'Степень степени', 'A power of a power'),
            },
            {
              id: 'root',
              label: L("Arifmetik ildiz ta'rifi", 'Определение арифметического корня', 'The definition of the arithmetic root'),
              hint: L(
                "Ta'rif keyingi qadamda ishlaydi. Hozir ildiz ostidagi ifoda qayta yozilmoqda.",
                'Определение сработает на следующем шаге. Сейчас переписывается подкоренное.',
                'The definition works on the next step. Right now the radicand is rewritten.',
              ),
            },
            {
              id: 'sum',
              label: L("Yig'indi qoidasi", 'Правило суммы', 'The sum rule'),
              hint: L(
                "Yig'indi yo'q. Bu yerda faqat daraja.",
                'Суммы нет. Здесь только степень.',
                'There is no sum. Only a power here.',
              ),
            },
          ],
        },
        ask: L(
          "Qavs ichida qanday asos turadi?",
          'Какое основание встанет в скобках?',
          'Which base goes into the brackets?',
        ),
        // Javob `sqrt(`/`abs(`/`^` talab qiladi, kompyuter klaviaturasida
        // bunday belgi yo'q — maydon ustida belgi qatori turadi (2026-08-27).
        // Javob `sqrt(`/`abs(`/`^` talab qiladi, kompyuter klaviaturasida
        // bunday belgi yo'q — maydon QATORINING ICHIDA uchta tugma turadi
        // (`√(`, `|(`, `^`), balandlik o'zgarmaydi (2026-08-27).
        mathKeys: true,
        answer: '5^3',
        accepts: ['125'],
        hints: {
          '5^4': L(
            "O'n ikkini to'rtga bo'lish kerak, ko'paytirish emas.",
            'Двенадцать надо разделить на четыре, а не умножить.',
            'Twelve must be divided by four, not multiplied.',
          ),
          '5^12': L(
            "Bu boshlang'ich yozuv. To'rtinchi daraja ko'rinishi kerak.",
            'Это исходная запись. Должна показаться четвёртая степень.',
            'That is the original record. The fourth power must appear.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'⁴√((5'}
            <sup>3</sup>
            {')'}
            <sup>4</sup>
            {')'}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'take', label: L('Ildizni chiqarish', 'Извлечь корень', 'Take the root') },
          { id: 'keep', label: L("Shundayligicha qoldirish", 'Оставить как есть', 'Leave it as it is') },
          { id: 'again', label: L("Yana daraja qilish", 'Возвести ещё раз', 'Raise it again') },
        ],
        action: 'take',
        wrongs: [
          {
            action: 'keep',
            hint: L(
              "To'rtinchi darajali ildiz va to'rtinchi daraja bir birini yo'q qiladi.",
              'Корень четвёртой степени и четвёртая степень уничтожают друг друга.',
              'A fourth root and a fourth power cancel each other.',
            ),
          },
          {
            action: 'again',
            hint: L(
              "Daraja allaqachon bor. Endi ildiz uni olib tashlaydi.",
              'Степень уже есть. Теперь корень её убирает.',
              'The power is already there. Now the root removes it.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'root',
              right: true,
              label: L("Arifmetik ildiz ta'rifi", 'Определение арифметического корня', 'The definition of the arithmetic root'),
            },
            {
              id: 'pow',
              label: L('Darajaning darajasi', 'Степень степени', 'A power of a power'),
              hint: L(
                "Bu oldingi qadam edi. Endi ildiz ishlaydi.",
                'Это был прошлый шаг. Теперь работает корень.',
                'That was the previous step. Now the root works.',
              ),
            },
            {
              id: 'mul',
              label: L("Ko'paytirish qoidasi", 'Правило умножения', 'The multiplication rule'),
              hint: L(
                "Ko'paytirish yo'q. Ildiz ostidan daraja chiqarilmoqda.",
                'Умножения нет. Из под корня выносится степень.',
                'There is no multiplication. A power is taken out of the root.',
              ),
            },
          ],
        },
        ask: L('Nima chiqdi?', 'Что вышло?', 'What came out?'),
        answer: '125',
        accepts: ['5^3'],
        hints: {
          '625': L(
            "Bu besh to'rtinchi darajada. Bizda esa besh uchinchi darajada.",
            'Это пять в четвёртой. А у нас пять в третьей.',
            'That is five to the fourth. Here it is five cubed.',
          ),
          '20': L(
            "Ildiz ko'rsatkichni bo'ladi, sonni emas.",
            'Корень делит показатель, а не число.',
            'The root divides the exponent, not the number.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'= 5'}
            <sup>3</sup>
            {' = 125'}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'div', label: L("Ko'rsatkichni bo'lish", 'Разделить показатель', 'Divide the exponent') },
          { id: 'mul', label: L("Ko'rsatkichni ko'paytirish", 'Умножить показатель', 'Multiply the exponent') },
          { id: 'keep', label: L("O'zgartirmaslik", 'Не менять', 'Leave it unchanged') },
        ],
        action: 'div',
        wrongs: [
          {
            action: 'mul',
            hint: L(
              "Ko'paytirsak qirq sakkiz chiqadi, javob esa uch darajali.",
              'При умножении вышло бы сорок восемь, а ответ третьей степени.',
              'Multiplying would give forty eight, but the answer is a third power.',
            ),
          },
          {
            action: 'keep',
            hint: L(
              "Ildiz ko'rsatkichga ta'sir qiladi, aks holda yozuv o'zgarmaydi.",
              'Корень влияет на показатель, иначе запись не изменится.',
              'The root affects the exponent, otherwise nothing changes.',
            ),
          },
        ],
        why: {
          question: L(
            "Nega bo'lish?",
            'Почему деление?',
            'Why division?',
          ),
          items: [
            {
              id: 'same',
              right: true,
              label: L(
                "Ildiz darajani teng bo'ladi",
                'Корень делит степень нацело',
                'The root divides the power evenly',
              ),
            },
            {
              id: 'small',
              label: L('Son kichrayadi', 'Число уменьшается', 'The number gets smaller'),
              hint: L(
                "Kichrayishi natija, sabab emas. Sabab darajaning ildiz ostidan chiqishi.",
                'Уменьшение это следствие, а не причина. Причина в том, что степень выходит из под корня.',
                'Getting smaller is a consequence, not a reason. The reason is the power leaving the root.',
              ),
            },
            {
              id: 'four',
              label: L("To'rtlik chiroyli ko'rinadi", 'Так красивее выглядит', 'It simply looks nicer'),
              hint: L(
                "Ko'rinish qoida bermaydi. Ta'rifga qarang.",
                'Внешний вид правила не даёт. Смотри определение.',
                'Appearance gives no rule. Look at the definition.',
              ),
            },
          ],
        },
        ask: L(
          "Ko'rsatkich qanday bo'ldi?",
          'Каким стал показатель?',
          'What did the exponent become?',
        ),
        answer: '3',
        accepts: ['12/4'],
        hints: {
          '12': L(
            "Bu boshlang'ich ko'rsatkich. Uni to'rtga bo'lish kerak.",
            'Это исходный показатель. Его надо разделить на четыре.',
            'That is the original exponent. It must be divided by four.',
          ),
          '48': L(
            "Bu ko'paytirish bo'ldi.",
            'Это умножение.',
            'That is multiplication.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'⁴√(5'}
            <sup>12</sup>
            {') = 5'}
            <sup>12/4</sup>
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 5. 3-USUL: MODUL (З5). Kvadrat ildiz ostidagi kvadratdan a emas,
// |a| chiqadi — buni o'quvchi MANFIY son qo'yib ko'radi.
// ============================================================
const S5 = {
  eyebrow: L('3-USUL', 'СПОСОБ 3', 'METHOD 3'),
  title: L(
    'Kvadrat ostidagi ishora',
    'Знак под квадратом',
    'The sign under the square',
  ),
  audio: [
    A('mount',
      "Ildiz ostida kvadrat turibdi. Javob a bo'ladi deb o'ylash oson, lekin tekshiramiz.",
      'Под корнем стоит квадрат. Легко подумать, что ответ это a, но проверим.',
      'A square stands under the root. It is easy to think the answer is a, but let us check.'),
    W('s2',
      "Minus uchda kvadrat to'qqiz, ildiz esa uch. Minus yo'qoldi.",
      'При минус трёх квадрат девять, а корень три. Минус исчез.',
      'At minus three the square is nine and the root is three. The minus vanished.'),
    W('s3',
      "Demak javob a emas, uning moduli.",
      'Значит ответ не a, а его модуль.',
      'So the answer is not a but its modulus.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {'√(a'}
        <sup>2</sup>
        {')'}
      </Row>
    ),
    actions: [
      { id: 'test', label: L("Manfiy son qo'yish", 'Поставить отрицательное число', 'Put in a negative number') },
      { id: 'take', label: L('Darrov a deb yozish', 'Сразу записать a', 'Write a right away') },
      { id: 'square', label: L('Kvadratga oshirish', 'Возвести в квадрат', 'Square it') },
    ],
    steps: [
      {
        action: 'test',
        wrongs: [
          {
            action: 'take',
            hint: L(
              "Shoshilmaymiz. Avval manfiy sonni qo'yib ko'ramiz.",
              'Не спешим. Сначала подставим отрицательное число.',
              'Not so fast. Let us substitute a negative number first.',
            ),
          },
          {
            action: 'square',
            hint: L(
              "Kvadrat allaqachon ildiz ostida turibdi.",
              'Квадрат уже стоит под корнем.',
              'The square is already under the root.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'check',
              right: true,
              label: L("Son bilan tekshirish", 'Проверка числом', 'A check with a number'),
            },
            {
              id: 'rule',
              label: L('Ildiz qoidasi', 'Правило корня', 'The root rule'),
              hint: L(
                "Qoidani hozir tekshirmoqdamiz. Buning uchun son kerak.",
                'Правило мы как раз проверяем. Для этого нужно число.',
                'The rule is exactly what we are testing. A number is needed for that.',
              ),
            },
            {
              id: 'sign',
              label: L('Ishora qoidasi', 'Правило знаков', 'The rule of signs'),
              hint: L(
                "Ishora qoidasi ko'paytirishda ishlaydi. Bu yerda ildiz.",
                'Правило знаков работает при умножении. Здесь корень.',
                'The rule of signs works in multiplication. Here we have a root.',
              ),
            },
          ],
        },
        ask: L(
          "a minus uchga teng. Yozuvning qiymati qancha?",
          'a равно минус три. Чему равно значение записи?',
          'a equals minus three. What is the value of the record?',
        ),
        answer: '3',
        accepts: ['3'],
        hints: {
          '-3': L(
            "Ildiz nomanfiy son beradi. Minus uch nomanfiy emas.",
            'Корень даёт неотрицательное число. Минус три не неотрицательное.',
            'A root gives a non-negative number. Minus three is not non-negative.',
          ),
          '9': L(
            "To'qqiz bu ildiz ostidagi ifoda. Ildizni chiqarish kerak.",
            'Девять это подкоренное выражение. Надо извлечь корень.',
            'Nine is the radicand. The root must be taken.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'a = −3:   √9 = 3'}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'abs', label: L('Modul bilan yozish', 'Записать с модулем', 'Write it with a modulus') },
          { id: 'plain', label: L('a deb yozish', 'Записать a', 'Write a') },
          { id: 'minus', label: L('Minus a deb yozish', 'Записать минус a', 'Write minus a') },
        ],
        action: 'abs',
        wrongs: [
          {
            action: 'plain',
            hint: L(
              "Minus uchda a manfiy, javob esa musbat chiqdi. Yozuv mos kelmaydi.",
              'При минус трёх a отрицательно, а ответ вышел положительным. Запись не годится.',
              'At minus three a is negative while the answer came out positive. The record does not fit.',
            ),
          },
          {
            action: 'minus',
            hint: L(
              "Musbat a da minus a manfiy chiqadi, ildiz esa nomanfiy.",
              'При положительном a минус a отрицательно, а корень неотрицателен.',
              'At a positive a, minus a is negative while the root is non-negative.',
            ),
          },
        ],
        why: {
          question: L(
            'Nega modul?',
            'Почему модуль?',
            'Why the modulus?',
          ),
          items: [
            {
              id: 'nonneg',
              right: true,
              label: L(
                "Ildiz nomanfiy son beradi",
                'Корень даёт неотрицательное число',
                'A root gives a non-negative number',
              ),
            },
            {
              id: 'short',
              label: L('Modul qisqa yozuv', 'Модуль это короткая запись', 'The modulus is a short record'),
              hint: L(
                "Qisqalik sabab emas. Sabab ildizning nomanfiyligi.",
                'Краткость не причина. Причина в неотрицательности корня.',
                'Brevity is not the reason. The reason is that a root is non-negative.',
              ),
            },
            {
              id: 'square',
              label: L('Kvadrat modulni talab qiladi', 'Квадрат требует модуль', 'A square demands a modulus'),
              hint: L(
                "Kvadratning o'zi modul talab qilmaydi. Talab ildizdan keladi.",
                'Сам квадрат модуля не требует. Требование приходит от корня.',
                'The square itself demands nothing. The demand comes from the root.',
              ),
            },
          ],
        },
        ask: L(
          'Javobni umumiy ko\'rinishda yozing',
          'Запиши ответ в общем виде',
          'Write the answer in general form',
        ),
        // Javob `sqrt(`/`abs(`/`^` talab qiladi, kompyuter klaviaturasida
        // bunday belgi yo'q — maydon ustida belgi qatori turadi (2026-08-27).
        // Javob `sqrt(`/`abs(`/`^` talab qiladi, kompyuter klaviaturasida
        // bunday belgi yo'q — maydon QATORINING ICHIDA uchta tugma turadi
        // (`√(`, `|(`, `^`), balandlik o'zgarmaydi (2026-08-27).
        mathKeys: true,
        answer: 'abs(a)',
        accepts: ['abs(a)'],
        hints: {
          'a': L(
            "Minus uchni qo'yib ko'ring, chapda uch chiqadi, o'ngda minus uch.",
            'Подставь минус три. Слева выйдет три, справа минус три.',
            'Substitute minus three. The left gives three, the right minus three.',
          ),
          '-a': L(
            "Musbat a da bu manfiy chiqadi, ildiz esa nomanfiy.",
            'При положительном a это выйдет отрицательным, а корень неотрицателен.',
            'At a positive a this comes out negative while a root is non-negative.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'√(a'}
            <sup>2</sup>
            {') = |a|'}
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 6. BIRGA YECHAMIZ. Xukning savoli. MUVAFFAQIYATSIZ QADAM: «demak
// ildiz ikki son beradi» — va u TA'RIF bilan rad etiladi (З29).
// ============================================================
const S6 = {
  eyebrow: L('BIRGA YECHAMIZ', 'РЕШАЕМ ВМЕСТЕ', 'SOLVING TOGETHER'),
  title: L(
    'Tenglama va belgi',
    'Уравнение и знак',
    'The equation and the sign',
  ),
  audio: [
    A('mount',
      "Birinchi ekrandagi savolga qaytamiz.",
      'Возвращаемся к вопросу с первого экрана.',
      'We return to the question from the first screen.'),
    W('s3',
      "Ikkala son ham kvadratda o'n olti beradi, bu rost.",
      'Оба числа в квадрате дают шестнадцать, это правда.',
      'Both numbers give sixteen when squared, that is true.'),
    W('s5',
      "Lekin ta'rif nomanfiy sonni talab qiladi, ya'ni belgi bittasini tanlaydi.",
      'Но определение требует неотрицательное число, то есть знак выбирает одно.',
      'But the definition demands a non-negative number, so the sign picks one.'),
    W('s6',
      "Tenglamaning ikki ildizi bor, yozuvning esa bitta qiymati.",
      'У уравнения два корня, а у записи одно значение.',
      'The equation has two roots while the record has one value.'),
  ],
  props: {
    task: L(
      "√16 bitta son beradimi yoki ikkita?",
      'Даёт √16 одно число или два?',
      'Does √16 give one number or two?',
    ),
    lines: [
      {
        text: 'x · x = 16',
        note: L('tenglama', 'уравнение', 'the equation'),
      },
      {
        text: L(
          "To'rt va minus to'rt, ikkalasi ham to'g'ri keladi",
          'Четыре и минус четыре, оба подходят',
          'Four and minus four, both fit',
        ),
      },
      {
        text: L(
          "Demak √16 ikki son beradi",
          'Значит √16 даёт два числа',
          'So √16 gives two numbers',
        ),
        tone: 'no',
        ask: {
          question: L(
            "Ta'rif nima talab qiladi?",
            'Чего требует определение?',
            'What does the definition demand?',
          ),
          items: [
            {
              id: 'nonneg',
              right: true,
              label: L('Nomanfiy sonni', 'Неотрицательное число', 'A non-negative number'),
            },
            {
              id: 'any',
              label: L('Har qanday sonni', 'Любое число', 'Any number'),
              hint: L(
                "Unda belgi ikki qiymatli bo'lib qolardi, va yozuvdan foyda yo'q edi.",
                'Тогда знак был бы двузначным, и от записи не было бы пользы.',
                'Then the sign would be two-valued and the record would be useless.',
              ),
            },
            {
              id: 'pos',
              label: L('Faqat musbatni', 'Только положительное', 'Only a positive one'),
              hint: L(
                "Nol ham bo'ladi. Nolning ildizi nol. Shuning uchun nomanfiy.",
                'Нуль тоже годится. Корень из нуля это нуль. Поэтому неотрицательное.',
                'Zero fits as well. The root of zero is zero. Hence non-negative.',
              ),
            },
          ],
          after: L(
            "Ta'rif nomanfiy sonni tanlaydi",
            'Определение выбирает неотрицательное',
            'The definition picks the non-negative one',
          ),
        },
      },
      {
        text: L(
          "Bunday xulosa qilinmaydi",
          'Такой вывод делать нельзя',
          'This conclusion is not allowed',
        ),
        tone: 'no',
      },
      {
        text: '√16 = 4',
        ask: {
          question: L(
            "Unda minus to'rt qayerda qoldi?",
            'А где тогда осталось минус четыре?',
            'So where did minus four go?',
          ),
          items: [
            {
              id: 'eq',
              right: true,
              label: L('Tenglamaning ildizi', 'Корень уравнения', 'A root of the equation'),
            },
            {
              id: 'lost',
              label: L("Yo'qoldi", 'Потерялось', 'It got lost'),
              hint: L(
                "Yo'qolmadi. U tenglamaning ikkinchi ildizi bo'lib qoladi.",
                'Не потерялось. Оно остаётся вторым корнем уравнения.',
                'Nothing got lost. It remains the second root of the equation.',
              ),
            },
            {
              id: 'wrong',
              label: L("Xato son", 'Неверное число', 'A wrong number'),
              hint: L(
                "Minus to'rt kvadratda o'n olti beradi, ya'ni tenglamani qanoatlantiradi.",
                'Минус четыре в квадрате даёт шестнадцать, то есть уравнению оно удовлетворяет.',
                'Minus four squared gives sixteen, so it satisfies the equation.',
              ),
            },
          ],
          after: L(
            "Tenglamada ikkita, belgida bitta",
            'В уравнении два, у знака одно',
            'Two in the equation, one for the sign',
          ),
        },
      },
      {
        text: L(
          "Belgi bitta nomanfiy sonni beradi",
          'Знак даёт одно неотрицательное число',
          'The sign gives one non-negative number',
        ),
        tone: 'ok',
      },
    ],
  },
}

// ============================================================
// EKRAN 7. CHEGARA. Juft va toq darajali ildiz yonma yon: bittasi manfiy
// son ostida ishlamaydi, ikkinchisi ishlaydi.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L(
    'Juft va toq ildiz',
    'Чётный и нечётный корень',
    'An even and an odd root',
  ),
  audio: [
    A('mount',
      "Ikki yozuv. Bittasida kvadrat ildiz, ikkinchisida kub ildiz.",
      'Две записи. В одной квадратный корень, в другой кубический.',
      'Two records. One holds a square root, the other a cube root.'),
    A('why',
      "Kvadrat ildiz ostida manfiy son bo'lmaydi, kub ildiz ostida bo'ladi.",
      'Под квадратным корнем отрицательного быть не может, под кубическим может.',
      'A negative cannot sit under a square root, but it can under a cube root.'),
  ],
  props: {
    left: (
      <Row size="row" align="center">
        {'√(x − 5)'}
      </Row>
    ),
    right: (
      <Row size="row" align="center">
        {'∛(x − 5)'}
      </Row>
    ),
    odzLeft: L('?', '?', '?'),
    odzRight: L('har qanday x', 'любое x', 'any x'),
    question: L(
      "Chap yozuv hisoblanadigan eng kichik x ni yozing",
      'Запиши наименьшее x, при котором левая запись ещё считается',
      'Write the smallest x at which the left record still computes',
    ),
    answer: [5],
    hints: {
      '0': L(
        "Nolda ildiz ostida minus besh chiqadi, kvadrat ildiz esa manfiydan olinmaydi.",
        'При нуле под корнем минус пять, а квадратный корень из отрицательного не берут.',
        'At zero the radicand is minus five, and a square root of a negative is not taken.',
      ),
      '4': L(
        "To'rtda ildiz ostida minus bir. Bu ham manfiy.",
        'При четырёх под корнем минус один. Это тоже отрицательное.',
        'At four the radicand is minus one. That is negative too.',
      ),
      '6': L(
        "Oltida hisoblanadi, lekin eng kichik x izlanmoqda.",
        'При шести считается, но ищут наименьшее x.',
        'It computes at six, but the smallest x is asked.',
      ),
      '*': L(
        "Ildiz ostidagi ifoda nolga teng bo'lgan joyni toping.",
        'Найди, где подкоренное выражение равно нулю.',
        'Find where the radicand equals zero.',
      ),
    },
    note: L(
      "Nolda ildiz bor, undan pastda esa yo'q",
      'В нуле корень есть, а ниже его нет',
      'At zero the root exists, below it does not',
    ),
  },
}

// ============================================================
// EKRAN 8. QOIDA. Darslik 8-§, 39-bet va 9-§, 42-bet.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    'Arifmetik ildiz qoidasi',
    'Правило арифметического корня',
    'The rule of the arithmetic root',
  ),
  audio: [
    A('mount',
      "Qoidani o'zingiz yig'asiz, keyin darslik matni ochiladi.",
      'Правило соберёшь сам, потом откроется текст учебника.',
      'You will assemble the rule yourself, then the textbook text opens.'),
    W('card',
      "Birinchi ekrandagi savol javobini oldi. Belgi bitta son beradi.",
      'Вопрос с первого экрана получил ответ. Знак даёт одно число.',
      'The question from the first screen got its answer. The sign gives one number.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L('Arifmetik ildiz — bu', 'Арифметический корень это', 'An arithmetic root is') },
      { id: 'f2', label: L('nomanfiy son', 'неотрицательное число', 'a non-negative number') },
      { id: 'f3', label: L('uning n-darajasi', 'чья n-я степень', 'whose n-th power') },
      { id: 'f4', label: L('ildiz ostidagi ifodaga teng', 'равна подкоренному выражению', 'equals the radicand') },
      { id: 'w1', label: L('ikki son', 'два числа', 'two numbers') },
      { id: 'w2', label: L('har qanday son', 'любое число', 'any number') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilganda ta'rif buziladi. Ildiz nechta son berishini tekshiring.",
      'В такой сборке определение ломается. Проверь, сколько чисел даёт корень.',
      'Assembled this way the definition breaks. Check how many numbers a root gives.',
    ),
    card: {
      title: L('ARIFMETIK ILDIZ', 'АРИФМЕТИЧЕСКИЙ КОРЕНЬ', 'THE ARITHMETIC ROOT'),
      lines: [
        L(
          "a nomanfiy sonning n-darajali arifmetik ildizi — n-darajasi a ga teng bo'lgan nomanfiy son",
          'Арифметический корень n-й степени из неотрицательного a это неотрицательное число, n-я степень которого равна a',
          'The n-th arithmetic root of a non-negative a is the non-negative number whose n-th power equals a',
        ),
        L(
          "n-darajali ildiz a^m dan a^(m/n) ga teng, a > 0 bo'lganda",
          'Корень n-й степени из a^m равен a^(m/n) при a > 0',
          'The n-th root of a^m equals a^(m/n) when a > 0',
        ),
        L(
          "Kvadrat ildiz ostidagi kvadratdan modul chiqadi",
          'Из квадрата под квадратным корнем выходит модуль',
          'A square under a square root yields the modulus',
        ),
      ],
      source: L('Darslik, 8-§ 39-bet va 9-§ 42-bet', 'Учебник, § 8 стр. 39 и § 9 стр. 42', 'Textbook, section 8 page 39 and section 9 page 42'),
      locked: L("Qoida yig'ilgandan keyin ochiladi", 'Откроется после сборки правила', 'Opens once the rule is assembled'),
    },
    recall: {
      left: L('x · x = 16', 'x · x = 16', 'x · x = 16'),
      right: L('√16 = 4', '√16 = 4', '√16 = 4'),
      winner: 'right',
      note: L(
        "Tenglamada ikki ildiz, belgida bitta qiymat",
        'В уравнении два корня, у знака одно значение',
        'Two roots in the equation, one value for the sign',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ, ZANJIR. To'rt hisob, oxirgisida MODUL.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    'Ildizlarni hisoblang',
    'Вычисли корни',
    'Compute the roots',
  ),
  audio: [
    A('mount',
      "To'rt topshiriq. Oxirgisi modulni tekshiradi.",
      'Четыре задания. Последнее проверяет модуль.',
      'Four tasks. The last one tests the modulus.'),
    W('t1',
      "Ikki beshinchi darajada o'ttiz ikki.",
      'Два в пятой степени тридцать два.',
      'Two to the fifth is thirty two.'),
    W('t2',
      "Uch to'rtinchi darajada sakson bir, demak ildiz uchga teng.",
      'Три в четвёртой восемьдесят один, значит корень равен трём.',
      'Three to the fourth is eighty one, so the root is three.'),
    W('t3',
      "Yarim ko'rsatkich kvadrat ildizni beradi.",
      'Половинный показатель даёт квадратный корень.',
      'A half exponent gives the square root.'),
    W('t4',
      "Minus besh kvadratda yigirma besh, ildiz esa besh. Ishora yo'qoldi.",
      'Минус пять в квадрате двадцать пять, а корень пять. Знак исчез.',
      'Minus five squared is twenty five and the root is five. The sign vanished.'),
  ],
  props: {
    items: [
      {
        prompt: L(
          "Beshinchi darajali ildiz o'ttiz ikkidan",
          'Корень пятой степени из тридцати двух',
          'The fifth root of thirty two',
        ),
        show: (
          <Row size="row" align="center">
            {'⁵√32'}
          </Row>
        ),
        kind: 'number',
        answer: '2',
        accepts: ['2'],
        hints: {
          '6': L(
            "O'ttiz ikkini beshga bo'lmaymiz. Beshinchi darajasi o'ttiz ikki bo'lgan sonni izlaymiz.",
            'Тридцать два на пять не делим. Ищем число, пятая степень которого тридцать два.',
            'We do not divide thirty two by five. We look for the number whose fifth power is thirty two.',
          ),
          '4': L(
            "To'rt beshinchi darajada juda katta chiqadi.",
            'Четыре в пятой выйдет слишком большим.',
            'Four to the fifth comes out far too big.',
          ),
        },
        closed: L('⁵√32 = 2', '⁵√32 = 2', '⁵√32 = 2'),
      },
      {
        prompt: L(
          "To'rtinchi darajali ildiz sakson birdan",
          'Корень четвёртой степени из восьмидесяти одного',
          'The fourth root of eighty one',
        ),
        show: (
          <Row size="row" align="center">
            {'⁴√81'}
          </Row>
        ),
        kind: 'number',
        answer: '3',
        accepts: ['3'],
        hints: {
          '9': L(
            "To'qqiz kvadratda sakson bir beradi, bizga to'rtinchi daraja kerak.",
            'Девять в квадрате даёт восемьдесят один, а нужна четвёртая степень.',
            'Nine squared gives eighty one, but the fourth power is needed.',
          ),
          '-3': L(
            "Minus uch to'rtinchi darajada sakson bir beradi, lekin arifmetik ildiz nomanfiy.",
            'Минус три в четвёртой даёт восемьдесят один, но арифметический корень неотрицателен.',
            'Minus three to the fourth gives eighty one, but an arithmetic root is non-negative.',
          ),
        },
        closed: L('⁴√81 = 3', '⁴√81 = 3', '⁴√81 = 3'),
      },
      {
        prompt: L(
          "To'qqizning yarim darajasi",
          'Девять в степени одна вторая',
          'Nine to the power one half',
        ),
        show: (
          <Row size="row" align="center">
            {'9'}
            <sup>1/2</sup>
          </Row>
        ),
        kind: 'number',
        answer: '3',
        accepts: ['3'],
        hints: {
          '4.5': L(
            "Yarim ko'rsatkich ikkiga bo'lish emas. U kvadrat ildizni bildiradi.",
            'Половинный показатель это не деление на два. Он означает квадратный корень.',
            'A half exponent is not division by two. It means the square root.',
          ),
          '81': L(
            "Bu kvadratga oshirish bo'ldi.",
            'Это возведение в квадрат.',
            'That is squaring.',
          ),
        },
        closed: L('9 daraja 1/2 = 3', '9 в степени 1/2 = 3', '9 to the 1/2 = 3'),
      },
      {
        prompt: L(
          "Minus beshning kvadratidan ildiz",
          'Корень из квадрата минус пяти',
          'The root of the square of minus five',
        ),
        show: (
          <Row size="row" align="center">
            {'√((−5)'}
            <sup>2</sup>
            {')'}
          </Row>
        ),
        kind: 'number',
        answer: '5',
        accepts: ['5'],
        hints: {
          '-5': L(
            "Ildiz nomanfiy son beradi, shuning uchun ishora tushib qoladi.",
            'Корень даёт неотрицательное число, поэтому знак пропадает.',
            'A root gives a non-negative number, so the sign disappears.',
          ),
          '25': L(
            "Yigirma besh bu ildiz ostidagi ifoda.",
            'Двадцать пять это подкоренное выражение.',
            'Twenty five is the radicand.',
          ),
        },
        closed: L('√25 = 5', '√25 = 5', '√25 = 5'),
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ, QADAMLAR NOMLANGAN: modul harflar bilan.
// ============================================================
const S10 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    'Modul harflar bilan',
    'Модуль с буквами',
    'The modulus with letters',
  ),
  audio: [
    A('mount',
      "Ildiz ostida oltinchi daraja. Uch qadam nomlangan.",
      'Под корнем шестая степень. Три шага названы.',
      'A sixth power under the root. Three steps are named.'),
    W('f1',
      "Oltini ikkiga bo'ldik, uch chiqdi.",
      'Шесть разделили на два, вышло три.',
      'Six divided by two gives three.'),
    W('f2',
      "Toq daraja ishorani saqlaydi, shuning uchun modul kerak.",
      'Нечётная степень сохраняет знак, поэтому нужен модуль.',
      'An odd power keeps the sign, so a modulus is needed.'),
    W('f3',
      "Minus ikkida javob sakkiz, musbat.",
      'При минус двух ответ восемь, положительный.',
      'At minus two the answer is eight, positive.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {'√(a'}
        <sup>6</sup>
        {')'}
      </Row>
    ),
    fields: [
      {
        ask: L(
          "Ko'rsatkichni yozing",
          'Запиши показатель',
          'Write the exponent',
        ),
        kind: 'number',
        answer: '3',
        accepts: ['3'],
        hints: {
          '6': L(
            "Oltini ildiz darajasiga bo'lish kerak.",
            'Шесть надо разделить на степень корня.',
            'Six must be divided by the root index.',
          ),
          '12': L(
            "Bu ko'paytirish bo'ldi.",
            'Это умножение.',
            'That is multiplication.',
          ),
        },
      },
      {
        ask: L(
          'Javobni yozing',
          'Запиши ответ',
          'Write the answer',
        ),
        kind: 'expr',
        // Javob `sqrt(`/`abs(`/`^` talab qiladi, kompyuter klaviaturasida
        // bunday belgi yo'q — maydon ustida belgi qatori turadi (2026-08-27).
        // Javob `sqrt(`/`abs(`/`^` talab qiladi, kompyuter klaviaturasida
        // bunday belgi yo'q — maydon QATORINING ICHIDA uchta tugma turadi
        // (`√(`, `|(`, `^`), balandlik o'zgarmaydi (2026-08-27).
        mathKeys: true,
        answer: 'abs(a^3)',
        accepts: ['abs(a)^3'],
        hints: {
          'a^3': L(
            "Minus ikkida bu manfiy chiqadi, ildiz esa nomanfiy.",
            'При минус двух это выйдет отрицательным, а корень неотрицателен.',
            'At minus two this comes out negative while a root is non-negative.',
          ),
          'a^6': L(
            "Ildiz ko'rsatkichni kamaytiradi.",
            'Корень уменьшает показатель.',
            'The root lowers the exponent.',
          ),
        },
      },
      {
        ask: L(
          "a minus ikkiga teng. Javob qancha?",
          'a равно минус двум. Чему равен ответ?',
          'a equals minus two. What is the answer?',
        ),
        kind: 'number',
        answer: '8',
        accepts: ['8'],
        hints: {
          '-8': L(
            "Modul manfiy qiymat bermaydi.",
            'Модуль отрицательного значения не даёт.',
            'A modulus never gives a negative value.',
          ),
          '64': L(
            "Oltmish to'rt bu ildiz ostidagi ifoda.",
            'Шестьдесят четыре это подкоренное выражение.',
            'Sixty four is the radicand.',
          ),
        },
      },
    ],
  },
}

// ============================================================
// EKRAN 11. ASBOBSIZ. Blokning yakuni: ildiz, daraja va SHART birga.
// ============================================================
const S11 = {
  eyebrow: L('MUSTAQIL', 'САМ', 'ON YOUR OWN'),
  title: L(
    'Ildiz, daraja va shart',
    'Корень, степень и условие',
    'Root, power and condition',
  ),
  audio: [
    A('mount',
      "Bu ekranda asbob yo'q. Yozuvni soddalashtiring va shartni yozing.",
      'На этом экране прибора нет. Упрости запись и запиши условие.',
      'There is no instrument here. Simplify the record and write the condition.'),
    A('why',
      "Ildiz ostidagi sakkizinchi daraja to'rtinchi ildizdan keyin kvadrat bo'ladi.",
      'Восьмая степень под корнем четвёртой степени становится квадратом.',
      'An eighth power under a fourth root becomes a square.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {'⁴√(a'}
        <sup>8</sup>
        {') : a'}
        <sup>2</sup>
      </Row>
    ),
    result: {
      ask: L(
        'Natijani yozing',
        'Запиши результат',
        'Write the result',
      ),
      kind: 'expr',
      answer: '1',
      accepts: ['1'],
      hints: {
        'a^2': L(
          "Bu faqat ildizning natijasi. Uni yana a kvadratga bo'lish kerak.",
          'Это только результат корня. Его надо ещё разделить на a в квадрате.',
          'That is only the result of the root. It must still be divided by a squared.',
        ),
        'a^4': L(
          "Ildiz ko'rsatkichni ikki barobar kamaytiradi, sakkizdan ikki chiqadi.",
          'Корень уменьшает показатель вдвое. Из восьми выходит два.',
          'The root halves the exponent. Eight becomes two.',
        ),
        '0': L(
          "Bir xil ifodalarni bo'lganda bir chiqadi, nol emas.",
          'При делении одинаковых выражений выходит единица, а не нуль.',
          'Dividing equal expressions gives one, not zero.',
        ),
      },
    },
    odz: {
      ask: L(
        'Shartni yozing',
        'Запиши условие',
        'Write the condition',
      ),
      varName: 'a',
      excluded: [0],
      accepts: ['a != 0', '0 != a'],
      hints: {
        'a != 2': L(
          "Ikkida maxraj to'rtga teng, hammasi hisoblanadi.",
          'При двойке знаменатель равен четырём, всё считается.',
          'At two the denominator equals four and everything computes.',
        ),
        'a != -2': L(
          "Minus ikkida ham maxraj to'rt, taqiq yo'q.",
          'При минус двух знаменатель тоже четыре, запрета нет.',
          'At minus two the denominator is four as well, no restriction.',
        ),
      },
    },
    proof: {
      varName: 'a',
      from: '(a^8)^(1/4)/a^2',
      to: '1',
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
      "Javob bir, lekin nolda yozuv hisoblanmaydi",
      'Ответ единица, но в нуле запись не считается',
      'The answer is one, but at zero the record does not compute',
    ),
  },
}

// ============================================================
// EKRAN 12. TUZOQ (З4). Ildiz hadlarga bo'lib chiqarilgan — eng qadimgi
// xato, va u SON bilan rad etiladi.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Ildiz va yig'indi",
    'Корень и сумма',
    'The root and the sum',
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
          "Ildiz ostida 9 va 16 ning yig'indisi",
          'Под корнем сумма 9 и 16',
          'Under the root is the sum of 9 and 16',
        ),
      },
      {
        id: 'r2',
        show: L(
          "Har hadning ildizini olamiz, 3 va 4",
          'Берём корень каждого слагаемого, 3 и 4',
          'We take the root of each term, 3 and 4',
        ),
      },
      {
        id: 'r3',
        show: L(
          "Javob 7",
          'Ответ 7',
          'The answer is 7',
        ),
      },
      {
        id: 'r4',
        show: L(
          "Tekshirish, 25 ning ildizi 5",
          'Проверка: корень из 25 равен 5',
          'Check: the root of 25 is 5',
        ),
      },
    ],
    answerId: 'r2',
    hints: {
      'r1': L(
        "Bu satr to'g'ri, ildiz ostida haqiqatan yig'indi.",
        'Эта строка верна. Под корнем действительно сумма.',
        'This line is correct. There really is a sum under the root.',
      ),
      'r3': L(
        "Bu yuqoridagi satrdan to'g'ri chiqarilgan. Xato balandroqda.",
        'Это верно выведено из строки выше. Ошибка выше.',
        'This follows correctly from the line above. The error is higher.',
      ),
      'r4': L(
        "Bu satr rost va u boshqa javob beradi, ya'ni yechimda xato bor.",
        'Эта строка верна и даёт другой ответ, значит в решении ошибка.',
        'This line is true and gives a different answer, so the solution has an error.',
      ),
    },
    ask: {
      label: L("Son qo'ying", 'Поставь число', 'Put in a number'),
      of: 'sqrt(x-5)',
      varName: 'x',
      wrong: L(
        "Bu qiymatda ildiz hisoblanadi. Ildiz ostida manfiy son chiqadigan sonni oling.",
        'При этом значении корень считается. Возьми число, при котором подкоренное отрицательно.',
        'At this value the root computes. Take a number that makes the radicand negative.',
      ),
      note: L(
        "Ildiz ostida manfiy son bo'lsa, kvadrat ildiz hisoblanmaydi. Yig'indining ildizi esa ildizlarning yig'indisiga teng emas.",
        'Если подкоренное отрицательно, квадратный корень не считается. А корень суммы не равен сумме корней.',
        'If the radicand is negative the square root does not compute. And the root of a sum is not the sum of roots.',
      ),
    },
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH. Blokning ikki mahorati birga: modul va shart.
// ============================================================
const S13 = {
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    'Modul va taqiq birga',
    'Модуль и запрет вместе',
    'The modulus and the restriction together',
  ),
  audio: [
    A('mount',
      "Endi teskarisi. Javob berilgan, yozuvni o'zingiz tuzasiz.",
      'Теперь наоборот. Ответ дан, запись составишь сам.',
      'Now the other way round. The answer is given, you build the record.'),
    A('why',
      "Modul o'sha bo'lib qolishi kerak, lekin nolda yozuv hisoblanmasin.",
      'Модуль должен остаться тем же, но в нуле запись считаться не должна.',
      'The modulus must stay the same, but at zero the record must not compute.'),
  ],
  props: {
    prompt: L(
      "Kvadrat ildiz a kvadratdan ga teng yozuv toping, lekin uning qiymati a = 0 da bo'lmasin",
      'Запиши выражение, равное корню из a в квадрате, у которого нет значения при a = 0',
      'Write an expression equal to the root of a squared that has no value at a = 0',
    ),
    reduceTo: 'abs(a)',
    excluded: [0],
    varName: 'a',
    hints: {
      'abs(a)': L(
        "Bu javobning o'zi, unda taqiq yo'q.",
        'Это сам ответ, в нём запрета нет.',
        'That is the answer itself and it has no restriction.',
      ),
      'a': L(
        "Manfiy a da bu manfiy chiqadi, modul esa nomanfiy.",
        'При отрицательном a это выйдет отрицательным, а модуль неотрицателен.',
        'At a negative a this comes out negative while a modulus is non-negative.',
      ),
    },
    note: L(
      "Ko'paytuvchi taqiqni keltirdi, modul esa o'zgarmadi",
      'Множитель принёс запрет, а модуль не изменился',
      'The factor brought the restriction and the modulus stayed',
    ),
  },
}

// ============================================================
// EKRAN 14. BLITS.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    'Ildiz belgilari',
    'Признаки корня',
    'The marks of a root',
  ),
  audio: [
    A('mount',
      "To'rt savol. Ular hisob haqida emas, belgi haqida.",
      'Четыре вопроса. Они не про вычисление, а про признак.',
      'Four questions. They are not about computing but about the mark.'),
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
        tag: 'З29',
        ask: L(
          "√25 nechta son beradi?",
          'Сколько чисел даёт √25?',
          'How many numbers does √25 give?',
        ),
        options: [
          { id: 'one', right: true, label: L('Bitta, 5', 'Одно, 5', 'One, 5') },
          { id: 'two', label: L('Ikkita, 5 va −5', 'Два, 5 и −5', 'Two, 5 and −5') },
          { id: 'none', label: L('Hech qanday', 'Ни одного', 'None') },
          { id: 'many', label: L('Cheksiz ko\'p', 'Бесконечно много', 'Infinitely many') },
        ],
        hint: L(
          "Ta'rif nomanfiy sonni talab qiladi.",
          'Определение требует неотрицательное число.',
          'The definition demands a non-negative number.',
        ),
        ok: L(
          "Tenglamaning ikki ildizi bo'ladi, belgi esa bittasini beradi.",
          'У уравнения бывает два корня, а знак даёт одно число.',
          'An equation may have two roots, but the sign gives one number.',
        ),
      },
      {
        id: 'q2',
        tag: 'З4',
        ask: L(
          "√(9 + 16) nimaga teng?",
          'Чему равно √(9 + 16)?',
          'What does √(9 + 16) equal?',
        ),
        options: [
          { id: 'five', right: true, label: L('5', '5', '5') },
          { id: 'seven', label: L('7', '7', '7') },
          { id: 'twelve', label: L('12', '12', '12') },
          { id: 'twentyfive', label: L('25', '25', '25') },
        ],
        hint: L(
          "Avval qo'shish, keyin ildiz. Ildizni hadlarga bo'lib chiqarish mumkin emas.",
          'Сначала сложение, потом корень. Раздавать корень по слагаемым нельзя.',
          'First the addition, then the root. A root cannot be distributed over terms.',
        ),
        ok: L(
          "To'qqiz plyus o'n olti yigirma besh, uning ildizi besh. Uch plyus to'rt esa yetti, va bu boshqa son.",
          'Девять плюс шестнадцать двадцать пять, корень из него пять. А три плюс четыре семь, и это другое число.',
          'Nine plus sixteen is twenty five whose root is five. Three plus four is seven, a different number.',
        ),
      },
      {
        id: 'q3',
        tag: 'З5',
        ask: L(
          "√(a²) nimaga teng?",
          'Чему равно √(a²)?',
          'What does √(a²) equal?',
        ),
        options: [
          { id: 'abs', right: true, label: L('|a|', '|a|', '|a|') },
          { id: 'a', label: L('a', 'a', 'a') },
          { id: 'minus', label: L('−a', '−a', '−a') },
          { id: 'sq', label: L('a²', 'a²', 'a²') },
        ],
        hint: L(
          "a minus uchga teng bo'lsa tekshiring.",
          'Проверь при a, равном минус трём.',
          'Check it at a equal to minus three.',
        ),
        ok: L(
          "Ildiz nomanfiy son beradi, shuning uchun javobda modul turadi.",
          'Корень даёт неотрицательное число, поэтому в ответе стоит модуль.',
          'A root gives a non-negative number, so the answer holds a modulus.',
        ),
      },
      {
        id: 'q4',
        tag: 'З16',
        ask: L(
          "a^(1/3) nimani bildiradi?",
          'Что означает a^(1/3)?',
          'What does a^(1/3) mean?',
        ),
        options: [
          { id: 'root', right: true, label: L('Kub ildiz a dan', 'Кубический корень из a', 'The cube root of a') },
          { id: 'div', label: L("a ni uchga bo'lish", 'Деление a на три', 'Dividing a by three') },
          { id: 'pow', label: L('a uchinchi darajada', 'a в третьей степени', 'a to the third power') },
          { id: 'third', label: L('a ning uchdan biri', 'Треть от a', 'One third of a') },
        ],
        hint: L(
          "Qatorni eslang. Yarim ko'rsatkich kvadrat ildizni bergan edi.",
          'Вспомни ряд. Половинный показатель давал квадратный корень.',
          'Recall the row. A half exponent gave the square root.',
        ),
        ok: L(
          "Maxrajdagi son ildizning darajasi bo'ladi, surat esa ildiz ostidagi daraja.",
          'Число в знаменателе становится степенью корня, а числитель степенью под корнем.',
          'The denominator becomes the root index and the numerator the power under it.',
        ),
      },
    ],
    scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
    stepLabel: L('Savol', 'Вопрос', 'Question'),
  },
}

// ============================================================
// EKRAN 15. YAKUN. Blok yopiladi.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    'Ildiz va kasr daraja',
    'Корень и дробная степень',
    'The root and the fractional power',
  ),
  audio: [
    A('s0',
      "Xukdagi savol javobini oldi. Belgi bitta nomanfiy son beradi.",
      'Вопрос с хука получил ответ. Знак даёт одно неотрицательное число.',
      'The question from the hook has its answer. The sign gives one non-negative number.'),
    A('s1',
      "Uch usul qoldi. Qatorni davom ettirish, ildizni daraja bilan yozish va modulni tekshirish.",
      'Остаются три способа. Продолжить ряд, записать корень степенью и проверить модуль.',
      'Three methods remain. Continue the row, write the root as a power, and test the modulus.'),
    A('s2',
      "Birinchi blok tugadi. Keyingi blok kvadrat ildizlar va irratsional sonlar haqida.",
      'Первый блок закончен. Следующий блок про квадратные корни и иррациональные числа.',
      'The first block is over. The next block is about square roots and irrational numbers.'),
  ],
  props: {
    predictedLabel: L('Taxmin', 'Прогноз', 'Prediction'),
    proved: L(
      "Bitta son, to'rt",
      'Одно число, четыре',
      'One number, four',
    ),
    canLabel: L('Endi nima qila olasiz', 'Что теперь умеешь', 'What you can do now'),
    can: [
      L(
        "Ildizni daraja bilan yozish va teskarisi",
        'Записывать корень степенью и наоборот',
        'Write a root as a power and back',
      ),
      L(
        "Kvadrat ostidan modul chiqarish",
        'Выносить модуль из под квадрата',
        'Take a modulus out of a square',
      ),
      L(
        "Juft ildizning shartini ko'rish",
        'Видеть условие чётного корня',
        'See the condition of an even root',
      ),
    ],
    proofNote: L(
      "Fakt. n-darajali ildiz chiqarish usulini Jamshid ibn Ma'sud al-Koshiy «Arifmetika kaliti» asarida taxminan 1430-yilda bergan. Ya'ni bugungi belgi orqasida besh yuz yildan ortiq tarix turadi.",
      'Факт. Способ извлечения корня n-й степени дал ал-Каши в «Ключе арифметики» около 1430 года. То есть за сегодняшним знаком стоит больше пяти веков истории.',
      'A fact. The method for extracting the n-th root was given by al-Kashi in The Key of Arithmetic around 1430. So more than five centuries stand behind today notation.',
    ),
    bridge: L(
      "Keyingi blok kvadrat ildizlar va irratsional sonlar",
      'Следующий блок: квадратные корни и иррациональные числа',
      'The next block: square roots and irrational numbers',
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
  { role: 'explain', tool: 'ladder', kind: 'ladder', tag: 'З16', ...S3 },
  { role: 'explain', tool: 'transform', kind: 'method2', tag: 'З4', method: M_EXP, ...S4 },
  { role: 'explain', tool: 'transform', kind: 'method3', tag: 'З5', method: M_ABS, ...S5 },
  { role: 'explain', tool: 'solve', kind: 'together', tag: 'З29', ...S6 },
  { role: 'explain', tool: 'boundary', kind: 'boundary', tag: 'З4', ...S7 },
  { role: 'rule', tool: 'rulebuild', tag: 'З29', ...S8 },
  { role: 'practice', tool: 'chain', kind: 'drill', tag: 'З29', method: M_LADDER, ...S9 },
  { role: 'practice', tool: 'fields', kind: 'guided', tag: 'З5', method: M_ABS, ...S10 },
  { role: 'practice', tool: 'solo', kind: 'solo', tag: 'З16', method: M_EXP, ...S11 },
  { role: 'practice', tool: 'audit', kind: 'audit', tag: 'З4', method: M_ABS, ...S12 },
  { role: 'transfer', tool: 'inverse', kind: 'inverse', tag: 'З5', method: M_ABS, ...S13 },
  { role: 'blitz', tool: 'blitz', ...S14 },
  { role: 'summary', tool: 'summary', scene: FinalScene, ...S15 },
]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
