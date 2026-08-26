// ============================================================================
// 10-sinf, Dars 45. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS45_KONTENT.md
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
const LESSON_NO = 45
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Parallelepiped`,
  `Урок ${LESSON_NO}. Параллелепипед`,
  `Lesson ${LESSON_NO}. The parallelepiped`,
)

const BLOCK = { label: 'B7', from: 44, to: 49, current: 45 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('DIAGONAL', 'ДИАГОНАЛЬ', 'THE DIAGONAL'),
  title: L("Ikki o'lcham yoki uch", 'Два измерения или три', 'Two dimensions or three'),
  audio: [
    A('mount', "To'g'ri burchakli parallelepiped. Bir uchdan qarama-qarshi uchga diagonal o'tkazilgan.", 'Прямоугольный параллелепипед. Из одной вершины проведена диагональ в противоположную вершину.', 'A rectangular box. From one vertex a diagonal is drawn to the opposite vertex.'),
    A('r1', "Birinchi yozuv ikki o'lchamni oladi.", 'Первая запись берёт два измерения.', 'The first reading takes two dimensions.'),
    A('r2', 'Ikkinchisi uchtasini oladi.', 'Вторая берёт три.', 'The second takes three.'),
    A('ask', "Chizmada diagonal yoq diagonaliga o'xshaydi. Sizningcha qaysi yozuv to'g'ri?", 'На чертеже диагональ похожа на диагональ грани. Как думаешь, какая запись верная?', 'On the drawing the diagonal looks like a face diagonal. Which reading do you think is right?'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi jismni buramiz.', 'Твой ответ записан. Сейчас повернём тело.', 'Your answer is recorded. Now we rotate the body.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('ikki', 'два', 'two'),
      value: 'd² = a² + b²',
    },
    b: {
      name: L('uch', 'три', 'three'),
      value: 'd² = a² + b² + c²',
    },
  },
  expr: 'AC₁',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L("O'tgan darsdan uch savol", 'Три вопроса из прошлого урока', 'Three questions from the last lesson'),
  tag: 'support',
  audio: [
    A('mount', 'Prizma haqida uch savol. Parallelepiped uning xususiy holi.', 'Три вопроса про призму. Параллелепипед это её частный случай.', 'Three questions about the prism. A parallelepiped is its special case.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Prizmaning asoslari nima?', 'Что такое основания призмы?', 'What are the bases of a prism?'),
      done: 'ABC = A₁B₁C₁',
      items: [
        { id: 'a', label: L('ikki teng yoq', 'две равные грани', 'two equal faces'), correct: true },
        { id: 'b', label: L('ikki pastdagi yoq', 'две нижние грани', 'the two lower faces'), hint: L("Past chizmaga bog'liq, asoslar esa yo'q.", 'Низ зависит от чертежа, а основания нет.', 'The bottom depends on the drawing, the bases do not.') },
        { id: 'c', label: L('barcha parallelogrammlar', 'все параллелограммы', 'all the parallelograms'), hint: L('Parallelogrammlar yon yoqlar.', 'Параллелограммы это боковые грани.', 'The parallelograms are the lateral faces.') },
        { id: 'd', label: L('eng katta yoqlar', 'самые большие грани', 'the biggest faces'), hint: L("O'lcham bu yerda hech narsani hal qilmaydi.", 'Размер тут ничего не решает.', 'Size decides nothing here.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Bitta qirrada nechta yoq tutashadi?', 'Сколько граней сходится в одном ребре?', 'How many faces meet at one edge?'),
      done: '2',
      items: [
        { id: 'a', label: L('ikkita', 'две', 'two'), correct: true },
        { id: 'b', label: L('bitta', 'одна', 'one'), hint: L('Bitta yoq shunchaki tomon berardi.', 'Одна грань дала бы просто сторону.', 'One face would give just a side.') },
        { id: 'c', label: L('uchta', 'три', 'three'), hint: L('Uchtasi uchda tutashadi.', 'Три сходятся в вершине.', 'Three meet at a vertex.') },
        { id: 'd', label: L("to'rtta", 'четыре', 'four'), hint: L("To'rtta na qirrada, na kubning uchida tutashadi.", 'Четыре не сходятся ни в ребре, ни в вершине куба.', 'Four meet neither at an edge nor at a vertex of a cube.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Prizma qachon to'g'ri?", 'Когда призма прямая?', 'When is a prism right?'),
      done: 'AA₁ ⊥ ABCD',
      items: [
        { id: 'a', label: L('yon qirra asosga perpendikulyar', 'боковое ребро перпендикулярно основанию', 'the lateral edge is perpendicular to the base'), correct: true },
        { id: 'b', label: L('asos muntazam', 'основание правильное', 'the base is regular'), hint: L('Bu muntazam prizmaning sharti.', 'Это условие правильной призмы.', 'That is the condition of a regular prism.') },
        { id: 'c', label: L('barcha qirralar teng', 'все рёбра равны', 'all edges are equal'), hint: L('Bu kubda ham doim shunday emas.', 'Это даже у куба не всегда так.', 'Even for a box that is not always so.') },
        { id: 'd', label: L('asosda turadi', 'стоит на основании', 'it stands on its base'), hint: L("Chizmada qanday turgani ishga aloqasi yo'q.", 'Как стоит на чертеже, к делу не относится.', 'How it stands on the drawing is irrelevant.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Barcha olti yoq parallelogramm', 'Все шесть граней параллелограммы', 'All six faces are parallelograms'),
  tag: 'kartinka-kak-dokazatelstvo',
  show: [
    [
      L('asosda parallelogramm', 'в основании параллелограмм', 'there is a parallelogram in the base'),
      L('bu prizma, demak yonlari ham', 'это призма, значит боковые тоже', 'this is a prism, so the lateral ones too'),
    ],
    [
      L('buring va yoqlarga qarang', 'поверни и посмотри на грани', 'rotate it and look at the faces'),
      L('har birida parallelogramm', 'параллелограмм в каждой', 'a parallelogram in each of them'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Asosi istalgan ko'pburchak emas, parallelogramm bo'lgan prizmani olamiz.", 'Возьмём призму, у которой основание не любой многоугольник, а параллелограмм.', 'Take a prism whose base is not any polygon but a parallelogram.'),
    A('move', "Bunday prizma parallelepiped deb nomlanadi. Qirq beshinchi betda shunday. Bundan nima kelib chiqishiga qarang. Asoslar shartga ko'ra parallelogramm, yon yoqlar esa prizma bo'lgani uchun parallelogramm. Demak barcha olti yoq parallelogramm, va parallelepipedda alohida yoq yo'q. Jismni buring va tekshiring. Qarama-qarshi yoqlarning har juftligi asos bo'lishga yaraydi, va jism bundan o'zgarmaydi. Oddiy prizmada bunday chiqmagan edi, chunki u yerda asoslar alohida.", 'Такая призма называется параллелепипедом. Так на странице сорок пять. Смотри, что из этого следует. Основания параллелограммы по условию, боковые грани параллелограммы потому что это призма. Значит все шесть граней параллелограммы, и особых граней у параллелепипеда нет. Поверни тело и проверь. Любая пара противоположных граней годится на роль основания, и тело от этого не меняется. У обычной призмы так не выходило, потому что основания там особые.', 'Such a prism is called a parallelepiped. So it is on page forty five. See what follows. The bases are parallelograms by the condition, the lateral faces are parallelograms because this is a prism. So all six faces are parallelograms and a parallelepiped has no special faces. Rotate the body and check. Any pair of opposite faces will do as the bases, and the body does not change. For an ordinary prism that did not work, because there the bases are special.'),
    A('work', "O'zingiz hisoblang. Parallelepipedning nechta yog'i bor?", 'Посчитай сам. Сколько граней у параллелепипеда?', 'Work it out yourself. How many faces does a parallelepiped have?'),
  ],
  work: {
    prompt: L('Nechta yoq?', 'Сколько граней?', 'How many faces?'),
    ok: L("Oltita. Asos to'rtburchak, demak yoqlar to'rt qo'shuv ikki.", 'Шесть. Основание четырёхугольник, значит граней четыре плюс два.', 'Six. The base is a quadrilateral, so the faces are four plus two.'),
    hint: [
      L("O'tgan darsdagi n qo'shuv ikki qoidasini eslang.", 'Вспомни правило из прошлого урока про n плюс два.', 'Recall the rule from the last lesson about n plus two.'),
      L("Asosda to'rt tomon.", 'У основания четыре стороны.', 'The base has four sides.'),
      L("To'rt qo'shuv ikki.", 'Четыре плюс два.', 'Four plus two.'),
    ],
    answer: '6',
  },
  expr: '4 + 2 = 6',
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("To'g'ri va to'g'ri burchakli", 'Прямой и прямоугольный', 'Right and rectangular'),
  tag: 'svoystvo-vmesto-priznaka',
  show: [
    [
      L("yon qirra perpendikulyar bo'ldi", 'боковое ребро встало перпендикулярно', 'the lateral edge stood perpendicular'),
      L("yon yoqlar to'g'ri to'rtburchak bo'ldi", 'боковые грани стали прямоугольниками', 'the lateral faces became rectangles'),
    ],
    [
      L("asos ham to'g'ri to'rtburchak bo'ldi", 'основание тоже стало прямоугольником', 'the base became a rectangle too'),
      L("endi oltitasi ham to'g'ri to'rtburchak", 'теперь все шесть прямоугольники', 'now all six are rectangles'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Yon qirrani asosga perpendikulyar qo'yamiz. Bunday parallelepiped to'g'ri deb ataladi.", 'Поставим боковое ребро перпендикулярно основанию. Такой параллелепипед называется прямым.', 'Let us set the lateral edge perpendicular to the base. Such a parallelepiped is called right.'),
    A('move', "To'g'ri parallelepipedning yon yoqlari to'g'ri to'rtburchak, asos esa qanday bo'lsa shunday qoladi, ya'ni parallelogramm. Endi asosni ham to'g'ri to'rtburchak qilamiz. Bunday parallelepiped to'g'ri burchakli deb ataladi, va unda oltita yoqning hammasi to'g'ri to'rtburchak. To'g'ri va to'g'ri burchakli orasidagi farq aynan asosda, va bu prizmadagi to'g'ri va muntazam farqining o'zi. Qirra haqidagi shart va asos haqidagi shart mustaqil, va ikkalasini ham tekshirish kerak.", 'У прямого параллелепипеда боковые грани прямоугольники, а вот основание остаётся каким было, то есть параллелограммом. Теперь сделаем прямоугольником и основание. Такой параллелепипед называется прямоугольным, и у него прямоугольники все шесть граней. Разница между прямым и прямоугольным ровно в основании, и это то же различение, что было у призмы между прямой и правильной. Условие про ребро и условие про основание независимы, и проверять надо оба.', 'In a right parallelepiped the lateral faces are rectangles, while the base stays what it was, a parallelogram. Now let us make the base a rectangle as well. Such a parallelepiped is called rectangular, and all six of its faces are rectangles. The difference between right and rectangular is exactly in the base, and that is the same distinction the prism had between right and regular. The condition about the edge and the condition about the base are independent and both have to be checked.'),
    A('work', "O'zingiz hisoblang. To'g'ri burchakli parallelepiped yoqlari orasida nechta to'g'ri to'rtburchak bor?", 'Посчитай сам. Сколько прямоугольников среди граней прямоугольного параллелепипеда?', 'Work it out yourself. How many rectangles are among the faces of a rectangular box?'),
  ],
  work: {
    prompt: L("Nechta to'g'ri to'rtburchak?", 'Сколько прямоугольников?', 'How many rectangles?'),
    ok: L('Oltita. Asoslar ham, yon yoqlar ham.', 'Шесть. И основания, и боковые грани.', 'Six. Both the bases and the lateral faces.'),
    hint: [
      L('Asoslarni va yonlarni alohida sanang.', 'Посчитай отдельно основания и боковые.', 'Count the bases and the lateral faces separately.'),
      L("Asoslar ikkita, yonlari to'rtta.", 'Оснований два, боковых четыре.', 'Two bases, four lateral faces.'),
      L("Ikki qo'shuv to'rt.", 'Два плюс четыре.', 'Two plus four.'),
    ],
    answer: '6',
  },
  expr: 'AA₁ ⊥ ABCD,   ABCD = ▭',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Uch o'lcham va kub", 'Три измерения и куб', 'Three dimensions and the cube'),
  tag: 'svoystvo-vmesto-priznaka',
  show: [
    [
      L('bir uchdan uch qirra chiqadi', 'из одной вершины выходят три ребра', 'three edges leave one vertex'),
      L("ularning uzunliklari o'lchamlar", 'их длины это измерения', 'their lengths are the dimensions'),
    ],
    [
      L("o'lchamlar teng qilindi", 'измерения сделали равными', 'the dimensions were made equal'),
      L('kub chiqdi', 'получился куб', 'a cube came out'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "To'g'ri burchakli parallelepipedda har uchdan uch qirra chiqadi. Ularning uzunliklari o'lchamlar deb ataladi.", 'В прямоугольном параллелепипеде из каждой вершины выходят три ребра. Их длины называются измерениями.', 'In a rectangular box three edges leave each vertex. Their lengths are called the dimensions.'),
    A('move', "O'lchamlar roppa-rosa uchta, va ular jismni butunlay belgilaydi. Qirq beshinchi betda shunday. Uchalasini teng qilamiz. Barcha qirralari teng va barcha yoqlari kvadrat bo'lgan jism chiqadi, va u kub deb nomlanadi. Kub o'lchamlari teng bo'lgan to'g'ri burchakli parallelepiped, ya'ni xususiy hol, alohida shakl emas. Kubni buring va har qanday uchdan manzara bir xil ekaniga ishonch hosil qiling. Aynan shuning uchun kub bunday qulay misol, va biz undan tekisliklar bloki bo'ylab foydalandik.", 'Измерений ровно три, и они задают тело целиком. Так на странице сорок пять. Сделаем все три равными. Получится тело, у которого все рёбра равны и все грани квадраты, и оно называется кубом. Куб это прямоугольный параллелепипед с равными измерениями, то есть частный случай, а не отдельная фигура. Поверни куб и убедись, что из любой вершины картина одна и та же. Именно поэтому куб такой удобный пример, и мы им пользовались весь блок про плоскости.', 'There are exactly three dimensions and they fix the whole body. So it is on page forty five. Let us make all three equal. We get a body with all edges equal and all faces squares, and it is called a cube. A cube is a rectangular box with equal dimensions, that is a special case rather than a separate figure. Rotate the cube and see that the picture is the same from any vertex. That is exactly why a cube is such a convenient example, and we used it throughout the block about planes.'),
    A('work', "O'zingiz hisoblang. Kubning nechta xil o'lchami bor?", 'Посчитай сам. Сколько разных измерений у куба?', 'Work it out yourself. How many different dimensions does a cube have?'),
  ],
  work: {
    prompt: L("Nechta xil o'lcham?", 'Сколько разных измерений?', 'How many different dimensions?'),
    ok: L("Bitta. Uchala o'lcham o'zaro teng.", 'Одно. Все три измерения равны между собой.', 'One. All three dimensions are equal to each other.'),
    hint: [
      L('Bir uchdan chiqqan uch qirraga qarang.', 'Посмотри на три ребра из одной вершины.', 'Look at the three edges from one vertex.'),
      L('Kubda ular teng.', 'У куба они равны.', 'In a cube they are equal.'),
      L('Bitta.', 'Одно.', 'One.'),
    ],
    answer: '1',
  },
  expr: 'a = b = c',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Diagonal uch o'lcham bo'yicha", 'Диагональ по трём измерениям', 'The diagonal from three dimensions'),
  tag: 'diagonal-grani-i-tela',
  show: [
    [
      L('avval asos diagonali', 'сначала диагональ основания', 'first the base diagonal'),
      L("bu ikki o'lcham bo'yicha Pifagor", 'это Пифагор по двум измерениям', 'that is Pythagoras on two dimensions'),
    ],
    [
      L('keyin jism diagonali', 'потом диагональ тела', 'then the body diagonal'),
      L('bu yana Pifagor', 'это Пифагор ещё раз', 'that is Pythagoras once more'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "O'lchamlar uch, to'rt va o'n ikki. Jism diagonalini topamiz.", 'Измерения три, четыре и двенадцать. Найдём диагональ тела.', 'The dimensions are three, four and twelve. Let us find the body diagonal.'),
    A('move', "Avval asos diagonali. Asosda o'lchamlari uch va to'rt bo'lgan to'g'ri to'rtburchak, demak uning diagonali besh. Endi bir kateti asos diagonali, ikkinchisi yon qirra bo'lgan uchburchakka qarang. Ular orasidagi burchak to'g'ri, chunki yon qirra asos tekisligiga perpendikulyar, diagonal esa shu tekislikda yotadi. Demak yana Pifagor. Besh va o'n ikki o'n uchni beradi. Jismni buring va bu uchburchak qayerda yotganini ko'ring, u parallelepipedning ichidan o'tadi.", 'Сначала диагональ основания. В основании прямоугольник с измерениями три и четыре, значит его диагональ пять. Теперь смотри на треугольник, у которого один катет это диагональ основания, а второй боковое ребро. Угол между ними прямой, потому что боковое ребро перпендикулярно плоскости основания, а диагональ лежит в этой плоскости. Значит снова Пифагор. Пять и двенадцать дают тринадцать. Поверни тело и посмотри, где лежит этот треугольник, он проходит внутри параллелепипеда.', 'First the base diagonal. The base is a rectangle with dimensions three and four, so its diagonal is five. Now look at the triangle whose one leg is the base diagonal and the other is the lateral edge. The angle between them is right, because the lateral edge is perpendicular to the plane of the base while the diagonal lies in that plane. So Pythagoras again. Five and twelve give thirteen. Rotate the body and see where that triangle lies, it goes inside the parallelepiped.'),
    A('work', "O'zingiz hisoblang. O'lchamlar uch, to'rt va o'n ikki. Jism diagonali qancha?", 'Посчитай сам. Измерения три, четыре и двенадцать. Какова диагональ тела?', 'Work it out yourself. The dimensions are three, four and twelve. What is the body diagonal?'),
  ],
  work: {
    prompt: L('Jism diagonalini toping', 'Найди диагональ тела', 'Find the body diagonal'),
    ok: L("O'n uch. Asosda besh, keyin besh va o'n ikki.", 'Тринадцать. Пять в основании, потом пять и двенадцать.', 'Thirteen. Five in the base, then five and twelve.'),
    hint: [
      L('Avval asos diagonalini toping.', 'Сначала найди диагональ основания.', 'First find the base diagonal.'),
      L("Uch va to'rt beshni beradi.", 'Три и четыре дают пять.', 'Three and four give five.'),
      L("Besh va o'n ikki o'n uchni beradi.", 'Пять и двенадцать дают тринадцать.', 'Five and twelve give thirteen.'),
    ],
    answer: '13',
  },
  expr: '3, 4, 12   →   d = ?',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L('Bir uchdan ikki diagonal', 'Две диагонали из одной вершины', 'Two diagonals from one vertex'),
  tag: 'diagonal-grani-i-tela',
  show: [
    [
      L('bir diagonal yoqda yotadi', 'одна диагональ лежит в грани', 'one diagonal lies in a face'),
      L('ikkinchisi jism ichiga ketadi', 'другая уходит внутрь тела', 'the other goes inside the body'),
    ],
    [
      L('buring va ularga qarang', 'поверни и следи за ними', 'rotate and watch them'),
      L('ular ajraldi, bu boshqa kesmalar', 'они разошлись, это разные отрезки', 'they came apart, these are different segments'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Bir uchdan ikki kesma o'tkazilgan. Biri yoqning qarama-qarshi uchiga, ikkinchisi jismning qarama-qarshi uchiga.", 'Из одной вершины проведены два отрезка. Один в противоположную вершину грани, второй в противоположную вершину тела.', 'Two segments are drawn from one vertex. One to the opposite vertex of a face, the other to the opposite vertex of the body.'),
    A('move', "Qimirlamas chizmada ular deyarli yonma-yon boradi, va aynan shuning uchun ularni aralashtirib yuboradilar. Jismni buring. Yoq diagonali har qanday burilishda yoqda qoladi, jism diagonali esa hech qayerda yoqda yotmaydi, u ichdan boradi. Sanoqdagi farq ham shundan. Yoq diagonaliga ikki o'lcham kiradi, jism diagonaliga uchta. Uchta o'rniga ikkitasini olsangiz, javob haqiqiysidan kichik chiqadi, va bu xatoni sezish qiyin, chunki son ishonarli ko'rinadi.", 'На неподвижном чертеже они идут почти рядом, и именно поэтому их путают. Поверни тело. Диагональ грани остаётся в грани при любом повороте, а диагональ тела нигде в грани не лежит, она идёт внутри. Отсюда и разница в счёте. В диагональ грани входят два измерения, в диагональ тела три. Если взять два вместо трёх, ответ получится меньше настоящего, и ошибку эту заметить трудно, потому что число выглядит правдоподобно.', 'On a still drawing they run almost side by side, and that is exactly why they get confused. Rotate the body. The face diagonal stays in its face at any rotation, while the body diagonal lies in no face at all, it goes inside. Hence the difference in counting. Two dimensions go into a face diagonal, three into a body diagonal. If you take two instead of three, the answer comes out smaller than the true one, and that mistake is hard to notice because the number looks plausible.'),
    A('work', "O'zingiz hisoblang. Yoq diagonaliga nechta o'lcham kiradi?", 'Посчитай сам. Сколько измерений входит в диагональ грани?', 'Work it out yourself. How many dimensions go into a face diagonal?'),
  ],
  work: {
    prompt: L("Yoq diagonalida nechta o'lcham?", 'Сколько измерений в диагонали грани?', 'How many dimensions are in a face diagonal?'),
    ok: L("Ikkita. Yoq yassi, uchinchi o'lcham unga tushmaydi.", 'Два. Грань плоская, третье измерение в неё не попадает.', 'Two. A face is flat, the third dimension does not enter it.'),
    hint: [
      L("Bu diagonal qaysi yoqda yotganini ko'ring.", 'Посмотри, в какой грани лежит эта диагональ.', 'See which face this diagonal lies in.'),
      L('Yoqning uzunligi va kengligi bor, tamom.', 'У грани есть длина и ширина, и всё.', 'A face has a length and a width, and that is all.'),
      L('Ikkita.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
  expr: 'AC² = a² + b²',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Diagonalda uch o'lcham", 'Три измерения в диагонали', 'Three dimensions in the diagonal'),
  tag: 'diagonal-grani-i-tela',
  motion: ['rule'],
  audio: [
    A('mount', 'Farqlashga bitta savol, keyin kartochka.', 'Один вопрос на различение, потом карточка.', 'One question to tell them apart, then the card.'),
    A('rule', "Formula ikki qadamda chiqariladi, va ikkinchi qadam yon qirraning perpendikulyarligiga tayanadi. Shuning uchun uni og'ma parallelepipedga qo'llash mumkin emas. O'zingizni oddiy usulda tekshiring. Qirrasi bir bo'lgan kubda yoq diagonali ikkidan ildiz, jism diagonali esa uchdan ildiz. Sonlar boshqa, va farq aynan uchinchi o'lchamda.", 'Формула выводится двумя шагами, и второй шаг опирается на перпендикулярность бокового ребра. Поэтому её нельзя применять к наклонному параллелепипеду. Проверь себя простым способом. В кубе с ребром один диагональ грани это корень из двух, а диагональ тела корень из трёх. Числа разные, и разница ровно в третьем измерении.', 'The formula is derived in two steps, and the second step rests on the perpendicularity of the lateral edge. That is why it cannot be applied to a slanted parallelepiped. Check yourself in a simple way. In a cube with edge one the face diagonal is the root of two and the body diagonal is the root of three. The numbers differ, and the difference is exactly the third dimension.'),
  ],
  probe: {
    question: L("Jism diagonaliga nechta o'lcham kiradi?", 'Сколько измерений входит в диагональ тела?', 'How many dimensions go into a body diagonal?'),
    items: [
      { id: 'a', label: L('uchta', 'три', 'three'), correct: true },
      { id: 'b', label: L('ikkita', 'два', 'two'), hint: L('Ikkitasi yoq diagonalini beradi, jismning emas.', 'Два дают диагональ грани, а не тела.', 'Two give a face diagonal, not a body one.') },
    ],
  },
  rule: {
    lawLabel: L('Jism diagonali', 'Диагональ тела', 'The body diagonal'),
    lines: [
      L("parallelepiped asosi parallelogramm bo'lgan prizma", 'параллелепипед это призма с параллелограммом в основании', 'a parallelepiped is a prism with a parallelogram base'),
      L("to'g'ri burchakli parallelepiped uch o'lcham bilan berilgan", 'прямоугольный параллелепипед задан тремя измерениями', 'a rectangular box is given by three dimensions'),
      L("diagonal kvadrati uch o'lcham kvadratlari yig'indisi", 'квадрат диагонали это сумма квадратов трёх измерений', 'the square of the diagonal is the sum of the squares of the three dimensions'),
    ],
    law: 'd² = a² + b² + c²',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Har bir kesmani nomlang', 'Назови каждый отрезок', 'Name each segment'),
  tag: 'diagonal-grani-i-tela',
  audio: [
    A('mount', "To'rt yozuv va to'rt nom. Ularni birlashtiring.", 'Четыре записи и четыре названия. Соедини их.', 'Four readings and four names. Match them.'),
  ],
  match: {
    prompt: L('Yozuvni nomi bilan birlashtiring', 'Соедини запись с названием', 'Match the reading with the name'),
    ok: L("To'rttasi ham joyida. Diagonallar endi aralashmaydi.", 'Все четыре на месте. Диагонали больше не путаются.', 'All four in place. The diagonals no longer get mixed up.'),
    a: L('asos qirrasi', 'ребро основания', 'a base edge'),
    b: L('yon qirra', 'боковое ребро', 'a lateral edge'),
    c: L('asos diagonali', 'диагональ основания', 'a base diagonal'),
    d: L('jism diagonali', 'диагональ тела', 'the body diagonal'),
    left: ['AB', 'AA₁', 'AC', 'AC₁'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Diagonal formulasini chiqaring', 'Выведи формулу диагонали', 'Derive the diagonal formula'),
  tag: 'diagonal-grani-i-tela',
  audio: [
    A('mount', "Uch qator, va har birining ro'yxatdan o'z asoslashi bor.", 'Три строки, и у каждой своё обоснование из списка.', 'Three lines, each with its own justification from the list.'),
  ],
  proof: {
    given: L("to'g'ri burchakli parallelepiped", 'прямоугольный параллелепипед', 'a rectangular box'),
    goal: L("diagonal uch o'lcham bo'yicha", 'диагональ через три измерения', 'the diagonal from three dimensions'),
    r1: L("asos diagonali ikki o'lcham bo'yicha", 'диагональ основания по двум измерениям', 'the base diagonal from two dimensions'),
    r2: L('qirra shu diagonalga perpendikulyar', 'ребро перпендикулярно этой диагонали', 'the edge is perpendicular to that diagonal'),
    r3: L('demak yana Pifagor ishlaydi', 'значит снова работает Пифагор', 'so Pythagoras works again'),
    ok: L("Isbotlandi. Ikki qadam Pifagor uch o'lcham beradi.", 'Доказано. Два шага Пифагора дают три измерения.', 'Proved. Two steps of Pythagoras give three dimensions.'),
    e1: L('Perpendikulyarlik keyin keladi. Avval asos haqida.', 'Перпендикулярность идёт дальше. Сначала про основание.', 'Perpendicularity comes later. First about the base.'),
    e2: L("Asosda hisoblandi. Ikkinchi uchburchakda to'g'ri burchak qayerdan.", 'В основании уже посчитано. Откуда прямой угол во втором треугольнике.', 'The base is done. Where does the right angle in the second triangle come from.'),
    e3: L("To'g'ri burchak bor. Endi gipotenuzani hisoblang.", 'Прямой угол есть. Теперь считай гипотенузу.', 'The right angle is there. Now compute the hypotenuse.'),
  },
  reason: {
    s1: L('Pifagor teoremasi', 'теорема Пифагора', 'the Pythagorean theorem'),
    s2: L("perpendikulyar tekislikning barcha chiziqlari bilan to'g'ri burchak beradi", 'перпендикуляр даёт прямой угол со всеми прямыми плоскости', 'a perpendicular gives a right angle with all lines of the plane'),
    s3: L('parallelogramm xossasi', 'свойство параллелограмма', 'a property of a parallelogram'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: 'AC₁² = AC² + CC₁²',
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
    ok: L("Yigirma olti. O'ttiz olti qo'shuv oltmish to'rt qo'shuv besh yuz yetmish olti.", 'Двадцать шесть. Тридцать шесть плюс шестьдесят четыре плюс пятьсот семьдесят шесть.', 'Twenty six. Thirty six plus sixty four plus five hundred seventy six.'),
    hint: [
      L("Har o'lchamni kvadratga ko'taring.", 'Возведи в квадрат каждое измерение.', 'Square each dimension.'),
      L("Uch kvadratni qo'shing va ildiz chiqaring.", 'Сложи три квадрата и извлеки корень.', 'Add the three squares and take the root.'),
      L('Olti yuz yetmish olti yigirma oltining kvadrati.', 'Шестьсот семьдесят шесть это двадцать шесть в квадрате.', 'Six hundred seventy six is twenty six squared.'),
    ],
    prompt: '6, 8, 24   →   d = ?',
    answer: '26',
  },
  order: {
    prompt: L('Yozuvlarni hisoblash tartibida joylashtiring', 'Расставь записи в том порядке, в каком считают', 'Arrange the readings in the order they are computed'),
    title: L('Hisob tartibi', 'Порядок счёта', 'The order of computing'),
    ok: L("Tartib to'g'ri. Avval asos, keyin jism.", 'Порядок верный. Сначала основание, потом тело.', 'The order is right. First the base, then the body.'),
    bad: L('Bu tartibda emas. Avval nima kerak.', 'Не в этом порядке. Что нужно раньше.', 'Not in this order. What is needed first.'),
    items: ['AC₁', 'a, b, c', 'AC', 'AC₁²'],
    answer: 'a, b, c  AC  AC₁²  AC₁',
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
    A('mount', "To'rt qator, va ulardan biri diagonalni almashtiradi.", 'Четыре строки, и одна из них подменяет диагональ.', 'Four lines, and one of them substitutes the diagonal.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("O'lchamlar to'g'ri yozilgan.", 'Измерения выписаны верно.', 'The dimensions are written correctly.'),
    r2: L("Asos diagonali to'g'ri hisoblangan.", 'Диагональ основания посчитана верно.', 'The base diagonal is computed correctly.'),
    r4: L('Javob yuqoridagi xato qatordan olingan.', 'Ответ получен из неверной строки выше.', 'The answer comes from the wrong line above.'),
  },
  proof: L('Jismni buring: bu kesma yoqda qoldi, demak u jism diagonali emas.', 'Поверни тело: этот отрезок остался в грани, значит он не диагональ тела.', 'Rotate the body: this segment stayed in a face, so it is not the body diagonal.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L('Uchinchi. Jism diagonali deb asos diagonali aytilgan.', 'Третья. Диагональю тела назвали диагональ основания.', 'The third. The base diagonal was called the body diagonal.'),
    hint: [
      L('Har qatorda qaysi kesma aytilganini tekshiring.', 'Проверь, какой отрезок назван в каждой строке.', 'Check which segment is named in each line.'),
      L("Uchinchi o'lcham yechimda biror marta ham paydo bo'lmadi.", 'Третье измерение в решении не появилось ни разу.', 'The third dimension never appeared in the solution.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'a = 3,   b = 4,   c = 12',
    r2: 'AC² = 9 + 16',
    r3: 'AC₁ = AC = 5',
    r4: 'd = 5',
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
    A('mount', "Formulani o'ngdan chapga o'qiymiz. O'lchamlar bo'yicha diagonalni aytamiz.", 'Прочитаем формулу справа налево. По измерениям назовём диагональ.', 'Let us read the formula from right to left. From the dimensions we name the diagonal.'),
    A('work', "Doim to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны всегда. Их больше одной.', 'Mark all the readings that are always true. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Nima doim to'g'ri", 'Что верно всегда', 'What is always true'),
    ok: L("Beshtadan uch yozuv. Biri ikki o'lchamni oladi, ikkinchisi kvadratlar o'rniga qo'shadi.", 'Три записи из пяти. Одна берёт два измерения, другая складывает вместо квадратов.', 'Three readings out of five. One takes two dimensions, the other adds instead of squaring.'),
    items: [
      { id: 'd', label: 'd² = a² + b²', hint: L('Bu yoq diagonali, jismning emas.', 'Это диагональ грани, а не тела.', 'That is a face diagonal, not a body one.') },
      { id: 'e', label: 'd = a + b + c', hint: L("Diagonal o'lchamlar yig'indisi emas, kvadratlar yig'indisidan ildiz.", 'Диагональ это не сумма измерений, а корень из суммы квадратов.', 'A diagonal is not the sum of the dimensions but the root of the sum of squares.') },
      { id: 'a', label: 'd² = a² + b² + c²', ok: true },
      { id: 'b', label: 'AC² = a² + b²', ok: true },
      { id: 'c', label: 'a = b = c', ok: true },
    ],
  },
  place: {
    prompt: L("O'lchamlar ikki, uch va olti. Jism diagonalini toping.", 'Измерения два, три и шесть. Найди диагональ тела.', 'The dimensions are two, three and six. Find the body diagonal.'),
    ok: L("Yetti. To'rt qo'shuv to'qqiz qo'shuv o'ttiz olti bu qirq to'qqiz.", 'Семь. Четыре плюс девять плюс тридцать шесть это сорок девять.', 'Seven. Four plus nine plus thirty six is forty nine.'),
    wrong: L("Uchala o'lcham kvadratlarini qo'shing.", 'Сложи квадраты всех трёх измерений.', 'Add the squares of all three dimensions.'),
    target: '7',
    step: '4 + 9 + 36 = 49',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'diagonal-grani-i-tela',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Parallelepipedning asosida nima?', 'Что в основании параллелепипеда?', 'What is in the base of a parallelepiped?'),
      done: 'ABCD = ▱',
      items: [
        { id: 'a', label: L('parallelogramm', 'параллелограмм', 'a parallelogram'), correct: true },
        { id: 'b', label: L("istalgan ko'pburchak", 'любой многоугольник', 'any polygon'), hint: L("Istalgan ko'pburchak umuman prizma.", 'Любой многоугольник это призма вообще.', 'Any polygon is a prism in general.') },
        { id: 'c', label: L("to'g'ri to'rtburchak", 'прямоугольник', 'a rectangle'), hint: L("To'g'ri to'rtburchak faqat to'g'ri burchaklida.", 'Прямоугольник только у прямоугольного.', 'A rectangle only in the rectangular one.') },
        { id: 'd', label: L('kvadrat', 'квадрат', 'a square'), hint: L("Kvadrat kubda bo'ladi.", 'Квадрат бывает у куба.', 'A square happens in a cube.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("To'g'ri burchakli parallelepipedning nechta o'lchami bor?", 'Сколько измерений у прямоугольного параллелепипеда?', 'How many dimensions does a rectangular box have?'),
      done: 'a, b, c',
      items: [
        { id: 'a', label: L('uchta', 'три', 'three'), correct: true },
        { id: 'b', label: L('ikkita', 'два', 'two'), hint: L("Ikki o'lcham yassi shaklda.", 'Два измерения у плоской фигуры.', 'Two dimensions belong to a flat figure.') },
        { id: 'c', label: L('oltita', 'шесть', 'six'), hint: L('Olti yoqlar soni.', 'Шесть это число граней.', 'Six is the number of faces.') },
        { id: 'd', label: L("o'n ikkita", 'двенадцать', 'twelve'), hint: L("O'n ikki qirralar soni.", 'Двенадцать это число рёбер.', 'Twelve is the number of edges.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Qirrasi bir bo'lgan kubda jism diagonali?", 'В кубе с ребром один диагональ тела?', 'In a cube with edge one, the body diagonal?'),
      done: 'd = √3',
      items: [
        { id: 'a', label: L('uchdan ildiz', 'корень из трёх', 'the root of three'), correct: true },
        { id: 'b', label: L('ikkidan ildiz', 'корень из двух', 'the root of two'), hint: L('Ikkidan ildiz yoq diagonali.', 'Корень из двух это диагональ грани.', 'The root of two is the face diagonal.') },
        { id: 'c', label: L('bir', 'один', 'one'), hint: L('Bir qirra.', 'Один это ребро.', 'One is the edge.') },
        { id: 'd', label: L('uch', 'три', 'three'), hint: L("Uch kvadratlar yig'indisi, diagonal emas.", 'Три это сумма квадратов, а не диагональ.', 'Three is the sum of squares, not the diagonal.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Kub nima?', 'Куб это что?', 'What is a cube?'),
      done: 'a = b = c',
      items: [
        { id: 'a', label: L("o'lchamlari teng to'g'ri burchakli parallelepiped", 'прямоугольный параллелепипед с равными измерениями', 'a rectangular box with equal dimensions'), correct: true },
        { id: 'b', label: L('alohida shakl', 'отдельная фигура', 'a separate figure'), hint: L('Kub xususiy hol, yangi shakl emas.', 'Куб частный случай, а не новая фигура.', 'A cube is a special case, not a new figure.') },
        { id: 'c', label: L('istalgan parallelepiped', 'любой параллелепипед', 'any parallelepiped'), hint: L("Istalganida na to'g'ri burchak, na teng qirra bor.", 'У любого нет ни прямых углов, ни равных рёбер.', 'Any one has neither right angles nor equal edges.') },
        { id: 'd', label: L('muntazam prizma', 'правильная призма', 'a regular prism'), hint: L("Muntazam prizma oltiburchakli ham bo'ladi.", 'Правильная призма может быть и шестиугольной.', 'A regular prism can be hexagonal too.') },
      ],
    },
  ],
  angles: ['AB', 'AA₁', 'AC', 'AC₁'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Endi nimani bilasiz', 'Что теперь умеешь', 'What you can do now'),
  audio: [
    A('mount', "Dars diagonal haqida ikki yozuv bilan boshlandi. Birinchisida ikki o'lcham bor edi.", 'Урок начался с двух записей про диагональ. В первой было два измерения.', 'The lesson began with two readings about the diagonal. The first had two dimensions.'),
    A('next', "Ikki o'lcham yoq diagonalini beradi, va u chizmada haqiqatan bor, shunchaki bu boshqa kesma. Jism diagonali birorta yoqda yotmaydi, shuning uchun unga uchala o'lcham kiradi. Formula ikki qadam Pifagor bilan chiqarilgan, va ikkinchi qadam faqat yon qirra asosga perpendikulyar bo'lgani uchun ishlaydi. Keyin piramida, va u yerda yon yoqlar bitta uchda tutashadi.", 'Два измерения дают диагональ грани, и она действительно есть на чертеже, просто это другой отрезок. Диагональ тела не лежит ни в одной грани, поэтому в неё входят все три измерения. Формула выведена двумя шагами Пифагора, и второй шаг работает только потому, что боковое ребро перпендикулярно основанию. Дальше пирамида, и там боковые грани сходятся в одной вершине.', 'Two dimensions give a face diagonal, and it really is on the drawing, it is just a different segment. The body diagonal lies in no face, so all three dimensions enter it. The formula is derived in two steps of Pythagoras, and the second step works only because the lateral edge is perpendicular to the base. Next comes the pyramid, where the lateral faces meet at one vertex.'),
  ],
  can: [
    L("Parallelepiped asosi parallelogramm bo'lgan prizma ekanini bilaman", 'Знаю, что параллелепипед это призма с параллелограммом в основании', 'I know a parallelepiped is a prism with a parallelogram base'),
    L("To'g'rini to'g'ri burchaklidan ajrataman", 'Отличаю прямой от прямоугольного', 'I tell a right one from a rectangular one'),
    L('Yoq diagonalini jism diagonalidan ajrataman', 'Отличаю диагональ грани от диагонали тела', 'I tell a face diagonal from a body diagonal'),
    L("Diagonalni uch o'lcham bo'yicha hisoblayman", 'Считаю диагональ по трём измерениям', 'I compute the diagonal from three dimensions'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L('Bundan keyin piramida, barcha yon yoqlari bitta uchda tutashadigan jism', 'Дальше пирамида — тело, у которого все боковые грани сходятся в одной вершине', 'Next comes the pyramid, a body whose lateral faces all meet at one vertex'),
  lifehack: L("Diagonalni hisoblayotgan bo'lsangiz, avval u yoqdami yoki jism ichida ekanini so'rang", 'Считаешь диагональ — сначала спроси, в грани она или внутри тела', 'Computing a diagonal, first ask whether it is in a face or inside the body'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L('Geometriya, qirq beshinchi bet', 'Геометрия, страница сорок пять', 'Geometry, page forty five'),
  hook: {
    a: 'd² = a² + b²',
    b: 'd² = a² + b² + c²',
  },
  proved: 'd² = a² + b² + c²',
  law: 'AA₁ ⊥ ABCD',
  sheet: [
    'ABCD = ▱',
    'AA₁ ⊥ ABCD',
    'AC² = a² + b²',
    'd² = a² + b² + c²',
    'a = b = c',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/−/g, '-'))

// PRIBOR 6B. Asos QO'LDA beriladi (`plan`), chunki darsning butun mazmuni
// asosning shaklida: parallelogramm, to'g'ri to'rtburchak, kvadrat.
const PARAL = { kind: 'prism', h: 1.05, plan: [[-0.5, -0.3], [0.5, -0.34], [0.68, 0.3], [-0.32, 0.34]] }
const SLANT = { ...PARAL, skew: [0.34, 0.2] }
const RECT = { kind: 'prism', h: 1.05, plan: [[-0.58, -0.34], [0.58, -0.34], [0.58, 0.34], [-0.58, 0.34]] }
const CUBE = { kind: 'prism', h: 0.94, plan: [[-0.47, -0.47], [0.47, -0.47], [0.47, 0.47], [-0.47, 0.47]] }

const GREY = '#7f8c8d'
const FACE2 = '#6b8fa3'

const BASE = [{ by: ['A', 'B', 'C', 'D'] }]
const BASE_SIDE = [{ by: ['A', 'B', 'C', 'D'] }, { by: ['A', 'B', 'B1', 'A1'], tone: FACE2 }]

// Ikki diagonal BIR uchdan: yoq diagonali va jism diagonali. Darsning shohidi
// aynan shu ikkisining ajralishi.
const DIAG_FACE = { from: 'A', to: 'C', tone: GREY, w: 2.2 }
const DIAG_BODY = { from: 'A', to: 'C1' }
const EDGE_UP = { from: 'C', to: 'C1', tone: GREY, w: 2 }
const BOTH_DIAG = [DIAG_FACE, DIAG_BODY]
const PROOF_SEGS = [DIAG_FACE, DIAG_BODY, EDGE_UP]
const RIGHT_C = { at: 'C', from: 'A', to: 'C1' }

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
// UCHINCHI QATOR ham Pifagor: xulosa «yana Pifagor ishlaydi» deb yozilgan, va
// uni parallelogramm xossasi bilan asoslash mazmunan xato. `s3` esa ataylab
// ishlatilmaydi -- u to'g'ri, lekin bu isbotga aloqasi yo'q chalg'ituvchi.
const PROOF_ROWS = [
  { text: S10.proof.r1, reason: 's1', early: S10.proof.e1 },
  { text: S10.proof.r2, reason: 's2', early: S10.proof.e2 },
  { text: S10.proof.r3, reason: 's1', early: S10.proof.e3, ok: S10.proof.ok },
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
            fig={<Space step={1} yaw={0.4} poly={RECT} faces={BASE} segs={[DIAG_BODY]} />}
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
            fig={<Space step={1} yaw={0.4} poly={PARAL} faces={BASE} />}
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
            step={1} yaw={0.35 + phase * 0.4} poly={PARAL}
            faces={phase === 0 ? BASE : BASE_SIDE}
          />
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={PARAL} faces={BASE_SIDE} />}
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
            step={1} yaw={0.35} poly={phase === 0 ? PARAL : RECT}
            faces={BASE_SIDE} hi={['AA1']}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={RECT} faces={BASE_SIDE} hi={['AA1']} />}
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
            step={1} yaw={0.3 + phase * 0.5} poly={phase === 0 ? RECT : CUBE}
            faces={BASE} hi={['AB', 'AD', 'AA1']}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} poly={CUBE} faces={BASE} hi={['AB', 'AD', 'AA1']} />}
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
            step={1} yaw={0.35} poly={RECT} faces={BASE}
            segs={phase === 0 ? [DIAG_FACE] : PROOF_SEGS}
            angleAt={phase === 0 ? null : RIGHT_C}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} poly={RECT} faces={BASE} segs={PROOF_SEGS} angleAt={RIGHT_C} />}
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
            step={1} yaw={phase === 0 ? 0.12 : 0.75} poly={RECT}
            faces={BASE} segs={BOTH_DIAG}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={RECT} faces={BASE} segs={BOTH_DIAG} />}
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
                poly={RECT} faces={BASE} segs={solved ? PROOF_SEGS : BOTH_DIAG}
                angleAt={solved ? RIGHT_C : null}
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
                poly={round === 1 ? CUBE : RECT}
                faces={BASE}
                segs={BOTH_DIAG}
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
