// ============================================================================
// 10-sinf, Dars 43. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS43_KONTENT.md
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

import { Space3D } from './space.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 43
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Fazoda koordinatalar`,
  `Урок ${LESSON_NO}. Координаты в пространстве`,
  `Lesson ${LESSON_NO}. Coordinates in space`,
)

const BLOCK = { label: 'B8', from: 43, to: 47, current: 43 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('KOORDINATALAR', 'КООРДИНАТЫ', 'COORDINATES'),
  title: L('Nuqtaga nechta son kerak', 'Сколько чисел нужно точке', 'How many numbers a point needs'),
  audio: [
    A('mount', 'Fazodagi nuqta va uning uch sondan iborat yozuvi.', 'Точка в пространстве и её запись из трёх чисел.', 'A point in space and its reading of three numbers.'),
    A('r1', 'Birinchi yozuv nuqtaga tekislikdagidek ikki son yetadi deydi.', 'Первая запись говорит, что точке хватает двух чисел, как на плоскости.', 'The first reading says two numbers are enough for a point, as on a plane.'),
    A('r2', 'Ikkinchisi uchta kerak deydi.', 'Вторая говорит, что нужно три.', 'The second says three are needed.'),
    A('ask', "Chizmada tekislik ko'rinadi, va unga qarab ikkitasi yetadigandek tuyuladi. Sizningcha qaysi yozuv to'g'ri?", 'На чертеже видна плоскость, и по ней кажется, что двух хватит. Как думаешь, какая запись верная?', 'The drawing shows a plane, and by it two seem enough. Which reading do you think is right?'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi nuqtani qo'yamiz.", 'Твой ответ записан. Сейчас поставим точку.', 'Your answer is recorded. Now we place the point.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('ikkita', 'два', 'two'),
      value: '2',
    },
    b: {
      name: L('uchta', 'три', 'three'),
      value: '3',
    },
  },
  expr: 'A (2; 3; 4)',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Kursdan uch savol', 'Три вопроса из курса', 'Three questions from the course'),
  tag: 'support',
  audio: [
    A('mount', "Uchta savol. Darsning qoidasi birinchi va uchinchidan yig'iladi.", 'Три вопроса. Правило урока соберётся из первого и третьего.', 'Three questions. The rule of the lesson will be assembled from the first and the third.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Tekislikdagi nuqtani nechta son aniqlaydi?', 'Сколько чисел задаёт точку на плоскости?', 'How many numbers determine a point on a plane?'),
      done: 'M (x; y)',
      items: [
        { id: 'a', label: L('ikkita', 'два', 'two'), correct: true },
        { id: 'b', label: L('bitta', 'одно', 'one'), hint: L("Bitta son to'g'ri chiziqdagi nuqtani aniqlaydi.", 'Одно число задаёт точку на прямой.', 'One number determines a point on a line.') },
        { id: 'c', label: L('uchta', 'три', 'three'), hint: L("Uchta son fazoda paydo bo'ladi.", 'Три числа появятся в пространстве.', 'Three numbers will appear in space.') },
        { id: 'd', label: L("to'rtta", 'четыре', 'four'), hint: L("Kursning geometriyasida to'rtinchi son yo'q.", 'Четвёртого числа в геометрии курса нет.', 'There is no fourth number in the geometry of this course.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Nuqtaning tekislikka proyeksiyasi nima?', 'Что такое проекция точки на плоскость?', 'What is the projection of a point onto a plane?'),
      done: 'A₁ ∈ Oxy',
      items: [
        { id: 'a', label: L('nuqtadan tushirilgan perpendikulyarning asosi', 'основание перпендикуляра из точки', 'the foot of the perpendicular from the point'), correct: true },
        { id: 'b', label: L('tekislik chekkasidagi eng yaqin nuqta', 'ближайшая точка на краю плоскости', 'the nearest point on the edge of the plane'), hint: L("Tekislikning chekkasi yo'q, u cheksiz.", 'У плоскости края нет, она бесконечна.', 'A plane has no edge, it is endless.') },
        { id: 'c', label: L("ko'z bilan uning ostidagi nuqta", 'точка под ней на глаз', 'the point below it by eye'), hint: L("Bu ko'z bilan yasalmaydi: perpendikulyar kerak.", 'На глаз это не строится: нужен перпендикуляр.', 'It is not built by eye: a perpendicular is needed.') },
        { id: 'd', label: L("tekislikkacha kesmaning o'rtasi", 'середина отрезка до плоскости', 'the midpoint of the segment to the plane'), hint: L("O'rta orasida yotadi, proyeksiya esa tekislikda.", 'Середина лежит между, а проекция на плоскости.', 'The midpoint lies between, the projection lies in the plane.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Yozuvdagi sonlar tartibi ixtiyoriymi?', 'Порядок чисел в записи произволен?', 'Is the order of the numbers in the reading arbitrary?'),
      done: '(2; 3; 4) ≠ (4; 3; 2)',
      items: [
        { id: 'a', label: L("yo'q, har o'rinning o'z o'qi bor", 'нет, у каждого места своя ось', 'no, each place has its own axis'), correct: true },
        { id: 'b', label: L("ha, sonlar o'sha bo'lsa bo'ldi", 'да, лишь бы числа те же', 'yes, as long as the numbers are the same'), hint: L("O'sha sonlar boshqa tartibda boshqa nuqta beradi.", 'Те же числа в другом порядке дают другую точку.', 'The same numbers in another order give another point.') },
        { id: 'c', label: L("ha, agar sonlar musbat bo'lsa", 'да, если числа положительные', 'yes, if the numbers are positive'), hint: L('Ishora bu yerda hech narsani hal qilmaydi.', 'Знак тут ничего не решает.', 'The sign decides nothing here.') },
        { id: 'd', label: L('faqat nol uchun', 'только для нуля', 'only for zero'), hint: L("Nol ham o'z o'rnida turadi.", 'Ноль тоже стоит на своём месте.', 'Zero also stands in its own place.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Uchinchi son ko'tarilish", 'Третье число это подъём', 'The third number is the rise'),
  tag: 'nuqta-proyeksiyasiz',
  show: [
    [
      L('avval nuqta pastki tekislikda', 'сначала точка в нижней плоскости', 'first the point in the lower plane'),
      L('ikki son, tekislikdagidek', 'два числа, как на плоскости', 'two numbers, as on a plane'),
    ],
    [
      L("endi to'rtga ko'tarilish", 'теперь подъём на четыре', 'now a rise of four'),
      L('va proyeksiya pastda qoldi', 'и проекция осталась внизу', 'and the projection stayed below'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Pastki tekislikda ikki sonli nuqta turadi. U hozircha fazoda emas.', 'В нижней плоскости стоит точка с двумя числами. Она пока не в пространстве.', 'A point with two numbers stands in the lower plane. It is not yet in space.'),
    A('move', "Nuqtani to'rtga ko'taraman, va pastda uning proyeksiyasi qoladi. Proyeksiya perpendikulyarning asosi, va u hech qayerga ketmaydi: karkasni qancha bursam ham, u nuqtaning tagida turadi. Birinchi ikki son proyeksiyaning manzili, uchinchisi nuqta tekislikdan qancha ko'tarilganini aytadi. Shuning uchun fazodagi nuqtaga ikki emas, uch son kerak: ikkitasi butun dunyo bitta tekislikda yotganda yetardi. Tartibga ham e'tibor bering: uchinchi son tik o'qqa biriktirilgan, uni almashtirib bo'lmaydi.", 'Поднимаю точку на четыре, и внизу остаётся её проекция. Проекция это основание перпендикуляра, и она никуда не уходит: сколько бы я ни поворачивал каркас, она стоит ровно под точкой. Первые два числа адресуют проекцию, третье говорит, на сколько точка поднята над плоскостью. Поэтому точке в пространстве нужны три числа, а не два: двух хватило бы, если бы весь мир лежал в одной плоскости. И заметь порядок: третье число закреплено за вертикальной осью, переставить его нельзя.', 'I raise the point by four, and its projection stays below. The projection is the foot of the perpendicular, and it does not move anywhere: however much I turn the frame, it stands exactly under the point. The first two numbers address the projection, the third says how far the point is raised above the plane. That is why a point in space needs three numbers and not two: two would be enough if the whole world lay in one plane. And note the order: the third number is tied to the vertical axis and cannot be moved.'),
    A('work', "O'zingiz hisoblang. Fazodagi nuqtaga nechta son kerak?", 'Посчитай сам. Сколько чисел нужно точке в пространстве?', 'Work it out yourself. How many numbers does a point in space need?'),
  ],
  work: {
    prompt: L('Nuqtaga nechta son kerak?', 'Сколько чисел нужно точке?', 'How many numbers does a point need?'),
    ok: L("Uchta. Ikkitasi proyeksiyaga, bittasi ko'tarilishga.", 'Три. Два на проекцию и одно на подъём.', 'Three. Two for the projection and one for the rise.'),
    hint: [
      L('Proyeksiyaga nechta son ketganini sanang.', 'Посчитай, сколько чисел ушло на проекцию.', 'Count how many numbers went to the projection.'),
      L("Va ko'tarilish haqida aytadiganini qo'shing.", 'И добавь то, что говорит про подъём.', 'And add the one that speaks of the rise.'),
      L('Uchta.', 'Три.', 'Three.'),
    ],
    answer: '3',
  },
  expr: 'A (2; 3; 4)',
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Proyeksiyada uchinchi son nol', 'У проекции третье число ноль', 'The projection has zero as its third number'),
  tag: 'nuqta-proyeksiyasiz',
  show: [
    [
      L('nuqta va uning proyeksiyasi', 'точка и её проекция', 'the point and its projection'),
      L('birinchi ikki son ularda umumiy', 'первые два числа у них общие', 'their first two numbers are the same'),
    ],
    [
      L('burilish, va proyeksiya nuqta tagida', 'поворот, и проекция под точкой', 'a turn, and the projection is under the point'),
      L("uning ko'tarilishi nol", 'подъём у неё нулевой', 'its rise is zero'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Nuqta va uning proyeksiyasi bir-birining ustida turadi. Yozuvlarini taqqoslaymiz.', 'Точка и её проекция стоят одна над другой. Сравним их записи.', 'The point and its projection stand one above the other. Let us compare their readings.'),
    A('move', "Birinchi ikki son ularda bir xil, va bu tasodif emas: proyeksiya nuqtaning pastki tekislikdagi manzilining o'zi. Farq faqat uchinchi sonda. Nuqtada u to'rt, proyeksiyada nol, chunki proyeksiya tekislikning o'zida yotadi va ko'tariladigan joyi yo'q. Karkasni buraman: proyeksiya nuqta bilan birga yuradi va uning tagida qoladi. Ana shu bog'lanish chizmaning tekshiruvi. Agar to'rtni tik o'qqa emas, boshqasiga bergan bo'lsam, proyeksiya to'rning boshqa tuguniga tushardi, va burilish buni darrov ko'rsatardi.", 'Первые два числа у них одинаковые, и это не совпадение: проекция и есть адрес точки в нижней плоскости. Различие только в третьем числе. У точки оно четыре, у проекции ноль, потому что проекция лежит в самой плоскости и подниматься ей некуда. Поворачиваю каркас: проекция едет вместе с точкой и остаётся под ней. Вот эта связка и есть проверка чертежа. Если бы я приписал четвёрку не к вертикальной оси, проекция встала бы в другой узел сетки, и поворот сразу бы это показал.', 'Their first two numbers are the same, and that is no coincidence: the projection is exactly the address of the point in the lower plane. The only difference is in the third number. For the point it is four, for the projection zero, because the projection lies in the plane itself and has nowhere to rise. I turn the frame: the projection travels with the point and stays under it. That link is the check of the drawing. Had I given the four to another axis, the projection would stand at another node of the grid, and the turn would show it at once.'),
    A('work', "O'zingiz hisoblang. Proyeksiyaning uchinchi soni qanday?", 'Посчитай сам. Какое третье число у проекции?', 'Work it out yourself. What is the third number of the projection?'),
  ],
  work: {
    prompt: L('Proyeksiyaning uchinchi soni?', 'Третье число проекции?', 'The third number of the projection?'),
    ok: L("Nol. Proyeksiya tekislikning o'zida yotadi.", 'Ноль. Проекция лежит в самой плоскости.', 'Zero. The projection lies in the plane itself.'),
    hint: [
      L("Proyeksiyaning o'zi qancha ko'tarilgan deb so'rang.", 'Спроси, на сколько поднята сама проекция.', 'Ask how far the projection itself is raised.'),
      L("U tekislikda, ko'tariladigan joyi yo'q.", 'Она в плоскости, подниматься ей некуда.', 'It is in the plane, it has nowhere to rise.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
  expr: 'A₁ (2; 3; 0)',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("O'sha sonlar, boshqa nuqta", 'Те же числа, другая точка', 'The same numbers, another point'),
  tag: 'nuqta-proyeksiyasiz',
  show: [
    [
      L("ikki uch to'rt yozuvli nuqta", 'точка с записью два три четыре', 'the point read two three four'),
      L("va to'rt uch ikki yozuvli nuqta", 'и точка с записью четыре три два', 'and the point read four three two'),
    ],
    [
      L('sonlar bir xil', 'числа одни и те же', 'the numbers are the same'),
      L('nuqtalar esa boshqa', 'а точки разные', 'but the points are different'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Ikki nuqta, va yozuvlarida bir xil uchta son.', 'Две точки, и в записях у них одни и те же три числа.', 'Two points, and their readings hold the same three numbers.'),
    A('move', "Ular boshqa-boshqa joyda turadi va uzoqqa ketdi. Sabab tartibda: yozuvdagi o'rin o'qqa biriktirilgan, songa emas. Birinchi nuqtada to'rt ko'tarilishga javob beradi, va u balandda. Ikkinchisida to'rt birinchi o'qqa ketdi, ko'tarilish esa ikki bo'ldi, va nuqta pastga tushdi. Bundan imtihon uchun muhim natija chiqadi: yozuv sonlar to'plami bo'yicha emas, o'rinlar bo'yicha o'qiladi. Tekshiruv esa o'sha -- proyeksiya. Ikki nuqtaning proyeksiyalari boshqa, va bu hisobsiz, darrov ko'rinadi.", 'Стоят они в разных местах, и разошлись далеко. Причина в порядке: место в записи закреплено за осью, а не за числом. У первой точки четвёрка отвечает за подъём, и она высоко. У второй четвёрка ушла на первую ось, а подъём стал двойкой, и точка опустилась. Отсюда важное следствие для экзамена: запись читается по местам, а не по набору чисел. Проверка та же, что и раньше, это проекция. У обеих точек проекции разные, и это видно сразу, до всякого счёта.', 'They stand in different places and have parted far. The reason is the order: a place in the reading is tied to an axis, not to a number. In the first point the four answers for the rise, and it is high. In the second the four went to the first axis and the rise became two, so the point came down. Hence an important consequence for the exam: a reading is read by places, not by the set of numbers. And the check is the same one, it is the projection. The two points have different projections, and that is visible at once, before any counting.'),
    A('work', "O'zingiz hisoblang. Ikki nuqtadan nechtasining ko'tarilishi to'rtga teng?", 'Посчитай сам. У скольких из двух точек подъём равен четырём?', 'Work it out yourself. How many of the two points have a rise of four?'),
  ],
  work: {
    prompt: L("Nechtasining ko'tarilishi to'rt?", 'У скольких подъём равен четырём?', 'How many have a rise of four?'),
    ok: L("Bittasining. Ko'tarilish uchinchi o'rin, har qanday emas.", 'У одной. Подъём это третье место, а не любое.', 'One. The rise is the third place, not any place.'),
    hint: [
      L("Yozuvdagi faqat uchinchi o'ringa qarang.", 'Смотри только на третье место в записи.', 'Look only at the third place in the reading.'),
      L('Ikkinchi nuqtada u yerda ikki.', 'У второй точки там двойка.', 'For the second point there is a two there.'),
      L('Bittasi.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
  expr: '(2; 3; 4) ≠ (4; 3; 2)',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Masofa perpendikulyar', 'Расстояние это перпендикуляр', 'A distance is a perpendicular'),
  tag: 'nuqta-proyeksiyasiz',
  show: [
    [
      L('tekislikkacha qiya kesma', 'наклонный отрезок до плоскости', 'a slanted segment to the plane'),
      L('asbob uni qiya deb ataydi', 'прибор называет его наклонной', 'the tool calls it a slant'),
    ],
    [
      L('nuqtadan perpendikulyar', 'перпендикуляр из точки', 'the perpendicular from the point'),
      L('va bu endi masofa', 'и это уже расстояние', 'and this is a distance now'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Nuqtadan pastki tekislikkacha qiya kesma o'tkazaman va uni masofa deb olishga harakat qilaman.", 'Проведу от точки до нижней плоскости наклонный отрезок и попробую взять его за расстояние.', 'Let me draw a slanted segment from the point to the lower plane and try to take it as the distance.'),
    A('move', "Asbob uni qiya deb belgilaydi va javobga olmaydi. Bu oltinchi blokning qoidasi, va bu yerda ham xuddi shunday ishlaydi: nuqtadan tekislikkacha masofa faqat perpendikulyar bo'ylab o'lchanadi, qolgani uzunroq. Perpendikulyar qo'yaman, va uning asosi aynan nuqtaning proyeksiyasida chiqadi. Perpendikulyarning uzunligi esa yozuvning uchinchi soniga teng, chunki uchinchi son tekislikdan ko'tarilishning o'zi. Ana bog'lanish: pastki tekislikkacha masofa yozuvdan to'g'ridan to'g'ri o'qiladi, hisoblash kerak emas.", 'Прибор подписывает его словом наклонная и в ответ не берёт. Это правило блока шесть, и здесь оно работает так же: расстояние от точки до плоскости меряется только по перпендикуляру, всё остальное длиннее. Ставлю перпендикуляр, и его основание оказывается ровно в проекции точки. А длина перпендикуляра равна третьему числу записи, потому что третье число и есть подъём над плоскостью. Вот и связка: расстояние до нижней плоскости читается прямо из записи, считать ничего не надо.', 'The tool labels it with the word slant and does not take it as the answer. That is the rule of block six, and here it works the same way: the distance from a point to a plane is measured only along the perpendicular, everything else is longer. I set the perpendicular, and its foot turns out to be exactly at the projection of the point. And the length of the perpendicular equals the third number of the reading, because the third number is the rise above the plane itself. There is the link: the distance to the lower plane is read straight from the reading, nothing to compute.'),
    A('work', "O'zingiz hisoblang. Nuqtadan pastki tekislikkacha masofa qancha?", 'Посчитай сам. Каково расстояние от точки до нижней плоскости?', 'Work it out yourself. What is the distance from the point to the lower plane?'),
  ],
  work: {
    prompt: L('Pastki tekislikkacha masofa?', 'Расстояние до нижней плоскости?', 'The distance to the lower plane?'),
    ok: L("To'rt. Bu yozuvning uchinchi soni.", 'Четыре. Это третье число записи.', 'Four. That is the third number of the reading.'),
    hint: [
      L("Masofa perpendikulyar bo'ylab o'lchanadi.", 'Расстояние меряется по перпендикуляру.', 'The distance is measured along the perpendicular.'),
      L("Uning uzunligi nuqtaning ko'tarilishi.", 'Его длина это подъём точки.', 'Its length is the rise of the point.'),
      L("To'rt.", 'Четыре.', 'Four.'),
    ],
    answer: '4',
  },
  expr: 'A (2; 3; 4)',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE EDGE CASE'),
  title: L('Nollar nuqta qayerda ekanini aytadi', 'Нули говорят, где точка', 'The zeros say where the point is'),
  tag: 'nuqta-proyeksiyasiz',
  show: [
    [
      L('ikki uch nol nuqta', 'точка два три нуль', 'the point two three zero'),
      L('bitta nol, va u tekislikda', 'один нуль, и она в плоскости', 'one zero, and it is in the plane'),
    ],
    [
      L('nol uch nol nuqta', 'точка нуль три нуль', 'the point zero three zero'),
      L("ikki nol, va u o'qda", 'два нуля, и она на оси', 'two zeros, and it is on an axis'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Uchinchi soni nol bo'lgan nuqtani olamiz. U o'z proyeksiyasi bilan mos tushdi.", 'Возьмём точку, у которой третье число ноль. Она совпала со своей проекцией.', 'Take a point whose third number is zero. It has merged with its own projection.'),
    A('move', "Demak u pastki tekislikda yotadi, va bu tekislikka perpendikulyari nol. Endi yana bitta sonni nolga aylantiraman. Nuqta o'qqa ketdi, va bu endi tekislik holi emas, to'g'ri chiziq holi: ikki nol unga faqat bitta erkinlik qoldiradi. Bundan imtihonda vaqt tejaydigan o'qish qoidasi chiqadi. Bitta ham nol yo'q -- nuqta ichkarida, tekisliklardan tashqarida. Bitta nol -- nuqta koordinata tekisligida. Ikki nol -- nuqta o'qda. Uch nol -- bu koordinatalar boshi, va u bitta.", 'Значит она лежит в нижней плоскости, и перпендикуляр к этой плоскости у неё нулевой. Теперь обнулю ещё одно число. Точка ушла на ось, и это уже не случай плоскости, а случай прямой: два нуля оставляют ей только одну свободу. Отсюда правило чтения, которое на экзамене экономит время. Ни одного нуля значит точка внутри, вне плоскостей. Один нуль значит точка в координатной плоскости. Два нуля значит точка на оси. Три нуля дают начало координат, и оно одно.', 'So it lies in the lower plane, and its perpendicular to that plane is zero. Now let me zero one more number. The point has gone to an axis, and this is no longer the case of a plane but the case of a line: two zeros leave it only one freedom. Hence a reading rule that saves time at the exam. No zeros at all means the point is inside, off the planes. One zero means the point is in a coordinate plane. Two zeros mean the point is on an axis. Three zeros give the origin, and there is only one.'),
    A('work', "O'zingiz hisoblang. O'qda yotgan nuqtaning yozuvida nechta nol bor?", 'Посчитай сам. Сколько нулей в записи точки, лежащей на оси?', 'Work it out yourself. How many zeros are in the reading of a point lying on an axis?'),
  ],
  work: {
    prompt: L("O'qdagi nuqtada nechta nol?", 'Сколько нулей у точки на оси?', 'How many zeros for a point on an axis?'),
    ok: L("Ikkita. Bitta erkinlik qoladi, o'q bo'ylab.", 'Два. Остаётся одна свобода, вдоль оси.', 'Two. One freedom remains, along the axis.'),
    hint: [
      L('Nechta son nolga aylanganini sanang.', 'Посчитай, сколько чисел обнулилось.', 'Count how many numbers became zero.'),
      L('Bitta nol tekislikka yetardi.', 'Одного нуля хватало на плоскость.', 'One zero was enough for a plane.'),
      L('Ikkita.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
  expr: '(0; 3; 0) ∈ Oy',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Uchlik qanday o'qiladi", 'Как читается тройка', 'How a triple is read'),
  tag: 'nuqta-proyeksiyasiz',
  motion: ['rule'],
  audio: [
    A('mount', 'Farqlashga bitta savol, keyin kartochka.', 'Один вопрос на различение, потом карточка.', 'One question to tell them apart, then the card.'),
    A('rule', "Uchta satr ham bir narsa haqida: uchlik sonlar to'plami emas, uch o'q bo'yicha uch manzil. Birinchi satr sonlarni almashtirishni taqiqlaydi. Ikkinchisi ularni chizma bilan qanday tekshirishni aytadi, va bu blokning eng foydali satri: proyeksiya xatoni har qanday hisobdan oldin ushlaydi. Uchinchisi nollarni ma'lumotga aylantiradi. Imtihonda u eng tez ishlaydi: ikki nolni ko'rdingiz -- nuqta o'qda, va ishning yarmi bajarilgan.", 'Все три строки про одно: тройка это не набор чисел, а три адреса по трём осям. Первая строка запрещает переставлять числа. Вторая говорит, как их проверить чертежом, и это самая полезная строка блока: проекция ловит ошибку до всякого счёта. Третья превращает нули в информацию. На экзамене она работает быстрее всего: увидел два нуля, значит точка на оси, и половина работы уже сделана.', 'All three lines are about one thing: a triple is not a set of numbers but three addresses along three axes. The first line forbids swapping the numbers. The second says how to check them with a drawing, and it is the most useful line of the block: the projection catches a mistake before any counting. The third turns zeros into information. At the exam it works fastest: you see two zeros and the point is on an axis, and half the work is already done.'),
  ],
  probe: {
    question: L('Proyeksiya nimani tekshiradi?', 'Что проверяет проекция?', 'What does the projection check?'),
    items: [
      { id: 'a', label: L("birinchi ikki son o'z o'qlarida ekanini", 'что первые два числа на своих осях', 'that the first two numbers are on their own axes'), correct: true },
      { id: 'b', label: L('nuqta tekislikka yaqin ekanini', 'что точка близко к плоскости', 'that the point is close to the plane'), hint: L("Yaqinlikning bunga aloqasi yo'q, proyeksiya har qanday nuqtada bor.", 'Близость тут ни при чём, проекция есть у любой точки.', 'Closeness has nothing to do with it, every point has a projection.') },
    ],
  },
  rule: {
    lawLabel: L('Fazodagi nuqta', 'Точка в пространстве', 'A point in space'),
    lines: [
      L("yozuvdagi o'rin songa emas, o'qqa biriktirilgan", 'место в записи закреплено за осью, а не за числом', 'a place in the reading is tied to an axis, not to a number'),
      L("birinchi ikki son proyeksiyani manzillaydi, uchinchisi ko'tarilishni beradi", 'первые два числа адресуют проекцию, третье даёт подъём', 'the first two numbers address the projection, the third gives the rise'),
      L('nollar soni nuqta qayerda yotganini aytadi', 'число нулей говорит, где точка лежит', 'the number of zeros says where the point lies'),
    ],
    law: 'A₁ (x; y; 0)',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Nuqta qayerda yotadi', 'Где лежит точка', 'Where the point lies'),
  tag: 'nuqta-proyeksiyasiz',
  audio: [
    A('mount', "To'rt yozuv va to'rt joy. Nollarni sanang.", 'Четыре записи и четыре места. Считай нули.', 'Four readings and four places. Count the zeros.'),
  ],
  match: {
    prompt: L('Yozuvni joy bilan birlashtiring', 'Соедини запись с местом', 'Match the reading with the place'),
    ok: L("To'rttasi ham joyida. Nollar nuqta qayerda ekanini aytdi.", 'Все четыре на месте. Нули сказали, где точка.', 'All four in place. The zeros said where the point is.'),
    a: L("tik o'qda", 'на вертикальной оси', 'on the vertical axis'),
    b: L('pastki tekislikda', 'в нижней плоскости', 'in the lower plane'),
    c: L('orqa tekislikda', 'в задней плоскости', 'in the back plane'),
    d: L('tekisliklardan tashqarida', 'вне плоскостей', 'off the planes'),
    left: ['(0; 0; 5)', '(2; 3; 0)', '(0; 2; 3)', '(1; 2; 3)'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Nuqta pastki tekislikda ekanini isbotlang', 'Докажи, что точка в нижней плоскости', 'Prove the point is in the lower plane'),
  tag: 'nuqta-proyeksiyasiz',
  audio: [
    A('mount', "Uch qator, va har birining ro'yxatdan o'z asoslashi bor.", 'Три строки, и у каждой своё обоснование из списка.', 'Three lines, each with its own justification from the list.'),
  ],
  proof: {
    given: L('yozuvning uchinchi soni nolga teng', 'третье число записи равно нулю', 'the third number of the reading equals zero'),
    goal: L('nuqta pastki tekislikda yotadi', 'точка лежит в нижней плоскости', 'the point lies in the lower plane'),
    r1: L("nuqtaning tekislikdan ko'tarilishi nolga teng", 'подъём точки над плоскостью равен нулю', 'the rise of the point above the plane equals zero'),
    r2: L("demak nuqta o'z proyeksiyasi bilan mos tushdi", 'значит точка совпала со своей проекцией', 'so the point has merged with its own projection'),
    r3: L('proyeksiya tekislikda yotadi, demak nuqta ham', 'проекция лежит в плоскости, значит и точка', 'the projection lies in the plane, so does the point'),
    ok: L("Isbotlandi. Uchinchi o'rindagi nol mayda-chuyda emas, shart.", 'Доказано. Ноль в третьем месте это не мелочь, а условие.', 'Proved. A zero in the third place is not a detail but a condition.'),
    e1: L("Proyeksiya haqida keyin. Avval ko'tarilish haqida.", 'Про проекцию дальше. Сначала про подъём.', 'The projection comes later. First about the rise.'),
    e2: L("Ko'tarilish ko'rildi. Bundan proyeksiya uchun nima kelib chiqadi.", 'Подъём разобран. Что из этого следует для проекции.', 'The rise is done. What follows from it for the projection.'),
    e3: L("Mos tushish ko'rsatildi. Endi tekislik haqida xulosa.", 'Совпадение показано. Теперь вывод про плоскость.', 'The merging is shown. Now the conclusion about the plane.'),
  },
  reason: {
    s1: L("uchinchi son tik o'qqa biriktirilgan", 'третье число закреплено за вертикальной осью', 'the third number is tied to the vertical axis'),
    s2: L('proyeksiya perpendikulyarning asosi', 'проекция это основание перпендикуляра', 'the projection is the foot of the perpendicular'),
    s3: L("proyeksiya yasalishi bo'yicha tekislikda yotadi", 'проекция по построению лежит в плоскости', 'the projection lies in the plane by construction'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: '(2; 3; 0) ∈ Oxy',
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
    A('next', 'Endi qadamlar tartibi. Ularni qanday hisoblansa, shunday joylashtiring.', 'Теперь порядок шагов. Расставь их так, как считают.', 'Now the order of the steps. Arrange them the way the counting goes.'),
  ],
  task: {
    ok: L("O'n. Olti va sakkiz o'n beradi.", 'Десять. Шесть и восемь дают десять.', 'Ten. Six and eight give ten.'),
    hint: [
      L("Tik o'qqacha masofa ko'tarilishga bog'liq emas.", 'Расстояние до вертикальной оси не зависит от подъёма.', 'The distance to the vertical axis does not depend on the rise.'),
      L('Birinchi ikki son katetlar kabi ishlaydi.', 'Работают первые два числа, как катеты.', 'The first two numbers work as legs.'),
      L("Olti, sakkiz, o'n.", 'Шесть, восемь, десять.', 'Six, eight, ten.'),
    ],
    prompt: 'A (6; 8; 5),   d(A, Oz) = ?',
    answer: '10',
  },
  order: {
    prompt: L('Qadamlarni hisoblash tartibida joylashtiring', 'Расставь шаги в том порядке, в каком считают', 'Arrange the steps in the order they are computed'),
    title: L('Hisob tartibi', 'Порядок счёта', 'The order of computing'),
    ok: L("Tartib to'g'ri. Proyeksiya, katetlar, kvadratlar yig'indisi, ildiz.", 'Порядок верный. Проекция, катеты, сумма квадратов, корень.', 'The order is right. The projection, the legs, the sum of squares, the root.'),
    bad: L('Bu tartibda emas. Avval nima kerak.', 'Не в этом порядке. Что нужно раньше.', 'Not in this order. What is needed first.'),
    items: ['d', 'A₁', 'x, y', 'x² + y²'],
    answer: 'A₁  x, y  x² + y²  d',
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
    A('mount', "To'rt qator, va ulardan biri sonni boshqa o'rindan oladi.", 'Четыре строки, и одна из них берёт число не с того места.', 'Four lines, and one of them takes a number from the wrong place.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("Berilganlar to'g'ri yozilgan.", 'Данные выписаны верно.', 'The data are written correctly.'),
    r2: L("Proyeksiya to'g'ri topilgan, uchinchi son nol.", 'Проекция найдена верно, третье число ноль.', 'The projection is found correctly, the third number is zero.'),
    r4: L('Perpendikulyarning uzunligi yuqoridagi xato qatordan olingan.', 'Длина перпендикуляра взята из неверной строки выше.', 'The length of the perpendicular is taken from the wrong line above.'),
  },
  proof: L("Karkasni buring: proyeksiya nuqta tagida turadi, va ko'tarilish uchinchi son bo'lib qoladi.", 'Поверни каркас: проекция стоит под точкой, и подъём остаётся третьим числом.', 'Rotate the frame: the projection stands under the point and the rise stays the third number.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L("Uchinchi. Ko'tarilish uchinchi o'rindan emas, ikkinchisidan olingan.", 'Третья. Подъём взяли из второго места, а не из третьего.', 'The third. The rise was taken from the second place, not the third.'),
    hint: [
      L("Ko'tarilish qaysi o'rindan olinganini tekshiring.", 'Проверь, из какого места взят подъём.', 'Check which place the rise was taken from.'),
      L("Ko'tarilish har doim yozuvning uchinchi o'rni.", 'Подъём это всегда третье место записи.', 'The rise is always the third place of the reading.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'A (2; 7; 4)',
    r2: 'A₁ (2; 7; 0)',
    r3: 'd(A, Oxy) = 7',
    r4: 'AA₁ = 7',
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
    A('mount', "Darsni o'ngdan chapga o'qiymiz. Proyeksiya va ko'tarilish berilgan, masofa topish kerak.", 'Прочитаем урок справа налево. Дана проекция и подъём, найти надо расстояние.', 'Let us read the lesson from right to left. The projection and the rise are given, the distance is to be found.'),
    A('work', "To'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны. Их больше одной.', 'Mark all the readings that are correct. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Bu nuqta uchun nima to'g'ri", 'Что верно для этой точки', 'What is true for this point'),
    ok: L('Beshtadan uch yozuv. Qolgan ikkitasi nuqtani proyeksiyasi bilan aralashtiradi.', 'Три записи из пяти. Две оставшиеся путают точку с её проекцией.', 'Three readings out of five. The other two confuse the point with its projection.'),
    items: [
      { id: 'd', label: 'A (5; 12; 0)', hint: L('Bu proyeksiyaning yozuvi, nuqtaning emas.', 'Это запись проекции, а не точки.', 'That is the reading of the projection, not of the point.') },
      { id: 'e', label: 'd(A, Oz) = 9', hint: L("O'qqacha masofa ko'tarilishni olmaydi.", 'Расстояние до оси не берёт подъём.', 'The distance to the axis does not take the rise.') },
      { id: 'a', label: 'A (5; 12; 9)', ok: true },
      { id: 'b', label: 'A₁ (5; 12; 0)', ok: true },
      { id: 'c', label: 'd(A, Oxy) = 9', ok: true },
    ],
  },
  place: {
    prompt: L("Nuqtaning pastki tekislikka proyeksiyasi besh va o'n ikki, bu tekislikkacha masofa esa to'qqiz. Nuqtadan tik o'qqacha masofa qancha?", 'Проекция точки на нижнюю плоскость это пять и двенадцать, а расстояние до этой плоскости девять. Каково расстояние от точки до вертикальной оси?', 'The projection of a point onto the lower plane is five and twelve, and the distance to that plane is nine. What is the distance from the point to the vertical axis?'),
    ok: L("O'n uch. To'qqizning bunga aloqasi yo'q.", 'Тринадцать. Девятка тут не участвует.', 'Thirteen. The nine takes no part here.'),
    wrong: L("O'qqacha masofa proyeksiya bo'yicha hisoblanadi, ko'tarilish unga kirmaydi.", 'Расстояние до оси считают по проекции, подъём в него не входит.', 'The distance to the axis is computed from the projection, the rise does not enter it.'),
    target: '13',
    step: '25 + 144',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'nuqta-proyeksiyasiz',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Fazodagi nuqtani nechta son aniqlaydi?', 'Сколько чисел задаёт точку в пространстве?', 'How many numbers determine a point in space?'),
      done: 'A (x; y; z)',
      items: [
        { id: 'a', label: L('uchta', 'три', 'three'), correct: true },
        { id: 'b', label: L('ikkita', 'два', 'two'), hint: L('Ikkitasi faqat tekislikda yetadi.', 'Двух хватает только в плоскости.', 'Two are enough only in a plane.') },
        { id: 'c', label: L("to'rtta", 'четыре', 'four'), hint: L("Kursda to'rtinchi o'q yo'q.", 'Четвёртой оси в курсе нет.', 'There is no fourth axis in this course.') },
        { id: 'd', label: L('bitta', 'одно', 'one'), hint: L("Bitta son to'g'ri chiziqdagi nuqtani aniqlaydi.", 'Одно число задаёт точку на прямой.', 'One number determines a point on a line.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Ikki noli bor nuqta qayerda yotadi?', 'Где лежит точка с двумя нулями?', 'Where does a point with two zeros lie?'),
      done: '(0; 3; 0) ∈ Oy',
      items: [
        { id: 'a', label: L("o'qda", 'на оси', 'on an axis'), correct: true },
        { id: 'b', label: L('tekislikda', 'в плоскости', 'in a plane'), hint: L('Tekislikka bitta nol yetadi.', 'Для плоскости хватает одного нуля.', 'One zero is enough for a plane.') },
        { id: 'c', label: L('koordinatalar boshida', 'в начале координат', 'at the origin'), hint: L('Koordinatalar boshida nollar uchta.', 'В начале координат нулей три.', 'At the origin there are three zeros.') },
        { id: 'd', label: L('tekisliklardan tashqarida', 'вне плоскостей', 'off the planes'), hint: L("Tekisliklardan tashqarida nollar umuman yo'q.", 'Вне плоскостей нулей нет вовсе.', 'Off the planes there are no zeros at all.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Pastki tekislikkacha masofa nimaga teng?', 'Чему равно расстояние до нижней плоскости?', 'What does the distance to the lower plane equal?'),
      done: 'd(A, Oxy) = z',
      items: [
        { id: 'a', label: L('yozuvning uchinchi soniga', 'третьему числу записи', 'the third number of the reading'), correct: true },
        { id: 'b', label: L('birinchi songa', 'первому числу', 'the first number'), hint: L('Birinchi son proyeksiyani manzillaydi.', 'Первое число адресует проекцию.', 'The first number addresses the projection.') },
        { id: 'c', label: L("uch sonning yig'indisiga", 'сумме трёх чисел', 'the sum of the three numbers'), hint: L("Yig'indi bu yerda geometrik ma'no bermaydi.", 'Сумма не имеет тут геометрического смысла.', 'The sum has no geometric meaning here.') },
        { id: 'd', label: L('qiyaning uzunligiga', 'длине наклонной', 'the length of the slant'), hint: L('Qiya har doim perpendikulyardan uzun.', 'Наклонная всегда длиннее перпендикуляра.', 'A slant is always longer than a perpendicular.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Yozuvning birinchi ikki o'rnida nima turadi?", 'Что стоит на первых двух местах записи?', 'What stands in the first two places of the reading?'),
      done: 'A₁ (x; y; 0)',
      items: [
        { id: 'a', label: L('proyeksiyaning manzili', 'адрес проекции', 'the address of the projection'), correct: true },
        { id: 'b', label: L("ko'tarilish va og'ish", 'подъём и наклон', 'the rise and the slant'), hint: L("Nuqta yozuvida og'ish umuman yo'q.", 'Наклона в записи точки нет вовсе.', 'There is no slant in the reading of a point at all.') },
        { id: 'c', label: L("o'qqacha masofa", 'расстояние до оси', 'the distance to the axis'), hint: L("Masofa ulardan hisoblanadi, lekin o'zi yozuvda turmaydi.", 'Расстояние из них считается, но само в записи не стоит.', 'The distance is computed from them but does not stand in the reading itself.') },
        { id: 'd', label: L('ikki bir xil son', 'два одинаковых числа', 'two equal numbers'), hint: L('Ular faqat maxsus holda teng.', 'Они равны только в особом случае.', 'They are equal only in a special case.') },
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
    A('mount', 'Dars nuqtaga nechta son kerakligi haqidagi savol bilan boshlandi.', 'Урок начался с вопроса, сколько чисел нужно точке.', 'The lesson began with the question how many numbers a point needs.'),
    A('next', "Uchta kerak, va bu shunchaki bittaga ko'p degani emas. Uchinchi son tik o'qqa biriktirilgan, va uni almashtirib bo'lmaydi: o'sha sonlar boshqa tartibda boshqa nuqta beradi. Birinchi ikkitasi proyeksiyani manzillaydi, proyeksiya esa blokning asosiy tekshiruvi, chunki u xatoni har qanday hisobdan oldin ushlaydi. Yozuvdagi nollar bo'sh joy emas, ma'lumot: bitta nol nuqtani tekislikka qo'yadi, ikkitasi o'qqa, uchtasi koordinatalar boshiga. Pastki tekislikkacha masofa to'g'ridan to'g'ri uchinchi sondan o'qiladi, tik o'qqacha esa birinchi ikkitasi bo'yicha hisoblanadi. Keyin vektor paydo bo'ladi, va unda ham uchlik bo'ladi, lekin u manzilni emas, siljishni bildiradi.", 'Нужно три, и это не просто на одно больше. Третье число закреплено за вертикальной осью, и переставить его нельзя: те же числа в другом порядке дают другую точку. Первые два адресуют проекцию, и проекция это главная проверка блока, потому что она ловит ошибку до всякого счёта. Нули в записи не пустое место, а сведения: один нуль ставит точку в плоскость, два на ось, три в начало координат. Расстояние до нижней плоскости читается прямо из третьего числа, а до вертикальной оси считается по первым двум. Дальше появится вектор, и у него тоже будет тройка, но она будет означать не адрес, а сдвиг.', 'Three are needed, and that is not simply one more. The third number is tied to the vertical axis and cannot be moved: the same numbers in another order give another point. The first two address the projection, and the projection is the main check of the block, because it catches a mistake before any counting. The zeros in a reading are not empty places but information: one zero puts the point into a plane, two onto an axis, three at the origin. The distance to the lower plane is read straight from the third number, and the distance to the vertical axis is computed from the first two. Next the vector will appear, and it will also have a triple, but that triple will mean a shift, not an address.'),
  ],
  can: [
    L("Nuqtani ko'z bilan emas, uchlik bo'yicha qo'yaman", 'Ставлю точку по тройке чисел, а не на глаз', 'I place a point by a triple, not by eye'),
    L('Yozuvni proyeksiya bilan tekshiraman', 'Проверяю запись проекцией', 'I check a reading with the projection'),
    L("Nollar bo'yicha nuqta qayerda yotganini o'qiyman", 'Читаю по нулям, где точка лежит', 'I read from the zeros where the point lies'),
    L("Tekislikkacha va o'qqacha masofani hisoblayman", 'Считаю расстояние до плоскости и до оси', 'I compute the distance to a plane and to an axis'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L('Bundan keyin vektor, unda ham uchlik bor, lekin u manzil emas, siljish', 'Дальше вектор — у него тоже тройка, но она не адрес, а сдвиг', 'Next comes the vector: it also has a triple, but that triple is a shift, not an address'),
  lifehack: L('Hisoblashdan oldin proyeksiyani toping: u yozuvdagi xatoni ushlaydi', 'Прежде чем считать, найди проекцию: она ловит ошибку в записи', 'Before computing, find the projection: it catches a mistake in the reading'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L('Programma, sakkizinchi blok', 'Программа, блок восемь', 'The programme, block eight'),
  hook: {
    a: '2',
    b: '3',
  },
  proved: '3',
  law: 'A₁ (x; y; 0)',
  sheet: [
    'A (x; y; z)',
    'A₁ (x; y; 0)',
    'd(A, Oxy) = z',
    '(0; 3; 0) ∈ Oy',
    '(2; 3; 4) ≠ (4; 3; 2)',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/\u2212/g, '-'))

// PRIBOR 6C -- `Space3D`, 11-sinfning fazoviy karkasiga o'ram (space.jsx).
// Asbob qayta yozilmadi: uning o'nta rejimi B8 ning satrlariga to'g'ri keladi.
// O'ram tilni uzatadi va `yaw` nomini moslaydi -- izohi space.jsx da.
const BOX = [4, 4, 4]
const PA = [2, 3, 4]
const PA_FLAT = [2, 3, 0]      // ko'tarilishdan OLDIN: nuqta pastki tekislikda
const B_SWAP = [4, 3, 2]      // o'sha sonlar, boshqa tartib
const ON_AXIS = [0, 3, 0]     // ikki nol -- nuqta o'qda
// QIYA UCHUN ATAYIN NOTO'G'RI ASOS. Asbobning chizg'ichi halol: perpendikulyar
// bo'lmagan kesmani u «qiya» deb belgilaydi va son bermaydi (11-sinf, B5).
const SLANT_FOOT = [4, 1, 0]

const P = (at, more) => [Object.assign({ at, label: 'A' }, more || {})]
const PROJ = { proj: true }
const PROJ_C = { proj: true, coords: true }

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
            fig={<Space3D mode="point" box={BOX} points={P(PA, PROJ)} height={150} />}
            max={230}
            h={158}
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
            fig={<Space3D mode="point" box={BOX} points={P(PA, PROJ)} height={148} />}
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
          <Space3D
            mode="point" box={BOX} axisNums
            points={phase === 0 ? P(PA_FLAT, PROJ) : P(PA, PROJ)}
            height={176}
          />
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <SpinScene
        scene={<Space3D mode="point" box={BOX} points={P(PA, PROJ)} height={176} />}
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
          <Space3D
            mode="point" box={BOX} yaw={phase === 0 ? 0 : 0.7}
            points={P(PA, PROJ_C)} height={176}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space3D mode="point" box={BOX} points={P(PA, PROJ_C)} height={176} />}
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
          <Space3D
            mode="point" box={BOX} axisNums
            points={phase === 0
              ? [{ at: PA, label: 'A', proj: true, coords: true }]
              : [
                { at: PA, label: 'A', proj: true },
                { at: B_SWAP, label: 'B', proj: true, tone: 'accent' },
              ]}
            height={176}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={(
          <Space3D
            mode="point" box={BOX}
            points={[
              { at: PA, label: 'A', proj: true },
              { at: B_SWAP, label: 'B', proj: true, tone: 'accent' },
            ]}
            height={176}
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
          <Space3D
            mode="drop" box={BOX} points={P(PA)}
            drop={phase === 0
              ? { from: PA, to: 'plane:Oxy', foot: SLANT_FOOT }
              : { from: PA, to: 'plane:Oxy' }}
            value={phase === 0 ? 'none' : 'dist'}
            height={176}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={(
          <Space3D
            mode="drop" box={BOX} points={P(PA)}
            drop={{ from: PA, to: 'plane:Oxy' }} value="dist" height={176}
          />
        )}
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
          <Space3D
            mode="point" box={BOX} axisNums
            points={phase === 0 ? P(PA_FLAT, PROJ_C) : P(ON_AXIS, PROJ_C)}
            height={176}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space3D mode="point" box={BOX} points={P(ON_AXIS, PROJ_C)} height={176} />}
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
              <Space3D
                mode="point" box={BOX} yaw={solved ? 0.9 : 0}
                points={P(PA, PROJ_C)} height={190}
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
              <Space3D
                mode="point" box={BOX} yaw={round * 0.3}
                points={P(round === 1 ? ON_AXIS : PA, PROJ)} height={160}
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
