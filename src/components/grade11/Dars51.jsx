// ============================================================================
// 11-sinf, Dars 51. PLANIMETRIYA: SINOV DTM.
//
// B7 blokining birinchi darsi -- oxirgi blok, geometriyani takrorlash.
//   kontrakt: src/books/grade11/ETALON_11SINF.md, 1.2-band (DTM anatomiyasi)
//   asbob:    `PlaneBoard` (tekis chizma), `AnswerValue`, `Probe`
//   manba:    DARSLIKDA YO'Q. Planimetriya 7-9-sinflarda o'tiladi va
//             11-sinf darsligida bo'limi yo'q, DTM esa uni so'raydi.
//             Shuning uchun dars DTM kanoni bo'yicha yig'ilgan: Pifagor,
//             yuza, o'rta chiziq, ichki burchak, urinma, o'xshashlik.
//             Metodist qarori 2026-08-20 bilan bir xil naqsh: 38 va 39
//             darslar ham manbasiz yozilgan.
//
// DARSNING BITTA GAPI: planimetriyada javobni ko'rinish emas, MEZON beradi
// -- kvadratlar sinovi, yarim yig'indi, ikki barobar burchak, k kvadrat.
//
// SONLAR TEKSHIRILDI:
//   katetlar 6 va 8 -> gipotenuza 10;  gipotenuzaga balandlik 6·8/10 = 4,8
//   gipotenuzaga MEDIANA esa 5 -- xukdagi yolg'on javob shu
//   to'g'ri burchakli uchliklar: (3;4;5), (6;8;10), (5;12;13);  (5;6;7) EMAS
//   o'tmas burchakda c² > a² + b²  (5, 6, 10: 100 > 61)
//   diametrga tayangan ichki burchak 90°
//   yuza: yarim karra 6 karra 8 = 24
//   trapetsiya o'rta chizig'i (6 + 10) / 2 = 8;  yarim AYIRMA esa 2
//   markaziy 80° -> ichki 40°
//   o'xshashlik k = 3 -> yuza to'qqiz barobar: 5 · 9 = 45
//   urinma va radius orasidagi burchak 90°
//   r = 3: aylana uzunligi 6π, doira yuzasi 9π
//   audit: gipotenuza 10, kateti 6 -> ikkinchi kateti 8, chunki 100 − 36 = 64
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_51',
  title: L('Planimetriya: sinov DTM', 'Планиметрия: пробный ДТМ', 'Plane geometry: a mock exam'),
}

const BLOCK = { label: 'B7', from: 51, to: 56, current: 51 }

// DTM REJIMI. Etalon 1.2-bandi.
const MODE = 'dtm'

// ============================================================
// SLAYD 1. XUK. Balandlik va mediana: ikki javob.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Sinov DTM', 'Пробный ДТМ', 'Mock exam'),
  title: L('Gipotenuzaga tushgan chiziq', 'Линия к гипотенузе', 'The line to the hypotenuse'),
  expr: L('katetlar 6 va 8', 'катеты 6 и 8', 'legs 6 and 8'),
  rows: [
    {
      id: 'a',
      name: L('Karim', 'Карим', 'Karim'),
      value: '5',
    },
    {
      id: 'b',
      name: L('Nargiza', 'Наргиза', 'Nargiza'),
      value: '4,8',
    },
  ],
  probe: {
    question: L(
      'Gipotenuzaga tushgan BALANDLIK qancha?',
      'Чему равна ВЫСОТА к гипотенузе?',
      'What is the HEIGHT to the hypotenuse?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi masalalar boshlanadi.',
      'Твой ответ записан. Теперь начинаются задачи.',
      'Your answer is saved. Now the problems begin.',
    ),
    items: [
      { id: 'a', label: '4,8' },
      { id: 'b', label: '5' },
      { id: 'c', label: '7' },
      { id: 'd', label: '3,5' },
    ],
  },
  holds: [4200, 3200, 3600],
  audio: [
    A('mount', "Oxirgi blok boshlanadi: geometriyani takrorlaymiz. Bugun tekislikda.", 'Начинается последний блок: повторяем геометрию. Сегодня на плоскости.', 'The last block begins: we revise geometry. Today in the plane.'),
    A('r1', "Karim besh deb javob berdi.", 'Карим ответил пять.', 'Karim answered five.'),
    A('r2', "Nargiza esa to'rt butun sakkiz deb aytdi. Ikkisi ham gipotenuzaga tushgan chiziqni hisobladi, lekin chiziqlar boshqa.", 'А Наргиза сказала четыре и восемь. Оба посчитали линию к гипотенузе, но линии разные.', 'Nargiza said four point eight. Both computed a line to the hypotenuse, but the lines differ.'),
    A('ask', "Sizningcha balandlik qancha. Taxmin qiling.", 'Как думаешь, чему равна высота. Предположи.', 'What do you think the height is. Make a guess.'),
  ],
}

