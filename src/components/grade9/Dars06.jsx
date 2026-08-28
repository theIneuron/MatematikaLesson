// ============================================================================
// 9-sinf, Dars 6. KVADRAT TENGSIZLIKLAR.
//
// REDAKSIYA 1, 2026-08-27. Darslikdan: 6-§ «Kvadrat tengsizlik va uni
// yechish» (24-25-bet, RU/UZ) — ko'paytmaga ajratish usuli, misol
// x²-5x+6>0 (1-masala, 24-bet); 7-§ «Kvadratik funksiya grafigi yordamida
// kvadrat tengsizlikni yechish» (28-29-bet) — grafik usuli, misol
// 2x²-x-1<=0 (1-masala, 28-bet).
//
// BIRINCHI MARTA: `SignAxis` — sinfning bosh asbobi («Prибор 1»,
// PODXOD_9SINF.md §4), 13 darsda ishlatiladigan umumiy modul. Bu yerda
// uning BIRINCHI, SODDA holati: ikkita turli haqiqiy nol, teshik nuqta yo'q
// (u 17-darsda qo'shiladi). Asbob asboblar.jsx ga yozilgan, bu yerdan
// import qilinadi — nusxa yo'q.
//
// TEGLAR (o'zining):
//   javob-doim-bitta-oraliq   — javob doim bitta oraliq deb o'ylash
//                                (aslida ikkita bo'lishi mumkin)
//   javob-doim-tashqi-oraliq  — javob doim tashqi ikki oraliq deb o'ylash
//                                (aslida o'rtadagi bitta oraliq ham bo'ladi)
//   belgi-almashtirish-notogri — oraliq ishorasini grafikdan noto'g'ri o'qish
//   chegara-nuqta-kiritish     — qat'iy/qat'iy emas tengsizlikda chegara
//                                nuqtani noto'g'ri kiritish yoki chiqarish
//
// TERMINOLOGIYA: UZ atamalar algebra_9_uzb.pdf dan so'zma-so'z.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, T, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, Plane, RecallMC, SignAxis, pathOf, scaleOf } from './asboblar.jsx'

export const META = {
  id: 'grade9-06',
  n: 6,
  row: 6,
  block: 'Б1',
  topic: L('Kvadrat tengsizliklar', 'Квадратные неравенства', 'Quadratic inequalities'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Kvadrat uch hadni ko'paytuvchilarga ajratib, tengsizlikni chiziqli tengsizliklar sistemasiga keltirish mumkin",
    'Разложив квадратный трёхчлен на множители, квадратное неравенство можно свести к системе линейных неравенств',
    'By factoring the quadratic trinomial, a quadratic inequality can be reduced to a system of linear inequalities',
  ),
  L(
    "Funksiya qiymati grafik Ox dan yuqorida bo'lgan oraliqlarda musbat, pastda bo'lgan oraliqlarda manfiy",
    'Значение функции положительно там, где график выше оси Ox, и отрицательно там, где график ниже',
    'The function is positive where the graph is above the Ox axis, and negative where it is below',
  ),
  L(
    "Qat'iy tengsizlikda chegara nol javobga kirmaydi, qat'iy bo'lmaganda kiradi",
    'В строгом неравенстве граничный нуль в ответ не входит, в нестрогом входит',
    'In a strict inequality the boundary zero is not included in the answer, in a non-strict one it is',
  ),
]

