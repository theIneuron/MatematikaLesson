// ============================================================================
// 11-sinf, Dars 06. TEKIS FIGURANING YUZASI.
//
// B1 blokining OLTINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/DARS06_SKELET.md
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// 5-dars integralni SANASHNI o'rgatdi. 6-dars esa qaysi integralni YOZISH
// kerakligini aytadi. Bu ikki xil malaka, va imtihonda ikkinchisi qimmatroq:
// formulani deyarli hamma eslaydi, yozuvni esa noto'g'ri tuzadi.
//
// DARSNING BITTA GAPI: yuza har doim «yuqoridagi minus pastdagi», va
// chegaralar kesishish nuqtalaridan olinadi. Bitta ta'rif uchala holatni
// qoplaydi: figura o'q ustida (pastdagisi o'qning o'zi), o'q ostida
// (yuqoridagisi o'q), ikki egri chiziq orasida (ikkalasi ham berilgan).
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'
// 11-ekran imtihon formatida: figura CHIZMA bilan beriladi.
import { AreaBoard } from './tools.jsx'

const META = {
  id: 'alg_11_06',
  title: L('Tekis figuraning yuzasi', 'Площадь плоской фигуры', 'The area of a plane figure'),
}

const BLOCK = { label: 'B1', from: 1, to: 7, current: 6 }

const LINE = (x) => x
const PARA = (x) => x * x

