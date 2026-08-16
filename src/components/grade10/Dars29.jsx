// ============================================================================
// 10-sinf, Dars 29. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl `scripts/grade10-kontent-build.mjs` bilan yasalgan:
//   manba:  src/books/grade10/DARS29_KONTENT.md
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
const LESSON_NO = 29
const LESSON_ID = `grade10-${String(LESSON_NO).padStart(2, '0')}`
const LESSON_TITLE = L(
  `${LESSON_NO}-dars. Logarifm`,
  `Урок ${LESSON_NO}. Логарифм`,
  `Lesson ${LESSON_NO}. The logarithm`,
)

const BLOCK = { label: 'B5', from: 26, to: 37, current: 29 }

const S1 = {
  role: 'hook',
  answer: 'pick4',
  eyebrow: L('LOGARIFM', 'ЛОГАРИФМ', 'THE LOGARITHM'),
  title: L("Ko'paytmaning logarifmi", 'Логарифм произведения', 'The logarithm of a product'),
  audio: [
    A('mount', "Chapda logarifm belgisi ostida ko'paytma. O'ngda ikki javob, besh va olti. Aynan bittasi to'g'ri.", 'Слева произведение под знаком логарифма. Справа два ответа, пять и шесть. Верен ровно один.', 'On the left a product under the logarithm sign. On the right two answers, five and six. Exactly one is correct.'),
    A('r1', "Birinchi yozuv ko'paytmaning logarifmi logarifmlarning ko'paytmasi deydi.", 'Первая запись говорит, что логарифм произведения это произведение логарифмов.', 'The first reading says the logarithm of a product is the product of the logarithms.'),
    A('r2', "Ikkinchisi bu ularning yig'indisi deydi.", 'Вторая говорит, что это их сумма.', 'The second says it is their sum.'),
    A('ask', "Sizningcha qaysi biri to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какая верная? Пока просто предположи.', 'Which one do you think is right? Just make a guess for now.'),
  ],
  probe: {
    question: L("Qaysi yozuv to'g'ri?", 'Какая запись верна?', 'Which reading is correct?'),
    afterPredict: L("Javobingiz yozib olindi. Endi logarifm qayerdan kelishini ko'ramiz, va qoida o'zi chiqadi.", 'Твой ответ записан. Сейчас посмотрим, откуда логарифм берётся, и правило выйдет само.', 'Your answer is saved. Now we will see where the logarithm comes from, and the rule will come out on its own.'),
    items: [
      { id: 'a', label: L('birinchi', 'первая', 'the first') },
      { id: 'b', label: L('ikkinchi', 'вторая', 'the second'), correct: true },
      { id: 'both', label: L('ikkisi ham', 'обе', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни одна', 'neither') },
    ],
  },
  row: {
    a: {
      name: L("logarifmlar ko'paytiriladi", 'логарифмы перемножаются', 'the logarithms multiply'),
      value: '6',
    },
    b: {
      name: L("logarifmlar qo'shiladi", 'логарифмы складываются', 'the logarithms add up'),
      value: '5',
    },
  },
  expr: 'log₂ (4·8)',
}

const S2 = {
  role: 'support',
  answer: 'pick4',
  eyebrow: L('TAYANCH', 'ОПОРА', 'WHAT YOU KNOW'),
  title: L("O'tgan darslardan uch savol", 'Три вопроса из прошлых уроков', 'Three questions from the previous lessons'),
  tag: 'support',
  audio: [
    A('mount', "Uch qisqa savol. Uchalasi ham bir daqiqadan keyin kerak bo'ladi.", 'Три коротких вопроса. Все три понадобятся через минуту.', 'Three short questions. All three will be needed in a minute.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Sakkizni ikkining darajasi qilib qanday yozish kerak?', 'Как записать восемь степенью двойки?', 'How is eight written as a power of two?'),
      done: '8 = 2³',
      items: [
        { id: 'a', label: L('ikki uchinchi darajada', 'два в третьей', 'two to the third'), correct: true },
        { id: 'b', label: L("ikki to'rtinchi darajada", 'два в четвёртой', 'two to the fourth'), hint: L("Ikki to'rtinchi darajada bu o'n olti. Ko'paytuvchilarni sanang.", 'Два в четвёртой это шестнадцать. Посчитай множители.', 'Two to the fourth is sixteen. Count the factors.') },
        { id: 'c', label: L("to'rt ikkinchi darajada", 'четыре во второй', 'four to the second'), hint: L("Qiymat to'g'ri, lekin asos bu yerda to'rt, savol esa ikki haqida.", 'Значение верное, но основание здесь четвёрка, а спросили про двойку.', 'The value is right, but the base here is four, and the question was about two.') },
        { id: 'd', label: L('uch ikkinchi darajada', 'три во второй', 'three to the second'), hint: L("Uch ikkinchi darajada bu to'qqiz.", 'Три во второй это девять.', 'Three to the second is nine.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L('Ikki iks darajada sakkizga teng tenglamaning ildizi nechaga teng?', 'Чему равен корень уравнения два в степени икс равно восьми?', 'What is the root of two to the x equals eight?'),
      done: 'x = 3',
      items: [
        { id: 'a', label: L('uch', 'три', 'three'), correct: true },
        { id: 'b', label: L("to'rt", 'четыре', 'four'), hint: L("To'rt bo'lish bilan chiqardi, ko'rsatkich esa bo'lish bilan topilmaydi.", 'Четыре вышло бы делением, а показатель делением не находят.', 'Four would come from dividing, and the exponent is not found by dividing.') },
        { id: 'c', label: L("o'n olti", 'шестнадцать', 'sixteen'), hint: L("O'n olti bu qiymat, savol esa ko'rsatkich haqida.", 'Шестнадцать это значение, а спросили про показатель.', 'Sixteen is a value, and the question was about the exponent.') },
        { id: 'd', label: L("ildiz yo'q", 'корней нет', 'there are no roots'), hint: L('Sakkiz musbat, demak gorizontal egri chiziqni uchratadi.', 'Восемь положительно, значит горизонталь кривую встречает.', 'Eight is positive, so the horizontal does meet the curve.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L("Darajalarni ko'paytirishda ko'rsatkichlar nima qilinadi?", 'Что делают с показателями при умножении степеней?', 'What happens to the exponents when powers are multiplied?'),
      done: 'a^m·a^n = a^{m+n}',
      items: [
        { id: 'a', label: L("qo'shiladi", 'складывают', 'they are added'), correct: true },
        { id: 'b', label: L("ko'paytiriladi", 'перемножают', 'they are multiplied'), hint: L("Darajani darajaga ko'tarishda ko'paytiriladi.", 'Перемножают при возведении степени в степень.', 'They are multiplied when a power is raised to a power.') },
        { id: 'c', label: L("bo'linadi", 'делят', 'they are divided'), hint: L("Bo'lish ko'rsatkichni kamaytiradi, ko'paytirish esa ko'paytuvchilarni qo'shadi.", 'Деление уменьшает показатель, а умножение множители дописывает.', 'Division lowers the exponent, multiplication appends factors.') },
        { id: 'd', label: L('hech narsa', 'ничего', 'nothing'), hint: L("Ko'paytuvchilar ko'paydi, demak ko'rsatkich o'zgardi.", 'Множителей стало больше, значит показатель изменился.', 'There are more factors now, so the exponent changed.') },
      ],
    },
  ],
}

const S3 = {
  role: 'explain1',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Logarifm bu ko'rsatkich", 'Логарифм это показатель', 'A logarithm is an exponent'),
  tag: 'delyat-vmesto-osnovaniya',
  show: [
    [
      L('sakkiz darajasida gorizontal', 'горизонталь на уровне восьми', 'a horizontal at the level eight'),
      L("uchrashuv uchga to'g'ri keldi", 'встреча пришлась на тройку', 'the meeting fell at three'),
      '2^x = 8   →   x = 3',
    ],
    [
      L('bu uchning nomi bor', 'у этой тройки есть имя', 'that three has a name'),
      L("bu yerda yangi amal yo'q", 'новой операции здесь нет', 'there is no new operation here'),
      'log₂ 8 = 3',
    ],
  ],
  motion: ['read'],
  audio: [
    A('mount', "Bu chizma allaqachon bor edi. O'tgan darsda sakkiz darajasidagi gorizontal egri chiziqni uchratdi, va uchrashuv uchga to'g'ri keldi.", 'Этот чертёж уже был. На прошлом уроке горизонталь на уровне восьми встретила кривую, и встреча пришлась на тройку.', 'This drawing has been here before. Last lesson a horizontal at the level eight met the curve, and the meeting fell at three.'),
    A('read', "O'shanda qaysi iksda qiymat sakkizga teng deb so'ragan va uch deb javob bergan edik. Hozir savol o'sha, lekin javobning nomi paydo bo'ldi. Uch bu sakkizning ikki asosga ko'ra logarifmi. Logarifm yangi amal emas, allaqachon topilgan ko'rsatkich uchun qisqa yozuv.", 'Тогда мы спрашивали, при каком икс значение равно восьми, и отвечали тройкой. Сейчас вопрос тот же, но у ответа появилось имя. Тройка это логарифм восьми по основанию два. Логарифм не новая операция, а короткая запись для показателя, который уже нашли.', 'Back then we asked at which x the value is eight and answered three. The question is the same now, but the answer has a name. Three is the logarithm of eight to base two. A logarithm is not a new operation but a short way to write an exponent we already found.'),
    A('work', "O'zingiz hisoblang. O'ttiz ikkining ikki asosga ko'ra logarifmi nechaga teng?", 'Посчитай сам. Чему равен логарифм тридцати двух по основанию два?', 'Work it out yourself. What is the logarithm of thirty two to base two?'),
  ],
  work: {
    prompt: L("O'ttiz ikkining ikki asosga ko'ra logarifmi nechaga teng?", 'Чему равен логарифм тридцати двух по основанию два?', 'What is the logarithm of thirty two to base two?'),
    ok: L("Besh. Ikki beshinchi darajada bu o'ttiz ikki, logarifm esa aynan besh.", 'Пять. Двойка в пятой степени это тридцать два, и логарифм это как раз пятёрка.', 'Five. Two to the fifth is thirty two, and the logarithm is exactly that five.'),
    hint: [
      L("O'zingizdan so'rang: o'ttiz ikki chiqishi uchun ikkini qaysi darajaga ko'tarish kerak.", 'Спроси себя, в какую степень возвести двойку, чтобы вышло тридцать два.', 'Ask yourself which power of two gives thirty two.'),
      L("Ko'paytuvchilarni sanang: ikki, to'rt, sakkiz, o'n olti, o'ttiz ikki.", 'Считай множители: два, четыре, восемь, шестнадцать, тридцать два.', 'Count the factors: two, four, eight, sixteen, thirty two.'),
      L('Besh.', 'Пять.', 'Five.'),
    ],
    answer: '5',
  },
}

const S4 = {
  role: 'explain2',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Asos pastda turadi', 'Основание стоит внизу', 'The base stands below'),
  tag: 'osnovanie-i-argument-mestami',
  show: [
    [
      L('pastda asos, yonida argument', 'внизу основание, рядом аргумент', 'the base below, the argument beside it'),
      L('ularni joy almashtiramiz', 'поменяем их местами', 'let us swap them'),
      'log₂ 8 = 3',
    ],
    [
      L('qiymatlar har xil chiqdi', 'значения получились разные', 'the values came out different'),
      L('uch va bir uchdan', 'три и одна треть', 'three and one third'),
      'log₈ 2 = 1/3',
    ],
  ],
  motion: ['swap'],
  audio: [
    A('mount', "Logarifm yozuvida ikki son bor. Pastda asos, uning yonida argument. Ularni ko'p aralashtiriladi.", 'В записи логарифма два числа. Внизу основание, рядом с ним аргумент. Их часто путают.', 'There are two numbers in a logarithm. The base below, the argument beside it. They are often mixed up.'),
    A('swap', "Ikkalasini hisoblaymiz. Sakkiz chiqishi uchun ikkini qaysi darajaga ko'tarish kerak. Uchinchiga, demak birinchisi uchga teng. Endi teskarisi: ikki chiqishi uchun sakkizni qaysi darajaga ko'tarish kerak. Bir uchdanga, chunki sakkizning kub ildizi ikki. Uch va bir uchdan har xil sonlar, demak ularni joy almashtirish mumkin emas.", 'Посчитаем оба. В какую степень возвести двойку, чтобы вышло восемь. В третью, значит первое равно трём. Теперь наоборот: в какую степень возвести восьмёрку, чтобы вышла двойка. В одну третью, потому что кубический корень из восьми это два. Три и одна треть это разные числа, значит местами их менять нельзя.', 'Let us compute both. Which power of two gives eight. The third, so the first equals three. Now the other way: which power of eight gives two. One third, because the cube root of eight is two. Three and one third are different numbers, so they must not be swapped.'),
    A('work', "O'zingiz hisoblang. Ikkining sakkiz asosga ko'ra logarifmi nechaga teng?", 'Посчитай сам. Чему равен логарифм двойки по основанию восемь?', 'Work it out yourself. What is the logarithm of two to base eight?'),
  ],
  work: {
    prompt: L("Ikkining sakkiz asosga ko'ra logarifmi nechaga teng?", 'Чему равен логарифм двойки по основанию восемь?', 'What is the logarithm of two to base eight?'),
    ok: L('Bir uchdan. Sakkiz bir uchdan darajada bu kub ildiz, u esa ikkiga teng.', 'Одна треть. Восемь в степени одна треть это кубический корень, а он равен двум.', 'One third. Eight to the power one third is the cube root, and that equals two.'),
    hint: [
      L("Asos bu yerda sakkiz, olish kerak bo'lgani esa ikki.", 'Основание здесь восьмёрка, а получить надо двойку.', 'The base here is eight, and two is what must come out.'),
      L("Kasr ko'rsatkich daraja haqidagi darsda ko'rilgan.", 'Дробный показатель разобран на уроке про степень.', 'The fractional exponent was covered in the lesson on powers.'),
      L('Bir uchdan.', 'Одна треть.', 'One third.'),
    ],
    answer: '1/3',
  },
}

const S5 = {
  role: 'explain3',
  answer: 'order',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Ko'paytmaning logarifmi", 'Логарифм произведения', 'The logarithm of a product'),
  tag: 'log-summy',
  show: [
    [
      L("ikkala ko'paytuvchi ikkining darajasi", 'оба множителя это степени двойки', 'both factors are powers of two'),
      L("ko'paytirishda ko'rsatkichlar qo'shiladi", 'при умножении показатели складываются', 'multiplying adds the exponents'),
      '4·8 = 2²·2³',
    ],
    [
      L("logarifm esa ko'rsatkichning o'zi", 'а логарифм и есть показатель', 'and the logarithm is that exponent'),
      L("demak logarifmlar ham qo'shiladi", 'значит логарифмы тоже складываются', 'so the logarithms add up too'),
      'log₂ (4·8) = 2 + 3',
    ],
  ],
  motion: ['sum'],
  audio: [
    A('mount', "Dars boshidagi yozuvga qaytamiz. To'rt va sakkiz ikkining darajalari.", 'Вернёмся к записи с начала урока. Четыре и восемь это степени двойки.', 'Back to the reading from the start of the lesson. Four and eight are powers of two.'),
    A('sum', "Ikkala ko'paytuvchini darajalar bilan qaytadan yozamiz. To'rt bu ikki kvadratda, sakkiz bu ikki kubda. Darajalarni ko'paytirishda ko'rsatkichlar qo'shiladi, demak birgalikda ikki beshinchi darajada chiqadi. Logarifm ko'rsatkichning o'zi, shuning uchun ko'paytmaning logarifmi logarifmlar yig'indisiga teng. E'tibor bering: yig'indi uchun bunday qoida umuman yo'q, darajalar yig'indisini bitta darajaga yig'ib bo'lmaydi.", 'Перепишем оба множителя степенями. Четыре это два в квадрате, восемь это два в кубе. При умножении степеней показатели складываются, значит вместе получается два в пятой. Логарифм это и есть показатель, поэтому логарифм произведения равен сумме логарифмов. Заметь, что для суммы такого правила нет вовсе: сумму степеней в одну степень не собрать.', 'Let us rewrite both factors as powers. Four is two squared, eight is two cubed. Multiplying powers adds the exponents, so together we get two to the fifth. The logarithm is that exponent, so the logarithm of a product equals the sum of the logarithms. Notice there is no such rule for a sum: a sum of powers does not collapse into one power.'),
    A('work', "Bu qoida qanday chiqqan bo'lsa, qadamlarni joylashtiring.", 'Расставь шаги, как это правило получилось.', 'Put the steps in the order this rule came out.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L("ko'paytuvchilar daraja bo'lib", 'множители как степени', 'the factors as powers'),
    s2: L("ko'rsatkichlarni qo'shish", 'показатели сложить', 'add the exponents'),
    s3: L("ko'rsatkich bu logarifm", 'показатель это логарифм', 'the exponent is the logarithm'),
    s4: L("logarifmlarni qo'shish", 'логарифмы сложить', 'add the logarithms'),
    ok: L('Qoida daraja xossasidan chiqdi, alohida kelishuvdan emas.', 'Правило вышло из свойства степени, а не из отдельного соглашения.', 'The rule came out of a property of powers, not from a separate agreement.'),
    bad: L("Avval ko'paytuvchilar daraja bo'lib, keyin ko'rsatkichlar, keyin logarifmlar.", 'Сначала множители степенями, потом показатели, потом логарифмы.', 'First the factors as powers, then the exponents, then the logarithms.'),
    mark: '5',
  },
}

const S6 = {
  role: 'explain4',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L("Bo'linmaning logarifmi", 'Логарифм частного', 'The logarithm of a quotient'),
  tag: 'log-summy',
  show: [
    [
      L("darajalarni bo'lishda ko'rsatkichlar ayiriladi", 'при делении степеней показатели вычитаются', 'dividing powers subtracts the exponents'),
      L('demak logarifmlar ham', 'значит логарифмы тоже', 'so the logarithms do too'),
      '32 : 4 = 2⁵ : 2²',
    ],
    [
      L("yo'l o'sha", 'сам ход тот же', 'the path is the same'),
      L("yangi qoida paydo bo'lmadi", 'новых правил не появилось', 'no new rule appeared'),
      'log₂ 32 − log₂ 4 = 3',
    ],
  ],
  motion: ['dif'],
  audio: [
    A('mount', "Endi bo'lish. O'ttiz ikki to'rtga bo'linadi.", 'Теперь деление. Тридцать два разделить на четыре.', 'Now division. Thirty two divided by four.'),
    A('dif', "O'ttiz ikki bu ikki beshinchi darajada, to'rt bu ikki kvadratda. Darajalarni bo'lishda ko'rsatkichlar ayiriladi, demak ikki uchinchi darajada qoladi. Bo'linmaning logarifmi logarifmlar ayirmasiga teng, va xulosa bir daqiqa oldingining o'zi. Yodlaydigan narsa yo'q: qoida har safar daraja xossasidan chiqadi.", 'Тридцать два это два в пятой, четыре это два в квадрате. При делении степеней показатели вычитаются, значит остаётся два в третьей. Логарифм частного равен разности логарифмов, и вывод тот же самый, что минуту назад. Заучивать нечего: правило каждый раз выходит из свойства степени.', 'Thirty two is two to the fifth, four is two squared. Dividing powers subtracts the exponents, so two to the third is left. The logarithm of a quotient equals the difference of the logarithms, and the derivation is the same as a minute ago. There is nothing to memorise: the rule comes out of a property of powers every time.'),
    A('work', "O'zingiz hisoblang. O'ttiz ikki va to'rtning ikki asosga ko'ra logarifmlari ayirmasi nechaga teng?", 'Посчитай сам. Чему равна разность логарифмов тридцати двух и четырёх по основанию два?', 'Work it out yourself. What is the difference of the logarithms of thirty two and four to base two?'),
  ],
  work: {
    prompt: L('Bu ayirma nechaga teng?', 'Чему равна эта разность?', 'What is this difference?'),
    ok: L("Uch. Beshdan ikki ayirilgan, va bu sakkizning logarifmi, chunki o'ttiz ikki to'rtga bo'linsa sakkiz bo'ladi.", 'Три. Пять минус два, и это логарифм восьми, потому что тридцать два делить на четыре это восемь.', 'Three. Five minus two, and that is the logarithm of eight, because thirty two over four is eight.'),
    hint: [
      L('Har logarifmni alohida hisoblang.', 'Посчитай каждый логарифм отдельно.', 'Compute each logarithm separately.'),
      L("O'ttiz ikki bu ikki beshinchi darajada, to'rt bu ikki kvadratda.", 'Тридцать два это два в пятой, четыре это два в квадрате.', 'Thirty two is two to the fifth, four is two squared.'),
      L('Uch.', 'Три.', 'Three.'),
    ],
    answer: '3',
  },
}

const S7 = {
  role: 'explain5',
  answer: 'number',
  eyebrow: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  title: L('Logarifm qayerda mavjud', 'Где логарифм существует', 'Where a logarithm exists'),
  tag: 'odz-logarifma',
  show: [
    [
      L('yozuv tagida polosa', 'полоса под записью', 'a band under the reading'),
      L("logarifm bor joy bo'yalgan", 'закрашено, где логарифм есть', 'shaded where the logarithm exists'),
      'log₂ x,   x > 0',
    ],
    [
      L('nol va minus tashqarida qoldi', 'ноль и минус остались снаружи', 'zero and the negatives stayed outside'),
      L("ikkining darajasi manfiy bo'lmaydi", 'степень двойки отрицательной не бывает', 'a power of two is never negative'),
      'log₂ 1 = 0',
    ],
  ],
  motion: ['band'],
  audio: [
    A('mount', "Yozuv tagida polosa paydo bo'ldi. Unda logarifm umuman mavjud bo'lgan joy bo'yalgan.", 'Под записью появилась полоса. На ней закрашено, где логарифм вообще существует.', 'A band appeared under the reading. It shows where the logarithm exists at all.'),
    A('band', "Logarifm bu darajaning ko'rsatkichi, ikkining darajasi esa doim musbat. Demak logarifm belgisi ostida faqat musbat son turishi mumkin. Nol va manfiylar bo'yalgan joydan tashqarida qoladi, va bu taqiq emas, o'tgan darsning natijasi. Chegaralarni tekshiring: birning logarifmi nolga teng, chunki ikki nol darajada bir bo'ladi. Ikkining o'zining logarifmi birga teng.", 'Логарифм это показатель степени, а степень двойки всегда положительна. Значит под знаком логарифма может стоять только положительное число. Ноль и отрицательные остаются вне закрашенного, и это не запрет, а следствие прошлого урока. Проверь границы: логарифм единицы равен нулю, потому что двойка в нулевой степени это единица. Логарифм самой двойки равен единице.', 'A logarithm is an exponent, and a power of two is always positive. So only a positive number can stand under the logarithm sign. Zero and the negatives stay outside the shading, and that is not a ban but a consequence of the previous lesson. Check the edges: the logarithm of one is zero, because two to the zero is one. The logarithm of two itself is one.'),
    A('work', "O'zingiz hisoblang. Birning ikki asosga ko'ra logarifmi nechaga teng?", 'Посчитай сам. Чему равен логарифм единицы по основанию два?', 'Work it out yourself. What is the logarithm of one to base two?'),
  ],
  work: {
    prompt: L("Birning ikki asosga ko'ra logarifmi nechaga teng?", 'Чему равен логарифм единицы по основанию два?', 'What is the logarithm of one to base two?'),
    ok: L("Nol. Ikki nol darajada bu bir, logarifm esa aynan o'sha nol ko'rsatkich.", 'Ноль. Двойка в нулевой степени это единица, и логарифм это как раз тот нулевой показатель.', 'Zero. Two to the zero power is one, and the logarithm is exactly that zero exponent.'),
    hint: [
      L("So'rang: bir chiqishi uchun ikkini qaysi darajaga ko'tarish kerak.", 'Спроси, в какую степень возвести двойку, чтобы вышла единица.', 'Ask which power of two gives one.'),
      L("Nol ko'rsatkich daraja haqidagi darsda ko'rilgan.", 'Нулевой показатель разобран на уроке про степень.', 'The zero exponent was covered in the lesson on powers.'),
      L('Nol.', 'Ноль.', 'Zero.'),
    ],
    answer: '0',
  },
}

const S8 = {
  role: 'rule',
  answer: 'pick2',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'RULE'),
  title: L('Logarifm', 'Логарифм', 'The logarithm'),
  tag: 'log-summy',
  motion: ['rule'],
  audio: [
    A('mount', 'Tushuntirish tugadi. Qoidadan oldin bitta savol.', 'Объяснение закончилось. Перед правилом один вопрос.', 'The explanation is over. One question before the rule.'),
    A('rule', "Chizma ekranda qoladi, va qoida yonida ochiladi. Logarifm bu ko'rsatkich, va uning hamma xossalari daraja xossalaridan chiqadi. Ularning birortasini yodlash shart emas: har biri ikki qatorda chiqariladi.", 'Чертёж остаётся на экране, и правило открывается рядом. Логарифм это показатель, и все его свойства получаются из свойств степени. Ни одно из них заучивать не надо: каждое выводится за две строки.', 'The drawing stays on the screen and the rule opens beside it. A logarithm is an exponent, and all its properties come from the properties of powers. None of them needs memorising: each is derived in two lines.'),
  ],
  probe: {
    question: L("Nega ko'paytmaning logarifmi yig'indi bo'ladi?", 'Почему логарифм произведения это сумма?', 'Why is the logarithm of a product a sum?'),
    items: [
      { id: 'a', label: L("darajalarni ko'paytirishda ko'rsatkichlar qo'shiladi", 'при умножении степеней показатели складываются', 'multiplying powers adds the exponents'), correct: true },
      { id: 'b', label: L('shunday kelishilgan', 'так договорились', 'it was agreed so'), hint: L("Kelishuv yo'q: qoida daraja xossasidan chiqdi, uni qaytadan chiqarish mumkin.", 'Договора нет: правило вышло из свойства степени, и его можно вывести заново.', 'There is no agreement: the rule came out of a property of powers and can be derived again.') },
    ],
  },
  rule: {
    lawLabel: L('Logarifm', 'Логарифм', 'The logarithm'),
    lines: [
      L("b sonning a asosga ko'ra logarifmi deb b ni hosil qilish uchun a ni ko'tarish kerak bo'lgan daraja ko'rsatkichiga aytiladi.", 'Логарифмом числа бэ по основанию а называют показатель степени, в которую надо возвести а, чтобы получить бэ.', 'The logarithm of b to base a is the exponent a must be raised to in order to get b.'),
      L("Ko'paytmaning logarifmi logarifmlar yig'indisiga, bo'linmaniki ayirmasiga teng.", 'Логарифм произведения равен сумме логарифмов, частного их разности.', 'The logarithm of a product is the sum of the logarithms, of a quotient their difference.'),
      L('Logarifm belgisi ostida musbat son turadi, asos esa birga teng emas.', 'Под знаком логарифма стоит положительное число, а основание не равно единице.', 'A positive number stands under the sign, and the base is not one.'),
    ],
    law: 'logₐ (b·c) = logₐ b + logₐ c',
  },
}

const S9 = {
  role: 'drill',
  answer: 'match',
  format: 'match',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Yozuv va uning qiymati', 'Запись и её значение', 'A reading and its value'),
  tag: 'osnovanie-i-argument-mestami',
  audio: [
    A('mount', "To'rt yozuv va to'rt qiymat. Ularni birlashtiring.", 'Четыре записи и четыре значения. Соедини их.', 'Four readings and four values. Match them.'),
  ],
  match: {
    prompt: L('Yozuvni qiymati bilan birlashtiring.', 'Соедини запись со значением.', 'Match each reading with its value.'),
    ok: L("Asos pastda, va hammasi unga bog'liq. Bir xil son har xil asoslarda har xil logarifm beradi.", 'Основание внизу, и от него зависит всё. Одно и то же число при разных основаниях даёт разные логарифмы.', 'The base is below, and everything depends on it. The same number gives different logarithms with different bases.'),
    left: ['log₂ 32', 'log₃ 9', 'log₈ 2', 'log₂ 1'],
    a: '5',
    b: '2',
    c: '1/3',
    d: '0',
  },
}

const S10 = {
  role: 'guided',
  answer: 'order',
  format: 'order-steps',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Qadam bilan qaytadan yozing', 'Перепиши по шагам', 'Rewrite it step by step'),
  tag: 'log-summy',
  audio: [
    A('mount', "To'rtta qadam. Tartibini o'zingiz qo'yasiz.", 'Четыре шага. Порядок ставишь ты.', 'Four steps. You put them in order.'),
  ],
  order: {
    prompt: L('Qadamlarni tartib bilan joylashtiring.', 'Расставь шаги по порядку.', 'Put the steps in order.'),
    s1: L("ayirmani bo'linmaga", 'разность в частное', 'the difference into a quotient'),
    s2: L("bo'linmani hisoblash", 'посчитать частное', 'compute the quotient'),
    s3: L('sakkiz bu ikki kubda', 'восемь это два в кубе', 'eight is two cubed'),
    s4: L('javob uch', 'ответ три', 'the answer is three'),
    ok: L("Logarifmlar ayirmasi bitta logarifmga yig'ildi, keyin arifmetika qoldi.", 'Разность логарифмов свернулась в один логарифм, и дальше осталась арифметика.', 'The difference of logarithms folded into one, and arithmetic was all that remained.'),
    bad: L("Avval bo'linmaga yig'ish, keyin hisoblash, keyin darajani bilish.", 'Сначала свернуть в частное, потом посчитать, потом узнать степень.', 'First fold into a quotient, then compute, then find the power.'),
    mark: '3',
  },
  expr: 'log₂ 24 − log₂ 3',
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
    A('mount', "Bu ekranda chizma yo'q. Imtihonda ham bo'lmaydi.", 'На этом экране чертежа нет. На экзамене его тоже не будет.', 'There is no drawing on this screen. There will be none at the exam either.'),
    A('next', "Javobni o'zingiz yozing.", 'Ответ запиши сам.', 'Type the answer yourself.'),
  ],
  task: {
    ok: L("Besh. Logarifmlar yig'indisi ko'paytmaning logarifmi, sakkiz kerra to'rt esa o'ttiz ikki.", 'Пять. Сумма логарифмов это логарифм произведения, а восемь на четыре это тридцать два.', 'Five. A sum of logarithms is the logarithm of the product, and eight times four is thirty two.'),
    hint: [
      L("Yig'indini bitta logarifmga yig'ing.", 'Сверни сумму в один логарифм.', 'Fold the sum into one logarithm.'),
      L("Belgi ostida sakkiz va to'rtning ko'paytmasi qoladi.", 'Под знаком окажется произведение восьми и четырёх.', 'Under the sign you get the product of eight and four.'),
      L('Besh.', 'Пять.', 'Five.'),
    ],
    prompt: 'log₂ 8 + log₂ 4   →   ?',
    answer: '5',
  },
  order: {
    prompt: L("O'sish tartibida joylashtiring.", 'Расставь по возрастанию.', 'Arrange in increasing order.'),
    title: L('Qaysi yozuv kichikroq?', 'Какая запись меньше?', 'Which reading is smaller?'),
    ok: L('Asos bitta, demak argumentlar tartibi va logarifmlar tartibi bir xil.', 'Основание одно, значит порядок аргументов и порядок логарифмов совпадают.', 'The base is the same, so the order of the arguments and of the logarithms agree.'),
    bad: L('Har qiymatni hisoblang, keyin solishtiring.', 'Посчитай каждое значение, потом сравнивай.', 'Compute each value, then compare.'),
    items: ['log₂ 1', 'log₂ 2', 'log₂ 8', 'log₂ 32'],
    answer: 'log₂ 1  log₂ 2  log₂ 8  log₂ 32',
  },
}

const S12 = {
  role: 'trap',
  answer: 'number',
  format: 'audit',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Javob xato. Qayerda?', 'Ответ неверный. Где?', 'The answer is wrong. Where?'),
  tag: 'check',
  audio: [
    A('mount', "Masala. Yig'indining logarifmi qiymatini topish.", 'Задача. Найти значение логарифма от суммы.', 'A task. Find the value of the logarithm of a sum.'),
    A('next', "To'rt qator, hammasi to'g'ri ko'rinadi. Birinchi xato qatorni qidiring.", 'Четыре строки, все выглядят верными. Ищи первую неверную.', 'Four lines, all look right. Look for the first wrong one.'),
  ],
  hint: {
    r1: L('Bu qator shartni shunchaki qaytadan yozadi.', 'Эта строка просто переписывает условие.', 'This line just rewrites the task.'),
    r3: L("Bu oldingi qatorning to'g'ri natijasi.", 'Это верное следствие предыдущей строки.', 'This is a correct consequence of the previous line.'),
    r4: L("Bu yerda son oldingi qator bo'yicha to'g'ri hisoblangan.", 'Число здесь посчитано по предыдущей строке верно.', 'The number here is computed correctly from the previous line.'),
  },
  proof: L("Bu yerda belgi ostidagi yig'indi logarifmlar yig'indisi qilib ochildi, bunday qoida esa yo'q.", 'Здесь сумму под знаком раскрыли как сумму логарифмов, а такого правила нет.', 'Here the sum under the sign was opened as a sum of logarithms, and there is no such rule.'),
  entry: {
    prompt: L('Bu ifoda haqiqatda nechaga teng?', 'Чему равно это выражение на самом деле?', 'What does this expression actually equal?'),
    ok: L("Uch. Avval belgi ostidagi sonlar qo'shiladi, va faqat keyin sakkizning logarifmi olinadi.", 'Три. Сначала складывают числа под знаком, и только потом берут логарифм восьмёрки.', 'Three. First the numbers under the sign are added, and only then the logarithm of eight is taken.'),
    hint: [
      L('Avval belgi ostida turganini hisoblang.', 'Посчитай сначала то, что стоит под знаком.', 'First compute what stands under the sign.'),
      L("To'rt qo'shuv to'rt bu sakkiz.", 'Четыре плюс четыре это восемь.', 'Four plus four is eight.'),
      L('Uch.', 'Три.', 'Three.'),
    ],
    answer: '3',
  },
  row: {
    r1: 'log₂ (4 + 4)',
    r2: 'log₂ 4 + log₂ 4',
    r3: '2 + 2',
    r4: '4',
  },
  answerId: 'r2',
}

const S13 = {
  role: 'transfer',
  answer: 'number',
  format: 'number+multi',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Qiymat berilgan, sonni toping', 'Значение дано, найди число', 'The value is given, find the number'),
  tag: 'obratnoe',
  audio: [
    A('mount', "Endi teskari masala. Logarifm ma'lum, sonning o'zini topish kerak.", 'Теперь обратная задача. Логарифм известен, найти надо само число.', 'Now the inverse task. The logarithm is known, and the number must be found.'),
    A('work', "Avval sonni yozing, keyin qiymati ikki bo'lgan hamma yozuvni belgilaysiz.", 'Сначала запиши число, потом отметишь все записи со значением два.', 'First type the number, then you will mark every reading with the value two.'),
  ],
  multi: {
    prompt: L('Qiymati ikkiga teng hamma yozuvni belgilang.', 'Отметь все записи, значение которых равно двум.', 'Mark every reading whose value is two.'),
    title: L('Qaysi yozuvlarning qiymati ikkiga teng?', 'У каких записей значение равно двум?', 'Which readings have the value two?'),
    ok: L("To'rttadan ikkitasi. Bir xil qiymat har xil asoslarda chiqadi.", 'Две из четырёх. Одно и то же значение получается при разных основаниях.', 'Two out of four. The same value comes from different bases.'),
    items: [
      { id: 'c', label: 'log₇ 7', hint: L('Bu yerda asos va son bir xil, demak qiymat birga teng.', 'Здесь основание и число совпадают, значит значение равно единице.', 'Here the base and the number coincide, so the value is one.') },
      { id: 'd', label: 'log₄ 1', hint: L('Bu birning logarifmi, u esa doim nol.', 'Это логарифм единицы, а он всегда ноль.', 'That is the logarithm of one, and it is always zero.') },
      { id: 'a', label: 'log₃ 9', ok: true },
      { id: 'b', label: 'log₅ 25', ok: true },
    ],
  },
  entry: {
    prompt: L('Asos besh, logarifm uchga teng. Belgi ostida qaysi son turadi?', 'При основании пять логарифм равен трём. Какое число стоит под знаком?', 'With base five the logarithm is three. Which number is under the sign?'),
    ok: L("Bir yuz yigirma besh. Logarifm bu ko'rsatkich, demak besh kubda.", 'Сто двадцать пять. Логарифм это показатель, значит пять в кубе.', 'One hundred twenty five. The logarithm is an exponent, so five cubed.'),
    hint: [
      L("Logarifm uchga teng, demak asos uchinchi darajaga ko'tariladi.", 'Логарифм равен трём, значит основание берут в третьей степени.', 'The logarithm is three, so the base is taken to the third power.'),
      L('Besh kubda.', 'Пять в кубе.', 'Five cubed.'),
      L('Bir yuz yigirma besh.', 'Сто двадцать пять.', 'One hundred twenty five.'),
    ],
    answer: '125',
  },
}

const S14 = {
  role: 'blitz',
  answer: 'mixed',
  format: 'chain',
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L("To'rt savol · natijaga kiradi", 'Четыре вопроса · идут в результат', 'Four questions · they count'),
  tag: 'log-summy',
  audio: [
    A('mount', "To'rtta qisqa savol. Faqat shu ekran natijaga kiradi.", 'Четыре коротких вопроса. Только этот экран идёт в результат.', 'Four short questions. Only this screen counts.'),
  ],
  items: [
    {
      id: 'q1',
      ask: true,
      prompt: L('Logarifm nima?', 'Что такое логарифм?', 'What is a logarithm?'),
      done: 'log₂ 8 = 3',
      items: [
        { id: 'a', label: L("darajaning ko'rsatkichi", 'показатель степени', 'an exponent'), correct: true },
        { id: 'b', label: L("bo'lish natijasi", 'результат деления', 'the result of a division'), hint: L("Ko'rsatkich bo'lish bilan topilmaydi, bu o'tgan darsda tekshirilgan.", 'Делением показатель не находят, это проверено на прошлом уроке.', 'The exponent is not found by dividing, that was checked last lesson.') },
        { id: 'c', label: L('darajaning asosi', 'основание степени', 'the base of a power'), hint: L('Asos pastda turadi, logarifm esa chiqadigan narsa.', 'Основание стоит внизу, а логарифм это то, что получается.', 'The base stands below, and the logarithm is what comes out.') },
        { id: 'd', label: L('yangi amal', 'новая операция', 'a new operation'), hint: L("Yangi amal yo'q: bu allaqachon topilgan ko'rsatkichning nomi.", 'Новой операции нет: это имя для уже найденного показателя.', 'There is no new operation: it is a name for an exponent already found.') },
      ],
    },
    {
      id: 'q2',
      ask: true,
      prompt: L("Ko'paytmaning logarifmi nechaga teng?", 'Чему равен логарифм произведения?', 'What is the logarithm of a product?'),
      done: 'logₐ (b·c) = logₐ b + logₐ c',
      items: [
        { id: 'a', label: L("logarifmlar yig'indisiga", 'сумме логарифмов', 'the sum of the logarithms'), correct: true },
        { id: 'b', label: L("logarifmlar ko'paytmasiga", 'произведению логарифмов', 'the product of the logarithms'), hint: L("To'rt va sakkizda tekshiring: besh o'rniga olti chiqadi.", 'Проверь на четырёх и восьми: выйдет шесть вместо пяти.', 'Check on four and eight: you get six instead of five.') },
        { id: 'c', label: L('logarifmlar ayirmasiga', 'разности логарифмов', 'the difference of the logarithms'), hint: L("Ayirma bo'lishga mos keladi, ko'paytirishga emas.", 'Разность отвечает делению, а не умножению.', 'A difference matches division, not multiplication.') },
        { id: 'd', label: L('bularning hech biriga', 'ничему из этого', 'none of these'), hint: L('Qoida bor, va u daraja xossasidan chiqariladi.', 'Правило есть, и оно выводится из свойства степени.', 'The rule exists and comes from a property of powers.') },
      ],
    },
    {
      id: 'q3',
      ask: true,
      prompt: L('Logarifm belgisi ostida qanday son turishi mumkin?', 'Какое число может стоять под знаком логарифма?', 'Which number can stand under a logarithm sign?'),
      done: 'x > 0',
      items: [
        { id: 'a', label: L('faqat musbat', 'только положительное', 'only a positive one'), correct: true, ok: L("Ha. Musbat asosning darajasi manfiy bo'lmaydi.", 'Да. Степень положительного основания отрицательной не бывает.', 'Yes. A power of a positive base is never negative.') },
        { id: 'b', label: L('har qanday', 'любое', 'any'), hint: L("Unda minus to'rtga teng ikkining darajasi topilardi, u esa yo'q.", 'Тогда нашлась бы степень двойки, равная минус четырём, а её нет.', 'Then there would be a power of two equal to minus four, and there is none.') },
        { id: 'c', label: L('faqat butun', 'только целое', 'only a whole number'), hint: L("Kasr ham yaraydi, faqat musbat bo'lsa.", 'Дробное тоже годится, лишь бы положительное.', 'A fractional one works too, as long as it is positive.') },
        { id: 'd', label: L('faqat birdan katta', 'только больше единицы', 'only greater than one'), hint: L('Nol va bir orasida ham logarifm bor, u shunchaki manfiy.', 'Между нулём и единицей логарифм тоже есть, он просто отрицательный.', 'Between zero and one the logarithm exists too, it is just negative.') },
      ],
    },
    {
      id: 'q4',
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
  ],
}

const S15 = {
  role: 'summary',
  answer: 'none',
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L('Nima qoldi', 'Что осталось', 'What you take away'),
  audio: [
    A('mount', 'Dars boshida ikki yozuvdan birini tanlash kerak edi. Mana natija.', 'В начале урока нужно было выбрать одну из двух записей. Вот результат.', 'At the start you had to choose one of two readings. Here is the result.'),
    A('next', "Ko'paytmaning logarifmi logarifmlar yig'indisiga teng, chunki darajalarni ko'paytirishda ko'rsatkichlar qo'shiladi.", 'Логарифм произведения равен сумме логарифмов, потому что при умножении степеней показатели складываются.', 'The logarithm of a product is the sum of the logarithms, because multiplying powers adds the exponents.'),
  ],
  can: [
    L("Logarifmni darajaning ko'rsatkichi deb o'qiyman", 'Читаю логарифм как показатель степени', 'I read a logarithm as an exponent'),
    L('Asosni belgi ostidagi son bilan aralashtirmayman', 'Не путаю основание с числом под знаком', 'I do not mix the base with the number under the sign'),
    L('Xossalarni daraja xossalaridan chiqaraman', 'Вывожу свойства из свойств степени', 'I derive the properties from those of powers'),
    L('Belgi ostida musbat son turishini bilaman', 'Знаю, что под знаком стоит положительное число', 'I know a positive number stands under the sign'),
  ],
  levels: {
    full: L('Bu turdagi masalalar yopildi.', 'Этот тип задач закрыт.', 'This type of task is closed.'),
    gap: L("Bitta joy takrorlashni talab qiladi: ko'paytmaning logarifmi.", 'Одно место требует повтора: логарифм произведения.', 'One place needs review: the logarithm of a product.'),
    back: L('Qoidaga va 5-ekranga qayting.', 'Вернись к правилу и к экрану 5.', 'Go back to the rule and to screen 5.'),
  },
  bridge: L("Keyin belgi ostidagi son o'zgaruvchi bo'ladi, va logarifmik funksiya chiqadi.", 'Дальше число под знаком станет переменной, и получится логарифмическая функция.', 'Next the number under the sign becomes a variable, and a logarithmic function appears.'),
  lifehack: L("Xossani esdan chiqardingizmi, sonlarni darajalar bilan yozing. Qoida ikki qatorda o'zi chiqadi.", 'Забыл свойство, перепиши числа степенями. Правило выйдет само за две строки.', 'Forgot a property, rewrite the numbers as powers. The rule comes out on its own in two lines.'),
  sheetTitle: L('Logarifm · shpargalka', 'Логарифм · шпаргалка', 'The logarithm · cheat sheet'),
  sheetSrc: L('10-sinf · 29-dars', '10 класс · урок 29', 'Grade 10 · lesson 29'),
  hook: {
    a: '6',
    b: '5',
  },
  proved: '5',
  law: 'logₐ (b·c) = logₐ b + logₐ c',
  sheet: [
    'logₐ b = c   ⇄   a^c = b',
    'logₐ (b·c) = logₐ b + logₐ c',
    'logₐ (b/c) = logₐ b − logₐ c',
    'logₐ 1 = 0,   logₐ a = 1',
    'b > 0,   a > 0,   a ≠ 1',
  ],
}

// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========

// Число из контента: минус там типографский, `parseFloat` его не понимает.
// Дробь тоже приходит записью: `NumberEntry` её разбирает сам.
const num = (s) => {
  const t = String(s).replace(/−/g, '-').replace(',', '.')
  if (t.indexOf('/') !== -1) {
    const p = t.split('/')
    return parseFloat(p[0]) / parseFloat(p[1])
  }
  return parseFloat(t)
}

// ОКНО ЧЕРТЕЖА то же, что в 28-м уроке. Причина: экран 3 показывает ТУ ЖЕ
// встречу, что была на прошлом уроке, и если окно поедет, ученик решит, что
// это другой чертёж. Логарифм здесь не новая картинка, а новое чтение старой.
const WIN = { xmin: -2.6, xmax: 3.15, ymax: 9, tx: [-2, -1, 1, 2, 3], ty: [1, 2, 4, 8] }

// ЗАПИСЬ РАСТЁТ ВНИЗ -- прибор 2. Слова кадра идут `L(...)` объектами,
// формулы -- строками; зелёным ровно одна строка, последняя.
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
const LOG_LEFT = S9.match.left.map((label, i) => ({ id: PAIR_IDS[i], label }))
const LOG_RIGHT = ['a', 'b', 'c', 'd'].map((k, i) => {
  const v = S9.match[k]
  return { id: PAIR_IDS[i], label: v && v.label ? v.label : v, hint: v && v.hint ? v.hint : undefined }
})

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
      /* СВИДЕТЕЛЬ УРОКА. Тот же чертёж, что на прошлом уроке, и та же
         встреча. Меняется только вопрос: не «какое значение», а «какой
         показатель». Логарифм это имя для ответа, который уже найден. */
      <Scene
        fig={<Plane step={phase} curve="exp" show="none" level={8} {...WIN} />}
        note={<NoteList items={S3.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<Plane step={1} curve="exp" show="none" level={8} {...WIN} />} max={300} />
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
      <Tape show={S4.show} phase={phase} />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Panel tone="paper">
            <NoteList items={[S4.show[0][2], { ok: true, v: S4.show[1][2] }]} />
          </Panel>
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
      /* Прибор 5 появляется ВПЕРВЫЕ и в мягком виде: он просто показывает,
         где логарифм существует. Полную работу полоса получает в 31-м. */
      <Scene
        fig={<DomainBand step={phase + 1} from={0} lo={-3} hi={9} ticks={[-2, 0, 2, 4, 6, 8]} />}
        note={<NoteList items={S7.show[phase]} />}
      />
    ) : (
      <Cols l={1} r={1}>
        <Col>
          <Scene fig={<DomainBand step={1} from={0} lo={-3} hi={9} ticks={[-2, 0, 2, 4, 6, 8]} />} max={300} />
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
            fig={<Plane step={solved ? 1 : 0} curve="exp" show="none" level={8} {...WIN} />}
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
        left={LOG_LEFT}
        right={LOG_RIGHT}
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
          <Scene fig={<Plane step={1} curve="exp" show="none" {...WIN} />} max={300} />
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
        // Третий вопрос про то, где логарифм существует: там полоса.
        fig={(round) => (
          <Scene
            fig={round === 2
              ? <DomainBand step={1} from={0} lo={-3} hi={9} ticks={[-2, 0, 2, 4, 6, 8]} />
              : <Plane step={1} curve="exp" show="none" level={8} {...WIN} />}
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
