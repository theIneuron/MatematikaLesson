// ============================================================================
// 11-sinf, Dars 20. EHTIMOLLIK.
//
// B3 blokining BESHINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/BLOK3_SKELET.md, «20-dars» bo'limi
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// SHU DARSDAN IKKINCHI ASBOB BOSHLANADI: yuzta katakcha (`FrequencyBoard`).
// Va metodist qarori 2026-08-15 kuchga kiradi: tushuntirish ODAMLAR bilan
// boradi, ulush esa keyin yozuv sifatida kiritiladi. Asos: ikki hodisali
// tajribada chastota formati 78 foiz to'g'ri javob bergan, ulush formati 23.
//
// DARSNING BITTA GAPI: ehtimollik bu ulush, chastota esa unga yaqinlashadi,
// lekin teng bo'lishi shart emas. Va tanga o'tmishni ESLAMAYDI.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_20',
  title: L('Ehtimollik', 'Вероятность', 'Probability'),
}

const BLOCK = { label: 'B3', from: 16, to: 24, current: 20 }

// Sinov rejimi uchun QAT'IY tartib: tasodif yo'q, aks holda har prog'on
// boshqa holat ko'rsatardi va «toza» degan javobga ishonib bo'lmasdi.
// Bu ketma-ketlikda birinchi 10 katakchadan 7 tasi «orol».
const ORDER = [
  0, 1, 2, 3, 4, 5, 6, 51, 52, 53, 7, 8, 9, 54, 55, 10, 11, 56, 57, 12,
  13, 14, 58, 59, 15, 16, 17, 60, 61, 18, 19, 62, 63, 20, 21, 22, 64, 65, 23, 24,
  25, 66, 67, 26, 27, 68, 69, 28, 29, 70, 71, 30, 31, 32, 72, 73, 33, 34, 74, 75,
  35, 36, 76, 77, 37, 38, 78, 79, 39, 40, 80, 81, 41, 42, 82, 83, 43, 44, 84, 85,
  45, 46, 86, 87, 47, 48, 88, 89, 49, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 50,
]

