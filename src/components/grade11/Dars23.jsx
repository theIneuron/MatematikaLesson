// ============================================================================
// 11-sinf, Dars 23. IKKI QATOR MA'LUMOT.
//
// B3 blokining TO'QQIZINCHI, oxirgi darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/BLOK3_SKELET.md, «23-dars» bo'limi
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// DARSNING BITTA GAPI: ikki qatorning bog'liqligi nuqtalar bulutida
// KO'RINADI, lekin bog'liqlik sabab degani emas.
//
// Asbob: `FrequencyBoard` yangi `scatter` rejimida. Yo'nalish chizig'ini
// asbob o'zi hisoblaydi (eng kichik kvadratlar), men oldindan chizmayman:
// aks holda ekranda tekshiruv emas, mening javobim turgan bo'lardi.
//
// BLOKDA YAGONA DARS, QAYERDA TO'G'RI JAVOB «MA'LUMOT YETARLI EMAS».
// Bu ataylab: DTM da bunday variant uchraydi, va undan qo'rqqan o'quvchi
// masalani yo'qotadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_23',
  title: L("Ikki qator ma'lumot", 'Два ряда данных', 'Two rows of data'),
}

const BLOCK = { label: 'B3', from: 16, to: 24, current: 23 }

// Harorat va muzqaymoq: bog'liqlik kuchli (r = 0,995).
// Sonlar dars ichida, tasodifiy generator yo'q.
const HEAT = [
  { x: 18, y: 12 }, { x: 20, y: 16 }, { x: 22, y: 19 }, { x: 24, y: 26 }, { x: 26, y: 31 },
  { x: 28, y: 38 }, { x: 30, y: 44 }, { x: 32, y: 52 }, { x: 34, y: 58 }, { x: 36, y: 66 },
]

// Oy raqami va baho: bog'liqlik deyarli yo'q (r = 0,135).
const MONTH = [
  { x: 1, y: 4 }, { x: 2, y: 3 }, { x: 3, y: 5 }, { x: 4, y: 4 }, { x: 5, y: 3 },
  { x: 6, y: 5 }, { x: 7, y: 4 }, { x: 8, y: 3 }, { x: 9, y: 5 }, { x: 10, y: 4 },
]

