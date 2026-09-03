// ============================================================================
// 10-sinf, Dars 41. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS41_KONTENT.md
// Ma'lumot (ovoz, kadrlar, variantlar, razborlar, qoida, yakun) tayyor.
// Ekran tanalari qo'lda yozilgan: asbob va figurani tanlash matematik qaror,
// va u avtomatlashtirilmaydi (etalon §5.3).
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

import { Net, Space } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 41
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Muntazam prizma va piramida`,
  `Урок ${LESSON_NO}. Правильные призмы и пирамиды`,
  `Lesson ${LESSON_NO}. Regular prisms and pyramids`,
)

const BLOCK = { label: 'B7', from: 37, to: 42, current: 41 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('MUNTAZAM', 'ПРАВИЛЬНАЯ', 'REGULAR'),
  title: L('Bitta uzunlik yoki ikki', 'Одна длина или две', 'One length or two'),
  audio: [
    A('mount', 'Muntazam oltiburchakli prizma. Savol uning qirralari haqida: ular orasida nechta xil uzunlik bor.', 'Правильная шестиугольная призма. Вопрос про её рёбра: сколько среди них разных длин.', 'A regular hexagonal prism. The question is about its edges: how many different lengths are among them.'),
    A('r1', "Birinchi yozuv uzunlik bitta, ya'ni barcha qirralar teng deydi.", 'Первая запись говорит, что длина одна, то есть все рёбра равны.', 'The first reading says there is one length, that is all the edges are equal.'),
    A('r2', 'Ikkinchisi ikki uzunlik deydi.', 'Вторая говорит, что длин две.', 'The second says there are two lengths.'),
    A('ask', "Muntazam so'zi hammasi teng degandek eshitiladi. Sizningcha qaysi yozuv to'g'ri?", 'Слово правильная звучит так, будто равно всё. Как думаешь, какая запись верная?', 'The word regular sounds as if everything is equal. Which reading do you think is right?'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi qirralarga qaraymiz.', 'Твой ответ записан. Сейчас посмотрим на рёбра.', 'Your answer is recorded. Now we look at the edges.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('bitta', 'одна', 'one'),
      value: '1',
    },
    b: {
      name: L('ikkita', 'две', 'two'),
      value: '2',
    },
  },
  expr: 'ABCDEFA₁B₁C₁D₁E₁F₁',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Blokdan uch savol', 'Три вопроса из блока', 'Three questions from the block'),
  tag: 'support',
  audio: [
    A('mount', "Uchta savol. Muntazam so'zi birinchi ikkitasidan yig'iladi.", 'Три вопроса. Слово правильная соберётся из первых двух.', 'Three questions. The word regular will be assembled from the first two.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Prizma qachon to'g'ri?", 'Когда призма прямая?', 'When is a prism right?'),
      done: 'AA₁ ⊥ ABCD',
      items: [
        { id: 'a', label: L('yon qirra asosga perpendikulyar', 'боковое ребро перпендикулярно основанию', 'the lateral edge is perpendicular to the base'), correct: true },
        { id: 'b', label: L('asos muntazam', 'основание правильное', 'the base is regular'), hint: L("Bu asos haqida, to'g'ri esa qirra haqida.", 'Это про основание, а прямая про ребро.', 'That is about the base, right is about the edge.') },
        { id: 'c', label: L('barcha qirralar teng', 'все рёбра равны', 'all edges are equal'), hint: L("Teng qirralar faqat kubda bo'ladi.", 'Равные рёбра бывают только у куба.', 'Equal edges happen only in a cube.') },
        { id: 'd', label: L('asosda turadi', 'стоит на основании', 'it stands on its base'), hint: L("Chizmada qanday turgani ishga aloqasi yo'q.", 'Как стоит на чертеже, к делу не относится.', 'How it stands on the drawing is irrelevant.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Apofema nima?', 'Что такое апофема?', 'What is the apothem?'),
      done: 'SM ⊥ AB',
      items: [
        { id: 'a', label: L('uchdan yon yoqning balandligi', 'высота боковой грани из вершины', 'the height of a lateral face from the apex'), correct: true },
        { id: 'b', label: L('yon qirra', 'боковое ребро', 'the lateral edge'), hint: L('Qirra asos uchiga keladi.', 'Ребро приходит в вершину основания.', 'The edge arrives at a base vertex.') },
        { id: 'c', label: L('piramida balandligi', 'высота пирамиды', 'the height of the pyramid'), hint: L('Balandlik asos markaziga boradi.', 'Высота идёт в центр основания.', 'The height goes to the centre of the base.') },
        { id: 'd', label: L('tomonning yarmi', 'половина стороны', 'half the side'), hint: L('Tomonning yarmi katet, apofema emas.', 'Половина стороны это катет, а не апофема.', 'Half the side is a leg, not the apothem.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("To'g'ri prizmaning yon sirti?", 'Боковая поверхность прямой призмы?', 'The lateral area of a right prism?'),
      done: 'P·h',
      items: [
        { id: 'a', label: L('perimetr karra balandlik', 'периметр на высоту', 'the perimeter times the height'), correct: true },
        { id: 'b', label: L('tomon karra balandlik', 'сторона на высоту', 'a side times the height'), hint: L('Tomon bitta yoq beradi, butun tasmani emas.', 'Сторона даёт одну грань, а не всю ленту.', 'A side gives one face, not the whole strip.') },
        { id: 'c', label: L('perimetrning yarmi karra balandlik', 'половина периметра на высоту', 'half the perimeter times the height'), hint: L("Yarim piramidada paydo bo'ladi.", 'Половина появляется у пирамиды.', 'The half appears for a pyramid.') },
        { id: 'd', label: L('asos yuzasi karra balandlik', 'площадь основания на высоту', 'the base area times the height'), hint: L('Bu endi sirt yuzasi emas.', 'Это уже не площадь поверхности.', 'That is no longer a surface area.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("To'g'ri qo'shuv muntazam asos", 'Прямая плюс правильное основание', 'Right plus a regular base'),
  tag: 'svoystvo-vmesto-priznaka',
  show: [
    [
      L("asos muntazam ko'pburchak", 'основание правильный многоугольник', 'the base is a regular polygon'),
      L("lekin yon qirra og'gan", 'но боковое ребро наклонено', 'but the lateral edge is slanted'),
    ],
    [
      L("qirra perpendikulyar bo'ldi", 'ребро встало перпендикулярно', 'the edge stood perpendicular'),
      L('endi prizma muntazam', 'теперь призма правильная', 'now the prism is regular'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Asosida muntazam oltiburchak bo'lgan, lekin yon qirrasi og'ma prizmani olamiz.", 'Возьмём призму с правильным шестиугольником в основании, но с наклонным боковым ребром.', 'Take a prism with a regular hexagon in the base but with a slanted lateral edge.'),
    A('move', "Asos muntazam, prizma esa muntazam emas: u og'ma. Asosi muntazam ko'pburchakdan iborat to'g'ri prizma muntazam prizma deb ataladi. Qirq beshinchi betda shunday. Shartlar ikkita, va ular mustaqil. Qirrani asosga perpendikulyar qo'yamiz, va prizma muntazam bo'ladi. E'tibor bering, ta'rifda qirralarning tengligi haqida bir so'z ham yo'q, va bu bejiz emas: asos tomoni va balandlik alohida beriladi.", 'Основание правильное, а призма правильной не является: она наклонная. Правильной призмой называется прямая призма, основание которой правильный многоугольник. Так на странице сорок пять. Условий два, и они независимы. Поставим ребро перпендикулярно основанию, и призма станет правильной. Заметь, что про равенство рёбер в определении нет ни слова, и это не случайно: сторона основания и высота задаются отдельно.', 'The base is regular but the prism is not: it is slanted. A regular prism is a right prism whose base is a regular polygon. So it is on page forty five. There are two conditions and they are independent. Let us set the edge perpendicular to the base and the prism becomes regular. Note that the definition says nothing about the edges being equal, and that is no accident: the base side and the height are given separately.'),
    A('work', "O'zingiz hisoblang. Muntazam prizma ta'rifida nechta shart bor?", 'Посчитай сам. Сколько условий в определении правильной призмы?', 'Work it out yourself. How many conditions are in the definition of a regular prism?'),
  ],
  work: {
    prompt: L('Nechta shart?', 'Сколько условий?', 'How many conditions?'),
    ok: L("Ikkita. To'g'ri va muntazam asos.", 'Два. Прямая и правильное основание.', 'Two. Right, and a regular base.'),
    hint: [
      L("Kadrlar orasida nima o'zgarganini ko'ring.", 'Посмотри, что изменилось между кадрами.', 'See what changed between the frames.'),
      L("Muntazam asos bitta o'zi yetmadi.", 'Правильного основания одного не хватило.', 'A regular base alone was not enough.'),
      L('Ikkita.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
  expr: 'AA₁ ⊥ ABCDEF,   AB = BC = … = FA',
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Yon yoqlar teng to'g'ri to'rtburchaklar", 'Боковые грани равные прямоугольники', 'The lateral faces are equal rectangles'),
  tag: 'svoystvo-vmesto-priznaka',
  show: [
    [
      L('asosning barcha tomonlari teng', 'все стороны основания равны', 'all the base sides are equal'),
      L('barcha yoqlarning balandligi bir', 'высота у всех граней одна', 'all the faces share one height'),
    ],
    [
      L("demak yoqlar o'zaro teng", 'значит грани равны между собой', 'so the faces are equal to each other'),
      L("yoyilmada bu bir xil bo'laklar", 'в развёртке это одинаковые куски', 'in the net these are identical pieces'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Muntazam prizmaning yon sirtini yoyamiz.', 'Развернём боковую поверхность правильной призмы.', 'Let us unfold the lateral surface of a regular prism.'),
    A('move', "Yoyilmada yon yoqlar tasmaga yotdi, va barcha bo'laklar bir xil chiqdi. Sabab ta'rifning ikki shartida. Asos muntazam, demak uning barcha tomonlari teng, bu esa to'g'ri to'rtburchaklarning asoslari. Prizma to'g'ri, demak barcha to'g'ri to'rtburchaklarning balandligi bir xil va prizma balandligiga teng. Tomonlari teng to'g'ri to'rtburchaklar teng, shuning uchun yon yoqlar ham teng. Formula ham shundan qisqaradi: perimetr n karra tomon, yon sirt esa n karra tomon karra balandlik.", 'В развёртке боковые грани легли в ленту, и все куски получились одинаковыми. Причина в двух условиях определения. Основание правильное, значит все его стороны равны, а это основания прямоугольников. Призма прямая, значит высота у всех прямоугольников одна и равна высоте призмы. Прямоугольники с равными сторонами равны, поэтому и боковые грани равны. Отсюда формула становится короче: периметр это n умножить на сторону, и боковая поверхность это n умножить на сторону и на высоту.', 'In the net the lateral faces lay down in a strip and all the pieces came out identical. The reason is in the two conditions of the definition. The base is regular, so all its sides are equal, and those are the bases of the rectangles. The prism is right, so all the rectangles share one height equal to the height of the prism. Rectangles with equal sides are equal, so the lateral faces are equal too. Hence the formula gets shorter: the perimeter is n times the side, and the lateral area is n times the side times the height.'),
    A('work', "O'zingiz hisoblang. Muntazam oltiburchakli prizmaning nechta teng yon yog'i bor?", 'Посчитай сам. Сколько равных боковых граней у правильной шестиугольной призмы?', 'Work it out yourself. How many equal lateral faces does a regular hexagonal prism have?'),
  ],
  work: {
    prompt: L('Nechta teng yon yoq?', 'Сколько равных боковых граней?', 'How many equal lateral faces?'),
    ok: L('Oltita. Asos tomonlari qanchaligicha.', 'Шесть. Столько же, сколько сторон у основания.', 'Six. As many as the base has sides.'),
    hint: [
      L("Yoyilma tasmasidagi bo'laklarni sanang.", 'Посчитай куски в ленте развёртки.', 'Count the pieces in the strip of the net.'),
      L('Asosning har tomoni bitta yoq beradi.', 'Каждая сторона основания даёт одну грань.', 'Each base side gives one face.'),
      L('Oltita.', 'Шесть.', 'Six.'),
    ],
    answer: '6',
  },
  expr: 'S = n·a·h',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Muntazam piramida apofemalari teng', 'Апофемы правильной пирамиды равны', 'The apothems of a regular pyramid are equal'),
  tag: 'apofema-ne-rebro',
  show: [
    [
      L('asos muntazam', 'основание правильное', 'the base is regular'),
      L("yon yoqlar o'zaro teng", 'боковые грани равны между собой', 'the lateral faces are equal to each other'),
    ],
    [
      L("har yoqda o'z apofemasi", 'в каждой грани своя апофема', 'each face has its own apothem'),
      L('va barcha apofemalar teng', 'и все апофемы равны', 'and all the apothems are equal'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Muntazam oltiburchakli piramida. Uning yon sirtini yoyamiz.', 'Правильная шестиугольная пирамида. Развернём её боковую поверхность.', 'A regular hexagonal pyramid. Let us unfold its lateral surface.'),
    A('move', "Yon yoqlar ta'rifga ko'ra o'zaro teng, va yoyilmada bu oltita bir xil uchburchak. Har birining asosi piramida asosining tomoni, balandligi esa apofema. Uchburchaklar teng bo'lsa, apofemalar ham teng, va bu yon sirtni bitta formula bilan hisoblashga imkon beradi: perimetrning yarmi karra apofema. E'tibor bering, apofema butun piramida uchun bitta bo'lishi faqat piramida muntazam bo'lgani uchun. Ixtiyoriy piramidada bu ma'noda apofema umuman yo'q.", 'Боковые грани по определению равны между собой, и в развёртке это шесть одинаковых треугольников. У каждого основание это сторона основания пирамиды, а высота это апофема. Раз треугольники равны, то и апофемы равны, и это позволяет считать боковую поверхность одной формулой: половина периметра умножить на апофему. Обрати внимание, что апофема одна для всей пирамиды только потому, что пирамида правильная. У произвольной пирамиды апофем в этом смысле нет вовсе.', 'The lateral faces are equal to each other by definition, and in the net that is six identical triangles. For each of them the base is a side of the pyramid base and the height is the apothem. Since the triangles are equal, the apothems are equal too, and that lets us compute the lateral area with one formula: half the perimeter times the apothem. Note that there is a single apothem for the whole pyramid only because the pyramid is regular. An arbitrary pyramid has no apothem in this sense at all.'),
    A('work', "O'zingiz hisoblang. Muntazam oltiburchakli piramidaning nechta teng apofemasi bor?", 'Посчитай сам. Сколько равных апофем у правильной шестиугольной пирамиды?', 'Work it out yourself. How many equal apothems does a regular hexagonal pyramid have?'),
  ],
  work: {
    prompt: L('Nechta teng apofema?', 'Сколько равных апофем?', 'How many equal apothems?'),
    ok: L('Oltita. Har yon yoqda bittadan.', 'Шесть. По одной в каждой боковой грани.', 'Six. One in each lateral face.'),
    hint: [
      L('Yoyilmadagi uchburchaklarni sanang.', 'Посчитай треугольники в развёртке.', 'Count the triangles in the net.'),
      L("Har uchburchakda o'z balandligi.", 'В каждом треугольнике своя высота.', 'Each triangle has its own height.'),
      L('Oltita.', 'Шесть.', 'Six.'),
    ],
    answer: '6',
  },
  expr: 'S = ½·n·a·m',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Qisqa formula bilan hisoblaymiz', 'Считаем короткой формулой', 'Counting with the short formula'),
  tag: 'ploshchad-po-kartinke',
  show: [
    [
      L('asos tomoni uch', 'сторона основания три', 'the base side is three'),
      L("tomonlar olti, perimetr o'n sakkiz", 'сторон шесть, периметр восемнадцать', 'six sides, the perimeter is eighteen'),
    ],
    [
      L("balandlik o'n", 'высота десять', 'the height is ten'),
      L("tasma o'n sakkiz karra o'n", 'лента восемнадцать на десять', 'the strip is eighteen by ten'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Muntazam oltiburchakli prizma. Asos tomoni uch, balandlik o'n.", 'Правильная шестиугольная призма. Сторона основания три, высота десять.', 'A regular hexagonal prism. The base side is three, the height is ten.'),
    A('move', "Muntazam ko'pburchakning perimetri qisqa hisoblanadi: tomonlar soni karra tomon. Olti karra uch o'n sakkiz. Keyin yoyilma: balandligi o'n va uzunligi o'n sakkiz bo'lgan tasma, demak yuzasi bir yuz sakson. E'tibor bering, biz hech qayerda asos yuzasini hisoblamadik va u yon sirtga kirmaydi. To'liq sirt kerak bo'lsa, muntazam oltiburchak yuzasini alohida hisoblab, ikki marta qo'shish kerak.", 'Периметр правильного многоугольника считается коротко: число сторон умножить на сторону. Шесть на три это восемнадцать. Дальше развёртка: лента высотой десять и длиной восемнадцать, значит её площадь сто восемьдесят. Заметь, что мы нигде не считали площадь основания и она в боковую поверхность не входит. Если понадобится полная поверхность, придётся отдельно посчитать площадь правильного шестиугольника и прибавить её дважды.', 'The perimeter of a regular polygon is computed briefly: the number of sides times the side. Six times three is eighteen. Then the net: a strip ten high and eighteen long, so its area is one hundred eighty. Note that we never computed the base area and it does not enter the lateral surface. If the full surface is needed, the area of the regular hexagon has to be computed separately and added twice.'),
    A('work', "O'zingiz hisoblang. Yon sirt qancha?", 'Посчитай сам. Какова боковая поверхность?', 'Work it out yourself. What is the lateral area?'),
  ],
  work: {
    prompt: L('Yon sirtni toping', 'Найди боковую поверхность', 'Find the lateral area'),
    ok: L("Bir yuz sakson. O'n sakkiz karra o'n.", 'Сто восемьдесят. Восемнадцать умножить на десять.', 'One hundred eighty. Eighteen times ten.'),
    hint: [
      L('Avval asos perimetri.', 'Сначала периметр основания.', 'First the base perimeter.'),
      L('Olti tomon uchtadan.', 'Шесть сторон по три.', 'Six sides of three.'),
      L("O'n sakkiz karra o'n.", 'Восемнадцать умножить на десять.', 'Eighteen times ten.'),
    ],
    answer: '180',
  },
  expr: 'n = 6,   a = 3,   h = 10',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L('Muntazam va kub boshqa-boshqa', 'Правильная и куб это разное', 'Regular and a cube are different'),
  tag: 'svoystvo-vmesto-priznaka',
  show: [
    [
      L("asos tomoni to'rt", 'сторона основания четыре', 'the base side is four'),
      L('yon qirra yetti', 'боковое ребро семь', 'the lateral edge is seven'),
    ],
    [
      L('prizma muntazam', 'призма правильная', 'the prism is regular'),
      L('lekin qirralar hammasi teng emas', 'но рёбра не все равны', 'but not all edges are equal'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Muntazam to'rtburchakli prizma. Asos tomoni to'rt, yon qirra yetti.", 'Правильная четырёхугольная призма. Сторона основания четыре, боковое ребро семь.', 'A regular quadrilateral prism. The base side is four, the lateral edge is seven.'),
    A('move', "Asos kvadrat, qirra asosga perpendikulyar, demak muntazam prizmaning barcha shartlari bajarilgan. Shu bilan birga asos qirralari to'rttadan, yon qirralar yettitadan, va xil uzunliklar ikkita. Muntazam so'zi asosning shakli va qirraning og'ishi haqida gapiradi, barcha qirralarning tengligi haqida emas. Barcha qirralar faqat yon qirra asos tomoni bilan ustma-ust tushganda teng bo'ladi, va bunday jism kub deb ataladi. Kub muntazam prizmaning xususiy holi, uning ta'rifi emas.", 'Основание квадрат, ребро перпендикулярно основанию, значит все условия правильной призмы выполнены. При этом рёбра основания по четыре, а боковые по семь, и разных длин две. Слово правильная говорит про форму основания и про наклон ребра, но не про равенство всех рёбер. Все рёбра равны только тогда, когда боковое ребро совпало со стороной основания, и такое тело называется кубом. Куб это частный случай правильной призмы, а не её определение.', 'The base is a square, the edge is perpendicular to the base, so all the conditions of a regular prism hold. At the same time the base edges are four each and the lateral ones seven each, and there are two different lengths. The word regular speaks about the shape of the base and the slant of the edge, not about all the edges being equal. All the edges are equal only when the lateral edge coincides with the base side, and such a body is called a cube. A cube is a special case of a regular prism, not its definition.'),
    A('work', "O'zingiz hisoblang. Bu prizma qirralari orasida nechta xil uzunlik bor?", 'Посчитай сам. Сколько разных длин среди рёбер этой призмы?', 'Work it out yourself. How many different lengths are among the edges of this prism?'),
  ],
  work: {
    prompt: L('Nechta xil uzunlik?', 'Сколько разных длин?', 'How many different lengths?'),
    ok: L('Ikkita. Asos tomoni va yon qirra mustaqil beriladi.', 'Две. Сторона основания и боковое ребро задаются независимо.', 'Two. The base side and the lateral edge are given independently.'),
    hint: [
      L('Asos qirralarini va yon qirralarni solishtiring.', 'Сравни рёбра основания и боковые.', 'Compare the base edges with the lateral ones.'),
      L("To'rt va yetti boshqa sonlar.", 'Четыре и семь это разные числа.', 'Four and seven are different numbers.'),
      L('Ikkita.', 'Две.', 'Two.'),
    ],
    answer: '2',
  },
  expr: 'a = 4,   h = 7',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Muntazam nimani bildiradi', 'Что значит правильная', 'What regular means'),
  tag: 'svoystvo-vmesto-priznaka',
  motion: ['rule'],
  audio: [
    A('mount', 'Farqlashga bitta savol, keyin kartochka.', 'Один вопрос на различение, потом карточка.', 'One question to tell them apart, then the card.'),
    A('rule', "Ikkala ta'rifda ham ikki shart, va ikkalasida biri asos haqida, ikkinchisi yon qism haqida. Prizmada bu qirraning perpendikulyarligi, piramidada yon yoqlarning tengligi. Muntazamlik qisqa formulalar beradi, chunki asosning barcha tomonlari teng va perimetr ko'paytirish bilan hisoblanadi. Lekin u jismni kub qilmaydi: asos tomoni va balandlik mustaqil qoladi.", 'В обоих определениях по два условия, и в обоих одно про основание, другое про боковую часть. У призмы это перпендикулярность ребра, у пирамиды равенство боковых граней. Правильность даёт короткие формулы, потому что все стороны основания равны и периметр считается умножением. Но она не делает тело кубом: сторона основания и высота остаются независимыми.', 'Both definitions have two conditions, and in both one is about the base and the other about the lateral part. For a prism it is the perpendicularity of the edge, for a pyramid the equality of the lateral faces. Being regular gives short formulas, because all the base sides are equal and the perimeter is computed by multiplication. But it does not make the body a cube: the base side and the height stay independent.'),
  ],
  probe: {
    question: L('Muntazam prizma nimani talab qiladi?', 'Что требует правильная призма?', 'What does a regular prism require?'),
    items: [
      { id: 'a', label: L("to'g'ri va muntazam asos", 'прямая и правильное основание', 'right, and a regular base'), correct: true },
      { id: 'b', label: L('barcha qirralar teng', 'все рёбра равны', 'all edges are equal'), hint: L('Bu kubning sharti, muntazam prizmaning emas.', 'Это условие куба, а не правильной призмы.', 'That is the condition of a cube, not of a regular prism.') },
    ],
  },
  rule: {
    lawLabel: L('Muntazam jismlar', 'Правильные тела', 'Regular bodies'),
    lines: [
      L("muntazam prizma muntazam asosli to'g'ri prizma", 'правильная призма это прямая призма с правильным основанием', 'a regular prism is a right prism with a regular base'),
      L('muntazam piramida muntazam asos va teng yon yoqlar', 'правильная пирамида это правильное основание и равные боковые грани', 'a regular pyramid means a regular base and equal lateral faces'),
      L('muntazam prizmada xil qirra uzunligi ikkita, kubda bitta', 'у правильной призмы разных длин рёбер две, у куба одна', 'a regular prism has two different edge lengths, a cube has one'),
    ],
    law: 'P = n·a',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Teng yon yoqlar soni', 'Число равных боковых граней', 'The number of equal lateral faces'),
  tag: 'svoystvo-vmesto-priznaka',
  audio: [
    A('mount', "To'rt son va to'rt muntazam jism. Ularni birlashtiring.", 'Четыре числа и четыре правильных тела. Соедини их.', 'Four numbers and four regular bodies. Match them.'),
  ],
  match: {
    prompt: L('Sonni muntazam jism bilan birlashtiring', 'Соедини число с правильным телом', 'Match the number with the regular body'),
    ok: L("To'rttasi ham joyida. Yoqlar soni asos tomonlari soni.", 'Все четыре на месте. Число граней это число сторон основания.', 'All four in place. The number of faces is the number of base sides.'),
    a: L('uchburchakli prizma', 'треугольная призма', 'triangular prism'),
    b: L("to'rtburchakli piramida", 'четырёхугольная пирамида', 'quadrilateral pyramid'),
    c: L('oltiburchakli prizma', 'шестиугольная призма', 'hexagonal prism'),
    d: L("o'n ikki burchakli piramida", 'двенадцатиугольная пирамида', 'twelve-sided pyramid'),
    left: ['3', '4', '6', '12'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Yon yoqlar tengligini isbotlang', 'Докажи равенство боковых граней', 'Prove the lateral faces are equal'),
  tag: 'svoystvo-vmesto-priznaka',
  audio: [
    A('mount', "Uch qator, va har birining ro'yxatdan o'z asoslashi bor.", 'Три строки, и у каждой своё обоснование из списка.', 'Three lines, each with its own justification from the list.'),
  ],
  proof: {
    given: L('muntazam prizma', 'правильная призма', 'a regular prism'),
    goal: L('uning yon yoqlari teng', 'её боковые грани равны', 'its lateral faces are equal'),
    r1: L('asosning barcha tomonlari teng', 'все стороны основания равны', 'all the base sides are equal'),
    r2: L("yon yoqlar bir balandlikdagi to'g'ri to'rtburchaklar", 'боковые грани прямоугольники одной высоты', 'the lateral faces are rectangles of one height'),
    r3: L("tomonlari teng to'g'ri to'rtburchaklar teng", 'прямоугольники с равными сторонами равны', 'rectangles with equal sides are equal'),
    ok: L("Isbotlandi. Ta'rifning ikkala sharti ham bir marta kerak bo'ldi.", 'Доказано. Оба условия определения понадобились по разу.', 'Proved. Each of the two conditions of the definition was used once.'),
    e1: L("To'g'ri prizma haqida keyin. Avval asos haqida.", 'Про прямую призму дальше. Сначала про основание.', 'The right prism comes later. First about the base.'),
    e2: L("Asos ko'rildi. To'g'ri to'rtburchaklar qayerdan.", 'Основание разобрано. Откуда прямоугольники.', 'The base is done. Where do the rectangles come from.'),
    e3: L("Shakllar ma'lum. Endi tenglik haqida xulosa.", 'Фигуры известны. Теперь вывод про равенство.', 'The figures are known. Now the conclusion about equality.'),
  },
  reason: {
    s1: L("asosda muntazam ko'pburchak", 'правильный многоугольник в основании', 'a regular polygon in the base'),
    s2: L("prizma to'g'ri", 'призма прямая', 'the prism is right'),
    s3: L("to'g'ri to'rtburchaklar tengligi alomati", 'признак равенства прямоугольников', 'the criterion of equality of rectangles'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: 'ABB₁A₁ = BCC₁B₁',
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
    ok: L("To'qson olti. O'ttiz olti asos va oltmish yon.", 'Девяносто шесть. Тридцать шесть основание и шестьдесят боковая.', 'Ninety six. Thirty six for the base and sixty for the lateral part.'),
    hint: [
      L("Asos tomoni olti bo'lgan kvadrat.", 'Основание квадрат со стороной шесть.', 'The base is a square with side six.'),
      L('Yon sirt perimetrning yarmi karra apofema.', 'Боковая это половина периметра на апофему.', 'The lateral part is half the perimeter times the apothem.'),
      L("O'ttiz olti qo'shuv oltmish.", 'Тридцать шесть плюс шестьдесят.', 'Thirty six plus sixty.'),
    ],
    prompt: 'a = 6,   m = 5,   S = ?',
    answer: '96',
  },
  order: {
    prompt: L('Yozuvlarni hisoblash tartibida joylashtiring', 'Расставь записи в том порядке, в каком считают', 'Arrange the readings in the order they are computed'),
    title: L('Hisob tartibi', 'Порядок счёта', 'The order of computing'),
    ok: L("Tartib to'g'ri. Avval asos va perimetr, keyin yon va to'liq.", 'Порядок верный. Сначала основание и периметр, потом боковая и полная.', 'The order is right. First the base and the perimeter, then the lateral and the full area.'),
    bad: L('Bu tartibda emas. Avval nima kerak.', 'Не в этом порядке. Что нужно раньше.', 'Not in this order. What is needed first.'),
    items: ['S', 'S₀', 'P', 'S₁'],
    answer: 'S₀  P  S₁  S',
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
    A('mount', "To'rt qator, va ulardan biri jismni almashtiradi.", 'Четыре строки, и одна из них подменяет тело.', 'Four lines, and one of them substitutes the body.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("Berilganlar to'g'ri yozilgan.", 'Данные выписаны верно.', 'The data are written correctly.'),
    r2: L("Asos tomonlari teng, bu to'g'ri.", 'Стороны основания равны, это верно.', 'The base sides are equal, that is right.'),
    r4: L('Javob yuqoridagi xato qatordan olingan.', 'Ответ получен из неверной строки выше.', 'The answer comes from the wrong line above.'),
  },
  proof: L("Prizmani buring: yon qirra yetti, asos tomoni esa to'rt.", 'Поверни призму: боковое ребро семь, а сторона основания четыре.', 'Rotate the prism: the lateral edge is seven while the base side is four.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L('Uchinchi. Muntazam prizma kub deb aytilgan.', 'Третья. Правильную призму назвали кубом.', 'The third. A regular prism was called a cube.'),
    hint: [
      L("Barcha qirralar tengligi qayerda paydo bo'lganini tekshiring.", 'Проверь, где появилось равенство всех рёбер.', 'Check where the equality of all edges appeared.'),
      L("Muntazam prizma kub bo'lishi shart emas.", 'Правильная призма кубом быть не обязана.', 'A regular prism does not have to be a cube.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'a = 4,   h = 7',
    r2: 'AB = BC = CD = DA',
    r3: 'a = h',
    r4: 'S = 6·16',
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
    A('mount', "Qoidani o'ngdan chapga o'qiymiz. Jism bo'yicha formulani aytamiz.", 'Прочитаем правило справа налево. По телу назовём формулу.', 'Let us read the rule from right to left. From the body we name the formula.'),
    A('work', "Muntazam prizma uchun to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны для правильной призмы. Их больше одной.', 'Mark all the readings that are true for a regular prism. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Muntazam prizma uchun nima to'g'ri", 'Что верно для правильной призмы', 'What is true for a regular prism'),
    ok: L('Beshtadan uch yozuv. Qolgan ikkitasi muntazam prizmani boshqa jismlar bilan aralashtiradi.', 'Три записи из пяти. Две оставшиеся путают правильную призму с другими телами.', 'Three readings out of five. The other two confuse a regular prism with other bodies.'),
    items: [
      { id: 'd', label: 'a = h', hint: L("Bu faqat kubda to'g'ri.", 'Это верно только у куба.', 'That is true only for a cube.') },
      { id: 'e', label: 'S₁ = ½·n·a·h', hint: L("Yarim piramidada paydo bo'ladi, prizmada emas.", 'Половина появляется у пирамиды, не у призмы.', 'The half appears for a pyramid, not for a prism.') },
      { id: 'a', label: 'P = n·a', ok: true },
      { id: 'b', label: 'S₁ = n·a·h', ok: true },
      { id: 'c', label: 'AA₁ ⊥ ABCD', ok: true },
    ],
  },
  place: {
    prompt: L("Muntazam to'rtburchakli prizma, tomoni to'rt, balandligi besh. To'liq sirt qancha?", 'Правильная четырёхугольная призма, сторона четыре, высота пять. Какова полная поверхность?', 'A regular quadrilateral prism, side four, height five. What is the full surface?'),
    ok: L("Bir yuz o'n ikki. O'ttiz ikki asoslar va sakson yon.", 'Сто двенадцать. Тридцать два основания и восемьдесят боковая.', 'One hundred twelve. Thirty two for the bases and eighty for the lateral part.'),
    wrong: L('Asoslar ikkita, va ikkalasi kvadrat.', 'Основания два, и оба квадраты.', 'There are two bases and both are squares.'),
    target: '112',
    step: '2·16 + 16·5',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'svoystvo-vmesto-priznaka',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Muntazam prizma nimani talab qiladi?', 'Что требует правильная призма?', 'What does a regular prism require?'),
      done: 'AA₁ ⊥ ABCD',
      items: [
        { id: 'a', label: L("to'g'ri va muntazam asos", 'прямая и правильное основание', 'right, and a regular base'), correct: true },
        { id: 'b', label: L('faqat muntazam asos', 'только правильное основание', 'only a regular base'), hint: L("Qirra og'ma bo'lsa, prizma muntazam bo'lmaydi.", 'При наклонном ребре призма правильной не будет.', 'With a slanted edge the prism will not be regular.') },
        { id: 'c', label: L('faqat perpendikulyar qirra', 'только перпендикулярное ребро', 'only a perpendicular edge'), hint: L("Bu to'g'ri prizmaning sharti.", 'Это условие прямой призмы.', 'That is the condition of a right prism.') },
        { id: 'd', label: L('teng qirralar', 'равные рёбра', 'equal edges'), hint: L('Teng qirralar bu kub.', 'Равные рёбра это куб.', 'Equal edges mean a cube.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Muntazam n burchakning perimetri?', 'Периметр правильного n-угольника?', 'The perimeter of a regular n-gon?'),
      done: 'P = n·a',
      items: [
        { id: 'a', label: L('tomonlar soni karra tomon', 'число сторон на сторону', 'the number of sides times the side'), correct: true },
        { id: 'b', label: L('tomonning kvadrati', 'сторона в квадрате', 'the side squared'), hint: L('Tomon kvadrati yuza, perimetr emas.', 'Квадрат стороны это площадь, а не периметр.', 'The side squared is an area, not a perimeter.') },
        { id: 'c', label: L("ikki tomon yig'indisi", 'сумма двух сторон', 'the sum of two sides'), hint: L('Perimetr barcha tomonlar, ikkitasi emas.', 'Периметр это все стороны, а не две.', 'A perimeter is all the sides, not two.') },
        { id: 'd', label: L('tomon karra balandlik', 'сторона на высоту', 'the side times the height'), hint: L('Bu bitta yon yoqning yuzasi.', 'Это площадь одной боковой грани.', 'That is the area of one lateral face.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Muntazam beshburchakli piramidaning nechta teng yon yog'i bor?", 'Сколько равных боковых граней у правильной пятиугольной пирамиды?', 'How many equal lateral faces does a regular pentagonal pyramid have?'),
      done: '5',
      items: [
        { id: 'a', label: L('beshta', 'пять', 'five'), correct: true },
        { id: 'b', label: L('oltita', 'шесть', 'six'), hint: L("Olti asos bilan birga bo'lardi.", 'Шесть было бы вместе с основанием.', 'Six would be together with the base.') },
        { id: 'c', label: L("o'nta", 'десять', 'ten'), hint: L("O'n qirralar soni.", 'Десять это число рёбер.', 'Ten is the number of edges.') },
        { id: 'd', label: L('bitta', 'одна', 'one'), hint: L('Yoqlar teng, lekin ular baribir beshta.', 'Грани равны, но их всё равно пять.', 'The faces are equal, but there are still five of them.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Qirralari teng muntazam prizma bu?', 'Правильная призма с равными рёбрами это?', 'A regular prism with equal edges is?'),
      done: 'a = h',
      items: [
        { id: 'a', label: L('kub', 'куб', 'a cube'), correct: true },
        { id: 'b', label: L('parallelepiped', 'параллелепипед', 'a parallelepiped'), hint: L("Parallelepiped qirralari boshqa bo'lgan holda ham bo'ladi.", 'Параллелепипед бывает и с разными рёбрами.', 'A parallelepiped can have different edges too.') },
        { id: 'c', label: L('piramida', 'пирамида', 'a pyramid'), hint: L("Piramidada ikkinchi asos yo'q.", 'У пирамиды нет второго основания.', 'A pyramid has no second base.') },
        { id: 'd', label: L('muntazam piramida', 'правильная пирамида', 'a regular pyramid'), hint: L('Gap prizma haqida, piramida haqida emas.', 'Речь о призме, а не о пирамиде.', 'This is about a prism, not a pyramid.') },
      ],
    },
  ],
  angles: ['3', '4', '6', '12'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Endi nimani bilasiz', 'Что теперь умеешь', 'What you can do now'),
  audio: [
    A('mount', 'Dars muntazam prizmaning qirralari haqidagi savol bilan boshlandi.', 'Урок начался с вопроса про рёбра правильной призмы.', 'The lesson began with a question about the edges of a regular prism.'),
    A('next', "Xil uzunliklar ikkita, bitta emas, va muntazam so'zining bunga aloqasi yo'q. U faqat asos muntazam ko'pburchak, yon qirra esa asosga perpendikulyar ekanini aytadi. Barcha qirralar faqat kubda teng, va u xususiy hol. Muntazamlik esa qisqa formulalar beradi: perimetr tomonlar soni karra tomon. Keyin tekislik jismni kesa boshlaydi, va kesimda ko'pburchak chiqadi.", 'Разных длин две, а не одна, и слово правильная тут ни при чём. Оно говорит только о том, что основание правильный многоугольник, а боковое ребро перпендикулярно основанию. Все рёбра равны лишь у куба, и он частный случай. Зато правильность даёт короткие формулы: периметр это число сторон на сторону. Дальше плоскость начнёт резать тело, и в сечении будет получаться многоугольник.', 'There are two different lengths, not one, and the word regular has nothing to do with it. It only says that the base is a regular polygon and the lateral edge is perpendicular to the base. All the edges are equal only in a cube, and that is a special case. What being regular does give is short formulas: the perimeter is the number of sides times the side. Next a plane will start cutting the body, and a polygon will appear in the section.'),
  ],
  can: [
    L('Muntazam prizmada ikki shartni tekshiraman', 'Проверяю у правильной призмы два условия', 'I check two conditions for a regular prism'),
    L('Muntazam barcha qirralar teng degani emasligini bilaman', 'Знаю, что правильная не значит все рёбра равны', 'I know regular does not mean all edges are equal'),
    L("Muntazam asos perimetrini ko'paytirish bilan hisoblayman", 'Считаю периметр правильного основания умножением', 'I compute the perimeter of a regular base by multiplication'),
    L('Sirtning qisqa formulalaridan foydalanaman', 'Пользуюсь короткими формулами поверхности', 'I use the short surface formulas'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L("Bundan keyin kesimlar, tekislik jismni kesadi va kesimda ko'pburchak chiqadi", 'Дальше сечения — плоскость режет тело, и в сечении получается многоугольник', 'Next come sections, where a plane cuts the body and a polygon appears in the section'),
  lifehack: L("Muntazam so'zini ko'rinishi bo'yicha emas, ikki shart bo'yicha tekshiring", 'Слово правильная проверяй по двум условиям, а не по виду', 'Check the word regular against two conditions, not against the look'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L('Geometriya, qirq beshinchi bet', 'Геометрия, страница сорок пять', 'Geometry, page forty five'),
  hook: {
    a: '1',
    b: '2',
  },
  proved: 'a ≠ h',
  law: 'P = n·a',
  sheet: [
    'AA₁ ⊥ ABCD',
    'AB = BC = … = FA',
    'P = n·a',
    'S₁ = n·a·h',
    'S₁ = ½·n·a·m',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/\u2212/g, '-'))

// PRIBOR 6B. Muntazam jismlar: asos AYLANA bo'yicha yasaladi (`n`), ya'ni
// muntazam ko'pburchak chiqadi. `skew` og'ma prizmani beradi -- 3-ekranning
// birinchi kadri aynan shu.
const HEX = { kind: 'prism', n: 6, h: 1.0, r: 0.55 }
const HEX_OFF = { kind: 'prism', n: 6, h: 1.0, r: 0.55, skew: [0.3, 0.18] }
const HEX_PYR = { kind: 'pyramid', n: 6, h: 1.15, r: 0.55 }
const SQ = { kind: 'prism', n: 4, h: 1.15, r: 0.5, turn: 0.785 }
const CUBE = { kind: 'prism', n: 4, h: 0.71, r: 0.5, turn: 0.785 }

const FACE2 = '#6b8fa3'
const BASE6 = [{ by: ['A', 'B', 'C', 'D', 'E', 'F'] }]
const BASE6_SIDE = [{ by: ['A', 'B', 'C', 'D', 'E', 'F'] }, { by: ['A', 'B', 'B1', 'A1'], tone: FACE2 }]
const BASE4 = [{ by: ['A', 'B', 'C', 'D'] }]
const BASE4_SIDE = [{ by: ['A', 'B', 'C', 'D'] }, { by: ['A', 'B', 'B1', 'A1'], tone: FACE2 }]
const PYR6_SIDE = [{ by: ['A', 'B', 'C', 'D', 'E', 'F'] }, { by: ['A', 'B', 'S'], tone: FACE2 }]

// Jism va yoyilma yonma-yon: `size` ni O'TKAZISH shart.
const Both = ({ size = 268, step = 2, lit = null, body, faces, kind = 'prism', n = 6 }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
    <Space size={size * 0.46} step={1} yaw={0.42} poly={body} faces={faces} />
    <Net size={size * 0.46} step={step} kind={kind} n={n} lit={lit} />
  </div>
)

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
            fig={<Space step={1} yaw={0.4} poly={HEX} faces={BASE6} hi={['AB', 'AA1']} />}
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
            fig={<Space step={1} yaw={0.4} poly={HEX} faces={BASE6} />}
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
            step={1} yaw={0.4} poly={phase === 0 ? HEX_OFF : HEX}
            faces={BASE6_SIDE} hi={['AA1']}
          />
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={HEX} faces={BASE6_SIDE} hi={['AA1']} />}
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
          <Both
            body={HEX} faces={BASE6_SIDE} kind="prism" n={6} step={2}
            lit={phase === 0 ? 'lat0' : 'lat3'}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={HEX} faces={BASE6_SIDE} />}
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
          <Both
            body={HEX_PYR} faces={PYR6_SIDE} kind="pyramid" n={6} step={2}
            lit={phase === 0 ? 'lat0' : 'lat2'}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} poly={HEX_PYR} faces={PYR6_SIDE} />}
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
          <Both
            body={HEX} faces={BASE6} kind="prism" n={6}
            step={1 + phase} lit={phase === 0 ? null : 'lat0'}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} poly={HEX} faces={BASE6} />}
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
            step={1} yaw={0.4} poly={phase === 0 ? SQ : CUBE}
            faces={BASE4_SIDE} hi={['AB', 'AA1']}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={SQ} faces={BASE4_SIDE} hi={['AB', 'AA1']} />}
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
              <Both
                body={HEX} faces={BASE6_SIDE} kind="prism" n={6}
                step={solved ? 2 : 1} lit={solved ? 'lat0' : null}
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
                poly={round === 1 ? HEX_PYR : HEX}
                faces={round === 1 ? PYR6_SIDE : BASE6_SIDE}
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
