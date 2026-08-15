// ============================================================================
// 11-sinf, Dars 07. INTEGRALNING TATBIQLARI.
//
// B1 blokining OXIRGI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/DARS07_SKELET.md
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// ASBOB HAQIDA QAROR. PODXOD_11SINF.md §4 da bu dars «aylanma jism» asbobiga
// bog'langan va uni B4 blokidan keyin qilish tavsiya etilgan. Qaror BEKOR
// QILINDI: aylantirish jismni OLISH uchun kerak, bu dars esa hajm QANDAY
// YIG'ILISHI haqida -- kesim ortidan kesim. Buni `AreaBoard` allaqachon
// qiladi, faqat integral ostida egri chiziqning balandligi emas, KESIM
// YUZASI turadi.
//
// DARSNING BITTA GAPI: integral faqat yuzani yig'maydi. Ostida nima tursa,
// o'shani yig'adi: kesim yuzasi bo'lsa hajmni, tezlik bo'lsa yo'lni, kuch
// bo'lsa ishni.
//
// VA BLOKNING QARZI: konus hajmidagi UCHDAN BIR -- bu o'sha x kub bo'lingan
// uchdagi uchlik. Geometriyada yodlatilgan formula shu yerda chiqariladi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'
import { AreaBoard } from './tools.jsx'

const META = {
  id: 'alg_11_07',
  title: L('Integralning tatbiqlari', 'Приложения интеграла', 'Applications of the integral'),
}

const BLOCK = { label: 'B1', from: 1, to: 7, current: 7 }

// Konus R = 1, H = 3. Balandlik x dagi kesim radiusi x/3, yuzasi pi x²/9.
const CONE = (x) => (Math.PI * x * x) / 9
const FORCE = (x) => 2 * x

