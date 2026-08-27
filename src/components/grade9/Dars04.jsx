// ============================================================================
// 9-sinf, Dars 4. PARABOLA.
//
// REDAKSIYA 1, 2026-08-27. Darslikdan: 4-§ «Funksiya y = ax² + bx + c»
// (14-17-bet, RU/UZ) — to'liq kvadratni ajratish, uchi formulasi
// x0 = −b/(2a), simmetriya o'qi; 5-§ «Kvadrat funksiyaning grafigini
// yasash» (18-19-bet) — besh qadamli qurish algoritmi. Butun dars
// darslikning AYNAN O'Z misolida (1-masala, 18-bet): y = x² − 4x + 3.
//
// TERMINOLOGIYA: UZ atamalar algebra_9_uzb.pdf dan so'zma-so'z: «uchi»,
// «simmetriya o'qi», «parabolaning tenglamasi», «tarmoqlari», «yasash».
//
// TEGLAR (o'zining):
//   x0-formula-belgisi     — x0 = −b/(2a) formulasida ishorani unutish
//   simmetriya-oqi-vertikal — simmetriya o'qini gorizontal yoki Ox ning
//                             o'zi deb o'ylash
//   nollarsiz-grafik        — faqat uchi bilan grafik chizishga urinish,
//                             nollar va qo'shimcha nuqtalarsiz
//   nosimmetrik-nuqtalar    — qo'shimcha nuqtalarni x0 ga nisbatan
//                             simmetrik olmaslik
//
// ASBOBLAR: yangisi yo'q. RecallMC/RuleScreen (Dars01-03dan tanish) va
// YAKUNIY YIG'ISH uchun `Trace` (Dars01dan, asboblar.jsx) — besh nuqtani
// birma-bir joylashtirib, parabolani ULARDAN yig'ib chiqaradi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, T, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, Plane, RecallMC, Trace, pathOf, scaleOf } from './asboblar.jsx'

export const META = {
  id: 'grade9-04',
  n: 4,
  row: 4,
  block: 'Б1',
  topic: L('Parabola', 'Парабола', 'The parabola'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Parabolaning uchi x0 teng minus b bo'lingan ikki a, y0 teng y(x0) formulalari bilan topiladi",
    'Вершина параболы находится по формулам x0 равно минус b, делённое на два a, y0 равно y от x0',
    'The vertex of the parabola is found by x0 equals minus b divided by two a, y0 equals y of x0',
  ),
  L(
    "Simmetriya o'qi uchidan o'tuvchi TIK chiziq, Ox ning o'zi emas",
    'Ось симметрии — это ВЕРТИКАЛЬНАЯ линия через вершину, а не сама ось Ox',
    'The axis of symmetry is a VERTICAL line through the vertex, not the Ox axis itself',
  ),
  L(
    "Grafik besh nuqtadan yig'iladi: uchi, ikki nol, va uchiga nisbatan simmetrik ikki qo'shimcha nuqta",
    'График собирается из пяти точек: вершина, два нуля и две дополнительные точки, симметричные относительно вершины',
    'The graph is assembled from five points: the vertex, two zeros, and two extra points symmetric about the vertex',
  ),
]

