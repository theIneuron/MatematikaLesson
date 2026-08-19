// ============================================================
// 6 КЛАСС, УРОК 31 «Буквенные выражения»
// Собран по context/GRADE6_ETALON.md на общем слое ./screens.jsx.
//
// Блок Б8, второй урок. Буква вводится не как «неизвестное», а как
// величина, которая МЕНЯЕТСЯ: пока часов проката один, два, три, запись
// каждый раз новая, а с буквой она одна на все случаи. Значение
// выражения считается подстановкой, в том числе отрицательного числа
// из блока Б7.
//
// Сцена — прокат велосипедов у школьных ворот.
// ============================================================

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import {
  T,
  configureLesson,
  registerLesson,
  navLocked,
  tri,
  pickL,
  mt,
  LangContext,
  useLang,
  useT,
  useMobileZoom,
  useAudio,
  getAudioEngine,
  PREVIEW_START,
  BASE_STYLES,
  Stage,
  Person,
  NavBack,
  NavNext,
  NextLabel,
  BackLabel,
  HintBlock,
  FeedbackBlock,
  FactCard,
  FB_HIST,
  AnimDigits,
  MethodCard,
  HookScreen,
  RevealScreen,
  RuleScreen,
  Classify,
  MultiTask,
  FinalPanel,
  SummaryScreen,
} from './screens.jsx';

const TOTAL_SCREENS = 15;

const LESSON_META = {
  lessonId: 'grade6-31',
  lessonTitle: {
    ru: 'Буквенные выражения',
    uz: 'Harfli ifodalar',
    en: 'Letter expressions',
  },
};

