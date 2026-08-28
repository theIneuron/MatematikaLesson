// ============================================================================
// 11-sinf, Dars 52. STEREOMETRIYA: SINOV DTM.
//
// B7 blokining ikkinchi darsi.
//   kontrakt: src/books/grade11/ETALON_11SINF.md, 1.2-band (DTM anatomiyasi)
//   asbob:    `SpinBoard` (aylanish jismlari), `AnswerValue`, `Probe`
//   manba:    2-qism, V bob «Stereometriyani takrorlashga doir test
//             topshiriqlari», 177-187-betlar -- oliy o'quv yurtlariga
//             kirish imtihonlari topshiriqlari. Bosma kalit YO'Q
//             (188-betdagi jadval boshqa testga tegishli: 1-topshiriqda
//             u D deydi, vektorlar yig'indisi esa B variantini beradi),
//             shuning uchun HAMMA javob qo'lda hisoblangan.
//   tayanch:  kursning 26-33 darslari (B4 bloki)
//
// DARSNING BITTA GAPI: fazoda javobni koeffitsiyent va DARAJA beradi --
// uchdan bir, k kvadrat, k kub; ko'rinish esa aldaydi.
//
// SONLAR TEKSHIRILDI (darslik topshiriqlari raqami bilan):
//   26: prizma asosi 15, 20, 25 (to'g'ri burchakli, 225 + 400 = 625),
//       yuza 150, balandliklar 20, 15 va 12; yon qirra ENG KATTA balandlik
//       ya'ni 20 -> hajm 150 · 20 = 3000
//   25: muntazam oltiburchakli prizma, asos tomoni 2√5, yon yoqlari kvadrat
//       -> katta diagonal √(80 + 20) = 10
//   28: silindr o'q kesimi 10 = 2rh -> yon sirt 10π
//   69: sharni bo'yashga 50 ketdi, diametr ikki barobar -> sirt k² = 4 marta
//       -> 200
//   70: M dan sirtgacha 6, markazgacha 15 -> R = 9, urinma √(225 − 81) = 12
//   72: shar radiusi 6, radius uchidan 30° -> markazdan 3, kesim radiusi
//       kvadrati 27 -> yuza 27π
//   56: katetlari 6 va 8 uchburchak KICHIK kateti atrofida aylanadi ->
//       R = 8, yasovchi 10 -> to'la sirt 80π + 64π = 144π
//       (katta kateti atrofida esa 60π + 36π = 96π)
//   piramida: asos 36, balandlik 6 -> hajm 72;  uchdan birni unutsa 216
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_52',
  title: L('Stereometriya: sinov DTM', 'Стереометрия: пробный ДТМ', 'Solid geometry: a mock exam'),
}

const BLOCK = { label: 'B7', from: 51, to: 56, current: 52 }

// DTM REJIMI. Etalon 1.2-bandi.
const MODE = 'dtm'

// ============================================================
// SLAYD 1. XUK. Konus silindrning qanchasi.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Sinov DTM', 'Пробный ДТМ', 'Mock exam'),
  title: L('Konus silindrning qanchasi', 'Какая часть цилиндра конус', 'What part of the cylinder is the cone'),
  expr: L('bir xil asos va balandlik', 'одинаковые основание и высота', 'same base, same height'),
  rows: [
    {
      id: 'a',
      name: L('Karim', 'Карим', 'Karim'),
      value: '1/2',
    },
    {
      id: 'b',
      name: L('Nargiza', 'Наргиза', 'Nargiza'),
      value: '1/3',
    },
  ],
  probe: {
    question: L(
      'Konus hajmi silindrning qanchasi?',
      'Какую часть объёма цилиндра занимает конус?',
      'What fraction of the cylinder volume is the cone?',
    ),
    afterPredict: L(
      'Javobingiz yozib olindi. Endi masalalar boshlanadi.',
      'Твой ответ записан. Теперь начинаются задачи.',
      'Your answer is saved. Now the problems begin.',
    ),
    items: [
      { id: 'a', label: '1/3' },
      { id: 'b', label: '1/2' },
      { id: 'c', label: '2/3' },
      { id: 'd', label: '1/4' },
    ],
  },
  holds: [4200, 3600, 3600],
  audio: [
    A('mount', "Fazodagi sinov. Masalalar darslikning kirish imtihonlari bankidan olingan.", 'Проверка в пространстве. Задачи взяты из банка вступительных экзаменов в учебнике.', 'A check in space. The problems come from the entrance-exam bank in the textbook.'),
    A('r1', "Karim yarim deb aytdi: tekislikda uchburchak to'rtburchakning yarmi edi.", 'Карим сказал половина: на плоскости треугольник был половиной прямоугольника.', 'Karim said a half: in the plane a triangle was half a rectangle.'),
    A('r2', "Nargiza esa uchdan bir deb javob berdi.", 'А Наргиза ответила треть.', 'Nargiza answered a third.'),
    A('ask', "Sizningcha qaysi javob to'g'ri. Taxmin qiling.", 'Как думаешь, какой ответ верный. Предположи.', 'Which answer do you think is right. Make a guess.'),
  ],
}

