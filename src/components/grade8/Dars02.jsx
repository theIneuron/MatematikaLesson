// ============================================================================
// 8-sinf, Dars 2. KASRNING ASOSIY XOSSASI.
//
// Bu fayl — FAQAT MA'LUMOT (ETALON_8SINF.md §2). Mexanika `tools.jsx` da,
// o'ram `screens.jsx` da, matematik tekshiruv `mathcore.js` da.
//
// DARS 1 DAVOMI. Metodist, 2026-08-20: «3-ekranda o'quvchi bir xil
// bo'linmani BOSHQA juftliklar berishini qo'li bilan ko'rgan». 1-darsning
// 3-ekranida u ikki ustunni burab 150, 250 va 175 narxini oldi. Lekin bitta
// bo'linmaning IKKI juftligi u yerda YONMA YON turmagan edi — shuning uchun
// bu darsning 2-ekrani ularni yonma yon qo'yadi, va xossa o'quvchining
// kuzatuvi bo'lib chiqadi, mening tasdig'im emas.
//
// DARSLIK. O'zbek darsligi, 2-§, 13-bet: kasrning asosiy xossasi
// a/b = ma/(mb), bu yerda b nol emas, m nol emas. «Bu xossa kasrning surat va
// maxraji bir xil algebraik ifodaga ko'paytirilsa yoki bo'linsa, unga teng
// kasr hosil bo'lishini bildiradi.» Minus haqidagi qism — 14-bet.
//
// 3-DARS BILAN CHEGARA. Qisqartirish (bo'lish yo'nalishi) bu darsda FAQAT
// ko'paytuvchi ko'z bilan ko'rinadigan joyda beriladi (13 va 8-ekran).
// Ko'paytuvchilarga ajratish va «hadlab qisqartirish» tuzog'i 3-darsda.
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
  id: 'alg-8-02',
  n: 2,
  row: 2,
  block: 'Б1',
  topic: L(
    'Kasrning asosiy xossasi',
    'Основное свойство рациональной дроби',
    'The basic property of a rational fraction',
  ),
  voice: 'm',
  total: 15,
}

// Uchta tasdiq: 8-ekrandagi kartochka va 15-ekrandagi jamlanma.
export const STATEMENTS = [
  L(
    "Surat va maxraj bitta ifodaga ko'paytiriladi yoki bo'linadi, kasrning qiymati o'zgarmaydi",
    'Числитель и знаменатель умножают или делят на одно и то же, значение дроби не меняется',
    'Numerator and denominator are multiplied or divided by the same thing and the value stays',
  ),
  L(
    "Ko'paytuvchi nol bo'lmaydi, nolda surat ham maxraj ham nolga aylanadi",
    'Множитель не бывает нулём: при нуле и числитель, и знаменатель обращаются в нуль',
    'The factor is never zero: at zero both numerator and denominator become zero',
  ),
  L(
    "Harfli ko'paytuvchi yangi shart qo'shadi, tenglik ikki yozuv ham aniqlangan joyda turadi",
    'Буквенный множитель добавляет условие: равенство держится там, где определены обе записи',
    'A factor with a letter adds a condition: the equality holds where both records are defined',
  ),
]

// Adashishlar. Platformaga teg KETMAYDI (§12) — bu muallif asbobi: har bir
// noto'g'ri variantga o'z razbori yoziladi, va bu yerda ekran QAYSI adashish
// uchun yozilgani ko'rinadi. `at` — kontrprimer uchun son.
//
// З1, З2, З16 — §11 ro'yxatidan (ETALON_8SINF_RED2.md).
// З20, З21, З22 — YANGI, metodist so'zini kutadi.
export const MISS = {
  'З1': {
    what: L(
      "bir xil son qo'shildi, ko'paytirilmadi",
      'одно и то же прибавили, а не умножили',
      'the same thing was added instead of multiplied',
    ),
    wrong: '(2+3)/(5+3)',
    at: 3,
  },
  'З2': {
    what: L(
      "ko'paytirishda ruhsat etilgan qiymatlar yo'qoldi",
      'при умножении потеряны допустимые значения',
      'the admissible values were lost during multiplication',
    ),
    wrong: '4x/(3x)',
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
  'З20': {
    what: L(
      "faqat surat yoki faqat maxraj ko'paytirildi",
      'умножен только числитель или только знаменатель',
      'only the numerator or only the denominator was multiplied',
    ),
    wrong: '5x/(x+2)',
    at: 1,
  },
  'З21': {
    what: L(
      "nol ko'paytuvchi qonuniy deb olindi",
      'нулевой множитель принят за законный',
      'a zero factor was taken as legitimate',
    ),
    wrong: '0/0',
    at: 0,
  },
  'З22': {
    what: L(
      "kasrdagi minus o'zi yo'qoldi",
      'минус в дроби пропал сам',
      'the minus in the fraction vanished on its own',
    ),
    wrong: '7/x',
    at: 1,
  },
}

// ============================================================
// USULLAR (§4). Dars ekranlar ro'yxatida emas, USULLARDA turadi.
// Kartochka o'sha kartochka: usul kiritilgan ekranda ham, mashq ekranida ham.
// ============================================================
const M_MULT = {
  name: L(
    "1-USUL. Bitta ko'paytuvchi",
    'СПОСОБ 1. Один множитель',
    'METHOD 1. One factor',
  ),
  steps: [
    L("Yetmagan ko'paytuvchini toping", 'Найди недостающий множитель', 'Find the missing factor'),
    L("Ikkalasini unga ko'paytiring", 'Умножь верх и низ на него', 'Multiply top and bottom by it'),
    L("Nol bo'ladigan qiymatni yozing", 'Допиши, где множитель нуль', 'Write where the factor is zero'),
  ],
}

const M_SIGN = {
  name: L(
    "2-USUL. Minus ko'chishi",
    'СПОСОБ 2. Перенос минуса',
    'METHOD 2. The minus moves',
  ),
  steps: [
    L("Minus birni oling", 'Возьми минус один', 'Take minus one'),
    L("Ikkalasini ko'paytiring", 'Умножь верх и низ', 'Multiply top and bottom'),
    L("Minus kasr oldiga, shart o'sha", 'Минус перед дробью, условие то же', 'Minus before the fraction, same condition'),
  ],
}

const M_ZERO = {
  name: L(
    "3-USUL. Ko'paytuvchi va nol",
    'СПОСОБ 3. Множитель и нуль',
    'METHOD 3. The factor and zero',
  ),
  steps: [
    L("Ko'paytuvchini nomlang", 'Назови множитель', 'Name the factor'),
    L("Qaysi qiymatda nol bo'ladi", 'Найди, где он равен нулю', 'Find where it is zero'),
    L("Bu yangi shart", 'Это новое условие', 'That is the new condition'),
  ],
}

// ============================================================
// SAHNALAR (§6). IKKISI HAM SHART.
// Xuk savol beradi, yakun XUDDI SHU obyektda javobni ko'rsatadi.
// Harakat qatlamdan olinadi (`g8-draw`, `g8-fly`, `g8-seat`) — dars faylida
// o'z animatsiyasi YOZILMAYDI (metodist, 2026-08-20).
// ============================================================
const SC_ODZ = L('RUHSAT ETILGAN QIYMATLAR', 'ДОПУСТИМЫЕ ЗНАЧЕНИЯ', 'ADMISSIBLE VALUES')

// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Ikki yozuv va ular orasidagi savol",
      'Две записи и вопрос между ними',
      'Two records and the question between them',
    )}>
      {/* CHAP YOZUV berilgan: u statik turadi. */}
      <text x="92" y="62" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21" fill={T.ink}>a + 2</text>
      <line x1="44" y1="74" x2="140" y2="74" stroke={T.ink} strokeWidth="2.4"/>
      <text x="92" y="102" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21" fill={T.ink}>3</text>

      {/* O'NG YOZUV chapdan YASALADI: chiziq chiziladi, keyin ko'paytuvchi
          suratga, keyin maxrajga KELADI. Bitta kadrda bitta harakat. */}
      <text x="288" y="62" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21" fill={T.ink}>a + 2</text>
      <line x1="240" y1="74" x2="372" y2="74" stroke={T.ink} strokeWidth="2.4"
        pathLength="1" className="g8-draw"/>
      <text x="288" y="102" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21" fill={T.ink}>3</text>
      <g className="g8-fly" style={{ '--d': '2900ms' }}>
        <text x="340" y="62" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21" fill={T.accent}>{'· a'}</text>
      </g>
      <g className="g8-fly" style={{ '--d': '3300ms' }}>
        <text x="340" y="102" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21" fill={T.accent}>{'· a'}</text>
      </g>

      {/* SAVOL BELGISI oxirida o'tiradi: u ikki yozuv tayyor bo'lgandan keyin
          ma'no kasb etadi. */}
      <g className="g8-seat" style={{ '--d': '3800ms' }}>
        <circle cx="190" cy="80" r="17" fill={T.graphSoft} stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="190" y="87" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      {/* RUHSAT ETILGAN QIYMATLAR satri BO'SH: uni dars to'ldiradi. */}
      <text x="200" y="132" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_ODZ)}</text>
      <line x1="132" y1="142" x2="268" y2="142" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>
    </SceneBand>
  )
}

