// ============================================================================
// 10-sinf, Dars 31. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS31_KONTENT.md
// Ma'lumot sborshchik bilan yig'ilgan, EKRAN TANALARI qo'lda (etalon 5.3).
// Asbob 6A -- `Space`, tekisliklar kubning yoqlari bilan olinadi, burilishni
// o'quvchi qiladi (`SpinScene`).
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
  Scene,
  SpinScene,
} from './tools.jsx'
import { Space } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 31
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Tekisliklarning parallelligi`,
  `Урок ${LESSON_NO}. Параллельность двух плоскостей`,
  `Lesson ${LESSON_NO}. Two parallel planes`,
)

const BLOCK = { label: 'B1', from: 1, to: 7, current: 31 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('IKKI TEKISLIK', 'ДВЕ ПЛОСКОСТИ', 'TWO PLANES'),
  title: L("Kesishadi yoki yo'q", 'Пересекутся или нет', 'They will meet, or they will not'),
  audio: [
    A('mount', "Kubning ikki bo'yalgan yog'i. Bu bizning savolimizning ikki tekisligi.", 'Две закрашенные грани куба. Это две плоскости нашего вопроса.', 'Two shaded faces of the cube. These are the two planes of our question.'),
    A('r1', "Birinchi yozuv ularning umumiy chizig'i bor deydi: chizmada yoqlarning chetlari birlashadi.", 'Первая запись говорит, что общая прямая у них есть: на чертеже края граней сходятся.', 'The first reading says they do have a common line: on the drawing the edges of the faces come together.'),
    A('r2', "Ikkinchisi umumiy nuqta umuman yo'q deydi, va hech qanday davom ettirish bermaydi.", 'Вторая говорит, что общих точек нет вовсе, и никакое продолжение их не даст.', 'The second says there are no common points at all, and no extension will give any.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi sahnani buramiz.', 'Твой ответ записан. Сейчас повернём сцену.', 'Your answer is saved. Now we will turn the scene.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L("to'g'ri chiziq bo'ylab kesishadi", 'пересекутся по прямой', 'they meet along a line'),
      value: '1',
    },
    b: {
      name: L('hech qachon kesishmaydi', 'не пересекутся никогда', 'they never meet'),
      value: '0',
    },
  },
  expr: ['ABCD', 'A₁B₁C₁D₁'],
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE BASICS'),
  title: L('Boshlashdan oldin uchta qisqa savol', 'Три коротких перед началом', 'Three short ones before we start'),
  tag: 'support',
  audio: [
    A('mount', "Bo'lib o'tgan narsalar uchun uchta savol. Uchalasi alomatda ishlaydi.", 'Три вопроса на то, что уже было. Все три работают в признаке.', 'Three questions on what has already been. All three work in the criterion.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Ikki tekislikning umumiy nuqtasi bor. Aksioma bo'yicha ularda yana nima bor?", 'Две плоскости имеют общую точку. Что у них есть ещё по аксиоме?', 'Two planes have a common point. What else do they have by the axiom?'),
      done: L('Umumiy nuqta butun chiziqni ergashtiradi.', 'Общая точка тянет за собой целую прямую.', 'A common point drags a whole line behind it.'),
      items: [
        { id: 'a', label: L("umumiy to'g'ri chiziq", 'общая прямая', 'a common line'), correct: true },
        { id: 'b', label: L('faqat shu nuqta', 'только эта точка', 'only that point'), hint: L("Aksioma butun chiziq beradi: tekisliklarning bitta umumiy nuqtasi bo'lmaydi.", 'Аксиома даёт целую прямую: у плоскостей одна общая точка не бывает.', 'The axiom gives a whole line: planes never share just one point.') },
        { id: 'c', label: L('umumiy tekislik', 'общая плоскость', 'a common plane'), hint: L("Umumiy tekislik ular ustma-ust tushgani bo'lardi.", 'Общая плоскость означала бы, что они совпали.', 'A common plane would mean they coincide.') },
        { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L('Nuqta bor, demak «hech narsa» chiqib ketadi.', 'Точка уже есть, значит «ничего» отпадает.', 'A point is already there, so nothing is not an option.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Kubning AB va AD chiziqlari: ular kesishadimi?', 'Прямые AB и AD куба: они пересекаются?', 'The lines AB and AD of the cube: do they meet?'),
      done: L("Kesishuvchi chiziqlar alomatda kerak bo'ladi.", 'Пересекающиеся прямые понадобятся в признаке.', 'Intersecting lines will be needed in the criterion.'),
      items: [
        { id: 'a', label: L('ha, A uchida', 'да, в вершине A', 'yes, at the vertex A'), correct: true },
        { id: 'b', label: L("yo'q, ular parallel", 'нет, они параллельны', 'no, they are parallel'), hint: L("Parallellarning umumiy nuqtasi yo'q, bularning umumiy uchi bor.", 'Параллельные не имеют общих точек, а у этих общая вершина.', 'Parallel lines share no point, and these share a vertex.') },
        { id: 'c', label: L("yo'q, ular ayqash", 'нет, они скрещиваются', 'no, they are skew'), hint: L('Ayqashlar bir tekislikda yotmaydi, bu ikkisi esa asosda.', 'Скрещивающиеся не лежат в одной плоскости, а эти две в основании.', 'Skew lines lie in no common plane, and these two are in the base.') },
        { id: 'd', label: L("chizmaga bog'liq", 'зависит от чертежа', 'it depends on the drawing'), hint: L('Umumiy uch har qanday chizmada bor.', 'Общая вершина есть на любом чертеже.', 'The common vertex is there on any drawing.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Chiziq tekislikka parallel. Ularning nechta umumiy nuqtasi bor?', 'Прямая параллельна плоскости. Сколько у них общих точек?', 'A line is parallel to a plane. How many common points have they?'),
      done: L("Bu esa o'tgan dars, u ham ishga tushadi.", 'А это прошлый урок, и он тоже пойдёт в дело.', 'And that was the last lesson, it will also come into play.'),
      items: [
        { id: 'a', label: L("birorta ham yo'q", 'ни одной', 'none'), correct: true },
        { id: 'b', label: L('bitta', 'одна', 'one'), hint: L('Bitta umumiy nuqta bu kesishish.', 'Одна общая точка это пересечение.', 'One common point is an intersection.') },
        { id: 'c', label: L('ikkita', 'две', 'two'), hint: L('Ikki nuqta orqali chiziq tekislikka yotib qolardi.', 'Через две точки прямая легла бы в плоскость.', 'Through two points the line would lie in the plane.') },
        { id: 'd', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p yotgan chiziqda, bu o'tgan dars.", 'Бесконечно много у лежащей прямой, это прошлый урок.', 'Infinitely many belongs to a lying line, that was the last lesson.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('SAHNANI BURING', 'ПОВЕРНИ СЦЕНУ', 'TURN THE SCENE'),
  title: L('Chizmada yoqlarning chetlari birlashadi', 'Края граней на чертеже сходятся', 'On the drawing the edges of the faces come together'),
  tag: 'ploskost-po-chertezhu',
  show: [
    [
      L('Bu rakursda ikki yoqning chetlari deyarli mos tushdi', 'На этом ракурсе края двух граней почти совпали', 'At this angle the edges of the two faces nearly coincide'),
      L("tekisliklarning umumiy chizig'i bordek ko'rinadi", 'кажется, что у плоскостей есть общая прямая', 'it looks as if the planes have a common line'),
      L('lekin bu yana ekranga proyeksiya', 'но это снова проекция на экран', 'but this is again the projection onto the screen'),
    ],
    [
      L('Sahna burildi', 'Сцена повернулась', 'The scene has turned'),
      L("yoqlar orasida kubning balandligi ko'rinadi", 'между гранями видна высота куба', 'between the faces the height of the cube is visible'),
      L("va u hech qanday burilishda yo'qolmaydi", 'и она не пропадает ни при каком повороте', 'and it does not vanish at any turn'),
    ],
  ],
  motion: ['spin'],
  audio: [
    A('mount', 'Kubning ikki asosi. Sahnani pastdagi tugmalar bilan buring.', 'Два основания куба. Поверни сцену кнопками ниже.', 'The two bases of the cube. Turn the scene with the buttons below.'),
    A('spin', "Yoqlar orasidagi oraliqni kuzatib turing. Ularning umumiy chizig'i birorta rakursda yo'q.", 'Смотри на просвет между гранями. Общей прямой у них нет ни на одном ракурсе.', 'Watch the gap between the faces. They have no common line at any angle.'),
    A('work', 'Darslik qisqa aytadi: kesishmaydigan tekisliklar parallel deb ataladi.', 'Учебник говорит коротко: не пересекающиеся плоскости называются параллельными.', 'The textbook puts it briefly: planes that do not intersect are called parallel.'),
  ],
  work: {
    prompt: L('Kubning ikki asosining nechta umumiy nuqtasi bor?', 'Сколько общих точек у двух основаниий куба?', 'How many common points have the two bases of the cube?'),
    ok: L("To'g'ri. Birorta ham yo'q, va bu tekisliklar parallelligining ta'rifi.", 'Верно. Ни одной, и это определение параллельности плоскостей.', 'Correct. None, and that is the definition of parallel planes.'),
    hint: [
      L('Sahnani buring va umumiy nuqtani izlang.', 'Поверни сцену и поищи общую точку.', 'Turn the scene and look for a common point.'),
      L('Yoqlar orasida doim kubning balandligi turadi.', 'Между гранями всё время стоит высота куба.', 'The height of the cube stands between the faces all the time.'),
      L('Demak umumiy nuqta nol.', 'Значит общих точек ноль.', 'So the common points are zero.'),
    ],
    answer: '0',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('BIR JUFTLIK KAM', 'ОДНОЙ ПАРЫ МАЛО', 'ONE PAIR IS NOT ENOUGH'),
  title: L('Juftlik bor, tekisliklar esa kesishadi', 'Пара есть, а плоскости пересекаются', 'The pair is there, and the planes still meet'),
  tag: 'odna-para-dostatochno',
  show: [
    [
      L('Asos va yon yoq', 'Основание и боковая грань', 'The base and a side face'),
      L('ularda parallel juftlik bor: AD va B₁C₁ parallel', 'в них есть пара параллельных прямых: AD и B₁C₁ параллельны', 'they do have a parallel pair: AD and B₁C₁ are parallel'),
      L('alomatga bir juftlik yetmaydi', 'одной пары признаку не хватает', 'one pair is not enough for the criterion'),
    ],
    [
      L("Bu ikki yoq BC qirrasi bo'ylab kesishadi", 'Эти две грани пересекаются по ребру BC', 'These two faces meet along the edge BC'),
      L('demak ular parallel emas', 'значит параллельными они не являются', 'so they are not parallel'),
      L('alomat IKKI kesishuvchi chiziqni talab qiladi', 'признак требует ДВЕ пересекающиеся прямые', 'the criterion requires TWO intersecting lines'),
    ],
  ],
  motion: ['edge'],
  audio: [
    A('mount', 'Asos va yon yoqni olamiz. Ularda bir juft parallel chiziq topiladi.', 'Возьмём основание и боковую грань. Одна пара параллельных прямых в них найдётся.', 'Take the base and a side face. One pair of parallel lines will be found in them.'),
    A('edge', "Bu yoqlar birlashadigan qirraga qarang. Ularning umumiy chizig'i bor.", 'Смотри на ребро, по которому эти грани сходятся. Общая прямая у них есть.', 'Look at the edge where these faces come together. They do have a common line.'),
    A('work', 'Bir juftlik kam. Alomat ikki chiziqni ataydi, va ular kesishishi kerak.', 'Одной пары мало. Признак называет две прямые, и они должны пересекаться.', 'One pair is not enough. The criterion names two lines, and they must intersect.'),
  ],
  work: {
    prompt: L('ABCD va BCC₁B₁ yoqlarining nechta umumiy qirrasi bor?', 'Сколько общих рёбер у граней ABCD и BCC₁B₁?', 'How many edges do the faces ABCD and BCC₁B₁ share?'),
    ok: L("To'g'ri. Bitta -- BC qirrasi. Umumiy qirra umumiy chiziq degani, parallel tekisliklarning esa umumiy nuqtasi yo'q.", 'Верно. Одно, это ребро BC. Общее ребро значит общая прямая, а параллельные плоскости общих точек не имеют.', 'Correct. One: the edge BC. A shared edge means a shared line, and parallel planes have no common points.'),
    hint: [
      L('Ikkala yoqqa ham tegishli qirrani toping.', 'Найди ребро, которое принадлежит обеим граням.', 'Find the edge belonging to both faces.'),
      L("Ikkala yoq ham B va C uchlarini o'z ichiga oladi.", 'Обе грани содержат вершины B и C.', 'Both faces contain the vertices B and C.'),
      L('Demak umumiy qirra bitta, bu BC.', 'Значит общее ребро одно, это BC.', 'So there is one shared edge, and it is BC.'),
    ],
    answer: '1',
  },
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('IKKI KESISHUVCHI', 'ДВЕ ПЕРЕСЕКАЮЩИЕСЯ', 'TWO INTERSECTING'),
  title: L('Chiziqlar kesishishi kerak', 'Прямые должны пересекаться', 'The lines have to intersect'),
  tag: 'pryamye-ne-peresekayutsya',
  show: [
    [
      L('Asosda AB va AD ni olamiz', 'В основании берём AB и AD', 'In the base we take AB and AD'),
      L('ular A uchida kesishadi', 'они пересекаются в вершине A', 'they intersect at the vertex A'),
      L("va ikki xil yo'nalish beradi", 'и задают два разных направления', 'and they set two different directions'),
    ],
    [
      L('Yuqori yoqda ularga A₁B₁ va A₁D₁ mos keladi', 'В верхней грани им отвечают A₁B₁ и A₁D₁', 'in the top face A₁B₁ and A₁D₁ answer to them'),
      L("har biri o'ziga mos bo'lganiga parallel", 'каждая параллельна своей', 'each is parallel to its own'),
      L("alomat bo'yicha tekisliklar parallel", 'по признаку плоскости параллельны', 'by the criterion the planes are parallel'),
    ],
  ],
  motion: ['pair'],
  audio: [
    A('mount', 'Endi alomat butunlay. Bir tekislikda ikki kesishuvchi chiziq.', 'Теперь признак целиком. В одной плоскости две пересекающиеся прямые.', 'Now the whole criterion. Two intersecting lines in one plane.'),
    A('pair', "Juftliklar qanday bo'yalishini kuzatib turing. Pastdagi har chiziqqa tepada o'zining mosi bor.", 'Смотри, как подсвечиваются пары. Каждой прямой снизу отвечает своя сверху.', 'Watch how the pairs light up. Each line below has its own counterpart above.'),
    A('work', "Ikki parallel chiziq kam bo'lardi: ular bitta yo'nalish beradi.", 'Двух параллельных прямых было бы мало: они задают одно направление.', 'Two parallel lines would not be enough: they set only one direction.'),
  ],
  work: {
    prompt: L('Alomatga nechta juft parallel chiziq kerak?', 'Сколько пар параллельных прямых нужно признаку?', 'How many pairs of parallel lines does the criterion need?'),
    ok: L("To'g'ri. Ikkita, va tekislik ichidagi chiziqlar kesishishi kerak.", 'Верно. Две, и прямые внутри плоскости должны пересекаться.', 'Correct. Two, and the lines inside the plane must intersect.'),
    hint: [
      L("Bo'yalishga qarang: nechta juftlik bo'yalgan?", 'Посмотри на подсветку: сколько пар подсвечено?', 'Look at the highlighting: how many pairs are lit?'),
      L("Bir juftlik o'tgan ekranda bo'ldi va yordam bermadi.", 'Одна пара уже была на прошлом экране и не помогла.', 'One pair was on the previous screen and did not help.'),
      L('Alomat ikki juftlikni ataydi.', 'Признак называет две пары.', 'The criterion names two pairs.'),
    ],
    answer: '2',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Yangi holatda alomat', 'Признак на новом случае', 'The criterion on a new case'),
  tag: 'odna-para-dostatochno',
  show: [
    [
      L("Kubning oltita yog'i bor", 'У куба шесть граней', 'A cube has six faces'),
      L("yoqlar uchta qarama-qarshi juftlikka bo'linadi", 'грани разбиваются на три пары противоположных', 'the faces split into three pairs of opposite ones'),
      L('juftlik ichida tekisliklar parallel', 'внутри пары плоскости параллельны', 'inside a pair the planes are parallel'),
    ],
    [
      L('Turli juftlikdagi har qanday ikki yoq', 'Любые две грани из разных пар', 'any two faces from different pairs'),
      L('umumiy qirraga ega va kesishadi', 'имеют общее ребро и пересекаются', 'share an edge and intersect'),
      L('darslikdagi parallelepipedda alomat shunday ishlaydi', 'так работает признак на параллелепипеде из учебника', 'that is how the criterion works on the textbook parallelepiped'),
    ],
  ],
  motion: ['faces'],
  audio: [
    A('mount', "Endi o'zingiz. Alomat o'sha, hol yangi.", 'Теперь сам. Признак тот же, случай новый.', 'Now on your own. The same criterion, a new case.'),
    A('faces', "Yoqlar juftlab ko'rib chiqiladi. Umumiy qirra qayerda borligini kuzatib turing.", 'Грани перебираются парами. Смотри, где есть общее ребро.', 'The faces are gone through in pairs. Watch where a common edge appears.'),
    A('work', "Umumiy nuqtasi umuman yo'q yoq juftliklarini sanang.", 'Считай пары граней, у которых общих точек нет вовсе.', 'Count the pairs of faces with no common point at all.'),
  ],
  work: {
    prompt: L("Kubning nechta juft parallel yog'i bor?", 'Сколько пар параллельных граней у куба?', 'How many pairs of parallel faces has a cube?'),
    ok: L("To'g'ri. Uch juftlik: pol va shift, va ikki juft qarama-qarshi devor.", 'Верно. Три пары: пол и потолок, и две пары противоположных стен.', 'Correct. Three pairs: the floor and the ceiling, and two pairs of opposite walls.'),
    hint: [
      L("Bir yoqni oling va u bilan umumiy qirrasi yo'q yoqni toping.", 'Возьми грань и найди ту, что не имеет с ней общего ребра.', 'Take a face and find the one with no common edge with it.'),
      L('Har yoqda bunday yoq aynan bitta.', 'У каждой грани такая ровно одна.', 'Each face has exactly one such face.'),
      L("Oltita yoq juftlikka bo'linadi: ular uchta.", 'Шесть граней делятся на пары: их три.', 'Six faces split into pairs: there are three.'),
    ],
    answer: '3',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE EDGE'),
  title: L('Tekisliklar parallel, chiziqlar shart emas', 'Плоскости параллельны — прямые не обязательно', 'The planes are parallel, the lines need not be'),
  tag: 'ploskosti-parallelny-vsem',
  show: [
    [
      L('Asoslar parallel, bu isbotlangan', 'Основания параллельны, это уже доказано', 'The bases are parallel, that is already proved'),
      L('ularda ikki chiziq olingan: pastda AB, tepada A₁D₁', 'в них взяты две прямые: AB снизу и A₁D₁ сверху', 'two lines are taken in them: AB below and A₁D₁ above'),
      L('ular bir-biriga parallelmi', 'параллельны ли они друг другу', 'are they parallel to each other'),
    ],
    [
      L("Bu juftlikning umumiy tekisligi yo'q", 'Общей плоскости у этой пары нет', 'this pair has no common plane'),
      L('demak ular ayqash, parallel emas', 'значит они скрещиваются, а не параллельны', 'so they are skew, not parallel'),
      L('tekisliklar parallelligi buni taqiqlamaydi', 'параллельность плоскостей этого не запрещает', 'the parallelism of the planes does not forbid it'),
    ],
  ],
  motion: ['skew'],
  audio: [
    A('mount', "Tekisliklar parallel. Bu birining har chizig'i ikkinchisining har chizig'iga parallel degani emas.", 'Плоскости параллельны. Это не значит, что любая прямая одной параллельна любой прямой другой.', 'The planes are parallel. That does not mean any line of one is parallel to any line of the other.'),
    A('skew', "Bo'yalgan juftlikka qarang. Ular uchun umumiy tekislik o'tkazilmaydi.", 'Смотри на подсвеченную пару. Общая плоскость для них не проводится.', 'Look at the highlighted pair. No common plane can be drawn for them.'),
    A('work', "Yuqori yoqning nechta chizig'i pastdagi AB qirrasiga parallel ekanini hisoblang.", 'Посчитай, сколько прямых верхней грани параллельны нижнему ребру AB.', 'Count how many lines of the top face are parallel to the bottom edge AB.'),
  ],
  work: {
    prompt: L('Yuqori yoqning nechta qirrasi AB qirrasiga parallel?', 'Сколько рёбер верхней грани параллельны ребру AB?', 'How many edges of the top face are parallel to the edge AB?'),
    ok: L("To'g'ri. Ikkita: A₁B₁ va D₁C₁. Qolgan ikkitasi u bilan ayqash.", 'Верно. Два: A₁B₁ и D₁C₁. Другие два с ним скрещиваются.', 'Correct. Two: A₁B₁ and D₁C₁. The other two are skew to it.'),
    hint: [
      L("Yuqori yoqning o'sha yo'nalishdagi qirralarini toping.", 'Найди рёбра верхней грани того же направления.', 'Find the top edges of the same direction.'),
      L("Ikki qirra bo'ylab, ikkitasi ko'ndalang.", 'Два ребра идут вдоль, два поперёк.', 'Two edges run along, two across.'),
      L("Bo'ylab A₁B₁ va D₁C₁ boradi.", 'Вдоль идут A₁B₁ и D₁C₁.', 'Along run A₁B₁ and D₁C₁.'),
    ],
    answer: '2',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  title: L("Ta'rif va alomat", 'Определение и признак', 'The definition and the criterion'),
  tag: 'pryamye-ne-peresekayutsya',
  motion: ['rule'],
  audio: [
    A('mount', 'Kartochkani ochishdan oldin bitta savolga javob bering.', 'Прежде чем открыть карточку, ответь на один вопрос.', 'Before the card opens, answer one question.'),
    A('rule', "Kartochka darslik so'zlari bilan gapiradi. Alomatda ikki talab bor, ikkinchisi kesishish haqida.", 'Карточка говорит словами учебника. В признаке два требования, и второе про пересечение.', 'The card speaks in the words of the textbook. The criterion has two demands, and the second is about intersecting.'),
  ],
  probe: {
    question: L("Tekislikdagi ikki chiziq qanday bo'lishi kerak?", 'Какими должны быть две прямые в плоскости?', 'What must the two lines in the plane be?'),
    items: [
      { id: 'a', label: L('kesishuvchi', 'пересекающимися', 'intersecting'), correct: true },
      { id: 'b', label: L('parallel', 'параллельными', 'parallel'), hint: L("Ikki parallel bitta yo'nalish beradi, va tekislik uning atrofida hali buriladi.", 'Две параллельные задают одно направление, и плоскость вокруг него ещё поворачивается.', 'Two parallel lines set one direction, and the plane still turns around it.') },
    ],
  },
  rule: {
    lawLabel: L('Ikki tekislik', 'Две плоскости', 'Two planes'),
    lines: [
      L('103-bet. Kesishmaydigan tekisliklar parallel tekisliklar deb ataladi.', 'Стр. 103. Не пересекающиеся плоскости называются параллельными.', 'Page 103. Planes that do not intersect are called parallel.'),
      L("103-bet, 3.7-teorema. Bir tekislikdagi kesishuvchi ikki chiziq ikkinchisidagi ikki chiziqqa parallel bo'lsa, tekisliklar parallel.", 'Стр. 103, теорема 3.7. Две пересекающиеся прямые одной плоскости параллельны двум прямым другой — плоскости параллельны.', 'Page 103, theorem 3.7. Two intersecting lines of one plane parallel to two lines of the other make the planes parallel.'),
      L('103-bet. Xonaning poli va shifti, qarama-qarshi devorlar -- darslik misollari.', 'Стр. 103. Пол и потолок комнаты, противоположные стены — примеры учебника.', 'Page 103. The floor and ceiling of a room, opposite walls: the textbook examples.'),
    ],
    law: 'a ∩ b = A,   a ∥ a₁,   b ∥ b₁   ⇒   α ∥ β',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L("TO'RT JUFTLIK", 'ЧЕТЫРЕ ПАРЫ', 'FOUR PAIRS'),
  title: L("Yoq juftligini o'z holi bilan biriktiring", 'Соедини пару граней с её случаем', 'Match each pair of faces with its case'),
  tag: 'ploskost-po-chertezhu',
  audio: [
    A('mount', "Bitta kubning to'rt juft yog'i. Umumiy qirrani izlang.", 'Четыре пары граней одного куба. Ищи общее ребро.', 'Four pairs of faces of one cube. Look for a common edge.'),
  ],
  match: {
    prompt: L('Bitta kubning yoq juftliklari', 'Пары граней одного куба', 'Pairs of faces of one cube'),
    a: L('parallel', 'параллельны', 'parallel'),
    b: L("BC bo'ylab kesishadi", 'пересекаются по BC', 'meet along BC'),
    c: L("AA₁ bo'ylab kesishadi", 'пересекаются по AA₁', 'meet along AA₁'),
    d: L('bu bir xil tekislik', 'это одна и та же плоскость', 'this is one and the same plane'),
    ok: L("To'rttasi ham to'g'ri. Umumiy qirra savolga darrov javob beradi.", 'Все четыре верно. Общее ребро сразу отвечает на вопрос.', 'All four correct. A shared edge answers the question at once.'),
    left: ['ABCD, A₁B₁C₁D₁', 'ABCD, BCC₁B₁', 'ABB₁A₁, ADD₁A₁', 'ABCD, ABC'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('QADAMLAB', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L("Alomat bo'yicha isbotlang", 'Докажи по признаку', 'Prove it by the criterion'),
  tag: 'pryamye-ne-peresekayutsya',
  audio: [
    A('mount', 'Kubning asoslari parallel ekanini isbotlaymiz. Alomat ikki kesishuvchi chiziqni ataydi.', 'Докажем, что основания куба параллельны. Признак называет две пересекающиеся прямые.', 'Let us prove the bases of the cube are parallel. The criterion names two intersecting lines.'),
  ],
  order: {
    prompt: L('Tartib bilan joylashtiring', 'Расставь по порядку', 'Put them in order'),
    s1: L('asosda ikki kesishuvchi chiziq olamiz', 'в основании берём две пересекающиеся прямые', 'in the base we take two intersecting lines'),
    s2: L('har biriga yuqori yoqda parallel topamiz', 'каждой находим параллельную в верхней грани', 'for each we find a parallel one in the top face'),
    s3: L("alomat bo'yicha tekisliklar parallel", 'по признаку плоскости параллельны', 'by the criterion the planes are parallel'),
    ok: L("To'g'ri. Avval kesishuvchi chiziqlar, keyin juftliklari, keyin xulosa.", 'Верно. Сначала пересекающиеся прямые, потом их пары, и только потом вывод.', 'Correct. First the intersecting lines, then their pairs, and only then the conclusion.'),
    bad: L('Tartib boshqacha. Juftliklar chiziqlar tanlangandan keyin izlanadi.', 'Порядок другой. Пары ищутся уже после того, как выбраны прямые.', 'The order is different. The pairs are looked for after the lines are chosen.'),
    mark: 'ABCD ∥ A₁B₁C₁D₁',
  },
  expr: ['ABCD', 'A₁B₁C₁D₁'],
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L("QOG'OZDA", 'НА БУМАГЕ', 'ON PAPER'),
  title: L('Asbobsiz', 'Без прибора', 'No instrument'),
  tag: 'bumaga',
  audio: [
    A('mount', "Bu yerda asbob yo'q. Avval yozuvlar tartibi, keyin javob.", 'Прибора здесь нет. Сначала порядок записей, потом ответ.', 'There is no instrument here. First the order of the lines, then the answer.'),
    A('next', "Endi masalaning o'zi. Sonni yozing.", 'Теперь сама задача. Пиши число.', 'Now the task itself. Write the number.'),
  ],
  order: {
    prompt: L("Yozuvlarni isbotda paydo bo'lish tartibida joylashtiring", 'Расставь записи в том порядке, в каком они появляются в доказательстве', 'Put the lines in the order they appear in the proof'),
    title: L('Yozuvlar tartibi', 'Порядок записей', 'The order of the lines'),
    ok: L("To'g'ri. Shartlar tepada, xulosa pastda.", 'Верно. Условия сверху, вывод внизу.', 'Correct. The conditions on top, the conclusion below.'),
    bad: L("Tartib to'g'ri emas. Xulosa oxirida yoziladi.", 'Не тот порядок. Вывод пишется последним.', 'Wrong order. The conclusion is written last.'),
    items: ['AB ∩ AD = A', 'AB ∥ A₁B₁', 'AD ∥ A₁D₁', 'ABCD ∥ A₁B₁C₁D₁'],
    answer: 'AB ∩ AD = A  AB ∥ A₁B₁  AD ∥ A₁D₁  ABCD ∥ A₁B₁C₁D₁',
  },
  task: {
    prompt: L("Kubning nechta yog'i ABCD tekisligini kesib o'tadi?", 'Сколько граней куба пересекают плоскость ABCD?', 'How many faces of the cube meet the plane ABCD?'),
    ok: L("To'g'ri. To'rt yon yoq, har biri asosning o'z qirrasi bo'ylab.", 'Верно. Четыре боковых грани, каждая по своему ребру основания.', 'Correct. The four side faces, each along its own base edge.'),
    hint: [
      L("Asosning o'zini sanamaymiz: bu o'sha tekislik.", 'Само основание не считаем: это та же плоскость.', 'We do not count the base itself: it is the same plane.'),
      L('Yuqori yoq asosga parallel.', 'Верхняя грань основанию параллельна.', 'The top face is parallel to the base.'),
      L("Yon yoqlar qoladi, ular to'rtta.", 'Остаются боковые, их четыре.', 'The side faces remain, and there are four.'),
    ],
    answer: '4',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L("Hamma qadam to'g'ri, xulosa noto'g'ri", 'Все шаги верны, вывод неверен', 'Every step is right, the conclusion is wrong'),
  tag: 'check',
  audio: [
    A('mount', "Isbot to'rt satrda yozilgan. Xato paydo bo'lgan satrni toping.", 'Доказательство выписано в четыре строки. Найди ту, где появилась ошибка.', 'The proof is written in four lines. Find the one where the mistake appeared.'),
    A('next', 'Endi alomat talab qilgan sonni yozing.', 'Теперь запиши число, которое требует признак.', 'Now write the number the criterion requires.'),
  ],
  hint: {
    r1: L("To'g'ri: bu ikki qirra haqiqatan parallel.", 'Верно: эти два ребра действительно параллельны.', 'Correct: these two edges really are parallel.'),
    r2: L("To'g'ri: har biri o'z yog'ida yotadi.", 'Верно: каждое лежит в своей грани.', 'Correct: each lies in its own face.'),
    r3: L("Bu ham to'g'ri, juftlik halol topilgan.", 'Тоже верно, пара найдена честно.', 'Also correct, the pair was found honestly.'),
  },
  proof: L('Xato oxirgi satrda. Alomatga IKKI kesishuvchi chiziq kerak, topilgani esa bir juftlik.', 'Ошибка в последней строке. Признаку нужны ДВЕ пересекающиеся прямые, а найдена одна пара.', 'The mistake is in the last line. The criterion needs TWO intersecting lines, and only one pair was found.'),
  entry: {
    prompt: L('Alomat nechta juft parallel chiziqni talab qiladi?', 'Сколько пар параллельных прямых требует признак?', 'How many pairs of parallel lines does the criterion require?'),
    ok: L("To'g'ri. Ikkita, va tekislik ichidagi chiziqlar kesishishi kerak.", 'Верно. Две, и прямые внутри плоскости должны пересекаться.', 'Correct. Two, and the lines inside the plane must intersect.'),
    hint: [
      L('Qoida kartochkasiga qarang.', 'Посмотри на карточку правила.', 'Look at the rule card.'),
      L("Bir juftlik kam: bu to'rtinchi ekranda bo'ldi.", 'Одной пары мало: это было на экране четыре.', 'One pair is not enough: that was on screen four.'),
      L('Alomat har tekislikda ikki chiziqni ataydi.', 'Признак называет две прямые в каждой плоскости.', 'The criterion names two lines in each plane.'),
    ],
    answer: '2',
  },
  row: {
    r1: 'AD ∥ B₁C₁',
    r2: 'AD ⊂ ABCD,   B₁C₁ ⊂ BCC₁B₁',
    r3: 'AD ∥ B₁C₁ — ✔',
    r4: 'ABCD ∥ BCC₁B₁',
  },
  answerId: 'r4',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE REVERSE TASK'),
  title: L('Endi siz izlaysiz', 'Теперь ищешь ты', 'Now you do the searching'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Bungacha juftliklarni sizga berardilar. Endi yoqlarni o'zingiz ko'rib chiqasiz.", 'До этого пары давали тебе. Теперь перебираешь грани сам.', 'Until now the pairs were given to you. Now you go through the faces yourself.'),
    A('work', "E'tibor bering: oltita yoqda aynan uch parallel juftlik bor, va bu yig'indi bilan tekshiruv.", 'Обрати внимание: у шести граней ровно три параллельных пары, и это проверка суммой.', 'Notice: six faces give exactly three parallel pairs, and that is a check by the sum.'),
  ],
  multi: {
    prompt: L("Parallel bo'lgan hamma yoq juftligini belgilang", 'Отметь все пары граней, которые параллельны', 'Mark every pair of faces that are parallel'),
    title: L("To'rttadan ikkitasi", 'Две из четырёх', 'Two out of four'),
    ok: L("To'g'ri. Umumiy qirrasi yo'q juftliklar parallel.", 'Верно. Параллельны те пары, у которых общего ребра нет.', 'Correct. Parallel are the pairs with no common edge.'),
    items: [
      { id: 'c', label: 'ABCD, BCC₁B₁', hint: L('Bu yoqlarning umumiy BC qirrasi bor, demak ular kesishadi.', 'У этих граней общее ребро BC, значит они пересекаются.', 'These faces share the edge BC, so they intersect.') },
      { id: 'd', label: 'ABB₁A₁, ADD₁A₁', hint: L('Bularning umumiy AA₁ qirrasi bor.', 'У этих общее ребро AA₁.', 'These share the edge AA₁.') },
      { id: 'a', label: 'ABCD, A₁B₁C₁D₁', ok: true },
      { id: 'b', label: 'ABB₁A₁, DCC₁D₁', ok: true },
    ],
  },
  entry: {
    prompt: L("Kubning nechta yog'i ABCD yog'iga parallel?", 'Сколько граней куба параллельны грани ABCD?', 'How many faces of the cube are parallel to the face ABCD?'),
    ok: L("To'g'ri. Bitta: har yoqda parallel yoq aynan bitta.", 'Верно. Одна: у каждой грани параллельная ровно одна.', 'Correct. One: each face has exactly one parallel face.'),
    hint: [
      L("Parallel yoqning berilgani bilan umumiy qirrasi yo'q.", 'Параллельная грань не имеет с данной общего ребра.', 'A parallel face has no common edge with the given one.'),
      L("To'rt yon yoqning umumiy qirrasi bor.", 'Четыре боковых грани общее ребро имеют.', 'The four side faces do have a common edge.'),
      L('Yuqori yoq qoladi, u bitta.', 'Остаётся верхняя грань, она одна.', 'The top face remains, and it is the only one.'),
    ],
    expr: 'ABCD',
    answer: '1',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'THE BLITZ'),
  title: L("Ketma-ket to'rtta savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'odna-para-dostatochno',
  audio: [
    A('mount', "To'rtta savol, va ular baholanadi.", 'Четыре вопроса, и они идут в оценку.', 'Four questions, and they count towards the score.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Ikki tekislik parallel. Ularning nechta umumiy nuqtasi bor?', 'Две плоскости параллельны. Сколько у них общих точек?', 'Two planes are parallel. How many common points have they?'),
      done: L("Birorta ham yo'q. Bu ta'rif.", 'Ни одной. Это определение.', 'None. That is the definition.'),
      items: [
        { id: 'a', label: L("birorta ham yo'q", 'ни одной', 'none'), correct: true },
        { id: 'b', label: L('bitta', 'одна', 'one'), hint: L('Bitta umumiy nuqta butun chiziqni ergashtiradi, bu aksioma.', 'Одна общая точка тянет за собой целую прямую, это аксиома.', 'One common point drags a whole line behind it; that is the axiom.') },
        { id: 'c', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p kesishuvchilarda: ularning umumiy chizig'i bor.", 'Бесконечно много у пересекающихся: у них общая прямая.', 'Infinitely many belongs to intersecting ones: they share a line.') },
        { id: 'd', label: L("rakursga bog'liq", 'зависит от ракурса', 'it depends on the angle'), hint: L("Rakurs chizmani o'zgartiradi, sahnani emas.", 'Ракурс меняет чертёж, а не сцену.', 'The angle changes the drawing, not the scene.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Alomatga kerak bo'lgan chiziqlar...", 'Признаку нужны прямые…', 'The criterion needs lines that are...'),
      done: L("Ikki kesishuvchi, va bu alomatning asosiy so'zi.", 'Две пересекающиеся, и это главное слово признака.', 'Two intersecting, and that is the key word of the criterion.'),
      items: [
        { id: 'a', label: L('har tekislikda ikki kesishuvchi', 'две пересекающиеся в каждой плоскости', 'two intersecting in each plane'), correct: true },
        { id: 'b', label: L('har tekislikda bitta', 'одна в каждой плоскости', 'one in each plane'), hint: L("Bir juftlik kam: to'rtinchi ekranda tekisliklar kesishardi.", 'Одной пары мало: на экране четыре плоскости пересекались.', 'One pair is not enough: on screen four the planes did intersect.') },
        { id: 'c', label: L('har birida ikki parallel', 'две параллельные в каждой', 'two parallel in each'), hint: L("Ikki parallel bitta yo'nalish beradi, ikkinchisi yo'q.", 'Две параллельные дают одно направление, второго нет.', 'Two parallel lines give one direction, the second is missing.') },
        { id: 'd', label: L("tekislikning hamma chizig'i", 'все прямые плоскости', 'all lines of the plane'), hint: L('Bunchasini tekshirish shart emas: ikki kesishuvchi yetadi.', 'Столько проверять не надо: двух пересекающихся достаточно.', 'There is no need to check that many: two intersecting ones suffice.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Tekisliklar parallel. Birining chizig'i va ikkinchisining chizig'i...", 'Плоскости параллельны. Прямая одной и прямая другой…', 'The planes are parallel. A line of one and a line of the other...'),
      done: L("Ayqash bo'lishi mumkin. Tekisliklar parallel, chiziqlar emas.", 'Могут скрещиваться. Плоскости параллельны, прямые нет.', 'They may be skew. The planes are parallel, the lines are not.'),
      items: [
        { id: 'a', label: L("ayqash bo'lishi mumkin", 'могут скрещиваться', 'may be skew'), correct: true, ok: L('Ha: tekisliklar parallelligi tekisliklar haqida, har juft chiziq haqida emas.', 'Да: параллельность плоскостей про плоскости, а не про каждую пару прямых.', 'Yes: parallel planes are about the planes, not about every pair of lines.') },
        { id: 'b', label: L('doim parallel', 'всегда параллельны', 'are always parallel'), hint: L('Kubda tekshiring: AB va A₁D₁ ayqash.', 'Проверь на кубе: AB и A₁D₁ скрещиваются.', 'Check on the cube: AB and A₁D₁ are skew.') },
        { id: 'c', label: L('doim kesishadi', 'всегда пересекаются', 'always intersect'), hint: L("Ular kesishishi mumkin emas: tekisliklarning umumiy nuqtasi yo'q.", 'Пересечься они не могут: плоскости общих точек не имеют.', 'They cannot intersect: the planes share no point.') },
        { id: 'd', label: L('doim perpendikulyar', 'всегда перпендикулярны', 'are always perpendicular'), hint: L("Perpendikulyarlikning bunga aloqasi yo'q.", 'Перпендикулярность тут ни при чём.', 'Perpendicularity has nothing to do with it.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Kubning nechta juft parallel yog'i bor?", 'Сколько пар параллельных граней у куба?', 'How many pairs of parallel faces has a cube?'),
      done: L("Uch juftlik: oltita yoq teng bo'linadi.", 'Три пары: шесть граней делятся пополам.', 'Three pairs: six faces split in half.'),
      items: [
        { id: 'a', label: L('uchta', 'три', 'three'), correct: true },
        { id: 'b', label: L('oltita', 'шесть', 'six'), hint: L('Olti bu yoqlar soni, juftliklar esa ikki barobar kam.', 'Шесть это число граней, а пар вдвое меньше.', 'Six is the number of faces, and pairs are half that.') },
        { id: 'c', label: L('ikkita', 'две', 'two'), hint: L('Pol bilan shift va ikki juft devor: allaqachon uchta.', 'Пол с потолком и две пары стен: уже три.', 'The floor with the ceiling and two pairs of walls: already three.') },
        { id: 'd', label: L("o'n ikkita", 'двенадцать', 'twelve'), hint: L("O'n ikki bu qirralar, yoq juftliklari emas.", 'Двенадцать это рёбра, а не пары граней.', 'Twelve is the edges, not the pairs of faces.') },
      ],
    },
  ],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('XULOSA', 'ИТОГ', 'THE SUMMARY'),
  title: L('Ikki kesishuvchi chiziq -- va tekisliklar parallel', 'Две пересекающиеся прямые — и плоскости параллельны', 'Two intersecting lines, and the planes are parallel'),
  audio: [
    A('mount', 'Birinchi ekrandagi taxmin va natija yonma-yon turadi.', 'Прогноз с первого экрана и результат стоят рядом.', 'The guess from screen one and the result stand side by side.'),
    A('next', "Shpargalka darslik bo'yicha yig'ilgan. Pastda nimani bilishingiz ko'rinadi.", 'Шпаргалка собрана по учебнику. Ниже видно, что умеешь.', 'The sheet is put together from the textbook. Below you can see what you can do.'),
  ],
  can: [
    L('Kesishuvchi va parallel tekisliklarni ajrataman', 'Различаю пересекающиеся и параллельные плоскости', 'I tell intersecting planes from parallel ones'),
    L("Alomatni qo'llaman va aynan kesishuvchi chiziqlarni olaman", 'Применяю признак и беру именно пересекающиеся прямые', 'I apply the criterion and take intersecting lines'),
    L('Bir juft parallel chiziq kam ekanini bilaman', 'Знаю, что одной пары параллельных прямых мало', 'I know one pair of parallel lines is not enough'),
    L('Tekisliklar parallelligini ularning chiziqlari parallelligi bilan chalkashtirmayman', 'Не путаю параллельность плоскостей с параллельностью их прямых', 'I do not confuse parallel planes with parallel lines in them'),
  ],
  levels: {
    full: L("Hammasidan o'tdingiz va tuzoqni ochdingiz", 'Прошёл всё и разобрал ловушку', 'Everything done, the trap taken apart'),
    gap: L('Alomat ishlaydi, ayqash juftliklar hali chalkashadi', 'Признак работает, скрещивающиеся пары ещё путаются', 'The criterion works, skew pairs still get mixed up'),
    back: L("To'rtinchi ekranga qaytish kerak: bir juftlik kam", 'Стоит вернуться к экрану четыре: одной пары мало', 'Worth going back to screen four: one pair is not enough'),
  },
  bridge: L("Keyingisi parallel proyeksiyalash: unda chizmada parallellar nega parallel qolib, to'g'ri burchak nega qolmasligini ko'rasiz.", 'Дальше параллельное проецирование: там видно, почему на чертеже параллельные остаются параллельными, а прямой угол нет.', 'Next comes parallel projection: there you see why parallel lines stay parallel on a drawing and a right angle does not.'),
  lifehack: L("Yoq juftliklarini umumiy qirra bo'yicha tekshirish qulay: umumiy qirra bor -- kesishadi, yo'q -- parallel. Kubning olti yog'ida aynan uch parallel juftlik bor.", 'Проверять пары граней удобно по общему ребру: есть общее ребро — пересекаются, нет — параллельны. У шести граней куба ровно три параллельных пары.', 'Checking pairs of faces by the shared edge is handy: a shared edge means they intersect, no edge means parallel. Six faces of a cube give exactly three parallel pairs.'),
  sheetTitle: L('Dars shpargalkasi', 'Шпаргалка урока', 'The lesson sheet'),
  sheetSrc: L('geometriya 2022, 103-bet', 'геометрия 2022, стр. 103', 'geometry 2022, page 103'),
  hook: {
    a: '1',
    b: '0',
  },
  proved: '0',
  law: 'a ∩ b = A,   a ∥ a₁,   b ∥ b₁   ⇒   α ∥ β',
  sheet: [
    'α ∩ β = ∅   ⇒   α ∥ β',
    'AB ∩ AD = A',
    'AB ∥ A₁B₁,   AD ∥ A₁D₁',
    'ABCD ∥ A₁B₁C₁D₁',
    '6 = 3 + 3',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/−/g, '-'))

// SAHNA BITTA -- kub. Tekisliklar YOQLAR bilan olinadi: ikki asos parallel,
// asos va yon yoq esa BC qirrasi bo'ylab kesishadi. Aldov proyeksiyada:
// yoqlarning chetlari ekranda mos tushib, umumiy chiziq bordek ko'rinadi.
// IKKI TEKISLIK -- KUBNING YOQLARI. Parallel juftlik: ikki asos. Kesishuvchi
// juftlik: asos va yon yoq, ular BC qirrasi bo'ylab kesishadi.
const TWO_BASES = [
  { by: ['A', 'B', 'C'], dim: true },
  { by: ['A1', 'B1', 'C1'], dim: true },
]
const CROSS_FACES = [
  { by: ['A', 'B', 'C'], dim: true },
  { by: ['B', 'C', 'C1'], dim: true },
]
// Alomatning ikki juftligi: pastda kesishuvchi AB va AD, tepada ularga mos
// A1B1 va A1D1.
const CRIT_PAIRS = ['AB', 'AD', 'A1B1', 'A1D1']
// Bir juftlik: AD va B1C1 parallel, lekin tekisliklar kesishadi.
const ONE_PAIR = ['AD', 'B1C1']
// Parallel tekisliklardagi AYQASH juftlik.
const SKEW_PAIR = ['AB', 'A1D1']

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const CASE_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const CASE_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

// UCHTA QADAM: to'rtta slot noutbukning 615 px iga sig'maydi (25 va 8-darsda
// o'lchangan). Alomatning ikki sharti va xulosa -- uchtasi yetadi.
const ORD10 = ['s1', 's2', 's3'].map((id) => ({ id, label: S10.order[id] }))
const ORD11 = S11.order.items.map((label, i) => ({ id: 'o' + i, label }))
const ORD11_ANS = String(S11.order.answer).split(/\s{2,}/)
  .map((lbl) => (ORD11.find((x) => x.label === lbl.trim()) || {}).id)

const TRAP_ROWS = ['r1', 'r2', 'r3', 'r4'].map((id) => ({ id, text: S12.row[id] }))

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Rakurs SINFNING odatdagisi, va aynan unda chiziq bo'yalgan yoqning
        // ustidan o'tgandek ko'rinadi: prognoz shu aldov ustida qilinadi.
        fig={() => (
          <Scene fig={<Space step={1} yaw={0.4} cube planes={TWO_BASES} />} max={172} h={172} />
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
          {/* Telefonda ustunlar bir-birining ostiga tushadi: balandlik qat'iy. */}
          <Scene fig={<Space step={1} yaw={0.4} cube planes={TWO_BASES} />} max={240} h={158} />
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
      <Scene
        fig={<Space step={1} cube planes={TWO_BASES} yaw={phase === 0 ? 0.4 : 1.6} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      /* DARSNING SHOHIDI. Buradigan o'quvchi: u burmaguncha «yoq ustidan
         o'tadi» va «yoqdan baland o'tadi» ekranda bir xil ko'rinadi. */
      <SpinScene
        yaw0={0.4}
        stepYaw={0.6}
        scene={<Space step={1} cube planes={TWO_BASES} />}
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
      /* 1-kadr: alomat TO'G'RI ishlagan holat. 2-kadr: O'SHA mantiq asos
         chizig'iga qo'llanadi va yolg'on xulosa beradi. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} cube
            hi={ONE_PAIR}
            planes={phase === 0 ? CROSS_FACES : CROSS_FACES}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Space step={1} yaw={0.4} cube hi={ONE_PAIR} planes={CROSS_FACES} />} max={280} /></Col>
        <Col>
          <NumberEntry
            compact
            prompt={S4.work.prompt}
            answer={num(S4.work.answer)}
            okText={S4.work.ok}
            hints={S4.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      /* 1-kadr: parallel juftlik. 2-kadr: AYQASH juftlik -- o'sha chiziq va
         o'sha tekislik, lekin boshqa chiziq tanlangan. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} cube
            hi={phase === 0 ? ['AB', 'AD'] : CRIT_PAIRS}
            planes={TWO_BASES}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.4}
        stepYaw={0.6}
        scene={<Space step={1} cube hi={CRIT_PAIRS} planes={TWO_BASES} />}
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
      /* Yoqlar navbat bilan: 1-kadr -- chiziqni O'Z ICHIGA OLGAN yoq,
         2-kadr -- uni KESIB O'TADIGAN yoq. Alomat ikkalasida ham ishlamaydi. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} cube
            planes={phase === 0 ? TWO_BASES : CROSS_FACES}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Space step={1} yaw={0.4} cube planes={TWO_BASES} />} max={280} /></Col>
        <Col>
          <NumberEntry
            compact
            prompt={S6.work.prompt}
            answer={num(S6.work.answer)}
            okText={S6.work.ok}
            hints={S6.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen7 = (p) => (
  <Screen data={S7} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S7.show.length && !solved ? (
      /* Uch hol ketma-ket: kesib o'tuvchi chiziq, keyin yotgan va parallel
         yonma-yon. Farq bitta sonda -- umumiy nuqtalar sonida. */
      <Scene
        fig={(
          <Space
            step={1} yaw={0.4} cube
            hi={phase === 0 ? ['AB', 'A1B1'] : SKEW_PAIR}
            planes={TWO_BASES}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Space step={1} yaw={0.4} cube planes={TWO_BASES} />} max={280} /></Col>
        <Col>
          <NumberEntry
            compact
            prompt={S7.work.prompt}
            answer={num(S7.work.answer)}
            okText={S7.work.ok}
            hints={S7.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen8 = (p) => (
  <Screen data={S8} waitFor={['rule']} {...p}>
    {(s) => (
      <RuleBody
        {...s}
        data={S8}
        // Parallel juftlik javob paytida ochiladi: qoida uni tug'dirgan
        // harakat yonida turadi.
        fig={(solved) => (
          <Scene
            fig={<Space step={1} yaw={0.4} cube hi={solved ? CRIT_PAIRS : []} planes={TWO_BASES} />}
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
        left={CASE_LEFT}
        right={CASE_RIGHT}
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
      <>
        {/* Yozuv KICHIK yarusda: ustida uchta slot va tugma turadi. */}
        <Expr size="sm" style={{ marginBottom: 2 }}>{S10.expr[0] + '  ∥  ' + S10.expr[1]}</Expr>
        <OrderRow
          prompt={S10.order.prompt}
          items={ORD10}
          answer={['s1', 's2', 's3']}
          okText={S10.order.ok}
          badText={S10.order.bad}
          audio={audio}
          onSolved={solve}
        />
      </>
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
      <NumberEntry
        prompt={S11.task.prompt}
        answer={num(S11.task.answer)}
        okText={S11.task.ok}
        hints={S11.task.hint}
        audio={audio}
        onSolved={() => setTimeout(() => { setTitle(S11.order.title); setStage(1) }, 1400)}
      />
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
          <Scene fig={<Space step={1} yaw={0.4} cube planes={TWO_BASES} />} max={260} h={190} />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S13.entry.prompt}
            answer={num(S13.entry.answer)}
            okText={S13.entry.ok}
            hints={S13.entry.hint}
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
            fig={<Space step={1} yaw={0.4} cube hi={round >= 2 ? SKEW_PAIR : CRIT_PAIRS} planes={TWO_BASES} />}
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
