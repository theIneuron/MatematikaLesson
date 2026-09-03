// ============================================================================
// 10-sinf, Dars 25. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS25_KONTENT.md
// Ma'lumot (ovoz, kadrlar, variantlar, razborlar, qoida, yakun) sborshchik bilan
// yig'ilgan. EKRAN TANALARI qo'lda yozilgan: asbob va figurani tanlash matematik
// qaror (etalon 5.3). Asbob 2 -- yozuv, asbob 5 -- polosa, 5-ekranda esa
// `TwoLines` figurasi (sinf qatlamiga 27.08.2026 da qo'shildi).
//
// Tartib: tanalarni to'ldirish, keyin `grade10-lesson-audit.mjs`, keyin
// tez yarus (2 o'lcham), keyin to'liq prognon. Har yangi figura oldin
// `probe/figures.html` stendida suratga olinadi.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Col, Cols, Expr, L, MATH_FONT, Panel, Slot } from './core.jsx'
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
import { DomainBand, TwoLines } from './figures.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 25
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Tenglamalar sistemasi`,
  `Урок ${LESSON_NO}. Системы уравнений`,
  `Lesson ${LESSON_NO}. Systems of equations`,
)

const BLOCK = { label: 'B1', from: 1, to: 7, current: 25 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('SISTEMA', 'СИСТЕМА', 'THE SYSTEM'),
  title: L('Juftlik topiladi yoki topilmaydi', 'Пара найдётся или не найдётся', 'A pair will be found, or none exists'),
  audio: [
    A('mount', "Ikki satr, va har birida o'sha ikki harf, iks va igrek.", 'Две строки, и в каждой те же две буквы, икс и игрек.', 'Two rows, and each has the same two letters, x and y.'),
    A('r1', "Birinchi yozuv mos juftlik bitta deydi. To'rt va minus bir birinchi satrni to'g'ri tenglikka aylantiradi.", 'Первая запись говорит, что подходящая пара одна. Четыре и минус один обращает первую строку в верное равенство.', 'The first reading says there is exactly one pair. Four and minus one turns the first row into a true equality.'),
    A('r2', "Ikkinchisi mos juftlik umuman yo'q deydi, holbuki har bir satr alohida qancha xohlasangiz yechim beradi.", 'Вторая говорит, что подходящей пары нет вовсе, хотя каждая строка по отдельности решений имеет сколько угодно.', 'The second says no pair fits at all, even though each row on its own has as many solutions as you like.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L('Javobingiz yozib olindi. Endi ikkala satrni tekshiramiz.', 'Твой ответ записан. Сейчас проверим обе строки.', 'Your answer is saved. Now we will check both rows.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('juftlik bor, u bitta', 'пара есть, и она одна', 'there is one pair'),
      value: '(4; −1)',
    },
    b: {
      name: L("mos juftlik yo'q", 'подходящей пары нет', 'no pair fits'),
      value: '∅',
    },
  },
  expr: 'x − 2y = 6;   2x − 4y = −8',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE BASICS'),
  title: L('Boshlashdan oldin uchta qisqa savol', 'Три коротких перед началом', 'Three short ones before we start'),
  tag: 'support',
  audio: [
    A('mount', "Siz allaqachon bilgan narsalar uchun uchta savol. Ular bir daqiqadan keyin kerak bo'ladi.", 'Три вопроса на то, что уже знаешь. Они понадобятся через минуту.', 'Three questions on what you already know. They will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Minus uch va minus ikkini iks qo'shuv igrek yig'indisiga qo'ying. Nima chiqadi?", 'Подставь минус три и минус два в сумму икс плюс игрек. Что получится?', 'Substitute minus three and minus two into the sum x plus y. What comes out?'),
      done: L("Ikki sondan iborat juftlik butunlay, ikkala son birdan qo'yiladi.", 'Пара из двух чисел подставляется целиком, оба числа сразу.', 'A pair of two numbers is substituted whole, both numbers at once.'),
      items: [
        { id: 'a', label: L('−5', '−5', '−5'), correct: true },
        { id: 'b', label: L('5', '5', '5'), hint: L("Ikkala son ham manfiy, demak yig'indi ham manfiy.", 'Оба числа отрицательные, значит и сумма отрицательная.', 'Both numbers are negative, so the sum is negative too.') },
        { id: 'c', label: L('−1', '−1', '−1'), hint: L("Minus bir ayirishda chiqardi, bu yerda esa qo'shuv turadi.", 'Минус один вышло бы при вычитании, а здесь стоит плюс.', 'Minus one would come from subtraction, but there is a plus here.') },
        { id: 'd', label: L('1', '1', '1'), hint: L("Ishora yo'qolgan: ikki manfiy sonning yig'indisi musbat bo'lmaydi.", 'Знак потерян: сумма двух отрицательных положительной не бывает.', 'A sign is lost: the sum of two negatives is never positive.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Iks teng sakkiz igrek minus bir tenglikda: qanday igrekda iks o'n beshga teng bo'ladi?", 'В равенстве икс равно восемь игрек минус один: при каком игрек выйдет икс равно пятнадцати?', 'In x equals eight y minus one: for which y does x come out fifteen?'),
      done: L("Bu o'rniga qo'yishning o'zi: bir harf boshqasi orqali ifodalangan.", 'Это и есть подстановка: одна буква выражена через другую.', 'This is substitution itself: one letter expressed through the other.'),
      items: [
        { id: 'a', label: L('2', '2', '2'), correct: true },
        { id: 'b', label: L('1', '1', '1'), hint: L("Birda yetti chiqadi, kerak bo'lgani esa o'n besh.", 'При единице выйдет семь, а нужно пятнадцать.', 'With one it gives seven, but fifteen is needed.') },
        { id: 'c', label: L('14', '14', '14'), hint: L("O'n to'rt bu deyarli iksning o'zi, sakkiz ko'paytuvchini esa hech kim olib tashlamadi.", 'Четырнадцать это уже почти сам икс, а множителя восемь никто не убирал.', 'Fourteen is nearly x itself, and nobody removed the factor eight.') },
        { id: 'd', label: L('16', '16', '16'), hint: L("Birni o'n beshga qo'shish, keyin sakkizga bo'lish kerak.", 'Единицу надо прибавить к пятнадцати, а потом делить на восемь.', 'Add one to fifteen first, and only then divide by eight.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Iksning qanday qiymatlarida iksdan ildiz aniqlangan?', 'При каких икс определён корень из икс?', 'For which x is the square root of x defined?'),
      done: L("Ruxsat etilgan qiymatlar sharti yettinchi ekranda kerak bo'ladi.", 'Условие допустимых значений понадобится на седьмом экране.', 'The condition on allowed values will be needed on screen seven.'),
      items: [
        { id: 'a', label: L('iks noldan katta yoki teng', 'икс больше или равен нулю', 'x is greater than or equal to zero'), correct: true },
        { id: 'b', label: L('iks noldan katta', 'икс больше нуля', 'x is greater than zero'), hint: L('Noldan ildiz bor, va u nolga teng.', 'Корень из нуля есть, и он равен нулю.', 'The root of zero exists, and it equals zero.') },
        { id: 'c', label: L('har qanday iks', 'любой икс', 'any x'), hint: L("Ildiz ostida manfiy son bo'lishi mumkin emas.", 'Под корнем отрицательного числа быть не может.', 'A negative number cannot stand under the root.') },
        { id: 'd', label: L('iks noldan kichik', 'икс меньше нуля', 'x is less than zero'), hint: L("Shart teskari: o'qning o'ng yarmi bo'yalgan, chapi emas.", 'Условие перевёрнуто: закрашена правая половина прямой, не левая.', 'The condition is upside down: the right half of the line is shaded, not the left.') },
      ],
    },
  ],
  sys: ['x − 2y = 6', '2x − 4y = −8'],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L("O'RNIGA QO'YISH", 'ПОДСТАНОВКА', 'SUBSTITUTION'),
  title: L('Bir harf boshqasi orqali', 'Одна буква через другую', 'One letter through the other'),
  tag: 'podstanovka-bez-vozvrata',
  show: [
    [
      L('1-qadam. Birinchi satrdan igrekni ifodalaymiz', 'Шаг 1. Из первой строки выражаем игрек', 'Step 1. Express y from the first row'),
      L('bir harf boshqasi orqali yozildi', 'одна буква записана через другую', 'one letter is written through the other'),
      L("juftlik hali topilgani yo'q, bog'lanish topildi", 'пара ещё не найдена, найдена связь', 'the pair is not found yet, the link is'),
    ],
    [
      L("2-qadam. Ikkinchi satrga qo'yamiz", 'Шаг 2. Подставляем во вторую строку', 'Step 2. Substitute into the second row'),
      L('harf bitta qoldi, va bu oddiy tenglama', 'буква осталась одна, и это обычное уравнение', 'one letter is left, and this is an ordinary equation'),
      L('iks minus uchga teng', 'икс равен минус трём', 'x equals minus three'),
    ],
  ],
  motion: ['side'],
  audio: [
    A('mount', "Chapda sistema, o'ngda yechim yozuvi. Har bir qadam daftardagidek o'z satrini oladi.", 'Слева система, справа запись решения. Каждый шаг занимает свою строку, как в тетради.', 'On the left the system, on the right the record of the solution. Each step takes its own line, as in a notebook.'),
    A('side', "O'rniga qo'yish nima qilishini kuzatib turing. Ikkinchi satr ikki harfli edi, bir harfli bo'ldi.", 'Смотри, что делает подстановка. Вторая строка была с двумя буквами, а стала с одной.', 'Watch what substitution does. The second row had two letters, and now it has one.'),
    A('work', 'Iks topildi. Lekin sistemaning javobi juftlik, bitta son emas.', 'Икс уже найден. Но ответ системы это пара, а не одно число.', 'x is found. But the answer of a system is a pair, not a single number.'),
  ],
  work: {
    prompt: L('Iks minus uchga teng. Igrekni yozing.', 'Икс равен минус трём. Запиши игрек.', 'x equals minus three. Write down y.'),
    ok: L("To'g'ri. Javob qavs ichida juftlik bo'lib yoziladi, minus uch va minus ikki.", 'Верно. Ответ записывается парой в скобках, минус три и минус два.', 'Correct. The answer is written as a pair in brackets, minus three and minus two.'),
    hint: [
      L('Igrek iks orqali ifodalangan satrga qaytib qarang.', 'Вернись к строке, где игрек выражен через икс.', 'Go back to the row where y is expressed through x.'),
      L("Bu ifodada iks o'rniga minus uchni qo'ying.", 'Подставь минус три вместо икс в это выражение.', 'Substitute minus three for x in that expression.'),
      L("Minus besh ayirish minus uch bu minus besh qo'shuv uch.", 'Минус пять минус минус три это минус пять плюс три.', 'Minus five minus minus three is minus five plus three.'),
    ],
    expr: 'y = −5 − x,   x = −3',
    answer: '−2',
  },
  sys: ['x + y = −5', '3x − y = −7'],
  frame: [
    'y = −5 − x',
    '3x + 5 + x = −7   ⇒   4x = −12',
  ],
  expr: 'x + y = −5;   3x − y = −7',
}

const S4 = {
  role: 'explain2',
  answer: 'order',
  eyebrow: L('TEKSHIRUV', 'ПРОВЕРКА', 'THE CHECK'),
  title: L('Juftlik, son emas, va tartib erkin emas', 'Пара, а не число, и порядок не свободен', 'A pair, not a number, and the order is not free'),
  tag: 'sistema-ne-para',
  show: [
    [
      L('Minus uch va minus ikki juftligi', 'Пара минус три и минус два', 'The pair minus three and minus two'),
      L("birinchi satr to'g'ri tenglikka aylanadi", 'первая строка обращается в верное равенство', 'the first row turns into a true equality'),
      L('ikkinchisi ham, demak bu javob', 'вторая тоже, значит это ответ', 'the second one too, so this is the answer'),
    ],
    [
      L("O'sha juftlik, sonlar joyi almashgan", 'Та же пара, числа местами', 'The same pair, numbers swapped'),
      L("birinchi satr hali to'g'ri, ikkinchisi esa minus yetti o'rniga minus uch beradi", 'первая строка ещё верна, а вторая даёт минус три вместо минус семи', 'the first row still holds, but the second gives minus three instead of minus seven'),
      L('demak juftlikdagi tartib erkin emas', 'значит порядок в паре не свободен', 'so the order inside a pair is not free'),
    ],
  ],
  motion: ['two'],
  audio: [
    A('mount', 'Sistemaning javobi sonlar juftligi. Birinchi son doim iks uchun, ikkinchisi igrek uchun turadi.', 'Ответ системы это пара чисел. Первое число всегда стоит за икс, второе за игрек.', 'The answer of a system is a pair of numbers. The first number always stands for x, the second for y.'),
    A('two', "Bitta juftlik, sonlar esa joyi almashgan. Birinchi satr buni ko'tardi, chunki unda yig'indi. Ikkinchisiga qarang.", 'Одна и та же пара, а числа местами. Первая строка это выдержала, потому что в ней сумма. Смотри на вторую.', 'The same pair, numbers swapped. The first row survived it, because it is a sum. Watch the second one.'),
    A('work', "Juftlikni tekshirish to'rt qadamda boradi, va tartib bu yerda muhim.", 'Проверка пары идёт в четыре шага, и порядок здесь важен.', 'Checking a pair takes four steps, and the order matters here.'),
  ],
  order: {
    prompt: L('Juftlikni tekshirish qadamlarini tartib bilan joylashtiring', 'Расставь шаги проверки пары по порядку', 'Put the steps of checking a pair in order'),
    s1: L("juftlikni birinchi satrga qo'yish", 'подставить пару в первую строку', 'put the pair into the first row'),
    s2: L("o'ng tomoni bilan solishtirish", 'сравнить с правой частью', 'compare with the right side'),
    s3: L('ikkinchi satr bilan takrorlash', 'повторить со второй строкой', 'repeat with the second row'),
    ok: L("To'g'ri. Juftlik faqat ikkala satr to'g'ri bo'lganda yaraydi.", 'Верно. Пара годится, только если верны обе строки.', 'Correct. A pair fits only when both rows come out true.'),
    bad: L("Tartib boshqacha. Juftlik har bir satrga navbat bilan butunlay qo'yiladi.", 'Порядок другой. Пара подставляется целиком в каждую строку по очереди.', 'The order is different. The pair is substituted whole into each row in turn.'),
    mark: '(−3; −2)',
  },
  sys: ['x + y = −5', '3x − y = −7'],
  frame: [
    '(−3; −2):   −5 = −5;   −7 = −7',
    '(−2; −3):   −5 = −5;   −3 ≠ −7',
  ],
  expr: 'x + y = −5;   3x − y = −7',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L("IKKI TO'G'RI CHIZIQ", 'ДВЕ ПРЯМЫЕ', 'TWO LINES'),
  title: L("O'sha sistema, faqat chizma bilan", 'Та же система, только чертежом', 'The same system, drawn'),
  tag: 'sistema-bez-resheniy',
  show: [
    [
      L("Har bir satr tekislikdagi to'g'ri chiziq", 'Каждая строка это прямая на плоскости', 'Each row is a line on the plane'),
      L('sistemaning yechimi chiziqlarning umumiy nuqtasi', 'решение системы это общая точка прямых', 'a solution of the system is a common point of the lines'),
      L('birinchi chiziq uch pastga tushadi', 'первая прямая опускается на три вниз', 'the first line sits three lower'),
    ],
    [
      L("Ikkalasining og'ishi bir xil", 'Наклон у обеих одинаковый', 'The slope of both is the same'),
      L("ikkinchi chiziq ikki tepaga ko'tarilgan", 'вторая прямая поднята на два вверх', 'the second line is lifted two higher'),
      L('chiziqlar yonma-yon boradi va uchrashmaydi', 'прямые идут рядом и не встречаются', 'the lines run alongside and never meet'),
    ],
  ],
  motion: ['flip'],
  audio: [
    A('mount', "O'sha sistema endi chizma bo'lib turadi. Har bir satr to'g'ri chiziq.", 'Одна и та же система теперь стоит чертежом. Каждая строка это прямая.', 'The same system now stands as a drawing. Each row is a line.'),
    A('flip', "Chiziqlarning og'ishi bir xil, balandligi esa boshqa. Harakat vaqtida nima bo'lishini kuzatib turing.", 'Наклон у прямых одинаковый, а высота разная. Смотри, что происходит при движении.', 'The slopes are equal and the heights differ. Watch what happens as it moves.'),
    A('work', "Umumiy nuqta bu ikkala satrga yaraydigan juftlikning o'zi.", 'Общая точка это и есть пара, которая годится обеим строкам.', 'A common point is exactly the pair that fits both rows.'),
  ],
  work: {
    prompt: L('Bu ikki chiziqning nechta umumiy nuqtasi bor? Sonni yozing.', 'Сколько общих точек у этих двух прямых? Запиши число.', 'How many common points do these two lines have? Write the number.'),
    ok: L("To'g'ri. Birorta ham yo'q, shuning uchun juftlik ham yo'q. Birinchi ekrandagi taxmin tekshirildi.", 'Верно. Ни одной, поэтому и пары нет. Прогноз с первого экрана проверен.', 'Correct. None, and so there is no pair either. The guess from screen one is checked.'),
    hint: [
      L("Og'ishlarni solishtiring: ikkala chiziqda u bir xil.", 'Сравни наклоны: у обеих прямых он один и тот же.', 'Compare the slopes: both lines have the same one.'),
      L("Balandliklarni solishtiring: minus uch va qo'shuv ikki, bular boshqa sathlar.", 'Сравни высоты: минус три и плюс два, это разные уровни.', 'Compare the heights: minus three and plus two, different levels.'),
      L("Og'ishi bir xil, balandligi boshqa chiziqlar hech qayerda uchrashmaydi.", 'Прямые с одним наклоном и разной высотой не встречаются нигде.', 'Lines with equal slopes and different heights meet nowhere.'),
    ],
    expr: 'x − 2y = 6;   2x − 4y = −8',
    answer: '0',
  },
  expr: 'y = 0,5x − 3;   y = 0,5x + 2',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("QO'SHISH", 'СЛОЖЕНИЕ', 'ADDITION'),
  title: L("Qo'shish mumkin, lekin darrov emas", 'Сложить можно, но не сразу', 'Adding works, but not right away'),
  tag: 'slozhenie-bez-uravnivaniya',
  show: [
    [
      L("Satrlarni borligicha qo'shdik", 'Сложили строки как есть', 'The rows were added as they are'),
      L('ikkala harf ham joyida qoldi', 'обе буквы остались на месте', 'both letters stayed in place'),
      L("ish kamaymadi, ko'paydi", 'работы стало не меньше, а больше', 'there is more work now, not less'),
    ],
    [
      L("Ikkinchi satrni ikkiga ko'paytirdik", 'Вторую строку умножили на два', 'The second row was multiplied by two'),
      L("igrekning ko'paytuvchilari qarama-qarshi bo'ldi", 'у игрек стали противоположные множители', 'y got opposite factors'),
      L("qo'shishdan keyin igrek o'zi ketdi", 'после сложения игрек ушёл сам', 'after adding, y left on its own'),
    ],
  ],
  motion: ['plus'],
  audio: [
    A('mount', "Darslikdagi ikkinchi usul algebraik qo'shish. Satrlar butunlay qo'shiladi.", 'Второй метод из учебника это алгебраическое сложение. Строки складываются целиком.', 'The second method from the textbook is algebraic addition. Whole rows are added.'),
    A('plus', "Avval borligicha qo'shamiz va nima chiqishini ko'ramiz.", 'Сначала сложим как есть и посмотрим, что выйдет.', 'First we add them as they are and see what comes out.'),
    A('work', "Harf ketishi uchun uning oldidagi ko'paytuvchilar qarama-qarshi bo'lishi kerak.", 'Чтобы буква ушла, множители при ней должны быть противоположными.', 'For a letter to leave, its factors must be opposite.'),
  ],
  work: {
    prompt: L("Igrek ketdi, yetti iks teng o'n to'rt qoldi. Iksni yozing.", 'Игрек ушёл, осталось семь икс равно четырнадцати. Запиши икс.', 'y is gone, seven x equals fourteen is left. Write down x.'),
    ok: L("To'g'ri. Iks ikkiga teng, igrek esa uchga teng bo'ladi. Javob ikki va uch.", 'Верно. Икс равен двум, а игрек тогда равен трём. Ответ два и три.', 'Correct. x equals two, and then y equals three. The answer is two and three.'),
    hint: [
      L("O'n to'rtni yettiga bo'lish kerak.", 'Четырнадцать надо разделить на семь.', 'Fourteen has to be divided by seven.'),
      L("Yetti iks bu iksning yetti ko'paytuvchisi, yonida yettisi bor iks emas.", 'Семь икс это семь множителей икс, а не икс с семёркой рядом.', 'Seven x means seven times x, not x with a seven beside it.'),
      L("Ikkini yettiga ko'paytirsa o'n to'rt chiqadi, demak iks ikkiga teng.", 'Два умножить на семь даёт четырнадцать, значит икс равен двум.', 'Two times seven gives fourteen, so x equals two.'),
    ],
    expr: '6x − 2y = 6   ⇒   7x = 14',
    answer: '2',
  },
  sys: ['x + 2y = 8', '3x − y = 3'],
  frame: [
    '4x + y = 11',
    '7x = 14',
  ],
  expr: 'x + 2y = 8;   3x − y = 3',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('RUXSAT ETILGAN QIYMATLAR', 'ДОПУСТИМЫЕ ЗНАЧЕНИЯ', 'ALLOWED VALUES'),
  title: L('Avval polosa, keyin yechim', 'Сначала полоса, потом решение', 'The band first, the solution after'),
  tag: 'sistema-odz',
  show: [
    [
      L("Ildiz ostida manfiy son bo'lolmaydi", 'Под корнем отрицательного быть не может', 'A negative cannot stand under a root'),
      L('demak iks va igrek nomanfiy', 'значит икс и игрек неотрицательны', 'so x and y are non-negative'),
      L("polosa yechimdan oldin bo'yaladi, keyin emas", 'полоса закрашена до решения, а не после', 'the band is shaded before solving, not after'),
    ],
    [
      L('Almashtirish: a bu iksdan ildiz, b bu igrekdan ildiz', 'Замена: а это корень из икс, бе это корень из игрек', 'Substitution: a is the root of x, b is the root of y'),
      L("ikkinchi satr ko'paytmaga ajraladi", 'вторая строка распадается на произведение', 'the second row splits into a product'),
      L('a uchga teng, b ikkiga teng', 'а равно трём, бе равно двум', 'a equals three, b equals two'),
    ],
  ],
  motion: ['band'],
  audio: [
    A('mount', "Darslikdagi uchinchi tur irratsional sistema. Bu yerda ish tartibi o'zgaradi.", 'Третий вид из учебника это иррациональная система. Здесь порядок работы меняется.', 'The third kind from the textbook is an irrational system. Here the order of work changes.'),
    A('band', "Ruxsat etilgan qiymatlar polosasi birinchi paydo bo'ladi, har qanday almashtirishdan oldin.", 'Полоса допустимых значений появляется первой, ещё до всякого преобразования.', 'The band of allowed values appears first, before any transformation.'),
    A('work', "Almashtirish ildizlarni harflarga aylantiradi, va sistema tanish bo'lib qoladi.", 'Замена превращает корни в буквы, и система становится знакомой.', 'The substitution turns roots into letters, and the system becomes familiar.'),
  ],
  work: {
    prompt: L('b ikkiga teng, b esa igrekdan ildiz. Igrekni yozing.', 'Бе равно двум, а бе это корень из игрек. Запиши игрек.', 'b equals two, and b is the root of y. Write down y.'),
    ok: L("To'g'ri. To'qqiz va to'rt, ikkala son ham bo'yalgan polosada yotadi.", 'Верно. Девять и четыре, и оба числа лежат в закрашенной полосе.', 'Correct. Nine and four, and both numbers lie inside the shaded band.'),
    hint: [
      L("Igrekdan ildiz ikkiga teng. Unda igrekning o'zi nima?", 'Корень из игрек равен двум. Что тогда сам игрек?', 'The root of y equals two. What is y itself then?'),
      L("Ikkala tomonni kvadratga ko'taring.", 'Возведи обе части в квадрат.', 'Square both sides.'),
      L("Ikkining kvadrati to'rt.", 'Два в квадрате это четыре.', 'Two squared is four.'),
    ],
    expr: 'a + b = 5,   a − b = 1,   b = 2',
    answer: '4',
  },
  sys: ['√x + √y = 5', 'x − y = 5'],
  frame: [
    'x ≥ 0,   y ≥ 0',
    'a + b = 5,   (a − b)(a + b) = 5',
  ],
  expr: '√x + √y = 5;   x − y = 5',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  title: L('Sistemaning yechimi', 'Решение системы', 'A solution of a system'),
  tag: 'sistema-ne-para',
  motion: ['rule'],
  audio: [
    A('mount', 'Kartochkani ochishdan oldin bitta savolga javob bering.', 'Прежде чем открыть карточку, ответь на один вопрос.', 'Before the card opens, answer one question.'),
    A('rule', "Kartochka darslik so'zlari bilan gapiradi. Usul uchta, va uchalasi ekranlarda bo'lib o'tdi.", 'Карточка говорит словами учебника. Методов три, и все три уже были на экранах.', 'The card speaks in the words of the textbook. There are three methods, and all three have already appeared on the screens.'),
  ],
  probe: {
    question: L('Sistemaning yechimi nima?', 'Что такое решение системы?', 'What is a solution of a system?'),
    items: [
      { id: 'a', label: L("ikkala satr to'g'ri bo'ladigan sonlar juftligi", 'пара чисел, при которой верны обе строки', 'a pair of numbers making both rows true'), correct: true },
      { id: 'b', label: L("hech bo'lmasa bitta satrga mos har qanday son", 'любое число, подходящее хотя бы одной строке', 'any number fitting at least one row'), hint: L("Unda har qanday sistemada, yechimi yo'q sistemada ham, qancha xohlasangiz yechim bo'lardi.", 'Так решений было бы сколько угодно у любой системы, в том числе у той, где их нет.', 'Then every system would have any number of solutions, including one that has none.') },
    ],
  },
  rule: {
    lawLabel: L("Sistema yechimlari to'plami", 'Множество решений системы', 'The solution set of a system'),
    lines: [
      L("70-bet. Usullar: algebraik qo'shish, o'rniga qo'yish, o'zgaruvchini almashtirish.", 'Стр. 70. Способы: алгебраическое сложение, подстановка, замена переменной.', 'Page 70. The methods: algebraic addition, substitution, change of variable.'),
      L("119-bet. Ko'rsatkichli ifoda qatnashgan sistema ko'rsatkichli deyiladi.", 'Стр. 119. Система с показательным выражением называется показательной.', 'Page 119. A system with an exponential expression is called exponential.'),
      L("87-bet. Irratsionalda o'shalar va belgilash, ko'paytuvchilar.", 'Стр. 87. В иррациональных те же плюс обозначение и множители.', 'Page 87. In irrational ones the same, plus denoting and factoring.'),
    ],
    law: '(x₀; y₀) ∈ S₁ ∩ S₂',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L("TO'RTTA SISTEMA", 'ЧЕТЫРЕ СИСТЕМЫ', 'FOUR SYSTEMS'),
  title: L('Sistemani javobi bilan biriktiring', 'Соедини систему с её ответом', 'Match each system with its answer'),
  tag: 'sistema-bez-resheniy',
  audio: [
    A('mount', "To'rtta sistema, va hammasining birinchi satri bir xil. Ularni faqat ikkinchisi ajratadi.", 'Четыре системы, и у всех первая строка одна и та же. Различает их только вторая.', 'Four systems, and the first row is the same in all of them. Only the second one tells them apart.'),
  ],
  match: {
    prompt: L("Har bir sistemaga o'z javobi", 'Каждой системе свой ответ', 'Each system gets its own answer'),
    a: L('(3; 1)', '(3; 1)', '(3; 1)'),
    b: L("cheksiz ko'p juftlik", 'бесконечно много пар', 'infinitely many pairs'),
    c: L("birorta juftlik yo'q", 'ни одной пары', 'no pairs at all'),
    d: L('(4; 0)', '(4; 0)', '(4; 0)'),
    ok: L("To'rttasi ham to'g'ri. Hammasini ikkinchi satr hal qiladi: u yo yangi, yo o'sha, yo qarama-qarshi.", 'Все четыре верно. Вторая строка решает всё: она либо новая, либо та же, либо противоречит.', 'All four correct. The second row decides everything: it is either new, or the same, or contradictory.'),
    left: ['x+y=4;  x−y=2', 'x+y=4;  2x+2y=8', 'x+y=4;  2x+2y=6', 'x+y=4;  x−y=4'],
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L("KO'RSATKICHLI SISTEMA", 'ПОКАЗАТЕЛЬНАЯ СИСТЕМА', 'AN EXPONENTIAL SYSTEM'),
  title: L('Qadamlar atalgan, tartib sizdan', 'Шаги названы, порядок за тобой', 'The steps are named, the order is yours'),
  tag: 'podstanovka-bez-vozvrata',
  audio: [
    A('mount', "Hamma darajaning asosi bir xil, va bu butun sistemaning kaliti. O'ttiz ikki bu ikkining beshinchi darajasi, shuning uchun birinchi satr ko'rsatkichlar yig'indisiga, ikkinchisi esa ularning ayirmasiga aylanadi.", 'Основание у всех степеней одно и то же, и это ключ ко всей системе. Тридцать два это два в пятой, поэтому первая строка превращается в сумму показателей, а вторая в их разность.', 'The base of all the powers is the same, and that is the key to the whole system. Thirty two is two to the fifth, so the first row turns into a sum of exponents and the second into their difference.'),
  ],
  order: {
    prompt: L('Tartib bilan joylashtiring', 'Расставь по порядку', 'Put them in order'),
    s1: L("ko'rsatkichlar qo'shiladi", 'показатели складываются', 'the exponents add'),
    s2: L('x + y = 5', 'x + y = 5', 'x + y = 5'),
    s3: L("ko'rsatkichlar ayiriladi", 'показатели вычитаются', 'the exponents subtract'),
    s4: L('x = 3, y = 2', 'x = 3, y = 2', 'x = 3, y = 2'),
    ok: L("To'g'ri. Ko'rsatkichli sistema oddiysiga keldi, keyin esa tanish qo'shish.", 'Верно. Показательная система свелась к обычной, а дальше знакомое сложение.', 'Correct. The exponential system came down to an ordinary one, and then the familiar addition.'),
    bad: L("Tartib boshqacha. Avval ikkala satr ko'rsatkichlarga o'tadi, keyin esa qo'shiladi.", 'Порядок другой. Сначала обе строки переводятся в показатели, и только потом складываются.', 'The order is different. Both rows go over to exponents first, and only then get added.'),
    mark: '(3; 2)',
  },
  sys: ['2ˣ·2ʸ = 32', '2ˣ : 2ʸ = 2'],
  expr: '2ˣ·2ʸ = 32;   2ˣ : 2ʸ = 2',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L("QOG'OZDA", 'НА БУМАГЕ', 'ON PAPER'),
  title: L('Logarifmik sistema, asbobsiz', 'Логарифмическая система, без прибора', 'A logarithmic system, no instrument'),
  tag: 'bumaga',
  audio: [
    A('mount', "Bu yerda asbob yo'q. Avval yozuvlar tartibi, keyin javob.", 'Прибора здесь нет. Сначала порядок записей, потом ответ.', 'There is no instrument here. First the order of the lines, then the answer.'),
    A('next', "Endi sistemaning o'zi. Iksni yozing.", 'Теперь сама система. Пиши икс.', 'Now the system itself. Write down x.'),
  ],
  order: {
    prompt: L("Yozuvlarni yechimda paydo bo'lish tartibida joylashtiring", 'Расставь записи в том порядке, в каком они появляются в решении', 'Put the lines in the order they appear in the solution'),
    title: L('Yozuvlar tartibi', 'Порядок записей', 'The order of the lines'),
    ok: L("To'g'ri. Logarifmlar yig'indisi ko'paytma logarifmiga yig'ildi, keyin oddiy o'rniga qo'yish.", 'Верно. Сумма логарифмов свернулась в логарифм произведения, дальше обычная подстановка.', 'Correct. The sum of logarithms folded into the logarithm of a product, then ordinary substitution.'),
    bad: L("Tartib to'g'ri emas. Logarifmlar birinchi olib tashlanadi, harf keyin ifodalanadi.", 'Не тот порядок. Логарифмы убираются первыми, буква выражается после.', 'Wrong order. The logarithms go first, the letter is expressed after that.'),
    items: ['xy = 8', 'x = y + 2', 'y² + 2y − 8 = 0', 'y = 2'],
    answer: 'xy = 8  x = y + 2  y² + 2y − 8 = 0  y = 2',
  },
  task: {
    prompt: 'log₂x + log₂y = 3;   x − y = 2',
    ok: L("To'g'ri. Iks to'rtga teng, igrek ikkiga teng, va ikkalasi noldan katta.", 'Верно. Икс равен четырём, игрек равен двум, и оба больше нуля.', 'Correct. x equals four, y equals two, and both are greater than zero.'),
    hint: [
      L("Bir xil asosli logarifmlar yig'indisi ko'paytma logarifmi.", 'Сумма логарифмов с одним основанием это логарифм произведения.', 'A sum of logarithms with the same base is the logarithm of the product.'),
      L("Ko'paytma sakkizga teng, ayirma esa ikkiga teng.", 'Произведение равно восьми, а разность равна двум.', 'The product equals eight, and the difference equals two.'),
      L('Kvadrat tenglamadan ikki son chiqadi, lekin biri noldan kichik va javobga bormaydi.', 'Из квадратного уравнения выходят два числа, но одно из них меньше нуля и в ответ не идёт.', 'The quadratic gives two numbers, but one of them is below zero and does not go into the answer.'),
    ],
    answer: '4',
  },
  sys: ['log₂x + log₂y = 3', 'x − y = 2'],
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L("Hamma qadam to'g'ri, javob noto'g'ri", 'Все шаги верны, ответ неверен', 'Every step is right, the answer is wrong'),
  tag: 'check',
  audio: [
    A('mount', "Yechim to'rt satrda yozilgan. Xato paydo bo'lgan satrni toping.", 'Решение выписано в четыре строки. Найди ту, где появилась ошибка.', 'The solution is written in four lines. Find the one where the mistake appeared.'),
    A('next', "Endi buni son bilan ko'rsating. Bitta o'rniga qo'yish hammasini hal qiladi.", 'Теперь покажи это числом. Одна подстановка всё решает.', 'Now show it with a number. A single substitution settles it.'),
  ],
  hint: {
    r1: L("Kvadratga ko'tarish to'g'ri bajarilgan: chapda ildiz ketdi, o'ngda ayirmaning kvadrati.", 'Возведение сделано верно: слева корень исчез, справа квадрат разности.', 'The squaring is done correctly: on the left the root is gone, on the right the square of a difference.'),
    r2: L("Keltirish to'g'ri: birlar qisqardi, iks kvadrat ayirish uch iks qoldi.", 'Приведение верное: единицы сократились, осталось икс в квадрате минус три икс.', 'The reduction is correct: the ones cancelled, x squared minus three x is left.'),
    r3: L("Ikkala son ham to'g'ri amallar bilan olingan, xato bu yerda emas.", 'Оба числа получены верными действиями, ошибка не здесь.', 'Both numbers came from correct steps, the mistake is not here.'),
  },
  proof: L("Xato oxirgi satrda. Kvadratga ko'tarish natija beradi, shuning uchun topilganni dastlabki satrga qaytarish kerak.", 'Ошибка в последней строке. Возведение в квадрат даёт следствие, поэтому найденное надо вернуть в исходную строку.', 'The mistake is in the last line. Squaring gives a consequence, so what was found must go back into the original row.'),
  entry: {
    prompt: L("Iks teng nolni birinchi satrning o'ng tomoniga qo'ying. U nima beradi?", 'Подставь икс равно нулю в правую часть первой строки. Что она даёт?', 'Substitute x equals zero into the right side of the first row. What does it give?'),
    ok: L("To'g'ri. Chapda bir, o'ngda minus bir. Nolli juftlik javobga bormaydi.", 'Верно. Слева единица, справа минус единица. Пара с нулём в ответ не идёт.', 'Correct. One on the left, minus one on the right. The pair with zero does not go into the answer.'),
    hint: [
      L("Birinchi satrning o'ng tomoni bu iks ayirish bir.", 'Правая часть первой строки это икс минус один.', 'The right side of the first row is x minus one.'),
      L("Bu ifodada iks o'rniga nolni qo'ying.", 'Подставь ноль вместо икс в это выражение.', 'Substitute zero for x in that expression.'),
      L("Nol ayirish bir bu minus bir, ildiz esa manfiy bo'lmaydi.", 'Ноль минус один это минус один, а корень отрицательным не бывает.', 'Zero minus one is minus one, and a root is never negative.'),
    ],
    answer: '−1',
  },
  sys: ['√(x + 1) = x − 1', 'y = 2x'],
  expr: '√(x + 1) = x − 1;   y = 2x',
  row: {
    r1: 'x + 1 = x² − 2x + 1',
    r2: 'x² − 3x = 0',
    r3: 'x = 0;   x = 3',
    r4: '(0; 0),   (3; 6)',
  },
  answerId: 'r4',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L('TESKARI MASALA', 'ОБРАТНАЯ ЗАДАЧА', 'THE REVERSE TASK'),
  title: L("Endi sonni siz qo'yasiz", 'Теперь ты ставишь число', 'Now you place the number'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Bungacha sistemani sizga berardilar. Endi sonni o'zingiz qo'yasiz va yechim nechta bo'lishini hal qilasiz.", 'До этого систему давали тебе. Теперь ты сам ставишь число и решаешь, сколько будет решений.', 'Until now the system was given to you. Now you place the number and decide how many solutions there will be.'),
    A('work', "O'n ikki soni qanchalik yakka bo'lib chiqqaniga e'tibor bering. Boshqa hamma son bo'sh javob beradi.", 'Обрати внимание, каким одиноким оказалось число двенадцать. Все остальные числа дают пустой ответ.', 'Notice how lonely the number twelve turned out to be. Every other number gives an empty answer.'),
  ],
  multi: {
    prompt: L("Yechimi yo'q hamma sistemani belgilang", 'Отметь все системы, у которых решений нет', 'Mark every system that has no solutions'),
    title: L("To'rttadan ikkitasi", 'Две из четырёх', 'Two out of four'),
    ok: L("To'g'ri. Chap tomonlar proporsional, o'ng tomonlar esa bu proporsiyani ushlamasa, yechim yo'q.", 'Верно. Решений нет, когда левые части пропорциональны, а правые этой пропорции не держат.', 'Correct. There are no solutions when the left sides are proportional and the right sides do not keep that proportion.'),
    items: [
      { id: 'c', label: 'x − 2y = 6;  2x − 4y = 12', hint: L("Bu yerda ikkinchi satr birinchining ikkiga ko'paytirilgani, o'ng tomoni bilan. Birinchi chiziqdagi har qanday juftlik yaraydi.", 'Здесь вторая строка это первая, умноженная на два, вместе с правой частью. Подходит любая пара с первой прямой.', 'Here the second row is the first multiplied by two, right side included. Any pair from the first line fits.') },
      { id: 'd', label: 'x + y = 1;  x − y = 1', hint: L("Satrlarni qo'shing: ikki iks teng ikki. Juftlik darrov topiladi.", 'Сложи строки: два икс равно двум. Пара находится сразу.', 'Add the rows: two x equals two. The pair is found at once.') },
      { id: 'a', label: 'x − 2y = 6;  2x − 4y = 0', ok: true },
      { id: 'b', label: 'x + y = 1;  x + y = 5', ok: true },
    ],
  },
  entry: {
    prompt: L("Yulduzcha o'rniga qanday son cheksiz ko'p yechim beradi?", 'Какое число вместо звёздочки даст бесконечно много решений?', 'Which number in place of the star gives infinitely many solutions?'),
    ok: L("To'g'ri. O'n ikkida ikkinchi satr birinchining ikkiga ko'paytirilgani, butunlay.", 'Верно. При двенадцати вторая строка это первая, умноженная на два, целиком.', 'Correct. At twelve the second row is the first one multiplied by two, entirely.'),
    hint: [
      L("Birinchi satrni ikkiga ko'paytiring va o'ng tomonga qarang.", 'Умножь первую строку на два и посмотри на правую часть.', 'Multiply the first row by two and look at the right side.'),
      L("Chapda aynan ikki iks ayirish to'rt igrek chiqadi.", 'Слева выйдет ровно два икс минус четыре игрек.', 'On the left you get exactly two x minus four y.'),
      L("Oltini ikkiga ko'paytirsa o'n ikki chiqadi.", 'Шесть умножить на два даёт двенадцать.', 'Six times two gives twelve.'),
    ],
    expr: 'x − 2y = 6;   2x − 4y = ✱',
    answer: '12',
  },
  sys: ['x − 2y = 6', '2x − 4y = ✱'],
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'THE BLITZ'),
  title: L("Ketma-ket to'rtta savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'sistema-ne-para',
  audio: [
    A('mount', "To'rtta savol, va ular baholanadi.", 'Четыре вопроса, и они идут в оценку.', 'Four questions, and they count towards the score.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Ikki harfli ikkita tenglama sistemasining yechimi bu...', 'Решение системы двух уравнений с двумя буквами это…', 'A solution of a system of two equations in two letters is...'),
      done: L('Juftlik, va doim iks, igrek tartibida.', 'Пара, и всегда в порядке икс, игрек.', 'A pair, and always in the order x, y.'),
      items: [
        { id: 'a', label: L('sonlar juftligi', 'пара чисел', 'a pair of numbers'), correct: true },
        { id: 'b', label: L('bitta son', 'одно число', 'a single number'), hint: L('Bitta son ikkinchi satrni hech narsaga aylantirmaydi: unda ikki harf bor.', 'Одно число вторую строку не обращает ни во что: там две буквы.', 'A single number turns the second row into nothing: it has two letters.') },
        { id: 'c', label: L('birinchi satrdagi har qanday son', 'любое число из первой строки', 'any number from the first row'), hint: L('Unda ikkinchi satr umuman qatnashmaydi, u esa shartning yarmi.', 'Тогда вторая строка вообще не участвует, а она половина условия.', 'Then the second row takes no part at all, and it is half the condition.') },
        { id: 'd', label: L('chiziqlardan biridagi nuqta', 'точка на одной из прямых', 'a point on one of the lines'), hint: L("Bir vaqtda ikki chiziqdagi nuqta, ya'ni umumiy nuqta kerak.", 'Нужна точка сразу на двух прямых, то есть общая.', 'A point on both lines at once is needed, that is, a common one.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Chiziqlar parallel va ustma-ust tushmaydi. Sistemaning nechta yechimi bor?', 'Прямые параллельны и не совпадают. Сколько решений у системы?', 'The lines are parallel and do not coincide. How many solutions has the system?'),
      done: L("Bo'sh javob ham javob, va uni olishni bilish kerak.", 'Пустой ответ это тоже ответ, и его надо уметь получить.', 'An empty answer is an answer too, and one has to know how to get it.'),
      items: [
        { id: 'a', label: L("birorta ham yo'q", 'ни одного', 'none'), correct: true },
        { id: 'b', label: L('bitta', 'одно', 'one'), hint: L('Bitta yechim bu kesishish, parallellar esa kesishmaydi.', 'Одно решение это пересечение, а параллельные не пересекаются.', 'One solution means an intersection, and parallel lines do not intersect.') },
        { id: 'c', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many'), hint: L("Cheksiz ko'p chiziqlar ustma-ust tushganda bo'ladi, bu yerda esa tushmaydi deyilgan.", 'Бесконечно много бывает, когда прямые совпали, а здесь сказано, что нет.', 'Infinitely many happens when the lines coincide, and here it says they do not.') },
        { id: 'd', label: L('ikkita', 'два', 'two'), hint: L("Ikki chiziqning aynan ikkita umumiy nuqtasi hech qachon bo'lmaydi.", 'Ровно двух общих точек у двух прямых не бывает никогда.', 'Two lines never have exactly two common points.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Ikki iks qo'shuv igrek teng yetti, uch iks ayirish igrek teng sakkiz. Qaysi usul qisqaroq?", 'Два икс плюс игрек равно семи, три икс минус игрек равно восьми. Какой способ короче?', 'Two x plus y equals seven, three x minus y equals eight. Which way is shorter?'),
      done: L('Harf tayyorgarliksiz ketadigan usul qisqaroq.', 'Короче тот способ, где буква уходит без подготовки.', 'The shorter way is the one where the letter leaves with no preparation.'),
      items: [
        { id: 'a', label: L("satrlarni qo'shish", 'сложить строки', 'add the rows'), correct: true, ok: L("Ha: igrekning ko'paytuvchilari allaqachon qarama-qarshi, harf hech qanday tayyorgarliksiz ketadi.", 'Да: множители при игрек уже противоположны, буква уходит без всякой подготовки.', 'Yes: the factors of y are already opposite, so the letter leaves with no preparation.') },
        { id: 'b', label: L('birinchisidan iksni ifodalash', 'выразить икс из первой', 'express x from the first'), hint: L("Bu ham chiqadi, lekin bo'lmasligi mumkin bo'lgan joyda kasr paydo bo'ladi.", 'Так тоже выйдет, но появится дробь там, где её могло не быть.', 'That works too, but it brings a fraction where none was needed.') },
        { id: 'c', label: L("kvadratga ko'tarish", 'возвести в квадрат', 'square both sides'), hint: L("Bu yerda ildiz yo'q, ko'taradigan narsa yo'q.", 'Корней здесь нет, возводить нечего.', 'There are no roots here, nothing to square.') },
        { id: 'd', label: L("o'zgaruvchini almashtirish", 'заменить переменную', 'change the variable'), hint: L('Almashtirish harf ildiz yoki logarifm ichida turganda kerak.', 'Замена нужна, когда буква стоит внутри корня или логарифма.', 'A change of variable is for when the letter sits inside a root or a logarithm.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Irratsional sistemada juftlik topildi. Nima shart?', 'Пара найдена в иррациональной системе. Что обязательно?', 'A pair is found in an irrational system. What is required?'),
      done: L('Tekshiruv yechimning qismi, xushmuomalalik emas.', 'Проверка это часть решения, а не вежливость.', 'The check is part of the solution, not a courtesy.'),
      items: [
        { id: 'a', label: L("uni dastlabki satrlarga qo'yish", 'подставить её в исходные строки', 'substitute it into the original rows'), correct: true },
        { id: 'b', label: L('yaxlitlash', 'округлить', 'round it off'), hint: L("Yaxlitlash sonni o'zgartiradi, tekshiruvni esa almashtirmaydi.", 'Округление меняет число, а проверку не заменяет.', 'Rounding changes the number and does not replace the check.') },
        { id: 'c', label: L('darrov javobga yozish', 'сразу записать в ответ', 'write it into the answer at once'), hint: L("Kvadratga ko'tarish natija beradi, va ortiqcha son o'zi paydo bo'ladi.", 'Возведение в квадрат даёт следствие, и лишнее число появляется само.', 'Squaring gives a consequence, and a spare number appears by itself.') },
        { id: 'd', label: L('sonlarni joyini almashtirish', 'поменять числа местами', 'swap the numbers'), hint: L("Juftlikdagi tartib harflar bilan berilgan, uni o'zgartirib bo'lmaydi.", 'Порядок в паре задан буквами, менять его нельзя.', 'The order in a pair is set by the letters, it cannot be changed.') },
      ],
    },
  ],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('XULOSA', 'ИТОГ', 'THE SUMMARY'),
  title: L('Juftlik, ikki satr, uch usul', 'Пара, две строки, три способа', 'A pair, two rows, three methods'),
  audio: [
    A('mount', 'Birinchi ekrandagi taxmin va natija yonma-yon turadi.', 'Прогноз с первого экрана и результат стоят рядом.', 'The guess from screen one and the result stand side by side.'),
    A('next', "Shpargalka darslik bo'yicha yig'ilgan. Pastda nimani bilishingiz ko'rinadi.", 'Шпаргалка собрана по учебнику. Ниже видно, что умеешь.', 'The sheet is put together from the textbook. Below you can see what you can do.'),
  ],
  can: [
    L("Juftlikni ikkala satrga qo'yib tekshiraman", 'Проверяю пару подстановкой в обе строки', 'I check a pair by substituting into both rows'),
    L("O'rniga qo'yish va algebraik qo'shish bilan yechaman", 'Решаю подстановкой и алгебраическим сложением', 'I solve by substitution and by algebraic addition'),
    L("Yechim yo'q va cheksiz ko'p bo'lgan holatni ko'raman", 'Вижу, когда решений нет и когда их бесконечно много', 'I see when there are no solutions and when there are infinitely many'),
    L("Topilganni ruxsat etilgan qiymatlar bo'yicha tekshiraman", 'Проверяю найденное по допустимым значениям', 'I check what I found against the allowed values'),
  ],
  levels: {
    full: L("Hammasidan o'tdingiz va tuzoqni ochdingiz", 'Прошёл всё и разобрал ловушку', 'Everything done, the trap taken apart'),
    gap: L("Usullar ishlaydi, ruxsat etilgan qiymatlar tekshiruvi hali yo'q", 'Способы работают, проверка допустимых значений ещё нет', 'The methods work, the check of allowed values not yet'),
    back: L("To'rtinchi ekranga qaytish kerak: juftlik ikki satrda tekshiriladi", 'Стоит вернуться к экрану четыре: пара проверяется в двух строках', 'Worth going back to screen four: a pair is checked in two rows'),
  },
  bridge: L("Keyingisi trigonometrik tengsizliklar: unda javob yana son emas, to'plam.", 'Дальше тригонометрические неравенства: там ответ снова не число, а множество.', 'Next come trigonometric inequalities: there the answer is again not a number but a set.'),
  lifehack: L("Agar bir satrning chap tomoni boshqasini ko'paytuvchi bilan takrorlasa, javob har qanday hisobdan oldin hal bo'ladi: o'ng tomon ham o'sha ko'paytuvchini takrorlaydi yoki yechim yo'q.", 'Если левые части одной строки повторяют другую с множителем, ответ решается до всякого счёта: правая часть либо повторяет тот же множитель, либо решений нет.', "If one row's left side repeats the other with a factor, the answer is settled before any arithmetic: either the right side repeats that same factor, or there are no solutions."),
  sheetTitle: L('Dars shpargalkasi', 'Шпаргалка урока', 'The lesson sheet'),
  sheetSrc: L('algebra 2022, 70, 87, 119-betlar', 'алгебра 2022, стр. 70, 87, 119', 'algebra 2022, pages 70, 87, 119'),
  hook: {
    a: '(4; −1)',
    b: '∅',
  },
  proved: '∅',
  law: '(x₀; y₀) ∈ S₁ ∩ S₂',
  sheet: [
    'y = −5 − x   ⇒   3x − (−5 − x) = −7',
    'x + 2y = 8;  6x − 2y = 6   ⇒   7x = 14',
    'a = √x, b = √y   ⇒   a + b = 5, a² − b² = 5',
    'log₂x + log₂y = 3   ⇒   xy = 8',
    '2x − 4y = 12 ⇒ ∞;   2x − 4y ≠ 12 ⇒ ∅',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))

// SISTEMA KITOBDAGIDEK: figurali qavs va satrlar bir-birining ostida.
// Metodist qarori 27.08.2026. Bir qatorga yozilgan ikki satr 360 px li
// telefonda kartochkadan 41 px chiqib ketardi -- satrlab yozilgani sig'adi.
const Sys = ({ rows, size = 'mid' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
    <span
      aria-hidden="true"
      style={{
        fontFamily: MATH_FONT,
        fontSize: size === 'sm' ? 30 : 38,
        lineHeight: 0.8,
        color: 'rgba(23,26,29,.5)',
      }}
    >
      {'{'}
    </span>
    <span style={{ display: 'block' }}>
      {(Array.isArray(rows) ? rows : [rows]).map((r, i) => (
        <Expr key={i} size={size} style={{ textAlign: 'left' }}>{r}</Expr>
      ))}
    </span>
  </div>
)

// ASBOB 2 SHU DARSDA: YOZUV. Kartochka -- daftar varag'i, yozuv pastga satrlab
// o'sadi, «darrov javob» tugmasi yo'q. 21 va 22-darslarda ham shunday: alohida
// figura kerak emas, yozuvning O'ZI asbob.
const Rec = ({ sys, line, items }) => (
  <Cols l={1} r={1}>
    <Col>
      <Panel tone="paper">
        <Sys rows={sys} size="sm" />
        <Expr size="big" style={{ textAlign: 'left', marginTop: 6 }}>{line}</Expr>
      </Panel>
    </Col>
    <Col><NoteList items={items} /></Col>
  </Cols>
)

// ODZ POLOSASI 7-ekranda: chegara nolda, ildiz ostidagi manfiy bo'lmaydi.
const BAND = { lo: -3, hi: 11, ticks: [-2, 0, 2, 4, 6, 8, 10] }

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const SYS_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const SYS_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

// UCHTA QADAM, TO'RTTA EMAS: noutbukda balandlik 615 px, va to'rtta slot
// 15 px ga oshib ketardi. Ma'no saqlanadi -- ikkinchi satr «takrorlash»
// qadamiga kiradi.
const ORD4 = ['s1', 's2', 's3'].map((id) => ({ id, label: S4.order[id] }))
const ORD10 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S10.order[id] }))
const ORD11 = S11.order.items.map((label, i) => ({ id: 'o' + i, label }))
const ORD11_ANS = String(S11.order.answer).split(/\s{2,}/)
  .map((lbl) => (ORD11.find((x) => x.label === lbl.trim()) || {}).id)

const TRAP_ROWS = ['r1', 'r2', 'r3', 'r4'].map((id) => ({ id, text: S12.row[id] }))

// IKKI CHIZIQ: birinchi satr `y = 0,5x − 3`, ikkinchisi `y = 0,5x + 2`.
// Og'ish bir xil, balandlik boshqa -- shuning uchun umumiy nuqta yo'q.
const Lines = ({ step, size }) => (
  <TwoLines size={size} step={step} k1={0.5} b1={-3} k2={0.5} b2={2} />
)

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
        // FAQAT BIRINCHI CHIZIQ. Prognoz ikkinchisi ko'rinishidan OLDIN
        // qilinadi: aks holda javob chizmadan o'qiladi, taxmin qilinmaydi.
        fig={() => <Scene fig={<Lines step={0} />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.2}>
        <Col>
          <Panel tone="paper">
            <Sys rows={S2.sys} size="sm" />
          </Panel>
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
      /* Yozuv pastga o'sadi: 1-kadrda bir harf ikkinchisi orqali ifodalanadi,
         2-kadrda ikkinchi satrda bitta harf qoladi. */
      <Rec sys={S3.sys} line={phase === 0 ? S3.frame[1] : S3.frame[2]} items={S3.show[phase]} />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="mid" style={{ textAlign: 'left' }}>{S3.work.expr}</Expr>
          </Panel>
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
      /* Ikki yozuv: bitta juftlik va uning joyi almashgani. Birinchi satr
         yig'indi bo'lgani uchun ikkalasini ham ko'taradi -- farq IKKINCHI
         satrda ko'rinadi, va aynan shu tekshiruvni majbur qiladi. */
      <Rec sys={S4.sys} line={phase === 0 ? S4.frame[1] : S4.frame[2]} items={S4.show[phase]} />
    ) : (
      <OrderRow
        prompt={S4.order.prompt}
        items={ORD4}
        answer={['s1', 's2', 's3']}
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
      /* DARSNING SHOHIDI. 1-kadrda ikkinchi chiziq paydo bo'ladi, 2-kadrda tik
         masofa uch joyda o'lchanadi va uchalasi teng chiqadi. */
      <Scene fig={<Lines step={phase + 1} />} note={<NoteList items={S5.show[phase]} />} />
    ) : (
      <Cols l={1} r={1}>
        <Col><Scene fig={<Lines step={2} />} max={300} /></Col>
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
      /* 1-kadr: satrlar borligicha qo'shildi, ikkala harf ham qoldi.
         2-kadr: ikkinchi satr ikkiga ko'paytirilgan, va harf o'zi ketdi. */
      <Rec sys={S6.sys} line={phase === 0 ? S6.frame[1] : S6.frame[2]} items={S6.show[phase]} />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <Expr size="mid" style={{ textAlign: 'left' }}>{S6.work.expr}</Expr>
          </Panel>
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
      /* ASBOB 5. Polosa YECHIMDAN OLDIN bo'yaladi: almashtirishdan keyin shart
         yozuvdan ketadi, masaladan esa ketmaydi. */
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<DomainBand step={phase} from={0} {...BAND} />} max={280} h={186} />
          <Panel tone="paper">
            <Sys rows={S7.sys} size="sm" />
            <Expr size="mid" style={{ marginTop: 4 }}>{phase === 0 ? S7.frame[1] : S7.frame[2]}</Expr>
          </Panel>
        </Col>
        <Col><NoteList items={S7.show[phase]} /></Col>
      </Cols>
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<DomainBand step={1} from={0} {...BAND} />} max={280} h={186} />
          <Panel tone="paper">
            <Expr size="mid">{S7.work.expr}</Expr>
          </Panel>
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
        // Ikkinchi chiziq va tik masofalar javob paytida ochiladi: qoida uni
        // tug'dirgan harakat yonida turadi.
        fig={(solved) => <Scene fig={<Lines step={solved ? 2 : 0} />} max={330} />}
      />
    )}
  </Screen>
)

const Screen9 = (p) => (
  <Screen data={S9} {...p}>
    {({ audio, solve }) => (
      <MatchPairs
        prompt={S9.match.prompt}
        left={SYS_LEFT}
        right={SYS_RIGHT}
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
        {/* NOUTBUKDA BALANDLIK 615 px, va bu ekranda to'rtta chip ustiga
            yozuv qo'shiladi. Yozuv KICHIK yarusda: prognon 15 px oshib
            ketganini ko'rsatdi, va oshib ketgan joy aynan shu satr edi. */}
        <Sys rows={S10.sys} size="sm" />
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
            <Sys rows={S11.sys} />
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
          <Panel tone="paper">
            <Sys rows={S12.sys} size="sm" />
          </Panel>
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
          {/* Yulduzcha turgan yozuv: son qo'yilmaguncha sistema tugallanmagan. */}
          <Panel tone="paper">
            <Sys rows={S13.sys} />
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
          <Scene fig={<Lines step={round >= 1 ? 2 : 1} />} max={260} h={168} />
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