const SCREEN_META = [
  { id: 's_hook',   type: 'hook',        template: 'HookScreen',    scored: false, scope: 'hook' },     //  1 prokat: 5000 + t yoki 5000 · t
  { id: 's_recall', type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  2 sonli ifoda va uning qiymati
  { id: 's_core',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  3 harf o'rniga son qo'yiladi
  { id: 's_tool',   type: 'exploration', template: 'custom',        scored: false, scope: null },       //  4 USUL: koeffitsiyent va qiymat
  { id: 's_form',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  5 ikki qismli formula va perimetr
  { id: 's_solve',  type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  6 birga yechamiz: manfiy qiymat
  { id: 's_edge',   type: 'exploration', template: 'RevealScreen',  scored: false, scope: null },       //  7 chegara: 5a bu 5 + a emas
  { id: 's_rule',   type: 'rule',        template: 'RuleScreen',    scored: false, scope: null },       //  8 QOIDA + xukka qaytish
  { id: 's_write',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, //  9 ifodani yozish x3
  { id: 's_value',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 10 qiymatni topish x4
  { id: 's_bins',   type: 'test',        template: 'Classify',      scored: true,  scope: 'practice' }, // 11 savatlar: 5a yoki 5 + a
  { id: 's_error',  type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 12 xatoni topish x2
  { id: 's_task',   type: 'test',        template: 'MultiTask',     scored: true,  scope: 'practice' }, // 13 MASALA: prokat narxi
  { id: 's_final',  type: 'test',        template: 'FinalPanel',    scored: true,  scope: 'final' },    // 14 yakuniy test x5
  { id: 's14',      type: 'summary',     template: 'SummaryScreen', scored: false, scope: null },       // 15 xulosa
];

registerLesson({ meta: LESSON_META, screenMeta: SCREEN_META });

const CONTENT = {
  s_hook: {
    eyebrow: { ru: 'Зачем это нужно', uz: 'Bu nimaga kerak', en: 'Why you need this' },
    title: { ru: 'Прокат велосипедов', uz: 'Velosiped prokati', en: 'The bike rental' },
    lead: {
      ru: 'На табличке: 1 час — 5000 сум. Диёра берёт велосипед на t часов.',
      uz: "Lavhada: 1 soat — 5000 so'm. Diyora velosipedni t soatga oladi.",
      en: 'The sign says: 1 hour is 5000 soums. Diyora rents a bike for t hours.',
    },
    voice_a: { ru: 'Азиз записал: 5000 + t', uz: 'Aziz yozdi: 5000 + t', en: 'Aziz wrote: 5000 + t' },
    voice_b: { ru: 'Диёра записала: 5000 · t', uz: 'Diyora yozdi: 5000 · t', en: 'Diyora wrote: 5000 · t' },
    ask: { ru: 'Какая запись даёт стоимость?', uz: 'Qaysi yozuv narxni beradi?', en: 'Which one gives the cost?' },
    options: [
      { ru: '5000 + t', uz: '5000 + t', en: '5000 + t' },
      { ru: '5000 · t', uz: '5000 · t', en: '5000 · t' },
    ],
    gesture: {
      ru: 'Нажми один из вариантов. Ответ проверим по ходу урока.',
      uz: 'Variantlardan birini bosing. Javobni dars davomida tekshiramiz.',
      en: 'Tap one of the options. We will check the answer during the lesson.',
    },
    audio: {
      intro: {
        ru: [
          'У школьных ворот работает прокат велосипедов. На табличке написано: один час пять тысяч сум. Диёра берёт велосипед на несколько часов, и это число обозначили буквой тэ.',
          'Азиз записал стоимость как пять тысяч плюс тэ, а Диёра как пять тысяч умножить на тэ. Какая запись даёт стоимость? Выбери ответ. Проверим его по ходу урока.',
        ],
        uz: [
          "Maktab darvozasi yonida velosiped prokati ishlaydi. Lavhada yozilgan: bir soat besh ming so'm. Diyora velosipedni bir necha soatga oladi, bu son te harfi bilan belgilangan.",
          "Aziz narxni besh ming qo'shuv te deb yozdi, Diyora esa besh ming karra te deb yozdi. Qaysi yozuv narxni beradi? Javobni tanlang. Uni dars davomida tekshiramiz.",
        ],
        en: [
          'A bike rental works by the school gate. The sign says one hour is five thousand soums. Diyora rents a bike for a number of hours, written as the letter t.',
          'Aziz wrote the cost as five thousand plus t, Diyora as five thousand times t. Which one gives the cost? Choose an answer. We will check it during the lesson.',
        ],
      },
    },
  },

  s_recall: {
    eyebrow: { ru: 'Вспомним', uz: 'Eslaymiz', en: 'Recall' },
    title: { ru: 'Числовое выражение и его значение', uz: 'Sonli ifoda va uning qiymati', en: 'A numeric expression and its value' },
    done: {
      ru: 'Пока часов ровно три, запись годится один раз. Для двух часов её придётся написать заново.',
      uz: "Soat roppa-rosa uchta bo'lgunicha yozuv bir martaga yaraydi. Ikki soat uchun uni qaytadan yozishga to'g'ri keladi.",
      en: 'While it is exactly three hours the line works once. For two hours you must write it again.',
    },
    audio: {
      ru: [
        'Вспомним начальную школу. Запись пять тысяч умножить на три это числовое выражение, а пятнадцать тысяч его значение.',
        'Чтобы найти значение, достаточно выполнить действия.',
        'Но такая запись годится ровно для трёх часов. Для двух её придётся писать заново, и для четырёх тоже.',
      ],
      uz: [
        "Boshlang'ich sinfni eslaymiz. Besh ming karra uch yozuvi sonli ifoda, o'n besh ming esa uning qiymati.",
        "Qiymatni topish uchun amallarni bajarish kifoya.",
        "Ammo bunday yozuv aynan uch soat uchun yaraydi. Ikki soat uchun uni qaytadan yozish kerak, to'rt uchun ham shunday.",
      ],
      en: [
        'Recall primary school. Five thousand times three is a numeric expression and fifteen thousand is its value.',
        'To find the value you just carry out the operations.',
        'But that line fits exactly three hours. For two you must write it again, and for four as well.',
      ],
    },
  },

  s_core: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Одна запись на все случаи', uz: 'Barcha hollarga bitta yozuv', en: 'One line for every case' },
    rows: [
      { t: '2', calc: '5000 · 2', res: '10 000' },
      { t: '3', calc: '5000 · 3', res: '15 000' },
      { t: '4', calc: '5000 · 4', res: '20 000' },
      { t: 't', calc: '5000 · t', res: '?' },
    ],
    lines: [
      { ru: 'меняется только число часов', uz: "faqat soatlar soni o'zgaradi", en: 'only the number of hours changes' },
      { ru: 'ставим на его место букву t', uz: "uning o'rniga t harfini qo'yamiz", en: 'put the letter t in its place' },
      { ru: '5000 · t — стоимость при любом t', uz: "5000 · t — istalgan t dagi narx", en: '5000 · t is the cost for any t' },
    ],
    done: {
      ru: 'Буква стоит на месте числа, которое меняется. Проверка Азиза: при t = 3 его запись даёт 5003 сум — цена не может быть такой. Права была Диёра.',
      uz: "Harf o'zgaradigan sonning o'rnida turadi. Azizni tekshiramiz: t = 3 da uning yozuvi 5003 so'm beradi — narx bunday bo'lolmaydi. Diyora haq edi.",
      en: 'The letter stands where the changing number was. Check Aziz: at t = 3 his line gives 5003 soums, which cannot be the price. Diyora was right.',
    },
    audio: {
      ru: [
        'Посмотрим на столбик. Два часа десять тысяч, три часа пятнадцать тысяч, четыре часа двадцать тысяч. Пять тысяч повторяется, а меняется только число часов.',
        'Поставим на место этого числа букву тэ. Получилась одна запись на все случаи: пять тысяч умножить на тэ.',
        'Проверим Азиза. При тэ равном трём его запись даёт пять тысяч три сума. Такой цены быть не может: три часа стоят пятнадцать тысяч. Права была Диёра.',
      ],
      uz: [
        "Ustunga qaraymiz. Ikki soat o'n ming, uch soat o'n besh ming, to'rt soat yigirma ming. Besh ming takrorlanadi, faqat soatlar soni o'zgaradi.",
        "Shu sonning o'rniga te harfini qo'yamiz. Barcha hollarga bitta yozuv chiqdi: besh ming karra te.",
        "Azizni tekshiramiz. Te uchga teng bo'lganda uning yozuvi besh ming uch so'm beradi. Bunday narx bo'lishi mumkin emas: uch soat o'n besh ming turadi. Diyora haq edi.",
      ],
      en: [
        'Look at the column. Two hours ten thousand, three hours fifteen thousand, four hours twenty thousand. Five thousand repeats, only the number of hours changes.',
        'Put the letter t in place of that number. Now one line covers every case: five thousand times t.',
        'Check Aziz. At t equal to three his line gives five thousand and three soums. No such price exists: three hours cost fifteen thousand. Diyora was right.',
      ],
    },
  },

  s_tool: {
    eyebrow: { ru: 'Смотри и повтори', uz: 'Qarang va takrorlang', en: 'Watch, then try' },
    title: { ru: 'Подставляем число', uz: "Sonni qo'yamiz", en: 'Substituting a number' },
    demo_banner: { ru: 'Смотри — покажу на примере', uz: "Qarang — misolda ko'rsataman", en: 'Watch — I will show an example' },
    play_banner: { ru: 'Теперь твоя очередь', uz: 'Endi navbat sizniki', en: 'Now it is your turn' },
    again: { ru: 'Ещё раз', uz: 'Yana', en: 'Again' },
    to_play: { ru: 'Теперь я сам!', uz: "Endi o'zim!", en: 'Now on my own!' },
    label_coef: { ru: 'коэффициент', uz: 'koeffitsiyent', en: 'coefficient' },
    label_var: { ru: 'переменная', uz: "o'zgaruvchi", en: 'variable' },
    demo_lines: [
      { ru: 'в записи 5000t знак умножения не пишут', uz: "5000t yozuvida ko'paytirish belgisi yozilmaydi", en: 'in 5000t the times sign is not written' },
      { ru: 'подставим t = 4: 5000 · 4', uz: "t = 4 ni qo'yamiz: 5000 · 4", en: 'substitute t = 4: 5000 · 4' },
      { ru: 'значение выражения: 20 000', uz: 'ifoda qiymati: 20 000', en: 'the value of the expression: 20 000' },
    ],
    demo_note: {
      ru: 'Число перед буквой называют коэффициентом, саму букву переменной. Знак умножения между ними опускают.',
      uz: "Harf oldidagi sonni koeffitsiyent, harfning o'zini o'zgaruvchi deb atashadi. Ular orasidagi ko'paytirish belgisi tushirib qoldiriladi.",
      en: 'The number before the letter is the coefficient, the letter itself the variable. The times sign between them is dropped.',
    },
    play_ask: { ru: 'Чему равно 7a при a = 6?', uz: 'a = 6 da 7a nimaga teng?', en: 'What is 7a when a = 6?' },
    play_opts: ['42', '13', '76'],
    play_correct: 0,
    play_ok: {
      ru: 'Верно. 7a значит 7 · a, подставили 6 и получили 42.',
      uz: "To'g'ri. 7a bu 7 · a, 6 ni qo'ydik va 42 chiqdi.",
      en: 'Right. 7a means 7 · a, substitute 6 and get 42.',
    },
    play_wrong: [
      null,
      { ru: 'Это сумма, а между числом и буквой стоит умножение.', uz: "Bu yig'indi, son bilan harf orasida esa ko'paytirish turadi.", en: 'That is a sum, but between the number and the letter there is multiplication.' },
      { ru: 'Цифры просто приписали друг к другу, а нужно перемножить.', uz: "Raqamlar shunchaki yonma-yon yozilgan, ko'paytirish kerak esa.", en: 'The digits were just written side by side instead of multiplied.' },
    ],
    audio: {
      intro: {
        ru: 'Покажу, как находят значение буквенного выражения. Возьмём запись пять тысяч тэ.',
        uz: "Harfli ifoda qiymati qanday topilishini ko'rsataman. Besh ming te yozuvini olamiz.",
        en: 'I will show how the value of a letter expression is found. Take the line five thousand t.',
      },
      demo: {
        ru: 'Между числом и буквой стоит умножение, но знак не пишут. Число перед буквой называют коэффициентом, а саму букву переменной. Подставим вместо тэ четвёрку: пять тысяч умножить на четыре это двадцать тысяч.',
        uz: "Son bilan harf orasida ko'paytirish turadi, lekin belgi yozilmaydi. Harf oldidagi sonni koeffitsiyent, harfning o'zini o'zgaruvchi deb atashadi. Te o'rniga to'rtni qo'yamiz: besh ming karra to'rt bu yigirma ming.",
        en: 'Between the number and the letter there is multiplication, but the sign is not written. The number before the letter is the coefficient, the letter is the variable. Substitute four for t: five thousand times four is twenty thousand.',
      },
      play: {
        ru: 'Теперь ваша очередь. Чему равно семь а, если а равно шести?',
        uz: "Endi sizning navbatingiz. a oltiga teng bo'lsa, yetti a nimaga teng?",
        en: 'Now it is your turn. What is seven a when a is six?',
      },
      ok: {
        ru: 'Верно. Семь умножить на шесть это сорок два.',
        uz: "To'g'ri. Yetti karra olti bu qirq ikki.",
        en: 'Right. Seven times six is forty two.',
      },
      wrong: {
        ru: 'Между коэффициентом и переменной всегда умножение, даже если знак не написан.',
        uz: "Koeffitsiyent bilan o'zgaruvchi orasida doim ko'paytirish bo'ladi, belgi yozilmagan bo'lsa ham.",
        en: 'Between the coefficient and the variable there is always multiplication, even with no sign written.',
      },
    },
  },

  s_form: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    title: { ru: 'Формула из двух частей', uz: 'Ikki qismli formula', en: 'A formula with two parts' },
    lines: [
      { ru: 'прокат берёт залог 10 000 сум', uz: "prokat 10 000 so'm garov oladi", en: 'the rental takes a 10 000 soum deposit' },
      { ru: 'залог не зависит от часов', uz: "garov soatlarga bog'liq emas", en: 'the deposit does not depend on the hours' },
      { ru: 'всего: 5000t + 10 000', uz: "jami: 5000t + 10 000", en: 'in total: 5000t + 10 000' },
    ],
    peri: { ru: 'периметр квадрата со стороной a: P = 4a', uz: "tomoni a bo'lgan kvadrat perimetri: P = 4a", en: 'perimeter of a square with side a: P = 4a' },
    done: {
      ru: 'Часть выражения меняется вместе с буквой, часть остаётся постоянной. Формула — это буквенное выражение, которому дали имя.',
      uz: "Ifodaning bir qismi harf bilan birga o'zgaradi, bir qismi doimiy qoladi. Formula — bu nom berilgan harfli ifoda.",
      en: 'One part of the expression changes with the letter, another stays fixed. A formula is a letter expression that has been given a name.',
    },
    audio: {
      ru: [
        'Прокат берёт ещё и залог, десять тысяч сум, и он один и тот же при любом числе часов.',
        'Значит вся сумма это пять тысяч тэ плюс десять тысяч. Первая часть меняется вместе с буквой, вторая остаётся постоянной.',
        'Такие записи есть и в геометрии. Периметр квадрата со стороной а это четыре а. Буквенное выражение, которому дали имя, называют формулой.',
      ],
      uz: [
        "Prokat yana garov ham oladi, o'n ming so'm, va u istalgan soatlar sonida bir xil.",
        "Demak butun summa besh ming te qo'shuv o'n ming. Birinchi qism harf bilan birga o'zgaradi, ikkinchisi doimiy qoladi.",
        "Bunday yozuvlar geometriyada ham bor. Tomoni a bo'lgan kvadrat perimetri to'rt a. Nom berilgan harfli ifodani formula deb atashadi.",
      ],
      en: [
        'The rental also takes a deposit, ten thousand soums, the same for any number of hours.',
        'So the whole sum is five thousand t plus ten thousand. The first part changes with the letter, the second stays fixed.',
        'Such lines appear in geometry too. The perimeter of a square with side a is four a. A letter expression with a name is called a formula.',
      ],
    },
  },

  s_solve: {
    eyebrow: { ru: 'Решаем вместе', uz: 'Birga yechamiz', en: 'Solving together' },
    title: { ru: 'Значение при отрицательном числе', uz: 'Manfiy sondagi qiymat', en: 'The value at a negative number' },
    lead: { ru: 'Найдём значение 3x + 7 при x = 4 и при x = −2.', uz: '3x + 7 ning x = 4 va x = −2 dagi qiymatini topamiz.', en: 'Find the value of 3x + 7 at x = 4 and at x = −2.' },
    steps: [
      { ru: 'x = 4: 3 · 4 + 7 = 19', uz: 'x = 4: 3 · 4 + 7 = 19', en: 'x = 4: 3 · 4 + 7 = 19' },
      { ru: 'x = −2: 3 · (−2) + 7', uz: 'x = −2: 3 · (−2) + 7', en: 'x = −2: 3 · (−2) + 7' },
      { ru: '= −6 + 7 = 1', uz: '= −6 + 7 = 1', en: '= −6 + 7 = 1' },
    ],
    done: {
      ru: 'Отрицательное число подставляют в скобках, дальше работают правила знаков из уроков 27 и 29.',
      uz: "Manfiy son qavs ichida qo'yiladi, keyin 27 va 29-darslardagi ishoralar qoidasi ishlaydi.",
      en: 'A negative number is substituted in brackets, then the sign rules of lessons 27 and 29 take over.',
    },
    audio: {
      ru: [
        'Решаем вместе. Найдём значение выражения три икс плюс семь.',
        'Сначала при икс равном четырём. Три умножить на четыре двенадцать, плюс семь девятнадцать.',
        'Теперь при икс равном минус двум. Отрицательное число подставляем в скобках: три умножить на минус два это минус шесть, а минус шесть плюс семь это один. Пригодились правила знаков из двадцать седьмого и двадцать девятого уроков.',
      ],
      uz: [
        "Birga yechamiz. Uch iks qo'shuv yetti ifodasining qiymatini topamiz.",
        "Avval iks to'rtga teng bo'lganda. Uch karra to'rt o'n ikki, qo'shuv yetti o'n to'qqiz.",
        "Endi iks minus ikkiga teng bo'lganda. Manfiy sonni qavs ichida qo'yamiz: uch karra minus ikki bu minus olti, minus olti qo'shuv yetti esa bir. Yigirma yettinchi va yigirma to'qqizinchi darslardagi ishoralar qoidasi asqotdi.",
      ],
      en: [
        'Let us solve it together. Find the value of three x plus seven.',
        'First at x equal to four. Three times four is twelve, plus seven is nineteen.',
        'Now at x equal to minus two. A negative number goes in brackets: three times minus two is minus six, and minus six plus seven is one. The sign rules from lessons twenty seven and twenty nine came in handy.',
      ],
    },
  },

  s_edge: {
    eyebrow: { ru: 'Где ошибаются', uz: 'Qayerda xato qilishadi', en: 'Where mistakes happen' },
    title: { ru: 'Рядом — значит умножить', uz: "Yonma-yon — ko'paytirish demak", en: 'Side by side means multiply' },
    bad_line: { ru: 'ошибка: 5a при a = 3 это 53', uz: 'xato: a = 3 da 5a bu 53', en: 'mistake: 5a at a = 3 is 53' },
    good_line: { ru: 'верно: 5a = 5 · 3 = 15', uz: "to'g'ri: 5a = 5 · 3 = 15", en: 'right: 5a = 5 · 3 = 15' },
    warn_line: { ru: '5 + a — это другое выражение, при a = 3 даёт 8', uz: "5 + a — boshqa ifoda, a = 3 da 8 beradi", en: '5 + a is a different expression, at a = 3 it gives 8' },
    done: {
      ru: 'Буква рядом с числом означает умножение, а не приписывание цифры. «В 5 раз больше» — это 5a, «на 5 больше» — это a + 5.',
      uz: "Son yonidagi harf ko'paytirishni bildiradi, raqamni yonma-yon yozishni emas. «5 marta ko'p» bu 5a, «5 ga ko'p» esa a + 5.",
      en: 'A letter next to a number means multiplication, not sticking digits together. “Five times more” is 5a, “five more” is a + 5.',
    },
    audio: {
      ru: [
        'Главная ошибка урока. Видят пять а, подставляют тройку и пишут пятьдесят три, просто приписав цифру.',
        'Но между числом и буквой стоит умножение. Пять умножить на три это пятнадцать.',
        'И различайте два оборота речи. В пять раз больше это пять а. На пять больше это а плюс пять. Это разные выражения, и значения у них разные.',
      ],
      uz: [
        "Darsning asosiy xatosi. Besh a ni ko'rib, uchni qo'yishadi va raqamni yonma-yon yozib ellik uch deb yozishadi.",
        "Ammo son bilan harf orasida ko'paytirish turadi. Besh karra uch bu o'n besh.",
        "Ikki iborani farqlang. Besh marta ko'p bu besh a. Besh ga ko'p esa a qo'shuv besh. Bular har xil ifodalar va qiymatlari ham har xil.",
      ],
      en: [
        'The main mistake of this lesson. Seeing five a, students substitute three and write fifty three by sticking the digits together.',
        'But between the number and the letter there is multiplication. Five times three is fifteen.',
        'And tell two phrases apart. Five times more is five a. Five more is a plus five. Different expressions with different values.',
      ],
    },
  },

  s_rule: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    title: { ru: 'Буква вместо числа', uz: "Son o'rniga harf", en: 'A letter instead of a number' },
    rule_1: {
      ru: 'В буквенном выражении буква стоит на месте числа, которое меняется. Число перед буквой — коэффициент, знак умножения между ними не пишут.',
      uz: "Harfli ifodada harf o'zgaradigan sonning o'rnida turadi. Harf oldidagi son koeffitsiyent, ular orasidagi ko'paytirish belgisi yozilmaydi.",
      en: 'In a letter expression the letter stands where a changing number was. The number before it is the coefficient, and the times sign between them is not written.',
    },
    rule_2: {
      ru: 'Чтобы найти значение, подставляют число вместо буквы; отрицательное — в скобках. Прокат: стоимость 5000t, при t = 3 это 15 000 сум. Права была Диёра.',
      uz: "Qiymatni topish uchun harf o'rniga son qo'yiladi; manfiysi qavs ichida. Prokat: narx 5000t, t = 3 da bu 15 000 so'm. Diyora haq edi.",
      en: 'To find the value, substitute a number for the letter; a negative one goes in brackets. The rental: the cost is 5000t, at t = 3 that is 15 000 soums. Diyora was right.',
    },
    audio: {
      ru: 'Запомним правило. В буквенном выражении буква стоит на месте числа, которое меняется. Число перед буквой называют коэффициентом, знак умножения между ними не пишут. Чтобы найти значение выражения, вместо буквы подставляют число, а отрицательное число берут в скобки. Вернёмся к прокату. Стоимость это пять тысяч тэ, и при тэ равном трём получается пятнадцать тысяч сум. Права была Диёра.',
      uz: "Qoidani eslab qolamiz. Harfli ifodada harf o'zgaradigan sonning o'rnida turadi. Harf oldidagi sonni koeffitsiyent deb atashadi, ular orasidagi ko'paytirish belgisi yozilmaydi. Ifoda qiymatini topish uchun harf o'rniga son qo'yiladi, manfiy son esa qavsga olinadi. Prokatga qaytamiz. Narx besh ming te, te uchga teng bo'lganda o'n besh ming so'm chiqadi. Diyora haq edi.",
      en: 'Let us remember the rule. In a letter expression the letter stands where a changing number was. The number before it is the coefficient, and the times sign is not written. To find the value, substitute a number for the letter, taking a negative one in brackets. Back to the rental. The cost is five thousand t, and at t equal to three that is fifteen thousand soums. Diyora was right.',
    },
  },

  s_write: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Записываем выражение', uz: 'Ifodani yozamiz', en: 'Writing the expression' },
    lead: { ru: 'Считать не нужно: только запиши.', uz: 'Hisoblash shart emas: faqat yozing.', en: 'No computing: just write it.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Тетрадь стоит b сум. Сколько стоят 6 тетрадей?', uz: "Daftar b so'm turadi. 6 ta daftar qancha turadi?", en: 'A notebook costs b soums. What do 6 notebooks cost?' },
        opts: ['6b', 'b + 6', 'b − 6'],
        correct: 0,
        ok: { ru: 'Верно. Цену повторили 6 раз, это умножение.', uz: "To'g'ri. Narx 6 marta takrorlandi, bu ko'paytirish.", en: 'Right. The price repeats 6 times, that is multiplication.' },
        wrong: [
          null,
          { ru: 'Это цена, увеличенная на 6 сум, а не шесть тетрадей.', uz: "Bu 6 so'mga oshirilgan narx, olti daftar emas.", en: 'That is the price raised by 6 soums, not six notebooks.' },
          { ru: 'Ничего не уменьшают, тетрадей стало больше.', uz: "Hech narsa kamaymaydi, daftarlar ko'paydi.", en: 'Nothing is reduced, there are more notebooks.' },
        ],
      },
      {
        q: { ru: 'В классе a учеников, пришли ещё 5. Сколько стало?', uz: "Sinfda a o'quvchi bor edi, yana 5 tasi keldi. Nechta bo'ldi?", en: 'A class has a students and 5 more came. How many now?' },
        opts: ['a + 5', '5a', 'a − 5'],
        correct: 0,
        ok: { ru: 'Верно. Стало на 5 больше, это сложение.', uz: "To'g'ri. 5 ga ko'paydi, bu qo'shish.", en: 'Right. Five more means addition.' },
        wrong: [
          null,
          { ru: 'Это в 5 раз больше, а пришли всего пятеро.', uz: "Bu 5 marta ko'p, kelganlar esa atigi beshta.", en: 'That is five times more, but only five came.' },
          { ru: 'Учеников стало больше, а не меньше.', uz: "O'quvchilar ko'paydi, kamaymadi.", en: 'There are more students, not fewer.' },
        ],
      },
      {
        q: { ru: 'Сторона квадрата равна m. Чему равен периметр?', uz: 'Kvadrat tomoni m ga teng. Perimetr nimaga teng?', en: 'A square has side m. What is its perimeter?' },
        opts: ['4m', 'm + 4', 'm · m'],
        correct: 0,
        ok: { ru: 'Верно. Четыре одинаковые стороны, это 4 · m.', uz: "To'g'ri. To'rtta bir xil tomon, bu 4 · m.", en: 'Right. Four equal sides, that is 4 · m.' },
        wrong: [
          null,
          { ru: 'Это сторона, увеличенная на 4, а нужен обход по четырём сторонам.', uz: "Bu 4 ga oshirilgan tomon, kerak bo'lgani esa to'rt tomon bo'ylab aylanish.", en: 'That is the side raised by 4, but we need to go around four sides.' },
          { ru: 'Так считают площадь, а не периметр.', uz: 'Bunday yuza hisoblanadi, perimetr emas.', en: 'That is how area is found, not perimeter.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на запись. Различайте, где повторение, а где прибавление.',
        uz: "Yozuv mashqi. Qayerda takrorlanish, qayerda qo'shilish borligini farqlang.",
        en: 'Writing practice. Tell repetition apart from adding.',
      },
    },
  },

  s_value: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Находим значение', uz: 'Qiymatni topamiz', en: 'Finding the value' },
    lead: { ru: 'Подставь число и выполни действия.', uz: "Sonni qo'ying va amallarni bajaring.", en: 'Substitute the number and do the operations.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Найди 9k при k = 5', uz: 'k = 5 da 9k ni toping', en: 'Find 9k when k = 5' },
        opts: ['45', '14', '95'],
        correct: 0,
        ok: { ru: 'Верно. 9 · 5 = 45.', uz: "To'g'ri. 9 · 5 = 45.", en: 'Right. 9 · 5 = 45.' },
        wrong: [
          null,
          { ru: 'Это сумма, а между ними умножение.', uz: "Bu yig'indi, ular orasida esa ko'paytirish.", en: 'That is a sum, but there is multiplication between them.' },
          { ru: 'Цифры приписали друг к другу.', uz: 'Raqamlar yonma-yon yozilgan.', en: 'The digits were stuck together.' },
        ],
      },
      {
        q: { ru: 'Найди 2x + 3 при x = 6', uz: 'x = 6 da 2x + 3 ni toping', en: 'Find 2x + 3 when x = 6' },
        opts: ['15', '11', '26'],
        correct: 0,
        ok: { ru: 'Верно. 2 · 6 = 12, потом + 3.', uz: "To'g'ri. 2 · 6 = 12, keyin + 3.", en: 'Right. 2 · 6 = 12, then + 3.' },
        wrong: [
          null,
          { ru: 'Сначала умножение, потом сложение.', uz: "Avval ko'paytirish, keyin qo'shish.", en: 'Multiplication first, then addition.' },
          { ru: 'Цифры приписали друг к другу.', uz: 'Raqamlar yonma-yon yozilgan.', en: 'The digits were stuck together.' },
        ],
      },
      {
        q: { ru: 'Найди 4a при a = −3', uz: 'a = −3 da 4a ni toping', en: 'Find 4a when a = −3' },
        opts: ['−12', '12', '1'],
        correct: 0,
        ok: { ru: 'Верно. 4 · (−3) = −12, знаки разные.', uz: "To'g'ri. 4 · (−3) = −12, ishoralar har xil.", en: 'Right. 4 · (−3) = −12 with different signs.' },
        wrong: [
          null,
          { ru: 'Один множитель отрицательный, значит и произведение тоже.', uz: "Bir ko'paytuvchi manfiy, demak ko'paytma ham shunday.", en: 'One factor is negative, so is the product.' },
          { ru: 'Это сумма, а нужно произведение.', uz: "Bu yig'indi, ko'paytma kerak esa.", en: 'That is a sum, but a product is needed.' },
        ],
      },
      {
        q: { ru: 'Чем 5a отличается от a + 5?', uz: '5a va a + 5 nimasi bilan farq qiladi?', en: 'How does 5a differ from a + 5?' },
        opts: [
          { ru: '5a — в 5 раз больше, a + 5 — на 5 больше', uz: "5a — 5 marta ko'p, a + 5 — 5 ga ko'p", en: '5a is five times more, a + 5 is five more' },
          { ru: 'Ничем, это одно и то же', uz: "Hech nimasi bilan, bu bir xil", en: 'Nothing, they are the same' },
          { ru: 'Только записью, значения равны', uz: 'Faqat yozuvi bilan, qiymatlari teng', en: 'Only in writing, the values are equal' },
        ],
        correct: 0,
        ok: { ru: 'Верно. При a = 3 первое даёт 15, второе 8.', uz: "To'g'ri. a = 3 da birinchisi 15, ikkinchisi 8 beradi.", en: 'Right. At a = 3 the first gives 15, the second 8.' },
        wrong: [
          null,
          { ru: 'Подставьте тройку и сравните: 15 и 8.', uz: "Uchni qo'ying va solishtiring: 15 va 8.", en: 'Substitute three and compare: 15 and 8.' },
          { ru: 'Значения совпадают только при a = 1,25.', uz: 'Qiymatlar faqat a = 1,25 da mos keladi.', en: 'The values match only at a = 1.25.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Практика на значения. Помните про порядок действий и про знаки.',
        uz: 'Qiymatlar mashqi. Amallar tartibi va ishoralarni yodda tuting.',
        en: 'Value practice. Remember the order of operations and the signs.',
      },
    },
  },

  s_bins: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Умножить или прибавить', uz: "Ko'paytirish yoki qo'shish", en: 'Multiply or add' },
    lead: { ru: 'Слушай оборот речи: «в … раз» или «на …».', uz: "Iboraga quloq soling: «… marta» yoki «… ga».", en: 'Listen to the phrase: “times” or “more”.' },
    bin_a: { ru: 'Запись 5a', uz: '5a yozuvi', en: 'The line 5a' },
    bin_b: { ru: 'Запись a + 5', uz: 'a + 5 yozuvi', en: 'The line a + 5' },
    cards: [
      { label: { ru: 'в 5 раз больше', uz: "5 marta ko'p", en: 'five times more' }, bin: 'a' },
      { label: { ru: 'пять раз по a', uz: 'besh marta a dan', en: 'five lots of a' }, bin: 'a' },
      { label: { ru: 'пять таких же', uz: 'beshta shunday', en: 'five of the same' }, bin: 'a' },
      { label: { ru: 'на 5 больше', uz: "5 ga ko'p", en: 'five more' }, bin: 'b' },
      { label: { ru: 'пришло ещё 5', uz: 'yana 5 tasi keldi', en: 'five more arrived' }, bin: 'b' },
      { label: { ru: 'увеличили на 5', uz: '5 ga oshirildi', en: 'increased by 5' }, bin: 'b' },
    ],
    hint: {
      ru: '«В несколько раз» — умножение, «на несколько» — сложение.',
      uz: "«Necha marta» — ko'paytirish, «nechaga» — qo'shish.",
      en: '“Times” means multiplication, “more” means addition.',
    },
    correct_text: {
      ru: 'Верно. Один оборот речи меняет всё выражение.',
      uz: "To'g'ri. Bitta ibora butun ifodani o'zgartiradi.",
      en: 'Right. One phrase changes the whole expression.',
    },
    audio: {
      intro: {
        ru: 'Разложите обороты речи по двум корзинам. В несколько раз это умножение, на несколько это сложение.',
        uz: "Iboralarni ikki savatga ajrating. Necha marta bu ko'paytirish, nechaga bu qo'shish.",
        en: 'Sort the phrases into two baskets. Times means multiplication, more means addition.',
      },
      on_correct: { ru: 'Точно, все на местах.', uz: "Aniq, hammasi o'z o'rniga tushdi.", en: 'Exactly, everything is in place.' },
      on_wrong: { ru: 'Не сюда. Прислушайся к обороту.', uz: 'Bu yerga emas. Iboraga diqqat qiling.', en: 'Not here. Listen to the phrase.' },
    },
  },

  s_error: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    title: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    lead: { ru: 'Проверь чужое решение так же, как проверял бы своё.', uz: "Birovning yechimini o'zingiznikidek tekshiring.", en: 'Check someone else’s work the way you would check your own.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Азиз: «3n при n = 7 равно 37». Проверь.', uz: "Aziz: «n = 7 da 3n 37 ga teng». Tekshiring.", en: 'Aziz: “3n at n = 7 is 37.” Check it.' },
        opts: [
          { ru: 'Нет: 3 · 7 = 21', uz: "Yo'q: 3 · 7 = 21", en: 'No: 3 · 7 = 21' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 10', uz: "Yo'q, 10 bo'ladi", en: 'No, it is 10' },
        ],
        correct: 0,
        ok: { ru: 'Верно. Цифры нельзя приписывать друг к другу.', uz: "To'g'ri. Raqamlarni yonma-yon yozib bo'lmaydi.", en: 'Right. Digits must not be stuck together.' },
        wrong: [
          null,
          { ru: 'Между коэффициентом и переменной стоит умножение.', uz: "Koeffitsiyent bilan o'zgaruvchi orasida ko'paytirish turadi.", en: 'There is multiplication between the coefficient and the variable.' },
          { ru: 'Десять получилось бы при сложении.', uz: "O'n qo'shishda chiqardi.", en: 'Ten would come from addition.' },
        ],
      },
      {
        q: { ru: 'Диёра: «2x + 5 при x = 3 равно 16». Проверь.', uz: "Diyora: «x = 3 da 2x + 5 16 ga teng». Tekshiring.", en: 'Diyora: “2x + 5 at x = 3 is 16.” Check it.' },
        opts: [
          { ru: 'Нет: сначала умножение, будет 11', uz: "Yo'q: avval ko'paytirish, 11 bo'ladi", en: 'No: multiplication first, it is 11' },
          { ru: 'Да, верно', uz: "Ha, to'g'ri", en: 'Yes, correct' },
          { ru: 'Нет, будет 25', uz: "Yo'q, 25 bo'ladi", en: 'No, it is 25' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 2 · 3 = 6, потом 6 + 5 = 11.', uz: "To'g'ri. 2 · 3 = 6, keyin 6 + 5 = 11.", en: 'Right. 2 · 3 = 6, then 6 + 5 = 11.' },
        wrong: [
          null,
          { ru: 'Так вышло бы, если сложить сначала: 3 + 5 = 8, потом 2 · 8.', uz: "Avval qo'shilsa shunday chiqardi: 3 + 5 = 8, keyin 2 · 8.", en: 'That happens if you add first: 3 + 5 = 8, then 2 · 8.' },
          { ru: 'Здесь нет ни умножения на 5, ни возведения в степень.', uz: "Bu yerda na 5 ga ko'paytirish, na darajaga ko'tarish bor.", en: 'There is neither a times five nor a power here.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Проверьте чужое решение. Ошибка бывает и в записи, и в порядке действий.',
        uz: "Birovning yechimini tekshiring. Xato yozuvda ham, amallar tartibida ham bo'ladi.",
        en: 'Check someone else’s work. A mistake can be in the writing and in the order of operations.',
      },
    },
  },

  s_task: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    title: { ru: 'Сколько заплатит Диёра', uz: "Diyora qancha to'laydi", en: 'What Diyora pays' },
    lead: { ru: 'Час проката 5000 сум, залог 10 000 сум: 5000t + 10 000.', uz: "Prokatning bir soati 5000 so'm, garov 10 000 so'm: 5000t + 10 000.", en: 'An hour costs 5000 soums, the deposit is 10 000: 5000t + 10 000.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        q: { ru: 'Сколько нужно оставить за 2 часа?', uz: "2 soat uchun qancha qoldirish kerak?", en: 'How much is needed for 2 hours?' },
        opts: [
          { ru: '20 000 сум', uz: "20 000 so'm", en: '20 000 soums' },
          { ru: '10 002 сум', uz: "10 002 so'm", en: '10 002 soums' },
          { ru: '15 000 сум', uz: "15 000 so'm", en: '15 000 soums' },
        ],
        correct: 0,
        ok: { ru: 'Верно. 5000 · 2 + 10 000 = 20 000.', uz: "To'g'ri. 5000 · 2 + 10 000 = 20 000.", en: 'Right. 5000 · 2 + 10 000 = 20 000.' },
        wrong: [
          null,
          { ru: 'Часы прибавили к залогу вместо умножения на цену.', uz: "Soatlar narxga ko'paytirilmay, garovga qo'shilgan.", en: 'The hours were added to the deposit instead of multiplied by the price.' },
          { ru: 'Про залог забыли, он не зависит от часов.', uz: "Garov unutilgan, u soatlarga bog'liq emas.", en: 'The deposit was forgotten, and it does not depend on the hours.' },
        ],
      },
      {
        q: { ru: 'Диёра оставила 30 000 сум. На сколько часов взяла велосипед?', uz: "Diyora 30 000 so'm qoldirdi. Velosipedni necha soatga oldi?", en: 'Diyora left 30 000 soums. For how many hours?' },
        opts: ['4', '6', '3'],
        correct: 0,
        ok: { ru: 'Верно. 30 000 − 10 000 = 20 000, затем 20 000 : 5000 = 4.', uz: "To'g'ri. 30 000 − 10 000 = 20 000, keyin 20 000 : 5000 = 4.", en: 'Right. 30 000 − 10 000 = 20 000, then 20 000 : 5000 = 4.' },
        wrong: [
          null,
          { ru: 'Залог сначала нужно вычесть, он не оплата за часы.', uz: "Avval garovni ayirish kerak, u soatlar to'lovi emas.", en: 'Subtract the deposit first, it is not payment for hours.' },
          { ru: 'Проверь делением: 3 часа дали бы 25 000.', uz: "Bo'lish bilan tekshiring: 3 soat 25 000 berardi.", en: 'Check by dividing: 3 hours would give 25 000.' },
        ],
      },
    ],
    audio: {
      intro: {
        ru: 'Задача про прокат. Час стоит пять тысяч сум, залог десять тысяч, и вместе это пять тысяч тэ плюс десять тысяч.',
        uz: "Prokat haqida masala. Bir soat besh ming so'm, garov o'n ming, birgalikda esa bu besh ming te qo'shuv o'n ming.",
        en: 'A rental problem. An hour costs five thousand soums, the deposit is ten thousand, together five thousand t plus ten thousand.',
      },
    },
  },

  s_final: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Пять заданий на весь урок.', uz: 'Butun darsga beshta topshiriq.', en: 'Five tasks covering the whole lesson.' },
    counter: { ru: 'Задание {i} из {n}', uz: '{n} topshiriqdan {i}-si', en: 'Task {i} of {n}' },
    items: [
      {
        kind: 'num', ans: 23,
        q: { ru: 'Найди 4y + 3 при y = 5. Набери ответ.', uz: 'y = 5 da 4y + 3 ni toping. Javobni tering.', en: 'Find 4y + 3 when y = 5. Type the answer.' },
        hint: { ru: 'Сначала 4 · 5, потом прибавь 3.', uz: "Avval 4 · 5, keyin 3 ni qo'shing.", en: 'First 4 · 5, then add 3.' },
        hint_audio: { ru: 'Сначала выполните умножение четыре на пять, а потом прибавьте три.', uz: "Avval to'rt karra besh ko'paytirishni bajaring, keyin uchni qo'shing.", en: 'First multiply four by five, then add three.' },
      },
      {
        kind: 'mc', correctIndex: 2,
        q: { ru: 'Ручка стоит p сум. Сколько стоят 8 ручек?', uz: "Ruchka p so'm turadi. 8 ta ruchka qancha turadi?", en: 'A pen costs p soums. What do 8 pens cost?' },
        opts: ['p + 8', 'p − 8', '8p', 'p : 8'],
        wrong: [
          { ru: 'Это цена, увеличенная на 8 сум.', uz: "Bu 8 so'mga oshirilgan narx.", en: 'That is the price raised by 8 soums.' },
          { ru: 'Ручек стало больше, а не меньше.', uz: "Ruchkalar ko'paydi, kamaymadi.", en: 'There are more pens, not fewer.' },
          null,
          { ru: 'Так нашли бы цену одной части, а не восьми ручек.', uz: 'Bunday bitta qismning narxi topilardi, sakkiz ruchkaniki emas.', en: 'That would find the price of one part, not eight pens.' },
        ],
        correct: { ru: 'Верно. Цену повторили 8 раз.', uz: "To'g'ri. Narx 8 marta takrorlandi.", en: 'Right. The price repeats 8 times.' },
      },
      {
        kind: 'mc', correctIndex: 1,
        q: { ru: 'Чему равно 6c при c = −4?', uz: 'c = −4 da 6c nimaga teng?', en: 'What is 6c when c = −4?' },
        opts: ['24', '−24', '2', '−10'],
        wrong: [
          { ru: 'Знаки множителей разные, значит минус.', uz: "Ko'paytuvchilar ishorasi har xil, demak minus.", en: 'The factors have different signs, so minus.' },
          null,
          { ru: 'Это разность, а нужно произведение.', uz: "Bu ayirma, ko'paytma kerak esa.", en: 'That is a difference, but a product is needed.' },
          { ru: 'Это сумма, а нужно произведение.', uz: "Bu yig'indi, ko'paytma kerak esa.", en: 'That is a sum, but a product is needed.' },
        ],
        correct: { ru: 'Верно. 6 · (−4) = −24.', uz: "To'g'ri. 6 · (−4) = −24.", en: 'Right. 6 · (−4) = −24.' },
      },
      {
        kind: 'mc', correctIndex: 3,
        q: { ru: 'Что называют коэффициентом?', uz: 'Koeffitsiyent deb nimaga aytiladi?', en: 'What is a coefficient?' },
        opts: [
          { ru: 'любую букву выражения', uz: 'ifodaning istalgan harfini', en: 'any letter in the expression' },
          { ru: 'значение выражения', uz: 'ifoda qiymatini', en: 'the value of the expression' },
          { ru: 'слагаемое без буквы', uz: "harfsiz qo'shiluvchini", en: 'the addend without a letter' },
          { ru: 'число перед буквой', uz: 'harf oldidagi sonni', en: 'the number before the letter' },
        ],
        wrong: [
          { ru: 'Буква — это переменная.', uz: "Harf bu o'zgaruvchi.", en: 'The letter is the variable.' },
          { ru: 'Значение получается после подстановки.', uz: "Qiymat qo'yishdan keyin chiqadi.", en: 'The value appears after substitution.' },
          { ru: 'В записи 5000t + 10 000 это 10 000, а коэффициент 5000.', uz: '5000t + 10 000 yozuvida bu 10 000, koeffitsiyent esa 5000.', en: 'In 5000t + 10 000 that is 10 000, while the coefficient is 5000.' },
          null,
        ],
        correct: { ru: 'Верно. В записи 5000t коэффициент равен 5000.', uz: "To'g'ri. 5000t yozuvida koeffitsiyent 5000 ga teng.", en: 'Right. In 5000t the coefficient is 5000.' },
      },
      {
        kind: 'mc', correctIndex: 0,
        q: { ru: 'Прокат: 5000t + 10 000. Сколько за 5 часов?', uz: "Prokat: 5000t + 10 000. 5 soat uchun qancha?", en: 'Rental: 5000t + 10 000. How much for 5 hours?' },
        opts: [
          { ru: '35 000 сум', uz: "35 000 so'm", en: '35 000 soums' },
          { ru: '25 000 сум', uz: "25 000 so'm", en: '25 000 soums' },
          { ru: '15 000 сум', uz: "15 000 so'm", en: '15 000 soums' },
          { ru: '10 005 сум', uz: "10 005 so'm", en: '10 005 soums' },
        ],
        wrong: [
          null,
          { ru: 'Про залог забыли.', uz: 'Garov unutilgan.', en: 'The deposit was forgotten.' },
          { ru: 'Это плата за 3 часа без залога.', uz: "Bu garovsiz 3 soat to'lovi.", en: 'That is the fee for 3 hours without the deposit.' },
          { ru: 'Часы прибавили вместо умножения.', uz: "Soatlar ko'paytirilmay qo'shilgan.", en: 'The hours were added instead of multiplied.' },
        ],
        correct: { ru: 'Верно. 5000 · 5 + 10 000 = 35 000.', uz: "To'g'ri. 5000 · 5 + 10 000 = 35 000.", en: 'Right. 5000 · 5 + 10 000 = 35 000.' },
      },
    ],
    audio: {
      intro: {
        ru: 'Финальная проверка. Пять заданий на весь урок. Первое с набором числа, остальные с выбором.',
        uz: 'Yakuniy tekshiruv. Butun darsga beshta topshiriq. Birinchisida son teriladi, qolganlarida tanlanadi.',
        en: 'The final check. Five tasks covering the whole lesson. The first needs a typed number, the rest are multiple choice.',
      },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Right.' },
      on_wrong: { ru: 'Посмотри разбор.', uz: 'Tushuntirishga qarang.', en: 'Look at the explanation.' },
    },
    fact: {
      ru: 'До XVI века задачи писали словами, и каждая была отдельным случаем: правило для одной задачи не годилось для другой. Франсуа Виет первым стал обозначать буквами не только неизвестное, но и известные величины. С этого и началась привычка писать одну формулу вместо сотни примеров.',
      uz: "XVI asrgacha masalalar so'z bilan yozilardi va har biri alohida hol edi: bitta masala qoidasi boshqasiga yaramasdi. Fransua Viyet birinchi bo'lib nafaqat noma'lumni, balki ma'lum kattaliklarni ham harf bilan belgilay boshladi. Yuzta misol o'rniga bitta formula yozish odati shundan boshlangan.",
      en: 'Before the sixteenth century problems were written in words and each was its own case: a rule for one did not fit another. François Viète was the first to use letters not only for the unknown but for known quantities too. That is where writing one formula instead of a hundred examples began.',
    },
    fact_audio: {
      ru: 'Знаешь ли ты? До шестнадцатого века задачи писали словами, и каждая была отдельным случаем: правило для одной задачи не годилось для другой. Франсуа Виет первым стал обозначать буквами не только неизвестное, но и известные величины. С этого и началась привычка писать одну формулу вместо сотни примеров.',
      uz: "Bilasizmi? O'n oltinchi asrgacha masalalar so'z bilan yozilardi va har biri alohida hol edi: bitta masala qoidasi boshqasiga yaramasdi. Fransua Viyet birinchi bo'lib nafaqat noma'lumni, balki ma'lum kattaliklarni ham harf bilan belgilay boshladi. Yuzta misol o'rniga bitta formula yozish odati shundan boshlangan.",
      en: 'Did you know? Before the sixteenth century problems were written in words and each was its own case: a rule for one did not fit another. François Viète was the first to use letters not only for the unknown but for known quantities too. That is where writing one formula instead of a hundred examples began.',
    },
  },

  s14: {
    eyebrow: { ru: 'Урок пройден', uz: "Dars o'tildi", en: 'Lesson finished' },
    banner: { ru: 'Математика · Выражения', uz: 'Matematika · Ifodalar', en: 'Mathematics · Expressions' },
    heading: { ru: 'Буквенные выражения', uz: 'Harfli ifodalar', en: 'Letter expressions' },
    main_label: { ru: 'Главное', uz: 'Asosiysi', en: 'The main thing' },
    brief_1: { ru: 'буква стоит на месте меняющегося числа', uz: "harf o'zgaruvchi sonning o'rnida turadi", en: 'the letter stands for a changing number' },
    brief_2: { ru: 'число перед буквой — коэффициент', uz: 'harf oldidagi son — koeffitsiyent', en: 'the number before it is the coefficient' },
    brief_3: { ru: 'значение находят подстановкой', uz: "qiymat qo'yish bilan topiladi", en: 'the value comes from substitution' },
    memo_title: { ru: 'Что помнить', uz: 'Nimani eslash kerak', en: 'What to remember' },
    memo_q1: { ru: 'Запись 5a', uz: '5a yozuvi', en: 'The line 5a' },
    memo_a1: { ru: 'это 5 · a', uz: 'bu 5 · a', en: 'means 5 · a' },
    memo_q2: { ru: 'Отрицательное число', uz: 'Manfiy son', en: 'A negative number' },
    memo_a2: { ru: 'подставляют в скобках', uz: "qavs ichida qo'yiladi", en: 'is substituted in brackets' },
    memo_q3: { ru: 'Частая ошибка', uz: 'Tez-tez uchraydigan xato', en: 'A common mistake' },
    memo_a3: { ru: 'приписать цифру к числу', uz: 'raqamni songa yonma-yon yozish', en: 'sticking the digits together' },
    audio: {
      ru: [
        'Урок пройден. Соберём главное.',
        'В буквенном выражении буква стоит на месте числа, которое меняется. Число перед буквой это коэффициент, знак умножения между ними не пишут. Значение находят подстановкой, а отрицательное число берут в скобки.',
        'Прокат: стоимость пять тысяч тэ, и при трёх часах это пятнадцать тысяч сум.',
      ],
      uz: [
        "Dars o'tildi. Asosiysini yig'amiz.",
        "Harfli ifodada harf o'zgaradigan sonning o'rnida turadi. Harf oldidagi son koeffitsiyent, ular orasidagi ko'paytirish belgisi yozilmaydi. Qiymat qo'yish bilan topiladi, manfiy son esa qavsga olinadi.",
        "Prokat: narx besh ming te, uch soatda esa bu o'n besh ming so'm.",
      ],
      en: [
        'The lesson is done. Let us gather the main points.',
        'In a letter expression the letter stands where a changing number was. The number before it is the coefficient, and the times sign is not written. The value comes from substitution, and a negative number goes in brackets.',
        'The rental: the cost is five thousand t, and for three hours that is fifteen thousand soums.',
      ],
    },
  },

  s_methods: {
    m1_title: { ru: 'Способ. Подстановка', uz: "Usul. Qo'yish", en: 'Method. Substitution' },
    m1_steps: {
      ru: ['Найди в выражении букву', 'Поставь вместо неё число, отрицательное — в скобках', 'Выполни действия по порядку'],
      uz: ['Ifodadagi harfni toping', "Uning o'rniga sonni qo'ying, manfiysini qavs ichida", 'Amallarni tartib bilan bajaring'],
      en: ['Find the letter in the expression', 'Put a number in its place, a negative one in brackets', 'Do the operations in order'],
    },
    m1_no: {
      ru: 'Между числом и буквой всегда умножение, даже если знак не написан.',
      uz: "Son bilan harf orasida doim ko'paytirish bo'ladi, belgi yozilmagan bo'lsa ham.",
      en: 'There is always multiplication between a number and a letter, even with no sign.',
    },
  },
};

