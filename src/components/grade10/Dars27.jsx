// ============================================================================
// 10-sinf, Dars 27. KO'RSATKICHLI FUNKSIYA.
//
// ASBOB: 4-asbobning soddalashtirilgan ko'rinishi -- koordinata tekisligi
// (`Plane`). Oyna BUTUN darsda bitta (`WIN`): boshqa bo'lsa, bir xil nuqta
// har xil joyda ko'rinadi va o'quvchi bu boshqa funksiya deb o'ylaydi.
// SHOHID: asimptota -- egri chiziq o'qqa yaqinlashadi va tegmaydi.
//
// Yuqoridagi ma'lumot `scripts/grade10-kontent-build.mjs` bilan
// `src/books/grade10/DARS27_KONTENT.md` dan yig'ilgan: QO'LDA tuzatmang,
// kontentni tuzatib qaytadan yig'ing. Ekran tanalari esa qo'lda yozilgan.
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
const LESSON_NO = 27
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Ko'rsatkichli funksiya`,
  `Урок ${LESSON_NO}. Показат. функция`,
  `Lesson ${LESSON_NO}. The exponential function`,
)

const BLOCK = { label: 'B5', from: 26, to: 37, current: 27 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('FUNKSIYA', 'ФУНКЦИЯ', 'THE FUNCTION'),
  title: L("Egri chiziq o'qqa yetadimi", 'Дойдёт ли кривая до оси', 'Will the curve reach the axis'),
  audio: [
    A('mount', "Egri chiziq chapdan o'ngga boradi va o'qqa yopishadi. Ko'z bilan u o'qqa tegdimi yoki yo'qmi, ajratib bo'lmaydi.", 'Кривая идёт слева направо и прижимается к оси. На глаз не различить, коснулась она оси или нет.', 'The curve runs left to right and hugs the axis. By eye you cannot tell whether it touched the axis or not.'),
    A('r1', 'Birinchi yozuv chapda qayerdadir egri chiziq nolga yetadi deydi.', 'Первая запись говорит, что где-то слева кривая доходит до нуля.', 'The first reading says that somewhere on the left the curve reaches zero.'),
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
      value: '2^x = 0',
    },
    b: {
      name: L('yaqinlashadi va tegmaydi', 'подойдёт и не коснётся', 'it comes close and never touches'),
      value: '2^x > 0',
    },
  },
  expr: 'y = 2^x',
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
      prompt: L('Ikki minus uchinchi darajada nechaga teng?', 'Чему равно два в минус третьей степени?', 'What is two to the minus third power?'),
      done: '2^{−3} = 1/8',
      items: [
        { id: 'a', label: L('bir sakkizdan', 'одна восьмая', 'one eighth'), correct: true },
        { id: 'b', label: L('minus sakkiz', 'минус восемь', 'minus eight'), hint: L("Ko'rsatkichdagi minus kasrni teskari qiladi, sonning ishorasiga tegmaydi.", 'Минус в показателе переворачивает дробь, а знак числа не трогает.', 'The minus in the exponent turns the fraction over and leaves the sign alone.') },
        { id: 'c', label: L('minus bir sakkizdan', 'минус одна восьмая', 'minus one eighth'), hint: L("Kasr to'g'ri, minus esa ortiqcha: u ko'rsatkichda ishlab bo'ldi.", 'Дробь верная, а минус лишний: он уже отработал в показателе.', 'The fraction is right, the minus is extra: it already did its work in the exponent.') },
        { id: 'd', label: L('olti', 'шесть', 'six'), hint: L("Olti ikki bilan uchni ko'paytirsak chiqardi.", 'Шесть вышло бы, если два и три перемножить.', 'Six would come from multiplying two by three.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Ikki nol darajada nechaga teng?', 'Чему равно два в нулевой степени?', 'What is two to the zero power?'),
      done: '2⁰ = 1',
      items: [
        { id: 'a', label: L('bir', 'единица', 'one'), correct: true },
        { id: 'b', label: L('nol', 'ноль', 'zero'), hint: L('Zinapoyadan tushing: ikkidan keyin nol emas, bir keladi.', 'Спустись по лестнице: после двойки идёт единица, а не ноль.', 'Walk down the ladder: after two comes one, not zero.') },
        { id: 'c', label: L('ikki', 'два', 'two'), hint: L('Ikki bu birinchi daraja, nol esa bir qadam pastda.', 'Два это первая степень, нулевая на шаг ниже.', 'Two is the first power, the zero one is a step below.') },
        { id: 'd', label: L("bunday yozuv yo'q", 'такой записи нет', 'there is no such reading'), hint: L("Bor: zinapoya pastga nol ko'rsatkich orqali o'tadi.", 'Есть: лестница вниз проходит через нулевой показатель.', 'There is: the ladder down passes through the zero exponent.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Kasr ko'rsatkich nimani bildiradi?", 'Что означает дробный показатель?', 'What does a fractional exponent mean?'),
      done: 'a^{1/n} = ⁿ√a',
      items: [
        { id: 'a', label: L('ildiz', 'корень', 'a root'), correct: true },
        { id: 'b', label: L("asosni bo'lish", 'деление основания', 'dividing the base'), hint: L("Sakkiz uchga bo'linib kubga ko'tarilsa sakkiz emas, o'n to'qqiz beradi.", 'Восемь разделить на три в куб даёт девятнадцать, а не восемь.', 'Eight divided by three, cubed, gives nineteen, not eight.') },
        { id: 'c', label: L("asosni ko'paytirish", 'умножение основания', 'multiplying the base'), hint: L("Ildiz sonni kichraytiradi, ko'paytirish esa kattalashtirardi.", 'Корень число уменьшает, а умножение увеличило бы.', 'A root makes the number smaller, multiplying would make it bigger.') },
        { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L('Qiymat bor, va u teskari amal bilan tekshiriladi.', 'Значение есть, и его проверяют обратным действием.', 'The value exists, and it is checked by the inverse action.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'lead',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Ko'rsatkich o'zgaruvchi bo'ldi", 'Показатель стал переменной', 'The exponent became a variable'),
  tag: 'd-vs-e',
  show: [
    [
      L("ko'rsatkichda endi iks", 'в показателе теперь икс', 'the exponent now holds x'),
      L('nuqta yuradi, izlar tushadi', 'точка идёт, следы падают', 'the point walks, the traces fall'),
      'y = 2^x',
    ],
    [
      L("kirish gorizontal bo'yicha", 'вход по горизонтали', 'the input along the horizontal'),
      L("chiqish vertikal bo'yicha", 'выход по вертикали', 'the output along the vertical'),
      'D(y) = (−∞; +∞)',
    ],
  ],
  motion: ['walk'],
  audio: [
    A('mount', "O'tgan darsda ko'rsatkich son edi. Endi uning o'rnida iks turadi, va yozuv funksiyaga aylandi.", 'В прошлом уроке показатель был числом. Теперь на его месте икс, и запись стала функцией.', 'In the previous lesson the exponent was a number. Now x stands in its place, and the reading became a function.'),
    A('walk', "Nuqta egri chiziq bo'ylab yuradi, undan ikkita iz tushadi. Pastdagisi kirish, chapdagisi chiqish. Kirish har qanday bo'lishi mumkin: butun, kasr, manfiy, irratsional. O'tgan dars ko'rsatdi: asos musbat bo'lsa, har qanday haqiqiy ko'rsatkichli daraja bor. Demak aniqlanish sohasi butun son o'qi, uzilishsiz va taqiqsiz.", 'Точка идёт по кривой, и от неё падают два следа. Нижний след это вход, левый это выход. Вход берут любой: целый, дробный, отрицательный, иррациональный. Прошлый урок показал, что степень есть при любом действительном показателе, если основание положительно. Значит область определения это вся числовая прямая, без пропусков и без запретов.', 'The point walks along the curve, dropping two traces. The lower one is the input, the left one the output. Any input is allowed: whole, fractional, negative, irrational. The previous lesson showed that a power exists for any real exponent when the base is positive. So the domain is the whole number line, with no gaps and no bans.'),
    A('work', "O'zingiz hisoblang. Iksning nechta qiymatini tashlab ketish kerak?", 'Посчитай сам. Сколько значений икс приходится пропустить?', 'Work it out yourself. How many values of x have to be skipped?'),
  ],
  work: {
    prompt: L('Iksning nechta qiymatini tashlab ketish kerak?', 'Сколько значений икс приходится пропустить?', 'How many values of x have to be skipped?'),
    ok: L("Birortasi ham. Asos musbat bo'lsa, har qanday haqiqiy ko'rsatkichli daraja bor.", 'Ни одного. Степень с любым действительным показателем есть, если основание положительно.', 'None. A power with any real exponent exists when the base is positive.'),
    hint: [
      L("Yozuv mavjud bo'lmaydigan iksni topishga urinib ko'ring.", 'Попробуй найти икс, при котором записи не существует.', 'Try to find an x for which the reading does not exist.'),
      L("Kasr va manfiy ko'rsatkich o'tgan darsda ko'rilgan.", 'Дробный и отрицательный показатель уже разобраны в прошлом уроке.', 'The fractional and the negative exponent were covered last lesson.'),
      L('Birortasi ham.', 'Ни одного.', 'None.'),
    ],
    answer: '0',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("O'zgaruvchi qayerda turadi", 'Где стоит переменная', 'Where the variable stands'),
  tag: 'stepennaya-vmesto-pokazatelnoy',
  show: [
    [
      L('bir yozuvda iks asosda', 'у одной записи икс в основании', 'in one reading x is the base'),
      L("boshqasida ko'rsatkichda", 'у другой в показателе', 'in the other it is the exponent'),
      'y = x²',
    ],
    [
      L('nolda nol va bir', 'в нуле ноль против единицы', 'at zero, zero against one'),
      L('qiymatlar darrov ajraladi', 'значения расходятся сразу', 'the values part company at once'),
      'y = 2^x',
    ],
  ],
  motion: ['split'],
  audio: [
    A('mount', "Ikki o'xshash yozuv, va ular ko'p aralashtiriladi. Butun farq iks qayerda turganida.", 'Две похожие записи, и их часто путают. Вся разница в том, где стоит икс.', 'Two similar readings, often mixed up. The whole difference is where x stands.'),
    A('split', "Nolni qo'yamiz. Iks kvadratda nol beradi, ikki iks darajada esa bir beradi. Shu yerda ular ajralib ketdi. Minus ikkini qo'yamiz. Iks kvadratda to'rt beradi, ikki iks darajada esa bir choraklik. Demak bular har xil funksiya, harflari joy almashgan bitta yozuv emas. Va tekshirish yozuvning ko'rinishi bilan emas, qiymat qo'yish bilan bo'ladi.", 'Подставим ноль. Икс в квадрате даёт ноль, а два в степени икс даёт единицу. Уже здесь они разошлись. Подставим минус два. Икс в квадрате даёт четыре, а два в степени икс одну четвёртую. Значит это разные функции, а не одна запись с переставленными буквами. И проверять надо не по виду записи, а подстановкой.', 'Substitute zero. x squared gives zero, and two to the x gives one. They already parted here. Substitute minus two. x squared gives four, and two to the x gives one quarter. So these are different functions, not one reading with the letters swapped. And the check is by substitution, not by the look of the reading.'),
    A('work', "O'zingiz hisoblang. Iks nolga teng bo'lganda ikki iks darajada nechaga teng?", 'Посчитай сам. Чему равно два в степени икс при икс, равном нулю?', 'Work it out yourself. What is two to the x when x equals zero?'),
  ],
  work: {
    prompt: L("Iks nolga teng bo'lganda ikki iks darajada nechaga teng?", 'Чему равно два в степени икс при икс, равном нулю?', 'What is two to the x when x equals zero?'),
    ok: L("Bir. Darajali funksiyada nolda nol bo'lardi, va bu ular ajraladigan birinchi nuqta.", 'Единица. У степенной функции в нуле был бы ноль, и это первая точка, где они расходятся.', 'One. The power function would give zero at zero, and that is the first point where they part.'),
    hint: [
      L("Nol ko'rsatkich o'tgan darsda ko'rilgan.", 'Нулевой показатель разобран в прошлом уроке.', 'The zero exponent was covered last lesson.'),
      L('Har qanday musbat asos nol darajada bir xil natija beradi.', 'Любое положительное основание в нулевой степени даёт одно и то же.', 'Any positive base to the zero power gives the same thing.'),
      L('Bir.', 'Один.', 'One.'),
    ],
    answer: '1',
  },
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Nol chegara bo'lib qoladi", 'Ноль остаётся границей', 'Zero stays a boundary'),
  tag: 'nol-vhodit-v-e',
  show: [
    [
      L("egri chiziq bo'ylab chapga yuramiz", 'идём по кривой влево', 'we walk left along the curve'),
      L("o'qqa masofa kamayadi", 'расстояние до оси уменьшается', 'the distance to the axis shrinks'),
      '2^{−10} = 1/1024',
    ],
    [
      L("birorta nuqtada ham tegish yo'q", 'касания нет ни в одной точке', 'there is no touching at any point'),
      L('qiymatlar musbat', 'значения положительны', 'the values are positive'),
      'E(y) = (0; +∞)',
    ],
  ],
  motion: ['near'],
  audio: [
    A('mount', "Egri chiziq bo'ylab chapga yuramiz. Qiymatlar kamayadi va juda kichik bo'lib qoladi.", 'Пойдём по кривой влево. Значения уменьшаются и становятся совсем маленькими.', 'Let us walk left along the curve. The values shrink and become very small.'),
    A('near', "O'q asimptota deb belgilangan. Egri chiziq unga qanchalik yaqin kelsa ham tegmaydi. Sababi oddiy: qiymat bu ikkilar ko'paytmasi, ko'paytma esa faqat ko'paytuvchilardan biri nol bo'lganda nolga aylanadi. Ikki esa hech qachon nol bo'lmaydi. Shuning uchun qiymatlar to'plami noldan boshlanadi va nolning o'zini o'z ichiga olmaydi.", 'Ось подписана как асимптота. Кривая подходит к ней сколь угодно близко, но не касается. Причина простая: значение это произведение двоек, а произведение обращается в ноль только тогда, когда один из множителей ноль. Двойка нулём не бывает никогда. Поэтому множество значений начинается с нуля и самого нуля не содержит.', 'The axis is labelled as an asymptote. The curve comes as close to it as you like but never touches. The reason is simple: the value is a product of twos, and a product becomes zero only when one of the factors is zero. A two is never zero. So the range starts at zero and does not contain zero itself.'),
    A('work', "O'zingiz hisoblang. Egri chiziq gorizontal o'qni necha marta kesadi?", 'Посчитай сам. Сколько раз кривая пересекает горизонтальную ось?', 'Work it out yourself. How many times does the curve cross the horizontal axis?'),
  ],
  work: {
    prompt: L("Egri chiziq gorizontal o'qni necha marta kesadi?", 'Сколько раз кривая пересекает горизонтальную ось?', 'How many times does the curve cross the horizontal axis?'),
    ok: L("Bir marta ham. Ikkilar ko'paytmasi nol bo'lmaydi, shuning uchun nol faqat chegara bo'lib qoladi.", 'Ни разу. Произведение двоек нулём не становится, поэтому ноль остаётся только границей.', 'Never. A product of twos never becomes zero, so zero stays only a boundary.'),
    hint: [
      L("Egri chiziq o'qqa eng yaqin joyga qarang va tegdimi yoki yo'qmi tekshiring.", 'Посмотри, где кривая ближе всего к оси, и проверь, коснулась ли она.', 'Look where the curve is closest to the axis and check whether it touched.'),
      L("Qiymat faqat ko'paytuvchilardan biri nol bo'lganda nolga aylanadi.", 'Значение обратится в ноль, только если один из множителей ноль.', 'The value becomes zero only if one of the factors is zero.'),
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
      L("o'ngga qadam bo'ladi, ikkilantirmaydi", 'шаг вправо делит, а не удваивает', 'a step right divides instead of doubling'),
      'y = 0,5^x',
    ],
    [
      L('egri chiziq pastga ketdi', 'кривая пошла вниз', 'the curve went down'),
      L("asimptota o'sha bo'lib qoldi", 'асимптота осталась той же', 'the asymptote stayed the same'),
      '0 < a < 1',
    ],
  ],
  motion: ['flip'],
  audio: [
    A('mount', "Boshqa asos olamiz. Bir ikkidan, ya'ni nol butun besh o'ndan.", 'Возьмём другое основание. Одна вторая, то есть ноль целых пять десятых.', 'Let us take another base. One half, that is zero point five.'),
    A('flip', "Egri chiziq teskari bo'lib pastga ketdi. Sababi oddiy: o'ngga har qadam endi qiymatni ikkilantirmaydi, uni ikkiga bo'ladi. Egri chiziqning ko'rinishi o'zgarmadi, asimptota o'sha qoldi, faqat yo'nalish o'zgardi. Demak ko'rsatkichli funksiya doim o'smaydi, va yo'nalishni yozuvning ko'rinishi bilan emas, asos bilan ko'rish kerak.", 'Кривая перевернулась и пошла вниз. Причина простая: каждый шаг вправо теперь не удваивает значение, а делит его на два. Вид кривой не изменился, асимптота осталась той же, поменялось только направление. Значит показательная функция не всегда растёт, и направление надо смотреть по основанию, а не по виду записи.', 'The curve flipped and went down. The reason is simple: a step right now divides the value by two instead of doubling it. The shape of the curve did not change, the asymptote stayed the same, only the direction changed. So an exponential function does not always grow, and the direction is read from the base, not from the look of the reading.'),
    A('work', "O'zingiz hisoblang. Bir ikkidan minus birinchi darajada nechaga teng?", 'Посчитай сам. Чему равна одна вторая в минус первой степени?', 'Work it out yourself. What is one half to the minus first power?'),
  ],
  work: {
    prompt: L('Bir ikkidan minus birinchi darajada nechaga teng?', 'Чему равна одна вторая в минус первой степени?', 'What is one half to the minus first power?'),
    ok: L("Ikki. Ko'rsatkichdagi minus kasrni teskari qiladi, shuning uchun kamayuvchi egri chiziq chapda yuqori ko'tariladi.", 'Два. Минус в показателе переворачивает дробь, поэтому убывающая кривая слева поднимается высоко.', 'Two. The minus in the exponent turns the fraction over, so the decreasing curve rises high on the left.'),
    hint: [
      L("Ko'rsatkichdagi minus o'tgan darsda ko'rilgan.", 'Минус в показателе разобран в прошлом уроке.', 'The minus in the exponent was covered last lesson.'),
      L('Kasrni teskari qilib hisoblang.', 'Переверни дробь и посчитай.', 'Turn the fraction over and compute.'),
      L('Ikki.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Nega bir va minus yaramaydi', 'Почему единица и минус не годятся', 'Why one and a minus do not work'),
  tag: 'osnova-lyubaya',
  show: [
    [
      L('asos birga teng', 'основание равно единице', 'the base equals one'),
      L("to'g'ri chiziq chiqdi", 'получилась прямая', 'we got a straight line'),
      '1^x = 1',
    ],
    [
      L('asos manfiy', 'основание отрицательное', 'the base is negative'),
      L("kasr ko'rsatkichda son yo'q", 'при дробном показателе числа нет', 'with a fractional exponent there is no number'),
      'a > 0,  a ≠ 1',
    ],
  ],
  motion: ['ban'],
  audio: [
    A('mount', "Ta'rifda taqiqlangan ikki asosni tekshirish qoldi.", 'Осталось проверить два основания, которые в определении запрещены.', 'Two bases forbidden by the definition are left to check.'),
    A('ban', "Birni olamiz. Bir har qanday darajada bir bo'ladi, va egri chiziq to'g'ri chiziqqa aylanadi: na o'sish, na kamayish, na yangi qiymat. Endi minus ikkini olamiz. Bir ikkidan ko'rsatkichda kvadrati minus ikkiga teng son kerak, kvadrat esa manfiy bo'lmaydi. Shuning uchun asos musbat va birga teng bo'lmagan qilib olinadi, va bu o'tgan darsdagi o'sha talab.", 'Возьмём единицу. Единица в любой степени это единица, и кривая становится прямой: ни роста, ни убывания, ни новых значений. Теперь возьмём минус два. При показателе одна вторая нужно число, квадрат которого равен минус двум, а квадрат отрицательным не бывает. Поэтому основание берут положительным и не равным единице, и это то же требование, что в прошлом уроке.', 'Take one. One to any power is one, and the curve becomes a straight line: no growth, no decay, no new values. Now take minus two. With the exponent one half we need a number whose square is minus two, and a square is never negative. So the base is taken positive and not equal to one, the same requirement as last lesson.'),
    A('work', "O'zingiz hisoblang. Bir iks darajada nechta har xil qiymat beradi?", 'Посчитай сам. Сколько разных значений даёт единица в степени икс?', 'Work it out yourself. How many different values does one to the x give?'),
  ],
  work: {
    prompt: L('Bir iks darajada nechta har xil qiymat beradi?', 'Сколько разных значений даёт единица в степени икс?', 'How many different values does one to the x give?'),
    ok: L('Bitta. Shuning uchun bir asos qilib olinmaydi: undan yangi funksiya chiqmaydi.', 'Одно. Поэтому единицу в основание не берут: новой функции из неё не получается.', 'One. That is why one is not taken as a base: no new function comes out of it.'),
    hint: [
      L("Bir necha har xil ko'rsatkich qo'yib natijalarni solishtiring.", 'Подставь несколько разных показателей и сравни результаты.', 'Substitute several different exponents and compare the results.'),
      L("Bir birga ko'paytirilsa yana bir.", 'Единица, умноженная на единицу, снова единица.', 'One times one is one again.'),
      L('Bitta.', 'Одно.', 'One.'),
    ],
    answer: '1',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L("Ko'rsatkichli funksiya", 'Показательная функция', 'The exponential function'),
  tag: 'd-vs-e',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidadan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Asimptotali egri chiziq ekranda qoladi, va qoida yonida ochiladi. Ta'rif darslikdan so'zma-so'z olingan, undagi xossalar esa biz chizmadan olganlarning o'zi.", 'Кривая с асимптотой остаётся на экране, и правило открывается рядом. Определение взято у учебника слово в слово, а свойства в нём те же, которые мы получили с чертежа.', 'The curve with its asymptote stays on the screen, and the rule opens beside it. The definition is taken from the textbook word for word, and its properties are the ones we got from the drawing.'),
  ],
  probe: {
    question: L("Ko'rsatkichli funksiya darajali funksiyadan nimasi bilan farq qiladi?", 'Чем показательная функция отличается от степенной?', 'How does an exponential function differ from a power function?'),
    items: [
      { id: 'a', label: L("o'zgaruvchi ko'rsatkichda turadi", 'переменная стоит в показателе', 'the variable stands in the exponent'), correct: true },
      { id: 'b', label: L("o'zgaruvchi asosda turadi", 'переменная стоит в основании', 'the variable stands in the base'), hint: L("Asosda o'zgaruvchi darajali funksiyada bo'ladi. Nolni qo'ying: u yerda bir emas, nol chiqadi.", 'В основании переменная у степенной. Подставь ноль: там выйдет ноль, а не единица.', 'The variable is in the base for a power function. Substitute zero: there you get zero, not one.') },
    ],
  },
  rule: {
    lawLabel: L("Ta'rif", 'Определение', 'The definition'),
    lines: [
      L("Ko'rsatkichli funksiya bu igrek a ning iks darajasiga teng.", 'Показательная функция это игрек равен а в степени икс.', 'An exponential function is y equals a to the x.'),
      L("Aniqlanish sohasi butun o'q, qiymatlar faqat musbat: nol kirmaydi.", 'Область определения вся прямая, значения только положительные: ноль не входит.', 'The domain is the whole line, the values are positive only: zero is out.'),
      L("Asos birdan katta bo'lsa o'sish, kichik bo'lsa kamayish beradi.", 'Основание больше единицы даёт рост, меньше единицы убывание.', 'A base above one gives growth, below one gives decay.'),
    ],
    law: 'y = a^x,   a > 0,  a ≠ 1',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Minus birdagi qiymat', 'Значение при минус единице', 'The value at minus one'),
  tag: 'vsegda-rastet',
  audio: [
    A('mount', "To'rt funksiya va to'rt qiymat. Ularni birlashtiring.", 'Четыре функции и четыре значения. Соедини их.', 'Four functions and four values. Match them.'),
  ],
  match: {
    prompt: L("Funksiyani iks minus birga teng bo'lgandagi qiymati bilan birlashtiring.", 'Соедини функцию со значением при икс, равном минус единице.', 'Match each function with its value at x equal to minus one.'),
    ok: L("Manfiy ko'rsatkichda asos teskari bo'ladi. Shuning uchun o'suvchi egri chiziqlarda chapda qiymatlar birdan kichik, kamayuvchilarda esa katta.", 'При отрицательном показателе основание переворачивается. Поэтому у растущих кривых слева значения меньше единицы, а у убывающих больше.', 'With a negative exponent the base turns over. So on the left the growing curves have values below one and the decreasing ones above.'),
    left: ['y = 2^x', 'y = 4^x', 'y = 0,5^x', 'y = 0,25^x'],
    a: '1/2',
    b: '1/4',
    c: '2',
    d: '4',
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
    ok: L("To'rt xossa yopildi. To'rttasi ham chizmada ko'rinadi, yodlanmagan.", 'Четыре свойства закрыты. Все четыре видны на чертеже, а не заучены.', 'Four properties are closed. All four are visible on the drawing, not memorised.'),
    wrong: L("Chizmaga qarang: kirish gorizontal bo'yicha, chiqish vertikal bo'yicha.", 'Смотри на чертёж: вход по горизонтали, выход по вертикали.', 'Look at the drawing: the input along the horizontal, the output along the vertical.'),
    swap: L("Yozuvlar joy almashgan. Aniqlanish sohasi gorizontal bo'yicha, qiymatlar to'plami vertikal bo'yicha.", 'Записи перепутаны местами. Область определения по горизонтали, множество значений по вертикали.', 'The readings are swapped. The domain along the horizontal, the range along the vertical.'),
    rows: ['D(y)  →  (−∞; +∞)', 'E(y)  →  (0; +∞)', 'Oy  →  (0; 1)', 'Ox  →  ∅'],
    chips: ['(−∞; +∞)', '(0; +∞)', '(0; 1)', '∅'],
  },
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO INSTRUMENT'),
  title: L('Chizmasiz solishtiring', 'Сравни без чертежа', 'Compare without a drawing'),
  tag: 'bumaga',
  audio: [
    A('mount', "Bu ekranda chizma yo'q. Imtihonda ham bo'lmaydi.", 'На этом экране чертежа нет. На экзамене его тоже не будет.', 'There is no drawing on this screen. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
  task: {
    ok: L("Ikkinchisi. Asos birdan kichik, shuning uchun katta ko'rsatkich kichik qiymat beradi.", 'Вторая. Основание меньше единицы, поэтому больший показатель даёт меньшее значение.', 'The second. The base is less than one, so a bigger exponent gives a smaller value.'),
    hint: [
      L('Asosga qarang: u birdan kichik.', 'Посмотри на основание: оно меньше единицы.', 'Look at the base: it is less than one.'),
      L('Bunday asosda egri chiziq kamayadi.', 'При таком основании кривая убывает.', 'With such a base the curve decreases.'),
      L('Ikkinchisi.', 'Вторая.', 'The second.'),
    ],
    prompt: '1)  0,3^{2,1}     2)  0,3^{1,3}',
    answer: '2',
  },
  order: {
    prompt: L("O'sish tartibida joylashtiring.", 'Расставь по возрастанию.', 'Arrange in increasing order.'),
    title: L('Qaysi yozuv kichikroq?', 'Какая запись меньше?', 'Which reading is smaller?'),
    ok: L("Asos birdan kichik, shuning uchun ko'rsatkichlar tartibi va qiymatlar tartibi qarama-qarshi.", 'Основание меньше единицы, поэтому порядок показателей и порядок значений противоположны.', 'The base is less than one, so the order of the exponents and the order of the values are opposite.'),
    bad: L("Har yozuvni songa o'tkazing, keyin solishtiring.", 'Переведи каждую запись в число, потом сравнивай.', 'Turn each reading into a number, then compare.'),
    items: ['0,5²', '0,5¹', '0,5⁰', '0,5^{−1}'],
    answer: '0,5²  0,5¹  0,5⁰  0,5^{−1}',
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
    A('mount', "Masala. Ko'rsatkichli funksiyaning qiymatlar to'plamini topish.", 'Задача. Найти множество значений показательной функции.', 'A task. Find the range of an exponential function.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L('Bu qator shartni shunchaki qaytadan yozadi.', 'Эта строка просто переписывает условие.', 'This line just rewrites the task.'),
    r2: L("Bu to'g'ri: kirish har qanday bo'lishi mumkin.", 'Это верно: вход берут любой.', 'This is right: any input is allowed.'),
    r4: L("Bu oldingi qatorning to'g'ri natijasi.", 'Это верное следствие предыдущей строки.', 'This is a correct consequence of the previous line.'),
  },
  proof: L("Bu yerda nol qiymatlarga kiritilgan, egri chiziq esa o'qqa yetmaydi.", 'Здесь ноль включили в значения, а кривая до оси не доходит.', 'Here zero was included in the values, and the curve does not reach the axis.'),
  entry: {
    prompt: L('Javobga qaysi son ortiqcha tushdi?', 'Какое число попало в ответ лишним?', 'Which number got into the answer as an extra?'),
    ok: L("Nol. U chegara bo'lib qoladi, qiymat bo'lmaydi.", 'Ноль. Он остаётся границей, а значением не становится.', 'Zero. It stays a boundary and never becomes a value.'),
    hint: [
      L('Asimptotaga qarang.', 'Посмотри на асимптоту.', 'Look at the asymptote.'),
      L("Egri chiziq o'qqa yaqinlashadi, lekin tegmaydi.", 'Кривая подходит к оси, но не касается.', 'The curve comes close to the axis but does not touch.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
  row: {
    r1: 'y = 2^x',
    r2: 'x ∈ (−∞; +∞)',
    r3: 'y ≥ 0',
    r4: 'E(y) = [0; +∞)',
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
    A('work', "Avval asosni yozing, keyin hamma o'suvchi funksiyani belgilaysiz.", 'Сначала запиши основание, потом отметишь все возрастающие функции.', 'First type the base, then you will mark every growing function.'),
  ],
  multi: {
    prompt: L("Butun o'qda o'suvchi hamma funksiyani belgilang.", 'Отметь все функции, которые возрастают на всей прямой.', 'Mark every function that grows on the whole line.'),
    title: L("Qaysi funksiyalar butun o'qda o'sadi?", 'Какие функции возрастают на всей прямой?', 'Which functions grow on the whole line?'),
    ok: L("To'rttadan ikkitasi. Asosi birdan katta bo'lgani o'sadi.", 'Две из четырёх. Возрастает та, у которой основание больше единицы.', 'Two out of four. The one with a base greater than one grows.'),
    items: [
      { id: 'c', label: 'y = 0,5^x', hint: L('Asos birdan kichik, egri chiziq pastga ketadi.', 'Основание меньше единицы, кривая идёт вниз.', 'The base is less than one, the curve goes down.') },
      { id: 'd', label: 'y = (1/3)^x', hint: L('Bir uchdan birdan kichik, demak funksiya kamayadi.', 'Одна третья меньше единицы, значит функция убывает.', 'One third is less than one, so the function decreases.') },
      { id: 'a', label: 'y = 2^x', ok: true },
      { id: 'b', label: 'y = 1,5^x', ok: true },
    ],
  },
  entry: {
    prompt: L("Egri chiziq abssissasi bir, ordinatasi uch bo'lgan nuqtadan o'tadi. Uning asosi qanday?", 'Кривая проходит через точку с абсциссой один и ординатой три. Какое у неё основание?', 'The curve passes through the point with abscissa one and ordinate three. What is its base?'),
    ok: L("Uch. Iks birga teng bo'lganda qiymat asosning o'ziga teng.", 'Три. При икс, равном единице, значение равно самому основанию.', 'Three. At x equal to one the value equals the base itself.'),
    hint: [
      L("Ko'rsatkichga birni qo'ying.", 'Подставь единицу в показатель.', 'Substitute one into the exponent.'),
      L("Asos birinchi darajada bu uning o'zi.", 'Основание в первой степени это оно само.', 'A base to the first power is the base itself.'),
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
  tag: 'vsegda-rastet',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Ko'rsatkichli funksiyada o'zgaruvchi qayerda turadi?", 'Где стоит переменная у показательной функции?', 'Where does the variable stand in an exponential function?'),
      done: 'y = a^x',
      items: [
        { id: 'a', label: L("ko'rsatkichda", 'в показателе', 'in the exponent'), correct: true },
        { id: 'b', label: L('asosda', 'в основании', 'in the base'), hint: L("Asosda o'zgaruvchi darajali funksiyada bo'ladi.", 'В основании переменная у степенной функции.', 'The variable is in the base for a power function.') },
        { id: 'c', label: L('ikkalasida ham', 'и там и там', 'in both'), hint: L("Unda bu uchinchi funksiya bo'lardi, ko'rsatkichli emas.", 'Тогда это была бы третья функция, а не показательная.', 'Then it would be a third function, not an exponential one.') },
        { id: 'd', label: L('hech qayerda', 'нигде', 'nowhere'), hint: L("O'zgaruvchisiz bu shunchaki son, funksiya emas.", 'Без переменной это просто число, а не функция.', 'Without a variable it is just a number, not a function.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Ko'rsatkichli funksiyaning qiymatlar to'plami qanday?", 'Какое множество значений у показательной функции?', 'What is the range of an exponential function?'),
      done: 'E(y) = (0; +∞)',
      items: [
        { id: 'a', label: L('musbat sonlar', 'положительные числа', 'the positive numbers'), correct: true },
        { id: 'b', label: L('hamma son', 'все числа', 'all numbers'), hint: L("Egri chiziq manfiy qiymat bermaydi: u butunlay o'qdan yuqorida.", 'Отрицательное значение кривая не даёт: она вся выше оси.', 'The curve gives no negative value: it lies entirely above the axis.') },
        { id: 'c', label: L('noldan birgacha', 'от нуля до единицы', 'from zero to one'), hint: L("O'ngda egri chiziq birdan yuqoriga cheksiz ketadi.", 'Справа кривая уходит выше единицы без предела.', 'On the right the curve goes above one without limit.') },
        { id: 'd', label: L('butun sonlar', 'целые числа', 'the whole numbers'), hint: L("Butun sonlar orasidan ham egri chiziq o'tadi, u yerda qiymatlar qancha bo'lsa ham bor.", 'Между целыми кривая тоже проходит, значений там сколько угодно.', 'The curve passes between the whole numbers too, with any number of values there.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Qaysi asosda funksiya kamayadi?', 'При каком основании функция убывает?', 'With which base does the function decrease?'),
      done: '0 < a < 1',
      items: [
        { id: 'a', label: L('birdan kichik', 'меньше единицы', 'less than one'), correct: true, ok: L("Ha. O'ngga qadam qiymatni bo'ladi, ko'paytirmaydi.", 'Да. Шаг вправо делит значение, а не умножает.', 'Yes. A step right divides the value instead of multiplying it.') },
        { id: 'b', label: L('birdan katta', 'больше единицы', 'greater than one'), hint: L("Bunday asosda o'ngga qadam ko'paytiradi, va egri chiziq o'sadi.", 'При таком основании шаг вправо умножает, и кривая растёт.', 'With such a base a step right multiplies, and the curve grows.') },
        { id: 'c', label: L('har qanday', 'любом', 'any'), hint: L('Ekrandagi ikki egri chiziq har xil tomonga ketdi, demak asos hal qiladi.', 'Две кривые на экране шли в разные стороны, значит основание решает.', 'The two curves on the screen went opposite ways, so the base decides.') },
        { id: 'd', label: L('manfiy', 'отрицательном', 'negative'), hint: L("Manfiy asos ko'rsatkichli funksiyada umuman olinmaydi.", 'Отрицательное основание в показательной функции не берут вовсе.', 'A negative base is not taken in an exponential function at all.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("Har qanday ko'rsatkichli egri chiziq qaysi nuqtadan o'tadi?", 'Через какую точку проходит любая показательная кривая?', 'Which point does every exponential curve pass through?'),
      done: '(0; 1)',
      items: [
        { id: 'a', label: L('abssissasi nol, ordinatasi bir', 'абсцисса ноль, ордината один', 'abscissa zero, ordinate one'), correct: true },
        { id: 'b', label: L('koordinatalar boshi', 'начало координат', 'the origin'), hint: L('Koordinatalar boshida ordinata nol, egri chiziq esa nol bermaydi.', 'В начале координат ордината ноль, а кривая нуля не даёт.', 'At the origin the ordinate is zero, and the curve never gives zero.') },
        { id: 'c', label: L('abssissasi bir, ordinatasi nol', 'абсцисса один, ордината ноль', 'abscissa one, ordinate zero'), hint: L("Iks birga teng bo'lganda qiymat asosga teng, nolga emas.", 'При икс, равном единице, значение равно основанию, а не нулю.', 'At x equal to one the value equals the base, not zero.') },
        { id: 'd', label: L('birorta umumiy nuqtadan ham', 'ни через какую общую', 'through no common point'), hint: L("Nol ko'rsatkich har qanday asosda bir beradi, demak nuqta umumiy.", 'Нулевой показатель даёт единицу при любом основании, значит точка общая.', 'The zero exponent gives one for any base, so the point is common.') },
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
    A('next', "Egri chiziq o'qqa qanchalik yaqin kelsa ham tegmaydi. Nol qiymatlarning chegarasi bo'lib qoladi, qiymat bo'lmaydi.", 'Кривая подходит к оси сколь угодно близко и не касается её. Ноль остаётся границей значений, а значением не становится.', 'The curve comes as close to the axis as you like and never touches it. Zero stays the boundary of the values and never becomes one.'),
  ],
  can: [
    L("Ko'rsatkichli funksiyani darajalidan qiymat qo'yib ajrataman", 'Отличаю показательную функцию от степенной подстановкой', 'I tell an exponential function from a power one by substitution'),
    L("Aniqlanish sohasini va qiymatlar to'plamini bilaman", 'Знаю область определения и множество значений', 'I know the domain and the range'),
    L("Yo'nalishni asos bo'yicha o'qiyman", 'Направление читаю по основанию', 'I read the direction from the base'),
    L('Nol nega qiymatlarga kirmasligini bilaman', 'Знаю, почему ноль в значения не входит', 'I know why zero is not in the range'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L("Bitta joy takrorlashni talab qiladi: qiymatlar to'plami.", 'Одно место требует повтора: множество значений.', 'One place needs review: the range.'),
    back: L('Qoidaga va 5-ekranga qayting.', 'Вернись к правилу и к экрану 5.', 'Go back to the rule and to screen 5.'),
  },
  bridge: L("Keyin egri chiziqni gorizontal uchratadi, va ko'rsatkichli tenglama chiqadi.", 'Дальше кривую встретит горизонталь, и получится показательное уравнение.', 'Next a horizontal will meet the curve, and an exponential equation appears.'),
  lifehack: L("Egri chiziq qayoqqa ketishini esdan chiqardingizmi, nol va birni qo'ying. Yo'nalishni ko'rish uchun ikki nuqta yetadi.", 'Забыл, куда идёт кривая, подставь ноль и единицу. Двух точек хватает, чтобы увидеть направление.', 'Forgot which way the curve goes, substitute zero and one. Two points are enough to see the direction.'),
  sheetTitle: L("Ko'rsatkichli funksiya · shpargalka", 'Показательная функция · шпаргалка', 'The exponential function · cheat sheet'),
  sheetSrc: L('10-sinf · 27-dars', '10 класс · урок 27', 'Grade 10 · lesson 27'),
  hook: {
    a: '2^x = 0',
    b: '2^x > 0',
  },
  proved: '2^x > 0',
  law: 'y = a^x,   a > 0,  a ≠ 1',
  sheet: [
    'D(y) = (−∞; +∞)',
    'E(y) = (0; +∞)',
    '(0; 1)',
    'a > 1   →   ↑',
    '0 < a < 1   →   ↓',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

// Число из контента: минус там типографский, `parseFloat` его не понимает.
const num = (s) => parseFloat(String(s).replace(/−/g, '-').replace(',', '.'))

// ОКНО ЧЕРТЕЖА ОДНО НА ВЕСЬ УРОК.
//
// Кривая нормирована по `ymax`, и если на одном экране взять четыре, а на
// другом девять, то одна и та же точка окажется в разных местах: ученик
// решит, что это другая функция. Поэтому окно задаётся здесь один раз, и
// экраны его не переопределяют. Четыре, а не девять: при девяти единица
// оказывается в десяти пикселях от оси, и подпись точки `(0; 1)` налезает
// на подпись деления (поймано на стенде 2026-08-14).
const WIN = { xmin: -2, xmax: 2, ymax: 4, tx: [-2, -1, 1, 2], ty: [1, 2, 4] }

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const FN_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const FN_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

// «D(y)  →  R» даёт подпись строки и верный чип. Значения живут в контенте,
// а не в двух местах: иначе они разойдутся на первой же правке.
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
        // Кривая на хуке ЕСТЬ, а ответа на ней НЕТ: слева она идёт в одном
        // пикселе от оси, и на глаз коснулась она или нет -- не различить.
        // Асимптоту подписывает только экран 5.
        fig={() => <Scene fig={<Plane step={1} curve="exp" show="none" {...WIN} />} max={172} h={172} />}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.1}>
        <Col>
          <Scene fig={<Plane step={1} curve="exp" show="none" {...WIN} />} max={300} />
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
      /* Точка идёт по кривой и роняет ОБА следа сразу: вход и выход видны
         одновременно, и `D` с `E` не путаются местами. */
      <Scene
        fig={<Plane step={phase} curve="exp" show="point" mark={[0, 1]} {...WIN} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="exp" show="dom" {...WIN} />} max={300} />
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
      /* Разграничение: в нуле степенная даёт ноль, показательная единицу.
         Метка `(0; 1)` стоит на кривой, и расхождение видно числом. */
      <Scene
        fig={<Plane step={phase} curve="exp" show="point" mark={[0, 1]} {...WIN} />}
        note={<NoteList items={S4.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="exp" show="none" mark={[0, 1]} {...WIN} />} max={300} />
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
      /* СВИДЕТЕЛЬ УРОКА. Полоса значений вырастает от оси вверх, а сама ось
         подписана пунктиром: кривая к ней подходит и не касается. */
      <Scene
        fig={<Plane step={phase + 1} curve="exp" show="rng" {...WIN} />}
        note={<NoteList items={S5.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={2} curve="exp" show="rng" {...WIN} />} max={300} />
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
         же, направление противоположное. */
      <Scene
        fig={<Plane step={phase} curve="expdown" show="point" mark={[0, 1]} {...WIN} />}
        note={<NoteList items={S6.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="expdown" show="none" mark={[0, 1]} {...WIN} />} max={300} />
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
      /* Основание равно единице: кривая становится ПРЯМОЙ. Это `line` в
         каркасе фигур, и она проходит через ту же точку. */
      <Scene
        fig={<Plane step={phase} curve="one" show="none" mark={[0, 1]} {...WIN} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="one" show="none" mark={[0, 1]} {...WIN} />} max={300} />
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
        // Полоса значений появляется в момент ответа: правило открывается
        // рядом с тем, что его породило.
        fig={(solved) => (
          <Scene
            fig={<Plane step={solved ? 2 : 1} curve="exp" show={solved ? 'rng' : 'none'} mark={[0, 1]} {...WIN} />}
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
        // Чертёж ВСПОМОГАТЕЛЬНЫЙ: работа в таблице. На телефоне полный
        // размер выводил экран за бюджет на 26 px.
        figH={168}
        rows={PROP_ROWS}
        chips={PROP_CHIPS}
        okText={S10.table.ok}
        wrongText={S10.table.wrong}
        fig={<Plane step={2} curve="exp" show="rng" mark={[0, 1]} {...WIN} />}
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
          {/* Точка `(1; 3)` дана, основание нет: обратная задача. Правый край
              окна свой: при основании три и `x = 2` значение девять, а окно
              держит четыре -- кривая ушла бы за верх кадра. */}
          <Scene fig={<Plane step={1} curve="expthree" show="none" mark={[1, 3]} {...WIN} xmax={1.2} />} max={300} />
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
        // Кривая меняется по кругу вопросов: растущая, убывающая, растущая.
        fig={(round) => (
          <Scene
            fig={<Plane step={1} curve={round === 2 ? 'expdown' : 'exp'} show="none" mark={[0, 1]} {...WIN} />}
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
