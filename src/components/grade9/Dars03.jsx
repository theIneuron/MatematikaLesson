// ============================================================================
// 9-sinf, Dars 3. KVADRAT FUNKSIYA.
//
// REDAKSIYA 1, 2026-08-27. Darslikdan: 1-§ «Kvadrat funksiyaning ta'rifi»
// (5-6-bet, RU/UZ) — ta'rif y=ax²+bx+c va funksiyaning nollari; 2-§ «y=x²
// funksiya» (7-8-bet) — faqat YANGI qism olindi (uchi, nol bilan uchini
// farqlash), qolgani (o'sish/kamayish, simmetriya) 2-darsda allaqachon
// o'tilgan; 3-§ «y=ax² funksiya» (10-11-bet) — koeffitsient a ning
// cho'zish/siqish/aks etish ta'siri.
//
// PLAN DARSLAR_REJASI_9SINF.md da faqat 2- va 3-§ (7, 10-bet) ko'rsatilgan,
// 1-§ (ta'rifning o'zi, 5-bet) ko'rsatilmagan — lekin mavzu nomi
// «Kvadrat funksiya» bo'lgani uchun ta'rifsiz bu darsni boshlab bo'lmaydi,
// shuning uchun 1-§ ham olindi. Bu — Dars01 va Dars02 amaliyoti bilan bir
// xil: qachon reja sahifasi to'liq emas, matematika mantig'i ustun turadi.
//
// TERMINOLOGIYA: UZ atamalar algebra_9_uzb.pdf dan so'zma-so'z, draft emas.
// «kvadrat funksiya» (DARSLAR_REJASI dagi «kvadratik funksiya» emas — bu
// noto'g'ri chiqqan, darslikda faqat «kvadrat funksiya»), «nollari»,
// «uchi», «cho'zish», «siqish», «simmetrik ko'chirish».
//
// TEGLAR (o'zining, 1 va 2-darsdagi kabi):
//   tenglama-vs-funksiya — kvadrat funksiya bilan kvadrat tenglamani
//                           aralashtirish
//   nol-koeff-a           — a ≠ 0 shartini unutish
//   nol-vs-vershina        — funksiya noli bilan uchini aralashtirish
//   a-kattaligi-ishorasi   — |a| kattaligi va ishorasi grafikka qanday
//                           ta'sir qilishini teskari tushunish
//
// ASBOBLAR: yangisi yo'q. RecallMC/CheckReveal (Dars01/02dan) va Drill
// (grade8) — hammasi allaqachon sinalgan, 2-darsdagi QA topgan ikkita
// grabladan (CheckReveal grafik balandligi, sahna klassi) bu dars
// boshidanoq xoli: sahna `g8-scene-final` bilan, CheckReveal grafigi
// umumiy `.g9-summary` byudjetida.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, T, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { CheckReveal, G9_RECOLOR, G9_STYLES, Plane, RecallMC, pathOf, scaleOf } from './asboblar.jsx'

export const META = {
  id: 'grade9-03',
  n: 3,
  row: 3,
  block: 'Б1',
  topic: L('Kvadrat funksiya', 'Квадратичная функция', 'The quadratic function'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "y = ax² + bx + c (a son nolga teng emas) ko'rinishidagi funksiya kvadrat funksiya deyiladi",
    'Функция вида y = ax² + bx + c, где a не равно нулю, называется квадратичной функцией',
    'A function of the form y = ax² + bx + c, where a is not zero, is called a quadratic function',
  ),
  L(
    "Funksiyaning noli — y nolga aylanadigan x qiymati, uchi esa grafikning burilish nuqtasi",
    'Нуль функции — это значение x, при котором y равен нулю, а вершина — точка поворота графика',
    'A zero of the function is a value of x where y equals zero; the vertex is the turning point of the graph',
  ),
  L(
    "a soni kattalashsa parabola torayadi, ishorasi manfiy bo'lsa parabola pastga qaraydi",
    'Чем больше a, тем уже парабола; если знак a отрицательный, парабола направлена вниз',
    'The bigger a is, the narrower the parabola; if the sign of a is negative, the parabola opens downward',
  ),
]

export const MISS = {
  'tenglama-vs-funksiya': {
    what: L(
      "kvadrat funksiya kvadrat tenglama bilan aralashtirildi",
      'квадратичная функция перепутана с квадратным уравнением',
      'the quadratic function was confused with a quadratic equation',
    ),
    wrong: null,
    at: 0,
  },
  'nol-koeff-a': {
    what: L(
      "a nolga teng bo'lishi mumkin emasligi unutildi",
      'забыто, что a не может быть равно нулю',
      'it was forgotten that a cannot be zero',
    ),
    wrong: null,
    at: 0,
  },
  'nol-vs-vershina': {
    what: L(
      "funksiya noli bilan uchi aralashtirildi",
      'нуль функции перепутан с вершиной',
      'a zero of the function was confused with the vertex',
    ),
    wrong: null,
    at: 0,
  },
  'a-kattaligi-ishorasi': {
    what: L(
      "a ning kattaligi yoki ishorasi grafikka teskari ta'sir qiladi deb o'ylandi",
      'величина или знак a ошибочно посчитаны действующими на график наоборот',
      "the size or sign of a was assumed to affect the graph the opposite way",
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// DARSNING FUNKSIYALARI — darslikning o'z misollari.
// ============================================================
// eslint-disable-next-line react-refresh/only-export-components
const QUAD = (x) => x * x                   // y = x²
// eslint-disable-next-line react-refresh/only-export-components
const QUAD2 = (x) => 2 * x * x               // y = 2x² (3-§, cho'zish)
// eslint-disable-next-line react-refresh/only-export-components
const NEGQUAD = (x) => -(x * x)              // y = −x² (3-§, aks etish)
// eslint-disable-next-line react-refresh/only-export-components
const ZEROS_F = (x) => x * x - 3 * x         // y = x² − 3x (1-§, 3-masala)
// eslint-disable-next-line react-refresh/only-export-components
const VERTEX_F = (x) => x * x - 4            // y = x² − 4 (uchi va noli)

// ============================================================
// XUK SAHNASI: IKKI PARABOLA — y=x² VA y=2x², DARSLIKNING 3-RASMI.
// ============================================================
const HOOK_SC = scaleOf({ from: -2.2, to: 2.2, yFrom: -0.5, yTo: 8.5 })
// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <div className="g9-scene-plain" aria-hidden="false">
      <Plane sc={HOOK_SC} xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}>
        <g className="g9-real"><path d={pathOf(QUAD, HOOK_SC)} /></g>
        <g className="g9-real"><path d={pathOf(QUAD2, HOOK_SC)} stroke={T.accent} /></g>
        <text x={HOOK_SC.px(0.55)} y={HOOK_SC.py(QUAD(1.6))}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fill={T.ink2}>
          {t(L('y teng x kvadratga', 'y равен x в квадрате', 'y equals x squared'))}
        </text>
        <text x={HOOK_SC.px(-1.9)} y={HOOK_SC.py(QUAD2(1.35)) - 6}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fill={T.accent}>
          {t(L('y teng ikki x kvadratga', 'y равен два икс в квадрате', 'y equals two x squared'))}
        </text>
      </Plane>
    </div>
  )
}

