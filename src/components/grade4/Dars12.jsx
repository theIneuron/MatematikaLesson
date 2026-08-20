// ============================================================================
// 4-SINF · Dars 12 · Ko'p xonali sonni bir xonali songa bo'lish
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", 5-nashr 2020, 71-74-betlar.
// Asosiy misol 19284 : 6 = 3214 (72-bet, 6-mashq), bo'lish rejasi 72-bet 1-mashq,
// bo'linmadagi raqamlar soni haqidagi qoida 74-bet, uchta o'quvchi va 45054 : 9
// 73-74-bet, noto'g'ri tengliklar 74-bet 2-mashq.
//
// Syujet: Lumo City taqsimot ombori (SYUJET_4SINF.md, 2-blok).
// Ritm: qisqa tushuntirish -> misol -> yana tushuntirish -> misol.
// Baholanadigan oltita ekran: s2, s4, s6, s8, s10, s13.
// Infratuzilma `kit/` dan import qilinadi (CLAUDE.md §5).
// ============================================================================
import {
  ChoiceScreen, DivisionColumn, FitSvg, KIT_STYLES, NumPadScreen, QuotientLengthFigure,
  RevealScreen, SpanSelect, SummaryScreen, T, TheoryLessonRoot,
  assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'div1-4-12-v2',
  slug: 'dars12-kop-xonali-sonni-bir-xonali-songa-bolish',
  lessonTitle: {
    uz: "12-dars. Ko'p xonali sonni bir xonali songa bo'lish",
    ru: 'Урок 12. Деление многозначного числа на однозначное',
    en: 'Lesson 12. Dividing a multi-digit number by a single-digit number',
  },
  skillTags: ['long_division', 'partial_dividend', 'quotient_length', 'internal_zero', 'checking'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', scored: false, scope: null },
  { id: 's2', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's3', type: 'exploration', scored: false, scope: null },
  { id: 's4', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's5', type: 'exploration', scored: false, scope: null },
  { id: 's6', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's7', type: 'exploration', scored: false, scope: null },
  { id: 's8', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'exploration', scored: false, scope: null },
  { id: 's10', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'rule', scored: false, scope: null },
  { id: 's12', type: 'strategy', scored: false, scope: null },
  { id: 's13', type: 'error-analysis', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'life-case', scored: false, scope: 'final' },
  { id: 's15', type: 'summary', scored: false, scope: null },
];

const TOTAL_SCREENS = SCREEN_META.length;
assertScreenTypeLabels(SCREEN_META, LESSON_META.lessonId);

const FRAME_COUNTS = [5, 4, 3, 4, 3, 5, 3, 4, 3, 4, 3, 5, 3, 3, 3, 3];

// Asosiy misolning qadamlari: 19284 : 6 = 3214
const MAIN_STEPS = [
  { bring: '19', sub: '18', rest: '1', digit: '3' },
  { bring: '12', sub: '12', rest: '0', digit: '2' },
  { bring: '8', sub: '6', rest: '2', digit: '1' },
  { bring: '24', sub: '24', rest: '0', digit: '4' },
];

// Nolli bo'linma: 45054 : 9 = 5006
const ZERO_STEPS = [
  { bring: '45', sub: '45', rest: '0', digit: '5' },
  { bring: '0', sub: '0', rest: '0', digit: '0' },
  { bring: '5', sub: '0', rest: '5', digit: '0' },
  { bring: '54', sub: '54', rest: '0', digit: '6' },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: 'Taqsimot ombori', ru: 'Распределительный склад', en: 'The distribution warehouse' },
    title: {
      uz: "Bo'lishni qaysi raqamdan boshlaymiz?",
      ru: 'С какой цифры начинаем деление?',
      en: 'Which digit do we start the division from?',
    },
    question: {
      uz: "19284 ni 6 ga bo'lishda birinchi qadam qanday?",
      ru: 'Каким будет первый шаг при делении 19284 на 6?',
      en: 'What is the first step in dividing 19284 by 6?',
    },
    options: [
      { uz: "Birinchi ikki raqamni birga olamiz", ru: 'Берём первые две цифры вместе', en: 'We take the first two digits together' },
      { uz: "Birinchi raqamni yolg'iz olamiz", ru: 'Берём первую цифру отдельно', en: 'We take the first digit on its own' },
      { uz: "Oxirgi raqamdan boshlaymiz", ru: 'Начинаем с последней цифры', en: 'We start from the last digit' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Bir birlikni oltiga bo'lib bo'lmaydi, shuning uchun o'n to'qqizni birga olamiz.",
      ru: 'Верно. Одну единицу на шесть не разделить, поэтому берём девятнадцать целиком.',
      en: 'Correct. One unit cannot be divided by six, so we take nineteen as a whole.',
    },
    wrong: [
      null,
      {
        uz: "Birinchi raqam bir. Bir oltidan kichik, shuning uchun uni yolg'iz bo'lib bo'lmaydi.",
        ru: 'Первая цифра единица. Один меньше шести, поэтому отдельно его не разделить.',
        en: 'The first digit is one. One is less than six, so it cannot be divided on its own.',
      },
      {
        uz: "Yozma bo'lishda hisob eng katta xonadan, ya'ni chapdan boshlanadi.",
        ru: 'В письменном делении счёт начинается со старшего разряда, то есть слева.',
        en: 'In written division the count starts from the highest place, that is, from the left.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Salom! Lumo City taqsimot omborida bugun katta yuk keldi.",
          "Omborga o'n to'qqiz ming ikki yuz sakson to'rt kilogramm yuk tushdi. Uni oltita smenaga teng bo'lish kerak.",
          "Bit yozma bo'lishni boshladi va darrov to'xtab qoldi: birinchi raqam bir, uni oltiga bo'lib bo'lmaydi.",
          "Bu yerda hech qanday xato yo'q. Shunchaki bitta raqam yetmaydi.",
          "Sizningcha, birinchi qadam qanday bo'lishi kerak? Javobni tanlang.",
        ],
        ru: [
          'Привет! На распределительный склад Lumo City сегодня пришёл большой груз.',
          'На склад поступило девятнадцать тысяч двести восемьдесят четыре килограмма груза. Его нужно разделить поровну между шестью сменами.',
          'Bit начал письменное деление и сразу остановился: первая цифра единица, её на шесть не разделить.',
          'Здесь нет никакой ошибки. Просто одной цифры не хватает.',
          'Как ты думаешь, каким должен быть первый шаг? Выбери ответ.',
        ],
        en: [
          'Hello! A large delivery arrived at the Lumo City distribution warehouse today.',
          'Nineteen thousand two hundred and eighty-four kilograms of cargo came in. It has to be shared equally between six shifts.',
          'Bit started the written division and stopped at once: the first digit is one, and one cannot be divided by six.',
          'There is no mistake here. One digit is simply not enough.',
          'What do you think the first step should be? Choose your answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Tayanch', ru: 'Опора', en: 'What you know' },
    title: {
      uz: "Bo'lish va qoldiq",
      ru: 'Деление и остаток',
      en: 'Division and the remainder',
    },
    lead: {
      uz: "Qoldiq har doim bo'luvchidan kichik bo'lishi kerak. Aks holda bo'linma raqami kichik olingan.",
      ru: 'Остаток всегда должен быть меньше делителя. Иначе цифра частного взята слишком маленькой.',
      en: 'The remainder must always be smaller than the divisor. Otherwise the quotient digit was taken too small.',
    },
    note: {
      uz: "Shu ikki qadam yozma bo'lishning har bosqichida takrorlanadi.",
      ru: 'Эти два шага повторяются на каждом этапе письменного деления.',
      en: 'These two steps repeat at every stage of written division.',
    },
    audio: {
      intro: {
        uz: [
          "Yangi usulni boshlashdan oldin ikkita tanish qadamni tiklaymiz.",
          "O'n to'qqizni oltiga bo'lamiz. Uch marta olti o'n sakkiz bo'ladi, qoldiq bir.",
          "Qoldiq bir oltidan kichik. Demak bo'linma raqami to'g'ri tanlangan.",
          "Agar qoldiq bo'luvchidan katta yoki teng chiqsa, bo'linma raqamini kattalashtirish kerak. Shu tekshiruv butun dars davomida ishlaydi.",
        ],
        ru: [
          'Прежде чем взяться за новый способ, восстановим два знакомых шага.',
          'Разделим девятнадцать на шесть. Трижды шесть будет восемнадцать, остаток один.',
          'Остаток один меньше шести. Значит, цифра частного выбрана верно.',
          'Если остаток окажется больше делителя или равен ему, цифру частного надо увеличить. Эта проверка работает весь урок.',
        ],
        en: [
          'Before we take on the new method, let us bring back two familiar steps.',
          'Divide nineteen by six. Three times six is eighteen, and the remainder is one.',
          'The remainder one is smaller than six, so the quotient digit was chosen correctly.',
          'If the remainder comes out larger than the divisor or equal to it, the quotient digit must be increased. This check works all lesson long.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: "To'liqsiz bo'linuvchi", ru: 'Неполное делимое', en: 'The partial dividend' },
    title: { uz: '19284 : 6', ru: '19284 : 6', en: '19284 : 6' },
    question: {
      uz: "Birinchi to'liqsiz bo'linuvchi qaysi raqamda tugaydi? Shu raqamni bosing.",
      ru: 'На какой цифре заканчивается первое неполное делимое? Нажми эту цифру.',
      en: 'At which digit does the first partial dividend end? Tap that digit.',
    },
    digits: '19284',
    divisor: '6',
    correctEnd: 1,
    correctText: {
      uz: "To'g'ri. Birinchi to'liqsiz bo'linuvchi o'n to'qqiz. U oltidan katta, demak bo'lish shu yerdan boshlanadi.",
      ru: 'Верно. Первое неполное делимое девятнадцать. Оно больше шести, значит деление начинается отсюда.',
      en: 'Correct. The first partial dividend is nineteen. It is larger than six, so the division starts here.',
    },
    wrong: [
      {
        uz: "Bitta raqam bir. Bir oltidan kichik, shuning uchun bo'lishni boshlab bo'lmaydi.",
        ru: 'Одна цифра это единица. Один меньше шести, поэтому деление начать нельзя.',
        en: 'A single digit is one. One is less than six, so the division cannot start.',
      },
      null,
      {
        uz: "Bu uchta raqam, ya'ni bir yuz to'qson ikki. Lekin o'n to'qqiz allaqachon oltidan katta, shuning uchun ortiqcha raqam olindi.",
        ru: 'Это три цифры, то есть сто девяносто два. Но девятнадцать уже больше шести, значит взята лишняя цифра.',
        en: 'These are three digits, that is one hundred and ninety-two. But nineteen is already larger than six, so an extra digit was taken.',
      },
      {
        uz: "To'liqsiz bo'linuvchi bo'luvchidan katta bo'lgan eng qisqa bo'lak bo'ladi. Bu yerda u o'n to'qqiz.",
        ru: 'Неполное делимое это самая короткая часть, которая больше делителя. Здесь это девятнадцать.',
        en: 'The partial dividend is the shortest part that is larger than the divisor. Here it is nineteen.',
      },
      {
        uz: "Butun sonni birdaniga olib bo'lmaydi: yozma bo'lish qadamma-qadam bajariladi.",
        ru: 'Всё число сразу взять нельзя: письменное деление выполняется шаг за шагом.',
        en: 'The whole number cannot be taken at once: written division is carried out step by step.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Endi o'zingiz ko'rsating. Ekranda o'n to'qqiz ming ikki yuz sakson to'rt soni turibdi.",
          "Chapdan boshlab, oltidan katta bo'lgan eng qisqa bo'lakni toping.",
          "O'sha bo'lakning oxirgi raqamini bosing.",
        ],
        ru: [
          'Теперь покажи сам. На экране число девятнадцать тысяч двести восемьдесят четыре.',
          'Начиная слева, найди самую короткую часть, которая больше шести.',
          'Нажми последнюю цифру этой части.',
        ],
        en: [
          'Now show it yourself. On the screen is the number nineteen thousand two hundred and eighty-four.',
          'Starting from the left, find the shortest part that is larger than six.',
          'Tap the last digit of that part.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: "Bo'linma uzunligi", ru: 'Длина частного', en: 'The length of the quotient' },
    title: {
      uz: "Bo'linmada nechta raqam bo'lishini oldindan bilamiz",
      ru: 'Мы заранее знаем, сколько цифр будет в частном',
      en: 'We know in advance how many digits the quotient will have',
    },
    lead: {
      uz: "To'liqsiz bo'linuvchidan keyingi har bir raqam bo'linmaga bittadan raqam qo'shadi.",
      ru: 'Каждая цифра после неполного делимого добавляет частному одну цифру.',
      en: 'Each digit after the partial dividend adds one digit to the quotient.',
    },
    note: {
      uz: "Darslik, 74-bet: bu tekshiruv xatolikning oldini oladi.",
      ru: 'Учебник, страница 74: эта проверка предупреждает ошибку.',
      en: 'Textbook, page 74: this check prevents an error.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikning yetmish to'rtinchi betida foydali maslahat bor.",
          "Bo'lishni boshlashdan oldin bo'linmada nechta raqam bo'lishini aniqlab olish kerak.",
          "Birinchi to'liqsiz bo'linuvchi bitta raqam beradi. Undan keyin qolgan har bir raqam yana bittadan raqam qo'shadi.",
          "O'n to'qqiz ming ikki yuz sakson to'rtda beshta raqam bor, birinchi bo'lak ikkitasini oldi. Demak bo'linmada to'rtta raqam bo'ladi.",
        ],
        ru: [
          'На семьдесят четвёртой странице учебника есть полезный совет.',
          'Прежде чем начать деление, стоит определить, сколько цифр будет в частном.',
          'Первое неполное делимое даёт одну цифру. Каждая оставшаяся после него цифра добавляет ещё одну.',
          'В девятнадцати тысячах двухстах восьмидесяти четырёх пять цифр, первая часть взяла две. Значит, в частном будет четыре цифры.',
        ],
        en: [
          'On page seventy-four of the textbook there is a useful piece of advice.',
          'Before starting the division it is worth working out how many digits the quotient will have.',
          'The first partial dividend gives one digit. Each digit left after it adds one more.',
          'Nineteen thousand two hundred and eighty-four has five digits, and the first part took two. So the quotient will have four digits.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Oldindan aniqlash', ru: 'Определяем заранее', en: 'Work it out first' },
    title: { uz: '3295 : 5', ru: '3295 : 5', en: '3295 : 5' },
    question: {
      uz: "Bo'linmada nechta raqam bo'ladi?",
      ru: 'Сколько цифр будет в частном?',
      en: 'How many digits will the quotient have?',
    },
    options: [
      { uz: 'Uchta', ru: 'Три', en: 'Three' },
      { uz: "To'rtta", ru: 'Четыре', en: 'Four' },
      { uz: 'Ikkita', ru: 'Две', en: 'Two' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Uch beshdan kichik, shuning uchun birinchi bo'lak o'ttiz ikki. Qolgan ikkita raqam yana ikkita o'rin beradi, hammasi uchta.",
      ru: 'Верно. Три меньше пяти, поэтому первая часть тридцать два. Оставшиеся две цифры дают ещё два места, всего три.',
      en: 'Correct. Three is less than five, so the first part is thirty-two. The two remaining digits give two more places, three in total.',
    },
    wrong: [
      null,
      {
        uz: "To'rtta raqam bo'linuvchida bor, bo'linmada emas. Birinchi bo'lak ikkita raqamni oladi.",
        ru: 'Четыре цифры есть в делимом, а не в частном. Первая часть забирает две цифры.',
        en: 'Four digits are in the dividend, not in the quotient. The first part takes two digits.',
      },
      {
        uz: "Ikkita kam. To'liqsiz bo'linuvchidan keyin yana ikkita raqam qolgan, ularning har biri o'rin beradi.",
        ru: 'Двух мало. После неполного делимого осталось ещё две цифры, и каждая даёт место.',
        en: 'Two is too few. After the partial dividend two digits are left, and each gives a place.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darslikning yetmish to'rtinchi betidagi beshinchi mashqdan misol olamiz.",
          "Uch ming ikki yuz to'qson beshni beshga bo'lamiz.",
          "Bo'lishni bajarmasdan turib, bo'linmada nechta raqam bo'lishini ayting.",
        ],
        ru: [
          'Возьмём пример из пятого задания на семьдесят четвёртой странице учебника.',
          'Делим три тысячи двести девяносто пять на пять.',
          'Не выполняя деления, скажи, сколько цифр будет в частном.',
        ],
        en: [
          'Let us take an example from task five on page seventy-four of the textbook.',
          'We divide three thousand two hundred and ninety-five by five.',
          'Without doing the division, say how many digits the quotient will have.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Bir qadam sikli', ru: 'Цикл одного шага', en: 'The cycle of one step' },
    title: {
      uz: "Bir qadam to'rt amaldan iborat",
      ru: 'Один шаг состоит из четырёх действий',
      en: 'One step is made of four actions',
    },
    lead: {
      uz: "Bo'lamiz, ko'paytiramiz, ayiramiz, qoldiqni bo'luvchi bilan taqqoslaymiz.",
      ru: 'Делим, умножаем, вычитаем, сравниваем остаток с делителем.',
      en: 'We divide, multiply, subtract and compare the remainder with the divisor.',
    },
    note: {
      uz: "Darslik, 72-bet: shu reja butun bo'lish davomida takrorlanadi.",
      ru: 'Учебник, страница 72: этот план повторяется всё деление.',
      en: 'Textbook, page 72: this plan repeats through the whole division.',
    },
    audio: {
      intro: {
        uz: [
          "Endi bitta qadamni oxirigacha bajaramiz.",
          "Bo'lamiz: o'n to'qqizda olti uch marta bor. Uchni bo'linmaga yozamiz.",
          "Ko'paytiramiz: uchni oltiga ko'paytirsak, o'n sakkiz chiqadi. Uni o'n to'qqizning ostiga yozamiz.",
          "Ayiramiz: o'n to'qqizdan o'n sakkizni ayirsak, bir qoladi.",
          "Taqqoslaymiz: bir oltidan kichik. Qadam to'g'ri bajarildi va keyingisiga o'tamiz.",
        ],
        ru: [
          'Теперь выполним один шаг до конца.',
          'Делим: в девятнадцати шесть содержится три раза. Тройку пишем в частное.',
          'Умножаем: три на шесть будет восемнадцать. Записываем под девятнадцатью.',
          'Вычитаем: из девятнадцати вычтем восемнадцать, останется один.',
          'Сравниваем: один меньше шести. Шаг выполнен верно, переходим к следующему.',
        ],
        en: [
          'Now let us carry one step through to the end.',
          'Divide: six goes into nineteen three times. We write the three in the quotient.',
          'Multiply: three times six is eighteen. We write it under nineteen.',
          'Subtract: nineteen minus eighteen leaves one.',
          'Compare: one is less than six. The step is done correctly and we move to the next one.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Birinchi raqam', ru: 'Первая цифра', en: 'The first digit' },
    title: { uz: '19284 : 6', ru: '19284 : 6', en: '19284 : 6' },
    question: {
      uz: "Bo'linmaning birinchi raqami qaysi?",
      ru: 'Какая первая цифра частного?',
      en: 'What is the first digit of the quotient?',
    },
    options: [
      { uz: '3', ru: '3', en: '3' },
      { uz: '4', ru: '4', en: '4' },
      { uz: '2', ru: '2', en: '2' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Uch marta olti o'n sakkiz, qoldiq bir. Bir oltidan kichik, demak raqam to'g'ri.",
      ru: 'Верно. Трижды шесть восемнадцать, остаток один. Один меньше шести, значит цифра верна.',
      en: 'Correct. Three times six is eighteen, remainder one. One is less than six, so the digit is right.',
    },
    wrong: [
      null,
      {
        uz: "To'rt marta olti yigirma to'rt bo'ladi. Bu o'n to'qqizdan katta, shuning uchun to'rt sig'maydi.",
        ru: 'Четырежды шесть будет двадцать четыре. Это больше девятнадцати, поэтому четыре не подходит.',
        en: 'Four times six is twenty-four. That is more than nineteen, so four does not fit.',
      },
      {
        uz: "Ikki marta olti o'n ikki, qoldiq yetti bo'ladi. Yetti oltidan katta, demak raqam kichik olingan.",
        ru: 'Дважды шесть двенадцать, остаток семь. Семь больше шести, значит цифра взята маленькой.',
        en: 'Two times six is twelve, remainder seven. Seven is larger than six, so the digit was taken too small.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Birinchi to'liqsiz bo'linuvchi topildi: o'n to'qqiz.",
          "Endi bo'linmaning birinchi raqamini toping.",
          "Har bir variantni tekshiring: ko'paytmani o'n to'qqiz bilan solishtiring va qoldiqqa qarang.",
        ],
        ru: [
          'Первое неполное делимое найдено: девятнадцать.',
          'Теперь найди первую цифру частного.',
          'Проверь каждый вариант: сравни произведение с девятнадцатью и посмотри на остаток.',
        ],
        en: [
          'The first partial dividend is found: nineteen.',
          'Now find the first digit of the quotient.',
          'Check each option: compare the product with nineteen and look at the remainder.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Sikl davom etadi', ru: 'Цикл продолжается', en: 'The cycle continues' },
    title: {
      uz: "Keyingi raqam tushiriladi",
      ru: 'Следующая цифра сносится вниз',
      en: 'The next digit is brought down',
    },
    lead: {
      uz: "Qoldiqqa keyingi raqam qo'shiladi va yangi to'liqsiz bo'linuvchi hosil bo'ladi.",
      ru: 'К остатку приписывается следующая цифра и получается новое неполное делимое.',
      en: 'The next digit is written beside the remainder and a new partial dividend appears.',
    },
    note: {
      uz: "Bo'linuvchining raqamlari tugaguncha shu sikl takrorlanadi.",
      ru: 'Цикл повторяется, пока не закончатся цифры делимого.',
      en: 'The cycle repeats until the digits of the dividend run out.',
    },
    audio: {
      intro: {
        uz: [
          "Qoldiq bir edi. Unga keyingi raqam ikkini tushiramiz va o'n ikki hosil bo'ladi.",
          "O'n ikkida olti ikki marta bor, qoldiq nol. Bo'linmaga ikkini yozamiz.",
          "Keyin sakkizni tushiramiz. Sakkizda olti bir marta bor, qoldiq ikki. Bo'linmaga birni yozamiz.",
          "Oxirida to'rtni tushiramiz va yigirma to'rt hosil bo'ladi. Yigirma to'rtda olti to'rt marta bor, qoldiq nol.",
        ],
        ru: [
          'Остаток был один. Сносим следующую цифру два и получаем двенадцать.',
          'В двенадцати шесть содержится два раза, остаток ноль. В частное пишем два.',
          'Дальше сносим восемь. В восьми шесть содержится один раз, остаток два. В частное пишем один.',
          'В конце сносим четыре и получаем двадцать четыре. В двадцати четырёх шесть содержится четыре раза, остаток ноль.',
        ],
        en: [
          'The remainder was one. We bring down the next digit, two, and get twelve.',
          'Six goes into twelve twice, remainder zero. We write two in the quotient.',
          'Then we bring down the eight. Six goes into eight once, remainder two. We write one in the quotient.',
          'At the end we bring down the four and get twenty-four. Six goes into twenty-four four times, remainder zero.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: "To'liq bo'linma", ru: 'Полное частное', en: 'The full quotient' },
    title: { uz: '19284 : 6', ru: '19284 : 6', en: '19284 : 6' },
    question: {
      uz: "Har bir smenaga necha kilogramm yuk tushadi?",
      ru: 'Сколько килограммов груза приходится на каждую смену?',
      en: 'How many kilograms of cargo does each shift get?',
    },
    answer: '3214',
    unit: { uz: 'kg', ru: 'кг', en: 'kg' },
    correctText: {
      uz: "To'g'ri. Har bir smenaga uch ming ikki yuz o'n to'rt kilogramm tushadi. Tekshiramiz: uch ming ikki yuz o'n to'rtni oltiga ko'paytirsak, o'n to'qqiz ming ikki yuz sakson to'rt chiqadi.",
      ru: 'Верно. На каждую смену приходится три тысячи двести четырнадцать килограммов. Проверим: три тысячи двести четырнадцать умножить на шесть будет девятнадцать тысяч двести восемьдесят четыре.',
      en: 'Correct. Each shift gets three thousand two hundred and fourteen kilograms. Let us check: three thousand two hundred and fourteen times six is nineteen thousand two hundred and eighty-four.',
    },
    wrong: {
      uz: "Bo'linmada to'rtta raqam bo'lishi kerak. Har qadamda bitta raqam yozilganini tekshiring.",
      ru: 'В частном должно быть четыре цифры. Проверь, что на каждом шаге записана одна цифра.',
      en: 'The quotient must have four digits. Check that one digit was written at every step.',
    },
    hintAfter: {
      uz: "Qadamlar shunday: o'n to'qqizda olti uch marta, o'n ikkida ikki marta, sakkizda bir marta, yigirma to'rtda to'rt marta.",
      ru: 'Шаги такие: в девятнадцати шесть три раза, в двенадцати два раза, в восьми один раз, в двадцати четырёх четыре раза.',
      en: 'The steps are: six goes into nineteen three times, into twelve twice, into eight once, into twenty-four four times.',
    },
    audio: {
      intro: {
        uz: [
          "Barcha qadamlar ekranda ochilgan.",
          "Endi bo'linmani o'zingiz tering va tasdiqlang.",
          "Har qadamdagi raqamlarni tartib bilan yozing.",
        ],
        ru: [
          'Все шаги открыты на экране.',
          'Теперь набери частное сам и подтверди.',
          'Записывай цифры каждого шага по порядку.',
        ],
        en: [
          'All the steps are open on the screen.',
          'Now type the quotient yourself and confirm it.',
          'Write the digits of each step in order.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: "Bo'linmadagi nol", ru: 'Ноль в частном', en: 'A zero in the quotient' },
    title: {
      uz: "Qoldiq bo'luvchidan kichik bo'lsa, bo'linmaga nol yoziladi",
      ru: 'Если остаток меньше делителя, в частное пишется ноль',
      en: 'If the remainder is smaller than the divisor, a zero goes in the quotient',
    },
    lead: {
      uz: "Nol o'z o'rnini egallaydi. Uni tashlab ketsak, bo'linma o'n marta kichrayib qoladi.",
      ru: 'Ноль занимает своё место. Если его пропустить, частное станет в десять раз меньше.',
      en: 'The zero holds its place. Skip it and the quotient becomes ten times smaller.',
    },
    note: {
      uz: "Har qadamda albatta bitta raqam yoziladi, hatto u nol bo'lsa ham.",
      ru: 'На каждом шаге обязательно пишется одна цифра, даже если это ноль.',
      en: 'One digit is always written at every step, even if it is a zero.',
    },
    audio: {
      intro: {
        uz: [
          "Endi maxsus holatga qaraymiz. Qirq besh ming ellik to'rtni to'qqizga bo'lamiz.",
          "Qirq beshda to'qqiz besh marta bor, qoldiq nol. Keyin nolni tushiramiz.",
          "Nolda to'qqiz nol marta bor. Shuning uchun bo'linmaga nol yoziladi va keyingi raqam tushiriladi.",
          "Beshda ham to'qqiz nol marta bor, yana nol yoziladi. Oxirida ellik to'rtda to'qqiz olti marta bor. Bo'linma besh ming olti.",
        ],
        ru: [
          'Теперь разберём особый случай. Разделим сорок пять тысяч пятьдесят четыре на девять.',
          'В сорока пяти девять содержится пять раз, остаток ноль. Затем сносим ноль.',
          'В нуле девять содержится ноль раз. Поэтому в частное пишем ноль и сносим следующую цифру.',
          'В пяти девять тоже содержится ноль раз, пишем ещё ноль. В конце в пятидесяти четырёх девять содержится шесть раз. Частное пять тысяч шесть.',
        ],
        en: [
          'Now let us look at a special case. We divide forty-five thousand and fifty-four by nine.',
          'Nine goes into forty-five five times, remainder zero. Then we bring down the zero.',
          'Nine goes into zero zero times. So a zero goes in the quotient and the next digit is brought down.',
          'Nine goes into five zero times as well, so another zero is written. At the end nine goes into fifty-four six times. The quotient is five thousand and six.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Uch xil javob', ru: 'Три разных ответа', en: 'Three different answers' },
    title: { uz: '45054 : 9', ru: '45054 : 9', en: '45054 : 9' },
    question: {
      uz: "Uch o'quvchi uch xil javob oldi. Qaysi biri to'g'ri?",
      ru: 'Три ученика получили три разных ответа. Какой из них верный?',
      en: 'Three pupils got three different answers. Which one is right?',
    },
    options: [
      { uz: '5006', ru: '5006', en: '5006' },
      { uz: '506', ru: '506', en: '506' },
      { uz: '56', ru: '56', en: '56' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Besh ming oltini to'qqizga ko'paytirsak, qirq besh ming ellik to'rt chiqadi.",
      ru: 'Верно. Пять тысяч шесть умножить на девять будет сорок пять тысяч пятьдесят четыре.',
      en: 'Correct. Five thousand and six times nine is forty-five thousand and fifty-four.',
    },
    wrong: [
      null,
      {
        uz: "Bu yerda bitta nol tushib qolgan. Bo'linmada to'rtta raqam bo'lishi kerak edi, chunki birinchi bo'lak ikkita raqamni oldi.",
        ru: 'Здесь потерян один ноль. В частном должно быть четыре цифры, ведь первая часть взяла две цифры.',
        en: 'One zero has been lost here. The quotient should have four digits, because the first part took two digits.',
      },
      {
        uz: "Bu yerda ikkala nol ham tushib qolgan. Ellik oltini to'qqizga ko'paytirsak, atigi besh yuz to'rt chiqadi.",
        ru: 'Здесь потеряны оба нуля. Пятьдесят шесть умножить на девять будет всего пятьсот четыре.',
        en: 'Both zeros have been lost here. Fifty-six times nine is only five hundred and four.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darslikning yetmish uchinchi betida qiziq vazifa bor.",
          "Uch o'quvchi qirq besh ming ellik to'rtni to'qqizga bo'ldi va uch xil javob oldi.",
          "Kim to'g'ri yechganini toping. Har bir javobni to'qqizga ko'paytirib tekshirish mumkin.",
        ],
        ru: [
          'На семьдесят третьей странице учебника есть интересное задание.',
          'Три ученика разделили сорок пять тысяч пятьдесят четыре на девять и получили три разных ответа.',
          'Найди, кто решил верно. Каждый ответ можно проверить умножением на девять.',
        ],
        en: [
          'On page seventy-three of the textbook there is an interesting task.',
          'Three pupils divided forty-five thousand and fifty-four by nine and got three different answers.',
          'Find who solved it correctly. Each answer can be checked by multiplying by nine.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Darslik rejasi', ru: 'План учебника', en: 'The textbook plan' },
    title: {
      uz: "Yozma bo'lish rejasi",
      ru: 'План письменного деления',
      en: 'The plan for written division',
    },
    lead: {
      uz: "Darslikning 72-betidagi olti qadam.",
      ru: 'Шесть шагов со страницы 72 учебника.',
      en: 'The six steps from page 72 of the textbook.',
    },
    note: {
      uz: "Natijani teskari amal bilan tekshirish mumkin: bo'linmani bo'luvchiga ko'paytiramiz.",
      ru: 'Результат можно проверить обратным действием: умножить частное на делитель.',
      en: 'The result can be checked by the inverse action: multiply the quotient by the divisor.',
    },
    audio: {
      intro: {
        uz: [
          "Ochganimizni qoida qilib yig'amiz.",
          "Birinchi qadam: birinchi to'liqsiz bo'linuvchini topaman. Ikkinchi qadam: bo'laman va bo'linma raqamini yozaman.",
          "Uchinchi qadam: ko'paytiraman. To'rtinchi qadam: ayiraman.",
          "Beshinchi qadam: qoldiqni bo'luvchi bilan taqqoslayman. Oltinchi qadam: keyingi to'liqsiz bo'linuvchini hosil qilaman.",
          "Oxirida javobni tekshiraman: bo'linmani bo'luvchiga ko'paytirsam, bo'linuvchi chiqishi kerak.",
        ],
        ru: [
          'Соберём открытое в правило.',
          'Первый шаг: нахожу первое неполное делимое. Второй шаг: делю и пишу цифру частного.',
          'Третий шаг: умножаю. Четвёртый шаг: вычитаю.',
          'Пятый шаг: сравниваю остаток с делителем. Шестой шаг: образую следующее неполное делимое.',
          'В конце проверяю ответ: если умножить частное на делитель, должно получиться делимое.',
        ],
        en: [
          'Let us gather what we found into a rule.',
          'Step one: I find the first partial dividend. Step two: I divide and write the quotient digit.',
          'Step three: I multiply. Step four: I subtract.',
          'Step five: I compare the remainder with the divisor. Step six: I form the next partial dividend.',
          'At the end I check the answer: multiplying the quotient by the divisor should give the dividend.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: 'Hisoblamasdan', ru: 'Без вычисления', en: 'Without calculating' },
    title: { uz: '90470 : 5', ru: '90470 : 5', en: '90470 : 5' },
    question: {
      uz: "Bo'linmada nechta raqam bo'lishini hisoblamasdan ayting.",
      ru: 'Скажи, не вычисляя, сколько цифр будет в частном.',
      en: 'Say how many digits the quotient will have, without calculating.',
    },
    options: [
      { uz: 'Beshta', ru: 'Пять', en: 'Five' },
      { uz: "To'rtta", ru: 'Четыре', en: 'Four' },
      { uz: 'Oltita', ru: 'Шесть', en: 'Six' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. To'qqiz beshdan katta, shuning uchun birinchi bo'lak bitta raqamdan iborat. Qolgan to'rtta raqam yana to'rtta o'rin beradi, hammasi beshta.",
      ru: 'Верно. Девять больше пяти, поэтому первая часть состоит из одной цифры. Оставшиеся четыре цифры дают ещё четыре места, всего пять.',
      en: 'Correct. Nine is larger than five, so the first part is a single digit. The remaining four digits give four more places, five in total.',
    },
    wrong: [
      null,
      {
        uz: "To'rtta kam. Birinchi bo'lak bitta raqam olgani uchun bo'linma bir raqamga uzunroq bo'ladi.",
        ru: 'Четырёх мало. Первая часть взяла одну цифру, поэтому частное длиннее на один разряд.',
        en: 'Four is too few. The first part took one digit, so the quotient is one place longer.',
      },
      {
        uz: "Oltita ko'p. Bo'linuvchida beshta raqam bor, bo'linma undan uzun bo'la olmaydi.",
        ru: 'Шести много. В делимом пять цифр, частное не может быть длиннее.',
        en: 'Six is too many. The dividend has five digits, and the quotient cannot be longer.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darslikning yetmish to'rtinchi betida shunday tenglik bor edi: to'qson ming to'rt yuz yetmishni beshga bo'lsak, bir ming sakkiz yuz to'qson to'rt chiqadi.",
          "Uni tekshirish uchun butun bo'lishni bajarish shart emas.",
          "Faqat bo'linmada nechta raqam bo'lishini sanang va javobni tanlang.",
        ],
        ru: [
          'На семьдесят четвёртой странице учебника было такое равенство: девяносто тысяч четыреста семьдесят разделить на пять будет тысяча восемьсот девяносто четыре.',
          'Чтобы его проверить, необязательно выполнять всё деление.',
          'Просто сосчитай, сколько цифр будет в частном, и выбери ответ.',
        ],
        en: [
          'On page seventy-four of the textbook there was this equality: ninety thousand four hundred and seventy divided by five is one thousand eight hundred and ninety-four.',
          'To check it you do not have to do the whole division.',
          'Just count how many digits the quotient will have and choose your answer.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: 'Uchta tenglik', ru: 'Три равенства', en: 'Three equalities' },
    title: {
      uz: "Qaysi tenglik noto'g'ri?",
      ru: 'Какое равенство неверно?',
      en: 'Which equality is wrong?',
    },
    question: {
      uz: "Yechmasdan turib, noto'g'ri tenglikni toping.",
      ru: 'Не решая, найди неверное равенство.',
      en: 'Without solving, find the wrong equality.',
    },
    options: [
      { uz: '35133 : 7 = 5199', ru: '35133 : 7 = 5199', en: '35133 : 7 = 5199' },
      { uz: '63126 : 7 = 9018', ru: '63126 : 7 = 9018', en: '63126 : 7 = 9018' },
      { uz: '50600 : 8 = 6325', ru: '50600 : 8 = 6325', en: '50600 : 8 = 6325' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Besh ming bir yuz to'qson to'qqizni yettiga ko'paytirsak, o'ttiz olti ming uch yuz to'qson uch chiqadi. To'g'ri javob besh ming o'n to'qqiz.",
      ru: 'Верно. Пять тысяч сто девяносто девять умножить на семь будет тридцать шесть тысяч триста девяносто три. Правильный ответ пять тысяч девятнадцать.',
      en: 'Correct. Five thousand one hundred and ninety-nine times seven is thirty-six thousand three hundred and ninety-three. The right answer is five thousand and nineteen.',
    },
    wrong: [
      null,
      {
        uz: "Bu tenglik to'g'ri: to'qqiz ming o'n sakkizni yettiga ko'paytirsak, oltmish uch ming bir yuz yigirma olti chiqadi.",
        ru: 'Это равенство верное: девять тысяч восемнадцать умножить на семь будет шестьдесят три тысячи сто двадцать шесть.',
        en: 'This equality is right: nine thousand and eighteen times seven is sixty-three thousand one hundred and twenty-six.',
      },
      {
        uz: "Bu tenglik ham to'g'ri: olti ming uch yuz yigirma beshni sakkizga ko'paytirsak, ellik ming olti yuz chiqadi.",
        ru: 'Это равенство тоже верное: шесть тысяч триста двадцать пять умножить на восемь будет пятьдесят тысяч шестьсот.',
        en: 'This equality is right too: six thousand three hundred and twenty-five times eight is fifty thousand six hundred.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Bit darslikning yetmish to'rtinchi betidagi ikkinchi mashqni ishladi.",
          "Uchta tenglikdan bittasi noto'g'ri, lekin Bit qaysi biri ekanini topa olmadi.",
          "Har bir bo'linmada nechta raqam bo'lishi kerakligini o'ylang va noto'g'risini toping.",
        ],
        ru: [
          'Bit решил второе задание с семьдесят четвёртой страницы учебника.',
          'Одно из трёх равенств неверно, но Bit не смог понять, какое именно.',
          'Подумай, сколько цифр должно быть в каждом частном, и найди неверное.',
        ],
        en: [
          'Bit worked on task two from page seventy-four of the textbook.',
          'One of the three equalities is wrong, but Bit could not tell which one.',
          'Think how many digits each quotient should have and find the wrong one.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: "The city's decision" },
    title: {
      uz: 'Ikkinchi ombor uchun hisob',
      ru: 'Расчёт для второго склада',
      en: 'The calculation for the second warehouse',
    },
    question: {
      uz: "25016 kg yuk 4 smenaga bo'linsa, har biriga qancha tushadi?",
      ru: 'Если 25016 кг груза разделить на 4 смены, сколько придётся на каждую?',
      en: 'If 25016 kg of cargo is shared between 4 shifts, how much does each get?',
    },
    options: [
      { uz: '6254 kg', ru: '6254 кг', en: '6254 kg' },
      { uz: '654 kg', ru: '654 кг', en: '654 kg' },
      { uz: '62054 kg', ru: '62054 кг', en: '62054 kg' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Olti ming ikki yuz ellik to'rtni to'rtga ko'paytirsak, yigirma besh ming o'n olti chiqadi. Ombor ishlashga tayyor.",
      ru: 'Верно. Шесть тысяч двести пятьдесят четыре умножить на четыре будет двадцать пять тысяч шестнадцать. Склад готов к работе.',
      en: 'Correct. Six thousand two hundred and fifty-four times four is twenty-five thousand and sixteen. The warehouse is ready to work.',
    },
    wrong: [
      null,
      {
        uz: "Bu yerda bitta raqam tushib qolgan. Ikki beshdan kichik, demak birinchi bo'lak yigirma besh va bo'linmada to'rtta raqam bo'ladi.",
        ru: 'Здесь потеряна одна цифра. Два меньше пяти, значит первая часть двадцать пять и в частном четыре цифры.',
        en: 'One digit is missing here. Two is less than five, so the first part is twenty-five and the quotient has four digits.',
      },
      {
        uz: "Bu yerda ortiqcha raqam bor. Bo'linmada to'rtta raqam bo'lishi kerak, beshta emas.",
        ru: 'Здесь лишняя цифра. В частном должно быть четыре цифры, а не пять.',
        en: 'There is an extra digit here. The quotient should have four digits, not five.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Omborda ikkinchi yuk ham bor: yigirma besh ming o'n olti kilogramm.",
          "Uni to'rtta smenaga teng bo'lish kerak.",
          "Bo'linmada nechta raqam bo'lishini aniqlang va to'g'ri javobni tanlang.",
        ],
        ru: [
          'На складе есть и второй груз: двадцать пять тысяч шестнадцать килограммов.',
          'Его нужно разделить поровну между четырьмя сменами.',
          'Определи, сколько цифр будет в частном, и выбери верный ответ.',
        ],
        en: [
          'There is a second load in the warehouse too: twenty-five thousand and sixteen kilograms.',
          'It has to be shared equally between four shifts.',
          'Work out how many digits the quotient will have and choose the right answer.',
        ],
      },
    },
  },

  s15: {
    eyebrow: { uz: 'Missiya mukofoti', ru: 'Награда за миссию', en: 'Mission award' },
    stageLabel: { uz: 'Yakuniy bosqich', ru: 'Финальный этап', en: 'Final stage' },
    headTitle: {
      uz: 'Unvongacha bitta savol',
      ru: 'Один вопрос до звания',
      en: 'One question before your title',
    },
    headLead: {
      uz: "Qoldiq haqidagi qoidani ayting va unvonni oling.",
      ru: 'Назови правило про остаток и получи звание.',
      en: 'Name the rule about the remainder and claim your title.',
    },
    questionKicker: { uz: 'Yakuniy savol', ru: 'Финальный вопрос', en: 'Final question' },
    stepLabel: { uz: '1 qadam', ru: '1 шаг', en: '1 step' },
    reflectionQuestion: {
      uz: "Qoldiq qanday bo'lishi kerak?",
      ru: 'Каким должен быть остаток?',
      en: 'What must the remainder be like?',
    },
    reflectionStart: {
      uz: "Har qadamdan keyin qoldiq…",
      ru: 'После каждого шага остаток…',
      en: 'After each step the remainder…',
    },
    reflectionOptions: [
      { uz: "bo'luvchidan kichik bo'ladi", ru: 'меньше делителя', en: 'is smaller than the divisor' },
      { uz: "bo'luvchidan katta bo'ladi", ru: 'больше делителя', en: 'is larger than the divisor' },
      { uz: "har doim nolga teng bo'ladi", ru: 'всегда равен нулю', en: 'is always zero' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "To'g'ri. Qoldiq bo'luvchidan kichik bo'lsa, bo'linma raqami to'g'ri tanlangan.",
      ru: 'Верно. Если остаток меньше делителя, цифра частного выбрана правильно.',
      en: 'Correct. If the remainder is smaller than the divisor, the quotient digit was chosen correctly.',
    },
    reflectionWrong: {
      uz: "Qoldiq bo'luvchidan katta bo'lsa, bo'linma raqamini kattalashtirish kerak edi. Nol esa faqat ba'zan chiqadi.",
      ru: 'Если остаток больше делителя, цифру частного надо было увеличить. А ноль получается лишь иногда.',
      en: 'If the remainder is larger than the divisor, the quotient digit should have been increased. And a zero comes out only sometimes.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    awards: [
      { min: 5, title: { uz: 'Taqsimot ustasi', ru: 'Мастер распределения', en: 'Master of sharing' } },
      { min: 3, title: { uz: "Bo'lish muhandisi", ru: 'Инженер деления', en: 'Division engineer' } },
      { min: 0, title: { uz: 'Ombor yordamchisi', ru: 'Помощник склада', en: 'Warehouse assistant' } },
    ],
    mainLabel: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
    main: [
      {
        uz: "Birinchi to'liqsiz bo'linuvchi bo'luvchidan katta bo'ladi.",
        ru: 'Первое неполное делимое больше делителя.',
        en: 'The first partial dividend is larger than the divisor.',
      },
      {
        uz: "Undan keyingi har raqam bo'linmaga bitta o'rin qo'shadi.",
        ru: 'Каждая цифра после него добавляет частному одно место.',
        en: 'Each digit after it adds one place to the quotient.',
      },
      {
        uz: "Har qadamda bitta raqam yoziladi, hatto nol bo'lsa ham.",
        ru: 'На каждом шаге пишется одна цифра, даже если это ноль.',
        en: 'One digit is written at every step, even if it is a zero.',
      },
      {
        uz: "Qoldiq bo'luvchidan kichik bo'lishi shart.",
        ru: 'Остаток обязан быть меньше делителя.',
        en: 'The remainder must be smaller than the divisor.',
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Yukni ikki xonali songa bo'lish: bo'linma raqamini sinash bilan tanlash.",
      ru: 'Разделить груз на двузначное число: подбирать цифру частного пробой.',
      en: 'Divide the load by a two-digit number: choosing the quotient digit by trial.',
    },
    audio: {
      intro: {
        uz: [
          "Missiya bajarildi. Yuk oltita smenaga teng bo'lindi va ombor ishga tushdi.",
          "Bugun siz yozma bo'lishni o'rgandingiz: birinchi to'liqsiz bo'linuvchini topish, qadam siklini bajarish va bo'linmadagi nolni saqlash.",
          "Unvonni ochish uchun bitta savol qoldi. Qoldiq qanday bo'lishi kerakligini tanlang.",
        ],
        ru: [
          'Миссия выполнена. Груз разделён поровну между шестью сменами, склад заработал.',
          'Теперь ты умеешь делить письменно. Находить первое неполное делимое, повторять один и тот же шаг и сохранять ноль в частном.',
          'До звания остался один вопрос. Выбери, каким должен быть остаток.',
        ],
        en: [
          'Mission complete. The cargo is shared equally between six shifts and the warehouse is running.',
          'Today you learned written division: finding the first partial dividend, running the step cycle and keeping the zero in the quotient.',
          'One question stands between you and the title. Choose what the remainder must be like.',
        ],
      },
    },
  },
};

// ===========================================================================
// CHIZMALAR — ombor sahnasi va mavzuga xos yordamchi chizmalar
// ===========================================================================

const WarehouseDefs = () => (
  <defs>
    <linearGradient id="d12sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#0B2032" />
      <stop offset="100%" stopColor="#1A4459" />
    </linearGradient>
    <linearGradient id="d12wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1D4759" />
      <stop offset="100%" stopColor="#102B3D" />
    </linearGradient>
    <linearGradient id="d12crate" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stopColor="#C98F4E" />
      <stop offset="55%" stopColor="#A9723A" />
      <stop offset="100%" stopColor="#7E5326" />
    </linearGradient>
    <linearGradient id="d12steel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#B9C6CF" />
      <stop offset="100%" stopColor="#78868F" />
    </linearGradient>
  </defs>
);

// Yog'och yuk qutisi: taxta chizig'i, metall burchak, soya.
const Crate = ({ x, y, w, h, dim = false }) => (
  <g opacity={dim ? 0.35 : 1}>
    <rect x={x} y={y} width={w} height={h} rx="2" fill="url(#d12crate)" />
    <rect x={x} y={y + h * 0.42} width={w} height={h * 0.1} fill="#8A5D2C" opacity="0.7" />
    <rect x={x} y={y} width={w} height={h} rx="2" fill="none" stroke="#6B451F" strokeWidth="1" />
    <rect x={x + 1} y={y + 1} width={w * 0.16} height={h - 2} fill="#FFFFFF" opacity="0.08" />
  </g>
);

const WarehouseScene = ({ solved = false, mode = 'hook' }) => {
  const t = useT();
  const done = mode === 'final' || solved;
  const bays = [0, 1, 2, 3, 4, 5];
  return (
    <div className="hero-scene">
      <div className="hero-head">
        <span>
          {t({
            uz: 'LUMO CITY · TAQSIMOT OMBORI',
            ru: 'LUMO CITY · РАСПРЕДЕЛИТЕЛЬНЫЙ СКЛАД',
            en: 'LUMO CITY · DISTRIBUTION WAREHOUSE',
          })}
        </span>
        <span className={done ? 'hero-state' : 'hero-state hero-state-alert'}>
          {done ? '6 × 3214 kg' : '19 284 kg'}
        </span>
      </div>
      <div className="hero-body">
        <FitSvg viewBox="0 0 560 250">
          <WarehouseDefs />
          <rect x="0" y="0" width="560" height="250" rx="16" fill="url(#d12sky)" />
          {/* ombor devori va tomi */}
          <path d="M60 210 L60 74 L500 74 L500 210 Z" fill="url(#d12wall)" />
          <path d="M48 74 L280 40 L512 74 Z" fill="#25596F" />
          <rect x="60" y="70" width="440" height="5" fill="#3E8199" opacity="0.6" />
          {/* stellajlar */}
          {[0, 1].map((r) => (
            <g key={`shelf-${r}`}>
              <rect x="78" y={96 + r * 44} width="404" height="4" fill="url(#d12steel)" />
              {Array.from({ length: 9 }, (_, i) => (
                <Crate key={i} x={82 + i * 45} y={70 + r * 44} w={38} h={26} />
              ))}
            </g>
          ))}
          {/* olti yuklash bo'limi */}
          {bays.map((b) => {
            const x = 74 + b * 72;
            return (
              <g key={`bay-${b}`}>
                <rect x={x} y="176" width="60" height="34" rx="3" fill="#0B2536" stroke="#2F6A86" strokeWidth="1.2" />
                {done && <Crate x={x + 6} y={182} w={48} h={22} />}
                <text
                  x={x + 30}
                  y="226"
                  textAnchor="middle"
                  fill={done ? '#B7D77A' : '#7E939F'}
                  fontSize="11"
                  fontWeight="800"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {done ? '3214' : '?'}
                </text>
              </g>
            );
          })}
          <rect x="0" y="236" width="560" height="14" fill="#081926" />
          {!done && (
            <g>
              <rect x="196" y="126" width="168" height="30" rx="10" fill="#4A2114" opacity="0.92" />
              <text x="280" y="146" textAnchor="middle" fill="#FFC0A8" fontSize="14" fontWeight="800" fontFamily="Manrope, sans-serif">
                19 284 : 6 = ?
              </text>
            </g>
          )}
        </FitSvg>
      </div>
    </div>
  );
};

// s1 — qoldiq tekshiruvi
const RemainderFigure = ({ frame = 0 }) => {
  const t = useT();
  const rows = [
    { expr: '19 : 6', product: '3 × 6 = 18', rest: '19 − 18 = 1', ok: true, on: frame >= 2 },
    { expr: '19 : 6', product: '2 × 6 = 12', rest: '19 − 12 = 7', ok: false, on: frame >= 3 },
  ];
  return (
    <FitSvg viewBox="0 0 520 232">
      <text x="260" y="30" textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
        {t({ uz: "Qoldiq bo'luvchidan kichikmi?", ru: 'Меньше ли остаток делителя?', en: 'Is the remainder smaller than the divisor?' })}
      </text>
      {rows.map((row, index) => {
        const y = 56 + index * 78;
        const color = row.ok ? T.success : T.accent;
        return (
          <g key={index} opacity={row.on ? 1 : 0.28} style={{ transition: 'opacity .4s' }}>
            <rect x="40" y={y} width="440" height="60" rx="14" fill="#FFFFFF" stroke={color} strokeWidth="2" />
            <text x="66" y={y + 37} fill={T.ink} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {row.product}
            </text>
            <text x="240" y={y + 37} fill={T.ink2} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {row.rest}
            </text>
            <circle cx="446" cy={y + 30} r="15" fill={row.ok ? T.successSoft : T.accentSoft} />
            <text x="446" y={y + 37} textAnchor="middle" fill={color} fontSize="17" fontWeight="800" fontFamily="Manrope, sans-serif">
              {row.ok ? '✓' : '✕'}
            </text>
          </g>
        );
      })}
      <text x="260" y="222" textAnchor="middle" fill={T.ink3} fontSize="12" fontFamily="Manrope, sans-serif">
        {t({ uz: '1 < 6 · 7 > 6', ru: '1 < 6 · 7 > 6', en: '1 < 6 · 7 > 6' })}
      </text>
    </FitSvg>
  );
};

// s5 — bir qadamning to'rt amali
const CycleFigure = ({ frame = 0 }) => {
  const t = useT();
  const steps = [
    { n: '1', text: { uz: "Bo'lamiz", ru: 'Делим', en: 'Divide' }, value: '19 : 6 → 3', color: T.cyan },
    { n: '2', text: { uz: "Ko'paytiramiz", ru: 'Умножаем', en: 'Multiply' }, value: '3 × 6 = 18', color: T.navy },
    { n: '3', text: { uz: 'Ayiramiz', ru: 'Вычитаем', en: 'Subtract' }, value: '19 − 18 = 1', color: T.accent },
    { n: '4', text: { uz: 'Taqqoslaymiz', ru: 'Сравниваем', en: 'Compare' }, value: '1 < 6', color: T.success },
  ];
  return (
    <FitSvg viewBox="0 0 520 232">
      {steps.map((step, index) => {
        const on = frame >= index + 1 || frame >= steps.length;
        const x = 22 + index * 122;
        return (
          <g key={step.n} opacity={on ? 1 : 0.28} style={{ transition: 'opacity .4s' }}>
            <rect x={x} y="52" width="112" height="112" rx="16" fill="#FFFFFF" stroke={step.color} strokeWidth="2" />
            <circle cx={x + 56} cy="82" r="16" fill={step.color} />
            <text x={x + 56} y="88" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {step.n}
            </text>
            <text x={x + 56} y="118" textAnchor="middle" fill={T.ink} fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
              {t(step.text)}
            </text>
            <text x={x + 56} y="145" textAnchor="middle" fill={T.ink2} fontSize="13" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {step.value}
            </text>
            {index < steps.length - 1 && (
              <path d={`M${x + 116} 108 l8 0`} stroke={T.ink3} strokeWidth="2" />
            )}
          </g>
        );
      })}
      <text x="260" y="204" textAnchor="middle" fill={T.ink3} fontSize="12" fontFamily="Manrope, sans-serif">
        {t({
          uz: "Sikl bo'linuvchining raqamlari tugaguncha takrorlanadi",
          ru: 'Цикл повторяется, пока не кончатся цифры делимого',
          en: 'The cycle repeats until the digits of the dividend run out',
        })}
      </text>
    </FitSvg>
  );
};

// s11 — darslik rejasi
const PlanFigure = ({ frame = 0 }) => {
  const t = useT();
  const steps = [
    { uz: "Birinchi to'liqsiz bo'linuvchini topaman", ru: 'Нахожу первое неполное делимое', en: 'I find the first partial dividend' },
    { uz: "Bo'laman va raqamni yozaman", ru: 'Делю и пишу цифру', en: 'I divide and write the digit' },
    { uz: "Ko'paytiraman", ru: 'Умножаю', en: 'I multiply' },
    { uz: 'Ayiraman', ru: 'Вычитаю', en: 'I subtract' },
    { uz: "Qoldiqni bo'luvchi bilan taqqoslayman", ru: 'Сравниваю остаток с делителем', en: 'I compare the remainder with the divisor' },
    { uz: "Keyingi to'liqsiz bo'linuvchini hosil qilaman", ru: 'Образую следующее неполное делимое', en: 'I form the next partial dividend' },
  ];
  const colors = [T.cyan, T.navy, T.navy, T.accent, T.success, T.cyan];
  return (
    <FitSvg viewBox="0 0 520 232">
      {steps.map((step, index) => {
        const on = frame >= Math.floor(index / 1.5) || frame >= 4;
        const y = 8 + index * 37;
        return (
          <g key={index} opacity={on ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
            <rect x="22" y={y} width="476" height="31" rx="10" fill="#FFFFFF" stroke="rgba(23,59,82,.13)" strokeWidth="1.4" />
            <rect x="22" y={y} width="5" height="31" rx="2.5" fill={colors[index]} />
            <circle cx="50" cy={y + 15} r="11" fill={colors[index]} />
            <text x="50" y={y + 20} textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {index + 1}
            </text>
            <text x="72" y={y + 20} fill={T.ink} fontSize="13" fontWeight="650" fontFamily="Manrope, sans-serif">
              {t(step)}
            </text>
          </g>
        );
      })}
    </FitSvg>
  );
};

// s13 — uchta tenglik
const EqualityFigure = ({ solved = false }) => {
  const t = useT();
  const rows = [
    { text: '63126 : 7 = 9018', bad: false },
    { text: '35133 : 7 = 5199', bad: true },
    { text: '50600 : 8 = 6325', bad: false },
  ];
  return (
    <FitSvg viewBox="0 0 520 232">
      <text x="260" y="30" textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
        {t({ uz: "Bit ning yozuvi", ru: 'Запись Bit', en: "Bit's notes" })}
      </text>
      {rows.map((row, index) => {
        const y = 54 + index * 56;
        const mark = solved && row.bad;
        return (
          <g key={index}>
            <rect
              x="70"
              y={y}
              width="380"
              height="44"
              rx="13"
              fill={mark ? '#FFF6F3' : '#FFFFFF'}
              stroke={mark ? T.accent : 'rgba(23,59,82,.14)'}
              strokeWidth={mark ? 2.2 : 1.5}
            />
            <text
              x="260"
              y={y + 29}
              textAnchor="middle"
              fill={mark ? T.accent : T.ink}
              fontSize="19"
              fontWeight="800"
              fontFamily="JetBrains Mono, monospace"
            >
              {row.text}
            </text>
            {mark && (
              <text x="424" y={y + 29} textAnchor="middle" fill={T.accent} fontSize="17" fontWeight="800" fontFamily="Manrope, sans-serif">
                ✕
              </text>
            )}
          </g>
        );
      })}
      {solved && (
        <text x="260" y="224" textAnchor="middle" fill={T.success} fontSize="14" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          35133 : 7 = 5019
        </text>
      )}
    </FitSvg>
  );
};

// ===========================================================================
// EKRANLAR
// ===========================================================================
const Screen0 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={0} figure={({ solved }) => <WarehouseScene solved={solved} />} />
);
const Screen1 = (props) => <RevealScreen {...props} figure={({ frame }) => <RemainderFigure frame={frame} />} />;
const Screen2 = (props) => (
  <SpanSelect {...props} figure={({ picked }) => <QuotientLengthFigure dividend="19284" divisor="6" firstLen={picked === null ? 2 : picked + 1} />} />
);
const Screen3 = (props) => (
  <RevealScreen {...props} figure={({ frame }) => <QuotientLengthFigure dividend="19284" divisor="6" firstLen={2} reveal={frame >= 3} />} />
);
const Screen4 = (props) => (
  <ChoiceScreen {...props} ordinal={1} figure={({ solved }) => <QuotientLengthFigure dividend="3295" divisor="5" firstLen={2} reveal={solved} />} />
);
const Screen5 = (props) => <RevealScreen {...props} figure={({ frame }) => <CycleFigure frame={frame} />} />;
const Screen6 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={2}
    figure={({ solved }) => (
      <DivisionColumn
        dividend="19284"
        divisor="6"
        quotient="3214"
        quotientMask={solved ? '3' : '?'}
        steps={MAIN_STEPS.slice(0, 1)}
        revealAll={solved}
        highlightStep={solved ? 0 : -1}
      />
    )}
  />
);
const Screen7 = (props) => (
  <RevealScreen
    {...props}
    figure={({ frame }) => (
      <DivisionColumn
        dividend="19284"
        divisor="6"
        quotient="3214"
        quotientMask={'3214'.slice(0, Math.max(1, Math.min(frame + 1, 4)))}
        steps={MAIN_STEPS}
        frame={frame + 1}
      />
    )}
  />
);
const Screen8 = (props) => (
  <NumPadScreen
    {...props}
    figure={({ solved }) => (
      <DivisionColumn
        dividend="19284"
        divisor="6"
        quotient="3214"
        quotientMask={solved ? '3214' : '????'}
        steps={MAIN_STEPS}
        revealAll
      />
    )}
  />
);
const Screen9 = (props) => (
  <RevealScreen
    {...props}
    figure={({ frame }) => (
      <DivisionColumn
        dividend="45054"
        divisor="9"
        quotient="5006"
        quotientMask={'5006'.slice(0, Math.max(1, Math.min(frame, 4)))}
        steps={ZERO_STEPS}
        frame={frame}
      />
    )}
  />
);
const Screen10 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={3}
    figure={({ solved }) => (
      <DivisionColumn
        dividend="45054"
        divisor="9"
        quotient="5006"
        quotientMask={solved ? '5006' : '????'}
        steps={ZERO_STEPS}
        revealAll
      />
    )}
  />
);
const Screen11 = (props) => <RevealScreen {...props} figure={({ frame }) => <PlanFigure frame={frame} />} />;
const Screen12 = (props) => (
  <ChoiceScreen {...props} ordinal={4} figure={({ solved }) => <QuotientLengthFigure dividend="90470" divisor="5" firstLen={1} reveal={solved} />} />
);
const Screen13 = (props) => (
  <ChoiceScreen {...props} ordinal={5} stack figure={({ solved }) => <EqualityFigure solved={solved} />} />
);
const Screen14 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={6} figure={({ solved }) => <WarehouseScene mode="final" solved={solved} />} />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

export default function Grade4Dars12(props) {
  return (
    <TheoryLessonRoot
      {...props}
      lessonMeta={LESSON_META}
      screenMeta={SCREEN_META}
      totalScreens={TOTAL_SCREENS}
      frameCounts={FRAME_COUNTS}
      content={CONTENT}
      screens={SCREENS}
      styles={KIT_STYLES}
    />
  );
}
