// ============================================================================
// 11-sinf, Dars 11. LOGARIFMIK TENGLAMALAR.  (Логарифмические уравнения)
//
// B2 blokining uchinchi darsi. Faqat MA'LUMOT: ekran tanasi `screens.jsx` da,
// mexanika `tools.jsx` da, infratuzilma `core.jsx` da.
//   raskadrovka: src/books/grade11/DARS11_SKELET.md
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// Etalondan (12-dars) farqi NOL ekran.
//
// DARSNING BITTA GAPI: musbat bo'lishi shart bo'lgan narsa -- ARGUMENT, iks
// emas. Uchinchi ekranda manfiy ildiz TUSHIB QOLADI, yettinchida esa manfiy
// ildiz QOLADI. «Manfiy bo'lsa tashla» deb yodlagan o'quvchi aynan yettinchi
// ekranda yiqiladi -- va bu tekshiruvning o'zi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_11',
  title: L('Logarifmik tenglamalar', 'Логарифмические уравнения', 'Logarithmic equations'),
}

const BLOCK = { label: 'B2', from: 9, to: 14, current: 11 }

const AXIS_1 = { min: -5, max: 6, ticks: [{ v: -3 }, { v: 1 }, { v: 3 }] }
const AXIS_2 = { min: -7, max: 4, ticks: [{ v: -5 }, { v: 0 }, { v: 1 }] }
const AXIS_4 = { min: 0, max: 12, ticks: [{ v: 8 }] }

const EQ_HOOK = 'log₂(x − 1) + log₂(x + 1) = 3'
const EQ_NEW = 'log₂(x² + 4x + 3) = 3'