const FIN_SC = scaleOf({ from: -2.2, to: 2.2, yFrom: -4.5, yTo: 4.5 })
// eslint-disable-next-line react-refresh/only-export-components
const FinalScene = () => {
  const t = useT()
  return (
    <div className="g9-scene-plain g8-scene-final">
      <Plane sc={FIN_SC} xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}>
        <g className="g9-real"><path d={pathOf(QUAD, FIN_SC)} /></g>
        <g className="g9-real"><path d={pathOf(NEGQUAD, FIN_SC)} stroke={T.tip} /></g>
        <circle cx={FIN_SC.px(0)} cy={FIN_SC.py(0)} r="3.4" fill={T.accent} />
        <text x={FIN_SC.px(1.2)} y={FIN_SC.py(QUAD(1.4))}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="9" fill={T.ink2}>
          {t(L('a musbat', 'a положительный', 'a positive'))}
        </text>
        <text x={FIN_SC.px(1.2)} y={FIN_SC.py(NEGQUAD(1.4))}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="9" fill={T.tip}>
          {t(L('a manfiy', 'a отрицательный', 'a negative'))}
        </text>
      </Plane>
    </div>
  )
}

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('IKKI PARABOLA', 'ДВЕ ПАРАБОЛЫ', 'TWO PARABOLAS'),
  title: L(
    "Bir xil qoida, ikki xil rasm",
    'Одно и то же правило, две разные картинки',
    'The same rule, two different pictures',
  ),
  audio: [
    A('mount',
      "Ikkala chiziq ham x kvadratdan chiqqan, faqat oldida boshqa son turibdi.",
      'Обе линии получены из икс в квадрате, только перед ним стоит разное число.',
      'Both lines come from x squared, only with a different number in front.'),
    A('why',
      "Bitta son almashdi, rasm butunlay boshqacha chiqdi. Bu qanday bo'lishi mumkin?",
      'Поменялось одно число, а картинка вышла совсем другой. Как такое возможно?',
      'One number changed, and the picture came out completely different. How is that possible?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Ikkala chiziq ham y teng a ko'paytirilgan x kvadrat. Nega ular bunchalik farq qiladi?",
      'Обе линии — y равно a, умноженному на x в квадрате. Почему они так различаются?',
      'Both lines are y equals a times x squared. Why do they differ so much?',
    ),
    items: [
      {
        id: 'diff-fn',
        show: L("bu ikkita butunlay boshqa qoida", 'это два совсем разных правила', 'these are two completely different rules'),
        hint: L(
          "Qoida bitta: y teng a ko'paytirilgan x kvadrat. Faqat a soni ikkisida boshqa.",
          'Правило одно: y равно a, умноженному на x в квадрате. Различается только число a.',
          'The rule is one and the same: y equals a times x squared. Only the number a differs.',
        ),
      },
      {
        id: 'right', right: true,
        show: L("bitta qoida, faqat a soni boshqa", 'одно правило, только число a разное', 'one rule, only the number a is different'),
      },
      {
        id: 'mistake',
        show: L("rasmlardan biri xato chizilgan", 'один из рисунков нарисован неверно', 'one of the pictures is drawn wrong'),
        hint: L(
          "Ikkalasi ham to'g'ri: har birida jadval qiymatlari formulaga mos keladi.",
          'Оба верны: в каждом значения таблицы соответствуют формуле.',
          'Both are correct: in each, the table values match the formula.',
        ),
      },
      {
        id: 'scale',
        show: L("bu faqat masshtab, funksiya bir xil", 'это просто другой масштаб, функция одна и та же', 'this is just a different scale, the function is the same'),
        hint: L(
          "O'q bo'linmalari ikkalasida ham bir xil. Chiziqning o'zi torayib qolgan.",
          'Деления на осях у обоих одинаковые. Именно сама линия стала уже.',
          'The axis marks are the same on both. The line itself has become narrower.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Qoida bitta, y teng a ko'paytirilgan x kvadrat, lekin a soni parabolaning shaklini o'zgartiradi. Shu bilan bugun ishlaymiz.",
      'Верно. Правило одно, y равно a, умноженному на x в квадрате, но число a меняет форму параболы. С этим и работаем сегодня.',
      'Correct. The rule is one and the same, y equals a times x squared, but the number a changes the shape of the parabola. That is what we work with today.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — a ≠ 0 SHARTI. Darslikning 1-mashqi (6-bet).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Qaysi biri kvadrat funksiya",
    'Какая из них квадратичная',
    'Which one is quadratic',
  ),
  audio: [
    A('mount',
      "To'rtta yozuv beriladi. Qaysi biri kvadrat funksiya ekanini toping.",
      'Даются четыре записи. Найди, какая из них квадратичная функция.',
      'Four records are given. Find which one is a quadratic function.'),
    A('why',
      "Kvadrat funksiyada x kvadratning oldida turgan son nolga teng bo'lmasligi kerak.",
      'В квадратичной функции число перед x в квадрате не должно быть равно нулю.',
      'In a quadratic function, the number in front of x squared must not be zero.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "y = x kub qo'shi yetti x minus bir: bu kvadrat funksiyami?",
        'y равен x в кубе плюс семь икс минус один: это квадратичная функция?',
        'y equals x cubed plus seven x minus one: is this a quadratic function?',
      )}
      cols={2}
      items={[
        { id: 'no', right: true, label: L("Yo'q, bu kub funksiya", 'Нет, это кубическая функция', 'No, this is a cubic function') },
        {
          id: 'yes',
          label: L('Ha, kvadrat funksiya', 'Да, квадратичная', 'Yes, quadratic'),
          hint: L(
            "Kvadrat funksiyada eng katta daraja ikki bo'lishi kerak. Bu yerda esa x kubga ko'tarilgan, daraja uch.",
            'В квадратичной функции наибольшая степень должна быть два. А здесь x возведён в куб, степень три.',
            'In a quadratic function the highest power must be two. Here x is cubed, power three.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Kvadrat funksiyada faqat ikkinchi daraja bo'ladi, uchinchisi emas.",
        'Верно. В квадратичной функции есть только вторая степень, а не третья.',
        'Correct. A quadratic function has only the second power, not the third.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — TA'RIF. y = ax² + bx + c, koeffitsientlarni
// aniqlash. Darslikning 1-masalasi: y = x² − 5x + 6.
// ============================================================
const S3 = {
  eyebrow: L("TA'RIF", 'ОПРЕДЕЛЕНИЕ', 'DEFINITION'),
  title: L(
    "a, b, c koeffitsientlarini topish",
    'Находим коэффициенты a, b, c',
    'Finding the coefficients a, b, c',
  ),
  audio: [
    A('mount',
      "y teng x kvadrat minus besh x qo'shi olti. Har bir qadamni oching va koeffitsientni toping.",
      'y равен x в квадрате минус пять икс плюс шесть. Открывай каждый шаг и находи коэффициент.',
      'y equals x squared minus five x plus six. Open each step and find the coefficient.'),
    A('why',
      "a bu x kvadrat oldidagi son, b bu x oldidagi son, c esa harfsiz qolgan son.",
      'a это число перед x в квадрате, b это число перед x, c это число без буквы.',
      'a is the number before x squared, b is the number before x, c is the number with no letter.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('y = x² − 5x + 6', 'y = x² − 5x + 6', 'y = x² − 5x + 6')}
      steps={[
        { id: 'a', head: 'a', lines: ['a = 1'] },
        { id: 'b', head: 'b', lines: ['b = −5'] },
        { id: 'c', head: 'c', lines: ['c = 6'] },
      ]}
      ask={L(
        "a nolga teng bo'lsa nima bo'ladi?",
        'Что будет, если a равно нулю?',
        'What happens if a is zero?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("x kvadrat yo'qoladi, funksiya kvadrat bo'lmay qoladi", 'x в квадрате исчезнет, функция перестанет быть квадратичной', 'x squared disappears, the function stops being quadratic'),
        },
        {
          id: 'wrong',
          label: L("hech narsa o'zgarmaydi", 'ничего не изменится', 'nothing changes'),
          hint: L(
            "a nolga teng bo'lsa, a ko'paytirilgan x kvadrat ham nolga teng bo'ladi, u yo'qoladi. Qoladigan yozuv esa endi chiziqli funksiya.",
            'Если a равно нулю, то a, умноженное на x в квадрате, тоже равно нулю, и это слагаемое исчезает. Оставшаяся запись становится линейной функцией.',
            'If a is zero, then a times x squared is also zero, and that term disappears. What remains is a linear function.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Shuning uchun ta'rifda a nolga teng emas deb alohida yozilgan.",
        'Верно. Поэтому в определении отдельно написано, что a не равно нулю.',
        'Correct. That is why the definition separately states that a is not zero.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — NOLLARNI TOPISH. Darslikning 3-masalasi:
// y = x² − 3x, nollari 0 va 3.
// ============================================================
const S4 = {
  eyebrow: L('NOLLAR', 'НУЛИ', 'ZEROS'),
  title: L(
    "Funksiyaning nollarini topish",
    'Находим нули функции',
    'Finding the zeros of the function',
  ),
  audio: [
    A('mount',
      "y teng x kvadrat minus uch x. To'rtta sonni sinab ko'ring, qaysi birida y nolga teng bo'ladi.",
      'y равен x в квадрате минус три икс. Проверь четыре числа и найди, при каком y равен нулю.',
      'y equals x squared minus three x. Try four numbers and find where y equals zero.'),
    A('why',
      "Funksiyaning noli bu y ni nolga aylantiradigan x qiymati, sonlarni birma-bir qo'ying.",
      'Нуль функции это значение x, при котором y равен нулю, подставляй числа по очереди.',
      'A zero of the function is a value of x where y equals zero, substitute the numbers one by one.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('y = x² − 3x', 'y = x² − 3x', 'y = x² − 3x')}
      steps={[
        { id: 'm1', head: 'y(−1)', lines: ['y(−1) = (−1)² − 3 · (−1)', 'y(−1) = 4'] },
        { id: 'p0', head: 'y(0)', lines: ['y(0) = 0² − 3 · 0', 'y(0) = 0'] },
        { id: 'p1', head: 'y(1)', lines: ['y(1) = 1² − 3 · 1', 'y(1) = −2'] },
        { id: 'p3', head: 'y(3)', lines: ['y(3) = 3² − 3 · 3', 'y(3) = 0'] },
      ]}
      ask={L(
        "Qaysi ikkita x qiymatida y nolga teng chiqdi?",
        'При каких двух значениях x y получился равным нулю?',
        'At which two values of x did y come out equal to zero?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Nol va uch', 'Ноль и три', 'Zero and three') },
        {
          id: 'wrong',
          label: L('Minus bir va bir', 'Минус один и один', 'Minus one and one'),
          hint: L(
            "Yuqoridagi to'rtta natijaga qarang: minus birda to'rt chiqdi, birda minus ikki. Nol faqat ikkita joyda chiqdi.",
            'Посмотри на четыре результата выше: при минус одном получилось четыре, при одном минус два. Нуль вышел только в двух местах.',
            'Look at the four results above: at minus one it gave four, at one it gave minus two. Zero came out in only two places.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Nol va uch bu funksiyaning nollari: aynan shu x larda y nolga teng.",
        'Верно. Ноль и три это нули функции: именно при этих x значение y равно нулю.',
        'Correct. Zero and three are the zeros of the function: exactly at these x values y equals zero.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — NOL VA UCHINI FARQLASH. y = x² − 4:
// nollari −2 va 2, uchi (0; −4). Ikkalasi ham grafikda, lekin BOSHQA-
// BOSHQA narsa.
// ============================================================
const S5 = {
  eyebrow: L('FARQ', 'РАЗЛИЧИЕ', 'THE DIFFERENCE'),
  title: L(
    "Nol va uchi — ikki xil nuqta",
    'Нуль и вершина — две разные точки',
    'A zero and the vertex are two different points',
  ),
  audio: [
    A('mount',
      "y teng x kvadrat minus to'rt. Grafikda uchta nuqtani hisoblang: chapdagi nol, o'rtadagi uchi, o'ngdagi nol.",
      'y равен x в квадрате минус четыре. Вычисли на графике три точки: левый нуль, вершину посередине, правый нуль.',
      'y equals x squared minus four. Compute three points on the graph: the left zero, the vertex in the middle, the right zero.'),
    A('why',
      "Uchida funksiya eng kichik qiymatni oladi, nollarida esa y aynan nolga teng.",
      'В вершине функция принимает наименьшее значение, а в нулях y равен именно нулю.',
      'At the vertex the function takes its smallest value, while at the zeros y equals exactly zero.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('y = x² − 4', 'y = x² − 4', 'y = x² − 4')}
      steps={[
        { id: 'left', head: 'y(−2)', lines: ['y(−2) = (−2)² − 4', 'y(−2) = 0'] },
        { id: 'mid', head: 'y(0)', lines: ['y(0) = 0² − 4', 'y(0) = −4'] },
        { id: 'right', head: 'y(2)', lines: ['y(2) = 2² − 4', 'y(2) = 0'] },
      ]}
      ask={L(
        "Uchida (x nol bo'lganda) y ham nolga tengmi?",
        'В вершине (когда x равен нулю) y тоже равен нулю?',
        'At the vertex (when x is zero) is y also zero?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Yo'q, uchida y minus to'rtga teng, nol emas", 'Нет, в вершине y равен минус четырём, а не нулю', 'No, at the vertex y equals minus four, not zero'),
        },
        {
          id: 'wrong',
          label: L('Ha, uchi ham nol', 'Да, вершина тоже нуль', 'Yes, the vertex is also a zero'),
          hint: L(
            "Yuqoridagi natijaga qarang: x nol bo'lganda y minus to'rtga teng chiqdi, nolga emas.",
            'Посмотри на результат выше: при x равном нулю y получился равным минус четырём, а не нулю.',
            'Look at the result above: at x equal to zero, y came out equal to minus four, not zero.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Nollar bu y nolga tenglashadigan ikki nuqta, uchi esa o'sha ikkisi orasidagi eng past nuqta. Ular hech qachon bir xil emas, agar uchi Ox o'qida turmasa.",
        'Верно. Нули это две точки, где y равен нулю, а вершина, самая низкая точка между ними. Они никогда не совпадают, если вершина не лежит на оси Ox.',
        'Correct. The zeros are the two points where y equals zero, and the vertex is the lowest point between them. They are never the same point, unless the vertex sits on the Ox axis.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — CHO'ZISH. y=x² va y=2x², darslikning 1-masalasi
// (10-bet).
// ============================================================
const S6 = {
  eyebrow: L("CHO'ZISH", 'РАСТЯЖЕНИЕ', 'STRETCHING'),
  title: L(
    "a kattalashsa, parabola toraymi, kengaymi",
    'Если a больше, парабола уже или шире',
    'If a is bigger, is the parabola narrower or wider',
  ),
  audio: [
    A('mount',
      "Ikkita funksiya: y teng x kvadrat va y teng ikki x kvadrat. Ikkalasini ham bir xil x da hisoblang.",
      'Две функции: y равен x в квадрате и y равен два икс в квадрате. Вычисли обе при одном и том же x.',
      'Two functions: y equals x squared and y equals two x squared. Compute both at the same x.'),
    A('why',
      "Bir xil x da qaysi funksiya kattaroq y berishini solishtiring.",
      'Сравни, какая функция при одном и том же x даёт больший y.',
      'Compare which function gives a bigger y at the same x.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x = 2 da', 'при x = 2', 'at x = 2')}
      steps={[
        { id: 'one', head: 'y = x²', lines: ['y(2) = 2²', 'y(2) = 4'] },
        { id: 'two', head: 'y = 2x²', lines: ['y(2) = 2 · 2²', 'y(2) = 8'] },
      ]}
      ask={L(
        "y teng ikki x kvadrat, bir xil x da qanday y beradi?",
        'y равен два икс в квадрате, что даёт при том же x?',
        'y equals two x squared, what does it give at the same x?',
      )}
      cols={2}
      items={[
        {
          id: 'wrong',
          label: L('Kichikroq y, parabola kengroq', 'Меньший y, парабола шире', 'A smaller y, the parabola is wider'),
          hint: L(
            "Yuqoridagi natijalarga qarang: to'rt va sakkiz. Sakkiz kattaroq, kamroq emas.",
            'Посмотри на результаты выше: четыре и восемь. Восемь больше, а не меньше.',
            'Look at the results above: four and eight. Eight is bigger, not smaller.',
          ),
        },
        { id: 'right', right: true, label: L('Kattaroq y, parabola torroq', 'Больший y, парабола уже', 'A bigger y, the parabola is narrower') },
      ]}
      after={L(
        "To'g'ri. Ikki barobar katta y, grafik tezroq ko'tariladi, demak parabola torayadi. a qancha katta bo'lsa, parabola shuncha tor.",
        'Верно. В два раза больший y означает, что график поднимается быстрее, то есть парабола сужается. Чем больше a, тем уже парабола.',
        'Correct. A y that is twice as big means the graph rises faster, so the parabola narrows. The bigger a is, the narrower the parabola.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — ISHORA. y=x² va y=−x², darslikning 3-masalasi
// (11-bet).
// ============================================================
const S7 = {
  eyebrow: L('ISHORA', 'ЗНАК', 'THE SIGN'),
  title: L(
    "a manfiy bo'lsa, parabola qayerga qaraydi",
    'Если a отрицательный, куда смотрит парабола',
    'If a is negative, which way does the parabola open',
  ),
  audio: [
    A('mount',
      "Endi y teng minus x kvadrat. Ikkita x da hisoblang va y teng x kvadrat bilan solishtiring.",
      'Теперь y равен минус x в квадрате. Вычисли при двух x и сравни с y равно x в квадрате.',
      'Now y equals minus x squared. Compute at two values of x and compare with y equals x squared.'),
    A('why',
      "Har bir natija oldingi funksiyaning aynan minusi bo'lib chiqadimi, tekshiring.",
      'Проверь, оказывается ли каждый результат ровно минусом от прежней функции.',
      'Check whether each result turns out to be exactly the minus of the previous function.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('y = −x²', 'y = −x²', 'y = −x²')}
      steps={[
        { id: 'one', head: 'y(1)', lines: ['y(1) = −(1²)', 'y(1) = −1'] },
        { id: 'two', head: 'y(2)', lines: ['y(2) = −(2²)', 'y(2) = −4'] },
      ]}
      ask={L(
        "y teng x kvadrat musbat qiymat berardi. Endi y teng minus x kvadrat qanday qiymat beradi?",
        'y равно x в квадрате давало положительные значения. А что даёт y равно минус x в квадрате?',
        'y equals x squared gave positive values. What does y equals minus x squared give?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L('Manfiy qiymat, parabola pastga qaraydi', 'Отрицательные значения, парабола направлена вниз', 'Negative values, the parabola opens downward'),
        },
        {
          id: 'wrong',
          label: L("Baribir musbat, faqat kattaroq", 'Всё равно положительные, только больше', 'Still positive, just bigger'),
          hint: L(
            "Natijalarga qarang: minus bir va minus to'rt. Ikkalasi ham manfiy.",
            'Посмотри на результаты: минус один и минус четыре. Оба отрицательные.',
            'Look at the results: minus one and minus four. Both are negative.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ishora manfiy bo'lganda barcha qiymatlar manfiy bo'lib qoladi, shuning uchun parabola pastga qaraydi.",
        'Верно. Когда знак отрицательный, все значения становятся отрицательными, поэтому парабола направлена вниз.',
        'Correct. When the sign is negative, all values become negative, so the parabola opens downward.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 8. QOIDA.
// ============================================================
const S8_RULE = {
  lines: [
    L(
      "y = ax² + bx + c (bunda a, b va c berilgan haqiqiy sonlar, a nolga teng emas, x haqiqiy o'zgaruvchi) funksiya kvadrat funksiya deyiladi",
      'Функция y = ax² + bx + c, где a, b и c — заданные действительные числа, a не равно нулю, x — действительная переменная, называется квадратичной функцией',
      'A function y = ax² + bx + c, where a, b and c are given real numbers, a is not zero, and x is a real variable, is called a quadratic function',
    ),
    L(
      "x ning shunday qiymatlariki, ularda funksiya qiymati 0 ga teng bo'lsa, kvadrat funksiyaning nollari deyiladi",
      'Значения x, при которых значение функции равно 0, называются нулями квадратичной функции',
      'The values of x at which the value of the function equals 0 are called the zeros of the quadratic function',
    ),
    L(
      "Kvadrat funksiyaning grafigi parabola bo'lib, uning koordinatalar boshi bilan mos tushmagan burilish nuqtasi uchi deyiladi",
      'График квадратичной функции — парабола, и её точка поворота называется вершиной параболы',
      "The graph of a quadratic function is a parabola, and its turning point is called the parabola's vertex",
    ),
  ],
  source: L(
    "Algebra 9, 1-§ (5-bet), 3-§ (10-11-bet)",
    'Алгебра 9, §1 (стр. 5), §3 (стр. 10-11)',
    'Algebra 9, §1 (p. 5), §3 (p. 10-11)',
  ),
}

function RuleScreen({ audio, onSolved, step, rule }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <>
      <RecallMC
        intro={L(
          "Avval savolga javob bering, keyin qoida ochiladi",
          'Сначала ответь на вопрос, потом откроется правило',
          'Answer the question first, then the rule opens',
        )}
        formula="y = ax² + bx + c  (a ≠ 0)"
        steps={[]}
        ask={L(
          "Kvadrat funksiyaning grafigi qanday ataladi?",
          'Как называется график квадратичной функции?',
          'What is the graph of a quadratic function called?',
        )}
        cols={2}
        items={[
          { id: 'right', right: true, label: L('Parabola', 'Парабола', 'A parabola') },
          {
            id: 'wrong',
            label: L("To'g'ri chiziq", 'Прямая линия', 'A straight line'),
            hint: L(
              "To'g'ri chiziq chiziqli funksiyaning grafigi. Kvadrat funksiyaning grafigi egri chiziq.",
              'Прямая линия это график линейной функции. У квадратичной функции график, кривая линия.',
              'A straight line is the graph of a linear function. A quadratic function has a curved graph.',
            ),
          },
        ]}
        after={L(
          "To'g'ri. Endi to'liq ta'rif.",
          'Верно. Теперь полное определение.',
          'Correct. Now the full definition.',
        )}
        audio={audio}
        onSolved={(r) => { setOpen(true); if (onSolved) onSolved(r) }}
        onStep={step}
      />
      <RuleCard
        title={t(L('QOIDA', 'ПРАВИЛО', 'RULE')) + ' · ' + t(rule.source)}
        lines={rule.lines.map((l) => t(l))}
        masked={!open}
        lockLabel={L(
          "Qoida to'g'ri javobdan keyin ochiladi",
          'Правило откроется после верного ответа',
          'The rule opens after a correct answer',
        )}
      />
    </>
  )
}

const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    "Kvadrat funksiya, uning nollari va uchi",
    'Квадратичная функция, её нули и вершина',
    'The quadratic function, its zeros and vertex',
  ),
  audio: [
    A('mount',
      "Besh ekranda siz koeffitsientlarni, nollarni, uchini va a ning ta'sirini o'z qo'lingiz bilan tekshirdingiz. Endi ular qoida sifatida.",
      'На пяти экранах ты сам проверил коэффициенты, нули, вершину и влияние a. Теперь они в виде правила.',
      'On five screens you checked the coefficients, zeros, vertex, and the effect of a with your own hands. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Uchalasi ham darslikdan so'zma-so'z.",
      'Правило открылось. Все три даны дословно из учебника.',
      'The rule is open. All three are word for word from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — ZANJIR: kvadrat funksiyami, yo'qmi (to'rtta qisqa
// savol).
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Kvadrat funksiyami",
    'Квадратичная ли это функция',
    'Is this a quadratic function',
  ),
  audio: [
    A('mount',
      "To'rtta yozuv ketma-ket. Har birida kvadrat funksiyami yoki yo'qligini toping.",
      'Четыре записи подряд. В каждой определи, квадратичная это функция или нет.',
      'Four records in a row. In each, find whether it is a quadratic function or not.'),
    A('why',
      "Ikki narsani tekshiring: eng katta daraja ikkimi, va a nolga teng emasmi.",
      'Проверяй два условия: наибольшая степень равна двум, и a не равно нулю.',
      'Check two things: the highest power is two, and a is not zero.'),
  ],
  props: {
    stepLabel: L('Yozuv', 'Запись', 'Record'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham tekshirildi: ikkitasi kvadrat funksiya, ikkitasi emas — biri daraja bo'yicha, biri a bo'yicha.",
      'Все четыре проверены: две квадратичные, две нет — одна по степени, одна по a.',
      'All four are checked: two are quadratic, two are not, one by power, one by a.',
    ),
    tasks: [
      {
        expr: 'y = 3x² − 1',
        question: L("Kvadrat funksiyami?", 'Это квадратичная функция?', 'Is this a quadratic function?'),
        ok: L("Ha. Eng katta daraja ikki, a uchga teng, nolga teng emas.", 'Да. Наибольшая степень два, a равно трём, не нулю.', 'Yes. The highest power is two, a equals three, not zero.'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Yozuvda x kvadrat bor va uning oldida uch turibdi, nolga teng emas.", 'В записи есть x в квадрате, и перед ним стоит три, а не нуль.', 'The record has x squared, with three in front, not zero.') },
        ],
        solution: ['a = 3, b = 0, c = −1', 'a nolga teng emas', "Ha, kvadrat funksiya"],
      },
      {
        expr: 'y = 5x + 1',
        question: L("Kvadrat funksiyami?", 'Это квадратичная функция?', 'Is this a quadratic function?'),
        ok: L("Yo'q. Bu yerda x kvadrat umuman yo'q, eng katta daraja bir.", 'Нет. Здесь вообще нет x в квадрате, наибольшая степень один.', 'No. There is no x squared here at all, the highest power is one.'),
        items: [
          { id: 'a', label: L('Ha', 'Да', 'Yes'), hint: L("X kvadratni qidiring: bu yozuvda u yo'q, faqat x bor.", 'Поищи x в квадрате: в этой записи его нет, есть только x.', 'Look for x squared: it is not in this record, only x.') },
          { id: 'b', right: true, label: L("Yo'q", 'Нет', 'No') },
        ],
        solution: ['Eng katta daraja bitta', "Bu chiziqli funksiya, kvadrat emas"],
      },
      {
        expr: 'y = 0 · x² + 5x + 2',
        question: L("Kvadrat funksiyami?", 'Это квадратичная функция?', 'Is this a quadratic function?'),
        ok: L("Yo'q. A nolga teng, shuning uchun x kvadrat hisobga kirmaydi.", 'Нет. A равно нулю, поэтому x в квадрате не считается.', 'No. A equals zero, so x squared does not count.'),
        items: [
          { id: 'a', label: L('Ha, x kvadrat yozilgan', 'Да, x в квадрате записан', 'Yes, x squared is written'), hint: L("Yozilgan bo'lsa ham, oldidagi son nol. Nolga ko'paytirilgan har qanday son nolning o'zi.", 'Хоть он и записан, число перед ним нуль. Что угодно, умноженное на нуль, даёт нуль.', 'Even though it is written, the number in front is zero. Anything times zero is zero.') },
          { id: 'b', right: true, label: L("Yo'q, a nolga teng", 'Нет, a равно нулю', 'No, a equals zero') },
        ],
        solution: ['a = 0', "Ta'rifga ko'ra a nolga teng bo'lmasligi kerak", 'Kvadrat funksiya emas'],
      },
      {
        expr: 'y = x² + x³',
        question: L("Kvadrat funksiyami?", 'Это квадратичная функция?', 'Is this a quadratic function?'),
        ok: L("Yo'q. Bu yerda x kub ham bor, eng katta daraja uch.", 'Нет. Здесь есть ещё и x в кубе, наибольшая степень три.', 'No. There is also x cubed here, the highest power is three.'),
        items: [
          { id: 'a', label: L('Ha', 'Да', 'Yes'), hint: L("X kvadrat borligi yetarli emas: yozuvda x kub ham bor, u eng kattasi.", 'Мало того, что есть x в квадрате: в записи есть и x в кубе, и это наибольшая степень.', 'It is not enough that x squared is there: the record also has x cubed, which is the highest power.') },
          { id: 'b', right: true, label: L("Yo'q", 'Нет', 'No') },
        ],
        solution: ['Eng katta daraja uchta', 'Kvadrat funksiya emas'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — YO'NALTIRILGAN: y = x² + 2x − 3 ning nollarini
// topish, uch qadam.
// ============================================================
const S10 = {
  eyebrow: L('QADAMLAB', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L(
    "Nollarni topish: uch qadam",
    'Находим нули: три шага',
    'Finding the zeros: three steps',
  ),
  audio: [
    A('mount',
      "Bitta funksiya, uch qadam. Yordam yo'q, lekin har javobdan keyin yechim ochiladi.",
      'Одна функция, три шага. Помощи нет, но после каждого ответа откроется решение.',
      'One function, three steps. No help, but after each answer the solution opens.'),
    A('why',
      "Avval minus uchda, keyin birda, oxirida minus birda tekshiring.",
      'Сначала проверь при минус трёх, потом при одном, в конце при минус одном.',
      'First check at minus three, then at one, finally at minus one.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uch qadam ham to'ldi: ikkita nol topildi, bittasi nol emasligi ko'rsatildi. Har safar shu yo'l: songa qo'yib hisoblash.",
      'Все три шага пройдены: найдены два нуля, показано, что одно число нулём не является. Каждый раз один путь: подстановка числа.',
      'All three steps are done: two zeros found, one number shown not to be a zero. Same path every time: substituting a number.',
    ),
    tasks: [
      {
        expr: 'y = x² + 2x − 3',
        question: L("y(−3) nechiga teng?", 'Чему равно y(−3)?', 'What does y(−3) equal?'),
        ok: L("Ha. Minus uchni qo'yib, natija nolga teng chiqadi.", 'Да. Подставив минус три, получаем результат, равный нулю.', 'Yes. Substituting minus three gives a result of zero.'),
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: '−3', hint: L("Formulaga minus uchni qo'ying: minus uch kvadrat qo'shi ikki karra minus uch minus uch.", 'Подставь в формулу минус три: минус три в квадрате плюс два, умноженное на минус три, минус три.', 'Substitute minus three into the formula: minus three squared plus two times minus three, minus three.') },
        ],
        solution: ['y(−3) = (−3)² + 2 · (−3) − 3', 'y(−3) = 9 − 6 − 3', 'y(−3) = 0'],
      },
      {
        expr: 'y = x² + 2x − 3',
        question: L("y(1) nechiga teng?", 'Чему равно y(1)?', 'What does y(1) equal?'),
        ok: L("Ha. Birni qo'yib, natija ham nolga teng chiqadi.", 'Да. Подставив единицу, результат тоже равен нулю.', 'Yes. Substituting one, the result is also zero.'),
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: '3', hint: L("Formulaga birni qo'ying: bir kvadrat qo'shi ikki minus uch.", 'Подставь в формулу единицу: единица в квадрате плюс два минус три.', 'Substitute one into the formula: one squared plus two minus three.') },
        ],
        solution: ['y(1) = 1² + 2 · 1 − 3', 'y(1) = 1 + 2 − 3', 'y(1) = 0'],
      },
      {
        expr: 'y = x² + 2x − 3',
        question: L("Ikkita nol topildi: minus uch va bir. y(−1) ham nolmi?", 'Найдены два нуля: минус три и один. y(−1) тоже нуль?', 'Two zeros are found: minus three and one. Is y(−1) also zero?'),
        ok: L("Yo'q. Minus birni qo'ysak, natija minus to'rtga teng, nol emas.", 'Нет. Подставив минус один, получаем минус четыре, а не нуль.', 'No. Substituting minus one gives minus four, not zero.'),
        items: [
          { id: 'a', label: L("Ha, u ham nol", 'Да, тоже нуль', 'Yes, also zero'), hint: L("Hisoblang: minus bir kvadrat qo'shi ikki karra minus bir minus uch. Natija nolga teng emas.", 'Посчитай: минус один в квадрате плюс два, умноженное на минус один, минус три. Результат не равен нулю.', 'Compute it: minus one squared plus two times minus one, minus three. The result is not zero.') },
          { id: 'b', right: true, label: L("Yo'q, ikkita nol yetarli", 'Нет, двух нулей достаточно', 'No, two zeros are enough') },
        ],
        solution: ['y(−1) = (−1)² + 2 · (−1) − 3', 'y(−1) = 1 − 2 − 3', 'y(−1) = −4, nol emas'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: priborsiz, faqat hisob.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Faqat hisob: nol, uchi yoki hech biri",
    'Только счёт: нуль, вершина или ни то, ни другое',
    'Just computation: a zero, the vertex, or neither',
  ),
  audio: [
    A('mount',
      "Bu safar chizma yo'q. Har bir savolda son berilgan, siz uni formulaga qo'yib hisoblaysiz.",
      'На этот раз без рисунка. В каждом вопросе дано число, ты подставляешь его в формулу и считаешь.',
      'This time there is no picture. Each question gives a number, you substitute it into the formula and compute.'),
    A('why',
      "Imtihonda ham priborsiz shunday hisoblanadi: qog'ozda, formula bilan.",
      'На контрольной тоже считают без прибора: на бумаге, по формуле.',
      'On a test it is computed the same way, without a tool: on paper, by formula.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham hisoblandi. Har biri bir xil ko'nikmani so'radi: songa qo'yib, natijani so'zga aylantirish.",
      'Все три посчитаны. Каждый требовал одного навыка: подставить число и превратить результат в вывод.',
      'All three are computed. Each required the same skill: substitute the number and turn the result into a conclusion.',
    ),
    tasks: [
      {
        expr: 'y = x² − 9',
        question: L("Uch funksiyaning noli bo'la oladimi?", 'Может ли тройка быть нулём функции?', 'Can three be a zero of the function?'),
        ok: L("Ha. Uchni qo'yganda natija nolga teng chiqadi.", 'Да. При подстановке трёх результат равен нулю.', 'Yes. Substituting three, the result equals zero.'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblang: uch kvadrat minus to'qqiz.", 'Посчитай: три в квадрате минус девять.', 'Compute it: three squared minus nine.') },
        ],
        solution: ['y(3) = 3² − 9', 'y(3) = 0', "Ha, x = 3 nol"],
      },
      {
        expr: 'y = 2x² + 3',
        question: L("Bu funksiyaning uchi Ox o'qida yotadimi?", 'Лежит ли вершина этой функции на оси Ox?', 'Does the vertex of this function lie on the Ox axis?'),
        ok: L("Yo'q. Uchida x nolga teng, y esa uchga teng, nolga emas.", 'Нет. В вершине x равен нулю, а y равен трём, а не нулю.', 'No. At the vertex x is zero, and y equals three, not zero.'),
        items: [
          { id: 'a', label: L('Ha', 'Да', 'Yes'), hint: L("Uchida x nol. Formulaga nolni qo'ying: ikki karra nol kvadrat qo'shi uch.", 'В вершине x равен нулю. Подставь нуль в формулу: два, умноженное на нуль в квадрате, плюс три.', 'At the vertex x is zero. Substitute zero into the formula: two times zero squared plus three.') },
          { id: 'b', right: true, label: L("Yo'q", 'Нет', 'No') },
        ],
        solution: ['y(0) = 2 · 0² + 3', 'y(0) = 3, nolga teng emas', "Uchi Ox o'qida emas"],
      },
      {
        expr: 'y = −3x²',
        question: L("a manfiy bo'lgani uchun parabola qayerga qaraydi?", 'Так как a отрицательно, куда направлена парабола?', 'Since a is negative, which way does the parabola open?'),
        ok: L("Pastga. Manfiy a har doim barcha qiymatlarni manfiy qiladi, uchidan tashqari.", 'Вниз. Отрицательный a всегда делает все значения отрицательными, кроме вершины.', 'Downward. A negative a always makes all values negative, except at the vertex.'),
        items: [
          { id: 'a', right: true, label: L('Pastga', 'Вниз', 'Downward') },
          { id: 'b', label: L('Yuqoriga', 'Вверх', 'Upward'), hint: L("Birni qo'ying: minus uch karra bir kvadrat, natija manfiy chiqadi.", 'Подставь единицу: минус три, умноженное на единицу в квадрате, результат отрицательный.', 'Substitute one: minus three times one squared, the result is negative.') },
        ],
        solution: ['y(1) = −3 · 1²', 'y(1) = −3, manfiy', 'Parabola pastga qaraydi'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Odilning "yechimida" hamma qadam to'g'ri ko'rinadi,
// lekin u funksiyaning uchini nol deb yozgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Uchi bilan nolni aralashtirish",
    'Путаница вершины с нулём',
    'Mixing up the vertex with a zero',
  ),
  audio: [
    A('mount',
      "Odilning yechimi. Undan x kvadrat minus ikki x qo'shi besh funksiyaning nollarini topish so'ralgan edi.",
      'Решение Одила. Нужно было найти нули функции y равно x в квадрате минус два икс плюс пять.',
      "Odil's solution. He was asked to find the zeros of y equals x squared minus two x plus five."),
    A('why',
      "Uning qadamini o'qing va boshqa son bilan o'zingiz tekshiring.",
      'Прочитай его шаг и проверь сам другим числом.',
      'Read his step and check it yourself with another number.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchi va nol ikki xil savolga javob beradi: uchi — qayerda eng kichik qiymat, nol — qayerda y aynan nolga teng. Ularni almashtirib bo'lmaydi.",
      'Вершина и нуль отвечают на разные вопросы: вершина — где наименьшее значение, нуль — где y равен именно нулю. Их нельзя менять местами.',
      'The vertex and a zero answer different questions: the vertex is where the value is smallest, a zero is where y equals exactly zero. They cannot be swapped.',
    ),
    tasks: [
      {
        expr: 'y = x² − 2x + 5',
        question: L(
          "Odil x ni bir deb topdi (bu funksiyaning uchi), va bu funksiyaning noli deb yozdi. Bu xulosa nega noto'g'ri?",
          'Одил нашёл x, равный единице (это вершина функции), и записал это как нуль функции. Почему этот вывод неверен?',
          'Odil found x equal to one (this is the vertex of the function) and wrote it down as a zero of the function. Why is this conclusion wrong?',
        ),
        ok: L(
          "Ha. Vershinada y nolga emas, to'rtga teng, u nol emas, funksiyaning eng kichik qiymati.",
          'Да. В вершине y равен не нулю, а четырём, это не нуль, а наименьшее значение функции.',
          'Yes. At the vertex y equals not zero but four, it is not a zero, it is the smallest value of the function.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Uchida y nolga emas, to'rtga teng, demak bu nol emas", 'В вершине y равен не нулю, а четырём, значит это не нуль', 'At the vertex y equals not zero but four, so it is not a zero'),
          },
          {
            id: 'b',
            label: L("x ni bir deb topishda xato bor", 'Ошибка в том, что x найден равным единице', 'There is a mistake in finding x equal to one'),
            hint: L("Bu qadam to'g'ri: uchining x koordinatasi haqiqatan ham bir.", 'Этот шаг верен: x-координата вершины действительно равна единице.', 'This step is correct: the x-coordinate of the vertex really is one.'),
          },
          {
            id: 'c',
            label: L("Funksiyaning umuman noli yo'q, shuning uchun xato emas", 'У функции вообще нет нулей, поэтому ошибки нет', 'The function has no zeros at all, so there is no mistake'),
            hint: L("Nol yo'qligi to'g'ri bo'lishi mumkin, lekin Odil buni tekshirmagan, u uchini nol deb E'LON qilgan, tekshirmasdan.", 'Отсутствие нулей может быть верным, но Одил это не проверил, он просто ОБЪЯВИЛ вершину нулём, не проверяя.', 'The absence of zeros could be true, but Odil never checked it, he simply DECLARED the vertex to be a zero without checking.'),
          },
        ],
        solution: [
          'y(1) = 1² − 2 · 1 + 5',
          'y(1) = 4, nolga teng emas',
          'Bu uchi, nol emas — funksiyaning umuman noli yo\'q',
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TESKARI TOPSHIRIQ. Xossalar berilgan — mos funksiyani
// tanlash.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI', 'ОБРАТНОЕ', 'THE REVERSE'),
  title: L(
    "Xossalardan formulaga",
    'От свойств к формуле',
    'From properties to the formula',
  ),
  audio: [
    A('mount',
      "Bu safar boshqa tomondan: xossa berilgan, formulani siz tanlaysiz.",
      'На этот раз наоборот: дано свойство, а формулу выбираешь ты.',
      'This time it is the other way round: the property is given, you choose the formula.'),
    A('why',
      "Har bir nomzodda a sonini toping va uning kattaligi hamda ishorasini tekshiring.",
      'В каждом кандидате найди число a и проверь его величину и знак.',
      'In each candidate, find the number a and check its size and sign.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi: a ning kattaligi torlikni, ishorasi esa yo'nalishni belgilaydi.",
      'Обе найдены: величина a определяет ширину, а знак — направление.',
      'Both were found: the size of a determines the width, the sign determines the direction.',
    ),
    tasks: [
      {
        expr: 'a > 1',
        question: L(
          "y teng x kvadratdan TORROQ parabola kerak, va yuqoriga qaraydigan. Qaysi formula mos keladi?",
          'Нужна парабола УЖЕ, чем y равен x в квадрате, и направленная вверх. Какая формула подходит?',
          'A parabola NARROWER than y equals x squared is needed, opening upward. Which formula fits?',
        ),
        ok: L(
          "Ha. Uch x kvadrat: a uchga teng, birdan katta, demak torroq, va ishorasi musbat, yuqoriga qaraydi.",
          'Да. Три икс в квадрате: a равно трём, больше единицы, значит уже, и знак положительный, направлена вверх.',
          'Yes. Three x squared: a equals three, bigger than one, so narrower, and the sign is positive, opening upward.',
        ),
        items: [
          { id: 'a', right: true, label: 'y = 3x²' },
          { id: 'b', label: 'y = 0.5x²', hint: L("Bu yerda a nol butun besh o'ndan, birdan kichik, bu torroq emas, kengroq parabola beradi.", 'Здесь a равно нулевой целой пяти десятым, меньше единицы, это даёт не более узкую, а более широкую параболу.', 'Here a is zero point five, smaller than one, this gives a wider parabola, not a narrower one.') },
          { id: 'c', label: 'y = −3x²', hint: L("A uchga teng bo'lsa ham, ishorasi manfiy, bu parabola pastga qaraydi, yuqoriga emas.", 'Хоть a и равно трём, знак отрицательный, эта парабола направлена вниз, а не вверх.', 'Even though a equals three, the sign is negative, this parabola opens downward, not upward.') },
        ],
        solution: ['a = 3, |3| > 1, demak torroq', 'a musbat, demak yuqoriga qaraydi', 'y = 3x² mos keladi'],
      },
      {
        expr: 'a < 0, |a| < 1',
        question: L(
          "y teng x kvadratdan KENGROQ parabola kerak, va pastga qaraydigan. Qaysi formula mos keladi?",
          'Нужна парабола ШИРЕ, чем y равен x в квадрате, и направленная вниз. Какая формула подходит?',
          'A parabola WIDER than y equals x squared is needed, opening downward. Which formula fits?',
        ),
        ok: L(
          "Ha. Minus nol butun to'rt o'ndan x kvadrat: a birdan kichik, demak kengroq, va manfiy, demak pastga qaraydi.",
          'Да. Минус нуль целых четыре десятых икс в квадрате: a меньше единицы, значит шире, и отрицательный, значит вниз.',
          'Yes. Minus zero point four x squared: a is smaller than one, so wider, and negative, so downward.',
        ),
        items: [
          { id: 'a', right: true, label: 'y = −0.4x²' },
          { id: 'b', label: 'y = −5x²', hint: L("Bu yerda a manfiy, to'g'ri, lekin uning kattaligi beshta, birdan katta, bu kengroq emas, torroq parabola beradi.", 'Здесь a отрицательный, верно, но его величина пять, больше единицы, это даёт не более широкую, а более узкую параболу.', 'Here a is negative, correct, but its size is five, bigger than one, this gives a narrower parabola, not a wider one.') },
          { id: 'c', label: 'y = 0.4x²', hint: L("Kattaligi to'g'ri, birdan kichik, lekin ishorasi musbat, bu parabola yuqoriga qaraydi, pastga emas.", 'Величина верна, меньше единицы, но знак положительный, эта парабола направлена вверх, а не вниз.', 'The size is right, smaller than one, but the sign is positive, this parabola opens upward, not downward.') },
        ],
        solution: ['a = −0.4, |−0.4| < 1, demak kengroq', 'a manfiy, demak pastga qaraydi', 'y = −0.4x² mos keladi'],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Blits: ta'rif, nollar, uchi, koeffitsient a",
    'Блиц: определение, нули, вершина, коэффициент a',
    'Blitz: definition, zeros, vertex, coefficient a',
  ),
  audio: [
    A('mount',
      "To'rtta savol birin ketin. Ular belgini so'raydi, uzoq hisobni emas.",
      'Четыре вопроса один за другим. Они спрашивают про признак, а не про долгий счёт.',
      'Four questions one after another. They ask about the sign, not a long computation.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi.",
      'Счёт идёт по первой попытке.',
      'The count goes by the first attempt.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'nol-koeff-a',
        ask: L(
          "y teng nol karra x kvadrat qo'shi olti x. Bu kvadrat funksiyami?",
          'y равен нуль, умноженный на x в квадрате, плюс шесть икс. Это квадратичная функция?',
          'y equals zero times x squared plus six x. Is this a quadratic function?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, a nolga teng", 'Нет, a равно нулю', 'No, a equals zero') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. A nolga teng bo'lsa, x kvadrat yo'qoladi, ta'rif buzilib qoladi.",
          'Верно. Если a равно нулю, x в квадрате исчезает, определение нарушается.',
          'Correct. If a equals zero, x squared disappears, the definition is broken.',
        ),
        hint: L(
          "X kvadratning borligi yetarli emas: oldidagi son nolga teng bo'lmasligi ham kerak.",
          'Наличия x в квадрате мало: число перед ним тоже не должно быть равно нулю.',
          'Having x squared is not enough: the number in front of it must also not be zero.',
        ),
      },
      {
        id: 'q2',
        tag: 'nol-vs-vershina',
        ask: L(
          "Funksiyaning uchida y har doim nolga tengmi?",
          'В вершине функции y всегда равен нулю?',
          "Is y at the vertex of a function always zero?",
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, faqat ba'zida", 'Нет, только иногда', 'No, only sometimes') },
          { id: 'yes', label: L('Ha, doim', 'Да, всегда', 'Yes, always') },
        ],
        ok: L(
          "To'g'ri. Uchi bu eng kichik yoki eng katta qiymat nuqtasi, nol esa alohida shart. Ular faqat uchi Ox o'qida yotganda mos keladi.",
          'Верно. Вершина это точка наименьшего или наибольшего значения, а нуль, отдельное условие. Они совпадают только если вершина лежит на оси Ox.',
          'Correct. The vertex is the point of smallest or largest value, and a zero is a separate condition. They coincide only if the vertex lies on the Ox axis.',
        ),
        hint: L(
          "X kvadrat minus to'rtni eslang: uchida y minus to'rt edi, nolga emas.",
          'Вспомни y равно x в квадрате минус четыре: в вершине y было минус четыре, а не нуль.',
          'Recall y equals x squared minus four: at the vertex y was minus four, not zero.',
        ),
      },
      {
        id: 'q3',
        tag: 'a-kattaligi-ishorasi',
        ask: L(
          "y teng besh x kvadrat, y teng x kvadratga qaraganda qanday: torroqmi, kengroqmi?",
          'y равен пять x в квадрате — какая она по сравнению с y равно x в квадрате: уже или шире?',
          'y equals five x squared, compared to y equals x squared: narrower or wider?',
        ),
        options: [
          { id: 'narrow', right: true, label: L('Torroq', 'Уже', 'Narrower') },
          { id: 'wide', label: L('Kengroq', 'Шире', 'Wider') },
        ],
        ok: L(
          "To'g'ri. Besh birdan katta, shuning uchun parabola torayadi.",
          'Верно. Пять больше единицы, поэтому парабола сужается.',
          'Correct. Five is bigger than one, so the parabola narrows.',
        ),
        hint: L(
          "Bir xil x da besh karra katta y chiqadi, demak grafik tezroq ko'tariladi, u toraygan bo'ladi.",
          'При одном и том же x получается в пять раз больший y, значит график поднимается быстрее, он сузился.',
          'At the same x, y comes out five times bigger, so the graph rises faster, it has narrowed.',
        ),
      },
      {
        id: 'q4',
        tag: 'tenglama-vs-funksiya',
        ask: L(
          "y teng x kvadrat minus to'rt — bu funksiya. X kvadrat minus to'rt teng nol esa nima?",
          'y равен x в квадрате минус четыре — это функция. А x в квадрате минус четыре равно нулю — что это?',
          'y equals x squared minus four is a function. What is x squared minus four equals zero?',
        ),
        options: [
          {
            id: 'eq', right: true,
            label: L('Tenglama, uning ildizlari funksiyaning nollari', 'Уравнение, его корни — нули функции', 'An equation, its roots are the zeros of the function'),
          },
          { id: 'same', label: L('Bu ham funksiyaning o\'zi', 'Это тоже сама функция', 'This is also the function itself') },
        ],
        ok: L(
          "To'g'ri. Funksiya bu qoida, y ni x orqali beradi. Tenglama esa bitta savol: y qachon nolga teng. Ularning yechimi funksiyaning nollari bo'ladi.",
          'Верно. Функция это правило, дающее y через x. Уравнение это один вопрос: когда y равен нулю. Его решения и есть нули функции.',
          'Correct. A function is a rule that gives y from x. An equation is one question: when y equals zero. Its solutions are the zeros of the function.',
        ),
        hint: L(
          "Funksiyada har bir x uchun y bor. Tenglamada esa faqat y nol bo'lgan x lar qidiriladi, bu boshqa savol.",
          'В функции у каждого x есть y. А в уравнении ищут только те x, при которых y равен нулю, это другой вопрос.',
          'In a function every x has a y. In an equation only the x where y equals zero are sought, that is a different question.',
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Kvadrat funksiya: ta'rif, nollar, uchi, a",
    'Квадратичная функция: определение, нули, вершина, a',
    'The quadratic function: definition, zeros, vertex, a',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda ikkita parabola bir xil qoidadan chiqqanini ko'rdingiz. Endi rasmda ikkalasi ham, ishorasi bilan.",
      'На первом экране ты увидел, что обе параболы получились из одного правила. Теперь на рисунке обе, со знаком.',
      'On the first screen you saw both parabolas came from the same rule. Now the picture shows both, with the sign.'),
    A('s1',
      "Bugun siz kvadrat funksiyaning ta'rifini, nollarini, uchini va a sonining ta'sirini o'rgandingiz.",
      'Сегодня освоены определение квадратичной функции, её нули, вершина и влияние числа a.',
      'Today you learned the definition of a quadratic function, its zeros, its vertex, and the effect of the number a.'),
    A('s2',
      "Keyingi darsda parabola: uning uchini formula bilan topish va grafigini to'liq chizish.",
      'В следующем уроке парабола: как найти её вершину по формуле и построить график целиком.',
      'The next lesson covers the parabola: finding its vertex by formula and drawing the full graph.'),
  ],
  props: {
    mark: 'a > 0  /  a < 0',
    markNote: L(
      "parabolaning ikki yo'nalishi",
      'два направления параболы',
      'the two directions of the parabola',
    ),
    lines: [
      L(
        "Kvadrat funksiyada a hech qachon nolga teng emas",
        'В квадратичной функции a никогда не равно нулю',
        'In a quadratic function a is never zero',
      ),
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: parabola',
      'Следующий урок: парабола',
      'Next lesson: the parabola',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', scene: <HookScene/>, ...S1 },
  { role: 'support',  tag: 'tenglama-vs-funksiya', ...S2 },
  { role: 'explain',  tag: 'nol-koeff-a', ...S3 },
  { role: 'explain',  tag: 'nol-vs-vershina', ...S4 },
  { role: 'explain',  tag: 'nol-vs-vershina', ...S5 },
  { role: 'explain',  tag: 'a-kattaligi-ishorasi', ...S6 },
  { role: 'explain',  tag: 'a-kattaligi-ishorasi', ...S7 },
  { role: 'rule',     tag: 'tenglama-vs-funksiya', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'tenglama-vs-funksiya', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'nol-vs-vershina', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'nol-koeff-a', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'nol-vs-vershina', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'a-kattaligi-ishorasi', ...S13 },
  { role: 'blitz',    tool: 'blitz', ...S14,
    props: {
      ...S14.props,
      scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
      stepLabel: L('Savol', 'Вопрос', 'Question'),
    },
  },
  { role: 'summary',  tool: 'takeaway', scene: <FinalScene/>, ...S15 },
]

// PALITRA: sinf bo'yicha bitta konstanta, `asboblar.jsx`dagi `G9_RECOLOR`.
// Alohida nusxa yozilmaydi.
export default makeLesson({ META, STATEMENTS, MISS, SCREENS, styles: G9_STYLES, recolor: G9_RECOLOR })
