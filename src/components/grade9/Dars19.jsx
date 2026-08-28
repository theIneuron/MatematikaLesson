// ============================================================================
// 9-sinf, Dars 19. TENGSIZLIK MASALALARI.
//
// REDAKSIYA 1, 2026-08-27. BLOK 3 NING OXIRGI AMALIY DARSI. Darslik:
// II bobga mashqlar (86-87-bet). Bosh misol darslikning O'Z sonlarida:
// «Тестовые задания к главе II», 4-topshiriq (87-bet) — perimetri 30,
// yuzi 56 bo'lgan to'rtburchak, tomonlari 7 va 8. Bu dars uni TENGSIZLIK
// ko'rinishida oladi: yuz kamida 56 bo'lishi uchun tomon qanday bo'lsin.
// 207-mashq (86-bet) — tengsizliklar sistemasi, TRANSFER ekranida
// so'zma-so'z olingan. 206-mashq (86-bet) — matnli masalalar uslubi.
//
// 208-209-mashqlar (eng katta va eng kichik qiymat) ATAYLAB OLINMADI: ular
// o'rta arifmetik va o'rta geometrik tengsizligiga tayanadi, u esa 16-§
// (20-dars) mavzusi. Blokning oldiga o'tib ketmaslik uchun bu dars faqat
// 14-18-darslarning asboblari bilan ishlaydi.
//
// DARSNING O'Z QADAMI: matematik javobni MA'NO bo'yicha kesish. Tomon
// musbat, qatorlar soni butun — tengsizlikning yechimi bu shartlar bilan
// KESISHTIRILADI. Bu 16-darsdagi kesishma g'oyasining amaliy ishlatilishi:
// bitta tengsizlik matndan, ikkinchisi masalaning o'z ma'nosidan keladi.
//
// ASBOBLAR: `SignAxis` (tengsizlikni yechish), `Overlap` mode="and"
// (javobni ma'no shartiga kesish), `RecallMC`, `Drill`. Yangi asbob yo'q.
//
// TEGLAR (o'zining):
//   manoni-hisobga-olmaslik      — matematik javobni masalaning ma'nosi
//                                   bilan kesmaslik (manfiy uzunlik,
//                                   kasr sondagi predmet)
//   sozni-notogri-belgiga-otkazish — «kamida», «ko'pi bilan», «oshmaydi»
//                                   so'zlarini noto'g'ri belgiga o'tkazish
//   nomalumni-notogri-tanlash    — noma'lumni noqulay tanlab, ifodani
//                                   keraksiz murakkablashtirish
//   chegarani-javobga-qoshmaslik — «kamida» shartida chegara nuqtasini
//                                   javobdan tushirib qoldirish
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, Overlap, RecallMC, SignAxis } from './asboblar.jsx'

export const META = {
  id: 'grade9-19',
  n: 19,
  row: 19,
  block: 'Б3',
  topic: L('Tengsizlik masalalari', 'Задачи на неравенства', 'Inequality word problems'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Matndagi har bir shart o'z belgisini beradi: kamida bu katta yoki teng, oshmaydi bu kichik yoki teng",
    'Каждое условие в тексте даёт свой знак: не менее это больше или равно, не превышает это меньше или равно',
    'Each condition in the text gives its own sign: at least means greater than or equal, does not exceed means less than or equal',
  ),
  L(
    "Tengsizlikning yechimi masalaning ma'nosi bilan kesishtiriladi: uzunlik musbat, predmet soni butun",
    'Решение неравенства пересекают со смыслом задачи: длина положительна, число предметов целое',
    'The solution of the inequality is intersected with the meaning of the problem: a length is positive, a count is whole',
  ),
  L(
    "Javob son emas, oraliq bo'ladi, va u masalaning tilida o'qiladi",
    'Ответом будет не число, а промежуток, и его читают на языке задачи',
    'The answer is not a number but an interval, and it is read in the language of the problem',
  ),
]

