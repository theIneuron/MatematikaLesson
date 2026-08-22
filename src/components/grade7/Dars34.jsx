// ============================================================================
// 7-sinf, Dars 34. FUNKSIYA TUSHUNCHASI.
// (Понятие функции)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// TA'RIF DARSLIKDAN (115-bet): har bir x ga ANIQ BITTA y mos keladi.
// Blokning xatosi ham shundan: bitta x ga ikki qiymat bo'lsa ham «funksiya»
// deb ataladi.
//
// XATO IKKI YO'L BILAN YOPILADI, va ikkovi ham darsda bor:
//   -- ZONALAR: mos kelishlar ta'rif bo'yicha ikki zonaga tarqatiladi;
//   -- TEKISLIK: bitta abssissa ustida IKKI nuqta turgani KO'RINADI. Bu
//      eng kuchli joyi: buni aytish kerak emas, ko'rsatish kifoya.
//
// TESKARI HOLAT HAM KO'RSATILADI (7-ekran): boshqa x larga BIR XIL y mos
// kelsa, bu funksiya bo'lishdan to'xtamaydi. Ta'rif faqat bir tomonni
// cheklaydi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_34'
const LESSON_TITLE = L('Funksiya tushunchasi', 'Понятие функции', 'The idea of a function')
const LESSON_NO = L('34-dars', 'Урок 34', 'Lesson 34')
const BLOCK = { label: L('B6-blok', 'Блок Б6', 'Block B6'), from: 33, to: 39, current: 34 }

const BOX = { x0: -6, x1: 6, y0: -4, y1: 4 }