export const MISS = {
  'javob-doim-bitta-oraliq': {
    what: L(
      "javob doim bitta oraliq deb o'ylandi, ikkita bo'lishi hisobga olinmadi",
      'предполагалось, что ответ всегда один промежуток, а не два',
      'it was assumed the answer is always a single interval, not two',
    ),
    wrong: null,
    at: 0,
  },
  'javob-doim-tashqi-oraliq': {
    what: L(
      "javob doim tashqi ikki oraliq deb o'ylandi, o'rtadagisi hisobga olinmadi",
      'предполагалось, что ответ всегда два крайних промежутка, а не средний',
      'it was assumed the answer is always the two outer intervals, not the middle one',
    ),
    wrong: null,
    at: 0,
  },
  'belgi-almashtirish-notogri': {
    what: L(
      "oraliq ishorasi grafikdan noto'g'ri o'qildi",
      'знак промежутка неверно прочитан с графика',
      "the interval's sign was read incorrectly from the graph",
    ),
    wrong: null,
    at: 0,
  },
  'chegara-nuqta-kiritish': {
    what: L(
      "chegara nol qat'iylikka qaramasdan noto'g'ri kiritildi yoki chiqarildi",
      'граничный нуль включён или исключён неверно, без учёта строгости',
      'the boundary zero was included or excluded incorrectly, without regard to strictness',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// DARSNING FUNKSIYALARI. Darslikning o'z misollari.
// ============================================================
// eslint-disable-next-line react-refresh/only-export-components
const Q1 = (x) => x * x - 5 * x + 6           // §6, 1-masala: nollari 2, 3
// eslint-disable-next-line react-refresh/only-export-components
const Q2 = (x) => 2 * x * x - x - 1           // §7, 1-masala: nollari −0,5, 1
// eslint-disable-next-line react-refresh/only-export-components
const Q3 = (x) => x * x - x - 2               // mashq uchun: nollari −1, 2

const HOOK_SC = scaleOf({ from: -0.5, to: 5, yFrom: -1.5, yTo: 7 })
// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <div className="g9-scene-plain" aria-hidden="false">
      <Plane sc={HOOK_SC} xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}>
        <g className="g9-real"><path d={pathOf(Q1, HOOK_SC)} stroke={T.accent} /></g>
        <line x1={HOOK_SC.left} y1={HOOK_SC.py(0)} x2={HOOK_SC.right} y2={HOOK_SC.py(0)}
          stroke="rgba(23,26,29,.28)" strokeWidth="1.4" />
        <circle cx={HOOK_SC.px(2)} cy={HOOK_SC.py(0)} r="3.6" fill={T.ink} />
        <circle cx={HOOK_SC.px(3)} cy={HOOK_SC.py(0)} r="3.6" fill={T.ink} />
        <text x={HOOK_SC.px(0.3)} y={HOOK_SC.py(3.5)}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="16" fill={T.ink2}>+</text>
        <text x={HOOK_SC.px(2.5)} y={HOOK_SC.py(-0.9)}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="16" fill={T.ink2}>−</text>
        <text x={HOOK_SC.px(4.3)} y={HOOK_SC.py(3.5)}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="16" fill={T.ink2}>+</text>
      </Plane>
      <div className="g9-hook-caption" style={{ fontFamily: MATH_FONT }}>
        {t(L('x kvadrat minus besh x qo\'shi olti', 'x в квадрате минус пять x плюс шесть', 'x squared minus five x plus six'))}
      </div>
    </div>
  )
}

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('NECHTA ORALIQ', 'СКОЛЬКО ПРОМЕЖУТКОВ', 'HOW MANY INTERVALS'),
  title: L(
    "Javob nechta bo'lakdan iborat",
    'Из скольких частей состоит ответ',
    'How many parts does the answer have',
  ),
  audio: [
    A('mount',
      "Parabola ikki joyda Ox ni kesadi. Chapda va o'ngda plyus, o'rtada minus turibdi.",
      'Парабола пересекает Ox в двух местах. Слева и справа плюс, в середине минус.',
      'The parabola crosses Ox in two places. Plus on the left and right, minus in the middle.'),
    A('why',
      "Tengsizlik x kvadrat minus besh x qo'shi olti musbat bo'lishini so'raydi. Javobda nechta oraliq bo'ladi?",
      'Неравенство спрашивает, когда x в квадрате минус пять x плюс шесть положительно. Сколько промежутков будет в ответе?',
      'The inequality asks when x squared minus five x plus six is positive. How many intervals will the answer have?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Tengsizlik musbatlikni so'raydi. Javobda nechta oraliq bo'ladi?",
      'Неравенство спрашивает про положительность. Сколько промежутков в ответе?',
      'The inequality asks about positivity. How many intervals in the answer?',
    ),
    items: [
      {
        id: 'one',
        show: L('Bitta oraliq', 'Один промежуток', 'One interval'),
        hint: L(
          "Rasmga qarang: plyus ikkita joyda turibdi, chapda va o'ngda, ular ulanmagan.",
          'Посмотри на рисунок: плюс стоит в двух местах, слева и справа, они не соединены.',
          'Look at the picture: plus stands in two places, left and right, and they are not connected.',
        ),
      },
      { id: 'two', right: true, show: L('Ikkita oraliq', 'Два промежутка', 'Two intervals') },
      {
        id: 'three',
        show: L('Uchta oraliq', 'Три промежутка', 'Three intervals'),
        hint: L(
          "O'rtadagi oraliqda ishora minus, u tengsizlikka mos kelmaydi, javobga kirmaydi.",
          'В среднем промежутке знак минус, он не подходит неравенству, в ответ не входит.',
          'In the middle interval the sign is minus, it does not fit the inequality, it is not in the answer.',
        ),
      },
      {
        id: 'none',
        show: L("Bitta ham yo'q", 'Ни одного', 'None at all'),
        hint: L(
          "Rasmda plyus ikkita joyda ko'rinib turibdi, ular bor.",
          'На рисунке плюс явно виден в двух местах, они есть.',
          'The picture clearly shows plus in two places, they do exist.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Ikkita ajralgan oraliq. Bugun buni qanday topishni va qanday bo'yashni o'rganamiz.",
      'Верно. Два отдельных промежутка. Сегодня разберём, как их найти и как закрасить.',
      "Correct. Two separate intervals. Today we work out how to find them and how to paint them.",
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — 3-4-darsdan tanish: funksiyaning noli.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Nolni eslash",
    'Вспоминаем нуль функции',
    'Recalling a zero of the function',
  ),
  audio: [
    A('mount',
      "3 va 4-darsdan savol: funksiyaning noli deganda nima tushuniladi?",
      'Вопрос с 3 и 4 уроков: что понимают под нулём функции?',
      'A question from lessons 3 and 4: what is meant by a zero of the function?'),
    A('why',
      "Nol bu grafik Ox ni kesib o'tadigan nuqta, u yerda funksiya qiymati nolga teng.",
      'Нуль это точка, где график пересекает Ox, там значение функции равно нулю.',
      'A zero is the point where the graph crosses Ox, where the function value equals zero.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "X kvadrat minus besh x qo'shi olti funksiyasining nollari ikki va uch. Bu qanday ma'noni bildiradi?",
        'Нули функции x в квадрате минус пять x плюс шесть, это два и три. Что это означает?',
        'The zeros of the function x squared minus five x plus six are two and three. What does that mean?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L('Ikki va uchda funksiya nolga teng, grafik shu yerda Ox ni kesadi', 'В двух и в трёх функция равна нулю, график пересекает там Ox', 'At two and three the function equals zero, the graph crosses Ox there'),
        },
        {
          id: 'wrong',
          label: L('Ikki va uch funksiyaning eng katta qiymatlari', 'Два и три, наибольшие значения функции', 'Two and three are the largest values of the function'),
          hint: L(
            "Nol degani funksiya qiymati nolga teng bo'lgan joy, eng katta qiymat emas.",
            'Нуль это место, где значение функции равно нулю, а не наибольшее значение.',
            'A zero is where the function value equals zero, not the largest value.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bugun aynan shu ikki noldan boshlaymiz.",
        'Верно. Сегодня начнём именно с этих двух нулей.',
        'Correct. Today we start with exactly these two zeros.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — TO'LIQ ISHLAB CHIQISH: x²−5x+6>0.
// SignAxis birinchi marta: nollarni qo'yish, sinov, ishoralarni o'qish,
// bo'yash.
// ============================================================
const S3 = {
  eyebrow: L('BOSH ASBOB', 'ГЛАВНЫЙ ПРИБОР', 'THE MAIN TOOL'),
  title: L(
    "Grafik va son o'qi: birinchi ishlash",
    'График и числовая ось: первая работа',
    'The graph and the number line: working it for the first time',
  ),
  audio: [
    A('mount',
      "Tepada grafik, pastda son o'qi. Avval ikkita nolni o'qqa qo'ying.",
      'Сверху график, снизу числовая ось. Сначала поставь на ось два нуля.',
      'The graph is above, the number line is below. First place the two zeros on the axis.'),
    W('roots',
      "Endi eng o'ng oraliqning ishorasini sonni qo'yib isbotlang, keyin qolgan ikkitasini grafikdan o'qing va tengsizlikka mos joyni bo'yang.",
      'Теперь докажи знак самого правого промежутка числом, потом прочитай оставшиеся два по графику и закрась подходящее место.',
      'Now prove the sign of the rightmost interval with a number, then read the other two from the graph and paint the matching place.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={Q1}
      from={0} to={5} yFrom={-1.5} yTo={7}
      roots={[2, 3]} strict target="gt"
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "x kvadrat minus besh x qo'shi olti musbat qachon: ikkita nolni qo'yib boshlang",
        'Когда x в квадрате минус пять x плюс шесть положительно: начни с постановки двух нулей',
        'When is x squared minus five x plus six positive: start by placing the two zeros',
      )}
      after={L(
        "Ana xolos. Chap va o'ng oraliqlar bo'yaldi, o'rtadagisi qoldi: javob ikkita ajralgan oraliqdan iborat.",
        'Вот и всё. Левый и правый промежутки закрашены, средний остался: ответ состоит из двух отдельных промежутков.',
        'That is all it takes. The left and right intervals are painted, the middle one is left out: the answer is two separate intervals.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — TESKARI HOLAT: 2x²−x−1<=0, javob O'RTADA.
// ============================================================
const S4 = {
  eyebrow: L('TESKARI HOLAT', 'ОБРАТНЫЙ СЛУЧАЙ', 'THE REVERSE CASE'),
  title: L(
    "Bu safar javob o'rtada",
    'На этот раз ответ в середине',
    'This time the answer is in the middle',
  ),
  audio: [
    A('mount',
      "Yangi funksiya: ikki x kvadrat minus x minus bir. Nollari minus nol butun besh o'ndan va bir.",
      'Новая функция: два x в квадрате минус x минус один. Её нули минус ноль целых пять десятых и один.',
      'A new function: two x squared minus x minus one. Its zeros are minus zero point five and one.'),
    A('why',
      "Bu safar tengsizlik kichik yoki teng ekanini so'raydi, qat'iy emas: chegara nollar ham javobga kiradi.",
      'На этот раз неравенство спрашивает про меньше или равно, не строго: граничные нули тоже входят в ответ.',
      'This time the inequality asks for less than or equal, not strict: the boundary zeros are included in the answer too.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={Q2}
      from={-1.5} to={2} yFrom={-1.5} yTo={5.5}
      roots={[-0.5, 1]} target="le"
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "Ikki x kvadrat minus x minus bir kichik yoki nolga teng qachon: nollarni qo'ying va oraliqlarni o'qing",
        'Когда два x в квадрате минус x минус один меньше или равно нулю: поставь нули и прочитай промежутки',
        'When is two x squared minus x minus one less than or equal to zero: place the zeros and read the intervals',
      )}
      after={L(
        "Ana xolos. Bu safar faqat o'rtadagi oraliq bo'yaldi, chegaralar to'liq doira bilan: ular ham javobga kiradi.",
        'Вот и всё. На этот раз закрашен только средний промежуток, границы полным кружком: они тоже входят в ответ.',
        'That is all it takes. This time only the middle interval is painted, the boundaries as filled circles: they belong to the answer too.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — JAVOB IKKI ORALIQ BO'LISHI MUMKIN.
// ============================================================
const S5 = {
  eyebrow: L('IKKI ORALIQ', 'ДВА ПРОМЕЖУТКА', 'TWO INTERVALS'),
  title: L(
    "Javobni bitta belgida yozib bo'lmaydi",
    'Ответ нельзя записать одним знаком',
    'The answer cannot be written with one sign',
  ),
  audio: [
    A('mount',
      "3-ekranda x ikkidan kichik yoki x uchdan katta bo'lgan ikkita oraliq bo'yalgan edi.",
      'На 3 экране закрасились два промежутка: x меньше двух или x больше трёх.',
      'On screen 3, two intervals got painted: x less than two, or x greater than three.'),
    A('why',
      "Bu ikkitasi ulanmagan, orasida o'rtadagi manfiy oraliq turibdi.",
      'Эти два не соединены, между ними стоит средний, отрицательный промежуток.',
      'These two are not connected, the middle, negative interval stands between them.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "X ikkidan kichik yoki x uchdan katta, bularni bitta uzluksiz oraliq deb yozish mumkinmi?",
        'x меньше двух или x больше трёх, можно ли записать это как один непрерывный промежуток?',
        'x less than two or x greater than three, can this be written as one continuous interval?',
      )}
      cols={1}
      items={[
        { id: 'no', right: true, label: L("Yo'q, ular orasida o'rtadagi oraliq bor, ular ulanmagan", 'Нет, между ними средний промежуток, они не соединены', 'No, the middle interval is between them, they are not connected') },
        {
          id: 'yes',
          label: L('Ha, ikkalasini birlashtirsa bo\'ladi', 'Да, их можно объединить', 'Yes, they can be combined'),
          hint: L(
            "Ikki va uch orasidagi sonlarni tekshiring: masalan ikki yarim tengsizlikka mos kelmaydi.",
            'Проверь числа между двумя и тремя: например, два с половиной не подходит неравенству.',
            'Check the numbers between two and three: for example, two and a half does not fit the inequality.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Javob ikkita alohida oraliqdan iborat bo'lishi mumkin, va bu tabiiy holat, xato emas.",
        'Верно. Ответ может состоять из двух отдельных промежутков, и это нормальный случай, а не ошибка.',
        'Correct. The answer can consist of two separate intervals, and this is a normal case, not a mistake.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — ISHORA NEGA ALMASHADI (ko'paytuvchilar).
// ============================================================
const S6 = {
  eyebrow: L('NEGA ALMASHADI', 'ПОЧЕМУ МЕНЯЕТСЯ', 'WHY IT FLIPS'),
  title: L(
    "Ishora nega har nolda almashadi",
    'Почему знак меняется в каждом нуле',
    'Why the sign flips at every zero',
  ),
  audio: [
    A('mount',
      "X kvadrat minus besh x qo'shi olti, ko'paytmaga ajratilsa: x minus ikki, ko'paytirilgan x minus uch.",
      'x в квадрате минус пять x плюс шесть, разложенное на множители: x минус два, умноженное на x минус три.',
      'x squared minus five x plus six, factored: x minus two, times x minus three.'),
    A('why',
      "Ikki ko'paytuvchining ishoralari mos kelsa, natija musbat, mos kelmasa, natija manfiy.",
      'Если знаки двух множителей совпадают, результат положителен, если нет, результат отрицателен.',
      'If the two factors have matching signs, the result is positive, if not, the result is negative.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('(x − 2)(x − 3)', '(x − 2)(x − 3)', '(x − 2)(x − 3)')}
      steps={[
        { id: 'four', head: 'x = 4', lines: ['(4 − 2)(4 − 3)', '2 · 1 = 2'] },
        { id: 'two5', head: 'x = 2,5', lines: ['(2,5 − 2)(2,5 − 3)', '0,5 · (−0,5) = −0,25'] },
      ]}
      ask={L(
        "To'rtda ikkala ko'paytuvchi musbat edi. Ikki butun besh o'ndan da nima o'zgardi?",
        'При четырёх оба множителя были положительны. Что изменилось при двух целых пяти десятых?',
        'At four, both factors were positive. What changed at two point five?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Ikkinchi ko'paytuvchi manfiy bo'lib qoldi, birinchisi hamon musbat", 'Второй множитель стал отрицательным, первый остался положительным', 'The second factor became negative, the first stayed positive'),
        },
        {
          id: 'wrong',
          label: L("Ikkalasi ham manfiy bo'lib qoldi", 'Оба стали отрицательными', 'Both became negative'),
          hint: L(
            "X minus ikkini hisoblang: ikki butun besh o'ndan minus ikki musbat chiqadi, faqat ikkinchisi manfiy.",
            'Посчитай x минус два: два целых пять десятых минус два даёт положительное число, отрицателен только второй.',
            'Compute x minus two: two point five minus two gives a positive number, only the second one is negative.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Uch nuqtadan o'tganda faqat ikkinchi ko'paytuvchi ishorasini o'zgartirdi, shuning uchun butun ko'paytma manfiy bo'lib qoldi.",
        'Верно. При переходе через тройку только второй множитель поменял знак, поэтому всё произведение стало отрицательным.',
        'Correct. Crossing through three, only the second factor changed sign, so the whole product became negative.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — CHEGARA NUQTA: qat'iy va qat'iy emas.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L(
    "Nol javobga kiradimi",
    'Входит ли нуль в ответ',
    'Does the zero belong in the answer',
  ),
  audio: [
    A('mount',
      "3-ekranda tengsizlik qat'iy edi, musbat, nolga teng emas. 4-ekranda kichik yoki nolga teng edi.",
      'На 3 экране неравенство было строгим, положительно, не равно нулю. На 4 экране, меньше или равно.',
      'On screen 3 the inequality was strict, positive, not equal to zero. On screen 4, less than or equal.'),
    A('why',
      "Qat'iy tengsizlikda nolning o'zi javobga kirmaydi, chunki u aynan nolga teng, musbat yoki manfiy emas.",
      'В строгом неравенстве сам нуль в ответ не входит, потому что он равен именно нулю, не положителен и не отрицателен.',
      'In a strict inequality the zero itself is not in the answer, because it equals exactly zero, neither positive nor negative.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "X kvadrat minus besh x qo'shi olti musbat (qat'iy). X teng ikki shu tengsizlikni qanoatlantiradimi?",
        'x в квадрате минус пять x плюс шесть положительно (строго). Удовлетворяет ли x равное двум этому неравенству?',
        'x squared minus five x plus six is positive (strict). Does x equal two satisfy this inequality?',
      )}
      cols={1}
      items={[
        { id: 'no', right: true, label: L("Yo'q, ikkida qiymat nolga teng, musbat emas", 'Нет, при двух значение равно нулю, не положительно', 'No, at two the value equals zero, not positive') },
        {
          id: 'yes',
          label: L('Ha, ikki chegarada, demak kiradi', 'Да, два на границе, значит входит', 'Yes, two is on the boundary, so it belongs'),
          hint: L(
            "Ikki bu funksiyaning noli, u yerda qiymat aniq nolga teng. Tengsizlik esa qat'iy musbatlikni so'raydi.",
            'Два это нуль функции, там значение равно ровно нулю. А неравенство требует строгой положительности.',
            'Two is a zero of the function, there the value equals exactly zero. The inequality requires strict positivity.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Qat'iy tengsizlikda chegara nol javobdan chiqarib tashlanadi, ochiq doira bilan belgilanadi.",
        'Верно. В строгом неравенстве граничный нуль исключается из ответа, отмечается открытым кружком.',
        'Correct. In a strict inequality the boundary zero is excluded from the answer, marked with an open circle.',
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
    STATEMENTS[0],
    STATEMENTS[1],
    STATEMENTS[2],
  ],
  source: L(
    "Algebra 9, 6-§ (24-25-bet), 7-§ (28-29-bet)",
    'Алгебра 9, §6 (стр. 24-25), §7 (стр. 28-29)',
    'Algebra 9, §6 (p. 24-25), §7 (p. 28-29)',
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
        steps={[]}
        ask={L(
          "Kvadrat tengsizlikni yechishning ikki yo'li bo'ldi. Ular qanday bog'langan?",
          'Было два пути решения квадратного неравенства. Как они связаны?',
          'There were two ways to solve a quadratic inequality. How are they connected?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Ikkalasi ham bir xil javob beradi: ko'paytuvchilar orqali yoki grafikdan", 'Оба дают один и тот же ответ: через множители или по графику', 'Both give the same answer: through factors or from the graph'),
          },
          {
            id: 'wrong',
            label: L('Ular butunlay boshqa-boshqa javob beradi', 'Они дают совершенно разные ответы', 'They give completely different answers'),
            hint: L(
              "3-ekranda ikkala yo'l ham bir xil ikkita oraliqni berdi: ular bir xil tengsizlikning ikki tomoni.",
              'На 3 экране оба пути дали один и тот же результат, два промежутка: это два взгляда на одно неравенство.',
              'On screen 3 both paths gave the same result, two intervals: they are two views of the same inequality.',
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
    "Ko'paytuvchilar, grafik va chegara",
    'Множители, график и граница',
    'Factors, the graph, and the boundary',
  ),
  audio: [
    A('mount',
      "Olti ekranda siz ikkita usulda ham javobni o'z qo'lingiz bilan topdingiz. Endi ular qoida sifatida.",
      'На шести экранах ты сам нашёл ответ обоими способами. Теперь они в виде правила.',
      'On six screens you found the answer both ways with your own hands. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Uchtasi ham darslikdan.",
      'Правило открылось. Все три из учебника.',
      'The rule is open. All three are from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — SignAxis TAKRORI. x²−x−2<0, javob o'rtada, qat'iy.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Yana bir marta: to'rttala qadam",
    'Ещё раз: все четыре шага',
    'One more time: all four steps',
  ),
  audio: [
    A('mount',
      "Yangi funksiya, xuddi shu to'rtta qadam: nollarni qo'yish, sinov, ishoralarni o'qish, bo'yash.",
      'Новая функция, те же четыре шага: поставить нули, проверить числом, прочитать знаки, закрасить.',
      'A new function, the same four steps: place the zeros, test with a number, read the signs, paint.'),
    A('why',
      "Bu safar tengsizlik qat'iy manfiylikni so'raydi: chegaralar ochiq doira bilan bo'ladi.",
      'На этот раз неравенство требует строгой отрицательности: границы будут с открытым кружком.',
      'This time the inequality asks for strict negativity: the boundaries will have an open circle.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={Q3}
      from={-2.5} to={3.5} yFrom={-3} yTo={7}
      roots={[-1, 2]} strict target="lt"
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "x kvadrat minus x minus ikki manfiy qachon: to'rtta qadamni qaytadan bajaring",
        'Когда x в квадрате минус x минус два отрицательно: пройди все четыре шага заново',
        'When is x squared minus x minus two negative: go through all four steps again',
      )}
      after={L(
        "Ana xolos. Bu safar faqat o'rtadagi oraliq bo'yaldi, chegaralar ochiq doira bilan: nollar javobga kirmaydi.",
        'Вот и всё. На этот раз закрашен только средний промежуток, границы открытым кружком: нули не входят в ответ.',
        'That is all it takes. This time only the middle interval is painted, boundaries with an open circle: the zeros are not in the answer.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: nechta oraliq va qaysi tomonda.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Tez tanish: qaysi rasm qaysi tengsizlikka mos",
    'Быстрое распознавание: какой рисунок какому неравенству подходит',
    'Quick recognition: which picture matches which inequality',
  ),
  audio: [
    A('mount',
      "To'rtta savol birin ketin. Har birida oraliqlar soni va o'rni haqida.",
      'Четыре вопроса подряд. Каждый про число и место промежутков.',
      'Four questions in a row. Each about the number and place of the intervals.'),
    A('why',
      "Ishorani parabolaning yo'nalishidan va nollar sonidan o'ylab toping.",
      'Определяй знак, отталкиваясь от направления параболы и числа нулей.',
      'Work out the sign from the direction of the parabola and the number of zeros.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham topildi: tarmoqlar yuqoriga qaragan parabolada tashqi oraliqlar musbat, o'rtadagisi manfiy.",
      'Все четыре найдены: у параболы с ветвями вверх крайние промежутки положительны, средний отрицателен.',
      'All four are found: for a parabola with branches up, the outer intervals are positive, the middle one is negative.',
    ),
    tasks: [
      {
        expr: 'y = (x − 1)(x − 4) > 0',
        question: L('Javobda nechta oraliq bo\'ladi?', 'Сколько промежутков в ответе?', 'How many intervals in the answer?'),
        ok: L("Ha. Tarmoqlar yuqoriga qaragan, tashqi ikki oraliq musbat.", 'Да. Ветви вверх, два крайних промежутка положительны.', 'Yes. Branches up, the two outer intervals are positive.'),
        items: [
          { id: 'a', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'b', label: L('Bitta', 'Один', 'One'), hint: L("Bu yerda ham tashqi ikki oraliq musbat, ular ajralgan.", 'Здесь тоже два крайних промежутка положительны, они разделены.', 'Here too the two outer intervals are positive, and they are separate.') },
        ],
        solution: [
          L('Nollar: 1, 4', 'Нули: 1, 4', 'Zeros: 1, 4'),
          L('Tashqi ikki oraliq musbat', 'Два внешних промежутка положительны', 'The two outer intervals are positive'),
          L('x < 1 yoki x > 4', 'x < 1 или x > 4', 'x < 1 or x > 4'),
        ],
      },
      {
        expr: 'y = (x + 2)(x − 5) < 0',
        question: L("Javob qaysi tomonda: tashqarida yoki o'rtada?", "Ответ снаружи или в середине?", 'Is the answer outside or in the middle?'),
        ok: L("Ha. Manfiylik so'ralgan, o'rtadagi oraliq manfiy.", 'Да. Спрошена отрицательность, средний промежуток отрицателен.', 'Yes. Negativity is asked, the middle interval is negative.'),
        items: [
          { id: 'a', right: true, label: L("O'rtada", 'В середине', 'In the middle') },
          { id: 'b', label: L('Tashqarida', 'Снаружи', 'Outside'), hint: L("Tashqi oraliqlar bu yerda musbat, tengsizlik esa manfiylikni so'raydi.", 'Крайние промежутки здесь положительны, а неравенство спрашивает про отрицательность.', 'The outer intervals here are positive, and the inequality asks about negativity.') },
        ],
        solution: [
          L('Nollar: −2, 5', 'Нули: −2, 5', 'Zeros: −2, 5'),
          L("O'rtadagi oraliq manfiy", 'Средний промежуток отрицателен', 'The middle interval is negative'),
          '−2 < x < 5',
        ],
      },
      {
        expr: 'y = (x − 3)(x + 1) ≥ 0',
        question: L('Nollarning o\'zi javobga kiradimi?', 'Сами нули входят в ответ?', 'Do the zeros themselves belong to the answer?'),
        ok: L("Ha. Katta yoki teng, qat'iy emas: chegara kiradi.", 'Да. Больше или равно, нестрого: граница входит.', 'Yes. Greater than or equal, non-strict: the boundary is included.'),
        items: [
          { id: 'a', right: true, label: L('Ha, kiradi', 'Да, входят', 'Yes, they belong') },
          { id: 'b', label: L("Yo'q, kirmaydi", 'Нет, не входят', 'No, they do not belong'), hint: L("Belgiga qarang: katta yoki TENG, bu qat'iy emas degani.", 'Посмотри на знак: больше или РАВНО, это значит не строго.', 'Look at the sign: greater than OR EQUAL, that means non-strict.') },
        ],
        solution: [
          L("Belgi qat'iy emas", 'Знак нестрогий', 'The sign is not strict'),
          L('Chegara nollar javobga kiradi', 'Граничные нули входят в ответ', 'The boundary zeros belong in the answer'),
          L('x ≤ −1 yoki x ≥ 3', 'x ≤ −1 или x ≥ 3', 'x ≤ −1 or x ≥ 3'),
        ],
      },
      {
        expr: 'y = (x + 4)(x − 2) > 0',
        question: L("X nol bu tengsizlikni qanoatlantiradimi?", "Удовлетворяет ли x равное нулю этому неравенству?", 'Does x equal zero satisfy this inequality?'),
        ok: L("Ha. Nol o'rtadagi oraliqda turibdi, u yerda ishora manfiy emas, funksiyani hisoblang: to'rt karra minus ikki, minus sakkiz, manfiy.", 'Нет. Нуль находится в среднем промежутке, там знак не подходит: подставь, четыре умножить на минус два, минус восемь, отрицательно.', 'No. Zero is in the middle interval, where the sign does not fit: substitute, four times minus two, minus eight, negative.'),
        items: [
          { id: 'a', label: L('Ha, qanoatlantiradi', 'Да, удовлетворяет', 'Yes, it does'), hint: L("Nolni qo'yib hisoblang: to'rt karra minus ikki, natija manfiy chiqadi, tengsizlik esa musbatlikni so'raydi.", 'Подставь ноль и посчитай: четыре, умноженное на минус два, даёт отрицательное число, а неравенство требует положительного.', 'Substitute zero and compute: four times minus two gives a negative number, and the inequality asks for positive.') },
          { id: 'b', right: true, label: L("Yo'q, qanoatlantirmaydi", 'Нет, не удовлетворяет', 'No, it does not') },
        ],
        solution: [
          L('Nollar: −4, 2', 'Нули: −4, 2', 'Zeros: −4, 2'),
          L("Nol o'rtadagi oraliqda, u yerda ishora manfiy", 'Нуль в среднем промежутке, там знак отрицательный', 'Zero is in the middle interval, where the sign is negative'),
          L('x = 0 javobga kirmaydi', 'x = 0 не входит в ответ', 'x = 0 does not belong in the answer'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — CHEGARA: qat'iy va qat'iy emas belgilar.
// ============================================================
const S11 = {
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L(
    "Belgiga qarab: ochiq yoki to'liq doira",
    'По знаку: открытый или полный кружок',
    'By the sign: open or filled circle',
  ),
  audio: [
    A('mount',
      "Uchta tengsizlik, har birida belgi boshqa. Chegara nol javobga kiradimi, yo'qmi?",
      'Три неравенства, в каждом свой знак. Входит ли граничный нуль в ответ?',
      'Three inequalities, each with a different sign. Does the boundary zero belong to the answer?'),
    A('why',
      "Belgida tenglik bo'lsa, chegara kiradi. Faqat katta yoki faqat kichik bo'lsa, chiqadi.",
      'Если в знаке есть равенство, граница входит. Если только больше или только меньше, не входит.',
      'If the sign includes equality, the boundary is included. If it is only greater or only less, it is not.'),
  ],
  props: {
    stepLabel: L('Tengsizlik', 'Неравенство', 'Inequality'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham tekshirildi: belgidagi tenglik chegara nolning javobga kirish yoki kirmasligini hal qiladi.",
      'Все три проверены: наличие равенства в знаке решает, входит ли граничный нуль в ответ.',
      'All three are checked: the equals part of the sign decides whether the boundary zero belongs to the answer.',
    ),
    tasks: [
      {
        expr: 'x² − 4 > 0',
        question: L('Ikki va minus ikki javobga kiradimi?', 'Два и минус два входят в ответ?', 'Do two and minus two belong to the answer?'),
        ok: L("Yo'q. Belgi qat'iy, faqat katta, tenglik yo'q.", 'Нет. Знак строгий, только больше, равенства нет.', 'No. The sign is strict, only greater, no equality.'),
        items: [
          { id: 'a', right: true, label: L("Yo'q, kirmaydi", 'Нет, не входят', 'No, they do not') },
          { id: 'b', label: L('Ha, kiradi', 'Да, входят', 'Yes, they do'), hint: L("Belgida tenglik yo'q, faqat qat'iy katta.", 'В знаке нет равенства, только строго больше.', 'The sign has no equality, only strictly greater.') },
        ],
        solution: [
          L("Belgi qat'iy: >", 'Знак строгий: >', 'The sign is strict: >'),
          L('Chegara nollar javobdan chiqadi', 'Граничные нули исключаются из ответа', 'The boundary zeros are excluded from the answer'),
        ],
      },
      {
        expr: 'x² − 4 ≤ 0',
        question: L('Ikki va minus ikki javobga kiradimi?', 'Два и минус два входят в ответ?', 'Do two and minus two belong to the answer?'),
        ok: L("Ha. Belgida tenglik bor: kichik yoki teng.", 'Да. В знаке есть равенство: меньше или равно.', 'Yes. The sign has equality: less than or equal.'),
        items: [
          { id: 'a', right: true, label: L('Ha, kiradi', 'Да, входят', 'Yes, they do') },
          { id: 'b', label: L("Yo'q, kirmaydi", 'Нет, не входят', 'No, they do not'), hint: L("Belgiga qarang: kichik yoki TENG, tenglik bor.", 'Посмотри на знак: меньше или РАВНО, равенство есть.', 'Look at the sign: less than OR EQUAL, equality is present.') },
        ],
        solution: [
          L("Belgi qat'iy emas: ≤", 'Знак нестрогий: ≤', 'The sign is not strict: ≤'),
          L('Chegara nollar javobga kiradi', 'Граничные нули входят в ответ', 'The boundary zeros belong in the answer'),
        ],
      },
      {
        expr: 'x² − 4 ≥ 0',
        question: L('Grafikda chegara nollar qanday belgilanadi: ochiq yoki to\'liq doira?', 'Как отмечаются граничные нули на графике: открытым или полным кружком?', 'How are the boundary zeros marked on the graph: open or filled circle?'),
        ok: L("To'liq doira. Belgida tenglik bor, chegara javobga kiradi.", 'Полным кружком. В знаке есть равенство, граница входит в ответ.', 'Filled circle. The sign has equality, the boundary is included in the answer.'),
        items: [
          { id: 'a', right: true, label: L("To'liq doira", 'Полный кружок', 'Filled circle') },
          { id: 'b', label: L('Ochiq doira', 'Открытый кружок', 'Open circle'), hint: L("Ochiq doira faqat qat'iy tengsizlikda ishlatiladi, bu yerda tenglik bor.", 'Открытый кружок используется только в строгом неравенстве, а здесь есть равенство.', 'The open circle is used only for a strict inequality, and here there is equality.') },
        ],
        solution: [
          L("Belgi qat'iy emas: ≥", 'Знак нестрогий: ≥', 'The sign is not strict: ≥'),
          L("To'liq doira", 'Полный кружок', 'Filled circle'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Kamolaning "yechimida" javob bitta oraliq deb yozilgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Bitta oraliq deb yozilgan javob",
    'Ответ, записанный как один промежуток',
    'An answer written as one interval',
  ),
  audio: [
    A('mount',
      "Kamolaning yechimi. X kvadrat minus besh x qo'shi olti musbat tengsizligi uchun u javobni ikki dan katta deb yozdi.",
      'Решение Камолы. Для неравенства x в квадрате минус пять x плюс шесть больше нуля она записала ответ как x больше двух.',
      "Kamola's solution. For the inequality x squared minus five x plus six greater than zero, she wrote the answer as x greater than two."),
    A('why',
      "Uning yozuvini o'qing va o'rtadagi oraliqni tekshirib, o'zingiz baholang.",
      'Прочитай её запись и, проверив средний промежуток, оцени сама.',
      'Read her notation and, checking the middle interval, judge for yourself.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikki dan katta yozuvi o'rtadagi manfiy oraliqni ham qamrab oladi, u esa tengsizlikka mos kelmaydi.",
      'Запись больше двух захватывает и средний, отрицательный промежуток, а он не подходит неравенству.',
      'The notation greater than two also covers the middle, negative interval, and it does not fit the inequality.',
    ),
    tasks: [
      {
        expr: 'x² − 5x + 6 > 0',
        question: L(
          "Kamola javobni x ikkidan katta deb yozdi. Unda ikki butun besh o'ndan ham javobga kiradi. Tekshiring: bu to'g'rimi?",
          'Камола записала ответ как x больше двух. Тогда два целых пять десятых тоже входит в ответ. Проверь: это верно?',
          "Kamola wrote the answer as x greater than two. Then two point five also belongs to the answer. Check: is this right?",
        ),
        ok: L(
          "Yo'q, noto'g'ri. Ikki butun besh o'ndan o'rtadagi manfiy oraliqda turibdi, u yerda funksiya qiymati manfiy, tengsizlikka mos kelmaydi.",
          'Нет, неверно. Два целых пять десятых стоит в среднем, отрицательном промежутке, там значение функции отрицательно, неравенству не подходит.',
          'No, it is wrong. Two point five stands in the middle, negative interval, there the function value is negative, it does not fit the inequality.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Noto'g'ri, ikki butun besh o'ndan o'rtadagi manfiy oraliqda", 'Неверно, два целых пять десятых в среднем, отрицательном промежутке', 'Wrong, two point five is in the middle, negative interval'),
          },
          {
            id: 'b',
            label: L("To'g'ri, u ikkidan katta", "Верно, оно больше двух", 'Correct, it is greater than two'),
            hint: L("Formulaga qo'ying: ikki butun besh o'ndan uchun natija manfiy chiqadi, tengsizlik esa musbatlikni so'raydi.", 'Подставь в формулу: для двух целых пяти десятых результат получается отрицательным, а неравенство требует положительного.', 'Substitute into the formula: for two point five the result comes out negative, and the inequality asks for positive.'),
          },
        ],
        solution: [
          'y(2,5) = 2,5² − 5 · 2,5 + 6',
          'y(2,5) = 6,25 − 12,5 + 6 = −0,25',
          L("To'g'ri javob: x < 2 yoki x > 3", 'Верный ответ: x < 2 или x > 3', 'Correct answer: x < 2 or x > 3'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TESKARI TOPSHIRIQ — bo'yalgan rasmdan tengsizlikni tanlash.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI', 'ОБРАТНОЕ', 'THE REVERSE'),
  title: L(
    "Rasmdan tengsizlikka",
    'От рисунка к неравенству',
    'From the picture to the inequality',
  ),
  audio: [
    A('mount',
      "Bu safar boshqa tomondan: qaysi oraliqlar bo'yalgani berilgan, tengsizlikni siz tanlaysiz.",
      'На этот раз наоборот: дано, какие промежутки закрашены, а неравенство выбираешь ты.',
      'This time it is the other way round: which intervals are painted is given, you choose the inequality.'),
    A('why',
      "Bo'yalgan joy musbatmi, manfiymi va nollar javobga kiradimi, shularga qarang.",
      'Смотри, закрашенное место положительно или отрицательно, и входят ли нули в ответ.',
      'Look at whether the painted place is positive or negative, and whether the zeros belong to the answer.',
    ),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: rasmdan tengsizlikka qaytish ham xuddi shu qoidaga tayanadi, faqat teskari tartibda.",
      'Найдено: путь от рисунка назад к неравенству опирается на то же самое правило, только в обратном порядке.',
      'Found: going backward from the picture to the inequality relies on the same rule, just in reverse order.',
    ),
    tasks: [
      {
        expr: 'x1 = 1, x2 = 4',
        question: L(
          "Nollar bir va to'rt. Bo'yalgan o'rtadagi oraliq, chegaralar ochiq doira. Qaysi tengsizlik bu rasmni beradi?",
          'Нули один и четыре. Закрашен средний промежуток, границы открытым кружком. Какое неравенство даёт этот рисунок?',
          'The zeros are one and four. The middle interval is painted, boundaries as open circles. Which inequality gives this picture?',
        ),
        ok: L("Ha. O'rtadagi oraliq manfiy, ochiq doira qat'iy tengsizlikni bildiradi.", 'Да. Средний промежуток отрицателен, открытый кружок означает строгое неравенство.', 'Yes. The middle interval is negative, the open circle means a strict inequality.'),
        items: [
          { id: 'a', right: true, label: '(x − 1)(x − 4) < 0' },
          { id: 'b', label: '(x − 1)(x − 4) > 0', hint: L("Bu belgi tashqi oraliqlarni beradi, o'rtadagini emas.", 'Этот знак даёт крайние промежутки, а не средний.', 'This sign gives the outer intervals, not the middle one.') },
          { id: 'c', label: '(x − 1)(x − 4) ≤ 0', hint: L("Ochiq doira qat'iy emaslikka emas, aynan qat'iylikka mos keladi.", 'Открытый кружок соответствует именно строгости, а не нестрогости.', 'The open circle matches strictness, not non-strictness.') },
        ],
        solution: [
          L("O'rtadagi oraliq manfiy: <", 'Средний промежуток отрицателен: <', 'The middle interval is negative: <'),
          L("Ochiq doira: qat'iy", 'Открытый кружок: строго', 'Open circle: strict'),
          '(x − 1)(x − 4) < 0',
        ],
      },
      {
        expr: 'x1 = −2, x2 = 3',
        question: L(
          "Nollar minus ikki va uch. Bo'yalgan tashqi ikki oraliq, chegaralar to'liq doira. Qaysi tengsizlik bu rasmni beradi?",
          'Нули минус два и три. Закрашены два крайних промежутка, границы полным кружком. Какое неравенство даёт этот рисунок?',
          'The zeros are minus two and three. The two outer intervals are painted, boundaries as filled circles. Which inequality gives this picture?',
        ),
        ok: L("Ha. Tashqi ikki oraliq musbat, to'liq doira qat'iy emaslikni bildiradi.", 'Да. Два крайних промежутка положительны, полный кружок означает нестрогость.', 'Yes. The two outer intervals are positive, the filled circle means non-strict.'),
        items: [
          { id: 'a', right: true, label: '(x + 2)(x − 3) ≥ 0' },
          { id: 'b', label: '(x + 2)(x − 3) ≤ 0', hint: L("Bu belgi o'rtadagi oraliqni beradi, tashqilarini emas.", 'Этот знак даёт средний промежуток, а не крайние.', 'This sign gives the middle interval, not the outer ones.') },
        ],
        solution: [
          L('Tashqi ikki oraliq musbat: ≥', 'Два внешних промежутка положительны: ≥', 'The two outer intervals are positive: ≥'),
          L("To'liq doira: qat'iy emas", 'Полный кружок: нестрого', 'Filled circle: not strict'),
          '(x + 2)(x − 3) ≥ 0',
        ],
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
    "Blits: oraliqlar soni, o'rni, chegara",
    'Блиц: число промежутков, место, граница',
    'Blitz: number of intervals, place, boundary',
  ),
  audio: [
    A('mount',
      "To'rtta savol birin ketin. Ular tez fikrlashni so'raydi, uzoq hisobni emas.",
      'Четыре вопроса один за другим. Они требуют быстрой мысли, а не долгого счёта.',
      'Four questions one after another. They call for quick thinking, not a long computation.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi.",
      'Счёт идёт по первой попытке.',
      'The count goes by the first attempt.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'javob-doim-bitta-oraliq',
        ask: L(
          "Parabolaning ikkita noli bor, tarmoqlari yuqoriga qaragan. Musbatlik so'ralsa, javobda nechta oraliq bo'lishi mumkin?",
          'У параболы два нуля, ветви вверх. Если спрошена положительность, сколько промежутков может быть в ответе?',
          'A parabola has two zeros, branches up. If positivity is asked, how many intervals can the answer have?',
        ),
        options: [
          { id: 'two', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'one', label: L('Doim bitta', 'Всегда один', 'Always one') },
        ],
        ok: L(
          "To'g'ri. Tashqi ikki oraliq ham musbat, ular ajralgan holda javobga kiradi.",
          'Верно. Оба крайних промежутка положительны, они входят в ответ по отдельности.',
          'Correct. Both outer intervals are positive, they belong to the answer separately.',
        ),
        hint: L(
          "3-ekranni eslang: chap va o'ng oraliqlar ikkalasi ham bo'yalgan edi.",
          'Вспомни 3 экран: и левый, и правый промежутки были закрашены.',
          'Recall screen 3: both the left and right intervals were painted.',
        ),
      },
      {
        id: 'q2',
        tag: 'javob-doim-tashqi-oraliq',
        ask: L(
          "Kichik yoki teng tengsizlik so'ralganda, javob doim tashqi ikki oraliqmi?",
          'Когда спрошено меньше или равно, ответ всегда два крайних промежутка?',
          'When less than or equal is asked, is the answer always the two outer intervals?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. 4-ekranda kichik yoki teng tengsizlik uchun aynan o'rtadagi oraliq javob bo'ldi.",
          'Верно. На 4 экране для неравенства меньше или равно ответом стал именно средний промежуток.',
          'Correct. On screen 4, for the less-than-or-equal inequality the answer was exactly the middle interval.',
        ),
        hint: L(
          "Parabolaning yo'nalishiga qarang: tarmoqlar yuqoriga qaragan bo'lsa, manfiylik o'rtada turadi.",
          'Смотри на направление параболы: если ветви вверх, отрицательность стоит в середине.',
          'Look at the direction of the parabola: if the branches point up, negativity sits in the middle.',
        ),
      },
      {
        id: 'q3',
        tag: 'belgi-almashtirish-notogri',
        ask: L(
          "Grafik biror oraliqda Ox dan pastda turibdi. U yerda funksiya ishorasi qanday?",
          'На каком-то промежутке график ниже оси Ox. Каков там знак функции?',
          'On some interval the graph is below the Ox axis. What is the sign of the function there?',
        ),
        options: [
          { id: 'neg', right: true, label: L('Manfiy', 'Отрицательный', 'Negative') },
          { id: 'pos', label: L('Musbat', 'Положительный', 'Positive') },
        ],
        ok: L(
          "To'g'ri. Ox dan pastda turgan nuqtaning ordinatasi manfiy.",
          'Верно. У точки ниже оси Ox ордината отрицательна.',
          'Correct. A point below the Ox axis has a negative y-coordinate.',
        ),
        hint: L(
          "Ordinata deganda y qiymati tushuniladi: Ox dan pastda y manfiy bo'ladi.",
          'Ордината это значение y: ниже оси Ox оно отрицательно.',
          'The y-coordinate is the value of y: below the Ox axis it is negative.',
        ),
      },
      {
        id: 'q4',
        tag: 'chegara-nuqta-kiritish',
        ask: L(
          "Tengsizlikda faqat katta belgisi bor, tenglik yo'q. Chegara nol javobga kiradimi?",
          'В неравенстве только знак больше, без равенства. Граничный нуль входит в ответ?',
          'The inequality has only the greater-than sign, no equality. Does the boundary zero belong to the answer?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Tenglik yo'q, demak tengsizlik qat'iy, chegara ochiq doira bilan chiqarib tashlanadi.",
          'Верно. Равенства нет, значит неравенство строгое, граница исключается открытым кружком.',
          'Correct. There is no equality, so the inequality is strict, the boundary is excluded with an open circle.',
        ),
        hint: L(
          "Belgida tenglik bo'lmasa, tengsizlik qat'iy: chegara nuqta hech qachon kirmaydi.",
          'Если в знаке нет равенства, неравенство строгое: граничная точка никогда не входит.',
          'If the sign has no equality, the inequality is strict: the boundary point never belongs.',
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN.
// ============================================================
const FIN_SC = scaleOf({ from: 0, to: 5, yFrom: -1.5, yTo: 7 })
// eslint-disable-next-line react-refresh/only-export-components
const FinalScene = () => {
  const t = useT()
  return (
    <div className="g9-scene-plain g8-scene-final">
      <Plane sc={FIN_SC} xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}>
        <g className="g9-real"><path d={pathOf(Q1, FIN_SC)} /></g>
        <line x1={FIN_SC.left} y1={FIN_SC.py(0)} x2={FIN_SC.right} y2={FIN_SC.py(0)}
          stroke="rgba(23,26,29,.28)" strokeWidth="1.4" />
        <line x1={FIN_SC.left} y1={FIN_SC.py(0)} x2={FIN_SC.px(2)} y2={FIN_SC.py(0)}
          stroke={T.ok} strokeWidth="3" />
        <line x1={FIN_SC.px(3)} y1={FIN_SC.py(0)} x2={FIN_SC.right} y2={FIN_SC.py(0)}
          stroke={T.ok} strokeWidth="3" />
        <circle cx={FIN_SC.px(2)} cy={FIN_SC.py(0)} r="3.6" fill={T.bg} stroke={T.ink} strokeWidth="2" />
        <circle cx={FIN_SC.px(3)} cy={FIN_SC.py(0)} r="3.6" fill={T.bg} stroke={T.ink} strokeWidth="2" />
      </Plane>
    </div>
  )
}

const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Kvadrat tengsizlik: to'rt qadam",
    'Квадратное неравенство: четыре шага',
    'Quadratic inequality: four steps',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda javobda nechta oraliq bo'lishini taxmin qildingiz. Endi rasmda hammasi yig'ilgan.",
      'На первом экране ты предположил, сколько промежутков будет в ответе. Теперь на рисунке всё собрано.',
      'On the first screen you guessed how many intervals the answer would have. Now the picture has it all assembled.'),
    A('s1',
      "Bugun siz nollarni topishni, ishorani sonni qo'yib va grafikdan o'qishni, javobni bo'yashni o'rgandingiz.",
      'Сегодня освоены нахождение нулей, чтение знака подстановкой и по графику, закрашивание ответа.',
      'Today you learned finding the zeros, reading the sign by substitution and from the graph, and painting the answer.'),
    A('s2',
      "Keyingi darsda butun tenglamalar: yangi blok boshlanadi.",
      'В следующем уроке целые уравнения: начинается новый блок.',
      'The next lesson covers whole equations: a new block begins.'),
  ],
  props: {
    mark: '(x − 2)(x − 3) > 0',
    markNote: L(
      "ko'paytuvchilarga ajratish",
      'разложение на множители',
      'factoring',
    ),
    lines: [
      L(
        "Javob ikkita ajralgan oraliqdan iborat bo'lishi mumkin",
        'Ответ может состоять из двух отдельных промежутков',
        'The answer can consist of two separate intervals',
      ),
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: butun tenglamalar',
      'Следующий урок: целые уравнения',
      'Next lesson: whole equations',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', scene: <HookScene/>, ...S1 },
  { role: 'support',  tag: 'belgi-almashtirish-notogri', ...S2 },
  { role: 'explain',  tag: 'belgi-almashtirish-notogri', ...S3 },
  { role: 'explain',  tag: 'javob-doim-tashqi-oraliq', ...S4 },
  { role: 'explain',  tag: 'javob-doim-bitta-oraliq', ...S5 },
  { role: 'explain',  tag: 'belgi-almashtirish-notogri', ...S6 },
  { role: 'explain',  tag: 'chegara-nuqta-kiritish', ...S7 },
  { role: 'rule',     tag: 'belgi-almashtirish-notogri', ...S8 },
  { role: 'practice', tool: 'signaxis', tag: 'javob-doim-bitta-oraliq', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'javob-doim-tashqi-oraliq', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'chegara-nuqta-kiritish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'javob-doim-bitta-oraliq', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'chegara-nuqta-kiritish', ...S13 },
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
