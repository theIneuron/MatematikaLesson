// ============================================================================
// 8-sinf, Dars 7. y = k/x FUNKSIYASI. XOSSALARI VA GRAFIGI.
//
// Bu fayl — FAQAT MA'LUMOT (ETALON_8SINF.md §2). Mexanika `tools.jsx` da,
// grafika `plot.jsx` da, o'ram `screens.jsx` da.
//
// BLOK 1 NING GRAFIK DARSI. Skelet o'sha: 15 rol, o'sha tartib. Farqi
// asboblarda: bu yerda `film` figurasi GIPERBOLA (nuqtalar o'tiradi, tarmoqlar
// chiziladi), keyin TO'RT OYNA (shart, formula, jadval, grafik) va k bo'yicha
// SURGICH. Ular 2026-08-20 da yozildi va stendda ko'rildi
// (`probe/grade8-plot.html`).
//
// KASRLAR BO'LIMI BILAN ULANISH. Darsning eng qimmat joyi — NOL. Oldingi olti
// darsda maxrajdagi nol taqiq berardi; bu yerda o'sha taqiq CHIZMADA ko'rinadi:
// grafik y o'qiga tegmaydi, chunki nolda funksiyaning qiymati yo'q.
//
// DARSLIK. O'zbek darsligi, 7-§, 34-35-bet:
//   aniqlanish sohasi — noldan boshqa barcha haqiqiy sonlar;
//   grafigi GIPERBOLA deyiladi, u ikki TARMOQdan tuzilgan;
//   k > 0 bo'lganda tarmoqlar birinchi va uchinchi chorakda.
//
// ADASHISHLAR: З2, З16 — §11 ro'yxatidan. З27 (to'g'ri va teskari
// proporsionallik aralashtirildi) va З28 (k ning ishorasi hisobga olinmadi)
// YANGI, metodist so'zini kutadi.
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
  id: 'alg-8-07',
  n: 7,
  row: 7,
  block: 'Б1',
  topic: L(
    'y = k/x funksiyasi va uning grafigi',
    'Функция y = k/x и её график',
    'The function y = k/x and its graph',
  ),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Teskari proporsionallikda x va y ning ko'paytmasi o'zgarmaydi, u k ga teng",
    'При обратной пропорциональности произведение x на y постоянно и равно k',
    'In inverse proportionality the product of x and y stays constant and equals k',
  ),
  L(
    "Grafik giperbola, u ikki tarmoqdan tuzilgan, va tarmoqlarning joyini k ning ishorasi belgilaydi",
    'График это гипербола из двух ветвей, а где лежат ветви, решает знак k',
    'The graph is a hyperbola of two branches, and the sign of k decides where they lie',
  ),
  L(
    "Nolda funksiyaning qiymati yo'q, shuning uchun grafik o'qlarga tegmaydi",
    'В нуле у функции значения нет, поэтому график не касается осей',
    'At zero the function has no value, so the graph never touches the axes',
  ),
]

export const MISS = {
  'З2': {
    what: L(
      "nol aniqlanish sohasidan chiqarilmadi",
      'нуль не исключён из области определения',
      'zero was not excluded from the domain',
    ),
    wrong: '6/x',
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
  'З27': {
    what: L(
      "to'g'ri va teskari proporsionallik aralashtirildi",
      'прямая и обратная пропорциональность смешаны',
      'direct and inverse proportionality were confused',
    ),
    wrong: '6x',
    at: 0,
  },
  'З28': {
    what: L(
      "k ning ishorasi hisobga olinmadi, tarmoqlar boshqa choraklarda",
      'знак k не учтён: ветви оказались в других четвертях',
      'the sign of k was ignored and the branches ended up in the wrong quadrants',
    ),
    wrong: '-6/x',
    at: 1,
  },
}

// ============================================================
// USULLAR (§4).
// ============================================================
const M_PROD = {
  name: L(
    "1-USUL. Ko'paytma o'zgarmaydi",
    'СПОСОБ 1. Произведение',
    'METHOD 1. The product',
  ),
  steps: [
    L('Jadvaldan bir juftlikni oling', 'Возьми одну пару', 'Take one pair'),
    L('x va y ni ko\'paytiring', 'Умножь x на y', 'Multiply x by y'),
    L('Bu k, formulasi y = k/x', 'Это k', 'That is k'),
  ],
}

const M_SIGN = {
  name: L(
    '2-USUL. k ning ishorasi',
    'СПОСОБ 2. Знак k',
    'METHOD 2. The sign of k',
  ),
  steps: [
    L('k musbat bo\'lsa, tarmoqlar 1 va 3 chorakda', 'k положительно — ветви в 1 и 3 четверти', 'k positive means branches in quadrants 1 and 3'),
    L('k manfiy bo\'lsa, 2 va 4 chorakda', 'k отрицательно — во 2 и 4', 'k negative means quadrants 2 and 4'),
    L('Bitta nuqta ishorani ko\'rsatadi', 'Одна точка показывает знак', 'One point shows the sign'),
  ],
}

const M_ZERO = {
  name: L(
    '3-USUL. Nolni tekshirish',
    'СПОСОБ 3. Проверка нуля',
    'METHOD 3. Test the zero',
  ),
  steps: [
    L('Maxrajga qarang', 'Посмотри знаменатель', 'Look at the denominator'),
    L('Uni nolga tenglang', 'Приравняй его к нулю', 'Set it equal to zero'),
    L('Bu qiymat sohadan chiqadi', 'Это значение уходит из области', 'That value leaves the domain'),
  ],
}

// ============================================================
// SAHNALAR (§6). Egri chiziq FUNKSIYADAN hisoblanadi, qo'lda chizilmaydi:
// qo'lda chizilgan grafik yolg'on bo'lishi mumkin va buni hech qanday
// tekshiruv tutmaydi (§7.2 p. 1).
// ============================================================
const SC_ODZ = L('RUHSAT ETILGAN QIYMATLAR', 'ДОПУСТИМЫЕ ЗНАЧЕНИЯ', 'ADMISSIBLE VALUES')

// Sahna koordinatalari: x nolgacha 0.6 dan boshlanadi, aks holda tarmoq
// kadrdan chiqib ketadi. Kadr 400 na 154, markaz (200, 78).
const branchPath = (k, sign) => {
  const CX = 200
  const CY = 78
  const SX = 22   // bitta birlik x bo'yicha
  const SY = 9.5  // bitta birlik y bo'yicha
  let d = ''
  for (let i = 0; i <= 44; i += 1) {
    const x = sign * (0.62 + i * 0.13)
    const y = k / x
    const px = CX + x * SX
    const py = CY - y * SY
    if (py < 8 || py > 148 || px < 16 || px > 384) { d = d ? d : ''; continue }
    d += (d ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1)
  }
  return d
}

// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <SceneBand kind="hook" label={L(
      "Giperbola va y o'qi",
      'Гипербола и ось y',
      'A hyperbola and the y axis',
    )}>
      {/* O'qlar */}
      <line x1="20" y1="78" x2="380" y2="78" stroke={T.ink2} strokeWidth="1.4"/>
      <line x1="200" y1="10" x2="200" y2="146" stroke={T.ink2} strokeWidth="1.4"/>
      <text x="374" y="70" textAnchor="end" fontFamily={MATH_FONT} fontSize="11"
        fontStyle="italic" fill={T.ink2}>x</text>
      <text x="208" y="20" fontFamily={MATH_FONT} fontSize="11" fontStyle="italic" fill={T.ink2}>y</text>
      <text x="192" y="90" textAnchor="end" fontFamily={MATH_FONT} fontSize="10" fill={T.ink3}>O</text>

      {/* Ikki tarmoq: chizma CHIZILADI, tayyor turmaydi. */}
      <path d={branchPath(4, 1)} fill="none" stroke={T.accent} strokeWidth="2.2"
        pathLength="1" className="g8-draw"/>
      <path d={branchPath(4, -1)} fill="none" stroke={T.accent} strokeWidth="2.2"
        pathLength="1" className="g8-draw"/>

      {/* SAVOL o'qning yonida: aynan shu joy haqida so'raladi. */}
      <g className="g8-seat" style={{ '--d': '3200ms' }}>
        <circle cx="200" cy="46" r="15" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="200" y="52" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17"
          fontWeight="700" fill={T.graph}>?</text>
      </g>

      <text x="200" y="140" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="8.5" letterSpacing="0.16em" fill={T.ink3}>{t(SC_ODZ)}</text>
      <line x1="132" y1="150" x2="268" y2="150" stroke="rgba(23,26,29,.18)" strokeWidth="1.2"
        strokeDasharray="4 5"/>
    </SceneBand>
  )
}