// ============================================================
// SLAYD 1. XUK. Yettita orol o'ntadan.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Ehtimollik', 'Вероятность', 'Probability'),
  title: L('Tanga qiyshiqmi', 'Монета кривая?', 'Is the coin crooked?'),
  expr: L('10 tashlash, 7 marta orol', '10 бросков, 7 раз орёл', '10 tosses, 7 heads'),
  rows: [
    {
      id: 'a',
      name: L('qiyshiq', 'кривая', 'crooked'),
      value: L('5 ta bo\'lishi kerak edi', 'должно быть 5', 'should have been 5'),
    },
    {
      id: 'b',
      name: L('normal', 'нормальная', 'normal'),
      value: L('shunday ham bo\'ladi', 'так тоже бывает', 'that happens too'),
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi tangani ko'p marta tashlaymiz.",
      'Твой ответ записан. Сейчас бросим монету много раз.',
      'Your answer is saved. Now we will toss the coin many times.',
    ),
    items: [
      { id: 'a', label: L('qiyshiq', 'кривая', 'crooked') },
      { id: 'b', label: L('normal', 'нормальная', 'normal') },
      { id: 'both', label: L('aniqlab bo\'lmaydi', 'определить нельзя', 'cannot be determined') },
      { id: 'none', label: L('savol noto\'g\'ri', 'вопрос неверный', 'the question is wrong') },
    ],
  },
  holds: [5500, 5000, 5000, 4000],
  audio: [
    A('mount', "To'rt dars sanadik: nechta variant bor. Bugun boshqa savol: ular ichida kerakli variant qanchalik tez-tez uchraydi.", 'Четыре урока мы считали, сколько вариантов. Сегодня другой вопрос: как часто среди них попадается нужный.', 'For four lessons we counted how many variants there are. Today a different question: how often the wanted one turns up among them.'),
    A('r1', "Birinchi javob: tanga qiyshiq. Ehtimollik yarim, demak o'nta tashlashda beshta orol bo'lishi kerak edi, yetti emas.", 'Первый ответ: монета кривая. Вероятность половина, значит на десяти бросках должно быть пять орлов, а не семь.', 'The first answer: the coin is crooked. The probability is a half, so ten tosses should give five heads, not seven.'),
    A('r2', "Ikkinchi javob: tanga normal, shunday ham bo'ladi. O'nta tashlash juda kam, va unda har xil natija chiqishi mumkin.", 'Второй ответ: монета нормальная, так тоже бывает. Десять бросков это очень мало, и в них может выйти что угодно.', 'The second answer: the coin is normal, that happens too. Ten tosses is very few, and anything can come out of them.'),
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
    "Uchta narsa kerak: qulay natijalar, hamma natijalar va ularning nisbati. Bu baholanmaydi.",
    'Нужны три вещи: благоприятные исходы, все исходы и их отношение. Это не оценивается.',
    'Three things are needed: the favourable outcomes, all outcomes and their ratio. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Hamma natijalar', 'Все исходы', 'All the outcomes'),
      short: L('nechta bo\'lishi mumkin', 'сколько всего может быть', 'how many there can be'),
      ex: [{ e: L('tanga: 2,   kubik: 6', 'монета: 2, кубик: 6', 'a coin: 2, a die: 6'), why: L('16-darsdagi sanoq', 'счёт из урока 16', 'the counting from lesson 16') }],
    },
    {
      id: 'c2',
      title: L('Qulay natijalar', 'Благоприятные исходы', 'The favourable outcomes'),
      short: L('bizga keraklilari', 'те, что нам нужны', 'the ones we want'),
      ex: [{ e: L('kubik, 4 dan katta: 5 va 6', 'кубик, больше 4: это 5 и 6', 'a die, above 4: that is 5 and 6'), why: L('ikkitasi', 'их два', 'there are two') }],
    },
    {
      id: 'c3',
      title: L('Ehtimollik bu ulush', 'Вероятность это доля', 'Probability is a share'),
      short: L('qulaylar bo\'lingan hammasi', 'благоприятные делить на все', 'favourable over all'),
      ex: [{ e: '2 / 6 = 1/3', why: L('100 tadan 33 ta deganidek', 'это как 33 из 100', 'like 33 out of 100') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('Kubikda nechta natija bor?', 'Сколько исходов у кубика?', 'How many outcomes does a die have?'),
      cols: 4,
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '2', hint: L("Ikkita natija tangada.", 'Два исхода у монеты.', 'Two outcomes belong to a coin.') },
        { id: 'c', label: '12', hint: L("Bu ikkita kubik.", 'Это два кубика.', 'That is two dice.') },
        { id: 'd', label: '1', hint: L("Kubik olti yoqli, har yoq alohida natija.", 'У кубика шесть граней, каждая отдельный исход.', 'A die has six faces, each a separate outcome.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('Kubikda 4 dan katta son: nechta natija qulay?', 'Кубик, больше 4: сколько благоприятных?', 'A die, above 4: how many are favourable?'),
      cols: 4,
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '3', hint: L("To'rtning o'zi kirmaydi: shart qat'iy katta.", 'Сама четвёрка не входит: условие строго больше.', 'The four itself is out: the condition is strictly greater.') },
        { id: 'c', label: '4', hint: L("Bu son, natijalar soni emas.", 'Это число, а не количество исходов.', 'That is the number, not the count of outcomes.') },
        { id: 'd', label: '6', hint: L("Oltitasi hammasi. Qulaylari esa faqat besh va olti.", 'Шесть это все. А благоприятны только пять и шесть.', 'Six is all of them. Only five and six are favourable.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('100 detaldan 8 tasi nuqsonli. Ulushi?', 'Из 100 деталей 8 бракованных. Доля?', '8 of 100 parts are faulty. The share?'),
      cols: 4,
      items: [
        { id: 'a', label: '0,08', correct: true },
        { id: 'b', label: '8', hint: L("Sakkiz bu soni. Ulush esa yuzga bo'linadi.", 'Восемь это количество. А доля делится на сто.', 'Eight is a count. A share is divided by a hundred.') },
        { id: 'c', label: '0,8', hint: L("Nol butun sakkiz bu yuztadan sakksonta.", 'Ноль целых восемь это восемьдесят из ста.', 'Zero point eight is eighty out of a hundred.') },
        { id: 'd', label: '0,92', hint: L("Bu soz detallar ulushi.", 'Это доля исправных.', 'That is the share of the good ones.') },
      ],
    },
  ],
  holds: [3000, 5000, 5000, 5000, 4500, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch: hamma natijalarni sanash. Tangada ikkita, kubikda oltita. Buni to'rt dars davomida qildik.", 'Первая опора: сосчитать все исходы. У монеты два, у кубика шесть. Этим мы занимались четыре урока.', 'The first basic: count all the outcomes. A coin has two, a die six. That is what we did for four lessons.'),
    A('c2', "Ikkinchi tayanch: qulay natijalar, ya'ni bizga keraklilari. Kubikda to'rtdan katta son ikkita: besh va olti.", 'Вторая опора: благоприятные исходы, то есть нужные нам. На кубике больше четырёх это два: пять и шесть.', 'The second basic: the favourable outcomes, the ones we want. On a die, above four means two: five and six.'),
    A('c3', "Uchinchi tayanch: ehtimollik bu ularning nisbati. Ikki bo'lingan olti, ya'ni bir uchdan. Buni odamlar tilida aytish qulayroq: yuz tashlashdan taxminan o'ttiz uchtasida.", 'Третья опора: вероятность это их отношение. Два делить на шесть, то есть одна треть. Удобнее сказать это на языке людей: примерно тридцать три раза из ста.', 'The third basic: probability is their ratio. Two over six, that is a third. It is handier said in the language of people: about thirty three times out of a hundred.'),
    A('recap', "Qisqacha: qulaylarni sanang, hammasini sanang, bo'ling.", 'Коротко: сосчитай благоприятные, сосчитай все, подели.', 'Briefly: count the favourable, count all, divide.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. O'NTA TASHLASH HECH NARSANI ISBOTLAMAYDI.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'frequency_vs_prob',
  eyebrow: L('Nechta tashlash kerak', 'Сколько нужно бросков', 'How many tosses are needed'),
  title: L('O\'nta yetarlimi', 'Достаточно ли десяти', 'Are ten enough'),
  expr: L('orol ulushi', 'доля орлов', 'the share of heads'),
  goal: L('ulush qayerda barqarorlashadi', 'где доля устаканивается', 'where the share settles'),
  rule: L(
    "Tashlashlar sonini oshirib boramiz va orol ulushini kuzatamiz.",
    'Будем увеличивать число бросков и смотреть на долю орлов.',
    'We increase the number of tosses and watch the share of heads.',
  ),
  pick: L('Nechta tashlash?', 'Сколько бросков?', 'How many tosses?'),
  claims: [
    { id: 'a', key: 'inA', name: L('qiyshiq', 'кривая', 'crooked'), value: L('7 dan 10 shubhali', '7 из 10 подозрительно', '7 of 10 is suspicious') },
    { id: 'b', key: 'inB', name: L('normal', 'нормальная', 'normal'), value: L('kam tashlash', 'мало бросков', 'too few tosses') },
  ],
  points: [
    {
      id: 'q1', label: '10', num: '10', step: 'calc', verdict: 'out',
      role: L('juda kam', 'очень мало', 'very few'),
      calc: L('7 orol,  ulush 0,70', '7 орлов, доля 0,70', '7 heads, share 0,70'),
      sol: false, inA: true, inB: true,
    },
    {
      id: 'q2', label: '50', num: '50', step: 'calc', verdict: 'in',
      role: L('yaqinlashyapti', 'приближается', 'getting closer'),
      calc: L('28 orol,  ulush 0,56', '28 орлов, доля 0,56', '28 heads, share 0,56'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: '100', num: '100', step: 'calc', verdict: 'in',
      role: L('yarimga yaqin', 'близко к половине', 'close to a half'),
      calc: L('51 orol,  ulush 0,51', '51 орёл, доля 0,51', '51 heads, share 0,51'),
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("O'nta tashlash nimani isbotlaydi?", 'Что доказывают десять бросков?', 'What do ten tosses prove?'),
    items: [
      {
        id: 'b', label: L('deyarli hech narsani', 'почти ничего', 'almost nothing'), correct: true,
        ok: L(
          "To'g'ri. Kam tashlashda ulush keng sakraydi. Yuztada esa u yarimga yopishadi.",
          'Верно. На малом числе бросков доля скачет широко. А на сотне она липнет к половине.',
          'Correct. With few tosses the share jumps widely. With a hundred it sticks to a half.',
        ),
      },
      {
        id: 'a', label: L('tanga qiyshiqligini', 'что монета кривая', 'that the coin is crooked'),
        hint: L("Yuztada ulush yarimga qaytdi. Qiyshiq tanga yuztada ham qiyshiq bo'lardi.", 'На сотне доля вернулась к половине. Кривая монета осталась бы кривой и на сотне.', 'At a hundred the share returned to a half. A crooked coin would stay crooked at a hundred too.'),
      },
      {
        id: 'both', label: L('tanga normalligini', 'что монета нормальная', 'that the coin is normal'),
        hint: L("O'nta tashlash buni ham isbotlamaydi: u juda kam.", 'Десять бросков и этого не доказывают: их слишком мало.', 'Ten tosses do not prove that either: there are too few.'),
      },
      {
        id: 'none', label: L('ehtimollik 0,7 ekanini', 'что вероятность 0,7', 'that the probability is 0,7'),
        hint: L("Chastota bu ehtimollik emas. Yuztada u nol butun ellik birga tushdi.", 'Частота это не вероятность. На сотне она упала до ноль целых пятьдесят один.', 'A frequency is not a probability. At a hundred it dropped to zero point five one.'),
      },
    ],
  },
  holds: [2500, 6500, 1500, 2500, 10000, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi bahsni hal qilamiz.', 'Опора восстановлена. Теперь решим спор.', 'The basics are back. Now let us settle the argument.'),
    A('mount', "Bahsni bitta usul hal qiladi: tashlashlar sonini oshirish va ulush nima qilishini kuzatish.", 'Спор решает один способ: увеличить число бросков и смотреть, что делает доля.', 'One way settles the argument: increase the number of tosses and watch what the share does.'),
    A('mount', "Nechta tashlashni tanlang.", 'Выбери, сколько бросков.', 'Choose how many tosses.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Uchta seriya. O'nta tashlashda ulush nol butun yetmish, ellikta tashlashda nol butun ellik olti, yuztada esa nol butun ellik bir. Ulush yarimga yopishib boryapti. Demak tanga normal, va o'nta tashlash shunchaki juda kam edi.", 'Три серии. На десяти бросках доля ноль целых семьдесят, на пятидесяти ноль целых пятьдесят шесть, на ста ноль целых пятьдесят один. Доля липнет к половине. Значит монета нормальная, а десять бросков просто слишком мало.', 'Three series. At ten tosses the share is zero point seventy, at fifty zero point fifty six, at a hundred zero point fifty one. The share sticks to a half. So the coin is normal, and ten tosses were simply too few.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: YUZTA KATAKCHA.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'frequency_vs_prob',
  eyebrow: L('Katakchalarni oching', 'Открывай клетки', 'Open the cells'),
  title: L('Ulush yarimga yopishadi', 'Доля липнет к половине', 'The share sticks to a half'),
  chip: L('100 tashlash', '100 бросков', '100 tosses'),
  cells: {
    total: 100,
    cols: 20,
    order: ORDER,
    groups: [
      { n: 51, tone: 'graph', label: L('orol', 'орёл', 'heads') },
      { n: 49, tone: 'accent', label: L('raqam', 'решка', 'tails') },
    ],
    caption: L('yuztadan 51 ta orol', 'из ста 51 орёл', '51 heads out of a hundred'),
    height: 130,
  },
  graphSteps: 3,
  bonus: L(
    "Birinchi o'nta katakchada orol yettita edi. Yuztada esa ellik bitta. Tanga o'zgarmadi, o'zgargani tashlashlar soni.",
    'В первых десяти клетках орлов было семь. А в ста пятьдесят один. Монета не изменилась, изменилось число бросков.',
    'In the first ten cells there were seven heads. In a hundred, fifty one. The coin did not change, the number of tosses did.',
  ),
  probe: {
    question: L("Nega birinchi o'nta katakchada ulush boshqacha edi?", 'Почему в первых десяти клетках доля была другой?', 'Why was the share different in the first ten cells?'),
    items: [
      { id: 'a', label: L("kam tashlashda ulush keng sakraydi", 'на малом числе бросков доля широко скачет', 'with few tosses the share jumps widely'), correct: true },
      { id: 'b', label: L("boshida tanga qiyshiq edi", 'сначала монета была кривой', 'at first the coin was crooked'), hint: L("Tanga bitta va o'zgarmagan. O'zgargani tashlashlar soni.", 'Монета одна и та же. Изменилось число бросков.', 'The coin is one and the same. The number of tosses changed.') },
      { id: 'c', label: L("katakchalar tartibi buzuq", 'клетки идут не по порядку', 'the cells are out of order'), hint: L("Tartib aralash, va bu ataylab: haqiqiy tashlashlar ham aralash keladi.", 'Порядок перемешан, и это нарочно: настоящие броски тоже идут вперемешку.', 'The order is mixed on purpose: real tosses come mixed too.') },
      { id: 'd', label: L("ehtimollik o'zgardi", 'вероятность изменилась', 'the probability changed'), hint: L("Ehtimollik o'zgarmaydi: u har tashlashda yarim.", 'Вероятность не меняется: она в каждом броске половина.', 'The probability does not change: it is a half at every toss.') },
    ],
  },
  holds: [4500, 5500, 6000, 7500],
  audio: [
    A('mount', "Uchta seriya sanaldi. Endi yuzta tashlashni katakchalarda ko'ramiz.", 'Три серии посчитаны. Теперь увидим сто бросков в клетках.', 'Three series counted. Now let us see a hundred tosses in cells.'),
    A('one', "Yuzta katakcha, har biri bitta tashlash. Ular birma bir ochiladi.", 'Сто клеток, каждая один бросок. Они открываются по одной.', 'A hundred cells, each one toss. They open one by one.'),
    A('two', "Birinchi o'ntasiga qarang: orol yettita. Aynan shu bahsni boshlagan edi.", 'Посмотри на первые десять: орлов семь. Именно с этого начался спор.', 'Look at the first ten: seven heads. That is exactly where the argument began.'),
    A('three', "Endi hammasi ochildi. Yuztadan ellik bitta orol, ya'ni ulush nol butun ellik bir. Yarimga juda yaqin. Tanga o'zgarmadi va u har doim normal edi: o'zgargani faqat tashlashlar soni. Bu qonun: tashlash ko'p bo'lgani sari chastota ehtimollikka yaqinlashadi.", 'Теперь открылись все. Из ста пятьдесят один орёл, то есть доля ноль целых пятьдесят один. Очень близко к половине. Монета не менялась и всегда была нормальной: изменилось только число бросков. Это закон: чем больше бросков, тем ближе частота к вероятности.', 'Now all are open. Fifty one heads out of a hundred, a share of zero point fifty one. Very close to a half. The coin never changed and was always normal: only the number of tosses did. This is a law: the more tosses, the closer the frequency to the probability.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1: EHTIMOLLIK BU ULUSH.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'frequency_vs_prob',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Ehtimollik bu ulush', 'Вероятность это доля', 'Probability is a share'),
  rows: [
    L('qulaylar / hammasi', 'благоприятные / все', 'favourable / all'),
    'P = 2 / 6 = 1/3',
  ],
  probe: {
    question: L(
      "Kubikda juft son tushish ehtimolligi?",
      'Вероятность выпадения чётного на кубике?',
      'The probability of an even number on a die?',
    ),
    items: [
      { id: 'a', label: '1/2', correct: true },
      { id: 'b', label: '1/6', hint: L("Bu bitta yoq. Juft sonlar esa uchta: ikki, to'rt, olti.", 'Это одна грань. А чётных три: два, четыре, шесть.', 'That is one face. But there are three even: two, four, six.') },
      { id: 'c', label: '1/3', hint: L("Uch bo'lingan olti bu yarim, uchdan bir emas.", 'Три делить на шесть это половина, а не треть.', 'Three over six is a half, not a third.') },
      { id: 'd', label: '3', hint: L("Ehtimollik birdan katta bo'lmaydi: bu ulush.", 'Вероятность не бывает больше единицы: это доля.', 'A probability is never above one: it is a share.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Ulush', 'Правило 1. Доля', 'Rule 1. The share'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('P = qulaylar / hammasi', 'P = благоприятные / все', 'P = favourable / all'),
    lines: [
      L("qulay natijalarni sanang", 'сосчитай благоприятные исходы', 'count the favourable outcomes'),
      L("hamma natijalarni sanang", 'сосчитай все исходы', 'count all the outcomes'),
      L("bo'ling: javob har doim 0 va 1 orasida", 'подели: ответ всегда между 0 и 1', 'divide: the answer is always between 0 and 1'),
      L("natijalar teng imkoniyatli bo'lishi kerak", 'исходы должны быть равновозможными', 'the outcomes must be equally likely'),
    ],
    example: L('misol:  P = 2/6 = 1/3', 'пример:  P = 2/6 = 1/3', 'example:  P = 2/6 = 1/3'),
  },
  holds: [4000, 6500, 4500],
  audio: [
    A('mount', "Katakchalarda ko'rdik. Endi ta'rifni yozamiz.", 'В клетках увидели. Теперь запишем определение.', 'We saw it in the cells. Now let us write the definition.'),
    A('def', "Ehtimollik bu qulay natijalar sonining hamma natijalar soniga nisbati. Kubikda to'rtdan katta son uchun bu ikki bo'lingan olti, ya'ni bir uchdan. Va bitta shart bor: natijalar teng imkoniyatli bo'lishi kerak, ya'ni kubik to'g'ri bo'lsin.", 'Вероятность это отношение числа благоприятных исходов к числу всех. Для числа больше четырёх на кубике это два делить на шесть, то есть одна треть. И есть одно условие: исходы должны быть равновозможными, то есть кубик правильный.', 'Probability is the ratio of the number of favourable outcomes to the number of all. For a number above four on a die that is two over six, a third. And there is one condition: the outcomes must be equally likely, that is, the die must be fair.'),
    A('rule', "To'g'ri. Va yodda tuting: javob har doim noldan birgacha. Birdan katta chiqsa, xato bor.", 'Верно. И запомни: ответ всегда от нуля до единицы. Вышло больше единицы, значит ошибка.', 'Correct. And remember: the answer is always between zero and one. Above one means a mistake.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: uchta raqam ketma-ket.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'frequency_vs_prob',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Uch marta raqam tushdi', 'Три раза подряд решка', 'Three tails in a row'),
  was: { label: UI.was, expr: L('100 tashlash  →  ulush 0,51', '100 бросков  →  доля 0,51', '100 tosses  →  share 0,51') },
  now: { label: UI.now, expr: L('3 marta raqam. To\'rtinchisi?', '3 раза решка. Четвёртый?', '3 tails. The fourth?') },
  probe1: {
    question: L('Nima o\'zgardi?', 'Что изменилось?', 'What has changed?'),
    items: [
      { id: 'a', label: L("hech narsa: tanga o'tmishni eslamaydi", 'ничего: монета не помнит прошлого', 'nothing: the coin does not remember'), correct: true },
      { id: 'b', label: L("endi orol tushishi kerak", 'теперь должен выпасть орёл', 'now heads must come up'), hint: L("Tanga oldingi uchta tashlashni bilmaydi: unda xotira yo'q.", 'Монета не знает о прошлых трёх бросках: у неё нет памяти.', 'The coin knows nothing of the past three tosses: it has no memory.') },
      { id: 'c', label: L("raqam ehtimolligi oshdi", 'вероятность решки выросла', 'the chance of tails grew'), hint: L("Ehtimollik har tashlashda bir xil: yarim.", 'Вероятность в каждом броске одна и та же: половина.', 'The probability is the same at every toss: a half.') },
      { id: 'd', label: L('tanga qiyshiq bo\'lib qoldi', 'монета стала кривой', 'the coin became crooked'), hint: L("Uch marta ketma ket bu normal: sakkiztadan bir marta uchraydi.", 'Три раза подряд это нормально: случается раз из восьми.', 'Three in a row is normal: it happens once in eight.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L("To'rtinchi tashlashda orol ehtimolligi?", 'Вероятность орла на четвёртом броске?', 'The chance of heads on the fourth toss?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '1/2' },
      { id: 'b', label: L("1/2 dan katta", 'больше 1/2', 'more than 1/2') },
      { id: 'c', label: '7/8' },
      { id: 'd', label: '1/16' },
    ],
  },
  holds: [4500, 7000, 1700, 3000],
  audio: [
    A('mount', "Yuzta tashlashda ulush yarimga yaqin chiqdi. Endi boshqa savol, va u eng mashhur xato bilan bog'liq.", 'На ста бросках доля вышла близкой к половине. Теперь другой вопрос, и он связан с самой известной ошибкой.', 'At a hundred tosses the share came out close to a half. Now a different question, tied to the most famous mistake.'),
    A('now', "Tanga uch marta ketma ket raqam berdi. Ko'pchilik shu yerda o'ylaydi: endi orol tushishi kerak, chunki muvozanat tiklanishi lozim. Lekin tanga oldingi tashlashlarni bilmaydi.", 'Монета три раза подряд дала решку. Многие думают здесь: теперь должен выпасть орёл, ведь равновесие обязано восстановиться. Но монета не знает о прошлых бросках.', 'The coin gave tails three times in a row. Many think here: now heads must come, since the balance must be restored. But the coin knows nothing of the past tosses.'),
    A('q1', "Nima o'zgardi?", 'Что изменилось?', 'What has changed?'),
    A('q2', 'Sizningcha to\'rtinchi tashlashda ehtimollik qanday? Shunchaki taxmin qiling.', 'Как думаешь, какая вероятность на четвёртом броске? Просто предположи.', 'What do you think the chance is on the fourth toss? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'frequency_vs_prob',
  eyebrow: L('Ikkalasini ham tekshiramiz', 'Проверим оба', 'Let us check both'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: L('3 marta raqam. 4-tashlash?', '3 раза решка. 4-й бросок?', '3 tails. The 4th toss?'),
  need: '= ?',
  answerLabel: L('ehtimollik', 'вероятность', 'the probability'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: L("orol ehtimolroq", 'орёл вероятнее', 'heads is likelier'),
      point: {
        label: L('muvozanat tiklanadi', 'равновесие восстановится', 'the balance restores'),
        calc: L('tanga eslamaydi   ✗', 'монета не помнит   ✗', 'the coin does not remember   ✗'),
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: '1/2',
      point: {
        label: L('har tashlash mustaqil', 'каждый бросок независим', 'each toss is independent'),
        calc: '1 / 2   ✓',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['1/2', '7/8', '1/16', '2/3'],
    value: ['1/2'],
    label: 'P =',
    prompt: L('Ehtimollikni yozing', 'Запиши вероятность', 'Write the probability'),
    wrongs: [
      { key: '7/8', hint: L("Yetti sakkizdan bu boshqa savolning javobi: to'rt tashlashda kamida bitta orol bo'lishi. Bizga esa to'rtinchi tashlashning o'zi kerak.", 'Семь восьмых это ответ на другой вопрос: хотя бы один орёл за четыре броска. А нам нужен сам четвёртый бросок.', 'Seven eighths answers a different question: at least one head in four tosses. But we need the fourth toss itself.') },
      { key: '1/16', hint: L("Bu to'rtta raqam ketma ket tushishi. Uchtasi allaqachon tushgan, ular endi savolga kirmaydi.", 'Это выпадение четырёх решек подряд. Три уже выпали, они в вопрос больше не входят.', 'That is four tails in a row. Three have already fallen and are no longer part of the question.') },
      { key: '*', hint: L("Tanga xotirasiz: har tashlashda ikkita teng natija.", 'Монета без памяти: в каждом броске два равных исхода.', 'The coin has no memory: two equal outcomes at every toss.') },
    ],
  },
  holds: [3500, 6500, 6000, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala javobni ham tekshiramiz.', 'Прогноз есть. Теперь проверим оба ответа.', 'The guess is made. Now let us check both answers.'),
    A('p1', "Birinchi nomzod: muvozanat tiklanishi kerak, demak orol ehtimolroq. Bu tuyg'u kuchli, lekin u noto'g'ri. Tangada xotira yo'q: u oldingi uchta tashlash haqida hech narsa bilmaydi.", 'Первый кандидат: равновесие должно восстановиться, значит орёл вероятнее. Это чувство сильное, но неверное. У монеты нет памяти: она ничего не знает о трёх прошлых бросках.', 'The first candidate: the balance must restore, so heads is likelier. That feeling is strong but wrong. The coin has no memory: it knows nothing of the three past tosses.'),
    A('p2', "Ikkinchi nomzod: har tashlash mustaqil, va ehtimollik yarim bo'lib qoladi. Uzoq seriyada ulush yarimga yaqinlashadi, lekin bu keyingi tashlashni majburlamaydi: shunchaki keyingi tashlashlar oldingilarini yuvib yuboradi.", 'Второй кандидат: каждый бросок независим, и вероятность остаётся половиной. В длинной серии доля приблизится к половине, но это не принуждает следующий бросок: просто дальнейшие броски размывают прошлые.', 'The second candidate: each toss is independent, and the probability stays a half. In a long series the share approaches a half, but that does not force the next toss: later tosses simply dilute the earlier ones.'),
    A('write', "Ehtimollikni yozing.", 'Запиши вероятность.', 'Write the probability.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: CHASTOTA va EHTIMOLLIK.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'frequency_vs_prob',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Chastota va ehtimollik', 'Частота и вероятность', 'Frequency and probability'),
  cases: [
    {
      label: L('ehtimollik', 'вероятность', 'probability'),
      text: L("o'zgarmas son", 'постоянное число', 'a constant number'),
      tone: 'graph',
    },
    {
      label: L('chastota', 'частота', 'frequency'),
      text: L('tajribadan chiqadi', 'выходит из опыта', 'comes from experiment'),
      tone: 'accent',
    },
  ],
  rows: [
    L('10 tashlash:  0,70', '10 бросков: 0,70', '10 tosses: 0,70'),
    L('100 tashlash:  0,51', '100 бросков: 0,51', '100 tosses: 0,51'),
  ],
  probe: {
    question: L(
      "Chastota ehtimollikka teng bo'ladimi?",
      'Бывает ли частота равна вероятности?',
      'Can the frequency equal the probability?',
    ),
    items: [
      { id: 'a', label: L("bo'lishi mumkin, lekin shart emas", 'может, но не обязана', 'it may, but need not'), correct: true },
      { id: 'b', label: L('har doim teng', 'всегда равна', 'always equal'), hint: L("O'nta tashlashda nol butun yetmish chiqdi, ehtimollik esa yarim.", 'На десяти бросках вышло ноль целых семьдесят, а вероятность половина.', 'At ten tosses zero point seventy came out, and the probability is a half.') },
      { id: 'c', label: L('hech qachon teng emas', 'никогда не равна', 'never equal'), hint: L("Teng bo'lishi mumkin: ikkita tashlashda bitta orol chiqsa, chastota roppa rosa yarim.", 'Может: если из двух бросков один орёл, частота ровно половина.', 'It can: one head in two tosses gives exactly a half.') },
      { id: 'd', label: L("faqat yuzta tashlashda", 'только на ста бросках', 'only at a hundred tosses'), hint: L("Yuztada ham roppa rosa emas edi: nol butun ellik bir.", 'На ста тоже было не ровно: ноль целых пятьдесят один.', 'At a hundred it was not exact either: zero point fifty one.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Ikki xil son', 'Правило 2. Два разных числа', 'Rule 2. Two different numbers'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('chastota → ehtimollik', 'частота → вероятность', 'frequency → probability'),
    lines: [
      L("ehtimollik hisoblanadi va o'zgarmaydi", 'вероятность вычисляется и не меняется', 'probability is computed and does not change'),
      L("chastota o'lchanadi va har seriyada boshqacha", 'частота измеряется и в каждой серии другая', 'frequency is measured and differs in each series'),
      L("tajriba ko'p bo'lgani sari chastota ehtimollikka yaqinlashadi", 'чем больше опытов, тем ближе частота к вероятности', 'the more trials, the closer the frequency to the probability'),
      L("tanga o'tmishni eslamaydi: har tashlash mustaqil", 'монета не помнит прошлого: каждый бросок независим', 'the coin has no memory: each toss is independent'),
    ],
    example: L('misol:  10 dan 7,  100 dan 51', 'пример:  7 из 10,  51 из 100', 'example:  7 of 10,  51 of 100'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('P = qulaylar / hammasi', 'P = благоприятные / все', 'P = favourable / all'),
    lines: [
      L("1. ehtimollik bu ulush, uni sanash mumkin", '1. вероятность это доля, её можно сосчитать', '1. probability is a share, it can be counted'),
      L("2. chastota bu tajriba natijasi, u sakraydi", '2. частота это результат опыта, она скачет', '2. frequency is an experimental result, it jumps'),
      L('3. tajriba ko\'paysa, chastota ehtimollikka yaqinlashadi', '3. больше опытов, ближе частота к вероятности', '3. more trials, the closer the frequency'),
      L("4. o'tmish keyingi tajribaga ta'sir qilmaydi", '4. прошлое не влияет на следующий опыт', '4. the past does not affect the next trial'),
    ],
  },
  holds: [4000, 6500, 2900, 5000],
  audio: [
    A('mount', "Ikki holat ko'rildi. Endi ikki so'zni ajratamiz, va bu darsning ikkinchi yarmi.", 'Два случая разобраны. Теперь разведём два слова, и это вторая половина урока.', 'Two cases are done. Now let us separate two words, and that is the second half of the lesson.'),
    A('rows', "Ehtimollik hisoblanadi: qulaylarni hammasiga bo'lamiz, va bu son o'zgarmaydi. Chastota esa o'lchanadi: tanga tashlanadi va sanaladi. Har seriyada u boshqacha chiqadi, va bu normal.", 'Вероятность вычисляется: делим благоприятные на все, и это число не меняется. А частота измеряется: монету бросают и считают. В каждой серии она выходит другой, и это нормально.', 'Probability is computed: divide the favourable by all, and that number does not change. Frequency is measured: the coin is tossed and counted. In each series it comes out different, and that is normal.'),
    A('q', "Savol: chastota ehtimollikka teng bo'ladimi?", 'Вопрос: бывает ли частота равна вероятности?', 'The question: can the frequency equal the probability?'),
    A('rule', "To'g'ri. Bo'lishi mumkin, lekin shart emas. Va eng muhimi: chastota ehtimollikdan uzoqlashgani tanganing aybi emas, bu tashlashlar kamligidan.", 'Верно. Может, но не обязана. И главное: если частота далека от вероятности, монета не виновата, дело в малом числе бросков.', 'Correct. It may, but need not. And the main thing: if the frequency is far from the probability, the coin is not to blame, the tosses are too few.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. ULUSHNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'frequency_vs_prob',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Maxrajni qo\'ying', 'Поставь знаменатель', 'Place the denominator'),
  left: L('kubik, 4 dan katta', 'кубик, больше 4', 'a die, above 4'),
  template: ['P = 2 / ', { slot: 0 }],
  signs: ['6', '2', '4'],
  answer: '6',
  checkNote: L(
    'Maxrajda HAMMA natijalar: kubikda oltita yoq',
    'В знаменателе ВСЕ исходы: у кубика шесть граней',
    'The denominator holds ALL outcomes: a die has six faces',
  ),
  wrongs: [
    { key: '2', hint: L("Ikkilik bu qulaylar soni, u suratda turibdi.", 'Двойка это число благоприятных, она стоит в числителе.', 'Two is the number of favourable, it stands in the numerator.') },
    { key: '4', hint: L("To'rtlik shartdagi son, natijalar soni emas.", 'Четвёрка это число из условия, а не количество исходов.', 'Four is a number from the problem, not a count of outcomes.') },
  ],
  probe: {
    question: L("Maxrajda nima turadi?", 'Что стоит в знаменателе?', 'What stands in the denominator?'),
    items: [
      { id: 'a', label: L('hamma natijalar soni', 'число всех исходов', 'the number of all outcomes'), correct: true },
      { id: 'b', label: L('qulay natijalar soni', 'число благоприятных', 'the number of favourable'), hint: L("Ular suratda: ehtimollik qulaylarni hammasiga bo'ladi.", 'Они в числителе: вероятность делит благоприятные на все.', 'They are in the numerator: probability divides favourable by all.') },
      { id: 'c', label: L('shartdagi son', 'число из условия', 'the number from the problem'), hint: L("Shartdagi son qulaylarni topishga yordam beradi, maxrajga tushmaydi.", 'Число из условия помогает найти благоприятные, в знаменатель оно не идёт.', 'The number from the problem helps find the favourable, it does not go into the denominator.') },
      { id: 'd', label: L('har doim 100', 'всегда 100', 'always 100'), hint: L("Yuzta bu qulay yozuv, lekin natijalar soni boshqacha bo'lishi mumkin.", 'Сто это удобная запись, но исходов может быть другое число.', 'A hundred is a handy form, but the outcomes may be a different number.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Maxrajni qo'ying.", 'Поставь знаменатель.', 'Place the denominator.'),
    A('checked', "Bo'ldi. Endi ta'riflang: maxrajda nima turadi?", 'Получилось. Теперь сформулируй: что стоит в знаменателе?', 'Done. Now put it into words: what stands in the denominator?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'all', label: L('hamma natijalarni sanash', 'сосчитать все исходы', 'count all outcomes') },
  { id: 'good', label: L('qulaylarni sanash', 'сосчитать благоприятные', 'count the favourable') },
  { id: 'div', label: L("bo'lish", 'поделить', 'divide') },
  { id: 'mult', label: L("ko'paytirish", 'умножить', 'multiply') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'frequency_vs_prob',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('savatda 3 qizil va 7 ko\'k shar', 'в корзине 3 красных и 7 синих шара', '3 red and 7 blue balls in a basket'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'all',
      to: '3 + 7 = 10',
      wrongs: [
        { action: 'good', hint: L("Avval hammasini sanang: maxraj shundan.", 'Сначала сосчитай все: из этого знаменатель.', 'Count all first: the denominator comes from that.') },
        { action: 'div', hint: L("Hali bo'linadigan narsa yo'q.", 'Пока делить нечего.', 'There is nothing to divide yet.') },
        { action: 'mult', hint: L("Ko'paytirish bu yerda kerak emas.", 'Умножение здесь не нужно.', 'Multiplying is not needed here.') },
      ],
    },
    {
      action: 'good',
      to: L('qizil: 3', 'красных: 3', 'red: 3'),
      wrongs: [
        { action: 'all', hint: L("Sanalgan: o'nta.", 'Посчитаны: десять.', 'Counted: ten.') },
        { action: 'div', hint: L("Avval qulaylarni aniqlang.", 'Сначала определи благоприятные.', 'Determine the favourable first.') },
        { action: 'mult', hint: L("Ko'paytirish kerak emas.", 'Умножение не нужно.', 'No multiplying.') },
      ],
    },
    {
      action: 'div',
      to: 'P = 3 / 10 = 0,3',
      wrongs: [
        { action: 'all', hint: L("Sanalgan.", 'Посчитаны.', 'Counted.') },
        { action: 'good', hint: L("Aniqlangan: uchta.", 'Определены: три.', 'Determined: three.') },
        { action: 'mult', hint: L("Bo'lish kerak, ko'paytirish emas.", 'Надо делить, а не умножать.', 'You must divide, not multiply.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['0,3', '0,7', '3', '0,43'],
    value: ['0,3'],
    label: 'P =',
    prompt: L('Ehtimollikni yozing', 'Запиши вероятность', 'Write the probability'),
    wrongs: [
      { key: '0,7', hint: L("Bu ko'k shar ehtimolligi. So'ralgani qizil.", 'Это вероятность синего шара. Спрашивали красный.', 'That is the chance of a blue ball. Red was asked.') },
      { key: '3', hint: L("Ehtimollik birdan katta bo'lmaydi: bu sharlar soni.", 'Вероятность не бывает больше единицы: это число шаров.', 'A probability is never above one: that is a count of balls.') },
      { key: '0,43', hint: L("Uchni yettiga bo'lgansiz. Maxrajda esa HAMMA sharlar: o'nta.", 'Здесь три поделено на семь. А в знаменателе ВСЕ шары: десять.', 'You divided three by seven. But the denominator holds ALL the balls: ten.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi savatdagi sharlarni sanaymiz.', 'Правило сформулировано. Посчитаем шары в корзине.', 'The rule is stated. Let us count the balls in the basket.'),
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
  tag: 'frequency_vs_prob',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Kubikda tub son', 'Простое число на кубике', 'A prime on a die'),
  start: L('kubik. Tub son tushish ehtimolligi?', 'кубик. Вероятность простого числа?', 'a die. The chance of a prime?'),
  actions: ACTIONS_10,
  hint: L(
    "Tub sonlar: 2, 3, 5. Bir tub emas.",
    'Простые: 2, 3, 5. Единица не простое.',
    'Primes: 2, 3, 5. One is not prime.',
  ),
  steps: [
    {
      action: 'all',
      to: '6',
      wrongs: [
        { action: 'good', hint: L("Avval hammasini.", 'Сначала все.', 'All of them first.') },
        { action: 'div', hint: L("Hali erta.", 'Пока рано.', 'Too early.') },
        { action: 'mult', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
    {
      action: 'good',
      to: '2, 3, 5   →   3',
      wrongs: [
        { action: 'all', hint: L("Sanalgan: oltita.", 'Посчитаны: шесть.', 'Counted: six.') },
        { action: 'div', hint: L("Avval tub sonlarni toping.", 'Сначала найди простые.', 'Find the primes first.') },
        { action: 'mult', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
    {
      action: 'div',
      to: 'P = 3 / 6 = 1/2',
      wrongs: [
        { action: 'all', hint: L("Sanalgan.", 'Посчитаны.', 'Counted.') },
        { action: 'good', hint: L("Topilgan: uchta.", 'Найдены: три.', 'Found: three.') },
        { action: 'mult', hint: L("Bo'linadi.", 'Делится.', 'It divides.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['1/2', '1/3', '2/3', '1/6'],
    value: ['1/2'],
    label: 'P =',
    prompt: L('Ehtimollikni yozing', 'Запиши вероятность', 'Write the probability'),
    wrongs: [
      { key: '2/3', hint: L("To'rtta tub son sanalgan. Bir tub emas: uning faqat bitta bo'luvchisi bor.", 'Посчитано четыре простых. Единица не простое: у неё только один делитель.', 'Four primes were counted. One is not prime: it has only one divisor.') },
      { key: '1/3', hint: L("Ikkita tub son sanalgan. Uchtasi bor: ikki, uch, besh.", 'Посчитано два простых. Их три: два, три, пять.', 'Two primes were counted. There are three: two, three, five.') },
      { key: '*', hint: L("Uchta tub son oltita natijadan.", 'Три простых из шести исходов.', 'Three primes out of six outcomes.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Kubik va tub sonlar. Diqqat: bir tub son emas.", 'Кубик и простые числа. Внимание: единица не простое число.', 'A die and prime numbers. Careful: one is not a prime.'),
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
      id: 'b1', tag: 'frequency_vs_prob', ask: true, cols: 4,
      done: 'P = 1/6',
      prompt: L('Kubikda 3 tushish ehtimolligi?', 'Вероятность выпадения 3 на кубике?', 'The chance of a 3 on a die?'),
      items: [
        { id: 'a', label: '1/6', correct: true },
        { id: 'b', label: '1/3', hint: L("Uchlik bu yoqning nomeri, natijalar soni emas.", 'Тройка это номер грани, а не число исходов.', 'Three is the face number, not a count of outcomes.') },
        { id: 'c', label: '3/6', hint: L("Bitta yoq qulay, uchta emas.", 'Благоприятна одна грань, а не три.', 'One face is favourable, not three.') },
        { id: 'd', label: '1/2', hint: L("Yarim bu tangada.", 'Половина это у монеты.', 'A half belongs to a coin.') },
      ],
    },
    {
      id: 'b2', tag: 'frequency_vs_prob', ask: true, cols: 4,
      done: L('100 dan 8  →  0,08', 'из 100 8  →  0,08', '8 of 100  →  0,08'),
      prompt: L('100 detaldan 8 tasi nuqsonli. P?', 'Из 100 деталей 8 бракованных. P?', '8 of 100 parts are faulty. P?'),
      items: [
        { id: 'a', label: '0,08', correct: true },
        { id: 'b', label: '0,8', hint: L("Bu yuztadan sakksonta.", 'Это восемьдесят из ста.', 'That is eighty out of a hundred.') },
        { id: 'c', label: '8', hint: L("Ehtimollik birdan katta bo'lmaydi.", 'Вероятность не бывает больше единицы.', 'A probability is never above one.') },
        { id: 'd', label: '0,92', hint: L("Bu soz detallar ulushi.", 'Это доля исправных.', 'That is the share of the good ones.') },
      ],
    },
    {
      id: 'b3', tag: 'frequency_vs_prob', ask: true, cols: 2,
      done: L("yo'q, tanga eslamaydi", 'нет, монета не помнит', 'no, the coin does not remember'),
      prompt: L(
        "5 marta orol tushdi. Endi raqam ehtimolroqmi?",
        '5 раз подряд орёл. Теперь решка вероятнее?',
        '5 heads in a row. Is tails likelier now?',
      ),
      items: [
        { id: 'a', label: L("yo'q, ehtimollik o'sha yarim", 'нет, вероятность та же половина', 'no, the probability is still a half'), correct: true },
        { id: 'b', label: L('ha, muvozanat tiklanadi', 'да, равновесие восстановится', 'yes, the balance restores'), hint: L("Tangada xotira yo'q. Uzoq seriyada ulush yarimga keladi, lekin keyingi tashlash majburlanmaydi.", 'У монеты нет памяти. В длинной серии доля придёт к половине, но следующий бросок не принуждается.', 'The coin has no memory. In a long series the share comes to a half, but the next toss is not forced.') },
        { id: 'c', label: L('ha, tanga qiyshiq', 'да, монета кривая', 'yes, the coin is crooked'), hint: L("Besh marta ketma ket bu o'ttiz ikkidan bir marta: kam, lekin normal.", 'Пять подряд это один раз из тридцати двух: редко, но нормально.', 'Five in a row is once in thirty two: rare but normal.') },
        { id: 'd', label: L("aniqlab bo'lmaydi", 'определить нельзя', 'cannot be determined'), hint: L("Mumkin: har tashlash mustaqil.", 'Можно: каждый бросок независим.', 'It can: each toss is independent.') },
      ],
    },
    {
      id: 'b4', tag: 'frequency_vs_prob', ask: true, cols: 2,
      done: L('chastota va ehtimollik boshqa', 'частота и вероятность разное', 'frequency and probability differ'),
      prompt: L(
        "20 tashlashda 13 orol. Ehtimollik 0,65 mi?",
        '20 бросков, 13 орлов. Вероятность 0,65 ?',
        '20 tosses, 13 heads. Is the probability 0,65 ?',
      ),
      items: [
        { id: 'a', label: L("yo'q, bu chastota", 'нет, это частота', 'no, that is the frequency'), correct: true },
        { id: 'b', label: L('ha, tajriba shuni berdi', 'да, опыт так показал', 'yes, the experiment showed it'), hint: L("Tajriba chastotani beradi. Ehtimollik esa hisoblanadi va yarimga teng.", 'Опыт даёт частоту. А вероятность вычисляется и равна половине.', 'The experiment gives the frequency. The probability is computed and equals a half.') },
        { id: 'c', label: L('ha, agar tanga qiyshiq bo\'lsa', 'да, если монета кривая', 'yes, if the coin is crooked'), hint: L("Yigirma tashlash qiyshiqlikni isbotlamaydi.", 'Двадцать бросков кривизну не доказывают.', 'Twenty tosses do not prove crookedness.') },
        { id: 'd', label: L("aniqlab bo'lmaydi", 'определить нельзя', 'cannot be determined'), hint: L("Mumkin: to'g'ri tanganing ehtimolligi yarim, sanoq bilan.", 'Можно: у правильной монеты вероятность половина, по счёту.', 'It can: a fair coin has probability a half, by counting.') },
      ],
    },
    {
      id: 'b5', tag: 'frequency_vs_prob', ask: true, cols: 4,
      done: 'P = 0,3',
      prompt: L('10 shardan 3 tasi qizil. P?', 'Из 10 шаров 3 красных. P?', '3 of 10 balls are red. P?'),
      items: [
        { id: 'a', label: '0,3', correct: true },
        { id: 'b', label: '0,7', hint: L("Bu qizil bo'lmagan sharlar ulushi.", 'Это доля не красных.', 'That is the share of the non-red.') },
        { id: 'c', label: '3', hint: L("Bu sharlar soni.", 'Это число шаров.', 'That is a count of balls.') },
        { id: 'd', label: '0,43', hint: L("Uchni yettiga emas, o'nga bo'ling.", 'Три подели на десять, а не на семь.', 'Divide three by ten, not by seven.') },
      ],
    },
    {
      id: 'b6', tag: 'frequency_vs_prob', ask: true, cols: 2,
      done: L("tashlashni ko'paytirish", 'увеличить число бросков', 'increase the tosses'),
      prompt: L(
        "Chastotani ehtimollikka yaqinlashtirish uchun nima qilish kerak?",
        'Что сделать, чтобы частота приблизилась к вероятности?',
        'What brings the frequency closer to the probability?',
      ),
      items: [
        { id: 'a', label: L("tajribalar sonini oshirish", 'увеличить число опытов', 'increase the number of trials'), correct: true },
        { id: 'b', label: L("tangani almashtirish", 'поменять монету', 'change the coin'), hint: L("Tanga aybdor emas: yuzta tashlashda u yarimni berdi.", 'Монета не виновата: на ста бросках она дала половину.', 'The coin is not to blame: at a hundred tosses it gave a half.') },
        { id: 'c', label: L("boshqacha tashlash", 'бросать по-другому', 'toss differently'), hint: L("Tashlash usuli natijaga ta'sir qilmaydi.", 'Способ броска на результат не влияет.', 'How you toss does not affect the result.') },
        { id: 'd', label: L('hech narsa yordam bermaydi', 'ничего не поможет', 'nothing helps'), hint: L("Yordam beradi: yuztada ulush nol butun ellik birga tushdi.", 'Помогает: на ста доля стала ноль целых пятьдесят один.', 'It helps: at a hundred the share became zero point fifty one.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi odamlar tilida.", 'Теперь на языке людей.', 'Now in the language of people.'),
    A('q3', "Mashhur xato.", 'Знаменитая ошибка.', 'The famous mistake.'),
    A('q4', "Ikki so'zni ajrating.", 'Разведи два слова.', 'Separate the two words.'),
    A('q5', "Sharlar.", 'Шары.', 'The balls.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: chastota ehtimollik deb yozilgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'frequency_vs_prob',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Sanoq to'g'ri, xulosa xato", 'Счёт верный, вывод нет', 'Right counting, wrong conclusion'),
  rows: [
    { id: 'r1', text: L('tanga 20 marta tashlandi', 'монету бросили 20 раз', 'the coin was tossed 20 times') },
    { id: 'r2', text: L('orol 13 marta tushdi', 'орёл выпал 13 раз', 'heads came up 13 times') },
    { id: 'r3', text: '13 / 20 = 0,65' },
    { id: 'r4', text: L('javob: P(orol) = 0,65', 'ответ: P(орёл) = 0,65', 'answer: P(heads) = 0,65') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Bu o'lchov natijasi, u ham to'g'ri.", 'Это результат измерения, он тоже верен.', 'That is a measurement result, it is right too.'),
    r3: L("Bo'lish to'g'ri bajarilgan: o'n uch bo'lingan yigirma haqiqatan nol butun oltmish besh. Bu CHASTOTA.", 'Деление выполнено верно: тринадцать делить на двадцать действительно ноль целых шестьдесят пять. Это ЧАСТОТА.', 'The division is right: thirteen over twenty really is zero point sixty five. That is the FREQUENCY.'),
  },
  proofPoint: L('P hisoblanadi, o\'lchanmaydi', 'P вычисляется, а не измеряется', 'P is computed, not measured'),
  proof: L(
    "Uchala satr ham to'g'ri, xato oxirgisida: chastota ehtimollik deb atalgan. Ehtimollik tajribadan olinmaydi, u sanaladi: tangada ikkita teng natija, demak yarim. Nol butun oltmish besh esa shu yigirma tashlashning natijasi, boshqa yigirmatasida u boshqacha bo'ladi.",
    'Все три строки верны, ошибка в последней: частоту назвали вероятностью. Вероятность не берётся из опыта, она считается: у монеты два равных исхода, значит половина. А ноль целых шестьдесят пять это результат именно этих двадцати бросков, в других двадцати он будет другим.',
    'All three lines are right, the error is in the last: the frequency was called a probability. Probability is not taken from experiment, it is counted: a coin has two equal outcomes, so a half. And zero point sixty five is the result of these twenty tosses, another twenty will differ.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("chastota ehtimollik deb atalgan", 'частоту назвали вероятностью', 'the frequency was called a probability'), correct: true },
      { id: 'b', label: L("bo'lish noto'g'ri", 'деление выполнено неверно', 'the division is wrong'), hint: L("Bo'lish to'g'ri: o'n uch bo'lingan yigirma nol butun oltmish besh.", 'Деление верно: тринадцать делить на двадцать это ноль целых шестьдесят пять.', 'The division is right: thirteen over twenty is zero point sixty five.') },
      { id: 'c', label: L("tashlashlar noto'g'ri sanalgan", 'броски посчитаны неверно', 'the tosses were counted wrongly'), hint: L("Sanoq shartdan olingan, unga ishonamiz.", 'Счёт взят из условия, ему мы верим.', 'The count comes from the problem, we trust it.') },
      { id: 'd', label: L('tanga qiyshiq', 'монета кривая', 'the coin is crooked'), hint: L("Yigirma tashlash buni isbotlamaydi.", 'Двадцать бросков этого не доказывают.', 'Twenty tosses do not prove that.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda hamma sanoq to'g'ri. Va shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь весь счёт верный. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Here all the counting is right. And still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Qarang: nol butun oltmish besh bu chastota, va u to'g'ri sanalgan. Lekin ehtimollik tajribadan olinmaydi. Uni sanash kerak: ikkita teng natija, demak yarim.", 'Смотри: ноль целых шестьдесят пять это частота, и она посчитана верно. Но вероятность не берётся из опыта. Её надо сосчитать: два равных исхода, значит половина.', 'Look: zero point sixty five is the frequency, correctly computed. But probability is not taken from experiment. It must be counted: two equal outcomes, so a half.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'frequency_vs_prob',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Ulushni yig\'ing', 'Собери долю', 'Build the share'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L("javob 0 va 1 orasida", 'ответ между 0 и 1', 'the answer is between 0 and 1'),
  tasks: [
    {
      prompt: L('kubik, juft son', 'кубик, чётное число', 'a die, an even number'),
      template: ['P = ', { slot: 0 }, ' / ', { slot: 1 }],
      parts: ['3', '6', '2', '1'],
      answer: ['3', '6'],
      doneLabel: '3 / 6 = 1/2',
      wrongs: [
        { key: '2|6', hint: L("Juft sonlar uchta: ikki, to'rt, olti.", 'Чётных три: два, четыре, шесть.', 'There are three even: two, four, six.') },
        { key: '*', hint: L("Suratda qulaylar, maxrajda hammasi.", 'В числителе благоприятные, в знаменателе все.', 'The favourable in the numerator, all in the denominator.') },
      ],
    },
    {
      prompt: L('10 shar, 3 qizil', '10 шаров, 3 красных', '10 balls, 3 red'),
      template: ['P = ', { slot: 0 }, ' / ', { slot: 1 }],
      parts: ['3', '10', '7', '13'],
      answer: ['3', '10'],
      doneLabel: '3 / 10 = 0,3',
      wrongs: [
        { key: '3|7', hint: L("Maxrajda HAMMA sharlar: o'nta, yettita emas.", 'В знаменателе ВСЕ шары: десять, а не семь.', 'The denominator holds ALL the balls: ten, not seven.') },
        { key: '*', hint: L("Qizillar uchta, hammasi o'nta.", 'Красных три, всего десять.', 'Three red, ten in all.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi, va u yerda maxraj chalg'itadi.", 'А теперь второе, и там знаменатель сбивает.', 'And now the second one, where the denominator misleads.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'frequency_vs_prob',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: L('P = qulaylar / hammasi', 'P = благоприятные / все', 'P = favourable / all'),
  ruleLines: [
    L("ehtimollik hisoblanadi, chastota o'lchanadi", 'вероятность вычисляется, частота измеряется', 'probability is computed, frequency is measured'),
    L("tajriba ko'paysa, chastota yaqinlashadi", 'больше опытов, ближе частота', 'more trials, the closer the frequency'),
    L("tanga o'tmishni eslamaydi", 'монета не помнит прошлого', 'the coin does not remember the past'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('10 dan 7 orol', '7 орлов из 10', '7 heads of 10'),
      right: L('normal', 'нормальная', 'normal'),
      map: {
        a: L('qiyshiq', 'кривая', 'crooked'),
        b: L('normal', 'нормальная', 'normal'),
        both: L("aniqlab bo'lmaydi", 'нельзя определить', 'cannot be determined'),
        none: '—',
      },
    },
    {
      screen: 5,
      expr: L('3 raqamdan keyin', 'после 3 решек', 'after 3 tails'),
      right: '1/2',
      map: { a: '1/2', b: '> 1/2', c: '7/8', d: '1/16' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('10 dan 7 → 0,70;   100 dan 51 → 0,51', '7 из 10 → 0,70;   51 из 100 → 0,51', '7 of 10 → 0,70;   51 of 100 → 0,51'),
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Katakchalar ekraniga qayting', 'Вернись к экрану с клетками', 'Go back to the cells screen'),
  },
  probe: {
    question: L(
      "Nega tushuntirish odamlar bilan boshlandi, ulush bilan emas?",
      'Почему объяснение шло людьми, а не долями?',
      'Why did the explanation go in people, not shares?',
    ),
    items: [
      { id: 'a', label: L("yuztadan sakksonta deyish osonroq tushuniladi", 'восемьдесят из ста понимается легче', 'eighty out of a hundred is easier to grasp'), correct: true },
      { id: 'b', label: L('ulushlar qiyinroq sanaladi', 'доли труднее считать', 'shares are harder to compute'), hint: L("Sanash bir xil. Farq tushunishda: katakchalarni ko'rish mumkin.", 'Считать одинаково. Разница в понимании: клетки можно увидеть.', 'The counting is the same. The difference is in understanding: cells can be seen.') },
      { id: 'c', label: L('shunchaki odat', 'просто привычка', 'just a habit'), hint: L("Odat emas: shu formatda xato uch barobar kam bo'ladi.", 'Не привычка: в этом формате ошибок втрое меньше.', 'Not a habit: this format makes three times fewer errors.') },
      { id: 'd', label: L('ulushlar noto\'g\'ri', 'доли неверны', 'shares are wrong'), hint: L("Ulushlar to'g'ri, ular shunchaki keyinroq kiritiladi.", 'Доли верны, они просто вводятся позже.', 'Shares are right, they are simply introduced later.') },
    ],
  },
  sheetTitle: L('Ehtimollik · shpargalka', 'Вероятность · шпаргалка', 'Probability · cheat sheet'),
  sheetSrc: L('11-sinf · 20-dars', '11 класс · урок 20', 'Grade 11 · lesson 20'),
  lifehack: L(
    "Javob birdan katta chiqdimi, demak surat va maxraj almashib ketgan.",
    'Ответ вышел больше единицы, значит числитель и знаменатель поменялись местами.',
    'If the answer came out above one, the numerator and denominator swapped places.',
  ),
  holds: [2500, 7000, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Tanga normal edi: o'nta tashlash shunchaki juda kam.", 'Вот твои прогнозы и вот как оказалось. Монета была нормальной: десять бросков просто слишком мало.', 'Here are your guesses and here is how it turned out. The coin was normal: ten tosses are simply too few.'),
    A('rule', "Va mana asosiy fikr. Ikkita boshqa son bor. Ehtimollik hisoblanadi va o'zgarmaydi. Chastota o'lchanadi va har seriyada boshqacha. Tajriba ko'paysa, ikkinchisi birinchisiga yaqinlashadi. Va tanga o'tmishni eslamaydi: bu eng qimmat xato.", 'И вот главная мысль. Есть два разных числа. Вероятность вычисляется и не меняется. Частота измеряется и в каждой серии другая. Чем больше опытов, тем ближе вторая к первой. И монета не помнит прошлого: это самая дорогая ошибка.', 'And here is the main point. There are two different numbers. Probability is computed and does not change. Frequency is measured and differs in each series. The more trials, the closer the second to the first. And the coin does not remember the past: that is the most expensive mistake.'),
    A('q', "Oxirgi savol: nega tushuntirish odamlar bilan boshlandi?", 'Последний вопрос: почему объяснение шло людьми?', 'The last question: why did the explanation go in people?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
