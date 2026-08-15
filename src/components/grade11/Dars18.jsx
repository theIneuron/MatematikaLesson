// ============================================================================
// 11-sinf, Dars 18. GURUHLASHLAR.  (Сочетания)
//
// B3 blokining UCHINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/BLOK3_SKELET.md, «18-dars» bo'limi
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// DARSNING BITTA GAPI: tartib muhim bo'lmasa, har to'plam k! marta sanalgan.
// 17-darsdan farqi shartdagi BITTA so'zda: «joylarga» o'rniga «jamoaga».
// Javob esa ikki barobar kamayadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_18',
  title: L('Guruhlashlar', 'Сочетания', 'Combinations'),
}

const BLOCK = { label: 'B3', from: 16, to: 24, current: 18 }

// ============================================================
// SLAYD 1. XUK. Bitta so'z o'zgardi.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Guruhlashlar', 'Сочетания', 'Combinations'),
  title: L('Bitta so\'z o\'zgardi', 'Изменилось одно слово', 'One word changed'),
  expr: L('5 odamdan 2 tasi jamoaga', 'Из 5 человек 2 в команду', '2 of 5 people into a team'),
  rows: [
    {
      id: 'a',
      name: L('17-darsdagidek', 'как в уроке 17', 'as in lesson 17'),
      value: '5 · 4 = 20',
    },
    {
      id: 'b',
      name: L('ikki barobar kam', 'вдвое меньше', 'twice fewer'),
      value: '20 / 2 = 10',
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi juftlarni qo'lda sanab ko'ramiz.",
      'Твой ответ записан. Сейчас пересчитаем пары руками.',
      'Your answer is saved. Now we will count the pairs by hand.',
    ),
    items: [
      { id: 'a', label: '20' },
      { id: 'b', label: '10' },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  holds: [5500, 5000, 4500, 4000],
  audio: [
    A('mount', "O'tgan darsda beshta yuguruvchiga ikkita medal tarqatgan edik va yigirma javob olgandik. Bugun shart deyarli o'sha, faqat bitta so'z boshqacha.", 'На прошлом уроке мы раздавали пять бегунов на две медали и получили двадцать. Сегодня условие почти то же, изменилось одно слово.', 'Last lesson we gave five runners two medals and got twenty. Today the problem is almost the same, one word has changed.'),
    A('r1', "Birinchi yechim: hamma narsa o'zgarmagan, besh karra to'rt, yigirma.", 'Первое решение: ничего не изменилось, пять на четыре, двадцать.', 'The first solution: nothing has changed, five times four, twenty.'),
    A('r2', "Ikkinchi yechim: javob ikki barobar kam, o'nta. Chunki jamoada rol yo'q: medal oltin va kumush bo'ladi, jamoa esa shunchaki jamoa.", 'Второе решение: ответ вдвое меньше, десять. Потому что в команде нет ролей: медали бывают золотая и серебряная, а команда просто команда.', 'The second solution: half as many, ten. Because a team has no roles: medals are gold and silver, a team is just a team.'),
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
    "Uchta narsa kerak, va ikkitasi o'tgan darsdan. Bu baholanmaydi.",
    'Нужны три вещи, две из них с прошлого урока. Это не оценивается.',
    'Three things are needed, two of them from last lesson. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Joylashtirish', 'Размещение', 'Arrangement'),
      short: L('17-darsdan', 'из урока 17', 'from lesson 17'),
      ex: [{ e: '5 · 4 = 20', why: L('tartib muhim bo\'lganda', 'когда порядок важен', 'when the order matters') }],
    },
    {
      id: 'c2',
      title: L('AB va BA bir xil jamoa', 'AB и BA это одна команда', 'AB and BA are one team'),
      short: L('tartib muhim emas', 'порядок не важен', 'the order does not matter'),
      ex: [{ e: 'AB = BA', why: L('jamoada rol yo\'q', 'в команде нет ролей', 'a team has no roles') }],
    },
    {
      id: 'c3',
      title: L('Ikkitani nechta tartibda yozish mumkin', 'Сколькими способами записать двоих', 'How many ways to write two'),
      short: L('bu 2!', 'это 2!', 'that is 2!'),
      ex: [{ e: '2! = 2', why: L('AB va BA, boshqasi yo\'q', 'AB и BA, других нет', 'AB and BA, no others') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('5 dan 2 tani joylashtirish?', 'Разместить 2 из 5 ?', 'Arrange 2 out of 5 ?'),
      cols: 4,
      items: [
        { id: 'a', label: '20', correct: true },
        { id: 'b', label: '10', hint: L("Bu tartib muhim bo'lmagandagi javob. Joylashtirishda muhim.", 'Это ответ, когда порядок не важен. В размещении он важен.', 'That is the answer when the order does not matter. In an arrangement it does.') },
        { id: 'c', label: '120', hint: L("Bu beshalasini joylashtirish.", 'Это расставить всех пятерых.', 'That is arranging all five.') },
        { id: 'd', label: '25', hint: L("Takror yo'q: bir odam ikki joyni egallamaydi.", 'Повторов нет: один человек не займёт два места.', 'No repeats: one person does not take two places.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('AB va BA bir xil jamoami?', 'AB и BA это одна команда?', 'Are AB and BA one team?'),
      cols: 2,
      items: [
        { id: 'a', label: L('ha, bir xil', 'да, одна', 'yes, one'), correct: true },
        { id: 'b', label: L("yo'q, har xil", 'нет, разные', 'no, different'), hint: L("Jamoada rol yo'q: ikkalasi ham o'sha ikki odam.", 'В команде нет ролей: это те же два человека.', 'A team has no roles: it is the same two people.') },
        { id: 'c', label: L('shartga qarab', 'смотря по условию', 'depends on the problem'), hint: L("To'g'ri fikr, va bugungi shartda rol yo'q.", 'Верная мысль, и в сегодняшнем условии ролей нет.', 'A fair thought, and in today problem there are no roles.') },
        { id: 'd', label: L("aniqlab bo'lmaydi", 'определить нельзя', 'it cannot be determined'), hint: L("Mumkin: shartda jamoa deyilgan, medal emas.", 'Можно: в условии сказано команда, а не медали.', 'It can: the problem says a team, not medals.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('2! nechaga teng?', 'Чему равен 2! ?', 'What is 2! ?'),
      cols: 4,
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '1', hint: L("Ikkita yozuv bor: AB va BA.", 'Записей две: AB и BA.', 'There are two records: AB and BA.') },
        { id: 'c', label: '4', hint: L("Ikki karra bir bu ikki.", 'Два на один это два.', 'Two times one is two.') },
        { id: 'd', label: '0', hint: L("Faktorial noldan boshlanmaydi.", 'Факториал не начинается с нуля.', 'A factorial does not start at zero.') },
      ],
    },
  ],
  holds: [3000, 4500, 5000, 4500, 4500, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch o'tgan darsdan: beshtadan ikkitasini joylashtirish yigirma usulda bo'ladi. Bu yerda tartib muhim edi.", 'Первая опора с прошлого урока: разместить двоих из пяти можно двадцатью способами. Там порядок был важен.', 'The first basic from last lesson: two of five can be arranged in twenty ways. There the order mattered.'),
    A('c2', "Ikkinchi tayanch bugungi: jamoada rol yo'q. A va Be, hamda Be va A bu bitta jamoa. Medal bilan boshqacha edi: oltin va kumush har xil.", 'Вторая опора сегодняшняя: в команде нет ролей. A и B, и B и A это одна команда. С медалями было иначе: золото и серебро разные.', 'The second basic is today: a team has no roles. A and B, and B and A are one team. With medals it was different: gold and silver differ.'),
    A('c3', "Uchinchi tayanch: ikkita odamni ikki xil tartibda yozish mumkin, ya'ni ikki faktorial. Bu son bugun maxrajga tushadi.", 'Третья опора: двоих можно записать двумя способами, то есть два факториал. Это число сегодня уйдёт в знаменатель.', 'The third basic: two people can be written in two ways, that is two factorial. This number will go into the denominator today.'),
    A('recap', "Qisqacha: joylashtirish bor, va unda har to'plam bir necha marta sanalgan.", 'Коротко: размещение есть, и в нём каждый набор сосчитан несколько раз.', 'Briefly: we have the arrangement, and in it every set is counted several times.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. JUFTLARNI QO'LDA SANAYMIZ.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'order_matters',
  eyebrow: L('Qo\'lda sanaymiz', 'Пересчитаем руками', 'Let us count by hand'),
  title: L('Uch odamda tekshiramiz', 'Проверим на трёх', 'Let us test on three'),
  expr: L('3 odam: A, B, C', '3 человека: A, B, C', '3 people: A, B, C'),
  goal: L('nechta jamoa chiqadi', 'сколько выйдет команд', 'how many teams come out'),
  rule: L(
    "Uchta odamdan ikkitasini tanlaymiz va hamma yozuvni sanaymiz.",
    'Из трёх человек выбираем двоих и пересчитываем все записи.',
    'From three people we pick two and count every record.',
  ),
  pick: L('Nimani sanaymiz?', 'Что посчитаем?', 'What shall we count?'),
  claims: [
    { id: 'a', key: 'inA', name: L('joylashtirish', 'размещение', 'arrangement'), value: '20' },
    { id: 'b', key: 'inB', name: L('guruhlash', 'сочетание', 'combination'), value: '10' },
  ],
  points: [
    {
      id: 'q1', label: '6', num: '6', step: 'calc', verdict: 'in',
      role: L('tartib bilan', 'с порядком', 'with order'),
      calc: 'AB, BA, AC, CA, BC, CB',
      sol: true, inA: true, inB: false,
    },
    {
      id: 'q2', label: '3', num: '3', step: 'calc', verdict: 'in',
      role: L('tartibsiz', 'без порядка', 'without order'),
      calc: 'AB, AC, BC',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: '6 / 3', num: '2', step: 'calc', verdict: 'in',
      role: L('necha marta kam', 'во сколько раз меньше', 'how many times fewer'),
      calc: '6 / 3 = 2 = 2!',
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Har jamoa necha marta sanalgan?", 'Сколько раз посчитана каждая команда?', 'How many times was each team counted?'),
    items: [
      {
        id: 'b', label: L('ikki marta', 'дважды', 'twice'), correct: true,
        ok: L(
          "To'g'ri. AB va BA bu bitta jamoa, lekin ikkita yozuv. Shuning uchun ikkiga bo'linadi.",
          'Верно. AB и BA это одна команда, но две записи. Поэтому делим на два.',
          'Correct. AB and BA are one team but two records. That is why we divide by two.',
        ),
      },
      {
        id: 'a', label: L('bir marta', 'один раз', 'once'),
        hint: L("Ro'yxatga qarang: AB ham, BA ham bor. Bu bitta jamoaning ikkita yozuvi.", 'Посмотри в список: там есть и AB, и BA. Это две записи одной команды.', 'Look at the list: both AB and BA are there. Two records of one team.'),
      },
      {
        id: 'both', label: L('uch marta', 'трижды', 'three times'),
        hint: L("Ikkita odamni uch xil tartibda yozib bo'lmaydi: faqat ikkita.", 'Двоих нельзя записать тремя способами: только двумя.', 'Two people cannot be written in three ways: only two.'),
      },
      {
        id: 'none', label: L('har xil', 'по-разному', 'differently each time'),
        hint: L("Bir xil: har jamoa roppa rosa ikki marta, chunki ikkita odam.", 'Одинаково: каждая ровно дважды, потому что людей двое.', 'The same: each exactly twice, because there are two people.'),
      },
    ],
  },
  holds: [2500, 6000, 1500, 2500, 10000, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi uch odamda tekshiramiz.', 'Опора восстановлена. Теперь проверим на трёх людях.', 'The basics are back. Now let us test on three people.'),
    A('mount', "Beshtani sanash uzoq. Uchta odamda esa hamma variantni qo'lda yozib chiqish mumkin, va shu bahsni hal qiladi.", 'Пять пересчитывать долго. А на трёх можно выписать все варианты руками, и это решит спор.', 'Five take long to count. With three, every variant can be written out by hand, and that settles it.'),
    A('mount', "Nimani sanashni tanlang.", 'Выбери, что посчитать.', 'Choose what to count.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Yozuvlar oltita: A be, be A, A tse, tse A, be tse, tse be. Jamoalar esa uchta: A be, A tse, be tse. Har jamoa ikki marta sanalgan, chunki ikkita odamni ikki xil tartibda yozish mumkin. Nisbat ikkiga teng, va bu ikki faktorial.", 'Записей шесть: A B, B A, A C, C A, B C, C B. А команд три: A B, A C, B C. Каждая команда посчитана дважды, потому что двоих можно записать двумя способами. Отношение равно двум, и это два факториал.', 'There are six records: A B, B A, A C, C A, B C, C B. And three teams: A B, A C, B C. Each team is counted twice, because two people can be written in two ways. The ratio is two, and that is two factorial.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: DARAXT NUSXALARNI YIG'ADI.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'order_matters',
  eyebrow: L('Daraxtni oching', 'Открой дерево', 'Open the tree'),
  title: L('Nusxalar yig\'iladi', 'Копии схлопываются', 'The copies collapse'),
  chip: L('5 odamdan 2 tasi', 'из 5 человек 2', '2 out of 5 people'),
  tree: {
    levels: [{ n: 5 }, { n: 4 }],
    collapse: true,
    sumLabel: L("yig'indi:", 'сумма:', 'sum:'),
    prodLabel: L("ko'paytma:", 'произведение:', 'product:'),
    leafLabel: L('har xil jamoa:', 'разных команд:', 'different teams:'),
    height: 150,
  },
  graphSteps: 2,
  bonus: L(
    "Daraxt o'sha: ikki qatlam, yigirma barg. Lekin barglar juft juft bo'lib bir xil: A be va be A bitta jamoa. Nusxalar yig'ilgach o'nta qoladi.",
    'Дерево то же: два уровня, двадцать листьев. Но листья попарно одинаковы: A B и B A это одна команда. После схлопывания копий остаётся десять.',
    'The same tree: two levels, twenty leaves. But the leaves match in pairs: A B and B A are one team. After the copies collapse, ten remain.',
  ),
  probe: {
    question: L("Nega barglar soni ikki barobar kamaydi?", 'Почему листьев стало вдвое меньше?', 'Why are there half as many leaves?'),
    items: [
      { id: 'a', label: L("har jamoa ikkita bargda uchraydi", 'каждая команда встречается в двух листьях', 'each team appears in two leaves'), correct: true },
      { id: 'b', label: L("bitta qatlam yopildi", 'закрылся один уровень', 'a level was closed'), hint: L("Qatlamlar o'sha: ikkitasi. O'zgargani barglarning o'zi.", 'Уровней столько же: два. Изменились сами листья.', 'The levels are the same: two. What changed is the leaves themselves.') },
      { id: 'c', label: L("odamlar kamaydi", 'людей стало меньше', 'there are fewer people'), hint: L("Odamlar beshta bo'lib qoldi.", 'Людей осталось пятеро.', 'There are still five people.') },
      { id: 'd', label: L("shunday chiqdi", 'так получилось', 'it just came out that way'), hint: L("Sabab bor: ikkita odamni ikki xil tartibda yozish mumkin.", 'Причина есть: двоих можно записать двумя способами.', 'There is a reason: two people can be written in two ways.') },
    ],
  },
  holds: [4500, 6000, 7000],
  audio: [
    A('mount', "Uchta odamda tekshirdik. Endi beshtaga qaytamiz va daraxtga qaraymiz.", 'На трёх проверили. Теперь вернёмся к пяти и посмотрим на дерево.', 'We tested on three. Now back to five and to the tree.'),
    A('one', "Daraxt o'sha: ikki qatlam, yigirmata barg. Bu joylashtirishlar soni, va biz uni o'tgan darsda topganmiz.", 'Дерево то же: два уровня, двадцать листьев. Это число размещений, мы нашли его на прошлом уроке.', 'The same tree: two levels, twenty leaves. That is the number of arrangements, found last lesson.'),
    A('two', "Endi bir xil jamoalarni yig'amiz. Har jamoa ikkita bargda uchraydi, shuning uchun ikki barobar kam qoladi: o'nta. Bu son yozib olindi va u bugungi javob.", 'Теперь схлопнем одинаковые команды. Каждая встречается в двух листьях, поэтому остаётся вдвое меньше: десять. Это число и есть сегодняшний ответ.', 'Now let us collapse the identical teams. Each appears in two leaves, so half remain: ten. That number is today answer.'),
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
  title: L('Joylashtirishni k! ga bo\'lamiz', 'Делим размещение на k!', 'Divide the arrangement by k!'),
  rows: ['20 / 2! = 10', 'C = A / k!'],
  probe: {
    question: L(
      "Nega aynan k faktorialga bo'linadi?",
      'Почему делим именно на k факториал?',
      'Why divide by k factorial exactly?',
    ),
    items: [
      { id: 'a', label: L("tanlangan k tani shuncha tartibda yozish mumkin", 'выбранных k можно записать столькими способами', 'the chosen k can be written in that many orders'), correct: true },
      { id: 'b', label: L("shunday kelishilgan", 'так договорились', 'that is the convention'), hint: L("Kelishuv emas: uch odamda qo'lda sanadik.", 'Не договорённость: на трёх людях пересчитали руками.', 'Not a convention: we counted it by hand on three people.') },
      { id: 'c', label: L("n faktorialga bo'linadi", 'делим на n факториал', 'we divide by n factorial'), hint: L("En bu hamma odam. Takrorlanadigan esa faqat tanlanganlar.", 'Эн это все люди. А повторяется только выбранная часть.', 'n is everybody. Only the chosen part repeats.') },
      { id: 'd', label: L("javob kichikroq bo'lsin uchun", 'чтобы ответ был меньше', 'to make the answer smaller'), hint: L("Kattaligi maqsad emas: bo'linadigan son aniq nom bilan atalgan.", 'Величина не цель: делитель имеет точное имя.', 'The size is not the goal: the divisor has an exact name.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Guruhlash', 'Правило 1. Сочетание', 'Rule 1. Combination'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'C = A / k!',
    lines: [
      L("avval joylashtirishni sanaymiz, tartib bilan", 'сначала считаем размещение, с порядком', 'first count the arrangement, with order'),
      L("keyin k! ga bo'lamiz: har to'plam shuncha marta sanalgan", 'потом делим на k!: каждый набор посчитан столько раз', 'then divide by k!: every set was counted that many times'),
      L("k bu TANLANGANLAR soni, hammasi emas", 'k это число ВЫБРАННЫХ, а не всех', 'k is the number CHOSEN, not everybody'),
      L('tartib muhim bo\'lsa, bo\'lish kerak emas', 'если порядок важен, делить не нужно', 'if the order matters, no division is needed'),
    ],
    example: L('misol:  20 / 2! = 10', 'пример:  20 / 2! = 10', 'example:  20 / 2! = 10'),
  },
  holds: [4000, 6500, 4500],
  audio: [
    A('mount', "Daraxt javobni ko'rsatdi. Endi qoidani yozamiz.", 'Дерево показало ответ. Теперь запишем правило.', 'The tree showed the answer. Now let us write the rule.'),
    A('def', "Avval joylashtirishni sanaymiz, ya'ni tartib bilan. Keyin bo'lamiz, chunki har to'plam bir necha marta sanalgan. Necha marta? Tanlanganlarni nechta tartibda yozish mumkin bo'lsa, shuncha. Ikkitasini ikki xil, uchtasini olti xil.", 'Сначала считаем размещение, то есть с порядком. Потом делим, потому что каждый набор посчитан несколько раз. Сколько раз? Столькими способами, сколькими можно записать выбранных. Двоих двумя, троих шестью.', 'First we count the arrangement, that is with order. Then we divide, because every set was counted several times. How many? As many ways as the chosen ones can be written. Two in two ways, three in six.'),
    A('rule', "To'g'ri. Va diqqat: bo'linadigan son bu tanlanganlar soni, hamma odamlar soni emas.", 'Верно. И внимание: делим на число выбранных, а не на число всех.', 'Correct. And note: we divide by the number chosen, not by the total.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: uchtasini tanlaymiz.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'order_matters',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Endi uchtasini', 'Теперь троих', 'Now three'),
  was: { label: UI.was, expr: L('5 dan 2 ta  →  20 / 2 = 10', 'из 5 по 2  →  20 / 2 = 10', 'from 5 take 2  →  20 / 2 = 10') },
  now: { label: UI.now, expr: L('6 dan 3 ta  →  120 / ? ', 'из 6 по 3  →  120 / ?', 'from 6 take 3  →  120 / ?') },
  probe1: {
    question: L('Nima o\'zgardi?', 'Что изменилось?', 'What has changed?'),
    items: [
      { id: 'a', label: L("endi uchtasi tanlanadi, ikkitasi emas", 'теперь выбирают троих, а не двоих', 'now three are chosen, not two'), correct: true },
      { id: 'b', label: L("odamlar ko'paydi", 'людей стало больше', 'there are more people'), hint: L("Odamlar ham ko'paydi, lekin bo'linadigan son tanlanganlardan chiqadi.", 'Людей тоже больше, но делитель берётся из выбранных.', 'There are more people too, but the divisor comes from the chosen ones.') },
      { id: 'c', label: L('qoida boshqa bo\'ladi', 'правило станет другим', 'the rule will change'), hint: L("Qoida o'sha: joylashtirishni bo'lamiz. Faqat nimaga bo'lish o'zgaradi.", 'Правило то же: делим размещение. Меняется только на что.', 'The rule is the same: divide the arrangement. Only the divisor changes.') },
      { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L("Ikkitani ikki xil, uchtasini esa olti xil tartibda yozish mumkin.", 'Двоих можно записать двумя способами, троих шестью.', 'Two can be written in two ways, three in six.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('Nimaga bo\'linadi?', 'На что делим?', 'What do we divide by?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '3! = 6' },
      { id: 'b', label: '2! = 2' },
      { id: 'c', label: '6! = 720' },
      { id: 'd', label: '3' },
    ],
  },
  holds: [4500, 6500, 1700, 3000],
  audio: [
    A('mount', "Ikkita odam tanlanganda har jamoa ikki marta sanalardi.", 'Когда выбирали двоих, каждая команда считалась дважды.', 'When two were chosen, every team was counted twice.'),
    A('now', "Endi uchtasini tanlaymiz. Uchta odamni nechta tartibda yozish mumkin? Bu o'n oltinchi darsning savoli: uch faktorial, ya'ni olti. Demak har jamoa olti marta sanalgan.", 'Теперь выбираем троих. Сколькими способами можно записать троих? Это вопрос шестнадцатого урока: три факториал, то есть шесть. Значит каждая команда посчитана шесть раз.', 'Now we choose three. In how many ways can three be written? That is the question from lesson sixteen: three factorial, that is six. So every team was counted six times.'),
    A('q1', "Nima o'zgardi?", 'Что изменилось?', 'What has changed?'),
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
  expr: L('6 dan 3 ta,   A = 120', 'из 6 по 3,   A = 120', 'from 6 take 3,   A = 120'),
  need: '= ?',
  answerLabel: L('guruhlashlar', 'сочетаний', 'combinations'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: '120 / 3',
      point: {
        label: L('sanaymiz', 'считаем', 'we count'),
        calc: '= 40   ✗',
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: '120 / 3!',
      point: {
        label: L('sanaymiz', 'считаем', 'we count'),
        calc: '= 20   ✓',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['20', '40', '120', '60'],
    value: ['20'],
    label: L('jamoalar', 'команд', 'teams'),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '40', hint: L("Uchga bo'lindi, uch faktorialga emas. Uch odamni olti xil tartibda yozish mumkin, uch xil emas.", 'Поделили на три, а не на три факториал. Троих можно записать шестью способами, а не тремя.', 'Divided by three, not by three factorial. Three people can be written in six ways, not three.') },
      { key: '60', hint: L("Bu ikkiga bo'lgani. Tanlanganlar uchta, demak olti marta sanalgan.", 'Это деление на два. Выбранных трое, значит посчитано шесть раз.', 'That is dividing by two. Three are chosen, so each was counted six times.') },
      { key: '*', hint: L("Bir yuz yigirmani olti faktorialga emas, uch faktorialga bo'ling.", 'Сто двадцать подели на три факториал, а не на шесть факториал.', 'Divide one hundred and twenty by three factorial, not six factorial.') },
    ],
  },
  holds: [3500, 6000, 5500, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala nomzodni ham sanaymiz.', 'Прогноз есть. Теперь посчитаем обоих кандидатов.', 'The guess is made. Now let us compute both candidates.'),
    A('p1', "Birinchi nomzod uchga bo'ldi va qirq oldi. Uchlik qayerdan? Bu tanlanganlar soni. Lekin sanalgan takrorlar soni tanlanganlar soniga emas, ularning tartiblariga teng.", 'Первый кандидат поделил на три и получил сорок. Откуда тройка? Это число выбранных. Но повторов столько, сколько у них порядков, а не сколько их самих.', 'The first candidate divided by three and got forty. Where does the three come from? It is the number chosen. But the repeats are as many as their orders, not as their count.'),
    A('p2', "Ikkinchi nomzod uch faktorialga bo'ldi. Uchta odamni olti xil tartibda yozish mumkin, demak har jamoa olti marta sanalgan. Bir yuz yigirma bo'lingan olti, yigirma.", 'Второй кандидат поделил на три факториал. Троих можно записать шестью способами, значит каждая команда посчитана шесть раз. Сто двадцать делить на шесть, двадцать.', 'The second candidate divided by three factorial. Three people can be written in six ways, so every team was counted six times. One hundred and twenty over six, twenty.'),
    A('write', "Javobni yozing.", 'Запиши ответ.', 'Write the answer.'),
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
      label: L('tartib muhim', 'порядок важен', 'order matters'),
      text: 'n! / (n − k)!',
      tone: 'graph',
    },
    {
      label: L('tartib muhim emas', 'порядок не важен', 'order does not matter'),
      text: 'n! / (k! · (n − k)!)',
      tone: 'accent',
    },
  ],
  rows: ['C = n! / (k! · (n − k)!)', 'C(6,3) = 720 / (6 · 6) = 20'],
  probe: {
    question: L(
      "Ikki formulaning farqi nimada?",
      'Чем отличаются две формулы?',
      'How do the two formulas differ?',
    ),
    items: [
      { id: 'a', label: L("guruhlashda yana k! ga bo'linadi", 'в сочетании добавляется деление на k!', 'the combination adds a division by k!'), correct: true },
      { id: 'b', label: L("suratlar har xil", 'разные числители', 'the numerators differ'), hint: L("Surat bir xil: en faktorial. Maxraj esa boshqa.", 'Числитель один: эн факториал. А знаменатель другой.', 'The numerator is the same: n factorial. The denominator differs.') },
      { id: 'c', label: L("guruhlashda k yo'q", 'в сочетании нет k', 'the combination has no k'), hint: L("Bor, va u ikki marta uchraydi: maxrajda ikkala ko'paytuvchida ham.", 'Есть, и встречается дважды: в обоих множителях знаменателя.', 'It is there, and appears twice: in both factors of the denominator.') },
      { id: 'd', label: L('hech nimada', 'ничем', 'in no way'), hint: L("Farq bor: yigirma va o'nta, ikki barobar.", 'Разница есть: двадцать и десять, вдвое.', 'There is a difference: twenty and ten, twofold.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Formula', 'Правило 2. Формула', 'Rule 2. The formula'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'C = n! / (k! · (n − k)!)',
    lines: [
      L("(n − k)! ochilmagan qatlamlarni olib tashlaydi", '(n − k)! убирает нераскрытые уровни', '(n − k)! removes the unopened levels'),
      L("k! bir xil to'plamlarning nusxalarini olib tashlaydi", 'k! убирает копии одинаковых наборов', 'k! removes the copies of identical sets'),
      L("ikkala bo'lish ham bir xil sababdan: ortiqcha sanalgan", 'оба деления по одной причине: посчитано лишнее', 'both divisions for one reason: something was overcounted'),
      L("savol bitta: tartib muhimmi", 'вопрос один: важен ли порядок', 'one question: does the order matter'),
    ],
    example: L('misol:  C(6,3) = 20', 'пример:  C(6,3) = 20', 'example:  C(6,3) = 20'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Uch darsning bitta qoidasi', 'Одно правило трёх уроков', 'One rule for three lessons'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'n! / (k! · (n − k)!)',
    lines: [
      L('1. hammasi joylashsa: n!', '1. если расставляют всех: n!', '1. if all are arranged: n!'),
      L('2. joy kam bo\'lsa: (n − k)! ga bo\'l', '2. если мест меньше: дели на (n − k)!', '2. if there are fewer places: divide by (n − k)!'),
      L('3. tartib muhim bo\'lmasa: yana k! ga bo\'l', '3. если порядок не важен: дели ещё на k!', '3. if the order does not matter: divide by k! as well'),
      L("4. har bo'lish ortiqcha sanalganini olib tashlaydi", '4. каждое деление убирает лишний счёт', '4. each division removes an overcount'),
    ],
  },
  holds: [4000, 7000, 2900, 5000],
  audio: [
    A('mount', "Ikki holat ko'rildi. Endi uchala darsni bitta formulaga yig'amiz.", 'Два случая разобраны. Теперь сведём три урока в одну формулу.', 'Two cases are done. Now let us gather three lessons into one formula.'),
    A('rows', "Maxrajda ikkita ko'paytuvchi. Birinchisi ochilmagan qatlamlarni olib tashlaydi, ikkinchisi bir xil to'plamlarning nusxalarini. Ikkalasi ham bir xil sababdan: nimadir ortiqcha sanalgan.", 'В знаменателе два множителя. Первый убирает нераскрытые уровни, второй копии одинаковых наборов. Оба по одной причине: что-то посчитано лишний раз.', 'The denominator has two factors. The first removes the unopened levels, the second the copies of identical sets. Both for one reason: something was counted more than once.'),
    A('q', "Savol: ikki formulaning farqi nimada?", 'Вопрос: чем отличаются две формулы?', 'The question: how do the two formulas differ?'),
    A('rule', "To'g'ri. Va butun uchta dars bitta savolga keladi: tartib muhimmi. Muhim bo'lsa, ka faktorialga bo'linmaydi.", 'Верно. И все три урока сводятся к одному вопросу: важен ли порядок. Если важен, на ка факториал не делят.', 'Correct. And all three lessons come down to one question: does the order matter. If it does, there is no division by k factorial.'),
    A('both', 'Endi uchala darsni bitta qoidaga yig\'ing.', 'А теперь собери три урока в одно правило.', 'Now gather the three lessons into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. BO'LUVCHINI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'order_matters',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Bo\'luvchini qo\'ying', 'Поставь делитель', 'Place the divisor'),
  left: L('4 dan 2 ta,   A = 12', 'из 4 по 2,   A = 12', 'from 4 take 2,   A = 12'),
  template: ['C = 12 / ', { slot: 0 }],
  signs: ['2!', '4!', '2'],
  answer: '2!',
  checkNote: L(
    'Ikkita odamni ikki xil tartibda yozish mumkin',
    'Двоих можно записать двумя способами',
    'Two people can be written in two ways',
  ),
  wrongs: [
    { key: '4!', hint: L("To'rtlik bu HAMMA odamlar soni. Bo'linadigan esa tanlanganlar tartiblari.", 'Четвёрка это число ВСЕХ людей. А делим на порядки выбранных.', 'Four is the number of ALL people. We divide by the orders of the chosen ones.') },
    { key: '2', hint: L("Bu safar javob bir xil chiqadi, chunki ikki faktorial ham ikkiga teng. Lekin uchta tanlansa, farq paydo bo'ladi.", 'На этот раз ответ совпадёт, потому что два факториал тоже два. Но при трёх выбранных разница появится.', 'This time the answer coincides, because two factorial is also two. But with three chosen a difference appears.') },
  ],
  probe: {
    question: L("Bo'luvchi nimadan olinadi?", 'Откуда берётся делитель?', 'Where does the divisor come from?'),
    items: [
      { id: 'a', label: L("tanlanganlar sonining faktoriali", 'факториал числа выбранных', 'the factorial of the number chosen'), correct: true },
      { id: 'b', label: L("hamma odamlar sonining faktoriali", 'факториал числа всех', 'the factorial of the total'), hint: L("Unda javob bittadan kichik chiqardi.", 'Тогда ответ вышел бы меньше единицы.', 'Then the answer would come out less than one.') },
      { id: 'c', label: L("shunchaki tanlanganlar soni", 'просто число выбранных', 'just the number chosen'), hint: L("Uchta tanlanganda bu uch va olti bo'lib ajraladi.", 'При трёх выбранных это разойдётся: три и шесть.', 'With three chosen these part: three and six.') },
      { id: 'd', label: L("ularning ayirmasi", 'их разность', 'their difference'), hint: L("Ayirma boshqa ko'paytuvchida, ochilmagan qismda.", 'Разность в другом множителе, в нераскрытой части.', 'The difference is in the other factor, the unopened part.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Bo'luvchini qo'ying.", 'Поставь делитель.', 'Place the divisor.'),
    A('checked', "Bo'ldi. Endi ta'riflang: bo'luvchi nimadan olinadi?", 'Получилось. Теперь сформулируй: откуда берётся делитель?', 'Done. Now put it into words: where does the divisor come from?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'arr', label: L('joylashtirishni sanash', 'посчитать размещение', 'count the arrangement') },
  { id: 'div', label: L("k! ga bo'lish", 'поделить на k!', 'divide by k!') },
  { id: 'order', label: L('tartib muhimmi', 'важен ли порядок', 'does the order matter'), },
  { id: 'add', label: L("qo'shish", 'сложить', 'add') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'order_matters',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('10 odamdan 2 tasi jamoaga', 'из 10 человек 2 в команду', '2 of 10 people into a team'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'order',
      to: L('tartib muhim emas', 'порядок не важен', 'the order does not matter'),
      wrongs: [
        { action: 'arr', hint: L("Avval tartib muhimmi deb so'rang: butun yechim shunga bog'liq.", 'Сначала спроси, важен ли порядок: от этого зависит всё решение.', 'Ask first whether the order matters: the whole solution depends on it.') },
        { action: 'div', hint: L("Hali bo'linadigan narsa yo'q.", 'Пока делить нечего.', 'There is nothing to divide yet.') },
        { action: 'add', hint: L("Qo'shish bu yerda umuman ishlamaydi.", 'Сложение здесь вообще не работает.', 'Adding does not work here at all.') },
      ],
    },
    {
      action: 'arr',
      to: '10 · 9 = 90',
      wrongs: [
        { action: 'order', hint: L("Aniqlandi: muhim emas.", 'Выяснено: не важен.', 'Settled: it does not.') },
        { action: 'div', hint: L("Avval joylashtirishni sanang.", 'Сначала посчитай размещение.', 'Count the arrangement first.') },
        { action: 'add', hint: L("Qadamlar ketma ket, ko'paytiriladi.", 'Шаги идут подряд, умножаются.', 'The steps follow one another and multiply.') },
      ],
    },
    {
      action: 'div',
      to: '90 / 2! = 45',
      wrongs: [
        { action: 'order', hint: L("Aniqlandi.", 'Выяснено.', 'Settled.') },
        { action: 'arr', hint: L("Sanalgan: to'qson.", 'Посчитано: девяносто.', 'Counted: ninety.') },
        { action: 'add', hint: L("Qo'shish yo'q.", 'Сложения нет.', 'No adding.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['45', '90', '20', '100'],
    value: ['45'],
    label: L('jamoalar', 'команд', 'teams'),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '90', hint: L("Bu joylashtirish. Jamoada rol yo'q, demak ikkiga bo'linadi.", 'Это размещение. В команде нет ролей, значит делим на два.', 'That is the arrangement. A team has no roles, so divide by two.') },
      { key: '100', hint: L("Bu o'n karra o'n: takrorga ruxsat berilgan. Bir odam ikki marta kirmaydi.", 'Это десять на десять: с повторами. Один человек не входит дважды.', 'That is ten times ten: with repeats. One person does not join twice.') },
      { key: '*', hint: L("O'n karra to'qqiz bu to'qson, va uni ikkiga bo'ling.", 'Десять на девять это девяносто, и подели на два.', 'Ten times nine is ninety, and divide by two.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi o\'nta odamda ishlaymiz.', 'Правило сформулировано. Поработаем с десятью людьми.', 'The rule is stated. Let us work with ten people.'),
    A('start', "Birinchi savol har doim bitta: tartib muhimmi. Nimadan boshlashni tanlang.", 'Первый вопрос всегда один: важен ли порядок. Выбери, с чего начать.', 'The first question is always one: does the order matter. Choose where to start.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL: simmetriya.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'order_matters',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('6 dan 4 tasi', 'Из 6 по 4', 'From 6 take 4'),
  start: L('6 odamdan 4 tasi jamoaga', 'из 6 человек 4 в команду', '4 of 6 people into a team'),
  actions: ACTIONS_10,
  hint: L(
    "To'rttasini tanlash bu ikkitasini qoldirish bilan bir xil.",
    'Выбрать четверых это то же, что оставить двоих.',
    'Choosing four is the same as leaving two out.',
  ),
  steps: [
    {
      action: 'order',
      to: L('tartib muhim emas', 'порядок не важен', 'the order does not matter'),
      wrongs: [
        { action: 'arr', hint: L("Avval savolni bering.", 'Сначала задай вопрос.', 'Ask the question first.') },
        { action: 'div', hint: L("Hali bo'linadigan narsa yo'q.", 'Пока делить нечего.', 'There is nothing to divide yet.') },
        { action: 'add', hint: L("Qo'shish ishlamaydi.", 'Сложение не работает.', 'Adding does not work.') },
      ],
    },
    {
      action: 'arr',
      to: '6 · 5 · 4 · 3 = 360',
      wrongs: [
        { action: 'order', hint: L("Aniqlandi.", 'Выяснено.', 'Settled.') },
        { action: 'div', hint: L("Avval joylashtirish.", 'Сначала размещение.', 'The arrangement first.') },
        { action: 'add', hint: L("Ko'paytiriladi.", 'Умножается.', 'It multiplies.') },
      ],
    },
    {
      action: 'div',
      to: '360 / 4! = 15',
      wrongs: [
        { action: 'order', hint: L("Aniqlandi.", 'Выяснено.', 'Settled.') },
        { action: 'arr', hint: L("Sanalgan: uch yuz oltmish.", 'Посчитано: триста шестьдесят.', 'Counted: three hundred and sixty.') },
        { action: 'add', hint: L("Qo'shish yo'q.", 'Сложения нет.', 'No adding.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['15', '360', '30', '20'],
    value: ['15'],
    label: L('jamoalar', 'команд', 'teams'),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '360', hint: L("Bu joylashtirish, tartib bilan. To'rttani yigirma to'rt xil tartibda yozish mumkin.", 'Это размещение, с порядком. Четверых можно записать двадцатью четырьмя способами.', 'That is the arrangement, with order. Four can be written in twenty four ways.') },
      { key: '30', hint: L("To'rtga bo'lingan. Bo'linadigan esa to'rt faktorial, ya'ni yigirma to'rt.", 'Поделено на четыре. А делить надо на четыре факториал, то есть двадцать четыре.', 'Divided by four. But the divisor is four factorial, that is twenty four.') },
      { key: '*', hint: L("Uch yuz oltmishni yigirma to'rtga bo'ling.", 'Триста шестьдесят подели на двадцать четыре.', 'Divide three hundred and sixty by twenty four.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Oltita odamdan to'rttasi. Diqqat: bo'luvchi endi to'rt faktorial.", 'Из шести человек четверо. Внимание: делитель теперь четыре факториал.', 'Four of six people. Careful: the divisor is now four factorial.'),
    A('answered', "Javobni yozing. Va yozgandan keyin bitta narsani payqang: oltitadan ikkitasini tanlash ham xuddi shu javobni beradi.", 'Запиши ответ. И заметь одну вещь: выбрать двоих из шести даёт ровно столько же.', 'Write the answer. And notice one thing: choosing two of six gives exactly the same.'),
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
      done: 'C(5,2) = 10',
      prompt: L('5 dan 2 tani tanlash?', 'Выбрать 2 из 5 ?', 'Choose 2 out of 5 ?'),
      items: [
        { id: 'a', label: '10', correct: true },
        { id: 'b', label: '20', hint: L("Bu joylashtirish, tartib bilan.", 'Это размещение, с порядком.', 'That is the arrangement, with order.') },
        { id: 'c', label: '120', hint: L("Bu beshalasini joylashtirish.", 'Это расставить всех пятерых.', 'That is arranging all five.') },
        { id: 'd', label: '5', hint: L("Bittasini tanlash beshta usul, ikkitasini o'nta.", 'Одного выбрать пять способов, двоих десять.', 'Choosing one gives five ways, two gives ten.') },
      ],
    },
    {
      id: 'b2', tag: 'order_matters', ask: true, cols: 4,
      done: 'C(6,3) = 20',
      prompt: L('6 dan 3 tani tanlash?', 'Выбрать 3 из 6 ?', 'Choose 3 out of 6 ?'),
      items: [
        { id: 'a', label: '20', correct: true },
        { id: 'b', label: '120', hint: L("Bu joylashtirish. Uch faktorialga bo'lish kerak.", 'Это размещение. Надо поделить на три факториал.', 'That is the arrangement. Divide by three factorial.') },
        { id: 'c', label: '40', hint: L("Uchga bo'lingan, uch faktorialga emas.", 'Поделено на три, а не на три факториал.', 'Divided by three, not by three factorial.') },
        { id: 'd', label: '18', hint: L("Ko'paytma olti karra besh karra to'rt, keyin oltiga bo'linadi.", 'Произведение шесть на пять на четыре, потом делить на шесть.', 'The product six times five times four, then divide by six.') },
      ],
    },
    {
      id: 'b3', tag: 'order_matters', ask: true, cols: 4,
      done: 'C(10,2) = 45',
      prompt: L('10 dan 2 tani tanlash?', 'Выбрать 2 из 10 ?', 'Choose 2 out of 10 ?'),
      items: [
        { id: 'a', label: '45', correct: true },
        { id: 'b', label: '90', hint: L("Bu joylashtirish: ikkiga bo'lish unutildi.", 'Это размещение: забыли поделить на два.', 'That is the arrangement: the division by two was forgotten.') },
        { id: 'c', label: '100', hint: L("Bu takror bilan.", 'Это с повторами.', 'That is with repeats.') },
        { id: 'd', label: '20', hint: L("O'n karra to'qqiz bu to'qson, uning yarmi qirq besh.", 'Десять на девять это девяносто, половина сорок пять.', 'Ten times nine is ninety, half is forty five.') },
      ],
    },
    {
      id: 'b4', tag: 'order_matters', ask: true, cols: 2,
      done: L("tanlanganlar faktoriali", 'факториал выбранных', 'the factorial of the chosen'),
      prompt: L("Guruhlashda nimaga bo'linadi?", 'На что делят в сочетании?', 'What do we divide by in a combination?'),
      items: [
        { id: 'a', label: L("tanlanganlar sonining faktorialiga", 'на факториал числа выбранных', 'by the factorial of the number chosen'), correct: true },
        { id: 'b', label: L("hamma odamlar faktorialiga", 'на факториал всех', 'by the factorial of everybody'), hint: L("Unda javob bittadan kichik bo'lardi.", 'Тогда ответ был бы меньше единицы.', 'Then the answer would be less than one.') },
        { id: 'c', label: L("tanlanganlar soniga", 'на число выбранных', 'by the number chosen'), hint: L("Uchtada bu ajraladi: uch va olti.", 'На трёх это разойдётся: три и шесть.', 'At three these part: three and six.') },
        { id: 'd', label: L("bo'linmaydi", 'не делят', 'we do not divide'), hint: L("Bo'linmasa, bu joylashtirish bo'lardi.", 'Если не делить, это было бы размещение.', 'Without dividing it would be an arrangement.') },
      ],
    },
    {
      id: 'b5', tag: 'order_matters', ask: true, cols: 4,
      done: 'C(6,4) = C(6,2) = 15',
      prompt: L('6 dan 4 tani tanlash?', 'Выбрать 4 из 6 ?', 'Choose 4 out of 6 ?'),
      items: [
        { id: 'a', label: '15', correct: true },
        { id: 'b', label: '360', hint: L("Bu joylashtirish.", 'Это размещение.', 'That is the arrangement.') },
        { id: 'c', label: '30', hint: L("To'rt faktorialga bo'ling, to'rtga emas.", 'Дели на четыре факториал, а не на четыре.', 'Divide by four factorial, not by four.') },
        { id: 'd', label: '20', hint: L("Bu oltidan uchtani tanlash.", 'Это выбрать три из шести.', 'That is choosing three of six.') },
      ],
    },
    {
      id: 'b6', tag: 'order_matters', ask: true, cols: 2,
      done: L('tartib muhimmi', 'важен ли порядок', 'does the order matter'),
      prompt: L(
        "Masalani o'qib, birinchi navbatda nimani so'rash kerak?",
        'Прочитал задачу — о чём спросить в первую очередь?',
        'You read the problem: what to ask first?',
      ),
      items: [
        { id: 'a', label: L('tartib muhimmi', 'важен ли порядок', 'does the order matter'), correct: true },
        { id: 'b', label: L('nechta odam bor', 'сколько всего людей', 'how many people there are'), hint: L("Bu ham kerak, lekin ikkinchi navbatda: avval qaysi formulani olishni bilish kerak.", 'Это тоже нужно, но во вторую очередь: сначала надо знать, какую формулу брать.', 'That is needed too, but second: first you must know which formula to take.') },
        { id: 'c', label: L('javob katta yoki kichikmi', 'ответ большой или маленький', 'is the answer big or small'), hint: L("Kattaligi yechimni tanlamaydi.", 'Величина не выбирает решение.', 'The size does not choose the solution.') },
        { id: 'd', label: L("takror bormi", 'есть ли повторы', 'are there repeats'), hint: L("Bu ham savol, lekin asosiysi tartib haqida.", 'Это тоже вопрос, но главный про порядок.', 'That is a question too, but the main one is about order.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Uchtasini tanlash.", 'Выбрать троих.', 'Choosing three.'),
    A('q3', "Kattaroq sonlar.", 'Числа побольше.', 'Bigger numbers.'),
    A('q4', "Bo'luvchi haqida.", 'Про делитель.', 'About the divisor.'),
    A('q5', "Diqqat: bu javob tanish.", 'Внимание: этот ответ знакомый.', 'Careful: this answer is familiar.'),
    A('q6', 'Oxirgi savol, va u butun blok haqida.', 'Последний вопрос, и он про весь блок.', 'The last question, and it is about the whole block.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: bo'linmagan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'order_matters',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Yechim to'g'ri, lekin boshqa masalaniki", 'Решение верное, но не для этой задачи', 'A right solution, for another problem'),
  rows: [
    { id: 'r1', text: L('5 odamdan 2 tasi jamoaga', 'из 5 человек 2 в команду', '2 of 5 people into a team') },
    { id: 'r2', text: '5 · 4 = 20' },
    { id: 'r3', text: L('javob: 20 jamoa', 'ответ: 20 команд', 'answer: 20 teams') },
    { id: 'r4', text: L('tekshiruv: 20 > 10', 'проверка: 20 > 10', 'check: 20 > 10') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Bu satr ham to'g'ri: besh karra to'rt haqiqatan yigirma. Bu joylashtirishlar soni.", 'Эта строка тоже верна: пять на четыре действительно двадцать. Это число размещений.', 'This line is right too: five times four really is twenty. That is the number of arrangements.'),
    r4: L("Tekshiruv o'zi to'g'ri, lekin u xatoni ko'rsatmaydi.", 'Проверка верна сама по себе, но ошибку она не показывает.', 'The check is right in itself, but it does not show the error.'),
  },
  proofPoint: L('AB va BA bir xil jamoa', 'AB и BA это одна команда', 'AB and BA are one team'),
  proof: L(
    "Yigirma bu joylashtirishlar soni: u yerda A be va be A alohida sanalgan. Jamoa esa bitta. Har jamoa ikki marta sanalgani uchun ikkiga bo'lish kerak edi: o'nta.",
    'Двадцать это число размещений: там A B и B A сосчитаны отдельно. А команда одна. Раз каждая посчитана дважды, надо было поделить на два: десять.',
    'Twenty is the number of arrangements: there A B and B A are counted separately. But it is one team. Since each was counted twice, it had to be divided by two: ten.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("jamoada tartib hisobga olingan", 'в команде учтён порядок', 'the order was counted in a team'), correct: true },
      { id: 'b', label: L("ko'paytma noto'g'ri", 'произведение неверно', 'the product is wrong'), hint: L("Ko'paytma to'g'ri: besh karra to'rt yigirma.", 'Произведение верно: пять на четыре двадцать.', 'The product is right: five times four is twenty.') },
      { id: 'c', label: L("qadamlar soni xato", 'неверное число шагов', 'the wrong number of steps'), hint: L("Qadam ikkita, va bu to'g'ri: ikki odam tanlanadi.", 'Шагов два, и это верно: выбирают двоих.', 'Two steps, and that is right: two are chosen.') },
      { id: 'd', label: L("tekshiruv noto'g'ri", 'проверка неверна', 'the check is wrong'), hint: L("Tekshiruv to'g'ri, lekin u xatoni ko'rsatmaydi.", 'Проверка верна, но ошибку она не показывает.', 'The check is right, but it does not show the error.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda arifmetika to'g'ri va qadamlar soni ham to'g'ri. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь арифметика верна и число шагов верно. Найди строку, в которой ошибка появилась впервые.', 'Here the arithmetic is right and the number of steps is right. Find the line where the error first appeared.'),
    A('proof', "Qarang: yigirma bu joylashtirishlar soni, u yerda A be va be A alohida sanalgan. Jamoa esa bitta. Xato uchinchi satrda: son yigirma deb emas, jamoa yigirma deb atalgan joyda.", 'Смотри: двадцать это число размещений, там A B и B A сосчитаны отдельно. А команда одна. Ошибка в третьей строке: там, где число назвали числом команд.', 'Look: twenty is the number of arrangements, where A B and B A are counted separately. But it is one team. The error is in the third line: where the number was called the number of teams.'),
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
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L("tartib muhimmi degan savol", 'вопрос: важен ли порядок', 'the question: does the order matter'),
  tasks: [
    {
      prompt: L('5 dan 2 tasi jamoaga', 'из 5 по 2 в команду', '2 of 5 into a team'),
      template: ['C = 20 / ', { slot: 0 }, '  =  ', { slot: 1 }],
      parts: ['2!', '3!', '10', '20'],
      answer: ['2!', '10'],
      doneLabel: '20 / 2! = 10',
      wrongs: [
        { key: '3!|10', hint: L("Tanlanganlar ikkita, demak ikki faktorial.", 'Выбранных двое, значит два факториал.', 'Two are chosen, so two factorial.') },
        { key: '*', hint: L("Bo'luvchi tanlanganlar sonidan, javob esa yigirmaning yarmi.", 'Делитель из числа выбранных, а ответ половина двадцати.', 'The divisor comes from the number chosen, and the answer is half of twenty.') },
      ],
    },
    {
      prompt: L('5 dan 2 tasi medalga', 'из 5 по 2 на медали', '2 of 5 for medals'),
      template: ['A = 20 / ', { slot: 0 }, '  =  ', { slot: 1 }],
      parts: ['1', '2!', '20', '10'],
      answer: ['1', '20'],
      doneLabel: '20 / 1 = 20',
      wrongs: [
        { key: '2!|10', hint: L("Medal oltin va kumush: tartib MUHIM, demak bo'lish kerak emas.", 'Медали золотая и серебряная: порядок ВАЖЕН, значит делить не нужно.', 'The medals are gold and silver: the order MATTERS, so no division.') },
        { key: '*', hint: L("Shartda bitta so'z o'zgardi, va javob ikki barobar ortdi.", 'В условии изменилось одно слово, и ответ вырос вдвое.', 'One word changed in the problem, and the answer doubled.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi. Diqqat: sonlar o'sha, shartdagi bitta so'z boshqa.", 'А теперь второе. Внимание: числа те же, в условии другое одно слово.', 'And now the second one. Careful: the same numbers, one different word in the problem.'),
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
  law: 'C = n! / (k! · (n − k)!)',
  ruleLines: [
    L("tartib muhim bo'lmasa, har to'plam k! marta sanalgan", 'если порядок не важен, каждый набор посчитан k! раз', 'if the order does not matter, every set was counted k! times'),
    L("shuning uchun joylashtirishni k! ga bo'lamiz", 'поэтому делим размещение на k!', 'so we divide the arrangement by k!'),
    L("birinchi savol har doim bitta: tartib muhimmi", 'первый вопрос всегда один: важен ли порядок', 'the first question is always one: does the order matter'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('5 dan 2 tasi jamoaga', 'из 5 по 2 в команду', '2 of 5 into a team'),
      right: '10',
      map: { a: '20', b: '10', both: '—', none: '—' },
    },
    {
      screen: 5,
      expr: L('6 dan 3 ta', 'из 6 по 3', 'from 6 take 3'),
      right: '3! = 6',
      map: { a: '3! = 6', b: '2! = 2', c: '6! = 720', d: '3' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '20 / 2! = 10',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Uch odamli ekranga qayting', 'Вернись к экрану с тремя людьми', 'Go back to the three-people screen'),
  },
  probe: {
    question: L(
      "Uch dars, uchta formula. Ularni nima bog'laydi?",
      'Три урока, три формулы. Что их связывает?',
      'Three lessons, three formulas. What links them?',
    ),
    items: [
      { id: 'a', label: L("har bo'lish ortiqcha sanalganini olib tashlaydi", 'каждое деление убирает лишний счёт', 'each division removes an overcount'), correct: true },
      { id: 'b', label: L('hech narsa, ular har xil', 'ничего, они разные', 'nothing, they are different'), hint: L("Bog'liq: uchalasi ham bitta ko'paytmadan boshlanadi.", 'Связаны: все три начинаются с одного произведения.', 'They are linked: all three start from one product.') },
      { id: 'c', label: L('faktorial belgisi', 'знак факториала', 'the factorial sign'), hint: L("Belgi tashqi o'xshashlik. Ma'no bo'lishlarning sababida.", 'Знак это внешнее сходство. Смысл в причине делений.', 'The sign is a surface likeness. The meaning is in why we divide.') },
      { id: 'd', label: L("hammasi n dan boshlanadi", 'все начинаются с n', 'all start with n'), hint: L("Bu ham tashqi o'xshashlik.", 'Это тоже внешнее сходство.', 'That is a surface likeness too.') },
    ],
  },
  sheetTitle: L('Guruhlashlar · shpargalka', 'Сочетания · шпаргалка', 'Combinations · cheat sheet'),
  sheetSrc: L('11-sinf · 18-dars', '11 класс · урок 18', 'Grade 11 · lesson 18'),
  lifehack: L(
    "Masalada rollar bormi deb qarang: medal, o'rin, lavozim bo'lsa tartib muhim. Jamoa, guruh, to'plam bo'lsa muhim emas.",
    'Посмотри, есть ли в задаче роли: медаль, место, должность значит порядок важен. Команда, группа, набор значит не важен.',
    'Look for roles in the problem: a medal, a place, a post means the order matters. A team, a group, a set means it does not.',
  ),
  holds: [2500, 7000, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Shartda bitta so'z o'zgargan edi, javob esa ikki barobar kamaydi.", 'Вот твои прогнозы и вот как оказалось. В условии изменилось одно слово, а ответ уменьшился вдвое.', 'Here are your guesses and here is how it turned out. One word changed in the problem, and the answer halved.'),
    A('rule', "Va mana uch darsning umumiy fikri. Har safar biz bitta ko'paytmadan boshlaymiz va ortiqcha sanalganini bo'lish bilan olib tashlaymiz. Joy kam bo'lsa, ochilmagan qatlamlarni. Tartib muhim bo'lmasa, nusxalarni. Boshqa hech narsa yo'q.", 'И вот общая мысль трёх уроков. Каждый раз мы начинаем с одного произведения и делением убираем лишний счёт. Мало мест, значит нераскрытые уровни. Порядок не важен, значит копии. Больше ничего.', 'And here is the shared point of three lessons. Each time we start from one product and remove the overcount by dividing. Fewer places, the unopened levels. Order does not matter, the copies. Nothing else.'),
    A('q', "Oxirgi savol: uch formulani nima bog'laydi?", 'Последний вопрос: что связывает три формулы?', 'The last question: what links the three formulas?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