// ============================================================
// SLAYD 1. XUK.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Logarifmik tenglamalar', 'Логарифмические уравнения', 'Logarithmic equations'),
  title: L('Bitta ildizmi yoki ikkita?', 'Один корень или два?', 'One root or two?'),
  expr: EQ_HOOK,
  axis: AXIS_1,
  rows: [
    {
      id: 'a',
      name: L('birinchi yechim', 'первое решение', 'first solution'),
      value: 'x = 3',
      marks: [{ v: 3, tone: 'ink' }],
    },
    {
      id: 'b',
      name: L('ikkinchi yechim', 'второе решение', 'second solution'),
      value: 'x = 3,  x = −3',
      marks: [{ v: 3, tone: 'tip' }, { v: -3, tone: 'tip' }],
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi uni qo'yib tekshiramiz.",
      'Твой ответ записан. Сейчас проверим его подстановкой.',
      'Your answer is saved. Now we will check it by substitution.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первое', 'the first') },
      { id: 'b', label: L('ikkinchi', 'второе', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  holds: [4000, 3000, 6500, 4000],
  audio: [
    A('mount', 'Ikki kishi bitta tenglamani yechdi va turli javob oldi.', 'Двое решили одно и то же уравнение и получили разные ответы.', 'Two students solved the same equation and got different answers.'),
    A('r1', 'Birinchi javob: bitta ildiz, uch.', 'Первый ответ: один корень, тройка.', 'The first answer: one root, three.'),
    A('r2', "Ikkinchi javob: uch va minus uch. Kvadrat tenglama ikkita ildiz berdi, va ikkinchisi o'sha yerda qoldirilgan.", 'Второй ответ: тройка и минус тройка. Квадратное уравнение дало два корня, и второй там же и остался.', 'The second answer: three and minus three. The quadratic gave two roots, and the second one simply stayed there.'),
    A('ask', "Sizningcha qaysi javob to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какой ответ верный? Пока просто предположи.', 'Which answer do you think is correct? Just make a guess for now.'),
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
    "Bahsni hal qilishdan oldin uch narsani eslab olamiz. Ularsiz ildizni tekshirib bo'lmaydi. Bu baholanmaydi.",
    'Прежде чем решать спор, вспомним три вещи. Без них корень не проверить. Это не оценивается.',
    'Before settling the argument, let us recall three things. Without them the root cannot be checked. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Logarifm — daraja ko\'rsatkichi', 'Логарифм — это показатель степени', 'A logarithm is an exponent'),
      short: L('daraja ko\'rsatkichi', 'показатель степени', 'an exponent'),
      ex: [
        { e: 'log₂ 8 = 3', why: '2³ = 8' },
        { e: 'log₂ 4 = 2', why: '2² = 4' },
      ],
    },
    {
      id: 'c2',
      title: L('Logarifmlar yig\'indisi — ko\'paytmaning logarifmi', 'Сумма логарифмов — логарифм произведения', 'A sum of logarithms is the logarithm of a product'),
      short: L('yig\'indi — ko\'paytma', 'сумма — произведение', 'a sum is a product'),
      ex: [
        { e: 'log₂ 2 + log₂ 4 = log₂ 8', why: '2 · 4 = 8' },
      ],
    },
    {
      // Darsning BITTA gapi.
      id: 'c3',
      title: L('Logarifm ostida faqat musbat son', 'Под логарифмом только положительное', 'Only a positive number under a logarithm'),
      short: L('ostida faqat musbat', 'под логарифмом только плюс', 'only a plus under it'),
      ex: [
        { e: 'log₂ 8 = 3', why: L('sakkiz musbat', 'восемь положительно', 'eight is positive') },
        { e: 'log₂(−4)', why: L("bunday son YO'Q", 'такого числа НЕТ', 'there is NO such number') },
      ],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('log₂ 8 nechaga teng?', 'Чему равен log₂ 8 ?', 'What is log₂ 8 ?'),
      cols: 4,
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '4', hint: L("Ikkining to'rtinchi darajasi o'n olti.", 'Два в четвёртой это шестнадцать.', 'Two to the fourth is sixteen.') },
        { id: 'c', label: '8', hint: L("Sakkiz bu natija, ko'rsatkich emas.", 'Восемь это результат, а не показатель.', 'Eight is the result, not the exponent.') },
        { id: 'd', label: '2', hint: L("Ikkining kvadrati to'rt.", 'Два в квадрате это четыре.', 'Two squared is four.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L("log₃ 2 + log₃ 5 nimaga teng?", 'Чему равно log₃ 2 + log₃ 5 ?', 'What is log₃ 2 + log₃ 5 ?'),
      cols: 4,
      items: [
        { id: 'a', label: 'log₃ 10', correct: true },
        { id: 'b', label: 'log₃ 7', hint: L("Argumentlar qo'shilmaydi, ko'paytiriladi.", 'Аргументы не складываются, а перемножаются.', 'The arguments are not added, they are multiplied.') },
        { id: 'c', label: 'log₆ 10', hint: L("Asos o'zgarmaydi, u o'sha uch.", 'Основание не меняется, оно остаётся тройкой.', 'The base does not change, it stays three.') },
        { id: 'd', label: 'log₃ 2 · log₃ 5', hint: L("Ko'paytma logarifmlarning emas, argumentlarning ko'paytmasi.", 'Произведение не логарифмов, а аргументов.', 'The product is of the arguments, not of the logarithms.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L("Qaysi yozuvning MA'NOSI yo'q?", 'Какая запись НЕ ИМЕЕТ смысла?', 'Which expression is MEANINGLESS?'),
      cols: 4,
      items: [
        { id: 'a', label: 'log₂(−4)', correct: true },
        { id: 'b', label: 'log₂ 0,5', hint: L("Nol butun besh musbat, logarifm bor va u minus bir.", 'Нуль целых пять положительно, логарифм есть и он равен минус единице.', 'Zero point five is positive, the logarithm exists and equals minus one.') },
        { id: 'c', label: '−log₂ 4', hint: L("Bu logarifmning oldidagi minus, argumentdagi emas.", 'Это минус перед логарифмом, а не под ним.', 'That is a minus in front of the logarithm, not under it.') },
        { id: 'd', label: 'log₂ 1', hint: L("Bir musbat, va logarifm nolga teng.", 'Единица положительна, и логарифм равен нулю.', 'One is positive, and the logarithm equals zero.') },
      ],
    },
  ],
  holds: [4500, 8000, 7000, 9000, 6500, 6000],
  audio: [
    A('mount', 'Bahsni hal qilishdan oldin uch narsani tiklaymiz. Bu baho emas.', 'Прежде чем решать спор, восстановим три вещи. Это не оценка.', 'Before we settle the argument, let us restore three things. This is not graded.'),
    A('c1', "Birinchi tayanch. Logarifm bu daraja ko'rsatkichi. Ikkini uchinchi darajaga oshirsak sakkiz chiqadi, demak sakkizning logarifmi uch.", 'Первая опора. Логарифм это показатель степени. Два в третьей это восемь, значит логарифм восьми равен трём.', 'First basic. A logarithm is an exponent. Two to the third is eight, so the logarithm of eight is three.'),
    A('c2', "Ikkinchi tayanch. Logarifmlar yig'indisi bu ko'paytmaning logarifmi. Ikkining logarifmi plyus to'rtning logarifmi bu sakkizning logarifmi.", 'Вторая опора. Сумма логарифмов это логарифм произведения. Логарифм двух плюс логарифм четырёх это логарифм восьми.', 'Second basic. A sum of logarithms is the logarithm of a product. The logarithm of two plus the logarithm of four is the logarithm of eight.'),
    A('c3', "Uchinchi tayanch, va bugun eng muhimi. Logarifm ostida faqat musbat son turishi mumkin. Minus to'rtning logarifmi degan son YO'Q.", 'Третья опора, и сегодня она главная. Под логарифмом может стоять только положительное число. Логарифма минус четырёх не существует.', 'Third basic, and today the main one. Only a positive number can stand under a logarithm. There is no such thing as the logarithm of minus four.'),
    A('recap', "Qisqacha: logarifm bu ko'rsatkich, yig'indi bu ko'paytma, va ostida faqat musbat son.", 'Коротко: логарифм это показатель, сумма это произведение, и под ним только положительное.', 'Briefly: a logarithm is an exponent, a sum is a product, and only a positive number under it.'),
    A('tasks', "Endi tayanchlarni bitta tugmaga yig'aman. Endi uchta qisqa topshiriq.", 'Теперь я сворачиваю опоры в одну кнопку. Теперь три коротких задания.', 'Now I am folding the basics into one button. Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. Bahsni QO'YISH hal qiladi. Uchinchi nuqta -- ODZ chegarasi.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'check_by_point',
  eyebrow: L("Qo'yib tekshiramiz", 'Проверим подстановкой', 'Let us check by substitution'),
  title: L('Bahsni qo\'yish hal qiladi', 'Спор решает подстановка', 'Substitution settles it'),
  expr: EQ_HOOK,
  goal: L('chapda 3 chiqishi kerak', 'слева должно получиться 3', 'the left side must give 3'),
  rule: L(
    "Ildiz bo'lgan son to'g'ri javobning ichida bo'lishi shart. Va uni qo'yganda ikki logarifm ham MA'NOGA ega bo'lishi kerak.",
    'Число-корень обязано быть внутри верного ответа. И при подстановке оба логарифма обязаны иметь смысл.',
    'A number that is a root must be inside the correct answer. And after substitution both logarithms must make sense.',
  ),
  pick: L('Qaysi sonni qo\'yamiz?', 'Какое число подставим?', 'Which number shall we substitute?'),
  claims: [
    { id: 'a', key: 'inA', name: L('birinchi yechim', 'первое решение', 'first solution'), value: 'x = 3' },
    { id: 'b', key: 'inB', name: L('ikkinchi yechim', 'второе решение', 'second solution'), value: 'x = 3,  x = −3' },
  ],
  axis: AXIS_1,
  sets: [],
  points: [
    {
      id: 'p3', label: 'x = 3', num: '3', mark: 3, step: 'calc', verdict: 'in',
      role: L('ikki javobda ham bor', 'есть в обоих ответах', 'in both answers'),
      calc: 'log₂ 2 + log₂ 4 = 1 + 2 = 3',
      sol: true, inA: true, inB: true,
    },
    {
      id: 'pm3', label: 'x = −3', num: '−3', mark: -3, step: 'calc', verdict: 'out',
      role: L('faqat ikkinchisida', 'только во втором', 'only in the second'),
      calc: L("log₂(−4) — bunday son YO'Q", 'log₂(−4) — такого числа НЕТ', 'log₂(−4) — there is NO such number'),
      sol: false, inA: false, inB: true,
    },
    {
      id: 'p1', label: 'x = 1', num: '1', mark: 1, step: 'calc', verdict: 'out',
      role: L('chegara', 'граница', 'the boundary'),
      calc: L("log₂ 0 — bunday son ham YO'Q", 'log₂ 0 — такого числа тоже НЕТ', 'log₂ 0 — there is no such number either'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    items: [
      {
        id: 'a', label: 'x = 3', correct: true,
        ok: L("To'g'ri. Minus uch tenglamani qanoatlantirmaydi: unda logarifm umuman yo'q. Tekshirish usuli aynan shu.", 'Верно. Минус тройка уравнению не удовлетворяет: при ней логарифма попросту нет. Это и есть способ проверки.', 'Correct. Minus three does not satisfy the equation: at that value the logarithm does not exist. That is the way to check.'),
      },
      {
        id: 'b', label: 'x = 3,  x = −3',
        hint: L("Minus uchni qo'ying. Birinchi logarifm ostida minus to'rt chiqadi, bunday son esa yo'q. Demak minus uch ildiz bo'lolmaydi, bu javobga esa u kiradi.", 'Подставь минус тройку. Под первым логарифмом получается минус четыре, а такого числа нет. Значит минус тройка корнем быть не может, а в этот ответ она входит.', 'Substitute minus three. Under the first logarithm you get minus four, and there is no such number. So minus three cannot be a root, yet this answer contains it.'),
      },
    ],
  },
  holds: [2500, 8000, 1500, 2500, 13000, 4500],
  audio: [
    A('mount', 'Tayanch tiklandi. Bahsga qaytamiz.', 'Опора восстановлена. Вернёмся к спору.', 'The basics are back. Let us return to the argument.'),
    A('mount', "Bahs son bilan hal qilinadi. Ildizni boshlang'ich tenglamaga qo'yamiz: chapda uch chiqishi kerak, va ikkala logarifm ham ma'noga ega bo'lishi kerak.", 'Спор решается числом. Подставим корень в исходное уравнение: слева должно получиться три, и оба логарифма обязаны иметь смысл.', 'The argument is settled by a number. Substitute the root into the original equation: the left side must give three, and both logarithms must make sense.'),
    A('mount', "Sonni tanlang.", 'Выбери число.', 'Pick a number.'),
    A('calc', 'Hisoblaymiz.', 'Считаем.', 'We compute.'),
    A('mark', "Uch son tekshirildi. Uch ildiz: chapda bir plyus ikki, ya'ni uch. Minus uch ildiz emas: logarifm ostida minus to'rt chiqadi. Va bir ham ildiz emas: u yerda logarifm ostida nol, nolning logarifmi ham yo'q.", 'Три числа проверены. Тройка корень: слева один плюс два, то есть три. Минус тройка не корень: под логарифмом минус четыре. И единица не корень: там под логарифмом ноль, а логарифма нуля тоже нет.', 'Three numbers checked. Three is a root: the left side is one plus two, that is three. Minus three is not a root: under the logarithm you get minus four. And one is not a root either: there the argument is zero, and there is no logarithm of zero.'),
    A('next', 'Bitta son ikki javobni ajratdi. Qaysi biri to\'g\'ri?', 'Одно число развело два ответа. Какой из них верный?', 'One number separated the two answers. Which of them is correct?'),
  ],
}

// ============================================================
// SLAYD 4. GRAFIK. Chapda kirivi YO'Q, lekin pastga u cheksiz ketadi.
// ============================================================
const LOG2 = (x) => Math.log(x) / Math.log(2)

const S4 = {
  role: 'graph',
  tag: 'log_domain',
  drag: false,
  eyebrow: L('Bu tenglama qayerda yashaydi', 'Где живёт это уравнение', 'Where this equation lives'),
  title: L('Chapda chiziq yo\'q', 'Слева кривой нет', 'There is no curve on the left'),
  chip: 'y = log₂ x',
  graph: {
    fn: LOG2,
    xDomain: [-1.5, 11],
    yDomain: [-6, 4.5],
    asymptote: 0,
    hline: 3,
    cross: 8,
    drop: true,
    dropLabel: 'x = 8',
    xTicks: [{ v: 0 }, { v: 1 }, { v: 8 }],
    yTicks: [{ v: 0 }, { v: 3 }, { v: -5 }],
    height: 168,
  },
  bonus: L(
    "Shu sababli kalkulyator manfiy sondan logarifm so'ralganda xato yozadi: bu son yo'q, kalkulyator esa uni o'ylab topa olmaydi.",
    'Поэтому калькулятор пишет ошибку, когда просят логарифм отрицательного: такого числа нет, а придумать его калькулятор не может.',
    'That is why a calculator reports an error for the logarithm of a negative number: no such number exists, and the calculator cannot invent one.',
  ),
  probe: {
    question: L('log₂ x = −5 ning nechta yechimi bor?', 'Сколько решений у log₂ x = −5 ?', 'How many solutions does log₂ x = −5 have?'),
    items: [
      { id: 'a', label: L('bitta', 'одно', 'one'), correct: true },
      { id: 'b', label: L("bitta ham yo'q", 'ни одного', 'none'), hint: L("Manfiy bo'lolmaydigan narsa ARGUMENT. Logarifmning o'zi manfiy bo'lishi mumkin: chiziq pastga cheksiz ketadi.", 'Отрицательным не может быть АРГУМЕНТ. Само значение логарифма отрицательным быть может: кривая уходит вниз без конца.', 'It is the ARGUMENT that cannot be negative. The value of the logarithm can be negative: the curve goes down without end.') },
      { id: 'c', label: L('ikkita', 'два', 'two'), hint: L("Chiziq monoton: u bitta qiymatdan ikki marta o'tolmaydi.", 'Кривая монотонна: она не может пройти через одно значение дважды.', 'The curve is monotone: it cannot pass through one value twice.') },
      { id: 'd', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p yechim to'g'ri chiziq egri bilan ustma-ust tushganda bo'lardi.", 'Бесконечно много было бы, если бы прямая совпала с кривой.', 'Infinitely many would mean the line coincides with the curve.') },
    ],
  },
  holds: [5000, 6500, 3500, 5000, 8000],
  audio: [
    A('mount', "Qo'yish qaysi javob to'g'ri ekanini ko'rsatdi. Endi buni chizmada ko'ramiz.", 'Подстановка показала, какой ответ верный. Теперь посмотрим на это в чертеже.', 'The substitution showed which answer is correct. Now let us look at it in the drawing.'),
    A('curve', "Mana chiziq. Diqqat qiling: noldan chapda u umuman yo'q. Manfiy sonning logarifmi yo'q ekani shu.", 'Вот кривая. Обрати внимание: левее нуля её нет совсем. Это и значит, что логарифма отрицательного числа не существует.', 'Here is the curve. Notice: to the left of zero it does not exist at all. That is what it means that there is no logarithm of a negative number.'),
    A('line', "Endi uch balandligida to'g'ri chiziq. Kesishish bitta.", 'Теперь прямая на высоте три. Пересечение одно.', 'Now a line at height three. There is one intersection.'),
    A('drop', "Uning o'qdagi soyasi sakkiz. Bu tenglamaning ildizi shu son.", 'Его тень на оси это восьмёрка. Это корень уравнения логарифм икс по основанию два равен трём.', 'Its shadow on the axis is eight. That is the root of the equation.'),
    A('none', "Endi eng muhimi. Chiziq pastga qarab cheksiz ketadi, ya'ni logarifmning o'zi manfiy BO'LISHI MUMKIN. Musbat bo'lishi shart bo'lgan narsa argument, javob emas.", 'А теперь главное. Кривая уходит вниз без конца, то есть само значение логарифма отрицательным БЫТЬ МОЖЕТ. Положительным обязан быть аргумент, а не ответ.', 'And now the main thing. The curve goes down without end, so the value of the logarithm CAN be negative. It is the argument that must be positive, not the answer.'),
  ],
}

// ============================================================
// SLAYD 5. 1-QOIDA.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'log_domain',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Yig\'indidan ko\'paytmaga', 'От суммы к произведению', 'From a sum to a product'),
  rows: [EQ_HOOK, 'log₂((x − 1)(x + 1)) = 3', 'x² − 1 = 8'],
  probe: {
    question: L(
      "Uchinchi satrga qanday o'tildi?",
      'Как получилась третья строка?',
      'How did the third line appear?',
    ),
    items: [
      { id: 'a', label: L('uch — bu log₂ 8, demak argumentlar teng', 'три — это log₂ 8, значит аргументы равны', 'three is log₂ 8, so the arguments are equal'), correct: true },
      { id: 'b', label: L("logarifm shunchaki tashlab yuborildi", 'логарифм просто отбросили', 'the logarithm was simply dropped'), hint: L("Shunchaki tashlab bo'lmaydi. O'ngdagi uchni sakkizning logarifmi qilib yozdik, keyin argumentlarni tenglashtirdik.", 'Просто отбросить нельзя. Мы записали тройку справа как логарифм восьми, и потом приравняли аргументы.', 'You cannot simply drop it. We wrote the three on the right as the logarithm of eight, and then equated the arguments.') },
      { id: 'c', label: L("uch ikkinchi tomonga ko'chirildi", 'тройку перенесли в другую часть', 'the three was moved to the other side'), hint: L("Ko'chirish bu qo'shish va ayirish uchun. Bu yerda daraja ishlaydi.", 'Перенос это про сложение и вычитание. Здесь работает степень.', 'Moving terms is about addition. Here a power is at work.') },
      { id: 'd', label: L("ikki tomon uchga bo'lindi", 'обе части разделили на три', 'both sides were divided by three'), hint: L("Bo'lish bo'lgani yo'q. Uch bu logarifmning QIYMATI.", 'Деления не было. Тройка это ЗНАЧЕНИЕ логарифма.', 'There was no division. Three is the VALUE of the logarithm.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Logarifmdan argumentga', 'Правило 1. От логарифма к аргументу', 'Rule 1. From logarithm to argument'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'logₐ f(x) = c  ⟺  f(x) = aᶜ,   f(x) > 0',
    lines: [
      L("logarifmlar yig'indisini ko'paytmaning logarifmiga yig'", 'сверни сумму логарифмов в логарифм произведения', 'fold the sum of logarithms into the logarithm of a product'),
      L("o'ngdagi sonni logarifm qil: c = logₐ aᶜ", 'сделай из числа справа логарифм: c = logₐ aᶜ', 'turn the number on the right into a logarithm: c = logₐ aᶜ'),
      L('argumentlarni tenglashtir', 'приравняй аргументы', 'set the arguments equal'),
      L('har bir ildizni boshlang\'ich tenglamaga qo\'yib tekshir', 'проверь каждый корень подстановкой в исходное', 'check every root by substituting into the original'),
    ],
    example: L('misol:  log₂(x − 1) + log₂(x + 1) = 3  →  x = 3', 'пример:  log₂(x − 1) + log₂(x + 1) = 3  →  x = 3', 'example:  log₂(x − 1) + log₂(x + 1) = 3  →  x = 3'),
  },
  holds: [4000, 7000, 5000],
  audio: [
    A('mount', "Chizmani ko'rdik. Endi yechimni yozuv bilan olamiz.", 'Чертёж мы увидели. Теперь получим решение записью.', 'We have seen the drawing. Now let us get the solution in writing.'),
    A('fold', "Chapda ikki logarifm qo'shilyapti. Yig'indi bu ko'paytmaning logarifmi, demak qavs ichida iks minus bir karra iks plyus bir.", 'Слева складываются два логарифма. Сумма это логарифм произведения, значит в скобках икс минус один умножить на икс плюс один.', 'On the left two logarithms are added. A sum is the logarithm of a product, so in the brackets we get x minus one times x plus one.'),
    A('open', "Qavsni ochamiz: iks kvadrat minus bir. O'ngda uch turibdi, va uch bu sakkizning logarifmi.", 'Раскрываем скобки: икс в квадрате минус один. Справа стоит три, а три это логарифм восьми.', 'We expand: x squared minus one. On the right there is three, and three is the logarithm of eight.'),
    A('rule', "To'g'ri. Asoslar bir xil, demak argumentlar teng. Iks kvadrat minus bir teng sakkiz.", 'Верно. Основания одинаковые, значит равны аргументы. Икс в квадрате минус один равно восьми.', 'Correct. The bases are the same, so the arguments are equal. x squared minus one equals eight.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: manfiy ildiz -- va u TO'G'RI.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'log_domain',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Manfiy ildiz har doim ortiqcha emas', 'Отрицательный корень не всегда лишний', 'A negative root is not always extraneous'),
  was: { label: UI.was, expr: EQ_HOOK },
  now: { label: UI.now, expr: EQ_NEW },
  probe1: {
    question: L('Ikkinchi yozuv birinchisidan nimasi bilan farq qiladi?', 'Чем вторая запись отличается от первой?', 'How does the second record differ from the first?'),
    items: [
      { id: 'a', label: L('logarifm bitta, ostida esa kvadrat uchhad', 'логарифм один, а под ним квадратный трёхчлен', 'one logarithm, with a quadratic under it'), correct: true },
      { id: 'b', label: L('asos boshqa', 'основание другое', 'the base is different'), hint: L("Asos o'sha ikki. Logarifm ostiga qarang.", 'Основание то же, двойка. Смотри под логарифм.', 'The base is the same, two. Look under the logarithm.') },
      { id: 'c', label: L("o'ngda boshqa son", 'справа другое число', 'a different number on the right'), hint: L("O'ngda o'sha uch turibdi.", 'Справа стоит та же тройка.', 'The same three is on the right.') },
      { id: 'd', label: L('tenglama chiziqli', 'уравнение линейное', 'the equation is linear'), hint: L("Aksincha: logarifm ostida kvadrat, ya'ni ikkita ildiz kutilyapti.", 'Наоборот: под логарифмом квадрат, то есть ждём два корня.', 'On the contrary: there is a square under the logarithm, so we expect two roots.') },
    ],
  },
  probe2: {
    question: L('Nechta ildiz javobda qoladi?', 'Сколько корней останется в ответе?', 'How many roots will remain in the answer?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: L('ikkita', 'два', 'two') },
      { id: 'b', label: L('bitta, musbati', 'один, положительный', 'one, the positive') },
      { id: 'c', label: L('bitta, manfiysi', 'один, отрицательный', 'one, the negative') },
      { id: 'd', label: L("bitta ham yo'q", 'ни одного', 'none') },
    ],
  },
  holds: [4500, 8000, 3500, 3500],
  audio: [
    A('mount', "Birinchi qoida tayyor. Endi diqqat: bu yerda tuzoq bor.", 'Первое правило готово. Теперь внимание: здесь ловушка.', 'The first rule is ready. Now pay attention: there is a trap here.'),
    A('now', "Logarifm bitta, lekin uning ostida kvadrat uchhad. Demak argumentlar tenglashtirilganda kvadrat tenglama chiqadi va ikkita ildiz bo'ladi.", 'Логарифм один, но под ним квадратный трёхчлен. Значит после приравнивания аргументов получится квадратное уравнение и два корня.', 'There is one logarithm, but a quadratic under it. So equating the arguments gives a quadratic and two roots.'),
    A('q1', 'Bu yozuv oldingisidan nimasi bilan farq qiladi?', 'Чем эта запись отличается от прежней?', 'How does this record differ from the previous one?'),
    A('q2', "Sizningcha nechta ildiz javobda qoladi? Shunchaki taxmin qiling.", 'Как думаешь, сколько корней останется в ответе? Просто предположи.', 'How many roots do you think will remain? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI ILDIZ, IKKALASI HAM QOLADI.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'log_domain',
  eyebrow: L('Ikkisini ham tekshiramiz', 'Проверим оба', 'Let us check both'),
  title: L('Ikkala ildiz ham qoladi', 'Оба корня остаются', 'Both roots remain'),
  expr: 'log₂(x² + 4x + 3) = 3   →   x² + 4x + 3 = 8   →   x = −5,  x = 1',
  axis: AXIS_2,
  need: 'f(x) > 0',
  answerLabel: L('ikkisi ham', 'оба', 'both'),
  cards: [
    {
      tag: L('birinchi ildiz', 'первый корень', 'first root'),
      txt: 'x = −5',
      mark: -5,
      point: {
        label: 'x² + 4x + 3',
        calc: '25 − 20 + 3 = 8',
        verdict: 'in',
      },
    },
    {
      tag: L('ikkinchi ildiz', 'второй корень', 'second root'),
      txt: 'x = 1',
      mark: 1,
      point: {
        label: 'x² + 4x + 3',
        calc: '1 + 4 + 3 = 8',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    slots: 2,
    numbers: ['−5', '−3', '0', '1', '3'],
    value: ['−5', '1'],
    prompt: L('Ikkala ildizni yozing', 'Запиши оба корня', 'Write both roots'),
    wrongs: [
      { key: '1', hint: L("Minus beshni ham tekshiring: argument yigirma besh minus yigirma plyus uch, ya'ni sakkiz. Sakkiz musbat, demak ildiz qoladi.", 'Проверь и минус пять: аргумент это двадцать пять минус двадцать плюс три, то есть восемь. Восемь положительно, значит корень остаётся.', 'Check minus five as well: the argument is twenty five minus twenty plus three, that is eight. Eight is positive, so the root stays.') },
      { key: '−5', hint: L("Birni ham tekshiring: argument bir plyus to'rt plyus uch, ya'ni sakkiz. U ham qoladi.", 'Проверь и единицу: аргумент это один плюс четыре плюс три, то есть восемь. Она тоже остаётся.', 'Check one as well: the argument is one plus four plus three, that is eight. It stays too.') },
      { key: '*', hint: L("Musbat bo'lishi kerak bo'lgan narsa ARGUMENT. Ikkala ildizda ham u sakkizga teng.", 'Положительным обязан быть АРГУМЕНТ. При обоих корнях он равен восьми.', 'It is the ARGUMENT that must be positive. At both roots it equals eight.') },
    ],
  },
  holds: [3000, 8000, 6500, 5000],
  audio: [
    A('mount', 'Siz taxmin qildingiz. Endi ikkala ildizni ham tekshiramiz.', 'Прогноз есть. Проверим оба корня.', 'You made a guess. Now let us check both roots.'),
    A('p1', "Birinchi ildiz minus besh. Diqqat: tekshirish kerak bo'lgan narsa iks emas, ARGUMENT. Yigirma besh minus yigirma plyus uch, bu sakkiz. Sakkiz musbat, demak minus besh qoladi.", 'Первый корень минус пять. Внимание: проверять надо не икс, а АРГУМЕНТ. Двадцать пять минус двадцать плюс три, это восемь. Восемь положительно, значит минус пять остаётся.', 'The first root is minus five. Note: what we check is not x but the ARGUMENT. Twenty five minus twenty plus three, that is eight. Eight is positive, so minus five stays.'),
    A('p2', "Ikkinchi ildiz bir. Argument bir plyus to'rt plyus uch, ham sakkiz. Bu ham qoladi.", 'Второй корень единица. Аргумент один плюс четыре плюс три, тоже восемь. Она тоже остаётся.', 'The second root is one. The argument is one plus four plus three, also eight. It stays too.'),
    A('write', "Ikkala ildiz ham qoladi. Manfiy bo'lgani hech narsani anglatmaydi. Javobni yozing.", 'Оба корня остаются. То, что один отрицательный, само по себе ничего не значит. Запиши ответ.', 'Both roots remain. That one of them is negative means nothing by itself. Write the answer.'),
  ],
}

// ============================================================
// SLAYD 8. 2-QOIDA va JAMLANMA.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'log_domain',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Nimani tekshiramiz', 'Что именно проверяем', 'What exactly we check'),
  cases: [
    {
      label: L('3-ekran', 'экран 3', 'screen 3'),
      text: L('x = −3 tushib qoldi: argument −4', 'x = −3 отпал: аргумент −4', 'x = −3 dropped: the argument is −4'),
      tone: 'accent',
    },
    {
      label: L('7-ekran', 'экран 7', 'screen 7'),
      text: L('x = −5 qoldi: argument 8', 'x = −5 остался: аргумент 8', 'x = −5 stayed: the argument is 8'),
      tone: 'graph',
    },
  ],
  rows: ['x = −3  →  log₂(−4)  ✗', 'x = −5  →  log₂ 8  ✓'],
  probe: {
    question: L("Ikki holat ham manfiy ildiz. Nega biri tushdi, ikkinchisi qoldi?", 'В обоих случаях корень отрицательный. Почему один отпал, а другой остался?', 'In both cases the root is negative. Why did one drop and the other stay?'),
    items: [
      { id: 'a', label: L("musbat bo'lishi kerak bo'lgan narsa argument, iks emas", 'положительным обязан быть аргумент, а не икс', 'it is the argument that must be positive, not x'), correct: true },
      { id: 'b', label: L('birinchi tenglamada ikki logarifm bor edi', 'в первом уравнении было два логарифма', 'the first equation had two logarithms'), hint: L("Logarifmlar soni hal qilmaydi. Har birining ostida nima turganiga qarang.", 'Число логарифмов не решает. Смотри, что стоит под каждым.', 'The number of logarithms does not decide. Look at what stands under each.') },
      { id: 'c', label: L('ikkinchi ildiz kattaroq', 'второй корень больше по модулю', 'the second root is larger'), hint: L("Ildizning kattaligi ahamiyatsiz. Argumentning ishorasi muhim.", 'Величина корня ни при чём. Важен знак аргумента.', 'The size of the root is irrelevant. The sign of the argument matters.') },
      { id: 'd', label: L('tasodif', 'это случайность', 'it is a coincidence'), hint: L("Tasodif emas: ikkala holatda ham argument hisoblab ko'rilgan.", 'Не случайность: в обоих случаях аргумент посчитан.', 'Not a coincidence: in both cases the argument was computed.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Argumentni tekshir', 'Правило 2. Проверяй аргумент', 'Rule 2. Check the argument'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'f(x) > 0',
    lines: [
      L("har bir ildizni boshlang'ich tenglamaga qo'y", 'подставь каждый корень в исходное уравнение', 'substitute every root into the original equation'),
      L("logarifm ostidagi ifodani HISOBLA", 'ВЫЧИСЛИ выражение под логарифмом', 'COMPUTE the expression under the logarithm'),
      L("musbat bo'lsa — ildiz qoladi, nol yoki manfiy bo'lsa — tushadi", 'положительно — корень остаётся, ноль или минус — отпадает', 'positive — the root stays, zero or negative — it drops'),
      L("iksning ishorasi o'z-o'zidan hech narsani anglatmaydi", 'знак самого икса сам по себе не значит ничего', 'the sign of x itself means nothing'),
    ],
    example: L('misol:  x = −5,  argument = 8  →  qoladi', 'пример:  x = −5,  аргумент = 8  →  остаётся', 'example:  x = −5,  argument = 8  →  it stays'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'logₐ f(x) = c  ⟺  f(x) = aᶜ,   f(x) > 0',
    lines: [
      L("1. yig'indini ko'paytmaga yig'", '1. сверни сумму в произведение', '1. fold the sum into a product'),
      L('2. argumentlarni tenglashtir', '2. приравняй аргументы', '2. set the arguments equal'),
      L("3. har bir ildizda ARGUMENTni hisobla", '3. посчитай АРГУМЕНТ при каждом корне', '3. compute the ARGUMENT at every root'),
      L("4. argument musbat bo'lgan ildizlarni javobga yoz", '4. в ответ пиши корни, при которых аргумент положителен', '4. write the roots where the argument is positive'),
    ],
  },
  holds: [4500, 5500, 6000, 5000],
  audio: [
    A('mount', "Ikki ekranda ikki manfiy ildiz ko'rdik. Biri tushdi, ikkinchisi qoldi.", 'На двух экранах мы видели два отрицательных корня. Один отпал, другой остался.', 'On two screens we saw two negative roots. One dropped, the other stayed.'),
    A('rows', "Minus uchda logarifm ostida minus to'rt chiqdi. Minus beshda esa sakkiz.", 'При минус трёх под логарифмом получилось минус четыре. А при минус пяти восемь.', 'At minus three the argument came out minus four. At minus five it came out eight.'),
    A('q', "Ikkalasi ham manfiy ildiz edi. Nega biri tushdi, ikkinchisi qoldi?", 'Оба корня были отрицательные. Почему же один отпал, а другой остался?', 'Both roots were negative. So why did one drop and the other stay?'),
    A('rule', "To'g'ri. Musbat bo'lishi shart bo'lgan narsa argument. Iksning ishorasi o'z-o'zidan hech narsani anglatmaydi.", 'Верно. Положительным обязан быть аргумент. Знак самого икса сам по себе не значит ничего.', 'Correct. It is the argument that must be positive. The sign of x itself means nothing.'),
    A('both', 'Endi butun usulni bitta qoidaga yig\'ing.', 'А теперь собери весь способ в одно правило.', 'Now combine the whole method into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. NIMA MUSBAT BO'LISHI KERAK.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'log_domain',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Nima noldan katta?', 'Что больше нуля?', 'What is greater than zero?'),
  left: 'log₅(x − 2) = 1',
  template: [{ slot: 0 }, ' > 0'],
  signs: ['x', 'x − 2', '5'],
  answer: 'x − 2',
  checkNote: L(
    "Tekshiruv: x = 7, argument 5, va 5 > 0",
    'Проверка: x = 7, аргумент 5, и 5 > 0',
    'Check: x = 7, the argument is 5, and 5 > 0',
  ),
  wrongs: [
    { key: 'x', hint: L("Iks emas, logarifm OSTIDAGI ifoda. Ular har xil: x = 1 da iks musbat, argument esa minus bir.", 'Не икс, а выражение ПОД логарифмом. Они разные: при x = 1 икс положителен, а аргумент минус один.', 'Not x, but the expression UNDER the logarithm. They differ: at x = 1 x is positive while the argument is minus one.') },
    { key: '5', hint: L("Besh bu ASOS, u har doim musbat va shart talab qilmaydi.", 'Пять это ОСНОВАНИЕ, оно всегда положительно и условия не требует.', 'Five is the BASE, it is always positive and needs no condition.') },
  ],
  probe: {
    question: L("Nima uchun aynan shu ifoda?", 'Почему именно это выражение?', 'Why exactly this expression?'),
    items: [
      { id: 'a', label: L("chunki u logarifm ostida turibdi", 'потому что оно стоит под логарифмом', 'because it stands under the logarithm'), correct: true },
      { id: 'b', label: L("chunki unda iks bor", 'потому что в нём есть икс', 'because it contains x'), hint: L("Iks o'ngda ham bo'lishi mumkin, lekin shart faqat argumentga qo'yiladi.", 'Икс может быть и справа, но условие ставится только на аргумент.', 'x may appear on the right too, but the condition applies only to the argument.') },
      { id: 'c', label: L('chunki u kichikroq', 'потому что оно меньше', 'because it is smaller'), hint: L("Kattalik ahamiyatsiz. Muhimi qayerda turgani.", 'Величина ни при чём. Важно, где оно стоит.', 'Size is irrelevant. What matters is where it stands.') },
      { id: 'd', label: L("chunki asos besh", 'потому что основание пять', 'because the base is five'), hint: L("Asos boshqa bo'lsa ham shart o'sha argumentga qolardi.", 'При любом другом основании условие осталось бы на том же аргументе.', 'With any other base the condition would stay on the same argument.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Nima noldan katta bo'lishi shart? Ifodani tanlang.", 'Что обязано быть больше нуля? Выбери выражение.', 'What must be greater than zero? Choose the expression.'),
    A('checked', "Bo'ldi. Endi ta'riflang: nima uchun aynan shu?", 'Получилось. Теперь сформулируй: почему именно оно?', 'Done. Now put it into words: why exactly this one?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'fold', label: L("o'ngdagi yig'indini bitta logarifmga yig'ish", 'свернуть сумму справа в один логарифм', 'fold the sum on the right into one logarithm') },
  { id: 'drop', label: L('argumentlarni tenglashtirish', 'приравнять аргументы', 'set the arguments equal') },
  { id: 'check', label: L('ildizni tekshirish', 'проверить корень', 'check the root') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'check_by_point',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: 'log₃ x = log₃ 1,5 + log₃ 8',
  actions: ACTIONS_10,
  steps: [
    {
      action: 'fold',
      to: 'log₃ x = log₃ 12',
      wrongs: [
        { action: 'drop', hint: L("O'ngda hozircha ikki logarifm. Avval ularni bittaga yig'ing.", 'Справа пока два логарифма. Сначала сверни их в один.', 'There are still two logarithms on the right. Fold them into one first.') },
        { action: 'check', hint: L("Tekshiradigan ildiz hali yo'q.", 'Проверять пока нечего: корня ещё нет.', 'There is nothing to check yet: there is no root.') },
      ],
    },
    {
      action: 'drop',
      to: 'x = 12',
      wrongs: [
        { action: 'fold', hint: L("Yig'indi allaqachon yig'ilgan.", 'Сумма уже свёрнута.', 'The sum is already folded.') },
        { action: 'check', hint: L("Avval argumentlarni tenglashtiring.", 'Сначала приравняй аргументы.', 'First set the arguments equal.') },
      ],
    },
    {
      action: 'check',
      to: L('argument 12 > 0 — ildiz qoladi', 'аргумент 12 > 0 — корень остаётся', 'the argument 12 > 0 — the root stays'),
      wrongs: [
        { action: 'fold', hint: L("Logarifm qolmadi.", 'Логарифмов больше нет.', 'There are no logarithms left.') },
        { action: 'drop', hint: L("Argumentlar allaqachon tenglashtirilgan.", 'Аргументы уже приравнены.', 'The arguments are already equated.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['1,5', '8', '9,5', '12'],
    value: ['12'],
    prompt: L('Ildizni imtihonda yozganingizdek yozing', 'Запиши корень так, как пишут на экзамене', 'Write the root the way you would on the exam'),
    wrongs: [
      { key: '9,5', hint: L("Argumentlar qo'shilmaydi, ko'paytiriladi: bir yarim karra sakkiz.", 'Аргументы не складываются, а перемножаются: полтора умножить на восемь.', 'The arguments are not added, they are multiplied: one and a half times eight.') },
      { key: '*', hint: L("Oxirgi satrga qarang.", 'Смотри на последнюю строку.', 'Look at the last line.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi bu misolni to\'liq o\'tamiz.', 'Правило сформулировано. Пройдём этот пример целиком.', 'The rule is yours now. Let us go through this example completely.'),
    A('start', "O'ngda ikki logarifm qo'shilyapti. Nimadan boshlashni tanlang.", 'Справа складываются два логарифма. Выбери, с чего начать.', 'On the right two logarithms are added. Choose where to start.'),
    A('step4', 'Endi ildizni yozing.', 'Теперь запиши корень.', 'Now write the root.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL. Kvadrat logarifm -- ikkita ildiz.
// ============================================================
const ACTIONS_11 = [
  { id: 'subst', label: L('almashtirish t = lg x', 'замена t = lg x', 'substitute t = lg x') },
  { id: 'solveQ', label: L('t uchun tenglamani yechish', 'решить уравнение для t', 'solve the equation for t') },
  { id: 'back', label: L('iksga qaytish', 'вернуться к иксу', 'go back to x') },
]

const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'equal_roots',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Tenglamani yeching', 'Реши уравнение', 'Solve the equation'),
  start: 'lg² x = 1',
  actions: ACTIONS_11,
  hint: L(
    "Kvadrat ikkita qiymat beradi: musbat ham, manfiy ham. Ikkalasi ham iks beradi.",
    'Квадрат даёт два значения: и положительное, и отрицательное. Оба дают икс.',
    'A square gives two values, positive and negative. Both give an x.',
  ),
  steps: [
    {
      action: 'subst',
      to: 't² = 1,   t = lg x',
      wrongs: [
        { action: 'solveQ', hint: L("Avval almashtirish kiriting.", 'Сначала введи замену.', 'Introduce the substitution first.') },
        { action: 'back', hint: L("Qaytadigan joy yo'q: hali almashtirmadik.", 'Возвращаться некуда: замены ещё не было.', 'There is nowhere to go back to: there was no substitution yet.') },
      ],
    },
    {
      action: 'solveQ',
      to: 't = 1,   t = −1',
      wrongs: [
        { action: 'subst', hint: L('Almashtirish allaqachon kiritilgan.', 'Замена уже введена.', 'The substitution is already introduced.') },
        { action: 'back', hint: L("Avval te ning ikkala qiymatini toping.", 'Сначала найди оба значения тэ.', 'First find both values of t.') },
      ],
    },
    {
      action: 'back',
      to: 'lg x = 1,   lg x = −1',
      wrongs: [
        { action: 'subst', hint: L('Almashtirish allaqachon kiritilgan.', 'Замена уже введена.', 'The substitution is already introduced.') },
        { action: 'solveQ', hint: L("Te topildi. Endi iksga qayting.", 'Тэ найдено. Теперь вернись к иксу.', 't is found. Now go back to x.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    slots: 2,
    numbers: ['−10', '−1', '0,1', '1', '10'],
    value: ['0,1', '10'],
    prompt: L('Ikkala ildizni yozing', 'Запиши оба корня', 'Write both roots'),
    wrongs: [
      { key: '10', hint: L("Ikkinchi qiymatni ham oling: lg x minus birga teng bo'lsa, x nol butun bir o'ndan.", 'Возьми и второе значение: если lg x равен минус единице, то x это нуль целых одна десятая.', 'Take the second value as well: if lg x equals minus one, then x is zero point one.') },
      { key: '−1|1', hint: L("Minus bir va bir bu TE ning qiymatlari, iksning emas. Iksga qayting.", 'Минус единица и единица это значения ТЭ, а не икса. Вернись к иксу.', 'Minus one and one are values of t, not of x. Go back to x.') },
      { key: '−10|10', hint: L("Manfiy iks bo'lolmaydi: logarifm ostida faqat musbat son.", 'Отрицательный икс невозможен: под логарифмом только положительное.', 'A negative x is impossible: only a positive number under the logarithm.') },
      { key: '*', hint: L("Ikkala qiymatdan ham iks chiqadi: o'n va nol butun bir o'ndan.", 'Из обоих значений получается икс: десять и нуль целых одна десятая.', 'Both values give an x: ten and zero point one.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Logarifm kvadratga oshirilgan. Bunday holatda almashtirish yordam beradi.", 'Логарифм возведён в квадрат. В таком случае помогает замена.', 'The logarithm is squared. In such a case a substitution helps.'),
    A('answered', "Javobni yozing. Ildiz ikkita bo'lsa, ikkisini ham.", 'Запиши ответ. Если корней два, то оба.', 'Write the answer. If there are two roots, write both.'),
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
      id: 'b1', tag: 'log_domain', prompt: 'log₂(x − 3) = 2', cols: 4,
      items: [
        { id: 'a', label: 'x = 7', correct: true },
        { id: 'b', label: 'x = 4', hint: L("Ikkining kvadrati to'rt, demak iks minus uch to'rtga teng.", 'Два в квадрате это четыре, значит икс минус три равно четырём.', 'Two squared is four, so x minus three equals four.') },
        { id: 'c', label: 'x = 1', hint: L("Bir da argument minus ikki chiqadi, logarifm yo'q.", 'При единице аргумент получается минус два, логарифма нет.', 'At one the argument is minus two, there is no logarithm.') },
        { id: 'd', label: 'x = 5', hint: L("Beshda argument ikki, va ikkining logarifmi bir, ikki emas.", 'При пятёрке аргумент два, а логарифм двух равен единице, а не двум.', 'At five the argument is two, and its logarithm is one, not two.') },
      ],
    },
    {
      id: 'b2', tag: 'equal_roots', ask: true, cols: 4,
      done: L('ortiqcha ildiz:  x = −3', 'посторонний корень:  x = −3', 'extraneous root:  x = −3'),
      prompt: L(
        "lg(x − 2) + lg(x + 2) = lg 5 uchun qaysi ildiz ORTIQCHA?",
        'Какой корень ПОСТОРОННИЙ для lg(x − 2) + lg(x + 2) = lg 5 ?',
        'Which root is EXTRANEOUS for lg(x − 2) + lg(x + 2) = lg 5 ?',
      ),
      items: [
        { id: 'a', label: 'x = −3', correct: true },
        { id: 'b', label: 'x = 3', hint: L("Uchda argumentlar bir va besh, ikkalasi ham musbat. Bu ildiz qoladi.", 'При тройке аргументы один и пять, оба положительны. Этот корень остаётся.', 'At three the arguments are one and five, both positive. This root stays.') },
        { id: 'c', label: L('ikkisi ham', 'оба', 'both'), hint: L("Uchni tekshiring: ikkala argument ham musbat chiqadi.", 'Проверь тройку: оба аргумента получаются положительными.', 'Check three: both arguments come out positive.') },
        { id: 'd', label: L('hech qaysi', 'ни один', 'neither'), hint: L("Minus uchni tekshiring: birinchi argument minus besh.", 'Проверь минус тройку: первый аргумент минус пять.', 'Check minus three: the first argument is minus five.') },
      ],
    },
    {
      id: 'b3', tag: 'log_domain', prompt: 'log₅ x = −2', cols: 4,
      items: [
        { id: 'a', label: 'x = 1/25', correct: true },
        { id: 'b', label: L("yechim yo'q", 'решений нет', 'no solutions'), hint: L("Manfiy bo'lolmaydigan narsa argument. Logarifmning qiymati manfiy bo'lishi mumkin.", 'Отрицательным не может быть аргумент. Значение логарифма отрицательным быть может.', 'It is the argument that cannot be negative. The value of a logarithm can be negative.') },
        { id: 'c', label: 'x = −25', hint: L("Logarifm ostida manfiy son turolmaydi.", 'Под логарифмом отрицательное число стоять не может.', 'A negative number cannot stand under a logarithm.') },
        { id: 'd', label: 'x = 25', hint: L("Beshning kvadrati yigirma besh, lekin ko'rsatkich MINUS ikki.", 'Пять в квадрате это двадцать пять, но показатель МИНУС два.', 'Five squared is twenty five, but the exponent is MINUS two.') },
      ],
    },
    {
      id: 'b4', tag: 'check_by_point', ask: true, cols: 1,
      done: L("tekshiruv: har bir ildizni boshlang'ich tenglamaga", 'проверка: каждый корень в исходное уравнение', 'check: every root into the original equation'),
      prompt: L(
        "Siz 2 va −2 ildizlarini topdingiz. Ikkalasi ham yaroqli ekaniga eng tez qanday ishonch hosil qilasiz?",
        'Найдены корни 2 и −2. Как быстрее всего убедиться, что годятся оба?',
        'You found the roots 2 and −2. What is the fastest way to make sure both are valid?',
      ),
      items: [
        { id: 'a', label: L("har birini qo'yib, logarifm ostidagini hisoblash", 'подставить каждый и посчитать, что под логарифмом', 'substitute each and compute what is under the logarithm'), correct: true },
        { id: 'b', label: L("manfiysini tashlab yuborish", 'отбросить отрицательный', 'discard the negative one'), hint: L("Manfiy ildiz ham yaroqli bo'lishi mumkin: argument musbat bo'lsa bo'ldi.", 'Отрицательный корень тоже может годиться: важно, чтобы аргумент был положителен.', 'A negative root can be valid too: what matters is that the argument is positive.') },
        { id: 'c', label: L("o'sha usul bilan qayta yechish", 'решить второй раз тем же способом', 'solve it again the same way'), hint: L("O'sha usul o'sha xatoni takrorlaydi.", 'Тот же способ повторит ту же ошибку.', 'The same way repeats the same mistake.') },
        { id: 'd', label: L('ikkalasini ham javobga yozish', 'записать оба в ответ', 'write both into the answer'), hint: L("Yozishdan oldin tekshirish kerak, aks holda ortiqcha ildiz javobga tushadi.", 'Перед записью надо проверить, иначе в ответ попадёт лишний корень.', 'You must check before writing, otherwise an extraneous root enters the answer.') },
      ],
    },
    {
      id: 'b5', tag: 'substitution', prompt: 'lg² x − lg x = 0', cols: 2,
      items: [
        { id: 'a', label: 'x = 1,  x = 10', correct: true },
        { id: 'b', label: 'x = 10', hint: L("Te nolga teng bo'lgan holatni ham oling: lg x nol bo'lsa, x bir.", 'Возьми и случай, когда тэ равно нулю: если lg x равен нулю, то x равен единице.', 'Take the case where t equals zero as well: if lg x is zero, then x is one.') },
        { id: 'c', label: 'x = 0,  x = 1', hint: L("Nol ildiz bo'lolmaydi: logarifm ostida nol turolmaydi.", 'Ноль корнем быть не может: под логарифмом нуля не бывает.', 'Zero cannot be a root: there is no logarithm of zero.') },
        { id: 'd', label: 'x = 0,  x = 10', hint: L("Nol ildiz emas. Ikkinchi ildiz esa bir.", 'Ноль не корень. А второй корень это единица.', 'Zero is not a root. The second root is one.') },
      ],
    },
    {
      id: 'b6', tag: 'log_domain', ask: true, cols: 2,
      done: L('noldan katta: ARGUMENT', 'больше нуля: АРГУМЕНТ', 'greater than zero: the ARGUMENT'),
      prompt: L("log₇(3x − 6) = 2 tenglamada nima noldan katta bo'lishi SHART?", 'Что ОБЯЗАНО быть больше нуля в уравнении log₇(3x − 6) = 2 ?', 'What MUST be greater than zero in the equation log₇(3x − 6) = 2 ?'),
      items: [
        { id: 'a', label: '3x − 6', correct: true },
        { id: 'b', label: 'x', hint: L("Iks emas, logarifm ostidagi ifoda. x = 1 da iks musbat, argument esa minus uch.", 'Не икс, а выражение под логарифмом. При x = 1 икс положителен, а аргумент минус три.', 'Not x, but the expression under the logarithm. At x = 1 x is positive while the argument is minus three.') },
        { id: 'c', label: '7', hint: L("Yetti bu asos, u har doim musbat.", 'Семь это основание, оно всегда положительно.', 'Seven is the base, it is always positive.') },
        { id: 'd', label: '2', hint: L("Ikki bu logarifmning qiymati, u manfiy ham bo'lishi mumkin.", 'Двойка это значение логарифма, оно может быть и отрицательным.', 'Two is the value of the logarithm, and it may even be negative.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Bu yerda ikki logarifm qo'shilyapti.", 'Здесь складываются два логарифма.', 'Here two logarithms are added.'),
    A('q3', "Diqqat: logarifmning qiymati manfiy.", 'Внимание: значение логарифма отрицательное.', 'Careful: the value of the logarithm is negative.'),
    A('q4', 'Tekshiruv haqida savol.', 'Вопрос про проверку.', 'A question about checking.'),
    A('q5', 'Bu yerda logarifm kvadratga oshirilgan.', 'Здесь логарифм в квадрате.', 'Here the logarithm is squared.'),
    A('q6', "Oxirgi, va u darsning bitta gapi haqida.", 'Последний, и он про главную мысль урока.', 'The last one, and it is about the main point of the lesson.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: ildiz YO'QOTILGAN.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'equal_roots',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Qadamlar to'g'ri, javob to'liq emas", 'Шаги верны, ответ неполный', 'Steps right, answer incomplete'),
  rows: [
    { id: 'r1', text: 'lg² x = 1' },
    { id: 'r2', text: 'lg x = 1' },
    { id: 'r3', text: 'x = 10' },
    { id: 'r4', text: L('javob: 10', 'ответ: 10', 'answer: 10') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu boshlang'ich tenglama, unda xato bo'lishi mumkin emas.", 'Это исходное уравнение, ошибки в нём быть не может.', 'This is the original equation, there can be no error in it.'),
    r3: L("2-satrdan bu to'g'ri kelib chiqadi. Xato oldin kelgan.", 'Из строки 2 это следует верно. Ошибка пришла раньше.', 'This follows correctly from line 2. The error came earlier.'),
    r4: L("Javob haqiqatan to'liq emas. Lekin u oldin to'liq bo'lmagan, qayerda ekanini toping.", 'Ответ действительно неполный. Но неполным он стал раньше, найди, где именно.', 'The answer is indeed incomplete. But it became incomplete earlier, find exactly where.'),
  },
  proofPoint: 'x = 0,1',
  proof: L(
    "lg 0,1 = −1, va minus birning kvadrati bir. Demak 0,1 ham ildiz, javobda esa u yo'q. Kvadrat IKKI qiymat beradi: lg x = 1 va lg x = −1",
    'lg 0,1 = −1, а минус единица в квадрате это единица. Значит 0,1 тоже корень, а в ответе его нет. Квадрат даёт ДВА значения: lg x = 1 и lg x = −1',
    'lg 0,1 = −1, and minus one squared is one. So 0,1 is a root as well, yet the answer does not contain it. A square gives TWO values: lg x = 1 and lg x = −1',
  ),
  probe: {
    question: L('Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
    items: [
      { id: 'a', label: L('kvadratdan ildiz olishda ikkinchi qiymat tushib qolgan', 'при извлечении корня из квадрата потеряно второе значение', 'the second value was lost when taking the root of a square'), correct: true },
      { id: 'b', label: L('argumentga shart yozilmagan', 'не выписано условие на аргумент', 'the condition on the argument was not written'), hint: L("Shart bu yerda hech narsani o'zgartirmaydi: o'nlik ham, nol butun bir o'ndan ham musbat.", 'Условие здесь ничего не меняет: и десять, и нуль целых одна десятая положительны.', 'The condition changes nothing here: both ten and zero point one are positive.') },
      { id: 'c', label: L("asos noto'g'ri", 'основание неверное', 'the base is wrong'), hint: L("Asos o'n, va u to'g'ri: lg bu o'nlik logarifm.", 'Основание десять, и оно верное: lg это десятичный логарифм.', 'The base is ten, and it is correct: lg is the common logarithm.') },
      { id: 'd', label: L('amallar tartibi', 'порядок действий', 'order of operations'), hint: L("Tartib to'g'ri edi. Yo'qotish aynan kvadratdan chiqishda bo'ldi.", 'Порядок был правильный. Потеря произошла именно при выходе из квадрата.', 'The order was right. The loss happened exactly when leaving the square.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda hamma qadam to'g'ri ko'rinadi, va javob ham xato emas. Lekin u TO'LIQ emas. Xato birinchi marta paydo bo'lgan satrni toping.", 'Все шаги здесь выглядят верными, и ответ не то чтобы неверный. Но он НЕПОЛНЫЙ. Найди строку, в которой ошибка появилась впервые.', 'Every step looks correct here, and the answer is not exactly wrong. But it is INCOMPLETE. Find the line where the error first appeared.'),
    A('proof', "Tekshiramiz. Nol butun bir o'ndanning logarifmi minus bir, minus birning kvadrati esa bir. Demak bu ham ildiz, javobda esa u yo'q.", 'Проверим. Логарифм нуля целых одной десятой равен минус единице, а минус единица в квадрате это единица. Значит это тоже корень, а в ответе его нет.', 'Let us check. The logarithm of zero point one is minus one, and minus one squared is one. So this is a root as well, yet the answer does not contain it.'),
    A('q2', 'Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const PARTS_14 = ['log₂', 'log₀,₅', '= 3', '= −3']

const S14 = {
  role: 'build',
  led: 'student',
  tag: 'log_domain',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Teskari yig\'ing', 'Собери обратно', 'Build it back'),
  axis: AXIS_4,
  marks: [{ v: 8, tone: 'graph' }],
  targetLabel: L('Maqsad ildizi', 'Целевой корень', 'Target root'),
  targetValue: 'x = 8',
  tasks: [
    {
      prompt: L('Asosi 2 bo\'lsin', 'Пусть основание будет 2', 'Let the base be 2'),
      template: [{ slot: 0 }, ' x ', { slot: 1 }],
      parts: PARTS_14,
      answer: ['log₂', '= 3'],
      doneLabel: L('birinchi usul:  log₂ x = 3', 'первый способ: log₂ x = 3', 'first way: log₂ x = 3'),
      wrongs: [
        { key: 'log₂|= −3', hint: L("Ikkining minus uchinchi darajasi bir sakkizdan, sakkiz emas.", 'Два в минус третьей это одна восьмая, а не восемь.', 'Two to the power minus three is one eighth, not eight.') },
        { key: '*', hint: L("Ikkini qaysi darajaga oshirsak sakkiz chiqadi?", 'В какую степень возвести двойку, чтобы получить восемь?', 'To what power do we raise two to get eight?') },
      ],
    },
    {
      prompt: L("Endi asosi 0,5 bo'lsin, ildiz esa o'sha", 'А теперь основание 0,5, а корень тот же', 'Now let the base be 0,5, with the same root'),
      template: [{ slot: 0 }, ' x ', { slot: 1 }],
      parts: PARTS_14,
      answer: ['log₀,₅', '= −3'],
      doneLabel: L('ikkinchi usul:  log₀,₅ x = −3', 'второй способ: log₀,₅ x = −3', 'second way: log₀,₅ x = −3'),
      wrongs: [
        { key: 'log₀,₅|= 3', hint: L("Nol butun beshning kubi bir sakkizdan. Sakkiz uchun ko'rsatkich MINUS uch kerak.", 'Нуль целых пять в кубе это одна восьмая. Для восьмёрки нужен показатель МИНУС три.', 'Zero point five cubed is one eighth. For eight you need the exponent MINUS three.') },
        { key: '*', hint: L("Asos birdan kichik bo'lsa, katta songa MANFIY ko'rsatkich to'g'ri keladi.", 'Если основание меньше единицы, большому числу отвечает ОТРИЦАТЕЛЬНЫЙ показатель.', 'If the base is less than one, a large number has a NEGATIVE exponent.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi o'sha ildiz, lekin asos nol butun besh bo'lishi kerak.", 'А теперь тот же корень, но основание должно быть нуль целых пять.', 'And now the same root, but the base must be zero point five.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'check_by_point',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'logₐ f(x) = c  ⟺  f(x) = aᶜ,  f(x) > 0',
  ruleLines: [
    L("1. yig'indini ko'paytmaga yig', argumentlarni tenglashtir", '1. сверни сумму в произведение, приравняй аргументы', '1. fold the sum into a product, set the arguments equal'),
    L('2. har bir ildizda ARGUMENTni hisobla', '2. посчитай АРГУМЕНТ при каждом корне', '2. compute the ARGUMENT at every root'),
    L("3. iksning ishorasi o'z-o'zidan hech narsani anglatmaydi", '3. знак самого икса сам по себе не значит ничего', '3. the sign of x itself means nothing'),
  ],
  predicts: [
    {
      screen: 0,
      expr: EQ_HOOK,
      right: 'x = 3',
      map: { a: 'x = 3', b: 'x = 3, −3', both: '—', none: '—' },
    },
    {
      screen: 5,
      expr: EQ_NEW,
      right: L('ikkita', 'два', 'two'),
      map: {
        a: L('ikkita', 'два', 'two'),
        b: L('bitta, musbati', 'один, положительный', 'one, the positive'),
        c: L('bitta, manfiysi', 'один, отрицательный', 'one, the negative'),
        d: L("bitta ham yo'q", 'ни одного', 'none'),
      },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: 'x² − 1 = 8   →   x = ±3   →   x = 3',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Qoidaga va ikki manfiy ildiz ekraniga qayting', 'Вернись к правилу и к экрану с двумя отрицательными корнями', 'Go back to the rule and to the two-negative-roots screen'),
  },
  probe: {
    question: L('Ishonchingiz bo\'lmasa, ildizingizni qanday tekshirasiz?', 'Как проверить свой корень, если сомневаешься?', 'How do you check your root when you are unsure?'),
    items: [
      { id: 'a', label: L("qo'yib, logarifm ostidagini hisoblash", 'подставить и посчитать, что под логарифмом', 'substitute and compute what is under the logarithm'), correct: true },
      { id: 'b', label: L("manfiysini tashlash", 'отбросить отрицательный', 'discard the negative one'), hint: L("Manfiy ildiz ham yaroqli bo'lishi mumkin — bugun buni ko'rdik.", 'Отрицательный корень тоже может годиться, мы это сегодня видели.', 'A negative root can be valid too, we saw that today.') },
      { id: 'c', label: L('darslikka qarash', 'посмотреть в учебник', 'look in the textbook'), hint: L("Darslikda aynan sizning tenglamangiz bo'lmaydi.", 'В учебнике не будет именно твоего уравнения.', 'The textbook will not contain your exact equation.') },
      { id: 'd', label: L('hech qanday', 'никак', 'there is no way'), hint: L('Butun dars tekshirdik. Nima bilan ekanini eslang.', 'Мы весь урок проверяли. Вспомни, чем.', 'We were checking all lesson. Recall with what.') },
    ],
  },
  sheetTitle: L('Logarifmik tenglamalar · shpargalka', 'Логарифмические уравнения · шпаргалка', 'Logarithmic equations · cheat sheet'),
  sheetSrc: L('11-sinf · 11-dars', '11 класс · урок 11', 'Grade 11 · lesson 11'),
  lifehack: L(
    "10 sekundlik tekshiruv: har bir ildizni qo'ying va logarifm OSTIDAGI ifodani hisoblang. Musbat bo'lsa — ildiz qoladi.",
    'Проверка за 10 секунд: подставь каждый корень и посчитай выражение ПОД логарифмом. Положительно — корень остаётся.',
    'A 10-second check: substitute every root and compute the expression UNDER the logarithm. Positive means the root stays.',
  ),
  holds: [2500, 8000, 4500, 4500],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminingiz va mana qanday chiqdi. Taxminda xato qilish normal edi, biz shuning uchun tekshirdik.", 'Вот твой прогноз и вот как оказалось. Ошибиться в догадке было нормально, именно поэтому мы проверяли.', 'Here is your guess and here is how it turned out. Being wrong in a guess was fine, that is exactly why we checked.'),
    A('rule', "Va mana dars boshlangan tenglama. Kvadrat ikkita ildiz berdi, tekshirish esa bittasini tashladi.", 'А вот уравнение, с которого урок начался. Квадрат дал два корня, а проверка отбросила один.', 'And here is the equation the lesson began with. The square gave two roots, and the check discarded one.'),
    A('q', "Va eng muhimi: ildizga ishonchingiz bo'lmasa, o'zingiz tekshirish usuli bor.", 'И главное: если сомневаешься в корне, есть способ проверить самому.', 'And the main thing: if you are unsure of your root, there is a way to check it yourself.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
