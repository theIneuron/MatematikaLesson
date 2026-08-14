// ============================================================================
// 10-sinf, Dars 9. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS09_KONTENT.md
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
// Фигуры блока 2. Сняты на стенде `probe/figures.html` до контента.
import { LevelLine, SeriesTicks } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 9
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Sodda tenglamalar`,
  `Урок ${LESSON_NO}. Простейшие уравнения`,
  `Lesson ${LESSON_NO}. Simplest equations`,
)

const BLOCK = { label: 'B2', from: 8, to: 13, current: 9 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('TENGLAMA', 'УРАВНЕНИЕ', 'THE EQUATION'),
  title: L('Tenglamaning nechta ildizi bor?', 'Сколько корней у уравнения?', 'How many roots does the equation have?'),
  motion: ['mount'],
  audio: [
    A('mount', "Nuqta to'liq aylanadan keyin o'z joyiga qaytadi, balandligi ham o'sha.", 'Точка возвращается на своё место после полного оборота, и высота у неё та же.', 'The point returns to its place after a full turn, with the same height.'),
    A('r1', 'Birinchi yozuv ildiz ikkita deydi.', 'Первая запись говорит, что корней два.', 'The first reading says there are two roots.'),
    A('r2', "Ikkinchisi cheksiz ko'p deydi.", 'Вторая говорит, что их бесконечно много.', 'The second says there are infinitely many.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi aylana bilan tekshiramiz.', 'Твой ответ записан. Сейчас проверим оборотом.', 'Your answer is saved. Now a turn will check it.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('ildiz ikkita', 'корней два', 'two roots'),
      value: 'x = 30°,  150°',
    },
    b: {
      name: L("ildiz cheksiz ko'p", 'корней бесконечно много', 'infinitely many roots'),
      value: 'x = 30° + 360°n',
    },
  },
  expr: 'sin x = 1/2',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Tenglamalardan oldin uch savol', 'Три вопроса перед уравнениями', 'Three questions before equations'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Gorizontal to'g'ri chiziq aylana ichida nechta nuqta beradi?", 'Сколько точек даёт горизонтальная прямая внутри круга?', 'How many points does a horizontal line give inside the circle?'),
      done: '2',
      items: [
        { id: 'a', label: L('ikkita', 'две', 'two'), correct: true },
        { id: 'b', label: L('bitta', 'одну', 'one'), hint: L('Bitta faqat chetiga tekkanda, eng tepada yoki pastda beradi.', 'Одну она даёт только когда касается края, на самом верху или внизу.', 'One only when it touches the edge, at the very top or bottom.') },
        { id: 'c', label: L('hech qaysi', 'ни одной', 'none'), hint: L("To'g'ri chiziq aylanadan yuqoridan o'tsa, hech qaysi bo'ladi.", 'Ни одной бывает, если прямая прошла выше окружности.', 'None happens if the line passed above the circle.') },
        { id: 'd', label: L("to'rtta", 'четыре', 'four'), hint: L("To'g'ri chiziq va aylana ikkitadan ko'p nuqtada kesishmaydi.", 'Прямая и окружность пересекаются не больше чем в двух точках.', 'A line and a circle meet in at most two points.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Nuqtani avvalgi joyiga nima qaytaradi?', 'Что возвращает точку на прежнее место?', 'What returns the point to its former place?'),
      done: 'α + 360°n',
      items: [
        { id: 'a', label: L('butun sondagi aylana', 'целое число оборотов', 'a whole number of turns'), correct: true },
        { id: 'b', label: L('yarim aylana', 'половина оборота', 'half a turn'), hint: L('Yarim aylana nuqtani qarshi tomonga olib ketadi, bu beshinchi darsda edi.', 'Половина уводит точку напротив, это был пятый урок.', 'Half a turn sends the point opposite, that was lesson five.') },
        { id: 'c', label: L('har qanday gradus soni', 'любое число градусов', 'any number of degrees'), hint: L("Unda nuqta qimirlagan bo'lardi, bizga esa aynan o'sha kerak.", 'Тогда точка сдвинулась бы, а нужна та же самая.', 'Then the point would move, and we need the very same one.') },
        { id: 'd', label: L('hech narsa', 'ничто', 'nothing'), hint: L("Qaytaradi: to'liq aylana nuqtani o'sha yerga olib keladi.", 'Возвращает: полный оборот приводит точку туда же.', 'It does: a full turn brings the point to the same place.') },
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
  title: L('Tenglamani yechish barcha burchaklarni topish', 'Решить уравнение значит найти все углы', 'Solving means finding every angle'),
  tag: 'odin-koren',
  show: [
    [
      L('balandlik berilgan', 'высота задана', 'the height is given'),
      L("shu balandlikdagi to'g'ri chiziq", 'прямая на этой высоте', 'the line at that height'),
    ],
    [
      L("ikkala nuqta ham to'g'ri keladi", 'подходят обе точки', 'both points fit'),
      L("o'ttiz va yuz ellik", 'тридцать и сто пятьдесят', 'thirty and one hundred fifty'),
    ],
  ],
  motion: ['drop'],
  audio: [
    A('mount', "Tenglama so'raydi: balandligi bir ikkidan bo'lgan burchaklarni toping.", 'Уравнение просит: найди углы, у которых высота равна одной второй.', 'The equation asks: find the angles whose height is one half.'),
    A('drop', "To'g'ri chiziq shu balandlikka tushadi va aylanani ikki nuqtada kesadi. O'tgan darsda ulardan bittasi olinardi, bu yerda esa ikkalasi kerak: ikkalasi ham to'g'ri tenglik beradi.", 'Прямая садится на эту высоту и задевает окружность в двух точках. На прошлом уроке из них брали одну, а здесь нужны обе: обе дают верное равенство.', 'The line settles at that height and meets the circle at two points. Last lesson one of them was taken, here both are needed: both give a true equality.'),
    A('work', "Endi o'zingiz. Ikkinchi ildizga, chapdagisiga nuqta qo'ying.", 'Теперь сам. Поставь точку во второй корень, тот, что слева.', 'Now you. Place the point at the second root, the one on the left.'),
  ],
  work: {
    prompt: L("Tenglamaning ikkinchi ildiziga nuqta qo'ying.", 'Поставь точку во второй корень уравнения.', 'Place the point at the second root of the equation.'),
    ok: L("Yuz ellik gradus. Balandlik o'sha, demak tenglik to'g'ri, va bu ham ildiz.", 'Сто пятьдесят градусов. Высота та же, значит равенство верное, и это тоже корень.', 'One hundred fifty degrees. The same height, so the equality holds, and this is a root too.'),
    hint: [
      L("O'sha to'g'ri chiziqdagi ikkinchi nuqta kerak.", 'Нужна вторая точка на той же прямой.', 'You need the second point on the same line.'),
      L("U vertikal o'qdan chapda, balandligi musbat.", 'Она слева от вертикальной оси, высота у неё положительная.', 'It is left of the vertical axis, with a positive height.'),
      L('Yuz ellik gradus.', 'Сто пятьдесят градусов.', 'One hundred fifty degrees.'),
    ],
  },
}

const S4 = {
  role: 'explain2',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Har nuqtadan seriya ketadi', 'Из каждой точки уходит серия', 'A series leaves each point'),
  tag: 'seriya-bez-n',
  show: [
    [
      L('nuqta joyiga qaytdi', 'точка вернулась на место', 'the point returned to its place'),
      L("uch yuz oltmish qo'shildi", 'прибавилось триста шестьдесят', 'three hundred sixty was added'),
    ],
    [
      L('yana bir aylana', 'ещё оборот', 'one more turn'),
      L('yozuv allaqachon uchta', 'записей уже три', 'three readings already'),
    ],
  ],
  motion: ['turn'],
  audio: [
    A('mount', "Birinchi ildizga, o'ttiz gradusga qaytamiz.", 'Вернёмся к первому корню, к тридцати градусам.', 'Back to the first root, to thirty degrees.'),
    A('turn', "To'liq aylana nuqtani o'sha yerga olib keladi, demak uch yuz to'qson gradus ham ildiz. Yana bir aylana, va yetti yuz ellik ham. Ro'yxat tugamaydi.", 'Полный оборот приводит точку туда же, значит триста девяносто градусов тоже корень. Ещё оборот, и семьсот пятьдесят тоже. Список не кончается.', 'A full turn brings the point to the same place, so three hundred ninety degrees is a root too. One more turn, and seven hundred fifty as well. The list does not end.'),
    A('work', "Endi o'zingiz. Yetti yuz ellik graduslik burchak keladigan joyga nuqta qo'ying.", 'Теперь сам. Поставь точку туда, куда придёт угол в семьсот пятьдесят градусов.', 'Now you. Place the point where the angle of seven hundred fifty degrees arrives.'),
  ],
  work: {
    prompt: L('750 graduslik burchak qayerga keladi?', 'Куда придёт угол 750 градусов?', 'Where does the angle of 750 degrees arrive?'),
    ok: L("O'ttiz kelgan joyga. Ikki to'liq aylana hech narsani o'zgartirmaydi.", 'Туда же, куда и тридцать. Два полных оборота ничего не меняют.', 'The same place as thirty. Two full turns change nothing.'),
    hint: [
      L("Yetti yuz ellikdan to'liq aylanalarni tashlang.", 'Отбрось от семисот пятидесяти полные обороты.', 'Drop the whole turns from seven hundred fifty.'),
      L("Yetti yuz ellik bu o'ttiz qo'shilgan ikki aylana.", 'Семьсот пятьдесят это тридцать плюс два оборота.', 'Seven hundred fifty is thirty plus two turns.'),
      L("O'ttiz gradus.", 'Тридцать градусов.', 'Thirty degrees.'),
    ],
  },
}

const S5 = {
  role: 'explain3',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Cheksiz ro'yxatni qanday yozish", 'Как записать бесконечный список', 'How to write an endless list'),
  tag: 'seriya-bez-n',
  show: [
    [
      L("o'ttiz, uch yuz to'qson, yetti yuz ellik", 'тридцать, триста девяносто, семьсот пятьдесят', 'thirty, three hundred ninety, seven hundred fifty'),
      L('qadam doim bitta aylana', 'шаг всегда один оборот', 'the step is always one turn'),
    ],
    [
      L("ro'yxat o'rniga bitta qator", 'вместо списка одна строка', 'one line instead of a list'),
      L('`n` harfi aylana raqami', 'буква `n` это номер оборота', 'the letter `n` is the number of the turn'),
    ],
  ],
  motion: ['write'],
  audio: [
    A('mount', "Ro'yxat cheksiz, uni esa bitta qatorga yozish kerak.", 'Список бесконечный, а записать его надо в одну строку.', 'The list is endless, and it has to be written in one line.'),
    A('write', "Hamma yozuv butun sondagi aylanaga farq qiladi. Demak yozamiz: o'ttiz gradus qo'shilgan uch yuz oltmish karra en, bu yerda en har qanday butun son. Nol o'ttizni beradi, bir uch yuz to'qsonni, minus bir minus uch yuz o'ttizni.", 'Все записи отличаются целым числом оборотов. Значит пишем: тридцать градусов плюс триста шестьдесят умножить на эн, где эн любое целое число. Ноль даёт тридцать, единица триста девяносто, минус единица минус триста тридцать.', 'All the readings differ by a whole number of turns. So we write: thirty degrees plus three hundred sixty times n, where n is any whole number. Zero gives thirty, one gives three hundred ninety, minus one gives minus three hundred thirty.'),
    A('work', "Endi o'zingiz. En minus birga teng bo'lganda keladigan joyga nuqta qo'ying.", 'Теперь сам. Поставь точку туда, куда приведёт эн, равное минус единице.', 'Now you. Place the point where n equal to minus one leads.'),
  ],
  work: {
    prompt: L('n = −1 qayerga olib keladi?', 'Куда приведёт n = −1?', 'Where does n = −1 lead?'),
    ok: L("O'sha yerga. Minus uch yuz o'ttiz bu o'ttizdan to'liq aylana ayirilgani, nuqta o'sha.", 'Туда же. Минус триста тридцать это тридцать минус полный оборот, точка та же самая.', 'The same place. Minus three hundred thirty is thirty minus a full turn, the same point.'),
    hint: [
      L("O'ttizdan bitta to'liq aylanani ayiring.", 'Отними от тридцати один полный оборот.', 'Subtract one full turn from thirty.'),
      L("Minus uch yuz o'ttiz chiqadi, nuqta esa qimirlamaydi.", 'Получится минус триста тридцать, а точка не сдвинется.', 'You get minus three hundred thirty, and the point does not move.'),
      L("O'ttiz gradus.", 'Тридцать градусов.', 'Thirty degrees.'),
    ],
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Ildiz umuman bo'lmaganda", 'Когда корней нет совсем', 'When there are no roots at all'),
  tag: 'net-resheniy',
  show: [
    [
      L('balandlik ikki', 'высота два', 'the height is two'),
      L("to'g'ri chiziq aylanadan yuqorida", 'прямая выше окружности', 'the line is above the circle'),
    ],
    [
      L("umumiy nuqta yo'q", 'общих точек нет', 'no common points'),
      L("demak ildiz ham yo'q", 'значит нет и корней', 'so there are no roots'),
    ],
  ],
  motion: ['miss'],
  audio: [
    A('mount', "Sinus iks ikkiga teng tenglamani olaylik. To'g'ri chiziq aylanadan yuqorida turadi.", 'Возьмём уравнение синус икс равен двум. Прямая стоит выше окружности.', 'Take the equation sine x equals two. The line stands above the circle.'),
    A('miss', "U yonidan o'tadi va aylanaga bir marta ham tegmaydi. Umumiy nuqta yo'q, demak burchak ham yo'q, ya'ni tenglamaning yechimi yo'q. Buni to'g'ri chiziq ko'rsatadi, yodlab olinmaydi.", 'Она проходит мимо и ни разу не задевает круг. Общей точки нет, значит нет и угла, а значит уравнение решений не имеет. Это видно прямой, а не выучено словами.', 'It passes by and never touches the circle. There is no common point, so there is no angle, and the equation has no solutions. The line shows it, it is not memorised.'),
    A('work', "O'zingiz hisoblang. Sinus iks ikkiga teng tenglamaning nechta ildizi bor?", 'Посчитай сам. Сколько корней у уравнения синус икс равен двум?', 'Compute it yourself. How many roots does the equation sine x equals two have?'),
  ],
  work: {
    prompt: L('sin x = 2 ning nechta ildizi bor?', 'Сколько корней у sin x = 2?', 'How many roots does sin x = 2 have?'),
    ok: L('Nol. Birdan katta balandlik aylanada hech qanday burchakda uchramaydi.', 'Ноль. Высота больше единицы на окружности не встречается ни при каком угле.', 'Zero. A height greater than one never occurs on the circle at any angle.'),
    hint: [
      L("To'g'ri chiziq aylanaga tegdimi, qarang.", 'Посмотри, задела ли прямая окружность.', 'Look whether the line touched the circle.'),
      L("U yuqoridan o'tdi, umumiy nuqta yo'q.", 'Она прошла выше, общих точек нет.', 'It passed above, there are no common points.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Kosinusda to'g'ri chiziq vertikal", 'У косинуса прямая вертикальная', 'For the cosine the line is vertical'),
  tag: 'odin-koren',
  show: [
    [
      L('balandlik emas, siljish berilgan', 'задан сдвиг, а не высота', 'the shift is given, not the height'),
      L("to'g'ri chiziq vertikal ketadi", 'прямая идёт вертикально', 'the line runs vertically'),
    ],
    [
      L('nuqta yana ikkita', 'точек снова две', 'two points again'),
      L('ular bir-birining ustida', 'они одна над другой', 'one above the other'),
    ],
  ],
  motion: ['cut'],
  audio: [
    A('mount', "Kosinusli tenglamada siljish berilgan, shuning uchun to'g'ri chiziq vertikal.", 'В уравнении с косинусом задан сдвиг, поэтому прямая вертикальная.', 'In an equation with the cosine the shift is given, so the line is vertical.'),
    A('cut', 'U ham aylanani ikki marta kesadi, faqat nuqtalar endi bir-birining ustida. Yuqoridagi va pastdagi, oltmish va uch yuz gradus.', 'Она тоже задевает окружность дважды, только точки теперь одна над другой. Верхняя и нижняя, шестьдесят и триста градусов.', 'It also meets the circle twice, only now the points are one above the other. The upper and the lower, sixty and three hundred degrees.'),
    A('work', "O'zingiz hisoblang. Kosinus iks bir ikkidanga teng tenglamaning noldan uch yuz oltmishgacha oraliqda nechta ildizi bor?", 'Посчитай сам. Сколько корней у уравнения косинус икс равен одной второй на промежутке от нуля до трёхсот шестидесяти?', 'Compute it yourself. How many roots does cosine x equals one half have between zero and three hundred sixty?'),
  ],
  work: {
    prompt: L('cos x = 1/2 ning 0 dan 360° gacha nechta ildizi bor?', 'Сколько корней у cos x = 1/2 от 0 до 360°?', 'How many roots does cos x = 1/2 have from 0 to 360°?'),
    ok: L('Ikkita. Bitta aylana, ikkita nuqta: oltmish va uch yuz gradus.', 'Два. Один оборот, две точки: шестьдесят и триста градусов.', 'Two. One turn, two points: sixty and three hundred degrees.'),
    hint: [
      L('Bitta aylanadagi kesishish nuqtalarini sanang.', 'Посчитай точки пересечения на одном обороте.', 'Count the intersection points on one turn.'),
      L("Vertikal to'g'ri chiziq aylanani yuqoridan va pastdan kesadi.", 'Вертикальная прямая задевает окружность сверху и снизу.', 'The vertical line meets the circle above and below.'),
      L('Ikkita.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Ildizlar seriya bilan ketadi', 'Корни идут сериями', 'Roots come in series'),
  tag: 'seriya-bez-n',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidani ochishdan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Seriya yana bir bor quriladi, va qoida yonida ochiladi. En harfi aylana raqami, va u bitta qator cheksiz ro'yxatni almashtirishi uchun kerak.", 'Серия строится ещё раз, и правило открывается рядом. Буква эн это номер оборота, и она нужна, чтобы одна строка заменила бесконечный список.', 'The series is built once more, and the rule opens beside it. The letter n is the number of the turn, and it is needed so that one line replaces an endless list.'),
  ],
  probe: {
    question: L('Javobda `n` harfi nima uchun?', 'Зачем в ответе буква `n`?', 'Why is there a letter `n` in the answer?'),
    items: [
      { id: 'a', label: L('u hamma aylanani birdan sanaydi', 'она перечисляет все обороты сразу', 'it lists every turn at once'), correct: true },
      { id: 'b', label: L('u ildizning raqamini bildiradi', 'она обозначает номер корня', 'it marks the number of the root'), hint: L("Ildiz cheksiz ko'p, `n` esa ularni emas, aylanalarni sanaydi.", 'Корней бесконечно много, и `n` считает не их по порядку, а обороты.', 'There are infinitely many roots, and `n` counts turns, not roots in order.') },
    ],
  },
  rule: {
    lawLabel: L('Seriya', 'Серия', 'The series'),
    lines: [
      L("Aylanadagi har nuqta bitta ildiz emas, seriya beradi: burchakka istalgan butun sondagi aylanani qo'shish mumkin.", 'Каждая точка на окружности даёт не один корень, а серию: к углу можно прибавить любое целое число оборотов.', 'Each point on the circle gives not one root but a series: any whole number of turns may be added to the angle.'),
      L('Nuqta ikkita, demak seriya ham ikkita, va javobga ikkalasi kiradi.', 'Точек две, значит и серий две, и в ответ идут обе.', 'There are two points, so two series, and both go into the answer.'),
      L("To'g'ri chiziq aylananing yonidan o'tsa, ildiz umuman yo'q.", 'Если прямая прошла мимо окружности, корней нет вовсе.', 'If the line missed the circle, there are no roots at all.'),
    ],
    law: 'x = 30° + 360°n,   x = 150° + 360°n',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Tenglama va uning seriyasi', 'Уравнение и его серия', 'The equation and its series'),
  tag: 'odin-koren',
  audio: [
    A('mount', "To'rt tenglama va to'rt seriya. Ularni birlashtiring.", 'Четыре уравнения и четыре серии. Соедини их.', 'Four equations and four series. Match them.'),
  ],
  match: {
    prompt: L("Tenglamani o'z seriyasi bilan birlashtiring.", 'Соедини уравнение с его серией.', 'Match the equation with its series.'),
    ok: L("Bu to'rttasida seriya bitta: to'g'ri chiziq yo chetiga tegadi, yo ikki nuqta bitta qadamga yig'iladi.", 'В этих четырёх серия одна: прямая либо касается края, либо две точки складываются в один шаг.', 'In these four the series is single: the line either touches the edge or the two points fold into one step.'),
    left: ['sin x = 1', 'sin x = 0', 'cos x = 1', 'cos x = −1'],
    a: '90° + 360°n',
    b: '180°n',
    c: '360°n',
    d: '180° + 360°n',
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
    s1: L("balandlik bo'ylab to'g'ri chiziq o'tkazamiz", 'проводим прямую по высоте', 'we draw the line at the height'),
    s2: L('ikkala nuqtani belgilaymiz', 'отмечаем обе точки', 'we mark both points'),
    s3: L("har biriga aylanalarni qo'shamiz", 'к каждой прибавляем обороты', 'we add turns to each'),
    s4: L('ikkita seriya yozamiz', 'пишем две серии', 'we write two series'),
    ok: L("Tartib doim shunday. Ikkinchi qadam tashlab ketilsa, ildizlarning yarmi javobdan sezilmay yo'qoladi.", 'Порядок такой всегда. Если пропустить второй шаг, половина корней исчезнет из ответа незамеченной.', 'The order is always this. Skipping the second step makes half the roots vanish unnoticed.'),
    bad: L("Avval to'g'ri chiziq, keyin ikkala nuqta, keyin aylanalar, keyingina javob.", 'Сначала прямая, потом обе точки, потом обороты, и только потом ответ.', 'First the line, then both points, then the turns, and only then the answer.'),
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
    ok: L("Uch yuz to'qson. Seriyadagi bir o'ttiz ustiga bitta to'liq aylana degani.", 'Триста девяносто. Единица в серии означает один полный оборот сверх тридцати.', 'Three hundred ninety. A one in the series means one full turn on top of thirty.'),
    hint: [
      L("Harf o'rniga birni qo'ying.", 'Подставь единицу вместо буквы.', 'Put one in place of the letter.'),
      L("O'ttiz qo'shilgan uch yuz oltmish.", 'Тридцать плюс триста шестьдесят.', 'Thirty plus three hundred sixty.'),
      L("Uch yuz to'qson.", 'Триста девяносто.', 'Three hundred ninety.'),
    ],
    prompt: 'x = 30° + 360°n,   n = 1   →   x = ?',
    answer: '390',
  },
  order: {
    prompt: L("O'sish tartibida joylashtiring.", 'Расставь по возрастанию.', 'Arrange in increasing order.'),
    title: L('Qaysi ildiz kichikroq?', 'Какой корень меньше?', 'Which root is smaller?'),
    ok: L("Siz aylana raqamlarini qo'ydingiz va yozuvlarni emas, sonlarni solishtirdingiz.", 'Ты подставил номера оборотов и сравнил числа, а не записи.', 'You substituted the turn numbers and compared numbers, not readings.'),
    bad: L("Har yozuvga aylana raqamini qo'ying va chiqqanini solishtiring.", 'Подставь в каждую запись её номер оборота и сравни то, что получилось.', 'Put the turn number into each reading and compare the results.'),
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
    A('mount', 'Masala. Sinus iks bir ikkidanga teng tenglamani yechish.', 'Задача. Решить уравнение синус икс равен одной второй.', 'A task. Solve the equation sine x equals one half.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L("Bu qator to'g'ri: balandlik haqiqatan bir ikkidan.", 'Эта строка верна: высота действительно одна вторая.', 'This line is right: the height really is one half.'),
    r2: L("Bu qator ham to'g'ri: o'ttiz gradus haqiqiy ildiz.", 'Эта строка тоже верна: тридцать градусов настоящий корень.', 'This line is right too: thirty degrees is a real root.'),
    r4: L('Bu qator oldingisining xatosini takrorlaydi. Birinchi xato qator yuqorida.', 'Эта строка повторяет ошибку предыдущей. Первая неверная строка выше.', 'This line repeats the error of the previous one. The first wrong line is above.'),
  },
  proof: L("Ikkinchi nuqta yo'qoldi.", 'Вторая точка потерялась.', 'The second point was lost.'),
  entry: {
    prompt: L("To'liq javobda nechta seriya bor?", 'Сколько серий в полном ответе?', 'How many series are in the full answer?'),
    ok: L("Ikkita. Kesishish nuqtasi ikkita, va har biri o'z seriyasini beradi.", 'Две. Точек пересечения две, и каждая даёт свою серию.', 'Two. There are two intersection points, and each gives its own series.'),
    hint: [
      L("To'g'ri chiziq beradigan nuqtalarni sanang.", 'Посчитай точки, которые даёт прямая.', 'Count the points the line gives.'),
      L("Har nuqta o'z seriyasini beradi.", 'Каждая точка даёт свою серию.', 'Each point gives its own series.'),
      L('Ikkita.', 'Две.', 'Two.'),
    ],
    answer: '2',
  },
  row: {
    r1: 'sin x = 1/2',
    r2: 'x = 30°',
    r3: 'x = 30° + 360°n',
    r4: 'x = 30°,  390°,  750°',
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
    A('mount', 'Endi teskari masala. Nuqta berilgan, seriyasining hamma yozuvi kerak.', 'Теперь обратная задача. Дана точка, а нужны все записи её серии.', 'Now the inverse task. A point is given, and all the readings of its series are needed.'),
    A('work', "Nuqtani qo'ying, keyin shu yerga olib keladigan hamma yozuvni belgilaysiz.", 'Поставь точку, потом отметишь все записи, которые ведут сюда же.', 'Place the point, then you will mark every reading that leads here.'),
  ],
  multi: {
    prompt: L('Shu nuqtaning seriyasidagi hamma yozuvni belgilang.', 'Отметь все записи из серии этой точки.', 'Mark every reading from the series of this point.'),
    title: L('Qaysi yozuvlar aynan shu nuqtani beradi?', 'Какие записи дают эту же точку?', 'Which readings give this same point?'),
    ok: L('Beshtadan uchtasi. Seriya bu bitta nuqta va uning atrofidagi hamma aylana.', 'Три из пяти. Серия это одна точка и все обороты вокруг неё.', 'Three out of five. A series is one point and all the turns around it.'),
    items: [
      { id: 'd', label: '30°', hint: L("O'ttiz bu birinchi nuqta, bu emas.", 'Тридцать это первая точка, а не эта.', 'Thirty is the first point, not this one.') },
      { id: 'e', label: '330°', hint: L("Bu yerda yarim aylana qo'shilgan, nuqta qarshi tomonda bo'ladi.", 'Здесь прибавлена половина оборота, точка окажется напротив.', 'Here half a turn was added, the point ends up opposite.') },
      { id: 'a', label: '510°', ok: true },
      { id: 'b', label: '−210°', ok: true },
      { id: 'c', label: '870°', ok: true },
    ],
  },
  place: {
    prompt: L("Nuqtani 150 gradusga qo'ying.", 'Поставь точку на 150 градусов.', 'Place the point at 150 degrees.'),
    ok: L("Bu ikkinchi nuqta. Endi bu yerga yana qaysi burchaklar olib kelishini ko'ramiz.", 'Это вторая точка. Теперь посмотрим, какие ещё углы приводят сюда же.', 'This is the second point. Now let us see which other angles lead here.'),
    wrong: L("Yuz ellik gorizontal o'qdan yuqorida va vertikal o'qdan chapda.", 'Сто пятьдесят это выше горизонтальной оси и левее вертикальной.', 'One hundred fifty is above the horizontal axis and left of the vertical one.'),
    target: '150°',
    step: '150° + 360°n',
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
      prompt: L('Bitta aylanada sin x = 1/2 ning nechta ildizi bor?', 'Сколько корней у sin x = 1/2 на одном обороте?', 'How many roots does sin x = 1/2 have on one turn?'),
      done: '2',
      items: [
        { id: 'a', label: L('ikkita', 'два', 'two'), correct: true },
        { id: 'b', label: L('bitta', 'один', 'one'), hint: L("To'g'ri chiziq aylanani ikki marta kesadi, demak ildiz ikkita.", 'Прямая задевает окружность дважды, значит корней два.', 'The line meets the circle twice, so there are two roots.') },
        { id: 'c', label: L('hech qaysi', 'ни одного', 'none'), hint: L("Hech qaysi faqat to'g'ri chiziq yonidan o'tganda bo'ladi.", 'Ни одного бывает, только если прямая прошла мимо.', 'None happens only if the line missed the circle.') },
        { id: 'd', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Bitta aylanada ikkita, cheksiz ko'p esa butun sonlar o'qida.", 'На одном обороте их два, а бесконечно много на всей прямой.', 'On one turn there are two, infinitely many over all numbers.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Javobdagi `n` harfi nimani bildiradi?', 'Что означает буква `n` в ответе?', 'What does the letter `n` mean in the answer?'),
      done: '+ 360°n',
      items: [
        { id: 'a', label: L('istalgan butun sondagi aylana', 'любое целое число оборотов', 'any whole number of turns'), correct: true },
        { id: 'b', label: L('ildizning tartib raqami', 'номер корня по порядку', 'the position number of the root'), hint: L("Ularni tartib bilan raqamlab bo'lmaydi: ildiz cheksiz ko'p.", 'По порядку их не пронумеровать: корней бесконечно много.', 'They cannot be numbered in order: there are infinitely many roots.') },
        { id: 'c', label: L('har qanday gradus soni', 'любое число градусов', 'any number of degrees'), hint: L("Faqat butun aylanalarni qo'shish mumkin, aks holda nuqta qimirlaydi.", 'Прибавлять можно только целые обороты, иначе точка сдвинется.', 'Only whole turns may be added, otherwise the point moves.') },
        { id: 'd', label: L('doim birni', 'всегда единицу', 'always one'), hint: L('Bir bu holatlardan faqat bittasi.', 'Единица это только один из случаев.', 'One is just a single case.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('sin x = 2 ning nechta ildizi bor?', 'Сколько корней у sin x = 2?', 'How many roots does sin x = 2 have?'),
      done: '0',
      items: [
        { id: 'a', label: L('hech qaysi', 'ни одного', 'none'), correct: true, ok: L("Ha. To'g'ri chiziq aylanadan yuqoridan o'tdi.", 'Да. Прямая прошла выше окружности.', 'Yes. The line passed above the circle.') },
        { id: 'b', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Umumiy nuqta bitta ham yo'q, demak ildiz ham yo'q.", 'Общей точки нет ни одной, значит и корня ни одного.', 'There is not a single common point, so not a single root.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Sinusli tenglamaning to'liq javobida nechta seriya bor?", 'Сколько серий в полном ответе уравнения с синусом?', 'How many series are in the full answer of a sine equation?'),
      done: '2',
      items: [
        { id: 'a', label: L('ikkita', 'две', 'two'), correct: true },
        { id: 'b', label: L('bitta', 'одна', 'one'), hint: L('Bitta seriya ikki nuqtadan faqat bittasini qoplaydi.', 'Одна серия покрывает только одну из двух точек.', 'One series covers only one of the two points.') },
        { id: 'c', label: L("to'rtta", 'четыре', 'four'), hint: L('Kesishish nuqtasi ikkita, demak seriya ham ikkita.', 'Точек пересечения две, значит и серий две.', 'There are two intersection points, so two series.') },
        { id: 'd', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Ildiz cheksiz ko'p, ularni tavsiflaydigan seriya esa ikkita.", 'Корней бесконечно много, а серий, которые их описывают, две.', 'There are infinitely many roots, but two series describing them.') },
      ],
    },
  ],
  angles: ['30°', '150°', '390°', '210°'],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  audio: [
    A('mount', 'Dars boshida ikki yozuvdan birini tanlagan edingiz. Mana natija.', 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you chose one of the two readings. Here is the result.'),
    A('next', "Ildiz cheksiz ko'p, va ular ikkita seriya bilan yoziladi, har nuqtaga bittadan.", 'Корней бесконечно много, и записываются они двумя сериями, по одной на каждую точку.', 'There are infinitely many roots, and they are written as two series, one for each point.'),
  ],
  can: [
    L('Bitta emas, ikkala nuqtani topaman', 'Нахожу обе точки, а не одну', 'I find both points, not one'),
    L('Seriyani harf bilan yozaman', 'Записываю серию с буквой', 'I write the series with a letter'),
    L("Ildiz yo'qligini ko'raman", 'Вижу, когда корней нет', 'I see when there are no roots'),
    L("Kosinusda to'g'ri chiziq vertikal ekanini eslayman", 'Помню, что у косинуса прямая вертикальная', 'I remember the cosine line is vertical'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L("Bitta joy takrorlashni talab qiladi: to'liq javobda nechta seriya.", 'Одно место требует повтора: сколько серий в полном ответе.', 'One place needs review: how many series are in the full answer.'),
    back: L('Qoidaga va 4-ekranga qayting.', 'Вернись к правилу и к экрану 4.', 'Go back to the rule and to screen 4.'),
  },
  bridge: L("10-dars: ikki seriya bitta yozuvga yig'iladi, va darajadagi minus o'sha yerdan chiqadi.", 'Урок 10: две серии сворачиваются в одну запись, и оттуда берётся знак минус в степени.', 'Lesson 10: the two series fold into one reading, and that is where the minus in the power comes from.'),
  lifehack: L("Bitta ildizni topdingizmi, ikkinchisini qidiring. U doim bor, faqat to'g'ri chiziq chetiga tekkan holdan tashqari.", 'Нашёл один корень — ищи второй. Он всегда есть, кроме случая, когда прямая касается края.', 'Found one root, look for the second. It is always there, except when the line touches the edge.'),
  sheetTitle: L('Sodda tenglamalar · shpargalka', 'Простейшие уравнения · шпаргалка', 'Simplest equations · cheat sheet'),
  sheetSrc: L('10-sinf · 9-dars', '10 класс · урок 9', 'Grade 10 · lesson 9'),
  hook: {
    a: 'x = 30°,  150°',
    b: 'x = 30° + 360°n',
  },
  proved: 'x = 30° + 360°n',
  law: 'x = 30° + 360°n,   x = 150° + 360°n',
  sheet: [
    'sin x = 1/2',
    'x = 30° + 360°n',
    'x = 150° + 360°n',
    '−1 ≤ a ≤ 1',
    'x = ± arccos a + 360°n',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

// Число и градус из контента: минус там типографский, `parseInt` его не понимает.
const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))
const deg = (s) => parseInt(String(s).replace(/−/g, '-'), 10)

// Соответствие «уравнение — серия». Обе стороны формулы, одинаковые на всех
// языках; переводить нечего.
const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const EQ_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const EQ_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})
// Отметки при неверной паре: четыре особые точки окружности — именно они и
// дают эти серии.
const EQ_MARKS = [
  { deg: 90, tone: 'graph', label: '90°' },
  { deg: 0, tone: 'ink3', label: '0°' },
  { deg: 180, tone: 'graph', label: '180°' },
  { deg: 270, tone: 'ink3', label: '270°' },
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
        // Точка уходит на полный оборот уже на хуке: возврат виден до того,
        // как назван. Прогноз делается при полной картине.
        fig={() => <Scene fig={<SeriesTicks step={1} deg={30} turns={2} />} max={172} h={172} />}
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
      /* Свидетель урока: из точки уходит серия. Записи растут одна за другой,
         и буква `n` появляется из этого списка, а не из определения. */
      <Scene
        fig={<SeriesTicks step={phase + 1} deg={30} turns={2} />}
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
        fig={<SeriesTicks step={2} deg={30} turns={2} />}
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
      /* Прямая останавливается ВЫШЕ окружности и остаётся видимой: «прошла
         мимо» надо увидеть, а не услышать. */
      <Scene
        fig={<LevelLine step={phase} a={2} />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<LevelLine step={1} a={2} />} max={300} />
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
      /* У косинуса задан СДВИГ, поэтому прямая вертикальная: две точки теперь
         одна над другой, а не рядом. */
      <Scene
        fig={<LevelLine step={phase} a={0.5} axis="x" arcs />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<LevelLine step={1} a={0.5} axis="x" arcs />} max={300} />
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
        fig={(solved) => <Scene fig={<SeriesTicks step={solved ? 2 : 0} deg={30} turns={2} />} max={330} />}
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
