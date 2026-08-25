// ============================================================================
// 7-sinf, Dars 33. DEKART KOORDINATALAR SISTEMASI. B6 BLOKINI BOSHLAYDI.
// (Координатная плоскость)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// BLOKNING ASBOBI SHU DARSDA ISHGA TUSHADI: `Plane` -- koordinatalar
// tekisligi, etalon § 2 dagi 4-asbobning tor ko'rinishi. U bu darsda faqat
// bitta ish qiladi: NUQTA QO'YISH. Grafik keyingi darslarda keladi.
//
// NAZORATCHI SHUNDAN: nuqta o'quvchi bosgan joyga tushadi va uning
// koordinatalari YOZILADI. Ya'ni «uch va besh» ni almashtirib bosgan
// o'quvchi buni O'ZI ko'radi -- asbob «xato» demaydi, u nuqtani nomlaydi.
// Blokning birinchi xatosi (koordinatalarni almashtirish) shu bilan yopiladi.
//
// TAYYOR NUQTALAR IMZOSIZ turadi (`labels` default o'chiq): «koordinatani
// o'qing» topshirig'ida imzo javobni berib qo'yardi.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_33'
const LESSON_TITLE = L('Dekart koordinatalar sistemasi', 'Координатная плоскость', 'The coordinate plane')
const LESSON_NO = L('33-dars', 'Урок 33', 'Lesson 33')
const BLOCK = { label: L('B6-blok', 'Блок Б6', 'Block B6'), from: 33, to: 39, current: 33 }

// Maydon: nisbat kadrga mos (o'n ikki ga sakkiz), masshtab teng.
const BOX = { x0: -6, x1: 6, y0: -4, y1: 4 }

