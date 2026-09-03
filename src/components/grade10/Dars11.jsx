// ============================================================================
// 10-sinf, Dars 11. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS11_KONTENT.md
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
// Фигуры блока 2. `alt` -- чередование двух мест, свидетель этого урока.
import { LevelLine, SeriesTicks } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 11
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. sin x = a`,
  `Урок ${LESSON_NO}. sin x = a`,
  `Lesson ${LESSON_NO}. sin x = a`,
)

const BLOCK = { label: 'B2', from: 9, to: 14, current: 11 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('BITTA YOZUV', 'ОДНА ЗАПИСЬ', 'ONE READING'),
  title: L('Javobda darajadagi minus bir qayerdan?', 'Откуда в ответе минус единица в степени?', 'Where does the minus one in the power come from?'),
  motion: ['mount'],
  audio: [
    A('mount', 'Nuqta ikki joy orasida yuradi va har qadamda yarim aylana uzoqroqqa ketadi.', 'Точка ходит между двумя местами и с каждым шагом уходит на половину оборота дальше.', 'The point walks between two places and each step goes half a turn further.'),
    A('r1', "Birinchi yozuv bu yodlash kerak bo'lgan yangi formula deydi.", 'Первая запись говорит, что это новая формула, которую надо выучить.', 'The first reading says it is a new formula to memorise.'),
    A('r2', 'Ikkinchisi bu kechagi ikki seriya birga yozilgani deydi.', 'Вторая говорит, что это две вчерашние серии, записанные вместе.', "The second says these are yesterday's two series written together."),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi raqamlarni qo'yib ko'ramiz.", 'Твой ответ записан. Сейчас подставим номера и посмотрим.', 'Your answer is saved. Now we will substitute the numbers and see.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('bu yangi formula', 'это новая формула', 'this is a new formula'),
      value: ['(−1)ⁿ', '30° + 180°n'],
    },
    b: {
      name: L('bu ikki seriya birga', 'это две серии вместе', 'these are two series together'),
      value: '30° + 360°n,  150° + 360°n',
    },
  },
  expr: 'sin x = 1/2',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L("Yig'ishdan oldin uch savol", 'Три вопроса перед склейкой', 'Three questions before folding'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Sinusli tenglamaning to'liq javobida nechta seriya bor?", 'Сколько серий в полном ответе уравнения с синусом?', 'How many series are in the full answer of a sine equation?'),
      done: '2',
      items: [
        { id: 'a', label: L('ikkita', 'две', 'two'), correct: true },
        { id: 'b', label: L('bitta', 'одна', 'one'), hint: L('Bittasi ikki nuqtadan faqat bittasini qoplaydi.', 'Одна покрывает только одну из двух точек.', 'One covers only one of the two points.') },
        { id: 'c', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Ildiz cheksiz ko'p, ularni tavsiflaydigan seriya esa ikkita.", 'Бесконечно много корней, а серий, которые их описывают, две.', 'There are infinitely many roots, but two series describing them.') },
        { id: 'd', label: L("to'rtta", 'четыре', 'four'), hint: L('Kesishish nuqtasi ikkita, demak seriya ham ikkita.', 'Точек пересечения две, значит и серий две.', 'There are two intersection points, so two series.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Minus birning kvadrati nimaga teng?', 'Чему равен минус один в квадрате?', 'What is minus one squared?'),
      done: '(−1)² = 1',
      items: [
        { id: 'a', label: L('birga', 'единице', 'one'), correct: true },
        { id: 'b', label: L('minus birga', 'минус единице', 'minus one'), hint: L('Minusga minus plyus beradi, demak ikkinchi daraja musbat.', 'Минус на минус даёт плюс, значит вторая степень положительна.', 'Minus times minus gives plus, so the second power is positive.') },
        { id: 'c', label: L('nolga', 'нулю', 'zero'), hint: L('Nol faqat noldan chiqadi.', 'Ноль получается только из нуля.', 'Zero comes only from zero.') },
        { id: 'd', label: L('ikkiga', 'двум', 'two'), hint: L("Daraja bu ko'paytirish, qo'shish emas.", 'Степень это умножение, а не сложение.', 'A power is multiplication, not addition.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Bir ikkidanning arksinusi nima?', 'Что такое арксинус одной второй?', 'What is the arcsine of one half?'),
      done: 'arcsin 1/2 = 30°',
      items: [
        { id: 'a', label: L('oynadagi, shunday balandlikdagi burchak', 'угол из окна с такой высотой', 'the angle from the window with that height'), correct: true },
        { id: 'b', label: L('shunday balandlikdagi har qanday burchak', 'любой угол с такой высотой', 'any angle with that height'), hint: L("Unda javob ro'yxat bo'lardi, bizga esa bitta burchak kerak.", 'Тогда ответом был бы список, а нужен один угол.', 'Then the answer would be a list, and one angle is needed.') },
        { id: 'c', label: L('burchakning balandligi', 'высота угла', 'the height of the angle'), hint: L('Aksincha: balandlik berilgan, burchak qidiriladi.', 'Наоборот: высота дана, а ищется угол.', 'The other way round: the height is given, the angle is sought.') },
        { id: 'd', label: L('burchakning yarmi', 'половина угла', 'half the angle'), hint: L("Arksinus balandlikka bog'liq, burchakni bo'lishga emas.", 'Арксинус связан с высотой, а не с делением угла.', 'The arcsine is about the height, not about halving the angle.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Ikki yozuv, ikkalasi to'g'ri", 'Две записи, обе верные', 'Two readings, both true'),
  tag: 'odin-koren',
  show: [
    [
      L("bir ikkidan balandlikdagi to'g'ri chiziq", 'прямая на высоте одна вторая', 'the line at height one half'),
      L("o'ttiz va yuz ellik nuqtalar", 'точки тридцать и сто пятьдесят', 'the points thirty and one hundred fifty'),
    ],
    [
      L("har birining o'z seriyasi", 'у каждой своя серия', 'each has its own series'),
      L('javobda ikkita qator', 'в ответе две строки', 'two lines in the answer'),
    ],
  ],
  motion: ['two'],
  audio: [
    A('mount', "Kechagi javob: ikkita nuqta, va har birining o'z seriyasi.", 'Вчерашний ответ: две точки, и у каждой своя серия.', "Yesterday's answer: two points, each with its own series."),
    A('two', "Ikkala qator ham to'g'ri, va birga ular hamma ildizni beradi. Noqulayligi boshqa: qator ikkita, darslikda va imtihonda esa javob bitta qator bilan yoziladi.", 'Обе строки верны, и вместе они дают все корни. Неудобно другое: строк две, а в учебнике и на экзамене ответ пишут одной.', 'Both lines are true, and together they give every root. The awkward part is different: there are two lines, while the textbook and the exam write the answer as one.'),
    A('work', "Endi o'zingiz. Ulardan ikkinchisiga nuqta qo'ying.", 'Теперь сам. Поставь точку во вторую из них.', 'Now you. Place the point at the second of them.'),
  ],
  work: {
    prompt: L("Ikkinchi ildizga nuqta qo'ying.", 'Поставь точку во второй корень.', 'Place the point at the second root.'),
    ok: L('Yuz ellik gradus. Bu nuqta ikkinchi seriyani beradi.', 'Сто пятьдесят градусов. Эта точка даёт вторую серию.', 'One hundred fifty degrees. This point gives the second series.'),
    hint: [
      L("O'sha to'g'ri chiziqdagi ikkinchi nuqta kerak.", 'Нужна вторая точка на той же прямой.', 'You need the second point on the same line.'),
      L("U vertikal o'qdan chapda.", 'Она слева от вертикальной оси.', 'It is left of the vertical axis.'),
      L('Yuz ellik gradus.', 'Сто пятьдесят градусов.', 'One hundred fifty degrees.'),
    ],
  },
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Raqamlarni navbat bilan qo'yamiz", 'Подставим номера по очереди', 'Substitute the numbers one by one'),
  tag: 'seriya-bez-n',
  show: [
    [
      L("nolda nuqta o'ngda", 'при нуле точка справа', 'at zero the point is on the right'),
      L('birda chapda', 'при единице слева', 'at one on the left'),
    ],
    [
      L("ikkida yana o'ngda", 'при двойке снова справа', 'at two on the right again'),
      L('joy jami ikkita', 'места всего два', 'there are only two places'),
    ],
  ],
  motion: ['alt'],
  audio: [
    A('mount', "Bitta qatorga raqamlarni navbat bilan qo'yamiz va nuqta qayerga tushishini ko'ramiz.", 'Подставим в одну строку номера по очереди и посмотрим, куда попадает точка.', 'Substitute the numbers one by one into a single line and watch where the point lands.'),
    A('alt', "Nol o'ttizni beradi, bir yuz ellikni, ikki uch yuz to'qsonni, uch besh yuz o'nni. Nuqta ikki joy orasida yuradi va har safar yarim aylana uzoqroqqa ketadi.", 'Ноль даёт тридцать, единица сто пятьдесят, двойка триста девяносто, тройка пятьсот десять. Точка ходит между двумя местами и каждый раз уходит на половину оборота дальше.', 'Zero gives thirty, one gives one hundred fifty, two gives three hundred ninety, three gives five hundred ten. The point walks between two places and each time goes half a turn further.'),
    A('work', "Endi o'zingiz. Bir raqami olib keladigan joyga nuqta qo'ying.", 'Теперь сам. Поставь точку туда, куда приведёт номер один.', 'Now you. Place the point where the number one leads.'),
  ],
  work: {
    prompt: L('n = 1 qayerga olib keladi?', 'Куда приведёт n = 1?', 'Where does n = 1 lead?'),
    ok: L('Yuz ellikka. Toq raqam nuqtani ikkinchi joyga yuboradi.', 'В сто пятьдесят. Нечётный номер отправляет точку во вторую позицию.', 'To one hundred fifty. An odd number sends the point to the second place.'),
    hint: [
      L("Birni qo'ying va hisoblang.", 'Подставь единицу и посчитай.', 'Substitute one and compute.'),
      L("Minus o'ttiz qo'shilgan yuz sakson.", 'Минус тридцать плюс сто восемьдесят.', 'Minus thirty plus one hundred eighty.'),
      L('Yuz ellik gradus.', 'Сто пятьдесят градусов.', 'One hundred fifty degrees.'),
    ],
  },
}

const S5 = {
  role: 'explain3',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Juftlar o'ngga, toqlar chapga", 'Чётные направо, нечётные налево', 'Even to the right, odd to the left'),
  tag: 'seriya-bez-n',
  show: [
    [
      L('juft raqam ishorani qoldiradi', 'чётный номер оставляет знак', 'an even number keeps the sign'),
      L('toq esa almashtiradi', 'нечётный меняет', 'an odd one flips it'),
    ],
    [
      L("buni ko'paytuvchi qiladi", 'это и делает множитель', 'that is what the factor does'),
      L('darajadagi minus bir', 'минус единица в степени', 'minus one in the power'),
    ],
  ],
  motion: ['sign'],
  audio: [
    A('mount', 'Juft raqamlarni toqlaridan nima farqlashiga qaraymiz.', 'Посмотрим, что отличает чётные номера от нечётных.', 'Let us see what tells even numbers from odd ones.'),
    A('sign', "Juft raqamda burchak plyus ishora bilan, toqda minus ishora bilan olinadi. Aynan shuni minus bir daraja en ko'paytuvchisi qiladi: u hech narsa hisoblamaydi, faqat ishorani almashtiradi.", 'При чётном номере угол берётся со знаком плюс, при нечётном со знаком минус. Именно это и делает множитель минус единица в степени эн: он ничего не считает, он только переключает знак.', 'With an even number the angle is taken with a plus, with an odd one with a minus. That is exactly what the factor minus one to the power n does: it computes nothing, it only switches the sign.'),
    A('work', "Endi o'zingiz. Ikki raqami olib keladigan joyga nuqta qo'ying.", 'Теперь сам. Поставь точку туда, куда приведёт номер два.', 'Now you. Place the point where the number two leads.'),
  ],
  work: {
    prompt: L('n = 2 qayerga olib keladi?', 'Куда приведёт n = 2?', 'Where does n = 2 lead?'),
    ok: L('Nol kelgan joyga. Juft raqam nuqtani birinchi joyga qaytaradi, faqat bir aylana uzoqroqqa.', 'Туда же, куда и ноль. Чётный номер возвращает точку в первую позицию, только на оборот дальше.', 'The same place as zero. An even number returns the point to the first place, just one turn further.'),
    hint: [
      L('Ikki juft, demak burchak ishorasi plyus.', 'Двойка чётная, значит знак у угла плюс.', 'Two is even, so the angle keeps its plus.'),
      L("O'ttiz qo'shilgan uch yuz oltmish uch yuz to'qson bo'ladi.", 'Тридцать плюс триста шестьдесят это триста девяносто.', 'Thirty plus three hundred sixty is three hundred ninety.'),
      L("O'ttiz gradus.", 'Тридцать градусов.', 'Thirty degrees.'),
    ],
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Qadam ikki barobar qisqardi', 'Шаг стал вдвое короче', 'The step became twice as short'),
  tag: 'seriya-bez-n',
  show: [
    [
      L('har seriyada qadam aylana edi', 'в каждой серии шаг был оборот', 'in each series the step was a turn'),
      L('yozuv ikkita edi', 'записей было две', 'there were two readings'),
    ],
    [
      L('umumiy yozuvda qadam yarim', 'в общей записи шаг половина', 'in the joint reading the step is half'),
      L('chunki yozuvlar almashadi', 'потому что записи чередуются', 'because the readings alternate'),
    ],
  ],
  motion: ['half'],
  audio: [
    A('mount', "Har alohida seriyada qadam to'liq aylana edi.", 'В каждой отдельной серии шаг был полный оборот.', 'In each separate series the step was a full turn.'),
    A('half', "Umumiy yozuvda esa qo'shni raqamlar boshqa nuqtalarni beradi, va ular orasida yarim aylana. Shuning uchun formulada uch yuz oltmish emas, yuz sakson turadi. Bu xato emas, bu yig'ishning natijasi.", 'А в общей записи соседние номера дают разные точки, и между ними половина оборота. Поэтому в формуле стоит сто восемьдесят, а не триста шестьдесят. Это не опечатка, это следствие склейки.', 'In the joint reading neighbouring numbers give different points, half a turn apart. That is why the formula has one hundred eighty, not three hundred sixty. It is not a typo, it follows from the folding.'),
    A('work', "O'zingiz hisoblang. Umumiy yozuvda qadam qanchaga teng?", 'Посчитай сам. Чему равен шаг в общей записи?', 'Compute it yourself. What is the step in the joint reading?'),
  ],
  work: {
    prompt: L('Umumiy yozuvda qadam necha gradus?', 'Чему равен шаг в общей записи, в градусах?', 'What is the step of the joint reading, in degrees?'),
    ok: L("Yuz sakson. Qo'shni raqamlar qo'shni nuqtalarni beradi, ular orasida esa yarim aylana.", 'Сто восемьдесят. Соседние номера дают соседние точки, а между ними половина оборота.', 'One hundred eighty. Neighbouring numbers give neighbouring points, half a turn apart.'),
    hint: [
      L("Yuz ellik bilan o'ttiz orasidagi farqni hisoblang.", 'Посчитай разность между сто пятьдесят и тридцать.', 'Compute the difference between one hundred fifty and thirty.'),
      L("Bu to'liq aylananing yarmi.", 'Это половина полного оборота.', 'That is half a full turn.'),
      L('Yuz sakson.', 'Сто восемьдесят.', 'One hundred eighty.'),
    ],
    answer: '180',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Nuqta bitta bo'lganda", 'Когда точка всего одна', 'When there is only one point'),
  tag: 'odin-koren',
  show: [
    [
      L('balandlik birga teng', 'высота равна единице', 'the height equals one'),
      L("to'g'ri chiziq chetiga tegadi", 'прямая касается края', 'the line touches the edge'),
    ],
    [
      L('nuqta jami bitta', 'точка всего одна', 'there is only one point'),
      L('seriya ham bitta', 'и серия тоже одна', 'and the series is single too'),
    ],
  ],
  motion: ['touch'],
  audio: [
    A('mount', "Birga teng balandlikni olaylik. To'g'ri chiziq eng tepada turadi.", 'Возьмём высоту, равную единице. Прямая стоит у самого верха.', 'Take the height equal to one. The line stands at the very top.'),
    A('touch', "U aylanaga bir nuqtada tegadi, kesib o'tmaydi. Nuqta bitta, demak seriya ham bitta, va umumiy formula bu yerda kerak emas.", 'Она касается окружности в одной точке, а не пересекает её. Точка одна, значит и серия одна, и общая формула здесь не нужна.', 'It touches the circle at one point instead of crossing it. There is one point, so one series, and the joint formula is not needed here.'),
    A('work', "O'zingiz hisoblang. Sinus iks birga teng tenglamaning javobida nechta seriya bor?", 'Посчитай сам. Сколько серий в ответе уравнения синус икс равен единице?', 'Compute it yourself. How many series are in the answer of sine x equals one?'),
  ],
  work: {
    prompt: L('sin x = 1 da nechta seriya bor?', 'Сколько серий у sin x = 1?', 'How many series does sin x = 1 have?'),
    ok: L("Bitta. Nuqta jami bitta, va u to'liq aylanadan keyin takrorlanadi.", 'Одна. Точка всего одна, и повторяется она через полный оборот.', 'One. There is a single point, and it repeats after a full turn.'),
    hint: [
      L("To'g'ri chiziq aylanani uchratgan nuqtalarni sanang.", 'Посчитай точки, где прямая встретила окружность.', 'Count the points where the line met the circle.'),
      L('U tegdi, kesmadi, demak nuqta bitta.', 'Она коснулась, а не пересекла, значит точка одна.', 'It touched instead of crossing, so there is one point.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Ildizlarning umumiy yozuvi', 'Общая запись корней', 'The joint reading of the roots'),
  tag: 'seriya-bez-n',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Nuqta yana bir bor raqamlar bo'ylab o'tadi, va qoida yonida ochiladi. Formula yangi emas: bu birga yozilgan ikki seriya.", 'Точка ещё раз проходит по номерам, и правило открывается рядом. Формула не новая: это две серии, записанные вместе.', 'The point walks through the numbers once more, and the rule opens beside it. The formula is not new: it is two series written together.'),
  ],
  probe: {
    question: L("`(−1)ⁿ` ko'paytuvchi nima qiladi?", 'Что делает множитель `(−1)ⁿ`?', 'What does the factor `(−1)ⁿ` do?'),
    items: [
      { id: 'a', label: L('burchak ishorasini almashtiradi', 'переключает знак угла', 'it switches the sign of the angle'), correct: true },
      { id: 'b', label: L('burchakni orttiradi', 'увеличивает угол', 'it enlarges the angle'), hint: L("Ko'paytuvchi birga yoki minus birga teng, o'lchamni o'zgartirmaydi.", 'Множитель равен единице или минус единице, размер он не меняет.', 'The factor equals one or minus one, it does not change the size.') },
    ],
  },
  rule: {
    lawLabel: L("Yig'ish", 'Склейка', 'The folding'),
    lines: [
      L('Ikki seriya bitta qator bilan yoziladi: juft raqamlar birinchi nuqtani, toqlar ikkinchisini beradi.', 'Две серии записываются одной строкой: чётные номера дают первую точку, нечётные вторую.', 'Two series are written as one line: even numbers give the first point, odd ones the second.'),
      L("`(−1)ⁿ` ko'paytuvchi faqat burchak ishorasini almashtiradi, hech narsa hisoblamaydi.", 'Множитель `(−1)ⁿ` только переключает знак угла, ничего не считая.', 'The factor `(−1)ⁿ` only switches the sign of the angle, computing nothing.'),
      L("Umumiy yozuvda qadam `180°` ga teng, chunki qo'shni raqamlar qo'shni nuqtalarni beradi.", 'Шаг в общей записи равен `180°`, то есть `π`: соседние номера дают соседние точки.', 'The step in the joint reading is `180°` because neighbouring numbers give neighbouring points.'),
    ],
    law: 'x = (−1)ⁿ arcsin a + πn',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Raqam va uning nuqtasi', 'Номер и его точка', 'The number and its point'),
  tag: 'seriya-bez-n',
  audio: [
    A('mount', "To'rt raqam va to'rt burchak. Ularni birlashtiring.", 'Четыре номера и четыре угла. Соедини их.', 'Four numbers and four angles. Match them.'),
  ],
  match: {
    prompt: L('Raqamni u beradigan burchak bilan birlashtiring.', 'Соедини номер с углом, который он даёт.', 'Match the number with the angle it gives.'),
    ok: L('Juft raqamlar birinchi nuqtaga, toqlar ikkinchisiga olib boradi, va har keyingisi yarim aylana uzoqroqqa.', 'Чётные номера ведут в первую точку, нечётные во вторую, и каждый следующий на половину оборота дальше.', 'Even numbers lead to the first point, odd ones to the second, each next half a turn further.'),
    left: ['n = 0', 'n = 1', 'n = 2', 'n = 3'],
    a: '30°',
    b: '150°',
    c: '390°',
    d: '510°',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("Formulani qadam bilan yig'ing", 'Собери формулу по шагам', 'Assemble the formula step by step'),
  tag: 'seriya-bez-n',
  audio: [
    A('mount', "To'rtta qadam. Tartibini o'zingiz qo'yasiz.", 'Четыре шага. Порядок ставишь ты.', 'Four steps. You put them in order.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L('oynadagi burchakni topamiz', 'находим угол в окне', 'we find the angle in the window'),
    s2: L('ikkinchi nuqtani olamiz', 'берём вторую точку', 'we take the second point'),
    s3: L("ishora orqali yig'amiz", 'склеиваем через знак', 'we fold them through the sign'),
    s4: L("qadamni yuz sakson qo'yamiz", 'шаг ставим сто восемьдесят', 'we set the step to one hundred eighty'),
    ok: L("Formula avvalgi narsalardan yig'ildi: oynadagi burchak, ikkinchi nuqta, ishora almashinuvi va yarim aylana.", 'Формула собрана из того, что уже было: угол из окна, вторая точка, чередование знака и половина оборота.', 'The formula is assembled from what was already there: the angle from the window, the second point, the sign alternation and half a turn.'),
    bad: L('Avval oynadagi burchak, keyin ikkinchi nuqta, keyin ishora, keyingina qadam.', 'Сначала угол из окна, потом вторая точка, потом знак, и только потом шаг.', 'First the angle from the window, then the second point, then the sign, and only then the step.'),
    mark: '150°',
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
    ok: L("Yuz ellik. Raqam toq, demak burchak minus bilan olinadi, va yuz sakson qo'shiladi.", 'Сто пятьдесят. Номер нечётный, значит угол берётся с минусом, и прибавляется сто восемьдесят.', 'One hundred fifty. The number is odd, so the angle takes a minus, and one hundred eighty is added.'),
    hint: [
      L("Bir toq, demak ko'paytuvchi minus birga teng.", 'Единица нечётная, значит множитель равен минус единице.', 'One is odd, so the factor equals minus one.'),
      L("Minus o'ttiz qo'shilgan yuz sakson.", 'Минус тридцать плюс сто восемьдесят.', 'Minus thirty plus one hundred eighty.'),
      L('Yuz ellik.', 'Сто пятьдесят.', 'One hundred fifty.'),
    ],
    prompt: '(−1)ⁿ·30° + 180°n,   n = 1   →   ?',
    answer: '150',
  },
  order: {
    prompt: L("O'sish tartibida joylashtiring.", 'Расставь по возрастанию.', 'Arrange in increasing order.'),
    title: L('Qaysi ildiz kichikroq?', 'Какой корень меньше?', 'Which root is smaller?'),
    ok: L("Siz raqamlarni qo'ydingiz va yozuvlarni emas, burchaklarni solishtirdingiz.", 'Ты подставил номера и сравнил углы, а не записи.', 'You substituted the numbers and compared angles, not readings.'),
    bad: L("Har raqamni formulaga qo'ying va chiqqanini solishtiring.", 'Подставь каждый номер в формулу и сравни то, что получилось.', 'Put each number into the formula and compare the results.'),
    items: ['n = 0', 'n = 1', 'n = 2', 'n = 3'],
    answer: 'n = 0  n = 1  n = 2  n = 3',
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
    A('mount', 'Masala. Sinus iks bir ikkidanga teng tenglamaning hamma ildizini bitta qator bilan yozish.', 'Задача. Записать все корни уравнения синус икс равен одной второй одной строкой.', 'A task. Write every root of sine x equals one half in a single line.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L("Bu qator to'g'ri: bir ikkidanning arksinusi haqiqatan o'ttizga teng.", 'Эта строка верна: арксинус одной второй действительно равен тридцати.', 'This line is right: the arcsine of one half really is thirty.'),
    r2: L("Bu qator ham to'g'ri: ko'paytuvchi ishorani almashtiradi.", 'Эта строка тоже верна: множитель переключает знак.', 'This line is right too: the factor switches the sign.'),
    r4: L("Bu qator xato qatordan o'sib chiqqan. Birinchi xato qator yuqorida.", 'Эта строка выросла из неверной. Первая неверная строка выше.', 'This line grew out of a wrong one. The first wrong line is above.'),
  },
  proof: L("Bir raqamida uch yuz o'ttiz chiqadi, kerakli esa yuz ellik.", 'При номере один получается триста тридцать, а нужен сто пятьдесят.', 'With the number one it gives three hundred thirty, and one hundred fifty is needed.'),
  entry: {
    prompt: L('Umumiy yozuvda qadam qanchaga teng?', 'Чему равен шаг в общей записи?', 'What is the step in the joint reading?'),
    ok: L("Yuz sakson. Qo'shni raqamlar qo'shni nuqtalarni beradi, ular orasida esa yarim aylana.", 'Сто восемьдесят. Соседние номера дают соседние точки, а между ними половина оборота.', 'One hundred eighty. Neighbouring numbers give neighbouring points, half a turn apart.'),
    hint: [
      L("Nol va birni qo'ying va javoblarni solishtiring.", 'Подставь ноль и единицу и сравни ответы.', 'Substitute zero and one and compare the answers.'),
      L("O'ttiz bilan yuz ellik orasida yarim aylana.", 'Между тридцатью и ста пятьюдесятью половина оборота.', 'Between thirty and one hundred fifty there is half a turn.'),
      L('Yuz sakson.', 'Сто восемьдесят.', 'One hundred eighty.'),
    ],
    answer: '180',
  },
  row: {
    r1: 'arcsin 1/2 = 30°',
    r2: ['x = (−1)ⁿ', '30° + ...'],
    r3: ['x = (−1)ⁿ', '30° + 360°n'],
    r4: 'n = 1   →   x = 330°',
  },
  answerId: 'r3',
}

const S13 = {
  role: 'transfer',
  answer: 'lead',
  format: 'place+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Nuqtadan raqamlarni aytish', 'По точке назвать номера', 'From the point back to the numbers'),
  tag: 'obratnoe',
  audio: [
    A('mount', 'Endi teskari masala. Nuqta berilgan, unga olib keladigan raqamlar kerak.', 'Теперь обратная задача. Дана точка, а нужны номера, которые в неё ведут.', 'Now the inverse task. A point is given, and the numbers leading to it are needed.'),
    A('work', "Nuqtani qo'ying, keyin unga olib keladigan hamma raqamni belgilaysiz.", 'Поставь точку, потом отметишь все номера, которые в неё ведут.', 'Place the point, then you will mark every number leading to it.'),
  ],
  multi: {
    prompt: L('Shu nuqtani beradigan hamma raqamni belgilang.', 'Отметь все номера, которые дают эту точку.', 'Mark every number that gives this point.'),
    title: L('Qaysi raqamlar shu nuqtani beradi?', 'Какие номера дают эту точку?', 'Which numbers give this point?'),
    ok: L("Beshtadan uchtasi. Bu nuqtaga aynan toq raqamlar olib boradi, boshqasi yo'q.", 'Три из пяти. В эту точку ведут ровно нечётные номера, и никакие другие.', 'Three out of five. Exactly the odd numbers lead to this point, and no others.'),
    items: [
      { id: 'd', label: 'n = 0', hint: L('Nol juft, u birinchi nuqtaga olib boradi.', 'Ноль чётный, он ведёт в первую точку.', 'Zero is even, it leads to the first point.') },
      { id: 'e', label: 'n = 2', hint: L('Ikki ham juft, demak u ham birinchisiga.', 'Двойка тоже чётная, значит и она в первую.', 'Two is even as well, so it also leads to the first.') },
      { id: 'a', label: 'n = 1', ok: true },
      { id: 'b', label: 'n = 3', ok: true },
      { id: 'c', label: 'n = −1', ok: true },
    ],
  },
  place: {
    prompt: L("Nuqtani 150 gradusga qo'ying.", 'Поставь точку на 150 градусов.', 'Place the point at 150 degrees.'),
    ok: L('Bu ikkinchi joy. Unga toq raqamlar olib boradi.', 'Это вторая позиция. В неё ведут нечётные номера.', 'This is the second place. Odd numbers lead to it.'),
    wrong: L("Yuz ellik gorizontal o'qdan yuqorida va vertikal o'qdan chapda.", 'Сто пятьдесят это выше горизонтальной оси и левее вертикальной.', 'One hundred fifty is above the horizontal axis and left of the vertical one.'),
    target: '150°',
    step: 'n = 1   →   150°',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'seriya-bez-n',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("`(−1)ⁿ` ko'paytuvchi nima qiladi?", 'Что делает множитель `(−1)ⁿ`?', 'What does the factor `(−1)ⁿ` do?'),
      done: '(−1)ⁿ = ± 1',
      items: [
        { id: 'a', label: L('ishorani almashtiradi', 'переключает знак', 'it switches the sign'), correct: true },
        { id: 'b', label: L('burchakni orttiradi', 'увеличивает угол', 'it enlarges the angle'), hint: L("U birga yoki minus birga teng, o'lchamni o'zgartirmaydi.", 'Он равен единице или минус единице, размер не меняет.', 'It equals one or minus one and does not change the size.') },
        { id: 'c', label: L('burchakni nollaydi', 'обнуляет угол', 'it zeroes the angle'), hint: L("Nol faqat nolga ko'paytirilganda chiqardi.", 'Ноль получился бы только при умножении на ноль.', 'Zero would come only from multiplying by zero.') },
        { id: 'd', label: L('hech narsa qilmaydi', 'ничего не делает', 'it does nothing'), hint: L('Toq raqamda u ishorani almashtiradi, va nuqta boshqa joyga ketadi.', 'При нечётном номере он меняет знак, и точка уходит в другое место.', 'With an odd number it flips the sign, and the point goes elsewhere.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Umumiy yozuvda qadam qanchaga teng?', 'Чему равен шаг в общей записи?', 'What is the step in the joint reading?'),
      done: '180°n',
      items: [
        { id: 'a', label: L('yuz sakson', 'сто восемьдесят', 'one hundred eighty'), correct: true },
        { id: 'b', label: L('uch yuz oltmish', 'триста шестьдесят', 'three hundred sixty'), hint: L('Uch yuz oltmish har alohida seriyaning qadami, umumiy yozuvniki emas.', 'Триста шестьдесят это шаг каждой отдельной серии, а не общей записи.', 'Three hundred sixty is the step of each separate series, not of the joint reading.') },
        { id: 'c', label: L("to'qson", 'девяносто', 'ninety'), hint: L("Qo'shni nuqtalar orasida yarim aylana, chorak emas.", 'Между соседними точками половина оборота, а не четверть.', 'Between neighbouring points there is half a turn, not a quarter.') },
        { id: 'd', label: L("burchakka bog'liq", 'зависит от угла', 'it depends on the angle'), hint: L("Qadam burchak qanday bo'lishidan qat'i nazar doim bir xil.", 'Шаг всегда один и тот же, каким бы ни был угол.', 'The step is always the same whatever the angle.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Juft raqamlar qayerga olib boradi?', 'Куда ведут чётные номера?', 'Where do even numbers lead?'),
      done: 'n = 0, 2, 4',
      items: [
        { id: 'a', label: L('birinchi nuqtaga', 'в первую точку', 'to the first point'), correct: true, ok: L('Ha. Juft raqam burchakni plyus bilan qoldiradi.', 'Да. Чётный номер оставляет угол с плюсом.', 'Yes. An even number leaves the angle with a plus.') },
        { id: 'b', label: L('ikkinchi nuqtaga', 'во вторую точку', 'to the second point'), hint: L("Ikkinchisiga toqlar olib boradi: u yerda ko'paytuvchi minus birga teng.", 'Во вторую ведут нечётные: там множитель равен минус единице.', 'Odd ones lead to the second: there the factor equals minus one.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('sin x = 1 da nechta seriya bor?', 'Сколько серий у sin x = 1?', 'How many series does sin x = 1 have?'),
      done: '1',
      items: [
        { id: 'a', label: L('bitta', 'одна', 'one'), correct: true },
        { id: 'b', label: L('ikkita', 'две', 'two'), hint: L("To'g'ri chiziq chetiga tegdi, nuqta jami bitta.", 'Прямая коснулась края, точка всего одна.', 'The line touched the edge, there is only one point.') },
        { id: 'c', label: L('hech qaysi', 'ни одной', 'none'), hint: L('Bitta nuqta bor, demak seriya ham bor.', 'Одна точка есть, значит и серия есть.', 'There is one point, so there is a series.') },
        { id: 'd', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Ildiz cheksiz ko'p, seriya esa bitta.", 'Корней бесконечно много, а серия одна.', 'There are infinitely many roots, but one series.') },
      ],
    },
  ],
  angles: ['30°', '150°', '390°', '90°'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  audio: [
    A('mount', 'Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija.', 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
    A('next', 'Bu yangi formula emas, kechagi ikki seriya birga yozilgani.', 'Это не новая формула, а две вчерашние серии, записанные вместе.', "It is not a new formula but yesterday's two series written together."),
  ],
  can: [
    L('Hamma ildizni bitta qator bilan yozaman', 'Записываю все корни одной строкой', 'I write every root in one line'),
    L("Ko'paytuvchi ishora bilan nima qilishini bilaman", 'Знаю, что делает множитель со знаком', 'I know what the factor does to the sign'),
    L('Qadam yarim aylanaga tengligini eslayman', 'Помню, что шаг равен половине оборота', 'I remember the step is half a turn'),
    L('Formulani orqaga yozaman', 'Разворачиваю формулу обратно', 'I unfold the formula back'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L('Bitta joy takrorlashni talab qiladi: qadam qanchaga teng.', 'Одно место требует повтора: чему равен шаг.', 'One place needs review: what the step equals.'),
    back: L('Qoidaga va 4-ekranga qayting.', 'Вернись к правилу и к экрану 4.', 'Go back to the rule and to screen 4.'),
  },
  bridge: L("11-dars: kosinus uchun o'shanisi, va u yerda yig'ish qisqaroq chiqadi.", 'Урок 11: то же самое для косинуса, и там склейка выйдет короче.', 'Lesson 11: the same for the cosine, and there the folding comes out shorter.'),
  lifehack: L("Formulani unutdingizmi, nol va birni qo'ying. Ikkala nuqta chiqsa, formula to'g'ri yozilgan.", 'Забыл формулу — подставь ноль и единицу. Если получились обе точки, формула записана верно.', 'Forgot the formula, substitute zero and one. If both points come out, the formula is written right.'),
  sheetTitle: L('Umumiy yozuv · shpargalka', 'Общая запись · шпаргалка', 'The joint reading · cheat sheet'),
  sheetSrc: L('10-sinf · 10-dars', '10 класс · урок 10', 'Grade 10 · lesson 10'),
  hook: {
    a: '(−1)ⁿ',
    b: '360°n',
  },
  proved: '(−1)ⁿ·30° + 180°n',
  law: 'x = (−1)ⁿ arcsin a + πn',
  sheet: [
    '(−1)ⁿ arcsin a + πn',
    'n = 0  →  30°',
    'n = 1  →  150°',
    'n = 2  →  390°',
    '90° + 360°n',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

// Число и градус из контента: минус там типографский, `parseInt` его не понимает.
const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))
const deg = (s) => parseInt(String(s).replace(/−/g, '-'), 10)

// Соответствие «номер — угол». Обе стороны формулы, переводить нечего.
const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const NUM_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const NUM_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})
// Отметки при неверной паре: ДВА места, между которыми ходит точка. Их и
// только их дают все номера.
const NUM_MARKS = [
  { deg: 30, tone: 'graph', label: '30°' },
  { deg: 150, tone: 'ink3', label: '150°' },
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
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Точка ходит между двумя местами уже на хуке: чередование видно до
        // того, как названо. Прогноз делается при полной картине.
        fig={() => <Scene fig={<SeriesTicks step={2} deg={30} turns={3} alt />} max={156} h={156} />}
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
      /* Свидетель урока: точка ходит между ДВУМЯ местами. Список номеров
         растёт, и чередование видно по нему, а не по формуле. */
      <Scene
        fig={<SeriesTicks step={phase + 1} deg={30} turns={3} alt />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S4.work.prompt}
        test={(c, s) => c < -0.5 && Math.abs(s - 0.5) < 0.09}
        hints={[
          { when: (c) => c > 0, text: S4.work.hint[0] },
          { when: (c, s) => s < 0, text: S4.work.hint[1] },
          { when: () => true, text: S4.work.hint[2] },
        ]}
        okText={S4.work.ok}
        snap={[150]}
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
        fig={<SeriesTicks step={phase + 2} deg={30} turns={3} alt />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S5.work.prompt}
        test={(c, s) => c > 0.5 && Math.abs(s - 0.5) < 0.09}
        hints={[
          { when: (c) => c < 0, text: S5.work.hint[0] },
          { when: (c, s) => s < 0, text: S5.work.hint[1] },
          { when: () => true, text: S5.work.hint[2] },
        ]}
        okText={S5.work.ok}
        snap={[30]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      /* Шаг виден по списку: соседние номера дают соседние точки, а между
         ними половина оборота. */
      <Scene
        fig={<SeriesTicks step={phase + 2} deg={30} turns={3} alt />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<SeriesTicks step={3} deg={30} turns={3} alt />} max={300} />
        </Col>
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
      /* Прямая КАСАЕТСЯ края: точка одна, и это видно по чертежу, а не по
         словам «особый случай». */
      <Scene
        fig={<LevelLine step={phase} a={1} arcs />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<LevelLine step={1} a={1} arcs />} max={300} />
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
        // Серия строится в момент ответа: правило открывается рядом с тем
        // движением, которое его и породило.
        fig={(solved) => <Scene fig={<SeriesTicks step={solved ? 3 : 0} deg={30} turns={3} alt />} max={330} />}
      />
    )}
  </Screen>
)

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <MatchPairs
        prompt={S9.match.prompt}
        left={NUM_LEFT}
        right={NUM_RIGHT}
        marks={NUM_MARKS}
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
