// ============================================================================
// 10-sinf, Dars 44. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS44_KONTENT.md
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
const LESSON_NO = 44
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Fazoda vektorlar`,
  `Урок ${LESSON_NO}. Векторы в пространстве`,
  `Lesson ${LESSON_NO}. Vectors in space`,
)

const BLOCK = { label: 'B8', from: 43, to: 47, current: 44 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('VEKTOR', 'ВЕКТОР', 'THE VECTOR'),
  title: L('Vektorda qaysi uchlik', 'Какая тройка у вектора', 'Which triple belongs to the vector'),
  audio: [
    A('mount', 'Vektor bir bir nol nuqtadan uch ikki ikki nuqtaga boradi.', 'Вектор идёт из точки один один нуль в точку три два два.', 'The vector goes from the point one one zero to the point three two two.'),
    A('r1', "Birinchi yozuv oxirning uchligini oladi, ya'ni uch ikki ikki.", 'Первая запись берёт тройку конца, то есть три два два.', 'The first reading takes the triple of the end, that is three two two.'),
    A('r2', 'Ikkinchisi oxirdan boshni ayiradi.', 'Вторая вычитает начало из конца.', 'The second subtracts the start from the end.'),
    A('ask', "Vektorning oxiri ko'rinadi, va uning uchligi darrov qo'l ostida. Sizningcha qaysi yozuv to'g'ri?", 'Конец у вектора виден, и его тройка сразу под рукой. Как думаешь, какая запись верная?', 'The end of the vector is visible and its triple is right at hand. Which reading do you think is right?'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi vektorni yasaymiz.', 'Твой ответ записан. Сейчас построим вектор.', 'Your answer is recorded. Now we build the vector.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('oxirning uchligi', 'тройка конца', 'the triple of the end'),
      value: '(3; 2; 2)',
    },
    b: {
      name: L('oxir minus boshi', 'конец минус начало', 'the end minus the start'),
      value: '(2; 1; 2)',
    },
  },
  expr: 'A (1; 1; 0),   B (3; 2; 2)',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Kursdan uch savol', 'Три вопроса из курса', 'Three questions from the course'),
  tag: 'support',
  audio: [
    A('mount', "Uchta savol. Darsning qoidasi birinchi va ikkinchidan yig'iladi.", 'Три вопроса. Правило урока соберётся из первого и второго.', 'Three questions. The rule of the lesson will be assembled from the first and the second.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Tekislikda vektorni nima aniqlaydi?', 'Что задаёт вектор на плоскости?', 'What determines a vector on a plane?'),
      done: 'AB',
      items: [
        { id: 'a', label: L("uzunlik va yo'nalish", 'длина и направление', 'the length and the direction'), correct: true },
        { id: 'b', label: L('faqat uzunlik', 'только длина', 'only the length'), hint: L("Bitta uzunlik kam: yo'nalishlar ko'p.", 'Одной длины мало: направлений много.', 'A length alone is not enough: there are many directions.') },
        { id: 'c', label: L("qo'yilish nuqtasi", 'точка приложения', 'the point of application'), hint: L("Ko'chirishdan vektor o'zgarmaydi.", 'От переноса вектор не меняется.', 'A shift does not change a vector.') },
        { id: 'd', label: L("o'q bilan burchak", 'угол с осью', 'the angle with an axis'), hint: L("Burchak yo'nalishni beradi, uzunlikni bermaydi.", 'Угол задаёт направление, но длины не даёт.', 'An angle gives the direction but not the length.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Ikki vektor qachon teng?', 'Когда два вектора равны?', 'When are two vectors equal?'),
      done: 'AB = CD',
      items: [
        { id: 'a', label: L('uchliklari mos tushganda', 'когда совпадают их тройки', 'when their triples coincide'), correct: true },
        { id: 'b', label: L('oxirlari mos tushganda', 'когда совпадают их концы', 'when their ends coincide'), hint: L("Oxirlari boshqa, vektor esa o'sha bo'lishi mumkin.", 'Концы разные, а вектор может быть тот же.', 'The ends differ, and the vector may still be the same.') },
        { id: 'c', label: L("uzunliklari teng bo'lganda", 'когда равны их длины', 'when their lengths are equal'), hint: L('Uzunliklar qarama-qarshi vektorlarda ham teng.', 'Длины равны и у противоположных векторов.', 'Opposite vectors also have equal lengths.') },
        { id: 'd', label: L("bir to'g'ri chiziqda yotganda", 'когда они лежат на одной прямой', 'when they lie on one line'), hint: L("Bir to'g'ri chiziqda ular boshqa tomonga qarashi mumkin.", 'На одной прямой они могут смотреть в разные стороны.', 'On one line they may point in opposite directions.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Uzunlik uchlik bo'yicha qanday hisoblanadi?", 'Как считается длина по тройке?', 'How is a length computed from a triple?'),
      done: '|AB|',
      items: [
        { id: 'a', label: L("kvadratlar yig'indisidan ildiz", 'корень из суммы квадратов', 'the root of the sum of squares'), correct: true },
        { id: 'b', label: L("uch sonning yig'indisi", 'сумма трёх чисел', 'the sum of the three numbers'), hint: L("Yig'indi uzunlikni emas, boshqa sonni beradi.", 'Сумма даёт не длину, а другое число.', 'The sum gives not a length but another number.') },
        { id: 'c', label: L('sonlarning eng kattasi', 'наибольшее из чисел', 'the largest of the numbers'), hint: L("Eng kattasi faqat bitta o'lchov.", 'Наибольшее это только одно измерение.', 'The largest is only one dimension.') },
        { id: 'd', label: L("uch sonning ko'paytmasi", 'произведение трёх чисел', 'the product of the three numbers'), hint: L("Nol bo'lsa, ko'paytma nolga aylanadi.", 'Произведение обнулится, если есть ноль.', 'The product becomes zero if there is a zero.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Oxir minus boshi', 'Конец минус начало', 'The end minus the start'),
  tag: 'vektor-oxiri-emas',
  show: [
    [
      L('boshi bir bir nol nuqtada', 'начало в точке один один нуль', 'the start at the point one one zero'),
      L('oxiri uch ikki ikki nuqtada', 'конец в точке три два два', 'the end at the point three two two'),
    ],
    [
      L("har o'q bo'yicha ayiramiz", 'вычитаем по каждой оси', 'we subtract along each axis'),
      L('vektorning uchligi ikki bir ikki', 'тройка вектора два один два', 'the triple of the vector is two one two'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Vektor chizilgan, va yonida uning boshi va oxirining uchliklari turadi.', 'Вектор нарисован, и рядом стоят тройки его начала и конца.', 'The vector is drawn, and the triples of its start and end stand beside it.'),
    A('move', "Vektorning uchligi nuqtaning manzili emas, siljish: boshdan oxirga borish uchun har o'q bo'yicha qancha yurish kerak. Shuning uchun u ayirish bilan chiqadi, va ayirish bir tomonga, oxirdan boshni. Birinchi o'q bo'yicha uch minus bir ikki beradi. Ikkinchisi bo'yicha ikki minus bir bir beradi. Uchinchisi bo'yicha ikki minus nol ikki beradi. Vektorning uchligi ikki bir ikki, va u oxirning uchligi bilan uchinchi o'rindan boshqa hech qayerda mos tushmadi, u yerda boshi nol edi. Ayni shu nol obmanni yaratadi: boshi koordinatalar boshida bo'lganda vektor va oxirning uchliklari mos tushadi, va har doim shunday deb tuyuladi.", 'Тройка вектора это не адрес точки, а сдвиг: на сколько надо пройти по каждой оси, чтобы попасть из начала в конец. Поэтому она получается вычитанием, и вычитать надо в одну сторону, из конца начало. По первой оси три минус один даёт два. По второй два минус один даёт один. По третьей два минус нуль даёт два. Тройка вектора два один два, и она не совпала с тройкой конца ни в одном месте, кроме третьего, где начало было нулём. Именно этот ноль и создаёт обман: когда начало в самом начале координат, тройки вектора и конца совпадают, и кажется, что так всегда.', 'The triple of a vector is not the address of a point but a shift: how far you must go along each axis to get from the start to the end. That is why it comes out by subtraction, and the subtraction goes one way, the start out of the end. Along the first axis three minus one gives two. Along the second two minus one gives one. Along the third two minus zero gives two. The triple of the vector is two one two, and it did not coincide with the triple of the end anywhere except the third place, where the start was zero. It is exactly that zero that creates the illusion: when the start is at the origin, the triples of the vector and of the end do coincide, and it seems that it is always so.'),
    A('work', "O'zingiz hisoblang. Vektor uchligining birinchi soni qanday?", 'Посчитай сам. Какое первое число у тройки вектора?', 'Work it out yourself. What is the first number of the vector triple?'),
  ],
  work: {
    prompt: L('Vektor uchligining birinchi soni?', 'Первое число тройки вектора?', 'The first number of the vector triple?'),
    ok: L('Ikki. Uch minus bir.', 'Два. Три минус один.', 'Two. Three minus one.'),
    hint: [
      L("Birinchi o'q bo'yicha ayiring.", 'Вычитай по первой оси.', 'Subtract along the first axis.'),
      L('Oxirda u yerda uch, boshida bir.', 'У конца там три, у начала один.', 'The end has three there, the start has one.'),
      L('Ikki.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
  expr: 'AB = B − A',
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Ikki bosh, bitta uchlik', 'Два начала, одна тройка', 'Two starts, one triple'),
  tag: 'vektor-oxiri-emas',
  show: [
    [
      L("o'sha vektor boshqa boshdan", 'тот же вектор из другого начала', 'the same vector from another start'),
      L('strelkalar ajralgan va mos tushmaydi', 'стрелки разведены и не совпадают', 'the arrows are apart and do not coincide'),
    ],
    [
      L('oxirlari ularda boshqa', 'концы у них разные', 'their ends are different'),
      L('uchlik esa bir xil', 'а тройка одна и та же', 'and the triple is one and the same'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "O'sha vektorni boshqa boshdan qo'ydim. Strelkalar ikkita, va ular mos tushmaydi.", 'Тот же вектор я поставил из другого начала. Стрелки две, и они не совпадают.', 'I have placed the same vector from another start. There are two arrows and they do not coincide.'),
    A('move', "Oxirlari boshqa, bu darrov ko'rinadi. Uchliklari esa bir xil, va bu ham kadrda yozilgan. Sahnani buraman: strelkalar yuradi, rakurs o'zgaradi, uchliklarning mos tushishi esa turadi. Demak uchlik vektorga tegishli, uning oxiriga emas: u faqat siljish haqida aytadi va qayerdan boshlaganimizga bog'liq emas. Shundan teng vektorlarning ta'rifi ham chiqadi: uchliklari mos tushganlari teng. Oxirlari emas, chizmadagi joyi emas, aynan uchliklari.", 'Концы у них разные, это видно сразу. А тройки одинаковые, и это тоже написано на кадре. Поворачиваю сцену: стрелки едут, ракурс меняется, а совпадение троек держится. Значит тройка принадлежит вектору, а не его концу: она говорит только про сдвиг, и от места, откуда мы начали, не зависит. Отсюда и определение равных векторов: равны те, у которых совпали тройки. Не концы, не место на чертеже, а именно тройки.', 'Their ends are different, that is visible at once. But their triples are the same, and that is written on the frame too. I turn the scene: the arrows travel, the view changes, and the coincidence of the triples holds. So the triple belongs to the vector and not to its end: it speaks only of the shift and does not depend on where we started. Hence the definition of equal vectors: equal are those whose triples coincide. Not the ends, not the place on the drawing, but exactly the triples.'),
    A('work', "O'zingiz hisoblang. Bu ikki vektorda nechta xil uchlik bor?", 'Посчитай сам. Сколько разных троек у этих двух векторов?', 'Work it out yourself. How many different triples do these two vectors have?'),
  ],
  work: {
    prompt: L('Nechta xil uchlik?', 'Сколько разных троек?', 'How many different triples?'),
    ok: L('Bitta. Bu bir xil vektor.', 'Одна. Это один и тот же вектор.', 'One. It is one and the same vector.'),
    hint: [
      L('Uchliklarni taqqoslang, oxirlarni emas.', 'Сравни тройки, а не концы.', 'Compare the triples, not the ends.'),
      L('Ikki uchlik ham ikki bir ikki.', 'Обе тройки два один два.', 'Both triples are two one two.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
  expr: 'AB = CD = (2; 1; 2)',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Uzunlik uchlik bo'yicha hisoblanadi", 'Длина считается по тройке', 'A length is computed from the triple'),
  tag: 'vektor-oxiri-emas',
  show: [
    [
      L('ikki uch olti vektori', 'вектор два три шесть', 'the vector two three six'),
      L("kvadratlar yig'indisi qirq to'qqiz", 'сумма квадратов сорок девять', 'the sum of squares is forty nine'),
    ],
    [
      L("qirq to'qqizdan ildiz", 'корень из сорока девяти', 'the root of forty nine'),
      L('uzunlik yettiga teng', 'длина равна семи', 'the length equals seven'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Uchligi ikki uch olti bo'lgan vektorni olib, uzunligini topamiz.", 'Возьмём вектор с тройкой два три шесть и найдём его длину.', 'Take a vector with the triple two three six and find its length.'),
    A('move', "Qoida tekislikdagi bilan bir xil, faqat qo'shiluvchilar uchta bo'ldi. Sabab ketma-ket qo'yilgan ikki to'g'ri burchakli uchburchakda: avval pastki tekislik bo'ylab, keyin tepaga. Vektorning pastki tekislikka proyeksiyasi birinchi ikki sonni beradi, va uning uzunligi Pifagor bo'yicha to'rt qo'shuv to'qqizdan ildiz, ya'ni o'n uchdan ildiz. Keyin proyeksiyaning o'zi va ko'tarilish ikkinchi to'g'ri burchakli uchburchakni tashkil qiladi, unda gipotenuza vektorning o'zi. O'n uch qo'shuv o'ttiz olti qirq to'qqiz beradi, va uzunlik yettiga teng. E'tibor bering, kvadratlar manfiy qo'shiluvchi bermaydi, shuning uchun sonlarning ishorasi uzunlikka ta'sir qilmaydi.", 'Правило то же, что на плоскости, только слагаемых стало три. Причина в двух прямоугольных треугольниках, поставленных друг за другом: сначала по нижней плоскости, потом вверх. Проекция вектора на нижнюю плоскость даёт первые два числа, и её длина по Пифагору корень из четырёх плюс девять, то есть корень из тринадцати. Дальше сама проекция и подъём образуют второй прямоугольный треугольник, где гипотенуза уже сам вектор. Тринадцать плюс тридцать шесть даёт сорок девять, и длина равна семи. Заметь, что квадраты не дают отрицательных слагаемых, поэтому знаки чисел на длину не влияют.', 'The rule is the same as on a plane, only the number of terms became three. The reason is two right triangles placed one after another: first along the lower plane, then upwards. The projection of the vector onto the lower plane gives the first two numbers, and its length by Pythagoras is the root of four plus nine, that is the root of thirteen. Then the projection itself and the rise form the second right triangle, whose hypotenuse is the vector itself. Thirteen plus thirty six gives forty nine, and the length equals seven. Note that squares give no negative terms, so the signs of the numbers do not affect the length.'),
    A('work', "O'zingiz hisoblang. Bu vektorning uzunligi qancha?", 'Посчитай сам. Какова длина этого вектора?', 'Work it out yourself. What is the length of this vector?'),
  ],
  work: {
    prompt: L('Vektorning uzunligi?', 'Длина вектора?', 'The length of the vector?'),
    ok: L("Yetti. Ildiz ostida qirq to'qqiz.", 'Семь. Сорок девять под корнем.', 'Seven. Forty nine under the root.'),
    hint: [
      L("Uch sonning kvadratlarini qo'shing.", 'Сложи квадраты трёх чисел.', 'Add the squares of the three numbers.'),
      L("To'rt qo'shuv to'qqiz qo'shuv o'ttiz olti.", 'Четыре плюс девять плюс тридцать шесть.', 'Four plus nine plus thirty six.'),
      L('Yetti.', 'Семь.', 'Seven.'),
    ],
    answer: '7',
  },
  expr: '|AB|² = 4 + 9 + 36',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Ishoralar o'zgardi, uzunlik yo'q", 'Знаки сменились, длина нет', 'The signs changed, the length did not'),
  tag: 'vektor-oxiri-emas',
  show: [
    [
      L('ikki uch olti vektori', 'вектор два три шесть', 'the vector two three six'),
      L('va unga qarama-qarshi', 'и противоположный к нему', 'and its opposite'),
    ],
    [
      L("uch son ham ishorani o'zgartirdi", 'все три числа сменили знак', 'all three numbers changed sign'),
      L("uzunlik esa yetti bo'lib qoldi", 'а длина осталась семь', 'and the length stayed seven'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Vektor yoniga qarama-qarshisini qo'yaman: o'sha uzunlik, teskari yo'nalish.", 'Рядом с вектором поставлю противоположный: та же длина, обратное направление.', 'Beside the vector let me place its opposite: the same length, the reverse direction.'),
    A('move', "Uchlikda uch son ham birdan ishorani o'zgartirdi, va bu tanlov emas, natija: boshi va oxiri o'rin almashdi, demak har ayirish teskari bo'ldi. Uzunlik esa o'zgarmadi, chunki unga sonlar kvadrat bo'lib kiradi, kvadrat esa ishorani eslamaydi. Bundan tekshiruv uchun foydali natija chiqadi: agar vektor va qarama-qarshisining uzunligi boshqa-boshqa chiqsa, xato ishorada emas, hisobning o'zida. Va yana bitta maxsus hol. Boshi va oxiri mos tushsa, uch son ham nolga aylanadi, va nol vektor chiqadi: unda yo'nalish yo'q, uzunlik esa nol.", 'В тройке сменили знак все три числа сразу, и это не выбор, а следствие: поменялись местами начало и конец, значит каждое вычитание перевернулось. Длина при этом не изменилась, потому что в неё числа входят квадратами, а квадрат знака не помнит. Отсюда полезное следствие для проверки: если у тебя вышли две разные длины у вектора и у противоположного, значит ошибка не в знаках, а в самом счёте. И ещё один особый случай. Если начало и конец совпали, все три числа обнулятся, и получится нулевой вектор: у него нет направления, и длина нуль.', 'In the triple all three numbers changed sign at once, and that is not a choice but a consequence: the start and the end swapped places, so every subtraction was reversed. The length did not change, because the numbers enter it as squares, and a square does not remember a sign. Hence a useful consequence for checking: if you got two different lengths for a vector and its opposite, the mistake is not in the signs but in the counting itself. And one more special case. If the start and the end coincide, all three numbers become zero and the zero vector appears: it has no direction and its length is zero.'),
    A('work', "O'zingiz hisoblang. Qarama-qarshi vektorning uzunligi qancha?", 'Посчитай сам. Какова длина противоположного вектора?', 'Work it out yourself. What is the length of the opposite vector?'),
  ],
  work: {
    prompt: L('Qarama-qarshining uzunligi?', 'Длина противоположного?', 'The length of the opposite?'),
    ok: L('Yetti. Kvadrat ishorani eslamaydi.', 'Семь. Квадрат знака не помнит.', 'Seven. A square does not remember a sign.'),
    hint: [
      L('Ildiz ostida nima turganiga qarang.', 'Посмотри, что стоит под корнем.', 'Look at what stands under the root.'),
      L('Ikkisida ham kvadratlar bir xil.', 'Квадраты у обоих одинаковые.', 'Both have the same squares.'),
      L('Yetti.', 'Семь.', 'Seven.'),
    ],
    answer: '7',
  },
  expr: 'BA = (−2; −3; −6)',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE EDGE CASE'),
  title: L('Harflar tartibi bezak emas', 'Порядок букв не украшение', 'The order of the letters is no ornament'),
  tag: 'ayirma-tartibi',
  show: [
    [
      L('A B yozuvi va B A yozuvi', 'запись A B и запись B A', 'the reading A B and the reading B A'),
      L('kesmasi ularda bitta', 'отрезок у них один', 'they have one and the same segment'),
    ],
    [
      L('strelkalar esa turlicha qaraydi', 'а стрелки смотрят врозь', 'but the arrows point apart'),
      L('uchliklar ishora bilan farq qiladi', 'тройки отличаются знаком', 'the triples differ by sign'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Ikki nuqta orasidagi kesma bitta, undagi vektorlar esa ikkita.', 'Отрезок между двумя точками один, а векторов на нём два.', 'The segment between two points is one, but there are two vectors on it.'),
    A('move', "A B yozuvi A dan B ga degani, B A yozuvi esa teskarisi. Bu bezakdagi mayda-chuyda emas, boshqa obyekt: uchliklari har sonda ishora bilan farq qiladi, va uchliklar qo'shiladigan masalalarda harflar tartibi javobni hal qiladi. Tekshiruv oddiy va har doim ishlaydi: birinchi harf boshi, undan ayiriladi. Agar oxirning uchligi chiqsa, demak ayirish o'tkazib yuborilgan. Masalalarda chalkashmaslik uchun esa yozuvni marshrut kabi ovoz chiqarib o'qing: birinchi harfdan ikkinchisiga. Ikki yozuvning uzunligi bir xil, shuning uchun tartibdagi xatoni uzunlik bilan ushlab bo'lmaydi.", 'Запись A B значит из A в B, запись B A значит наоборот. Это не мелочь оформления, а другой объект: тройки у них отличаются знаком у каждого числа, и в задачах, где тройки складывают, порядок букв решает ответ. Проверка простая и работает всегда: первая буква это начало, из неё вычитают. Если получилась тройка конца, значит вычитание пропустили. А чтобы не путаться в задачах, читай запись вслух как маршрут: из первой буквы во вторую. Длины у обеих записей одинаковые, и потому по длине ошибку в порядке не поймать.', 'The reading A B means from A to B, the reading B A means the other way. That is not a detail of style but a different object: their triples differ in the sign of every number, and in problems where triples are added the order of the letters decides the answer. The check is simple and always works: the first letter is the start, it is what you subtract. If you got the triple of the end, the subtraction was skipped. And to avoid confusion in problems, read the notation aloud as a route: from the first letter to the second. The lengths of both readings are the same, and that is why a mistake in the order cannot be caught by the length.'),
    A('work', "O'zingiz hisoblang. Ikki yozuvdan nechtasi ikki bir ikki uchligini beradi?", 'Посчитай сам. Сколько из двух записей дают тройку два один два?', 'Work it out yourself. How many of the two readings give the triple two one two?'),
  ],
  work: {
    prompt: L('Nechta yozuv ikki bir ikki beradi?', 'Сколько записей дают два один два?', 'How many readings give two one two?'),
    ok: L('Bittasi. Ikkinchisida barcha ishoralar teskari.', 'Одна. У второй все знаки обратные.', 'One. The second has all the signs reversed.'),
    hint: [
      L('Qaysi harf birinchi turganini tekshiring.', 'Проверь, какая буква стоит первой.', 'Check which letter stands first.'),
      L('Birinchi harfdan ayiriladi.', 'Из первой буквы вычитают.', 'The first letter is what you subtract.'),
      L('Bittasi.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
  expr: 'AB = −BA',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Vektorning uchligi', 'Тройка вектора', 'The triple of a vector'),
  tag: 'vektor-oxiri-emas',
  motion: ['rule'],
  audio: [
    A('mount', 'Farqlashga bitta savol, keyin kartochka.', 'Один вопрос на различение, потом карточка.', 'One question to tell them apart, then the card.'),
    A('rule', "Birinchi satr butun darsga javob beradi: uchlik siljish, va u ayirish bilan olinadi. Ikkinchi satr vektorni nega ko'chirish mumkinligini tushuntiradi: uchlik o'sha bo'lsa, bu o'sha vektor, va chizmadagi joyning ahamiyati yo'q. Uchinchisi uzunlikni beradi, va unda ishoralar kvadratlar ostida yo'qoladi. Imtihonda foydali odat: hisoblashdan oldin harflar tartibini tekshiring. Oxirning uchligi va vektorning uchligi faqat boshi koordinatalar boshida turganda mos tushadi, va bu kamdan-kam hol, qoida emas.", 'Первая строка отвечает на весь урок: тройка это сдвиг, и берётся она вычитанием. Вторая строка объясняет, почему вектор можно переносить: если тройка та же, это тот же вектор, и место на чертеже ничего не значит. Третья даёт длину, и в ней знаки исчезают под квадратами. Полезная привычка на экзамене: прежде чем считать, проверь порядок букв. Тройка конца и тройка вектора совпадают только тогда, когда начало стоит в начале координат, а это редкий случай, а не правило.', 'The first line answers the whole lesson: the triple is a shift, and it is taken by subtraction. The second line explains why a vector may be moved: if the triple is the same, it is the same vector, and the place on the drawing means nothing. The third gives the length, and in it the signs disappear under the squares. A useful habit at the exam: before computing, check the order of the letters. The triple of the end and the triple of the vector coincide only when the start stands at the origin, and that is a rare case, not a rule.'),
  ],
  probe: {
    question: L('Uchlik nimaga tegishli?', 'Чему принадлежит тройка?', 'What does the triple belong to?'),
    items: [
      { id: 'a', label: L('vektorga, oxiriga emas', 'вектору, а не его концу', 'to the vector, not to its end'), correct: true },
      { id: 'b', label: L('vektorning oxiriga', 'концу вектора', 'to the end of the vector'), hint: L("U holda vektorni ko'chirish uchlikni o'zgartirardi, lekin o'zgartirmaydi.", 'Тогда перенос вектора менял бы тройку, а он не меняет.', 'Then shifting the vector would change the triple, and it does not.') },
    ],
  },
  rule: {
    lawLabel: L("Uchlik bo'yicha vektor", 'Вектор по тройке', 'A vector by its triple'),
    lines: [
      L('vektorning uchligi oxir minus boshi', 'тройка вектора это конец минус начало', 'the triple of a vector is the end minus the start'),
      L('teng vektorlar bitta uchlikli vektorlar', 'равные векторы это векторы с одной тройкой', 'equal vectors are vectors with one triple'),
      L("uzunlik kvadratlar yig'indisidan ildiz", 'длина это корень из суммы квадратов', 'the length is the root of the sum of squares'),
    ],
    law: 'AB = B − A',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Uchlik va uzunlik', 'Тройка и длина', 'The triple and the length'),
  tag: 'vektor-oxiri-emas',
  audio: [
    A('mount', "To'rt uchlik va to'rt uzunlik. Kvadratlarni qo'shing.", 'Четыре тройки и четыре длины. Складывай квадраты.', 'Four triples and four lengths. Add the squares.'),
  ],
  match: {
    prompt: L('Uchlikni uzunlik bilan birlashtiring', 'Соедини тройку с длиной', 'Match the triple with the length'),
    ok: L("To'rttasi ham joyida. Ishoralar uzunlikka kirmaydi.", 'Все четыре на месте. Знаки в длину не входят.', 'All four in place. The signs do not enter the length.'),
    a: L('uch', 'три', 'three'),
    b: L('besh', 'пять', 'five'),
    c: L('yetti', 'семь', 'seven'),
    d: L("o'n bir", 'одиннадцать', 'eleven'),
    left: ['(1; 2; 2)', '(3; 4; 0)', '(2; 3; 6)', '(6; 6; 7)'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Vektorlar teng ekanini isbotlang', 'Докажи, что векторы равны', 'Prove the vectors are equal'),
  tag: 'vektor-oxiri-emas',
  audio: [
    A('mount', "Uch qator, va har birining ro'yxatdan o'z asoslashi bor.", 'Три строки, и у каждой своё обоснование из списка.', 'Three lines, each with its own justification from the list.'),
  ],
  proof: {
    given: L("to'rt nuqta, ikki juft", 'четыре точки, две пары', 'four points, two pairs'),
    goal: L('AB va CD vektorlari teng', 'векторы AB и CD равны', 'the vectors AB and CD are equal'),
    r1: L('birinchi vektorning uchligi ikki bir ikki', 'тройка первого вектора два один два', 'the triple of the first vector is two one two'),
    r2: L('ikkinchi vektorning uchligi ikki bir ikki', 'тройка второго вектора два один два', 'the triple of the second vector is two one two'),
    r3: L('uchliklar mos tushdi, demak vektorlar teng', 'тройки совпали, значит векторы равны', 'the triples coincide, so the vectors are equal'),
    ok: L("Isbotlandi. Chizmadagi boshqa joylar tenglikka to'sqinlik qilmaydi.", 'Доказано. Разные места на чертеже равенству не мешают.', 'Proved. Different places on the drawing do not prevent equality.'),
    e1: L('Ikkinchi vektor haqida keyin. Avval birinchisi.', 'Про второй вектор дальше. Сначала первый.', 'The second vector comes later. First the first one.'),
    e2: L('Birinchisi hisoblandi. Endi ikkinchisi.', 'Первый посчитан. Теперь второй.', 'The first is computed. Now the second.'),
    e3: L('Ikki uchlik ham bor. Endi xulosa.', 'Обе тройки есть. Теперь вывод.', 'Both triples are there. Now the conclusion.'),
  },
  reason: {
    s1: L('ayirish oxir minus boshi', 'вычитание конец минус начало', 'the subtraction end minus start'),
    s2: L("ikkinchi juft uchun o'sha ayirish", 'то же вычитание для второй пары', 'the same subtraction for the second pair'),
    s3: L("teng vektorlar ta'rifi", 'определение равных векторов', 'the definition of equal vectors'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: 'AB = CD = (2; 1; 2)',
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
    ok: L('Yigirma besh. Ildiz ostida olti yuz yigirma besh.', 'Двадцать пять. Шестьсот двадцать пять под корнем.', 'Twenty five. Six hundred twenty five under the root.'),
    hint: [
      L("Uch sonning kvadratlarini qo'shing.", 'Сложи квадраты трёх чисел.', 'Add the squares of the three numbers.'),
      L("Sakson bir, bir yuz qirq to'rt, to'rt yuz.", 'Восемьдесят один, сто сорок четыре, четыреста.', 'Eighty one, one hundred forty four, four hundred.'),
      L('Yigirma besh.', 'Двадцать пять.', 'Twenty five.'),
    ],
    prompt: 'AB = (9; 12; 20),   |AB| = ?',
    answer: '25',
  },
  order: {
    prompt: L('Qadamlarni hisoblash tartibida joylashtiring', 'Расставь шаги в том порядке, в каком считают', 'Arrange the steps in the order they are computed'),
    title: L('Hisob tartibi', 'Порядок счёта', 'The order of computing'),
    ok: L("Tartib to'g'ri. Ayirish, uchlik, kvadratlar, ildiz.", 'Порядок верный. Вычитание, тройка, квадраты, корень.', 'The order is right. The subtraction, the triple, the squares, the root.'),
    bad: L('Bu tartibda emas. Avval nima kerak.', 'Не в этом порядке. Что нужно раньше.', 'Not in this order. What is needed first.'),
    items: ['|AB|', 'B − A', 'AB', 'x² + y² + z²'],
    answer: 'B − A  AB  x² + y² + z²  |AB|',
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
    A('mount', "To'rt qator, va ulardan biri ayirishni o'tkazib yuboradi.", 'Четыре строки, и одна из них пропускает вычитание.', 'Four lines, and one of them skips the subtraction.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("Berilganlar to'g'ri yozilgan.", 'Данные выписаны верно.', 'The data are written correctly.'),
    r2: L("Qoida to'g'ri yozilgan.", 'Правило записано верно.', 'The rule is written correctly.'),
    r4: L("Kvadratlar yuqoridagi xato qator bo'yicha hisoblangan.", 'Квадраты посчитаны по неверной строке выше.', 'The squares are computed from the wrong line above.'),
  },
  proof: L("Sahnani buring: vektorning uchligi ko'chirishda o'zgarmaydi, oxirning uchligi esa o'zgaradi.", 'Поверни сцену: тройка вектора не меняется при переносе, а тройка конца меняется.', 'Rotate the scene: the triple of the vector does not change under a shift, the triple of the end does.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L("Uchinchi. Ayirish o'rniga oxirning uchligi olingan.", 'Третья. Взяли тройку конца вместо вычитания.', 'The third. The triple of the end was taken instead of the subtraction.'),
    hint: [
      L("Ikkinchi qatorning qoidasi qayerda qo'llanganini tekshiring.", 'Проверь, где применено правило второй строки.', 'Check where the rule of the second line was applied.'),
      L('Natijani oxirning uchligi bilan taqqoslang.', 'Сравни результат с тройкой конца.', 'Compare the result with the triple of the end.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'A (1; 1; 0),   B (3; 2; 2)',
    r2: 'AB = B − A',
    r3: 'AB = (3; 2; 2)',
    r4: '|AB|² = 17',
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
    A('mount', "Darsni o'ngdan chapga o'qiymiz. Boshi va uchligi berilgan, oxirini topish kerak.", 'Прочитаем урок справа налево. Дано начало и тройка, найти надо конец.', 'Let us read the lesson from right to left. The start and the triple are given, the end is to be found.'),
    A('work', "To'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны. Их больше одной.', 'Mark all the readings that are correct. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Bu vektor uchun nima to'g'ri", 'Что верно для этого вектора', 'What is true for this vector'),
    ok: L('Beshtadan uch yozuv. Qolgan ikkitasi vektorni oxiri bilan aralashtiradi.', 'Три записи из пяти. Две оставшиеся путают вектор с его концом.', 'Three readings out of five. The other two confuse the vector with its end.'),
    items: [
      { id: 'd', label: 'B (2; 2; 1)', hint: L('Bu vektorning uchligi, oxirning emas.', 'Это тройка вектора, а не конца.', 'That is the triple of the vector, not of the end.') },
      { id: 'e', label: '|AB| = 9', hint: L("Ildiz ostida to'qqiz, demak uzunlik uch.", 'Под корнем девять, значит длина три.', 'Under the root there is nine, so the length is three.') },
      { id: 'a', label: 'AB = (2; 2; 1)', ok: true },
      { id: 'b', label: 'B (3; 4; 4)', ok: true },
      { id: 'c', label: '|AB| = 3', ok: true },
    ],
  },
  place: {
    prompt: L('Vektorning boshi bir ikki uch nuqtada, uchligi esa ikki ikki bir. Oxirining uchinchi soni qanday?', 'Начало вектора в точке один два три, а тройка вектора два два один. Каково третье число конца?', 'The start of a vector is at the point one two three, and the triple of the vector is two two one. What is the third number of the end?'),
    ok: L("To'rt. Uch qo'shuv bir.", 'Четыре. Три плюс один.', 'Four. Three plus one.'),
    wrong: L("Uchlik boshga qo'shiladi, oxir o'rniga olinmaydi.", 'Тройку прибавляют к началу, а не берут вместо конца.', 'The triple is added to the start, not taken instead of the end.'),
    target: '4',
    step: '3 + 1',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'vektor-oxiri-emas',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Vektorning uchligi qanday olinadi?', 'Как берётся тройка вектора?', 'How is the triple of a vector taken?'),
      done: 'AB = B − A',
      items: [
        { id: 'a', label: L('oxir minus boshi', 'конец минус начало', 'the end minus the start'), correct: true },
        { id: 'b', label: L('boshi minus oxir', 'начало минус конец', 'the start minus the end'), hint: L('Bu qarama-qarshi vektorni beradi.', 'Это даст противоположный вектор.', 'That will give the opposite vector.') },
        { id: 'c', label: L('oxirning uchligi', 'тройка конца', 'the triple of the end'), hint: L("Bu faqat boshi koordinatalar boshida bo'lganda chiqadi.", 'Так выходит только при начале в начале координат.', 'That comes out only when the start is at the origin.') },
        { id: 'd', label: L("uchliklar yig'indisi", 'сумма троек', 'the sum of the triples'), hint: L("Yig'indi boshqa amalga tegishli.", 'Сумма относится к другому действию.', 'The sum belongs to another operation.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Vektorlar qachon teng?', 'Когда векторы равны?', 'When are vectors equal?'),
      done: 'AB = CD',
      items: [
        { id: 'a', label: L('uchliklari mos tushganda', 'когда совпадают тройки', 'when their triples coincide'), correct: true },
        { id: 'b', label: L('oxirlari mos tushganda', 'когда совпадают концы', 'when their ends coincide'), hint: L("Oxirlari boshqa, vektor esa o'sha.", 'Концы разные, а вектор тот же.', 'The ends differ and the vector is the same.') },
        { id: 'c', label: L("uzunliklari teng bo'lganda", 'когда равны длины', 'when their lengths are equal'), hint: L('Uzunliklar qarama-qarshilarda ham teng.', 'Длины равны и у противоположных.', 'Opposites have equal lengths too.') },
        { id: 'd', label: L("yonma-yon bo'lganda", 'когда они рядом', 'when they are side by side'), hint: L("Chizmadagi joyning ishga aloqasi yo'q.", 'Место на чертеже к делу не относится.', 'The place on the drawing is irrelevant.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Bir ikki ikki vektorining uzunligi nimaga teng?', 'Чему равна длина вектора один два два?', 'What is the length of the vector one two two?'),
      done: '3',
      items: [
        { id: 'a', label: L('uch', 'три', 'three'), correct: true },
        { id: 'b', label: L('besh', 'пять', 'five'), hint: L("Besh uch sonning yig'indisi, uzunlik emas.", 'Пять это сумма трёх чисел, а не длина.', 'Five is the sum of the three numbers, not the length.') },
        { id: 'c', label: L("to'qqiz", 'девять', 'nine'), hint: L("To'qqiz ildiz ostida turadi.", 'Девять стоит под корнем.', 'Nine stands under the root.') },
        { id: 'd', label: L('ikki', 'два', 'two'), hint: L('Ikki sonlarning eng kattasi.', 'Два это наибольшее из чисел.', 'Two is the largest of the numbers.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('B A dan A B nimasi bilan farq qiladi?', 'Чем отличается B A от A B?', 'How does B A differ from A B?'),
      done: 'AB = −BA',
      items: [
        { id: 'a', label: L('uch sonning ishorasi bilan', 'знаком всех трёх чисел', 'by the sign of all three numbers'), correct: true },
        { id: 'b', label: L('uzunligi bilan', 'длиной', 'by the length'), hint: L('Ularning uzunligi bir xil.', 'Длины у них одинаковые.', 'Their lengths are the same.') },
        { id: 'c', label: L('hech nimasi bilan', 'ничем', 'by nothing'), hint: L("U holda uchliklarni qo'shish boshqa javob berardi.", 'Тогда сложение троек давало бы другой ответ.', 'Then adding the triples would give another answer.') },
        { id: 'd', label: L('faqat birinchi soni bilan', 'только первым числом', 'only by the first number'), hint: L("Ishora har sonda o'zgaradi.", 'Знак меняется у каждого числа.', 'The sign changes for every number.') },
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
    A('mount', 'Dars qaysi uchlik vektorga tegishli degan savol bilan boshlandi.', 'Урок начался с вопроса, какая тройка принадлежит вектору.', 'The lesson began with the question which triple belongs to the vector.'),
    A('next', "Oxirning uchligi o'sha bo'lmadi, va sabab e'tiborsizlikda emas. Vektorning uchligi manzil emas, siljish: u har o'q bo'yicha qancha yurish kerakligini aytadi, va shuning uchun ayirish bilan, oxirdan boshni olib chiqadi. Qolgani shundan. Bir xil vektorni ixtiyoriy boshdan qo'yish mumkin, uchlik o'zgarmaydi, oxirlari esa boshqa bo'ladi -- demak teng vektorlar uchliklari mos tushganlari. Uzunlik kvadratlar yig'indisidan ildiz bilan hisoblanadi, va ishoralar unga o'tmaydi, shuning uchun vektor va qarama-qarshisining uzunligi bitta. Harflar tartibi esa hal qiladi: A B va B A har sonning ishorasi bilan farq qiladi. Keyin uchliklar qo'shila boshlaydi.", 'Тройка конца оказалась не той, и причина не в невнимательности. Тройка вектора это сдвиг, а не адрес: она говорит, на сколько пройти по каждой оси, и потому берётся вычитанием, из конца начало. Отсюда всё остальное. Один и тот же вектор можно поставить из любого начала, и тройка не изменится, а концы будут разные, и значит равные векторы это те, у которых совпали тройки. Длина считается корнем из суммы квадратов, и знаки в неё не проходят, поэтому у вектора и противоположного длина одна. А порядок букв решает: A B и B A отличаются знаком у каждого числа. Дальше тройки начнут складывать.', 'The triple of the end turned out to be the wrong one, and the reason is not carelessness. The triple of a vector is a shift and not an address: it says how far to go along each axis, and that is why it is taken by subtraction, the start out of the end. Everything else follows. One and the same vector can be placed from any start, and the triple will not change while the ends will differ, so equal vectors are those whose triples coincide. The length is computed as the root of the sum of squares, and the signs do not pass into it, so a vector and its opposite have one length. And the order of the letters decides: A B and B A differ in the sign of every number. Next the triples will start being added.'),
  ],
  can: [
    L('Vektorning uchligini ayirish bilan olaman', 'Беру тройку вектора вычитанием', 'I take the triple of a vector by subtraction'),
    L('Vektorning uchligini nuqtaning uchligidan ajrataman', 'Различаю тройку вектора и тройку точки', 'I tell the triple of a vector from the triple of a point'),
    L("Uzunlikni uch son bo'yicha hisoblayman", 'Считаю длину по трём числам', 'I compute a length from three numbers'),
    L("Harflar tartibini marshrut kabi o'qiyman", 'Читаю порядок букв как маршрут', 'I read the order of the letters as a route'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L("Bundan keyin amallar, uchliklar qo'shila va songa ko'paytirila boshlaydi", 'Дальше действия — тройки начнут складывать и умножать на число', 'Next come the operations: the triples will be added and multiplied by a number'),
  lifehack: L("Hisoblashdan oldin yozuvni marshrut kabi o'qing: birinchi harfdan ikkinchisiga", 'Прежде чем считать, прочитай запись как маршрут: из первой буквы во вторую', 'Before computing, read the notation as a route: from the first letter to the second'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L('Programma, sakkizinchi blok', 'Программа, блок восемь', 'The programme, block eight'),
  hook: {
    a: '(3; 2; 2)',
    b: '(2; 1; 2)',
  },
  proved: '(2; 1; 2)',
  law: 'AB = B − A',
  sheet: [
    'AB = B − A',
    'AB = CD',
    '|AB|² = x² + y² + z²',
    'AB = −BA',
    '|AB| = |BA|',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/\u2212/g, '-'))

// PRIBOR 6C -- `Space3D`, 11-sinfning fazoviy karkasiga o'ram (space.jsx).
// O'ram tilni, rakurs nomini, kenglikni va yozuvning masshtabini moslaydi --
// to'rttasi ham o'lchov bilan topilgan, izohi o'sha faylda.
const BOX = [4, 4, 4]
const PA = [1, 1, 0]
const PB = [3, 2, 2]          // AB uchligi (2; 1; 2), uzunligi 3
// SHOHID: O'SHA vektor boshqa boshdan. Siljish (0; 2; 1) ATAYIN tanlangan:
// (1; 1; 0) kabi siljishda ikki strelka proyeksiyada bir-birining ustiga
// tushadi -- bu 11-sinfda bo'lgan grabli, va u vektorning o'zida emas,
// STRELKALAR ORASIDAGI siljishda vujudga keladi. Stendda tekshirilgan.
const PC = [1, 3, 1]
const PD = [3, 4, 3]
const LONG = [2, 3, 6]        // uzunligi 7: 4 + 9 + 36 = 49
const LONG_BACK = [-2, -3, -6]

const VEC = (from, to, more) => [Object.assign({ from, to, label: 'a' }, more || {})]
const CO = { coords: true }

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
            fig={(
              <Space3D
                mode="vec" box={BOX}
                points={[{ at: PA, label: 'A' }, { at: PB, label: 'B' }]}
                vectors={VEC(PA, PB)}
              />
            )}
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
            fig={<Space3D mode="vec" box={BOX} vectors={VEC(PA, PB, CO)} />}
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
          phase === 0 ? (
            <Space3D
              mode="point" box={BOX} axisNums
              points={[
                { at: PA, label: 'A', coords: true },
                { at: PB, label: 'B', coords: true },
              ]}
            />
          ) : (
            <Space3D
              mode="vec" box={BOX} axisNums
              points={[{ at: PA, label: 'A' }, { at: PB, label: 'B' }]}
              vectors={VEC(PA, PB, CO)}
            />
          )
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <SpinScene
        scene={<Space3D mode="vec" box={BOX} vectors={VEC(PA, PB, CO)} />}
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
            mode="vec" box={BOX} yaw={phase === 0 ? 0 : 0.7}
            vectors={[
              { from: PA, to: PB, label: 'a', coords: true },
              { from: PC, to: PD, label: 'b', coords: true, tone: 'accent' },
            ]}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={(
          <Space3D
            mode="vec" box={BOX}
            vectors={[
              { from: PA, to: PB, label: 'a', coords: true },
              { from: PC, to: PD, label: 'b', coords: true, tone: 'accent' },
            ]}
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
          <Space3D
            mode="vec" box={BOX}
            vectors={VEC([0, 0, 0], LONG, CO)}
            value={phase === 0 ? 'none' : 'len'}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={(
          <Space3D mode="vec" box={BOX} vectors={VEC([0, 0, 0], LONG, CO)} value="len" />
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
            mode="vec" box={BOX}
            vectors={phase === 0
              ? VEC([0, 0, 0], LONG, CO)
              : [
                { from: [0, 0, 0], to: LONG, label: 'a', coords: true },
                { from: [0, 0, 0], to: LONG_BACK, label: 'b', coords: true, tone: 'accent' },
              ]}
            value="len"
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={(
          <Space3D
            mode="vec" box={BOX}
            vectors={[
              { from: [0, 0, 0], to: LONG, label: 'a' },
              { from: [0, 0, 0], to: LONG_BACK, label: 'b', coords: true, tone: 'accent' },
            ]}
            value="len"
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
            mode="vec" box={BOX}
            points={[{ at: PA, label: 'A' }, { at: PB, label: 'B' }]}
            vectors={phase === 0
              ? VEC(PA, PB, CO)
              : [
                { from: PA, to: PB, label: 'a', coords: true },
                { from: PB, to: PA, label: 'b', coords: true, tone: 'accent', dash: true },
              ]}
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={(
          <Space3D
            mode="vec" box={BOX}
            points={[{ at: PA, label: 'A' }, { at: PB, label: 'B' }]}
            vectors={[
              { from: PA, to: PB, label: 'a', coords: true },
              { from: PB, to: PA, label: 'b', coords: true, tone: 'accent', dash: true },
            ]}
          />
        )}
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
                mode="vec" box={BOX} yaw={solved ? 0.9 : 0}
                points={[{ at: PA, label: 'A' }, { at: PB, label: 'B' }]}
                vectors={VEC(PA, PB, CO)}
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
                mode="vec" box={BOX} yaw={round * 0.3}
                vectors={VEC(PA, PB, round === 1 ? CO : null)}
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