const TAGS = {
  Z1: L('bitta x ga ikki y', 'одному x два y', 'two y for one x'),
  Z2: L('qiymat topilmadi', 'значение не найдено', 'the value was not found'),
  Z3: L('argument va qiymat almashtirildi', 'аргумент и значение перепутаны', 'the argument and the value were swapped'),
  Z4: L('jadval to\'liq o\'qilmadi', 'таблица прочитана не полностью', 'the table was not read fully'),
  Z5: L('ta\'rif buzildi', 'определение нарушено', 'the definition was broken'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Ta'rifni ikki xil aytdilar: bitta y yoki ikkita.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('FUNKSIYA', 'ФУНКЦИЯ', 'THE FUNCTION'),
  noBack: true,
  noNotes: true,
  title: L('Bitta x ga nechta y', 'Сколько y на один x', 'How many y for one x'),
  gate: {
    source: { kind: 'plain', tokens: ['x', '→', 'y'] },
    rows: [
      { tokens: ['1', 'y'], value: '1' },
      { tokens: ['2', 'y'], value: '2' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Ikkovi funksiya nima ekanini aytdi. Bittasi: har bir x ga aniq bitta y mos keladi. Ikkinchisi: ikkita ham bo'lishi mumkin. Tabloda ular ruxsat bergan qiymatlar soni turadi. Kim haq?",
      'Двое сказали, что такое функция. Один: каждому x отвечает ровно одно y. Другой: может и два. На табло число значений, которые они допускают. Кто прав?',
      'Two students said what a function is. One: each x has exactly one y. The other: two are possible. The boards show how many values each allows. Who is right?',
    ),
    items: [
      {
        id: 'one',
        label: L('Aniq bitta y degani', 'Тот, кто сказал ровно одно y', 'The one who said exactly one y'),
        hint: L(
          "Taxminingiz qabul qilindi. Zonalar va tekislikda tekshiramiz.",
          'Прогноз принят. Проверим на зонах и на плоскости.',
          'Your prediction is taken. We will check it with the zones and the plane.',
        ),
      },
      {
        id: 'two',
        label: L('Ikkita ham bo\'ladi degani', 'Тот, кто сказал, что может быть два', 'The one who said two are possible'),
        hint: L(
          "Unda bitta x uchun ikki javob chiqadi, va qaysi biri kerakligi ma'lum bo'lmaydi.",
          'Тогда на один x выйдет два ответа, и неизвестно, который нужен.',
          'Then one x gives two answers, and it is unclear which one is meant.',
        ),
      },
      {
        id: 'any',
        label: L('Nechta bo\'lsa ham farqi yo\'q', 'Сколько угодно, разницы нет', 'Any number, it makes no difference'),
        hint: L(
          "Farqi bor: funksiya har x uchun bitta javob berishi kerak.",
          'Разница есть: функция обязана давать один ответ на каждый x.',
          'It does make a difference: a function must give one answer for each x.',
        ),
      },
      {
        id: 'none',
        label: L('Bitta y ham bo\'lmasligi mumkin', 'Может не быть ни одного y', 'There may be no y at all'),
        hint: L(
          "Agar y umuman bo'lmasa, x ga hech narsa mos kelmaydi va mos kelish ham yo'q.",
          'Если y вообще нет, то x ничему не отвечает, и соответствия тоже нет.',
          'If there is no y at all, x corresponds to nothing and there is no correspondence either.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki o'quvchi funksiya nima ekanini o'zicha aytdi.", 'Два ученика по-своему сказали, что такое функция.', 'Two students said in their own words what a function is.'),
    A('mount', "Tabloda ular bitta x uchun ruxsat bergan qiymatlar soni turadi.", 'На табло число значений, которое каждый допускает для одного x.', 'The boards show how many values each allows for one x.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Juftlik, qiymat va jadval. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uch qisqa savol', 'Три коротких вопроса', 'Three short questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "(4; 9) juftligida qaysi son x ga tegishli?",
        'В паре (4; 9) какое число относится к x?',
        'In the pair (4; 9), which number belongs to x?',
      ),
      ok: L("Birinchi son har doim x bo'yicha.", 'Первое число всегда по оси x.', 'The first number always goes along x.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '9', tag: 'Z3', hint: L("To'qqiz ikkinchi o'rinda, ya'ni u y.", 'Девять на втором месте, значит это y.', 'Nine is in second place, so it is y.') },
        { id: 'c', label: '13', tag: 'Z6', hint: L("Sonlar qo'shilmaydi, ular juftlikda alohida turadi.", 'Числа не складываются, они стоят в паре по отдельности.', 'The numbers are not added, they stand separately in the pair.') },
        { id: 'd', label: '5', tag: 'Z6', hint: L("Ayirish ham kerak emas: juftlikda ikki son alohida.", 'Вычитать тоже не нужно: в паре два числа по отдельности.', 'No subtracting either: the pair holds two separate numbers.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = 2x + 1 bo'lsa, x uchga teng bo'lganda y nechchi?",
        'Если y = 2x + 1, то каково y при x равном трём?',
        'If y = 2x + 1, what is y at x equal to three?',
      ),
      ok: L("Ikki karra uch olti, qo'shuv bir yetti.", 'Два на три шесть, плюс один семь.', 'Two times three is six, plus one is seven.'),
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '5', tag: 'Z6', hint: L("Ikki karra uch olti, keyin bir qo'shiladi.", 'Два на три шесть, потом прибавляется один.', 'Two times three is six, then one is added.') },
        { id: 'c', label: '9', tag: 'Z6', hint: L("Bir qo'shiladi, uch emas.", 'Прибавляется один, а не три.', 'One is added, not three.') },
        { id: 'd', label: '3', tag: 'Z3', hint: L("Uch bu x, javob esa y.", 'Три это x, а ответ это y.', 'Three is x, and the answer is y.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uch qatorli jadvalda nechta juftlik bor?",
        'Сколько пар в таблице из трёх строк?',
        'How many pairs does a table of three rows hold?',
      ),
      ok: L("Har qator bitta juftlik beradi.", 'Каждая строка даёт одну пару.', 'Each row gives one pair.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '6', tag: 'Z4', hint: L("Har qatorda ikki son bor, lekin juftlik bitta.", 'В каждой строке два числа, но пара одна.', 'Each row holds two numbers, but one pair.') },
        { id: 'c', label: '2', tag: 'Z4', hint: L("Qatorlar uchta.", 'Строк три.', 'There are three rows.') },
        { id: 'd', label: '1', tag: 'Z4', hint: L("Har qator o'z juftligini beradi.", 'Каждая строка даёт свою пару.', 'Each row gives its own pair.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Birinchisi o'tgan darsdan.", 'Три коротких вопроса. Первый из прошлого урока.', 'Three short questions. The first is from the last lesson.'),
    A('1', "Ikkinchisida formula bor.", 'Во втором есть формула.', 'The second has a formula.'),
    A('2', "Uchinchisi jadval haqida.", 'Третий про таблицу.', 'The third is about a table.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. ZONALAR: ta'rif bo'yicha tarqatish.
// ============================================================
const S3 = {
  kind: 'sort',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Ta\'rif bo\'yicha', 'По определению', 'By the definition'),
  zones: [
    { id: 'z1', label: L('Funksiya', 'Функция', 'A function') },
    { id: 'z2', label: L('Funksiya emas', 'Не функция', 'Not a function') },
  ],
  cards: [
    { id: 'c1', text: '(1; 5) (2; 7)', zone: 'z1' },
    { id: 'c2', text: '(1; 5) (1; 8)', zone: 'z2' },
    { id: 'c3', text: '(2; 4) (3; 4)', zone: 'z1' },
    { id: 'c4', text: '(0; 1) (0; 2)', zone: 'z2' },
  ],
  prompt: L(
    "Ta'rif bitta: har bir x ga aniq bitta y mos kelishi kerak. Tarqating.",
    'Определение одно: каждому x должно отвечать ровно одно y. Раскинь.',
    'The definition is one: each x must have exactly one y. Sort them.',
  ),
  wrongs: [
    {
      tag: 'Z1',
      hint: L(
        "Birinchi sonlarga qarang: agar bitta x ikki marta uchrasa va y lar boshqa bo'lsa, bu funksiya emas.",
        'Смотри на первые числа: если один x встретился дважды с разными y, это не функция.',
        'Look at the first numbers: if one x appears twice with different y, it is not a function.',
      ),
    },
  ],
  okNote: L(
    "Cheklov faqat BIR tomonda: bitta x ga ikki y bo'lmaydi. Boshqa x larga bir xil y bo'lsa -- bu ruxsat.",
    'Ограничение только с ОДНОЙ стороны: одному x нельзя два y. А разным x одно и то же y — можно.',
    'The restriction goes ONE way only: one x may not have two y. Different x sharing one y is allowed.',
  ),
  audio: [
    A('mount', "To'rt mos kelish. Ta'rifni qo'llab tarqatamiz.", 'Четыре соответствия. Раскинем их по определению.', 'Four correspondences. Let us sort them by the definition.'),
    A('mount', "Birinchi sonlarni sanang: bitta x ikki marta uchrasa, diqqat qiling.", 'Посчитай первые числа: если один x встретился дважды, будь внимателен.', 'Count the first numbers: if one x appears twice, pay attention.'),
    A('ok', "Cheklov bir tomonda: bitta x ga ikki y bo'lmaydi.", 'Ограничение с одной стороны: одному x нельзя два y.', 'The restriction is one way: one x may not have two y.'),
  ],
}

// ============================================================
// 4. FARQLASH, TEKISLIKDA: bitta abssissa ustida IKKI nuqta.
// Buni aytish kerak emas, u ko'rinadi.
// ============================================================
const S4 = {
  kind: 'plane',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Bitta abssissa, ikki nuqta', 'Одна абсцисса, две точки', 'One abscissa, two points'),
  range: BOX,
  dots: [{ x: 2, y: 1 }, { x: 2, y: 3 }],
  labels: true,
  caption: L(
    "Ikki nuqta bitta abssissa ustida turibdi. Chizmaga qarang.",
    'Две точки стоят над одной абсциссой. Посмотри на чертёж.',
    'Two points sit above one abscissa. Look at the drawing.',
  ),
  options: [
    { id: 'a', label: L('bu funksiya emas', 'это не функция', 'this is not a function') },
    { id: 'b', label: L('bu funksiya', 'это функция', 'this is a function') },
    { id: 'c', label: L('nuqtalar yetarli emas', 'точек недостаточно', 'there are not enough points') },
    { id: 'd', label: L('bunday chizma bo\'lmaydi', 'такого чертежа не бывает', 'such a drawing cannot exist') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Ikkida ikki qiymat turibdi: bir va uch. Funksiya bitta javob berishi kerak.", 'При двух стоят два значения: один и три. Функция обязана давать один ответ.', 'At two there are two values: one and three. A function must give one answer.') },
    { key: 'c', tag: 'Z5', hint: L("Ta'rifni buzish uchun ikki nuqta yetadi.", 'Чтобы нарушить определение, достаточно двух точек.', 'Two points are enough to break the definition.') },
    { key: 'd', tag: 'Z5', hint: L("Chizma bor: ikki nuqta bitta vertikal chiziqda turibdi.", 'Чертёж есть: две точки стоят на одной вертикали.', 'The drawing exists: two points sit on one vertical.') },
  ],
  note: L(
    "Ikki nuqta bitta VERTIKALDA turgan bo'lsa, bu funksiya emas: bitta x ga ikki y mos kelib qoladi.",
    'Если две точки стоят на одной ВЕРТИКАЛИ, это не функция: одному x отвечают два y.',
    'If two points sit on one VERTICAL, it is not a function: one x has two y.',
  ),
  audio: [
    A('mount', "Endi shu narsani tekislikda ko'ramiz.", 'Теперь посмотрим на то же самое на плоскости.', 'Now let us look at the same thing on the plane.'),
    A('mount', "Ikki nuqta bitta abssissa ustida. Bu ta'rifga to'g'ri keladimi.", 'Две точки над одной абсциссой. Согласуется ли это с определением.', 'Two points above one abscissa. Does that fit the definition.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. FORMULA: qiymat hisoblanadi.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Formula ham funksiya', 'Формула тоже функция', 'A formula is a function too'),
  given: L(
    "Formula har x uchun aniq bitta y beradi, shuning uchun u ham funksiya.",
    'Формула даёт для каждого x ровно одно y, поэтому она тоже функция.',
    'A formula gives exactly one y for each x, so it is a function too.',
  ),
  template: ['y = 3x − 2,   x = 4   →   y = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '10' },
    { id: 'b', label: '14' },
    { id: 'c', label: '−10' },
    { id: 'd', label: '2' },
  ],
  answer: ['a'],
  prompt: L(
    "Qiymatni hisoblang.",
    'Посчитай значение.',
    'Work out the value.',
  ),
  checkNote: L(
    "Uch karra to'rt o'n ikki, undan ikki ayirilsa o'n bo'ladi. Boshqa javob chiqmaydi -- shuning uchun bu funksiya.",
    'Три на четыре двенадцать, минус два это десять. Другого ответа не выйдет — поэтому это функция.',
    'Three times four is twelve, minus two is ten. No other answer is possible — that is why it is a function.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Ikki ayiriladi, qo'shilmaydi.", 'Два вычитается, а не прибавляется.', 'Two is subtracted, not added.') },
    { key: 'c', tag: 'Z6', hint: L("Uch karra to'rt musbat o'n ikki.", 'Три на четыре это плюс двенадцать.', 'Three times four is plus twelve.') },
    { key: 'd', tag: 'Z3', hint: L("To'rt bu x, javob esa y.", 'Четыре это x, а ответ это y.', 'Four is x, and the answer is y.') },
  ],
  audio: [
    A('mount', "Funksiya jadval bilan ham, formula bilan ham berilishi mumkin.", 'Функцию можно задать и таблицей, и формулой.', 'A function can be given by a table or by a formula.'),
    A('mount', "Formula har x uchun bitta javob beradi, va bu ta'rifga to'g'ri keladi.", 'Формула даёт один ответ на каждый x, и это согласуется с определением.', 'A formula gives one answer per x, and that fits the definition.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. Yana zonalar, endi jadval ko'rinishida.
// ============================================================
const S6 = {
  kind: 'sort',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Yana to\'rt mos kelish', 'Ещё четыре соответствия', 'Four more correspondences'),
  zones: [
    { id: 'z1', label: L('Funksiya', 'Функция', 'A function') },
    { id: 'z2', label: L('Funksiya emas', 'Не функция', 'Not a function') },
  ],
  cards: [
    { id: 'c1', text: '(−1; 3) (0; 3) (1; 3)', zone: 'z1' },
    { id: 'c2', text: '(5; 1) (5; −1)', zone: 'z2' },
    { id: 'c3', text: '(2; 8) (4; 8) (6; 9)', zone: 'z1' },
    { id: 'c4', text: '(3; 0) (3; 0) (3; 7)', zone: 'z2' },
  ],
  prompt: L(
    "Ta'rif o'sha. Diqqat: uchinchi va to'rtinchi kartada uch juftlik bor.",
    'Определение то же. Внимание: в третьей и четвёртой карточке три пары.',
    'The same definition. Careful: the third and fourth cards hold three pairs.',
  ),
  wrongs: [
    {
      tag: 'Z4',
      hint: L(
        "Har kartadagi HAMMA juftlikni ko'ring: bitta juftlik ta'rifni buzsa, karta funksiya emas.",
        'Смотри ВСЕ пары в карточке: если хотя бы одна нарушает определение, карточка не функция.',
        'Check EVERY pair in the card: if even one breaks the definition, the card is not a function.',
      ),
    },
  ],
  okNote: L(
    "Bir xil y ko'p marta uchrashi mumkin. Taqiq faqat bitta: bir xil x ikki xil y bilan.",
    'Одинаковое y может встречаться много раз. Запрет один: одинаковый x с разными y.',
    'The same y may appear many times. Only one thing is banned: the same x with different y.',
  ),
  audio: [
    A('mount', "Bu safar kartalarda uch juftlikkacha bor.", 'На этот раз в карточках бывает до трёх пар.', 'This time the cards hold up to three pairs.'),
    A('mount', "Hamma juftlikni ko'ring, birinchisi bilan cheklanmang.", 'Смотри все пары, не ограничивайся первой.', 'Check every pair, do not stop at the first.'),
    A('ok', "Bir xil y ruxsat, bir xil x esa yo'q.", 'Одинаковое y можно, одинаковый x нельзя.', 'The same y is allowed, the same x is not.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT: boshqa x larga BIR XIL y -- bu funksiya.
// ============================================================
const S7 = {
  kind: 'plane',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Bir xil y ikki nuqtada', 'Одинаковое y в двух точках', 'The same y at two points'),
  range: BOX,
  dots: [{ x: -2, y: 2 }, { x: 3, y: 2 }],
  labels: true,
  caption: L(
    "Endi ikki nuqta bitta ORDINATA bo'yicha turibdi: y ikkovida ham ikkiga teng.",
    'Теперь две точки стоят на одной ОРДИНАТЕ: y у обеих равен двум.',
    'Now two points share one ORDINATE: y equals two for both.',
  ),
  options: [
    { id: 'a', label: L('bu funksiya', 'это функция', 'this is a function') },
    { id: 'b', label: L('bu funksiya emas', 'это не функция', 'this is not a function') },
    { id: 'c', label: L('bir xil y taqiqlangan', 'одинаковое y запрещено', 'the same y is forbidden') },
    { id: 'd', label: L('aniqlab bo\'lmaydi', 'определить нельзя', 'it cannot be decided') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("Ta'rif bitta x ga ikki y ni taqiqlaydi. Bu yerda x lar boshqa.", 'Определение запрещает два y для одного x. Здесь же x разные.', 'The definition bans two y for one x. Here the x differ.') },
    { key: 'c', tag: 'Z5', hint: L("Bir xil y ruxsat: masalan har x uchun y ikkiga teng bo'lsa ham funksiya.", 'Одинаковое y можно: даже если для всех x значение y равно двум, это функция.', 'The same y is allowed: even if y equals two for every x, it is a function.') },
    { key: 'd', tag: 'Z1', hint: L("Aniqlash mumkin: abssissalarga qarang, ular boshqa.", 'Определить можно: посмотри на абсциссы, они разные.', 'It can be decided: look at the abscissas, they differ.') },
  ],
  note: L(
    "Nuqtalar bitta GORIZONTALDA turishi mumkin -- bu ta'rifni buzmaydi. Taqiq faqat VERTIKALDA: bitta abssissa ustida ikki nuqta bo'lmaydi.",
    'Точки могут стоять на одной ГОРИЗОНТАЛИ — определение это не нарушает. Запрет только по ВЕРТИКАЛИ: над одной абсциссой не может быть двух точек.',
    'Points may share one HORIZONTAL — that breaks nothing. The ban is VERTICAL only: no two points above one abscissa.',
  ),
  audio: [
    A('mount', "Endi teskari holat: y bir xil, x lar esa boshqa.", 'Теперь обратный случай: y одинаковый, а x разные.', 'Now the reverse case: the same y, different x.'),
    A('mount', "Ta'rifni yana o'qing: u qaysi tomonni cheklaydi.", 'Прочитай определение ещё раз: какую сторону оно ограничивает.', 'Read the definition again: which side does it restrict.'),
  ],
}

// ============================================================
// 8. QOIDA.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z1',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L('funksiya bu mos kelish', 'функция это соответствие', 'a function is a correspondence') },
    { id: 'f2', label: L('unda har bir x ga', 'в котором каждому x', 'in which each x') },
    { id: 'f3', label: L('aniq bitta y mos keladi', 'отвечает ровно одно y', 'has exactly one y') },
    { id: 'f4', label: L('bir xil y esa taqiqlanmaydi', 'а одинаковое y не запрещено', 'and the same y is not banned') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval nima ekani, keyin har bir x, keyin aniq bitta y, oxirida ruxsat.",
    'Порядок нарушен. Сначала что это, потом каждому x, потом ровно одно y, в конце разрешение.',
    'The order is off. What it is first, then each x, then exactly one y, and the permission last.',
  ),
  lawChips: [
    { label: 'x', tone: 's2' },
    { label: '→', tone: 'par' },
    { label: 'y', tone: 's1' },
    { label: '1', tone: 'off' },
  ],
  lawSweep: L(
    'argument, mos kelish, qiymat, bitta',
    'аргумент, соответствие, значение, одно',
    'the argument, the correspondence, the value, one',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Funksiya bu shunday mos kelish: x ning har bir qiymatiga y ning ANIQ BITTA qiymati mos keladi. x argument, y esa funksiyaning qiymati deb ataladi.",
        'Функция это такое соответствие, при котором каждому значению x отвечает РОВНО ОДНО значение y. x называют аргументом, а y значением функции.',
        'A function is a correspondence in which each value of x has EXACTLY ONE value of y. x is the argument, y is the value of the function.',
      ),
      L(
        "Cheklov bir tomonda: bitta x ga ikki y bo'lmaydi. Boshqa x larga bir xil y mos kelishi esa mumkin. Chizmada bu shunday ko'rinadi: bitta vertikalda ikki nuqta bo'lmaydi.",
        'Ограничение с одной стороны: одному x нельзя два y. А разным x одно и то же y можно. На чертеже это видно так: на одной вертикали не бывает двух точек.',
        'The restriction is one sided: one x may not have two y. Different x may share one y. On a drawing: no two points on one vertical.',
      ),
    ],
  },
  hookCap: L(
    'Bitta x -- bitta y',
    'Один x — одно y',
    'One x, one y',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('x argument', 'x это аргумент', 'x is the argument'),
    L('y qiymat', 'y это значение', 'y is the value'),
    L("vertikalda bitta nuqta", 'на вертикали одна точка', 'one point per vertical'),
  ],
  audio: [
    A('mount', "Ikki tomonni ko'rdik: vertikal taqiqlangan, gorizontal esa yo'q. Endi qoidani yig'amiz.", 'Обе стороны мы увидели: вертикаль запрещена, горизонталь нет. Теперь соберём правило.', 'We have seen both sides: the vertical is banned, the horizontal is not. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi darsda funksiya CHIZIQ bo'lib chiqadi.", 'Верно. На следующем уроке функция станет ПРЯМОЙ.', 'Correct. Next lesson the function becomes a LINE.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Funksiyami yoki yo\'q', 'Функция или нет', 'A function or not'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "(1; 2) (2; 2) (3; 2) -- bu funksiyami?",
        '(1; 2) (2; 2) (3; 2) — это функция?',
        '(1; 2) (2; 2) (3; 2) — is this a function?',
      ),
      ok: L("Har x bitta marta uchraydi, y esa bir xil bo'lishi mumkin.", 'Каждый x встречается один раз, а y может быть одинаковым.', 'Each x appears once, and y may repeat.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('ha, funksiya', 'да, функция', 'yes, a function'),
        },
        {
          id: 'b',
          tag: 'Z5',
          label: L("yo'q, y lar bir xil", 'нет, y одинаковые', 'no, the y are the same'),
          hint: L("Bir xil y taqiqlanmaydi.", 'Одинаковое y не запрещено.', 'The same y is not banned.'),
        },
        {
          id: 'c',
          tag: 'Z4',
          label: L("yo'q, juftlik kam", 'нет, пар мало', 'no, too few pairs'),
          hint: L("Juftliklar soni ta'rifga kirmaydi.", 'Число пар в определение не входит.', 'The number of pairs is not part of the definition.'),
        },
        {
          id: 'd',
          tag: 'Z1',
          label: L('aniqlab bo\'lmaydi', 'определить нельзя', 'it cannot be decided'),
          hint: L("Aniqlanadi: abssissalar boshqa-boshqa.", 'Определяется: абсциссы все разные.', 'It can be decided: the abscissas all differ.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(4; 1) (4; 5) -- bu funksiyami?",
        '(4; 1) (4; 5) — это функция?',
        '(4; 1) (4; 5) — is this a function?',
      ),
      ok: L("To'rtga ikki qiymat mos keldi, demak funksiya emas.", 'Четырём отвечают два значения, значит не функция.', 'Four has two values, so not a function.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L("yo'q, funksiya emas", 'нет, не функция', 'no, not a function'),
        },
        {
          id: 'b',
          tag: 'Z1',
          label: L('ha, funksiya', 'да, функция', 'yes, a function'),
          hint: L("Bitta x ga ikki y mos kelib qoldi.", 'Одному x отвечают два y.', 'One x has two y.'),
        },
        {
          id: 'c',
          tag: 'Z3',
          label: L('ha, chunki y lar boshqa', 'да, ведь y разные', 'yes, since the y differ'),
          hint: L("Aynan shu buzadi: bitta x, ikki xil y.", 'Именно это и нарушает: один x, два разных y.', 'That is exactly the breach: one x, two different y.'),
        },
        {
          id: 'd',
          tag: 'Z4',
          label: L('juftlik yetarli emas', 'пар недостаточно', 'not enough pairs'),
          hint: L("Ikki juftlik ta'rifni buzish uchun yetadi.", 'Двух пар достаточно, чтобы нарушить определение.', 'Two pairs are enough to break the definition.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = x² bo'lsa, x manfiy uchga teng bo'lganda y nechchi?",
        'Если y = x², то каково y при x равном минус трём?',
        'If y = x², what is y at x equal to minus three?',
      ),
      ok: L("Manfiy uchning kvadrati to'qqiz: ikki minus musbat beradi.", 'Квадрат минус трёх это девять: два минуса дают плюс.', 'Minus three squared is nine: two minuses give a plus.'),
      items: [
        { id: 'a', label: '9', correct: true },
        { id: 'b', label: '−9', tag: 'Z6', hint: L("Kvadratda ikki minus ko'paytiriladi va musbat chiqadi.", 'В квадрате два минуса умножаются и выходит плюс.', 'In a square two minuses multiply and give a plus.') },
        { id: 'c', label: '−6', tag: 'Z6', hint: L("Kvadrat bu ikkiga ko'paytirish emas, bu o'ziga ko'paytirish.", 'Квадрат это не умножение на два, а умножение на себя.', 'Squaring is not doubling, it is multiplying by itself.') },
        { id: 'd', label: '6', tag: 'Z6', hint: L("Manfiy uch karra manfiy uch to'qqiz beradi.", 'Минус три на минус три это девять.', 'Minus three times minus three is nine.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Chizmada ikki nuqta bitta vertikalda turibdi. Bu funksiyami?",
        'На чертеже две точки стоят на одной вертикали. Это функция?',
        'On a drawing two points sit on one vertical. Is that a function?',
      ),
      ok: L("Bitta vertikal bitta abssissa, ya'ni bitta x ga ikki y.", 'Одна вертикаль это одна абсцисса, значит одному x два y.', 'One vertical means one abscissa, so one x with two y.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L("yo'q", 'нет', 'no'),
        },
        {
          id: 'b',
          tag: 'Z1',
          label: L('ha', 'да', 'yes'),
          hint: L("Vertikal bitta abssissani beradi, va unda ikki qiymat turibdi.", 'Вертикаль задаёт одну абсциссу, а на ней два значения.', 'A vertical fixes one abscissa, and it carries two values.'),
        },
        {
          id: 'c',
          tag: 'Z5',
          label: L('nuqtalarga bog\'liq emas', 'от точек не зависит', 'it does not depend on the points'),
          hint: L("Bog'liq: ta'rif aynan nuqtalar haqida.", 'Зависит: определение как раз про точки.', 'It does depend: the definition is about the points.'),
        },
        {
          id: 'd',
          tag: 'Z5',
          label: L('gorizontal bo\'lsa ham xuddi shunday', 'с горизонталью то же самое', 'the same with a horizontal'),
          hint: L("Gorizontalda ikki nuqta bo'lishi mumkin, vertikalda esa yo'q.", 'На горизонтали две точки можно, на вертикали нельзя.', 'A horizontal may hold two points, a vertical may not.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Ta'rif bittasi, holatlar esa boshqa-boshqa.", 'Четыре вопроса. Определение одно, а случаи разные.', 'Four questions. One definition, different cases.'),
    A('1', "Ikkinchisida bitta x ikki marta uchraydi.", 'Во втором один x встречается дважды.', 'In the second, one x appears twice.'),
    A('2', "Uchinchisida formula bor.", 'В третьем есть формула.', 'The third has a formula.'),
    A('3', "Oxirgisi chizma haqida.", 'Последний про чертёж.', 'The last is about a drawing.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: ikki qiymat.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Ikki qiymat', 'Два значения', 'Two values'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  template: ['y = 4x − 3.   x = 2   →   y = ', { slot: 0 }, ',   x = 0   →   y = ', { slot: 1 }],
  parts: [
    { id: 'a', label: '5' },
    { id: 'b', label: '−3' },
    { id: 'c', label: '11' },
    { id: 'd', label: '3' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikki qiymatni hisoblang.",
    'Посчитай два значения.',
    'Work out the two values.',
  ),
  checkNote: L(
    "To'rt karra ikki sakkiz, undan uch ayirilsa besh. x nol bo'lganda esa faqat manfiy uch qoladi.",
    'Четыре на два восемь, минус три это пять. А при x равном нулю остаётся только минус три.',
    'Four times two is eight, minus three is five. At x equal to zero only minus three remains.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z6', hint: L("To'rt karra ikki sakkiz, uch qo'shilmaydi, ayiriladi.", 'Четыре на два восемь, три не прибавляется, а вычитается.', 'Four times two is eight, three is subtracted, not added.') },
    { key: 'd', tag: 'Z3', hint: L("x nol bo'lganda to'rt karra nol nol beradi, qolgani manfiy uch.", 'При x равном нулю четыре на ноль это ноль, остаётся минус три.', 'At x zero, four times zero is zero, leaving minus three.') },
    { key: '*', tag: 'Z6', hint: L("Har qiymat alohida hisoblanadi.", 'Каждое значение считается отдельно.', 'Each value is worked out separately.') },
  ],
  probe: {
    question: L("Bu formula funksiyami?", 'Эта формула функция?', 'Is this formula a function?'),
    items: [
      {
        id: 'a',
        correct: true,
        label: L('ha: har x uchun bitta javob', 'да: на каждый x один ответ', 'yes: one answer per x'),
      },
      {
        id: 'b',
        tag: 'Z1',
        label: L("yo'q: ikki qiymat chiqdi", 'нет: вышло два значения', 'no: two values came out'),
        hint: L("Ikki qiymat ikki BOSHQA x uchun chiqdi, bitta x uchun emas.", 'Два значения вышли для двух РАЗНЫХ x, а не для одного.', 'The two values came from two DIFFERENT x, not from one.'),
      },
      {
        id: 'c',
        tag: 'Z5',
        label: L('formula funksiya bo\'lmaydi', 'формула не бывает функцией', 'a formula is never a function'),
        hint: L("Bo'ladi: formula ham mos kelishni beradi.", 'Бывает: формула тоже задаёт соответствие.', 'It can be: a formula gives a correspondence too.'),
      },
      {
        id: 'd',
        tag: 'Z4',
        label: L('jadval kerak', 'нужна таблица', 'a table is needed'),
        hint: L("Jadval qulay, lekin shart emas.", 'Таблица удобна, но не обязательна.', 'A table is handy but not required.'),
      },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval ikki qiymat, keyin savol.", 'Два шага. Сначала два значения, потом вопрос.', 'Two steps. Two values first, then a question.'),
    A('mount', "Diqqat: x nol bo'lganda ko'paytma nolga aylanadi.", 'Внимание: при x равном нулю произведение обращается в ноль.', 'Careful: at x equal to zero the product becomes zero.'),
    A('two', "Endi ikkinchi qadam.", 'Теперь второй шаг.', 'Now the second step.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. TESKARI YO'L: qiymat berilgan, argument izlanadi.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Qiymatdan argumentga', 'От значения к аргументу', 'From the value to the argument'),
  given: L(
    "y = 2x + 5 funksiyasida qiymat o'n birga teng bo'ldi. Argument nechchi edi?",
    'В функции y = 2x + 5 значение оказалось равно одиннадцати. Каким был аргумент?',
    'In the function y = 2x + 5 the value came out eleven. What was the argument?',
  ),
  template: ['2x + 5 = 11   →   x = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '3' },
    { id: 'b', label: '8' },
    { id: 'c', label: '16' },
    { id: 'd', label: '−3' },
  ],
  answer: ['a'],
  prompt: L(
    "Argumentni toping.",
    'Найди аргумент.',
    'Find the argument.',
  ),
  checkNote: L(
    "O'n birdan besh ayirilsa olti, olti ikkiga bo'linsa uch. Tekshirish: ikki karra uch qo'shuv besh o'n bir.",
    'Одиннадцать минус пять это шесть, шесть на два это три. Проверка: два на три плюс пять это одиннадцать.',
    'Eleven minus five is six, six by two is three. Check: two times three plus five is eleven.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Besh ayirilgandan keyin ikkiga bo'lish qoldi.", 'После вычитания пяти осталось разделить на два.', 'After subtracting five, dividing by two is left.') },
    { key: 'c', tag: 'Z6', hint: L("Besh ayiriladi, qo'shilmaydi.", 'Пять вычитается, а не прибавляется.', 'Five is subtracted, not added.') },
    { key: 'd', tag: 'Z3', hint: L("Ikki karra manfiy uch qo'shuv besh minus bir beradi, o'n bir emas.", 'Два на минус три плюс пять это минус один, а не одиннадцать.', 'Two times minus three plus five is minus one, not eleven.') },
  ],
  audio: [
    A('mount', "Bu safar qiymat berilgan, argument esa yo'q. Bu tenglama, va uni siz yechishni bilasiz.", 'На этот раз дано значение, а аргумент нет. Это уравнение, и ты умеешь его решать.', 'This time the value is given and the argument is not. That is an equation, and you know how to solve it.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Uch juftlik tekshirilgan, TO'RTINCHISI buzadi.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Uch juftlik tekshirilgan va ularning hammasi ta'rifga to'g'ri keladi. Shunday bo'lsa ham, qaysi qator xato?",
    'Три пары проверены, и все они согласуются с определением. И всё же какая строка ошибочна?',
    'Three pairs were checked and all fit the definition. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: '(1; 4) (2; 6) (3; 8) (2; 9)' },
    { id: 'r2', text: '1 → 4' },
    { id: 'r3', text: '2 → 6' },
    { id: 'r4', text: '3 → 8' },
    { id: 'r5', text: L('javob: funksiya', 'ответ: функция', 'answer: a function') },
  ],
  answerId: 'r5',
  hints: {
    r1: L("Bu boshlang'ich ro'yxat.", 'Это исходный список.', 'That is the original list.'),
    r2: L("To'g'ri: birga to'rt mos keladi.", 'Верно: единице отвечает четыре.', 'Right: one has four.'),
    r3: L("To'g'ri: ikkiga olti mos keladi.", 'Верно: двойке отвечает шесть.', 'Right: two has six.'),
    r4: L("To'g'ri: uchga sakkiz mos keladi.", 'Верно: тройке отвечает восемь.', 'Right: three has eight.'),
  },
  tags: { r1: 'Z4', r2: 'Z4', r3: 'Z4', r4: 'Z4' },
  proofFill: {
    template: ['2 → 6   va   2 → 9   →   ', { slot: 0 }],
    parts: [
      { id: 'a', label: L('funksiya emas', 'не функция', 'not a function') },
      { id: 'b', label: L('funksiya', 'функция', 'a function') },
      { id: 'c', label: L('juftlik kam', 'пар мало', 'too few pairs') },
      { id: 'd', label: L('aniqlab bo\'lmaydi', 'определить нельзя', 'cannot be decided') },
    ],
    answer: ['a'],
    prompt: L(
      "To'rtinchi juftlikni ham hisobga oling.",
      'Учти и четвёртую пару.',
      'Take the fourth pair into account too.',
    ),
    checkNote: L(
      "Ro'yxatda to'rt juftlik bor, va oxirgisida ikkilik yana uchraydi -- endi to'qqiz bilan. Bitta x ga ikki y mos keldi.",
      'В списке четыре пары, и в последней двойка встречается снова — теперь с девяткой. Одному x отвечают два y.',
      'The list has four pairs, and the last brings two back — now with nine. One x has two y.',
    ),
    wrongs: [
      { key: 'b', tag: 'Z1', hint: L("Ikkilik ikki marta uchradi va qiymatlari boshqa.", 'Двойка встретилась дважды, и значения разные.', 'Two appeared twice with different values.') },
      { key: 'c', tag: 'Z4', hint: L("Juftliklar soni emas, ularning MAZMUNI muhim.", 'Важно не число пар, а их СОДЕРЖАНИЕ.', 'What matters is not the count of pairs but their CONTENT.') },
      { key: 'd', tag: 'Z4', hint: L("Aniqlanadi: ro'yxatni oxirigacha o'qish kerak.", 'Определяется: надо дочитать список до конца.', 'It can be decided: the list must be read to the end.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda uch juftlik tekshirilgan va hammasi to'g'ri.", 'В этой ловушке проверены три пары, и все верны.', 'In this trap three pairs were checked and all are right.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же ответ неверен. В какой строке ошибка впервые.', 'And yet the answer is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. To'rtinchi juftlik umuman tekshirilmagan.", 'Нашёл. Четвёртая пара вообще не проверена.', 'You found it. The fourth pair was never checked.'),
    A('done', "Ro'yxatni oxirigacha o'qish kerak: bitta juftlik ta'rifni buzsa yetadi.", 'Список надо дочитать: достаточно одной пары, нарушающей определение.', 'The list must be read to the end: one breaking pair is enough.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. SO'ZLI HOLAT: narx va og'irlik.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Og\'irlik va narx', 'Вес и цена', 'Weight and price'),
  given: L(
    "Bir kilogramm olma sakkiz ming so'm. Og'irlikka narx mos keladi va bu funksiya: har og'irlik uchun bitta narx.",
    'Один килограмм яблок стоит восемь тысяч сумов. Весу отвечает цена, и это функция: на каждый вес одна цена.',
    'One kilogram of apples costs eight thousand sums. The weight has a price, and that is a function: one price per weight.',
  ),
  template: ['y = 8x.   x = 3   →   y = ', { slot: 0 }],
  parts: [
    { id: 'a', label: '24' },
    { id: 'b', label: '11' },
    { id: 'c', label: '8' },
    { id: 'd', label: '3' },
  ],
  answer: ['a'],
  prompt: L(
    "Uch kilogramm uchun narxni hisoblang, ming so'mda.",
    'Посчитай цену за три килограмма, в тысячах сумов.',
    'Work out the price for three kilograms, in thousands of sums.',
  ),
  checkNote: L(
    "Sakkiz karra uch yigirma to'rt. Har og'irlik uchun narx bitta, shuning uchun bu funksiya.",
    'Восемь на три двадцать четыре. На каждый вес цена одна, поэтому это функция.',
    'Eight times three is twenty four. Each weight has one price, so this is a function.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z6', hint: L("Narx og'irlikka KO'PAYTIRILADI, qo'shilmaydi.", 'Цена УМНОЖАЕТСЯ на вес, а не складывается с ним.', 'The price is MULTIPLIED by the weight, not added to it.') },
    { key: 'c', tag: 'Z2', hint: L("Sakkiz bu bir kilogrammning narxi, bizda esa uch kilogramm.", 'Восемь это цена одного килограмма, а у нас три.', 'Eight is the price of one kilogram, and we have three.') },
    { key: 'd', tag: 'Z3', hint: L("Uch bu og'irlik, ya'ni x. Javob esa narx.", 'Три это вес, то есть x. А ответ это цена.', 'Three is the weight, that is x. The answer is the price.') },
  ],
  audio: [
    A('mount', "Funksiya hayotda ham uchraydi: og'irlik va narx.", 'Функция встречается и в жизни: вес и цена.', 'A function shows up in real life too: weight and price.'),
    A('mount', "Har og'irlik uchun narx bitta, shuning uchun bu funksiya.", 'На каждый вес цена одна, поэтому это функция.', 'Each weight has one price, so this is a function.'),
  ],
}

// ============================================================
// 14. BLITS. Baholanadigan YAGONA ekran.
// ============================================================
const S14 = {
  kind: 'blitz',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "(0; 0) (1; 1) (2; 4) -- funksiyami?",
        '(0; 0) (1; 1) (2; 4) — функция?',
        '(0; 0) (1; 1) (2; 4) — a function?',
      ),
      ok: L("Har x bitta marta uchraydi.", 'Каждый x встречается один раз.', 'Each x appears once.'),
      items: [
        { id: 'a', correct: true, label: L('ha', 'да', 'yes') },
        { id: 'b', tag: 'Z1', label: L("yo'q", 'нет', 'no'), hint: L("Bitta x ikki marta uchramadi.", 'Ни один x не встретился дважды.', 'No x appeared twice.') },
        { id: 'c', tag: 'Z4', label: L('juftlik kam', 'пар мало', 'too few pairs'), hint: L("Juftliklar soni ta'rifga kirmaydi.", 'Число пар в определение не входит.', 'The pair count is not in the definition.') },
        { id: 'd', tag: 'Z5', label: L('formula kerak', 'нужна формула', 'a formula is needed'), hint: L("Funksiya ro'yxat bilan ham berilishi mumkin.", 'Функцию можно задать и списком.', 'A function can be given by a list too.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(7; 2) (7; 3) -- funksiyami?",
        '(7; 2) (7; 3) — функция?',
        '(7; 2) (7; 3) — a function?',
      ),
      ok: L("Yettiga ikki qiymat mos keldi.", 'Семёрке отвечают два значения.', 'Seven has two values.'),
      items: [
        { id: 'a', correct: true, label: L("yo'q", 'нет', 'no') },
        { id: 'b', tag: 'Z1', label: L('ha', 'да', 'yes'), hint: L("Bitta x ga ikki y mos keldi.", 'Одному x отвечают два y.', 'One x has two y.') },
        { id: 'c', tag: 'Z3', label: L('ha, y lar boshqa', 'да, y разные', 'yes, the y differ'), hint: L("Aynan shu ta'rifni buzadi.", 'Именно это и нарушает определение.', 'That is exactly what breaks the definition.') },
        { id: 'd', tag: 'Z4', label: L('aniqlab bo\'lmaydi', 'определить нельзя', 'cannot be decided'), hint: L("Aniqlanadi: abssissalar bir xil.", 'Определяется: абсциссы одинаковы.', 'It can be decided: the abscissas are equal.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "y = 5 − x bo'lsa, x ikkiga teng bo'lganda y nechchi?",
        'Если y = 5 − x, то каково y при x равном двум?',
        'If y = 5 − x, what is y at x equal to two?',
      ),
      ok: L("Beshdan ikki ayirilsa uch.", 'Пять минус два это три.', 'Five minus two is three.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '7', tag: 'Z6', hint: L("Ikki ayiriladi, qo'shilmaydi.", 'Два вычитается, а не прибавляется.', 'Two is subtracted, not added.') },
        { id: 'c', label: '−3', tag: 'Z3', hint: L("Beshdan ikki ayiriladi, teskarisi emas.", 'Из пяти вычитают два, а не наоборот.', 'Two is taken from five, not the other way.') },
        { id: 'd', label: '10', tag: 'Z6', hint: L("Ko'paytirish emas, ayirish.", 'Это вычитание, а не умножение.', 'That is subtraction, not multiplication.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ta'rif bo'yicha bitta x ga nechta y mos keladi?",
        'По определению, сколько y отвечает одному x?',
        'By the definition, how many y correspond to one x?',
      ),
      ok: L("Aniq bitta: bu ta'rifning butun mohiyati.", 'Ровно одно: в этом весь смысл определения.', 'Exactly one: that is the whole point of the definition.'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '2', tag: 'Z1', hint: L("Ikki qiymat bo'lsa, qaysi biri kerakligi ma'lum bo'lmaydi.", 'Если два значения, неизвестно, которое нужно.', 'With two values it is unclear which one is meant.') },
        { id: 'c', label: '0', tag: 'Z2', hint: L("Qiymat bo'lmasa, mos kelish ham bo'lmaydi.", 'Без значения нет и соответствия.', 'With no value there is no correspondence.') },
        { id: 'd', tag: 'Z5', label: L('nechta bo\'lsa ham', 'сколько угодно', 'any number'), hint: L("Ta'rif aynan shu joyni cheklaydi.", 'Определение ограничивает как раз это место.', 'The definition restricts exactly this.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisida abssissalar bir xil.", 'Во втором абсциссы одинаковы.', 'In the second the abscissas match.'),
    A('2', "Uchinchisida formula bor.", 'В третьем есть формула.', 'The third has a formula.'),
    A('3', "Oxirgisi ta'rifning o'zi.", 'Последний это само определение.', 'The last is the definition itself.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Bitta x -- bitta y', 'Один x — одно y', 'One x, one y'),
  gate: S1.gate,
  fix: {
    tokens: ['1', 'y'],
    value: '1',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Funksiyada har bir x ga aniq bitta y mos keladi. Ikki qiymat bo'lsa, qaysi biri kerakligi ma'lum bo'lmaydi -- shuning uchun bu funksiya emas.",
    'В функции каждому x отвечает ровно одно y. Если значений два, неизвестно, которое нужно — поэтому это не функция.',
    'In a function each x has exactly one y. With two values it is unclear which one is meant, so it is not a function.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    one: L('aniq bitta y', 'ровно одно y', 'exactly one y'),
    two: L('ikkita ham bo\'ladi', 'может быть и два', 'two are possible'),
    any: L('nechta bo\'lsa ham', 'сколько угодно', 'any number'),
    none: L('bitta ham bo\'lmasligi mumkin', 'может не быть ни одного', 'there may be none'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['(1; 5) (1; 8) → 0', '(2; 4) (3; 4) → 1', 'y = 3x − 2 → 10', '(4; 1) (4; 5) → 0'],
  twoLabel: L('B6 bloki davom etadi', 'Блок Б6 продолжается', 'Block B6 continues'),
  twoA: L(
    'bitta x  →  bitta y',
    'один x  →  одно y',
    'one x  →  one y',
  ),
  twoB: L(
    'bir xil y  →  ruxsat',
    'одинаковое y  →  можно',
    'the same y  →  allowed',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'chiziqli funksiya',
    'линейная функция',
    'the linear function',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish bitta ta'rifdan chiqdi: har x ga aniq bitta y.", 'Вся сегодняшняя работа вышла из одного определения: каждому x ровно одно y.', 'All of today came from one definition: exactly one y per x.'),
    A('mount', "Keyingi darsda funksiya chiziq bo'lib chiqadi.", 'На следующем уроке функция станет прямой.', 'Next lesson the function becomes a line.'),
  ],
}

export default makeLesson({
  id: LESSON_ID,
  title: LESSON_TITLE,
  no: LESSON_NO,
  block: BLOCK,
  tags: TAGS,
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
