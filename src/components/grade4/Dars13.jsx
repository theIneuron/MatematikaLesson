// ============================================================================
// 4-SINF · Dars 13 · Ko'p xonali sonni ikki xonali songa bo'lish
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", 5-nashr 2020, 90-92-betlar.
// Asosiy misol 6142 : 83 = 74 va uning to'liq tushuntirishi 90-bet 1-mashq,
// sinash raqamini tuzatish 92-bet 2-mashqdagi 23115 : 67 misolida,
// bo'linma uzunligi 91-bet 2-mashq rejasi.
//
// Syujet: Lumo City tramvay deposi (SYUJET_4SINF.md, 2-blok).
// Baholanadigan oltita ekran: s2, s4, s6, s8, s10, s12.
// ============================================================================
import {
  ChoiceScreen, DivisionColumn, FitSvg, KIT_STYLES, NumPadScreen, QuotientLengthFigure,
  RevealScreen, SpanSelect, SummaryScreen, T, TheoryLessonRoot,
  assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'div2-4-13-v2',
  slug: 'dars13-kop-xonali-sonni-ikki-xonali-songa-bolish',
  lessonTitle: {
    uz: "13-dars. Ko'p xonali sonni ikki xonali songa bo'lish",
    ru: 'Урок 13. Деление многозначного числа на двузначное',
    en: 'Lesson 13. Dividing a multi-digit number by a two-digit number',
  },
  skillTags: ['long_division', 'trial_digit', 'rounding_divisor', 'partial_dividend', 'checking'],
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
  { id: 's12', type: 'error-analysis', scored: true, scope: 'module-mikro' },
  { id: 's13', type: 'life-case', scored: false, scope: 'final' },
  { id: 's14', type: 'summary', scored: false, scope: null },
];

const TOTAL_SCREENS = SCREEN_META.length;
assertScreenTypeLabels(SCREEN_META, LESSON_META.lessonId);

const FRAME_COUNTS = [5, 4, 3, 4, 3, 4, 3, 4, 3, 5, 3, 5, 3, 3, 3];

// 6142 : 83 = 74
const MAIN_STEPS = [
  { bring: '614', sub: '581', rest: '33', digit: '7' },
  { bring: '332', sub: '332', rest: '0', digit: '4' },
];

// 23115 : 67 misolining tuzatish qadami CorrectionFigure da alohida ko'rsatiladi.

