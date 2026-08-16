// ============================================================================
// 11-sinf, Dars 30. SIRTLAR YUZASI.
//
// B4 blokining to'rtinchi darsi. Faqat MA'LUMOT.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpinBoard`, `net` rejimi -- yon sirt yoyiladi
//
// DARSNING BITTA GAPI: sirt yuzasi FORMULA emas, YOYILMA. Silindrniki
// to'rtburchakka, konusniki sektorga yoyiladi, va yuza 8-sinf
// planimetriyasi bilan sanaladi.
//
// KONUS FORMULASI SHU YERDA TUG'ILADI. Sektorning yoyi 2 pi r, radiusi l.
// Demak sektor to'liq doiraning r / l ulushini egallaydi:
//   pi l kvadrat karra (r / l) = pi r l.
// r = 3, l = 5 da ulush 0,6, to'liq doira 25 pi, sektor 15 pi. Sonlar
// tekshirilgan, sektor burchagi 216 daraja.
//
// DARSLIK HAQIDA. Bu dars butunlay darsliksiz: geometriya qismi
// repozitoriyda yo'q (`PODXOD_11SINF.md` §2). Metodist qarori 2026-08-15.
// O'zbekcha atamalar DRAFT.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_30',
  title: L('Sirtlar yuzasi', 'Площади поверхностей', 'Surface areas'),
}

const BLOCK = { label: 'B4', from: 26, to: 33, current: 30 }

