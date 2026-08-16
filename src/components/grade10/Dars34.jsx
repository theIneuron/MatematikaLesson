// ============================================================================
// 10-sinf, Dars 34. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS34_KONTENT.md
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
} from './tools.jsx'

// Метка урока: `lesson_id` = grade10-<номер>, `lesson_name` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = 34
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Logarifmik ifodalar`,
  `Урок ${LESSON_NO}. Преобр. логарифмов`,
  `Lesson ${LESSON_NO}. Transforming logarithms`,
)

const BLOCK = { label: 'B5', from: 26, to: 37, current: 34 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('IFODA', 'ВЫРАЖЕНИЕ', 'THE EXPRESSION'),
  title: L("To'qqizmi yoki yigirma yetti", 'Девять или двадцать семь', 'Nine or twenty seven'),
  audio: [
    A('mount', "Sakkiz kubning ikki asosga ko'ra logarifmi. Ko'rsatkich logarifm belgisi ostida turibdi, va u bilan biror ish qilish kerak.", 'Логарифм восьми в кубе по основанию два. Показатель стоит под знаком логарифма, и с ним надо что-то сделать.', 'The logarithm of eight cubed to base two. The exponent stands under the logarithm sign, and something has to be done with it.'),
    A('r1', "Birinchi yozuv logarifmning o'zini kubga ko'taradi: sakkizning logarifmi uch, uch kubi yigirma yetti.", 'Первая запись возводит в куб сам логарифм: логарифм восьми это три, три в кубе двадцать семь.', 'The first reading cubes the logarithm itself: the logarithm of eight is three, and three cubed is twenty seven.'),
    A('r2', "Ikkinchisi ko'rsatkichni oldinga ko'paytuvchi qilib chiqaradi: uch kerra sakkizning logarifmi, bu uch kerra uch, to'qqiz.", 'Вторая выносит показатель множителем вперёд: три умножить на логарифм восьми, это три на три, девять.', 'The second brings the exponent out in front as a factor: three times the logarithm of eight, that is three times three, nine.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi to'g'ridan hisoblab solishtiramiz.", 'Твой ответ записан. Сейчас посчитаем напрямую и сверим.', 'Your answer is saved. Now we will compute it directly and compare.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L("logarifmning o'zini ko'tardik", 'возвели сам логарифм', 'raised the logarithm itself'),
      value: '27',
    },
    b: {
      name: L("ko'rsatkich ko'paytuvchi bo'lib chiqdi", 'показатель вышел множителем', 'the exponent came out as a factor'),
      value: '9',
    },
  },
  expr: 'log₂ 8³',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L('Ifodadan oldin uch savol', 'Три вопроса перед выражением', 'Three questions before the expression'),
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
        { id: 'c', label: L('sakkiz', 'восемь', 'eight'), hint: L("Sakkiz belgi ostida turadi, savol esa ko'rsatkich haqida.", 'Восемь стоит под знаком, а спросили про показатель.', 'Eight stands under the sign, and the question was about the exponent.') },
        { id: 'd', label: L('bir uchdan', 'одна треть', 'one third'), hint: L("Bir uchdan asos va son teskari tartibda bo'lganda chiqadi.", 'Одна треть выходит при обратном порядке основания и числа.', 'One third comes when the base and the number are in the other order.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Bir asosli logarifmlar yig'indisi nechaga teng?", 'Чему равна сумма логарифмов с одним основанием?', 'What does a sum of logarithms with the same base equal?'),
      done: 'logₐ b + logₐ c = logₐ (b·c)',
      items: [
        { id: 'a', label: L("ko'paytmaning logarifmiga", 'логарифму произведения', 'the logarithm of the product'), correct: true },
        { id: 'b', label: L("yig'indining logarifmiga", 'логарифму суммы', 'the logarithm of the sum'), hint: L("Yig'indining logarifmi umuman ochilmaydi.", 'Логарифм суммы не раскрывается вовсе.', 'The logarithm of a sum does not open at all.') },
        { id: 'c', label: L("logarifmlar ko'paytmasiga", 'произведению логарифмов', 'the product of the logarithms'), hint: L("To'rt va sakkizda tekshiring: besh o'rniga olti chiqadi.", 'Проверь на четырёх и восьми: выйдет шесть вместо пяти.', 'Check on four and eight: you get six instead of five.') },
        { id: 'd', label: L('bularning hech biriga', 'ничему из этого', 'none of these'), hint: L('Qoida bor, va u daraja xossasidan chiqariladi.', 'Правило есть, и оно выводится из свойства степени.', 'The rule exists and comes from a property of powers.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Birning logarifmi nechaga teng?', 'Чему равен логарифм единицы?', 'What is the logarithm of one?'),
      done: 'logₐ 1 = 0',
      items: [
        { id: 'a', label: L('har qanday asosda nolga', 'нулю при любом основании', 'zero for any base'), correct: true },
        { id: 'b', label: L('birga', 'единице', 'one'), hint: L("Birga asosning o'z logarifmi teng, birniki emas.", 'Единице равен логарифм самого основания, а не единицы.', 'One is the logarithm of the base itself, not of one.') },
        { id: 'c', label: L("asosning o'ziga", 'самому основанию', 'the base itself'), hint: L("Logarifm ko'rsatkich, asos emas.", 'Логарифм это показатель, а не основание.', 'A logarithm is an exponent, not a base.') },
        { id: 'd', label: L('mavjud emas', 'не существует', 'it does not exist'), hint: L('Nolning logarifmi mavjud emas, birniki emas.', 'Не существует логарифм нуля, а не единицы.', 'It is the logarithm of zero that does not exist, not of one.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Qoidalarsiz hisoblaymiz', 'Посчитаем без правил', 'Let us compute without any rules'),
  tag: 'stepen-vnutri-logarifma',
  show: [
    [
      L('belgi ostida sakkiz kubi turibdi', 'под знаком стоит восемь в кубе', 'eight cubed stands under the sign'),
      L("sakkiz kubi bu besh yuz o'n ikki", 'восемь в кубе это пятьсот двенадцать', 'eight cubed is five hundred twelve'),
      L("demak bu besh yuz o'n ikkining logarifmi", 'значит это логарифм пятисот двенадцати', 'so this is the logarithm of five hundred twelve'),
    ],
    [
      L("ikkining ko'rsatkichini izlaymiz", 'ищем показатель двойки', 'we look for the exponent of two'),
      L("ikkining to'qqizinchi darajasi besh yuz o'n ikki", 'два в девятой это пятьсот двенадцать', 'two to the ninth is five hundred twelve'),
      L("javob to'qqiz, va u hisob bilan olingan", 'ответ девять, и он получен счётом', 'the answer is nine, and it came from counting'),
    ],
  ],
  motion: ['plain'],
  audio: [
    A('mount', "Hozircha hech qanday xossa olmaymiz. Bu ifodani oltinchi sinfda hisoblagandek to'g'ridan hisoblaymiz.", 'Никаких свойств пока не берём. Посчитаем это выражение прямо, как считали бы в шестом классе.', 'We will not use any properties yet. Let us compute this expression directly.'),
    A('plain', "Logarifm belgisi ostida sakkiz kubi turibdi. Sakkiz kubi bu sakkiz kerra sakkiz kerra sakkiz, ya'ni besh yuz o'n ikki. Demak oldimizda besh yuz o'n ikkining ikki asosga ko'ra logarifmi, savol esa oddiy: besh yuz o'n ikki chiqishi uchun ikkini qaysi darajaga ko'tarish kerak. Ikkining darajalari bo'ylab yuramiz: ikki, to'rt, sakkiz, o'n olti, o'ttiz ikki, oltmish to'rt, bir yuz yigirma sakkiz, ikki yuz ellik olti, besh yuz o'n ikki. Bu to'qqizinchi daraja. Javob to'qqiz. Biz birorta xossa qo'llamadik, shunchaki hisobladik.", 'Под знаком логарифма стоит восемь в кубе. Восемь в кубе это восемь на восемь на восемь, то есть пятьсот двенадцать. Значит перед нами логарифм пятисот двенадцати по основанию два, и вопрос простой: в какой степени надо взять двойку, чтобы вышло пятьсот двенадцать. Идём по степеням двойки: два, четыре, восемь, шестнадцать, тридцать два, шестьдесят четыре, сто двадцать восемь, двести пятьдесят шесть, пятьсот двенадцать. Это девятая степень. Ответ девять. Мы не применили ни одного свойства, мы просто посчитали.', 'Eight cubed stands under the logarithm sign. Eight cubed is eight times eight times eight, that is five hundred twelve. So what we have is the logarithm of five hundred twelve to base two, and the question is simple: to what power must two be raised to give five hundred twelve. Let us walk the powers of two: two, four, eight, sixteen, thirty two, sixty four, one hundred twenty eight, two hundred fifty six, five hundred twelve. That is the ninth power. The answer is nine. We applied no property at all, we just counted.'),
    A('work', "O'zingiz hisoblang. Bu ifoda nechaga teng?", 'Посчитай сам. Чему равно это выражение?', 'Work it out yourself. What does this expression equal?'),
  ],
  work: {
    prompt: L('Ifoda nechaga teng?', 'Чему равно выражение?', 'What does the expression equal?'),
    ok: L("To'qqiz. Ikkining to'qqizinchi darajasi besh yuz o'n ikki beradi.", 'Девять. Двойка в девятой степени даёт пятьсот двенадцать.', 'Nine. Two to the ninth gives five hundred twelve.'),
    hint: [
      L('Avval sakkiz kubini hisoblang.', 'Сначала посчитай восемь в кубе.', 'First compute eight cubed.'),
      L("Besh yuz o'n ikki ikkining darajasi. Qaysi biri?", 'Пятьсот двенадцать это степень двойки. Какая?', 'Five hundred twelve is a power of two. Which one?'),
      L("To'qqiz.", 'Девять.', 'Nine.'),
    ],
    expr: 'log₂ 8³',
    answer: '9',
  },
  frameA: 'log₂ 8³ = log₂ 512',
  frameB: '2⁹ = 512',
}

const S4 = {
  role: 'explain2',
  answer: 'order',
  eyebrow: L('FARQLASH', 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L("Chalkashtirish oson bo'lgan ikki yozuv", 'Две записи, которые легко спутать', 'Two writings easy to confuse'),
  tag: 'stepen-vnutri-logarifma',
  show: [
    [
      L('chapda kub belgi ostida turadi', 'слева куб стоит под знаком', 'on the left the cube is under the sign'),
      L("o'ngda logarifmning o'zi kubga ko'tarilgan", 'справа в куб возведён сам логарифм', 'on the right the logarithm itself is cubed'),
      L('qavslar har xil joyda turibdi', 'скобки стоят в разных местах', 'the brackets stand in different places'),
    ],
    [
      L("chapda to'qqiz chiqadi", 'слева выходит девять', 'the left gives nine'),
      L("o'ngda yigirma yetti chiqadi", 'справа выходит двадцать семь', 'the right gives twenty seven'),
      L('demak bular har xil ifodalar', 'значит это разные выражения', 'so these are different expressions'),
    ],
  ],
  motion: ['two'],
  audio: [
    A('mount', 'Ikki yozuv yonma-yon turibdi. Ular faqat qavs joyi bilan farq qiladi.', 'Две записи стоят рядом. Отличаются они только местом скобок.', 'Two writings stand side by side. They differ only in where the brackets are.'),
    A('two', "Chapda kub logarifm belgisi ostida turadi: avval sakkiz kubga ko'tariladi, keyin logarifm olinadi. Buni biz hisoblab bo'ldik, to'qqiz chiqdi. O'ngda logarifmning o'zi kubga ko'tariladi: avval sakkizning logarifmi olinadi, bu uch, va uchning o'zi kubga ko'tariladi, yigirma yetti chiqadi. To'qqiz va yigirma yetti har xil sonlar, demak yozuvlar ham har xil. Qoida shundan: belgi ostidagi ko'rsatkich tashqariga ko'paytuvchi bo'lib chiqadi, ko'rsatkich bo'lib qolmaydi. Uch kerra sakkizning logarifmi, bu uch kerra uch, yana to'qqiz. To'g'ridan hisob va qoida to'g'ri keldi, va bu qoidaning tekshiruvi, uni takrorlash emas.", 'Слева куб стоит под знаком логарифма: сначала восемь возводят в куб, потом берут логарифм. Мы уже посчитали это, вышло девять. Справа в куб возводят сам логарифм: сначала берут логарифм восьми, это три, и уже три возводят в куб, выходит двадцать семь. Девять и двадцать семь разные числа, значит и записи разные. Отсюда и правило: показатель из-под знака выходит наружу множителем, а не остаётся показателем. Три умножить на логарифм восьми, это три на три, снова девять. Счёт напрямую и правило сошлись, и это проверка правила, а не его повторение.', 'On the left the cube is under the logarithm sign: first eight is cubed, then the logarithm is taken. We have already computed that, it gave nine. On the right the logarithm itself is cubed: first the logarithm of eight is taken, that is three, and then three is cubed, giving twenty seven. Nine and twenty seven are different numbers, so the writings are different too. Hence the rule: the exponent from under the sign comes out as a factor, it does not stay an exponent. Three times the logarithm of eight is three times three, nine again. The direct count and the rule agree, and that is a test of the rule, not a repetition of it.'),
    A('work', 'Chap yozuvni hisoblagan tartibimizda qadamlarni joylashtiring.', 'Расставь шаги в том порядке, в котором мы считали левую запись.', 'Put the steps in the order in which we computed the left writing.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring', 'Расставь шаги по порядку', 'Put the steps in order'),
    s1: L('sakkiz kubi', 'восемь в кубе', 'eight cubed'),
    s2: L("bu besh yuz o'n ikki", 'это пятьсот двенадцать', 'that is five hundred twelve'),
    s3: L("bu ikkining to'qqizinchisi", 'это два в девятой', 'that is two to the ninth'),
    s4: L("logarifm to'qqizga teng", 'логарифм равен девяти', 'the logarithm equals nine'),
    ok: L("To'g'ri. Ko'rsatkich ko'paytuvchi bo'lib chiqdi, hisob buni tasdiqladi.", 'Верно. Показатель вышел множителем, и счёт это подтвердил.', 'Correct. The exponent came out as a factor, and the count confirmed it.'),
    bad: L('Logarifmdan emas, belgi ostidagidan boshlang.', 'Начни с того, что стоит под знаком, а не с логарифма.', 'Start with what is under the sign, not with the logarithm.'),
    mark: 'log₂ b^p = p·log₂ b',
  },
  frameA: 'log₂ 8³ = 9',
  frameB: '(log₂ 8)³ = 27',
}

const S5 = {
  role: 'explain3',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Yig'indi bitta belgiga yig'iladi", 'Сумма сворачивается в один знак', 'A sum folds into a single sign'),
  tag: 'log-summy',
  show: [
    [
      L('bir asosli ikki logarifm', 'два логарифма с одним основанием', 'two logarithms with the same base'),
      L('alohida ular hisoblanmaydi', 'по отдельности они не считаются', 'separately neither of them computes'),
      L("yig'indi ko'paytmaning logarifmi", 'сумма это логарифм произведения', 'a sum is the logarithm of the product'),
    ],
    [
      L("o'n sakkizni bir ellik to'rtdanga ko'paytirish", 'восемнадцать умножить на одну пятьдесят четвёртую', 'eighteen times one fifty fourth'),
      L('belgi ostida bir uchdan qoladi', 'под знаком остаётся одна третья', 'one third remains under the sign'),
      L('demak javob minus bir', 'значит ответ минус один', 'so the answer is minus one'),
    ],
  ],
  motion: ['fold'],
  audio: [
    A('mount', 'Darslikdagi topshiriq. Ikki logarifmning bittasi ham alohida hisoblanmaydi.', 'Задание из учебника. Ни один из двух логарифмов по отдельности не считается.', 'A task from the textbook. Neither of the two logarithms computes on its own.'),
    A('fold', "O'n sakkizning uch asosga ko'ra logarifmi butun son emas, bir ellik to'rtdanniki ham. Lekin ularning asoslari bir xil, demak yig'indini ko'paytmaning bitta logarifmiga yig'ish mumkin. O'n sakkizni bir ellik to'rtdanga ko'paytirish bu o'n sakkizni ellik to'rtga bo'lish, ya'ni bir uchdan. Bir uchdanning uch asosga ko'ra logarifmi qoladi. Bir uchdan chiqishi uchun uchni qaysi darajaga ko'tarish kerak? Minus birinchiga. Javob minus bir. E'tibor bering, har bir bo'lak alohida noqulay edi, birga esa ular butun son berdi. Bu tez-tez uchraydi, aynan shuning uchun avval yig'iladi, keyin hisoblanadi.", 'Логарифм восемнадцати по основанию три не целое число, и логарифм одной пятьдесят четвёртой тоже. Но основания у них одинаковые, а значит сумму можно свернуть в один логарифм произведения. Восемнадцать умножить на одну пятьдесят четвёртую это восемнадцать делить на пятьдесят четыре, то есть одна третья. Остаётся логарифм одной третьей по основанию три. В какой степени надо взять тройку, чтобы вышла одна третья? В минус первой. Ответ минус один. Обрати внимание, каждый кусок по отдельности был неудобным, а вместе они дали целое число. Так бывает часто, и именно поэтому сначала сворачивают, а потом считают.', 'The logarithm of eighteen to base three is not a whole number, and neither is the logarithm of one fifty fourth. But their bases are the same, so the sum can be folded into a single logarithm of the product. Eighteen times one fifty fourth is eighteen divided by fifty four, that is one third. What remains is the logarithm of one third to base three. To what power must three be raised to give one third? To minus one. The answer is minus one. Notice that each piece on its own was awkward, while together they gave a whole number. That happens often, and it is exactly why you fold first and compute afterwards.'),
    A('work', "O'zingiz hisoblang. Bu yig'indi nechaga teng?", 'Посчитай сам. Чему равна эта сумма?', 'Work it out yourself. What does this sum equal?'),
  ],
  work: {
    prompt: L("Yig'indi nechaga teng?", 'Чему равна сумма?', 'What does the sum equal?'),
    ok: L('Minus bir. Belgi ostida bir uchdan qoldi, bu esa uchning minus birinchi darajasi.', 'Минус один. Под знаком осталась одна третья, а это тройка в минус первой.', 'Minus one. One third is left under the sign, and that is three to the minus one.'),
    hint: [
      L("Yig'indini ko'paytmaning bitta logarifmiga yig'ing.", 'Сверни сумму в один логарифм произведения.', 'Fold the sum into a single logarithm of a product.'),
      L("O'n sakkizni ellik to'rtga bo'lish bir uchdan.", 'Восемнадцать делить на пятьдесят четыре это одна третья.', 'Eighteen divided by fifty four is one third.'),
      L('Minus bir.', 'Минус один.', 'Minus one.'),
    ],
    expr: 'log₃ 18 + log₃ (1/54)',
    answer: '−1',
  },
  frameA: 'log₃ 18 + log₃ (1/54)',
  frameB: 'log₃ (1/3) = −1',
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L("Ikki logarifm va ikki ko'paytuvchi", 'Два логарифма и два множителя', 'Two logarithms and two factors'),
  tag: 'stepen-vnutri-logarifma',
  show: [
    [
      L("asoslar har xil, yig'ib bo'lmaydi", 'основания разные, свернуть нельзя', 'the bases differ, folding is impossible'),
      L('buning evaziga har biri alohida hisoblanadi', 'зато каждый считается отдельно', 'but each of them computes separately'),
      L('sakkizning logarifmi uchga teng', 'логарифм восьми равен трём', 'the logarithm of eight equals three'),
    ],
    [
      L("to'qqizning logarifmi ikkiga teng", 'логарифм девяти равен двум', 'the logarithm of nine equals two'),
      L('uch kerra uch minus ikki kerra ikki', 'три на три минус два на два', 'three times three minus two times two'),
      L("to'qqiz minus to'rt", 'девять минус четыре', 'nine minus four'),
    ],
  ],
  motion: ['calc'],
  audio: [
    A('mount', "Darslikdagi yana bir topshiriq. Bu yerda asoslar har xil, va bu yo'lni o'zgartiradi.", 'Ещё одно задание из учебника. Здесь основания разные, и это меняет ход.', 'One more task from the textbook. Here the bases differ, and that changes the route.'),
    A('calc', "Asoslar har xil, ikki va uch, shuning uchun yig'adigan narsa yo'q: yig'indi qoidasi faqat bir xil asoslarda ishlaydi. Buning evaziga har bir logarifm o'zicha hisoblanadi. Sakkizning ikki asosga ko'ra logarifmi uchga teng, demak birinchi qo'shiluvchi uch kerra uch. To'qqizning uch asosga ko'ra logarifmi ikkiga teng, demak ikkinchisi ikki kerra ikki. Ayirish qoladi. Qarang, bu yerda nima muhim: oldindagi ko'paytuvchi olib tashlanmaydi va qaytadan belgi ostiga kiritilmaydi, u oxirida qo'llaniladi xolos.", 'Основания разные, два и три, поэтому сворачивать нечего: правило суммы работает только при одинаковых основаниях. Зато каждый логарифм считается сам по себе. Логарифм восьми по основанию два равен трём, значит первое слагаемое это три умножить на три. Логарифм девяти по основанию три равен двум, значит второе это два умножить на два. Остаётся вычесть. Смотри, что здесь важно: множитель впереди не убирают и не заносят обратно под знак, его просто применяют в конце.', 'The bases differ, two and three, so there is nothing to fold: the sum rule works only for equal bases. But each logarithm computes on its own. The logarithm of eight to base two equals three, so the first term is three times three. The logarithm of nine to base three equals two, so the second is two times two. Subtraction is what remains. Notice what matters here: the factor in front is not removed and not pushed back under the sign, it is simply applied at the end.'),
    A('work', "O'zingiz hisoblang. Bu ifoda nechaga teng?", 'Посчитай сам. Чему равно это выражение?', 'Work it out yourself. What does this expression equal?'),
  ],
  work: {
    prompt: L('Ifoda nechaga teng?', 'Чему равно выражение?', 'What does the expression equal?'),
    ok: L("Besh. To'qqiz minus to'rt.", 'Пять. Девять минус четыре.', 'Five. Nine minus four.'),
    hint: [
      L('Har bir logarifmni alohida hisoblang.', 'Посчитай каждый логарифм отдельно.', 'Compute each logarithm separately.'),
      L("Uch kerra uch to'qqiz, ikki kerra ikki to'rt.", 'Три на три это девять, два на два это четыре.', 'Three times three is nine, two times two is four.'),
      L('Besh.', 'Пять.', 'Five.'),
    ],
    expr: '3log₂ 8 − 2log₃ 9',
    answer: '5',
  },
  frameA: '3log₂ 8 − 2log₃ 9',
  frameB: '3·3 − 2·2',
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('CHEGARAVIY HOL', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L("Asos noqulay bo'lganda", 'Когда основание неудобное', 'When the base is inconvenient'),
  tag: 'perehod-perevernuli',
  show: [
    [
      L("asos to'qqiz, son sakson bir", 'основание девять, число восемьдесят один', 'the base is nine, the number is eighty one'),
      L('ikkalasi ham uchning darajasi', 'оба они степени тройки', 'both are powers of three'),
      L("uch asosga o'tamiz", 'переходим к основанию три', 'we move to base three'),
    ],
    [
      L('yuqorida sonning logarifmi', 'сверху логарифм числа', 'the logarithm of the number goes on top'),
      L('pastda asosning logarifmi', 'снизу логарифм основания', 'the logarithm of the base goes below'),
      L("to'rtni ikkiga bo'lish", 'четыре делить на два', 'four divided by two'),
    ],
  ],
  motion: ['base'],
  audio: [
    A('mount', "Darsning oxirgi asbobi. U asoslar har xil bo'lgan va ularni birlashtirish kerak bo'lganda kerak.", 'Последний инструмент урока. Он нужен, когда основания разные, а свести их надо.', 'The last tool of the lesson. It is needed when the bases differ and have to be brought together.'),
    A('base', "Sakson birning to'qqiz asosga ko'ra logarifmi. Ikkala raqam ham uchning darajasi, shuning uchun uch asosga o'tish qulay. O'tish formulasi shunday: yuqorida sonning logarifmi, pastda asosning logarifmi, ikkalasi ham yangi asosda. Yuqorida sakson birning uch asosga ko'ra logarifmi, bu to'rt. Pastda to'qqizning uch asosga ko'ra logarifmi, bu ikki. To'rtni ikkiga bo'lish, javob ikki. Tekshiramiz: to'qqiz kvadrati sakson birga teng, hammasi to'g'ri keladi. Endi kasr ag'darilsa nima bo'lishiga qarang. Ikkini to'rtga bo'lish bir ikkidan. Tekshiramiz: to'qqizning bir ikkidan darajasi uch, sakson bir emas. To'g'ri kelmadi. Tartibni eslashga logarifmning o'zidagi so'z yordam beradi: yuqorida doim son, pastda doim asos.", 'Логарифм восемьдесят одного по основанию девять. Обе цифры это степени тройки, поэтому удобно перейти к основанию три. Формула перехода такая: сверху логарифм числа, снизу логарифм основания, оба по новому основанию. Сверху логарифм восемьдесят одного по основанию три, это четыре. Снизу логарифм девяти по основанию три, это два. Четыре делить на два, ответ два. Проверим: девять в квадрате равно восемьдесят одному, всё сходится. А теперь посмотри, что бывает при перевёрнутой дроби. Два делить на четыре это одна вторая. Проверим: девять в степени одна вторая это три, а не восемьдесят один. Не сходится. Запомнить порядок помогает то же слово, что и в самом логарифме: сверху всегда число, снизу всегда основание.', 'The logarithm of eighty one to base nine. Both figures are powers of three, so it is convenient to move to base three. The change of base formula goes like this: the logarithm of the number on top, the logarithm of the base below, both to the new base. On top, the logarithm of eighty one to base three, that is four. Below, the logarithm of nine to base three, that is two. Four divided by two, the answer is two. Let us check: nine squared equals eighty one, everything agrees. Now look at what happens with the fraction upside down. Two divided by four is one half. Let us check: nine to the power one half is three, not eighty one. It does not agree. What helps to remember the order is the same word as in the logarithm itself: the number is always on top, the base always below.'),
    A('work', "O'zingiz hisoblang. Bu logarifm nechaga teng?", 'Посчитай сам. Чему равен этот логарифм?', 'Work it out yourself. What does this logarithm equal?'),
  ],
  work: {
    prompt: L('Logarifm nechaga teng?', 'Чему равен логарифм?', 'What does the logarithm equal?'),
    ok: L("Ikki. To'rtni ikkiga bo'lish. Tekshiruv: to'qqiz kvadrati sakson birga teng.", 'Два. Четыре делить на два. Проверка: девять в квадрате равно восемьдесят одному.', 'Two. Four divided by two. Check: nine squared equals eighty one.'),
    hint: [
      L("Uch asosga o'ting: to'qqiz ham, sakson bir ham uchning darajasi.", 'Перейди к основанию три: и девять, и восемьдесят один это степени тройки.', 'Move to base three: both nine and eighty one are powers of three.'),
      L("Yuqorida to'rt, pastda ikki.", 'Сверху четыре, снизу два.', 'Four on top, two below.'),
      L('Ikki.', 'Два.', 'Two.'),
    ],
    expr: 'log₉ 81',
    answer: '2',
  },
  frameA: 'log₉ 81 = log₃ 81 / log₃ 9',
  frameB: '4/2 = 2',
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("To'rt xossa", 'Четыре свойства', 'Four properties'),
  tag: 'log-summy',
  motion: ['rule'],
  audio: [
    A('mount', "Qoidani yig'amiz. Xossa to'rtta, va to'rtalasini ham hisob bilan tekshirdik.", 'Соберём правило. Свойств четыре, и все четыре мы уже проверили счётом.', 'Let us put the rule together. There are four properties, and all four we have already checked by counting.'),
    A('rule', "Birinchi: ko'paytmaning logarifmi ko'paytuvchilar logarifmlari yig'indisiga teng. Ikkinchi: bo'linmaning logarifmi bo'linuvchi va bo'luvchi logarifmlari ayirmasiga teng. Uchinchi: darajaning logarifmi ko'rsatkich bilan daraja asosi logarifmi ko'paytmasiga teng, ya'ni ko'rsatkich oldinga ko'paytuvchi bo'lib chiqadi. To'rtinchi: yangi asosga kasr bilan o'tish mumkin, unda yuqorida sonning logarifmi, pastda eski asosning logarifmi, ikkalasi ham yangisida. To'rtalasi ham faqat logarifmlar umuman mavjud bo'lganda, ya'ni belgi ostida musbat son turganda ishlaydi. Va ularning hech biri yig'indining logarifmini ochmaydi: yig'indi uchun qoida umuman yo'q.", 'Первое: логарифм произведения равен сумме логарифмов множителей. Второе: логарифм частного равен разности логарифмов делимого и делителя. Третье: логарифм степени равен произведению показателя на логарифм основания степени, то есть показатель выходит вперёд множителем. Четвёртое: перейти к новому основанию можно дробью, где сверху логарифм числа, а снизу логарифм старого основания, оба по новому. Все четыре работают только тогда, когда логарифмы вообще существуют, то есть под знаком стоит положительное число. И ни одно из них не раскрывает логарифм суммы: для суммы правила нет вовсе.', 'First: the logarithm of a product equals the sum of the logarithms of the factors. Second: the logarithm of a quotient equals the difference of the logarithms of the dividend and the divisor. Third: the logarithm of a power equals the exponent times the logarithm of the base of that power, that is, the exponent comes out in front as a factor. Fourth: you may move to a new base with a fraction where the logarithm of the number is on top and the logarithm of the old base is below, both to the new base. All four work only when the logarithms exist at all, that is, when a positive number stands under the sign. And none of them opens the logarithm of a sum: for a sum there is no rule whatsoever.'),
  ],
  probe: {
    question: L("Logarifm belgisi ostidagi ko'rsatkich qayerga ketadi?", 'Куда уходит показатель из-под знака логарифма?', 'Where does the exponent from under the logarithm sign go?'),
    items: [
      { id: 'a', label: L("oldinga ko'paytuvchi bo'lib", 'вперёд множителем', 'out in front as a factor'), correct: true },
      { id: 'b', label: L("logarifmning ko'rsatkichi bo'lib qoladi", 'остаётся показателем у логарифма', 'it stays as an exponent on the logarithm'), hint: L("U holda yigirma yetti chiqardi, hisob bilan esa to'qqiz chiqdi.", 'Тогда вышло бы двадцать семь, а счётом получилось девять.', 'Then it would give twenty seven, while counting gave nine.') },
    ],
  },
  rule: {
    lawLabel: L("TO'RT XOSSA", 'ЧЕТЫРЕ СВОЙСТВА', 'THE FOUR PROPERTIES'),
    lines: [
      L("ko'paytmaning logarifmi logarifmlar yig'indisi", 'логарифм произведения это сумма логарифмов', 'the logarithm of a product is the sum of the logarithms'),
      L("bo'linmaning logarifmi ayirma", 'логарифм частного это разность', 'the logarithm of a quotient is the difference'),
      L("ko'rsatkich ko'paytuvchi bo'lib chiqadi, asos kasr bilan almashtiriladi", 'показатель выходит множителем, основание меняют дробью', 'the exponent comes out as a factor, the base is changed with a fraction'),
    ],
    law: 'logₐ b^p = p·logₐ b,   logₐ b = log_c b / log_c a',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ТРЕНИРОВКА', 'PRACTICE'),
  title: L('Ifodani qiymati bilan ulang', 'Соедини выражение со значением', 'Match each expression with its value'),
  tag: 'stepen-vnutri-logarifma',
  audio: [
    A('mount', "To'rt ifoda va to'rt son. Avval yig'ing, keyin hisoblang.", 'Четыре выражения и четыре числа. Сначала сворачивай, потом считай.', 'Four expressions and four numbers. Fold first, compute afterwards.'),
  ],
  match: {
    prompt: L("To'rtalasi ham xayolda hisoblanadi", 'Все четыре считаются в уме', 'All four compute in your head'),
    ok: L("To'g'ri. Xossalar chiroy uchun emas: ularsiz bu ifodalarning yarmi hisoblanmaydi.", 'Верно. Свойства нужны не для красоты: без них половина этих выражений не считается.', 'Correct. The properties are not decoration: without them half of these do not compute.'),
    left: ['log₂ 32', 'log₃ 9 + log₃ 3', 'log₅ 125 − log₅ 25', 'log₂ 4³'],
    a: '5',
    b: '3',
    c: '1',
    d: '6',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('QADAMMA-QADAM', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L("Ifodani to'liq yig'ing", 'Сверни выражение целиком', 'Fold the whole expression'),
  tag: 'log-summy',
  audio: [
    A('mount', "Endi butun ifoda. Uch logarifm, to'rt qadam.", 'Теперь всё выражение целиком. Три логарифма, четыре шага.', 'Now the whole expression. Three logarithms, four steps.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring', 'Расставь шаги по порядку', 'Put the steps in order'),
    s1: L("yig'indi ko'paytmaga", 'сумма в произведение', 'sum into a product'),
    s2: L("ayirma bo'linmaga", 'разность в частное', 'difference into a quotient'),
    s3: L('belgi ostini hisoblash', 'считаем под знаком', 'compute under the sign'),
    s4: L('sakkizning logarifmi', 'логарифм восьми', 'the logarithm of eight'),
    ok: L("To'g'ri. Uch logarifm bittaga aylandi, va u xayolda hisoblandi.", 'Верно. Три логарифма стали одним, и он посчитался в уме.', 'Correct. Three logarithms became one, and it computed in the head.'),
    bad: L("Avval yozuv yig'iladi, faqat keyin son hisoblanadi.", 'Сначала сворачивают запись, и только потом считают число.', 'You fold the writing first, and only then compute the number.'),
    mark: 'log₂ 8 = 3',
  },
  expr: 'log₂ 12 + log₂ 6 − log₂ 9',
}

const S11 = {
  role: 'paper',
  answer: 'number',
  format: 'number+order',
  noTool: true,
  eyebrow: L("QOG'OZDA", 'НА БУМАГЕ', 'ON PAPER'),
  title: L('Ayirmani hisoblang', 'Посчитай разность', 'Compute the difference'),
  tag: 'bumaga',
  audio: [
    A('mount', "Asbob yo'q. Qog'ozda hisoblang, keyin solishtiring.", 'Прибора нет. Считай на бумаге, потом сверься.', 'No instrument here. Work it out on paper, then compare.'),
    A('next', "Keyin xatoli yozuv. Xato paydo bo'lgan qatorni toping.", 'Дальше запись с ошибкой. Найди строку, где она появилась.', 'Next comes a written solution with a mistake. Find the line where it appeared.'),
  ],
  task: {
    ok: L("Bir. Bir yuz yigirma beshni yigirma beshga bo'lish besh, beshning besh asosga ko'ra logarifmi esa birga teng.", 'Один. Сто двадцать пять делить на двадцать пять это пять, а логарифм пяти по основанию пять равен единице.', 'One. One hundred twenty five divided by twenty five is five, and the logarithm of five to base five equals one.'),
    hint: [
      L("Logarifmlar ayirmasi bo'linmaning logarifmi.", 'Разность логарифмов это логарифм частного.', 'A difference of logarithms is the logarithm of a quotient.'),
      L('Belgi ostida beshlik qoladi.', 'Под знаком останется пятёрка.', 'A five will be left under the sign.'),
      L('Bir.', 'Один.', 'One.'),
    ],
    prompt: 'log₅ 125 − log₅ 25',
    answer: '1',
  },
  order: {
    prompt: L("Ifodalarni qiymati o'sishi bo'yicha joylashtiring", 'Расставь выражения по возрастанию значения', 'Put the expressions in order of increasing value'),
    title: L('kichik qiymatdan kattasiga', 'от меньшего значения к большему', 'from the smallest value to the largest'),
    ok: L("To'g'ri. Asos va sonning o'zi logarifm kattaligi haqida hech nima demaydi.", 'Верно. Основание и число сами по себе ничего не говорят о величине логарифма.', 'Correct. The base and the number by themselves say nothing about the size of the logarithm.'),
    bad: L('Belgi ostidagi son qayerda kattaroq ekaniga qaramay, har bir logarifmni hisoblang.', 'Считай каждый логарифм, а не смотри, где число под знаком больше.', 'Compute each logarithm instead of looking at which number under the sign is bigger.'),
    items: ['log₂ 8', 'log₃ 81', 'log₅ 25', 'log₇ 7'],
    answer: 'log₇ 7  log₅ 25  log₂ 8  log₃ 81',
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
    A('mount', "To'rt qator. Xato ikkinchisida paydo bo'ldi, keyin uni hech kim sezmadi.", 'Четыре строки. Ошибка появилась во второй, и дальше её никто не заметил.', 'Four lines. The mistake appeared in the second one, and after that nobody noticed it.'),
    A('next', 'Keyin teskari masala: javobga qarab belgi ostidagi sonni tiklang.', 'Дальше обратная задача: по ответу восстанови число под знаком.', 'Next comes the reverse task: rebuild the number under the sign from the answer.'),
  ],
  hint: {
    r1: L("Dastlabki ifoda, bu yerda xato bo'lishi mumkin emas.", 'Исходное выражение, здесь ошибки быть не может.', 'The original expression, no mistake can live here.'),
    r2: L("Belgi ostida yig'indi turgan edi. O'zingizdan so'rang: yig'indi uchun qoida bormi?", 'Под знаком стояла сумма. Спроси себя, есть ли для суммы правило.', 'A sum stood under the sign. Ask yourself whether there is a rule for a sum.'),
    r3: L("Oldingi qatordan bu to'g'ri kelib chiqadi, lekin qatorning o'zi noto'g'ri.", 'Из предыдущей строки это следует верно, но сама она уже неверна.', 'This follows correctly from the previous line, but that line is already wrong.'),
  },
  proof: L("Birinchi qatorni to'g'ridan hisoblang: sakkiz qo'shuv sakkiz o'n olti.", 'Посчитай первую строку прямо: восемь плюс восемь это шестнадцать.', 'Compute the first line directly: eight plus eight is sixteen.'),
  entry: {
    prompt: L('Birinchi ifoda haqiqatda nechaga teng?', 'Чему равно первое выражение на самом деле?', 'What does the first expression really equal?'),
    ok: L("To'rt. Belgi ostida o'n olti, ikkining to'rtinchi darajasi esa o'n olti.", 'Четыре. Под знаком шестнадцать, а два в четвёртой степени это шестнадцать.', 'Four. Sixteen under the sign, and two to the fourth is sixteen.'),
    hint: [
      L('Avval belgi ostidagini hisoblang.', 'Сначала посчитай, что стоит под знаком.', 'First compute what stands under the sign.'),
      L("O'n olti ikkining darajasi. Qaysi biri?", 'Шестнадцать это степень двойки. Какая?', 'Sixteen is a power of two. Which one?'),
      L("To'rt.", 'Четыре.', 'Four.'),
    ],
    answer: '4',
  },
  row: {
    r1: 'log₂ (8 + 8)',
    r2: 'log₂ 8 + log₂ 8',
    r3: '3 + 3',
    r4: '6',
  },
  answerId: 'r2',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L("Teskari yo'l", 'Обратный ход', 'The other direction'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Endi teskarisiga. Tayyor yig'indiga qarab belgi ostidagi sonni ayting.", 'Теперь наоборот. По готовой сумме назови число под знаком.', 'Now the other way round. From the given sum, name the number under the sign.'),
    A('work', "Keyin to'g'ri bo'lgan barcha tengliklarni belgilang.", 'Потом отметь все равенства, которые верны.', 'Then mark every identity that is correct.'),
  ],
  multi: {
    prompt: L("Barcha to'g'ri tengliklarni belgilang", 'Отметь все верные равенства', 'Mark every correct identity'),
    title: L('ular aynan ikkita', 'их ровно два', 'there are exactly two'),
    ok: L("To'g'ri. Ko'paytma, bo'linma va daraja ishlaydi, yig'indi va logarifmlarni bo'lish esa ishlamaydi.", 'Верно. Работают произведение, частное и степень, а сумма и деление логарифмов не работают.', 'Correct. Product, quotient and power work, a sum and a division of logarithms do not.'),
    items: [
      { id: 'c', label: 'logₐ (b + c) = logₐ b + logₐ c', hint: L("Yig'indining logarifmi uchun qoida umuman yo'q.", 'Для логарифма суммы правила нет вовсе.', 'For the logarithm of a sum there is no rule at all.') },
      { id: 'd', label: 'logₐ (b/c) = logₐ b / logₐ c', hint: L("Bo'linmaning logarifmi ayirma, logarifmlar bo'linmasi emas.", 'Логарифм частного это разность, а не частное логарифмов.', 'The logarithm of a quotient is a difference, not a quotient of logarithms.') },
      { id: 'a', label: 'logₐ (b·c) = logₐ b + logₐ c', ok: true },
      { id: 'b', label: 'logₐ b^p = p·logₐ b', ok: true },
    ],
  },
  entry: {
    prompt: L("O'ngdagi yig'indi bitta logarifmga yig'ilgan. Belgi ostida qaysi son turadi?", 'Сумма справа свёрнута в один логарифм. Какое число стоит под знаком?', 'The sum on the right is folded into one logarithm. Which number stands under the sign?'),
    ok: L("Yigirma. To'rtni beshga ko'paytirish: logarifmlar yig'indisi ko'paytmaning logarifmini beradi.", 'Двадцать. Четыре умножить на пять: сумма логарифмов даёт логарифм произведения.', 'Twenty. Four times five: a sum of logarithms gives the logarithm of the product.'),
    hint: [
      L("Logarifmlar yig'indisi ko'paytmaning logarifmi.", 'Сумма логарифмов это логарифм произведения.', 'A sum of logarithms is the logarithm of a product.'),
      L("To'rt bilan beshni ko'paytiring.", 'Перемножь четыре и пять.', 'Multiply four and five.'),
      L('Yigirma.', 'Двадцать.', 'Twenty.'),
    ],
    expr: 'log₃ x = log₃ 4 + log₃ 5',
    answer: '20',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("Ketma-ket to'rt savol", 'Четыре вопроса подряд', 'Four questions in a row'),
  tag: 'perehod-perevernuli',
  audio: [
    A('mount', "Ketma-ket to'rt savol. Birinchi urinish hisobga olinadi.", 'Четыре вопроса подряд. Считается первая попытка.', 'Four questions in a row. The first attempt counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L("Beshning besh asosga ko'ra logarifmi nechaga teng?", 'Чему равен логарифм пяти по основанию пять?', 'What is the logarithm of five to base five?'),
      done: 'log₅ 5 = 1',
      items: [
        { id: 'a', label: L('birga', 'единице', 'one'), correct: true },
        { id: 'b', label: L('nolga', 'нулю', 'zero'), hint: L("Nolga birning logarifmi teng, asosning o'zi emas.", 'Нулю равен логарифм единицы, а не самого основания.', 'Zero is the logarithm of one, not of the base itself.') },
        { id: 'c', label: L('beshga', 'пяти', 'five'), hint: L("Logarifm ko'rsatkich, ko'rsatkich esa bu yerda birinchi.", 'Логарифм это показатель, а показатель здесь первый.', 'A logarithm is an exponent, and the exponent here is one.') },
        { id: 'd', label: L('yigirma beshga', 'двадцати пяти', 'twenty five'), hint: L('Yigirma besh kvadratdan chiqardi, birinchi darajadan emas.', 'Двадцать пять вышло бы из квадрата, а не из первой степени.', 'Twenty five would come from a square, not from the first power.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Belgi ostidagi ko'rsatkich qayerga ketadi?", 'Куда уходит показатель из-под знака?', 'Where does the exponent from under the sign go?'),
      done: 'logₐ b^p = p·logₐ b',
      items: [
        { id: 'a', label: L("oldinga ko'paytuvchi bo'lib", 'вперёд множителем', 'out in front as a factor'), correct: true },
        { id: 'b', label: L('asosga', 'в основание', 'into the base'), hint: L('Bunda asosga umuman tegilmaydi.', 'Основание при этом не трогают вовсе.', 'The base is not touched at all here.') },
        { id: 'c', label: L("logarifmning ko'rsatkichi bo'lib qoladi", 'остаётся показателем у логарифма', 'it stays as an exponent on the logarithm'), hint: L("U holda to'qqiz o'rniga yigirma yetti chiqardi.", 'Тогда вышло бы двадцать семь вместо девяти.', 'Then it would give twenty seven instead of nine.') },
        { id: 'd', label: L("yo'qoladi", 'исчезает', 'it disappears'), hint: L("U yo'qola olmaydi, qiymat unga bog'liq.", 'Исчезнуть он не может, от него зависит значение.', 'It cannot disappear, the value depends on it.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Bu yig'indi nechaga teng?", 'Чему равна эта сумма?', 'What does this sum equal?'),
      done: 'log₂ 8 + log₂ 2 = 4',
      items: [
        { id: 'a', label: L("to'rt", 'четыре', 'four'), correct: true, ok: L("To'rt. Belgi ostida o'n olti qoldi.", 'Четыре. Под знаком осталось шестнадцать.', 'Four. Sixteen was left under the sign.') },
        { id: 'b', label: L('olti', 'шесть', 'six'), hint: L("Olti logarifmlarning o'zini ko'paytirganda chiqardi.", 'Шесть вышло бы, если перемножить сами логарифмы.', 'Six would come from multiplying the logarithms themselves.') },
        { id: 'c', label: L("o'n", 'десять', 'ten'), hint: L("O'n belgilar ostidagi sonlar yig'indisi, javob emas.", 'Десять это сумма чисел под знаками, а не ответ.', 'Ten is the sum of the numbers under the signs, not the answer.') },
        { id: 'd', label: L('uch', 'три', 'three'), hint: L("Uch faqat birinchi qo'shiluvchi.", 'Три это только первое слагаемое.', 'Three is only the first term.') },
      ],
    },
    {
      id: 'q4',
      ask: true,
      prompt: L("O'tish formulasida yuqorida nima turadi?", 'Что стоит сверху в формуле перехода?', 'What stands on top in the change of base formula?'),
      done: 'logₐ b = log_c b / log_c a',
      items: [
        { id: 'a', label: L('sonning logarifmi', 'логарифм числа', 'the logarithm of the number'), correct: true },
        { id: 'b', label: L('asosning logarifmi', 'логарифм основания', 'the logarithm of the base'), hint: L("U holda sakson birning to'qqiz asosga ko'ra logarifmi bir ikkidan berardi.", 'Тогда логарифм восемьдесят одного по основанию девять дал бы одну вторую.', 'Then the logarithm of eighty one to base nine would give one half.') },
        { id: 'c', label: L('yangi asos', 'новое основание', 'the new base'), hint: L('Yangi asos ikkala logarifmda ham turadi, alohida emas.', 'Новое основание стоит у обоих логарифмов, а не отдельно.', 'The new base sits on both logarithms, not on its own.') },
        { id: 'd', label: L('bir', 'единица', 'one'), hint: L("Yuqoridagi bir boshqa formulada bo'ladi, unda son va asos o'rin almashadi.", 'Единица сверху бывает в другой формуле, где меняют местами число и основание.', 'A one on top appears in a different formula, where the number and the base swap places.') },
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
    A('mount', "Taxmin to'qqiz va yigirma yetti haqida edi. Nima chiqqanini ko'ramiz.", 'Прогноз был про девять и двадцать семь. Посмотрим, что вышло.', 'The guess was about nine and twenty seven. Let us see how it turned out.'),
    A('next', "To'qqiz. Ko'rsatkich ko'paytuvchi bo'lib chiqdi, to'g'ridan hisob buni tasdiqladi.", 'Девять. Показатель вышел множителем, и прямой счёт это подтвердил.', 'Nine. The exponent came out as a factor, and the direct count confirmed it.'),
  ],
  can: [
    L("Ko'rsatkichni belgi ostidan ko'paytuvchi qilib chiqaraman", 'Вывожу показатель из-под знака множителем', 'I bring the exponent out as a factor'),
    L("Yig'indi va ayirmani bitta logarifmga yig'aman", 'Сворачиваю сумму и разность в один логарифм', 'I fold a sum and a difference into one logarithm'),
    L("Yangi asosga o'taman va kasrni chalkashtirmayman", 'Перехожу к новому основанию и не путаю дробь', 'I change the base and do not flip the fraction'),
    L("Yig'indining logarifmi ochilmasligini bilaman", 'Знаю, что логарифм суммы не раскрывается', 'I know the logarithm of a sum does not open'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of problem is closed.'),
    gap: L("Bir joy takrorlashni talab qiladi: yangi asosga o'tish.", 'Одно место требует повтора: переход к новому основанию.', 'One spot needs a second look: the change of base.'),
    back: L('Qoidaga va yettinchi ekranga qayting.', 'Вернись к правилу и к экрану 7.', 'Go back to the rule and to screen seven.'),
  },
  bridge: L("Keyin logarifmli tengsizliklar: javobni izlashdan oldin yig'ishga to'g'ri keladi.", 'Дальше неравенства с логарифмами: сворачивать придётся до того, как искать ответ.', 'Next come inequalities with logarithms: folding will have to happen before looking for the answer.'),
  lifehack: L("Hisoblashdan oldin asoslarga qarang. Bir xillari yig'iladi, har xillari o'tishni talab qiladi.", 'Прежде чем считать, посмотри на основания. Одинаковые сворачиваются, разные требуют перехода.', 'Before computing, look at the bases. Equal ones fold, different ones call for a change of base.'),
  sheetTitle: L('Logarifmlarni almashtirish · shpargalka', 'Преобразование логарифмов · шпаргалка', 'Transforming logarithms · cheat sheet'),
  sheetSrc: L('10-sinf · 34-dars', '10 класс · урок 34', 'Grade 10 · lesson 34'),
  hook: {
    a: '27',
    b: '9',
  },
  proved: '9',
  law: 'logₐ b^p = p·logₐ b',
  sheet: [
    'logₐ (b·c) = logₐ b + logₐ c',
    'logₐ (b/c) = logₐ b − logₐ c',
    'logₐ b^p = p·logₐ b',
    'logₐ b = log_c b / log_c a',
    'log₂ 8³ = 9;   (log₂ 8)³ = 27',
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

// ЧЕРТЕЖА В УРОКЕ НЕТ, И ЭТО РЕШЕНИЕ, А НЕ ПРОПУСК.
//
// Тема урока -- преобразование ЗАПИСИ, и свидетель темы живёт в записи же:
// одно и то же число считается двумя путями и должно сойтись. Логарифмическая
// кривая здесь ничего не доказывала бы -- это была бы иллюстрация без
// дидактической роли, а такие кадры `DINAMIKA_VA_ILLUSTRATSIYA.md` §1 велит
// убирать. Работает прибор 2: запись растёт вниз, каждый шаг назван.
const Tape = ({ rows, phase, items }) => (
  <Cols l={1} r={1}>
    <Col>
      <Panel tone="paper">
        <NoteList
          items={rows.slice(0, phase + 1).map((r, i) => (i === phase ? { ok: true, v: r } : r))}
        />
      </Panel>
    </Col>
    <Col><NoteList items={items} /></Col>
  </Cols>
)

// Запись целиком -- для экранов, где кадры уже отыграли.
const Done = ({ rows }) => (
  <Panel tone="paper">
    <NoteList items={rows.map((r, i) => (i === rows.length - 1 ? { ok: true, v: r } : r))} />
  </Panel>
)

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

const Screen1 = (p) => (
  <Screen data={S1} {...p}>
    {(s) => (
      <HookBody
        {...s}
        data={{ ...S1, rows: [{ id: 'a', ...S1.row.a }, { id: 'b', ...S1.row.b }] }}
      />
    )}
  </Screen>
)

const Screen2 = (p) => (
  <Screen data={S2} {...p}>
    {({ audio, solve }) => (
      <Cols l={1} r={1.4}>
        <Col>
          <Panel tone="paper">
            <Expr size="big">{S2.items[1].done}</Expr>
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
      /* ПРИБОР 2. Считаем БЕЗ свойств: сначала восемь в кубе, потом степень
         двойки. Ответ получен счётом, и это делает правило проверяемым. */
      <Tape rows={[S3.frameA, S3.frameB]} phase={phase} items={S3.show[phase]} />
    ) : (
      <Cols l={1} r={1}>
        <Col><Done rows={[S3.frameA, S3.frameB]} /></Col>
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
      /* Две записи стоят РЯДОМ, а не одна под другой: различие в месте скобок
         видно только при сравнении. */
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <NoteList items={phase === 0 ? [S4.frameA] : [S4.frameA, { ok: true, v: S4.frameB }]} />
          </Panel>
        </Col>
        <Col><NoteList items={S4.show[phase]} /></Col>
      </Cols>
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
      <Tape rows={[S5.frameA, S5.frameB]} phase={phase} items={S5.show[phase]} />
    ) : (
      <Cols l={1} r={1}>
        <Col><Done rows={[S5.frameA, S5.frameB]} /></Col>
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
      <Tape rows={[S6.frameA, S6.frameB]} phase={phase} items={S6.show[phase]} />
    ) : (
      <Cols l={1} r={1}>
        <Col><Done rows={[S6.frameA, S6.frameB]} /></Col>
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
      <Tape rows={[S7.frameA, S7.frameB]} phase={phase} items={S7.show[phase]} />
    ) : (
      <Cols l={1} r={1}>
        <Col><Done rows={[S7.frameA, S7.frameB]} /></Col>
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
        // Свидетель урока рядом с правилом: два счёта одного выражения, и
        // расходятся они ровно там, где стоят скобки.
        fig={(solved) => (
          <Panel tone="paper">
            <NoteList items={solved ? [S4.frameA, { ok: true, v: S4.frameB }] : [S4.frameA]} />
          </Panel>
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
          <Panel tone="paper">
            <Expr size="big">{S13.entry.expr}</Expr>
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
    {(s) => <BlitzBody {...s} data={S14} />}
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
