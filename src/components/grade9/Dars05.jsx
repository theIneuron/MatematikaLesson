// ============================================================================
// 9-sinf, Dars 5. GRAFIKLARNI KO'CHIRISH.
//
// REDAKSIYA 1, 2026-08-27. Darslikdan: 4-§ «Funksiya y = ax² + bx + c»
// (14-16-bet, RU/UZ), aynan darslikning o'z rivoji: y = x², y = (x−1)²,
// y = (x−1)²+2 (Zadacha 1, Rис. 9-12) va umumiy qoida (15-bet oxiri):
// y = a(x−x0)²+y0 parabolasi y = ax² dan Ox bo'ylab x0 ga, Oy bo'ylab y0
// ga siljitilgan. Alohida parametr yo'q, o'z misolimiz: y = (x−2)²+1.
//
// TEGLAR (o'zining):
//   ishora-teskari-siljish     — qavs ichidagi minusni "chapga" deb o'ylash,
//                                aslida x0 > 0 bo'lsa siljish O'NGGA
//   gorizontal-vertikal-almashinish — qavs ichidagi son (Ox bo'ylab) bilan
//                                qavsdan tashqaridagi son (Oy bo'ylab) ni
//                                aralashtirish
//   uchi-notogri-oqish         — y = a(x−x0)²+y0 dan uchini (−x0; y0) yoki
//                                (x0; −y0) deb noto'g'ri o'qish
//   a-joyni-ozgartirmaydi      — a koeffitsienti (3-darsdan) shaklni emas,
//                                JOYNI o'zgartiradi deb o'ylash
//
// ASBOBLAR: yangisi yo'q. RecallMC/RuleScreen (Dars01-04dan tanish) va
// YIG'ISH uchun `Trace` (Dars01, Dars04dan) — besh nuqtani birma-bir
// joylashtirib, siljigan parabolani ULARDAN yig'ib chiqaradi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, T, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, Plane, RecallMC, Trace, pathOf, scaleOf } from './asboblar.jsx'

export const META = {
  id: 'grade9-05',
  n: 5,
  row: 5,
  block: 'Б1',
  topic: L("Grafiklarni ko'chirish", 'Перенос графиков', 'Shifting graphs'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Y teng x minus x nol butun kvadrat qo'shi y nol parabolasi, y teng a x kvadrat parabolasidan Ox bo'ylab x nolga, Oy bo'ylab y nolga siljitilgan",
    'График y равно a, умноженному на x минус x нуль в квадрате, плюс y нуль, это парабола y равно a икс в квадрате, сдвинутая вдоль Ox на x нуль и вдоль Oy на y нуль',
    'The graph of y equals a times x minus x zero squared plus y zero is the parabola y equals a x squared, shifted along Ox by x zero and along Oy by y zero',
  ),
  L(
    "Qavs ichidagi son ishorasi teskari ishlaydi: minus x nol bo'lsa siljish o'ngga, plyus x nol bo'lsa siljish chapga",
    'Число внутри скобки работает с обратным знаком: минус x нуль даёт сдвиг вправо, плюс x нуль даёт сдвиг влево',
    'The number inside the parentheses works with a reversed sign: minus x zero gives a shift to the right, plus x zero gives a shift to the left',
  ),
  L(
    "A koeffitsienti faqat shaklni o'zgartiradi, cho'zadi, siqadi yoki aylantiradi, joyni esa hech qachon",
    'Коэффициент a меняет только форму, растягивает, сжимает или переворачивает, а место никогда',
    'The coefficient a changes only the shape, stretching, compressing, or flipping it, but never the position',
  ),
]

