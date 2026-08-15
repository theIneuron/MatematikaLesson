// ============================================================================
// 11-sinf, Dars 21. EHTIMOLLIKLARNI QO'SHISH VA KO'PAYTIRISH.
//
// B3 blokining OLTINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/BLOK3_SKELET.md, «21-dars» bo'limi
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// BLOKDAGI YAGONA DARS, QAYERDA IKKALA ASBOB HAM ISHLAYDI. Va bu bezak
// emas: dars 16-darsning «VA hamda YOKI» so'zlarini ehtimollikka ko'chiradi.
// Daraxt ko'paytirishni ko'rsatadi, katakchalar esa qo'shishdagi kesishmani.
//
// DARSNING BITTA GAPI: VA ko'paytiradi, YOKI qo'shadi -- lekin qo'shganda
// ikki marta sanalgan qism ayiriladi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_21',
  title: L("Ehtimolliklarni qo'shish va ko'paytirish", 'Сложение и умножение вероятностей', 'Adding and multiplying probabilities'),
}

const BLOCK = { label: 'B3', from: 16, to: 24, current: 21 }

// ============================================================
// SLAYD 1. XUK. Ikkita orol.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L("Qo'shish va ko'paytirish", 'Сложение и умножение', 'Adding and multiplying'),
  title: L('Ikkita tanga, ikkita orol', 'Две монеты, два орла', 'Two coins, two heads'),
  expr: L('ikkala tangada ham orol', 'на обеих монетах орёл', 'heads on both coins'),
  rows: [
    {
      id: 'a',
      name: L("qo'shdi", 'сложил', 'added'),
      value: '1/2 + 1/2 = 1',
    },
    {
      id: 'b',
      name: L("ko'paytirdi", 'умножил', 'multiplied'),
      value: '1/2 · 1/2 = 1/4',
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi hamma natijani sanaymiz.",
      'Твой ответ записан. Сейчас пересчитаем все исходы.',
      'Your answer is saved. Now we will count every outcome.',
    ),
    items: [
      { id: 'a', label: '1' },
      { id: 'b', label: '1/4' },
      { id: 'both', label: '1/2' },
      { id: 'none', label: '3/4' },
    ],
  },
  holds: [5000, 5000, 5000, 4000],
  audio: [
    A('mount', "O'tgan darsda bitta hodisaning ehtimolligini sanadik. Bugun ular ikkita bo'ladi, va ular orasida yo VA, yo YOKI turadi.", 'На прошлом уроке мы считали вероятность одного события. Сегодня их станет два, и между ними стоит либо И, либо ИЛИ.', 'Last lesson we counted the probability of one event. Today there will be two, and between them stands either AND or OR.'),
    A('r1', "Birinchi yechim: yarim plyus yarim, ya'ni bir. Lekin bir bu to'liq ishonch, va ikkita orol har doim tushishi mumkin emas.", 'Первое решение: половина плюс половина, то есть единица. Но единица это полная уверенность, а два орла выпадают не всегда.', 'The first solution: a half plus a half, that is one. But one means certainty, and two heads do not always come up.'),
    A('r2', "Ikkinchi yechim: yarim karra yarim, ya'ni bir chorak.", 'Второе решение: половина на половину, то есть четверть.', 'The second solution: a half times a half, that is a quarter.'),
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
    "Ikkitasi 16-darsdan, bittasi o'tgan darsdan. Bu baholanmaydi.",
    'Две опоры из урока 16, одна с прошлого урока. Это не оценивается.',
    'Two basics from lesson 16, one from last lesson. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('VA: ko\'paytiriladi', 'И: умножаем', 'AND: multiply'),
      short: L('16-darsdan', 'из урока 16', 'from lesson 16'),
      ex: [{ e: '2 · 2 = 4', why: L('ikki tanga, to\'rtta natija', 'две монеты, четыре исхода', 'two coins, four outcomes') }],
    },
    {
      id: 'c2',
      title: L('YOKI: qo\'shiladi', 'ИЛИ: складываем', 'OR: add'),
      short: L('16-darsdan', 'из урока 16', 'from lesson 16'),
      ex: [{ e: '3 + 4 = 7', why: L('bitta tanlov, ikki ro\'yxat', 'один выбор, два списка', 'one choice, two lists') }],
    },
    {
      id: 'c3',
      title: L('Ehtimollik bu ulush', 'Вероятность это доля', 'Probability is a share'),
      short: L('20-darsdan', 'из урока 20', 'from lesson 20'),
      ex: [{ e: 'P = 1 / 4', why: L('to\'rtta natijadan bittasi', 'один исход из четырёх', 'one outcome of four') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('Ikki tangada nechta natija bor?', 'Сколько исходов у двух монет?', 'How many outcomes do two coins have?'),
      cols: 4,
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '2', hint: L("Ikkita natija bitta tangada. Ikkitasida esa har biriga ikkitadan.", 'Два исхода у одной монеты. У двух на каждый по два.', 'Two outcomes belong to one coin. With two, each gets two more.') },
        { id: 'c', label: '3', hint: L("Uchta emas: orol orol, orol raqam, raqam orol, raqam raqam.", 'Не три: орёл орёл, орёл решка, решка орёл, решка решка.', 'Not three: HH, HT, TH, TT.') },
        { id: 'd', label: '8', hint: L("Sakkiztasi uchta tangada.", 'Восемь у трёх монет.', 'Eight belongs to three coins.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('Ulardan nechtasida ikkala orol?', 'В скольких из них два орла?', 'In how many of them are two heads?'),
      cols: 4,
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '2', hint: L("Ikkita natijada bitta orol bor. Ikkalasi ham orol bo'lgani bitta.", 'В двух исходах ровно один орёл. А оба орла только в одном.', 'Two outcomes have exactly one head. Both heads only in one.') },
        { id: 'c', label: '4', hint: L("To'rttasi hammasi.", 'Четыре это все.', 'Four is all of them.') },
        { id: 'd', label: '3', hint: L("Uchtasida kamida bitta orol bor. Ikkalasi ham orol bittasida.", 'В трёх есть хотя бы один орёл. А оба орла в одном.', 'Three have at least one head. Both heads in one.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('1 ni 4 ga bo\'lsak?', 'Один поделить на четыре?', 'One divided by four?'),
      cols: 4,
      items: [
        { id: 'a', label: '0,25', correct: true },
        { id: 'b', label: '0,4', hint: L("Bu to'rt bo'lingan o'nga.", 'Это четыре делить на десять.', 'That is four over ten.') },
        { id: 'c', label: '4', hint: L("Ehtimollik birdan katta bo'lmaydi.", 'Вероятность не бывает больше единицы.', 'A probability is never above one.') },
        { id: 'd', label: '0,5', hint: L("Yarim bu bitta tanga uchun.", 'Половина это для одной монеты.', 'A half is for one coin.') },
      ],
    },
  ],
  holds: [3000, 4500, 4500, 4500, 4500, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch o'n oltinchi darsdan: VA bo'lsa ko'paytiriladi. Ikkita tangada to'rtta natija: ikki karra ikki.", 'Первая опора из шестнадцатого урока: если И, умножаем. У двух монет четыре исхода: два на два.', 'The first basic from lesson sixteen: if AND, multiply. Two coins give four outcomes: two times two.'),
    A('c2', "Ikkinchi tayanch o'sha darsdan: YOKI bo'lsa qo'shiladi. Bitta tanlov, bir necha ro'yxat.", 'Вторая опора оттуда же: если ИЛИ, складываем. Один выбор, несколько списков.', 'The second basic from the same lesson: if OR, add. One choice, several lists.'),
    A('c3', "Uchinchi tayanch o'tgan darsdan: ehtimollik bu qulaylarning hammaga nisbati.", 'Третья опора с прошлого урока: вероятность это отношение благоприятных ко всем.', 'The third basic from last lesson: probability is favourable over all.'),
    A('recap', "Qisqacha: bugun o'sha ikki so'z, faqat sonlar o'rniga ulushlar bilan.", 'Коротко: сегодня те же два слова, только вместо чисел доли.', 'Briefly: today the same two words, only with shares instead of counts.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. TO'RTTA NATIJANI SANAYMIZ.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'sum_vs_product',
  eyebrow: L('Natijalarni sanaymiz', 'Пересчитаем исходы', 'Let us count the outcomes'),
  title: L('To\'rtta natija', 'Четыре исхода', 'Four outcomes'),
  expr: L('ikki tanga', 'две монеты', 'two coins'),
  goal: L('qaysi natija qulay', 'какой исход благоприятный', 'which outcome is favourable'),
  rule: L(
    "To'rtta natijani yozib chiqamiz va keraklisini belgilaymiz.",
    'Выпишем четыре исхода и отметим нужный.',
    'Let us write out the four outcomes and mark the wanted one.',
  ),
  pick: L('Qaysi natijani ko\'ramiz?', 'Какой исход посмотрим?', 'Which outcome shall we look at?'),
  claims: [
    { id: 'a', key: 'inA', name: L("qo'shish", 'сложение', 'adding'), value: '1' },
    { id: 'b', key: 'inB', name: L("ko'paytirish", 'умножение', 'multiplying'), value: '1/4' },
  ],
  points: [
    {
      id: 'q1', label: L('orol, orol', 'орёл, орёл', 'heads, heads'), num: 'OO', step: 'calc', verdict: 'in',
      role: L('qulay', 'благоприятный', 'favourable'),
      calc: L('kerakli natija', 'нужный исход', 'the wanted outcome'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: L('orol, raqam', 'орёл, решка', 'heads, tails'), num: 'OR', step: 'calc', verdict: 'out',
      role: L('qulay emas', 'не благоприятный', 'not favourable'),
      calc: L('ikkinchisi orol emas', 'вторая не орёл', 'the second is not heads'),
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q3', label: L('raqam, raqam', 'решка, решка', 'tails, tails'), num: 'RR', step: 'calc', verdict: 'out',
      role: L('qulay emas', 'не благоприятный', 'not favourable'),
      calc: L('ikkalasi ham orol emas', 'обе не орлы', 'neither is heads'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L("Ikkala orol ehtimolligi?", 'Вероятность двух орлов?', 'The chance of two heads?'),
    items: [
      {
        id: 'b', label: '1/4', correct: true,
        ok: L(
          "To'g'ri. To'rtta natijadan bittasi qulay, ya'ni chorak. Va bu yarim karra yarimga teng.",
          'Верно. Из четырёх исходов благоприятен один, то есть четверть. И это равно половине на половину.',
          'Correct. One of four outcomes is favourable, a quarter. And that equals a half times a half.',
        ),
      },
      {
        id: 'a', label: '1',
        hint: L("Bir bu to'liq ishonch. To'rtta natijadan uchtasi qulay emas.", 'Единица это полная уверенность. А три исхода из четырёх не подходят.', 'One means certainty. But three outcomes of four do not fit.'),
      },
      {
        id: 'both', label: '1/2',
        hint: L("Yarim bu bitta tanga uchun. Ikkitasida natijalar to'rtta.", 'Половина это для одной монеты. У двух исходов четыре.', 'A half is for one coin. Two coins have four outcomes.'),
      },
      {
        id: 'none', label: '3/4',
        hint: L("Uch chorak bu kamida bitta orol tushishi. Bizga esa ikkalasi kerak.", 'Три четверти это хотя бы один орёл. А нам нужны оба.', 'Three quarters is at least one head. But we need both.'),
      },
    ],
  },
  holds: [2500, 6000, 1500, 2500, 9500, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi natijalarni yozib chiqamiz.', 'Опора восстановлена. Теперь выпишем исходы.', 'The basics are back. Now let us write out the outcomes.'),
    A('mount', "Ikkita tangada to'rtta natija bor, va ularni sanash oson: orol orol, orol raqam, raqam orol, raqam raqam.", 'У двух монет четыре исхода, и их легко перечислить: орёл орёл, орёл решка, решка орёл, решка решка.', 'Two coins have four outcomes, easy to list: heads heads, heads tails, tails heads, tails tails.'),
    A('mount', "Qaysi natijani ko'rishni tanlang.", 'Выбери, какой исход посмотреть.', 'Choose which outcome to look at.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "To'rtta natijadan faqat bittasi ikkala orol beradi. Demak ehtimollik bir chorak. Va endi diqqat: yarim karra yarim ham bir chorak. Ya'ni ko'paytirish shunchaki natijalarni sanashning qisqa yo'li.", 'Из четырёх исходов только один даёт два орла. Значит вероятность четверть. И теперь внимание: половина на половину тоже четверть. То есть умножение это просто короткий путь пересчёта исходов.', 'Of the four outcomes only one gives two heads. So the probability is a quarter. And now note: a half times a half is also a quarter. So multiplying is simply a shortcut for counting outcomes.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: KATAKCHALARDA KESISHMA.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'intersection',
  eyebrow: L('Yuzta odam', 'Сто человек', 'A hundred people'),
  title: L('Yigirmatasi ikki marta sanalgan', 'Двадцать сосчитаны дважды', 'Twenty are counted twice'),
  chip: L('ingliz 60,  nemis 40', 'англ. 60, нем. 40', 'Eng. 60, Ger. 40'),
  cells: {
    total: 100,
    cols: 20,
    groups: [
      { n: 40, tone: 'graph', label: L('faqat ingliz', 'только англ.', 'English only') },
      { n: 20, tone: 'ok', label: L('ikkalasi', 'оба', 'both') },
      { n: 20, tone: 'accent', label: L('faqat nemis', 'только нем.', 'German only') },
      { n: 20, tone: 'dim', label: L('hech qaysi', 'ни один', 'neither') },
    ],
    caption: L('40 + 20 + 20 = 80', '40 + 20 + 20 = 80', '40 + 20 + 20 = 80'),
    height: 98,
  },
  cellSteps: 3,
  bonus: L(
    "60 + 40 yuzta beradi, katakchalar esa sakksonta. Farq yigirmata: ular ikki marta sanalgan.",
    '60 + 40 даёт сто, а клеток восемьдесят. Разница двадцать: их сосчитали дважды.',
    '60 + 40 gives a hundred, but there are eighty cells. The gap is twenty: counted twice.',
  ),
  probe: {
    question: L("Nega 60 + 40 noto'g'ri javob beradi?", 'Почему 60 + 40 даёт неверный ответ?', 'Why does 60 + 40 give a wrong answer?'),
    items: [
      { id: 'a', label: L("ikkala tilni bilganlar ikki marta sanalgan", 'знающие оба языка сосчитаны дважды', 'those who know both are counted twice'), correct: true },
      { id: 'b', label: L("kimdir hech qaysi tilni bilmaydi", 'кто-то не знает ни одного', 'someone knows neither'), hint: L("Bu rost, lekin ular umuman sanalmagan: ular yigirmata va chetda qolgan.", 'Это правда, но их вообще не считали: их двадцать и они в стороне.', 'True, but they were not counted at all: there are twenty of them, off to the side.') },
      { id: 'c', label: L("sonlar noto'g'ri", 'числа неверны', 'the numbers are wrong'), hint: L("Sonlar to'g'ri: oltmishta va qirqta. Muammo ularni qo'shishda.", 'Числа верны: шестьдесят и сорок. Проблема в их сложении.', 'The numbers are right: sixty and forty. The problem is adding them.') },
      { id: 'd', label: L("yuzta odam kam", 'ста человек мало', 'a hundred people is too few'), hint: L("Odamlar soni ahamiyatsiz: ming odamda ham xuddi shunday bo'lardi.", 'Число людей не важно: с тысячей было бы то же.', 'The number of people does not matter: a thousand would be the same.') },
    ],
  },
  holds: [4500, 6000, 6500, 7500],
  audio: [
    A('mount', "Ko'paytirish bilan aniqlandi. Endi qo'shishga o'tamiz, va u yerda tuzoq bor.", 'С умножением разобрались. Теперь к сложению, и там ловушка.', 'Multiplying is settled. Now to adding, and there is a trap there.'),
    A('one', "Yuzta odam. Oltmishtasi ingliz tilini biladi, qirqtasi nemis tilini. Nechtasi kamida bitta tilni biladi?", 'Сто человек. Шестьдесят знают английский, сорок немецкий. Сколько знают хотя бы один язык?', 'A hundred people. Sixty know English, forty German. How many know at least one?'),
    A('two', "Oltmish plyus qirq bu yuz. Ya'ni hamma odam kamida bitta tilni biladi. Lekin katakchalarga qarang: chetda bo'sh joy qolgan.", 'Шестьдесят плюс сорок это сто. То есть все знают хотя бы один язык. Но посмотри на клетки: с краю осталось пустое место.', 'Sixty plus forty is a hundred. So everyone knows at least one language. But look at the cells: empty space is left at the edge.'),
    A('three', "Mana sabab. Yigirmata odam ikkala tilni ham biladi, va ular ikkala ro'yxatga ham kirgan. Qo'shganda ular ikki marta sanalgan. Kamida bitta tilni biladiganlar sakksonta, yuzta emas. Va yigirmata odam umuman til bilmaydi.", 'Вот причина. Двадцать человек знают оба языка, и они вошли в оба списка. При сложении их сосчитали дважды. Хотя бы один язык знают восемьдесят, а не сто. А двадцать человек не знают ни одного.', 'Here is the reason. Twenty people know both languages and entered both lists. Adding counted them twice. Eighty know at least one, not a hundred. And twenty know neither.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1: KO'PAYTIRISH.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'sum_vs_product',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('VA: ko\'paytiriladi', 'И: умножаем', 'AND: multiply'),
  rows: ['P(A va B) = P(A) · P(B)', '1/2 · 1/2 = 1/4'],
  probe: {
    question: L(
      "Ikki kubikda ikkala olti tushish ehtimolligi?",
      'Вероятность двух шестёрок на двух кубиках?',
      'The chance of two sixes on two dice?',
    ),
    items: [
      { id: 'a', label: '1/36', correct: true },
      { id: 'b', label: '1/12', hint: L("Bu bir oltidan plyus bir oltidan. VA bo'lsa ko'paytiriladi.", 'Это одна шестая плюс одна шестая. При И умножают.', 'That is a sixth plus a sixth. With AND you multiply.') },
      { id: 'c', label: '2/6', hint: L("Bu bitta kubikda ikkita qulay yoq bo'lgandagi javob.", 'Это ответ для одного кубика с двумя гранями.', 'That is the answer for one die with two faces.') },
      { id: 'd', label: '1/6', hint: L("Bu bitta kubik uchun. Ikkitasida natijalar o'ttiz oltita.", 'Это для одного кубика. У двух исходов тридцать шесть.', 'That is for one die. Two dice have thirty six outcomes.') },
    ],
  },
  rule: {
    badge: L('1-qoida. VA', 'Правило 1. И', 'Rule 1. AND'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'P(A va B) = P(A) · P(B)',
    lines: [
      L("ikkala hodisa ham ro'y bersa, ehtimolliklar ko'paytiriladi", 'если оба события происходят, вероятности умножаются', 'if both events happen, the probabilities multiply'),
      L("bu hodisalar bir biriga ta'sir qilmasa ishlaydi", 'работает, если события не влияют друг на друга', 'it works when the events do not affect each other'),
      L("ko'paytma har doim ko'paytuvchilardan kichik", 'произведение всегда меньше множителей', 'the product is always smaller than the factors'),
      L("sabab: bu natijalarni sanashning qisqa yo'li", 'причина: это короткий путь пересчёта исходов', 'the reason: it is a shortcut for counting outcomes'),
    ],
    example: L('misol:  1/6 · 1/6 = 1/36', 'пример:  1/6 · 1/6 = 1/36', 'example:  1/6 · 1/6 = 1/36'),
  },
  holds: [4000, 6500, 4500],
  audio: [
    A('mount', "Natijalar sanaldi. Endi birinchi qoidani yozamiz.", 'Исходы посчитаны. Теперь запишем первое правило.', 'The outcomes are counted. Now let us write the first rule.'),
    A('def', "Ikkala hodisa ham ro'y berishi kerak bo'lsa, ehtimolliklar ko'paytiriladi. Sababi o'n oltinchi darsda ko'rilgan: har birinchi natija uchun ikkinchisining hamma variantlari bor, va natijalar soni ko'payadi. Ulush esa aksincha, kamayadi.", 'Если должны произойти оба события, вероятности умножаются. Причину мы видели в шестнадцатом уроке: на каждый первый исход приходятся все варианты второго, и число исходов растёт. А доля наоборот уменьшается.', 'If both events must happen, the probabilities multiply. The reason was seen in lesson sixteen: for each first outcome there are all the variants of the second, and the number of outcomes grows. The share, on the contrary, shrinks.'),
    A('rule', "To'g'ri. Va yaxshi tekshiruv: ko'paytma har doim ko'paytuvchilardan kichik chiqadi. Katta chiqsa, xato bor.", 'Верно. И хорошая проверка: произведение всегда выходит меньше множителей. Вышло больше, значит ошибка.', 'Correct. And a good check: the product always comes out smaller than the factors. If it is bigger, there is a mistake.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: kamida bitta.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'intersection',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Kamida bitta', 'Хотя бы один', 'At least one'),
  was: { label: UI.was, expr: L('ikkalasi ham orol  →  1/4', 'оба орла  →  1/4', 'both heads  →  1/4') },
  now: { label: UI.now, expr: L('kamida bitta orol  →  ?', 'хотя бы один орёл  →  ?', 'at least one head  →  ?') },
  probe1: {
    question: L('Nima o\'zgardi?', 'Что изменилось?', 'What has changed?'),
    items: [
      { id: 'a', label: L("endi bir nechta natija qulay", 'теперь благоприятны несколько исходов', 'now several outcomes are favourable'), correct: true },
      { id: 'b', label: L('tangalar soni', 'число монет', 'the number of coins'), hint: L("Tangalar o'sha ikkita.", 'Монеты те же две.', 'The same two coins.') },
      { id: 'c', label: L('natijalar soni', 'число исходов', 'the number of outcomes'), hint: L("Natijalar ham o'sha to'rtta. O'zgargani qaysilari qulay.", 'Исходов те же четыре. Изменилось, какие из них благоприятны.', 'The same four outcomes. What changed is which are favourable.') },
      { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L("Javob o'zgaradi: ikkala orol bittada, kamida bittasi esa uchtada.", 'Ответ меняется: оба орла в одном исходе, хотя бы один в трёх.', 'The answer changes: both heads in one outcome, at least one in three.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('Ehtimollik nimaga teng?', 'Чему равна вероятность?', 'What does the probability equal?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '3/4' },
      { id: 'b', label: '1/2' },
      { id: 'c', label: '1' },
      { id: 'd', label: '1/4' },
    ],
  },
  holds: [4500, 6500, 1700, 3000],
  audio: [
    A('mount', "Ikkala orol uchun javob bir chorak edi: to'rtta natijadan bittasi.", 'Для двух орлов ответ был четверть: один исход из четырёх.', 'For two heads the answer was a quarter: one outcome of four.'),
    A('now', "Endi savol boshqacha: kamida bitta orol. Bu degani bittasi ham bo'lsa yetadi, ikkitasi ham bo'lsa yetadi. Tangalar o'sha, natijalar ham o'sha to'rtta. O'zgargani faqat qaysilari qulay.", 'Теперь вопрос другой: хотя бы один орёл. Это значит, что и одного достаточно, и двух достаточно. Монеты те же, исходы те же четыре. Изменилось только то, какие из них благоприятны.', 'Now the question is different: at least one head. That means one is enough, and two is enough. The same coins, the same four outcomes. Only which ones are favourable has changed.'),
    A('q1', "Nima o'zgardi?", 'Что изменилось?', 'What has changed?'),
    A('q2', 'Sizningcha ehtimollik qanday? Shunchaki taxmin qiling.', 'Как думаешь, какая вероятность? Просто предположи.', 'What do you think the probability is? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'intersection',
  eyebrow: L('Ikkalasini ham sanaymiz', 'Посчитаем оба', 'Let us compute both'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: L('kamida bitta orol', 'хотя бы один орёл', 'at least one head'),
  need: '= ?',
  answerLabel: L('ehtimollik', 'вероятность', 'the probability'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: '1/2 + 1/2 = 1',
      point: {
        label: L("qo'shdi", 'сложил', 'added'),
        calc: L('RR ham qulay bo\'lardi   ✗', 'и решка решка подошла бы   ✗', 'then tails tails would fit too   ✗'),
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: '1 − 1/4 = 3/4',
      point: {
        label: L('teskarisidan', 'от обратного', 'via the opposite'),
        calc: L('4 natijadan 3 tasi   ✓', '3 исхода из 4   ✓', '3 outcomes of 4   ✓'),
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['3/4', '1', '1/2', '1/4'],
    value: ['3/4'],
    label: 'P =',
    prompt: L('Ehtimollikni yozing', 'Запиши вероятность', 'Write the probability'),
    wrongs: [
      { key: '1', hint: L("Bir bu to'liq ishonch. Lekin raqam raqam ham bo'lishi mumkin, va unda orol yo'q.", 'Единица это полная уверенность. Но решка решка тоже бывает, и орла там нет.', 'One means certainty. But tails tails also happens, and there is no head there.') },
      { key: '1/4', hint: L("Bu ikkala orol uchun. Kamida bitta esa uchta natijada.", 'Это для двух орлов. А хотя бы один в трёх исходах.', 'That is for two heads. At least one is in three outcomes.') },
      { key: '*', hint: L("Teskarisidan sanang: birdan hech qanday orol bo'lmagan holatni ayiring.", 'Считай через противоположное: вычти из единицы случай без орлов.', 'Count via the opposite: subtract the no-heads case from one.') },
    ],
  },
  holds: [3500, 6000, 6500, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala javobni ham tekshiramiz.', 'Прогноз есть. Теперь проверим оба ответа.', 'The guess is made. Now let us check both answers.'),
    A('p1', "Birinchi nomzod ehtimolliklarni qo'shdi va bir oldi. Lekin bir degani har doim ro'y beradi. Raqam raqam esa bo'lishi mumkin, va u yerda orol yo'q. Demak bir noto'g'ri.", 'Первый кандидат сложил вероятности и получил единицу. Но единица значит происходит всегда. А решка решка бывает, и орла там нет. Значит единица неверна.', 'The first candidate added the probabilities and got one. But one means it always happens. Yet tails tails occurs, and there is no head there. So one is wrong.'),
    A('p2', "Ikkinchi nomzod teskarisidan bordi: hech qanday orol bo'lmasligi bu raqam raqam, ya'ni bir chorak. Birdan bir chorakni ayirsak, uch chorak qoladi. Va natijalarni sanasak ham shu chiqadi: to'rttadan uchtasi.", 'Второй кандидат пошёл через противоположное: ни одного орла это решка решка, то есть четверть. Из единицы вычитаем четверть, остаётся три четверти. И пересчёт исходов даёт то же: три из четырёх.', 'The second candidate went via the opposite: no heads is tails tails, a quarter. One minus a quarter leaves three quarters. And counting the outcomes gives the same: three of four.'),
    A('write', "Ehtimollikni yozing.", 'Запиши вероятность.', 'Write the probability.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: QO'SHISH va KESISHMA.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'intersection',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('YOKI: qo\'shiladi, lekin', 'ИЛИ: складываем, но', 'OR: add, but'),
  cases: [
    {
      label: L('kesishmasa', 'если не пересекаются', 'if they do not overlap'),
      text: 'P(A) + P(B)',
      tone: 'graph',
    },
    {
      label: L('kesishsa', 'если пересекаются', 'if they overlap'),
      text: 'P(A) + P(B) − P(A va B)',
      tone: 'accent',
    },
  ],
  rows: ['60 + 40 − 20 = 80', 'P = 0,6 + 0,4 − 0,2 = 0,8'],
  probe: {
    question: L(
      "Nega kesishma ayiriladi?",
      'Почему пересечение вычитается?',
      'Why is the overlap subtracted?',
    ),
    items: [
      { id: 'a', label: L("u ikki marta sanalgan", 'оно сосчитано дважды', 'it was counted twice'), correct: true },
      { id: 'b', label: L("u kerak emas", 'оно не нужно', 'it is not needed'), hint: L("Kerak: ikkala tilni bilganlar ham kamida bitta tilni biladi.", 'Нужно: знающие оба языка знают и хотя бы один.', 'It is needed: those who know both also know at least one.') },
      { id: 'c', label: L("shunday kelishilgan", 'так договорились', 'that is the convention'), hint: L("Kelishuv emas: katakchalarni sanab ko'rdik.", 'Не договорённость: мы пересчитали клетки.', 'Not a convention: we counted the cells.') },
      { id: 'd', label: L("javob kichikroq bo'lsin uchun", 'чтобы ответ был меньше', 'to make the answer smaller'), hint: L("Kattaligi maqsad emas: sakkson bu haqiqiy son.", 'Величина не цель: восемьдесят это настоящее число.', 'The size is not the goal: eighty is the real number.') },
    ],
  },
  rule: {
    badge: L('2-qoida. YOKI', 'Правило 2. ИЛИ', 'Rule 2. OR'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'P(A yoki B) = P(A) + P(B) − P(A va B)',
    lines: [
      L("hodisalar kesishmasa, oddiy qo'shish yetadi", 'если события не пересекаются, хватает простого сложения', 'if the events do not overlap, plain addition is enough'),
      L("kesishsa, umumiy qism ikki marta sanaladi", 'если пересекаются, общая часть считается дважды', 'if they overlap, the common part is counted twice'),
      L("shuning uchun uni bir marta ayiramiz", 'поэтому её вычитают один раз', 'so it is subtracted once'),
      L("tekshiruv: javob birdan katta bo'lmasin", 'проверка: ответ не должен превысить единицу', 'a check: the answer must not exceed one'),
    ],
    example: L('misol:  0,6 + 0,4 − 0,2 = 0,8', 'пример:  0,6 + 0,4 − 0,2 = 0,8', 'example:  0,6 + 0,4 − 0,2 = 0,8'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('VA ko\'paytiradi, YOKI qo\'shadi', 'И умножает, ИЛИ складывает', 'AND multiplies, OR adds'),
    lines: [
      L("1. shartdagi so'zni toping: VA yoki YOKI", '1. найди слово в условии: И или ИЛИ', '1. find the word in the problem: AND or OR'),
      L("2. VA bo'lsa ko'paytiring", '2. если И, умножай', '2. if AND, multiply'),
      L("3. YOKI bo'lsa qo'shing va kesishmani ayiring", '3. если ИЛИ, складывай и вычти пересечение', '3. if OR, add and subtract the overlap'),
      L("4. «kamida bitta» bo'lsa, teskarisidan borish qulayroq", '4. если «хотя бы один», удобнее через противоположное', '4. for «at least one», the opposite is handier'),
    ],
  },
  holds: [4000, 6500, 2500, 5000],
  audio: [
    A('mount', "Ko'paytirish yozildi. Endi qo'shish, va u yerda tuzoq bor.", 'Умножение записано. Теперь сложение, и там ловушка.', 'Multiplying is written. Now adding, and there is a trap.'),
    A('rows', "Agar hodisalar bir vaqtda ro'y bera olmasa, ehtimolliklar oddiy qo'shiladi. Lekin ular kesishsa, umumiy qism ikki marta sanaladi. Katakchalarda buni ko'rdik: yigirmata odam ikkala ro'yxatga ham tushgan edi. Shuning uchun kesishma bir marta ayiriladi.", 'Если события не могут произойти одновременно, вероятности просто складываются. Но если они пересекаются, общая часть считается дважды. В клетках мы это видели: двадцать человек попали в оба списка. Поэтому пересечение вычитают один раз.', 'If the events cannot happen at once, the probabilities simply add. But if they overlap, the common part is counted twice. We saw it in the cells: twenty people fell into both lists. So the overlap is subtracted once.'),
    A('q', "Savol: nega kesishma ayiriladi?", 'Вопрос: почему пересечение вычитается?', 'The question: why is the overlap subtracted?'),
    A('rule', "To'g'ri. Va tekshiruv oddiy: javob birdan katta chiqsa, demak kesishma ayirilmagan.", 'Верно. И проверка простая: вышел ответ больше единицы, значит пересечение не вычли.', 'Correct. And the check is simple: if the answer exceeds one, the overlap was not subtracted.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. AMALNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'sum_vs_product',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Amalni qo\'ying', 'Поставь действие', 'Place the operation'),
  left: L('ikkala kubikda ham olti', 'на обоих кубиках шесть', 'six on both dice'),
  template: ['P = 1/6 ', { slot: 0 }, ' 1/6'],
  signs: ['·', '+'],
  answer: '·',
  checkNote: L(
    "Ikkalasi ham kerak, ya'ni VA",
    'Нужны оба, то есть И',
    'Both are needed, that is AND',
  ),
  wrongs: [
    { key: '+', hint: L("Qo'shsak bir uchdan chiqadi, ya'ni ehtimollik ORTADI. Ikkita shart bir vaqtda bajarilishi esa qiyinroq.", 'Сложение даст одну треть, то есть вероятность ВЫРОСЛА. А выполнить два условия сразу труднее.', 'Adding gives a third, so the probability GREW. But meeting two conditions at once is harder.') },
  ],
  probe: {
    question: L("Amalni nima aniqlaydi?", 'Что задаёт действие?', 'What decides the operation?'),
    items: [
      { id: 'a', label: L("shartdagi so'z: VA yoki YOKI", 'слово в условии: И или ИЛИ', 'the word in the problem: AND or OR'), correct: true },
      { id: 'b', label: L("sonlarning kattaligi", 'величина чисел', 'the size of the numbers'), hint: L("Sonlar amalni tanlamaydi.", 'Числа действие не выбирают.', 'The numbers do not choose the operation.') },
      { id: 'c', label: L("hodisalar soni", 'число событий', 'the number of events'), hint: L("Ikkita hodisa ikkala amalda ham bo'ladi.", 'Двух событий хватает и для того, и для другого.', 'Two events suffice for either.') },
      { id: 'd', label: L('har doim ko\'paytirish', 'всегда умножение', 'always multiplying'), hint: L("Har doim emas: kamida bitta savolida qo'shish kerak bo'lgandi.", 'Не всегда: в вопросе о хотя бы одном требовалось сложение.', 'Not always: the at-least-one question needed adding.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Amalni qo'ying.", 'Поставь действие.', 'Place the operation.'),
    A('checked', "Bo'ldi. Endi ta'riflang: amalni nima aniqlaydi?", 'Получилось. Теперь сформулируй: что задаёт действие?', 'Done. Now put it into words: what decides the operation?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'word', label: L('shartdagi so\'zni topish', 'найти слово в условии', 'find the word in the problem') },
  { id: 'mult', label: L("ko'paytirish", 'умножить', 'multiply') },
  { id: 'add', label: L("qo'shish", 'сложить', 'add') },
  { id: 'sub', label: L('kesishmani ayirish', 'вычесть пересечение', 'subtract the overlap') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'intersection',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('100 da: sport 50, musiqa 30, ikki 10', 'из 100: спорт 50, музыка 30, оба 10', 'of 100: sport 50, music 30, both 10'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'word',
      to: L('kamida bittasi  →  YOKI', 'хотя бы один  →  ИЛИ', 'at least one  →  OR'),
      wrongs: [
        { action: 'add', hint: L("Avval so'zni toping: amalni u tanlaydi.", 'Сначала найди слово: оно и выбирает действие.', 'Find the word first: it chooses the operation.') },
        { action: 'mult', hint: L("Ko'paytirish VA uchun. Bu yerda kamida bittasi so'ralyapti.", 'Умножение для И. А здесь спрашивают хотя бы один.', 'Multiplying is for AND. Here at least one is asked.') },
        { action: 'sub', hint: L("Ayirish keyinroq, qo'shgandan keyin.", 'Вычитание позже, после сложения.', 'Subtracting comes later, after adding.') },
      ],
    },
    {
      action: 'add',
      to: '50 + 30 = 80',
      wrongs: [
        { action: 'word', hint: L("Topilgan: YOKI.", 'Найдено: ИЛИ.', 'Found: OR.') },
        { action: 'mult', hint: L("Ko'paytirish bu yerda emas.", 'Умножение здесь ни при чём.', 'Multiplying is beside the point here.') },
        { action: 'sub', hint: L("Avval qo'shing, keyin ayiring.", 'Сначала сложи, потом вычти.', 'Add first, then subtract.') },
      ],
    },
    {
      action: 'sub',
      to: '80 − 10 = 70',
      wrongs: [
        { action: 'word', hint: L("Topilgan.", 'Найдено.', 'Found.') },
        { action: 'add', hint: L("Qo'shilgan: sakkson.", 'Сложено: восемьдесят.', 'Added: eighty.') },
        { action: 'mult', hint: L("Ko'paytirish kerak emas.", 'Умножение не нужно.', 'No multiplying needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['0,7', '0,8', '0,9', '0,15'],
    value: ['0,7'],
    label: 'P =',
    prompt: L('Ehtimollikni yozing', 'Запиши вероятность', 'Write the probability'),
    wrongs: [
      { key: '0,8', hint: L("Kesishma ayirilmagan: o'nta odam ikkala ro'yxatda ham bor.", 'Пересечение не вычтено: десять человек есть в обоих списках.', 'The overlap was not subtracted: ten people are in both lists.') },
      { key: '0,15', hint: L("Bu ko'paytma. Bu yerda VA emas, YOKI.", 'Это произведение. Здесь не И, а ИЛИ.', 'That is the product. Here it is OR, not AND.') },
      { key: '*', hint: L("Ellik plyus o'ttiz minus o'n.", 'Пятьдесят плюс тридцать минус десять.', 'Fifty plus thirty minus ten.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi yuzta odamli masalani o\'tamiz.', 'Правило сформулировано. Пройдём задачу про сто человек.', 'The rule is stated. Let us go through the hundred-people problem.'),
    A('start', "Diqqat: ro'yxatda ortiqcha amal bor. Nimadan boshlashni tanlang.", 'Внимание: в списке есть лишнее действие. Выбери, с чего начать.', 'Careful: the list has one superfluous action. Choose where to start.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'sum_vs_product',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Uchta tanga', 'Три монеты', 'Three coins'),
  start: L('3 tanga. Uchalasi ham orol?', '3 монеты. Все три орла?', '3 coins. All three heads?'),
  actions: ACTIONS_10,
  hint: L(
    "Uchala shart ham bajarilishi kerak.",
    'Должны выполниться все три условия.',
    'All three conditions must hold.',
  ),
  steps: [
    {
      action: 'word',
      to: L('uchalasi ham  →  VA', 'все три  →  И', 'all three  →  AND'),
      wrongs: [
        { action: 'mult', hint: L("Avval so'zni toping.", 'Сначала найди слово.', 'Find the word first.') },
        { action: 'add', hint: L("Qo'shish YOKI uchun.", 'Сложение для ИЛИ.', 'Adding is for OR.') },
        { action: 'sub', hint: L("Bu yerda kesishma yo'q.", 'Здесь пересечения нет.', 'There is no overlap here.') },
      ],
    },
    {
      action: 'mult',
      to: '1/2 · 1/2 · 1/2 = 1/8',
      wrongs: [
        { action: 'word', hint: L("Topilgan: VA.", 'Найдено: И.', 'Found: AND.') },
        { action: 'add', hint: L("Qo'shsak bir yarim chiqadi, va bu birdan katta.", 'Сложение даст полтора, а это больше единицы.', 'Adding gives one and a half, which is above one.') },
        { action: 'sub', hint: L("Ayiriladigan narsa yo'q.", 'Вычитать нечего.', 'There is nothing to subtract.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['1/8', '3/8', '1/6', '3/2'],
    value: ['1/8'],
    label: 'P =',
    prompt: L('Ehtimollikni yozing', 'Запиши вероятность', 'Write the probability'),
    wrongs: [
      { key: '3/8', hint: L("Bu roppa rosa bitta orol tushishi. Bizga esa uchalasi ham kerak.", 'Это ровно один орёл. А нам нужны все три.', 'That is exactly one head. But we need all three.') },
      { key: '3/2', hint: L("Ehtimollik birdan katta bo'lmaydi: qo'shish o'rniga ko'paytirish kerak.", 'Вероятность не бывает больше единицы: вместо сложения нужно умножение.', 'A probability is never above one: multiply instead of adding.') },
      { key: '*', hint: L("Yarimni uch marta ko'paytiring: sakkizdan bir.", 'Умножь половину три раза: одна восьмая.', 'Multiply a half three times: one eighth.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Uchta tanga, va uchalasida ham orol kerak. Diqqat: javob bitta tanganikidan kichik bo'lishi shart.", 'Три монеты, и на всех трёх нужен орёл. Внимание: ответ обязан быть меньше, чем у одной монеты.', 'Three coins, and heads is needed on all three. Careful: the answer must be smaller than for one coin.'),
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
      id: 'b1', tag: 'sum_vs_product', ask: true, cols: 4,
      done: '1/6 · 1/6 = 1/36',
      prompt: L('Ikki kubikda ikkala olti?', 'Две шестёрки на двух кубиках?', 'Two sixes on two dice?'),
      items: [
        { id: 'a', label: '1/36', correct: true },
        { id: 'b', label: '1/12', hint: L("Bu qo'shish. VA bo'lsa ko'paytiriladi.", 'Это сложение. При И умножают.', 'That is adding. With AND you multiply.') },
        { id: 'c', label: '1/6', hint: L("Bu bitta kubik uchun.", 'Это для одного кубика.', 'That is for one die.') },
        { id: 'd', label: '2/6', hint: L("Ikkita kubik natijalarni ko'paytiradi, qo'shmaydi.", 'Два кубика умножают исходы, а не складывают.', 'Two dice multiply the outcomes, not add them.') },
      ],
    },
    {
      id: 'b2', tag: 'intersection', ask: true, cols: 4,
      done: '0,5 + 0,3 − 0,1 = 0,7',
      prompt: L('P(A)=0,5, P(B)=0,3, ikkalasi 0,1. P(A yoki B)?', 'P(A)=0,5, P(B)=0,3, оба 0,1. P(A или B)?', 'P(A)=0,5, P(B)=0,3, both 0,1. P(A or B)?'),
      items: [
        { id: 'a', label: '0,7', correct: true },
        { id: 'b', label: '0,8', hint: L("Kesishma ayirilmagan.", 'Пересечение не вычтено.', 'The overlap was not subtracted.') },
        { id: 'c', label: '0,9', hint: L("Kesishma qo'shilgan, ayirilishi kerak edi.", 'Пересечение прибавлено, а надо вычесть.', 'The overlap was added instead of subtracted.') },
        { id: 'd', label: '0,15', hint: L("Bu ko'paytma, va u boshqa savolga javob.", 'Это произведение, ответ на другой вопрос.', 'That is the product, an answer to a different question.') },
      ],
    },
    {
      id: 'b3', tag: 'intersection', ask: true, cols: 4,
      done: '1 − 1/8 = 7/8',
      prompt: L('3 tanga. Kamida bitta orol?', '3 монеты. Хотя бы один орёл?', '3 coins. At least one head?'),
      items: [
        { id: 'a', label: '7/8', correct: true },
        { id: 'b', label: '1/8', hint: L("Bu uchalasi ham orol bo'lishi.", 'Это все три орла.', 'That is all three heads.') },
        { id: 'c', label: '3/8', hint: L("Bu roppa rosa bitta orol.", 'Это ровно один орёл.', 'That is exactly one head.') },
        { id: 'd', label: '1', hint: L("Bir bu har doim. Uchala raqam ham tushishi mumkin.", 'Единица это всегда. А три решки тоже бывают.', 'One means always. But three tails also happen.') },
      ],
    },
    {
      id: 'b4', tag: 'sum_vs_product', ask: true, cols: 2,
      done: L('VA bo\'lsa ko\'paytirish', 'если И, умножение', 'if AND, multiply'),
      prompt: L(
        "Ikkala shart ham bajarilishi kerak. Qaysi amal?",
        'Должны выполниться оба условия. Какое действие?',
        'Both conditions must hold. Which operation?',
      ),
      items: [
        { id: 'a', label: L("ko'paytirish", 'умножение', 'multiplying'), correct: true },
        { id: 'b', label: L("qo'shish", 'сложение', 'adding'), hint: L("Qo'shish YOKI uchun: bittasi yetadi degan holat.", 'Сложение для ИЛИ: когда достаточно одного.', 'Adding is for OR: when one suffices.') },
        { id: 'c', label: L('ayirish', 'вычитание', 'subtracting'), hint: L("Ayirish faqat kesishmani olib tashlashda.", 'Вычитание только чтобы убрать пересечение.', 'Subtracting only removes the overlap.') },
        { id: 'd', label: L("shartga qarab", 'смотря по условию', 'depends on the problem'), hint: L("Shart aytilgan: ikkalasi ham kerak, ya'ni VA.", 'Условие названо: нужны оба, то есть И.', 'The condition is stated: both are needed, that is AND.') },
      ],
    },
    {
      id: 'b5', tag: 'intersection', ask: true, cols: 2,
      done: L('kesishma ayirilmagan', 'пересечение не вычтено', 'the overlap was not subtracted'),
      prompt: L(
        "Javob 1,2 chiqdi. Nima bo'lgan?",
        'Ответ вышел 1,2. Что случилось?',
        'The answer came out 1,2. What happened?',
      ),
      items: [
        { id: 'a', label: L("kesishma ayirilmagan", 'не вычтено пересечение', 'the overlap was not subtracted'), correct: true },
        { id: 'b', label: L("shunday ham bo'ladi", 'так тоже бывает', 'that happens too'), hint: L("Bo'lmaydi: ehtimollik birdan katta bo'la olmaydi.", 'Не бывает: вероятность не может быть больше единицы.', 'It does not: a probability cannot exceed one.') },
        { id: 'c', label: L("sonlar noto'g'ri berilgan", 'даны неверные числа', 'the numbers given are wrong'), hint: L("Sonlar to'g'ri bo'lishi mumkin: muammo ular bilan nima qilinganida.", 'Числа могут быть верными: дело в том, что с ними сделали.', 'The numbers may be right: the issue is what was done with them.') },
        { id: 'd', label: L("ko'paytirish kerak edi", 'надо было умножить', 'multiplying was needed'), hint: L("Balki, lekin birdan katta javob birinchi navbatda kesishmani eslatadi.", 'Возможно, но ответ больше единицы в первую очередь напоминает о пересечении.', 'Perhaps, but an answer above one points first at the overlap.') },
      ],
    },
    {
      id: 'b6', tag: 'sum_vs_product', ask: true, cols: 4,
      done: '1/2 · 1/2 · 1/2 = 1/8',
      prompt: L('3 tanga, uchalasi ham orol?', '3 монеты, все три орла?', '3 coins, all three heads?'),
      items: [
        { id: 'a', label: '1/8', correct: true },
        { id: 'b', label: '1/6', hint: L("Yarimni uch marta ko'paytiring: sakkizdan bir.", 'Умножь половину три раза: одна восьмая.', 'Multiply a half three times: one eighth.') },
        { id: 'c', label: '3/8', hint: L("Bu roppa rosa bitta orol.", 'Это ровно один орёл.', 'That is exactly one head.') },
        { id: 'd', label: '1/2', hint: L("Bu bitta tanga uchun.", 'Это для одной монеты.', 'That is for one coin.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi kesishma.", 'Теперь пересечение.', 'Now the overlap.'),
    A('q3', "Kamida bitta.", 'Хотя бы один.', 'At least one.'),
    A('q4', "Amalni tanlash.", 'Выбор действия.', 'Choosing the operation.'),
    A('q5', "Tekshiruv haqida.", 'Про проверку.', 'About checking.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: kesishma ayirilmagan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'intersection',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Javob birdan katta chiqdi", 'Ответ вышел больше единицы', 'The answer exceeded one'),
  rows: [
    { id: 'r1', text: L('P(sport) = 0,7,   P(musiqa) = 0,5', 'P(спорт) = 0,7, P(музыка) = 0,5', 'P(sport) = 0,7, P(music) = 0,5') },
    { id: 'r2', text: L('ikkalasi: 0,3', 'оба: 0,3', 'both: 0,3') },
    { id: 'r3', text: '0,7 + 0,5 = 1,2' },
    { id: 'r4', text: L('javob: P = 1,2', 'ответ: P = 1,2', 'answer: P = 1,2') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Bu ham shartdan: kesishma berilgan va u kerak bo'ladi.", 'Это тоже из условия: пересечение дано, и оно понадобится.', 'This is from the problem too: the overlap is given and will be needed.'),
    r4: L("Javob xato, lekin u oldingi satrda xato bo'lgan.", 'Ответ неверный, но неверным он стал строкой раньше.', 'The answer is wrong, but it became wrong one line earlier.'),
  },
  proofPoint: L('P birdan katta bo\'lmaydi', 'P не бывает больше единицы', 'P is never above one'),
  proof: L(
    "Ehtimollik birdan katta bo'la olmaydi: bu ulush. Bir butun ikki chiqdi, chunki kesishma ayirilmagan. Nol butun uch odam ikkala ro'yxatga ham kirgan va ikki marta sanalgan. To'g'ri javob: nol butun yetti plyus nol butun besh minus nol butun uch, ya'ni nol butun to'qqiz.",
    'Вероятность не может быть больше единицы: это доля. Один целых два вышло потому, что не вычли пересечение. Ноль целых три попали в оба списка и сосчитаны дважды. Верный ответ: ноль целых семь плюс ноль целых пять минус ноль целых три, то есть ноль целых девять.',
    'A probability cannot exceed one: it is a share. One point two came out because the overlap was not subtracted. Zero point three fell into both lists and were counted twice. The right answer: zero point seven plus zero point five minus zero point three, that is zero point nine.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('kesishma ayirilmagan', 'не вычтено пересечение', 'the overlap was not subtracted'), correct: true },
      { id: 'b', label: L("qo'shish o'rniga ko'paytirish kerak edi", 'надо было умножить', 'multiplying was needed'), hint: L("Yo'q: kamida bitta so'ralganda qo'shiladi. Faqat kesishmani ayirish kerak.", 'Нет: при вопросе о хотя бы одном складывают. Просто надо вычесть пересечение.', 'No: at-least-one questions add. Only the overlap must be subtracted.') },
      { id: 'c', label: L("sonlar noto'g'ri", 'числа неверны', 'the numbers are wrong'), hint: L("Sonlar shartdan olingan.", 'Числа взяты из условия.', 'The numbers come from the problem.') },
      { id: 'd', label: L("arifmetikada xato", 'ошибка в арифметике', 'an arithmetic error'), hint: L("Arifmetika to'g'ri: nol butun yetti plyus nol butun besh haqiqatan bir butun ikki.", 'Арифметика верна: ноль целых семь плюс ноль целых пять действительно один целых два.', 'The arithmetic is right: zero point seven plus zero point five really is one point two.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda arifmetika to'g'ri, lekin javob mumkin bo'lmagan son. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь арифметика верна, но ответ невозможное число. Найди строку, в которой ошибка появилась впервые.', 'Here the arithmetic is right, but the answer is an impossible number. Find the line where the error first appeared.'),
    A('proof', "Tekshiruv oddiy: ehtimollik birdan katta bo'lmaydi. Bir butun ikki chiqdi, demak kimdir ikki marta sanalgan. Shartda kesishma berilgan edi, uni ayirish kerak edi.", 'Проверка простая: вероятность не бывает больше единицы. Вышло один целых два, значит кого-то сосчитали дважды. В условии пересечение было дано, его надо было вычесть.', 'The check is simple: a probability is never above one. One point two came out, so someone was counted twice. The problem gave the overlap, and it had to be subtracted.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'sum_vs_product',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L("VA ko'paytiradi, YOKI qo'shadi", 'И умножает, ИЛИ складывает', 'AND multiplies, OR adds'),
  tasks: [
    {
      prompt: L('ikkala tangada ham orol', 'орёл на обеих монетах', 'heads on both coins'),
      template: ['P = 1/2 ', { slot: 0 }, ' 1/2  =  ', { slot: 1 }],
      parts: ['·', '+', '1/4', '1'],
      answer: ['·', '1/4'],
      doneLabel: '1/2 · 1/2 = 1/4',
      wrongs: [
        { key: '+|1', hint: L("Ikkalasi ham kerak, ya'ni VA: ko'paytiriladi.", 'Нужны обе, то есть И: умножаем.', 'Both are needed, that is AND: multiply.') },
        { key: '*', hint: L("Ikkita shart bir vaqtda bajarilishi qiyinroq: javob kichrayadi.", 'Выполнить два условия сразу труднее: ответ уменьшается.', 'Meeting two conditions at once is harder: the answer shrinks.') },
      ],
    },
    {
      prompt: L('kubikda 1 yoki 6', 'на кубике 1 или 6', '1 or 6 on a die'),
      template: ['P = 1/6 ', { slot: 0 }, ' 1/6  =  ', { slot: 1 }],
      parts: ['+', '·', '1/3', '1/36'],
      answer: ['+', '1/3'],
      doneLabel: '1/6 + 1/6 = 1/3',
      wrongs: [
        { key: '·|1/36', hint: L("Bir va olti bir vaqtda tushmaydi: bittasi yetadi, ya'ni YOKI.", 'Один и шесть одновременно не выпадают: достаточно одного, то есть ИЛИ.', 'One and six do not fall together: one suffices, that is OR.') },
        { key: '*', hint: L("Bu yerda kesishma yo'q: bir va olti bir vaqtda bo'lmaydi.", 'Пересечения здесь нет: один и шесть одновременно не бывают.', 'There is no overlap here: one and six never happen together.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi, va u yerda so'z boshqa.", 'А теперь второе, и там другое слово.', 'And now the second one, with a different word.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'intersection',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: L('VA ko\'paytiradi, YOKI qo\'shadi', 'И умножает, ИЛИ складывает', 'AND multiplies, OR adds'),
  ruleLines: [
    L("VA: ehtimolliklar ko'paytiriladi, javob kichrayadi", 'И: вероятности умножаются, ответ уменьшается', 'AND: the probabilities multiply, the answer shrinks'),
    L("YOKI: qo'shiladi, kesishma bir marta ayiriladi", 'ИЛИ: складываются, пересечение вычитается один раз', 'OR: they add, the overlap is subtracted once'),
    L("javob 1 dan katta, kesishma unutilgan", 'ответ больше 1 значит забыто пересечение', 'answer above 1 means the overlap was forgotten'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('ikkala tangada orol', 'орёл на обеих монетах', 'heads on both coins'),
      right: '1/4',
      map: { a: '1', b: '1/4', both: '1/2', none: '3/4' },
    },
    {
      screen: 5,
      expr: L('kamida bitta orol', 'хотя бы один орёл', 'at least one head'),
      right: '3/4',
      map: { a: '3/4', b: '1/2', c: '1', d: '1/4' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '1/2 · 1/2 = 1/4',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Katakchalar ekraniga qayting', 'Вернись к экрану с клетками', 'Go back to the cells screen'),
  },
  probe: {
    question: L(
      "Bu dars 16-darsdan nimasi bilan farq qiladi?",
      'Чем этот урок отличается от урока 16?',
      'How does this lesson differ from lesson 16?',
    ),
    items: [
      { id: 'a', label: L("o'sha ikki so'z, lekin sonlar o'rniga ulushlar", 'те же два слова, только вместо чисел доли', 'the same two words, only shares instead of counts'), correct: true },
      { id: 'b', label: L('butunlay boshqa mavzu', 'совсем другая тема', 'a completely different topic'), hint: L("Bir xil: VA ko'paytiradi, YOKI qo'shadi. Faqat obyektlar boshqa.", 'Одна и та же: И умножает, ИЛИ складывает. Только объекты другие.', 'The same: AND multiplies, OR adds. Only the objects differ.') },
      { id: 'c', label: L('bu yerda faqat qo\'shish bor', 'здесь только сложение', 'here there is only adding'), hint: L("Ikkalasi ham bor: xuk aynan ko'paytirish haqida edi.", 'Есть оба: хук был как раз про умножение.', 'Both are here: the hook was about multiplying.') },
      { id: 'd', label: L('hech nimasi bilan', 'ничем', 'in no way'), hint: L("Bitta farq bor va u muhim: kesishma. Sonlarda u yo'q edi.", 'Одно отличие есть и оно важное: пересечение. В числах его не было.', 'There is one important difference: the overlap. It was absent with counts.') },
    ],
  },
  sheetTitle: L("Qo'shish va ko'paytirish · shpargalka", 'Сложение и умножение · шпаргалка', 'Adding and multiplying · cheat sheet'),
  sheetSrc: L('11-sinf · 21-dars', '11 класс · урок 21', 'Grade 11 · lesson 21'),
  lifehack: L(
    "Javob birdan katta chiqdimi, kesishmani qidiring: kimdir ikki marta sanalgan.",
    'Ответ больше единицы — ищи пересечение: кого-то сосчитали дважды.',
    'An answer above one? Look for the overlap: someone was counted twice.',
  ),
  holds: [2500, 7000, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Ikkala orol uchun bir chorak, va buni to'rtta natijani sanab tekshirdik.", 'Вот твои прогнозы и вот как оказалось. Для двух орлов четверть, и мы проверили это пересчётом четырёх исходов.', 'Here are your guesses and here is how it turned out. A quarter for two heads, verified by counting the four outcomes.'),
    A('rule', "Va mana asosiy fikr. Bu dars o'n oltinchining davomi: o'sha ikki so'z, VA hamda YOKI. Faqat endi sonlar o'rniga ulushlar turibdi. Va bitta yangilik qo'shildi: qo'shganda kesishmani ayirish kerak, chunki u ikki marta sanalgan.", 'И вот главная мысль. Этот урок продолжение шестнадцатого: те же два слова, И и ИЛИ. Только теперь вместо чисел доли. И добавилось одно новшество: при сложении надо вычесть пересечение, потому что оно сосчитано дважды.', 'And here is the main point. This lesson continues the sixteenth: the same two words, AND and OR. Only now with shares instead of counts. And one new thing: when adding, the overlap must be subtracted, because it was counted twice.'),
    A('q', "Oxirgi savol: bu dars o'n oltinchidan nimasi bilan farq qiladi?", 'Последний вопрос: чем этот урок отличается от шестнадцатого?', 'The last question: how does this lesson differ from the sixteenth?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
