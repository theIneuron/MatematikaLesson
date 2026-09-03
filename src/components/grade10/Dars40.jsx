// ============================================================================
// 10-sinf, Dars 40. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS40_KONTENT.md
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

import { Net, Space } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 40
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Sirt yuzasi`,
  `Урок ${LESSON_NO}. Площадь поверхности`,
  `Lesson ${LESSON_NO}. The surface area`,
)

const BLOCK = { label: 'B7', from: 37, to: 42, current: 40 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('SIRT', 'ПОВЕРХНОСТЬ', 'THE SURFACE'),
  title: L('Uch yoq yoki olti', 'Три грани или шесть', 'Three faces or six'),
  audio: [
    A('mount', "To'g'ri burchakli parallelepiped. Uning sirt yuzasini topish kerak, ya'ni yoqlar yuzalarini qo'shish kerak.", 'Прямоугольный параллелепипед. Нужно найти площадь его поверхности, то есть сложить площади граней.', 'A rectangular box. We need the area of its surface, that is the sum of the areas of its faces.'),
    A('r1', "Birinchi yozuv uch yoqni qo'shishni taklif qiladi. Chizmada aynan shuncha ko'rinadi.", 'Первая запись предлагает сложить три грани. Ровно столько видно на чертеже.', 'The first reading offers to add three faces. That is exactly how many show on the drawing.'),
    A('r2', 'Ikkinchisi oltini taklif qiladi.', 'Вторая предлагает шесть.', 'The second offers six.'),
    A('ask', "Sizningcha qaysi yozuv to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая запись верная? Пока просто предположи.', 'Which reading do you think is right? Just guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi jismni yoyamiz.', 'Твой ответ записан. Сейчас развернём тело.', 'Your answer is recorded. Now we unfold the body.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('uch', 'три', 'three'),
      value: 'S = ab + bc + ac',
    },
    b: {
      name: L('olti', 'шесть', 'six'),
      value: 'S = 2(ab+bc+ac)',
    },
  },
  expr: 'S = ?',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Blokdan uch savol', 'Три вопроса из блока', 'Three questions from the block'),
  tag: 'support',
  audio: [
    A('mount', "Uchta savol. Jism yoyilganda uchalasi ham kerak bo'ladi.", 'Три вопроса. Все три понадобятся, когда тело развернётся.', 'Three questions. All three will be needed when the body unfolds.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Parallelepipedning nechta yog'i bor?", 'Сколько граней у параллелепипеда?', 'How many faces does a parallelepiped have?'),
      done: '4 + 2 = 6',
      items: [
        { id: 'a', label: L('oltita', 'шесть', 'six'), correct: true },
        { id: 'b', label: L("to'rtta", 'четыре', 'four'), hint: L("To'rtta faqat yonlari.", 'Четыре это только боковые.', 'Four are only the lateral ones.') },
        { id: 'c', label: L('uchta', 'три', 'three'), hint: L("Uchta bir qarashda nechta ko'rinishi.", 'Три это сколько видно с одного взгляда.', 'Three is how many you see at a glance.') },
        { id: 'd', label: L('sakkizta', 'восемь', 'eight'), hint: L('Sakkiz uchlar soni.', 'Восемь это число вершин.', 'Eight is the number of vertices.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Apofema nima?', 'Что такое апофема?', 'What is the apothem?'),
      done: 'SM ⊥ AB',
      items: [
        { id: 'a', label: L('uchdan yon yoqning balandligi', 'высота боковой грани из вершины', 'the height of a lateral face from the apex'), correct: true },
        { id: 'b', label: L('yon qirra', 'боковое ребро', 'the lateral edge'), hint: L("Qirra asos uchiga keladi, apofema tomon o'rtasiga.", 'Ребро приходит в вершину основания, апофема в середину стороны.', 'The edge arrives at a base vertex, the apothem at the middle of a side.') },
        { id: 'c', label: L('piramida balandligi', 'высота пирамиды', 'the height of the pyramid'), hint: L('Balandlik asos markaziga boradi.', 'Высота идёт в центр основания.', 'The height goes to the centre of the base.') },
        { id: 'd', label: L('asos tomoni', 'сторона основания', 'a base side'), hint: L('Tomon asosda yotadi, apofema esa yon yoqda.', 'Сторона лежит в основании, а апофема в боковой грани.', 'The side lies in the base, the apothem in a lateral face.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Bitta qirrada nechta yoq tutashadi?', 'Сколько граней сходится в одном ребре?', 'How many faces meet at one edge?'),
      done: '2',
      items: [
        { id: 'a', label: L('ikkita', 'две', 'two'), correct: true },
        { id: 'b', label: L('bitta', 'одна', 'one'), hint: L('Bitta yoq shunchaki tomon berardi.', 'Одна грань дала бы просто сторону.', 'One face would give just a side.') },
        { id: 'c', label: L('uchta', 'три', 'three'), hint: L('Uchtasi uchda tutashadi.', 'Три сходятся в вершине.', 'Three meet at a vertex.') },
        { id: 'd', label: L("jismga bog'liq", 'зависит от тела', 'it depends on the body'), hint: L("Bu har qanday ko'pyoqda to'g'ri.", 'Это верно у любого многогранника.', 'This is true for any polyhedron.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Jism qog'ozga yoyiladi", 'Тело разворачивается на бумагу', 'The body unfolds onto paper'),
  tag: 'ploshchad-po-kartinke',
  show: [
    [
      L('avval asoslar yotdi', 'сначала легли основания', 'first the bases lay down'),
      L("bu ikki tanish ko'pburchak", 'это два знакомых многоугольника', 'these are two familiar polygons'),
    ],
    [
      L('keyin yon sirt yotdi', 'потом легла боковая поверхность', 'then the lateral surface lay down'),
      L("butun sirt qog'ozda", 'вся поверхность на бумаге', 'the whole surface is on paper'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Prizmani olamiz va uning sirtini qirralar bo'ylab kesib, keyin qog'ozda yozamiz.", 'Возьмём призму и разрежем её поверхность по рёбрам, а потом разложим на бумаге.', 'Take a prism, cut its surface along the edges and lay it out on paper.'),
    A('move', "Yassi shakl chiqdi, va u yoyilma deb ataladi. Ellik to'qqizinchi betda shunday. Nima o'zgarganiga qarang. Jismda sirt yuzasi tushunarsiz kattalik edi, yoyilmada esa u shunchaki yassi bo'laklar yuzalarining yig'indisi, va har bir bo'lakni biz yettinchi sinfdan hisoblay olamiz. Yoyilishda birorta yoq yo'qolmadi va paydo bo'lmadi, shuning uchun yuzalar teng. Aynan shuning uchun yoyilma chiroylik uchun rasm emas, hisoblash usuli.", 'Получилась плоская фигура, и она называется развёрткой. Так на странице пятьдесят девять. Смотри, что изменилось. У тела площадь поверхности была непонятной величиной, а у развёртки это просто сумма площадей плоских кусков, и каждый кусок мы умеем считать с седьмого класса. Ни одна грань при развёртке не потерялась и не появилась, поэтому площади равны. Именно поэтому развёртка это не картинка для красоты, а способ считать.', 'We got a flat figure, and it is called a net. So it is on page fifty nine. See what changed. For the body the surface area was an unclear quantity, while for the net it is simply the sum of the areas of flat pieces, and each piece we can compute since grade seven. No face is lost or added in the unfolding, so the areas are equal. That is exactly why a net is not a decorative picture but a way to count.'),
    A('work', "O'zingiz hisoblang. To'rtburchakli prizma yoyilmasida nechta yassi bo'lak bor?", 'Посчитай сам. Сколько плоских кусков в развёртке четырёхугольной призмы?', 'Work it out yourself. How many flat pieces are in the net of a quadrilateral prism?'),
  ],
  work: {
    prompt: L("Yoyilmada nechta bo'lak?", 'Сколько кусков в развёртке?', 'How many pieces are in the net?'),
    ok: L("Oltita. To'rt yon va ikki asos, yoqlar qanchaligicha.", 'Шесть. Четыре боковых и два основания, столько же, сколько граней.', 'Six. Four lateral and two bases, as many as there are faces.'),
    hint: [
      L("Jismdagi yoqlarni emas, qog'ozdagi bo'laklarni sanang.", 'Посчитай куски на бумаге, а не грани на теле.', 'Count the pieces on the paper, not the faces on the body.'),
      L("Har yoq roppa-rosa bitta bo'lak beradi.", 'Каждая грань даёт ровно один кусок.', 'Each face gives exactly one piece.'),
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
  title: L("Uch ko'rinadi, oltini qo'shish kerak", 'Видно три, а сложить надо шесть', 'Three show, six must be added'),
  tag: 'ploshchad-po-kartinke',
  show: [
    [
      L("chizmada uch yoq ko'rinadi", 'на чертеже видно три грани', 'three faces show on the drawing'),
      L('qolgan uchtasi boshqa tomonda', 'остальные три с другой стороны', 'the other three are on the far side'),
    ],
    [
      L('yoyilmada oltitasi birdan', 'в развёртке все шесть сразу', 'in the net all six at once'),
      L('va ular juft-juft teng', 'и они попарно равны', 'and they are equal in pairs'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "O'lchamlar ikki, uch va to'rt. Sirt yuzasini hisoblaymiz.", 'Измерения два, три и четыре. Посчитаем площадь поверхности.', 'The dimensions are two, three and four. Let us find the surface area.'),
    A('move', "Chizmada uch yoq ko'rinadi, va aynan ularni qo'shgi keladi. Lekin parallelepipedning yoqlari juft-juft teng, va har bir ko'rinadigan yoqning o'sha yuzali ko'rinmas egizagi bor. Yoyilmada bu darhol ko'rinadi. Demak uch xil ko'paytmaning yig'indisi ikkiga ko'paytiriladi. Ikki karra uch olti, uch karra to'rt o'n ikki, ikki karra to'rt sakkiz. Olti qo'shuv o'n ikki qo'shuv sakkiz bu yigirma olti, butun sirt esa ellik ikki. E'tibor bering, ko'rinadigan yoqlar soni rakursga bog'liq, sirt yuzasi esa yo'q.", 'На чертеже видно три грани, и складывать хочется именно их. Но грани у параллелепипеда попарно равны, и каждая видимая грань имеет невидимого близнеца с той же площадью. В развёртке это сразу видно. Значит сумма трёх разных произведений умножается на два. Два умножить на три это шесть, три на четыре двенадцать, два на четыре восемь. Шесть плюс двенадцать плюс восемь это двадцать шесть, а вся поверхность пятьдесят два. Обрати внимание, что число видимых граней зависит от ракурса, а площадь поверхности нет.', 'Three faces show on the drawing and those are the ones you want to add. But the faces of a box are equal in pairs, and every visible face has an invisible twin of the same area. In the net that is immediately visible. So the sum of the three different products is multiplied by two. Two times three is six, three times four is twelve, two times four is eight. Six plus twelve plus eight is twenty six, and the whole surface is fifty two. Note that the number of visible faces depends on the view while the surface area does not.'),
    A('work', "O'zingiz hisoblang. O'lchamlar ikki, uch va to'rt. Sirt yuzasi qancha?", 'Посчитай сам. Измерения два, три и четыре. Какова площадь поверхности?', 'Work it out yourself. The dimensions are two, three and four. What is the surface area?'),
  ],
  work: {
    prompt: L('Sirt yuzasini toping', 'Найди площадь поверхности', 'Find the surface area'),
    ok: L('Ellik ikki. Yigirma olti karra ikki.', 'Пятьдесят два. Двадцать шесть умножить на два.', 'Fifty two. Twenty six times two.'),
    hint: [
      L("O'lchamlarning uch xil ko'paytmasini qo'shing.", 'Сложи три разных произведения измерений.', 'Add the three different products of the dimensions.'),
      L("Olti qo'shuv o'n ikki qo'shuv sakkiz.", 'Шесть плюс двенадцать плюс восемь.', 'Six plus twelve plus eight.'),
      L('Yigirma olti karra ikki.', 'Двадцать шесть умножить на два.', 'Twenty six times two.'),
    ],
    answer: '52',
  },
  expr: 'S = 2(ab+bc+ac)',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Yon sirt bu tasma', 'Боковая поверхность это лента', 'The lateral surface is a strip'),
  tag: 'ploshchad-po-kartinke',
  show: [
    [
      L('yon yoqlar bitta tasmaga yotdi', 'боковые грани легли в одну ленту', 'the lateral faces lay down in one strip'),
      L('tasmaning balandligi prizma balandligi', 'высота ленты это высота призмы', 'the height of the strip is the height of the prism'),
    ],
    [
      L('tasmaning uzunligi asos perimetri', 'длина ленты это периметр основания', 'the length of the strip is the base perimeter'),
      L("tasma yuzasi ko'paytma", 'площадь ленты это произведение', 'the area of the strip is the product'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "To'g'ri prizmaning faqat yon sirtini, asoslarsiz yoyamiz.", 'Развернём только боковую поверхность прямой призмы, без оснований.', 'Let us unfold only the lateral surface of a right prism, without the bases.'),
    A('move', "To'g'ri prizmaning yon yoqlari to'g'ri to'rtburchak, va yoyilmada ular bitta uzun tasmaga qo'shiladi. Barcha to'g'ri to'rtburchaklarning balandligi bir xil, bu prizma balandligi. Asoslari esa ketma-ket boradi va birgalikda asos perimetrini beradi. Demak tasma yuzasi asos perimetrini balandlikka ko'paytirgani, va yangi formulani yodlash kerak emas, bu to'g'ri to'rtburchak yuzasi. Tomonlari uch, to'rt, besh va balandligi o'n bo'lgan uchburchakli prizmada tekshiramiz. Perimetr o'n ikki, yon sirt yuzasi bir yuz yigirma.", 'Боковые грани прямой призмы это прямоугольники, и в развёртке они складываются в одну длинную ленту. Высота у всех прямоугольников одна, это высота призмы. А их основания идут одно за другим, и вместе дают периметр основания. Значит площадь ленты это периметр основания, умноженный на высоту, и никакой новой формулы запоминать не надо, это площадь прямоугольника. Проверим на треугольной призме со сторонами три, четыре, пять и высотой десять. Периметр двенадцать, площадь боковой поверхности сто двадцать.', 'The lateral faces of a right prism are rectangles, and in the net they add up into one long strip. All the rectangles have the same height, the height of the prism. Their bases go one after another and together give the perimeter of the base. So the area of the strip is the base perimeter times the height, and there is no new formula to memorise, it is the area of a rectangle. Let us check on a triangular prism with sides three, four, five and height ten. The perimeter is twelve, the lateral area is one hundred twenty.'),
    A('work', "O'zingiz hisoblang. Asos perimetri o'n ikki, balandlik o'n. Yon sirt qancha?", 'Посчитай сам. Периметр основания двенадцать, высота десять. Какова боковая поверхность?', 'Work it out yourself. The base perimeter is twelve, the height is ten. What is the lateral area?'),
  ],
  work: {
    prompt: L('Yon sirtni toping', 'Найди боковую поверхность', 'Find the lateral area'),
    ok: L('Bir yuz yigirma. Perimetr karra balandlik.', 'Сто двадцать. Периметр на высоту.', 'One hundred twenty. The perimeter times the height.'),
    hint: [
      L("Tasma to'g'ri to'rtburchak.", 'Лента это прямоугольник.', 'The strip is a rectangle.'),
      L('Uning tomonlari perimetr va balandlik.', 'Его стороны это периметр и высота.', 'Its sides are the perimeter and the height.'),
      L("O'n ikki karra o'n.", 'Двенадцать умножить на десять.', 'Twelve times ten.'),
    ],
    answer: '120',
  },
  expr: 'S = P·h',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Piramida yoyilmasi uchburchaklar', 'Развёртка пирамиды это треугольники', 'The net of a pyramid is triangles'),
  tag: 'apofema-ne-rebro',
  show: [
    [
      L('markazda asos', 'в центре основание', 'the base in the centre'),
      L("atrofida to'rt uchburchak", 'вокруг четыре треугольника', 'four triangles around it'),
    ],
    [
      L('har birining balandligi apofema', 'высота каждого это апофема', 'the height of each is the apothem'),
      L('har birining asosi tomon', 'основание каждого это сторона', 'the base of each is a side'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Muntazam piramidani yoyamiz. Asos tomoni olti, apofema besh.', 'Развернём правильную пирамиду. Сторона основания шесть, апофема пять.', 'Let us unfold a regular pyramid. The base side is six, the apothem is five.'),
    A('move', "Piramida yoyilmasida asos markazda yotadi, yon yoqlar esa uning atrofida uchburchak bo'lib yoziladi. Har uchburchakning asosi piramida asosining tomoni, balandligi esa apofema. Apofema shuning uchun muhim, va uni yon qirra bilan almashtirib bo'lmasligi ham shundan: qirra uchburchakning balandligi emas. Bitta uchburchak yuzasi olti karra beshning yarmi, ya'ni o'n besh. Uchburchaklar to'rtta, demak yon sirt oltmish.", 'В развёртке пирамиды основание лежит в центре, а боковые грани раскладываются вокруг него треугольниками. У каждого треугольника основание это сторона основания пирамиды, а высота это апофема. Вот почему апофема так важна, и вот почему её нельзя подменять боковым ребром: ребро высотой треугольника не является. Площадь одного треугольника это половина произведения шесть на пять, то есть пятнадцать. Треугольников четыре, значит боковая поверхность шестьдесят.', 'In the net of a pyramid the base lies in the centre and the lateral faces spread around it as triangles. For each triangle the base is a side of the pyramid base and the height is the apothem. That is why the apothem matters so much, and why it cannot be replaced by the lateral edge: the edge is not the height of the triangle. The area of one triangle is half of six times five, that is fifteen. There are four triangles, so the lateral area is sixty.'),
    A('work', "O'zingiz hisoblang. Asos tomoni olti, apofema besh. Yon sirt qancha?", 'Посчитай сам. Сторона основания шесть, апофема пять. Какова боковая поверхность?', 'Work it out yourself. The base side is six, the apothem is five. What is the lateral area?'),
  ],
  work: {
    prompt: L('Yon sirtni toping', 'Найди боковую поверхность', 'Find the lateral area'),
    ok: L("Oltmish. To'rt uchburchak o'n beshtadan.", 'Шестьдесят. Четыре треугольника по пятнадцать.', 'Sixty. Four triangles of fifteen each.'),
    hint: [
      L('Bitta uchburchak yuzasini hisoblang.', 'Посчитай площадь одного треугольника.', 'Compute the area of one triangle.'),
      L("Tomonni apofemaga ko'paytirganning yarmi.", 'Половина произведения стороны на апофему.', 'Half the product of the side and the apothem.'),
      L("O'n besh karra to'rt.", 'Пятнадцать умножить на четыре.', 'Fifteen times four.'),
    ],
    answer: '60',
  },
  expr: 'S = ½·P·m',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L("Rakurs ko'rinishni o'zgartiradi, yuzani emas", 'Ракурс меняет вид, не площадь', 'The view changes what you see, not the area'),
  tag: 'ploshchad-po-kartinke',
  show: [
    [
      L("bir rakursdan uch yoq ko'rinadi", 'с одного ракурса видно три грани', 'from one view three faces show'),
      L("buring va boshqa uchtasi ko'rinadi", 'поверни и видно другие три', 'rotate and another three show'),
    ],
    [
      L("birdan uchtadan ko'p ko'rinmaydi", 'больше трёх сразу не видно', 'more than three never show at once'),
      L("sirt esa o'sha", 'а поверхность всё та же', 'while the surface is the same'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Kubga turli tomondan qaraymiz va birdan nechta yoq ko'rinishini sanaymiz.", 'Посмотрим на куб с разных сторон и посчитаем, сколько граней видно сразу.', 'Let us look at a cube from different sides and count how many faces show at once.'),
    A('move', "Kubni qancha burmang, birdan uchtadan ko'p yoqni ko'rish mumkin emas. Uchtasi ko'rinadi, uchtasi yashiringan, va qaysi biri ekani rakursga bog'liq. Sirt yuzasi esa burilishda o'zgarmaydi, chunki u jism haqida, qarash haqida emas. Ish qoidasi shundan. Yuza yoyilma yoki formula bo'yicha hisoblanadi, ko'rinadigan bo'laklar soni bo'yicha emas. Faqat ko'rinadiganini qo'shsangiz, javob haqiqiysidan roppa-rosa ikki baravar kichik chiqadi, va xatoni sezmaslik oson.", 'Сколько куб ни крути, больше трёх граней одновременно увидеть нельзя. Три видно, три скрыто, и какие именно, зависит от ракурса. А площадь поверхности при повороте не меняется, потому что она про тело, а не про взгляд. Отсюда правило работы. Площадь считают по развёртке или по формуле, а не по числу видимых кусков. Если сложить только видимое, ответ окажется ровно вдвое меньше настоящего, и ошибку легко не заметить.', 'However much you rotate the cube, more than three faces can never be seen at once. Three show, three are hidden, and which ones depends on the view. The surface area does not change under rotation, because it is about the body and not about the look. Hence the working rule. The area is computed from the net or from a formula, not from the number of visible pieces. If you add only what you see, the answer comes out exactly half of the true one, and the mistake is easy to miss.'),
    A('work', "O'zingiz hisoblang. Kubning nechta yog'i birdan ko'rinadi?", 'Посчитай сам. Сколько граней куба видно одновременно?', 'Work it out yourself. How many faces of a cube show at once?'),
  ],
  work: {
    prompt: L("Birdan nechta yoq ko'rinadi?", 'Сколько граней видно сразу?', 'How many faces show at once?'),
    ok: L('Uchta. Qolgan uchtasi yashiringan, lekin yuzaga oltitasi kiradi.', 'Три. Остальные три скрыты, но в площадь входят все шесть.', 'Three. The other three are hidden, but all six enter the area.'),
    hint: [
      L("Kubni buring va ko'rinadigan yoqlarni sanang.", 'Поверни куб и посчитай видимые грани.', 'Rotate the cube and count the visible faces.'),
      L("Qancha burmang, son o'zgarmaydi.", 'Сколько бы ты ни крутил, число не меняется.', 'However much you rotate, the number does not change.'),
      L('Uchta.', 'Три.', 'Three.'),
    ],
    answer: '3',
  },
  expr: '3 + 3 = 6',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Sirt yoyilma bo'yicha hisoblanadi", 'Поверхность считают по развёртке', 'The surface is counted from the net'),
  tag: 'ploshchad-po-kartinke',
  motion: ['rule'],
  audio: [
    A('mount', 'Farqlashga bitta savol, keyin kartochka.', 'Один вопрос на различение, потом карточка.', 'One question to tell them apart, then the card.'),
    A('rule', "Kartochkadagi ikkala formula ham yangi emas. Birinchisi to'g'ri to'rtburchak yuzasi, ikkinchisi uchburchak yuzasi, asos tomonlari qancha bo'lsa shuncha marta olingani. Shuning uchun ularni yodlash shart emas, yoyilma qanday ko'rinishini eslash yetarli. To'liq sirt esa doim yon sirt qo'shuv asoslar, prizmada ikki asos, piramidada bitta.", 'Обе формулы в карточке не новые. Первая это площадь прямоугольника, вторая площадь треугольника, взятая столько раз, сколько сторон у основания. Поэтому запоминать их не обязательно, достаточно помнить, как выглядит развёртка. И полная поверхность это всегда боковая плюс основания, у призмы два основания, у пирамиды одно.', 'Neither formula on the card is new. The first is the area of a rectangle, the second the area of a triangle taken as many times as the base has sides. So there is no need to memorise them, it is enough to remember what the net looks like. And the full surface is always the lateral one plus the bases, two bases for a prism and one for a pyramid.'),
  ],
  probe: {
    question: L("Sirt yuzasini hisoblaganda nima qo'shiladi?", 'Что складывают, считая площадь поверхности?', 'What is added when computing the surface area?'),
    items: [
      { id: 'a', label: L('barcha yoqlar yuzalari', 'площади всех граней', 'the areas of all the faces'), correct: true },
      { id: 'b', label: L("ko'rinadigan yoqlar yuzalari", 'площади видимых граней', 'the areas of the visible faces'), hint: L("Ko'rinish rakursga bog'liq, yuza esa yo'q.", 'Видимость зависит от ракурса, а площадь нет.', 'Visibility depends on the view, the area does not.') },
    ],
  },
  rule: {
    lawLabel: L('Sirt yuzasi', 'Площадь поверхности', 'The surface area'),
    lines: [
      L("to'liq sirt yon sirt qo'shuv asoslar, prizmada ular ikkita", 'полная поверхность это боковая плюс основания, у призмы их два', 'the full surface is the lateral one plus the bases, a prism has two'),
      L("to'g'ri prizmaning yon sirti perimetr karra balandlik", 'боковая поверхность прямой призмы это периметр на высоту', 'the lateral area of a right prism is the perimeter times the height'),
      L('muntazam piramidaning yon sirti perimetrning yarmi karra apofema', 'боковая поверхность правильной пирамиды это половина периметра на апофему', 'the lateral area of a regular pyramid is half the perimeter times the apothem'),
    ],
    law: 'S = S₁ + 2S₀',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Formula va jism', 'Формула и тело', 'The formula and the body'),
  tag: 'ploshchad-po-kartinke',
  audio: [
    A('mount', "To'rt yozuv va to'rt nom. Ularni birlashtiring.", 'Четыре записи и четыре названия. Соедини их.', 'Four readings and four names. Match them.'),
  ],
  match: {
    prompt: L('Yozuvni jism bilan birlashtiring', 'Соедини запись с телом', 'Match the reading with the body'),
    ok: L("To'rttasi ham joyida. Har formula yassi shakl yuzasi.", 'Все четыре на месте. Каждая формула это площадь плоской фигуры.', 'All four in place. Every formula is the area of a flat figure.'),
    a: L('prizma yon sirti', 'боковая призмы', 'lateral, prism'),
    b: L("parallelepiped to'liq sirti", 'полная параллелепипеда', 'full, box'),
    c: L('piramida yon sirti', 'боковая пирамиды', 'lateral, pyramid'),
    d: L("kub to'liq sirti", 'полная куба', 'full, cube'),
    left: ['P·h', '2(ab+bc+ac)', '½·P·m', '6a²'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Tasma formulasini chiqaring', 'Выведи формулу ленты', 'Derive the strip formula'),
  tag: 'ploshchad-po-kartinke',
  audio: [
    A('mount', "Uch qator, va har birining ro'yxatdan o'z asoslashi bor.", 'Три строки, и у каждой своё обоснование из списка.', 'Three lines, each with its own justification from the list.'),
  ],
  proof: {
    given: L("to'g'ri prizma", 'прямая призма', 'a right prism'),
    goal: L('yon sirt perimetr karra balandlik', 'боковая поверхность это периметр на высоту', 'the lateral area is the perimeter times the height'),
    r1: L("yon sirt to'g'ri to'rtburchakka yoyiladi", 'боковая поверхность разворачивается в прямоугольник', 'the lateral surface unfolds into a rectangle'),
    r2: L('uning balandligi prizma balandligi', 'его высота это высота призмы', 'its height is the height of the prism'),
    r3: L('uning asosi asos perimetri', 'его основание это периметр основания', 'its base is the perimeter of the base'),
    ok: L("Isbotlandi. To'g'ri to'rtburchak yuzasi tomonlarining ko'paytmasi.", 'Доказано. Площадь прямоугольника это произведение его сторон.', 'Proved. The area of a rectangle is the product of its sides.'),
    e1: L('Balandlik haqida keyin. Avval qanday shakl chiqdi.', 'Про высоту дальше. Сначала какая фигура получилась.', 'The height comes later. First what figure appeared.'),
    e2: L("Shakl ma'lum. Balandligi qayerdan.", 'Фигура известна. Откуда её высота.', 'The figure is known. Where does its height come from.'),
    e3: L('Balandlik bor. Endi ikkinchi tomon haqida.', 'Высота есть. Теперь про вторую сторону.', 'The height is there. Now about the other side.'),
  },
  reason: {
    s1: L('yon sirtning yoyilmasi', 'развёртка боковой поверхности', 'the net of the lateral surface'),
    s2: L("to'g'ri prizmaning yon qirralari teng va asosga perpendikulyar", 'боковые рёбра прямой призмы равны и перпендикулярны основанию', 'the lateral edges of a right prism are equal and perpendicular to the base'),
    s3: L('asos qirralari ketma-ket boradi', 'рёбра основания идут одно за другим', 'the base edges go one after another'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: 'S = P·h',
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
    ok: L('Bir yuz ellik. Yigirma besh karra olti.', 'Сто пятьдесят. Двадцать пять умножить на шесть.', 'One hundred fifty. Twenty five times six.'),
    hint: [
      L('Kubning barcha yoqlari kvadrat.', 'У куба все грани квадраты.', 'All faces of a cube are squares.'),
      L('Bitta yoq yuzasi qirraning kvadrati.', 'Площадь одной грани это ребро в квадрате.', 'The area of one face is the edge squared.'),
      L('Yigirma besh karra olti.', 'Двадцать пять умножить на шесть.', 'Twenty five times six.'),
    ],
    prompt: 'a = 5,   S = ?',
    answer: '150',
  },
  order: {
    prompt: L('Yozuvlarni hisoblash tartibida joylashtiring', 'Расставь записи в том порядке, в каком считают', 'Arrange the readings in the order they are computed'),
    title: L('Hisob tartibi', 'Порядок счёта', 'The order of computing'),
    ok: L("Tartib to'g'ri. Avval bitta yoq, keyin hammasi.", 'Порядок верный. Сначала одна грань, потом все.', 'The order is right. First one face, then all of them.'),
    bad: L('Bu tartibda emas. Avval nima kerak.', 'Не в этом порядке. Что нужно раньше.', 'Not in this order. What is needed first.'),
    items: ['6a²', 'a', 'a²', 'S'],
    answer: 'a  a²  6a²  S',
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
    A('mount', "To'rt qator, va ulardan birida yoqlar yo'qolgan.", 'Четыре строки, и в одной из них потерялись грани.', 'Four lines, and in one of them faces got lost.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("O'lchamlar to'g'ri yozilgan.", 'Измерения выписаны верно.', 'The dimensions are written correctly.'),
    r2: L("Uch ko'paytma to'g'ri topilgan.", 'Три произведения найдены верно.', 'The three products are found correctly.'),
    r4: L('Javob yuqoridagi xato qatordan olingan.', 'Ответ получен из неверной строки выше.', 'The answer comes from the wrong line above.'),
  },
  proof: L("Jismni yoying: bo'laklar oltita, qo'shilgani esa uchta.", 'Разверни тело: кусков шесть, а сложены только три.', 'Unfold the body: there are six pieces and only three were added.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L("Uchinchi. Ikkiga ko'paytirish, ya'ni ko'rinmas yoqlar esdan chiqdi.", 'Третья. Забыли умножить на два, то есть невидимые грани.', 'The third. They forgot to multiply by two, that is the invisible faces.'),
    hint: [
      L("Yig'indiga nechta yoq kirganini hisoblang.", 'Посчитай, сколько граней вошло в сумму.', 'Count how many faces went into the sum.'),
      L('Parallelepipedning yoqlari juft-juft teng.', 'Грани параллелепипеда попарно равны.', 'The faces of a box are equal in pairs.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'a = 2,   b = 3,   c = 4',
    r2: '6 + 12 + 8 = 26',
    r3: 'S = 26',
    r4: 'S = 26',
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
    A('mount', "Formulani o'ngdan chapga o'qiymiz. Yuza bo'yicha qirrani topamiz.", 'Прочитаем формулу справа налево. По площади найдём ребро.', 'Let us read the formula from right to left. From the area we find the edge.'),
    A('work', "Doim to'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны всегда. Их больше одной.', 'Mark all the readings that are always true. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Nima doim to'g'ri", 'Что верно всегда', 'What is always true'),
    ok: L("Beshtadan uch yozuv. Qolgan ikkitasi yoqlarni yo'qotadi.", 'Три записи из пяти. Две оставшиеся теряют грани.', 'Three readings out of five. The other two lose faces.'),
    items: [
      { id: 'd', label: 'ab + bc + ac', hint: L("Bu faqat ko'rinadigan yoqlar yig'indisi.", 'Это сумма только видимых граней.', 'That is the sum of the visible faces only.') },
      { id: 'e', label: '½·P·m + 2S₀', hint: L('Piramidada asos bitta, ikkita emas.', 'У пирамиды основание одно, а не два.', 'A pyramid has one base, not two.') },
      { id: 'a', label: '6a²', ok: true },
      { id: 'b', label: '2(ab+bc+ac)', ok: true },
      { id: 'c', label: 'P·h', ok: true },
    ],
  },
  place: {
    prompt: L("Kubning sirt yuzasi ellik to'rt. Qirra qancha?", 'Площадь поверхности куба пятьдесят четыре. Каково ребро?', 'The surface area of a cube is fifty four. What is the edge?'),
    ok: L("Uch. Ellik to'rtni oltiga bo'lsak to'qqiz, to'qqizdan ildiz uch.", 'Три. Пятьдесят четыре делить на шесть это девять, корень из девяти три.', 'Three. Fifty four divided by six is nine, the root of nine is three.'),
    wrong: L('Avval bitta yoq yuzasini toping.', 'Сначала найди площадь одной грани.', 'First find the area of one face.'),
    target: '3',
    step: '54 : 6 = 9',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'ploshchad-po-kartinke',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Yoyilma nima?', 'Что такое развёртка?', 'What is a net?'),
      done: '4 + 2 = 6',
      items: [
        { id: 'a', label: L('barcha yoqlardan yassi shakl', 'плоская фигура из всех граней', 'a flat figure of all the faces'), correct: true },
        { id: 'b', label: L("jismning yon ko'rinishi", 'вид тела сбоку', 'a side view of the body'), hint: L("Yon ko'rinish barcha yoqlarni ko'rsatmaydi.", 'Вид сбоку показывает не все грани.', 'A side view does not show all the faces.') },
        { id: 'c', label: L('jismning kesimi', 'сечение тела', 'a section of the body'), hint: L('Kesim kesish, yoyish emas.', 'Сечение это разрез, а не разворот.', 'A section is a cut, not an unfolding.') },
        { id: 'd', label: L('jismning soyasi', 'тень тела', 'the shadow of the body'), hint: L('Soya proyeksiya, u yuzani saqlamaydi.', 'Тень это проекция, площади она не сохраняет.', 'A shadow is a projection, it does not preserve areas.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("To'g'ri prizmaning yon sirti?", 'Боковая поверхность прямой призмы?', 'The lateral area of a right prism?'),
      done: 'P·h',
      items: [
        { id: 'a', label: L('perimetr karra balandlik', 'периметр на высоту', 'the perimeter times the height'), correct: true },
        { id: 'b', label: L('asos yuzasi karra balandlik', 'площадь основания на высоту', 'the base area times the height'), hint: L("Bu yuza emas, boshqa kattalik bo'lardi.", 'Это была бы не площадь, а другая величина.', 'That would not be an area but a different quantity.') },
        { id: 'c', label: L('tomon karra balandlik', 'сторона на высоту', 'a side times the height'), hint: L('Tomon bitta yoq beradi, butun tasmani emas.', 'Сторона даёт одну грань, а не всю ленту.', 'A side gives one face, not the whole strip.') },
        { id: 'd', label: L('perimetrning yarmi karra balandlik', 'половина периметра на высоту', 'half the perimeter times the height'), hint: L("Yarim piramidada, uchburchak yuzasidan paydo bo'ladi.", 'Половина появляется у пирамиды, из площади треугольника.', 'The half appears for a pyramid, from the triangle area.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Piramida yon yog'ining balandligi nima?", 'Что является высотой боковой грани пирамиды?', 'What is the height of a lateral face of a pyramid?'),
      done: 'm',
      items: [
        { id: 'a', label: L('apofema', 'апофема', 'the apothem'), correct: true },
        { id: 'b', label: L('yon qirra', 'боковое ребро', 'the lateral edge'), hint: L('Qirra asos uchiga keladi.', 'Ребро приходит в вершину основания.', 'The edge arrives at a base vertex.') },
        { id: 'c', label: L('piramida balandligi', 'высота пирамиды', 'the height of the pyramid'), hint: L('Piramida balandligi yon yoqda yotmaydi.', 'Высота пирамиды в боковой грани не лежит.', 'The height of the pyramid does not lie in a lateral face.') },
        { id: 'd', label: L('asos tomoni', 'сторона основания', 'a base side'), hint: L('Tomon uchburchakning asosi, balandligi emas.', 'Сторона это основание треугольника, а не высота.', 'The side is the base of the triangle, not its height.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Kubning nechta yog'i birdan ko'rinadi?", 'Сколько граней куба видно сразу?', 'How many faces of a cube show at once?'),
      done: '3 + 3 = 6',
      items: [
        { id: 'a', label: L('uchta', 'три', 'three'), correct: true },
        { id: 'b', label: L('oltita', 'шесть', 'six'), hint: L('Olti barcha yoqlar, lekin yarmi yashiringan.', 'Шесть это все грани, но половина скрыта.', 'Six is all the faces, but half are hidden.') },
        { id: 'c', label: L("to'rtta", 'четыре', 'four'), hint: L("To'rtinchi yoq doim jism orqasiga ketadi.", 'Четвёртая грань всегда уходит за тело.', 'The fourth face always goes behind the body.') },
        { id: 'd', label: L('bitta', 'одна', 'one'), hint: L("Bitta faqat yoqqa tik qaraganda ko'rinadi.", 'Одна видна только строго напротив грани.', 'One shows only when looking straight at a face.') },
      ],
    },
  ],
  angles: ['P·h', '2(ab+bc+ac)', '½·P·m', '6a²'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Endi nimani bilasiz', 'Что теперь умеешь', 'What you can do now'),
  audio: [
    A('mount', "Dars nechta yoqni qo'shish kerak degan savol bilan boshlandi.", 'Урок начался с вопроса, сколько граней складывать.', 'The lesson began with the question how many faces to add.'),
    A('next', "Uch bu ko'rinadigani, olti bu bori. Yoyilma barcha bo'laklarni birdan ko'rsatdi, va sirt yuzasi biz allaqachon hisoblay oladigan yassi shakllar yuzalarining yig'indisiga aylandi. Darsda birorta yangi formula paydo bo'lmadi: tasma to'g'ri to'rtburchak, piramidaning yon yog'i uchburchak. Keyin muntazam prizma va piramidalar, u yerda shu formulalar qisqaradi, chunki asosning barcha tomonlari teng.", 'Три это то, что видно, а шесть это то, что есть. Развёртка показала все куски сразу, и площадь поверхности стала суммой площадей плоских фигур, которые мы умеем считать давно. Ни одной новой формулы в уроке не появилось: лента это прямоугольник, боковая грань пирамиды это треугольник. Дальше правильные призмы и пирамиды, там эти же формулы станут короче, потому что все стороны основания равны.', 'Three is what shows, six is what there is. The net showed all the pieces at once, and the surface area became a sum of areas of flat figures we have been able to compute for a long time. Not a single new formula appeared in the lesson: the strip is a rectangle, a lateral face of a pyramid is a triangle. Next come regular prisms and pyramids, where these same formulas get shorter, because all sides of the base are equal.'),
  ],
  can: [
    L('Jismni yassi shaklga yoyaman', 'Разворачиваю тело в плоскую фигуру', 'I unfold a body into a flat figure'),
    L("Ko'rinadiganlarini emas, barcha yoqlar yuzasini qo'shaman", 'Складываю площади всех граней, а не видимых', 'I add the areas of all the faces, not the visible ones'),
    L("Prizmaning yon sirtini to'g'ri to'rtburchak kabi hisoblayman", 'Считаю боковую поверхность призмы как прямоугольник', 'I compute the lateral area of a prism as a rectangle'),
    L('Piramidaning yon sirtini apofema orqali hisoblayman', 'Считаю боковую поверхность пирамиды через апофему', 'I compute the lateral area of a pyramid through the apothem'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L('Bundan keyin muntazam prizma va piramidalar, u yerda bu formulalar qisqaradi', 'Дальше правильные призмы и пирамиды, где все эти формулы становятся короче', 'Next come regular prisms and pyramids, where all these formulas get shorter'),
  lifehack: L('Formulani eslamasangiz, jismni xayolda yoying', 'Не помнишь формулу — разверни тело в голове', 'If you forget a formula, unfold the body in your head'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L("Geometriya, ellik to'qqizinchi va oltmishinchi betlar", 'Геометрия, страницы пятьдесят девять и шестьдесят', 'Geometry, pages fifty nine and sixty'),
  hook: {
    a: 'S = ab + bc + ac',
    b: 'S = 2(ab+bc+ac)',
  },
  proved: 'S = 2(ab+bc+ac)',
  law: 'S = S₁ + 2S₀',
  sheet: [
    'P·h',
    '2(ab+bc+ac)',
    '½·P·m',
    '6a²',
    '3 + 3 = 6',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/\u2212/g, '-'))

// PRIBOR 6B. Darsning butun mazmuni JISM va YOYILMA orasidagi bog'lanishda,
// shuning uchun ular yonma-yon turadi: chapda jism, o'ngda yoyilma, va
// yoritilgan bo'lak jismdagi yoq bilan bir xil rangda.
//
// `size` ni O'TKAZISH SHART: `Scene` o'lchamni `cloneElement` bilan beradi, va
// uni yutib qo'ygan o'ram chizmani standart o'lchamda chizadi (35-darsda shu
// sakson marta oshib ketishga olib kelgan).
const Both = ({ size = 268, step = 0, lit = null, body, faces, kind = 'prism' }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
    <Space size={size * 0.46} step={1} yaw={0.42} poly={body} faces={faces} />
    <Net size={size * 0.46} step={step} kind={kind} lit={lit} />
  </div>
)

const PRISM = { kind: 'prism', h: 1.05, plan: [[-0.5, -0.32], [0.5, -0.32], [0.5, 0.32], [-0.5, 0.32]] }
const CUBE = { kind: 'prism', h: 0.94, plan: [[-0.47, -0.47], [0.47, -0.47], [0.47, 0.47], [-0.47, 0.47]] }
const PYR = { kind: 'pyramid', h: 1.2, plan: [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]] }

const FACE2 = '#6b8fa3'
const BASE = [{ by: ['A', 'B', 'C', 'D'] }]
const BASE_SIDE = [{ by: ['A', 'B', 'C', 'D'] }, { by: ['A', 'B', 'B1', 'A1'], tone: FACE2 }]
const PYR_SIDE = [{ by: ['A', 'B', 'C', 'D'] }, { by: ['A', 'B', 'S'], tone: FACE2 }]

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
            fig={<Space step={1} yaw={0.4} poly={PRISM} faces={BASE_SIDE} />}
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
            fig={<Space step={1} yaw={0.4} poly={PRISM} faces={BASE_SIDE} />}
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
          <Both body={PRISM} faces={BASE} step={1 + phase} kind="prism" />
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={PRISM} faces={BASE_SIDE} />}
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
            body={PRISM} faces={BASE_SIDE} step={2} kind="prism"
            lit={phase === 0 ? 'lat0' : 'base0'}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={PRISM} faces={BASE_SIDE} />}
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
            body={PRISM} faces={BASE_SIDE} step={2} kind="prism"
            lit={phase === 0 ? 'lat0' : 'lat2'}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} poly={PRISM} faces={BASE_SIDE} />}
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
            body={PYR} faces={PYR_SIDE} step={1 + phase} kind="pyramid"
            lit={phase === 0 ? null : 'lat0'}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} poly={PYR} faces={PYR_SIDE} />}
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
            step={1} yaw={phase === 0 ? 0.4 : 1.9} poly={CUBE}
            faces={BASE_SIDE}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={CUBE} faces={BASE_SIDE} />}
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
                body={PRISM} faces={BASE_SIDE} kind="prism"
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
              <Both
                body={round === 1 ? PYR : PRISM}
                faces={round === 1 ? PYR_SIDE : BASE_SIDE}
                kind={round === 1 ? 'pyramid' : 'prism'}
                step={2}
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