// ============================================================
// SLAYD 1. XUK. Qo'shish yoki ayirish.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Tekis figuraning yuzasi', 'Площадь плоской фигуры', 'The area of a plane figure'),
  title: L("Qo'shish yoki ayirish", 'Сложить или вычесть', 'Add or subtract'),
  expr: L('y = x va y = x² orasidagi yuza', 'Площадь между y = x и y = x²', 'The area between y = x and y = x²'),
  rows: [
    {
      id: 'a',
      name: L("ikki yuza qo'shildi", 'две площади сложены', 'the two areas added'),
      value: '1/3 + 1/2 = 5/6',
    },
    {
      id: 'b',
      name: L('ikki yuza ayirildi', 'две площади вычтены', 'the two areas subtracted'),
      value: '1/2 − 1/3 = 1/6',
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Ikkala integral ham to'g'ri sanalgan, gap ular bilan nima qilishda.",
      'Твой ответ записан. Оба интеграла посчитаны верно, вопрос в том, что с ними сделать.',
      'Your answer is saved. Both integrals are computed correctly, the question is what to do with them.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первое', 'the first') },
      { id: 'b', label: L('ikkinchi', 'второе', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  holds: [5500, 5000, 5000, 4000],
  audio: [
    A('mount', "O'tgan dars integralni sanashni berdi. Bugun boshqa savol: qaysi integralni yozish kerak. Imtihonda aynan shu joyda masala butunlay yo'qoladi.", 'Прошлый урок дал умение считать интеграл. Сегодня другой вопрос: какой интеграл записать. На экзамене именно здесь задача теряется целиком.', 'Last lesson gave the skill of computing an integral. Today a different question: which integral to write. On the exam this is exactly where a problem is lost entirely.'),
    A('r1', "Birinchi yechim: ikkita integral sanalgan va qo'shilgan. Besh oltidan chiqqan.", 'Первое решение: посчитаны два интеграла и сложены. Вышло пять шестых.', 'The first solution: two integrals computed and added. Five sixths came out.'),
    A('r2', "Ikkinchi yechim: o'sha ikkita integral, lekin ayirilgan. Bir oltidan chiqqan.", 'Второе решение: те же два интеграла, но вычтены. Вышло одна шестая.', 'The second solution: the same two integrals, but subtracted. One sixth came out.'),
    A('ask', "Sizningcha qaysi yechim to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какое решение верное? Пока просто предположи.', 'Which solution do you think is correct? Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. TAYANCH.
// ============================================================
const S2 = {
  role: 'support',
  eyebrow: L('Tayanchni tekshirish', 'Проверка опоры', 'Checking the basics'),
  title: L('Uch tayanch', 'Три опоры', 'Three basics'),
  lead: L(
    "Uchta narsa kerak bo'ladi: ikkita integral va kesishish nuqtalari. Bu baholanmaydi.",
    'Понадобятся три вещи: два интеграла и точки пересечения. Это не оценивается.',
    'Three things will be needed: two integrals and the intersection points. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L("To'g'ri chiziq ostidagi yuza", 'Площадь под прямой', 'The area under the line'),
      short: L('5-darsdan', 'из урока 5', 'from lesson 5'),
      ex: [{ e: '∫₀¹ x dx = 1/2', why: L('katetlari bir va bir uchburchak', 'треугольник с катетами один и один', 'a triangle with legs one and one') }],
    },
    {
      id: 'c2',
      title: L('Parabola ostidagi yuza', 'Площадь под параболой', 'The area under the parabola'),
      short: L('5-darsdan', 'из урока 5', 'from lesson 5'),
      ex: [{ e: '∫₀¹ x² dx = 1/3', why: L('F = x³/3, birda bir uchdan', 'F = x³/3, в единице одна треть', 'F = x³/3, at one it is a third') }],
    },
    {
      id: 'c3',
      title: L('Kesishish nuqtalari', 'Точки пересечения', 'The intersection points'),
      short: L('tenglama yechiladi', 'решается уравнение', 'an equation is solved'),
      ex: [{ e: 'x = x²   →   x = 0,  x = 1', why: L('chegaralar shu yerdan olinadi', 'отсюда и берутся границы', 'this is where the bounds come from') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('∫₀¹ x dx = ?', 'Чему равен ∫₀¹ x dx ?', 'What is ∫₀¹ x dx ?'),
      cols: 4,
      items: [
        { id: 'a', label: '1/2', correct: true },
        { id: 'b', label: '1', hint: L("F teng iks kvadrat bo'lingan ikki: birda yarim.", 'F равна икс в квадрате делить на два: в единице половина.', 'F equals x squared over two: at one it is a half.') },
        { id: 'c', label: '1/3', hint: L("Bu parabolaning javobi.", 'Это ответ для параболы.', 'That is the answer for the parabola.') },
        { id: 'd', label: '2', hint: L("Uchburchakning katetlari bir va bir: yuzasi yarim.", 'У треугольника катеты один и один: площадь половина.', 'The triangle has legs one and one: its area is a half.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('x = x² tenglamaning ildizlari?', 'Корни уравнения x = x² ?', 'The roots of x = x² ?'),
      cols: 4,
      items: [
        { id: 'a', label: '0  va  1', correct: true },
        { id: 'b', label: L('faqat 1', 'только 1', 'only 1'), hint: L("Nol ham yechim: nol nolga teng.", 'Ноль тоже решение: ноль равен нулю.', 'Zero is a solution too: zero equals zero.') },
        { id: 'c', label: '0  va  −1', hint: L("Minus birni qo'ying: chapda minus bir, o'ngda bir.", 'Подставь минус один: слева минус один, справа один.', 'Substitute minus one: minus one on the left, one on the right.') },
        { id: 'd', label: '1  va  2', hint: L("Ikkini qo'ying: chapda ikki, o'ngda to'rt.", 'Подставь два: слева два, справа четыре.', 'Substitute two: two on the left, four on the right.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('x = 0,5 da qaysi chiziq balandroq?', 'Какая линия выше при x = 0,5 ?', 'Which line is higher at x = 0,5 ?'),
      cols: 2,
      items: [
        { id: 'a', label: L("to'g'ri chiziq y = x", 'прямая y = x', 'the line y = x'), correct: true },
        { id: 'b', label: L('parabola y = x²', 'парабола y = x²', 'the parabola y = x²'), hint: L("Nol butun besh kvadrati nol butun ikki besh: bu kamroq.", 'Ноль целых пять в квадрате это ноль целых двадцать пять: это меньше.', 'Zero point five squared is zero point two five: that is less.') },
        { id: 'c', label: L('ular teng', 'они равны', 'they are equal'), hint: L("Teng bo'lish faqat nolda va birda, oraliqda esa yo'q.", 'Равны только в нуле и единице, а между ними нет.', 'Equal only at zero and one, but not in between.') },
        { id: 'd', label: L("aniqlab bo'lmaydi", 'определить нельзя', 'it cannot be determined'), hint: L("Mumkin: ikkala qiymatni sanang va solishtiring.", 'Можно: посчитай оба значения и сравни.', 'It can: compute both values and compare.') },
      ],
    },
  ],
  holds: [3000, 4500, 5000, 5000, 4500, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch: to'g'ri chiziq ostidagi yuza noldan birgacha yarimga teng. Buni uchburchak bilan ham, formula bilan ham sanash mumkin.", 'Первая опора: площадь под прямой от нуля до единицы равна половине. Это можно посчитать и треугольником, и формулой.', 'First basic: the area under the line from zero to one is a half. It can be counted with a triangle or with the formula.'),
    A('c2', "Ikkinchi tayanch: parabola ostidagi yuza o'sha oraliqda bir uchdan. Bu yerda uchburchak yo'q, faqat formula.", 'Вторая опора: площадь под параболой на том же отрезке одна треть. Здесь треугольника нет, только формула.', 'Second basic: the area under the parabola on the same segment is a third. Here there is no triangle, only the formula.'),
    A('c3', "Uchinchi tayanch, va u bugun eng muhimi: chegaralar shartdan emas, kesishish nuqtalaridan olinadi. Iks teng iks kvadrat tenglamasi nol va bir beradi.", 'Третья опора, и сегодня она главная: границы берутся не из условия, а из точек пересечения. Уравнение икс равно икс в квадрате даёт ноль и один.', 'Third basic, and today the main one: the bounds come not from the problem text but from the intersection points. The equation x equals x squared gives zero and one.'),
    A('recap', "Ikkita yuza va ikkita chegara bor. Qoldi bitta savol: ular bilan nima qilish kerak.", 'Есть две площади и две границы. Остался один вопрос: что с ними делать.', 'We have two areas and two bounds. One question remains: what to do with them.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. KIM YUQORIDA: sonni qo'yib tekshiramiz.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'between_curves',
  eyebrow: L('Sonni qo\'yib tekshiramiz', 'Проверим подстановкой', 'Let us check by substitution'),
  title: L('Kim yuqorida', 'Кто сверху', 'Which one is on top'),
  expr: L('x = 0,5 ni qo\'yamiz', 'подставим x = 0,5', 'substitute x = 0,5'),
  goal: L('kim balandroq ekanini aniqlash', 'выяснить, кто выше', 'find out which is higher'),
  rule: L(
    "Oraliqdan bitta son olinadi va ikkala chiziqqa ham qo'yiladi. Kimning qiymati katta, o'sha yuqorida.",
    'Из промежутка берётся одно число и подставляется в обе линии. У кого значение больше, тот сверху.',
    'One number from the interval is substituted into both lines. Whichever gives the larger value is on top.',
  ),
  pick: L('Nimani tekshiramiz?', 'Что проверим?', 'What shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L("qo'shish", 'сложение', 'adding'), value: '5/6' },
    { id: 'b', key: 'inB', name: L('ayirish', 'вычитание', 'subtracting'), value: '1/6' },
  ],
  points: [
    {
      id: 'q1', label: 'y = x', num: 'x', step: 'calc', verdict: 'in',
      role: L('yuqoridagi', 'верхняя', 'the upper one'),
      calc: 'x = 0,5:   y = 0,5',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: 'y = x²', num: 'x²', step: 'calc', verdict: 'out',
      role: L('pastdagi', 'нижняя', 'the lower one'),
      calc: 'x = 0,5:   y = 0,25',
      sol: false, inA: false, inB: true,
    },
    {
      // Nomzod ustuni TOR: «ширина полосы» so'zlari 45px kesilardi. Ustunda
      // formula turadi, so'z esa yonidagi `role` da.
      id: 'q3', label: 'x − x²', num: 'x − x²', step: 'calc', verdict: 'in',
      role: L('kenglik: ayirma', 'ширина: разность', 'the width: the difference'),
      calc: '0,5 − 0,25 = 0,25   > 0',
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    items: [
      {
        id: 'b', label: L('ayirish', 'вычитание', 'subtracting'), correct: true,
        ok: L(
          "To'g'ri. Figura ikki chiziq orasida yotibdi, demak uning kengligi ayirmaga teng.",
          'Верно. Фигура лежит между двумя линиями, значит её ширина равна разности.',
          'Correct. The figure lies between the two lines, so its width equals the difference.',
        ),
      },
      {
        id: 'a', label: L("qo'shish", 'сложение', 'adding'),
        hint: L("Qo'shsak, bir bo'lak ikki marta sanaladi: parabola ostidagi yuza to'g'ri chiziq ostidagining ICHIDA yotibdi.", 'При сложении один кусок считается дважды: площадь под параболой лежит ВНУТРИ площади под прямой.', 'Adding counts one piece twice: the area under the parabola lies INSIDE the area under the line.'),
      },
      {
        id: 'both', label: L('ikkisi ham', 'оба', 'both'),
        hint: L("Besh oltidan va bir oltidan besh barobar farq qiladi. Ikkalasi bir vaqtda to'g'ri bo'la olmaydi.", 'Пять шестых и одна шестая отличаются в пять раз. Обе сразу верными быть не могут.', 'Five sixths and one sixth differ fivefold. Both cannot be right at once.'),
      },
      {
        id: 'none', label: L('hech qaysi', 'ни один', 'neither'),
        hint: L("Bittasi to'g'ri: ayirma musbat chiqdi va u figuraning kengligini beradi.", 'Один верный: разность вышла положительной и она даёт ширину фигуры.', 'One is right: the difference came out positive and it gives the width of the figure.'),
      },
    ],
  },
  holds: [2500, 6500, 1500, 2500, 9500, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Bahsga qaytamiz.', 'Опора восстановлена. Вернёмся к спору.', 'The basics are back. Let us return to the argument.'),
    A('mount', "Kim yuqorida ekanini bilish uchun oraliqdan bitta son olinadi va ikkala chiziqqa ham qo'yiladi. Bu blok bo'ylab tanish usul.", 'Чтобы понять, кто сверху, из промежутка берут одно число и подставляют в обе линии. Знакомый по всему блоку приём.', 'To find out which is on top, one number from the interval is substituted into both lines. A familiar trick from the whole block.'),
    A('mount', "Nimani tekshirishni tanlang.", 'Выбери, что проверить.', 'Choose what to check.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Nol butun beshda to'g'ri chiziq nol butun besh beradi, parabola esa nol butun ikki besh. Demak oraliqda to'g'ri chiziq yuqorida, va figuraning kengligi ularning ayirmasi. Ayirma musbat, ya'ni tartib to'g'ri tanlangan.", 'В ноль целых пять прямая даёт ноль целых пять, а парабола ноль целых двадцать пять. Значит на промежутке прямая выше, и ширина фигуры это их разность. Разность положительна, то есть порядок выбран верно.', 'At zero point five the line gives zero point five and the parabola zero point two five. So on the interval the line is higher, and the width of the figure is their difference. The difference is positive, so the order is chosen correctly.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB IKKI EGRI CHIZIQ REJIMIDA.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'between_curves',
  eyebrow: L('Chegarani torting', 'Потяни границу', 'Drag the boundary'),
  title: L('Polosa faqat kesishishlar orasida', 'Полоса только между пересечениями', 'The band lives only between the crossings'),
  chip: 'y = x   ·   y = x²',
  graph: {
    fn: LINE,
    fn2: PARA,
    xDomain: [-0.15, 1.35],
    yDomain: [-0.2, 1.45],
    xTicks: [{ v: 0.5 }, { v: 1 }],
    yTicks: [{ v: 0 }, { v: 1 }],
    a: 0,
    bStart: 0.5,
    step: 0.1,
    fLabel: 'y = x',
    sLabel: 'y = x²',
    areaLabel: L('yuza', 'площадь', 'area'),
    height: 150,
  },
  graphSteps: 3,
  bonus: L(
    "Chegarani birdan o'tkazing: polosa rangini o'zgartiradi. U yerda parabola to'g'ri chiziqdan balandroq bo'ladi, ya'ni yuqoridagi va pastdagi joyini almashadi.",
    'Проведи границу дальше единицы: полоса меняет цвет. Там парабола поднимается выше прямой, то есть верхняя и нижняя меняются местами.',
    'Take the boundary past one: the band changes colour. There the parabola rises above the line, so the upper and the lower swap places.',
  ),
  probe: {
    question: L("Nega chegaralar aynan 0 va 1?", 'Почему границы именно 0 и 1?', 'Why are the bounds exactly 0 and 1?'),
    items: [
      { id: 'a', label: L('shu yerda chiziqlar kesishadi', 'здесь линии пересекаются', 'this is where the lines cross'), correct: true },
      { id: 'b', label: L('shartda shunday yozilgan', 'так написано в условии', 'that is what the problem says'), hint: L("Shartda chegaralar yo'q: faqat ikkita chiziq berilgan.", 'В условии границ нет: даны только две линии.', 'The problem gives no bounds: only two lines.') },
      { id: 'c', label: L('chunki 0 va 1 qulay sonlar', 'потому что 0 и 1 удобные числа', 'because 0 and 1 are convenient numbers'), hint: L("Qulaylik tasodif. Boshqa chiziqlarda ular boshqacha bo'ladi.", 'Удобство это случайность. С другими линиями они будут другими.', 'Convenience is a coincidence. With other lines they will differ.') },
      { id: 'd', label: L("chunki parabola nolda boshlanadi", 'потому что парабола начинается в нуле', 'because the parabola starts at zero'), hint: L("Parabola chapga ham davom etadi. Muhimi u yerda chiziqlar uchrashishi.", 'Парабола продолжается и влево. Важно, что там линии встречаются.', 'The parabola continues to the left too. What matters is that the lines meet there.') },
    ],
  },
  holds: [4500, 6000, 6500, 7500],
  audio: [
    A('mount', "Kim yuqorida ekani aniqlandi. Endi figurani asbobda ko'ramiz.", 'Кто сверху, выяснили. Теперь посмотрим на фигуру в приборе.', 'Which is on top is settled. Now let us look at the figure on the instrument.'),
    A('one', "Bu safar asbob ikkita egri chiziqni chizadi, va bo'yalgan joy ular ORASIDAGI polosa.", 'На этот раз прибор рисует две кривые, и закрашена полоса МЕЖДУ ними.', 'This time the instrument draws two curves, and the shaded part is the band BETWEEN them.'),
    A('two', "Chegarani torting va polosaning kengligiga qarang. O'rtada u eng keng, chekkalarda esa nolga siqiladi.", 'Потяни границу и посмотри на ширину полосы. В середине она шире всего, а у краёв сжимается в ноль.', 'Drag the boundary and watch the width of the band. In the middle it is widest, at the ends it shrinks to zero.'),
    A('tangent', "Va mana asosiy narsa. Nolda va birda chiziqlar uchrashadi, polosa yo'qoladi. Bundan chapda va o'ngda figura umuman yo'q. Shuning uchun chegaralar shartdan emas, kesishish nuqtalaridan olinadi.", 'И вот главное. В нуле и в единице линии встречаются, полоса исчезает. Левее и правее фигуры вообще нет. Поэтому границы берутся не из условия, а из точек пересечения.', 'And here is the main thing. At zero and at one the lines meet and the band disappears. To the left and right there is no figure at all. That is why the bounds come from the intersection points, not from the problem text.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1: YUQORIDAGI MINUS PASTDAGI.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'between_curves',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Yuqoridagi minus pastdagi', 'Верхняя минус нижняя', 'Upper minus lower'),
  rows: [
    'S = ∫ₐᵇ (yuqori − quyi) dx',
    'S = ∫₀¹ (x − x²) dx = 1/6',
  ],
  probe: {
    question: L(
      "Integral ostida nima turadi?",
      'Что стоит под интегралом?',
      'What stands under the integral?',
    ),
    items: [
      { id: 'a', label: L("ikki chiziqning ayirmasi", 'разность двух линий', 'the difference of the two lines'), correct: true },
      { id: 'b', label: L("ikki chiziqning yig'indisi", 'сумма двух линий', 'the sum of the two lines'), hint: L("Yig'indi bir bo'lakni ikki marta sanaydi: pastdagi figura yuqoridagining ichida.", 'Сумма считает один кусок дважды: нижняя фигура лежит внутри верхней.', 'A sum counts one piece twice: the lower figure lies inside the upper one.') },
      { id: 'c', label: L("faqat yuqoridagi chiziq", 'только верхняя линия', 'the upper line only'), hint: L("Unda pastdagi chiziq ostidagi bo'lak ham kirib ketadi, u esa figuraga tegishli emas.", 'Тогда войдёт и кусок под нижней линией, а он к фигуре не относится.', 'Then the piece under the lower line would be included, and it does not belong to the figure.') },
      { id: 'd', label: L("ularning ko'paytmasi", 'их произведение', 'their product'), hint: L("Ko'paytma bu yerda hech narsani bildirmaydi: kenglik ayirma bilan o'lchanadi.", 'Произведение здесь ничего не значит: ширина измеряется разностью.', 'A product means nothing here: the width is measured by a difference.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Ayirma', 'Правило 1. Разность', 'Rule 1. The difference'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'S = ∫ₐᵇ (f − g) dx',
    lines: [
      L("f yuqoridagi chiziq, g pastdagisi", 'f это верхняя линия, g нижняя', 'f is the upper line, g the lower'),
      L("chegaralar kesishish nuqtalaridan olinadi", 'границы берутся из точек пересечения', 'the bounds come from the intersection points'),
      L("o'q ham chiziq: u yerda g nolga teng", 'ось это тоже линия: там g равна нулю', 'the axis is a line too: there g equals zero'),
      L("javob musbat chiqishi shart: yuza manfiy bo'lmaydi", 'ответ обязан выйти положительным: площадь не бывает отрицательной', 'the answer must come out positive: an area is never negative'),
    ],
    example: L('misol:  ∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6', 'пример:  ∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6', 'example:  ∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6'),
  },
  holds: [4000, 6500, 4500],
  audio: [
    A('mount', "Asbobda ko'rdik. Endi buni bitta qatorda yozamiz.", 'На приборе увидели. Теперь запишем это одной строкой.', 'We saw it on the instrument. Now let us write it in one line.'),
    A('def', "Figuraning kengligi har bir nuqtada yuqoridagi chiziq bilan pastdagining ayirmasiga teng. Shu ayirmani chegaradan chegaragacha integrallash kerak. Bir xil ta'rif uchala holatga ham yaraydi, chunki o'q ham chiziq: unda pastdagisi nolga teng.", 'Ширина фигуры в каждой точке равна разности верхней линии и нижней. Эту разность и надо проинтегрировать от границы до границы. Одно определение годится для всех трёх случаев, потому что ось это тоже линия: у неё нижняя равна нулю.', 'The width of the figure at each point equals the difference of the upper line and the lower one. That difference is what must be integrated from bound to bound. One definition serves all three cases, because the axis is a line too: there the lower one is zero.'),
    A('rule', "To'g'ri. Va mana tekshiruv: yuza manfiy chiqmasligi kerak. Chiqsa, tartib teskari olingan.", 'Верно. И вот проверка: площадь не должна выйти отрицательной. Если вышла, порядок взят обратный.', 'Correct. And here is a check: the area must not come out negative. If it did, the order was taken backwards.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: figura butunlay o'q ostida.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'signed_area',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L("Figura o'q ostida", 'Фигура под осью', 'The figure is below the axis'),
  was: { label: UI.was, expr: 'y = x  va  y = x²   →   1/6' },
  now: { label: UI.now, expr: 'y = x − 2,   0 … 2   →   ?' },
  probe1: {
    question: L('Bu yerda kim yuqorida?', 'Кто здесь сверху?', 'Which one is on top here?'),
    items: [
      { id: 'a', label: L("o'qning o'zi", 'сама ось', 'the axis itself'), correct: true },
      { id: 'b', label: L("to'g'ri chiziq y = x − 2", 'прямая y = x − 2', 'the line y = x − 2'), hint: L("Nolni qo'ying: to'g'ri chiziq minus ikki beradi, o'q esa nol. Nol kattaroq.", 'Подставь ноль: прямая даёт минус два, а ось ноль. Ноль больше.', 'Substitute zero: the line gives minus two, the axis gives zero. Zero is larger.') },
      { id: 'c', label: L('ular teng', 'они равны', 'they are equal'), hint: L("Faqat ikkida teng, oraliqda esa to'g'ri chiziq pastda.", 'Равны только в двух, а на промежутке прямая ниже.', 'Equal only at two, but on the interval the line is below.') },
      { id: 'd', label: L("bu yerda ikkinchi chiziq yo'q", 'здесь второй линии нет', 'there is no second line here'), hint: L("Bor: o'qning o'zi ikkinchi chiziq, uning tenglamasi y teng nol.", 'Есть: сама ось это вторая линия, её уравнение игрек равно нулю.', 'There is: the axis itself is the second line, its equation is y equals zero.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('Yuza nimaga teng?', 'Чему равна площадь?', 'What does the area equal?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '2' },
      { id: 'b', label: '−2' },
      { id: 'c', label: '4' },
      { id: 'd', label: '0' },
    ],
  },
  holds: [5000, 6500, 2000, 3000],
  audio: [
    A('mount', "Birinchi holatda ikkala chiziq ham berilgan edi va figura ular orasida yotardi.", 'В первом случае обе линии были даны, и фигура лежала между ними.', 'In the first case both lines were given, and the figure lay between them.'),
    A('now', "Endi chiziq bitta, va u butun oraliqda o'q ostida. Lekin qoida o'sha: yuqoridagi minus pastdagi. Faqat bu yerda yuqoridagi bu o'qning o'zi, ya'ni nol.", 'Теперь линия одна, и она на всём отрезке под осью. Но правило то же: верхняя минус нижняя. Только здесь верхняя это сама ось, то есть ноль.', 'Now there is one line, and it is below the axis on the whole segment. But the rule is the same: upper minus lower. Only here the upper one is the axis itself, that is zero.'),
    A('q1', 'Bu yerda kim yuqorida?', 'Кто здесь сверху?', 'Which one is on top here?'),
    A('q2', 'Sizningcha yuza nimaga teng? Shunchaki taxmin qiling.', 'Как думаешь, чему равна площадь? Просто предположи.', 'What do you think the area equals? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: tartib.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'between_curves',
  eyebrow: L('Tartib yuzani hal qiladi', 'Порядок решает всё', 'The order decides everything'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: 'y = x − 2,   0 … 2',
  need: '= ?',
  answerLabel: L('yuza', 'площадь', 'the area'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: '∫₀² (x − 2) dx',
      point: {
        label: L('pastdagini yuqoridan ayirdi', 'вычел нижнюю из верхней наоборот', 'subtracted the wrong way round'),
        calc: '= −2   ✗',
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: '∫₀² (0 − (x − 2)) dx',
      point: {
        label: L("yuqoridagi bu o'q", 'верхняя это ось', 'the upper one is the axis'),
        calc: '= 2   ✓',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['2', '−2', '4', '0'],
    value: ['2'],
    label: 'S =',
    prompt: L('Yuzani yozing', 'Запиши площадь', 'Write the area'),
    wrongs: [
      { key: '−2', hint: L("Yuza manfiy bo'lmaydi. Bu integralning qiymati, va u tartib teskari olinganini bildiradi.", 'Площадь не бывает отрицательной. Это значение интеграла, и оно говорит, что порядок взят обратный.', 'An area is never negative. That is the value of the integral, and it says the order was taken backwards.') },
      { key: '4', hint: L("To'g'ri to'rtburchak emas: figura uchburchak, katetlari ikki va ikki.", 'Это не прямоугольник: фигура треугольник с катетами два и два.', 'It is not a rectangle: the figure is a triangle with legs two and two.') },
      { key: '*', hint: L("Yuqoridagi o'q, pastdagi to'g'ri chiziq: noldan iks minus ikki ayiriladi.", 'Верхняя это ось, нижняя прямая: из нуля вычитается икс минус два.', 'The upper one is the axis, the lower one is the line: x minus two is subtracted from zero.') },
    ],
  },
  holds: [3500, 6500, 6000, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala yozuvni ham sanaymiz.', 'Прогноз есть. Теперь посчитаем обе записи.', 'The guess is made. Now let us compute both records.'),
    A('p1', "Birinchi nomzod chiziqni to'g'ridan to'g'ri integralladi va minus ikki oldi. Son o'zi to'g'ri: bu integralning qiymati. Lekin so'ralgani yuza, va yuza manfiy bo'lmaydi.", 'Первый кандидат проинтегрировал линию напрямую и получил минус два. Само число верно: это значение интеграла. Но спрашивали площадь, а площадь не бывает отрицательной.', 'The first candidate integrated the line directly and got minus two. The number itself is right: that is the value of the integral. But the area was asked, and an area is never negative.'),
    A('p2', "Ikkinchi nomzod qoidani qo'lladi: yuqoridagi minus pastdagi. Yuqoridagi bu o'q, ya'ni nol, pastdagi esa to'g'ri chiziq. Ikki chiqdi.", 'Второй кандидат применил правило: верхняя минус нижняя. Верхняя это ось, то есть ноль, а нижняя прямая. Вышло два.', 'The second candidate applied the rule: upper minus lower. The upper one is the axis, that is zero, and the lower one is the line. Two came out.'),
    A('write', "Demak qoida o'zgarmadi, faqat yuqoridagi chiziq o'qning o'ziga aylandi. Yuzani yozing.", 'Значит правило не изменилось, просто верхней линией оказалась сама ось. Запиши площадь.', 'So the rule did not change, the upper line simply turned out to be the axis itself. Write the area.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: ALGORITM.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'between_curves',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Besh qadam', 'Пять шагов', 'Five steps'),
  cases: [
    {
      label: L('chegaralar', 'границы', 'the bounds'),
      text: L('kesishish nuqtalaridan', 'из точек пересечения', 'from the intersection points'),
      tone: 'graph',
    },
    {
      label: L('integral ostida', 'под интегралом', 'under the integral'),
      text: L('yuqoridagi minus pastdagi', 'верхняя минус нижняя', 'upper minus lower'),
      tone: 'accent',
    },
  ],
  rows: ['f = g   →   a,  b', 'S = ∫ₐᵇ (f − g) dx   >   0'],
  probe: {
    question: L("Yuza manfiy chiqdi. Bu nimani bildiradi?", 'Площадь вышла отрицательной. Что это значит?', 'The area came out negative. What does that mean?'),
    items: [
      { id: 'a', label: L('tartib teskari olingan', 'порядок взят обратный', 'the order was taken backwards'), correct: true },
      { id: 'b', label: L("figura o'q ostida", 'фигура под осью', 'the figure is below the axis'), hint: L("O'q ostida bo'lsa ham yuza musbat: u yerda yuqoridagi o'qning o'zi bo'ladi.", 'Даже если под осью, площадь положительна: там верхней становится сама ось.', 'Even below the axis the area is positive: there the axis itself becomes the upper line.') },
      { id: 'c', label: L('bunday bo\'lishi mumkin emas', 'такого не бывает', 'that cannot happen'), hint: L("Bo'ladi: tartibni almashtirsangiz darrov chiqadi. Lekin bu javob emas, bu signal.", 'Бывает: получится сразу, если поменять порядок. Но это не ответ, это сигнал.', 'It can: swap the order and it appears at once. But that is not an answer, it is a signal.') },
      { id: 'd', label: L('chegaralar noto\'g\'ri', 'границы неверны', 'the bounds are wrong'), hint: L("Chegaralar ham xato bo'lishi mumkin, lekin manfiy ishora birinchi navbatda tartibni ko'rsatadi.", 'Границы тоже могут быть неверны, но отрицательный знак в первую очередь указывает на порядок.', 'The bounds may be wrong too, but a negative sign points first of all at the order.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Algoritm', 'Правило 2. Алгоритм', 'Rule 2. The algorithm'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'S = ∫ₐᵇ (f − g) dx',
    lines: [
      L('1. kesishish nuqtalarini top: bu chegaralar', '1. найди точки пересечения: это границы', '1. find the intersection points: these are the bounds'),
      L('2. oraliqdan son qo\'yib, kim yuqorida ekanini aniqla', '2. подставь число из промежутка и выясни, кто выше', '2. substitute a number from the interval and see which is higher'),
      L('3. ayirmani yoz va integralla', '3. запиши разность и проинтегрируй', '3. write the difference and integrate'),
      L('4. javob musbatligini tekshir', '4. проверь, что ответ положителен', '4. check that the answer is positive'),
    ],
    example: L('misol:  ∫₀² (0 − (x − 2)) dx = 2', 'пример:  ∫₀² (0 − (x − 2)) dx = 2', 'example:  ∫₀² (0 − (x − 2)) dx = 2'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'S = ∫ₐᵇ (f − g) dx',
    lines: [
      L("1. uchala holat ham bitta yozuv: yuqoridagi minus pastdagi", '1. все три случая это одна запись: верхняя минус нижняя', '1. all three cases are one record: upper minus lower'),
      L("2. o'q ham chiziq, uning tenglamasi nol", '2. ось это тоже линия, её уравнение ноль', '2. the axis is a line too, its equation is zero'),
      L('3. chegaralar shartdan emas, kesishishdan', '3. границы не из условия, а из пересечения', '3. the bounds come from the crossing, not from the text'),
      L('4. manfiy javob bu tartib xatosi signali', '4. отрицательный ответ это сигнал об ошибке в порядке', '4. a negative answer signals an error in the order'),
    ],
  },
  holds: [4000, 6500, 4500, 5000],
  audio: [
    A('mount', "Ikki holat ko'rildi. Endi butun tartibni yozamiz.", 'Два случая разобраны. Теперь запишем весь порядок действий.', 'Two cases are done. Now let us write the whole order of actions.'),
    A('rows', "Avval kesishish nuqtalari topiladi: ikkala tenglama tenglashtiriladi. Keyin oraliqdan son qo'yiladi va kim yuqorida ekani aniqlanadi. Undan keyin ayirma integrallanadi. Va oxirida javob musbatligi tekshiriladi.", 'Сначала находят точки пересечения: приравнивают два уравнения. Потом подставляют число из промежутка и выясняют, кто выше. Затем интегрируют разность. И в конце проверяют, что ответ положителен.', 'First the intersection points are found: the two equations are set equal. Then a number from the interval is substituted to see which is higher. Then the difference is integrated. And at the end the answer is checked to be positive.'),
    A('q', "Savol: yuza manfiy chiqsa, bu nimani bildiradi?", 'Вопрос: что значит, если площадь вышла отрицательной?', 'The question: what does it mean if the area came out negative?'),
    A('rule', "To'g'ri. Manfiy javob bu xato emas, balki signal: tartib almashgan. Uni tuzatish bir soniya.", 'Верно. Отрицательный ответ это не ошибка, а сигнал: порядок перепутан. Исправить его секунда.', 'Correct. A negative answer is not a mistake but a signal: the order is swapped. Fixing it takes a second.'),
    A('both', 'Endi butun usulni bitta qoidaga yig\'ing.', 'А теперь собери весь способ в одно правило.', 'Now combine the whole method into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. KIM YUQORIDA: o'zi qo'yadi.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'between_curves',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Kim yuqorida', 'Кто сверху', 'Which is on top'),
  left: 'y = 2x  va  y = x²,   0 … 2',
  template: ['S = ∫₀² (', { slot: 0 }, ') dx'],
  signs: ['2x − x²', 'x² − 2x'],
  answer: '2x − x²',
  checkNote: L(
    "x = 1 da:  2 > 1,  demak 2x yuqorida",
    'при x = 1: 2 > 1, значит 2x сверху',
    'at x = 1: 2 > 1, so 2x is on top',
  ),
  wrongs: [
    { key: 'x² − 2x', hint: L("Birni qo'ying: ikki iks bir nuqtada ikki beradi, parabola esa bir. Demak ikki iks yuqorida, va u birinchi turishi kerak.", 'Подставь единицу: два икс даёт два, а парабола один. Значит два икс сверху, и она должна стоять первой.', 'Substitute one: two x gives two, the parabola gives one. So two x is on top and must come first.') },
  ],
  probe: {
    question: L("Kim yuqorida ekanini qanday bilasiz?", 'Как узнать, кто сверху?', 'How do you find out which is on top?'),
    items: [
      { id: 'a', label: L("chegaralar orasidan son qo'yib ko'rish", 'подставить число между границами', 'substitute a number between the bounds'), correct: true },
      { id: 'b', label: L("chegaralarning o'zini qo'yish", 'подставить сами границы', 'substitute the bounds themselves'), hint: L("Chegaralarda ikkala chiziq teng: aynan shuning uchun ular kesishish nuqtasi.", 'На границах обе линии равны: именно потому это точки пересечения.', 'At the bounds both lines are equal: that is precisely why they are intersection points.') },
      { id: 'c', label: L("darajasi kattarog'i yuqorida", 'у кого степень больше, тот сверху', 'the higher power is on top'), hint: L("Bu qoida emas: noldan birgacha parabola pastda, birdan keyin esa tepada.", 'Это не правило: от нуля до единицы парабола внизу, а после единицы наверху.', 'That is no rule: from zero to one the parabola is below, after one it is above.') },
      { id: 'd', label: L('tartib muhim emas', 'порядок не важен', 'the order does not matter'), hint: L("Muhim: javob ishorasi almashadi va yuza manfiy chiqadi.", 'Важен: меняется знак и площадь выходит отрицательной.', 'It matters: the sign flips and the area comes out negative.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Ayirmani to'g'ri tartibda tanlang.", 'Выбери разность в верном порядке.', 'Choose the difference in the right order.'),
    A('checked', "Bo'ldi. Endi ta'riflang: kim yuqorida ekanini qanday bilasiz?", 'Получилось. Теперь сформулируй: как узнать, кто сверху?', 'Done. Now put it into words: how do you find out which is on top?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'roots', label: L('kesishishni topish', 'найти пересечения', 'find the crossings') },
  { id: 'who', label: L('kim yuqorida', 'кто сверху', 'which is on top') },
  { id: 'calc', label: L('integrallash', 'проинтегрировать', 'integrate') },
  { id: 'plusC', label: L('+ C qo\'shish', 'добавить + C', 'add + C') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'between_curves',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('y = 4 − x²  va  o\'q', 'y = 4 − x² и ось', 'y = 4 − x² and the axis'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'roots',
      to: '4 − x² = 0   →   x = −2,  x = 2',
      wrongs: [
        { action: 'who', hint: L("Avval chegaralarni toping: qayerdan qayergacha ekanini bilmasdan solishtirib bo'lmaydi.", 'Сначала найди границы: не зная, откуда докуда, сравнивать нечего.', 'Find the bounds first: without knowing from where to where there is nothing to compare.') },
        { action: 'calc', hint: L("Integrallashga chegaralar kerak.", 'Для интегрирования нужны границы.', 'Integrating needs bounds.') },
        { action: 'plusC', hint: L("Aniq integralda o'zgarmas kerak emas.", 'В определённом интеграле постоянная не нужна.', 'In a definite integral the constant is not needed.') },
      ],
    },
    {
      action: 'who',
      to: 'x = 0:   4 > 0   →   yuqorida parabola',
      wrongs: [
        { action: 'roots', hint: L("Chegaralar topilgan: minus ikki va ikki.", 'Границы найдены: минус два и два.', 'The bounds are found: minus two and two.') },
        { action: 'calc', hint: L("Avval kim yuqorida ekanini aniqlang, aks holda ishora xato bo'ladi.", 'Сначала выясни, кто сверху, иначе знак выйдет неверным.', 'Find out which is on top first, or the sign will be wrong.') },
        { action: 'plusC', hint: L("O'zgarmas kerak emas.", 'Постоянная не нужна.', 'The constant is not needed.') },
      ],
    },
    {
      action: 'calc',
      to: 'S = 16/3 + 16/3 = 32/3',
      wrongs: [
        { action: 'roots', hint: L("Topilgan.", 'Найдены.', 'Found.') },
        { action: 'who', hint: L("Aniqlangan: parabola yuqorida.", 'Выяснено: парабола сверху.', 'Settled: the parabola is on top.') },
        { action: 'plusC', hint: L("Qisqaradi.", 'Сокращается.', 'It cancels.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['32/3', '16/3', '8', '32'],
    value: ['32/3'],
    label: 'S =',
    prompt: L('Yuzani yozing', 'Запиши площадь', 'Write the area'),
    wrongs: [
      { key: '16/3', hint: L("Bu faqat yarmi: figura minus ikkidan ikkigacha cho'zilgan, noldan emas.", 'Это только половина: фигура тянется от минус двух до двух, а не от нуля.', 'That is only half: the figure runs from minus two to two, not from zero.') },
      { key: '32', hint: L("Uchga bo'lish unutildi: F teng to'rt iks minus iks kubi bo'lingan uch.", 'Забыли поделить на три: F равна четыре икс минус икс в кубе делить на три.', 'The division by three was forgotten: F equals four x minus x cubed over three.') },
      { key: '*', hint: L("F teng to'rt iks minus iks kubi bo'lingan uch. Ikkida o'n olti uchdan, minus ikkida minus o'n olti uchdan.", 'F равна четыре икс минус икс в кубе делить на три. В двух шестнадцать третьих, в минус двух минус шестнадцать третьих.', 'F equals four x minus x cubed over three. At two it is sixteen thirds, at minus two minus sixteen thirds.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi parabolani o\'qgacha sanaymiz.', 'Правило сформулировано. Посчитаем параболу до оси.', 'The rule is stated. Let us count the parabola down to the axis.'),
    A('start', "Diqqat: ro'yxatda ortiqcha amal bor. Nimadan boshlashni tanlang.", 'Внимание: в списке есть лишнее действие. Выбери, с чего начать.', 'Careful: the list has one superfluous action. Choose where to start.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL, IMTIHON FORMATIDA.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'between_curves',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Rasmga qarab hisoblang', 'Посчитай по рисунку', 'Count it from the picture'),
  start: L('bo\'yalgan figuraning yuzasi', 'площадь закрашенной фигуры', 'the area of the shaded figure'),
  fig: () => (
    <AreaBoard
      fn={(x) => 2 * x}
      fn2={(x) => x * x}
      xDomain={[-0.2, 2.6]}
      yDomain={[-0.4, 4.6]}
      xTicks={[{ v: 1 }, { v: 2 }]}
      yTicks={[{ v: 0 }]}
      a={0}
      b={2}
      fLabel="y = 2x"
      sLabel="y = x²"
      height={116}
    />
  ),
  actions: ACTIONS_10,
  hint: L(
    "Kesishishlar chizmada ko'rinib turibdi.",
    'Пересечения видны на чертеже.',
    'The crossings are visible in the drawing.',
  ),
  steps: [
    {
      action: 'roots',
      to: '2x = x²   →   x = 0,  x = 2',
      wrongs: [
        { action: 'who', hint: L("Avval chegaralar.", 'Сначала границы.', 'The bounds first.') },
        { action: 'calc', hint: L("Chegaralarsiz integrallab bo'lmaydi.", 'Без границ интегрировать нельзя.', 'You cannot integrate without bounds.') },
        { action: 'plusC', hint: L("Kerak emas.", 'Не нужна.', 'Not needed.') },
      ],
    },
    {
      action: 'who',
      to: 'x = 1:   2 > 1',
      wrongs: [
        { action: 'roots', hint: L("Topilgan: nol va ikki.", 'Найдены: ноль и два.', 'Found: zero and two.') },
        { action: 'calc', hint: L("Avval kim yuqorida.", 'Сначала кто сверху.', 'Which is on top first.') },
        { action: 'plusC', hint: L("Kerak emas.", 'Не нужна.', 'Not needed.') },
      ],
    },
    {
      action: 'calc',
      to: 'S = 4 − 8/3 = 4/3',
      wrongs: [
        { action: 'roots', hint: L("Topilgan.", 'Найдены.', 'Found.') },
        { action: 'who', hint: L("Aniqlangan.", 'Выяснено.', 'Settled.') },
        { action: 'plusC', hint: L("Qisqaradi.", 'Сокращается.', 'It cancels.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['4/3', '8/3', '4', '−4/3'],
    value: ['4/3'],
    label: 'S =',
    prompt: L('Yuzani yozing', 'Запиши площадь', 'Write the area'),
    wrongs: [
      { key: '−4/3', hint: L("Tartib teskari: chizmada ko'rinib turibdi, ikki iks yuqorida.", 'Порядок обратный: на чертеже видно, что два икс сверху.', 'The order is reversed: the drawing shows that two x is on top.') },
      { key: '4', hint: L("Bu faqat birinchi integral. Undan parabolanikini ayirish kerak.", 'Это только первый интеграл. Из него надо вычесть параболу.', 'That is only the first integral. The parabola must be subtracted from it.') },
      { key: '*', hint: L("To'rtdan sakkiz uchdan ayiriladi.", 'Из четырёх вычитается восемь третьих.', 'Eight thirds is subtracted from four.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek: shartda formula yo'q, faqat chizma.", 'Теперь полностью сам, как на экзамене: в условии нет формулы, только чертёж.', 'Now completely on your own, as on the exam: the problem has no formula, only a drawing.'),
    A('go', "Ikkita chiziq va bo'yalgan figura. Chegaralarni chizmadan o'qing.", 'Две линии и закрашенная фигура. Границы прочитай с чертежа.', 'Two lines and a shaded figure. Read the bounds from the drawing.'),
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
      id: 'b1', tag: 'between_curves', ask: true, cols: 2,
      done: L('yuqoridagi minus pastdagi', 'верхняя минус нижняя', 'upper minus lower'),
      prompt: L("Ikki chiziq orasidagi yuzada integral ostida nima turadi?", 'Что стоит под интегралом для площади между двумя линиями?', 'What stands under the integral for the area between two lines?'),
      items: [
        { id: 'a', label: L('yuqoridagi minus pastdagi', 'верхняя минус нижняя', 'upper minus lower'), correct: true },
        { id: 'b', label: L("ikkalasining yig'indisi", 'сумма обеих', 'the sum of both'), hint: L("Yig'indi bir bo'lakni ikki marta sanaydi.", 'Сумма считает один кусок дважды.', 'A sum counts one piece twice.') },
        { id: 'c', label: L('faqat yuqoridagi', 'только верхняя', 'the upper one only'), hint: L("Unda pastdagi chiziq ostidagi ortiqcha bo'lak ham kiradi.", 'Тогда войдёт лишний кусок под нижней линией.', 'Then an extra piece under the lower line comes in.') },
        { id: 'd', label: L("pastdagi minus yuqoridagi", 'нижняя минус верхняя', 'lower minus upper'), hint: L("Bunda javob manfiy chiqadi, yuza esa manfiy bo'lmaydi.", 'Тогда ответ выйдет отрицательным, а площадь не бывает отрицательной.', 'Then the answer comes out negative, and an area is never negative.') },
      ],
    },
    {
      id: 'b2', tag: 'between_curves', ask: true, cols: 2,
      done: L('kesishish nuqtalaridan', 'из точек пересечения', 'from the intersection points'),
      prompt: L('Chegaralar qayerdan olinadi?', 'Откуда берутся границы?', 'Where do the bounds come from?'),
      items: [
        { id: 'a', label: L('kesishish nuqtalaridan', 'из точек пересечения', 'from the intersection points'), correct: true },
        { id: 'b', label: L('shartdan', 'из условия', 'from the problem text'), hint: L("Ko'p masalada shartda chegara umuman yo'q: faqat chiziqlar berilgan.", 'Во многих задачах в условии границ вообще нет: даны только линии.', 'In many problems the text gives no bounds at all: only the lines.') },
        { id: 'c', label: L("o'q bilan kesishishdan", 'из пересечения с осью', 'from the crossing with the axis'), hint: L("Bu faqat bitta holat: figura o'qgacha bo'lganda.", 'Это только один случай: когда фигура упирается в ось.', 'That is only one case: when the figure runs down to the axis.') },
        { id: 'd', label: L('ixtiyoriy tanlanadi', 'выбираются произвольно', 'chosen arbitrarily'), hint: L("Unda yuza ham ixtiyoriy chiqardi.", 'Тогда и площадь вышла бы произвольной.', 'Then the area would come out arbitrary too.') },
      ],
    },
    {
      id: 'b3', tag: 'signed_area', ask: true, cols: 2,
      done: L('yuza plyus bilan', 'площадь с плюсом', 'the area with a plus'),
      prompt: L(
        "Figura butunlay o'q ostida. Yuzasi qanday ishora bilan?",
        'Фигура целиком под осью. С каким знаком её площадь?',
        'The figure is entirely below the axis. With what sign is its area?',
      ),
      items: [
        { id: 'a', label: L('plyus bilan', 'с плюсом', 'with a plus'), correct: true },
        { id: 'b', label: L('minus bilan', 'с минусом', 'with a minus'), hint: L("Minus bu integralning qiymati. Yuza esa har doim musbat.", 'Минус это значение интеграла. А площадь всегда положительна.', 'The minus is the value of the integral. The area is always positive.') },
        { id: 'c', label: L('nol', 'ноль', 'zero'), hint: L("Figura bor, demak yuzasi ham bor.", 'Фигура есть, значит и площадь есть.', 'The figure exists, so its area exists too.') },
        { id: 'd', label: L("figuraga qarab", 'смотря по фигуре', 'it depends on the figure'), hint: L("Qaramaydi: yuza tushunchasi bo'yicha musbat.", 'Не смотря: площадь по самому смыслу положительна.', 'It does not depend: by its very meaning an area is positive.') },
      ],
    },
    {
      id: 'b4', tag: 'between_curves', ask: true, cols: 2,
      done: L('tartib teskari', 'порядок обратный', 'the order is reversed'),
      prompt: L('Yuza manfiy chiqdi. Nima qilish kerak?', 'Площадь вышла отрицательной. Что делать?', 'The area came out negative. What should be done?'),
      items: [
        { id: 'a', label: L("tartibni almashtirish", 'поменять порядок вычитания', 'swap the order of subtraction'), correct: true },
        { id: 'b', label: L('shunday qoldirish', 'так и оставить', 'leave it as it is'), hint: L("Yuza manfiy bo'lmaydi: bu javob emas.", 'Площадь не бывает отрицательной: это не ответ.', 'An area is never negative: that is not an answer.') },
        { id: 'c', label: L('nolga almashtirish', 'заменить нулём', 'replace it with zero'), hint: L("Figura bor, yuzasi noldan katta.", 'Фигура есть, её площадь больше нуля.', 'The figure exists, its area is greater than zero.') },
        { id: 'd', label: L("chegaralarni almashtirish", 'поменять границы местами', 'swap the bounds'), hint: L("Bu ham ishorani almashtiradi, lekin chegaralar kesishishdan olingan va ular to'g'ri.", 'Это тоже меняет знак, но границы взяты из пересечения и они верны.', 'That also flips the sign, but the bounds came from the crossing and they are right.') },
      ],
    },
    {
      id: 'b5', tag: 'bounds_order', ask: true, cols: 4,
      done: '∫₀¹ (x − x²) dx = 1/6',
      prompt: L('∫₀¹ (x − x²) dx = ?', 'Чему равен ∫₀¹ (x − x²) dx ?', 'What is ∫₀¹ (x − x²) dx ?'),
      items: [
        { id: 'a', label: '1/6', correct: true },
        { id: 'b', label: '5/6', hint: L("Bu qo'shilgani. Ayirish kerak.", 'Это если сложить. Надо вычесть.', 'That is if you add. You must subtract.') },
        { id: 'c', label: '1/2', hint: L("Bu faqat birinchi integral.", 'Это только первый интеграл.', 'That is only the first integral.') },
        { id: 'd', label: '1/3', hint: L("Bu faqat ikkinchi integral.", 'Это только второй интеграл.', 'That is only the second integral.') },
      ],
    },
    {
      id: 'b6', tag: 'check_by_point', ask: true, cols: 2,
      done: L('son qo\'yib ko\'rish', 'подставить число', 'substitute a number'),
      prompt: L('Kim yuqorida ekanini qanday tekshirasiz?', 'Как проверить, кто сверху?', 'How do you check which is on top?'),
      items: [
        { id: 'a', label: L("chegaralar orasidan son qo'yib", 'подставить число между границами', 'substitute a number between the bounds'), correct: true },
        { id: 'b', label: L("chegaralarni qo'yib", 'подставить сами границы', 'substitute the bounds'), hint: L("Chegaralarda ikkalasi teng, farq ko'rinmaydi.", 'На границах обе равны, разницы не видно.', 'At the bounds both are equal, no difference shows.') },
        { id: 'c', label: L("formulalarga qarab", 'по виду формул', 'by the look of the formulas'), hint: L("Ko'rinish aldaydi: parabola bir joyda pastda, boshqa joyda tepada.", 'Вид обманывает: парабола где-то внизу, где-то наверху.', 'The look deceives: the parabola is below in one place and above in another.') },
        { id: 'd', label: L('hech qanday', 'никак', 'there is no way'), hint: L("Bor: bitta son yetadi.", 'Есть: хватает одного числа.', 'There is: one number is enough.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Chegaralar haqida.", 'Про границы.', 'About the bounds.'),
    A('q3', "Ishora haqida.", 'Про знак.', 'About the sign.'),
    A('q4', "Signal haqida.", 'Про сигнал.', 'About the signal.'),
    A('q5', "Endi sanash.", 'Теперь счёт.', 'Now the counting.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: qo'shildi.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'between_curves',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Uch satr to'g'ri, to'rtinchisi yo'q", 'Три строки верны, четвёртая нет', 'Three lines right, the fourth is not'),
  rows: [
    { id: 'r1', text: L('y = x va y = x², kesishish 0 va 1', 'y = x и y = x², пересечения 0 и 1', 'y = x and y = x², crossings 0 and 1') },
    { id: 'r2', text: '∫₀¹ x dx = 1/2' },
    { id: 'r3', text: '∫₀¹ x² dx = 1/3' },
    { id: 'r4', text: L('yuza = 1/2 + 1/3 = 5/6', 'площадь = 1/2 + 1/3 = 5/6', 'area = 1/2 + 1/3 = 5/6') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Kesishish nuqtalari to'g'ri topilgan.", 'Точки пересечения найдены верно.', 'The intersection points are found correctly.'),
    r2: L("Bu integral to'g'ri sanalgan.", 'Этот интеграл посчитан верно.', 'This integral is computed correctly.'),
    r3: L("Bu ham to'g'ri: parabola ostidagi yuza bir uchdan.", 'И этот верен: площадь под параболой одна треть.', 'This one is right too: the area under the parabola is a third.'),
  },
  proofPoint: '1/2 > 1/6',
  proof: L(
    "Uchala satr ham to'g'ri, xato oxirgisida: yuzalar qo'shilgan. Parabola ostidagi bo'lak to'g'ri chiziq ostidagining ICHIDA yotibdi, ya'ni qo'shganda u ikki marta sanaladi. Ayirish kerak edi: bir yarim minus bir uchdan, bir oltidan.",
    'Все три строки верны, ошибка в последней: площади сложены. Кусок под параболой лежит ВНУТРИ куска под прямой, то есть при сложении он считается дважды. Надо было вычесть: одна вторая минус одна треть, одна шестая.',
    'All three lines are right, the error is in the last: the areas were added. The piece under the parabola lies INSIDE the piece under the line, so adding counts it twice. It had to be subtracted: one half minus one third, one sixth.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("yuzalar ayirilishi kerak edi", 'площади надо было вычесть', 'the areas had to be subtracted'), correct: true },
      { id: 'b', label: L('chegaralar xato', 'границы неверны', 'the bounds are wrong'), hint: L("Chegaralar to'g'ri: iks teng iks kvadrat nol va bir beradi.", 'Границы верны: икс равно икс в квадрате даёт ноль и один.', 'The bounds are right: x equals x squared gives zero and one.') },
      { id: 'c', label: L("integrallar noto'g'ri sanalgan", 'интегралы посчитаны неверно', 'the integrals are computed wrongly'), hint: L("Ikkalasi ham to'g'ri: yarim va bir uchdan.", 'Оба верны: половина и одна треть.', 'Both are right: a half and a third.') },
      { id: 'd', label: L("+ C yozilmagan", 'не написано + C', '+ C was not written'), hint: L("Aniq integralda u kerak emas.", 'В определённом интеграле она не нужна.', 'In a definite integral it is not needed.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda uchta satr to'g'ri sanalgan, va shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь три строки посчитаны верно, и всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Here three lines are computed correctly, and still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Qarang: parabola ostidagi bo'lak to'g'ri chiziq ostidagining ichida yotibdi. Qo'shganda u ikki marta sanaladi. Shuning uchun ayirish kerak edi.", 'Смотри: кусок под параболой лежит внутри куска под прямой. При сложении он считается дважды. Поэтому надо было вычесть.', 'Look: the piece under the parabola lies inside the piece under the line. Adding counts it twice. That is why it had to be subtracted.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'between_curves',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L("yuqoridagi birinchi turadi", 'верхняя стоит первой', 'the upper one comes first'),
  tasks: [
    {
      prompt: L('y = x va y = x²', 'y = x и y = x²', 'y = x and y = x²'),
      template: ['S = ∫₀¹ (', { slot: 0 }, ' − ', { slot: 1 }, ') dx'],
      parts: ['x', 'x²', '1', '0'],
      answer: ['x', 'x²'],
      doneLabel: '∫₀¹ (x − x²) dx = 1/6',
      wrongs: [
        { key: 'x²|x', hint: L("Nol butun beshda to'g'ri chiziq balandroq: u birinchi turishi kerak.", 'В ноль целых пять прямая выше: она должна стоять первой.', 'At zero point five the line is higher: it must come first.') },
        { key: '*', hint: L("Ikkala chiziq ham shartda berilgan: o'q bu yerda ishtirok etmaydi.", 'Обе линии даны в условии: ось здесь не участвует.', 'Both lines are given in the problem: the axis takes no part here.') },
      ],
    },
    {
      prompt: L('y = x − 2  va  o\'q,  0 … 2', 'y = x − 2 и ось, 0 … 2', 'y = x − 2 and the axis, 0 … 2'),
      template: ['S = ∫₀² (', { slot: 0 }, ' − ', { slot: 1 }, ') dx'],
      parts: ['0', 'x − 2', 'x', '2'],
      answer: ['0', 'x − 2'],
      doneLabel: '∫₀² (0 − (x − 2)) dx = 2',
      wrongs: [
        { key: 'x − 2|0', hint: L("Figura o'q ostida: yuqoridagi bu o'qning o'zi, ya'ni nol.", 'Фигура под осью: верхняя это сама ось, то есть ноль.', 'The figure is below the axis: the upper one is the axis itself, that is zero.') },
        { key: '*', hint: L("O'q ham chiziq. Uning tenglamasi nol.", 'Ось это тоже линия. Её уравнение ноль.', 'The axis is a line too. Its equation is zero.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi: bu yerda ikkinchi chiziq o'qning o'zi.", 'А теперь второе: здесь вторая линия это сама ось.', 'And now the second one: here the second line is the axis itself.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'between_curves',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'S = ∫ₐᵇ (f − g) dx',
  ruleLines: [
    L("uchala holat ham bitta yozuv: yuqoridagi minus pastdagi", 'все три случая это одна запись: верхняя минус нижняя', 'all three cases are one record: upper minus lower'),
    L('chegaralar kesishish nuqtalaridan', 'границы из точек пересечения', 'the bounds come from the intersection points'),
    L("manfiy javob bu tartib xatosi signali", 'отрицательный ответ это сигнал об ошибке в порядке', 'a negative answer signals an error in the order'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('y = x va y = x² orasida', 'между y = x и y = x²', 'between y = x and y = x²'),
      right: '1/6',
      map: {
        a: '5/6',
        b: '1/6',
        both: '—',
        none: '—',
      },
    },
    {
      screen: 5,
      expr: 'y = x − 2,   0 … 2',
      right: '2',
      map: { a: '2', b: '−2', c: '4', d: '0' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Ikki egri chiziqli asbobga qayting', 'Вернись к прибору с двумя кривыми', 'Go back to the two-curve instrument'),
  },
  probe: {
    question: L(
      "Uchta holatning o'rniga nechta qoida eslab qolish kerak?",
      'Сколько правил надо помнить вместо трёх случаев?',
      'How many rules must be remembered instead of three cases?',
    ),
    items: [
      { id: 'a', label: L('bitta: yuqoridagi minus pastdagi', 'одно: верхняя минус нижняя', 'one: upper minus lower'), correct: true },
      { id: 'b', label: L('uchta, har holatga bittadan', 'три, по одному на случай', 'three, one for each case'), hint: L("Uchtasi ham bitta yozuvga tushadi: o'q ham chiziq.", 'Все три сводятся к одной записи: ось это тоже линия.', 'All three reduce to one record: the axis is a line too.') },
      { id: 'c', label: L('ikkita: o\'q bilan va o\'qsiz', 'два: с осью и без оси', 'two: with the axis and without'), hint: L("O'q alohida holat emas: uning tenglamasi shunchaki nol.", 'Ось это не отдельный случай: её уравнение просто ноль.', 'The axis is not a separate case: its equation is simply zero.') },
      { id: 'd', label: L("har masalaga o'zining", 'для каждой задачи своё', 'a different one for each problem'), hint: L("Yo'q: bitta yozuv hammasini qoplaydi.", 'Нет: одна запись покрывает всё.', 'No: one record covers everything.') },
    ],
  },
  sheetTitle: L('Figuraning yuzasi · shpargalka', 'Площадь фигуры · шпаргалка', 'The area of a figure · cheat sheet'),
  sheetSrc: L('11-sinf · 6-dars', '11 класс · урок 6', 'Grade 11 · lesson 6'),
  lifehack: L(
    "Javob manfiy chiqdimi, hech narsani qayta sanamang: shunchaki ayirmaning tartibini almashtiring.",
    'Вышел отрицательный ответ — ничего не пересчитывай: просто поменяй порядок в разности.',
    'Got a negative answer? Do not recount anything: just swap the order in the difference.',
  ),
  holds: [2500, 8000, 7000, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Birinchi savolda ikkala integral ham to'g'ri sanalgan edi, xato esa faqat amalda: qo'shish o'rniga ayirish kerak edi.", 'Вот твои прогнозы и вот как оказалось. В первом вопросе оба интеграла были посчитаны верно, а ошибка была только в действии: вместо сложения нужно вычитание.', 'Here are your guesses and here is how it turned out. In the first question both integrals were computed correctly, and the error was only in the operation: subtraction instead of addition.'),
    A('rule', "Va mana asosiy fikr. Uchta holatni yodlash shart emas. Figura o'q ustidami, ostidami, ikki chiziq orasidami, yozuv bitta: yuqoridagi minus pastdagi. O'q ham chiziq, uning tenglamasi nol.", 'И вот главная мысль. Три случая заучивать не нужно. Над осью фигура, под осью или между двумя линиями, запись одна: верхняя минус нижняя. Ось это тоже линия, её уравнение ноль.', 'And here is the main point. There is no need to memorise three cases. Above the axis, below it, or between two lines, the record is one: upper minus lower. The axis is a line too, its equation is zero.'),
    A('q', "Oxirgi savol: nechta qoida eslab qolish kerak?", 'Последний вопрос: сколько правил надо помнить?', 'The last question: how many rules must be remembered?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