const TAGS = {
  Z1: L('koordinatalar almashtirildi', 'координаты перепутаны', 'the coordinates were swapped'),
  Z2: L('nuqta o\'qda turadi', 'точка стоит на оси', 'the point sits on an axis'),
  Z3: L('ishora va chorak', 'знак и четверть', 'the sign and the quadrant'),
  Z4: L('ikkinchi koordinata tushib qoldi', 'вторая координата потеряна', 'the second coordinate was lost'),
  Z5: L('o\'q nomi almashtirildi', 'оси перепутаны', 'the axes were mixed up'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Bitta juftlik, ikki xil qo'yilgan nuqta.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('KOORDINATALAR TEKISLIGI', 'КООРДИНАТНАЯ ПЛОСКОСТЬ', 'THE COORDINATE PLANE'),
  noBack: true,
  noNotes: true,
  title: L('Qaysi son birinchi', 'Какое число первое', 'Which number comes first'),
  gate: {
    source: { kind: 'plain', tokens: ['(3', ';', '5)'] },
    rows: [
      { tokens: ['(5', ';', '3)'], value: '5' },
      { tokens: ['(3', ';', '5)'], value: '3' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Ikkovi ham (3; 5) nuqtasini qo'ydi. Bittasi avval yuqoriga qadam tashladi, ikkinchisi avval o'ngga. Tabloda qo'yilgan nuqtaning ABSSISSASI turadi. Kim haq?",
      'Оба отмечали точку (3; 5). Один сначала шагнул вверх, другой сначала вправо. На табло — АБСЦИССА поставленной точки. Кто прав?',
      'Both marked the point (3; 5). One stepped up first, the other stepped right first. The boards show the ABSCISSA of the point they placed. Who is right?',
    ),
    items: [
      {
        id: 'right',
        label: L("Avval o'ngga qadam tashlagani", 'Тот, кто сначала шагнул вправо', 'The one who stepped right first'),
        hint: L(
          "Taxminingiz qabul qilindi. Tekislikda tekshiramiz.",
          'Прогноз принят. Проверим на плоскости.',
          'Your prediction is taken. We will check it on the plane.',
        ),
      },
      {
        id: 'up',
        label: L('Avval yuqoriga qadam tashlagani', 'Тот, кто сначала шагнул вверх', 'The one who stepped up first'),
        hint: L(
          "Juftlikda birinchi son x o'qi bo'yicha yoziladi. Tabloga qarang: unda abssissa beshga aylanib qolgan.",
          'В паре первое число пишется по оси x. Посмотри на табло: у него абсцисса стала пятёркой.',
          'In a pair the first number goes along the x axis. Look at the board: the abscissa became five.',
        ),
      },
      {
        id: 'both',
        label: L('Ikkovi ham: tartib muhim emas', 'Оба: порядок не важен', 'Both: the order does not matter'),
        hint: L(
          "Uch ; besh va besh ; uch bu ikki BOSHQA nuqta, va bu chizmada ko'rinadi.",
          'Три ; пять и пять ; три это две РАЗНЫЕ точки, и это видно на чертеже.',
          'Three ; five and five ; three are two DIFFERENT points, and the drawing shows it.',
        ),
      },
      {
        id: 'none',
        label: L("Ikki son bilan nuqtani qo'yib bo'lmaydi", 'По двум числам точку не поставить', 'Two numbers cannot fix a point'),
        hint: L(
          "Ikki son nuqtani aniq belgilaydi: biri x o'qi bo'yicha, ikkinchisi y o'qi bo'yicha.",
          'Два числа задают точку однозначно: одно по оси x, второе по оси y.',
          'Two numbers fix a point exactly: one along the x axis, the other along the y axis.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Ikki o'quvchi bitta juftlikni oldi va nuqtani boshqa joyga qo'ydi.", 'Два ученика взяли одну пару и поставили точку в разные места.', 'Two students took one pair and placed the point in different spots.'),
    A('mount', "Tabloda qo'yilgan nuqtaning abssissasi turadi: bittasida besh, ikkinchisida uch.", 'На табло абсцисса поставленной точки: у одного пять, у другого три.', 'The boards show the abscissa of the placed point: five for one, three for the other.'),
    A('mount', "Qaysi biri to'g'ri deb taxmin qilasiz.", 'Который из них верен, по-твоему.', 'Which of them do you predict is right.'),
  ],
}

// ============================================================
// 2. TAYANCH. Sonlar o'qi va ISHORA. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Sonlar o'qida manfiy uch nolning qaysi tomonida turadi?",
        'На числовой прямой минус три стоит по какую сторону от нуля?',
        'On the number line, which side of zero does minus three sit?',
      ),
      ok: L("Manfiy sonlar noldan chapda turadi.", 'Отрицательные числа стоят левее нуля.', 'Negative numbers sit to the left of zero.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('chapda, noldan uch qadam', 'слева, на три шага от нуля', 'to the left, three steps from zero'),
        },
        {
          id: 'b',
          tag: 'Z3',
          label: L("o'ngda, uch qadam", 'справа, на три шага', 'to the right, three steps'),
          hint: L("O'ngda musbat sonlar turadi.", 'Справа стоят положительные числа.', 'Positive numbers sit to the right.'),
        },
        {
          id: 'c',
          tag: 'Z3',
          label: L('nolning ustida', 'над нулём', 'above zero'),
          hint: L("Sonlar o'qi bitta chiziq, unda yuqori va past yo'q.", 'Числовая прямая это одна линия, в ней нет верха и низа.', 'A number line is one line, it has no up or down.'),
        },
        {
          id: 'd',
          tag: 'Z6',
          label: L('nolning o\'zida', 'в самом нуле', 'at zero itself'),
          hint: L("Manfiy uch noldan uch qadam narida.", 'Минус три на три шага от нуля.', 'Minus three is three steps from zero.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Sonlar o'qida nuqtani belgilash uchun nechta son kerak?",
        'Сколько чисел нужно, чтобы отметить точку на числовой прямой?',
        'How many numbers are needed to mark a point on a number line?',
      ),
      ok: L("Bitta son yetadi: o'q bitta.", 'Одного числа хватает: прямая одна.', 'One number is enough: there is one line.'),
      items: [
        { id: 'a', label: '1', correct: true },
        { id: 'b', label: '2', tag: 'Z4', hint: L("Ikkitasi tekislikda kerak bo'ladi, o'qda esa bittasi yetadi.", 'Два понадобятся на плоскости, а на прямой хватает одного.', 'Two are needed on a plane, one is enough on a line.') },
        { id: 'c', label: '0', tag: 'Z6', hint: L("Sonsiz nuqtani belgilab bo'lmaydi.", 'Без числа точку не отметить.', 'Without a number no point can be marked.') },
        { id: 'd', label: '3', tag: 'Z4', hint: L("Uchtasi ortiqcha: o'q bitta.", 'Три это лишнее: прямая одна.', 'Three is too many: there is one line.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Tekislikda nuqtani belgilash uchun nechta son kerak?",
        'Сколько чисел нужно, чтобы отметить точку на плоскости?',
        'How many numbers are needed to mark a point on a plane?',
      ),
      ok: L("Ikkita: biri x o'qi bo'yicha, ikkinchisi y o'qi bo'yicha.", 'Два: одно по оси x, второе по оси y.', 'Two: one along the x axis, the other along the y axis.'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '1', tag: 'Z4', hint: L("Bitta son bilan faqat o'q bo'yicha yurish mumkin, tekislikda esa yuqori va past ham bor.", 'С одним числом можно идти только по прямой, а на плоскости есть и верх, и низ.', 'One number moves you along a line only, but a plane has up and down too.') },
        { id: 'c', label: '3', tag: 'Z4', hint: L("Uchinchi son fazoda kerak bo'ladi, tekislikda emas.", 'Третье число понадобится в пространстве, а не на плоскости.', 'A third number is needed in space, not on a plane.') },
        { id: 'd', label: '4', tag: 'Z6', hint: L("To'rttasi ortiqcha.", 'Четыре это лишнее.', 'Four is too many.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch qisqa savol. Ikkinchisi va uchinchisi juftlik: o'qda va tekislikda.", 'Три коротких вопроса. Второй и третий это пара: на прямой и на плоскости.', 'Three short questions. The second and third are a pair: on a line and on a plane.'),
    A('1', "Ikkinchisi sonlar o'qi haqida.", 'Второй про числовую прямую.', 'The second is about the number line.'),
    A('2', "Uchinchisiga diqqat: bu bugungi darsning butun mavzusi.", 'Внимание на третий: это вся тема урока.', 'Watch the third: that is the whole topic of the lesson.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. NUQTA QO'YISH: avval x, keyin y.
// ============================================================
const S3 = {
  kind: 'plane',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Avval x, keyin y', 'Сначала x, потом y', 'x first, then y'),
  range: BOX,
  pick: { x: 3, y: 2 },
  caption: L(
    "(3; 2) nuqtasini belgilang: uch qadam x o'qi bo'yicha, keyin ikki qadam y o'qi bo'yicha.",
    'Отметь точку (3; 2): три шага по оси x, потом два по оси y.',
    'Mark the point (3; 2): three steps along the x axis, then two along the y axis.',
  ),
  options: [
    { id: 'a', label: L('birinchi chorak', 'первая четверть', 'the first quadrant') },
    { id: 'b', label: L('ikkinchi chorak', 'вторая четверть', 'the second quadrant') },
    { id: 'c', label: L('uchinchi chorak', 'третья четверть', 'the third quadrant') },
    { id: 'd', label: L("to'rtinchi chorak", 'четвёртая четверть', 'the fourth quadrant') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Ikkinchi chorakda abssissa manfiy bo'ladi, bu yerda esa u musbat uch.", 'Во второй четверти абсцисса отрицательна, а здесь она плюс три.', 'In the second quadrant the abscissa is negative, but here it is plus three.') },
    { key: 'c', tag: 'Z3', hint: L("Uchinchi chorakda ikki koordinata ham manfiy.", 'В третьей четверти обе координаты отрицательны.', 'In the third quadrant both coordinates are negative.') },
    { key: 'd', tag: 'Z3', hint: L("To'rtinchi chorakda ordinata manfiy bo'ladi.", 'В четвёртой четверти ордината отрицательна.', 'In the fourth quadrant the ordinate is negative.') },
  ],
  note: L(
    "Juftlikdagi birinchi son ABSSISSA, u x o'qi bo'yicha o'qiladi. Ikkinchisi ORDINATA, u y o'qi bo'yicha.",
    'Первое число пары это АБСЦИССА, она читается по оси x. Второе это ОРДИНАТА, по оси y.',
    'The first number of the pair is the ABSCISSA, read along the x axis. The second is the ORDINATE, along the y axis.',
  ),
  audio: [
    A('mount', "Tekislikda ikki o'q bor: gorizontal x va vertikal y. Ular nolda kesishadi.", 'На плоскости две оси: горизонтальная x и вертикальная y. Они пересекаются в нуле.', 'A plane has two axes: the horizontal x and the vertical y. They cross at zero.'),
    A('mount', "Nuqtani belgilang: avval x o'qi bo'yicha uch, keyin y o'qi bo'yicha ikki.", 'Отметь точку: сначала три по оси x, потом два по оси y.', 'Mark the point: three along the x axis first, then two along the y axis.'),
    A('dot', "Nuqta qo'yildi va koordinatalari yozildi. Endi u qaysi chorakda turganini ayting.", 'Точка поставлена, и её координаты записаны. Теперь скажи, в какой она четверти.', 'The point is placed and its coordinates are written. Now say which quadrant it is in.'),
  ],
}

// ============================================================
// 4. FARQLASH. O'SHA IKKI SON, boshqa nuqta.
// ============================================================
const S4 = {
  kind: 'plane',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Sonlar o\'sha, nuqta boshqa', 'Числа те же, точка другая', 'The same numbers, a different point'),
  range: BOX,
  dots: [{ x: 3, y: 2 }],
  labels: true,
  pick: { x: 2, y: 3 },
  caption: L(
    "(3; 2) allaqachon turibdi. Endi (2; 3) ni belgilang.",
    '(3; 2) уже стоит. Теперь отметь (2; 3).',
    '(3; 2) is already there. Now mark (2; 3).',
  ),
  options: [
    { id: 'a', label: L('bu ikki BOSHQA nuqta', 'это две РАЗНЫЕ точки', 'these are two DIFFERENT points') },
    { id: 'b', label: L('bu bitta nuqta', 'это одна и та же точка', 'this is the same point') },
    { id: 'c', label: L('ikkovi bir chorakda, demak bir xil', 'обе в одной четверти, значит одинаковы', 'both in one quadrant, so the same') },
    { id: 'd', label: L('ikkinchi nuqtani qo\'yib bo\'lmaydi', 'вторую точку поставить нельзя', 'the second point cannot be placed') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Chizmaga qarang: ular boshqa joyda turibdi.", 'Посмотри на чертёж: они стоят в разных местах.', 'Look at the drawing: they sit in different places.') },
    { key: 'c', tag: 'Z1', hint: L("Bir chorakda bo'lish yetarli emas: chorakda cheksiz nuqta bor.", 'Быть в одной четверти недостаточно: в четверти бесконечно много точек.', 'Being in one quadrant is not enough: a quadrant holds infinitely many points.') },
    { key: 'd', tag: 'Z6', hint: L("Qo'yildi va u birinchisidan yuqoriroq va chaproqda turibdi.", 'Поставилась, и она стоит выше и левее первой.', 'It was placed, and it sits higher and to the left of the first.') },
  ],
  note: L(
    "Juftlikdagi TARTIB nuqtaning joyini belgilaydi. Shuning uchun (3; 2) va (2; 3) hech qachon bir xil bo'lmaydi.",
    'ПОРЯДОК в паре задаёт место точки. Поэтому (3; 2) и (2; 3) никогда не совпадают.',
    'The ORDER in the pair fixes the place of the point. So (3; 2) and (2; 3) never coincide.',
  ),
  audio: [
    A('mount', "Sonlar o'sha ikkitasi, lekin tartib almashdi.", 'Числа те же два, но порядок поменялся.', 'The same two numbers, but the order changed.'),
    A('mount', "Yangi nuqtani belgilang va ikkovini solishtiring.", 'Отметь новую точку и сравни обе.', 'Mark the new point and compare the two.'),
    A('dot', "Ikki nuqta bir joyda turmadi.", 'Две точки не оказались в одном месте.', 'The two points did not land in one place.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Yo'l bo'yicha juftlikni yozish.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Yo\'ldan juftlikka', 'От шагов к паре', 'From steps to a pair'),
  given: L(
    "Nuqta noldan o'ngga to'rt qadam va pastga bir qadam narida turadi. Uning juftligini yozing.",
    'Точка стоит на четыре шага вправо от нуля и на один шаг вниз. Запиши её пару.',
    'A point sits four steps right of zero and one step down. Write its pair.',
  ),
  template: ['(', { slot: 0 }, '; ', { slot: 1 }, ')'],
  parts: [
    { id: 'a', label: '4' },
    { id: 'b', label: '−1' },
    { id: 'c', label: '−4' },
    { id: 'd', label: '1' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Avval abssissa, keyin ordinata.",
    'Сначала абсцисса, потом ордината.',
    'The abscissa first, then the ordinate.',
  ),
  checkNote: L(
    "O'ngga yurish abssissani musbat qiladi, pastga yurish ordinatani manfiy qiladi.",
    'Шаг вправо делает абсциссу положительной, шаг вниз делает ординату отрицательной.',
    'Stepping right makes the abscissa positive, stepping down makes the ordinate negative.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("O'ngga yurilgan, demak abssissa musbat.", 'Шли вправо, значит абсцисса положительна.', 'The step was to the right, so the abscissa is positive.') },
    { key: 'd', tag: 'Z3', hint: L("Pastga yurilgan, demak ordinata manfiy.", 'Шли вниз, значит ордината отрицательна.', 'The step was down, so the ordinate is negative.') },
    { key: '*', tag: 'Z1', hint: L("Birinchi o'rinda x bo'yicha son turadi.", 'На первом месте стоит число по оси x.', 'The first place holds the number along the x axis.') },
  ],
  audio: [
    A('mount', "Endi teskari yo'l: yo'l aytilgan, juftlikni o'zingiz yozasiz.", 'Теперь обратный путь: шаги названы, пару пишешь сам.', 'Now the inverse path: the steps are named, you write the pair.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. Uchinchi chorak: ikki koordinata ham manfiy.
// ============================================================
const S6 = {
  kind: 'plane',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Ikki manfiy son', 'Два отрицательных числа', 'Two negative numbers'),
  range: BOX,
  pick: { x: -3, y: -2 },
  caption: L(
    "(−3; −2) nuqtasini belgilang.",
    'Отметь точку (−3; −2).',
    'Mark the point (−3; −2).',
  ),
  options: [
    { id: 'a', label: L('uchinchi chorak', 'третья четверть', 'the third quadrant') },
    { id: 'b', label: L('birinchi chorak', 'первая четверть', 'the first quadrant') },
    { id: 'c', label: L('ikkinchi chorak', 'вторая четверть', 'the second quadrant') },
    { id: 'd', label: L("to'rtinchi chorak", 'четвёртая четверть', 'the fourth quadrant') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z3', hint: L("Birinchi chorakda ikki koordinata ham musbat.", 'В первой четверти обе координаты положительны.', 'In the first quadrant both coordinates are positive.') },
    { key: 'c', tag: 'Z3', hint: L("Ikkinchi chorakda ordinata musbat bo'ladi.", 'Во второй четверти ордината положительна.', 'In the second quadrant the ordinate is positive.') },
    { key: 'd', tag: 'Z3', hint: L("To'rtinchi chorakda abssissa musbat bo'ladi.", 'В четвёртой четверти абсцисса положительна.', 'In the fourth quadrant the abscissa is positive.') },
  ],
  note: L(
    "Chorakni ISHORALAR belgilaydi: ikkovi musbat -- birinchi, ikkovi manfiy -- uchinchi.",
    'Четверть задают ЗНАКИ: оба плюс — первая, оба минус — третья.',
    'The signs fix the quadrant: both plus is the first, both minus is the third.',
  ),
  audio: [
    A('mount', "Bu safar ikki son ham manfiy. Qayerga borishini o'ylab bosing.", 'На этот раз оба числа отрицательны. Подумай, куда идти, и нажми.', 'This time both numbers are negative. Think where to go and tap.'),
    A('dot', "Nuqta qo'yildi. Chorakni ayting.", 'Точка поставлена. Назови четверть.', 'The point is placed. Name the quadrant.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT: nuqta O'QDA turadi va hech qaysi chorakka
// kirmaydi.
// ============================================================
const S7 = {
  kind: 'plane',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Bir koordinata nol', 'Одна координата ноль', 'One coordinate is zero'),
  range: BOX,
  pick: { x: 0, y: 3 },
  caption: L(
    "(0; 3) nuqtasini belgilang. Abssissa nol: x o'qi bo'yicha qadam yo'q.",
    'Отметь точку (0; 3). Абсцисса ноль: по оси x шага нет.',
    'Mark the point (0; 3). The abscissa is zero: no step along the x axis.',
  ),
  options: [
    { id: 'a', label: L("y o'qida, hech qaysi chorakda emas", 'на оси y, ни в какой четверти', 'on the y axis, in no quadrant') },
    { id: 'b', label: L('birinchi chorakda', 'в первой четверти', 'in the first quadrant') },
    { id: 'c', label: L('ikkinchi chorakda', 'во второй четверти', 'in the second quadrant') },
    { id: 'd', label: L('bunday nuqta yo\'q', 'такой точки нет', 'there is no such point') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Birinchi chorak x o'qidan o'ngda boshlanadi, nuqta esa o'qning ustida turibdi.", 'Первая четверть начинается правее оси y, а точка стоит на самой оси.', 'The first quadrant starts right of the y axis, but the point sits on the axis itself.') },
    { key: 'c', tag: 'Z2', hint: L("Ikkinchi chorak o'qdan chapda, nuqta esa o'qda.", 'Вторая четверть левее оси, а точка на оси.', 'The second quadrant is left of the axis, and the point is on it.') },
    { key: 'd', tag: 'Z6', hint: L("Nol ham son: u x o'qi bo'yicha qadam yo'qligini bildiradi.", 'Ноль тоже число: он говорит, что шага по оси x нет.', 'Zero is a number too: it says there is no step along the x axis.') },
  ],
  note: L(
    "Bir koordinata nol bo'lsa, nuqta O'QDA turadi va choraklarga kirmaydi. Ikkovi nol bo'lsa -- bu koordinatalar boshi, nuqta O.",
    'Если одна координата ноль, точка стоит НА ОСИ и ни в какую четверть не входит. Если обе ноль — это начало координат, точка O.',
    'If one coordinate is zero the point sits ON an axis and belongs to no quadrant. If both are zero it is the origin, the point O.',
  ),
  audio: [
    A('mount', "Endi maxsus holat: abssissa nol.", 'Теперь особый случай: абсцисса ноль.', 'Now a special case: the abscissa is zero.'),
    A('mount', "Nol qadam yo'qligini bildiradi. Nuqtani belgilang.", 'Ноль означает, что шага нет. Отметь точку.', 'Zero means there is no step. Mark the point.'),
    A('dot', "Nuqta o'qning ustiga tushdi. Endi savolga javob bering.", 'Точка легла на саму ось. Теперь ответь на вопрос.', 'The point landed on the axis itself. Now answer the question.'),
  ],
}

// ============================================================
// 8. QOIDA.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z1',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L("birinchi son abssissa, x o'qi bo'yicha", 'первое число абсцисса, по оси x', 'the first number is the abscissa, along x') },
    { id: 'f2', label: L("ikkinchisi ordinata, y o'qi bo'yicha", 'второе ордината, по оси y', 'the second is the ordinate, along y') },
    { id: 'f3', label: L('juftlikdagi tartibni almashtirib bo\'lmaydi', 'порядок в паре менять нельзя', 'the order in the pair cannot be changed') },
    { id: 'f4', label: L("koordinata nol bo'lsa, nuqta o'qda turadi", 'если координата ноль, точка на оси', 'a zero coordinate puts the point on an axis') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval abssissa, keyin ordinata, keyin tartib haqidagi taqiq, oxirida nol holati.",
    'Порядок нарушен. Сначала абсцисса, потом ордината, потом запрет на перестановку, в конце случай нуля.',
    'The order is off. The abscissa first, then the ordinate, then the ban on swapping, and the zero case last.',
  ),
  lawChips: [
    { label: 'x', tone: 's2' },
    { label: 'y', tone: 's1' },
    { label: '( ; )', tone: 'par' },
    { label: '0', tone: 'off' },
  ],
  lawSweep: L(
    "abssissa, ordinata, juftlik, nol",
    'абсцисса, ордината, пара, ноль',
    'the abscissa, the ordinate, the pair, zero',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Tekislikdagi har nuqta ikki son bilan belgilanadi: birinchisi ABSSISSA va u x o'qi bo'yicha o'qiladi, ikkinchisi ORDINATA va u y o'qi bo'yicha o'qiladi.",
        'Каждая точка плоскости задаётся двумя числами: первое АБСЦИССА, она читается по оси x, второе ОРДИНАТА, по оси y.',
        'Every point of the plane is given by two numbers: the first is the ABSCISSA, read along the x axis, the second is the ORDINATE, along the y axis.',
      ),
      L(
        "Juftlikdagi tartib joyni belgilaydi, shuning uchun uni almashtirib bo'lmaydi. Bir koordinata nol bo'lsa nuqta o'qda turadi, ikkovi nol bo'lsa -- koordinatalar boshida.",
        'Порядок в паре задаёт место, поэтому его нельзя менять. Если одна координата ноль, точка на оси; если обе — в начале координат.',
        'The order in the pair fixes the place, so it cannot be swapped. One zero coordinate puts the point on an axis; two zeros put it at the origin.',
      ),
    ],
  },
  hookCap: L(
    'Birinchi son -- x bo\'yicha',
    'Первое число — по оси x',
    'The first number goes along x',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('abssissa birinchi', 'абсцисса первая', 'the abscissa is first'),
    L('ordinata ikkinchi', 'ордината вторая', 'the ordinate is second'),
    L("nol -- o'qda", 'ноль — на оси', 'zero means on an axis'),
  ],
  audio: [
    A('mount', "Uch holatni ko'rdik: tartib, ishoralar va nol. Endi qoidani yig'amiz.", 'Три случая мы увидели: порядок, знаки и ноль. Теперь соберём правило.', 'We have seen three cases: the order, the signs and zero. Now let us build the rule.'),
    A('ok', "To'g'ri. Keyingi darsda shu juftliklardan FUNKSIYA yasaladi.", 'Верно. На следующем уроке из этих пар получится ФУНКЦИЯ.', 'Correct. Next lesson these pairs will make a FUNCTION.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI. Chorak ISHORALAR bo'yicha aniqlanadi.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Chorakni ayting', 'Назови четверть', 'Name the quadrant'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "(−4; 2) nuqtasi qaysi chorakda?",
        'В какой четверти точка (−4; 2)?',
        'Which quadrant holds the point (−4; 2)?',
      ),
      ok: L("Abssissa manfiy, ordinata musbat: ikkinchi chorak.", 'Абсцисса отрицательна, ордината положительна: вторая четверть.', 'A negative abscissa and a positive ordinate: the second quadrant.'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '1', tag: 'Z3', hint: L("Birinchi chorakda abssissa musbat bo'lardi.", 'В первой четверти абсцисса была бы положительной.', 'In the first quadrant the abscissa would be positive.') },
        { id: 'c', label: '3', tag: 'Z3', hint: L("Uchinchi chorakda ordinata ham manfiy bo'lardi.", 'В третьей четверти ордината тоже была бы отрицательной.', 'In the third quadrant the ordinate would be negative too.') },
        { id: 'd', label: '4', tag: 'Z3', hint: L("To'rtinchi chorakda abssissa musbat, ordinata manfiy.", 'В четвёртой четверти абсцисса положительна, а ордината отрицательна.', 'In the fourth quadrant the abscissa is positive and the ordinate negative.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(1; −5) nuqtasi qaysi chorakda?",
        'В какой четверти точка (1; −5)?',
        'Which quadrant holds the point (1; −5)?',
      ),
      ok: L("Abssissa musbat, ordinata manfiy: to'rtinchi chorak.", 'Абсцисса положительна, ордината отрицательна: четвёртая четверть.', 'A positive abscissa and a negative ordinate: the fourth quadrant.'),
      items: [
        { id: 'a', label: '4', correct: true },
        { id: 'b', label: '1', tag: 'Z3', hint: L("Birinchi chorakda ordinata musbat bo'lardi.", 'В первой четверти ордината была бы положительной.', 'In the first quadrant the ordinate would be positive.') },
        { id: 'c', label: '2', tag: 'Z3', hint: L("Ikkinchi chorakda abssissa manfiy bo'lardi.", 'Во второй четверти абсцисса была бы отрицательной.', 'In the second quadrant the abscissa would be negative.') },
        { id: 'd', label: '3', tag: 'Z3', hint: L("Uchinchi chorakda ikkovi ham manfiy.", 'В третьей четверти обе отрицательны.', 'In the third quadrant both are negative.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(−2; −3) nuqtasi qaysi chorakda?",
        'В какой четверти точка (−2; −3)?',
        'Which quadrant holds the point (−2; −3)?',
      ),
      ok: L("Ikki koordinata ham manfiy: uchinchi chorak.", 'Обе координаты отрицательны: третья четверть.', 'Both coordinates are negative: the third quadrant.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '2', tag: 'Z3', hint: L("Ikkinchi chorakda ordinata musbat bo'lardi.", 'Во второй четверти ордината была бы положительной.', 'In the second quadrant the ordinate would be positive.') },
        { id: 'c', label: '4', tag: 'Z3', hint: L("To'rtinchi chorakda abssissa musbat bo'lardi.", 'В четвёртой четверти абсцисса была бы положительной.', 'In the fourth quadrant the abscissa would be positive.') },
        { id: 'd', label: '1', tag: 'Z3', hint: L("Birinchi chorakda ikkovi ham musbat.", 'В первой четверти обе положительны.', 'In the first quadrant both are positive.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(0; −4) nuqtasi qayerda turadi?",
        'Где стоит точка (0; −4)?',
        'Where does the point (0; −4) sit?',
      ),
      ok: L("Abssissa nol, demak nuqta y o'qida.", 'Абсцисса ноль, значит точка на оси y.', 'The abscissa is zero, so the point is on the y axis.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L("y o'qida", 'на оси y', 'on the y axis'),
        },
        {
          id: 'b',
          tag: 'Z2',
          label: L("to'rtinchi chorakda", 'в четвёртой четверти', 'in the fourth quadrant'),
          hint: L("Chorakda turish uchun ikki koordinata ham noldan farqli bo'lishi kerak.", 'Чтобы стоять в четверти, обе координаты должны быть не нулевыми.', 'To sit in a quadrant both coordinates must be non zero.'),
        },
        {
          id: 'c',
          tag: 'Z5',
          label: L("x o'qida", 'на оси x', 'on the x axis'),
          hint: L("x o'qida ORDINATA nol bo'ladi, bu yerda esa nol abssissada.", 'На оси x нулевая ОРДИНАТА, а здесь ноль у абсциссы.', 'On the x axis the ORDINATE is zero, here the abscissa is.'),
        },
        {
          id: 'd',
          tag: 'Z2',
          label: L('koordinatalar boshida', 'в начале координат', 'at the origin'),
          hint: L("Boshida ikki koordinata ham nol bo'ladi.", 'В начале координат обе координаты нулевые.', 'At the origin both coordinates are zero.'),
        },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Chorak ISHORALAR bilan aniqlanadi, chizmasiz.", 'Четыре вопроса. Четверть определяется ЗНАКАМИ, без чертежа.', 'Four questions. The quadrant is fixed by the SIGNS, with no drawing.'),
    A('1', "Ikkinchisida abssissa musbat.", 'Во втором абсцисса положительна.', 'In the second the abscissa is positive.'),
    A('2', "Uchinchisida ikkovi ham manfiy.", 'В третьем обе отрицательны.', 'In the third both are negative.'),
    A('3', "Oxirgisida nol bor.", 'В последнем есть ноль.', 'The last one has a zero.'),
  ],
}

// ============================================================
// 10. MASHQ 2. QADAMLAR ATALGAN: juftlik, keyin chorak.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Juftlik va chorak', 'Пара и четверть', 'The pair and the quadrant'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  given: L(
    "Nuqta noldan chapga besh qadam va yuqoriga ikki qadam narida.",
    'Точка стоит на пять шагов влево от нуля и на два шага вверх.',
    'A point sits five steps left of zero and two steps up.',
  ),
  template: ['(', { slot: 0 }, '; ', { slot: 1 }, ')'],
  parts: [
    { id: 'a', label: '−5' },
    { id: 'b', label: '2' },
    { id: 'c', label: '5' },
    { id: 'd', label: '−2' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Juftlikni yozing.",
    'Запиши пару.',
    'Write the pair.',
  ),
  checkNote: L(
    "Chapga yurish abssissani manfiy qiladi, yuqoriga yurish ordinatani musbat qoldiradi.",
    'Шаг влево делает абсциссу отрицательной, шаг вверх оставляет ординату положительной.',
    'A step left makes the abscissa negative, a step up keeps the ordinate positive.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("Chapga yurilgan, demak abssissa manfiy.", 'Шли влево, значит абсцисса отрицательна.', 'The step was left, so the abscissa is negative.') },
    { key: 'd', tag: 'Z3', hint: L("Yuqoriga yurilgan, demak ordinata musbat.", 'Шли вверх, значит ордината положительна.', 'The step was up, so the ordinate is positive.') },
    { key: '*', tag: 'Z1', hint: L("Birinchi o'rinda x bo'yicha son.", 'На первом месте число по оси x.', 'The first place holds the number along x.') },
  ],
  probe: {
    question: L('Bu nuqta qaysi chorakda?', 'В какой четверти эта точка?', 'Which quadrant is this point in?'),
    items: [
      { id: 'a', correct: true, label: '2' },
      { id: 'b', tag: 'Z3', label: '1', hint: L("Birinchi chorakda abssissa musbat bo'lardi.", 'В первой четверти абсцисса была бы положительной.', 'In the first quadrant the abscissa would be positive.') },
      { id: 'c', tag: 'Z3', label: '3', hint: L("Uchinchi chorakda ordinata manfiy bo'lardi.", 'В третьей четверти ордината была бы отрицательной.', 'In the third quadrant the ordinate would be negative.') },
      { id: 'd', tag: 'Z3', label: '4', hint: L("To'rtinchi chorakda abssissa musbat bo'lardi.", 'В четвёртой четверти абсцисса была бы положительной.', 'In the fourth quadrant the abscissa would be positive.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam. Avval juftlik, keyin chorak.", 'Два шага. Сначала пара, потом четверть.', 'Two steps. The pair first, then the quadrant.'),
    A('mount', "Yo'l aytilgan: chapga va yuqoriga.", 'Шаги названы: влево и вверх.', 'The steps are named: left and up.'),
    A('two', "Endi ikkinchi qadam: chorakni ayting.", 'Теперь второй шаг: назови четверть.', 'Now the second step: name the quadrant.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ. Juftlik SHART bo'yicha yig'iladi.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Shart bo\'yicha', 'По условию', 'From a condition'),
  given: L(
    "Nuqtaning abssissasi manfiy ikkiga teng, ordinatasi esa abssissadan ikki marta katta.",
    'Абсцисса точки равна минус двум, а ордината в два раза больше абсциссы.',
    'The abscissa of a point is minus two, and the ordinate is twice the abscissa.',
  ),
  template: ['(', { slot: 0 }, '; ', { slot: 1 }, ')'],
  parts: [
    { id: 'a', label: '−2' },
    { id: 'b', label: '−4' },
    { id: 'c', label: '2' },
    { id: 'd', label: '4' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Juftlikni yig'ing.",
    'Собери пару.',
    'Build the pair.',
  ),
  checkNote: L(
    "Manfiy ikkidan ikki marta katta son manfiy to'rt bo'ladi: ishora saqlanadi.",
    'В два раза больше, чем минус два, это минус четыре: знак сохраняется.',
    'Twice minus two is minus four: the sign is kept.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z3', hint: L("Abssissa manfiy deb berilgan.", 'Абсцисса дана отрицательной.', 'The abscissa is given as negative.') },
    { key: 'd', tag: 'Z3', hint: L("Manfiy sonni ikkiga ko'paytirsak manfiy qoladi.", 'Отрицательное число, умноженное на два, остаётся отрицательным.', 'A negative number times two stays negative.') },
    { key: '*', tag: 'Z1', hint: L("Avval abssissa, keyin ordinata.", 'Сначала абсцисса, потом ордината.', 'The abscissa first, then the ordinate.') },
  ],
  audio: [
    A('mount', "Bu safar yo'l aytilmaydi, shart beriladi.", 'На этот раз шаги не названы, дано условие.', 'This time the steps are not named, a condition is given.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Ikki koordinata TO'G'RI o'qilgan, lekin nuqta
// o'qda turgani hisobga olinmagan.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Ikki koordinata ham to'g'ri o'qilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Обе координаты прочитаны верно. И всё же какая строка ошибочна?',
    'Both coordinates are read right. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: L('nuqta: (0; −4)', 'точка: (0; −4)', 'point: (0; −4)') },
    { id: 'r2', text: 'x = 0' },
    { id: 'r3', text: 'y = −4' },
    { id: 'r4', text: L('nuqta chorakda yotadi', 'точка лежит в четверти', 'the point lies in a quadrant') },
    { id: 'r5', text: L("to'rtinchi chorak", 'четвёртая четверть', 'the fourth quadrant') },
  ],
  answerId: 'r4',
  hints: {
    r1: L("Bu boshlang'ich yozuv.", 'Это исходная запись.', 'That is the original record.'),
    r2: L("To'g'ri: birinchi son nol.", 'Верно: первое число ноль.', 'Right: the first number is zero.'),
    r3: L("To'g'ri: ikkinchi son manfiy to'rt.", 'Верно: второе число минус четыре.', 'Right: the second number is minus four.'),
      r5: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z2', r2: 'Z2', r3: 'Z2' , r5: 'Z2' },
  proofFill: {
    template: ['x = 0   →   ', { slot: 0 }],
    parts: [
      { id: 'a', label: L("y o'qida", 'на оси y', 'on the y axis') },
      { id: 'b', label: L("to'rtinchi chorak", 'четвёртая четверть', 'the fourth quadrant') },
      { id: 'c', label: L("x o'qida", 'на оси x', 'on the x axis') },
      { id: 'd', label: L('uchinchi chorak', 'третья четверть', 'the third quadrant') },
    ],
    answer: ['a'],
    prompt: L(
      "Abssissa nol bo'lsa nuqta qayerda turadi.",
      'Где стоит точка, если абсцисса ноль.',
      'Where the point sits when the abscissa is zero.',
    ),
    checkNote: L(
      "Abssissa nol bo'lsa, nuqta y o'qining ustida turadi va hech qaysi chorakka kirmaydi.",
      'Если абсцисса ноль, точка стоит на самой оси y и ни в одну четверть не входит.',
      'A zero abscissa puts the point on the y axis itself, in no quadrant at all.',
    ),
    wrongs: [
      { key: 'b', tag: 'Z2', hint: L("Chorakda turish uchun ikki koordinata ham noldan farqli bo'lishi kerak.", 'Чтобы быть в четверти, обе координаты должны быть не нулевыми.', 'To be in a quadrant both coordinates must be non zero.') },
      { key: 'c', tag: 'Z5', hint: L("x o'qida ordinata nol bo'ladi, bu yerda esa abssissa nol.", 'На оси x нулевая ордината, а здесь нулевая абсцисса.', 'On the x axis the ordinate is zero, here the abscissa is.') },
      { key: 'd', tag: 'Z2', hint: L("Uchinchi chorakda ikki koordinata ham manfiy bo'ladi.", 'В третьей четверти обе координаты отрицательны.', 'In the third quadrant both coordinates are negative.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda ikki koordinata ham to'g'ri o'qilgan.", 'В этой ловушке обе координаты прочитаны верно.', 'In this trap both coordinates are read right.'),
    A('mount', "Shunday bo'lsa ham javob noto'g'ri. Xato birinchi qaysi qatorda.", 'И всё же ответ неверен. В какой строке ошибка впервые.', 'And yet the answer is wrong. Which line has the mistake first.'),
    A('proof', "Topdingiz. Nol turgan joyda chorak yo'q.", 'Нашёл. Там, где стоит ноль, четверти нет.', 'You found it. Where a zero stands, there is no quadrant.'),
    A('done', "Nuqta o'qning ustida turadi.", 'Точка стоит на самой оси.', 'The point sits on the axis itself.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. XARITA: juftlik joyni belgilaydi.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L('KO\'CHIRISH', 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Xaritadagi joy', 'Место на карте', 'A place on the map'),
  given: L(
    "Xaritada ombor shunday turadi: abssissasi to'rtga teng, ordinatasi esa abssissaga qarama-qarshi son.",
    'На карте склад стоит так: его абсцисса равна четырём, а ордината это противоположное абсциссе число.',
    'On the map the depot sits so: its abscissa is four, and its ordinate is the opposite of the abscissa.',
  ),
  template: ['(', { slot: 0 }, '; ', { slot: 1 }, ')'],
  parts: [
    { id: 'a', label: '4' },
    { id: 'b', label: '−4' },
    { id: 'c', label: '0' },
    { id: 'd', label: '8' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ombor juftligini yozing.",
    'Запиши пару склада.',
    'Write the pair of the depot.',
  ),
  checkNote: L(
    "Qarama-qarshi son ishorasi bilan farq qiladi: to'rtga qarama-qarshi son manfiy to'rt. Nuqta to'rtinchi chorakda turadi.",
    'Противоположное число отличается знаком: противоположное четырём это минус четыре. Точка в четвёртой четверти.',
    'The opposite number differs by sign: the opposite of four is minus four. The point sits in the fourth quadrant.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z4', hint: L("Nol qarama-qarshi son emas: qarama-qarshi son ishorasi bilan farq qiladi.", 'Ноль это не противоположное число: противоположное отличается знаком.', 'Zero is not the opposite: the opposite differs by sign.') },
    { key: 'd', tag: 'Z6', hint: L("Qarama-qarshi son ikki marta katta emas, ishorasi boshqa.", 'Противоположное это не в два раза больше, а с другим знаком.', 'The opposite is not twice as big, it has the other sign.') },
    { key: '*', tag: 'Z1', hint: L("Avval abssissa, keyin ordinata.", 'Сначала абсцисса, потом ордината.', 'The abscissa first, then the ordinate.') },
  ],
  audio: [
    A('mount', "Xaritada joyni ham xuddi shunday belgilaydilar: ikki son bilan.", 'На карте место обозначают точно так же: двумя числами.', 'A place on a map is fixed the same way: by two numbers.'),
    A('mount', "Shart bo'yicha juftlikni yozing.", 'Запиши пару по условию.', 'Write the pair from the condition.'),
  ],
}

// ============================================================
// 14. BLITS. Baholanadigan YAGONA ekran.
// ============================================================
const S14 = {
  kind: 'blitz',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "(2; 5) va (5; 2) dan qaysi biri o'ngroqda turadi?",
        'Какая из точек (2; 5) и (5; 2) стоит правее?',
        'Which of the points (2; 5) and (5; 2) sits further right?',
      ),
      ok: L("O'ng-chapni ABSSISSA belgilaydi, va u beshga teng.", 'Право и лево задаёт АБСЦИССА, и она равна пяти.', 'Left and right are set by the ABSCISSA, and it equals five.'),
      items: [
        { id: 'a', label: '(5; 2)', correct: true },
        { id: 'b', label: '(2; 5)', tag: 'Z1', hint: L("Unda abssissa ikkiga teng, ya'ni u chaproqda.", 'У неё абсцисса равна двум, значит она левее.', 'Its abscissa is two, so it sits further left.') },
        {
          id: 'c',
          tag: 'Z1',
          label: L('ikkovi bir joyda', 'обе в одном месте', 'both in one place'),
          hint: L("Tartib almashsa, nuqta ham almashadi.", 'Если порядок меняется, меняется и точка.', 'Change the order and the point changes.'),
        },
        {
          id: 'd',
          tag: 'Z5',
          label: L("ordinataga qarash kerak", 'надо смотреть на ординату', 'the ordinate should be looked at'),
          hint: L("Ordinata yuqori va pastni belgilaydi, o'ng va chapni esa abssissa.", 'Ордината задаёт верх и низ, а право и лево абсцисса.', 'The ordinate sets up and down, the abscissa sets left and right.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(−3; −1) qaysi chorakda?",
        'В какой четверти (−3; −1)?',
        'Which quadrant holds (−3; −1)?',
      ),
      ok: L("Ikkovi manfiy: uchinchi chorak.", 'Обе отрицательны: третья четверть.', 'Both negative: the third quadrant.'),
      items: [
        { id: 'a', label: '3', correct: true },
        { id: 'b', label: '1', tag: 'Z3', hint: L("Birinchi chorakda ikkovi musbat.", 'В первой четверти обе положительны.', 'In the first quadrant both are positive.') },
        { id: 'c', label: '2', tag: 'Z3', hint: L("Ikkinchi chorakda ordinata musbat.", 'Во второй четверти ордината положительна.', 'In the second quadrant the ordinate is positive.') },
        { id: 'd', label: '4', tag: 'Z3', hint: L("To'rtinchi chorakda abssissa musbat.", 'В четвёртой четверти абсцисса положительна.', 'In the fourth quadrant the abscissa is positive.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "(0; 0) nuqtasi nima deb ataladi?",
        'Как называется точка (0; 0)?',
        'What is the point (0; 0) called?',
      ),
      ok: L("Ikki o'q shu yerda kesishadi.", 'Обе оси пересекаются именно здесь.', 'Both axes cross exactly here.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('koordinatalar boshi', 'начало координат', 'the origin'),
        },
        {
          id: 'b',
          tag: 'Z2',
          label: L('birinchi chorak', 'первая четверть', 'the first quadrant'),
          hint: L("Chorakda ikki koordinata ham noldan farqli bo'ladi.", 'В четверти обе координаты не нулевые.', 'In a quadrant both coordinates are non zero.'),
        },
        {
          id: 'c',
          tag: 'Z5',
          label: L("x o'qining oxiri", 'конец оси x', 'the end of the x axis'),
          hint: L("O'qning oxiri yo'q, u strelka bilan davom etadi.", 'У оси нет конца, она продолжается стрелкой.', 'An axis has no end, it continues with an arrow.'),
        },
        {
          id: 'd',
          tag: 'Z2',
          label: L('bunday nuqta yo\'q', 'такой точки нет', 'there is no such point'),
          hint: L("Bor: ikki o'qning kesishgan joyi.", 'Есть: это место пересечения двух осей.', 'There is: it is where the two axes cross.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Tekislikdagi nuqtani nechta son belgilaydi?",
        'Сколько чисел задают точку на плоскости?',
        'How many numbers fix a point on a plane?',
      ),
      ok: L("Ikkita, va ularning tartibi muhim.", 'Два, и их порядок важен.', 'Two, and their order matters.'),
      items: [
        { id: 'a', label: '2', correct: true },
        { id: 'b', label: '1', tag: 'Z4', hint: L("Bitta son o'qda yetadi, tekislikda esa yo'q.", 'Одного числа хватает на прямой, а на плоскости нет.', 'One number is enough on a line, not on a plane.') },
        { id: 'c', label: '3', tag: 'Z4', hint: L("Uchinchi son fazoda kerak.", 'Третье число нужно в пространстве.', 'A third number is needed in space.') },
        { id: 'd', label: '4', tag: 'Z6', hint: L("To'rttasi ortiqcha.", 'Четыре это лишнее.', 'Four is too many.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Darsning yagona baholanadigan ekrani.", 'Блиц, четыре вопроса. Единственный оцениваемый экран урока.', 'Quick round, four questions. The only graded screen of the lesson.'),
    A('1', "Ikkinchisi chorak haqida.", 'Второй про четверть.', 'The second is about a quadrant.'),
    A('2', "Uchinchisi nol haqida.", 'Третий про ноль.', 'The third is about zero.'),
    A('3', "Oxirgisi butun darsning savoli.", 'Последний это вопрос всего урока.', 'The last is the question of the whole lesson.'),
  ],
}

// ============================================================
// 15. YAKUN. B6 BLOKI BOSHLANDI.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Birinchi son -- x bo\'yicha', 'Первое число — по оси x', 'The first number goes along x'),
  gate: S1.gate,
  fix: {
    tokens: ['(3', ';', '5)'],
    value: '3',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Juftlikdagi birinchi son abssissa, u x o'qi bo'yicha o'qiladi. Shuning uchun avval o'ngga uch qadam, keyin yuqoriga besh qadam.",
    'Первое число пары это абсцисса, она читается по оси x. Поэтому сначала три шага вправо, потом пять вверх.',
    'The first number of the pair is the abscissa, read along the x axis. So three steps right first, then five up.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    right: L("avval o'ngga", 'сначала вправо', 'right first'),
    up: L('avval yuqoriga', 'сначала вверх', 'up first'),
    both: L('tartib muhim emas', 'порядок не важен', 'the order does not matter'),
    none: L("nuqtani qo'yib bo'lmaydi", 'точку не поставить', 'the point cannot be placed'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['(3; 2) → 1', '(2; 3) → 1', '(−3; −2) → 3', '(0; 3) → 0'],
  twoLabel: L('B6 bloki boshlandi', 'Блок Б6 начат', 'Block B6 has begun'),
  twoA: L(
    "birinchi son  →  x bo'yicha",
    'первое число  →  по оси x',
    'the first number  →  along x',
  ),
  twoB: L(
    "koordinata nol  →  nuqta o'qda",
    'координата ноль  →  точка на оси',
    'a zero coordinate  →  the point is on an axis',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    'funksiya tushunchasi',
    'понятие функции',
    'the idea of a function',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz. Yuqori tabloni bosib tuzating.", 'Вернёмся к началу. Вот что ты предполагал. Нажми на верхнее табло и исправь.', 'Back to the start. This is what you predicted. Tap the upper board and put it right.'),
    A('mount', "Bugungi ish bitta tartibdan chiqdi: birinchi son x bo'yicha, ikkinchisi y bo'yicha.", 'Вся сегодняшняя работа вышла из одного порядка: первое число по x, второе по y.', 'All of today came from one order: the first number along x, the second along y.'),
    A('mount', "Keyingi darsda shu juftliklardan funksiya yasaladi.", 'На следующем уроке из этих пар получится функция.', 'Next lesson these pairs will make a function.'),
  ],
}

export default makeLesson({
  id: LESSON_ID,
  title: LESSON_TITLE,
  no: LESSON_NO,
  block: BLOCK,
  tags: TAGS,
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
