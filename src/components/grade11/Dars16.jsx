// ============================================================================
// 11-sinf, Dars 16. O'RIN ALMASHTIRISHLAR.  (Перестановки)
//
// B3 blokining BIRINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/DARS16_SKELET.md
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// DARSNING BITTA GAPI: ketma-ket tanlov KO'PAYTIRILADI, qo'shilmaydi.
// Tadqiqotlarda temaning eng qimmat xatosi shu deb nomlangan: o'quvchi
// oltita buyumdan 6 + 5 + 4 + 3 + 2 + 1 = 21 deb yozadi. Bu arifmetik xato
// emas -- u ketma-ket tanlov qanday ishlashini ko'rmagan.
//
// DARSLIK BILAN MOS: 2-qism, 57-58-paragraf «Kombinatorika masalalari»
// temani aynan IKKI QOIDA -- yig'indi va ko'paytma -- deb qo'yadi. Asbob
// `OutcomeTree` ham shunday: daraxt ostida ikkita hisob turadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'
import { OutcomeTree } from './tools.jsx'

const META = {
  id: 'alg_11_16',
  title: L("O'rin almashtirishlar", 'Перестановки', 'Permutations'),
}

const BLOCK = { label: 'B3', from: 16, to: 24, current: 16 }

// ============================================================
// SLAYD 1. XUK. Qo'shishmi yoki ko'paytirish.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L("O'rin almashtirishlar", 'Перестановки', 'Permutations'),
  title: L("Qo'shishmi yoki ko'paytirish", 'Сложить или умножить', 'Add or multiply'),
  // Telefonda uzun savol 74px kesilardi: sarlavha savolni o'zi beryapti.
  expr: L('6 kitob javonda', '6 книг на полке', '6 books on a shelf'),
  rows: [
    {
      id: 'a',
      name: L("qo'shdi", 'сложение', 'adding'),
      value: '6 + 5 + 4 + … = 21',
    },
    {
      id: 'b',
      name: L("ko'paytirdi", 'умножение', 'multiplying'),
      value: '6 · 5 · 4 · … = 720',
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi daraxt qurib sanaymiz.",
      'Твой ответ записан. Сейчас построим дерево и посчитаем.',
      'Your answer is saved. Now we will build a tree and count.',
    ),
    items: [
      { id: 'a', label: '21' },
      { id: 'b', label: '720' },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  holds: [5500, 5500, 5000, 4000],
  audio: [
    A('mount', "Yangi blok boshlandi. Uning bosh savoli bitta: qancha? Va birinchi darsdayoq temaning eng qimmat xatosi uchraydi.", 'Начался новый блок. Его главный вопрос один: сколько? И уже на первом уроке встречается самая дорогая ошибка темы.', 'A new block begins. Its main question is one: how many? And the most expensive mistake of the topic appears already in the first lesson.'),
    A('r1', "Birinchi yechim: birinchi kitobni olti usulda, ikkinchisini besh usulda, va shu tariqa. Hammasini qo'shdi, yigirma bir chiqdi.", 'Первое решение: первую книгу шестью способами, вторую пятью, и так далее. Всё сложил, вышло двадцать один.', 'The first solution: the first book in six ways, the second in five, and so on. Added it all up, twenty one came out.'),
    A('r2', "Ikkinchi yechim: o'sha sonlar, lekin ko'paytirilgan. Yetti yuz yigirma chiqdi.", 'Второе решение: те же числа, но перемножены. Вышло семьсот двадцать.', 'The second solution: the same numbers, but multiplied. Seven hundred and twenty came out.'),
    A('ask', "Farq o'ttiz to'rt barobar. Sizningcha qaysi javob to'g'ri? Hozircha shunchaki taxmin qiling.", 'Разница в тридцать четыре раза. Как думаешь, какой ответ верный? Пока просто предположи.', 'The difference is thirty four times. Which answer do you think is correct? Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. TAYANCH: ikki qoida va yozuv.
// ============================================================
const S2 = {
  role: 'support',
  eyebrow: L('Tayanchni tekshirish', 'Проверка опоры', 'Checking the basics'),
  title: L('Uch tayanch', 'Три опоры', 'Three basics'),
  lead: L(
    "Kombinatorikada ikkita qoida bor, va ularni ajratish butun blokni hal qiladi. Bu baholanmaydi.",
    'В комбинаторике два правила, и умение их различать решает весь блок. Это не оценивается.',
    'Combinatorics has two rules, and telling them apart decides the whole block. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L("YOKI qoidasi: qo'shiladi", 'Правило ИЛИ: складываем', 'The OR rule: we add'),
      short: L('bitta tanlov', 'один выбор', 'one choice'),
      ex: [{ e: '3 + 4 = 7', why: L("choy YOKI kofe: uch xil choy, to'rt xil kofe", 'чай ИЛИ кофе: три сорта чая, четыре кофе', 'tea OR coffee: three teas, four coffees') }],
    },
    {
      id: 'c2',
      title: L('VA qoidasi: ko\'paytiriladi', 'Правило И: умножаем', 'The AND rule: we multiply'),
      short: L('ketma-ket tanlov', 'выбор по шагам', 'a choice in steps'),
      ex: [{ e: '3 · 4 = 12', why: L("ko'ylak VA shim: uch ko'ylak, to'rt shim", 'рубашка И брюки: три рубашки, четверо брюк', 'a shirt AND trousers: three shirts, four trousers') }],
    },
    {
      id: 'c3',
      title: L('Faktorial bu qisqa yozuv', 'Факториал это короткая запись', 'The factorial is shorthand'),
      short: L('yangi amal emas', 'не новое действие', 'not a new operation'),
      ex: [{ e: '4! = 4 · 3 · 2 · 1 = 24', why: L("undov belgisi ko'paytmani bildiradi", 'восклицательный знак означает произведение', 'the exclamation mark means a product') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L(
        "Uch xil choy yoki to'rt xil kofe. Nechta tanlov?",
        'Три сорта чая или четыре кофе. Сколько выборов?',
        'Three teas or four coffees. How many choices?',
      ),
      cols: 4,
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '12', hint: L("Bu ko'paytma. Bu yerda faqat BITTA ichimlik tanlanadi, ikkitasi emas.", 'Это произведение. Здесь выбирают ОДИН напиток, а не два.', 'That is the product. Here ONE drink is chosen, not two.') },
        { id: 'c', label: '4', hint: L("Choylar ham hisobga olinadi: ular ham tanlov.", 'Чаи тоже считаются: они тоже выбор.', 'The teas count too: they are choices as well.') },
        { id: 'd', label: '3', hint: L("Kofelar ham hisobga olinadi.", 'Кофе тоже считаются.', 'The coffees count too.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L(
        "Uch ko'ylak va to'rt shim. Nechta kiyim to'plami?",
        'Три рубашки и четверо брюк. Сколько комплектов?',
        'Three shirts and four trousers. How many outfits?',
      ),
      cols: 4,
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '7', hint: L("Bu yig'indi. Bu yerda ikkala narsa ham tanlanadi, bittasi emas.", 'Это сумма. Здесь выбирают обе вещи, а не одну.', 'That is the sum. Here both items are chosen, not one.') },
        { id: 'c', label: '3', hint: L("Har ko'ylakka to'rtta shim mos keladi.", 'К каждой рубашке подходят четверо брюк.', 'Each shirt goes with four trousers.') },
        { id: 'd', label: '34', hint: L("Raqamlarni yonma yon qo'yish sanoq emas.", 'Приписать цифры рядом это не счёт.', 'Writing the digits side by side is not counting.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('4! nechaga teng?', 'Чему равен 4! ?', 'What is 4! ?'),
      cols: 4,
      items: [
        { id: 'a', label: '24', correct: true },
        { id: 'b', label: '10', hint: L("Bu yig'indi: to'rt plyus uch plyus ikki plyus bir. Faktorial esa ko'paytma.", 'Это сумма: четыре плюс три плюс два плюс один. А факториал это произведение.', 'That is the sum: four plus three plus two plus one. The factorial is a product.') },
        { id: 'c', label: '4', hint: L("Undov belgisi butun ko'paytmani bildiradi, faqat sonni emas.", 'Восклицательный знак означает всё произведение, а не просто число.', 'The exclamation mark means the whole product, not just the number.') },
        { id: 'd', label: '16', hint: L("Bu to'rtning kvadrati. Faktorial esa kamayib boruvchi ko'paytma.", 'Это четыре в квадрате. А факториал это убывающее произведение.', 'That is four squared. The factorial is a decreasing product.') },
      ],
    },
  ],
  holds: [3000, 5500, 5500, 5000, 4500, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi qoida: YOKI. Choy yoki kofe tanlansa, imkoniyatlar qo'shiladi. Bitta narsa tanlanadi, va variantlar bir ro'yxatga qo'shiladi.", 'Первое правило: ИЛИ. Если выбирают чай или кофе, возможности складываются. Выбирают одну вещь, и варианты собираются в один список.', 'The first rule: OR. If tea or coffee is chosen, the options add up. One thing is chosen, and the variants gather into one list.'),
    A('c2', "Ikkinchi qoida: VA. Ko'ylak va shim tanlansa, imkoniyatlar ko'paytiriladi. Har ko'ylakka to'rtta shim mos keladi, jami o'n ikki to'plam.", 'Второе правило: И. Если выбирают рубашку и брюки, возможности умножаются. К каждой рубашке подходят четверо брюк, всего двенадцать комплектов.', 'The second rule: AND. If a shirt and trousers are chosen, the options multiply. Each shirt goes with four trousers, twelve outfits in total.'),
    A('c3', "Uchinchi tayanch yozuv haqida. Undov belgisi yangi amal emas: to'rt faktorial bu shunchaki to'rt karra uch karra ikki karra bir.", 'Третья опора про запись. Восклицательный знак это не новое действие: четыре факториал это просто четыре на три на два на один.', 'The third basic is about notation. The exclamation mark is not a new operation: four factorial is simply four times three times two times one.'),
    A('recap', "Qisqacha: YOKI qo'shadi, VA ko'paytiradi. Butun blok shu ikki so'z atrofida.", 'Коротко: ИЛИ складывает, И умножает. Весь блок вокруг этих двух слов.', 'Briefly: OR adds, AND multiplies. The whole block turns on these two words.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. BITTA MISOL HECH NARSANI ISBOTLAMAYDI.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'check_by_point',
  eyebrow: L('Bitta misol yetarli emas', 'Одного примера мало', 'One example is not enough'),
  title: L('Uchtada ikkalasi ham 6 beradi', 'На трёх оба дают 6', 'At three both give 6'),
  expr: L('nechta buyumda tekshiramiz?', 'на скольких предметах проверим?', 'how many objects shall we test on?'),
  goal: L('ikki usulni ajratish', 'развести два способа', 'tell the two methods apart'),
  rule: L(
    "Kichik songa qo'yib ko'ramiz: qayerda ajraladi?",
    'Подставим маленькое число: где они разойдутся?',
    'Try a small number: where do they part?',
  ),
  pick: L('Nechta buyum?', 'Сколько предметов?', 'How many objects?'),
  claims: [
    { id: 'a', key: 'inA', name: L("qo'shish", 'сложение', 'adding'), value: '21' },
    { id: 'b', key: 'inB', name: L("ko'paytirish", 'умножение', 'multiplying'), value: '720' },
  ],
  points: [
    {
      id: 'q1', label: '2', num: '2', step: 'calc', verdict: 'out',
      role: L('aslida 2 ta', 'на деле 2', 'actually 2'),
      calc: L("qo'shish 3,  ko'paytirish 2", 'сложение 3, умножение 2', 'adding 3, multiplying 2'),
      sol: false, inA: false, inB: true,
    },
    {
      id: 'q2', label: '3', num: '3', step: 'calc', verdict: 'in',
      role: L('ikkalasi ham 6', 'оба дают 6', 'both give 6'),
      calc: L("qo'shish 6,  ko'paytirish 6", 'сложение 6, умножение 6', 'adding 6, multiplying 6'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q3', label: '4', num: '4', step: 'calc', verdict: 'out',
      role: L('bu yerda ajraldi', 'здесь разошлись', 'here they part'),
      calc: L("qo'shish 10,  ko'paytirish 24", 'сложение 10, умножение 24', 'adding 10, multiplying 24'),
      sol: false, inA: false, inB: true,
    },
  ],
  probe: {
    question: L(
      "Uchtada ikkalasi ham 6 berdi. Nima demak?",
      'На трёх оба дали 6. Что это значит?',
      'At three both gave 6. What does it mean?',
    ),
    items: [
      {
        id: 'b', label: L('tasodif, usullar har xil', 'совпадение, способы разные', 'a coincidence, the methods differ'), correct: true,
        ok: L(
          "To'g'ri. To'rtta buyumda ular darrov ajraladi: o'n va yigirma to'rt.",
          'Верно. На четырёх предметах они сразу расходятся: десять и двадцать четыре.',
          'Correct. At four they part: ten and twenty four.',
        ),
      },
      {
        id: 'a', label: L('usullar teng kuchli', 'способы равносильны', 'the methods are equivalent'),
        hint: L("To'rttaga qo'ying: o'n va yigirma to'rt. Teng kuchli emas.", 'Подставь четыре: десять и двадцать четыре. Не равносильны.', 'Put in four: ten and twenty four. Not equivalent.'),
      },
      {
        id: 'c', label: L("qo'shish to'g'ri", 'сложение верно', 'adding is right'),
        hint: L("Ikkitada qo'shish uchta berdi, aslida esa ikkita. Barmoq bilan sanab ko'ring.", 'На двух сложение дало три, а на деле два. Пересчитай пальцем.', 'At two, adding gave three, but in fact there are two. Count on your fingers.'),
      },
      {
        id: 'none', label: L('hech narsani', 'ничего', 'nothing'),
        hint: L("Bildiradi: bitta misolga tayanib bo'lmaydi. Bu darsning yarmi.", 'Значит: на один пример опираться нельзя. Это половина урока.', 'It means one example is not something to rely on. That is half the lesson.'),
      },
    ],
  },
  holds: [2500, 6500, 1500, 2500, 10500, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi bahsni hal qilamiz.', 'Опора восстановлена. Теперь решим спор.', 'The basics are back. Now let us settle the argument.'),
    A('mount', "Oltita kitobni birdan sanash qiyin. Shuning uchun kichik songa qo'yib ko'ramiz: ikkita, uchta, to'rtta.", 'Шесть книг сразу посчитать трудно. Поэтому подставим маленькое число: два, три, четыре.', 'Six books are hard to count at once. So let us try a small number: two, three, four.'),
    A('mount', "Nechta buyumdan boshlashni tanlang.", 'Выбери, со скольких предметов начать.', 'Choose how many objects to start with.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana eng qiziq joyi. Uchta buyumda ikkala usul ham oltita beradi: uch plyus ikki plyus bir olti, va uch karra ikki karra bir ham olti. Bu yerda to'xtagan o'quvchi o'zini haq deb o'ylaydi. Lekin to'rttada ular ajraladi: o'n va yigirma to'rt. Va ikkitada qo'shish uchta beradi, aslida esa ikkita tartib bor, buni barmoq bilan sanash mumkin.", 'Вот самое интересное. На трёх предметах оба способа дают шесть: три плюс два плюс один шесть, и три на два на один тоже шесть. Ученик, остановившийся здесь, считает себя правым. Но на четырёх они расходятся: десять и двадцать четыре. А на двух сложение даёт три, хотя порядка всего два, и это можно пересчитать пальцем.', 'Here is the most interesting part. At three objects both methods give six: three plus two plus one is six, and three times two times one is also six. A student who stops here thinks they are right. But at four they part: ten and twenty four. And at two, adding gives three, while there are only two orders, and that can be counted on fingers.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: DARAXT va IKKI HISOB.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'sum_vs_product',
  eyebrow: L('Daraxtni oching', 'Открой дерево', 'Open the tree'),
  title: L('Barglar sonini nima beradi', 'Что даёт число листьев', 'What gives the number of leaves'),
  chip: L('4 buyum', '4 предмета', '4 objects'),
  // Rol `graph`, asbob esa DARAXT. Ma'lumot o'zgardi, rol emas.
  tree: {
    levels: [{ n: 4 }, { n: 3 }, { n: 2 }, { n: 1 }],
    sumLabel: L("yig'indi:", 'сумма:', 'sum:'),
    prodLabel: L("ko'paytma:", 'произведение:', 'product:'),
    leafLabel: L('barglar:', 'листьев:', 'leaves:'),
    height: 150,
  },
  graphSteps: 4,
  holds: [4500, 5500, 6000, 7000],
  probe: {
    question: L("Barglar soni qaysi hisobga mos keldi?", 'С каким счётом совпало число листьев?', 'Which count matches the number of leaves?'),
    items: [
      { id: 'a', label: L("ko'paytma", 'с произведением', 'the product'), correct: true },
      { id: 'b', label: L("yig'indi", 'с суммой', 'the sum'), hint: L("Yig'indi o'nta berdi, barglar esa yigirma to'rtta.", 'Сумма дала десять, а листьев двадцать четыре.', 'The sum gave ten, and there are twenty four leaves.') },
      { id: 'c', label: L('ikkisiga ham', 'с обоими', 'both'), hint: L("Uchta buyumda shunday edi, to'rttada esa yo'q.", 'Так было на трёх предметах, а на четырёх уже нет.', 'That was so at three objects, but not at four.') },
      { id: 'd', label: L('hech qaysiga', 'ни с одним', 'neither'), hint: L("Barglarni sanang: yigirma to'rtta, va ko'paytma ham yigirma to'rt.", 'Посчитай листья: двадцать четыре, и произведение двадцать четыре.', 'Count the leaves: twenty four, and the product is twenty four.') },
    ],
  },
  audio: [
    A('mount', "Sonlar ajratildi. Endi nima uchun shunday ekanini daraxtda ko'ramiz.", 'Числа развели. Теперь посмотрим на дереве, почему так.', 'The numbers are separated. Now let us see on the tree why it is so.'),
    A('one', "Birinchi qadam: birinchi joyga to'rtta buyumdan istalganini qo'yish mumkin. To'rtta shox.", 'Первый шаг: на первое место можно поставить любой из четырёх предметов. Четыре ветки.', 'The first step: any of the four objects can go in the first place. Four branches.'),
    A('two', "Ikkinchi qadam: har shoxdan uchtadan yangi shox chiqadi, chunki bitta buyum allaqachon qo'yilgan. Endi o'n ikkita tugun.", 'Второй шаг: из каждой ветки выходит по три новых, потому что один предмет уже поставлен. Теперь двенадцать узлов.', 'The second step: three new branches come out of each, because one object is already placed. Now twelve nodes.'),
    A('three', "Uchinchi va to'rtinchi qadamlardan keyin yigirma to'rtta barg qoladi. Daraxt ostida ikkita hisob turibdi: yig'indi o'n, ko'paytma yigirma to'rt. Barglar soni ikkinchisiga mos keldi.", 'После третьего и четвёртого шага остаётся двадцать четыре листа. Под деревом стоят два счёта: сумма десять, произведение двадцать четыре. Число листьев совпало со вторым.', 'After the third and fourth steps twenty four leaves remain. Under the tree stand two counts: the sum ten, the product twenty four. The number of leaves matched the second.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1: KO'PAYTMA va FAKTORIAL.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'sum_vs_product',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L("Ketma-ket tanlov ko'paytiriladi", 'Выбор по шагам умножается', 'A step-by-step choice multiplies'),
  rows: [
    '4 · 3 · 2 · 1 = 24',
    'n! = n · (n − 1) · … · 2 · 1',
  ],
  probe: {
    question: L(
      "Nega qadamlar ko'paytiriladi, qo'shilmaydi?",
      'Почему шаги умножаются, а не складываются?',
      'Why do the steps multiply and not add?',
    ),
    items: [
      { id: 'a', label: L("har shoxdan yana bir nechta shox chiqadi", 'из каждой ветки выходит ещё несколько', 'each branch grows several more'), correct: true },
      { id: 'b', label: L("shunday kelishilgan", 'так договорились', 'that is the convention'), hint: L("Kelishuv emas: barglarni sanab ko'rish mumkin.", 'Не договорённость: листья можно пересчитать.', 'Not a convention: the leaves can be counted.') },
      { id: 'c', label: L("chunki sonlar kamayib boradi", 'потому что числа убывают', 'because the numbers decrease'), hint: L("Kamayish tanlovning kamayishidan, lekin amalni u belgilamaydi.", 'Убывание от того, что выбор сужается, но действие определяет не оно.', 'They decrease because the choice narrows, but that does not set the operation.') },
      { id: 'd', label: L("ko'paytma har doim kattaroq", 'произведение всегда больше', 'a product is always bigger'), hint: L("Katta bo'lgani javob emas: nega katta ekanini daraxt ko'rsatdi.", 'Больше это не ответ: почему больше, показало дерево.', 'Bigger is not the answer: why bigger is what the tree showed.') },
    ],
  },
  rule: {
    badge: L('1-qoida. VA va YOKI', 'Правило 1. И и ИЛИ', 'Rule 1. AND and OR'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'n! = n · (n − 1) · … · 1',
    lines: [
      L("VA bo'lsa ko'paytiriladi: tanlov qadamma qadam ketadi", 'если И, умножаем: выбор идёт по шагам', 'if AND, multiply: the choice goes step by step'),
      L("YOKI bo'lsa qo'shiladi: bitta tanlov, bir necha ro'yxat", 'если ИЛИ, складываем: один выбор, несколько списков', 'if OR, add: one choice, several lists'),
      L("n ta buyumni joylashtirish n! usulda bo'ladi", 'расставить n предметов можно n! способами', 'n objects can be arranged in n! ways'),
      L('n! yangi amal emas, bu ko\'paytmaning qisqa yozuvi', 'n! это не новое действие, а короткая запись произведения', 'n! is not a new operation but shorthand for a product'),
    ],
    example: L('misol:  6 kitob  →  6! = 720', 'пример:  6 книг  →  6! = 720', 'example:  6 books  →  6! = 720'),
  },
  holds: [4000, 6500, 5000],
  audio: [
    A('mount', "Daraxt javobni ko'rsatdi. Endi qoidani yozamiz.", 'Дерево показало ответ. Теперь запишем правило.', 'The tree showed the answer. Now let us write the rule.'),
    A('def', "Har qadamda tanlov qilinsa va qadamlar ketma ket bo'lsa, imkoniyatlar ko'paytiriladi. Sabab daraxtda ko'rindi: har shoxdan yana bir nechta shox chiqadi, shuning uchun barglar soni ko'payib boradi, qo'shilib emas. En ta buyumni joylashtirish en faktorial usulda bo'ladi.", 'Если на каждом шаге делается выбор и шаги идут подряд, возможности умножаются. Причина видна на дереве: из каждой ветки выходит ещё несколько, поэтому число листьев умножается, а не складывается. Расставить эн предметов можно эн факториал способами.', 'If a choice is made at each step and the steps follow one another, the options multiply. The reason showed on the tree: several branches grow out of each one, so the number of leaves multiplies rather than adds. n objects can be arranged in n factorial ways.'),
    A('rule', "To'g'ri. Va yodda tuting: undov belgisi yangi amal emas, u shunchaki uzun ko'paytmaning qisqa yozuvi.", 'Верно. И запомни: восклицательный знак не новое действие, это просто короткая запись длинного произведения.', 'Correct. And remember: the exclamation mark is not a new operation, it is just shorthand for a long product.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: ikkita kitob bir xil.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'sum_vs_product',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Ikkita kitob bir xil', 'Две книги одинаковые', 'Two books are identical'),
  was: { label: UI.was, expr: L('6 har xil kitob  →  720', '6 разных книг  →  720', '6 different books  →  720') },
  now: { label: UI.now, expr: L('6 kitob, ikkitasi bir xil  →  ?', '6 книг, две одинаковые  →  ?', '6 books, two identical  →  ?') },
  probe1: {
    question: L('Nima o\'zgardi?', 'Что изменилось?', 'What has changed?'),
    items: [
      { id: 'a', label: L("ba'zi tartiblar endi farq qilmaydi", 'некоторые порядки теперь неразличимы', 'some orders are now indistinguishable'), correct: true },
      { id: 'b', label: L('kitoblar soni kamaydi', 'книг стало меньше', 'there are fewer books'), hint: L("Kitoblar oltita, faqat ikkitasi ajratib bo'lmaydigan.", 'Книг шесть, просто две неразличимы.', 'There are six books, just two are indistinguishable.') },
      { id: 'c', label: L('javob o\'zgarmaydi', 'ответ не изменится', 'the answer will not change'), hint: L("O'zgaradi: bir xil ko'ringan tartiblar bitta bo'lib qoladi.", 'Изменится: одинаково выглядящие порядки становятся одним.', 'It will: orders that look the same become one.') },
      { id: 'd', label: L("qoida boshqa bo'ladi", 'правило станет другим', 'the rule will change'), hint: L("Qoida o'sha: ko'paytma. Undan keyin takrorlar olib tashlanadi.", 'Правило то же: произведение. После него убираются повторы.', 'The rule is the same: the product. After it the repeats are removed.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('Nechta har xil tartib qoladi?', 'Сколько останется разных порядков?', 'How many different orders remain?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '360' },
      { id: 'b', label: '720' },
      { id: 'c', label: '180' },
      { id: 'd', label: '718' },
    ],
  },
  holds: [4500, 6500, 1700, 3000],
  audio: [
    A('mount', "Hozirgacha hamma kitob har xil edi, va har tartib alohida sanalardi.", 'До сих пор все книги были разными, и каждый порядок считался отдельно.', 'So far all the books were different, and every order counted separately.'),
    A('now', "Endi ikkita kitob bir xil. Ularning o'rnini almashtirsangiz, javonda hech narsa o'zgarmaydi: ko'z farqni ko'rmaydi. Demak ba'zi tartiblar bir birining nusxasiga aylandi.", 'Теперь две книги одинаковые. Поменяешь их местами, и на полке ничего не изменится: глаз разницы не увидит. Значит некоторые порядки стали копиями друг друга.', 'Now two books are identical. Swap them and nothing on the shelf changes: the eye sees no difference. So some orders became copies of one another.'),
    A('q1', "Nima o'zgardi?", 'Что изменилось?', 'What has changed?'),
    A('q2', 'Sizningcha nechta tartib qoladi? Shunchaki taxmin qiling.', 'Как думаешь, сколько останется порядков? Просто предположи.', 'How many orders do you think remain? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: 720 yoki 360.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'sum_vs_product',
  eyebrow: L('Nusxalarni yig\'amiz', 'Схлопнем копии', 'Let us collapse the copies'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: L('6 kitob, ikkitasi bir xil', '6 книг, две одинаковые', '6 books, two identical'),
  need: '= ?',
  answerLabel: L('tartiblar soni', 'число порядков', 'the number of orders'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: '720',
      point: {
        label: L('hech narsa o\'zgarmagan', 'ничего не изменилось', 'nothing has changed'),
        calc: L('har tartib ikki marta sanalgan', 'каждый порядок сосчитан дважды', 'every order counted twice'),
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: '360',
      point: {
        label: L('nusxalar yig\'ildi', 'копии схлопнуты', 'the copies are collapsed'),
        calc: '720 / 2 = 360',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['360', '720', '180', '718'],
    value: ['360'],
    label: L('tartiblar', 'порядков', 'orders'),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '720', hint: L("Bir xil kitoblarning o'rnini almashtirsangiz, javonda hech narsa o'zgarmaydi. Demak bunday tartiblar ikki marta sanalgan.", 'Поменяй одинаковые книги местами, и на полке ничего не изменится. Значит такие порядки сосчитаны дважды.', 'Swap the identical books and nothing changes on the shelf. So such orders were counted twice.') },
      { key: '718', hint: L("Ikkita nusxa ayirilmaydi: har tartib ikki marta sanalgan, shuning uchun BO'LINADI.", 'Две копии не вычитаются: каждый порядок сосчитан дважды, поэтому ДЕЛИТСЯ.', 'Two copies are not subtracted: every order was counted twice, so it is DIVIDED.') },
      { key: '*', hint: L("Har tartib roppa rosa ikki marta uchraydi, demak ikkiga bo'linadi.", 'Каждый порядок встречается ровно дважды, значит делим на два.', 'Every order occurs exactly twice, so we divide by two.') },
    ],
  },
  holds: [3500, 6500, 5500, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala javobni ham ko\'ramiz.', 'Прогноз есть. Теперь посмотрим на оба ответа.', 'The guess is made. Now let us look at both answers.'),
    A('p1', "Birinchi nomzod: hech narsa o'zgarmadi, yetti yuz yigirma. Lekin bir xil kitoblarning o'rnini almashtirib ko'ring: javon o'sha javon. Demak bu ikki tartib aslida bitta, va ular ikki marta sanalgan.", 'Первый кандидат: ничего не изменилось, семьсот двадцать. Но поменяй одинаковые книги местами: полка та же самая. Значит эти два порядка на деле один, и они сосчитаны дважды.', 'The first candidate: nothing changed, seven hundred and twenty. But swap the identical books: the shelf is the same. So these two orders are really one, and they were counted twice.'),
    A('p2', "Ikkinchi nomzod: har tartib roppa rosa ikki marta uchragani uchun ikkiga bo'lindi. Uch yuz oltmish.", 'Второй кандидат: каждый порядок встретился ровно дважды, поэтому поделили на два. Триста шестьдесят.', 'The second candidate: every order occurred exactly twice, so it was divided by two. Three hundred and sixty.'),
    A('write', "Diqqat: ayirish emas, bo'lish. Javobni yozing.", 'Внимание: не вычитание, а деление. Запиши ответ.', 'Careful: not subtraction but division. Write the answer.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: TAKRORLAR va JAMLANMA.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'sum_vs_product',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Takrorlarga bo\'linadi', 'Делим на повторы', 'Divide by the repeats'),
  cases: [
    {
      label: L('hammasi har xil', 'все разные', 'all different'),
      text: 'n!',
      tone: 'graph',
    },
    {
      label: L('k tasi bir xil', 'k одинаковых', 'k identical'),
      text: 'n! / k!',
      tone: 'accent',
    },
  ],
  rows: ['6! = 720', '720 / 2! = 360'],
  probe: {
    question: L(
      "Nega ayirilmaydi, balki bo'linadi?",
      'Почему делим, а не вычитаем?',
      'Why divide and not subtract?',
    ),
    items: [
      { id: 'a', label: L("har tartib bir necha marta sanalgan", 'каждый порядок сосчитан несколько раз', 'every order was counted several times'), correct: true },
      { id: 'b', label: L("ortiqcha tartiblar olib tashlanadi", 'лишние порядки убираются по одному', 'the extra orders are removed one by one'), hint: L("Bir nechta emas: har tartib ikki marta uchragan, ya'ni yarmi ortiqcha.", 'Не по одному: каждый порядок встретился дважды, то есть лишняя половина.', 'Not one by one: every order occurred twice, so half of them are extra.') },
      { id: 'c', label: L("bo'lish har doim to'g'ri", 'деление всегда верно', 'division is always right'), hint: L("Har doim emas: nechaga bo'lish takrorlar soniga bog'liq.", 'Не всегда: на сколько делить, зависит от числа повторов.', 'Not always: what you divide by depends on the number of repeats.') },
      { id: 'd', label: L("chunki javob katta chiqdi", 'потому что ответ вышел большим', 'because the answer came out large'), hint: L("Kattaligi sabab emas. Sabab nusxalarning soni.", 'Величина не причина. Причина в числе копий.', 'The size is not the reason. The reason is the number of copies.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Takrorlar', 'Правило 2. Повторы', 'Rule 2. Repeats'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'n! / (k₁! · k₂! · …)',
    lines: [
      L("avval hammasini har xil deb sanaymiz: n!", 'сначала считаем всё как разное: n!', 'first count everything as different: n!'),
      L("keyin har takror guruhga bo'lamiz", 'потом делим на каждую группу повторов', 'then divide by each group of repeats'),
      L("ayirish emas, bo'lish: har tartib bir necha marta sanalgan", 'не вычитание, а деление: каждый порядок сосчитан несколько раз', 'not subtraction but division: every order was counted several times'),
      L("takror yo'q bo'lsa, bo'linadigan narsa ham yo'q", 'если повторов нет, делить не на что', 'if there are no repeats, there is nothing to divide by'),
    ],
    example: L('misol:  6 kitob, 2 bir xil  →  720/2 = 360', 'пример:  6 книг, 2 одинаковые  →  720/2 = 360', 'example:  6 books, 2 identical  →  720/2 = 360'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'n! / (k₁! · k₂! · …)',
    lines: [
      L("1. VA bo'lsa ko'paytir, YOKI bo'lsa qo'sh", '1. если И, умножай; если ИЛИ, складывай', '1. if AND, multiply; if OR, add'),
      L("2. n ta buyumni joylashtirish n! usulda", '2. расставить n предметов это n!', '2. arranging n objects is n!'),
      L('3. bir xil buyumlar bo\'lsa, ularning faktorialiga bo\'l', '3. если есть одинаковые, дели на их факториал', '3. if some are identical, divide by their factorial'),
      L("4. javobni kichik songa qo'yib tekshir", '4. проверь ответ на маленьком числе', '4. check the answer on a small number'),
    ],
  },
  holds: [4000, 6000, 2900, 5000],
  audio: [
    A('mount', "Ikki holat ko'rildi. Endi qoidani to'ldiramiz.", 'Два случая разобраны. Теперь дополним правило.', 'Two cases are done. Now let us complete the rule.'),
    A('rows', "Avval hamma buyumni har xil deb sanaymiz va en faktorial olamiz. Keyin bir xil buyumlar bo'lsa, ularning faktorialiga bo'lamiz. Ikkita bir xil kitob uchun bu ikki faktorial, ya'ni ikki.", 'Сначала считаем все предметы разными и берём эн факториал. Потом, если есть одинаковые, делим на их факториал. Для двух одинаковых книг это два факториал, то есть два.', 'First we count all objects as different and take n factorial. Then, if some are identical, we divide by their factorial. For two identical books that is two factorial, that is two.'),
    A('q', "Savol: nega ayirilmaydi, balki bo'linadi?", 'Вопрос: почему делим, а не вычитаем?', 'The question: why divide and not subtract?'),
    A('rule', "To'g'ri. Har tartib roppa rosa ikki marta sanalgan, ya'ni ro'yxatning yarmi nusxa. Nusxalarni olib tashlash uchun bo'linadi.", 'Верно. Каждый порядок сосчитан ровно дважды, то есть половина списка это копии. Чтобы убрать копии, делят.', 'Correct. Every order was counted exactly twice, so half the list are copies. To remove copies you divide.'),
    A('both', 'Endi butun usulni bitta qoidaga yig\'ing.', 'А теперь собери весь способ в одно правило.', 'Now combine the whole method into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. KO'PAYTUVCHINI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'sum_vs_product',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Uchinchi ko\'paytuvchi', 'Третий множитель', 'The third factor'),
  left: L('5 odam navbatda', '5 человек в очереди', '5 people in a queue'),
  template: ['5 · 4 · ', { slot: 0 }, ' · 2 · 1'],
  signs: ['3', '5', '2'],
  answer: '3',
  checkNote: L(
    "Ikkita joy band, uchtasi qoldi",
    'Два места заняты, осталось три',
    'Two places are taken, three remain',
  ),
  wrongs: [
    { key: '5', hint: L("Beshta odamdan ikkitasi allaqachon navbatda turibdi: uchtasi qoldi.", 'Из пяти человек двое уже стоят в очереди: осталось трое.', 'Of the five people two are already in the queue: three remain.') },
    { key: '2', hint: L("Ikkilik keyingi o'rinda turibdi. Uchinchi qadamda uchta odam qolgan.", 'Двойка стоит следующей. На третьем шаге осталось три человека.', 'The two comes next. At the third step three people remain.') },
  ],
  probe: {
    question: L("Har qadamda son nega kamayadi?", 'Почему на каждом шаге число уменьшается?', 'Why does the number drop at each step?'),
    items: [
      { id: 'a', label: L("qo'yilgan odam ikkinchi marta tanlanmaydi", 'поставленный человек второй раз не выбирается', 'a placed person is not chosen again'), correct: true },
      { id: 'b', label: L("shunday qoida", 'такое правило', 'that is the rule'), hint: L("Qoida emas, sabab: odam allaqachon navbatda turibdi.", 'Не правило, а причина: человек уже стоит в очереди.', 'Not a rule but a reason: the person is already in the queue.') },
      { id: 'c', label: L("javob kichikroq bo'lsin uchun", 'чтобы ответ был меньше', 'to make the answer smaller'), hint: L("Javobning kattaligi maqsad emas.", 'Величина ответа не цель.', 'The size of the answer is not the goal.') },
      { id: 'd', label: L("odamlar ketib qoladi", 'люди уходят', 'people leave'), hint: L("Hech kim ketmaydi: ular navbatda qoladi, faqat joyi belgilangan.", 'Никто не уходит: они остаются в очереди, просто место уже определено.', 'Nobody leaves: they stay in the queue, only their place is fixed.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Uchinchi ko'paytuvchini qo'ying.", 'Поставь третий множитель.', 'Place the third factor.'),
    A('checked', "Bo'ldi. Endi ta'riflang: nega son kamayadi?", 'Получилось. Теперь сформулируй: почему число уменьшается?', 'Done. Now put it into words: why does the number drop?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'steps', label: L('qadamlarga ajratish', 'разбить на шаги', 'split into steps') },
  { id: 'mult', label: L("ko'paytirish", 'перемножить', 'multiply') },
  { id: 'div', label: L("takrorlarga bo'lish", 'поделить на повторы', 'divide by the repeats') },
  { id: 'add', label: L("qo'shish", 'сложить', 'add') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'sum_vs_product',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('5 odam navbatda', '5 человек в очереди', '5 people in a queue'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'steps',
      to: '5 · 4 · 3 · 2 · 1',
      wrongs: [
        { action: 'mult', hint: L("Avval qadamlarni yozing: har o'ringa nechta nomzod qolgan.", 'Сначала выпиши шаги: сколько кандидатов осталось на каждое место.', 'Write the steps first: how many candidates remain for each place.') },
        { action: 'div', hint: L("Bu yerda takror yo'q: hamma odam har xil.", 'Здесь повторов нет: все люди разные.', 'There are no repeats here: all the people are different.') },
        { action: 'add', hint: L("Qadamlar ketma ket, demak VA qoidasi ishlaydi.", 'Шаги идут подряд, значит работает правило И.', 'The steps follow one another, so the AND rule applies.') },
      ],
    },
    {
      action: 'mult',
      to: '= 120',
      wrongs: [
        { action: 'steps', hint: L("Qadamlar yozilgan.", 'Шаги уже выписаны.', 'The steps are written.') },
        { action: 'div', hint: L("Takror yo'q.", 'Повторов нет.', 'There are no repeats.') },
        { action: 'add', hint: L("Qo'shsangiz o'n besh chiqadi, va bu javob emas.", 'Сложишь и получишь пятнадцать, и это не ответ.', 'Adding gives fifteen, and that is not the answer.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['120', '15', '25', '24'],
    value: ['120'],
    label: L('usullar', 'способов', 'ways'),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '15', hint: L("Bu yig'indi. Qadamlar ketma ket, demak ko'paytiriladi.", 'Это сумма. Шаги идут подряд, значит умножаем.', 'That is the sum. The steps follow one another, so we multiply.') },
      { key: '24', hint: L("Bu to'rt faktorial. Odamlar esa beshta.", 'Это четыре факториал. А людей пятеро.', 'That is four factorial. But there are five people.') },
      { key: '*', hint: L("Besh karra to'rt karra uch karra ikki karra bir.", 'Пять на четыре на три на два на один.', 'Five times four times three times two times one.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi navbatni sanaymiz.', 'Правило сформулировано. Посчитаем очередь.', 'The rule is stated. Let us count the queue.'),
    A('start', "Diqqat: ro'yxatda ortiqcha amal bor. Nimadan boshlashni tanlang.", 'Внимание: в списке есть лишнее действие. Выбери, с чего начать.', 'Careful: the list has one superfluous action. Choose where to start.'),
    A('step3', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL: takrorli so'z.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'sum_vs_product',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Harflarni joylashtiring', 'Расставь буквы', 'Arrange the letters'),
  start: L('4 harf: ikkita A va ikkita N', '4 буквы: две A и две N', '4 letters: two A and two N'),
  actions: ACTIONS_10,
  hint: L(
    "Ikkita takror guruh bor, va har biriga alohida bo'linadi.",
    'Групп повторов две, и на каждую делится отдельно.',
    'There are two groups of repeats, and each divides separately.',
  ),
  steps: [
    {
      action: 'steps',
      to: '4 · 3 · 2 · 1 = 24',
      wrongs: [
        { action: 'div', hint: L("Avval hammasini har xil deb sanang.", 'Сначала посчитай всё как разное.', 'Count everything as different first.') },
        { action: 'mult', hint: L("Avval qadamlarni yozing.", 'Сначала выпиши шаги.', 'Write the steps first.') },
        { action: 'add', hint: L("Qadamlar ketma ket.", 'Шаги идут подряд.', 'The steps follow one another.') },
      ],
    },
    {
      action: 'div',
      to: '24 / (2 · 2) = 6',
      wrongs: [
        { action: 'steps', hint: L("Yozilgan.", 'Выписаны.', 'Written.') },
        { action: 'mult', hint: L("Ko'paytirildi: yigirma to'rt.", 'Уже перемножено: двадцать четыре.', 'Already multiplied: twenty four.') },
        { action: 'add', hint: L("Bu yerda qo'shish yo'q.", 'Здесь сложения нет.', 'There is no adding here.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['6', '12', '24', '4'],
    value: ['6'],
    label: L('so\'zlar', 'слов', 'words'),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '12', hint: L("Faqat bitta guruhga bo'lingan. Takror guruh ikkita: A lar va N lar.", 'Поделено только на одну группу. Групп повторов две: A и N.', 'Divided by one group only. There are two groups of repeats: the A and the N.') },
      { key: '24', hint: L("Takrorlar hisobga olinmagan: bir xil harflarning o'rnini almashtirsangiz, so'z o'zgarmaydi.", 'Повторы не учтены: поменяй одинаковые буквы местами, слово не изменится.', 'The repeats are ignored: swap the identical letters and the word stays the same.') },
      { key: '*', hint: L("Yigirma to'rtni ikkiga va yana ikkiga bo'ling.", 'Двадцать четыре подели на два и ещё на два.', 'Divide twenty four by two and by two again.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "To'rtta harf, va ular ikki juft bo'lib takrorlanadi. Diqqat: takror guruh bitta emas.", 'Четыре буквы, и они повторяются двумя парами. Внимание: группа повторов не одна.', 'Four letters, repeating in two pairs. Careful: there is more than one group of repeats.'),
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
      done: '4! = 24',
      prompt: L('4! nechaga teng?', 'Чему равен 4! ?', 'What is 4! ?'),
      items: [
        { id: 'a', label: '24', correct: true },
        { id: 'b', label: '10', hint: L("Bu yig'indi, faktorial esa ko'paytma.", 'Это сумма, а факториал это произведение.', 'That is the sum, and the factorial is a product.') },
        { id: 'c', label: '12', hint: L("To'rt karra uch bu o'n ikki, lekin ikki va bir ham qoladi.", 'Четыре на три это двенадцать, но остаются ещё два и один.', 'Four times three is twelve, but two and one remain.') },
        { id: 'd', label: '16', hint: L("Bu kvadrat, faktorial emas.", 'Это квадрат, а не факториал.', 'That is a square, not a factorial.') },
      ],
    },
    {
      id: 'b2', tag: 'sum_vs_product', ask: true, cols: 4,
      done: L('5 odam  →  120', '5 человек  →  120', '5 people  →  120'),
      prompt: L('5 odamni navbatga nechta usulda qo\'yish mumkin?', 'Сколькими способами поставить 5 человек в очередь?', 'In how many ways can 5 people be queued?'),
      items: [
        { id: 'a', label: '120', correct: true },
        { id: 'b', label: '25', hint: L("Bu besh karra besh. Har qadamda tanlov kamayadi.", 'Это пять на пять. На каждом шаге выбор сужается.', 'That is five times five. At each step the choice narrows.') },
        { id: 'c', label: '15', hint: L("Bu yig'indi.", 'Это сумма.', 'That is the sum.') },
        { id: 'd', label: '20', hint: L("Besh karra to'rt bu yigirma, lekin uch, ikki va bir ham bor.", 'Пять на четыре это двадцать, но есть ещё три, два и один.', 'Five times four is twenty, but three, two and one remain.') },
      ],
    },
    {
      id: 'b3', tag: 'sum_vs_product', ask: true, cols: 2,
      done: L("ko'paytirish", 'умножать', 'multiply'),
      prompt: L(
        "Tanlov qadamma qadam: qo'shishmi yoki ko'paytirish?",
        'Выбор по шагам: сложить или умножить?',
        'A choice in steps: add or multiply?',
      ),
      items: [
        { id: 'a', label: L("ko'paytirish", 'умножать', 'multiply'), correct: true },
        { id: 'b', label: L("qo'shish", 'складывать', 'add'), hint: L("Qo'shish YOKI holatida: bitta tanlov, bir necha ro'yxat.", 'Складывают при ИЛИ: один выбор, несколько списков.', 'Adding is for OR: one choice, several lists.') },
        { id: 'c', label: L("qadamga qarab", 'смотря по шагу', 'depends on the step'), hint: L("Hamma qadam ketma ket bo'lsa, hammasi ko'paytiriladi.", 'Если все шаги идут подряд, все умножаются.', 'If all the steps follow one another, they all multiply.') },
        { id: 'd', label: L('farqi yo\'q', 'без разницы', 'it makes no difference'), hint: L("Farqi bor: to'rtta buyumda o'n va yigirma to'rt.", 'Разница есть: на четырёх предметах десять и двадцать четыре.', 'There is a difference: at four objects ten and twenty four.') },
      ],
    },
    {
      id: 'b4', tag: 'check_by_point', ask: true, cols: 2,
      done: L('bu tasodif', 'это совпадение', 'a coincidence'),
      prompt: L(
        "3 buyumda ikkalasi ham 6 berdi. Usullar teng kuchlimi?",
        'На 3 оба дали 6. Способы равносильны?',
        'At 3 both gave 6. Are the methods equivalent?',
      ),
      items: [
        { id: 'a', label: L("yo'q, tasodif", 'нет, совпадение', 'no, a coincidence'), correct: true },
        { id: 'b', label: L('ha, teng kuchli', 'да, равносильны', 'yes, equivalent'), hint: L("To'rttada tekshiring: o'n va yigirma to'rt.", 'Проверь на четырёх: десять и двадцать четыре.', 'Check at four: ten and twenty four.') },
        { id: 'c', label: L("faqat kichik sonlarda", 'только для малых чисел', 'only for small numbers'), hint: L("Ikkitada ham ajraladi: uch va ikki.", 'На двух они тоже расходятся: три и два.', 'At two they part as well: three and two.') },
        { id: 'd', label: L("aniqlab bo'lmaydi", 'определить нельзя', 'it cannot be determined'), hint: L("Mumkin: boshqa songa qo'yib ko'ring.", 'Можно: подставь другое число.', 'It can: try another number.') },
      ],
    },
    {
      id: 'b5', tag: 'sum_vs_product', ask: true, cols: 4,
      done: L('4 kitob, 2 bir xil  →  12', '4 книги, 2 одинаковые  →  12', '4 books, 2 identical  →  12'),
      prompt: L('4 kitob, ikkitasi bir xil. Nechta tartib?', '4 книги, две одинаковые. Сколько порядков?', '4 books, two identical. How many orders?'),
      items: [
        { id: 'a', label: '12', correct: true },
        { id: 'b', label: '24', hint: L("Takrorlar hisobga olinmagan: ikkiga bo'lish kerak.", 'Повторы не учтены: надо поделить на два.', 'The repeats are ignored: divide by two.') },
        { id: 'c', label: '22', hint: L("Ayirish emas, bo'lish.", 'Не вычитание, а деление.', 'Not subtraction but division.') },
        { id: 'd', label: '6', hint: L("Ikkiga bo'linadi, to'rtga emas: takror guruh bitta.", 'Делим на два, а не на четыре: группа повторов одна.', 'Divide by two, not four: there is one group of repeats.') },
      ],
    },
    {
      id: 'b6', tag: 'sum_vs_product', ask: true, cols: 2,
      done: '1! = 1',
      prompt: L('1! nechaga teng?', 'Чему равен 1! ?', 'What is 1! ?'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '0', hint: L("Bitta buyumni bir usulda qo'yish mumkin, nol emas.", 'Один предмет можно поставить одним способом, а не нулём.', 'One object can be placed in one way, not zero.') },
        { id: 'c', label: L("aniqlanmagan", 'не определено', 'undefined'), hint: L("Aniqlangan: ko'paytmada bitta ko'paytuvchi qoladi.", 'Определено: в произведении остаётся один множитель.', 'It is defined: one factor remains in the product.') },
        { id: 'd', label: '2', hint: L("Ikkita tartib ikkita buyumda bo'ladi.", 'Два порядка бывает у двух предметов.', 'Two orders happen with two objects.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi navbat.", 'Теперь очередь.', 'Now the queue.'),
    A('q3', "Bu savol ikki qoida haqida.", 'Этот вопрос про два правила.', 'This question is about the two rules.'),
    A('q4', "Va bu tekshiruv haqida.", 'А этот про проверку.', 'And this one about checking.'),
    A('q5', "Takrorlar bilan.", 'С повторами.', 'With repeats.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: qo'shildi.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'sum_vs_product',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Arifmetika to'g'ri, amal xato", 'Арифметика верна, действие нет', 'The arithmetic is right, the operation is not'),
  rows: [
    { id: 'r1', text: L('6 kitob: birinchisi 6 usulda, ikkinchisi 5 usulda', '6 книг: первая 6 способами, вторая 5', '6 books: the first in 6 ways, the second in 5') },
    { id: 'r2', text: '6 + 5 + 4 + 3 + 2 + 1' },
    { id: 'r3', text: '= 21' },
    { id: 'r4', text: L('javob: 21 usul', 'ответ: 21 способ', 'answer: 21 ways') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu satr to'g'ri: har qadamda tanlov haqiqatan kamayadi.", 'Эта строка верна: на каждом шаге выбор действительно сужается.', 'This line is right: at each step the choice really does narrow.'),
    r3: L("Arifmetika to'g'ri: yig'indi haqiqatan yigirma bir. Xato oldingi satrda, amalda.", 'Арифметика верна: сумма действительно двадцать один. Ошибка строкой выше, в действии.', 'The arithmetic is right: the sum really is twenty one. The error is a line above, in the operation.'),
    r4: L("Javob xato, lekin u oldin xato bo'lgan.", 'Ответ неверный, но неверным он стал раньше.', 'The answer is wrong, but it became wrong earlier.'),
  },
  proofPoint: L('2 kitob: 2 tartib, yig\'indi esa 3', '2 книги: 2 порядка, а сумма даёт 3', '2 books: 2 orders, but the sum gives 3'),
  proof: L(
    "Kichik songa qo'yib tekshiramiz. Ikkita kitobni ikki xil tartibda qo'yish mumkin, buni barmoq bilan sanash mumkin. Bu yozuv esa ikki plyus bir, ya'ni uchta beradi. Uchinchi tartib yo'q, demak amal xato.",
    'Проверим на маленьком числе. Две книги можно поставить двумя способами, это считается пальцем. А эта запись даёт два плюс один, то есть три. Третьего порядка не существует, значит действие неверное.',
    'Let us check on a small number. Two books can be arranged in two ways, countable on fingers. But this record gives two plus one, that is three. There is no third order, so the operation is wrong.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("qadamlar qo'shilgan, ko'paytirilmagan", 'шаги сложены, а не перемножены', 'the steps were added, not multiplied'), correct: true },
      { id: 'b', label: L("sonlar noto'g'ri", 'числа неверны', 'the numbers are wrong'), hint: L("Sonlar to'g'ri: olti, besh, to'rt va shu tariqa.", 'Числа верны: шесть, пять, четыре и так далее.', 'The numbers are right: six, five, four and so on.') },
      { id: 'c', label: L("arifmetikada xato", 'ошибка в арифметике', 'an arithmetic error'), hint: L("Arifmetika to'g'ri, va aynan shu chalg'itadi.", 'Арифметика верна, и это как раз и сбивает.', 'The arithmetic is right, and that is exactly what misleads.') },
      { id: 'd', label: L("takrorlar hisobga olinmagan", 'не учтены повторы', 'the repeats were ignored'), hint: L("Bu yerda takror yo'q: hamma kitob har xil.", 'Здесь повторов нет: все книги разные.', 'There are no repeats here: all the books are different.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda birinchi satr to'g'ri va arifmetika ham to'g'ri. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь первая строка верна и арифметика верна. Найди строку, в которой ошибка появилась впервые.', 'Here the first line is right and the arithmetic is right. Find the line where the error first appeared.'),
    A('proof', "Tekshiruv kichik son bilan. Ikkita kitobni ikki xil tartibda qo'yish mumkin, buni barmoq bilan sanaymiz. Bu yozuv esa uchta beradi. Uchinchi tartib yo'q.", 'Проверка маленьким числом. Две книги можно поставить двумя способами, это считаем пальцем. А эта запись даёт три. Третьего порядка не существует.', 'A check with a small number. Two books can be arranged in two ways, counted on fingers. But this record gives three. There is no third order.'),
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
  targetValue: L("VA ko'paytma, YOKI yig'indi", 'И произведение, ИЛИ сумма', 'AND product, OR sum'),
  tasks: [
    {
      prompt: L("3 ko'ylak VA 4 shim", '3 рубашки И 4 брюк', '3 shirts AND 4 trousers'),
      template: ['N = ', { slot: 0 }, ' ', { slot: 1 }, ' 4'],
      parts: ['3', '·', '+', '7'],
      answer: ['3', '·'],
      doneLabel: '3 · 4 = 12',
      wrongs: [
        { key: '3|+', hint: L("Ikkala narsa ham tanlanadi, demak VA: ko'paytiriladi.", 'Выбирают обе вещи, значит И: умножаем.', 'Both items are chosen, so it is AND: multiply.') },
        { key: '*', hint: L("Birinchi songa uchtani, keyin amal belgisini qo'ying.", 'Поставь сначала тройку, потом знак действия.', 'Put the three first, then the operation sign.') },
      ],
    },
    {
      prompt: L('3 xil choy YOKI 4 xil kofe', '3 сорта чая ИЛИ 4 кофе', '3 teas OR 4 coffees'),
      template: ['N = ', { slot: 0 }, ' ', { slot: 1 }, ' 4'],
      parts: ['3', '+', '·', '12'],
      answer: ['3', '+'],
      doneLabel: '3 + 4 = 7',
      wrongs: [
        { key: '3|·', hint: L("Bitta ichimlik tanlanadi, demak YOKI: qo'shiladi.", 'Выбирают один напиток, значит ИЛИ: складываем.', 'One drink is chosen, so it is OR: add.') },
        { key: '*', hint: L("Bu yerda bitta tanlov, ikkita emas.", 'Здесь один выбор, а не два.', 'Here there is one choice, not two.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi, va u yerda so'z boshqa.", 'А теперь второе, и там другое слово.', 'And now the second one, and the word there is different.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'sum_vs_product',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'n! / (k₁! · k₂! · …)',
  ruleLines: [
    L("VA ko'paytiradi, YOKI qo'shadi", 'И умножает, ИЛИ складывает', 'AND multiplies, OR adds'),
    L("n ta buyumni joylashtirish n! usulda", 'расставить n предметов это n!', 'arranging n objects is n!'),
    L("bir xil buyumlar bo'lsa, ularning faktorialiga bo'linadi", 'если есть одинаковые, делим на их факториал', 'if some are identical, divide by their factorial'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('6 kitob javonda', '6 книг на полке', '6 books on a shelf'),
      right: '720',
      map: { a: '21', b: '720', both: '—', none: '—' },
    },
    {
      screen: 5,
      expr: L('6 kitob, 2 bir xil', '6 книг, 2 одинаковые', '6 books, 2 identical'),
      right: '360',
      map: { a: '360', b: '720', c: '180', d: '718' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '6 · 5 · 4 · 3 · 2 · 1 = 720',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Daraxt ekraniga qayting', 'Вернись к экрану с деревом', 'Go back to the tree screen'),
  },
  probe: {
    question: L(
      "Javobni qanday tekshirasiz, agar amalda ishonchingiz bo'lmasa?",
      'Как проверить себя, если не уверен в действии?',
      'How do you check yourself if unsure about the operation?',
    ),
    items: [
      { id: 'a', label: L("kichik songa qo'yib, barmoq bilan sanash", 'подставить маленькое число и посчитать пальцем', 'try a small number and count on fingers'), correct: true },
      { id: 'b', label: L('qayta sanash', 'посчитать заново', 'count again'), hint: L("O'sha amal o'sha xatoni takrorlaydi.", 'То же действие повторит ту же ошибку.', 'The same operation repeats the same mistake.') },
      { id: 'c', label: L('formulani eslash', 'вспомнить формулу', 'recall the formula'), hint: L("Formulani eslash ham xato bo'lishi mumkin. Sanoq esa aldamaydi.", 'Формулу можно вспомнить неверно. А пересчёт не обманет.', 'A formula can be misremembered. Counting will not deceive.') },
      { id: 'd', label: L('hech qanday', 'никак', 'there is no way'), hint: L("Bor: ikkita buyumda ikkala usul ham darrov ajraladi.", 'Есть: на двух предметах оба способа сразу расходятся.', 'There is: at two objects the two methods part at once.') },
    ],
  },
  sheetTitle: L("O'rin almashtirishlar · shpargalka", 'Перестановки · шпаргалка', 'Permutations · cheat sheet'),
  sheetSrc: L('11-sinf · 16-dars', '11 класс · урок 16', 'Grade 11 · lesson 16'),
  lifehack: L(
    "Amalda ikkilansangiz, ikkita buyumga qo'yib ko'ring: u yerda javob barmoq bilan sanaladi.",
    'Сомневаешься в действии — подставь два предмета: там ответ считается пальцем.',
    'Unsure about the operation? Try two objects: there the answer is countable on fingers.',
  ),
  holds: [2500, 7500, 7000, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Farq o'ttiz to'rt barobar edi, va uni daraxt hal qildi.", 'Вот твои прогнозы и вот как оказалось. Разница была в тридцать четыре раза, и решило её дерево.', 'Here are your guesses and here is how it turned out. The difference was thirty four times, and the tree settled it.'),
    A('rule', "Va mana asosiy fikr. Butun blok ikkita so'z atrofida: VA hamda YOKI. Tanlov qadamma qadam ketsa, ko'paytiriladi. Bitta tanlov bir necha ro'yxatdan bo'lsa, qo'shiladi. Qolgani texnika.", 'И вот главная мысль. Весь блок вокруг двух слов: И и ИЛИ. Если выбор идёт по шагам, умножаем. Если это один выбор из нескольких списков, складываем. Остальное техника.', 'And here is the main point. The whole block turns on two words: AND and OR. If the choice goes step by step, multiply. If it is one choice from several lists, add. The rest is technique.'),
    A('q', "Oxirgi savol: amalda ikkilansangiz nima qilasiz?", 'Последний вопрос: что делать, если сомневаешься в действии?', 'The last question: what to do if you are unsure about the operation?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
