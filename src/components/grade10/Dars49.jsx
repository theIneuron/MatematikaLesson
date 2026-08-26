// ============================================================================
// 10-sinf, Dars 49. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS49_KONTENT.md
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

import { Space } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 49
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Kesimlarni yasash`,
  `Урок ${LESSON_NO}. Построение сечений`,
  `Lesson ${LESSON_NO}. Building sections`,
)

const BLOCK = { label: 'B7', from: 44, to: 49, current: 49 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('KESIM', 'СЕЧЕНИЕ', 'THE SECTION'),
  title: L('Uch nuqta, nechta tomon', 'Три точки, сколько сторон', 'Three points, how many sides'),
  audio: [
    A('mount', "Kub, va uning uch qirrasida nuqtalar belgilangan. Ular orqali kesuvchi tekislik o'tadi.", 'Куб, и на трёх его рёбрах отмечены точки. Через них проходит секущая плоскость.', 'A cube, and points are marked on three of its edges. A cutting plane passes through them.'),
    A('r1', 'Birinchi yozuv tomonlar uchta deydi: nuqtalar bir biriga ulanib uchburchak chiqdi.', 'Первая запись говорит, что сторон три: точки соединили между собой и получили треугольник.', 'The first reading says there are three sides: the points were joined to each other and a triangle came out.'),
    A('r2', 'Ikkinchisi tomonlar beshta deydi.', 'Вторая говорит, что сторон пять.', 'The second says there are five sides.'),
    A('ask', "Nuqta uchta, demak tomon ham uchta, shunday ko'rinadi. Sizningcha qaysi yozuv to'g'ri?", 'Точек три, значит и сторон три, так кажется. Как думаешь, какая запись верная?', 'There are three points, so three sides, it seems. Which reading do you think is right?'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi kesimni yasaymiz.', 'Твой ответ записан. Сейчас построим сечение.', 'Your answer is recorded. Now we build the section.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('uchburchak', 'треугольник', 'a triangle'),
      value: '3',
    },
    b: {
      name: L('beshburchak', 'пятиугольник', 'a pentagon'),
      value: '5',
    },
  },
  expr: 'ABCDA₁B₁C₁D₁',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Blokdan uch savol', 'Три вопроса из блока', 'Three questions from the block'),
  tag: 'support',
  audio: [
    A('mount', "Uchta savol. Darsning qoidasi birinchi ikkitasidan yig'iladi.", 'Три вопроса. Правило урока соберётся из первых двух.', 'Three questions. The rule of the lesson will be assembled from the first two.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Jismning kesimi nima?', 'Что такое сечение тела?', 'What is a section of a body?'),
      done: 'KPMNH',
      items: [
        { id: 'a', label: L('kesuvchi tekislikda yotgan jism nuqtalaridan iborat shakl', 'фигура из точек тела, лежащих в секущей плоскости', 'the figure of the points of the body lying in the cutting plane'), correct: true },
        { id: 'b', label: L('jismni kesadigan tekislik', 'плоскость, которая режет тело', 'the plane that cuts the body'), hint: L('Tekislik kesadi, kesim esa chiqqan narsa.', 'Плоскость режет, а сечение это то, что получилось.', 'The plane cuts, and the section is what came out.') },
        { id: 'c', label: L("ikki yoqning kesishish chizig'i", 'линия пересечения двух граней', 'the line where two faces meet'), hint: L("Ikki yoqning kesishish chizig'i qirra.", 'Линия пересечения двух граней это ребро.', 'The line where two faces meet is an edge.') },
        { id: 'd', label: L('kesim yuzasi', 'площадь разреза', 'the area of the cut'), hint: L('Yuza shakl topilgandan keyin hisoblanadi.', 'Площадь считают после того, как фигура найдена.', 'The area is computed after the figure is found.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Kesim uchlari qayerda yotadi?', 'Где лежат вершины сечения?', 'Where do the vertices of a section lie?'),
      done: 'M ∈ A₁B₁',
      items: [
        { id: 'a', label: L('faqat qirralarda', 'только на рёбрах', 'only on the edges'), correct: true },
        { id: 'b', label: L('yoqlarning ichida', 'внутри граней', 'inside the faces'), hint: L('Yoq ichida tomonlar yotadi, uchlar emas.', 'Внутри грани лежат стороны, а не вершины.', 'The sides lie inside a face, not the vertices.') },
        { id: 'c', label: L('jism uchlarida', 'в вершинах тела', 'at the vertices of the body'), hint: L("Ba'zan mos tushadi, lekin qoida bo'yicha shart emas.", 'Иногда совпадают, но по правилу не обязаны.', 'Sometimes they coincide, but the rule does not require it.') },
        { id: 'd', label: L('kesuvchi tekislikning har qanday joyida', 'в любом месте секущей плоскости', 'anywhere in the cutting plane'), hint: L('Jismdan tashqaridagi nuqta kesimga kirmaydi.', 'Точка вне тела в сечение не входит.', 'A point outside the body is not in the section.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Kubning nechta yog'i bor?", 'Сколько граней у куба?', 'How many faces does a cube have?'),
      done: '6',
      items: [
        { id: 'a', label: L('oltita', 'шесть', 'six'), correct: true },
        { id: 'b', label: L('sakkizta', 'восемь', 'eight'), hint: L('Sakkiz uchlar soni.', 'Восемь это число вершин.', 'Eight is the number of vertices.') },
        { id: 'c', label: L("o'n ikkita", 'двенадцать', 'twelve'), hint: L("O'n ikki qirralar soni.", 'Двенадцать это число рёбер.', 'Twelve is the number of edges.') },
        { id: 'd', label: L("to'rtta", 'четыре', 'four'), hint: L("To'rt yoq uchburchakli piramidada.", 'Четыре грани у треугольной пирамиды.', 'Four faces belong to a triangular pyramid.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("To'rtinchi nuqta erkin emas", 'Четвёртая точка не свободна', 'The fourth point is not free'),
  tag: 'secheniye-ne-ploskoe',
  show: [
    [
      L("qirralarda to'rt nuqta", 'четыре точки на рёбрах', 'four points on the edges'),
      L("va hammasi yassi ko'rinadi", 'и всё выглядит плоским', 'and everything looks flat'),
    ],
    [
      L('bitta burilish', 'один поворот', 'one turn'),
      L("va to'rtburchak buzildi", 'и четырёхугольник сломался', 'and the quadrilateral broke'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Uch qirrada nuqtalar, va ularga to'rtinchisi qo'shildi. To'rttasini aylana bo'ylab ulaymiz.", 'На трёх рёбрах точки, и к ним добавлена четвёртая. Соединим все четыре по кругу.', 'There are points on three edges, and a fourth is added to them. Let us join all four in a cycle.'),
    A('move', "Bu rakursdan to'rtburchak butunlay oddiy, yassi ko'rinadi. Sahnani ixtiyoriy tomonga buraman, va u o'zini o'zi kesadi. Yassi shakl bunday tutolmaydi, demak shakl yassi emas. Sabab oddiy va u birinchi blokdan: tekislikni uch nuqta aniqlaydi. Birinchi uch nuqta uni allaqachon aniqlagan, keyin esa tanlov tugadi: qaysi qirralarni kesishini tekislikning o'zi hal qiladi. To'rtinchi nuqta bu tekislik umuman tegmaydigan qirrada olingan, va tekislikdan u qirraning yetti o'ndan qismi masofada turadi. Birinchi rakursda bunday xato umuman ko'rinmaydi.", 'С этого ракурса четырёхугольник выглядит совершенно обычным, плоским. Поворачиваю сцену в любую сторону, и он пересекает сам себя. Так плоская фигура вести себя не может, значит фигура не плоская. Причина простая и она из первого блока: плоскость задают три точки. Первые три точки её уже задали, а дальше выбор кончился: плоскость сама решает, какие рёбра она режет. Четвёртая точка взята на ребре, которого эта плоскость вообще не касается, и от плоскости она отстоит на семь десятых ребра. На первом ракурсе такая ошибка не видна совсем.', 'From this view the quadrilateral looks perfectly ordinary and flat. I rotate the scene either way and it crosses itself. A flat figure cannot behave like that, so the figure is not flat. The reason is simple and it comes from the first block: three points determine a plane. The first three points have already determined it, and after that the choosing is over: the plane itself decides which edges it cuts. The fourth point is taken on an edge that this plane does not touch at all, and it stands seven tenths of an edge away from the plane. At the first view such an error cannot be seen at all.'),
    A('work', "O'zingiz hisoblang. Nechta nuqta tekislikni aniqlaydi?", 'Посчитай сам. Сколько точек задают плоскость?', 'Work it out yourself. How many points determine a plane?'),
  ],
  work: {
    prompt: L('Nechta nuqta tekislikni aniqlaydi?', 'Сколько точек задают плоскость?', 'How many points determine a plane?'),
    ok: L("Uchta. To'rtinchisi tanlanmaydi, hisoblanadi.", 'Три. Четвёртая уже вычисляется, а не выбирается.', 'Three. The fourth one is computed, not chosen.'),
    hint: [
      L('Tekislik haqidagi birinchi blokni eslang.', 'Вспомни первый блок про плоскость.', 'Recall the first block about the plane.'),
      L("Ikki nuqta kam, ular to'g'ri chiziq beradi.", 'Двух точек мало, они дают прямую.', 'Two points are not enough, they give a line.'),
      L('Uchta.', 'Три.', 'Three.'),
    ],
    answer: '3',
  },
  expr: 'MNGK',
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Tomon yoqda yotadi', 'Сторона лежит в грани', 'A side lies in a face'),
  tag: 'gran-ne-storona',
  show: [
    [
      L('M va N nuqtalari ustki yoqning qirralarida', 'точки M и N на рёбрах верхней грани', 'the points M and N are on the edges of the top face'),
      L('ular orasidagi kesma unda yotadi', 'отрезок между ними лежит в ней', 'the segment between them lies in it'),
    ],
    [
      L("M va K da umumiy yoq yo'q", 'у M и K общей грани нет', 'M and K have no common face'),
      L("kesma jism ichidan o'tdi", 'отрезок пошёл сквозь тело', 'the segment went through the body'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Ustki yoq bo'yalgan. Ikki nuqta ham, M va N, uning qirralarida yotadi.", 'Верхняя грань закрашена. Обе точки, M и N, лежат на её рёбрах.', 'The top face is filled. Both points, M and N, lie on its edges.'),
    A('move', "Ular orasidagi kesma butunlay bo'yalgan yoqda, va burilish uni undan chiqarmaydi. Bu kesimning tomoni: kesuvchi tekislik yoq bilan to'g'ri chiziq bo'ylab uchrashadi, va yoq ichida shu chiziqdan kesma qoladi. Endi M va K ni ulashga harakat qilaman. Ikkisi yotgan yoqni qidiraman. M nuqta ustki va oldingi yoqda yotadi, K nuqta chap va orqa yoqda. Umumiy yoq bitta ham yo'q, va kesma jism ichiga ketadi. U kesimning tomoni bo'lolmaydi, chunki kesim sirt nuqtalaridan iborat, ichki nuqtalardan emas.", 'Отрезок между ними целиком в закрашенной грани, и поворот его оттуда не выпускает. Это и есть сторона сечения: секущая плоскость встречается с гранью по прямой, и внутри грани от этой прямой остаётся отрезок. Теперь попробую соединить M и K. Ищу грань, в которой лежат обе. Точка M лежит в верхней грани и в передней, точка K в левой и в задней. Общей грани нет ни одной, и отрезок уходит внутрь тела. Стороной сечения он быть не может, потому что сечение состоит из точек поверхности, а не из точек внутри.', 'The segment between them lies entirely in the filled face, and rotation never lets it out. That is what a side of a section is: the cutting plane meets a face along a line, and inside the face a segment of that line remains. Now let me try to join M and K. I look for a face in which both of them lie. The point M lies in the top face and in the front one, the point K in the left and in the back one. There is no common face at all, and the segment goes inside the body. It cannot be a side of the section, because a section consists of points of the surface, not of points inside.'),
    A('work', "O'zingiz hisoblang. Uch belgilangan nuqta bo'yicha darrov nechta tomon o'tkazish mumkin?", 'Посчитай сам. Сколько сторон можно провести сразу по трём отмеченным точкам?', 'Work it out yourself. How many sides can be drawn straight away through the three marked points?'),
  ],
  work: {
    prompt: L('Darrov nechta tomon?', 'Сколько сторон сразу?', 'How many sides straight away?'),
    ok: L('Bitta. Umumiy yoq faqat M va N da bor.', 'Одна. Общая грань есть только у M и N.', 'One. Only M and N have a common face.'),
    hint: [
      L('Uch juft nuqtani tekshiring.', 'Проверь все три пары точек.', 'Check all three pairs of points.'),
      L('Har juft uchun ikkisi yotgan yoqni qidiring.', 'Для каждой пары ищи грань, где лежат обе.', 'For each pair look for a face where both lie.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
  expr: 'MN ⊂ A₁B₁C₁D₁',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Iz jismdan tashqariga olib chiqadi', 'След выводит за тело', 'The trace leads outside the body'),
  tag: 'secheniye-ne-ploskoe',
  show: [
    [
      L('K va L bir yoqda, bu tomon', 'K и L в одной грани, это сторона', 'K and L are in one face, this is a side'),
      L('L va M boshqasida, bu ikkinchisi', 'L и M в другой, это вторая', 'L and M are in another, this is the second'),
    ],
    [
      L('LM va AC ni X nuqtaga qadar davom ettirdik', 'продлили LM и AC до точки X', 'LM and AC were extended to the point X'),
      L("KX to'g'ri chizig'i qirrada N nuqtani berdi", 'прямая KX дала точку N на ребре', 'the line KX gave the point N on an edge'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Piramida, va uning uch qirrasida K, L va M nuqtalari belgilangan. Ikki tomon darrov topiladi.', 'Пирамида, и на трёх её рёбрах отмечены точки K, L и M. Две стороны находятся сразу.', 'A pyramid, and points K, L and M are marked on three of its edges. Two sides are found straight away.'),
    A('move', "Keyin umumiy yoqli juftlar tugadi, va izlar usuli jismdan tashqariga qadam tashlaydi. L va M nuqtalari bir yon yoqda yotadi, va bu yoq tekislik bilan cheksiz davom etadi. L va M orqali to'g'ri chiziqni davom ettiraman, asos tomonini davom ettiraman, va ular X nuqtada uchrashadi. Bu nuqta kesuvchi tekislikka ham, asos tekisligiga ham tegishli. Demak u orqali iz o'tadi, ya'ni kesuvchi tekislikning asos tekisligi bilan kesishish chizig'i. K nuqta ham asosda yotadi, shuning uchun iz K va X orqali o'tgan to'g'ri chiziq. U asos qirrasini kesgan joyda kesimning to'rtinchi uchi turadi.", 'Дальше пары с общей гранью кончились, и метод следов делает шаг за тело. Точки L и M лежат в одной боковой грани, а эта грань бесконечно продолжается плоскостью. Продлеваю прямую через L и M, продлеваю сторону основания, и они встречаются в точке X. Эта точка принадлежит и секущей плоскости, и плоскости основания сразу. Значит через неё проходит след, то есть линия пересечения секущей плоскости с плоскостью основания. Точка K тоже лежит в основании, поэтому след это прямая через K и X. Там, где она пересекает ребро основания, стоит четвёртая вершина сечения.', 'Then the pairs with a common face ran out, and the trace method takes a step outside the body. The points L and M lie in one lateral face, and that face continues without end as a plane. I extend the line through L and M, I extend the side of the base, and they meet at the point X. This point belongs both to the cutting plane and to the plane of the base. So the trace passes through it, that is the line where the cutting plane meets the plane of the base. The point K lies in the base too, so the trace is the line through K and X. Where it crosses an edge of the base stands the fourth vertex of the section.'),
    A('work', "O'zingiz hisoblang. Chiqqan kesimning nechta tomoni bor?", 'Посчитай сам. Сколько сторон у полученного сечения?', 'Work it out yourself. How many sides does the section we got have?'),
  ],
  work: {
    prompt: L('Kesimning nechta tomoni?', 'Сколько сторон у сечения?', 'How many sides does the section have?'),
    ok: L("To'rtta. Har tomon o'z yog'ida, va yoqlar to'rttasi ham.", 'Четыре. Каждая сторона в своей грани, и грани все четыре.', 'Four. Each side in its own face, and all four faces are used.'),
    hint: [
      L('Uchlarni sanang: ular tomonlar soniga teng.', 'Посчитай вершины: их столько же, сколько сторон.', 'Count the vertices: there are as many as sides.'),
      L('X nuqta uch emas, u jismdan tashqarida.', 'Точка X вершиной не является, она вне тела.', 'The point X is not a vertex, it is outside the body.'),
      L("To'rtta.", 'Четыре.', 'Four.'),
    ],
    answer: '4',
  },
  expr: 'X = LM ∩ AC',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Parallel yoqlar, parallel tomonlar', 'Параллельные грани, параллельные стороны', 'Parallel faces, parallel sides'),
  tag: 'secheniye-ne-ploskoe',
  show: [
    [
      L('beshburchak, besh yoqda besh tomon', 'пятиугольник, пять сторон в пяти гранях', 'a pentagon, five sides in five faces'),
      L('oldingi va orqa yoqlar parallel', 'передняя и задняя грани параллельны', 'the front and back faces are parallel'),
    ],
    [
      L('demak ulardagi tomonlar ham parallel', 'значит и стороны в них параллельны', 'so the sides in them are parallel too'),
      L('ikkinchi juft ham shunday ishlaydi', 'вторая пара работает так же', 'the second pair works the same way'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Mana darsning boshidagi o'sha kesim. Unda tomonlar beshta, va har biri o'z yog'ida yotadi.", 'Вот то самое сечение из начала урока. Сторон в нём пять, и каждая лежит в своей грани.', 'Here is that very section from the start of the lesson. It has five sides, and each lies in its own face.'),
    A('move', "Kubning oldingi va orqa yoqlari parallel, kesuvchi tekislik esa bitta. Tekislik ikki parallel tekislikni parallel to'g'ri chiziqlar bo'ylab kesadi, bu parallellik blokidagi teorema. Demak oldingi yoqdagi tomon orqa yoqdagi tomonga parallel, va bu yerda tekshirishga hech narsa yo'q, bu natija. Ikkinchi yoqlar jufti ikkinchi tomonlar juftini beradi. Shundan ikkinchi yasash usuli, u darslikda parallel ko'chirish usuli deb ataladi: agar bir yoqda tomon allaqachon bo'lsa, parallel yoqda uning yo'nalishi oldindan ma'lum. Beshinchi tomon juftsiz qoldi, chunki tekislik pastki asosga tegmadi.", 'Передняя и задняя грани куба параллельны, а секущая плоскость одна. Плоскость режет две параллельные плоскости по параллельным прямым, это теорема из блока про параллельность. Значит сторона в передней грани параллельна стороне в задней, и проверять тут нечего, это следствие. Вторая пара граней даёт вторую пару сторон. Отсюда второй способ построения, он в учебнике называется методом параллельного переноса: если сторона в одной грани уже есть, в параллельной грани её направление известно заранее. Пятая сторона осталась без пары, потому что нижнее основание плоскость не задела.', 'The front and the back faces of the cube are parallel, and the cutting plane is one. A plane cuts two parallel planes along parallel lines, that is a theorem from the block on parallelism. So the side in the front face is parallel to the side in the back one, and there is nothing to check here, it is a consequence. The second pair of faces gives the second pair of sides. Hence the second way of building, called in the textbook the method of parallel transfer: if a side in one face is already there, in the parallel face its direction is known in advance. The fifth side was left without a pair, because the plane did not touch the lower base.'),
    A('work', "O'zingiz hisoblang. Bu beshburchakda nechta juft parallel tomon bor?", 'Посчитай сам. Сколько пар параллельных сторон в этом пятиугольнике?', 'Work it out yourself. How many pairs of parallel sides are in this pentagon?'),
  ],
  work: {
    prompt: L('Nechta juft parallel tomon?', 'Сколько пар параллельных сторон?', 'How many pairs of parallel sides?'),
    ok: L("Ikkita. Tegilgan parallel yoq juftlari soni qancha bo'lsa, shuncha.", 'Две. Столько же, сколько пар параллельных граней задето.', 'Two. As many as the pairs of parallel faces the plane touched.'),
    hint: [
      L('Tekislik tegilgan parallel yoq juftlarini sanang.', 'Считай пары параллельных граней, которые плоскость задела.', 'Count the pairs of parallel faces that the plane touched.'),
      L("Asoslarga tegilmagan, u yerda juft yo'q.", 'Основания не задеты, там пары нет.', 'The bases are not touched, there is no pair there.'),
      L('Ikkita.', 'Две.', 'Two.'),
    ],
    answer: '2',
  },
  expr: 'PM ∥ KH',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE EDGE CASE'),
  title: L("Yoqlardan ko'p bo'lmaydi", 'Больше, чем граней, не бывает', 'There cannot be more than faces'),
  tag: 'secheniye-ne-ploskoe',
  show: [
    [
      L('kubda yoqlar oltita', 'у куба граней шесть', 'a cube has six faces'),
      L('va eng katta kesim oltiburchak', 'и наибольшее сечение шестиугольник', 'and the largest section is a hexagon'),
    ],
    [
      L('beshburchakli prizmada yoqlar yettita', 'у пятиугольной призмы граней семь', 'a pentagonal prism has seven faces'),
      L("va kesim yettiburchak bo'ladi", 'и сечение бывает семиугольником', 'and the section can be a heptagon'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Kubda olti yoq, va mana olti qirraning o'rtalari orqali kesim. Unda tomonlar oltita.", 'У куба шесть граней, и вот сечение через середины шести рёбер. Сторон в нём шесть.', 'A cube has six faces, and here is the section through the midpoints of six edges. It has six sides.'),
    A('move', "Kubda oltidan ko'pi tekislikning hech qanday og'ishida chiqmaydi, va sabab sanab ko'rishda emas. Kesimning har tomoni o'z yog'ida yotadi, bitta yoqda esa kesuvchi tekislik faqat bitta to'g'ri chiziq beradi. Demak tomonlar yoqlardan ko'p emas, va bu javobning tayyor tekshiruvi. Beshburchakli prizmada yoqlar yettita: besh yon va ikki asos. Tekislikni yettitasiga ham tegadigan qilib og'dirish mumkin, va u holda kesimda yettiburchak. Sakkizburchak esa unda yo'q, va uni qidirish ma'nosizdir: sakkizinchi yoq shunchaki yo'q.", 'Больше шести у куба не получится ни при каком наклоне плоскости, и причина не в переборе. Каждая сторона сечения лежит в своей грани, а в одной грани секущая плоскость даёт только одну прямую. Значит сторон не больше, чем граней, и это готовая проверка ответа. У пятиугольной призмы граней семь: пять боковых и два основания. Плоскость можно наклонить так, чтобы она задела все семь, и тогда в сечении семиугольник. А восьмиугольника у неё нет, и искать его бессмысленно: восьмой грани просто нет.', 'More than six will not come out of a cube at any tilt of the plane, and the reason is not a search through cases. Every side of a section lies in its own face, and in one face the cutting plane gives only one line. So there are no more sides than faces, and that is a ready check of an answer. A pentagonal prism has seven faces: five lateral and two bases. The plane can be tilted so that it touches all seven, and then the section is a heptagon. But it has no octagon, and looking for one is pointless: there simply is no eighth face.'),
    A('work', "O'zingiz hisoblang. Beshburchakli prizma kesimida eng ko'pi bilan nechta tomon bo'ladi?", 'Посчитай сам. Сколько сторон самое большее у сечения пятиугольной призмы?', 'Work it out yourself. What is the largest number of sides for a section of a pentagonal prism?'),
  ],
  work: {
    prompt: L("Eng ko'pi bilan nechta tomon?", 'Сколько сторон самое большее?', 'The largest number of sides?'),
    ok: L("Yettita. Yoqlar soni qancha bo'lsa, shuncha.", 'Семь. Столько же, сколько граней.', 'Seven. As many as there are faces.'),
    hint: [
      L('Yoqlarni sanang: yon yoqlar va asoslar.', 'Посчитай грани: боковые и основания.', 'Count the faces: the lateral ones and the bases.'),
      L('Besh yon va ikki asos.', 'Пять боковых и два основания.', 'Five lateral and two bases.'),
      L('Yettita.', 'Семь.', 'Seven.'),
    ],
    answer: '7',
  },
  expr: 'ABCDEA₁B₁C₁D₁E₁',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Izlar usulining qoidalari', 'Правила метода следов', 'The rules of the trace method'),
  tag: 'gran-ne-storona',
  motion: ['rule'],
  audio: [
    A('mount', 'Farqlashga bitta savol, keyin kartochka.', 'Один вопрос на различение, потом карточка.', 'One question to tell them apart, then the card.'),
    A('rule', "Uchta satr ham oltmish sakkizinchi betdan, va uchtasi ham bir narsa haqida: kesim jism sirtida yashaydi. Birinchi satr uchlarni qayerdan olishni aytadi. Ikkinchisi har qanday ikkitasini ulash mumkin emasligini aytadi. Uchinchisi o'sha yoqda ikkinchi to'g'ri chiziqni taqiqlaydi, va aynan u yasashni yakkaqiymatli qiladi. Bu satrlardan ish tartibi ham chiqadi: umumiy yoqli juftlarni topamiz, ularning tomonlarini o'tkazamiz, juftlar tugagach esa iz orqali jismdan tashqariga chiqib qirrada yangi nuqta olamiz. Va shu yerda tekshiruv ham bor: tomonlar yoqlardan ko'p emas.", 'Все три строки со страницы шестьдесят восемь, и все три про одно: сечение живёт на поверхности тела. Первая строка говорит, где брать вершины. Вторая говорит, что соединять можно не любые две. Третья запрещает вторую прямую в той же грани, и именно она делает построение однозначным. Из этих строк выходит и порядок работы: находим пары с общей гранью, проводим их стороны, а когда пары кончились, идём за тело через след и получаем новую точку на ребре. И там же лежит проверка: сторон не больше, чем граней.', 'All three lines come from page sixty eight, and all three are about one thing: a section lives on the surface of the body. The first line says where to take the vertices. The second says that not any two may be joined. The third forbids a second line in the same face, and it is exactly what makes the construction unique. The order of work follows from these lines as well: we find the pairs with a common face, we draw their sides, and when the pairs run out we go outside the body through the trace and get a new point on an edge. And the check lives there too: no more sides than faces.'),
  ],
  probe: {
    question: L('Ikki belgilangan nuqtani qachon ulash mumkin?', 'Когда две отмеченные точки можно соединить?', 'When may two marked points be joined?'),
    items: [
      { id: 'a', label: L('ular bir yoqda yotganda', 'когда они лежат в одной грани', 'when they lie in one face'), correct: true },
      { id: 'b', label: L("chizmada yonma-yon bo'lganda", 'когда они рядом на чертеже', 'when they are next to each other on the drawing'), hint: L("Chizmadagi yonma-yonlik rakursga bog'liq, jismga emas.", 'Соседство на чертеже зависит от ракурса, а не от тела.', 'Being next to each other on the drawing depends on the view, not on the body.') },
    ],
  },
  rule: {
    lawLabel: L('Izlar usuli', 'Метод следов', 'The trace method'),
    lines: [
      L('kesim uchlari faqat qirralarda yotadi', 'вершины сечения лежат только на рёбрах', 'the vertices of a section lie only on the edges'),
      L('kesim tomonlari faqat yoqlarda yotadi', 'стороны сечения лежат только в гранях', 'the sides of a section lie only in the faces'),
      L("tekislik va yoq bitta to'g'ri chiziq bo'ylab kesishadi", 'плоскость и грань пересекаются по одной прямой', 'a plane and a face meet along a single line'),
    ],
    law: 'MN ⊂ A₁B₁C₁D₁',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Eng katta tomonlar soni', 'Наибольшее число сторон', 'The largest number of sides'),
  tag: 'secheniye-ne-ploskoe',
  audio: [
    A('mount', "To'rt son va to'rt jism. Ularni yoqlar soni bo'yicha birlashtiring.", 'Четыре числа и четыре тела. Соедини их по числу граней.', 'Four numbers and four bodies. Match them by the number of faces.'),
  ],
  match: {
    prompt: L('Sonni jism bilan birlashtiring', 'Соедини число с телом', 'Match the number with the body'),
    ok: L("To'rttasi ham joyida. Tomonlar soni yoqlar sonidan ko'p emas.", 'Все четыре на месте. Число сторон не больше числа граней.', 'All four in place. The number of sides is not more than the number of faces.'),
    a: L('uchburchakli piramida', 'треугольная пирамида', 'triangular pyramid'),
    b: L("to'rtburchakli piramida", 'четырёхугольная пирамида', 'quadrilateral pyramid'),
    c: L('kub', 'куб', 'cube'),
    d: L('beshburchakli prizma', 'пятиугольная призма', 'pentagonal prism'),
    left: ['4', '5', '6', '7'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('MN kesim tomoni ekanini isbotlang', 'Докажи, что MN сторона сечения', 'Prove that MN is a side of the section'),
  tag: 'gran-ne-storona',
  audio: [
    A('mount', "Uch qator, va har birining ro'yxatdan o'z asoslashi bor.", 'Три строки, и у каждой своё обоснование из списка.', 'Three lines, each with its own justification from the list.'),
  ],
  proof: {
    given: L('M va N ustki yoq qirralarida', 'M и N на рёбрах верхней грани', 'M and N are on the edges of the top face'),
    goal: L('MN kesimning tomoni', 'MN сторона сечения', 'MN is a side of the section'),
    r1: L('ikki nuqta ham kesuvchi tekislikda yotadi', 'обе точки лежат в секущей плоскости', 'both points lie in the cutting plane'),
    r2: L('ikki nuqta ham ustki yoq tekisligida yotadi', 'обе точки лежат в плоскости верхней грани', 'both points lie in the plane of the top face'),
    r3: L("ikki tekislik to'g'ri chiziq bo'ylab kesishadi, va bu MN", 'две плоскости пересекаются по прямой, и это MN', 'two planes meet along a line, and that is MN'),
    ok: L("Isbotlandi. Tomon tekislikning yoq bilan kesishish chizig'i.", 'Доказано. Сторона это линия пересечения плоскости с гранью.', 'Proved. A side is the line where the plane meets a face.'),
    e1: L('Yoq haqida keyin. Avval kesuvchi tekislik haqida.', 'Про грань дальше. Сначала про секущую плоскость.', 'The face comes later. First about the cutting plane.'),
    e2: L("Tekislik ko'rildi. Endi ikkinchi tekislik.", 'Плоскость разобрана. Теперь вторая плоскость.', 'The plane is done. Now the second plane.'),
    e3: L('Ikki tekislik ham aytildi. Endi xulosa.', 'Обе плоскости названы. Теперь вывод.', 'Both planes are named. Now the conclusion.'),
  },
  reason: {
    s1: L('nuqtalar kesuvchi tekislikda olingan', 'точки взяты в секущей плоскости', 'the points are taken in the cutting plane'),
    s2: L('ikki qirra ham ustki yoqqa tegishli', 'оба ребра принадлежат верхней грани', 'both edges belong to the top face'),
    s3: L('ikki tekislikning kesishishi haqidagi aksioma', 'аксиома о пересечении двух плоскостей', 'the axiom on the meeting of two planes'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: 'MN ⊂ A₁B₁C₁D₁',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO TOOL'),
  title: L('Hisob va yasash tartibi', 'Счёт и порядок построения', 'Counting and the order of building'),
  tag: 'bumaga',
  audio: [
    A('mount', "Asbob olib qo'yildi. Qog'ozda hisoblaymiz.", 'Прибор убран. Считаем на бумаге.', 'The tool is put away. We count on paper.'),
    A('next', 'Endi qadamlar tartibi. Ularni qanday yasalsa, shunday joylashtiring.', 'Теперь порядок шагов. Расставь их так, как строят.', 'Now the order of the steps. Arrange them the way the building goes.'),
  ],
  task: {
    ok: L("Ellik. Asos diagonali o'n, balandlik besh.", 'Пятьдесят. Диагональ основания десять, высота пять.', 'Fifty. The base diagonal is ten, the height is five.'),
    hint: [
      L("Ikki yon qirra orqali kesim to'g'ri to'rtburchak.", 'Сечение через два боковых ребра это прямоугольник.', 'A section through two lateral edges is a rectangle.'),
      L('Uning bir tomoni asos diagonali, olti va sakkiz.', 'Одна его сторона диагональ основания, шесть и восемь.', 'One of its sides is the base diagonal, six and eight.'),
      L("O'nni beshga ko'paytiring.", 'Десять умножить на пять.', 'Ten times five.'),
    ],
    prompt: 'a = 6,   b = 8,   h = 5,   S = ?',
    answer: '50',
  },
  order: {
    prompt: L('Izlar usuli qadamlarini kerakli tartibda joylashtiring', 'Расставь шаги метода следов в нужном порядке', 'Arrange the steps of the trace method in the right order'),
    title: L('Yasash tartibi', 'Порядок построения', 'The order of building'),
    ok: L("Tartib to'g'ri. Avval yoqdagi tomon, keyin iz, keyin yangi nuqta.", 'Порядок верный. Сначала сторона в грани, потом след, потом новая точка.', 'The order is right. First a side in a face, then the trace, then the new point.'),
    bad: L('Bu tartibda emas. Avval nima kerak.', 'Не в этом порядке. Что нужно раньше.', 'Not in this order. What is needed first.'),
    items: ['N', 'KL', 'KX', 'X'],
    answer: 'KL  X  KX  N',
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
    A('mount', "To'rt qator, va ulardan biri tomonni begona yoqqa qo'yadi.", 'Четыре строки, и одна из них кладёт сторону в чужую грань.', 'Four lines, and one of them puts a side into a face that is not its own.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("Berilganlar to'g'ri yozilgan.", 'Данные выписаны верно.', 'The data are written correctly.'),
    r2: L("Ikki nuqta ham ustki yoq qirralarida, bu to'g'ri.", 'Обе точки на рёбрах верхней грани, это верно.', 'Both points are on the edges of the top face, that is right.'),
    r4: L("Perimetr yuqoridagi xato qator bo'yicha hisoblangan.", 'Периметр посчитан по неверной строке выше.', 'The perimeter is computed from the wrong line above.'),
  },
  proof: L("Kubni buring: K nuqta uzoq yon qirrada yotadi, bu yoq esa uni o'z ichiga olmaydi.", 'Поверни куб: точка K лежит на дальнем боковом ребре, а эта грань его не содержит.', 'Rotate the cube: the point K lies on the far lateral edge, and this face does not contain it.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L("Uchinchi. M va K da umumiy yoq yo'q.", 'Третья. У M и K общей грани нет.', 'The third. M and K have no common face.'),
    hint: [
      L("Har qatorni yoq haqidagi qoida bo'yicha tekshiring.", 'Проверь каждую строку по правилу о грани.', 'Check each line against the rule about a face.'),
      L("Nuqtalardan biri yo'q yoqqa ketgan tomonni qidiring.", 'Ищи сторону, которая ушла в грань без одной из точек.', 'Look for the side that went into a face without one of the points.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'M ∈ A₁B₁,   N ∈ B₁C₁',
    r2: 'MN ⊂ A₁B₁C₁D₁',
    r3: 'MK ⊂ ABB₁A₁',
    r4: 'P = MN + NK + KM',
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
    A('mount', "Darsni o'ngdan chapga o'qiymiz. Avval jism bo'yicha hisob, keyin yozuvlarni tekshirish.", 'Прочитаем урок справа налево. Сначала счёт по телу, потом проверка записей.', 'Let us read the lesson from right to left. First the count from the body, then the check of the readings.'),
    A('work', "To'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны. Их больше одной.', 'Mark all the readings that are correct. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Bu kesim uchun nima to'g'ri", 'Что верно для этого сечения', 'What is true for this section'),
    ok: L("Beshtadan uch yozuv. Qolgan ikkitasi nuqtani uni o'z ichiga olmaydigan yoqqa qo'yadi.", 'Три записи из пяти. Две оставшиеся кладут точку в грань, которая её не содержит.', 'Three readings out of five. The other two put a point into a face that does not contain it.'),
    items: [
      { id: 'd', label: 'MK ⊂ ABB₁A₁', hint: L("Bu yoq K nuqtani o'z ichiga olmaydi.", 'Эта грань точку K не содержит.', 'This face does not contain the point K.') },
      { id: 'e', label: 'K ∈ ABB₁A₁', hint: L('K nuqta boshqa yon qirrada yotadi.', 'Точка K лежит на другом боковом ребре.', 'The point K lies on another lateral edge.') },
      { id: 'a', label: 'M ∈ A₁B₁', ok: true },
      { id: 'b', label: 'MN ⊂ A₁B₁C₁D₁', ok: true },
      { id: 'c', label: 'PM ∥ KH', ok: true },
    ],
  },
  place: {
    prompt: L("To'g'ri burchakli parallelepiped, o'lchovlari to'qqiz, o'n ikki va to'rt. Kesim ikki qarama-qarshi yon qirra orqali o'tadi. Uning yuzasi qancha?", 'Прямоугольный параллелепипед, измерения девять, двенадцать и четыре. Сечение проходит через два противоположных боковых ребра. Какова его площадь?', 'A rectangular box with dimensions nine, twelve and four. A section goes through two opposite lateral edges. What is its area?'),
    ok: L("Oltmish. Diagonal o'n besh, balandlik to'rt.", 'Шестьдесят. Диагональ пятнадцать, высота четыре.', 'Sixty. The diagonal is fifteen, the height is four.'),
    wrong: L("Asos diagonali bir o'lchov bo'yicha emas, ikki o'lchov bo'yicha hisoblanadi.", 'Диагональ основания считают по двум измерениям, а не по одному.', 'The base diagonal is computed from two dimensions, not from one.'),
    target: '60',
    step: '15·4',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'secheniye-ne-ploskoe',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Kesim uchlari qayerda yotadi?', 'Где лежат вершины сечения?', 'Where do the vertices of a section lie?'),
      done: 'M ∈ A₁B₁',
      items: [
        { id: 'a', label: L('faqat qirralarda', 'только на рёбрах', 'only on the edges'), correct: true },
        { id: 'b', label: L('yoqlar ichida', 'внутри граней', 'inside the faces'), hint: L('Yoq ichida tomonlar yotadi.', 'Внутри грани лежат стороны.', 'The sides lie inside a face.') },
        { id: 'c', label: L('jism uchlarida', 'в вершинах тела', 'at the vertices of the body'), hint: L('Bu xususiy hol, qoida emas.', 'Это частный случай, а не правило.', 'That is a special case, not the rule.') },
        { id: 'd', label: L('tekislikning har qanday joyida', 'в любом месте плоскости', 'anywhere in the plane'), hint: L("Jismdan tashqarida kesim nuqtalari yo'q.", 'Вне тела точек сечения нет.', 'Outside the body there are no points of the section.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Kub kesimida eng ko'pi bilan nechta tomon?", 'Сколько сторон самое большее у сечения куба?', 'The largest number of sides for a section of a cube?'),
      done: '6',
      items: [
        { id: 'a', label: L('oltita', 'шесть', 'six'), correct: true },
        { id: 'b', label: L("to'rtta", 'четыре', 'four'), hint: L("To'rt bo'ladi, lekin bu eng katta emas.", 'Четыре бывает, но это не наибольшее.', 'Four happens, but it is not the largest.') },
        { id: 'c', label: L('sakkizta', 'восемь', 'eight'), hint: L('Sakkiz uchlar, yoqlar emas.', 'Восемь это вершины, а не грани.', 'Eight is the vertices, not the faces.') },
        { id: 'd', label: L("o'n ikkita", 'двенадцать', 'twelve'), hint: L("O'n ikki qirralar.", 'Двенадцать это рёбра.', 'Twelve is the edges.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Ikki nuqta qachon tomon bilan ulanadi?', 'Когда две точки соединяют стороной?', 'When are two points joined by a side?'),
      done: 'MN ⊂ A₁B₁C₁D₁',
      items: [
        { id: 'a', label: L('bir yoqda yotganda', 'когда лежат в одной грани', 'when they lie in one face'), correct: true },
        { id: 'b', label: L('yaqin yotganda', 'когда лежат близко', 'when they lie close'), hint: L("Chizmadagi yaqinlik rakursga bog'liq.", 'Близость на чертеже зависит от ракурса.', 'Closeness on the drawing depends on the view.') },
        { id: 'c', label: L('har doim', 'всегда', 'always'), hint: L("U holda kesma jism ichidan o'tadi.", 'Тогда отрезок пройдёт внутри тела.', 'Then the segment would go inside the body.') },
        { id: 'd', label: L('bir qirrada yotganda', 'когда лежат на одном ребре', 'when they lie on one edge'), hint: L('U holda tomon qirra bilan mos tushardi.', 'Тогда сторона совпала бы с ребром.', 'Then the side would coincide with the edge.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Kesuvchi tekislikning izi nima?', 'Что такое след секущей плоскости?', 'What is the trace of a cutting plane?'),
      done: 'X = LM ∩ AC',
      items: [
        { id: 'a', label: L("uning asos tekisligi bilan kesishish chizig'i", 'линия её пересечения с плоскостью основания', 'the line where it meets the plane of the base'), correct: true },
        { id: 'b', label: L('jism qirrasi', 'ребро тела', 'an edge of the body'), hint: L('Qirra jismda bor, iz esa tekislikda.', 'Ребро есть у тела, а след у плоскости.', 'An edge belongs to the body, a trace to the plane.') },
        { id: 'c', label: L('asos diagonali', 'диагональ основания', 'a diagonal of the base'), hint: L('Diagonal jism bilan berilgan, iz esa kesuvchi tekislik bilan.', 'Диагональ задана телом, а след секущей плоскостью.', 'A diagonal is given by the body, a trace by the cutting plane.') },
        { id: 'd', label: L('jism balandligi', 'высота тела', 'the height of the body'), hint: L("Balandlik kesma, iz esa asosdagi to'g'ri chiziq.", 'Высота это отрезок, а след прямая в основании.', 'A height is a segment, a trace is a line in the base.') },
      ],
    },
  ],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Endi nimani bilasiz', 'Что теперь умеешь', 'What you can do now'),
  audio: [
    A('mount', 'Dars kub qirralaridagi uch nuqta haqidagi savol bilan boshlandi.', 'Урок начался с вопроса про три точки на рёбрах куба.', 'The lesson began with a question about three points on the edges of a cube.'),
    A('next', "Kesimda tomonlar beshta chiqdi, uchta emas, va bu chizmaning hiylasi emas. Uch nuqta tekislikni aniqladi, tekislik esa qaysi qirralarni kesishini o'zi hal qildi, va ular beshta bo'ldi. Bir biriga faqat umumiy yog'i bor nuqtalarni ulash mumkin, chunki kesim tomoni yoqda yotadi. Bunday juftlar tugaganda iz ishlaydi: jismdan tashqariga chiqamiz, asos tekisligida nuqta topamiz va u orqali qirrada yangi uch olamiz. Va butun darsga tekshiruv tayyor: tomonlar yoqlardan ko'p emas. Bundan keyin jism chizma bilan emas, sonlar bilan beriladi.", 'Сторон в сечении оказалось пять, а не три, и это не хитрость чертежа. Три точки задали плоскость, а плоскость сама решила, какие рёбра она режет, и их оказалось пять. Соединять между собой можно только те точки, у которых есть общая грань, потому что сторона сечения лежит в грани. Когда такие пары кончаются, работает след: выходим за тело, находим точку в плоскости основания и через неё получаем новую вершину на ребре. И готова проверка на весь урок: сторон не больше, чем граней. Дальше тело будет задаваться не чертежом, а числами.', 'The section turned out to have five sides, not three, and that is not a trick of the drawing. Three points determined a plane, and the plane itself decided which edges it cuts, and there were five of them. Only points that have a common face may be joined to each other, because a side of a section lies in a face. When such pairs run out, the trace works: we go outside the body, find a point in the plane of the base and through it get a new vertex on an edge. And the check for the whole lesson is ready: no more sides than faces. Next the body will be given not by a drawing but by numbers.'),
  ],
  can: [
    L("Kesimni ko'z bilan emas, qoida bo'yicha yasayman", 'Строю сечение по правилам, а не на глаз', 'I build a section by the rules, not by eye'),
    L('Ikki nuqta bir yoqda yotganini tekshiraman', 'Проверяю, лежат ли две точки в одной грани', 'I check whether two points lie in one face'),
    L("Izni topaman va u bo'yicha qirrada yangi nuqtani", 'Нахожу след и по нему новую точку на ребре', 'I find the trace and a new point on an edge by it'),
    L("Javobni yoqlar soni bo'yicha tekshiraman", 'Проверяю ответ по числу граней', 'I check the answer against the number of faces'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L('Bundan keyin fazoda koordinatalar va vektorlar, jism sonlar bilan beriladi', 'Дальше координаты и векторы в пространстве — тело будет задаваться числами', 'Next come coordinates and vectors in space, where a body is given by numbers'),
  lifehack: L('Ikki nuqtani ulashdan oldin ikkisi yotgan yoqni toping', 'Прежде чем соединить две точки, найди грань, в которой лежат обе', 'Before joining two points, find the face in which both of them lie'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L("Geometriya, oltmish to'rtinchi va oltmish sakkizinchi betlar", 'Геометрия, страницы шестьдесят четыре и шестьдесят восемь', 'Geometry, pages sixty four and sixty eight'),
  hook: {
    a: '3',
    b: '5',
  },
  proved: '5',
  law: 'MN ⊂ A₁B₁C₁D₁',
  sheet: [
    'M ∈ A₁B₁',
    'MN ⊂ A₁B₁C₁D₁',
    'X = LM ∩ AC',
    'N = KX ∩ BC',
    'PM ∥ KH',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/\u2212/g, '-'))

// PRIBOR 6B, KESIM. Nuqta qirrada ULUSH bilan beriladi, koordinata bilan emas:
// sahna burilganda u qirradan uzilib ketmaydi, ya'ni chizma yolg'on gapirmaydi
// (etalon: kesim uchlari FAQAT qirralarda yotadi, geom. 68-bet).
//
// BARCHA ULUSHLAR HISOBLANGAN, ko'z bilan qo'yilmagan. Hisob DARS49_KONTENT.md
// boshida yozilgan: M va N -- o'rtalar, K -- chorak, va shundan kesuvchi
// tekislik AA1 va CC1 ni uch chorakda kesadi. Beshburchak KPMNH, besh nuqtaning
// bitta tekislikdan chetlanishi aynan nol, parallel tomonlar jufti ikkita.
const CUT3 = [
  { id: 'M', on: ['A1', 'B1'], t: 0.5 },
  { id: 'N', on: ['B1', 'C1'], t: 0.5 },
  { id: 'K', on: ['D', 'D1'], t: 0.25 },
]
const CUT5 = CUT3.concat([
  { id: 'P', on: ['A', 'A1'], t: 0.75 },
  { id: 'H', on: ['C', 'C1'], t: 0.75 },
])
const PENT = { by: ['K', 'P', 'M', 'N', 'H'] }

// YOLG'ON KESIM va uning KAMERASI. To'rtinchi nuqta AB qirrasida, kesuvchi
// tekislik esa bu qirraga umuman tegmaydi: chetlanish qirraning yetti o'ndan
// qismi. 3-ekranning kamerasi 39-dars kabi O'ZINING kamerasi, va u sanab
// tanlangan: 0,7 da to'rtburchak qavariq va to'la (kompaktligi 0,042), 1,2 ga
// IXTIYORIY tomonga burilganda esa proyeksiyada o'zini o'zi kesadi, va uchta
// holatning hech birida kub yassi rasmga aylanmaydi. Sinf qadami 0,6 da o'ngga
// burilish obmanni ochmasdi -- shuning uchun bu yerda qadam 1,2.
const TRICK = 0.7
const TRICK_OFF = 1.9
const CUT_FAKE = CUT3.concat([{ id: 'G', on: ['A', 'B'], t: 0.25 }])
const FAKE = { by: ['M', 'N', 'G', 'K'] }

const FACE2 = '#6b8fa3'
const BAD = '#c0392b'
const TOP = [{ by: ['A1', 'B1', 'C1', 'D1'] }]
const TOP_DIM = [{ by: ['A1', 'B1', 'C1', 'D1'], dim: true }]
// PARALLEL YOQLAR jufti: tekislik ularni parallel to'g'ri chiziqlar bo'ylab
// kesadi, shuning uchun ular boshqa-boshqa rangda.
const PARA = [
  { by: ['A', 'B', 'B1', 'A1'], dim: true },
  { by: ['D', 'C', 'C1', 'D1'], tone: FACE2, dim: true },
]
const SIDE_PAIR = [
  { from: 'P', to: 'M', w: 3.4 },
  { from: 'K', to: 'H', w: 3.4 },
  { from: 'K', to: 'P', w: 3.4, tone: FACE2 },
  { from: 'N', to: 'H', w: 3.4, tone: FACE2 },
]

// IZLAR USULI piramidada (geom. 64-65-bet, 1-masala). Ulushlar yorliqlar
// to'qnashmasligi va X kadrda qolishi shartidan hisoblangan: X nuqta AC ning
// 1,44 ulushida, ya'ni C dan tashqarida, N esa BC ning 0,77 ida.
const PYR = { kind: 'pyramid', n: 3, h: 1.2, r: 0.66, turn: 1.1 }
const PYR_CUTS = [
  { id: 'K', on: ['A', 'B'], t: 0.5 },
  { id: 'L', on: ['A', 'S'], t: 0.8 },
  { id: 'M', on: ['C', 'S'], t: 0.55 },
]
// `meets` KETMA-KET ishlaydi: N ni topish uchun X allaqachon bo'lishi kerak.
const PYR_MEETS = [
  { id: 'X', a: ['L', 'M'], b: ['A', 'C'] },
  { id: 'N', a: ['K', 'X'], b: ['B', 'C'] },
]
const PYR_FACE = [{ by: ['A', 'B', 'S'], tone: FACE2, dim: true }]
const PYR_TWO = [{ from: 'K', to: 'L' }, { from: 'L', to: 'M' }]
const TRACE = [
  { from: 'M', to: 'X', hidden: true, w: 1.4, tone: '#7f8c8d' },
  { from: 'A', to: 'X', hidden: true, w: 1.4, tone: '#7f8c8d' },
  { from: 'K', to: 'X', hidden: true, w: 1.4, tone: '#7f8c8d' },
]
const PYR_CUT = { by: ['K', 'L', 'M', 'N'] }

// ENG KATTA KESIMLAR. Kubda -- muntazam oltiburchak, olti qirraning o'rtasi;
// uning tekisligi katta diagonalga perpendikulyar, shuning uchun sinf
// kamerasida yuzma-yuz turadi. Beshburchakli prizmada -- yettiburchak, yetti
// yoqning hammasi kesiladi. Og'ish azimuti kamera bo'ylab EMAS tanlangan: aks
// holda tekislik qirradan ko'rinib polosaga aylanadi (stendda shunday bo'lgan).
//
// Bu nuqtalar YORLIQSIZ (`label` bo'sh): yetti harf chizmani yopib qo'yadi,
// nuqtalarning o'zi esa tomonlarni sanash uchun kerak.
const CUT6 = [
  { id: 'U1', on: ['A1', 'B1'], t: 0.5, label: '' },
  { id: 'U2', on: ['B', 'B1'], t: 0.5, label: '' },
  { id: 'U3', on: ['B', 'C'], t: 0.5, label: '' },
  { id: 'U4', on: ['C', 'D'], t: 0.5, label: '' },
  { id: 'U5', on: ['D', 'D1'], t: 0.5, label: '' },
  { id: 'U6', on: ['D1', 'A1'], t: 0.5, label: '' },
]
const PRISM5 = { kind: 'prism', n: 5, h: 1.0, r: 0.58, turn: 0.3 }
const CUT7 = [
  { id: 'W1', on: ['D1', 'E1'], t: 0.469, label: '' },
  { id: 'W2', on: ['E', 'E1'], t: 0.882, label: '' },
  { id: 'W3', on: ['A', 'A1'], t: 0.132, label: '' },
  { id: 'W4', on: ['A', 'B'], t: 0.547, label: '' },
  { id: 'W5', on: ['B', 'C'], t: 0.182, label: '' },
  { id: 'W6', on: ['C', 'C1'], t: 0.491, label: '' },
  { id: 'W7', on: ['C1', 'D1'], t: 0.83, label: '' },
]
const IDS = (a) => a.map((c) => c.id)
const HEX6 = { by: IDS(CUT6) }
const HEPT = { by: IDS(CUT7) }

// Kichik kadrda kubning O'Z yorliqlari kesim uchlari bilan to'qnashadi, va
// o'quvchi qizil nuqtani B1 deb o'qishi mumkin (40-darsning tajribasi).
const CUBE_LBL = ['A', 'B', 'C', 'D', 'A1', 'B1', 'C1', 'D1']

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
            fig={<Space step={1} yaw={0.4} cube cuts={CUT3} hide={CUBE_LBL} />}
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
            fig={<Space step={1} yaw={0.4} cube cuts={CUT3} />}
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
            step={1} yaw={phase === 0 ? TRICK : TRICK_OFF}
            cube cuts={CUT_FAKE} cut={FAKE}
          />
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={TRICK}
        stepYaw={1.2}
        scene={<Space step={1} cube cuts={CUT_FAKE} cut={FAKE} />}
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
            step={1} yaw={0.4} cube cuts={CUT3}
            faces={phase === 0 ? TOP : TOP_DIM}
            segs={phase === 0
              ? [{ from: 'M', to: 'N' }]
              : [{ from: 'M', to: 'N', tone: '#7f8c8d', w: 2 }, { from: 'M', to: 'K', tone: BAD }]}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={(
          <Space
            step={1} cube cuts={CUT3} faces={TOP}
            segs={[{ from: 'M', to: 'N' }]}
          />
        )}
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
            step={1} yaw={0.5} poly={PYR} cuts={PYR_CUTS}
            faces={phase === 0 ? PYR_FACE : []}
            meets={phase === 0 ? [] : PYR_MEETS}
            segs={phase === 0 ? PYR_TWO : TRACE}
            cut={phase === 0 ? null : PYR_CUT}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={(
          <Space
            step={1} poly={PYR} cuts={PYR_CUTS} meets={PYR_MEETS}
            segs={TRACE} cut={PYR_CUT}
          />
        )}
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
            step={1} yaw={0.4} cube cuts={CUT5} cut={PENT}
            faces={PARA} segs={phase === 0 ? [] : SIDE_PAIR}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={<Space step={1} cube cuts={CUT5} cut={PENT} segs={SIDE_PAIR} />}
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
          phase === 0 ? (
            <Space step={1} yaw={0.4} cube cuts={CUT6} cut={HEX6} hide={CUBE_LBL} />
          ) : (
            <Space step={1} yaw={0.4} poly={PRISM5} cuts={CUT7} cut={HEPT} />
          )
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space step={1} poly={PRISM5} cuts={CUT7} cut={HEPT} />}
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
                step={1} yaw={solved ? 0.9 : 0.4}
                cube cuts={CUT5} cut={PENT}
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
                step={1} yaw={0.35 + round * 0.25}
                cube cuts={CUT5} cut={PENT} hide={CUBE_LBL}
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
