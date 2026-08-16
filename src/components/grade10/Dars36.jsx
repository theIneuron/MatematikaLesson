// ============================================================================
// 10-sinf, Dars 36. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS36_KONTENT.md
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
  PlaceAngle,
  ProbeChain,
  Scene,
  UnitCircle,
} from './tools.jsx'

import { LevelLine } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 36
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Trigonometrik tengsizliklar`,
  `Урок ${LESSON_NO}. Тригон. неравенства`,
  `Lesson ${LESSON_NO}. Trigonometric inequalities`,
)

const BLOCK = { label: 'B5', from: 26, to: 37, current: 36 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('TENGSIZLIK', 'НЕРАВЕНСТВО', 'THE INEQUALITY'),
  title: L('Nuqtami yoki yoy', 'Точка или дуга', 'A point or an arc'),
  audio: [
    A('mount', "Sinus iks bir ikkidan katta. Chapda va o'ngda ikki xil javob.", 'Синус икс больше одной второй. Слева и справа два разных ответа.', 'Sine of x is greater than one half. On the left and on the right two different answers.'),
    A('r1', "Birinchi yozuv javob o'ttiz gradus deydi: sinus aynan o'sha yerda bir ikkidanga teng.", 'Первая запись говорит, что ответ это тридцать градусов: именно там синус равен одной второй.', 'The first reading says the answer is thirty degrees: that is where the sine equals one half.'),
    A('r2', "Ikkinchisi javob o'ttizdan bir yuz ellik gradusgacha bo'lgan butun bo'lak deydi, va u har aylanishda takrorlanadi.", 'Вторая говорит, что ответ это целый кусок от тридцати до ста пятидесяти градусов, и он повторяется каждый оборот.', 'The second says the answer is a whole piece from thirty to one hundred fifty degrees, and it repeats every turn.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi gorizontal o'tkazib ko'ramiz.", 'Твой ответ записан. Сейчас проведём горизонталь и посмотрим.', 'Your answer is saved. Now we will draw the horizontal and look.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('bitta nuqta yozdik', 'записали одну точку', 'one point was written down'),
      value: 'x = 30°',
    },
    b: {
      name: L('butun yoy yozdik', 'записали целую дугу', 'a whole arc was written down'),
      value: '30° < x < 150°',
    },
  },
  expr: 'sin x > 1/2',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Tengsizlikdan oldin uch savol', 'Три вопроса перед неравенством', 'Three questions before the inequality'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Aylanada sinus qayerdan o'qiladi?", 'Где на окружности читают синус?', 'Where on the circle is the sine read?'),
      done: 'sin x = y',
      items: [
        { id: 'a', label: L("tik o'q bo'yicha", 'по вертикальной оси', 'along the vertical axis'), correct: true },
        { id: 'b', label: L("yotiq o'q bo'yicha", 'по горизонтальной оси', 'along the horizontal axis'), hint: L("Yotiq o'q bo'yicha kosinus o'qiladi.", 'По горизонтальной читают косинус.', 'The horizontal axis is where the cosine is read.') },
        { id: 'c', label: L("yoy uzunligi bo'yicha", 'по длине дуги', 'along the length of the arc'), hint: L("Yoy uzunligi bu radiandagi burchakning o'zi, sinus emas.", 'Длина дуги это сам угол в радианах, а не синус.', 'The arc length is the angle in radians, not the sine.') },
        { id: 'd', label: L("radius bo'yicha", 'по радиусу', 'along the radius'), hint: L('Radius bu yerda doim bir, u hech nimani ajratmaydi.', 'Радиус здесь всегда единица, он ничего не различает.', 'The radius is always one here, it tells nothing apart.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Sinus qaysi sonlar orasida yotadi?', 'Между какими числами лежит синус?', 'Between which numbers does the sine lie?'),
      done: '−1 ≤ sin x ≤ 1',
      items: [
        { id: 'a', label: L('minus bir va bir orasida', 'между минус одним и одним', 'between minus one and one'), correct: true },
        { id: 'b', label: L('nol va bir orasida', 'между нулём и одним', 'between zero and one'), hint: L('Aylananing pastida sinus manfiy.', 'Внизу окружности синус отрицательный.', 'At the bottom of the circle the sine is negative.') },
        { id: 'c', label: L('har qanday son', 'любое число', 'any number'), hint: L("Sinus birdan katta bo'lmaydi: doiradan yuqorida nuqta yo'q.", 'Больше единицы синус не бывает: выше круга точек нет.', 'The sine is never greater than one: there are no points above the circle.') },
        { id: 'd', label: L('minus ikki va ikki orasida', 'между минус двумя и двумя', 'between minus two and two'), hint: L('Radius birga teng, demak balandlik ham birdan katta emas.', 'Радиус равен единице, значит и высота не больше единицы.', 'The radius equals one, so the height is no greater than one.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Barcha aylanishlarni hisobga olish uchun javobga nima qo'shiladi?", 'Что добавляют к ответу, чтобы учесть все обороты?', 'What is added to the answer to account for all the turns?'),
      done: '+ 360°n',
      items: [
        { id: 'a', label: L("butun songa ko'paytirilgan uch yuz oltmish gradus", 'триста шестьдесят градусов, умноженные на целое число', 'three hundred sixty degrees times a whole number'), correct: true },
        { id: 'b', label: L('bir yuz sakson gradus', 'сто восемьдесят градусов', 'one hundred eighty degrees'), hint: L('Bir yuz sakson yarim aylanish, nuqta boshqa joyga tushadi.', 'Сто восемьдесят это половина оборота, точка окажется не там.', 'One hundred eighty is half a turn, the point would land elsewhere.') },
        { id: 'c', label: L("hech nima qo'shilmaydi", 'ничего не добавляют', 'nothing is added'), hint: L("U holda birinchisidan boshqa barcha aylanishlar yo'qoladi.", 'Тогда потеряются все обороты, кроме первого.', 'Then every turn except the first would be lost.') },
        { id: 'd', label: L("to'qson gradus", 'девяносто градусов', 'ninety degrees'), hint: L("To'qson chorak aylanish.", 'Девяносто это четверть оборота.', 'Ninety is a quarter of a turn.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Gorizontal doirani ikki marta kesadi', 'Горизонталь режет круг дважды', 'The horizontal cuts the circle twice'),
  tag: 'odin-koren',
  show: [
    [
      L("to'g'ri chiziq bir ikkidan balandlikda boradi", 'прямая идёт на высоте одна вторая', 'the line runs at height one half'),
      L('u aylanani ikki nuqtada kesadi', 'она пересекает окружность в двух точках', 'it crosses the circle at two points'),
      L("birinchi nuqta o'ngda", 'первая точка справа', 'the first point is on the right'),
    ],
    [
      L("bu o'ttiz gradus", 'это тридцать градусов', 'that is thirty degrees'),
      L('u yerda sinus roppa-rosa bir ikkidan', 'там синус ровно одна вторая', 'there the sine is exactly one half'),
      L("shu nuqtani o'zingiz qo'ying", 'поставь эту точку сам', 'place that point yourself'),
    ],
  ],
  motion: ['cut'],
  audio: [
    A('mount', "Bir ikkidan balandlikda to'g'ri chiziq. Hammasi sinus iks a ga teng darsidagidek.", 'Прямая на высоте одна вторая. Всё как в уроке про синус икс равно а.', 'A line at height one half. Everything as in the lesson on sine x equals a.'),
    A('cut', "Bir ikkidan balandlikdagi to'g'ri chiziq aylanani ikki nuqtada kesadi, va bu allaqachon tanish: tenglama aynan shunday yechilardi. Birinchi nuqta o'ng yuqorida yotadi, unga o'ttiz gradus burchak mos keladi. Tekshirish oson: o'ttiz gradusning sinusi bir ikkidanga teng, bu jadvaldagi qiymat. Shu nuqtani aylanaga o'zingiz qo'ying. Keyin ikkinchisini topamiz va ular orasida nima yotganiga qaraymiz.", 'Прямая на высоте одна вторая пересекает окружность в двух точках, и это уже знакомо: ровно так решалось уравнение. Первая точка лежит справа сверху, ей отвечает угол тридцать градусов. Проверить легко: синус тридцати градусов равен одной второй, это значение из таблицы. Поставь эту точку на окружности сам. Дальше мы найдём вторую и посмотрим, что лежит между ними.', 'The line at height one half crosses the circle at two points, and that is already familiar: this is exactly how the equation was solved. The first point lies at the upper right, and the angle thirty degrees belongs to it. It is easy to check: the sine of thirty degrees equals one half, a value from the table. Place that point on the circle yourself. Then we will find the second one and look at what lies between them.'),
    A('work', "Sinus bir ikkidanga teng bo'lgan joyga, o'ngga nuqta qo'ying.", 'Поставь точку там, где синус равен одной второй, справа.', 'Place the point where the sine equals one half, on the right.'),
  ],
  place: {
    prompt: L("Sinus bir ikkidanga teng nuqtani qo'ying", 'Поставь точку, где синус равен одной второй', 'Place the point where the sine equals one half'),
    ok: L("O'ttiz gradus. Bu yoyning birinchi chegarasi.", 'Тридцать градусов. Это первая граница дуги.', 'Thirty degrees. That is the first boundary of the arc.'),
    bad: L("Nuqtaning chapda yoki o'ngdaligiga emas, balandligiga qarang.", 'Смотри на высоту точки, а не на её положение слева или справа.', 'Look at the height of the point, not at whether it is left or right.'),
    target: '30',
    step: '30',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Tenglamada nuqtalar, tengsizlikda ular orasidagi', 'У уравнения точки, у неравенства то, что между', 'An equation has points, an inequality has what lies between'),
  tag: 'odin-koren',
  show: [
    [
      L('ikkinchi nuqta chap yuqorida yotadi', 'вторая точка лежит слева сверху', 'the second point lies at the upper left'),
      L('bu bir yuz ellik gradus', 'это сто пятьдесят градусов', 'that is one hundred fifty degrees'),
      L('u yerda ham sinus bir ikkidan', 'синус там тоже одна вторая', 'the sine there is one half as well'),
    ],
    [
      L('tenglamada javob ikki nuqta', 'у уравнения ответ это две точки', 'for an equation the answer is two points'),
      L('tengsizlikda javob ular orasidagi yoy', 'у неравенства ответ это дуга между ними', 'for an inequality the answer is the arc between them'),
      L('nuqtalar chegaraga aylandi', 'точки стали границами', 'the points became boundaries'),
    ],
  ],
  motion: ['arc'],
  audio: [
    A('mount', "Ikkinchi nuqta chap yuqorida. U darrov kerak bo'ladi.", 'Вторая точка слева сверху. Она понадобится сразу.', 'The second point is at the upper left. It will be needed right away.'),
    A('arc', "Ikkinchi nuqta bir yuz ellik gradus, u yerda ham sinus bir ikkidanga teng. Agar bizda tenglama bo'lganida, hammasi shu bilan tugardi: ikki nuqta, ikki seriya, javob yozildi. Lekin bizda tengsizlik, sinus esa bir ikkidandan katta bo'lishi kerak. Aylananing nuqtasi to'g'ri chiziqdan qayerda balandroq ko'tarilishiga qarang. Bu o'ttiz va bir yuz ellik gradus orasidagi butun yuqori yoy. Uning har bir nuqtasi yechim, faqat chekkalari emas. Chekkalarning o'zi esa aksincha, javobga kirmaydi: u yerda sinus bir ikkidanga teng, kerak esa kattaroq.", 'Вторая точка это сто пятьдесят градусов, и синус там тоже равен одной второй. Если бы у нас было уравнение, на этом всё и закончилось бы: две точки, две серии, ответ записан. Но у нас неравенство, и синус должен быть больше одной второй. Посмотри, где точка окружности поднимается выше прямой. Это вся верхняя дуга между тридцатью и ста пятьюдесятью градусами. Каждая её точка решение, а не только концы. Сами концы, наоборот, в ответ не входят: там синус равен одной второй, а нужно больше.', 'The second point is one hundred fifty degrees, and the sine there also equals one half. If we had an equation, that would be the end of it: two points, two series, the answer written. But we have an inequality, and the sine has to be greater than one half. Look at where a point of the circle rises above the line. That is the whole upper arc between thirty and one hundred fifty degrees. Every point of it is a solution, not only the ends. The ends themselves, on the contrary, do not belong to the answer: there the sine equals one half, while greater is required.'),
    A('work', "Ikkinchi nuqtani chap yuqoriga qo'ying.", 'Поставь вторую точку, слева сверху.', 'Place the second point, at the upper left.'),
  ],
  place: {
    prompt: L("Ikkinchi nuqtani qo'ying", 'Поставь вторую точку', 'Place the second point'),
    ok: L("Bir yuz ellik gradus. Ikki nuqta orasidagi yoy javobning o'zi.", 'Сто пятьдесят градусов. Дуга между двумя точками и есть ответ.', 'One hundred fifty degrees. The arc between the two points is the answer.'),
    bad: L("Ikkinchi nuqta o'sha balandlikda, lekin boshqa tomonda.", 'Вторая точка на той же высоте, но с другой стороны.', 'The second point is at the same height but on the other side.'),
    target: '150',
    step: '30',
  },
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Yoy har aylanishda takrorlanadi', 'Дуга повторяется каждый оборот', 'The arc repeats every turn'),
  tag: 'seriya-bez-n',
  show: [
    [
      L('bitta yoy hali butun javob emas', 'одна дуга это ещё не весь ответ', 'one arc is not yet the whole answer'),
      L("to'liq aylanishdan keyin nuqta qaytadi", 'после полного оборота точка возвращается', 'after a full turn the point comes back'),
      L("uning sinusi o'sha", 'синус у неё тот же', 'its sine is the same'),
    ],
    [
      L('demak yoy takrorlanadi', 'значит дуга повторяется', 'so the arc repeats'),
      L("ikkala chekkaga aylanish qo'shiladi", 'к обоим концам добавляют оборот', 'a turn is added to both ends'),
      L('aylanish istalgancha marta olinadi', 'оборот берут любое число раз', 'the turn is taken any number of times'),
    ],
  ],
  motion: ['turn'],
  audio: [
    A('mount', 'Yoy topildi, lekin javob hali yozilmagan. Aylanishlarni hisobga olish qoldi.', 'Дуга найдена, но ответ ещё не записан. Осталось учесть обороты.', 'The arc is found, but the answer is not written yet. The turns still have to be counted in.'),
    A('turn', "Yoyimizdan istalgan burchakni olamiz, aytaylik to'qson gradus. Unga to'liq aylanishni qo'shamiz, to'rt yuz ellik chiqadi. Aylanadagi nuqta esa aynan o'sha joyga qaytdi, demak sinusi o'sha, demak tengsizlik ham bajariladi. Ikki aylanishda, uchtada va ularning istalgan sonida ham shunday bo'ladi, teskari tomonda ham. Shuning uchun yoyning ikkala chegarasiga butun songa ko'paytirilgan uch yuz oltmish gradus yoziladi. Bitta yoy bir xil yoylarning cheksiz zanjiriga aylanadi.", 'Возьмём любой угол из нашей дуги, скажем девяносто градусов. Прибавим к нему полный оборот, выйдет четыреста пятьдесят. Точка на окружности при этом вернулась ровно туда же, значит синус у неё тот же, значит и неравенство выполняется. То же будет при двух оборотах, при трёх и при любом их числе, в том числе в обратную сторону. Поэтому к обеим границам дуги дописывают триста шестьдесят градусов, умноженные на целое число. Одна дуга превращается в бесконечную цепочку одинаковых дуг.', 'Take any angle from our arc, say ninety degrees. Add a full turn to it, and four hundred fifty comes out. The point on the circle has returned to exactly the same place, so its sine is the same, so the inequality holds. The same happens for two turns, for three and for any number of them, in the reverse direction as well. That is why three hundred sixty degrees times a whole number is written at both boundaries of the arc. One arc turns into an endless chain of identical arcs.'),
    A('work', "O'zingiz hisoblang. Yoy necha gradusdan keyin takrorlanadi?", 'Посчитай сам. Через сколько градусов дуга повторяется?', 'Work it out yourself. After how many degrees does the arc repeat?'),
  ],
  work: {
    prompt: L('Yoy necha gradusdan keyin takrorlanadi?', 'Через сколько градусов повторяется дуга?', 'After how many degrees does the arc repeat?'),
    ok: L("Uch yuz oltmishdan keyin. Bu to'liq aylanish, undan keyin nuqta avvalgi joyida.", 'Через триста шестьдесят. Это полный оборот, после него точка на прежнем месте.', 'After three hundred sixty. That is a full turn, after which the point is back in place.'),
    hint: [
      L("To'liq aylanishda necha gradus bor?", 'Сколько градусов в полном обороте?', 'How many degrees are in a full turn?'),
      L("To'liq aylanishdan keyin nuqta avvalgi joyiga qaytadi.", 'После полного оборота точка возвращается на прежнее место.', 'After a full turn the point returns to its former place.'),
      L('Uch yuz oltmish.', 'Триста шестьдесят.', 'Three hundred sixty.'),
    ],
    expr: '30°+360°n < x < 150°+360°n',
    answer: '360',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Boshqa ishora, boshqa yoy', 'Другой знак, другая дуга', 'Another sign, another arc'),
  tag: 'odin-koren',
  show: [
    [
      L("aylanadagi o'sha ikki nuqta", 'те же две точки на окружности', 'the same two points on the circle'),
      L("to'g'ri chiziq o'sha balandlikda", 'прямая на той же высоте', 'the line at the same height'),
      L('lekin ishora endi kichik', 'но знак теперь меньше', 'but the sign is now less'),
    ],
    [
      L("to'g'ri chiziqdan pastdagi yoy olinadi", 'берут дугу ниже прямой', 'the arc below the line is taken'),
      L("u birinchisini to'liq doiragacha to'ldiradi", 'она дополняет первую до полного круга', 'it completes the first one to the full circle'),
      L('demak unda ikki yuz qirq gradus', 'значит в ней двести сорок градусов', 'so it holds two hundred forty degrees'),
    ],
  ],
  motion: ['other'],
  audio: [
    A('mount', "Ishora teskarisiga o'zgartirildi. Nuqtalar o'sha, yoy boshqa.", 'Знак поменяли на обратный. Точки те же, дуга другая.', 'The sign was reversed. The points are the same, the arc is different.'),
    A('other', "To'g'ri chiziq o'sha balandlikda qoldi, kesishish nuqtalari ham o'sha: o'ttiz va bir yuz ellik gradus. Lekin endi sinus bir ikkidandan kichik bo'lishi kerak, demak aylananing to'g'ri chiziqdan pastda yotgan qismi kerak. Bu qolgan butun yoy, va birinchisi bilan birga u to'liq doirani tashkil qiladi. To'liq doirada uch yuz oltmish gradus, birinchi yoyda bir yuz yigirma, demak bunda ikki yuz qirq. E'tibor bering, qaytadan hech nima hisoblashga to'g'ri kelmadi: nuqtalar o'sha, faqat tanlangan tomon o'zgardi. Xuddi o'tgan darsdagi egri chiziqdagidek.", 'Прямая осталась на той же высоте, и точки пересечения те же: тридцать и сто пятьдесят градусов. Но теперь синус должен быть меньше одной второй, значит нужна та часть окружности, которая лежит ниже прямой. Это вся оставшаяся дуга, и вместе с первой она составляет полный круг. В полном круге триста шестьдесят градусов, в первой дуге сто двадцать, значит в этой двести сорок. Обрати внимание, считать заново ничего не пришлось: точки те же, поменялась только выбранная сторона. Ровно как на прошлом уроке с кривой.', 'The line stayed at the same height, and the crossing points are the same: thirty and one hundred fifty degrees. But now the sine has to be less than one half, so we need the part of the circle lying below the line. That is the whole remaining arc, and together with the first one it makes the full circle. A full circle holds three hundred sixty degrees, the first arc holds one hundred twenty, so this one holds two hundred forty. Notice that nothing had to be computed again: the points are the same, only the chosen side changed. Exactly as with the curve in the previous lesson.'),
    A('work', "O'zingiz hisoblang. Bu yoyda necha gradus bor?", 'Посчитай сам. Сколько градусов в этой дуге?', 'Work it out yourself. How many degrees are in this arc?'),
  ],
  work: {
    prompt: L('Yoyda necha gradus bor?', 'Сколько градусов в дуге?', 'How many degrees are in the arc?'),
    ok: L("Ikki yuz qirq. To'liq doira minus birinchi yoyning bir yuz yigirma gradusi.", 'Двести сорок. Полный круг минус сто двадцать градусов первой дуги.', 'Two hundred forty. The full circle minus the one hundred twenty degrees of the first arc.'),
    hint: [
      L("Birinchi yoy o'ttizdan bir yuz ellikkacha borardi.", 'Первая дуга шла от тридцати до ста пятидесяти.', 'The first arc ran from thirty to one hundred fifty.'),
      L("Uni to'liq doiradan ayiring.", 'Вычти её из полного круга.', 'Subtract it from the full circle.'),
      L('Ikki yuz qirq.', 'Двести сорок.', 'Two hundred forty.'),
    ],
    expr: 'sin x < 1/2',
    answer: '240',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARAVIY HOL', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("To'g'ri chiziq doiradan yonlab o'tdi", 'Прямая прошла мимо круга', 'The line went past the circle'),
  tag: 'net-resheniy',
  show: [
    [
      L("o'ngda ikki turibdi", 'справа стоит двойка', 'there is a two on the right'),
      L("to'g'ri chiziq doiradan yuqori ko'tarildi", 'прямая поднялась выше круга', 'the line rose above the circle'),
      L("kesishish umuman yo'q", 'пересечений нет ни одного', 'there is not a single crossing'),
    ],
    [
      L("demak yoy ham yo'q", 'значит и дуги нет', 'so there is no arc either'),
      L("sinus ikkidan katta bo'lmaydi", 'синус больше двух не бывает', 'the sine is never greater than two'),
      L("hech qanday iksda yechim yo'q", 'решений нет ни при каком икс', 'there are no solutions for any x'),
    ],
  ],
  motion: ['miss'],
  audio: [
    A('mount', "Darsning oxirgi holi. O'ngda birdan katta son turibdi.", 'Последний случай урока. Справа стоит число больше единицы.', 'The last case of the lesson. On the right there is a number greater than one.'),
    A('miss', "Ikki balandlikda to'g'ri chiziq o'tkazamiz. U doiradan yuqoridan o'tadi va aylanaga umuman tegmaydi. Kesishish yo'q, demak nuqtalar ham yo'q, demak ular orasidagi yoy ham yo'q. Javob shunday: hech qanday iksda yechim yo'q. Bu darrov ko'rinadi, hech nima yechish shart emas. Sababi oddiy: sinus radiusi bir bo'lgan aylanadagi nuqtaning balandligi, u birdan yuqoriga ko'tarilmaydi. Agar o'ngda minus ikki turganida, aksincha bo'lardi: to'g'ri chiziq doiradan pastdan o'tardi, aylananing har qanday nuqtasi undan yuqori bo'lardi. U holda yechim butun chiziq, istisnosiz barcha ikslar bo'lardi.", 'Проведём прямую на высоте два. Она проходит выше круга и окружности не касается вовсе. Пересечений нет, значит нет и точек, значит нет и дуги между ними. Ответ такой: решений нет ни при каком икс. Это видно сразу, решать ничего не надо. Причина простая: синус это высота точки на окружности радиуса один, и выше единицы она не поднимается. А если бы справа стояло минус два, вышло бы наоборот: прямая прошла бы ниже круга, и любая точка окружности оказалась бы выше неё. Тогда решением была бы вся прямая, все икс без исключения.', 'Let us draw the line at height two. It passes above the circle and does not touch it at all. There are no crossings, so there are no points, so there is no arc between them. The answer is this: there are no solutions for any x. It is visible at once, nothing needs to be solved. The reason is simple: the sine is the height of a point on a circle of radius one, and it does not rise above one. And if minus two stood on the right, the opposite would happen: the line would pass below the circle, and every point of the circle would be above it. Then the solution would be the whole line, every x without exception.'),
    A('work', "O'zingiz hisoblang. Bu tengsizlikning nechta yechimi bor?", 'Посчитай сам. Сколько решений у этого неравенства?', 'Work it out yourself. How many solutions does this inequality have?'),
  ],
  work: {
    prompt: L('Tengsizlikning nechta yechimi bor?', 'Сколько решений у неравенства?', 'How many solutions does the inequality have?'),
    ok: L("Bitta ham yo'q. To'g'ri chiziq doiradan yuqoridan o'tdi, kesishish yo'q.", 'Ни одного. Прямая прошла выше круга, пересечений нет.', 'None. The line passed above the circle, there are no crossings.'),
    hint: [
      L("To'g'ri chiziq aylanani kesib o'tadimi, qarang.", 'Посмотри, пересекает ли прямая окружность.', 'See whether the line crosses the circle.'),
      L("Sinus birdan katta bo'lmaydi.", 'Синус больше единицы не бывает.', 'The sine is never greater than one.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    expr: 'sin x > 2',
    answer: '0',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L('Javob yoy va uning aylanishlari', 'Ответ это дуга и её обороты', 'The answer is an arc and its turns'),
  tag: 'odin-koren',
  motion: ['rule'],
  audio: [
    A('mount', "Qoidani yig'amiz. U uch qadamdan iborat, uchalasi ham bajarilgan.", 'Соберём правило. Оно из трёх шагов, и все три уже сделаны.', 'Let us put the rule together. It has three steps, and all three are already done.'),
    A('rule', "Birinchi: o'ngda turgan sonning balandligida to'g'ri chiziq o'tkazish. Agar u doiradan yonlab o'tgan bo'lsa, javob darrov ko'rinadi: yo yechim yo'q, yo barcha ikslar yaraydi. Ikkinchi: kesishish nuqtalarini topib, tengsizlik ishorasi bajariladigan yoyni olish. Katta ishorasida bu to'g'ri chiziqdan yuqoridagi yoy, kichik ishorasida pastdagisi. Uchinchi: yoyning ikkala chekkasiga butun songa ko'paytirilgan uch yuz oltmish gradus qo'shish. Chekkalarni ham eslang: qat'iy ishorada ular javobga kirmaydi, qat'iy bo'lmaganda kiradi.", 'Первое: провести прямую на высоте того числа, что стоит справа. Если она прошла мимо круга, ответ виден сразу: либо решений нет, либо годятся все икс. Второе: найти точки пересечения и взять ту дугу, на которой знак неравенства выполняется. При знаке больше это дуга выше прямой, при знаке меньше ниже. Третье: к обоим концам дуги добавить триста шестьдесят градусов, умноженные на целое число. И помни про концы: при строгом знаке они в ответ не входят, при нестрогом входят.', 'First: draw the line at the height of the number on the right. If it went past the circle, the answer is visible at once: either there are no solutions, or every x works. Second: find the crossing points and take the arc on which the inequality sign holds. For a greater-than sign that is the arc above the line, for a less-than sign the one below. Third: add three hundred sixty degrees times a whole number to both ends of the arc. And remember the ends: with a strict sign they do not belong to the answer, with a non-strict one they do.'),
  ],
  probe: {
    question: L("To'g'ri chiziqning aylana bilan kesishuvi nima beradi?", 'Что даёт пересечение прямой с окружностью?', 'What do the crossings of the line and the circle give?'),
    items: [
      { id: 'a', label: L('yoyning chegaralarini', 'границы дуги', 'the boundaries of the arc'), correct: true },
      { id: 'b', label: L("javobning o'zini", 'сам ответ', 'the answer itself'), hint: L("Javobning o'zi tenglamada bo'lardi. Tengsizlikda bu faqat chekkalar.", 'Сам ответ был бы у уравнения. У неравенства это только концы.', 'The answer itself would belong to an equation. For an inequality these are only the ends.') },
    ],
  },
  rule: {
    lawLabel: L('QANDAY YECHILADI', 'КАК РЕШАТЬ', 'HOW TO SOLVE'),
    lines: [
      L("o'ng taraf balandligida to'g'ri chiziq o'tkazish", 'провести прямую на высоте правой части', 'draw the line at the height of the right side'),
      L('ishora bajariladigan yoyni olish', 'взять дугу, где знак выполняется', 'take the arc where the sign holds'),
      L("ikkala chekkaga aylanishlarni qo'shish", 'к обоим концам добавить обороты', 'add the turns to both ends'),
    ],
    law: '30°+360°n < x < 150°+360°n',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ТРЕНИРОВКА', 'PRACTICE'),
  title: L('Tengsizlikni yoy chegaralari bilan ulang', 'Соедини неравенство с границами дуги', 'Match each inequality with the boundaries of its arc'),
  tag: 'odin-koren',
  audio: [
    A('mount', "To'rt tengsizlik va to'rt juft chegara. Qiymatlar jadvaldan.", 'Четыре неравенства и четыре пары границ. Значения из таблицы.', 'Four inequalities and four pairs of boundaries. The values come from the table.'),
  ],
  match: {
    prompt: L('Chegaralar bir aylanish uchun berilgan', 'Границы даны за один оборот', 'The boundaries are given for one turn'),
    ok: L("To'g'ri. To'g'ri chiziqning balandligi o'zgaradi, ish esa o'sha bo'lib qoladi.", 'Верно. Высота прямой меняется, работа остаётся той же.', 'Correct. The height of the line changes, the work stays the same.'),
    left: ['sin x > 1/2', 'sin x > 0', 'sin x < −1/2', 'sin x > √2/2'],
    a: '30°;  150°',
    b: '0°;  180°',
    c: '210°;  330°',
    d: '45°;  135°',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L("Javobni to'liq yig'ing", 'Собери ответ целиком', 'Put the answer together'),
  tag: 'seriya-bez-n',
  audio: [
    A('mount', "Endi butun tengsizlik. To'rt qadam, tartib muhim.", 'Теперь всё неравенство целиком. Четыре шага, порядок важен.', 'Now the whole inequality. Four steps, and the order matters.'),
  ],
  order: {
    prompt: L('Yechish qadamlarini tartib bilan joylashtiring', 'Расставь шаги решения по порядку', 'Put the solution steps in order'),
    s1: L("to'g'ri chiziq o'tkazish", 'провести прямую', 'draw the line'),
    s2: L('ikki nuqtani topish', 'найти две точки', 'find the two points'),
    s3: L('orasidagi yoyni olish', 'взять дугу между ними', 'take the arc between them'),
    s4: L("aylanishlarni qo'shish", 'добавить обороты', 'add the turns'),
    ok: L("To'g'ri. Aylanishlar oxirida, yoy topilgandan keyin qo'shiladi.", 'Верно. Обороты добавляют последними, когда дуга уже найдена.', 'Correct. The turns are added last, once the arc is found.'),
    bad: L("Aylanishlar tayyor yoyga qo'shiladi, alohida nuqtaga emas.", 'Обороты добавляют к готовой дуге, а не к отдельной точке.', 'The turns are added to a finished arc, not to a single point.'),
    mark: '30°+360°n < x < 150°+360°n',
  },
  expr: 'sin x > 1/2',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L("QOG'OZDA", 'НА БУМАГЕ', 'ON PAPER'),
  title: L('Yoyda necha gradus bor', 'Сколько градусов в дуге', 'How many degrees are in the arc'),
  tag: 'bumaga',
  audio: [
    A('mount', "Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring.", 'Прибора нет. Считай на бумаге, потом сверься.', 'No instrument here. Work it out on paper, then compare.'),
    A('next', "Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping.", 'Дальше запись с ошибкой. Найди строку, где она появилась.', 'Next comes a written solution with a mistake. Find the line where it appeared.'),
  ],
  task: {
    ok: L('Oltmish. Yoy oltmishdan bir yuz yigirma gradusgacha boradi.', 'Шестьдесят. Дуга идёт от шестидесяти до ста двадцати градусов.', 'Sixty. The arc runs from sixty to one hundred twenty degrees.'),
    hint: [
      L("Sinus uchdan ildizni ikkiga bo'lganga teng burchaklarni toping.", 'Найди углы, где синус равен корню из трёх на два.', 'Find the angles where the sine equals root three over two.'),
      L('Bular oltmish va bir yuz yigirma gradus.', 'Это шестьдесят и сто двадцать градусов.', 'Those are sixty and one hundred twenty degrees.'),
      L('Oltmish.', 'Шестьдесят.', 'Sixty.'),
    ],
    prompt: 'sin x > √3/2',
    answer: '60',
  },
  order: {
    prompt: L("Tengsizliklarni yoy uzunligi o'sishi bo'yicha joylashtiring", 'Расставь неравенства по возрастанию длины дуги', 'Put the inequalities in order of increasing arc length'),
    title: L('qisqa yoydan uzuniga', 'от короткой дуги к длинной', 'from the shortest arc to the longest'),
    ok: L("To'g'ri. To'g'ri chiziq qancha past bo'lsa, ustidagi yoy shuncha uzun.", 'Верно. Чем ниже прямая, тем длиннее дуга над ней.', 'Correct. The lower the line, the longer the arc above it.'),
    bad: L("O'ngdagi sonlarni emas, yoylarni solishtiring.", 'Сравнивай дуги, а не числа справа.', 'Compare the arcs, not the numbers on the right.'),
    items: ['sin x > 0', 'sin x > √3/2', 'sin x > −1/2', 'sin x > 1/2'],
    answer: 'sin x > √3/2  sin x > 1/2  sin x > 0  sin x > −1/2',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xatoli qatorni toping', 'Найди строку с ошибкой', 'Find the line with the mistake'),
  tag: 'check',
  audio: [
    A('mount', "To'rt qator. Tengsizlik ishorasi eng boshida yo'qoldi.", 'Четыре строки. Знак неравенства потерялся в самом начале.', 'Four lines. The inequality sign got lost at the very beginning.'),
    A('next', 'Keyin teskari masala: yoyga qarab javobni tiklang.', 'Дальше обратная задача: по дуге восстанови ответ.', 'Next comes the reverse task: rebuild the answer from the arc.'),
  ],
  hint: {
    r1: L("Dastlabki tengsizlik, bu yerda xato bo'lishi mumkin emas.", 'Исходное неравенство, здесь ошибки быть не может.', 'The original inequality, no mistake can live here.'),
    r2: L("Ishoraga qarang. U o'sha bo'lib qoldimi?", 'Посмотри на знак. Он остался тем же?', 'Look at the sign. Did it stay the same?'),
    r3: L("Oldingi qatordan bu to'g'ri kelib chiqadi, lekin qatorning o'zi noto'g'ri.", 'Из предыдущей строки это следует верно, но сама она уже неверна.', 'This follows correctly from the previous line, but that line is already wrong.'),
  },
  proof: L("To'qson gradusni oling: sinus birga teng, bu esa bir ikkidandan katta.", 'Возьми девяносто градусов: синус равен единице, а это больше одной второй.', 'Take ninety degrees: the sine equals one, and that is greater than one half.'),
  entry: {
    prompt: L("Yoyning necha gradusi yo'qoldi?", 'Сколько градусов дуги потерялось?', 'How many degrees of the arc were lost?'),
    ok: L("Bir yuz yigirma. O'ttizdan bir yuz ellikkacha bo'lgan butun yoy bitta nuqtaga aylanib qoldi.", 'Сто двадцать. Вся дуга от тридцати до ста пятидесяти свелась к одной точке.', 'One hundred twenty. The whole arc from thirty to one hundred fifty shrank to a single point.'),
    hint: [
      L("To'g'ri javob yoy edi. Qaysi burchaklar orasida?", 'Правильный ответ был дугой. Между какими углами?', 'The correct answer was an arc. Between which angles?'),
      L("O'ttizdan bir yuz ellik gradusgacha.", 'От тридцати до ста пятидесяти градусов.', 'From thirty to one hundred fifty degrees.'),
      L('Bir yuz yigirma.', 'Сто двадцать.', 'One hundred twenty.'),
    ],
    answer: '120',
  },
  row: {
    r1: 'sin x > 1/2',
    r2: 'sin x = 1/2',
    r3: 'x = 30° + 360°n',
    r4: 'x = 30°',
  },
  answerId: 'r2',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("Teskari yo'l", 'Обратный ход', 'The other direction'),
  tag: 'obratnoe',
  audio: [
    A('mount', 'Endi teskarisiga. Avval chekkalariga qarab yoy uzunligini hisoblang.', 'Теперь наоборот. Сначала посчитай длину дуги по её концам.', 'Now the other way round. First compute the length of the arc from its ends.'),
    A('work', "Keyin sinus bir ikkidandan katta bo'ladigan barcha burchaklarni belgilang.", 'Потом отметь все углы, при которых синус больше одной второй.', 'Then mark every angle at which the sine is greater than one half.'),
  ],
  multi: {
    prompt: L("Tengsizlik to'g'ri bo'ladigan barcha burchaklarni belgilang", 'Отметь все углы, при которых неравенство верно', 'Mark every angle for which the inequality holds'),
    title: L('ular aynan ikkita', 'их ровно два', 'there are exactly two'),
    ok: L("To'g'ri. Yoy ichidagi burchaklar yaraydi, faqat ular.", 'Верно. Годятся углы внутри дуги, и только они.', 'Correct. The angles inside the arc work, and only they.'),
    items: [
      { id: 'c', label: '200°', hint: L("Bu burchak to'g'ri chiziqdan pastda: u yerda sinus manfiy.", 'Этот угол лежит ниже прямой: синус там отрицательный.', 'This angle lies below the line: the sine there is negative.') },
      { id: 'd', label: '20°', hint: L("Bu burchak o'ttiz gradusgacha, u yerda sinus bir ikkidandan kichik.", 'Этот угол до тридцати градусов, синус там меньше одной второй.', 'This angle is before thirty degrees, the sine there is less than one half.') },
      { id: 'a', label: '90°', ok: true },
      { id: 'b', label: '140°', ok: true },
    ],
  },
  entry: {
    prompt: L("Yechimlar yoyi qirq beshdan bir yuz o'ttiz besh gradusgacha boradi. Unda necha gradus bor?", 'Дуга решений идёт от сорока пяти до ста тридцати пяти градусов. Сколько в ней градусов?', 'The arc of solutions runs from forty five to one hundred thirty five degrees. How many degrees are in it?'),
    ok: L("To'qson. Bir yuz o'ttiz besh minus qirq besh.", 'Девяносто. Сто тридцать пять минус сорок пять.', 'Ninety. One hundred thirty five minus forty five.'),
    hint: [
      L('Kichik burchakni kattasidan ayiring.', 'Вычти меньший угол из большего.', 'Subtract the smaller angle from the larger one.'),
      L("Bir yuz o'ttiz besh minus qirq besh.", 'Сто тридцать пять минус сорок пять.', 'One hundred thirty five minus forty five.'),
      L("To'qson.", 'Девяносто.', 'Ninety.'),
    ],
    expr: '45° < x < 135°',
    answer: '90',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'odin-koren',
  audio: [
    A('mount', "Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi.", 'Четыре вопроса подряд. Считается первая попытка.', 'Four questions in a row. The first attempt counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Trigonometrik tengsizlikning javobi nima bo'ladi?", 'Чем является ответ тригонометрического неравенства?', 'What is the answer of a trigonometric inequality?'),
      done: '30° < x < 150°',
      items: [
        { id: 'a', label: L('yoy va uning aylanishlari', 'дугой и её оборотами', 'an arc and its turns'), correct: true },
        { id: 'b', label: L('bitta nuqta', 'одной точкой', 'a single point'), hint: L("Bitta nuqta tenglamaning javobi bo'lardi.", 'Одна точка была бы ответом уравнения.', 'A single point would be the answer of an equation.') },
        { id: 'c', label: L('ikki nuqta', 'двумя точками', 'two points'), hint: L("Ikki nuqta yoyning chegarasi, yoyning o'zi emas.", 'Две точки это границы дуги, а не сама дуга.', 'Two points are the boundaries of the arc, not the arc itself.') },
        { id: 'd', label: L('butun aylana', 'всей окружностью', 'the whole circle'), hint: L("Butun aylana faqat aynigan holda bo'ladi.", 'Вся окружность бывает только в вырожденном случае.', 'The whole circle happens only in the degenerate case.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Sinus ikkidan katta bo'lganda nechta yechim bor?", 'Сколько решений у синуса больше двух?', 'How many solutions does sine greater than two have?'),
      done: 'sin x > 2',
      items: [
        { id: 'a', label: L("bitta ham yo'q", 'ни одного', 'none'), correct: true },
        { id: 'b', label: L('bitta', 'одно', 'one'), hint: L("To'g'ri chiziq doiradan yuqoridan o'tdi, kesishish umuman yo'q.", 'Прямая прошла выше круга, пересечений нет вовсе.', 'The line passed above the circle, there are no crossings at all.') },
        { id: 'c', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p o'ngda minus ikki bo'lganda bo'lardi.", 'Бесконечно много было бы при минус двух справа.', 'Infinitely many would happen with minus two on the right.') },
        { id: 'd', label: L('ikki', 'два', 'two'), hint: L("Ikki to'g'ri chiziq aylanani kesib o'tganda bo'lardi.", 'Два было бы, если бы прямая пересекла окружность.', 'Two would happen if the line crossed the circle.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Yechimlar yoyida necha gradus bor?', 'Сколько градусов в дуге решений?', 'How many degrees are in the arc of solutions?'),
      done: 'sin x > 0',
      items: [
        { id: 'a', label: L('bir yuz sakson', 'сто восемьдесят', 'one hundred eighty'), correct: true, ok: L('Bir yuz sakson. Sinus doiraning butun yuqori yarmida musbat.', 'Сто восемьдесят. Синус положителен на всей верхней половине круга.', 'One hundred eighty. The sine is positive on the whole upper half of the circle.') },
        { id: 'b', label: L("to'qson", 'девяносто', 'ninety'), hint: L("To'qson doiraning choragi, musbat qismi esa yarmi.", 'Девяносто это четверть круга, а положительна половина.', 'Ninety is a quarter of the circle, while the positive part is a half.') },
        { id: 'c', label: L('uch yuz oltmish', 'триста шестьдесят', 'three hundred sixty'), hint: L('Bu butun doira, pastda esa sinus manfiy.', 'Это весь круг, но внизу синус отрицателен.', 'That is the whole circle, but at the bottom the sine is negative.') },
        { id: 'd', label: L('bir yuz yigirma', 'сто двадцать', 'one hundred twenty'), hint: L('Bir yuz yigirma bir ikkidanda chiqadi, bu yerda esa nol.', 'Сто двадцать выходит при одной второй, а здесь ноль.', 'One hundred twenty comes with one half, and here it is zero.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Yoyning chekkalariga nima qo'shiladi?", 'Что добавляют к концам дуги?', 'What is added to the ends of the arc?'),
      done: '+ 360°n',
      items: [
        { id: 'a', label: L("butun songa ko'paytirilgan uch yuz oltmish gradus", 'триста шестьдесят градусов, умноженные на целое число', 'three hundred sixty degrees times a whole number'), correct: true },
        { id: 'b', label: L('bir yuz sakson gradus', 'сто восемьдесят градусов', 'one hundred eighty degrees'), hint: L('Yarim aylanish nuqtani doiraning boshqa joyiga olib ketadi.', 'Половина оборота уводит точку в другое место круга.', 'Half a turn takes the point to another place on the circle.') },
        { id: 'c', label: L('hech nima', 'ничего', 'nothing'), hint: L('U holda cheksiz sondan bitta yoy qoladi.', 'Тогда останется одна дуга из бесконечного числа.', 'Then one arc out of infinitely many would remain.') },
        { id: 'd', label: L("to'qson gradus", 'девяносто градусов', 'ninety degrees'), hint: L('Chorak aylanish nuqtani joyiga qaytarmaydi.', 'Четверть оборота точку на место не возвращает.', 'A quarter turn does not bring the point back.') },
      ],
    },
  ],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Endi nima qila olasiz', 'Что теперь умеешь', 'What you can do now'),
  audio: [
    A('mount', "Taxmin nuqta va yoy haqida edi. Nima chiqqanini ko'ramiz.", 'Прогноз был про точку и дугу. Посмотрим, что вышло.', 'The guess was about a point and an arc. Let us see how it turned out.'),
    A('next', "Yoy. Nuqtalar javob emas, uning chegarasi bo'lib chiqdi, va ularga aylanishlar qo'shildi.", 'Дуга. Точки оказались её границами, а не ответом, и к ним добавились обороты.', 'An arc. The points turned out to be its boundaries rather than the answer, and the turns were added to them.'),
  ],
  can: [
    L('Aylanada yoyning ikkala chegarasini topaman', 'Нахожу обе границы дуги на окружности', 'I find both boundaries of the arc on the circle'),
    L('Nuqta emas, yoy olaman', 'Беру дугу, а не точку', 'I take the arc, not the point'),
    L("Ikkala chekkaga aylanishlarni qo'shaman", 'Добавляю обороты к обоим концам', 'I add the turns to both ends'),
    L("Umuman yechim yo'q holni ko'raman", 'Вижу случай, когда решений нет вовсе', 'I spot the case where there are no solutions at all'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of problem is closed.'),
    gap: L('Bir joy takrorlashni talab qiladi: ikkala chekkadagi aylanishlar.', 'Одно место требует повтора: обороты у обоих концов.', 'One spot needs a second look: the turns at both ends.'),
    back: L('Qoidaga va beshinchi ekranga qayting.', 'Вернись к правилу и к экрану 5.', 'Go back to the rule and to screen five.'),
  },
  bridge: L("Blok yopildi: daraja, ko'rsatkichli, logarifm, tengsizliklar. Keyin takrorlash amaliyoti.", 'Блок закрыт: степень, показательная, логарифм, неравенства. Дальше практикум повторения.', 'The block is closed: powers, the exponential, the logarithm, inequalities. Next comes the review practicum.'),
  lifehack: L("Avval o'ngdagi songa qarang. Agar u birdan katta yoki minus birdan kichik bo'lsa, yechadigan narsa yo'q.", 'Сначала посмотри на число справа. Если оно больше единицы или меньше минус единицы, решать нечего.', 'Look at the number on the right first. If it is greater than one or less than minus one, there is nothing to solve.'),
  sheetTitle: L('Trig. tengsizliklar · shpargalka', 'Тригон. неравенства · шпаргалка', 'Trig. inequalities · cheat sheet'),
  sheetSrc: L('10-sinf · 36-dars', '10 класс · урок 36', 'Grade 10 · lesson 36'),
  hook: {
    a: 'x = 30°',
    b: '30° < x < 150°',
  },
  proved: '30° < x < 150°',
  law: '30° < x < 150°',
  sheet: [
    '−1 ≤ sin x ≤ 1',
    'sin 30° = 1/2',
    'sin 150° = 1/2',
    '+ 360°n',
    'sin x > 2   →   ∅',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => {
  const t = String(s).replace(/−/g, '-').replace(',', '.')
  if (t.indexOf('/') !== -1) {
    const p = t.split('/')
    return parseFloat(p[0]) / parseFloat(p[1])
  }
  return parseFloat(t)
}
const deg = (s) => parseInt(String(s).replace(/−/g, '-'), 10)

// ГОРИЗОНТАЛЬ НА ВЫСОТЕ ОДНА ВТОРАЯ -- та же фигура, что в уроках 10 и 11.
// Новое здесь одно: `arcSide` подсвечивает ДУГУ между точками пересечения.
// Она считается из самой прямой и двух точек, нового счёта нет.
const Arc = ({ step, size, side = 'up', a = 0.5 }) => (
  <LevelLine size={size} step={step} a={a} arcs arcSide={step >= 1 ? side : null} />
)
// Прямая ВЫШЕ круга: пересечений нет, дуги нет, и это ответ.
const Miss = ({ step, size }) => <LevelLine size={size} step={step} a={2} arcs />

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const EQ_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const EQ_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

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
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Прямая ещё не опустилась: прогноз делается до того, как стало видно
        // и точки, и дугу.
        fig={() => <Scene fig={<Arc step={0} />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.1}>
        <Col>
          <Scene fig={<UnitCircle angle={30} locked drop />} max={300} />
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
      /* Кадр 1: прямая опускается на высоту одна вторая. Кадр 2: подсвечена
         дуга. Порядок обязателен -- сначала встреча, потом участок. */
      <Scene fig={<Arc step={phase} />} note={<NoteList items={S3.show[phase]} />} />
    ) : (
      <PlaceAngle
        prompt={S3.place.prompt}
        targets={[deg(S3.place.target)]}
        steps={[deg(S3.place.step)]}
        okText={S3.place.ok}
        wrongText={S3.place.bad}
        audio={audio}
        extra={{ ticks: true }}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      <Scene fig={<Arc step={1} />} note={<NoteList items={S4.show[phase]} />} />
    ) : (
      <PlaceAngle
        prompt={S4.place.prompt}
        targets={[deg(S4.place.target)]}
        steps={[deg(S4.place.step)]}
        okText={S4.place.ok}
        wrongText={S4.place.bad}
        audio={audio}
        extra={{ ticks: true }}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      <Scene fig={<Arc step={1} />} note={<NoteList items={S5.show[phase]} />} />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Arc step={1} />} max={300} /></Col>
        <Col>
          <NumberEntry
            compact
            prompt={S5.work.prompt}
            answer={num(S5.work.answer)}
            okText={S5.work.ok}
            hints={S5.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      /* СВИДЕТЕЛЬ. Та же прямая, та же высота, знак другой -- и подсвечена
         вторая дуга, дополняющая первую до полного круга. */
      <Scene
        fig={<Arc step={1} side={phase === 0 ? 'up' : 'down'} />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Arc step={1} side="down" />} max={300} /></Col>
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
      <Scene fig={<Miss step={phase} />} note={<NoteList items={S7.show[phase]} />} />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Miss step={1} />} max={300} /></Col>
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
        fig={(solved) => <Scene fig={<Arc step={solved ? 1 : 0} />} max={330} />}
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
      <>
        <Expr size="mid" style={{ marginBottom: 6 }}>{S10.expr}</Expr>
        <OrderRow
          prompt={S10.order.prompt}
          items={ORD10}
          answer={['s1', 's2', 's3', 's4']}
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
          {/* Другая дуга: прямая выше, концы сорок пять и сто тридцать пять. */}
          <Scene fig={<Arc step={1} a={0.707} />} max={250} h={190} />
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
        // Вопросы идут по случаям: дуга, промах, вся верхняя половина, обороты.
        fig={(round) => (
          <Scene
            fig={round === 1 ? <Miss step={1} /> : <Arc step={1} a={round >= 2 ? 0 : 0.5} />}
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