// YAKUN SAHNASI xuk savoliga javob beradi: o'sha ikki yozuv, o'sha joyda,
// savol belgisi o'rnida tenglik, va nolda TESHIK.
const FinalScene = (
  <SceneBand kind="final" label={L(
    "Yozuvlar teng, nolda esa teshik",
    'Записи равны, а в нуле дырка',
    'The records are equal, and there is a hole at zero',
  )}>
    <text x="86" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16" fill={T.ink}>a + 2</text>
    <line x1="48" y1="39" x2="124" y2="39" stroke={T.ink} strokeWidth="2"/>
    <text x="86" y="58" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16" fill={T.ink}>3</text>

    <text x="200" y="46" textAnchor="middle" fontFamily={MATH_FONT} fontSize="18" fill={T.ok}>=</text>

    <text x="308" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16" fill={T.ink}>{'(a + 2) · a'}</text>
    <line x1="248" y1="39" x2="368" y2="39" stroke={T.ink} strokeWidth="2"/>
    <text x="308" y="58" textAnchor="middle" fontFamily={MATH_FONT} fontSize="16" fill={T.ink}>{'3 · a'}</text>

    {/* SON O'QI va TESHIK: shart so'z bilan emas, JOY bilan ko'rsatiladi. */}
    <line x1="120" y1="78" x2="280" y2="78" stroke="rgba(23,26,29,.28)" strokeWidth="1.4"/>
    <text x="150" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink3}>{'−2'}</text>
    <text x="200" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink3}>0</text>
    <text x="250" y="90" textAnchor="middle" fontFamily={MATH_FONT} fontSize="9" fill={T.ink3}>2</text>
    <g className="g8-seat" style={{ '--d': '600ms' }}>
      <circle cx="200" cy="78" r="5.2" fill={T.paper} stroke={T.tip} strokeWidth="2"/>
    </g>
    <g className="g8-seat" style={{ '--d': '1000ms' }}>
      <rect x="292" y="68" width="80" height="19" rx="9.5" fill={T.tipSoft}/>
      <text x="332" y="82" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
        fontWeight="700" fill={T.tip}>{'a ≠ 0'}</text>
    </g>
  </SceneBand>
)

// ============================================================
// EKRAN 1. XUK. Ikki yozuv, bitta savol, ikki taxmin.
// Razbor YO'Q, xulosa YO'Q, baho YO'Q (§5): javobini o'quvchi 6-ekranda
// O'ZI topadi va 15-ekranda ko'radi.
// ============================================================
const S1 = {
  eyebrow: L('IKKI YOZUV', 'ДВЕ ЗАПИСИ', 'TWO RECORDS'),
  title: L(
    'Kasr va uning nusxasi',
    'Дробь и её копия',
    'A fraction and its copy',
  ),
  lead: L(
    "Javobini dars davomida o'zingiz topasiz",
    'Ответ найдёшь сам по ходу урока',
    'You will find the answer yourself during the lesson',
  ),
  audio: [
    A('mount',
      "Ikki yozuv yonma yon turibdi. Chapdagisi berilgan, o'ngdagisi undan yasalgan.",
      'Две записи рядом. Левая дана, правая сделана из неё.',
      'Two records side by side. The left one is given, the right one is made from it.'),
    A('why',
      "O'ng yozuvda surat ham, maxraj ham a ga ko'paytirilgan. Taxmin qiling, qiymatlar har qanday a da mos keladimi.",
      'В правой записи и числитель, и знаменатель умножены на a. Предположи, совпадут ли значения при любом a.',
      'In the right record both numerator and denominator are multiplied by a. Predict whether the values match for every a.'),
  ],
  props: {
    // TAXMIN REJIMI: har qanday tanlov ekranni yopadi, `right` yo'q (§5).
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
// EKRAN 2. TAYANCH. 1-darsning 3-ekrani DAVOM ETADI: u yerda o'quvchi
// ikki ustunni burab narx topgan, bu yerda bitta narxning UCH JUFTLIGI
// yonma yon turadi. Uchinchi topshiriq FAQAT summani ikki barobar oshiradi
// — shu joyda «ikkalasini birga» degan fikr paydo bo'ladi (З20).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Bitta bo'linma, boshqa juftliklar",
    'Одно частное, разные пары',
    'One quotient, different pairs',
  ),
  audio: [
    A('mount',
      "Oldingi darsda narxni ikki ustunni burab topgan edingiz. Endi juftliklarni yonma yon qo'yamiz.",
      'На прошлом уроке цену находили, крутя два столбца. Теперь поставим пары рядом.',
      'In the previous lesson you found the price by turning two columns. Now we put the pairs side by side.'),
    W('t1',
      "Summa ham, miqdor ham ikki barobar oshdi, narx esa o'zgarmadi.",
      'И сумма, и количество выросли вдвое, а цена не изменилась.',
      'Both the total and the quantity doubled, and the price did not change.'),
    W('t2',
      "Narx o'sha bo'lsa, miqdor kichrayganda summa ham kichrayadi.",
      'Если цена та же, то с уменьшением количества уменьшается и сумма.',
      'If the price stays, then a smaller quantity means a smaller total.'),
    W('t3',
      "Bu safar faqat summa oshdi, va narx ham oshdi. Ikkalasini birga o'zgartirish kerak.",
      'На этот раз выросла только сумма, и цена тоже выросла. Менять надо оба числа вместе.',
      'This time only the total grew, and the price grew too. Both numbers must change together.'),
  ],
  props: {
    items: [
      {
        prompt: L(
          "Narx 600 va 4 da 150 edi. Ikkalasi ikki barobar oshdi. Narx qancha?",
          'Цена при 600 и 4 была 150. Оба числа выросли вдвое. Какая цена?',
          'At 600 and 4 the price was 150. Both numbers doubled. What is the price?',
        ),
        show: F('1200', '8'),
        kind: 'number',
        answer: '150',
        accepts: ['150'],
        hints: {
          '300': L(
            "Miqdor ham 8 ga aylandi. 1200 ni 8 ga bo'ling.",
            'Количество тоже стало 8. Раздели 1200 на 8.',
            'The quantity became 8 as well. Divide 1200 by 8.',
          ),
          '75': L(
            "Summa kamaymadi, oshdi. Yana bir qarang.",
            'Сумма не уменьшилась, а выросла. Посмотри ещё раз.',
            'The total did not shrink, it grew. Look again.',
          ),
        },
        closed: L('1200 va 8, narx 150', '1200 и 8, цена 150', '1200 and 8, price 150'),
      },
      {
        prompt: L(
          "Narx yana 150, miqdor esa 2. Summa qancha?",
          'Цена снова 150, а количество 2. Какая сумма?',
          'The price is again 150 and the quantity is 2. What is the total?',
        ),
        show: F('?', '2'),
        kind: 'number',
        answer: '300',
        accepts: ['300'],
        hints: {
          '150': L(
            "150 bu narx, summa emas. Ikkita tovar uchun qancha to'lanadi?",
            'Сто пятьдесят это цена, а не сумма. Сколько платят за два товара?',
            'One hundred fifty is the price, not the total. What is paid for two items?',
          ),
          '600': L(
            "600 to'rtta tovarga tegishli. Bu yerda ikkita.",
            'Шестьсот относится к четырём товарам. Здесь их два.',
            'Six hundred belongs to four items. Here there are two.',
          ),
        },
        closed: L('300 va 2, narx 150', '300 и 2, цена 150', '300 and 2, price 150'),
      },
      {
        prompt: L(
          "600 va 4 dan faqat summa ikki barobar oshdi, miqdor esa 4 bo'lib qoldi. Narx qancha?",
          'Из 600 и 4 удвоили только сумму, количество осталось 4. Какая теперь цена?',
          'From 600 and 4 only the total was doubled, the quantity stayed 4. What is the price now?',
        ),
        show: F('1200', '4'),
        kind: 'number',
        answer: '300',
        accepts: ['300'],
        hints: {
          '150': L(
            "Miqdor ham ikki barobar oshganda narx 150 bo'lib qolardi. Bu yerda faqat summa oshgan.",
            'При удвоении обоих чисел цена осталась бы 150. Здесь удвоена только сумма.',
            'If both numbers doubled the price would stay 150. Here only the total is doubled.',
          ),
          '1200': L(
            "1200 bu summa. Narx bo'linmadan chiqadi.",
            'Тысяча двести это сумма. Цена получается делением.',
            'Twelve hundred is the total. The price comes from the division.',
          ),
        },
        closed: L('1200 va 4, narx 300', '1200 и 4, цена 300', '1200 and 4, price 300'),
      },
    ],
  },
}