// ============================================================
// СЦЕНЫ УРОКА: прокат велосипедов у школьных ворот.
// ============================================================
const HookScene = () => (
  <svg className="hk-bg" viewBox="0 0 400 154" aria-hidden="true">
    <defs>
      <linearGradient id="d31sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EAF4F9"/><stop offset="100%" stopColor="#F9F4EB"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="400" height="154" fill="url(#d31sky)"/>

    {/* Школьная ограда и ворота */}
    <g opacity="0.9">
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={12 + i * 13} y="46" width="4" height="52" rx="2" fill="#B4A48C"/>
      ))}
      <rect x="8" y="44" width="120" height="4" rx="2" fill="#B4A48C"/>
    </g>
    <path d="M0 98 h400" stroke="#C9A472" strokeWidth="2"/>
    <rect x="0" y="100" width="400" height="54" fill="#D2A96F"/>

    {/* Дерево у ворот */}
    <rect x="140" y="62" width="7" height="36" fill="#8B6A45"/>
    <circle cx="143" cy="54" r="18" fill="#8FBF7F"/>
    <circle cx="130" cy="62" r="12" fill="#6FA463"/>

    {/* Табличка проката */}
    <g>
      <rect x="176" y="26" width="94" height="42" rx="6" fill="#FFFDF7" stroke="#C9A472" strokeWidth="2.4"/>
      <text x="223" y="44" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fontWeight="700">1 soat</text>
      <text x="223" y="60" textAnchor="middle" fill="#D9603F"
        fontFamily="'JetBrains Mono', monospace" fontSize="16" fontWeight="700">5000</text>
      <rect x="220" y="68" width="5" height="30" fill="#B08A55"/>
    </g>

    {/* Велосипед: колёса крутятся, он готов к выдаче */}
    <g>
      <circle className="d31-wheel" cx="308" cy="118" r="17" fill="none" stroke="#3B3730" strokeWidth="3"/>
      <circle className="d31-wheel" cx="360" cy="118" r="17" fill="none" stroke="#3B3730" strokeWidth="3"/>
      <path d="M308 118 L330 100 L360 118 M330 100 L322 118 M330 100 L344 96"
        fill="none" stroke="#019ACB" strokeWidth="3" strokeLinecap="round"/>
      <path d="M344 96 h10" stroke="#3B3730" strokeWidth="3" strokeLinecap="round"/>
      <rect x="318" y="94" width="14" height="4" rx="2" fill="#3B3730"/>
    </g>

    {/* Двое у проката, у одного в руках блокнот */}
    <Person x={70} ground={118} head={13} shirt="#7ECBE6" hair="#3E3128"/>
    <Person x={112} ground={118} head={13} shirt="#F5C77E" hair="#5A4636"/>
    <g className="d31-pad">
      <rect x="-16" y="-12" width="32" height="24" rx="3" fill="#FFFDF7" stroke="#C9A472" strokeWidth="1.6"/>
      <path d="M-9 -4 h18 M-9 2 h12" stroke="#B4A48C" strokeWidth="1.6" strokeLinecap="round"/>
    </g>
  </svg>
);

