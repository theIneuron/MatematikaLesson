// ============================================================================
// 11-sinf, Dars 24. BINOMIAL VA NORMAL TAQSIMOT.
//
// B3 blokining SAKKIZINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/BLOK3_SKELET.md, «24-dars» bo'limi
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// DARSNING BITTA GAPI: bitta tajriba ko'p marta takrorlansa, natijalar
// qo'ng'iroqqa yig'iladi; uning o'rtasi eng ehtimolli, LEKIN kafolat emas.
//
// Asbob: `FrequencyBoard` ustunlar rejimida, `steps` bilan -- seriyalar
// to'planib boradi va qo'ng'iroq ko'z oldida o'sadi. Sonlar dars ichida
// yozilgan: tasodifiy generator har yuklanishda boshqa rasm berardi.
//
// Sonlar tekshirilgan: C(10,k) qatori 1, 10, 45, 120, 210, 252, 210, 120,
// 45, 10, 1; yig'indisi 1024 = 2^10; 252/1024 = 0,246.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_24',
  title: L('Binomial va normal taqsimot', 'Биномиальное и нормальное распределения', 'Binomial and normal distributions'),
}

const BLOCK = { label: 'B3', from: 16, to: 24, current: 24 }

// Sinov mashinasi: 20, 60 va 100 seriya. Har bir massiv nol orildan
// o'n orilgacha, yig'indisi seriyalar soniga teng.
const TRIALS = [
  [0, 0, 1, 3, 4, 5, 4, 2, 1, 0, 0],
  [0, 1, 3, 7, 13, 15, 12, 6, 2, 1, 0],
  [0, 1, 4, 12, 21, 24, 20, 11, 5, 2, 0],
]

const KBARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((k) => ({ label: k, tone: k === '5' ? 'accent' : 'graph' }))