// ============================================================
// EKRAN 3. YADRO. KADRLAR LENTASI (§8): tepada bitta obyekt, pastda uch
// kadr, yo'l-yo'lakay ikki savol. Sonlardan harflarga o'tish shu yerda.
// Figura `mult` — qatlamda (`tools.jsx`), dars faqat YOZUVLARNI beradi.
// ============================================================
const S3 = {
  eyebrow: L('ASOSIY XOSSA', 'ОСНОВНОЕ СВОЙСТВО', 'THE BASIC PROPERTY'),
  title: L(
    'Kasrning asosiy xossasi',
    'Основное свойство дроби',
    'The basic property of a fraction',
  ),
  audio: [
    A('mount',
      "Sonlarda ko'rgan narsani hozir yozuvda ko'ramiz.",
      'То, что видно на числах, сейчас увидим в записи.',
      'What is visible with numbers we will now see in a record.'),
    W('k2',
      "Surat ham, maxraj ham beshga ko'paytirildi. Qiymat o'sha, nol butun yetmish besh.",
      'И числитель, и знаменатель умножены на пять. Значение то же, нуль целых семьдесят пять.',
      'Both numerator and denominator are multiplied by five. The value is the same, zero point seven five.'),
    W('k3',
      "Harflar bilan ham xuddi shunday. Faqat ko'paytuvchi nol bo'lmasligi shart, aks holda surat ham maxraj ham nolga aylanadi.",
      'С буквами то же самое. Только множитель не должен быть нулём, иначе и числитель, и знаменатель обратятся в нуль.',
      'With letters it works the same. Only the factor must not be zero, otherwise both parts become zero.'),
  ],
  props: {
    film: {
      fig: 'mult',
      data: {
        left: F('3', '4'),
        mid: F('3 · 5', '4 · 5'),
        right: F('15', '20'),
        same: L(
          "qiymat o'sha, 0,75 va 0,75",
          'значение то же, 0,75 и 0,75',
          'the value is the same, 0.75 and 0.75',
        ),
        rule: (
          <Row size="row" align="center">
            {F('a', 'b')}
            {' = '}
            {F('a · m', 'b · m')}
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
            "Uch to'rtdan, qiymati 0,75",
            'Три четвёртых, значение 0,75',
            'Three quarters, the value is 0.75',
          ),
        },
        {
          id: 'k2',
          phase: 1,
          label: L("Ko'paytuvchi", 'Множитель', 'Factor'),
          text: L(
            "Surat va maxraj bir vaqtda beshga ko'paytirildi",
            'Числитель и знаменатель разом умножены на пять',
            'Numerator and denominator are multiplied by five at once',
          ),
          ask: {
            question: L(
              "To'rtdan yigirma chiqdi. Maxraj nechaga ko'paytirilgan?",
              'Из четырёх вышло двадцать. На что умножен знаменатель?',
              'Four became twenty. What was the denominator multiplied by?',
            ),
            items: [
              { id: 'a5', right: true, label: L('5', '5', '5') },
              {
                id: 'a16',
                label: L('16', '16', '16'),
                hint: L(
                  "Bu qo'shish bo'lardi. Unda surat 19 bo'lardi, u esa 15 ga teng.",
                  'Это было бы прибавление. Тогда числитель стал бы 19, а он равен 15.',
                  'That would be addition. Then the numerator would be 19, but it is 15.',
                ),
              },
              {
                id: 'a4',
                label: L('4', '4', '4'),
                hint: L(
                  "To'rtni to'rtga ko'paytirsak 16 chiqadi, 20 emas.",
                  'Четыре умножить на четыре это шестнадцать, а не двадцать.',
                  'Four times four is sixteen, not twenty.',
                ),
              },
              {
                id: 'a2',
                label: L('2', '2', '2'),
                hint: L(
                  "To'rtni ikkiga ko'paytirsak 8 chiqadi, 20 gacha yetmaydi.",
                  'Четыре умножить на два это восемь, до двадцати не хватает.',
                  'Four times two is eight, short of twenty.',
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
            "Xuddi shu narsa harflar bilan, ko'paytuvchi m nol emas",
            'То же самое буквами, множитель m не равен нулю',
            'The same thing with letters, the factor m is not zero',
          ),
          ask: {
            question: L(
              "Harfli yozuvda m ga nima ko'paytirilgan?",
              'В буквенной записи на m умножено что?',
              'In the letter record, what is multiplied by m?',
            ),
            items: [
              {
                id: 'both',
                right: true,
                label: L('Surat ham, maxraj ham', 'И числитель, и знаменатель', 'Both numerator and denominator'),
              },
              {
                id: 'num',
                label: L('Faqat surat', 'Только числитель', 'Only the numerator'),
                hint: L(
                  "Chiziq ostiga qarang, u yerda ham m paydo bo'lgan.",
                  'Посмотри под черту: там тоже появилось m.',
                  'Look below the bar: m appeared there too.',
                ),
              },
              {
                id: 'den',
                label: L('Faqat maxraj', 'Только знаменатель', 'Only the denominator'),
                hint: L(
                  "Chiziq ustiga qarang, u yerda ham m turibdi.",
                  'Посмотри над чертой: там тоже стоит m.',
                  'Look above the bar: m stands there as well.',
                ),
              },
              {
                id: 'two',
                label: L('Surat m ga, maxraj ikki m ga', 'Числитель на m, знаменатель на два m', 'Numerator by m, denominator by two m'),
                hint: L(
                  "Ko'paytuvchilar boshqa bo'lsa, kasr ham boshqa bo'ladi.",
                  'Если множители разные, то и дробь получается другая.',
                  'If the factors differ, the fraction comes out different.',
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
// EKRAN 4. 1-USUL, o'quvchi O'ZI bajaradi. Ikki qadam:
//   1) ko'paytuvchini topib yozuvni yozish,
//   2) YANGI shartni yozish — ko'paytuvchi harfli, demak shart O'SDI.
// Har qadamda ASOS ham so'raladi (WhyStep, §7.3): natija to'g'ri, asos
// noto'g'ri bo'lsa qadam yopilmaydi.
// ============================================================
const S4 = {
  eyebrow: L('1-USUL', 'СПОСОБ 1', 'METHOD 1'),
  title: L(
    "Maxraj uchun ko'paytuvchi",
    'Множитель для знаменателя',
    'A factor for the denominator',
  ),
  audio: [
    A('mount',
      "Endi maxraj berilgan, ko'paytuvchini o'zingiz topasiz.",
      'Теперь знаменатель задан, а множитель находишь сам.',
      'Now the denominator is given and you find the factor yourself.'),
    W('s2',
      "Ikkala qism ham iksga ko'paytirildi, demak kasr o'sha kasr.",
      'Обе части умножены на икс, значит дробь та же.',
      'Both parts are multiplied by x, so the fraction is the same.'),
    W('s3',
      "Ko'paytuvchi harfli, shuning uchun shart o'sdi. Iks nol bo'lsa, yangi maxraj nolga aylanadi.",
      'Множитель с буквой, поэтому условие выросло. При иксе, равном нулю, новый знаменатель обращается в нуль.',
      'The factor has a letter, so the condition grew. At x equal to zero the new denominator becomes zero.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {F('5', 'x + 2')}
      </Row>
    ),
    actions: [
      { id: 'both', label: L("Ikkalasini x ga", 'Обе части на x', 'Both parts by x') },
      { id: 'den', label: L('Faqat maxrajni x ga', 'Только знаменатель на x', 'Only the denominator by x') },
      { id: 'plus', label: L("Ikkalasiga x qo'shish", 'Прибавить x к обеим', 'Add x to both') },
      { id: 'mix', label: L("Suratni x ga, maxrajni ikkiga", 'Числитель на x, знаменатель на 2', 'Numerator by x, denominator by 2') },
    ],
    steps: [
      {
        action: 'both',
        wrongs: [
          {
            action: 'den',
            hint: L(
              "Faqat maxraj o'zgarsa, kasr boshqa bo'lib qoladi. Iks bittaga teng bo'lsa tekshiring.",
              'Если меняется только знаменатель, дробь становится другой. Проверь при иксе, равном одному.',
              'If only the denominator changes, the fraction becomes different. Check at x equal to one.',
            ),
          },
          {
            action: 'plus',
            hint: L(
              "Qo'shish kasrning qiymatini o'zgartiradi. Uch to'rtdan va to'rt beshdan bir xil emas.",
              'Прибавление меняет значение. Три четвёртых и четыре пятых это не одно и то же.',
              'Addition changes the value. Three quarters and four fifths are not the same.',
            ),
          },
          {
            action: 'mix',
            hint: L(
              "Ko'paytuvchi bitta bo'lishi kerak, iks va ikki esa boshqa sonlar.",
              'Множитель должен быть один, а икс и два это разные множители.',
              'The factor must be one and the same, but x and two are different factors.',
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
              id: 'mulfrac',
              label: L("Kasrlarni ko'paytirish qoidasi", 'Правило умножения дробей', 'The rule for multiplying fractions'),
              hint: L(
                "U yerda ikki kasr ko'paytiriladi. Bu yerda kasr bitta, uning qismlari o'zgaradi.",
                'Там перемножают две дроби. Здесь дробь одна, меняются её части.',
                'There two fractions are multiplied. Here there is one fraction and its parts change.',
              ),
            },
            {
              id: 'like',
              label: L("O'xshash hadlarni yig'ish", 'Приведение подобных слагаемых', 'Collecting like terms'),
              hint: L(
                "O'xshash hadlar qo'shiladi. Bu yerda hech narsa qo'shilmadi.",
                'Подобные слагаемые складывают. Здесь ничего не складывали.',
                'Like terms are added. Nothing was added here.',
              ),
            },
          ],
        },
        ask: L(
          "Nima chiqdi? Yozing",
          'Что получилось? Запиши',
          'What came out? Write it down',
        ),
        answer: '5x/(x(x+2))',
        accepts: ['5*x/(x*x+2*x)', '(5x)/(x*x+2x)', '5x/(x*(x+2))'],
        hints: {
          '5x/(x+2)': L(
            "Maxraj o'zgarmagan. Chiziq ostiga ham x kelishi kerak.",
            'Знаменатель не изменился. Под чертой тоже должен появиться x.',
            'The denominator did not change. An x must appear below the bar too.',
          ),
          '5/(x(x+2))': L(
            "Surat o'zgarmagan. Chiziq ustiga ham x kelishi kerak.",
            'Числитель не изменился. Над чертой тоже должен появиться x.',
            'The numerator did not change. An x must appear above the bar too.',
          ),
          '5x/(x*x+2)': L(
            "Maxrajning ikkinchi hadi ham x ga ko'paytiriladi.",
            'Второе слагаемое знаменателя тоже умножается на x.',
            'The second term of the denominator is multiplied by x as well.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('5', 'x + 2')}
            {' = '}
            {F('5x', 'x(x + 2)')}
          </Row>
        ),
      },
      {
        // IKKINCHI QADAMNING O'Z AMALLARI: birinchi qadam yozuvni yozdi,
        // bu qadam SHARTNI yozadi, va tanlov boshqa.
        actions: [
          { id: 'zero', label: L("Yangi shartni yozish", 'Дописать новое условие', 'Write the new condition') },
          { id: 'keep', label: L("Eski shartni qoldirish", 'Оставить прежнее условие', 'Keep the old condition') },
          { id: 'drop', label: L("Shartni olib tashlash", 'Убрать условие', 'Remove the condition') },
        ],
        action: 'zero',
        wrongs: [
          {
            action: 'keep',
            hint: L(
              "Yangi ko'paytuvchi harfli, u nolga aylanishi mumkin. Shart o'sadi.",
              'Новый множитель с буквой, он может обратиться в нуль. Условие вырастет.',
              'The new factor has a letter and can become zero. The condition grows.',
            ),
          },
          {
            action: 'drop',
            hint: L(
              "Eski shart yo'qolmaydi, maxrajda x plyus ikki turibdi.",
              'Прежнее условие не исчезает, в знаменателе стоит x плюс два.',
              'The old condition does not vanish, the denominator still holds x plus two.',
            ),
          },
        ],
        why: {
          question: L(
            "Shart nima uchun o'sdi?",
            'Почему условие выросло?',
            'Why did the condition grow?',
          ),
          items: [
            {
              id: 'mzero',
              right: true,
              label: L("Ko'paytuvchi nolga aylanadi", 'Множитель обращается в нуль', 'The factor becomes zero'),
            },
            {
              id: 'numzero',
              label: L('Surat nolga aylanadi', 'Числитель обращается в нуль', 'The numerator becomes zero'),
              hint: L(
                "Suratdagi nol qiymatni nol qiladi, qiymatni yo'q qilmaydi.",
                'Нуль в числителе делает значение нулём, а не убирает его.',
                'Zero in the numerator makes the value zero, it does not remove it.',
              ),
            },
            {
              id: 'big',
              label: L("Maxraj uzunlashdi", 'Знаменатель стал длиннее', 'The denominator got longer'),
              hint: L(
                "Uzunlik ahamiyatsiz. Nolga aylanadigan joy ahamiyatli.",
                'Длина ни при чём. Важно, где запись обращается в нуль.',
                'Length is irrelevant. What matters is where it becomes zero.',
              ),
            },
          ],
        },
        kind: 'odz',
        varName: 'x',
        excluded: [-2, 0],
        accepts: ['x != 0, x != -2', 'x(x+2) != 0'],
        ask: L(
          "Yangi kasrning ruhsat etilgan qiymatlarini yozing",
          'Запиши допустимые значения новой дроби',
          'Write the admissible values of the new fraction',
        ),
        hints: {
          'x != -2': L(
            "Yangi ko'paytuvchi x ham nolga aylanadi. Qaysi qiymatda?",
            'Новый множитель x тоже обращается в нуль. При каком значении?',
            'The new factor x also becomes zero. At which value?',
          ),
          'x != 0': L(
            "Iks minus ikkiga teng bo'lganda maxraj yana nolga aylanadi.",
            'При иксе, равном минус двум, знаменатель снова обращается в нуль.',
            'At x equal to minus two the denominator becomes zero again.',
          ),
          'x != -2, x != 2': L(
            "Ikkida maxraj sakkizga teng, nolga emas.",
            'При двойке знаменатель равен восьми, а не нулю.',
            'At two the denominator equals eight, not zero.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'x ≠ 0,  x ≠ −2'}
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 5. 2-USUL. Minus — xuddi shu xossaning ishi: ko'paytuvchi minus bir.
// Darslik, 14-bet. Bu yerda esa asosiy narsa BOSHQA: minus bir NOL
// BO'LMAYDI, shuning uchun 4-ekrandagidek shart O'SMAYDI.
// ============================================================
const S5 = {
  eyebrow: L('2-USUL', 'СПОСОБ 2', 'METHOD 2'),
  title: L(
    'Kasrdagi minus',
    'Минус в дроби',
    'The minus in a fraction',
  ),
  audio: [
    A('mount',
      "Maxrajdagi minus yozuvni o'qishga xalaqit beradi. Uni ko'chirish mumkin.",
      'Минус в знаменателе мешает читать запись. Его можно перенести.',
      'A minus in the denominator makes the record hard to read. It can be moved.'),
    W('s2',
      "Ko'paytuvchi minus bir bo'ldi, minus esa bitta qoldi.",
      'Множителем стал минус один, а минус остался один.',
      'The factor became minus one, and one minus is left.'),
    W('s3',
      "Minus bir hech qachon nol emas, shuning uchun shart o'zgarmadi.",
      'Минус один никогда не равен нулю, поэтому условие не изменилось.',
      'Minus one is never zero, so the condition did not change.'),
  ],
  props: {
    start: (
      <Row size="row" align="center">
        {F('7', '−x')}
      </Row>
    ),
    actions: [
      { id: 'neg', label: L("Ikkalasini minus birga", 'Обе части на минус один', 'Both parts by minus one') },
      { id: 'cross', label: L("Ikki minusni o'chirish", 'Зачеркнуть оба минуса', 'Cross out both minuses') },
      { id: 'swap', label: L("Surat va maxrajni almashtirish", 'Поменять числитель и знаменатель', 'Swap numerator and denominator') },
      { id: 'add', label: L("Ikkalasiga minus bir qo'shish", 'Прибавить минус один к обеим', 'Add minus one to both') },
    ],
    steps: [
      {
        action: 'neg',
        wrongs: [
          {
            action: 'cross',
            hint: L(
              "Minus o'zi yo'qolmaydi. Iks bittaga teng bo'lsa, chapda minus yetti, o'ngda yetti chiqadi.",
              'Минус не исчезает сам. При иксе, равном одному, слева минус семь, справа семь.',
              'A minus does not vanish by itself. At x equal to one the left gives minus seven and the right gives seven.',
            ),
          },
          {
            action: 'swap',
            hint: L(
              "Bu boshqa kasr bo'ladi. Iks ikkiga teng bo'lsa tekshiring.",
              'Это будет другая дробь. Проверь при иксе, равном двум.',
              'That would be a different fraction. Check at x equal to two.',
            ),
          },
          {
            action: 'add',
            hint: L(
              "Xossa ko'paytirish haqida. Qo'shish qiymatni o'zgartiradi.",
              'Свойство говорит об умножении. Прибавление меняет значение.',
              'The property is about multiplication. Addition changes the value.',
            ),
          },
        ],
        why: {
          question: L('Nima asosda?', 'На основании чего?', 'On what grounds?'),
          items: [
            {
              id: 'main',
              right: true,
              label: L(
                "Asosiy xossa, ko'paytuvchi minus bir",
                'Основное свойство, множитель минус один',
                'The basic property, the factor is minus one',
              ),
            },
            {
              id: 'open',
              label: L("Qavslarni ochish qoidasi", 'Правило раскрытия скобок', 'The rule for opening brackets'),
              hint: L(
                "Bu yerda qavs yo'q. Surat va maxraj ko'paytirilmoqda.",
                'Здесь нет скобок. Умножаются числитель и знаменатель.',
                'There are no brackets here. The numerator and denominator are being multiplied.',
              ),
            },
            {
              id: 'move',
              label: L("Hadni belgi bilan ko'chirish", 'Перенос слагаемого со сменой знака', 'Moving a term with a sign change'),
              hint: L(
                "Ko'chirish tenglamada bo'ladi. Bu yerda tenglama emas, kasr.",
                'Перенос бывает в уравнении. Здесь не уравнение, а дробь.',
                'Moving terms happens in an equation. This is a fraction, not an equation.',
              ),
            },
          ],
        },
        ask: L('Nima chiqdi? Yozing', 'Что получилось? Запиши', 'What came out? Write it down'),
        answer: '-7/x',
        accepts: ['(7*(-1))/((-x)*(-1))', '-(7/x)', '(-7)/x'],
        hints: {
          '7/x': L(
            "Minus yo'qolib qoldi. Iks bittaga teng bo'lsa, qiymatlar mos kelmaydi.",
            'Минус потерялся. При иксе, равном одному, значения не совпадут.',
            'The minus was lost. At x equal to one the values do not match.',
          ),
          'x/(-7)': L(
            "Surat va maxraj joyini almashtirgan. Yozuv boshqa kasrga aylandi.",
            'Числитель и знаменатель поменялись местами. Запись стала другой дробью.',
            'Numerator and denominator swapped places. The record became a different fraction.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {F('7', '−x')}
            {' = '}
            {F('−7', 'x')}
          </Row>
        ),
      },
      {
        actions: [
          { id: 'same', label: L("Shart o'sha qoladi", 'Условие остаётся прежним', 'The condition stays the same') },
          { id: 'grow', label: L("Yangi shart qo'shish", 'Добавить новое условие', 'Add a new condition') },
          { id: 'none', label: L("Shartni olib tashlash", 'Убрать условие', 'Remove the condition') },
        ],
        action: 'same',
        wrongs: [
          {
            action: 'grow',
            hint: L(
              "Minus bir nolga aylanmaydi, shuning uchun yangi shart yo'q.",
              'Минус один в нуль не обращается, поэтому нового условия нет.',
              'Minus one never becomes zero, so there is no new condition.',
            ),
          },
          {
            action: 'none',
            hint: L(
              "Maxrajda iks turibdi, demak shart baribir kerak.",
              'В знаменателе стоит икс, значит условие всё равно нужно.',
              'The denominator holds x, so a condition is still needed.',
            ),
          },
        ],
        why: {
          question: L(
            "Nega shart o'zgarmadi?",
            'Почему условие не изменилось?',
            'Why did the condition stay the same?',
          ),
          items: [
            {
              id: 'notzero',
              right: true,
              label: L("Minus bir nol emas", 'Минус один не нуль', 'Minus one is not zero'),
            },
            {
              id: 'small',
              label: L("Ko'paytuvchi kichik", 'Множитель маленький', 'The factor is small'),
              hint: L(
                "Kattaligi ahamiyatsiz. Nolga aylanadi yoki aylanmaydi, gap shunda.",
                'Величина ни при чём. Важно, обращается он в нуль или нет.',
                'Size is irrelevant. What matters is whether it becomes zero.',
              ),
            },
            {
              id: 'nol',
              label: L("Maxrajda harf yo'q", "В знаменателе нет буквы", 'There is no letter in the denominator'),
              hint: L(
                "Maxrajda iks turibdi. Shart bor, u faqat o'sgani yo'q.",
                'В знаменателе стоит икс. Условие есть, оно просто не выросло.',
                'The denominator holds x. The condition exists, it simply did not grow.',
              ),
            },
          ],
        },
        kind: 'odz',
        varName: 'x',
        excluded: [0],
        accepts: ['x != 0', '0 != x'],
        ask: L(
          "Ruhsat etilgan qiymatlarni yozing",
          'Запиши допустимые значения',
          'Write the admissible values',
        ),
        hints: {
          'x != 0, x != -1': L(
            "Minus bir bu ko'paytuvchi, iksning qiymati emas. U hech qachon nol bo'lmaydi.",
            'Минус один это множитель, а не значение икса. Нулём он не бывает.',
            'Minus one is a factor, not a value of x. It is never zero.',
          ),
          'x != -7': L(
            "Minus yetti suratda turibdi, maxrajga kirmaydi.",
            'Минус семь стоит в числителе, в знаменатель он не входит.',
            'Minus seven is in the numerator, it is not part of the denominator.',
          ),
        },
        show: (
          <Row size="row" align="center">
            {'x ≠ 0'}
          </Row>
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 6. BIRGA YECHAMIZ. Xukning yozuvlari OXIRIGACHA yechiladi, va
// javobni o'quvchi shu yerda O'ZI oladi (§5).
// Yechimda MUVAFFAQIYATSIZ QADAM bor (§4): «demak har qanday a da» satri
// chiqadi va rad etiladi. Ikki sonda mos kelish hech narsani isbotlamaydi.
// ============================================================
const S6 = {
  eyebrow: L('BIRGA YECHAMIZ', 'РЕШАЕМ ВМЕСТЕ', 'SOLVING TOGETHER'),
  title: L(
    'Shartli tenglik',
    'Равенство с условием',
    'An equality with a condition',
  ),
  audio: [
    A('mount',
      "Birinchi ekrandagi savolga qaytamiz va uni oxirigacha yechamiz.",
      'Возвращаемся к вопросу с первого экрана и решаем его до конца.',
      'We return to the question from the first screen and solve it to the end.'),
    W('s4',
      "Ikki sonda mos keldi. Bu hali hech narsani isbotlamaydi.",
      'При двух числах совпало. Это ещё ничего не доказывает.',
      'It matched at two numbers. That still proves nothing.'),
    W('s6',
      "Nolda chap yozuvning qiymati bor, o'ngdagisining esa yo'q.",
      'При нуле у левой записи значение есть, у правой нет.',
      'At zero the left record has a value and the right one does not.'),
    W('s7',
      "Demak tenglik a nolga teng bo'lmaganda turadi.",
      'Значит равенство держится при a, не равном нулю.',
      'So the equality holds when a is not equal to zero.'),
  ],
  props: {
    task: L(
      "Bu ikki yozuv bitta kasrmi?",
      'Эти две записи — одна и та же дробь?',
      'Are these two records the same fraction?',
    ),
    lines: [
      {
        text: '(a + 2)/3      (a + 2) · a / (3 · a)',
        note: L("berilgan", 'дано', 'given'),
      },
      {
        text: 'a = 1:   3/3 = 1      3/3 = 1',
        ask: {
          question: L(
            "a bittaga teng bo'lsa nima chiqadi?",
            'Что выйдет при a, равном одному?',
            'What comes out at a equal to one?',
          ),
          items: [
            { id: 'same', right: true, label: L('1 va 1', '1 и 1', '1 and 1') },
            {
              id: 'diff',
              label: L('1 va bir uchdan', '1 и одна третья', '1 and one third'),
              hint: L(
                "Chiziq ostidagi uch ham bittaga ko'paytiriladi, u uch bo'lib qoladi.",
                'Тройка под чертой тоже умножается на один и остаётся тройкой.',
                'The three below the bar is also multiplied by one and stays three.',
              ),
            },
          ],
          after: L(
            "Mos keldi",
            'Совпало',
            'It matched',
          ),
        },
      },
      {
        text: 'a = 4:   6/3 = 2      24/12 = 2',
        note: L('mos keldi', 'совпало', 'it matched'),
      },
      {
        text: L(
          "Demak har qanday a da teng",
          'Значит равны при любом a',
          'So they are equal for every a',
        ),
        tone: 'no',
        note: L(
          "bunday xulosa qilinmaydi",
          'такой вывод делать нельзя',
          'this conclusion is not allowed',
        ),
      },
      {
        text: 'a = 0:   2/3      0/0',
        ask: {
          question: L(
            "Ko'paytuvchini qaysi son tekshiradi?",
            'Какое число проверит множитель?',
            'Which number tests the factor?',
          ),
          items: [
            { id: 'zero', right: true, label: L('Nol', 'Нуль', 'Zero') },
            {
              id: 'one',
              label: L('Bir', 'Единица', 'One'),
              hint: L(
                "Bittada ko'paytuvchi bittaga teng, bizga esa nol kerak.",
                'При единице множитель равен единице, а нужен нуль.',
                'At one the factor equals one, but zero is what is needed.',
              ),
            },
            {
              id: 'mtwo',
              label: L('Minus ikki', 'Минус два', 'Minus two'),
              hint: L(
                "Minus ikki suratni nolga aylantiradi, savol esa ko'paytuvchi haqida.",
                'Минус два обращает в нуль числитель, а спрашивают про множитель.',
                'Minus two makes the numerator zero, but the question is about the factor.',
              ),
            },
          ],
          after: L(
            "O'ngdagi yozuvning qiymati yo'q",
            'У правой записи значения нет',
            'The right record has no value',
          ),
        },
        tone: 'no',
      },
      {
        text: L(
          "Yozuvlar teng, lekin a nol emas",
          'Записи равны, но при a, не равном нулю',
          'The records are equal, but only when a is not zero',
        ),
        tone: 'ok',
      },
    ],
  },
}

// ============================================================
// EKRAN 7. CHEGARA (§3, `kind: 'boundary'`). Javob — SONLAR TO'PLAMI:
// bu savolni variant bilan berish mumkin emas, har qanday variant javobni
// aytib qo'yadi.
// O'ng yozuvning ruhsat etilgan qiymatlari satri BO'SH turadi — uni
// o'quvchi topadi, asbob ko'rsatmaydi.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L(
    "Nolga aylanadigan ko'paytuvchi",
    'Множитель, равный нулю',
    'A factor that equals zero',
  ),
  audio: [
    A('mount',
      "Ko'paytuvchi harfli bo'lsa, u qaysi qiymatda nolga aylanishini toping.",
      'Если множитель с буквой, найди значение, при котором он обращается в нуль.',
      'If the factor has a letter, find the value that makes it zero.'),
    A('why',
      "Chap yozuvda maxraj a, o'ngdagisiga a minus uch ko'paytuvchisi qo'shilgan.",
      'В левой записи знаменатель это a, к правой добавлен множитель a минус три.',
      'In the left record the denominator is a, and the right one gained the factor a minus three.'),
  ],
  props: {
    left: (
      <Row size="row" align="center">
        {F('5', 'a')}
      </Row>
    ),
    right: (
      <Row size="row" align="center">
        {F('5(a − 3)', 'a(a − 3)')}
      </Row>
    ),
    odzLeft: L('a ≠ 0', 'a ≠ 0', 'a ≠ 0'),
    odzRight: L('?', '?', '?'),
    question: L(
      "Qaysi qiymatda faqat o'ng yozuv hisoblanmaydi?",
      'При каком значении не считается только правая запись?',
      'At which value does only the right record fail?',
    ),
    answer: [3],
    hints: {
      '0': L(
        "Nolda chap yozuv ham hisoblanmaydi. Savol yangi ko'paytuvchi qo'shgan narsa haqida.",
        'При нуле не считается и левая запись. Спрашивают про то, что добавил новый множитель.',
        'At zero the left record fails too. The question is about what the new factor added.',
      ),
      '5': L(
        "Beshlik suratda turibdi, maxrajga ta'sir qilmaydi.",
        'Пятёрка стоит в числителе, на знаменатель она не влияет.',
        'The five is in the numerator, it does not affect the denominator.',
      ),
      '-3': L(
        "Minus uchda a minus uch minus oltiga teng, nolga emas.",
        'При минус трёх a минус три равно минус шести, а не нулю.',
        'At minus three, a minus three equals minus six, not zero.',
      ),
      '*': L(
        "Ko'paytuvchi a minus uch. U qaysi sonda nolga aylanadi?",
        'Множитель это a минус три. При каком числе он равен нулю?',
        'The factor is a minus three. At which number does it become zero?',
      ),
    },
    note: L(
      "Yangi ko'paytuvchi yangi shart keltirdi",
      'Новый множитель принёс новое условие',
      'The new factor brought a new condition',
    ),
  },
}

// ============================================================
// EKRAN 8. QOIDA. O'quvchi formulani O'ZI yig'adi, keyin darslik matni
// ochiladi. Shu yerda dars XUKKA QAYTADI (§5): ikki yozuv qaytadi va
// ularning orasida endi tenglik turadi.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    'Asosiy xossa qoidasi',
    'Правило основного свойства',
    'The rule of the basic property',
  ),
  audio: [
    A('mount',
      "Qoidani o'zingiz yig'asiz, keyin darslik matni ochiladi.",
      'Правило соберёшь сам, потом откроется текст учебника.',
      'You will assemble the rule yourself, then the textbook text opens.'),
    W('card',
      "Darslikda bu kasrning asosiy xossasi deb ataladi. Xuk yozuvlari ham javobini oldi.",
      'В учебнике это называется основным свойством дроби. И записи с первого экрана получили ответ.',
      'In the textbook this is called the basic property of a fraction. The records from the first screen got their answer too.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L('Surat va maxrajni', 'Числитель и знаменатель', 'Numerator and denominator') },
      { id: 'f2', label: L("bitta ifodaga ko'paytirish yoki bo'lish mumkin", 'можно умножить или разделить на одно и то же', 'may be multiplied or divided by the same thing') },
      { id: 'f3', label: L("nolga teng bo'lmagan", 'не равное нулю', 'that is not zero') },
      { id: 'f4', label: L("kasr esa o'zgarmaydi", 'а дробь при этом не изменится', 'and the fraction does not change') },
      { id: 'w1', label: L("har qanday ifodaga", 'на любое выражение', 'by any expression') },
      { id: 'w2', label: L("faqat songa", 'только на число', 'only by a number') },
      { id: 'w3', label: L("bitta ifoda qo'shish", 'прибавить одно и то же', 'add the same thing') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilganda qoida buziladi. Ko'paytuvchi haqida yetmagan shart bormi?",
      'В такой сборке правило ломается. Не пропущено ли условие про множитель?',
      'Assembled this way the rule breaks. Is the condition about the factor missing?',
    ),
    card: {
      title: L('KASRNING ASOSIY XOSSASI', 'ОСНОВНОЕ СВОЙСТВО ДРОБИ', 'THE BASIC PROPERTY OF A FRACTION'),
      lines: [
        L('a/b = ma/(mb),  b ≠ 0,  m ≠ 0', 'a/b = ma/(mb),  b ≠ 0,  m ≠ 0', 'a/b = ma/(mb),  b ≠ 0,  m ≠ 0'),
        L(
          "Surat va maxraj bitta ifodaga ko'paytirilsa yoki bo'linsa, unga teng kasr hosil bo'ladi",
          'Если числитель и знаменатель умножить или разделить на одно и то же, получится равная дробь',
          'If numerator and denominator are multiplied or divided by the same thing, an equal fraction results',
        ),
        L(
          "Harfli ko'paytuvchi yangi shart qo'shadi",
          'Буквенный множитель добавляет новое условие',
          'A factor with a letter adds a new condition',
        ),
      ],
      source: L('Darslik, 2-§, 13-bet', 'Учебник, § 2, стр. 13', 'Textbook, section 2, page 13'),
      locked: L("Qoida yig'ilgandan keyin ochiladi", 'Откроется после сборки правила', 'Opens once the rule is assembled'),
    },
    recall: {
      left: L('(a + 2)/3', '(a + 2)/3', '(a + 2)/3'),
      right: L('(a + 2)a/(3a),  a ≠ 0', '(a + 2)a/(3a),  a ≠ 0', '(a + 2)a/(3a),  a ≠ 0'),
      winner: 'right',
      note: L(
        "Ikkalasi teng, faqat a nol bo'lmasa",
        'Обе равны, только при a, не равном нулю',
        'Both are equal, but only when a is not zero',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ, ZANJIR. To'rt qisqa topshiriq, javob YOZILADI.
// Formatlar boshqa boshqa: son, ifoda, son, ruhsat etilgan qiymatlar.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    "Yo'qolgan ko'paytuvchi",
    'Пропавший множитель',
    'The missing factor',
  ),
  audio: [
    A('mount',
      "To'rt qisqa topshiriq. Har birida bitta ko'paytuvchi qidiriladi.",
      'Четыре коротких задания. В каждом ищется один множитель.',
      'Four short tasks. Each one looks for a single factor.'),
    W('t1',
      "Surat uchga ko'paytirilgan, demak maxraj ham uchga ko'paytiriladi.",
      'Числитель умножен на три, значит и знаменатель умножается на три.',
      'The numerator is multiplied by three, so the denominator is multiplied by three too.'),
    W('t2',
      "Maxrajda b paydo bo'ldi, demak suratda ham b ko'paytuvchi bo'lishi kerak.",
      'В знаменателе появилось b, значит и в числителе нужен множитель b.',
      'A b appeared in the denominator, so the numerator needs the factor b as well.'),
    W('t3',
      "Ko'paytuvchi bitta va u ikkala qismga tegishli.",
      'Множитель один, и он относится к обеим частям.',
      'The factor is one and the same and it belongs to both parts.'),
    W('t4',
      "Harfli ko'paytuvchi qo'shilganda ruhsat etilgan qiymatlar kamayadi.",
      'Когда добавляется буквенный множитель, допустимых значений становится меньше.',
      'When a factor with a letter is added, fewer values remain admissible.'),
  ],
  props: {
    items: [
      {
        prompt: L(
          "Maxrajda qanday son turadi?",
          'Какое число стоит в знаменателе?',
          'Which number goes in the denominator?',
        ),
        show: (
          <Row size="row" align="center">
            {F('7', '8')}
            {' = '}
            {F('21', '?')}
          </Row>
        ),
        kind: 'number',
        answer: '24',
        accepts: ['24'],
        hints: {
          '27': L(
            "Bu qo'shish bo'ldi. Surat uchga ko'paytirilgan, qo'shilgan emas.",
            'Это прибавление. Числитель умножен на три, а не увеличен на три.',
            'That is addition. The numerator was multiplied by three, not increased by three.',
          ),
          '12': L(
            "Sakkizni ikkiga ko'paytirsak 16 chiqadi. Surat nechaga ko'paytirilgan?",
            'Восемь умножить на два это шестнадцать. А на что умножен числитель?',
            'Eight times two is sixteen. And what was the numerator multiplied by?',
          ),
        },
        closed: L('7/8 = 21/24', '7/8 = 21/24', '7/8 = 21/24'),
      },
      {
        prompt: L(
          "Suratda nima turadi?",
          'Что стоит в числителе?',
          'What goes in the numerator?',
        ),
        show: (
          <Row size="row" align="center">
            {F('a', '4')}
            {' = '}
            {F('?', '4b')}
          </Row>
        ),
        kind: 'expr',
        answer: 'a*b',
        accepts: ['ab', 'b*a'],
        hints: {
          'a+b': L(
            "Qo'shish teng kasr bermaydi. Maxrajda b ko'paytuvchi bo'lib turibdi.",
            'Прибавление не даёт равной дроби. В знаменателе b стоит множителем.',
            'Addition does not give an equal fraction. In the denominator b stands as a factor.',
          ),
          'a': L(
            "Surat o'zgarmasa, kasr boshqa bo'lib qoladi.",
            'Если числитель не меняется, дробь становится другой.',
            'If the numerator stays put, the fraction becomes different.',
          ),
        },
        closed: L('a/4 = ab/(4b)', 'a/4 = ab/(4b)', 'a/4 = ab/(4b)'),
      },
      {
        prompt: L(
          "Ikkala qism nechaga ko'paytirilgan?",
          'На что умножены обе части?',
          'What were both parts multiplied by?',
        ),
        show: (
          <Row size="row" align="center">
            {F('3', 'x')}
            {' = '}
            {F('12', '4x')}
          </Row>
        ),
        kind: 'number',
        answer: '4',
        accepts: ['4'],
        hints: {
          '12': L(
            "12 bu natija, ko'paytuvchi emas. Uchdan 12 chiqishi uchun nechaga ko'paytirish kerak?",
            'Двенадцать это результат, а не множитель. На что нужно умножить три, чтобы вышло двенадцать?',
            'Twelve is the result, not the factor. What must three be multiplied by to give twelve?',
          ),
          '8': L(
            "Uchni sakkizga ko'paytirsak 24 chiqadi.",
            'Три умножить на восемь это двадцать четыре.',
            'Three times eight is twenty four.',
          ),
        },
        closed: L('3/x = 12/(4x)', '3/x = 12/(4x)', '3/x = 12/(4x)'),
      },
      {
        prompt: L(
          "Yangi kasrning ruhsat etilgan qiymatlarini yozing",
          'Запиши допустимые значения новой дроби',
          'Write the admissible values of the new fraction',
        ),
        show: (
          <Row size="row" align="center">
            {F('4', 'a')}
            {' = '}
            {F('4(a − 5)', 'a(a − 5)')}
          </Row>
        ),
        kind: 'odz',
        varName: 'a',
        excluded: [0, 5],
        accepts: ['a != 0, a != 5', 'a(a-5) != 0'],
        hints: {
          'a != 0': L(
            "a minus besh ko'paytuvchisi ham nolga aylanadi. Qaysi qiymatda?",
            'Множитель a минус пять тоже обращается в нуль. При каком значении?',
            'The factor a minus five also becomes zero. At which value?',
          ),
          'a != 5': L(
            "Nol shart ko'paytirishdan oldin ham bor edi, maxrajda a turibdi.",
            'Условие про нуль было и до умножения: в знаменателе стоит a.',
            'The condition about zero existed before the multiplication: the denominator holds a.',
          ),
        },
        closed: L('a ≠ 0, a ≠ 5', 'a ≠ 0, a ≠ 5', 'a ≠ 0, a ≠ 5'),
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ, QADAMLAR NOMLANGAN. Usul kartochkasi topshiriq USTIDA
// turadi (§4): kontent vertikal, «yonida» degani «ustida».
// ============================================================
const S10 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    'Yangi maxraj qadamlab',
    'Новый знаменатель по шагам',
    'A new denominator step by step',
  ),
  audio: [
    A('mount',
      "Maxraj berilgan, uchta qadam nomlangan. Har qadamda javobni yozasiz.",
      'Знаменатель задан, три шага названы. На каждом шаге пишешь ответ.',
      'The denominator is given and three steps are named. You write the answer at each step.'),
    W('f1',
      "Yetmagan ko'paytuvchi topildi.",
      'Не хватавший множитель найден.',
      'The missing factor is found.'),
    W('f2',
      "Surat ham shu ko'paytuvchiga ko'paytirildi.",
      'Числитель тоже умножен на этот множитель.',
      'The numerator is multiplied by that factor as well.'),
    W('f3',
      "Ikki shart bor. Bittasi eski maxrajdan, ikkinchisi yangi ko'paytuvchidan.",
      'Условий два. Одно от старого знаменателя, другое от нового множителя.',
      'There are two conditions. One from the old denominator, one from the new factor.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {F('2', 'x − 3')}
      </Row>
    ),
    fields: [
      {
        ask: L(
          "Maxraj (x − 3)(x + 1) bo'lishi kerak. Qanday ko'paytuvchi yetmaydi?",
          'Нужен знаменатель (x − 3)(x + 1). Какого множителя не хватает?',
          'The denominator must be (x − 3)(x + 1). Which factor is missing?',
        ),
        kind: 'expr',
        answer: 'x+1',
        accepts: ['1+x'],
        hints: {
          'x-1': L(
            "Maxrajda x plyus bir turibdi. Belgiga qarang.",
            'В знаменателе стоит x плюс один. Посмотри на знак.',
            'The denominator holds x plus one. Look at the sign.',
          ),
          'x+3': L(
            "Uchlik oldida minus turibdi, va u eski maxrajda qoladi.",
            'Перед тройкой стоит минус, и она остаётся в старом знаменателе.',
            'The three carries a minus and it stays in the old denominator.',
          ),
        },
      },
      {
        ask: L(
          "Yangi kasrni yozing",
          'Запиши новую дробь',
          'Write the new fraction',
        ),
        kind: 'expr',
        answer: '2(x+1)/((x-3)(x+1))',
        accepts: ['(2x+2)/((x-3)(x+1))', '2*(x+1)/((x-3)*(x+1))'],
        hints: {
          '2/((x-3)(x+1))': L(
            "Surat ham x plyus birga ko'paytiriladi.",
            'Числитель тоже умножается на x плюс один.',
            'The numerator is multiplied by x plus one as well.',
          ),
          '2(x+1)/(x-3)': L(
            "Maxraj o'sha bo'lib qoldi, unga ko'paytuvchi kelmadi.",
            'Знаменатель остался прежним, множитель к нему не пришёл.',
            'The denominator stayed as it was, the factor never reached it.',
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
        varName: 'x',
        excluded: [-1, 3],
        accepts: ['x != 3, x != -1', '(x-3)(x+1) != 0'],
        hints: {
          'x != 3': L(
            "Yangi ko'paytuvchi x plyus bir minus birda nolga aylanadi.",
            'Новый множитель x плюс один обращается в нуль при минус единице.',
            'The new factor x plus one becomes zero at minus one.',
          ),
          'x != -1': L(
            "Iks uchga teng bo'lmasligi sharti ko'paytirishdan oldin ham bor edi.",
            'Условие про икс, не равный трём, было и до умножения.',
            'The condition that x is not three existed before the multiplication.',
          ),
          'x != 3, x != 1': L(
            "Bittada x plyus bir ikkiga teng, nolga emas.",
            'При единице x плюс один равно двум, а не нулю.',
            'At one, x plus one equals two, not zero.',
          ),
        },
      },
    ],
  },
}

// ============================================================
// EKRAN 11. ASBOBSIZ. Yozuv, ikki maydon va O'QUVCHINING SONI.
// Amal qatori YO'Q, yordam YO'Q: bu ekranda natija tekshiriladi, protsess
// emas. Javobni son bilan tekshirish MAJBURIY (З16).
// ============================================================
const S11 = {
  eyebrow: L('MUSTAQIL', 'САМ', 'ON YOUR OWN'),
  title: L(
    'Teng kasr yordamsiz',
    'Равная дробь без подсказки',
    'An equal fraction without help',
  ),
  audio: [
    A('mount',
      "Bu ekranda asbob yo'q. Yozuvni o'zingiz yozasiz va o'z soningiz bilan tekshirasiz.",
      'На этом экране прибора нет. Запись пишешь сам и проверяешь своим числом.',
      'There is no instrument on this screen. You write the record yourself and check it with your own number.'),
    A('why',
      "Maxraj a ko'paytuvchisiga ega bo'lishi kerak. Suratni ham unutmang.",
      'Знаменатель должен получить множитель a. Не забудь и про числитель.',
      'The denominator must gain the factor a. Do not forget the numerator either.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {F('a', 'a + 2')}
      </Row>
    ),
    result: {
      ask: L(
        "Maxraji a(a + 2) bo'lgan kasrni yozing",
        'Запиши дробь со знаменателем a(a + 2)',
        'Write the fraction with denominator a(a + 2)',
      ),
      kind: 'expr',
      answer: 'a*a/(a*(a+2))',
      accepts: ['a*a/(a*a+2a)', '(a*a)/(a(a+2))', 'aa/(a(a+2))'],
      hints: {
        'a/(a(a+2))': L(
          "Surat o'zgarmagan. Uni ham a ga ko'paytirish kerak.",
          'Числитель не изменился. Его тоже надо умножить на a.',
          'The numerator did not change. It must be multiplied by a too.',
        ),
        'a*a/(a+2)': L(
          "Maxrajda a ko'paytuvchisi yo'q, faqat surat o'zgargan.",
          'В знаменателе множителя a нет, изменился только числитель.',
          'The denominator has no factor a, only the numerator changed.',
        ),
      },
    },
    odz: {
      ask: L(
        "Ruhsat etilgan qiymatlarni yozing",
        'Запиши допустимые значения',
        'Write the admissible values',
      ),
      varName: 'a',
      excluded: [-2, 0],
      accepts: ['a != 0, a != -2', 'a(a+2) != 0'],
      hints: {
        'a != -2': L(
          "Yangi ko'paytuvchi a nolda nolga aylanadi.",
          'Новый множитель a обращается в нуль при нуле.',
          'The new factor a becomes zero at zero.',
        ),
        'a != 0': L(
          "a plyus ikki minus ikkida nolga aylanadi, bu shart eski.",
          'a плюс два обращается в нуль при минус двух, это старое условие.',
          'a plus two becomes zero at minus two, that is the old condition.',
        ),
      },
    },
    proof: {
      varName: 'a',
      from: 'a/(a+2)',
      to: 'a*a/(a*(a+2))',
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
      "Qiymatlar mos keldi, demak kasr o'sha kasr",
      'Значения совпали, значит дробь та же',
      'The values matched, so the fraction is the same',
    ),
  },
}

// ============================================================
// EKRAN 12. TUZOQ (З16, З2). Har satr alohida to'g'ri ko'rinadi, javob ham
// to'g'ri — noto'g'ri narsa SHARTLAR haqidagi satr.
// Sonli maxraj ataylab olingan: ko'paytirishdan OLDIN hech qanday shart
// yo'q edi, keyin esa paydo bo'ldi. «Sonlar xavfsiz» degan fikr shu yerda
// buziladi.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    'Ruhsat etilgan qiymatlar satri',
    'Строка про допустимые значения',
    'The line about admissible values',
  ),
  audio: [
    A('mount',
      "Boshqa odamning yechimi. Birinchi noto'g'ri satrni toping.",
      'Чужое решение. Найди первую неверную строку.',
      "Someone else's solution. Find the first incorrect line."),
    W('proof',
      "Endi son bilan ko'rsating. Qaysi qiymatda o'ng yozuvning qiymati yo'q?",
      'Теперь покажи числом. При каком значении у правой записи значения нет?',
      'Now show it with a number. At which value does the right record have no value?'),
  ],
  props: {
    rows: [
      {
        id: 'r1',
        show: L(
          "Maxraj 3x kerak, ko'paytuvchi x",
          'Нужен знаменатель 3x, множитель x',
          'Denominator 3x is needed, the factor is x',
        ),
      },
      {
        id: 'r2',
        show: (
          <Row size="row" align="center">
            {F('4', '3')}
            {' = '}
            {F('4x', '3x')}
          </Row>
        ),
      },
      {
        id: 'r3',
        show: L(
          "Iksga shart yo'q, ikkalasi ham har doim hisoblanadi",
          'Условий на x нет, обе считаются всегда',
          'No conditions on x, both always compute',
        ),
      },
      {
        id: 'r4',
        show: L(
          'Javob 4x/(3x)',
          'Ответ 4x/(3x)',
          'The answer is 4x/(3x)',
        ),
      },
    ],
    answerId: 'r3',
    hints: {
      'r1': L(
        "Bu satr to'g'ri. Uchni x ga ko'paytirsak 3x chiqadi.",
        'Эта строка верна: три умножить на икс это 3x.',
        'This line is correct: three times x is 3x.',
      ),
      'r2': L(
        "Bu ham to'g'ri. Surat ham, maxraj ham x ga ko'paytirilgan.",
        'И это верно: и числитель, и знаменатель умножены на икс.',
        'This is correct too: both numerator and denominator are multiplied by x.',
      ),
      'r4': L(
        "Javobning o'zi to'g'ri yozilgan. Xato yuqoridagi satrda.",
        'Сама запись ответа верна. Ошибка в строке выше.',
        'The answer itself is written correctly. The error is in the line above.',
      ),
    },
    ask: {
      label: L("Son qo'ying", 'Поставь число', 'Put in a number'),
      of: '4x/(3x)',
      varName: 'x',
      wrong: L(
        "Bu qiymatda o'ng yozuv hisoblanadi. Yangi maxraj qaysi sonda nolga aylanadi?",
        'При этом значении правая запись считается. При каком числе новый знаменатель обращается в нуль?',
        'At this value the right record computes. At which number does the new denominator become zero?',
      ),
      note: L(
        "Nolda 3x nolga teng, va qiymat yo'q. Ko'paytirishdan oldin bu shart yo'q edi.",
        'При нуле 3x равно нулю, и значения нет. До умножения этого условия не было.',
        'At zero, 3x is zero and there is no value. Before the multiplication this condition did not exist.',
      ),
    },
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH, TESKARI TOPSHIRIQ. Odatda ko'paytuvchi beriladi;
// bu yerda RUHSAT ETILGAN QIYMATLAR beriladi, ko'paytuvchini o'quvchi
// o'zi tanlaydi.
// ============================================================
const S13 = {
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Shart bo'yicha ko'paytuvchi",
    'Множитель по условию',
    'A factor from the condition',
  ),
  audio: [
    A('mount',
      "Endi teskarisi. Ruhsat etilgan qiymatlar berilgan, ko'paytuvchini o'zingiz tanlaysiz.",
      'Теперь наоборот. Допустимые значения даны, множитель выбираешь сам.',
      'Now the other way round. The admissible values are given, you choose the factor.'),
    A('why',
      "Ikki nol kerak. Bittasi eski maxrajdan keladi, ikkinchisini ko'paytuvchi keltiradi.",
      'Нужны два нуля. Один приходит от старого знаменателя, второй приносит множитель.',
      'Two zeros are needed. One comes from the old denominator, the factor brings the second.'),
  ],
  props: {
    prompt: L(
      "3/(x + 1) ga teng kasr yozing, uning ruhsat etilgan qiymatlari x ≠ −1 va x ≠ 2 bo'lsin",
      'Запиши дробь, равную 3/(x + 1), у которой допустимые значения x ≠ −1 и x ≠ 2',
      'Write a fraction equal to 3/(x + 1) whose admissible values are x ≠ −1 and x ≠ 2',
    ),
    reduceTo: '3/(x+1)',
    excluded: [-1, 2],
    varName: 'x',
    hints: {
      '3/(x+1)': L(
        "Ko'paytuvchi hali yo'q, shartlar o'sha bo'lib qoldi.",
        'Множителя пока нет, условия остались прежними.',
        'There is no factor yet, the conditions stayed the same.',
      ),
      '3(x+2)/((x+1)(x+2))': L(
        "x plyus ikki minus ikkida nolga aylanadi, bizga esa ikkida kerak.",
        'x плюс два обращается в нуль при минус двух, а нужно при двух.',
        'x plus two becomes zero at minus two, but two is what is needed.',
      ),
      '3(x-2)/(x+1)': L(
        "Ko'paytuvchi faqat suratga qo'yilgan, maxraj o'sha qoldi.",
        'Множитель поставлен только в числитель, знаменатель остался прежним.',
        'The factor went only into the numerator, the denominator stayed as it was.',
      ),
    },
    note: L(
      "Shartni ko'paytuvchi belgilaydi",
      'Условие задаёт множитель',
      'The factor sets the condition',
    ),
  },
}

// ============================================================
// EKRAN 14. BLITS. To'rt savol BELGI haqida, yozuv haqida emas.
// Ball YO'Q: birinchi urinishlardan tayyorlik yig'iladi va 15-ekranda
// SO'Z bilan aytiladi.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Ko'paytuvchi belgisi",
    'Признак множителя',
    'The mark of the factor',
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
        tag: 'З21',
        ask: L(
          "Surat va maxrajni nimaga ko'paytirish mumkin emas?",
          'На что нельзя умножать числитель и знаменатель?',
          'What must numerator and denominator never be multiplied by?',
        ),
        options: [
          { id: 'zero', right: true, label: L('Nolga', 'На нуль', 'By zero') },
          { id: 'neg', label: L('Minus birga', 'На минус один', 'By minus one') },
          { id: 'let', label: L('Harfli ifodaga', 'На выражение с буквой', 'By an expression with a letter') },
          { id: 'ten', label: L("O'nga", 'На десять', 'By ten') },
        ],
        hint: L(
          "Ikkala qism ham nolga aylansa, yozuvdan nima qoladi?",
          'Если обе части обратятся в нуль, что останется от записи?',
          'If both parts become zero, what is left of the record?',
        ),
        ok: L(
          "Nolda surat ham, maxraj ham nol, bunday yozuvning qiymati yo'q.",
          'При нуле и числитель, и знаменатель нули, а у такой записи значения нет.',
          'At zero both numerator and denominator are zero, and such a record has no value.',
        ),
      },
      {
        id: 'q2',
        tag: 'З1',
        ask: L(
          "2/5 kasri bilan qaysi amal asosiy xossa bo'ladi?",
          'Какое действие с дробью 2/5 будет основным свойством?',
          'Which action on the fraction 2/5 is the basic property?',
        ),
        options: [
          { id: 'mul', right: true, label: L("Ikkalasini uchga ko'paytirish", 'Умножить обе части на 3', 'Multiply both parts by 3') },
          { id: 'add', label: L("Ikkalasiga uch qo'shish", 'Прибавить 3 к обеим частям', 'Add 3 to both parts') },
          { id: 'num', label: L("Suratni uchga ko'paytirish", 'Умножить числитель на 3', 'Multiply the numerator by 3') },
          { id: 'den', label: L("Maxrajga uch qo'shish", 'Прибавить 3 к знаменателю', 'Add 3 to the denominator') },
        ],
        hint: L(
          "Sonlarda tekshiring. Ikki beshdan nol butun to'rt, besh sakkizdan esa boshqa son.",
          'Проверь на числах: две пятых это 0,4, а пять восьмых уже другое число.',
          'Check with numbers: two fifths is 0.4, while five eighths is a different number.',
        ),
        ok: L(
          "Ikkalasi bitta songa ko'paytirilganda qiymat saqlanadi.",
          'Когда обе части умножены на одно число, значение сохраняется.',
          'When both parts are multiplied by the same number, the value is preserved.',
        ),
      },
      {
        id: 'q3',
        tag: 'З2',
        ask: L(
          "Ikkala qism x − 7 ga ko'paytirildi. Qanday shart paydo bo'ldi?",
          'Обе части умножили на x − 7. Какое условие появилось?',
          'Both parts were multiplied by x − 7. Which condition appeared?',
        ),
        options: [
          { id: 'p7', right: true, label: L('x ≠ 7', 'x ≠ 7', 'x ≠ 7') },
          { id: 'm7', label: L('x ≠ −7', 'x ≠ −7', 'x ≠ −7') },
          { id: 'none', label: L("Shart yo'q", 'Условий нет', 'No condition') },
          { id: 'zero', label: L('x ≠ 0', 'x ≠ 0', 'x ≠ 0') },
        ],
        hint: L(
          "Yettini x minus yettiga qo'ying va nima chiqishini ko'ring.",
          'Подставь семь в x минус семь и посмотри, что выйдет.',
          'Substitute seven into x minus seven and see what comes out.',
        ),
        ok: L(
          "Yettida ko'paytuvchi nolga aylanadi, va yozuv qiymatini yo'qotadi.",
          'При семи множитель обращается в нуль, и запись теряет значение.',
          'At seven the factor becomes zero and the record loses its value.',
        ),
      },
      {
        id: 'q4',
        tag: 'З22',
        ask: L(
          "Ikkala qism minus birga ko'paytirildi. Nima o'zgardi?",
          'Обе части умножили на минус один. Что изменилось?',
          'Both parts were multiplied by minus one. What changed?',
        ),
        options: [
          { id: 'nothing', right: true, label: L("Hech narsa, kasr o'sha", 'Ничего, дробь та же', 'Nothing, the fraction is the same') },
          { id: 'opp', label: L("Kasr qarama-qarshi bo'ldi", 'Дробь стала противоположной', 'The fraction became the opposite') },
          { id: 'cond', label: L("Shart boshqa bo'ldi", 'Условие стало другим', 'The condition became different') },
          { id: 'pos', label: L("Qiymat musbat bo'ldi", 'Значение стало положительным', 'The value became positive') },
        ],
        hint: L(
          "Minus bir ham ko'paytuvchi. Xossa nolga ko'paytirishdan tashqari hammasiga ruxsat beradi.",
          'Минус один тоже множитель. Свойство разрешает любой множитель, кроме нуля.',
          'Minus one is a factor too. The property allows any factor except zero.',
        ),
        ok: L(
          "Minus bir nol emas, shuning uchun qiymat ham, shart ham o'sha qoldi.",
          'Минус один не нуль, поэтому и значение, и условие остались прежними.',
          'Minus one is not zero, so both the value and the condition stayed the same.',
        ),
      },
    ],
    scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
    stepLabel: L('Savol', 'Вопрос', 'Question'),
  },
}

// ============================================================
// EKRAN 15. YAKUN. Yangi matematika va yangi kiritish YO'Q.
// Taxmin natijaga qarshi turadi, usullar esa yodda qoladi.
// Sahna xuk savoliga javob beradi.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    'Teng kasr va shart',
    'Равная дробь и условие',
    'An equal fraction and its condition',
  ),
  audio: [
    A('s0',
      "Xukdagi savol javobini oldi. Yozuvlar teng, lekin a nol bo'lmaganda.",
      'Вопрос с хука получил ответ. Записи равны, но при a, не равном нулю.',
      'The question from the hook has its answer. The records are equal, but only when a is not zero.'),
    A('s1',
      "Uch usul qoldi. Bitta ko'paytuvchi ikkalasiga, minusni ko'chirish va ko'paytuvchini nolga tekshirish.",
      'Остаются три способа. Один множитель на обе части, перенести минус и проверить множитель на нуль.',
      'Three methods remain. One factor for both parts, move the minus, and test the factor for zero.'),
    A('s2',
      "Keyingi darsda teskari yo'nalish, qisqartirish. U yerda ko'paytuvchi ketadi, shart esa qoladi.",
      'В следующем уроке обратный ход, сокращение. Там множитель уходит, а условие остаётся.',
      'The next lesson takes the reverse direction, reducing. There the factor leaves and the condition stays.'),
  ],
  props: {
    predictedLabel: L('Taxmin', 'Прогноз', 'Prediction'),
    proved: L(
      "Teng, lekin a nol bo'lmaganda",
      'Равны, но при a, не равном нулю',
      'Equal, but only when a is not zero',
    ),
    canLabel: L('Endi nima qila olasiz', 'Что теперь умеешь', 'What you can do now'),
    can: [
      L(
        "Kasrni kerakli maxrajga keltirish",
        'Привести дробь к нужному знаменателю',
        'Bring a fraction to the required denominator',
      ),
      L(
        "Maxrajdagi minusni ko'chirish",
        'Перенести минус из знаменателя',
        'Move a minus out of the denominator',
      ),
      L(
        "Ko'paytuvchi qanday shart qo'shganini aytish",
        'Назвать условие, которое добавил множитель',
        'Name the condition the factor added',
      ),
    ],
    proofNote: L(
      "Fakt. Kompyuter kasrni ikki son bilan saqlaydi, va har amaldan keyin ularni umumiy ko'paytuvchiga bo'ladi. Aks holda sonlar o'sib, xotiraga sig'may qoladi.",
      'Факт. Компьютер хранит дробь парой чисел и после каждого действия делит их на общий множитель. Иначе числа растут и перестают помещаться в память.',
      'A fact. A computer stores a fraction as a pair of numbers and divides them by a common factor after every operation. Otherwise the numbers grow until they no longer fit in memory.',
    ),
    bridge: L(
      "Keyingi dars, qisqartirish, xuddi shu xossaning teskari yo'nalishi",
      'Следующий урок, сокращение, это та же самая работа в обратную сторону',
      'The next lesson, reducing, is the same work in the opposite direction',
    ),
    cheat: L('Xulosani chop etish', 'Распечатать памятку', 'Print the summary'),
    screenRef: L('8-ekranga qaytib qarang', 'посмотри снова экран 8', 'look at screen 8 again'),
  },
}

// ============================================================
// EKRANLAR. Rollar va tartib — `screens.jsx` dagi ROLE_ORDER bilan bir xil,
// ularni check-grade8.mjs POZITSIYA bo'yicha tekshiradi.
// `method` — usul kartochkasi topshiriq USTIDA, `scene` — darsning sahnasi.
// ============================================================
export const SCREENS = [
  { role: 'hook', tool: 'pick', scene: <HookScene />, ...S1 },
  { role: 'support', tool: 'chain', kind: 'pairs', ...S2 },
  { role: 'explain', tool: 'film', kind: 'film', tag: 'З20', ...S3 },
  { role: 'explain', tool: 'transform', kind: 'method1', tag: 'З20', method: M_MULT, ...S4 },
  { role: 'explain', tool: 'transform', kind: 'method2', tag: 'З22', method: M_SIGN, ...S5 },
  { role: 'explain', tool: 'solve', kind: 'together', tag: 'З16', ...S6 },
  { role: 'explain', tool: 'boundary', kind: 'boundary', tag: 'З21', ...S7 },
  { role: 'rule', tool: 'rulebuild', tag: 'З2', ...S8 },
  { role: 'practice', tool: 'chain', kind: 'drill', tag: 'З1', method: M_MULT, ...S9 },
  { role: 'practice', tool: 'fields', kind: 'guided', tag: 'З2', method: M_MULT, ...S10 },
  { role: 'practice', tool: 'solo', kind: 'solo', tag: 'З16', method: M_MULT, ...S11 },
  { role: 'practice', tool: 'audit', kind: 'audit', tag: 'З2', method: M_ZERO, ...S12 },
  { role: 'transfer', tool: 'inverse', kind: 'inverse', tag: 'З2', method: M_ZERO, ...S13 },
  { role: 'blitz', tool: 'blitz', ...S14 },
  { role: 'summary', tool: 'summary', scene: FinalScene, ...S15 },
]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