// Итог: одна запись вместо столбика примеров.
const FinalScene = () => {
  const lang = useLang();
  return (
    <svg className="fin-bg" viewBox="0 0 400 92" aria-hidden="true">
      <rect x="0" y="0" width="400" height="92" fill="#F9F4EB"/>
      {['5000 · 2', '5000 · 3', '5000 · 4'].map((s, i) => (
        <g key={s} className="d31-fade-row">
          <rect x="20" y={12 + i * 24} width="120" height="20" rx="5" fill="#F4F1EA" stroke="#E9E3D9"/>
          <text x="80" y={26 + i * 24} textAnchor="middle" fill="#8A8883"
            fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700">{s}</text>
        </g>
      ))}
      <path d="M156 46 h34" stroke="#8E8578" strokeWidth="2.4" markerEnd="url(#d31fin)"/>
      <defs>
        <marker id="d31fin" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 z" fill="#8E8578"/>
        </marker>
      </defs>
      <rect x="206" y="26" width="164" height="40" rx="8" fill="#E3F0E8" stroke="#A9CFBA" strokeWidth="2"/>
      <text x="288" y="52" textAnchor="middle" fill="#1F7A4D"
        fontFamily="'JetBrains Mono', monospace" fontSize="19" fontWeight="700">5000 · t</text>
      <text x="288" y="82" textAnchor="middle" fill="#8A8883"
        fontFamily="'Manrope', system-ui, sans-serif" fontSize="11" fontWeight="700">
        {tri(lang, 'одна запись на все случаи', 'barcha hollarga bitta yozuv', 'one line for every case')}
      </text>
    </svg>
  );
};