export const MISS = {
  'x0-formula-belgisi': {
    what: L(
      "x0 formulasida ishora xato qo'yildi",
      'в формуле x0 ошиблись со знаком',
      'the sign was placed wrong in the x0 formula',
    ),
    wrong: null,
    at: 0,
  },
  'simmetriya-oqi-vertikal': {
    what: L(
      "simmetriya o'qi Ox ning o'zi yoki gorizontal chiziq deb o'ylandi",
      'ось симметрии принята за саму ось Ox или за горизонтальную линию',
      'the axis of symmetry was taken to be the Ox axis itself or a horizontal line',
    ),
    wrong: null,
    at: 0,
  },
  'nollarsiz-grafik': {
    what: L(
      "grafik faqat uchi bilan chizilishga urinildi, nollarsiz",
      'график пытались построить только по вершине, без нулей',
      'the graph was attempted using only the vertex, without the zeros',
    ),
    wrong: null,
    at: 0,
  },
  'nosimmetrik-nuqtalar': {
    what: L(
      "qo'shimcha nuqtalar uchiga nisbatan simmetrik olinmadi",
      'дополнительные точки взяты не симметрично относительно вершины',
      'the extra points were not taken symmetric about the vertex',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// DARSNING FUNKSIYASI — darslikning 1-masalasi (18-bet):
// y = x² − 4x + 3. Uchi (2; −1), nollari 1 va 3, qo'shimcha (0;3), (4;3).
// ============================================================
// eslint-disable-next-line react-refresh/only-export-components
const MAIN_F = (x) => x * x - 4 * x + 3
// eslint-disable-next-line react-refresh/only-export-components
const QUAD = (x) => x * x

const HOOK_SC = scaleOf({ from: -1.5, to: 4.5, yFrom: -1.5, yTo: 8.5 })
// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <div className="g9-scene-plain" aria-hidden="false">
      <Plane sc={HOOK_SC} xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}>
        <g className="g9-real"><path d={pathOf(QUAD, HOOK_SC)} /></g>
        <g className="g9-real"><path d={pathOf(MAIN_F, HOOK_SC)} stroke={T.accent} /></g>
        <circle cx={HOOK_SC.px(2)} cy={HOOK_SC.py(-1)} r="4" fill={T.accent} />
        <text x={HOOK_SC.px(-1.3)} y={HOOK_SC.py(QUAD(1.7))}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fill={T.ink2}>
          {t(L('y teng x kvadratga', 'y равен x в квадрате', 'y equals x squared'))}
        </text>
        <text x={HOOK_SC.px(2.3)} y={HOOK_SC.py(-1) + 16}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fill={T.accent}>
          {t(L('yangi uchi shu yerda', 'новая вершина здесь', 'the new vertex is here'))}
        </text>
      </Plane>
    </div>
  )
}

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('YANGI UCHI', 'НОВАЯ ВЕРШИНА', 'A NEW VERTEX'),
  title: L(
    "Parabola qayerga ko'chganini qayerdan bilamiz",
    'Откуда мы знаем, куда переместилась парабола',
    'How do we know where the parabola has moved',
  ),
  audio: [
    A('mount',
      "Kulrang parabola y teng x kvadrat, oldindan tanish. Rangli parabola esa boshqa formuladan: y teng x kvadrat minus to'rt x qo'shi uch.",
      'Серая парабола, y равен x в квадрате, уже знакома. Цветная парабола из другой формулы: y равен x в квадрате минус четыре икс плюс три.',
      'The gray parabola, y equals x squared, is already familiar. The colored parabola comes from another formula: y equals x squared minus four x plus three.'),
    A('why',
      "Rangli parabolaning uchi endi boshqa joyda turibdi. Qayerdaligini oldindan, hisoblamasdan qanday bilish mumkin?",
      'Вершина цветной параболы теперь стоит в другом месте. Как узнать заранее, не считая, где именно?',
      'The vertex of the colored parabola now stands in a different place. How can we know in advance, without computing, exactly where?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Yangi uchi qayerda turishini oldindan bilish mumkinmi?",
      'Можно ли заранее знать, где встанет новая вершина?',
      'Can we know in advance where the new vertex will stand?',
    ),
    items: [
      {
        id: 'guess',
        show: L("yo'q, faqat chizib ko'rish bilan", 'нет, только построив и посмотрев', 'no, only by drawing and looking'),
        hint: L(
          "Aslida bor: koeffitsientlardan tayyor formula bilan hisoblanadi, chizishdan oldin.",
          'На самом деле можно: она вычисляется по готовой формуле из коэффициентов, ещё до построения.',
          'Actually we can: it is computed by a ready formula from the coefficients, before drawing anything.',
        ),
      },
      {
        id: 'right', right: true,
        show: L("ha, koeffitsientlardan formula bilan hisoblanadi", 'да, вычисляется по формуле из коэффициентов', 'yes, it is computed by a formula from the coefficients'),
      },
      {
        id: 'always-origin',
        show: L("uchi doim koordinatalar boshida turadi", 'вершина всегда стоит в начале координат', 'the vertex always stands at the origin'),
        hint: L(
          "Faqat y teng a ko'paytirilgan x kvadrat uchun shunday. b va c qo'shilganda uchi joyidan ko'chadi.",
          'Так бывает только для y равно a, умноженному на x в квадрате. Когда добавляются b и c, вершина смещается.',
          'That is only true for y equals a times x squared. When b and c are added, the vertex shifts away.',
        ),
      },
      {
        id: 'random',
        show: L("yo'q, uchi tasodifiy joyda paydo bo'ladi", 'нет, вершина появляется в случайном месте', 'no, the vertex appears at a random spot'),
        hint: L(
          "Tasodifiy emas: bir xil koeffitsientlar har doim bir xil uchini beradi, buni formula bilan aniq topish mumkin.",
          'Не случайно: одни и те же коэффициенты всегда дают одну и ту же вершину, её можно точно найти по формуле.',
          'Not random: the same coefficients always give the same vertex, and it can be found exactly by formula.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Uchining koordinatalari a, b, c dan tayyor formula bilan hisoblanadi. Buni bugun o'rganamiz.",
      'Верно. Координаты вершины вычисляются по готовой формуле из a, b и c. Это мы сегодня и разберём.',
      'Correct. The coordinates of the vertex are computed by a ready formula from a, b and c. That is what we work out today.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — 3-darsdan tanish: uchi va noli farqi (qisqa).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Uchi va nolni eslash",
    'Вспоминаем вершину и нуль',
    'Recalling the vertex and a zero',
  ),
  audio: [
    A('mount',
      "O'tgan darsdan savol: uchida funksiya qanday qiymat oladi?",
      'Вопрос с прошлого урока: какое значение функция принимает в вершине?',
      'A question from the last lesson: what value does the function take at the vertex?'),
    A('why',
      "Uchi bu eng kichik yoki eng katta qiymat, nol esa alohida shart ekanini eslang.",
      'Вспомни, что вершина это наименьшее или наибольшее значение, а нуль, отдельное условие.',
      'Recall that the vertex is the smallest or largest value, and a zero is a separate condition.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Uchida funksiya har doim eng kichik yoki eng katta qiymatni oladi. Bu qiymat har doim nolga tengmi?",
        'В вершине функция всегда принимает наименьшее или наибольшее значение. Это значение всегда равно нулю?',
        'At the vertex the function always takes its smallest or largest value. Is that value always zero?',
      )}
      cols={1}
      items={[
        { id: 'no', right: true, label: L("Yo'q, faqat ba'zida", 'Нет, только иногда', 'No, only sometimes') },
        {
          id: 'yes',
          label: L('Ha, doim', 'Да, всегда', 'Yes, always'),
          hint: L(
            "3-darsda ko'rgansiz: y teng x kvadrat minus to'rtning uchida y minus to'rtga teng edi, nolga emas.",
            'На 3 уроке ты видел: в вершине y равно x в квадрате минус четыре получилось минус четыре, а не нуль.',
            'In lesson 3 you saw: at the vertex of y equals x squared minus four, y came out minus four, not zero.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bugun uchining aynan qayerda turishini formula bilan topamiz.",
        'Верно. Сегодня найдём по формуле, где именно стоит вершина.',
        'Correct. Today we find by formula exactly where the vertex stands.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — x0 FORMULASI. y = x² − 4x + 3: a=1, b=−4.
// ============================================================
const S3 = {
  eyebrow: L('FORMULA', 'ФОРМУЛА', 'THE FORMULA'),
  title: L(
    "Uchining abssissasi: x0 teng minus b bo'lingan ikki a",
    'Абсцисса вершины: x0 равно минус b, делённое на два a',
    'The x-coordinate of the vertex: x0 equals minus b over two a',
  ),
  audio: [
    A('mount',
      "y teng x kvadrat minus to'rt x qo'shi uch. Avval a va b larni o'qing, keyin formulaga qo'ying.",
      'y равен x в квадрате минус четыре икс плюс три. Сначала прочитай a и b, потом подставь в формулу.',
      'y equals x squared minus four x plus three. First read a and b, then substitute into the formula.'),
    A('why',
      "Formulada minus belgisi bor: b manfiy bo'lsa, ikki minus bir-birini yo'qotadi.",
      'В формуле есть знак минус: если b отрицательно, два минуса гасят друг друга.',
      'The formula has a minus sign: if b is negative, the two minuses cancel out.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('y = x² − 4x + 3', 'y = x² − 4x + 3', 'y = x² − 4x + 3')}
      steps={[
        { id: 'ab', head: 'a, b', lines: ['a = 1', 'b = −4'] },
        { id: 'x0', head: 'x0', lines: ['x0 = −(−4) / (2 · 1)', 'x0 = 4 / 2', 'x0 = 2'] },
      ]}
      ask={L(
        "b manfiy bo'lgani uchun formulada nima sodir bo'ldi?",
        'Так как b отрицательно, что произошло в формуле?',
        'Since b is negative, what happened in the formula?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Ikki minus bir-birini yo'qotdi, x0 musbat chiqdi", 'Два минуса погасили друг друга, x0 получился положительным', 'The two minuses cancelled, x0 came out positive'),
        },
        {
          id: 'wrong',
          label: L("x0 ham manfiy bo'lishi kerak edi", 'x0 тоже должен был получиться отрицательным', 'x0 should have come out negative too'),
          hint: L(
            "Formulada minus bilan minus to'rt turibdi: minus karra minus musbat beradi. Natijani qarang: ikkiga bo'lingan to'rt, ya'ni ikki.",
            'В формуле стоят минус и минус четыре: минус на минус даёт плюс. Посмотри на результат: четыре, делённое на два, то есть два.',
            'The formula has a minus and minus four: minus times minus gives plus. Look at the result: four divided by two, that is two.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. x0 ikkiga teng chiqdi. Bu uchining abssissasi.",
        'Верно. x0 получился равным двум. Это абсцисса вершины.',
        'Correct. x0 came out equal to two. This is the x-coordinate of the vertex.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — y0 = y(x0), TO'LIQ UCHI.
// ============================================================
const S4 = {
  eyebrow: L('UCHI', 'ВЕРШИНА', 'THE VERTEX'),
  title: L(
    "Uchining ordinatasi: x0 ni formulaga qo'yish",
    'Ордината вершины: подставляем x0 в формулу',
    'The y-coordinate of the vertex: substitute x0 into the formula',
  ),
  audio: [
    A('mount',
      "x0 ikkiga teng ekanini topdik. Endi shu ikkini asl formulaga qo'ying va y0 ni toping.",
      'Мы нашли, что x0 равен двум. Теперь подставь эту двойку в исходную формулу и найди y0.',
      'We found x0 equals two. Now substitute that two into the original formula and find y0.'),
    A('why',
      "y0 bu funksiyaning shu nuqtadagi qiymati, oddiy songa qo'yish bilan topiladi.",
      'y0 это значение функции в этой точке, находится обычной подстановкой числа.',
      'y0 is the value of the function at that point, found by ordinary substitution.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('y = x² − 4x + 3,  x0 = 2', 'y = x² − 4x + 3,  x0 = 2', 'y = x² − 4x + 3,  x0 = 2')}
      steps={[
        { id: 'y0', head: 'y0', lines: ['y0 = 2² − 4 · 2 + 3', 'y0 = 4 − 8 + 3', 'y0 = −1'] },
      ]}
      ask={L(
        "Uchining to'liq koordinatalari qanday yoziladi?",
        'Как записать полные координаты вершины?',
        'How are the full coordinates of the vertex written?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '(2; −1)' },
        {
          id: 'wrong',
          label: '(−1; 2)',
          hint: L(
            "Tartib muhim: birinchi o'rinda x0, ikkinchi o'rinda y0 turadi. x0 ikki, y0 minus bir edi.",
            'Порядок важен: на первом месте x0, на втором y0. x0 было два, y0 было минус один.',
            'Order matters: x0 comes first, y0 comes second. x0 was two, y0 was minus one.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uchining koordinatalari: ikki, minus bir.",
        'Верно. Координаты вершины: два, минус один.',
        'Correct. The coordinates of the vertex: two, minus one.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — SIMMETRIYA O'QI: TIK CHIZIQ, Ox EMAS.
// ============================================================
const S5 = {
  eyebrow: L("SIMMETRIYA O'QI", 'ОСЬ СИММЕТРИИ', 'AXIS OF SYMMETRY'),
  title: L(
    "Simmetriya o'qi qanday chiziq",
    'Какая линия — ось симметрии',
    'What kind of line is the axis of symmetry',
  ),
  audio: [
    A('mount',
      "Uchi ikki, minus birda turibdi. Endi shu nuqtadan simmetriya o'qi o'tkaziladi.",
      'Вершина стоит в точке два, минус один. Теперь через эту точку проводится ось симметрии.',
      'The vertex stands at the point two, minus one. Now the axis of symmetry passes through this point.'),
    A('why',
      "Simmetriya o'qi ordinatalar o'qiga parallel, ya'ni tik chiziq. Ox ning o'zi emas.",
      'Ось симметрии параллельна оси ординат, то есть вертикальна. Это не сама ось Ox.',
      'The axis of symmetry is parallel to the Oy axis, that is, vertical. It is not the Ox axis itself.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Simmetriya o'qi qanday chiziq: tik (x = 2) yoki yotiq (y = −1)?",
        'Ось симметрии — какая линия: вертикальная (x = 2) или горизонтальная (y = −1)?',
        'The axis of symmetry, which line is it: vertical (x = 2) or horizontal (y = −1)?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Tik, x = 2', 'Вертикальная, x = 2', 'Vertical, x = 2') },
        {
          id: 'wrong',
          label: L('Yotiq, y = −1', 'Горизонтальная, y = −1', 'Horizontal, y = −1'),
          hint: L(
            "Parabolaning ikki tarmog'i chapdan va o'ngdan bir xil balandlikka ko'tariladi, tepadan yoki pastdan emas. Buni ajratadigan chiziq tik bo'lishi kerak.",
            'Две ветви параболы поднимаются одинаково слева и справа, а не сверху и снизу. Разделяющая их линия должна быть вертикальной.',
            'The two branches of the parabola rise equally from the left and right, not from top and bottom. The line dividing them must be vertical.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Simmetriya o'qi uchidan o'tuvchi tik chiziq, x teng ikki.",
        'Верно. Ось симметрии, вертикальная линия через вершину, x равно двум.',
        'Correct. The axis of symmetry is the vertical line through the vertex, x equals two.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — NOLLAR: x² − 4x + 3 = 0 tenglamasi.
// ============================================================
const S6 = {
  eyebrow: L('NOLLAR', 'НУЛИ', 'ZEROS'),
  title: L(
    "Grafikning Ox bilan kesishishi",
    'Пересечение графика с Ox',
    'Where the graph crosses Ox',
  ),
  audio: [
    A('mount',
      "Uchi va o'qi joyida. Endi grafik Ox o'qini qayerda kesishini toping: tenglamani yeching.",
      'Вершина и ось на месте. Теперь найди, где график пересекает ось Ox: реши уравнение.',
      'The vertex and axis are in place. Now find where the graph crosses the Ox axis: solve the equation.'),
    A('why',
      "x² minus to'rt x qo'shi uch nolga tenglashtiriladi va ikkita ildiz topiladi.",
      'x в квадрате минус четыре икс плюс три приравнивается к нулю, и находятся два корня.',
      'x squared minus four x plus three is set equal to zero, and two roots are found.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x² − 4x + 3 = 0', 'x² − 4x + 3 = 0', 'x² − 4x + 3 = 0')}
      steps={[
        { id: 'check1', head: 'y(1)', lines: ['y(1) = 1² − 4 · 1 + 3', 'y(1) = 0'] },
        { id: 'check3', head: 'y(3)', lines: ['y(3) = 3² − 4 · 3 + 3', 'y(3) = 0'] },
      ]}
      ask={L(
        "Grafik Ox o'qini qaysi ikki nuqtada kesadi?",
        'В каких двух точках график пересекает ось Ox?',
        'At which two points does the graph cross the Ox axis?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '(1; 0) и (3; 0)' },
        {
          id: 'wrong',
          label: '(2; −1)',
          hint: L(
            "Bu nuqta uchi, u Ox o'qida turmagan: undagi y minus birga teng, nolga emas.",
            'Это вершина, она не лежит на оси Ox: там y равен минус единице, а не нулю.',
            'That is the vertex, it does not lie on the Ox axis: there y equals minus one, not zero.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bir va uchda y nolga teng, aynan shu yerda grafik Ox ni kesadi.",
        'Верно. При одном и при трёх y равен нулю, именно там график пересекает Ox.',
        'Correct. At one and at three, y equals zero, exactly where the graph crosses Ox.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — HAMMASINI YIG'ISH. Trace bilan besh nuqta:
// (1;0), (0;3), (2;−1), (4;3), (3;0) — birma-bir joylashadi, so'ngra
// haqiqiy parabola ular ORQALI o'tadi.
// ============================================================
const S7 = {
  eyebrow: L("YIG'ISH", 'СБОРКА', 'ASSEMBLY'),
  title: L(
    "Besh nuqtadan parabola",
    'Парабола из пяти точек',
    'A parabola from five points',
  ),
  audio: [
    A('mount',
      "Uchi, ikki nol va ikkita qo'shimcha nuqta, beshtasi ham tayyor. Ularni birma-bir grafikka qo'ying.",
      'Вершина, два нуля и две дополнительные точки, все пять готовы. Ставь их на график одну за другой.',
      'The vertex, two zeros, and two extra points, all five are ready. Place them on the graph one by one.'),
    W('p5',
      "Beshta nuqta ham joyida. Ularni birlashtiring va parabolaning o'zi qanday chiqishini ko'ring.",
      'Все пять точек на месте. Соедини их и увидь, какой получается сама парабола.',
      'All five points are in place. Connect them and see what the parabola itself turns out to be.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Trace
      f={MAIN_F}
      from={-0.5} to={4.5} yFrom={-1.5} yTo={4.5}
      pairs={[
        { x: 1, y: 0 }, { x: 0, y: 3 }, { x: 2, y: -1 }, { x: 4, y: 3 }, { x: 3, y: 0 },
      ]}
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "Beshta nuqtani birma-bir qo'ying",
        'Ставь пять точек одну за другой',
        'Place the five points one by one',
      )}
      after={L(
        "Ana xolos. Uchi, ikki nol va ikkita qo'shimcha nuqta, parabolani chizish uchun shu beshtasi yetarli.",
        'Вот и всё. Вершина, два нуля и две дополнительные точки, этих пяти достаточно, чтобы построить параболу.',
        'That is all it takes. The vertex, two zeros, and two extra points, these five are enough to draw the parabola.',
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
      "Istalgan y = ax² + bx + c kvadrat funksiyani to'liq kvadratni ajratish yordamida y = a(x − x0)² + y0 ko'rinishida yozish mumkin, bunda x0 = −b/2a, y0 = y(x0)",
      'Любую квадратичную функцию y = ax² + bx + c с помощью выделения полного квадрата можно записать в виде y = a(x − x0)² + y0, где x0 = −b/2a, y0 = y(x0)',
      'Any quadratic function y = ax² + bx + c can be written, by completing the square, as y = a(x − x0)² + y0, where x0 = −b/2a, y0 = y(x0)',
    ),
    L(
      "y = ax² + bx + c parabolaning simmetriya o'qi ordinatalar o'qiga parallel va parabolaning uchidan o'tuvchi to'g'ri chiziq bo'ladi",
      'Ось симметрии параболы y = ax² + bx + c — прямая, параллельная оси ординат и проходящая через вершину параболы',
      "The axis of symmetry of the parabola y = ax² + bx + c is a line parallel to the Oy axis, passing through the parabola's vertex",
    ),
    L(
      "Grafikni yasash: uchini toping, simmetriya o'qini o'tkazing, nollarini toping, uchiga nisbatan simmetrik yana ikki nuqtani hisoblang, so'ngra parabolani chizing",
      'Построение графика: найти вершину, провести ось симметрии, найти нули, вычислить ещё две точки, симметричные относительно вершины, и провести параболу',
      'Constructing the graph: find the vertex, draw the axis of symmetry, find the zeros, compute two more points symmetric about the vertex, then draw the parabola',
    ),
  ],
  source: L(
    "Algebra 9, 4-§ (14-17-bet), 5-§ (18-19-bet)",
    'Алгебра 9, §4 (стр. 14-17), §5 (стр. 18-19)',
    'Algebra 9, §4 (p. 14-17), §5 (p. 18-19)',
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
        formula="x0 = −b / (2a)"
        steps={[]}
        ask={L(
          "Uchini topgandan keyin, grafikni chizishdan oldin yana nimalar kerak?",
          'После того как найдена вершина, что ещё нужно перед построением графика?',
          'After the vertex is found, what else is needed before drawing the graph?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Nollar va uchiga nisbatan simmetrik yana ikki nuqta", 'Нули и ещё две точки, симметричные относительно вершины', 'The zeros and two more points symmetric about the vertex'),
          },
          {
            id: 'wrong',
            label: L('Hech narsa, uchi yetarli', 'Ничего, вершины достаточно', 'Nothing, the vertex is enough'),
            hint: L(
              "Bitta nuqta bilan parabolaning kengligini chizib bo'lmaydi: yana kamida to'rtta nuqta kerak.",
              'По одной точке ширину параболы не начертишь: нужно ещё как минимум четыре точки.',
              'One point cannot show the width of the parabola: at least four more points are needed.',
            ),
          },
        ]}
        after={L(
          "To'g'ri. Endi to'liq algoritm.",
          'Верно. Теперь полный алгоритм.',
          'Correct. Now the full algorithm.',
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
    "Uchi, simmetriya o'qi va qurish algoritmi",
    'Вершина, ось симметрии и алгоритм построения',
    'The vertex, the axis of symmetry, and the construction algorithm',
  ),
  audio: [
    A('mount',
      "Olti ekranda siz uchini, o'qini, nollarini va yana ikki nuqtani o'z qo'lingiz bilan topdingiz. Endi ular qoida sifatida.",
      'На шести экранах ты сам нашёл вершину, ось, нули и ещё две точки. Теперь они в виде правила.',
      'On six screens you found the vertex, the axis, the zeros, and two more points with your own hands. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Uchalasi ham darslikdan so'zma-so'z.",
      'Правило открылось. Все три даны дословно из учебника.',
      'The rule is open. All three are word for word from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — ZANJIR: x0 ni topish, to'rtta funksiya.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "x0 ni tez topish",
    'Быстро находим x0',
    'Quickly finding x0',
  ),
  audio: [
    A('mount',
      "To'rtta funksiya ketma-ket. Har birida x0 ni formula bilan toping.",
      'Четыре функции подряд. В каждой найди x0 по формуле.',
      'Four functions in a row. In each, find x0 by the formula.'),
    A('why',
      "Har safar a va b ni o'qing, keyin minus b bo'lingan ikki a ni hisoblang.",
      'Каждый раз читай a и b, потом вычисляй минус b, делённое на два a.',
      'Each time, read a and b, then compute minus b divided by two a.'),
  ],
  props: {
    stepLabel: L('Funksiya', 'Функция', 'Function'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham topildi. Har safar bir xil yo'l: a va b ni o'qish, formulaga qo'yish.",
      'Все четыре найдены. Каждый раз один путь: прочитать a и b, подставить в формулу.',
      'All four are found. Same path every time: read a and b, substitute into the formula.',
    ),
    tasks: [
      {
        expr: 'y = x² − 6x + 5',
        question: L('x0 nechiga teng?', 'Чему равен x0?', 'What does x0 equal?'),
        ok: L("Ha. Minus minus olti, ikkiga bo'lingan: uch.", 'Да. Минус минус шесть, делённое на два: три.', 'Yes. Minus minus six, divided by two: three.'),
        items: [
          { id: 'a', right: true, label: '3' },
          { id: 'b', label: '−3', hint: L("Ishorani qayta tekshiring: b manfiy, formulada oldida yana bir minus bor, ikkalasi bir-birini yo'qotadi.", 'Перепроверь знак: b отрицательно, а в формуле перед ним ещё один минус, они гасят друг друга.', 'Recheck the sign: b is negative, and the formula has another minus in front, the two cancel.') },
        ],
        solution: ['a = 1, b = −6', 'x0 = 6 / 2', 'x0 = 3'],
      },
      {
        expr: 'y = 2x² + 4x − 1',
        question: L('x0 nechiga teng?', 'Чему равен x0?', 'What does x0 equal?'),
        ok: L("Ha. Minus to'rt, to'rtga bo'lingan: minus bir.", 'Да. Минус четыре, делённое на четыре: минус один.', 'Yes. Minus four, divided by four: minus one.'),
        items: [
          { id: 'a', right: true, label: '−1' },
          { id: 'b', label: '1', hint: L("Maxrajni tekshiring: ikki karra a, ya'ni ikki karra ikki, to'rt bo'ladi, ikki emas.", 'Проверь знаменатель: два, умноженное на a, то есть на два, даёт четыре, а не два.', 'Check the denominator: two times a, that is two times two, gives four, not two.') },
        ],
        solution: ['a = 2, b = 4', 'x0 = −4 / 4', 'x0 = −1'],
      },
      {
        expr: 'y = −x² + 8x',
        question: L('x0 nechiga teng?', 'Чему равен x0?', 'What does x0 equal?'),
        ok: L("Ha. Minus sakkiz, minus ikkiga bo'lingan: to'rt.", 'Да. Минус восемь, делённое на минус два: четыре.', 'Yes. Minus eight, divided by minus two: four.'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '−4', hint: L("A manfiy ekanini unutmang: minus sakkiz minus ikkiga bo'linsa, natija musbat chiqadi.", 'Не забудь, что a отрицательно: минус восемь, делённое на минус два, даёт положительный результат.', 'Do not forget a is negative: minus eight divided by minus two gives a positive result.') },
        ],
        solution: ['a = −1, b = 8', 'x0 = −8 / (−2)', 'x0 = 4'],
      },
      {
        expr: 'y = x² − 5',
        question: L('x0 nechiga teng?', 'Чему равен x0?', 'What does x0 equal?'),
        ok: L("Ha. B nolga teng bo'lgani uchun x0 ham nolga teng.", 'Да. Так как b равно нулю, x0 тоже равен нулю.', 'Yes. Since b equals zero, x0 equals zero too.'),
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: '5', hint: L("Bu yerda x oldida hech qanday son yozilmagan, demak b nolga teng.", 'Здесь перед x вообще нет числа, значит b равно нулю.', 'There is no number in front of x here at all, so b equals zero.') },
        ],
        solution: ['a = 1, b = 0', 'x0 = 0 / 2', 'x0 = 0'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — YO'NALTIRILGAN: y = x² − 2x − 3 uchun to'liq uchi.
// ============================================================
const S10 = {
  eyebrow: L('QADAMLAB', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L(
    "To'liq uchini topish: uch qadam",
    'Находим вершину полностью: три шага',
    'Finding the full vertex: three steps',
  ),
  audio: [
    A('mount',
      "Bitta funksiya, uch qadam. Yordam yo'q, lekin har javobdan keyin yechim ochiladi.",
      'Одна функция, три шага. Помощи нет, но после каждого ответа откроется решение.',
      'One function, three steps. No help, but after each answer the solution opens.'),
    A('why',
      "Avval x0 ni toping, keyin y0 ni, oxirida ikkalasini birga yozing.",
      'Сначала найди x0, потом y0, в конце запиши их вместе.',
      'First find x0, then y0, finally write them together.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uch qadam ham to'ldi: x0 topildi, y0 topildi, ikkalasi birlashtirildi. Shu yo'l har qanday funksiyada ishlaydi.",
      'Все три шага пройдены: найден x0, найден y0, оба объединены. Этот путь работает для любой функции.',
      'All three steps are done: x0 found, y0 found, both combined. This path works for any function.',
    ),
    tasks: [
      {
        expr: 'y = x² − 2x − 3',
        question: L('x0 nechiga teng?', 'Чему равен x0?', 'What does x0 equal?'),
        ok: L("Ha. Minus minus ikki, ikkiga bo'lingan: bir.", 'Да. Минус минус два, делённое на два: один.', 'Yes. Minus minus two, divided by two: one.'),
        items: [
          { id: 'a', right: true, label: '1' },
          { id: 'b', label: '−1', hint: L("A va b larni o'qing: a bir, b minus ikki. Formulaga qo'ying va ishorani kuzating.", 'Прочитай a и b: a равно единице, b равно минус двум. Подставь в формулу и следи за знаком.', 'Read a and b: a is one, b is minus two. Substitute into the formula and watch the sign.') },
        ],
        solution: ['a = 1, b = −2', 'x0 = 2 / 2', 'x0 = 1'],
      },
      {
        expr: 'y = x² − 2x − 3',
        question: L('y0 nechiga teng?', 'Чему равен y0?', 'What does y0 equal?'),
        ok: L("Ha. Birni formulaga qo'ysak: bir minus ikki minus uch, natija minus to'rt.", 'Да. Подставив единицу в формулу: один минус два минус три, результат минус четыре.', 'Yes. Substituting one into the formula: one minus two minus three, the result is minus four.'),
        items: [
          { id: 'a', right: true, label: '−4' },
          { id: 'b', label: '−3', hint: L("Butun formulaga birni qo'ying, faqat oxirgi hadga emas: bir kvadrat minus ikki karra bir minus uch.", 'Подставь единицу во всю формулу, а не только в последнее слагаемое: единица в квадрате минус два, умноженное на единицу, минус три.', 'Substitute one into the whole formula, not just the last term: one squared minus two times one minus three.') },
        ],
        solution: ['y0 = 1² − 2 · 1 − 3', 'y0 = 1 − 2 − 3', 'y0 = −4'],
      },
      {
        expr: 'y = x² − 2x − 3',
        question: L("Uchining to'liq koordinatalari?", 'Полные координаты вершины?', 'The full coordinates of the vertex?'),
        ok: L("Ha. Bir, minus to'rt.", 'Да. Один, минус четыре.', 'Yes. One, minus four.'),
        items: [
          { id: 'a', right: true, label: '(1; −4)' },
          { id: 'b', label: '(−4; 1)', hint: L("Tartib: avval x0, keyin y0. X0 bir edi, y0 minus to'rt edi.", 'Порядок: сначала x0, потом y0. x0 было один, y0 было минус четыре.', 'Order: x0 first, then y0. x0 was one, y0 was minus four.') },
        ],
        solution: ['x0 = 1, y0 = −4', "Uchi: (1; −4)"],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Faqat hisob: uchi, o'qi yoki nol",
    'Только счёт: вершина, ось или нуль',
    'Just computation: the vertex, the axis, or a zero',
  ),
  audio: [
    A('mount',
      "Bu safar chizma yo'q. Har savolda son berilgan, siz uni formulaga qo'yib hisoblaysiz.",
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
      "Uchtasi ham hisoblandi: uchining abssissasi, simmetriya o'qi va nol borligi. Har biri bir xil formuladan chiqdi.",
      'Все три посчитаны: абсцисса вершины, ось симметрии и наличие нуля. Каждый вышел из одной и той же формулы.',
      'All three are computed: the x-coordinate of the vertex, the axis of symmetry, whether a zero exists. Each came from the same formula.',
    ),
    tasks: [
      {
        expr: 'y = 3x² − 12x + 7',
        question: L("Uchining abssissasi qanchaga teng?", 'Чему равна абсцисса вершины?', "What is the vertex's x-coordinate?"),
        ok: L("Ha. Minus minus o'n ikki, oltiga bo'lingan: ikki.", 'Да. Минус минус двенадцать, делённое на шесть: два.', 'Yes. Minus minus twelve, divided by six: two.'),
        items: [
          { id: 'a', right: true, label: '2' },
          { id: 'b', label: '4', hint: L("Maxrajni tekshiring: ikki karra a, ya'ni ikki karra uch, olti bo'ladi, ikki emas.", 'Проверь знаменатель: два, умноженное на a, то есть на три, даёт шесть, а не два.', 'Check the denominator: two times a, that is two times three, gives six, not two.') },
        ],
        solution: ['a = 3, b = −12', 'x0 = 12 / 6', 'x0 = 2'],
      },
      {
        expr: 'y = −2x² + 4x + 1',
        question: L("Simmetriya o'qi qaysi to'g'ri chiziq?", 'Какая прямая является осью симметрии?', 'Which line is the axis of symmetry?'),
        ok: L("Ha. X0 bir bo'lgani uchun, simmetriya o'qi x teng bir.", 'Да. Так как x0 равен единице, ось симметрии x равно единице.', 'Yes. Since x0 equals one, the axis of symmetry is x equals one.'),
        items: [
          { id: 'a', right: true, label: 'x = 1' },
          { id: 'b', label: 'y = 1', hint: L("Simmetriya o'qi doim tik chiziq, x harfi songa teng ko'rinishda yoziladi, y emas.", 'Ось симметрии всегда вертикальная линия, записывается как x равно числу, а не y.', 'The axis of symmetry is always a vertical line, written as x equals a number, not y.') },
        ],
        solution: ['x0 = −4 / (−4)', 'x0 = 1', 'Simmetriya o\'qi: x = 1'],
      },
      {
        expr: 'y = x² + 6x + 9',
        question: L("Bu funksiyaning nechta noli bor: bitta, ikkita yoki nolta?", 'Сколько у этой функции нулей: один, два или ни одного?', 'How many zeros does this function have: one, two, or none?'),
        ok: L("Bitta. Uchi Ox o'qining ustida turibdi, shuning uchun grafik uni faqat bir marta, aynan uchida kesib o'tadi.", 'Один. Вершина лежит прямо на оси Ox, поэтому график касается её только один раз, ровно в вершине.', 'One. The vertex lies exactly on the Ox axis, so the graph touches it only once, right at the vertex.'),
        items: [
          { id: 'a', label: L('Ikkita', 'Два', 'Two'), hint: L("Uchining ordinatasini hisoblang: u nolga teng chiqadi. Uchi Ox ning ustida bo'lsa, kesishish bitta bo'ladi.", 'Посчитай ординату вершины: она получится равной нулю. Если вершина на оси Ox, пересечение одно.', "Compute the vertex's y-coordinate: it comes out zero. If the vertex is on Ox, there is one crossing.") },
          { id: 'b', right: true, label: L('Bitta', 'Один', 'One') },
          { id: 'c', label: L('Nolta', "Ни одного", 'None') },
        ],
        solution: ['x0 = −6 / 2 = −3', 'y0 = 9 − 18 + 9 = 0', "Uchi Ox da, nol bitta"],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Madinaning "yechimida" qo'shimcha nuqtalar
// uchiga nisbatan simmetrik olinmagan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Simmetrik bo'lmagan nuqtalar",
    'Точки не симметричны',
    'Points that are not symmetric',
  ),
  audio: [
    A('mount',
      "Madinaning yechimi. X kvadrat minus to'rt x qo'shi uch uchun uchi topilgan, endi u ikkita qo'shimcha nuqta tanladi.",
      'Решение Мадины. Для функции x в квадрате минус четыре икс плюс три вершина найдена, теперь она выбрала две дополнительные точки.',
      "Madina's solution. For the function x squared minus four x plus three the vertex is found, now she chose two extra points."),
    A('why',
      "Uning tanlovini o'qing va uchi ikkiga tengligini eslab, o'zingiz tekshiring.",
      'Прочитай её выбор и, помня, что вершина в двух, проверь сама.',
      'Read her choice and, remembering the vertex is at two, check it yourself.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Qo'shimcha nuqtalar tasodifiy tanlanmaydi: ular uchiga nisbatan bir xil masofada, ikki tarafda turishi kerak.",
      'Дополнительные точки выбирают не случайно: они должны стоять на одинаковом расстоянии от вершины, по обе стороны.',
      'Extra points are not chosen at random: they must stand at equal distance from the vertex, on both sides.',
    ),
    tasks: [
      {
        expr: 'y = x² − 4x + 3, x0 = 2',
        question: L(
          "Madina x uch va x beshni tanladi (ikkalasi ham uchidan o'ngda). Bu tanlov nega noto'g'ri?",
          'Мадина выбрала x равным трём и x равным пяти (обе справа от вершины). Почему этот выбор неверен?',
          'Madina chose x equal to three and x equal to five (both to the right of the vertex). Why is this choice wrong?',
        ),
        ok: L(
          "Ha. Ikkalasi ham bir tarafda: ular grafikning faqat o'ng tarmog'ini ko'rsatadi, chap tarmoq haqida hech narsa aytmaydi.",
          'Да. Обе точки с одной стороны: они показывают только правую ветвь графика и ничего не говорят о левой.',
          'Yes. Both points are on the same side: they show only the right branch of the graph and say nothing about the left one.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Ikkalasi ham uchidan bir tarafda, chap tarmoq ko'rinmay qoladi", 'Обе точки с одной стороны от вершины, левая ветвь остаётся невидна', 'Both points are on the same side of the vertex, the left branch stays unseen'),
          },
          {
            id: 'b',
            label: L("y qiymatlarini hisoblashda xato bor", 'Ошибка в вычислении значений y', 'There is a mistake in computing the y values'),
            hint: L("Hisob to'g'ri bo'lishi mumkin, muammo qaysi x lar tanlanganida.", 'Счёт может быть верным, проблема в том, какие x выбраны.', 'The computation may be correct, the problem is which x were chosen.'),
          },
          {
            id: 'c',
            label: L("Uchdan boshlash umuman mumkin emas", 'С трёх начинать вообще нельзя', 'You cannot start from three at all'),
            hint: L("Uchning o'zi yaxshi boshlanish nuqtasi, muammo ikkinchi nuqtada: u ham o'ng tarafda tanlangan.", 'Тройка сама по себе хорошая отправная точка, проблема во второй точке: она тоже выбрана справа.', 'Three itself is a fine starting point, the problem is the second point: it too was chosen on the right.'),
          },
        ],
        solution: [
          "To'g'ri juftlik: x1 va x2 uchidan bir xil masofada, ikki tarafda",
          'Masalan, x = 0 va x = 4 (ikkalasi ham uchidan ikki birlik uzoqlikda)',
          'y(0) = 3, y(4) = 3',
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TESKARI TOPSHIRIQ.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI', 'ОБРАТНОЕ', 'THE REVERSE'),
  title: L(
    "Uchidan formulaga",
    'От вершины к формуле',
    'From the vertex to the formula',
  ),
  audio: [
    A('mount',
      "Bu safar boshqa tomondan: uchining joyi berilgan, formulani siz tanlaysiz.",
      'На этот раз наоборот: дано место вершины, а формулу выбираешь ты.',
      'This time it is the other way round: the vertex is given, you choose the formula.'),
    A('why',
      "Har bir nomzodda x0 ni hisoblang va berilgan songa mos kelishini tekshiring.",
      'В каждом кандидате вычисли x0 и проверь совпадение с данным числом.',
      'In each candidate, compute x0 and check whether it matches the given number.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: uchining joyidan orqaga qaytib, mos formulani tanlash ham xuddi shu formulaga tayanadi.",
      'Найдено: путь от места вершины назад к формуле опирается на ту же самую формулу.',
      'Found: going backward from the vertex to the formula relies on the same formula.',
    ),
    tasks: [
      {
        expr: 'x0 = 3',
        question: L(
          "Uchining abssissasi uchga teng bo'lishi kerak. Qaysi formula mos keladi?",
          'Абсцисса вершины должна быть равна трём. Какая формула подходит?',
          "The vertex's x-coordinate must equal three. Which formula fits?",
        ),
        ok: L("Ha. Minus minus olti, ikkiga bo'lingan: uch.", 'Да. Минус минус шесть, делённое на два: три.', 'Yes. Minus minus six, divided by two: three.'),
        items: [
          { id: 'a', right: true, label: 'y = x² − 6x + 1' },
          { id: 'b', label: 'y = x² + 6x + 1', hint: L("Bu yerda b musbat oltiga teng: x0 minus uch bo'lib chiqadi, uch emas.", 'Здесь b равно плюс шести: x0 получится минус три, а не три.', 'Here b equals plus six: x0 comes out minus three, not three.') },
          { id: 'c', label: 'y = 2x² − 6x + 1', hint: L("Maxrajni tekshiring: ikki karra a, ya'ni ikki karra ikki, to'rt bo'ladi. Uch chiqmaydi.", 'Проверь знаменатель: два, умноженное на a, то есть на два, даёт четыре. Тройка не получится.', 'Check the denominator: two times a, that is two times two, gives four. Three will not come out.') },
        ],
        solution: ['a = 1, b = −6', 'x0 = 6 / 2 = 3', 'y = x² − 6x + 1 mos keladi'],
      },
      {
        expr: 'x0 = −1',
        question: L(
          "Uchining abssissasi minus birga teng bo'lishi kerak. Qaysi formula mos keladi?",
          'Абсцисса вершины должна быть равна минус единице. Какая формула подходит?',
          "The vertex's x-coordinate must equal minus one. Which formula fits?",
        ),
        ok: L("Ha. Minus to'rt, to'rtga bo'lingan: minus bir.", 'Да. Минус четыре, делённое на четыре: минус один.', 'Yes. Minus four, divided by four: minus one.'),
        items: [
          { id: 'a', right: true, label: 'y = 2x² + 4x − 5' },
          { id: 'b', label: 'y = 2x² − 4x − 5', hint: L("Bu yerda b manfiy: x0 musbat bir bo'lib chiqadi, minus bir emas.", 'Здесь b отрицательно: x0 получится плюс один, а не минус один.', 'Here b is negative: x0 comes out plus one, not minus one.') },
          { id: 'c', label: 'y = x² + 4x − 5', hint: L("Maxrajni tekshiring: ikki karra a, ya'ni ikki karra bir, ikki bo'ladi. Minus bir chiqmaydi.", 'Проверь знаменатель: два, умноженное на a, то есть на единицу, даёт два. Минус один не получится.', 'Check the denominator: two times a, that is two times one, gives two. Minus one will not come out.') },
        ],
        solution: ['a = 2, b = 4', 'x0 = −4 / 4 = −1', 'y = 2x² + 4x − 5 mos keladi'],
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
    "Blits: uchi, o'qi, nollar, qurish",
    'Блиц: вершина, ось, нули, построение',
    'Blitz: the vertex, the axis, the zeros, construction',
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
        tag: 'x0-formula-belgisi',
        ask: L(
          "y teng x kvadrat qo'shi olti x. B musbat oltiga teng. X0 ishorasi qanday bo'ladi?",
          'y равен x в квадрате плюс шесть икс. B равно плюс шести. Каким будет знак x0?',
          'y equals x squared plus six x. B equals plus six. What sign will x0 have?',
        ),
        options: [
          { id: 'neg', right: true, label: L('Manfiy', 'Отрицательным', 'Negative') },
          { id: 'pos', label: L('Musbat', 'Положительным', 'Positive') },
        ],
        ok: L(
          "To'g'ri. Formulada b oldida minus turadi: musbat b manfiy x0 beradi.",
          'Верно. В формуле перед b стоит минус: положительное b даёт отрицательный x0.',
          'Correct. The formula has a minus in front of b: a positive b gives a negative x0.',
        ),
        hint: L(
          "Formulani eslang: minus b, ikkiga bo'lingan. B musbat bo'lsa, minus uni manfiy qiladi.",
          'Вспомни формулу: минус b, делённое на два. Если b положительно, минус делает его отрицательным.',
          'Recall the formula: minus b, over two. If b is positive, the minus makes it negative.',
        ),
      },
      {
        id: 'q2',
        tag: 'simmetriya-oqi-vertikal',
        ask: L(
          "Simmetriya o'qi Ox o'qining o'zimi?",
          'Ось симметрии — это сама ось Ox?',
          'Is the axis of symmetry the Ox axis itself?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Simmetriya o'qi uchidan o'tuvchi tik chiziq, Ox esa har doim y nolga teng bo'lgan chiziq.",
          'Верно. Ось симметрии это вертикальная линия через вершину, а Ox это всегда линия, где y равен нулю.',
          'Correct. The axis of symmetry is the vertical line through the vertex, while Ox is always the line where y equals zero.',
        ),
        hint: L(
          "Ox butun rasm uchun bitta, uchi esa har funksiyada boshqa joyda. Ular faqat uchi Ox da yotganda mos keladi.",
          'Ox одна для всего рисунка, а вершина у каждой функции в своём месте. Они совпадают только если вершина лежит на Ox.',
          'Ox is one for the whole picture, while the vertex sits in a different place for each function. They coincide only when the vertex lies on Ox.',
        ),
      },
      {
        id: 'q3',
        tag: 'nollarsiz-grafik',
        ask: L(
          "Faqat uchini bilib, parabolaning kengligini chizib bo'ladimi?",
          'Зная только вершину, можно ли начертить ширину параболы?',
          'Knowing only the vertex, can you draw the width of the parabola?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, yana nuqtalar kerak", 'Нет, нужны ещё точки', 'No, more points are needed') },
          { id: 'yes', label: L('Ha, uchi yetarli', 'Да, вершины достаточно', 'Yes, the vertex is enough') },
        ],
        ok: L(
          "To'g'ri. Uchi faqat bitta nuqta, kenglikni ko'rsatish uchun yana kamida ikkita nuqta kerak.",
          'Верно. Вершина это только одна точка, для ширины нужно ещё как минимум две точки.',
          'Correct. The vertex is only one point, showing the width needs at least two more points.',
        ),
        hint: L(
          "5-darsning algoritmini eslang: uchidan tashqari nollar va yana ikkita nuqta ham kerak edi.",
          'Вспомни алгоритм 5 параграфа: кроме вершины нужны были ещё нули и две дополнительные точки.',
          'Recall the algorithm from section 5: besides the vertex, the zeros and two more points were also needed.',
        ),
      },
      {
        id: 'q4',
        tag: 'nosimmetrik-nuqtalar',
        ask: L(
          "Qo'shimcha ikkita nuqtani ixtiyoriy tanlash mumkinmi?",
          'Можно ли выбрать две дополнительные точки произвольно?',
          'Can the two extra points be chosen arbitrarily?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, uchiga nisbatan simmetrik bo'lishi kerak", 'Нет, они должны быть симметричны относительно вершины', 'No, they must be symmetric about the vertex') },
          { id: 'yes', label: L('Ha, ixtiyoriy', 'Да, произвольно', 'Yes, arbitrarily') },
        ],
        ok: L(
          "To'g'ri. Simmetrik bo'lmasa, grafikning faqat bir tarafi ko'rinadi, ikkinchi tarmoq qorong'ida qoladi.",
          'Верно. Если они не симметричны, видна только одна сторона графика, а вторая ветвь остаётся неизвестной.',
          'Correct. If they are not symmetric, only one side of the graph is seen, and the other branch stays unknown.',
        ),
        hint: L(
          "Ikkalasi ham uchidan bir tomonda bo'lsa, ikkinchi tarmoq haqida hech narsa bilmay qolasiz.",
          'Если обе точки с одной стороны от вершины, о второй ветви ничего не узнаешь.',
          'If both points are on the same side of the vertex, you learn nothing about the other branch.',
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN.
// ============================================================
const FIN_SC = scaleOf({ from: -0.5, to: 4.5, yFrom: -1.5, yTo: 4.5 })
// eslint-disable-next-line react-refresh/only-export-components
const FinalScene = () => {
  const t = useT()
  return (
    <div className="g9-scene-plain g8-scene-final">
      <Plane sc={FIN_SC} xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}>
        <g className="g9-real"><path d={pathOf(MAIN_F, FIN_SC)} /></g>
        <line x1={FIN_SC.px(2)} y1={FIN_SC.top} x2={FIN_SC.px(2)} y2={FIN_SC.bottom}
          stroke={T.tip} strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx={FIN_SC.px(2)} cy={FIN_SC.py(-1)} r="3.6" fill={T.accent} />
        <circle cx={FIN_SC.px(1)} cy={FIN_SC.py(0)} r="3" fill={T.ok} />
        <circle cx={FIN_SC.px(3)} cy={FIN_SC.py(0)} r="3" fill={T.ok} />
        <text x={FIN_SC.px(2.15)} y={FIN_SC.top + 9}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="9" fill={T.tip}>
          {t(L("simmetriya o'qi", 'ось симметрии', 'axis of symmetry'))}
        </text>
      </Plane>
    </div>
  )
}

const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Parabola: uchi, o'qi, nollari",
    'Парабола: вершина, ось, нули',
    'The parabola: vertex, axis, zeros',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda yangi uchi qayerda turishini formula bilan bilib bo'lishini taxmin qildingiz. Endi rasmda hammasi yig'ilgan.",
      'На первом экране ты предположил, что новую вершину можно узнать по формуле. Теперь на рисунке всё собрано.',
      'On the first screen you guessed that the new vertex could be known by formula. Now the picture has it all assembled.'),
    A('s1',
      "Bugun siz uchini formula bilan topishni, simmetriya o'qini va to'liq qurish algoritmini o'rgandingiz.",
      'Сегодня освоены нахождение вершины по формуле, ось симметрии и полный алгоритм построения.',
      'Today you learned finding the vertex by formula, the axis of symmetry, and the full construction algorithm.'),
    A('s2',
      "Keyingi darsda grafiklarni ko'chirish: chapga, o'ngga, yuqoriga, pastga siljitish qoidalari.",
      'В следующем уроке перенос графиков: правила сдвига влево, вправо, вверх, вниз.',
      'The next lesson covers transforming graphs: the rules for shifting left, right, up, down.'),
  ],
  props: {
    mark: 'x0 = −b/2a',
    markNote: L(
      "uchining formulasi",
      'формула вершины',
      "the vertex's formula",
    ),
    lines: [
      L(
        "Simmetriya o'qi uchidan o'tuvchi tik chiziq",
        'Ось симметрии — вертикальная линия через вершину',
        'The axis of symmetry is a vertical line through the vertex',
      ),
      STATEMENTS[2],
      L(
        "Qo'shimcha nuqtalar uchiga nisbatan simmetrik bo'lishi shart",
        'Дополнительные точки обязаны быть симметричны относительно вершины',
        'The extra points must be symmetric about the vertex',
      ),
    ],
    bridge: L(
      'Keyingi dars: grafiklarni ko\'chirish',
      'Следующий урок: перенос графиков',
      'Next lesson: transforming graphs',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', scene: <HookScene/>, ...S1 },
  { role: 'support',  tag: 'nollarsiz-grafik', ...S2 },
  { role: 'explain',  tag: 'x0-formula-belgisi', ...S3 },
  { role: 'explain',  tag: 'x0-formula-belgisi', ...S4 },
  { role: 'explain',  tag: 'simmetriya-oqi-vertikal', ...S5 },
  { role: 'explain',  tag: 'nollarsiz-grafik', ...S6 },
  { role: 'explain',  tag: 'nosimmetrik-nuqtalar', ...S7 },
  { role: 'rule',     tag: 'nollarsiz-grafik', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'x0-formula-belgisi', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'x0-formula-belgisi', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'simmetriya-oqi-vertikal', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'nosimmetrik-nuqtalar', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'x0-formula-belgisi', ...S13 },
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
export default makeLesson({ META, STATEMENTS, MISS, SCREENS, styles: G9_STYLES, recolor: G9_RECOLOR })