// ============================================================
// SLAYD 2. MASALA 1. Kvadratlar sinovi.
// ============================================================
const S2 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'pyth_check',
  eyebrow: L('Masala 1', 'Задача 1', 'Problem 1'),
  title: L('Qaysi uchlik to\'g\'ri burchakli', 'Какая тройка прямоугольная', 'Which triple is right-angled'),
  expr: L('mezon: kvadratlar', 'признак: квадраты', 'the criterion: the squares'),
  goal: L('to\'g\'ri burchakni topish', 'найти прямой угол', 'find the right angle'),
  rule: L(
    "Har uchlikda kvadratlarni solishtiramiz.",
    'В каждой тройке сравниваем квадраты.',
    'In each triple we compare the squares.',
  ),
  pick: L('Qaysi uchlikni tekshiramiz?', 'Какую тройку проверим?', 'Which triple shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('hammasi to\'g\'ri burchakli', 'все прямоугольные', 'all are right'), value: L('hammasi', 'все', 'all') },
    { id: 'b', key: 'inB', name: L('faqat kvadratlar mos kelsa', 'только если квадраты сходятся', 'only if the squares match'), value: L('uchtasi', 'три', 'three') },
  ],
  points: [
    {
      id: 'q1', label: '3, 4, 5', num: '9 + 16 = 25', step: 'calc', verdict: 'in',
      calc: L('kvadratlar mos keldi', 'квадраты сошлись', 'the squares match'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: '6, 8, 10', num: '36 + 64 = 100', step: 'calc', verdict: 'in',
      calc: L('bu uchlik ikki barobar', 'эта тройка вдвое больше', 'this triple is doubled'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q3', label: '5, 6, 7', num: '25 + 36 ≠ 49', step: 'calc', verdict: 'out',
      calc: L('oltmish bir, qirq to\'qqiz emas', 'шестьдесят один, а не сорок девять', 'sixty one, not forty nine'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q4', label: '5, 12, 13', num: '25 + 144 = 169', step: 'calc', verdict: 'in',
      calc: L('yana mos keldi', 'снова сошлись', 'they match again'),
      sol: true, inA: true, inB: true,
    },
  ],
  probe: {
    question: L(
      'To\'g\'ri burchakni nima aniqlaydi?',
      'Что определяет прямой угол?',
      'What decides a right angle?',
    ),
    items: [
      { id: 'b', label: L('kvadratlar tengligi', 'равенство квадратов', 'the equality of squares'), correct: true },
      { id: 'a', label: L('chizmaning ko\'rinishi', 'вид чертежа', 'how the drawing looks'), hint: L("Ko'rinish aldaydi: besh, olti, yetti uchligi ham to'g'ri burchakli ko'rinadi.", 'Вид обманывает: тройка пять, шесть, семь тоже выглядит прямоугольной.', 'The look deceives: the triple five, six, seven also looks right-angled.') },
      { id: 'c', label: L('butun sonlar', 'целые числа', 'whole numbers'), hint: L("Besh, olti, yetti butun, lekin uchburchak to'g'ri burchakli emas.", 'Пять, шесть, семь целые, а треугольник не прямоугольный.', 'Five, six, seven are whole, and the triangle is not right-angled.') },
      { id: 'd', label: L('eng katta tomon', 'самая большая сторона', 'the largest side'), hint: L("Eng katta tomon har uchburchakda bor, mezon esa uning KVADRATIDA.", 'Самая большая сторона есть в каждом треугольнике, а признак в её КВАДРАТЕ.', 'Every triangle has a largest side, and the criterion is in its SQUARE.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Birinchi masala. To'rtta uchlik, va ularni ko'z bilan emas, hisob bilan tekshiramiz.", 'Первая задача. Четыре тройки, и проверяем их не глазом, а счётом.', 'The first problem. Four triples, checked not by eye but by arithmetic.'),
    A('mount', "Uchlikni o'zingiz tanlaysiz.", 'Тройку выбираешь сам.', 'You choose the triple yourself.'),
    A('calc', 'Hisoblaymiz.', 'Считаем.', 'We compute.'),
    A('mark', "Mana natija. Uchta uchlikda kvadratlar mos keldi, bittasida esa yo'q. Beshning kvadrati plyus oltining kvadrati oltmish bir beradi, yettining kvadrati esa qirq to'qqiz. Demak bu uchburchakda to'g'ri burchak yo'q, garchi tomonlari butun bo'lsa ham va chizmada shunday ko'rinsa ham.", 'Вот результат. В трёх тройках квадраты сошлись, а в одной нет. Квадрат пяти плюс квадрат шести даёт шестьдесят один, а квадрат семи сорок девять. Значит в этом треугольнике прямого угла нет, хотя стороны целые и на чертеже так кажется.', 'Here is the result. In three triples the squares matched, in one they did not. Five squared plus six squared gives sixty one, and seven squared is forty nine. So that triangle has no right angle, although its sides are whole and the drawing suggests otherwise.'),
  ],
}

// ============================================================
// SLAYD 3. MASALA 2. O'tmas burchak: ishora.
// ============================================================
const S3 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'pyth_check',
  eyebrow: L('Masala 2', 'Задача 2', 'Problem 2'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    'Burchak O\'TMAS',
    'Угол ТУПОЙ',
    'The angle is OBTUSE',
  ),
  template: ['c²  ', { slot: 0 }, '  a² + b²'],
  signs: ['>', '<'],
  answer: '>',
  checkNote: L(
    '5, 6, 10 uchligini sinang: 100 va 61',
    'проверь тройку 5, 6, 10: сто и шестьдесят один',
    'try the triple 5, 6, 10: one hundred and sixty one',
  ),
  wrongs: [
    { key: '<', hint: L("Kichik bo'lsa burchak O'TKIR bo'lardi. O'tmas burchakda qarshi tomon UZUNROQ.", 'Если меньше, угол был бы ОСТРЫМ. У тупого угла противоположная сторона ДЛИННЕЕ.', 'If it were less, the angle would be ACUTE. An obtuse angle has a LONGER opposite side.') },
  ],
  probe: {
    question: L(
      'O\'tkir burchakda qanday bo\'ladi?',
      'А при остром угле?',
      'And for an acute angle?',
    ),
    items: [
      { id: 'a', label: 'c² < a² + b²', correct: true },
      { id: 'b', label: 'c² > a² + b²', hint: L("Bu o'tmas burchak, va biz uni allaqachon yozdik.", 'Это тупой угол, и его мы уже записали.', 'That is the obtuse case, already written.') },
      { id: 'c', label: 'c² = a² + b²', hint: L("Tenglik AYNAN to'g'ri burchakda bo'ladi.", 'Равенство бывает ИМЕННО при прямом угле.', 'Equality holds EXACTLY for a right angle.') },
      { id: 'd', label: L('aniqlab bo\'lmaydi', 'нельзя определить', 'cannot be decided'), hint: L("Aniqlanadi: uchta holat bor va uchtasi ham mezon beradi.", 'Определяется: есть три случая, и все три дают признак.', 'It can: there are three cases, and each gives a criterion.') },
    ],
  },
  audio: [
    A('mount', "Ikkinchi masala. Burchak o'tmas, ya'ni to'qsondan katta.", 'Вторая задача. Угол тупой, то есть больше девяноста.', 'The second problem. The angle is obtuse, more than ninety.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 4. MASALA 3. Chizma: diametrga tayangan burchak.
// ============================================================
const S4 = {
  role: 'graph',
  section: 'practice',
  tag: 'inscribed_angle',
  drag: false,
  graphSteps: 2,
  eyebrow: L('Masala 3', 'Задача 3', 'Problem 3'),
  title: L('Diametrga tayangan burchak', 'Угол, опирающийся на диаметр', 'The angle on a diameter'),
  chip: L('AB — diametr', 'AB — диаметр', 'AB is a diameter'),
  plane: {
    circles: [{ at: [0, 0], r: 3 }],
    pts: [
      { id: 'O', at: [0, 0], label: 'O', dy: 15 },
      { id: 'A', at: [-3, 0], label: 'A', dx: -13 },
      { id: 'B', at: [3, 0], label: 'B', dx: 13 },
      { id: 'C', at: [0.9, 2.86], label: 'C', dy: -12, showAt: 1 },
    ],
    segs: [
      // Diametrning yozuvi O ning yorlig'i ustiga tushardi: uni ovoz aytadi.
      { from: 'A', to: 'B', dash: '5 4', tone: 'dim' },
      { from: 'A', to: 'C', showAt: 1 },
      { from: 'C', to: 'B', showAt: 1 },
    ],
    angles: [{ at: 'C', from: 'A', to: 'B', right: true, tone: 'accent', showAt: 2 }],
    height: 210,
  },
  probe: {
    question: L(
      'Bu burchak qanchaga teng?',
      'Чему равен этот угол?',
      'What does this angle equal?',
    ),
    items: [
      { id: 'a', label: '90°', correct: true },
      { id: 'b', label: '60°', hint: L("Oltmish daraja muntazam uchburchakda bo'ladi, bu yerda esa diametr turadi.", 'Шестьдесят градусов бывает в правильном треугольнике, а здесь диаметр.', 'Sixty degrees belongs to an equilateral triangle, and here we have a diameter.') },
      { id: 'c', label: '180°', hint: L("Bir yuz sakson daraja yoyilgan burchak: uchlari bir chiziqda bo'lardi.", 'Сто восемьдесят это развёрнутый угол: вершины лежали бы на одной прямой.', 'One hundred eighty is a straight angle: the vertices would be on one line.') },
      { id: 'd', label: L('C nuqtaga bog\'liq', 'зависит от точки C', 'depends on the point C'), hint: L("C ni aylana bo'ylab suring: burchak o'zgarmaydi. Bu Fales teoremasi.", 'Подвигай C по окружности: угол не меняется. Это теорема Фалеса.', 'Slide C along the circle: the angle does not change. That is the Thales theorem.') },
    ],
  },
  holds: [4500, 5000],
  audio: [
    A('mount', "Uchinchi masala chizmada. Aylanada diametr o'tkazilgan.", 'Третья задача на чертеже. В окружности проведён диаметр.', 'The third problem is on a drawing. A diameter is drawn in the circle.'),
    A('mount', "Aylana ustidan uchinchi nuqta olamiz va uni diametrning uchlari bilan tutashtiramiz.", 'Берём третью точку на окружности и соединяем её с концами диаметра.', 'We take a third point on the circle and join it to the ends of the diameter.'),
    A('mount', "Qanday nuqta olsangiz ham, burchak bir xil chiqadi. Bu Fales teoremasi, va DTM da eng ko'p uchraydigan mezonlardan biri.", 'Какую точку ни возьми, угол выходит один и тот же. Это теорема Фалеса, и на ДТМ это один из самых частых признаков.', 'Whichever point you take, the angle comes out the same. That is the Thales theorem, one of the most frequent criteria on the exam.'),
  ],
}

// Zanjir amallari: ikki masalaning amallari bir ro'yxatda.
const ACTIONS_51 = [
  { id: 'pyth', label: L('Pifagor bilan tekshirish', 'проверить по Пифагору', 'check by Pythagoras') },
  { id: 'legs', label: L('katetlarni ajratish', 'выделить катеты', 'pick out the legs') },
  { id: 'area', label: L('yuzani hisoblash', 'посчитать площадь', 'compute the area') },
  { id: 'ratio', label: L('koeffitsiyentni topish', 'найти коэффициент', 'find the ratio') },
  { id: 'square', label: L('koeffitsiyentni kvadratga', 'возвести коэффициент в квадрат', 'square the ratio') },
]

// ============================================================
// SLAYD 5. MASALA 4. Zanjir: yuza.
// ============================================================
const S5 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'height_vs_median',
  noLine: true,
  eyebrow: L('Masala 4', 'Задача 4', 'Problem 4'),
  title: L('Yuzani toping', 'Найди площадь', 'Find the area'),
  start: L('tomonlari 6, 8, 10', 'стороны 6, 8, 10', 'sides 6, 8, 10'),
  actions: ACTIONS_51,
  steps: [
    {
      action: 'pyth',
      to: '36 + 64 = 100',
      wrongs: [
        { action: 'area', hint: L("Yuza uchun avval qaysi tomonlar katet ekanini bilish kerak.", 'Для площади сначала надо знать, какие стороны катеты.', 'For the area we must first know which sides are the legs.') },
        { action: 'ratio', hint: L("Koeffitsiyent o'xshashlik masalasida kerak bo'ladi.", 'Коэффициент понадобится в задаче о подобии.', 'The ratio will be needed in the similarity problem.') },
        { action: 'square', hint: L("Kvadratga ko'tarish ham o'xshashlikda kerak.", 'Возведение в квадрат тоже нужно в подобии.', 'Squaring is also for the similarity problem.') },
      ],
    },
    {
      action: 'legs',
      to: '6, 8',
      wrongs: [
        { action: 'pyth', hint: L("Tekshiruv o'tdi: uchburchak to'g'ri burchakli.", 'Проверка прошла: треугольник прямоугольный.', 'The check passed: the triangle is right-angled.') },
        { action: 'area', hint: L("Yuza formulasiga ikkita katet kerak, ular hali ajratilmagan.", 'Формуле площади нужны два катета, а они ещё не выделены.', 'The area formula needs the two legs, and they are not picked out yet.') },
      ],
    },
    {
      action: 'area',
      to: '24',
      wrongs: [
        { action: 'legs', hint: L("Katetlar ajratildi: olti va sakkiz.", 'Катеты выделены: шесть и восемь.', 'The legs are picked out: six and eight.') },
        { action: 'square', hint: L("Kvadratga ko'tarish bu masalada kerak emas.", 'Возводить в квадрат в этой задаче не нужно.', 'No squaring needed in this problem.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['24', '48', '30', '40'],
    value: ['24'],
    label: 'S =',
    prompt: L('Yuzani yozing', 'Запиши площадь', 'Write the area'),
    wrongs: [
      { key: '48', hint: L("Yarimga bo'linmagan: yuza katetlar ko'paytmasining YARMI.", 'Не поделено на два: площадь это ПОЛОВИНА произведения катетов.', 'Not halved: the area is HALF the product of the legs.') },
      { key: '30', hint: L("O'ttiz bu gipotenuza bilan olingan ko'paytma yarmi, gipotenuza esa balandlik emas.", 'Тридцать это половина произведения с гипотенузой, а гипотенуза не высота.', 'Thirty is half a product with the hypotenuse, and the hypotenuse is not a height.') },
      { key: '40', hint: L("Qirq bu sakkiz karra o'n ning yarmi: gipotenuza katet o'rniga olingan.", 'Сорок это половина восьми на десять: гипотенуза взята вместо катета.', 'Forty is half of eight times ten: the hypotenuse was used as a leg.') },
      { key: '*', hint: L("Yarim karra olti karra sakkiz yigirma to'rt beradi.", 'Половина на шесть на восемь даёт двадцать четыре.', 'A half times six times eight gives twenty four.') },
    ],
  },
  audio: [
    A('mount', "To'rtinchi masala. Ro'yxatda o'xshashlik masalasining amallari ham bor.", 'Четвёртая задача. В списке есть и действия задачи о подобии.', 'The fourth problem. The list also holds actions of the similarity problem.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 6. MASALA 5. Trapetsiyaning o'rta chizig'i.
// ============================================================
const S6 = {
  role: 'twoway',
  section: 'practice',
  tag: 'mid_line',
  eyebrow: L('Masala 5', 'Задача 5', 'Problem 5'),
  title: L('O\'rta chiziq', 'Средняя линия', 'The middle line'),
  expr: L('asoslari 6 va 10', 'основания 6 и 10', 'the bases 6 and 10'),
  need: L('o\'rta chiziq', 'средняя линия', 'the middle line'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('yarim ayirmani oldi', 'взял полуразность', 'took the half difference'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '2',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('yarim yig\'indini oldi', 'взяла полусумму', 'took the half sum'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '8',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['8', '2', '4', '16'],
    value: ['8'],
    label: 'm =',
    prompt: L('O\'rta chiziqni yozing', 'Запиши среднюю линию', 'Write the middle line'),
    wrongs: [
      { key: '2', hint: L("Yarim ayirma o'rta chiziq emas: o'rta chiziq ikki asos ORASIDA bo'lishi kerak.", 'Полуразность это не средняя линия: средняя линия должна лежать МЕЖДУ основаниями.', 'A half difference is not the middle line: the middle line must lie BETWEEN the bases.') },
      { key: '4', hint: L("To'rt ham asoslar orasida emas: oltidan kichik.", 'Четыре тоже не между основаниями: меньше шести.', 'Four is not between the bases either: it is less than six.') },
      { key: '16', hint: L("O'n olti yig'indi, ikkiga bo'linmagan.", 'Шестнадцать это сумма, не поделённая на два.', 'Sixteen is the sum, not halved.') },
      { key: '*', hint: L("Olti plyus o'n bo'lingan ikki sakkiz beradi, va sakkiz olti bilan o'n orasida.", 'Шесть плюс десять делить на два даёт восемь, и восемь лежит между шестью и десятью.', 'Six plus ten over two gives eight, and eight lies between six and ten.') },
    ],
  },
  holds: [4200, 3600, 5000],
  audio: [
    A('mount', "Beshinchi masala. Ikki o'quvchi bir formulani boshqacha esladi.", 'Пятая задача. Два ученика вспомнили формулу по-разному.', 'The fifth problem. Two students remembered the formula differently.'),
    A('p1', "Aziz yarim ayirmani oldi va ikki chiqdi.", 'Азиз взял полуразность и получил два.', 'Aziz took the half difference and got two.'),
    A('p2', "Dilnoza esa yarim yig'indini oldi. Uning javobi sakkiz, va bu son ikki asos orasida turadi. Tekshiruv oson: o'rta chiziq asoslardan biridan kichik va ikkinchisidan katta bo'lishi kerak.", 'А Дилноза взяла полусумму. Её ответ восемь, и это число лежит между основаниями. Проверка простая: средняя линия должна быть больше одного основания и меньше другого.', 'Dilnoza took the half sum. Her answer is eight, and that number lies between the bases. The check is easy: the middle line must be larger than one base and smaller than the other.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 7. MASALA 6. Ichki va markaziy burchak.
// ============================================================
const S7 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'inscribed_angle',
  eyebrow: L('Masala 6', 'Задача 6', 'Problem 6'),
  title: L('Ichki burchak qancha', 'Каков вписанный угол', 'What is the inscribed angle'),
  expr: L('markaziy burchak 80°', 'центральный угол 80°', 'the central angle is 80°'),
  goal: L('ichki burchakni topish', 'найти вписанный угол', 'find the inscribed angle'),
  rule: L(
    "Har javobni markaziy burchak bilan solishtiramiz.",
    'Каждый ответ сравниваем с центральным углом.',
    'We compare each answer with the central angle.',
  ),
  pick: L('Qaysi javobni tekshiramiz?', 'Какой ответ проверим?', 'Which answer shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('ichki = markaziy', 'вписанный = центральный', 'inscribed = central'), value: '80°' },
    { id: 'b', key: 'inB', name: L('ichki = yarmi', 'вписанный = половина', 'inscribed = a half'), value: '40°' },
  ],
  points: [
    {
      id: 'q1', label: '80°', num: L('markaziyning o\'zi', 'сам центральный', 'the central itself'), step: 'calc', verdict: 'out',
      calc: L('ikki barobar katta', 'вдвое больше', 'twice too large'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q2', label: '40°', num: L('markaziyning yarmi', 'половина центрального', 'half the central'), step: 'calc', verdict: 'in',
      calc: L('mezon shunday', 'признак таков', 'that is the criterion'),
      sol: true, inA: false, inB: true,
    },
    {
      id: 'q3', label: '160°', num: L('ikki barobar', 'вдвое', 'doubled'), step: 'calc', verdict: 'out',
      calc: L('teskari tomonga', 'в обратную сторону', 'the wrong way round'),
      sol: false, inA: false, inB: false,
    },
    {
      id: 'q4', label: '20°', num: L('to\'rtdan bir', 'четверть', 'a quarter'), step: 'calc', verdict: 'out',
      calc: L('ikki marta bo\'lingan', 'поделено дважды', 'halved twice'),
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L(
      'Ichki burchak markaziydan qanday farq qiladi?',
      'Чем вписанный угол отличается от центрального?',
      'How does an inscribed angle differ from a central one?',
    ),
    items: [
      { id: 'b', label: L('ikki barobar kichik', 'вдвое меньше', 'twice smaller'), correct: true },
      { id: 'a', label: L('teng', 'равен', 'equal'), hint: L("Teng bo'lsa, diametrga tayangan burchak yuz sakson daraja bo'lardi.", 'Если бы равен, угол на диаметре был бы сто восемьдесят.', 'If equal, the angle on a diameter would be one hundred eighty.') },
      { id: 'c', label: L('ikki barobar katta', 'вдвое больше', 'twice larger'), hint: L("Katta bo'lsa, diametrda uch yuz oltmish chiqardi.", 'Если бы больше, на диаметре вышло бы триста шестьдесят.', 'If larger, a diameter would give three hundred sixty.') },
      { id: 'd', label: L('bog\'liq emas', 'не связаны', 'unrelated'), hint: L("Bog'liq: bitta yoyga tayangan ikki burchak har doim ikki barobar farq qiladi.", 'Связаны: два угла на одной дуге всегда различаются вдвое.', 'They are linked: two angles on the same arc always differ by a factor of two.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Oltinchi masala. Markaziy burchak berilgan, ichki burchak esa so'ralgan.", 'Шестая задача. Дан центральный угол, а спрашивают вписанный.', 'The sixth problem. The central angle is given, the inscribed one is asked.'),
    A('mount', "Javobni o'zingiz tanlaysiz.", 'Ответ выбираешь сам.', 'You choose the answer yourself.'),
    A('calc', 'Solishtiramiz.', 'Сравниваем.', 'We compare.'),
    A('mark', "Mana natija. Faqat qirq daraja mezonga mos keladi: bitta yoyga tayangan ichki burchak markaziyning yarmiga teng. Shu mezonni oldingi ekranda ham ko'rgan edik: diametr yuz sakson daraja markaziy burchak beradi, ichki burchak esa to'qsonga teng chiqadi.", 'Вот результат. Признаку отвечают только сорок градусов: вписанный угол на той же дуге равен половине центрального. Этот признак мы видели и на прошлом экране: диаметр даёт центральный угол сто восемьдесят, а вписанный выходит девяносто.', 'Here is the result. Only forty degrees fits the criterion: an inscribed angle on the same arc is half the central one. We saw that criterion on the previous screen: a diameter gives a central angle of one hundred eighty, and the inscribed one comes out ninety.'),
  ],
}

// ============================================================
// SLAYD 8. MASALA 7. Mustaqil: o'xshashlik va yuza.
// ============================================================
const S8 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'similar_area',
  noLine: true,
  solo: true,
  eyebrow: L('Masala 7', 'Задача 7', 'Problem 7'),
  title: L('Imtihondagidek', 'Как на экзамене', 'As on the exam'),
  start: L('o\'xshash, k = 3, kichigining yuzasi 5', 'подобны, k = 3, площадь меньшего 5', 'similar, k = 3, smaller area 5'),
  actions: ACTIONS_51,
  hint: L(
    "Uzunlik k marta, yuza esa boshqacha o'sadi.",
    'Длина в k раз, а площадь растёт иначе.',
    'A length grows k times, an area grows differently.',
  ),
  steps: [
    {
      action: 'ratio',
      to: 'k = 3',
      wrongs: [
        { action: 'area', hint: L("Yuza uchun avval koeffitsiyent kerak.", 'Для площади сначала нужен коэффициент.', 'For the area the ratio comes first.') },
        { action: 'pyth', hint: L("Pifagor bu masalada kerak emas.", 'Пифагор в этой задаче не нужен.', 'No Pythagoras in this problem.') },
        { action: 'legs', hint: L("Katetlar berilmagan: gap yuzalar haqida.", 'Катеты не даны: речь о площадях.', 'No legs are given: this is about areas.') },
      ],
    },
    {
      action: 'square',
      to: 'k² = 9',
      wrongs: [
        { action: 'ratio', hint: L("Koeffitsiyent topildi: uch.", 'Коэффициент найден: три.', 'The ratio is found: three.') },
        { action: 'area', hint: L("Ko'paytirishdan oldin nechaga ko'paytirishni bilish kerak.", 'Прежде чем умножать, надо знать, на что.', 'Before multiplying we must know by what.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['45', '15', '30', '5'],
    value: ['45'],
    label: 'S =',
    prompt: L('Katta yuzani yozing', 'Запиши большую площадь', 'Write the larger area'),
    wrongs: [
      { key: '15', hint: L("Uchga ko'paytirilgan: bu UZUNLIK qoidasi. Yuza k kvadratga ko'payadi.", 'Умножено на три: это правило ДЛИНЫ. Площадь умножается на k в квадрате.', 'Multiplied by three: that is the LENGTH rule. An area multiplies by k squared.') },
      { key: '30', hint: L("Olti barobar hech qanday qoidada yo'q: k kvadrat to'qqizga teng.", 'Шестикратного нет ни в одном правиле: k в квадрате равно девяти.', 'No rule gives six times: k squared is nine.') },
      { key: '5', hint: L("Bu kichik figuraning yuzasi, katta esa to'qqiz barobar.", 'Это площадь меньшей фигуры, а большая в девять раз.', 'That is the smaller area, and the larger is nine times it.') },
      { key: '*', hint: L("Besh karra to'qqiz qirq besh beradi.", 'Пять на девять даёт сорок пять.', 'Five times nine gives forty five.') },
    ],
  },
  audio: [
    A('mount', "Yettinchi masala mustaqil, imtihondagidek.", 'Седьмая задача самостоятельная, как на экзамене.', 'The seventh problem is on your own, as on the exam.'),
    A('step3', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 9. MASALA 8. Urinma va radius.
// ============================================================
const S9 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'tangent_radius',
  eyebrow: L('Masala 8', 'Задача 8', 'Problem 8'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    'Urinma va radius',
    'Касательная и радиус',
    'A tangent and a radius',
  ),
  template: [L('burchak  ', 'угол  ', 'the angle  '), { slot: 0 }, '  90°'],
  signs: ['=', '<'],
  answer: '=',
  checkNote: L(
    'urinma aylanaga faqat bitta nuqtada tegadi',
    'касательная касается окружности только в одной точке',
    'a tangent meets the circle at exactly one point',
  ),
  wrongs: [
    { key: '<', hint: L("Kichik bo'lsa, chiziq aylanani IKKI nuqtada kesib o'tardi, ya'ni kesuvchi bo'lardi.", 'Если бы меньше, линия пересекла бы окружность в ДВУХ точках, то есть была бы секущей.', 'If it were less, the line would cut the circle at TWO points, so it would be a secant.') },
  ],
  probe: {
    question: L(
      'Urinma nechta nuqtada tegadi?',
      'Сколько точек у касательной с окружностью?',
      'How many points does a tangent share with the circle?',
    ),
    items: [
      { id: 'a', label: L('bitta', 'одна', 'one'), correct: true },
      { id: 'b', label: L('ikkita', 'две', 'two'), hint: L("Ikkita nuqta KESUVCHIda bo'ladi.", 'Две точки бывают у СЕКУЩЕЙ.', 'Two points belong to a SECANT.') },
      { id: 'c', label: L('bitta ham yo\'q', 'ни одной', 'none'), hint: L("Umumiy nuqta yo'q bo'lsa, chiziq aylanadan uzoqda.", 'Если общих точек нет, линия проходит мимо окружности.', 'With no shared point the line misses the circle.') },
      { id: 'd', label: L('cheksiz ko\'p', 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p nuqta faqat aylananing o'zida bo'ladi, to'g'ri chiziqda emas.", 'Бесконечно много точек только у самой окружности, а не у прямой.', 'Infinitely many points belong to the circle itself, not to a line.') },
    ],
  },
  audio: [
    A('mount', "Sakkizinchi masala. Urinma va urinish nuqtasiga o'tkazilgan radius.", 'Восьмая задача. Касательная и радиус, проведённый в точку касания.', 'The eighth problem. A tangent and the radius drawn to the point of contact.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 10. MASALA 9. Teskari masala: aylana va doira.
// ============================================================
const S10 = {
  role: 'build',
  section: 'practice',
  led: 'student',
  tag: 'circle_len_vs_area',
  right: '2/2',
  eyebrow: L('Masala 9', 'Задача 9', 'Problem 9'),
  title: L('Formulani yig\'ing', 'Собери формулу', 'Build the formula'),
  targetLabel: L('Radius', 'Радиус', 'The radius'),
  targetValue: 'r',
  tasks: [
    {
      prompt: L('Aylananing uzunligi', 'Длина окружности', 'The circumference'),
      template: ['C = ', { slot: 0 }, ' π ', { slot: 1 }],
      parts: ['2', 'r', 'r²', '4'],
      answer: ['2', 'r'],
      doneLabel: 'C = 2 π r',
      wrongs: [
        { key: '2|r²', hint: L("Kvadrat YUZAda turadi, uzunlikda esa radius birinchi darajada.", 'Квадрат стоит в ПЛОЩАДИ, а в длине радиус в первой степени.', 'The square belongs to the AREA, in the length the radius is to the first power.') },
        { key: '4|r', hint: L("To'rt bu sfera sirtida uchraydi.", 'Четвёрка встречается в поверхности сферы.', 'The four appears in the surface of a sphere.') },
        { key: '*', hint: L("Uzunlik ikki pi radiusga teng.", 'Длина равна два пи радиус.', 'The circumference equals two pi r.') },
      ],
    },
    {
      prompt: L('Doiraning yuzasi', 'Площадь круга', 'The area of a disc'),
      template: ['S = π ', { slot: 0 }],
      parts: ['r²', 'r', '2r', 'r³'],
      answer: ['r²'],
      doneLabel: 'S = π r²',
      wrongs: [
        { key: 'r', hint: L("Birinchi daraja UZUNLIKni beradi, yuza esa kvadratni talab qiladi.", 'Первая степень даёт ДЛИНУ, а площадь требует квадрата.', 'The first power gives the LENGTH, an area needs a square.') },
        { key: 'r³', hint: L("Kub HAJMda uchraydi.", 'Куб встречается в ОБЪЁМЕ.', 'A cube appears in a VOLUME.') },
        { key: '*', hint: L("Yuza pi radius kvadratga teng.", 'Площадь равна пи эр квадрат.', 'The area equals pi r squared.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'qqizinchi masala teskari: formulani o'zingiz yig'asiz. Ikki formula juft bo'lib yodlanadi va shu sababli almashib ketadi.", 'Девятая задача обратная: формулу собираешь сам. Две формулы запоминают парой, и поэтому их путают.', 'The ninth problem is reverse: you build the formula. The two formulas are learned as a pair, and that is why they get swapped.'),
    A('built1', "Endi ikkinchisi.", 'Теперь вторая.', 'Now the second.'),
  ],
}

// ============================================================
// SLAYD 11. MASALA 10. Uzunlik va yuza sonlarda.
// ============================================================
const S11 = {
  role: 'twoway',
  section: 'practice',
  tag: 'circle_len_vs_area',
  eyebrow: L('Masala 10', 'Задача 10', 'Problem 10'),
  title: L('Doira yuzasi qancha', 'Какова площадь круга', 'What is the area of the disc'),
  expr: 'r = 3',
  need: L('yuza, uzunlik emas', 'площадь, не длина', 'the area, not the length'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('uzunlik formulasini oldi', 'взял формулу длины', 'took the length formula'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '6π',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('yuza formulasini oldi', 'взяла формулу площади', 'took the area formula'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '9π',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['9π', '6π', '3π', '18π'],
    value: ['9π'],
    label: 'S =',
    prompt: L('Yuzani yozing', 'Запиши площадь', 'Write the area'),
    wrongs: [
      { key: '6π', hint: L("Bu UZUNLIK: ikki pi karra uch. Yuzada radius kvadratga ko'tariladi.", 'Это ДЛИНА: два пи на три. В площади радиус возводится в квадрат.', 'That is the LENGTH: two pi times three. In the area the radius is squared.') },
      { key: '3π', hint: L("Uch pi bu pi karra radius, formulada esa radius kvadrati.", 'Три пи это пи на радиус, а в формуле квадрат радиуса.', 'Three pi is pi times the radius, and the formula has the radius squared.') },
      { key: '18π', hint: L("O'n sakkiz pi ikki barobar ko'p: ikkiga ko'paytirish uzunlikda edi.", 'Восемнадцать пи вдвое больше: умножение на два было в длине.', 'Eighteen pi is twice too much: multiplying by two belonged to the length.') },
      { key: '*', hint: L("Pi karra uch kvadrat to'qqiz pi beradi.", 'Пи на три в квадрате даёт девять пи.', 'Pi times three squared gives nine pi.') },
    ],
  },
  holds: [4200, 3600, 5200],
  audio: [
    A('mount', "O'ninchi masala, oxirgisi. Radius uchga teng.", 'Десятая задача, последняя. Радиус равен трём.', 'The tenth problem, the last. The radius is three.'),
    A('p1', "Aziz uzunlik formulasini oldi va olti pi chiqardi.", 'Азиз взял формулу длины и получил шесть пи.', 'Aziz took the length formula and got six pi.'),
    A('p2', "Dilnoza esa yuza formulasini oldi. Uning javobi to'qqiz pi. Ikkisini ajratish oson: yuzada radius KVADRATGA ko'tariladi, va o'lchov birligi ham kvadrat bo'ladi.", 'А Дилноза взяла формулу площади. Её ответ девять пи. Различить их легко: в площади радиус возводится в КВАДРАТ, и единица измерения тоже квадратная.', 'Dilnoza took the area formula. Her answer is nine pi. Telling them apart is easy: in the area the radius is SQUARED, and the unit is squared too.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
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
      id: 'b1', tag: 'pyth_check', ask: true, cols: 2,
      done: '15',
      prompt: L('Katetlari 9 va 12. Gipotenuza?', 'Катеты 9 и 12. Гипотенуза?', 'Legs 9 and 12. The hypotenuse?'),
      items: [
        { id: 'a', label: '15', correct: true },
        { id: 'b', label: '21', hint: L("Yigirma bir bu tomonlar yig'indisi, gipotenuza esa kvadratlardan chiqadi.", 'Двадцать один это сумма сторон, а гипотенуза выходит из квадратов.', 'Twenty one is the sum of the sides, the hypotenuse comes from the squares.') },
        { id: 'c', label: '13', hint: L("O'n uch besh va o'n ikki uchligida bo'ladi.", 'Тринадцать бывает в тройке пять и двенадцать.', 'Thirteen belongs to the triple five and twelve.') },
        { id: 'd', label: '11', hint: L("O'n bir kvadratga ko'tarilsa yuz yigirma bir, kerak esa ikki yuz yigirma besh.", 'Одиннадцать в квадрате сто двадцать один, а нужно двести двадцать пять.', 'Eleven squared is one hundred twenty one, and we need two hundred twenty five.') },
      ],
    },
    {
      id: 'b2', tag: 'height_vs_median', ask: true, cols: 2,
      done: '6',
      prompt: L('Gipotenuza 12. Unga tushgan mediana?', 'Гипотенуза 12. Медиана к ней?', 'The hypotenuse is 12. The median to it?'),
      items: [
        { id: 'a', label: '6', correct: true },
        { id: 'b', label: '12', hint: L("Mediana gipotenuzaning YARMIGA teng.", 'Медиана равна ПОЛОВИНЕ гипотенузы.', 'The median equals HALF the hypotenuse.') },
        { id: 'c', label: '4', hint: L("Uchga bo'linmaydi: mediana yarmini beradi.", 'На три не делят: медиана даёт половину.', 'No dividing by three: the median gives a half.') },
        { id: 'd', label: '24', hint: L("Ikkiga ko'paytirilgan, aslida bo'linishi kerak edi.", 'Умножено на два, а надо было поделить.', 'Multiplied by two, but it had to be divided.') },
      ],
    },
    {
      id: 'b3', tag: 'mid_line', ask: true, cols: 2,
      done: '7',
      prompt: L('Uchburchak tomoni 14. O\'rta chiziq?', 'Сторона треугольника 14. Средняя линия?', 'A triangle side is 14. The middle line?'),
      items: [
        { id: 'a', label: '7', correct: true },
        { id: 'b', label: '14', hint: L("O'rta chiziq tomonning yarmiga teng.", 'Средняя линия равна половине стороны.', 'The middle line is half the side.') },
        { id: 'c', label: '28', hint: L("Ikkiga ko'paytirilgan.", 'Умножено на два.', 'Multiplied by two.') },
        { id: 'd', label: '4,7', hint: L("Uchga bo'linmaydi: ikkiga bo'linadi.", 'На три не делят: делят на два.', 'No dividing by three: divide by two.') },
      ],
    },
    {
      id: 'b4', tag: 'inscribed_angle', ask: true, cols: 2,
      done: '30°',
      prompt: L('Markaziy burchak 60°. Ichki burchak?', 'Центральный угол 60°. Вписанный?', 'The central angle is 60°. The inscribed one?'),
      items: [
        { id: 'a', label: '30°', correct: true },
        { id: 'b', label: '60°', hint: L("Ichki burchak markaziyning yarmi.", 'Вписанный это половина центрального.', 'The inscribed one is half the central.') },
        { id: 'c', label: '120°', hint: L("Ikki barobar katta emas, ikki barobar kichik.", 'Не вдвое больше, а вдвое меньше.', 'Not twice larger but twice smaller.') },
        { id: 'd', label: '90°', hint: L("To'qson daraja diametrga tayangan burchakda bo'ladi.", 'Девяносто бывает у угла на диаметре.', 'Ninety belongs to the angle on a diameter.') },
      ],
    },
    {
      id: 'b5', tag: 'similar_area', ask: true, cols: 2,
      done: '4',
      prompt: L('k = 2 bo\'lsa, yuza necha barobar?', 'Если k = 2, во сколько раз площадь?', 'If k = 2, how many times the area?'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '2', hint: L("Ikki barobar UZUNLIK o'sadi, yuza esa kvadratga.", 'Вдвое растёт ДЛИНА, а площадь в квадрате.', 'A LENGTH grows twice, an area by the square.') },
        { id: 'c', label: '8', hint: L("Sakkiz barobar HAJM o'sadi.", 'В восемь раз растёт ОБЪЁМ.', 'A VOLUME grows eight times.') },
        { id: 'd', label: '16', hint: L("O'n olti bu k ning to'rtinchi darajasi, yuzada esa kvadrat.", 'Шестнадцать это k в четвёртой, а в площади квадрат.', 'Sixteen is k to the fourth, and an area needs the square.') },
      ],
    },
    {
      id: 'b6', tag: 'tangent_radius', ask: true, cols: 2,
      done: '90°',
      prompt: L('Urinma va radius orasidagi burchak?', 'Угол между касательной и радиусом?', 'The angle between a tangent and the radius?'),
      items: [
        { id: 'a', label: '90°', correct: true },
        { id: 'b', label: '45°', hint: L("Qirq besh daraja kvadrat diagonalida uchraydi.", 'Сорок пять встречается у диагонали квадрата.', 'Forty five belongs to the diagonal of a square.') },
        { id: 'c', label: '180°', hint: L("Yuz sakson daraja yoyilgan burchak, ya'ni to'g'ri chiziq.", 'Сто восемьдесят это развёрнутый угол, то есть прямая.', 'One hundred eighty is a straight angle, that is a line.') },
        { id: 'd', label: L('radiusga bog\'liq', 'зависит от радиуса', 'depends on the radius'), hint: L("Radius uzunligi burchakni o'zgartirmaydi.", 'Длина радиуса угол не меняет.', 'The length of the radius does not change the angle.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits. Oltita savol, va faqat shu ekran natijaga kiradi.", 'Блиц. Шесть вопросов, и только этот экран идёт в результат.', 'Quick round. Six questions, and only this screen counts.'),
  ],
}

// ============================================================
// SLAYD 13. XATONI TOPING. Gipotenuza katet o'rniga olingan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'pyth_check',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Bir satr xato', 'Одна строка неверна', 'One line is wrong'),
  rows: [
    { id: 'r1', text: L('gipotenuza 10, kateti 6', 'гипотенуза 10, катет 6', 'hypotenuse 10, leg 6') },
    { id: 'r2', text: '10² + 6² = 136' },
    { id: 'r3', text: '√136 ≈ 11,7' },
    { id: 'r4', text: L('javob: ikkinchi kateti 11,7', 'ответ: второй катет 11,7', 'answer: the second leg is 11,7') },
    { id: 'r5', text: L('tekshiruv: yo\'q', 'проверка: нет', 'check: none') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r3: L("Ildiz to'g'ri olingan: bir yuz o'ttiz oltidan taxminan o'n bir butun yetti chiqadi.", 'Корень взят верно: из ста тридцати шести примерно одиннадцать и семь.', 'The root is right: from one hundred thirty six about eleven point seven.'),
    r4: L("Bu satr faqat oldingi natijani ko'chiradi.", 'Эта строка только переписывает предыдущий результат.', 'This line only copies the previous result.'),
    r5: L("Tekshiruv yo'qligi yomon, lekin xato undan yuqorida.", 'Отсутствие проверки плохо, но ошибка выше.', 'The missing check is bad, but the error is above.'),
  },
  proofPoint: L('gipotenuza qo\'shilmaydi, ayiriladi', 'гипотенузу не прибавляют, а вычитают', 'the hypotenuse is subtracted, not added'),
  proof: L(
    "Yuzdan o'ttiz oltini AYIRISH kerak: oltmish to'rt, ildizi sakkiz.",
    'Надо ВЫЧЕСТЬ: сто минус тридцать шесть, шестьдесят четыре, корень восемь.',
    'It must be SUBTRACTED: one hundred minus thirty six, sixty four, root eight.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('qo\'shilgan, ayirish kerak edi', 'сложено вместо вычитания', 'added instead of subtracted'), correct: true },
      { id: 'b', label: L('ildiz xato olingan', 'корень взят неверно', 'the root is wrong'), hint: L("Ildiz to'g'ri: xato undan oldin, yozuvda.", 'Корень верен: ошибка раньше, в записи.', 'The root is right: the error is earlier, in the record.') },
      { id: 'c', label: L('kateti xato berilgan', 'катет дан неверно', 'the leg is given wrong'), hint: L("Shart o'zi xato bo'lolmaydi: olti gipotenuzadan kichik.", 'Условие само неверным быть не может: шесть меньше гипотенузы.', 'The problem itself cannot be wrong: six is less than the hypotenuse.') },
      { id: 'd', label: L('javob to\'g\'ri', 'ответ верный', 'the answer is right'), hint: L("Javob o'n bir butun yetti gipotenuzadan KATTA, va bu mumkin emas.", 'Ответ одиннадцать и семь БОЛЬШЕ гипотенузы, а это невозможно.', 'The answer eleven point seven is LARGER than the hypotenuse, which is impossible.') },
    ],
  },
  audio: [
    A('mount', "Masalalar tugadi. Endi boshqaning yechimiga qaraymiz.", 'Задачи закончились. Теперь посмотрим на чужое решение.', 'The problems are done. Now let us look at someone else solution.'),
    A('q1', "Diqqat: hisoblar to'g'ri bajarilgan. Xato yozuvda.", 'Внимание: вычисления выполнены верно. Ошибка в записи.', 'Careful: the computations are right. The error is in the record.'),
    A('proof', "Qarang: Pifagor teoremasida gipotenuza kvadrati katetlar kvadratlarining yig'indisiga teng. Bu yechimda gipotenuza katet bilan QO'SHILGAN, ya'ni teorema teskari ishlatilgan. To'g'risi yuz minus o'ttiz olti, oltmish to'rt, va ildizi sakkiz. Tekshiruvning eng oson yo'li: katet gipotenuzadan uzun bo'lolmaydi, va o'n bir butun yetti o'ndan katta chiqqan.", 'Смотри: в теореме Пифагора квадрат гипотенузы равен сумме квадратов катетов. В этом решении гипотенузу СЛОЖИЛИ с катетом, то есть применили теорему наоборот. Верно сто минус тридцать шесть, шестьдесят четыре, и корень восемь. Самый простой способ проверки: катет не может быть длиннее гипотенузы, а одиннадцать и семь больше десяти.', 'Look: in the Pythagoras theorem the square of the hypotenuse equals the sum of the squares of the legs. This solution ADDED the hypotenuse to a leg, using the theorem backwards. Correctly it is one hundred minus thirty six, sixty four, and the root is eight. The simplest check: a leg cannot exceed the hypotenuse, and eleven point seven is more than ten.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA: trapetsiya yuzasi.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'mid_line',
  right: '2/2',
  eyebrow: L('Teskari masala', 'Обратная задача', 'The reverse task'),
  title: L('Yuzani yig\'ing', 'Собери площадь', 'Build the area'),
  targetLabel: L('Trapetsiya', 'Трапеция', 'The trapezoid'),
  targetValue: L('asoslar a va b, balandlik h', 'основания a и b, высота h', 'bases a and b, height h'),
  tasks: [
    {
      prompt: L('Formulani yig\'ing', 'Собери формулу', 'Build the formula'),
      template: ['S = ', { slot: 0 }, ' · ', { slot: 1 }],
      parts: ['(a + b) / 2', '(a − b) / 2', 'h', 'a · b'],
      answer: ['(a + b) / 2', 'h'],
      doneLabel: 'S = (a + b) / 2 · h',
      wrongs: [
        { key: '(a − b) / 2|h', hint: L("Yarim ayirma o'rta chiziq emas, va yuzada ham u ishlatilmaydi.", 'Полуразность это не средняя линия, и в площади она не используется.', 'A half difference is not the middle line, and it is not used in the area.') },
        { key: '(a + b) / 2|a · b', hint: L("Ikkinchi ko'paytuvchi BALANDLIK: yuzada balandlik har doim bor.", 'Второй множитель ВЫСОТА: в площади высота есть всегда.', 'The second factor is the HEIGHT: an area always has a height.') },
        { key: '*', hint: L("Yuza o'rta chiziq karra balandlikka teng.", 'Площадь равна средней линии на высоту.', 'The area equals the middle line times the height.') },
      ],
    },
    {
      prompt: 'a = 6, b = 10, h = 4',
      template: ['S = ', { slot: 0 }],
      parts: ['32', '24', '40', '16'],
      answer: ['32'],
      doneLabel: 'S = 32',
      wrongs: [
        { key: '24', hint: L("Yigirma to'rt bu oltiga karra to'rt: bitta asos ishlatilgan.", 'Двадцать четыре это шесть на четыре: использовано одно основание.', 'Twenty four is six times four: only one base was used.') },
        { key: '40', hint: L("Qirq bu o'n karra to'rt: yana bitta asos.", 'Сорок это десять на четыре: снова одно основание.', 'Forty is ten times four: again one base.') },
        { key: '*', hint: L("O'rta chiziq sakkiz, balandlik to'rt, ko'paytmasi o'ttiz ikki.", 'Средняя линия восемь, высота четыре, произведение тридцать два.', 'The middle line is eight, the height four, the product thirty two.') },
      ],
    },
  ],
  audio: [
    A('mount', "Oxirgi topshiriq: trapetsiya yuzasi. Bu formulada o'rta chiziq yashiringan.", 'Последнее задание: площадь трапеции. В этой формуле спрятана средняя линия.', 'The last task: the area of a trapezoid. The middle line is hidden in that formula.'),
    A('built1', "Endi sonlar bilan.", 'Теперь с числами.', 'Now with numbers.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'pyth_check',
  gapMap: true,
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L('Qayerda teshik bor', 'Где дырка', 'Where the gap is'),
  law: L('mezon, ko\'rinish emas', 'признак, а не вид', 'the criterion, not the look'),
  ruleLines: [
    L('to\'g\'ri burchak kvadratlar bilan tekshiriladi', 'прямой угол проверяют квадратами', 'a right angle is checked by squares'),
    L('o\'rta chiziq yarim yig\'indi', 'средняя линия это полусумма', 'the middle line is a half sum'),
    L('yuza k kvadratga ko\'payadi', 'площадь умножается на k в квадрате', 'an area multiplies by k squared'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('gipotenuzaga balandlik', 'высота к гипотенузе', 'the height to the hypotenuse'),
      right: '4,8',
      map: { a: '4,8', b: '5', c: '7', d: '3,5' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('mediana 5, balandlik 4,8', 'медиана 5, высота 4,8', 'median 5, height 4,8'),
  },
  levels: {
    full: L('Bu blok DTM da siz uchun yopildi', 'Этот блок на ДТМ у тебя закрыт', 'This block is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Xaritada ko\'rsatilgan darslarga qayting', 'Вернись к урокам, указанным в карте', 'Go back to the lessons named in the map'),
  },
  probe: {
    question: L(
      'Nima uchun chizmaga ishonmaslik kerak?',
      'Почему нельзя доверять чертежу?',
      'Why is a drawing not to be trusted?',
    ),
    items: [
      { id: 'a', label: L('u mezonni tekshirmaydi', 'он не проверяет признак', 'it does not check the criterion'), correct: true },
      { id: 'b', label: L('u har doim xato', 'он всегда неверен', 'it is always wrong'), hint: L("Chizma foydali: u yo'lni ko'rsatadi. Lekin hukmni mezon chiqaradi.", 'Чертёж полезен: он показывает путь. Но решает признак.', 'A drawing is useful: it shows the way. But the criterion decides.') },
      { id: 'c', label: L('unda o\'lchov yo\'q', 'на нём нет масштаба', 'it has no scale'), hint: L("O'lchov bo'lishi mumkin, lekin besh, olti, yetti uchligi baribir to'g'ri burchakli ko'rinadi.", 'Масштаб может быть, но тройка пять, шесть, семь всё равно выглядит прямоугольной.', 'A scale may be there, and the triple five, six, seven still looks right-angled.') },
      { id: 'd', label: L('ishonish kerak', 'доверять можно', 'it can be trusted'), hint: L("Bu darsda chizma ikki marta aldadi: uchlikda va balandlikda.", 'На этом уроке чертёж обманул дважды: в тройке и в высоте.', 'In this lesson the drawing deceived twice: in the triple and in the height.') },
    ],
  },
  sheetTitle: L('Planimetriya · shpargalka', 'Планиметрия · шпаргалка', 'Plane geometry · cheat sheet'),
  sheetSrc: L('11-sinf · 51-dars', '11 класс · урок 51', 'Grade 11 · lesson 51'),
  lifehack: L(
    "Javob gipotenuzadan katta chiqsa, teorema teskari ishlatilgan.",
    'Если ответ больше гипотенузы, теорема применена наоборот.',
    'If the answer exceeds the hypotenuse, the theorem was used backwards.',
  ),
  holds: [3200, 5000, 6500],
  audio: [
    A('mount', "Sinov tugadi. Natijaga qaraymiz.", 'Проверка закончена. Смотрим результат.', 'The check is over. Let us look at the result.'),
    A('p1', "Mana taxminingiz va mana javob. Balandlik to'rt butun sakkiz, mediana esa besh: ikki xil chiziq, ikki xil son.", 'Вот твоя догадка и вот ответ. Высота четыре и восемь, а медиана пять: две разные линии, два разных числа.', 'Here is your guess and here is the answer. The height is four point eight and the median five: two different lines, two different numbers.'),
    A('rule', "O'ng tomonda kamchiliklar xaritasi. Uchta mezon esa har imtihonda uchraydi. Birinchisi: to'g'ri burchakni ko'rinish emas, kvadratlar tengligi aniqlaydi. Ikkinchisi: o'rta chiziq yarim yig'indi, va u har doim asoslar orasida turadi. Uchinchisi: o'xshashlikda uzunlik k marta, yuza esa k kvadrat marta o'sadi. Keyingi darsda xuddi shunday sinov, lekin fazoda.", 'Справа карта пробелов. А три признака встречаются на каждом экзамене. Первый: прямой угол определяет не вид, а равенство квадратов. Второй: средняя линия это полусумма, и она всегда лежит между основаниями. Третий: при подобии длина растёт в k раз, а площадь в k в квадрате. На следующем уроке такая же проверка, но в пространстве.', 'On the right is your gap map. And three criteria appear in every exam. First: a right angle is decided not by the look but by the equality of squares. Second: the middle line is a half sum, and it always lies between the bases. Third: under similarity a length grows k times and an area k squared times. The next lesson is the same kind of check, but in space.'),
    A('q', 'Oxirgi savol.', 'Последний вопрос.', 'The last question.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  mode: MODE,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