// ============================================================
// SLAYD 1. XUK. O'nta tanga.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Binomial taqsimot', 'Биномиальное распределение', 'The binomial distribution'),
  title: L("O'nta tanga", 'Десять монет', 'Ten coins'),
  expr: L('nechta orol?', 'сколько орлов?', 'how many heads?'),
  rows: [
    {
      id: 'a',
      name: L('birinchi', 'первый', 'the first'),
      value: L("roppa rosa 5 ehtimolliroq", 'вероятнее ровно 5', 'exactly 5 is likelier'),
    },
    {
      id: 'b',
      name: L('ikkinchi', 'второй', 'the second'),
      value: L('hammasi bir xil', 'всё равно', 'all the same'),
    },
  ],
  probe: {
    question: L('Qaysi natija ehtimolliroq?', 'Какой исход вероятнее?', 'Which outcome is likelier?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi hamma natijani sanaymiz.",
      'Твой ответ записан. Сейчас пересчитаем все исходы.',
      'Your answer is saved. Now we will count every outcome.',
    ),
    items: [
      { id: 'a', label: '5' },
      { id: 'b', label: '0' },
      { id: 'both', label: '10' },
      { id: 'none', label: L('bir xil', 'всё равно', 'all the same') },
    ],
  },
  holds: [5000, 5000, 4500, 4000],
  audio: [
    A('mount', "Blokning oxirgi tajribasi. Bitta tanga bilan hammasi oddiy edi. Endi ularni birdaniga o'nta olamiz.", 'Последний опыт блока. С одной монетой всё было просто. Теперь возьмём их сразу десять.', 'The last experiment of the block. With one coin everything was simple. Now let us take ten at once.'),
    A('r1', "O'nta tangani tashlaymiz va orollarni sanaymiz. Birinchi fikr: roppa rosa beshta orol ehtimolliroq.", 'Бросаем десять монет и считаем орлов. Первое мнение: вероятнее ровно пять орлов.', 'We toss ten coins and count the heads. The first opinion: exactly five heads is likelier.'),
    A('r2', "Ikkinchi fikr: hammasi bir xil, chunki har qanday natija tasodifiy.", 'Второе мнение: всё равно, ведь любой исход случаен.', 'The second opinion: all the same, since any outcome is random.'),
    A('ask', "Sizningcha qaysi natija ehtimolliroq? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какой исход вероятнее? Пока просто предположи.', 'Which outcome do you think is likelier? Just make a guess for now.'),
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
    "Uchtasi ham shu blokdan: 18, 20 va 21-darslardan. Bu baholanmaydi.",
    'Все три из этого блока: уроки 18, 20 и 21. Это не оценивается.',
    'All three from this block: lessons 18, 20 and 21. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Birlashmalar', 'Сочетания', 'Combinations'),
      short: L('18-darsdan', 'из урока 18', 'from lesson 18'),
      ex: [{ e: 'C(10, 5) = 252', why: L('tartib muhim emas', 'порядок не важен', 'order does not matter') }],
    },
    {
      id: 'c2',
      title: L('Hamma natija', 'Все исходы', 'All outcomes'),
      short: L('21-darsdan', 'из урока 21', 'from lesson 21'),
      ex: [{ e: '2^10 = 1024', why: L("har tangada ikkitadan", 'на каждую монету по два', 'two per coin') }],
    },
    {
      id: 'c3',
      title: L('Ehtimollik', 'Вероятность', 'Probability'),
      short: L('20-darsdan', 'из урока 20', 'from lesson 20'),
      ex: [{ e: L('qulay / hammasi', 'благоприятные / все', 'favourable / all'), why: L('ulush, foiz emas', 'доля, не процент', 'a share, not a percent') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L("2 ni 10 marta ko'paytirsak?", 'Два умножить само на себя 10 раз?', 'Two multiplied by itself 10 times?'),
      cols: 4,
      items: [
        { id: 'a', label: '1024', correct: true },
        { id: 'b', label: '20', hint: L("Bu ikkini o'nga ko'paytirish. Bizga esa o'nta ikkilikning ko'paytmasi kerak.", 'Это два умножить на десять. А нужно произведение десяти двоек.', 'That is two times ten. We need the product of ten twos.') },
        { id: 'c', label: '512', hint: L("Bu to'qqizta tanga uchun. O'ninchisi yana ikkiga ko'paytiradi.", 'Это для девяти монет. Десятая умножает ещё на два.', 'That is for nine coins. The tenth multiplies by two more.') },
        { id: 'd', label: '100', hint: L("Bu o'n karra o'n.", 'Это десять на десять.', 'That is ten times ten.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('C(10, 5) nechaga teng?', 'Чему равно C(10, 5)?', 'What is C(10, 5)?'),
      cols: 4,
      items: [
        { id: 'a', label: '252', correct: true },
        { id: 'b', label: '50', hint: L("Bu o'n karra besh. Birlashmalar boshqacha sanaladi.", 'Это десять на пять. Сочетания считаются иначе.', 'That is ten times five. Combinations are counted differently.') },
        { id: 'c', label: '120', hint: L("Bu C o'ndan uchdan. Beshtasi ko'proq.", 'Это C из десяти по три. Для пяти больше.', 'That is C of ten choose three. For five it is more.') },
        { id: 'd', label: '1024', hint: L("Bu hamma natija soni, beshta orolniki emas.", 'Это число всех исходов, а не пяти орлов.', 'That is the count of all outcomes, not of five heads.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('Ehtimollik qanday topiladi?', 'Как находят вероятность?', 'How is a probability found?'),
      cols: 2,
      items: [
        { id: 'a', label: L('qulay / hammasi', 'благоприятные / все', 'favourable / all'), correct: true },
        { id: 'b', label: L('hammasi / qulay', 'все / благоприятные', 'all / favourable'), hint: L("Teskari: unda javob birdan katta chiqadi.", 'Наоборот: тогда ответ выйдет больше единицы.', 'The other way round: then the answer exceeds one.') },
        { id: 'c', label: L('qulay · hammasi', 'благоприятные · все', 'favourable · all'), hint: L("Ko'paytirish ikkita hodisa uchun edi. Bu yerda ulush kerak.", 'Умножение было для двух событий. Здесь нужна доля.', 'Multiplying was for two events. Here a share is needed.') },
        { id: 'd', label: L("qulay − hammasi", 'благоприятные − все', 'favourable − all'), hint: L("Ayirish manfiy son beradi.", 'Вычитание даст отрицательное число.', 'Subtracting gives a negative number.') },
      ],
    },
  ],
  holds: [3000, 4500, 4500, 4500, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch o'n sakkizinchi darsdan: birlashmalar. C o'ndan beshdan ikki yuz ellik ikkiga teng: o'nta tangadan beshtasini tanlashning shuncha usuli bor.", 'Первая опора из восемнадцатого урока: сочетания. C из десяти по пять равно двести пятьдесят два: столько способов выбрать пять монет из десяти.', 'The first basic from lesson eighteen: combinations. C of ten choose five is two hundred and fifty two: that many ways to pick five coins of ten.'),
    A('c2', "Ikkinchi tayanch: hamma natija soni. Har tangada ikkitadan, o'nta tanga, demak ikki o'ninchi darajada, ya'ni ming yigirma to'rt.", 'Вторая опора: число всех исходов. На каждую монету по два, монет десять, значит два в десятой степени, то есть тысяча двадцать четыре.', 'The second basic: the count of all outcomes. Two per coin, ten coins, so two to the tenth, that is one thousand and twenty four.'),
    A('c3', "Uchinchi tayanch yigirmanchi darsdan: ehtimollik bu qulaylarning hammaga nisbati.", 'Третья опора из двадцатого урока: вероятность это отношение благоприятных ко всем.', 'The third basic from lesson twenty: probability is favourable over all.'),
    A('recap', "Uchtasi birga bugungi javobni beradi.", 'Три вместе и дают сегодняшний ответ.', 'The three together give today\'s answer.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. USULLARNI SANAYMIZ.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'bell_middle',
  eyebrow: L('Usullarni sanaymiz', 'Посчитаем способы', 'Let us count the ways'),
  title: L('Nechta usul bor', 'Сколько способов', 'How many ways'),
  expr: L('10 tanga,  jami 1024', '10 монет, всего 1024', '10 coins, 1024 in all'),
  goal: L('qaysi natija ko\'p usulda chiqadi', 'какой исход даёт больше способов', 'which outcome has more ways'),
  rule: L(
    "Har bir orollar soni uchun usullar sonini sanaymiz.",
    'Для каждого числа орлов посчитаем число способов.',
    'For each number of heads let us count the ways.',
  ),
  pick: L('Nechta orolni sanaymiz?', 'Сколько орлов посчитаем?', 'How many heads shall we count?'),
  claims: [
    { id: 'a', key: 'inA', name: L('chekka', 'край', 'the edge'), value: '1' },
    { id: 'b', key: 'inB', name: L("o'rta", 'середина', 'the middle'), value: '252' },
  ],
  points: [
    {
      id: 'q1', label: L('0 orol', '0 орлов', '0 heads'), num: '1', step: 'calc', verdict: 'out',
      role: L('bitta usul', 'один способ', 'one way'),
      calc: L('hammasi raqam', 'все решки', 'all tails'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q2', label: L('3 orol', '3 орла', '3 heads'), num: '120', step: 'calc', verdict: 'out',
      role: L('o\'rtadan uzoq', 'далеко от середины', 'far from the middle'),
      calc: 'C(10, 3) = 120',
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q3', label: L('5 orol', '5 орлов', '5 heads'), num: '252', step: 'calc', verdict: 'in',
      role: L('eng ko\'p usul', 'больше всего способов', 'the most ways'),
      calc: 'C(10, 5) = 252',
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Qaysi natija ehtimolliroq?", 'Какой исход вероятнее?', 'Which outcome is likelier?'),
    items: [
      {
        id: 'a', label: '5', correct: true,
        ok: L(
          "To'g'ri. Beshta orol ikki yuz ellik ikki usulda chiqadi, nolta orol esa bittada. Farq ikki yuz ellik ikki barobar.",
          'Верно. Пять орлов получаются двумястами пятьюдесятью двумя способами, ноль орлов одним. Разница в двести пятьдесят два раза.',
          'Correct. Five heads arise in two hundred and fifty two ways, zero heads in one. A two hundred and fifty two fold gap.',
        ),
      },
      {
        id: 'b', label: '0',
        hint: L("Nolta orol faqat bitta usulda chiqadi: hamma tanga raqam bo'lishi kerak.", 'Ноль орлов получается единственным способом: все монеты должны быть решкой.', 'Zero heads arises in exactly one way: every coin must be tails.'),
      },
      {
        id: 'both', label: '10',
        hint: L("O'nta orol ham bitta usulda: hamma tanga orol.", 'Десять орлов тоже одним способом: все монеты орлы.', 'Ten heads also in one way: every coin heads.'),
      },
      {
        id: 'none', label: L('bir xil', 'всё равно', 'all the same'),
        hint: L("Bir xil emas: har bir tanga ketma ketligi teng ehtimolli, lekin orollar soni emas. Beshtaga ko'p ketma ketlik to'g'ri keladi.", 'Не всё равно: равновероятна каждая последовательность монет, но не число орлов. На пятёрку приходится больше последовательностей.', 'Not the same: every sequence of coins is equally likely, but not every count of heads. Five has more sequences.'),
      },
    ],
  },
  holds: [2500, 6500, 1500, 2500, 10000, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi usullarni sanaymiz.', 'Опора восстановлена. Теперь посчитаем способы.', 'The basics are back. Now let us count the ways.'),
    A('mount', "Har bir orollar soni uchun usullar sonini topamiz. Bu o'n sakkizinchi darsdagi birlashmalar.", 'Для каждого числа орлов найдём число способов. Это сочетания из восемнадцатого урока.', 'For each number of heads we find the number of ways. Those are the combinations from lesson eighteen.'),
    A('mount', "Nechta orolni sanashni tanlang.", 'Выбери, сколько орлов посчитать.', 'Choose how many heads to count.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana asosiysi. Nolta orol bitta usulda chiqadi: hamma tanga raqam bo'lishi shart. Beshta orol esa ikki yuz ellik ikki usulda. Ketma ketliklar teng ehtimolli, lekin beshtalikka ulardan ancha ko'pi to'g'ri keladi. Shuning uchun o'rta chekkadan ehtimolliroq.", 'Вот главное. Ноль орлов получается одним способом: все монеты обязаны быть решкой. А пять орлов двумястами пятьюдесятью двумя способами. Последовательности равновероятны, но на пятёрку их приходится гораздо больше. Поэтому середина вероятнее края.', 'Here is the key. Zero heads arises one way: every coin must be tails. Five heads arises in two hundred and fifty two ways. Sequences are equally likely, but far more of them land on five. That is why the middle beats the edge.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: SINOV MASHINASI.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'bell_middle',
  eyebrow: L('Sinov mashinasi', 'Машина испытаний', 'The trial machine'),
  title: L("Yuz seriya, va qo'ng'iroq", 'Сто серий, и колокол', 'A hundred series, and a bell'),
  chip: L('har seriya: 10 tanga', 'серия: 10 монет', 'a series: 10 coins'),
  cells: {
    mode: 'bars',
    bars: KBARS,
    steps: TRIALS,
    barMax: 26,
    caption: L('ustun: shuncha orol tushgan seriyalar', 'столбик: серий с таким числом орлов', 'a bar: series with that many heads'),
    height: 114,
  },
  cellSteps: 3,
  bonus: L(
    "Yigirma seriyada shakl noaniq. Yuztada esa qo'ng'iroq: o'rtada baland, chekkalarda deyarli bo'sh. Nolta va o'nta orol yuz seriyada bir marta ham chiqmadi.",
    'На двадцати сериях форма неясна. На ста уже колокол: в середине высоко, по краям почти пусто. Ноль и десять орлов за сто серий не выпали ни разу.',
    'At twenty series the shape is unclear. At a hundred it is a bell: high in the middle, nearly empty at the edges. Zero and ten heads did not occur once in a hundred series.',
  ),
  probe: {
    question: L("Nega chekkalar bo'sh?", 'Почему края пустые?', 'Why are the edges empty?'),
    items: [
      { id: 'a', label: L("u yerda usul kam", 'туда ведёт мало способов', 'few ways lead there'), correct: true },
      { id: 'b', label: L("nolta orol bo'lishi mumkin emas", 'ноль орлов невозможен', 'zero heads is impossible'), hint: L("Mumkin, lekin bitta usulda: ming yigirma to'rtdan biri.", 'Возможен, но одним способом: один шанс из тысячи двадцати четырёх.', 'It is possible, but one way only: one chance in one thousand and twenty four.') },
      { id: 'c', label: L('tangalar buzuq', 'монеты кривые', 'the coins are biased'), hint: L("Tangalar to'g'ri: shakl to'g'ri tangada aynan shunday chiqadi.", 'Монеты честные: у честных монет форма именно такая.', 'The coins are fair: fair coins give exactly this shape.') },
      { id: 'd', label: L('seriya kam', 'мало серий', 'too few series'), hint: L("Seriya ko'paytirsak, shakl faqat aniqroq bo'ladi: chekkalar baribir past qoladi.", 'Увеличив число серий, форма станет только чётче: края всё равно останутся низкими.', 'With more series the shape only sharpens: the edges stay low.') },
    ],
  },
  holds: [4500, 5500, 2900, 7000],
  audio: [
    A('mount', "Usullar sanaldi. Endi tajriba qilamiz: har seriyada o'nta tanga, va orollar soni ustida ustun o'sadi.", 'Способы посчитаны. Теперь опыт: в каждой серии десять монет, и над числом орлов растёт столбик.', 'The ways are counted. Now an experiment: ten coins per series, and a bar grows above the number of heads.'),
    A('one', "Yigirma seriya. Hozircha shakl noaniq: ustunlar past va tarqoq.", 'Двадцать серий. Пока форма неясна: столбики низкие и разбросанные.', 'Twenty series. The shape is unclear so far: low, scattered bars.'),
    A('two', "Oltmish seriya. O'rta ko'tarila boshladi.", 'Шестьдесят серий. Середина начала подниматься.', 'Sixty series. The middle has started to rise.'),
    A('three', "Yuz seriya. Endi shakl aniq: bu qo'ng'iroq. O'rtasi eng baland, chekkalari deyarli bo'sh. Va bu tasodif emas: ustunlar balandligi biz sanagan usullar soniga mos keladi. O'rtada ikki yuz ellik ikki usul, chekkada bitta.", 'Сто серий. Теперь форма ясна: это колокол. Середина самая высокая, края почти пусты. И это не случайность: высоты столбиков повторяют посчитанные нами способы. В середине двести пятьдесят два способа, с краю один.', 'A hundred series. Now the shape is clear: a bell. The middle is highest, the edges nearly empty. And this is no accident: the bar heights repeat the ways we counted. Two hundred and fifty two in the middle, one at the edge.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'bell_middle',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Ustun balandligi', 'Высота столбика', 'The height of a bar'),
  rows: ['P(k) = C(10, k) / 1024', 'P(5) = 252 / 1024 = 0,246'],
  probe: {
    question: L(
      "Roppa rosa 3 orol ehtimolligi?",
      'Вероятность ровно 3 орлов?',
      'The chance of exactly 3 heads?',
    ),
    items: [
      { id: 'a', label: '0,117', correct: true },
      { id: 'b', label: '0,246', hint: L("Bu beshta orolniki. Uchtasi uchun usullar kamroq: yuz yigirma.", 'Это для пяти орлов. Для трёх способов меньше: сто двадцать.', 'That is for five heads. Three has fewer ways: a hundred and twenty.') },
      { id: 'c', label: '0,3', hint: L("Uch bo'lingan o'n emas: ehtimollik usullar sonidan chiqadi.", 'Не три десятых: вероятность идёт от числа способов.', 'Not three tenths: the probability comes from the number of ways.') },
      { id: 'd', label: '0,001', hint: L("Bu nolta yoki o'nta orolniki: u yerda bitta usul.", 'Это для нуля или десяти орлов: там один способ.', 'That is for zero or ten heads: one way there.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Binomial', 'Правило 1. Биномиальное', 'Rule 1. Binomial'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'P(k) = C(n, k) / 2^n',
    lines: [
      L("yuqorida: shuncha orol chiqadigan usullar soni", 'сверху: число способов получить столько орлов', 'above: the number of ways to get that many heads'),
      L("pastda: hamma natijalar soni", 'снизу: число всех исходов', 'below: the number of all outcomes'),
      L("yuqoridagi son Paskal uchburchagining bir satri", 'верхнее число это строка треугольника Паскаля', 'the top number is a row of Pascal triangle'),
      L("shuning uchun shakl qo'ng'iroqqa o'xshaydi", 'поэтому форма и похожа на колокол', 'that is why the shape looks like a bell'),
    ],
    example: L('misol:  252 / 1024 = 0,246', 'пример:  252 / 1024 = 0,246', 'example:  252 / 1024 = 0,246'),
  },
  holds: [4000, 6500, 4500],
  audio: [
    A('mount', "Shakl ko'rildi. Endi uni formula bilan yozamiz.", 'Форму увидели. Теперь запишем её формулой.', 'We saw the shape. Now let us write it as a formula.'),
    A('def', "Ustun balandligi oddiy nisbat: yuqorida shuncha orol chiqadigan usullar soni, pastda hamma natijalar soni. Yuqoridagi sonlar esa Paskal uchburchagining bir satri. Ya'ni qo'ng'iroq yangi narsa emas: u o'n sakkizinchi darsdagi birlashmalardan yig'ilgan.", 'Высота столбика это простое отношение: сверху число способов получить столько орлов, снизу число всех исходов. А верхние числа это строка треугольника Паскаля. То есть колокол не новость: он собран из сочетаний восемнадцатого урока.', 'The bar height is a simple ratio: above, the ways to get that many heads; below, all outcomes. And the top numbers are a row of Pascal triangle. So the bell is nothing new: it is built from the combinations of lesson eighteen.'),
    A('rule', "To'g'ri. Uchta orol uchun yuz yigirma usul bor, va nol butun bir yuz o'n yetti chiqadi.", 'Верно. Для трёх орлов сто двадцать способов, и выходит ноль целых сто семнадцать тысячных.', 'Correct. Three heads has a hundred and twenty ways, giving zero point one one seven.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: o'rta kafolat bermaydi.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'bell_middle',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L("Eng ehtimolli, lekin kafolat emas", 'Вероятнее всех, но не гарантия', 'Likeliest, yet no guarantee'),
  was: { label: UI.was, expr: L('5 orol eng ehtimolli', '5 орлов вероятнее всех', '5 heads is likeliest') },
  now: { label: UI.now, expr: L('lekin u qanchalik ehtimolli?', 'но насколько он вероятен?', 'but how likely is it?') },
  probe1: {
    question: L('P(5) nimaga teng edi?', 'Чему равна P(5)?', 'What does P(5) equal?'),
    items: [
      { id: 'a', label: '0,246', correct: true },
      { id: 'b', label: '0,5', hint: L("Yarim bu bitta tanga uchun. Bu yerda o'nta tanga.", 'Половина это для одной монеты. Здесь монет десять.', 'A half is for one coin. Here there are ten.') },
      { id: 'c', label: '0,9', hint: L("Ikki yuz ellik ikki bo'lingan ming yigirma to'rt chorakka yaqin.", 'Двести пятьдесят два делить на тысячу двадцать четыре это около четверти.', 'Two hundred fifty two over one thousand twenty four is about a quarter.') },
      { id: 'd', label: '1', hint: L("Bir bu har doim. Beshta orol esa har doim tushmaydi.", 'Единица это всегда. А пять орлов выпадают не всегда.', 'One means always. Five heads does not always occur.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('4, 5 yoki 6 orol ehtimolligi?', 'Вероятность 4, 5 или 6 орлов?', 'The chance of 4, 5 or 6 heads?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '0,66' },
      { id: 'b', label: '0,25' },
      { id: 'c', label: '0,45' },
      { id: 'd', label: '0,95' },
    ],
  },
  holds: [4500, 6000, 2900, 3000],
  audio: [
    A('mount', "Beshta orol eng ehtimolli natija ekanini aniqladik.", 'Мы выяснили, что пять орлов самый вероятный исход.', 'We found that five heads is the most likely outcome.'),
    A('now', "Lekin diqqat: eng ehtimolli degani ko'pincha ro'y beradi degani emas. Uning ehtimolligi chorakka yaqin, ya'ni to'rtta seriyadan uchtasida orollar soni beshta bo'lmaydi. Bu darsning ikkinchi ochilishi.", 'Но внимание: самый вероятный не значит происходящий часто. Его вероятность около четверти, то есть в трёх сериях из четырёх орлов будет не пять. Это второе открытие урока.', 'But note: most likely does not mean frequent. Its probability is about a quarter, so in three series of four the count will not be five. That is the second discovery of the lesson.'),
    A('q1', 'P beshta nimaga teng edi?', 'Чему равна P от пяти?', 'What does P of five equal?'),
    A('q2', "Endi o'rtaning atrofini olamiz: to'rt, besh yoki olti. Sizningcha ehtimollik qanday?", 'Теперь возьмём окрестность середины: четыре, пять или шесть. Как думаешь, какая вероятность?', 'Now let us take the neighbourhood of the middle: four, five or six. What do you think the probability is?'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'bell_middle',
  eyebrow: L('Ikkalasini ham sanaymiz', 'Посчитаем оба', 'Let us compute both'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: L('4, 5 yoki 6 orol', '4, 5 или 6 орлов', '4, 5 or 6 heads'),
  need: '= ?',
  answerLabel: L('ehtimollik', 'вероятность', 'the probability'),
  cards: [
    {
      tag: L('faqat 5', 'только 5', 'only 5'),
      txt: '252 / 1024',
      point: {
        label: L('bitta ustun', 'один столбик', 'one bar'),
        calc: '≈ 0,25',
        verdict: 'out',
      },
    },
    {
      tag: '4, 5, 6',
      txt: '672 / 1024',
      point: {
        label: L('uchta ustun', 'три столбика', 'three bars'),
        calc: '≈ 0,66',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['0,66', '0,25', '0,45', '0,95'],
    value: ['0,66'],
    label: 'P =',
    prompt: L('Ehtimollikni yozing', 'Запиши вероятность', 'Write the probability'),
    wrongs: [
      { key: '0,25', hint: L("Bu faqat beshta orol. Bizga uchta ustun kerak: to'rt, besh va olti.", 'Это только пять орлов. А нужны три столбика: четыре, пять и шесть.', 'That is five heads alone. We need three bars: four, five and six.') },
      { key: '0,95', hint: L("Bu juda ko'p: chekkalarda ham qandaydir ehtimollik qoladi.", 'Это слишком много: на краях тоже остаётся какая-то вероятность.', 'Too much: the edges still keep some probability.') },
      { key: '*', hint: L("Ikki yuz o'n plyus ikki yuz ellik ikki plyus ikki yuz o'n, hammasi ming yigirma to'rtga bo'linadi.", 'Двести десять плюс двести пятьдесят два плюс двести десять, всё делить на тысячу двадцать четыре.', 'Two hundred ten plus two hundred fifty two plus two hundred ten, all over one thousand twenty four.') },
    ],
  },
  holds: [3500, 5500, 6500, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala javobni ham sanaymiz.', 'Прогноз есть. Теперь посчитаем оба ответа.', 'The guess is made. Now let us compute both answers.'),
    A('p1', "Birinchi nomzod faqat o'rta ustunni oladi: ikki yuz ellik ikki bo'lingan ming yigirma to'rt, ya'ni chorakka yaqin.", 'Первый кандидат берёт только средний столбик: двести пятьдесят два делить на тысячу двадцать четыре, около четверти.', 'The first candidate takes only the middle bar: two hundred fifty two over one thousand twenty four, about a quarter.'),
    A('p2', "Ikkinchi nomzod uchta ustunni qo'shadi: ikki yuz o'n, ikki yuz ellik ikki va ikki yuz o'n. Bu olti yuz yetmish ikki, ya'ni nol butun oltmish oltiga yaqin. Ya'ni bitta ustun chorak, uchta ustun esa deyarli uchdan ikki. Qo'ng'iroqning kuchi shunda: o'rtaning atrofi og'irlikning katta qismini oladi.", 'Второй кандидат складывает три столбика: двести десять, двести пятьдесят два и двести десять. Это шестьсот семьдесят два, то есть около ноль целых шестидесяти шести. То есть один столбик четверть, а три почти две трети. В этом и сила колокола: окрестность середины забирает большую часть веса.', 'The second candidate adds three bars: two hundred ten, two hundred fifty two and two hundred ten. That is six hundred seventy two, about zero point six six. So one bar is a quarter, three bars almost two thirds. That is the power of the bell: the neighbourhood of the middle takes most of the weight.'),
    A('write', "Ehtimollikni yozing.", 'Запиши вероятность.', 'Write the probability.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: NORMAL TAQSIMOT.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'bell_middle',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L("Qo'ng'iroq va uning chegarasi", 'Колокол и его предел', 'The bell and its limit'),
  cases: [
    {
      label: L('10 tanga', '10 монет', '10 coins'),
      text: L('11 ta ustun', '11 столбиков', '11 bars'),
      tone: 'graph',
    },
    {
      label: L('juda ko\'p tanga', 'очень много монет', 'very many coins'),
      text: L('silliq egri chiziq', 'гладкая кривая', 'a smooth curve'),
      tone: 'accent',
    },
  ],
  rows: [
    L('P(5) ≈ 0,25,  bitta ustun', 'P(5) ≈ 0,25,  один столбик', 'P(5) ≈ 0,25,  one bar'),
    L('P(4..6) ≈ 0,66,  atrofi', 'P(4..6) ≈ 0,66,  окрестность', 'P(4..6) ≈ 0,66,  the neighbourhood'),
  ],
  probe: {
    question: L(
      "Normal taqsimot nima?",
      'Что такое нормальное распределение?',
      'What is the normal distribution?',
    ),
    items: [
      { id: 'a', label: L("ustunlar juda ko'payganda chiqadigan silliq egri chiziq", 'гладкая кривая, к которой идут столбики', 'the smooth curve the bars approach'), correct: true },
      { id: 'b', label: L('butunlay boshqa formula', 'совсем другая формула', 'a completely different formula'), hint: L("Boshqa emas: bu o'sha qo'ng'iroq, faqat ustunlar juda mayda bo'lgan holi.", 'Не другая: это тот же колокол, только столбики стали очень мелкими.', 'Not different: the same bell, only with very fine bars.') },
      { id: 'c', label: L("to'g'ri chiziq", 'прямая линия', 'a straight line'), hint: L("Chiziq emas: o'rtada baland, chekkada past.", 'Не прямая: в середине высоко, по краям низко.', 'Not a line: high in the middle, low at the edges.') },
      { id: 'd', label: L("tasodifiy sonlar jadvali", 'таблица случайных чисел', 'a table of random numbers'), hint: L("Jadval emas: bu shakl, va u har safar bir xil chiqadi.", 'Не таблица: это форма, и она получается одинаковой каждый раз.', 'Not a table: it is a shape, and it comes out the same every time.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Normal', 'Правило 2. Нормальное', 'Rule 2. Normal'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L("ustunlar mayda bo'lsa, qo'ng'iroq silliqlashadi", 'чем мельче столбики, тем глаже колокол', 'the finer the bars, the smoother the bell'),
    lines: [
      L("normal taqsimot bu qo'ng'iroqning chegarasi", 'нормальное распределение это предел колокола', 'the normal distribution is the limit of the bell'),
      L("o'rtasi eng ehtimolli, lekin kafolat emas", 'середина вероятнее всех, но не гарантия', 'the middle is likeliest, yet no guarantee'),
      L("o'rtaning atrofi og'irlikning katta qismini oladi", 'окрестность середины забирает большую часть веса', 'the neighbourhood of the middle takes most of the weight'),
      L("bo'y, xato, o'lchov: hammasi shu shaklga tushadi", 'рост, ошибки, измерения: всё ложится в эту форму', 'height, errors, measurements: all fall into this shape'),
    ],
    example: L('misol:  0,25 va 0,66', 'пример:  0,25 и 0,66', 'example:  0,25 and 0,66'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L("ko'p takror qo'ng'iroq beradi", 'много повторов дают колокол', 'many repeats give a bell'),
    lines: [
      L('1. usullar sonini sana: C(n, k)', '1. посчитай способы: C(n, k)', '1. count the ways: C(n, k)'),
      L('2. hamma natijaga bo\'l: 2^n', '2. подели на все исходы: 2^n', '2. divide by all outcomes: 2^n'),
      L("3. o'rta eng baland, chekka eng past", '3. середина выше всех, край ниже всех', '3. the middle is highest, the edge lowest'),
      L("4. bitta ustun kam, atrofi ko'p beradi", '4. один столбик мало, окрестность много', '4. one bar gives little, its neighbourhood much'),
    ],
  },
  holds: [4000, 6500, 2500, 5000],
  audio: [
    A('mount', "Ikkala son ham sanaldi. Endi oxirgi qadam.", 'Оба числа посчитаны. Теперь последний шаг.', 'Both numbers are computed. Now the last step.'),
    A('rows', "O'nta tangada o'n bitta ustun bor. Tangalar ko'paysa, ustunlar ko'payadi va ingichkalashadi, shakl esa o'zgarmaydi. Cheksiz ko'paytirsak, ustunlar silliq egri chiziqqa aylanadi. Bu normal taqsimot, va u yangi formula emas: u o'sha qo'ng'iroqning chegarasi.", 'У десяти монет одиннадцать столбиков. Если монет больше, то и столбиков больше и они тоньше, а форма та же. Увеличивая бесконечно, столбики становятся гладкой кривой. Это нормальное распределение, и это не новая формула: это предел того же колокола.', 'Ten coins give eleven bars. More coins mean more and thinner bars, with the shape unchanged. Increasing without limit, the bars become a smooth curve. That is the normal distribution, and it is not a new formula: it is the limit of the same bell.'),
    A('q', "Savol: normal taqsimot nima?", 'Вопрос: что такое нормальное распределение?', 'The question: what is the normal distribution?'),
    A('rule', "To'g'ri. Va shu sababdan bu shakl hamma joyda uchraydi: odamlar bo'yi, o'lchov xatolari, imtihon ballari. Har safar ko'p mayda tasodif qo'shilsa, natija qo'ng'iroqqa tushadi.", 'Верно. И поэтому эта форма встречается повсюду: рост людей, ошибки измерений, баллы экзамена. Каждый раз, когда складывается много мелких случайностей, результат ложится в колокол.', 'Correct. And that is why this shape appears everywhere: human height, measurement errors, exam scores. Whenever many small chances add up, the result falls into a bell.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. AMALNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'bell_middle',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Amalni qo\'ying', 'Поставь действие', 'Place the operation'),
  left: L('roppa rosa 5 orol', 'ровно 5 орлов', 'exactly 5 heads'),
  template: ['P = 252 ', { slot: 0 }, ' 1024'],
  signs: ['/', '·'],
  answer: '/',
  checkNote: L(
    "Ehtimollik bu ULUSH: qulay hammaga bo'linadi",
    'Вероятность это ДОЛЯ: благоприятные делят на все',
    'A probability is a SHARE: favourable over all',
  ),
  wrongs: [
    { key: '·', hint: L("Ko'paytirsak juda katta son chiqadi. Ehtimollik esa birdan katta bo'lmaydi.", 'Умножение даст очень большое число. А вероятность не бывает больше единицы.', 'Multiplying gives a huge number. A probability never exceeds one.') },
  ],
  probe: {
    question: L("Nega aynan bo'lish?", 'Почему именно деление?', 'Why division?'),
    items: [
      { id: 'a', label: L('ehtimollik bu ulush', 'вероятность это доля', 'a probability is a share'), correct: true },
      { id: 'b', label: L("chunki son katta", 'потому что число большое', 'because the number is large'), hint: L("Kattaligi ahamiyatsiz: amal ma'nodan kelib chiqadi.", 'Величина не важна: действие следует из смысла.', 'The size does not matter: the operation follows from the meaning.') },
      { id: 'c', label: L("shunday kelishilgan", 'так договорились', 'that is the convention'), hint: L("Kelishuv emas: yigirmanchi darsda buni katakchalarda sanadik.", 'Не договорённость: в двадцатом уроке мы считали это по клеткам.', 'Not a convention: in lesson twenty we counted it with cells.') },
      { id: 'd', label: L("formulada shunday", 'так в формуле', 'that is how the formula is'), hint: L("Formula sababdan kelib chiqadi, aksincha emas.", 'Формула следует из причины, а не наоборот.', 'The formula follows from the reason, not the other way round.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Amalni qo'ying.", 'Поставь действие.', 'Place the operation.'),
    A('checked', "Bo'ldi. Endi ta'riflang: nega aynan bo'lish?", 'Получилось. Теперь сформулируй: почему именно деление?', 'Done. Now put it into words: why division?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'ways', label: L('usullarni sanash', 'посчитать способы', 'count the ways') },
  { id: 'all', label: L('hamma natijani sanash', 'посчитать все исходы', 'count all outcomes') },
  { id: 'div', label: L("bo'lish", 'поделить', 'divide') },
  { id: 'add', label: L("ustunlarni qo'shish", 'сложить столбики', 'add the bars') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'bell_middle',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('10 tanga. Roppa rosa 3 orol?', '10 монет. Ровно 3 орла?', '10 coins. Exactly 3 heads?'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'ways',
      to: 'C(10, 3) = 120',
      wrongs: [
        { action: 'div', hint: L("Avval usullarni sanang: bo'linadigan narsa kerak.", 'Сначала посчитай способы: нужно, что делить.', 'Count the ways first: you need something to divide.') },
        { action: 'all', hint: L("Hamma natija bizga ma'lum: ming yigirma to'rt. Kerak bo'lgani usullar soni.", 'Все исходы нам известны: тысяча двадцать четыре. Нужно число способов.', 'All outcomes are known: one thousand twenty four. The ways are what is needed.') },
        { action: 'add', hint: L("Qo'shish bir nechta ustun bo'lganda. Bu yerda ustun bitta.", 'Сложение когда столбиков несколько. Здесь столбик один.', 'Adding is for several bars. Here there is one bar.') },
      ],
    },
    {
      action: 'div',
      to: '120 / 1024 ≈ 0,117',
      wrongs: [
        { action: 'ways', hint: L("Usullar topilgan: yuz yigirma.", 'Способы найдены: сто двадцать.', 'The ways are found: a hundred and twenty.') },
        { action: 'all', hint: L("Ming yigirma to'rt allaqachon bor.", 'Тысяча двадцать четыре уже есть.', 'One thousand twenty four is already there.') },
        { action: 'add', hint: L("Qo'shadigan ikkinchi ustun yo'q.", 'Второго столбика для сложения нет.', 'There is no second bar to add.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['0,117', '0,246', '0,3', '0,001'],
    value: ['0,117'],
    label: 'P =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '0,246', hint: L("Bu beshta orolniki: u yerda ikki yuz ellik ikki usul.", 'Это для пяти орлов: там двести пятьдесят два способа.', 'That is for five heads: two hundred fifty two ways there.') },
      { key: '0,3', hint: L("Uch bo'lingan o'n emas: usullar soni kerak.", 'Не три десятых: нужно число способов.', 'Not three tenths: the number of ways is needed.') },
      { key: '*', hint: L("Yuz yigirmani ming yigirma to'rtga bo'ling.", 'Подели сто двадцать на тысячу двадцать четыре.', 'Divide a hundred twenty by one thousand twenty four.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi bitta ustunni sanaymiz.', 'Правило сформулировано. Посчитаем один столбик.', 'The rule is stated. Let us compute one bar.'),
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
  tag: 'bell_middle',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Chekkalar', 'Края', 'The edges'),
  start: L('0 yoki 10 orol?', '0 или 10 орлов?', '0 or 10 heads?'),
  actions: ACTIONS_10,
  hint: L(
    "Ikkala chekkada ham bittadan usul bor.",
    'На каждом краю по одному способу.',
    'Each edge has exactly one way.',
  ),
  steps: [
    {
      action: 'ways',
      to: '1 + 1 = 2',
      wrongs: [
        { action: 'div', hint: L("Avval usullarni sanang.", 'Сначала посчитай способы.', 'Count the ways first.') },
        { action: 'all', hint: L("Hamma natija ma'lum: ming yigirma to'rt.", 'Все исходы известны: тысяча двадцать четыре.', 'All outcomes are known: one thousand twenty four.') },
        { action: 'add', hint: L("Qo'shish bo'ladi, lekin avval nimani qo'shishni sanang.", 'Сложение будет, но сначала посчитай, что складывать.', 'Adding will come, but first count what to add.') },
      ],
    },
    {
      action: 'div',
      to: '2 / 1024 ≈ 0,002',
      wrongs: [
        { action: 'ways', hint: L("Usullar topilgan: ikkita.", 'Способы найдены: два.', 'The ways are found: two.') },
        { action: 'all', hint: L("Ming yigirma to'rt bor.", 'Тысяча двадцать четыре есть.', 'One thousand twenty four is there.') },
        { action: 'add', hint: L("Qo'shilgan: bir plyus bir.", 'Сложено: один плюс один.', 'Added: one plus one.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['0,002', '0,02', '0,001', '0,2'],
    value: ['0,002'],
    label: 'P =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '0,001', hint: L("Bu faqat bitta chekka. Ikkitasi so'ralgan: nolta ham, o'nta ham.", 'Это только один край. Спрашивают оба: и ноль, и десять.', 'That is one edge only. Both are asked: zero and ten.') },
      { key: '0,2', hint: L("Bu ancha katta: chekkalar juda kam uchraydi.", 'Это сильно больше: края встречаются очень редко.', 'Far too large: the edges are very rare.') },
      { key: '*', hint: L("Ikkitani ming yigirma to'rtga bo'ling.", 'Подели два на тысячу двадцать четыре.', 'Divide two by one thousand twenty four.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Ikkala chekka birga: nolta orol yoki o'nta orol. Diqqat: bu YOKI, ya'ni ustunlar qo'shiladi.", 'Оба края вместе: ноль орлов или десять орлов. Внимание: это ИЛИ, то есть столбики складываются.', 'Both edges together: zero heads or ten heads. Careful: this is OR, so the bars add.'),
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
      id: 'b1', tag: 'bell_middle', ask: true, cols: 4,
      done: '2^10 = 1024',
      prompt: L('10 tangada nechta natija?', 'Сколько исходов у 10 монет?', 'How many outcomes do 10 coins have?'),
      items: [
        { id: 'a', label: '1024', correct: true },
        { id: 'b', label: '100', hint: L("Bu o'n karra o'n.", 'Это десять на десять.', 'That is ten times ten.') },
        { id: 'c', label: '20', hint: L("Bu o'n karra ikki.", 'Это десять на два.', 'That is ten times two.') },
        { id: 'd', label: '512', hint: L("Bu to'qqizta tanga uchun.", 'Это для девяти монет.', 'That is for nine coins.') },
      ],
    },
    {
      id: 'b2', tag: 'bell_middle', ask: true, cols: 4,
      done: '252 / 1024 ≈ 0,25',
      prompt: L('Roppa rosa 5 orol ehtimolligi?', 'Вероятность ровно 5 орлов?', 'The chance of exactly 5 heads?'),
      items: [
        { id: 'a', label: '0,25', correct: true },
        { id: 'b', label: '0,5', hint: L("Yarim bu bitta tanga uchun.", 'Половина это для одной монеты.', 'A half is for one coin.') },
        { id: 'c', label: '0,66', hint: L("Bu to'rt, besh va oltining yig'indisi.", 'Это сумма четырёх, пяти и шести.', 'That is four, five and six together.') },
        { id: 'd', label: '0,12', hint: L("Bu uchta yoki yettita orolniki.", 'Это для трёх или семи орлов.', 'That is for three or seven heads.') },
      ],
    },
    {
      id: 'b3', tag: 'bell_middle', ask: true, cols: 2,
      done: L("o'rtada", 'в середине', 'in the middle'),
      prompt: L(
        "Qo'ng'iroqning eng baland joyi qayerda?",
        'Где самое высокое место колокола?',
        'Where is the bell highest?',
      ),
      items: [
        { id: 'a', label: L("o'rtada", 'в середине', 'in the middle'), correct: true },
        { id: 'b', label: L('chapda', 'слева', 'on the left'), hint: L("Chapda nolta orol: u yerda bitta usul.", 'Слева ноль орлов: там один способ.', 'On the left is zero heads: one way there.') },
        { id: 'c', label: L("o'ngda", 'справа', 'on the right'), hint: L("O'ngda o'nta orol: u ham bitta usul.", 'Справа десять орлов: тоже один способ.', 'On the right is ten heads: also one way.') },
        { id: 'd', label: L('hamma joyda teng', 'везде одинаково', 'the same everywhere'), hint: L("Teng emas: o'rtada ikki yuz ellik ikki usul, chekkada bitta.", 'Не одинаково: в середине двести пятьдесят два способа, с краю один.', 'Not the same: two hundred fifty two ways in the middle, one at the edge.') },
      ],
    },
    {
      id: 'b4', tag: 'bell_middle', ask: true, cols: 2,
      done: L("kafolat emas", 'не гарантия', 'no guarantee'),
      prompt: L(
        "5 orol eng ehtimolli. Bu kafolatmi?",
        'Пять орлов вероятнее всех. Это гарантия?',
        'Five heads is likeliest. Is that a guarantee?',
      ),
      items: [
        { id: 'a', label: L("yo'q, ehtimolligi chorakka yaqin", 'нет, вероятность около четверти', 'no, the chance is about a quarter'), correct: true },
        { id: 'b', label: L('ha, u har doim chiqadi', 'да, он выпадает всегда', 'yes, it always occurs'), hint: L("Har doim emas: to'rtta seriyadan uchtasida boshqa son chiqadi.", 'Не всегда: в трёх сериях из четырёх выйдет другое число.', 'Not always: in three of four series another count comes out.') },
        { id: 'c', label: L("ha, ehtimolligi yarim", 'да, вероятность половина', 'yes, the chance is a half'), hint: L("Yarim emas: ikki yuz ellik ikki bo'lingan ming yigirma to'rt chorakka yaqin.", 'Не половина: двести пятьдесят два делить на тысячу двадцать четыре это около четверти.', 'Not a half: two hundred fifty two over one thousand twenty four is about a quarter.') },
        { id: 'd', label: L("aniqlab bo'lmaydi", 'определить нельзя', 'cannot be determined'), hint: L("Mumkin: biz uni sanadik.", 'Можно: мы её посчитали.', 'It can: we computed it.') },
      ],
    },
    {
      id: 'b5', tag: 'bell_middle', ask: true, cols: 4,
      done: '2 / 1024 ≈ 0,002',
      prompt: L('0 yoki 10 orol ehtimolligi?', 'Вероятность 0 или 10 орлов?', 'The chance of 0 or 10 heads?'),
      items: [
        { id: 'a', label: '0,002', correct: true },
        { id: 'b', label: '0,001', hint: L("Bu bitta chekka. So'ralgani ikkitasi.", 'Это один край. Спрашивают оба.', 'That is one edge. Both are asked.') },
        { id: 'c', label: '0,02', hint: L("O'n barobar katta: ikkini ming yigirma to'rtga bo'ling.", 'В десять раз больше: подели два на тысячу двадцать четыре.', 'Ten times too big: divide two by one thousand twenty four.') },
        { id: 'd', label: '0,25', hint: L("Bu o'rtaniki.", 'Это для середины.', 'That is for the middle.') },
      ],
    },
    {
      id: 'b6', tag: 'bell_middle', ask: true, cols: 2,
      done: L("qo'ng'iroqning chegarasi", 'предел колокола', 'the limit of the bell'),
      prompt: L('Normal taqsimot nima?', 'Что такое нормальное распределение?', 'What is the normal distribution?'),
      items: [
        { id: 'a', label: L("qo'ng'iroqning silliq chegarasi", 'гладкий предел колокола', 'the smooth limit of the bell'), correct: true },
        { id: 'b', label: L('yangi formula', 'новая формула', 'a new formula'), hint: L("Yangi emas: bu o'sha binomial shakl, ustunlar mayda bo'lgani.", 'Не новая: это та же биномиальная форма с мелкими столбиками.', 'Not new: the same binomial shape with fine bars.') },
        { id: 'c', label: L("to'g'ri chiziq", 'прямая линия', 'a straight line'), hint: L("Chiziq emas: o'rtada baland.", 'Не прямая: в середине высоко.', 'Not a line: high in the middle.') },
        { id: 'd', label: L('tasodifiy sonlar', 'случайные числа', 'random numbers'), hint: L("Sonlar emas, shakl.", 'Не числа, а форма.', 'Not numbers, a shape.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi o'rta ustun.", 'Теперь средний столбик.', 'Now the middle bar.'),
    A('q3', "Shakl haqida.", 'Про форму.', 'About the shape.'),
    A('q4', "Kafolat haqida.", 'Про гарантию.', 'About the guarantee.'),
    A('q5', "Chekkalar.", 'Края.', 'The edges.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: o'rta yarim deb hisoblangan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'bell_middle',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Yarmi orol, demak yarim?", 'Половина орлов, значит половина?', 'Half heads, so a half?'),
  rows: [
    { id: 'r1', text: L('10 tanga, roppa rosa 5 orol', '10 монет, ровно 5 орлов', '10 coins, exactly 5 heads') },
    { id: 'r2', text: L('orol ehtimolligi 1/2', 'вероятность орла 1/2', 'the chance of heads is 1/2') },
    { id: 'r3', text: L('demak P(5) = 1/2', 'значит P(5) = 1/2', 'so P(5) = 1/2') },
    { id: 'r4', text: L('javob: 0,5', 'ответ: 0,5', 'answer: 0,5') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Bu rost: bitta tanga uchun yarim.", 'Это правда: для одной монеты половина.', 'That is true: a half for one coin.'),
    r4: L("Javob xato, lekin u oldingi satrda xato bo'lgan.", 'Ответ неверный, но неверным он стал строкой раньше.', 'The answer is wrong, but it became wrong one line earlier.'),
  },
  proofPoint: L("bitta tanga va o'nta tanga boshqa", 'одна монета и десять это разное', 'one coin and ten are different'),
  proof: L(
    "Yarim bu bitta tanga uchun. O'nta tangada savol boshqa: nechta orol chiqadi. Ustunlar o'n bitta, yig'indisi bir. O'rtasi yarim bo'lsa, qolgan o'nta ustunga ham yarim qolardi. Aslida o'rtasi 0,246.",
    'Половина это для одной монеты. У десяти вопрос другой: сколько орлов выпадет. Столбиков одиннадцать, их сумма равна единице. Была бы середина половиной, на десять других осталась бы тоже половина. На деле середина 0,246.',
    'A half is for one coin. With ten coins the question differs: how many heads appear. Eleven bars, summing to one. Were the middle a half, the other ten would share a half too. In fact the middle is 0,246.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("bitta tanganing ehtimolligi butun seriyaga ko'chirilgan", 'вероятность одной монеты перенесена на всю серию', 'one coin chance carried over to the whole series'), correct: true },
      { id: 'b', label: L("orol ehtimolligi yarim emas", 'вероятность орла не половина', 'the chance of heads is not a half'), hint: L("Yarim: tanga to'g'ri. Xato keyingi qadamda.", 'Половина: монета честная. Ошибка на следующем шаге.', 'It is a half: the coin is fair. The error is on the next step.') },
      { id: 'c', label: L("arifmetikada xato", 'ошибка в арифметике', 'an arithmetic error'), hint: L("Bu yerda arifmetika deyarli yo'q: xato mulohazada.", 'Здесь почти нет арифметики: ошибка в рассуждении.', 'There is hardly any arithmetic here: the error is in the reasoning.') },
      { id: 'd', label: L("tangalar soni noto'g'ri", 'неверное число монет', 'the number of coins is wrong'), hint: L("O'nta tanga, va bu shartda berilgan.", 'Десять монет, и это дано в условии.', 'Ten coins, and that is given in the problem.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda birinchi ikki satr rost. Shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь первые две строки верны. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Here the first two lines are true. And still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Qarang: yarim bu bitta tanga uchun. O'nta tangada esa savol nechta orol chiqishi haqida, va ustunlar o'n bitta. Ularning yig'indisi bir. O'rtasi yarim bo'lsa, qolgan o'nta ustunga hammasi bo'lib yarim qolardi, va bu shaklga mos kelmaydi. Haqiqiy javob nol butun ikki yuz qirq olti.", 'Смотри: половина это для одной монеты. А у десяти монет вопрос о числе орлов, и столбиков одиннадцать. Их сумма равна единице. Была бы середина половиной, на остальные десять столбиков осталась бы всего половина, и это не согласуется с формой. Настоящий ответ ноль целых двести сорок шесть тысячных.', 'Look: a half is for one coin. With ten coins the question is about the count of heads, and there are eleven bars. They sum to one. Were the middle a half, the other ten bars would share only a half, which does not match the shape. The true answer is zero point two four six.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'bell_middle',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: 'P(k) = C(n, k) / 2^n',
  tasks: [
    {
      prompt: L('4 tangadan roppa rosa 2 orol', 'ровно 2 орла из 4 монет', 'exactly 2 heads of 4 coins'),
      template: ['P = ', { slot: 0 }, ' / ', { slot: 1 }],
      parts: ['6', '16', '4', '8'],
      answer: ['6', '16'],
      doneLabel: '6 / 16 = 0,375',
      wrongs: [
        { key: '4|16', hint: L("To'rttadan ikkitasini tanlash oltita usulda bo'ladi, to'rttada emas.", 'Выбрать два из четырёх можно шестью способами, а не четырьмя.', 'Choosing two of four can be done six ways, not four.') },
        { key: '6|8', hint: L("Hamma natija ikki to'rtinchi darajada, ya'ni o'n olti.", 'Всех исходов два в четвёртой степени, то есть шестнадцать.', 'All outcomes are two to the fourth, that is sixteen.') },
        { key: '*', hint: L("Yuqorida usullar soni, pastda hamma natija.", 'Сверху число способов, снизу все исходы.', 'Above the ways, below all outcomes.') },
      ],
    },
    {
      prompt: L('10 tangadan roppa rosa 10 orol', 'ровно 10 орлов из 10 монет', 'exactly 10 heads of 10 coins'),
      template: ['P = ', { slot: 0 }, ' / ', { slot: 1 }],
      parts: ['1', '1024', '10', '100'],
      answer: ['1', '1024'],
      doneLabel: '1 / 1024 ≈ 0,001',
      wrongs: [
        { key: '10|1024', hint: L("Hamma tanga orol bo'lishi bitta usulda: boshqa variant yo'q.", 'Все монеты орлы единственным способом: другого варианта нет.', 'All coins heads in one way only: there is no other.') },
        { key: '1|100', hint: L("Hamma natija ikki o'ninchi darajada, ya'ni ming yigirma to'rt.", 'Всех исходов два в десятой степени, то есть тысяча двадцать четыре.', 'All outcomes are two to the tenth, one thousand twenty four.') },
        { key: '*', hint: L("Yuqorida bitta usul, pastda ming yigirma to'rt.", 'Сверху один способ, снизу тысяча двадцать четыре.', 'Above one way, below one thousand twenty four.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi, va u chekkadagi ustun.", 'А теперь второе, и это столбик с самого края.', 'And now the second one, the bar at the very edge.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'bell_middle',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'P(k) = C(n, k) / 2^n',
  ruleLines: [
    L("ko'p takror qo'ng'iroq beradi, o'rtasi eng baland", 'много повторов дают колокол, середина выше всех', 'many repeats give a bell, the middle is highest'),
    L("eng ehtimolli natija ham kafolat emas: 0,25", 'самый вероятный исход не гарантия: 0,25', 'even the likeliest outcome is no guarantee: 0,25'),
    L("normal taqsimot bu shu qo'ng'iroqning chegarasi", 'нормальное распределение это предел этого колокола', 'the normal distribution is the limit of this bell'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('10 tanga: nechta orol', '10 монет: сколько орлов', '10 coins: how many heads'),
      right: '5',
      map: { a: '5', b: '0', both: '10', none: L('bir xil', 'всё равно', 'all the same') },
    },
    {
      screen: 5,
      expr: L('4, 5 yoki 6 orol', '4, 5 или 6 орлов', '4, 5 or 6 heads'),
      right: '0,66',
      map: { a: '0,66', b: '0,25', c: '0,45', d: '0,95' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '252 / 1024 ≈ 0,25',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Sinov mashinasi ekraniga qayting', 'Вернись к экрану с машиной испытаний', 'Go back to the trial machine screen'),
  },
  probe: {
    question: L(
      "Qo'ng'iroq qayerdan chiqdi?",
      'Откуда взялся колокол?',
      'Where does the bell come from?',
    ),
    items: [
      { id: 'a', label: L('birlashmalar sonidan', 'из числа сочетаний', 'from the number of combinations'), correct: true },
      { id: 'b', label: L('tasodifdan', 'из случайности', 'from randomness'), hint: L("Tasodif natijalarni beradi, shaklni esa usullar soni beradi.", 'Случайность даёт исходы, а форму задаёт число способов.', 'Randomness gives outcomes; the shape comes from the number of ways.') },
      { id: 'c', label: L('yangi formuladan', 'из новой формулы', 'from a new formula'), hint: L("Yangi formula yo'q: C n dan k dan o'n sakkizinchi darsdan.", 'Новой формулы нет: C из n по k из восемнадцатого урока.', 'There is no new formula: C of n choose k comes from lesson eighteen.') },
      { id: 'd', label: L("tangalar sonidan", 'из числа монет', 'from the number of coins'), hint: L("Tangalar soni ustunlar sonini beradi, balandligini esa birlashmalar.", 'Число монет задаёт количество столбиков, а высоту сочетания.', 'The coin count sets how many bars; the heights come from combinations.') },
    ],
  },
  sheetTitle: L("Binomial taqsimot · shpargalka", 'Биномиальное распределение · шпаргалка', 'Binomial distribution · cheat sheet'),
  sheetSrc: L('11-sinf · 24-dars', '11 класс · урок 24', 'Grade 11 · lesson 24'),
  lifehack: L(
    "Qo'ng'iroqda bitta ustun kam beradi, o'rtaning atrofi esa ko'p: bittasini emas, uchtasini qo'shing.",
    'В колоколе один столбик даёт мало, а окрестность середины много: складывай не один, а три.',
    'In a bell one bar gives little, the middle neighbourhood much: add three, not one.',
  ),
  holds: [2500, 7000, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Beshta orol haqiqatan eng ehtimolli, lekin uning ehtimolligi atigi chorak.", 'Вот твои прогнозы и вот как оказалось. Пять орлов действительно вероятнее всех, но вероятность его всего четверть.', 'Here are your guesses and here is how it turned out. Five heads really is likeliest, but its probability is only a quarter.'),
    A('rule', "Va mana asosiy fikr. Bitta tajriba ko'p marta takrorlansa, natijalar qo'ng'iroqqa yig'iladi, va bu qo'ng'iroq o'n sakkizinchi darsdagi birlashmalardan qurilgan. O'rtasi eng baland, lekin kafolat emas. Ustunlar juda mayda bo'lganda esa shakl silliq egri chiziqqa aylanadi, va uni normal taqsimot deyishadi.", 'И вот главная мысль. Если один опыт повторить много раз, исходы складываются в колокол, и построен он из сочетаний восемнадцатого урока. Середина самая высокая, но не гарантия. А когда столбики становятся очень мелкими, форма превращается в гладкую кривую, и её называют нормальным распределением.', 'And here is the main point. Repeat one experiment many times and the outcomes gather into a bell, built from the combinations of lesson eighteen. The middle is highest, yet no guarantee. And when the bars become very fine, the shape turns into a smooth curve, called the normal distribution.'),
    A('q', "Oxirgi savol: qo'ng'iroq qayerdan chiqdi?", 'Последний вопрос: откуда взялся колокол?', 'The last question: where does the bell come from?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
