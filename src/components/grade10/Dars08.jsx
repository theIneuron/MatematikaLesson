// ============================================================================
// 10-sinf, Dars 8. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS08_KONTENT.md
// Ma'lumot (ovoz, kadrlar, variantlar, razborlar, qoida, yakun) mashina bilan
// yig'ilgan. Ekran tanalari qo'lda yozilgan: asbob va figurani tanlash --
// matematik qaror, va u avtomatlashtirilmaydi (etalon §5.3).
//
// Matn o'zgarsa: kontentni to'g'rilash va qayta yig'ish (kalitsiz), tanalar
// joyida qoladi. Keyin `grade10-lesson-audit.mjs`, tez yarus, to'liq prognon.
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
  BuildPoint,
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
// Две новые фигуры блока 2. Обе сняты на стенде `probe/figures.html` до
// контента, и стенд поймал четыре дефекта — см. START_GRADE10.
import { LevelLine, WindowArc } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 8
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Arkfunksiyalar`,
  `Урок ${LESSON_NO}. Аркфункции`,
  `Lesson ${LESSON_NO}. Arc functions`,
)

const BLOCK = { label: 'B2', from: 8, to: 13, current: 8 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('ARKSINUS', 'АРКСИНУС', 'ARCSINE'),
  title: L('Arksinusning nechta javobi bor?', 'Сколько ответов у арксинуса?', 'How many answers does the arcsine have?'),
  motion: ['mount'],
  audio: [
    A('mount', "To'g'ri chiziq bir ikkidan balandlikka tushadi va aylanani ikki joyda kesadi.", 'Прямая опускается на высоту одна вторая и задевает окружность в двух местах.', 'The line drops to the height one half and meets the circle in two places.'),
    A('r1', 'Birinchi yozuv javob bitta deydi.', 'Первая запись говорит, что ответ один.', 'The first reading says there is one answer.'),
    A('r2', 'Ikkinchisi ikkita deydi, va ekrandagi nuqtalar uning tomonida.', 'Вторая говорит, что их два, и точки на экране за неё.', 'The second says there are two, and the points on the screen back it.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi to'g'ri chiziqni tushirib ko'ramiz.", 'Твой ответ записан. Сейчас опустим прямую и посмотрим.', 'Your answer is saved. Now we will drop the line and see.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first'), correct: true },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('javob bitta', 'ответ один', 'one answer'),
      value: 'arcsin 1/2 = 30°',
    },
    b: {
      name: L('javob ikkita', 'ответов два', 'two answers'),
      value: 'arcsin 1/2 = 30°,  150°',
    },
  },
  expr: 'arcsin 1/2 = ?',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Teskari masaladan oldin uch savol', 'Три вопроса перед обратной задачей', 'Three questions before the inverse task'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Nuqtaning qaysi koordinatasi sinus deyiladi?', 'Какая координата точки называется синусом?', 'Which coordinate of the point is the sine?'),
      done: 'y = sin α',
      items: [
        { id: 'a', label: L('balandlik, ikkinchi son', 'высота, второе число', 'the height, the second number'), correct: true },
        { id: 'b', label: L('siljish, birinchi son', 'сдвиг, первое число', 'the shift, the first number'), hint: L('Siljish bu kosinus, u birinchi turadi.', 'Сдвиг это косинус, он идёт первым.', 'The shift is the cosine, it comes first.') },
        { id: 'c', label: L('radius', 'радиус', 'the radius'), hint: L('Radius doim birga teng va koordinata emas.', 'Радиус всегда равен единице и координатой не является.', 'The radius is always one and is not a coordinate.') },
        { id: 'd', label: L("burchakning o'zi", 'сам угол', 'the angle itself'), hint: L('Burchak nuqtani beradi, sinus esa uning koordinatasi.', 'Угол задаёт точку, а синус это её координата.', 'The angle fixes the point, the sine is its coordinate.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Teskari amal nima qiladi?', 'Что делает обратное действие?', 'What does an inverse action do?'),
      done: 'sin α = a   →   α = ?',
      items: [
        { id: 'a', label: L('natijadan uni bergan narsani topadi', 'по результату находит то, из чего он получен', 'it finds what the result came from'), correct: true },
        { id: 'b', label: L('amalni yana bir marta takrorlaydi', 'повторяет действие ещё раз', 'it repeats the action once more'), hint: L('Takror hech narsani qaytarmaydi, teskari amal esa qaytaradi.', 'Повтор ничего не возвращает назад, а обратное действие возвращает.', 'Repeating returns nothing, an inverse action does.') },
        { id: 'c', label: L('ishorani almashtiradi', 'меняет знак', 'it flips the sign'), hint: L("Ishorani ko'zgu almashtiradi, bu o'tgan darsda edi.", 'Знак меняет зеркало, это был прошлый урок.', 'The mirror flips the sign, that was the previous lesson.') },
        { id: 'd', label: L('ikki barobar orttiradi', 'увеличивает в два раза', 'it doubles'), hint: L("Teskari amal o'lchamga emas, sanoq yo'nalishiga bog'liq.", 'Обратное действие связано не с размером, а с направлением счёта.', 'An inverse action is about direction, not about size.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Sinus qanday qiymatlarni oladi?', 'Какие значения принимает синус?', 'Which values does the sine take?'),
      done: '−1 ≤ sin α ≤ 1',
      items: [
        { id: 'a', label: L('minus birdan birgacha', 'от минус единицы до единицы', 'from minus one to one'), correct: true },
        { id: 'b', label: L('har qanday', 'любые', 'any values'), hint: L("Nuqta radiusi bir bo'lgan aylanada yotadi va uzoqroqqa ketmaydi.", 'Точка лежит на окружности радиуса один и дальше не уходит.', 'The point lies on the circle of radius one and goes no further.') },
        { id: 'c', label: L('faqat musbat', 'только положительные', 'only positive ones'), hint: L("O'qdan pastda balandlik manfiy, bu to'rtinchi darsda edi.", 'Ниже оси высота отрицательна, это было на четвёртом уроке.', 'Below the axis the height is negative, that was in lesson four.') },
        { id: 'd', label: L('noldan birgacha', 'от нуля до единицы', 'from zero to one'), hint: L('Aylananing pastki yarmi manfiy qiymatlar beradi.', 'Нижняя половина окружности даёт отрицательные значения.', 'The lower half of the circle gives negative values.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("To'g'ri chiziq aylanani ikki marta kesadi", 'Прямая задевает круг дважды', 'The line meets the circle twice'),
  tag: 'odin-koren',
  show: [
    [
      L('balandlik bir ikkidan', 'высота одна вторая', 'the height is one half'),
      L("to'g'ri chiziq pastga tushadi", 'прямая идёт вниз', 'the line comes down'),
    ],
    [
      L("nuqta ikkita bo'ldi", 'точек стало две', 'there are two points now'),
      L('ikkalasining balandligi bir ikkidan', 'обе высотой одна вторая', 'both at height one half'),
    ],
  ],
  motion: ['drop'],
  audio: [
    A('mount', "Yuqorida to'g'ri chiziq. Uning balandligi bir ikkidan.", 'Сверху прямая. Её высота одна вторая.', 'A line at the top. Its height is one half.'),
    A('drop', "To'g'ri chiziq joyiga tushdi va aylanani ikki nuqtada kesdi. Ikkalasining balandligi bir ikkidan, ikkalasi ham haqiqiy. O'ttiz gradus va yuz ellik.", 'Прямая села на место и задела окружность в двух точках. Обе высотой одна вторая, обе настоящие. Тридцать градусов и сто пятьдесят.', 'The line settled and met the circle at two points. Both at height one half, both real. Thirty degrees and one hundred fifty.'),
    A('work', "Endi o'zingiz. Ulardan ikkinchisiga, chapdagisiga nuqta qo'ying.", 'Теперь сам. Поставь точку во вторую из них, ту, что слева.', 'Now you. Place the point at the second of them, the one on the left.'),
  ],
  work: {
    prompt: L("Balandligi ham bir ikkidan, lekin chapda turgan joyga nuqta qo'ying.", 'Поставь точку туда, где высота тоже равна одной второй, но точка слева.', 'Place the point where the height is also one half but the point is on the left.'),
    ok: L("Yuz ellik gradus. Balandlik o'sha, nuqta esa boshqa: bitta songa ikkita burchak mos keladi.", 'Сто пятьдесят градусов. Высота та же, а точка другая: одному числу отвечают два угла.', 'One hundred fifty degrees. The same height, a different point: one number matches two angles.'),
    hint: [
      L("O'sha balandlikdagi, lekin vertikal o'qning boshqa tomonidagi nuqta kerak.", 'Нужна точка на той же высоте, но по другую сторону от вертикальной оси.', 'You need a point at the same height on the other side of the vertical axis.'),
      L("Vertikal o'qdan chapda siljish manfiy, balandlik esa musbat qoladi.", 'Слева от вертикальной оси сдвиг отрицательный, а высота остаётся положительной.', 'Left of the vertical axis the shift is negative and the height stays positive.'),
      L('Yuz ellik gradus.', 'Сто пятьдесят градусов.', 'One hundred fifty degrees.'),
    ],
  },
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Nuqta bitta bo'ladigan oyna", 'Окно, где точка одна', 'The window where the point is alone'),
  tag: 'arcsin-bez-promezhutka',
  show: [
    [
      L("o'ng yarmi bo'yaldi", 'закрашена правая половина', 'the right half is painted'),
      L("minus to'qsondan to'qsongacha", 'от минус девяноста до девяноста', 'from minus ninety to ninety'),
    ],
    [
      L('oynada nuqta bitta', 'в окне точка одна', 'inside the window the point is alone'),
      L('ikkinchisi qoldi, lekin javobda emas', 'вторая осталась, но не в ответе', 'the second stayed but is not the answer'),
    ],
  ],
  motion: ['win'],
  audio: [
    A('mount', 'Ikkita nuqta noqulay: teskari amal bitta son berishi shart.', 'Две точки это неудобно: обратное действие обязано давать одно число.', 'Two points are awkward: an inverse action must give one number.'),
    A('win', "Shuning uchun kelishildi: aylananing faqat o'ng yarmini, minus to'qsondan to'qsongacha olamiz. Bu oynada shunday balandlikdagi nuqta aynan bitta. Ikkinchisi yo'qolgani yo'q, u shunchaki javobga kirmaydi.", 'Поэтому договорились: берём только правую половину окружности, от минус девяноста до девяноста. В этом окне точка с такой высотой ровно одна. Вторая никуда не делась, она просто не идёт в ответ.', 'So it was agreed: we take only the right half of the circle, from minus ninety to ninety. In that window there is exactly one point with such a height. The second one is still there, it just does not go into the answer.'),
    A('work', "Endi o'zingiz. Oynaga tushganiga nuqta qo'ying.", 'Теперь сам. Поставь точку в ту, что попала в окно.', 'Now you. Place the point at the one inside the window.'),
  ],
  work: {
    prompt: L("Oynada yotganiga nuqta qo'ying.", 'Поставь точку в ту, что лежит в окне.', 'Place the point at the one lying inside the window.'),
    ok: L("O'ttiz gradus. U oynada, shuning uchun javob sifatida olinadi.", 'Тридцать градусов. Оно в окне, поэтому его и берут ответом.', 'Thirty degrees. It is inside the window, and that is why it is taken as the answer.'),
    hint: [
      L("Oyna bu aylananing o'ng yarmi.", 'Окно это правая половина окружности.', 'The window is the right half of the circle.'),
      L('Chapda ham nuqta bor, lekin u oynadan tashqarida.', 'Слева точка тоже есть, но она вне окна.', 'There is a point on the left too, but it is outside the window.'),
      L("O'ttiz gradus.", 'Тридцать градусов.', 'Thirty degrees.'),
    ],
  },
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Arksinus bu oynadagi burchak', 'Арксинус это угол из окна', 'The arcsine is the angle from the window'),
  tag: 'arcsin-bez-promezhutka',
  show: [
    [
      L('balandlik berilgan', 'высота дана', 'the height is given'),
      L('burchak oynada qidiriladi', 'угол ищется в окне', 'the angle is looked for in the window'),
    ],
    [
      L('oynadagi nuqta yoritilgan', 'точка в окне подсвечена', 'the point in the window is lit'),
      L("ikkinchisi so'ndi, lekin qoldi", 'вторая потускнела, но осталась', 'the other faded but stayed'),
    ],
  ],
  motion: ['pick'],
  audio: [
    A('mount', "Arksinus bir ikkidan yozuvi shunday o'qiladi: balandligi bir ikkidan bo'lgan, oynadagi burchak.", 'Запись арксинус одна вторая читается так: угол из окна, у которого высота равна одной второй.', 'The reading arcsine of one half means: the angle from the window whose height is one half.'),
    A('pick', "Oynadagi nuqta yoritilgan, ikkinchisi so'ndi. Javob yoritilganidan o'qiladi.", 'Точка в окне подсвечена, вторая потускнела. Ответ читается с подсвеченной.', 'The point inside the window is lit, the other one has faded. The answer is read off the lit one.'),
    A('work', "O'zingiz hisoblang. Bir ikkidanning arksinusi gradusda qancha?", 'Посчитай сам. Чему равен арксинус одной второй в градусах?', 'Compute it yourself. What is the arcsine of one half in degrees?'),
  ],
  work: {
    prompt: L('arcsin 1/2 gradusda qancha?', 'Чему равен arcsin 1/2 в градусах?', 'What is arcsin 1/2 in degrees?'),
    ok: L("O'ttiz. Bu oynadagi, balandligi bir ikkidan bo'lgan o'sha burchak.", 'Тридцать. Это тот самый угол из окна, у которого высота равна одной второй.', 'Thirty. That is the very angle from the window whose height is one half.'),
    hint: [
      L("Balandligi bir ikkidan bo'lgan burchakni qidiring.", 'Ищи угол, у которого высота равна одной второй.', 'Look for the angle whose height is one half.'),
      L("Shunday ikki burchakdan oynadagisini, ya'ni o'ngdagisini oling.", 'Из двух таких углов бери тот, что в окне, то есть справа.', 'Of the two such angles take the one in the window, that is on the right.'),
      L("O'ttiz.", 'Тридцать.', 'Thirty.'),
    ],
    answer: '30',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Arkkosinusning o'z oynasi bor", 'У арккосинуса своё окно', 'The arccosine has its own window'),
  tag: 'arcsin-bez-promezhutka',
  show: [
    [
      L('kosinus bu siljish', 'косинус это сдвиг', 'the cosine is the shift'),
      L("to'g'ri chiziq endi vertikal", 'прямая теперь вертикальная', 'the line is vertical now'),
    ],
    [
      L('oyna noldan yuz saksongacha', 'окно от нуля до ста восьмидесяти', 'the window from zero to one hundred eighty'),
      L('unda yana bitta nuqta', 'в нём снова одна точка', 'one point again inside it'),
    ],
  ],
  motion: ['win'],
  audio: [
    A('mount', "Kosinusda balandlik emas, siljish berilgan, shuning uchun to'g'ri chiziq vertikal ketadi. U ham aylanani ikki marta kesadi.", 'У косинуса задан сдвиг, а не высота, поэтому прямая идёт вертикально. Она тоже задевает окружность дважды.', 'For the cosine the shift is given, not the height, so the line runs vertically. It also meets the circle twice.'),
    A('win', "Arkkosinusning oynasi bu yuqori yarim, noldan yuz saksongacha. Yuqoridagi nuqta unda, pastdagisi yo'q.", 'Окно арккосинуса это верхняя половина, от нуля до ста восьмидесяти. Верхняя точка в нём, нижняя нет.', 'The arccosine window is the upper half, from zero to one hundred eighty. The upper point is in it, the lower one is not.'),
    A('work', "Endi o'zingiz. Arkkosinus oynasiga tushgan nuqtaga qo'ying.", 'Теперь сам. Поставь точку в ту, что попала в окно арккосинуса.', 'Now you. Place the point at the one inside the arccosine window.'),
  ],
  work: {
    prompt: L("Arkkosinus oynasida yotgan nuqtaga qo'ying.", 'Поставь точку в ту, что лежит в окне арккосинуса.', 'Place the point at the one inside the arccosine window.'),
    ok: L('Oltmish gradus. Siljish bir ikkidan, nuqta yuqorida, demak u oynada.', 'Шестьдесят градусов. Сдвиг равен одной второй, и точка сверху, значит она в окне.', 'Sixty degrees. The shift is one half and the point is on top, so it is in the window.'),
    hint: [
      L('Arkkosinusning oynasi bu aylananing yuqori yarmi.', 'Окно арккосинуса это верхняя половина окружности.', 'The arccosine window is the upper half of the circle.'),
      L("Pastki nuqtaning siljishi o'sha, lekin u oynaga tushmaydi.", 'Нижняя точка имеет тот же сдвиг, но в окно не попадает.', 'The lower point has the same shift but is not inside the window.'),
      L('Oltmish gradus.', 'Шестьдесят градусов.', 'Sixty degrees.'),
    ],
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("To'g'ri chiziq yonidan o'tib ketishi mumkin", 'Прямая может пройти мимо', 'The line can miss the circle'),
  tag: 'net-resheniy',
  show: [
    [
      L('balandlik ikki', 'высота два', 'the height is two'),
      L("to'g'ri chiziq aylanadan yuqorida", 'прямая выше окружности', 'the line is above the circle'),
    ],
    [
      L("kesishish nuqtasi yo'q", 'точек пересечения нет', 'there are no intersection points'),
      L("demak burchak ham yo'q", 'значит нет и угла', 'so there is no angle either'),
    ],
  ],
  motion: ['miss'],
  audio: [
    A('mount', "Balandlik ikkini olaylik. To'g'ri chiziq aylanadan yuqorida turadi.", 'Возьмём высоту два. Прямая стоит выше окружности.', 'Take the height two. The line stands above the circle.'),
    A('miss', "U yonidan o'tdi va aylanaga bir marta ham tegmadi. Nuqta yo'q, demak shunday balandlikdagi burchak ham yo'q. Ikkining arksinusi mavjud emas.", 'Она прошла мимо и не задела круг ни разу. Точки нет, значит нет и угла с такой высотой. Арксинус двух не существует.', 'It passed by and never touched the circle. There is no point, so there is no angle with such a height. The arcsine of two does not exist.'),
    A('work', "O'zingiz hisoblang. Ikkining arksinusi nechta burchak beradi?", 'Посчитай сам. Сколько углов даёт арксинус двух?', 'Compute it yourself. How many angles does the arcsine of two give?'),
  ],
  work: {
    prompt: L('arcsin 2 nechta burchak beradi?', 'Сколько углов даёт arcsin 2?', 'How many angles does arcsin 2 give?'),
    ok: L('Nol. Birdan katta balandlik aylanada uchramaydi, shuning uchun ikkining arksinusi aniqlanmagan.', 'Ноль. Высота больше единицы на окружности не встречается, поэтому арксинус двух не определён.', 'Zero. A height above one never occurs on the circle, so the arcsine of two is undefined.'),
    hint: [
      L("To'g'ri chiziq aylanaga tegdimi, qarang.", 'Посмотри, задела ли прямая окружность.', 'Look whether the line touched the circle.'),
      L("U yuqoridan o'tdi, demak umumiy nuqta yo'q.", 'Она прошла выше, значит общих точек нет.', 'It passed above, so there are no common points.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Arksinus va arkkosinus', 'Арксинус и арккосинус', 'Arcsine and arccosine'),
  tag: 'arcsin-bez-promezhutka',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Oyna yana bir bor bo'yaladi, va qoida yonida ochiladi. Teskari funksiya ro'yxat emas, son berishi aynan oyna kelishuv bilan qotirilganidan.", 'Окно закрашивается ещё раз, и правило открывается рядом. Обратная функция даёт число, а не список, ровно потому, что окно закреплено договором.', 'The window is painted once more, and the rule opens beside it. The inverse function gives a number, not a list, exactly because the window is fixed by agreement.'),
  ],
  probe: {
    question: L('Nega arksinusning javobi bitta?', 'Почему у арксинуса ответ один?', 'Why does the arcsine have one answer?'),
    items: [
      { id: 'a', label: L('javob oynadan olinadi', 'ответ берут из окна', 'the answer is taken from the window'), correct: true },
      { id: 'b', label: L('ikkinchi nuqta yechim emas', 'вторая точка не является решением', 'the second point is not a solution'), hint: L("Ikkinchi nuqta haqiqiy, balandligi o'sha. Shunchaki arksinus javobiga kirmaydi.", 'Вторая точка настоящая, у неё та же высота. Просто в ответ арксинуса она не идёт.', 'The second point is real and has the same height. It just does not go into the arcsine answer.') },
    ],
  },
  rule: {
    lawLabel: L('Oynalar', 'Окна', 'The windows'),
    lines: [
      L('`y = arcsin x` — `y = sin x` ga teskari funksiya: u balandlikdan burchakni qaytaradi.', '`y = arcsin x` — функция, обратная `y = sin x`: она возвращает угол по его высоте.', '`y = arcsin x` is the inverse of `y = sin x`: it returns the angle from its height.'),
      L("Javob oynadan olinadi, shuning uchun u ro'yxat emas, bitta.", 'Ответ берут из окна, поэтому он один, а не список.', 'The answer is taken from the window, so it is one number, not a list.'),
      L('Arksinus va arkkosinus faqat `−1 ≤ x ≤ 1` da aniqlangan.', 'Арксинус и арккосинус определены только при `−1 ≤ x ≤ 1`.', 'The arcsine and arccosine are defined only for `−1 ≤ x ≤ 1`.'),
    ],
    law: 'arcsin x ∈ [−90°; 90°],   arccos x ∈ [0°; 180°]',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("To'rt yozuv, to'rt burchak", 'Четыре записи, четыре угла', 'Four readings, four angles'),
  tag: 'arcsin-bez-promezhutka',
  audio: [
    A('mount', "To'rt yozuv va to'rt burchak. Ularni birlashtiring.", 'Четыре записи и четыре угла. Соедини их.', 'Four readings and four angles. Match them.'),
  ],
  match: {
    prompt: L("Har yozuvni o'z burchagi bilan birlashtiring.", 'Соедини каждую запись с её углом.', 'Match each reading with its angle.'),
    ok: L('Arksinusda ishora pastga, arkkosinusda chapga olib boradi. Oynalar boshqa, javoblar ham boshqa.', 'У арксинуса знак уводит вниз, а у арккосинуса влево. Окна разные, поэтому и ответы разные.', 'The sign sends the arcsine down and the arccosine left. The windows differ, so the answers differ.'),
    left: ['arcsin 1/2', 'arcsin(−1/2)', 'arccos 1/2', 'arccos(−1/2)'],
    a: '30°',
    b: '−30°',
    c: '60°',
    d: '120°',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Arksinusni qadam bilan hisoblang', 'Посчитай арксинус по шагам', 'Compute an arcsine step by step'),
  tag: 'arcsin-bez-promezhutka',
  audio: [
    A('mount', "To'rtta qadam. Tartibini o'zingiz qo'yasiz.", 'Четыре шага. Порядок ставишь ты.', 'Four steps. You put them in order.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L('balandlik minus bir ikkidan', 'высота равна минус одной второй', 'the height is minus one half'),
    s2: L('ikkala nuqtani belgilaymiz', 'отмечаем обе точки', 'we mark both points'),
    s3: L('oynadagisini olamiz', 'берём ту, что в окне', 'we take the one in the window'),
    s4: L("javob minus o'ttiz", 'ответ минус тридцать', 'the answer is minus thirty'),
    ok: L("Tartib doim shunday: avval ikkala nuqta, keyin oyna. Oynadan boshlansa, ikkinchi nuqta sezilmay yo'qoladi.", 'Порядок такой всегда: сначала обе точки, потом окно. Если начать с окна, вторая точка исчезнет незамеченной.', 'The order is always this: both points first, then the window. Starting with the window makes the second point vanish unnoticed.'),
    bad: L('Avval ikkala nuqtani topamiz, keyin oynadagisini tanlaymiz, keyingina javobni yozamiz.', 'Сначала находим обе точки, потом выбираем ту, что в окне, и только потом пишем ответ.', 'First we find both points, then choose the one in the window, and only then write the answer.'),
    mark: '−30°',
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
    ok: L("Yuz yigirma. Minus bir ikkidan siljish chapda bo'ladi, arkkosinus oynasi esa aynan yuqori yarim.", 'Сто двадцать. Сдвиг минус одна вторая бывает слева, а окно арккосинуса как раз верхняя половина.', 'One hundred twenty. The shift minus one half happens on the left, and the arccosine window is the upper half.'),
    hint: [
      L('Siljish manfiy, demak nuqta chapda.', 'Сдвиг отрицательный, значит точка слева.', 'The shift is negative, so the point is on the left.'),
      L('Ikki chap nuqtadan yuqoridagisini oling: arkkosinus oynasi tepada.', 'Из двух левых точек бери верхнюю: окно арккосинуса сверху.', 'Of the two left points take the upper one: the arccosine window is on top.'),
      L('Yuz yigirma.', 'Сто двадцать.', 'One hundred twenty.'),
    ],
    prompt: 'arccos(−1/2)  =  ?',
    answer: '120',
  },
  order: {
    prompt: L("O'sish tartibida joylashtiring.", 'Расставь по возрастанию.', 'Arrange in increasing order.'),
    title: L('Qaysi burchak kichikroq?', 'Какой угол меньше?', 'Which angle is smaller?'),
    ok: L("Siz yozuvlarni emas, burchaklarni solishtirdingiz: arksinus minus to'qsondan to'qsongacha, arkkosinus noldan yuz saksongacha beradi.", 'Ты сравнил углы, а не записи: арксинус даёт от минус девяноста до девяноста, арккосинус от нуля до ста восьмидесяти.', 'You compared angles, not readings: the arcsine gives from minus ninety to ninety, the arccosine from zero to one hundred eighty.'),
    bad: L("Avval har yozuvni gradusga o'tkazing, keyin solishtiring.", 'Сначала переведи каждую запись в градусы, потом сравнивай.', 'First turn each reading into degrees, then compare.'),
    items: ['arcsin(−1/2)', 'arcsin 0', 'arcsin 1/2', 'arccos 0'],
    answer: 'arcsin(−1/2)  arcsin 0  arcsin 1/2  arccos 0',
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
    A('mount', 'Masala. Minus bir ikkidanning arksinusini topish.', 'Задача. Найти арксинус минус одной второй.', 'A task. Find the arcsine of minus one half.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L("Bu qator to'g'ri: ikki yuz o'nning balandligi haqiqatan minus bir ikkidan.", 'Эта строка верна: у двухсот десяти высота действительно минус одна вторая.', 'This line is right: at two hundred ten the height really is minus one half.'),
    r3: L("Bu shunchaki sonlarni solishtirish, va u to'g'ri.", 'Это просто сравнение чисел, и оно верное.', 'This is just a comparison of numbers, and it is right.'),
    r4: L("Bu qator xato qatordan o'sib chiqqan. Birinchi xato qator yuqorida.", 'Эта строка выросла из неверной. Первая неверная строка выше.', 'This line grew out of a wrong one. The first wrong line is above.'),
  },
  proof: L("Ikki yuz o'n oynaga tushmaydi.", 'Двести десять в окно не попадает.', 'Two hundred ten is not inside the window.'),
  entry: {
    prompt: L('arcsin(−1/2) qancha?', 'Чему равен arcsin(−1/2)?', 'What is arcsin(−1/2)?'),
    ok: L("Minus o'ttiz. Shunday balandlikdagi nuqta ikkita, lekin oynaga faqat shu tushadi.", 'Минус тридцать. Точек с такой высотой две, но в окно попадает только эта.', 'Minus thirty. There are two points with such a height, but only this one falls inside the window.'),
    hint: [
      L("Minus bir ikkidan balandlik ikki burchakda bo'ladi.", 'Высота минус одна вторая бывает у двух углов.', 'The height minus one half happens at two angles.'),
      L("Ulardan minus to'qsondan to'qsongacha oynaga bittasi tushadi.", 'Из них в окно от минус девяноста до девяноста попадает один.', 'Of them one falls into the window from minus ninety to ninety.'),
      L("Minus o'ttiz.", 'Минус тридцать.', 'Minus thirty.'),
    ],
    answer: '−30',
  },
  row: {
    r1: 'sin 210° = −1/2',
    r2: 'arcsin(−1/2) = 210°',
    r3: '210° > 90°',
    r4: 'arcsin(−1/2) > 90°',
  },
  answerId: 'r2',
}

const S13 = {
  role: 'transfer',
  answer: 'lead',
  format: 'place+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("Qaysi burchak javob bo'la oladi", 'Какой угол может быть ответом', 'Which angle can be an answer'),
  tag: 'obratnoe',
  audio: [
    A('mount', 'Endi teskari masala. Burchak berilgan, savol esa u javobga yaraydimi.', 'Теперь обратная задача. Дан угол, а спрашивается, годится ли он в ответ.', 'Now the inverse task. An angle is given, and the question is whether it fits as an answer.'),
    A('work', "Nuqtani qo'ying, keyin yaraydigan hamma burchakni belgilaysiz.", 'Поставь точку, потом отметишь все углы, которые годятся.', 'Place the point, then you will mark every angle that fits.'),
  ],
  multi: {
    prompt: L("Arksinus javobi bo'la oladigan hamma burchakni belgilang.", 'Отметь все углы, которые могут быть ответом арксинуса.', 'Mark every angle that can be an arcsine answer.'),
    title: L("Qaysi burchaklar arksinus javobi bo'la oladi?", 'Какие углы могут быть ответом арксинуса?', 'Which angles can be an arcsine answer?'),
    ok: L("Beshtadan uchtasi. Qanday son berilmasin, arksinus javobi doim minus to'qson bilan to'qson orasida yotadi.", 'Три из пяти. Ответ арксинуса всегда лежит между минус девяноста и девяноста, какое бы число ни дали.', 'Three out of five. Whatever number is given, the arcsine answer always lies between minus ninety and ninety.'),
    items: [
      { id: 'd', label: '150°', hint: L("Yuz ellik oynadan tashqarida: u to'qsondan katta.", 'Сто пятьдесят вне окна: оно больше девяноста.', 'One hundred fifty is outside the window: it is more than ninety.') },
      { id: 'e', label: '200°', hint: L("Ikki yuz ham to'qsondan katta, demak oynadan tashqarida.", 'Двести это тоже больше девяноста, значит вне окна.', 'Two hundred is also more than ninety, so it is outside the window.') },
      { id: 'a', label: '30°', ok: true },
      { id: 'b', label: '−30°', ok: true },
      { id: 'c', label: '90°', ok: true },
    ],
  },
  place: {
    prompt: L("Nuqtani 150 gradusga qo'ying.", 'Поставь точку на 150 градусов.', 'Place the point at 150 degrees.'),
    ok: L("Bu yerda balandlik bir ikkidan, o'ttizdagidek. Lekin bu son arksinus javobi bo'lmaydi.", 'Высота здесь одна вторая, как и у тридцати. Но ответом арксинуса это число не станет.', 'The height here is one half, as at thirty. But this number will not be an arcsine answer.'),
    wrong: L("Yuz ellik gorizontal o'qdan yuqorida va vertikal o'qdan chapda.", 'Сто пятьдесят это выше горизонтальной оси и левее вертикальной.', 'One hundred fifty is above the horizontal axis and left of the vertical one.'),
    target: '150°',
    step: 'sin 150° = 1/2',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'arcsin-bez-promezhutka',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('arcsin 1/2 qancha?', 'Чему равен arcsin 1/2?', 'What is arcsin 1/2?'),
      done: 'arcsin 1/2 = 30°',
      items: [
        { id: 'a', label: L("o'ttiz gradus", 'тридцать градусов', 'thirty degrees'), correct: true },
        { id: 'b', label: L('yuz ellik gradus', 'сто пятьдесят градусов', 'one hundred fifty degrees'), hint: L("U yerda balandlik o'sha, lekin yuz ellik oynadan tashqarida.", 'Высота там та же, но сто пятьдесят вне окна.', 'The height there is the same, but one hundred fifty is outside the window.') },
        { id: 'c', label: L("minus o'ttiz gradus", 'минус тридцать градусов', 'minus thirty degrees'), hint: L('Bu minus bir ikkidanning javobi, u yerda balandlik pastga ketadi.', 'Это ответ для минус одной второй, там высота уходит вниз.', 'That is the answer for minus one half, where the height goes down.') },
        { id: 'd', label: L('oltmish gradus', 'шестьдесят градусов', 'sixty degrees'), hint: L('Oltmishning balandligi kattaroq, u uch ildizining yarmi.', 'У шестидесяти высота больше, это корень из трёх на два.', 'At sixty the height is larger, it is root three over two.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('arccos 0 qancha?', 'Чему равен arccos 0?', 'What is arccos 0?'),
      done: 'arccos 0 = 90°',
      items: [
        { id: 'a', label: L("to'qson gradus", 'девяносто градусов', 'ninety degrees'), correct: true },
        { id: 'b', label: L('nol gradus', 'ноль градусов', 'zero degrees'), hint: L('Nol gradusda siljish birga teng, nolga emas.', 'При нуле градусов сдвиг равен единице, а не нулю.', 'At zero degrees the shift equals one, not zero.') },
        { id: 'c', label: L('yuz sakson gradus', 'сто восемьдесят градусов', 'one hundred eighty degrees'), hint: L('U yerda siljish minus birga teng.', 'Там сдвиг равен минус единице.', 'There the shift equals minus one.') },
        { id: 'd', label: L("minus to'qson gradus", 'минус девяносто градусов', 'minus ninety degrees'), hint: L('U yerda ham siljish nol, lekin arkkosinus oynasi noldan boshlanadi.', 'Сдвиг там тоже ноль, но окно арккосинуса начинается с нуля.', 'The shift there is zero too, but the arccosine window starts at zero.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Nega arksinusning javobi bitta?', 'Почему у арксинуса ответ один?', 'Why does the arcsine have one answer?'),
      done: 'arcsin x ∈ [−90°; 90°]',
      items: [
        { id: 'a', label: L('javob oynadan olinadi', 'ответ берут из окна', 'the answer is taken from the window'), correct: true, ok: L('Ha. Ikkinchi nuqta bor, lekin u oynadan tashqarida.', 'Да. Вторая точка есть, но она вне окна.', 'Yes. The second point exists but lies outside the window.') },
        { id: 'b', label: L('ikkinchi nuqta mavjud emas', 'вторая точка не существует', 'the second point does not exist'), hint: L("Mavjud: to'g'ri chiziq aylanani ikki marta kesadi.", 'Существует: прямая задевает окружность дважды.', 'It does exist: the line meets the circle twice.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('arcsin 2 mavjudmi?', 'Существует ли arcsin 2?', 'Does arcsin 2 exist?'),
      done: '−1 ≤ x ≤ 1',
      items: [
        { id: 'a', label: L("yo'q", 'нет', 'no'), correct: true },
        { id: 'b', label: L('ha, katta burchak', 'да, большой угол', 'yes, a large angle'), hint: L('Ikki balandlik aylanada hech qanday burchakda uchramaydi.', 'Высота два на окружности не встречается ни при каком угле.', 'The height two never occurs on the circle at any angle.') },
        { id: 'c', label: L('ha, ikki radian', 'да, два радиана', 'yes, two radians'), hint: L('Bu yerda ikki balandlik, burchak emas.', 'Двойка здесь высота, а не угол.', 'Here the two is a height, not an angle.') },
        { id: 'd', label: L('faqat radianda', 'только в радианах', 'only in radians'), hint: L("Burchak o'lchov birligi bu yerda hech nima qilmaydi: to'g'ri chiziq aylanaga tegmadi.", 'Единицы измерения угла тут ни при чём: прямая просто не задела круг.', 'The unit of the angle changes nothing here: the line simply missed the circle.') },
      ],
    },
  ],
  angles: ['30°', '90°', '210°', '150°'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  audio: [
    A('mount', 'Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija.', 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
    A('next', "Arksinusning javobi bitta, chunki u oynadan olinadi, ikkinchi nuqta noto'g'ri bo'lgani uchun emas.", 'Ответ у арксинуса один, потому что его берут из окна, а не потому, что вторая точка неправильная.', 'The arcsine has one answer because it is taken from the window, not because the second point is wrong.'),
  ],
  can: [
    L("Bitta emas, ikkala nuqtani ko'raman", 'Вижу обе точки, а не одну', 'I see both points, not one'),
    L('Javobni oynadan olaman', 'Беру ответ из окна', 'I take the answer from the window'),
    L('Arkkosinusning oynasi boshqa ekanini eslayman', 'Помню, что у арккосинуса окно другое', 'I remember the arccosine has a different window'),
    L("Arksinus qachon yo'qligini bilaman", 'Знаю, когда арксинуса нет', 'I know when the arcsine does not exist'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L('Bitta joy takrorlashni talab qiladi: arkkosinusning oynasi qanday.', 'Одно место требует повтора: какое окно у арккосинуса.', 'One place needs review: what the arccosine window is.'),
    back: L('Qoidaga va 4-ekranga qayting.', 'Вернись к правилу и к экрану 4.', 'Go back to the rule and to screen 4.'),
  },
  bridge: L("9-dars: o'sha ikki nuqta, lekin endi ikkalasi kerak — tenglamalar boshlanadi.", 'Урок 9: те же две точки, но теперь нужны обе — начинаются уравнения.', 'Lesson 9: the same two points, but now both are needed — equations begin.'),
  lifehack: L('Avval ikkala nuqtani toping, keyingina oynadagisini tanlang.', 'Сначала найди обе точки, и только потом выбирай ту, что в окне.', 'Find both points first, and only then choose the one in the window.'),
  sheetTitle: L('Arkfunksiyalar · shpargalka', 'Аркфункции · шпаргалка', 'Arc functions · cheat sheet'),
  sheetSrc: L('10-sinf · 8-dars', '10 класс · урок 8', 'Grade 10 · lesson 8'),
  hook: {
    a: 'arcsin 1/2 = 30°',
    b: 'arcsin 1/2 = 30°,  150°',
  },
  proved: 'arcsin 1/2 = 30°',
  law: 'arcsin x ∈ [−90°; 90°],   arccos x ∈ [0°; 180°]',
  sheet: [
    'arcsin x ∈ [−90°; 90°]',
    'arccos x ∈ [0°; 180°]',
    'arcsin(−x) = −arcsin x',
    '−1 ≤ x ≤ 1',
    ['arcsin 1/2 = 30°', 'arccos 1/2 = 60°'],
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

// Число и градус из контента: минус там типографский, `parseInt` его не понимает.
const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))
const deg = (s) => parseInt(String(s).replace(/−/g, '-'), 10)

// Соответствие «запись — угол». Слева записи, справа углы; и то и другое
// формулы, одинаковые на всех языках.
const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const ARC_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const ARC_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})
// Отметки при неверной паре — те же четыре угла, что и в правом столбце.
const ARC_MARKS = ARC_RIGHT.map((r, i) => ({ deg: deg(r.label), tone: i % 2 ? 'graph' : 'ink3', label: r.label }))

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
        // Прямая опускается уже на хуке: обе точки видны до того, как названы.
        // Прогноз делается при полной картине, а не вслепую.
        fig={() => <Scene fig={<LevelLine step={1} a={0.5} arcs />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<UnitCircle angle={30} locked drop meaning ticks />} max={300} />
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
      /* Свидетель урока: прямая садится на высоту и зажигает ОБЕ точки разом.
         Они остаются на экране, пока ученик отвечает. */
      <Scene
        fig={<LevelLine step={phase} a={0.5} arcs />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S3.work.prompt}
        test={(c, s) => c < -0.5 && Math.abs(s - 0.5) < 0.09}
        hints={[
          { when: (c) => c > 0, text: S3.work.hint[0] },
          { when: (c, s) => s < 0, text: S3.work.hint[1] },
          { when: () => true, text: S3.work.hint[2] },
        ]}
        okText={S3.work.ok}
        snap={[150]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      /* Кадр 0 — окно закрашивается, кадр 1 — точка вне его тускнеет. Вторая
         точка не исчезает: она есть, просто в ответ не идёт. */
      <Scene
        fig={<WindowArc step={phase + 1} a={0.5} from={-90} to={90} />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S4.work.prompt}
        test={(c, s) => c > 0.5 && Math.abs(s - 0.5) < 0.09}
        hints={[
          { when: (c) => c < 0, text: S4.work.hint[0] },
          { when: (c, s) => s < 0, text: S4.work.hint[1] },
          { when: () => true, text: S4.work.hint[2] },
        ]}
        okText={S4.work.ok}
        snap={[30]}
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
        fig={<WindowArc step={phase === 0 ? 1 : 2} a={0.5} from={-90} to={90} />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<WindowArc step={2} a={0.5} from={-90} to={90} />} max={300} />
        </Col>
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
      /* У арккосинуса прямая ВЕРТИКАЛЬНАЯ. С горизонталью окно от нуля до ста
         восьмидесяти не разделило бы точки: у обеих одинаковая высота. */
      <Scene
        fig={<WindowArc step={phase + 1} a={0.5} from={0} to={180} axis="x" />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S6.work.prompt}
        test={(c, s) => Math.abs(c - 0.5) < 0.09 && s > 0.5}
        hints={[
          { when: (c, s) => s < 0, text: S6.work.hint[0] },
          { when: (c) => c < 0, text: S6.work.hint[1] },
          { when: () => true, text: S6.work.hint[2] },
        ]}
        okText={S6.work.ok}
        snap={[60]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen7 = (p) => (
  <Screen data={S7} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S7.show.length && !solved ? (
      /* Прямая останавливается ВЫШЕ окружности и остаётся видимой: «прошла
         мимо» надо увидеть, а не услышать. */
      <Scene
        fig={<LevelLine step={phase} a={2} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<LevelLine step={1} a={2} />} max={300} />
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
        // Окно закрашивается в момент ответа: правило открывается рядом с тем
        // движением, которое его и породило.
        fig={(solved) => <Scene fig={<WindowArc step={solved ? 2 : 0} a={0.5} from={-90} to={90} />} max={330} />}
      />
    )}
  </Screen>
)

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <MatchPairs
        prompt={S9.match.prompt}
        left={ARC_LEFT}
        right={ARC_RIGHT}
        marks={ARC_MARKS}
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
      <OrderRow
        prompt={S10.order.prompt}
        items={ORD10}
        answer={['s1', 's2', 's3', 's4']}
        marks={[{ deg: deg(S10.order.mark), tone: 'graph', label: S10.order.mark }]}
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
      <PlaceAngle
        prompt={S13.place.prompt}
        targets={[deg(S13.place.target)]}
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
        fig={(round) => (
          <Scene
            fig={<UnitCircle angle={deg(S14.angles[Math.min(round, S14.angles.length - 1)])} locked drop />}
            max={300}
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