export const MISS = {
  'ishora-teskari-siljish': {
    what: L(
      "qavs ichidagi minus ishorasi chapga siljish deb o'ylandi",
      'знак минус внутри скобки принят за сдвиг влево',
      'the minus sign inside the parentheses was taken to mean a shift to the left',
    ),
    wrong: null,
    at: 0,
  },
  'gorizontal-vertikal-almashinish': {
    what: L(
      "qavs ichidagi son bilan qavsdan tashqaridagi son aralashtirildi",
      'число внутри скобки перепутано с числом снаружи скобки',
      'the number inside the parentheses was confused with the number outside it',
    ),
    wrong: null,
    at: 0,
  },
  'uchi-notogri-oqish': {
    what: L(
      "uchining koordinatalari formuladan ishorasi bilan noto'g'ri o'qildi",
      'координаты вершины прочитаны из формулы с неверным знаком',
      "the vertex's coordinates were read from the formula with the wrong sign",
    ),
    wrong: null,
    at: 0,
  },
  'a-joyni-ozgartirmaydi': {
    what: L(
      "a koeffitsienti parabolaning joyini ham o'zgartiradi deb o'ylandi",
      'предполагалось, что коэффициент a меняет и положение параболы',
      'it was assumed that the coefficient a also changes the position of the parabola',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// DARSNING FUNKSIYASI: y = (x − 2)² + 1. Uchi (2; 1), y = x² dan
// o'ngga ikki, yuqoriga bir siljigan.
// ============================================================
// eslint-disable-next-line react-refresh/only-export-components
const MAIN_F = (x) => (x - 2) * (x - 2) + 1
// eslint-disable-next-line react-refresh/only-export-components
const QUAD = (x) => x * x

const HOOK_SC = scaleOf({ from: -1.5, to: 5.5, yFrom: -0.5, yTo: 8.5 })
// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <div className="g9-scene-plain" aria-hidden="false">
      <Plane sc={HOOK_SC} xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}>
        <g className="g9-real"><path d={pathOf(QUAD, HOOK_SC)} /></g>
        <g className="g9-real"><path d={pathOf(MAIN_F, HOOK_SC)} stroke={T.accent} /></g>
        <circle cx={HOOK_SC.px(2)} cy={HOOK_SC.py(1)} r="4" fill={T.accent} />
        <text x={HOOK_SC.px(-1.3)} y={HOOK_SC.py(QUAD(2.2))}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fill={T.ink2}>
          {t(L('y teng x kvadratga', 'y равен x в квадрате', 'y equals x squared'))}
        </text>
        <text x={HOOK_SC.px(2.3)} y={HOOK_SC.py(1) + 16}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fill={T.accent}>
          {t(L('bu qayerga ketdi', 'а это куда уехало', 'this one, where did it go'))}
        </text>
      </Plane>
    </div>
  )
}

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('YANGI JOY', 'НОВОЕ МЕСТО', 'A NEW PLACE'),
  title: L(
    "Formula parabolani qayerga ko'chirganini his qilamiz",
    'Чувствуем, куда формула переместила параболу',
    'Sensing where the formula has moved the parabola',
  ),
  audio: [
    A('mount',
      "Kulrang parabola y teng x kvadrat, tanish. Rangli parabola esa y teng x minus ikki butun kvadrat qo'shi bir formulasidan.",
      'Серая парабола, y равен x в квадрате, знакома. Цветная парабола из формулы y равен x минус два в квадрате плюс один.',
      'The gray parabola, y equals x squared, is familiar. The colored parabola comes from the formula y equals x minus two squared plus one.'),
    A('why',
      "Formulada minus ikki turibdi. Lekin rangli parabola aynan qaysi tomonga ko'chgan, chapgami yoki o'ngga?",
      'В формуле стоит минус два. Но в какую сторону на самом деле переместилась цветная парабола, влево или вправо?',
      'The formula has a minus two. But which way has the colored parabola actually moved, left or right?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Minus ikki bor. Parabola qaysi tomonga ko'chgan?",
      'В формуле минус два. Куда переместилась парабола?',
      'The formula has minus two. Which way did it move?',
    ),
    items: [
      {
        id: 'left',
        show: L('Chapga, chunki minus bor', 'Влево, ведь стоит минус', 'Left, because of the minus'),
        hint: L(
          "Aslida teskari: rasmga qarang, uchi o'ngda turibdi. Minus belgisi bu yerda o'ngga siljishni beradi.",
          'На самом деле наоборот: посмотри на рисунок, вершина стоит справа. Здесь знак минус даёт сдвиг вправо.',
          'Actually the opposite: look at the picture, the vertex stands on the right. Here the minus sign gives a shift to the right.',
        ),
      },
      { id: 'right', right: true, show: L("O'ngga va yuqoriga", 'Вправо и вверх', 'Right and up') },
      {
        id: 'up-only',
        show: L('Faqat yuqoriga', 'Только вверх', 'Only up'),
        hint: L(
          "Uchining x koordinatasiga qarang: u nolda emas, ikkida turibdi. Demak gorizontal siljish ham bor.",
          'Посмотри на x-координату вершины: она не в нуле, а в двух. Значит есть и горизонтальный сдвиг.',
          "Look at the vertex's x-coordinate: it is not at zero, it is at two. So there is a horizontal shift too.",
        ),
      },
      {
        id: 'none',
        show: L("Joyi o'zgarmagan", 'Место не изменилось', "The position hasn't changed"),
        hint: L(
          "Uchi rasmda aniq boshqa nuqtada turibdi, koordinatalar boshida emas. Joy o'zgargan.",
          'На рисунке вершина явно стоит в другой точке, а не в начале координат. Место изменилось.',
          'In the picture the vertex clearly stands at a different point, not at the origin. The position has changed.',
        ),
      },
    ],
    after: L(
      "To'g'ri yo'nalishni bugun isbotlab chiqamiz. Formula ichidagi minus belgisi ko'zga ko'ringan tomondan farq qiladi.",
      'Верное направление сегодня докажем шаг за шагом. Знак минус внутри формулы работает не так, как кажется на глаз.',
      'We prove the correct direction step by step today. The minus sign inside the formula does not work the way it looks at first glance.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — 3-darsdan tanish: a shaklni o'zgartiradi, joyni emas.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "A koeffitsientini eslash",
    'Вспоминаем коэффициент a',
    'Recalling the coefficient a',
  ),
  audio: [
    A('mount',
      "3-darsda a koeffitsienti nima qilishini ko'rgan edingiz: cho'zish, siqish yoki Ox atrofida aylantirish.",
      'На 3 уроке ты видел, что делает коэффициент a: растягивает, сжимает или переворачивает вокруг Ox.',
      'In lesson 3 you saw what the coefficient a does: it stretches, compresses, or flips around Ox.'),
    A('why',
      "Bugungi savol: a koeffitsienti parabolaning turgan JOYINI ham o'zgartiradimi?",
      'Сегодняшний вопрос: меняет ли коэффициент a ещё и МЕСТО, где стоит парабола?',
      "Today's question: does the coefficient a also change the PLACE where the parabola stands?"),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "A koeffitsienti (masalan, ikki karra x kvadrat) parabolaning uchi turgan joyini ham ko'chiradimi?",
        'Коэффициент a (например, два, умноженное на x в квадрате) переносит ли ещё и место, где стоит вершина параболы?',
        "Does the coefficient a (for example, two times x squared) also move the place where the parabola's vertex stands?",
      )}
      cols={1}
      items={[
        { id: 'no', right: true, label: L("Yo'q, uchi hamon koordinatalar boshida qoladi", 'Нет, вершина остаётся в начале координат', 'No, the vertex stays at the origin') },
        {
          id: 'yes',
          label: L('Ha, a katta bo\'lsa uchi ham ko\'chadi', 'Да, при большом a вершина тоже смещается', 'Yes, for a large a the vertex shifts too'),
          hint: L(
            "3-darsda y teng ikki x kvadratning uchi ham nolda edi, xuddi y teng x kvadratdagidek. A faqat tarmoqlarni torroq qildi.",
            'На 3 уроке вершина y равно два икс в квадрате тоже была в нуле, как и у y равно x в квадрате. A только сузил ветви.',
            'In lesson 3 the vertex of y equals two x squared was also at zero, just like for y equals x squared. A only made the branches narrower.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Joyni boshqa ikkita son o'zgartiradi, buni bugun aynan shu darsda ko'ramiz.",
        'Верно. Место меняют два других числа, их мы и разберём сегодня.',
        'Correct. The place is changed by two other numbers, and that is exactly what we work out today.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — GORIZONTAL SILJISH. y=(x−2)² vs y=x²,
// darslikning o'z rivoji (14-bet): nuqta ko'chishi bilan isbot.
// ============================================================
const S3 = {
  eyebrow: L('GORIZONTAL SILJISH', 'ГОРИЗОНТАЛЬНЫЙ СДВИГ', 'HORIZONTAL SHIFT'),
  title: L(
    "Nega minus ikki o'ngga suradi",
    'Почему минус два двигает вправо',
    'Why minus two moves it to the right',
  ),
  audio: [
    A('mount',
      "y teng x kvadratda nuqta bir, bir turibdi. Xuddi shu balandlikni y teng x minus ikki butun kvadratda qaysi x beradi?",
      'В y равно x в квадрате есть точка один, один. Какой x в y равно x минус два в квадрате даёт ту же высоту?',
      'In y equals x squared there is the point one, one. Which x in y equals x minus two squared gives the same height?'),
    A('why',
      "X minus ikki bir bo'lishi uchun, x ning o'zi uch bo'lishi kerak. Nuqta bir dan uchga ko'chdi, ya'ni o'ngga.",
      'Чтобы x минус два было равно единице, сам x должен быть равен трём. Точка переехала из одного в три, то есть вправо.',
      'For x minus two to equal one, x itself must equal three. The point moved from one to three, that is, to the right.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('y = x²   →   y = (x − 2)²', 'y = x²   →   y = (x − 2)²', 'y = x²   →   y = (x − 2)²')}
      steps={[
        { id: 'old', head: L('Eski nuqta', 'Старая точка', 'Old point'), lines: ['(1; 1)  y = x²'] },
        { id: 'new', head: L('Yangi nuqta', 'Новая точка', 'New point'), lines: ['x − 2 = 1', 'x = 3', '(3; 1)  y = (x − 2)²'] },
      ]}
      ask={L(
        "Nuqta bir dan uchga ko'chdi. Bu qaysi tomon?",
        'Точка переехала из одного в три. Это какая сторона?',
        'The point moved from one to three. Which side is that?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L("O'ngga", 'Вправо', 'Right') },
        {
          id: 'wrong',
          label: L('Chapga', 'Влево', 'Left'),
          hint: L(
            "Sonlar o'qida uch bir dan kattaroq, kattaroq son o'ngda turadi.",
            'На числовой прямой три больше единицы, а большее число стоит правее.',
            'On the number line, three is greater than one, and the greater number stands to the right.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Formulada minus ikki bor, lekin nuqtaning o'zi o'ngga ko'chdi. Ishora tashqi ko'rinishiga qaramaydi.",
        'Верно. В формуле минус два, но сама точка переехала вправо. Знак не совпадает с внешним видом.',
        'Correct. The formula has minus two, but the point itself moved to the right. The sign does not match how it looks.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — VERTIKAL SILJISH: ishora to'g'ridan-to'g'ri
// ishlaydi, qavsdan TASHQARIDA turadi.
// ============================================================
const S4 = {
  eyebrow: L('VERTIKAL SILJISH', 'ВЕРТИКАЛЬНЫЙ СДВИГ', 'VERTICAL SHIFT'),
  title: L(
    "Qavsdan tashqaridagi son: to'g'ridan-to'g'ri ishlaydi",
    'Число снаружи скобки: работает напрямую',
    'The number outside the parentheses: works directly',
  ),
  audio: [
    A('mount',
      "Endi y teng x minus ikki butun kvadratni y teng x minus ikki butun kvadrat qo'shi bir bilan solishtiring.",
      'Теперь сравни y равно x минус два в квадрате с y равно x минус два в квадрате плюс один.',
      'Now compare y equals x minus two squared with y equals x minus two squared plus one.'),
    A('why',
      "Har bir x da ikkinchi formula birinchisidan aynan bir birlik katta. Bu esa yuqoriga siljish.",
      'При каждом x второе значение ровно на одну единицу больше первого. Это и есть сдвиг вверх.',
      'At every x, the second value is exactly one unit greater than the first. That is a shift upward.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Qavsdan TASHQARIDAGI plyus bir, qaysi tomonga siljitadi: bu ham teskari ishlaydimi?",
        'Плюс один СНАРУЖИ скобки, куда сдвигает: он тоже работает наоборот?',
        'Plus one OUTSIDE the parentheses, which way does it shift: does it also work backward?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Yo'q, to'g'ridan-to'g'ri ishlaydi: plyus, demak yuqoriga", 'Нет, работает напрямую: плюс, значит вверх', 'No, it works directly: plus means up') },
        {
          id: 'wrong',
          label: L('Ha, qavs ichidagi kabi teskari', 'Да, наоборот, как внутри скобки', 'Yes, backward, like inside the parentheses'),
          hint: L(
            "Faqat qavs ICHIDAGI son teskari ishlaydi. Qavsdan tashqaridagi son y ning o'ziga qo'shiladi, hech qanday teskarilik yo'q.",
            'Наоборот работает только число ВНУТРИ скобки. Число снаружи прибавляется прямо к y, никакого обратного знака нет.',
            'Only the number INSIDE the parentheses works backward. The number outside is added directly to y, with no reversal at all.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikki qoida bor: qavs ichidagi son teskari ishlaydi, qavsdan tashqaridagi son to'g'ridan-to'g'ri ishlaydi.",
        'Верно. Есть два правила: число внутри скобки работает наоборот, число снаружи скобки работает напрямую.',
        'Correct. There are two rules: the number inside the parentheses works backward, the number outside works directly.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — PLYUS ISHORASI, TESKARI MISOL:
// y=(x+3)²−5. Bu safar plyus chapga suradi.
// ============================================================
const S5 = {
  eyebrow: L('TESKARI MISOL', 'ОБРАТНЫЙ ПРИМЕР', 'THE REVERSE EXAMPLE'),
  title: L(
    "Bu safar qavs ichida plyus turibdi",
    'На этот раз внутри скобки плюс',
    'This time there is a plus inside the parentheses',
  ),
  audio: [
    A('mount',
      "Yangi formula: y teng x qo'shi uch butun kvadrat minus besh. Qavs ichida endi plyus uch turibdi.",
      'Новая формула: y равно x плюс три в квадрате минус пять. Внутри скобки теперь плюс три.',
      'A new formula: y equals x plus three squared minus five. Inside the parentheses there is now plus three.'),
    A('why',
      "X qo'shi uchni x minus minus uch deb o'qing. Qoida bir xil: qavs ichidagi son teskari ishlaydi.",
      'Прочитай x плюс три как x минус минус три. Правило то же самое: число внутри скобки работает наоборот.',
      'Read x plus three as x minus minus three. The rule is the same: the number inside the parentheses works backward.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('y = (x + 3)² − 5', 'y = (x + 3)² − 5', 'y = (x + 3)² − 5')}
      steps={[
        { id: 'rewrite', head: L("Qayta yozish", 'Переписываем', 'Rewrite'), lines: ['x + 3  =  x − (−3)'] },
        { id: 'x0', head: 'x0', lines: ['x0 = −3'] },
      ]}
      ask={L(
        "X0 minus uchga teng chiqdi. Bu qaysi tomonga siljish?",
        'x0 получился равным минус трём. Это сдвиг в какую сторону?',
        'x0 came out equal to minus three. Which way is that a shift?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Chapga uchga', 'Влево на три', 'Left by three') },
        {
          id: 'wrong',
          label: L("O'ngga uchga", 'Вправо на три', 'Right by three'),
          hint: L(
            "Formulada tashqi ko'rinishda plyus bor, lekin x0 hisoblanganda u minus uchga aylandi. Manfiy x0 chapga siljishni bildiradi.",
            'В формуле снаружи плюс, но при вычислении x0 он превратился в минус три. Отрицательный x0 означает сдвиг влево.',
            'On the surface the formula has a plus, but when x0 is computed it turns into minus three. A negative x0 means a shift to the left.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Qoida ishorani ko'rish bilan emas, x0 ni hisoblash bilan ishlaydi: bu safar plyus chapga suradi.",
        'Верно. Правило работает не по внешнему виду знака, а по вычисленному x0: на этот раз плюс двигает влево.',
        "Correct. The rule works not by the look of the sign but by the computed x0: this time the plus shifts it to the left.",
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — UCHINI TO'G'RIDAN-TO'G'RI O'QISH.
// ============================================================
const S6 = {
  eyebrow: L('UCHINI O\'QISH', 'ЧТЕНИЕ ВЕРШИНЫ', 'READING THE VERTEX'),
  title: L(
    "Formuladan uchini bir qarashda o'qish",
    'Читаем вершину по формуле с одного взгляда',
    'Reading the vertex from the formula at a glance',
  ),
  audio: [
    A('mount',
      "Yangi formula: y teng ikki karra x minus to'rt butun kvadrat qo'shi yetti.",
      'Новая формула: y равно два, умноженное на x минус четыре в квадрате, плюс семь.',
      'A new formula: y equals two times x minus four squared plus seven.'),
    A('why',
      "Qavs ichidagi son to'rt, lekin uchining x koordinatasi ham to'rt bo'ladi, minus to'rt emas: ishora allaqachon teskari hisoblangan.",
      'Число внутри скобки четыре, и x-координата вершины тоже четыре, а не минус четыре: знак уже учтён обратным образом.',
      "The number inside the parentheses is four, and the vertex's x-coordinate is also four, not minus four: the sign has already been accounted for in reverse."),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('y = 2(x − 4)² + 7', 'y = 2(x − 4)² + 7', 'y = 2(x − 4)² + 7')}
      steps={[
        { id: 'x0', head: 'x0', lines: ['x0 = 4'] },
        { id: 'y0', head: 'y0', lines: ['y0 = 7'] },
      ]}
      ask={L(
        "Uchining to'liq koordinatalari qanday yoziladi?",
        'Как записать полные координаты вершины?',
        'How are the full coordinates of the vertex written?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '(4; 7)' },
        {
          id: 'wrong',
          label: '(−4; 7)',
          hint: L(
            "Qavs ichidagi son to'rtdan minus to'rtga aylantirilmaydi, u to'g'ridan-to'g'ri x0 ga teng: to'rt.",
            'Число внутри скобки не превращается из четырёх в минус четыре, оно напрямую равно x0: четыре.',
            "The number inside the parentheses is not turned from four into minus four, it equals x0 directly: four.",
          ),
        },
      ]}
      after={L(
        "To'g'ri. Qavs ichidagi son to'g'ridan-to'g'ri x0 ga, qavsdan tashqaridagi son to'g'ridan-to'g'ri y0 ga teng.",
        'Верно. Число внутри скобки напрямую равно x0, число снаружи скобки напрямую равно y0.',
        'Correct. The number inside the parentheses equals x0 directly, the number outside equals y0 directly.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. YIG'ISH. Trace bilan besh nuqta: (2;1) uchi va uchiga
// nisbatan simmetrik to'rtta nuqta, MAIN_F=y=(x−2)²+1 ustidan.
// ============================================================
const S7 = {
  eyebrow: L("YIG'ISH", 'СБОРКА', 'ASSEMBLY'),
  title: L(
    "Siljigan parabolani nuqtalardan yig'amiz",
    'Собираем сдвинутую параболу из точек',
    'Assembling the shifted parabola from points',
  ),
  audio: [
    A('mount',
      "Uchi ikkida, birda turadi: o'ngga ikki, yuqoriga bir siljigan. Yana to'rtta nuqta uchiga nisbatan simmetrik.",
      'Вершина стоит в двух, в одном: сдвиг вправо на два, вверх на один. Ещё четыре точки симметричны относительно вершины.',
      'The vertex stands at two, one: a shift right by two, up by one. Four more points are symmetric about the vertex.'),
    W('p5',
      "Beshta nuqta ham joyida. Ularni birlashtiring va y teng x kvadrat qanday siljiganini ko'ring.",
      'Все пять точек на месте. Соедини их и увидь, как сдвинулся y равно x в квадрате.',
      'All five points are in place. Connect them and see how y equals x squared has shifted.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Trace
      f={MAIN_F}
      from={-0.5} to={4.5} yFrom={0.5} yTo={5.5}
      pairs={[
        { x: 2, y: 1 }, { x: 0, y: 5 }, { x: 4, y: 5 }, { x: 1, y: 2 }, { x: 3, y: 2 },
      ]}
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "Beshta nuqtani birma-bir qo'ying",
        'Ставь пять точек одну за другой',
        'Place the five points one by one',
      )}
      after={L(
        "Ana xolos. Uchi o'ngga ikki, yuqoriga bir ko'chgan, parabolaning shakli esa xuddi avvalgidek qoldi.",
        'Вот и всё. Вершина переехала вправо на два, вверх на один, а форма параболы осталась прежней.',
        'That is all it takes. The vertex moved right by two, up by one, while the shape of the parabola stayed the same.',
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
      "Y teng a, x minus x nol butun kvadrat, qo'shi y nol parabolasi, y teng a x kvadrat parabolasidan siljitilgan: Ox bo'ylab o'ngga x nolga, agar x nol musbat bo'lsa, chapga x nol moduliga, agar x nol manfiy bo'lsa",
      'График y равно a, умноженному на x минус x нуль в квадрате, плюс y нуль, получен сдвигом параболы y равно a x в квадрате: вдоль Ox вправо на x нуль, если x нуль положителен, влево на модуль x нуль, если x нуль отрицателен',
      "The graph of y equals a times x minus x zero squared plus y zero is obtained by shifting the parabola y equals a x squared: along Ox to the right by x zero if x zero is positive, to the left by the absolute value of x zero if x zero is negative",
    ),
    L(
      "Va Oy bo'ylab yuqoriga y nolga, agar y nol musbat bo'lsa, pastga y nol moduliga, agar y nol manfiy bo'lsa",
      'И вдоль Oy вверх на y нуль, если y нуль положителен, вниз на модуль y нуль, если y нуль отрицателен',
      'And along Oy upward by y zero if y zero is positive, downward by the absolute value of y zero if y zero is negative',
    ),
    L(
      "A koeffitsienti bu qoidaga kirmaydi: u faqat shaklni belgilaydi, tarmoqlarning tor yoki kengligini va yo'nalishini, joyni emas",
      'Коэффициент a в это правило не входит: он определяет только форму, ширину и направление ветвей, а не место',
      'The coefficient a is not part of this rule: it determines only the shape, the width and direction of the branches, not the position',
    ),
  ],
  source: L(
    "Algebra 9, 4-§ (14-16-bet)",
    'Алгебра 9, §4 (стр. 14-16)',
    'Algebra 9, §4 (p. 14-16)',
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
        formula="y = a(x − x0)² + y0"
        steps={[]}
        ask={L(
          "Qavs ichidagi son bilan qavsdan tashqaridagi son qaysi o'qlarni boshqaradi?",
          'Число внутри скобки и число снаружи скобки, какими осями они управляют?',
          'The number inside the parentheses and the number outside, which axes do they control?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Ichkisi Ox ni, tashqisi Oy ni, ikkalasi turli o'qlar", 'Внутреннее число Ox, внешнее число Oy, это разные оси', 'The inner number controls Ox, the outer number controls Oy, different axes'),
          },
          {
            id: 'wrong',
            label: L("Ikkalasi ham bir xil o'qni boshqaradi", 'Оба управляют одной и той же осью', 'Both control the same axis'),
            hint: L(
              "Bugungi misollarda gorizontal siljish va vertikal siljish alohida sonlardan chiqdi: ular bir-biriga bog'liq emas.",
              'В сегодняшних примерах горизонтальный и вертикальный сдвиг вышли из разных чисел: они не связаны друг с другом.',
              "In today's examples the horizontal shift and the vertical shift came from different numbers: they are not linked.",
            ),
          },
        ]}
        after={L(
          "To'g'ri. Endi to'liq qoida.",
          'Верно. Теперь полное правило.',
          'Correct. Now the full rule.',
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
    "Gorizontal va vertikal siljish qoidasi",
    'Правило горизонтального и вертикального сдвига',
    'The rule for horizontal and vertical shift',
  ),
  audio: [
    A('mount',
      "Olti ekranda siz gorizontal siljishning teskari ishorasini va vertikal siljishning to'g'ri ishorasini o'z qo'lingiz bilan topdingiz. Endi ular qoida sifatida.",
      'На шести экранах ты сам нашёл обратный знак горизонтального сдвига и прямой знак вертикального сдвига. Теперь они в виде правила.',
      'On six screens you found the reversed sign of the horizontal shift and the direct sign of the vertical shift with your own hands. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Uchtasi ham darslikdan so'zma-so'z.",
      'Правило открылось. Все три даны дословно из учебника.',
      'The rule is open. All three are word for word from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — ZANJIR: uchini formuladan o'qish, to'rtta funksiya.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Uchini tez o'qish",
    'Быстро читаем вершину',
    'Quickly reading the vertex',
  ),
  audio: [
    A('mount',
      "To'rtta funksiya ketma-ket. Har birida uchining koordinatalarini formuladan o'qing.",
      'Четыре функции подряд. В каждой прочитай координаты вершины прямо из формулы.',
      'Four functions in a row. In each, read the coordinates of the vertex straight from the formula.'),
    A('why',
      "Qavs ichidagi son teskari, qavsdan tashqaridagi son to'g'ridan-to'g'ri ishlaydi.",
      'Число внутри скобки работает наоборот, число снаружи скобки напрямую.',
      'The number inside the parentheses works backward, the number outside works directly.'),
  ],
  props: {
    stepLabel: L('Funksiya', 'Функция', 'Function'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham topildi. Har safar bir xil yo'l: qavs ichidagisini teskari, qavsdan tashqarisini to'g'ridan-to'g'ri o'qish.",
      'Все четыре найдены. Каждый раз один путь: число внутри скобки наоборот, число снаружи скобки напрямую.',
      'All four are found. Same path every time: read the number inside the parentheses backward, the number outside directly.',
    ),
    tasks: [
      {
        expr: 'y = (x − 5)² + 2',
        question: L("Uchining koordinatalari?", 'Координаты вершины?', "The vertex's coordinates?"),
        ok: L("Ha. Besh to'g'ridan-to'g'ri x nolga, ikki to'g'ridan-to'g'ri y nolga.", 'Да. Пять напрямую в x нуль, два напрямую в y нуль.', 'Yes. Five directly into x zero, two directly into y zero.'),
        items: [
          { id: 'a', right: true, label: '(5; 2)' },
          { id: 'b', label: '(−5; 2)', hint: L("Qavs ichidagi son to'g'ridan-to'g'ri x0 ga teng, u ishorasini o'zgartirmaydi.", 'Число внутри скобки напрямую равно x0, знак не меняется.', 'The number inside the parentheses equals x0 directly, the sign does not flip.') },
        ],
        solution: ['x0 = 5', 'y0 = 2', 'Uchi: (5; 2)'],
      },
      {
        expr: 'y = (x + 1)² − 3',
        question: L("Uchining koordinatalari?", 'Координаты вершины?', "The vertex's coordinates?"),
        ok: L("Ha. X qo'shi bir, x minus minus bir, x nol minus bir.", 'Да. x плюс один, это x минус минус один, x нуль минус один.', 'Yes. x plus one is x minus minus one, x zero is minus one.'),
        items: [
          { id: 'a', right: true, label: '(−1; −3)' },
          { id: 'b', label: '(1; −3)', hint: L("Qavs ichida plyus bor, u x nolni MINUS qiladi: x qo'shi bir, x minus minus bir.", 'Внутри скобки плюс, он делает x нуль ОТРИЦАТЕЛЬНЫМ: x плюс один, это x минус минус один.', 'Inside the parentheses there is a plus, which makes x zero NEGATIVE: x plus one is x minus minus one.') },
        ],
        solution: ['x + 1 = x − (−1)', 'x0 = −1', 'y0 = −3'],
      },
      {
        expr: 'y = (x − 3)²',
        question: L("Uchining koordinatalari?", 'Координаты вершины?', "The vertex's coordinates?"),
        ok: L("Ha. Qo'shimcha son yozilmagan, demak y nol nolga teng.", 'Да. Дополнительное число не записано, значит y нуль равен нулю.', 'Yes. No extra number is written, so y zero equals zero.'),
        items: [
          { id: 'a', right: true, label: '(3; 0)' },
          { id: 'b', label: '(3; 3)', hint: L("Qavsdan tashqarida hech qanday son yo'q: bu y nol nolga teng degani, uchdan olingan son emas.", 'Снаружи скобки числа нет вообще: это значит y нуль равен нулю, а не взято число из тройки.', "There is no number outside the parentheses at all: that means y zero equals zero, not a number taken from the three.") },
        ],
        solution: ['x0 = 3', 'y0 = 0', 'Uchi: (3; 0)'],
      },
      {
        expr: 'y = x² + 4',
        question: L("Uchining koordinatalari?", 'Координаты вершины?', "The vertex's coordinates?"),
        ok: L("Ha. Qavs ichida hech qanday son yo'q, demak x nol nolga teng, faqat yuqoriga siljigan.", 'Да. Внутри скобки числа нет, значит x нуль равен нулю, сдвиг только вверх.', 'Yes. There is no number inside the parentheses, so x zero equals zero, the shift is upward only.'),
        items: [
          { id: 'a', right: true, label: '(0; 4)' },
          { id: 'b', label: '(4; 0)', hint: L("Bu yerda gorizontal siljish umuman yo'q: x kvadrat qavs ichida hech narsasiz turibdi.", 'Здесь горизонтального сдвига нет совсем: x в квадрате стоит без ничего внутри скобки.', 'There is no horizontal shift here at all: x squared stands with nothing inside parentheses.') },
        ],
        solution: ['x0 = 0', 'y0 = 4', 'Uchi: (0; 4)'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — YO'NALTIRILGAN: y=3(x+2)²−1 uchun to'liq tahlil.
// ============================================================
const S10 = {
  eyebrow: L('QADAMLAB', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L(
    "Uch qadamda to'liq tahlil",
    'Полный разбор за три шага',
    'A full analysis in three steps',
  ),
  audio: [
    A('mount',
      "Bitta funksiya, uch qadam. Yordam yo'q, lekin har javobdan keyin yechim ochiladi.",
      'Одна функция, три шага. Помощи нет, но после каждого ответа откроется решение.',
      'One function, three steps. No help, but after each answer the solution opens.'),
    A('why',
      "Avval qavs ichidagisini o'qing, keyin tashqarisini, oxirida shaklga a ning ta'sirini eslang.",
      'Сначала прочитай число внутри скобки, потом снаружи, в конце вспомни, как a влияет на форму.',
      'First read the number inside the parentheses, then outside, finally recall how a affects the shape.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uch qadam ham to'ldi: gorizontal siljish, vertikal siljish, va a ning shaklga ta'siri, joyga emas.",
      'Все три шага пройдены: горизонтальный сдвиг, вертикальный сдвиг, и влияние a на форму, а не на место.',
      'All three steps are done: horizontal shift, vertical shift, and the effect of a on the shape, not the position.',
    ),
    tasks: [
      {
        expr: 'y = 3(x + 2)² − 1',
        question: L("Gorizontal siljish qanday: qaysi tomonga, nechaga?", 'Каков горизонтальный сдвиг: в какую сторону, на сколько?', 'What is the horizontal shift: which way, by how much?'),
        ok: L("Ha. X qo'shi ikki, x minus minus ikki, demak chapga ikkiga.", 'Да. x плюс два, это x минус минус два, значит влево на два.', 'Yes. x plus two is x minus minus two, so left by two.'),
        items: [
          { id: 'a', right: true, label: L('Chapga ikkiga', 'Влево на два', 'Left by two') },
          { id: 'b', label: L("O'ngga ikkiga", 'Вправо на два', 'Right by two'), hint: L("Qavs ichida plyus bor: uni x minus minus ikki deb o'qing, x nol manfiy chiqadi.", 'Внутри скобки плюс: прочитай его как x минус минус два, x нуль получится отрицательным.', 'Inside the parentheses there is a plus: read it as x minus minus two, x zero comes out negative.') },
        ],
        solution: ['x + 2 = x − (−2)', 'x0 = −2', "Chapga ikkiga"],
      },
      {
        expr: 'y = 3(x + 2)² − 1',
        question: L("Vertikal siljish qanday: qaysi tomonga, nechaga?", 'Каков вертикальный сдвиг: в какую сторону, на сколько?', 'What is the vertical shift: which way, by how much?'),
        ok: L("Ha. Minus bir to'g'ridan-to'g'ri pastga bittaga.", 'Да. Минус один напрямую вниз на один.', 'Yes. Minus one directly means down by one.'),
        items: [
          { id: 'a', right: true, label: L('Pastga bittaga', 'Вниз на один', 'Down by one') },
          { id: 'b', label: L('Yuqoriga bittaga', 'Вверх на один', 'Up by one'), hint: L("Qavsdan tashqaridagi son to'g'ridan-to'g'ri ishlaydi: minus bir, demak pastga.", 'Число снаружи скобки работает напрямую: минус один, значит вниз.', 'The number outside the parentheses works directly: minus one means down.') },
        ],
        solution: ['y0 = −1', 'Pastga bittaga'],
      },
      {
        expr: 'y = 3(x + 2)² − 1',
        question: L("Uchtaga teng koeffitsient joyga ta'sir qiladimi?", 'Влияет ли коэффициент три на место?', 'Does the coefficient three affect the position?'),
        ok: L("Yo'q. Uch faqat tarmoqlarni torroq qiladi, uchining joyini emas.", 'Нет. Тройка только сужает ветви, а не место вершины.', "No. The three only narrows the branches, not the vertex's place."),
        items: [
          { id: 'a', right: true, label: L("Yo'q, faqat shaklga", 'Нет, только на форму', 'No, only the shape') },
          { id: 'b', label: L('Ha, uchini ham siljitadi', 'Да, тоже сдвигает вершину', 'Yes, it also shifts the vertex'), hint: L("Uchining koordinatalari faqat qavs ichidagi va tashqaridagi sonlardan chiqadi, a dan emas.", 'Координаты вершины получаются только из чисел внутри и снаружи скобки, а не из a.', "The vertex's coordinates come only from the numbers inside and outside the parentheses, not from a.") },
        ],
        solution: ['Uchi: (−2; −1)', 'a = 3 faqat shaklga ta\'sir qiladi'],
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
    "Faqat o'qish: chizmasiz",
    'Только чтение: без рисунка',
    'Just reading: no picture',
  ),
  audio: [
    A('mount',
      "Bu safar chizma yo'q. Har savolda formula berilgan, siz uni o'qib javob berasiz.",
      'На этот раз без рисунка. В каждом вопросе дана формула, ты читаешь и отвечаешь.',
      'This time there is no picture. Each question gives a formula, you read it and answer.'),
    A('why',
      "Imtihonda ham priborsiz shunday o'qiladi: formulaning o'zidan, chizmasiz.",
      'На контрольной тоже читают без прибора: прямо из формулы, без рисунка.',
      'On a test it is read the same way, without a tool: straight from the formula, without a picture.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham o'qildi: gorizontal siljish, vertikal siljish va a ning shaklga ta'siri. Hammasi bir xil qoidadan.",
      'Все три прочитаны: горизонтальный сдвиг, вертикальный сдвиг и влияние a на форму. Всё из одного правила.',
      'All three are read: horizontal shift, vertical shift, and the effect of a on shape. All from the same rule.',
    ),
    tasks: [
      {
        expr: 'y = (x − 6)² + 2',
        question: L("Gorizontal siljish qaysi tomonga?", 'В какую сторону горизонтальный сдвиг?', 'Which way is the horizontal shift?'),
        ok: L("Ha. Qavs ichida minus olti, to'g'ridan-to'g'ri o'ngga oltiga.", 'Да. Внутри скобки минус шесть, напрямую вправо на шесть.', 'Yes. Inside the parentheses is minus six, directly right by six.'),
        items: [
          { id: 'a', right: true, label: L("O'ngga", 'Вправо', 'Right') },
          { id: 'b', label: L('Chapga', 'Влево', 'Left'), hint: L("Qavs ichida minus turgani uchun x0 musbat chiqadi, musbat x0 esa o'ngga siljitadi.", 'Так как внутри скобки минус, x0 получается положительным, а положительный x0 сдвигает вправо.', 'Since there is a minus inside the parentheses, x0 comes out positive, and a positive x0 shifts to the right.') },
        ],
        solution: ['x0 = 6', "O'ngga oltiga"],
      },
      {
        expr: 'y = (x + 5)² − 7',
        question: L("Vertikal siljish qaysi tomonga?", 'В какую сторону вертикальный сдвиг?', 'Which way is the vertical shift?'),
        ok: L("Ha. Qavsdan tashqarida minus yetti, to'g'ridan-to'g'ri pastga yettiga.", 'Да. Снаружи скобки минус семь, напрямую вниз на семь.', 'Yes. Outside the parentheses is minus seven, directly down by seven.'),
        items: [
          { id: 'a', right: true, label: L('Pastga', 'Вниз', 'Down') },
          { id: 'b', label: L('Yuqoriga', 'Вверх', 'Up'), hint: L("Qavsdan tashqaridagi son to'g'ridan-to'g'ri ishlaydi: minus yetti, demak pastga.", 'Число снаружи скобки работает напрямую: минус семь, значит вниз.', 'The number outside the parentheses works directly: minus seven means down.') },
        ],
        solution: ['y0 = −7', 'Pastga yettiga'],
      },
      {
        expr: 'y = −4(x − 1)² + 3',
        question: L("Minus to'rt koeffitsienti uchining joyiga ta'sir qiladimi?", 'Влияет ли коэффициент минус четыре на место вершины?', "Does the coefficient minus four affect the vertex's position?"),
        ok: L("Yo'q. U faqat tarmoqlarni pastga qaratadi va toraytiradi, uchining joyi bir, uchdan o'zgarmaydi.", 'Нет. Он только направляет ветви вниз и сужает их, место вершины, один, три, не меняется.', "No. It only points the branches downward and narrows them, the vertex's place, one, three, does not change."),
        items: [
          { id: 'a', right: true, label: L("Yo'q, faqat shaklga", 'Нет, только на форму', 'No, only the shape') },
          { id: 'b', label: L('Ha, uchini ham ko\'chiradi', 'Да, тоже переносит вершину', 'Yes, it also moves the vertex'), hint: L("Uchining koordinatalari faqat qavs ichidagi bir va qavsdan tashqaridagi uchdan chiqadi.", 'Координаты вершины получаются только из единицы внутри скобки и тройки снаружи.', "The vertex's coordinates come only from the one inside the parentheses and the three outside.") },
        ],
        solution: ['Uchi: (1; 3)', "a = −4 faqat shaklga ta'sir qiladi"],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Aziz "yechimida" qavs ichidagi ishorani
// tashqi ko'rinishiga qarab o'qigan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Tashqi ko'rinishga qarab xato",
    'Ошибка по внешнему виду',
    'A mistake from appearances',
  ),
  audio: [
    A('mount',
      "Azizning yechimi. Formula: y teng x minus to'rt butun kvadrat qo'shi olti. U uchini minus to'rt, olti deb yozdi.",
      'Решение Азиза. Формула: y равно x минус четыре в квадрате плюс шесть. Он записал вершину как минус четыре, шесть.',
      "Aziz's solution. The formula: y equals x minus four squared plus six. He wrote the vertex as minus four, six."),
    A('why',
      "Uning yozuvini o'qing va formuladagi ishorani qayta hisoblab, o'zingiz tekshiring.",
      'Прочитай его запись и, пересчитав знак в формуле, проверь сама.',
      "Read his notation and, recomputing the sign in the formula, check it yourself."),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Qavs ichidagi son tashqi ko'rinishiga qaramasdan, to'g'ridan-to'g'ri x0 ga teng qo'yiladi: minus emas, to'rt.",
      'Число внутри скобки, независимо от внешнего вида, напрямую приравнивается к x0: не минус, а четыре.',
      'The number inside the parentheses, regardless of appearance, equals x0 directly: not minus, but four.',
    ),
    tasks: [
      {
        expr: 'y = (x − 4)² + 6, uchi = (−4; 6)',
        question: L(
          "Aziz uchini minus to'rt, olti deb yozdi. Bu tanlov nega noto'g'ri?",
          'Азиз записал вершину как минус четыре, шесть. Почему эта запись неверна?',
          'Aziz wrote the vertex as minus four, six. Why is this wrong?',
        ),
        ok: L(
          "Ha. Qavs ichida minus to'rt turibdi, lekin bu belgi allaqachon teskari hisoblangan: x0 to'g'ridan-to'g'ri to'rtga teng, minus to'rtga emas.",
          'Да. Внутри скобки минус четыре, но этот знак уже учтён обратным образом: x0 напрямую равен четырём, а не минус четырём.',
          'Yes. Inside the parentheses there is minus four, but that sign has already been accounted for in reverse: x0 directly equals four, not minus four.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Qavs ichidagi minus allaqachon teskari hisoblangan, x0 to'rtga teng", 'Минус внутри скобки уже учтён наоборот, x0 равен четырём', 'The minus inside the parentheses is already reversed, x0 equals four'),
          },
          {
            id: 'b',
            label: L("Olti soni noto'g'ri, u ham manfiy bo'lishi kerak edi", 'Число шесть неверно, оно тоже должно быть отрицательным', 'The number six is wrong, it should also be negative'),
            hint: L("Olti to'g'ri, u qavsdan tashqarida va o'zgarishsiz ko'chadi. Muammo birinchi koordinatada.", 'Шесть верно, оно снаружи скобки и переносится без изменений. Проблема в первой координате.', 'Six is correct, it is outside the parentheses and carries over unchanged. The problem is in the first coordinate.'),
          },
          {
            id: 'c',
            label: L("Xato yo'q, yozuv to'g'ri", 'Ошибки нет, запись верна', 'There is no mistake, the notation is correct'),
            hint: L("Formulaga to'rtni qo'ying: to'rt minus to'rt nolga teng, kvadrati ham nol, natija olti chiqadi. Minus to'rtni qo'ysangiz, olti chiqmaydi.", 'Подставь четыре в формулу: четыре минус четыре равно нулю, квадрат тоже нуль, результат шесть. Если подставить минус четыре, шести не получится.', 'Substitute four into the formula: four minus four equals zero, the square is also zero, the result is six. Substituting minus four will not give six.'),
          },
        ],
        solution: [
          'y = (x − 4)² + 6',
          'y(4) = (4 − 4)² + 6 = 6',
          "Uchi: (4; 6), Azizning minus to'rtiga tekshiruv mos kelmaydi",
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TESKARI TOPSHIRIQ — uchi berilgan, formulani tanlash.
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
      "Har bir nomzodda uchini o'qing va berilgan joyga mos kelishini tekshiring.",
      'В каждом кандидате прочитай вершину и проверь совпадение с данным местом.',
      'In each candidate, read the vertex and check whether it matches the given place.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: uchining joyidan orqaga qaytib, mos formulani tanlash ham xuddi shu qoidaga tayanadi.",
      'Найдено: путь от места вершины назад к формуле опирается на то же самое правило.',
      'Found: going backward from the vertex to the formula relies on the same rule.',
    ),
    tasks: [
      {
        expr: '(x0; y0) = (5; −2)',
        question: L(
          "Uchi besh, minus ikkida turishi kerak. Qaysi formula mos keladi?",
          'Вершина должна стоять в пяти, минус двух. Какая формула подходит?',
          'The vertex must stand at five, minus two. Which formula fits?',
        ),
        ok: L("Ha. Qavs ichida minus besh, to'g'ridan-to'g'ri x0 ga teng: besh. Tashqarida minus ikki, y0 ga teng.", 'Да. Внутри скобки минус пять, напрямую равно x0: пять. Снаружи минус два, равно y0.', 'Yes. Inside the parentheses is minus five, directly equal to x0: five. Outside is minus two, equal to y0.'),
        items: [
          { id: 'a', right: true, label: 'y = (x − 5)² − 2' },
          { id: 'b', label: 'y = (x + 5)² − 2', hint: L("Bu yerda qavs ichida plyus besh: x0 minus beshga teng chiqadi, beshga emas.", 'Здесь внутри скобки плюс пять: x0 получится минус пять, а не пять.', 'Here inside the parentheses is plus five: x0 comes out minus five, not five.') },
          { id: 'c', label: 'y = (x − 5)² + 2', hint: L("Qavsdan tashqarida ishorani tekshiring: kerakli y0 manfiy, plyus ikki emas.", 'Проверь знак снаружи скобки: нужный y0 отрицателен, а не плюс два.', 'Check the sign outside the parentheses: the needed y0 is negative, not plus two.') },
        ],
        solution: ['x0 = 5, y0 = −2', 'y = (x − 5)² − 2 mos keladi'],
      },
      {
        expr: '(x0; y0) = (−3; 4)',
        question: L(
          "Uchi minus uch, to'rtda turishi kerak. Qaysi formula mos keladi?",
          'Вершина должна стоять в минус трёх, четырёх. Какая формула подходит?',
          'The vertex must stand at minus three, four. Which formula fits?',
        ),
        ok: L("Ha. Minus uchga chiqishi uchun qavs ichida plyus uch turishi kerak: x minus minus uch.", 'Да. Чтобы получить минус три, внутри скобки должен быть плюс три: x минус минус три.', 'Yes. To get minus three, the parentheses need plus three inside: x minus minus three.'),
        items: [
          { id: 'a', right: true, label: 'y = (x + 3)² + 4' },
          { id: 'b', label: 'y = (x − 3)² + 4', hint: L("Bu yerda qavs ichida minus uch: x0 musbat uchga teng chiqadi, minus uchga emas.", 'Здесь внутри скобки минус три: x0 получится плюс три, а не минус три.', 'Here inside the parentheses is minus three: x0 comes out positive three, not minus three.') },
        ],
        solution: ['x0 = −3 → x − (−3) = x + 3', 'y = (x + 3)² + 4 mos keladi'],
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
    "Blits: siljish, o'q, shakl",
    'Блиц: сдвиг, ось, форма',
    'Blitz: shift, axis, shape',
  ),
  audio: [
    A('mount',
      "To'rtta savol birin ketin. Ular yo'nalishni so'raydi, uzoq hisobni emas.",
      'Четыре вопроса один за другим. Они спрашивают про направление, а не про долгий счёт.',
      'Four questions one after another. They ask about direction, not a long computation.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi.",
      'Счёт идёт по первой попытке.',
      'The count goes by the first attempt.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'ishora-teskari-siljish',
        ask: L(
          "Y teng x minus to'qqiz butun kvadrat. Qavs ichida minus to'qqiz turibdi. Bu qaysi tomonga siljish?",
          'y равен x минус девять в квадрате. Внутри скобки минус девять. Это сдвиг в какую сторону?',
          'y equals x minus nine squared. Inside the parentheses is minus nine. Which way is this shift?',
        ),
        options: [
          { id: 'right', right: true, label: L("O'ngga", 'Вправо', 'Right') },
          { id: 'left', label: L('Chapga', 'Влево', 'Left') },
        ],
        ok: L(
          "To'g'ri. Qavs ichidagi minus teskari ishlaydi: minus to'qqiz, demak o'ngga to'qqizga.",
          'Верно. Минус внутри скобки работает наоборот: минус девять, значит вправо на девять.',
          'Correct. The minus inside the parentheses works backward: minus nine means right by nine.',
        ),
        hint: L(
          "Qoidani eslang: qavs ichidagi son teskari ishlaydi, tashqi ko'rinishiga qaramang.",
          'Вспомни правило: число внутри скобки работает наоборот, не смотри на внешний вид.',
          'Recall the rule: the number inside the parentheses works backward, do not go by appearance.',
        ),
      },
      {
        id: 'q2',
        tag: 'gorizontal-vertikal-almashinish',
        ask: L(
          "Qavsdan TASHQARIDAGI son qaysi o'q bo'ylab siljitadi: Ox yoki Oy?",
          'Число СНАРУЖИ скобки сдвигает вдоль какой оси: Ox или Oy?',
          'The number OUTSIDE the parentheses shifts along which axis: Ox or Oy?',
        ),
        options: [
          { id: 'oy', right: true, label: 'Oy' },
          { id: 'ox', label: 'Ox' },
        ],
        ok: L(
          "To'g'ri. Qavsdan tashqaridagi son to'g'ridan-to'g'ri y ga qo'shiladi, demak Oy bo'ylab.",
          'Верно. Число снаружи скобки напрямую прибавляется к y, значит вдоль Oy.',
          'Correct. The number outside the parentheses is added directly to y, so it acts along Oy.',
        ),
        hint: L(
          "Ikki qoidani eslang: ichkisi Ox, tashqisi Oy.",
          'Вспомни два правила: внутреннее число для Ox, внешнее для Oy.',
          'Recall the two rules: the inner number for Ox, the outer for Oy.',
        ),
      },
      {
        id: 'q3',
        tag: 'uchi-notogri-oqish',
        ask: L(
          "Y teng ikki karra x qo'shi bir butun kvadrat minus besh. Uchining x koordinatasi qanday?",
          'y равен два, умноженное на x плюс один в квадрате, минус пять. Какова x-координата вершины?',
          'y equals two times x plus one squared minus five. What is the vertex\'s x-coordinate?',
        ),
        options: [
          { id: 'neg1', right: true, label: '−1' },
          { id: 'pos1', label: '1' },
        ],
        ok: L(
          "To'g'ri. X qo'shi bir, x minus minus bir, x nol minus birga teng.",
          'Верно. x плюс один, это x минус минус один, x нуль равен минус одному.',
          'Correct. x plus one is x minus minus one, x zero equals minus one.',
        ),
        hint: L(
          "Qo'shi birni minus minus bir deb qayta yozing, keyin x0 ni o'qing.",
          'Перепиши плюс один как минус минус один, потом прочитай x0.',
          'Rewrite plus one as minus minus one, then read x0.',
        ),
      },
      {
        id: 'q4',
        tag: 'a-joyni-ozgartirmaydi',
        ask: L(
          "Y teng minus besh karra x minus ikki butun kvadrat qo'shi to'rt. Minus besh koeffitsienti uchining joyini o'zgartiradimi?",
          'y равен минус пять, умноженное на x минус два в квадрате, плюс четыре. Меняет ли коэффициент минус пять место вершины?',
          "y equals minus five times x minus two squared plus four. Does the coefficient minus five change the vertex's position?",
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, faqat shaklga ta'sir qiladi", 'Нет, влияет только на форму', 'No, it only affects the shape') },
          { id: 'yes', label: L('Ha, uchini ham ko\'chiradi', 'Да, тоже переносит вершину', 'Yes, it also moves the vertex') },
        ],
        ok: L(
          "To'g'ri. Uchi ikki, to'rtda qoladi. Minus besh faqat tarmoqlarni pastga qaratadi va toraytiradi.",
          'Верно. Вершина остаётся в двух, четырёх. Минус пять только направляет ветви вниз и сужает их.',
          "Correct. The vertex stays at two, four. Minus five only points the branches downward and narrows them.",
        ),
        hint: L(
          "Uchining koordinatalari faqat qavs ichidagi va tashqaridagi sonlardan chiqadi, koeffitsientning o'zidan emas.",
          'Координаты вершины получаются только из чисел внутри и снаружи скобки, а не из самого коэффициента.',
          "The vertex's coordinates come only from the numbers inside and outside the parentheses, not from the coefficient itself.",
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN.
// ============================================================
const FIN_SC = scaleOf({ from: -1.5, to: 5.5, yFrom: -0.5, yTo: 5.5 })
// eslint-disable-next-line react-refresh/only-export-components
const FinalScene = () => {
  const t = useT()
  return (
    <div className="g9-scene-plain g8-scene-final">
      <Plane sc={FIN_SC} xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}>
        <g className="g9-real"><path d={pathOf(QUAD, FIN_SC)} strokeDasharray="3 3" /></g>
        <g className="g9-real"><path d={pathOf(MAIN_F, FIN_SC)} stroke={T.accent} /></g>
        <circle cx={FIN_SC.px(0)} cy={FIN_SC.py(0)} r="3" fill={T.ink2} />
        <circle cx={FIN_SC.px(2)} cy={FIN_SC.py(1)} r="3.6" fill={T.accent} />
        <text x={FIN_SC.px(2.15)} y={FIN_SC.py(1) - 8}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="9" fill={T.accent}>
          {t(L('yangi uchi', 'новая вершина', 'new vertex'))}
        </text>
      </Plane>
    </div>
  )
}

const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Grafiklarni ko'chirish: ikki qoida",
    'Перенос графиков: два правила',
    'Shifting graphs: two rules',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda formuladagi minus belgisi qaysi tomonni ko'rsatishini taxmin qildingiz. Endi rasmda hammasi yig'ilgan.",
      'На первом экране ты предположил, какую сторону показывает знак минус в формуле. Теперь на рисунке всё собрано.',
      'On the first screen you guessed which side the minus sign in the formula points to. Now the picture has it all assembled.'),
    A('s1',
      "Bugun siz gorizontal siljishning teskari ishorasini, vertikal siljishning to'g'ri ishorasini va a ning faqat shaklga ta'sirini o'rgandingiz.",
      'Сегодня освоены обратный знак горизонтального сдвига, прямой знак вертикального сдвига и то, что a влияет только на форму.',
      'Today you learned the reversed sign of the horizontal shift, the direct sign of the vertical shift, and that a affects only the shape.'),
    A('s2',
      "Keyingi darsda kvadrat tengsizliklar: grafikning qaysi qismi Ox dan yuqorida, qaysi qismi pastda.",
      'В следующем уроке квадратные неравенства: какая часть графика выше Ox, какая ниже.',
      'The next lesson covers quadratic inequalities: which part of the graph is above Ox, which part is below.'),
  ],
  props: {
    mark: 'y = a(x − x0)² + y0',
    markNote: L(
      "umumiy ko'chirish formulasi",
      'общая формула переноса',
      'the general shift formula',
    ),
    lines: [
      L(
        "Qavs ichidagi son teskari: minus bo'lsa o'ngga, plyus bo'lsa chapga",
        'Число внутри скобки наоборот: минус вправо, плюс влево',
        'The number inside works backward: minus means right, plus means left',
      ),
      L(
        "Qavsdan tashqaridagi son to'g'ridan-to'g'ri: Oy bo'ylab ishlaydi",
        'Число снаружи скобки напрямую: работает вдоль Oy',
        'The number outside works directly, along Oy',
      ),
      L(
        "A koeffitsienti faqat shaklga, joyga hech qachon",
        'Коэффициент a влияет только на форму, никогда на место',
        'The coefficient a affects only the shape, never the position',
      ),
    ],
    bridge: L(
      'Keyingi dars: kvadrat tengsizliklar',
      'Следующий урок: квадратные неравенства',
      'Next lesson: quadratic inequalities',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', scene: <HookScene/>, ...S1 },
  { role: 'support',  tag: 'a-joyni-ozgartirmaydi', ...S2 },
  { role: 'explain',  tag: 'ishora-teskari-siljish', ...S3 },
  { role: 'explain',  tag: 'gorizontal-vertikal-almashinish', ...S4 },
  { role: 'explain',  tag: 'ishora-teskari-siljish', ...S5 },
  { role: 'explain',  tag: 'uchi-notogri-oqish', ...S6 },
  { role: 'explain',  tag: 'gorizontal-vertikal-almashinish', ...S7 },
  { role: 'rule',     tag: 'gorizontal-vertikal-almashinish', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'uchi-notogri-oqish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'ishora-teskari-siljish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'a-joyni-ozgartirmaydi', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'ishora-teskari-siljish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'uchi-notogri-oqish', ...S13 },
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