// ============================================================
// SLAYD 1. XUK. Sektorning yuzasi.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Sirtlar yuzasi', 'Площади поверхностей', 'Surface areas'),
  title: L('Konusni qirqib yoyamiz', 'Разрежем конус и развернём', 'Cut the cone open and unroll it'),
  expr: 'r = 3,  l = 5',
  rows: [
    {
      id: 'a',
      name: L('birinchi', 'первый', 'the first'),
      value: L("to'liq doira:  πl² = 25π", 'полный круг: πl² = 25π', 'a full circle: πl² = 25π'),
    },
    {
      id: 'b',
      name: L('ikkinchi', 'второй', 'the second'),
      value: L('sektor:  25π ning 0,6 qismi', 'сектор: 0,6 от 25π', 'a sector: 0,6 of 25π'),
    },
  ],
  probe: {
    question: L('Yon sirt yuzasi qancha?', 'Чему равна боковая поверхность?', 'What is the side area?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi konusni yoyamiz.",
      'Твой ответ записан. Сейчас развернём конус.',
      'Your answer is saved. Now we will unroll the cone.',
    ),
    items: [
      { id: 'a', label: '25π' },
      { id: 'b', label: '15π' },
      { id: 'both', label: '9π' },
      { id: 'none', label: '30π' },
    ],
  },
  holds: [5000, 5000, 4500, 4000],
  audio: [
    A('mount', "Uchta jismni yasadik. Endi ularni qirqib, tekislikka yoyamiz: shunda sirt yuzasi tanish tekis figuraga aylanadi.", 'Мы построили три тела. Теперь разрежем их и развернём на плоскость: тогда площадь поверхности станет знакомой плоской фигурой.', 'We have built three solids. Now let us cut them open and lay them flat: then the surface area becomes a familiar plane figure.'),
    A('r1', "Konusni yasovchi bo'ylab qirqamiz. Birinchi fikr: yoyilma to'liq doira bo'ladi, radiusi yasovchiga teng, ya'ni yuzasi yigirma besh pi.", 'Разрежем конус по образующей. Первое мнение: развёртка это полный круг радиуса образующей, значит площадь двадцать пять пи.', 'Cut the cone along a generator. The first opinion: the net is a full circle of radius the generator, so the area is twenty five pi.'),
    A('r2', "Ikkinchi fikr: yoyilma doira emas, sektor, va u to'liq doiraning nol butun olti qismini egallaydi.", 'Второе мнение: развёртка не круг, а сектор, и он занимает шесть десятых полного круга.', 'The second opinion: the net is not a circle but a sector, and it takes six tenths of the full circle.'),
    A('ask', "Sizningcha yuza qancha? Hozircha shunchaki taxmin qiling.", 'Как думаешь, чему равна площадь? Пока просто предположи.', 'What do you think the area is? Just make a guess for now.'),
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
    "Hammasi 8-sinf planimetriyasidan. Bu baholanmaydi.",
    'Всё из планиметрии 8 класса. Это не оценивается.',
    'All from grade 8 planimetry. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L("To'rtburchak yuzasi", 'Площадь прямоугольника', 'Rectangle area'),
      short: L('yoyilma uchun', 'для развёртки', 'for the net'),
      ex: [{ e: 'S = a · b', why: L('silindr yon sirti shunday', 'боковая цилиндра такая же', 'the cylinder side is one') }],
    },
    {
      id: 'c2',
      title: L('Aylana uzunligi', 'Длина окружности', 'Circumference'),
      short: L('yoyilmaning tomoni', 'сторона развёртки', 'a side of the net'),
      ex: [{ e: 'C = 2πr', why: L('asos yoyilganda shu chiqadi', 'основание разворачивается в неё', 'the base unrolls into it') }],
    },
    {
      id: 'c3',
      title: L('Sektor', 'Сектор', 'A sector'),
      short: L('doiraning bir qismi', 'часть круга', 'part of a circle'),
      ex: [{ e: L('ulush = yoy / aylana', 'доля = дуга / окружность', 'share = arc / circumference'), why: L('yuza ham shu ulushda', 'площадь в той же доле', 'the area is in the same share') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L('Tomonlari 4π va 3. Yuzasi?', 'Стороны 4π и 3. Площадь?', 'Sides 4π and 3. The area?'),
      cols: 4,
      items: [
        { id: 'a', label: '12π', correct: true },
        { id: 'b', label: '7π', hint: L("Qo'shish emas, ko'paytirish.", 'Не сложение, а умножение.', 'Not adding but multiplying.') },
        { id: 'c', label: '12', hint: L("Pi tushib qolgan.", 'Потерялось пи.', 'Pi is missing.') },
        { id: 'd', label: '4π', hint: L("Ikkinchi tomon hisobga olinmagan.", 'Вторая сторона не учтена.', 'The second side was ignored.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L('Yoy 6π, aylana 10π. Ulush?', 'Дуга 6π, окружность 10π. Доля?', 'Arc 6π, circle 10π. The share?'),
      cols: 4,
      items: [
        { id: 'a', label: '0,6', correct: true },
        { id: 'b', label: '0,6π', hint: L("Bo'lishda pi qisqaradi.", 'При делении пи сокращается.', 'Pi cancels in the division.') },
        { id: 'c', label: '1,67', hint: L("Teskari bo'lingan: yoy aylanadan kichik.", 'Поделено наоборот: дуга меньше окружности.', 'Divided the wrong way: the arc is less than the circle.') },
        { id: 'd', label: '4π', hint: L("Bu ayirma, ulush emas.", 'Это разность, а не доля.', 'That is the difference, not the share.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L('25π ning 0,6 qismi?', '0,6 от 25π?', '0,6 of 25π?'),
      cols: 4,
      items: [
        { id: 'a', label: '15π', correct: true },
        { id: 'b', label: '10π', hint: L("Bu qolgan qismi: 0,4.", 'Это оставшаяся часть: 0,4.', 'That is the remaining part: 0,4.') },
        { id: 'c', label: '1,5π', hint: L("O'n barobar kichik.", 'В десять раз меньше.', 'Ten times too small.') },
        { id: 'd', label: '25,6π', hint: L("Bu qo'shish.", 'Это сложение.', 'That is adding.') },
      ],
    },
  ],
  holds: [3000, 4500, 4500, 4500, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch: to'rtburchak yuzasi tomonlarning ko'paytmasi. Silindrning yon sirti aynan to'rtburchakka yoyiladi.", 'Первая опора: площадь прямоугольника это произведение сторон. Боковая поверхность цилиндра разворачивается именно в прямоугольник.', 'The first basic: a rectangle area is the product of its sides. A cylinder side surface unrolls exactly into a rectangle.'),
    A('c2', "Ikkinchi tayanch: aylana uzunligi. Asos yoyilganda u to'g'ri chiziqqa aylanadi va yoyilmaning tomoni bo'ladi.", 'Вторая опора: длина окружности. При развёртке основание распрямляется и становится стороной развёртки.', 'The second basic: the circumference. When unrolled, the base straightens into a side of the net.'),
    A('c3', "Uchinchi tayanch: sektor. Uning yuzasi to'liq doiradan shuncha ulushni oladi, yoyi aylanadan qancha ulush olsa.", 'Третья опора: сектор. Его площадь берёт от полного круга ту же долю, какую его дуга берёт от окружности.', 'The third basic: a sector. Its area takes the same share of the full circle as its arc takes of the circumference.'),
    A('recap', "Uchtasi birga bugungi formulalarni beradi.", 'Три вместе и дают сегодняшние формулы.', 'The three together give today\'s formulas.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. SEKTORNI SANAYMIZ.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'sector_not_circle',
  eyebrow: L('Sektorni sanaymiz', 'Считаем сектор', 'Computing the sector'),
  title: L('Yoyilma doira emas', 'Развёртка не круг', 'The net is not a circle'),
  expr: 'r = 3,  l = 5',
  goal: L('yon sirt yuzasini topish', 'найти боковую поверхность', 'find the side area'),
  rule: L(
    "Yoyilmaning yoyi asos aylanasiga teng. Shundan ulushni topamiz.",
    'Дуга развёртки равна окружности основания. Отсюда найдём долю.',
    'The arc of the net equals the base circumference. That gives the share.',
  ),
  pick: L('Nimadan boshlaymiz?', 'С чего начнём?', 'Where shall we start?'),
  claims: [
    { id: 'a', key: 'inA', name: L("to'liq doira", 'полный круг', 'full circle'), value: '25π' },
    { id: 'b', key: 'inB', name: L('sektor', 'сектор', 'sector'), value: '15π' },
  ],
  points: [
    {
      id: 'q1', label: L('yoy', 'дуга', 'the arc'), num: '6π', step: 'calc', verdict: 'in',
      role: L('asos aylanasi', 'окружность основания', 'the base circumference'),
      calc: '2π · 3 = 6π',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q2', label: L('ulush', 'доля', 'the share'), num: '0,6', step: 'calc', verdict: 'in',
      role: L('yoy bo\'lingan aylana', 'дуга делить на окружность', 'arc over circumference'),
      calc: '6π / 10π = 3/5',
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: L('yuza', 'площадь', 'the area'), num: '15π', step: 'calc', verdict: 'in',
      role: L("to'liq doiraning 0,6 qismi", '0,6 от полного круга', '0,6 of the full circle'),
      calc: '25π · 3/5 = 15π',
      sol: true, inA: false, inB: true,
    },
  ],
  probe: {
    question: L("Nega to'liq doira emas?", 'Почему не полный круг?', 'Why not a full circle?'),
    items: [
      {
        id: 'b', label: L('yoyi asos aylanasidan uzun bo\'lolmaydi', 'дуга не длиннее окружности основания', 'the arc cannot exceed the base circumference'), correct: true,
        ok: L(
          "To'g'ri. Yoy olti pi, to'liq aylana esa o'n pi bo'lardi. Sektor uchdan besh qismni egallaydi, va yuzasi ham shuncha.",
          'Верно. Дуга шесть пи, а полная окружность была бы десять пи. Сектор занимает три пятых, и площадь такая же.',
          'Correct. The arc is six pi, while the full circle would be ten pi. The sector takes three fifths, and so does the area.',
        ),
      },
      {
        id: 'a', label: L("yasovchi juda qisqa", 'образующая слишком короткая', 'the generator is too short'),
        hint: L("Yasovchi normal: u radiusdan uzun. Masala uzunlikda emas, ULUSHda.", 'Образующая нормальная: она длиннее радиуса. Дело не в длине, а в ДОЛЕ.', 'The generator is fine: it is longer than the radius. The issue is the SHARE, not the length.'),
      },
      {
        id: 'c', label: L("qirqilgani uchun", 'потому что разрезали', 'because we cut it'),
        hint: L("Qirqish yuzani o'zgartirmaydi: qog'oz o'sha. Masala shaklda.", 'Разрез площадь не меняет: бумага та же. Дело в форме.', 'Cutting does not change the area: the paper is the same. The shape is the point.'),
      },
      {
        id: 'd', label: L("doira bo'lishi ham mumkin", 'может быть и кругом', 'it can be a circle'),
        hint: L("Faqat r yasovchiga teng bo'lganda, ya'ni konus yassi bo'lganda.", 'Только если r равен образующей, то есть конус плоский.', 'Only if r equals the generator, that is a flat cone.'),
      },
    ],
  },
  holds: [2500, 4100, 1500, 2500, 9500, 4000],
  audio: [
    A('mount', 'Tayanch tiklandi. Endi yoyilmani sanaymiz.', 'Опора восстановлена. Теперь посчитаем развёртку.', 'The basics are back. Now let us compute the net.'),
    A('mount', "Yoyilmaning yoyi asosning aylanasidan kelib chiqadi: qog'oz cho'zilmaydi.", 'Дуга развёртки берётся из окружности основания: бумага не растягивается.', 'The arc of the net comes from the base circumference: paper does not stretch.'),
    A('mount', "Nimadan boshlashni tanlang.", 'Выбери, с чего начать.', 'Choose where to start.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana butun yo'l. Yoy olti pi, chunki asos aylanasi shuncha. Radiusi besh bo'lgan to'liq doiraning aylanasi esa o'n pi. Demak sektor uchdan besh, ya'ni nol butun olti ulushni egallaydi. Yuzasi ham shuncha: yigirma besh pi karra uchdan besh, o'n besh pi. E'tibor bering: ulush radius bo'lingan yasovchiga teng chiqdi, va shundan pi karra r karra l formulasi tug'iladi.", 'Вот весь путь. Дуга шесть пи, потому что такова окружность основания. А полная окружность круга радиуса пять это десять пи. Значит сектор занимает три пятых, то есть ноль целых шесть. И площадь такая же: двадцать пять пи на три пятых, пятнадцать пи. Обрати внимание: доля оказалась равна радиусу делить на образующую, и отсюда рождается формула пи эр эль.', 'Here is the whole path. The arc is six pi, because that is the base circumference. And the full circumference of a radius five circle is ten pi. So the sector takes three fifths, that is zero point six. The area takes the same: twenty five pi times three fifths is fifteen pi. Note: the share came out as the radius over the generator, and that is where the formula pi r l is born.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: YOYILMA.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'sector_not_circle',
  eyebrow: L('Yoyamiz', 'Разворачиваем', 'Unrolling'),
  title: L('Yon sirt tekislikka yotadi', 'Боковая ложится на плоскость', 'The side surface lies flat'),
  chip: 'r = 3,  l = 5',
  solid: {
    mode: 'net',
    solid: 'cone',
    R: 3,
    hh: 4,
    height: 152,
    caption: L('sektorning yoyi asos aylanasiga teng', 'дуга сектора равна окружности основания', 'the sector arc equals the base circumference'),
  },
  spinSteps: 3,
  bonus: L(
    "Sektor to'liq doira emas: uning yoyi olti pi, to'liq aylana esa o'n pi bo'lardi. Yetishmayotgan qism ko'rinib turibdi, va aynan shuning uchun yuza yigirma besh pi emas, o'n besh pi.",
    'Сектор не полный круг: его дуга шесть пи, а полная окружность была бы десять пи. Недостающая часть видна, и именно поэтому площадь не двадцать пять пи, а пятнадцать.',
    'The sector is not a full circle: its arc is six pi, a full circle would be ten pi. The missing part is visible, and that is why the area is fifteen pi, not twenty five.',
  ),
  probe: {
    question: L("Sektorning radiusi nimaga teng?", 'Чему равен радиус сектора?', 'What is the radius of the sector?'),
    items: [
      { id: 'a', label: L('yasovchiga', 'образующей', 'the generator'), correct: true },
      { id: 'b', label: L('asos radiusiga', 'радиусу основания', 'the base radius'), hint: L("Asos radiusi yoyni beradi, radiusni emas. Yoyilmada uchdan chetgacha bo'lgan masofa yasovchi.", 'Радиус основания даёт дугу, а не радиус. В развёртке расстояние от вершины до края это образующая.', 'The base radius gives the arc, not the radius. In the net the distance from apex to edge is the generator.') },
      { id: 'c', label: L('balandlikka', 'высоте', 'the height'), hint: L("Balandlik jismning ichida yotadi, sirtda emas: uni yoyib bo'lmaydi.", 'Высота лежит внутри тела, а не на поверхности: её не развернёшь.', 'The height lies inside the solid, not on the surface: it cannot be unrolled.') },
      { id: 'd', label: L('diametrga', 'диаметру', 'the diameter'), hint: L("Diametr asosda yotadi.", 'Диаметр лежит в основании.', 'The diameter lies in the base.') },
    ],
  },
  holds: [2900, 3700, 1700, 6500],
  audio: [
    A('mount', "Sonlar sanaldi. Endi yoyilmani ko'ramiz.", 'Числа посчитаны. Теперь увидим развёртку.', 'The numbers are computed. Now let us see the net.'),
    A('one', "Konusni yasovchi bo'ylab qirqamiz va yoya boshlaymiz.", 'Разрезаем конус по образующей и начинаем разворачивать.', 'We cut the cone along a generator and start unrolling.'),
    A('two', "Yarmi yoyildi.", 'Половина развернулась.', 'Half is unrolled.'),
    A('three', "Yoyilma tayyor. Bu sektor, va uning radiusi yasovchiga teng, yoyi esa asos aylanasiga. To'liq doiragacha yetmagan qism yaqqol ko'rinib turibdi. Shuning uchun yuza yigirma besh pi emas.", 'Развёртка готова. Это сектор, его радиус равен образующей, а дуга окружности основания. Недостающая до полного круга часть видна отчётливо. Поэтому площадь и не двадцать пять пи.', 'The net is ready. It is a sector: its radius is the generator, its arc the base circumference. The part missing from a full circle is plain to see. That is why the area is not twenty five pi.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'sector_not_circle',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Formula yoyilmadan chiqdi', 'Формула вышла из развёртки', 'The formula came from the net'),
  rows: ['πl² · (r / l) = πrl', 'π · 25 · 3/5 = 15π'],
  probe: {
    question: L(
      "r = 4, l = 9. Yon sirt?",
      'r = 4, l = 9. Боковая поверхность?',
      'r = 4, l = 9. The side area?',
    ),
    items: [
      { id: 'a', label: '36π', correct: true },
      { id: 'b', label: '81π', hint: L("Bu to'liq doira. Sektor undan to'rt to'qqizdan qismni oladi.", 'Это полный круг. Сектор берёт от него четыре девятых.', 'That is the full circle. The sector takes four ninths of it.') },
      { id: 'c', label: '16π', hint: L("Bu asosning yuzasi.", 'Это площадь основания.', 'That is the base area.') },
      { id: 'd', label: '13π', hint: L("Bu yig'indi. Yuzada ko'paytiriladi.", 'Это сумма. В площади умножают.', 'That is the sum. Areas multiply.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Konus sirti', 'Правило 1. Поверхность конуса', 'Rule 1. Cone surface'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('S yon = πrl', 'S бок = πrl', 'S side = πrl'),
    lines: [
      L('yon sirt yoyilganda sektor chiqadi', 'боковая разворачивается в сектор', 'the side unrolls into a sector'),
      L("sektorning radiusi -- yasovchi, yoyi -- asos aylanasi", 'радиус сектора образующая, дуга окружность основания', 'the sector radius is the generator, its arc the base circumference'),
      L('sektor to\'liq doiraning r / l ulushini oladi', 'сектор берёт долю r / l полного круга', 'the sector takes the share r / l of the full circle'),
      L("shundan πl² · (r / l), ya'ni πrl", 'отсюда πl² · (r / l), то есть πrl', 'hence πl² · (r / l), that is πrl'),
    ],
    example: L('misol:  π · 4 · 9 = 36π', 'пример:  π · 4 · 9 = 36π', 'example:  π · 4 · 9 = 36π'),
  },
  holds: [4000, 6500, 4500],
  audio: [
    A('mount', "Yoyilma ko'rildi. Endi formulani yozamiz.", 'Развёртку увидели. Теперь запишем формулу.', 'We saw the net. Now let us write the formula.'),
    A('def', "Formulani yodlash shart emas, uni yoyilmadan chiqarish mumkin. Sektor to'liq doiraning shuncha ulushini oladi, yoyi aylanadan qancha ulush olsa. Yoy ikki pi r, aylana ikki pi l, ulush esa r bo'lingan l. Demak yuza pi l kvadrat karra r bo'lingan l, va l qisqaradi: pi r l qoladi.", 'Формулу не нужно запоминать, её можно вывести из развёртки. Сектор берёт от полного круга ту же долю, какую его дуга берёт от окружности. Дуга два пи эр, окружность два пи эль, доля эр делить на эль. Значит площадь пи эль квадрат на эр делить на эль, и эль сокращается: остаётся пи эр эль.', 'The formula need not be memorised, it follows from the net. The sector takes the same share of the full circle as its arc takes of the circumference. The arc is two pi r, the circumference two pi l, the share r over l. So the area is pi l squared times r over l, and l cancels: pi r l remains.'),
    A('rule', "To'g'ri. Va tekshiruv: yon sirtda RADIUS va YASOVCHI turadi, balandlik emas.", 'Верно. И проверка: в боковой стоят РАДИУС и ОБРАЗУЮЩАЯ, а не высота.', 'Correct. And a check: the side area holds the RADIUS and the GENERATOR, not the height.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: to'liq sirt.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'lateral_vs_total',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Yon emas, to\'liq', 'Не боковая, а полная', 'Not the side, the total'),
  was: { label: UI.was, expr: L('yon sirt: 15π', 'боковая: 15π', 'side: 15π') },
  now: { label: UI.now, expr: L("to'liq sirt: ?", 'полная: ?', 'total: ?') },
  probe1: {
    question: L('Yana nima qo\'shiladi?', 'Что ещё добавляется?', 'What else is added?'),
    items: [
      { id: 'a', label: L('asos doirasi', 'круг основания', 'the base circle'), correct: true },
      { id: 'b', label: L('ikkita asos', 'два основания', 'two bases'), hint: L("Ikkita asos silindrda. Konusning asosi bitta, ikkinchi uchida uch turadi.", 'Два основания у цилиндра. У конуса основание одно, на другом конце вершина.', 'Two bases belong to the cylinder. A cone has one base; the other end is the apex.') },
      { id: 'c', label: L('yana bitta sektor', 'ещё один сектор', 'another sector'), hint: L("Sektor bitta: u butun yon sirt.", 'Сектор один: это вся боковая поверхность.', 'There is one sector: it is the whole side surface.') },
      { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L("Asos ham sirtning bir qismi: konus ochiq emas.", 'Основание тоже часть поверхности: конус не открыт.', 'The base is part of the surface too: the cone is not open.') },
    ],
  },
  probe2: {
    cols: 4,
    question: L("To'liq sirt qancha?", 'Чему равна полная поверхность?', 'What is the total surface?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '24π' },
      { id: 'b', label: '15π' },
      { id: 'c', label: '30π' },
      { id: 'd', label: '18π' },
    ],
  },
  holds: [2500, 5500, 2100, 3000],
  audio: [
    A('mount', "Yon sirtni topdik: o'n besh pi.", 'Боковую нашли: пятнадцать пи.', 'We found the side area: fifteen pi.'),
    A('now', "Lekin masalada ko'pincha TO'LIQ sirt so'raladi. Ikkalasini almashtirib yuborish blokdagi eng ko'p uchraydigan xato, va u shu yerda tug'iladi.", 'Но в задачах чаще спрашивают ПОЛНУЮ поверхность. Перепутать их самая частая ошибка блока, и рождается она здесь.', 'But problems more often ask for the TOTAL surface. Confusing the two is the commonest error of the block, and it is born here.'),
    A('q1', "Yana nima qo'shiladi?", 'Что ещё добавляется?', 'What else is added?'),
    A('q2', "Sizningcha to'liq sirt qancha? Shunchaki taxmin qiling.", 'Как думаешь, чему равна полная поверхность? Просто предположи.', 'What do you think the total surface is? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'lateral_vs_total',
  eyebrow: L('Ikkalasini sanaymiz', 'Посчитаем оба', 'Let us compute both'),
  title: L('Silindr va konus', 'Цилиндр и конус', 'Cylinder and cone'),
  expr: L("to'liq sirt", 'полная поверхность', 'the total surface'),
  need: '= ?',
  answerLabel: L('konus', 'конус', 'the cone'),
  cards: [
    {
      tag: L('silindr', 'цилиндр', 'cylinder'),
      txt: '2πrl + 2πr²',
      point: {
        label: L('asos ikkita', 'оснований два', 'two bases'),
        calc: '12π + 8π = 20π',
        verdict: 'in',
      },
    },
    {
      tag: L('konus', 'конус', 'cone'),
      txt: 'πrl + πr²',
      point: {
        label: L('asos bitta', 'основание одно', 'one base'),
        calc: '15π + 9π = 24π',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['24π', '15π', '30π', '18π'],
    value: ['24π'],
    label: L("to'liq =", 'полная =', 'total ='),
    prompt: L("Konusning to'liq sirtini yozing", 'Запиши полную поверхность конуса', 'Write the total surface of the cone'),
    wrongs: [
      { key: '15π', hint: L("Bu faqat yon sirt: asos qo'shilmagan.", 'Это только боковая: основание не добавлено.', 'That is the side only: the base is missing.') },
      { key: '30π', hint: L("Ikkita asos qo'shilgan ko'rinadi. Konusda asos bitta.", 'Похоже, добавлено два основания. У конуса основание одно.', 'Two bases seem to have been added. A cone has one.') },
      { key: '*', hint: L("O'n besh pi plyus to'qqiz pi.", 'Пятнадцать пи плюс девять пи.', 'Fifteen pi plus nine pi.') },
    ],
  },
  holds: [3500, 5500, 4900, 4000],
  audio: [
    A('mount', 'Taxmin bor. Endi ikkala jismni ham sanaymiz.', 'Прогноз есть. Теперь посчитаем оба тела.', 'The guess is made. Now let us compute both solids.'),
    A('p1', "Silindrda ikkita asos bor, chunki uning ikkala uchi ham doira. Yon o'n ikki pi, asoslar sakkiz pi, jami yigirma pi.", 'У цилиндра два основания, потому что оба его конца это круги. Боковая двенадцать пи, основания восемь пи, всего двадцать пи.', 'A cylinder has two bases, because both its ends are circles. The side is twelve pi, the bases eight pi, twenty pi in all.'),
    A('p2', "Konusda esa asos bitta: ikkinchi uchida uch turadi, va u nuqta, yuzasi yo'q. Yon o'n besh pi, asos to'qqiz pi, jami yigirma to'rt pi.", 'А у конуса основание одно: на другом конце вершина, и это точка, у неё нет площади. Боковая пятнадцать пи, основание девять пи, всего двадцать четыре пи.', 'A cone has one base: at the other end is the apex, a point with no area. The side is fifteen pi, the base nine pi, twenty four pi in all.'),
    A('write', "Javobni yozing.", 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'lateral_vs_total',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Nechta asos qo\'shiladi', 'Сколько оснований добавить', 'How many bases to add'),
  cases: [
    {
      label: L('silindr', 'цилиндр', 'cylinder'),
      text: L('ikkita asos', 'два основания', 'two bases'),
      tone: 'graph',
    },
    {
      label: L('konus', 'конус', 'cone'),
      text: L('bitta asos', 'одно основание', 'one base'),
      tone: 'accent',
    },
  ],
  rows: [
    L('silindr: 12π + 8π = 20π', 'цилиндр: 12π + 8π = 20π', 'cylinder: 12π + 8π = 20π'),
    L('konus: 15π + 9π = 24π', 'конус: 15π + 9π = 24π', 'cone: 15π + 9π = 24π'),
  ],
  probe: {
    question: L(
      "Sfera uchun nechta asos qo'shiladi?",
      'Сколько оснований добавить для сферы?',
      'How many bases for a sphere?',
    ),
    items: [
      { id: 'a', label: L('birorta ham', 'ни одного', 'none'), correct: true },
      { id: 'b', label: L('bitta', 'одно', 'one'), hint: L("Sferada tekis qism yo'q: uni tekislikka yoyib ham bo'lmaydi.", 'У сферы нет плоской части: её и развернуть на плоскость нельзя.', 'A sphere has no flat part: it cannot even be unrolled.') },
      { id: 'c', label: L('ikkita', 'два', 'two'), hint: L("Ikkita asos silindrda.", 'Два основания у цилиндра.', 'Two bases belong to the cylinder.') },
      { id: 'd', label: L("radiusga bog'liq", 'зависит от радиуса', 'depends on the radius'), hint: L("Bog'liq emas: sferada asos umuman yo'q.", 'Не зависит: у сферы оснований нет вовсе.', 'It does not: a sphere has no bases at all.') },
    ],
  },
  rule: {
    badge: L("2-qoida. To'liq sirt", 'Правило 2. Полная поверхность', 'Rule 2. Total surface'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L("to'liq = yon + asoslar", 'полная = боковая + основания', 'total = side + bases'),
    lines: [
      L("silindrda ikkita asos: +2πr²", 'у цилиндра два основания: +2πr²', 'a cylinder has two bases: +2πr²'),
      L('konusda bitta: +πr²', 'у конуса одно: +πr²', 'a cone has one: +πr²'),
      L("sferada asos yo'q: 4πR² -- bu allaqachon to'liq sirt", 'у сферы оснований нет: 4πR² это уже вся поверхность', 'a sphere has none: 4πR² is already the whole surface'),
      L("masalada qaysi biri so'ralganini belgilang", 'отметь в задаче, какую из них спрашивают', 'mark which of the two the problem asks for'),
    ],
    example: L('misol:  15π + 9π = 24π', 'пример:  15π + 9π = 24π', 'example:  15π + 9π = 24π'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('sirt -- bu yoyilma', 'поверхность это развёртка', 'a surface is a net'),
    lines: [
      L('1. yon sirtni yoying: to\'rtburchak yoki sektor', '1. разверни боковую: прямоугольник или сектор', '1. unroll the side: a rectangle or a sector'),
      L('2. yuzasini planimetriya bilan sanang', '2. посчитай площадь планиметрией', '2. compute the area by planimetry'),
      L("3. so'ralgan bo'lsa, asoslarni qo'shing", '3. если спрашивают, добавь основания', '3. if asked, add the bases'),
      L('4. silindrda ikkita, konusda bitta, sferada yo\'q', '4. у цилиндра два, у конуса одно, у сферы нет', '4. two for a cylinder, one for a cone, none for a sphere'),
    ],
  },
  holds: [2900, 5500, 4500, 5000],
  audio: [
    A('mount', 'Ikkala jism ham sanaldi. Endi qoidani yozamiz.', 'Оба тела посчитаны. Теперь запишем правило.', 'Both solids are computed. Now let us write the rule.'),
    A('rows', "Farq faqat asoslar sonida. Silindrning ikkala uchi ham doira, demak ikkita asos. Konusning bitta uchi doira, ikkinchisi nuqta, demak bitta asos. Sferada esa tekis qism umuman yo'q.", 'Разница только в числе оснований. У цилиндра оба конца круги, значит два основания. У конуса один конец круг, другой точка, значит одно. А у сферы плоской части нет вовсе.', 'The difference is only the number of bases. Both ends of a cylinder are circles, so two bases. A cone has one circular end and one point, so one base. A sphere has no flat part at all.'),
    A('q', "Savol: sfera uchun nechta asos qo'shiladi?", 'Вопрос: сколько оснований добавить для сферы?', 'The question: how many bases for a sphere?'),
    A('rule', "To'g'ri. Va amaliy maslahat: masalani o'qiyotganda YON yoki TO'LIQ so'zining tagiga chizib qo'ying. Bu bitta harakat butun blokdagi xatolarning yarmini olib tashlaydi.", 'Верно. И практический совет: читая задачу, подчеркни слово БОКОВАЯ или ПОЛНАЯ. Одно это действие убирает половину ошибок блока.', 'Correct. And a practical tip: when reading a problem, underline the word SIDE or TOTAL. That one move removes half the errors of this block.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. AMALNI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'sector_not_circle',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Uzunlikni qo\'ying', 'Поставь длину', 'Place the length'),
  left: L('konusning yon sirti: r = 3, h = 4, l = 5', 'боковая конуса: r = 3, h = 4, l = 5', 'the cone side: r = 3, h = 4, l = 5'),
  template: ['S = π · 3 · ', { slot: 0 }],
  signs: ['5', '4'],
  answer: '5',
  checkNote: L(
    "Yoyilmaning radiusi -- YASOVCHI, balandlik emas",
    'Радиус развёртки это ОБРАЗУЮЩАЯ, а не высота',
    'The net radius is the GENERATOR, not the height',
  ),
  wrongs: [
    { key: '4', hint: L("Balandlik jismning ichida yotadi, sirtda emas. Uni yoyib bo'lmaydi.", 'Высота лежит внутри тела, а не на поверхности. Её не развернёшь.', 'The height lies inside the solid, not on the surface. It cannot be unrolled.') },
  ],
  probe: {
    question: L("Nega balandlik emas?", 'Почему не высота?', 'Why not the height?'),
    items: [
      { id: 'a', label: L('u sirtda yotmaydi', 'она не лежит на поверхности', 'it does not lie on the surface'), correct: true },
      { id: 'b', label: L('u qisqaroq', 'она короче', 'it is shorter'), hint: L("Uzunligi sabab emas: masala qayerda yotishida.", 'Дело не в длине, а в том, где она лежит.', 'The length is not the reason: what matters is where it lies.') },
      { id: 'c', label: L("shunday kelishilgan", 'так договорились', 'a convention'), hint: L("Kelishuv emas: yoyilmada uchdan chetgacha bo'lgan masofa yasovchi.", 'Не договорённость: в развёртке расстояние от вершины до края это образующая.', 'Not a convention: in the net the apex to edge distance is the generator.') },
      { id: 'd', label: L('balandlik umuman kerak emas', 'высота вообще не нужна', 'the height is never needed'), hint: L("Kerak: hajmda va kesim yuzasida u ishlatiladi.", 'Нужна: она участвует в объёме и в площади сечения.', 'It is: it appears in the volume and the section area.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Uzunlikni qo'ying.", 'Поставь длину.', 'Place the length.'),
    A('checked', "Bo'ldi. Endi ta'riflang: nega balandlik emas?", 'Получилось. Теперь сформулируй: почему не высота?', 'Done. Now put it into words: why not the height?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'gen', label: L('yasovchini topish', 'найти образующую', 'find the generator') },
  { id: 'side', label: L('yon sirtni sanash', 'посчитать боковую', 'compute the side') },
  { id: 'base', label: L('asosni sanash', 'посчитать основание', 'compute the base') },
  { id: 'add', label: L("qo'shish", 'сложить', 'add') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'lateral_vs_total',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L("r = 3, h = 4. To'liq sirt?", 'r = 3, h = 4. Полная поверхность?', 'r = 3, h = 4. The total surface?'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'gen',
      to: 'l = 5',
      wrongs: [
        { action: 'side', hint: L("Yon sirt uchun yasovchi kerak, u esa hali yo'q.", 'Для боковой нужна образующая, а её ещё нет.', 'The side needs the generator, and it is not there yet.') },
        { action: 'base', hint: L("Asosni sanash mumkin, lekin avval yetishmayotgan uzunlikni toping.", 'Основание посчитать можно, но сначала найди недостающую длину.', 'The base can be computed, but find the missing length first.') },
        { action: 'add', hint: L("Qo'shadigan narsa hali yo'q.", 'Складывать пока нечего.', 'There is nothing to add yet.') },
      ],
    },
    {
      action: 'side',
      to: 'π · 3 · 5 = 15π',
      wrongs: [
        { action: 'gen', hint: L("Topilgan: besh.", 'Найдено: пять.', 'Found: five.') },
        { action: 'base', hint: L("Asos ham kerak, lekin keyin.", 'Основание тоже нужно, но позже.', 'The base is needed too, but later.') },
        { action: 'add', hint: L("Avval qo'shiluvchilarni sanang.", 'Сначала посчитай слагаемые.', 'Compute the terms first.') },
      ],
    },
    {
      action: 'base',
      to: 'π · 9 = 9π',
      wrongs: [
        { action: 'gen', hint: L("Topilgan.", 'Найдено.', 'Found.') },
        { action: 'side', hint: L("Sanalgan: o'n besh pi.", 'Посчитано: пятнадцать пи.', 'Computed: fifteen pi.') },
        { action: 'add', hint: L("Ikkinchi qo'shiluvchi hali yo'q.", 'Второго слагаемого ещё нет.', 'The second term is missing.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['24π', '15π', '20π', '39π'],
    value: ['24π'],
    label: 'S =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '15π', hint: L("Bu faqat yon sirt. So'ralgani to'liq.", 'Это только боковая. Спрашивали полную.', 'That is the side only. The total was asked.') },
      { key: '20π', hint: L("Bu silindrniki, boshqa jism.", 'Это для цилиндра, другого тела.', 'That is the cylinder, a different solid.') },
      { key: '*', hint: L("O'n besh pi plyus to'qqiz pi.", 'Пятнадцать пи плюс девять пи.', 'Fifteen pi plus nine pi.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi to\'liq masalani o\'tamiz.', 'Правило сформулировано. Пройдём полную задачу.', 'The rule is stated. Let us work a full problem.'),
    A('start', "Diqqat: yasovchi shartda berilmagan, uni o'zingiz topasiz. Ro'yxatda ortiqcha amal yo'q, hammasi kerak.", 'Внимание: образующая в условии не дана, её найдёшь сам. Лишнего действия в списке нет, нужны все.', 'Careful: the generator is not given, you will find it. No superfluous action here, all are needed.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'lateral_vs_total',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Silindr sirti', 'Поверхность цилиндра', 'The cylinder surface'),
  start: L("r = 2, l = 5. To'liq sirt?", 'r = 2, l = 5. Полная поверхность?', 'r = 2, l = 5. The total surface?'),
  actions: ACTIONS_10,
  hint: L(
    "Silindrda asos IKKITA.",
    'У цилиндра ДВА основания.',
    'A cylinder has TWO bases.',
  ),
  steps: [
    {
      action: 'side',
      to: '2π · 2 · 5 = 20π',
      wrongs: [
        { action: 'gen', hint: L("Yasovchi berilgan: besh.", 'Образующая дана: пять.', 'The generator is given: five.') },
        { action: 'base', hint: L("Asosni ham sanaymiz, lekin keyin.", 'Основание тоже посчитаем, но позже.', 'The base too, but later.') },
        { action: 'add', hint: L("Avval qo'shiluvchilarni sanang.", 'Сначала посчитай слагаемые.', 'Compute the terms first.') },
      ],
    },
    {
      action: 'base',
      to: '2 · π · 4 = 8π',
      wrongs: [
        { action: 'side', hint: L("Sanalgan: yigirma pi.", 'Посчитано: двадцать пи.', 'Computed: twenty pi.') },
        { action: 'gen', hint: L("Yasovchi berilgan.", 'Образующая дана.', 'The generator is given.') },
        { action: 'add', hint: L("Ikkinchi qo'shiluvchi hali yo'q.", 'Второго слагаемого ещё нет.', 'The second term is missing.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['28π', '24π', '20π', '40π'],
    value: ['28π'],
    label: 'S =',
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '24π', hint: L("Bitta asos qo'shilgan. Silindrda ular ikkita.", 'Добавлено одно основание. У цилиндра их два.', 'One base was added. A cylinder has two.') },
      { key: '20π', hint: L("Bu faqat yon sirt.", 'Это только боковая.', 'That is the side only.') },
      { key: '*', hint: L("Yigirma pi plyus sakkiz pi.", 'Двадцать пи плюс восемь пи.', 'Twenty pi plus eight pi.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Bu safar silindr. Diqqat: asoslar soni konusnikidan farq qiladi.", 'На этот раз цилиндр. Внимание: число оснований отличается от конуса.', 'This time a cylinder. Careful: the number of bases differs from the cone.'),
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
      id: 'b1', tag: 'sector_not_circle', ask: true, cols: 4,
      done: '15π',
      prompt: L('r = 3, l = 5. Konus yon sirti?', 'r = 3, l = 5. Боковая конуса?', 'r = 3, l = 5. The cone side?'),
      items: [
        { id: 'a', label: '15π', correct: true },
        { id: 'b', label: '25π', hint: L("Bu to'liq doira. Yoyilma sektor.", 'Это полный круг. Развёртка это сектор.', 'That is the full circle. The net is a sector.') },
        { id: 'c', label: '9π', hint: L("Bu asos.", 'Это основание.', 'That is the base.') },
        { id: 'd', label: '30π', hint: L("Ikki barobar ko'p: pi karra r karra l.", 'Вдвое больше: пи на эр на эль.', 'Twice too much: pi times r times l.') },
      ],
    },
    {
      id: 'b2', tag: 'lateral_vs_total', ask: true, cols: 4,
      done: '24π',
      prompt: L("O'sha konusning to'liq sirti?", 'Полная поверхность того же конуса?', 'The total surface of that cone?'),
      items: [
        { id: 'a', label: '24π', correct: true },
        { id: 'b', label: '15π', hint: L("Asos qo'shilmagan.", 'Основание не добавлено.', 'The base is missing.') },
        { id: 'c', label: '33π', hint: L("Ikkita asos qo'shilgan. Konusda bitta.", 'Добавлено два основания. У конуса одно.', 'Two bases were added. A cone has one.') },
        { id: 'd', label: '9π', hint: L("Bu faqat asos.", 'Это только основание.', 'That is the base only.') },
      ],
    },
    {
      id: 'b3', tag: 'sector_not_circle', ask: true, cols: 2,
      done: L('yasovchi', 'образующая', 'the generator'),
      prompt: L('Yoyilma sektorining radiusi?', 'Радиус сектора развёртки?', 'The radius of the net sector?'),
      items: [
        { id: 'a', label: L('yasovchi', 'образующая', 'the generator'), correct: true },
        { id: 'b', label: L('asos radiusi', 'радиус основания', 'the base radius'), hint: L("Asos radiusi yoyni beradi.", 'Радиус основания даёт дугу.', 'The base radius gives the arc.') },
        { id: 'c', label: L('balandlik', 'высота', 'the height'), hint: L("Balandlik sirtda yotmaydi.", 'Высота не лежит на поверхности.', 'The height does not lie on the surface.') },
        { id: 'd', label: L('diametr', 'диаметр', 'the diameter'), hint: L("Diametr asosda.", 'Диаметр в основании.', 'The diameter is in the base.') },
      ],
    },
    {
      id: 'b4', tag: 'lateral_vs_total', ask: true, cols: 4,
      done: '2',
      prompt: L('Silindrda nechta asos?', 'Сколько оснований у цилиндра?', 'How many bases has a cylinder?'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '1', hint: L("Bitta asos konusda.", 'Одно основание у конуса.', 'One base belongs to the cone.') },
        { id: 'c', label: '0', hint: L("Nolta sferada.", 'Ни одного у сферы.', 'None belongs to the sphere.') },
        { id: 'd', label: '4', hint: L("To'rtta yoq prizmada bo'lishi mumkin, silindrda emas.", 'Четыре грани может быть у призмы, не у цилиндра.', 'Four faces can belong to a prism, not a cylinder.') },
      ],
    },
    {
      id: 'b5', tag: 'sector_not_circle', ask: true, cols: 4,
      done: '0,6',
      prompt: L('r = 3, l = 5. Sektor ulushi?', 'r = 3, l = 5. Доля сектора?', 'r = 3, l = 5. The sector share?'),
      items: [
        { id: 'a', label: '0,6', correct: true },
        { id: 'b', label: '1,67', hint: L("Teskari bo'lingan: ulush birdan kichik.", 'Поделено наоборот: доля меньше единицы.', 'Divided the wrong way: a share is below one.') },
        { id: 'c', label: '0,75', hint: L("Ulush radius bo'lingan yasovchi: uch bo'lingan besh.", 'Доля это радиус делить на образующую: три на пять.', 'The share is radius over generator: three over five.') },
        { id: 'd', label: '2', hint: L("Ulush birdan katta bo'lolmaydi.", 'Доля не может быть больше единицы.', 'A share cannot exceed one.') },
      ],
    },
    {
      id: 'b6', tag: 'lateral_vs_total', ask: true, cols: 2,
      done: L('sfera', 'сфера', 'the sphere'),
      prompt: L(
        "Qaysi jismda asos qo'shilmaydi?",
        'У какого тела основания не добавляют?',
        'For which solid are no bases added?',
      ),
      items: [
        { id: 'a', label: L('sfera', 'сфера', 'the sphere'), correct: true },
        { id: 'b', label: L('konus', 'конус', 'the cone'), hint: L("Konusda bitta asos qo'shiladi.", 'У конуса добавляют одно основание.', 'A cone adds one base.') },
        { id: 'c', label: L('silindr', 'цилиндр', 'the cylinder'), hint: L("Silindrda ikkita.", 'У цилиндра два.', 'A cylinder adds two.') },
        { id: 'd', label: L('hammasida', 'у всех', 'all of them'), hint: L("Sferada tekis qism yo'q.", 'У сферы нет плоской части.', 'A sphere has no flat part.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "Endi to'liq sirt.", 'Теперь полная поверхность.', 'Now the total surface.'),
    A('q3', "Yoyilma haqida.", 'Про развёртку.', 'About the net.'),
    A('q4', "Asoslar soni.", 'Число оснований.', 'The number of bases.'),
    A('q5', "Ulush.", 'Доля.', 'The share.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'sector_not_circle',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Yoyilma to\'liq doira deb olingan', 'Развёртку сочли полным кругом', 'The net was taken for a full circle'),
  rows: [
    { id: 'r1', text: 'r = 6,  l = 10' },
    { id: 'r2', text: L('yoyilma: radiusi 10 bo\'lgan doira', 'развёртка: круг радиуса 10', 'net: a circle of radius 10') },
    { id: 'r3', text: L('yon sirt: π · 100 = 100π', 'боковая: π · 100 = 100π', 'side: π · 100 = 100π') },
    { id: 'r4', text: L('javob: 100π', 'ответ: 100π', 'answer: 100π') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r3: L("Bu satr oldingisidan to'g'ri chiqadi: doira bo'lsa, yuzasi yuz pi.", 'Эта строка верно следует из предыдущей: если круг, площадь сто пи.', 'This line follows correctly: if it is a circle, the area is a hundred pi.'),
    r4: L("Javob xato, lekin u ikkinchi satrda xato bo'lgan.", 'Ответ неверный, но неверным он стал во второй строке.', 'The answer is wrong, but it went wrong in the second line.'),
  },
  proofPoint: L('yoyilma -- sektor', 'развёртка это сектор', 'the net is a sector'),
  proof: L(
    "Yoyilma to'liq doira bo'lishi uchun uning yoyi yigirma pi bo'lishi kerak edi. Aslida yoy asos aylanasiga teng, ya'ni o'n ikki pi. Ulush o'n ikki bo'lingan yigirma, ya'ni nol butun olti. Demak yuza yuz pi karra nol butun olti, oltmish pi. Formula ham shuni beradi: pi karra olti karra o'n.",
    'Чтобы развёртка была полным кругом, её дуга должна была бы равняться двадцати пи. На деле дуга равна окружности основания, то есть двенадцати пи. Доля двенадцать делить на двадцать, то есть ноль целых шесть. Значит площадь сто пи на ноль целых шесть, шестьдесят пи. Формула даёт то же: пи на шесть на десять.',
    'For the net to be a full circle its arc would have to be twenty pi. In fact the arc equals the base circumference, twelve pi. The share is twelve over twenty, that is zero point six. So the area is a hundred pi times zero point six, sixty pi. The formula gives the same: pi times six times ten.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('sektor doira deb olingan', 'сектор принят за круг', 'a sector was taken for a circle'), correct: true },
      { id: 'b', label: L("yasovchi noto'g'ri", 'образующая неверна', 'the generator is wrong'), hint: L("Yasovchi shartdan: o'n.", 'Образующая из условия: десять.', 'The generator is from the problem: ten.') },
      { id: 'c', label: L("asos qo'shilmagan", 'не добавлено основание', 'the base is missing'), hint: L("So'ralgani YON sirt, asos kerak emas.", 'Спрашивают БОКОВУЮ, основание не нужно.', 'The SIDE was asked, no base needed.') },
      { id: 'd', label: L("arifmetikada xato", 'ошибка в арифметике', 'an arithmetic slip'), hint: L("Arifmetika to'g'ri: pi karra yuz. Xato shaklda.", 'Арифметика верна: пи на сто. Ошибка в форме.', 'The arithmetic is right: pi times a hundred. The shape is the error.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Xato birinchi marta paydo bo'lgan satrni toping.", 'Найди строку, в которой ошибка появилась впервые.', 'Find the line where the error first appeared.'),
    A('proof', "Qarang: yoyilma to'liq doira bo'lsa, uning yoyi yigirma pi bo'lardi. Aslida yoy asos aylanasiga teng, o'n ikki pi. Ulush nol butun olti, yuza esa oltmish pi. Xato javob deyarli ikki barobar katta.", 'Смотри: будь развёртка полным кругом, её дуга равнялась бы двадцати пи. На деле дуга равна окружности основания, двенадцать пи. Доля ноль целых шесть, площадь шестьдесят пи. Неверный ответ почти вдвое больше.', 'Look: were the net a full circle, its arc would be twenty pi. In fact the arc equals the base circumference, twelve pi. The share is zero point six, the area sixty pi. The wrong answer is nearly twice too large.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'lateral_vs_total',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Yozuvni yig\'ing', 'Собери запись', 'Build the record'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('nechta asos', 'сколько оснований', 'how many bases'),
  tasks: [
    {
      prompt: L("konus, r = 2, l = 6. To'liq", 'конус, r = 2, l = 6. Полная', 'cone, r = 2, l = 6. Total'),
      template: ['S = ', { slot: 0 }, ' + ', { slot: 1 }],
      parts: ['12π', '4π', '24π', '8π'],
      answer: ['12π', '4π'],
      doneLabel: '12π + 4π = 16π',
      wrongs: [
        { key: '12π|8π', hint: L("Sakkiz pi bu ikkita asos. Konusda asos bitta.", 'Восемь пи это два основания. У конуса основание одно.', 'Eight pi is two bases. A cone has one.') },
        { key: '*', hint: L("Yon pi karra r karra l, asos pi karra r kvadrat.", 'Боковая пи эр эль, основание пи эр квадрат.', 'The side is pi r l, the base pi r squared.') },
      ],
    },
    {
      prompt: L("silindr, r = 2, l = 6. To'liq", 'цилиндр, r = 2, l = 6. Полная', 'cylinder, r = 2, l = 6. Total'),
      template: ['S = ', { slot: 0 }, ' + ', { slot: 1 }],
      parts: ['24π', '8π', '12π', '4π'],
      answer: ['24π', '8π'],
      doneLabel: '24π + 8π = 32π',
      wrongs: [
        { key: '24π|4π', hint: L("Bitta asos qo'shilgan. Silindrda ikkita.", 'Добавлено одно основание. У цилиндра два.', 'One base was added. A cylinder has two.') },
        { key: '*', hint: L("Yon ikki pi karra r karra l, asoslar ikki pi karra r kvadrat.", 'Боковая два пи эр эль, основания два пи эр квадрат.', 'The side is two pi r l, the bases two pi r squared.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari.', 'Ошибка найдена. Последнее задание обратное.', 'The error is found. The last task is the reverse one.'),
    A('built1', "Endi ikkinchisi. Sonlar bir xil, lekin jism boshqa.", 'А теперь второе. Числа те же, а тело другое.', 'And now the second. The same numbers, a different solid.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'sector_not_circle',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: L('S yon = πrl', 'S бок = πrl', 'S side = πrl'),
  ruleLines: [
    L("sirt yuzasi -- bu yoyilmaning yuzasi", 'площадь поверхности это площадь развёртки', 'a surface area is the area of the net'),
    L('konusniki sektor: ulushi r / l', 'у конуса это сектор с долей r / l', 'the cone gives a sector of share r / l'),
    L("to'liq sirtga asoslar qo'shiladi: 2, 1 yoki 0", 'к полной добавляют основания: 2, 1 или 0', 'the total adds bases: 2, 1 or 0'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('konus yon sirti', 'боковая конуса', 'the cone side'),
      right: '15π',
      map: { a: '25π', b: '15π', both: '9π', none: '30π' },
    },
    {
      screen: 5,
      expr: L("to'liq sirt", 'полная', 'the total'),
      right: '24π',
      map: { a: '24π', b: '15π', c: '30π', d: '18π' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '15π  <  25π',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Yoyilma ekraniga qayting', 'Вернись к экрану с развёрткой', 'Go back to the net screen'),
  },
  probe: {
    question: L(
      "Formulani unutsangiz, nima qilasiz?",
      'Что делать, если забыл формулу?',
      'What if you forget the formula?',
    ),
    items: [
      { id: 'a', label: L('yoyilmani chizib, ulushni sanayman', 'нарисую развёртку и посчитаю долю', 'draw the net and compute the share'), correct: true },
      { id: 'b', label: L('taxmin qilaman', 'угадаю', 'guess'), hint: L("Taxmin shart emas: yoyilma har doim tiklanadi.", 'Угадывать не нужно: развёртку всегда можно восстановить.', 'No need to guess: the net can always be rebuilt.') },
      { id: 'c', label: L("masalani tashlab ketaman", 'пропущу задачу', 'skip the problem'), hint: L("Erta: yoyilma sizda bor, u planimetriya.", 'Рано: развёртка у тебя есть, это планиметрия.', 'Too early: you have the net, and it is planimetry.') },
      { id: 'd', label: L("to'liq doira olaman", 'возьму полный круг', 'take the full circle'), hint: L("Aynan shu xato yuz pi bergan edi.", 'Именно эта ошибка и дала сто пи.', 'That very mistake gave a hundred pi.') },
    ],
  },
  sheetTitle: L('Sirtlar yuzasi · shpargalka', 'Площади поверхностей · шпаргалка', 'Surface areas · cheat sheet'),
  sheetSrc: L('11-sinf · 30-dars', '11 класс · урок 30', 'Grade 11 · lesson 30'),
  lifehack: L(
    "Masalani o'qiyotganda YON yoki TO'LIQ so'zining tagiga chizing: xatolarning yarmi shu yerda.",
    'Читая задачу, подчеркни слово БОКОВАЯ или ПОЛНАЯ: половина ошибок именно здесь.',
    'Reading a problem, underline SIDE or TOTAL: half the errors live there.',
  ),
  holds: [2500, 4900, 7500, 5000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. Yon sirt o'n besh pi, yigirma besh emas.", 'Вот твои прогнозы и вот как оказалось. Боковая пятнадцать пи, а не двадцать пять.', 'Here are your guesses and here is how it turned out. The side is fifteen pi, not twenty five.'),
    A('rule', "Va mana asosiy fikr. Sirt yuzasi yodlanadigan formula emas: bu yoyilmaning yuzasi, va uni sakkizinchi sinf planimetriyasi bilan sanash mumkin. Konusda yoyilma sektor bo'ladi, va uning ulushi radius bo'lingan yasovchiga teng. Shundan pi karra r karra l chiqadi. Formulani unutsangiz, yoyilmani chizing.", 'И вот главная мысль. Площадь поверхности это не формула для запоминания: это площадь развёртки, и её можно посчитать планиметрией восьмого класса. У конуса развёртка сектор, и его доля равна радиусу делить на образующую. Отсюда и выходит пи эр эль. Если забыл формулу, нарисуй развёртку.', 'And here is the main point. A surface area is not a formula to memorise: it is the area of the net, computable with grade eight planimetry. For a cone the net is a sector whose share is the radius over the generator. That is where pi r l comes from. Forget the formula, draw the net.'),
    A('q', "Oxirgi savol: formulani unutsangiz, nima qilasiz?", 'Последний вопрос: что делать, если забыл формулу?', 'The last question: what if you forget the formula?'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