// ============================================================
// SLAYD 1. XUK. Muzqaymoq xavflimi.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Ikki qator', 'Два ряда', 'Two rows'),
  title: L('Muzqaymoq xavflimi', 'Мороженое опасно', 'Is ice cream dangerous'),
  expr: L("yozda ikkalasi ham o'sadi", 'летом растут оба', 'both grow in summer'),
  rows: [
    {
      id: 'a',
      name: L('birinchi', 'первый', 'the first'),
      value: L("bog'liqlik bor, demak sabab bor", 'связь есть, значит есть причина', 'a link exists, so a cause exists'),
    },
    {
      id: 'b',
      name: L('ikkinchi', 'второй', 'the second'),
      value: L("bog'liqlik bor, sabab yo'q", 'связь есть, причины нет', 'a link exists, a cause does not'),
    },
  ],
  probe: {
    question: L('Kim haq?', 'Кто прав?', 'Who is right?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi ikkala qatorni ham ko'ramiz.",
      'Твой ответ записан. Сейчас посмотрим на оба ряда.',
      'Your answer is saved. Now we will look at both rows.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первый', 'the first') },
      { id: 'b', label: L('ikkinchi', 'второй', 'the second') },
      { id: 'both', label: L('ikkalasi ham', 'оба', 'both') },
      { id: 'none', label: L('hech kim', 'никто', 'nobody') },
    ],
  },
  holds: [5000, 5500, 5000, 4000],
  audio: [
    A('mount', "Blokning oxirgi darsi. Endi qator bitta emas, ikkita, va savol ular orasidagi bog'liqlik haqida.", 'Последний урок блока. Теперь ряд не один, а два, и вопрос о связи между ними.', 'The last lesson of the block. Now there is not one row but two, and the question is the link between them.'),
    A('r1', "Yozda muzqaymoq sotuvi o'sadi. O'sha oylarda suvda cho'kish hollari ham ko'payadi. Birinchi xulosa: bog'liqlik bor, demak muzqaymoq xavfli.", 'Летом растут продажи мороженого. В те же месяцы растёт и число утоплений. Первый вывод: связь есть, значит мороженое опасно.', 'Ice cream sales grow in summer. In those same months drownings grow too. The first conclusion: there is a link, so ice cream is dangerous.'),
    A('r2', "Ikkinchi xulosa: bog'liqlik bor, lekin sabab bu emas.", 'Второй вывод: связь есть, но причина не в этом.', 'The second conclusion: there is a link, but that is not the cause.'),
    A('ask', "Sizningcha kim haq? Hozircha shunchaki taxmin qiling.", 'Как думаешь, кто прав? Пока просто предположи.', 'Who do you think is right? Just make a guess for now.'),
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
    "Bittasi o'tgan darsdan, ikkitasi koordinata tekisligidan. Bu baholanmaydi.",
    'Одна с прошлого урока, две из координатной плоскости. Это не оценивается.',
    'One from last lesson, two from the coordinate plane. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Nuqta', 'Точка', 'A point'),
      short: L('ikkita son', 'два числа', 'two numbers'),
      ex: [{ e: '(24; 26)', why: L('bitta kun, ikki qator', 'один день, два ряда', 'one day, two rows') }],
    },
    {
      id: 'c2',
      title: L("O'sish", 'Рост', 'Growth'),
      short: L("o'ngga va yuqoriga", 'вправо и вверх', 'right and up'),
      ex: [{ e: L("x o'sdi, y ham o'sdi", 'x вырос, y тоже вырос', 'x grew, y grew too'), why: L("to'g'ri bog'liqlik", 'прямая связь', 'a direct link') }],
    },
    {
      id: 'c3',
      title: L("O'rtacha", 'Среднее', 'The mean'),
      short: L('22-darsdan', 'из урока 22', 'from lesson 22'),
      ex: [{ e: L("yig'indi / soni", 'сумма / количество', 'sum / count'), why: L('bitta qator uchun', 'для одного ряда', 'for one row') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('(24; 26) nuqtada x nechaga teng?', 'Чему равен x у точки (24; 26)?', 'What is x at the point (24; 26)?'),
      cols: 4,
      items: [
        { id: 'a', label: '24', correct: true },
        { id: 'b', label: '26', hint: L("Bu y: u ikkinchi turadi.", 'Это y: он стоит вторым.', 'That is y: it comes second.') },
        { id: 'c', label: '50', hint: L("Bu yig'indi.", 'Это сумма.', 'That is the sum.') },
        { id: 'd', label: '2', hint: L("Bu ayirma.", 'Это разность.', 'That is the difference.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L("Nuqtalar o'ngga va yuqoriga ketsa?", 'Точки идут вправо и вверх?', 'The points go right and up?'),
      cols: 2,
      items: [
        { id: 'a', label: L("ikkalasi birga o'sadi", 'растут вместе', 'they grow together'), correct: true },
        { id: 'b', label: L('biri o\'sadi, biri kamayadi', 'один растёт, другой падает', 'one grows, one falls'), hint: L("Unda nuqtalar o'ngga va pastga ketardi.", 'Тогда точки шли бы вправо и вниз.', 'Then the points would go right and down.') },
        { id: 'c', label: L("bog'liqlik yo'q", 'связи нет', 'no link'), hint: L("Bog'liqlik yo'q bo'lsa nuqtalar tarqoq turadi.", 'Если связи нет, точки разбросаны.', 'With no link the points are scattered.') },
        { id: 'd', label: L("aniqlab bo'lmaydi", 'определить нельзя', 'cannot be determined'), hint: L("Mumkin: yo'nalish ko'rinib turibdi.", 'Можно: направление видно.', 'It can: the direction is visible.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('3, 4, 5 ning o\'rtachasi?', 'Среднее для 3, 4, 5 ?', 'The mean of 3, 4, 5 ?'),
      cols: 4,
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '12', hint: L("Bu yig'indi. Uchga bo'ling.", 'Это сумма. Подели на три.', 'That is the sum. Divide by three.') },
        { id: 'c', label: '5', hint: L("Bu eng kattasi.", 'Это самое большое.', 'That is the largest.') },
        { id: 'd', label: '3', hint: L("Bu eng kichigi.", 'Это самое маленькое.', 'That is the smallest.') },
      ],
    },
  ],
  holds: [3000, 4500, 4500, 4000, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch: nuqta ikkita sondan iborat. Bugun birinchi son bitta qatordan, ikkinchisi boshqasidan olinadi.", 'Первая опора: точка это два числа. Сегодня первое число берётся из одного ряда, второе из другого.', 'The first basic: a point is two numbers. Today the first comes from one row, the second from another.'),
    A('c2', "Ikkinchi tayanch: nuqtalar o'ngga va yuqoriga ketsa, ikkala qator birga o'sadi.", 'Вторая опора: если точки идут вправо и вверх, оба ряда растут вместе.', 'The second basic: if the points go right and up, both rows grow together.'),
    A('c3', "Uchinchi tayanch o'tgan darsdan: o'rtacha. U bitta qatorni tasvirlaydi, bugun esa qator ikkita.", 'Третья опора с прошлого урока: среднее. Оно описывает один ряд, а сегодня рядов два.', 'The third basic from last lesson: the mean. It describes one row, and today there are two.'),
    A('recap', "Ya'ni bugun yangi savol: ikki qator bir birini qanday kuzatadi.", 'То есть сегодня новый вопрос: как два ряда следуют друг за другом.', 'So today a new question: how two rows follow one another.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. UCHTA JUFT QATOR.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'corr_vs_cause',
  eyebrow: L('Uchta juft qator', 'Три пары рядов', 'Three pairs of rows'),
  title: L("Bog'liqlik va sabab", 'Связь и причина', 'Link and cause'),
  expr: L('har juftni tekshiramiz', 'проверим каждую пару', 'let us check each pair'),
  goal: L("sabab bormi", 'есть ли причина', 'is there a cause'),
  rule: L(
    "Har juft uchun: bog'liqlik bormi, sabab bormi.",
    'Для каждой пары: есть ли связь, есть ли причина.',
    'Per pair: is there a link, is there a cause.',
  ),
  pick: L('Qaysi juftni ko\'ramiz?', 'Какую пару посмотрим?', 'Which pair shall we look at?'),
  claims: [
    { id: 'a', key: 'inA', name: L("bog'liqlik", 'связь', 'a link'), value: '✓' },
    { id: 'b', key: 'inB', name: L('sabab', 'причина', 'a cause'), value: '?' },
  ],
  points: [
    {
      id: 'q1', label: L("bo'y va vazn", 'рост и вес', 'height and weight'), num: '✓ ✓', step: 'calc', verdict: 'in',
      role: L("ikkalasi bor", 'есть оба', 'both'),
      calc: L("katta odam og'irroq", 'крупный тяжелее', 'larger is heavier'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: L('muzqaymoq', 'мороженое', 'ice cream'), num: '✓ ✗', step: 'calc', verdict: 'out',
      role: L("sabab yo'q", 'причины нет', 'no cause'),
      calc: L('sabab: issiq', 'причина: жара', 'the heat'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q3', label: L('oy va baho', 'месяц и оценки', 'month and marks'), num: '✗ ✗', step: 'calc', verdict: 'out',
      role: L("bog'liqlik yo'q", 'связи нет', 'no link'),
      calc: L('nuqtalar tarqoq', 'точки разбросаны', 'points scattered'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L("Kim haq edi?", 'Кто был прав?', 'Who was right?'),
    items: [
      {
        id: 'b', label: L('ikkinchi', 'второй', 'the second'), correct: true,
        ok: L(
          "To'g'ri. Bog'liqlik bor, lekin sabab muzqaymoqda emas: issiq havo ikkala qatorni ham ko'taradi.",
          'Верно. Связь есть, но причина не в мороженом: жара поднимает оба ряда.',
          'Correct. The link exists, but the cause is not the ice cream: the heat lifts both rows.',
        ),
      },
      {
        id: 'a', label: L('birinchi', 'первый', 'the first'),
        hint: L("Bog'liqlik borligi rost, lekin sabab boshqa: issiqda ham muzqaymoq ko'p sotiladi, ham suvga ko'p tushishadi.", 'Связь действительно есть, но причина другая: в жару и мороженого покупают больше, и в воду заходят чаще.', 'The link is real, but the cause differs: in heat more ice cream is bought and more people enter the water.'),
      },
      {
        id: 'both', label: L('ikkalasi ham', 'оба', 'both'),
        hint: L("Ikkalasi ham bo'la olmaydi: birinchi sabab bor deydi, ikkinchisi yo'q deydi.", 'Оба не могут: первый говорит, что причина есть, второй что её нет.', 'Both cannot hold: the first says there is a cause, the second says there is none.'),
      },
      {
        id: 'none', label: L('hech kim', 'никто', 'nobody'),
        hint: L("Ikkinchisi haq: u aynan bog'liqlik bor, sabab yo'q dedi.", 'Второй прав: он и сказал, что связь есть, а причины нет.', 'The second is right: that is exactly what they said.'),
      },
    ],
  },
  holds: [2500, 6000, 1500, 2500, 9500, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi uchta juft qatorni ko\'ramiz.', 'Опора восстановлена. Теперь посмотрим три пары рядов.', 'The basics are back. Now let us look at three pairs of rows.'),
    A('mount', "Har bir juft uchun ikkita alohida savol beramiz: bog'liqlik bormi, va sabab bormi. Bu ikki savol bir xil emas.", 'Для каждой пары зададим два отдельных вопроса: есть ли связь и есть ли причина. Это не один и тот же вопрос.', 'For each pair we ask two separate questions: is there a link, and is there a cause. These are not the same question.'),
    A('mount', "Qaysi juftni ko'rishni tanlang.", 'Выбери, какую пару посмотреть.', 'Choose which pair to look at.'),
    A('calc', 'Ko\'ramiz.', 'Смотрим.', 'We look.'),
    A('mark', "Uch juft, uch xil javob. Bo'y va vazn: bog'liqlik ham, sabab ham bor. Muzqaymoq va cho'kish: bog'liqlik bor, lekin sabab ikkalasiga umumiy, bu issiq havo. Oy raqami va baho: bog'liqlik ham yo'q. Ya'ni bog'liqlikni ko'rish sababni ko'rish degani emas.", 'Три пары, три разных ответа. Рост и вес: есть и связь, и причина. Мороженое и утопления: связь есть, но причина у них общая, это жара. Номер месяца и оценки: нет даже связи. То есть увидеть связь не значит увидеть причину.', 'Three pairs, three different answers. Height and weight: both link and cause. Ice cream and drownings: a link, but their cause is shared, the heat. Month number and marks: not even a link. So seeing a link is not seeing a cause.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: NUQTALAR BULUTI.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'corr_vs_cause',
  eyebrow: L('Nuqtalar buluti', 'Облако точек', 'The scatter'),
  title: L("Bog'liqlik ko'rinadi", 'Связь видно', 'The link is visible'),
  chip: L('10 kun', '10 дней', '10 days'),
  cells: {
    mode: 'scatter',
    points: HEAT,
    trend: true,
    xLabel: L('harorat', 'температура', 'temperature'),
    yLabel: L('sotuv', 'продажи', 'sales'),
    caption: L('nuqtalar chiziq atrofida', 'точки лежат вдоль линии', 'the points lie along a line'),
    height: 128,
  },
  cellSteps: 2,
  bonus: L(
    "Nuqtalar o'ngga va yuqoriga ketmoqda: harorat o'sgan sari sotuv ham o'sadi. Bu bog'liqlik, va u aniq ko'rinib turibdi.",
    'Точки идут вправо и вверх: чем выше температура, тем больше продажи. Это связь, и она видна отчётливо.',
    'The points go right and up: the higher the temperature, the larger the sales. That is a link, and it is plain to see.',
  ),
  probe: {
    question: L("Rasm nimani ko'rsatadi?", 'Что показывает картинка?', 'What does the picture show?'),
    items: [
      { id: 'a', label: L("ikki qator birga o'sadi", 'два ряда растут вместе', 'the two rows grow together'), correct: true },
      { id: 'b', label: L('harorat sotuvni oshiradi', 'температура повышает продажи', 'temperature raises sales'), hint: L("Bu mumkin, lekin rasm buni ko'rsatmaydi: u faqat birga o'sishni ko'rsatadi.", 'Возможно, но картинка этого не показывает: она показывает только совместный рост.', 'Possibly, but the picture does not show that: it shows only joint growth.') },
      { id: 'c', label: L('sotuv haroratni oshiradi', 'продажи повышают температуру', 'sales raise the temperature'), hint: L("Rasmda yo'nalish yo'q: u qaysi biri sabab ekanini ayta olmaydi.", 'На картинке нет направления: она не может сказать, что причина.', 'The picture has no direction: it cannot say which is the cause.') },
      { id: 'd', label: L("hech narsa", 'ничего', 'nothing'), hint: L("Ko'rsatadi: nuqtalar aniq bir chiziq atrofida yotibdi.", 'Показывает: точки лежат вдоль явной линии.', 'It does show: the points lie along a clear line.') },
    ],
  },
  holds: [4500, 6000, 6500],
  audio: [
    A('mount', "Uch juft ko'rildi. Endi ulardan birini rasmda chizamiz.", 'Три пары разобраны. Теперь нарисуем одну из них.', 'Three pairs are done. Now let us draw one of them.'),
    A('one', "Har bir kun bitta nuqta. O'ng tomonga harorat, yuqoriga muzqaymoq sotuvi. O'nta kun, o'nta nuqta.", 'Каждый день это одна точка. Вправо температура, вверх продажи мороженого. Десять дней, десять точек.', 'Each day is one point. Temperature to the right, ice cream sales upward. Ten days, ten points.'),
    A('two', "Nuqtalar tasodifiy tarqalmagan: ular chiziq bo'ylab tizilgan, va chiziq yuqoriga qarab ketyapti. Demak harorat qancha baland bo'lsa, sotuv shuncha katta. Bu bog'liqlik. Lekin diqqat: rasmda qaysi biri sabab ekani yozilmagan. Rasm buni bila olmaydi.", 'Точки не разбросаны случайно: они выстроились вдоль линии, и линия идёт вверх. Значит чем выше температура, тем больше продажи. Это связь. Но внимание: на картинке не написано, что здесь причина. Картинка этого знать не может.', 'The points are not scattered at random: they line up along a line, and the line goes up. So the higher the temperature, the larger the sales. That is a link. But note: the picture does not say which is the cause. A picture cannot know that.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'corr_vs_cause',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Bulut nima aytadi', 'Что говорит облако', 'What the scatter says'),
  rows: [
    L("o'ngga va yuqoriga: birga o'sadi", 'вправо и вверх: растут вместе', 'right and up: they grow together'),
    L('tarqoq: bog\'liqlik yo\'q', 'разбросаны: связи нет', 'scattered: no link'),
  ],
  probe: {
    question: L(
      "Nuqtalar o'ngga va pastga ketsa?",
      'Если точки идут вправо и вниз?',
      'If the points go right and down?',
    ),
    items: [
      { id: 'a', label: L("biri o'sadi, ikkinchisi kamayadi", 'один растёт, другой убывает', 'one grows, the other falls'), correct: true },
      { id: 'b', label: L("bog'liqlik yo'q", 'связи нет', 'no link'), hint: L("Bog'liqlik bor: u teskari. Bog'liqlik yo'qligi bu tarqoq bulut.", 'Связь есть: она обратная. Отсутствие связи это разброс.', 'There is a link: an inverse one. No link means a scattered cloud.') },
      { id: 'c', label: L("ikkalasi kamayadi", 'убывают оба', 'both fall'), hint: L("O'ngga siljish x ning O'SISHI: birinchi qator o'syapti.", 'Движение вправо это РОСТ x: первый ряд растёт.', 'Moving right is x GROWING: the first row grows.') },
      { id: 'd', label: L('xato bor', 'есть ошибка', 'there is a mistake'), hint: L("Xato yo'q: teskari bog'liqlik oddiy hol.", 'Ошибки нет: обратная связь обычное дело.', 'No mistake: an inverse link is ordinary.') },
    ],
  },
  rule: {
    badge: L("1-qoida. Bulut", 'Правило 1. Облако', 'Rule 1. The scatter'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L("bulutning yo'nalishi = bog'liqlikning turi", 'направление облака = вид связи', 'the direction of the cloud is the kind of link'),
    lines: [
      L("o'ngga yuqoriga: to'g'ri bog'liqlik", 'вправо вверх: прямая связь', 'right and up: a direct link'),
      L("o'ngga pastga: teskari bog'liqlik", 'вправо вниз: обратная связь', 'right and down: an inverse link'),
      L("tarqoq bulut: bog'liqlik yo'q", 'разбросанное облако: связи нет', 'a scattered cloud: no link'),
      L("bulut sababni KO'RSATMAYDI", 'облако не показывает причину', 'the cloud does not show the cause'),
    ],
    example: L('misol:  harorat va sotuv', 'пример:  температура и продажи', 'example:  temperature and sales'),
  },
  holds: [4000, 6000, 4500],
  audio: [
    A('mount', "Bulut ko'rildi. Endi uni o'qishni yozib qo'yamiz.", 'Облако увидели. Запишем, как его читать.', 'We saw the cloud. Let us write down how to read it.'),
    A('def', "Bulut o'ngga va yuqoriga ketsa, qatorlar birga o'sadi. O'ngga va pastga ketsa, biri o'sganda ikkinchisi kamayadi. Nuqtalar tarqoq bo'lsa, bog'liqlik yo'q. Va eng muhimi: bulut yo'nalishni ko'rsatadi, sababni emas.", 'Если облако идёт вправо и вверх, ряды растут вместе. Если вправо и вниз, один растёт, а другой убывает. Если точки разбросаны, связи нет. И самое важное: облако показывает направление, а не причину.', 'If the cloud goes right and up, the rows grow together. Right and down, one grows while the other falls. If the points are scattered, there is no link. And most importantly: the cloud shows direction, not cause.'),
    A('rule', "To'g'ri. Teskari bog'liqlik ham bog'liqlik: masalan mashina tezligi va yo'lda o'tkazilgan vaqt.", 'Верно. Обратная связь это тоже связь: например скорость машины и время в пути.', 'Correct. An inverse link is a link too: say a car speed and the travel time.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: bir xil rasm, ikki imzo.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'corr_vs_cause',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Bir xil rasm, boshqa imzo', 'Та же картинка, другая подпись', 'Same picture, different labels'),
  was: { label: UI.was, expr: L('harorat va sotuv', 'температура и продажи', 'temperature and sales') },
  now: { label: UI.now, expr: L("muzqaymoq va cho'kish", 'мороженое и утопления', 'ice cream and drownings') },
  probe1: {
    question: L("Rasm o'zgaradimi?", 'Изменится ли картинка?', 'Will the picture change?'),
    items: [
      { id: 'a', label: L("yo'q, bulut o'sha", 'нет, облако то же', 'no, the same cloud'), correct: true },
      { id: 'b', label: L('ha, tarqoq bo\'ladi', 'да, станет разбросанным', 'yes, it will scatter'), hint: L("Tarqoq bo'lmaydi: yozda ikkala son ham o'sadi.", 'Не станет: летом растут оба числа.', 'It will not: both numbers grow in summer.') },
      { id: 'c', label: L('ha, pastga ketadi', 'да, пойдёт вниз', 'yes, it will go down'), hint: L("Pastga ketmaydi: ikkalasi ham birga o'sadi.", 'Вниз не пойдёт: оба растут вместе.', 'It will not go down: both grow together.') },
      { id: 'd', label: L("aniqlab bo'lmaydi", 'определить нельзя', 'cannot be determined'), hint: L("Mumkin: ikkala qator ham yozda o'sadi, demak bulut xuddi shunday.", 'Можно: оба ряда растут летом, значит облако такое же.', 'It can: both rows grow in summer, so the cloud is the same.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('Endi sabab bormi?', 'Есть ли теперь причина?', 'Is there a cause now?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: L("yo'q, sabab umumiy", 'нет, причина общая', 'no, a shared cause') },
      { id: 'b', label: L('ha, muzqaymoq aybdor', 'да, виновато мороженое', 'yes, the ice cream') },
      { id: 'c', label: L("ha, cho'kish aybdor", 'да, виноваты утопления', 'yes, the drownings') },
      { id: 'd', label: L("rasmdan bilib bo'lmaydi", 'по картинке не узнать', 'the picture cannot tell') },
    ],
  },
  holds: [4500, 6500, 1700, 3000],
  audio: [
    A('mount', "Birinchi bulut harorat va sotuv haqida edi, va u yerda hammasi tushunarli.", 'Первое облако было про температуру и продажи, и там всё понятно.', 'The first cloud was temperature and sales, and there everything is clear.'),
    A('now', "Endi imzoni almashtiramiz. Pastda muzqaymoq sotuvi, yuqorida esa suvda cho'kish hollari. Yozda ikkalasi ham o'sadi, demak bulut deyarli o'sha bo'ladi. Rasm bir xil, savol esa butunlay boshqa.", 'Теперь поменяем подписи. Внизу продажи мороженого, вверху случаи утоплений. Летом растут оба, значит облако будет почти тем же. Картинка та же, а вопрос совсем другой.', 'Now let us change the labels. Ice cream sales below, drownings above. Both grow in summer, so the cloud will be nearly the same. Same picture, an entirely different question.'),
    A('q1', "Rasm o'zgaradimi?", 'Изменится ли картинка?', 'Will the picture change?'),
    A('q2', 'Sizningcha endi sabab bormi? Shunchaki taxmin qiling.', 'Как думаешь, есть ли теперь причина? Просто предположи.', 'Do you think there is a cause now? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'corr_vs_cause',
  eyebrow: L('Ikkalasini ham tekshiramiz', 'Проверим оба', 'Let us check both'),
  title: L('Ikki tushuntirish', 'Два объяснения', 'Two explanations'),
  expr: L("muzqaymoq va cho'kish", 'мороженое и утопления', 'ice cream and drownings'),
  need: '= ?',
  answerLabel: L('javob', 'ответ', 'the answer'),
  cards: [
    {
      tag: L('A tushuntirish', 'объяснение A', 'explanation A'),
      txt: L('muzqaymoq aybdor', 'виновато мороженое', 'the ice cream'),
      point: {
        label: L('sabab shundami', 'причина в нём', 'is it the cause'),
        calc: L('qishda ham sotiladi   ✗', 'зимой тоже продают   ✗', 'sold in winter too   ✗'),
        verdict: 'out',
      },
    },
    {
      tag: L('B tushuntirish', 'объяснение B', 'explanation B'),
      txt: L('sabab umumiy: issiq', 'общая причина: жара', 'a shared cause: heat'),
      point: {
        label: L('ikkalasini ko\'taradi', 'поднимает оба', 'lifts both'),
        calc: L('issiqda suvga ko\'p tushishadi   ✓', 'в жару чаще купаются   ✓', 'more swimming in heat   ✓'),
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: [
      L('umumiy sabab', 'общая причина', 'a shared cause'),
      L('muzqaymoq', 'мороженое', 'ice cream'),
      L("cho'kish", 'утопления', 'drownings'),
      L('sabab yo\'q', 'причины нет', 'no cause'),
    ],
    value: [L('umumiy sabab', 'общая причина', 'a shared cause')],
    label: L('sabab:', 'причина:', 'cause:'),
    prompt: L('Javobni tanlang', 'Выбери ответ', 'Choose the answer'),
    wrongs: [
      { key: L('muzqaymoq', 'мороженое', 'ice cream'), hint: L("Muzqaymoq qishda ham sotiladi, lekin qishda cho'kish ko'paymaydi.", 'Мороженое продают и зимой, но зимой утопления не растут.', 'Ice cream is sold in winter too, yet drownings do not rise in winter.') },
      { key: L('sabab yo\'q', 'причины нет', 'no cause'), hint: L("Sabab bor, faqat u uchinchi: issiq havo ikkala qatorni ham ko'taradi.", 'Причина есть, только она третья: жара поднимает оба ряда.', 'There is a cause, only a third one: the heat lifts both rows.') },
      { key: '*', hint: L("Uchinchi sababni qidiring: ikkala qatorga ham ta'sir qiladigan narsa.", 'Ищи третью причину: то, что влияет на оба ряда.', 'Look for a third cause: something acting on both rows.') },
    ],
  },
  holds: [3500, 6000, 6500, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala tushuntirishni ham tekshiramiz.', 'Прогноз есть. Теперь проверим оба объяснения.', 'The guess is made. Now let us check both explanations.'),
    A('p1', "Birinchi tushuntirish: muzqaymoq aybdor. Buni tekshirish oson. Muzqaymoq qishda ham sotiladi, lekin qishda suvda cho'kish hollari ko'paymaydi. Demak sabab muzqaymoqda emas.", 'Первое объяснение: виновато мороженое. Это легко проверить. Мороженое продают и зимой, но зимой утопления не растут. Значит причина не в мороженом.', 'The first explanation: the ice cream is to blame. That is easy to check. Ice cream is sold in winter too, yet drownings do not rise in winter. So the cause is not the ice cream.'),
    A('p2', "Ikkinchi tushuntirish: sabab uchinchi va u ikkalasiga umumiy. Bu issiq havo. Issiqda odamlar muzqaymoqni ko'proq oladi, va issiqda odamlar suvga ko'proq tushadi. Ikkala qator birga o'sadi, chunki ularni bitta narsa ko'taradi.", 'Второе объяснение: причина третья и общая для обоих. Это жара. В жару люди чаще покупают мороженое и чаще заходят в воду. Оба ряда растут вместе, потому что их поднимает одно и то же.', 'The second explanation: the cause is a third one, shared by both. It is the heat. In heat people buy more ice cream and enter the water more often. Both rows grow together because one thing lifts them.'),
    A('write', "Javobni tanlang.", 'Выбери ответ.', 'Choose the answer.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: uchta savol.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'corr_vs_cause',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L("Bog'liqlik sabab emas", 'Связь это не причина', 'A link is not a cause'),
  cases: [
    {
      label: L("bog'liqlik", 'связь', 'a link'),
      text: L('bulutda ko\'rinadi', 'видна на облаке', 'visible in the cloud'),
      tone: 'graph',
    },
    {
      label: L('sabab', 'причина', 'a cause'),
      text: L("bulutda ko'rinmaydi", 'на облаке не видна', 'not visible in the cloud'),
      tone: 'accent',
    },
  ],
  rows: [
    L("bo'y va vazn: sabab bor", 'рост и вес: причина есть', 'height, weight: a cause'),
    L("muzqaymoq: umumiy sabab", 'мороженое: общая причина', 'ice cream: a shared cause'),
  ],
  probe: {
    question: L(
      "Bog'liqlik ko'rinsa, nima qilish kerak?",
      'Если связь видна, что нужно сделать?',
      'If a link is visible, what should be done?',
    ),
    items: [
      { id: 'a', label: L('uchinchi sababni qidirish', 'поискать третью причину', 'look for a third cause'), correct: true },
      { id: 'b', label: L('darhol xulosa chiqarish', 'сразу сделать вывод', 'conclude at once'), hint: L("Aynan shu xato muzqaymoqni aybdor qilgan edi.", 'Именно эта ошибка и обвинила мороженое.', 'That very mistake blamed the ice cream.') },
      { id: 'c', label: L("bog'liqlikni e'tiborsiz qoldirish", 'проигнорировать связь', 'ignore the link'), hint: L("E'tiborsiz qoldirish ham xato: bog'liqlik rost va u nimadir haqida gapiradi.", 'Игнорировать тоже ошибка: связь реальна и о чём-то говорит.', 'Ignoring is also wrong: the link is real and says something.') },
      { id: 'd', label: L("ko'proq nuqta yig'ish", 'собрать больше точек', 'collect more points'), hint: L("Nuqta ko'paytirish bog'liqlikni aniqroq qiladi, lekin sababni ko'rsatmaydi.", 'Больше точек уточнят связь, но причину не покажут.', 'More points sharpen the link but do not reveal the cause.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Sabab', 'Правило 2. Причина', 'Rule 2. The cause'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L("bog'liqlik ko'rinadi, sabab isbotlanadi", 'связь видна, причина доказывается', 'a link is seen, a cause is proven'),
    lines: [
      L("bulut faqat birga o'zgarishni ko'rsatadi", 'облако показывает только совместное изменение', 'the cloud shows only joint change'),
      L("sabab teskari ham bo'lishi mumkin", 'причина может быть и обратной', 'the cause may run the other way'),
      L("uchinchi sabab ikkalasini ham ko'tarishi mumkin", 'третья причина может поднимать оба', 'a third cause may lift both'),
      L("shuning uchun rasmga qarab sabab deyilmaydi", 'поэтому по картинке о причине не говорят', 'so a picture is never a statement of cause'),
    ],
    example: L("misol:  issiq havo ikkalasini ko'taradi", 'пример:  жара поднимает оба', 'example:  the heat lifts both'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L("bog'liqlik sabab degani emas", 'связь не значит причина', 'a link does not mean a cause'),
    lines: [
      L("1. bulutga qarang: yo'nalish bormi", '1. посмотри на облако: есть ли направление', '1. look at the cloud: is there a direction'),
      L("2. bor bo'lsa, bu bog'liqlik", '2. если есть, это связь', '2. if there is, that is a link'),
      L('3. sabab haqida alohida savol bering', '3. про причину задай отдельный вопрос', '3. ask about the cause separately'),
      L("4. uchinchi sababni qidiring", '4. ищи третью причину', '4. look for a third cause'),
    ],
  },
  holds: [4000, 6500, 4500, 5000],
  audio: [
    A('mount', 'Ikkala tushuntirish ham tekshirildi. Endi qoidani yozamiz.', 'Оба объяснения проверены. Теперь запишем правило.', 'Both explanations are checked. Now let us write the rule.'),
    A('rows', "Bog'liqlik bulutda ko'rinadi, sabab esa ko'rinmaydi. Bir xil bulut uch xil holatni yashirishi mumkin: birinchisi ikkinchisiga sabab, ikkinchisi birinchisiga sabab, yoki ikkalasini uchinchi narsa ko'taradi. Rasm bu uchtasini ajrata olmaydi.", 'Связь видна на облаке, а причина нет. Одно и то же облако может скрывать три случая: первое причина второго, второе причина первого, или оба поднимает нечто третье. Картинка эти три случая не различает.', 'A link is visible in the cloud, a cause is not. The same cloud can hide three cases: the first causes the second, the second causes the first, or a third thing lifts both. A picture cannot tell them apart.'),
    A('q', "Savol: bog'liqlik ko'rinsa, nima qilish kerak?", 'Вопрос: если связь видна, что нужно сделать?', 'The question: if a link is visible, what should be done?'),
    A('rule', "To'g'ri. Va bu darsda yana bir narsa muhim: agar ma'lumot sababni ko'rsatmasa, to'g'ri javob ma'lumot yetarli emas bo'ladi. Bu javobdan qo'rqmang.", 'Верно. И в этом уроке важно ещё одно: если данные не показывают причину, верный ответ звучит как данных недостаточно. Этого ответа не надо бояться.', 'Correct. And one more thing matters in this lesson: if the data do not show a cause, the right answer is that the data are not enough. Do not fear that answer.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. O'ZI TANLAYDI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'corr_vs_cause',
  eyebrow: L("O'zingiz tanlang", 'Выбери сам', 'Choose it yourself'),
  title: L('Xulosani tanlang', 'Выбери вывод', 'Choose the conclusion'),
  left: L("bulut yuqoriga ketyapti", 'облако идёт вверх', 'the cloud goes up'),
  template: [L('xulosa: ', 'вывод: ', 'conclusion: '), { slot: 0 }],
  signs: [L("bog'liqlik bor", 'связь есть', 'a link exists'), L('sabab bor', 'причина есть', 'a cause exists')],
  answer: L("bog'liqlik bor", 'связь есть', 'a link exists'),
  checkNote: L(
    "Bulut faqat bog'liqlikni ko'rsatadi",
    'Облако показывает только связь',
    'The cloud shows only a link',
  ),
  wrongs: [
    { key: L('sabab bor', 'причина есть', 'a cause exists'), hint: L("Sabab bulutda ko'rinmaydi: xuddi shunday bulut muzqaymoq va cho'kishda ham chiqqan edi.", 'Причина на облаке не видна: точно такое же облако вышло у мороженого и утоплений.', 'A cause is not visible in a cloud: the very same cloud came out for ice cream and drownings.') },
  ],
  probe: {
    question: L("Nega sabab emas?", 'Почему не причина?', 'Why not a cause?'),
    items: [
      { id: 'a', label: L("bir xil bulut har xil sababni yashiradi", 'одно облако скрывает разные причины', 'one cloud hides different causes'), correct: true },
      { id: 'b', label: L("nuqta kam", 'мало точек', 'too few points'), hint: L("Nuqta ko'paytirsa ham rasm sababni ko'rsatmaydi.", 'Даже с большим числом точек картинка причину не покажет.', 'Even with many points the picture will not show a cause.') },
      { id: 'c', label: L("bulut aniq emas", 'облако нечёткое', 'the cloud is fuzzy'), hint: L("Bulut juda aniq bo'lsa ham sabab ko'rinmaydi.", 'Даже у очень чёткого облака причина не видна.', 'Even a very sharp cloud shows no cause.') },
      { id: 'd', label: L("sabab hech qachon yo'q", 'причины не бывает никогда', 'there is never a cause'), hint: L("Bo'ladi: bo'y va vazn juftida sabab bor edi. Uni rasm emas, boshqa dalil ko'rsatadi.", 'Бывает: у пары рост и вес причина была. Её показывает не картинка, а другое рассуждение.', 'It happens: height and weight had a cause. Not the picture shows it, but other reasoning.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz tanlaysiz.', 'Правило собрано. Теперь выбираешь ты.', 'The rule is assembled. Now you choose.'),
    A('place', "Xulosani tanlang.", 'Выбери вывод.', 'Choose the conclusion.'),
    A('checked', "Bo'ldi. Endi ta'riflang: nega sabab emas?", 'Получилось. Теперь сформулируй: почему не причина?', 'Done. Now put it into words: why not a cause?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'look', label: L('bulutga qarash', 'посмотреть на облако', 'look at the cloud') },
  { id: 'link', label: L("bog'liqlikni aytish", 'назвать связь', 'name the link') },
  { id: 'third', label: L('uchinchi sababni qidirish', 'искать третью причину', 'seek a third cause') },
  { id: 'cause', label: L('sababni e\'lon qilish', 'объявить причину', 'declare the cause') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'corr_vs_cause',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L("muzlatkichlar va umr", 'холодильники и жизнь', 'fridges and life'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'look',
      to: L('bulut yuqoriga ketyapti', 'облако идёт вверх', 'the cloud goes up'),
      wrongs: [
        { action: 'link', hint: L("Avval qarang: bog'liqlik bor yoki yo'qligini rasm aytadi.", 'Сначала посмотри: есть ли связь, скажет картинка.', 'Look first: whether there is a link, the picture will say.') },
        { action: 'cause', hint: L("Sabab oxirgi qadam, va u ko'pincha umuman aytilmaydi.", 'Причина последний шаг, и часто её вообще не называют.', 'The cause is the last step, and often it is never named.') },
        { action: 'third', hint: L("Uchinchi sababni qidirishdan oldin bog'liqlik borligini ko'ring.", 'Прежде чем искать третью причину, убедись, что связь есть.', 'Before seeking a third cause, see that a link exists.') },
      ],
    },
    {
      action: 'link',
      to: L("bog'liqlik bor: birga o'sadi", 'связь есть: растут вместе', 'a link: they grow together'),
      wrongs: [
        { action: 'look', hint: L("Qaraldi: bulut yuqoriga ketyapti.", 'Посмотрели: облако идёт вверх.', 'Looked: the cloud goes up.') },
        { action: 'cause', hint: L("Hali erta: sabab haqida alohida savol bor.", 'Ещё рано: про причину есть отдельный вопрос.', 'Too early: the cause is a separate question.') },
        { action: 'third', hint: L("Avval bog'liqlikni ayting.", 'Сначала назови связь.', 'Name the link first.') },
      ],
    },
    {
      action: 'third',
      to: L('umumiy sabab: farovonlik', 'общая причина: благосостояние', 'a shared cause: prosperity'),
      wrongs: [
        { action: 'look', hint: L("Qaraldi.", 'Посмотрели.', 'Looked.') },
        { action: 'link', hint: L("Aytildi: bog'liqlik bor.", 'Названо: связь есть.', 'Named: there is a link.') },
        { action: 'cause', hint: L("Muzlatkich umrni uzaytirmaydi. Ikkalasini uchinchi narsa ko'taradi.", 'Холодильник жизнь не удлиняет. Оба поднимает нечто третье.', 'A fridge does not lengthen life. A third thing lifts both.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: [
      L('umumiy sabab', 'общая причина', 'a shared cause'),
      L('muzlatkich', 'холодильник', 'the fridge'),
      L("bog'liqlik yo'q", 'связи нет', 'no link'),
      L('tasodif', 'случайность', 'chance'),
    ],
    value: [L('umumiy sabab', 'общая причина', 'a shared cause')],
    label: L('xulosa:', 'вывод:', 'conclusion:'),
    prompt: L('Xulosani tanlang', 'Выбери вывод', 'Choose the conclusion'),
    wrongs: [
      { key: L('muzlatkich', 'холодильник', 'the fridge'), hint: L("Muzlatkich o'zi umrni uzaytirmaydi: boyroq shaharda ham muzlatkich ko'p, ham tibbiyot yaxshi.", 'Холодильник сам жизнь не удлиняет: в богатом городе и холодильников больше, и медицина лучше.', 'A fridge itself does not lengthen life: a richer city has more fridges and better medicine.') },
      { key: L("bog'liqlik yo'q", 'связи нет', 'no link'), hint: L("Bog'liqlik bor: bulut aniq yuqoriga ketyapti.", 'Связь есть: облако явно идёт вверх.', 'There is a link: the cloud clearly goes up.') },
      { key: '*', hint: L("Ikkala qatorni ham ko'taradigan uchinchi narsani qidiring.", 'Ищи третье, что поднимает оба ряда.', 'Look for a third thing lifting both rows.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi haqiqiy masalani o\'tamiz.', 'Правило сформулировано. Разберём настоящую задачу.', 'The rule is stated. Let us work a real problem.'),
    A('start', "Shaharlar bo'yicha ikki qator: muzlatkichlar soni va o'rtacha umr uzunligi. Diqqat: ro'yxatda ortiqcha amal bor.", 'По городам два ряда: число холодильников и средняя продолжительность жизни. Внимание: в списке есть лишнее действие.', 'Two rows across cities: the number of fridges and the mean life expectancy. Careful: the list has one superfluous action.'),
    A('step4', 'Endi xulosani tanlang.', 'Теперь выбери вывод.', 'Now choose the conclusion.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL. Javob: ma'lumot yetarli emas.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'corr_vs_cause',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Ikki qator, savol sabab haqida', 'Два ряда, вопрос о причине', 'Two rows, a question of cause'),
  start: L('kitob o\'qish va imtihon bali', 'чтение книг и балл экзамена', 'reading books and exam score'),
  actions: ACTIONS_10,
  hint: L(
    "Bulut yuqoriga ketyapti. Lekin savol sabab haqida.",
    'Облако идёт вверх. Но вопрос о причине.',
    'The cloud goes up. But the question is about cause.',
  ),
  steps: [
    {
      action: 'look',
      to: L('bulut yuqoriga', 'облако вверх', 'the cloud goes up'),
      wrongs: [
        { action: 'link', hint: L("Avval qarang.", 'Сначала посмотри.', 'Look first.') },
        { action: 'cause', hint: L("Sabab hali erta.", 'Про причину рано.', 'Too early for the cause.') },
        { action: 'third', hint: L("Avval bulutga qarang.", 'Сначала посмотри на облако.', 'Look at the cloud first.') },
      ],
    },
    {
      action: 'link',
      to: L("bog'liqlik bor", 'связь есть', 'a link exists'),
      wrongs: [
        { action: 'look', hint: L("Qaraldi.", 'Посмотрели.', 'Looked.') },
        { action: 'cause', hint: L("Sabab uchun dalil kerak, rasm yetmaydi.", 'Для причины нужно доказательство, картинки мало.', 'A cause needs proof, a picture is not enough.') },
        { action: 'third', hint: L("Avval bog'liqlikni ayting.", 'Сначала назови связь.', 'Name the link first.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: [
      L("ma'lumot yetarli emas", 'данных недостаточно', 'the data are not enough'),
      L('kitob balni oshiradi', 'книги повышают балл', 'books raise the score'),
      L('bal kitobni oshiradi', 'балл повышает чтение', 'the score raises reading'),
      L("bog'liqlik yo'q", 'связи нет', 'no link'),
    ],
    value: [L("ma'lumot yetarli emas", 'данных недостаточно', 'the data are not enough')],
    label: L('sabab haqida:', 'о причине:', 'about the cause:'),
    prompt: L('Javobni tanlang', 'Выбери ответ', 'Choose the answer'),
    wrongs: [
      { key: L('kitob balni oshiradi', 'книги повышают балл', 'books raise the score'), hint: L("Bo'lishi mumkin, lekin bulut buni isbotlamaydi: teskarisi ham, uchinchi sabab ham mumkin.", 'Возможно, но облако этого не доказывает: возможно и обратное, и третья причина.', 'Perhaps, but the cloud does not prove it: the reverse and a third cause are both possible.') },
      { key: L('bal kitobni oshiradi', 'балл повышает чтение', 'the score raises reading'), hint: L("Bu ham mumkin, va aynan shuning uchun rasmdan sabab chiqarib bo'lmaydi.", 'Это тоже возможно, и именно поэтому по картинке причину не определить.', 'That is also possible, and that is exactly why a picture cannot settle the cause.') },
      { key: L("bog'liqlik yo'q", 'связи нет', 'no link'), hint: L("Bog'liqlik bor: bulut yuqoriga ketyapti. Yetishmayotgani sabab.", 'Связь есть: облако идёт вверх. Не хватает причины.', 'The link exists: the cloud goes up. What is missing is the cause.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Kitob o'qish va imtihon bali. Bulut yuqoriga ketyapti, ya'ni bog'liqlik bor. Savol esa sabab haqida. Diqqat: javoblar orasida ma'lumot yetarli emas degani ham bor, va u ba'zan to'g'ri javob bo'ladi.", 'Чтение книг и балл экзамена. Облако идёт вверх, то есть связь есть. А вопрос о причине. Внимание: среди ответов есть и данных недостаточно, и иногда это верный ответ.', 'Reading books and the exam score. The cloud goes up, so a link exists. The question is about cause. Careful: among the answers is also the data are not enough, and sometimes that is the right one.'),
    A('answered', "Javobni tanlang.", 'Выбери ответ.', 'Choose the answer.'),
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
      id: 'b1', tag: 'corr_vs_cause', ask: true, cols: 2,
      done: L("birga o'sadi", 'растут вместе', 'they grow together'),
      prompt: L("Bulut o'ngga va yuqoriga. Nima demak?", 'Облако вправо и вверх. Что это значит?', 'The cloud goes right and up. What does it mean?'),
      items: [
        { id: 'a', label: L("ikkalasi birga o'sadi", 'растут вместе', 'they grow together'), correct: true },
        { id: 'b', label: L('biri kamayadi', 'один убывает', 'one falls'), hint: L("Unda bulut pastga ketardi.", 'Тогда облако шло бы вниз.', 'Then the cloud would go down.') },
        { id: 'c', label: L("bog'liqlik yo'q", 'связи нет', 'no link'), hint: L("Yo'nalish bor, demak bog'liqlik ham bor.", 'Направление есть, значит есть и связь.', 'There is a direction, so there is a link.') },
        { id: 'd', label: L('sabab bor', 'есть причина', 'there is a cause'), hint: L("Sabab bulutda ko'rinmaydi.", 'Причина на облаке не видна.', 'A cause is not visible in a cloud.') },
      ],
    },
    {
      id: 'b2', tag: 'corr_vs_cause', ask: true, cols: 2,
      done: L("bog'liqlik yo'q", 'связи нет', 'no link'),
      prompt: L('Nuqtalar tarqoq. Nima demak?', 'Точки разбросаны. Что это значит?', 'The points are scattered. What does it mean?'),
      items: [
        { id: 'a', label: L("bog'liqlik yo'q", 'связи нет', 'no link'), correct: true },
        { id: 'b', label: L("to'g'ri bog'liqlik", 'прямая связь', 'a direct link'), hint: L("To'g'ri bog'liqlikda nuqtalar chiziq bo'ylab tizilardi.", 'При прямой связи точки выстроились бы вдоль линии.', 'With a direct link the points would line up.') },
        { id: 'c', label: L('teskari bog\'liqlik', 'обратная связь', 'an inverse link'), hint: L("Teskarisida ham chiziq bo'lardi, faqat pastga.", 'При обратной тоже была бы линия, только вниз.', 'An inverse link would also give a line, going down.') },
        { id: 'd', label: L("ma'lumot xato", 'данные ошибочны', 'the data are wrong'), hint: L("Xato emas: bog'liqlik yo'qligi ham natija.", 'Не ошибочны: отсутствие связи это тоже результат.', 'Not wrong: no link is a result too.') },
      ],
    },
    {
      id: 'b3', tag: 'corr_vs_cause', ask: true, cols: 2,
      done: L("umumiy sabab", 'общая причина', 'a shared cause'),
      prompt: L(
        "Muzqaymoq va cho'kish: sabab nimada?",
        'Мороженое и утопления: в чём причина?',
        'Ice cream and drownings: what is the cause?',
      ),
      items: [
        { id: 'a', label: L('ikkalasiga umumiy: issiq', 'общая для обоих: жара', 'shared by both: the heat'), correct: true },
        { id: 'b', label: L('muzqaymoqda', 'в мороженом', 'the ice cream'), hint: L("Qishda ham sotiladi, lekin cho'kish ko'paymaydi.", 'Зимой тоже продают, а утоплений не больше.', 'It is sold in winter too, yet drownings do not rise.') },
        { id: 'c', label: L("cho'kishda", 'в утоплениях', 'the drownings'), hint: L("Cho'kish muzqaymoq sotuvini oshirmaydi.", 'Утопления продажи мороженого не поднимают.', 'Drownings do not raise ice cream sales.') },
        { id: 'd', label: L('sabab yo\'q', 'причины нет', 'no cause'), hint: L("Sabab bor, faqat u uchinchi.", 'Причина есть, только она третья.', 'There is a cause, only it is a third one.') },
      ],
    },
    {
      id: 'b4', tag: 'corr_vs_cause', ask: true, cols: 2,
      done: L("ma'lumot yetarli emas", 'данных недостаточно', 'the data are not enough'),
      prompt: L(
        "Bulut yuqoriga. Sabab qaysi tomonga?",
        'Облако вверх. В какую сторону причина?',
        'The cloud goes up. Which way does the cause run?',
      ),
      items: [
        { id: 'a', label: L("ma'lumot yetarli emas", 'данных недостаточно', 'the data are not enough'), correct: true },
        { id: 'b', label: L('x dan y ga', 'от x к y', 'from x to y'), hint: L("Bulut yo'nalishni ko'rsatmaydi: teskarisi ham xuddi shunday ko'rinadi.", 'Облако направления не показывает: обратное выглядит точно так же.', 'The cloud shows no direction: the reverse looks identical.') },
        { id: 'c', label: L('y dan x ga', 'от y к x', 'from y to x'), hint: L("Xuddi shu sabab: rasm ikkalasini ajratmaydi.", 'По той же причине: картинка их не различает.', 'For the same reason: the picture cannot tell them apart.') },
        { id: 'd', label: L('sabab yo\'q', 'причины нет', 'no cause'), hint: L("Yo'q deyish ham dalil talab qiladi. Rasmda dalil yo'q.", 'Сказать нет тоже требует доказательства. На картинке его нет.', 'Saying no also needs proof. The picture has none.') },
      ],
    },
    {
      id: 'b5', tag: 'corr_vs_cause', ask: true, cols: 2,
      done: L("uchinchi sababni qidirish", 'искать третью причину', 'seek a third cause'),
      prompt: L(
        "Bog'liqlik topildi. Keyingi qadam?",
        'Связь найдена. Следующий шаг?',
        'A link is found. The next step?',
      ),
      items: [
        { id: 'a', label: L('uchinchi sababni qidirish', 'искать третью причину', 'seek a third cause'), correct: true },
        { id: 'b', label: L('sababni e\'lon qilish', 'объявить причину', 'declare the cause'), hint: L("Bu aynan muzqaymoq xatosi.", 'Это и есть ошибка с мороженым.', 'That is exactly the ice cream mistake.') },
        { id: 'c', label: L("ma'lumotni tashlab yuborish", 'выбросить данные', 'discard the data'), hint: L("Ma'lumot foydali: bog'liqlik rost.", 'Данные полезны: связь настоящая.', 'The data are useful: the link is real.') },
        { id: 'd', label: L("o'rtachani sanash", 'посчитать среднее', 'compute the mean'), hint: L("O'rtacha bitta qator haqida, bu yerda esa savol ikkitasi haqida.", 'Среднее про один ряд, а вопрос здесь про два.', 'The mean is about one row; the question here is about two.') },
      ],
    },
    {
      id: 'b6', tag: 'corr_vs_cause', ask: true, cols: 2,
      done: L("bo'y va vazn", 'рост и вес', 'height and weight'),
      prompt: L('Qayerda sabab ham bor?', 'Где есть и причина?', 'Where is there a cause too?'),
      items: [
        { id: 'a', label: L("bo'y va vazn", 'рост и вес', 'height and weight'), correct: true },
        { id: 'b', label: L("muzqaymoq va cho'kish", 'мороженое и утопления', 'ice cream and drownings'), hint: L("U yerda sabab umumiy: issiq havo.", 'Там причина общая: жара.', 'There the cause is shared: the heat.') },
        { id: 'c', label: L('oy raqami va baho', 'номер месяца и оценки', 'month number and marks'), hint: L("U yerda bog'liqlik ham yo'q edi.", 'Там не было даже связи.', 'There was not even a link there.') },
        { id: 'd', label: L('hech qayerda', 'нигде', 'nowhere'), hint: L("Bo'y va vaznda sabab bor: katta odam og'irroq bo'ladi.", 'У роста и веса причина есть: крупный человек тяжелее.', 'Height and weight do have a cause: a larger person is heavier.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi tarqoq bulut.", 'Теперь разбросанное облако.', 'Now a scattered cloud.'),
    A('q3', "Muzqaymoq.", 'Мороженое.', 'The ice cream.'),
    A('q4', "Sabab yo'nalishi.", 'Направление причины.', 'The direction of the cause.'),
    A('q5', "Keyingi qadam.", 'Следующий шаг.', 'The next step.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'corr_vs_cause',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Xulosa rasmdan chiqarilgan', 'Вывод сделан по картинке', 'A conclusion drawn from a picture'),
  rows: [
    { id: 'r1', text: L("shaharlar: muzlatkich va umr", 'города: холодильники и жизнь', 'cities: fridges and life') },
    { id: 'r2', text: L('bulut yuqoriga ketyapti', 'облако идёт вверх', 'the cloud goes up') },
    { id: 'r3', text: L("demak muzlatkich umrni uzaytiradi", 'значит холодильник удлиняет жизнь', 'so the fridge lengthens life') },
    { id: 'r4', text: L("xulosa: har kimga muzlatkich", 'вывод: холодильник каждому', 'conclusion: a fridge for everyone') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Bu rost: bulut haqiqatan yuqoriga ketyapti.", 'Это правда: облако действительно идёт вверх.', 'That is true: the cloud really goes up.'),
    r4: L("Bu xulosa oldingi satrdan kelib chiqadi. Xato esa oldingisida.", 'Этот вывод следует из предыдущей строки. А ошибка в ней.', 'This conclusion follows from the previous line. The error is there.'),
  },
  proofPoint: L("bulut sababni ko'rsatmaydi", 'облако не показывает причину', 'a cloud shows no cause'),
  proof: L(
    "Bulut faqat birga o'sishni ko'rsatadi. Bu yerda uchinchi sabab bor: shahar boyroq bo'lsa, unda ham muzlatkich ko'p, ham tibbiyot yaxshi va oziq ovqat sifatli. Muzlatkichni o'zi olib borib qo'yish umrni uzaytirmaydi.",
    'Облако показывает только совместный рост. Здесь есть третья причина: чем богаче город, тем и холодильников больше, и медицина лучше, и еда качественнее. Сам по себе привезённый холодильник жизнь не удлинит.',
    'A cloud shows only joint growth. There is a third cause here: the richer the city, the more fridges, the better the medicine and the food. A fridge delivered on its own will not lengthen life.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("bog'liqlikdan sabab chiqarilgan", 'из связи сделан вывод о причине', 'a cause inferred from a link'), correct: true },
      { id: 'b', label: L("bulut noto'g'ri o'qilgan", 'облако прочитано неверно', 'the cloud was misread'), hint: L("To'g'ri o'qilgan: u haqiqatan yuqoriga ketyapti.", 'Прочитано верно: оно действительно идёт вверх.', 'It was read correctly: it really goes up.') },
      { id: 'c', label: L("ma'lumot kam", 'мало данных', 'too little data'), hint: L("Ma'lumot ko'paytirsa ham xulosa noto'g'ri qoladi.", 'Даже с большим объёмом данных вывод останется неверным.', 'Even with more data the conclusion stays wrong.') },
      { id: 'd', label: L("o'rtacha sanalmagan", 'не посчитано среднее', 'the mean was not computed'), hint: L("O'rtacha bu yerda yordam bermaydi: savol ikki qator orasidagi bog'liqlik haqida.", 'Среднее здесь не поможет: вопрос о связи двух рядов.', 'The mean will not help here: the question is the link between two rows.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning xulosasiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужой вывод.', 'The quick round is done. Now let us look at someone else\'s conclusion.'),
    A('q1', "Bu yerda birinchi ikki satr rost. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь первые две строки верны. Найди строку, в которой ошибка появилась впервые.', 'Here the first two lines are true. Find the line where the error first appeared.'),
    A('proof', "Qarang: bulut faqat birga o'sishni ko'rsatadi. Bu yerda esa uchinchi sabab bor. Shahar boyroq bo'lsa, unda ham muzlatkich ko'p, ham tibbiyot yaxshi. Muzlatkichni olib borib qo'yishning o'zi umrni uzaytirmaydi.", 'Смотри: облако показывает только совместный рост. А здесь есть третья причина. Чем богаче город, тем и холодильников больше, и медицина лучше. Сам по себе привезённый холодильник жизнь не удлинит.', 'Look: the cloud shows only joint growth. And here there is a third cause. The richer the city, the more fridges and the better the medicine. Delivering a fridge alone will not lengthen life.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'corr_vs_cause',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Xulosani yig\'ing', 'Собери вывод', 'Build the conclusion'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L("bog'liqlik sabab emas", 'связь не значит причина', 'a link is not a cause'),
  tasks: [
    {
      prompt: L("bo'y va vazn", 'рост и вес', 'height and weight'),
      template: [{ slot: 0 }, '  +  ', { slot: 1 }],
      parts: [
        L("bog'liqlik bor", 'связь есть', 'a link'),
        L('sabab bor', 'причина есть', 'a cause'),
        L("bog'liqlik yo'q", 'связи нет', 'no link'),
        L('sabab yo\'q', 'причины нет', 'no cause'),
      ],
      answer: [L("bog'liqlik bor", 'связь есть', 'a link'), L('sabab bor', 'причина есть', 'a cause')],
      doneLabel: L("bo'y va vazn: bog'liqlik ham, sabab ham", 'рост и вес: и связь, и причина', 'height and weight: link and cause'),
      wrongs: [
        { key: [L("bog'liqlik yo'q", 'связи нет', 'no link'), L('sabab yo\'q', 'причины нет', 'no cause')], hint: L("Bog'liqlik bor: katta odam og'irroq bo'ladi.", 'Связь есть: крупный человек тяжелее.', 'There is a link: a larger person is heavier.') },
        { key: '*', hint: L("Bu juftda ikkalasi ham bor.", 'В этой паре есть и то, и другое.', 'This pair has both.') },
      ],
    },
    {
      prompt: L("muzqaymoq va cho'kish", 'мороженое и утопления', 'ice cream and drownings'),
      template: [{ slot: 0 }, '  +  ', { slot: 1 }],
      parts: [
        L("bog'liqlik bor", 'связь есть', 'a link'),
        L('sabab yo\'q', 'причины нет', 'no cause'),
        L("bog'liqlik yo'q", 'связи нет', 'no link'),
        L('sabab bor', 'причина есть', 'a cause'),
      ],
      answer: [L("bog'liqlik bor", 'связь есть', 'a link'), L('sabab yo\'q', 'причины нет', 'no cause')],
      doneLabel: L("muzqaymoq: bog'liqlik bor, sabab yo'q", 'мороженое: связь есть, причины нет', 'ice cream: a link, no cause'),
      wrongs: [
        { key: [L("bog'liqlik bor", 'связь есть', 'a link'), L('sabab bor', 'причина есть', 'a cause')], hint: L("Sabab muzqaymoqda emas: qishda ham sotiladi, cho'kish esa ko'paymaydi.", 'Причина не в мороженом: зимой тоже продают, а утоплений не больше.', 'The cause is not the ice cream: it is sold in winter too, yet drownings do not rise.') },
        { key: '*', hint: L("Bog'liqlik bor, sabab esa uchinchi narsada.", 'Связь есть, а причина в третьем.', 'The link exists, the cause is a third thing.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi, va u yerda javob boshqacha.", 'А теперь второе, и там ответ другой.', 'And now the second one, with a different answer.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN. Blok yopiladi.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'corr_vs_cause',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: L("bog'liqlik sabab degani emas", 'связь не значит причина', 'a link does not mean a cause'),
  ruleLines: [
    L("bulut yo'nalishi bog'liqlikni ko'rsatadi", 'направление облака показывает связь', 'the cloud direction shows the link'),
    L("sabab bulutda ko'rinmaydi", 'причина на облаке не видна', 'the cause is not visible in the cloud'),
    L("ma'lumot yetarli emas ham javob", 'данных недостаточно это тоже ответ', 'not enough data is an answer too'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L("muzqaymoq", 'мороженое', 'ice cream'),
      right: L('ikkinchi', 'второй', 'the second'),
      map: {
        a: L('birinchi', 'первый', 'the first'),
        b: L('ikkinchi', 'второй', 'the second'),
        both: L('ikkalasi', 'оба', 'both'),
        none: L('hech kim', 'никто', 'nobody'),
      },
    },
    {
      screen: 5,
      expr: L('sabab?', 'причина?', 'a cause?'),
      right: L('umumiy sabab', 'общая причина', 'a shared cause'),
      map: {
        a: L('umumiy sabab', 'общая причина', 'a shared cause'),
        b: L('muzqaymoq', 'мороженое', 'ice cream'),
        c: L("cho'kish", 'утопления', 'drownings'),
        d: L('rasmdan bilib bo\'lmaydi', 'по картинке не узнать', 'the picture cannot tell'),
      },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L("bog'liqlik bor, sabab yo'q", 'связь есть, причины нет', 'a link exists, a cause does not'),
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Nuqtalar buluti ekraniga qayting', 'Вернись к экрану с облаком точек', 'Go back to the scatter screen'),
  },
  probe: {
    question: L(
      "Yangilikda «bog'liqlik topildi» deyilsa, nimani so'rash kerak?",
      'В новостях сказали «обнаружена связь». О чём спросить?',
      'The news says «a link was found». What should you ask?',
    ),
    items: [
      { id: 'a', label: L('sabab tekshirilganmi', 'проверяли ли причину', 'whether the cause was tested'), correct: true },
      { id: 'b', label: L("bog'liqlik kuchlimi", 'сильная ли связь', 'whether the link is strong'), hint: L("Bu foydali, lekin kuchli bog'liqlik ham sabab bo'lmasligi mumkin.", 'Это полезно, но и сильная связь может не быть причиной.', 'Useful, but even a strong link may not be a cause.') },
      { id: 'c', label: L('nechta nuqta bor', 'сколько точек', 'how many points'), hint: L("Nuqta soni bog'liqlikni aniqlaydi, sababni emas.", 'Число точек уточняет связь, а не причину.', 'The point count sharpens the link, not the cause.') },
      { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L("So'rash kerak: aynan shu joyda muzqaymoq aybdor bo'lib qoladi.", 'Спросить нужно: именно здесь мороженое и становится виноватым.', 'One must ask: this is exactly where the ice cream gets blamed.') },
    ],
  },
  sheetTitle: L("Ikki qator · shpargalka", 'Два ряда · шпаргалка', 'Two rows · cheat sheet'),
  sheetSrc: L('11-sinf · 23-dars', '11 класс · урок 23', 'Grade 11 · lesson 23'),
  lifehack: L(
    "«Bog'liqlik topildi» eshitsangiz, uchinchi sababni qidiring: ko'pincha u issiq havodek oddiy narsa.",
    'Услышал «обнаружена связь» — ищи третью причину: часто она проста, как жара.',
    'Hear «a link was found»? Look for a third cause: often it is as plain as the heat.',
  ),
  holds: [2500, 7000, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Ikkinchi haq edi: bog'liqlik bor, lekin sabab muzqaymoqda emas.", 'Вот твои прогнозы и вот как оказалось. Прав был второй: связь есть, но причина не в мороженом.', 'Here are your guesses and here is how it turned out. The second was right: a link exists, but the cause is not the ice cream.'),
    A('rule', "Va mana asosiy fikr. Nuqtalar buluti bog'liqlikni ko'rsatadi va buni yaxshi qiladi. Lekin sababni u ko'rsatmaydi va ko'rsata olmaydi: bir xil bulut uchta har xil holatda chiqadi. Shuning uchun sabab haqida savol alohida beriladi, va javob ba'zan ma'lumot yetarli emas bo'ladi.", 'И вот главная мысль. Облако точек показывает связь, и делает это хорошо. Но причину оно не показывает и показать не может: одно и то же облако выходит в трёх разных случаях. Поэтому вопрос о причине задают отдельно, и ответом иногда бывает данных недостаточно.', 'And here is the main point. A scatter shows the link, and does it well. But it does not show the cause and cannot: the same cloud arises in three different cases. So the cause is asked separately, and the answer is sometimes that the data are not enough.'),
    A('q', "Oxirgi savol: yangilikda bog'liqlik topildi deyilsa, nimani so'raysiz?", 'Последний вопрос: в новостях сказали, что обнаружена связь. О чём спросишь?', 'The last question: the news says a link was found. What will you ask?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
