// ============================================================================
// 11-sinf, Dars 40. MASOFALAR.
//
// B5 blokining oltinchi darsi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md
//   asbob:    `SpaceFrame`, `drop` rejimi -- HALOL CHIZG'ICH
//   darslik:  1-qism, 115-bet (ikki nuqta orasidagi masofa, sfera
//             tenglamasi), 8-11 masalalar 119-bet, bob testi 6-savol.
//             Nuqtadan IXTIYORIY tekislikkacha masofa darslikda YO'Q --
//             u 38-darsning normali orqali chiqariladi.
//
// DARSNING BITTA GAPI: masofa faqat PERPENDIKULAR bo'ylab o'lchanadi, va
// nechta koordinata ishlatilishi nimaga o'lchayotganimizga bog'liq: bitta
// tekislikka, ikkita o'qqa, uchtasi nuqtaga.
//
// HALOL CHIZG'ICH shu darsda ishlaydi. Asbob qiya kesmani qiya deb
// belgilaydi va SON BERMAYDI. Qoida o'qilmaydi -- unga duch kelinadi.
//
// SONLAR TEKSHIRILDI (A = (3; 4; −3)):
//   Oxy gacha 3, Oxz gacha 4, Oyz gacha 3
//   Oz o'qigacha 5 (uchta emas, IKKITA koordinata)
//   koordinata boshigacha ildiz o'ttiz to'rt, taxminan 5,83  -- QIYA
//   boshdan x + 2y + 2z − 6 = 0 gacha: |−6| / 3 = 2
//   (1; 2; 3) dan 2x − y + 2z − 9 = 0 gacha: |2 − 2 + 6 − 9| / 3 = 1
//   perimetr (darslik 2-masala): 21 ildiz 2
//   blits: ildiz 26; sfera x² + y² + z² = 25
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_40',
  title: L('Masofalar', 'Расстояния', 'Distances'),
}

const BLOCK = { label: 'B5', from: 35, to: 41, current: 40 }