const CONTENT = {
  s0: {
    eyebrow: { uz: 'Tramvay deposi', ru: 'Трамвайное депо', en: 'The tram depot' },
    title: {
      uz: "Bo'luvchi ikki xonali bo'lsa nima o'zgaradi?",
      ru: 'Что меняется, если делитель двузначный?',
      en: 'What changes when the divisor has two digits?',
    },
    question: {
      uz: "6142 ni 83 ga bo'lishda birinchi bo'lak qanday bo'ladi?",
      ru: 'Какой будет первая часть при делении 6142 на 83?',
      en: 'What will the first part be when dividing 6142 by 83?',
    },
    options: [
      { uz: 'Uchta raqam: 614', ru: 'Три цифры: 614', en: 'Three digits: 614' },
      { uz: 'Ikkita raqam: 61', ru: 'Две цифры: 61', en: 'Two digits: 61' },
      { uz: 'Bitta raqam: 6', ru: 'Одна цифра: 6', en: 'One digit: 6' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Oltmish bir sakson uchdan kichik, shuning uchun uchinchi raqam ham olinadi.",
      ru: 'Верно. Шестьдесят один меньше восьмидесяти трёх, поэтому берём и третью цифру.',
      en: 'Correct. Sixty-one is less than eighty-three, so the third digit is taken as well.',
    },
    wrong: [
      null,
      {
        uz: "Oltmish bir sakson uchdan kichik. Bunday bo'lakni bo'lib bo'lmaydi, yana bitta raqam kerak.",
        ru: 'Шестьдесят один меньше восьмидесяти трёх. Такую часть разделить нельзя, нужна ещё одна цифра.',
        en: 'Sixty-one is less than eighty-three. Such a part cannot be divided, one more digit is needed.',
      },
      {
        uz: "Bitta raqam olti. U sakson uchdan ancha kichik, shuning uchun yetmaydi.",
        ru: 'Одна цифра это шесть. Она намного меньше восьмидесяти трёх, поэтому не хватает.',
        en: 'One digit is six. It is far smaller than eighty-three, so it is not enough.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Salom! Lumo City tramvay deposida yangi vagonlar yig'ilmoqda.",
          "Omborda olti ming bir yuz qirq ikkita kontakt plastinkasi bor. Ularni sakson uchta vagonga teng taqsimlash kerak.",
          "O'tgan darsda bo'luvchi bir xonali edi va biz bir yoki ikkita raqamni olardik.",
          "Endi bo'luvchi ikki xonali. Demak birinchi bo'lak ham kattaroq bo'ladi.",
          "Birinchi to'liqsiz bo'linuvchi nechta raqamdan iborat bo'lishi kerak deb o'ylaysiz?",
        ],
        ru: [
          'Привет! В трамвайном депо Lumo City собирают новые вагоны.',
          'На складе шесть тысяч сто сорок две контактные пластины. Их нужно поровну распределить между восемьюдесятью тремя вагонами.',
          'На прошлом уроке делитель был однозначным, и мы брали одну или две цифры.',
          'Теперь делитель двузначный. Значит, и первая часть будет больше.',
          'Как ты думаешь, из скольких цифр должно состоять первое неполное делимое?',
        ],
        en: [
          'Hello! New carriages are being assembled at the Lumo City tram depot.',
          'The store holds six thousand one hundred and forty-two contact plates. They must be shared equally between eighty-three carriages.',
          'In the last lesson the divisor had one digit and we took one or two digits.',
          'Now the divisor has two digits. So the first part will be bigger too.',
          'How many digits do you think the first partial dividend should have?',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Tayanch', ru: 'Опора', en: 'What you know' },
    title: {
      uz: "Sikl o'zgarmaydi",
      ru: 'Цикл не меняется',
      en: 'The cycle does not change',
    },
    lead: {
      uz: "Bo'lamiz, ko'paytiramiz, ayiramiz, qoldiqni taqqoslaymiz. Faqat bo'linma raqamini topish qiyinlashadi.",
      ru: 'Делим, умножаем, вычитаем, сравниваем остаток. Труднее становится только подбор цифры частного.',
      en: 'We divide, multiply, subtract and compare the remainder. Only finding the quotient digit gets harder.',
    },
    note: {
      uz: "Qoldiq baribir bo'luvchidan kichik bo'lishi kerak.",
      ru: 'Остаток всё равно должен быть меньше делителя.',
      en: 'The remainder must still be smaller than the divisor.',
    },
    audio: {
      intro: {
        uz: [
          "Yangi qiyinchilikka o'tishdan oldin tanish siklni eslaymiz.",
          "O'tgan darsdagi to'rt amal shundoq qoladi: bo'lamiz, ko'paytiramiz, ayiramiz va qoldiqni taqqoslaymiz.",
          "Bir xonali bo'luvchida bo'linma raqamini ko'paytirish jadvalidan darrov topardik.",
          "Ikki xonali bo'luvchida esa jadval yordam bermaydi. Shuning uchun raqamni sinab ko'rish kerak bo'ladi.",
        ],
        ru: [
          'Прежде чем взяться за новую трудность, вспомним знакомый цикл.',
          'Четыре действия прошлого урока остаются теми же: делим, умножаем, вычитаем и сравниваем остаток.',
          'При однозначном делителе цифру частного мы сразу находили по таблице умножения.',
          'При двузначном делителе таблица не помогает. Поэтому цифру придётся подбирать пробой.',
        ],
        en: [
          'Before we take on the new difficulty, let us recall the familiar cycle.',
          'The four actions of the last lesson stay the same: divide, multiply, subtract and compare the remainder.',
          'With a one-digit divisor we found the quotient digit straight from the times table.',
          'With a two-digit divisor the table does not help. So the digit has to be found by trial.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: "Birinchi bo'lak", ru: 'Первая часть', en: 'The first part' },
    title: { uz: '6142 : 83', ru: '6142 : 83', en: '6142 : 83' },
    question: {
      uz: "Birinchi to'liqsiz bo'linuvchi qaysi raqamda tugaydi? Shu raqamni bosing.",
      ru: 'На какой цифре заканчивается первое неполное делимое? Нажми эту цифру.',
      en: 'At which digit does the first partial dividend end? Tap that digit.',
    },
    digits: '6142',
    divisor: '83',
    correctEnd: 2,
    correctText: {
      uz: "To'g'ri. Olti yuz o'n to'rt sakson uchdan katta, demak bo'lish shu bo'lakdan boshlanadi.",
      ru: 'Верно. Шестьсот четырнадцать больше восьмидесяти трёх, значит деление начинается с этой части.',
      en: 'Correct. Six hundred and fourteen is larger than eighty-three, so the division starts from this part.',
    },
    wrong: [
      {
        uz: "Bitta raqam olti. U sakson uchdan ancha kichik.",
        ru: 'Одна цифра это шесть. Она намного меньше восьмидесяти трёх.',
        en: 'One digit is six. It is far smaller than eighty-three.',
      },
      {
        uz: "Oltmish bir hali sakson uchdan kichik. Yana bitta raqam qo'shish kerak.",
        ru: 'Шестьдесят один всё ещё меньше восьмидесяти трёх. Нужно добавить ещё цифру.',
        en: 'Sixty-one is still less than eighty-three. One more digit must be added.',
      },
      null,
      {
        uz: "Bu butun son. To'liqsiz bo'linuvchi bo'luvchidan katta bo'lgan eng qisqa bo'lak bo'lishi kerak.",
        ru: 'Это всё число. Неполное делимое должно быть самой короткой частью, которая больше делителя.',
        en: 'This is the whole number. The partial dividend must be the shortest part larger than the divisor.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Endi o'zingiz ko'rsating.",
          "Chapdan boshlab, sakson uchdan katta bo'lgan eng qisqa bo'lakni toping.",
          "O'sha bo'lakning oxirgi raqamini bosing.",
        ],
        ru: [
          'Теперь покажи сам.',
          'Начиная слева, найди самую короткую часть, которая больше восьмидесяти трёх.',
          'Нажми последнюю цифру этой части.',
        ],
        en: [
          'Now show it yourself.',
          'Starting from the left, find the shortest part that is larger than eighty-three.',
          'Tap the last digit of that part.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: 'Sinash raqami', ru: 'Пробная цифра', en: 'The trial digit' },
    title: {
      uz: "Bo'luvchini yumaloq songa yaxlitlaymiz",
      ru: 'Округляем делитель до круглого числа',
      en: 'We round the divisor to a round number',
    },
    lead: {
      uz: "83 ni 80 ga yaxlitlaymiz. 614 ni 80 ga bo'lish uchun 61 ni 8 ga bo'lamiz.",
      ru: 'Округляем 83 до 80. Чтобы разделить 614 на 80, делим 61 на 8.',
      en: 'We round 83 to 80. To divide 614 by 80 we divide 61 by 8.',
    },
    note: {
      uz: "Bu hali javob emas, sinash raqami. Uni albatta tekshirish kerak.",
      ru: 'Это ещё не ответ, а пробная цифра. Её обязательно надо проверить.',
      en: 'This is not the answer yet but a trial digit. It must be checked.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikning to'qsoninchi betida shu usul tushuntirilgan.",
          "Olti yuz o'n to'rtni sakson uchga emas, sakson ga bo'lamiz. Yumaloq songa bo'lish osonroq.",
          "Buning uchun oltmish birni sakkizga bo'lamiz va yetti chiqadi.",
          "Yetti sinash raqami deyiladi. U to'g'ri yoki katta bo'lishi mumkin, shuning uchun tekshiruv kerak.",
        ],
        ru: [
          'На девяностой странице учебника объяснён этот способ.',
          'Разделим шестьсот четырнадцать не на восемьдесят три, а на восемьдесят. На круглое число делить легче.',
          'Для этого разделим шестьдесят один на восемь и получим семь.',
          'Семь называется пробной цифрой. Она может подойти, а может оказаться большой, поэтому нужна проверка.',
        ],
        en: [
          'On page ninety of the textbook this method is explained.',
          'Let us divide six hundred and fourteen not by eighty-three but by eighty. Dividing by a round number is easier.',
          'For that we divide sixty-one by eight and get seven.',
          'Seven is called the trial digit. It may fit or it may turn out too large, so a check is needed.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Yaxlitlash', ru: 'Округление', en: 'Rounding' },
    title: { uz: '614 : 83', ru: '614 : 83', en: '614 : 83' },
    question: {
      uz: "Sinash raqamini toping: 61 ni 8 ga bo'ling.",
      ru: 'Найди пробную цифру: раздели 61 на 8.',
      en: 'Find the trial digit: divide 61 by 8.',
    },
    answer: '7',
    correctText: {
      uz: "To'g'ri. Oltmish birda sakkiz yetti marta bor. Sinash raqami yetti.",
      ru: 'Верно. В шестидесяти одном восемь содержится семь раз. Пробная цифра семь.',
      en: 'Correct. Eight goes into sixty-one seven times. The trial digit is seven.',
    },
    wrong: {
      uz: "Sakson uchni saksonga yaxlitladik. Endi oltmish birda sakkiz necha marta borligini toping.",
      ru: 'Мы округлили восемьдесят три до восьмидесяти. Теперь найди, сколько раз восемь содержится в шестидесяти одном.',
      en: 'We rounded eighty-three to eighty. Now find how many times eight goes into sixty-one.',
    },
    hintAfter: {
      uz: "Sakkiz karra yetti ellik olti, sakkiz karra sakkiz esa oltmish to'rt. Oltmish bir shu ikkisining orasida.",
      ru: 'Восемью семь пятьдесят шесть, а восемью восемь шестьдесят четыре. Шестьдесят один находится между ними.',
      en: 'Eight times seven is fifty-six, and eight times eight is sixty-four. Sixty-one lies between them.',
    },
    audio: {
      intro: {
        uz: [
          "Bo'luvchini yaxlitladik: sakson uch o'rniga sakson.",
          "Endi sinash raqamini toping.",
          "Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Делитель округлили: вместо восьмидесяти трёх взяли восемьдесят.',
          'Теперь найди пробную цифру.',
          'Набери ответ и подтверди.',
        ],
        en: [
          'We rounded the divisor: eighty instead of eighty-three.',
          'Now find the trial digit.',
          'Type the answer and confirm it.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Tekshiruv', ru: 'Проверка', en: 'The check' },
    title: {
      uz: 'Sinash raqamini tekshiramiz',
      ru: 'Проверяем пробную цифру',
      en: 'We check the trial digit',
    },
    lead: {
      uz: "83 × 7 = 581. Bu 614 dan kichik, qoldiq 33 esa 83 dan kichik. Raqam to'g'ri.",
      ru: '83 × 7 = 581. Это меньше 614, а остаток 33 меньше 83. Цифра подходит.',
      en: '83 × 7 = 581. That is less than 614, and the remainder 33 is less than 83. The digit fits.',
    },
    note: {
      uz: "Ikkita shart bir vaqtda bajarilishi kerak.",
      ru: 'Оба условия должны выполняться одновременно.',
      en: 'Both conditions must hold at the same time.',
    },
    audio: {
      intro: {
        uz: [
          "Sinash raqami yetti edi. Endi uni tekshiramiz.",
          "Sakson uchni yettiga ko'paytiramiz va besh yuz sakson bir chiqadi.",
          "Besh yuz sakson bir olti yuz o'n to'rtdan kichik. Birinchi shart bajarildi.",
          "Ayiramiz: olti yuz o'n to'rtdan besh yuz sakson birni ayirsak, o'ttiz uch qoladi. O'ttiz uch sakson uchdan kichik, demak raqam to'g'ri.",
        ],
        ru: [
          'Пробная цифра была семь. Теперь проверим её.',
          'Умножим восемьдесят три на семь и получим пятьсот восемьдесят один.',
          'Пятьсот восемьдесят один меньше шестисот четырнадцати. Первое условие выполнено.',
          'Вычтем: из шестисот четырнадцати пятьсот восемьдесят один, останется тридцать три. Тридцать три меньше восьмидесяти трёх, значит цифра верна.',
        ],
        en: [
          'The trial digit was seven. Now let us check it.',
          'Multiply eighty-three by seven and get five hundred and eighty-one.',
          'Five hundred and eighty-one is less than six hundred and fourteen. The first condition holds.',
          'Subtract: six hundred and fourteen minus five hundred and eighty-one leaves thirty-three. Thirty-three is less than eighty-three, so the digit is right.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: "Keyingi bo'lak", ru: 'Следующая часть', en: 'The next part' },
    title: { uz: '6142 : 83', ru: '6142 : 83', en: '6142 : 83' },
    question: {
      uz: "Qoldiq 33 edi. Keyingi to'liqsiz bo'linuvchi qanday bo'ladi?",
      ru: 'Остаток был 33. Каким будет следующее неполное делимое?',
      en: 'The remainder was 33. What will the next partial dividend be?',
    },
    options: [
      { uz: '332', ru: '332', en: '332' },
      { uz: '33', ru: '33', en: '33' },
      { uz: '2', ru: '2', en: '2' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Qoldiq o'ttiz uchga keyingi raqam ikkini tushiramiz va uch yuz o'ttiz ikki hosil bo'ladi.",
      ru: 'Верно. К остатку тридцать три сносим следующую цифру два и получаем триста тридцать два.',
      en: 'Correct. We bring the next digit two down to the remainder thirty-three and get three hundred and thirty-two.',
    },
    wrong: [
      null,
      {
        uz: "Bu faqat qoldiq. Unga keyingi raqamni tushirish kerak, aks holda bo'lish to'xtab qoladi.",
        ru: 'Это только остаток. К нему надо снести следующую цифру, иначе деление остановится.',
        en: 'This is only the remainder. The next digit must be brought down, otherwise the division stops.',
      },
      {
        uz: "Bu faqat tushirilgan raqam. Qoldiq o'ttiz uch ham hisobga olinishi kerak.",
        ru: 'Это только снесённая цифра. Остаток тридцать три тоже надо учесть.',
        en: 'This is only the digit brought down. The remainder thirty-three must be counted too.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Birinchi qadam tugadi, bo'linmada yetti turibdi.",
          "Qoldiq o'ttiz uch edi va bo'linuvchida yana bitta raqam qolgan.",
          "Keyingi to'liqsiz bo'linuvchi qanday hosil bo'lishini tanlang.",
        ],
        ru: [
          'Первый шаг закончен, в частном стоит семь.',
          'Остаток был тридцать три, и в делимом осталась ещё одна цифра.',
          'Выбери, как образуется следующее неполное делимое.',
        ],
        en: [
          'The first step is done and seven stands in the quotient.',
          'The remainder was thirty-three and one digit is left in the dividend.',
          'Choose how the next partial dividend is formed.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Ikkinchi qadam', ru: 'Второй шаг', en: 'The second step' },
    title: {
      uz: 'Sikl takrorlanadi',
      ru: 'Цикл повторяется',
      en: 'The cycle repeats',
    },
    lead: {
      uz: "332 : 80 → 33 : 8 = 4. Tekshiramiz: 83 × 4 = 332, qoldiq 0.",
      ru: '332 : 80 → 33 : 8 = 4. Проверяем: 83 × 4 = 332, остаток 0.',
      en: '332 : 80 → 33 : 8 = 4. We check: 83 × 4 = 332, remainder 0.',
    },
    note: {
      uz: "Qoldiq nol bo'ldi, demak bo'lish qoldiqsiz bajarildi.",
      ru: 'Остаток стал нулём, значит деление выполнено без остатка.',
      en: 'The remainder became zero, so the division came out exact.',
    },
    audio: {
      intro: {
        uz: [
          "Ikkinchi to'liqsiz bo'linuvchi uch yuz o'ttiz ikki.",
          "Yana yaxlitlaymiz: uch yuz o'ttiz ikkini saksonga bo'lish uchun o'ttiz uchni sakkizga bo'lamiz va to'rt chiqadi.",
          "Tekshiramiz: sakson uchni to'rtga ko'paytirsak, aynan uch yuz o'ttiz ikki chiqadi.",
          "Qoldiq nol. Bo'linma yetmish to'rt, va har bir vagonga yetmish to'rttadan plastinka tushadi.",
        ],
        ru: [
          'Второе неполное делимое триста тридцать два.',
          'Снова округляем: чтобы разделить триста тридцать два на восемьдесят, делим тридцать три на восемь и получаем четыре.',
          'Проверяем: восемьдесят три умножить на четыре будет ровно триста тридцать два.',
          'Остаток ноль. Частное семьдесят четыре, и на каждый вагон приходится по семьдесят четыре пластины.',
        ],
        en: [
          'The second partial dividend is three hundred and thirty-two.',
          'We round again: to divide three hundred and thirty-two by eighty we divide thirty-three by eight and get four.',
          'We check: eighty-three times four is exactly three hundred and thirty-two.',
          'The remainder is zero. The quotient is seventy-four, and each carriage gets seventy-four plates.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: "To'liq bo'linma", ru: 'Полное частное', en: 'The full quotient' },
    title: { uz: '6142 : 83', ru: '6142 : 83', en: '6142 : 83' },
    question: {
      uz: 'Har bir vagonga nechta plastinka tushadi?',
      ru: 'Сколько пластин приходится на каждый вагон?',
      en: 'How many plates does each carriage get?',
    },
    answer: '74',
    correctText: {
      uz: "To'g'ri. Tekshiramiz: yetmish to'rtni sakson uchga ko'paytirsak, olti ming bir yuz qirq ikki chiqadi.",
      ru: 'Верно. Проверим: семьдесят четыре умножить на восемьдесят три будет шесть тысяч сто сорок два.',
      en: 'Correct. Let us check: seventy-four times eighty-three is six thousand one hundred and forty-two.',
    },
    wrong: {
      uz: "Bo'linmada ikkita raqam bo'lishi kerak: birinchi bo'lak uchta raqamni oldi, keyin bitta raqam qoldi.",
      ru: 'В частном должно быть две цифры: первая часть взяла три цифры, потом осталась одна.',
      en: 'The quotient must have two digits: the first part took three digits and one digit was left.',
    },
    hintAfter: {
      uz: "Birinchi qadam yetti berdi, ikkinchi qadam to'rt berdi.",
      ru: 'Первый шаг дал семь, второй шаг дал четыре.',
      en: 'The first step gave seven and the second step gave four.',
    },
    audio: {
      intro: {
        uz: [
          "Ikkala qadam ham ekranda ochilgan.",
          "Endi to'liq bo'linmani o'zingiz tering.",
          "Qadamlar bergan raqamlarni tartib bilan yozing.",
        ],
        ru: [
          'Оба шага открыты на экране.',
          'Теперь набери полное частное сам.',
          'Записывай цифры шагов по порядку.',
        ],
        en: [
          'Both steps are open on the screen.',
          'Now type the full quotient yourself.',
          'Write the digits the steps gave, in order.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: 'Sinash raqami katta chiqsa', ru: 'Если пробная цифра велика', en: 'If the trial digit is too big' },
    title: {
      uz: 'Sinash raqami har doim ham mos kelmaydi',
      ru: 'Пробная цифра подходит не всегда',
      en: 'The trial digit does not always fit',
    },
    lead: {
      uz: "Yaxlitlangan bo'luvchi haqiqiysidan kichik, shuning uchun sinash raqami katta chiqishi mumkin.",
      ru: 'Округлённый делитель меньше настоящего, поэтому пробная цифра может оказаться большой.',
      en: 'The rounded divisor is smaller than the real one, so the trial digit may come out too large.',
    },
    note: {
      uz: "Ko'paytma bo'linuvchidan katta chiqsa, raqamni bittaga kamaytiramiz.",
      ru: 'Если произведение больше делимого, уменьшаем цифру на единицу.',
      en: 'If the product is larger than the dividend, we decrease the digit by one.',
    },
    audio: {
      intro: {
        uz: [
          "Endi darslikning to'qson ikkinchi betidagi misolni ko'ramiz: yigirma uch ming bir yuz o'n beshni oltmish yettiga bo'lamiz.",
          "Birinchi qadam oson: ikki yuz o'ttiz birda oltmish yetti uch marta bor, qoldiq o'ttiz.",
          "Ikkinchi to'liqsiz bo'linuvchi uch yuz bir. Oltmish yettini oltmishga yaxlitlaymiz va o'ttizni oltiga bo'lamiz, besh chiqadi.",
          "Lekin oltmish yettini beshga ko'paytirsak, uch yuz o'ttiz besh chiqadi. Bu uch yuz birdan katta, demak besh katta.",
          "Raqamni bittaga kamaytiramiz: to'rt. Oltmish yettini to'rtga ko'paytirsak, ikki yuz oltmish sakkiz chiqadi va bu mos keladi.",
        ],
        ru: [
          'Теперь разберём пример с девяносто второй страницы учебника: разделим двадцать три тысячи сто пятнадцать на шестьдесят семь.',
          'Первый шаг простой: в двухстах тридцати одном шестьдесят семь содержится три раза, остаток тридцать.',
          'Второе неполное делимое триста один. Округляем шестьдесят семь до шестидесяти и делим тридцать на шесть, получается пять.',
          'Но шестьдесят семь умножить на пять будет триста тридцать пять. Это больше трёхсот одного, значит пять велико.',
          'Уменьшаем цифру на единицу: четыре. Шестьдесят семь умножить на четыре будет двести шестьдесят восемь, и это подходит.',
        ],
        en: [
          'Now let us look at the example from page ninety-two of the textbook: divide twenty-three thousand one hundred and fifteen by sixty-seven.',
          'The first step is easy: sixty-seven goes into two hundred and thirty-one three times, remainder thirty.',
          'The second partial dividend is three hundred and one. We round sixty-seven to sixty and divide thirty by six, which gives five.',
          'But sixty-seven times five is three hundred and thirty-five. That is more than three hundred and one, so five is too big.',
          'We decrease the digit by one: four. Sixty-seven times four is two hundred and sixty-eight, and that fits.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Tuzatish', ru: 'Исправление', en: 'The correction' },
    title: { uz: '301 : 67', ru: '301 : 67', en: '301 : 67' },
    question: {
      uz: "Sinash raqami 5 katta chiqdi. To'g'ri raqam qaysi?",
      ru: 'Пробная цифра 5 оказалась велика. Какая цифра верна?',
      en: 'The trial digit 5 was too big. Which digit is right?',
    },
    options: [
      { uz: '4', ru: '4', en: '4' },
      { uz: '3', ru: '3', en: '3' },
      { uz: '6', ru: '6', en: '6' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Oltmish yetti karra to'rt ikki yuz oltmish sakkiz. Bu uch yuz birdan kichik, qoldiq o'ttiz uch esa oltmish yettidan kichik.",
      ru: 'Верно. Шестьдесят семь на четыре будет двести шестьдесят восемь. Это меньше трёхсот одного, а остаток тридцать три меньше шестидесяти семи.',
      en: 'Correct. Sixty-seven times four is two hundred and sixty-eight. That is less than three hundred and one, and the remainder thirty-three is less than sixty-seven.',
    },
    wrong: [
      null,
      {
        uz: "Oltmish yetti karra uch ikki yuz bir. Qoldiq yuz bo'lardi, u esa oltmish yettidan katta. Demak raqam kichik olingan.",
        ru: 'Шестьдесят семь на три будет двести один. Остаток был бы сто, а это больше шестидесяти семи. Значит цифра взята маленькой.',
        en: 'Sixty-seven times three is two hundred and one. The remainder would be one hundred, which is more than sixty-seven. So the digit was taken too small.',
      },
      {
        uz: "Olti beshdan ham katta. Besh allaqachon katta chiqqan edi, shuning uchun oltini olish mumkin emas.",
        ru: 'Шесть даже больше пяти. Пять уже оказалось велико, поэтому шесть взять нельзя.',
        en: 'Six is even larger than five. Five was already too big, so six cannot be taken.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Ikkinchi to'liqsiz bo'linuvchi uch yuz bir, bo'luvchi oltmish yetti.",
          "Yaxlitlash bergan sinash raqami besh katta chiqdi.",
          "To'g'ri raqamni tanlang va sababini eshiting.",
        ],
        ru: [
          'Второе неполное делимое триста один, делитель шестьдесят семь.',
          'Пробная цифра пять, которую дало округление, оказалась велика.',
          'Выбери верную цифру и послушай почему.',
        ],
        en: [
          'The second partial dividend is three hundred and one and the divisor is sixty-seven.',
          'The trial digit five that rounding gave was too big.',
          'Choose the right digit and hear why.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Darslik rejasi', ru: 'План учебника', en: 'The textbook plan' },
    title: {
      uz: "Ikki xonali songa bo'lish rejasi",
      ru: 'План деления на двузначное число',
      en: 'The plan for dividing by a two-digit number',
    },
    lead: {
      uz: "Darslikning 91-betidagi besh qadam.",
      ru: 'Пять шагов со страницы 91 учебника.',
      en: 'The five steps from page 91 of the textbook.',
    },
    note: {
      uz: "Natijani teskari amal bilan tekshiramiz.",
      ru: 'Результат проверяем обратным действием.',
      en: 'We check the result by the inverse action.',
    },
    audio: {
      intro: {
        uz: [
          "Ochganimizni qoida qilib yig'amiz.",
          "Birinchi qadam: birinchi to'liqsiz bo'linuvchini topaman. Ikkinchi qadam: bo'linmada nechta raqam bo'lishini aniqlayman.",
          "Uchinchi qadam: bo'luvchini yumaloq songa yaxlitlab, sinash raqamini topaman.",
          "To'rtinchi qadam: sinash raqamini ko'paytirib tekshiraman. Katta chiqsa, bittaga kamaytiraman.",
          "Beshinchi qadam: ayiraman, qoldiqni bo'luvchi bilan taqqoslayman va keyingi raqamni tushiraman.",
        ],
        ru: [
          'Соберём открытое в правило.',
          'Первый шаг: нахожу первое неполное делимое. Второй шаг: определяю, сколько цифр будет в частном.',
          'Третий шаг: округляю делитель до круглого числа и нахожу пробную цифру.',
          'Четвёртый шаг: проверяю пробную цифру умножением. Если велика, уменьшаю на единицу.',
          'Пятый шаг: вычитаю, сравниваю остаток с делителем и сношу следующую цифру.',
        ],
        en: [
          'Let us gather what we found into a rule.',
          'Step one: I find the first partial dividend. Step two: I work out how many digits the quotient will have.',
          'Step three: I round the divisor to a round number and find the trial digit.',
          'Step four: I check the trial digit by multiplying. If it is too big, I decrease it by one.',
          'Step five: I subtract, compare the remainder with the divisor and bring down the next digit.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: "Bit ning yozuvi", ru: 'Запись Bit', en: "Bit's notes" },
    title: {
      uz: "Bit yechimini tekshiramiz: 5096 : 56",
      ru: 'Проверяем решение Bit: 5096 : 56',
      en: "Checking Bit's work: 5096 : 56",
    },
    question: {
      uz: "Bit qoldiq 61 chiqdi deb yozdi. Xato qayerda?",
      ru: 'Bit записал, что остаток равен 61. Где ошибка?',
      en: 'Bit wrote that the remainder is 61. Where is the mistake?',
    },
    options: [
      {
        uz: "Qoldiq bo'luvchidan katta, raqam kichik olingan",
        ru: 'Остаток больше делителя, цифра взята маленькой',
        en: 'The remainder is larger than the divisor, the digit was taken too small',
      },
      {
        uz: "Birinchi to'liqsiz bo'linuvchi noto'g'ri",
        ru: 'Неверно выбрано первое неполное делимое',
        en: 'The first partial dividend is chosen wrongly',
      },
      {
        uz: "Bo'luvchi noto'g'ri yaxlitlangan",
        ru: 'Делитель округлён неверно',
        en: 'The divisor was rounded wrongly',
      },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Oltmish bir ellik oltidan katta, demak bo'linma raqamini bittaga kattalashtirish kerak.",
      ru: 'Верно. Шестьдесят один больше пятидесяти шести, значит цифру частного надо увеличить на единицу.',
      en: 'Correct. Sixty-one is larger than fifty-six, so the quotient digit must be increased by one.',
    },
    wrong: [
      null,
      {
        uz: "Birinchi bo'lak to'g'ri tanlangan: ellik ellik oltidan kichik, shuning uchun besh yuz to'qqiz olinadi.",
        ru: 'Первая часть выбрана верно: пятьдесят меньше пятидесяти шести, поэтому берут пятьсот девять.',
        en: 'The first part is chosen correctly: fifty is less than fifty-six, so five hundred and nine is taken.',
      },
      {
        uz: "Ellik oltini ellikka yaxlitlash to'g'ri. Xato yaxlitlashda emas, tekshiruvda.",
        ru: 'Округление пятидесяти шести до пятидесяти верно. Ошибка не в округлении, а в проверке.',
        en: 'Rounding fifty-six to fifty is right. The mistake is not in the rounding but in the check.',
      },
    ],
    bitFeedback: true,
    audio: {
      intro: {
        uz: [
          "Bit darslikning to'qson birinchi betidagi misolni ishladi: besh ming to'qson oltini ellik oltiga bo'ldi.",
          "Birinchi qadamda u qoldiq oltmish bir chiqdi deb yozdi va davom etdi.",
          "Ustunga qarang va xato qayerda ekanini toping.",
        ],
        ru: [
          'Bit решал пример с девяносто первой страницы учебника: пять тысяч девяносто шесть разделить на пятьдесят шесть.',
          'На первом шаге он записал, что остаток равен шестидесяти одному, и продолжил.',
          'Посмотри на столбик и найди, где ошибка.',
        ],
        en: [
          'Bit worked on the example from page ninety-one of the textbook: five thousand and ninety-six divided by fifty-six.',
          'At the first step he wrote that the remainder is sixty-one and carried on.',
          'Look at the column and find where the mistake is.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: "The city's decision" },
    title: {
      uz: 'Ikkinchi partiya uchun hisob',
      ru: 'Расчёт для второй партии',
      en: 'The calculation for the second batch',
    },
    question: {
      uz: "7410 ta bolt 13 ta brigadaga bo'linsa, har biriga qancha tushadi?",
      ru: 'Если 7410 болтов разделить между 13 бригадами, сколько получит каждая?',
      en: 'If 7410 bolts are shared between 13 teams, how many does each get?',
    },
    options: [
      { uz: '570', ru: '570', en: '570' },
      { uz: '57', ru: '57', en: '57' },
      { uz: '5700', ru: '5700', en: '5700' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Besh yuz yetmishni o'n uchga ko'paytirsak, yetti ming to'rt yuz o'n chiqadi. Depo ishga tayyor.",
      ru: 'Верно. Пятьсот семьдесят умножить на тринадцать будет семь тысяч четыреста десять. Депо готово к работе.',
      en: 'Correct. Five hundred and seventy times thirteen is seven thousand four hundred and ten. The depot is ready.',
    },
    wrong: [
      null,
      {
        uz: "Bu yerda oxirgi nol tushib qolgan. Birinchi bo'lak yetmish to'rt, keyin yana ikkita raqam qolgan, demak bo'linmada uchta raqam bo'ladi.",
        ru: 'Здесь потерян последний ноль. Первая часть семьдесят четыре, потом осталось ещё две цифры, значит в частном три цифры.',
        en: 'The last zero is missing here. The first part is seventy-four and two digits are left, so the quotient has three digits.',
      },
      {
        uz: "Bu yerda ortiqcha nol bor. Bo'linmada uchta raqam bo'lishi kerak, to'rtta emas.",
        ru: 'Здесь лишний ноль. В частном должно быть три цифры, а не четыре.',
        en: 'There is an extra zero here. The quotient should have three digits, not four.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Depoga ikkinchi partiya keldi: yetti ming to'rt yuz o'nta bolt.",
          "Ularni o'n uchta brigadaga teng bo'lish kerak.",
          "Avval bo'linmada nechta raqam bo'lishini aniqlang, keyin javobni tanlang.",
        ],
        ru: [
          'В депо пришла вторая партия: семь тысяч четыреста десять болтов.',
          'Их нужно разделить поровну между тринадцатью бригадами.',
          'Сначала определи, сколько цифр будет в частном, потом выбери ответ.',
        ],
        en: [
          'A second batch arrived at the depot: seven thousand four hundred and ten bolts.',
          'They have to be shared equally between thirteen teams.',
          'First work out how many digits the quotient will have, then choose the answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Missiya mukofoti', ru: 'Награда за миссию', en: 'Mission award' },
    stageLabel: { uz: 'Yakuniy bosqich', ru: 'Финальный этап', en: 'Final stage' },
    headTitle: {
      uz: 'Unvongacha bitta savol',
      ru: 'Один вопрос до звания',
      en: 'One question before your title',
    },
    headLead: {
      uz: "Sinash raqami katta chiqsa nima qilish kerakligini ayting.",
      ru: 'Скажи, что делать, если пробная цифра оказалась велика.',
      en: 'Say what to do when the trial digit turns out too big.',
    },
    questionKicker: { uz: 'Yakuniy savol', ru: 'Финальный вопрос', en: 'Final question' },
    stepLabel: { uz: '1 qadam', ru: '1 шаг', en: '1 step' },
    reflectionQuestion: {
      uz: "Ko'paytma bo'linuvchidan katta chiqdi. Nima qilamiz?",
      ru: 'Произведение оказалось больше делимого. Что делаем?',
      en: 'The product came out larger than the dividend. What do we do?',
    },
    reflectionStart: {
      uz: "Sinash raqamini…",
      ru: 'Пробную цифру…',
      en: 'The trial digit…',
    },
    reflectionOptions: [
      { uz: 'bittaga kamaytiramiz', ru: 'уменьшаем на единицу', en: 'we decrease by one' },
      { uz: 'bittaga kattalashtiramiz', ru: 'увеличиваем на единицу', en: 'we increase by one' },
      { uz: "o'zgartirmaymiz", ru: 'не меняем', en: 'we leave unchanged' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "To'g'ri. Ko'paytma katta bo'lsa, raqam katta olingan. Uni bittaga kamaytiramiz va qaytadan tekshiramiz.",
      ru: 'Верно. Если произведение больше, цифра взята великой. Уменьшаем её на единицу и проверяем снова.',
      en: 'Correct. If the product is larger, the digit was taken too big. We decrease it by one and check again.',
    },
    reflectionWrong: {
      uz: "Kattalashtirish qoldiq bo'luvchidan katta chiqqanda kerak bo'ladi. Bu yerda esa ko'paytmaning o'zi katta.",
      ru: 'Увеличивать нужно, когда остаток больше делителя. А здесь велико само произведение.',
      en: 'Increasing is needed when the remainder is larger than the divisor. Here the product itself is too large.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    awards: [
      { min: 5, title: { uz: 'Sinash ustasi', ru: 'Мастер подбора', en: 'Master of trial' } },
      { min: 3, title: { uz: 'Depo hisobchisi', ru: 'Расчётчик депо', en: 'Depot calculator' } },
      { min: 0, title: { uz: 'Brigada yordamchisi', ru: 'Помощник бригады', en: 'Team assistant' } },
    ],
    mainLabel: { uz: 'Qoida', ru: 'Правило', en: 'Rule' },
    main: [
      {
        uz: "To'liqsiz bo'linuvchi bo'luvchidan katta bo'lishi kerak.",
        ru: 'Неполное делимое должно быть больше делителя.',
        en: 'The partial dividend must be larger than the divisor.',
      },
      {
        uz: "Bo'luvchini yumaloq songa yaxlitlab, sinash raqamini topamiz.",
        ru: 'Округляем делитель до круглого числа и находим пробную цифру.',
        en: 'We round the divisor and find the trial digit.',
      },
      {
        uz: "Ko'paytma katta chiqsa, raqamni bittaga kamaytiramiz.",
        ru: 'Если произведение велико, уменьшаем цифру на единицу.',
        en: 'If the product is too large, we decrease the digit by one.',
      },
      {
        uz: "Qoldiq bo'luvchidan kichik bo'lishi shart.",
        ru: 'Остаток обязан быть меньше делителя.',
        en: 'The remainder must be smaller than the divisor.',
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Tramvay yo'lga chiqadi: masofa, tezlik va vaqtni bog'lashni o'rganamiz.",
      ru: 'Трамвай выходит на линию: свяжем расстояние, скорость и время.',
      en: 'The tram sets off: we will link distance, speed and time.',
    },
    audio: {
      intro: {
        uz: [
          "Missiya bajarildi. Plastinkalar sakson uchta vagonga teng taqsimlandi.",
          "Bugun siz ikki xonali songa bo'lishni o'rgandingiz: bo'luvchini yaxlitlab sinash raqamini topish va uni tekshirib tuzatish.",
          "Unvonni ochish uchun bitta savol qoldi.",
        ],
        ru: [
          'Миссия выполнена. Пластины поровну распределены между восемьюдесятью тремя вагонами.',
          'Теперь ты умеешь делить на двузначное число. Находить пробную цифру округлением и исправлять её проверкой.',
          'До звания остался один вопрос.',
        ],
        en: [
          'Mission complete. The plates are shared equally between eighty-three carriages.',
          'Today you learned to divide by a two-digit number: to find the trial digit by rounding and to correct it by checking.',
          'One question stands between you and the title.',
        ],
      },
    },
  },
};

// ===========================================================================
// CHIZMALAR
// ===========================================================================

const DepotDefs = () => (
  <defs>
    <linearGradient id="d13sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#0A1F31" />
      <stop offset="100%" stopColor="#1B4659" />
    </linearGradient>
    <linearGradient id="d13car" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#E8E2D4" />
      <stop offset="52%" stopColor="#C7BFAC" />
      <stop offset="100%" stopColor="#8E8878" />
    </linearGradient>
    <linearGradient id="d13glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#9FD8E4" />
      <stop offset="100%" stopColor="#3B7E93" />
    </linearGradient>
  </defs>
);

// Tramvay vagoni: yon oyna qatori, chiroq, g'ildiraklar, tok oluvchi.
const Tram = ({ x, y, w, h, dim = false }) => (
  <g opacity={dim ? 0.4 : 1}>
    <rect x={x} y={y} width={w} height={h} rx={h * 0.28} fill="url(#d13car)" />
    <rect x={x + w * 0.06} y={y + h * 0.18} width={w * 0.88} height={h * 0.36} rx={h * 0.14} fill="url(#d13glass)" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={x + w * (0.1 + i * 0.21)} y={y + h * 0.2} width={w * 0.14} height={h * 0.32} rx="1.5" fill="#0E3444" opacity="0.35" />
    ))}
    <rect x={x + w * 0.04} y={y + h * 0.62} width={w * 0.92} height={h * 0.12} fill="#E2683F" />
    <circle cx={x + w * 0.24} cy={y + h + 2} r={h * 0.16} fill="#33414A" />
    <circle cx={x + w * 0.74} cy={y + h + 2} r={h * 0.16} fill="#33414A" />
    <path d={`M${x + w * 0.5} ${y} l-6 -10 M${x + w * 0.5} ${y} l7 -10`} stroke="#9FB0BA" strokeWidth="1.6" />
  </g>
);

const DepotScene = ({ solved = false, mode = 'hook' }) => {
  const t = useT();
  const done = mode === 'final' || solved;
  return (
    <div className="hero-scene">
      <div className="hero-head">
        <span>
          {t({
            uz: 'LUMO CITY · TRAMVAY DEPOSI',
            ru: 'LUMO CITY · ТРАМВАЙНОЕ ДЕПО',
            en: 'LUMO CITY · TRAM DEPOT',
          })}
        </span>
        <span className={done ? 'hero-state' : 'hero-state hero-state-alert'}>
          {done ? '83 × 74' : '6142 : 83 = ?'}
        </span>
      </div>
      <div className="hero-body">
        <FitSvg viewBox="0 0 560 250">
          <DepotDefs />
          <rect x="0" y="0" width="560" height="250" rx="16" fill="url(#d13sky)" />
          <path d="M60 196 L60 62 L500 62 L500 196 Z" fill="#153A4C" />
          <path d="M46 62 L280 30 L514 62 Z" fill="#22576C" />
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <rect x="76" y={126 + r * 40} width="408" height="3" fill="#5C7480" opacity="0.55" />
              <Tram x={92 + r * 18} y={98 + r * 40} w={150} h={26} />
              <Tram x={264 + r * 18} y={98 + r * 40} w={150} h={26} dim={!done && r === 2} />
            </g>
          ))}
          <rect x="0" y="236" width="560" height="14" fill="#07161F" />
          <text x="280" y="228" textAnchor="middle" fill={done ? '#B7D77A' : '#8FA4B0'} fontSize="12" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            {done ? '74' : '?'}
          </text>
        </FitSvg>
      </div>
    </div>
  );
};

// s3, s5 — yaxlitlash va sinash raqamini tekshirish
const TrialFigure = ({ frame = 0, mode = 's3' }) => {
  const t = useT();
  const checks = [
    { label: '83 × 7', value: '581', cmp: '581 < 614', ok: true },
    { label: '614 − 581', value: '33', cmp: '33 < 83', ok: true },
  ];
  if (mode === 's3') {
    return (
      <FitSvg viewBox="0 0 520 232">
        <text x="260" y="34" textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
          {t({ uz: "Bo'luvchini yaxlitlaymiz", ru: 'Округляем делитель', en: 'We round the divisor' })}
        </text>
        <g opacity={frame >= 1 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
          <rect x="70" y="60" width="170" height="62" rx="14" fill="#FFFFFF" stroke={T.ink3} strokeWidth="2" />
          <text x="155" y="100" textAnchor="middle" fill={T.ink} fontSize="24" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            614 : 83
          </text>
        </g>
        <g opacity={frame >= 2 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
          <path d="M248 91 l24 0" stroke={T.cyan} strokeWidth="2.4" strokeDasharray="5 4" />
          <path d="M276 91 l-9 -6 v12 z" fill={T.cyan} />
          <rect x="286" y="60" width="170" height="62" rx="14" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="2" />
          <text x="371" y="100" textAnchor="middle" fill={T.cyan} fontSize="24" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            61 : 8
          </text>
        </g>
        <g opacity={frame >= 3 ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
          <text x="260" y="168" textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
            {t({ uz: 'Sinash raqami', ru: 'Пробная цифра', en: 'Trial digit' })}
          </text>
          <circle cx="260" cy="198" r="20" fill={T.accentSoft} stroke={T.accent} strokeWidth="2.4" />
          <text x="260" y="206" textAnchor="middle" fill={T.accent} fontSize="24" fontWeight="800" fontFamily="JetBrains Mono, monospace">
            7
          </text>
        </g>
      </FitSvg>
    );
  }
  return (
    <FitSvg viewBox="0 0 520 232">
      <text x="260" y="32" textAnchor="middle" fill={T.ink2} fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
        {t({ uz: 'Ikkita shart', ru: 'Два условия', en: 'Two conditions' })}
      </text>
      {checks.map((row, index) => {
        const on = frame >= index + 2;
        const y = 58 + index * 78;
        return (
          <g key={index} opacity={on ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
            <rect x="52" y={y} width="416" height="62" rx="14" fill="#FFFFFF" stroke={T.success} strokeWidth="2" />
            <text x="80" y={y + 39} fill={T.ink} fontSize="20" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {row.label} = {row.value}
            </text>
            <text x="300" y={y + 39} fill={T.ink2} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {row.cmp}
            </text>
            <circle cx="440" cy={y + 31} r="15" fill={T.successSoft} />
            <text x="440" y={y + 38} textAnchor="middle" fill={T.success} fontSize="17" fontWeight="800" fontFamily="Manrope, sans-serif">
              ✓
            </text>
          </g>
        );
      })}
      <text x="260" y="224" textAnchor="middle" fill={T.ink3} fontSize="12" fontFamily="Manrope, sans-serif">
        {t({
          uz: "Ikkalasi ham bajarilsa, raqam to'g'ri",
          ru: 'Если оба выполнены, цифра верна',
          en: 'If both hold, the digit is right',
        })}
      </text>
    </FitSvg>
  );
};

// s9, s10 — sinash raqami katta chiqqan holat
const CorrectionFigure = ({ frame = 0, solved = false, mode = 's9' }) => {
  const t = useT();
  const show = mode === 's10' ? (solved ? 3 : 1) : frame;
  const rows = [
    { digit: '5', product: '67 × 5 = 335', verdict: '335 > 301', ok: false },
    { digit: '4', product: '67 × 4 = 268', verdict: '268 < 301', ok: true },
  ];
  return (
    <FitSvg viewBox="0 0 520 232">
      <text x="260" y="30" textAnchor="middle" fill={T.ink} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        301 : 67
      </text>
      {rows.map((row, index) => {
        const on = show >= index + 2 || (mode === 's10' && (index === 0 || solved));
        const y = 54 + index * 82;
        const color = row.ok ? T.success : T.accent;
        return (
          <g key={index} opacity={on ? 1 : 0.28} style={{ transition: 'opacity .4s' }}>
            <rect x="44" y={y} width="432" height="66" rx="15" fill={row.ok ? T.successSoft : '#FFF6F3'} stroke={color} strokeWidth="2" />
            <circle cx="80" cy={y + 33} r="19" fill="#FFFFFF" stroke={color} strokeWidth="2" />
            <text x="80" y={y + 41} textAnchor="middle" fill={color} fontSize="21" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {row.digit}
            </text>
            <text x="118" y={y + 41} fill={T.ink} fontSize="19" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {row.product}
            </text>
            <text x="320" y={y + 41} fill={color} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {row.verdict}
            </text>
            <text x="452" y={y + 41} textAnchor="middle" fill={color} fontSize="18" fontWeight="800" fontFamily="Manrope, sans-serif">
              {row.ok ? '✓' : '✕'}
            </text>
          </g>
        );
      })}
      <text x="260" y="226" textAnchor="middle" fill={T.ink3} fontSize="12" fontFamily="Manrope, sans-serif">
        {t({
          uz: "Katta chiqsa — bittaga kamaytiramiz",
          ru: 'Если велика — уменьшаем на единицу',
          en: 'If too big, decrease by one',
        })}
      </text>
    </FitSvg>
  );
};

// s11 — reja
const PlanFigure = ({ frame = 0 }) => {
  const t = useT();
  const steps = [
    { uz: "Birinchi to'liqsiz bo'linuvchini topaman", ru: 'Нахожу первое неполное делимое', en: 'I find the first partial dividend' },
    { uz: "Bo'linmada nechta raqam bo'lishini aniqlayman", ru: 'Определяю число цифр частного', en: 'I work out the number of quotient digits' },
    { uz: "Bo'luvchini yaxlitlab sinash raqamini topaman", ru: 'Округляю делитель и нахожу пробную цифру', en: 'I round the divisor and find the trial digit' },
    { uz: "Ko'paytirib tekshiraman, kerak bo'lsa tuzataman", ru: 'Проверяю умножением, при нужде исправляю', en: 'I check by multiplying and correct if needed' },
    { uz: "Ayiraman va keyingi raqamni tushiraman", ru: 'Вычитаю и сношу следующую цифру', en: 'I subtract and bring down the next digit' },
  ];
  const colors = [T.cyan, T.navy, T.accent, T.warn, T.success];
  return (
    <FitSvg viewBox="0 0 520 232">
      {steps.map((step, index) => {
        const on = frame >= index || frame >= steps.length - 1;
        const y = 12 + index * 43;
        return (
          <g key={index} opacity={on ? 1 : 0.3} style={{ transition: 'opacity .4s' }}>
            <rect x="22" y={y} width="476" height="37" rx="11" fill="#FFFFFF" stroke="rgba(23,59,82,.13)" strokeWidth="1.4" />
            <rect x="22" y={y} width="5" height="37" rx="2.5" fill={colors[index]} />
            <circle cx="52" cy={y + 18} r="12" fill={colors[index]} />
            <text x="52" y={y + 24} textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              {index + 1}
            </text>
            <text x="76" y={y + 24} fill={T.ink} fontSize="14" fontWeight="650" fontFamily="Manrope, sans-serif">
              {t(step)}
            </text>
          </g>
        );
      })}
    </FitSvg>
  );
};

// ===========================================================================
// EKRANLAR
// ===========================================================================
const Screen0 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={0} figure={({ solved }) => <DepotScene solved={solved} />} />
);
const Screen1 = (props) => (
  <RevealScreen
    {...props}
    figure={({ frame }) => (
      <DivisionColumn dividend="6142" divisor="83" quotient="74" quotientMask="??" steps={MAIN_STEPS} frame={frame >= 3 ? 1 : 0} />
    )}
  />
);
const Screen2 = (props) => (
  <SpanSelect {...props} figure={({ picked }) => <QuotientLengthFigure dividend="6142" divisor="83" firstLen={picked === null ? 3 : picked + 1} />} />
);
const Screen3 = (props) => <RevealScreen {...props} figure={({ frame }) => <TrialFigure frame={frame} mode="s3" />} />;
const Screen4 = (props) => <NumPadScreen {...props} figure={() => <TrialFigure frame={3} mode="s3" />} />;
const Screen5 = (props) => <RevealScreen {...props} figure={({ frame }) => <TrialFigure frame={frame} mode="s5" />} />;
const Screen6 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    figure={({ solved }) => (
      <DivisionColumn
        dividend="6142"
        divisor="83"
        quotient="74"
        quotientMask={solved ? '74' : '7?'}
        steps={MAIN_STEPS}
        frame={solved ? 2 : 1}
      />
    )}
  />
);
const Screen7 = (props) => (
  <RevealScreen
    {...props}
    figure={({ frame }) => (
      <DivisionColumn
        dividend="6142"
        divisor="83"
        quotient="74"
        quotientMask={frame >= 3 ? '74' : '7?'}
        steps={MAIN_STEPS}
        frame={frame >= 2 ? 2 : 1}
      />
    )}
  />
);
const Screen8 = (props) => (
  <NumPadScreen
    {...props}
    figure={({ solved }) => (
      <DivisionColumn dividend="6142" divisor="83" quotient="74" quotientMask={solved ? '74' : '??'} steps={MAIN_STEPS} revealAll />
    )}
  />
);
const Screen9 = (props) => <RevealScreen {...props} figure={({ frame }) => <CorrectionFigure frame={frame} mode="s9" />} />;
const Screen10 = (props) => (
  <ChoiceScreen {...props} ordinal={2} figure={({ solved }) => <CorrectionFigure mode="s10" solved={solved} />} />
);
const Screen11 = (props) => <RevealScreen {...props} figure={({ frame }) => <PlanFigure frame={frame} />} />;
const Screen12 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={3}
    stack
    figure={({ solved }) => (
      <DivisionColumn
        dividend="5096"
        divisor="56"
        quotient="91"
        quotientMask={solved ? '91' : '8?'}
        steps={solved
          ? [{ bring: '509', sub: '504', rest: '5', digit: '9' }, { bring: '56', sub: '56', rest: '0', digit: '1' }]
          : [{ bring: '509', sub: '448', rest: '61', digit: '8' }, { bring: '612', sub: '560', rest: '52', digit: '?' }]}
        revealAll
        highlightStep={solved ? -1 : 0}
      />
    )}
  />
);
const Screen13 = (props) => (
  <ChoiceScreen {...props} plain ratio="28 / 25" ordinal={4} figure={({ solved }) => <DepotScene mode="final" solved={solved} />} />
);
const Screen14 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14,
];

export default function Grade4Dars13(props) {
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
