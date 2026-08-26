// ============================================================================
// 10-sinf, Dars 44. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS44_KONTENT.md
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
const LESSON_NO = 44
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Prizma`,
  `Урок ${LESSON_NO}. Призма`,
  `Lesson ${LESSON_NO}. The prism`,
)

const BLOCK = { label: 'B7', from: 44, to: 49, current: 44 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('PRIZMA', 'ПРИЗМА', 'THE PRISM'),
  title: L("Olti qirra yoki to'qqiz", 'Шесть рёбер или девять', 'Six edges or nine'),
  audio: [
    A('mount', 'Uchburchakli prizma. Tepada va pastda ikki uchburchak, ular orasida yon sirt.', 'Треугольная призма. Два треугольника сверху и снизу, между ними боковая поверхность.', 'A triangular prism. Two triangles above and below, and the lateral surface between them.'),
    A('r1', 'Birinchi yozuv oltini aytadi. Pastda uchta tomon va tepada uchta.', 'Первая запись говорит шесть. Три стороны внизу и три сверху.', 'The first reading says six. Three sides below and three above.'),
    A('r2', "Ikkinchisi to'qqizni aytadi.", 'Вторая говорит девять.', 'The second says nine.'),
    A('ask', "Chizmaga qarang va qaysi yozuv to'g'ri ekanini hal qiling. Hozircha shunchaki taxmin qiling.", 'Посмотри на чертёж и реши, какая запись верная. Пока просто предположи.', 'Look at the drawing and decide which reading is right. Just guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi prizmani buramiz.', 'Твой ответ записан. Сейчас повернём призму.', 'Your answer is recorded. Now we rotate the prism.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('olti', 'шесть', 'six'),
      value: '6',
    },
    b: {
      name: L("to'qqiz", 'девять', 'nine'),
      value: '9',
    },
  },
  expr: 'ABCA₁B₁C₁',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Tekisliklar bloki dan uch savol', 'Три вопроса из блока про плоскости', 'Three questions from the block about planes'),
  tag: 'support',
  audio: [
    A('mount', "Uchta savol. Prizma tekislikka turganda uchalasi ham kerak bo'ladi.", 'Три вопроса. Все три понадобятся, когда призма встанет на плоскость.', 'Three questions. All three will be needed when the prism stands on a plane.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("To'g'ri chiziq qachon tekislikka perpendikulyar?", 'Когда прямая перпендикулярна плоскости?', 'When is a line perpendicular to a plane?'),
      done: 'a ⊥ b,  a ⊥ c   →   a ⊥ α',
      items: [
        { id: 'a', label: L("ikki kesishuvchi chiziqqa perpendikulyar bo'lganda", 'когда перпендикулярна двум пересекающимся', 'when perpendicular to two crossing lines'), correct: true },
        { id: 'b', label: L("bitta chiziqqa perpendikulyar bo'lganda", 'когда перпендикулярна одной прямой', 'when perpendicular to one line'), hint: L("Bittasi kam, burilish shuni ko'rsatgan.", 'Одной мало, поворот это показывал.', 'One is not enough, the rotation showed that.') },
        { id: 'c', label: L("tekislikni kesib o'tganda", 'когда пересекает плоскость', 'when it crosses the plane'), hint: L("Kesib o'tish qiyshiq ham bo'ladi.", 'Пересечь можно и наклонно.', 'Crossing can be at a slant too.') },
        { id: 'd', label: L('tekislikda yotganda', 'когда лежит в плоскости', 'when it lies in the plane'), hint: L('Tekislikda yotgan chiziq unga perpendikulyar emas.', 'Лежащая в плоскости прямая ей не перпендикулярна.', 'A line lying in the plane is not perpendicular to it.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Ikki yoqli burchak nima?', 'Что такое двугранный угол?', 'What is a dihedral angle?'),
      done: 'a = α ∩ β',
      items: [
        { id: 'a', label: L('umumiy qirrali ikki yarimtekislik', 'две полуплоскости с общим ребром', 'two half-planes with a common edge'), correct: true },
        { id: 'b', label: L('ikki kesishuvchi chiziq', 'две пересекающиеся прямые', 'two crossing lines'), hint: L('Bu yassi burchak, ikki yoqli emas.', 'Это плоский угол, а не двугранный.', 'That is a plane angle, not a dihedral one.') },
        { id: 'c', label: L('ikki parallel tekislik', 'две параллельные плоскости', 'two parallel planes'), hint: L("Parallellarning umumiy qirrasi yo'q.", 'У параллельных общего ребра нет.', 'Parallel planes have no common edge.') },
        { id: 'd', label: L('chiziq va tekislik orasidagi burchak', 'угол между прямой и плоскостью', 'the angle between a line and a plane'), hint: L("O'sha burchak chiziq haqida edi, bu esa ikki yoq haqida.", 'Тот угол был про прямую, а этот про две грани.', 'That angle was about a line, this one about two faces.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Ikki parallel to'g'ri chiziq orqali nechta tekislik o'tadi?", 'Сколько плоскостей проходит через две параллельные прямые?', 'How many planes pass through two parallel lines?'),
      done: '1',
      items: [
        { id: 'a', label: L('bitta', 'одна', 'one'), correct: true },
        { id: 'b', label: L('ikkita', 'две', 'two'), hint: L("Ikki tekislik chiziq bo'ylab kesishardi.", 'Две плоскости пересеклись бы по прямой.', 'Two planes would cross along a line.') },
        { id: 'c', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p BITTA chiziq orqali bo'ladi.", 'Бесконечно много бывает через ОДНУ прямую.', 'Infinitely many happens through ONE line.') },
        { id: 'd', label: L("bitta ham yo'q", 'ни одной', 'none'), hint: L('Parallel chiziqlar doim bitta tekislikda yotadi.', 'Параллельные прямые всегда лежат в одной плоскости.', 'Parallel lines always lie in one plane.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Yassi ko'pburchaklardan jism", 'Тело из плоских многоугольников', 'A body of flat polygons'),
  tag: 'kartinka-kak-dokazatelstvo',
  show: [
    [
      L("pastdagi ko'pburchak yoq", 'нижний многоугольник это грань', 'the lower polygon is a face'),
      L("bunday ko'pburchaklar bir nechta", 'таких многоугольников несколько', 'there are several such polygons'),
    ],
    [
      L('birgalikda ular jismni chegaralaydi', 'вместе они ограничивают тело', 'together they bound a body'),
      L("har yoq yassi, jism esa yo'q", 'каждая грань плоская, тело нет', 'each face is flat, the body is not'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Oldimizda yassi ko'pburchaklar bilan chegaralangan jism. Bunday jism ko'pyoq deb ataladi.", 'Перед нами тело, ограниченное плоскими многоугольниками. Такое тело называется многогранником.', 'Before us is a body bounded by flat polygons. Such a body is called a polyhedron.'),
    A('move', "Ko'pburchaklar ko'pyoqning yoqlari, ularning uchlari ko'pyoqning uchlari, tomonlari esa qirralari. Qirq to'rtinchi betda shunday. Jismni buring va bitta yoqqa qarang. U har qanday burilishda yassi qoladi, chunki u ko'pburchak, jismning o'zi esa hech qachon yassi bo'lmaydi. Yoq va jism orasidagi farq ikki o'lchov va uch o'lchov orasidagi farq, va chizmada u faqat burilishda ko'rinadi.", 'Многоугольники это грани многогранника, их вершины это вершины многогранника, а стороны это рёбра. Так на странице сорок четыре. Поверни тело и следи за одной гранью. Она остаётся плоской при любом повороте, потому что она многоугольник, а вот само тело плоским не бывает никогда. Разница между гранью и телом это разница между двумерным и трёхмерным, и на чертеже она видна только в повороте.', 'The polygons are the faces of the polyhedron, their vertices are its vertices, and their sides are its edges. So it is on page forty four. Rotate the body and watch one face. It stays flat at any rotation, because it is a polygon, while the body itself is never flat. The difference between a face and the body is the difference between two dimensions and three, and on a drawing it shows only under rotation.'),
    A('work', "O'zingiz hisoblang. Uchburchakli prizmaning nechta yog'i bor?", 'Посчитай сам. Сколько граней у треугольной призмы?', 'Work it out yourself. How many faces does a triangular prism have?'),
  ],
  work: {
    prompt: L('Nechta yoq?', 'Сколько граней?', 'How many faces?'),
    ok: L("Beshta. Ikki uchburchak va uch to'rtburchak.", 'Пять. Два треугольника и три четырёхугольника.', 'Five. Two triangles and three quadrilaterals.'),
    hint: [
      L('Tepa va pastdagilarini hamda yonlaridagilarini alohida sanang.', 'Считай отдельно те, что сверху и снизу, и те, что по бокам.', 'Count the ones above and below separately from the side ones.'),
      L('Tepada va pastda bittadan uchburchak.', 'Сверху и снизу по одному треугольнику.', 'One triangle above and one below.'),
      L("Ikki qo'shuv uch.", 'Два плюс три.', 'Two plus three.'),
    ],
    answer: '5',
  },
  expr: '2 + 3 = 5',
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Qirra ikki yoqqa tegishli', 'Ребро принадлежит двум граням', 'An edge belongs to two faces'),
  tag: 'gran-ne-storona',
  show: [
    [
      L('bitta yoq yoritilgan', 'одна грань подсвечена', 'one face is highlighted'),
      L('uning tomonlari bor', 'у неё есть стороны', 'it has sides'),
    ],
    [
      L('ikkinchi yoq yoritilgan', 'подсвечена вторая грань', 'the second face is highlighted'),
      L('tomoni umumiy, bu qirra', 'сторона у них общая, это ребро', 'the side is common, that is the edge'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Bitta yoqni yoritamiz. Unda, har qanday ko'pburchakda bo'lgani kabi, tomonlar bor.", 'Подсветим одну грань. У неё, как у любого многоугольника, есть стороны.', 'Let us highlight one face. Like any polygon it has sides.'),
    A('move', "Endi birinchisi bilan umumiy tomoni bor ikkinchi yoqni yoritamiz. Bu umumiy tomon ko'pyoqning qirrasi deb ataladi. Sanoq qoidasi ham shundan. Har qirra roppa-rosa ikki yoqqa tegishli, shuning uchun barcha yoqlarning tomonlarini ketma-ket sanash mumkin emas, har qirra ikki marta tushadi. Uchburchakli prizmada yoqlarning tomonlari o'n sakkizta, qirralar esa to'qqizta. Jismni buring va umumiy qirra har qanday rakursda umumiy qolishiga ishonch hosil qiling.", 'Теперь подсветим вторую грань, у которой с первой есть общая сторона. Эта общая сторона и называется ребром многогранника. Отсюда правило счёта. Каждое ребро принадлежит ровно двум граням, поэтому считать стороны всех граней подряд нельзя, каждое ребро попадётся дважды. У треугольной призмы сторон у граней восемнадцать, а рёбер девять. Поверни тело и убедись, что общее ребро остаётся общим при любом ракурсе.', 'Now let us highlight a second face that shares a side with the first. That common side is called an edge of the polyhedron. Hence the counting rule. Every edge belongs to exactly two faces, so you cannot count the sides of all faces one after another, each edge would come up twice. A triangular prism has eighteen face sides and nine edges. Rotate the body and make sure the common edge stays common at any view.'),
    A('work', "O'zingiz hisoblang. Bitta qirrada nechta yoq tutashadi?", 'Посчитай сам. Сколько граней сходится в одном ребре?', 'Work it out yourself. How many faces meet at one edge?'),
  ],
  work: {
    prompt: L('Bitta qirrada nechta yoq?', 'Сколько граней в одном ребре?', 'How many faces at one edge?'),
    ok: L('Ikkita. Shuning uchun qirralar barcha yoqlar tomonlaridan ikki baravar kam.', 'Две. Поэтому рёбер вдвое меньше, чем сторон у всех граней.', 'Two. That is why there are half as many edges as sides of all the faces.'),
    hint: [
      L('Yoritilgan tomonga qarang va undagi yoqlarni sanang.', 'Посмотри на подсвеченную сторону и посчитай грани при ней.', 'Look at the highlighted side and count the faces at it.'),
      L("Qirra ikki yoq orasidagi buklanish chizig'i.", 'Ребро это линия сгиба между двумя гранями.', 'An edge is the fold line between two faces.'),
      L('Ikkita.', 'Две.', 'Two.'),
    ],
    answer: '2',
  },
  expr: '18 : 2 = 9',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Asoslar va yon yoqlar', 'Основания и боковые грани', 'The bases and the lateral faces'),
  tag: 'gran-ne-storona',
  show: [
    [
      L('ikki yoq teng va parallel', 'две грани равны и параллельны', 'two faces are equal and parallel'),
      L('bu prizmaning asoslari', 'это основания призмы', 'these are the bases of the prism'),
    ],
    [
      L('qolgan yoqlar parallelogrammlar', 'остальные грани параллелограммы', 'the other faces are parallelograms'),
      L('bu yon yoqlar', 'это боковые грани', 'these are the lateral faces'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Prizmada yoqlar teng huquqli emas. Ulardan ikkitasi alohida.', 'В призме грани не равноправны. Две из них особые.', 'In a prism the faces are not equal in role. Two of them are special.'),
    A('move', "Prizma deb ikki yog'i teng ko'pburchakdan, qolganlari esa parallelogrammlardan iborat ko'pyoqqa aytiladi. Teng yoqlar asoslar, parallelogrammlar yon yoqlar. Qirq to'rtinchi betda shunday. Prizmani buring. Yaqin yoq o'zgaradi, uzoq yoq o'zgaradi, asoslar esa asos bo'lib qoladi. Kim asos ekanini shakl va parallellik belgilaydi, chizmaning pastida nima qolgani emas. Shuning uchun prizmani yon yog'iga qo'yish mumkin, va u prizma bo'lishdan to'xtamaydi.", 'Призмой называется многогранник, у которого две грани равные многоугольники, а остальные параллелограммы. Равные грани это основания, параллелограммы это боковые грани. Так на странице сорок четыре. Поверни призму. Ближняя грань меняется, дальняя меняется, а основания остаются основаниями. Кто основание, определяется формой и параллельностью, а не тем, что оказалось внизу чертежа. Поэтому призму можно поставить на боковую грань, и она не перестанет быть призмой.', 'A prism is a polyhedron in which two faces are equal polygons and the rest are parallelograms. The equal faces are the bases, the parallelograms are the lateral faces. So it is on page forty four. Rotate the prism. The near face changes, the far face changes, but the bases stay bases. What counts as a base is decided by shape and parallelism, not by what happened to be at the bottom of the drawing. That is why a prism can be stood on a lateral face and it does not stop being a prism.'),
    A('work', "O'zingiz hisoblang. To'rtburchakli prizmaning nechta yon yog'i bor?", 'Посчитай сам. Сколько боковых граней у четырёхугольной призмы?', 'Work it out yourself. How many lateral faces does a quadrilateral prism have?'),
  ],
  work: {
    prompt: L('Nechta yon yoq?', 'Сколько боковых граней?', 'How many lateral faces?'),
    ok: L("To'rtta. Asos tomonlari qanchaligicha.", 'Четыре. Столько же, сколько сторон у основания.', 'Four. As many as the sides of the base.'),
    hint: [
      L('Asosning nechta tomoni borligiga qarang.', 'Посмотри, сколько сторон у основания.', 'See how many sides the base has.'),
      L('Asosning har tomoni bitta yon yoq beradi.', 'Каждая сторона основания даёт одну боковую грань.', 'Each side of the base gives one lateral face.'),
      L("To'rtta.", 'Четыре.', 'Four.'),
    ],
    answer: '4',
  },
  expr: 'ABCD ∥ A₁B₁C₁D₁',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Asos tomonlari soni bo'yicha sanaymiz", 'Считаем по числу сторон основания', 'Counting by the number of base sides'),
  tag: 'gran-ne-storona',
  show: [
    [
      L('asosda olti tomon', 'у основания шесть сторон', 'the base has six sides'),
      L('demak yon qirralar ham olti', 'значит боковых рёбер тоже шесть', 'so there are six lateral edges as well'),
    ],
    [
      L('asos qirralari pastda olti', 'рёбер основания шесть внизу', 'six base edges below'),
      L('va tepada olti', 'и шесть сверху', 'and six above'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Oltiburchakli prizma. Uning qirralarini chizma bo'yicha sanash qiyin, shuning uchun qoida bo'yicha sanaymiz.", 'Шестиугольная призма. Считать её рёбра по чертежу трудно, поэтому будем считать по правилу.', 'A hexagonal prism. Counting its edges from the drawing is hard, so we will count by the rule.'),
    A('move', "Asosida n tomoni bo'lgan prizmada asos qirralari pastda n va tepada n, yon qirralar esa asos uchlari qanchaligicha, ya'ni yana n. Jami uch n chiqadi. Bunday prizmaning uchlari ikki n, yoqlari esa n qo'shuv ikki. Uchburchakli prizmada tekshiring. Uch karra uch bu to'qqiz qirra, va bu dars boshida izlagan javobimiz. Prizmani buring va yon qirralarni o'zingiz sanang, ular yon rakursdan yaxshi ko'rinadi.", 'У призмы с n сторонами в основании рёбер основания n внизу и n сверху, а боковых рёбер столько же, сколько вершин у основания, то есть тоже n. Всего получается три n. Вершин у такой призмы два n, а граней n плюс два. Проверь на треугольной призме. Три умножить на три это девять рёбер, и это ровно тот ответ, который мы искали в начале урока. Поверни призму и посчитай боковые рёбра сама, они хорошо видны с бокового ракурса.', 'In a prism with n sides in the base there are n base edges below and n above, and the lateral edges are as many as the vertices of the base, that is n again. In total that gives three n. Such a prism has two n vertices and n plus two faces. Check it on a triangular prism. Three times three is nine edges, and that is exactly the answer we were looking for at the start of the lesson. Rotate the prism and count the lateral edges yourself, they show well from a side view.'),
    A('work', "O'zingiz hisoblang. Oltiburchakli prizmaning nechta qirrasi bor?", 'Посчитай сам. Сколько рёбер у шестиугольной призмы?', 'Work it out yourself. How many edges does a hexagonal prism have?'),
  ],
  work: {
    prompt: L('Nechta qirra?', 'Сколько рёбер?', 'How many edges?'),
    ok: L("O'n sakkiz. Uch karra olti.", 'Восемнадцать. Три умножить на шесть.', 'Eighteen. Three times six.'),
    hint: [
      L('Uch guruh bilan sanang: past, tepa va yon.', 'Считай тремя группами: низ, верх и бок.', 'Count in three groups: bottom, top and side.'),
      L('Har guruhda oltitadan.', 'В каждой группе по шесть.', 'Six in each group.'),
      L('Uch karra olti.', 'Три умножить на шесть.', 'Three times six.'),
    ],
    answer: '18',
  },
  expr: '3n,   2n,   n + 2',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L("To'g'ri prizma va og'ma", 'Прямая призма и наклонная', 'A right prism and a slanted one'),
  tag: 'svoystvo-vmesto-priznaka',
  show: [
    [
      L("yon qirra asosga og'gan", 'боковое ребро наклонено к основанию', 'the lateral edge is slanted to the base'),
      L("yon yoqlar to'g'ri to'rtburchak emas", 'боковые грани не прямоугольники', 'the lateral faces are not rectangles'),
    ],
    [
      L("qirra perpendikulyar bo'ldi", 'ребро встало перпендикулярно', 'the edge stood perpendicular'),
      L("endi prizma to'g'ri", 'теперь призма прямая', 'now the prism is right'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Bir xil asosli ikki prizma. Farq yon qirralarning qanday turishida.', 'Две призмы с одинаковыми основаниями. Разница в том, как стоят боковые рёбра.', 'Two prisms with the same bases. The difference is how the lateral edges stand.'),
    A('move', "Prizma yon qirralari asosga perpendikulyar bo'lsa, to'g'ri prizma deb ataladi. Unda har yon yoq to'g'ri burchakli parallelogramm, ya'ni to'g'ri to'rtburchak bo'ladi. Og'ma prizmada yon yoqlar parallelogramm bo'lib qoladi, lekin ularda to'g'ri burchak yo'q. E'tibor bering, qimirlamas chizmada og'ish deyarli ko'rinmasligi mumkin, va buni biz perpendikulyarlik darsidan bilamiz. Ko'z bilan emas, qirraning perpendikulyarligi sharti bilan tekshirish kerak.", 'Призма называется прямой, если её боковые рёбра перпендикулярны основанию. Тогда каждая боковая грань это параллелограмм с прямым углом, то есть прямоугольник. У наклонной призмы боковые грани остаются параллелограммами, но прямых углов в них нет. Обрати внимание, что на неподвижном чертеже наклон бывает почти не виден, и мы это уже знали из урока про перпендикулярность. Проверять надо не глазом, а условием про перпендикулярность ребра.', 'A prism is called right if its lateral edges are perpendicular to the base. Then every lateral face is a parallelogram with a right angle, that is a rectangle. In a slanted prism the lateral faces stay parallelograms but have no right angles. Note that on a still drawing the slant can be almost invisible, and we knew that from the lesson about perpendicularity. It has to be checked by the condition about the edge, not by eye.'),
    A('work', "O'zingiz hisoblang. To'g'ri to'rtburchakli prizmaning nechta yon yog'i to'g'ri to'rtburchak?", 'Посчитай сам. Сколько боковых граней прямой четырёхугольной призмы прямоугольники?', 'Work it out yourself. How many lateral faces of a right quadrilateral prism are rectangles?'),
  ],
  work: {
    prompt: L("Nechta yon yoq to'g'ri to'rtburchak?", 'Сколько боковых граней прямоугольники?', 'How many lateral faces are rectangles?'),
    ok: L("To'rttasi ham. Perpendikulyar qirra har yon yoqda to'g'ri burchak beradi.", 'Все четыре. Перпендикулярное ребро даёт прямой угол в каждой боковой грани.', 'All four. A perpendicular edge gives a right angle in every lateral face.'),
    hint: [
      L('Jami nechta yon yoq borligiga qarang.', 'Посмотри, сколько боковых граней всего.', 'See how many lateral faces there are in total.'),
      L("Tekislikka perpendikulyar uning barcha chiziqlari bilan to'g'ri burchak beradi.", 'Перпендикуляр к плоскости даёт прямой угол со всеми её прямыми.', 'A perpendicular to a plane gives a right angle with all its lines.'),
      L("To'rttasi ham.", 'Все четыре.', 'All four.'),
    ],
    answer: '4',
  },
  expr: 'AA₁ ⊥ ABCD',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Prizmani prizma qiladigan narsa', 'Что делает призму призмой', 'What makes a prism a prism'),
  tag: 'svoystvo-vmesto-priznaka',
  motion: ['rule'],
  audio: [
    A('mount', 'Farqlashga bitta savol, keyin kartochka.', 'Один вопрос на различение, потом карточка.', 'One question to tell them apart, then the card.'),
    A('rule', "Ta'rifda ikki shart bor, va ikkalasi ham yoqlar haqida. Ikki asos teng, va ular istalgan shakldagi ko'pburchak. Qolgan yoqlar parallelogramm, va bu asoslarning teng va parallel bo'lishidan kelib chiqadi. Barcha yoqlar parallelogramm deyilsa, boshqa jism chiqadi, uning asoslari ham parallelogramm, ya'ni parallelepiped. To'g'ri prizma ustiga qo'shimcha shart, va u yon qirraning perpendikulyarligi haqida.", 'В определении два условия, и оба про грани. Два основания равны, и они многоугольники любой формы. Остальные грани параллелограммы, и это следует из того, что основания равны и параллельны. Если сказать, что все грани параллелограммы, получится другое тело, у которого и основания параллелограммы, то есть параллелепипед. Прямая призма это добавочное условие сверху, и оно про перпендикулярность бокового ребра.', 'The definition has two conditions and both are about faces. The two bases are equal and they are polygons of any shape. The other faces are parallelograms, and that follows from the bases being equal and parallel. If you say all faces are parallelograms you get a different body whose bases are parallelograms too, that is a parallelepiped. A right prism is an extra condition on top, and it is about the perpendicularity of the lateral edge.'),
  ],
  probe: {
    question: L('Qaysi shart majburiy?', 'Какое условие обязательно?', 'Which condition is required?'),
    items: [
      { id: 'a', label: L('ikki asos teng, qolganlari parallelogramm', 'два основания равные, остальные параллелограммы', 'two bases equal, the rest parallelograms'), correct: true },
      { id: 'b', label: L('barcha yoqlar parallelogramm', 'все грани параллелограммы', 'all faces are parallelograms'), hint: L("Unda uchburchakli prizma prizma bo'lmasdi.", 'Тогда треугольная призма призмой не была бы.', 'Then a triangular prism would not be a prism.') },
    ],
  },
  rule: {
    lawLabel: L('Prizma', 'Призма', 'The prism'),
    lines: [
      L("ikki yoq teng ko'pburchak, bu asoslar", 'две грани равные многоугольники, это основания', 'two faces are equal polygons, these are the bases'),
      L('qolgan yoqlar parallelogramm, bu yon yoqlar', 'остальные грани параллелограммы, это боковые грани', 'the other faces are parallelograms, these are the lateral faces'),
      L("yon qirra asosga perpendikulyar bo'lsa, prizma to'g'ri", 'если боковое ребро перпендикулярно основанию, призма прямая', 'if the lateral edge is perpendicular to the base, the prism is right'),
    ],
    law: 'ABC = A₁B₁C₁,   ABB₁A₁ = ▱',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Har bir qismni nomlang', 'Назови каждую часть', 'Name each part'),
  tag: 'gran-ne-storona',
  audio: [
    A('mount', "To'rt yozuv va to'rt nom. Ularni birlashtiring.", 'Четыре записи и четыре названия. Соедини их.', 'Four readings and four names. Match them.'),
  ],
  match: {
    prompt: L('Yozuvni nomi bilan birlashtiring', 'Соедини запись с названием', 'Match the reading with the name'),
    ok: L("To'rttasi ham joyida. Bundan keyin bu nomlarni ishchi deb olamiz.", 'Все четыре на месте. Дальше эти имена берём как рабочие.', 'All four in place. From here these names are the working ones.'),
    a: L('asos', 'основание', 'the base'),
    b: L('yon yoq', 'боковая грань', 'a lateral face'),
    c: L('yon qirra', 'боковое ребро', 'a lateral edge'),
    d: L('asos qirrasi', 'ребро основания', 'a base edge'),
    left: ['ABC', 'ABB₁A₁', 'AA₁', 'AB'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Yon yoqlar haqida isbotlang', 'Докажи про боковые грани', 'Prove it about the lateral faces'),
  tag: 'svoystvo-vmesto-priznaka',
  audio: [
    A('mount', "Uch qator, va har birining ro'yxatdan o'z asoslashi bor.", 'Три строки, и у каждой своё обоснование из списка.', 'Three lines, each with its own justification from the list.'),
  ],
  proof: {
    given: L("to'g'ri prizma", 'прямая призма', 'a right prism'),
    goal: L("uning yon yoqlari to'g'ri to'rtburchak", 'её боковые грани прямоугольники', 'its lateral faces are rectangles'),
    r1: L('yon qirra asosga perpendikulyar', 'боковое ребро перпендикулярно основанию', 'the lateral edge is perpendicular to the base'),
    r2: L('demak u asos qirrasiga perpendikulyar', 'значит оно перпендикулярно ребру основания', 'so it is perpendicular to the base edge'),
    r3: L("yon yoq to'g'ri burchakli parallelogramm", 'боковая грань параллелограмм с прямым углом', 'the lateral face is a parallelogram with a right angle'),
    ok: L("Isbotlandi. To'g'ri burchakli parallelogramm to'g'ri to'rtburchak.", 'Доказано. Параллелограмм с прямым углом это прямоугольник.', 'Proved. A parallelogram with a right angle is a rectangle.'),
    e1: L("Prizma ta'rifi keyin keladi. Avval to'g'ri so'zi haqida.", 'Определение призмы идёт дальше. Сначала про слово прямая.', 'The definition of a prism comes later. First about the word right.'),
    e2: L('Tekislikka perpendikulyarlik bor. U undagi chiziqlarga nima beradi.', 'Перпендикулярность к плоскости уже есть. Что она даёт прямым в ней.', 'Perpendicularity to the plane is there. What does it give to the lines in it.'),
    e3: L("To'g'ri burchak olindi. Endi yoqning shakli haqida.", 'Прямой угол получен. Теперь про форму грани.', 'The right angle is obtained. Now about the shape of the face.'),
  },
  reason: {
    s1: L("to'g'ri prizma ta'rifi", 'определение прямой призмы', 'the definition of a right prism'),
    s2: L("perpendikulyar tekislikning barcha chiziqlari bilan to'g'ri burchak beradi", 'перпендикуляр даёт прямой угол со всеми прямыми плоскости', 'a perpendicular gives a right angle with all lines of the plane'),
    s3: L("prizma ta'rifi", 'определение призмы', 'the definition of a prism'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: 'AA₁ ⊥ ABCD   →   ABB₁A₁ = ▭',
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
    A('next', 'Endi yozuvlar tartibi. Prizma qanday qurilsa, shunday joylashtiring.', 'Теперь порядок записей. Расставь их так, как строится призма.', 'Now the order of the readings. Arrange them the way a prism is built.'),
  ],
  task: {
    ok: L("O'ttiz. Uch karra o'n.", 'Тридцать. Три умножить на десять.', 'Thirty. Three times ten.'),
    hint: [
      L('Uch guruh bilan sanang: past, tepa va yon.', 'Считай тремя группами: низ, верх и бок.', 'Count in three groups: bottom, top and side.'),
      L("Har guruhda o'ntadan.", 'В каждой группе по десять.', 'Ten in each group.'),
      L("Uch karra o'n.", 'Три умножить на десять.', 'Three times ten.'),
    ],
    prompt: 'n = 10,   3n = ?',
    answer: '30',
  },
  order: {
    prompt: L('Yozuvlarni prizma qurilish tartibida joylashtiring', 'Расставь записи в том порядке, в каком строится призма', 'Arrange the readings in the order a prism is built'),
    title: L('Qurish tartibi', 'Порядок построения', 'The order of construction'),
    ok: L("Tartib to'g'ri. Avval asos, keyin ikkinchisi, keyin yon qirra va yoq.", 'Порядок верный. Сначала основание, потом второе, потом боковое ребро и грань.', 'The order is right. First the base, then the second one, then the lateral edge and face.'),
    bad: L("Bu tartibda emas. Nima avval paydo bo'ladi.", 'Не в этом порядке. Что появляется раньше.', 'Not in this order. What appears first.'),
    items: ['ABB₁A₁', 'ABC', 'A₁B₁C₁', 'AA₁'],
    answer: 'ABC  A₁B₁C₁  AA₁  ABB₁A₁',
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
    A('mount', "To'rt qator, va ulardan biri shartni almashtiradi.", 'Четыре строки, и одна из них подменяет условие.', 'Four lines, and one of them substitutes the condition.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("Shart to'g'ri ko'chirilgan.", 'Условие переписано верно.', 'The condition is copied correctly.'),
    r2: L("To'g'ri prizmaning yon yoqlari haqiqatan to'g'ri to'rtburchak.", 'Боковые грани прямой призмы действительно прямоугольники.', 'The lateral faces of a right prism really are rectangles.'),
    r4: L('Xulosa yuqoridagi xato qatordan olingan.', 'Вывод получен из неверной строки выше.', 'The conclusion comes from the wrong line above.'),
  },
  proof: L("Prizmani buring: asos muntazam bo'lmadi, to'g'ri esa u boshidan edi.", 'Поверни призму: основание правильным не стало, а прямой она была с самого начала.', 'Rotate the prism: the base did not become regular, while right it was from the start.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L("Uchinchi. To'g'ri prizma va muntazam prizma boshqa-boshqa shart.", 'Третья. Прямая призма и правильная это разные условия.', 'The third. A right prism and a regular prism are different conditions.'),
    hint: [
      L('Har qatorda asos haqida nima aytilganini tekshiring.', 'Проверь, что в каждой строке сказано про основание.', 'Check what each line says about the base.'),
      L("Muntazam prizma faqat to'g'ri qirra emas, muntazam asos ham talab qiladi.", 'Правильная призма требует правильного основания, а не только прямых рёбер.', 'A regular prism needs a regular base, not just perpendicular edges.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'AA₁ ⊥ ABCD',
    r2: 'ABB₁A₁ = ▭',
    r3: 'AB = BC = CD = DA',
    r4: 'P = 4·AB',
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
    A('mount', "Qoidani o'ngdan chapga o'qiymiz. Qirralar soni bo'yicha asosni aytamiz.", 'Прочитаем правило справа налево. По числу рёбер назовём основание.', 'Let us read the rule from right to left. From the number of edges we name the base.'),
    A('work', "Har qanday prizma uchun to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны для любой призмы. Их больше одной.', 'Mark all the readings that are true for any prism. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Har qanday prizma uchun nima to'g'ri", 'Что верно для любой призмы', 'What is true for any prism'),
    ok: L("Beshtadan uch yozuv. Qolgan ikkitasi har qanday prizmada to'g'ri emas.", 'Три записи из пяти. Две оставшиеся верны не для любой призмы.', 'Three readings out of five. The other two are not true for every prism.'),
    items: [
      { id: 'd', label: 'ABB₁A₁ = ▭', hint: L("Bu faqat to'g'ri prizmada to'g'ri.", 'Это верно только у прямой призмы.', 'That is true only for a right prism.') },
      { id: 'e', label: '2n = n + 2', hint: L("Yoqlar n qo'shuv ikki, ikki n emas.", 'Граней n плюс два, а не два n.', 'The faces are n plus two, not two n.') },
      { id: 'a', label: '3n', ok: true },
      { id: 'b', label: '2n', ok: true },
      { id: 'c', label: 'n + 2', ok: true },
    ],
  },
  place: {
    prompt: L('Prizmaning yigirma bir qirrasi bor. Asosining nechta tomoni bor?', 'У призмы двадцать одно ребро. Сколько сторон у её основания?', 'A prism has twenty one edges. How many sides does its base have?'),
    ok: L("Yetti. Qirralar uch n, demak n yigirma birni uchga bo'lgani.", 'Семь. Рёбер три n, значит n это двадцать один делить на три.', 'Seven. The edges are three n, so n is twenty one divided by three.'),
    wrong: L('Prizmada qirralar nechta guruh ekanini eslang.', 'Вспомни, сколько групп рёбер у призмы.', 'Recall how many groups of edges a prism has.'),
    target: '7',
    step: '3n = 21',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'gran-ne-storona',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Qirrada nechta yoq tutashadi?', 'Сколько граней сходится в ребре?', 'How many faces meet at an edge?'),
      done: '2',
      items: [
        { id: 'a', label: L('ikkita', 'две', 'two'), correct: true },
        { id: 'b', label: L('bitta', 'одна', 'one'), hint: L('Bitta yoq qirra emas, shunchaki tomon berardi.', 'Одна грань дала бы не ребро, а просто сторону.', 'One face would give not an edge but just a side.') },
        { id: 'c', label: L('uchta', 'три', 'three'), hint: L('Uch yoq uchda tutashadi, qirrada emas.', 'Три грани сходятся в вершине, а не в ребре.', 'Three faces meet at a vertex, not at an edge.') },
        { id: 'd', label: L("prizmaga bog'liq", 'зависит от призмы', 'it depends on the prism'), hint: L("Bu har qanday ko'pyoqda to'g'ri.", 'Это верно у любого многогранника.', 'This is true for any polyhedron.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Prizmaning asoslari nima?', 'Что такое основания призмы?', 'What are the bases of a prism?'),
      done: 'ABC = A₁B₁C₁',
      items: [
        { id: 'a', label: L('ikki teng yoq', 'две равные грани', 'two equal faces'), correct: true },
        { id: 'b', label: L('ikki pastdagi yoq', 'две нижние грани', 'the two lower faces'), hint: L("Past va tepa chizmaga bog'liq, asoslar esa yo'q.", 'Низ и верх зависят от чертежа, а основания нет.', 'Bottom and top depend on the drawing, the bases do not.') },
        { id: 'c', label: L('barcha parallelogrammlar', 'все параллелограммы', 'all the parallelograms'), hint: L('Parallelogrammlar yon yoqlar.', 'Параллелограммы это боковые грани.', 'The parallelograms are the lateral faces.') },
        { id: 'd', label: L('eng katta yoq', 'самая большая грань', 'the biggest face'), hint: L("O'lcham bu yerda hech narsani hal qilmaydi.", 'Размер тут ничего не решает.', 'Size decides nothing here.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Beshburchakli prizmaning nechta uchi bor?', 'Сколько вершин у пятиугольной призмы?', 'How many vertices does a pentagonal prism have?'),
      done: '2n = 10',
      items: [
        { id: 'a', label: L("o'nta", 'десять', 'ten'), correct: true },
        { id: 'b', label: L('beshta', 'пять', 'five'), hint: L('Beshta faqat bitta asosda.', 'Пять только в одном основании.', 'Five is only in one base.') },
        { id: 'c', label: L("o'n beshta", 'пятнадцать', 'fifteen'), hint: L("O'n besh qirralar soni.", 'Пятнадцать это число рёбер.', 'Fifteen is the number of edges.') },
        { id: 'd', label: L('yettita', 'семь', 'seven'), hint: L('Yetti yoqlar soni.', 'Семь это число граней.', 'Seven is the number of faces.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Prizma qachon to'g'ri?", 'Когда призма прямая?', 'When is a prism right?'),
      done: 'AA₁ ⊥ ABCD',
      items: [
        { id: 'a', label: L('yon qirra asosga perpendikulyar', 'боковое ребро перпендикулярно основанию', 'the lateral edge is perpendicular to the base'), correct: true },
        { id: 'b', label: L('asos muntazam', 'основание правильное', 'the base is regular'), hint: L('Bu muntazam prizmaning sharti.', 'Это условие правильной призмы.', 'That is the condition of a regular prism.') },
        { id: 'c', label: L('barcha yoqlar teng', 'все грани равны', 'all faces are equal'), hint: L("Bunday hol asos tomoni balandlikdan katta kubda ham bo'lmaydi.", 'Такого не бывает даже у куба со стороной основания больше высоты.', 'That does not happen even for a box whose base side differs from its height.') },
        { id: 'd', label: L('asosda turadi', 'стоит на основании', 'it stands on its base'), hint: L("Chizmada qanday turgani ishga aloqasi yo'q.", 'Как стоит на чертеже, к делу не относится.', 'How it stands on the drawing is irrelevant.') },
      ],
    },
  ],
  angles: ['ABC', 'ABB₁A₁', 'AA₁', 'AB'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Endi nimani bilasiz', 'Что теперь умеешь', 'What you can do now'),
  audio: [
    A('mount', 'Dars uchburchakli prizmaning nechta qirrasi bor degan savol bilan boshlandi.', 'Урок начался с вопроса, сколько рёбер у треугольной призмы.', 'The lesson began with the question how many edges a triangular prism has.'),
    A('next', "Olti faqat asoslarni sanab, yon qirralarni esdan chiqarganda chiqadi. To'g'ri javob to'qqiz, va u chizmadan emas, qoidadan kelib chiqadi. Asosida n tomoni bo'lgan prizmada qirralar uch n, uchlar ikki n, yoqlar n qo'shuv ikki. Keyin asosi ham parallelogramm bo'lgan prizmani olamiz va bu nima yangilik berishini ko'ramiz.", 'Шесть получается, если считать только основания и забыть боковые рёбра. Правильный ответ девять, и он выводится не из чертежа, а из правила. У призмы с n сторонами в основании рёбер три n, вершин два n, граней n плюс два. Дальше мы возьмём призму, у которой и основание параллелограмм, и посмотрим, что нового это даёт.', 'Six comes out if you count only the bases and forget the lateral edges. The right answer is nine, and it follows from the rule rather than from the drawing. In a prism with n sides in the base there are three n edges, two n vertices and n plus two faces. Next we will take a prism whose base is a parallelogram too and see what that adds.'),
  ],
  can: [
    L('Yoq, qirra va uchni ajrataman', 'Различаю грань, ребро и вершину', 'I tell a face, an edge and a vertex apart'),
    L('Qirra ikki yoqqa tegishli ekanini bilaman', 'Знаю, что ребро принадлежит двум граням', 'I know an edge belongs to two faces'),
    L("Qirra, uch va yoqlarni asos tomonlari soni bo'yicha sanayman", 'Считаю рёбра, вершины и грани по числу сторон основания', 'I count edges, vertices and faces by the number of base sides'),
    L("To'g'ri prizmani og'madan ajrataman", 'Отличаю прямую призму от наклонной', 'I tell a right prism from a slanted one'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L("Bundan keyin parallelepiped, asosi ham parallelogramm bo'lgan prizma", 'Дальше параллелепипед — призма, у которой и основание параллелограмм', 'Next comes the parallelepiped, a prism whose base is a parallelogram too'),
  lifehack: L("Qirralarni sanayotgan bo'lsangiz, ketma-ket emas, uch guruh bilan sanang", 'Считаешь рёбра — считай тремя группами, не подряд', 'Counting edges, count in three groups rather than one by one'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L("Geometriya, qirq to'rtinchi va qirq beshinchi betlar", 'Геометрия, страницы сорок четыре и сорок пять', 'Geometry, pages forty four and forty five'),
  hook: {
    a: '6',
    b: '9',
  },
  proved: '3n = 9',
  law: '3n,   2n,   n + 2',
  sheet: [
    'ABC = A₁B₁C₁',
    'ABB₁A₁ = ▱',
    '3n',
    '2n',
    'n + 2',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/−/g, '-'))

// PRIBOR 6B. Jism generator bilan quriladi: uchlar darslikdagidek nomlanadi.
// Uchburchakli prizma -- darsning asosiy jismi (9 qirra, savol shu haqda),
// to'rtburchakli -- 5-ekranda asos va yon yoq uchun, oltiburchakli -- 6-ekranda
// sanoq qoidasi uchun, og'ma -- 7-ekranning chegarasi.
const TRI = { kind: 'prism', n: 3, h: 1.15, turn: 0.6 }
const QUAD = { kind: 'prism', n: 4, h: 1.1, turn: 0.5 }
const HEX = { kind: 'prism', n: 6, h: 1.05, r: 0.58 }
const SLANT = { kind: 'prism', n: 4, h: 1.1, turn: 0.5, skew: [0.42, 0.24] }

const GREY = '#7f8c8d'
const FACE2 = '#6b8fa3'

// Yoqlar: asos va yon yoq BOSHQA rangda, aks holda ular bitta dog'ga qo'shilib
// ketadi (43-darsda shu ko'rindi).
const BASE_TRI = [{ by: ['A', 'B', 'C'] }]
const BOTH_TRI = [{ by: ['A', 'B', 'C'] }, { by: ['A', 'B', 'B1', 'A1'], tone: FACE2 }]
const BASE_QUAD = [{ by: ['A', 'B', 'C', 'D'] }]
const SIDE_QUAD = [{ by: ['A', 'B', 'C', 'D'] }, { by: ['A', 'B', 'B1', 'A1'], tone: FACE2 }]
const BASE_HEX = [{ by: ['A', 'B', 'C', 'D', 'E', 'F'], dim: true }]

const EDGE_AB = ['AB']
const EDGE_LAT = ['AA1']

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
            fig={<Space step={1} yaw={0.4} poly={TRI} faces={BASE_TRI} />}
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
            fig={<Space step={1} yaw={0.4} poly={TRI} faces={BASE_TRI} />}
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
            step={1} yaw={0.35 + phase * 0.4} poly={TRI}
            faces={phase === 0 ? BASE_TRI : BOTH_TRI}
          />
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={TRI} faces={BOTH_TRI} />}
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
            step={1} yaw={0.35} poly={TRI}
            faces={phase === 0 ? BASE_TRI : BOTH_TRI}
            hi={phase === 0 ? [] : EDGE_AB}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={TRI} faces={BOTH_TRI} hi={EDGE_AB} />}
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
            step={1} yaw={0.3 + phase * 0.5} poly={QUAD}
            faces={phase === 0 ? BASE_QUAD : SIDE_QUAD}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} poly={QUAD} faces={SIDE_QUAD} />}
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
            step={1} yaw={0.3 + phase * 0.45} poly={HEX}
            faces={BASE_HEX} hi={phase === 0 ? [] : EDGE_LAT}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} poly={HEX} faces={BASE_HEX} hi={EDGE_LAT} />}
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
            step={1} yaw={0.35} poly={phase === 0 ? SLANT : QUAD}
            faces={SIDE_QUAD} hi={EDGE_LAT}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={QUAD} faces={SIDE_QUAD} hi={EDGE_LAT} />}
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
                poly={TRI} faces={BOTH_TRI} hi={solved ? EDGE_LAT : []}
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
                poly={round === 1 ? QUAD : TRI}
                faces={round === 1 ? SIDE_QUAD : BOTH_TRI}
                hi={EDGE_AB}
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