// ============================================================
// SLAYD 1. XUK. Ikki javob bitta masofaga.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Masofalar', 'Расстояния', 'Distances'),
  title: L('Qaysi biri masofa', 'Который из них расстояние', 'Which one is the distance'),
  expr: L("A (3; 4; −3) dan Oz o'qigacha", 'от A (3; 4; −3) до оси Oz', 'from A (3; 4; −3) to the Oz axis'),
  rows: [
    { id: 'a', name: L('Aziz', 'Азиз', 'Aziz'), value: '5' },
    { id: 'b', name: L('Dilnoza', 'Дилноза', 'Dilnoza'), value: '√34' },
  ],
  probe: {
    question: L('Qaysi javob masofa?', 'Какой ответ и есть расстояние?', 'Which answer is the distance?'),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi chizmaga qaraymiz.',
      'Твой ответ записан. Сейчас посмотрим на чертёж.',
      'Your answer is saved. Now we will look at the drawing.',
    ),
    items: [
      { id: 'a', label: '5' },
      { id: 'b', label: '√34' },
      { id: 'c', label: L('ikkalasi ham', 'оба', 'both') },
      { id: 'd', label: L("aniqlanmaydi", 'не определить', 'cannot tell') },
    ],
  },
  holds: [4500, 3200, 4500],
  audio: [
    A('mount', "Blokning oxiriga yaqinlashdik. Bugun masofalar: nuqtadan nuqtagacha, o'qqacha va tekislikkacha.", 'Мы подошли к концу блока. Сегодня расстояния: от точки до точки, до оси и до плоскости.', 'We are near the end of the block. Today distances: from point to point, to an axis and to a plane.'),
    A('r1', "Aziz beshni oldi.", 'Азиз называет пять.', 'Aziz says five.'),
    A('r2', "Dilnoza ildiz o'ttiz to'rtni oldi, ya'ni taxminan besh butun sakkiz. Ikkalasi ham bir xil nuqta bilan ishladi.", 'Дилноза называет корень из тридцати четырёх, то есть примерно пять целых восемь. Оба работают с одной точкой.', 'Dilnoza says the root of thirty four, about five point eight. Both work with the same point.'),
    A('ask', "Sizningcha qaysi biri masofa. Hozircha shunchaki taxmin qiling.", 'Как думаешь, который из них расстояние. Пока просто предположи.', 'Which one do you think is the distance. Just make a guess for now.'),
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
    "Uchtasi ham shu blokdan. Bu baholanmaydi.",
    'Все три из этого блока. Это не оценивается.',
    'All three from this block. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Vektor uzunligi', 'Длина вектора', 'A vector length'),
      short: L('36-darsdan', 'из урока 36', 'from lesson 36'),
      ex: [{ e: '|(3; 4; 0)| = 5', why: L('kvadratlar yig\'indisidan ildiz', 'корень из суммы квадратов', 'the root of the sum of squares') }],
    },
    {
      id: 'c2',
      title: L('Normal', 'Нормаль', 'The normal'),
      short: L('38-darsdan', 'из урока 38', 'from lesson 38'),
      ex: [{ e: L('koeffitsiyentlar', 'коэффициенты', 'the coefficients'), why: L('tenglamadan o\'qiladi', 'читается из уравнения', 'read off the equation') }],
    },
    {
      id: 'c3',
      title: L('Soya', 'Тень', 'A shadow'),
      short: L('35-darsdan', 'из урока 35', 'from lesson 35'),
      ex: [{ e: L('koordinata -- soya', 'координата это тень', 'a coordinate is a shadow'), why: L('o\'qdagi son', 'число на оси', 'a number on the axis') }],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true, cols: 4,
      prompt: '|(3; 4; 0)|',
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '7', hint: L("Bu koordinatalar yig'indisi. Ildiz ostida yigirma besh turadi.", 'Это сумма координат. Под корнем двадцать пять.', 'That is the sum of the coordinates. Under the root there is twenty five.') },
        { id: 'c', label: '25', hint: L("Bu ildiz ostidagi son.", 'Это число под корнем.', 'That is the number under the root.') },
        { id: 'd', label: '12', hint: L("Bu ko'paytma. Uzunlikda kvadratlar qo'shiladi.", 'Это произведение. В длине складываются квадраты.', 'That is the product. A length adds squares.') },
      ],
    },
    {
      id: 't2', ask: true, cols: 2,
      prompt: L('x + 2y + 2z − 6 = 0 normali?', 'Нормаль x + 2y + 2z − 6 = 0?', 'The normal of x + 2y + 2z − 6 = 0?'),
      items: [
        { id: 'a', label: '(1; 2; 2)', correct: true },
        { id: 'b', label: '(6; 0; 0)', hint: L("Bu o'q bilan kesishish nuqtasi, normal emas.", 'Это точка пересечения с осью, а не нормаль.', 'That is an axis intercept, not the normal.') },
        { id: 'c', label: '(1; 2; 2; −6)', hint: L("Ozod had normalga kirmaydi.", 'Свободный член в нормаль не входит.', 'The free term is not part of the normal.') },
        { id: 'd', label: '(1; 1; 1)', hint: L("Koeffitsiyentlar teng emas.", 'Коэффициенты не равны.', 'The coefficients are not equal.') },
      ],
    },
    {
      id: 't3', ask: true, cols: 4,
      prompt: L('(1; 2; 5) dan Oxy gacha masofa?', 'Расстояние от (1; 2; 5) до Oxy?', 'The distance from (1; 2; 5) to Oxy?'),
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '1', hint: L("Oxy tekisligigacha applikata javob beradi, abssissa emas.", 'До плоскости Oxy отвечает аппликата, а не абсцисса.', 'To the plane Oxy the applicate answers, not the abscissa.') },
        { id: 'c', label: '8', hint: L("Bu uchala koordinataning yig'indisi.", 'Это сумма всех трёх координат.', 'That is the sum of all three coordinates.') },
        { id: 'd', label: '√30', hint: L("Bu koordinata boshigacha masofa.", 'Это расстояние до начала координат.', 'That is the distance to the origin.') },
      ],
    },
  ],
  holds: [3000, 4000, 4000, 4000, 3500],
  audio: [
    A('mount', 'Uch tayanchni tiklaymiz. Bu baho emas.', 'Восстановим три опоры. Это не оценка.', 'Let us restore three basics. This is not graded.'),
    A('c1', "Birinchi tayanch: uzunlik kvadratlar yig'indisidan ildiz.", 'Первая опора: длина это корень из суммы квадратов.', 'The first basic: a length is the root of the sum of squares.'),
    A('c2', "Ikkinchi tayanch o'tgan darslardan: normal to'g'ridan to'g'ri koeffitsiyentlarda turadi.", 'Вторая опора с прошлых уроков: нормаль стоит прямо в коэффициентах.', 'The second basic from the previous lessons: the normal sits right in the coefficients.'),
    A('c3', "Uchinchi tayanch: koordinata bu o'qdagi soya, va u masofa bilan bog'liq.", 'Третья опора: координата это тень на оси, и она связана с расстоянием.', 'The third basic: a coordinate is a shadow on an axis, and it relates to distance.'),
    A('recap', 'Uchtasi birga bugungi javobni beradi.', 'Три вместе и дают сегодняшний ответ.', 'The three together give today\'s answer.'),
    A('tasks', 'Endi uchta qisqa topshiriq.', 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. MEZON: nechta koordinata ishlatiladi.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'dist_flat',
  eyebrow: L('Nechta koordinata', 'Сколько координат', 'How many coordinates'),
  title: L('Bitta nuqta, to\'rt masofa', 'Одна точка, четыре расстояния', 'One point, four distances'),
  expr: 'A (3; 4; −3)',
  goal: L('mezonni topish', 'найти признак', 'find the criterion'),
  rule: L("O'qgacha masofani izlaymiz.", 'Ищем расстояние до оси.', 'We look for the distance to an axis.'),
  pick: L('Nimagacha o\'lchaymiz?', 'До чего измерим?', 'What shall we measure to?'),
  claims: [
    { id: 'a', key: 'inA', name: L("o'qgacha bitta koordinata", 'до оси одна координата', 'to an axis one coordinate'), value: '1' },
    { id: 'b', key: 'inB', name: L("o'qgacha ikkita koordinata", 'до оси две координаты', 'to an axis two coordinates'), value: '2' },
  ],
  points: [
    {
      id: 'q1', label: L('Oxy tekisligi', 'плоскость Oxy', 'the plane Oxy'), num: '3', step: 'calc', verdict: 'out',
      calc: L('3: bitta koordinata', '3: одна координата', '3: one coordinate'),
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q2', label: L("Oz o'qi", 'ось Oz', 'the Oz axis'), num: '5', step: 'calc', verdict: 'in',
      calc: L('5: ikkita koordinata', '5: две координаты', '5: two coordinates'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q4', label: L('koordinata boshi', 'начало координат', 'the origin'), num: '√34', step: 'calc', verdict: 'out',
      calc: L('√34: uchtasi', '√34: все три', '√34: all three'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L(
      "O'qgacha masofada nechta koordinata ishlaydi?",
      'Сколько координат участвует в расстоянии до оси?',
      'How many coordinates take part in a distance to an axis?',
    ),
    items: [
      { id: 'b', label: L('ikkita', 'две', 'two'), correct: true },
      { id: 'a', label: L('bitta', 'одна', 'one'), hint: L('Bitta koordinata TEKISLIKKACHA.', 'Одна координата это до ПЛОСКОСТИ.', 'One coordinate means a PLANE.') },
      { id: 'c', label: L('uchtasi', 'все три', 'all three'), hint: L('Uchtasi boshgacha: √34.', 'Все три это до начала: √34.', 'All three means the origin: √34.') },
      { id: 'd', label: L("o'qqa bog'liq", 'зависит от оси', 'depends on the axis'), hint: L("Har qanday o'qda ikkitasi ishlaydi.", 'У любой оси участвуют две.', 'Any axis uses two.') },
    ],
  },
  holds: [3000, 4500, 2500, 2600, 9000],
  audio: [
    A('mount', 'Taxmin bor. Endi mezonni topamiz.', 'Прогноз есть. Теперь найдём признак.', 'The guess is made. Now let us find the criterion.'),
    A('mount', "Bitta nuqtadan to'rt xil narsagacha o'lchaymiz va har birida nechta koordinata ishlaganini sanaymiz.", 'От одной точки измерим до четырёх разных вещей и в каждом случае посчитаем, сколько координат участвует.', 'From one point we measure to four different things and count how many coordinates take part each time.'),
    A('mount', "To'rtta o'lchovni birma bir bajaramiz.", 'Выполним четыре измерения по одному.', 'Let us do the four measurements one by one.'),
    A('calc', 'Sanaymiz.', 'Считаем.', 'We count.'),
    A('mark', "Mana natija. Tekislikkacha bitta koordinata yetdi. O'qgacha ikkitasi kerak bo'ldi, va javob besh. Koordinata boshigacha esa uchtasi ishladi, va ildiz o'ttiz to'rt chiqdi. Demak birinchi da'vo yiqildi: o'qgacha bitta koordinata yetmaydi. Va e'tibor bering: xuk ekranidagi ildiz o'ttiz to'rt aslida boshgacha masofa edi, o'qgacha emas.", 'Вот результат. До плоскости хватило одной координаты. До оси понадобились две, и ответ пять. А до начала координат участвовали все три, и вышел корень из тридцати четырёх. Значит первое утверждение упало: до оси одной координаты не хватает. И обрати внимание: корень из тридцати четырёх с экрана хука это расстояние до начала, а не до оси.', 'Here is the result. For a plane one coordinate was enough. An axis needed two, and the answer is five. The origin used all three and gave the root of thirty four. The first claim fell: one coordinate is not enough for an axis. And note: the root of thirty four from the hook screen is the distance to the origin, not to the axis.'),
    A('next', 'Endi javob bering.', 'Теперь ответь.', 'Now answer.'),
  ],
}

// ============================================================
// SLAYD 4. ASBOB: HALOL CHIZG'ICH.
// `feet` -- kadr bo'yicha tayanch nuqtasi: avval QIYA, keyin perpendikular.
// ============================================================
const S4 = {
  role: 'graph',
  tag: 'slant_not_distance',
  drag: false,
  graphSteps: 2,
  eyebrow: L('Chizma', 'Чертёж', 'The drawing'),
  title: L('Qiya masofa emas', 'Наклонная это не расстояние', 'A slant is not a distance'),
  chip: 'A (3; 4; −3)',
  space: {
    mode: 'drop',
    box: [[0, 5], [0, 5], [-4, 2]],
    height: 200,
    interactive: true,
    value: 'dist',
    points: [{ at: [3, 4, -3], label: 'A', tone: 'accent' }],
    drop: { from: [3, 4, -3], to: 'axis:Oz' },
    feet: [[0, 0, 0], [0, 0, -3]],
    caption: L('karkasni barmoq bilan burish mumkin', 'каркас можно повернуть пальцем', 'you can turn the frame with a finger'),
  },
  bonus: L(
    "Asbob qiya kesmaga SON BERMAYDI. Bu qat'iy: masofa faqat perpendikular bo'ylab o'lchanadi, va boshqa har qanday kesma undan uzun.",
    'Прибор наклонной ЧИСЛА НЕ ДАЁТ. Это строго: расстояние измеряется только по перпендикуляру, и любой другой отрезок длиннее.',
    'The tool gives NO NUMBER for a slant. That is strict: a distance is measured along the perpendicular only, and any other segment is longer.',
  ),
  probe: {
    question: L(
      "Nega qiya kesma javob bo'lmaydi?",
      'Почему наклонная не может быть ответом?',
      'Why can a slant not be the answer?',
    ),
    items: [
      { id: 'a', label: L('u perpendikulardan uzun', 'она длиннее перпендикуляра', 'it is longer than the perpendicular'), correct: true },
      { id: 'b', label: L("uni o'lchash qiyin", 'её трудно измерить', 'it is hard to measure'), hint: L("O'lchash oson: uzunlik formulasi bilan. Masala shundaki, u eng qisqa emas.", 'Измерить легко: по формуле длины. Дело в том, что она не самая короткая.', 'Measuring is easy, by the length formula. The point is that it is not the shortest.') },
      { id: 'c', label: L('u nuqtadan chiqmaydi', 'она не выходит из точки', 'it does not leave the point'), hint: L("Chiqadi, va aynan shu nuqtadan. Lekin tayanchi boshqa joyda.", 'Выходит, и как раз из этой точки. Но основание в другом месте.', 'It does, from that very point. But its foot is elsewhere.') },
      { id: 'd', label: L("asbob shunday qilgan", 'так решил прибор', 'the tool decided so'), hint: L("Asbob o'zidan qilmaydi: u ta'rifni bajaradi.", 'Прибор не сам решает: он выполняет определение.', 'The tool does not decide: it follows the definition.') },
    ],
  },
  holds: [4500, 6000],
  audio: [
    A('mount', "Mezon topildi. Endi chizmaga qaraymiz. A nuqtadan koordinata boshiga kesma o'tkazildi. Asbob unga qiya deb yozdi va son bermadi.", 'Признак найден. Теперь посмотрим на чертёж. Из точки A проведён отрезок в начало координат. Прибор подписал его словом наклонная и числа не дал.', 'The criterion is found. Now let us look at the drawing. A segment goes from A to the origin. The tool labelled it a slant and gave no number.'),
    A('one', "Endi tayanchni surdik: kesma o'qqa perpendikular bo'ldi. Va faqat shu paytda asbob son berdi: besh. Perpendikular tayanchi nolinchi, nolinchi, minus uchda, ya'ni A ning applikatasi bilan bir xil balandlikda.", 'Теперь сдвинули основание: отрезок стал перпендикулярен оси. И только тогда прибор дал число: пять. Основание перпендикуляра в нуле, нуле, минус трёх, то есть на той же высоте, что аппликата A.', 'Now the foot moved: the segment became perpendicular to the axis. Only then did the tool give a number: five. The foot sits at zero, zero, minus three, at the same height as the applicate of A.'),
    A('two', "Qoida shu: masofa har doim perpendikular bo'ylab o'lchanadi. Qolgan har qanday kesma undan uzun bo'ladi, va u masofa emas.", 'Правило такое: расстояние всегда измеряется по перпендикуляру. Любой другой отрезок длиннее, и он не расстояние.', 'The rule is this: a distance is always measured along the perpendicular. Any other segment is longer, and it is not the distance.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1. Nechta koordinata.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'dist_flat',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Bitta Pifagor, uch holat', 'Один Пифагор, три случая', 'One Pythagoras, three cases'),
  rows: [
    L('tekislikkacha: bitta koordinata', 'до плоскости: одна координата', 'to a plane: one coordinate'),
    L("o'qgacha: ikkita, nuqtagacha: uchtasi", 'до оси: две, до точки: все три', 'to an axis: two, to a point: all three'),
  ],
  probe: {
    question: L(
      "(4; 5; −3) dan Oxz tekisligigacha masofa?",
      'Расстояние от (4; 5; −3) до плоскости Oxz?',
      'The distance from (4; 5; −3) to the plane Oxz?',
    ),
    items: [
      { id: 'a', label: '5', correct: true },
      { id: 'b', label: '3', hint: L("Uch bu Oxy gacha masofa: u applikatadan chiqadi.", 'Три это расстояние до Oxy: оно из аппликаты.', 'Three is the distance to Oxy: it comes from the applicate.') },
      { id: 'c', label: '4', hint: L("To'rt bu Oyz gacha masofa: u abssissadan chiqadi.", 'Четыре это расстояние до Oyz: оно из абсциссы.', 'Four is the distance to Oyz: it comes from the abscissa.') },
      { id: 'd', label: '√41', hint: L("Bu ikkita koordinata bilan, ya'ni o'qgacha masofa.", 'Это с двумя координатами, то есть расстояние до оси.', 'That uses two coordinates, so it is a distance to an axis.') },
    ],
  },
  rule: {
    badge: L('1-qoida. Masofa', 'Правило 1. Расстояние', 'Rule 1. Distance'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('masofa faqat perpendikular bo\'ylab', 'расстояние только по перпендикуляру', 'a distance only along the perpendicular'),
    lines: [
      L('tekislikkacha bitta koordinata: qolganlari erkin', 'до плоскости одна координата: остальные свободны', 'to a plane one coordinate: the rest are free'),
      L("o'qgacha ikkita: uchinchisi o'q bo'ylab yotadi", 'до оси две: третья лежит вдоль оси', 'to an axis two: the third lies along the axis'),
      L('nuqtagacha uchtasi: bu vektor uzunligi', 'до точки все три: это длина вектора', 'to a point all three: that is a vector length'),
      L('qiya kesma har doim uzunroq', 'наклонная всегда длиннее', 'a slant is always longer'),
    ],
    example: L('misol:  (3; 4; −3) dan Oz gacha  →  5', 'пример:  от (3; 4; −3) до Oz  →  5', 'example:  from (3; 4; −3) to Oz  →  5'),
  },
  holds: [4000, 7500, 4500],
  audio: [
    A('mount', 'Chizma ko\'rildi. Endi qoidani yozamiz.', 'Чертёж увидели. Теперь запишем правило.', 'We saw the drawing. Now let us write the rule.'),
    A('def', "Masofa har doim perpendikular bo'ylab o'lchanadi, va nechta koordinata ishlashini nimaga o'lchayotganimiz belgilaydi. Tekislikkacha bitta koordinata, chunki qolgan ikkitasi tekislik bo'ylab erkin. O'qgacha ikkita, chunki uchinchisi o'qning o'zi bo'ylab yotadi. Nuqtagacha esa uchtasi, va bu vektorning uzunligi.", 'Расстояние всегда измеряется по перпендикуляру, а сколько координат участвует, определяет то, до чего мы измеряем. До плоскости одна координата, потому что остальные две свободны вдоль плоскости. До оси две, потому что третья лежит вдоль самой оси. А до точки все три, и это длина вектора.', 'A distance is always measured along the perpendicular, and how many coordinates take part depends on what we measure to. To a plane one coordinate, because the other two are free along the plane. To an axis two, because the third lies along the axis itself. To a point all three, and that is a vector length.'),
    A('rule', "To'g'ri. Va tekshiruv: agar javobda uchta koordinata bo'lsa, o'lchov nuqtagacha bo'lgan.", 'Верно. И проверка: если в ответе три координаты, значит измерение было до точки.', 'Correct. And a check: if the answer uses three coordinates, the measurement went to a point.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: tekislik koordinata tekisligi emas.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'slant_not_distance',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Tekislik qiya turadi', 'Плоскость стоит наклонно', 'The plane stands at a slant'),
  was: { label: UI.was, expr: L('Oxy: masofa = |z|', 'Oxy: расстояние = |z|', 'Oxy: the distance = |z|') },
  now: { label: UI.now, expr: 'x + 2y + 2z − 6 = 0' },
  probe1: {
    cols: 2,
    question: L('Bu tekislikkacha koordinata yetadimi?', 'Хватит ли координаты до этой плоскости?', 'Is a coordinate enough for this plane?'),
    items: [
      { id: 'a', label: L("yo'q", 'нет', 'no'), correct: true },
      { id: 'b', label: L('ha', 'да', 'yes'), hint: L("Koordinata faqat koordinata tekisligiga to'g'ri kelardi: u yerda normal o'q bo'ylab.", 'Координата подошла бы только для координатной плоскости: там нормаль вдоль оси.', 'A coordinate would fit only a coordinate plane: there the normal runs along an axis.') },
    ],
  },
  probe2: {
    cols: 4,
    question: L(
      'Koordinata boshidan bu tekislikkacha masofa?',
      'Расстояние от начала координат до этой плоскости?',
      'The distance from the origin to this plane?',
    ),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '1' },
      { id: 'b', label: '2' },
      { id: 'c', label: '6' },
      { id: 'd', label: '3' },
    ],
  },
  holds: [4000, 5000, 3000],
  audio: [
    A('mount', "Qoida yozildi. Endi tekislik qiya bo'ladi.", 'Правило записали. Теперь плоскость станет наклонной.', 'The rule is written. Now the plane goes slanted.'),
    A('now', "Bu tekislik koordinata tekisligi emas: uning normali hech qaysi o'q bo'ylab yotmaydi. Shuning uchun bitta koordinata javob bermaydi.", 'Эта плоскость не координатная: её нормаль не лежит ни вдоль одной оси. Поэтому одна координата ответа не даст.', 'This plane is not a coordinate one: its normal lies along no axis. So one coordinate will not answer.'),
    A('q1', 'Bu tekislikkacha koordinata yetadimi?', 'Хватит ли координаты до этой плоскости?', 'Is a coordinate enough for this plane?'),
    A('q2', "Endi taxmin qiling: koordinata boshidan bu tekislikkacha masofa nechchi.", 'Теперь предположи: чему равно расстояние от начала координат до этой плоскости.', 'Now make a guess: what is the distance from the origin to this plane.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: qiya va perpendikular.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'slant_not_distance',
  eyebrow: L('Ikki nomzod', 'Два кандидата', 'Two candidates'),
  title: L('Qiya va perpendikular', 'Наклонная и перпендикуляр', 'A slant and a perpendicular'),
  expr: L('boshdan x + 2y + 2z − 6 = 0 gacha', 'от начала до x + 2y + 2z − 6 = 0', 'from the origin to x + 2y + 2z − 6 = 0'),
  need: L('eng qisqa kesma', 'самый короткий отрезок', 'the shortest segment'),
  answerLabel: L('masofa', 'расстояние', 'the distance'),
  cards: [
    {
      tag: L('qiya', 'наклонная', 'the slant'),
      txt: L('boshdan (6; 0; 0) gacha', 'от начала до (6; 0; 0)', 'from the origin to (6; 0; 0)'),
      point: { label: L('uzunlik', 'длина', 'the length'), calc: '6', verdict: 'out' },
    },
    {
      tag: L('perpendikular', 'перпендикуляр', 'the perpendicular'),
      txt: '|−6| / 3',
      point: { label: L('uzunlik', 'длина', 'the length'), calc: '2', verdict: 'in' },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['2', '6', '3', '18'],
    value: ['2'],
    label: L('masofa =', 'расстояние =', 'distance ='),
    prompt: L('Masofani yozing', 'Запиши расстояние', 'Write the distance'),
    wrongs: [
      { key: '6', hint: L("Bu qiya kesma: u tekislikning bir nuqtasigacha, eng yaqinigacha emas.", 'Это наклонная: до одной точки плоскости, а не до ближайшей.', 'That is the slant: to one point of the plane, not the nearest one.') },
      { key: '3', hint: L("Uch bu normalning uzunligi, masofa emas.", 'Три это длина нормали, а не расстояние.', 'Three is the length of the normal, not the distance.') },
      { key: '18', hint: L("Bu bo'lish emas, ko'paytirish bo'lgan.", 'Здесь вместо деления вышло умножение.', 'Here multiplication happened instead of division.') },
      { key: '*', hint: L("Olti bo'lingan uch, ya'ni ikki.", 'Шесть делить на три, то есть два.', 'Six over three, that is two.') },
    ],
  },
  holds: [4000, 4500, 6000],
  audio: [
    A('mount', "Taxmin bor. Endi ikkala kesmani ham o'lchaymiz.", 'Прогноз есть. Теперь измерим оба отрезка.', 'The guess is made. Now let us measure both segments.'),
    A('p1', "Birinchi kesma boshdan tekislikning bir nuqtasiga boradi, ya'ni olti, nol, nolga. Uning uzunligi olti. Lekin bu eng qisqa emas.", 'Первый отрезок идёт из начала в одну из точек плоскости, а именно в шесть, нуль, нуль. Его длина шесть. Но это не самый короткий.', 'The first segment goes from the origin to one point of the plane, namely six, zero, zero. Its length is six. But it is not the shortest.'),
    A('p2', "Ikkinchisi normal bo'ylab boradi. Uni topish uchun nuqtani tenglamaga qo'yamiz va normal uzunligiga bo'lamiz. Boshni qo'ysak minus olti chiqadi, moduli olti, normal uzunligi uch. Demak masofa ikki. Yozing.", 'Второй идёт по нормали. Чтобы его найти, подставляем точку в уравнение и делим на длину нормали. Подстановка начала даёт минус шесть, модуль шесть, длина нормали три. Значит расстояние два. Запиши.', 'The second goes along the normal. To find it we substitute the point into the equation and divide by the normal length. The origin gives minus six, its absolute value six, the normal length three. So the distance is two. Write it.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2. Nuqtadan tekislikkacha.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'slant_not_distance',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Nuqtadan tekislikkacha', 'От точки до плоскости', 'From a point to a plane'),
  cases: [
    {
      label: L('yuqorida', 'сверху', 'the numerator'),
      text: L('tenglamaga qo\'yish', 'подстановка в уравнение', 'substitution into the equation'),
      tone: 'graph',
    },
    {
      label: L('pastda', 'снизу', 'the denominator'),
      text: L('normal uzunligi', 'длина нормали', 'the normal length'),
      tone: 'accent',
    },
  ],
  rows: [
    'd = |ax₀ + by₀ + cz₀ + d| / √(a² + b² + c²)',
    L('boshdan:  |−6| / 3 = 2', 'от начала:  |−6| / 3 = 2', 'from the origin:  |−6| / 3 = 2'),
  ],
  probe: {
    question: L(
      "Oxy tekisligi uchun bu formula nima beradi?",
      'Что даёт эта формула для плоскости Oxy?',
      'What does this formula give for the plane Oxy?',
    ),
    items: [
      { id: 'a', label: '|z|', correct: true },
      { id: 'b', label: '|x|', hint: L("Oxy ning tenglamasi zet teng nol, ya'ni normal (0; 0; 1).", 'Уравнение Oxy это зет равно нулю, значит нормаль (0; 0; 1).', 'The equation of Oxy is z equals zero, so the normal is (0; 0; 1).') },
      { id: 'c', label: '|x + y + z|', hint: L("Yig'indi emas: tenglamada faqat zet bor.", 'Не сумма: в уравнении только зет.', 'Not the sum: the equation has only z.') },
      { id: 'd', label: '0', hint: L("Nol faqat tekislikda yotgan nuqtalarda.", 'Нуль только у точек, лежащих в плоскости.', 'Zero only for points lying in the plane.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Tekislikkacha', 'Правило 2. До плоскости', 'Rule 2. To a plane'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: 'd = |ax₀ + by₀ + cz₀ + d| / |n|',
    lines: [
      L('yuqorida nuqtani qo\'yish natijasi, modul bilan', 'сверху результат подстановки точки, с модулем', 'the numerator is the substitution result, with an absolute value'),
      L('pastda normalning uzunligi', 'снизу длина нормали', 'the denominator is the normal length'),
      L("koordinata tekisligi -- xususiy hol, unda |n| = 1", 'координатная плоскость это частный случай, там |n| = 1', 'a coordinate plane is a special case, there |n| = 1'),
      L('nol chiqsa, nuqta tekislikda yotadi', 'если вышел нуль, точка лежит в плоскости', 'a zero means the point lies in the plane'),
    ],
    example: L('misol:  |2 − 2 + 6 − 9| / 3 = 1', 'пример:  |2 − 2 + 6 − 9| / 3 = 1', 'example:  |2 − 2 + 6 − 9| / 3 = 1'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('masofa perpendikular bo\'ylab, va u eng qisqa', 'расстояние по перпендикуляру, и оно наименьшее', 'the distance along the perpendicular, and it is the least'),
    lines: [
      L('1. tekislikkacha bitta koordinata yoki formula', '1. до плоскости одна координата или формула', '1. to a plane one coordinate or the formula'),
      L("2. o'qgacha ikkita koordinata", '2. до оси две координаты', '2. to an axis two coordinates'),
      L('3. nuqtagacha uchtasi', '3. до точки все три', '3. to a point all three'),
      L('4. qiya kesma javob emas', '4. наклонная не ответ', '4. a slant is not the answer'),
    ],
  },
  holds: [4000, 7500, 2600],
  audio: [
    A('mount', "Masofa yozildi. Endi umumiy formulani chiqaramiz.", 'Расстояние записали. Теперь выведем общую формулу.', 'The distance is written. Now let us derive the general formula.'),
    A('rows', "Nuqtadan tekislikkacha masofa uchun nuqtani tenglamaga qo'yamiz, modulini olamiz va normal uzunligiga bo'lamiz. Koordinata tekisligi bunda xususiy hol bo'lib chiqadi: Oxy uchun normal noldan noldan bir, uning uzunligi bir, va formula shunchaki applikataning modulini beradi.", 'Для расстояния от точки до плоскости подставляем точку в уравнение, берём модуль и делим на длину нормали. Координатная плоскость оказывается частным случаем: для Oxy нормаль нуль нуль один, её длина единица, и формула просто даёт модуль аппликаты.', 'For the distance from a point to a plane we substitute the point into the equation, take the absolute value and divide by the normal length. A coordinate plane turns out to be a special case: for Oxy the normal is zero zero one, its length is one, and the formula simply gives the absolute value of the applicate.'),
    A('rule', "To'g'ri.", 'Верно.', 'Correct.'),
    A('both', 'Endi butun darsni bitta qoidaga yig\'ing.', 'А теперь собери весь урок в одно правило.', 'Now combine the whole lesson into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. ISHORANI O'ZI QO'YADI: modul.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'slant_not_distance',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L('qo\'yish −6 berdi, |n| = 3', 'подстановка дала −6, |n| = 3', 'the substitution gave −6, |n| = 3'),
  template: ['d = ', { slot: 0 }, ' 6 / 3'],
  signs: ['+', '−'],
  answer: '+',
  checkNote: L(
    'Masofa manfiy bo\'lmaydi, shuning uchun modul olinadi',
    'Расстояние не бывает отрицательным, поэтому берётся модуль',
    'A distance is never negative, so the absolute value is taken',
  ),
  wrongs: [
    { key: '−', hint: L("Minus bilan masofa manfiy chiqadi, bunday bo'lmaydi. Modul aynan shuni tuzatadi.", 'С минусом расстояние выйдет отрицательным, а так не бывает. Модуль это и исправляет.', 'With a minus the distance would be negative, which never happens. The absolute value fixes it.') },
  ],
  probe: {
    question: L("Qo'yish nol bergan bo'lsa, bu nima degani?", 'Если подстановка дала нуль, что это значит?', 'If the substitution gave zero, what does it mean?'),
    items: [
      { id: 'a', label: L('nuqta tekislikda yotadi', 'точка лежит в плоскости', 'the point lies in the plane'), correct: true },
      { id: 'b', label: L('tekislik koordinata boshidan o\'tadi', 'плоскость проходит через начало', 'the plane passes through the origin'), hint: L("Bu ozod had nol bo'lganda. Bu yerda esa NUQTA nol berdi.", 'Это когда свободный член нуль. А здесь нуль дала ТОЧКА.', 'That happens when the free term is zero. Here the POINT gave zero.') },
      { id: 'c', label: L('normal nol', 'нормаль нулевая', 'the normal is zero'), hint: L("Nol normal tekislik bermaydi.", 'Нулевая нормаль плоскости не задаёт.', 'A zero normal defines no plane.') },
      { id: 'd', label: L('xato bor', 'есть ошибка', 'there is an error'), hint: L("Xato yo'q: nol butunlay ma'noli javob.", 'Ошибки нет: нуль вполне осмысленный ответ.', 'No error: zero is a perfectly meaningful answer.') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
    A('checked', "Bo'ldi. Endi nol haqida javob bering.", 'Готово. Теперь ответь про нуль.', 'Done. Now answer about zero.'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'put', label: L('nuqtani tenglamaga qo\'yish', 'подставить точку в уравнение', 'substitute the point') },
  { id: 'abs', label: L('modul olish', 'взять модуль', 'take the absolute value') },
  { id: 'len', label: L('normal uzunligini topish', 'найти длину нормали', 'find the normal length') },
  { id: 'div', label: L("bo'lish", 'поделить', 'divide') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'slant_not_distance',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Masofani topamiz', 'Находим расстояние', 'Finding the distance'),
  start: L('(1; 2; 3) dan 2x − y + 2z − 9 = 0 gacha', 'от (1; 2; 3) до 2x − y + 2z − 9 = 0', 'from (1; 2; 3) to 2x − y + 2z − 9 = 0'),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'put',
      to: '2 − 2 + 6 − 9 = −3',
      wrongs: [
        { action: 'len', hint: L("Uzunlik keyin kerak bo'ladi, avval nuqtani qo'ying.", 'Длина понадобится потом, сначала подставь точку.', 'The length comes later, substitute the point first.') },
        { action: 'abs', hint: L("Modul olish uchun avval son kerak.", 'Чтобы взять модуль, нужно сначала число.', 'To take the absolute value, first get the number.') },
        { action: 'div', hint: L("Bo'lish oxirgi qadam.", 'Деление это последний шаг.', 'Division is the last step.') },
      ],
    },
    {
      action: 'len',
      to: '|n| = 3',
      wrongs: [
        { action: 'put', hint: L("Qo'yildi: minus uch.", 'Подставлено: минус три.', 'Substituted: minus three.') },
        { action: 'div', hint: L("Nimaga bo'lishni bilish uchun uzunlik kerak.", 'Чтобы знать, на что делить, нужна длина.', 'To know what to divide by, the length is needed.') },
        { action: 'abs', hint: L("Modul bo'lishdan oldin ham, keyin ham bir xil natija beradi, lekin avval uzunlikni toping.", 'Модуль до деления и после даёт одно, но сначала найди длину.', 'The absolute value gives the same before or after, but find the length first.') },
      ],
    },
    {
      action: 'div',
      to: '3 / 3',
      wrongs: [
        { action: 'put', hint: L("Sanalgan: minus uch.", 'Посчитано: минус три.', 'Computed: minus three.') },
        { action: 'len', hint: L("Uzunlik topilgan: uch.", 'Длина найдена: три.', 'The length is found: three.') },
        { action: 'abs', hint: L("Modul olingan: uch.", 'Модуль взят: три.', 'The absolute value is taken: three.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['1', '3', '−1', '9'],
    value: ['1'],
    label: L('masofa =', 'расстояние =', 'distance ='),
    prompt: L('Masofani yozing', 'Запиши расстояние', 'Write the distance'),
    wrongs: [
      { key: '3', hint: L("Bu qo'yish natijasining moduli, uni normal uzunligiga bo'lish kerak.", 'Это модуль результата подстановки, его надо поделить на длину нормали.', 'That is the absolute value of the substitution, it must be divided by the normal length.') },
      { key: '−1', hint: L("Masofa manfiy bo'lmaydi: modul olinadi.", 'Расстояние не бывает отрицательным: берётся модуль.', 'A distance is never negative: the absolute value is taken.') },
      { key: '9', hint: L("Bu bo'lish emas, ko'paytirish bo'lgan.", 'Здесь вместо деления вышло умножение.', 'Here multiplication happened instead of division.') },
      { key: '*', hint: L("Uch bo'lingan uch, ya'ni bir.", 'Три делить на три, то есть один.', 'Three over three, that is one.') },
    ],
  },
  audio: [
    A('mount', 'Ishora qo\'yildi. Endi to\'liq masalani o\'tamiz.', 'Знак поставлен. Пройдём полную задачу.', 'The sign is placed. Let us work a full problem.'),
    A('start', "Diqqat: normalning uzunligi ikki, minus bir, ikki uchun uch chiqadi.", 'Внимание: длина нормали для двух, минус одного, двух равна трём.', 'Careful: the normal length for two, minus one, two is three.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL: perimetr. Darslikning 2-masalasi.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'dist_flat',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Uchburchak perimetri', 'Периметр треугольника', 'A triangle perimeter'),
  start: 'A (9; 3; −5),  B (2; 10; −5),  C (2; 3; 2)',
  actions: ACTIONS_10,
  hint: L(
    "Har bir tomon uchun uchta ayirmani sanang: bu nuqtagacha masofa.",
    'Для каждой стороны посчитай три разности: это расстояние до точки.',
    'For each side compute three differences: that is a point to point distance.',
  ),
  steps: [
    {
      action: 'put',
      to: 'AB = 7√2,  AC = 7√2',
      wrongs: [
        { action: 'len', hint: L("Uzunlik aynan shu qadamda hisoblanadi: ayirmalar bo'yicha.", 'Длина считается как раз на этом шаге: по разностям.', 'The length is computed at this very step: from the differences.') },
        { action: 'abs', hint: L("Modul bu masalada kerak emas: uzunlik allaqachon musbat.", 'Модуль в этой задаче не нужен: длина и так положительна.', 'No absolute value needed here: a length is positive anyway.') },
        { action: 'div', hint: L("Bo'lish kerak emas.", 'Делить не нужно.', 'No division needed.') },
      ],
    },
    {
      action: 'len',
      to: 'BC = 7√2',
      wrongs: [
        { action: 'put', hint: L("Ikkita tomon topilgan, uchinchisi qoldi.", 'Две стороны найдены, осталась третья.', 'Two sides are found, the third remains.') },
        { action: 'abs', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
        { action: 'div', hint: L("Kerak emas.", 'Не нужно.', 'Not needed.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['21√2', '7√2', '14√2', '42'],
    value: ['21√2'],
    label: 'P =',
    prompt: L('Perimetrni yozing', 'Запиши периметр', 'Write the perimeter'),
    wrongs: [
      { key: '7√2', hint: L("Bu bitta tomon. Perimetr uchta tomonning yig'indisi.", 'Это одна сторона. Периметр это сумма трёх сторон.', 'That is one side. The perimeter is the sum of three.') },
      { key: '14√2', hint: L("Bu ikkita tomon. Uchburchakda uchtasi.", 'Это две стороны. В треугольнике их три.', 'That is two sides. A triangle has three.') },
      { key: '42', hint: L("Ildiz ikki tushib qolgan: uchala tomon ham ildizli.", 'Потерян корень из двух: все три стороны с корнем.', 'The root of two is lost: all three sides carry it.') },
      { key: '*', hint: L("Uchala tomon ham yetti ildiz ikki, ya'ni jami yigirma bir ildiz ikki.", 'Все три стороны по семь корней из двух, всего двадцать один корень из двух.', 'All three sides are seven root two, twenty one root two in total.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil, xuddi imtihondagidek.", 'Теперь полностью сам, как на экзамене.', 'Now completely on your own, as on the exam.'),
    A('go', "Uchburchakning uchta tomonini sanang. Bu darslikning masalasi, va u yerda javob teng tomonli uchburchak chiqadi.", 'Посчитай три стороны треугольника. Это задача из учебника, и там выходит равносторонний треугольник.', 'Compute the three sides of the triangle. This is a textbook problem, and it turns out equilateral.'),
    A('answered', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
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
      id: 'b1', tag: 'dist_flat', ask: true, cols: 4,
      done: '3',
      prompt: L('(4; 5; −3) dan Oxy gacha?', 'От (4; 5; −3) до Oxy?', 'From (4; 5; −3) to Oxy?'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '5', hint: L("Besh bu Oxz gacha masofa.", 'Пять это расстояние до Oxz.', 'Five is the distance to Oxz.') },
        { id: 'c', label: '4', hint: L("To'rt bu Oyz gacha masofa.", 'Четыре это расстояние до Oyz.', 'Four is the distance to Oyz.') },
        { id: 'd', label: '√50', hint: L("Bu ikkita koordinata, ya'ni o'qgacha.", 'Это две координаты, то есть до оси.', 'That uses two coordinates, so it is to an axis.') },
      ],
    },
    {
      id: 'b2', tag: 'dist_flat', ask: true, cols: 4,
      done: '5',
      prompt: L("(3; 4; −3) dan Oz gacha?", 'От (3; 4; −3) до Oz?', 'From (3; 4; −3) to Oz?'),
      items: [
        { id: 'a', label: '5', correct: true },
        { id: 'b', label: '√34', hint: L("Bu koordinata boshigacha: uchala koordinata ishlagan.", 'Это до начала координат: участвовали все три координаты.', 'That is to the origin: all three coordinates took part.') },
        { id: 'c', label: '3', hint: L("Bu applikataning moduli, ya'ni Oxy gacha.", 'Это модуль аппликаты, то есть до Oxy.', 'That is the applicate, so it is to Oxy.') },
        { id: 'd', label: '7', hint: L("Bu koordinatalar yig'indisi. Kvadratlar qo'shiladi.", 'Это сумма координат. Складываются квадраты.', 'That is the sum of the coordinates. Squares are added.') },
      ],
    },
    {
      id: 'b3', tag: 'dist_flat', ask: true, cols: 4,
      done: '√26',
      prompt: L('(2; 0; −3) va (3; 4; 0) orasidagi masofa?', 'Расстояние между (2; 0; −3) и (3; 4; 0)?', 'The distance between (2; 0; −3) and (3; 4; 0)?'),
      items: [
        { id: 'a', label: '√26', correct: true },
        { id: 'b', label: '√38', hint: L("Ayirmalar bir, to'rt va uch: bir plyus o'n olti plyus to'qqiz.", 'Разности один, четыре и три: один плюс шестнадцать плюс девять.', 'The differences are one, four and three: one plus sixteen plus nine.') },
        { id: 'c', label: '8', hint: L("Bu ayirmalar yig'indisi, kvadratlar emas.", 'Это сумма разностей, а не квадратов.', 'That is the sum of the differences, not the squares.') },
        { id: 'd', label: '26', hint: L("Bu ildiz ostidagi son.", 'Это число под корнем.', 'That is the number under the root.') },
      ],
    },
    {
      id: 'b4', tag: 'sphere_center', ask: true, cols: 4,
      done: 'x² + y² + z² = 25',
      prompt: L('Markazi boshda, R = 5 bo\'lgan sfera?', 'Сфера с центром в начале, R = 5?', 'A sphere centred at the origin, R = 5?'),
      items: [
        { id: 'a', label: 'x² + y² + z² = 25', correct: true },
        { id: 'b', label: 'x² + y² + z² = 5', hint: L("O'ng tomonda radiusning KVADRATI turadi.", 'Справа стоит КВАДРАТ радиуса.', 'The right side takes the radius SQUARED.') },
        { id: 'c', label: 'x + y + z = 25', hint: L("Kvadratlar tushib qolgan: bu tekislik tenglamasi bo'lardi.", 'Потеряны квадраты: это было бы уравнение плоскости.', 'The squares are lost: that would be a plane equation.') },
        { id: 'd', label: '(x − 5)² + y² + z² = 25', hint: L("Markaz boshda, ya'ni qavslar ichida ayirma yo'q.", 'Центр в начале, значит внутри скобок разностей нет.', 'The centre is at the origin, so no differences inside the brackets.') },
      ],
    },
    {
      id: 'b5', tag: 'slant_not_distance', ask: true, cols: 4,
      done: '2',
      prompt: L('Boshdan x + 2y + 2z − 6 = 0 gacha?', 'От начала до x + 2y + 2z − 6 = 0?', 'From the origin to x + 2y + 2z − 6 = 0?'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '6', hint: L("Bu qo'yish natijasining moduli, uni uchga bo'lish kerak.", 'Это модуль подстановки, его надо поделить на три.', 'That is the substitution result, it must be divided by three.') },
        { id: 'c', label: '3', hint: L("Uch bu normal uzunligi.", 'Три это длина нормали.', 'Three is the normal length.') },
        { id: 'd', label: '18', hint: L("Bo'lish o'rniga ko'paytirilgan.", 'Вместо деления умножено.', 'Multiplied instead of divided.') },
      ],
    },
    {
      id: 'b6', tag: 'dist_flat', ask: true, cols: 4,
      done: 'Oxz',
      prompt: L("Masofa |y| ga teng. Nimagacha?", 'Расстояние равно |y|. До чего?', 'The distance equals |y|. To what?'),
      items: [
        { id: 'a', label: 'Oxz', correct: true },
        { id: 'b', label: 'Oxy', hint: L("Oxy gacha masofa applikataning moduli.", 'До Oxy расстояние это модуль аппликаты.', 'To Oxy the distance is the applicate.') },
        { id: 'c', label: 'Oyz', hint: L("Oyz gacha masofa abssissaning moduli.", 'До Oyz расстояние это модуль абсциссы.', 'To Oyz the distance is the abscissa.') },
        { id: 'd', label: L("Oy o'qi", 'ось Oy', 'the Oy axis'), hint: L("O'qgacha ikkita koordinata ishlaydi, bu yerda esa bittasi.", 'До оси участвуют две координаты, а здесь одна.', 'An axis needs two coordinates, here there is one.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', "O'qgacha.", 'До оси.', 'To an axis.'),
    A('q3', 'Ikki nuqta.', 'Две точки.', 'Two points.'),
    A('q4', 'Sfera.', 'Сфера.', 'A sphere.'),
    A('q5', 'Tekislikkacha.', 'До плоскости.', 'To a plane.'),
    A('q6', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: uchala koordinata olingan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'dist_flat',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Uchta satr to\'g\'ri, bittasi yo\'q', 'Три строки верны, одна нет', 'Three lines are right, one is not'),
  rows: [
    { id: 'r1', text: L('A (3; 4; −3) dan Oz gacha', 'от A (3; 4; −3) до Oz', 'from A (3; 4; −3) to Oz') },
    { id: 'r2', text: L("Oz o'qida (0; 0; z) nuqtalar", 'на оси Oz точки (0; 0; z)', 'on Oz the points are (0; 0; z)') },
    { id: 'r3', text: 'd² = 9 + 16 + 9' },
    { id: 'r4', text: 'd = √34' },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("To'g'ri: o'qda abssissa va ordinata nol.", 'Верно: на оси абсцисса и ордината нули.', 'Right: on the axis the abscissa and ordinate are zeros.'),
    r4: L("Bu satr oldingisidan to'g'ri chiqadi. Xato yuqorida.", 'Эта строка верно следует из предыдущей. Ошибка выше.', 'This line follows correctly. The error is above.'),
  },
  proofPoint: L('applikata ortiqcha', 'аппликата лишняя', 'the applicate is extra'),
  proof: L(
    "Applikata ortiqcha qo'shilgan. Perpendikularning tayanchi (0; 0; −3) da, ya'ni applikata AYIRMASI nol. To'g'risi to'qqiz plyus o'n olti, ya'ni yigirma besh, va masofa besh.",
    'Аппликата добавлена лишней. Основание перпендикуляра в (0; 0; −3), то есть РАЗНОСТЬ аппликат нулевая. Верно девять плюс шестнадцать, то есть двадцать пять, и расстояние пять.',
    'The applicate was added in error. The foot of the perpendicular is at (0; 0; −3), so the DIFFERENCE of applicates is zero. Correctly nine plus sixteen is twenty five, and the distance is five.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('uchinchi koordinata ortiqcha', 'третья координата лишняя', 'the third coordinate is extra'), correct: true },
      { id: 'b', label: L('arifmetika', 'арифметика', 'the arithmetic'), hint: L("Arifmetika to'g'ri: to'qqiz plyus o'n olti plyus to'qqiz o'ttiz to'rt.", 'Арифметика верна: девять плюс шестнадцать плюс девять тридцать четыре.', 'The arithmetic is right: nine plus sixteen plus nine is thirty four.') },
      { id: 'c', label: L("o'q noto'g'ri", 'неверная ось', 'the wrong axis'), hint: L("O'q shartdan: Oz.", 'Ось из условия: Oz.', 'The axis is from the problem: Oz.') },
      { id: 'd', label: L("javob to'g'ri", 'ответ верный', 'the answer is right'), hint: L("Ildiz o'ttiz to'rt bu boshgacha masofa, o'qgacha esa besh.", 'Корень из тридцати четырёх это до начала, а до оси пять.', 'The root of thirty four is to the origin, to the axis it is five.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Diqqat: arifmetika bu yerda to'g'ri, va aynan shu qiyin qiladi. Xatoni toping.", 'Внимание: арифметика здесь верна, и это как раз усложняет дело. Найди ошибку.', 'Careful: the arithmetic here is right, and that is what makes it hard. Find the error.'),
    A('proof', "Qarang: uchinchi qo'shiluvchi ortiqcha. Perpendikularning tayanchi nol, nol, minus uchda turadi, ya'ni applikatalar AYIRMASI nolga teng. Shuning uchun faqat to'qqiz plyus o'n olti qoladi, va masofa besh. Ildiz o'ttiz to'rt esa koordinata boshigacha masofa, va bu boshqa savol.", 'Смотри: третье слагаемое лишнее. Основание перпендикуляра стоит в нуле, нуле, минус трёх, то есть РАЗНОСТЬ аппликат равна нулю. Поэтому остаётся только девять плюс шестнадцать, и расстояние пять. А корень из тридцати четырёх это расстояние до начала координат, и это другой вопрос.', 'Look: the third term is extra. The foot of the perpendicular sits at zero, zero, minus three, so the DIFFERENCE of the applicates is zero. Only nine plus sixteen remains, and the distance is five. The root of thirty four is the distance to the origin, which is another question.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA: sfera tenglamasi. Darslik 21-23.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'sphere_center',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Sfera tenglamasini yig\'ing', 'Собери уравнение сферы', 'Build the sphere equation'),
  targetLabel: L('Tekshiruv', 'Проверка', 'The check'),
  targetValue: L('markaz va radius', 'центр и радиус', 'the centre and the radius'),
  tasks: [
    {
      prompt: L('markaz (1; 2; 4), R = 3', 'центр (1; 2; 4), R = 3', 'centre (1; 2; 4), R = 3'),
      template: ['(x − 1)² + (y − 2)² + (z − 4)² = ', { slot: 0 }],
      parts: ['9', '3', '27', '6'],
      answer: ['9'],
      doneLabel: '… = 9',
      wrongs: [
        { key: '3', hint: L("O'ng tomonda radiusning KVADRATI turadi.", 'Справа стоит КВАДРАТ радиуса.', 'The right side takes the radius SQUARED.') },
        { key: '*', hint: L("Uch kvadratda to'qqiz.", 'Три в квадрате девять.', 'Three squared is nine.') },
      ],
    },
    {
      prompt: L('markaz (0; 0; 0), R = 5', 'центр (0; 0; 0), R = 5', 'centre (0; 0; 0), R = 5'),
      template: ['x² + y² + z² = ', { slot: 0 }],
      parts: ['25', '5', '10', '125'],
      answer: ['25'],
      doneLabel: '… = 25',
      wrongs: [
        { key: '5', hint: L("Radiusning kvadrati kerak: yigirma besh.", 'Нужен квадрат радиуса: двадцать пять.', 'The radius squared is needed: twenty five.') },
        { key: '*', hint: L("Besh kvadratda yigirma besh.", 'Пять в квадрате двадцать пять.', 'Five squared is twenty five.') },
      ],
    },
  ],
  audio: [
    A('mount', "Xato topildi. Oxirgi topshiriq teskari: markaz va radius bor, tenglama kerak.", 'Ошибка найдена. Последнее задание обратное: есть центр и радиус, нужно уравнение.', 'The error is found. The last task is reverse: the centre and radius are given, the equation is needed.'),
    A('built1', "Endi ikkinchisi: markaz koordinata boshida.", 'Теперь второе: центр в начале координат.', 'Now the second: the centre at the origin.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'slant_not_distance',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: 'd = |ax₀ + by₀ + cz₀ + d| / |n|',
  ruleLines: [
    L('masofa faqat perpendikular bo\'ylab', 'расстояние только по перпендикуляру', 'a distance only along the perpendicular'),
    L("tekislik 1, o'q 2, nuqta 3", 'плоскость 1, ось 2, точка 3', 'a plane 1, an axis 2, a point 3'),
    L('sfera bu doimiy masofadagi nuqtalar', 'сфера это точки на постоянном расстоянии', 'a sphere is the points at a constant distance'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L("Oz gacha masofa", 'расстояние до Oz', 'the distance to Oz'),
      right: '5',
      map: { a: '5', b: '√34', c: L('ikkalasi', 'оба', 'both'), d: L('aniqlanmaydi', 'не определить', 'cannot tell') },
    },
    {
      screen: 5,
      expr: L('boshdan tekislikkacha', 'от начала до плоскости', 'origin to the plane'),
      right: '2',
      map: { a: '1', b: '2', c: '6', d: '3' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('5 va √34 → qiya emas → 5', '5 и √34 → не наклонная → 5', '5 and √34 → not the slant → 5'),
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L("Qoida va halol chizg'ich ekraniga qayting", 'Вернись к правилу и к экрану с линейкой', 'Go back to the rule and the ruler screen'),
  },
  probe: {
    question: L(
      "Javobda uchta koordinata ishlagan. Nimagacha o'lchagan bo'ldingiz?",
      'В ответе участвовали три координаты. До чего было измерено?',
      'The answer used three coordinates. What was measured to?',
    ),
    items: [
      { id: 'a', label: L('nuqtagacha', 'до точки', 'to a point'), correct: true },
      { id: 'b', label: L("o'qgacha", 'до оси', 'to an axis'), hint: L("O'qgacha ikkitasi ishlaydi: uchinchisi o'q bo'ylab yotadi.", 'До оси участвуют две: третья лежит вдоль оси.', 'An axis uses two: the third lies along the axis.') },
      { id: 'c', label: L('tekislikkacha', 'до плоскости', 'to a plane'), hint: L("Koordinata tekisligigacha bittasi yetadi.", 'До координатной плоскости хватает одной.', 'A coordinate plane needs just one.') },
      { id: 'd', label: L("aniqlanmaydi", 'не определить', 'cannot tell'), hint: L("Aniqlanadi: koordinatalar soni nimagacha o'lchaganingizni aytadi.", 'Определяется: число координат и говорит, до чего измерено.', 'It can: the count of coordinates tells what was measured to.') },
    ],
  },
  sheetTitle: L('Masofalar · shpargalka', 'Расстояния · шпаргалка', 'Distances · cheat sheet'),
  sheetSrc: L('11-sinf · 40-dars', '11 класс · урок 40', 'Grade 11 · lesson 40'),
  lifehack: L(
    "Koordinatalarni sanang: bitta tekislik, ikkita o'q, uchtasi nuqta.",
    'Считай координаты: одна плоскость, две ось, три точка.',
    'Count the coordinates: one a plane, two an axis, three a point.',
  ),
  holds: [3000, 6000, 7000],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminlaringiz va mana qanday chiqdi. O'qgacha masofa besh, va boshdan tekislikkacha ikki.", 'Вот твои прогнозы и вот как оказалось. Расстояние до оси пять, а от начала до плоскости два.', 'Here are your guesses and here is how it turned out. The distance to the axis is five, and from the origin to the plane two.'),
    A('rule', "Va mana darsning umumiy fikri. Masofa har doim perpendikular bo'ylab o'lchanadi, va qiya kesma javob bo'lmaydi. Nechta koordinata ishlashini nimaga o'lchayotganingiz belgilaydi: tekislikka bitta, o'qqa ikkita, nuqtaga uchtasi. Ixtiyoriy tekislikkacha esa nuqtani tenglamaga qo'yib, normal uzunligiga bo'lamiz. Keyingi darsda blok yopiladi: almashtirishlar va o'xshashlik.", 'И вот общая мысль урока. Расстояние всегда измеряется по перпендикуляру, и наклонная ответом не бывает. Сколько координат участвует, определяет то, до чего измеряем: до плоскости одна, до оси две, до точки три. А до произвольной плоскости подставляем точку в уравнение и делим на длину нормали. На следующем уроке блок закрывается: преобразования и подобие.', 'And here is the shared thought of the lesson. A distance is always measured along the perpendicular, and a slant is never the answer. How many coordinates take part depends on what we measure to: a plane one, an axis two, a point three. For an arbitrary plane we substitute the point into the equation and divide by the normal length. Next lesson closes the block: transformations and similarity.'),
    A('q', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
