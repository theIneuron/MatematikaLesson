// ============================================================================
// 11-sinf, Dars 19. NYUTON BINOMI.
//
// B3 blokining TO'RTINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/BLOK3_SKELET.md, «19-dars» bo'limi
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// DARSNING BITTA GAPI: koeffitsient bu YO'LLAR soni, ya'ni guruhlash.
// Uchlik «ko'paytirganda shunday chiqdi» emas: u uchta yo'l, qaysida «be»
// bir marta olingan. Asbob shu yo'llarni bo'yab ko'rsatadi (`markPaths`).
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_19',
  title: L('Nyuton binomi', 'Бином Ньютона', "Newton's binomial"),
}

const BLOCK = { label: 'B3', from: 16, to: 24, current: 19 }

// ============================================================
// SLAYD 1. XUK. Uchlik qayerdan.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Nyuton binomi', 'Бином Ньютона', "Newton's binomial"),
  title: L('Uchlik qayerdan', 'Откуда тройка', 'Where the three comes from'),
  expr: '(a + b)³ = a³ + 3a²b + 3ab² + b³',
  rows: [
    {
      id: 'a',
      name: L("ko'paytirganda shunday chiqdi", 'так вышло при умножении', 'it came out from multiplying'),
      value: L('sababi yo\'q', 'без причины', 'no reason'),
    },
    {
      id: 'b',
      name: L("bu yo'llar soni", 'это число путей', 'it is the number of paths'),
      value: 'C(3,1) = 3',
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi qavslarni qo'lda ochamiz.",
      'Твой ответ записан. Сейчас раскроем скобки руками.',
      'Your answer is saved. Now we will expand the brackets by hand.',
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
    A('mount', "Uch dars sanadik: o'rin almashtirish, o'rinlashtirish, guruhlash. Bugun ular kutilmagan joyda uchraydi, algebraik formulada.", 'Три урока мы считали: перестановки, размещения, сочетания. Сегодня они встретятся в неожиданном месте, в алгебраической формуле.', 'For three lessons we counted: permutations, arrangements, combinations. Today they turn up in an unexpected place, in an algebraic formula.'),
    A('r1', "Birinchi javob: uchlik shunchaki ko'paytirish natijasi, uni yodlash kerak.", 'Первый ответ: тройка это просто результат умножения, её надо запомнить.', 'The first answer: the three is just a result of multiplying, it must be memorised.'),
    A('r2', "Ikkinchi javob: uchlik bu yo'llar soni. Uchta qavs bor, va ularning uchtasidan bittasidan be olish uch xil usulda mumkin.", 'Второй ответ: тройка это число путей. Скобок три, и взять be ровно из одной из них можно тремя способами.', 'The second answer: the three is a number of paths. There are three brackets, and taking b from exactly one of them can be done in three ways.'),
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
    "Uchta narsa kerak: qavs ochish, guruhlash va daraxt. Bu baholanmaydi.",
    'Нужны три вещи: раскрытие скобок, сочетания и дерево. Это не оценивается.',
    'Three things are needed: expanding brackets, combinations and the tree. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Ikki qavs ochilishi', 'Раскрытие двух скобок', 'Expanding two brackets'),
      short: L('har hadga har had', 'каждое на каждое', 'each by each'),
      ex: [{ e: '(a + b)(a + b) = a² + 2ab + b²', why: L("ab ikki marta chiqadi", 'ab выходит дважды', 'ab comes out twice') }],
    },
    {
      id: 'c2',
      title: L('Guruhlash', 'Сочетание', 'Combination'),
      short: L('18-darsdan', 'из урока 18', 'from lesson 18'),
      ex: [{ e: 'C(3,1) = 3,   C(4,2) = 6', why: L('tartib muhim emas', 'порядок не важен', 'the order does not matter') }],
    },
    {
      id: 'c3',
      title: L('Har qavsda ikki tanlov', 'В каждой скобке два выбора', 'Two choices in each bracket'),
      short: L('a yoki b', 'a или b', 'a or b'),
      ex: [{ e: L('3 qavs  →  8 yo\'l', '3 скобки  →  8 путей', '3 brackets  →  8 paths'), why: L('2 karra 2 karra 2', 'два на два на два', 'two times two times two') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('(a + b)² ni oching', 'Раскрой (a + b)²', 'Expand (a + b)²'),
      cols: 2,
      items: [
        { id: 'a', label: 'a² + 2ab + b²', correct: true },
        { id: 'b', label: 'a² + b²', hint: L("O'rtadagi had tushib qoldi: ab ikki marta chiqadi.", 'Потерян средний член: ab выходит дважды.', 'The middle term is lost: ab comes out twice.') },
        { id: 'c', label: 'a² + ab + b²', hint: L("ab bir marta emas, ikki marta: birinchi qavsdan a, ikkinchisidan b, va teskarisi.", 'ab не один раз, а два: из первой скобки a, из второй b, и наоборот.', 'ab not once but twice: a from the first bracket, b from the second, and the other way round.') },
        { id: 'd', label: '2a + 2b', hint: L("Bu qavsni ikkiga ko'paytirgani, kvadratga ko'targani emas.", 'Это скобка умножена на два, а не возведена в квадрат.', 'That is the bracket times two, not squared.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('C(3,1) nechaga teng?', 'Чему равно C(3,1) ?', 'What is C(3,1) ?'),
      cols: 4,
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '1', hint: L("Uchta buyumdan bittasini uch xil usulda tanlash mumkin.", 'Из трёх предметов один можно выбрать тремя способами.', 'One of three objects can be chosen in three ways.') },
        { id: 'c', label: '6', hint: L("Bu uch faktorial. Bittasini tanlash esa uchta usul.", 'Это три факториал. А выбрать одного это три способа.', 'That is three factorial. Choosing one is three ways.') },
        { id: 'd', label: '2', hint: L("Uchta nomzod bor, hammasi ham tanlanishi mumkin.", 'Кандидатов трое, и выбран может быть любой.', 'There are three candidates, and any may be chosen.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('3 qavsda nechta yo\'l bor?', 'Сколько путей в 3 скобках?', 'How many paths in 3 brackets?'),
      cols: 4,
      items: [
        { id: 'a', label: '8', correct: true },
        { id: 'b', label: '6', hint: L("Bu yig'indi yoki uch faktorial. Har qavsda ikki tanlov: ikki karra ikki karra ikki.", 'Это сумма или три факториал. В каждой скобке два выбора: два на два на два.', 'That is the sum or three factorial. Each bracket has two choices: two times two times two.') },
        { id: 'c', label: '3', hint: L("Bu qavslar soni, yo'llar soni emas.", 'Это число скобок, а не путей.', 'That is the number of brackets, not paths.') },
        { id: 'd', label: '9', hint: L("Bu uchning kvadrati. Bu yerda ikkining kubi.", 'Это три в квадрате. А здесь два в кубе.', 'That is three squared. Here it is two cubed.') },
      ],
    },
  ],
  holds: [3000, 5500, 4500, 5000, 4500, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch: ikki qavs ochilganda har had har hadga ko'paytiriladi. Va o'rtada ab ikki marta chiqadi: birinchi qavsdan a olib ikkinchisidan be, yoki teskarisi.", 'Первая опора: при раскрытии двух скобок каждый член умножается на каждый. И в середине ab выходит дважды: из первой скобки a и из второй be, или наоборот.', 'The first basic: expanding two brackets multiplies each term by each. And in the middle ab comes out twice: a from the first bracket and b from the second, or the other way round.'),
    A('c2', "Ikkinchi tayanch o'tgan darsdan: guruhlash. Uchtadan bittasini tanlash uch xil usulda.", 'Вторая опора с прошлого урока: сочетание. Выбрать одного из трёх можно тремя способами.', 'The second basic from last lesson: the combination. Choosing one of three can be done in three ways.'),
    A('c3', "Uchinchi tayanch: har qavsdan a yoki be olish mumkin, ya'ni ikki tanlov. Uchta qavs bo'lsa, sakkizta yo'l.", 'Третья опора: из каждой скобки можно взять a или be, то есть два выбора. При трёх скобках восемь путей.', 'The third basic: from each bracket you may take a or b, two choices. With three brackets there are eight paths.'),
    A('recap', "Qisqacha: sakkizta yo'l bor, va ular hadlar bo'yicha guruhlanadi.", 'Коротко: путей восемь, и они группируются по членам.', 'Briefly: there are eight paths, and they group by terms.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. QAVSNI QO'LDA OCHAMIZ.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'sum_vs_product',
  eyebrow: L('Qo\'lda ochamiz', 'Раскроем руками', 'Let us expand by hand'),
  title: L('Har had qayerdan keldi', 'Откуда каждый член', 'Where each term comes from'),
  expr: '(a + b)(a + b)',
  goal: L('har hadning kelib chiqishini topish', 'найти происхождение каждого члена', 'find where each term comes from'),
  rule: L(
    "Har qavsdan bitta had olinadi va ular ko'paytiriladi. Hamma tanlovni sanaymiz.",
    'Из каждой скобки берётся один член, и они перемножаются. Пересчитаем все выборы.',
    'One term is taken from each bracket and they are multiplied. Let us count every choice.',
  ),
  pick: L('Qaysi hadni ko\'ramiz?', 'Какой член посмотрим?', 'Which term shall we look at?'),
  claims: [
    { id: 'a', key: 'inA', name: L('sababsiz', 'без причины', 'no reason'), value: L('yodlash kerak', 'надо запомнить', 'must be memorised') },
    { id: 'b', key: 'inB', name: L("yo'llar soni", 'число путей', 'the number of paths'), value: 'C(n,k)' },
  ],
  points: [
    {
      id: 'q1', label: 'a²', num: 'a²', step: 'calc', verdict: 'in',
      role: L('bitta yo\'l', 'один путь', 'one path'),
      calc: L('a va a', 'a и a', 'a and a'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: 'ab', num: 'ab', step: 'calc', verdict: 'in',
      role: L('ikkita yo\'l', 'два пути', 'two paths'),
      calc: L('a va b,   b va a', 'a и b,   b и a', 'a and b,   b and a'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: 'b²', num: 'b²', step: 'calc', verdict: 'in',
      role: L('bitta yo\'l', 'один путь', 'one path'),
      calc: L('b va b', 'b и b', 'b and b'),
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Nega ab oldida ikkilik turibdi?", 'Почему перед ab стоит двойка?', 'Why is there a two in front of ab?'),
    items: [
      {
        id: 'b', label: L("unga ikkita yo'l olib keladi", 'к нему ведут два пути', 'two paths lead to it'), correct: true,
        ok: L(
          "To'g'ri. Be ni birinchi qavsdan yoki ikkinchisidan olish mumkin: ikki xil tanlov, bitta had.",
          'Верно. Be можно взять из первой скобки или из второй: два разных выбора, один член.',
          'Correct. b can be taken from the first bracket or the second: two different choices, one term.',
        ),
      },
      {
        id: 'a', label: L("qavslar ikkita", 'скобок две', 'there are two brackets'),
        hint: L("Qavslar soni tasodifan mos keldi. Uch qavsda ab oldida ikkilik emas, uchlik turadi.", 'Число скобок совпало случайно. При трёх скобках перед членом стоит тройка, а не двойка.', 'The number of brackets matched by chance. With three brackets the coefficient is three, not two.'),
      },
      {
        id: 'both', label: L("a va b ikkitasi", 'потому что a и b это двое', 'because a and b are two'),
        hint: L("Harflar har doim ikkita. Koeffitsient esa o'zgaradi: bir, uch, olti.", 'Букв всегда две. А коэффициент меняется: один, три, шесть.', 'There are always two letters. But the coefficient changes: one, three, six.'),
      },
      {
        id: 'none', label: L('shunchaki qoida', 'просто правило', 'just a rule'),
        hint: L("Qoida emas: ikkita yo'lni ro'yxatda ko'rish mumkin.", 'Не правило: два пути видны в списке.', 'Not a rule: the two paths are visible in the list.'),
      },
    ],
  },
  holds: [2500, 6000, 1500, 2500, 9500, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi kvadratni qo\'lda ochamiz.', 'Опора восстановлена. Теперь раскроем квадрат руками.', 'The basics are back. Now let us expand the square by hand.'),
    A('mount', "Ikkita qavs bor, har biridan bitta had olinadi. Tanlovlar to'rtta, hadlar esa uchta: demak biror had ikki marta chiqadi.", 'Скобок две, из каждой берётся один член. Выборов четыре, а членов три: значит какой-то член выходит дважды.', 'There are two brackets, one term from each. Four choices but three terms: so some term comes out twice.'),
    A('mount', "Qaysi hadni ko'rishni tanlang.", 'Выбери, какой член посмотреть.', 'Choose which term to look at.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Uchta had ko'rildi. A kvadratga bitta yo'l: ikkala qavsdan ham a. Be kvadratga ham bitta. A be ga esa ikkita yo'l: birinchi qavsdan a va ikkinchisidan be, yoki teskarisi. Shuning uchun uning oldida ikkilik turibdi. Koeffitsient bu yo'llar soni, boshqa hech narsa emas.", 'Три члена рассмотрены. К a в квадрате ведёт один путь: из обеих скобок a. К be в квадрате тоже один. А к a be ведут два: из первой скобки a и из второй be, или наоборот. Поэтому перед ним двойка. Коэффициент это число путей, и ничего больше.', 'Three terms examined. One path leads to a squared: a from both brackets. One to b squared as well. But two lead to ab: a from the first bracket and b from the second, or the other way round. That is why it has a two. The coefficient is the number of paths, nothing else.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: YO'LLAR BO'YALADI.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'sum_vs_product',
  eyebrow: L('Yo\'llarni sanang', 'Сосчитай пути', 'Count the paths'),
  title: L('Uchta yo\'l, uchta koeffitsient', 'Три пути, три в формуле', 'Three paths, three in the formula'),
  chip: '(a + b)³',
  tree: {
    levels: [{ n: 2 }, { n: 2 }, { n: 2 }],
    markPaths: 1,
    sumLabel: L("yig'indi:", 'сумма:', 'sum:'),
    prodLabel: L("hamma yo'l:", 'всех путей:', 'all paths:'),
    pathLabels: L("b bir marta olingan yo'llar:  3", 'путей, где b взято один раз:  3', 'paths where b is taken once:  3'),
    height: 150,
  },
  graphSteps: 3,
  bonus: L(
    "Sakkizta yo'ldan uchtasida be roppa rosa bir marta olingan. Aynan shu uchlik formulada a kvadrat be oldida turibdi.",
    'Из восьми путей ровно в трёх be взято один раз. Именно эта тройка и стоит в формуле перед a в квадрате be.',
    'Of the eight paths, exactly three take b once. That very three stands in the formula before a squared b.',
  ),
  probe: {
    question: L("3a²b dagi uchlik nimani bildiradi?", 'Что означает тройка в 3a²b ?', 'What does the three in 3a²b mean?'),
    items: [
      { id: 'a', label: L("b ni bir marta olish mumkin bo'lgan yo'llar soni", 'число путей, где b взято один раз', 'the number of paths taking b once'), correct: true },
      { id: 'b', label: L('qavslar soni', 'число скобок', 'the number of brackets'), hint: L("Bu safar mos keldi. To'rt qavsda esa koeffitsient to'rt emas, olti bo'ladi.", 'На этот раз совпало. А при четырёх скобках коэффициент не четыре, а шесть.', 'This time it matched. With four brackets the coefficient is six, not four.') },
      { id: 'c', label: L("a ning darajasi", 'степень a', 'the power of a'), hint: L("A ning darajasi ikki, koeffitsient esa uch.", 'Степень a это два, а коэффициент три.', 'The power of a is two, the coefficient is three.') },
      { id: 'd', label: L('tasodifiy son', 'случайное число', 'a random number'), hint: L("Yo'llarni sanang: ular roppa rosa uchta.", 'Пересчитай пути: их ровно три.', 'Count the paths: there are exactly three.') },
    ],
  },
  holds: [4500, 5500, 6000, 7000],
  audio: [
    A('mount', "Kvadratda ko'rdik. Endi kubga o'tamiz va daraxt quramiz.", 'На квадрате увидели. Теперь перейдём к кубу и построим дерево.', 'We saw it on the square. Now to the cube, and let us build the tree.'),
    A('one', "Uchta qavs, har biridan a yoki be. Birinchi qatlam ikkita shox.", 'Три скобки, из каждой a или be. Первый уровень две ветки.', 'Three brackets, a or b from each. The first level has two branches.'),
    A('two', "Ikkinchi va uchinchi qatlamdan keyin sakkizta yo'l qoladi. Bu ikkining kubi.", 'После второго и третьего уровня остаётся восемь путей. Это два в кубе.', 'After the second and third levels eight paths remain. That is two cubed.'),
    A('three', "Endi eng muhimi. Sakkizta yo'ldan qaysilarida be roppa rosa bir marta olingan? Ular bo'yaldi, va ularning soni uchta. Aynan shu uchlik formulada turibdi. Koeffitsient yodlanmaydi, u sanaladi.", 'Теперь главное. В каких из восьми путей be взято ровно один раз? Они подсвечены, и их три. Именно эта тройка и стоит в формуле. Коэффициент не заучивают, его считают.', 'Now the main thing. In which of the eight paths is b taken exactly once? They are highlighted, and there are three. That very three stands in the formula. The coefficient is not memorised, it is counted.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'order_matters',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Koeffitsient bu guruhlash', 'Коэффициент это сочетание', 'The coefficient is a combination'),
  rows: ['(a + b)³:   1, 3, 3, 1', 'C(3,0), C(3,1), C(3,2), C(3,3)'],
  probe: {
    question: L(
      "(a + b)⁴ da a³b oldida nima turadi?",
      'Что стоит перед a³b в (a + b)⁴ ?',
      'What stands before a³b in (a + b)⁴ ?',
    ),
    items: [
      { id: 'a', label: '4', correct: true },
      { id: 'b', label: '3', hint: L("Uchlik bu a ning darajasi. Koeffitsient esa be ni nechta qavsdan olish mumkinligi: to'rtta.", 'Тройка это степень a. А коэффициент это из скольких скобок можно взять be: из четырёх.', 'Three is the power of a. The coefficient is from how many brackets b can be taken: four.') },
      { id: 'c', label: '6', hint: L("Oltilik o'rtada turadi, a kvadrat be kvadrat oldida.", 'Шестёрка стоит в середине, перед a в квадрате be в квадрате.', 'Six stands in the middle, before a squared b squared.') },
      { id: 'd', label: '1', hint: L("Bir chetlarda turadi: a to'rtinchi va be to'rtinchi oldida.", 'Единица стоит с краёв: перед a в четвёртой и be в четвёртой.', 'One stands at the ends: before a to the fourth and b to the fourth.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Koeffitsient', 'Правило 1. Коэффициент', 'Rule 1. The coefficient'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'C(n, k)',
    lines: [
      L("koeffitsient bu b ni k marta olish usullari soni", 'коэффициент это число способов взять b ровно k раз', 'the coefficient is the number of ways to take b exactly k times'),
      L("k bu b ning darajasi", 'k это степень b', 'k is the power of b'),
      L("darajalar yig'indisi har doim n ga teng", 'сумма степеней всегда равна n', 'the powers always add up to n'),
      L("chetlarda har doim bir: bitta yo'l", 'по краям всегда единица: один путь', 'at the ends always one: a single path'),
    ],
    example: L('misol:  (a + b)³  →  1, 3, 3, 1', 'пример:  (a + b)³  →  1, 3, 3, 1', 'example:  (a + b)³  →  1, 3, 3, 1'),
  },
  holds: [4000, 6500, 4500],
  audio: [
    A('mount', "Daraxt javobni ko'rsatdi. Endi qoidani yozamiz.", 'Дерево показало ответ. Теперь запишем правило.', 'The tree showed the answer. Now let us write the rule.'),
    A('def', "Koeffitsient bu be ni roppa rosa ka marta olish usullari soni. Ya'ni en ta qavsdan ka tasini tanlash, va bu guruhlash. Ka esa be ning darajasi. Chetlarda har doim bir turadi, chunki hamma qavsdan a olish ham, hammasidan be olish ham bitta usulda bo'ladi.", 'Коэффициент это число способов взять be ровно ка раз. То есть выбрать ка скобок из эн, а это сочетание. А ка это степень be. По краям всегда единица, потому что взять a из всех скобок, как и be из всех, можно одним способом.', 'The coefficient is the number of ways to take b exactly k times. That is choosing k brackets out of n, which is a combination. And k is the power of b. At the ends there is always one, because taking a from every bracket, like taking b from every bracket, can be done in one way.'),
    A('rule', "To'g'ri. Koeffitsient a ning darajasidan emas, be ning darajasidan olinadi: nechta qavsdan be olinsa, shuncha.", 'Верно. Коэффициент берётся не из степени a, а из степени be: из скольких скобок взяли be, столько и есть.', 'Correct. The coefficient comes not from the power of a but from the power of b: from how many brackets b was taken.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: to'rtinchi daraja.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'order_matters',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('To\'rtinchi daraja', 'Четвёртая степень', 'The fourth power'),
  was: { label: UI.was, expr: '(a + b)³:   1, 3, 3, 1' },
  now: { label: UI.now, expr: '(a + b)⁴:   1, 4, ?, 4, 1' },
  probe1: {
    question: L('O\'rtadagi koeffitsient nimani sanaydi?', 'Что считает средний коэффициент?', 'What does the middle coefficient count?'),
    items: [
      { id: 'a', label: L("4 qavsdan 2 tasini tanlash", 'выбрать 2 скобки из 4', 'choosing 2 brackets out of 4'), correct: true },
      { id: 'b', label: L("4 qavsdan 3 tasini", 'выбрать 3 из 4', 'choosing 3 out of 4'), hint: L("O'rtadagi hadda be ning darajasi ikki: a kvadrat be kvadrat.", 'В среднем члене степень be равна двум: a в квадрате be в квадрате.', 'In the middle term the power of b is two: a squared b squared.') },
      { id: 'c', label: L("4 ni 2 ga bo'lish", 'разделить 4 на 2', 'dividing 4 by 2'), hint: L("Bo'lish emas: koeffitsient bu tanlash usullari soni.", 'Не деление: коэффициент это число способов выбрать.', 'Not division: the coefficient is a number of ways to choose.') },
      { id: 'd', label: L("2 ni 4 marta ko'paytirish", 'умножить 2 четыре раза', 'multiplying 2 four times'), hint: L("Bu hamma yo'llar soni, o'n olti. Bizga esa ulardan bir qismi kerak.", 'Это число всех путей, шестнадцать. А нужна их часть.', 'That is the number of all paths, sixteen. We need a part of them.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('O\'rtada nima turadi?', 'Что стоит в середине?', 'What stands in the middle?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '6' },
      { id: 'b', label: '4' },
      { id: 'c', label: '8' },
      { id: 'd', label: '2' },
    ],
  },
  holds: [4500, 6500, 2500, 3000],
  audio: [
    A('mount', "Uchinchi darajada koeffitsientlar bir, uch, uch, bir edi. Chetlaridagi birlar tushunarli: hamma qavsdan bir xil harf olinadi.", 'В третьей степени коэффициенты были один, три, три, один. Единицы по краям понятны: из всех скобок берётся одна и та же буква.', 'In the third power the coefficients were one, three, three, one. The ones at the ends are clear: the same letter is taken from every bracket.'),
    A('now', "Endi to'rtinchi daraja. Chetlari yana bir, keyingilari to'rt: be ni to'rtta qavsning istalganidan olish mumkin. O'rtada esa nima turishini hali bilmaymiz.", 'Теперь четвёртая степень. По краям снова единицы, следующие четвёрки: be можно взять из любой из четырёх скобок. А что в середине, мы ещё не знаем.', 'Now the fourth power. Ones at the ends again, then fours: b can be taken from any of the four brackets. And what stands in the middle we do not know yet.'),
    A('q1', "O'rtadagi koeffitsient nimani sanaydi?", 'Что считает средний коэффициент?', 'What does the middle coefficient count?'),
    A('q2', 'Sizningcha nima turadi? Shunchaki taxmin qiling.', 'Как думаешь, что там стоит? Просто предположи.', 'What do you think stands there? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'order_matters',
  eyebrow: L('Ikkalasini ham sanaymiz', 'Посчитаем оба', 'Let us compute both'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: '(a + b)⁴,   a²b² oldida',
  need: '= ?',
  answerLabel: L('koeffitsient', 'коэффициент', 'the coefficient'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: '4',
      point: {
        label: L('qavslar soni', 'число скобок', 'the number of brackets'),
        calc: L('C(4,2) emas   ✗', 'это не C(4,2)   ✗', 'not C(4,2)   ✗'),
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: '6',
      point: {
        label: 'C(4,2)',
        calc: '12 / 2! = 6   ✓',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['6', '4', '8', '12'],
    value: ['6'],
    label: L('koeffitsient', 'коэффициент', 'coefficient'),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '4', hint: L("To'rtlik bu qavslar soni. Koeffitsient esa to'rttadan ikkitasini tanlash: oltita.", 'Четвёрка это число скобок. А коэффициент это выбрать две из четырёх: шесть.', 'Four is the number of brackets. The coefficient is choosing two of four: six.') },
      { key: '12', hint: L("Bu joylashtirish, tartib bilan. Qavslar esa tartibsiz tanlanadi.", 'Это размещение, с порядком. А скобки выбираются без порядка.', 'That is the arrangement, with order. But brackets are chosen without order.') },
      { key: '*', hint: L("To'rt karra uch bu o'n ikki, va uni ikki faktorialga bo'ling.", 'Четыре на три это двенадцать, и подели на два факториал.', 'Four times three is twelve, and divide by two factorial.') },
    ],
  },
  holds: [3500, 6000, 5500, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala nomzodni ham sanaymiz.', 'Прогноз есть. Теперь посчитаем обоих кандидатов.', 'The guess is made. Now let us compute both candidates.'),
    A('p1', "Birinchi nomzod to'rtta dedi, va bu qavslar soni. Lekin o'rtadagi hadda be ikki marta olinadi, va bunday yo'llar to'rttadan ko'p.", 'Первый кандидат назвал четыре, и это число скобок. Но в среднем члене be берётся дважды, и таких путей больше четырёх.', 'The first candidate said four, and that is the number of brackets. But in the middle term b is taken twice, and there are more than four such paths.'),
    A('p2', "Ikkinchi nomzod guruhlashni sanadi: to'rtta qavsdan ikkitasini tanlash. To'rt karra uch bu o'n ikki, ikkiga bo'linsa oltita. Aynan olti.", 'Второй кандидат посчитал сочетание: выбрать две скобки из четырёх. Четыре на три это двенадцать, поделить на два будет шесть. Ровно шесть.', 'The second candidate computed the combination: choosing two brackets of four. Four times three is twelve, divided by two is six. Exactly six.'),
    A('write', "Javobni yozing.", 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: PASKAL UCHBURCHAGI.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'order_matters',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Paskal uchburchagi', 'Треугольник Паскаля', "Pascal's triangle"),
  cases: [
    {
      label: L('har satr', 'каждая строка', 'each row'),
      text: L('bitta daraja', 'одна степень', 'one power'),
      tone: 'graph',
    },
    {
      label: L('har son', 'каждое число', 'each number'),
      text: L("tepadagi ikkitasining yig'indisi", 'сумма двух сверху', 'the sum of the two above'),
      tone: 'accent',
    },
  ],
  rows: ['1  3  3  1', '1  4  6  4  1'],
  probe: {
    question: L(
      "(a + b)⁴ koeffitsientlarining yig'indisi?",
      'Чему равна сумма коэффициентов (a + b)⁴ ?',
      'What is the sum of the coefficients of (a + b)⁴ ?',
    ),
    items: [
      { id: 'a', label: '16', correct: true },
      { id: 'b', label: '8', hint: L("Bu uchinchi darajaning yig'indisi. To'rtinchida ikki barobar ko'p.", 'Это сумма для третьей степени. В четвёртой вдвое больше.', 'That is the sum for the third power. In the fourth it is twice as much.') },
      { id: 'c', label: '4', hint: L("Bu daraja. Yig'indi esa hamma yo'llar soni.", 'Это степень. А сумма это число всех путей.', 'That is the power. The sum is the number of all paths.') },
      { id: 'd', label: '10', hint: L("Bir plyus to'rt plyus olti plyus to'rt plyus bir bu o'n olti.", 'Один плюс четыре плюс шесть плюс четыре плюс один это шестнадцать.', 'One plus four plus six plus four plus one is sixteen.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Uchburchak', 'Правило 2. Треугольник', 'Rule 2. The triangle'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'C(n,k) = C(n−1,k−1) + C(n−1,k)',
    lines: [
      L("har satr bitta darajaning koeffitsientlari", 'каждая строка это коэффициенты одной степени', 'each row is the coefficients of one power'),
      L("har son tepadagi ikkitasining yig'indisi", 'каждое число это сумма двух над ним', 'each number is the sum of the two above it'),
      L("satr yig'indisi 2 darajada n: bu hamma yo'llar", 'сумма строки равна 2 в степени n: это все пути', 'the row adds to 2 to the n: that is all the paths'),
      L('satr simmetrik: C(n,k) = C(n,n−k)', 'строка симметрична: C(n,k) = C(n,n−k)', 'the row is symmetric: C(n,k) = C(n,n−k)'),
    ],
    example: L('misol:  1 + 4 + 6 + 4 + 1 = 16 = 2⁴', 'пример:  1 + 4 + 6 + 4 + 1 = 16 = 2⁴', 'example:  1 + 4 + 6 + 4 + 1 = 16 = 2⁴'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'C(n, k)',
    lines: [
      L("1. koeffitsient bu yo'llar soni, ya'ni guruhlash", '1. коэффициент это число путей, то есть сочетание', '1. the coefficient is the number of paths, a combination'),
      L("2. k bu b ning darajasi", '2. k это степень b', '2. k is the power of b'),
      L("3. satr yig'indisi 2 darajada n", '3. сумма строки равна 2 в степени n', '3. the row adds to 2 to the n'),
      L('4. tekshiruv: chetlarda har doim bir', '4. проверка: по краям всегда единица', '4. a check: the ends are always one'),
    ],
  },
  holds: [4000, 7000, 4500, 5000],
  audio: [
    A('mount', "Koeffitsient topildi. Endi hammasini bir joyga yig'amiz.", 'Коэффициент найден. Теперь соберём всё в одно место.', 'The coefficient is found. Now let us gather everything in one place.'),
    A('rows', "Har darajaning koeffitsientlarini alohida sanash shart emas. Ular uchburchakka joylashtiriladi, va har son tepadagi ikkitasining yig'indisiga teng. Sabab oddiy: yangi qavs qo'shilganda har yo'l ikkiga bo'linadi.", 'Считать коэффициенты каждой степени отдельно не обязательно. Их складывают в треугольник, и каждое число равно сумме двух над ним. Причина простая: когда добавляется новая скобка, каждый путь раздваивается.', 'The coefficients of each power need not be counted separately. They are laid out in a triangle, and each number equals the sum of the two above it. The reason is simple: when a new bracket is added, each path splits in two.'),
    A('q', "Savol: to'rtinchi darajada koeffitsientlarning yig'indisi nechaga teng?", 'Вопрос: чему равна сумма коэффициентов четвёртой степени?', 'The question: what do the fourth-power coefficients add up to?'),
    A('rule', "To'g'ri. O'n olti bu hamma yo'llar soni: ikki darajada to'rt. Va bu yaxshi tekshiruv: koeffitsientlarni qo'shing va ikkining darajasi chiqishi kerak.", 'Верно. Шестнадцать это число всех путей: два в четвёртой. И это хорошая проверка: сложи коэффициенты, и должна выйти степень двойки.', 'Correct. Sixteen is the number of all paths: two to the fourth. And that is a good check: add the coefficients and a power of two must come out.'),
    A('both', 'Endi butun usulni bitta qoidaga yig\'ing.', 'А теперь собери весь способ в одно правило.', 'Now combine the whole method into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. KOEFFITSIENTNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'order_matters',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Koeffitsientni qo\'ying', 'Поставь коэффициент', 'Place the coefficient'),
  left: '(a + b)⁴',
  template: ['a⁴ + 4a³b + ', { slot: 0 }, 'a²b² + 4ab³ + b⁴'],
  signs: ['6', '4', '2'],
  answer: '6',
  checkNote: L(
    "Tekshiruv: 1 + 4 + 6 + 4 + 1 = 16 = 2⁴",
    'Проверка: 1 + 4 + 6 + 4 + 1 = 16 = 2⁴',
    'Check: 1 + 4 + 6 + 4 + 1 = 16 = 2⁴',
  ),
  wrongs: [
    { key: '4', hint: L("Unda yig'indi o'n to'rt chiqadi, va bu ikkining darajasi emas.", 'Тогда сумма выйдет четырнадцать, а это не степень двойки.', 'Then the sum is fourteen, and that is not a power of two.') },
    { key: '2', hint: L("Unda yig'indi o'n ikki. Ikkining darajalari: sakkiz, o'n olti, o'ttiz ikki.", 'Тогда сумма двенадцать. Степени двойки: восемь, шестнадцать, тридцать два.', 'Then the sum is twelve. The powers of two: eight, sixteen, thirty two.') },
  ],
  probe: {
    question: L("Javobni qanday tez tekshirasiz?", 'Как быстро проверить ответ?', 'How do you check the answer quickly?'),
    items: [
      { id: 'a', label: L("koeffitsientlarni qo'shish: 2 darajada n chiqsin", 'сложить коэффициенты: должна выйти 2 в степени n', 'add the coefficients: a power of two must come out'), correct: true },
      { id: 'b', label: L("qavslarni ochib ko'rish", 'раскрыть скобки', 'expand the brackets'), hint: L("Bu ishlaydi, lekin uzoq. Yig'indi bir soniyada tekshiradi.", 'Это работает, но долго. Сумма проверяет за секунду.', 'That works but takes long. The sum checks in a second.') },
      { id: 'c', label: L("javoblarga qarash", 'посмотреть в ответы', 'look at the answers'), hint: L("Imtihonda javoblar bo'lmaydi.", 'На экзамене ответов нет.', 'On the exam there are no answers.') },
      { id: 'd', label: L('hech qanday', 'никак', 'there is no way'), hint: L("Bor: yig'indi har doim ikkining darajasi.", 'Есть: сумма всегда степень двойки.', 'There is: the sum is always a power of two.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "O'rtadagi koeffitsientni qo'ying.", 'Поставь средний коэффициент.', 'Place the middle coefficient.'),
    A('checked', "Bo'ldi. Endi ta'riflang: javobni qanday tez tekshirasiz?", 'Получилось. Теперь сформулируй: как быстро проверить ответ?', 'Done. Now put it into words: how do you check quickly?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'power', label: L('b ning darajasini topish', 'найти степень b', 'find the power of b') },
  { id: 'comb', label: L('guruhlashni sanash', 'посчитать сочетание', 'compute the combination') },
  { id: 'check', label: L("yig'indi bilan tekshirish", 'проверить суммой', 'check with the sum') },
  { id: 'add', label: L("darajalarni qo'shish", 'сложить степени', 'add the powers') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'order_matters',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('(a + b)⁵,   a³b² oldida nima?', '(a + b)⁵, что перед a³b² ?', '(a + b)⁵, what stands before a³b² ?'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'power',
      to: L('b ning darajasi 2', 'степень b равна 2', 'the power of b is 2'),
      wrongs: [
        { action: 'comb', hint: L("Avval ka ni toping: guruhlashga u kerak.", 'Сначала найди ка: без него сочетание не посчитать.', 'Find k first: the combination needs it.') },
        { action: 'check', hint: L("Tekshiruv oxirida.", 'Проверка в конце.', 'The check comes at the end.') },
        { action: 'add', hint: L("Darajalarni qo'shish faqat nazorat: ular beshni beradi.", 'Сложение степеней это только контроль: они дают пять.', 'Adding the powers is only a control: they give five.') },
      ],
    },
    {
      action: 'comb',
      to: 'C(5,2) = 20 / 2 = 10',
      wrongs: [
        { action: 'power', hint: L("Topilgan: ikki.", 'Найдена: два.', 'Found: two.') },
        { action: 'check', hint: L("Avval sonni oling.", 'Сначала получи число.', 'Get the number first.') },
        { action: 'add', hint: L("Bu qadam javob bermaydi.", 'Этот шаг ответа не даёт.', 'This step gives no answer.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['10', '20', '5', '15'],
    value: ['10'],
    label: L('koeffitsient', 'коэффициент', 'coefficient'),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '20', hint: L("Bu joylashtirish. Qavslar tartibsiz tanlanadi: ikkiga bo'ling.", 'Это размещение. Скобки выбираются без порядка: подели на два.', 'That is the arrangement. Brackets are chosen without order: divide by two.') },
      { key: '5', hint: L("Beshlik bu qavslar soni. Koeffitsient esa beshtadan ikkitasini tanlash.", 'Пятёрка это число скобок. А коэффициент это выбрать две из пяти.', 'Five is the number of brackets. The coefficient is choosing two of five.') },
      { key: '*', hint: L("Besh karra to'rt bu yigirma, ikkiga bo'linsa o'nta.", 'Пять на четыре это двадцать, поделить на два десять.', 'Five times four is twenty, divided by two is ten.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi beshinchi darajada ishlaymiz.', 'Правило сформулировано. Поработаем с пятой степенью.', 'The rule is stated. Let us work with the fifth power.'),
    A('start', "Diqqat: ro'yxatda ortiqcha amal bor. Nimadan boshlashni tanlang.", 'Внимание: в списке есть лишнее действие. Выбери, с чего начать.', 'Careful: the list has one superfluous action. Choose where to start.'),
    A('step3', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'order_matters',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Koeffitsientlar yig\'indisi', 'Сумма коэффициентов', 'The sum of the coefficients'),
  start: L("(a + b)⁶ koeffitsientlari yig'indisi?", 'Сумма коэффициентов (a + b)⁶ ?', 'The sum of the coefficients of (a + b)⁶ ?'),
  actions: ACTIONS_10,
  hint: L(
    "Yig'indi bu hamma yo'llar soni: har qavsda ikki tanlov.",
    'Сумма это число всех путей: в каждой скобке два выбора.',
    'The sum is the number of all paths: two choices in each bracket.',
  ),
  steps: [
    {
      action: 'power',
      to: L('6 qavs, har birida 2 tanlov', '6 скобок, в каждой 2 выбора', '6 brackets, 2 choices each'),
      wrongs: [
        { action: 'comb', hint: L("Bu yerda bitta guruhlash emas, hammasi kerak.", 'Здесь нужно не одно сочетание, а все.', 'Here not one combination is needed but all of them.') },
        { action: 'check', hint: L("Avval nimani sanashni ayting.", 'Сначала скажи, что считаем.', 'First say what is being counted.') },
        { action: 'add', hint: L("Darajalar bu yerda hisoblanmaydi.", 'Степени здесь не считаются.', 'The powers are not counted here.') },
      ],
    },
    {
      action: 'check',
      to: '2⁶ = 64',
      wrongs: [
        { action: 'power', hint: L("Aniqlangan.", 'Определено.', 'Settled.') },
        { action: 'comb', hint: L("Bitta guruhlash emas: yig'indi hammasini oladi.", 'Не одно сочетание: сумма берёт все.', 'Not one combination: the sum takes them all.') },
        { action: 'add', hint: L("Ko'paytiriladi, qo'shilmaydi: har qavs yo'llarni ikkiga bo'ladi.", 'Умножается, а не складывается: каждая скобка удваивает пути.', 'It multiplies, not adds: each bracket doubles the paths.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['64', '12', '36', '32'],
    value: ['64'],
    label: L("yig'indi", 'сумма', 'sum'),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '12', hint: L("Bu ikki karra olti. Har qavs yo'llarni ikkiga ko'paytiradi, qo'shmaydi.", 'Это два на шесть. Каждая скобка умножает пути на два, а не прибавляет.', 'That is two times six. Each bracket multiplies the paths by two, it does not add.') },
      { key: '32', hint: L("Bu beshinchi daraja uchun. Qavs esa oltita.", 'Это для пятой степени. А скобок шесть.', 'That is for the fifth power. But there are six brackets.') },
      { key: '*', hint: L("Ikkini olti marta ko'paytiring.", 'Умножь два шесть раз.', 'Multiply two six times.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Bu safar bitta koeffitsient emas, hammasining yig'indisi so'ralyapti. Bu esa hamma yo'llar soni.", 'На этот раз спрашивают не один коэффициент, а сумму всех. А это число всех путей.', 'This time not one coefficient is asked but the sum of all. And that is the number of all paths.'),
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
      id: 'b1', tag: 'order_matters', ask: true, cols: 4,
      done: '(a + b)³:  1, 3, 3, 1',
      prompt: L('(a + b)³ da ab² oldida?', 'Что перед ab² в (a + b)³ ?', 'What stands before ab² in (a + b)³ ?'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '1', hint: L("Bir chetlarda turadi: a kub va be kub oldida.", 'Единица по краям: перед a в кубе и be в кубе.', 'One is at the ends: before a cubed and b cubed.') },
        { id: 'c', label: '2', hint: L("Ikkilik ikkinchi darajada bo'lgan. Uchinchida uchlik.", 'Двойка была во второй степени. В третьей тройка.', 'Two was in the second power. In the third it is three.') },
        { id: 'd', label: '6', hint: L("Oltilik to'rtinchi darajaning o'rtasida.", 'Шестёрка в середине четвёртой степени.', 'Six is in the middle of the fourth power.') },
      ],
    },
    {
      id: 'b2', tag: 'order_matters', ask: true, cols: 4,
      done: '(a + b)⁴:  1, 4, 6, 4, 1',
      prompt: L('(a + b)⁴ da a²b² oldida?', 'Что перед a²b² в (a + b)⁴ ?', 'What stands before a²b² in (a + b)⁴ ?'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '4', hint: L("To'rtlik qo'shni hadlarda: a kub be va a be kub oldida.", 'Четвёрка у соседних членов: перед a в кубе be и a be в кубе.', 'Four is at the neighbouring terms.') },
        { id: 'c', label: '2', hint: L("To'rttadan ikkitasini tanlash oltita usulda.", 'Выбрать две из четырёх можно шестью способами.', 'Choosing two of four gives six ways.') },
        { id: 'd', label: '8', hint: L("Sakkiz bu uchinchi darajadagi yo'llar soni.", 'Восемь это число путей в третьей степени.', 'Eight is the number of paths in the third power.') },
      ],
    },
    {
      id: 'b3', tag: 'order_matters', ask: true, cols: 4,
      done: L("yig'indi = 2⁵ = 32", 'сумма = 2⁵ = 32', 'sum = 2⁵ = 32'),
      prompt: L("(a + b)⁵ koeffitsientlari yig'indisi?", 'Сумма коэффициентов (a + b)⁵ ?', 'The sum of the coefficients of (a + b)⁵ ?'),
      items: [
        { id: 'a', label: '32', correct: true },
        { id: 'b', label: '10', hint: L("Bu ikki karra besh. Har qavs yo'llarni ikkilantiradi.", 'Это два на пять. Каждая скобка удваивает пути.', 'That is two times five. Each bracket doubles the paths.') },
        { id: 'c', label: '16', hint: L("Bu to'rtinchi daraja uchun.", 'Это для четвёртой степени.', 'That is for the fourth power.') },
        { id: 'd', label: '25', hint: L("Bu besh kvadrat. Kerak esa ikki darajada besh.", 'Это пять в квадрате. А нужно два в пятой.', 'That is five squared. But two to the fifth is needed.') },
      ],
    },
    {
      id: 'b4', tag: 'order_matters', ask: true, cols: 2,
      done: L('b ning darajasi', 'степень b', 'the power of b'),
      prompt: L("C(n,k) dagi k nimaga teng?", 'Чему равно k в C(n,k) ?', 'What does k equal in C(n,k) ?'),
      items: [
        { id: 'a', label: L("b ning darajasi", 'степень b', 'the power of b'), correct: true },
        { id: 'b', label: L("a ning darajasi", 'степень a', 'the power of a'), hint: L("Simmetriya tufayli javob ba'zan mos keladi, lekin qoida be bo'yicha.", 'Из-за симметрии ответ иногда совпадает, но правило по be.', 'Symmetry makes the answers sometimes coincide, but the rule goes by b.') },
        { id: 'c', label: L('qavslar soni', 'число скобок', 'the number of brackets'), hint: L("Qavslar soni bu en, ka emas.", 'Число скобок это эн, а не ка.', 'The number of brackets is n, not k.') },
        { id: 'd', label: L("hadning nomeri", 'номер члена', 'the number of the term'), hint: L("Nomer birdan boshlanadi, ka esa noldan.", 'Номер начинается с единицы, а ка с нуля.', 'The number starts at one, k starts at zero.') },
      ],
    },
    {
      id: 'b5', tag: 'order_matters', ask: true, cols: 4,
      done: L('chetlarda har doim 1', 'по краям всегда 1', 'the ends are always 1'),
      prompt: L("(a + b)⁷ da b⁷ oldida?", 'Что перед b⁷ в (a + b)⁷ ?', 'What stands before b⁷ in (a + b)⁷ ?'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '7', hint: L("Yettilik qo'shni hadda: a be oltinchi darajada oldida.", 'Семёрка у соседнего члена: перед a be в шестой.', 'Seven is at the neighbouring term.') },
        { id: 'c', label: '0', hint: L("Bunday had bor: hamma qavsdan be olinadi.", 'Такой член есть: be берётся из всех скобок.', 'Such a term exists: b is taken from every bracket.') },
        { id: 'd', label: '21', hint: L("Yigirma bir bu C dan yetti, ikki. Bu boshqa had.", 'Двадцать один это C из семи по два. Это другой член.', 'Twenty one is C of seven, two. That is a different term.') },
      ],
    },
    {
      id: 'b6', tag: 'check_by_point', ask: true, cols: 2,
      done: L("yig'indi 2 darajada n", 'сумма это 2 в степени n', 'the sum is 2 to the n'),
      prompt: L(
        "Koeffitsientlarni qanday tekshirasiz?",
        'Как проверить коэффициенты?',
        'How do you check the coefficients?',
      ),
      items: [
        { id: 'a', label: L("ularni qo'shish: 2 darajada n chiqsin", 'сложить их: должна выйти 2 в степени n', 'add them: a power of two must come out'), correct: true },
        { id: 'b', label: L('qavslarni ochish', 'раскрыть скобки', 'expand the brackets'), hint: L("Ishlaydi, lekin uzoq.", 'Работает, но долго.', 'It works but takes long.') },
        { id: 'c', label: L('yodlash', 'выучить наизусть', 'memorise them'), hint: L("Yodlash tekshiruv emas.", 'Заучивание это не проверка.', 'Memorising is not a check.') },
        { id: 'd', label: L('hech qanday', 'никак', 'there is no way'), hint: L("Bor, va u bir soniya oladi.", 'Есть, и она занимает секунду.', 'There is, and it takes a second.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "To'rtinchi daraja.", 'Четвёртая степень.', 'The fourth power.'),
    A('q3', "Endi yig'indi.", 'Теперь сумма.', 'Now the sum.'),
    A('q4', "Ka haqida.", 'Про ка.', 'About k.'),
    A('q5', "Chekka had.", 'Крайний член.', 'The edge term.'),
    A('q6', 'Oxirgi savol, tekshiruv haqida.', 'Последний вопрос, про проверку.', 'The last question, about checking.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: daraja va koeffitsient chalkashgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'order_matters',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Yig'indi xatoni fosh qiladi", 'Сумма разоблачает ошибку', 'The sum exposes the error'),
  rows: [
    { id: 'r1', text: '(a + b)⁴' },
    { id: 'r2', text: '1,  4,  4,  4,  1' },
    { id: 'r3', text: L("yig'indi: 14", 'сумма: 14', 'sum: 14') },
    { id: 'r4', text: L('javob: 1, 4, 4, 4, 1', 'ответ: 1, 4, 4, 4, 1', 'answer: 1, 4, 4, 4, 1') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r3: L("Yig'indi to'g'ri sanalgan: bu satrdagi sonlar haqiqatan o'n to'rt beradi. Aynan shu satr oldingisining xato ekanini ko'rsatadi.", 'Сумма посчитана верно: числа этой строки действительно дают четырнадцать. Именно она и показывает, что предыдущая неверна.', 'The sum is computed correctly: those numbers really give fourteen. And it is this line that shows the previous one is wrong.'),
    r4: L("Javob xato, lekin u oldin xato bo'lgan.", 'Ответ неверный, но неверным он стал раньше.', 'The answer is wrong, but it became wrong earlier.'),
  },
  proofPoint: L("14 ikkining darajasi emas", '14 не степень двойки', '14 is not a power of two'),
  proof: L(
    "Koeffitsientlarning yig'indisi har doim ikkining darajasi bo'lishi kerak, chunki bu hamma yo'llar soni. To'rtinchi darajada bu o'n olti. O'n to'rt esa ikkining darajasi emas. O'rtadagi son to'rt emas, olti bo'lishi kerak edi.",
    'Сумма коэффициентов обязана быть степенью двойки, потому что это число всех путей. Для четвёртой степени это шестнадцать. А четырнадцать степенью двойки не является. Среднее число должно было быть шесть, а не четыре.',
    'The sum of the coefficients must be a power of two, because it is the number of all paths. For the fourth power that is sixteen. Fourteen is not a power of two. The middle number had to be six, not four.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("o'rtadagi koeffitsient noto'g'ri", 'неверный средний коэффициент', 'the middle coefficient is wrong'), correct: true },
      { id: 'b', label: L("chetlarda bir turmasligi kerak", 'по краям не должно быть единиц', 'the ends should not be ones'), hint: L("Chetlarda har doim bir: hamma qavsdan bitta harf olinadi.", 'По краям всегда единица: из всех скобок берётся одна буква.', 'The ends are always one: the same letter from every bracket.') },
      { id: 'c', label: L("hadlar soni xato", 'неверное число членов', 'the wrong number of terms'), hint: L("Hadlar beshta, va bu to'g'ri: daraja plyus bir.", 'Членов пять, и это верно: степень плюс один.', 'There are five terms, and that is right: the power plus one.') },
      { id: 'd', label: L("yig'indi noto'g'ri sanalgan", 'сумма посчитана неверно', 'the sum is computed wrongly'), hint: L("Yig'indi to'g'ri, va aynan u xatoni ko'rsatdi.", 'Сумма верна, и именно она показала ошибку.', 'The sum is right, and it is what showed the error.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda hadlar soni to'g'ri va chetlari ham to'g'ri. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь число членов верно и края верны. Найди строку, в которой ошибка появилась впервые.', 'Here the number of terms is right and the ends are right. Find the line where the error first appeared.'),
    A('proof', "Tekshiruv yig'indi bilan. Koeffitsientlar yig'indisi ikkining darajasi bo'lishi shart, chunki bu hamma yo'llar soni. To'rtinchi darajada o'n olti kerak, chiqqani esa o'n to'rt. Demak o'rtadagi son ikki barobar kichik olingan.", 'Проверка суммой. Сумма коэффициентов обязана быть степенью двойки, ведь это число всех путей. Для четвёртой степени нужно шестнадцать, а вышло четырнадцать. Значит среднее число взято меньше на два.', 'A check by the sum. The sum of the coefficients must be a power of two, since it is the number of all paths. The fourth power needs sixteen, but fourteen came out. So the middle number was taken two too small.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'order_matters',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Hadni yig\'ing', 'Собери член', 'Build the term'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L("darajalar yig'indisi n ga teng", 'сумма степеней равна n', 'the powers add up to n'),
  tasks: [
    {
      prompt: L('(a + b)⁴,   b ikki marta', '(a + b)⁴, be дважды', '(a + b)⁴, b twice'),
      template: [{ slot: 0 }, ' a²b', { slot: 1 }],
      parts: ['6', '4', '²', '³'],
      answer: ['6', '²'],
      doneLabel: '6a²b²',
      wrongs: [
        { key: '4|²', hint: L("To'rtlik qo'shni hadda. O'rtada C dan to'rt, ikki, ya'ni olti.", 'Четвёрка у соседнего члена. В середине C из четырёх по два, то есть шесть.', 'Four is at the neighbouring term. In the middle C of four, two, that is six.') },
        { key: '*', hint: L("Darajalar yig'indisi to'rtga teng bo'lishi kerak.", 'Сумма степеней должна равняться четырём.', 'The powers must add up to four.') },
      ],
    },
    {
      prompt: L('(a + b)⁵,   b uch marta', '(a + b)⁵, be трижды', '(a + b)⁵, b three times'),
      template: [{ slot: 0 }, ' a²b', { slot: 1 }],
      parts: ['10', '5', '³', '²'],
      answer: ['10', '³'],
      doneLabel: '10a²b³',
      wrongs: [
        { key: '5|³', hint: L("Beshlik bu qavslar soni. Koeffitsient esa beshtadan uchtasini tanlash: o'nta.", 'Пятёрка это число скобок. А коэффициент это выбрать три из пяти: десять.', 'Five is the number of brackets. The coefficient is choosing three of five: ten.') },
        { key: '*', hint: L("Ikki plyus uch bu besh: darajalar to'g'ri.", 'Два плюс три это пять: степени верны.', 'Two plus three is five: the powers are right.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi, va u yerda daraja beshinchi.", 'А теперь второе, и там пятая степень.', 'And now the second one, with the fifth power.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'order_matters',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'C(n, k)',
  ruleLines: [
    L("koeffitsient bu yo'llar soni", 'коэффициент это число путей', 'the coefficient is the number of paths'),
    L("k bu b ning darajasi", 'k это степень b', 'k is the power of b'),
    L("tekshiruv: koeffitsientlar yig'indisi 2^n", 'проверка: сумма коэффициентов = 2^n', 'a check: the coefficients add to 2^n'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('(a + b)³ dagi uchlik', 'тройка в (a + b)³', 'the three in (a + b)³'),
      right: L("yo'llar soni", 'число путей', 'the number of paths'),
      map: {
        a: L('sababsiz', 'без причины', 'no reason'),
        b: L("yo'llar soni", 'число путей', 'the number of paths'),
        both: '—',
        none: '—',
      },
    },
    {
      screen: 5,
      expr: '(a + b)⁴,   a²b²',
      right: '6',
      map: { a: '6', b: '4', c: '8', d: '2' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '3a²b:   C(3,1) = 3',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L("Bo'yalgan yo'llar ekraniga qayting", 'Вернись к экрану с подсвеченными путями', 'Go back to the highlighted-paths screen'),
  },
  probe: {
    question: L(
      "Nega kombinatorika algebraik formulaga kirib keldi?",
      'Почему комбинаторика оказалась в алгебраической формуле?',
      'Why did combinatorics turn up in an algebraic formula?',
    ),
    items: [
      { id: 'a', label: L("qavs ochish bu har qavsdan tanlash", 'раскрытие скобок это выбор из каждой скобки', 'expanding brackets is a choice from each bracket'), correct: true },
      { id: 'b', label: L('tasodifan', 'случайно', 'by chance'), hint: L("Tasodif emas: har had bu bitta tanlovlar to'plami.", 'Не случайно: каждый член это один набор выборов.', 'Not by chance: each term is one set of choices.') },
      { id: 'c', label: L("shunday kelishilgan", 'так договорились', 'that is the convention'), hint: L("Kelishuv emas: yo'llarni sanab ko'rdik.", 'Не договорённость: мы пересчитали пути.', 'Not a convention: we counted the paths.') },
      { id: 'd', label: L("faktorial ikkalasida ham bor", 'факториал есть и там и там', 'the factorial appears in both'), hint: L("Bu tashqi o'xshashlik. Sabab chuqurroq: ochish bu tanlash.", 'Это внешнее сходство. Причина глубже: раскрытие это выбор.', 'That is a surface likeness. The reason is deeper: expanding is choosing.') },
    ],
  },
  sheetTitle: L('Nyuton binomi · shpargalka', 'Бином Ньютона · шпаргалка', "Newton's binomial · cheat sheet"),
  sheetSrc: L('11-sinf · 19-dars', '11 класс · урок 19', 'Grade 11 · lesson 19'),
  lifehack: L(
    "Koeffitsientlarni yozgach, ularni qo'shing. Ikkining darajasi chiqmasa, xato bor.",
    'Сложи коэффициенты: не вышла степень двойки, значит где-то ошибка.',
    'Once the coefficients are written, add them. If no power of two comes out, there is a mistake.',
  ),
  holds: [2500, 7000, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Uchlik yodlanadigan son emas: bu uchta yo'l, va biz ularni bo'yab sanadik.", 'Вот твои прогнозы и вот как оказалось. Тройка это не число для заучивания: это три пути, и мы их подсветили и пересчитали.', 'Here are your guesses and here is how it turned out. The three is not a number to memorise: it is three paths, and we highlighted and counted them.'),
    A('rule', "Va mana asosiy fikr. Qavs ochish bu har qavsdan bitta harf tanlash. Shuning uchun koeffitsient bu tanlash usullari soni, ya'ni guruhlash. Kombinatorika bu yerga tasodifan tushmagan: u shu yerda yashaydi.", 'И вот главная мысль. Раскрытие скобок это выбор одной буквы из каждой скобки. Поэтому коэффициент это число способов выбрать, то есть сочетание. Комбинаторика попала сюда не случайно: она здесь и живёт.', 'And here is the main point. Expanding brackets is choosing one letter from each bracket. That is why the coefficient is the number of ways to choose, a combination. Combinatorics did not land here by chance: it lives here.'),
    A('q', "Oxirgi savol: nega kombinatorika algebraik formulaga kirib keldi?", 'Последний вопрос: почему комбинаторика оказалась в алгебраической формуле?', 'The last question: why did combinatorics turn up in an algebraic formula?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
