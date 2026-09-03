// ============================================================================
// 10-sinf, Dars 19. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS19_KONTENT.md
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
  ProbeChain,
  Scene,
  SlotTable,
} from './tools.jsx'

import { Plane } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 19
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Logarifmik funksiya`,
  `Урок ${LESSON_NO}. Логарифм. функция`,
  `Lesson ${LESSON_NO}. The logarithmic function`,
)

const BLOCK = { label: 'B5', from: 15, to: 27, current: 19 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('FUNKSIYA', 'ФУНКЦИЯ', 'THE FUNCTION'),
  title: L("Egri chiziq o'qqa yetadimi", 'Дойдёт ли кривая до оси', 'Will the curve reach the axis'),
  audio: [
    A('mount', "Egri chiziq pastga ketadi va vertikal o'qqa yopishadi. Ko'z bilan u o'qqa tegdimi yoki yo'qmi, ajratib bo'lmaydi.", 'Кривая идёт вниз и прижимается к вертикальной оси. На глаз не различить, коснулась она оси или нет.', 'The curve goes down and hugs the vertical axis. By eye you cannot tell whether it touched the axis or not.'),
    A('r1', "Birinchi yozuv pastda qayerdadir egri chiziq o'qqa yetadi va nolning logarifmi mavjud deydi.", 'Первая запись говорит, что где-то внизу кривая доходит до оси, и логарифм нуля существует.', 'The first reading says that somewhere below the curve reaches the axis and the logarithm of zero exists.'),
    A('r2', 'Ikkinchisi u qanchalik yaqin kelsa ham tegmaydi deydi.', 'Вторая говорит, что она подходит сколь угодно близко и всё равно не касается.', 'The second says it comes as close as you like and still does not touch.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi egri chiziq bo'ylab chapga yuramiz va ko'ramiz.", 'Твой ответ записан. Сейчас пройдём по кривой влево и посмотрим.', 'Your answer is saved. Now we will walk left along the curve and see.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L("qayerdadir o'qni kesadi", 'где-то пересечёт ось', 'somewhere it crosses the axis'),
      value: 'log₂ 0 = 0',
    },
    b: {
      name: L('yaqinlashadi va tegmaydi', 'подойдёт и не коснётся', 'it comes close and never touches'),
      value: 'x > 0',
    },
  },
  expr: 'y = log₂ x',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L("O'tgan darsdan uch savol", 'Три вопроса из прошлого урока', 'Three questions from the previous lesson'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Sakkizning ikki asosga ko'ra logarifmi nechaga teng?", 'Чему равен логарифм восьми по основанию два?', 'What is the logarithm of eight to base two?'),
      done: 'log₂ 8 = 3',
      items: [
        { id: 'a', label: L('uch', 'три', 'three'), correct: true },
        { id: 'b', label: L("to'rt", 'четыре', 'four'), hint: L("To'rt bo'lish bilan chiqardi, logarifm esa ko'rsatkich.", 'Четыре вышло бы делением, а логарифм это показатель.', 'Four would come from dividing, and a logarithm is an exponent.') },
        { id: 'c', label: L('bir uchdan', 'одна треть', 'one third'), hint: L('Bir uchdan asos va son joy almashganda chiqadi.', 'Одна треть выходит, когда основание и число меняют местами.', 'One third comes when the base and the number are swapped.') },
        { id: 'd', label: L('sakkiz', 'восемь', 'eight'), hint: L("Sakkiz belgi ostida turadi, savol esa ko'rsatkich haqida.", 'Восемь стоит под знаком, а спросили про показатель.', 'Eight stands under the sign, and the question was about the exponent.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Birning logarifmi nechaga teng?', 'Чему равен логарифм единицы?', 'What is the logarithm of one?'),
      done: 'logₐ 1 = 0',
      items: [
        { id: 'a', label: L('nolga', 'нулю', 'zero'), correct: true },
        { id: 'b', label: L('birga', 'единице', 'one'), hint: L("Birga asosning o'zining logarifmi teng.", 'Единице равен логарифм самого основания.', 'One is the logarithm of the base itself.') },
        { id: 'c', label: L('asosga', 'основанию', 'the base'), hint: L("Logarifm bu ko'rsatkich, asos emas.", 'Логарифм это показатель, а не основание.', 'A logarithm is an exponent, not a base.') },
        { id: 'd', label: L('u mavjud emas', 'его не существует', 'it does not exist'), hint: L('Bir musbat, demak logarifm bor.', 'Единица положительна, значит логарифм есть.', 'One is positive, so the logarithm exists.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Logarifm belgisi ostida qanday son turishi mumkin?', 'Какое число может стоять под знаком логарифма?', 'Which number can stand under a logarithm sign?'),
      done: 'x > 0',
      items: [
        { id: 'a', label: L('faqat musbat', 'только положительное', 'only a positive one'), correct: true },
        { id: 'b', label: L('har qanday', 'любое', 'any'), hint: L("Unda minus to'rtga teng ikkining darajasi topilardi, u esa yo'q.", 'Тогда нашлась бы степень двойки, равная минус четырём, а её нет.', 'Then there would be a power of two equal to minus four, and there is none.') },
        { id: 'c', label: L('faqat butun', 'только целое', 'only a whole number'), hint: L("Kasr ham yaraydi, faqat musbat bo'lsa.", 'Дробное тоже годится, лишь бы положительное.', 'A fractional one works too, as long as it is positive.') },
        { id: 'd', label: L('faqat birdan katta', 'только больше единицы', 'only greater than one'), hint: L('Nol va bir orasida ham logarifm bor, u shunchaki manfiy.', 'Между нулём и единицей логарифм тоже есть, он просто отрицательный.', 'Between zero and one the logarithm exists too, it is just negative.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Bitta juftlik, aks etgan', 'Одна пара, отражённая', 'One pair, reflected'),
  tag: 'd-vs-e',
  show: [
    [
      L("tanish egri chiziq va to'g'ri chiziq", 'знакомая кривая и прямая', 'the familiar curve and a line'),
      L("to'g'ri chiziqda kirish chiqishga teng", 'у прямой вход равен выходу', 'on the line the input equals the output'),
      'y = 2^x',
    ],
    [
      L('ikkinchi egri chiziq chizilib boradi', 'вторая кривая прорисовывается', 'the second curve draws itself'),
      L("nol va bir nuqtasi bir va nol bo'ldi", 'точка ноль и один стала один и ноль', 'the point zero and one became one and zero'),
      'y = log₂ x',
    ],
  ],
  motion: ['mirror'],
  audio: [
    A('mount', "Oynada ko'rsatkichli funksiya darsidan tanish egri chiziq. Uning yonidan kirishi chiqishiga teng to'g'ri chiziq o'tadi.", 'В окне знакомая кривая с урока про показательную функцию. Через неё проходит прямая, у которой вход равен выходу.', 'In the window is the curve familiar from the lesson on the exponential function. A line runs through it where the input equals the output.'),
    A('mirror', "Endi uni shu to'g'ri chiziqqa nisbatan aks ettiramiz. Ikkinchi egri chiziq ko'z oldida chizilib boradi, va bu logarifmik. U yangi figura emas, kirishi va chiqishi joy almashgan o'sha egri chiziq. Belgilangan nuqtalarga qarang. Ko'rsatkichlida kirish nol chiqish bir berardi. Logarifmikda kirish bir chiqish nol beradi. Sonlar o'sha, faqat joy almashgan, va bu har nuqta uchun to'g'ri.", 'Теперь отразим её относительно этой прямой. Вторая кривая прорисовывается на глазах, и это логарифмическая. Она не новая фигура, а та же самая, у которой вход и выход поменялись местами. Посмотри на отмеченные точки. У показательной вход ноль давал выход один. У логарифмической вход один даёт выход ноль. Числа те же, только переставлены, и это верно для каждой точки.', 'Now let us reflect it in that line. The second curve draws itself before your eyes, and that is the logarithmic one. It is not a new shape but the same curve with the input and the output swapped. Look at the marked points. For the exponential, input zero gave output one. For the logarithmic, input one gives output zero. The same numbers, only rearranged, and this holds for every point.'),
    A('work', "O'zingiz hisoblang. Kirish birga teng bo'lganda logarifmik egri chiziqning chiqishi nechaga teng?", 'Посчитай сам. Чему равен выход логарифмической кривой при входе, равном единице?', 'Work it out yourself. What is the output of the logarithmic curve at input one?'),
  ],
  work: {
    prompt: L("Kirish birga teng bo'lganda chiqish nechaga teng?", 'Чему равен выход при входе, равном единице?', 'What is the output at input one?'),
    ok: L("Nol. Ko'rsatkichlida teskari edi: kirish nol chiqish bir berardi.", 'Ноль. У показательной было наоборот: вход ноль давал выход один.', 'Zero. For the exponential it was the other way: input zero gave output one.'),
    hint: [
      L('Pastki egri chiziqqa kirish birga teng joyda qarang.', 'Посмотри на нижнюю кривую в точке, где вход равен единице.', 'Look at the lower curve where the input equals one.'),
      L("Birning logarifmi o'tgan darsda ko'rilgan.", 'Логарифм единицы разобран на прошлом уроке.', 'The logarithm of one was covered last lesson.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Soha va qiymatlar joy almashdi', 'Область и значения поменялись местами', 'The domain and the range swapped'),
  tag: 'd-vs-e',
  show: [
    [
      L("ko'rsatkichlida kirish har qanday", 'у показательной вход любой', 'for the exponential any input'),
      L('chiqish faqat musbat', 'выход только положительный', 'the output only positive'),
      'D(2^x) = (−∞; +∞)',
    ],
    [
      L('logarifmikda teskari', 'у логарифмической наоборот', 'for the logarithmic it is the other way'),
      L('kirish musbat, chiqish har qanday', 'вход положительный, выход любой', 'positive input, any output'),
      'D(log₂ x) = (0; +∞)',
    ],
  ],
  motion: ['swap'],
  audio: [
    A('mount', 'Aks nafaqat nuqtalarni, butun polosalarni ham joy almashtiradi.', 'Отражение меняет местами не только точки, но и целые полосы.', 'The reflection swaps not only points but whole bands.'),
    A('swap', "Ko'rsatkichli funksiyada kirish har qanday olinardi, chiqish esa faqat musbat chiqardi. Logarifmikda aynan teskari: kirish musbat bo'lishi shart, chiqish esa har qanday, yuqoriga ham pastga ham cheksiz. Bu ikki har xil fakt emas, ikki tomondan o'qilgan bitta fakt. Ikki jadvalni yodlash shart emas, o'qlar rol almashganini eslash yetadi.", 'У показательной функции вход брали любой, а выход выходил только положительный. У логарифмической ровно наоборот: вход обязан быть положительным, а выход бывает любым, и вверх, и вниз без предела. Это не два разных факта, а один, прочитанный с двух сторон. Заучивать две таблицы не надо, достаточно помнить, что оси поменялись ролями.', 'For the exponential any input was allowed and only a positive output came out. For the logarithmic it is exactly the other way: the input must be positive, and the output can be anything, up or down without limit. These are not two separate facts but one, read from two sides. There is no need to memorise two tables, it is enough to remember the axes swapped roles.'),
    A('work', "O'zingiz hisoblang. Logarifmik funksiyada noldan chapda iksning nechta qiymati tashlab ketiladi?", 'Посчитай сам. Сколько значений икс приходится пропустить у логарифмической функции слева от нуля?', 'Work it out yourself. How many values of x to the left of zero does the logarithmic function skip?'),
  ],
  work: {
    prompt: L('Noldan chapda iksning nechta qiymati yaraydi?', 'Сколько значений икс годится слева от нуля?', 'How many values of x on the left of zero are allowed?'),
    ok: L('Birortasi ham. Logarifm belgisi ostida faqat musbat son turadi, va butun chap yarim tushib qoladi.', 'Ни одного. Под знаком логарифма стоит только положительное число, и вся левая половина выпадает.', 'None. Only a positive number stands under the logarithm sign, and the whole left half drops out.'),
    hint: [
      L('Logarifm belgisi ostida nima turishini eslang.', 'Вспомни, что стоит под знаком логарифма.', 'Recall what stands under the logarithm sign.'),
      L("Manfiy son musbat asosning darajasi bo'lmaydi.", 'Отрицательное число степенью положительного основания не бывает.', 'A negative number is never a power of a positive base.'),
      L('Birortasi ham.', 'Ни одного.', 'None.'),
    ],
    answer: '0',
  },
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Nol chegara bo'lib qoladi", 'Ноль остаётся границей', 'Zero stays a boundary'),
  tag: 'nol-v-oblasti-opredeleniya',
  show: [
    [
      L("egri chiziq bo'ylab nolga yuramiz", 'идём по кривой к нулю', 'we walk along the curve towards zero'),
      L('qiymatlar pastga cheksiz ketadi', 'значения уходят вниз без предела', 'the values go down without limit'),
      'log₂ 0,001 ≈ −10',
    ],
    [
      L("egri chiziq vertikal o'qqa yetmaydi", 'вертикальной оси кривая не достигает', 'the curve never reaches the vertical axis'),
      L('demak nol kirmaydi', 'значит ноль не входит', 'so zero is not included'),
      'D(y) = (0; +∞)',
    ],
  ],
  motion: ['near'],
  audio: [
    A('mount', "Egri chiziq bo'ylab chapga, nolga yuramiz. Qiymatlar pastga ketadi va istagancha kichik bo'lib qoladi.", 'Пойдём по кривой влево, к нулю. Значения уходят вниз и становятся сколь угодно маленькими.', 'Let us walk left along the curve, towards zero. The values go down and become as small as you like.'),
    A('near', "Vertikal o'q asimptota deb belgilangan. Egri chiziq unga qanchalik yaqin kelsa ham yetmaydi. Sabab o'tgan darsdan ma'lum: logarifm bu ko'rsatkich, ikkining darajasi esa nol bo'lmaydi. Demak nol aniqlanish sohasida yo'q, u faqat chegara bo'lib qoladi. Bu ko'rsatkichli funksiyadagining o'zi, faqat chorak burilgan.", 'Вертикальная ось подписана как асимптота. Кривая подходит к ней сколь угодно близко, но не достигает. Причина уже известна с прошлого урока: логарифм это показатель, а степень двойки нулём не бывает. Значит нуля в области определения нет, и он остаётся только границей. Это то же самое, что было у показательной функции, только повёрнутое на четверть.', 'The vertical axis is labelled as an asymptote. The curve comes as close to it as you like but never reaches it. The reason is known from last lesson: a logarithm is an exponent, and a power of two is never zero. So zero is not in the domain and stays only a boundary. This is the same as for the exponential function, only turned by a quarter.'),
    A('work', "O'zingiz hisoblang. Egri chiziq vertikal o'qni necha marta kesadi?", 'Посчитай сам. Сколько раз кривая пересекает вертикальную ось?', 'Work it out yourself. How many times does the curve cross the vertical axis?'),
  ],
  work: {
    prompt: L("Egri chiziq vertikal o'qni necha marta kesadi?", 'Сколько раз кривая пересекает вертикальную ось?', 'How many times does the curve cross the vertical axis?'),
    ok: L("Bir marta ham. Ikkining darajasi nol bo'lmaydi, shuning uchun nol faqat chegara bo'lib qoladi.", 'Ни разу. Степень двойки нулём не бывает, поэтому ноль остаётся только границей.', 'Never. A power of two is never zero, so zero stays only a boundary.'),
    hint: [
      L("Egri chiziq o'qqa eng yaqin joyga qarang va tegdimi yoki yo'qmi tekshiring.", 'Посмотри, где кривая ближе всего к оси, и проверь, коснулась ли она.', 'Look where the curve is closest to the axis and check whether it touched.'),
      L('Nolning logarifmi ikkining nolga teng darajasini bildirardi.', 'Логарифм нуля означал бы степень двойки, равную нулю.', 'The logarithm of zero would mean a power of two equal to zero.'),
      L('Bir marta ham.', 'Ни разу.', 'Never.'),
    ],
    answer: '0',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Yo'nalishni asos beradi", 'Направление задаёт основание', 'The base sets the direction'),
  tag: 'vsegda-rastet',
  show: [
    [
      L('asos birdan kichik', 'основание меньше единицы', 'the base is less than one'),
      L('egri chiziq pastga ketdi', 'кривая пошла вниз', 'the curve went down'),
      'y = log₀,₅ x',
    ],
    [
      L("asimptota o'sha bo'lib qoldi", 'асимптота осталась той же', 'the asymptote stayed the same'),
      L('bir va nol nuqtasi ham', 'точка один и ноль тоже', 'so did the point one and zero'),
      '0 < a < 1',
    ],
  ],
  motion: ['flip'],
  audio: [
    A('mount', "Birdan kichik asos olamiz. Nol butun besh o'ndan.", 'Возьмём основание меньше единицы. Ноль целых пять десятых.', 'Let us take a base less than one. Zero point five.'),
    A('flip', "Egri chiziq teskari bo'lib pastga ketdi. Sabab ko'rsatkichli funksiyadagining o'zi: asos birdan kichik bo'lganda o'ngga qadam ko'paytirmaydi, bo'ladi. Egri chiziqning ko'rinishi o'zgarmadi, vertikal asimptota joyida qoldi, bir va nol nuqtasi ham. Faqat yo'nalish o'zgardi. Demak logarifmik funksiya ham ko'rsatkichli kabi doim o'smaydi.", 'Кривая перевернулась и пошла вниз. Причина та же, что у показательной функции: при основании меньше единицы шаг вправо не умножает, а делит. Вид кривой не изменился, вертикальная асимптота осталась на месте, точка один и ноль тоже. Поменялось только направление. Значит логарифмическая функция, как и показательная, не всегда растёт.', 'The curve flipped and went down. The reason is the same as for the exponential: with a base less than one a step right divides instead of multiplying. The shape did not change, the vertical asymptote stayed, so did the point one and zero. Only the direction changed. So a logarithmic function, like an exponential one, does not always grow.'),
    A('work', "O'zingiz hisoblang. Sakkizning nol butun besh o'ndan asosga ko'ra logarifmi nechaga teng?", 'Посчитай сам. Чему равен логарифм восьми по основанию ноль целых пять десятых?', 'Work it out yourself. What is the logarithm of eight to base zero point five?'),
  ],
  work: {
    prompt: L("Sakkizning nol butun besh o'ndan asosga ko'ra logarifmi nechaga teng?", 'Чему равен логарифм восьми по основанию ноль целых пять десятых?', 'What is the logarithm of eight to base zero point five?'),
    ok: L("Minus uch. Nol butun besh o'ndan minus uchinchi darajada bu sakkiz, logarifm esa aynan minus uch.", 'Минус три. Ноль целых пять десятых в минус третьей степени это восемь, и логарифм это как раз минус три.', 'Minus three. Zero point five to the minus third power is eight, and the logarithm is exactly minus three.'),
    hint: [
      L("So'rang: sakkiz chiqishi uchun nol butun besh o'ndanni qaysi darajaga ko'tarish kerak.", 'Спроси, в какую степень возвести ноль целых пять десятых, чтобы вышло восемь.', 'Ask which power of zero point five gives eight.'),
      L("Ko'rsatkichdagi minus kasrni teskari qiladi.", 'Минус в показателе переворачивает дробь.', 'The minus in the exponent turns the fraction over.'),
      L('Minus uch.', 'Минус три.', 'Minus three.'),
    ],
    answer: '−3',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Hisoblamasdan solishtirish', 'Сравнить, не вычисляя', 'Compare without computing'),
  tag: 'vsegda-rastet',
  show: [
    [
      L('asos birdan kichik', 'основание меньше единицы', 'the base is less than one'),
      L('demak egri chiziq kamayadi', 'значит кривая убывает', 'so the curve decreases'),
      '1)  log₀,₃ 7     2)  log₀,₃ 8',
    ],
    [
      L('katta argument kichik logarifm beradi', 'больший аргумент даёт меньший логарифм', 'a bigger argument gives a smaller logarithm'),
      L('hech narsani hisoblash shart emas', 'считать ничего не надо', 'nothing needs computing'),
      'log₀,₃ 7 > log₀,₃ 8',
    ],
  ],
  motion: ['cmp'],
  audio: [
    A('mount', "Asosi bir xil, nol butun uch o'ndan bo'lgan ikki logarifm. Belgi ostida yetti va sakkiz.", 'Два логарифма с одинаковым основанием ноль целых три десятых. Под знаком семь и восемь.', 'Two logarithms with the same base zero point three. Under the sign seven and eight.'),
    A('cmp', "Asos birdan kichik, demak egri chiziq kamayadi. Kamayuvchi egri chiziqda kirish qancha katta bo'lsa, chiqish shuncha kichik. Sakkiz yettidan katta, demak sakkizning logarifmi kichikroq. Birorta hisob qilmadik, yo'nalish yetdi. Chizmada tekshiring: ikkala nuqta bitta egri chiziqda yotadi, o'ngdagisi chapdagidan pastda.", 'Основание меньше единицы, значит кривая убывает. У убывающей кривой чем больше вход, тем меньше выход. Восемь больше семи, значит логарифм восьми меньше. Ни одного вычисления мы не сделали, хватило направления. Проверь по чертежу: обе точки лежат на одной кривой, и правая ниже левой.', 'The base is less than one, so the curve decreases. On a decreasing curve the bigger the input the smaller the output. Eight is greater than seven, so the logarithm of eight is smaller. We did no computation at all, the direction was enough. Check on the drawing: both points lie on one curve, and the right one is below the left.'),
    A('work', "O'zingiz hisoblang. Ikki logarifmning qaysi biri katta, birinchisimi yoki ikkinchisi?", 'Посчитай сам. Какой из двух логарифмов больше, первый или второй?', 'Work it out yourself. Which of the two logarithms is bigger, the first or the second?'),
  ],
  work: {
    prompt: L('Qaysi logarifm katta, birinchisimi yoki ikkinchisi?', 'Какой логарифм больше, первый или второй?', 'Which logarithm is bigger, the first or the second?'),
    ok: L('Birinchisi. Asos birdan kichik, shuning uchun kichik argument katta logarifm beradi.', 'Первый. Основание меньше единицы, поэтому меньший аргумент даёт больший логарифм.', 'The first. The base is less than one, so a smaller argument gives a bigger logarithm.'),
    hint: [
      L('Asosga qarang: u birdan kichik.', 'Посмотри на основание: оно меньше единицы.', 'Look at the base: it is less than one.'),
      L('Bunday asosda egri chiziq kamayadi.', 'При таком основании кривая убывает.', 'With such a base the curve decreases.'),
      L('Birinchisi.', 'Первый.', 'The first.'),
    ],
    answer: '1',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Logarifmik funksiya', 'Логарифмическая функция', 'The logarithmic function'),
  tag: 'd-vs-e',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidadan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Asimptotali egri chiziq ekranda qoladi, va qoida yonida ochiladi. Ta'rif darslikdan so'zma-so'z olingan, undagi xossalar esa biz aks bilan olganlarning o'zi.", 'Кривая с асимптотой остаётся на экране, и правило открывается рядом. Определение взято у учебника слово в слово, а свойства в нём те же, которые мы получили отражением.', 'The curve with its asymptote stays on the screen, and the rule opens beside it. The definition is taken from the textbook word for word, and its properties are the ones we got by reflection.'),
  ],
  probe: {
    question: L("Logarifmik funksiya ko'rsatkichlidan nimasi bilan farq qiladi?", 'Чем логарифмическая функция отличается от показательной?', 'How does a logarithmic function differ from an exponential one?'),
    items: [
      { id: 'a', label: L('kirish va chiqish joy almashdi', 'вход и выход поменялись местами', 'the input and the output swapped'), correct: true },
      { id: 'b', label: L("uning egri chizig'i boshqacha", 'у неё другая форма кривой', 'its curve has a different shape'), hint: L("Shakl o'sha: bu to'g'ri chiziqqa nisbatan aks etgan bitta egri chiziq.", 'Форма та же: это одна кривая, отражённая относительно прямой.', 'The shape is the same: it is one curve reflected in a line.') },
    ],
  },
  rule: {
    lawLabel: L("Ta'rif", 'Определение', 'The definition'),
    lines: [
      L("Ushbu y = logₐ x ko'rinishdagi funksiya logarifmik funksiya deyiladi.", 'Функцию вида игрек равен логарифму икс по основанию а называют логарифмической.', 'A function of the form y equals log x to base a is called logarithmic.'),
      L("Aniqlanish sohasi barcha musbat sonlar, qiymatlar to'plami barcha haqiqiy sonlar.", 'Область определения все положительные числа, множество значений все действительные.', 'The domain is all positive numbers, the range all real numbers.'),
      L("Asos birdan katta bo'lganda funksiya o'suvchi, nol va bir orasida bo'lganda kamayuvchi.", 'При основании больше единицы функция возрастает, при основании между нулём и единицей убывает.', 'With a base above one the function grows, with a base between zero and one it decays.'),
    ],
    law: 'y = logₐ x,   a > 0,  a ≠ 1',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("Argument to'rt bo'lgandagi qiymat", 'Значение при аргументе четыре', 'The value at argument four'),
  tag: 'vsegda-rastet',
  audio: [
    A('mount', "To'rt funksiya va to'rt qiymat. Ularni birlashtiring.", 'Четыре функции и четыре значения. Соедини их.', 'Four functions and four values. Match them.'),
  ],
  match: {
    prompt: L("Funksiyani argument to'rtga teng bo'lgandagi qiymati bilan birlashtiring.", 'Соедини функцию со значением при аргументе, равном четырём.', 'Match each function with its value at argument four.'),
    ok: L("Asos birdan katta bo'lsa qiymat musbat, kichik bo'lsa manfiy. Yo'nalish asosdan darrov ko'rinadi.", 'При основании больше единицы значение положительно, при меньшем отрицательно. Направление видно сразу по основанию.', 'With a base above one the value is positive, below one negative. The direction shows from the base at once.'),
    left: ['y = log₂ x', 'y = log₄ x', 'y = log₀,₅ x', 'y = log₀,₂₅ x'],
    a: '2',
    b: '1',
    c: '−2',
    d: '−1',
  },
}

const S10 = {
  role: 'guided',
  answer: 'build',
  format: 'table',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L("Chizma bo'yicha to'rt xossa", 'Четыре свойства по чертежу', 'Four properties from the drawing'),
  tag: 'd-vs-e',
  audio: [
    A('mount', "Funksiyaning to'rt xossasi. Har qatorga o'z yozuvini qo'ying.", 'Четыре свойства функции. Каждой строке поставь свою запись.', 'Four properties of the function. Give each row its own reading.'),
  ],
  table: {
    ok: L("To'rt xossa yopildi. To'rttasi ham aks bilan olingan, yodlanmagan.", 'Четыре свойства закрыты. Все четыре получены отражением, а не заучены.', 'Four properties are closed. All four came from the reflection, not from memorising.'),
    wrong: L("Chizmaga qarang: kirish gorizontal bo'yicha, chiqish vertikal bo'yicha.", 'Смотри на чертёж: вход по горизонтали, выход по вертикали.', 'Look at the drawing: the input along the horizontal, the output along the vertical.'),
    swap: L('Yozuvlar joy almashgan. Logarifmik funksiyada chiqish emas, kirish cheklangan.', 'Записи перепутаны местами. У логарифмической функции ограничен вход, а не выход.', 'The readings are swapped. For a logarithmic function the input is limited, not the output.'),
    rows: ['D(y)  →  (0; +∞)', 'E(y)  →  (−∞; +∞)', 'Ox  →  (1; 0)', 'Oy  →  ∅'],
    chips: ['(0; +∞)', '(−∞; +∞)', '(1; 0)', '∅'],
  },
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO INSTRUMENT'),
  title: L('Chizmasiz aniqlanish sohasi', 'Область определения без чертежа', 'The domain without a drawing'),
  tag: 'bumaga',
  audio: [
    A('mount', "Bu ekranda chizma yo'q. Imtihonda ham bo'lmaydi.", 'На этом экране чертежа нет. На экзамене его тоже не будет.', 'There is no drawing on this screen. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
  task: {
    ok: L("Bir. Belgi ostida iks minus bir turadi, va bu ifoda musbat bo'lishi kerak, demak iks birdan katta.", 'Единица. Под знаком стоит икс минус один, и это выражение должно быть положительным, значит икс больше единицы.', 'One. Under the sign stands x minus one, and that expression must be positive, so x is greater than one.'),
    hint: [
      L('Logarifm belgisi ostida musbat son turishi kerak.', 'Под знаком логарифма должно стоять положительное число.', 'A positive number must stand under the logarithm sign.'),
      L('Iks minus bir noldan katta tengsizligini yeching.', 'Реши неравенство икс минус один больше нуля.', 'Solve the inequality x minus one greater than zero.'),
      L('Bir.', 'Единица.', 'One.'),
    ],
    prompt: 'y = log₀,₅ (x − 1),   x > ?',
    answer: '1',
  },
  order: {
    prompt: L("O'sish tartibida joylashtiring.", 'Расставь по возрастанию.', 'Arrange in increasing order.'),
    title: L('Qaysi yozuv kichikroq?', 'Какая запись меньше?', 'Which reading is smaller?'),
    ok: L('Asos birdan katta, shuning uchun argumentlar tartibi va logarifmlar tartibi bir xil.', 'Основание больше единицы, поэтому порядок аргументов и порядок логарифмов совпадают.', 'The base is above one, so the order of the arguments and of the logarithms agree.'),
    bad: L('Har qiymatni hisoblang, keyin solishtiring.', 'Посчитай каждое значение, потом сравнивай.', 'Compute each value, then compare.'),
    items: ['log₂ 1', 'log₂ 4', 'log₂ 8', 'log₂ 16'],
    answer: 'log₂ 1  log₂ 4  log₂ 8  log₂ 16',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L("Javob deyarli to'g'ri. Qayerda?", 'Ответ почти верный. Где?', 'The answer is almost right. Where?'),
  tag: 'check',
  audio: [
    A('mount', 'Masala. Logarifmik funksiyaning aniqlanish sohasini topish.', 'Задача. Найти область определения логарифмической функции.', 'A task. Find the domain of a logarithmic function.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L('Bu qator shartni shunchaki qaytadan yozadi.', 'Эта строка просто переписывает условие.', 'This line just rewrites the task.'),
    r2: L("Bu to'g'ri: belgi ostida musbat turishi kerak.", 'Это верно: под знаком должно стоять положительное.', 'This is right: a positive number must stand under the sign.'),
    r4: L("Bu oldingi qatorning to'g'ri natijasi.", 'Это верное следствие предыдущей строки.', 'This is a correct consequence of the previous line.'),
  },
  proof: L("Bu yerda nol aniqlanish sohasiga kiritilgan, egri chiziq esa o'qqa yetmaydi.", 'Здесь ноль включили в область определения, а кривая до оси не доходит.', 'Here zero was included in the domain, and the curve does not reach the axis.'),
  entry: {
    prompt: L('Javobga qaysi son ortiqcha tushdi?', 'Какое число попало в ответ лишним?', 'Which number got into the answer as an extra?'),
    ok: L("Nol. U chegara bo'lib qoladi, aniqlanish sohasiga kirmaydi.", 'Ноль. Он остаётся границей, а в область определения не входит.', 'Zero. It stays a boundary and is not in the domain.'),
    hint: [
      L('Vertikal asimptotaga qarang.', 'Посмотри на вертикальную асимптоту.', 'Look at the vertical asymptote.'),
      L("Egri chiziq o'qqa yaqinlashadi, lekin tegmaydi.", 'Кривая подходит к оси, но не касается.', 'The curve comes close to the axis but does not touch.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
  row: {
    r1: 'y = log₂ x',
    r2: 'x > 0',
    r3: 'x ≥ 0',
    r4: 'D(y) = [0; +∞)',
  },
  answerId: 'r3',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("Nuqta bo'yicha asosni toping", 'По точке найди основание', 'From a point back to the base'),
  tag: 'obratnoe',
  audio: [
    A('mount', 'Endi teskari masala. Nuqta berilgan, asosni topish kerak.', 'Теперь обратная задача. Дана точка, а найти надо основание.', 'Now the inverse task. A point is given, and the base must be found.'),
    A('work', 'Avval asosni yozing, keyin hamma kamayuvchi funksiyani belgilaysiz.', 'Сначала запиши основание, потом отметишь все убывающие функции.', 'First type the base, then you will mark every decreasing function.'),
  ],
  multi: {
    prompt: L('Kamayuvchi hamma funksiyani belgilang.', 'Отметь все функции, которые убывают.', 'Mark every function that decreases.'),
    title: L('Qaysi funksiyalar kamayadi?', 'Какие функции убывают?', 'Which functions decrease?'),
    ok: L("To'rttadan ikkitasi. Asosi birdan kichik bo'lgani kamayadi.", 'Две из четырёх. Убывает та, у которой основание меньше единицы.', 'Two out of four. The one with a base below one decreases.'),
    items: [
      { id: 'c', label: 'y = log₂ x', hint: L("Asos birdan katta, egri chiziq o'sadi.", 'Основание больше единицы, кривая растёт.', 'The base is above one, the curve grows.') },
      { id: 'd', label: 'y = log₁₀ x', hint: L("O'n birdan katta, demak funksiya o'sadi.", 'Десятка больше единицы, значит функция растёт.', 'Ten is above one, so the function grows.') },
      { id: 'a', label: 'y = log₀,₅ x', ok: true },
      { id: 'b', label: 'y = log₀,₃ x', ok: true },
    ],
  },
  entry: {
    prompt: L("Egri chiziq abssissasi to'qqiz, ordinatasi ikki bo'lgan nuqtadan o'tadi. Uning asosi qanday?", 'Кривая проходит через точку с абсциссой девять и ординатой два. Какое у неё основание?', 'The curve passes through the point with abscissa nine and ordinate two. What is its base?'),
    ok: L("Uch. To'qqizning logarifmi ikkiga teng, demak asos kvadratda to'qqiz beradi.", 'Три. Логарифм девяти равен двум, значит основание в квадрате даёт девять.', 'Three. The logarithm of nine is two, so the base squared gives nine.'),
    hint: [
      L("Logarifm ikkiga teng, demak asos kvadratga ko'tariladi.", 'Логарифм равен двум, значит основание берут в квадрате.', 'The logarithm is two, so the base is squared.'),
      L("Qaysi son kvadratda to'qqiz beradi.", 'Какое число в квадрате даёт девять.', 'Which number squared gives nine.'),
      L('Uch.', 'Три.', 'Three.'),
    ],
    answer: '3',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'nol-v-oblasti-opredeleniya',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Logarifmik funksiyaning aniqlanish sohasi qanday?', 'Какая область определения у логарифмической функции?', 'What is the domain of a logarithmic function?'),
      done: 'D(y) = (0; +∞)',
      items: [
        { id: 'a', label: L('musbat sonlar', 'положительные числа', 'the positive numbers'), correct: true },
        { id: 'b', label: L('hamma son', 'все числа', 'all numbers'), hint: L("Noldan chapda egri chiziq umuman yo'q.", 'Слева от нуля кривой нет вовсе.', 'To the left of zero there is no curve at all.') },
        { id: 'c', label: L('noldan birgacha', 'от нуля до единицы', 'from zero to one'), hint: L("Birdan o'ngda egri chiziq cheksiz davom etadi.", 'Правее единицы кривая продолжается без предела.', 'To the right of one the curve continues without limit.') },
        { id: 'd', label: L('butun sonlar', 'целые числа', 'the whole numbers'), hint: L("Butun sonlar orasidan ham egri chiziq o'tadi.", 'Между целыми кривая тоже проходит.', 'The curve passes between the whole numbers too.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Logarifmik funksiyaning qiymatlar to'plami qanday?", 'Какое множество значений у логарифмической функции?', 'What is the range of a logarithmic function?'),
      done: 'E(y) = (−∞; +∞)',
      items: [
        { id: 'a', label: L('hamma son', 'все числа', 'all numbers'), correct: true },
        { id: 'b', label: L('musbat sonlar', 'положительные числа', 'the positive numbers'), hint: L("Musbat qiymatlar ko'rsatkichlida edi, bu yerda o'qlar rol almashgan.", 'Положительные значения были у показательной, здесь оси поменялись ролями.', 'Positive values belonged to the exponential, here the axes swapped roles.') },
        { id: 'c', label: L('noldan birgacha', 'от нуля до единицы', 'from zero to one'), hint: L('Egri chiziq yuqoriga ham pastga ham cheksiz ketadi.', 'Кривая уходит и вверх, и вниз без предела.', 'The curve goes both up and down without limit.') },
        { id: 'd', label: L('faqat butun', 'только целые', 'only whole numbers'), hint: L('Butun sonlar orasida ham qiymatlar bor.', 'Между целыми значения тоже есть.', 'There are values between the whole numbers too.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Har qanday logarifmik egri chiziq qaysi nuqtadan o'tadi?", 'Через какую точку проходит любая логарифмическая кривая?', 'Which point does every logarithmic curve pass through?'),
      done: '(1; 0)',
      items: [
        { id: 'a', label: L('abssissasi bir, ordinatasi nol', 'абсцисса один, ордината ноль', 'abscissa one, ordinate zero'), correct: true, ok: L('Ha. Birning logarifmi har qanday asosda nolga teng.', 'Да. Логарифм единицы равен нулю при любом основании.', 'Yes. The logarithm of one is zero for any base.') },
        { id: 'b', label: L('koordinatalar boshi', 'начало координат', 'the origin'), hint: L("Koordinatalar boshida abssissa nol, nol esa aniqlanish sohasida yo'q.", 'В начале координат абсцисса ноль, а нуля в области определения нет.', 'At the origin the abscissa is zero, and zero is not in the domain.') },
        { id: 'c', label: L('abssissasi nol, ordinatasi bir', 'абсцисса ноль, ордината один', 'abscissa zero, ordinate one'), hint: L("Bu ko'rsatkichli egri chiziqning nuqtasi, logarifmikda u aks etgan.", 'Это точка показательной кривой, у логарифмической она отражённая.', 'That is a point of the exponential curve, for the logarithmic it is reflected.') },
        { id: 'd', label: L('birorta umumiy nuqtadan ham', 'ни через какую общую', 'through no common point'), hint: L('Birning logarifmi doim nolga teng, demak nuqta umumiy.', 'Логарифм единицы равен нулю всегда, значит точка общая.', 'The logarithm of one is always zero, so the point is common.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Qaysi asosda funksiya kamayadi?', 'При каком основании функция убывает?', 'With which base does the function decrease?'),
      done: '0 < a < 1',
      items: [
        { id: 'a', label: L('birdan kichik', 'меньше единицы', 'less than one'), correct: true },
        { id: 'b', label: L('birdan katta', 'больше единицы', 'greater than one'), hint: L("Bunday asosda egri chiziq o'sadi.", 'При таком основании кривая растёт.', 'With such a base the curve grows.') },
        { id: 'c', label: L('har qanday', 'любом', 'any'), hint: L('Ekrandagi ikki egri chiziq har xil tomonga ketdi, demak asos hal qiladi.', 'Две кривые на экране шли в разные стороны, значит основание решает.', 'The two curves on the screen went opposite ways, so the base decides.') },
        { id: 'd', label: L('manfiy', 'отрицательном', 'negative'), hint: L('Manfiy asos umuman olinmaydi.', 'Отрицательное основание не берут вовсе.', 'A negative base is not taken at all.') },
      ],
    },
  ],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  audio: [
    A('mount', 'Dars boshida ikki yozuvdan birini tanlash kerak edi. Mana natija.', 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you had to choose one of two readings. Here is the result.'),
    A('next', "Egri chiziq vertikal o'qqa qanchalik yaqin kelsa ham tegmaydi. Nol aniqlanish sohasining chegarasi bo'lib qoladi, uning qiymati bo'lmaydi.", 'Кривая подходит к вертикальной оси сколь угодно близко и не касается её. Ноль остаётся границей области определения, а её значением не становится.', 'The curve comes as close to the vertical axis as you like and never touches it. Zero stays the boundary of the domain and never becomes a value of it.'),
  ],
  can: [
    L("Logarifmikni ko'rsatkichlining aksi deb ko'raman", 'Вижу логарифмическую как отражение показательной', 'I see the logarithmic as a reflection of the exponential'),
    L('Kirish musbat, chiqish har qanday ekanini bilaman', 'Знаю, что вход положительный, а выход любой', 'I know the input is positive and the output is anything'),
    L("Yo'nalishni asos bo'yicha o'qiyman", 'Направление читаю по основанию', 'I read the direction from the base'),
    L('Logarifmlarni hisoblamasdan solishtiraman', 'Сравниваю логарифмы, не вычисляя', 'I compare logarithms without computing'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L('Bitta joy takrorlashni talab qiladi: aniqlanish sohasi.', 'Одно место требует повтора: область определения.', 'One place needs review: the domain.'),
    back: L('Qoidaga va 5-ekranga qayting.', 'Вернись к правилу и к экрану 5.', 'Go back to the rule and to screen 5.'),
  },
  bridge: L("Keyin belgi ostida noma'lumli ifoda bo'ladi, va joiz qiymatlar polosasi kerak bo'ladi.", 'Дальше под знаком окажется выражение с неизвестным, и понадобится полоса допустимых значений.', 'Next an expression with the unknown will stand under the sign, and the band of admissible values will be needed.'),
  lifehack: L("Egri chiziq qayoqqa ketishini esdan chiqardingizmi, asosga qarang. Birdan katta bo'lsa yuqoriga, kichik bo'lsa pastga.", 'Забыл, куда идёт кривая, посмотри на основание. Больше единицы вверх, меньше единицы вниз.', 'Forgot which way the curve goes, look at the base. Above one it rises, below one it falls.'),
  sheetTitle: L('Logarifmik funksiya · shpargalka', 'Логарифмическая функция · шпаргалка', 'The logarithmic function · cheat sheet'),
  sheetSrc: L('10-sinf · 30-dars', '10 класс · урок 30', 'Grade 10 · lesson 30'),
  hook: {
    a: 'log₂ 0 = 0',
    b: 'x > 0',
  },
  proved: 'x > 0',
  law: 'y = logₐ x,   a > 0,  a ≠ 1',
  sheet: [
    'D(y) = (0; +∞)',
    'E(y) = (−∞; +∞)',
    '(1; 0)',
    'a > 1   →   ↑',
    '0 < a < 1   →   ↓',
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

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const FN_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const FN_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

const PROP_ROWS = S10.table.rows.map((r, i) => {
  const [key, answer] = r.split('→').map((x) => x.trim())
  return { id: 'p' + i, key, answer }
})
const PROP_CHIPS = S10.table.chips.map((label) => ({ id: label, label }))

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
        // Кривая есть, а ответа на ней нет: слева она идёт в пикселе от оси,
        // и на глаз коснулась или нет -- не различить. Асимптоту называет
        // только экран 5.
        fig={() => <Scene fig={<Plane step={1} curve="log" show="none" />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.1}>
        <Col>
          <Scene fig={<Plane step={1} curve="log" show="none" mark={[1, 0]} />} max={300} />
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
      /* СВИДЕТЕЛЬ УРОКА. Две кривые в одном окне, между ними прямая, у
         которой вход равен выходу. Масштаб по обеим осям ОДИНАКОВ -- иначе
         прямая пошла бы под другим углом и отражение стало бы неправдой. */
      <Scene
        fig={<Plane step={phase} curve="pair" show="none" mark={[[0, 1], [1, 0]]} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="pair" show="none" mark={[[0, 1], [1, 0]]} />} max={300} />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S3.work.prompt}
            answer={num(S3.work.answer)}
            okText={S3.work.ok}
            hints={S3.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen4 = (p) => (
  <Screen data={S4} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S4.show.length && !solved ? (
      /* Полоса допустимых входов: у логарифмической она справа от нуля, у
         показательной была вся ось. Отражение поменяло их местами. */
      <Scene
        fig={<Plane step={phase + 1} curve="log" show="dom" mark={[1, 0]} />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={2} curve="log" show="dom" mark={[1, 0]} />} max={300} />
        </Col>
        <Col>
          <NumberEntry
            compact
            prompt={S4.work.prompt}
            answer={num(S4.work.answer)}
            okText={S4.work.ok}
            hints={S4.work.hint}
            audio={audio}
            onSolved={solve}
          />
        </Col>
      </Cols>
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      <Scene
        fig={<Plane step={phase} curve="log" show="none" mark={[1, 0]} />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="log" show="none" mark={[1, 0]} />} max={300} />
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
      /* Та же кривая при основании меньше единицы: вид тот же, асимптота та
         же, точка один и ноль та же, направление противоположное. */
      <Scene
        fig={<Plane step={phase} curve="logdown" show="none" mark={[1, 0]} />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="logdown" show="none" mark={[1, 0]} />} max={300} />
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
      <Scene
        fig={<Plane step={phase} curve="logdown" show="none" />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="logdown" show="none" />} max={300} />
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
        fig={(solved) => (
          <Scene
            fig={<Plane step={solved ? 2 : 1} curve="log" show={solved ? 'dom' : 'none'} mark={[1, 0]} />}
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
        left={FN_LEFT}
        right={FN_RIGHT}
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
      <SlotTable
        figH={168}
        rows={PROP_ROWS}
        chips={PROP_CHIPS}
        okText={S10.table.ok}
        wrongText={S10.table.wrong}
        fig={<Plane step={2} curve="log" show="dom" mark={[1, 0]} />}
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
          <Scene fig={<Plane step={1} curve="log" show="none" mark={[9, 2]} />} max={300} />
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
        // Четвёртый вопрос про направление: там кривая с основанием меньше
        // единицы, у остальных обычная.
        fig={(round) => (
          <Scene
            fig={<Plane step={1} curve={round === 3 ? 'logdown' : 'log'} show="none" mark={[1, 0]} />}
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
