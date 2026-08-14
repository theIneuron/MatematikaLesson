// ============================================================================
// 10-sinf, Dars 4. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Ma'lumot `scripts/grade10-kontent-build.mjs` bilan kontentdan yig'ilgan,
// ekran tanalari esa qo'lda yozilgan. Manba:
//   manba:  src/books/grade10/DARS04_KONTENT.md
// DARSNING GUVOHI -- ISHORA BU YO'NALISH. Nuqta aylana bo'ylab yuradi, tagida
// ikki shkala turadi, va ishora AYNAN o'qdan o'tish paytida almashadi. Shundan
// keyin mnemonika kerak emas: yo'nalishga qarash yetarli.
//
// Bu darsda «chorak» so'zi SINFDA BIRINCHI MARTA aytiladi (4-ekran): 2 va
// 3-darsda u ataylab yo'q. «Manfiy burish» esa 5-darsda kiritiladi, bu yerda
// yo'q. Kotangens blokda umuman yo'q.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Col, Cols, Expr, L, Panel, Slot } from './core.jsx'
import { QuadNames, SignScales } from './figures.jsx'
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
  BuildPoint,
  MultiPick,
  NoteList,
  NumberEntry,
  OrderRow,
  PlaceAngle,
  ProbeChain,
  Readout,
  Scene,
  TableFill,
  UnitCircle,
} from './tools.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 4
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Ishoralar va qiymatlar`,
  `Урок ${LESSON_NO}. Знаки/значения`,
  `Lesson ${LESSON_NO}. Signs and values`,
)

const BLOCK = { label: 'B1', from: 1, to: 7, current: 4 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('ISHORALAR', 'ЗНАКИ', 'THE SIGNS'),
  title: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
  motion: ['mount'],
  audio: [
    A('mount', 'Nuqta ikki yuz gradusga suriladi.', 'Точка едет на двести градусов.', 'The point moves to two hundred degrees.'),
    A('r1', 'Birinchi yozuv sinus musbat deydi.', 'Первая запись говорит, что синус положителен.', 'The first reading says the sine is positive.'),
    A('r2', 'Ikkinchisi esa manfiy deydi.', 'Вторая говорит, что он отрицателен.', 'The second says it is negative.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi asbobning o'zi bilan tekshiramiz.", 'Твой ответ записан. Сейчас проверим его самим прибором.', 'Your answer is saved. Now the instrument itself will check it.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('sinus musbat', 'синус положителен', 'the sine is positive'),
      value: 'sin 200° = 0,34',
    },
    b: {
      name: L('sinus manfiy', 'синус отрицателен', 'the sine is negative'),
      value: 'sin 200° = −0,34',
    },
  },
  expr: 'sin 200° = ?',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Nuqta haqida uch savol', 'Три вопроса про точку', 'Three questions about the point'),
  tag: 'support',
  audio: [
    A('mount', 'Uch qisqa savol. Yonidagi chizmada siljish qayerda, balandlik qayerda yozilgan.', 'Три коротких вопроса. На чертеже рядом подписано, где сдвиг и где высота.', 'Three short questions. The drawing beside them labels the shift and the height.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Juftlikning birinchi soni nimani anglatadi?', 'Что означает первое число пары?', 'What does the first number of the pair mean?'),
      done: '(x;  y)  →  x',
      items: [
        { id: 'a', label: L('siljish', 'сдвиг', 'the shift'), correct: true },
        { id: 'b', label: L('balandlik', 'высоту', 'the height'), hint: L("Balandlik ikkinchi son, ya'ni ordinata.", 'Высота это второе число, ордината.', 'The height is the second number, the ordinate.') },
        { id: 'c', label: L('radius', 'радиус', 'the radius'), hint: L("Birlik aylanada radius doim bir, u o'zgarmaydi.", 'Радиус у единичной окружности всегда один, он не меняется.', 'On the unit circle the radius is always one, it does not change.') },
        { id: 'd', label: L('burchak', 'угол', 'the angle'), hint: L('Burchak nuqta beriladigan narsa, uning koordinatasi emas.', 'Угол это то, чем задана точка, а не её координата.', 'The angle is what fixes the point, not its coordinate.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Sinus kattaligi bo'yicha qanday bo'la oladi?", 'Каким может быть синус по величине?', 'How large can the sine be?'),
      done: '−1 ≤ sin α ≤ 1',
      items: [
        { id: 'a', label: L('birdan katta emas', 'не больше единицы', 'no more than one'), correct: true },
        { id: 'b', label: L('har qanday', 'любым', 'anything'), hint: L("Nuqta radiusi bir bo'lgan aylanada, undan uzoqroqqa chiqa olmaydi.", 'Точка лежит на окружности радиуса один и дальше неё уйти не может.', 'The point lies on the circle of radius one and cannot go further.') },
        { id: 'c', label: L('faqat musbat', 'только положительным', 'only positive'), hint: L("O'qdan pastda balandlik manfiy, va bugungi tema shu.", 'Ниже оси высота отрицательна, и это сегодняшняя тема.', "Below the axis the height is negative, and that is today's topic.") },
        { id: 'd', label: L('ikkidan katta emas', 'не больше двух', 'no more than two'), hint: L('Chegara bu radius, u esa birga teng.', 'Граница это радиус, а он равен единице.', 'The bound is the radius, and it equals one.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Musbat burchak qaysi tomonga sanaladi?', 'В какую сторону отсчитывается положительный угол?', 'Which way is a positive angle counted?'),
      done: '+',
      items: [
        { id: 'a', label: L('soat miliga qarshi', 'против часовой', 'counterclockwise'), correct: true },
        { id: 'b', label: L("soat mili bo'ylab", 'по часовой', 'clockwise'), hint: L("Soat mili bo'ylab manfiy burish sanaladi, u keyingi darsda bo'ladi.", 'По часовой отсчитывается отрицательный поворот, он будет на следующем уроке.', 'Clockwise counts a negative turn, that comes in the next lesson.') },
        { id: 'c', label: L('tepadan', 'от верха', 'from the top'), hint: L("Sanoq o'ngdan, o'qning musbat yo'nalishidan boshlanadi.", 'Счёт начинается справа, от положительного направления оси.', 'The count starts on the right, from the positive direction of the axis.') },
        { id: 'd', label: L('qulay tomondan', 'как удобно', 'whichever way suits'), hint: L("Yo'nalish kelishuv bilan berilgan, aks holda bitta burchak ikki nuqta berardi.", 'Направление задано договором, иначе один угол давал бы две точки.', 'The direction is fixed by agreement, otherwise one angle would give two points.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Ishora bu yo'nalish", 'Знак — это направление', 'The sign is the direction'),
  tag: 'znak-po-mnemonike',
  show: [
    [
      L('ikki shkala: siljish va balandlik', 'две шкалы: сдвиг и высота', 'two scales: the shift and the height'),
      L('ikkisi ham musbat', 'обе положительны', 'both are positive'),
    ],
    [
      L("nuqta tepadan o'tdi", 'точка перешла верх', 'the point crossed the top'),
      L("siljish manfiy bo'ldi", 'сдвиг стал отрицательным', 'the shift became negative'),
    ],
    [
      L("nuqta chap tomondan o'tdi", 'точка перешла левую сторону', 'the point crossed the left side'),
      L("balandlik ham manfiy bo'ldi", 'высота тоже стала отрицательной', 'the height became negative too'),
    ],
  ],
  motion: ['up', 'down'],
  audio: [
    A('mount', "Nuqta o'ttiz gradusda. Chizma tagida ikki shkala, siljish va balandlik, ikkisi ham musbat.", 'Точка на тридцати градусах. Под чертежом две шкалы, сдвиг и высота, и обе положительны.', 'The point is at thirty degrees. Below the drawing two scales, the shift and the height, and both are positive.'),
    A('up', "Endi nuqta oldinga suriladi. Nuqta tepadan o'tayotgan paytda siljish shkalasiga qarang. Ishora aynan o'sha yerda almashadi.", 'Теперь точка едет дальше. Смотри на шкалу сдвига в тот момент, когда точка переходит верх. Знак меняется ровно там.', 'Now the point moves on. Watch the shift scale at the moment the point crosses the top. The sign changes exactly there.'),
    A('down', "Nuqta pastga suriladi. Endi balandlik o'qdan o'tadi va uning ishorasi ham almashadi. Yodlashning hojati yo'q, ishora ko'rinadi.", 'Точка едет ниже. Теперь высота переходит ось, и её знак тоже меняется. Ничего запоминать не надо, знак видно.', 'The point moves lower. Now the height crosses the axis and its sign changes too. Nothing to memorise, the sign is visible.'),
    A('work', "Endi o'zingiz. Siljishi manfiy, balandligi musbat bo'lgan nuqtani qo'ying.", 'Теперь сам. Поставь точку так, чтобы сдвиг был отрицательным, а высота положительной.', 'Now you. Place the point so that the shift is negative and the height positive.'),
  ],
  work: {
    prompt: L("Nuqtani qo'ying: siljish manfiy, balandlik musbat.", 'Поставь точку: сдвиг отрицательный, высота положительная.', 'Place the point: the shift negative, the height positive.'),
    ok: L("Siljish chapga, balandlik yuqoriga. Har sonning ishorasi yo'nalishdan ko'rinadi, yodlashga narsa yo'q.", 'Сдвиг влево, высота вверх. Знак каждого числа виден по направлению, и запоминать нечего.', 'The shift goes left, the height up. The sign of each number shows in its direction, nothing to memorise.'),
    hint: [
      L("Ikki son hozircha musbat. Nuqtani eng tepadan o'tkazing.", 'Оба числа пока положительны. Веди точку за самый верх.', 'Both numbers are still positive. Drive the point past the very top.'),
      L("Balandlik o'qdan pastga tushdi. O'qdan yuqorida, lekin chaproqda nuqta kerak.", 'Высота ушла ниже оси. Нужна точка выше оси, но левее.', 'The height went below the axis. You need a point above the axis but to the left.'),
      L("Shkalalarga qarang: siljishda minus, balandlikda plyus bo'lishi kerak.", 'Смотри на шкалы: у сдвига должен быть минус, у высоты плюс.', 'Watch the scales: the shift needs a minus, the height a plus.'),
    ],
  },
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("To'rt qism nom oladi", 'Четыре части получают имена', 'The four parts get names'),
  tag: 'znak-po-mnemonike',
  show: [
    [
      L("o'qlar aylanani to'rt qismga bo'ladi", 'оси делят круг на четыре части', 'the axes cut the circle into four parts'),
      L('ularni choraklar deb ataydi', 'их называют четвертями', 'they are called quadrants'),
    ],
    [
      L("har birida o'z ishoralar juftligi", 'в каждой своя пара знаков', 'each has its own pair of signs'),
      L("choraklar sanog'i soat miliga qarshi ketadi", 'счёт четвертей идёт против часовой', 'the quadrants are counted counterclockwise'),
      '(+; +)   (−; +)   (−; −)   (+; −)',
    ],
  ],
  motion: ['signs'],
  audio: [
    A('mount', "Ikki o'q aylanani to'rt qismga bo'ladi. Ularni choraklar deb ataydi va soat miliga qarshi, o'ng yuqoridan sanaydi.", 'Две оси делят круг на четыре части. Их называют четвертями и считают против часовой, от правой верхней.', 'Two axes cut the circle into four parts. They are called quadrants and counted counterclockwise from the upper right.'),
    A('signs', "Har chorakda o'z ishoralar juftligi bor, va u yodlangan emas, ko'rinadi: siljish qayoqqa, balandlik qayoqqa qaraydi.", 'В каждой четверти своя пара знаков, и она не выучена, а видна: куда смотрит сдвиг, куда смотрит высота.', 'Each quadrant has its own pair of signs, and it is not memorised but visible: which way the shift points, which way the height.'),
    A('work', "Endi o'zingiz. Nuqtani uchinchi chorakka qo'ying.", 'Теперь сам. Поставь точку в третьей четверти.', 'Now you. Place the point in the third quadrant.'),
  ],
  work: {
    prompt: L("Nuqtani uchinchi chorakka qo'ying.", 'Поставь точку в третьей четверти.', 'Place the point in the third quadrant.'),
    ok: L('Uchinchi chorak: ikki son ham manfiy. Siljish chapga, balandlik pastga.', 'Третья четверть: оба числа отрицательны. Сдвиг влево, высота вниз.', 'The third quadrant: both numbers are negative. The shift goes left, the height down.'),
    hint: [
      L('Bu birinchi chorak, u yerda ikki son ham musbat. Soat miliga qarshi sanang.', 'Это первая четверть, там оба числа положительны. Считай против часовой.', 'That is the first quadrant, both numbers are positive there. Count counterclockwise.'),
      L("Bu ikkinchi chorak: siljish manfiy bo'ldi, balandlik esa hali emas.", 'Это вторая четверть: сдвиг уже отрицателен, а высота ещё нет.', 'That is the second quadrant: the shift is negative already, the height not yet.'),
      L("Bu to'rtinchi chorak: balandlik manfiy, siljish esa musbat.", 'Это четвёртая четверть: высота отрицательна, а сдвиг положителен.', 'That is the fourth quadrant: the height is negative, the shift positive.'),
      L("Ikkisi ham manfiy bo'lgan qism kerak: markazdan chapda va pastda.", 'Нужна часть, где отрицательны оба: левее и ниже центра.', 'You need the part where both are negative: left of and below the centre.'),
    ],
  },
}

const S5 = {
  role: 'explain3',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Tangens ishorasi ikki ishoradan', 'Знак тангенса — из двух знаков', 'The tangent sign comes from two signs'),
  tag: 'znak-po-mnemonike',
  show: [
    [
      L('tangens bu nisbat', 'тангенс это отношение', 'the tangent is a ratio'),
      L('ishoralar bir xil, demak plyus', 'знаки одинаковы, значит плюс', 'the signs match, so plus'),
    ],
    [
      L('ikkinchi chorakda ishoralar har xil', 'во второй четверти знаки разные', 'in the second quadrant the signs differ'),
      L('demak tangens manfiy', 'значит тангенс отрицателен', 'so the tangent is negative'),
    ],
  ],
  motion: ['same', 'diff'],
  audio: [
    A('mount', 'Tangens balandlikning siljishga nisbati. Demak uning ishorasi ikki ishoradan chiqadi, uchinchi qoidadan emas.', 'Тангенс это отношение высоты к сдвигу. Значит его знак получается из двух знаков, а не из третьего правила.', 'The tangent is the height over the shift. So its sign comes from those two signs, not from a third rule.'),
    A('same', "Birinchi chorakda ikki son musbat, nisbat musbat. Nuqta uchinchi chorakka suriladi: ikkisi manfiy bo'ldi, nisbat esa yana musbat.", 'В первой четверти оба числа положительны, отношение положительно. Точка едет в третью: оба стали отрицательными, а отношение снова положительно.', 'In the first quadrant both numbers are positive, the ratio is positive. The point moves to the third: both became negative, and the ratio is positive again.'),
    A('diff', "Ikkinchi va to'rtinchi chorakda esa ishoralar har xil, va nisbat manfiy.", 'А во второй и четвёртой знаки разные, и отношение отрицательно.', 'In the second and fourth the signs differ, and the ratio is negative.'),
    A('work', "Endi o'zingiz. Tangensi manfiy bo'ladigan nuqtani qo'ying.", 'Теперь сам. Поставь точку так, чтобы тангенс был отрицательным.', 'Now you. Place the point so that the tangent is negative.'),
  ],
  work: {
    prompt: L("Tangensi manfiy bo'ladigan nuqtani qo'ying.", 'Поставь точку так, чтобы тангенс был отрицательным.', 'Place the point so that the tangent is negative.'),
    ok: L("Ishoralar har xil, demak nisbat manfiy. Ikkinchi va to'rtinchi chorakda shunday.", 'Знаки разные, значит отношение отрицательно. Так во второй и в четвёртой четверти.', 'The signs differ, so the ratio is negative. That happens in the second and the fourth quadrant.'),
    hint: [
      L('Bu yerda ikki son musbat, nisbat ham musbat.', 'Здесь оба числа положительны, и отношение положительно.', 'Here both numbers are positive, and the ratio is positive.'),
      L('Bu yerda ikkisi ham manfiy. Minusga minus plyus beradi.', 'Здесь оба отрицательны. Минус на минус даёт плюс.', 'Here both are negative. Minus over minus gives plus.'),
      L("Bir son musbat, ikkinchisi manfiy bo'lgan chorak kerak.", 'Нужна четверть, где одно число положительно, а другое отрицательно.', 'You need the quadrant where one number is positive and the other negative.'),
    ],
  },
}

const S6 = {
  role: 'explain4',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Uzunlik o'sha, ishora boshqa", 'Длина та же, знак другой', 'The same length, a different sign'),
  tag: 'oba-rastut',
  show: [
    [
      L('yigirma gradus', 'двадцать градусов', 'twenty degrees'),
      L('balandlik yuqoriga', 'высота вверх', 'the height points up'),
    ],
    [
      L('ikki yuz gradus', 'двести градусов', 'two hundred degrees'),
      L("o'sha uzunlik, lekin pastga", 'та же длина, но вниз', 'the same length, but down'),
      'sin 200° = −sin 20°',
    ],
  ],
  motion: ['ride', 'compare'],
  audio: [
    A('mount', 'Nuqta yigirma gradusda. Balandlik kichik va yuqoriga qaragan.', 'Точка на двадцати градусах. Высота небольшая и направлена вверх.', 'The point is at twenty degrees. The height is small and points up.'),
    A('ride', "Endi nuqta ikki yuz gradusga suriladi, ya'ni yuz saksonga uzoqroq. Balandlikka qarang: uzunligi o'sha, yo'nalishi esa pastga aylandi.", 'Теперь точка едет на двести градусов, то есть на сто восемьдесят дальше. Смотри на высоту: длина у неё та же, а направление стало вниз.', 'Now the point moves to two hundred degrees, that is one hundred eighty further. Watch the height: its length is the same, its direction became down.'),
    A('compare', "Burchak o'n baravar kattalashdi, balandlik esa kattaligi bo'yicha o'zgarmadi. Demak o'tkir burchakni va ishorani bilish yetarli.", 'Угол стал в десять раз больше, а высота по величине не изменилась. Значит достаточно знать острый угол и знак.', 'The angle grew ten times, and the height did not change in size. So knowing the acute angle and the sign is enough.'),
    A('work', "Endi o'zingiz. Nuqtani ikki yuz gradusga qo'ying.", 'Теперь сам. Поставь точку на двести градусов.', 'Now you. Place the point at two hundred degrees.'),
  ],
  work: {
    prompt: L("Nuqtani ikki yuz gradusga qo'ying.", 'Поставь точку на двести градусов.', 'Place the point at two hundred degrees.'),
    ok: L('Ikki yuz bu yuz sakson va yana yigirma. Balandlik yigirma gradusdagidek, faqat pastga.', 'Двести это сто восемьдесят и ещё двадцать. Высота такая же, как у двадцати, только вниз.', 'Two hundred is one hundred eighty plus twenty. The height matches twenty degrees, only downward.'),
    hint: [
      L("Bu hali ikkinchi chorakda. Chap tomondan o'tkazib, oldinga boring.", 'Это ещё во второй четверти. Веди дальше, за левую сторону.', 'That is still in the second quadrant. Go further, past the left side.'),
      L('Juda uzoqqa ketdingiz: bu yerda balandlik eng pastga yaqin.', 'Ты прошёл слишком далеко: здесь высота уже близко к самому низу.', 'You went too far: here the height is close to the very bottom.'),
      L('Yuz saksondan bir oz katta burchak kerak: balandlik kichik va pastga qaragan.', 'Нужен угол чуть больше ста восьмидесяти: высота маленькая и направлена вниз.', 'You need an angle just past one hundred eighty: the height small and pointing down.'),
    ],
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("O'qda ishora yo'q", 'На оси знака нет', 'On the axis there is no sign'),
  tag: 'osevoy-po-sosedu',
  show: [
    [
      L("o'qlarda bir chorak tugab, ikkinchisi boshlanadi", 'на осях кончается одна четверть и начинается другая', 'on the axes one quadrant ends and another begins'),
      L('u yerda sonlardan biri nolga teng', 'там одно из чисел равно нулю', 'there one of the numbers equals zero'),
      'cos 90° = 0,   sin 180° = 0',
    ],
  ],
  motion: ['zero'],
  audio: [
    A('mount', "O'qlar choraklar chegarasi. Chegarada ishora yo'q: u yerda ikki sondan biri nolga teng.", 'Оси это граница четвертей. На границе знака нет: там одно из двух чисел равно нулю.', 'The axes are the border of the quadrants. On the border there is no sign: one of the two numbers is zero.'),
    A('zero', "Nuqta to'qson gradusga suriladi va siljish nolga tushadi. Keyin yuz saksonga, va balandlik nolga tushadi. Nol na musbat, na manfiy.", 'Точка едет на девяносто градусов, и сдвиг уходит в ноль. Потом на сто восемьдесят, и в ноль уходит высота. Ноль не положителен и не отрицателен.', 'The point moves to ninety degrees and the shift goes to zero. Then to one hundred eighty, and the height goes to zero. Zero is neither positive nor negative.'),
    A('work', "O'zingiz hisoblang. Ikki yuz yetmish gradusda balandlik qancha?", 'Посчитай сам. Чему равна высота на двухсот семидесяти градусах?', 'Compute it yourself. What is the height at two hundred seventy degrees?'),
  ],
  work: {
    prompt: L('270 gradusda balandlik qancha?', 'Чему равна высота на 270 градусах?', 'What is the height at 270 degrees?'),
    ok: L("Minus bir. Bu eng past joy: balandlik kattaligi bo'yicha eng katta, yo'nalishi esa pastga.", 'Минус один. Это самый низ: высота по величине наибольшая, а направление вниз.', 'Minus one. This is the very bottom: the height is largest in size and points down.'),
    hint: [
      L('Ikki yuz yetmish gradus bu aylananing eng pastki nuqtasi.', 'Двести семьдесят градусов это самый низ окружности.', 'Two hundred seventy degrees is the lowest point of the circle.'),
      L("Balandlik u yerda kattaligi bo'yicha eng katta, va pastga qaragan.", 'Высота там наибольшая по величине, а направлена вниз.', 'The height there is the largest in size and points down.'),
      L('Minus bir.', 'Минус один.', 'Minus one.'),
    ],
    answer: '−1',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L("Chorak bo'yicha ishora", 'Знак по четверти', 'The sign by quadrant'),
  tag: 'znak-po-mnemonike',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Nuqta choraklarni aylanib chiqadi, va har birida o'z ishoralar juftligi ko'rinadi. Qoida darslik so'zlari bilan yozilgan.", 'Точка обходит четверти, и в каждой видна своя пара знаков. Правило записано словами учебника.', "The point goes round the quadrants, and each shows its own pair of signs. The rule is written in the textbook's words."),
  ],
  probe: {
    question: L('Ishorani qanday qilib ishonchli bilib olamiz?', 'Как надёжнее узнать знак?', 'What is the reliable way to find the sign?'),
    items: [
      { id: 'a', label: L("chizmada yo'nalishga qarash", 'посмотреть направление на чертеже', 'look at the direction on the drawing'), correct: true },
      { id: 'b', label: L('qoidani yoddan eslash', 'вспомнить правило наизусть', 'recall the rule by heart'), hint: L("Yodlangan qoida chorak yoddan aniqlangan joyda adashtiradi. Yo'nalish esa doim ko'rinadi.", 'Заученное правило подводит там, где четверть определена на память. Направление видно всегда.', 'A memorised rule fails where the quadrant is guessed from memory. The direction is always visible.') },
    ],
  },
  rule: {
    lawLabel: L('Ishora', 'Знак', 'The sign'),
    lines: [
      L('Qiymatning ishorasi burchak qaysi chorakka tegishli ekani va shu chorakda kerakli koordinataning ishorasi qandayligi bilan aniqlanadi.', 'Знак значения определяется тем, какой четверти принадлежит угол, и каков в этой четверти знак нужной координаты.', 'The sign of a value is determined by which quadrant the angle belongs to and what the sign of that coordinate is in that quadrant.'),
      L("Birinchi koordinata tik o'qning o'ng tomonida musbat, ikkinchisi esa gorizontal o'qdan yuqorida.", 'Первая координата положительна справа от вертикальной оси, вторая — выше горизонтальной.', 'The first coordinate is positive to the right of the vertical axis, the second above the horizontal one.'),
      L('Tangens ishorasi nisbatning ishorasi: bir xil ishoralar plyus, har xil ishoralar minus beradi.', 'Знак тангенса это знак отношения: одинаковые знаки дают плюс, разные — минус.', 'The tangent sign is the sign of the ratio: matching signs give plus, differing signs minus.'),
    ],
    law: 'I (+; +)   II (−; +)   III (−; −)   IV (+; −)',
  },
}

const S9 = {
  role: 'drill',
  answer: 'build',
  format: 'table',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("To'rt burchakning ishoralari", 'Знаки четырёх углов', 'The signs of four angles'),
  tag: 'znak-po-mnemonike',
  audio: [
    A('mount', "To'rt burchak, har chorakdan bittasi. Ishoralarni joylashtiring.", 'Четыре угла, по одному из каждой четверти. Расставь знаки.', 'Four angles, one from each quadrant. Place the signs.'),
  ],
  table: {
    wrong: L("Chizmaga qarang: nuqta belgilangan. Siljish o'ngga bo'lsa plyus, chapga bo'lsa minus.", 'Смотри на чертёж: точка отмечена. Сдвиг вправо это плюс, влево минус.', 'Look at the drawing: the point is marked. A shift right is plus, left is minus.'),
    swap: L('Ishoralar joy almashgan. Birinchisi siljish, ikkinchisi balandlik.', 'Знаки перепутаны местами. Первый это сдвиг, второй высота.', 'The signs are swapped. The first is the shift, the second the height.'),
    ok: L("To'rt chorak yopildi. Har birida ishoralar juftligi o'ziga xos, va u yo'nalishdan ko'rinadi.", 'Четыре четверти закрыты. В каждой пара знаков своя, и её видно по направлению.', 'Four quadrants are closed. Each has its own pair of signs, visible from the direction.'),
    rows: ['40°  →  (+; +)', '130°  →  (−; +)', '200°  →  (−; −)', '320°  →  (+; −)'],
    chips: ['+', '−'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('tg 210° ni qadamlar bilan toping', 'Найди tg 210° по шагам', 'Find tg 210° step by step'),
  tag: 'oba-rastut',
  audio: [
    A('mount', "Ikki yuz o'n gradus. Qadamlar nomlangan, tartibini o'zingiz qo'yasiz. Birinchi qadam bu chorak: usiz ishorani bilib bo'lmaydi.", 'Двести десять градусов. Шаги названы, порядок ставишь ты. Первый шаг это четверть: без неё знак не узнать.', 'Two hundred ten degrees. The steps are named, you put them in order. The first step is the quadrant: without it the sign cannot be found.'),
  ],
  order: {
    prompt: L('Yechim qadamlarini tartib bilan joylashtiring.', 'Расставь шаги решения по порядку.', 'Put the steps of the solution in order.'),
    s2: L('uchinchi chorak', 'третья четверть', 'the third quadrant'),
    s3: L('ishoralar bir xil, tangens musbat', 'знаки одинаковы, тангенс положителен', 'the signs match, the tangent is positive'),
    ok: L('Uch ildizining uchdan biri. Ishora musbat, chunki uchinchi chorakda ikki son ham manfiy.', 'Корень из трёх на три. Знак положителен, потому что в третьей четверти оба числа отрицательны.', 'Root three over three. The sign is positive, because in the third quadrant both numbers are negative.'),
    bad: L("Avval chorak aniqlanadi, keyin ishora, keyin o'tkir burchakka keltirish, keyin qiymat.", 'Сначала определяется четверть, потом знак, потом приведение к острому углу, потом значение.', 'First the quadrant, then the sign, then the reduction to the acute angle, then the value.'),
    s1: '210° = 180° + 30°',
    s4: 'tg 30° = √3/3',
    answer: 's1 s2 s3 s4',
    mark: '210°',
  },
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO INSTRUMENT'),
  title: L('Chizmasiz hisoblang', 'Посчитай без чертежа', 'Compute without a drawing'),
  tag: 'bumaga',
  audio: [
    A('mount', "Bu ekranda aylana yo'q. Imtihonda ham chizma bo'lmaydi.", 'На этом экране окружности нет. На экзамене чертежа тоже не будет.', 'There is no circle on this screen. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
  task: {
    ok: L('Nol. Yuz sakson gradus bu chap nuqta: u yerda balandlik nolga teng.', 'Ноль. Сто восемьдесят градусов это левая точка: высота там равна нулю.', 'Zero. One hundred eighty degrees is the left point: the height there is zero.'),
    hint: [
      L('Yuz sakson gradus bu aylananing chap nuqtasi.', 'Сто восемьдесят градусов это левая точка окружности.', 'One hundred eighty degrees is the left point of the circle.'),
      L('Bu nuqtaning balandligi nolga teng, siljishi esa minus bir.', 'Высота у этой точки равна нулю, а сдвиг минус один.', 'The height of that point is zero, and the shift is minus one.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    prompt: 'sin 180°  =  ?',
    answer: '0',
  },
  order: {
    prompt: L("O'sish tartibida joylashtiring.", 'Расставь по возрастанию.', 'Arrange in increasing order.'),
    title: L('Qaysi sinus kichikroq?', 'Какой синус меньше?', 'Which sine is smaller?'),
    ok: L("Siz kattaliklarni emas, ishorali sonlarni solishtirdingiz: minus bir minus nol butun o'ttiz to'rtdan kichik.", 'Ты сравнил не величины, а числа со знаком: минус один меньше минус нуля целых тридцати четырёх.', 'You compared signed numbers, not sizes: minus one is less than minus zero point three four.'),
    bad: L("Ishora bilan solishtiring, kattaligi bo'yicha emas. Manfiy son noldan kichik, qanchalik katta ko'rinsa ham.", 'Сравнивай со знаком, а не по величине. Отрицательное меньше нуля, каким бы большим оно ни казалось.', 'Compare with the sign, not by size. A negative number is less than zero, however large it looks.'),
    items: ['sin 270°', 'sin 200°', 'sin 0', 'sin 30°'],
    answer: 'sin 270°  sin 200°  sin 0  sin 30°',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L("Javob noto'g'ri. Qayerda?", 'Ответ неверный. Где?', 'The answer is wrong. Where?'),
  tag: 'check',
  audio: [
    A('mount', 'Masala. Ikki yuz gradusning sinusini topish kerak.', 'Задача. Надо найти синус двухсот градусов.', 'A task. We need to find the sine of two hundred degrees.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L("Bu qator to'g'ri: yuz sakson qo'shuv yigirma ikki yuzni beradi.", 'Эта строка верна: сто восемьдесят плюс двадцать даёт двести.', 'This line is right: one hundred eighty plus twenty gives two hundred.'),
    r3: L("Bu yigirma gradus uchun to'g'ri qiymat. Xatoni yuqoridan qidiring.", 'Это верное значение для двадцати градусов. Ищи ошибку выше.', 'That is the correct value for twenty degrees. Look higher.'),
    r4: L("Bu qator oldingisidan to'g'ri kelib chiqadi. Birinchi xato qator yuqorida.", 'Эта строка следует из предыдущей верно. Первая неверная строка выше.', 'This line follows correctly. The first wrong line is above.'),
  },
  proof: L('180 gradusdan keyin balandlik pastga tushadi.', 'Через 180 градусов высота уходит вниз.', 'Past 180 degrees the height goes down.'),
  entry: {
    prompt: L('sin 200° qancha? Yuzdan birgacha.', 'Чему равен sin 200°? До сотых.', 'What is sin 200°? To two decimals.'),
    ok: L("Minus nol butun o'ttiz to'rt. Kattaligi yigirma gradusdagidek, ishora esa minus: nuqta o'qdan pastda.", 'Минус ноль целых тридцать четыре. Величина как у двадцати градусов, а знак минус: точка ниже оси.', 'Minus zero point three four. The size matches twenty degrees, the sign is minus: the point is below the axis.'),
    hint: [
      L("Ikki yuz gradus yuz saksondan bir oz uzoqroq, demak nuqta o'qdan pastda.", 'Двести градусов чуть дальше ста восьмидесяти, значит точка ниже оси.', 'Two hundred degrees is just past one hundred eighty, so the point is below the axis.'),
      L('Kattaligi yigirma gradusdagidek, ishora esa minus.', 'Величина та же, что у двадцати градусов, а знак минус.', 'The size matches twenty degrees, and the sign is minus.'),
      L("Minus nol butun o'ttiz to'rt.", 'Минус ноль целых тридцать четыре.', 'Minus zero point three four.'),
    ],
    answer: '−0,34',
  },
  row: {
    r1: '200° = 180° + 20°',
    r2: 'sin(180° + α) = sin α',
    r3: 'sin 20° ≈ 0,34',
    r4: 'sin 200° ≈ 0,34',
  },
  answerId: 'r2',
}

const S13 = {
  role: 'transfer',
  answer: 'lead',
  format: 'place+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Ishoralar berilgan, burchak kerak', 'Знаки даны, угол нужен', 'The signs are given, the angle is needed'),
  tag: 'obratnoe',
  audio: [
    A('mount', 'Endi teskari masala. Burchak berilmagan, ishoralar berilgan.', 'Теперь обратная задача. Угол не дан, даны знаки.', 'Now the inverse task. The angle is not given, the signs are.'),
    A('work', "Nuqtani qo'ying, keyin hamma to'g'ri yozuvni belgilaysiz.", 'Поставь точку, потом отметишь все верные записи.', 'Place the point, then you will mark every true reading.'),
  ],
  multi: {
    prompt: L("Uchinchi chorak uchun to'g'ri bo'lgan hamma yozuvni belgilang.", 'Отметь все записи, верные для третьей четверти.', 'Mark every reading that is true in the third quadrant.'),
    title: L("Uchinchi chorakda qaysi yozuvlar to'g'ri?", 'Какие записи верны в третьей четверти?', 'Which readings are true in the third quadrant?'),
    ok: L('Beshtadan uchtasi. Tangens ishorasi yoddan emas, boshqa ikki ishoradan keldi.', 'Три записи из пяти. Знак тангенса пришёл не из памяти, а из двух других знаков.', 'Three out of five. The tangent sign came not from memory but from the other two signs.'),
    items: [
      { id: 'd', label: 'tg α < 0', hint: L('Tangens u yerda musbat: minusga minus plyus beradi.', 'Тангенс там положителен: минус на минус даёт плюс.', 'The tangent is positive there: minus over minus gives plus.') },
      { id: 'e', label: 'cos α > 0', hint: L('Siljish u yerda manfiy, nuqta markazdan chapda.', 'Сдвиг там отрицателен, точка левее центра.', 'The shift is negative there, the point is left of the centre.') },
      { id: 'a', label: 'cos α < 0', ok: true },
      { id: 'b', label: 'sin α < 0', ok: true },
      { id: 'c', label: 'tg α > 0', ok: true },
    ],
  },
  place: {
    prompt: L("Ikki son ham manfiy. Shunday burchakka nuqta qo'ying.", 'Оба числа отрицательны. Поставь точку на такой угол.', 'Both numbers are negative. Place the point at such an angle.'),
    ok: L("Uchinchi chorak. Siljish chapga, balandlik pastga, boshqa variant yo'q.", 'Третья четверть. Сдвиг влево, высота вниз, других вариантов нет.', 'The third quadrant. The shift left, the height down, there is no other option.'),
    wrong: L("Siljish chapga, balandlik esa pastga bo'lgan qism kerak.", 'Нужна часть круга, где сдвиг влево и высота вниз одновременно.', 'You need the part where the shift goes left and the height down at once.'),
    target: '210°',
    step: '(−; −)  →  III',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'znak-po-mnemonike',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Ikki yuz gradusning sinusi musbat yoki manfiy?', 'Синус двухсот градусов положителен или отрицателен?', 'Is the sine of two hundred degrees positive or negative?'),
      done: 'sin 200° < 0',
      items: [
        { id: 'a', label: L('manfiy', 'отрицателен', 'negative'), correct: true },
        { id: 'b', label: L('musbat', 'положителен', 'positive'), hint: L("Ikki yuz gradusdagi nuqta o'qdan pastda, o'qdan pastda esa balandlik manfiy.", 'Точка на двухсот градусах ниже оси, а ниже оси высота отрицательна.', 'The point at two hundred degrees is below the axis, and below the axis the height is negative.') },
        { id: 'c', label: L('nolga teng', 'равен нулю', 'zero'), hint: L("Nol aynan o'qda, ya'ni yuz saksonda bo'lardi.", 'Ноль был бы ровно на оси, то есть на ста восьмидесяти.', 'Zero would be exactly on the axis, that is at one hundred eighty.') },
        { id: 'd', label: L('aniqlash mumkin emas', 'нельзя сказать', 'cannot be said'), hint: L("Mumkin: nuqta o'qdan yuqorida yoki pastda ekaniga qarash yetarli.", 'Можно: достаточно посмотреть, выше оси точка или ниже.', 'You can: just look whether the point is above or below the axis.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Ikki yuz gradus qaysi chorakda yotadi?', 'В какой четверти лежит двести градусов?', 'Which quadrant does two hundred degrees lie in?'),
      done: '200°  →  III',
      items: [
        { id: 'a', label: L('uchinchida', 'в третьей', 'the third'), correct: true },
        { id: 'b', label: L('ikkinchida', 'во второй', 'the second'), hint: L('Ikkinchi chorak yuz saksonda tugaydi.', 'Вторая четверть кончается на ста восьмидесяти.', 'The second quadrant ends at one hundred eighty.') },
        { id: 'c', label: L("to'rtinchida", 'в четвёртой', 'the fourth'), hint: L("To'rtinchi chorak ikki yuz yetmishdan keyin boshlanadi.", 'Четвёртая начинается после двухсот семидесяти.', 'The fourth begins after two hundred seventy.') },
        { id: 'd', label: L('birinchida', 'в первой', 'the first'), hint: L("Birinchisi noldan to'qsongacha.", 'Первая это от нуля до девяноста.', 'The first runs from zero to ninety.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Tangens ishorasini qanday bilib olamiz?', 'Как узнать знак тангенса?', 'How do you find the sign of the tangent?'),
      done: '(−) : (−) = (+)',
      items: [
        { id: 'a', label: L('ikki ishorani solishtirish', 'сравнить два знака', 'compare the two signs'), correct: true, ok: L('Ha. Bir xil ishoralar plyus, har xil ishoralar minus beradi.', 'Да. Одинаковые дают плюс, разные минус.', 'Yes. Matching signs give plus, differing signs minus.') },
        { id: 'b', label: L('uchinchi qoidani yodlash', 'выучить третье правило', 'memorise a third rule'), hint: L("Uchinchi qoida yo'q: nisbatning ishorasi ikki ishoradan chiqadi.", 'Третьего правила нет: знак отношения получается из двух знаков.', 'There is no third rule: the sign of a ratio comes from the two signs.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Ikki yuz gradusning tangensi musbat yoki manfiy?', 'Тангенс двухсот градусов положителен или отрицателен?', 'Is the tangent of two hundred degrees positive or negative?'),
      done: 'tg 200° > 0',
      items: [
        { id: 'a', label: L('musbat', 'положителен', 'positive'), correct: true },
        { id: 'b', label: L('manfiy', 'отрицателен', 'negative'), hint: L('U yerda ikki son ham manfiy, minusga minus esa plyus beradi.', 'Оба числа там отрицательны, а минус на минус даёт плюс.', 'Both numbers are negative there, and minus over minus gives plus.') },
        { id: 'c', label: L('nolga teng', 'равен нулю', 'zero'), hint: L("Nol balandlik nolga teng joyda, ya'ni o'qda bo'lardi.", 'Ноль был бы там, где высота равна нулю, то есть на оси.', 'Zero would be where the height is zero, that is on the axis.') },
        { id: 'd', label: L('mavjud emas', 'не существует', 'does not exist'), hint: L("Tangens faqat siljish nolga teng joyda yo'q: to'qsonda va ikki yuz yetmishda.", 'Тангенса нет только там, где сдвиг равен нулю: на девяноста и двухсот семидесяти.', 'The tangent is missing only where the shift is zero: at ninety and at two hundred seventy.') },
      ],
    },
  ],
  angles: ['200°', '200°', '200°', '200°'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  audio: [
    A('mount', 'Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija.', 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
    A('next', "Ikki yuz gradusning sinusi manfiy, va bu chizmadan ko'rinadi, yoddan emas.", 'Синус двухсот градусов отрицателен, и это видно по чертежу, а не по памяти.', 'The sine of two hundred degrees is negative, and that shows on the drawing, not in memory.'),
  ],
  can: [
    L("Ishorani yo'nalish bo'yicha aniqlayman, yoddan emas", 'Определяю знак по направлению, а не по памяти', 'I find the sign by direction, not from memory'),
    L('Har qanday burchakning chorakini ayta olaman', 'Называю четверть любого угла', 'I name the quadrant of any angle'),
    L('Tangens ishorasini ikki ishoradan chiqaraman', 'Знак тангенса вывожу из двух знаков', 'I derive the tangent sign from the two signs'),
    L("Qiymatni o'tkir burchakka keltiraman", 'Привожу значение к острому углу', 'I reduce a value to the acute angle'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L('Bitta joy takrorlashni talab qiladi: chorak raqami.', 'Одно место требует повтора: номер четверти.', 'One place needs review: the number of the quadrant.'),
    back: L('Qoidaga va 3-ekranga qayting.', 'Вернись к правилу и к экрану 3.', 'Go back to the rule and to screen 3.'),
  },
  bridge: L("5-dars: o'sha aylana, lekin teskari tomonga burish, va shundan juftlik va davr.", 'Урок 5: тот же круг, но поворот в обратную сторону — и оттуда чётность и период.', 'Lesson 5: the same circle, but turning the other way, and from that parity and period.'),
  lifehack: L('Jadvalni yodlamang. Siljish qayoqqa, balandlik qayoqqa qaraganiga qarang.', 'Не помни таблицу. Посмотри, куда смотрит сдвиг и куда высота.', 'Do not memorise the table. Look where the shift points and where the height points.'),
  sheetTitle: L('Ishoralar · shpargalka', 'Знаки · шпаргалка', 'The signs · cheat sheet'),
  sheetSrc: L('10-sinf · 4-dars', '10 класс · урок 4', 'Grade 10 · lesson 4'),
  hook: {
    a: 'sin 200° > 0',
    b: 'sin 200° < 0',
  },
  proved: 'sin 200° = −0,34',
  law: 'I (+; +)   II (−; +)   III (−; −)   IV (+; −)',
  sheet: [
    'cos α > 0  ↔  x > 0',
    'tg α > 0  ↔  I, III',
    'sin(180° + α) = −sin α',
    'cos 90° = 0,   sin 180° = 0',
    'tg 90°  —,   tg 270°  —',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

// Число из контента: там оно записано так, как читает методист («−0,34»), а
// прибору нужно настоящее число. Один источник истины — документ контента.
const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))

// Строки таблицы знаков разбираются ИЗ КОНТЕНТА, а не переписываются здесь:
// «40°  →  (+; +)» даёт угол и пару чипов. Иначе значения жили бы в двух
// местах и разошлись бы на первой же правке.
const SIGN_ROWS = S9.table.rows.map((r) => {
  const [a, b] = r.split('→').map((x) => x.trim())
  const [c, s] = b.replace(/[()]/g, '').split(';').map((x) => x.trim())
  return { deg: parseInt(a, 10), label: a, cos: c === '+' ? 'p' : 'm', sin: s === '+' ? 'p' : 'm' }
})
const SIGN_CHIPS = [
  { id: 'p', label: '+', value: 1 },
  { id: 'm', label: '−', value: -1 },
]

const ORD10 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S10.order[id] }))
const ORD11 = S11.order.items.map((label, i) => ({ id: 'o' + i, label }))
const ORD11_ANS = String(S11.order.answer).split(/\s{2,}/)
  .map((lbl) => (ORD11.find((x) => x.label === lbl.trim()) || {}).id)

const TRAP_ROWS = ['r1', 'r2', 'r3', 'r4'].map((id) => ({ id, text: S12.row[id] }))

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        // `rows` собирается здесь: в контенте запись и подпись лежат под одним
        // ключом (`row.a.name` и `row.a.value`), потому что методисту так
        // читать удобнее, а прибору нужен массив.
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Точка ПРИХОДИТ на 200°, координаты не подписаны: хук это прогноз,
        // ответ до действия не выдаётся. Оси тоже без подписей — иначе знак
        // читался бы с чертежа раньше, чем ученик подумает.
        fig={() => <Scene fig={<UnitCircle angle={200} locked ticks axes={false} />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1}>
        <Col>
          {/* Оси ПОДПИСАНЫ смыслом (`meaning`): «сдвиг» и «высота» стоят под
              названиями координат. Первый и третий вопросы ровно про это, и
              ответ на них ученик читает с чертежа. */}
          <Scene fig={<UnitCircle angle={40} locked drop meaning ticks />} max={300} />
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
      /* Свидетель урока: знак на шкале меняется В ТОТ МОМЕНТ, когда точка
         переходит ось. Нулевая линия в этот момент подсвечивается. */
      <Scene
        fig={<SignScales step={phase} angles={[30, 130, 210]} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S3.work.prompt}
        test={(c, s) => c < -0.2 && s > 0.2}
        hints={[
          { when: (c) => c > 0.1, text: S3.work.hint[0] },
          { when: (c, s) => s < 0, text: S3.work.hint[1] },
          { when: () => true, text: S3.work.hint[2] },
        ]}
        okText={S3.work.ok}
        snap={[120, 135, 150]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      /* Слово «четверть» вводится здесь, впервые в классе. Сначала части
         получают имена, потом к каждой приписывается пара знаков. */
      <Scene
        fig={<QuadNames step={phase} />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S4.work.prompt}
        test={(c, s) => c < -0.2 && s < -0.2}
        hints={[
          { when: (c, s) => c > 0 && s > 0, text: S4.work.hint[0] },
          { when: (c, s) => c < 0 && s > 0, text: S4.work.hint[1] },
          { when: (c, s) => c > 0 && s < 0, text: S4.work.hint[2] },
          { when: () => true, text: S4.work.hint[3] },
        ]}
        okText={S4.work.ok}
        snap={[210, 225, 240]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      /* Третья шкала — тангенс. Он стоит РЯДОМ с двумя своими, и видно, что
         его знак не отдельное правило, а произведение двух знаков. */
      <Scene
        fig={<SignScales step={phase} angles={[40, 220]} tan />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S5.work.prompt}
        test={(c, s) => c * s < -0.05}
        hints={[
          { when: (c, s) => c > 0 && s > 0, text: S5.work.hint[0] },
          { when: (c, s) => c < 0 && s < 0, text: S5.work.hint[1] },
          { when: () => true, text: S5.work.hint[2] },
        ]}
        okText={S5.work.ok}
        snap={[130, 150, 310, 330]}
        readout={{ tan: true }}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      /* Здесь та же фигура работает ДРУГИМ свидетелем: столбик сдвига при 20°
         и при 200° одинаковой ДЛИНЫ, только направлен в другую сторону. Угол
         вырос в десять раз, величина не изменилась. */
      <Scene
        fig={<SignScales step={phase} angles={[20, 200]} />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S6.work.prompt}
        test={(c, s) => Math.abs(c + 0.94) < 0.06 && s < 0 && s > -0.5}
        hints={[
          { when: (c, s) => s > 0, text: S6.work.hint[0] },
          { when: (c, s) => s < -0.6, text: S6.work.hint[1] },
          { when: () => true, text: S6.work.hint[2] },
        ]}
        okText={S6.work.ok}
        snap={[200]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen7 = (p) => (
  <Screen data={S7} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S7.show.length && !solved ? (
      /* На осях знака нет: столбик стоит на нуле, и вместо плюса или минуса
         прибор показывает ноль. */
      <Scene
        fig={<SignScales step={phase} angles={[90, 180]} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<UnitCircle angle={270} locked drop values />} max={300} />
        </Col>
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
        // Пары знаков появляются В МОМЕНТ ответа на чек различения: карточка
        // открывается, и чертёж дописывает то, что она описывает.
        fig={(solved) => <Scene fig={<QuadNames step={solved ? 1 : 0} />} max={330} />}
      />
    )}
  </Screen>
)

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <TableFill
        // Chizma YORDAMCHI: ish jadvalda, chizma burchakni belgilaydi.
        figH={168}
        rows={SIGN_ROWS}
        chips={SIGN_CHIPS}
        wrongNote={S9.table.wrong}
        swapNote={S9.table.swap}
        okText={S9.table.ok}
        audio={audio}
        onSolved={solve}
      />
    )}
  </Screen>
)

const Screen10 = (p) => (
  <Screen data={S10} {...p}>
    {({ audio, solve }) => (
      <OrderRow
        prompt={S10.order.prompt}
        items={ORD10}
        answer={['s1', 's2', 's3', 's4']}
        marks={[{ deg: 210, tone: 'graph', label: S10.order.mark }]}
        okText={S10.order.ok}
        badText={S10.order.bad}
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
            audio={audio}
            onSolved={() => setStage(1)}
          />
        </Col>
        <Col>
          {stage === 1 ? (
            /* Чертежа здесь НЕТ, и это не упущение. С ним экран вылезал на
               48 px на телефоне (проверка вёрстки, 2026-08-13). Свидетель
               ловушки — само число: у двухсот градусов высота отрицательна, и
               ученик это уже видел на экранах 3 и 6. Тот же вывод, что в
               уроке 2: картинка, которая не влезает, отнимает больше, чем даёт. */
            <>
              <NumberEntry
                compact
                prompt={S12.entry.prompt}
                answer={num(S12.entry.answer)}
                okText={S12.entry.ok}
                hints={S12.entry.hint}
                audio={audio}
                onSolved={solve}
              />
            </>
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
      <PlaceAngle
        prompt={S13.place.prompt}
        targets={[parseInt(S13.place.target, 10)]}
        steps={[S13.place.step]}
        okText={S13.place.ok}
        wrongText={S13.place.wrong}
        audio={audio}
        extra={{ ticks: true }}
        onSolved={() => setTimeout(() => { setTitle(S13.multi.title); setStage(1) }, 1500)}
      />
    ))}
  </Screen>
)

const Screen14 = (p) => (
  <Screen data={S14} {...p}>
    {(s) => (
      <BlitzBody
        {...s}
        data={S14}
        fig={() => (
          <Scene fig={<UnitCircle angle={parseInt(S14.angles[0], 10)} locked drop />} max={300} />
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
        // `hookLabels` и `sheetSteps` собираются здесь: в контенте они лежат
        // под именами, удобными для чтения (`hook.a`, `sheet.1`).
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