// ============================================================
// БЛОКИ ЭКРАНОВ
// ============================================================
// Прибор урока: столбик подстановок, где повторяющееся число видно глазом.
const SubTable = ({ rows, shown, unitLabel }) => {
  const lang = useLang();
  return (
    <span className="d31-table">
      <span className="d31-thead">
        <i>{unitLabel}</i>
        <i>{tri(lang, 'считаем', 'hisoblaymiz', 'compute')}</i>
        <i>{tri(lang, 'сум', "so'm", 'soums')}</i>
      </span>
      {rows.map((r, i) => (
        <span key={r.t} className={'d31-trow d31-fade' + (i <= shown ? ' d31-on' : '') + (r.t === 't' ? ' d31-trow-hot' : '')}>
          <i className="d31-tt">{r.t}</i>
          <i className="d31-tc">{r.calc}</i>
          <i className="d31-tr">{r.res}</i>
        </span>
      ))}
    </span>
  );
};

// Разбор записи: коэффициент и переменная подписаны.
const Term = ({ coef, vari, labelCoef, labelVar, on }) => (
  <span className="d31-term">
    <span className="d31-term-row">
      <i className="d31-coef">{coef}</i>
      <i className="d31-var">{vari}</i>
    </span>
    <span className={'d31-term-row d31-term-labels d31-fade' + (on ? ' d31-on' : '')}>
      <i className="d31-lab d31-lab-coef">{labelCoef}</i>
      <i className="d31-lab d31-lab-var">{labelVar}</i>
    </span>
  </span>
);

