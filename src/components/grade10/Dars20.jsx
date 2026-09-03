// ============================================================================
// 10-sinf, Dars 20. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS20_KONTENT.md
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
const LESSON_NO = 20
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Logarifmik tenglamalar`,
  `Урок ${LESSON_NO}. Логарифм. уравнения`,
  `Lesson ${LESSON_NO}. Logarithmic equations`,
)

const BLOCK = { label: 'B5', from: 15, to: 27, current: 20 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('TENGLAMA', 'УРАВНЕНИЕ', 'THE EQUATION'),
  title: L('Haqiqatda nechta ildiz', 'Сколько корней на самом деле', 'How many roots there really are'),
  audio: [
    A('mount', "Ikki logarifmli tenglama. Yechim ikki son beradi, to'rt va minus ikki.", 'Уравнение с двумя логарифмами. Решение даёт два числа, четыре и минус два.', 'An equation with two logarithms. Solving it gives two numbers, four and minus two.'),
    A('r1', "Birinchi yozuv ikkala son ham ildiz deydi, chunki ikkalasi ham to'g'ri almashtirishlar bilan olingan.", 'Первая запись говорит, что оба числа корни, ведь оба получены верными преобразованиями.', 'The first reading says both numbers are roots, since both came from correct steps.'),
    A('r2', 'Ikkinchisi ildiz faqat bitta, ikkinchi son esa javobga yaramaydi deydi.', 'Вторая говорит, что корень только один, а второе число в ответ не годится.', 'The second says there is only one root, and the second number does not belong in the answer.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi polosa o'tkazamiz va bu sonlar qayerga tushishini ko'ramiz.", 'Твой ответ записан. Сейчас проведём полосу и посмотрим, куда падают эти числа.', 'Your answer is saved. Now we will draw the band and see where these numbers land.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L('ikkala son ham yaraydi', 'оба числа подходят', 'both numbers fit'),
      value: '4;  −2',
    },
    b: {
      name: L('faqat bittasi yaraydi', 'подходит только одно', 'only one of them fits'),
      value: '4',
    },
  },
  expr: 'log₂ x + log₂ (x − 2) = 3',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Tenglamadan oldin uch savol', 'Три вопроса перед уравнением', 'Three questions before the equation'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Bir asosli logarifmlar yig'indisi nechaga teng?", 'Чему равна сумма логарифмов с одним основанием?', 'What does a sum of logarithms with the same base equal?'),
      done: 'logₐ b + logₐ c = logₐ (b·c)',
      items: [
        { id: 'a', label: L("ko'paytmaning logarifmiga", 'логарифму произведения', 'the logarithm of the product'), correct: true },
        { id: 'b', label: L("yig'indining logarifmiga", 'логарифму суммы', 'the logarithm of the sum'), hint: L("Yig'indining logarifmi umuman ochilmaydi, bu logarifm haqidagi darsda tekshirilgan.", 'Логарифм суммы не раскрывается вовсе, это проверено на уроке про логарифм.', 'The logarithm of a sum does not open at all, that was checked in the lesson on logarithms.') },
        { id: 'c', label: L("logarifmlar ko'paytmasiga", 'произведению логарифмов', 'the product of the logarithms'), hint: L("To'rt va sakkizda tekshiring: besh o'rniga olti chiqadi.", 'Проверь на четырёх и восьми: выйдет шесть вместо пяти.', 'Check on four and eight: you get six instead of five.') },
        { id: 'd', label: L('bularning hech biriga', 'ничему из этого', 'none of these'), hint: L('Qoida bor, va u daraja xossasidan chiqariladi.', 'Правило есть, и оно выводится из свойства степени.', 'The rule exists and comes from a property of powers.') },
      ],
    },
    {
      id: 'q2',
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
    {
      id: 'q3',
      ask: true,
      prompt: L("Sakkizning ikki asosga ko'ra logarifmi nechaga teng?", 'Чему равен логарифм восьми по основанию два?', 'What is the logarithm of eight to base two?'),
      done: 'log₂ 8 = 3',
      items: [
        { id: 'a', label: L('uch', 'три', 'three'), correct: true },
        { id: 'b', label: L("to'rt", 'четыре', 'four'), hint: L("To'rt bo'lish bilan chiqardi, logarifm esa ko'rsatkich.", 'Четыре вышло бы делением, а логарифм это показатель.', 'Four would come from dividing, and a logarithm is an exponent.') },
        { id: 'c', label: L('sakkiz', 'восемь', 'eight'), hint: L("Sakkiz belgi ostida turadi, savol esa ko'rsatkich haqida.", 'Восемь стоит под знаком, а спросили про показатель.', 'Eight stands under the sign, and the question was about the exponent.') },
        { id: 'd', label: L('bir uchdan', 'одна треть', 'one third'), hint: L("Bir uchdan asos va son teskari tartibda bo'lganda chiqadi.", 'Одна треть выходит при обратном порядке основания и числа.', 'One third comes when the base and the number are in the other order.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Polosa yechimdan oldin chiziladi', 'Полоса чертится до решения', 'The band is drawn before solving'),
  tag: 'odz-logarifma',
  show: [
    [
      L("birinchi logarifm iks noldan katta bo'lishini talab qiladi", 'первый логарифм требует икс больше нуля', 'the first logarithm needs x greater than zero'),
      L("ikkinchisi iks ikkidan katta bo'lishini talab qiladi", 'второй требует икс больше двух', 'the second needs x greater than two'),
      'x > 0,   x − 2 > 0',
    ],
    [
      L("ikkalasi ham to'g'ri bo'lgan joy bo'yalgan", 'закрашено там, где верно и то и другое', 'the shading is where both hold'),
      L("polosa ikkidan o'ngda boshlanadi", 'полоса начинается справа от двойки', 'the band starts to the right of two'),
      'x > 2',
    ],
  ],
  motion: ['band'],
  audio: [
    A('mount', "Tenglama tagida polosa paydo bo'ldi. U qaysi iksda ikkala yozuv umuman ma'noga ega ekanini ko'rsatadi.", 'Под уравнением появилась полоса. Она показывает, при каких икс обе записи вообще имеют смысл.', 'A band appeared under the equation. It shows for which x both readings make sense at all.'),
    A('band', "Birinchi logarifm ostida iks turadi, demak iks noldan katta. Ikkinchisida iks minus ikki, demak iks ikkidan katta. Ikkala shart bir vaqtda bajarilishi kerak, shuning uchun faqat ikkidan o'ngdagi bo'yaladi. Ikkining o'zi ochiq qoldirilgan: unda ikkinchi logarifm nolning logarifmiga aylanadi, bunday son esa yo'q. Polosa birinchi almashtirishdan oldin chizilgan, va bu muhim: keyin kech bo'ladi.", 'Под первым логарифмом стоит икс, значит икс больше нуля. Под вторым икс минус два, значит икс больше двух. Оба условия должны выполняться сразу, поэтому закрашивается только то, что правее двойки. Сама двойка выколота: при ней второй логарифм превращается в логарифм нуля, а такого числа нет. Полоса начерчена до первого преобразования, и это важно: потом будет поздно.', 'Under the first logarithm stands x, so x is greater than zero. Under the second stands x minus two, so x is greater than two. Both conditions must hold at once, so only what is to the right of two gets shaded. Two itself is punched out: there the second logarithm becomes the logarithm of zero, and no such number exists. The band was drawn before the first step, and that matters: afterwards it is too late.'),
    A('work', "O'zingiz hisoblang. Bo'yalgan polosa qaysi sondan boshlanadi?", 'Посчитай сам. С какого числа начинается закрашенная полоса?', 'Work it out yourself. From which number does the shaded band start?'),
  ],
  work: {
    prompt: L('Polosa qaysi sondan boshlanadi?', 'С какого числа начинается полоса?', 'From which number does the band start?'),
    ok: L('Ikkidan. Iks ikkidan katta sharti iks noldan katta shartidan qattiqroq, shuning uchun u yutadi.', 'С двойки. Условие икс больше двух строже, чем икс больше нуля, поэтому побеждает оно.', 'From two. The condition x greater than two is stricter than x greater than zero, so it wins.'),
    hint: [
      L('Har logarifm uchun shartni alohida yozing.', 'Выпиши условие для каждого логарифма отдельно.', 'Write the condition for each logarithm separately.'),
      L("Ikkala shart bir vaqtda bajarilishi kerak, demak qattiqrog'i olinadi.", 'Оба условия должны выполняться сразу, значит берут более строгое.', 'Both must hold at once, so the stricter one is taken.'),
      L('Ikki.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'order',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Har tenglama polosani toraytirmaydi', 'Не всякое уравнение сужает полосу', 'Not every equation narrows the band'),
  tag: 'odz-logarifma',
  show: [
    [
      L('sodda tenglamada bitta shart', 'у простого уравнения одно условие', 'a simple equation has one condition'),
      L('polosa noldan boshlanadi', 'полоса начинается от нуля', 'the band starts from zero'),
      'log₂ x = 3   →   x > 0',
    ],
    [
      L("yig'indida shartlar ikkita", 'у суммы условий два', 'a sum has two conditions'),
      L('va polosa qisqaradi', 'и полоса становится короче', 'and the band gets shorter'),
      'log₂ x + log₂ (x − 2) = 3   →   x > 2',
    ],
  ],
  motion: ['two'],
  audio: [
    A('mount', 'Ikki tenglamani solishtiramiz. Birinchisida bitta logarifm, ikkinchisida ikkita.', 'Сравним два уравнения. В первом один логарифм, во втором два.', 'Let us compare two equations. The first has one logarithm, the second two.'),
    A('two', "Birinchi tenglamada belgi ostida oddiy iks turadi, demak shart bitta va polosa darrov noldan boshlanadi. Ikkinchisida ikkinchi belgi ostida iks minus ikki turadi, va bu ikkinchi shartni qo'shadi. Polosa o'ngga suriladi va qisqaradi. Logarifm qancha ko'p bo'lsa, polosa shuncha qisqa, va har birini tekshirish kerak.", 'У первого уравнения под знаком стоит просто икс, значит условие одно и полоса начинается сразу от нуля. У второго под вторым знаком стоит икс минус два, и это добавляет второе условие. Полоса сдвигается вправо и становится короче. Чем больше логарифмов, тем короче полоса, и проверять надо каждый.', 'In the first equation plain x stands under the sign, so there is one condition and the band starts right at zero. In the second, x minus two stands under the second sign, and that adds a second condition. The band shifts right and gets shorter. The more logarithms, the shorter the band, and each one must be checked.'),
    A('work', 'Polosa qanday tartibda chizilsa, qadamlarni shunday joylashtiring.', 'Расставь шаги, в каком порядке чертят полосу.', 'Put the steps in the order the band is drawn.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L('har biri uchun shart', 'условие для каждого', 'a condition for each'),
    s2: L("qattiqrog'ini olish", 'взять более строгое', 'take the stricter one'),
    s3: L("polosani bo'yash", 'закрасить полосу', 'shade the band'),
    s4: L('keyin yechish', 'потом решать', 'then solve'),
    ok: L('Polosa birinchi chiziladi. Yechimdan boshlansa, ildizlarni tekshiradigan narsa qolmaydi.', 'Полоса чертится первой. Если начать с решения, проверять корни будет нечем.', 'The band is drawn first. Starting with the solution leaves nothing to check the roots against.'),
    bad: L('Avval shartlar, keyin polosa, va faqat keyin yechim.', 'Сначала условия, потом полоса, и только потом решение.', 'First the conditions, then the band, and only then the solution.'),
    mark: 'x > 2',
  },
}

const S5 = {
  role: 'explain3',
  answer: 'order',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Logarifm belgilari olinadi', 'Знаки логарифма снимаются', 'The logarithm signs come off'),
  tag: 'postoronniy-koren',
  show: [
    [
      L("yig'indi bitta logarifmga yig'iladi", 'сумма сворачивается в один логарифм', 'the sum folds into one logarithm'),
      L("o'ngdagi uch ham logarifm", 'справа тройка это тоже логарифм', 'the three on the right is a logarithm too'),
      'log₂ (x·(x − 2)) = 3',
    ],
    [
      L('asoslar bir xil, belgilar olinadi', 'основания одинаковы, знаки снимаются', 'the bases match, the signs come off'),
      L('oddiy tenglama qoladi', 'остаётся обычное уравнение', 'an ordinary equation is left'),
      'x·(x − 2) = 8',
    ],
  ],
  motion: ['drop'],
  audio: [
    A('mount', "Chap qismni yig'amiz. Logarifmlar yig'indisi ko'paytmaning logarifmi.", 'Свернём левую часть. Сумма логарифмов это логарифм произведения.', 'Let us fold the left side. A sum of logarithms is the logarithm of the product.'),
    A('drop', "Chapda bitta logarifm chiqdi. O'ngda uch, va uni ham o'sha asosga ko'ra sakkizning logarifmi qilib yozish mumkin. Endi chapda ham o'ngda ham asosi bir xil logarifm turadi, logarifmik funksiya esa monoton, demak bitta qiymatga bitta argument mos keladi. Shuning uchun belgilar olinadi va oddiy tenglama qoladi. Lekin ularni faqat polosa ichida olish mumkin: undan tashqarida logarifmlar umuman yo'q.", 'Слева получился один логарифм. Справа тройка, и её тоже можно записать логарифмом восьми по тому же основанию. Теперь слева и справа стоит логарифм с одинаковым основанием, а логарифмическая функция монотонна, значит одному значению отвечает один аргумент. Поэтому знаки снимаются и остаётся обычное уравнение. Но снимать их можно только внутри полосы: за её пределами логарифмов просто нет.', 'On the left one logarithm came out. On the right is three, and it can be written as the logarithm of eight to the same base. Now a logarithm with the same base stands on both sides, and the logarithmic function is monotone, so one value matches one argument. That is why the signs come off and an ordinary equation is left. But they may come off only inside the band: outside it there are no logarithms at all.'),
    A('work', 'Belgilar qanday olinsa, qadamlarni shunday joylashtiring.', 'Расставь шаги, как снимаются знаки.', 'Put the steps in the order the signs come off.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L("yig'indini yig'ish", 'свернуть сумму', 'fold the sum'),
    s2: L("o'ngda ham logarifm", 'справа тоже логарифм', 'a logarithm on the right too'),
    s3: L('belgilarni olish', 'снять знаки', 'take the signs off'),
    s4: L('oddiyni yechish', 'решить обычное', 'solve the ordinary one'),
    ok: L("Belgilar olinadi, chunki asoslar bir xil bo'ldi, funksiya esa monoton.", 'Знаки снимаются, потому что основания совпали, а функция монотонна.', 'The signs come off because the bases matched and the function is monotone.'),
    bad: L("Avval yig'ish, keyin o'ng qismni keltirish, keyin belgilarni olish.", 'Сначала свернуть, потом привести правую часть, потом снять знаки.', 'First fold, then bring the right side, then take the signs off.'),
    mark: 'x² − 2x − 8 = 0',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Almashtirish kvadratga keltiradi', 'Замена сводит к квадратному', 'A substitution reduces it to a quadratic'),
  tag: 'net-resheniy',
  show: [
    [
      L('tenglamada logarifm va uning kvadrati', 'в уравнении логарифм и его квадрат', 'the equation has a logarithm and its square'),
      L('logarifmni harf bilan belgilaymiz', 'обозначим логарифм буквой', 'let us name the logarithm by a letter'),
      'log₂² x − 3 log₂ x + 2 = 0',
    ],
    [
      L('kvadrat tenglama chiqdi', 'получилось квадратное уравнение', 'a quadratic equation came out'),
      L('ikkala qiymat ham yaraydi', 'оба значения годятся', 'both values fit'),
      't² − 3t + 2 = 0',
    ],
  ],
  motion: ['sub'],
  audio: [
    A('mount', 'Boshqa tenglama. Unda logarifm birinchi darajada ham, kvadratda ham turadi.', 'Другое уравнение. В нём логарифм стоит и в первой степени, и в квадрате.', 'Another equation. In it the logarithm stands both in the first power and squared.'),
    A('sub', "Iksning logarifmini te harfi bilan belgilaymiz. Oddiy kvadrat tenglama chiqdi, uning ildizlari bir va ikki. Bu yerda ko'rsatkichli tenglamadan muhim farq bor: u yerda almashtirish qiymati daraja edi va musbat bo'lishi shart edi, logarifm esa har qanday qiymatni oladi. Shuning uchun ikkala ildiz ham yaraydi, va har biri o'zgaruvchiga alohida qaytadi.", 'Обозначим логарифм икс буквой тэ. Получилось обычное квадратное уравнение, его корни один и два. Здесь важное отличие от показательного уравнения: там значение замены было степенью и обязано было быть положительным, а логарифм принимает любые значения. Поэтому оба корня годятся, и каждый возвращается к переменной отдельно.', 'Let us call the logarithm of x by the letter t. An ordinary quadratic came out, its roots are one and two. Here is an important difference from the exponential equation: there the substituted value was a power and had to be positive, while a logarithm takes any value. So both roots fit, and each returns to the variable separately.'),
    A('work', "O'zingiz hisoblang. Almashtirishning nechta ildizi yaraydi?", 'Посчитай сам. Сколько корней замены годится?', 'Work it out yourself. How many roots of the substitution fit?'),
  ],
  work: {
    prompt: L('Almashtirishning nechta ildizi yaraydi?', 'Сколько корней замены годится?', 'How many roots of the substitution fit?'),
    ok: L("Ikkita. Logarifm har qanday qiymatni oladi, shuning uchun tashlaydigan narsa yo'q, ko'rsatkichli tenglamadan farqli.", 'Два. Логарифм принимает любые значения, поэтому отбрасывать нечего, в отличие от показательного уравнения.', 'Two. A logarithm takes any value, so there is nothing to drop, unlike in an exponential equation.'),
    hint: [
      L('Logarifmda taqiqlangan qiymatlar bormi, tekshiring.', 'Проверь, есть ли у логарифма запретные значения.', 'Check whether a logarithm has forbidden values.'),
      L("Logarifmik funksiyaning qiymatlar to'plami hamma son.", 'Множество значений логарифмической функции это все числа.', 'The range of a logarithmic function is all numbers.'),
      L('Ikkita.', 'Два.', 'Two.'),
    ],
    answer: '2',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Ildiz polosaga tushadi', 'Корень падает на полосу', 'The root lands on the band'),
  tag: 'postoronniy-koren',
  show: [
    [
      L('kvadrat ikki son berdi', 'квадратное дало два числа', 'the quadratic gave two numbers'),
      L("to'rt va minus ikki", 'четыре и минус два', 'four and minus two'),
      'x² − 2x − 8 = 0   →   4;  −2',
    ],
    [
      L("to'rt bo'yalganga tushdi", 'четвёрка попала в закрашенное', 'four landed in the shading'),
      L("minus ikki tashqarida qoldi va so'ndi", 'минус два остался снаружи и погас', 'minus two stayed outside and faded'),
      'x = 4',
    ],
  ],
  motion: ['fall'],
  audio: [
    A('mount', "Dars boshidagi tenglamaga qaytamiz. Kvadrat ikki son berdi, to'rt va minus ikki.", 'Вернёмся к уравнению с начала урока. Квадратное дало два числа, четыре и минус два.', 'Back to the equation from the start of the lesson. The quadratic gave two numbers, four and minus two.'),
    A('fall', "Ikkala sonni polosaga tushiramiz. To'rt bo'yalganga tushadi, demak bu ildiz. Minus ikki chapda uzoqda, polosadan tashqarida tushadi va so'nadi. E'tibor bering: u kvadrat tenglamaning yechimi bo'lishdan to'xtamadi. U dastlabki tenglamaning yechimi hech qachon bo'lmagan, chunki unda logarifm umuman yo'q. Polosa nega yechimdan oldin chizilishi shundan.", 'Опустим оба числа на полосу. Четвёрка попадает в закрашенное, значит это корень. Минус два падает далеко слева, вне полосы, и гаснет. Обрати внимание: он не перестал быть решением квадратного уравнения. Он никогда и не был решением исходного, потому что при нём логарифма просто нет. Вот почему полосу чертят до решения, а не после.', 'Let us drop both numbers onto the band. Four lands in the shading, so it is a root. Minus two lands far to the left, outside the band, and fades. Note: it did not stop being a solution of the quadratic. It never was a solution of the original equation, because there the logarithm does not exist at all. That is why the band is drawn before solving, not after.'),
    A('work', "O'zingiz hisoblang. Ikki sondan nechtasi polosaga tushdi?", 'Посчитай сам. Сколько чисел из двух попало в полосу?', 'Work it out yourself. How many of the two numbers landed in the band?'),
  ],
  work: {
    prompt: L('Nechta son polosaga tushdi?', 'Сколько чисел попало в полосу?', 'How many numbers landed in the band?'),
    ok: L("Bitta. Minus ikki ikkidan chapda yotadi, u yerda logarifm yo'q, demak u ildiz bo'la olmasdi.", 'Одно. Минус два лежит левее двойки, а там логарифма нет, значит корнем он быть не мог.', 'One. Minus two lies to the left of two, and there is no logarithm there, so it could not be a root.'),
    hint: [
      L("Bo'yalgan joy qayerdan boshlanishini ko'ring.", 'Посмотри, где начинается закрашенное.', 'Look where the shading begins.'),
      L("Polosa ikkidan o'ngda boshlanadi.", 'Полоса начинается справа от двойки.', 'The band starts to the right of two.'),
      L('Bitta.', 'Одно.', 'One.'),
    ],
    answer: '1',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Logarifmik tenglama', 'Логарифмическое уравнение', 'The logarithmic equation'),
  tag: 'odz-logarifma',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidadan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Polosa ekranda qoladi, va qoida yonida ochiladi. Begona ildiz hisob xatosi emas, boshidanoq joiz qiymatlar sohasida bo'lmagan son.", 'Полоса остаётся на экране, и правило открывается рядом. Посторонний корень это не ошибка вычислений, а число, которого не было в области допустимых значений с самого начала.', 'The band stays on the screen and the rule opens beside it. An extraneous root is not a computation error but a number that was not in the admissible set from the very start.'),
  ],
  probe: {
    question: L("Begona ildiz nega paydo bo'ladi?", 'Почему посторонний корень появляется?', 'Why does an extraneous root appear?'),
    items: [
      { id: 'a', label: L('u boshidanoq joiz emas edi', 'он не был допустимым с самого начала', 'it was not admissible from the start'), correct: true },
      { id: 'b', label: L('yechishda xato qilingan', 'при решении сделали ошибку', 'a mistake was made while solving'), hint: L("Xato yo'q: hamma qadam to'g'ri. Son shunchaki polosaga kirmaydi.", 'Ошибки нет: все шаги верны. Число просто не входит в полосу.', 'There is no mistake: every step is correct. The number simply is not in the band.') },
    ],
  },
  rule: {
    lawLabel: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L("Noma'lum logarifmosti ifodada yoki logarifm asosida qatnashgan tenglama logarifmik tenglama deyiladi.", 'Уравнение, где неизвестное стоит под знаком логарифма или в его основании, называют логарифмическим.', 'An equation with the unknown under the logarithm sign or in its base is called logarithmic.'),
      L('Joiz qiymatlar polosasi birinchi almashtirishdan oldin chiziladi.', 'Полосу допустимых значений чертят до первого преобразования.', 'The band of admissible values is drawn before the first step.'),
      L('Topilgan ildiz faqat polosaga tushsa qabul qilinadi.', 'Найденный корень принимают, только если он попал в полосу.', 'A found root is accepted only if it landed in the band.'),
    ],
    law: 'logₐ f(x) = logₐ g(x)   →   f(x) = g(x),   f(x) > 0',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Tenglama va uning ildizi', 'Уравнение и его корень', 'An equation and its root'),
  tag: 'postoronniy-koren',
  audio: [
    A('mount', "To'rt tenglama va to'rt ildiz. Ularni birlashtiring.", 'Четыре уравнения и четыре корня. Соедини их.', 'Four equations and four roots. Match them.'),
  ],
  match: {
    prompt: L('Tenglamani ildizi bilan birlashtiring.', 'Соедини уравнение с его корнем.', 'Match each equation with its root.'),
    ok: L("Har ildiz o'z polosasi ichida yotadi. Polosalarning chegaralari har xil, va belgi ostida turganiga qarash kerak.", 'Каждый корень лежит внутри своей полосы. Границы у полос разные, и смотреть надо на то, что стоит под знаком.', 'Every root lies inside its own band. The bands have different edges, and what matters is what stands under the sign.'),
    left: ['log₂ x = 3', 'log₂ (x − 5) = 1', 'lg (2x − 2) = lg (x + 2)', 'log₃ x = 0'],
    a: '8',
    b: '7',
    c: '4',
    d: '1',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Qadam bilan yeching', 'Реши по шагам', 'Solve it step by step'),
  tag: 'odz-logarifma',
  audio: [
    A('mount', "To'rtta qadam. Tartibini o'zingiz qo'yasiz.", 'Четыре шага. Порядок ставишь ты.', 'Four steps. You put them in order.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L('polosani chizish', 'начертить полосу', 'draw the band'),
    s2: L('belgilarni olish', 'снять знаки', 'take the signs off'),
    s3: L('oddiyni yechish', 'решить обычное', 'solve the ordinary one'),
    s4: L("polosa bo'yicha tekshirish", 'проверить по полосе', 'check against the band'),
    ok: L("Polosa birdan boshlanadi, ildiz esa to'rtga teng, demak u yaraydi.", 'Полоса начинается с единицы, а корень равен четырём, значит он подходит.', 'The band starts at one, and the root is four, so it fits.'),
    bad: L('Avval polosa, keyin belgilar, keyin yechim, oxirida tekshirish.', 'Сначала полоса, потом знаки, потом решение, и проверка в конце.', 'First the band, then the signs, then the solution, and the check at the end.'),
    mark: 'x = 4',
  },
  expr: 'lg (2x − 2) = lg (x + 2)',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'NO INSTRUMENT'),
  title: L('Polosasiz yeching', 'Реши без полосы', 'Solve it without the band'),
  tag: 'bumaga',
  audio: [
    A('mount', "Bu ekranda polosa yo'q. Imtihonda ham bo'lmaydi.", 'На этом экране полосы нет. На экзамене её тоже не будет.', 'There is no band on this screen. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
  task: {
    ok: L("To'qqiz. Logarifm uchga teng, demak iks minus bir sakkizga teng.", 'Девять. Логарифм равен трём, значит икс минус один равно восьми.', 'Nine. The logarithm is three, so x minus one equals eight.'),
    hint: [
      L('Logarifm uchga teng, demak belgi ostida ikki kubda turadi.', 'Логарифм равен трём, значит под знаком стоит два в кубе.', 'The logarithm is three, so two cubed stands under the sign.'),
      L('Iks minus bir sakkizga teng.', 'Икс минус один равно восьми.', 'X minus one equals eight.'),
      L("To'qqiz.", 'Девять.', 'Nine.'),
    ],
    prompt: 'log₂ (x − 1) = 3   →   x = ?',
    answer: '9',
  },
  order: {
    prompt: L("Polosaning chap chegarasi o'sishi bo'yicha joylashtiring.", 'Расставь по возрастанию левой границы полосы.', 'Arrange by increasing left edge of the band.'),
    title: L('Qaysi tenglamaning polosasi oldinroq boshlanadi?', 'У какого уравнения полоса начинается раньше?', 'Which equation has the band starting earlier?'),
    ok: L("Belgi ostida qancha ko'p ayirilsa, polosa shuncha o'ngroqda boshlanadi.", 'Чем больше вычитают под знаком, тем правее начинается полоса.', 'The more is subtracted under the sign, the further right the band starts.'),
    bad: L('Har biri uchun shartni yozing va chegaralarni solishtiring.', 'Выпиши условие для каждого и сравни границы.', 'Write the condition for each and compare the edges.'),
    items: ['log₂ x', 'log₂ (x − 1)', 'log₂ (x − 5)', 'log₂ (x − 9)'],
    answer: 'log₂ x  log₂ (x − 1)  log₂ (x − 5)  log₂ (x − 9)',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Javobda ortiqchasi bor. Qayerda?', 'Ответ лишний. Где?', 'The answer has an extra. Where?'),
  tag: 'check',
  audio: [
    A('mount', 'Masala. Ikki logarifmli tenglamani yechish.', 'Задача. Решить уравнение с двумя логарифмами.', 'A task. Solve an equation with two logarithms.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L('Bu qator shartni shunchaki qaytadan yozadi.', 'Эта строка просто переписывает условие.', 'This line just rewrites the task.'),
    r2: L("Yig'indini yig'ish to'g'ri bajarilgan.", 'Свёртка суммы сделана верно.', 'The sum was folded correctly.'),
    r3: L("Kvadrat tenglama to'g'ri yechilgan.", 'Квадратное уравнение решено верно.', 'The quadratic was solved correctly.'),
  },
  proof: L('Bu yerda javobga ikkala son yozilgan, ulardan biri esa polosadan tashqarida.', 'Здесь в ответ записали оба числа, а одно из них лежит вне полосы.', 'Here both numbers went into the answer, and one of them lies outside the band.'),
  entry: {
    prompt: L('Javobdagi qaysi son ortiqcha?', 'Какое число в ответе лишнее?', 'Which number in the answer is the extra one?'),
    ok: L("Minus uch. Unda logarifm belgisi ostida manfiy son turadi, bunday logarifm esa yo'q.", 'Минус три. При нём под знаком логарифма стоит отрицательное число, а такого логарифма нет.', 'Minus three. There a negative number stands under the logarithm sign, and no such logarithm exists.'),
    hint: [
      L("Har sonni logarifm belgisi ostiga qo'ying.", 'Подставь каждое число под знак логарифма.', 'Substitute each number under the logarithm sign.'),
      L('Ulardan biri manfiy ifoda beradi.', 'Одно из них даёт отрицательное выражение.', 'One of them gives a negative expression.'),
      L('Minus uch.', 'Минус три.', 'Minus three.'),
    ],
    answer: '−3',
  },
  row: {
    r1: 'log₃ x + log₃ (x + 2) = 1',
    r2: 'log₃ (x·(x + 2)) = 1',
    r3: 'x² + 2x − 3 = 0',
    r4: 'x = 1;  x = −3',
  },
  answerId: 'r4',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("Yozuv bo'yicha chegarani toping", 'По записи найди границу', 'From the reading back to the edge'),
  tag: 'obratnoe',
  audio: [
    A('mount', 'Endi teskari masala. Yozuv berilgan, polosaning chegarasini topish kerak.', 'Теперь обратная задача. Дана запись, найти надо границу полосы.', 'Now the inverse task. A reading is given, and the edge of the band must be found.'),
    A('work', 'Avval chegarani yozing, keyin polosadan tashqaridagi sonlarni belgilaysiz.', 'Сначала запиши границу, потом отметишь числа вне полосы.', 'First type the edge, then you will mark the numbers outside the band.'),
  ],
  multi: {
    prompt: L('Bu polosaga tushmaydigan hamma sonni belgilang.', 'Отметь все числа, которые в эту полосу не попадают.', 'Mark every number that does not land in this band.'),
    title: L('Qaysi sonlar polosaga tushmaydi?', 'Какие числа в полосу не попадают?', 'Which numbers do not land in the band?'),
    ok: L("To'rttadan ikkitasi. Chegara ochiq, shuning uchun beshning o'zi ham yaramaydi.", 'Две из четырёх. Граница выколота, поэтому сама пятёрка тоже не годится.', 'Two out of four. The edge is punched out, so five itself does not fit either.'),
    items: [
      { id: 'c', label: '6', hint: L('Olti beshdan katta, demak tushadi.', 'Шесть больше пяти, значит попадает.', 'Six is greater than five, so it lands inside.') },
      { id: 'd', label: '10', hint: L("O'n beshdan katta, demak tushadi.", 'Десять больше пяти, значит попадает.', 'Ten is greater than five, so it lands inside.') },
      { id: 'a', label: '5', ok: true },
      { id: 'b', label: '0', ok: true },
    ],
  },
  entry: {
    prompt: L('Iks minus beshning logarifmida polosa qaysi sondan boshlanadi?', 'С какого числа начинается полоса у логарифма от икс минус пять?', 'From which number does the band start for the logarithm of x minus five?'),
    ok: L('Beshdan. Belgi ostida musbat turishi kerak, demak iks beshdan katta.', 'С пятёрки. Под знаком должно стоять положительное, значит икс больше пяти.', 'From five. A positive number must stand under the sign, so x is greater than five.'),
    hint: [
      L('Belgi ostidagi ifodani nolga tenglashtiring.', 'Приравняй выражение под знаком нулю.', 'Set the expression under the sign to zero.'),
      L('Iks minus besh nolga teng.', 'Икс минус пять равно нулю.', 'X minus five equals zero.'),
      L('Besh.', 'Пять.', 'Five.'),
    ],
    answer: '5',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'odz-logarifma',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Joiz qiymatlar polosasi qachon chiziladi?', 'Когда чертят полосу допустимых значений?', 'When is the band of admissible values drawn?'),
      done: 'x > 0',
      items: [
        { id: 'a', label: L('birinchi almashtirishdan oldin', 'до первого преобразования', 'before the first step'), correct: true },
        { id: 'b', label: L('ildizlar topilgandan keyin', 'после того, как нашли корни', 'after the roots are found'), hint: L('Unda tekshirish marosimga aylanadi. Polosa tekshirish emas, shart sifatida kerak.', 'Тогда проверка превращается в обряд. Полоса нужна как условие, а не как проверка.', 'Then the check becomes a ritual. The band is needed as a condition, not as a check.') },
        { id: 'c', label: L("faqat javob g'alati bo'lsa", 'только если ответ странный', 'only if the answer looks odd'), hint: L("Solishtiradigan narsa bo'lmasa, g'alati javobni sezib bo'lmaydi.", 'Странный ответ заметить нельзя, если не с чем сравнивать.', 'An odd answer cannot be spotted with nothing to compare it to.') },
        { id: 'd', label: L('hech qachon', 'никогда', 'never'), hint: L('Usiz begona ildiz javobga tushadi.', 'Без неё посторонний корень попадает в ответ.', 'Without it an extraneous root gets into the answer.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Begona ildiz nega paydo bo'ladi?", 'Почему появляется посторонний корень?', 'Why does an extraneous root appear?'),
      done: 'x = −2',
      items: [
        { id: 'a', label: L('u boshidanoq joiz emas edi', 'он не был допустимым с самого начала', 'it was not admissible from the start'), correct: true },
        { id: 'b', label: L('hisobdagi xato tufayli', 'из-за ошибки в вычислениях', 'because of a computation error'), hint: L("Hamma qadam to'g'ri edi, va bu qatorlardan ko'rinadi.", 'Все шаги были верны, и это видно по строкам.', 'Every step was correct, and the lines show it.') },
        { id: 'c', label: L('logarifm shunday tuzilgan', 'логарифм так устроен', 'that is how a logarithm works'), hint: L('Gap logarifmda emas, sonning polosadan tashqarida ekanida.', 'Дело не в логарифме, а в том, что число вне полосы.', 'It is not about the logarithm but about the number being outside the band.') },
        { id: 'd', label: L('ildiz doim ikkita', 'корней всегда два', 'there are always two roots'), hint: L("Ular bitta ham, birorta ham bo'lmasligi mumkin.", 'Их бывает и один, и ни одного.', 'There can be one, or none.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Iks minus ikkining logarifmi nima beradi?', 'Что даёт логарифм от икс минус два?', 'What does the logarithm of x minus two give?'),
      done: 'x > 2',
      items: [
        { id: 'a', label: L('iks ikkidan katta shartini', 'условие икс больше двух', 'the condition x greater than two'), correct: true, ok: L('Ha. Belgi ostida musbat son turishi kerak.', 'Да. Под знаком должно стоять положительное число.', 'Yes. A positive number must stand under the sign.') },
        { id: 'b', label: L('iks noldan katta shartini', 'условие икс больше нуля', 'the condition x greater than zero'), hint: L('Belgi ostida oddiy iks tursa nol yarardi.', 'Ноль подошёл бы, если бы под знаком стоял просто икс.', 'Zero would fit if plain x stood under the sign.') },
        { id: 'c', label: L('iks ikkidan kichik shartini', 'условие икс меньше двух', 'the condition x less than two'), hint: L("Unda belgi ostidagi ifoda manfiy bo'lardi.", 'Тогда выражение под знаком было бы отрицательным.', 'Then the expression under the sign would be negative.') },
        { id: 'd', label: L('hech qanday shart', 'никакого условия', 'no condition at all'), hint: L('Har logarifmning sharti bor.', 'Условие есть у каждого логарифма.', 'Every logarithm has a condition.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L('Logarifm belgilarini olish mumkinmi?', 'Можно ли снимать знаки логарифма?', 'May the logarithm signs be taken off?'),
      done: 'f(x) = g(x)',
      items: [
        { id: 'a', label: L("ha, asoslar bir xil bo'lsa va polosa ichida bo'lsak", 'да, если основания совпали и мы внутри полосы', 'yes, if the bases match and we are inside the band'), correct: true },
        { id: 'b', label: L('ha, doim', 'да, всегда', 'yes, always'), hint: L("Polosadan tashqarida logarifmlar umuman yo'q, oladigan narsa yo'q.", 'Вне полосы логарифмов просто нет, снимать нечего.', 'Outside the band there are no logarithms at all, nothing to take off.') },
        { id: 'c', label: L("yo'q, hech qachon", 'нет, никогда', 'no, never'), hint: L('Mumkin: funksiya monoton, va bitta qiymatga bitta argument mos keladi.', 'Можно: функция монотонна, и одному значению отвечает один аргумент.', 'It is allowed: the function is monotone, and one value matches one argument.') },
        { id: 'd', label: L("faqat asos o'nga teng bo'lsa", 'только если основание равно десяти', 'only if the base is ten'), hint: L("Asos har qanday bo'lishi mumkin, faqat chapda va o'ngda bir xil bo'lsa.", 'Основание может быть любым, лишь бы одинаковым слева и справа.', 'The base can be anything, as long as it is the same on both sides.') },
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
    A('next', "Ildiz bitta. Ikkinchi son yechimdan keyin begona bo'lib qolgani yo'q, u hech qachon joiz bo'lmagan.", 'Корень один. Второе число не стало посторонним после решения, оно никогда и не было допустимым.', 'There is one root. The second number did not become extraneous after solving, it never was admissible.'),
  ],
  can: [
    L('Joiz qiymatlar polosasini yechimdan oldin chizaman', 'Черчу полосу допустимых значений до решения', 'I draw the band of admissible values before solving'),
    L("Logarifmlar yig'indisini bittaga keltiraman", 'Свожу сумму логарифмов к одному', 'I fold a sum of logarithms into one'),
    L("Asoslar bir xil bo'lganda belgilarni olaman", 'Снимаю знаки, когда основания совпали', 'I take the signs off when the bases match'),
    L("Ildizlarni omadga emas, polosa bo'yicha tekshiraman", 'Проверяю корни по полосе, а не на удачу', 'I check roots against the band, not by luck'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L('Bitta joy takrorlashni talab qiladi: joiz qiymatlar polosasi.', 'Одно место требует повтора: полоса допустимых значений.', 'One place needs review: the band of admissible values.'),
    back: L('Qoidaga va 3-ekranga qayting.', 'Вернись к правилу и к экрану 3.', 'Go back to the rule and to screen 3.'),
  },
  bridge: L("Keyin blokni takrorlash praktikumi: daraja, ko'rsatkichli va logarifmik birga.", 'Дальше практикум повторения блока: степень, показательная и логарифмическая вместе.', 'Next comes the block review practicum: powers, exponentials and logarithms together.'),
  lifehack: L("Noma'lumli logarifmni ko'rdingizmi, darrov polosa chizing. Keyin vaqt ham, ma'no ham qolmaydi.", 'Увидел логарифм с неизвестным, сразу черти полосу. Потом будет некогда и незачем.', 'Spotted a logarithm with the unknown, draw the band at once. Later there will be neither time nor point.'),
  sheetTitle: L('Logarifmik tenglamalar · shpargalka', 'Логарифмические уравнения · шпаргалка', 'Logarithmic equations · cheat sheet'),
  sheetSrc: L('10-sinf · 31-dars', '10 класс · урок 31', 'Grade 10 · lesson 31'),
  hook: {
    a: '4;  −2',
    b: '4',
  },
  proved: '4',
  law: 'logₐ f(x) = logₐ g(x)   →   f(x) = g(x),   f(x) > 0',
  sheet: [
    'f(x) > 0',
    'logₐ b + logₐ c = logₐ (b·c)',
    'logₐ f = logₐ g   →   f = g',
    't = logₐ x,   t ∈ R',
    '4 ∈ (2; +∞),   −2 ∉ (2; +∞)',
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

// ПОЛОСА ОДНА НА ВЕСЬ УРОК. Границы окна не меняются от экрана к экрану:
// иначе двойка на одном экране и двойка на другом окажутся в разных местах,
// и «корень попал в полосу» перестанет читаться.
const BAND = { lo: -4, hi: 9, ticks: [-2, 0, 2, 4, 6, 8] }
const ROOTS = [{ v: 4, ok: true }, { v: -2, ok: false }]

// ЗАПИСЬ РАСТЁТ ВНИЗ -- прибор 2.
const Tape = ({ show, phase }) => {
  const at = Math.min(phase, show.length - 1)
  const rows = []
  for (let i = 0; i <= at; i += 1) {
    show[i].forEach((x) => { if (typeof x === 'string') rows.push(x) })
  }
  const lines = show[at].filter((x) => typeof x !== 'string')
  return (
    <Cols l={1} r={1}>
      <Col>
        <Panel tone="paper">
          <NoteList items={rows.map((r, i) => (i === rows.length - 1 ? { ok: true, v: r } : r))} />
        </Panel>
      </Col>
      <Col><NoteList items={lines} /></Col>
    </Cols>
  )
}

const PAIR_IDS = ['p0', 'p1', 'p2', 'p3']
const EQ_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const EQ_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

const ORD4 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S4.order[id] }))
const ORD5 = ['s1', 's2', 's3', 's4'].map((id) => ({ id, label: S5.order[id] }))
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
        // Полоса ПУСТАЯ: она есть, но ещё не закрашена. Прогноз делается до
        // того, как стало видно, куда падают числа.
        fig={() => <Scene fig={<DomainBand step={0} from={2} {...BAND} />} max={172} h={172} />}
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
      /* ПРИБОР 5 в полной работе: полоса закрашивается ДО первого
         преобразования, левая граница выколота. */
      <Scene
        fig={<DomainBand step={phase} from={2} {...BAND} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<DomainBand step={1} from={2} {...BAND} />} max={300} />
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
      /* Разграничение видно ПОЛОСОЙ: у простого уравнения она начинается от
         нуля, у суммы двух логарифмов -- от двойки. */
      <Scene
        fig={<DomainBand step={1} from={phase === 0 ? 0 : 2} {...BAND} />}
        note={<NoteList items={S4.show[phase]} />}
      />
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
      <Tape show={S5.show} phase={phase} />
    ) : (
      <OrderRow
        prompt={S5.order.prompt}
        items={ORD5}
        answer={['s1', 's2', 's3', 's4']}
        okText={S5.order.ok}
        badText={S5.order.bad}
        audio={audio}
        onSolved={solve}
      />
    ))}
  </Screen>
)

const Screen6 = (p) => (
  <Screen data={S6} {...p}>
    {({ audio, phase, solved, solve }) => (phase < S6.show.length && !solved ? (
      <Tape show={S6.show} phase={phase} />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <NoteList items={[S6.show[0][2], { ok: true, v: S6.show[1][2] }]} />
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
      /* СВИДЕТЕЛЬ УРОКА. Оба числа падают на полосу: четвёрка попадает в
         закрашенное и остаётся яркой, минус два падает снаружи и гаснет --
         но не исчезает, он был найден и это надо видеть. */
      <Scene
        fig={<DomainBand step={phase + 1} from={2} roots={ROOTS} {...BAND} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<DomainBand step={2} from={2} roots={ROOTS} {...BAND} />} max={300} />
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
        // Корни падают в момент ответа: правило открывается рядом с тем
        // движением, которое его и породило.
        fig={(solved) => (
          <Scene fig={<DomainBand step={solved ? 2 : 1} from={2} roots={ROOTS} {...BAND} />} max={330} />
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
          {/* Полоса другая: граница пятёрка, а не двойка. */}
          <Scene fig={<DomainBand step={1} from={5} {...BAND} />} max={300} />
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
          <Scene
            fig={<DomainBand step={round >= 1 ? 2 : 1} from={2} roots={round >= 1 ? ROOTS : []} {...BAND} />}
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
