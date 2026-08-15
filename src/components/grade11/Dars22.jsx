// ============================================================================
// 11-sinf, Dars 22. O'RTACHA, MODA, MEDIANA.
//
// B3 blokining YETTINCHI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/BLOK3_SKELET.md, «22-dars» bo'limi
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// DARSNING BITTA GAPI: uchta son uchta HAR XIL savolga javob beradi, va
// «o'rtacha» ko'pincha so'ralmagan savolga javob bo'ladi.
//
// Asbob: `FrequencyBoard` ustunlar rejimida. O'quvchi ustunni olib tashlaydi
// va ko'radi: o'rtacha siljiydi, mediana esa joyida qoladi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_22',
  title: L("O'rtacha, moda, mediana", 'Среднее, мода, медиана', 'Mean, mode, median'),
}

const BLOCK = { label: 'B3', from: 16, to: 24, current: 22 }

// ============================================================
// SLAYD 1. XUK. Kim yolg'on gapiryapti.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L("O'rtacha, moda, mediana", 'Среднее, мода, медиана', 'Mean, mode, median'),
  title: L('Kim yolg\'on gapiryapti', 'Кто врёт', 'Who is lying'),
  expr: L("o'rtacha 560", 'среднее 560', 'mean 560'),
  rows: [
    {
      id: 'a',
      name: L('direktor', 'директор', 'the director'),
      value: L("o'rtacha 560", 'среднее 560', 'the mean is 560'),
    },
    {
      id: 'b',
      name: L('ishchilar', 'рабочие', 'the workers'),
      value: L('bizda 200', 'у нас 200', 'we get 200'),
    },
  ],
  probe: {
    question: L("Kim yolg'on gapiryapti?", 'Кто врёт?', 'Who is lying?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi maoshlarni ustunlarda ko'ramiz.",
      'Твой ответ записан. Сейчас увидим зарплаты столбиками.',
      'Your answer is saved. Now we will see the wages as bars.',
    ),
    items: [
      { id: 'a', label: L('direktor', 'директор', 'the director') },
      { id: 'b', label: L('ishchilar', 'рабочие', 'the workers') },
      { id: 'both', label: L('ikkalasi ham', 'оба', 'both') },
      { id: 'none', label: L('hech kim', 'никто', 'nobody') },
    ],
  },
  holds: [5500, 5000, 4500, 4000],
  audio: [
    A('mount', "Ikki dars ehtimollik haqida edi. Bugun boshqa narsa: bir qator sonni bitta son bilan tasvirlash. Va bu yerda eng ko'p aldashadi.", 'Два урока были про вероятность. Сегодня другое: описать ряд чисел одним числом. И вот здесь обманывают чаще всего.', 'Two lessons were about probability. Today something else: describing a row of numbers with one number. And this is where deception happens most.'),
    A('r1', "Firmada o'n kishi ishlaydi. Direktor aytadi: o'rtacha maosh besh yuz oltmish.", 'В фирме работают десять человек. Директор говорит: средняя зарплата пятьсот шестьдесят.', 'A firm employs ten people. The director says: the mean wage is five hundred and sixty.'),
    A('r2', "Ishchilar aytadi: bizda ikki yuzdan. Va ularning sakkiztasi bor.", 'Рабочие говорят: у нас по двести. И их восемь человек.', 'The workers say: we get two hundred each. And there are eight of them.'),
    A('ask', "Sizningcha kim yolg'on gapiryapti? Hozircha shunchaki taxmin qiling.", 'Как думаешь, кто врёт? Пока просто предположи.', 'Who do you think is lying? Just make a guess for now.'),
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
    "Uchta so'z bor, va ular uchta har xil savolga javob beradi. Bu baholanmaydi.",
    'Есть три слова, и они отвечают на три разных вопроса. Это не оценивается.',
    'There are three words, and they answer three different questions. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L("O'rtacha", 'Среднее', 'The mean'),
      short: L("hammasini teng bo'lsak", 'если разделить поровну', 'if shared equally'),
      ex: [{ e: L("yig'indi / soni", 'сумма / количество', 'sum / count'), why: L('bitta katta son uni tortadi', 'одно большое число тянет его', 'one big number pulls it') }],
    },
    {
      id: 'c2',
      title: L('Mediana', 'Медиана', 'The median'),
      short: L("o'rtada turgan", 'тот, кто посередине', 'the one in the middle'),
      ex: [{ e: L('tartiblab, markazdagi', 'упорядочить и взять центр', 'sort and take the centre'), why: L('chekka sonlar unga ta\'sir qilmaydi', 'крайние числа на неё не влияют', 'the extremes do not affect it') }],
    },
    {
      id: 'c3',
      title: L('Moda', 'Мода', 'The mode'),
      short: L('eng ko\'p uchraydigan', 'что встречается чаще', 'the most frequent'),
      ex: [{ e: L('eng baland ustun', 'самый высокий столбик', 'the tallest bar'), why: L('bir necha bo\'lishi mumkin', 'их может быть несколько', 'there can be several') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L("3, 5, 5, 7, 10 ning o'rtachasi?", 'Среднее для 3, 5, 5, 7, 10 ?', 'The mean of 3, 5, 5, 7, 10 ?'),
      cols: 4,
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '5', hint: L("Bu mediana va moda. O'rtacha esa yig'indini soniga bo'ladi: o'ttiz bo'lingan besh.", 'Это медиана и мода. А среднее делит сумму на количество: тридцать на пять.', 'That is the median and mode. The mean divides the sum by the count: thirty over five.') },
        { id: 'c', label: '30', hint: L("Bu yig'indi. Uni beshga bo'lish kerak.", 'Это сумма. Её надо поделить на пять.', 'That is the sum. It must be divided by five.') },
        { id: 'd', label: '7', hint: L("O'ttiz bo'lingan besh bu olti.", 'Тридцать делить на пять это шесть.', 'Thirty over five is six.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('O\'sha qatorning medianasi?', 'Медиана того же ряда?', 'The median of the same row?'),
      cols: 4,
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '6', hint: L("Bu o'rtacha. Mediana esa markazda turgan son: uchinchisi.", 'Это среднее. А медиана это число в центре: третье.', 'That is the mean. The median is the number in the centre: the third.') },
        { id: 'c', label: '7', hint: L("Beshta sondan markazdagisi uchinchisi, to'rtinchisi emas.", 'Из пяти чисел центральное третье, а не четвёртое.', 'Of five numbers the central one is the third, not the fourth.') },
        { id: 'd', label: '10', hint: L("Bu eng kattasi.", 'Это самое большое.', 'That is the largest.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('O\'sha qatorning modasi?', 'Мода того же ряда?', 'The mode of the same row?'),
      cols: 4,
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '10', hint: L("Moda bu eng ko'p uchraydigan son, eng katta emas.", 'Мода это самое частое число, а не самое большое.', 'The mode is the most frequent number, not the largest.') },
        { id: 'c', label: '2', hint: L("Ikkilik bu nechta marta uchragani, sonning o'zi emas.", 'Двойка это сколько раз встретилось, а не само число.', 'Two is how many times it occurred, not the number itself.') },
        { id: 'd', label: '6', hint: L("Bu o'rtacha, va u qatorda umuman yo'q.", 'Это среднее, и в ряду его вообще нет.', 'That is the mean, and it is not in the row at all.') },
      ],
    },
  ],
  holds: [3000, 5000, 5000, 4500, 4500, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi so'z: o'rtacha. Bu hamma narsani teng bo'lganda har kimga tegadigan son. Yig'indini soniga bo'lamiz.", 'Первое слово: среднее. Это число, которое досталось бы каждому, если всё поделить поровну. Сумму делим на количество.', 'The first word: the mean. It is what everyone would get if all were shared equally. Divide the sum by the count.'),
    A('c2', "Ikkinchi so'z: mediana. Sonlarni tartiblab, markazdagisini olamiz. Chekkadagi juda katta yoki juda kichik sonlar unga ta'sir qilmaydi.", 'Второе слово: медиана. Упорядочиваем числа и берём центральное. Крайние очень большие или очень маленькие на неё не влияют.', 'The second word: the median. Sort the numbers and take the central one. Extreme large or small values do not affect it.'),
    A('c3', "Uchinchi so'z: moda. Bu eng ko'p uchraydigan son, ustunlarda eng balandi.", 'Третье слово: мода. Это самое частое число, на столбиках самое высокое.', 'The third word: the mode. It is the most frequent number, the tallest bar.'),
    A('recap', "Uchtasi ham qatorni bitta son bilan tasvirlaydi, lekin har biri o'zicha.", 'Все три описывают ряд одним числом, но каждое по-своему.', 'All three describe the row with one number, but each in its own way.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. MAOSHLARNI SANAYMIZ.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'mean_vs_median',
  eyebrow: L('Uchala sonni sanaymiz', 'Посчитаем все три', 'Let us compute all three'),
  title: L('Bir qator, uchta son', 'Один ряд, три числа', 'One row, three numbers'),
  expr: '200 · 8,   1500,   2500',
  goal: L('kim haq ekanini aniqlash', 'выяснить, кто прав', 'find out who is right'),
  rule: L(
    "Uchala sonni ham sanaymiz va solishtiramiz.",
    'Посчитаем все три числа и сравним.',
    'Let us compute all three numbers and compare.',
  ),
  pick: L('Qaysi sonni sanaymiz?', 'Какое число посчитаем?', 'Which number shall we compute?'),
  claims: [
    { id: 'a', key: 'inA', name: L('direktor', 'директор', 'the director'), value: '560' },
    { id: 'b', key: 'inB', name: L('ishchilar', 'рабочие', 'the workers'), value: '200' },
  ],
  points: [
    {
      id: 'q1', label: L("o'rtacha", 'среднее', 'the mean'), num: '560', step: 'calc', verdict: 'in',
      role: L('direktor haq', 'директор прав', 'the director is right'),
      calc: '5600 / 10 = 560',
      sol: true, inA: true, inB: false,
    },
    {
      id: 'q2', label: L('mediana', 'медиана', 'the median'), num: '200', step: 'calc', verdict: 'in',
      role: L('ishchilar haq', 'рабочие правы', 'the workers are right'),
      calc: L('markazda 200', 'в центре 200', '200 in the centre'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: L('moda', 'мода', 'the mode'), num: '200', step: 'calc', verdict: 'in',
      role: L('eng ko\'p uchraydi', 'встречается чаще всего', 'the most frequent'),
      calc: L('200 sakkiz marta', '200 восемь раз', '200 eight times'),
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Kim yolg'on gapiryapti?", 'Кто врёт?', 'Who is lying?'),
    items: [
      {
        id: 'none', label: L('hech kim', 'никто', 'nobody'), correct: true,
        ok: L(
          "To'g'ri. Uchala son ham to'g'ri sanalgan. Ular shunchaki har xil savolga javob beradi.",
          'Верно. Все три числа посчитаны верно. Они просто отвечают на разные вопросы.',
          'Correct. All three numbers are computed correctly. They simply answer different questions.',
        ),
      },
      {
        id: 'a', label: L('direktor', 'директор', 'the director'),
        hint: L("O'rtacha haqiqatan besh yuz oltmish: yig'indi besh ming olti yuz, odam o'nta.", 'Среднее действительно пятьсот шестьдесят: сумма пять тысяч шестьсот, людей десять.', 'The mean really is five hundred and sixty: the sum is five thousand six hundred, ten people.'),
      },
      {
        id: 'b', label: L('ishchilar', 'рабочие', 'the workers'),
        hint: L("Ular ham haq: sakkiz kishida haqiqatan ikki yuzdan, va mediana ham ikki yuz.", 'Они тоже правы: у восьми действительно по двести, и медиана тоже двести.', 'They are right too: eight really get two hundred, and the median is two hundred as well.'),
      },
      {
        id: 'both', label: L('ikkalasi ham', 'оба', 'both'),
        hint: L("Ikkalasi ham to'g'ri son aytgan. Yolg'on emas, savol boshqa.", 'Оба назвали верное число. Это не ложь, это другой вопрос.', 'Both named a correct number. Not a lie, a different question.'),
      },
    ],
  },
  holds: [2500, 6500, 1500, 2500, 10500, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi maoshlarni sanaymiz.', 'Опора восстановлена. Теперь посчитаем зарплаты.', 'The basics are back. Now let us compute the wages.'),
    A('mount', "O'n kishi: sakkiztasida ikki yuzdan, bittasida ming besh yuz, bittasida ikki ming besh yuz. Uchala sonni ham sanab ko'ramiz.", 'Десять человек: у восьми по двести, у одного полторы тысячи, у одного две с половиной. Посчитаем все три числа.', 'Ten people: eight get two hundred, one gets fifteen hundred, one gets twenty five hundred. Let us compute all three numbers.'),
    A('mount', "Qaysi sonni sanashni tanlang.", 'Выбери, какое число посчитать.', 'Choose which number to compute.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Uchala son ham sanaldi. O'rtacha besh yuz oltmish: yig'indi besh ming olti yuzni o'nga bo'ldik. Mediana ikki yuz: tartiblab markazga qarasak, u yerda ikki yuz turibdi. Moda ham ikki yuz: u sakkiz marta uchraydi. Hech kim yolg'on gapirmagan. Direktor bitta savolga javob berdi, ishchilar boshqasiga.", 'Все три числа посчитаны. Среднее пятьсот шестьдесят: сумму пять тысяч шестьсот поделили на десять. Медиана двести: упорядочили и посмотрели в центр, там двести. Мода тоже двести: оно встречается восемь раз. Никто не соврал. Директор ответил на один вопрос, рабочие на другой.', 'All three numbers computed. The mean is five hundred and sixty: the sum five thousand six hundred divided by ten. The median is two hundred: sorted and looked at the centre, two hundred there. The mode is two hundred too: it occurs eight times. Nobody lied. The director answered one question, the workers another.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: USTUNLAR.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'mean_vs_median',
  eyebrow: L('Ustunlarga qarang', 'Посмотри на столбики', 'Look at the bars'),
  title: L('Ikkita ustun o\'rtachani tortadi', 'Два столбика тянут среднее', 'Two bars pull the mean'),
  chip: L('10 maosh', '10 зарплат', '10 wages'),
  cells: {
    mode: 'bars',
    bars: [
      { label: '200', n: 8, tone: 'graph' },
      { label: '1500', n: 1, tone: 'accent' },
      { label: '2500', n: 1, tone: 'accent' },
    ],
    barMax: 9,
    caption: L("mediana 200,   o'rtacha 560", 'медиана 200,   среднее 560', 'median 200,   mean 560'),
    height: 140,
  },
  cellSteps: 3,
  bonus: L(
    "Sakkiz kishi bitta ustunda turibdi, ikkitasi esa chetda. Aynan shu ikkitasi o'rtachani ikki yuzdan besh yuz oltmishgacha ko'taradi. Medianaga esa ular umuman ta'sir qilmaydi.",
    'Восемь человек стоят в одном столбике, двое в стороне. Именно эти двое поднимают среднее с двухсот до пятисот шестидесяти. А на медиану они не влияют вообще.',
    'Eight people stand in one bar, two off to the side. Those two lift the mean from two hundred to five hundred and sixty. The median they do not affect at all.',
  ),
  probe: {
    question: L("Eng katta maoshni olib tashlasak, nima o'zgaradi?", 'Если убрать самую большую зарплату, что изменится?', 'If the largest wage is removed, what changes?'),
    items: [
      { id: 'a', label: L("o'rtacha tushadi, mediana joyida qoladi", 'среднее упадёт, медиана останется', 'the mean drops, the median stays'), correct: true },
      { id: 'b', label: L('ikkalasi ham tushadi', 'упадут оба', 'both drop'), hint: L("Mediana markazda turgan sondan olinadi, va u hamon ikki yuz.", 'Медиана берётся из центрального числа, и оно по-прежнему двести.', 'The median comes from the central number, and it is still two hundred.') },
      { id: 'c', label: L('hech narsa', 'ничего', 'nothing'), hint: L("O'rtacha o'zgaradi: yig'indi kamayadi, odamlar ham.", 'Среднее изменится: сумма уменьшится, и людей тоже.', 'The mean changes: the sum drops, and so does the count.') },
      { id: 'd', label: L('faqat moda', 'только мода', 'only the mode'), hint: L("Moda o'sha ikki yuz: u sakkiz marta uchraydi.", 'Мода та же двести: она встречается восемь раз.', 'The mode is still two hundred: it occurs eight times.') },
    ],
  },
  holds: [4500, 5500, 6500, 7000],
  audio: [
    A('mount', "Sonlar sanaldi. Endi ularni ustunlarda ko'ramiz.", 'Числа посчитаны. Теперь увидим их столбиками.', 'The numbers are computed. Now let us see them as bars.'),
    A('one', "Birinchi ustun: ikki yuzlik maosh, va unda sakkiz kishi. Bu firmaning asosiy qismi.", 'Первый столбик: зарплата двести, и в нём восемь человек. Это основная часть фирмы.', 'The first bar: the wage of two hundred, with eight people in it. That is the bulk of the firm.'),
    A('two', "Yana ikkita ustun chetda turibdi: ming besh yuz va ikki ming besh yuz, har birida bitta odam.", 'Ещё два столбика стоят в стороне: полторы тысячи и две с половиной, в каждом по одному человеку.', 'Two more bars stand aside: fifteen hundred and twenty five hundred, one person in each.'),
    A('three', "Va mana asosiysi. Aynan shu ikki odam o'rtachani ko'taradi: ularsiz u ikki yuzga yaqin bo'lardi. Mediana esa ularni sezmaydi, chunki u faqat markazda kim turganiga qaraydi. Shuning uchun maoshlar haqida gapirganda mediana rostroq.", 'И вот главное. Именно эти два человека поднимают среднее: без них оно было бы около двухсот. А медиана их не замечает, потому что смотрит только на то, кто стоит в центре. Поэтому про зарплаты честнее говорит медиана.', 'And here is the main thing. Those two people lift the mean: without them it would be near two hundred. The median does not notice them, because it looks only at who stands in the centre. That is why the median is the honest one about wages.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'mean_vs_median',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Uch savol, uch son', 'Три вопроса, три числа', 'Three questions, three numbers'),
  rows: [
    L("o'rtacha: teng bo'lsak nima tegadi", 'среднее: сколько если поровну', 'mean: how much if shared equally'),
    L('mediana: markazda kim turibdi', 'медиана: кто стоит в центре', 'median: who stands in the centre'),
  ],
  probe: {
    question: L(
      "Maoshlar haqida qaysi son rostroq gapiradi?",
      'Какое число честнее говорит о зарплатах?',
      'Which number speaks more honestly about wages?',
    ),
    items: [
      { id: 'a', label: L('mediana', 'медиана', 'the median'), correct: true },
      { id: 'b', label: L("o'rtacha", 'среднее', 'the mean'), hint: L("O'rtacha to'g'ri, lekin ikkita katta maosh uni tortib ketdi: o'n kishidan sakkiztasi undan kam oladi.", 'Среднее верно, но две большие зарплаты его утянули: восемь из десяти получают меньше него.', 'The mean is correct, but two big wages pulled it: eight of ten get less than it.') },
      { id: 'c', label: L('moda', 'мода', 'the mode'), hint: L("Bu safar moda ham ikki yuz, lekin u har doim ishonchli emas: eng ko'p uchragani chekkada ham bo'lishi mumkin.", 'На этот раз мода тоже двести, но она не всегда надёжна: самое частое может оказаться и с краю.', 'This time the mode is two hundred too, but it is not always reliable: the most frequent can sit at the edge.') },
      { id: 'd', label: L('uchalasi ham teng', 'все три одинаково', 'all three equally'), hint: L("Teng emas: o'rtacha besh yuz oltmish, mediana ikki yuz. Farq deyarli uch barobar.", 'Не одинаково: среднее пятьсот шестьдесят, медиана двести. Разница почти втрое.', 'Not equally: the mean is five hundred and sixty, the median two hundred. Almost threefold.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Uch son', 'Правило 1. Три числа', 'Rule 1. Three numbers'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L("o'rtacha = yig'indi / soni", 'среднее = сумма / количество', 'mean = sum / count'),
    lines: [
      L("o'rtacha: hammani tenglashtirsak nima tegadi", 'среднее: сколько досталось бы каждому поровну', 'the mean: what each would get if shared equally'),
      L("mediana: tartiblab markazdagi son", 'медиана: центральное число упорядоченного ряда', 'the median: the central number of the sorted row'),
      L("moda: eng ko'p uchraydigan qiymat", 'мода: самое частое значение', 'the mode: the most frequent value'),
      L("chekkadagi katta sonlar o'rtachani tortadi, medianani emas", 'крайние большие числа тянут среднее, а не медиану', 'extreme large values pull the mean, not the median'),
    ],
    example: L('misol:  5600 / 10 = 560', 'пример:  5600 / 10 = 560', 'example:  5600 / 10 = 560'),
  },
  holds: [4000, 6500, 5000],
  audio: [
    A('mount', "Ustunlarda ko'rdik. Endi uchala so'zni ham yozib qo'yamiz.", 'На столбиках увидели. Теперь запишем все три слова.', 'We saw it on the bars. Now let us write down all three words.'),
    A('def', "O'rtacha javob beradi: agar hamma narsani teng bo'lsak, har kimga qancha tegadi. Mediana boshqa savolga: qatorning markazida kim turibdi. Moda uchinchisiga: qaysi qiymat eng ko'p uchraydi. Uchtasi ham to'g'ri, lekin savollar har xil.", 'Среднее отвечает: сколько досталось бы каждому, если всё поделить поровну. Медиана на другой вопрос: кто стоит в центре ряда. Мода на третий: какое значение встречается чаще всего. Все три верны, но вопросы разные.', 'The mean answers: how much each would get if everything were shared equally. The median answers another: who stands in the centre of the row. The mode a third: which value occurs most often. All three are correct, but the questions differ.'),
    A('rule', "To'g'ri. Maoshlar, narxlar, uy qiymatlari haqida gapirganda mediana rostroq: chunki bir nechta juda katta qiymat o'rtachani ko'tarib yuboradi.", 'Верно. Про зарплаты, цены, стоимость жилья честнее говорит медиана: несколько очень больших значений задирают среднее.', 'Correct. About wages, prices and house values the median is the honest one: a few very large values push the mean up.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: ustunni olib tashlaymiz.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'mean_vs_median',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Eng katta maosh ketdi', 'Самая большая зарплата ушла', 'The largest wage is gone'),
  was: { label: UI.was, expr: L("10 kishi:  o'rtacha 560,  mediana 200", '10 человек: среднее 560, медиана 200', '10 people: mean 560, median 200') },
  now: { label: UI.now, expr: L('2500 ketdi.  Endi nima?', '2500 ушла. Что теперь?', '2500 is gone. What now?') },
  probe1: {
    question: L('Mediana bilan nima bo\'ladi?', 'Что будет с медианой?', 'What happens to the median?'),
    items: [
      { id: 'a', label: L("o'sha 200 bo'lib qoladi", 'останется те же 200', 'it stays the same 200'), correct: true },
      { id: 'b', label: L('u ham tushadi', 'она тоже упадёт', 'it drops too'), hint: L("Markazda hamon ikki yuz turibdi: to'qqizta sondan beshinchisi.", 'В центре по-прежнему двести: пятое из девяти чисел.', 'The centre still holds two hundred: the fifth of nine numbers.') },
      { id: 'c', label: L("u ko'tariladi", 'она вырастет', 'it rises'), hint: L("Katta sonni olib tashlash medianani ko'tarmaydi.", 'Убрав большое число, медиану не поднять.', 'Removing a large value does not raise the median.') },
      { id: 'd', label: L("aniqlab bo'lmaydi", 'определить нельзя', 'cannot be determined'), hint: L("Mumkin: qolgan to'qqiz sonni tartiblab markazga qarang.", 'Можно: упорядочи девять оставшихся и посмотри в центр.', 'It can: sort the remaining nine and look at the centre.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L("O'rtacha bilan nima bo'ladi?", 'Что будет со средним?', 'What happens to the mean?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: L('sezilarli tushadi', 'заметно упадёт', 'it drops noticeably') },
      { id: 'b', label: L('biroz tushadi', 'чуть упадёт', 'it drops a little') },
      { id: 'c', label: L("o'zgarmaydi", 'не изменится', 'it will not change') },
      { id: 'd', label: L("ko'tariladi", 'вырастет', 'it rises') },
    ],
  },
  holds: [4500, 6500, 2500, 3000],
  audio: [
    A('mount', "O'n kishida o'rtacha besh yuz oltmish, mediana ikki yuz edi.", 'При десяти людях среднее было пятьсот шестьдесят, медиана двести.', 'With ten people the mean was five hundred and sixty, the median two hundred.'),
    A('now', "Endi eng katta maosh oluvchi ishdan ketdi. To'qqiz kishi qoldi. Ikkala son ham qayta sanaladi, lekin ular bir xil o'zgarmaydi. Bu darsning ikkinchi yarmi.", 'Теперь человек с самой большой зарплатой уволился. Осталось девять. Оба числа пересчитываются, но меняются они не одинаково. Это вторая половина урока.', 'Now the person with the largest wage has left. Nine remain. Both numbers are recomputed, but they do not change the same way. That is the second half of the lesson.'),
    A('q1', 'Mediana bilan nima bo\'ladi?', 'Что будет с медианой?', 'What happens to the median?'),
    A('q2', "Sizningcha o'rtacha bilan nima bo'ladi? Shunchaki taxmin qiling.", 'Как думаешь, что будет со средним? Просто предположи.', 'What do you think happens to the mean? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'mean_vs_median',
  eyebrow: L('Ikkalasini ham sanaymiz', 'Посчитаем оба', 'Let us compute both'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: L('9 kishi:  200 · 8,  1500', '9 человек: 200 · 8, 1500', '9 people: 200 · 8, 1500'),
  need: '= ?',
  answerLabel: L("o'rtacha", 'среднее', 'the mean'),
  cards: [
    {
      tag: L('mediana', 'медиана', 'the median'),
      txt: '200',
      point: {
        label: L('markazda o\'sha son', 'в центре то же число', 'the same number in the centre'),
        calc: L("o'zgarmadi   ✓", 'не изменилась   ✓', 'unchanged   ✓'),
        verdict: 'in',
      },
    },
    {
      tag: L("o'rtacha", 'среднее', 'the mean'),
      txt: '3100 / 9',
      point: {
        label: L('sezilarli tushdi', 'заметно упало', 'dropped noticeably'),
        calc: '≈ 344   ✓',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['344', '560', '200', '400'],
    value: ['344'],
    label: L("o'rtacha ≈", 'среднее ≈', 'mean ≈'),
    prompt: L("O'rtachani yozing", 'Запиши среднее', 'Write the mean'),
    wrongs: [
      { key: '560', hint: L("Bu oldingi o'rtacha, o'n kishilik. Endi yig'indi ham, odamlar soni ham kamaydi.", 'Это прежнее среднее, для десяти. Теперь уменьшились и сумма, и число людей.', 'That is the previous mean, for ten. Now both the sum and the count dropped.') },
      { key: '200', hint: L("Bu mediana. O'rtacha undan kattaroq, chunki ming besh yuz hamon qatorda.", 'Это медиана. Среднее больше неё, потому что полторы тысячи всё ещё в ряду.', 'That is the median. The mean is larger, because fifteen hundred is still in the row.') },
      { key: '*', hint: L("Yig'indi uch ming yuz, odamlar to'qqizta.", 'Сумма три тысячи сто, людей девять.', 'The sum is three thousand one hundred, nine people.') },
    ],
  },
  holds: [3500, 6000, 6000, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala sonni ham qayta sanaymiz.', 'Прогноз есть. Теперь пересчитаем оба числа.', 'The guess is made. Now let us recompute both numbers.'),
    A('p1', "Mediana. To'qqizta son qoldi, tartiblab markazga qaraymiz: beshinchi o'rinda hamon ikki yuz. Ya'ni mediana umuman o'zgarmadi.", 'Медиана. Осталось девять чисел, упорядочиваем и смотрим в центр: на пятом месте по-прежнему двести. То есть медиана не изменилась вообще.', 'The median. Nine numbers remain, sort and look at the centre: the fifth is still two hundred. So the median did not change at all.'),
    A('p2', "O'rtacha. Yig'indi endi uch ming yuz, odamlar to'qqizta. Uch yuz qirq to'rtga yaqin chiqadi. Ya'ni bitta odam ketishi bilan o'rtacha ikki yuz o'n olti birlikka tushdi.", 'Среднее. Сумма теперь три тысячи сто, людей девять. Выходит около трёхсот сорока четырёх. То есть с уходом одного человека среднее упало на двести шестнадцать.', 'The mean. The sum is now three thousand one hundred, nine people. About three hundred and forty four comes out. So one person leaving dropped the mean by two hundred and sixteen.'),
    A('write', "O'rtachani yozing.", 'Запиши среднее.', 'Write the mean.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: QAYSI SONNI TANLASH.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'mean_vs_median',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Qaysi sonni tanlash', 'Какое число выбрать', 'Which number to choose'),
  cases: [
    {
      label: L('chekka qiymatlar yo\'q', 'нет выбросов', 'no outliers'),
      text: L("o'rtacha yaxshi", 'среднее подходит', 'the mean is fine'),
      tone: 'graph',
    },
    {
      label: L('chekka qiymatlar bor', 'есть выбросы', 'there are outliers'),
      text: L('mediana rostroq', 'медиана честнее', 'the median is honest'),
      tone: 'accent',
    },
  ],
  rows: [
    L('10 kishi:  560  va  200', '10 человек: 560 и 200', '10 people: 560 and 200'),
    L('9 kishi:  344  va  200', '9 человек: 344 и 200', '9 people: 344 and 200'),
  ],
  probe: {
    question: L(
      "Nega mediana o'zgarmadi?",
      'Почему медиана не изменилась?',
      'Why did the median not change?',
    ),
    items: [
      { id: 'a', label: L("u faqat markazdagi songa qaraydi", 'она смотрит только на центральное число', 'it looks only at the central number'), correct: true },
      { id: 'b', label: L("chunki u kichik", 'потому что она маленькая', 'because it is small'), hint: L("Kattaligi ahamiyatsiz: mediana katta ham bo'lishi mumkin.", 'Величина не важна: медиана может быть и большой.', 'The size does not matter: a median can be large too.') },
      { id: 'c', label: L("chunki hech kim ketmagan", 'потому что никто не ушёл', 'because nobody left'), hint: L("Bitta odam ketdi, va o'rtacha buni sezdi.", 'Один человек ушёл, и среднее это заметило.', 'One person left, and the mean noticed.') },
      { id: 'd', label: L("tasodifan", 'случайно', 'by chance'), hint: L("Tasodif emas: chekkadan sonni olib tashlash markazni siljitmaydi.", 'Не случайно: убрав число с края, центр не сдвинешь.', 'Not by chance: removing a value from the edge does not move the centre.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Tanlash', 'Правило 2. Выбор', 'Rule 2. The choice'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('chekka qiymat bormi', 'есть ли выбросы', 'are there outliers'),
    lines: [
      L("o'rtacha hamma sonni hisobga oladi, shu bilan birga chekkalarni ham", 'среднее учитывает все числа, включая крайние', 'the mean counts every value, the extremes included'),
      L("mediana faqat markazga qaraydi va chekkalarni sezmaydi", 'медиана смотрит только в центр и выбросов не замечает', 'the median looks only at the centre and ignores outliers'),
      L("maosh, narx, qiymat haqida mediana rostroq", 'о зарплатах, ценах и стоимости честнее медиана', 'about wages, prices and values the median is honest'),
      L("ikkalasi ham to'g'ri: farq savolda", 'оба верны: разница в вопросе', 'both are correct: the difference is in the question'),
    ],
    example: L('misol:  560 va 200 bitta qatorda', 'пример:  560 и 200 в одном ряду', 'example:  560 and 200 in one row'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('uch savol, uch son', 'три вопроса, три числа', 'three questions, three numbers'),
    lines: [
      L("1. o'rtacha: teng bo'lsak nima tegadi", '1. среднее: сколько если поровну', '1. the mean: how much if shared equally'),
      L('2. mediana: markazda kim turibdi', '2. медиана: кто в центре', '2. the median: who is in the centre'),
      L("3. moda: nima eng ko'p uchraydi", '3. мода: что встречается чаще', '3. the mode: what occurs most'),
      L("4. chekka qiymat bo'lsa, o'rtachaga ishonmang", '4. есть выбросы, не верь среднему', '4. with outliers, do not trust the mean'),
    ],
  },
  holds: [4000, 6500, 2500, 5000],
  audio: [
    A('mount', "Ikki holat ko'rildi. Endi eng foydali savolga o'tamiz: qaysi sonni tanlash kerak.", 'Два случая разобраны. Теперь к самому полезному вопросу: какое число выбирать.', 'Two cases are done. Now to the most useful question: which number to choose.'),
    A('rows', "Bitta odam ketdi, va o'rtacha ikki yuzdan ortiq birlikka tushdi. Mediana esa qimirlamadi. Sabab oddiy: o'rtacha hamma sonni hisobga oladi, mediana esa faqat markazga qaraydi.", 'Ушёл один человек, и среднее упало более чем на двести. А медиана не шелохнулась. Причина простая: среднее учитывает все числа, а медиана смотрит только в центр.', 'One person left and the mean fell by more than two hundred. The median did not budge. The reason is simple: the mean counts every value, the median looks only at the centre.'),
    A('q', "Savol: nega mediana o'zgarmadi?", 'Вопрос: почему медиана не изменилась?', 'The question: why did the median not change?'),
    A('rule', "To'g'ri. Va amaliy xulosa: maosh, narx yoki uy qiymati haqida gapirganda medianani so'rang. O'rtachani bir nechta juda katta qiymat osongina ko'tarib yuboradi.", 'Верно. И практический вывод: про зарплаты, цены или стоимость жилья спрашивай медиану. Среднее легко задирают несколько очень больших значений.', 'Correct. And a practical conclusion: about wages, prices or house values, ask for the median. The mean is easily pushed up by a few very large values.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. SONNI O'ZI TANLAYDI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'mean_vs_median',
  eyebrow: L("O'zingiz tanlang", 'Выбери сам', 'Choose it yourself'),
  title: L('Qaysi sonni so\'rash kerak', 'Какое число спросить', 'Which number to ask for'),
  left: L('shahar maoshlari haqida', 'о зарплатах в городе', 'about wages in a city'),
  template: [{ slot: 0 }, L(' rostroq gapiradi', ' говорит честнее', ' is the honest one')],
  signs: [L('mediana', 'медиана', 'the median'), L("o'rtacha", 'среднее', 'the mean')],
  answer: L('mediana', 'медиана', 'the median'),
  checkNote: L(
    "Bir nechta juda katta maosh o'rtachani ko'taradi",
    'Несколько очень больших зарплат задирают среднее',
    'A few very large wages push the mean up',
  ),
  wrongs: [
    { key: L("o'rtacha", 'среднее', 'the mean'), hint: L("Firmada ko'rdik: o'rtacha besh yuz oltmish, lekin o'n kishidan sakkiztasi ikki yuz oladi.", 'В фирме мы видели: среднее пятьсот шестьдесят, но восемь из десяти получают двести.', 'We saw it in the firm: the mean is five hundred and sixty, yet eight of ten get two hundred.') },
  ],
  probe: {
    question: L("Nega aynan mediana?", 'Почему именно медиана?', 'Why the median?'),
    items: [
      { id: 'a', label: L("chekka katta qiymatlar unga ta'sir qilmaydi", 'крайние большие значения на неё не влияют', 'extreme large values do not affect it'), correct: true },
      { id: 'b', label: L("uni sanash osonroq", 'её проще считать', 'it is easier to compute'), hint: L("Sanash osonligi maqsad emas: gap qaysi savolga javob kerakligida.", 'Простота счёта не цель: вопрос в том, на какой вопрос нужен ответ.', 'Ease of counting is not the goal: the question is which question needs answering.') },
      { id: 'c', label: L("u har doim kichikroq", 'она всегда меньше', 'it is always smaller'), hint: L("Har doim emas: agar chekkada juda kichik qiymatlar bo'lsa, mediana kattaroq bo'ladi.", 'Не всегда: если выбросы очень маленькие, медиана окажется больше.', 'Not always: with very small outliers the median comes out larger.') },
      { id: 'd', label: L("o'rtacha noto'g'ri", 'среднее неверно', 'the mean is wrong'), hint: L("O'rtacha to'g'ri sanalgan. U shunchaki boshqa savolga javob beradi.", 'Среднее посчитано верно. Оно просто отвечает на другой вопрос.', 'The mean is computed correctly. It simply answers a different question.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz tanlaysiz.', 'Правило собрано. Теперь выбираешь ты.', 'The rule is assembled. Now you choose.'),
    A('place', "Qaysi son rostroq gapirishini tanlang.", 'Выбери, какое число говорит честнее.', 'Choose which number speaks more honestly.'),
    A('checked', "Bo'ldi. Endi ta'riflang: nega aynan u?", 'Получилось. Теперь сформулируй: почему именно оно?', 'Done. Now put it into words: why that one?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'sort', label: L('tartiblash', 'упорядочить', 'sort them') },
  { id: 'sum', label: L("yig'indini topish", 'найти сумму', 'find the sum') },
  { id: 'div', label: L("soniga bo'lish", 'поделить на количество', 'divide by the count') },
  { id: 'mid', label: L('markazni olish', 'взять центр', 'take the centre') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'mean_vs_median',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L("3, 5, 5, 7, 10 ning o'rtachasi", 'среднее для 3, 5, 5, 7, 10', 'the mean of 3, 5, 5, 7, 10'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'sum',
      to: '3 + 5 + 5 + 7 + 10 = 30',
      wrongs: [
        { action: 'div', hint: L("Avval yig'indini toping: bo'linadigan narsa kerak.", 'Сначала найди сумму: нужно, что делить.', 'Find the sum first: you need something to divide.') },
        { action: 'sort', hint: L("O'rtacha uchun tartiblash shart emas: yig'indi o'zgarmaydi.", 'Для среднего упорядочивать не нужно: сумма не изменится.', 'For the mean no sorting is needed: the sum does not change.') },
        { action: 'mid', hint: L("Markaz medianaga kerak, o'rtachaga emas.", 'Центр нужен медиане, а не среднему.', 'The centre is for the median, not the mean.') },
      ],
    },
    {
      action: 'div',
      to: '30 / 5 = 6',
      wrongs: [
        { action: 'sum', hint: L("Yig'indi topilgan: o'ttiz.", 'Сумма найдена: тридцать.', 'The sum is found: thirty.') },
        { action: 'sort', hint: L("Tartiblash bu yerda kerak emas.", 'Упорядочивание здесь не нужно.', 'Sorting is not needed here.') },
        { action: 'mid', hint: L("Markaz medianaga.", 'Центр для медианы.', 'The centre is for the median.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['6', '5', '30', '7'],
    value: ['6'],
    label: L("o'rtacha =", 'среднее =', 'mean ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '5', hint: L("Bu mediana va moda. O'rtacha esa olti.", 'Это медиана и мода. А среднее шесть.', 'That is the median and mode. The mean is six.') },
      { key: '30', hint: L("Bu yig'indi. Uni beshga bo'ling.", 'Это сумма. Подели её на пять.', 'That is the sum. Divide it by five.') },
      { key: '*', hint: L("Yig'indi o'ttiz, sonlar beshta.", 'Сумма тридцать, чисел пять.', 'The sum is thirty, there are five numbers.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi kichik qatorda ishlaymiz.', 'Правило сформулировано. Поработаем с маленьким рядом.', 'The rule is stated. Let us work with a small row.'),
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
  tag: 'mean_vs_median',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Medianani toping', 'Найди медиану', 'Find the median'),
  start: '4, 9, 2, 7, 5, 3',
  actions: ACTIONS_10,
  hint: L(
    "Sonlar oltita: markazda ikkitasi turadi.",
    'Чисел шесть: в центре стоят два.',
    'There are six numbers: two stand in the centre.',
  ),
  steps: [
    {
      action: 'sort',
      to: '2, 3, 4, 5, 7, 9',
      wrongs: [
        { action: 'mid', hint: L("Avval tartiblang: tartiblanmagan qatorda markaz ma'nosiz.", 'Сначала упорядочи: в неупорядоченном ряду центр бессмыслен.', 'Sort first: in an unsorted row the centre means nothing.') },
        { action: 'sum', hint: L("Yig'indi o'rtachaga kerak, medianaga emas.", 'Сумма нужна среднему, а не медиане.', 'The sum is for the mean, not the median.') },
        { action: 'div', hint: L("Bo'lish o'rtachaga.", 'Деление для среднего.', 'Dividing is for the mean.') },
      ],
    },
    {
      action: 'mid',
      to: L('markazda 4 va 5', 'в центре 4 и 5', '4 and 5 in the centre'),
      wrongs: [
        { action: 'sort', hint: L("Tartiblangan.", 'Упорядочено.', 'Sorted.') },
        { action: 'sum', hint: L("Bu yerda yig'indi kerak emas.", 'Здесь сумма не нужна.', 'The sum is not needed here.') },
        { action: 'div', hint: L("Avval markazni toping.", 'Сначала найди центр.', 'Find the centre first.') },
      ],
    },
    {
      action: 'div',
      to: '(4 + 5) / 2 = 4,5',
      wrongs: [
        { action: 'sort', hint: L("Tartiblangan.", 'Упорядочено.', 'Sorted.') },
        { action: 'mid', hint: L("Markaz topilgan: to'rt va besh.", 'Центр найден: четыре и пять.', 'The centre is found: four and five.') },
        { action: 'sum', hint: L("Butun qatorning yig'indisi kerak emas, faqat ikkita markaziy son.", 'Сумма всего ряда не нужна, только два центральных числа.', 'The sum of the whole row is not needed, only the two central numbers.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['4,5', '5', '4', '5,5'],
    value: ['4,5'],
    label: L('mediana =', 'медиана =', 'median ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '4', hint: L("Sonlar juft sonda: markazda ikkitasi turadi, va ularning o'rtachasi olinadi.", 'Чисел чётное количество: в центре два, и берётся их среднее.', 'The count is even: two stand in the centre, and their mean is taken.') },
      { key: '5', hint: L("Xuddi shunday: ikkita markaziy sonning o'rtachasi kerak.", 'То же самое: нужно среднее двух центральных.', 'The same: the mean of the two central ones is needed.') },
      { key: '*', hint: L("To'rt plyus besh bo'lingan ikki.", 'Четыре плюс пять делить на два.', 'Four plus five over two.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Oltita son, va ular tartibsiz berilgan. Diqqat: sonlar soni juft.", 'Шесть чисел, и даны они не по порядку. Внимание: количество чисел чётное.', 'Six numbers, given out of order. Careful: the count is even.'),
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
      id: 'b1', tag: 'mean_vs_median', ask: true, cols: 4,
      done: L("o'rtacha = 4", 'среднее = 4', 'mean = 4'),
      prompt: L("2, 4, 6 ning o'rtachasi?", 'Среднее для 2, 4, 6 ?', 'The mean of 2, 4, 6 ?'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '12', hint: L("Bu yig'indi. Uchga bo'ling.", 'Это сумма. Подели на три.', 'That is the sum. Divide by three.') },
        { id: 'c', label: '6', hint: L("Bu eng kattasi.", 'Это самое большое.', 'That is the largest.') },
        { id: 'd', label: '3', hint: L("O'n ikki bo'lingan uch bu to'rt.", 'Двенадцать делить на три это четыре.', 'Twelve over three is four.') },
      ],
    },
    {
      id: 'b2', tag: 'mean_vs_median', ask: true, cols: 4,
      done: L('mediana = 5', 'медиана = 5', 'median = 5'),
      prompt: L('1, 5, 100 ning medianasi?', 'Медиана для 1, 5, 100 ?', 'The median of 1, 5, 100 ?'),
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '35,3', hint: L("Bu o'rtacha, va uni yuzlik ko'tarib yuborgan.", 'Это среднее, и его задрала сотня.', 'That is the mean, pushed up by the hundred.') },
        { id: 'c', label: '100', hint: L("Bu eng kattasi, markazdagi emas.", 'Это самое большое, а не центральное.', 'That is the largest, not the central.') },
        { id: 'd', label: '50,5', hint: L("Bu chetlarning o'rtachasi.", 'Это среднее крайних.', 'That is the mean of the extremes.') },
      ],
    },
    {
      id: 'b3', tag: 'mean_vs_median', ask: true, cols: 2,
      done: L('mediana', 'медиана', 'the median'),
      prompt: L(
        "Bir nechta juda katta qiymat bor. Qaysi son rostroq?",
        'Есть несколько очень больших значений. Какое число честнее?',
        'There are a few very large values. Which number is honest?',
      ),
      items: [
        { id: 'a', label: L('mediana', 'медиана', 'the median'), correct: true },
        { id: 'b', label: L("o'rtacha", 'среднее', 'the mean'), hint: L("Katta qiymatlar aynan o'rtachani tortadi.", 'Большие значения тянут именно среднее.', 'Large values pull the mean in particular.') },
        { id: 'c', label: L('moda', 'мода', 'the mode'), hint: L("Moda ba'zan yordam beradi, lekin u eng ko'p uchraganni oladi, markazni emas.", 'Мода иногда помогает, но она берёт самое частое, а не центр.', 'The mode sometimes helps, but it takes the most frequent, not the centre.') },
        { id: 'd', label: L('farqi yo\'q', 'без разницы', 'no difference'), hint: L("Farqi bor: firmada besh yuz oltmish va ikki yuz.", 'Разница есть: в фирме пятьсот шестьдесят и двести.', 'There is a difference: in the firm five hundred sixty and two hundred.') },
      ],
    },
    {
      id: 'b4', tag: 'mean_vs_median', ask: true, cols: 4,
      done: L('moda = 7', 'мода = 7', 'mode = 7'),
      prompt: L('3, 7, 7, 9 ning modasi?', 'Мода для 3, 7, 7, 9 ?', 'The mode of 3, 7, 7, 9 ?'),
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '2', hint: L("Ikkilik bu necha marta uchragani.", 'Двойка это сколько раз встретилось.', 'Two is how many times it occurred.') },
        { id: 'c', label: '6,5', hint: L("Bu o'rtacha.", 'Это среднее.', 'That is the mean.') },
        { id: 'd', label: '9', hint: L("Bu eng kattasi, eng tez-tez uchraydigani emas.", 'Это самое большое, а не самое частое.', 'That is the largest, not the most frequent.') },
      ],
    },
    {
      id: 'b5', tag: 'mean_vs_median', ask: true, cols: 2,
      done: L("o'rtacha tushadi, mediana yo'q", 'среднее упадёт, медиана нет', 'the mean drops, the median does not'),
      prompt: L(
        "Qatordan eng katta son olib tashlandi. Nima o'zgaradi?",
        'Из ряда убрали самое большое число. Что изменится?',
        'The largest number was removed. What changes?',
      ),
      items: [
        { id: 'a', label: L("o'rtacha tushadi, mediana deyarli o'zgarmaydi", 'среднее упадёт, медиана почти нет', 'the mean drops, the median hardly moves'), correct: true },
        { id: 'b', label: L('ikkalasi ham keskin tushadi', 'оба резко упадут', 'both drop sharply'), hint: L("Mediana markazga qaraydi: chetdan son olib tashlansa, markaz deyarli qimirlamaydi.", 'Медиана смотрит в центр: убрали число с края, центр почти не двигается.', 'The median looks at the centre: removing an edge value barely moves it.') },
        { id: 'c', label: L('hech narsa', 'ничего', 'nothing'), hint: L("O'rtacha o'zgaradi: yig'indi kamayadi.", 'Среднее изменится: сумма уменьшится.', 'The mean changes: the sum drops.') },
        { id: 'd', label: L('faqat moda', 'только мода', 'only the mode'), hint: L("Moda eng ko'p uchraganga bog'liq, va u odatda chetda emas.", 'Мода зависит от самого частого, а оно обычно не с краю.', 'The mode depends on the most frequent, usually not at the edge.') },
      ],
    },
    {
      id: 'b6', tag: 'mean_vs_median', ask: true, cols: 4,
      done: L('mediana = 4,5', 'медиана = 4,5', 'median = 4,5'),
      prompt: L('2, 3, 4, 5, 7, 9 ning medianasi?', 'Медиана для 2, 3, 4, 5, 7, 9 ?', 'The median of 2, 3, 4, 5, 7, 9 ?'),
      items: [
        { id: 'a', label: '4,5', correct: true },
        { id: 'b', label: '4', hint: L("Sonlar juft: markazdagi ikkitasining o'rtachasi olinadi.", 'Чисел чётное количество: берётся среднее двух центральных.', 'The count is even: the mean of the two central ones is taken.') },
        { id: 'c', label: '5', hint: L("Xuddi shunday: to'rt va beshning o'rtasi.", 'То же самое: середина между четырьмя и пятью.', 'The same: midway between four and five.') },
        { id: 'd', label: '5,5', hint: L("Bu qatorning o'rtachasi.", 'Это среднее ряда.', 'That is the mean of the row.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi chekka qiymat bilan.", 'Теперь с выбросом.', 'Now with an outlier.'),
    A('q3', "Tanlash haqida.", 'Про выбор.', 'About the choice.'),
    A('q4', "Moda.", 'Мода.', 'The mode.'),
    A('q5', "O'zgarish haqida.", 'Про изменение.', 'About the change.'),
    A('q6', 'Oxirgi savol, juft qator.', 'Последний вопрос, чётный ряд.', 'The last question, an even row.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: tartiblanmagan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'mean_vs_median',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Markaz tartiblangan qatorda", 'Центр в упорядоченном ряду', 'The centre of a sorted row'),
  rows: [
    { id: 'r1', text: L('qator: 4, 9, 2, 7, 5', 'ряд: 4, 9, 2, 7, 5', 'row: 4, 9, 2, 7, 5') },
    { id: 'r2', text: L('markazda 2 turibdi', 'в центре стоит 2', '2 stands in the centre') },
    { id: 'r3', text: L('mediana = 2', 'медиана = 2', 'median = 2') },
    { id: 'r4', text: L('javob: 2', 'ответ: 2', 'answer: 2') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r3: L("Bu satr oldingisidan to'g'ri chiqadi. Xato esa oldingisida.", 'Эта строка верно следует из предыдущей. А ошибка в предыдущей.', 'This line follows correctly from the previous. The error is in the previous one.'),
    r4: L("Javob xato, lekin u oldin xato bo'lgan.", 'Ответ неверный, но неверным он стал раньше.', 'The answer is wrong, but it became wrong earlier.'),
  },
  proofPoint: L('2 eng kichigi, markaz emas', '2 это наименьшее, а не центр', '2 is the smallest, not the centre'),
  proof: L(
    "Mediana tartiblangan qatordan olinadi. Bu qator tartiblanmagan, va uchinchi o'rinda turgan ikkilik aslida eng kichik son. Tartiblasak: ikki, to'rt, besh, yetti, to'qqiz. Markazda besh turibdi, demak mediana besh.",
    'Медиана берётся из упорядоченного ряда. Этот ряд не упорядочен, и двойка на третьем месте на деле наименьшее число. Упорядочим: два, четыре, пять, семь, девять. В центре пять, значит медиана пять.',
    'The median is taken from a sorted row. This row is unsorted, and the two in third place is in fact the smallest number. Sorted: two, four, five, seven, nine. Five is in the centre, so the median is five.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('qator tartiblanmagan', 'ряд не упорядочен', 'the row was not sorted'), correct: true },
      { id: 'b', label: L("markaz noto'g'ri sanalgan", 'центр посчитан неверно', 'the centre was miscounted'), hint: L("Uchinchi o'rin to'g'ri topilgan: sonlar beshta. Muammo tartibda.", 'Третье место найдено верно: чисел пять. Проблема в порядке.', 'The third place was found correctly: there are five numbers. The problem is the order.') },
      { id: 'c', label: L("mediana o'rniga o'rtacha kerak edi", 'нужно было среднее вместо медианы', 'the mean was needed instead'), hint: L("So'ralgani mediana, va uni topish mumkin.", 'Спрашивали медиану, и её можно найти.', 'The median was asked, and it can be found.') },
      { id: 'd', label: L("sonlar soni noto'g'ri", 'неверное число чисел', 'the count is wrong'), hint: L("Sonlar beshta, va bu to'g'ri.", 'Чисел пять, и это верно.', 'There are five numbers, and that is right.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda sonlar soni to'g'ri va markaz o'rni ham to'g'ri topilgan. Shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь число чисел верно и место центра найдено верно. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Here the count is right and the position of the centre is right. And still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Qarang: mediana tartiblangan qatordan olinadi. Bu qator esa tartiblanmagan, va uchinchi o'rindagi ikkilik aslida eng kichik son. Tartiblab qarasak, markazda besh turibdi.", 'Смотри: медиана берётся из упорядоченного ряда. А этот ряд не упорядочен, и двойка на третьем месте на деле наименьшая. Упорядочив, в центре видим пять.', 'Look: the median is taken from a sorted row. This row is unsorted, and the two in third place is in fact the smallest. Once sorted, five stands in the centre.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'mean_vs_median',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Savolga sonni moslang', 'Подбери число к вопросу', 'Match the number to the question'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('savol nimani so\'rayapti', 'что именно спрашивает вопрос', 'what the question actually asks'),
  tasks: [
    {
      prompt: L('«Ko\'pchilik qancha oladi?»', '«Сколько получает большинство?»', '«What does the majority get?»'),
      template: [{ slot: 0 }, '  =  ', { slot: 1 }],
      parts: [L('mediana', 'медиана', 'median'), L("o'rtacha", 'среднее', 'mean'), '200', '560'],
      answer: [L('mediana', 'медиана', 'median'), '200'],
      doneLabel: L('mediana = 200', 'медиана = 200', 'median = 200'),
      wrongs: [
        { key: [L("o'rtacha", 'среднее', 'mean'), '560'], hint: L("O'rtachadan sakkiz kishi kam oladi: bu ko'pchilik emas.", 'Меньше среднего получают восемь человек: это не большинство.', 'Eight people get less than the mean: that is not the majority.') },
        { key: '*', hint: L("Ko'pchilik haqida mediana gapiradi.", 'О большинстве говорит медиана.', 'The median speaks about the majority.') },
      ],
    },
    {
      prompt: L('«Firma maoshga qancha to\'laydi?»', '«Сколько фирма платит на зарплаты?»', '«What does the firm pay in wages?»'),
      template: [{ slot: 0 }, '  =  ', { slot: 1 }],
      parts: [L("o'rtacha", 'среднее', 'mean'), L('mediana', 'медиана', 'median'), '560', '200'],
      answer: [L("o'rtacha", 'среднее', 'mean'), '560'],
      doneLabel: L("o'rtacha = 560", 'среднее = 560', 'mean = 560'),
      wrongs: [
        { key: [L('mediana', 'медиана', 'median'), '200'], hint: L("Medianani o'nga ko'paytirsak ikki ming chiqadi, firma esa besh ming olti yuz to'laydi.", 'Медиану умножить на десять это две тысячи, а фирма платит пять тысяч шестьсот.', 'The median times ten is two thousand, but the firm pays five thousand six hundred.') },
        { key: '*', hint: L("Umumiy summa uchun o'rtacha kerak: uni soniga ko'paytirsa yig'indi chiqadi.", 'Для общей суммы нужно среднее: умножишь на количество и получишь сумму.', 'For the total the mean is needed: times the count it gives the sum.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi, va u yerda javob boshqa son bo'ladi.", 'А теперь второе, и там ответом будет другое число.', 'And now the second one, where the answer is a different number.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'mean_vs_median',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: L("o'rtacha = yig'indi / soni", 'среднее = сумма / количество', 'mean = sum / count'),
  ruleLines: [
    L("uch son uch har xil savolga javob beradi", 'три числа отвечают на три разных вопроса', 'three numbers answer three different questions'),
    L("chekka qiymatlar o'rtachani tortadi, medianani emas", 'выбросы тянут среднее, а не медиану', 'outliers pull the mean, not the median'),
    L("maosh va narx haqida mediana rostroq", 'о зарплатах и ценах честнее медиана', 'about wages and prices the median is honest'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L("o'rtacha 560, sakkizda 200", 'среднее 560, у восьми 200', 'mean 560, eight get 200'),
      right: L('hech kim', 'никто', 'nobody'),
      map: {
        a: L('direktor', 'директор', 'the director'),
        b: L('ishchilar', 'рабочие', 'the workers'),
        both: L('ikkalasi', 'оба', 'both'),
        none: L('hech kim', 'никто', 'nobody'),
      },
    },
    {
      screen: 5,
      expr: L('2500 ketdi', '2500 ушла', '2500 is gone'),
      right: L('sezilarli tushadi', 'заметно упадёт', 'drops noticeably'),
      map: {
        a: L('sezilarli tushadi', 'заметно упадёт', 'drops noticeably'),
        b: L('biroz tushadi', 'чуть упадёт', 'drops a little'),
        c: L("o'zgarmaydi", 'не изменится', 'no change'),
        d: L("ko'tariladi", 'вырастет', 'rises'),
      },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L("o'rtacha 560,   mediana 200,   moda 200", 'среднее 560,   медиана 200,   мода 200', 'mean 560,   median 200,   mode 200'),
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Ustunlar ekraniga qayting', 'Вернись к экрану со столбиками', 'Go back to the bars screen'),
  },
  probe: {
    question: L(
      "Yangilikda «o'rtacha maosh o'sdi» deyilsa, nimani so'rash kerak?",
      'В новостях сказали «средняя зарплата выросла». О чём спросить?',
      'The news says «the mean wage grew». What should you ask?',
    ),
    items: [
      { id: 'a', label: L('mediana ham o\'sdimi', 'выросла ли медиана', 'whether the median grew too'), correct: true },
      { id: 'b', label: L("o'rtacha to'g'ri sanalganmi", 'верно ли посчитано среднее', 'whether the mean is computed right'), hint: L("Odatda to'g'ri sanaladi. Savol boshqa: u kimning maoshi haqida gapiryapti.", 'Обычно считают верно. Вопрос в другом: о чьей зарплате оно говорит.', 'It is usually computed right. The question is whose wage it speaks about.') },
      { id: 'c', label: L('nechta odam ishlaydi', 'сколько человек работает', 'how many people work'), hint: L("Bu foydali, lekin asosiy savol emas.", 'Это полезно, но не главный вопрос.', 'Useful, but not the main question.') },
      { id: 'd', label: L('hech narsa, bu yetarli', 'ничего, этого достаточно', 'nothing, that is enough'), hint: L("Yetarli emas: firmada o'rtacha besh yuz oltmish edi, ko'pchilik esa ikki yuz olardi.", 'Недостаточно: в фирме среднее было пятьсот шестьдесят, а большинство получало двести.', 'Not enough: in the firm the mean was five hundred sixty while most got two hundred.') },
    ],
  },
  sheetTitle: L("O'rtacha va mediana · shpargalka", 'Среднее и медиана · шпаргалка', 'Mean and median · cheat sheet'),
  sheetSrc: L('11-sinf · 22-dars', '11 класс · урок 22', 'Grade 11 · lesson 22'),
  lifehack: L(
    "«O'rtacha» so'zini eshitsangiz, medianani so'rang: farq katta bo'lsa, qatorda chekka qiymatlar bor.",
    'Услышал слово «среднее» — спроси медиану: большая разница значит в ряду есть выбросы.',
    'Hear the word «mean»? Ask for the median: a big gap means the row has outliers.',
  ),
  holds: [2500, 7000, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Hech kim yolg'on gapirmagan edi: uchala son ham to'g'ri sanalgan.", 'Вот твои прогнозы и вот как оказалось. Никто не врал: все три числа посчитаны верно.', 'Here are your guesses and here is how it turned out. Nobody lied: all three numbers are computed correctly.'),
    A('rule', "Va mana asosiy fikr. Bitta qatorni bitta son bilan tasvirlab bo'lmaydi. Uchta son bor, va ular uchta har xil savolga javob beradi. Aldash esa oddiy: kerakli sonni tanlab, boshqasini aytmaslik yetadi.", 'И вот главная мысль. Один ряд одним числом не описать. Есть три числа, и они отвечают на три разных вопроса. А обмануть просто: достаточно выбрать нужное число и не назвать остальные.', 'And here is the main point. One row cannot be described by one number. There are three numbers, and they answer three different questions. Deceiving is easy: pick the convenient number and leave the others unsaid.'),
    A('q', "Oxirgi savol: yangilikda o'rtacha maosh o'sdi deyilsa, nimani so'raysiz?", 'Последний вопрос: в новостях сказали, что средняя зарплата выросла. О чём спросишь?', 'The last question: the news says the mean wage grew. What will you ask?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