// YAKUN: o'sha giperbola, lekin y o'qi endi TAQIQ chizig'i, va shart yozilgan.
const FinalScene = (
  <SceneBand kind="final" label={L(
    "Tarmoqlar o'qlarga tegmaydi",
    'Ветви не касаются осей',
    'The branches never touch the axes',
  )}>
    <line x1="24" y1="46" x2="300" y2="46" stroke={T.ink2} strokeWidth="1.3"/>
    <line x1="162" y1="8" x2="162" y2="84" stroke={T.tip} strokeWidth="2"
      strokeDasharray="5 4"/>
    <text x="296" y="40" textAnchor="end" fontFamily={MATH_FONT} fontSize="10"
      fontStyle="italic" fill={T.ink2}>x</text>
    <text x="170" y="16" fontFamily={MATH_FONT} fontSize="10" fontStyle="italic" fill={T.ink2}>y</text>

    {/* Tarmoqlar: markaz (162, 46), o'lchov kichikroq — kadr past. */}
    <path
      d={(() => {
        let d = ''
        for (let i = 0; i <= 40; i += 1) {
          const x = 0.62 + i * 0.12
          const y = 3 / x
          const px = 162 + x * 24
          const py = 46 - y * 7
          if (py < 6 || px > 298) continue
          d += (d ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1)
        }
        return d
      })()}
      fill="none" stroke={T.ok} strokeWidth="2"
    />
    <path
      d={(() => {
        let d = ''
        for (let i = 0; i <= 40; i += 1) {
          const x = -(0.62 + i * 0.12)
          const y = 3 / x
          const px = 162 + x * 24
          const py = 46 - y * 7
          if (py > 86 || px < 26) continue
          d += (d ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1)
        }
        return d
      })()}
      fill="none" stroke={T.ok} strokeWidth="2"
    />

    <g className="g8-seat" style={{ '--d': '700ms' }}>
      <rect x="306" y="30" width="80" height="20" rx="10" fill={T.tipSoft}/>
      <text x="346" y="44" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
        fontWeight="700" fill={T.tip}>{'x ≠ 0'}</text>
    </g>
    <g className="g8-seat" style={{ '--d': '1100ms' }}>
      <text x="346" y="70" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
        fill={T.ok}>{'xy = 3'}</text>
    </g>
  </SceneBand>
)

