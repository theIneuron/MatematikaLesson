// ============================================================================
// 11-sinf, Dars 17. O'RINLASHTIRISHLAR.  (Размещения)
//
// B3 blokining IKKINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/BLOK3_SKELET.md, «17-dars» bo'limi
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// DARSNING BITTA GAPI: daraxt JOYLAR tugagan yerda uziladi, buyumlar tugagan
// yerda emas. 16-darsda daraxt oxirigacha ochilgan edi, bu yerda esa ikki
// qatlamdan keyin to'xtaydi -- va n! / (n − k)! shundan chiqadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_17',
  title: L("O'rinlashtirishlar", 'Размещения', 'Arrangements'),
}

const BLOCK = { label: 'B3', from: 16, to: 24, current: 17 }

// ============================================================
// SLAYD 1. XUK. Hammasinimi yoki faqat ikkitasini.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L("O'rinlashtirishlar", 'Размещения', 'Arrangements'),
  title: L('Ikki medal, besh yuguruvchi', 'Две медали, пять бегунов', 'Two medals, five runners'),
  expr: L('5 yuguruvchi, 2 medal', '5 бегунов, 2 медали', '5 runners, 2 medals'),
  rows: [
    {
      id: 'a',
      name: L('hammasini joylashtirdi', 'расставил всех', 'arranged them all'),
      value: '5! = 120',
    },
    {
      id: 'b',
      name: L('faqat ikki joyni', 'только два места', 'only two places'),
      value: '5 · 4 = 20',
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi daraxtni ochamiz.",
      'Твой ответ записан. Сейчас откроем дерево.',
      'Your answer is saved. Now we will open the tree.',
    ),
    items: [
      { id: 'a', label: '120' },
      { id: 'b', label: '20' },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  holds: [5000, 5000, 5000, 4000],
  audio: [
    A('mount', "O'tgan darsda hamma buyum joylashtirilardi. Bugun joylar buyumlardan KAM.", 'На прошлом уроке расставляли все предметы. Сегодня мест МЕНЬШЕ, чем предметов.', 'Last lesson all the objects were arranged. Today there are FEWER places than objects.'),
    A('r1', "Birinchi yechim: besh faktorial, ya'ni bir yuz yigirma. Bu yerda beshala yuguruvchi ham joylashtirilgan.", 'Первое решение: пять факториал, то есть сто двадцать. Здесь расставлены все пятеро.', 'The first solution: five factorial, that is one hundred and twenty. Here all five are arranged.'),
    A('r2', "Ikkinchi yechim: besh karra to'rt, ya'ni yigirma. Bu yerda faqat ikkita joy to'ldirilgan.", 'Второе решение: пять на четыре, то есть двадцать. Здесь заполнены только два места.', 'The second solution: five times four, that is twenty. Here only two places are filled.'),
    A('ask', "Medal esa ikkita. Sizningcha qaysi javob to'g'ri?", 'А медалей две. Как думаешь, какой ответ верный?', 'And there are two medals. Which answer do you think is correct?'),
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
    "Uchta narsa kerak: ko'paytma qoidasi, faktorial va bitta yangi savol. Bu baholanmaydi.",
    'Нужны три вещи: правило произведения, факториал и один новый вопрос. Это не оценивается.',
    'Three things are needed: the product rule, the factorial and one new question. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L("Ketma-ket tanlov ko'paytiriladi", 'Выбор по шагам умножается', 'A step-by-step choice multiplies'),
      short: L('16-darsdan', 'из урока 16', 'from lesson 16'),
      ex: [{ e: '5 · 4 = 20', why: L('ikki qadam, ikki ko\'paytuvchi', 'два шага, два множителя', 'two steps, two factors') }],
    },
    {
      id: 'c2',
      title: L('Faktorial', 'Факториал', 'The factorial'),
      short: L('qisqa yozuv', 'короткая запись', 'shorthand'),
      ex: [{ e: '5! = 120,   3! = 6', why: L('kamayib boruvchi ko\'paytma', 'убывающее произведение', 'a decreasing product') }],
    },
    {
      id: 'c3',
      title: L('Yangi savol: nechta JOY bor', 'Новый вопрос: сколько МЕСТ', 'The new question: how many PLACES'),
      short: L('buyum emas, joy', 'не предмет, а место', 'not objects but places'),
      ex: [{ e: L('5 yuguruvchi, 2 joy', '5 бегунов, 2 места', '5 runners, 2 places'), why: L('qadamlar soni joylar soniga teng', 'число шагов равно числу мест', 'the number of steps equals the number of places') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('5 · 4 nechaga teng?', 'Чему равно 5 · 4 ?', 'What is 5 · 4 ?'),
      cols: 4,
      items: [
        { id: 'a', label: '20', correct: true },
        { id: 'b', label: '9', hint: L("Bu yig'indi.", 'Это сумма.', 'That is the sum.') },
        { id: 'c', label: '120', hint: L("Bu besh faktorial, ya'ni beshta ko'paytuvchi.", 'Это пять факториал, то есть пять множителей.', 'That is five factorial, five factors.') },
        { id: 'd', label: '54', hint: L("Raqamlarni yonma yon qo'yish ko'paytirish emas.", 'Приписать цифры рядом это не умножение.', 'Writing digits side by side is not multiplying.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('5! / 3! nechaga teng?', 'Чему равно 5! / 3! ?', 'What is 5! / 3! ?'),
      cols: 4,
      items: [
        { id: 'a', label: '20', correct: true },
        { id: 'b', label: '2', hint: L("Faktoriallar ayirilmaydi. Bir yuz yigirmani oltiga bo'ling.", 'Факториалы не вычитаются. Подели сто двадцать на шесть.', 'Factorials are not subtracted. Divide one hundred and twenty by six.') },
        { id: 'c', label: '40', hint: L("Bir yuz yigirma bo'lingan olti bu yigirma.", 'Сто двадцать делить на шесть это двадцать.', 'One hundred and twenty over six is twenty.') },
        { id: 'd', label: '120', hint: L("Uch faktorialga bo'lish unutildi.", 'Забыли поделить на три факториал.', 'The division by three factorial was forgotten.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L(
        "Qadamlar soni nimaga teng?",
        'Чему равно число шагов?',
        'What does the number of steps equal?',
      ),
      cols: 2,
      items: [
        { id: 'a', label: L('joylar soniga', 'числу мест', 'the number of places'), correct: true },
        { id: 'b', label: L('buyumlar soniga', 'числу предметов', 'the number of objects'), hint: L("Buyum ko'p bo'lishi mumkin, lekin qadam faqat joy uchun qilinadi.", 'Предметов может быть много, но шаг делается только на место.', 'There may be many objects, but a step is taken only for a place.') },
        { id: 'c', label: L('har doim ikkitaga', 'всегда двум', 'always two'), hint: L("Ikkita bu shu masalada. Uchta medal bo'lsa, uchta qadam.", 'Два это в этой задаче. Будет три медали, будет три шага.', 'Two is in this problem. With three medals there are three steps.') },
        { id: 'd', label: L("ularning ayirmasiga", 'их разности', 'their difference'), hint: L("Ayirma keyinroq, maxrajda paydo bo'ladi.", 'Разность появится позже, в знаменателе.', 'The difference appears later, in the denominator.') },
      ],
    },
  ],
  holds: [3000, 4500, 4500, 5500, 4500, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch o'tgan darsdan: ketma ket tanlov ko'paytiriladi. Bu bugun ham o'zgarmaydi.", 'Первая опора с прошлого урока: выбор по шагам умножается. Сегодня это не меняется.', 'The first basic from last lesson: a step-by-step choice multiplies. That does not change today.'),
    A('c2', "Ikkinchi tayanch: faktorial bu kamayib boruvchi ko'paytmaning qisqa yozuvi.", 'Вторая опора: факториал это короткая запись убывающего произведения.', 'The second basic: the factorial is shorthand for a decreasing product.'),
    A('c3', "Uchinchi tayanch yangi, va bugun eng muhimi. Endi savol boshqacha: nechta BUYUM emas, nechta JOY. Qadamlar soni joylar soniga teng.", 'Третья опора новая, и сегодня она главная. Теперь вопрос другой: не сколько ПРЕДМЕТОВ, а сколько МЕСТ. Число шагов равно числу мест.', 'The third basic is new, and today it is the main one. Now the question is different: not how many OBJECTS but how many PLACES. The number of steps equals the number of places.'),
    A('recap', "Qisqacha: ko'paytiramiz, va ko'paytuvchilar soni joylar soniga teng.", 'Коротко: умножаем, и множителей столько, сколько мест.', 'Briefly: we multiply, and there are as many factors as places.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. NECHTA QADAM KERAK.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'order_matters',
  eyebrow: L('Qadamlarni sanaymiz', 'Посчитаем шаги', 'Let us count the steps'),
  title: L('Nechta qadam kerak', 'Сколько нужно шагов', 'How many steps are needed'),
  expr: L('5 yuguruvchi, 2 medal', '5 бегунов, 2 медали', '5 runners, 2 medals'),
  goal: L('qadamlar sonini topish', 'найти число шагов', 'find the number of steps'),
  rule: L(
    "Har qadam bitta joyni to'ldiradi. Joy tugasa, qadam ham tugaydi.",
    'Каждый шаг заполняет одно место. Кончились места — кончились шаги.',
    'Each step fills one place. When the places run out, so do the steps.',
  ),
  pick: L('Qaysi qadamni ko\'ramiz?', 'Какой шаг посмотрим?', 'Which step shall we look at?'),
  claims: [
    { id: 'a', key: 'inA', name: L('hammasi', 'все', 'all of them'), value: '120' },
    { id: 'b', key: 'inB', name: L('ikki joy', 'два места', 'two places'), value: '20' },
  ],
  points: [
    {
      id: 'q1', label: L('1-joy', '1 место', '1st place'), num: '1', step: 'calc', verdict: 'in',
      role: L('oltin medal', 'золото', 'gold'),
      calc: L('5 nomzod', '5 кандидатов', '5 candidates'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: L('2-joy', '2 место', '2nd place'), num: '2', step: 'calc', verdict: 'in',
      role: L('kumush medal', 'серебро', 'silver'),
      calc: L('4 nomzod qoldi', 'осталось 4 кандидата', '4 candidates remain'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q3', label: L('3-joy', '3 место', '3rd place'), num: '3', step: 'calc', verdict: 'out',
      role: L('medal yo\'q', 'медали нет', 'no medal'),
      calc: L('bu joy mavjud emas', 'такого места нет', 'no such place exists'),
      sol: false, inA: true, inB: false,
    },
  ],
  probe: {
    question: L("Nechta ko'paytuvchi bo'ladi?", 'Сколько будет множителей?', 'How many factors will there be?'),
    items: [
      {
        id: 'b', label: L('ikkita', 'два', 'two'), correct: true,
        ok: L(
          "To'g'ri. Joylar ikkita, demak qadam ham ikkita: besh karra to'rt.",
          'Верно. Мест два, значит и шагов два: пять на четыре.',
          'Correct. Two places, so two steps: five times four.',
        ),
      },
      {
        id: 'a', label: L('beshta', 'пять', 'five'),
        hint: L("Beshta ko'paytuvchi beshta joy uchun bo'lardi. Medal esa ikkita.", 'Пять множителей было бы для пяти мест. А медалей две.', 'Five factors would be for five places. But there are two medals.'),
      },
      {
        id: 'both', label: L('to\'rtta', 'четыре', 'four'),
        hint: L("To'rt bu ikkinchi ko'paytuvchining qiymati, ko'paytuvchilar soni emas.", 'Четыре это значение второго множителя, а не их количество.', 'Four is the value of the second factor, not their count.'),
      },
      {
        id: 'none', label: L('uchta', 'три', 'three'),
        hint: L("Uchinchi medal yo'q, demak uchinchi qadam ham yo'q.", 'Третьей медали нет, значит нет и третьего шага.', 'There is no third medal, so there is no third step.'),
      },
    ],
  },
  holds: [2500, 6000, 1500, 2500, 9000, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi qadamlarni sanaymiz.', 'Опора восстановлена. Теперь посчитаем шаги.', 'The basics are back. Now let us count the steps.'),
    A('mount', "Har qadam bitta medalni tarqatadi. Medal tugasa, qadam ham tugaydi. Ko'paytuvchilar soni shundan chiqadi.", 'Каждый шаг раздаёт одну медаль. Кончились медали, кончились шаги. Отсюда и число множителей.', 'Each step hands out one medal. When the medals run out, so do the steps. That gives the number of factors.'),
    A('mount', "Qaysi qadamni ko'rishni tanlang.", 'Выбери, какой шаг посмотреть.', 'Choose which step to look at.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Birinchi joyga beshta nomzod bor. Ikkinchisiga to'rttasi: bittasi allaqachon medal oldi. Uchinchi joy esa umuman yo'q, chunki medal ikkita. Demak ko'paytuvchi ikkita: besh karra to'rt, yigirma.", 'На первое место пять кандидатов. На второе четыре: один уже получил медаль. А третьего места вообще нет, потому что медалей две. Значит множителя два: пять на четыре, двадцать.', 'For the first place there are five candidates. For the second, four: one already has a medal. And there is no third place at all, because there are two medals. So there are two factors: five times four, twenty.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: DARAXT IKKI QATLAMDA UZILADI.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'order_matters',
  eyebrow: L('Daraxtni oching', 'Открой дерево', 'Open the tree'),
  title: L('Daraxt joylar tugaganda uziladi', 'Дерево обрывается на местах', 'The tree stops at the places'),
  chip: L('5 yuguruvchi, 2 joy', '5 бегунов, 2 места', '5 runners, 2 places'),
  tree: {
    levels: [{ n: 5 }, { n: 4 }],
    sumLabel: L("yig'indi:", 'сумма:', 'sum:'),
    prodLabel: L("ko'paytma:", 'произведение:', 'product:'),
    leafLabel: L('barglar:', 'листьев:', 'leaves:'),
    height: 150,
  },
  graphSteps: 2,
  bonus: L(
    "Daraxt ikki qatlamdan keyin to'xtadi, chunki medal ikkita. Qolgan uchta yuguruvchi hech qayerga ketmadi, ular shunchaki medalsiz qoldi.",
    'Дерево остановилось после двух уровней, потому что медалей две. Остальные три бегуна никуда не делись, они просто остались без медали.',
    'The tree stopped after two levels because there are two medals. The other three runners did not go anywhere, they just got no medal.',
  ),
  probe: {
    question: L("Nega daraxt ikkinchi qatlamda to'xtadi?", 'Почему дерево остановилось на втором уровне?', 'Why did the tree stop at the second level?'),
    items: [
      { id: 'a', label: L('joylar tugadi', 'кончились места', 'the places ran out'), correct: true },
      { id: 'b', label: L('yuguruvchilar tugadi', 'кончились бегуны', 'the runners ran out'), hint: L("Uchtasi qoldi, lekin ularga medal yo'q.", 'Трое остались, но медали им нет.', 'Three remain, but there is no medal for them.') },
      { id: 'c', label: L('ekranga sig\'madi', 'не поместилось на экран', 'it did not fit the screen'), hint: L("Sig'im emas: uchinchi qatlam masalada yo'q.", 'Дело не в месте: третьего уровня нет в задаче.', 'Not about space: there is no third level in the problem.') },
      { id: 'd', label: L("shunday qulay", 'так удобнее', 'it is more convenient'), hint: L("Qulaylik emas: uchinchi qadam boshqa masalaning javobini berardi.", 'Не удобство: третий шаг дал бы ответ другой задачи.', 'Not convenience: a third step would answer a different problem.') },
    ],
  },
  holds: [2900, 5500, 7000],
  audio: [
    A('mount', "Qadamlar sanaldi. Endi daraxtda ko'ramiz.", 'Шаги посчитаны. Теперь посмотрим на дереве.', 'The steps are counted. Now let us look at the tree.'),
    A('one', "Birinchi qatlam: beshta shox, chunki oltin medalni beshtadan istalganiga berish mumkin.", 'Первый уровень: пять веток, потому что золото можно дать любому из пяти.', 'The first level: five branches, because the gold can go to any of the five.'),
    A('two', "Ikkinchi qatlam: har shoxdan to'rttadan. Yigirmata barg. Va daraxt shu yerda to'xtaydi: uchinchi medal yo'q. O'tgan darsda u oxirigacha ochilgan edi va bir yuz yigirma barg bergan edi.", 'Второй уровень: из каждой ветки по четыре. Двадцать листьев. И дерево здесь останавливается: третьей медали нет. На прошлом уроке оно раскрывалось до конца и давало сто двадцать листьев.', 'The second level: four from each branch. Twenty leaves. And the tree stops here: there is no third medal. Last lesson it opened to the end and gave one hundred and twenty leaves.'),
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
  title: L('Ko\'paytuvchilar soni joylar soniga teng', 'Множителей столько, сколько мест', 'As many factors as places'),
  rows: ['5 · 4 = 20', '6 · 5 · 4 = 120'],
  probe: {
    question: L(
      "6 kitob, 3 polka. Nechta usul?",
      '6 книг, 3 полки. Сколько способов?',
      '6 books, 3 shelves. How many ways?',
    ),
    items: [
      { id: 'a', label: '120', correct: true },
      { id: 'b', label: '720', hint: L("Bu olti faktorial: oltala kitob ham joylashtirilgan. Polka esa uchta.", 'Это шесть факториал: расставлены все шесть книг. А полок три.', 'That is six factorial: all six books arranged. But there are three shelves.') },
      { id: 'c', label: '18', hint: L("Bu olti karra uch. Har qadamda son bittaga kamayadi.", 'Это шесть на три. На каждом шаге число уменьшается на один.', 'That is six times three. At each step the number drops by one.') },
      { id: 'd', label: '30', hint: L("Olti karra besh bu o'ttiz, lekin uchinchi qadam ham bor.", 'Шесть на пять это тридцать, но есть ещё третий шаг.', 'Six times five is thirty, but there is a third step too.') },
    ],
  },
  rule: {
    badge: L("1-qoida. O'rinlashtirish", 'Правило 1. Размещение', 'Rule 1. Arrangement'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'n · (n − 1) · … ,   k ta',
    lines: [
      L("n bu buyumlar soni, k bu joylar soni", 'n это число предметов, k это число мест', 'n is the number of objects, k the number of places'),
      L("ko'paytuvchilar soni k ga teng, n ga emas", 'множителей ровно k, а не n', 'there are exactly k factors, not n'),
      L('har qadamda son bittaga kamayadi', 'на каждом шаге число уменьшается на один', 'at each step the number drops by one'),
      L("tartib MUHIM: oltin va kumush almashsa, boshqa natija", 'порядок ВАЖЕН: поменять золото и серебро это другой результат', 'the order MATTERS: swapping gold and silver is a different result'),
    ],
    example: L('misol:  5 · 4 = 20', 'пример:  5 · 4 = 20', 'example:  5 · 4 = 20'),
  },
  holds: [4000, 6000, 4500],
  audio: [
    A('mount', "Daraxt javobni ko'rsatdi. Endi qoidani yozamiz.", 'Дерево показало ответ. Теперь запишем правило.', 'The tree showed the answer. Now let us write the rule.'),
    A('def', "Ko'paytuvchilar soni joylar soniga teng, buyumlar soniga emas. Beshta yuguruvchi va ikkita medal bo'lsa, ikkita ko'paytuvchi: besh karra to'rt. Oltita kitob va uchta polka bo'lsa, uchta ko'paytuvchi: olti karra besh karra to'rt.", 'Множителей столько, сколько мест, а не сколько предметов. Пять бегунов и две медали дают два множителя: пять на четыре. Шесть книг и три полки дают три множителя: шесть на пять на четыре.', 'There are as many factors as places, not as objects. Five runners and two medals give two factors: five times four. Six books and three shelves give three factors: six times five times four.'),
    A('rule', "To'g'ri. Va diqqat: bu yerda tartib muhim. Oltin va kumushni almashtirsak, bu boshqa natija.", 'Верно. И внимание: здесь порядок важен. Поменяем золото и серебро местами, это другой результат.', 'Correct. And note: here the order matters. Swap gold and silver and it is a different result.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: faktorial orqali yozuv.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'order_matters',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Buni faktorial bilan yozish mumkinmi', 'Можно ли записать факториалом', 'Can it be written with factorials'),
  was: { label: UI.was, expr: '5 · 4 = 20' },
  now: { label: UI.now, expr: '5! / ?  = 20' },
  probe1: {
    question: L('Nima yetishmayapti?', 'Чего не хватает?', 'What is missing?'),
    items: [
      { id: 'a', label: L("ochilmagan qismni olib tashlash kerak", 'надо убрать нераскрытую часть', 'the unopened part must be removed'), correct: true },
      { id: 'b', label: L("yig'indini qo'shish kerak", 'надо добавить сумму', 'a sum must be added'), hint: L("Qo'shish bu yerda ishlamaydi: ortiqcha ko'paytuvchilar bo'lishdan chiqadi.", 'Сложение здесь не работает: лишние множители убираются делением.', 'Adding does not work here: extra factors are removed by dividing.') },
      { id: 'c', label: L("hech narsa, javob allaqachon bor", 'ничего, ответ уже есть', 'nothing, the answer is already there'), hint: L("Javob bor, lekin faktorial orqali yozuv qulayroq: uni eslash oson.", 'Ответ есть, но запись факториалом удобнее: её легче запомнить.', 'The answer is there, but the factorial form is handier: it is easier to remember.') },
      { id: 'd', label: L("boshqa qoida kerak", 'нужно другое правило', 'a different rule is needed'), hint: L("Qoida o'sha: ko'paytma. O'zgarishi faqat yozuvda.", 'Правило то же: произведение. Меняется только запись.', 'The rule is the same: the product. Only the notation changes.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('Nimaga bo\'linadi?', 'На что делим?', 'What do we divide by?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '3!' },
      { id: 'b', label: '2!' },
      { id: 'c', label: '5!' },
      { id: 'd', label: '4!' },
    ],
  },
  holds: [4500, 6500, 1700, 3000],
  audio: [
    A('mount', "Javob topildi: yigirma. Lekin uni faktorial orqali ham yozish mumkin, va bu yozuv qulayroq.", 'Ответ найден: двадцать. Но его можно записать и факториалом, и такая запись удобнее.', 'The answer is found: twenty. But it can also be written with factorials, and that form is handier.'),
    A('now', "Besh faktorial bu besh karra to'rt karra uch karra ikki karra bir. Bizga esa faqat birinchi ikkitasi kerak edi. Demak qolganini olib tashlash kerak, va u ham faktorial: uch karra ikki karra bir.", 'Пять факториал это пять на четыре на три на два на один. А нам нужны были только первые два. Значит остальное надо убрать, и оно тоже факториал: три на два на один.', 'Five factorial is five times four times three times two times one. But we needed only the first two. So the rest must be removed, and it is a factorial too: three times two times one.'),
    A('q1', 'Nima yetishmayapti?', 'Чего не хватает?', 'What is missing?'),
    A('q2', 'Sizningcha nimaga bo\'linadi? Shunchaki taxmin qiling.', 'Как думаешь, на что делим? Просто предположи.', 'What do you think we divide by? Just make a guess.'),
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
  expr: '5! / ?  = 20',
  need: '= 20',
  answerLabel: L('maxraj', 'знаменатель', 'the denominator'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: '5! / 2!',
      point: {
        label: L('sanaymiz', 'считаем', 'we count'),
        calc: '120 / 2 = 60   ✗',
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: '5! / 3!',
      point: {
        label: L('sanaymiz', 'считаем', 'we count'),
        calc: '120 / 6 = 20   ✓',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['3!', '2!', '4!', '5!'],
    value: ['3!'],
    label: L('maxraj', 'знаменатель', 'denominator'),
    prompt: L('Maxrajni yozing', 'Запиши знаменатель', 'Write the denominator'),
    wrongs: [
      { key: '2!', hint: L("Ikkilik bu JOYLAR soni. Bo'linadigan esa ochilmagan qism: besh minus ikki, uchta.", 'Двойка это число МЕСТ. А делим на нераскрытую часть: пять минус два, три.', 'Two is the number of PLACES. But we divide by the unopened part: five minus two, three.') },
      { key: '5!', hint: L("Unda bir chiqadi. Bo'linadigan qism butun daraxt emas.", 'Тогда выйдет один. Делим не на всё дерево.', 'Then you get one. We do not divide by the whole tree.') },
      { key: '*', hint: L("Beshta buyum, ikkitasi joylashtirilgan: uchtasi qoldi, va ularning faktorialiga bo'linadi.", 'Пять предметов, два расставлены: осталось три, на их факториал и делим.', 'Five objects, two placed: three remain, and we divide by their factorial.') },
    ],
  },
  holds: [3500, 6000, 5500, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala nomzodni ham sanaymiz.', 'Прогноз есть. Теперь посчитаем обоих кандидатов.', 'The guess is made. Now let us compute both candidates.'),
    A('p1', "Birinchi nomzod: besh faktorial bo'lingan ikki faktorial. Bir yuz yigirma bo'lingan ikki, oltmish. Bizga esa yigirma kerak edi.", 'Первый кандидат: пять факториал делить на два факториал. Сто двадцать делить на два, шестьдесят. А нужно было двадцать.', 'The first candidate: five factorial over two factorial. One hundred and twenty over two, sixty. But twenty was needed.'),
    A('p2', "Ikkinchi nomzod: uch faktorialga bo'lindi. Bir yuz yigirma bo'lingan olti, roppa rosa yigirma. Uchlik qayerdan? Bu ochilmagan qatlamlar soni: besh minus ikki.", 'Второй кандидат: поделили на три факториал. Сто двадцать делить на шесть, ровно двадцать. Откуда тройка? Это число нераскрытых уровней: пять минус два.', 'The second candidate: divided by three factorial. One hundred and twenty over six, exactly twenty. Where does the three come from? It is the number of unopened levels: five minus two.'),
    A('write', "Maxrajni yozing.", 'Запиши знаменатель.', 'Write the denominator.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: FORMULA va JAMLANMA.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'order_matters',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Formula', 'Формула', 'The formula'),
  cases: [
    {
      label: L('butun daraxt', 'всё дерево', 'the whole tree'),
      text: 'n!',
      tone: 'graph',
    },
    {
      label: L('ochilmagan qism', 'нераскрытая часть', 'the unopened part'),
      text: '(n − k)!',
      tone: 'accent',
    },
  ],
  rows: ['A = n! / (n − k)!', '5! / 3! = 20'],
  probe: {
    question: L(
      "Nega maxrajda aynan n minus k turadi?",
      'Почему в знаменателе именно n минус k?',
      'Why is it n minus k in the denominator?',
    ),
    items: [
      { id: 'a', label: L("shuncha qatlam ochilmay qoldi", 'столько уровней осталось нераскрытыми', 'that many levels stayed unopened'), correct: true },
      { id: 'b', label: L("shunday kelishilgan", 'так договорились', 'that is the convention'), hint: L("Kelishuv emas: sanoq bilan tekshirildi.", 'Не договорённость: проверено счётом.', 'Not a convention: verified by counting.') },
      { id: 'c', label: L("chunki k joylar soni", 'потому что k это число мест', 'because k is the number of places'), hint: L("k joylar soni, lekin maxrajda QOLGANLAR turadi.", 'k это число мест, но в знаменателе стоят ОСТАВШИЕСЯ.', 'k is the number of places, but the denominator holds those LEFT OVER.') },
      { id: 'd', label: L("javob kichikroq bo'lsin uchun", 'чтобы ответ был меньше', 'to make the answer smaller'), hint: L("Kattaligi maqsad emas: bo'linadigan qism aniq nom bilan atalgan.", 'Величина не цель: делимая часть имеет точное имя.', 'The size is not the goal: the divided part has an exact name.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Formula', 'Правило 2. Формула', 'Rule 2. The formula'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'A = n! / (n − k)!',
    lines: [
      L("n! bu butun daraxt, oxirigacha ochilgan", 'n! это всё дерево, раскрытое до конца', 'n! is the whole tree, opened to the end'),
      L("(n − k)! bu ochilmay qolgan qism", '(n − k)! это часть, которая осталась нераскрытой', '(n − k)! is the part that stayed unopened'),
      L("bo'lish ortiqcha qatlamlarni olib tashlaydi", 'деление убирает лишние уровни', 'the division removes the extra levels'),
      L('tartib muhim: bu joylashtirish, guruhlash emas', 'порядок важен: это размещение, а не группировка', 'the order matters: this is an arrangement, not a grouping'),
    ],
    example: L('misol:  A(5,2) = 5!/3! = 20', 'пример:  A(5,2) = 5!/3! = 20', 'example:  A(5,2) = 5!/3! = 20'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'A = n! / (n − k)!',
    lines: [
      L('1. nechta JOY borligini top: qadamlar soni shu', '1. найди, сколько МЕСТ: столько и шагов', '1. find how many PLACES there are: that is the number of steps'),
      L("2. shuncha ko'paytuvchi yoz, har birida son bittaga kam", '2. выпиши столько множителей, каждый на один меньше', '2. write that many factors, each one less'),
      L('3. qisqa yozuv: n! bo\'lingan (n − k)!', '3. короткая запись: n! делить на (n − k)!', '3. shorthand: n! over (n − k)!'),
      L("4. tartib muhimmi deb so'ra: muhim bo'lmasa, bu boshqa dars", '4. спроси, важен ли порядок: если нет, это другой урок', '4. ask whether the order matters: if not, that is another lesson'),
    ],
  },
  holds: [4000, 6500, 4500, 5000],
  audio: [
    A('mount', "Maxraj topildi. Endi formulani yozamiz.", 'Знаменатель найден. Теперь запишем формулу.', 'The denominator is found. Now let us write the formula.'),
    A('rows', "En faktorial bu butun daraxt, oxirigacha ochilgan. En minus ka faktorial esa ochilmay qolgan qism. Bo'lish ortiqcha qatlamlarni olib tashlaydi, va qo'lda faqat kerakli ka qadam qoladi.", 'Эн факториал это всё дерево, раскрытое до конца. А эн минус ка факториал это часть, которая осталась нераскрытой. Деление убирает лишние уровни, и в руках остаётся ровно ка нужных шагов.', 'n factorial is the whole tree, opened to the end. And n minus k factorial is the part that stayed unopened. The division removes the extra levels, leaving exactly the k steps needed.'),
    A('q', "Savol: nega maxrajda aynan en minus ka?", 'Вопрос: почему в знаменателе именно эн минус ка?', 'The question: why exactly n minus k in the denominator?'),
    A('rule', "To'g'ri. Va oxirgi narsa: bu yerda tartib muhim. Keyingi darsda tartib muhim bo'lmagan holat keladi, va javob boshqacha bo'ladi.", 'Верно. И последнее: здесь порядок важен. На следующем уроке придёт случай, где он не важен, и ответ будет другим.', 'Correct. And one last thing: here the order matters. Next lesson brings the case where it does not, and the answer will differ.'),
    A('both', 'Endi butun usulni bitta qoidaga yig\'ing.', 'А теперь собери весь способ в одно правило.', 'Now combine the whole method into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. KO'PAYTUVCHINI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'order_matters',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Oxirgi ko\'paytuvchi', 'Последний множитель', 'The last factor'),
  left: L('6 kitob, 3 polka', '6 книг, 3 полки', '6 books, 3 shelves'),
  template: ['6 · 5 · ', { slot: 0 }],
  signs: ['4', '3', '6'],
  answer: '4',
  checkNote: L(
    'Ikkita kitob allaqachon qo\'yilgan: to\'rttasi qoldi',
    'Две книги уже поставлены: осталось четыре',
    'Two books are already placed: four remain',
  ),
  wrongs: [
    { key: '3', hint: L("Uchlik bu POLKALAR soni, qolgan kitoblar soni emas.", 'Тройка это число ПОЛОК, а не оставшихся книг.', 'Three is the number of SHELVES, not of remaining books.') },
    { key: '6', hint: L("Oltita kitobdan ikkitasi qo'yilgan: to'rttasi qoldi.", 'Из шести книг две поставлены: осталось четыре.', 'Of the six books two are placed: four remain.') },
  ],
  probe: {
    question: L("Nechta ko'paytuvchi bo'lishini nima aniqlaydi?", 'Что задаёт число множителей?', 'What sets the number of factors?'),
    items: [
      { id: 'a', label: L('joylar soni', 'число мест', 'the number of places'), correct: true },
      { id: 'b', label: L('buyumlar soni', 'число предметов', 'the number of objects'), hint: L("Buyum oltita, ko'paytuvchi esa uchta: polka uchta.", 'Предметов шесть, а множителя три: полок три.', 'There are six objects but three factors: three shelves.') },
      { id: 'c', label: L("ularning ayirmasi", 'их разность', 'their difference'), hint: L("Ayirma maxrajda turadi, ko'paytuvchilar sonida emas.", 'Разность стоит в знаменателе, а не в числе множителей.', 'The difference is in the denominator, not in the count of factors.') },
      { id: 'd', label: L("eng kichik son", 'наименьшее из чисел', 'the smaller number'), hint: L("Bu tasodifan mos keldi. Aniqlaydigan narsa joylar soni.", 'Это случайно совпало. Определяет число мест.', 'That coincided by chance. What decides is the number of places.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Oxirgi ko'paytuvchini qo'ying.", 'Поставь последний множитель.', 'Place the last factor.'),
    A('checked', "Bo'ldi. Endi ta'riflang: nechta ko'paytuvchi bo'lishini nima aniqlaydi?", 'Получилось. Теперь сформулируй: что задаёт число множителей?', 'Done. Now put it into words: what sets the number of factors?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'places', label: L('joylarni sanash', 'сосчитать места', 'count the places') },
  { id: 'mult', label: L("ko'paytirish", 'перемножить', 'multiply') },
  { id: 'fact', label: L('faktorial bilan yozish', 'записать факториалом', 'write with factorials') },
  { id: 'div', label: L("k! ga bo'lish", 'поделить на k!', 'divide by k!') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'order_matters',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('6 kitob, 3 polka', '6 книг, 3 полки', '6 books, 3 shelves'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'places',
      to: L('3 joy  →  3 qadam', '3 места  →  3 шага', '3 places  →  3 steps'),
      wrongs: [
        { action: 'mult', hint: L("Avval nechta joy borligini aniqlang.", 'Сначала выясни, сколько мест.', 'First find out how many places there are.') },
        { action: 'fact', hint: L("Faktorial keyinroq, qisqa yozuv uchun.", 'Факториал позже, для короткой записи.', 'The factorial comes later, for the shorthand.') },
        { action: 'div', hint: L("Bu yerda ka faktorialga bo'linmaydi: tartib muhim.", 'Здесь на ка факториал не делят: порядок важен.', 'Here we do not divide by k factorial: the order matters.') },
      ],
    },
    {
      action: 'mult',
      to: '6 · 5 · 4 = 120',
      wrongs: [
        { action: 'places', hint: L("Joylar sanalgan: uchta.", 'Места посчитаны: три.', 'The places are counted: three.') },
        { action: 'fact', hint: L("Avval sonni oling, keyin qisqa yozuvni.", 'Сначала получи число, потом короткую запись.', 'Get the number first, the shorthand after.') },
        { action: 'div', hint: L("Bo'linmaydi: tartib muhim.", 'Не делим: порядок важен.', 'No dividing: the order matters.') },
      ],
    },
    {
      action: 'fact',
      to: '6! / 3! = 120',
      wrongs: [
        { action: 'places', hint: L("Sanalgan.", 'Посчитаны.', 'Counted.') },
        { action: 'mult', hint: L("Ko'paytirildi: bir yuz yigirma.", 'Перемножено: сто двадцать.', 'Multiplied: one hundred and twenty.') },
        { action: 'div', hint: L("Ka faktorialga bo'lish keyingi darsda.", 'Деление на ка факториал будет на следующем уроке.', 'Dividing by k factorial comes next lesson.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['120', '720', '18', '20'],
    value: ['120'],
    label: L('usullar', 'способов', 'ways'),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '720', hint: L("Bu olti faktorial: oltala kitob joylashtirilgan. Polka esa uchta.", 'Это шесть факториал: расставлены все шесть книг. А полок три.', 'That is six factorial: all six books arranged. But there are three shelves.') },
      { key: '18', hint: L("Bu olti karra uch. Har qadamda son bittaga kamayadi: olti, besh, to'rt.", 'Это шесть на три. На каждом шаге число уменьшается: шесть, пять, четыре.', 'That is six times three. At each step the number drops: six, five, four.') },
      { key: '*', hint: L("Uchta ko'paytuvchi: olti, besh, to'rt.", 'Три множителя: шесть, пять, четыре.', 'Three factors: six, five, four.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi kitoblarni joylashtiramiz.', 'Правило сформулировано. Расставим книги.', 'The rule is stated. Let us arrange the books.'),
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
  tag: 'order_matters',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Ikki harfli kod', 'Двухбуквенный код', 'A two-letter code'),
  start: L('4 harf, 2 joy, takror yo\'q', '4 буквы, 2 места, без повторов', '4 letters, 2 places, no repeats'),
  actions: ACTIONS_10,
  hint: L(
    "Joylar ikkita, demak ko'paytuvchi ham ikkita.",
    'Мест два, значит и множителя два.',
    'Two places, so two factors.',
  ),
  steps: [
    {
      action: 'places',
      to: L('2 joy  →  2 qadam', '2 места  →  2 шага', '2 places  →  2 steps'),
      wrongs: [
        { action: 'mult', hint: L("Avval joylarni sanang.", 'Сначала сосчитай места.', 'Count the places first.') },
        { action: 'fact', hint: L("Avval sonni oling.", 'Сначала получи число.', 'Get the number first.') },
        { action: 'div', hint: L("Tartib muhim: kod AB va BA har xil.", 'Порядок важен: код AB и BA разные.', 'The order matters: the codes AB and BA differ.') },
      ],
    },
    {
      action: 'mult',
      to: '4 · 3 = 12',
      wrongs: [
        { action: 'places', hint: L("Sanalgan: ikkita.", 'Посчитаны: два.', 'Counted: two.') },
        { action: 'fact', hint: L("Sonni oling, keyin yozuvni.", 'Получи число, потом запись.', 'Get the number, then the notation.') },
        { action: 'div', hint: L("Bo'linmaydi.", 'Не делим.', 'No dividing.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['12', '24', '16', '6'],
    value: ['12'],
    label: L('kodlar', 'кодов', 'codes'),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '24', hint: L("Bu to'rt faktorial: hamma harf joylashtirilgan. Joy esa ikkita.", 'Это четыре факториал: расставлены все буквы. А мест два.', 'That is four factorial: all the letters arranged. But there are two places.') },
      { key: '16', hint: L("Bu to'rt karra to'rt: takrorga ruxsat berilgan. Shartda takror yo'q.", 'Это четыре на четыре: с повторами. В условии повторов нет.', 'That is four times four: with repeats. The problem allows none.') },
      { key: '6', hint: L("Bu tartib muhim bo'lmagandagi javob. Kod AB va BA esa har xil.", 'Это ответ, если бы порядок был не важен. А коды AB и BA разные.', 'That is the answer if the order did not matter. But the codes AB and BA differ.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "To'rtta harf va ikkita joy. Diqqat: kod AB va kod BA har xil kodlar.", 'Четыре буквы и два места. Внимание: код AB и код BA это разные коды.', 'Four letters and two places. Careful: the code AB and the code BA are different codes.'),
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
      done: L('5 dan 2 ta  →  20', 'из 5 по 2  →  20', 'from 5 take 2  →  20'),
      prompt: L('5 dan 2 tani joylashtirish?', 'Разместить 2 из 5 ?', 'Arrange 2 out of 5 ?'),
      items: [
        { id: 'a', label: '20', correct: true },
        { id: 'b', label: '120', hint: L("Bu beshalasini joylashtirish.", 'Это расставить все пять.', 'That is arranging all five.') },
        { id: 'c', label: '10', hint: L("Bu tartib muhim bo'lmagandagi javob.", 'Это ответ, если порядок не важен.', 'That is the answer if the order does not matter.') },
        { id: 'd', label: '25', hint: L("Bu takror bilan. Bir odam ikki medal olmaydi.", 'Это с повторами. Один человек не берёт две медали.', 'That is with repeats. One person does not take two medals.') },
      ],
    },
    {
      id: 'b2', tag: 'order_matters', ask: true, cols: 4,
      done: L('6 dan 3 ta  →  120', 'из 6 по 3  →  120', 'from 6 take 3  →  120'),
      prompt: L('6 dan 3 tani joylashtirish?', 'Разместить 3 из 6 ?', 'Arrange 3 out of 6 ?'),
      items: [
        { id: 'a', label: '120', correct: true },
        { id: 'b', label: '720', hint: L("Bu oltalasini joylashtirish.", 'Это расставить все шесть.', 'That is arranging all six.') },
        { id: 'c', label: '18', hint: L("Har qadamda son kamayadi: olti, besh, to'rt.", 'На каждом шаге число убывает: шесть, пять, четыре.', 'At each step the number drops: six, five, four.') },
        { id: 'd', label: '20', hint: L("Bu guruhlash, tartibsiz.", 'Это группировка, без порядка.', 'That is a grouping, without order.') },
      ],
    },
    {
      id: 'b3', tag: 'order_matters', ask: true, cols: 4,
      done: L('4 dan 2 ta  →  12', 'из 4 по 2  →  12', 'from 4 take 2  →  12'),
      prompt: L('4 dan 2 tani joylashtirish?', 'Разместить 2 из 4 ?', 'Arrange 2 out of 4 ?'),
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '24', hint: L("Bu to'rt faktorial.", 'Это четыре факториал.', 'That is four factorial.') },
        { id: 'c', label: '6', hint: L("Bu tartibsiz holat.", 'Это случай без порядка.', 'That is the case without order.') },
        { id: 'd', label: '8', hint: L("To'rt karra uch bu o'n ikki.", 'Четыре на три это двенадцать.', 'Four times three is twelve.') },
      ],
    },
    {
      id: 'b4', tag: 'order_matters', ask: true, cols: 2,
      done: L('joylar soniga', 'числу мест', 'the number of places'),
      prompt: L("Daraxtda nechta qatlam ochiladi?", 'Сколько уровней раскрывается в дереве?', 'How many levels of the tree are opened?'),
      items: [
        { id: 'a', label: L('joylar soniga teng', 'столько, сколько мест', 'as many as there are places'), correct: true },
        { id: 'b', label: L('buyumlar soniga teng', 'сколько предметов', 'as many as there are objects'), hint: L("Unda javob har doim faktorial bo'lardi.", 'Тогда ответ всегда был бы факториалом.', 'Then the answer would always be a factorial.') },
        { id: 'c', label: L('har doim ikkita', 'всегда два', 'always two'), hint: L("Uchta polka bo'lsa, uchta qatlam.", 'Будет три полки, будет три уровня.', 'With three shelves there are three levels.') },
        { id: 'd', label: L('ularning ayirmasi', 'их разность', 'their difference'), hint: L("Ayirma maxrajda.", 'Разность в знаменателе.', 'The difference is in the denominator.') },
      ],
    },
    {
      id: 'b5', tag: 'order_matters', ask: true, cols: 4,
      done: 'A(n,1) = n',
      prompt: L('n dan 1 tani joylashtirish?', 'Разместить 1 из n ?', 'Arrange 1 out of n ?'),
      items: [
        { id: 'a', label: 'n', correct: true },
        { id: 'b', label: 'n!', hint: L("Bitta joy uchun bitta ko'paytuvchi.", 'На одно место один множитель.', 'One place, one factor.') },
        { id: 'c', label: '1', hint: L("Nomzod en ta, va har biri bu joyni egallashi mumkin.", 'Кандидатов эн, и каждый может занять это место.', 'There are n candidates, and any of them can take the place.') },
        { id: 'd', label: 'n − 1', hint: L("Birinchi qadamda hali hech kim tanlanmagan.", 'На первом шаге ещё никто не выбран.', 'At the first step nobody is chosen yet.') },
      ],
    },
    {
      id: 'b6', tag: 'order_matters', ask: true, cols: 2,
      done: L('ha, muhim', 'да, важен', 'yes, it matters'),
      prompt: L(
        "Oltin va kumush medal. Tartib muhimmi?",
        'Золото и серебро. Важен ли порядок?',
        'Gold and silver. Does the order matter?',
      ),
      items: [
        { id: 'a', label: L('ha, muhim', 'да, важен', 'yes, it matters'), correct: true },
        { id: 'b', label: L("yo'q, muhim emas", 'нет, не важен', 'no, it does not'), hint: L("Oltin va kumushni almashtiring: bu boshqa natija.", 'Поменяй золото и серебро: это другой результат.', 'Swap the gold and silver: that is a different result.') },
        { id: 'c', label: L('medalga qarab', 'смотря по медали', 'depends on the medal'), hint: L("Medallar har xil, demak tartib har doim muhim.", 'Медали разные, значит порядок важен всегда.', 'The medals differ, so the order always matters.') },
        { id: 'd', label: L("aniqlab bo'lmaydi", 'определить нельзя', 'it cannot be determined'), hint: L("Mumkin: medallarning nomi har xil.", 'Можно: медали называются по-разному.', 'It can: the medals have different names.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Uchta joy.", 'Три места.', 'Three places.'),
    A('q3', "Kichikroq sonlar.", 'Числа поменьше.', 'Smaller numbers.'),
    A('q4', "Daraxt haqida.", 'Про дерево.', 'About the tree.'),
    A('q5', "Chegaraviy holat.", 'Крайний случай.', 'An edge case.'),
    A('q6', 'Oxirgi savol, va u keyingi darsga ko\'prik.', 'Последний вопрос, и он мост к следующему уроку.', 'The last question, and it bridges to the next lesson.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: daraxt oxirigacha ochilgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'order_matters',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Ortiqcha qadamlar", 'Лишние шаги', 'Extra steps'),
  rows: [
    { id: 'r1', text: L('5 yuguruvchi, 2 medal', '5 бегунов, 2 медали', '5 runners, 2 medals') },
    { id: 'r2', text: '5 · 4 · 3 · 2 · 1' },
    { id: 'r3', text: '= 120' },
    { id: 'r4', text: L('javob: 120 usul', 'ответ: 120 способов', 'answer: 120 ways') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r3: L("Arifmetika to'g'ri: ko'paytma haqiqatan bir yuz yigirma. Xato oldingi satrda.", 'Арифметика верна: произведение действительно сто двадцать. Ошибка строкой выше.', 'The arithmetic is right: the product really is one hundred and twenty. The error is a line above.'),
    r4: L("Javob xato, lekin u oldin xato bo'lgan.", 'Ответ неверный, но неверным он стал раньше.', 'The answer is wrong, but it became wrong earlier.'),
  },
  proofPoint: L('medal 2 ta, ko\'paytuvchi 5 ta', 'медалей 2, множителей 5', '2 medals, 5 factors'),
  proof: L(
    "Ko'paytuvchilar soni joylar soniga teng bo'lishi kerak. Medal ikkita, ko'paytuvchi esa beshta yozilgan: uchtasi ortiqcha. Ular uchinchi, to'rtinchi va beshinchi o'rinlarni tarqatadi, lekin bunday medallar yo'q.",
    'Множителей должно быть столько, сколько мест. Медалей две, а множителей выписано пять: три лишних. Они раздают третье, четвёртое и пятое места, а таких медалей нет.',
    'There must be as many factors as places. There are two medals but five factors written: three too many. They hand out third, fourth and fifth places, and no such medals exist.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("ortiqcha ko'paytuvchilar yozilgan", 'выписаны лишние множители', 'extra factors were written'), correct: true },
      { id: 'b', label: L("qo'shish kerak edi", 'надо было сложить', 'they should have been added'), hint: L("Yo'q: qadamlar ketma ket, ko'paytiriladi. Faqat qadam ko'p yozilgan.", 'Нет: шаги идут подряд, умножаются. Просто шагов выписано много.', 'No: the steps follow one another and multiply. Just too many were written.') },
      { id: 'c', label: L("arifmetikada xato", 'ошибка в арифметике', 'an arithmetic error'), hint: L("Arifmetika to'g'ri, va aynan shu chalg'itadi.", 'Арифметика верна, и это как раз и сбивает.', 'The arithmetic is right, and that is exactly what misleads.') },
      { id: 'd', label: L("tartib hisobga olinmagan", 'не учтён порядок', 'the order was ignored'), hint: L("Tartib hisobga olingan. Muammo qadamlar sonida.", 'Порядок учтён. Проблема в числе шагов.', 'The order is accounted for. The problem is the number of steps.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda arifmetika to'g'ri va amal ham to'g'ri tanlangan. Shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь арифметика верна и действие выбрано верно. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Here the arithmetic is right and the operation is right. And still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Qarang: medal ikkita, ko'paytuvchi esa beshta. Uchtasi ortiqcha, va ular mavjud bo'lmagan uchinchi, to'rtinchi, beshinchi medallarni tarqatadi.", 'Смотри: медалей две, а множителей пять. Три лишних, и они раздают несуществующие третью, четвёртую и пятую медали.', 'Look: two medals, five factors. Three too many, and they hand out third, fourth and fifth medals that do not exist.'),
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
  title: L('Formulani yig\'ing', 'Собери формулу', 'Build the formula'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L("maxrajda qolganlar", 'в знаменателе оставшиеся', 'the remainder in the denominator'),
  tasks: [
    {
      prompt: L('5 dan 2 ta', 'из 5 по 2', 'from 5 take 2'),
      template: ['A = ', { slot: 0 }, ' / ', { slot: 1 }],
      parts: ['5!', '3!', '2!', '4!'],
      answer: ['5!', '3!'],
      doneLabel: '5!/3! = 20',
      wrongs: [
        { key: '5!|2!', hint: L("Maxrajda QOLGANLAR: besh minus ikki, uchta.", 'В знаменателе ОСТАВШИЕСЯ: пять минус два, три.', 'The denominator holds those LEFT: five minus two, three.') },
        { key: '*', hint: L("Suratda butun daraxt, maxrajda ochilmagan qism.", 'В числителе всё дерево, в знаменателе нераскрытая часть.', 'The numerator is the whole tree, the denominator the unopened part.') },
      ],
    },
    {
      prompt: L('6 dan 3 ta', 'из 6 по 3', 'from 6 take 3'),
      template: ['A = ', { slot: 0 }, ' / ', { slot: 1 }],
      parts: ['6!', '3!', '2!', '4!'],
      answer: ['6!', '3!'],
      doneLabel: '6!/3! = 120',
      wrongs: [
        { key: '6!|2!', hint: L("Olti minus uch bu uch.", 'Шесть минус три это три.', 'Six minus three is three.') },
        { key: '*', hint: L("Bu safar qolganlar ham uchta, lekin sabab boshqa.", 'На этот раз оставшихся тоже три, но причина другая.', 'This time the remainder is three as well, but for a different reason.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi. Diqqat: maxraj o'sha bo'lib qoldi, lekin sabab boshqa.", 'А теперь второе. Внимание: знаменатель остался тем же, но причина другая.', 'And now the second one. Careful: the denominator stayed the same, but for a different reason.'),
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
  law: 'A = n! / (n − k)!',
  ruleLines: [
    L("ko'paytuvchilar soni JOYLAR soniga teng", 'множителей столько, сколько МЕСТ', 'as many factors as PLACES'),
    L("daraxt joylar tugaganda uziladi", 'дерево обрывается, когда кончились места', 'the tree stops when the places run out'),
    L('tartib muhim: bu joylashtirish', 'порядок важен: это размещение', 'the order matters: this is an arrangement'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('5 yuguruvchi, 2 medal', '5 бегунов, 2 медали', '5 runners, 2 medals'),
      right: '20',
      map: { a: '120', b: '20', both: '—', none: '—' },
    },
    {
      screen: 5,
      expr: '5! / ?',
      right: '3!',
      map: { a: '3!', b: '2!', c: '5!', d: '4!' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '5 · 4 = 5!/3! = 20',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Daraxt ekraniga qayting', 'Вернись к экрану с деревом', 'Go back to the tree screen'),
  },
  probe: {
    question: L(
      "Keyingi darsda nima o'zgaradi?",
      'Что изменится на следующем уроке?',
      'What changes next lesson?',
    ),
    items: [
      { id: 'a', label: L('tartib muhim bo\'lmay qoladi', 'порядок перестанет быть важным', 'the order will stop mattering'), correct: true },
      { id: 'b', label: L('buyumlar ko\'payadi', 'предметов станет больше', 'there will be more objects'), hint: L("Sonlar emas, savol o'zgaradi.", 'Меняются не числа, а вопрос.', 'It is not the numbers that change but the question.') },
      { id: 'c', label: L('formula boshqa bo\'ladi', 'формула станет другой', 'the formula will change'), hint: L("Formula o'sha qoladi, lekin unga yana bitta bo'lish qo'shiladi.", 'Формула останется, но к ней добавится ещё одно деление.', 'The formula stays, but one more division joins it.') },
      { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L("O'zgaradi: bugungi blitsning oxirgi savoli aynan shu haqda edi.", 'Изменится: последний вопрос блица был как раз об этом.', 'It will: the last blitz question was exactly about that.') },
    ],
  },
  sheetTitle: L("O'rinlashtirishlar · shpargalka", 'Размещения · шпаргалка', 'Arrangements · cheat sheet'),
  sheetSrc: L('11-sinf · 17-dars', '11 класс · урок 17', 'Grade 11 · lesson 17'),
  lifehack: L(
    "Masalani o'qib, birinchi navbatda JOYLARNI sanang: ko'paytuvchilar soni shundan chiqadi.",
    'Прочитал задачу — сначала сосчитай МЕСТА: из этого и выйдет число множителей.',
    'Read the problem and count the PLACES first: that gives the number of factors.',
  ),
  holds: [2500, 7000, 7000, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Birinchi javob beshalasini joylashtirgan edi, medal esa ikkita.", 'Вот твои прогнозы и вот как оказалось. Первый ответ расставлял всех пятерых, а медалей две.', 'Here are your guesses and here is how it turned out. The first answer arranged all five, but there are two medals.'),
    A('rule', "Va mana asosiy fikr. Daraxt buyumlar tugaganda emas, JOYLAR tugaganda uziladi. Shuning uchun ko'paytuvchilar soni joylar soniga teng, va formulaning maxrajida ochilmay qolgan qism turadi.", 'И вот главная мысль. Дерево обрывается не когда кончились предметы, а когда кончились МЕСТА. Поэтому множителей столько, сколько мест, а в знаменателе формулы стоит нераскрытая часть.', 'And here is the main point. The tree stops not when the objects run out but when the PLACES do. That is why there are as many factors as places, and the denominator of the formula holds the unopened part.'),
    A('q', "Oxirgi savol: keyingi darsda nima o'zgaradi?", 'Последний вопрос: что изменится на следующем уроке?', 'The last question: what changes next lesson?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
