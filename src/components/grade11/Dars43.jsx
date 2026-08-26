// ============================================================================
// 11-sinf, Dars 43. HOSILA: O'ZGARISH TEZLIGI.
//
// B6 blokining birinchi darsi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SecantBoard`, `secant` rejimi
//   darslik:  1-qism, I bob «Hosila va uning tatbiqlari», 3-23-betlar
//             (1-6 soatlar): orttirmalar nisbati, urinma ta'rifi, hosilaning
//             geometrik va fizik ma'nosi, 22-bet 13-15-mashqlar
//
// DARSNING BITTA GAPI: o'rtacha tezlik oraliqda o'lchanadi, oniy tezlik esa
// NUQTADA, va u ayirmali nisbatning limiti -- ya'ni hosila.
//
// NEGA BU DARS BOR. Kursda hosila hech qayerda o'rgatilmagan: B1 bloki
// (boshlang'ich funksiya va integral) uni ALLAQACHON bilingan deb olgan.
// Darslik esa hosilaga 36 soat beradi. Metodist qarori 2026-08-21: mavzu
// uchta darsni oladi (43, 44, 45), va ular ETALON bo'yicha yoziladi, DTM
// rejimida emas -- o'rgatilmagan mavzuni «masala darrov» shaklida berish
// sinov bo'ladi, dars bo'lmaydi.
//
// SONLAR TEKSHIRILDI (s(t) = t², ya'ni yo'l vaqtning kvadrati):
//   [2; 3]    (9 − 4) / 1 = 5
//   [2; 2,5]  (6,25 − 4) / 0,5 = 4,5
//   [2; 2,1]  (4,41 − 4) / 0,1 = 4,1
//   [2; 2,01] (4,0401 − 4) / 0,01 = 4,01     -> 4 ga intiladi
//   oniy tezlik t = 2 da: ikki karra ikki = 4
//   chizma qadamlari x0 = 2, h = 1; 0,5; 0,25 -> 5; 4,5; 4,25, urinma 4
//   yangi holat x0 = 1: (1 + h)² − 1 = 2h + h² -> 2 + h -> 2   [darslik 17-bet]
//   ikki yo'l t = 3: o'rtacha [3; 4] da 7, oniy 6
//   ishora: −x² + 4x, hosila −2x + 4, x = 3 da −2, ya'ni MANFIY
//   zanjir x = 3: (3 + h)² − 9 = 6h + h² -> 6 + h -> 6
//   teskari masala: ikki karra t = 10 -> t = 5
//   blits: [1; 7] da (49 − 1) / 6 = 8; x0 = 5 da nisbat 10 + h;
//          −3 da hosila −6; 4t da oniy tezlik 4; ikki karra t = 14 -> t = 7
//   audit x0 = 4: 8h + h² -> 8 + h -> 8, teskari yozuvda esa bir bo'lingan sakkiz
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_43',
  title: L('Hosila: o\'zgarish tezligi', 'Производная: скорость изменения', 'The derivative: a rate of change'),
}

const BLOCK = { label: 'B6', from: 43, to: 49, current: 43 }

// Yo'l qonuni butun dars bo'yi BITTA: vaqtning kvadrati. Asbob qiyalikni
// shu funksiyaning O'ZIDAN sanaydi, ya'ni chizmada javob yozilmagan.
const SQ = (x) => x * x

// ============================================================
// SLAYD 1. XUK. Ikki javob: oraliqdagi tezlik va nuqtadagi tezlik.
// Ismlar darslikning 3-betidan (Karim va Nargiza).
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Hosila', 'Производная', 'The derivative'),
  title: L('Ikkinchi sekundda qancha', 'Сколько во вторую секунду', 'How fast at the second second'),
  expr: L('yo\'l vaqtning kvadrati', 'путь равен квадрату времени', 'the path is time squared'),
  rows: [
    {
      id: 'a',
      name: L('Karim', 'Карим', 'Karim'),
      value: L('tezlik 5', 'скорость 5', 'the speed is 5'),
    },
    {
      id: 'b',
      name: L('Nargiza', 'Наргиза', 'Nargiza'),
      value: L('tezlik 4', 'скорость 4', 'the speed is 4'),
    },
  ],
  probe: {
    question: L(
      'Ikkinchi sekundda tezlik qanchaga teng?',
      'Чему равна скорость во вторую секунду?',
      'What is the speed at the second second?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi tekshiramiz.',
      'Твой ответ записан. Сейчас проверим.',
      'Your answer is saved. Now we will check.',
    ),
    items: [
      { id: 'a', label: '4' },
      { id: 'b', label: '4,5' },
      { id: 'c', label: '5' },
      { id: 'd', label: '9' },
    ],
  },
  holds: [4000, 5000, 6000],
  audio: [
    A('mount', "Yangi blok boshlanadi. Bu darsda tezlik nuqtada o'lchanadi.", 'Начинается новый блок. На этом уроке скорость измеряется в точке.', 'A new block begins. In this lesson speed is measured at a point.'),
    A('r1', "Nuqta to'g'ri chiziq bo'ylab harakatlanadi. Uning yo'li vaqtning kvadratiga teng. Karim ikkinchi sekunddan uchinchisiga qadar hisoblaydi va tezlik besh deb aytadi.", 'Точка движется по прямой. Её путь равен квадрату времени. Карим считает от второй секунды до третьей и говорит, что скорость пять.', 'A point moves along a line. Its path equals time squared. Karim counts from the second second to the third and says the speed is five.'),
    A('r2', "Nargiza esa boshqa javob beradi. Uning aytishicha, aynan ikkinchi sekundda tezlik to'rtga teng.", 'А Наргиза даёт другой ответ. По её словам, именно во вторую секунду скорость равна четырём.', 'Nargiza gives another answer. She says that exactly at the second second the speed is four.'),
    A('ask', "Sizningcha qaysi son ikkinchi sekunddagi tezlik. Hozircha shunchaki taxmin qiling.", 'Как думаешь, какое число и есть скорость во вторую секунду. Пока просто предположи.', 'Which number do you think is the speed at the second second. Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. TAYANCH. Uchtasi ham quyi sinflardan.
// ============================================================
const S2 = {
  role: 'support',
  eyebrow: L('Tayanchni tekshirish', 'Проверка опоры', 'Checking the basics'),
  title: L('Uch tayanch', 'Три опоры', 'Three basics'),
  lead: L(
    "Uchtasi ham tanish. Bu baholanmaydi.",
    'Все три знакомы. Это не оценивается.',
    'All three are familiar. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Burchak koeffitsiyenti', 'Угловой коэффициент', 'The slope'),
      short: L('qiyalik', 'наклон', 'the tilt'),
      ex: [{ e: 'y = kx + b', why: L("k qiyalikni beradi", 'k задаёт наклон', 'k gives the tilt') }],
    },
    {
      id: 'c2',
      title: L("O'rtacha tezlik", 'Средняя скорость', 'Average speed'),
      short: L('oraliqda', 'на промежутке', 'over an interval'),
      ex: [{ e: L("yo'l bo'lingan vaqt", 'путь делить на время', 'path over time'), why: L('oraliq kerak', 'нужен промежуток', 'an interval is needed') }],
    },
    {
      id: 'c3',
      title: L('Orttirma', 'Приращение', 'An increment'),
      short: L('oxiri minus boshi', 'конец минус начало', 'the end minus the start'),
      ex: [{ e: 'Δx = x₂ − x₁', why: L('ishorasi bilan', 'со знаком', 'with its sign') }],
    },
  ],
  tasks: [
    {
      id: 't1',
      prompt: L('y = 3x + 1 to\'g\'ri chizig\'ining qiyaligi?', 'Наклон прямой y = 3x + 1?', 'The slope of the line y = 3x + 1?'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '1', hint: L("Bir bu o'qni kesish joyi, qiyalik esa x oldidagi son.", 'Один это место пересечения оси, а наклон это число перед x.', 'One is where it cuts the axis, the slope is the number in front of x.') },
        { id: 'c', label: '4', hint: L("Sonlar qo'shilmaydi: qiyalik faqat x oldidagi son.", 'Числа не складываются: наклон это только число перед x.', 'The numbers do not add: the slope is only the number in front of x.') },
        { id: 'd', label: L("qiyalik yo'q", 'наклона нет', 'no slope'), hint: L("Qiyalik bor: chiziq gorizontal emas, u tepaga ko'tariladi.", 'Наклон есть: линия не горизонтальна, она поднимается.', 'There is a slope: the line is not horizontal, it rises.') },
      ],
    },
    {
      id: 't2',
      prompt: L('2 dan 5 gacha vaqt orttirmasi?', 'Приращение времени от 2 до 5?', 'The increment of time from 2 to 5?'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '7', hint: L("Orttirma ayirma bilan topiladi, yig'indi bilan emas.", 'Приращение находят разностью, а не суммой.', 'An increment is found by a difference, not a sum.') },
        { id: 'c', label: '2,5', hint: L("Bo'lish kerak emas: orttirma bu oxiri minus boshi.", 'Делить не нужно: приращение это конец минус начало.', 'No division needed: an increment is the end minus the start.') },
        { id: 'd', label: '−3', hint: L("Ishora teskari: boshidan oxirigacha vaqt O'SDI.", 'Знак обратный: к концу время СТАЛО БОЛЬШЕ.', 'The sign is reversed: from start to end the time GREW.') },
      ],
    },
  ],
  holds: [3200, 4200, 4000, 3600],
  audio: [
    A('mount', "Uchta tayanch kerak, va uchtasi ham tanish.", 'Нужны три опоры, и все три знакомы.', 'Three basics are needed, and all three are familiar.'),
    A('c1', "Birinchisi qiyalik. To'g'ri chiziqda x oldidagi son uning qiyaligini beradi.", 'Первая это наклон. У прямой число перед x задаёт её наклон.', 'The first is the slope. For a line the number in front of x gives its tilt.'),
    A('c2', "Ikkinchisi o'rtacha tezlik. Uni topish uchun ORALIQ kerak, ya'ni boshi va oxiri.", 'Вторая это средняя скорость. Чтобы её найти, нужен ПРОМЕЖУТОК, то есть начало и конец.', 'The second is average speed. To find it you need an INTERVAL, that is a start and an end.'),
    A('t1', "Ikkita savol.", 'Два вопроса.', 'Two questions.'),
  ],
}