// ============================================================
// SLAYD 1. XUK. Konus hajmidagi uchdan bir qayerdan.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Integralning tatbiqlari', 'Приложения интеграла', 'Applications of the integral'),
  title: L('Uchdan bir qayerdan', 'Откуда треть', 'Where the third comes from'),
  // Telefonda uzun jumla 114px kesilardi. Sarlavha savolni beryapti,
  // shuning uchun bu satr faqat faktni aytadi.
  expr: L('konus uch barobar kichik', 'Конус втрое меньше', 'A cone is three times smaller'),
  rows: [
    {
      id: 'a',
      name: L('shunday yodlanadi', 'это просто запоминают', 'it is simply memorised'),
      value: L('shunday tuzilgan', 'так устроено', 'that is how it is'),
    },
    {
      id: 'b',
      name: L('integraldan chiqadi', 'выходит из интеграла', 'it comes out of the integral'),
      value: 'x²  →  x³/3',
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Bu darsda formulani chiqaramiz.",
      'Твой ответ записан. На этом уроке мы выведем формулу.',
      'Your answer is saved. In this lesson we will derive the formula.',
    ),
    items: [
      { id: 'a', label: L('birinchi', 'первое', 'the first') },
      { id: 'b', label: L('ikkinchi', 'второе', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  holds: [5500, 5000, 4500, 4000],
  audio: [
    A('mount', "Olti dars yuza haqida edi. Bugun oxirgisi, va unda integral yuzadan chiqib ketadi.", 'Шесть уроков были про площадь. Сегодня последний, и в нём интеграл выходит за пределы площади.', 'Six lessons were about area. Today is the last, and in it the integral steps beyond area.'),
    A('r1', "Geometriyadan ma'lum: konusning hajmi bir uchdan asos yuzasi karra balandlik. Uchlik qayerdan kelganini u yerda tushuntirishmaydi, shunchaki yodlatishadi.", 'Из геометрии известно: объём конуса это одна треть площади основания на высоту. Откуда там тройка, не объясняют, её просто заучивают.', 'From geometry we know: the volume of a cone is one third of the base area times the height. Where the three comes from is not explained, it is simply memorised.'),
    A('r2', "Ikkinchi javob boshqacha: uchdan bir hech qayerdan kelmagan, u iks kvadratning boshlang'ich funksiyasidan chiqqan.", 'Второй ответ другой: треть ниоткуда не взялась, она вышла из первообразной икс в квадрате.', 'The second answer is different: the third came from nowhere else than the antiderivative of x squared.'),
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
    "Uchta narsa kerak: doira yuzasi, daraja qoidasi va o'xshash kesimlar. Bu baholanmaydi.",
    'Нужны три вещи: площадь круга, правило степени и подобные сечения. Это не оценивается.',
    'Three things are needed: the area of a circle, the power rule and similar cross-sections. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Doira yuzasi', 'Площадь круга', 'The area of a circle'),
      short: L('geometriyadan', 'из геометрии', 'from geometry'),
      ex: [{ e: 'S = π r²', why: L('radius kvadratga ko\'tariladi', 'радиус возводится в квадрат', 'the radius is squared') }],
    },
    {
      id: 'c2',
      title: L('Daraja qoidasi', 'Правило степени', 'The power rule'),
      short: L('1-darsdan', 'из урока 1', 'from lesson 1'),
      ex: [{ e: '∫₀³ x² dx = 9', why: L('F = x³/3, mana o\'sha uchlik', 'F = x³/3, вот она, тройка', 'F = x³/3, there is the three') }],
    },
    {
      id: 'c3',
      title: L("O'xshash kesimlar", 'Подобные сечения', 'Similar cross-sections'),
      short: L('konus uchidan pastga', 'от вершины конуса вниз', 'down from the apex'),
      ex: [{ e: 'x = 3  →  r = 1;   x = 1  →  r = 1/3', why: L('radius balandlikka mutanosib', 'радиус пропорционален высоте', 'the radius is proportional to the height') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('Radiusi 2 bo\'lgan doira yuzasi?', 'Площадь круга радиуса 2 ?', 'The area of a circle of radius 2 ?'),
      cols: 4,
      items: [
        { id: 'a', label: '4π', correct: true },
        { id: 'b', label: '2π', hint: L("Bu uzunlik formulasiga o'xshaydi. Yuzada radius kvadratga ko'tariladi.", 'Это похоже на формулу длины. В площади радиус в квадрате.', 'That looks like the circumference formula. In the area the radius is squared.') },
        { id: 'c', label: '16π', hint: L("Ikkining kvadrati to'rt, o'n olti emas.", 'Два в квадрате это четыре, а не шестнадцать.', 'Two squared is four, not sixteen.') },
        { id: 'd', label: '4', hint: L("Pi tushib qoldi.", 'Потерялось пи.', 'The pi is missing.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('∫₀³ x² dx = ?', 'Чему равен ∫₀³ x² dx ?', 'What is ∫₀³ x² dx ?'),
      cols: 4,
      items: [
        { id: 'a', label: '9', correct: true },
        { id: 'b', label: '27', hint: L("Uchga bo'lish unutildi: F teng iks kubi bo'lingan uch.", 'Забыли поделить на три: F равна икс в кубе делить на три.', 'The division by three was forgotten: F equals x cubed over three.') },
        { id: 'c', label: '3', hint: L("Yigirma yetti bo'lingan uch bu to'qqiz.", 'Двадцать семь делить на три это девять.', 'Twenty seven over three is nine.') },
        { id: 'd', label: '6', hint: L("Bu hosila bilan chalkashtirish: ikki karra uch.", 'Это путаница с производной: два на три.', 'That is a mix-up with the derivative: two times three.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L(
        "Balandligi 3, radiusi 1 bo'lgan konusda x = 1 dagi kesim radiusi?",
        'В конусе высотой 3 и радиусом 1 радиус сечения при x = 1 ?',
        'In a cone of height 3 and radius 1, the radius of the section at x = 1 ?',
      ),
      cols: 4,
      items: [
        { id: 'a', label: '1/3', correct: true },
        { id: 'b', label: '1', hint: L("Bir bu asosdagi radius, ya'ni x teng uchda.", 'Единица это радиус у основания, то есть при x равном трём.', 'One is the radius at the base, that is at x equal to three.') },
        { id: 'c', label: '3', hint: L("Radius balandlikdan katta bo'la olmaydi bu konusda.", 'Радиус в этом конусе не может быть больше высоты.', 'In this cone the radius cannot exceed the height.') },
        { id: 'd', label: '1/9', hint: L("Radius mutanosib, kvadratga ko'tarilmaydi. Kvadrat yuzada paydo bo'ladi.", 'Радиус пропорционален, он не в квадрате. Квадрат появится в площади.', 'The radius is proportional, not squared. The square appears in the area.') },
      ],
    },
  ],
  holds: [3000, 4500, 5000, 6000, 4500, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi: doiraning yuzasi pi karra radius kvadrat. Bugun kesimlar doira bo'ladi.", 'Первая: площадь круга это пи на радиус в квадрате. Сегодня сечения будут кругами.', 'First: the area of a circle is pi times the radius squared. Today the sections will be circles.'),
    A('c2', "Ikkinchi: iks kvadratning integrali noldan uchgacha to'qqizga teng, chunki boshlang'ich funksiya iks kubi bo'lingan uch. Mana o'sha uchlik, va u bugun konusga o'tadi.", 'Вторая: интеграл икс в квадрате от нуля до трёх равен девяти, потому что первообразная это икс в кубе делить на три. Вот она, тройка, и сегодня она перейдёт в конус.', 'Second: the integral of x squared from zero to three is nine, because the antiderivative is x cubed over three. There is the three, and today it will pass into the cone.'),
    A('c3', "Uchinchi: konus uchidan pastga tushganda kesim radiusi balandlikka mutanosib o'sadi. Uchda bir bo'lsa, birda uchdan bir.", 'Третья: при спуске от вершины конуса радиус сечения растёт пропорционально высоте. Если в трёх он единица, то в единице одна треть.', 'Third: going down from the apex, the radius of the section grows in proportion to the height. If at three it is one, at one it is a third.'),
    A('recap', "Uchtasi birga konus hajmini beradi. Hozircha shunchaki eslab qo'yamiz.", 'Три вместе дают объём конуса. Пока просто запомним.', 'The three together give the volume of the cone. For now let us just remember.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. KESIMLARNI SANAYMIZ.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'cross_section',
  eyebrow: L('Kesimlarni sanaymiz', 'Посчитаем сечения', 'Let us count the sections'),
  title: L('Har balandlikda o\'z doirasi', 'На каждой высоте свой круг', 'A circle of its own at each height'),
  expr: L('konus:  R = 1,  H = 3', 'конус: R = 1, H = 3', 'the cone: R = 1, H = 3'),
  goal: L('kesim yuzasini topish', 'найти площадь сечения', 'find the area of the section'),
  rule: L(
    "Balandlik x dagi radius x bo'lingan uch. Yuzasi esa pi karra shu radius kvadrat.",
    'Радиус на высоте x равен x делить на три. А площадь это пи на этот радиус в квадрате.',
    'The radius at height x is x over three. And the area is pi times that radius squared.',
  ),
  pick: L('Qaysi balandlikni tekshiramiz?', 'Какую высоту проверим?', 'Which height shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('yodlangan', 'заучено', 'memorised'), value: L('shunday tuzilgan', 'так устроено', 'that is how it is') },
    { id: 'b', key: 'inB', name: L('integraldan', 'из интеграла', 'from the integral'), value: 'S = πx²/9' },
  ],
  points: [
    {
      id: 'q1', label: 'x = 1', num: '1', step: 'calc', verdict: 'in',
      role: L('uchga yaqin', 'ближе к вершине', 'near the apex'),
      calc: 'r = 1/3,    S = π/9',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: 'x = 2', num: '2', step: 'calc', verdict: 'in',
      role: L("o'rtada", 'посередине', 'in the middle'),
      calc: 'r = 2/3,    S = 4π/9',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: 'x = 3', num: '3', step: 'calc', verdict: 'in',
      role: L('asosda', 'у основания', 'at the base'),
      calc: 'r = 1,    S = π',
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Kesim yuzasi balandlik bilan qanday o'sadi?", 'Как площадь сечения растёт с высотой?', 'How does the section area grow with height?'),
    items: [
      {
        id: 'b', label: L('kvadrat bo\'yicha', 'по квадрату', 'as a square'), correct: true,
        ok: L(
          "To'g'ri. Radius mutanosib o'sadi, yuza esa kvadratga: bir to'qqizdan, to'rt to'qqizdan, to'qqiz to'qqizdan.",
          'Верно. Радиус растёт пропорционально, а площадь по квадрату: одна девятая, четыре девятых, девять девятых.',
          'Correct. The radius grows proportionally, the area as a square: one ninth, four ninths, nine ninths.',
        ),
      },
      {
        id: 'a', label: L('bir tekis', 'равномерно', 'evenly'),
        hint: L("Uchta sonni solishtiring: pi to'qqizdan, to'rt pi to'qqizdan, pi. Farqlar bir xil emas.", 'Сравни три числа: пи девятых, четыре пи девятых, пи. Разности не одинаковы.', 'Compare the three numbers: pi ninths, four pi ninths, pi. The gaps are not equal.'),
      },
      {
        id: 'c', label: L('kub bo\'yicha', 'по кубу', 'as a cube'),
        hint: L("Kub keyinroq, hajmda paydo bo'ladi. Yuzada esa kvadrat.", 'Куб появится позже, в объёме. А в площади квадрат.', 'The cube appears later, in the volume. In the area it is a square.'),
      },
      {
        id: 'none', label: L("o'smaydi", 'не растёт', 'it does not grow'),
        hint: L("O'sadi: pi to'qqizdandan pigacha, ya'ni to'qqiz barobar.", 'Растёт: от пи девятых до пи, то есть в девять раз.', 'It grows: from pi ninths to pi, that is ninefold.'),
      },
    ],
  },
  holds: [2500, 6500, 1500, 2500, 9500, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi konusni kesamiz.', 'Опора восстановлена. Теперь разрежем конус.', 'The basics are back. Now let us slice the cone.'),
    A('mount', "Konusni balandlik bo'ylab gorizontal kesamiz. Har kesim doira, va uning radiusi balandlikka bog'liq.", 'Разрежем конус горизонтально по высоте. Каждое сечение это круг, и его радиус зависит от высоты.', 'We slice the cone horizontally along its height. Each section is a circle, and its radius depends on the height.'),
    A('mount', "Balandlikni tanlang.", 'Выбери высоту.', 'Pick a height.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Uchta kesim sanaldi. Yuzalar: pi to'qqizdan, to'rt pi to'qqizdan va pi. Ya'ni yuza kvadrat bo'yicha o'sadi, chunki radius mutanosib, yuzada esa u kvadratga ko'tariladi. Va integral ostida turadigan narsa aynan shu: kesim yuzasi.", 'Три сечения посчитаны. Площади: пи девятых, четыре пи девятых и пи. То есть площадь растёт по квадрату, потому что радиус пропорционален, а в площади он в квадрате. И под интегралом будет стоять именно это: площадь сечения.', 'Three sections counted. The areas: pi ninths, four pi ninths and pi. So the area grows as a square, because the radius is proportional and in the area it is squared. And this is exactly what will stand under the integral: the section area.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: integral ostida KESIM YUZASI.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'cross_section',
  eyebrow: L('Chegarani torting', 'Потяни границу', 'Drag the boundary'),
  title: L('Endi hajm to\'planadi', 'Теперь копится объём', 'Now the volume accumulates'),
  chip: 'S(x) = πx²/9',
  graph: {
    fn: CONE,
    xDomain: [-0.15, 3.4],
    yDomain: [-0.35, 3.5],
    xTicks: [{ v: 1 }, { v: 2 }, { v: 3 }],
    yTicks: [{ v: 0 }, { v: 3 }],
    a: 0,
    bStart: 1,
    step: 0.5,
    trace: true,
    fLabel: 'S(x)',
    sLabel: 'V',
    areaLabel: L('hajm', 'объём', 'volume'),
    height: 132,
  },
  graphSteps: 3,
  bonus: L(
    "Asbob o'sha, chegara o'sha. O'zgargani bitta: integral ostida endi kesim yuzasi turibdi, va to'planayotgani yuza emas, HAJM.",
    'Прибор тот же, граница та же. Изменилось одно: под интегралом теперь площадь сечения, и копится не площадь, а ОБЪЁМ.',
    'The same instrument, the same boundary. One thing changed: under the integral there is now the section area, and what accumulates is not area but VOLUME.',
  ),
  probe: {
    question: L("Hajmning katta qismi qayerda to'planadi?", 'Где набирается большая часть объёма?', 'Where does most of the volume build up?'),
    items: [
      { id: 'a', label: L('asosga yaqin uchdan birida', 'в трети, ближней к основанию', 'in the third nearest the base'), correct: true },
      { id: 'b', label: L('uchga yaqin', 'ближе к вершине', 'nearer the apex'), hint: L("U yerda kesimlar juda kichik: pi to'qqizdan.", 'Там сечения совсем маленькие: пи девятых.', 'The sections there are tiny: pi ninths.') },
      { id: 'c', label: L('bir tekis', 'равномерно', 'evenly'), hint: L("Izga qarang: u tekis emas, oxirida keskin ko'tariladi.", 'Посмотри на след: он не прямой, в конце круто идёт вверх.', 'Look at the trace: it is not straight, at the end it rises steeply.') },
      { id: 'd', label: L("o'rtada", 'посередине', 'in the middle'), hint: L("O'rtada kesim to'rt to'qqizdan, asosda esa to'qqiz to'qqizdan: ikki barobardan ko'p farq.", 'Посередине сечение четыре девятых, а у основания девять девятых: больше чем вдвое.', 'In the middle the section is four ninths, at the base nine ninths: more than twofold.') },
    ],
  },
  holds: [4500, 5500, 6000, 8000],
  audio: [
    A('mount', "Kesimlar sanaldi. Endi asbobga qaraymiz, va u tanish.", 'Сечения посчитаны. Теперь посмотрим на прибор, и он знакомый.', 'The sections are counted. Now look at the instrument, and it is familiar.'),
    A('one', "Yuqorida egri chiziq, lekin bu funksiyaning grafigi emas. Bu kesim yuzasining balandlikka bog'liqligi.", 'Сверху кривая, но это не график функции. Это зависимость площади сечения от высоты.', 'Above is a curve, but it is not a graph of a function. It is how the section area depends on the height.'),
    A('two', "Chegarani torting. Bo'yalgan joy endi yuza emas: har ingichka polosa bu yupqa disk, va ularning yig'indisi hajm beradi.", 'Потяни границу. Закрашенное теперь не площадь: каждая узкая полоска это тонкий диск, и их сумма даёт объём.', 'Drag the boundary. The shaded part is no longer an area: each narrow strip is a thin disc, and their sum gives the volume.'),
    A('tangent', "Chegarani uchgacha torting: hajm pi ga teng bo'ladi. Silindr esa uch pi bo'lardi. Mana o'sha uchdan bir, va u iks kvadratning integralidan chiqdi, boshqa hech qayerdan emas.", 'Дотяни границу до трёх: объём станет равен пи. А цилиндр был бы три пи. Вот она, треть, и вышла она из интеграла икс в квадрате, ниоткуда больше.', 'Drag the boundary to three: the volume becomes pi. A cylinder would be three pi. There is the third, and it came from the integral of x squared, from nowhere else.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1: V = ∫ S(x) dx.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'cross_section',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 2,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Hajm kesimlar bo\'yicha', 'Объём по сечениям', 'Volume by cross-sections'),
  rows: [
    'V = ∫ₐᵇ S(x) dx',
    'S(x) = πx²/9',
    'V = π/9 · 27/3 = π',
  ],
  probe: {
    question: L(
      "Uchdan bir formulada qayerdan paydo bo'ldi?",
      'Откуда в формуле взялась треть?',
      'Where did the third in the formula come from?',
    ),
    items: [
      { id: 'a', label: L("x² ning boshlang'ich funksiyasidan", 'из первообразной x²', 'from the antiderivative of x²'), correct: true },
      { id: 'b', label: L("doira yuzasidan", 'из площади круга', 'from the area of a circle'), hint: L("Doira yuzasida uchlik yo'q: u yerda faqat pi va radius kvadrat.", 'В площади круга тройки нет: там только пи и радиус в квадрате.', 'There is no three in the area of a circle: only pi and the radius squared.') },
      { id: 'c', label: L("uch balandligidan", 'из высоты, равной трём', 'from the height being three'), hint: L("Boshqa balandlik oling: uchdan bir baribir qoladi. Bu balandlikka bog'liq emas.", 'Возьми другую высоту: треть всё равно останется. Она не зависит от высоты.', 'Take another height: the third still stays. It does not depend on the height.') },
      { id: 'd', label: L("bu shunchaki kelishuv", 'это просто соглашение', 'it is just a convention'), hint: L("Kelishuv emas: uni hozirgina integraldan chiqardik.", 'Не соглашение: мы только что вывели её из интеграла.', 'Not a convention: we have just derived it from the integral.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Kesimlar bo\'yicha hajm', 'Правило 1. Объём по сечениям', 'Rule 1. Volume by sections'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'V = ∫ₐᵇ S(x) dx',
    lines: [
      L("integral ostida KESIM YUZASI turadi, radius emas", 'под интегралом стоит ПЛОЩАДЬ СЕЧЕНИЯ, а не радиус', 'the SECTION AREA stands under the integral, not the radius'),
      L("chegaralar o'sha o'q bo'yicha, qaysi bo'ylab kesilgan", 'границы по той же оси, вдоль которой резали', 'the bounds run along the same axis as the slicing'),
      L("konusda S kvadrat bo'yicha o'sadi, shuning uchun uchdan bir chiqadi", 'у конуса S растёт по квадрату, поэтому и выходит треть', 'for a cone S grows as a square, and that is why a third comes out'),
      L("piramidada ham xuddi shunday: asos boshqa, qoida o'sha", 'у пирамиды так же: основание другое, правило то же', 'the same for a pyramid: a different base, the same rule'),
    ],
    example: L('misol:  konus R = 1, H = 3   →   V = π', 'пример:  конус R = 1, H = 3  →  V = π', 'example:  a cone R = 1, H = 3  →  V = π'),
  },
  holds: [4000, 7000, 5000],
  audio: [
    A('mount', "Asbobda ko'rdik. Endi buni yozib chiqaramiz.", 'На приборе увидели. Теперь запишем и выведем.', 'We saw it on the instrument. Now let us write it out and derive it.'),
    A('def', "Hajm kesim yuzasining integraliga teng. Konusda kesim yuzasi pi karra iks kvadrat bo'lingan to'qqiz. Pi bo'lingan to'qqizni tashqariga chiqaramiz, ichida iks kvadrat qoladi, uning integrali esa yigirma yetti bo'lingan uch. Natijada pi chiqadi. Silindrning hajmi uch pi bo'lardi, ya'ni konus roppa rosa uch barobar kichik.", 'Объём равен интегралу площади сечения. У конуса площадь сечения это пи на икс в квадрате делить на девять. Пи девятых выносим наружу, внутри остаётся икс в квадрате, а его интеграл двадцать семь делить на три. В итоге выходит пи. У цилиндра объём был бы три пи, то есть конус ровно втрое меньше.', 'The volume equals the integral of the section area. For a cone the section area is pi times x squared over nine. We take pi over nine outside, x squared remains inside, and its integral is twenty seven over three. The result is pi. A cylinder would be three pi, so the cone is exactly three times smaller.'),
    A('rule', "To'g'ri. Uchdan bir doira yuzasidan ham, balandlikdan ham kelmagan. U iks kvadratning boshlang'ich funksiyasidan keldi. Geometriyada yodlatilgan formula shu yerda chiqarildi.", 'Верно. Треть пришла не из площади круга и не из высоты. Она пришла из первообразной икс в квадрате. Формула, которую в геометрии заучивают, здесь выведена.', 'Correct. The third came neither from the circle area nor from the height. It came from the antiderivative of x squared. The formula memorised in geometry is derived here.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: formula yo'q, o'lchovlar bor.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'accumulation',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Formula yo\'q, o\'lchovlar bor', 'Формулы нет, есть замеры', 'No formula, but measurements'),
  was: { label: UI.was, expr: 'S(x) = πx²/9   →   V = π' },
  now: { label: UI.now, expr: 'S: 0,  8,  12,  6   →   V = ?' },
  probe1: {
    question: L('Bu holat oldingisidan nimasi bilan farq qiladi?', 'Чем этот случай отличается от прежнего?', 'How does this case differ from the previous one?'),
    items: [
      { id: 'a', label: L("S formula bilan emas, jadval bilan berilgan", 'S задана не формулой, а таблицей', 'S is given by a table, not a formula'), correct: true },
      { id: 'b', label: L("bu yerda hajm yo'q", 'здесь нет объёма', 'there is no volume here'), hint: L("Bor: kesimlar bor, demak hajm ham bor.", 'Есть: сечения есть, значит и объём есть.', 'There is: sections exist, so the volume exists.') },
      { id: 'c', label: L("kesimlar doira emas", 'сечения не круги', 'the sections are not circles'), hint: L("Shakli muhim emas: integral ostida yuza turadi, shakl emas.", 'Форма не важна: под интегралом стоит площадь, а не форма.', 'The shape does not matter: the area stands under the integral, not the shape.') },
      { id: 'd', label: L("o'lchovlar juda kam", 'замеров слишком мало', 'there are too few measurements'), hint: L("To'rtta yetadi taxminiy javob uchun. Aniq javob uchun formula kerak.", 'Четырёх хватит для приближённого ответа. Для точного нужна формула.', 'Four are enough for an approximate answer. An exact one needs a formula.') },
    ],
  },
  probe2: {
    cols: 2,
    question: L('Hajmni sanash mumkinmi?', 'Можно ли посчитать объём?', 'Can the volume be computed?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: L('ha, taxminan', 'да, приближённо', 'yes, approximately') },
      { id: 'b', label: L('ha, roppa rosa', 'да, точно', 'yes, exactly') },
      { id: 'c', label: L("yo'q", 'нет', 'no') },
      { id: 'd', label: L("faqat formula bo'lsa", 'только если есть формула', 'only with a formula') },
    ],
  },
  holds: [5000, 7000, 4500, 3000],
  audio: [
    A('mount', "Hozirgacha kesim yuzasi formula bilan berilardi, va javob roppa rosa chiqardi.", 'До сих пор площадь сечения задавалась формулой, и ответ выходил точным.', 'So far the section area was given by a formula, and the answer came out exact.'),
    A('now', "Endi haqiqiy masala. Daryo o'zanining kesim yuzasi har ikki metrda o'lchangan: nol, sakkiz, o'n ikki, olti kvadrat metr. Formula yo'q va bo'lmaydi ham: bu o'lchov natijalari.", 'Теперь настоящая задача. Площадь сечения русла реки измерена через каждые два метра: ноль, восемь, двенадцать, шесть квадратных метров. Формулы нет и не будет: это результаты замеров.', 'Now a real problem. The cross-section area of a riverbed is measured every two metres: zero, eight, twelve, six square metres. There is no formula and there will not be: these are measurements.'),
    A('q1', 'Bu holat oldingisidan nimasi bilan farq qiladi?', 'Чем этот случай отличается от прежнего?', 'How does this case differ from the previous one?'),
    A('q2', 'Sizningcha hajmni sanash mumkinmi? Shunchaki taxmin qiling.', 'Как думаешь, можно ли посчитать объём? Просто предположи.', 'Do you think the volume can be computed? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: taxminiy javob ham javob.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'accumulation',
  eyebrow: L('Taxminiy javob ham javob', 'Приближённый ответ тоже ответ', 'An approximate answer is an answer too'),
  title: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  expr: L('S: 0,  8,  12,  6   ·   qadam 2 m', 'S: 0,  8,  12,  6   ·   шаг 2 м', 'S: 0,  8,  12,  6   ·   step 2 m'),
  need: '= ?',
  answerLabel: L('hajm', 'объём', 'the volume'),
  cards: [
    {
      tag: L('A nomzod', 'кандидат A', 'candidate A'),
      txt: L('sanab bo\'lmaydi', 'посчитать нельзя', 'it cannot be computed'),
      point: {
        label: L('formula yo\'q', 'формулы нет', 'no formula'),
        calc: '—   ✗',
        verdict: 'out',
      },
    },
    {
      tag: L('B nomzod', 'кандидат B', 'candidate B'),
      txt: L('trapetsiyalar bilan', 'трапециями', 'with trapezia'),
      point: {
        label: L('to\'rtta o\'lchov, uchta trapetsiya', 'четыре замера, три трапеции', 'four measurements, three trapezia'),
        calc: '8 + 20 + 18 = 46',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['46', '26', '52', '23'],
    value: ['46'],
    label: 'V ≈',
    prompt: L('Hajmni yozing', 'Запиши объём', 'Write the volume'),
    wrongs: [
      { key: '26', hint: L("O'lchovlarni qo'shdingiz. Har trapetsiyaning yuzasi qo'shni ikkitasining yarim yig'indisi karra qadam.", 'Здесь сложены сами замеры. Площадь каждой трапеции это полусумма соседних, умноженная на шаг.', 'You added the measurements. Each trapezium is the half-sum of neighbours times the step.') },
      { key: '52', hint: L("Bu barcha o'lchovlarning yig'indisi karra qadam. Har trapetsiyada YARIM yig'indi olinadi.", 'Это сумма всех замеров на шаг. В каждой трапеции берётся ПОЛУсумма.', 'That is the sum of all measurements times the step. Each trapezium takes the HALF-sum.') },
      { key: '23', hint: L("Yarim yig'indilar to'g'ri, lekin qadamga ko'paytirish unutilgan: har biri ikkiga ko'payadi.", 'Полусуммы верны, но забыто умножение на шаг: каждая умножается на два.', 'The half-sums are right, but the step was forgotten: each is multiplied by two.') },
      { key: '*', hint: L("Uchta trapetsiya: nol va sakkiz, sakkiz va o'n ikki, o'n ikki va olti. Har biri yarim yig'indi karra ikki.", 'Три трапеции: ноль и восемь, восемь и двенадцать, двенадцать и шесть. Каждая полусумма на два.', 'Three trapezia: zero and eight, eight and twelve, twelve and six. Each a half-sum times two.') },
    ],
  },
  holds: [3500, 6000, 7000, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala javobni ham ko\'ramiz.', 'Прогноз есть. Теперь посмотрим на оба ответа.', 'The guess is made. Now let us look at both answers.'),
    A('p1', "Birinchi nomzod: formula yo'q, demak integral ham yo'q, sanab bo'lmaydi. Bu javob tushunarli, lekin noto'g'ri.", 'Первый кандидат: формулы нет, значит нет и интеграла, посчитать нельзя. Ответ понятный, но неверный.', 'The first candidate: no formula, so no integral, it cannot be computed. An understandable answer, but wrong.'),
    A('p2', "Ikkinchi nomzod: qo'shni o'lchovlar orasidagi bo'lak trapetsiyaga o'xshaydi. Uchta trapetsiya: sakkiz, yigirma va o'n sakkiz. Jami qirq olti kub metr. Bu taxminiy son, lekin u haqiqiy va uni ishlatish mumkin.", 'Второй кандидат: кусок между соседними замерами похож на трапецию. Три трапеции: восемь, двадцать и восемнадцать. Всего сорок шесть кубометров. Это приближённое число, но оно настоящее и им можно пользоваться.', 'The second candidate: the piece between neighbouring measurements looks like a trapezium. Three trapezia: eight, twenty and eighteen. Forty six cubic metres in total. An approximate number, but a real one you can use.'),
    A('write', "Va bitta shart: javob yonida taxminiylik belgisi turishi kerak. U bezak emas, javobning qismi. Hajmni yozing.", 'И одно условие: рядом с ответом должен стоять знак приближения. Это не украшение, а часть ответа. Запиши объём.', 'And one condition: the approximation sign must stand next to the answer. It is not decoration but part of the answer. Write the volume.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2: OSTIDA NIMA TURSA, O'SHANI YIG'ADI.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'word_model',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L("Ostida nima tursa, o'shani yig'adi", 'Что под ним, то и складывает', 'It accumulates whatever stands under it'),
  cases: [
    {
      label: L('kesim yuzasi', 'площадь сечения', 'the section area'),
      text: L('hajm to\'planadi', 'копится объём', 'volume accumulates'),
      tone: 'graph',
    },
    {
      label: L('tezlik yoki kuch', 'скорость или сила', 'speed or force'),
      text: L("yo'l va ish to'planadi", 'копятся путь и работа', 'distance and work accumulate'),
      tone: 'accent',
    },
  ],
  rows: ['∫ S(x) dx = V', '∫ v(t) dt = s', '∫ F(x) dx = A'],
  probe: {
    question: L(
      "Kuch F = 2x, yo'l 0 dan 3 gacha. Ish nimaga teng?",
      'Сила F = 2x, путь от 0 до 3. Чему равна работа?',
      'A force F = 2x over a path from 0 to 3. What is the work?',
    ),
    items: [
      { id: 'a', label: '9', correct: true },
      { id: 'b', label: '18', hint: L("Bu kuchni yo'lga ko'paytirgani: olti karra uch. Lekin kuch o'zgarib turibdi, shuning uchun integral kerak.", 'Это сила на путь: шесть на три. Но сила меняется, поэтому нужен интеграл.', 'That is force times distance: six times three. But the force varies, so an integral is needed.') },
      { id: 'c', label: '6', hint: L("Bu oxirgi nuqtadagi kuch, ish emas.", 'Это сила в последней точке, а не работа.', 'That is the force at the last point, not the work.') },
      { id: 'd', label: '3', hint: L("Bu yo'lning o'zi.", 'Это сам путь.', 'That is the distance itself.') },
    ],
  },
  rule: {
    badge: L("2-qoida. Nima yig'iladi", 'Правило 2. Что накапливается', 'Rule 2. What accumulates'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: '∫ₐᵇ (nima) dx',
    lines: [
      L("kesim yuzasi ostida bo'lsa, hajm chiqadi", 'если под интегралом площадь сечения, выйдет объём', 'if the section area is under it, volume comes out'),
      L("tezlik bo'lsa, yo'l chiqadi", 'если скорость, выйдет путь', 'if speed, distance comes out'),
      L("kuch bo'lsa, ish chiqadi", 'если сила, выйдет работа', 'if force, work comes out'),
      L("kattalik o'zgarib turgani uchun ko'paytirish emas, integral kerak", 'величина меняется, поэтому нужно не умножение, а интеграл', 'the quantity varies, so an integral is needed, not a multiplication'),
    ],
    example: L('misol:  F = 2x,  0 … 3   →   A = 9', 'пример:  F = 2x, 0 … 3  →  A = 9', 'example:  F = 2x, 0 … 3  →  A = 9'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Blokning bitta qoidasi', 'Одно правило блока', 'The one rule of the block'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: '∫ₐᵇ f dx = F(b) − F(a)',
    lines: [
      L("1. integral ostidagi kattalik oraliq bo'ylab yig'iladi", '1. величина под интегралом складывается вдоль отрезка', '1. the quantity under the integral is summed along the segment'),
      L("2. yuza, hajm, yo'l, ish -- bitta yozuv", '2. площадь, объём, путь, работа это одна запись', '2. area, volume, distance, work are one record'),
      L('3. formula bo\'lsa javob aniq, o\'lchov bo\'lsa taxminiy', '3. есть формула — ответ точный, есть замеры — приближённый', '3. with a formula the answer is exact, with measurements approximate'),
      L("4. javobni ma'no bilan tekshir", '4. проверяй ответ смыслом', '4. check the answer by meaning'),
    ],
  },
  holds: [4000, 7000, 4500, 5000],
  audio: [
    A('mount', "Ikki holat ko'rildi. Endi eng muhim umumlashtirish.", 'Два случая разобраны. Теперь самое важное обобщение.', 'Two cases are done. Now the most important generalisation.'),
    A('rows', "Butun blok davomida integral ostida egri chiziqning balandligi turardi va yuza chiqardi. Bugun u yerga kesim yuzasi qo'yildi va hajm chiqdi. Xuddi shunday tezlik qo'yilsa yo'l chiqadi, kuch qo'yilsa ish chiqadi. Yozuv bitta, kattaliklar har xil.", 'Весь блок под интегралом стояла высота кривой и выходила площадь. Сегодня туда поставили площадь сечения и вышел объём. Точно так же поставишь скорость, выйдет путь, поставишь силу, выйдет работа. Запись одна, величины разные.', 'Through the whole block the height of a curve stood under the integral and area came out. Today the section area was put there and volume came out. In the same way put speed and distance comes out, put force and work comes out. One record, different quantities.'),
    A('q', "Savol: kuch o'zgarib turganda ish qanday sanaladi?", 'Вопрос: как считается работа, когда сила меняется?', 'The question: how is work computed when the force varies?'),
    A('rule', "To'g'ri. Kattalik o'zgarmas bo'lganda ko'paytirish yetardi. O'zgarib turganda esa ko'paytirish ishlamaydi, va o'rniga integral turadi.", 'Верно. Когда величина постоянна, хватало умножения. Когда она меняется, умножение не работает, и вместо него стоит интеграл.', 'Correct. When a quantity is constant, multiplication was enough. When it varies, multiplication fails, and an integral stands in its place.'),
    A('both', 'Endi butun blokni bitta qoidaga yig\'ing.', 'А теперь собери весь блок в одно правило.', 'Now combine the whole block into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. INTEGRAL OSTIGA NIMA QO'YILADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'cross_section',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Integral ostiga nima qo\'yiladi', 'Что ставится под интеграл', 'What goes under the integral'),
  left: L('konus, hajm kerak', 'конус, нужен объём', 'a cone, the volume is wanted'),
  template: ['V = ∫₀³ ', { slot: 0 }, ' dx'],
  signs: ['πx²/9', 'x/3'],
  answer: 'πx²/9',
  checkNote: L(
    "Uzunlikni uzunlik bo'ylab integrallasak yuza chiqadi, hajm emas",
    'Интеграл от длины по длине даёт площадь, а не объём',
    'Integrating a length along a length gives an area, not a volume',
  ),
  wrongs: [
    { key: 'x/3', hint: L("Bu radius, ya'ni uzunlik. Uni uzunlik bo'ylab integrallasangiz yuza chiqadi. Hajm uchun kesim yuzasi kerak.", 'Это радиус, то есть длина. Интегрируя её по длине, получишь площадь. Для объёма нужна площадь сечения.', 'That is the radius, a length. Integrating it along a length gives an area. For a volume the section area is needed.') },
  ],
  probe: {
    question: L("Nega radius emas, yuza?", 'Почему площадь, а не радиус?', 'Why the area and not the radius?'),
    items: [
      { id: 'a', label: L("yupqa qatlam bu disk, uning hajmi yuza karra qalinlik", 'тонкий слой это диск, его объём это площадь на толщину', 'a thin layer is a disc, its volume is area times thickness'), correct: true },
      { id: 'b', label: L("radius bilan sanash qiyinroq", 'с радиусом считать сложнее', 'the radius is harder to compute with'), hint: L("Qiyinlik emas, o'lchov masalasi: radius uzunlik, hajm esa uch o'lchovli.", 'Дело не в сложности, а в размерности: радиус это длина, а объём трёхмерен.', 'It is not about difficulty but about dimension: the radius is a length, the volume is three-dimensional.') },
      { id: 'c', label: L("chunki doira yumaloq", 'потому что круг круглый', 'because a circle is round'), hint: L("Shakl ahamiyatsiz: kvadrat kesimli piramidada ham xuddi shunday.", 'Форма не важна: у пирамиды с квадратным сечением так же.', 'The shape is irrelevant: the same holds for a pyramid with a square section.') },
      { id: 'd', label: L("ikkalasi ham to'g'ri", 'верны оба варианта', 'both are correct'), hint: L("Yo'q: radius bilan sanasangiz javob yuza birligida chiqadi.", 'Нет: с радиусом ответ выйдет в единицах площади.', 'No: with the radius the answer comes out in units of area.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Integral ostiga nima qo'yilishini tanlang.", 'Выбери, что поставить под интеграл.', 'Choose what goes under the integral.'),
    A('checked', "Bo'ldi. Endi ta'riflang: nega aynan yuza?", 'Получилось. Теперь сформулируй: почему именно площадь?', 'Done. Now put it into words: why the area?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ: piramida.
// ============================================================
const ACTIONS_10 = [
  { id: 'sect', label: L('kesimni topish', 'найти сечение', 'find the section') },
  { id: 'area', label: L('yuzasini yozish', 'записать площадь', 'write its area') },
  { id: 'calc', label: L('integrallash', 'проинтегрировать', 'integrate') },
  { id: 'mult', label: L("balandlikka ko'paytirish", 'умножить на высоту', 'multiply by the height') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'cross_section',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L('piramida:  asosi 2 × 2,  H = 3', 'пирамида: основание 2 × 2, H = 3', 'a pyramid: base 2 × 2, H = 3'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'sect',
      to: 'a(x) = 2x/3',
      wrongs: [
        { action: 'area', hint: L("Avval kesimning tomonini toping.", 'Сначала найди сторону сечения.', 'Find the side of the section first.') },
        { action: 'calc', hint: L("Integrallashga funksiya kerak.", 'Для интегрирования нужна функция.', 'Integrating needs a function.') },
        { action: 'mult', hint: L("Ko'paytirish faqat o'zgarmas kesimda ishlaydi. Bu yerda kesim o'zgaradi.", 'Умножение работает только при постоянном сечении. Здесь сечение меняется.', 'Multiplying works only for a constant section. Here the section varies.') },
      ],
    },
    {
      action: 'area',
      to: 'S(x) = 4x²/9',
      wrongs: [
        { action: 'sect', hint: L("Tomon topilgan: ikki iks bo'lingan uch.", 'Сторона найдена: два икс делить на три.', 'The side is found: two x over three.') },
        { action: 'calc', hint: L("Avval yuzani yozing: kvadratning yuzasi tomon kvadrat.", 'Сначала запиши площадь: у квадрата это сторона в квадрате.', 'Write the area first: for a square it is the side squared.') },
        { action: 'mult', hint: L("Kesim o'zgaradi, ko'paytirish yaramaydi.", 'Сечение меняется, умножение не годится.', 'The section varies, multiplying will not do.') },
      ],
    },
    {
      action: 'calc',
      to: 'V = 4/9 · 9 = 4',
      wrongs: [
        { action: 'sect', hint: L("Topilgan.", 'Найдена.', 'Found.') },
        { action: 'area', hint: L("Yozilgan: to'rt iks kvadrat bo'lingan to'qqiz.", 'Записана: четыре икс в квадрате делить на девять.', 'Written: four x squared over nine.') },
        { action: 'mult', hint: L("Ko'paytirish yaramaydi.", 'Умножение не годится.', 'Multiplying will not do.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['4', '12', '6', '8'],
    value: ['4'],
    label: 'V =',
    prompt: L('Hajmni yozing', 'Запиши объём', 'Write the volume'),
    wrongs: [
      { key: '12', hint: L("Bu prizmaning hajmi: asos karra balandlik. Piramida uch barobar kichik.", 'Это объём призмы: основание на высоту. Пирамида втрое меньше.', 'That is the volume of a prism: base times height. A pyramid is three times smaller.') },
      { key: '8', hint: L("Kub emas: kesim yuqoriga tomon kichrayadi.", 'Это не куб: сечение сужается кверху.', 'It is not a cube: the section narrows upward.') },
      { key: '*', hint: L("To'rt to'qqizdan tashqariga chiqadi, iks kvadratning integrali to'qqiz.", 'Четыре девятых выносится наружу, интеграл икс в квадрате девять.', 'Four ninths comes outside, the integral of x squared is nine.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi piramidani sanaymiz: kesim doira emas, kvadrat.', 'Правило сформулировано. Посчитаем пирамиду: сечение не круг, а квадрат.', 'The rule is stated. Let us count a pyramid: the section is not a circle but a square.'),
    A('start', "Diqqat: ro'yxatda ortiqcha amal bor. Nimadan boshlashni tanlang.", 'Внимание: в списке есть лишнее действие. Выбери, с чего начать.', 'Careful: the list has one superfluous action. Choose where to start.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL: ish, imtihon formatida.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'word_model',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Rasmga qarab hisoblang', 'Посчитай по рисунку', 'Count it from the picture'),
  start: L("kuch grafigi berilgan, ish kerak", 'дан график силы, нужна работа', 'a force graph is given, the work is wanted'),
  fig: () => (
    <AreaBoard
      fn={FORCE}
      xDomain={[-0.2, 3.4]}
      yDomain={[-0.6, 6.6]}
      xTicks={[{ v: 1 }, { v: 2 }, { v: 3 }]}
      yTicks={[{ v: 0 }, { v: 6 }]}
      a={0}
      b={3}
      fLabel="F = 2x"
      height={112}
    />
  ),
  actions: ACTIONS_10,
  hint: L(
    "Kuch o'zgarib turibdi, demak ko'paytirish yaramaydi.",
    'Сила меняется, значит умножение не годится.',
    'The force varies, so multiplying will not do.',
  ),
  steps: [
    {
      action: 'sect',
      to: 'F(x) = 2x',
      wrongs: [
        { action: 'area', hint: L("Bu yerda yuza emas, kuchning o'zi integral ostida turadi.", 'Здесь под интегралом не площадь, а сама сила.', 'Here the force itself stands under the integral, not an area.') },
        { action: 'calc', hint: L("Avval nimani integrallashni ayting.", 'Сначала скажи, что интегрируем.', 'First say what is being integrated.') },
        { action: 'mult', hint: L("Kuch o'zgarmas emas.", 'Сила не постоянна.', 'The force is not constant.') },
      ],
    },
    {
      action: 'calc',
      to: 'A = 9',
      wrongs: [
        { action: 'sect', hint: L("Aniqlangan: kuch ikki iks.", 'Определено: сила два икс.', 'Settled: the force is two x.') },
        { action: 'area', hint: L("Bu masalada kesim yo'q.", 'В этой задаче сечения нет.', 'There is no section in this problem.') },
        { action: 'mult', hint: L("Ko'paytirish o'n sakkiz berardi, va bu xato.", 'Умножение дало бы восемнадцать, и это неверно.', 'Multiplying would give eighteen, and that is wrong.') },
      ],
    },
    {
      action: 'area',
      to: L('javob: 9 J', 'ответ: 9 Дж', 'answer: 9 J'),
      wrongs: [
        { action: 'sect', hint: L("Aniqlangan.", 'Определено.', 'Settled.') },
        { action: 'calc', hint: L("Sanalgan: to'qqiz.", 'Посчитано: девять.', 'Counted: nine.') },
        { action: 'mult', hint: L("Ko'paytirish yaramaydi.", 'Умножение не годится.', 'Multiplying will not do.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['9', '18', '6', '3'],
    value: ['9'],
    label: 'A =',
    prompt: L('Ishni yozing', 'Запиши работу', 'Write the work'),
    wrongs: [
      { key: '18', hint: L("Bu oxirgi kuchni yo'lga ko'paytirgani. Kuch esa nolda noldan boshlangan.", 'Это последняя сила на путь. А сила начиналась с нуля в нуле.', 'That is the final force times the path. But the force started at zero.') },
      { key: '6', hint: L("Bu oxirgi nuqtadagi kuch.", 'Это сила в последней точке.', 'That is the force at the last point.') },
      { key: '*', hint: L("Figura uchburchak: katetlari uch va olti.", 'Фигура треугольник: катеты три и шесть.', 'The figure is a triangle: legs three and six.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek: formula emas, chizma.", 'Теперь полностью сам, как на экзамене: не формула, а чертёж.', 'Now completely on your own, as on the exam: not a formula but a drawing.'),
    A('go', "Kuch nol dan olti nyutongacha o'sadi, yo'l uch metr. Ko'paytirish yaramaydi.", 'Сила растёт от нуля до шести ньютонов, путь три метра. Умножение не годится.', 'The force grows from zero to six newtons, the path is three metres. Multiplying will not do.'),
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
      id: 'b1', tag: 'cross_section', ask: true, cols: 2,
      done: L('kesim yuzasi', 'площадь сечения', 'the section area'),
      prompt: L('Hajm uchun integral ostida nima turadi?', 'Что стоит под интегралом для объёма?', 'What stands under the integral for a volume?'),
      items: [
        { id: 'a', label: L('kesim yuzasi', 'площадь сечения', 'the section area'), correct: true },
        { id: 'b', label: L('kesim radiusi', 'радиус сечения', 'the section radius'), hint: L("Radius uzunlik: uni integrallasak yuza chiqadi.", 'Радиус это длина: интегрируя её, получим площадь.', 'The radius is a length: integrating it gives an area.') },
        { id: 'c', label: L('jismning balandligi', 'высота тела', 'the height of the body'), hint: L("Balandlik chegaralarga kiradi, integral ostiga emas.", 'Высота входит в границы, а не под интеграл.', 'The height goes into the bounds, not under the integral.') },
        { id: 'd', label: L("to'liq sirt yuzasi", 'площадь полной поверхности', 'the total surface area'), hint: L("Sirt boshqa masala. Bu yerda ichki kesim kerak.", 'Поверхность это другая задача. Здесь нужно внутреннее сечение.', 'The surface is a different problem. Here the inner section is needed.') },
      ],
    },
    {
      id: 'b2', tag: 'cross_section', ask: true, cols: 4,
      done: L('konus R = 2, H = 3   →   4π', 'конус R = 2, H = 3  →  4π', 'a cone R = 2, H = 3  →  4π'),
      prompt: L('Konus R = 2, H = 3. Hajmi?', 'Конус R = 2, H = 3. Объём?', 'A cone R = 2, H = 3. Its volume?'),
      items: [
        { id: 'a', label: '4π', correct: true },
        { id: 'b', label: '12π', hint: L("Bu silindr. Konus uch barobar kichik.", 'Это цилиндр. Конус втрое меньше.', 'That is the cylinder. The cone is three times smaller.') },
        { id: 'c', label: '2π', hint: L("Radius kvadratga ko'tariladi: ikkining kvadrati to'rt.", 'Радиус в квадрате: два в квадрате четыре.', 'The radius is squared: two squared is four.') },
        { id: 'd', label: '6π', hint: L("Bir uchdan karra to'rt pi karra uch: to'rt pi.", 'Одна треть на четыре пи на три: четыре пи.', 'One third times four pi times three: four pi.') },
      ],
    },
    {
      id: 'b3', tag: 'word_model', ask: true, cols: 2,
      done: L('tezlikning integrali', 'интеграл от скорости', 'the integral of speed'),
      prompt: L("Tezlik o'zgarib turibdi. Yo'l qanday topiladi?", 'Скорость меняется. Как найти путь?', 'The speed varies. How is the distance found?'),
      items: [
        { id: 'a', label: L('tezlikni integrallash', 'проинтегрировать скорость', 'integrate the speed'), correct: true },
        { id: 'b', label: L("tezlikni vaqtga ko'paytirish", 'умножить скорость на время', 'multiply speed by time'), hint: L("Bu faqat o'zgarmas tezlikda ishlaydi.", 'Это работает только при постоянной скорости.', 'That works only for a constant speed.') },
        { id: 'c', label: L("o'rtacha tezlikni olish", 'взять среднюю скорость', 'take the average speed'), hint: L("O'rtacha tezlikni topish uchun ham integral kerak bo'ladi.", 'Чтобы найти среднюю скорость, тоже понадобится интеграл.', 'Finding the average speed needs an integral too.') },
        { id: 'd', label: L('tezlikni differensiallash', 'продифференцировать скорость', 'differentiate the speed'), hint: L("Bu tezlanish beradi, yo'l emas.", 'Это даст ускорение, а не путь.', 'That gives acceleration, not distance.') },
      ],
    },
    {
      id: 'b4', tag: 'word_model', ask: true, cols: 4,
      done: 'F = 2x,  0 … 3   →   A = 9',
      prompt: L('F = 2x, yo\'l 0 … 3. Ish?', 'F = 2x, путь 0 … 3. Работа?', 'F = 2x, path 0 … 3. The work?'),
      items: [
        { id: 'a', label: '9', correct: true },
        { id: 'b', label: '18', hint: L("Bu oxirgi kuch karra yo'l. Kuch esa o'zgarib turgan.", 'Это последняя сила на путь. А сила менялась.', 'That is the final force times the path. But the force varied.') },
        { id: 'c', label: '6', hint: L("Bu oxirgi nuqtadagi kuch.", 'Это сила в последней точке.', 'That is the force at the last point.') },
        { id: 'd', label: '3', hint: L("Bu yo'lning uzunligi.", 'Это длина пути.', 'That is the length of the path.') },
      ],
    },
    {
      id: 'b5', tag: 'accumulation', ask: true, cols: 2,
      done: L('ha, taxminan', 'да, приближённо', 'yes, approximately'),
      prompt: L(
        "S jadval bilan berilgan, formula yo'q. Hajmni sanash mumkinmi?",
        'S задана таблицей, формулы нет. Можно посчитать объём?',
        'S is given by a table, with no formula. Can the volume be computed?',
      ),
      items: [
        { id: 'a', label: L('ha, taxminan', 'да, приближённо', 'yes, approximately'), correct: true },
        { id: 'b', label: L("yo'q, formula kerak", 'нет, нужна формула', 'no, a formula is needed'), hint: L("Trapetsiyalar formulasiz ham ishlaydi.", 'Трапеции работают и без формулы.', 'Trapezia work without a formula too.') },
        { id: 'c', label: L('ha, roppa rosa', 'да, точно', 'yes, exactly'), hint: L("Roppa rosa emas: o'lchovlar orasida nima borligini bilmaymiz.", 'Не точно: между замерами мы не знаем, что происходит.', 'Not exactly: between the measurements we do not know what happens.') },
        { id: 'd', label: L("faqat kesim doira bo'lsa", 'только если сечение круг', 'only if the section is a circle'), hint: L("Shakl ahamiyatsiz: yuzalar berilgan.", 'Форма не важна: площади уже даны.', 'The shape is irrelevant: the areas are already given.') },
      ],
    },
    {
      id: 'b6', tag: 'cross_section', ask: true, cols: 2,
      done: L("x² ning integralidan", 'из интеграла x²', 'from the integral of x²'),
      prompt: L('Konus hajmidagi uchdan bir qayerdan?', 'Откуда треть в объёме конуса?', 'Where does the third in the cone volume come from?'),
      items: [
        { id: 'a', label: L("x² ning integralidan", 'из интеграла x²', 'from the integral of x²'), correct: true },
        { id: 'b', label: L('doira yuzasidan', 'из площади круга', 'from the area of a circle'), hint: L("U yerda uchlik yo'q: faqat pi va radius kvadrat.", 'Там тройки нет: только пи и радиус в квадрате.', 'There is no three there: only pi and the radius squared.') },
        { id: 'c', label: L("uch o'lchovlilikdan", 'из трёхмерности', 'from three-dimensionality'), hint: L("O'lchov soni bilan bog'liq emas: piramidada ham o'sha uchdan bir.", 'Размерность ни при чём: у пирамиды та же треть.', 'Dimension is beside the point: a pyramid has the same third.') },
        { id: 'd', label: L("shunday kelishilgan", 'так договорились', 'that is the convention'), hint: L("Kelishuv emas: biz uni chiqardik.", 'Не договорённость: мы её вывели.', 'Not a convention: we derived it.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Boshqa konus.", 'Другой конус.', 'A different cone.'),
    A('q3', "Endi fizika.", 'Теперь физика.', 'Now physics.'),
    A('q4', "Ish haqida.", 'Про работу.', 'About work.'),
    A('q5', "O'lchovlar haqida.", 'Про замеры.', 'About measurements.'),
    A('q6', 'Oxirgi savol, va u darsning bosh savoli.', 'Последний вопрос, и он главный в уроке.', 'The last question, and it is the main one of the lesson.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: radius integral ostida.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'cross_section',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("O'lcham javobni fosh qiladi", 'Размерность разоблачает ответ', 'Dimension exposes the answer'),
  rows: [
    { id: 'r1', text: L('konus:  R = 1,  H = 3', 'конус: R = 1, H = 3', 'a cone: R = 1, H = 3') },
    { id: 'r2', text: 'r(x) = x/3' },
    { id: 'r3', text: 'V = ∫₀³ (x/3) dx' },
    { id: 'r4', text: L('javob: 1,5', 'ответ: 1,5', 'answer: 1,5') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Bu satr to'g'ri: radius haqiqatan iks bo'lingan uch.", 'Эта строка верна: радиус действительно икс делить на три.', 'This line is right: the radius really is x over three.'),
    r4: L("Javob xato, lekin u oldingi satrda xato bo'lgan.", 'Ответ неверный, но неверным он стал строкой раньше.', 'The answer is wrong, but it became wrong one line earlier.'),
  },
  proofPoint: L('uzunlik karra uzunlik = yuza', 'длина на длину = площадь', 'length times length = area'),
  proof: L(
    "Integral ostida radius turibdi, ya'ni uzunlik. Uzunlikni uzunlik bo'ylab integrallasak yuza chiqadi, hajm emas. Kesim yuzasini qo'yish kerak edi: pi karra iks kvadrat bo'lingan to'qqiz, va unda javob pi bo'lardi.",
    'Под интегралом стоит радиус, то есть длина. Интеграл от длины по длине даёт площадь, а не объём. Надо было поставить площадь сечения: пи на икс в квадрате делить на девять, и тогда ответ был бы пи.',
    'The radius stands under the integral, that is a length. Integrating a length along a length gives an area, not a volume. The section area had to be put there: pi times x squared over nine, and then the answer would be pi.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L("integral ostida yuza emas, radius turibdi", 'под интегралом радиус, а не площадь', 'the radius stands under the integral, not the area'), correct: true },
      { id: 'b', label: L('chegaralar xato', 'границы неверны', 'the bounds are wrong'), hint: L("Chegaralar to'g'ri: noldan balandlikkacha.", 'Границы верны: от нуля до высоты.', 'The bounds are right: from zero to the height.') },
      { id: 'c', label: L("radius noto'g'ri topilgan", 'радиус найден неверно', 'the radius is found wrongly'), hint: L("Radius to'g'ri: uchda bir, birda uchdan bir.", 'Радиус верен: в трёх единица, в единице треть.', 'The radius is right: one at three, a third at one.') },
      { id: 'd', label: L("arifmetikada xato", 'ошибка в арифметике', 'an arithmetic error'), hint: L("Arifmetika to'g'ri: bir yarim haqiqatan shu integraldan chiqadi.", 'Арифметика верна: полтора действительно выходит из этого интеграла.', 'The arithmetic is right: one and a half really comes from that integral.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda radius to'g'ri topilgan va arifmetika ham to'g'ri. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь радиус найден верно и арифметика верна. Найди строку, в которой ошибка появилась впервые.', 'Here the radius is found correctly and the arithmetic is right. Find the line where the error first appeared.'),
    A('proof', "Tekshiruv o'lcham bilan. Integral ostida uzunlik turibdi va uni uzunlik bo'ylab integrallayapmiz: natija yuza bo'ladi, hajm emas. Hajm uchun ostiga yuza qo'yiladi.", 'Проверка размерностью. Под интегралом длина, и мы интегрируем её по длине: получится площадь, а не объём. Для объёма под интеграл ставят площадь.', 'A check by dimension. A length stands under the integral and we integrate it along a length: the result is an area, not a volume. For a volume an area goes under the integral.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'cross_section',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L("ostida kesim yuzasi", 'под интегралом площадь', 'the area under the integral'),
  tasks: [
    {
      prompt: L('konus R = 1, H = 3', 'конус R = 1, H = 3', 'a cone R = 1, H = 3'),
      template: ['V = ∫₀³ ', { slot: 0 }, ' dx  =  ', { slot: 1 }],
      parts: ['πx²/9', 'x/3', 'π', '3π'],
      answer: ['πx²/9', 'π'],
      doneLabel: 'V = π',
      wrongs: [
        { key: 'x/3|π', hint: L("Integral ostiga yuza qo'yiladi, radius emas.", 'Под интеграл ставится площадь, а не радиус.', 'The area goes under the integral, not the radius.') },
        { key: '*', hint: L("Yuza pi karra iks kvadrat bo'lingan to'qqiz, natija esa pi.", 'Площадь это пи на икс в квадрате делить на девять, а итог пи.', 'The area is pi times x squared over nine, and the result is pi.') },
      ],
    },
    {
      prompt: L('kuch F = 2x, yo\'l 0 … 3', 'сила F = 2x, путь 0 … 3', 'a force F = 2x, path 0 … 3'),
      template: ['A = ∫₀³ ', { slot: 0 }, ' dx  =  ', { slot: 1 }],
      parts: ['2x', 'x²', '9', '18'],
      answer: ['2x', '9'],
      doneLabel: 'A = 9',
      wrongs: [
        { key: '2x|18', hint: L("O'n sakkiz bu ko'paytirish. Integral to'qqiz beradi.", 'Восемнадцать это умножение. Интеграл даёт девять.', 'Eighteen is the multiplication. The integral gives nine.') },
        { key: '*', hint: L("Integral ostida kuchning o'zi turadi.", 'Под интегралом стоит сама сила.', 'The force itself stands under the integral.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi, va u geometriya emas, fizika.", 'А теперь второе, и оно не геометрия, а физика.', 'And now the second one, and it is not geometry but physics.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN. BLOK YOPILADI.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'cross_section',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: '∫ₐᵇ S(x) dx = V',
  ruleLines: [
    L("integral ostida nima tursa, o'shani yig'adi", 'что стоит под интегралом, то он и складывает', 'the integral accumulates whatever stands under it'),
    L("hajm uchun kesim yuzasi, yo'l uchun tezlik, ish uchun kuch", 'для объёма площадь сечения, для пути скорость, для работы сила', 'the section area for volume, speed for distance, force for work'),
    L('formula bo\'lsa aniq, o\'lchov bo\'lsa taxminiy', 'есть формула — точно, есть замеры — приближённо', 'with a formula exactly, with measurements approximately'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('uchdan bir qayerdan', 'откуда треть', 'where the third is from'),
      right: L('integraldan', 'из интеграла', 'from the integral'),
      map: {
        a: L('shunday yodlanadi', 'просто запоминают', 'simply memorised'),
        b: L('integraldan', 'из интеграла', 'from the integral'),
        both: '—',
        none: '—',
      },
    },
    {
      screen: 5,
      expr: L('S jadvalda', 'S таблицей', 'S in a table'),
      right: L('ha, taxminan', 'да, приближённо', 'yes, approximately'),
      map: {
        a: L('ha, taxminan', 'да, приближённо', 'yes, approximately'),
        b: L('ha, roppa rosa', 'да, точно', 'yes, exactly'),
        c: L("yo'q", 'нет', 'no'),
        d: L("faqat formula bilan", 'только с формулой', 'only with a formula'),
      },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: 'V = π/9 · ∫₀³ x² dx = π/9 · 9 = π',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Kesimlar ekraniga qayting', 'Вернись к экрану с сечениями', 'Go back to the sections screen'),
  },
  probe: {
    question: L(
      "Bir xil integral turli kattaliklarni bera oladimi?",
      'Может ли один и тот же интеграл давать разные величины?',
      'Can one and the same integral give different quantities?',
    ),
    items: [
      { id: 'a', label: L("ha: ostida nima tursa, o'sha", 'да: смотря что стоит под ним', 'yes: it depends on what stands under it'), correct: true },
      { id: 'b', label: L("yo'q, integral faqat yuza beradi", 'нет, интеграл даёт только площадь', 'no, an integral gives only area'), hint: L("Bugun u hajm, yo'l va ishni berdi.", 'Сегодня он дал объём, путь и работу.', 'Today it gave volume, distance and work.') },
      { id: 'c', label: L("faqat fizikada", 'только в физике', 'only in physics'), hint: L("Konus geometriya, va u ham shu integraldan chiqdi.", 'Конус это геометрия, и он тоже вышел из этого интеграла.', 'The cone is geometry, and it came from this integral too.') },
      { id: 'd', label: L("faqat chegaralar boshqa bo'lsa", 'только если границы другие', 'only if the bounds differ'), hint: L("Chegaralar bir xil bo'lsa ham, ostidagi boshqa bo'lsa natija boshqa.", 'Даже при тех же границах другой подынтегральный даёт другой результат.', 'Even with the same bounds a different integrand gives a different result.') },
    ],
  },
  sheetTitle: L('Tatbiqlar · shpargalka', 'Приложения · шпаргалка', 'Applications · cheat sheet'),
  sheetSrc: L('11-sinf · 7-dars', '11 класс · урок 7', 'Grade 11 · lesson 7'),
  lifehack: L(
    "Masalani o'qib, birinchi savol bitta: integral ostiga NIMA qo'yiladi. Qolgani texnika.",
    'Прочитал задачу — первый вопрос один: ЧТО поставить под интеграл. Остальное техника.',
    'Read the problem and ask one first question: WHAT goes under the integral. The rest is technique.',
  ),
  holds: [2500, 8000, 7000, 5000],
  audio: [
    A('mount', 'Dars tugadi, va u bilan birga butun blok. Boshiga qaytamiz.', 'Урок закончен, а вместе с ним и весь блок. Вернёмся к началу.', 'The lesson is over, and with it the whole block. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Konus hajmidagi uchdan bir hech qanday kelishuv emas: u iks kvadratning boshlang'ich funksiyasidan chiqdi, va biz buni qadamba qadam ko'rdik.", 'Вот твои прогнозы и вот как оказалось. Треть в объёме конуса это не соглашение: она вышла из первообразной икс в квадрате, и мы видели это по шагам.', 'Here are your guesses and here is how it turned out. The third in the cone volume is no convention: it came from the antiderivative of x squared, and we saw it step by step.'),
    A('rule', "Va mana blokning asosiy fikri. Integral bu yig'uvchi. Ostiga egri chiziqning balandligini qo'ysangiz yuza chiqadi, kesim yuzasini qo'ysangiz hajm, tezlikni qo'ysangiz yo'l, kuchni qo'ysangiz ish. To'rtta formula emas, bitta yozuv.", 'И вот главная мысль блока. Интеграл это накопитель. Поставишь под него высоту кривой, выйдет площадь, площадь сечения даёт объём, скорость даёт путь, сила даёт работу. Не четыре формулы, а одна запись.', 'And here is the main point of the block. The integral is an accumulator. Put the height of a curve under it and area comes out, the section area gives volume, speed gives distance, force gives work. Not four formulas but one record.'),
    A('q', "Oxirgi savol butun blok haqida.", 'Последний вопрос про весь блок.', 'The last question is about the whole block.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