const Line = ({ node, on }) => (
  <span className={'d31-line d31-fade' + (on ? ' d31-on' : '')}>{mt(node)}</span>
);

const RecallBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_recall;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d31-stage">
        <span className="d31-expr">5000 · 3 = 15 000</span>
        <span className={'d31-chips d31-fade' + (step >= 1 ? ' d31-on' : '')}>
          <i className="d31-chip-l">{tri(lang, 'числовое выражение', 'sonli ifoda', 'numeric expression')}</i>
          <i className="d31-chip-g">{tri(lang, 'его значение', 'uning qiymati', 'its value')}</i>
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Ядро: столбик подстановок и буква на месте меняющегося числа.
const CoreBody = ({ step }) => {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s_core;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d31-stage d31-stage-row">
        <SubTable rows={c.rows} shown={step >= 1 ? 3 : 2}
          unitLabel={tri(lang, 'часы', 'soat', 'hours')}/>
        <span className="d31-col">
          {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Формула из двух частей и периметр квадрата.
const FormBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_form;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d31-stage">
        <span className="d31-sum-row">
          <i className="d31-part d31-part-var">5000t</i>
          <b>+</b>
          <i className={'d31-part d31-part-fix d31-fade' + (step >= 1 ? ' d31-on' : '')}>10 000</i>
        </span>
        {c.lines.map((l, i) => <Line key={i} node={t(l)} on={step >= i}/>)}
        <span className={'d31-peri d31-fade' + (step >= 2 ? ' d31-on' : '')}>
          <svg viewBox="0 0 120 66" aria-hidden="true">
            <rect x="34" y="10" width="46" height="46" rx="3" fill="#E7F5FA" stroke="#019ACB" strokeWidth="2.4"/>
            <text x="57" y="8" textAnchor="middle" fill="#019ACB"
              fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="700">a</text>
          </svg>
          <i>{mt(t(c.peri))}</i>
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

const SolveBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_solve;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink3 }}>{mt(t(c.lead))}</p>
      <div className="frame fade-up delay-1 d31-stage">
        <span className="d31-expr">3x + 7</span>
        {c.steps.map((s, i) => <Line key={i} node={t(s)} on={step >= i}/>)}
      </div>
      {step >= 2 && (
        <div className="frame-success fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// Граница: буква рядом с числом означает умножение.
const EdgeBody = ({ step }) => {
  const t = useT();
  const c = CONTENT.s_edge;
  return (
    <div className="rv-col">
      <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
      <div className="frame fade-up delay-1 d31-stage">
        <span className="d31-pair d31-pair-bad"><Line node={t(c.bad_line)} on/></span>
        <span className={'d31-pair d31-pair-good d31-fade' + (step >= 1 ? ' d31-on' : '')}>
          <Line node={t(c.good_line)} on/>
        </span>
        <span className={'d31-pair d31-pair-warn d31-fade' + (step >= 2 ? ' d31-on' : '')}>
          <Line node={t(c.warn_line)} on/>
        </span>
      </div>
      {step >= 2 && (
        <div className="frame-tip fade-up">
          <p className="body" style={{ margin: 0 }}>{t(c.done)}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================
// ЭКРАН 4 — «сначала показали, потом сам»
// ============================================================
const ToolScreen = ({ screen, totalScreens, onNext, onPrev, onAnswer, storedAnswer }) => {
  const c = CONTENT.s_tool;
  const t = useT();
  const lang = useLang();
  const audio = useAudio([{ id: 's_tool_intro', text: pickL(c.audio.intro, lang), trigger: 'on_mount', waits_for: null }]);
  const [phase, setPhase] = useState(storedAnswer ? 'play' : 'demo');
  const [shown, setShown] = useState(0);
  const [picked, setPicked] = useState(null);
  const firstTryRef = useRef(true);
  const timersRef = useRef([]);
  const solved = picked === c.play_correct;
  const done = shown >= 2;

  const say = (node, id) => {
    if (audio.muted || !node) return;
    const e = getAudioEngine();
    if (e) e.pushOneOff(pickL(node, lang), undefined, id);
  };

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (phase !== 'demo' || done) return undefined;
    timersRef.current.push(setTimeout(() => setShown((v) => v + 1), 1400));
    if (shown === 1) timersRef.current.push(setTimeout(() => say(c.audio.demo, 's_tool_demo'), 1600));
    return () => timersRef.current.forEach(clearTimeout);
    /* eslint-disable-next-line */
  }, [phase, shown, done]);

  const toPlay = () => { setPhase('play'); setPicked(null); say(c.audio.play, 's_tool_play'); };

  const answer = (i) => {
    if (solved) return;
    setPicked(i);
    if (i !== c.play_correct) { firstTryRef.current = false; say(c.audio.wrong, 's_tool_wrong'); return; }
    say(c.audio.ok, 's_tool_ok');
    if (onAnswer) {
      onAnswer({
        stage: null, screenIdx: screen, question: pickL(c.play_ask, lang),
        correctAnswer: c.play_opts[c.play_correct], studentAnswer: c.play_opts[i],
        correct: firstTryRef.current, firstTry: firstTryRef.current, solved: true,
      });
    }
  };

  const navContent = (
    <>
      <NavBack onPrev={onPrev} label={<BackLabel/>}/>
      <NavNext disabled={navLocked(!solved || !audio.canAdvance)} label={<NextLabel/>} onClick={onNext}/>
    </>
  );

  return (
    <Stage eyebrow={c.eyebrow} screen={screen} totalScreens={totalScreens} navContent={navContent} audioState={audio}>
      <div className="rv-col">
        <h2 className="title h-sub fade-up" style={{ margin: 0 }}>{t(c.title)}</h2>
        <div className={'d31-banner fade-up delay-1' + (phase === 'play' ? ' d31-banner-play' : '')}>
          {t(phase === 'demo' ? c.demo_banner : c.play_banner)}
        </div>

        <div className="frame fade-up delay-1 d31-stage d31-stage-tool">
          {phase === 'demo' ? (
            <>
              <Term coef="5000" vari="t" labelCoef={t(c.label_coef)} labelVar={t(c.label_var)} on={shown >= 0}/>
              {c.demo_lines.map((l, i) => <Line key={i} node={t(l)} on={shown >= i}/>)}
              <p className={'body d31-verdict' + (done ? ' d31-verdict-on' : '')}>{done ? t(c.demo_note) : ''}</p>
            </>
          ) : (
            <>
              <p className="body" style={{ margin: '0 0 10px', fontWeight: 600 }}>{mt(t(c.play_ask))}</p>
              <div className="sv-opts">
                {c.play_opts.map((o, i) => (
                  <button key={o} className={'option'
                    + (solved && i === c.play_correct ? ' option-correct' : '')
                    + (!solved && picked === i ? ' option-picked-wrong' : '')}
                  disabled={solved} onClick={() => answer(i)}>{o}</button>
                ))}
              </div>
              {picked !== null && !solved && <HintBlock show>{mt(t(c.play_wrong[picked] || c.play_ok))}</HintBlock>}
              {solved && (
                <FeedbackBlock show isCorrect>
                  <p className="body" style={{ margin: 0 }}>{mt(t(c.play_ok))}</p>
                </FeedbackBlock>
              )}
            </>
          )}
        </div>

        {phase === 'demo' && (
          <div className="d31-acts fade-up">
            <button className="d31-btn" disabled={!done} onClick={() => setShown(0)}>{t(c.again)}</button>
            <button className="d31-btn d31-btn-go" disabled={!done} onClick={toPlay}>{t(c.to_play)}</button>
          </div>
        )}

        <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps}
          note={CONTENT.s_methods.m1_no} active={phase === 'play' ? 3 : shown}/>
      </div>
    </Stage>
  );
};

// ============================================================
// ОБЁРТКИ ЭКРАНОВ
// ============================================================
const ScreenHook = (props) => (
  <HookScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_hook} sceneNode={<HookScene/>}/>
);
const ScreenRecall = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_recall} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <RecallBody step={step}/>}/>
);
const ScreenCore = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_core} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <CoreBody step={step}/>}/>
);
const ScreenTool = (props) => <ToolScreen {...props} totalScreens={TOTAL_SCREENS}/>;
const ScreenForm = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_form} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <FormBody step={step}/>}/>
);
const ScreenSolve = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_solve} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <SolveBody step={step}/>}/>
);
const ScreenEdge = (props) => (
  <RevealScreen {...props} screenContent={CONTENT.s_edge} totalScreens={TOTAL_SCREENS}
    renderStep={({ step }) => <EdgeBody step={step}/>}/>
);
const ScreenRule = (props) => {
  const t = useT();
  return (
    <RuleScreen {...props} screenContent={CONTENT.s_rule} totalScreens={TOTAL_SCREENS}
      exampleNode={(
        <div className="d31-stage">
          <Term coef="5000" vari="t" labelCoef={t(CONTENT.s_tool.label_coef)}
            labelVar={t(CONTENT.s_tool.label_var)} on/>
        </div>
      )}/>
  );
};

