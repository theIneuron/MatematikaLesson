// ============================================================================
// 10-sinf, Dars 24. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS24_KONTENT.md
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
} from './tools.jsx'

import { DomainBand, Plane } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
// REJA SATRINING IKKINCHI YARMI: 24-dars 23-darsning temasini davom ettiradi.
// Reja satri bitta, darslar ikkita; nomer esa har darsda o'zining.
const LESSON_NO = 24
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Ko'rsatkichli va logarifmik tengsizliklar`,
  `Урок ${LESSON_NO}. Показат. и логарифм. неравенства`,
  `Lesson ${LESSON_NO}. Exponential and logarithmic inequalities`,
)

const BLOCK = { label: 'B5', from: 15, to: 27, current: 24 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('TENGSIZLIK', 'НЕРАВЕНСТВО', 'THE INEQUALITY'),
  title: L('Minus ikkidan kattami yoki kichikmi', 'Больше или меньше минус двух', 'Greater or less than minus two'),
  audio: [
    A('mount', "Nol butun besh o'ndan iks darajada to'rtdan katta. Asos birdan kichik, va bu yerda asosiysi shu.", 'Ноль целых пять десятых в степени икс больше четырёх. Основание меньше единицы, и это здесь главное.', 'Zero point five to the power x is greater than four. The base is less than one, and that is what matters here.'),
    A('r1', "Birinchi yozuv tenglamani o'qigandek o'qiydi: minus ikkinchi darajada to'rt chiqar ekan, demak iks minus ikkidan katta.", 'Первая запись читает так же, как читали бы уравнение: раз в степени минус два выходит четыре, то икс больше минус двух.', 'The first reading goes just as one would read an equation: since the power minus two gives four, then x is greater than minus two.'),
    A('r2', "Ikkinchisi ishorani ag'darish kerak deydi, va aksi to'g'ri: iks minus ikkidan kichik.", 'Вторая говорит, что знак надо перевернуть, и верно обратное: икс меньше минус двух.', 'The second says the sign must be flipped, and the opposite holds: x is less than minus two.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi chizmaga qaraymiz.', 'Твой ответ записан. Сейчас посмотрим на чертёж.', 'Your answer is saved. Now we will look at the drawing.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('ishorani avvalgidek qoldirdik', 'знак оставили как был', 'the sign was left as it was'),
      value: 'x > −2',
    },
    b: {
      name: L("ishorani ag'dardik", 'знак перевернули', 'the sign was flipped'),
      value: 'x < −2',
    },
  },
  expr: '0,5^x > 4',
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
      prompt: L("Asos birdan kichik bo'lganda ko'rsatkichli egri chiziq nima qiladi?", 'Что делает показательная кривая при основании меньше единицы?', 'What does an exponential curve do when the base is less than one?'),
      done: '0 < a < 1',
      items: [
        { id: 'a', label: L('kamayadi', 'убывает', 'it decreases'), correct: true },
        { id: 'b', label: L("o'sadi", 'растёт', 'it grows'), hint: L("U asos birdan katta bo'lganda o'sadi.", 'Растёт она при основании больше единицы.', 'It grows when the base is greater than one.') },
        { id: 'c', label: L("to'g'ri chiziq bo'lib qoladi", 'остаётся прямой', 'it stays a straight line'), hint: L("To'g'ri chiziq faqat asos birga teng bo'lganda chiqadi.", 'Прямая выходит только при основании, равном единице.', 'A straight line comes only when the base equals one.') },
        { id: 'd', label: L("iksga bog'liq", 'зависит от икс', 'it depends on x'), hint: L("Uning yo'nalishi butun chiziqda bitta.", 'Направление у неё одно на всей прямой.', 'Its direction is the same along the whole line.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Ikkining iks darajasi qaysi iksda sakkizga teng?', 'При каком икс двойка в степени икс равна восьми?', 'For which x does two to the power x equal eight?'),
      done: '2^x = 8   →   x = 3',
      items: [
        { id: 'a', label: L('uch', 'три', 'three'), correct: true },
        { id: 'b', label: L("to'rt", 'четыре', 'four'), hint: L("To'rt bo'lish bilan chiqardi, ko'rsatkich kerak esa.", 'Четыре вышло бы делением, а нужен показатель.', 'Four would come from dividing, and an exponent is what is needed.') },
        { id: 'c', label: L('sakkiz', 'восемь', 'eight'), hint: L('Sakkiz qiymat, savol esa iks haqida.', 'Восемь это значение, а спросили про икс.', 'Eight is the value, and the question was about x.') },
        { id: 'd', label: L('ikki', 'два', 'two'), hint: L("Ikkining kvadrati to'rt beradi, sakkiz emas.", 'Два в квадрате даёт четыре, а не восемь.', 'Two squared gives four, not eight.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Logarifm belgisi ostida qanday son turishi mumkin?', 'Какое число может стоять под знаком логарифма?', 'Which number can stand under a logarithm sign?'),
      done: 'x > 0',
      items: [
        { id: 'a', label: L('faqat musbat', 'только положительное', 'only a positive one'), correct: true },
        { id: 'b', label: L('har qanday', 'любое', 'any'), hint: L("Egri chiziq noldan chapda umuman o'tmaydi.", 'Кривая слева от нуля не проходит вовсе.', 'The curve does not pass to the left of zero at all.') },
        { id: 'c', label: L('noldan boshqa har qanday', 'любое, кроме нуля', 'any except zero'), hint: L('Manfiylar ham tushib qoladi, faqat nol emas.', 'Отрицательные тоже выпадают, а не только ноль.', 'The negatives drop out too, not only zero.') },
        { id: 'd', label: L('faqat butun', 'только целое', 'only a whole number'), hint: L("Kasr yaraydi, faqat musbat bo'lsa.", 'Дробное годится, лишь бы положительное.', 'A fractional one works, as long as it is positive.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Javob tomon, nuqta emas', 'Ответ это сторона, а не точка', 'The answer is a side, not a point'),
  tag: 'osnovanie-menshe-odnogo',
  show: [
    [
      L("egri chiziq o'sadi, to'g'ri chiziq to'rt darajada", 'кривая растёт, прямая на уровне четыре', 'the curve grows, the line is at level four'),
      L("uchrashuv ikkiga to'g'ri keladi", 'встреча приходится на двойку', 'the meeting falls on two'),
      L('bu tenglamaning javobi, tengsizlikniki emas', 'это ответ уравнения, но не неравенства', 'that is the answer of the equation, not of the inequality'),
    ],
    [
      L("egri chiziq pastroq bo'lgan joy bo'yalgan", 'закрашено там, где кривая ниже', 'the shading is where the curve is lower'),
      L("o'suvchi egri chiziqda bu chapda", 'у растущей кривой это слева', 'for a growing curve that is on the left'),
      L('javob nur, son emas', 'ответ это луч, а не число', 'the answer is a ray, not a number'),
    ],
  ],
  motion: ['side'],
  audio: [
    A('mount', "Tanish egri chiziq va tanish gorizontalni olamiz. Bularning hammasi ko'rsatkichli tenglamalar darsida bo'lgan.", 'Возьмём знакомую кривую и знакомую горизонталь. Всё это уже было в уроке про показательные уравнения.', 'Let us take the familiar curve and the familiar horizontal. All of this was in the lesson on exponential equations.'),
    A('side', "Ikkining iks darajasi egri chizig'i o'sadi, to'g'ri chiziq to'rt darajada turadi. Ular bitta nuqtada uchrashadi, uchrashuv esa ikkiga to'g'ri keladi. Ilgari biz shu yerda to'xtardik: tenglamaning javobi ikki. Lekin bizda tengsizlik, savol esa boshqa. Uchrashuv qayerda emas, egri chiziq qayerda to'g'ri chiziqdan past ekani so'ralyapti. Qarang: ikkidan chapda egri chiziq to'g'ri chiziq ostidan boradi, o'ngda esa ustidan. Demak javob ikkidan chapdagi butun nur. Uchrashuv nuqtasi hech qayerga ketgani yo'q, lekin u javobning o'zi emas, chegarasi bo'lib qoldi.", 'Кривая двойка в степени икс растёт, прямая стоит на уровне четыре. Встречаются они в одной точке, и приходится встреча на двойку. Раньше на этом мы бы остановились: у уравнения ответ два. Но у нас неравенство, и вопрос другой. Спрашивают не где встреча, а где кривая ниже прямой. Смотри: слева от двойки кривая идёт под прямой, справа над ней. Значит ответ это весь луч левее двойки. Точка встречи никуда не делась, но она стала границей ответа, а не самим ответом.', 'The curve two to the power x grows, the line stands at level four. They meet at a single point, and the meeting falls on two. Earlier we would have stopped there: the equation has the answer two. But we have an inequality, and the question is different. It asks not where they meet, but where the curve is below the line. Look: to the left of two the curve runs under the line, to the right above it. So the answer is the whole ray to the left of two. The meeting point has not gone anywhere, but it has become the boundary of the answer rather than the answer itself.'),
    A('work', "O'zingiz hisoblang. Egri chiziq qaysi iksda to'g'ri chiziqni uchratadi?", 'Посчитай сам. При каком икс кривая встречает прямую?', 'Work it out yourself. At which x does the curve meet the line?'),
  ],
  work: {
    prompt: L('Uchrashuv qaysi iksda?', 'При каком икс встреча?', 'At which x is the meeting?'),
    ok: L("Ikkida. Ikkining kvadrati to'rtga teng, va bu javobning chegarasi.", 'При двойке. Два в квадрате равно четырём, и это граница ответа.', 'At two. Two squared equals four, and that is the boundary of the answer.'),
    hint: [
      L("Ikki qaysi darajada to'rt berishini toping.", 'Найди, в какой степени двойка даёт четыре.', 'Find the power at which two gives four.'),
      L("Egri chiziq gorizontalni qayerda kesib o'tishiga qarang.", 'Посмотри, где кривая пересекает горизонталь.', 'See where the curve crosses the horizontal.'),
      L('Ikki.', 'Два.', 'Two.'),
    ],
    expr: '2^x < 4',
    answer: '2',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'order',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Bitta chizma, ikki savol', 'Один чертёж, два вопроса', 'One drawing, two questions'),
  tag: 'osnovanie-menshe-odnogo',
  show: [
    [
      L("tenglama uchrashuv qayerdaligini so'raydi", 'уравнение спрашивает где встреча', 'the equation asks where they meet'),
      L('javob u yerda bitta son', 'ответ там одно число', 'the answer there is a single number'),
      L("chizma esa o'sha-o'sha", 'чертёж при этом тот же самый', 'the drawing is the very same'),
    ],
    [
      L("tengsizlik qaysi tomondan ekanini so'raydi", 'неравенство спрашивает с какой стороны', 'the inequality asks on which side'),
      L('javob u yerda butun nur', 'ответ там целый луч', 'the answer there is a whole ray'),
      L('son chegaraga aylandi', 'число стало границей', 'the number became a boundary'),
    ],
  ],
  motion: ['two'],
  audio: [
    A('mount', 'Bir xil chizmada ikki savolni solishtiramiz.', 'Сравним два вопроса на одном и том же чертеже.', 'Let us compare two questions on one and the same drawing.'),
    A('two', "Birinchi savol: ikkining iks darajasi qaysi iksda to'rtga teng. Bu tenglama, uning javobi bitta, ikkilik. Ikkinchi savol: ikkining iks darajasi qaysi iksda to'rtdan kichik. Bu tengsizlik, uning javobi cheksiz ko'p son, ikkidan chapdagi butun nur. Chizma esa bitta, uchrashuv nuqtasi ham bitta. Faqat undan nima o'qiyotganimiz o'zgaradi. Aynan shuning uchun tengsizlikni chizmadan ajratib yechish xavfli: chizmada tomon ko'rinadi, bitta formuladan esa uni taxmin qilishga to'g'ri keladi.", 'Первый вопрос: при каком икс двойка в степени икс равна четырём. Это уравнение, и ответ у него один, двойка. Второй вопрос: при каких икс двойка в степени икс меньше четырёх. Это неравенство, и ответ у него бесконечно много чисел, весь луч левее двойки. Чертёж при этом один и тот же, и точка встречи одна и та же. Меняется только то, что мы с неё читаем. Именно поэтому решать неравенство отдельно от чертежа опасно: с чертежа сторона видна, а из одной формулы её приходится угадывать.', 'The first question: at which x does two to the power x equal four. That is an equation, and it has one answer, two. The second question: for which x is two to the power x less than four. That is an inequality, and it has infinitely many answers, the whole ray to the left of two. The drawing is the same, and the meeting point is the same. Only what we read from it changes. This is exactly why solving an inequality away from the drawing is dangerous: on the drawing the side is visible, from a formula alone it has to be guessed.'),
    A('work', "Chizmani o'qigan tartibimizda qadamlarni joylashtiring.", 'Расставь шаги в том порядке, в котором мы читали чертёж.', 'Put the steps in the order in which we read the drawing.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring', 'Расставь шаги по порядку', 'Put the steps in order'),
    s1: L('gorizontal egri chiziqni uchratadi', 'горизонталь встречает кривую', 'the horizontal meets the curve'),
    s2: L('uchrashuv son beradi', 'встреча даёт число', 'the meeting gives a number'),
    s3: L('egri chiziq qayerda pastroq ekaniga qaraymiz', 'смотрим, где кривая ниже', 'we see where the curve is lower'),
    s4: L('shu tomonni olamiz', 'берём эту сторону', 'we take that side'),
    ok: L("To'g'ri. Uchrashuv birinchi, tomon ikkinchi, bu tartib o'zgarmaydi.", 'Верно. Встреча первая, сторона вторая, и порядок этот не меняется.', 'Correct. The meeting comes first, the side second, and this order does not change.'),
    bad: L("Uchrashuv topilmaguncha tomonni tanlab bo'lmaydi.", 'Сторону нельзя выбрать, пока не найдена встреча.', 'You cannot choose a side until the meeting is found.'),
    mark: '2^x = 4   →   x = 2',
  },
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Egri chiziq pastga ketdi, bo'lak ko'chdi", 'Кривая пошла вниз, участок переехал', 'The curve went down, the piece moved'),
  tag: 'osnovanie-menshe-odnogo',
  show: [
    [
      L('asos birdan kichik', 'основание меньше единицы', 'the base is less than one'),
      L("egri chiziq chapdan o'ngga kamayadi", 'кривая убывает слева направо', 'the curve decreases from left to right'),
      L("uchrashuv minus ikkiga to'g'ri keladi", 'встреча приходится на минус два', 'the meeting falls on minus two'),
    ],
    [
      L("to'g'ri chiziqdan yuqorisi endi chapda", 'выше прямой теперь слева', 'above the line is now on the left'),
      L('demak javob minus ikkidan chapda', 'значит ответ левее минус двух', 'so the answer is left of minus two'),
      L("ishora o'zidan-o'zi ag'darildi", 'знак перевернулся сам собой', 'the sign flipped by itself'),
    ],
  ],
  motion: ['flip'],
  audio: [
    A('mount', 'Dars boshidagi tengsizlikka qaytamiz. Asos birdan kichik.', 'Возвращаемся к неравенству из начала урока. Основание меньше единицы.', 'Back to the inequality from the beginning of the lesson. The base is less than one.'),
    A('flip', "Egri chiziq endi kamayadi: iks qancha katta bo'lsa, qiymat shuncha kichik. To'rt darajadagi gorizontal uni minus ikkida uchratadi, buni tekshirish oson: nol butun besh o'ndanning minus ikkinchi darajasi to'rtga teng. Keyin esa diqqat bilan. Bizga egri chiziq to'g'ri chiziqdan YUQORI bo'lgan joy kerak, chunki tengsizlikda katta ishorasi turibdi. O'suvchi egri chiziqda yuqorisi o'ngda edi, bunisida esa aksincha: chapda. Demak javob minus ikkidan chapdagi nur. E'tibor bering, biz ishorani ag'darmadik. U o'zi ag'darildi, chunki egri chiziq boshqa tomonga ketdi. Bu yerda yodlaydigan narsa yo'q, shunchaki chizmaga qarash kerak.", 'Кривая теперь убывает: чем больше икс, тем меньше значение. Горизонталь на уровне четыре встречает её при минус двух, и это легко проверить: ноль целых пять десятых в степени минус два равно четырём. А дальше внимательно. Нам нужно, где кривая ВЫШЕ прямой, потому что в неравенстве стоит знак больше. У растущей кривой выше было справа, а у этой всё наоборот: слева. Значит ответ это луч левее минус двух. Обрати внимание, знака мы не переворачивали. Он перевернулся сам, потому что кривая пошла в другую сторону. Заучивать тут нечего, надо просто смотреть на чертёж.', 'The curve now decreases: the bigger x is, the smaller the value. The horizontal at level four meets it at minus two, and that is easy to check: zero point five to the minus two equals four. Now pay attention. We need where the curve is ABOVE the line, because the inequality has a greater-than sign. For a growing curve, above was on the right; for this one it is the opposite: on the left. So the answer is the ray to the left of minus two. Notice that we did not flip any sign. It flipped by itself, because the curve went the other way. There is nothing to memorise here, one just has to look at the drawing.'),
    A('work', "O'zingiz hisoblang. Uchrashuv qaysi iksda?", 'Посчитай сам. При каком икс встреча?', 'Work it out yourself. At which x is the meeting?'),
  ],
  work: {
    prompt: L('Uchrashuv qaysi iksda?', 'При каком икс встреча?', 'At which x is the meeting?'),
    ok: L("Minus ikkida. Nol butun besh o'ndanning minus ikkinchi darajasi to'rtga teng.", 'При минус двух. Ноль целых пять десятых в степени минус два равно четырём.', 'At minus two. Zero point five to the minus two equals four.'),
    hint: [
      L("Manfiy ko'rsatkichli daraja kasrni ag'daradi.", 'Степень с отрицательным показателем переворачивает дробь.', 'A negative exponent turns the fraction over.'),
      L("Ikkining kvadrati to'rt, demak ko'rsatkich manfiy.", 'Две в квадрате это четыре, значит показатель отрицательный.', 'Two squared is four, so the exponent is negative.'),
      L('Minus ikki.', 'Минус два.', 'Minus two.'),
    ],
    expr: '0,5^x > 4',
    answer: '−2',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("O'sha ish boshqa egri chiziqda", 'Та же работа на другой кривой', 'The same work on another curve'),
  tag: 'odz-logarifma',
  show: [
    [
      L("egri chiziq logarifmik, o'suvchi", 'кривая логарифмическая, растущая', 'the curve is logarithmic and growing'),
      L('gorizontal uch darajada', 'горизонталь на уровне три', 'the horizontal is at level three'),
      L("to'g'ri chiziqdan pasti chapda yotadi", 'ниже прямой лежит слева', 'below the line lies on the left'),
    ],
    [
      L('lekin chapda egri chiziq uziladi', 'но слева кривая обрывается', 'but on the left the curve breaks off'),
      L('u nolgacha yetmaydi', 'до нуля она не доходит', 'it does not reach zero'),
      L('demak javobning ikki uchi bor', 'значит у ответа два конца', 'so the answer has two ends'),
    ],
  ],
  motion: ['log'],
  audio: [
    A('mount', "Ish o'sha, egri chiziq boshqa. Bu yerda ko'rsatkichlida bo'lmagan narsa paydo bo'ladi.", 'Работа та же, кривая другая. Здесь появится то, чего у показательной не было.', 'The same work, a different curve. Here something appears that the exponential did not have.'),
    A('log', "Logarifmik egri chiziq o'sadi, uch darajadagi gorizontal uni sakkizda uchratadi: ikkining kubi sakkizga teng. To'g'ri chiziqdan past qismda egri chiziq shu nuqtadan chapda boradi, demak iks sakkizdan kichik. Lekin chap chekkaga qarang. Egri chiziq tik o'qqa yetmaydi va noldan chapda umuman mavjud emas. Demak javobni bitta tengsizlik bilan yozib bo'lmaydi: yuqoridan u sakkiz bilan, pastdan nol bilan chegaralangan. Ko'rsatkichli tengsizlikda bunday bo'lmagan, u yerda egri chiziq butun chiziq bo'ylab borardi. Ikki oila orasidagi farq ana shu, va u qoidalarda emas, egri chiziq qayerda yashashida.", 'Логарифмическая кривая растёт, и горизонталь на уровне три встречает её при восьми: два в кубе равно восьми. Ниже прямой кривая идёт слева от этой точки, значит икс меньше восьми. Но посмотри на левый край. Кривая не доходит до вертикальной оси и слева от нуля не существует вовсе. Значит одним неравенством ответ не описать: сверху он ограничен восьмёркой, а снизу нулём. У показательного неравенства такого не было, там кривая шла по всей прямой. Вот и разница между двумя семействами, и она не в правилах, а в том, где кривая живёт.', 'The logarithmic curve grows, and the horizontal at level three meets it at eight: two cubed equals eight. Below the line the curve runs to the left of that point, so x is less than eight. But look at the left edge. The curve does not reach the vertical axis and does not exist to the left of zero at all. So the answer cannot be written with one inequality: from above it is bounded by eight, from below by zero. The exponential inequality had nothing of the kind, there the curve ran along the whole line. That is the difference between the two families, and it lies not in the rules but in where the curve lives.'),
    A('work', "O'zingiz hisoblang. Javob yuqoridan qaysi son bilan chegaralangan?", 'Посчитай сам. Каким числом ответ ограничен сверху?', 'Work it out yourself. Which number bounds the answer from above?'),
  ],
  work: {
    prompt: L('Javob yuqoridan nima bilan chegaralangan?', 'Чем ответ ограничен сверху?', 'What bounds the answer from above?'),
    ok: L("Sakkiz bilan. Ikkining kubi sakkizga teng, uchrashuv o'sha yerda.", 'Восьмёркой. Два в кубе равно восьми, и там встреча.', 'By eight. Two cubed equals eight, and the meeting is there.'),
    hint: [
      L('Logarifm qaysi iksda uchga tengligini toping.', 'Найди, при каком икс логарифм равен трём.', 'Find the x at which the logarithm equals three.'),
      L('Ikkining kubi.', 'Два в кубе.', 'Two cubed.'),
      L('Sakkiz.', 'Восемь.', 'Eight.'),
    ],
    expr: 'log₂ x < 3',
    answer: '8',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARAVIY HOL', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('Javob ikki shartning kesishmasi', 'Ответ это пересечение двух условий', 'The answer is the intersection of two conditions'),
  tag: 'odz-logarifma',
  show: [
    [
      L('belgi ostida endi iks minus bir', 'под знаком теперь икс минус один', 'now x minus one stands under the sign'),
      L("polosa birdan o'ngda boshlanadi", 'полоса начинается справа от единицы', 'the band starts to the right of one'),
      L('bu birinchi shart', 'это первое условие', 'that is the first condition'),
    ],
    [
      L("egri chiziq bo'yicha iks to'qqizdan kichik chiqadi", 'по кривой выходит икс меньше девяти', 'from the curve x is less than nine'),
      L('bu ikkinchi shart', 'это второе условие', 'that is the second condition'),
      L("ikkalasi to'g'ri bo'lgan joy olinadi", 'берут то, где верны оба', 'you take where both hold'),
    ],
  ],
  motion: ['band'],
  audio: [
    A('mount', 'Darsning oxirgi holi. Logarifm belgisi ostida endi iks emas, ifoda turibdi.', 'Последний случай урока. Под знаком логарифма стоит уже не икс, а выражение.', 'The last case of the lesson. Under the logarithm sign there is no longer x but an expression.'),
    A('band', "Avval polosa, logarifmik tenglamalar darsidagi kabi. Belgi ostida iks minus bir turibdi, demak iks minus bir noldan katta, ya'ni iks birdan katta. Polosa birdan o'ngda boshlanadi, birning o'zi esa ochiq qoldiriladi. Endi tengsizlikning o'zi. Logarifm uchdan kichik, uch esa sakkizning logarifmi, demak iks minus bir sakkizdan kichik, bundan iks to'qqizdan kichik. Shart ikkita bo'ldi, ular bir vaqtda bajarilishi kerak. Kesishmani olamiz: iks birdan katta va to'qqizdan kichik. Sezing, polosa chizilmasa, javob to'qqizdan kichik hamma narsa bo'lib chiqadi, nol va manfiy sonlar bilan birga, ularda esa logarifm umuman yo'q.", 'Сначала полоса, как в уроке про логарифмические уравнения. Под знаком стоит икс минус один, значит икс минус один больше нуля, то есть икс больше единицы. Полоса начинается справа от единицы, и сама единица выколота. Теперь само неравенство. Логарифм меньше трёх, а три это логарифм восьми, значит икс минус один меньше восьми, отсюда икс меньше девяти. Условий получилось два, и выполняться они должны сразу. Берём пересечение: икс больше единицы и меньше девяти. Заметь, если полосу не начертить, ответом окажется всё, что меньше девяти, включая ноль и отрицательные числа, а при них логарифма просто нет.', 'First the band, as in the lesson on logarithmic equations. Under the sign stands x minus one, so x minus one is greater than zero, that is, x is greater than one. The band starts to the right of one, and one itself is punched out. Now the inequality itself. The logarithm is less than three, and three is the logarithm of eight, so x minus one is less than eight, which gives x less than nine. That makes two conditions, and both must hold at once. We take the intersection: x greater than one and less than nine. Notice that without drawing the band the answer would be everything less than nine, including zero and the negatives, and at those the logarithm simply does not exist.'),
    A('work', "O'zingiz hisoblang. Polosa qaysi sondan boshlanadi?", 'Посчитай сам. С какого числа начинается полоса?', 'Work it out yourself. From which number does the band start?'),
  ],
  work: {
    prompt: L('Polosa qaysi sondan boshlanadi?', 'С какого числа начинается полоса?', 'From which number does the band start?'),
    ok: L("Birdan. Iks minus bir noldan katta bo'lishi kerak.", 'С единицы. Икс минус один должно быть больше нуля.', 'From one. X minus one has to be greater than zero.'),
    hint: [
      L('Belgi ostidagi uchun shartni yozing.', 'Выпиши условие для того, что стоит под знаком.', 'Write the condition for what stands under the sign.'),
      L('Iks minus bir noldan katta.', 'Икс минус один больше нуля.', 'X minus one is greater than zero.'),
      L('Bir.', 'Один.', 'One.'),
    ],
    expr: 'log₂ (x − 1) < 3',
    answer: '1',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Tomon chizmadan o'qiladi", 'Сторону читают с чертежа', 'The side is read from the drawing'),
  tag: 'osnovanie-menshe-odnogo',
  motion: ['rule'],
  audio: [
    A('mount', "Qoidani yig'amiz. U qisqa, chunki undagi asosiy narsa chizmadan o'qiladi.", 'Соберём правило. Оно короткое, потому что главное в нём читается с чертежа.', 'Let us put the rule together. It is short, because the main part of it is read from the drawing.'),
    A('rule', "Birinchi: agar tengsizlik logarifmik bo'lsa, har qanday yechimdan oldin joiz qiymatlar polosasini chizing. Ikkinchi: o'ng tarafning darajasida gorizontal o'tkazing va egri chiziq bilan uchrashuvni toping, bu javobning chegarasi. Uchinchi: uchrashuvning qaysi tomonida egri chiziq ishorani qanoatlantirishiga qarang va shu tomonni oling. O'suvchi va kamayuvchi egri chiziqda tomonlar har xil, va xato qilinadigan yagona joy shu. Darslikda ham xuddi shu so'z bilan aytilgan: yechim bu grafik to'g'ri chiziqdan pastda joylashgan ikslar.", 'Первое: если неравенство логарифмическое, начерти полосу допустимых значений до всякого решения. Второе: проведи горизонталь на уровне правой части и найди встречу с кривой, это граница ответа. Третье: посмотри, с какой стороны от встречи кривая удовлетворяет знаку, и возьми эту сторону. У растущей кривой и у убывающей стороны разные, и это единственное место, где ошибаются. В учебнике то же самое сказано словами: решение это те икс, при которых график лежит ниже прямой.', 'First: if the inequality is logarithmic, draw the band of admissible values before any solving. Second: draw the horizontal at the level of the right side and find its meeting with the curve, that is the boundary of the answer. Third: look at which side of the meeting the curve satisfies the sign, and take that side. For a growing and for a decreasing curve the sides differ, and that is the only place where mistakes happen. The textbook says the same in words: the solution is those x at which the graph lies below the line.'),
  ],
  probe: {
    question: L("Javob qaysi tomonda yotishi nimaga bog'liq?", 'Отчего зависит, с какой стороны лежит ответ?', 'What decides on which side the answer lies?'),
    items: [
      { id: 'a', label: L("egri chiziqning yo'nalishiga", 'от направления кривой', 'on the direction of the curve'), correct: true },
      { id: 'b', label: L("o'ngda qanday son turganiga", 'от того, какое число справа', 'on which number is on the right'), hint: L("O'ngdagi son to'g'ri chiziqning balandligini beradi, tomonni emas.", 'Число справа задаёт высоту прямой, а не сторону.', 'The number on the right sets the height of the line, not the side.') },
    ],
  },
  rule: {
    lawLabel: L('QANDAY YECHILADI', 'КАК РЕШАТЬ', 'HOW TO SOLVE'),
    lines: [
      L('logarifmikda avval joiz qiymatlar polosasi', 'у логарифмического сначала полоса допустимых значений', 'for a logarithmic one, the band of admissible values first'),
      L('gorizontal egri chiziqni uchratadi, uchrashuv chegara beradi', 'горизонталь встречает кривую, встреча даёт границу', 'the horizontal meets the curve, the meeting gives the boundary'),
      L('tomon chizmadan olinadi, kamayuvchida u boshqacha', 'сторона берётся с чертежа, при убывающей она другая', 'the side is taken from the drawing, for a decreasing curve it is the other one'),
    ],
    law: 'log_a f(x) < b,   f(x) > 0',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ТРЕНИРОВКА', 'PRACTICE'),
  title: L('Tengsizlikni javobi bilan ulang', 'Соедини неравенство с ответом', 'Match each inequality with its answer'),
  tag: 'osnovanie-menshe-odnogo',
  audio: [
    A('mount', "To'rt tengsizlik va to'rt javob. Avval asosga qarang.", 'Четыре неравенства и четыре ответа. Смотри сначала на основание.', 'Four inequalities and four answers. Look at the base first.'),
  ],
  match: {
    prompt: L('Ikki asos birdan katta, bittasi kichik', 'Два основания больше единицы, одно меньше', 'Two bases are greater than one, one is less'),
    ok: L("To'g'ri. Yagona kamayuvchi asos yagona ag'darilgan ishorani berdi.", 'Верно. Единственное убывающее основание дало единственный перевёрнутый знак.', 'Correct. The one decreasing base gave the one flipped sign.'),
    left: ['2^x > 8', '0,5^x > 8', 'log₂ x < 4', 'log₂ x > 0'],
    a: 'x > 3',
    b: 'x < −3',
    c: '0 < x < 16',
    d: 'x > 1',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L("Tengsizlikni to'liq yeching", 'Реши неравенство целиком', 'Solve the inequality from start to finish'),
  tag: 'odz-logarifma',
  audio: [
    A('mount', "Endi butun tengsizlik. To'rt qadam, tartib muhim.", 'Теперь всё неравенство целиком. Четыре шага, порядок важен.', 'Now the whole inequality. Four steps, and the order matters.'),
  ],
  order: {
    prompt: L('Yechish qadamlarini tartib bilan joylashtiring', 'Расставь шаги решения по порядку', 'Put the solution steps in order'),
    s1: L('polosa chizish', 'начертить полосу', 'draw the band'),
    s2: L('uchrashuvni topish', 'найти встречу', 'find the meeting'),
    s3: L('tomonni tanlash', 'выбрать сторону', 'choose the side'),
    s4: L('kesishmani olish', 'взять пересечение', 'take the intersection'),
    ok: L("To'g'ri. Polosa birinchi, kesishma oxirgi.", 'Верно. Полоса первая, пересечение последнее.', 'Correct. The band first, the intersection last.'),
    bad: L("Polosa yechimdan oldin chiziladi, aks holda javobga logarifm yo'q sonlar tushadi.", 'Полосу чертят до решения, иначе в ответ попадут числа, где логарифма нет.', 'The band is drawn before solving, otherwise numbers where no logarithm exists get into the answer.'),
    mark: '1 < x < 9',
  },
  expr: 'log₂ (x − 1) < 3',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L("QOG'OZDA", 'НА БУМАГЕ', 'ON PAPER'),
  title: L('Ikki tengsizlikdan iborat sistema', 'Система из двух неравенств', 'A system of two inequalities'),
  tag: 'bumaga',
  audio: [
    A('mount', "Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring.", 'Прибора нет. Считай на бумаге, потом сверься.', 'No instrument here. Work it out on paper, then compare.'),
    A('next', "Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping.", 'Дальше запись с ошибкой. Найди строку, где она появилась.', 'Next comes a written solution with a mistake. Find the line where it appeared.'),
  ],
  task: {
    ok: L("Ikkita. Iks ikki bilan besh orasida, butunlari esa uch va to'rt.", 'Два. Икс между двойкой и пятёркой, целых там три и четыре.', 'Two. X lies between two and five, and the whole numbers there are three and four.'),
    hint: [
      L('Har bir tengsizlikni alohida yeching.', 'Реши каждое неравенство отдельно.', 'Solve each inequality separately.'),
      L('Iks ikkidan katta va beshdan kichik.', 'Икс больше двух и меньше пяти.', 'X is greater than two and less than five.'),
      L('Ikki.', 'Два.', 'Two.'),
    ],
    prompt: '4 < 2^x < 32',
    answer: '2',
  },
  order: {
    prompt: L("Tenglamalarni ildizi o'sishi bo'yicha joylashtiring", 'Расставь уравнения по возрастанию корня', 'Put the equations in order of increasing root'),
    title: L('kichik ildizdan kattasiga', 'от меньшего корня к большему', 'from the smallest root to the largest'),
    ok: L("To'g'ri. O'ngdagi son kattaroq bo'lsa, ildiz kattaroq degani emas.", 'Верно. Число справа больше не значит корень больше.', 'Correct. A bigger number on the right does not mean a bigger root.'),
    bad: L("O'ngdagi songa qaramay, har birining ko'rsatkichini hisoblang.", 'Считай показатель каждого, а не смотри на число справа.', 'Compute the exponent of each instead of looking at the number on the right.'),
    items: ['2^x = 16', '3^x = 9', '5^x = 5', '2^x = 8'],
    answer: '5^x = 5  3^x = 9  2^x = 8  2^x = 16',
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
    A('mount', "To'rt qator. Barcha amallar tanish, javob esa noto'g'ri.", 'Четыре строки. Все действия знакомые, а ответ неверный.', 'Four lines. Every step is familiar and the answer is wrong.'),
    A('next', 'Keyin teskari masala: javobga qarab shartni tiklang.', 'Дальше обратная задача: по ответу восстанови условие.', 'Next comes the reverse task: rebuild the condition from the answer.'),
  ],
  hint: {
    r1: L("Dastlabki tengsizlik, bu yerda xato bo'lishi mumkin emas.", 'Исходное неравенство, здесь ошибки быть не может.', 'The original inequality, no mistake can live here.'),
    r2: L("To'rtni o'sha asosning darajasi qilib yozishdi. Bu to'g'ri.", 'Четвёрку записали как степень того же основания. Это верно.', 'Four was written as a power of the same base. That is correct.'),
    r3: L('Asos birdan kichik. Ishoraga qarang.', 'Основание меньше единицы. Посмотри на знак.', 'The base is less than one. Look at the sign.'),
  },
  proof: L("Nolni qo'ying: nol butun besh o'ndanning nolinchi darajasi bir, bir esa to'rtdan katta emas.", 'Подставь ноль: ноль целых пять десятых в нулевой степени это один, а один не больше четырёх.', 'Substitute zero: zero point five to the power zero is one, and one is not greater than four.'),
  entry: {
    prompt: L('Bu javobdagi qaysi son yaramaydi?', 'Какое число из этого ответа не подходит?', 'Which number from this answer does not fit?'),
    ok: L('Nol. U olingan javobga kiradi, dastlabki tengsizlikni esa qanoatlantirmaydi.', 'Ноль. Он входит в полученный ответ, а исходному неравенству не удовлетворяет.', 'Zero. It belongs to the answer obtained, yet it does not satisfy the original inequality.'),
    hint: [
      L('Olingan javobdan eng qulay sonni oling.', 'Возьми самое удобное число из полученного ответа.', 'Take the most convenient number from the answer obtained.'),
      L('Har qanday sonning nolinchi darajasi birga teng.', 'Любое число в нулевой степени равно единице.', 'Any number to the power zero equals one.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
  row: {
    r1: '0,5^x > 4',
    r2: '0,5^x > 0,5^{−2}',
    r3: 'x > −2',
    r4: 'x ∈ (−2; +∞)',
  },
  answerId: 'r3',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("Teskari yo'l", 'Обратный ход', 'The other direction'),
  tag: 'obratnoe',
  audio: [
    A('mount', 'Endi teskarisiga. Avval polosaning boshini ayting.', 'Теперь наоборот. Сначала назови начало полосы.', 'Now the other way round. First name where the band starts.'),
    A('work', "Keyin ishora ag'dariladigan barcha tengsizliklarni belgilang.", 'Потом отметь все неравенства, где знак переворачивается.', 'Then mark every inequality where the sign flips.'),
  ],
  multi: {
    prompt: L("Ishora ag'dariladigan barcha tengsizliklarni belgilang", 'Отметь все неравенства, где знак переворачивается', 'Mark every inequality where the sign flips'),
    title: L('ular aynan ikkita', 'их ровно два', 'there are exactly two'),
    ok: L("To'g'ri. Ag'darilish birdan kichik asosdan keladi, faqat undan.", 'Верно. Переворот приходит от основания меньше единицы, и только от него.', 'Correct. The flip comes from a base less than one, and only from it.'),
    items: [
      { id: 'c', label: '2^x > 4', hint: L("Asos birdan katta, egri chiziq o'sadi, ishora qoladi.", 'Основание больше единицы, кривая растёт, знак остаётся.', 'The base is greater than one, the curve grows, the sign stays.') },
      { id: 'd', label: '3^x < 9', hint: L('Bu yerda ham asos birdan katta.', 'Здесь основание тоже больше единицы.', 'Here the base is greater than one as well.') },
      { id: 'a', label: '0,5^x > 4', ok: true },
      { id: 'b', label: '0,2^x < 5', ok: true },
    ],
  },
  entry: {
    prompt: L('Joiz qiymatlar polosasi qaysi sondan boshlanadi?', 'С какого числа начинается полоса допустимых значений?', 'From which number does the band of admissible values start?'),
    ok: L("Beshdan. Iks minus besh noldan katta bo'lishi kerak.", 'С пятёрки. Икс минус пять должно быть больше нуля.', 'From five. X minus five has to be greater than zero.'),
    hint: [
      L('Logarifm belgisi ostida nima turganiga qarang.', 'Посмотри, что стоит под знаком логарифма.', 'Look at what stands under the logarithm sign.'),
      L('Iks minus besh noldan katta.', 'Икс минус пять больше нуля.', 'X minus five is greater than zero.'),
      L('Besh.', 'Пять.', 'Five.'),
    ],
    expr: 'log₂ (x − 5) < 2',
    answer: '5',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'osnovanie-menshe-odnogo',
  audio: [
    A('mount', "Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi.", 'Четыре вопроса подряд. Считается первая попытка.', 'Four questions in a row. The first attempt counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Gorizontalning egri chiziq bilan uchrashuvi nima beradi?', 'Что даёт встреча горизонтали с кривой?', 'What does the meeting of the horizontal and the curve give?'),
      done: '2^x = 4   →   x = 2',
      items: [
        { id: 'a', label: L('javobning chegarasini', 'границу ответа', 'the boundary of the answer'), correct: true },
        { id: 'b', label: L('butun javobni', 'весь ответ', 'the whole answer'), hint: L("Butun javob tenglamada bo'lardi, tengsizlikda esa bu faqat chekka.", 'Весь ответ был бы у уравнения, а у неравенства это только край.', 'The whole answer would belong to an equation, for an inequality this is only the edge.') },
        { id: 'c', label: L('hech nima', 'ничего', 'nothing'), hint: L("Uchrashuvsiz javobni umuman yozib bo'lmaydi.", 'Без встречи ответ вообще не записать.', 'Without the meeting the answer cannot be written at all.') },
        { id: 'd', label: L("egri chiziqning yo'nalishini", 'направление кривой', 'the direction of the curve'), hint: L("Yo'nalish uchrashuvsiz ham ko'rinadi, u egri chiziqning o'ziniki.", 'Направление видно и без встречи, оно у кривой своё.', 'The direction is visible without the meeting, it belongs to the curve.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Qanday asosda ishora ag'dariladi?", 'При каком основании знак переворачивается?', 'For which base does the sign flip?'),
      done: '0 < a < 1',
      items: [
        { id: 'a', label: L('birdan kichik', 'меньше единицы', 'less than one'), correct: true },
        { id: 'b', label: L('birdan katta', 'больше единицы', 'greater than one'), hint: L("Bunday asosda egri chiziq o'sadi, ishora qoladi.", 'При таком основании кривая растёт, и знак остаётся.', 'With such a base the curve grows and the sign stays.') },
        { id: 'c', label: L('har qandayda', 'при любом', 'for any'), hint: L("U holda doim ag'darishga to'g'ri kelardi, bu esa unday emas.", 'Тогда переворачивать пришлось бы всегда, а это не так.', 'Then it would have to flip every time, and that is not so.') },
        { id: 'd', label: L('manfiyda', 'при отрицательном', 'for a negative one'), hint: L("Manfiy asos umuman bo'lmaydi.", 'Отрицательное основание не бывает вовсе.', 'A negative base does not occur at all.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Bu tengsizlikning yechimi nimaga teng?', 'Чему равно решение этого неравенства?', 'What is the solution of this inequality?'),
      done: '2^x > 4   →   x > 2',
      items: [
        { id: 'a', label: L('iks ikkidan katta', 'икс больше двух', 'x greater than two'), correct: true, ok: L("To'g'ri. Asos birdan katta, ishora qoladi.", 'Верно. Основание больше единицы, знак остаётся.', 'Correct. The base is greater than one, the sign stays.') },
        { id: 'b', label: L('iks ikkidan kichik', 'икс меньше двух', 'x less than two'), hint: L("Ag'darilish faqat birdan kichik asosda bo'ladi.", 'Переворот бывает только при основании меньше единицы.', 'The flip happens only for a base less than one.') },
        { id: 'c', label: L("iks to'rtdan katta", 'икс больше четырёх', 'x greater than four'), hint: L("To'rt qiymat, chegara esa ko'rsatkich.", 'Четыре это значение, а граница это показатель.', 'Four is the value, and the boundary is the exponent.') },
        { id: 'd', label: L('iks ikkiga teng', 'икс равен двум', 'x equals two'), hint: L("Tenglik tenglamaning javobi bo'lardi.", 'Равенство было бы ответом уравнения.', 'An equality would be the answer of an equation.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Logarifmik tengsizlikda birinchi nima qilinadi?', 'Что делают первым в логарифмическом неравенстве?', 'What is done first in a logarithmic inequality?'),
      done: 'f(x) > 0',
      items: [
        { id: 'a', label: L('joiz qiymatlar polosasini chizishadi', 'чертят полосу допустимых значений', 'they draw the band of admissible values'), correct: true },
        { id: 'b', label: L('logarifm belgilarini olib tashlashadi', 'снимают знаки логарифма', 'they remove the logarithm signs'), hint: L("U holda shart yozuvdan yo'qoladi, masaladan esa yo'q.", 'Тогда условие исчезнет из записи, а из задачи нет.', 'Then the condition vanishes from the writing but not from the problem.') },
        { id: 'c', label: L("ishorani ag'darishadi", 'переворачивают знак', 'they flip the sign'), hint: L("Ishora doim ham ag'darilmaydi, va albatta birinchi navbatda emas.", 'Знак переворачивают не всегда, и уж точно не первым делом.', 'The sign is not always flipped, and certainly not first.') },
        { id: 'd', label: L("son qo'yishadi", 'подставляют число', 'they substitute a number'), hint: L("Qo'yish oxiridagi tekshiruv, birinchi qadam emas.", 'Подстановка это проверка в конце, а не первый шаг.', 'Substitution is a check at the end, not the first step.') },
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
    A('mount', "Taxmin minus ikkidan tomon haqida edi. Nima chiqqanini ko'ramiz.", 'Прогноз был про сторону от минус двух. Посмотрим, что вышло.', 'The guess was about the side of minus two. Let us see how it turned out.'),
    A('next', "Iks minus ikkidan kichik. Ishora qoida bo'yicha emas, egri chiziq pastga ketgani uchun ag'darildi.", 'Икс меньше минус двух. Знак перевернулся не по правилу, а потому что кривая идёт вниз.', 'X is less than minus two. The sign flipped not by a rule but because the curve goes down.'),
  ],
  can: [
    L("Tengsizlik yechimini uchrashuvdan tomon deb o'qiyman", 'Читаю решение неравенства как сторону от встречи', 'I read the solution as a side of the meeting'),
    L("Ishora ag'darilishini egri chiziq yo'nalishidan ko'raman", 'Вижу переворот знака по направлению кривой', 'I see the sign flip from the direction of the curve'),
    L('Yechimdan oldin joiz qiymatlar polosasini chizaman', 'Черчу полосу допустимых значений до решения', 'I draw the band of admissible values before solving'),
    L('Ikki shartning kesishmasini olaman', 'Беру пересечение двух условий', 'I take the intersection of two conditions'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of problem is closed.'),
    gap: L('Bir joy takrorlashni talab qiladi: kamayuvchi egri chiziqdagi tomon.', 'Одно место требует повтора: сторона при убывающей кривой.', 'One spot needs a second look: the side for a decreasing curve.'),
    back: L('Qoidaga va beshinchi ekranga qayting.', 'Вернись к правилу и к экрану 5.', 'Go back to the rule and to screen five.'),
  },
  bridge: L("Keyin aylana: u yerda bo'lak yoyga aylanadi va takrorlanadi.", 'Дальше окружность: там участок станет дугой и будет повторяться.', 'Next comes the circle: there the piece becomes an arc and repeats.'),
  lifehack: L('Yechishdan oldin asosga qarang. U javobni qaysi tomondan izlashni aytib turibdi.', 'Прежде чем решать, посмотри на основание. Оно уже говорит, с какой стороны искать ответ.', 'Before solving, look at the base. It already tells you which side to look on.'),
  sheetTitle: L('Logarifmli tengsizliklar · shpargalka', 'Неравенства с логарифмом · шпаргалка', 'Inequalities with logarithms · cheat sheet'),
  sheetSrc: L('10-sinf · 35-dars', '10 класс · урок 35', 'Grade 10 · lesson 35'),
  hook: {
    a: 'x > −2',
    b: 'x < −2',
  },
  proved: 'x < −2',
  law: 'log_a f(x) < b,   f(x) > 0',
  sheet: [
    'f(x) > 0',
    'a > 1   →   x < x₀',
    '0 < a < 1   →   x > x₀',
    '2^x < 4   →   x < 2',
    '0,5^x > 4   →   x < −2',
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

// ПОЛОСА ОДЗ -- та же, что в уроках 31 и 32, только граница другая.
const BAND = { lo: -3, hi: 11, ticks: [-2, 0, 2, 4, 6, 8, 10] }

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const EQ_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const EQ_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

const ORD4 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S4.order[id] }))
const ORD10 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S10.order[id] }))
const ORD11 = S11.order.items.map((label, i) => ({ id: 'o' + i, label }))
const ORD11_ANS = String(S11.order.answer).split(/\s{2,}/)
  .map((lbl) => (ORD11.find((x) => x.label === lbl.trim()) || {}).id)

const TRAP_ROWS = ['r1', 'r2', 'r3', 'r4'].map((id) => ({ id, text: S12.row[id] }))

// ОКНО УЖЕ, ЧЕМ У КРИВОЙ ПО УМОЛЧАНИЮ.
//
// `exp` по умолчанию показывает значения до девяти, и в карточке высотой 168
// такой чертёж не помещается -- прогон вёрстки поймал переполнение на пятидесяти
// пикселях. Нам девятка и не нужна: горизонталь стоит на четвёрке, выше неё
// смотреть не на что. Тот же приём в уроке 27.
const WIN_UP = { xmin: -2.2, xmax: 3, ymax: 6, tx: [-2, -1, 1, 2, 3], ty: [1, 2, 4] }
const WIN_DOWN = { xmin: -3, xmax: 2.2, ymax: 6, tx: [-3, -2, -1, 1, 2], ty: [1, 2, 4] }

// `size` ОБЯЗАТЕЛЬНО ПРОБРАСЫВАЕТСЯ. `Scene` подставляет фигуре размер по
// своей коробке (`cloneElement`), и обёртка, которая его проглотит, оставит
// `Plane` в размере по умолчанию -- чертёж вылезет из карточки. Прогон вёрстки
// поймал это на восьмидесяти экранах.
//
// РАСТУЩАЯ КРИВАЯ: участок «ниже прямой» лежит СЛЕВА от встречи.
const Up = ({ step, size }) => (
  <Plane size={size} step={step} curve="exp" show="none" level={4} region={step >= 1 ? 'below' : null} {...WIN_UP} />
)
// УБЫВАЮЩАЯ: тот же вопрос, участок с другой стороны. Знак не переворачивают
// по правилу -- его читают с чертежа (учебник, стр. 123).
const Down = ({ step, size }) => (
  <Plane size={size} step={step} curve="expdown" show="none" level={4} region={step >= 1 ? 'above' : null} {...WIN_DOWN} />
)
// ЛОГАРИФМИЧЕСКАЯ: та же горизонталь, но кривая слева обрывается, и у ответа
// появляется второй конец.
const Log = ({ step, size }) => (
  <Plane size={size} step={step} curve="log" show="none" level={3} region={step >= 1 ? 'below' : null} />
)

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // Кривая есть, участок НЕ закрашен: прогноз делается до того, как
        // стало видно сторону.
        fig={() => <Scene fig={<Down step={0} />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.1}>
        <Col>
          <Scene fig={<Plane step={1} curve="exp" show="none" {...WIN_UP} />} max={300} />
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
      /* Кадр 1: только встреча. Кадр 2: закрашивается сторона и её след на
         оси. Порядок важен -- сначала точка, потом участок. */
      <Scene fig={<Up step={phase} />} note={<NoteList items={S3.show[phase]} />} />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Up step={2} />} max={300} /></Col>
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
      /* Разграничение НА ОДНОМ чертеже: сначала только точка встречи
         (вопрос уравнения), потом закрашенная сторона (вопрос неравенства). */
      <Scene fig={<Up step={phase} />} note={<NoteList items={S4.show[phase]} />} />
    ) : (
      <OrderRow
        prompt={S4.order.prompt}
        items={ORD4}
        answer={['s1', 's2', 's3', 's4']}
        okText={S4.order.ok}
        badText={S4.order.bad}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen5 = (p) => (
  <Screen data={S5} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S5.show.length && !solved ? (
      /* СВИДЕТЕЛЬ УРОКА. Та же горизонталь, та же высота, кривая другая --
         и участок оказывается с другой стороны. */
      <Scene fig={<Down step={phase} />} note={<NoteList items={S5.show[phase]} />} />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Down step={2} />} max={300} /></Col>
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
      <Scene fig={<Log step={phase} />} note={<NoteList items={S6.show[phase]} />} />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Log step={2} />} max={300} /></Col>
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
      /* ПРИБОР 5 возвращается: у логарифмического неравенства к участку
         добавляется полоса, и берут пересечение. */
      <Scene
        fig={<DomainBand step={phase} from={1} {...BAND} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<DomainBand step={1} from={1} {...BAND} />} max={300} /></Col>
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
        // Сторона закрашивается в момент ответа: правило открывается рядом с
        // тем движением, которое его породило.
        fig={(solved) => <Scene fig={<Down step={solved ? 2 : 0} />} max={330} />}
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
          {/* Полоса другая: граница пятёрка, а не единица. */}
          <Scene fig={<DomainBand step={1} from={5} {...BAND} />} max={250} h={190} />
          <Panel tone="paper">
            <Expr size="mid">{S13.entry.expr}</Expr>
          </Panel>
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
        fig={(round) => (
          <Scene fig={round >= 2 ? <Down step={2} /> : <Up step={round >= 1 ? 2 : 0} />} max={260} h={168} />
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
