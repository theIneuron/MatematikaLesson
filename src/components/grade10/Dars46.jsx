// ============================================================================
// 10-sinf, Dars 46. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS46_KONTENT.md
// Ma'lumot (ovoz, kadrlar, variantlar, razborlar, qoida, yakun) tayyor.
// EKRAN TANALARI esa `TODO` bo'lib qoldi: asbob va figurani tanlash --
// matematik qaror, va u avtomatlashtirilmaydi (etalon §5.3).
//
// Tartib: tanalarni to'ldirish, keyin `grade10-lesson-audit.mjs`, keyin
// tez yarus (2 o'lcham), keyin to'liq prognon. Har yangi figura oldin
// `probe/figures.html` stendida suratga olinadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Col, Cols, Expr, L, Panel, Slot } from './core.jsx'
import {
  A,
  BlitzBody,
  HookBody,
  RuleBody,
  Screen,
  SummaryBody,
  makeLesson,
} from './screens.jsx'
import {
  AuditRows,
  MatchPairs,
  MultiPick,
  NoteList,
  NumberEntry,
  OrderRow,
  ProbeChain,
  ProofRows,
  Scene,
  SpinScene,
} from './tools.jsx'

import { Space } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 46
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Piramida`,
  `Урок ${LESSON_NO}. Пирамида`,
  `Lesson ${LESSON_NO}. The pyramid`,
)

const BLOCK = { label: 'B7', from: 44, to: 49, current: 46 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('PIRAMIDA', 'ПИРАМИДА', 'THE PYRAMID'),
  title: L('Apofema yoki yon qirra', 'Апофема или боковое ребро', 'The apothem or the lateral edge'),
  audio: [
    A('mount', "Muntazam piramida. Uchdan ikki kesma o'tkazilgan: biri asos tomonining uchiga, ikkinchisi o'rtasiga.", 'Правильная пирамида. Из вершины проведены два отрезка: один в конец стороны основания, другой в её середину.', 'A regular pyramid. Two segments are drawn from the apex: one to the end of a base side, the other to its middle.'),
    A('r1', "Birinchi yozuv o'rtaga boradigan kesma uzunroq deydi.", 'Первая запись говорит, что отрезок в середину длиннее.', 'The first reading says the segment to the middle is longer.'),
    A('r2', 'Ikkinchisi u qisqaroq deydi.', 'Вторая говорит, что он короче.', 'The second says it is shorter.'),
    A('ask', "Chizmada ular deyarli ustma-ust tushadi. Sizningcha qaysi yozuv to'g'ri?", 'На чертеже они почти совпадают. Как думаешь, какая запись верная?', 'On the drawing they almost coincide. Which reading do you think is right?'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi piramidani buramiz.', 'Твой ответ записан. Сейчас повернём пирамиду.', 'Your answer is recorded. Now we rotate the pyramid.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('apofema uzunroq', 'апофема длиннее', 'the apothem is longer'),
      value: 'SM > SA',
    },
    b: {
      name: L('apofema qisqaroq', 'апофема короче', 'the apothem is shorter'),
      value: 'SM < SA',
    },
  },
  expr: 'SM,   SA',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Piramidadan oldin uch savol', 'Три вопроса перед пирамидой', 'Three questions before the pyramid'),
  tag: 'support',
  audio: [
    A('mount', "Uchta savol. Apofema paydo bo'lganda ikkinchisi va uchinchisi kerak bo'ladi.", 'Три вопроса. Второй и третий понадобятся, когда появится апофема.', 'Three questions. The second and third will be needed when the apothem appears.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Parallelepipedning nechta yog'i bor?", 'Сколько граней у параллелепипеда?', 'How many faces does a parallelepiped have?'),
      done: '4 + 2 = 6',
      items: [
        { id: 'a', label: L('oltita', 'шесть', 'six'), correct: true },
        { id: 'b', label: L("to'rtta", 'четыре', 'four'), hint: L("To'rtta yon yoqlar, asoslarsiz.", 'Четыре это боковые грани, без оснований.', 'Four are the lateral faces, without the bases.') },
        { id: 'c', label: L('sakkizta', 'восемь', 'eight'), hint: L('Sakkiz uchlar soni.', 'Восемь это число вершин.', 'Eight is the number of vertices.') },
        { id: 'd', label: L("o'n ikkita", 'двенадцать', 'twelve'), hint: L("O'n ikki qirralar soni.", 'Двенадцать это число рёбер.', 'Twelve is the number of edges.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Uch perpendikulyar haqidagi teorema nima beradi?', 'Что даёт теорема о трёх перпендикулярах?', 'What does the theorem of three perpendiculars give?'),
      done: 'c ⊥ BC ⇔ c ⊥ AC',
      items: [
        { id: 'a', label: L("perpendikulyarlikni proyeksiyadan og'maga o'tkazadi", 'переносит перпендикулярность с проекции на наклонную', 'it carries perpendicularity from the projection to the oblique'), correct: true },
        { id: 'b', label: L('uzunliklarni solishtiradi', 'сравнивает длины', 'it compares lengths'), hint: L("Unda uzunliklar haqida gap yo'q.", 'Про длины в ней речи нет.', 'It says nothing about lengths.') },
        { id: 'c', label: L('balandlik quradi', 'строит высоту', 'it builds the height'), hint: L('Perpendikulyar unda allaqachon berilgan.', 'Перпендикуляр в ней уже дан.', 'The perpendicular is already given in it.') },
        { id: 'd', label: L('burchaklarni hisoblaydi', 'считает углы', 'it computes angles'), hint: L("U to'g'ri burchakni o'tkazadi, hisoblamaydi.", 'Она переносит прямой угол, а не считает.', 'It carries a right angle over, it does not compute.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Nuqtadan tekislikkacha bo'lgan masofa nima?", 'Что такое расстояние от точки до плоскости?', 'What is the distance from a point to a plane?'),
      done: 'ρ = AB',
      items: [
        { id: 'a', label: L('perpendikulyar uzunligi', 'длина перпендикуляра', 'the length of the perpendicular'), correct: true },
        { id: 'b', label: L("og'ma uzunligi", 'длина наклонной', 'the length of an oblique'), hint: L("Og'malar ko'p, va hammasi uzunroq.", 'Наклонных много, и все они длиннее.', 'There are many obliques and all are longer.') },
        { id: 'c', label: L('proyeksiya uzunligi', 'длина проекции', 'the length of the projection'), hint: L('Proyeksiya tekislikda yotadi.', 'Проекция лежит в плоскости.', 'The projection lies in the plane.') },
        { id: 'd', label: L("o'lchovlarning o'rtachasi", 'среднее из замеров', 'the average of measurements'), hint: L("Masofa eng qisqa yo'l.", 'Расстояние это самый короткий путь.', 'A distance is the shortest path.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Barcha yon yoqlar bitta uchda', 'Все боковые грани в одной вершине', 'All lateral faces at one vertex'),
  tag: 'kartinka-kak-dokazatelstvo',
  show: [
    [
      L("pastda ko'pburchak, bu asos", 'внизу многоугольник, это основание', 'a polygon below, that is the base'),
      L('tepada bitta nuqta', 'сверху одна точка', 'one point above'),
    ],
    [
      L('asosning har tomoni uchburchak beradi', 'каждая сторона основания даёт треугольник', 'each side of the base gives a triangle'),
      L('barcha uchburchaklar uchda tutashadi', 'все треугольники сходятся в вершине', 'all the triangles meet at the apex'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Pastda ko'pburchak, tepada bitta nuqta. Nuqtani asosning har uchi bilan tutashtiramiz.", 'Внизу многоугольник, сверху одна точка. Соединим точку с каждой вершиной основания.', 'A polygon below, one point above. Let us join the point to every vertex of the base.'),
    A('move', "Bir yog'i ko'pburchak, qolganlari umumiy uchli uchburchaklardan iborat jism chiqdi. Bu piramida, ta'rifi qirq beshinchi betda. Ko'pburchak asos, uchburchaklar yon yoqlar, umumiy nuqta esa piramidaning uchi deb ataladi. Prizmadan farqini sezing. Prizmada yon yoqlar parallelogramm va umumiy uch yo'q, bu yerda esa uchburchaklar va uch bitta. Piramidani buring va barcha yon yoqlar har qanday rakursda bir xil nuqtaga kelishiga ishonch hosil qiling.", 'Получилось тело, у которого одна грань многоугольник, а остальные треугольники с общей вершиной. Это и есть пирамида, определение на странице сорок пять. Многоугольник называется основанием, треугольники боковыми гранями, а общая точка вершиной пирамиды. Заметь разницу с призмой. У призмы боковые грани параллелограммы и общей вершины нет, а здесь треугольники и вершина одна. Поверни пирамиду и убедись, что все боковые грани приходят в одну и ту же точку при любом ракурсе.', 'We got a body with one face a polygon and the rest triangles with a common vertex. That is a pyramid, the definition is on page forty five. The polygon is called the base, the triangles the lateral faces, and the common point the apex. Note the difference from a prism. A prism has parallelograms as lateral faces and no common vertex, here we have triangles and a single apex. Rotate the pyramid and see that all lateral faces arrive at the same point at any view.'),
    A('work', "O'zingiz hisoblang. To'rtburchakli piramidaning nechta yog'i bor?", 'Посчитай сам. Сколько граней у четырёхугольной пирамиды?', 'Work it out yourself. How many faces does a quadrilateral pyramid have?'),
  ],
  work: {
    prompt: L('Nechta yoq?', 'Сколько граней?', 'How many faces?'),
    ok: L("Beshta. Asos va to'rt uchburchak.", 'Пять. Основание и четыре треугольника.', 'Five. The base and four triangles.'),
    hint: [
      L('Asosni yonlaridan alohida sanang.', 'Считай основание отдельно от боковых.', 'Count the base separately from the lateral faces.'),
      L('Yonlari asos tomonlari qanchaligicha.', 'Боковых столько же, сколько сторон у основания.', 'There are as many lateral faces as base sides.'),
      L("Bir qo'shuv to'rt.", 'Один плюс четыре.', 'One plus four.'),
    ],
    answer: '5',
  },
  expr: '1 + 4 = 5',
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Muntazam ikki shart talab qiladi', 'Правильная требует двух условий', 'A regular one needs two conditions'),
  tag: 'svoystvo-vmesto-priznaka',
  show: [
    [
      L("asos muntazam bo'ldi", 'основание стало правильным', 'the base became regular'),
      L('lekin uch chetga surilgan', 'но вершина сдвинута в сторону', 'but the apex is shifted aside'),
    ],
    [
      L('uch markaz ustiga keldi', 'вершина встала над центром', 'the apex stood above the centre'),
      L('endi yon yoqlar teng', 'теперь боковые грани равны', 'now the lateral faces are equal'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Asosni muntazam ko'pburchak qilamiz, uchni esa hozircha surilgan qoldiramiz.", 'Сделаем основание правильным многоугольником, а вершину пока оставим сдвинутой.', 'Let us make the base a regular polygon and leave the apex shifted for now.'),
    A('move', "Asos muntazam, yon yoqlar esa boshqa-boshqa, chunki uch markaz ustida turmagan. Demak bitta shart kam. Asosi muntazam ko'pburchak va yon yoqlari o'zaro teng bo'lgan piramida muntazam deb ataladi. Qirq beshinchi betda shunday. Uchni asos markazi ustiga suramiz. Endi barcha yon qirralar teng, barcha yon yoqlar teng, va piramida muntazam bo'ldi. Uni buring va simmetriya har tomondan ko'rinishiga ishonch hosil qiling.", 'Основание правильное, а боковые грани разные, потому что вершина стоит не над центром. Значит одного условия мало. Правильной называется пирамида, у которой основание правильный многоугольник и боковые грани равны между собой. Так на странице сорок пять. Передвинем вершину над центр основания. Теперь все боковые рёбра равны, все боковые грани равны, и пирамида стала правильной. Поверни её и убедись, что симметрия видна с любой стороны.', 'The base is regular but the lateral faces differ, because the apex does not stand above the centre. So one condition is not enough. A pyramid is called regular if its base is a regular polygon and its lateral faces are equal to each other. So it is on page forty five. Let us move the apex above the centre of the base. Now all lateral edges are equal, all lateral faces are equal, and the pyramid has become regular. Rotate it and see that the symmetry shows from any side.'),
    A('work', "O'zingiz hisoblang. Muntazam piramida ta'rifida nechta shart bor?", 'Посчитай сам. Сколько условий в определении правильной пирамиды?', 'Work it out yourself. How many conditions are in the definition of a regular pyramid?'),
  ],
  work: {
    prompt: L('Nechta shart?', 'Сколько условий?', 'How many conditions?'),
    ok: L('Ikkita. Muntazam asos va teng yon yoqlar.', 'Два. Правильное основание и равные боковые грани.', 'Two. A regular base and equal lateral faces.'),
    hint: [
      L("Ikki kadr orasida nima o'zgarganini ko'ring.", 'Посмотри, что изменилось между двумя кадрами.', 'See what changed between the two frames.'),
      L('Bitta muntazam asos yetmadi.', 'Одного правильного основания не хватило.', 'A regular base alone was not enough.'),
      L('Ikkita.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
  expr: 'ABCD = muntazam,   SA = SB = SC = SD',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Apofema tomon o'rtasiga boradi", 'Апофема идёт в середину стороны', 'The apothem goes to the middle of the side'),
  tag: 'apofema-ne-rebro',
  show: [
    [
      L("uchdan tomon uchiga kesma o'tkazilgan", 'из вершины проведён отрезок в конец стороны', 'a segment is drawn from the apex to the end of a side'),
      L('bu yon qirra', 'это боковое ребро', 'that is the lateral edge'),
    ],
    [
      L("va tomon o'rtasiga kesma", 'и отрезок в середину стороны', 'and a segment to the middle of the side'),
      L('bu apofema, va u qisqaroq', 'это апофема, и она короче', 'that is the apothem, and it is shorter'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Muntazam piramidada uchdan asos tomoniga ko'p kesma o'tkazish mumkin. Ulardan ikkitasi alohida.", 'В правильной пирамиде из вершины можно провести много отрезков к стороне основания. Два из них особые.', 'In a regular pyramid many segments can be drawn from the apex to a base side. Two of them are special.'),
    A('move', "Birinchisi tomon uchiga boradi, bu yon qirra. Ikkinchisi o'rtasiga, va u apofema deb ataladi. Apofema piramida uchidan o'tkazilgan yon yoqning balandligi, qirq oltinchi betda shunday. U nima uchun asos tomoniga perpendikulyar ekanini biz allaqachon tushuntira olamiz. Uning proyeksiyasi asos markazidan tomon o'rtasigacha kesma, va u tomonga perpendikulyar, chunki muntazam ko'pburchakda o'rta shunday joylashgan. Keyin uch perpendikulyar haqidagi teorema ishlaydi, va to'g'ri burchak apofemaning o'ziga o'tadi. Piramidani buring va apofema yon yoqda, qirra esa uning chekkasida yotganini ko'ring.", 'Первый идёт в конец стороны, это боковое ребро. Второй в её середину, и он называется апофемой. Апофема это высота боковой грани, проведённая из вершины пирамиды, так на странице сорок шесть. Почему она перпендикулярна стороне основания, мы уже умеем объяснять. Её проекция это отрезок от центра основания к середине стороны, а он перпендикулярен стороне, потому что в правильном многоугольнике так устроена середина. Дальше работает теорема о трёх перпендикулярах, и прямой угол переносится на саму апофему. Поверни пирамиду и посмотри, что апофема лежит в боковой грани, а ребро на её краю.', 'The first goes to the end of the side, that is the lateral edge. The second goes to its middle, and it is called the apothem. The apothem is the height of a lateral face drawn from the apex of the pyramid, so it is on page forty six. Why it is perpendicular to the base side we can already explain. Its projection is the segment from the centre of the base to the middle of the side, and that is perpendicular to the side, because that is how the middle works in a regular polygon. Then the theorem of three perpendiculars takes over and the right angle carries onto the apothem itself. Rotate the pyramid and see that the apothem lies inside the lateral face while the edge is on its border.'),
    A('work', "O'zingiz hisoblang. Muntazam to'rtburchakli piramidaning nechta apofemasi bor?", 'Посчитай сам. Сколько апофем у правильной четырёхугольной пирамиды?', 'Work it out yourself. How many apothems does a regular quadrilateral pyramid have?'),
  ],
  work: {
    prompt: L('Nechta apofema?', 'Сколько апофем?', 'How many apothems?'),
    ok: L("To'rtta. Har yon yoqda bittadan, va hammasi teng.", 'Четыре. По одной в каждой боковой грани, и все они равны.', 'Four. One in each lateral face, and all of them are equal.'),
    hint: [
      L('Yon yoqlarni sanang.', 'Посчитай боковые грани.', 'Count the lateral faces.'),
      L("Har yon yoqda uchdan o'z balandligi bor.", 'В каждой боковой грани своя высота из вершины.', 'Each lateral face has its own height from the apex.'),
      L("To'rtta.", 'Четыре.', 'Four.'),
    ],
    answer: '4',
  },
  expr: 'SM ⊥ AB',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Balandlik orqali apofema', 'Апофема через высоту', 'The apothem through the height'),
  tag: 'apofema-ne-rebro',
  show: [
    [
      L('piramida balandligi markazda turadi', 'высота пирамиды стоит в центре', 'the height of the pyramid stands at the centre'),
      L("markazdan tomon o'rtasigacha uch", 'от центра до середины стороны три', 'from the centre to the middle of the side is three'),
    ],
    [
      L("balandlik to'rt", 'высота четыре', 'the height is four'),
      L("uchburchak to'g'ri burchakli", 'треугольник прямоугольный', 'the triangle is right-angled'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Muntazam piramidaning balandligi asos markazida turadi. Markazdan tomon o'rtasigacha uch, balandlik to'rt.", 'Высота правильной пирамиды стоит в центре основания. От центра до середины стороны три, высота четыре.', 'The height of a regular pyramid stands at the centre of the base. From the centre to the middle of a side is three, the height is four.'),
    A('move', "Bir kateti piramida balandligi, ikkinchisi markazdan tomon o'rtasigacha kesma, gipotenuzasi esa apofema bo'lgan uchburchakka qarang. To'g'ri burchak balandlik asosga kelgan joyda, chunki balandlik asos tekisligiga perpendikulyar, kesma esa shu tekislikda yotadi. Demak Pifagor ishlaydi. Uch va to'rt beshni beradi. E'tibor bering, yon qirra bu uchburchakda qatnashmaydi, uning o'z uchburchagi va o'z uzunligi bor.", 'Посмотри на треугольник, у которого один катет это высота пирамиды, второй отрезок от центра до середины стороны, а гипотенуза это апофема. Прямой угол там, где высота приходит в основание, потому что высота перпендикулярна плоскости основания, а отрезок лежит в этой плоскости. Значит работает Пифагор. Три и четыре дают пять. Обрати внимание, что боковое ребро в этом треугольнике не участвует, у него свой треугольник и своя длина.', 'Look at the triangle whose one leg is the height of the pyramid, the other is the segment from the centre to the middle of the side, and the hypotenuse is the apothem. The right angle is where the height arrives at the base, because the height is perpendicular to the plane of the base while the segment lies in that plane. So Pythagoras works. Three and four give five. Note that the lateral edge does not take part in this triangle, it has its own triangle and its own length.'),
    A('work', "O'zingiz hisoblang. Apofema qancha?", 'Посчитай сам. Какова апофема?', 'Work it out yourself. What is the apothem?'),
  ],
  work: {
    prompt: L('Apofemani toping', 'Найди апофему', 'Find the apothem'),
    ok: L("Besh. Uch va to'rt beshni beradi.", 'Пять. Три и четыре дают пять.', 'Five. Three and four give five.'),
    hint: [
      L("Gipotenuzasida apofema bo'lgan to'g'ri burchakli uchburchakni toping.", 'Найди прямоугольный треугольник с апофемой в гипотенузе.', 'Find the right triangle with the apothem as the hypotenuse.'),
      L('Katetlar balandlik va markazdan chiqqan kesma.', 'Катеты это высота и отрезок от центра.', 'The legs are the height and the segment from the centre.'),
      L("Uch va to'rt beshni beradi.", 'Три и четыре дают пять.', 'Three and four give five.'),
    ],
    answer: '5',
  },
  expr: 'SO = 4,   OM = 3,   SM = ?',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L('Balandlik qayerga tushadi', 'Куда падает высота', 'Where the height lands'),
  tag: 'apofema-ne-rebro',
  show: [
    [
      L('muntazam piramidada balandlik markazda', 'у правильной пирамиды высота в центре', 'in a regular pyramid the height is at the centre'),
      L('barcha yon qirralar teng', 'все боковые рёбра равны', 'all lateral edges are equal'),
    ],
    [
      L('uch chetga surildi', 'вершину сдвинули в сторону', 'the apex was shifted aside'),
      L("qirralar boshqa bo'ldi", 'рёбра стали разными', 'the edges became different'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Muntazam piramidada balandlik aynan asos markaziga keladi. Uchni surganda nima bo'lishini ko'ramiz.", 'У правильной пирамиды высота приходит точно в центр основания. Посмотрим, что будет, если вершину сдвинуть.', 'In a regular pyramid the height arrives exactly at the centre of the base. Let us see what happens if the apex is shifted.'),
    A('move', "Uch chetga ketishi bilanoq yon qirralar boshqa uzunlikda, yon yoqlar esa boshqa uchburchak bo'ldi. Oddiy ma'nodagi apofema endi yo'q, chunki yon yoqlarning balandliklari ham boshqa. Qoida shundan. Apofemani markaz orqali hisoblash faqat muntazam piramidada mumkin, va ko'z bilan emas, teng qirralar sharti bilan tekshirish kerak. Qimirlamas chizmada uchning surilishi deyarli sezilmaydi, va bu aynan perpendikulyarlik darsida tutgan xatomiz.", 'Как только вершина ушла в сторону, боковые рёбра стали разной длины, а боковые грани разными треугольниками. Апофем в обычном смысле больше нет, потому что высоты боковых граней теперь тоже разные. Отсюда правило. Считать апофему через центр можно только у правильной пирамиды, и проверять надо не глазом, а условием про равные рёбра. На неподвижном чертеже сдвиг вершины почти не заметен, и это ровно та ошибка, которую мы ловили в уроке про перпендикулярность.', 'As soon as the apex moved aside, the lateral edges got different lengths and the lateral faces became different triangles. There are no apothems in the usual sense any more, because the heights of the lateral faces now differ too. Hence the rule. The apothem can be computed through the centre only for a regular pyramid, and it has to be checked by the condition about equal edges rather than by eye. On a still drawing the shift of the apex is almost invisible, and that is exactly the mistake we caught in the lesson about perpendicularity.'),
    A('work', "O'zingiz hisoblang. Muntazam to'rtburchakli piramidada nechta yon qirra o'zaro teng?", 'Посчитай сам. Сколько боковых рёбер равны между собой у правильной четырёхугольной пирамиды?', 'Work it out yourself. How many lateral edges are equal to each other in a regular quadrilateral pyramid?'),
  ],
  work: {
    prompt: L('Nechta teng yon qirra?', 'Сколько равных боковых рёбер?', 'How many equal lateral edges?'),
    ok: L("To'rttasi ham. Uch markaz ustida, demak asos uchlarigacha masofalar teng.", 'Все четыре. Вершина над центром, значит расстояния до вершин основания равны.', 'All four. The apex is above the centre, so the distances to the base vertices are equal.'),
    hint: [
      L('Yon qirralarni sanang.', 'Посчитай боковые рёбра.', 'Count the lateral edges.'),
      L("Muntazam ko'pburchakning uchlari markazdan baravar uzoqlikda.", 'Вершины правильного многоугольника равноудалены от центра.', 'The vertices of a regular polygon are equidistant from the centre.'),
      L("To'rttasi ham.", 'Все четыре.', 'All four.'),
    ],
    answer: '4',
  },
  expr: 'SO ⊥ ABCD,   OA = OB = OC = OD',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Apofema va qirra', 'Апофема и ребро', 'The apothem and the edge'),
  tag: 'apofema-ne-rebro',
  motion: ['rule'],
  audio: [
    A('mount', 'Farqlashga bitta savol, keyin kartochka.', 'Один вопрос на различение, потом карточка.', 'One question to tell them apart, then the card.'),
    A('rule', "Apofema va yon qirra bir nuqtadan chiqadi va asosning bir tomoniga boradi, lekin uning boshqa nuqtalariga keladi. Qirra uchiga, apofema o'rtasiga. Apofema qisqaroq, chunki yon yoqda u katet, qirra esa o'sha to'g'ri burchakli uchburchakning gipotenuzasi. Shuning uchun masalalarda ularni bir-birining o'rniga qo'yish mumkin emas, chizmada deyarli ustma-ust tushgan bo'lsa ham.", 'Апофема и боковое ребро выходят из одной точки и идут к одной стороне основания, но приходят в разные её точки. Ребро в конец, апофема в середину. Апофема короче, потому что в боковой грани она катет, а ребро гипотенуза того же прямоугольного треугольника. Поэтому в задачах их нельзя подставлять одну вместо другой, даже когда на чертеже они почти совпали.', 'The apothem and the lateral edge leave the same point and go to the same base side, but arrive at different points of it. The edge at the end, the apothem at the middle. The apothem is shorter, because inside the lateral face it is a leg while the edge is the hypotenuse of the same right triangle. That is why they cannot be substituted for one another in problems, even when they almost coincide on the drawing.'),
  ],
  probe: {
    question: L('Apofema qayerga keladi?', 'Куда приходит апофема?', 'Where does the apothem arrive?'),
    items: [
      { id: 'a', label: L("asos tomonining o'rtasiga", 'в середину стороны основания', 'at the middle of a base side'), correct: true },
      { id: 'b', label: L('asosning uchiga', 'в вершину основания', 'at a vertex of the base'), hint: L('Uchga yon qirra keladi.', 'В вершину приходит боковое ребро.', 'It is the lateral edge that arrives at a vertex.') },
    ],
  },
  rule: {
    lawLabel: L('Apofema', 'Апофема', 'The apothem'),
    lines: [
      L("piramida ko'pburchak va umumiy uchli uchburchaklar", 'пирамида это многоугольник и треугольники с общей вершиной', 'a pyramid is a polygon and triangles with a common vertex'),
      L('muntazam piramida muntazam asos va teng yon yoqlar', 'правильная пирамида это правильное основание и равные боковые грани', 'a regular pyramid means a regular base and equal lateral faces'),
      L('apofema piramida uchidan yon yoq balandligi', 'апофема это высота боковой грани из вершины пирамиды', 'the apothem is the height of a lateral face from the apex'),
    ],
    law: 'SM < SA',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Har bir kesmani nomlang', 'Назови каждый отрезок', 'Name each segment'),
  tag: 'apofema-ne-rebro',
  audio: [
    A('mount', "To'rt yozuv va to'rt nom. Ularni birlashtiring.", 'Четыре записи и четыре названия. Соедини их.', 'Four readings and four names. Match them.'),
  ],
  match: {
    prompt: L('Yozuvni nomi bilan birlashtiring', 'Соедини запись с названием', 'Match the reading with the name'),
    ok: L("To'rttasi ham joyida. Apofema va qirra endi aralashmaydi.", 'Все четыре на месте. Апофема и ребро больше не путаются.', 'All four in place. The apothem and the edge no longer get mixed up.'),
    a: L('yon qirra', 'боковое ребро', 'a lateral edge'),
    b: L('apofema', 'апофема', 'the apothem'),
    c: L('piramida balandligi', 'высота пирамиды', 'the height of the pyramid'),
    d: L('asos tomoni', 'сторона основания', 'a base side'),
    left: ['SA', 'SM', 'SO', 'AB'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Yon qirralar haqida isbotlang', 'Докажи про боковые рёбра', 'Prove it about the lateral edges'),
  tag: 'apofema-ne-rebro',
  audio: [
    A('mount', "Uch qator, va har birining ro'yxatdan o'z asoslashi bor.", 'Три строки, и у каждой своё обоснование из списка.', 'Three lines, each with its own justification from the list.'),
  ],
  proof: {
    given: L('muntazam piramida', 'правильная пирамида', 'a regular pyramid'),
    goal: L('uning yon qirralari teng', 'её боковые рёбра равны', 'its lateral edges are equal'),
    r1: L('asos uchlari markazdan baravar uzoqlikda', 'вершины основания равноудалены от центра', 'the base vertices are equidistant from the centre'),
    r2: L('balandlik asosga perpendikulyar', 'высота перпендикулярна основанию', 'the height is perpendicular to the base'),
    r3: L("to'g'ri burchakli uchburchaklar ikki katet bo'yicha teng", 'прямоугольные треугольники равны по двум катетам', 'the right triangles are equal by two legs'),
    ok: L("Isbotlandi. Teng katetlar teng gipotenuza beradi, ya'ni teng qirra.", 'Доказано. Равные катеты дают равные гипотенузы, то есть равные рёбра.', 'Proved. Equal legs give equal hypotenuses, that is equal edges.'),
    e1: L('Balandlik keyin keladi. Avval asos haqida.', 'Высота идёт дальше. Сначала про основание.', 'The height comes later. First about the base.'),
    e2: L("Asos haqida aytildi. To'g'ri burchaklar qayerdan.", 'Про основание сказано. Откуда прямые углы.', 'The base is done. Where do the right angles come from.'),
    e3: L('Burchaklar va katetlar bor. Endi uchburchaklar haqida xulosa.', 'Углы и катеты есть. Теперь вывод про треугольники.', 'The angles and legs are there. Now the conclusion about the triangles.'),
  },
  reason: {
    s1: L("muntazam ko'pburchak xossasi", 'свойство правильного многоугольника', 'a property of a regular polygon'),
    s2: L("perpendikulyar tekislikning barcha chiziqlari bilan to'g'ri burchak beradi", 'перпендикуляр даёт прямой угол со всеми прямыми плоскости', 'a perpendicular gives a right angle with all lines of the plane'),
    s3: L("to'g'ri burchakli uchburchaklar tengligi alomati", 'признак равенства прямоугольных треугольников', 'the criterion of equality of right triangles'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: 'OA = OB   →   SA = SB',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO TOOL'),
  title: L('Hisob va tartib', 'Счёт и порядок', 'Counting and order'),
  tag: 'bumaga',
  audio: [
    A('mount', "Asbob olib qo'yildi. Qog'ozda hisoblaymiz.", 'Прибор убран. Считаем на бумаге.', 'The tool is put away. We count on paper.'),
    A('next', 'Endi yozuvlar tartibi. Ularni qanday hisoblansa, shunday joylashtiring.', 'Теперь порядок записей. Расставь их так, как считают.', 'Now the order of the readings. Arrange them the way they are computed.'),
  ],
  task: {
    ok: L("O'n uch. Besh va o'n ikki o'n uchni beradi.", 'Тринадцать. Пять и двенадцать дают тринадцать.', 'Thirteen. Five and twelve give thirteen.'),
    hint: [
      L('Balandlik va markazdan kesma bilan uchburchak chizing.', 'Нарисуй треугольник с высотой и отрезком от центра.', 'Draw the triangle with the height and the segment from the centre.'),
      L('Apofema gipotenuza.', 'Апофема это гипотенуза.', 'The apothem is the hypotenuse.'),
      L("Besh va o'n ikki o'n uchni beradi.", 'Пять и двенадцать дают тринадцать.', 'Five and twelve give thirteen.'),
    ],
    prompt: 'SO = 12,   OM = 5,   SM = ?',
    answer: '13',
  },
  order: {
    prompt: L('Yozuvlarni hisoblash tartibida joylashtiring', 'Расставь записи в том порядке, в каком считают', 'Arrange the readings in the order they are computed'),
    title: L('Hisob tartibi', 'Порядок счёта', 'The order of computing'),
    ok: L("Tartib to'g'ri. Avval tomonning yarmi, keyin apofema.", 'Порядок верный. Сначала половина стороны, потом апофема.', 'The order is right. First half the side, then the apothem.'),
    bad: L('Bu tartibda emas. Avval nima kerak.', 'Не в этом порядке. Что нужно раньше.', 'Not in this order. What is needed first.'),
    items: ['SM', 'AB', 'OM', 'SO'],
    answer: 'AB  OM  SO  SM',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato qatorni toping', 'Найди строку с ошибкой', 'Find the line with the mistake'),
  tag: 'check',
  audio: [
    A('mount', "To'rt qator, va ulardan biri kesmani almashtiradi.", 'Четыре строки, и одна из них подменяет отрезок.', 'Four lines, and one of them substitutes the segment.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("Berilganlar to'g'ri yozilgan.", 'Данные выписаны верно.', 'The data are written correctly.'),
    r2: L("Tomonning yarmi to'g'ri topilgan.", 'Половина стороны найдена верно.', 'Half the side is found correctly.'),
    r4: L('Javob yuqoridagi xato qatordan olingan.', 'Ответ получен из неверной строки выше.', 'The answer comes from the wrong line above.'),
  },
  proof: L("Piramidani buring: bu kesma tomon o'rtasiga emas, uchiga keladi.", 'Поверни пирамиду: этот отрезок приходит в вершину, а не в середину стороны.', 'Rotate the pyramid: this segment arrives at a vertex, not at the middle of the side.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L('Uchinchi. Apofema deb yon qirra aytilgan.', 'Третья. Апофемой назвали боковое ребро.', 'The third. The lateral edge was called the apothem.'),
    hint: [
      L('Har kesma qayerga kelishini tekshiring.', 'Проверь, куда приходит каждый отрезок.', 'Check where each segment arrives.'),
      L("Apofema tomon o'rtasiga keladi.", 'Апофема приходит в середину стороны.', 'The apothem arrives at the middle of the side.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'AB = 6,   SO = 4',
    r2: 'OM = 3',
    r3: 'SM = SA',
    r4: 'SM = 5',
  },
  answerId: 'r3',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Teskari tomonga', 'В обратную сторону', 'The other way round'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Formulani o'ngdan chapga o'qiymiz. Apofema bo'yicha balandlikni topamiz.", 'Прочитаем формулу справа налево. По апофеме найдём высоту.', 'Let us read the formula from right to left. From the apothem we find the height.'),
    A('work', "Muntazam piramida uchun to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны для правильной пирамиды. Их больше одной.', 'Mark all the readings that are true for a regular pyramid. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Muntazam piramida uchun nima to'g'ri", 'Что верно для правильной пирамиды', 'What is true for a regular pyramid'),
    ok: L('Beshtadan uch yozuv. Qolgan ikkitasi kesmalarni aralashtiradi.', 'Три записи из пяти. Две оставшиеся путают отрезки.', 'Three readings out of five. The other two confuse the segments.'),
    items: [
      { id: 'd', label: 'SM = SA', hint: L('Apofema qirradan qisqaroq, unga teng emas.', 'Апофема короче ребра, а не равна ему.', 'The apothem is shorter than the edge, not equal to it.') },
      { id: 'e', label: 'SO ⊥ ABCD,   O = A', hint: L('Balandlik markazga tushadi, asos uchiga emas.', 'Высота падает в центр, а не в вершину основания.', 'The height lands at the centre, not at a base vertex.') },
      { id: 'a', label: 'SM < SA', ok: true },
      { id: 'b', label: 'SM² = SO² + OM²', ok: true },
      { id: 'c', label: 'SA = SB = SC = SD', ok: true },
    ],
  },
  place: {
    prompt: L("Apofema o'n, markazdan tomon o'rtasigacha olti. Balandlik qancha?", 'Апофема десять, от центра до середины стороны шесть. Какова высота?', 'The apothem is ten, from the centre to the middle of the side is six. What is the height?'),
    ok: L("Sakkiz. Yuz minus o'ttiz olti bu oltmish to'rt.", 'Восемь. Сто минус тридцать шесть это шестьдесят четыре.', 'Eight. One hundred minus thirty six is sixty four.'),
    wrong: L('Apofema gipotenuza, demak uning kvadratidan ayiriladi.', 'Апофема гипотенуза, значит из её квадрата вычитают.', 'The apothem is the hypotenuse, so you subtract from its square.'),
    target: '8',
    step: '100 − 36 = 64',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'apofema-ne-rebro',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Piramidaning qaysi yoqlari yon?', 'Какие грани у пирамиды боковые?', 'Which faces of a pyramid are lateral?'),
      done: 'SAB,   SBC',
      items: [
        { id: 'a', label: L('umumiy uchli uchburchaklar', 'треугольники с общей вершиной', 'triangles with a common vertex'), correct: true },
        { id: 'b', label: L('parallelogrammlar', 'параллелограммы', 'parallelograms'), hint: L('Parallelogrammlar prizmada.', 'Параллелограммы у призмы.', 'Parallelograms belong to a prism.') },
        { id: 'c', label: L("ikki teng ko'pburchak", 'два равных многоугольника', 'two equal polygons'), hint: L('Bu prizmaning asoslari.', 'Это основания призмы.', 'Those are the bases of a prism.') },
        { id: 'd', label: L('barcha yoqlar', 'все грани', 'all the faces'), hint: L("Asos yon yoq bo'lmaydi.", 'Основание боковой гранью не бывает.', 'The base is never a lateral face.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Apofema qayerga keladi?', 'Куда приходит апофема?', 'Where does the apothem arrive?'),
      done: 'AM = MB',
      items: [
        { id: 'a', label: L("tomon o'rtasiga", 'в середину стороны', 'at the middle of a side'), correct: true },
        { id: 'b', label: L('asos uchiga', 'в вершину основания', 'at a base vertex'), hint: L('U yerga yon qirra keladi.', 'Туда приходит боковое ребро.', 'The lateral edge arrives there.') },
        { id: 'c', label: L('asos markaziga', 'в центр основания', 'at the centre of the base'), hint: L('Markazga balandlik keladi.', 'В центр приходит высота.', 'The height arrives at the centre.') },
        { id: 'd', label: L('tomonning istalgan nuqtasiga', 'в любую точку стороны', 'at any point of a side'), hint: L("Unda uning uzunligi aniq bo'lmasdi.", 'Тогда её длина не была бы определена.', 'Then its length would not be defined.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Muntazam piramidada nima qisqaroq?', 'Что короче в правильной пирамиде?', 'Which is shorter in a regular pyramid?'),
      done: 'SM < SA',
      items: [
        { id: 'a', label: L('apofema', 'апофема', 'the apothem'), correct: true },
        { id: 'b', label: L('yon qirra', 'боковое ребро', 'the lateral edge'), hint: L("Qirra o'sha uchburchakning gipotenuzasi.", 'Ребро гипотенуза того же треугольника.', 'The edge is the hypotenuse of that triangle.') },
        { id: 'c', label: L('ular teng', 'они равны', 'they are equal'), hint: L("Ular tomonning yarmi nol bo'lganda teng bo'lardi.", 'Равны они были бы при нулевой половине стороны.', 'They would be equal if half the side were zero.') },
        { id: 'd', label: L("piramidaga bog'liq", 'зависит от пирамиды', 'it depends on the pyramid'), hint: L('Har qanday muntazam piramidada apofema qisqaroq.', 'В любой правильной пирамиде апофема короче.', 'In any regular pyramid the apothem is shorter.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Oltiburchakli piramidaning nechta yog'i bor?", 'Сколько граней у шестиугольной пирамиды?', 'How many faces does a hexagonal pyramid have?'),
      done: '6 + 1 = 7',
      items: [
        { id: 'a', label: L('yettita', 'семь', 'seven'), correct: true },
        { id: 'b', label: L('oltita', 'шесть', 'six'), hint: L('Olti faqat yonlari.', 'Шесть это только боковые.', 'Six are only the lateral ones.') },
        { id: 'c', label: L('sakkizta', 'восемь', 'eight'), hint: L("Sakkiz oltiburchakli prizmada bo'lardi.", 'Восемь было бы у шестиугольной призмы.', 'Eight would belong to a hexagonal prism.') },
        { id: 'd', label: L("o'n ikkita", 'двенадцать', 'twelve'), hint: L("O'n ikki qirralar soni.", 'Двенадцать это число рёбер.', 'Twelve is the number of edges.') },
      ],
    },
  ],
  angles: ['SA', 'SM', 'SO', 'AB'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Endi nimani bilasiz', 'Что теперь умеешь', 'What you can do now'),
  audio: [
    A('mount', "Dars uchdan chiqqan ikki kesma bilan boshlandi. Biri tomon uchiga, ikkinchisi o'rtasiga borardi.", 'Урок начался с двух отрезков из вершины. Один шёл в конец стороны, другой в середину.', 'The lesson began with two segments from the apex. One went to the end of a side, the other to the middle.'),
    A('next', "O'rtasiga boradigani apofema deb ataladi, va u qisqaroq. Sabab oddiy. Yon yoqda apofema katet, qirra esa o'sha to'g'ri burchakli uchburchakning gipotenuzasi. Va yana bir muhim narsa. Apofema asos tomoniga chizma bo'yicha emas, tekisliklar bloki da isbotlagan uch perpendikulyar haqidagi teorema bo'yicha perpendikulyar. Keyin piramida va prizma yassi shaklga yoyiladi, va biz sirt yuzasini hisoblaymiz.", 'Тот, что в середину, называется апофемой, и он короче. Причина проста. В боковой грани апофема катет, а ребро гипотенуза того же прямоугольного треугольника. И ещё одно важное. Апофема перпендикулярна стороне основания не по чертежу, а по теореме о трёх перпендикулярах, которую мы доказали в блоке про плоскости. Дальше пирамида и призма развернутся в плоскую фигуру, и мы посчитаем площадь поверхности.', 'The one to the middle is called the apothem and it is shorter. The reason is simple. Inside the lateral face the apothem is a leg and the edge is the hypotenuse of the same right triangle. And one more important thing. The apothem is perpendicular to the base side not by the drawing but by the theorem of three perpendiculars, which we proved in the block about planes. Next the pyramid and the prism will unfold into a flat figure and we will compute the surface area.'),
  ],
  can: [
    L('Piramidaning yon yoqlari umumiy uchli uchburchak ekanini bilaman', 'Знаю, что боковые грани пирамиды треугольники с общей вершиной', 'I know the lateral faces of a pyramid are triangles with a common vertex'),
    L('Muntazam piramidada ikki shartni tekshiraman', 'Проверяю у правильной пирамиды два условия', 'I check two conditions for a regular pyramid'),
    L('Apofemani yon qirradan ajrataman', 'Отличаю апофему от бокового ребра', 'I tell the apothem from the lateral edge'),
    L("Apofemani balandlik va tomonning yarmi bo'yicha hisoblayman", 'Считаю апофему через высоту и половину стороны', 'I compute the apothem from the height and half the side'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L('Bundan keyin sirt yuzasi, jism yassi shaklga yoyiladi', 'Дальше площадь поверхности — тело разворачивается в плоскую фигуру', 'Next comes the surface area, where the body unfolds into a flat figure'),
  lifehack: L("Uchdan kesma olsangiz, avval u qayerga kelishini so'rang", 'Взял отрезок из вершины — сначала спроси, куда он приходит', 'Taking a segment from the apex, first ask where it arrives'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L('Geometriya, qirq beshinchi va qirq oltinchi betlar', 'Геометрия, страницы сорок пять и сорок шесть', 'Geometry, pages forty five and forty six'),
  hook: {
    a: 'SM > SA',
    b: 'SM < SA',
  },
  proved: 'SM < SA',
  law: 'SM ⊥ AB',
  sheet: [
    'SAB,   SBC',
    'SA = SB = SC = SD',
    'SM ⊥ AB',
    'SM² = SO² + OM²',
    'SM < SA',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/−/g, '-'))

// PRIBOR 6B. Piramida generator bilan: asos kvadrat (`plan`), uch esa `skew`
// bilan suriladi. Muntazam piramidada surish nol, 4 va 7-ekranlarda esa uch
// chetga suriladi -- aynan shu farq darsning chegarasi.
const H = 1.25
const Z = -H / 2
const PLAN = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]]
const PYR = { kind: 'pyramid', h: H, plan: PLAN }
const PYR_OFF = { kind: 'pyramid', h: H, plan: PLAN, skew: [0.36, 0.2] }

// `M` -- asos tomonining O'RTASI, `O` -- asos markazi. Ular generatordan
// chiqmaydi, chunki generator faqat uchlarni beradi.
const PTS = [
  { id: 'M', at: [0, -0.5, Z], label: 'M' },
  { id: 'O', at: [0, 0, Z], label: 'O' },
]
const GREY = '#7f8c8d'
const FACE2 = '#6b8fa3'

const BASE = [{ by: ['A', 'B', 'C', 'D'] }]
const BASE_SIDE = [{ by: ['A', 'B', 'C', 'D'] }, { by: ['A', 'B', 'S'], tone: FACE2 }]

const EDGE = { from: 'S', to: 'A' }
const APO = { from: 'S', to: 'M' }
const HGT = { from: 'S', to: 'O', tone: GREY, w: 2 }
const OM = { from: 'O', to: 'M', tone: GREY, w: 2 }
const TWO_SEG = [EDGE, APO]
const TRI_SOM = [APO, HGT, OM]
const ALL_SEG = [EDGE, APO, HGT, OM]

const RIGHT_O = { at: 'O', from: 'S', to: 'M' }
const RIGHT_M = { at: 'M', from: 'S', to: 'A', scale: 1.5 }

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const EQ_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const EQ_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => ({ id: PAIR_IDS[i], label: S9.match[k] }))

const ORD11 = S11.order.items.map((label, i) => ({ id: 'o' + i, label }))
const ORD11_ANS = String(S11.order.answer).split(/\s{2,}/)
  .map((lbl) => (ORD11.find((x) => x.label === lbl.trim()) || {}).id)

const TRAP_ROWS = ['r1', 'r2', 'r3', 'r4'].map((id) => ({ id, text: S12.row[id] }))

const REASONS = [
  { id: 's1', label: S10.reason.s1 },
  { id: 's2', label: S10.reason.s2 },
  { id: 's3', label: S10.reason.s3 },
  { id: 'pic', label: S10.reason.pic.label, missing: S10.reason.pic.missing },
]
const PROOF_ROWS = [
  { text: S10.proof.r1, reason: 's1', early: S10.proof.e1 },
  { text: S10.proof.r2, reason: 's2', early: S10.proof.e2 },
  { text: S10.proof.r3, reason: 's3', early: S10.proof.e3, ok: S10.proof.ok },
]

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Prognoz TURG'UN chizmada: aynan shunda yon qirralar esdan chiqadi.
        fig={() => (
          <Scene
            fig={<Space step={1} yaw={0.4} poly={PYR} pts={PTS} faces={BASE} segs={TWO_SEG} hide={['O']} />}
            max={172}
            h={172}
          />
        )}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.2}>
        <Col>
          <Scene
            fig={<Space step={1} yaw={0.4} poly={PYR} pts={PTS} faces={BASE} hide={['M', 'O']} />}
            max={240}
            h={158}
          />
        </Col>
        <Col>
          <ProbeChain items={S2.items} cols={2} audio={audio} onSolved={solve} />
        </Col>
      </Cols>
    )}
  </Screen>
)

const Screen3 = (p) => (
  <Screen data={S3} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S3.show.length && !solved ? (
      /* Kadr 1 -- bitta yoq, kadr 2 -- ikkinchisi ham: jism yassi
         ko'pburchaklardan yig'iladi. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.35 + phase * 0.4} poly={PYR} pts={PTS}
            faces={phase === 0 ? BASE : BASE_SIDE} hide={['M', 'O']}
          />
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={PYR} pts={PTS} faces={BASE_SIDE} hide={['M', 'O']} />}
        prompt={S3.work.prompt}
        answer={num(S3.work.answer)}
        okText={S3.work.ok}
        hints={S3.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      /* DARSNING SHOHIDI. Ikki yoq umumiy TOMONGA ega, va o'sha tomon --
         qirra. Qirra yoritilgan, ya'ni ikki yoqning chegarasi ko'rinadi. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.35} poly={phase === 0 ? PYR_OFF : PYR} pts={PTS}
            faces={BASE_SIDE} hide={['M', 'O']}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={PYR} pts={PTS} faces={BASE_SIDE} hide={['M', 'O']} />}
        prompt={S4.work.prompt}
        answer={num(S4.work.answer)}
        okText={S4.work.ok}
        hints={S4.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      <Scene
        fig={(
          <Space
            step={1} yaw={0.3 + phase * 0.45} poly={PYR} pts={PTS}
            faces={BASE_SIDE} hi={['AB']}
            segs={phase === 0 ? [EDGE] : TWO_SEG}
            angleAt={phase === 0 ? null : RIGHT_M}
            hide={['O']}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} poly={PYR} pts={PTS} faces={BASE_SIDE} hi={['AB']} segs={TWO_SEG} angleAt={RIGHT_M} hide={['O']} />}
        prompt={S5.work.prompt}
        answer={num(S5.work.answer)}
        okText={S5.work.ok}
        hints={S5.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} poly={PYR} pts={PTS} faces={BASE}
            segs={phase === 0 ? [OM, HGT] : TRI_SOM}
            angleAt={RIGHT_O}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} poly={PYR} pts={PTS} faces={BASE} segs={TRI_SOM} angleAt={RIGHT_O} />}
        prompt={S6.work.prompt}
        answer={num(S6.work.answer)}
        okText={S6.work.ok}
        hints={S6.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen7 = (p) => (
  <Screen data={S7} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S7.show.length && !solved ? (
      /* CHEGARA. Kadr 1 -- OG'MA prizma, kadr 2 -- to'g'ri. Farq faqat yon
         qirrada, va qimirlamas chizmada u deyarli ko'rinmaydi. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} poly={phase === 0 ? PYR : PYR_OFF} pts={PTS}
            faces={BASE} segs={[EDGE, HGT]} hide={['M']}
            angleAt={phase === 0 ? RIGHT_O : null}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={PYR} pts={PTS} faces={BASE} segs={[EDGE, HGT]} hide={['M']} angleAt={RIGHT_O} />}
        prompt={S7.work.prompt}
        answer={num(S7.work.answer)}
        okText={S7.work.ok}
        hints={S7.work.hint}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen8 = (p) => (
  <Screen data={S8} waitFor={['rule']} {...p}>
    {(s) => (
      <RuleBody
        {...s}
        data={S8}
        fig={(solved) => (
          <Scene
            fig={(
              <Space
                step={1} yaw={solved ? 0.8 : 0.35}
                poly={PYR} pts={PTS} faces={BASE_SIDE}
                segs={TWO_SEG} angleAt={solved ? RIGHT_M : null} hide={['O']}
              />
            )}
            max={330}
          />
        )}
      />
    )}
  </Screen>
)

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <MatchPairs
        prompt={S9.match.prompt}
        left={EQ_LEFT}
        right={EQ_RIGHT}
        okText={S9.match.ok}
        audio={audio}
        onSolved={solve}
      />
    )}
  </Screen>
)

const Screen10 = (p) => (
  <Screen data={S10} {...p}>
    {({ audio, solve }) => (
      <ProofRows
        given={S10.proof.given}
        goal={S10.proof.goal}
        rows={PROOF_ROWS}
        reasons={REASONS}
        audio={audio}
        onSolved={solve}
      />
    )}
  </Screen>
)

const Screen11 = (p) => (
  <Screen data={S11} {...p}>
    {({ audio, stage, setStage, setTitle, solve }) => (stage === 1 ? (
      <OrderRow
        prompt={S11.order.prompt}
        items={ORD11}
        answer={ORD11_ANS}
        okText={S11.order.ok}
        badText={S11.order.bad}
        audio={audio}
        onSolved={solve}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="big" style={{ textAlign: 'left' }}>{S11.task.prompt}</Expr>
          </Panel>
        </Col>
        <Col>
          <NumberEntry
            answer={num(S11.task.answer)}
            okText={S11.task.ok}
            hints={S11.task.hint}
            audio={audio}
            onSolved={() => setTimeout(() => { setTitle(S11.order.title); setStage(1) }, 1400)}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen12 = (p) => (
  <Screen data={S12} {...p}>
    {({ audio, stage, setStage, solve }) => (
      <Cols l={1.1} r={1}>
        <Col>
          <AuditRows
            rows={TRAP_ROWS}
            answerId={S12.answerId}
            hints={S12.hint}
            proof={S12.proof}
            hideProof
            audio={audio}
            onSolved={() => setStage(1)}
          />
        </Col>
        <Col>
          {stage === 1 ? (
            <NumberEntry
              compact
              prompt={S12.entry.prompt}
              answer={num(S12.entry.answer)}
              okText={S12.entry.ok}
              hints={S12.entry.hint}
              audio={audio}
              onSolved={solve}
            />
          ) : (
            <Slot mh={170} />
          )}
        </Col>
      </Cols>
    )}
  </Screen>
)

const Screen13 = (p) => (
  <Screen data={S13} {...p}>
    {({ audio, stage, setStage, setTitle, solve }) => (stage === 1 ? (
      <MultiPick
        prompt={S13.multi.prompt}
        items={S13.multi.items}
        okText={S13.multi.ok}
        audio={audio}
        onSolved={solve}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="mid">{S13.place.step}</Expr>
          </Panel>
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S13.place.prompt}
            answer={num(S13.place.target)}
            okText={S13.place.ok}
            hints={[S13.place.wrong]}
            audio={audio}
            onSolved={() => setTimeout(() => { setTitle(S13.multi.title); setStage(1) }, 1500)}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen14 = (p) => (
  <Screen data={S14} {...p}>
    {(s) => (
      <BlitzBody
        {...s}
        data={S14}
        fig={(round) => (
          <Scene
            fig={(
              <Space
                step={1} yaw={0.35 + round * 0.3}
                poly={PYR} pts={PTS} faces={BASE_SIDE}
                segs={round === 1 ? ALL_SEG : TWO_SEG}
                hide={round === 1 ? [] : ['O']}
              />
            )}
            max={260}
            h={168}
          />
        )}
      />
    )}
  </Screen>
)

const Screen15 = (p) => (
  <Screen data={S15} {...p}>
    {(s) => (
      <SummaryBody
        {...s}
        data={{
          ...S15,
          hookLabels: { a: S15.hook.a, b: S15.hook.b, both: '?', none: '?' },
          sheetSteps: S15.sheet,
        }}
        answers={p.answers}
      />
    )}
  </Screen>
)

const SCREENS = [
  Screen1, Screen2, Screen3, Screen4, Screen5,
  Screen6, Screen7, Screen8, Screen9, Screen10,
  Screen11, Screen12, Screen13, Screen14, Screen15,
]

export default makeLesson({
  meta: { id: LESSON_ID, no: LESSON_NO, title: LESSON_TITLE },
  block: BLOCK,
  screens: SCREENS,
  voice: 'm',
})