export const MISS = {
  'manoni-hisobga-olmaslik': {
    what: L(
      "matematik javob masalaning ma'nosi bilan kesishtirilmadi",
      'математический ответ не пересечён со смыслом задачи',
      'the mathematical answer was not intersected with the meaning of the problem',
    ),
    wrong: null,
    at: 0,
  },
  'sozni-notogri-belgiga-otkazish': {
    what: L(
      "matndagi so'z noto'g'ri belgiga o'tkazildi",
      'слово из текста переведено в неверный знак',
      'a word from the text was turned into the wrong sign',
    ),
    wrong: null,
    at: 0,
  },
  'nomalumni-notogri-tanlash': {
    what: L(
      "noma'lum noqulay tanlanib, ifoda keraksiz murakkablashdi",
      'неизвестное выбрано неудобно, выражение усложнилось без нужды',
      'the unknown was chosen awkwardly, making the expression needlessly complex',
    ),
    wrong: null,
    at: 0,
  },
  'chegarani-javobga-qoshmaslik': {
    what: L(
      "kamida shartida chegara nuqtasi javobdan tushib qoldi",
      'при условии не менее граничная точка выпала из ответа',
      'with an "at least" condition the boundary point was dropped from the answer',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// DARSNING FUNKSIYALARI.
// ============================================================
// bosh misol: yarim perimetr 15, yuz kamida 56  ->  x² − 15x + 56 ≤ 0
// eslint-disable-next-line react-refresh/only-export-components
const AREA = (x) => x * x - 15 * x + 56
// mashq: yarim perimetr 12, yuz kamida 35  ->  x² − 12x + 35 ≤ 0
// eslint-disable-next-line react-refresh/only-export-components
const AREA2 = (x) => x * x - 12 * x + 35

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('JAVOB SON EMAS', 'ОТВЕТ НЕ ЧИСЛО', 'THE ANSWER IS NOT A NUMBER'),
  title: L(
    "Bu safar masala bitta son so'ramaydi",
    'На этот раз задача не просит одно число',
    'This time the problem does not ask for one number',
  ),
  audio: [
    A('mount',
      "To'rtburchakning perimetri o'ttiz metr. Yuzi kamida ellik olti kvadrat metr bo'lishi uchun tomoni qanday bo'lsin?",
      'Периметр прямоугольника тридцать метров. Каким должна быть сторона, чтобы площадь была не менее пятидесяти шести квадратных метров?',
      'The perimeter of a rectangle is thirty metres. What should the side be so that the area is at least fifty six square metres?'),
    A('why',
      "13-darsda masala tenglamaga keltirilgan edi va javob bitta son bo'lgan. Bu yerda so'z kamida, ya'ni ko'p bo'lsa ham bo'ladi.",
      'На 13 уроке задача сводилась к уравнению и ответом было одно число. Здесь сказано не менее, то есть больше тоже подходит.',
      'In lesson 13 the problem reduced to an equation and the answer was one number. Here it says at least, so more also fits.'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "So'z kamida ishlatilsa, javob qanday ko'rinishda bo'ladi?",
      'Если сказано не менее, в каком виде будет ответ?',
      'If it says at least, what form will the answer take?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L('Oraliq', 'Промежуток', 'An interval'),
      },
      {
        id: 'wrong',
        show: L('Bitta son, 13-darsdagidek', 'Одно число, как на 13 уроке', 'One number, as in lesson 13'),
        hint: L(
          "Kamida degani tenglik ham, undan kattasi ham mos keladi. Bunday shartni bitta son emas, oraliq qanoatlantiradi.",
          'Не менее означает, что подходит и равенство, и всё, что больше. Такому условию отвечает не одно число, а промежуток.',
          'At least means both equality and anything larger fit. Such a condition is satisfied by an interval, not one number.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Bugun matndan tengsizlik tuzib, javobni oraliq ko'rinishida olamiz.",
      'Верно. Сегодня составим по тексту неравенство и получим ответ в виде промежутка.',
      'Correct. Today we build an inequality from the text and get the answer as an interval.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — so'zni belgiga o'tkazish.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "So'z qaysi belgini beradi",
    'Какой знак даёт слово',
    'Which sign a word gives',
  ),
  audio: [
    A('mount',
      "Matnli masalada belgi so'zdan chiqadi. Kamida ellik olti degani nima?",
      'В текстовой задаче знак берётся из слова. Что означает не менее пятидесяти шести?',
      'In a word problem the sign comes from the word. What does at least fifty six mean?'),
    A('why',
      "Kamida so'zi tenglikni ham qamrab oladi.",
      'Слово не менее охватывает и равенство.',
      'The words at least also cover equality.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('S ≥ 56', 'S ≥ 56', 'S ≥ 56')}
      steps={[]}
      ask={L(
        "Yuz kamida ellik olti degani qaysi belgi?",
        'Площадь не менее пятидесяти шести это какой знак?',
        'Area at least fifty six is which sign?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Katta yoki teng', 'Больше или равно', 'Greater than or equal') },
        {
          id: 'wrong',
          label: L('Faqat katta', 'Только больше', 'Only greater'),
          hint: L(
            "Kamida ellik olti degani ellik oltining o'zi ham mos keladi: tenglik javobga kiradi.",
            'Не менее пятидесяти шести значит, что и сами пятьдесят шесть подходят: равенство входит в ответ.',
            'At least fifty six means fifty six itself also fits: equality belongs in the answer.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Kamida bu katta yoki teng. Oshmaydi esa kichik yoki teng bo'ladi.",
        'Верно. Не менее это больше или равно. А не превышает это меньше или равно.',
        'Correct. At least is greater than or equal. And does not exceed is less than or equal.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — matndan tengsizlik tuzish.
// ============================================================
const S3 = {
  eyebrow: L('MATNDAN TENGSIZLIKKA', 'ОТ ТЕКСТА К НЕРАВЕНСТВУ', 'FROM TEXT TO INEQUALITY'),
  title: L(
    "Bitta noma'lum ikkala tomonni ham beradi",
    'Одно неизвестное даёт обе стороны',
    'One unknown gives both sides',
  ),
  audio: [
    A('mount',
      "Perimetr o'ttiz, demak ikkala tomonning yig'indisi o'n besh. Bir tomonni x desak, ikkinchisi o'n besh minus x bo'ladi.",
      'Периметр тридцать, значит сумма двух сторон пятнадцать. Если одну сторону назвать x, вторая будет пятнадцать минус x.',
      'The perimeter is thirty, so the sum of two sides is fifteen. If one side is x, the other is fifteen minus x.'),
    A('why',
      "Yuz tomonlarning ko'paytmasi, u kamida ellik olti bo'lishi kerak.",
      'Площадь это произведение сторон, она должна быть не менее пятидесяти шести.',
      'The area is the product of the sides, and it must be at least fifty six.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('P = 30,  S ≥ 56', 'P = 30,  S ≥ 56', 'P = 30,  S ≥ 56')}
      steps={[
        { id: 'a', head: '1', lines: ['x + (2-tomon) = 15'] },
        { id: 'b', head: '2', lines: ['S = x(15 − x) ≥ 56'] },
      ]}
      ask={L(
        "Hammasini bitta tomonga ko'chirsak, qaysi tengsizlik hosil bo'ladi?",
        'Если перенести всё в одну сторону, какое неравенство получится?',
        'If everything is moved to one side, which inequality results?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: 'x² − 15x + 56 ≤ 0' },
        {
          id: 'wrong',
          label: 'x² − 15x + 56 ≥ 0',
          hint: L(
            "O'n besh x minus x kvadrat katta yoki teng ellik olti. Hammasini o'ngga ko'chirganda belgi teskarisiga aylanadi.",
            'Пятнадцать x минус x в квадрате больше или равно пятидесяти шести. При переносе всего вправо знак меняется на обратный.',
            'Fifteen x minus x squared is greater than or equal to fifty six. Moving everything to the right flips the sign.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Endi bu oddiy kvadrat tengsizlik: uni 14-darsdagi asbob bilan yechamiz.",
        'Верно. Теперь это обычное квадратное неравенство: решим его прибором с 14 урока.',
        'Correct. Now it is an ordinary quadratic inequality: we solve it with the tool from lesson 14.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — SignAxis: tengsizlikni yechish.
// ============================================================
const S4 = {
  eyebrow: L('YECHISH', 'РЕШЕНИЕ', 'SOLVING'),
  title: L(
    "Tanish asbob, yangi mazmun",
    'Знакомый прибор, новое содержание',
    'A familiar tool, new content',
  ),
  audio: [
    A('mount',
      "X kvadrat minus o'n besh x qo'shi ellik olti, kichik yoki teng nol. Ildizlarni toping va oraliqni bo'yang.",
      'X в квадрате минус пятнадцать x плюс пятьдесят шесть, меньше или равно нулю. Найди корни и закрась промежуток.',
      'X squared minus fifteen x plus fifty six, less than or equal to zero. Find the roots and paint the interval.'),
    W('sign',
      "Bu safar x tomon uzunligi: javob keyin ma'no bilan tekshiriladi.",
      'На этот раз x это длина стороны: ответ потом проверим по смыслу.',
      'This time x is a side length: we will check the answer against meaning afterwards.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={AREA}
      from={4} to={11} yFrom={-3} yTo={9}
      roots={[7, 8]} strict={false} target="le"
      xLabel={L('x', 'x', 'x')} yLabel={L('S', 'S', 'S')}
      ask={L(
        "X kvadrat minus o'n besh x qo'shi ellik olti manfiy yoki nol qachon: ildizlarni qo'ying",
        'Когда x в квадрате минус пятнадцать x плюс пятьдесят шесть меньше или равно нулю: поставь корни',
        'When is x squared minus fifteen x plus fifty six less than or equal to zero: place the roots',
      )}
      after={L(
        "Ana xolos. Matematik javob: yetti bilan sakkiz orasi, chegaralari bilan. Endi bu ma'noga to'g'ri keladimi, tekshiramiz.",
        'Вот и всё. Математический ответ: от семи до восьми, вместе с границами. Теперь проверим, согласуется ли это со смыслом.',
        'That is all it takes. The mathematical answer: from seven to eight, boundaries included. Now let us check it against meaning.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — MA'NO SHARTI qayerdan keladi.
// ============================================================
const S5 = {
  eyebrow: L("MA'NO SHARTI", 'УСЛОВИЕ ПО СМЫСЛУ', 'THE MEANING CONDITION'),
  title: L(
    "Masalaning o'zi yana bitta shart qo'yadi",
    'Сама задача ставит ещё одно условие',
    'The problem itself imposes one more condition',
  ),
  audio: [
    A('mount',
      "X tomon uzunligi. Uzunlik manfiy bo'la oladimi? Ikkinchi tomon o'n besh minus x, u ham musbat bo'lishi kerak.",
      'X это длина стороны. Может ли длина быть отрицательной? Вторая сторона пятнадцать минус x, она тоже должна быть положительной.',
      'X is a side length. Can a length be negative? The second side is fifteen minus x, and it must be positive too.'),
    A('why',
      "Bu shart matnda yozilmagan, u masalaning ma'nosidan keladi.",
      'Это условие не записано в тексте, оно идёт из смысла задачи.',
      'This condition is not written in the text, it comes from the meaning of the problem.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Ikkala tomon ham musbat bo'lishi uchun x qanday oraliqda yotishi kerak?",
        'В каком промежутке должен лежать x, чтобы обе стороны были положительными?',
        'In what interval must x lie for both sides to be positive?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L('Noldan katta va o\'n beshdan kichik', 'Больше нуля и меньше пятнадцати', 'Greater than zero and less than fifteen') },
        {
          id: 'wrong',
          label: L('Faqat noldan katta', 'Только больше нуля', 'Only greater than zero'),
          hint: L(
            "Ikkinchi tomon o'n besh minus x. Agar x o'n beshdan katta bo'lsa, ikkinchi tomon manfiy chiqadi, bunday to'rtburchak yo'q.",
            'Вторая сторона пятнадцать минус x. Если x больше пятнадцати, вторая сторона окажется отрицательной, такого прямоугольника нет.',
            'The second side is fifteen minus x. If x is greater than fifteen, the second side comes out negative, and no such rectangle exists.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ma'no sharti: x noldan katta va o'n beshdan kichik. Endi ikkala shartni kesishtiramiz.",
        'Верно. Условие по смыслу: x больше нуля и меньше пятнадцати. Теперь пересечём оба условия.',
        'Correct. The meaning condition: x greater than zero and less than fifteen. Now we intersect both conditions.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — Overlap: javobni ma'no bilan kesish.
// ============================================================
const S6 = {
  eyebrow: L('KESISHTIRISH', 'ПЕРЕСЕЧЕНИЕ', 'INTERSECTION'),
  title: L(
    "Matematik javob va ma'no sharti birga",
    'Математический ответ и условие по смыслу вместе',
    'The mathematical answer and the meaning condition together',
  ),
  audio: [
    A('mount',
      "Yuqorida ikkita qator: tengsizlikning yechimi va masalaning ma'no sharti. Ikkalasiga ham mos keladigan joyni bo'yang.",
      'Сверху две полосы: решение неравенства и условие по смыслу. Закрась место, подходящее обеим.',
      'Two strips above: the solution of the inequality and the meaning condition. Paint the place that fits both.'),
    W('sign',
      "Bu 16-darsdagi sistema, faqat ikkinchi shart matndan emas, ma'nodan kelgan.",
      'Это система с 16 урока, только второе условие пришло не из текста, а из смысла.',
      'This is the system from lesson 16, only the second condition came from meaning, not from the text.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Overlap
      from={-1} to={16}
      layers={[
        { intervals: [{ a: 7, b: 8, openA: false, openB: false }] },
        { intervals: [{ a: 0, b: 15, openA: true, openB: true }] },
      ]}
      layerLabels={[
        L('Tengsizlik yechimi: yettidan sakkizgacha', 'Решение неравенства: от семи до восьми', 'Solution of the inequality: from seven to eight'),
        L("Ma'no sharti: noldan o'n beshgacha", 'Условие по смыслу: от нуля до пятнадцати', 'Meaning condition: from zero to fifteen'),
      ]}
      mode="and"
      ask={L(
        "Ikkala shartga ham mos keladigan oraliqni bosib bo'yang",
        'Закрась промежуток, подходящий обоим условиям',
        'Paint the interval that fits both conditions',
      )}
      after={L(
        "Ana xolos. Bu safar ma'no sharti hech narsani kesmadi: butun yechim uning ichida yotardi. Lekin doim shunday bo'lmaydi.",
        'Вот и всё. На этот раз условие по смыслу ничего не отрезало: всё решение лежало внутри него. Но так бывает не всегда.',
        'That is all it takes. This time the meaning condition cut nothing: the whole solution lay inside it. But that is not always so.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — MA'NO SHARTI KESADIGAN holat: butun son.
// ============================================================
const S7 = {
  eyebrow: L("MA'NO KESGANDA", 'КОГДА СМЫСЛ ОТРЕЗАЕТ', 'WHEN MEANING CUTS'),
  title: L(
    "Predmet soni kasr bo'la olmaydi",
    'Число предметов не может быть дробным',
    'A count of objects cannot be fractional',
  ),
  audio: [
    A('mount',
      "Zalda n qator, har qatorda n qo'shi to'rt o'rindiq. Jami o'rindiq kamida oltmish bo'lsin. N qator soni, u butun va musbat.",
      'В зале n рядов, в каждом ряду n плюс четыре места. Пусть всего мест не менее шестидесяти. N это число рядов, оно целое и положительное.',
      'A hall has n rows, each with n plus four seats. Let the total be at least sixty. N is the number of rows, whole and positive.'),
    A('why',
      "N karra n qo'shi to'rt, katta yoki teng oltmish. Bu n kvadrat qo'shi to'rt n minus oltmish, katta yoki teng nol.",
      'N умножить на n плюс четыре, больше или равно шестидесяти. Это n в квадрате плюс четыре n минус шестьдесят, больше или равно нулю.',
      'N times n plus four, greater than or equal to sixty. That is n squared plus four n minus sixty, greater than or equal to zero.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('n² + 4n − 60 ≥ 0', 'n² + 4n − 60 ≥ 0', 'n² + 4n − 60 ≥ 0')}
      steps={[
        { id: 'a', head: 'n1, n2', lines: ['D = 16 + 240 = 256', 'n = −10,  n = 6'] },
        { id: 'b', head: '±', lines: ['n ≤ −10  ∨  n ≥ 6'] },
      ]}
      ask={L(
        "Qator soni uchun bu javobdan nima qoladi?",
        'Что останется от этого ответа для числа рядов?',
        'What remains of this answer for the number of rows?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L('Oltidan boshlab butun sonlar', 'Целые числа начиная с шести', 'Whole numbers starting from six') },
        {
          id: 'wrong',
          label: L('Ikkala oraliq ham', 'Оба промежутка', 'Both intervals'),
          hint: L(
            "Minus o'ndan kichik qatorlar bo'lishi mumkinmi? Qator soni manfiy bo'lmaydi, shuning uchun chap oraliq butunlay tushib qoladi.",
            'Может ли рядов быть меньше минус десяти? Число рядов не бывает отрицательным, поэтому левый промежуток отпадает целиком.',
            'Can there be fewer than minus ten rows? A number of rows is never negative, so the left interval drops out entirely.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu yerda ma'no sharti chap oraliqni butunlay kesib tashladi. Javob: kamida olti qator.",
        'Верно. Здесь условие по смыслу отрезало левый промежуток целиком. Ответ: не менее шести рядов.',
        'Correct. Here the meaning condition cut off the left interval entirely. The answer: at least six rows.',
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
    "Algebra 9, II bobga mashqlar (86-87-bet)",
    'Алгебра 9, упражнения к главе II (стр. 86-87)',
    'Algebra 9, exercises to chapter II (p. 86-87)',
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
          "Tengsizlik yechilgandan keyin yana nima qilinadi?",
          'Что делают после того, как неравенство решено?',
          'What is done after the inequality is solved?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Javob masalaning ma'nosi bilan kesishtiriladi", 'Ответ пересекают со смыслом задачи', 'The answer is intersected with the meaning of the problem'),
          },
          {
            id: 'wrong',
            label: L('Hech narsa, javob tayyor', 'Ничего, ответ готов', 'Nothing, the answer is ready'),
            hint: L(
              "7-ekranni eslang: matematik javobning yarmi qator soni uchun umuman mos kelmagan edi.",
              'Вспомни 7 экран: половина математического ответа вообще не подходила для числа рядов.',
              'Recall screen 7: half of the mathematical answer did not fit the number of rows at all.',
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
    "Matndan tengsizlikka, keyin ma'noga qaytish",
    'От текста к неравенству, потом назад к смыслу',
    'From text to inequality, then back to meaning',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz so'zni belgiga o'tkazdingiz, tengsizlik tuzdingiz, yechdingiz va ma'no bilan kesishtirdingiz. Endi ular qoida sifatida.",
      'На семи экранах ты перевёл слово в знак, составил неравенство, решил его и пересёк со смыслом. Теперь они в виде правила.',
      'On seven screens you turned a word into a sign, built an inequality, solved it, and intersected it with meaning. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi.",
      'Правило открылось.',
      'The rule is open.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — SignAxis: yangi masala, mustaqil.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Yangi to'rtburchak, endi mustaqil",
    'Новый прямоугольник, теперь самостоятельно',
    'A new rectangle, now on your own',
  ),
  audio: [
    A('mount',
      "Perimetri yigirma to'rt metr, yuzi kamida o'ttiz besh kvadrat metr. Tomonlar yig'indisi o'n ikki, tengsizlik x kvadrat minus o'n ikki x qo'shi o'ttiz besh, kichik yoki teng nol.",
      'Периметр двадцать четыре метра, площадь не менее тридцати пяти квадратных метров. Сумма сторон двенадцать, неравенство x в квадрате минус двенадцать x плюс тридцать пять, меньше или равно нулю.',
      'The perimeter is twenty four metres, the area at least thirty five square metres. The sum of the sides is twelve, the inequality is x squared minus twelve x plus thirty five, less than or equal to zero.'),
    A('why',
      "Ildizlarni toping va mos oraliqni bo'yang.",
      'Найди корни и закрась подходящий промежуток.',
      'Find the roots and paint the fitting interval.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={AREA2}
      from={2} to={10} yFrom={-3} yTo={9}
      roots={[5, 7]} strict={false} target="le"
      xLabel={L('x', 'x', 'x')} yLabel={L('S', 'S', 'S')}
      ask={L(
        "X kvadrat minus o'n ikki x qo'shi o'ttiz besh manfiy yoki nol qachon: ildizlarni qo'ying",
        'Когда x в квадрате минус двенадцать x плюс тридцать пять меньше или равно нулю: поставь корни',
        'When is x squared minus twelve x plus thirty five less than or equal to zero: place the roots',
      )}
      after={L(
        "Ana xolos. Javob: beshdan yettigacha, chegaralari bilan. Ma'no sharti noldan o'n ikkigacha edi, u bu oraliqni kesmaydi.",
        'Вот и всё. Ответ: от пяти до семи, с границами. Условие по смыслу было от нуля до двенадцати, оно этот промежуток не режет.',
        'That is all it takes. The answer: from five to seven, boundaries included. The meaning condition was from zero to twelve, and it does not cut this interval.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: so'zni belgiga o'tkazish.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "So'zdan belgiga",
    'От слова к знаку',
    'From word to sign',
  ),
  audio: [
    A('mount',
      "To'rtta shart. Har birini belgiga o'tkazing.",
      'Четыре условия. Переведи каждое в знак.',
      'Four conditions. Turn each into a sign.'),
    A('why',
      "Tenglik qamrab olinganmi yoki yo'qmi, shunga qarang.",
      'Смотри, охвачено равенство или нет.',
      'Look at whether equality is covered or not.'),
  ],
  props: {
    stepLabel: L('Shart', 'Условие', 'Condition'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham o'tkazildi: kamida va oshmaydi tenglikni qamraydi, katta va kichik esa qamramaydi.",
      'Все четыре переведены: не менее и не превышает охватывают равенство, а больше и меньше нет.',
      'All four are translated: at least and does not exceed cover equality, while greater and less do not.',
    ),
    tasks: [
      {
        expr: 'S ? 56',
        question: L('Yuz kamida ellik olti: qaysi belgi?', 'Площадь не менее пятидесяти шести: какой знак?', 'Area at least fifty six: which sign?'),
        ok: L("Ha. Kamida tenglikni ham qamraydi.", 'Да. Не менее охватывает и равенство.', 'Yes. At least covers equality too.'),
        items: [
          { id: 'a', right: true, label: 'S ≥ 56' },
          { id: 'b', label: 'S > 56', hint: L("Kamida ellik olti degani ellik oltining o'zi ham mos keladi.", 'Не менее пятидесяти шести значит, что и сами пятьдесят шесть подходят.', 'At least fifty six means fifty six itself also fits.') },
        ],
        solution: [L('Kamida: katta yoki teng', 'Не менее: больше или равно', 'At least: greater than or equal)')],
      },
      {
        expr: 'm ? 40',
        question: L('Massa qirq kilogrammdan oshmaydi: qaysi belgi?', 'Масса не превышает сорока килограммов: какой знак?', 'The mass does not exceed forty kilograms: which sign?'),
        ok: L("Ha. Oshmaydi degani qirqning o'zi ham mumkin.", 'Да. Не превышает значит, что сами сорок тоже можно.', 'Yes. Does not exceed means forty itself is also allowed.'),
        items: [
          { id: 'a', right: true, label: 'm ≤ 40' },
          { id: 'b', label: 'm < 40', hint: L("Oshmaydi degani qirqdan katta emas, lekin qirqning o'ziga teng bo'lishi mumkin.", 'Не превышает значит не больше сорока, но равным сорока быть может.', 'Does not exceed means not more than forty, but it may equal forty.') },
        ],
        solution: [L('Oshmaydi: kichik yoki teng', 'Не превышает: меньше или равно', 'Does not exceed: less than or equal')],
      },
      {
        expr: 'n ? 6',
        question: L('Qatorlar soni oltidan kam: qaysi belgi?', 'Число рядов меньше шести: какой знак?', 'The number of rows is fewer than six: which sign?'),
        ok: L("Ha. Kam degani tenglikni qamramaydi.", 'Да. Меньше не охватывает равенство.', 'Yes. Fewer does not cover equality.'),
        items: [
          { id: 'a', right: true, label: 'n < 6' },
          { id: 'b', label: 'n ≤ 6', hint: L("Oltidan kam degani oltining o'zi mos kelmaydi, faqat undan kichiklari.", 'Меньше шести значит, что сама шестёрка не подходит, только меньшие.', 'Fewer than six means six itself does not fit, only smaller ones.') },
        ],
        solution: [L('Kam: faqat kichik', 'Меньше: только меньше', 'Fewer: strictly less')],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: ma'no shartini tanlash.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Ma'no sharti qanday bo'ladi",
    'Каким будет условие по смыслу',
    'What the meaning condition will be',
  ),
  audio: [
    A('mount',
      "Har savolda noma'lum nimani bildirishi aytilgan. Uning ma'no shartini tanlang.",
      'В каждом вопросе сказано, что обозначает неизвестное. Выбери его условие по смыслу.',
      'Each question says what the unknown stands for. Choose its meaning condition.'),
    A('why',
      "So'rang: bu kattalik manfiy bo'la oladimi, kasr bo'la oladimi?",
      'Спроси: может ли эта величина быть отрицательной, может ли быть дробной?',
      'Ask: can this quantity be negative, can it be fractional?'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham tanlandi: ma'no sharti matnda yozilmaydi, uni kattalikning o'zi belgilaydi.",
      'Все три выбраны: условие по смыслу не пишется в тексте, его задаёт сама величина.',
      'All three are chosen: the meaning condition is not written in the text, the quantity itself sets it.',
    ),
    tasks: [
      {
        expr: 'x',
        question: L(
          "X bu tomon uzunligi, metrda. Ma'no sharti qanday?",
          'X это длина стороны, в метрах. Каково условие по смыслу?',
          'X is a side length, in metres. What is the meaning condition?',
        ),
        ok: L("Ha. Uzunlik musbat, lekin butun bo'lishi shart emas.", 'Да. Длина положительна, но целой быть не обязана.', 'Yes. A length is positive, but need not be whole.'),
        items: [
          { id: 'a', right: true, label: L('Noldan katta', 'Больше нуля', 'Greater than zero') },
          { id: 'b', label: L('Noldan katta va butun', 'Больше нуля и целое', 'Greater than zero and whole'), hint: L("Uzunlik kasr bo'lishi mumkin: masalan yetti butun besh metr.", 'Длина может быть дробной: например, семь целых пять метра.', 'A length may be fractional: for example seven point five metres.') },
        ],
        solution: [L('Uzunlik: musbat, kasr bo\'lishi mumkin', 'Длина: положительна, может быть дробной', 'Length: positive, may be fractional')],
      },
      {
        expr: 'n',
        question: L(
          "N bu avtobuslar soni. Ma'no sharti qanday?",
          'N это число автобусов. Каково условие по смыслу?',
          'N is the number of buses. What is the meaning condition?',
        ),
        ok: L("Ha. Predmet soni butun va manfiy emas.", 'Да. Число предметов целое и неотрицательное.', 'Yes. A count of objects is whole and not negative.'),
        items: [
          { id: 'a', right: true, label: L('Butun va manfiy emas', 'Целое и неотрицательное', 'Whole and not negative') },
          { id: 'b', label: L('Faqat musbat, kasr ham mumkin', 'Только положительное, дробное тоже можно', 'Only positive, fractional also allowed'), hint: L("Yarim avtobus bo'lmaydi: predmet soni doim butun.", 'Половины автобуса не бывает: число предметов всегда целое.', 'There is no half a bus: a count of objects is always whole.') },
        ],
        solution: [L('Predmet soni: butun, manfiy emas', 'Число предметов: целое, неотрицательное', 'A count: whole, not negative')],
      },
      {
        expr: 't',
        question: L(
          "T bu harakat vaqti, soatda. Ma'no sharti qanday?",
          'T это время движения, в часах. Каково условие по смыслу?',
          'T is the travel time, in hours. What is the meaning condition?',
        ),
        ok: L("Ha. Vaqt musbat va kasr bo'lishi mumkin.", 'Да. Время положительно и может быть дробным.', 'Yes. Time is positive and may be fractional.'),
        items: [
          { id: 'a', right: true, label: L('Noldan katta', 'Больше нуля', 'Greater than zero') },
          { id: 'b', label: L('Butun bo\'lishi shart', 'Обязано быть целым', 'Must be whole'), hint: L("Vaqt yarim soat ham bo'lishi mumkin: uni butun deb cheklash noto'g'ri.", 'Время может быть и полчаса: ограничивать его целым неверно.', 'Time can be half an hour: restricting it to whole numbers is wrong.') },
        ],
        solution: [L('Vaqt: musbat, kasr bo\'lishi mumkin', 'Время: положительно, может быть дробным', 'Time: positive, may be fractional')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Zilola manfiy tomonni javobga qoldirgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Ma'no shartini unutish",
    'Забыть про условие по смыслу',
    'Forgetting the meaning condition',
  ),
  audio: [
    A('mount',
      "Zilolaning yechimi. Kvadratning tomoni x, yuzi kamida yigirma besh bo'lsin. U x kvadrat katta yoki teng yigirma besh dan javobni x kichik yoki teng minus besh, yoki x katta yoki teng besh deb yozgan.",
      'Решение Зилолы. Сторона квадрата x, площадь не менее двадцати пяти. Из x в квадрате больше или равно двадцати пяти она записала ответ: x меньше или равно минус пяти, или x больше или равно пяти.',
      "Zilola's solution. The side of a square is x, the area at least twenty five. From x squared greater than or equal to twenty five she wrote the answer: x less than or equal to minus five, or x greater than or equal to five."),
    A('why',
      "Matematik jihatdan ikkala oraliq ham to'g'ri. Lekin x nimani bildiradi?",
      'Математически оба промежутка верны. Но что обозначает x?',
      'Mathematically both intervals are correct. But what does x stand for?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Tomon uzunligi manfiy bo'lmaydi: chap oraliq ma'no bo'yicha tushib qoladi, javob faqat x katta yoki teng besh.",
      'Длина стороны не бывает отрицательной: левый промежуток отпадает по смыслу, ответ только x больше или равно пяти.',
      'A side length is never negative: the left interval drops out by meaning, the answer is only x greater than or equal to five.',
    ),
    tasks: [
      {
        expr: 'x² ≥ 25',
        question: L(
          "Zilola javobga chap oraliqni ham qo'shgan. X kvadratning tomoni bo'lsa, u manfiy bo'la oladimi?",
          'Зилола добавила в ответ и левый промежуток. Если x это сторона квадрата, может ли она быть отрицательной?',
          'Zilola added the left interval too. If x is the side of a square, can it be negative?',
        ),
        ok: L(
          "To'g'ri: tomon manfiy bo'lmaydi. Chap oraliq matematik to'g'ri, lekin masalaning ma'nosiga zid: javob faqat x katta yoki teng besh.",
          'Верно: сторона не бывает отрицательной. Левый промежуток математически верен, но противоречит смыслу задачи: ответ только x больше или равно пяти.',
          'Correct: a side is never negative. The left interval is mathematically right but contradicts the meaning: the answer is only x greater than or equal to five.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Yo'q, tomon manfiy bo'lmaydi", 'Нет, сторона не бывает отрицательной', 'No, a side is never negative'),
          },
          {
            id: 'b',
            label: L("Ha, Zilola to'g'ri yozgan", 'Да, Зилола записала верно', 'Yes, Zilola wrote it correctly'),
            hint: L("Kvadratning tomoni uzunlik. Minus besh metrli tomon bo'lmaydi, shuning uchun chap oraliq javobga kirmaydi.", 'Сторона квадрата это длина. Стороны в минус пять метров не бывает, поэтому левый промежуток в ответ не входит.', 'The side of a square is a length. There is no side of minus five metres, so the left interval is not in the answer.'),
          },
        ],
        solution: [
          'x ≤ −5  ∨  x ≥ 5',
          L("Ma'no: x musbat", 'Смысл: x положителен', 'Meaning: x is positive'),
          L("To'g'ri javob: x ≥ 5", 'Верный ответ: x ≥ 5', 'Correct answer: x ≥ 5'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — darslikning o'z sistemasi (207-mashq).
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Ikkita shart birdan: sistema",
    'Два условия сразу: система',
    'Two conditions at once: a system',
  ),
  audio: [
    A('mount',
      "Darslikning o'z mashqi. Ikkita kvadrat tengsizlik birga berilgan: x kvadrat qo'shi x minus olti, noldan kichik; va minus ikki x kvadrat qo'shi uch x qo'shi ikki, noldan katta.",
      'Упражнение из учебника. Даны сразу два квадратных неравенства: x в квадрате плюс x минус шесть, меньше нуля; и минус два x в квадрате плюс три x плюс два, больше нуля.',
      'An exercise from the textbook. Two quadratic inequalities are given together: x squared plus x minus six, less than zero; and minus two x squared plus three x plus two, greater than zero.'),
    A('why',
      "Har birini alohida yeching, keyin 16-darsdagidek kesishtiring.",
      'Реши каждое отдельно, потом пересеки, как на 16 уроке.',
      'Solve each separately, then intersect, as in lesson 16.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: ikkala yechimning umumiy qismi javobni beradi.",
      'Найдено: общая часть обоих решений даёт ответ.',
      'Found: the common part of both solutions gives the answer.',
    ),
    tasks: [
      {
        expr: 'x² + x − 6 < 0,   −2x² + 3x + 2 > 0',
        question: L(
          "Birinchisining yechimi minus uchdan ikkigacha, ikkinchisiniki minus nol butun beshdan ikkigacha. Umumiy qism qaysi?",
          'Решение первого от минус трёх до двух, второго от минус нолю целых пяти до двух. Какая общая часть?',
          'The first solves to minus three up to two, the second from minus zero point five up to two. What is the common part?',
        ),
        ok: L(
          "Ha. Ikkala oraliq ham ikkida tugaydi, chap chegara esa kattarog'i bo'yicha olinadi.",
          'Да. Оба промежутка кончаются на двух, а левая граница берётся по большей из них.',
          'Yes. Both intervals end at two, and the left boundary is taken as the larger of the two.',
        ),
        items: [
          { id: 'a', right: true, label: L('Minus nol butun beshdan ikkigacha', 'От минус нолю целых пяти до двух', 'From minus zero point five up to two') },
          { id: 'b', label: L('Minus uchdan ikkigacha', 'От минус трёх до двух', 'From minus three up to two'), hint: L("Minus uch bilan minus nol butun besh orasidagi sonlar ikkinchi tengsizlikka mos kelmaydi, demak umumiy qismga kirmaydi.", 'Числа между минус тремя и минус нолю целых пяти не подходят второму неравенству, значит в общую часть не входят.', 'Numbers between minus three and minus zero point five do not fit the second inequality, so they are not in the common part.') },
        ],
        solution: [
          'x² + x − 6 < 0  →  −3 < x < 2',
          '2x² − 3x − 2 < 0  →  −0,5 < x < 2',
          L('Umumiy qism: −0,5 < x < 2', 'Общая часть: −0,5 < x < 2', 'Common part: −0,5 < x < 2'),
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
    "Blits: so'z, ma'no, chegara",
    'Блиц: слово, смысл, граница',
    'Blitz: word, meaning, boundary',
  ),
  audio: [
    A('mount',
      "To'rtta savol birin ketin. Ular qoidani so'raydi, uzoq hisobni emas.",
      'Четыре вопроса один за другим. Они спрашивают про правило, а не про долгий счёт.',
      'Four questions one after another. They ask about the rule, not a long computation.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi.",
      'Счёт идёт по первой попытке.',
      'The count goes by the first attempt.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'sozni-notogri-belgiga-otkazish',
        ask: L(
          "Kamida degan so'z tenglikni qamraydimi?",
          'Охватывает ли равенство выражение не менее?',
          'Do the words at least cover equality?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        ok: L(
          "To'g'ri. Kamida bu katta yoki teng: chegara nuqtasi javobga kiradi.",
          'Верно. Не менее это больше или равно: граничная точка входит в ответ.',
          'Correct. At least is greater than or equal: the boundary point belongs in the answer.',
        ),
        hint: L(
          "2-ekranni eslang: kamida ellik olti bo'lsa, ellik oltining o'zi ham mos kelardi.",
          'Вспомни 2 экран: при не менее пятидесяти шести сами пятьдесят шесть тоже подходили.',
          'Recall screen 2: with at least fifty six, fifty six itself also fitted.',
        ),
      },
      {
        id: 'q2',
        tag: 'manoni-hisobga-olmaslik',
        ask: L(
          "Tengsizlik yechilgach, javobni masalaning ma'nosi bilan tekshirish shartmi?",
          'Обязательно ли после решения неравенства проверять ответ по смыслу задачи?',
          'After solving the inequality, must the answer be checked against the meaning of the problem?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        ok: L(
          "To'g'ri. Matematik to'g'ri javobning bir qismi masalaga umuman mos kelmasligi mumkin.",
          'Верно. Часть математически верного ответа может вообще не подходить задаче.',
          'Correct. Part of a mathematically correct answer may not fit the problem at all.',
        ),
        hint: L(
          "12-ekranni eslang: Zilolaning xatosi aynan shu edi.",
          'Вспомни 12 экран: именно в этом была ошибка Зилолы.',
          "Recall screen 12: this was exactly Zilola's mistake.",
        ),
      },
      {
        id: 'q3',
        tag: 'manoni-hisobga-olmaslik',
        ask: L(
          "Predmetlar soni uchun kasr javob mos keladimi?",
          'Подходит ли дробный ответ для числа предметов?',
          'Does a fractional answer fit a count of objects?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Predmet soni butun bo'ladi: javobdan faqat butun sonlar olinadi.",
          'Верно. Число предметов целое: из ответа берутся только целые числа.',
          'Correct. A count of objects is whole: only whole numbers are taken from the answer.',
        ),
        hint: L(
          "7-ekranni eslang: qatorlar soni butun bo'lgani uchun javob kamida olti qator edi.",
          'Вспомни 7 экран: так как число рядов целое, ответом было не менее шести рядов.',
          'Recall screen 7: since the number of rows is whole, the answer was at least six rows.',
        ),
      },
      {
        id: 'q4',
        tag: 'chegarani-javobga-qoshmaslik',
        ask: L(
          "Yuz kamida ellik olti shartida ellik oltining o'zi javobga kiradimi?",
          'При условии площадь не менее пятидесяти шести входят ли сами пятьдесят шесть в ответ?',
          'With the condition area at least fifty six, does fifty six itself belong in the answer?',
        ),
        options: [
          { id: 'yes', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        ok: L(
          "To'g'ri. Chegara nuqtasi ham javobga kiradi, shuning uchun doira to'liq bo'yaladi.",
          'Верно. Граничная точка тоже входит в ответ, поэтому кружок закрашивается.',
          'Correct. The boundary point belongs in the answer too, so the dot is filled.',
        ),
        hint: L(
          "4-ekranni eslang: yetti va sakkiz nuqtalari to'liq doira bilan belgilangan edi.",
          'Вспомни 4 экран: точки семь и восемь были отмечены закрашенным кружком.',
          'Recall screen 4: the points seven and eight were marked with a filled dot.',
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
    "So'z, tengsizlik, ma'no",
    'Слово, неравенство, смысл',
    'Word, inequality, meaning',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda javob oraliq bo'lishini taxmin qildingiz. Bugun aynan shunday masalalarni yechishni to'liq egalladingiz.",
      'На первом экране ты предположил, что ответом будет промежуток. Сегодня ты полностью освоил решение таких задач.',
      'On the first screen you guessed the answer would be an interval. Today you fully mastered solving such problems.'),
    A('s1',
      "Siz so'zni belgiga o'tkazishni, matndan tengsizlik tuzishni va javobni masalaning ma'nosi bilan kesishtirishni o'rgandingiz.",
      'Ты освоил перевод слова в знак, составление неравенства по тексту и пересечение ответа со смыслом задачи.',
      'You learned to turn a word into a sign, to build an inequality from text, and to intersect the answer with the meaning of the problem.'),
    A('s2',
      "Keyingi darsda tengsizliklarni isbotlash: javob emas, dalil talab qilinadi.",
      'В следующем уроке доказательство неравенств: требуется не ответ, а доказательство.',
      'The next lesson covers proving inequalities: not an answer but a proof is required.'),
  ],
  props: {
    mark: '7 ≤ x ≤ 8',
    markNote: L(
      "tomon uzunligi, metrda",
      'длина стороны, в метрах',
      'side length, in metres',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: tengsizliklarni isbotlash',
      'Следующий урок: доказательство неравенств',
      'Next lesson: proving inequalities',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'sozni-notogri-belgiga-otkazish', ...S2 },
  { role: 'explain',  tag: 'nomalumni-notogri-tanlash', ...S3 },
  { role: 'explain',  tag: 'chegarani-javobga-qoshmaslik', ...S4 },
  { role: 'explain',  tag: 'manoni-hisobga-olmaslik', ...S5 },
  { role: 'explain',  tag: 'manoni-hisobga-olmaslik', ...S6 },
  { role: 'explain',  tag: 'manoni-hisobga-olmaslik', ...S7 },
  { role: 'rule',     tag: 'manoni-hisobga-olmaslik', ...S8 },
  { role: 'practice', tool: 'signaxis', tag: 'chegarani-javobga-qoshmaslik', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'sozni-notogri-belgiga-otkazish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'manoni-hisobga-olmaslik', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'manoni-hisobga-olmaslik', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'nomalumni-notogri-tanlash', ...S13 },
  { role: 'blitz',    tool: 'blitz', ...S14,
    props: {
      ...S14.props,
      scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
      stepLabel: L('Savol', 'Вопрос', 'Question'),
    },
  },
  { role: 'summary',  tool: 'takeaway', ...S15 },
]

// PALITRA: sinf bo'yicha bitta konstanta, `asboblar.jsx`dagi `G9_RECOLOR`.
export default makeLesson({ META, STATEMENTS, MISS, SCREENS, styles: G9_STYLES, recolor: G9_RECOLOR })