const methodAside = (
  <MethodCard title={CONTENT.s_methods.m1_title} steps={CONTENT.s_methods.m1_steps} note={CONTENT.s_methods.m1_no}/>
);

const ScreenWrite = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_write} asideNode={methodAside}/>
);
const ScreenValue = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_value} asideNode={methodAside}/>
);
const ScreenBins = (props) => (
  <Classify {...props} screenContent={CONTENT.s_bins} totalScreens={TOTAL_SCREENS}/>
);
const ScreenError = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_error}/>
);

// Задача: формула проката целиком на виду.
const TaskFig = () => (
  <div className="d31-task-fig">
    <span className="d31-sum-row">
      <i className="d31-part d31-part-var">5000t</i>
      <b>+</b>
      <i className="d31-part d31-part-fix">10 000</i>
    </span>
  </div>
);

const ScreenTask = (props) => (
  <MultiTask {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_task}
    figureNode={() => <TaskFig/>}/>
);

const ScreenFinal = (props) => (
  <FinalPanel {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s_final}
    factNode={<FactCard badge={FB_HIST} anim={<AnimDigits/>} text={CONTENT.s_final.fact}/>}/>
);

const SummaryCards = () => {
  const t = useT();
  const c = CONTENT.s14;
  return (
    <div className="frame sm-card">
      <p className="sm-card-h">{t(c.memo_title)}</p>
      <div className="mm-grid">
        {[[c.memo_q1, c.memo_a1], [c.memo_q2, c.memo_a2], [c.memo_q3, c.memo_a3]].map((row, i) => (
          <span className="mm-row" key={i}>
            <span className="mm-q">{t(row[0])}</span>
            <span className="mm-a">{t(row[1])}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const Screen14 = (props) => (
  <SummaryScreen {...props} totalScreens={TOTAL_SCREENS} content={CONTENT.s14}
    sceneNode={<FinalScene/>} cards={<SummaryCards/>}/>
);

// ============================================================
// CSS УРОКА
// ============================================================
const LESSON_STYLES = `
.d31-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(9px, 1.7vw, 14px); padding: clamp(12px, 2.4vw, 18px) !important; }
.d31-stage-tool { gap: clamp(4px, 0.8vw, 7px) !important; padding: clamp(7px, 1.5vw, 11px) !important; }
.d31-stage-tool .d31-line { font-size: clamp(12px, 2vw, 16px); }
.d31-stage-row { flex-direction: row; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 24px); flex-wrap: wrap; }
.d31-col { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.1vw, 9px); flex: 1 1 190px; min-width: 0; }

.d31-fade { opacity: 0; transition: opacity 420ms linear; }
.d31-on { opacity: 1; }
.d31-line { font-family: 'JetBrains Mono', monospace; font-size: clamp(12px, 2.3vw, 17px); font-weight: 700; color: #494550; text-align: center; }
.d31-expr { font-family: 'JetBrains Mono', monospace; font-size: clamp(18px, 3.4vw, 28px); font-weight: 700; color: #494550; }

/* Столбик подстановок */
.d31-table { display: flex; flex-direction: column; gap: 4px; flex: 0 1 280px; }
.d31-thead, .d31-trow { display: grid; grid-template-columns: clamp(38px, 7vw, 52px) 1fr clamp(56px, 11vw, 78px); align-items: center; gap: 8px; }
.d31-thead i { font-style: normal; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(10px, 1.8vw, 12px); font-weight: 700; color: #8A8883; text-align: center; }
.d31-trow { padding: clamp(4px, 0.9vw, 7px) clamp(6px, 1.3vw, 10px); border-radius: 10px; background: #F4F1EA; border: 1px solid #E9E3D9; }
.d31-trow-hot { background: #E3F0E8; border-color: #A9CFBA; }
.d31-trow i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-weight: 700; text-align: center; }
.d31-tt { font-size: clamp(13px, 2.4vw, 18px); color: #019ACB; }
.d31-tc { font-size: clamp(12px, 2.1vw, 16px); color: #8A8883; }
.d31-tr { font-size: clamp(12px, 2.2vw, 17px); color: #494550; }
.d31-trow-hot .d31-tr { color: #1F7A4D; }

/* Разбор записи */
.d31-term { display: inline-flex; flex-direction: column; align-items: center; gap: 4px; }
.d31-term-row { display: inline-grid; grid-template-columns: auto auto; gap: clamp(6px, 1.4vw, 12px); align-items: end; justify-items: center; }
.d31-coef { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: clamp(22px, 4.4vw, 36px); font-weight: 700; color: #D9603F; }
.d31-var { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: clamp(22px, 4.4vw, 36px); font-weight: 700; color: #019ACB; }
.d31-lab { font-style: normal; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(10px, 1.8vw, 13px); font-weight: 700; padding: 3px 9px; border-radius: 9px; }
.d31-lab-coef { background: #FFF1EC; border: 1px solid #F3C4B4; color: #D9603F; }
.d31-lab-var { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }

/* Формула из двух частей */
.d31-sum-row { display: inline-flex; align-items: center; gap: clamp(6px, 1.4vw, 12px); flex-wrap: wrap; justify-content: center; }
.d31-sum-row b { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 24px); color: #8A8883; }
.d31-part { font-style: normal; padding: 6px 14px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3vw, 24px); font-weight: 700; }
.d31-part-var { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d31-part-fix { background: #FBF3D6; border: 1px solid #E4CE93; color: #8A6A22; }

/* Периметр квадрата */
.d31-peri { display: inline-flex; align-items: center; gap: clamp(8px, 1.7vw, 14px); }
.d31-peri svg { width: clamp(64px, 12vw, 92px); height: auto; display: block; }
.d31-peri i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px, 2.4vw, 18px); font-weight: 700; color: #494550; }

/* Подписи */
.d31-chips { display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.d31-chips i { font-style: normal; padding: 5px 12px; border-radius: 10px; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(12px, 2.1vw, 15px); font-weight: 700; }
.d31-chip-l { background: #E7F5FA; border: 1px solid #B6DCEA; color: #019ACB; }
.d31-chip-g { background: #E3F0E8; border: 1px solid #A9CFBA; color: #1F7A4D; }

/* Строки экрана границы */
.d31-pair { width: 100%; padding: clamp(5px, 1.2vw, 9px); border-radius: 12px; text-align: center; }
.d31-pair-bad { background: #FFF1EC; border: 1px solid #F3C4B4; }
.d31-pair-good { background: #E3F0E8; border: 1px solid #A9CFBA; }
.d31-pair-warn { background: #FBF3D6; border: 1px solid #E4CE93; }

/* Задача */
.d31-task-fig { display: flex; justify-content: center; width: 100%; }

/* Экран 4 */
.d31-banner { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; font-size: clamp(13px, 2.2vw, 16px); font-weight: 700; color: #494550; background: #FBF3D6; border-radius: 12px; padding: 4px 11px; }
.d31-banner-play { color: #1F7A4D; background: #E3F0E8; }
.d31-verdict { margin: 0; min-height: 0; opacity: 0; transition: opacity 420ms linear; text-align: center; }
.d31-verdict-on { opacity: 1; }
.d31-acts { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.d31-btn { height: 36px; padding: 0 18px; border-radius: 12px; border: 1px solid #E9E3D9; background: #FFFFFF; color: #494550; font-family: 'Manrope', system-ui, sans-serif; font-size: clamp(14px, 2.2vw, 16px); font-weight: 600; cursor: pointer; transition: background-color 180ms linear, color 180ms linear; }
.d31-btn:disabled { opacity: 0.45; cursor: default; }
.d31-btn-go { border-color: #FF4F28; color: #FF4F28; }
.d31-btn-go:hover:not(:disabled) { background: #FFE8E1; }

/* Движение сцены: колёса крутятся, блокнот покачивается в руках */
.d31-wheel { animation: d31Wheel 2400ms linear infinite; transform-origin: center; transform-box: fill-box; }
@keyframes d31Wheel { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.d31-pad { animation: d31Pad 3800ms ease-in-out infinite; }
@keyframes d31Pad { 0%, 100% { transform: translate(96px, 104px) rotate(-5deg); } 50% { transform: translate(96px, 100px) rotate(4deg); } }
@media (prefers-reduced-motion: reduce) { .d31-wheel { animation: none; } .d31-pad { animation: none; transform: translate(96px, 102px); } }
`;

const STYLES = BASE_STYLES + LESSON_STYLES;

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ
// ============================================================
export default function LetterExprLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('uz');
  const lang = langProp || previewLang;
  const safeName = studentName || tri(lang, 'Ученик', "O'quvchi", 'Student');
  configureLesson({
    ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '',
    aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'm',
    navLock: false,
  });

  const [current, setCurrent] = useState(Math.min(PREVIEW_START, TOTAL_SCREENS - 1));
  const [answers, setAnswers] = useState([]);

  const screens = [ScreenHook, ScreenRecall, ScreenCore, ScreenTool, ScreenForm, ScreenSolve, ScreenEdge,
    ScreenRule, ScreenWrite, ScreenValue, ScreenBins, ScreenError, ScreenTask, ScreenFinal, Screen14];
  const CurrentScreen = screens[current];

  const finishLesson = () => {
    if (!onFinished) return;
    onFinished({
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      totalQuestions: null, correctAnswers: null, scorePercent: null,
      finalScore: null, finalTotal: null, passed: null,
      answers: answers.filter(Boolean),
    });
  };

  return (
    <LangContext.Provider value={lang}>
      <div className="lesson-root">
        <style>{STYLES}</style>
        {isPreview && (
          <div className="g6-lang-switch">
            {['ru', 'uz', 'en'].map((l) => (
              <button key={l} className={'btn-ghost' + (l === lang ? ' is-on' : '')}
                onClick={() => setPreviewLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        )}
        <CurrentScreen
          screen={current}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          onAnswer={(data) => setAnswers((prev) => { const next = [...prev]; next[current] = data; return next; })}
          onNext={() => setCurrent((v) => Math.min(v + 1, TOTAL_SCREENS - 1))}
          onPrev={() => setCurrent((v) => Math.max(v - 1, 0))}
          onReset={() => { setAnswers([]); setCurrent(0); }}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
