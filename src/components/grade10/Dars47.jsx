// ============================================================================
// 10-sinf, Dars 47. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS47_KONTENT.md
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
const LESSON_NO = 47
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Tekislik tenglamasi`,
  `Урок ${LESSON_NO}. Уравнение плоскости`,
  `Lesson ${LESSON_NO}. The equation of a plane`,
)

const BLOCK = { label: 'B8', from: 43, to: 47, current: 47 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('TEKISLIK', 'ПЛОСКОСТЬ', 'THE PLANE'),
  title: L('Tenglamadagi uchlik nima', 'Что за тройка в уравнении', 'What the triple in the equation is'),
  audio: [
    A('mount', 'Tekislik tenglamasi, va unda uch koeffitsiyent: bir, ikki va ikki.', 'Уравнение плоскости, и в нём три коэффициента: один, два и два.', 'The equation of a plane, and in it three coefficients: one, two and two.'),
    A('r1', 'Birinchi yozuv bu tekislikning nuqtasi deydi.', 'Первая запись говорит, что это точка плоскости.', 'The first reading says it is a point of the plane.'),
    A('r2', 'Ikkinchisi bu normal deydi.', 'Вторая говорит, что это нормаль.', 'The second says it is a normal.'),
    A('ask', "Uch son nuqtaning manzili kabi ko'rinadi, va bu chalkashtiradi. Sizningcha qaysi yozuv to'g'ri?", 'Тройка чисел выглядит как адрес точки, и это сбивает. Как думаешь, какая запись верная?', 'The triple of numbers looks like the address of a point, and that misleads. Which reading do you think is right?'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi almashtirib qo'yib tekshiramiz.", 'Твой ответ записан. Сейчас проверим подстановкой.', 'Your answer is recorded. Now we check by substitution.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('tekislikning nuqtasi', 'точка плоскости', 'a point of the plane'),
      value: 'M (1; 2; 2)',
    },
    b: {
      name: L('tekislikning normali', 'нормаль плоскости', 'a normal of the plane'),
      value: 'n (1; 2; 2)',
    },
  },
  expr: 'x + 2y + 2z − 6 = 0',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Blokdan uch savol', 'Три вопроса из блока', 'Three questions from the block'),
  tag: 'support',
  audio: [
    A('mount', "Uchta savol. Darsning qoidasi birinchi va ikkinchidan yig'iladi.", 'Три вопроса. Правило урока соберётся из первого и второго.', 'Three questions. The rule of the lesson will be assembled from the first and the second.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Nuqta chiziqda yoki tekislikda yotganini qanday tekshiriladi?', 'Как проверить, лежит ли точка на линии или плоскости?', 'How do you check whether a point lies on a line or a plane?'),
      done: 'x + 2y + 2z − 6 = 0',
      items: [
        { id: 'a', label: L("uning sonlarini tenglamaga qo'yib ko'rish", 'подставить её числа в уравнение', 'substitute its numbers into the equation'), correct: true },
        { id: 'b', label: L('chizmaga qarash', 'посмотреть на чертёж', 'look at the drawing'), hint: L("Chizma ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж показывает один ракурс из многих.', 'A drawing shows one view out of many.') },
        { id: 'c', label: L('uzunliklarni taqqoslash', 'сравнить длины', 'compare the lengths'), hint: L('Uzunlik tegishlilik haqida hech narsa aytmaydi.', 'Длина про принадлежность ничего не говорит.', 'A length says nothing about belonging.') },
        { id: 'd', label: L('sonlarning ishorasini tekshirish', 'проверить знак чисел', 'check the sign of the numbers'), hint: L("Ishora o'zi hech narsani hal qilmaydi.", 'Знак сам по себе ничего не решает.', 'A sign by itself decides nothing.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Nol skalyar ko'paytma nimani bildiradi?", 'Что означает нулевое скалярное произведение?', 'What does a zero dot product mean?'),
      done: 'n·v = 0',
      items: [
        { id: 'a', label: L('nolmas vektorlarning perpendikulyarligi', 'перпендикулярность ненулевых векторов', 'the perpendicularity of non zero vectors'), correct: true },
        { id: 'b', label: L('vektorlarning tengligi', 'равенство векторов', 'the equality of the vectors'), hint: L("Tenglarda ko'paytma uzunlik kvadrati.", 'У равных произведение это квадрат длины.', 'For equal vectors the product is the square of the length.') },
        { id: 'c', label: L('ikki vektor ham nol ekanini', 'что оба вектора нулевые', 'that both vectors are zero'), hint: L('Nol nolmaslarda ham chiqadi.', 'Ноль выходит и у ненулевых.', 'Zero comes out for non zero vectors too.') },
        { id: 'd', label: L("o'tmas burchak", 'тупой угол', 'an obtuse angle'), hint: L("O'tmasda ko'paytma manfiy.", 'У тупого произведение отрицательное.', 'For an obtuse angle the product is negative.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Bir ikki ikki uchligining uzunligi qancha?', 'Чему равна длина тройки один два два?', 'What is the length of the triple one two two?'),
      done: '|n| = 3',
      items: [
        { id: 'a', label: L('uchga', 'трём', 'three'), correct: true },
        { id: 'b', label: L('beshga', 'пяти', 'five'), hint: L("Besh uch sonning yig'indisi.", 'Пять это сумма трёх чисел.', 'Five is the sum of the three numbers.') },
        { id: 'c', label: L("to'qqizga", 'девяти', 'nine'), hint: L("To'qqiz ildiz ostida turadi.", 'Девять стоит под корнем.', 'Nine stands under the root.') },
        { id: 'd', label: L('ikkiga', 'двум', 'two'), hint: L('Ikki sonlarning eng kattasi.', 'Два это наибольшее из чисел.', 'Two is the largest of the numbers.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Tekshiruv almashtirib qo'yish bilan boradi", 'Проверка идёт подстановкой', 'The check goes by substitution'),
  tag: 'koeffitsiyent-nuqta-emas',
  show: [
    [
      L("tekislik o'qlarni kesadi", 'плоскость пересекает оси', 'the plane cuts the axes'),
      L('oltida, uchda va uchda', 'в шести, трёх и трёх', 'at six, three and three'),
    ],
    [
      L("har nuqtani qo'yib ko'ramiz", 'подставляем каждую точку', 'we substitute each point'),
      L('va nol olamiz', 'и получаем ноль', 'and get zero'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Tekislik tenglama bilan berilgan. U o'qlarni kesadigan nuqtalarni topamiz.", 'Плоскость задана уравнением. Найдём точки, где она пересекает оси.', 'The plane is given by an equation. Let us find the points where it cuts the axes.'),
    A('move', "Birinchi o'qda boshqa ikki son nol, iks minus olti nolga teng bo'lib qoladi, ya'ni olti. Ikkinchi o'qda ikki igrek minus olti nolga teng, ya'ni uch. Uchinchisida ham xuddi shunday uch. Ana tekislikning uch nuqtasi, va uchtasi ham chizmasiz topildi. Tegishlilik tekshiruvi har doim bir xil: nuqtaning uch sonini chap tomonga qo'yib, nol chiqdimi deb qarash. Nol bo'lsa, nuqta tekislikda yotadi. Nol bo'lmasa, yotmaydi, va nuqta uzoqroq bo'lgani sari chetlanish kattaroq. E'tibor bering, tenglama bunda aylanib o'tish tartibi yoki shakl haqida hech narsa aytmaydi: tekislik cheksiz, va tenglama uni butunligicha tasvirlaydi.", 'На первой оси два других числа нули, остаётся икс минус шесть равно нулю, то есть шесть. На второй оси два игрек минус шесть равно нулю, то есть три. На третьей так же три. Вот и три точки плоскости, и все три найдены без чертежа. Проверка принадлежности всегда одна и та же: подставить три числа точки в левую часть и посмотреть, вышел ли ноль. Если ноль, точка лежит в плоскости. Если не ноль, не лежит, и величина отклонения тем больше, чем дальше точка. Обрати внимание, что уравнение при этом ничего не говорит про порядок обхода или про форму: плоскость бесконечна, и уравнение описывает её целиком.', 'On the first axis the other two numbers are zero, x minus six equals zero remains, that is six. On the second axis two y minus six equals zero, that is three. On the third the same three. There are three points of the plane, and all three were found without a drawing. The check of belonging is always the same: substitute the three numbers of the point into the left side and see whether zero came out. If it is zero, the point lies in the plane. If not zero, it does not lie there, and the deviation is larger the farther the point is. Note that the equation says nothing about the order of traversal or about a shape: a plane is endless, and the equation describes it entirely.'),
    A('work', "O'zingiz hisoblang. O'qlardagi uch nuqtadan nechtasi tekislikda yotadi?", 'Посчитай сам. Сколько из трёх точек на осях лежат в плоскости?', 'Work it out yourself. How many of the three points on the axes lie in the plane?'),
  ],
  work: {
    prompt: L('Nechta nuqta tekislikda yotadi?', 'Сколько точек лежат в плоскости?', 'How many points lie in the plane?'),
    ok: L("Uchta. Almashtirib qo'yish uchtasida ham nol berdi.", 'Три. Подстановка у всех дала ноль.', 'Three. The substitution gave zero for all of them.'),
    hint: [
      L("Har nuqtani chap tomonga qo'yib ko'ring.", 'Подставь каждую точку в левую часть.', 'Substitute each point into the left side.'),
      L('Olti minus olti, olti minus olti, olti minus olti.', 'Шесть минус шесть, шесть минус шесть, шесть минус шесть.', 'Six minus six, six minus six, six minus six.'),
      L('Uchta.', 'Три.', 'Three.'),
    ],
    answer: '3',
  },
  expr: 'x + 2y + 2z − 6 = 0',
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Koeffitsiyentlar uchligi strelka', 'Тройка коэффициентов это стрелка', 'The triple of coefficients is an arrow'),
  tag: 'koeffitsiyent-nuqta-emas',
  show: [
    [
      L('normal strelka bilan chizilgan', 'нормаль нарисована стрелкой', 'the normal is drawn as an arrow'),
      L('u tekislikka perpendikulyar', 'она перпендикулярна плоскости', 'it is perpendicular to the plane'),
    ],
    [
      L("burilish, va u to'g'ri burchakni saqlaydi", 'поворот, и она держит прямой угол', 'a turn, and it keeps the right angle'),
      L('bir ikki ikki nuqta esa tekislikdan tashqarida', 'а точка один два два вне плоскости', 'and the point one two two is off the plane'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Koeffitsiyentlar uchligini ikki usulda chizaman: strelka va nuqta sifatida.', 'Нарисую тройку коэффициентов двумя способами: как стрелку и как точку.', 'Let me draw the triple of coefficients in two ways: as an arrow and as a point.'),
    A('move', "Strelka sifatida u to'g'ri tutadi: tekislikka perpendikulyar, va sahnaning burilishi buni birorta holatda ham o'zgartirmaydi. Nuqta sifatida esa u tekislikka tushmaydi. Almashtirib qo'yib tekshiramiz: bir qo'shuv ikki karra ikki qo'shuv ikki karra ikki minus olti uch beradi, nol emas. Demak bu koordinatalarga ega nuqta tekislikdan tashqarida yotadi, va u hech qanday tekislik nuqtasi emas. Sabab oddiy. Tenglamada koeffitsiyentlar iks, igrek va zet oldida ko'paytuvchi bo'lib turadi, bu harflarning qiymati bo'lib emas. Ko'paytuvchi va qiymat boshqa-boshqa rol, va ularni aralashtirish mumkin emas, garchi yozuvda ikkisi ham uch son kabi ko'rinsa.", 'Как стрелка она ведёт себя правильно: перпендикулярна плоскости, и поворот сцены этого не меняет ни в одном положении. А как точка она в плоскость не попадает. Проверим подстановкой: один плюс два умножить на два плюс два умножить на два минус шесть даёт три, а не ноль. Значит точка с этими координатами лежит вне плоскости, и никакой она точкой плоскости не является. Причина проста. В уравнении коэффициенты стоят множителями при иксе, игреке и зете, а не значениями этих букв. Множитель и значение это разные роли, и путать их нельзя, хотя на письме и то и другое выглядит как тройка чисел.', 'As an arrow it behaves correctly: perpendicular to the plane, and turning the scene does not change that in any position. As a point it does not land in the plane. Let us check by substitution: one plus two times two plus two times two minus six gives three, not zero. So the point with these coordinates lies off the plane, and it is no point of the plane at all. The reason is simple. In the equation the coefficients stand as factors at x, y and z, not as the values of those letters. A factor and a value are different roles, and they must not be confused, even though in writing both look like a triple of numbers.'),
    A('work', "O'zingiz hisoblang. Bir ikki ikki nuqtasini qo'yish nima beradi?", 'Посчитай сам. Что даёт подстановка точки один два два?', 'Work it out yourself. What does substituting the point one two two give?'),
  ],
  work: {
    prompt: L("Almashtirib qo'yish nima beradi?", 'Что даёт подстановка?', 'What does the substitution give?'),
    ok: L('Uch. Nol emas, demak nuqta tekislikdan tashqarida.', 'Три. Не ноль, значит точка вне плоскости.', 'Three. Not zero, so the point is off the plane.'),
    hint: [
      L("Bir, ikki va ikkini o'z o'rniga qo'ying.", 'Подставь один, два и два по местам.', 'Substitute one, two and two in their places.'),
      L("Bir qo'shuv to'rt qo'shuv to'rt minus olti.", 'Один плюс четыре плюс четыре минус шесть.', 'One plus four plus four minus six.'),
      L('Uch.', 'Три.', 'Three.'),
    ],
    answer: '3',
  },
  expr: '1 + 4 + 4 − 6 = 3',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Strelka nega perpendikulyar', 'Почему стрелка перпендикулярна', 'Why the arrow is perpendicular'),
  tag: 'koeffitsiyent-nuqta-emas',
  show: [
    [
      L('tekislikning ikki nuqtasi', 'две точки плоскости', 'two points of the plane'),
      L('ular orasidagi vektor tekislikda yotadi', 'вектор между ними лежит в плоскости', 'the vector between them lies in the plane'),
    ],
    [
      L("normal bilan ko'paytmani hisoblaymiz", 'считаем произведение с нормалью', 'we compute the product with the normal'),
      L('ixtiyoriy juftda nol chiqadi', 'выходит ноль при любой паре', 'zero comes out for any pair'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', 'Tekislikning ikki nuqtasini olib, ular orasida vektor yasayman. U tekislikda yotadi.', 'Возьму две точки плоскости и построю вектор между ними. Он лежит в плоскости.', 'Let me take two points of the plane and build the vector between them. It lies in the plane.'),
    A('move', "Birinchi nuqta olti nol nol, ikkinchisi nol uch nol, ular orasidagi vektor minus olti uch nol. Koeffitsiyentlar uchligi bilan skalyar ko'paytmani hisoblayman: minus olti karra bir minus olti beradi, uch karra ikki olti beradi, nol karra ikki nol beradi. Yig'indi nol. Nolmas vektorlarda nol esa to'g'ri burchakni bildiradi, bu o'tgan darsning qoidasi. Tekislikning ixtiyoriy boshqa juft nuqtasini oling, va ko'paytma yana nol bo'ladi: ikkisida ham almashtirib qo'yish nol beradi, va ayirishda ozod had qisqaradi. Demak koeffitsiyentlar uchligi tekislikning har vektoriga perpendikulyar, ya'ni tekislikning o'ziga perpendikulyar. Bunday vektor normal deb ataladi.", 'Первая точка шесть нуль нуль, вторая нуль три нуль, вектор между ними минус шесть три нуль. Считаю скалярное произведение с тройкой коэффициентов: минус шесть на один даёт минус шесть, три на два даёт шесть, нуль на два даёт нуль. Сумма ноль. А ноль при ненулевых векторах означает прямой угол, это правило прошлого урока. Возьми любую другую пару точек плоскости, и произведение снова будет нулём: у обеих подстановка даёт ноль, и при вычитании свободный член сокращается. Значит тройка коэффициентов перпендикулярна каждому вектору плоскости, то есть перпендикулярна самой плоскости. Такой вектор и называется нормалью.', 'The first point is six zero zero, the second is zero three zero, the vector between them is minus six three zero. I compute the dot product with the triple of coefficients: minus six times one gives minus six, three times two gives six, zero times two gives zero. The sum is zero. And zero for non zero vectors means a right angle, that is the rule of the previous lesson. Take any other pair of points of the plane and the product will be zero again: the substitution gives zero for both, and in the subtraction the free term cancels. So the triple of coefficients is perpendicular to every vector of the plane, that is perpendicular to the plane itself. Such a vector is called a normal.'),
    A('work', "O'zingiz hisoblang. Normal va tekislik vektorining ko'paytmasi nimaga teng?", 'Посчитай сам. Чему равно произведение нормали и вектора плоскости?', 'Work it out yourself. What does the product of the normal and a vector of the plane equal?'),
  ],
  work: {
    prompt: L("Normal va tekislik vektorining ko'paytmasi?", 'Произведение нормали и вектора плоскости?', 'The product of the normal and a vector of the plane?'),
    ok: L('Nol. Shuning uchun perpendikulyar.', 'Ноль. Потому и перпендикулярна.', 'Zero. That is why it is perpendicular.'),
    hint: [
      L("O'qlar bo'yicha hisoblang, ishoralarni hisobga oling.", 'Считай по осям, знаки учитывай.', 'Compute along the axes, take the signs into account.'),
      L("Minus olti qo'shuv olti qo'shuv nol.", 'Минус шесть плюс шесть плюс нуль.', 'Minus six plus six plus zero.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
  expr: 'n·v = 0',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Nuqta va normal bo'yicha tenglama", 'Уравнение по точке и нормали', 'An equation from a point and a normal'),
  tag: 'koeffitsiyent-nuqta-emas',
  show: [
    [
      L("o'sha normal bir ikki ikki", 'та же нормаль один два два', 'the same normal one two two'),
      L('lekin tekislik bir bir bir nuqta orqali', 'но плоскость через точку один один один', 'but the plane through the point one one one'),
    ],
    [
      L('koeffitsiyentlarni normaldan olamiz', 'коэффициенты берём из нормали', 'we take the coefficients from the normal'),
      L("ozod hadni almashtirib qo'yishdan", 'свободный член из подстановки', 'the free term from the substitution'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Normalni o'sha qoldiraman, tekislikni esa boshqa nuqta orqali o'tkazaman.", 'Нормаль оставлю ту же, а плоскость проведу через другую точку.', 'Let me keep the same normal and pass the plane through another point.'),
    A('move', "Yangi tekislik eskisiga parallel, va bu ko'rinadi: normali bitta, demak og'ishi bir xil. Tenglamadagi koeffitsiyentlar to'g'ridan to'g'ri normaldan olinadi, bu yerda o'ylaydigan narsa yo'q. Ozod hadni topish qoldi, va u berilgan nuqta tekislikda yotadi degan shartdan topiladi. Bir, bir va birni qo'yaman: bir qo'shuv ikki qo'shuv ikki besh beradi. Demak ozod hadsiz chap tomon besh beradi, va nol chiqishi uchun ozod had minus beshga teng. Tenglama tayyor. Shundan umumiy usul: koeffitsiyentlar normaldan, ozod had nuqtadan. Va e'tibor bering, normal faqat tekislikning yo'nalishini beradi, nuqta esa parallel tekisliklardan qaysi biri kerakligini tanlaydi.", 'Новая плоскость параллельна старой, и это видно: нормаль у них одна, значит наклон одинаковый. Коэффициенты в уравнении берутся прямо из нормали, тут думать не о чем. Осталось найти свободный член, и он находится из условия, что данная точка лежит в плоскости. Подставляю один, один и один: один плюс два плюс два даёт пять. Значит левая часть без свободного члена даёт пять, и чтобы получился ноль, свободный член равен минус пяти. Уравнение готово. Отсюда общий приём: коэффициенты из нормали, свободный член из точки. И заметь, что нормаль задаёт только направление плоскости, а точка выбирает, какая именно из параллельных плоскостей нам нужна.', 'The new plane is parallel to the old one, and that is visible: they have one normal, so the same tilt. The coefficients in the equation are taken straight from the normal, there is nothing to think about there. What remains is the free term, and it is found from the condition that the given point lies in the plane. I substitute one, one and one: one plus two plus two gives five. So the left side without the free term gives five, and for zero to come out the free term equals minus five. The equation is ready. Hence the general trick: the coefficients from the normal, the free term from the point. And note that the normal gives only the direction of the plane, while the point chooses which of the parallel planes we need.'),
    A('work', "O'zingiz hisoblang. Bir bir bir nuqtasini ozod hadsiz qo'yish nima beradi?", 'Посчитай сам. Что даёт подстановка точки один один один без свободного члена?', 'Work it out yourself. What does substituting the point one one one give without the free term?'),
  ],
  work: {
    prompt: L("Almashtirib qo'yish nima beradi?", 'Что даёт подстановка?', 'What does the substitution give?'),
    ok: L('Besh. Demak ozod had minus besh.', 'Пять. Значит свободный член минус пять.', 'Five. So the free term is minus five.'),
    hint: [
      L("Normalning har sonini birga ko'paytiring.", 'Умножь каждое число нормали на единицу.', 'Multiply each number of the normal by one.'),
      L("Bir qo'shuv ikki qo'shuv ikki.", 'Один плюс два плюс два.', 'One plus two plus two.'),
      L('Besh.', 'Пять.', 'Five.'),
    ],
    answer: '5',
  },
  expr: 'x + 2y + 2z − 5 = 0',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE EDGE CASE'),
  title: L("Bitta tekislik, ko'p tenglama", 'Одна плоскость, много уравнений', 'One plane, many equations'),
  tag: 'koeffitsiyent-nuqta-emas',
  show: [
    [
      L('birinchi tenglama', 'первое уравнение', 'the first equation'),
      L("ikkinchisi ikkiga ko'paytirib olindi", 'второе получено умножением на два', 'the second was obtained by multiplying by two'),
    ],
    [
      L('chizmada tekislik bitta', 'плоскость на чертеже одна', 'on the drawing the plane is one'),
      L('normal esa ikki barobar uzaydi', 'а нормаль стала вдвое длиннее', 'and the normal became twice as long'),
    ],
  ],
  motion: ['move'],
  audio: [
    A('mount', "Tenglamaning barcha koeffitsiyentlarini ikkiga ko'paytirib, tekislikka nima bo'lishini ko'raman.", 'Умножу все коэффициенты уравнения на два и посмотрю, что станет с плоскостью.', 'Let me multiply all the coefficients of the equation by two and see what happens to the plane.'),
    A('move', "Chizmada hech narsa o'zgarmadi. To'g'ri ham: chap tomon nolga teng bo'lgan bo'lsa, ikkilangan chap tomon ham nolga teng, demak barcha nuqtalar joyida qoldi. Ixtiyoriy nuqtani qo'yib tekshirish mumkin: olti nol nol avvalgidek nol beradi. O'zgargan narsa normalning uzunligi, u ikki barobar kattalashdi. Lekin yo'nalishi o'sha, tekislikka esa faqat yo'nalish muhim. Shundan masalalar uchun muhim natija: normal yakka emas, ular cheksiz ko'p, va hammasi kollinear. Teskari natija ham foydali: agar ikki tenglama faqat umumiy ko'paytuvchi bilan farq qilsa, bu bitta va o'sha tekislik, ikki parallel emas.", 'На чертеже не изменилось ничего. И правильно: если левая часть равнялась нулю, то удвоенная левая часть тоже равна нулю, а значит все точки остались на месте. Проверить можно подстановкой любой точки: шесть нуль нуль по-прежнему даёт ноль. Что изменилось, так это длина нормали, она стала вдвое больше. Но направление у неё то же, а плоскости важно только направление. Отсюда важное следствие для задач: нормаль не единственная, их бесконечно много, и все они коллинеарны. И обратное следствие тоже полезно: если два уравнения отличаются только общим множителем, это одна и та же плоскость, а не две параллельные.', 'Nothing changed on the drawing. And rightly so: if the left side equalled zero, then twice the left side also equals zero, so all the points stayed where they were. It can be checked by substituting any point: six zero zero still gives zero. What did change is the length of the normal, it became twice as large. But its direction is the same, and only the direction matters to a plane. Hence an important consequence for problems: the normal is not unique, there are infinitely many of them, and all are collinear. And the converse consequence is useful too: if two equations differ only by a common factor, it is one and the same plane and not two parallel ones.'),
    A('work', "O'zingiz hisoblang. Bu ikki tenglama nechta xil tekislikni aniqlaydi?", 'Посчитай сам. Сколько разных плоскостей задают эти два уравнения?', 'Work it out yourself. How many different planes do these two equations define?'),
  ],
  work: {
    prompt: L('Nechta xil tekislik?', 'Сколько разных плоскостей?', 'How many different planes?'),
    ok: L("Bitta. Umumiy ko'paytuvchi tekislikni o'zgartirmaydi.", 'Одна. Общий множитель плоскость не меняет.', 'One. A common factor does not change the plane.'),
    hint: [
      L("Nuqtani ikki tenglamaga ham qo'ying.", 'Подставь точку в оба уравнения.', 'Substitute a point into both equations.'),
      L('Ikkisi ham nol berdi.', 'Оба дали ноль.', 'Both gave zero.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
  expr: '2x + 4y + 4z − 12 = 0',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Tenglamadan nima o'qiladi", 'Что читается из уравнения', 'What is read from the equation'),
  tag: 'koeffitsiyent-nuqta-emas',
  motion: ['rule'],
  audio: [
    A('mount', 'Farqlashga bitta savol, keyin kartochka.', 'Один вопрос на различение, потом карточка.', 'One question to tell them apart, then the card.'),
    A('rule', "Birinchi satr yilning xatosi, va u bejiz birinchi turmagan: tenglamadagi uch son va nuqtaning uch soni bir xil ko'rinadi, rollari esa boshqa. Koeffitsiyent harf oldidagi ko'paytuvchi, koordinata esa harfning qiymati. Ikkinchi satr tekshirishning yagona usulini beradi, va u chizma talab qilmaydi: qo'ydingiz, nolga qaradingiz. Uchinchi satr aks holda xalaqit beradigan savolni oladi: tekislikning tenglamalari ko'p, normallari ham ko'p, lekin barcha normallarning yo'nalishi bitta. Foydali ish tartibi: avval normalni yozib oling, keyin nuqta bo'yicha ozod hadni toping.", 'Первая строка это ошибка года, и она стоит первой не случайно: тройка чисел в уравнении и тройка чисел точки выглядят одинаково, а роли у них разные. Коэффициент это множитель при букве, а координата это значение буквы. Вторая строка даёт единственный способ проверки, и он не требует чертежа: подставил, посмотрел на ноль. Третья строка снимает вопрос, который иначе мешает: уравнений у плоскости много, и нормалей тоже много, но направление у всех нормалей одно. Полезный порядок работы: сначала выпиши нормаль, потом найди свободный член по точке.', "The first line is the year's mistake, and it stands first for a reason: the triple of numbers in the equation and the triple of numbers of a point look the same, while their roles differ. A coefficient is a factor at a letter, a coordinate is the value of a letter. The second line gives the only way to check, and it needs no drawing: you substituted, you looked for zero. The third line removes a question that otherwise gets in the way: a plane has many equations and many normals, but all the normals have one direction. A useful order of work: first write out the normal, then find the free term from the point."),
  ],
  probe: {
    question: L('Koeffitsiyentlar uchligi nima?', 'Чем является тройка коэффициентов?', 'What is the triple of coefficients?'),
    items: [
      { id: 'a', label: L('tekislikning normali', 'нормалью плоскости', 'a normal of the plane'), correct: true },
      { id: 'b', label: L('tekislikning nuqtasi', 'точкой плоскости', 'a point of the plane'), hint: L("Bu uchlikni qo'yish nol bermaydi.", 'Подстановка этой тройки нуля не даёт.', 'Substituting that triple does not give zero.') },
    ],
  },
  rule: {
    lawLabel: L('Tekislik tenglamasi', 'Уравнение плоскости', 'The equation of a plane'),
    lines: [
      L('koeffitsiyentlar uchligi normal, nuqta emas', 'тройка коэффициентов это нормаль, а не точка', 'the triple of coefficients is a normal, not a point'),
      L("almashtirib qo'yish nol bersa, nuqta tekislikda yotadi", 'точка лежит в плоскости, если подстановка даёт ноль', 'a point lies in the plane if the substitution gives zero'),
      L("umumiy ko'paytuvchi tekislikni o'zgartirmaydi", 'общий множитель плоскость не меняет', 'a common factor does not change the plane'),
    ],
    law: 'ax + by + cz + d = 0',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('AMALIYOT', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Bu nuqta qayerda', 'Где эта точка', 'Where this point is'),
  tag: 'koeffitsiyent-nuqta-emas',
  audio: [
    A('mount', "To'rt nuqta va to'rt joy. Tenglamaga qo'yib ko'ring.", 'Четыре точки и четыре места. Подставляй в уравнение.', 'Four points and four places. Substitute into the equation.'),
  ],
  match: {
    prompt: L('Nuqtani joy bilan birlashtiring', 'Соедини точку с местом', 'Match the point with the place'),
    ok: L("To'rttasi ham joyida. Tekshiruv bitta: almashtirib qo'yish.", 'Все четыре на месте. Проверка одна: подстановка.', 'All four in place. The check is one: substitution.'),
    a: L("birinchi o'qda", 'на первой оси', 'on the first axis'),
    b: L("ikkinchi o'qda", 'на второй оси', 'on the second axis'),
    c: L("uchinchi o'qda", 'на третьей оси', 'on the third axis'),
    d: L('tekislikdan tashqarida', 'вне плоскости', 'off the plane'),
    left: ['(6; 0; 0)', '(0; 3; 0)', '(0; 0; 3)', '(1; 2; 2)'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'proof',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L('Uchlik normal ekanini isbotlang', 'Докажи, что тройка это нормаль', 'Prove the triple is a normal'),
  tag: 'koeffitsiyent-nuqta-emas',
  audio: [
    A('mount', "Uch qator, va har birining ro'yxatdan o'z asoslashi bor.", 'Три строки, и у каждой своё обоснование из списка.', 'Three lines, each with its own justification from the list.'),
  ],
  proof: {
    given: L('tekislikning ikki nuqtasi va koeffitsiyentlar uchligi', 'две точки плоскости и тройка коэффициентов', 'two points of the plane and the triple of coefficients'),
    goal: L('uchlik tekislikka perpendikulyar', 'тройка перпендикулярна плоскости', 'the triple is perpendicular to the plane'),
    r1: L("ikki nuqtada ham almashtirib qo'yish nol beradi", 'у обеих точек подстановка даёт ноль', 'for both points the substitution gives zero'),
    r2: L('ayirishda ozod had qisqardi', 'при вычитании свободный член сократился', 'in the subtraction the free term cancelled'),
    r3: L("demak tekislik vektori bilan ko'paytma nol", 'значит произведение с вектором плоскости ноль', 'so the product with a vector of the plane is zero'),
    ok: L("Isbotlandi. Nol to'g'ri burchakni bildiradi, demak bu normal.", 'Доказано. Ноль означает прямой угол, значит это нормаль.', 'Proved. Zero means a right angle, so it is a normal.'),
    e1: L("Ayirish haqida keyin. Avval nuqtalarning o'zi haqida.", 'Про вычитание дальше. Сначала про сами точки.', 'The subtraction comes later. First about the points themselves.'),
    e2: L("Nuqtalar ko'rildi. Ayirish nima beradi.", 'Точки разобраны. Что даёт вычитание.', 'The points are done. What the subtraction gives.'),
    e3: L('Ozod had ketdi. Endi xulosa.', 'Свободный член ушёл. Теперь вывод.', 'The free term is gone. Now the conclusion.'),
  },
  reason: {
    s1: L("nuqta shart bo'yicha tekislikda yotadi", 'точка лежит в плоскости по условию', 'the point lies in the plane by the condition'),
    s2: L('tekislik vektori nuqtalar ayirmasi', 'вектор плоскости это разность точек', 'a vector of the plane is the difference of the points'),
    s3: L('nol orqali perpendikulyarlik alomati', 'признак перпендикулярности через ноль', 'the criterion of perpendicularity through zero'),
    pic: {
      label: L("chizmada ko'rinadi", 'видно на чертеже', 'it is visible on the drawing'),
      missing: L("Chizma asoslash emas. U ko'p rakursdan bittasini ko'rsatadi.", 'Чертёж не обоснование. Он показывает один ракурс из многих.', 'A drawing is not a justification. It shows one view out of many.'),
    },
  },
  expr: 'n·v = 0',
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
    A('mount', "Asbob olib qo'yildi. Tenglamani qog'ozda tuzamiz.", 'Прибор убран. Составляем уравнение на бумаге.', 'The tool is put away. We compose the equation on paper.'),
    A('next', 'Endi qadamlar tartibi. Ularni qanday tuzilsa, shunday joylashtiring.', 'Теперь порядок шагов. Расставь их так, как составляют.', 'Now the order of the steps. Arrange them the way the composing goes.'),
  ],
  task: {
    ok: L("O'n. To'rt qo'shuv ikki qo'shuv to'rt.", 'Десять. Четыре плюс два плюс четыре.', 'Ten. Four plus two plus four.'),
    hint: [
      L('Koeffitsiyentlarni normaldan oling.', 'Коэффициенты возьми из нормали.', 'Take the coefficients from the normal.'),
      L("Ikki, ikki va ikkini qo'ying.", 'Подставь два, два и два.', 'Substitute two, two and two.'),
      L("To'rt qo'shuv ikki qo'shuv to'rt.", 'Четыре плюс два плюс четыре.', 'Four plus two plus four.'),
    ],
    prompt: 'n (2; 1; 2),   M (2; 2; 2),   n·M = ?',
    answer: '10',
  },
  order: {
    prompt: L('Qadamlarni tenglama tuzish tartibida joylashtiring', 'Расставь шаги в том порядке, в каком составляют уравнение', 'Arrange the steps in the order the equation is composed'),
    title: L('Tuzish tartibi', 'Порядок составления', 'The order of composing'),
    ok: L("Tartib to'g'ri. Normal, koeffitsiyentlar, almashtirib qo'yish, ozod had.", 'Порядок верный. Нормаль, коэффициенты, подстановка, свободный член.', 'The order is right. The normal, the coefficients, the substitution, the free term.'),
    bad: L('Bu tartibda emas. Avval nima kerak.', 'Не в этом порядке. Что нужно раньше.', 'Not in this order. What is needed first.'),
    items: ['d', 'n', 'a, b, c', 'n·M'],
    answer: 'n  a, b, c  n·M  d',
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
    A('mount', "To'rt qator, va ulardan biri uchlikning rolini o'zgartiradi.", 'Четыре строки, и одна из них меняет роль тройки.', 'Four lines, and one of them changes the role of the triple.'),
    A('next', "Endi xato bo'lgan qator raqamini yozing.", 'Теперь напиши номер строки, в которой ошибка.', 'Now write the number of the line with the mistake.'),
  ],
  hint: {
    r1: L("Tenglama to'g'ri yozilgan.", 'Уравнение выписано верно.', 'The equation is written correctly.'),
    r2: L("Normal to'g'ri o'qilgan.", 'Нормаль прочитана верно.', 'The normal is read correctly.'),
    r4: L('Qator yuqoridagi xato qatordan olingan.', 'Строка получена из неверной строки выше.', 'The line comes from the wrong line above.'),
  },
  proof: L("Sahnani buring: strelka to'g'ri burchakni saqlaydi, o'sha sonlarga ega nuqta esa tekislikka tushmaydi.", 'Поверни сцену: стрелка держит прямой угол, а точка с теми же числами в плоскость не попадает.', 'Rotate the scene: the arrow keeps the right angle, and the point with the same numbers does not land in the plane.'),
  entry: {
    prompt: L('Xato qator raqami', 'Номер строки с ошибкой', 'The number of the line with the mistake'),
    ok: L('Uchinchi. Normal tekislikning nuqtasi deb aytilgan.', 'Третья. Нормаль объявили точкой плоскости.', 'The third. The normal was declared a point of the plane.'),
    hint: [
      L("Uchinchi qatorni almashtirib qo'yib tekshiring.", 'Проверь третью строку подстановкой.', 'Check the third line by substitution.'),
      L("Almashtirib qo'yish uch beradi, nol emas.", 'Подстановка даёт три, а не ноль.', 'The substitution gives three, not zero.'),
      L('Xato uchinchi qatorda.', 'Ошибка в третьей строке.', 'The mistake is in the third line.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'x + 2y + 2z − 6 = 0',
    r2: 'n (1; 2; 2)',
    r3: 'M (1; 2; 2) ∈ α',
    r4: '1 + 4 + 4 − 6 = 0',
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
    A('mount', "Darsni o'ngdan chapga o'qiymiz. Tenglama berilgan, normalni topish kerak.", 'Прочитаем урок справа налево. Дано уравнение, найти надо нормаль.', 'Let us read the lesson from right to left. The equation is given, the normal is to be found.'),
    A('work', "To'g'ri bo'lgan barcha yozuvlarni belgilang. Ular bittadan ko'p.", 'Отметь все записи, которые верны. Их больше одной.', 'Mark all the readings that are correct. There is more than one.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri yozuvlarni belgilang", 'Отметь все верные записи', 'Mark all the correct readings'),
    title: L("Bu tekislik uchun nima to'g'ri", 'Что верно для этой плоскости', 'What is true for this plane'),
    ok: L('Beshtadan uch yozuv. Qolgan ikkitasi sonlarning rolini aralashtiradi.', 'Три записи из пяти. Две оставшиеся путают роли чисел.', 'Three readings out of five. The other two confuse the roles of the numbers.'),
    items: [
      { id: 'd', label: 'M (1; 2; 2) ∈ α', hint: L("Bu nuqtani qo'yish nol bermaydi.", 'Подстановка этой точки нуля не даёт.', 'Substituting that point does not give zero.') },
      { id: 'e', label: 'n (1; 2; 2; −6)', hint: L('Ozod had normalga kirmaydi.', 'Свободный член в нормаль не входит.', 'The free term is not part of the normal.') },
      { id: 'a', label: 'n (1; 2; 2)', ok: true },
      { id: 'b', label: 'M (6; 0; 0) ∈ α', ok: true },
      { id: 'c', label: '|n| = 3', ok: true },
    ],
  },
  place: {
    prompt: L("Ikki iks qo'shuv igrek qo'shuv ikki zet minus o'n nolga teng degan tekislik tenglamasi berilgan. Uning normalining uchinchi soni qanday?", 'Дано уравнение плоскости два икс плюс игрек плюс два зет минус десять равно нулю. Каково третье число её нормали?', 'The equation two x plus y plus two z minus ten equals zero is given. What is the third number of its normal?'),
    ok: L('Ikki. Uchinchi harf oldidagi koeffitsiyent.', 'Два. Коэффициент при третьей букве.', 'Two. The coefficient at the third letter.'),
    wrong: L('Normal koeffitsiyentlar, ozod had unga kirmaydi.', 'Нормаль это коэффициенты, свободный член в неё не входит.', 'A normal is the coefficients, the free term is not part of it.'),
    target: '2',
    step: '2x + y + 2z − 10 = 0',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'koeffitsiyent-nuqta-emas',
  audio: [
    A('mount', "Ketma-ket to'rt savol. To'xtamasdan javob bering.", 'Четыре вопроса подряд. Отвечай без остановки.', 'Four questions in a row. Answer without stopping.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Koeffitsiyentlar uchligi nima?', 'Чем является тройка коэффициентов?', 'What is the triple of coefficients?'),
      done: 'n (1; 2; 2)',
      items: [
        { id: 'a', label: L('normal', 'нормалью', 'a normal'), correct: true },
        { id: 'b', label: L('tekislikning nuqtasi', 'точкой плоскости', 'a point of the plane'), hint: L("Bu uchlikni qo'yish nol bermaydi.", 'Подстановка этой тройки нуля не даёт.', 'Substituting that triple does not give zero.') },
        { id: 'c', label: L('tekislikdagi vektor', 'вектором в плоскости', 'a vector in the plane'), hint: L('Tekislik vektorlari bilan u nol beradi.', 'С векторами плоскости она даёт ноль.', 'With vectors of the plane it gives zero.') },
        { id: 'd', label: L('ozod had', 'свободным членом', 'the free term'), hint: L('Ozod had alohida, harfsiz turadi.', 'Свободный член стоит отдельно, без буквы.', 'The free term stands separately, without a letter.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Nuqta tekislikda yotganini qanday tekshiriladi?', 'Как проверить, лежит ли точка в плоскости?', 'How do you check whether a point lies in the plane?'),
      done: '1 + 4 + 4 − 6 = 3',
      items: [
        { id: 'a', label: L("qo'yib ko'rib, nol olish", 'подставить и получить ноль', 'substitute and get zero'), correct: true },
        { id: 'b', label: L('normal bilan taqqoslash', 'сравнить с нормалью', 'compare with the normal'), hint: L("Normal yo'nalish, joy emas.", 'Нормаль это направление, а не место.', 'A normal is a direction, not a place.') },
        { id: 'c', label: L('chizmaga qarash', 'посмотреть на чертёж', 'look at the drawing'), hint: L("Chizma bitta rakursni ko'rsatadi.", 'Чертёж показывает один ракурс.', 'A drawing shows one view.') },
        { id: 'd', label: L('uzunlikni hisoblash', 'посчитать длину', 'compute the length'), hint: L('Uzunlik tegishlilik haqida aytmaydi.', 'Длина про принадлежность не говорит.', 'A length says nothing about belonging.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Butun tenglamani uchga ko'paytirsak nima bo'ladi?", 'Что будет, если умножить всё уравнение на три?', 'What happens if the whole equation is multiplied by three?'),
      done: '2x + 4y + 4z − 12 = 0',
      items: [
        { id: 'a', label: L("tekislik o'sha bo'lib qoladi", 'плоскость останется той же', 'the plane will stay the same'), correct: true },
        { id: 'b', label: L('tekislik siljiydi', 'плоскость сдвинется', 'the plane will shift'), hint: L('Barcha nuqtalar avvalgidek nol beradi.', 'Все точки по-прежнему дают ноль.', 'All the points still give zero.') },
        { id: 'c', label: L("tekislik og'adi", 'плоскость наклонится', 'the plane will tilt'), hint: L("Normalning yo'nalishi o'zgarmadi.", 'Направление нормали не изменилось.', 'The direction of the normal did not change.') },
        { id: 'd', label: L("tekislik yo'qoladi", 'плоскость исчезнет', 'the plane will disappear'), hint: L("Nolga ko'paytirilganda yo'qolardi.", 'Исчезла бы при умножении на нуль.', 'It would disappear when multiplied by zero.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Ozod had qayerdan olinadi?', 'Откуда берётся свободный член?', 'Where does the free term come from?'),
      done: 'x + 2y + 2z − 5 = 0',
      items: [
        { id: 'a', label: L("berilgan nuqtani qo'yishdan", 'из подстановки данной точки', 'from substituting the given point'), correct: true },
        { id: 'b', label: L('normalning uzunligidan', 'из длины нормали', 'from the length of the normal'), hint: L('Normalning uzunligi tenglamaga kirmaydi.', 'Длина нормали в уравнение не входит.', 'The length of the normal is not in the equation.') },
        { id: 'c', label: L('birinchi koeffitsiyentdan', 'из первого коэффициента', 'from the first coefficient'), hint: L("Koeffitsiyentlar faqat yo'nalishni beradi.", 'Коэффициенты дают только направление.', 'The coefficients give only the direction.') },
        { id: 'd', label: L('u har doim nol', 'он всегда нуль', 'it is always zero'), hint: L("Nol koordinatalar boshi orqali o'tgan tekislikni bildiradi.", 'Нуль означает плоскость через начало координат.', 'Zero means a plane through the origin.') },
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
    A('mount', 'Dars tenglamada qanday uchlik turgani haqidagi savol bilan boshlandi.', 'Урок начался с вопроса, что за тройка стоит в уравнении.', 'The lesson began with the question what triple stands in the equation.'),
    A('next', "Bu normal, nuqta emas, va ularni bitta almashtirib qo'yish bilan ajratish mumkin: tekislik nuqtasida nol chiqadi, bu uchlikda esa uch chiqdi. Rollari boshqa: koeffitsiyent harf oldidagi ko'paytuvchi, koordinata harfning qiymati, va yozuvda ular bir xil ko'rinadi. Uchlik tekislikka nega perpendikulyar, bu ham hisobdan ko'rinadi: tekislikning ixtiyoriy ikki nuqtasida almashtirib qo'yish nol beradi, ayirishda ozod had qisqaradi, va tekislik vektori bilan ko'paytma nol bo'lib chiqadi. Teskari masala ikki qadamda yechiladi: koeffitsiyentlarni normaldan, ozod hadni nuqtadan olamiz. Va oxirgisi: bitta tekislikning tenglamalari ko'p, chunki umumiy ko'paytuvchi hech narsani o'zgartirmaydi. Keyin butun yil bo'yicha DTM topshiriqlari boshlanadi.", 'Это нормаль, а не точка, и различить их можно одной подстановкой: у точки плоскости выходит ноль, а у этой тройки вышло три. Роли разные: коэффициент это множитель при букве, координата это значение буквы, и на письме они выглядят одинаково. Почему тройка перпендикулярна плоскости, тоже видно из счёта: у любых двух точек плоскости подстановка даёт ноль, при вычитании свободный член сокращается, и произведение с вектором плоскости оказывается нулём. Обратная задача решается в два шага: коэффициенты берём из нормали, свободный член из точки. И последнее: у одной плоскости уравнений много, потому что общий множитель ничего не меняет. Дальше начнутся задачи ДТМ по всему году.', 'It is a normal and not a point, and they can be told apart by a single substitution: for a point of the plane zero comes out, and for this triple three came out. The roles differ: a coefficient is a factor at a letter, a coordinate is the value of a letter, and in writing they look the same. Why the triple is perpendicular to the plane is also visible from the counting: for any two points of the plane the substitution gives zero, in the subtraction the free term cancels, and the product with a vector of the plane turns out to be zero. The inverse problem is solved in two steps: the coefficients from the normal, the free term from the point. And the last thing: a plane has many equations, because a common factor changes nothing. Next the DTM tasks over the whole year will begin.'),
  ],
  can: [
    L("Normalni tenglamadan to'g'ridan to'g'ri o'qiyman", 'Читаю нормаль прямо из уравнения', 'I read the normal straight from the equation'),
    L("Nuqtani almashtirib qo'yib tekshiraman", 'Проверяю точку подстановкой', 'I check a point by substitution'),
    L("Nuqta va normal bo'yicha tenglama tuzaman", 'Составляю уравнение по точке и нормали', 'I compose an equation from a point and a normal'),
    L('Bitta tekislikni turli tenglamalarda tanib olaman', 'Узнаю одну плоскость в разных уравнениях', 'I recognise one plane in different equations'),
  ],
  levels: {
    full: L("To'rttasi ham", 'Все четыре', 'All four'),
    gap: L("To'rttadan uchtasi", 'Три из четырёх', 'Three out of four'),
    back: L('Uchtadan kam', 'Меньше трёх', 'Fewer than three'),
  },
  bridge: L("Bundan keyin DTM topshiriqlari, o'sha yil, lekin topshiriq darrov va razborsiz beriladi", 'Дальше задачи ДТМ — тот же год, но задача даётся сразу и без разбора', 'Next come the DTM tasks: the same year, but a task is given at once and without a walkthrough'),
  lifehack: L('Avval normalni yozib oling, keyin ozod hadni qidiring', 'Сначала выпиши нормаль, потом ищи свободный член', 'First write out the normal, then look for the free term'),
  sheetTitle: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  sheetSrc: L('Programma, sakkizinchi blok', 'Программа, блок восемь', 'The programme, block eight'),
  hook: {
    a: 'M (1; 2; 2)',
    b: 'n (1; 2; 2)',
  },
  proved: 'n (1; 2; 2)',
  law: 'ax + by + cz + d = 0',
  sheet: [
    'x + 2y + 2z − 6 = 0',
    'n (1; 2; 2)',
    'n·v = 0',
    '1 + 4 + 4 − 6 = 3',
    '2x + 4y + 4z − 12 = 0',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/\u2212/g, '-'))

// PRIBOR 6C -- `Space3D`. `plane` rejimi tekislikni `a x + b y + c z + d = 0`
// ko'rinishida oladi va `normal` bilan normalni strelka qilib chizadi.
//
// SHOHID SHU YERDA: normal strelka bo'lib har rakursda tekislikka perpendikulyar
// turadi, KOEFFITSIYENTLAR bilan bir xil sonli NUQTA esa tekislikka tushmaydi.
// Ikkisi bir kadrda chizilishi kerak -- shundagina rollar farqi ko'rinadi.
const BOX = [7, 7, 7]
const PLANE = { n: [1, 2, 2], d: -6, label: 'a', normal: true }
const PLANE_X2 = { n: [2, 4, 4], d: -12, label: 'a', normal: true }
const PLANE_5 = { n: [1, 2, 2], d: -5, label: 'b', normal: true }
const NPOINT = [1, 2, 2]      // koeffitsiyentlar bilan bir xil son -- LEKIN nuqta
const ON_X = [6, 0, 0]
const ON_Y = [0, 3, 0]
const ON_Z = [0, 0, 3]
const P111 = [1, 1, 1]

const AXIS_PTS = [
  { at: ON_X, label: 'A' },
  { at: ON_Y, label: 'B' },
  { at: ON_Z, label: 'C' },
]

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
                mode="plane" box={BOX} planes={[PLANE]}
                points={[{ at: NPOINT, label: 'M', tone: 'accent' }]}
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
            fig={<Space3D mode="plane" box={BOX} planes={[PLANE]} value="eq" />}
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
            mode="plane" box={BOX} planes={[PLANE]}
            points={phase === 0 ? [] : AXIS_PTS}
            value={phase === 0 ? 'eq' : 'none'}
          />
        )}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <SpinScene
        scene={<Space3D mode="plane" box={BOX} planes={[PLANE]} points={AXIS_PTS} />}
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
            mode="plane" box={BOX} yaw={phase === 0 ? 0 : 0.7}
            planes={[PLANE]}
            points={[{ at: NPOINT, label: 'M', tone: 'accent', coords: true }]}
          />
        )}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={(
          <Space3D
            mode="plane" box={BOX} planes={[PLANE]}
            points={[{ at: NPOINT, label: 'M', tone: 'accent', coords: true }]}
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
            mode="plane" box={BOX} planes={[PLANE]}
            points={[{ at: ON_X, label: 'A' }, { at: ON_Y, label: 'B' }]}
            vectors={phase === 0
              ? []
              : [{ from: ON_X, to: ON_Y, label: 'v', coords: true, tone: 'graph' }]}
          />
        )}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={(
          <Space3D
            mode="plane" box={BOX} planes={[PLANE]}
            points={[{ at: ON_X, label: 'A' }, { at: ON_Y, label: 'B' }]}
            vectors={[{ from: ON_X, to: ON_Y, label: 'v', coords: true, tone: 'graph' }]}
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
            mode="plane" box={BOX}
            planes={phase === 0 ? [PLANE] : [PLANE, PLANE_5]}
            points={[{ at: P111, label: 'M', tone: 'accent' }]}
            value={phase === 0 ? 'none' : 'eq'}
          />
        )}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.3}
        scene={(
          <Space3D
            mode="plane" box={BOX} planes={[PLANE, PLANE_5]}
            points={[{ at: P111, label: 'M', tone: 'accent' }]}
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
            mode="plane" box={BOX}
            planes={[phase === 0 ? PLANE : PLANE_X2]}
            points={AXIS_PTS}
            value="eq"
          />
        )}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <SpinScene
        yaw0={0.35}
        scene={<Space3D mode="plane" box={BOX} planes={[PLANE_X2]} points={AXIS_PTS} />}
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
                mode="plane" box={BOX} yaw={solved ? 0.9 : 0}
                planes={[PLANE]} value={solved ? 'eq' : 'none'}
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
                mode="plane" box={BOX} yaw={round * 0.3}
                planes={[round === 2 ? PLANE_X2 : PLANE]}
                points={round === 1 ? [{ at: NPOINT, label: 'M', tone: 'accent' }] : []}
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