// ============================================================
// SLAYD 2. MASALA 1. Qaysi o'q, shunday jism.
// ============================================================
const S2 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'axis_matters',
  eyebrow: L('Masala 1', 'Задача 1', 'Problem 1'),
  title: L('Aylanishdan nima chiqadi', 'Что выходит при вращении', 'What comes out of a rotation'),
  expr: L('figura o\'q atrofida aylanadi', 'фигура вращается вокруг оси', 'a figure spins about an axis'),
  goal: L('jismni aniqlash', 'определить тело', 'name the solid'),
  rule: L(
    "Har holatda jismni aytamiz.",
    'В каждом случае называем тело.',
    'In each case we name the solid.',
  ),
  pick: L('Qaysi holatni tekshiramiz?', 'Какой случай проверим?', 'Which case shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('figura hal qiladi', 'решает фигура', 'the figure decides'), value: L('figura', 'фигура', 'the figure') },
    { id: 'b', key: 'inB', name: L('O\'Q ham hal qiladi', 'решает и ОСЬ', 'the AXIS decides too'), value: L('o\'q', 'ось', 'the axis') },
  ],
  points: [
    {
      // Yorliqlar QISQA: proza bilan 2-slayd telefonda 234 px oshib
      // ketgan edi. To'liq gapni ovoz aytadi.
      id: 'q1', label: L('to\'rtburchak, tomon', 'прямоугольник, сторона', 'rectangle, side'), num: L('silindr', 'цилиндр', 'a cylinder'), step: 'calc', verdict: 'in',
      calc: L('asos doira', 'основание круг', 'the base is a disc'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q2', label: L('uchburchak, katet', 'треугольник, катет', 'triangle, leg'), num: L('konus', 'конус', 'a cone'), step: 'calc', verdict: 'in',
      calc: L('uchi bor', 'есть вершина', 'it has an apex'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q3', label: L('yarim doira, diametr', 'полукруг, диаметр', 'half disc, diameter'), num: L('shar', 'шар', 'a ball'), step: 'calc', verdict: 'in',
      calc: L('to\'liq shar', 'полный шар', 'a full ball'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q4', label: L('uchburchak, gipotenuza', 'треугольник, гипотенуза', 'triangle, hypotenuse'), num: L('ikki konus', 'два конуса', 'two cones'), step: 'calc', verdict: 'out',
      calc: L('bitta jism emas', 'не одно тело', 'not one solid'),
      sol: false, inA: true, inB: false,
    },
  ],
  probe: {
    question: L(
      'Jismni nima belgilaydi?',
      'Что определяет тело?',
      'What decides the solid?',
    ),
    items: [
      { id: 'b', label: L('figura va o\'q birga', 'фигура и ось вместе', 'the figure and the axis together'), correct: true },
      { id: 'a', label: L('faqat figura', 'только фигура', 'only the figure'), hint: L("Bitta uchburchak katet atrofida konus, gipotenuza atrofida esa ikki konus beradi.", 'Один и тот же треугольник вокруг катета даёт конус, а вокруг гипотенузы два конуса.', 'The same triangle about a leg gives a cone, about the hypotenuse two cones.') },
      { id: 'c', label: L('faqat o\'q', 'только ось', 'only the axis'), hint: L("O'q bir xil bo'lsa ham, to'rtburchak silindr, uchburchak esa konus beradi.", 'При одной и той же оси прямоугольник даёт цилиндр, а треугольник конус.', 'With the same axis a rectangle gives a cylinder and a triangle a cone.') },
      { id: 'd', label: L('hajm', 'объём', 'the volume'), hint: L("Hajm NATIJA, savol esa jismning turi haqida.", 'Объём это РЕЗУЛЬТАТ, а вопрос о виде тела.', 'The volume is a RESULT, and the question is about the kind of solid.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Birinchi masala. To'rtta holat, va har birida jismni aytish kerak.", 'Первая задача. Четыре случая, и в каждом надо назвать тело.', 'The first problem. Four cases, and in each the solid must be named.'),
    A('mount', "Holatni o'zingiz tanlaysiz.", 'Случай выбираешь сам.', 'You choose the case yourself.'),
    A('calc', 'Aytamiz.', 'Называем.', 'We name it.'),
    A('mark', "Mana natija. Uchta holatda tanish jism chiqdi, to'rtinchisida esa ikkita konus: uchburchak gipotenuza atrofida aylanganda balandlik ikki bo'lakka bo'linadi. Demak jismni figura ham, o'q ham belgilaydi. DTM da aynan shu joyda ko'p xato qilinadi: shartda o'q yozilgan bo'ladi, o'quvchi esa faqat figurani o'qiydi.", 'Вот результат. В трёх случаях вышло знакомое тело, а в четвёртом два конуса: при вращении вокруг гипотенузы высота делится на две части. Значит тело определяют и фигура, и ось. На ДТМ ошибаются именно здесь: в условии ось написана, а ученик читает только фигуру.', 'Here is the result. Three cases gave a familiar solid, the fourth gave two cones: spinning about the hypotenuse splits the height in two. So both the figure and the axis decide the solid. On the exam this is exactly where mistakes happen: the axis is in the problem, and the student reads only the figure.'),
  ],
}

// ============================================================
// SLAYD 3. MASALA 2. To'la sirt va yon sirt.
// ============================================================
const S3 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'lateral_vs_total',
  eyebrow: L('Masala 2', 'Задача 2', 'Problem 2'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    'Konusda asos ham bor',
    'У конуса есть и основание',
    'A cone also has a base',
  ),
  template: [L('to\'la sirt  ', 'полная поверхность  ', 'total surface  '), { slot: 0 }, L('  yon sirt', '  боковая', '  lateral')],
  signs: ['>', '='],
  answer: '>',
  checkNote: L(
    'to\'la sirt yon sirt plyus asos yuzasi',
    'полная это боковая плюс площадь основания',
    'the total is the lateral plus the base area',
  ),
  wrongs: [
    { key: '=', hint: L("Tenglik faqat asossiz sirtda bo'lardi: sferada. Konusda esa asos doira bor.", 'Равенство было бы только у поверхности без основания: у сферы. А у конуса есть круг основания.', 'Equality would hold only for a surface with no base: a sphere. A cone has a base disc.') },
  ],
  probe: {
    question: L(
      'Sferada qanday bo\'ladi?',
      'А у сферы как?',
      'And for a sphere?',
    ),
    items: [
      { id: 'a', label: L('asos yo\'q, sirt bitta', 'основания нет, поверхность одна', 'no base, one surface'), correct: true },
      { id: 'b', label: L('asos ikkita', 'основания два', 'two bases'), hint: L("Ikki asos SILINDRda bo'ladi.", 'Два основания бывают у ЦИЛИНДРА.', 'Two bases belong to a CYLINDER.') },
      { id: 'c', label: L('asos bitta', 'основание одно', 'one base'), hint: L("Bitta asos konus va piramidada bo'ladi.", 'Одно основание у конуса и пирамиды.', 'One base belongs to a cone and a pyramid.') },
      { id: 'd', label: L('yon sirt yo\'q', 'нет боковой', 'no lateral surface'), hint: L("Sferada butun sirt bitta, va uni yon sirt deb ham atash mumkin.", 'У сферы вся поверхность одна, и её можно назвать и боковой.', 'A sphere has one surface, which may be called lateral as well.') },
    ],
  },
  audio: [
    A('mount', "Ikkinchi masala. Konusning to'la sirti va yon sirti.", 'Вторая задача. Полная поверхность конуса и боковая.', 'The second problem. The total surface of a cone and the lateral one.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 4. MASALA 3. Chizma: konusni silindrga to'kish.
// ============================================================
const S4 = {
  role: 'graph',
  section: 'practice',
  tag: 'third_coefficient',
  drag: false,
  eyebrow: L('Masala 3', 'Задача 3', 'Problem 3'),
  title: L('Nechta konus sig\'adi', 'Сколько конусов войдёт', 'How many cones fit'),
  chip: L('bir xil asos va balandlik', 'одинаковые основание и высота', 'same base and height'),
  solid: {
    mode: 'pour',
    solid: 'cone',
    R: 2,
    hh: 3,
    fills: [0, 1, 2, 3],
    height: 176,
    caption: L('konus silindrga to\'kiladi', 'конус переливают в цилиндр', 'the cone is poured into the cylinder'),
  },
  spinSteps: 3,
  probe: {
    question: L(
      'Nechta konus silindrni to\'ldiradi?',
      'Сколько конусов заполнит цилиндр?',
      'How many cones fill the cylinder?',
    ),
    items: [
      { id: 'a', label: '3', correct: true },
      { id: 'b', label: '2', hint: L("Ikkita konus silindrning uchdan ikkisini to'ldiradi: yuqorida joy qoladi.", 'Два конуса заполнят две трети цилиндра: сверху останется место.', 'Two cones fill two thirds of the cylinder: room is left on top.') },
      { id: 'c', label: '4', hint: L("To'rttasi ko'p: uchtadan keyin silindr allaqachon to'la.", 'Четыре это много: после трёх цилиндр уже полон.', 'Four is too many: after three the cylinder is already full.') },
      { id: 'd', label: '6', hint: L("Oltita bu yarim koeffitsiyentdan chiqadigan xato hisob.", 'Шесть выходит из ошибочного счёта с половиной.', 'Six comes from the mistaken half coefficient.') },
    ],
  },
  holds: [4200, 4200, 4200],
  audio: [
    A('mount', "Uchinchi masala chizmada. Silindr bo'sh, konus to'la.", 'Третья задача на чертеже. Цилиндр пуст, конус полон.', 'The third problem is on a drawing. The cylinder is empty, the cone is full.'),
    A('mount', "Birinchi to'kish silindrni to'ldirmadi. Ikkinchisi ham.", 'Первое переливание цилиндр не наполнило. И второе тоже.', 'The first pour did not fill the cylinder. Nor the second.'),
    A('mount', "Uchinchi to'kishdan keyin silindr aynan to'ldi. Bu Kavalyeri natijasidan kelib chiqadi va DTM da eng ko'p uchraydigan koeffitsiyent.", 'После третьего переливания цилиндр наполнился точно. Это следует из результата Кавальери и это самый частый коэффициент на ДТМ.', 'After the third pour the cylinder is exactly full. That follows from the Cavalieri result and is the most frequent coefficient on the exam.'),
  ],
}

// Zanjir amallari: prizma va shar masalalarining amallari bir ro'yxatda.
const ACTIONS_52 = [
  { id: 'right', label: L('asosni tekshirish', 'проверить основание', 'check the base') },
  { id: 'area', label: L('asos yuzasini topish', 'найти площадь основания', 'find the base area') },
  { id: 'height', label: L('balandlikni topish', 'найти высоту', 'find the height') },
  { id: 'vol', label: L('hajmni hisoblash', 'посчитать объём', 'compute the volume') },
  { id: 'dist', label: L('markazdan masofani topish', 'найти расстояние от центра', 'find the distance from the centre') },
]

// ============================================================
// SLAYD 5. MASALA 4. Zanjir: prizma hajmi (darslik 26-topshiriq).
// ============================================================
const S5 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'axis_matters',
  noLine: true,
  eyebrow: L('Masala 4', 'Задача 4', 'Problem 4'),
  title: L('Prizma hajmi', 'Объём призмы', 'The volume of a prism'),
  // `start` FORMULA satrida chiqadi va o'ralmaydi: shartni ovoz aytadi.
  start: '15, 20, 25;  h max',
  actions: ACTIONS_52,
  steps: [
    {
      action: 'right',
      to: '225 + 400 = 625',
      wrongs: [
        { action: 'area', hint: L("Yuza formulasi asos turiga bog'liq: avval uni aniqlash kerak.", 'Формула площади зависит от вида основания: сначала надо его определить.', 'The area formula depends on the base: first identify it.') },
        { action: 'vol', hint: L("Hajm uchun ikkita son kerak, ikkisi ham hali yo'q.", 'Для объёма нужны два числа, обоих пока нет.', 'The volume needs two numbers, neither is ready.') },
        { action: 'dist', hint: L("Markazdan masofa shar masalasida kerak bo'ladi.", 'Расстояние от центра понадобится в задаче о шаре.', 'The distance from the centre belongs to the ball problem.') },
      ],
    },
    {
      action: 'area',
      to: '150',
      wrongs: [
        { action: 'right', hint: L("Tekshiruv o'tdi: asos to'g'ri burchakli uchburchak.", 'Проверка прошла: основание прямоугольный треугольник.', 'The check passed: the base is a right triangle.') },
        { action: 'height', hint: L("Balandlik uchun avval yuza kerak: u balandliklarni beradi.", 'Для высоты сначала нужна площадь: она даёт высоты.', 'For the height the area comes first: it gives the heights.') },
      ],
    },
    {
      action: 'height',
      to: '20',
      wrongs: [
        { action: 'area', hint: L("Yuza topildi: yuz ellik.", 'Площадь найдена: сто пятьдесят.', 'The area is found: one hundred fifty.') },
        { action: 'vol', hint: L("Hajmga balandlik kerak, u hali topilmagan.", 'Объёму нужна высота, а она ещё не найдена.', 'The volume needs the height, and it is not found yet.') },
      ],
    },
    {
      action: 'vol',
      to: '3000',
      wrongs: [
        { action: 'height', hint: L("Balandlik topildi: eng katta balandlik yigirma.", 'Высота найдена: наибольшая высота двадцать.', 'The height is found: the largest height is twenty.') },
        { action: 'dist', hint: L("Bu masalada markaz yo'q.", 'В этой задаче центра нет.', 'There is no centre in this problem.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['3000', '1800', '2250', '750'],
    value: ['3000'],
    label: 'V =',
    prompt: L('Hajmni yozing', 'Запиши объём', 'Write the volume'),
    wrongs: [
      { key: '1800', hint: L("O'n ikkiga ko'paytirilgan: bu ENG KICHIK balandlik, shartda esa eng katta.", 'Умножено на двенадцать: это НАИМЕНЬШАЯ высота, а в условии наибольшая.', 'Multiplied by twelve: that is the SMALLEST height, and the problem says the largest.') },
      { key: '2250', hint: L("O'n beshga ko'paytirilgan: bu o'rtacha balandlik.", 'Умножено на пятнадцать: это средняя высота.', 'Multiplied by fifteen: that is the middle height.') },
      { key: '750', hint: L("Uchdan bir olingan: uchdan bir PIRAMIDAda, prizmada esa emas.", 'Взята треть: треть у ПИРАМИДЫ, а не у призмы.', 'A third was taken: the third belongs to a PYRAMID, not a prism.') },
      { key: '*', hint: L("Yuz ellik karra yigirma uch ming beradi.", 'Сто пятьдесят на двадцать даёт три тысячи.', 'One hundred fifty times twenty gives three thousand.') },
    ],
  },
  audio: [
    A('mount', "To'rtinchi masala darslikning yigirma oltinchi topshirig'i. Ro'yxatda shar masalasining amali ham bor.", 'Четвёртая задача это двадцать шестое задание учебника. В списке есть и действие задачи о шаре.', 'The fourth problem is item twenty six from the textbook. The list also holds an action of the ball problem.'),
    A('step5', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 6. MASALA 5. Bo'yoq va daraja (darslik 69-topshiriq).
// ============================================================
const S6 = {
  role: 'twoway',
  section: 'practice',
  tag: 'similar_area',
  eyebrow: L('Masala 5', 'Задача 5', 'Problem 5'),
  title: L('Bo\'yoq qancha kerak', 'Сколько нужно краски', 'How much paint is needed'),
  expr: L('diametr ikki barobar, bo\'yoq 50 edi', 'диаметр вдвое, краски было 50', 'the diameter doubles, paint was 50'),
  need: L('sirt qanday o\'sadi', 'как растёт поверхность', 'how the surface grows'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('ikki barobar dedi', 'сказал вдвое', 'said twice'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '100',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('to\'rt barobar dedi', 'сказала вчетверо', 'said four times'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '200',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['200', '100', '400', '150'],
    value: ['200'],
    label: L('bo\'yoq =', 'краски =', 'paint ='),
    prompt: L('Javobni yozing', 'Запиши ответ', 'Write the answer'),
    wrongs: [
      { key: '100', hint: L("Ikki barobar UZUNLIK o'sadi. Bo'yoq esa SIRTGA ketadi, sirt k kvadratga ko'payadi.", 'Вдвое растёт ДЛИНА. А краска идёт на ПОВЕРХНОСТЬ, а поверхность умножается на k в квадрате.', 'A LENGTH grows twice. Paint covers a SURFACE, and a surface multiplies by k squared.') },
      { key: '400', hint: L("Sakkiz barobar HAJM o'sadi, bo'yoq esa hajmga ketmaydi.", 'В восемь раз растёт ОБЪЁМ, а краска идёт не на объём.', 'A VOLUME grows eight times, and paint does not fill a volume.') },
      { key: '150', hint: L("Uch barobar hech qanday qoidada yo'q.", 'Втрое нет ни в одном правиле.', 'No rule gives three times.') },
    ],
  },
  holds: [3200, 3600, 5200],
  audio: [
    A('mount', "Beshinchi masala darslikdan: sharni bo'yash.", 'Пятая задача из учебника: покраска шара.', 'The fifth problem from the textbook: painting a ball.'),
    A('p1', "Aziz ikki barobar dedi: diametr ikki barobar o'sdi.", 'Азиз сказал вдвое: диаметр вырос вдвое.', 'Aziz said twice: the diameter doubled.'),
    A('p2', "Dilnoza esa bo'yoq SIRTGA ketishini esladi. Sirt uzunlikning kvadratiga ko'payadi, ya'ni to'rt barobar. Javob ikki yuz. Bu qoida uchta darajaga bo'linadi: uzunlik k marta, yuza k kvadrat, hajm k kub.", 'А Дилноза вспомнила, что краска идёт на ПОВЕРХНОСТЬ. Поверхность растёт как квадрат длины, то есть вчетверо. Ответ двести. Это правило делится на три степени: длина в k раз, площадь в k в квадрате, объём в k в кубе.', 'Dilnoza recalled that paint covers a SURFACE. A surface grows as the square of a length, that is four times. The answer is two hundred. That rule splits into three powers: a length times k, an area k squared, a volume k cubed.'),
    A('write', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 7. MASALA 6. Urinma uzunligi (darslik 70-topshiriq).
// ============================================================
const S7 = {
  role: 'points',
  section: 'practice',
  led: 'student',
  tag: 'ball_vs_sphere',
  eyebrow: L('Masala 6', 'Задача 6', 'Problem 6'),
  title: L('Urinmaning uzunligi', 'Длина касательной', 'The length of the tangent'),
  expr: L('sirtgacha 6, markazgacha 15', 'до поверхности 6, до центра 15', 'to the surface 6, to the centre 15'),
  goal: L('to\'g\'ri javobni topish', 'найти верный ответ', 'find the right answer'),
  rule: L(
    "Radius 15 minus 6, ya'ni 9. Har javobni Pifagor bilan sinaymiz.",
    'Радиус 15 минус 6, то есть 9. Каждый ответ проверяем Пифагором.',
    'The radius is 15 minus 6, that is 9. We test each answer by Pythagoras.',
  ),
  pick: L('Qaysi javobni tekshiramiz?', 'Какой ответ проверим?', 'Which answer shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('15 dan 6 ni ayirish', '15 минус 6', 'subtract 6 from 15'), value: '9' },
    { id: 'b', key: 'inB', name: L('kvadratlar mos kelsa', 'если квадраты сходятся', 'if the squares match'), value: '225' },
  ],
  points: [
    {
      id: 'q1', label: '10', num: '81 + 100 = 181', step: 'calc', verdict: 'out',
      calc: L('225 emas', 'не 225', 'not 225'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q2', label: '12', num: '81 + 144 = 225', step: 'calc', verdict: 'in',
      calc: L('aynan mos keldi', 'сошлось точно', 'an exact match'),
      sol: true, inA: true, inB: true,
    },
    {
      id: 'q3', label: '14', num: '81 + 196 = 277', step: 'calc', verdict: 'out',
      calc: L('juda katta', 'слишком много', 'too much'),
      sol: false, inA: true, inB: false,
    },
    {
      id: 'q4', label: '16', num: '81 + 256 = 337', step: 'calc', verdict: 'out',
      calc: L('yana katta', 'снова много', 'too much again'),
      sol: false, inA: true, inB: false,
    },
  ],
  probe: {
    question: L(
      'Nima uchun Pifagor ishlaydi?',
      'Почему работает Пифагор?',
      'Why does Pythagoras apply?',
    ),
    items: [
      { id: 'a', label: L('radius urinmaga perpendikulyar', 'радиус перпендикулярен касательной', 'the radius is perpendicular to the tangent'), correct: true },
      { id: 'b', label: L('shar simmetrik', 'шар симметричен', 'a ball is symmetric'), hint: L("Simmetriya foydali, lekin to'g'ri burchakni radius va urinma beradi.", 'Симметрия полезна, но прямой угол даёт радиус с касательной.', 'Symmetry helps, but the right angle comes from the radius and the tangent.') },
      { id: 'c', label: L('masofalar butun', 'расстояния целые', 'the distances are whole'), hint: L("Butunlik tasodif: teorema har qanday sonda ishlaydi.", 'Целость случайна: теорема работает при любых числах.', 'Whole numbers are a coincidence: the theorem works for any numbers.') },
      { id: 'd', label: L('urinma diametr bo\'ylab', 'касательная по диаметру', 'the tangent runs along a diameter'), hint: L("Urinma sirtga bir nuqtada tegadi, diametr esa sharni kesib o'tadi.", 'Касательная касается поверхности в одной точке, а диаметр пересекает шар.', 'A tangent touches at one point, a diameter cuts through the ball.') },
    ],
  },
  holds: [3000, 2400, 2600, 8000],
  audio: [
    A('mount', "Oltinchi masala darslikning yetmishinchi topshirig'i.", 'Шестая задача это семидесятое задание учебника.', 'The sixth problem is item seventy from the textbook.'),
    A('mount', "Javobni o'zingiz tanlaysiz.", 'Ответ выбираешь сам.', 'You choose the answer yourself.'),
    A('calc', 'Sinaymiz.', 'Проверяем.', 'We test.'),
    A('mark', "Mana natija. Faqat o'n ikki mos keldi: to'qsan bir plyus yuz qirq to'rt ikki yuz yigirma beshga teng. Sabab shu: urinma tegish nuqtasidagi radiusga perpendikulyar, va shu sababli markaz, tegish nuqtasi va M nuqta to'g'ri burchakli uchburchak yasaydi. Radiusni esa shartdan olamiz: o'n beshdan olti ayirilsa to'qqiz.", 'Вот результат. Сошлось только двенадцать: девяносто один плюс сто сорок четыре равно двумстам двадцати пяти. Причина такая: касательная перпендикулярна радиусу в точке касания, и поэтому центр, точка касания и точка M образуют прямоугольный треугольник. А радиус берём из условия: пятнадцать минус шесть это девять.', 'Here is the result. Only twelve matched: eighty one plus one hundred forty four equals two hundred twenty five. The reason: a tangent is perpendicular to the radius at the point of contact, so the centre, the contact point and M form a right triangle. And the radius comes from the problem: fifteen minus six is nine.'),
  ],
}

// ============================================================
// SLAYD 8. MASALA 7. Mustaqil: shar kesimi (darslik 72-topshiriq).
// ============================================================
const S8 = {
  role: 'chain',
  section: 'practice',
  led: 'student',
  tag: 'cross_section',
  noLine: true,
  solo: true,
  eyebrow: L('Masala 7', 'Задача 7', 'Problem 7'),
  title: L('Imtihondagidek', 'Как на экзамене', 'As on the exam'),
  start: L('shar R = 6, tekislik radius uchidan 30°', 'шар R = 6, плоскость под 30° к радиусу', 'ball R = 6, a plane at 30° to a radius'),
  actions: ACTIONS_52,
  hint: L(
    "Markazdan tekislikkacha masofa radius karra sinus 30°.",
    'Расстояние от центра до плоскости это радиус на синус тридцати.',
    'The distance from the centre to the plane is the radius times the sine of thirty.',
  ),
  steps: [
    {
      action: 'dist',
      to: '3',
      wrongs: [
        { action: 'area', hint: L("Yuza uchun kesim radiusi kerak, u hali topilmagan.", 'Для площади нужен радиус сечения, а он ещё не найден.', 'The area needs the section radius, which is not found yet.') },
        { action: 'right', hint: L("Asosni tekshirish prizma masalasida edi.", 'Проверка основания была в задаче о призме.', 'Checking the base belonged to the prism problem.') },
        { action: 'vol', hint: L("Hajm so'ralmagan: kesim YUZASI kerak.", 'Объём не спрашивают: нужна ПЛОЩАДЬ сечения.', 'The volume is not asked: the section AREA is.') },
      ],
    },
    {
      action: 'area',
      to: '27π',
      wrongs: [
        { action: 'dist', hint: L("Masofa topildi: uch.", 'Расстояние найдено: три.', 'The distance is found: three.') },
        { action: 'height', hint: L("Balandlik bu masalada yo'q.", 'Высоты в этой задаче нет.', 'There is no height in this problem.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['27π', '9π', '36π', '25π'],
    value: ['27π'],
    label: 'S =',
    prompt: L('Kesim yuzasini yozing', 'Запиши площадь сечения', 'Write the section area'),
    wrongs: [
      { key: '9π', hint: L("To'qqiz pi bu MASOFA kvadratidan chiqadi. Kesim radiusi kvadrati esa o'ttiz olti minus to'qqiz.", 'Девять пи выходит из квадрата РАССТОЯНИЯ. А квадрат радиуса сечения это тридцать шесть минус девять.', 'Nine pi comes from the square of the DISTANCE. The square of the section radius is thirty six minus nine.') },
      { key: '36π', hint: L("O'ttiz olti pi bu katta doira, ya'ni markazdan o'tgan kesim.", 'Тридцать шесть пи это большой круг, то есть сечение через центр.', 'Thirty six pi is the great circle, a section through the centre.') },
      { key: '25π', hint: L("Yigirma besh pi hech qanday hisobdan chiqmaydi.", 'Двадцать пять пи не выходит ни из одного счёта.', 'Twenty five pi comes from no computation here.') },
      { key: '*', hint: L("Kesim radiusi kvadrati o'ttiz olti minus to'qqiz, ya'ni yigirma yetti.", 'Квадрат радиуса сечения тридцать шесть минус девять, то есть двадцать семь.', 'The square of the section radius is thirty six minus nine, that is twenty seven.') },
    ],
  },
  audio: [
    A('mount', "Yettinchi masala mustaqil, darslikning yetmish ikkinchi topshirig'i.", 'Седьмая задача самостоятельная, это семьдесят второе задание учебника.', 'The seventh problem is on your own, item seventy two from the textbook.'),
    A('step3', 'Javobni yozing.', 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 9. MASALA 8. Yasovchi va balandlik.
// ============================================================
const S9 = {
  role: 'sign',
  section: 'practice',
  led: 'student',
  tag: 'slant_vs_height',
  eyebrow: L('Masala 8', 'Задача 8', 'Problem 8'),
  title: L('Ishorani qo\'ying', 'Поставь знак', 'Place the sign'),
  left: L(
    'Konusda yasovchi qiya turadi',
    'Образующая конуса стоит наклонно',
    'The generator of a cone is slanted',
  ),
  template: [L('yasovchi  ', 'образующая  ', 'the generator  '), { slot: 0 }, L('  balandlik', '  высота', '  the height')],
  signs: ['>', '='],
  answer: '>',
  checkNote: L(
    'yasovchi gipotenuza, balandlik esa kateti',
    'образующая это гипотенуза, а высота катет',
    'the generator is the hypotenuse, the height a leg',
  ),
  wrongs: [
    { key: '=', hint: L("Tenglik radius nolga teng bo'lganda bo'lardi, ya'ni konus yo'q bo'lardi.", 'Равенство было бы при нулевом радиусе, то есть конуса не было бы.', 'Equality would need a zero radius, so there would be no cone.') },
  ],
  probe: {
    question: L(
      'Qaysi uchlik konusda ishlaydi?',
      'Какая тройка работает в конусе?',
      'Which triple works in a cone?',
    ),
    items: [
      { id: 'a', label: L('radius, balandlik, yasovchi', 'радиус, высота, образующая', 'radius, height, generator'), correct: true },
      { id: 'b', label: L('diametr, balandlik, yasovchi', 'диаметр, высота, образующая', 'diameter, height, generator'), hint: L("O'q kesimida to'g'ri burchakli uchburchak RADIUS bilan yasaladi, diametr bilan emas.", 'В осевом сечении прямоугольный треугольник строится на РАДИУСЕ, а не на диаметре.', 'In the axial section the right triangle is built on the RADIUS, not the diameter.') },
      { id: 'c', label: L('radius, diametr, yasovchi', 'радиус, диаметр, образующая', 'radius, diameter, generator'), hint: L("Radius va diametr bir chiziqda: ular uchburchak yasamaydi.", 'Радиус и диаметр на одной линии: треугольника они не дают.', 'A radius and a diameter lie on one line: they form no triangle.') },
      { id: 'd', label: L('faqat balandlik va yasovchi', 'только высота и образующая', 'only the height and the generator'), hint: L("Ikki tomon yetmaydi: uchinchisi radius.", 'Двух сторон мало: третья это радиус.', 'Two sides are not enough: the third is the radius.') },
    ],
  },
  audio: [
    A('mount', "Sakkizinchi masala. Konusning yasovchisi va balandligi.", 'Восьмая задача. Образующая конуса и его высота.', 'The eighth problem. The generator of a cone and its height.'),
    A('write', "Ishorani qo'ying.", 'Поставь знак.', 'Place the sign.'),
  ],
}

// ============================================================
// SLAYD 10. MASALA 9. Teskari masala: konus sirti.
// ============================================================
const S10 = {
  role: 'build',
  section: 'practice',
  led: 'student',
  tag: 'lateral_vs_total',
  right: '2/2',
  eyebrow: L('Masala 9', 'Задача 9', 'Problem 9'),
  title: L('Formulani yig\'ing', 'Собери формулу', 'Build the formula'),
  targetLabel: L('Konus', 'Конус', 'The cone'),
  targetValue: L('radius r, yasovchi l', 'радиус r, образующая l', 'radius r, generator l'),
  tasks: [
    {
      prompt: L('Yon sirt', 'Боковая поверхность', 'The lateral surface'),
      template: ['S = π ', { slot: 0 }, ' ', { slot: 1 }],
      parts: ['r', 'l', 'r²', 'h'],
      answer: ['r', 'l'],
      doneLabel: 'S = π r l',
      wrongs: [
        { key: 'r²|l', hint: L("Kvadrat ASOS yuzasida turadi, yon sirtda esa radius birinchi darajada.", 'Квадрат стоит в площади ОСНОВАНИЯ, а в боковой радиус в первой степени.', 'The square belongs to the BASE area, in the lateral surface the radius is to the first power.') },
        { key: 'r|h', hint: L("Yon sirtda BALANDLIK emas, YASOVCHI turadi: yon sirt yoyilmada sektor.", 'В боковой стоит не ВЫСОТА, а ОБРАЗУЮЩАЯ: боковая в развёртке это сектор.', 'The lateral surface uses the GENERATOR, not the height: unrolled it is a sector.') },
        { key: '*', hint: L("Yon sirt pi karra radius karra yasovchi.", 'Боковая это пи на радиус на образующую.', 'The lateral surface is pi times the radius times the generator.') },
      ],
    },
    {
      prompt: L('To\'la sirt', 'Полная поверхность', 'The total surface'),
      template: ['S = π r l + π ', { slot: 0 }],
      parts: ['r²', 'l²', 'r', 'h²'],
      answer: ['r²'],
      doneLabel: 'S = π r l + π r²',
      wrongs: [
        { key: 'l²', hint: L("Asos doirasining yuzasi RADIUS bilan hisoblanadi.", 'Площадь круга основания считают по РАДИУСУ.', 'The base disc area uses the RADIUS.') },
        { key: 'r', hint: L("Yuza uchun kvadrat kerak: birinchi daraja uzunlik beradi.", 'Для площади нужен квадрат: первая степень даёт длину.', 'An area needs a square: the first power gives a length.') },
        { key: '*', hint: L("To'la sirt yon sirt plyus asos doirasining yuzasi.", 'Полная это боковая плюс площадь круга основания.', 'The total is the lateral plus the area of the base disc.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'qqizinchi masala teskari: formulani o'zingiz yig'asiz.", 'Девятая задача обратная: формулу собираешь сам.', 'The ninth problem is reverse: you build the formula.'),
    A('built1', "Endi to'la sirt.", 'Теперь полная поверхность.', 'Now the total surface.'),
  ],
}

// ============================================================
// SLAYD 11. MASALA 10. Qaysi katet atrofida (darslik 56-topshiriq).
// ============================================================
const S11 = {
  role: 'twoway',
  section: 'practice',
  tag: 'axis_matters',
  eyebrow: L('Masala 10', 'Задача 10', 'Problem 10'),
  title: L('Qaysi katet atrofida', 'Вокруг какого катета', 'About which leg'),
  expr: L('katetlar 6 va 8, KICHIK kateti atrofida', 'катеты 6 и 8, вокруг МАЛОГО катета', 'legs 6 and 8, about the SHORT leg'),
  need: L('to\'la sirt', 'полная поверхность', 'the total surface'),
  answerLabel: L('to\'g\'ri javob', 'верный ответ', 'the right answer'),
  cards: [
    {
      tag: L('Aziz', 'Азиз', 'Aziz'),
      txt: L('katta katet atrofida', 'вокруг большого катета', 'about the long leg'),
      point: {
        label: L('uning javobi', 'его ответ', 'his answer'),
        calc: '96π',
        verdict: 'out',
      },
    },
    {
      tag: L('Dilnoza', 'Дилноза', 'Dilnoza'),
      txt: L('kichik katet atrofida', 'вокруг малого катета', 'about the short leg'),
      point: {
        label: L('uning javobi', 'её ответ', 'her answer'),
        calc: '144π',
        verdict: 'in',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['144π', '96π', '80π', '100π'],
    value: ['144π'],
    label: 'S =',
    prompt: L('To\'la sirtni yozing', 'Запиши полную поверхность', 'Write the total surface'),
    wrongs: [
      { key: '96π', hint: L("Bu KATTA katet atrofida: u yerda radius olti. Shartda esa kichik katet, ya'ni radius sakkiz.", 'Это вокруг БОЛЬШОГО катета: там радиус шесть. А в условии малый катет, значит радиус восемь.', 'That is about the LONG leg: there the radius is six. The problem says the short leg, so the radius is eight.') },
      { key: '80π', hint: L("Sakson pi bu faqat YON sirt: asos doirasi qo'shilmagan.", 'Восемьдесят пи это только БОКОВАЯ: круг основания не добавлен.', 'Eighty pi is the LATERAL surface only: the base disc is missing.') },
      { key: '100π', hint: L("Yuz pi yasovchining kvadratidan chiqadi, formulada esa radius kvadrati.", 'Сто пи выходит из квадрата образующей, а в формуле квадрат радиуса.', 'One hundred pi comes from the square of the generator, and the formula has the square of the radius.') },
      { key: '*', hint: L("Radius sakkiz, yasovchi o'n: sakson pi plyus oltmish to'rt pi.", 'Радиус восемь, образующая десять: восемьдесят пи плюс шестьдесят четыре пи.', 'The radius is eight, the generator ten: eighty pi plus sixty four pi.') },
    ],
  },
  holds: [4200, 4200, 5500],
  audio: [
    A('mount', "O'ninchi masala, oxirgisi. Darslikning ellik oltinchi topshirig'i.", 'Десятая задача, последняя. Пятьдесят шестое задание учебника.', 'The tenth problem, the last. Item fifty six from the textbook.'),
    A('p1', "Aziz katta katet atrofida aylantirdi. Uning konusida radius olti.", 'Азиз вращал вокруг большого катета. В его конусе радиус шесть.', 'Aziz spun it about the long leg. In his cone the radius is six.'),
    A('p2', "Dilnoza esa shartni o'qidi: kichik katet atrofida. Bunda kichik katet balandlik bo'ladi, katta katet esa RADIUS, ya'ni sakkiz. Yasovchi ikki holatda ham o'n, chunki u gipotenuza. Javob yuz qirq to'rt pi.", 'А Дилноза прочитала условие: вокруг малого катета. Тогда малый катет становится высотой, а большой РАДИУСОМ, то есть восемь. Образующая в обоих случаях десять, ведь это гипотенуза. Ответ сто сорок четыре пи.', 'Dilnoza read the problem: about the short leg. Then the short leg becomes the height and the long one the RADIUS, that is eight. The generator is ten either way, since it is the hypotenuse. The answer is one hundred forty four pi.'),
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
      id: 'b1', tag: 'third_coefficient', ask: true, cols: 2,
      done: '72',
      prompt: L('Piramida: asos 36, balandlik 6. Hajm?', 'Пирамида: основание 36, высота 6. Объём?', 'A pyramid: base 36, height 6. The volume?'),
      items: [
        { id: 'a', label: '72', correct: true },
        { id: 'b', label: '216', hint: L("Uchdan bir unutilgan: piramidada koeffitsiyent bor.", 'Забыта треть: у пирамиды есть коэффициент.', 'The third is forgotten: a pyramid has that coefficient.') },
        { id: 'c', label: '108', hint: L("Yarim olingan, uchdan bir kerak.", 'Взята половина, а нужна треть.', 'A half was taken, a third is needed.') },
        { id: 'd', label: '42', hint: L("Qo'shilgan, ko'paytirish kerak edi.", 'Сложено, а надо было умножить.', 'Added instead of multiplied.') },
      ],
    },
    {
      id: 'b2', tag: 'lateral_vs_total', ask: true, cols: 2,
      done: '10π',
      prompt: L('Silindr o\'q kesimi 10. Yon sirt?', 'Осевое сечение цилиндра 10. Боковая?', 'A cylinder axial section is 10. The lateral surface?'),
      items: [
        { id: 'a', label: '10π', correct: true },
        { id: 'b', label: '5π', hint: L("Ikkiga bo'linmaydi: o'q kesimi allaqachon ikki radius karra balandlik.", 'На два не делят: осевое сечение это уже два радиуса на высоту.', 'No halving: the axial section is already two radii times the height.') },
        { id: 'c', label: '20π', hint: L("Ikkiga ko'paytirilgan: yon sirt aynan o'q kesimi karra pi.", 'Умножено на два: боковая это ровно осевое сечение на пи.', 'Multiplied by two: the lateral surface is exactly the axial section times pi.') },
        { id: 'd', label: '100π', hint: L("Kvadratga ko'tarilgan, kerak emas.", 'Возведено в квадрат, а это не нужно.', 'Squared, which is not needed.') },
      ],
    },
    {
      id: 'b3', tag: 'cross_section', ask: true, cols: 2,
      done: '10',
      prompt: L('Oltiburchakli prizma, asos tomoni 2√5, yon yoq kvadrat. Katta diagonal?', 'Шестиугольная призма, сторона 2√5, боковая грань квадрат. Большая диагональ?', 'A hexagonal prism, side 2√5, square lateral face. The long diagonal?'),
      items: [
        { id: 'a', label: '10', correct: true },
        { id: 'b', label: '4√5', hint: L("To'rt ildiz besh bu ASOSning diagonali, prizmaning esa emas.", 'Четыре корня из пяти это диагональ ОСНОВАНИЯ, а не призмы.', 'Four root five is the diagonal of the BASE, not of the prism.') },
        { id: 'c', label: '3√5', hint: L("Uch ildiz besh hech qanday hisobdan chiqmaydi.", 'Три корня из пяти не выходит ни из одного счёта.', 'Three root five comes from no computation.') },
        { id: 'd', label: '12', hint: L("O'n ikki katta: sakson plyus yigirma yuzga teng, ildizi o'n.", 'Двенадцать много: восемьдесят плюс двадцать это сто, корень десять.', 'Twelve is too much: eighty plus twenty is one hundred, whose root is ten.') },
      ],
    },
    {
      id: 'b4', tag: 'ball_vs_sphere', ask: true, cols: 2,
      done: '36π',
      prompt: L('Shar R = 3. Hajm?', 'Шар R = 3. Объём?', 'A ball with R = 3. The volume?'),
      items: [
        { id: 'a', label: '36π', correct: true },
        { id: 'b', label: '27π', hint: L("Yigirma yetti pi bu kub, koeffitsiyent to'rt uchdan bir esa qo'shilmagan.", 'Двадцать семь пи это куб, а коэффициент четыре третьих не учтён.', 'Twenty seven pi is the cube, and the four thirds coefficient is missing.') },
        { id: 'c', label: '12π', hint: L("O'n ikki pi bu to'rt karra uch: kub olinmagan.", 'Двенадцать пи это четыре на три: куб не взят.', 'Twelve pi is four times three: the cube was not taken.') },
        { id: 'd', label: '9π', hint: L("To'qqiz pi bu katta doiraning yuzasi.", 'Девять пи это площадь большого круга.', 'Nine pi is the area of the great circle.') },
      ],
    },
    {
      id: 'b5', tag: 'similar_area', ask: true, cols: 2,
      done: '8',
      prompt: L('Qirralar 2 barobar. Hajm necha barobar?', 'Рёбра вдвое. Объём во сколько?', 'Edges doubled. The volume?'),
      items: [
        { id: 'a', label: '8', correct: true },
        { id: 'b', label: '2', hint: L("Ikki barobar UZUNLIK o'sadi.", 'Вдвое растёт ДЛИНА.', 'A LENGTH grows twice.') },
        { id: 'c', label: '4', hint: L("To'rt barobar YUZA o'sadi.", 'Вчетверо растёт ПЛОЩАДЬ.', 'An AREA grows four times.') },
        { id: 'd', label: '6', hint: L("Olti barobar hech qanday darajada yo'q.", 'В шесть раз нет ни в одной степени.', 'Six times appears in no power.') },
      ],
    },
    {
      id: 'b6', tag: 'axis_matters', ask: true, cols: 2,
      done: L('ikki konus', 'два конуса', 'two cones'),
      prompt: L('Uchburchak gipotenuzasi atrofida aylanadi?', 'Треугольник вращается вокруг гипотенузы?', 'A triangle spins about its hypotenuse?'),
      items: [
        { id: 'a', label: L('ikki konus', 'два конуса', 'two cones'), correct: true },
        { id: 'b', label: L('bitta konus', 'один конус', 'one cone'), hint: L("Bitta konus KATET atrofida chiqadi.", 'Один конус выходит вокруг КАТЕТА.', 'One cone comes from spinning about a LEG.') },
        { id: 'c', label: L('silindr', 'цилиндр', 'a cylinder'), hint: L("Silindr to'rtburchakdan chiqadi.", 'Цилиндр выходит из прямоугольника.', 'A cylinder comes from a rectangle.') },
        { id: 'd', label: L('shar', 'шар', 'a ball'), hint: L("Shar yarim doiradan chiqadi.", 'Шар выходит из полукруга.', 'A ball comes from a half disc.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits. Oltita savol, va faqat shu ekran natijaga kiradi.", 'Блиц. Шесть вопросов, и только этот экран идёт в результат.', 'Quick round. Six questions, and only this screen counts.'),
  ],
}

// ============================================================
// SLAYD 13. XATONI TOPING. Uchdan bir unutilgan.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'third_coefficient',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L('Bir satr xato', 'Одна строка неверна', 'One line is wrong'),
  rows: [
    { id: 'r1', text: L('piramida: asos kvadrat, tomoni 6', 'пирамида: основание квадрат, сторона 6', 'a pyramid: square base, side 6') },
    { id: 'r2', text: L('balandlik 6', 'высота 6', 'height 6') },
    { id: 'r3', text: 'S = 36' },
    { id: 'r4', text: 'V = 36 · 6 = 216' },
    { id: 'r5', text: L('javob: 216', 'ответ: 216', 'answer: 216') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu shart, unda xato yo'q.", 'Это условие, ошибки в нём нет.', 'This is the problem, there is no error in it.'),
    r2: L("Bu ham shart.", 'Это тоже условие.', 'This is the problem too.'),
    r3: L("Asos yuzasi to'g'ri: olti kvadrat o'ttiz olti.", 'Площадь основания верна: шесть в квадрате тридцать шесть.', 'The base area is right: six squared is thirty six.'),
    r5: L("Oxirgi satr faqat ko'chirma.", 'Последняя строка только перепись.', 'The last line is just a copy.'),
  },
  proofPoint: L('uchdan bir tushib qolgan', 'потеряна треть', 'the third is missing'),
  proof: L(
    "Bu yozuv PRIZMANING hajmini beradi. Piramidada esa uchdan bir koeffitsiyenti turadi: o'ttiz olti karra olti bo'lingan uch, ya'ni yetmish ikki. Tekshiruv oson: piramida o'sha asos va balandlikdagi prizmadan kichik bo'lishi kerak, va uch barobar kichik.",
    'Эта запись даёт объём ПРИЗМЫ. А у пирамиды стоит коэффициент одна третья: тридцать шесть на шесть делить на три, то есть семьдесят два. Проверка простая: пирамида должна быть меньше призмы с тем же основанием и высотой, и меньше втрое.',
    'That record gives the volume of a PRISM. A pyramid carries the one third coefficient: thirty six times six over three, that is seventy two. The check is easy: a pyramid must be smaller than the prism on the same base and height, and smaller three times.',
  ),
  probe: {
    question: L('Xato nimada?', 'В чём ошибка?', 'What is the error?'),
    items: [
      { id: 'a', label: L('uchdan bir yo\'q', 'нет трети', 'the third is missing'), correct: true },
      { id: 'b', label: L('asos yuzasi xato', 'площадь основания неверна', 'the base area is wrong'), hint: L("Kvadratning yuzasi tomon kvadrati: o'ttiz olti.", 'Площадь квадрата это сторона в квадрате: тридцать шесть.', 'The area of a square is the side squared: thirty six.') },
      { id: 'c', label: L('balandlik xato', 'высота неверна', 'the height is wrong'), hint: L("Balandlik shartdan olingan, unda xato yo'q.", 'Высота взята из условия, ошибки в ней нет.', 'The height comes from the problem, there is no error in it.') },
      { id: 'd', label: L('javob to\'g\'ri', 'ответ верный', 'the answer is right'), hint: L("Javob prizmaning hajmi, piramida esa uch barobar kichik.", 'Ответ это объём призмы, а пирамида втрое меньше.', 'The answer is the prism volume, and a pyramid is three times smaller.') },
    ],
  },
  audio: [
    A('mount', "Masalalar tugadi. Endi boshqaning yechimiga qaraymiz.", 'Задачи закончились. Теперь посмотрим на чужое решение.', 'The problems are done. Now let us look at someone else solution.'),
    A('q1', "Diqqat: hamma hisob to'g'ri. Xato formulada.", 'Внимание: весь счёт верен. Ошибка в формуле.', 'Careful: all the arithmetic is right. The error is in the formula.'),
    A('proof', "Qarang: asos yuzasi to'g'ri, balandlik to'g'ri, ko'paytma ham to'g'ri hisoblangan. Lekin bu prizmaning formulasi. Piramida va konusda hajm uchdan birga ko'paytiriladi, va bu koeffitsiyent Kavalyeri natijasidan kelib chiqadi. To'g'ri javob yetmish ikki. Eng tez tekshiruv: piramida o'z prizmasidan uch barobar kichik.", 'Смотри: площадь основания верна, высота верна, произведение посчитано верно. Но это формула призмы. У пирамиды и конуса объём умножается на треть, и этот коэффициент следует из результата Кавальери. Верный ответ семьдесят два. Самая быстрая проверка: пирамида втрое меньше своей призмы.', 'Look: the base area is right, the height is right, the product is computed right. But that is the prism formula. For a pyramid and a cone the volume carries a third, a coefficient that follows from the Cavalieri result. The right answer is seventy two. The fastest check: a pyramid is three times smaller than its prism.'),
    A('q2', 'Xato nimada?', 'В чём ошибка?', 'What is the error?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const S14 = {
  role: 'build',
  led: 'student',
  tag: 'third_coefficient',
  right: '2/2',
  eyebrow: L('Teskari masala', 'Обратная задача', 'The reverse task'),
  title: L('Hajmni yig\'ing', 'Собери объём', 'Build the volume'),
  targetLabel: L('Asos va balandlik', 'Основание и высота', 'Base and height'),
  targetValue: 'S = 36,  h = 6',
  tasks: [
    {
      prompt: L('Prizma hajmi', 'Объём призмы', 'The volume of a prism'),
      template: ['V = ', { slot: 0 }],
      parts: ['216', '72', '108', '42'],
      answer: ['216'],
      doneLabel: 'V = 216',
      wrongs: [
        { key: '72', hint: L("Bu PIRAMIDAning hajmi: prizmada koeffitsiyent yo'q.", 'Это объём ПИРАМИДЫ: у призмы коэффициента нет.', 'That is the PYRAMID volume: a prism has no coefficient.') },
        { key: '108', hint: L("Yarim olingan, prizmada esa butun ko'paytma.", 'Взята половина, а у призмы полное произведение.', 'A half was taken, and a prism uses the full product.') },
        { key: '*', hint: L("Prizmada hajm asos yuzasi karra balandlik.", 'У призмы объём это площадь основания на высоту.', 'For a prism the volume is the base area times the height.') },
      ],
    },
    {
      prompt: L('Piramida hajmi', 'Объём пирамиды', 'The volume of a pyramid'),
      template: ['V = ', { slot: 0 }],
      parts: ['72', '216', '36', '18'],
      answer: ['72'],
      doneLabel: 'V = 72',
      wrongs: [
        { key: '216', hint: L("Bu prizma: uchdan bir qo'shilmagan.", 'Это призма: треть не учтена.', 'That is the prism: the third is missing.') },
        { key: '36', hint: L("O'ttiz olti bu asos yuzasi, balandlik ishlatilmagan.", 'Тридцать шесть это площадь основания, высота не использована.', 'Thirty six is the base area, the height is unused.') },
        { key: '*', hint: L("Ikki yuz o'n oltini uchga bo'lsak yetmish ikki chiqadi.", 'Двести шестнадцать поделить на три даёт семьдесят два.', 'Two hundred sixteen over three gives seventy two.') },
      ],
    },
  ],
  audio: [
    A('mount', "Oxirgi topshiriq: bir xil asos va balandlikda ikki hajm.", 'Последнее задание: два объёма при одинаковом основании и высоте.', 'The last task: two volumes on the same base and height.'),
    A('built1', "Endi piramida.", 'Теперь пирамида.', 'Now the pyramid.'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'third_coefficient',
  gapMap: true,
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L('Qayerda teshik bor', 'Где дырка', 'Where the gap is'),
  law: L('uchdan bir, k kvadrat, k kub', 'треть, k², k³', 'a third, k², k³'),
  ruleLines: [
    L('piramida va konusda uchdan bir', 'у пирамиды и конуса треть', 'a pyramid and a cone carry a third'),
    L('sirt k kvadratga, hajm k kubga', 'поверхность на k², объём на k³', 'a surface by k², a volume by k³'),
    L('qaysi o\'q, shunday jism', 'какая ось, такое тело', 'the axis decides the solid'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('konus silindrning qanchasi', 'какая часть цилиндра конус', 'what part of the cylinder'),
      right: '1/3',
      map: { a: '1/3', b: '1/2', c: '2/3', d: '1/4' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: L('yarim emas, uchdan bir', 'не половина, а треть', 'not a half but a third'),
  },
  levels: {
    full: L('Bu blok DTM da siz uchun yopildi', 'Этот блок на ДТМ у тебя закрыт', 'This block is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Xaritada ko\'rsatilgan darslarga qayting', 'Вернись к урокам, указанным в карте', 'Go back to the lessons named in the map'),
  },
  probe: {
    question: L(
      'Nima uchun uchdan bir paydo bo\'ladi?',
      'Почему появляется треть?',
      'Why does a third appear?',
    ),
    items: [
      { id: 'a', label: L('uchli jism kesimlari kichrayadi', 'у тела с вершиной сечения уменьшаются', 'a solid with an apex has shrinking sections'), correct: true },
      { id: 'b', label: L('shunday kelishilgan', 'так договорились', 'it is a convention'), hint: L("Kelishuv emas: koeffitsiyent kesimlar yuzasidan chiqadi.", 'Не договорённость: коэффициент выходит из площадей сечений.', 'Not a convention: the coefficient comes from the section areas.') },
      { id: 'c', label: L('uchta o\'lchov bor', 'три измерения', 'there are three dimensions'), hint: L("O'lchovlar prizmada ham uchta, lekin u yerda koeffitsiyent yo'q.", 'Измерений и у призмы три, но коэффициента там нет.', 'A prism has three dimensions too, and no coefficient.') },
      { id: 'd', label: L('asos uchburchak', 'основание треугольное', 'the base is a triangle'), hint: L("Asos kvadrat ham bo'lishi mumkin: koeffitsiyent baribir uchdan bir.", 'Основание может быть и квадратом: коэффициент всё равно треть.', 'The base may be a square: the coefficient is still a third.') },
    ],
  },
  sheetTitle: L('Stereometriya · shpargalka', 'Стереометрия · шпаргалка', 'Solid geometry · cheat sheet'),
  sheetSrc: L('11-sinf · 52-dars', '11 класс · урок 52', 'Grade 11 · lesson 52'),
  lifehack: L(
    "Uchi bor jismda uchdan bir bor: piramida va konus.",
    'Если у тела есть вершина, есть и треть: пирамида и конус.',
    'If a solid has an apex, it has a third: a pyramid and a cone.',
  ),
  holds: [3200, 5000, 6500],
  audio: [
    A('mount', "Sinov tugadi. Natijaga qaraymiz.", 'Проверка закончена. Смотрим результат.', 'The check is over. Let us look at the result.'),
    A('p1', "Mana taxminingiz va mana javob. Konus silindrning uchdan biri, va buni to'kish ko'rsatdi.", 'Вот твоя догадка и вот ответ. Конус это треть цилиндра, и это показало переливание.', 'Here is your guess and here is the answer. A cone is a third of the cylinder, as the pouring showed.'),
    A('rule', "O'ng tomonda kamchiliklar xaritasi. Uchta narsa esa har imtihonda uchraydi. Birinchisi: uchi bor jismda uchdan bir koeffitsiyenti turadi. Ikkinchisi: o'lchov o'zgarganda uzunlik k marta, sirt k kvadrat, hajm esa k kub marta o'zgaradi. Uchinchisi: aylanish jismini figura ham, o'q ham belgilaydi, va shartda o'q har doim yozilgan bo'ladi. Keyingi darsda vektorlar va koordinatalar.", 'Справа карта пробелов. А три вещи встречаются на каждом экзамене. Первая: у тела с вершиной стоит коэффициент одна третья. Вторая: при изменении масштаба длина растёт в k раз, поверхность в k в квадрате, объём в k в кубе. Третья: тело вращения определяют и фигура, и ось, а ось в условии всегда написана. На следующем уроке векторы и координаты.', 'On the right is your gap map. And three things appear in every exam. First: a solid with an apex carries the one third coefficient. Second: under a change of scale a length grows k times, a surface k squared, a volume k cubed. Third: a solid of revolution is decided by both the figure and the axis, and the axis is always written in the problem. The next lesson is vectors and coordinates.'),
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