// ============================================================
// SLAYD 3. NUQTALAR. Oraliq qisqarganda nisbat qayerga boradi.
// Bu yerda o'quvchi HISOBLAMAYDI, TARTIBNI ko'radi.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'avg_vs_inst',
  eyebrow: L('Oraliqni qisqartiramiz', 'Сужаем промежуток', 'Shrinking the interval'),
  title: L('Nisbat qayerga boradi', 'Куда идёт отношение', 'Where the ratio goes'),
  expr: L('boshi hamma yerda 2', 'начало везде 2', 'the start is 2 everywhere'),
  goal: L('nisbatning yo\'nalishini aniqlash', 'определить, куда идёт отношение', 'find where the ratio is heading'),
  rule: L(
    "Har bir oraliqda o'rtacha tezlikni o'qiymiz.",
    'В каждом промежутке читаем среднюю скорость.',
    'In each interval we read the average speed.',
  ),
  pick: L('Qaysi oraliqni tekshiramiz?', 'Какой промежуток проверим?', 'Which interval shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L("sonlar 5 atrofida qoladi", 'числа остаются около 5', 'the numbers stay near 5'), value: '5' },
    { id: 'b', key: 'inB', name: L("sonlar 4 ga intiladi", 'числа стремятся к 4', 'the numbers tend to 4'), value: '4' },
  ],
  points: [
    {
      id: 'q1', label: '[2; 3]', num: '5', step: 'calc', verdict: 'out',
      calc: L('9 minus 4, bo\'lingan 1', '9 минус 4, делить на 1', '9 minus 4, over 1'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q2', label: '[2; 2,5]', num: '4,5', step: 'calc', verdict: 'out',
      calc: L('6,25 minus 4, bo\'lingan 0,5', '6,25 минус 4, делить на 0,5', '6.25 minus 4, over 0.5'),
      sol: false, inA: false, inB: true,
    },
    {
      id: 'q3', label: '[2; 2,1]', num: '4,1', step: 'calc', verdict: 'in',
      calc: L('4,41 minus 4, bo\'lingan 0,1', '4,41 минус 4, делить на 0,1', '4.41 minus 4, over 0.1'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q4', label: '[2; 2,01]', num: '4,01', step: 'calc', verdict: 'in',
      calc: L('4,0401 minus 4, bo\'lingan 0,01', '4,0401 минус 4, делить на 0,01', '4.0401 minus 4, over 0.01'),
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L(
      "Oraliq qisqarganda o'rtacha tezlik qayerga intiladi?",
      'Куда стремится средняя скорость, когда промежуток сужается?',
      'Where does the average speed tend as the interval shrinks?',
    ),
    items: [
      { id: 'b', label: '4', correct: true },
      { id: 'a', label: '5', hint: L("Besh eng KENG oraliqda chiqdi. Oraliq qisqargani sari son beshdan uzoqlashadi.", 'Пять получилось на самом ШИРОКОМ промежутке. Чем короче промежуток, тем дальше число от пяти.', 'Five came from the WIDEST interval. The shorter the interval, the further the number from five.') },
      { id: 'c', label: '0', hint: L("Nisbat nolga tushmaydi: pay ham, maxraj ham birga kichrayadi.", 'Отношение не падает к нулю: и числитель, и знаменатель уменьшаются вместе.', 'The ratio does not fall to zero: the top and the bottom shrink together.') },
      { id: 'd', label: '2', hint: L("Ikki bu vaqt, tezlik emas.", 'Два это время, а не скорость.', 'Two is the time, not the speed.') },
    ],
  },
  holds: [3000, 4500, 2400, 2600, 9000],
  audio: [
    A('mount', "Taxmin bor. Endi to'rtta oraliqni ko'ramiz.", 'Прогноз есть. Теперь посмотрим четыре промежутка.', 'The guess is made. Now let us look at four intervals.'),
    A('mount', "Ikki da'vo bor. Biri sonlar besh atrofida qoladi deydi, ikkinchisi sonlar to'rtga intiladi deydi.", 'Есть два утверждения. Одно говорит, что числа остаются около пяти, другое, что числа стремятся к четырём.', 'There are two claims. One says the numbers stay near five, the other that they tend to four.'),
    A('mount', "To'rtta oraliqni birma bir o'qiymiz.", 'Прочитаем четыре промежутка по одному.', 'Let us read the four intervals one by one.'),
    A('calc', 'Hisoblaymiz.', 'Считаем.', 'We compute.'),
    A('mark', "Mana natija. Eng keng oraliqda besh chiqdi, keyin to'rt butun besh, keyin to'rt butun bir, va oxirida to'rt butun nol bir. Sonlar to'rtga siqilib boradi, lekin unga hech qachon tegmaydi, chunki oraliq nolga aylanmaydi. Demak birinchi da'vo yiqildi.", 'Вот результат. На самом широком промежутке вышло пять, потом четыре целых пять, потом четыре целых одна, и в конце четыре целых ноль одна. Числа сжимаются к четырём, но никогда его не касаются, потому что промежуток не становится нулём. Значит первое утверждение упало.', 'Here is the result. On the widest interval we got five, then four point five, then four point one, and finally four point zero one. The numbers squeeze towards four, but never touch it, because the interval never becomes zero. So the first claim fell.'),
  ],
}

// ============================================================
// SLAYD 4. CHIZMA. Kesuvchi urinmaga o'tadi (darslik 12-13-rasmlar).
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'deriv_vs_value',
  drag: false,
  graphSteps: 3,
  eyebrow: L('Chizma', 'Чертёж', 'The drawing'),
  title: L('Kesuvchi urinmaga o\'tadi', 'Секущая переходит в касательную', 'The secant turns into the tangent'),
  chip: L('yo\'l vaqtning kvadrati', 'путь равен квадрату времени', 'the path is time squared'),
  secant: {
    fn: SQ,
    xDomain: [-0.4, 3.6],
    yDomain: [-1, 13],
    xTicks: [{ v: 1 }, { v: 2 }, { v: 3 }],
    yTicks: [{ v: 4 }, { v: 8 }, { v: 12 }],
    mode: 'secant',
    x0: 2,
    hs: [1, 0.5, 0.25],
    keepSecant: 'first',
    hLabel: 'Δt',
    riseLabel: 'Δs',
    ratioLabel: L("o'rtacha", 'средняя', 'average'),
    slopeLabel: L('oniy', 'мгновенная', 'instant'),
    curveLabel: 's (t)',
  },
  bonus: L(
    "Urinma bitta nuqtada tegib o'tadi, kesuvchi esa ikkitasida kesib o'tadi.",
    'Касательная касается в одной точке, а секущая пересекает в двух.',
    'A tangent touches at one point, a secant cuts at two.',
  ),
  probe: {
    question: L(
      'Nuqtadagi urinmaning qiyaligi nimani beradi?',
      'Что даёт наклон касательной в точке?',
      'What does the slope of the tangent at a point give?',
    ),
    items: [
      { id: 'a', label: L('shu nuqtadagi tezlikni', 'скорость в этой точке', 'the speed at that point'), correct: true },
      { id: 'b', label: L('oraliqdagi yo\'lni', 'путь на промежутке', 'the path over an interval'), hint: L("Yo'l egri chiziqning balandligi, qiyalik esa tezlik.", 'Путь это высота кривой, а наклон это скорость.', 'The path is the height of the curve, the slope is the speed.') },
      { id: 'c', label: L('o\'rtacha tezlikni', 'среднюю скорость', 'the average speed'), hint: L("O'rtacha tezlikni KESUVCHI beradi, unga ikkita nuqta kerak.", 'Среднюю скорость даёт СЕКУЩАЯ, ей нужны две точки.', 'The average speed comes from the SECANT, it needs two points.') },
      { id: 'd', label: L('vaqtni', 'время', 'the time'), hint: L("Vaqt gorizontal o'qda turadi, qiyalik esa son.", 'Время стоит на горизонтальной оси, а наклон это число.', 'Time sits on the horizontal axis, the slope is a number.') },
    ],
  },
  holds: [4500, 4200, 4000],
  audio: [
    A('mount', "Xuddi shu narsa chizmada. Ikkita nuqtadan o'tgan chiziq kesuvchi deb ataladi, va uning qiyaligi o'rtacha tezlik.", 'То же самое на чертеже. Линия через две точки называется секущей, и её наклон это средняя скорость.', 'The same thing on the drawing. A line through two points is called a secant, and its tilt is the average speed.'),
    A('mount', "Ikkinchi nuqta birinchisiga yaqinlashadi, va kesuvchi buriladi. Pastdagi son ham o'zgaradi.", 'Вторая точка приближается к первой, и секущая поворачивается. Число внизу тоже меняется.', 'The second point comes closer to the first, and the secant turns. The number below changes too.'),
    A('mount', "Yana yaqinroq siljitamiz, va pastdagi son yana kamayadi.", 'Сдвигаем ещё ближе, и число внизу снова уменьшается.', 'We slide it closer still, and the number below drops again.'),
    A('mount', "Va mana chegaraviy holat. Kesuvchi to'xtadi va bitta nuqtada tegib turadi. Bunday chiziq urinma deb ataladi, va uning qiyaligi to'rtga teng. Bu aynan Nargizaning javobi.", 'И вот предельное положение. Секущая остановилась и касается в одной точке. Такая линия называется касательной, и её наклон равен четырём. Это и есть ответ Наргизы.', 'And here is the limiting position. The secant has stopped and touches at one point. Such a line is called a tangent, and its tilt equals four. That is exactly Nargiza answer.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1. Ta'rif (darslik 18-bet).
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'limit_needed',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 2,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Ayirmali nisbatning limiti', 'Предел разностного отношения', 'The limit of the difference ratio'),
  rows: [
    { text: 'Δs = s (t + h) − s (t)' },
    { text: 'Δs / h' },
    { text: 'h → 0' },
  ],
  probe: {
    question: L(
      "Nima uchun h o'rniga darrov nol qo'yib bo'lmaydi?",
      'Почему нельзя сразу подставить ноль вместо h?',
      'Why can we not just put zero in place of h?',
    ),
    items: [
      { id: 'a', label: L('nol bo\'lingan nol chiqadi', 'выйдет ноль делить на ноль', 'it gives zero over zero'), correct: true },
      { id: 'b', label: L('javob juda katta bo\'ladi', 'ответ будет слишком большим', 'the answer becomes too large'), hint: L("Kattalik masalasi emas: nolga bo'linish umuman aniqlanmagan.", 'Дело не в величине: деление на ноль вообще не определено.', 'It is not about size: division by zero is simply undefined.') },
      { id: 'c', label: L('h musbat bo\'lishi shart', 'h обязан быть положительным', 'h must be positive'), hint: L("h manfiy ham bo'lishi mumkin: nuqtaga chapdan ham yaqinlashiladi.", 'h может быть и отрицательным: к точке подходят и слева.', 'h may be negative too: the point is approached from the left as well.') },
      { id: 'd', label: L('qo\'yish mumkin', 'подставить можно', 'we may substitute'), hint: L("Qo'yilsa, maxrajda nol turadi va yozuv ma'nosini yo'qotadi.", 'Если подставить, в знаменателе окажется ноль и запись потеряет смысл.', 'If we substitute, the bottom becomes zero and the record loses meaning.') },
    ],
  },
  rule: {
    title: L('Hosila', 'Производная', 'The derivative'),
    lines: [
      L('avval nisbat tuziladi', 'сначала строится отношение', 'first the ratio is built'),
      L('keyin h nolga intiladi', 'потом h стремится к нулю', 'then h tends to zero'),
      L('natija nuqtadagi son', 'результат это число в точке', 'the result is a number at the point'),
    ],
  },
  holds: [4000, 6500, 4200],
  audio: [
    A('mount', "Endi buni yozib qo'yamiz. Avval funksiya orttirmasi olinadi, ya'ni oxirgi qiymat minus boshlang'ich qiymat.", 'Теперь запишем это. Сначала берут приращение функции, то есть конечное значение минус начальное.', 'Now let us write it down. First we take the increment of the function, the final value minus the initial one.'),
    A('mount', "Keyin bu orttirma vaqt orttirmasiga bo'linadi. Shu bo'linma ayirmali nisbat deb ataladi, va u aynan o'rtacha tezlik.", 'Потом это приращение делят на приращение времени. Это отношение называется разностным, и оно есть средняя скорость.', 'Then this increment is divided by the increment of time. That quotient is called the difference ratio, and it is the average speed.'),
    A('rule', "Va uchinchi qadam eng muhimi. h nolga INTILADI, lekin nolga aylanmaydi. Shu intilishning natijasi hosila deb ataladi, va uni topish amali differensiallash deyiladi.", 'И третий шаг самый важный. h СТРЕМИТСЯ к нулю, но нулём не становится. Результат этого стремления называется производной, а само действие дифференцированием.', 'And the third step matters most. h TENDS to zero, but never becomes zero. The result of that tending is called the derivative, and finding it is called differentiation.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT. Boshqa nuqta -> boshqa hosila (darslik 17-bet).
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'deriv_vs_value',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L("Nuqta o'zgardi", 'Точка изменилась', 'The point has changed'),
  was: { label: UI.was, expr: L('nuqta 2, hosila 4', 'точка 2, производная 4', 'point 2, derivative 4') },
  now: { label: UI.now, expr: L('nuqta 1, hosila 2', 'точка 1, производная 2', 'point 1, derivative 2') },
  probe1: {
    cols: 2,
    question: L("Hosila nuqtaga bog'liqmi?", 'Зависит ли производная от точки?', 'Does the derivative depend on the point?'),
    items: [
      { id: 'a', label: L('ha', 'да', 'yes'), correct: true },
      { id: 'b', label: L("yo'q", 'нет', 'no'), hint: L("Ikkida to'rt chiqdi, birda esa ikki. Sonlar boshqa.", 'В двух вышло четыре, а в одном два. Числа разные.', 'At two it gave four, at one it gives two. The numbers differ.') },
    ],
  },
  probe2: {
    cols: 4,
    question: L(
      'Uchinchi sekunddagi tezlik qanday?',
      'Какова скорость в третью секунду?',
      'What is the speed at the third second?',
    ),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '6' },
      { id: 'b', label: '7' },
      { id: 'c', label: '9' },
      { id: 'd', label: '3' },
    ],
  },
  holds: [3900, 6000, 3600],
  audio: [
    A('mount', "To'rt soni ikkinchi sekundga tegishli edi. Boshqa nuqtada nima bo'ladi.", 'Число четыре относилось ко второй секунде. Что будет в другой точке.', 'The number four belonged to the second second. What happens at another point.'),
    A('now', "Birinchi nuqtada xuddi shu yo'l bilan yuramiz. Bir plyus h ning kvadrati minus bir ikki h plyus h kvadrat beradi. Bo'lganimizdan keyin ikki plyus h qoladi, va h nolga intilganda ikki chiqadi.", 'В первой точке идём тем же путём. Один плюс h в квадрате минус один даёт два h плюс h в квадрате. После деления остаётся два плюс h, а при стремлении h к нулю выходит два.', 'At the point one we walk the same way. One plus h squared minus one gives two h plus h squared. After dividing, two plus h remains, and as h tends to zero we get two.'),
    A('q1', "Demak hosila nuqtaga bog'liqmi.", 'Значит зависит ли производная от точки.', 'So does the derivative depend on the point.'),
    A('q2', "Endi taxmin qiling: uchinchi sekundda tezlik qanday bo'ladi.", 'Теперь предположи: какова будет скорость в третью секунду.', 'Now make a guess: what will the speed be at the third second.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI YO'L. O'rtacha va oniy: ikkisi ham hisoblanadi, biri javob.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'avg_vs_inst',
  eyebrow: L('Ikki yo\'l', 'Два пути', 'Two paths'),
  title: L('Uchinchi sekunddagi tezlik', 'Скорость в третью секунду', 'The speed at the third second'),
  expr: L('nuqta t = 3', 'точка t = 3', 'the point t = 3'),
  need: L('nuqtadagi tezlik', 'скорость в точке', 'the speed at a point'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      // Kartochka matni O'RALMAYDI: ruscha uzun variant telefonda 29 px
      // oshib ketgan edi. Sonlar ekranda RAQAM bilan, ovozda esa so'z bilan.
      txt: L('oraliq 3 dan 4 gacha', 'промежуток от 3 до 4', 'the interval from 3 to 4'),
      point: {
        label: L('uning soni', 'его число', 'his number'),
        calc: '7',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('oraliqni nolga qisqartiradi', 'сужает промежуток до нуля', 'shrinks the interval to zero'),
      point: {
        label: L('uning soni', 'её число', 'her number'),
        calc: '6',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['6', '7', '9', '3'],
    value: ['6'],
    label: L('tezlik =', 'скорость =', 'speed ='),
    prompt: L('Nuqtadagi tezlikni yozing', 'Запиши скорость в точке', 'Write the speed at the point'),
    wrongs: [
      { key: '7', hint: L("Bu oraliqdagi o'rtacha tezlik. Uni ikkita nuqta beradi, savol esa bitta nuqta haqida.", 'Это средняя скорость на промежутке. Её дают две точки, а вопрос об одной.', 'That is the average speed over an interval. Two points give it, and the question is about one.') },
      { key: '9', hint: L("To'qqiz bu uchinchi sekunddagi YO'L, tezlik emas.", 'Девять это ПУТЬ в третью секунду, а не скорость.', 'Nine is the PATH at the third second, not the speed.') },
      { key: '3', hint: L("Uch bu vaqt. Tezlik undan ikki barobar katta chiqadi.", 'Три это время. Скорость выходит вдвое больше.', 'Three is the time. The speed comes out twice as large.') },
      { key: '*', hint: L("Oraliq nolga qisqarganda nisbat oltiga intiladi.", 'Когда промежуток сужается до нуля, отношение стремится к шести.', 'As the interval shrinks to zero, the ratio tends to six.') },
    ],
  },
  holds: [4200, 4500, 5500],
  audio: [
    A('mount', "Taxmin yozildi. Endi ikki o'quvchi ikki xil yo'l bilan boradi.", 'Догадка записана. Теперь два ученика идут двумя разными путями.', 'The guess is saved. Now two students take two different paths.'),
    A('p1', "Aziz oraliq oladi va yettini topadi. Uning hisobi to'g'ri, lekin bu oraliqdagi o'rtacha tezlik.", 'Азиз берёт промежуток и находит семь. Его счёт верен, но это средняя скорость на промежутке.', 'Aziz takes an interval and finds seven. His arithmetic is right, but that is the average speed over the interval.'),
    A('p2', "Dilnoza esa oraliqni nolga qisqartiradi. Uning nisbati oltiga intiladi, va aynan shu son nuqtadagi tezlik. Ikkisi ham to'g'ri hisobladi, lekin savolga faqat bittasi javob beradi.", 'А Дилноза сужает промежуток до нуля. Её отношение стремится к шести, и именно это число есть скорость в точке. Оба посчитали верно, но на вопрос отвечает только одно число.', 'Dilnoza shrinks the interval to zero. Her ratio tends to six, and that number is the speed at the point. Both computed correctly, but only one answers the question.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2. Ikki ma'no bitta qoidaga yig'iladi.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'deriv_vs_value',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Hosilaning ikki ma\'nosi', 'Два смысла производной', 'Two meanings of the derivative'),
  cases: [
    {
      tag: L('harakat', 'движение', 'motion'),
      txt: L('hosila oniy tezlikni beradi', 'производная даёт мгновенную скорость', 'the derivative gives the instant speed'),
    },
    {
      tag: L('chizma', 'чертёж', 'a drawing'),
      txt: L('hosila urinmaning qiyaligini beradi', 'производная даёт наклон касательной', 'the derivative gives the slope of the tangent'),
    },
  ],
  rows: [
    { text: L('harakat: tezlik', 'движение: скорость', 'motion: speed') },
    { text: L('chizma: qiyalik', 'чертёж: наклон', 'a drawing: the slope') },
  ],
  probe: {
    question: L(
      'Ikki ma\'no orasida nima umumiy?',
      'Что общего у двух смыслов?',
      'What do the two meanings share?',
    ),
    items: [
      { id: 'a', label: L('ikkisi ham o\'zgarish tezligi', 'оба это скорость изменения', 'both are a rate of change'), correct: true },
      { id: 'b', label: L('ikkisi ham yo\'lni beradi', 'оба дают путь', 'both give the path'), hint: L("Yo'l funksiyaning O'ZI, hosila esa uning o'zgarish tezligi.", 'Путь это САМА функция, а производная её скорость изменения.', 'The path is the function ITSELF, the derivative is its rate of change.') },
      { id: 'c', label: L('hech nima', 'ничего', 'nothing'), hint: L("Umumiylik bor: ikkisi ham nisbatning limiti sifatida topiladi.", 'Общее есть: оба находятся как предел отношения.', 'They do share something: both are found as a limit of a ratio.') },
      { id: 'd', label: L('ikkisi ham vaqtga bog\'liq', 'оба зависят от времени', 'both depend on time'), hint: L("Chizmada vaqt yo'q: gorizontal o'qda ixtiyoriy miqdor turishi mumkin.", 'На чертеже времени нет: по горизонтальной оси может стоять любая величина.', 'A drawing has no time: any quantity may sit on the horizontal axis.') },
    ],
  },
  rule: {
    title: L('Bitta qoida', 'Одно правило', 'One rule'),
    lines: [
      L("hosila o'zgarish tezligi", 'производная это скорость изменения', 'the derivative is a rate of change'),
      L('harakatda tezlik', 'в движении скорость', 'in motion, the speed'),
      L('chizmada qiyalik', 'на чертеже наклон', 'on a drawing, the slope'),
    ],
  },
  swap: {
    title: L('Jamlanma', 'Свод', 'The summary'),
    lines: [
      L("nuqtadagi hosila -- bitta son", 'производная в точке это одно число', 'the derivative at a point is one number'),
      L('u urinmaning qiyaligiga teng', 'она равна наклону касательной', 'it equals the slope of the tangent'),
    ],
  },
  holds: [4000, 7000, 2800],
  audio: [
    A('mount', "Ikki holat ko'rildi. Harakat va chizma.", 'Два случая рассмотрены. Движение и чертёж.', 'Two cases have been seen. Motion and a drawing.'),
    A('mount', "Harakatda hosila oniy tezlikni beradi, ya'ni yo'l qanchalik tez o'zgarayotganini. Chizmada esa u urinmaning qiyaligini beradi, ya'ni egri chiziq qanchalik tik ko'tarilayotganini. Ikkisi bitta gap.", 'В движении производная даёт мгновенную скорость, то есть как быстро меняется путь. На чертеже она даёт наклон касательной, то есть насколько круто поднимается кривая. Это одно и то же.', 'In motion the derivative gives the instant speed, that is how fast the path changes. On a drawing it gives the slope of the tangent, that is how steeply the curve rises. These are one statement.'),
    A('rule', "Shuning uchun hosila o'zgarish tezligi deb ataladi.", 'Поэтому производную называют скоростью изменения.', 'That is why the derivative is called a rate of change.'),
  ],
}

// ============================================================
// SLAYD 9. ISHORANI O'ZINGIZ QO'YING. Grafik pastga ketsa, hosila manfiy.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'deriv_sign_monotone',
  eyebrow: L('O\'zingiz qo\'ying', 'Поставь сам', 'Place it yourself'),
  title: L('Hosilaning ishorasi', 'Знак производной', 'The sign of the derivative'),
  left: L(
    'Egri chiziq 3 nuqtada PASTGA ketadi',
    'Кривая в точке 3 идёт ВНИЗ',
    'At the point 3 the curve goes DOWN',
  ),
  template: ['hosila =  ', { slot: 0 }, ' 2'],
  signs: ['+', '−'],
  answer: '−',
  checkNote: L(
    'pastga ketgan urinmaning qiyaligi manfiy',
    'у касательной, идущей вниз, наклон отрицательный',
    'a tangent going down has a negative slope',
  ),
  wrongs: [
    { key: '+', hint: L("Musbat qiyalik urinmani TEPAGA olib chiqadi, chizmada esa u pastga ketadi.", 'Положительный наклон ведёт касательную ВВЕРХ, а на чертеже она идёт вниз.', 'A positive slope takes the tangent UP, but on the drawing it goes down.') },
  ],
  probe: {
    question: L(
      'Hosila manfiy bo\'lsa, funksiya nima qiladi?',
      'Если производная отрицательна, что делает функция?',
      'If the derivative is negative, what does the function do?',
    ),
    items: [
      { id: 'a', label: L('kamayadi', 'убывает', 'decreases'), correct: true },
      { id: 'b', label: L('o\'sadi', 'возрастает', 'increases'), hint: L("O'sish musbat hosilaga to'g'ri keladi.", 'Возрастание отвечает положительной производной.', 'Growth matches a positive derivative.') },
      { id: 'c', label: L('o\'zgarmaydi', 'не меняется', 'stays put'), hint: L("O'zgarmasa hosila nolga teng bo'lardi.", 'Если бы не менялась, производная была бы нулём.', 'If it stayed put, the derivative would be zero.') },
      { id: 'd', label: L('manfiy bo\'ladi', 'становится отрицательной', 'becomes negative'), hint: L("Funksiyaning ishorasi bilan hosilaning ishorasi boshqa narsa: funksiya musbat bo'lib kamayishi mumkin.", 'Знак функции и знак производной это разные вещи: функция может быть положительной и убывать.', 'The sign of the function and the sign of its derivative are different: a function may be positive and still decrease.') },
    ],
  },
  audio: [
    A('mount', "Endi ishorani o'zingiz qo'yasiz. Bu funksiya uchinchi nuqtada pastga ketadi.", 'Теперь знак ставишь сам. Эта функция в точке три идёт вниз.', 'Now you place the sign yourself. At the point three this function goes down.'),
    A('write', "Qiyalik qanday ishora bilan bo'ladi.", 'С каким знаком будет наклон.', 'With which sign will the slope come.'),
  ],
}

// Zanjir amallari: ro'yxatda TESKARI masalaning amallari ham bor, ular
// hozir ortiqcha. Etalon shuni talab qiladi: tanlov haqiqiy bo'lsin.
const ACTIONS_43 = [
  { id: 'incr', label: L('orttirmani yozish', 'записать приращение', 'write the increment') },
  { id: 'div', label: L("h ga bo'lish", 'разделить на h', 'divide by h') },
  { id: 'lim', label: L('h ni nolga intiltirish', 'устремить h к нулю', 'let h tend to zero') },
  { id: 'eq', label: L('qiyalikni tenglashtirish', 'приравнять наклон', 'set the slope equal'), },
  { id: 'half', label: L("ikkiga bo'lish", 'поделить на два', 'halve it') },
]

// ============================================================
// SLAYD 10. ZANJIR. Ta'rif bo'yicha hosila (darslik 22-bet, 15-mashq).
// ============================================================
const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'ratio_flip',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Ta\'rif bo\'yicha', 'По определению', 'Straight from the definition'),
  // `start` FORMULA satrida chiqadi va O'RALMAYDI: telefonda inglizcha
  // gap 89 px oshib ketgan edi. Shuning uchun bu yerda faqat yozuv turadi,
  // savolni ovoz aytadi.
  start: 'f = x²,  x₀ = 3',
  actions: ACTIONS_43,
  steps: [
    {
      action: 'incr',
      to: '6h + h²',
      wrongs: [
        { action: 'div', hint: L("Bo'lish uchun avval nimani bo'lishni yozib olish kerak.", 'Чтобы делить, сначала надо записать, что делим.', 'To divide, first write down what is being divided.') },
        { action: 'lim', hint: L("Limitga o'tish oxirgi qadam, birinchisi emas.", 'Переход к пределу это последний шаг, а не первый.', 'The limit is the last step, not the first.') },
        { action: 'eq', hint: L("Tenglashtirish teskari masalada kerak bo'ladi.", 'Приравнивать понадобится в обратной задаче.', 'Setting equal will be needed in the reverse task.') },
      ],
    },
    {
      action: 'div',
      to: '6 + h',
      wrongs: [
        { action: 'incr', hint: L("Orttirma allaqachon yozilgan: olti h plyus h kvadrat.", 'Приращение уже записано: шесть h плюс h в квадрате.', 'The increment is already written: six h plus h squared.') },
        { action: 'lim', hint: L("Hozir h ni nolga intiltirsak, nol bo'lingan nol chiqadi.", 'Если сейчас устремить h к нулю, выйдет ноль делить на ноль.', 'If h tends to zero now, we get zero over zero.') },
        { action: 'half', hint: L("Ikkiga bo'lish emas, h ga bo'lish kerak.", 'Делить нужно не на два, а на h.', 'We divide by h, not by two.') },
      ],
    },
    {
      action: 'lim',
      to: '6',
      wrongs: [
        { action: 'div', hint: L("Bo'lindi: olti plyus h qoldi.", 'Уже поделено: осталось шесть плюс h.', 'Already divided: six plus h remains.') },
        { action: 'eq', hint: L("Tenglashtirish kerak emas, javob deyarli tayyor.", 'Приравнивать не нужно, ответ почти готов.', 'No need to set equal, the answer is nearly there.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['6', '9', '3', '6 + h'],
    value: ['6'],
    label: L('hosila =', 'производная =', 'derivative ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '9', hint: L("To'qqiz bu funksiyaning QIYMATI uchinchi nuqtada, hosila emas.", 'Девять это ЗНАЧЕНИЕ функции в точке три, а не производная.', 'Nine is the VALUE of the function at three, not the derivative.') },
      { key: '3', hint: L("Uch bu nuqtaning o'zi. Hosila undan ikki barobar katta.", 'Три это сама точка. Производная вдвое больше.', 'Three is the point itself. The derivative is twice as large.') },
      { key: '6 + h', hint: L("Bu limitga o'tishdan OLDINGI yozuv. h nolga intilganda h yo'qoladi.", 'Это запись ДО перехода к пределу. Когда h стремится к нулю, h исчезает.', 'That is the record BEFORE the limit. As h tends to zero, h disappears.') },
      { key: '*', hint: L("Nisbat olti plyus h edi, va h nolga intiladi.", 'Отношение было шесть плюс h, а h стремится к нулю.', 'The ratio was six plus h, and h tends to zero.') },
    ],
  },
  audio: [
    A('mount', "Ishora qo'yildi. Endi butun masalani o'tamiz.", 'Знак поставлен. Теперь пройдём задачу целиком.', 'The sign is placed. Now let us walk a whole problem.'),
    A('start', "Diqqat: ro'yxatda teskari masalaning amallari ham bor. Ular hozir ortiqcha.", 'Внимание: в списке есть действия обратной задачи. Сейчас они лишние.', 'Careful: the list holds actions of the reverse task. They are superfluous now.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL, IMTIHONDAGIDEK. Teskari masala.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'avg_vs_inst',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Teskari masala', 'Обратная задача', 'The reverse task'),
  start: 'v = 10,  t = ?',
  actions: ACTIONS_43,
  hint: L(
    "Har bir paytdagi tezlik vaqtdan ikki barobar katta.",
    'Скорость в каждый момент вдвое больше времени.',
    'The speed at each moment is twice the time.',
  ),
  steps: [
    {
      action: 'eq',
      to: '2t = 10',
      wrongs: [
        { action: 'incr', hint: L("Orttirma bu yerda kerak emas: tezlik qonuni allaqachon topilgan.", 'Приращение здесь не нужно: закон скорости уже найден.', 'No increment here: the speed law is already found.') },
        { action: 'lim', hint: L("Limit o'tildi, endi tenglama yechiladi.", 'Предел пройден, теперь решается уравнение.', 'The limit is done, now an equation is solved.') },
        { action: 'div', hint: L("h ga bo'lish kerak emas: h bu masalada yo'q.", 'Делить на h не нужно: h в этой задаче нет.', 'No dividing by h: there is no h in this task.') },
      ],
    },
    {
      action: 'half',
      to: 't = 5',
      wrongs: [
        { action: 'eq', hint: L("Tenglama tuzildi. Endi uni yechish kerak.", 'Уравнение составлено. Теперь его надо решить.', 'The equation is set. Now it must be solved.') },
        { action: 'lim', hint: L("Bu tenglama, limit emas.", 'Это уравнение, а не предел.', 'This is an equation, not a limit.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['5', '10', '20', '2,5'],
    value: ['5'],
    label: 't =',
    prompt: L('Paytni yozing', 'Запиши момент', 'Write the moment'),
    wrongs: [
      { key: '10', hint: L("O'n bu tezlik, vaqt emas. Vaqt undan ikki barobar kichik.", 'Десять это скорость, а не время. Время вдвое меньше.', 'Ten is the speed, not the time. The time is twice smaller.') },
      { key: '20', hint: L("Ikkiga ko'paytirilgan, aslida bo'linishi kerak edi.", 'Умножено на два, а надо было поделить.', 'Multiplied by two, but it had to be divided.') },
      { key: '2,5', hint: L("To'rtga bo'lingan. Tezlik vaqtdan ikki barobar katta, to'rt barobar emas.", 'Поделено на четыре. Скорость вдвое больше времени, а не вчетверо.', 'Divided by four. The speed is twice the time, not four times.') },
      { key: '*', hint: L("Ikki karra t o'nga teng, demak t beshga teng.", 'Два t равно десяти, значит t равно пяти.', 'Two t equals ten, so t equals five.') },
    ],
  },
  audio: [
    A('mount', "Oxirgi masala mustaqil. Bu safar tezlik berilgan, payt esa topilishi kerak.", 'Последняя задача самостоятельная. На этот раз дана скорость, а найти нужно момент.', 'The last problem is on your own. This time the speed is given and the moment must be found.'),
    A('step3', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 12. BLITS. Oltita savol, tushuntirishda uchramagan sonlar.
// ============================================================
const S12 = {
  role: 'blitz',
  led: 'student',
  eyebrow: L('Blits', 'Блиц', 'Quick round'),
  title: L('Olti savol', 'Шесть вопросов', 'Six questions'),
  items: [
    {
      id: 'b1', tag: 'avg_vs_inst', ask: true, cols: 2,
      done: '8',
      prompt: L('[1; 7] oraliqda o\'rtacha tezlik?', 'Средняя скорость на [1; 7]?', 'The average speed on [1; 7]?'),
      items: [
        { id: 'a', label: '8', correct: true },
        { id: 'b', label: '48', hint: L("Bu faqat yo'l orttirmasi, vaqt orttirmasiga bo'linmagan.", 'Это только приращение пути, не поделённое на приращение времени.', 'That is only the path increment, not divided by the time increment.') },
        { id: 'c', label: '6', hint: L("Olti bu vaqt orttirmasi, ya'ni maxraj.", 'Шесть это приращение времени, то есть знаменатель.', 'Six is the time increment, the bottom of the fraction.') },
        { id: 'd', label: '14', hint: L("O'n to'rt oxirgi paytdagi ONIY tezlik, savol esa o'rtachasi haqida.", 'Четырнадцать это МГНОВЕННАЯ скорость в конце, а вопрос о средней.', 'Fourteen is the INSTANT speed at the end, and the question is about the average.') },
      ],
    },
    {
      id: 'b2', tag: 'ratio_flip', ask: true, cols: 2,
      done: '10 + h',
      prompt: L('5 nuqtada ayirmali nisbat?', 'Разностное отношение в точке 5?', 'The difference ratio at the point 5?'),
      items: [
        { id: 'a', label: '10 + h', correct: true },
        { id: 'b', label: '5 + h', hint: L("Nuqta ikki barobarga ko'paymagan: kvadratning orttirmasi ikki karra nuqta beradi.", 'Точка не удвоена: приращение квадрата даёт дважды точку.', 'The point is not doubled: the increment of a square gives twice the point.') },
        { id: 'c', label: '25 + h', hint: L("Yigirma besh bu funksiyaning qiymati, nisbat emas.", 'Двадцать пять это значение функции, а не отношение.', 'Twenty five is the value of the function, not the ratio.') },
        { id: 'd', label: '10h', hint: L("h ga bo'lingandan keyin h ko'paytuvchi bo'lib qolmaydi.", 'После деления на h множитель h не остаётся.', 'After dividing by h, no factor h stays.') },
      ],
    },
    {
      id: 'b3', tag: 'limit_needed', ask: true, cols: 2,
      done: L('aniqlanmagan', 'не определено', 'undefined'),
      prompt: L('Nisbatga darrov h = 0 qo\'yilsa?', 'Если сразу подставить h = 0 в отношение?', 'If h = 0 is put straight into the ratio?'),
      items: [
        { id: 'a', label: L('aniqlanmagan', 'не определено', 'undefined'), correct: true },
        { id: 'b', label: '0', hint: L("Pay nol bo'ladi, lekin maxraj ham nol: bu nol emas.", 'Числитель станет нулём, но и знаменатель ноль: это не ноль.', 'The top becomes zero, but so does the bottom: that is not zero.') },
        { id: 'c', label: L('cheksizlik', 'бесконечность', 'infinity'), hint: L("Cheksizlik maxraj nolga, pay esa noldan farqli songa intilganda chiqadi.", 'Бесконечность выходит, когда знаменатель к нулю, а числитель нет.', 'Infinity comes when the bottom tends to zero and the top does not.') },
        { id: 'd', label: '1', hint: L("Bir chiqishi uchun pay va maxraj teng bo'lishi kerak, bu esa har doim emas.", 'Чтобы вышла единица, числитель и знаменатель должны быть равны, а это не всегда так.', 'For one to appear the top and bottom must be equal, and they are not.') },
      ],
    },
    {
      id: 'b4', tag: 'deriv_vs_value', ask: true, cols: 2,
      done: '−6',
      prompt: L('Kvadrat funksiyaning −3 dagi hosilasi?', 'Производная функции квадрат в точке −3?', 'The derivative of the squaring function at −3?'),
      items: [
        { id: 'a', label: '−6', correct: true },
        { id: 'b', label: '9', hint: L("To'qqiz bu QIYMAT, hosila emas.", 'Девять это ЗНАЧЕНИЕ, а не производная.', 'Nine is the VALUE, not the derivative.') },
        { id: 'c', label: '6', hint: L("Ishora yo'qolgan: nuqta manfiy, demak hosila ham manfiy.", 'Потерян знак: точка отрицательна, значит и производная отрицательна.', 'The sign is lost: the point is negative, so the derivative is negative too.') },
        { id: 'd', label: '−9', hint: L("Manfiy qiymat ham emas: kvadrat manfiy bo'lmaydi.", 'И не отрицательное значение: квадрат не бывает отрицательным.', 'Nor a negative value: a square is never negative.') },
      ],
    },
    {
      id: 'b5', tag: 'deriv_sign_monotone', ask: true, cols: 2,
      done: L('kamayadi', 'убывает', 'decreases'),
      prompt: L('Hosila butun oraliqda manfiy. Funksiya?', 'Производная отрицательна на всём промежутке. Функция?', 'The derivative is negative on the whole interval. The function?'),
      items: [
        { id: 'a', label: L('kamayadi', 'убывает', 'decreases'), correct: true },
        { id: 'b', label: L('o\'sadi', 'возрастает', 'increases'), hint: L("O'sish musbat hosila bilan bo'ladi.", 'Возрастание идёт с положительной производной.', 'Growth comes with a positive derivative.') },
        { id: 'c', label: L('manfiy', 'отрицательна', 'is negative'), hint: L("Funksiyaning ishorasi hosilaning ishorasidan kelib chiqmaydi.", 'Знак функции не следует из знака производной.', 'The sign of the function does not follow from the sign of its derivative.') },
        { id: 'd', label: L('o\'zgarmaydi', 'не меняется', 'stays put'), hint: L("O'zgarmasa hosila nol bo'lardi, u esa manfiy.", 'Если бы не менялась, производная была бы нулём, а она отрицательна.', 'If it stayed put the derivative would be zero, and it is negative.') },
      ],
    },
    {
      id: 'b6', tag: 'avg_vs_inst', ask: true, cols: 2,
      done: '7',
      prompt: L('Oniy tezlik 14 bo\'lgan payt?', 'Момент, когда мгновенная скорость 14?', 'The moment when the instant speed is 14?'),
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '14', hint: L("O'n to'rt bu tezlik. Vaqt undan ikki barobar kichik.", 'Четырнадцать это скорость. Время вдвое меньше.', 'Fourteen is the speed. The time is twice smaller.') },
        { id: 'c', label: '28', hint: L("Ko'paytirildi, aslida bo'linishi kerak edi.", 'Умножено, а надо было поделить.', 'Multiplied, but it had to be divided.') },
        { id: 'd', label: '49', hint: L("Qirq to'qqiz bu yo'l, vaqt emas.", 'Сорок девять это путь, а не время.', 'Forty nine is the path, not the time.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits. Oltita savol, javoblar natijaga kiradi.", 'Блиц. Шесть вопросов, ответы идут в результат.', 'Quick round. Six questions, the answers count.'),
  ],
}

// ============================================================
// SLAYD 13. XATONI TOPING. Nisbat TESKARI yozilgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'ratio_flip',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Bir satr xato', 'Одна строка неверна', 'One line is wrong'),
  rows: [
    { id: 'r1', text: L('kvadrat funksiya, nuqta 4', 'функция квадрат, точка 4', 'the squaring function, the point 4') },
    { id: 'r2', text: '(4 + h)² − 4² = 8h + h²' },
    { id: 'r3', text: 'h / (8h + h²) = 1 / (8 + h)' },
    { id: 'r4', text: 'h → 0  ⇒  1 / 8' },
    { id: 'r5', text: L('javob: 1 / 8', 'ответ: 1 / 8', 'answer: 1 / 8') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Kvadrat to'g'ri yoyilgan: sakkiz h plyus h kvadrat.", 'Квадрат раскрыт верно: восемь h плюс h в квадрате.', 'The square is expanded right: eight h plus h squared.'),
    r4: L("Limit shu satrda to'g'ri olingan, xato undan oldin.", 'Предел в этой строке взят верно, ошибка выше.', 'The limit in this line is taken right, the error is above.'),
    r5: L("Oxirgi satr faqat ko'chirma, xato undan oldin.", 'Последняя строка только перепись, ошибка выше.', 'The last line is just a copy, the error is above.'),
  },
  proofPoint: L('nisbat teskari yozilgan', 'отношение перевёрнуто', 'the ratio is upside down'),
  proof: L(
    "Yuqorida h ga bo'linishi kerak edi, bu yerda esa h ga BO'LINGAN. Nisbat teskari. To'g'risi sakkiz plyus h, va limitda sakkiz chiqadi.",
    'Сверху должно было делиться на h, а здесь поделили сам h. Отношение перевёрнуто. Верно восемь плюс h, и в пределе выходит восемь.',
    'The top had to be divided by h, but here h itself was divided. The ratio is upside down. Correctly it is eight plus h, and the limit gives eight.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('nisbat teskari', 'отношение перевёрнуто', 'the ratio is flipped'), correct: true },
      { id: 'b', label: L('kvadrat xato yoyilgan', 'квадрат раскрыт неверно', 'the square is expanded wrong'), hint: L("Yoyilma to'g'ri: to'rt plyus h ning kvadrati o'n olti plyus sakkiz h plyus h kvadrat.", 'Раскрытие верно: четыре плюс h в квадрате это шестнадцать плюс восемь h плюс h в квадрате.', 'The expansion is right: four plus h squared is sixteen plus eight h plus h squared.') },
      { id: 'c', label: L('limit xato olingan', 'предел взят неверно', 'the limit is taken wrong'), hint: L("Limit o'sha yozuv uchun to'g'ri olingan. Yozuvning O'ZI teskari.", 'Предел для этой записи взят верно. Перевёрнута САМА запись.', 'The limit is right for that record. The record ITSELF is flipped.') },
      { id: 'd', label: L('javob to\'g\'ri', 'ответ верный', 'the answer is right'), hint: L("Javob bir bo'lingan sakkiz chiqdi, to'g'risi esa sakkiz.", 'В ответе одна восьмая, а верно восемь.', 'The answer says one eighth, and the right value is eight.') },
    ],
  },
  audio: [
    A('mount', "Blits yopildi. Endi boshqaning yechimiga qaraymiz.", 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else solution.'),
    A('q1', "Diqqat: satrlarning ko'pi haqiqatan to'g'ri. Xato bittasida. Uni toping.", 'Внимание: большинство строк действительно верны. Ошибка в одной. Найди её.', 'Careful: most lines are genuinely right. One holds the error. Find it.'),
    A('proof', "Qarang: ayirmali nisbatda tepada funksiya orttirmasi, pastda esa argument orttirmasi turishi kerak. Bu yechimda ular joyini almashtirgan, va shu sababli javob teskari chiqdi. To'g'ri yozuvda sakkiz plyus h qoladi, va limitda sakkiz bo'ladi. Tekshiruv oson: hosila tezlik, va tezlik bunday katta funksiyada bir bo'lingan sakkizdan katta bo'lishi kerak.", 'Смотри: в разностном отношении сверху стоит приращение функции, а снизу приращение аргумента. В этом решении они поменялись местами, и поэтому ответ вышел обратным. В верной записи остаётся восемь плюс h, и в пределе будет восемь. Проверка простая: производная это скорость, и у такой быстрой функции она должна быть больше одной восьмой.', 'Look: in the difference ratio the increment of the function sits on top and the increment of the argument below. In this solution they swapped places, and that is why the answer came out inverted. In the right record eight plus h remains, and the limit gives eight. The check is easy: the derivative is a speed, and for such a fast function it must be larger than one eighth.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA: yozuvni tavsif bo'yicha yig'ish.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'deriv_vs_value',
  right: '2/2',
  eyebrow: L('O\'zingiz yig\'ing', 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('nuqta qayerda turadi', 'где стоит точка', 'where the point stands'),
  tasks: [
    {
      prompt: L('Paytdagi oniy tezlik, yo\'l qonuni s', 'Мгновенная скорость в момент, закон пути s', 'The instant speed at a moment, the path law s'),
      template: ['v (t₀) = ', { slot: 0 }, ' ′ (', { slot: 1 }, ')'],
      parts: ['s', 't₀', 'v', 'h'],
      answer: ['s', 't₀'],
      doneLabel: 'v (t₀) = s ′ (t₀)',
      wrongs: [
        { key: 'v|t₀', hint: L("Chapda tezlik turadi, o'ngda esa YO'L qonunining hosilasi.", 'Слева стоит скорость, а справа производная ЗАКОНА ПУТИ.', 'The speed is on the left, the derivative of the PATH law on the right.') },
        { key: 's|h', hint: L("Hosila NUQTADA olinadi, va nuqta bu t nol.", 'Производную берут В ТОЧКЕ, а точка это t нулевое.', 'The derivative is taken AT A POINT, and the point is t zero.') },
        { key: '*', hint: L("Tezlik yo'l qonunining hosilasi, va u t nol nuqtasida olinadi.", 'Скорость это производная закона пути, взятая в точке t нулевое.', 'The speed is the derivative of the path law, taken at the point t zero.') },
      ],
    },
    {
      prompt: L('Urinmaning qiyaligi, funksiya f', 'Наклон касательной, функция f', 'The slope of the tangent, the function f'),
      template: ['k = ', { slot: 0 }, ' ′ (', { slot: 1 }, ')'],
      parts: ['f', 'x₀', 'k', 'x'],
      answer: ['f', 'x₀'],
      doneLabel: 'k = f ′ (x₀)',
      wrongs: [
        { key: 'k|x₀', hint: L("Chapda qiyalik, o'ngda esa funksiyaning hosilasi.", 'Слева наклон, а справа производная функции.', 'The slope is on the left, the derivative of the function on the right.') },
        { key: 'f|x', hint: L("Qiyalik BITTA nuqtaga tegishli, shuning uchun x nol yoziladi.", 'Наклон относится к ОДНОЙ точке, поэтому пишут x нулевое.', 'The slope belongs to ONE point, so we write x zero.') },
        { key: '*', hint: L("Qiyalik funksiyaning hosilasi, va u x nol nuqtasida olinadi.", 'Наклон это производная функции, взятая в точке x нулевое.', 'The slope is the derivative of the function, taken at the point x zero.') },
      ],
    },
  ],
  audio: [
    A('mount', "Xato topildi. Oxirgi topshiriq teskari: tavsif bor, yozuv kerak.", 'Ошибка найдена. Последнее задание обратное: есть описание, нужна запись.', 'The error is found. The last task is reverse: a description is given, a record is needed.'),
    A('built1', "Endi ikkinchisi. Bu safar harakat emas, chizma.", 'Теперь второе. На этот раз не движение, а чертёж.', 'Now the second. This time not motion but a drawing.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'avg_vs_inst',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: L('hosila = nisbatning limiti', 'производная = предел отношения', 'derivative = limit of the ratio'),
  ruleLines: [
    L("o'rtacha tezlik oraliqda", 'средняя скорость на промежутке', 'average speed over an interval'),
    L('oniy tezlik nuqtada', 'мгновенная скорость в точке', 'instant speed at a point'),
    L('hosila urinmaning qiyaligi', 'производная это наклон касательной', 'the derivative is the slope of the tangent'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('ikkinchi sekunddagi tezlik', 'скорость во вторую секунду', 'the speed at the second second'),
      right: '4',
      map: { a: '4', b: '4,5', c: '5', d: '9' },
    },
    {
      screen: 5,
      expr: L('uchinchi sekunddagi tezlik', 'скорость в третью секунду', 'the speed at the third second'),
      right: '6',
      map: { a: '6', b: '7', c: '9', d: '3' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '5 → 4,5 → 4,25 → 4',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L("Ta'rif ekraniga va chizmaga qayting", 'Вернись к экрану с определением и к чертежу', 'Go back to the definition screen and the drawing'),
  },
  probe: {
    question: L(
      'Nima uchun oraliq kerak emas?',
      'Почему промежуток не нужен?',
      'Why is an interval not needed?',
    ),
    items: [
      { id: 'a', label: L('hosila nuqtada aniqlangan', 'производная определена в точке', 'the derivative is defined at a point'), correct: true },
      { id: 'b', label: L('oraliq juda uzun', 'промежуток слишком длинный', 'an interval is too long'), hint: L("Uzunlik masalasi emas: qisqa oraliq ham nuqta bermaydi.", 'Дело не в длине: короткий промежуток тоже не даёт точку.', 'It is not about length: a short interval is still not a point.') },
      { id: 'c', label: L('oraliqni hisoblash qiyin', 'промежуток трудно считать', 'an interval is hard to compute'), hint: L("Hisoblash oson, lekin natija oraliqqa tegishli bo'lib qoladi.", 'Считать легко, но результат остаётся относящимся к промежутку.', 'It is easy to compute, but the result still belongs to the interval.') },
      { id: 'd', label: L('oraliq baribir kerak', 'промежуток всё равно нужен', 'an interval is still needed'), hint: L("Nisbat tuzishda kerak, javobda esa yo'q: oraliq nolga qisqaradi.", 'Он нужен, чтобы построить отношение, но не в ответе: промежуток сужается до нуля.', 'It is needed to build the ratio, not in the answer: the interval shrinks to zero.') },
    ],
  },
  sheetTitle: L('Hosila · shpargalka', 'Производная · шпаргалка', 'The derivative · cheat sheet'),
  sheetSrc: L('11-sinf · 43-dars', '11 класс · урок 43', 'Grade 11 · lesson 43'),
  lifehack: L(
    "Ikkita nuqta bo'lsa -- o'rtacha. Bitta nuqta bo'lsa -- hosila.",
    'Две точки это средняя. Одна точка это производная.',
    'Two points mean an average. One point means the derivative.',
  ),
  holds: [3000, 6500, 7000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Ikkinchi sekundda tezlik to'rt, va hosila har nuqtada o'ziga xos.", 'Вот твои прогнозы и вот как оказалось. Во вторую секунду скорость четыре, и производная в каждой точке своя.', 'Here are your guesses and here is how it turned out. At the second second the speed is four, and the derivative is its own at each point.'),
    A('rule', "Va mana darsning umumiy fikri. O'rtacha tezlik oraliqda o'lchanadi, oniy tezlik esa nuqtada. Nuqtadagi tezlikni topish uchun ayirmali nisbat tuziladi va argument orttirmasi nolga intiltiriladi. Natija hosila deb ataladi, va chizmada u urinmaning qiyaligi. Keyingi darsda har bir funksiya uchun hosilani tez topish yo'li ko'rsatiladi.", 'И вот общая мысль урока. Средняя скорость измеряется на промежутке, а мгновенная в точке. Чтобы найти скорость в точке, строят разностное отношение и устремляют приращение аргумента к нулю. Результат называют производной, а на чертеже это наклон касательной. На следующем уроке будет показан быстрый способ находить производную для каждой функции.', 'And here is the shared thought of the lesson. Average speed is measured over an interval, instant speed at a point. To find the speed at a point we build the difference ratio and let the increment tend to zero. The result is the derivative, and on a drawing it is the slope of the tangent. The next lesson shows a fast way to find it.'),
    A('q', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
