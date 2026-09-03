// ============================================================================
// 10-sinf, Dars 12. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS12_KONTENT.md
// Ma'lumot mashina bilan yig'ilgan, ekran tanalari qo'lda yozilgan (etalon
// §5.3). Matn o'zgarsa: kontentni to'g'rilash va qayta yig'ish (kalitsiz),
// tanalar joyida qoladi. Keyin `node scripts/grade10-check.mjs dars11`.
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
// Вертикаль вместо горизонтали и зеркало по горизонтальной оси: обе фигуры
// уже есть в классе, новых для этого урока не понадобилось.
import { LevelLine, MirrorAxis, SeriesTicks } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 12
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. cos x = a`,
  `Урок ${LESSON_NO}. cos x = a`,
  `Lesson ${LESSON_NO}. cos x = a`,
)

const BLOCK = { label: 'B2', from: 9, to: 14, current: 12 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('KOSINUS', 'КОСИНУС', 'THE COSINE'),
  title: L("Kosinus uchun qaysi yozuv to'g'ri?", 'Какая запись верна для косинуса?', 'Which reading is right for the cosine?'),
  motion: ['mount'],
  audio: [
    A('mount', "Vertikal to'g'ri chiziq bir ikkidan siljishga tushadi va aylanani ikki nuqtada kesadi.", 'Вертикальная прямая опускается на сдвиг одна вторая и задевает окружность в двух точках.', 'The vertical line moves to the shift one half and meets the circle at two points.'),
    A('r1', "Birinchi yozuv burchak oldiga plyus-minus ishorasini qo'yadi.", 'Первая запись ставит перед углом знак плюс-минус.', 'The first reading puts a plus-minus sign before the angle.'),
    A('r2', "Ikkinchisi sinusdagidek darajali ko'paytuvchini oladi.", 'Вторая берёт множитель со степенью, как у синуса.', 'The second takes a factor with a power, as for the sine.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi nuqtalar qayerda turishini ko'ramiz.", 'Твой ответ записан. Сейчас посмотрим, где стоят точки.', 'Your answer is saved. Now we will look at where the points stand.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first'), correct: true },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second') },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('plyus-minus ishora', 'знак плюс-минус', 'a plus-minus sign'),
      value: 'x = ± 60° + 360°n',
    },
    b: {
      name: L("darajali ko'paytuvchi", 'множитель со степенью', 'a factor with a power'),
      value: 'x = (−1)ⁿ·60° + 180°n',
    },
  },
  expr: 'cos x = 1/2',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Kosinusdan oldin uch savol', 'Три вопроса перед косинусом', 'Three questions before the cosine'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Kosinusli tenglama uchun qanday to'g'ri chiziq kerak?", 'Какая прямая нужна для уравнения с косинусом?', 'Which line is needed for an equation with the cosine?'),
      done: 'x = a',
      items: [
        { id: 'a', label: L('vertikal', 'вертикальная', 'a vertical one'), correct: true },
        { id: 'b', label: L('gorizontal', 'горизонтальная', 'a horizontal one'), hint: L("Gorizontal balandlikni, ya'ni sinusni beradi.", 'Горизонтальная задаёт высоту, то есть синус.', 'A horizontal line sets the height, that is the sine.') },
        { id: 'c', label: L('qiya', 'наклонная', 'a slanted one'), hint: L('Qiya chiziq hech qaysi koordinataga mos kelmaydi.', 'Наклонная не отвечает ни одной координате.', 'A slanted line matches no coordinate.') },
        { id: 'd', label: L('hech qanday', 'никакая', 'none at all'), hint: L("To'g'ri chiziq kerak: usiz nuqtalarni topib bo'lmaydi.", 'Прямая нужна: без неё точки не найти.', 'A line is needed: without it the points cannot be found.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Arkkosinusning oynasi qanday?', 'Какое окно у арккосинуса?', 'What is the window of the arccosine?'),
      done: 'arccos a ∈ [0°; 180°]',
      items: [
        { id: 'a', label: L('noldan yuz saksongacha', 'от нуля до ста восьмидесяти', 'from zero to one hundred eighty'), correct: true },
        { id: 'b', label: L("minus to'qsondan to'qsongacha", 'от минус девяноста до девяноста', 'from minus ninety to ninety'), hint: L('Bu arksinusning oynasi, arkkosinusniki boshqa.', 'Это окно арксинуса, у арккосинуса оно другое.', 'That is the arcsine window, the arccosine has a different one.') },
        { id: 'c', label: L("noldan to'qsongacha", 'от нуля до девяноста', 'from zero to ninety'), hint: L('Unda kosinusning manfiy qiymatlari javobsiz qolardi.', 'Тогда отрицательные значения косинуса остались бы без ответа.', 'Then negative values of the cosine would have no answer.') },
        { id: 'd', label: L('butun aylana', 'вся окружность', 'the whole circle'), hint: L("Unda javob ro'yxat bo'lardi, bizga esa bitta burchak kerak.", 'Тогда ответом был бы список, а нужен один угол.', 'Then the answer would be a list, and one angle is needed.') },
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
  title: L('Vertikal chiziq ikkita nuqta beradi', 'Вертикаль даёт две точки', 'The vertical gives two points'),
  tag: 'odin-koren',
  show: [
    [
      L('siljish berilgan', 'сдвиг задан', 'the shift is given'),
      L("to'g'ri chiziq vertikal ketadi", 'прямая идёт вертикально', 'the line runs vertically'),
    ],
    [
      L('nuqta ikkita', 'точек две', 'there are two points'),
      L('biri yuqorida, ikkinchisi pastda', 'одна сверху, другая снизу', 'one above, one below'),
    ],
  ],
  motion: ['cut'],
  audio: [
    A('mount', "Kosinusli tenglamada siljish berilgan, shuning uchun to'g'ri chiziq vertikal.", 'В уравнении с косинусом задан сдвиг, поэтому прямая вертикальная.', 'In an equation with the cosine the shift is given, so the line is vertical.'),
    A('cut', "To'g'ri chiziq joyiga tushadi va aylanani ikki nuqtada kesadi. Biri yuqorida, ikkinchisi pastda, siljishlari esa bir xil: oltmish gradus va minus oltmish.", 'Прямая садится на место и задевает окружность в двух точках. Одна сверху, другая снизу, и сдвиг у них одинаковый: шестьдесят градусов и минус шестьдесят.', 'The line settles and meets the circle at two points. One above, one below, with the same shift: sixty degrees and minus sixty.'),
    A('work', "Endi o'zingiz. Ulardan ikkinchisiga, pastdagisiga nuqta qo'ying.", 'Теперь сам. Поставь точку во вторую из них, ту, что снизу.', 'Now you. Place the point at the second of them, the one below.'),
  ],
  work: {
    prompt: L("Ikkinchi ildizga, pastdagisiga nuqta qo'ying.", 'Поставь точку во второй корень, тот, что снизу.', 'Place the point at the second root, the one below.'),
    ok: L("Minus oltmish gradus, ya'ni uch yuz. Siljish o'sha, demak tenglik to'g'ri.", 'Минус шестьдесят градусов, то есть триста. Сдвиг тот же, значит равенство верное.', 'Minus sixty degrees, that is three hundred. The same shift, so the equality holds.'),
    hint: [
      L("O'sha vertikaldagi ikkinchi nuqta kerak.", 'Нужна вторая точка на той же вертикали.', 'You need the second point on the same vertical.'),
      L("U gorizontal o'qdan pastda, o'ngda.", 'Она ниже горизонтальной оси, справа.', 'It is below the horizontal axis, on the right.'),
      L('Uch yuz gradus.', 'Триста градусов.', 'Three hundred degrees.'),
    ],
  },
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Nuqtalarning burchaklari qarama-qarshi', 'Углы у точек противоположны', 'The angles of the points are opposite'),
  tag: 'odin-koren',
  show: [
    [
      L("gorizontal o'q bo'yicha ko'zgu", 'зеркало по горизонтальной оси', 'a mirror along the horizontal axis'),
      L('ikkalasining siljishi bir xil', 'сдвиг у обеих одинаковый', 'both have the same shift'),
    ],
    [
      L('burchaklar ishora bilan farq qiladi', 'углы отличаются знаком', 'the angles differ by a sign'),
      L('oltmish va minus oltmish', 'шестьдесят и минус шестьдесят', 'sixty and minus sixty'),
    ],
  ],
  motion: ['mirror'],
  audio: [
    A('mount', 'Bu ikki nuqtaga diqqat bilan qaraymiz.', 'Посмотрим на эти две точки внимательнее.', 'Let us look at these two points more closely.'),
    A('mirror', "Pastki nuqta yuqoridagisining gorizontal o'q bo'yicha aksi. Bu beshinchi darsda edi: ko'zgu balandlik ishorasini almashtiradi, siljishni esa qoldiradi. Demak uning burchagi o'sha, lekin minus ishora bilan.", 'Нижняя точка это отражение верхней по горизонтальной оси. Это было на пятом уроке: зеркало меняет знак высоты, а сдвиг оставляет. Значит угол у неё тот же, но со знаком минус.', 'The lower point is the reflection of the upper one across the horizontal axis. That was in lesson five: the mirror flips the sign of the height and leaves the shift. So its angle is the same but with a minus.'),
    A('work', "Endi o'zingiz. Minus oltmish gradus olib keladigan joyga nuqta qo'ying.", 'Теперь сам. Поставь точку туда, куда приведёт минус шестьдесят градусов.', 'Now you. Place the point where minus sixty degrees leads.'),
  ],
  work: {
    prompt: L('−60° burchak qayerga olib keladi?', 'Куда приведёт угол −60°?', 'Where does the angle −60° lead?'),
    ok: L("Pastki nuqtaga. Bu o'sha ildiz, faqat manfiy burish bilan yozilgan.", 'В нижнюю точку. Это тот же корень, просто записанный отрицательным поворотом.', 'To the lower point. It is the same root, just written as a negative turn.'),
    hint: [
      L("Manfiy burish soat mili bo'ylab boradi.", 'Отрицательный поворот идёт по часовой стрелке.', 'A negative turn goes clockwise.'),
      L("Soat mili bo'ylab oltmish gradus bu o'ng past qism.", 'Шестьдесят градусов по часовой это правая нижняя часть.', 'Sixty degrees clockwise is the lower right part.'),
      L('Uch yuz gradus.', 'Триста градусов.', 'Three hundred degrees.'),
    ],
  },
}

const S5 = {
  role: 'explain3',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Plyus-minus ishorali bitta yozuv', 'Одна запись со знаком плюс-минус', 'One reading with a plus-minus sign'),
  tag: 'seriya-bez-n',
  show: [
    [
      L('ikki burchak ishora bilan farq qiladi', 'два угла отличаются знаком', 'the two angles differ by a sign'),
      L('demak plyus-minus ishora yetadi', 'значит хватает знака плюс-минус', 'so a plus-minus sign is enough'),
    ],
    [
      L("har biriga aylanalar qo'shiladi", 'к каждому прибавляются обороты', 'turns are added to each'),
      L("qadam to'liq aylana bo'lib qoldi", 'шаг остался полным оборотом', 'the step stayed a full turn'),
    ],
  ],
  motion: ['join'],
  audio: [
    A('mount', 'Nuqtalarning burchaklari faqat ishora bilan farq qiladi, va bu ularni birga yozishga imkon beradi.', 'Углы у точек отличаются только знаком, и это позволяет записать их вместе.', 'The angles differ only by a sign, and that lets us write them together.'),
    A('join', "Plyus-minus oltmish gradus qo'shilgan uch yuz oltmish karra en deb yozamiz. Plyus yuqoridagi nuqtani, minus pastdagisini beradi, aylanalar esa har biriga qo'shiladi. Sinusda yig'ish uzunroq edi, chunki u yerda burchaklar ishora bilan bog'lanmagan.", 'Пишем плюс-минус шестьдесят градусов плюс триста шестьдесят умножить на эн. Плюс даёт верхнюю точку, минус нижнюю, а обороты добавляются к каждой. У синуса склейка была длиннее, потому что там углы знаком не связаны.', 'We write plus-minus sixty degrees plus three hundred sixty times n. The plus gives the upper point, the minus the lower, and the turns add to each. For the sine the folding was longer because there the angles are not related by a sign.'),
    A('work', "Endi o'zingiz. Plyus va bir raqamli yozuv olib keladigan joyga nuqta qo'ying.", 'Теперь сам. Поставь точку туда, куда приведёт запись с плюсом и номером один.', 'Now you. Place the point where the reading with a plus and the number one leads.'),
  ],
  work: {
    prompt: L('`+60° + 360°` qayerga olib keladi?', 'Куда приведёт `+60° + 360°`?', 'Where does `+60° + 360°` lead?'),
    ok: L("Yuqoridagi nuqtaga. To'liq aylana hech narsani o'zgartirmaydi.", 'В верхнюю точку. Полный оборот ничего не меняет.', 'To the upper point. A full turn changes nothing.'),
    hint: [
      L("To'liq aylanani tashlang.", 'Отбрось полный оборот.', 'Drop the full turn.'),
      L('Oltmish gradus qoladi.', 'Останется шестьдесят градусов.', 'Sixty degrees is left.'),
      L('Oltmish gradus.', 'Шестьдесят градусов.', 'Sixty degrees.'),
    ],
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Nuqta bitta bo'lganda", 'Когда точка одна', 'When there is only one point'),
  tag: 'odin-koren',
  show: [
    [
      L('siljish birga teng', 'сдвиг равен единице', 'the shift equals one'),
      L('vertikal chiziq chetiga tegadi', 'вертикаль касается края', 'the vertical touches the edge'),
    ],
    [
      L('nuqta jami bitta', 'точка всего одна', 'there is only one point'),
      L('plyus-minus ishora kerak emas', 'знак плюс-минус не нужен', 'the plus-minus sign is not needed'),
    ],
  ],
  motion: ['touch'],
  audio: [
    A('mount', "Birga teng siljishni olaylik. Vertikal chiziq o'ng chetda turadi.", 'Возьмём сдвиг, равный единице. Вертикаль стоит у правого края.', 'Take the shift equal to one. The vertical stands at the right edge.'),
    A('touch', "U aylanaga bir nuqtada tegadi, kesib o'tmaydi. Yuqori va past ustma-ust tushdi, va plyus-minus ishora bu yerda hech narsa qo'shmaydi.", 'Она касается окружности в одной точке, а не пересекает её. Верх и низ совпали, и знак плюс-минус здесь ничего не добавляет.', 'It touches the circle at one point instead of crossing it. The top and the bottom coincided, and the plus-minus sign adds nothing here.'),
    A('work', "O'zingiz hisoblang. Kosinus iks birga teng tenglamaning javobida nechta seriya bor?", 'Посчитай сам. Сколько серий в ответе уравнения косинус икс равен единице?', 'Compute it yourself. How many series are in the answer of cosine x equals one?'),
  ],
  work: {
    prompt: L('cos x = 1 da nechta seriya bor?', 'Сколько серий у cos x = 1?', 'How many series does cos x = 1 have?'),
    ok: L("Bitta. Nuqta jami bitta, va u to'liq aylanadan keyin takrorlanadi.", 'Одна. Точка всего одна, и повторяется она через полный оборот.', 'One. There is a single point, and it repeats after a full turn.'),
    hint: [
      L('Vertikal chiziq aylanani uchratgan nuqtalarni sanang.', 'Посчитай точки, где вертикаль встретила окружность.', 'Count the points where the vertical met the circle.'),
      L('U tegdi, kesmadi.', 'Она коснулась, а не пересекла.', 'It touched instead of crossing.'),
      L('Bitta.', 'Одна.', 'One.'),
    ],
    answer: '1',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Vertikal chiziq ham yonidan o'tishi mumkin", 'Вертикаль тоже может пройти мимо', 'The vertical can also miss'),
  tag: 'net-resheniy',
  show: [
    [
      L('siljish ikki', 'сдвиг два', 'the shift is two'),
      L("vertikal chiziq aylanadan o'ngda", 'вертикаль правее окружности', 'the vertical is right of the circle'),
    ],
    [
      L("umumiy nuqta yo'q", 'общих точек нет', 'there are no common points'),
      L("demak ildiz ham yo'q", 'значит нет и корней', 'so there are no roots'),
    ],
  ],
  motion: ['miss'],
  audio: [
    A('mount', "Kosinus iks ikkiga teng tenglamani olaylik. Vertikal chiziq aylanadan o'ngda turadi.", 'Возьмём уравнение косинус икс равен двум. Вертикаль стоит правее окружности.', 'Take the equation cosine x equals two. The vertical stands to the right of the circle.'),
    A('miss', "U yonidan o'tadi va aylanaga bir marta ham tegmaydi. Birdan katta siljish aylanada uchramaydi, demak ildiz yo'q.", 'Она проходит мимо и ни разу не задевает круг. Сдвиг больше единицы на окружности не встречается, значит корней нет.', 'It passes by and never touches the circle. A shift greater than one never occurs on the circle, so there are no roots.'),
    A('work', "O'zingiz hisoblang. Kosinus iks ikkiga teng tenglamaning nechta ildizi bor?", 'Посчитай сам. Сколько корней у уравнения косинус икс равен двум?', 'Compute it yourself. How many roots does cosine x equals two have?'),
  ],
  work: {
    prompt: L('cos x = 2 ning nechta ildizi bor?', 'Сколько корней у cos x = 2?', 'How many roots does cos x = 2 have?'),
    ok: L("Nol. Birdan katta siljish aylanada hech qanday burchakda bo'lmaydi.", 'Ноль. Сдвиг больше единицы на окружности не бывает ни при каком угле.', 'Zero. A shift greater than one never happens on the circle at any angle.'),
    hint: [
      L('Vertikal chiziq aylanaga tegdimi, qarang.', 'Посмотри, задела ли вертикаль окружность.', 'Look whether the vertical touched the circle.'),
      L("U o'ngdan o'tdi, umumiy nuqta yo'q.", 'Она прошла правее, общих точек нет.', 'It passed to the right, there are no common points.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Kosinus uchun umumiy yozuv', 'Общая запись для косинуса', 'The joint reading for the cosine'),
  tag: 'seriya-bez-n',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Ko'zgu yana bir bor ishlaydi, va qoida yonida ochiladi. Plyus-minus ishora yozuvning qisqartmasi emas, nuqtalar bir-birining ostida turgani.", 'Зеркало срабатывает ещё раз, и правило открывается рядом. Знак плюс-минус это не сокращение записи, а то, что точки стоят одна под другой.', 'The mirror works once more, and the rule opens beside it. The plus-minus sign is not shorthand but the fact that the points stand one below the other.'),
  ],
  probe: {
    question: L("Nega kosinusda ko'paytuvchi emas, plyus-minus ishora?", 'Почему у косинуса знак плюс-минус, а не множитель?', 'Why does the cosine take a plus-minus sign and not a factor?'),
    items: [
      { id: 'a', label: L("nuqtalar gorizontal o'q bo'yicha simmetrik", 'точки симметричны по горизонтальной оси', 'the points are symmetric across the horizontal axis'), correct: true },
      { id: 'b', label: L('shunday yozish qisqaroq', 'так короче записывать', 'it is shorter to write'), hint: L('Qisqaligi natija, sabab esa nuqtalar qayerda turishida.', 'Короче это следствие, а причина в том, где стоят точки.', 'Shortness is the consequence, the cause is where the points stand.') },
    ],
  },
  rule: {
    lawLabel: L("Yig'ish", 'Склейка', 'The folding'),
    lines: [
      L("Kosinusda nuqtalar gorizontal o'qqa nisbatan simmetrik, shuning uchun burchaklari faqat ishora bilan farq qiladi.", 'У косинуса точки симметричны относительно горизонтальной оси, поэтому их углы отличаются только знаком.', 'For the cosine the points are symmetric across the horizontal axis, so their angles differ only by a sign.'),
      L("Shuning uchun plyus-minus ishora yetadi, qadam esa to'liq aylana bo'lib qoladi.", 'Поэтому хватает знака плюс-минус, а шаг остаётся полным оборотом.', 'So a plus-minus sign is enough, and the step stays a full turn.'),
      L('Tenglama faqat `−1 ≤ a ≤ 1` da yechiladi.', 'Уравнение решается только при `−1 ≤ a ≤ 1`.', 'The equation is solvable only for `−1 ≤ a ≤ 1`.'),
    ],
    law: 'x = ± arccos a + 360°n',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Tenglama va uning seriyasi', 'Уравнение и его серия', 'The equation and its series'),
  tag: 'seriya-bez-n',
  audio: [
    A('mount', "To'rt tenglama va to'rt yozuv. Ularni birlashtiring.", 'Четыре уравнения и четыре записи. Соедини их.', 'Four equations and four readings. Match them.'),
  ],
  match: {
    prompt: L("Tenglamani o'z yozuvi bilan birlashtiring.", 'Соедини уравнение с его записью.', 'Match the equation with its reading.'),
    ok: L("Chetda plyus-minus ishora hech narsa qo'shmaydi: u yerda nuqta bitta. O'rtada nuqta ikkita, va ishora kerak.", 'У края знак плюс-минус ничего не добавляет: там точка одна. В середине точек две, и знак нужен.', 'At the edge the plus-minus sign adds nothing: there is one point there. In the middle there are two points, and the sign is needed.'),
    left: ['cos x = 1/2', 'cos x = 1', 'cos x = −1', 'cos x = 0'],
    a: '± 60° + 360°n',
    b: '360°n',
    c: '180° + 360°n',
    d: '± 90° + 360°n',
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
    s1: L("vertikal chiziq o'tkazamiz", 'проводим вертикаль', 'we draw the vertical'),
    s2: L('oynadagi burchakni topamiz', 'находим угол в окне', 'we find the angle in the window'),
    s3: L("plyus-minus ishorani qo'yamiz", 'ставим знак плюс-минус', 'we put the plus-minus sign'),
    s4: L("aylanalarni qo'shamiz", 'прибавляем обороты', 'we add the turns'),
    ok: L("Tartib doim shunday. Ishorani burchak topilmasdan qo'ysak, uni qo'yadigan joy bo'lmaydi.", 'Порядок такой всегда. Если поставить знак раньше, чем найден угол, знак будет некуда ставить.', 'The order is always this. Putting the sign before the angle is found leaves the sign nowhere to go.'),
    bad: L('Avval vertikal chiziq, keyin oynadagi burchak, keyin ishora, keyingina aylanalar.', 'Сначала вертикаль, потом угол из окна, потом знак, и только потом обороты.', 'First the vertical, then the angle from the window, then the sign, and only then the turns.'),
    mark: '60°',
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
    ok: L("To'rt yuz yigirma. Plyus ishora va oltmish ustiga bitta to'liq aylana.", 'Четыреста двадцать. Знак плюс и один полный оборот сверх шестидесяти.', 'Four hundred twenty. A plus sign and one full turn on top of sixty.'),
    hint: [
      L("Plyus ishorani oling va birni qo'ying.", 'Возьми знак плюс и подставь единицу.', 'Take the plus sign and substitute one.'),
      L("Oltmish qo'shilgan uch yuz oltmish.", 'Шестьдесят плюс триста шестьдесят.', 'Sixty plus three hundred sixty.'),
      L("To'rt yuz yigirma.", 'Четыреста двадцать.', 'Four hundred twenty.'),
    ],
    prompt: '+60° + 360°n,   n = 1   →   ?',
    answer: '420',
  },
  order: {
    prompt: L("O'sish tartibida joylashtiring.", 'Расставь по возрастанию.', 'Arrange in increasing order.'),
    title: L('Qaysi ildiz kichikroq?', 'Какой корень меньше?', 'Which root is smaller?'),
    ok: L("Siz ishora va raqamni qo'ydingiz va yozuvlarni emas, sonlarni solishtirdingiz.", 'Ты подставил знак и номер и сравнил числа, а не записи.', 'You substituted the sign and the number and compared numbers, not readings.'),
    bad: L("Har yozuvga ishora va raqamini qo'ying, keyin solishtiring.", 'Подставь в каждую запись её знак и номер, потом сравни.', 'Put the sign and the number into each reading, then compare.'),
    items: ['−60°', '60°', '300°', '420°'],
    answer: '−60°  60°  300°  420°',
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
    A('mount', 'Masala. Kosinus iks bir ikkidanga teng tenglamani yechish.', 'Задача. Решить уравнение косинус икс равен одной второй.', 'A task. Solve the equation cosine x equals one half.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L("Bu qator to'g'ri: bir ikkidanning arkkosinusi haqiqatan oltmishga teng.", 'Эта строка верна: арккосинус одной второй действительно равен шестидесяти.', 'This line is right: the arccosine of one half really is sixty.'),
    r2: L("Bu qator ham to'g'ri: minus oltmishning siljishi ham o'sha.", 'Эта строка тоже верна: у минус шестидесяти сдвиг такой же.', 'This line is right too: at minus sixty the shift is the same.'),
    r4: L('Bu qator oldingisining xatosini takrorlaydi. Birinchi xato qator yuqorida.', 'Эта строка повторяет ошибку предыдущей. Первая неверная строка выше.', 'This line repeats the error of the previous one. The first wrong line is above.'),
  },
  proof: L("Pastki nuqta ishora bilan birga yo'qoldi.", 'Нижняя точка потерялась вместе со знаком.', 'The lower point was lost together with the sign.'),
  entry: {
    prompt: L('Bitta aylanada cos x = 1/2 ning nechta ildizi bor?', 'Сколько корней у cos x = 1/2 на одном обороте?', 'How many roots does cos x = 1/2 have on one turn?'),
    ok: L('Ikkita. Vertikal chiziq aylanani yuqoridan va pastdan kesadi.', 'Два. Вертикаль задевает окружность сверху и снизу.', 'Two. The vertical meets the circle above and below.'),
    hint: [
      L('Bitta aylanadagi nuqtalarni sanang.', 'Посчитай точки на одном обороте.', 'Count the points on one turn.'),
      L('Biri yuqorida, biri pastda.', 'Одна сверху и одна снизу.', 'One above and one below.'),
      L('Ikkita.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
  row: {
    r1: 'arccos 1/2 = 60°',
    r2: 'cos(−60°) = 1/2',
    r3: 'x = 60° + 360°n',
    r4: 'n = 1   →   420°',
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
    A('mount', 'Endi teskari masala. Nuqta berilgan, unga olib keladigan yozuvlar kerak.', 'Теперь обратная задача. Дана точка, а нужны записи, которые в неё ведут.', 'Now the inverse task. A point is given, and the readings leading to it are needed.'),
    A('work', "Nuqtani qo'ying, keyin shu yerga olib keladigan hamma yozuvni belgilaysiz.", 'Поставь точку, потом отметишь все записи, которые ведут сюда же.', 'Place the point, then you will mark every reading that leads here.'),
  ],
  multi: {
    prompt: L('AYNAN shu nuqtani beradigan hamma yozuvni belgilang.', 'Отметь все записи, которые дают ЭТУ ЖЕ точку.', 'Mark every reading that gives THIS SAME point.'),
    title: L('Qaysi yozuvlar aynan shu nuqtani beradi?', 'Какие записи дают эту же точку?', 'Which readings give this same point?'),
    ok: L("Beshtadan uchtasi. Ularning hammasi minus oltmish qo'shilgan butun sondagi aylana.", 'Три из пяти. Все они это минус шестьдесят плюс целое число оборотов.', 'Three out of five. All of them are minus sixty plus a whole number of turns.'),
    items: [
      { id: 'd', label: '60°', hint: L('Oltmish bu yuqoridagi nuqta, bu emas.', 'Шестьдесят это верхняя точка, а не эта.', 'Sixty is the upper point, not this one.') },
      { id: 'e', label: '120°', hint: L("Bu yerda yarim aylana qo'shilgan, nuqta chapda bo'ladi.", 'Здесь прибавлена половина оборота, точка окажется слева.', 'Here half a turn was added, the point ends up on the left.') },
      { id: 'a', label: '−60°', ok: true },
      { id: 'b', label: '660°', ok: true },
      { id: 'c', label: '−420°', ok: true },
    ],
  },
  place: {
    prompt: L("Nuqtani 300 gradusga qo'ying.", 'Поставь точку на 300 градусов.', 'Place the point at 300 degrees.'),
    ok: L('Bu pastki nuqta. Unga minus ishorali yozuv olib boradi.', 'Это нижняя точка. В неё ведёт запись со знаком минус.', 'This is the lower point. The reading with a minus leads to it.'),
    wrong: L("Uch yuz gradus gorizontal o'qdan pastda va vertikal o'qdan o'ngda.", 'Триста градусов это ниже горизонтальной оси и правее вертикальной.', 'Three hundred degrees is below the horizontal axis and right of the vertical one.'),
    target: '300°',
    step: '−60° + 360°n',
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
      prompt: L('Kosinus yozuvida qanday ishora turadi?', 'Какой знак стоит в записи для косинуса?', 'Which sign stands in the cosine reading?'),
      done: '±',
      items: [
        { id: 'a', label: L('plyus-minus', 'плюс-минус', 'plus-minus'), correct: true },
        { id: 'b', label: L('darajali minus bir', 'минус единица в степени', 'minus one in a power'), hint: L("Bu sinusning yozuvi: u yerda burchaklar ishora bilan bog'lanmagan.", 'Это запись для синуса: там углы знаком не связаны.', 'That is the sine reading: there the angles are not related by a sign.') },
        { id: 'c', label: L('faqat plyus', 'только плюс', 'only a plus'), hint: L('Unda pastki nuqta javobdan tushib qoladi.', 'Тогда нижняя точка выпадет из ответа.', 'Then the lower point drops out of the answer.') },
        { id: 'd', label: L('faqat minus', 'только минус', 'only a minus'), hint: L('Unda yuqoridagisi tushib qoladi.', 'Тогда выпадет верхняя.', 'Then the upper one drops out.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Kosinus yozuvida qadam qanchaga teng?', 'Чему равен шаг в записи для косинуса?', 'What is the step in the cosine reading?'),
      done: '360°n',
      items: [
        { id: 'a', label: L('uch yuz oltmish', 'триста шестьдесят', 'three hundred sixty'), correct: true },
        { id: 'b', label: L('yuz sakson', 'сто восемьдесят', 'one hundred eighty'), hint: L('Yuz sakson bu sinusdagi qadam, u yerda yozuvlar almashadi.', 'Сто восемьдесят это шаг у синуса, где записи чередуются.', 'One hundred eighty is the sine step, where the readings alternate.') },
        { id: 'c', label: L("to'qson", 'девяносто', 'ninety'), hint: L('Chorak aylana nuqtani qaytarmaydi.', 'Четверть оборота точку не возвращает.', 'A quarter turn does not return the point.') },
        { id: 'd', label: L("burchakka bog'liq", 'зависит от угла', 'it depends on the angle'), hint: L('Qadam doim bir xil.', 'Шаг всегда один и тот же.', 'The step is always the same.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('cos x = −1 da nechta seriya bor?', 'Сколько серий у cos x = −1?', 'How many series does cos x = −1 have?'),
      done: '1',
      items: [
        { id: 'a', label: L('bitta', 'одна', 'one'), correct: true, ok: L('Ha. Vertikal chiziq chap chetiga tegdi, nuqta bitta.', 'Да. Вертикаль коснулась левого края, точка одна.', 'Yes. The vertical touched the left edge, there is one point.') },
        { id: 'b', label: L('ikkita', 'две', 'two'), hint: L('U yerda yuqori va past bitta nuqtaga birlashdi.', 'Верх и низ там совпали в одну точку.', 'The top and the bottom merged into one point there.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('cos x = 2 ning nechta ildizi bor?', 'Сколько корней у cos x = 2?', 'How many roots does cos x = 2 have?'),
      done: '0',
      items: [
        { id: 'a', label: L('hech qaysi', 'ни одного', 'none'), correct: true },
        { id: 'b', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Vertikal chiziq aylanadan o'ngdan o'tdi.", 'Вертикаль прошла правее окружности.', 'The vertical passed to the right of the circle.') },
        { id: 'c', label: L('ikkita', 'два', 'two'), hint: L("Umumiy nuqta bitta ham yo'q.", 'Общей точки нет ни одной.', 'There is not a single common point.') },
        { id: 'd', label: L('bitta', 'один', 'one'), hint: L("Bitta tekkanda bo'lardi, bu yerda esa chiziq yonidan o'tdi.", 'Один был бы при касании, а тут прямая прошла мимо.', 'One would happen at a touch, here the line missed.') },
      ],
    },
  ],
  angles: ['60°', '300°', '180°', '90°'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  audio: [
    A('mount', 'Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija.', 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
    A('next', 'Kosinusda nuqtalar bir-birining ostida turadi, shuning uchun plyus-minus ishora yetadi.', 'У косинуса точки стоят одна под другой, и поэтому хватает знака плюс-минус.', 'For the cosine the points stand one below the other, and that is why a plus-minus sign is enough.'),
  ],
  can: [
    L("Vertikal chiziq o'tkazaman va ikkala nuqtani ko'raman", 'Провожу вертикаль и вижу обе точки', 'I draw the vertical and see both points'),
    L('Plyus-minus ishora qayerdan kelishini bilaman', 'Знаю, откуда берётся знак плюс-минус', 'I know where the plus-minus sign comes from'),
    L("Qadam to'liq aylana bo'lib qolishini eslayman", 'Помню, что шаг остаётся полным оборотом', 'I remember the step stays a full turn'),
    L("Nuqta bitta yoki yo'q bo'lgan holatlarni ko'raman", 'Вижу случаи, когда точка одна или её нет', 'I see the cases with one point or none'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L('Bitta joy takrorlashni talab qiladi: qadam qanchaga teng.', 'Одно место требует повтора: чему равен шаг.', 'One place needs review: what the step equals.'),
    back: L('Qoidaga va 4-ekranga qayting.', 'Вернись к правилу и к экрану 4.', 'Go back to the rule and to screen 4.'),
  },
  bridge: L('12-dars: tangens. U yerda ham nuqta ikkita, lekin ikkalasi bir xil qiymat beradi.', 'Урок 12: тангенс. Там точек тоже две, но обе дают одно и то же значение.', 'Lesson 12: the tangent. There are two points there too, but both give the same value.'),
  lifehack: L('Plyus-minus ishora qisqartma emas, bir-birining ostidagi ikki nuqta.', 'Знак плюс-минус это не сокращение, а две точки одна под другой.', 'The plus-minus sign is not shorthand but two points one below the other.'),
  sheetTitle: L('Kosinus · shpargalka', 'Косинус · шпаргалка', 'The cosine · cheat sheet'),
  sheetSrc: L('10-sinf · 11-dars', '10 класс · урок 11', 'Grade 10 · lesson 11'),
  hook: {
    a: '±',
    b: '(−1)ⁿ',
  },
  proved: '± 60° + 360°n',
  law: 'x = ± arccos a + 360°n',
  sheet: [
    'x = ± arccos a + 360°n',
    'cos x = 1   →   360°n',
    'cos x = −1   →   180° + 360°n',
    '−1 ≤ a ≤ 1',
    'arccos a ∈ [0°; 180°]',
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
// Отметки при неверной паре: две точки одной вертикали, одна под другой.
const EQ_MARKS = [
  { deg: 60, tone: 'graph', label: '60°' },
  { deg: 300, tone: 'ink3', label: '300°' },
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
        // Вертикаль опускается уже на хуке: обе точки видны до того, как
        // названы. Прогноз делается при полной картине.
        fig={() => <Scene fig={<LevelLine step={1} a={0.5} axis="x" arcs />} max={172} h={172} />}
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
        fig={<LevelLine step={phase} a={0.5} axis="x" arcs />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S3.work.prompt}
        test={(c, s) => Math.abs(c - 0.5) < 0.09 && s < -0.5}
        hints={[
          { when: (c) => c < 0, text: S3.work.hint[0] },
          { when: (c, s) => s > 0, text: S3.work.hint[1] },
          { when: () => true, text: S3.work.hint[2] },
        ]}
        okText={S3.work.ok}
        snap={[300]}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      /* Свидетель урока: зеркало по горизонтальной оси. Сдвиг не трогается,
         знак угла меняется — отсюда и берётся плюс-минус. */
      <Scene
        fig={<MirrorAxis step={phase + 1} deg={60} />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S4.work.prompt}
        test={(c, s) => Math.abs(c - 0.5) < 0.09 && s < -0.5}
        hints={[
          { when: (c, s) => s > 0, text: S4.work.hint[0] },
          { when: (c) => c < 0, text: S4.work.hint[1] },
          { when: () => true, text: S4.work.hint[2] },
        ]}
        okText={S4.work.ok}
        snap={[300]}
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
        fig={<SeriesTicks step={phase + 1} deg={60} turns={2} />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <BuildPoint
        prompt={S5.work.prompt}
        test={(c, s) => Math.abs(c - 0.5) < 0.09 && s > 0.5}
        hints={[
          { when: (c) => c < 0, text: S5.work.hint[0] },
          { when: (c, s) => s < 0, text: S5.work.hint[1] },
          { when: () => true, text: S5.work.hint[2] },
        ]}
        okText={S5.work.ok}
        snap={[60]}
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
        fig={<LevelLine step={phase} a={1} axis="x" arcs />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<LevelLine step={1} a={1} axis="x" arcs />} max={300} />
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
        fig={<LevelLine step={phase} a={2} axis="x" />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<LevelLine step={1} a={2} axis="x" />} max={300} />
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
        fig={(solved) => <Scene fig={<MirrorAxis step={solved ? 2 : 0} deg={60} />} max={330} />}
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