// ============================================================
// EKRAN 1. XUK. Bitta savol, ikki taxmin, razbor yo'q (§5).
// ============================================================
const S1 = {
  eyebrow: L('GIPERBOLA', 'ГИПЕРБОЛА', 'HYPERBOLA'),
  title: L(
    "Grafik va y o'qi",
    'График и ось y',
    'The graph and the y axis',
  ),
  lead: L(
    "Javobini dars davomida o'zingiz topasiz",
    'Ответ найдёшь сам по ходу урока',
    'You will find the answer yourself during the lesson',
  ),
  audio: [
    A('mount',
      "Chizmada ikki tarmoqli grafik. U y o'qiga yaqinlashadi.",
      'На чертеже график из двух ветвей. Он приближается к оси y.',
      'The drawing shows a graph of two branches. It comes close to the y axis.'),
    A('why',
      "Taxmin qiling, tarmoq o'qqa tegadimi yoki hech qachon tegmaydimi.",
      'Предположи, коснётся ли ветвь оси или не коснётся никогда.',
      'Predict whether a branch touches the axis or never does.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Grafik y o'qini kesib o'tadimi?",
      'Пересечёт ли график ось y?',
      'Will the graph cross the y axis?',
    ),
    items: [
      {
        id: 'yes',
        show: L("Ha, nolda kesib o'tadi", 'Да, пересечёт в нуле', 'Yes, it crosses at zero'),
      },
      {
        id: 'no',
        show: L("Yo'q, hech qachon tegmaydi", 'Нет, никогда не коснётся', 'No, it never touches'),
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
// EKRAN 2. TAYANCH. Uchta hisob: qiymat, yana bir qiymat va KO'PAYTMA.
// Uchinchisi darsning kaliti: ko'paytma o'zgarmaydi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Qiymatlar va ko'paytma",
    'Значения и произведение',
    'Values and the product',
  ),
  audio: [
    A('mount',
      "Formula berilgan. Uch marta hisoblaymiz va bir narsani sezamiz.",
      'Формула дана. Посчитаем три раза и кое-что заметим.',
      'The formula is given. We compute three times and notice something.'),
    W('t1',
      "To'rtta bo'lsa uchta chiqadi.",
      'При четырёх выходит три.',
      'At four it gives three.'),
    W('t2',
      "Oltida ikki. x kattalashdi, y esa kichraydi.",
      'При шести два. Икс вырос, а игрек уменьшился.',
      'At six it gives two. x grew and y got smaller.'),
    W('t3',
      "Ko'paytma esa o'zgarmadi. Bu darsning kaliti.",
      'А произведение не изменилось. Это ключ урока.',
      'But the product did not change. That is the key to the lesson.'),
  ],
  props: {
    items: [
      {
        prompt: L(
          "x to'rtga teng. y qancha?",
          'Икс равен четырём. Чему равен y?',
          'x equals four. What is y?',
        ),
        show: (
          <Row size="row" align="center">
            {'y = '}
            {F('12', 'x')}
          </Row>
        ),
        kind: 'number',
        answer: '3',
        accepts: ['3'],
        hints: {
          '48': L(
            "Bu ko'paytirish bo'ldi. Formulada bo'lish turibdi.",
            'Это умножение. В формуле стоит деление.',
            'That is multiplication. The formula holds a division.',
          ),
          '8': L(
            "O'n ikkidan to'rtni ayirdingiz. Bo'lish kerak.",
            'Из двенадцати вычли четыре. Нужно деление.',
            'Four was subtracted from twelve. Division is needed.',
          ),
        },
        closed: L('x = 4, y = 3', 'x = 4, y = 3', 'x = 4, y = 3'),
      },
      {
        prompt: L(
          'x oltiga teng. y qancha?',
          'Икс равен шести. Чему равен y?',
          'x equals six. What is y?',
        ),
        show: (
          <Row size="row" align="center">
            {'y = '}
            {F('12', 'x')}
          </Row>
        ),
        kind: 'number',
        answer: '2',
        accepts: ['2'],
        hints: {
          '6': L(
            "Oltiga bo'lish kerak, oltini yozish emas.",
            'Надо разделить на шесть, а не записать шесть.',
            'Divide by six rather than writing six.',
          ),
          '72': L(
            "Bu ko'paytma. Formulada bo'lish bor.",
            'Это произведение. В формуле деление.',
            'That is the product. The formula has a division.',
          ),
        },
        closed: L('x = 6, y = 2', 'x = 6, y = 2', 'x = 6, y = 2'),
      },
      {
        prompt: L(
          "x uchga teng bo'lsa, x va y ning ko'paytmasi qancha?",
          'Если x равен трём, чему равно произведение x на y?',
          'If x equals three, what is the product of x and y?',
        ),
        show: (
          <Row size="row" align="center">
            {'y = '}
            {F('12', 'x')}
          </Row>
        ),
        kind: 'number',
        answer: '12',
        accepts: ['12'],
        hints: {
          '4': L(
            "To'rt bu y. Savol ko'paytma haqida.",
            'Четыре это y. Спрашивают произведение.',
            'Four is y. The product is asked.',
          ),
          '7': L(
            "Bu yig'indi bo'ldi. Ko'paytirish kerak.",
            'Это сумма. Нужно умножение.',
            'That is the sum. Multiplication is needed.',
          ),
        },
        closed: L('xy = 12', 'xy = 12', 'xy = 12'),
      },
    ],
  },
}

// ============================================================
// EKRAN 3. YADRO. LENTA: giperbola KO'Z OLDIDA yig'iladi — nuqtalar o'tiradi,
// tarmoqlar chiziladi, y o'qi taqiq chizig'i bo'ladi (figura `hyper`).
// ============================================================
const S3 = {
  eyebrow: L('GRAFIK', 'ГРАФИК', 'THE GRAPH'),
  title: L(
    'Giperbola qanday yig\'iladi',
    'Как собирается гипербола',
    'How a hyperbola comes together',
  ),
  audio: [
    A('mount',
      "Jadvalning nuqtalari tekislikka o'tiradi. Ular ikki guruhga bo'linadi.",
      'Точки таблицы садятся на плоскость. Они делятся на две группы.',
      'The points of the table sit on the plane. They fall into two groups.'),
    W('k2',
      "Nuqtalar orqali ikki tarmoq o'tadi. Bu grafik giperbola deb ataladi.",
      'Через точки проходят две ветви. Такой график называется гиперболой.',
      'Two branches pass through the points. Such a graph is called a hyperbola.'),
    W('k3',
      "Nolda esa nuqta yo'q. Shuning uchun y o'qi taqiq chizig'i bo'lib turadi.",
      'А в нуле точки нет. Поэтому ось y стоит как линия запрета.',
      'And at zero there is no point. That is why the y axis stands as a line of restriction.'),
  ],
  props: {
    film: {
      fig: 'hyper',
      data: { k: 6, xs: [1, 2, 3, 6], h: 150 },
      frames: [
        {
          id: 'k1',
          phase: 1,
          label: L('Nuqtalar', 'Точки', 'Points'),
          text: L(
            "Jadvalning nuqtalari o'tirdi, ular ikki guruhda",
            'Точки таблицы сели, они в двух группах',
            'The points of the table are seated, in two groups',
          ),
          ask: {
            question: L(
              "Bu nuqtalarda nima o'zgarmaydi?",
              'Что не меняется у этих точек?',
              'What stays the same at these points?',
            ),
            items: [
              {
                id: 'prod',
                right: true,
                label: L("x va y ning ko'paytmasi", 'Произведение x на y', 'The product of x and y'),
              },
              {
                id: 'sum',
                label: L("x va y ning yig'indisi", 'Сумма x и y', 'The sum of x and y'),
                hint: L(
                  "Bir va olti yettini beradi, ikki va uch esa beshni. Yig'indi boshqa.",
                  'Один и шесть дают семь, два и три дают пять. Сумма другая.',
                  'One and six give seven, two and three give five. The sum differs.',
                ),
              },
              {
                id: 'diff',
                label: L('Ularning ayirmasi', 'Их разность', 'Their difference'),
                hint: L(
                  "Bir va oltining ayirmasi besh, ikki va uchning ayirmasi bir.",
                  'Разность одного и шести это пять, а двух и трёх это один.',
                  'The difference of one and six is five, of two and three is one.',
                ),
              },
              {
                id: 'y',
                label: L("y ning o'zi", 'Само y', 'The y itself'),
                hint: L(
                  "y har nuqtada boshqa, jadvalga qarang.",
                  'Игрек в каждой точке разный, посмотри таблицу.',
                  'The y differs at every point, look at the table.',
                ),
              },
            ],
          },
        },
        {
          id: 'k2',
          phase: 2,
          label: L('Tarmoqlar', 'Ветви', 'Branches'),
          text: L(
            "Ikki tarmoq chizildi, ular birlashmaydi",
            'Прорисовались две ветви, они не соединяются',
            'Two branches are drawn and they do not join',
          ),
        },
        {
          id: 'k3',
          phase: 3,
          label: L("Nol", 'Нуль', 'Zero'),
          text: L(
            "Nolda funksiyaning qiymati yo'q",
            'В нуле у функции значения нет',
            'At zero the function has no value',
          ),
          ask: {
            question: L(
              'Nega tarmoqlar birlashmaydi?',
              'Почему ветви не соединяются?',
              'Why do the branches not join?',
            ),
            items: [
              {
                id: 'zero',
                right: true,
                label: L("Nolda qiymat yo'q", 'В нуле нет значения', 'At zero there is no value'),
              },
              {
                id: 'far',
                label: L('Ular juda uzoq', 'Они слишком далеко', 'They are too far apart'),
                hint: L(
                  "Masofa ahamiyatsiz. Maxrajga qarang, u nolga aylanadi.",
                  'Расстояние ни при чём. Посмотри на знаменатель, он обращается в нуль.',
                  'Distance is irrelevant. Look at the denominator, it becomes zero.',
                ),
              },
              {
                id: 'draw',
                label: L('Chizishga joy yetmadi', 'Не хватило места на чертеже', 'The drawing ran out of room'),
                hint: L(
                  "Kadrni kattalashtirsak ham birlashmaydi. Sabab nolda.",
                  'Даже если увеличить кадр, они не соединятся. Причина в нуле.',
                  'Even a bigger frame would not join them. The reason is at zero.',
                ),
              },
              {
                id: 'two',
                label: L('Funksiya ikkita', 'Функций две', 'There are two functions'),
                hint: L(
                  "Funksiya bitta, formulasi bitta. Tarmoq esa ikkita.",
                  'Функция одна, и формула одна. А ветвей две.',
                  'There is one function with one formula. But two branches.',
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
// EKRAN 4. 1-USUL: TO'RT OYNA. Jadval berilgan, o'quvchi k ni topadi va
// shu zahoti formula, grafik va shart to'ladi.
// ============================================================
const S4 = {
  eyebrow: L('1-USUL', 'СПОСОБ 1', 'METHOD 1'),
  title: L(
    "Jadvaldan formulaga",
    'От таблицы к формуле',
    'From the table to the formula',
  ),
  audio: [
    A('mount',
      "To'rt oyna bitta bog'liqlik haqida. Jadval berilgan, qolganlari kutmoqda.",
      'Четыре окна об одной зависимости. Таблица дана, остальные ждут.',
      'Four windows about one dependency. The table is given, the rest are waiting.'),
    A('why',
      "Bir juftlikni oling va ularni ko'paytiring. Shu son k bo'ladi.",
      'Возьми одну пару и умножь. Это число и есть k.',
      'Take one pair and multiply. That number is k.'),
  ],
  props: {
    k: 12,
    given: 'table',
    answer: 'k',
    xs: [1, 2, 3, 4, 6],
    titles: {
      text: L('SHART', 'УСЛОВИЕ', 'THE SITUATION'),
      formula: L('FORMULA', 'ФОРМУЛА', 'FORMULA'),
      table: L('JADVAL', 'ТАБЛИЦА', 'TABLE'),
      plot: L('GRAFIK', 'ГРАФИК', 'GRAPH'),
    },
    text: L(
      "To'rtburchakning yuzi {k}. Bir tomoni x, ikkinchisi y.",
      'Площадь прямоугольника {k}. Одна сторона x, другая y.',
      'The area of a rectangle is {k}. One side is x, the other is y.',
    ),
    ask: L(
      'Koeffitsiyent k ni yozing',
      'Запиши коэффициент k',
      'Write the coefficient k',
    ),
    hints: {
      '6': L(
        "Olti bu bitta y. k esa x va y ning ko'paytmasi.",
        'Шесть это одно значение y. А k это произведение x на y.',
        'Six is one value of y. But k is the product of x and y.',
      ),
      '2': L(
        "Ikki ham jadvaldan olingan y. Ko'paytmani hisoblang.",
        'Два это тоже y из таблицы. Посчитай произведение.',
        'Two is a y from the table as well. Compute the product.',
      ),
      '13': L(
        "Bu yig'indi. Teskari proporsionallikda ko'paytma o'zgarmaydi.",
        'Это сумма. При обратной пропорциональности постоянно произведение.',
        'That is the sum. In inverse proportionality the product is constant.',
      ),
      '*': L(
        "Bitta juftlikni oling va ularni ko'paytiring.",
        'Возьми одну пару и перемножь.',
        'Take one pair and multiply them.',
      ),
    },
    after: L(
      "Har juftlikda ko'paytma bir xil, va u k ga teng.",
      'В каждой паре произведение одно и то же, и оно равно k.',
      'In every pair the product is the same and it equals k.',
    ),
  },
}

// ============================================================
// EKRAN 5. 2-USUL: SURGICH k bo'yicha. Savol SURGICHDAN OLDIN beriladi
// (§7.2): avval taxmin, keyin tekshirish. Aks holda surgich o'yinchoq.
// ============================================================
const S5 = {
  eyebrow: L('2-USUL', 'СПОСОБ 2', 'METHOD 2'),
  title: L(
    'k ning ishorasi va choraklar',
    'Знак k и четверти',
    'The sign of k and the quadrants',
  ),
  audio: [
    A('mount',
      "Endi k ni o'zgartiramiz. Lekin avval taxmin qiling.",
      'Теперь будем менять k. Но сначала предположи.',
      'Now we will change k. But make a prediction first.'),
    A('why',
      "Taxmin qayd etilgandan keyin surgich ochiladi va siz tekshirasiz.",
      'После того как прогноз записан, ползунок откроется и ты проверишь.',
      'Once the prediction is recorded the slider opens and you check it.'),
  ],
  props: {
    build: (k) => (x) => (x === 0 ? null : k / x),
    param: { name: 'k', from: -6, to: 6, step: 3, start: 3 },
    formula: (k) => [
      { t: 'y = ' },
      { t: String(k), accent: true },
      { t: ' / x' },
    ],
    from: -7, to: 7, yFrom: -7, yTo: 7, h: 150,
    ghost: true,
    ask: L(
      "k manfiy bo'lsa, tarmoqlar qaysi choraklarga o'tadi?",
      'Если k станет отрицательным, в какие четверти уйдут ветви?',
      'If k becomes negative, which quadrants do the branches move to?',
    ),
    predict: {
      items: [
        {
          id: 'two4',
          right: true,
          label: L('Ikkinchi va to\'rtinchi', 'Во 2 и 4 четверть', 'Quadrants 2 and 4'),
        },
        {
          id: 'same',
          label: L("O'sha joyda qoladi", 'На месте', 'They stay'),
          hint: L(
            "Ishora qiymatlarni manfiy qiladi, ya'ni nuqtalar chiziqning boshqa tomoniga o'tadi.",
            'Знак делает значения отрицательными, то есть точки уходят на другую сторону.',
            'The sign makes the values negative, so the points move to the other side.',
          ),
        },
        {
          id: 'one3',
          label: L('Birinchi va uchinchi', 'В 1 и 3 четверть', 'Quadrants 1 and 3'),
          hint: L(
            "Birinchi va uchinchi chorak musbat k ning joyi.",
            'Первая и третья четверть это место положительного k.',
            'The first and third quadrants belong to a positive k.',
          ),
        },
      ],
    },
    checkAt: (v) => v < 0,
    after: L(
      "Ko'rdingiz. Manfiy k da tarmoqlar ikkinchi va to'rtinchi chorakda.",
      'Видно: при отрицательном k ветви во второй и четвёртой четверти.',
      'You can see it: with a negative k the branches sit in the second and fourth quadrants.',
    ),
  },
}

// ============================================================
// EKRAN 6. BIRGA YECHAMIZ. Xukning savoli shu yerda javob oladi.
// MUVAFFAQIYATSIZ QADAM: «nolda y ham nol bo'ladi» — va u SON bilan rad
// etiladi (nolga bo'lish).
// ============================================================
const S6 = {
  eyebrow: L('BIRGA YECHAMIZ', 'РЕШАЕМ ВМЕСТЕ', 'SOLVING TOGETHER'),
  title: L(
    "Nolda nima bo'ladi",
    'Что происходит в нуле',
    'What happens at zero',
  ),
  audio: [
    A('mount',
      "Birinchi ekrandagi savolga qaytamiz.",
      'Возвращаемся к вопросу с первого экрана.',
      'We return to the question from the first screen.'),
    W('s3',
      "Nolni qo'yish uchun nolga bo'lish kerak bo'ladi, bu esa mumkin emas.",
      'Чтобы подставить нуль, придётся делить на нуль, а это невозможно.',
      'Substituting zero would mean dividing by zero, and that is impossible.'),
    W('s5',
      "Nolga yaqinlashsak, qiymat o'sib ketadi, lekin nolning o'zida to'xtaydi.",
      'Чем ближе к нулю, тем больше значение, но в самом нуле его нет.',
      'The closer to zero, the bigger the value, but at zero itself there is none.'),
    W('s6',
      "Demak grafik y o'qini kesib o'tmaydi.",
      'Значит график не пересекает ось y.',
      'So the graph does not cross the y axis.'),
  ],
  props: {
    task: L(
      "Grafik y o'qini kesib o'tadimi?",
      'Пересекает ли график ось y?',
      'Does the graph cross the y axis?',
    ),
    lines: [
      {
        text: 'y = 6/x',
        note: L('berilgan', 'дано', 'given'),
      },
      {
        text: L(
          "y o'qida x nolga teng",
          'На оси y значение x равно нулю',
          'On the y axis the value of x is zero',
        ),
      },
      {
        text: 'x = 0:   y = 6/0',
        tone: 'no',
        ask: {
          question: L(
            "Nolda y qanday chiqadi?",
            'Каким выйдет y в нуле?',
            'What does y come out as at zero?',
          ),
          items: [
            { id: 'none', right: true, label: L("Qiymat yo'q", 'Значения нет', 'There is no value') },
            {
              id: 'zero',
              label: L('Nol', 'Нуль', 'Zero'),
              hint: L(
                "Nol suratda bo'lsa qiymat nol bo'lardi. Bu yerda nol maxrajda.",
                'Нуль в числителе дал бы нулевое значение. Здесь нуль в знаменателе.',
                'A zero in the numerator would give a zero value. Here the zero is in the denominator.',
              ),
            },
            {
              id: 'six',
              label: L('Olti', 'Шесть', 'Six'),
              hint: L(
                "Olti bo'linmadi. Nolga bo'lish esa bajarilmaydi.",
                'Шесть не разделили. А деление на нуль не выполняется.',
                'The six was not divided. And division by zero cannot be done.',
              ),
            },
          ],
          after: L(
            "Nolga bo'lish mumkin emas",
            'На нуль делить нельзя',
            'Division by zero is impossible',
          ),
        },
      },
      {
        text: 'x = 0,1:  y = 60      x = 0,01:  y = 600',
        note: L("qiymat o'sib ketadi", 'значение растёт', 'the value keeps growing'),
      },
      {
        text: L(
          "Nolga qancha yaqin bo'lsak, qiymat shuncha katta",
          'Чем ближе к нулю, тем больше значение',
          'The closer to zero, the bigger the value',
        ),
        ask: {
          question: L(
            "Nolning o'zida nima turadi?",
            'А в самом нуле что стоит?',
            'And what stands at zero itself?',
          ),
          items: [
            { id: 'nothing', right: true, label: L('Hech narsa', 'Ничего', 'Nothing') },
            {
              id: 'big',
              label: L('Juda katta son', 'Очень большое число', 'A very big number'),
              hint: L(
                "Har qanday katta sondan kattasi bor. Nolda esa bo'lish umuman bajarilmaydi.",
                'У любого большого числа есть большее. А в нуле деление вообще не выполняется.',
                'Every big number has a bigger one. And at zero the division simply cannot be done.',
              ),
            },
            {
              id: 'point',
              label: L("O'qdagi nuqta", 'Точка на оси', 'A point on the axis'),
              hint: L(
                "Nuqta bo'lishi uchun qiymat kerak, qiymat esa yo'q.",
                'Чтобы была точка, нужно значение, а его нет.',
                'A point needs a value, and there is none.',
              ),
            },
          ],
          after: L(
            "Shuning uchun tarmoq o'qqa tegmaydi",
            'Поэтому ветвь не касается оси',
            'That is why the branch never touches the axis',
          ),
        },
      },
      {
        text: L(
          "Grafik y o'qini kesib o'tmaydi, x nol bo'lmaydi",
          'График не пересекает ось y: x не бывает нулём',
          'The graph does not cross the y axis: x is never zero',
        ),
        tone: 'ok',
      },
    ],
  },
}

// ============================================================
// EKRAN 7. CHEGARA. Teskari va TO'G'RI proporsionallik yonma yon: bittasi
// nolda hisoblanmaydi, ikkinchisi hisoblanadi (З27).
// ============================================================
const S7 = {
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L(
    'Teskari va to\'g\'ri yonma yon',
    'Обратная и прямая рядом',
    'Inverse and direct side by side',
  ),
  audio: [
    A('mount',
      "Ikki yozuv. Bittasida x maxrajda, ikkinchisida suratda.",
      'Две записи. В одной икс в знаменателе, в другой в числителе.',
      'Two records. In one x is in the denominator, in the other in the numerator.'),
    A('why',
      "Qaysi biri nolda hisoblanmaydi, shuni toping.",
      'Найди, какая из них не считается в нуле.',
      'Find which of them fails at zero.'),
  ],
  props: {
    left: (
      <Row size="row" align="center">
        {'y = '}
        {F('6', 'x')}
      </Row>
    ),
    right: (
      <Row size="row" align="center">
        {'y = 6x'}
      </Row>
    ),
    odzLeft: L('?', '?', '?'),
    odzRight: L('har qanday x', 'любое x', 'any x'),
    question: L(
      "Qaysi qiymatda chap yozuv hisoblanmaydi?",
      'При каком значении не считается левая запись?',
      'At which value does the left record fail?',
    ),
    answer: [0],
    hints: {
      '6': L(
        "Oltida chap yozuv birga teng, hammasi hisoblanadi.",
        'При шести левая запись равна единице, всё считается.',
        'At six the left record equals one, everything computes.',
      ),
      '-6': L(
        "Minus oltida ham hisoblanadi, javob minus bir.",
        'При минус шести тоже считается, выходит минус один.',
        'At minus six it computes too, giving minus one.',
      ),
      '1': L(
        "Bittada ikkala yozuv ham hisoblanadi.",
        'При единице считаются обе записи.',
        'At one both records compute.',
      ),
      '*': L(
        "Maxrajga qarang. U qaysi sonda nolga aylanadi?",
        'Посмотри на знаменатель. При каком числе он обращается в нуль?',
        'Look at the denominator. At which number does it become zero?',
      ),
    },
    note: L(
      "O'ng yozuv to'g'ri proporsionallik, unda taqiq yo'q",
      'Правая запись это прямая пропорциональность, в ней запрета нет',
      'The right record is direct proportionality and it has no restriction',
    ),
  },
}

// ============================================================
// EKRAN 8. QOIDA. Darslik 7-§, 34-35-bet. Xukka QAYTISH.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    'Giperbola qoidasi',
    'Правило гиперболы',
    'The rule of the hyperbola',
  ),
  audio: [
    A('mount',
      "Qoidani o'zingiz yig'asiz, keyin darslik matni ochiladi.",
      'Правило соберёшь сам, потом откроется текст учебника.',
      'You will assemble the rule yourself, then the textbook text opens.'),
    W('card',
      "Birinchi ekrandagi savol javobini oldi. Grafik o'qqa tegmaydi.",
      'Вопрос с первого экрана получил ответ. График не касается оси.',
      'The question from the first screen got its answer. The graph does not touch the axis.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("y = k/x ning grafigi", 'График y = k/x', 'The graph of y = k/x') },
      { id: 'f2', label: L('giperbola deyiladi', 'называется гиперболой', 'is called a hyperbola') },
      { id: 'f3', label: L('u ikki tarmoqdan tuzilgan', 'она состоит из двух ветвей', 'it consists of two branches') },
      { id: 'f4', label: L("nolda qiymat yo'q", 'в нуле значения нет', 'at zero there is no value') },
      { id: 'w1', label: L("nolda o'qni kesadi", 'в нуле пересекает ось', 'at zero it crosses the axis') },
      { id: 'w2', label: L("to'g'ri chiziq", 'это прямая линия', 'it is a straight line') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilganda qoida buziladi. Nolda nima borligini tekshiring.",
      'В такой сборке правило ломается. Проверь, что стоит в нуле.',
      'Assembled this way the rule breaks. Check what stands at zero.',
    ),
    card: {
      title: L('GIPERBOLA', 'ГИПЕРБОЛА', 'THE HYPERBOLA'),
      lines: [
        L(
          "Aniqlanish sohasi — noldan boshqa barcha sonlar",
          'Область определения — все числа, кроме нуля',
          'The domain is every number except zero',
        ),
        L(
          "Grafik giperbola, u ikki tarmoqdan tuzilgan",
          'График это гипербола, она состоит из двух ветвей',
          'The graph is a hyperbola made of two branches',
        ),
        L(
          "k musbat bo'lsa, tarmoqlar birinchi va uchinchi chorakda",
          'При положительном k ветви в первой и третьей четверти',
          'With a positive k the branches lie in the first and third quadrants',
        ),
      ],
      source: L('Darslik, 7-§, 34-35-bet', 'Учебник, § 7, стр. 34-35', 'Textbook, section 7, pages 34-35'),
      locked: L("Qoida yig'ilgandan keyin ochiladi", 'Откроется после сборки правила', 'Opens once the rule is assembled'),
    },
    recall: {
      left: L("y o'qi", 'ось y', 'the y axis'),
      right: L('x ≠ 0', 'x ≠ 0', 'x ≠ 0'),
      winner: 'right',
      note: L(
        "Grafik o'qqa tegmaydi, chunki nolda qiymat yo'q",
        'График не касается оси, потому что в нуле нет значения',
        'The graph does not touch the axis because there is no value at zero',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ: TO'RT OYNA, endi GRAFIK berilgan. Teskari yo'nalish —
// chizmadan formulaga.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    'Grafikdan formulaga',
    'От графика к формуле',
    'From the graph to the formula',
  ),
  audio: [
    A('mount',
      "Endi grafik berilgan, jadval bo'sh. Bitta nuqtani o'qib oling.",
      'Теперь дан график, а таблица пуста. Прочитай одну точку.',
      'Now the graph is given and the table is empty. Read one point.'),
    A('why',
      "Bitta nuqtaning koordinatalarini ko'paytirsangiz, k chiqadi.",
      'Если умножить координаты одной точки, получится k.',
      'Multiplying the coordinates of one point gives k.'),
  ],
  props: {
    k: 8,
    given: 'plot',
    answer: 'k',
    xs: [1, 2, 4, 8],
    titles: {
      text: L('SHART', 'УСЛОВИЕ', 'THE SITUATION'),
      formula: L('FORMULA', 'ФОРМУЛА', 'FORMULA'),
      table: L('JADVAL', 'ТАБЛИЦА', 'TABLE'),
      plot: L('GRAFIK', 'ГРАФИК', 'GRAPH'),
    },
    text: L(
      "To'rtburchakning yuzi {k}. Bir tomoni x, ikkinchisi y.",
      'Площадь прямоугольника {k}. Одна сторона x, другая y.',
      'The area of a rectangle is {k}. One side is x, the other is y.',
    ),
    ask: L('Grafikdan k ni toping', 'Найди k по графику', 'Find k from the graph'),
    hints: {
      '2': L(
        "Ikki bu bitta koordinata. k esa ikkalasining ko'paytmasi.",
        'Два это одна координата. А k это произведение обеих.',
        'Two is one coordinate. But k is the product of both.',
      ),
      '4': L(
        "To'rt ham bitta koordinata. Nuqtani to'liq o'qing.",
        'Четыре это тоже одна координата. Прочитай точку целиком.',
        'Four is one coordinate too. Read the whole point.',
      ),
      '6': L(
        "Bu yig'indi bo'ldi, ikki plyus to'rt. Ko'paytirish kerak.",
        'Это сумма, два плюс четыре. Нужно умножение.',
        'That is the sum, two plus four. Multiplication is needed.',
      ),
      '*': L(
        "Grafikdan butun koordinatali nuqtani toping va ularni ko'paytiring.",
        'Найди на графике точку с целыми координатами и перемножь их.',
        'Find a point with whole coordinates and multiply them.',
      ),
    },
    after: L(
      "Har nuqtada ko'paytma bir xil, va u k ga teng.",
      'В каждой точке произведение одно и то же, и оно равно k.',
      'At every point the product is the same and it equals k.',
    ),
  },
}

// ============================================================
// EKRAN 10. MASHQ, QADAMLAR NOMLANGAN: nuqtadan formulaga va shartga.
// ============================================================
const S10 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    'Nuqtadan formulaga',
    'От точки к формуле',
    'From a point to the formula',
  ),
  audio: [
    A('mount',
      "Bitta nuqta berilgan. Uch qadamda formulaga yetamiz.",
      'Дана одна точка. За три шага доберёмся до формулы.',
      'One point is given. In three steps we reach the formula.'),
    W('f1',
      "Koordinatalarni ko'paytirdik, k topildi.",
      'Умножили координаты, k найден.',
      'The coordinates were multiplied and k is found.'),
    W('f2',
      "Formulada k maxraj ustida turadi.",
      'В формуле k стоит над знаменателем.',
      'In the formula k stands above the denominator.'),
    W('f3',
      "Shart o'sha, nol chiqib ketadi.",
      'Условие то же, нуль выпадает.',
      'The condition is the same, zero drops out.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {'x = 3,   y = 8'}
      </Row>
    ),
    fields: [
      {
        ask: L(
          'k ni yozing',
          'Запиши k',
          'Write k',
        ),
        kind: 'number',
        answer: '24',
        accepts: ['24'],
        hints: {
          '11': L(
            "Bu yig'indi. Teskari proporsionallikda ko'paytma kerak.",
            'Это сумма. При обратной пропорциональности нужно произведение.',
            'That is the sum. Inverse proportionality needs the product.',
          ),
          '5': L(
            "Bu ayirma. Ko'paytirish kerak.",
            'Это разность. Нужно умножение.',
            'That is the difference. Multiplication is needed.',
          ),
        },
      },
      {
        ask: L(
          'Funksiyani yozing',
          'Запиши функцию',
          'Write the function',
        ),
        kind: 'expr',
        answer: '24/x',
        accepts: ['48/(2x)'],
        hints: {
          'x/24': L(
            "k maxrajda emas, surat ustida turadi.",
            'k стоит не в знаменателе, а над чертой.',
            'k stands above the bar, not in the denominator.',
          ),
          '24x': L(
            "Bu to'g'ri proporsionallik. Bizda esa bo'lish.",
            'Это прямая пропорциональность. А у нас деление.',
            'That is direct proportionality. Here we have division.',
          ),
          '8/x': L(
            "Sakkiz bu y, k emas.",
            'Восемь это y, а не k.',
            'Eight is y, not k.',
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
        excluded: [0],
        accepts: ['x != 0', '0 != x'],
        hints: {
          'x != 3': L(
            "Uchda maxraj uchga teng, hammasi hisoblanadi.",
            'При трёх знаменатель равен трём, всё считается.',
            'At three the denominator equals three and everything computes.',
          ),
          'x != 24': L(
            "Yigirma to'rt suratda, u taqiq bermaydi.",
            'Двадцать четыре в числителе, он запрета не даёт.',
            'Twenty four is in the numerator and gives no restriction.',
          ),
        },
      },
    ],
  },
}

// ============================================================
// EKRAN 11. ASBOBSIZ. Kasrlar bo'limi shu yerda qaytadi: ifodani
// soddalashtirgandan keyin giperbola chiqadi, lekin taqiq IKKITA (З2).
// ============================================================
const S11 = {
  eyebrow: L('MUSTAQIL', 'САМ', 'ON YOUR OWN'),
  title: L(
    'Giperbola ikki taqiq bilan',
    'Гипербола с двумя запретами',
    'A hyperbola with two restrictions',
  ),
  audio: [
    A('mount',
      "Bu ekranda asbob yo'q. Ifodani soddalashtiring va shartlarni yozing.",
      'На этом экране прибора нет. Упрости выражение и запиши условия.',
      'There is no instrument here. Simplify the expression and write the conditions.'),
    A('why',
      "Soddalashtirgandan keyin giperbola chiqadi, lekin taqiq ikkita.",
      'После упрощения выйдет гипербола, но запретов два.',
      'After simplifying you get a hyperbola, but there are two restrictions.'),
  ],
  props: {
    show: (
      <Row size="row" align="center">
        {'y = '}
        {F('4x + 8', 'x · x + 2x')}
      </Row>
    ),
    result: {
      ask: L(
        'Soddalashtirilgan yozuvni yozing',
        'Запиши упрощённую запись',
        'Write the simplified record',
      ),
      kind: 'expr',
      answer: '4/x',
      accepts: ['8/(2x)'],
      hints: {
        '4/(x+2)': L(
          "Umumiy ko'paytuvchi x plyus ikki, u qisqaradi. Nima qoladi?",
          'Общий множитель это x плюс два, он сокращается. Что остаётся?',
          'The common factor is x plus two and it reduces. What is left?',
        ),
        '(4x+8)/(x*x+2x)': L(
          "Qisqartirish bajarilmagan. Ikkala qismni ko'paytuvchilarga ajratib ko'ring.",
          'Сокращение не выполнено. Разложи обе части на множители.',
          'The reducing is not done. Factor both parts.',
        ),
        'x/4': L(
          "Teskari qilib qo'ydingiz. Surat to'rt, maxraj iks.",
          'Перевёрнуто. В числителе четыре, в знаменателе икс.',
          'It is upside down. Four is above and x is below.',
        ),
      },
    },
    odz: {
      ask: L(
        'Ikki shartni yozing',
        'Запиши два условия',
        'Write the two conditions',
      ),
      varName: 'x',
      excluded: [-2, 0],
      accepts: ['x != 0, x != -2', 'x(x+2) != 0'],
      hints: {
        'x != 0': L(
          "Boshlang'ich maxrajda x plyus ikki ham bor edi.",
          'В исходном знаменателе был ещё и x плюс два.',
          'The original denominator also held x plus two.',
        ),
        'x != -2': L(
          "Boshlang'ich maxrajda iks ham bor edi, u nolda nolga aylanadi.",
          'В исходном знаменателе был и икс, он обращается в нуль при нуле.',
          'The original denominator also held x, which becomes zero at zero.',
        ),
      },
    },
    proof: {
      varName: 'x',
      from: '(4x+8)/(x*x+2x)',
      to: '4/x',
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
      "Grafik giperbola, lekin unda ikki nuqta yo'q",
      'График это гипербола, но двух точек в нём нет',
      'The graph is a hyperbola, but two points are missing from it',
    ),
  },
}

// ============================================================
// EKRAN 12. TUZOQ (З28). Ishora hisobga olinmagan: k manfiy, tarmoqlar esa
// birinchi va uchinchi chorakka qo'yilgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    'Choraklar haqidagi satr',
    'Строка про четверти',
    'The line about the quadrants',
  ),
  audio: [
    A('mount',
      "Boshqa odamning yechimi. Birinchi noto'g'ri satrni toping.",
      'Чужое решение. Найди первую неверную строку.',
      "Someone else's solution. Find the first incorrect line."),
    W('proof',
      "Endi son bilan ko'rsating. Qaysi qiymatda funksiyaning qiymati yo'q?",
      'Теперь покажи числом. При каком значении у функции нет значения?',
      'Now show it with a number. At which value does the function have no value?'),
  ],
  props: {
    rows: [
      {
        id: 'r1',
        show: L(
          'k = −6, ya\'ni manfiy',
          'k = −6, то есть отрицательный',
          'k = −6, that is negative',
        ),
      },
      {
        id: 'r2',
        show: L(
          'Tarmoqlar birinchi va uchinchi chorakda',
          'Ветви в первой и третьей четверти',
          'The branches lie in the first and third quadrants',
        ),
      },
      {
        id: 'r3',
        show: L(
          "x = 2 bo'lganda y = −3",
          'При x = 2 выходит y = −3',
          'At x = 2 it gives y = −3',
        ),
      },
      {
        id: 'r4',
        show: L(
          "Aniqlanish sohasi: noldan boshqa barcha sonlar",
          'Область определения: все числа, кроме нуля',
          'The domain: every number except zero',
        ),
      },
    ],
    answerId: 'r2',
    hints: {
      'r1': L(
        "Bu satr to'g'ri, minus olti manfiy son.",
        'Эта строка верна: минус шесть отрицательное число.',
        'This line is correct: minus six is a negative number.',
      ),
      'r3': L(
        "Bu ham to'g'ri, minus oltini ikkiga bo'lsak minus uch chiqadi. Xato balandroqda.",
        'И это верно: минус шесть разделить на два это минус три. Ошибка выше.',
        'This is correct too: minus six over two is minus three. The error is higher.',
      ),
      'r4': L(
        "Soha to'g'ri yozilgan. Xato choraklar haqidagi satrda.",
        'Область определения записана верно. Ошибка в строке про четверти.',
        'The domain is written correctly. The error is in the line about the quadrants.',
      ),
    },
    ask: {
      label: L("Son qo'ying", 'Поставь число', 'Put in a number'),
      of: '-6/x',
      varName: 'x',
      wrong: L(
        "Bu qiymatda funksiya hisoblanadi. Maxraj qaysi sonda nolga aylanadi?",
        'При этом значении функция считается. При каком числе знаменатель обращается в нуль?',
        'At this value the function computes. At which number does the denominator become zero?',
      ),
      note: L(
        "Manfiy k da qiymatlar musbat x uchun manfiy chiqadi, ya'ni tarmoq to'rtinchi chorakda.",
        'При отрицательном k значения при положительном x выходят отрицательными, то есть ветвь в четвёртой четверти.',
        'With a negative k the values at positive x come out negative, so the branch is in the fourth quadrant.',
      ),
    },
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH: shart bo'yicha funksiya. Kasrlar bo'limining
// mahoratini grafikka ulaydi.
// ============================================================
const S13 = {
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    'Ikkinchi taqiqni qo\'shish',
    'Добавить второй запрет',
    'Adding a second restriction',
  ),
  audio: [
    A('mount',
      "Endi teskarisi. Grafik o'sha giperbola bo'lsin, lekin unda yana bir nuqta yo'qolsin.",
      'Теперь наоборот. График та же гипербола, но в нём должна пропасть ещё одна точка.',
      'Now the other way round. The graph is the same hyperbola, but one more point must disappear.'),
    A('why',
      "Buning uchun surat va maxrajga bir xil ko'paytuvchi qo'yiladi. Bu 2-darsning ishi.",
      'Для этого в числитель и знаменатель ставят одинаковый множитель. Это работа второго урока.',
      'For that you put the same factor into the numerator and the denominator. That is the work of lesson two.'),
  ],
  props: {
    prompt: L(
      "12/x ga teng yozuv toping, lekin uning qiymati x = 3 da ham bo'lmasin",
      'Запиши выражение, равное 12/x, но чтобы значения не было ещё и при x = 3',
      'Write an expression equal to 12/x that also has no value at x = 3',
    ),
    reduceTo: '12/x',
    excluded: [0, 3],
    varName: 'x',
    hints: {
      '12/x': L(
        "Bu boshlang'ich yozuv, unda faqat bitta taqiq.",
        'Это исходная запись, в ней только один запрет.',
        'That is the original record with only one restriction.',
      ),
      '12(x+3)/(x(x+3))': L(
        "x plyus uch minus uchda nolga aylanadi, bizga esa uchda kerak.",
        'x плюс три обращается в нуль при минус трёх, а нужно при трёх.',
        'x plus three becomes zero at minus three, but three is what is needed.',
      ),
      '12(x-3)/x': L(
        "Ko'paytuvchi faqat suratga qo'yilgan, yozuv boshqa funksiya bo'lib qoldi.",
        'Множитель поставлен только в числитель, и запись стала другой функцией.',
        'The factor went only into the numerator and the record became a different function.',
      ),
    },
    note: L(
      "Grafik o'sha, lekin uchda nuqta yo'q",
      'График тот же, но в трёх точки нет',
      'The graph is the same, but at three the point is missing',
    ),
  },
}

// ============================================================
// EKRAN 14. BLITS.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    'Giperbola belgilari',
    'Признаки гиперболы',
    'The marks of a hyperbola',
  ),
  audio: [
    A('mount',
      "To'rt savol. Ular chizma haqida emas, belgi haqida.",
      'Четыре вопроса. Они не про чертёж, а про признак.',
      'Four questions. They are not about a drawing but about the mark.'),
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
        tag: 'З27',
        ask: L(
          "Teskari proporsionallikda nima o'zgarmaydi?",
          'Что постоянно при обратной пропорциональности?',
          'What stays constant in inverse proportionality?',
        ),
        options: [
          { id: 'prod', right: true, label: L("Ko'paytma xy", 'Произведение xy', 'The product xy') },
          { id: 'sum', label: L("Yig'indi x + y", 'Сумма x + y', 'The sum x + y') },
          { id: 'ratio', label: L('Nisbat y/x', 'Отношение y/x', 'The ratio y/x') },
          { id: 'diff', label: L('Ayirma y − x', 'Разность y − x', 'The difference y − x') },
        ],
        hint: L(
          "Jadvalga qaytib qarang: bir va olti, ikki va uch.",
          'Посмотри снова таблицу: один и шесть, два и три.',
          'Look at the table again: one and six, two and three.',
        ),
        ok: L(
          "Nisbat to'g'ri proporsionallikda o'zgarmaydi, ko'paytma esa teskarisida.",
          'Отношение постоянно при прямой пропорциональности, а произведение при обратной.',
          'The ratio is constant in direct proportionality, the product in inverse.',
        ),
      },
      {
        id: 'q2',
        tag: 'З2',
        ask: L(
          "y = 5/x funksiyasining aniqlanish sohasi qanday?",
          'Какова область определения функции y = 5/x?',
          'What is the domain of the function y = 5/x?',
        ),
        options: [
          { id: 'nozero', right: true, label: L("Noldan boshqa barcha sonlar", 'Все числа, кроме нуля', 'Every number except zero') },
          { id: 'all', label: L('Barcha sonlar', 'Все числа', 'Every number') },
          { id: 'pos', label: L('Faqat musbat sonlar', 'Только положительные', 'Only positive numbers') },
          { id: 'five', label: L('Beshdan boshqa barcha sonlar', 'Все числа, кроме пяти', 'Every number except five') },
        ],
        hint: L(
          "Maxrajga qarang. Nolga bo'lish bajarilmaydi.",
          'Посмотри на знаменатель. Деление на нуль не выполняется.',
          'Look at the denominator. Division by zero cannot be done.',
        ),
        ok: L(
          "Faqat nol chiqib ketadi, qolgan hamma son yaraydi.",
          'Выпадает только нуль, все остальные числа годятся.',
          'Only zero drops out; every other number works.',
        ),
      },
      {
        id: 'q3',
        tag: 'З28',
        ask: L(
          "k manfiy bo'lsa, tarmoqlar qaysi choraklarda?",
          'Если k отрицательный, в каких четвертях ветви?',
          'If k is negative, in which quadrants are the branches?',
        ),
        options: [
          { id: 'two4', right: true, label: L('Ikkinchi va to\'rtinchi', 'Во второй и четвёртой', 'The second and fourth') },
          { id: 'one3', label: L('Birinchi va uchinchi', 'В первой и третьей', 'The first and third') },
          { id: 'all', label: L('Hamma chorakda', 'Во всех четвертях', 'In all quadrants') },
          { id: 'one', label: L('Faqat birinchida', 'Только в первой', 'Only in the first') },
        ],
        hint: L(
          "Musbat x oling va y ning ishorasini hisoblang.",
          'Возьми положительный x и посчитай знак y.',
          'Take a positive x and work out the sign of y.',
        ),
        ok: L(
          "Musbat x da y manfiy chiqadi, ya'ni nuqta to'rtinchi chorakda.",
          'При положительном x значение y отрицательное, то есть точка в четвёртой четверти.',
          'At a positive x the value of y is negative, so the point is in the fourth quadrant.',
        ),
      },
      {
        id: 'q4',
        tag: 'З16',
        ask: L(
          "Grafik o'qqa tegadimi?",
          'Касается ли график оси?',
          'Does the graph touch an axis?',
        ),
        options: [
          { id: 'never', right: true, label: L('Hech qachon tegmaydi', 'Никогда не касается', 'It never touches') },
          { id: 'zero', label: L('Nolda tegadi', 'Касается в нуле', 'It touches at zero') },
          { id: 'far', label: L('Uzoqda tegadi', 'Касается далеко', 'It touches far away') },
          { id: 'k', label: L('k ga bog\'liq', 'Зависит от k', 'It depends on k') },
        ],
        hint: L(
          "Tegish uchun qiymat nol bo'lishi kerak. k ni x ga bo'lib nol chiqadimi?",
          'Чтобы коснуться, значение должно быть нулём. Может ли k делить на x дать нуль?',
          'To touch, the value must be zero. Can k divided by x give zero?',
        ),
        ok: L(
          "Bo'linma nol bo'lmaydi, chunki k nol emas. Va nolda x ning o'zi taqiqlangan.",
          'Частное нулём не бывает, ведь k не нуль. А в нуле запрещён сам икс.',
          'The quotient is never zero because k is not zero. And at zero, x itself is forbidden.',
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
    'Giperbola va nol',
    'Гипербола и нуль',
    'The hyperbola and zero',
  ),
  audio: [
    A('s0',
      "Xukdagi savol javobini oldi. Grafik y o'qiga tegmaydi.",
      'Вопрос с хука получил ответ. График не касается оси y.',
      'The question from the hook has its answer. The graph does not touch the y axis.'),
    A('s1',
      "Uch usul qoldi. Ko'paytma o'zgarmaydi, ishora choraklarni belgilaydi, nol sohadan chiqadi.",
      'Остаются три способа. Произведение постоянно, знак задаёт четверти, нуль уходит из области.',
      'Three methods remain. The product is constant, the sign sets the quadrants, zero leaves the domain.'),
    A('s2',
      "Kasrlar bo'limi shu bilan yopildi. Keyingi darsda ildiz va daraja.",
      'Раздел дробей на этом закрыт. В следующем уроке корень и степень.',
      'The section on fractions closes here. The next lesson brings roots and powers.'),
  ],
  props: {
    predictedLabel: L('Taxmin', 'Прогноз', 'Prediction'),
    proved: L(
      "Tegmaydi, chunki nolda qiymat yo'q",
      'Не касается: в нуле нет значения',
      'It does not touch: there is no value at zero',
    ),
    canLabel: L('Endi nima qila olasiz', 'Что теперь умеешь', 'What you can do now'),
    can: [
      L(
        "Jadval yoki nuqtadan formulani yozish",
        'Записать формулу по таблице или точке',
        'Write the formula from a table or a point',
      ),
      L(
        "k ning ishorasi bo'yicha choraklarni aytish",
        'Назвать четверти по знаку k',
        'Name the quadrants from the sign of k',
      ),
      L(
        "Aniqlanish sohasini maxrajdan topish",
        'Найти область определения по знаменателю',
        'Find the domain from the denominator',
      ),
    ],
    proofNote: L(
      "Fakt. Bir xil yuzli to'rtburchaklar cheksiz ko'p, va ularning tomonlari aynan giperbolada yotadi. Shuning uchun bu chizma dizaynda ham uchraydi: bitta o'lcham kattalashsa, ikkinchisi shu qonun bilan kichrayadi.",
      'Факт. Прямоугольников одной площади бесконечно много, и их стороны лежат ровно на гиперболе. Поэтому этот чертёж встречается и в дизайне: растёт один размер, второй уменьшается по этому закону.',
      'A fact. There are infinitely many rectangles of the same area, and their sides lie exactly on a hyperbola. That is why this drawing shows up in design too: one dimension grows and the other shrinks by this law.',
    ),
    bridge: L(
      "Keyingi dars, ildiz va daraja, blokni yopadi",
      'Следующий урок, корень и степень, закрывает блок',
      'The next lesson, roots and powers, closes the block',
    ),
    cheat: L('Xulosani chop etish', 'Распечатать памятку', 'Print the summary'),
    screenRef: L('8-ekranga qaytib qarang', 'посмотри снова экран 8', 'look at screen 8 again'),
  },
}

// ============================================================
// EKRANLAR. Rollar va tartib — `ROLE_ORDER` bilan bir xil.
// Asboblar bu darsda GRAFIK: `film` figurasi giperbola, `fourwin` to'rt oyna,
// `paramplot` k bo'yicha surgich.
// ============================================================
export const SCREENS = [
  { role: 'hook', tool: 'pick', scene: <HookScene />, ...S1 },
  { role: 'support', tool: 'chain', kind: 'pairs', ...S2 },
  { role: 'explain', tool: 'film', kind: 'film', tag: 'З2', ...S3 },
  { role: 'explain', tool: 'fourwin', kind: 'windows', tag: 'З27', ...S4 },
  { role: 'explain', tool: 'paramplot', kind: 'slider', tag: 'З28', ...S5 },
  { role: 'explain', tool: 'solve', kind: 'together', tag: 'З2', ...S6 },
  { role: 'explain', tool: 'boundary', kind: 'boundary', tag: 'З27', ...S7 },
  { role: 'rule', tool: 'rulebuild', tag: 'З2', ...S8 },
  { role: 'practice', tool: 'fourwin', kind: 'read', tag: 'З27', method: M_PROD, ...S9 },
  { role: 'practice', tool: 'fields', kind: 'guided', tag: 'З27', method: M_PROD, ...S10 },
  { role: 'practice', tool: 'solo', kind: 'solo', tag: 'З2', method: M_ZERO, ...S11 },
  { role: 'practice', tool: 'audit', kind: 'audit', tag: 'З28', method: M_SIGN, ...S12 },
  { role: 'transfer', tool: 'inverse', kind: 'inverse', tag: 'З2', method: M_ZERO, ...S13 },
  { role: 'blitz', tool: 'blitz', ...S14 },
  { role: 'summary', tool: 'summary', scene: FinalScene, ...S15 },
]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
