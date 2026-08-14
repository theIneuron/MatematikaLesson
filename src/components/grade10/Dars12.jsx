// ============================================================================
// 10-sinf, Dars 12. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS12_KONTENT.md
// Ma'lumot mashina bilan yig'ilgan, ekran tanalari qo'lda yozilgan (etalon
// §5.3). Tekshirish: `node scripts/grade10-check.mjs dars12`.
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
// Линия тангенсов — единственная новая фигура урока. Снята на стенде до
// контента, и стенд поймал два дефекта (см. START_GRADE10).
import { TanLine } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 12
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. tg x = a`,
  `Урок ${LESSON_NO}. tg x = a`,
  `Lesson ${LESSON_NO}. tg x = a`,
)

const BLOCK = { label: 'B2', from: 8, to: 13, current: 12 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('TANGENS', 'ТАНГЕНС', 'THE TANGENT'),
  title: L('Tangens necha gradusdan keyin takrorlanadi?', 'Через сколько повторяется тангенс?', 'After how much does the tangent repeat?'),
  motion: ['mount'],
  audio: [
    A('mount', "Markazdan o'tgan chiziq yarim aylanaga buriladi, o'ngdagi kesish esa joyida qoladi.", 'Прямая через центр поворачивается на половину оборота, и отсечка справа остаётся на месте.', 'The line through the centre turns half a turn, and the mark on the right stays in place.'),
    A('r1', "Birinchi yozuv to'liq aylanadan keyin takrorlanadi deydi.", 'Первая запись говорит, что повторяется через полный оборот.', 'The first reading says it repeats after a full turn.'),
    A('r2', 'Ikkinchisi yarmi yetadi deydi.', 'Вторая говорит, что достаточно половины.', 'The second says half is enough.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi chiziqni burib ko'ramiz.", 'Твой ответ записан. Сейчас повернём прямую и посмотрим.', 'Your answer is saved. Now we will turn the line and see.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L("to'liq aylanadan keyin", 'через полный оборот', 'after a full turn'),
      value: 'x = arctg a + 360°n',
    },
    b: {
      name: L('yarim aylanadan keyin', 'через половину', 'after half a turn'),
      value: 'x = arctg a + 180°n',
    },
  },
  expr: 'tg x = a',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Tangensdan oldin uch savol', 'Три вопроса перед тангенсом', 'Three questions before the tangent'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Burchak tangensi nima?', 'Что такое тангенс угла?', 'What is the tangent of an angle?'),
      done: 'tg α = y / x',
      items: [
        { id: 'a', label: L('balandlikning siljishga nisbati', 'высота, делённая на сдвиг', 'the height divided by the shift'), correct: true },
        { id: 'b', label: L('siljishning balandlikka nisbati', 'сдвиг, делённый на высоту', 'the shift divided by the height'), hint: L("Bu ag'darilgan nisbat, uning nomi boshqa.", 'Это перевёрнутое отношение, у него другое имя.', 'That is the reversed ratio, it has a different name.') },
        { id: 'c', label: L("koordinatalar yig'indisi", 'сумма координат', 'the sum of the coordinates'), hint: L("Tangens nisbat, yig'indi emas.", 'Тангенс это отношение, а не сумма.', 'The tangent is a ratio, not a sum.') },
        { id: 'd', label: L('radius uzunligi', 'длина радиуса', 'the length of the radius'), hint: L("Radius doim birga teng va burchakka bog'liq emas.", 'Радиус всегда равен единице и от угла не зависит.', 'The radius is always one and does not depend on the angle.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Qaysi burchakda tangens yo'q?", 'При каком угле тангенса нет?', 'At which angle does the tangent not exist?'),
      done: 'x = 0',
      items: [
        { id: 'a', label: L("to'qson gradusda", 'при девяноста градусах', 'at ninety degrees'), correct: true },
        { id: 'b', label: L('nolda', 'при нуле', 'at zero'), hint: L('Nolda balandlik nolga teng, nisbat ham nol.', 'При нуле высота равна нулю, и отношение тоже ноль.', 'At zero the height is zero, and the ratio is zero too.') },
        { id: 'c', label: L('yuz saksonda', 'при ста восьмидесяти', 'at one hundred eighty'), hint: L("U yerda siljish minus birga teng, bo'lish mumkin.", 'Там сдвиг равен минус единице, делить можно.', 'There the shift is minus one, division works.') },
        { id: 'd', label: L('tangens doim bor', 'тангенс есть всегда', 'it always exists'), hint: L("To'qsonda siljish nolga teng, nolga esa bo'lib bo'lmaydi.", 'На девяноста сдвиг равен нулю, а на ноль делить нельзя.', 'At ninety the shift is zero, and division by zero is not allowed.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Nuqtani avvalgi joyiga nima qaytaradi?', 'Что возвращает точку на прежнее место?', 'What returns the point to its former place?'),
      done: 'α + 360°n',
      items: [
        { id: 'a', label: L('butun sondagi aylana', 'целое число оборотов', 'a whole number of turns'), correct: true },
        { id: 'b', label: L('yarim aylana', 'половина оборота', 'half a turn'), hint: L('Yarim aylana nuqtani qarshi tomonga olib ketadi.', 'Половина уводит точку напротив.', 'Half a turn sends the point opposite.') },
        { id: 'c', label: L('chorak aylana', 'четверть оборота', 'a quarter turn'), hint: L("Chorak nuqtani qo'shni o'qqa olib o'tadi.", 'Четверть переводит точку на соседнюю ось.', 'A quarter moves the point to the neighbouring axis.') },
        { id: 'd', label: L('hech narsa', 'ничто', 'nothing'), hint: L("Qaytaradi: to'liq aylana nuqtani o'sha yerga olib keladi.", 'Возвращает: полный оборот приводит точку туда же.', 'It does: a full turn brings the point to the same place.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Tangenslar chizig'i", 'Линия тангенсов', 'The line of tangents'),
  tag: 'tg-period-2pi',
  show: [
    [
      L("o'ngda vertikal chiziq turadi", 'справа стоит вертикальная линия', 'a vertical line stands on the right'),
      L("markazdan o'tgan chiziq unga qadar davom etadi", 'прямая через центр продолжается до неё', 'the line through the centre reaches it'),
    ],
    [
      L("kesish tangensning o'zi", 'отсечка и есть тангенс', 'the mark is the tangent'),
      L('uning balandligi nisbatga teng', 'её высота равна отношению', 'its height equals the ratio'),
    ],
  ],
  motion: ['cut'],
  audio: [
    A('mount', "Aylananing o'ng tomonida vertikal chiziq turadi. U tangens uchun asbob.", 'Справа от окружности стоит вертикальная линия. Она и есть прибор для тангенса.', 'A vertical line stands to the right of the circle. That is the instrument for the tangent.'),
    A('cut', "Markazdan o'tkazilgan chiziq shu chiziqqacha davom etadi va unda bir bo'lak kesadi. Shu bo'lakning balandligi burchak tangensi: balandlikning siljishga nisbati.", 'Прямая, проведённая через центр, продолжается до этой линии и отсекает на ней кусок. Высота этого куска и есть тангенс угла: отношение высоты к сдвигу.', 'The line drawn through the centre continues to that line and cuts off a piece. The height of that piece is the tangent of the angle: the height divided by the shift.'),
    A('work', "Endi o'zingiz. Nuqtani qirq besh gradusga qo'ying va kesishga qarang.", 'Теперь сам. Поставь точку на сорок пять градусов и посмотри на отсечку.', 'Now you. Place the point at forty five degrees and look at the mark.'),
  ],
  work: {
    prompt: L("Nuqtani 45 gradusga qo'ying.", 'Поставь точку на 45 градусов.', 'Place the point at 45 degrees.'),
    ok: L('Bu yerda balandlik va siljish teng, shuning uchun nisbat birga teng, kesish esa bir balandlikda turadi.', 'Здесь высота и сдвиг равны, поэтому отношение равно единице, и отсечка стоит на высоте один.', 'Here the height and the shift are equal, so the ratio is one, and the mark stands at height one.'),
    hint: [
      L("Qirq besh bu o'qlar orasidagi o'rta.", 'Сорок пять это середина между осями.', 'Forty five is midway between the axes.'),
      L('U yerda balandlik va siljish bir xil.', 'Там высота и сдвиг одинаковые.', 'There the height and the shift are the same.'),
      L('Qirq besh gradus.', 'Сорок пять градусов.', 'Forty five degrees.'),
    ],
  },
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Nuqta ketdi, kesish qoldi', 'Точка уехала, отсечка осталась', 'The point left, the mark stayed'),
  tag: 'tg-period-2pi',
  show: [
    [
      L('yarim aylanaga burish', 'поворот на половину оборота', 'a turn of half a circle'),
      L("nuqta boshqa bo'ldi", 'точка стала другой', 'the point became a different one'),
    ],
    [
      L('kesish qimirlamadi', 'отсечка не сдвинулась', 'the mark did not move'),
      L("demak tangens o'sha", 'значит тангенс тот же', 'so the tangent is the same'),
    ],
  ],
  motion: ['half'],
  audio: [
    A('mount', "Chiziqni yarim aylanaga buramiz va nima o'zgarishini ko'ramiz.", 'Повернём прямую на половину оборота и посмотрим, что изменится.', 'Let us turn the line half a circle and see what changes.'),
    A('half', "Aylanadagi nuqta qarama-qarshi tomonga ketdi, kesish esa aynan o'sha yerda qoldi. Qarama-qarshi nuqtalarda ikkala koordinata ham ishorani almashtirdi, nisbat esa o'zgarmadi: minusga minus plyus beradi.", 'Точка на окружности ушла на противоположную сторону, а отсечка осталась ровно там же. У противоположных точек обе координаты сменили знак, а отношение от этого не изменилось: минус на минус даёт плюс.', 'The point on the circle moved to the opposite side, and the mark stayed exactly where it was. At opposite points both coordinates flipped sign, and the ratio did not change: minus times minus gives plus.'),
    A('work', "Endi o'zingiz. Qarama-qarshisiga, ikki yuz yigirma besh gradusga nuqta qo'ying.", 'Теперь сам. Поставь точку в противоположную, на двести двадцать пять градусов.', 'Now you. Place the point at the opposite one, at two hundred twenty five degrees.'),
  ],
  work: {
    prompt: L("Nuqtani 225 gradusga qo'ying.", 'Поставь точку на 225 градусов.', 'Place the point at 225 degrees.'),
    ok: L("Kesish o'sha. Ikki yuz yigirma beshning tangensi qirq beshnikidek.", 'Отсечка та же. Тангенс у двухсот двадцати пяти такой же, как у сорока пяти.', 'The same mark. The tangent at two hundred twenty five equals the one at forty five.'),
    hint: [
      L('Qarama-qarshi nuqta markazning boshqa tomonida turadi.', 'Противоположная точка стоит по другую сторону от центра.', 'The opposite point stands on the other side of the centre.'),
      L('Bu aylananing chap past qismi.', 'Это левая нижняя часть окружности.', 'That is the lower left part of the circle.'),
      L('Ikki yuz yigirma besh gradus.', 'Двести двадцать пять градусов.', 'Two hundred twenty five degrees.'),
    ],
  },
}

const S5 = {
  role: 'explain3',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Seriya bitta, qadam yarim aylana', 'Серия одна, шаг половина оборота', 'One series, the step is half a turn'),
  tag: 'seriya-bez-n',
  show: [
    [
      L('ikkala nuqta bir qiymat beradi', 'обе точки дают одно значение', 'both points give one value'),
      L('demak seriya bitta', 'значит серия одна', 'so the series is single'),
    ],
    [
      L('qadam yuz saksonga teng', 'шаг равен ста восьмидесяти', 'the step equals one hundred eighty'),
      L('uch yuz oltmishga emas', 'а не тремстам шестидесяти', 'not three hundred sixty'),
    ],
  ],
  motion: ['one'],
  audio: [
    A('mount', 'Sinus va kosinusda seriya ikkita edi. Bu yerda boshqacha.', 'У синуса и косинуса серий было две. Здесь другое.', 'For the sine and the cosine there were two series. Here it is different.'),
    A('one', "Ikkala nuqta ham bir xil kesish beradi, demak ularni ajratishning keragi yo'q: seriya bitta. Ular esa yarim aylanadan keyin keladi, shuning uchun yozuvdagi qadam yuz sakson.", 'Обе точки дают одну и ту же отсечку, значит различать их незачем: серия одна. А идут они через половину оборота, поэтому и шаг в записи сто восемьдесят.', 'Both points give the same mark, so there is no need to tell them apart: the series is single. And they come half a turn apart, so the step in the reading is one hundred eighty.'),
    A('work', "Endi o'zingiz. Ikki raqami olib keladigan joyga nuqta qo'ying.", 'Теперь сам. Поставь точку туда, куда приведёт номер два.', 'Now you. Place the point where the number two leads.'),
  ],
  work: {
    prompt: L('`45° + 180° · 2` qayerga olib keladi?', 'Куда приведёт `45° + 180° · 2`?', 'Where does `45° + 180° · 2` lead?'),
    ok: L("Boshlangan joyga. Yarim aylanadan ikki qadam bu to'liq aylana.", 'Туда же, где начали. Два шага по половине оборота это полный оборот.', 'Back where we started. Two half-turn steps make a full turn.'),
    hint: [
      L("Yuz saksonni ikki marta qo'shing.", 'Сложи сто восемьдесят два раза.', 'Add one hundred eighty twice.'),
      L("Uch yuz oltmish chiqadi, ya'ni to'liq aylana.", 'Получится триста шестьдесят, то есть полный оборот.', 'You get three hundred sixty, a full turn.'),
      L('Qirq besh gradus.', 'Сорок пять градусов.', 'Forty five degrees.'),
    ],
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Tangensda qiymat uchun taqiq yo'q", 'У тангенса запретов на значение нет', 'The tangent has no forbidden values'),
  tag: 'net-resheniy',
  show: [
    [
      L("tangenslar chizig'i yuqoriga va pastga ketadi", 'линия тангенсов уходит вверх и вниз', 'the line of tangents runs up and down'),
      L("uning chetlari yo'q", 'у неё нет краёв', 'it has no edges'),
    ],
    [
      L('unda har qanday son uchraydi', 'любое число на ней встречается', 'every number occurs on it'),
      L('demak tenglama doim yechiladi', 'значит уравнение решается всегда', 'so the equation always has a solution'),
    ],
  ],
  motion: ['free'],
  audio: [
    A('mount', "Tangenslar chizig'ining o'ziga qaraymiz.", 'Посмотрим на саму линию тангенсов.', 'Let us look at the line of tangents itself.'),
    A('free', "U yuqoriga va pastga chekkasiz ketadi, va unda har qanday son topiladi. Shuning uchun sinusda birdan katta qiymat mumkin emas edi, tangensda esa taqiq yo'q: tenglama har qanday sonda yechiladi.", 'Она уходит вверх и вниз без края, и любое число на ней найдётся. Поэтому у синуса значение больше единицы было невозможно, а у тангенса запретов нет: уравнение решается при любом числе.', 'It runs up and down without an edge, and any number can be found on it. That is why a value above one was impossible for the sine, while the tangent has no restrictions: the equation is solvable for any number.'),
    A('work', "O'zingiz hisoblang. Tangens iks ikkiga teng tenglamada nechta seriya bor?", 'Посчитай сам. Сколько серий у уравнения тангенс икс равен двум?', 'Compute it yourself. How many series does tangent x equals two have?'),
  ],
  work: {
    prompt: L('tg x = 2 da nechta seriya bor?', 'Сколько серий у tg x = 2?', 'How many series does tg x = 2 have?'),
    ok: L("Bitta. Ikki qiymati tangenslar chizig'ida bor, tangensda esa seriya doim bitta.", 'Одна. Значение два на линии тангенсов есть, а серия у тангенса всегда одна.', 'One. The value two exists on the line of tangents, and the tangent always has a single series.'),
    hint: [
      L("Tangenslar chizig'ida ikki bormi, qarang.", 'Посмотри, есть ли двойка на линии тангенсов.', 'Look whether two exists on the line of tangents.'),
      L('Chiziq chekkasiz, demak bor.', 'Линия без краёв, значит есть.', 'The line has no edges, so it does.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Lekin tangensning o'zi hamma joyda yo'q", 'Но сам тангенс есть не везде', 'But the tangent itself is not everywhere'),
  tag: 'tangens-bez-nulya',
  show: [
    [
      L('nuqta aylananing tepasiga ketadi', 'точка едет к верху окружности', 'the point moves to the top of the circle'),
      L('siljish nolga ketadi', 'сдвиг уходит в ноль', 'the shift goes to zero'),
    ],
    [
      L("chiziq parallel bo'lib qoladi", 'прямая становится параллельной', 'the line becomes parallel'),
      L("kesish yo'q", 'отсечки нет', 'there is no mark'),
    ],
  ],
  motion: ['gone'],
  audio: [
    A('mount', 'Nuqta aylananing deyarli eng tepasida turadi.', 'Точка стоит почти у самого верха окружности.', 'The point stands almost at the very top of the circle.'),
    A('gone', "Siljish kichrayadi va nolga ketadi, nolga esa bo'lib bo'lmaydi. Chizmada bu shunday ko'rinadi: chiziq tangenslar chizig'iga parallel bo'lib qoladi va uni endi kesmaydi. Kesish yo'q, demak qiymat ham yo'q.", 'Сдвиг уменьшается и уходит в ноль, а делить на ноль нельзя. На чертеже это видно так: прямая становится параллельной линии тангенсов и уже нигде её не пересекает. Отсечки нет, значит нет и значения.', 'The shift shrinks to zero, and division by zero is not allowed. On the drawing it looks like this: the line becomes parallel to the line of tangents and no longer meets it. There is no mark, so there is no value.'),
    A('work', "O'zingiz hisoblang. Tangens iks ikkiga teng tenglamaning noldan yuz saksongacha oraliqda nechta ildizi bor?", 'Посчитай сам. Сколько корней у уравнения тангенс икс равен двум на промежутке от нуля до ста восьмидесяти?', 'Compute it yourself. How many roots does tangent x equals two have between zero and one hundred eighty?'),
  ],
  work: {
    prompt: L('tg x = 2 ning 0 dan 180° gacha nechta ildizi bor?', 'Сколько корней у tg x = 2 от 0 до 180°?', 'How many roots does tg x = 2 have from 0 to 180°?'),
    ok: L('Bitta. Yarim aylanada seriya aynan bitta ildiz beradi.', 'Один. На половине оборота серия даёт ровно один корень.', 'One. On half a turn the series gives exactly one root.'),
    hint: [
      L('Seriyaning qadami yuz saksonga teng.', 'Шаг серии равен ста восьмидесяти.', 'The step of the series is one hundred eighty.'),
      L("Demak bunday oraliqqa bitta ildiz sig'adi.", 'Значит на таком промежутке помещается один корень.', 'So one root fits into such an interval.'),
      L('Bitta.', 'Один.', 'One.'),
    ],
    answer: '1',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Tangens ildizlarining yozuvi', 'Запись корней тангенса', 'The reading of tangent roots'),
  tag: 'tg-period-2pi',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', 'Chiziq yana bir bor buriladi, va qoida yonida ochiladi. Yuz sakson qadam yozuvning qisqartmasi emas, ikkala nuqta bitta kesish bergani.', 'Прямая поворачивается ещё раз, и правило открывается рядом. Шаг сто восемьдесят это не сокращение записи, а то, что обе точки дают одну отсечку.', 'The line turns once more, and the rule opens beside it. The step of one hundred eighty is not shorthand but the fact that both points give one mark.'),
  ],
  probe: {
    question: L('Nega tangensda qadam yuz sakson?', 'Почему у тангенса шаг сто восемьдесят?', 'Why is the tangent step one hundred eighty?'),
    items: [
      { id: 'a', label: L('qarama-qarshi nuqtalar bir qiymat beradi', 'противоположные точки дают одно значение', 'opposite points give the same value'), correct: true },
      { id: 'b', label: L('shunday yozish qisqaroq', 'так короче писать', 'it is shorter to write'), hint: L("Qisqaligi natija. Sabab ikkala nuqtaning kesishi bitta bo'lgani.", 'Короче это следствие. Причина в том, что отсечка у обеих точек одна.', 'Shortness is the consequence. The cause is that both points share one mark.') },
    ],
  },
  rule: {
    lawLabel: L('Tangens seriyasi', 'Серия тангенса', 'The tangent series'),
    lines: [
      L("Markazdan o'tgan chiziq ikkita qarama-qarshi nuqta beradi, ikkalasining tangensi bir xil.", 'Прямая через центр даёт две противоположные точки, и обе имеют один и тот же тангенс.', 'A line through the centre gives two opposite points, and both have the same tangent.'),
      L("Shuning uchun seriya bitta, qadami esa `180°`, ya'ni `π`.", 'Поэтому серия одна, а шаг у неё `180°`, то есть `π`.', 'So the series is single, and its step is `180°`, that is `π`.'),
      L("Qiymat har qanday bo'lishi mumkin, lekin `x = 90° + 180°n` da tangensning o'zi yo'q.", 'Значение может быть любым, но самого тангенса нет при `x = 90° + 180°n`.', 'The value may be any number, but the tangent itself does not exist at `x = 90° + 180°n`.'),
    ],
    law: 'x = arctg a + 180°n',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Tenglama va uning seriyasi', 'Уравнение и его серия', 'The equation and its series'),
  tag: 'tg-period-2pi',
  audio: [
    A('mount', "To'rt tenglama va to'rt yozuv. Ularni birlashtiring.", 'Четыре уравнения и четыре записи. Соедини их.', 'Four equations and four readings. Match them.'),
  ],
  match: {
    prompt: L("Tenglamani o'z yozuvi bilan birlashtiring.", 'Соедини уравнение с его записью.', 'Match the equation with its reading.'),
    ok: L("Tangensda qadam doim yuz sakson, faqat seriyaning boshi o'zgaradi.", 'У тангенса шаг всегда сто восемьдесят, меняется только начало серии.', 'For the tangent the step is always one hundred eighty, only the start of the series changes.'),
    left: ['tg x = 1', 'tg x = 0', 'tg x = −1', 'tg x = √3'],
    a: '45° + 180°n',
    b: '180°n',
    c: '−45° + 180°n',
    d: '60° + 180°n',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("Javobni qadam bilan yig'ing", 'Собери ответ по шагам', 'Assemble the answer step by step'),
  tag: 'seriya-bez-n',
  audio: [
    A('mount', "To'rtta qadam. Tartibini o'zingiz qo'yasiz.", 'Четыре шага. Порядок ставишь ты.', 'Four steps. You put them in order.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L('chiziqdagi qiymat', 'значение на линии', 'the value on the line'),
    s2: L('markazdan chiziq', 'прямая через центр', 'the line through the centre'),
    s3: L('oynadagi burchak', 'угол из окна', 'the angle from the window'),
    s4: L('qadam yuz sakson', 'шаг сто восемьдесят', 'the step one hundred eighty'),
    ok: L('Tartib doim shunday: avval chiziqdagi qiymat, keyin chiziq, keyin burchak, keyin qadam.', 'Порядок такой всегда: сначала значение на линии, потом прямая, потом угол, потом шаг.', 'The order is always this: the value on the line, then the line, then the angle, then the step.'),
    bad: L("Qiymatni belgilashdan boshlanadi, qadam esa oxirida qo'yiladi.", 'Начинают с отметки значения, а шаг ставят последним.', 'It starts with marking the value, and the step comes last.'),
    mark: '45°',
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
    ok: L("To'rt yuz besh. Qirq besh ustiga yuz saksondan ikki qadam.", 'Четыреста пять. Два шага по сто восемьдесят сверх сорока пяти.', 'Four hundred five. Two steps of one hundred eighty on top of forty five.'),
    hint: [
      L("Harf o'rniga ikkini qo'ying.", 'Подставь двойку вместо буквы.', 'Put two in place of the letter.'),
      L("Qirq besh qo'shilgan uch yuz oltmish.", 'Сорок пять плюс триста шестьдесят.', 'Forty five plus three hundred sixty.'),
      L("To'rt yuz besh.", 'Четыреста пять.', 'Four hundred five.'),
    ],
    prompt: '45° + 180°n,   n = 2   →   ?',
    answer: '405',
  },
  order: {
    prompt: L("O'sish tartibida joylashtiring.", 'Расставь по возрастанию.', 'Arrange in increasing order.'),
    title: L('Qaysi ildiz kichikroq?', 'Какой корень меньше?', 'Which root is smaller?'),
    ok: L("Siz raqamlarni qo'ydingiz va yozuvlarni emas, burchaklarni solishtirdingiz.", 'Ты подставил номера и сравнил углы, а не записи.', 'You substituted the numbers and compared angles, not readings.'),
    bad: L("Har yozuvga raqamini qo'ying va chiqqanini solishtiring.", 'Подставь в каждую запись её номер и сравни то, что получилось.', 'Put the number into each reading and compare the results.'),
    items: ['n = −1', 'n = 0', 'n = 1', 'n = 2'],
    answer: 'n = −1  n = 0  n = 1  n = 2',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L("Javob to'liq emas. Qayerda?", 'Ответ неполный. Где?', 'The answer is incomplete. Where?'),
  tag: 'check',
  audio: [
    A('mount', 'Masala. Tangens iks birga teng tenglamani yechish.', 'Задача. Решить уравнение тангенс икс равен единице.', 'A task. Solve the equation tangent x equals one.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L("Bu qator to'g'ri: birning arktangensi haqiqatan qirq beshga teng.", 'Эта строка верна: арктангенс единицы действительно равен сорока пяти.', 'This line is right: the arctangent of one really is forty five.'),
    r2: L("Bu qator ham to'g'ri: ikki yuz yigirma beshning tangensi o'sha.", 'Эта строка тоже верна: у двухсот двадцати пяти тангенс тот же.', 'This line is right too: at two hundred twenty five the tangent is the same.'),
    r4: L('Bu qator oldingisining xatosini takrorlaydi. Birinchi xato qator yuqorida.', 'Эта строка повторяет ошибку предыдущей. Первая неверная строка выше.', 'This line repeats the error of the previous one. The first wrong line is above.'),
  },
  proof: L("To'liq aylana qadami bilan ikkinchi nuqta tushib qoladi.", 'С шагом в полный оборот вторая точка выпадает.', 'With a full-turn step the second point drops out.'),
  entry: {
    prompt: L('Tangens seriyasining qadami qancha?', 'Чему равен шаг серии у тангенса?', 'What is the step of the tangent series?'),
    ok: L('Yuz sakson. Qarama-qarshi nuqtalar bir qiymat beradi, ular orasida yarim aylana.', 'Сто восемьдесят. Противоположные точки дают одно значение, и между ними половина оборота.', 'One hundred eighty. Opposite points give the same value, half a turn apart.'),
    hint: [
      L('Kesish necha gradusdan keyin takrorlanishiga qarang.', 'Посмотри, через сколько повторяется отсечка.', 'Look after how much the mark repeats.'),
      L('Nuqtalar markazning ikki tomonida turadi.', 'Точки стоят по разные стороны от центра.', 'The points stand on opposite sides of the centre.'),
      L('Yuz sakson.', 'Сто восемьдесят.', 'One hundred eighty.'),
    ],
    answer: '180',
  },
  row: {
    r1: 'arctg 1 = 45°',
    r2: 'tg 225° = 1',
    r3: 'x = 45° + 360°n',
    r4: 'n = 1   →   405°',
  },
  answerId: 'r3',
}

const S13 = {
  role: 'transfer',
  answer: 'lead',
  format: 'place+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Ildizdan seriyani aytish', 'По корню назвать серию', 'From a root back to its series'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Endi teskari masala. Nuqta berilgan, o'sha tangensli hamma burchak kerak.", 'Теперь обратная задача. Дана точка, а нужны все углы с тем же тангенсом.', 'Now the inverse task. A point is given, and all angles with the same tangent are needed.'),
    A('work', "Nuqtani qo'ying, keyin o'sha tangensli hamma yozuvni belgilaysiz.", 'Поставь точку, потом отметишь все записи с тем же тангенсом.', 'Place the point, then you will mark every reading with the same tangent.'),
  ],
  multi: {
    prompt: L("O'sha tangensli hamma yozuvni belgilang.", 'Отметь все записи с тем же тангенсом.', 'Mark every reading with the same tangent.'),
    title: L("Qaysi burchaklarda tangens o'sha?", 'У каких углов тангенс такой же?', 'Which angles have the same tangent?'),
    ok: L('Beshtadan uchtasi. Ularning hammasi butun sondagi yarim aylanaga farq qiladi.', 'Три из пяти. Все они отличаются целым числом половин оборота.', 'Three out of five. All of them differ by a whole number of half-turns.'),
    items: [
      { id: 'd', label: '135°', hint: L("Yuz o'ttiz beshda tangens minus bir: koordinatalar ishorasi har xil.", 'У ста тридцати пяти тангенс минус единица: знаки координат разные.', 'At one hundred thirty five the tangent is minus one: the signs of the coordinates differ.') },
      { id: 'e', label: '90°', hint: L("To'qsonda tangens umuman yo'q.", 'У девяноста тангенса нет вовсе.', 'At ninety the tangent does not exist at all.') },
      { id: 'a', label: '45°', ok: true },
      { id: 'b', label: '405°', ok: true },
      { id: 'c', label: '−135°', ok: true },
    ],
  },
  place: {
    prompt: L("Nuqtani 225 gradusga qo'ying.", 'Поставь точку на 225 градусов.', 'Place the point at 225 degrees.'),
    ok: L("Bu qarama-qarshi nuqta. Uning tangensi o'sha, seriyasi ham umumiy.", 'Это противоположная точка. Тангенс у неё тот же, и серия у них общая.', 'This is the opposite point. Its tangent is the same, and they share one series.'),
    wrong: L('Ikki yuz yigirma besh bu aylananing chap past qismi.', 'Двести двадцать пять это левая нижняя часть окружности.', 'Two hundred twenty five is the lower left part of the circle.'),
    target: '225°',
    step: '45° + 180°n',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'tg-period-2pi',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Tangens seriyasining qadami qancha?', 'Чему равен шаг серии у тангенса?', 'What is the step of the tangent series?'),
      done: '180°n',
      items: [
        { id: 'a', label: L('yuz sakson', 'сто восемьдесят', 'one hundred eighty'), correct: true },
        { id: 'b', label: L('uch yuz oltmish', 'триста шестьдесят', 'three hundred sixty'), hint: L('Uch yuz oltmish bu sinus va kosinusdagi qadam.', 'Триста шестьдесят это шаг у синуса и косинуса.', 'Three hundred sixty is the step of the sine and the cosine.') },
        { id: 'c', label: L("to'qson", 'девяносто', 'ninety'), hint: L("To'qsondan keyin nisbat o'zgaradi, takrorlanmaydi.", 'Через девяносто отношение меняется, а не повторяется.', 'After ninety the ratio changes, it does not repeat.') },
        { id: 'd', label: L("qiymatga bog'liq", 'зависит от значения', 'it depends on the value'), hint: L("Qiymat qanday bo'lishidan qat'i nazar qadam doim bir xil.", 'Шаг всегда один и тот же, каким бы ни было значение.', 'The step is always the same whatever the value.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Tangensli tenglamada nechta seriya bor?', 'Сколько серий у уравнения с тангенсом?', 'How many series does a tangent equation have?'),
      done: '1',
      items: [
        { id: 'a', label: L('bitta', 'одна', 'one'), correct: true },
        { id: 'b', label: L('ikkita', 'две', 'two'), hint: L('Ikkita sinusda edi, u yerda nuqtalar har xil qiymat berardi.', 'Две были у синуса, там точки давали разные значения.', 'Two happened for the sine, where the points gave different values.') },
        { id: 'c', label: L("to'rtta", 'четыре', 'four'), hint: L('Kesishish nuqtasi jami ikkita, va ikkalasi bir qiymat beradi.', 'Точек пересечения всего две, и обе дают одно значение.', 'There are only two points, and both give one value.') },
        { id: 'd', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Ildiz cheksiz ko'p, seriya esa bitta.", 'Корней бесконечно много, а серия одна.', 'There are infinitely many roots, but one series.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Qaysi burchakda tangens yo'q?", 'При каком угле тангенса нет?', 'At which angle does the tangent not exist?'),
      done: 'x = 90° + 180°n',
      items: [
        { id: 'a', label: L("to'qsonda", 'при девяноста', 'at ninety'), correct: true, ok: L("Ha. U yerda siljish nolga teng, bo'lib bo'lmaydi.", 'Да. Там сдвиг равен нулю, и делить нельзя.', 'Yes. There the shift is zero, and division is impossible.') },
        { id: 'b', label: L('nolda', 'при нуле', 'at zero'), hint: L('Nolda tangens bor va nolga teng.', 'При нуле тангенс есть и равен нулю.', 'At zero the tangent exists and equals zero.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('tg x = 5 ning nechta ildizi bor?', 'Сколько корней у tg x = 5?', 'How many roots does tg x = 5 have?'),
      done: '∞',
      items: [
        { id: 'a', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), correct: true },
        { id: 'b', label: L('hech qaysi', 'ни одного', 'none'), hint: L("Tangenslar chizig'i chekkasiz, besh unda bor.", 'Линия тангенсов без краёв, пятёрка на ней есть.', 'The line of tangents has no edges, five is on it.') },
        { id: 'c', label: L('bitta', 'один', 'one'), hint: L("Yarim aylana oraliqda bitta, jami esa cheksiz ko'p.", 'Один на промежутке в половину оборота, а всего бесконечно много.', 'One on a half-turn interval, but infinitely many in total.') },
        { id: 'd', label: L('ikkita', 'два', 'two'), hint: L("Ikkita sinusda bo'lardi, u yerda seriya ikkita.", 'Два было бы у синуса, там серий две.', 'Two would happen for the sine, where there are two series.') },
      ],
    },
  ],
  angles: ['45°', '225°', '90°', '60°'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  audio: [
    A('mount', 'Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija.', 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
    A('next', 'Tangens yarim aylanadan keyin takrorlanadi, chunki qarama-qarshi nuqtalar bitta kesish beradi.', 'Тангенс повторяется через половину оборота, потому что противоположные точки дают одну отсечку.', 'The tangent repeats after half a turn because opposite points give one mark.'),
  ],
  can: [
    L("Tangensni tangenslar chizig'idan o'qiyman", 'Читаю тангенс по линии тангенсов', 'I read the tangent off the line of tangents'),
    L('Nega seriya bitta ekanini bilaman', 'Знаю, почему серия одна', 'I know why the series is single'),
    L('Qadam yarim aylanaga tengligini eslayman', 'Помню, что шаг равен половине оборота', 'I remember the step is half a turn'),
    L("Tangens qayerda yo'qligini bilaman", 'Знаю, где тангенса нет', 'I know where the tangent does not exist'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L('Bitta joy takrorlashni talab qiladi: qadam qanchaga teng.', 'Одно место требует повтора: чему равен шаг.', 'One place needs review: what the step equals.'),
    back: L('Qoidaga va 4-ekranga qayting.', 'Вернись к правилу и к экрану 4.', 'Go back to the rule and to screen 4.'),
  },
  bridge: L('13-dars: avval soddaga keltiriladigan murakkabroq tenglamalar.', 'Урок 13: уравнения посложнее, которые сначала приводят к простейшим.', 'Lesson 13: harder equations, first reduced to the simplest ones.'),
  lifehack: L("Nuqtalar qarama-qarshi bo'lsa, qiymatlari faqat tangensda mos keladi.", 'Если точки противоположны, значения у них совпадают только у тангенса.', 'When the points are opposite, their values coincide only for the tangent.'),
  sheetTitle: L('Tangens · shpargalka', 'Тангенс · шпаргалка', 'The tangent · cheat sheet'),
  sheetSrc: L('10-sinf · 12-dars', '10 класс · урок 12', 'Grade 10 · lesson 12'),
  hook: {
    a: '360°n',
    b: '180°n',
  },
  proved: '45° + 180°n',
  law: 'x = arctg a + 180°n',
  sheet: [
    'x = arctg a + 180°n',
    'tg x = 1   →   45° + 180°n',
    'tg x = 0   →   180°n',
    'x ≠ 90° + 180°n',
    'arctg a ∈ (−90°; 90°)',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

// Число и градус из контента: минус там типографский, `parseInt` его не понимает.
const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))
const deg = (s) => parseInt(String(s).replace(/−/g, '-'), 10)

// Соответствие «номер — угол». Обе стороны формулы, переводить нечего.
const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const EQ_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const EQ_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})
// Отметки при неверной паре: две противоположные точки одной прямой.
const EQ_MARKS = [
  { deg: 45, tone: 'graph', label: '45°' },
  { deg: 225, tone: 'ink3', label: '225°' },
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
        // Прямая поворачивается уже на хуке: отсечка остаётся на месте до
        // того, как это названо. Прогноз делается при полной картине.
        fig={() => <Scene fig={<TanLine step={2} deg={45} />} max={172} h={172} />}
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
        fig={<TanLine step={phase} deg={45} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S3.work.prompt}
        test={(c, s) => c > 0.5 && s > 0.5}
        hints={[
          { when: (c, s) => s < 0, text: S3.work.hint[0] },
          { when: (c) => c < 0, text: S3.work.hint[1] },
          { when: () => true, text: S3.work.hint[2] },
        ]}
        okText={S3.work.ok}
        snap={[45]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      /* Свидетель урока: точка уезжает на пол-оборота, отсечка остаётся на
         месте. Прямая нарисована ЦЕЛИКОМ через центр, поэтому видно, откуда
         отсечка берётся при любом положении точки. */
      <Scene
        fig={<TanLine step={phase + 1} deg={45} />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S4.work.prompt}
        test={(c, s) => c < -0.5 && s < -0.5}
        hints={[
          { when: (c, s) => s > 0, text: S4.work.hint[0] },
          { when: (c) => c > 0, text: S4.work.hint[1] },
          { when: () => true, text: S4.work.hint[2] },
        ]}
        okText={S4.work.ok}
        snap={[225]}
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
        fig={<TanLine step={2} deg={45} />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S5.work.prompt}
        test={(c, s) => c > 0.5 && s > 0.5}
        hints={[
          { when: (c) => c < 0, text: S5.work.hint[0] },
          { when: (c, s) => s < 0, text: S5.work.hint[1] },
          { when: () => true, text: S5.work.hint[2] },
        ]}
        okText={S5.work.ok}
        snap={[45]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      /* Вертикаль КАСАЕТСЯ правого края: верх и низ совпали в одну точку. */
      <Scene
        fig={<TanLine step={phase >= 1 ? 1 : 0} deg={63} />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<TanLine step={1} deg={63} />} max={300} />
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
      /* Вертикаль остановилась ПРАВЕЕ окружности и осталась видимой. */
      <Scene
        fig={<TanLine step={phase >= 1 ? 1 : 0} deg={85} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<TanLine step={1} deg={85} />} max={300} />
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
        fig={(solved) => <Scene fig={<TanLine step={solved ? 2 : 0} deg={45} />} max={330} />}
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
        marks={EQ_MARKS}
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
