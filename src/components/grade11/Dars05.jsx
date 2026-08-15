// ============================================================================
// 11-sinf, Dars 05. NYUTON-LEYBNITS FORMULASI.
//
// B1 blokining BESHINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/DARS05_SKELET.md
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// BU BLOKDAGI YAGONA DARS, QAYERDA FORMULA CHIQARILADI, e'lon qilinmaydi.
// Chiqarishning uchala tayanchi ham allaqachon o'tilgan:
//   S' = f      -- 4-darsda asbob ko'rsatdi
//   F = S + C   -- 1-darsda oila
//   S(a) = 0    -- 4-darsda
// Shuning uchun 5-ekran yangi narsa talab qilmaydi: u faqat bilganini yig'adi.
//
// 6-ekran HARAKATGA o'tkazilgan (2026-08-15, tashqi manbalarni ko'rgandan
// keyin): tezlik grafigi ostidagi yuza bu bosib o'tilgan yo'l. Bu «nima
// uchun» degan savolga javob, va 7-darsga ko'prik.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_05',
  title: L('Nyuton-Leybnits formulasi', 'Формула Ньютона-Лейбница', "The Newton-Leibniz formula"),
}

const BLOCK = { label: 'B1', from: 1, to: 7, current: 5 }

// ============================================================
// SLAYD 1. XUK. Taxminan yoki roppa rosa.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Nyuton-Leybnits formulasi', 'Формула Ньютона-Лейбница', 'The Newton-Leibniz formula'),
  title: L('Taxminan yoki roppa rosa', 'Примерно или точно', 'Approximately or exactly'),
  expr: '∫₀³ x² dx',
  rows: [
    {
      id: 'a',
      name: L("o'nta to'rtburchak", 'десять прямоугольников', 'ten rectangles'),
      value: 'S ≈ 7,7',
    },
    {
      id: 'b',
      name: L('ikki marta qo\'yish', 'две подстановки', 'two substitutions'),
      value: 'S = 9',
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi ikkinchi usulni ochamiz.",
      'Твой ответ записан. Сейчас откроем второй способ.',
      'Your answer is saved. Now we will open the second method.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первое', 'the first') },
      { id: 'b', label: L('ikkinchi', 'второе', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  holds: [5000, 5500, 4500, 4000],
  audio: [
    A('mount', "O'tgan darsda yuzani figura bilan sanadik. Lekin parabola ostida uchburchak ham, trapetsiya ham yo'q. Eski usul to'xtaydi.", 'На прошлом уроке мы считали площадь фигурой. Но под параболой нет ни треугольника, ни трапеции. Старый способ останавливается.', 'Last lesson we counted the area with a figure. But under a parabola there is neither a triangle nor a trapezium. The old method stops.'),
    A('r1', "Birinchi yechim: oraliqni o'nta to'rtburchakka bo'ldi va yetti butun yetti oldi. To'rtburchaklarni ko'paytirsa, javob aniqroq bo'ladi, lekin hech qachon roppa rosa bo'lmaydi.", 'Первое решение: отрезок разбит на десять прямоугольников, вышло семь целых семь. Если прямоугольников станет больше, ответ станет точнее, но точным не станет никогда.', 'The first solution: split the segment into ten rectangles and got seven point seven. With more rectangles the answer gets closer, but never exact.'),
    A('r2', "Ikkinchi yechim: ikkita son qo'ydi va to'qqiz oldi. Roppa rosa to'qqiz, taxminan emas.", 'Второе решение: подставлены два числа, вышло девять. Ровно девять, не примерно.', 'The second solution: substituted two numbers and got nine. Exactly nine, not approximately.'),
    A('ask', "Sizningcha qaysi yechim to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какое решение верное? Пока просто предположи.', 'Which solution do you think is correct? Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. TAYANCH: uchala tayanch ham o'tilgan darslardan.
// ============================================================
const S2 = {
  role: 'support',
  eyebrow: L('Tayanchni tekshirish', 'Проверка опоры', 'Checking the basics'),
  title: L('Uch tayanch', 'Три опоры', 'Three basics'),
  lead: L(
    "Bugungi formula uchta tayanchdan yig'iladi, va uchalasi ham allaqachon o'tilgan. Bu baholanmaydi.",
    'Сегодняшняя формула собирается из трёх опор, и все три уже пройдены. Это не оценивается.',
    "Today's formula is assembled from three basics, and all three are already covered. This is not graded.",
  ),
  cards: [
    {
      id: 'c1',
      title: L("Daraja qoidasi", 'Правило степени', 'The power rule'),
      short: L('1-darsdan', 'из урока 1', 'from lesson 1'),
      ex: [{ e: 'x²  →  x³/3 + C', why: L("ko'rsatkich ko'tarilib, unga bo'linadi", 'показатель поднят и на него поделено', 'the exponent raised and divided by') }],
    },
    {
      id: 'c2',
      title: L("To'plangan yuza nolda boshlanadi", 'Накопленная площадь начинается с нуля', 'The accumulated area starts at zero'),
      short: L('4-darsdan', 'из урока 4', 'from lesson 4'),
      ex: [{ e: 'S(a) = 0', why: L("bo'sh oraliqda yuza yo'q", 'на пустом отрезке площади нет', 'an empty segment has no area') }],
    },
    {
      id: 'c3',
      title: L("Yuzaning hosilasi egri chiziqning o'zi", 'Производная площади это сама кривая', 'The derivative of the area is the curve itself'),
      short: L('4-darsdan, asbob', 'из урока 4, прибор', 'from lesson 4, the instrument'),
      ex: [{ e: "S' = f", why: L('chegarani tortganda ko\'rindi', 'увидели, когда тянули границу', 'seen while dragging the boundary') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L("x² uchun boshlang'ich funksiya?", 'Первообразная для x² ?', 'The antiderivative of x² ?'),
      cols: 4,
      items: [
        { id: 'a', label: 'x³/3 + C', correct: true },
        { id: 'b', label: 'x³ + C', hint: L("Yangi ko'rsatkichga bo'lish kerak: uchga.", 'Надо поделить на новый показатель: на три.', 'You must divide by the new exponent: by three.') },
        { id: 'c', label: '2x + C', hint: L("Bu hosila, teskari amal emas.", 'Это производная, а не обратное действие.', 'That is the derivative, not the reverse.') },
        { id: 'd', label: 'x²/2 + C', hint: L("Ko'rsatkich ko'tarilmagan: uch bo'lishi kerak.", 'Показатель не поднят: должно быть три.', 'The exponent was not raised: it must be three.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('S(a) nechaga teng?', 'Чему равно S(a) ?', 'What does S(a) equal?'),
      cols: 4,
      items: [
        { id: 'a', label: '0', correct: true },
        { id: 'b', label: 'f(a)', hint: L("Bu balandlik, yuza emas.", 'Это высота, а не площадь.', 'That is a height, not an area.') },
        { id: 'c', label: 'F(a)', hint: L("Bu boshlang'ich funksiyaning qiymati. Yuza esa hali to'planmagan.", 'Это значение первообразной. А площадь ещё не накоплена.', 'That is the value of the antiderivative. The area is not accumulated yet.') },
        { id: 'd', label: 'a', hint: L("Bu chegaraning o'zi.", 'Это сама граница.', 'That is the boundary itself.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L(
        "Bitta funksiyaning ikki boshlang'ich funksiyasi nimasi bilan farq qiladi?",
        'Чем отличаются две первообразные одной функции?',
        'How do two antiderivatives of one function differ?',
      ),
      cols: 2,
      items: [
        { id: 'a', label: L("o'zgarmas songa", 'на постоянное число', 'by a constant number'), correct: true },
        { id: 'b', label: L('hech nimasi bilan', 'ничем', 'in no way'), hint: L("Iks kubi bo'lingan uch va u plyus besh, ikkalasi ham yaroqli.", 'Икс в кубе делить на три и она же плюс пять, годятся обе.', 'x cubed over three and the same plus five, both work.') },
        { id: 'c', label: L("ko'rsatkichga", 'показателем', 'by the exponent'), hint: L("Ko'rsatkich o'sha: aks holda hosila boshqa chiqadi.", 'Показатель тот же: иначе производная выйдет другой.', 'The exponent is the same: otherwise the derivative comes out different.') },
        { id: 'd', label: L("ko'paytuvchiga", 'множителем', 'by a factor'), hint: L("Ko'paytuvchi ham o'sha: uni o'zgartirsak hosila o'zgaradi.", 'Множитель тоже тот же: изменим его и производная изменится.', 'The factor is the same too: change it and the derivative changes.') },
      ],
    },
  ],
  holds: [3000, 4500, 5000, 5500, 4500, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch, birinchi darsdan: daraja qoidasi. Iks kvadrat uchun boshlang'ich funksiya iks kubi bo'lingan uch.", 'Первая опора, из первого урока: правило степени. Для икс в квадрате первообразная это икс в кубе делить на три.', 'First basic, from lesson one: the power rule. For x squared the antiderivative is x cubed over three.'),
    A('c2', "Ikkinchi tayanch, o'tgan darsdan: to'plangan yuza noldan boshlanadi. Chap chegarada hali hech narsa to'planmagan.", 'Вторая опора, с прошлого урока: накопленная площадь начинается с нуля. На левой границе ещё ничего не накоплено.', 'Second basic, from last lesson: the accumulated area starts at zero. At the left boundary nothing is accumulated yet.'),
    A('c3', "Uchinchi tayanch, va u ham o'tgan darsdan: yuzaning hosilasi egri chiziqning o'ziga teng. Buni asbobda ko'rgan edik.", 'Третья опора, и она тоже с прошлого урока: производная площади равна самой кривой. Мы видели это на приборе.', 'Third basic, also from last lesson: the derivative of the area equals the curve itself. We saw it on the instrument.'),
    A('recap', "Uchtasi birga formulani beradi. Hozircha shunchaki eslab qo'yamiz.", 'Три вместе дают формулу. Пока просто запомним.', 'The three together give the formula. For now let us just remember.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. QAYSI FUNKSIYA to'plangan yuza bo'la oladi.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'plus_c',
  eyebrow: L('Ikki shart bilan tekshiramiz', 'Проверим двумя условиями', 'Let us check with two conditions'),
  title: L("To'plangan yuzani nima aniqlaydi", 'Что задаёт накопленную площадь', 'What fixes the accumulated area'),
  expr: L("kerak:  S' = x²  va  S(0) = 0", "нужно: S' = x² и S(0) = 0", "needed: S' = x² and S(0) = 0"),
  goal: L('ikkala shart ham bajarilsin', 'должны выполниться оба условия', 'both conditions must hold'),
  rule: L(
    "Ikkita shart bor: hosila mos kelsin va nolda yuza nol bo'lsin.",
    'Условий два: производная должна сойтись и в нуле площадь равна нулю.',
    'There are two conditions: the derivative must match and at zero the area is zero.',
  ),
  pick: L('Qaysi nomzodni tekshiramiz?', 'Какого кандидата проверим?', 'Which candidate shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L("to'rtburchaklar", 'прямоугольники', 'rectangles'), value: 'S ≈ 7,7' },
    { id: 'b', key: 'inB', name: L('ikki qo\'yish', 'две подстановки', 'two substitutions'), value: 'S = 9' },
  ],
  points: [
    {
      id: 'q1', label: 'x³/3', num: 'x³/3', step: 'calc', verdict: 'in',
      role: L('ikkala shart ham', 'оба условия', 'both conditions'),
      calc: 'S(0) = 0  ✓,    S(3) = 9',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: 'x³', num: 'x³', step: 'calc', verdict: 'out',
      role: L('hosila mos kelmadi', 'производная не сошлась', 'the derivative did not match'),
      calc: "(x³)' = 3x²   ✗",
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q3', label: 'x³/3 + 5', num: 'x³/3 + 5', step: 'calc', verdict: 'out',
      role: L('nolda yuza bor', 'в нуле площадь не ноль', 'at zero the area is not zero'),
      calc: 'S(0) = 5   ✗',
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    items: [
      {
        id: 'b', label: L('ikkinchi', 'второе', 'the second'), correct: true,
        ok: L(
          "To'g'ri. Ikkinchi shart o'zgarmasni qadab qo'ydi: faqat bitta funksiya ikkalasiga ham mos keladi.",
          'Верно. Второе условие прибило постоянную: обоим условиям отвечает ровно одна функция.',
          'Correct. The second condition pinned the constant: exactly one function satisfies both.',
        ),
      },
      {
        id: 'a', label: L('birinchi', 'первое', 'the first'),
        hint: L("To'rtburchaklar yaqinlashtiradi, lekin roppa rosa bermaydi. Bu yerda esa aniq son chiqdi.", 'Прямоугольники приближают, но точного значения не дают. А здесь вышло точное число.', 'Rectangles approximate but never give the exact value. Here an exact number came out.'),
      },
      {
        id: 'both', label: L('ikkisi ham', 'оба', 'both'),
        hint: L("Yetti butun yetti va to'qqiz har xil sonlar: bittasi taxminiy, ikkinchisi aniq.", 'Семь целых семь и девять это разные числа: одно приближённое, другое точное.', 'Seven point seven and nine are different numbers: one approximate, the other exact.'),
      },
      {
        id: 'none', label: L('hech qaysi', 'ни один', 'neither'),
        hint: L("Bittasi tekshiruvdan o'tdi: hosila mos keldi va nolda yuza nol.", 'Один прошёл проверку: производная сошлась и в нуле площадь ноль.', 'One passed the check: the derivative matched and at zero the area is zero.'),
      },
    ],
  },
  holds: [2500, 6500, 1500, 2500, 10000, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Bahsga qaytamiz.', 'Опора восстановлена. Вернёмся к спору.', 'The basics are back. Let us return to the argument.'),
    A('mount', "To'plangan yuzani ikkita shart aniqlaydi: hosilasi berilgan funksiyaga teng bo'lsin va chap chegarada nolga teng bo'lsin.", 'Накопленную площадь задают два условия: производная равна данной функции и на левой границе она равна нулю.', 'The accumulated area is fixed by two conditions: its derivative equals the given function, and at the left boundary it is zero.'),
    A('mount', "Nomzodni tanlang.", 'Выбери кандидата.', 'Pick a candidate.'),
    A('calc', 'Tekshiramiz.', 'Проверяем.', 'We check.'),
    A('mark', "Uch nomzod tekshirildi. Iks kubi hosila bo'yicha o'tmadi. Iks kubi bo'lingan uch plyus besh hosila bo'yicha o'tdi, lekin nolda beshga teng, ya'ni ikkinchi shartdan yiqildi. Qoldi bittasi, va u uchda to'qqiz beradi.", 'Три кандидата проверены. Икс в кубе не прошёл по производной. Икс в кубе делить на три плюс пять по производной прошёл, но в нуле равен пяти, то есть упал на втором условии. Остался один, и он при трёх даёт девять.', 'Three candidates checked. x cubed failed on the derivative. x cubed over three plus five passed the derivative but equals five at zero, so it failed the second condition. One remains, and at three it gives nine.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: to'plangan yuzaning izi va boshlang'ich funksiya.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'accumulation',
  eyebrow: L('Chegarani torting', 'Потяни границу', 'Drag the boundary'),
  title: L("Iz bu x³/3", 'След это x³/3', 'The trace is x³/3'),
  chip: 'f = x²',
  graph: {
    fn: (x) => x * x,
    xDomain: [-0.2, 3.4],
    yDomain: [-1, 9.6],
    xTicks: [{ v: 1 }, { v: 2 }, { v: 3 }],
    yTicks: [{ v: 0 }, { v: 9 }],
    a: 0,
    bStart: 1,
    step: 0.5,
    trace: true,
    fLabel: 'f = x²',
    sLabel: 'S = x³/3',
    areaLabel: L('yuza', 'площадь', 'area'),
    height: 132,
  },
  graphSteps: 3,
  bonus: L(
    "Chegara uchga yetganda son to'qqiz bo'ladi. Va iks kubi bo'lingan uch, uchda, ham to'qqiz beradi. Ikkita mustaqil yo'l bir xil songa olib keldi.",
    'Когда граница доходит до трёх, число становится девять. И икс в кубе делить на три при трёх тоже даёт девять. Два независимых пути привели к одному числу.',
    'When the boundary reaches three, the number becomes nine. And x cubed over three at three also gives nine. Two independent routes led to the same number.',
  ),
  probe: {
    question: L("Pastdagi iz qaysi funksiya?", 'Какая функция нарисована следом внизу?', 'Which function is drawn by the trace below?'),
    items: [
      { id: 'a', label: 'x³/3', correct: true },
      { id: 'b', label: 'x²', hint: L("Iks kvadrat yuqorida turibdi, bu berilgan funksiya. Pastda esa to'plangan yuza.", 'Икс в квадрате стоит наверху, это данная функция. А внизу накопленная площадь.', 'x squared is above, that is the given function. Below is the accumulated area.') },
      { id: 'c', label: '2x', hint: L("Bu iks kvadratning hosilasi. Bizga esa teskari tomon kerak.", 'Это производная икс в квадрате. А нам нужна обратная сторона.', 'That is the derivative of x squared. We need the other direction.') },
      { id: 'd', label: 'x³', hint: L("Unda uchda yigirma yetti chiqardi, asbob esa to'qqiz ko'rsatyapti.", 'Тогда при трёх вышло бы двадцать семь, а прибор показывает девять.', 'Then at three it would give twenty seven, but the instrument shows nine.') },
    ],
  },
  holds: [4500, 5500, 6000, 8000],
  audio: [
    A('mount', "Nomzod topildi. Endi uni asbobda ko'ramiz.", 'Кандидат найден. Теперь посмотрим на него в приборе.', 'The candidate is found. Now let us see it on the instrument.'),
    A('one', "Chegarani torting. Bu safar egri chiziq parabola, va bo'yalgan figura maktab figurasi emas.", 'Потяни границу. На этот раз кривая парабола, и закрашенная фигура не школьная.', 'Drag the boundary. This time the curve is a parabola, and the shaded figure is not a school one.'),
    A('two', "Pastdagi iz esa yaxshi tanish: bu iks kubi bo'lingan uch, ya'ni o'sha boshlang'ich funksiya.", 'А след внизу хорошо знаком: это икс в кубе делить на три, та самая первообразная.', 'And the trace below is well known: it is x cubed over three, that same antiderivative.'),
    A('tangent', "Chegarani uchgacha torting. Yuza soni to'qqizga teng bo'ladi. Endi iks kubi bo'lingan uchga uchni qo'ying: yigirma yetti bo'lingan uch, ya'ni yana to'qqiz. Ikkita mustaqil yo'l bir xil songa olib keldi, va bu tasodif emas.", 'Дотяни границу до трёх. Число площади станет девять. Теперь подставь три в икс в кубе делить на три: двадцать семь делить на три, снова девять. Два независимых пути привели к одному числу, и это не совпадение.', 'Drag the boundary to three. The area number becomes nine. Now substitute three into x cubed over three: twenty seven over three, nine again. Two independent routes led to the same number, and that is no coincidence.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1: FORMULA CHIQARILADI.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'plus_c',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 2,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Formula chiqariladi', 'Формула выводится', 'The formula is derived'),
  rows: [
    'F = S + C',
    'x = a:    F(a) = C',
    'x = b:    S(b) = F(b) − F(a)',
  ],
  probe: {
    question: L(
      "Nega javobda o'zgarmas yo'q?",
      'Почему в ответе нет постоянной?',
      'Why is there no constant in the answer?',
    ),
    items: [
      { id: 'a', label: L("u ayirishda o'zi qisqaradi", 'она сама сокращается при вычитании', 'it cancels itself in the subtraction'), correct: true },
      { id: 'b', label: L("uni yozish unutilgan", 'её забыли написать', 'it was forgotten'), hint: L("Unutilmagan: ikkala qo'shilishda ham bir xil o'zgarmas turibdi va ayirilganda yo'qoladi.", 'Не забыли: одна и та же постоянная стоит в обоих слагаемых и при вычитании исчезает.', 'Not forgotten: the same constant stands in both terms and vanishes in the subtraction.') },
      { id: 'c', label: L("aniq integralda o'zgarmas bo'lmaydi", 'у определённого интеграла постоянной не бывает вообще', 'a definite integral never has a constant'), hint: L("Bo'ladi, faqat u qisqaradi. Farq shunda: aniqmas integralda javob oila, bu yerda son.", 'Бывает, только она сокращается. Разница в другом: у неопределённого ответ семейство, здесь число.', 'It does have one, only it cancels. The difference is elsewhere: the indefinite answer is a family, here it is a number.') },
      { id: 'd', label: L("chunki C nolga teng", 'потому что C равна нулю', 'because C equals zero'), hint: L("C har qanday son bo'lishi mumkin. Muhimi u ikki marta uchraydi va qisqaradi.", 'C может быть любым числом. Важно, что она встречается дважды и сокращается.', 'C can be any number. What matters is that it appears twice and cancels.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Nyuton-Leybnits', 'Правило 1. Ньютон-Лейбниц', 'Rule 1. Newton-Leibniz'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: '∫ₐᵇ f(x) dx = F(b) − F(a)',
    lines: [
      L("F bu f ning ISTALGAN boshlang'ich funksiyasi", 'F это ЛЮБАЯ первообразная для f', 'F is ANY antiderivative of f'),
      L("avval yuqori chegara, keyin quyi: tartib muhim", 'сначала верхняя граница, потом нижняя: порядок важен', 'the upper bound first, then the lower: the order matters'),
      L("o'zgarmas ayirishda qisqaradi, uni yozish shart emas", 'постоянная сокращается при вычитании, писать её не нужно', 'the constant cancels in the subtraction, there is no need to write it'),
      L('javob SON, funksiya emas', 'ответ это ЧИСЛО, а не функция', 'the answer is a NUMBER, not a function'),
    ],
    example: L('misol:  ∫₀³ x² dx = 27/3 − 0 = 9', 'пример:  ∫₀³ x² dx = 27/3 − 0 = 9', 'example:  ∫₀³ x² dx = 27/3 − 0 = 9'),
  },
  holds: [4000, 7000, 5000],
  audio: [
    A('mount', "Asbob ikkita yo'lni bir joyga olib keldi. Endi buni uch qatorda chiqaramiz.", 'Прибор свёл два пути в одну точку. Теперь выведем это в три строки.', 'The instrument brought two routes to one point. Now let us derive it in three lines.'),
    A('def', "To'plangan yuza boshlang'ich funksiya, demak istalgan boshqa boshlang'ich funksiyadan u faqat o'zgarmasga farq qiladi. Chap chegarani qo'yamiz: yuza nol, demak o'zgarmas ef chapga teng ekan. Endi o'ng chegarani qo'yamiz va yuza uchun ef bedan ef a ayirilgani chiqadi.", 'Накопленная площадь это первообразная, значит от любой другой первообразной она отличается только постоянной. Подставим левую границу: площадь ноль, значит постоянная равна эф от а. Теперь подставим правую границу и получим для площади эф от бэ минус эф от а.', 'The accumulated area is an antiderivative, so it differs from any other antiderivative only by a constant. Substitute the left boundary: the area is zero, so the constant equals F of a. Now substitute the right boundary and for the area we get F of b minus F of a.'),
    A('rule', "To'g'ri. O'zgarmas ikkala qo'shilishda ham bor va ayirilganda yo'qoladi. Shuning uchun aniq integralda uni yozish shart emas.", 'Верно. Постоянная есть в обоих слагаемых и при вычитании исчезает. Поэтому в определённом интеграле её писать не нужно.', 'Correct. The constant is in both terms and vanishes in the subtraction. That is why there is no need to write it in a definite integral.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: TEZLIK va YO'L.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'bounds_order',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Tezlik ostidagi yuza bu yo\'l', 'Площадь под скоростью это путь', 'The area under speed is distance'),
  was: { label: UI.was, expr: 'f = x²,   0 … 3   →   9' },
  now: { label: UI.now, expr: 'v = 3t²,   1 … 2   →   ?' },
  probe1: {
    question: L('Bu holat oldingisidan nimasi bilan farq qiladi?', 'Чем этот случай отличается от прежнего?', 'How does this case differ from the previous one?'),
    items: [
      { id: 'a', label: L("quyi chegara nol emas", 'нижняя граница не ноль', 'the lower bound is not zero'), correct: true },
      { id: 'b', label: L("bu yerda yuza emas, yo'l so'ralyapti", 'здесь спрашивают путь, а не площадь', 'here distance is asked, not area'), hint: L("Yo'l aynan shu yuzaga teng. Ikkalasi bir xil son, faqat nomi boshqa.", 'Путь и равен этой площади. Это одно число, только называется иначе.', 'The distance equals that very area. It is one number, only named differently.') },
      { id: 'c', label: L("vaqt manfiy bo'lishi mumkin", 'время может быть отрицательным', 'time can be negative'), hint: L("Bu yerda vaqt birdan ikkigacha, ikkalasi ham musbat.", 'Здесь время от одного до двух, оба положительны.', 'Here time runs from one to two, both positive.') },
      { id: 'd', label: L("tezlik doimiy", 'скорость постоянна', 'the speed is constant'), hint: L("Tezlik uch te kvadrat: u vaqt bilan o'zgaradi.", 'Скорость три тэ в квадрате: она меняется со временем.', 'The speed is three t squared: it changes with time.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L("Yo'l nimaga teng?", 'Чему равен путь?', 'What does the distance equal?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '7' },
      { id: 'b', label: '8' },
      { id: 'c', label: '9' },
      { id: 'd', label: '1' },
    ],
  },
  holds: [5000, 7000, 4000, 3000],
  audio: [
    A('mount', "Hozirgacha chegara har doim noldan boshlanardi, va bu qulay edi: pastdagi qo'shiluvchi nol chiqardi.", 'До сих пор граница всегда начиналась с нуля, и это было удобно: нижнее слагаемое выходило нулём.', 'So far the boundary always started at zero, and that was convenient: the lower term came out zero.'),
    A('now', "Endi ikkita yangilik. Birinchisi: chegara birdan boshlanadi, ya'ni pastdagi qo'shiluvchi endi nol emas. Ikkinchisi: bu yerda funksiya tezlik, va tezlik grafigi ostidagi yuza bosib o'tilgan yo'lga teng. Aynan shu narsani fizikada har kuni sanashadi.", 'Теперь два новшества. Первое: граница начинается с единицы, то есть нижнее слагаемое больше не ноль. Второе: здесь функция это скорость, а площадь под графиком скорости равна пройденному пути. Именно это в физике считают каждый день.', 'Now two new things. First: the boundary starts at one, so the lower term is no longer zero. Second: here the function is a speed, and the area under a speed graph equals the distance travelled. This is exactly what physics counts every day.'),
    A('q1', 'Bu holat oldingisidan nimasi bilan farq qiladi?', 'Чем этот случай отличается от прежнего?', 'How does this case differ from the previous one?'),
    A('q2', "Sizningcha yo'l nimaga teng? Shunchaki taxmin qiling.", 'Как думаешь, чему равен путь? Просто предположи.', 'What do you think the distance equals? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: qaysi biridan qaysi biri ayiriladi.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'bounds_order',
  eyebrow: L('Tartib muhim', 'Порядок важен', 'The order matters'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: '∫₁³ 2x dx,    F = x²',
  need: '= ?',
  answerLabel: L('integral', 'интеграл', 'the integral'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: 'F(1) − F(3)',
      point: {
        label: L('sanaymiz', 'считаем', 'we count'),
        calc: '1 − 9 = −8   ✗',
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: 'F(3) − F(1)',
      point: {
        label: L('sanaymiz', 'считаем', 'we count'),
        calc: '9 − 1 = 8   ✓',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['8', '−8', '10', '9'],
    value: ['8'],
    label: '∫ =',
    prompt: L('Integralni yozing', 'Запиши интеграл', 'Write the integral'),
    wrongs: [
      { key: '−8', hint: L("Egri chiziq birdan uchgacha o'q ustida turibdi, demak javob musbat bo'lishi shart. Tartib teskari olingan.", 'Кривая от одного до трёх идёт над осью, значит ответ обязан быть положительным. Порядок взят обратный.', 'From one to three the curve runs above the axis, so the answer must be positive. The order was taken backwards.') },
      { key: '10', hint: L("Ayirish kerak, qo'shish emas.", 'Надо вычесть, а не сложить.', 'You must subtract, not add.') },
      { key: '*', hint: L("Avval yuqori chegara, keyin quyi: to'qqizdan bir ayiriladi.", 'Сначала верхняя граница, потом нижняя: из девяти вычитается один.', 'The upper bound first, then the lower: one is subtracted from nine.') },
    ],
  },
  holds: [3500, 6500, 6000, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi tartibga qaraymiz.', 'Прогноз есть. Теперь посмотрим на порядок.', 'The guess is made. Now let us look at the order.'),
    A('p1', "Birinchi nomzod: birdan to'qqizni ayirdi va minus sakkiz oldi. Son o'zi to'g'ri sanalgan.", 'Первый кандидат: вычел из единицы девятку и получил минус восемь. Само число посчитано верно.', 'The first candidate: subtracted nine from one and got minus eight. The number itself is counted correctly.'),
    A('p2', "Ikkinchi nomzod: to'qqizdan birni ayirdi va sakkiz oldi. Qaysi biri to'g'ri ekanini ma'no aytadi: yuza chapdan o'ngga to'planadi, demak boshlanish ayiriladi.", 'Второй кандидат: вычел из девяти единицу и получил восемь. Какой верный, говорит смысл: площадь набирается слева направо, значит вычитается начало.', 'The second candidate: subtracted one from nine and got eight. Which is right is told by meaning: the area accumulates left to right, so the start is subtracted.'),
    A('write', "Va tekshiruv: egri chiziq bu yerda o'q ustida, demak javob musbat. Integralni yozing.", 'И проверка: кривая здесь над осью, значит ответ положительный. Запиши интеграл.', 'And a check: the curve here is above the axis, so the answer is positive. Write the integral.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: YOZUV va XOSSALAR.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'bounds_order',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Yozuv va xossalar', 'Запись и свойства', 'Notation and properties'),
  cases: [
    {
      label: L('yuqoridan', 'сверху', 'from above'),
      text: L('b qo\'yiladi', 'подставляется b', 'b is substituted'),
      tone: 'graph',
    },
    {
      label: L('pastdan', 'снизу', 'from below'),
      text: L('a qo\'yiladi va ayiriladi', 'подставляется a и вычитается', 'a is substituted and subtracted'),
      tone: 'accent',
    },
  ],
  rows: ['∫ₐᵇ f dx = F(x) |ₐᵇ', '∫ₐᵃ f dx = 0'],
  probe: {
    question: L("Chegaralar joyi almashsa, javob nima bo'ladi?", 'Что будет с ответом, если поменять границы местами?', 'What happens to the answer if the bounds are swapped?'),
    items: [
      { id: 'a', label: L('ishorasi almashadi', 'меняет знак', 'it changes sign'), correct: true },
      { id: 'b', label: L("o'zgarmaydi", 'не меняется', 'it does not change'), hint: L("Tekshiring: to'qqizdan bir sakkiz, birdan to'qqiz esa minus sakkiz.", 'Проверь: из девяти один это восемь, а из единицы девять это минус восемь.', 'Check: nine minus one is eight, one minus nine is minus eight.') },
      { id: 'c', label: L('nolga aylanadi', 'становится нулём', 'it becomes zero'), hint: L("Nol faqat chegaralar bir xil bo'lganda chiqadi.", 'Ноль выходит только когда границы совпадают.', 'Zero comes out only when the bounds coincide.') },
      { id: 'd', label: L("ikki barobar ortadi", 'удваивается', 'it doubles'), hint: L("Ayirmaning o'rni almashsa, faqat ishora almashadi.", 'Если поменять местами уменьшаемое и вычитаемое, меняется только знак.', 'Swapping the two terms of a difference changes only the sign.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Yozuv', 'Правило 2. Запись', 'Rule 2. The notation'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'F(x) |ₐᵇ = F(b) − F(a)',
    lines: [
      L("vertikal chiziq qo'yishni kutib turgan joyni bildiradi", 'вертикальная черта означает, что подстановка ещё впереди', 'the vertical bar means the substitution is still to come'),
      L('chegaralar joyi almashsa, ishora almashadi', 'поменяли границы местами, изменился знак', 'swap the bounds and the sign flips'),
      L("chegaralar bir xil bo'lsa, integral nol", 'если границы совпали, интеграл равен нулю', 'if the bounds coincide, the integral is zero'),
      L("oraliqni ikkiga bo'lish mumkin: bo'laklar qo'shiladi", 'отрезок можно разрезать: куски складываются', 'the segment can be cut: the pieces add up'),
    ],
    example: L('misol:  x² |₁³ = 9 − 1 = 8', 'пример:  x² |₁³ = 9 − 1 = 8', 'example:  x² |₁³ = 9 − 1 = 8'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: '∫ₐᵇ f dx = F(b) − F(a)',
    lines: [
      L("1. boshlang'ich funksiyani top, o'zgarmas kerak emas", '1. найди первообразную, постоянная не нужна', '1. find the antiderivative, no constant needed'),
      L('2. yuqori chegarani qo\'y', '2. подставь верхнюю границу', '2. substitute the upper bound'),
      L('3. quyi chegarani qo\'y va ayir', '3. подставь нижнюю и вычти', '3. substitute the lower one and subtract'),
      L("4. ishorani ma'no bilan tekshir", '4. проверь знак смыслом', '4. check the sign by meaning'),
    ],
  },
  holds: [4000, 6000, 4500, 5000],
  audio: [
    A('mount', "Tartib aniqlandi. Endi yozuvni va ikki xossani qo'shamiz.", 'С порядком разобрались. Теперь добавим запись и два свойства.', 'The order is settled. Now let us add the notation and two properties.'),
    A('rows', "Boshlang'ich funksiyani yozib, o'ng tomoniga vertikal chiziq qo'yiladi va chekkalari yoziladi. Bu qo'yish hali oldinda degani. Va bitta oddiy xossa: chegaralar bir xil bo'lsa, integral nolga teng, chunki oraliq bo'sh.", 'Записывают первообразную, справа ставят вертикальную черту и у неё края. Это значит, что подстановка ещё впереди. И одно простое свойство: если границы совпали, интеграл равен нулю, потому что отрезок пустой.', 'You write the antiderivative, put a vertical bar to its right and the ends at it. That means the substitution is still to come. And one simple property: if the bounds coincide, the integral is zero, because the segment is empty.'),
    A('q', "Savol: chegaralar joyi almashsa nima bo'ladi?", 'Вопрос: что будет, если поменять границы местами?', 'The question: what happens if the bounds are swapped?'),
    A('rule', "To'g'ri. Ayirmaning o'rni almashsa, faqat ishora almashadi. Bu xato emas, lekin savolga javob emas: chegaralar shartda qanday bo'lsa, shunday qo'yiladi.", 'Верно. Если поменять местами уменьшаемое и вычитаемое, меняется только знак. Это не ошибка, но и не ответ на вопрос: границы подставляют так, как они стоят в условии.', 'Correct. Swapping the two terms of a difference changes only the sign. That is not a mistake, but it is not the answer either: the bounds are substituted as they stand in the problem.'),
    A('both', 'Endi butun usulni bitta qoidaga yig\'ing.', 'А теперь собери весь способ в одно правило.', 'Now combine the whole method into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. TARTIBNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'bounds_order',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Tartibni qo\'ying', 'Поставь порядок', 'Set the order'),
  left: '∫₁³ 2x dx,    F = x²',
  template: ['= ', { slot: 0 }],
  signs: ['9 − 1', '1 − 9'],
  answer: '9 − 1',
  checkNote: L(
    "Egri chiziq o'q ustida: javob musbat bo'lishi shart",
    'Кривая над осью: ответ обязан быть положительным',
    'The curve is above the axis: the answer must be positive',
  ),
  wrongs: [
    { key: '1 − 9', hint: L("Minus sakkiz chiqadi. Lekin egri chiziq bu oraliqda o'q ustida, ya'ni javob musbat bo'lishi kerak.", 'Выйдет минус восемь. Но кривая на этом отрезке над осью, значит ответ должен быть положительным.', 'That gives minus eight. But the curve on this segment is above the axis, so the answer must be positive.') },
  ],
  probe: {
    question: L("Tartibni nima aniqlaydi?", 'Что задаёт порядок?', 'What sets the order?'),
    items: [
      { id: 'a', label: L("yuza chapdan o'ngga to'planadi: boshlanish ayiriladi", 'площадь набирается слева направо: вычитается начало', 'the area accumulates left to right: the start is subtracted'), correct: true },
      { id: 'b', label: L("kattadan kichigi ayiriladi", 'из большего вычитается меньшее', 'the smaller is subtracted from the larger'), hint: L("Bu har doim ishlamaydi: egri chiziq o'q ostida bo'lsa, javob manfiy bo'lishi kerak.", 'Это не всегда работает: если кривая под осью, ответ должен быть отрицательным.', 'That does not always work: if the curve is below the axis, the answer must be negative.') },
      { id: 'c', label: L('tartib muhim emas', 'порядок не важен', 'the order does not matter'), hint: L("Muhim: ishora almashadi.", 'Важен: меняется знак.', 'It matters: the sign flips.') },
      { id: 'd', label: L("belgining chekkalari", 'края у значка', 'the ends of the sign'), hint: L("Chekkalar tartibni ko'rsatadi, lekin savol nega shunday ekanida.", 'Края показывают порядок, но вопрос в том, почему он такой.', 'The ends show the order, but the question is why it is so.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Tartibni tanlang.", 'Выбери порядок.', 'Choose the order.'),
    A('checked', "Bo'ldi. Endi ta'riflang: tartibni nima aniqlaydi?", 'Получилось. Теперь сформулируй: что задаёт порядок?', 'Done. Now put it into words: what sets the order?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'anti', label: L("boshlang'ich funksiyani topish", 'найти первообразную', 'find the antiderivative') },
  { id: 'sub', label: L('chegaralarni qo\'yish', 'подставить границы', 'substitute the bounds') },
  { id: 'minus', label: L('ayirish', 'вычесть', 'subtract') },
  { id: 'plusC', label: L('+ C qo\'shish', 'добавить + C', 'add + C') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'plus_c',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: '∫₁² (3x² − 1) dx',
  actions: ACTIONS_10,
  steps: [
    {
      action: 'anti',
      to: 'F = x³ − x',
      wrongs: [
        { action: 'sub', hint: L("Hali qo'yadigan narsa yo'q: avval boshlang'ich funksiya.", 'Пока подставлять некуда: сначала первообразная.', 'There is nothing to substitute into yet: the antiderivative first.') },
        { action: 'minus', hint: L("Ayiradigan narsa ham yo'q.", 'И вычитать пока нечего.', 'And there is nothing to subtract yet.') },
        { action: 'plusC', hint: L("Aniq integralda o'zgarmas kerak emas: u ayirishda qisqaradi.", 'В определённом интеграле постоянная не нужна: она сокращается при вычитании.', 'In a definite integral the constant is not needed: it cancels in the subtraction.') },
      ],
    },
    {
      action: 'sub',
      to: 'F(2) = 6,    F(1) = 0',
      wrongs: [
        { action: 'anti', hint: L("Boshlang'ich funksiya topilgan.", 'Первообразная уже найдена.', 'The antiderivative is already found.') },
        { action: 'minus', hint: L("Avval ikkala chegarani ham qo'ying.", 'Сначала подставь обе границы.', 'Substitute both bounds first.') },
        { action: 'plusC', hint: L("O'zgarmas bu yerda kerak emas.", 'Постоянная здесь не нужна.', 'The constant is not needed here.') },
      ],
    },
    {
      action: 'minus',
      to: '∫ = 6',
      wrongs: [
        { action: 'anti', hint: L("Topilgan.", 'Найдена.', 'Found.') },
        { action: 'sub', hint: L("Qo'yilgan: olti va nol.", 'Подставлено: шесть и ноль.', 'Substituted: six and zero.') },
        { action: 'plusC', hint: L("O'zgarmas qisqaradi.", 'Постоянная сокращается.', 'The constant cancels.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['6', '8', '−6', '7'],
    value: ['6'],
    label: '∫ =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '−6', hint: L("Tartib teskari olingan: avval yuqori chegara.", 'Порядок взят обратный: сначала верхняя граница.', 'The order was taken backwards: the upper bound first.') },
      { key: '8', hint: L("Bir da ef nolga teng: bir kubi minus bir bu nol.", 'В единице эф равна нулю: один в кубе минус один это ноль.', 'At one F equals zero: one cubed minus one is zero.') },
      { key: '*', hint: L("F teng iks kubi minus iks. Ikkida olti, birda nol.", 'F равна икс в кубе минус икс. В двух шесть, в единице ноль.', 'F equals x cubed minus x. At two it is six, at one zero.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi ikki qo\'shiluvchili misolni o\'tamiz.', 'Правило сформулировано. Пройдём пример с двумя слагаемыми.', 'The rule is stated. Let us go through an example with two terms.'),
    A('start', "Diqqat: ro'yxatda ortiqcha amal ham bor. Nimadan boshlashni tanlang.", 'Внимание: в списке есть и лишнее действие. Выбери, с чего начать.', 'Careful: the list contains one superfluous action. Choose where to start.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'trig_sign',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Integralni hisoblang', 'Посчитай интеграл', 'Compute the integral'),
  start: '∫₀^π sin x dx',
  actions: ACTIONS_10,
  hint: L(
    "Sinusning boshlang'ich funksiyasi minus bilan. Ikkita minus uchrashadi.",
    'Первообразная синуса идёт с минусом. Встретятся два минуса.',
    'The antiderivative of sine comes with a minus. Two minuses will meet.',
  ),
  steps: [
    {
      action: 'anti',
      to: 'F = −cos x',
      wrongs: [
        { action: 'sub', hint: L("Avval boshlang'ich funksiya.", 'Сначала первообразная.', 'The antiderivative first.') },
        { action: 'minus', hint: L("Ayiradigan narsa yo'q.", 'Вычитать нечего.', 'There is nothing to subtract.') },
        { action: 'plusC', hint: L("O'zgarmas kerak emas.", 'Постоянная не нужна.', 'The constant is not needed.') },
      ],
    },
    {
      action: 'sub',
      to: 'F(π) = 1,    F(0) = −1',
      wrongs: [
        { action: 'anti', hint: L("Topilgan: minus kosinus.", 'Найдена: минус косинус.', 'Found: minus cosine.') },
        { action: 'minus', hint: L("Avval ikkala chegarani qo'ying.", 'Сначала подставь обе границы.', 'Substitute both bounds first.') },
        { action: 'plusC', hint: L("Qisqaradi.", 'Сокращается.', 'It cancels.') },
      ],
    },
    {
      action: 'minus',
      to: '∫ = 2',
      wrongs: [
        { action: 'anti', hint: L("Topilgan.", 'Найдена.', 'Found.') },
        { action: 'sub', hint: L("Qo'yilgan: bir va minus bir.", 'Подставлено: один и минус один.', 'Substituted: one and minus one.') },
        { action: 'plusC', hint: L("Qisqaradi.", 'Сокращается.', 'It cancels.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['2', '0', '−2', '1'],
    value: ['2'],
    label: '∫ =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '0', hint: L("Bir minus minus bir bu ikki, nol emas.", 'Один минус минус один это два, а не ноль.', 'One minus minus one is two, not zero.') },
      { key: '−2', hint: L("Sinus noldan pigacha o'q ustida, demak javob musbat.", 'Синус от нуля до пи идёт над осью, значит ответ положительный.', 'From zero to pi the sine runs above the axis, so the answer is positive.') },
      { key: '*', hint: L("Minus kosinus pida birga teng, nolda esa minus birga.", 'Минус косинус в пи равен единице, а в нуле минус единице.', 'Minus cosine at pi equals one, and at zero minus one.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Sinus, va chegaralar noldan pigacha. Ishoraga diqqat.", 'Синус, и границы от нуля до пи. Внимание на знак.', 'Sine, and the bounds from zero to pi. Watch the sign.'),
    A('answered', "Javobni yozing.", 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 12. BLITS.
// ============================================================
const S12 = {
  role: 'blitz',
  led: 'student',
  eyebrow: L('Blits', 'Блиц', 'Quick round'),
  title: L('Olti savol', 'Шесть вопросов', 'Six questions'),
  items: [
    {
      id: 'b1', tag: 'bounds_order', ask: true, cols: 4,
      done: '∫₀² 2x dx = 4',
      prompt: L('∫₀² 2x dx = ?', 'Чему равен ∫₀² 2x dx ?', 'What is ∫₀² 2x dx ?'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '2', hint: L("F teng iks kvadrat: ikkida to'rt, nolda nol.", 'F равна икс в квадрате: в двух четыре, в нуле ноль.', 'F equals x squared: at two four, at zero zero.') },
        { id: 'c', label: '−4', hint: L("Tartib teskari: avval yuqori chegara.", 'Порядок обратный: сначала верхняя граница.', 'The order is backwards: the upper bound first.') },
        { id: 'd', label: '8', hint: L("Ikkining kvadrati to'rt, sakkiz emas.", 'Два в квадрате это четыре, а не восемь.', 'Two squared is four, not eight.') },
      ],
    },
    {
      id: 'b2', tag: 'trig_sign', ask: true, cols: 4,
      done: '∫₀^{π/2} cos x dx = 1',
      prompt: L('∫₀^{π/2} cos x dx = ?', 'Чему равен ∫₀^{π/2} cos x dx ?', 'What is ∫₀^{π/2} cos x dx ?'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '0', hint: L("F teng sinus: pi bo'lingan ikkida bir, nolda nol.", 'F равна синусу: в пи пополам единица, в нуле ноль.', 'F equals sine: at pi over two one, at zero zero.') },
        { id: 'c', label: '−1', hint: L("Kosinusning boshlang'ich funksiyasi sof sinus, minussiz.", 'Первообразная косинуса это чистый синус, без минуса.', 'The antiderivative of cosine is plain sine, no minus.') },
        { id: 'd', label: 'π/2', hint: L("Chegara javobga o'zi kirmaydi: unga F qo'yiladi.", 'Граница сама в ответ не входит: в неё подставляют F.', 'The bound itself is not the answer: F is evaluated at it.') },
      ],
    },
    {
      id: 'b3', tag: 'plus_c', ask: true, cols: 2,
      done: L('javob bu son', 'ответ это число', 'the answer is a number'),
      prompt: L(
        "Aniq integralning javobi funksiyami yoki son?",
        'Ответ определённого интеграла это функция или число?',
        'Is the answer of a definite integral a function or a number?',
      ),
      items: [
        { id: 'a', label: L('son', 'число', 'a number'), correct: true },
        { id: 'b', label: L("funksiya, + C bilan", 'функция, с + C', 'a function, with + C'), hint: L("Bu aniqmas integralning javobi. Chekkalar paydo bo'lganda javob songa aylanadi.", 'Это ответ неопределённого интеграла. Как появились края, ответ становится числом.', 'That is the answer of an indefinite integral. Once the ends appear, the answer becomes a number.') },
        { id: 'c', label: L("boshlang'ich funksiya", 'первообразная', 'the antiderivative'), hint: L("Boshlang'ich funksiya yo'lda kerak bo'ladi, lekin javob emas.", 'Первообразная нужна по дороге, но она не ответ.', 'The antiderivative is needed on the way, but it is not the answer.') },
        { id: 'd', label: L('oraliq', 'промежуток', 'an interval'), hint: L("Oraliq bu chegaralar. Javob esa bitta son.", 'Промежуток это границы. А ответ одно число.', 'An interval is the bounds. The answer is one number.') },
      ],
    },
    {
      id: 'b4', tag: 'accumulation', ask: true, cols: 4,
      done: '∫ₐᵃ f dx = 0',
      prompt: L('∫ₐᵃ f(x) dx = ?', 'Чему равен ∫ₐᵃ f(x) dx ?', 'What is ∫ₐᵃ f(x) dx ?'),
      items: [
        { id: 'a', label: '0', correct: true },
        { id: 'b', label: 'F(a)', hint: L("F(a) dan F(a) ayiriladi va nol qoladi.", 'Из F(a) вычитается F(a) и остаётся ноль.', 'F(a) minus F(a) leaves zero.') },
        { id: 'c', label: '2F(a)', hint: L("Ayiriladi, qo'shilmaydi.", 'Вычитается, а не складывается.', 'Subtracted, not added.') },
        { id: 'd', label: 'f(a)', hint: L("Oraliq bo'sh: yuza yo'q.", 'Отрезок пустой: площади нет.', 'The segment is empty: there is no area.') },
      ],
    },
    {
      id: 'b5', tag: 'bounds_order', ask: true, cols: 2,
      done: L('ishora almashadi', 'знак меняется', 'the sign flips'),
      prompt: L(
        "Chegaralar joyi almashtirildi. Javob bilan nima bo'ladi?",
        'Границы поменяли местами. Что будет с ответом?',
        'The bounds were swapped. What happens to the answer?',
      ),
      items: [
        { id: 'a', label: L('ishorasi almashadi', 'меняет знак', 'it changes sign'), correct: true },
        { id: 'b', label: L("o'zgarmaydi", 'не меняется', 'it does not change'), hint: L("Ayirmada o'rinlar almashsa, ishora almashadi.", 'В разности меняются местами, значит меняется знак.', 'In a difference, swapping the terms flips the sign.') },
        { id: 'c', label: L('nol bo\'ladi', 'станет нулём', 'it becomes zero'), hint: L("Nol chegaralar bir xil bo'lganda chiqadi.", 'Ноль выходит при совпавших границах.', 'Zero comes with coinciding bounds.') },
        { id: 'd', label: L("aniqlab bo'lmaydi", 'определить нельзя', 'it cannot be determined'), hint: L("Mumkin: ayirma ishorasini o'zgartiradi.", 'Можно: разность меняет знак.', 'It can: the difference changes sign.') },
      ],
    },
    {
      id: 'b6', tag: 'bounds_order', ask: true, cols: 4,
      done: '∫₀¹ 3x² dx = 1',
      prompt: L('∫₀¹ 3x² dx = ?', 'Чему равен ∫₀¹ 3x² dx ?', 'What is ∫₀¹ 3x² dx ?'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '3', hint: L("Ko'paytuvchi uch bo'lishga qisqaradi: F teng iks kubi.", 'Множитель три сокращается делением: F равна икс в кубе.', 'The factor three cancels with the division: F equals x cubed.') },
        { id: 'c', label: '1/3', hint: L("Uchga bo'lish uchlik ko'paytuvchi bilan qisqargan.", 'Деление на три уже сократилось с множителем три.', 'The division by three already cancelled with the factor three.') },
        { id: 'd', label: '0', hint: L("Birda ef birga teng, nolda nolga.", 'В единице эф равна единице, в нуле нулю.', 'At one F equals one, at zero zero.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi kosinus.", 'Теперь косинус.', 'Now cosine.'),
    A('q3', "Bu savol farq haqida.", 'Этот вопрос про различие.', 'This question is about the difference.'),
    A('q4', "Bo'sh oraliq.", 'Пустой отрезок.', 'An empty segment.'),
    A('q5', "Tartib haqida.", 'Про порядок.', 'About the order.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: chegaralar teskari qo'yilgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'bounds_order',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Arifmetika to'g'ri, javob xato", 'Арифметика верна, ответ неверный', 'The arithmetic is right, the answer is wrong'),
  rows: [
    { id: 'r1', text: '∫₁³ 2x dx,    F = x²' },
    { id: 'r2', text: 'F(1) − F(3) = 1 − 9' },
    { id: 'r3', text: '= −8' },
    { id: 'r4', text: L('javob: −8', 'ответ: −8', 'answer: −8') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu shart va to'g'ri topilgan boshlang'ich funksiya.", 'Это условие и верно найденная первообразная.', 'This is the problem and a correctly found antiderivative.'),
    r3: L("Bu satr arifmetik jihatdan to'g'ri: birdan to'qqiz haqiqatan minus sakkiz. Xato oldingi satrda: nima nimadan ayirilgani.", 'Эта строка арифметически верна: один минус девять действительно минус восемь. Ошибка в предыдущей: что из чего вычли.', 'This line is arithmetically right: one minus nine really is minus eight. The error is in the previous line: what was subtracted from what.'),
    r4: L("Javob xato, lekin u oldin xato bo'lgan.", 'Ответ неверный, но неверным он стал раньше.', 'The answer is wrong, but it became wrong earlier.'),
  },
  proofPoint: '2x > 0   →   ∫ > 0',
  proof: L(
    "Egri chiziq birdan uchgacha o'q ustida turibdi, demak integral musbat bo'lishi shart. Minus sakkiz bo'la olmaydi. Tartib teskari olingan: to'qqizdan bir ayirilishi kerak edi.",
    'Кривая от одного до трёх идёт над осью, значит интеграл обязан быть положительным. Минус восемь невозможен. Порядок взят обратный: надо было вычесть из девяти единицу.',
    'From one to three the curve runs above the axis, so the integral must be positive. Minus eight is impossible. The order was taken backwards: one had to be subtracted from nine.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("chegaralar teskari tartibda qo'yilgan", 'границы подставлены в обратном порядке', 'the bounds were substituted in reverse order'), correct: true },
      { id: 'b', label: L("boshlang'ich funksiya noto'g'ri", 'первообразная найдена неверно', 'the antiderivative is wrong'), hint: L("Iks kvadratning hosilasi ikki iks: to'g'ri topilgan.", 'Производная икс в квадрате это два икс: найдена верно.', 'The derivative of x squared is two x: found correctly.') },
      { id: 'c', label: L('arifmetikada xato', 'ошибка в арифметике', 'an arithmetic error'), hint: L("Arifmetika to'g'ri, va aynan shu chalg'itadi.", 'Арифметика верна, и это как раз и сбивает.', 'The arithmetic is right, and that is exactly what misleads.') },
      { id: 'd', label: L("+ C yozilmagan", 'не написано + C', '+ C was not written'), hint: L("Aniq integralda u kerak emas: qisqaradi.", 'В определённом интеграле она не нужна: сокращается.', 'In a definite integral it is not needed: it cancels.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda boshlang'ich funksiya to'g'ri topilgan va arifmetika ham to'g'ri. Shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь первообразная найдена верно и арифметика верна. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Here the antiderivative is right and the arithmetic is right. And still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Tekshiruv ma'no bilan: ikki iks birdan uchgacha musbat, ya'ni egri chiziq o'q ustida. Unda integral ham musbat bo'lishi shart, minus sakkiz esa manfiy. Demak tartib teskari.", 'Проверка смыслом: два икс от одного до трёх положительно, то есть кривая над осью. Тогда и интеграл обязан быть положительным, а минус восемь отрицателен. Значит порядок обратный.', 'A check by meaning: two x from one to three is positive, so the curve is above the axis. Then the integral must be positive too, and minus eight is negative. So the order is reversed.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'bounds_order',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Formulani yig\'ing', 'Собери формулу', 'Build the formula'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L("yuqori chegara birinchi", 'верхняя граница первой', 'the upper bound comes first'),
  tasks: [
    {
      prompt: '∫₀² x² dx,    F = x³/3',
      template: ['= ', { slot: 0 }, '  −  ', { slot: 1 }],
      parts: ['8/3', '0', '2', '4/3'],
      answer: ['8/3', '0'],
      doneLabel: '8/3 − 0 = 8/3',
      wrongs: [
        { key: '0|8/3', hint: L("Yuqori chegara birinchi turadi.", 'Верхняя граница стоит первой.', 'The upper bound comes first.') },
        { key: '*', hint: L("Ikkida F teng sakkiz uchdan, nolda nol.", 'В двух F равна восемь третьих, в нуле ноль.', 'At two F equals eight thirds, at zero zero.') },
      ],
    },
    {
      prompt: '∫₁⁴ 2x dx,    F = x²',
      template: ['= ', { slot: 0 }, '  −  ', { slot: 1 }],
      parts: ['16', '1', '4', '8'],
      answer: ['16', '1'],
      doneLabel: '16 − 1 = 15',
      wrongs: [
        { key: '1|16', hint: L("Tartib teskari: javob manfiy chiqadi, egri chiziq esa o'q ustida.", 'Порядок обратный: ответ выйдет отрицательным, а кривая над осью.', 'The order is reversed: the answer would be negative, but the curve is above the axis.') },
        { key: '*', hint: L("To'rtda F teng o'n olti, birda bir.", 'В четырёх F равна шестнадцати, в единице единице.', 'At four F equals sixteen, at one one.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi, va u yerda quyi chegara nol emas.", 'А теперь второе, и там нижняя граница не ноль.', 'And now the second one, and there the lower bound is not zero.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'bounds_order',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: '∫ₐᵇ f dx = F(b) − F(a)',
  ruleLines: [
    L("boshlang'ich funksiyani top, o'zgarmas kerak emas", 'найди первообразную, постоянная не нужна', 'find the antiderivative, no constant needed'),
    L('yuqori chegara birinchi, quyi ayiriladi', 'верхняя граница первой, нижняя вычитается', 'the upper bound first, the lower is subtracted'),
    L("javobni ishora bilan tekshir", 'проверь ответ знаком', 'check the answer by its sign'),
  ],
  predicts: [
    {
      screen: 0,
      expr: '∫₀³ x² dx',
      right: '9',
      map: {
        a: L('taxminan 7,7', 'примерно 7,7', 'about 7,7'),
        b: '9',
        both: '—',
        none: '—',
      },
    },
    {
      screen: 5,
      expr: L("yo'l, v = 3t², 1 … 2", 'путь, v = 3t², 1 … 2', 'distance, v = 3t², 1 … 2'),
      right: '7',
      map: { a: '7', b: '8', c: '9', d: '1' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '∫₀³ x² dx = 27/3 − 0 = 9',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Formulaning chiqarilishiga qayting', 'Вернись к выводу формулы', 'Go back to the derivation of the formula'),
  },
  probe: {
    question: L(
      "Javobni qanday tekshirasiz, agar formulani to'g'ri qo'llaganingizga ishonchingiz bo'lmasa?",
      'Как проверить ответ, если не уверен, что формулу применил верно?',
      'How do you check the answer if you are not sure you applied the formula correctly?',
    ),
    items: [
      { id: 'a', label: L("ishora bo'yicha: egri chiziq o'q ustidami yoki ostida", 'по знаку: кривая над осью или под ней', 'by the sign: is the curve above or below the axis'), correct: true },
      { id: 'b', label: L('qayta sanash', 'посчитать заново', 'count again'), hint: L("O'sha usul o'sha tartibni takrorlaydi.", 'Тот же способ повторит тот же порядок.', 'The same way repeats the same order.') },
      { id: 'c', label: L("javoblarga qarash", 'посмотреть в ответы', 'look at the answers'), hint: L("Imtihonda javoblar bo'lmaydi.", 'На экзамене ответов нет.', 'On the exam there are no answers.') },
      { id: 'd', label: L('hech qanday', 'никак', 'there is no way'), hint: L("Bor: ishora chizmadan darrov ko'rinadi.", 'Есть: знак виден по чертежу сразу.', 'There is: the sign is visible from the drawing at once.') },
    ],
  },
  sheetTitle: L('Nyuton-Leybnits · shpargalka', 'Ньютон-Лейбниц · шпаргалка', 'Newton-Leibniz · cheat sheet'),
  sheetSrc: L('11-sinf · 5-dars', '11 класс · урок 5', 'Grade 11 · lesson 5'),
  lifehack: L(
    "Javobni yozishdan oldin chizmaga bir soniya qarang: egri chiziq o'q ustida bo'lsa, javob musbat. Bu tartibdagi xatoni darrov ushlaydi.",
    'Перед тем как записать ответ, глянь на чертёж секунду: кривая над осью значит ответ положительный. Это сразу ловит ошибку в порядке.',
    'Before writing the answer, glance at the drawing for a second: the curve above the axis means a positive answer. That catches an order mistake at once.',
  ),
  holds: [2500, 7500, 7000, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Birinchi savolda to'rtburchaklar yaqinlashtirdi, formula esa aniq son berdi.", 'Вот твои прогнозы и вот как оказалось. В первом вопросе прямоугольники приблизили, а формула дала точное число.', 'Here are your guesses and here is how it turned out. In the first question rectangles approximated, and the formula gave the exact number.'),
    A('rule', "Va mana asosiy fikr. Formula osmondan tushmadi: uni biz uchta tayanchdan yig'dik. Yuzaning hosilasi egri chiziqqa teng, ikkita boshlang'ich funksiya o'zgarmasga farq qiladi, va chap chegarada yuza nol. Uchtasi birga ef bedan ef a ayirilganini beradi.", 'И вот главная мысль. Формула не свалилась с неба: мы собрали её из трёх опор. Производная площади равна кривой, две первообразные отличаются на постоянную, и на левой границе площадь ноль. Три вместе дают эф от бэ минус эф от а.', 'And here is the main point. The formula did not fall from the sky: we assembled it from three basics. The derivative of the area equals the curve, two antiderivatives differ by a constant, and at the left boundary the area is zero. The three together give F of b minus F of a.'),
    A('q', "Oxirgi savol: javobni qanday tekshirasiz?", 'Последний вопрос: как проверить ответ?', 'The last question: how do you check the answer?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
